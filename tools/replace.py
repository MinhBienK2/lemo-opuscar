"""Replace a snippet in a file, exactly once, and write the whole file atomically.

    python3 tools/replace.py <file> <old-snippet-file> <new-snippet-file> [--count N]
    python3 tools/replace.py <file> --batch <edits.json>
    python3 tools/replace.py <file> --batch -            # the edits arrive on stdin
    python3 tools/replace.py --batch -                   # every edit names its own file

The rule R1 exists because a shell write can truncate a file before it fails, and leaves no record of what was
intended. This is the sanctioned way to script an edit when the snippet is too long for an exact-match edit tool:

  - it counts the matches and refuses to write unless there are exactly N of them (N = 1 by default) — the most
    common way a scripted edit goes wrong is a snippet that occurs twice, and one of the two is not the one meant;
  - it writes to a temporary file in the same folder and renames it over the target, so the target is never
    half-written: a reader sees the old file or the new file, never a truncated one;
  - when it refuses, it prints where the matches are (line numbers and the line itself), so the next attempt
    uses a snippet that is unique.

**--batch** is for the other common case: a big file that needs *many* small edits. The edits live in a JSON
file — a list of `{"old": "...", "new": "...", "count": 1}` — and every one of them must match exactly the
count it says, or **nothing is written at all**. A session that needs twenty edits in a 67 kB file should not
write its own python script to do it: a script it wrote itself is the thing R1 exists to prevent, and it leaves
no record of what it changed. This way the edits are a file, the count is checked, and the write is atomic.

    python3 tools/replace.py LOOK.md --batch edits.json

Two forms make it one command instead of two, because the round trip through a JSON file is the reason a
session ends up writing its own script instead of using this one:

  - `--batch -` reads the edits from stdin, so the whole edit is one command and nothing is left on disk;
  - an edit may name its own `"file"`, so one call can edit several files — the file then need not be given
    on the command line at all:

    python3 tools/replace.py --batch - <<'JSON'
    [{"file": "src/film.js", "old": "...", "new": "..."},
     {"file": "src/props.js", "old": "...", "new": "..."}]
    JSON

    Every edit is checked before any file is written: one snippet that does not match means no file is touched.

The snippets are files, so the agent writes them with a file-editing tool (which is what R1 asks for) and this
script does the replacement itself.

Exit code: 0 the file was rewritten; 1 nothing was written (no match, or more than one, or the file is missing).
"""
import argparse
import json
import os
import sys
import tempfile


def read(path):
    with open(path, encoding='utf8') as f:
        return f.read()


def where(text, needle):
    """the line numbers (1-based) where the needle sits"""
    return [i + 1 for i, line in enumerate(text.splitlines()) if needle.strip() and needle.strip() in line]


def write_atomic(path, body):
    """write the whole file next to the target, then rename it over: the target is never half-written"""
    # A symlink is not the file. Renaming a regular file over a link destroys the link and leaves a copy
    # where the repository expects a pointer — the edit "lands", the link does not, and the next session
    # finds a regular file the repository has never heard of, with the same content and no history
    # (the channel's mix.py → tools/mix.py, N113). So the link is followed: the content is written to the
    # file it points at, and the link stays a link.
    if os.path.islink(path):
        path = os.path.realpath(path)
    d = os.path.dirname(os.path.abspath(path))
    # The mode travels with the content: a script that was executable before the edit is executable after it.
    # A rename with a fresh file silently drops the bit, and a script that lost it stops working for anyone
    # who runs it as `./script` rather than `sh script`.
    try:
        mode = os.stat(path).st_mode & 0o7777
    except OSError:
        mode = None
    fd, tmp = tempfile.mkstemp(dir=d, prefix='.replace-')
    try:
        with os.fdopen(fd, 'w', encoding='utf8') as f:
            f.write(body)
        if mode is not None:
            os.chmod(tmp, mode)
        os.replace(tmp, path)
    except BaseException:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise


def load_edits(path):
    """the list of edits: from a JSON file, or from stdin when the path is `-`"""
    try:
        raw = sys.stdin.read() if path == '-' else read(path)
    except OSError as e:
        print(f'replace: FAIL cannot read {path}: {e}')
        return None
    try:
        edits = json.loads(raw)
    except Exception as e:
        print(f'replace: FAIL cannot read {path}: {e}')
        return None
    if not isinstance(edits, list) or not edits:
        print('replace: FAIL the batch file must be a non-empty list of {"old": ..., "new": ...} edits')
        return None
    return edits


def batch(target, edits_path):
    """many small edits, in one file or in several: every one of them must match exactly, or nothing is written

    The edits are a list of {"old": ..., "new": ..., "count": N}. An edit may name its own "file", so one call
    can edit several files — the file then need not be given on the command line at all. The two snippets may
    also live in files ("old_file", "new_file"), which is the way to edit a long snippet with quotes and
    newlines without hand-writing JSON. They are applied in order, and each one is counted against the file
    *as it stands at that moment* — so two edits with the same old snippet cannot both pass, and the second one
    says so instead of quietly doing nothing.
    """
    edits = load_edits(edits_path)
    if edits is None:
        return 1
    groups = {}                                  # file -> [(index, edit)]
    for i, e in enumerate(edits):
        if not isinstance(e, dict):
            print(f'replace: FAIL edit {i}: the edit must be an object')
            return 1
        # The snippet may live in a FILE instead of inside the JSON. A long snippet with quotes and newlines is
        # exactly where hand-written JSON breaks, and the usual workaround for that — a script that rewrites the
        # JSON before the edit — is the very thing R1 forbids. The agent writes the snippet with the file-writing
        # tool, and this tool does the replacement.
        if 'old_file' in e or 'new_file' in e:
            e = dict(e)
            for key, sf in (('old', 'old_file'), ('new', 'new_file')):
                if sf in e:
                    try:
                        e[key] = read(e[sf])
                    except OSError as ex:
                        print(f'replace: FAIL edit {i}: cannot read {sf} ({e[sf]}): {ex}')
                        return 1
        if not isinstance(e.get('old'), str) or not isinstance(e.get('new'), str):
            print(f'replace: FAIL edit {i}: the edit must have "old" and "new" as strings, or name '
                  f'"old_file"/"new_file" that hold them')
            return 1
        f = e.get('file') or target
        if not f:
            print(f'replace: FAIL edit {i}: it does not name a file — give the file on the command line, or put '
                  f'"file" in the edit')
            return 1
        if target and f != target:
            print(f'replace: FAIL edit {i}: it names {f} but the command line says {target}')
            return 1
        groups.setdefault(f, []).append((i, e))

    problems = []
    bodies = {}                                  # file -> the body after its edits
    for f, items in groups.items():
        if not os.path.isfile(f):
            problems.append((items[0][0], f'the file {f} does not exist'))
            continue
        body = read(f)
        work = body
        for i, e in items:
            if e['old'] == e['new']:
                problems.append((i, 'the old snippet and the new snippet are the same'))
                continue
            want = e.get('count', 1)
            got = work.count(e['old'])
            if got != want:
                problems.append((i, f'the old snippet appears {got} time(s), {want} expected'))
                continue
            work = work.replace(e['old'], e['new'], want)
        bodies[f] = work
    if problems:
        print(f'replace: FAIL {len(problems)} of {len(edits)} edits do not match — nothing was written')
        for i, why in problems:
            print(f'  edit {i}: {why}')
            # where it sits: a snippet that is there but appears twice needs the line numbers to tell them apart
            e = edits[i] if isinstance(edits[i], dict) else {}
            f = e.get('file') or target
            if f and os.path.isfile(f) and isinstance(e.get('old'), str) and e['old'].strip():
                lines = where(read(f), e['old'])
                if lines:
                    print(f'    it sits on line(s): {", ".join(map(str, lines[:12]))}')
        print('  fix the snippet, or give it the count it really has')
        return 1
    for f, body in bodies.items():
        write_atomic(f, body)
        print(f'replace: {f} — {len(groups[f])} edit(s) applied')
    return 0


def selftest():
    """một cái kiểm trả lời "được" cho mọi thứ thì không phải kiểm"""
    import shutil
    import tempfile
    cases = []
    tmp = tempfile.mkdtemp(prefix='replace-selftest-')
    try:
        target = os.path.join(tmp, 'f.md')
        open(target, 'w', encoding='utf-8').write('# dàn ý\n\nc1 nói A\n\nc2 nói B\n')
        edits = os.path.join(tmp, 'edits.json')
        json.dump([{'old': 'c1 nói A', 'new': 'c1 nói A\''},
                   {'old': 'c2 nói B', 'new': 'c2 nói B\''}], open(edits, 'w', encoding='utf-8'))
        rc = batch(target, edits)
        body = read(target)
        cases.append(('hai sửa thì áp dụng cả hai', rc == 0 and "c1 nói A'" in body and "c2 nói B'" in body, body, ''))

        # the snippet may live in a file: long snippets with quotes and newlines are where hand-written JSON breaks
        open(target, 'w', encoding='utf-8').write('câu một "trích" dài\n')
        open(os.path.join(tmp, 'old.txt'), 'w', encoding='utf-8').write('câu một "trích" dài')
        open(os.path.join(tmp, 'new.txt'), 'w', encoding='utf-8').write('câu hai\n"trích"')
        json.dump([{'old_file': os.path.join(tmp, 'old.txt'), 'new_file': os.path.join(tmp, 'new.txt')}], open(edits, 'w', encoding='utf-8'))
        rc = batch(target, edits)
        body = read(target)
        cases.append(('đoạn sửa nằm trong tệp thì vẫn áp dụng', rc == 0 and 'câu hai' in body and '"trích"' in body, body, ''))

        # a snippet that appears twice must be refused, not applied to the wrong one
        open(target, 'w', encoding='utf-8').write('x\nx\n')
        json.dump([{'old': 'x', 'new': 'y'}], open(edits, 'w', encoding='utf-8'))
        rc = batch(target, edits)
        cases.append(('đoạn cũ xuất hiện hai lần thì bị từ chối', rc == 1 and read(target) == 'x\nx\n', read(target), ''))

        # one bad edit among good ones: nothing is written at all
        open(target, 'w', encoding='utf-8').write('a\nb\n')
        json.dump([{'old': 'a', 'new': 'A'}, {'old': 'zzz', 'new': 'Z'}], open(edits, 'w', encoding='utf-8'))
        rc = batch(target, edits)
        cases.append(('một sửa hỏng thì không sửa gì cả', rc == 1 and read(target) == 'a\nb\n', read(target), ''))

        # the same old snippet twice: the second one must say so, not do nothing quietly
        open(target, 'w', encoding='utf-8').write('a\n')
        json.dump([{'old': 'a', 'new': 'A'}, {'old': 'a', 'new': 'B'}], open(edits, 'w', encoding='utf-8'))
        rc = batch(target, edits)
        cases.append(('hai sửa cùng đoạn cũ thì sửa thứ hai bị từ chối', rc == 1 and read(target) == 'a\n', read(target), ''))

        # the mode travels with the content: a script stays executable
        script = os.path.join(tmp, 's.sh')
        open(script, 'w', encoding='utf-8').write('echo hi\n')
        os.chmod(script, 0o755)
        write_atomic(script, read(script).replace('hi', 'hello'))
        mode = os.stat(script).st_mode & 0o111
        cases.append(('tệp thực thi vẫn thực thi sau khi sửa', mode != 0, oct(os.stat(script).st_mode), ''))

        # a symlink stays a symlink: the edit lands in the file it points at, the pointer survives (N113)
        real = os.path.join(tmp, 'real.py')
        open(real, 'w', encoding='utf-8').write('A = 1\n')
        link = os.path.join(tmp, 'link.py')
        os.symlink('real.py', link)
        write_atomic(link, 'A = 2\n')
        cases.append(('liên kết tượng trỏ vẫn là liên kết tượng trỏ sau khi sửa',
                      os.path.islink(link) and read(real) == 'A = 2\n',
                      ('còn là liên kết' if os.path.islink(link) else 'đã thành tệp thường') + ' | ' + read(real), ''))

        # one call, several files: each edit names its own file. This is the shape a session writes by hand
        # when it edits a big source file and a doc in the same breath (N67).
        a1 = os.path.join(tmp, 'a.js')
        a2 = os.path.join(tmp, 'b.md')
        open(a1, 'w', encoding='utf-8').write('const A = 1;\n')
        open(a2, 'w', encoding='utf-8').write('# tiêu đề\n')
        edits2 = os.path.join(tmp, 'edits2.json')
        json.dump([{'file': a1, 'old': 'const A = 1;', 'new': 'const A = 2;'},
                   {'file': a2, 'old': '# tiêu đề', 'new': '# tiêu đề mới'}], open(edits2, 'w', encoding='utf-8'))
        rc = batch(None, edits2)
        cases.append(('một lệnh sửa được nhiều tệp (mỗi sửa tự nêu tệp)',
                      rc == 0 and 'const A = 2;' in read(a1) and '# tiêu đề mới' in read(a2), read(a1), ''))

        # one bad edit in the second file: the first file must not be written either
        open(a1, 'w', encoding='utf-8').write('const A = 1;\n')
        json.dump([{'file': a1, 'old': 'const A = 1;', 'new': 'const A = 2;'},
                   {'file': a2, 'old': 'không có trong tệp', 'new': 'x'}], open(edits2, 'w', encoding='utf-8'))
        rc = batch(None, edits2)
        cases.append(('một sửa hỏng ở tệp thứ hai thì tệp thứ nhất cũng không bị sửa',
                      rc == 1 and read(a1) == 'const A = 1;\n', read(a1), ''))

        # an edit that names a file the command line does not name: refuse, do not guess
        json.dump([{'file': a1, 'old': 'x', 'new': 'y'}], open(edits2, 'w', encoding='utf-8'))
        rc = batch(a2, edits2)
        cases.append(('tệp trong sửa khác tệp trên dòng lệnh thì bị từ chối', rc == 1 and read(a1) == 'const A = 1;\n',
                      read(a1), ''))

        # the edits arrive on stdin: the whole edit is one command and nothing is left on disk
        old_stdin = sys.stdin
        import io
        sys.stdin = io.StringIO(json.dumps([{'old': 'const A = 1;', 'new': 'const A = 3;'}]))
        try:
            rc = batch(a1, '-')
        finally:
            sys.stdin = old_stdin
        cases.append(('sửa đọc từ stdin thì một lệnh là xong', rc == 0 and 'const A = 3;' in read(a1), read(a1), ''))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    failed = 0
    for name, ok, got, extra in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}' + (f'  [{str(got)[:160]}]' if not ok else ''))
        if not ok:
            failed += 1
    if failed:
        print(f'replace --selftest: {failed}/{len(cases)} FAIL')
        return 1
    print(f'replace --selftest: {len(cases)}/{len(cases)} ok')
    return 0


def main():
    ap = argparse.ArgumentParser(description='replace a snippet in a file, exactly once')
    ap.add_argument('file', nargs='?', help='the file to edit (not needed when every edit names its own file)')
    ap.add_argument('old', nargs='?', help='the file holding the old snippet')
    ap.add_argument('new', nargs='?', help='the file holding the new snippet')
    ap.add_argument('--count', type=int, default=1, help='how many matches are expected (default 1)')
    ap.add_argument('--batch', help='a JSON file, or - for stdin: a list of {old, new, count} edits')
    a = ap.parse_args()

    if a.batch:
        return batch(a.file, a.batch)
    if not a.file:
        ap.error('replace: give the file to edit, or use --batch')
    if not os.path.isfile(a.file):
        print(f'replace: FAIL {a.file} does not exist')
        return 1
    if not a.old or not a.new:
        ap.error('replace: give the old and new snippet files, or --batch <edits.json>')
    old, new = read(a.old), read(a.new)
    if old == new:
        print('replace: FAIL the old snippet and the new snippet are the same')
        return 1
    body = read(a.file)
    n = body.count(old)
    if n != a.count:
        print(f'replace: FAIL {a.file} holds the old snippet {n} time(s), {a.count} expected — nothing was written')
        if n:
            lines = where(body, old)
            print(f'  it sits on line(s): {", ".join(map(str, lines[:12]))}')
            for i, line in enumerate(body.splitlines(), 1):
                if old.strip() and old.strip() in line:
                    print(f'  {i}: {line.strip()[:160]}')
                    if len(lines) > 12 and i == lines[12]:
                        print('  …')
                        break
        print('  write a snippet that is unique, or pass --count with the number you mean')
        return 1

    # write the whole file next to the target, then rename it over: the target is never half-written
    write_atomic(a.file, body.replace(old, new, a.count))
    print(f'replace: {a.file} — {n} occurrence(s) replaced')
    return 0


if __name__ == '__main__':
    if '--selftest' in sys.argv[1:]:
        sys.exit(selftest())
    sys.exit(main())
