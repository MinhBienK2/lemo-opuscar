"""Replace a snippet in a file, exactly once, and write the whole file atomically.

    python3 tools/replace.py <file> <old-snippet-file> <new-snippet-file> [--count N]
    python3 tools/replace.py <file> --batch <edits.json>

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


def batch(target, edits_path):
    """many small edits in one file: every one of them must match exactly, or nothing is written

    The edits are a list of {"old": ..., "new": ..., "count": N}. They are applied in order, and each one is
    counted against the file *as it stands at that moment* — so two edits with the same old snippet cannot
    both pass, and the second one says so instead of quietly doing nothing.
    """
    try:
        edits = json.loads(read(edits_path))
    except Exception as e:
        print(f'replace: FAIL cannot read {edits_path}: {e}')
        return 1
    if not isinstance(edits, list) or not edits:
        print('replace: FAIL the batch file must be a non-empty list of {"old": ..., "new": ...} edits')
        return 1
    body = read(target)
    problems = []
    for i, e in enumerate(edits):
        if not isinstance(e, dict) or not isinstance(e.get('old'), str) or not isinstance(e.get('new'), str):
            problems.append((i, 'the edit must have "old" and "new" as strings'))
            continue
        if e['old'] == e['new']:
            problems.append((i, 'the old snippet and the new snippet are the same'))
            continue
        want = e.get('count', 1)
        got = body.count(e['old'])
        if got != want:
            problems.append((i, f'the old snippet appears {got} time(s), {want} expected'))
    if problems:
        print(f'replace: FAIL {len(problems)} of {len(edits)} edits do not match — nothing was written')
        for i, why in problems:
            print(f'  edit {i}: {why}')
        print('  fix the snippet, or give it the count it really has')
        return 1
    for i, e in enumerate(edits):
        want = e.get('count', 1)
        got = body.count(e['old'])
        if got != want:
            # an earlier edit changed the file under this one: the count no longer holds
            print(f'replace: FAIL edit {i}: the old snippet now appears {got} time(s), {want} expected — '
                  f'nothing was written')
            return 1
        body = body.replace(e['old'], e['new'], want)
    write_atomic(target, body)
    print(f'replace: {target} — {len(edits)} edit(s) applied')
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
    ap.add_argument('file')
    ap.add_argument('old', nargs='?', help='the file holding the old snippet')
    ap.add_argument('new', nargs='?', help='the file holding the new snippet')
    ap.add_argument('--count', type=int, default=1, help='how many matches are expected (default 1)')
    ap.add_argument('--batch', help='a JSON file: a list of {old, new, count} edits')
    a = ap.parse_args()

    if not os.path.isfile(a.file):
        print(f'replace: FAIL {a.file} does not exist')
        return 1
    if a.batch:
        return batch(a.file, a.batch)
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
