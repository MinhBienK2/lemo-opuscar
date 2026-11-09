"""The rules a film session broke, read off its own tool log.

    python3 tools/rules.py <transcript> [transcript.py]   print the rules it broke
    python3 tools/rules.py --selftest                     prove the rules with examples

`tools/supervise.sh` calls this; the rules live here so they can be **read and tested on their own**.
A rule that names the wrong file teaches its reader to ignore it, and a reader who has learned to ignore
the report never sees the real finding inside it.

The rules (R1–R5, R9–R12 of CODING_STANDARDS.md):
  R1  a project file written by the shell instead of by the file tool
  R3  every file staged on a dirty tree
  R5  a long job polled with `sleep`
  R9  the same command five times over — a poll, not work
  R10 a hand-rolled ffmpeg montage (the library has core/render/sheet.py)
  R11 the same big file read again and again
  R12 the same frame opened again and again
  COST how big the transcript has grown — a session that has stopped making and started looking
"""
import collections
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import transcript  # noqa: E402  (the path is set above)

REPO_FILE = r"[\w./-]+\.(?:md|js|mjs|py|json|sh|html|txt|css|yml|yaml|toml|mp4|srt)\b"
SRC_EXT = r"\.(?:md|js|mjs|py|json|sh|html|txt|css|yml|yaml|toml)\b"


# is the file the command names a file of the project, or a scratch file under /tmp? R1 is about the project's own
# files: a heredoc that writes a scratch script in /tmp is the way a long script gets to a program, not a violation.
def project_file(f, cmd, lib=''):
    if not f or f.startswith("/tmp/") or f.startswith("/dev/") or f.startswith("~"):
        return False
    if lib and f.startswith(lib):
        return True
    if "/" in f:
        return True          # a path with a directory: src/film.js, voice/lines.json, review/x.md
    # a bare name: it belongs to the project unless the command changed into /tmp first
    return not re.search(r"cd\s+/tmp\b", cmd)


# the files the command writes, as opposed to the files it merely names: a script that reads core/render/still.mjs
# and writes src/film.js has written one file, not two.
def variables(body):
    """the simple assignments of a command body: NAME='literal'. A name the command writes to is often set
    first — `p="src/film.js"; open(p,"w")` — and a rule that cannot follow the name says "R1?" and stops
    there, leaving the reader with a line they cannot act on (N54)."""
    out = {}
    for m in re.finditer(r"([A-Za-z_]\w*)\s*=\s*['\"]([^'\"\n]{1,200})['\"]", body):
        out[m.group(1)] = m.group(2)
    return out


def write_targets(cmd):
    tg = []
    body = cmd
    m = re.search(r"<<-?\s*['\"]?[A-Za-z_]\w*", cmd)
    if m:
        body = cmd[m.end():]
    vars_ = variables(body)

    def resolve(expr):
        """a name in the command may stand for the path it was given earlier in the same command"""
        expr = expr.strip().strip("'\"")
        return vars_.get(expr, expr)

    for m2 in re.finditer(r"open\(\s*([^,)]{1,160}?)\s*,\s*['\"]w", body):
        expr = m2.group(1)
        r = resolve(expr)
        if re.fullmatch(r"[\w./-]+", r):
            tg.append(r)
        else:
            for m3 in re.finditer(re.escape(expr) + r"\s*=\s*['\"]([^\"']+)\"", body):
                tg.append(m3.group(1))
    # a script that writes through a table of edits: {"file": "src/x.js", "old": …, "new": …}
    for m4 in re.finditer(r"['\"]file['\"]\s*:\s*['\"]?([\w./-]+)['\"]?", body):
        tg.append(m4.group(1))
    for m5 in re.finditer(r"['\"]file['\"]\s*:\s*([A-Za-z_]\w*)", body):
        r = resolve(m5.group(1))
        if re.fullmatch(r"[\w./-]+", r):
            tg.append(r)
    # a file written without open(): Path(p).write_text(...), p.write_text(...)
    for m6 in re.finditer(r"(?:write_text|write_bytes)\(\s*([^,)]{1,160}?)\s*\)", body):
        r = resolve(m6.group(1))
        if re.fullmatch(r"[\w./-]+", r):
            tg.append(r)
    tg += re.findall(r"(?<![0-9&])>{1,2}\s*([\w./-]+)", cmd)
    tg += re.findall(r"\bsed\s+-i(?:\.\w+)?\s+(?:'[^']*'|\"[^\"]*\"|\S+)\s+([\w./-]+)", cmd)
    for m4 in re.finditer(r"\b(?:cp|mv)\s+(?:-\S+\s+)*([\w./-]+)\s+([\w./-]+)", cmd):
        tg.append(m4.group(2))
    tg += re.findall(r"os\.replace\([^,]+,\s*['\"]?([\w./-]+)", body)
    tg += re.findall(r"shutil\.(?:copy|move)\([^,]+,\s*['\"]?([\w./-]+)", body)
    return tg


def short(f, film=''):
    """the file as a person would name it: relative to the film, and without a leading './'"""
    if film:
        try:
            r = os.path.relpath(f, film)
            if not r.startswith('..'):
                f = r
        except ValueError:
            pass
    return f[2:] if f.startswith('./') else f


def rules(session, film='', lib=''):
    """the rules the session broke — a list of lines a person can act on"""
    out = []
    drawn = set()   # a file is reported once, not once per edit
    # is the film under production a three.js film? its src/ says so.
    three_d = False
    if film:
        src_dir = os.path.join(film, "src")
        if os.path.isdir(src_dir):
            for name in os.listdir(src_dir):
                if name.endswith(".js"):
                    try:
                        if re.search(r"from\s+['\"]three['\"]|require\(['\"]three['\"]\)",
                                     open(os.path.join(src_dir, name), encoding="utf8").read()):
                            three_d = True
                    except OSError:
                        pass
    # the same command five times over is a poll, whatever it looks for (R9). Counted first, reported last: the
    # report keeps the last forty lines, and a poll loop is the finding that must never be the one that falls off.
    seen = collections.Counter()
    for at, tool, args in transcript.events(session):
        cmd = " ".join((args.get("command", "") or "").split())
        if tool == "bash" and cmd:
            seen[cmd.strip()] += 1
    polls = [f"R9 {n} lần cùng một lệnh — một vòng dò, không phải việc: {cmd[:120]}"
             for cmd, n in seen.most_common() if n >= 5]

    r1_n = 0
    r1_files = {}
    r10_n = 0
    reread = {}          # how often a project file is read (R11)
    imgread = {}         # how often the same frame is looked at again (R12)
    for at, tool, args in transcript.events(session):
        cmd = " ".join((args.get("command", "") or "").split())   # one line: a heredoc must not spill into the report
        at = at[11:19] if 'T' in at else at
        if tool == "read":
            p = args.get("path", "")
            if p.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                # by name, not by path: the same frame is looked at from a different scratch folder each time
                imgread[os.path.basename(p)] = imgread.get(os.path.basename(p), 0) + 1
            elif p and not p.startswith("/tmp/"):
                reread[p] = reread.get(p, 0) + 1
        if tool == "bash":
            # a settle of a second after a kill is not a poll; a wait of half a minute is
            if re.search(r'(^|[;&|]\s*)sleep\s+([5-9]|\d{2,})', cmd):
                out.append(f"R5 {at} a long job is polled with sleep: {cmd[:120]}")
            if re.search(r'git\s+add\s+(-\S+\s+)*(-A|--all)\b', cmd):
                out.append(f"R3 {at} every file is staged on a dirty tree: {cmd[:120]}")
            # R1: a file written by the shell. Four shapes: a heredoc (the shell hands a body to a program, which
            # then decides what to write), a redirect into a file, an in-place edit (sed -i), and a copy or a move.
            # The rule names the file the command **writes**, not every file the command mentions — a report that
            # names a file nobody wrote teaches the reader to ignore the report.
            redirect = bool(re.search(r"(?<![0-9&])>{1,2}\s*[\w./-]+" + SRC_EXT, cmd))
            in_place = bool(re.search(r"\bsed\s+-i\b|\bcp\b\s|\bmv\b\s", cmd))
            # only the files a person edits count: a rendered frame copied into a review folder is a build step
            targets = [f for f in write_targets(cmd) if project_file(f, cmd, lib) and re.search(SRC_EXT, f)]
            is_r1 = bool(targets)
            # R10: a hand-rolled ffmpeg montage of frames. The library has core/render/sheet.py for this. A command
            # that both edits a file and tiles frames is reported once, as the edit.
            jpgs = len(re.findall(r'-i\s+\S+\.jpg', cmd))
            is_r10 = 'ffmpeg' in cmd and jpgs >= 2 and bool(re.search(r'filter_complex|tile=|hstack|vstack|xstack', cmd))
            if is_r1:
                r1_n += 1
                for f in set(targets):
                    f = short(f, film)
                    r1_files[f] = r1_files.get(f, 0) + 1
            elif is_r10:
                r10_n += 1
            elif re.search(r'\bpython3?\s+-\s*<<', cmd) and re.search(r"['\"][^'\"]*\.(js|json|md)['\"]", cmd):
                # The command does not say which file it writes — a python program from stdin decides that, and
                # the rule cannot read the program's mind. Say that, and do not name a file.
                out.append(f"R1? {at} a shell script touches a source file (lệnh không nói tệp nào — đọc lệnh "
                           f"trước khi tin): {cmd[:120]}")
        if tool in ("write", "edit"):
            p = args.get("path", "")
            if "/src/" in p and p.endswith(".js") and p not in drawn:
                try:
                    src = open(p, encoding="utf8").read()
                    # T9 is about text drawn straight onto the screen canvas. A three.js film paints its
                    # textures the same way — the "MAX 400" on a scale, the "°C" on a thermometer — and that
                    # text is a marking on an object, which is exactly what the channel wants on screen. Firing
                    # on a 3D film would bury the real findings under fifteen reports of the same prop file.
                    if "fillText(" in src and not three_d:
                        drawn.add(p)
                        out.append(f"T9 {at} {p} draws a string with a raw fillText() — the reading check cannot see it")
                except OSError:
                    pass
    if r1_n:
        top = ", ".join(f"{f}×{n}" for f, n in sorted(r1_files.items(), key=lambda kv: -kv[1])[:8])
        out.append(f"R1 {r1_n} lần — file của dự án bị ghi bằng shell, không bằng công cụ sửa file: {top}. "
                   f"Dùng `edit`, hoặc `python3 tools/replace.py` khi đoạn cần thay quá dài.")
    if r10_n:
        out.append(f"R10 {r10_n} lần — montage ffmpeg tự viết: `core/render/sheet.py` xếp các khung lại và đặt tên từng khung.")
    # the cost of the session, in bytes. A transcript grows with every event, and a transcript that has grown
    # by hundreds of megabytes is a session that has stopped making and started looking: the number says so before
    # anyone reads the log.
    try:
        SIZE = os.path.getsize(session)
    except OSError:
        SIZE = 0
    if SIZE:
        out.append(f"COST the transcript is {SIZE/1048576:.0f} MB — a session's cost is measurable in bytes, and a "
                   f"transcript that grows by hundreds of megabytes is a session looking, not making.")
    # R11: the same big file read again and again. The read is the cost: a 200 kB source file read to find one
    # function buys nothing, and a session that reads it fifteen times is paying for the same context over and over.
    for f, n in sorted(reread.items(), key=lambda kv: -kv[1]):
        if n >= 15:
            out.append(f"R11 {n} lần đọc lại {f} — đọc cả tệp để tìm một chỗ sửa: grep tên rồi đọc đoạn (`offset`, `limit`), "
                       f"và giữ một bản đồ mã (tên hàm → dòng) bên cạnh mã nguồn.")
    # R12: the same frame looked at again and again. An image is a megabyte of context, so a session that opens one
    # frame twenty times pays for that picture twenty times; the sheet of twelve frames would have shown it once.
    if imgread:
        again = sum(n - 1 for n in imgread.values())
        out.append(f"R12 {sum(imgread.values())} lần mở ảnh, {again} lần là mở lại một tệp đã xem — ảnh vào ngữ cảnh là ~1 MB mỗi lần.")
    for f, n in sorted(imgread.items(), key=lambda kv: -kv[1]):
        if n >= 10:
            out.append(f"R12 {n} lần xem lại {f} — mở `sheet_*.jpg` (mười hai khung một tờ) thay vì mở từng khung, và ghi lại khung nào đã xem để không xem lại.")
    return out[-40:] + polls


# ——— selftest ———

def _fake_transcript(path, commands):
    """a transcript a person can read: one assistant event per bash command"""
    with open(path, 'w', encoding='utf-8') as f:
        for i, cmd in enumerate(commands):
            f.write(json.dumps({
                "type": "assistant", "timestamp": f"2026-11-09T09:0{i}:00.000Z",
                "message": {"content": [{"type": "tool_use", "name": "Bash", "input": {"command": cmd}}]},
            }) + "\n")


def selftest():
    """một cái kiểm trả lời "được" cho mọi thứ thì không phải kiểm

    Những ca này là lỗi đã xảy ra thật: báo cáo R1 nêu `core/render/page.mjs` — một tệp phiên
    chỉ **import**, không viết — nên đọc không tệp nào, và những lần ghi thật thì rơi vào
    dòng "R1?" không ai hành động được.
    """
    import shutil
    import tempfile
    cases = []
    tmp = tempfile.mkdtemp(prefix='rules-selftest-')
    try:
        session = os.path.join(tmp, 'session.jsonl')
        _fake_transcript(session, [
            # a heredoc that only *imports* a shared library file: it writes nothing
            "python3 - <<'PY'\nimport { openDemo, closeServer } from '../core/render/page.mjs'\nprint('x')\nPY",
            # a redirect that writes a project file: this one is the violation
            "cat > src/film.js <<'EOF'\n// new shot\nEOF",
            # a python program that writes a project file, and says which one
            "python3 - <<'PY'\nopen('voice/lines.json', 'w').write('[]')\nPY",
            # a python program whose target the rule cannot resolve: it says so, and guesses nothing
            "python3 - <<'PY'\nFILES = ['voice/lines.json', 'src/film.js']\nfor f in FILES:\n    open(f, 'w').write('[]')\nPY",
        ])
        got = '\n'.join(rules(session))
        r1 = [l for l in got.split('\n') if l.startswith('R1 ')]
        cases.append(('hai lần ghi bằng shell thì báo R1', len(r1) == 1, r1, ''))
        cases.append(('R1 nêu đúng tệp đã ghi (src/film.js)', any('src/film.js' in l for l in r1), r1, ''))
        cases.append(('R1 nêu đúng tệp đã ghi (voice/lines.json)', any('voice/lines.json' in l for l in r1), r1, ''))
        cases.append(('R1 không nêu tệp chỉ được import', not any('page.mjs' in l for l in r1), r1, ''))
        cases.append(('lệnh không nói tệp nào thì báo R1? (không đoán)',
                      any(l.startswith('R1?') for l in got.split('\n')), got, ''))

        # a poll is a poll: the same command five times over
        _fake_transcript(session, ["date +%H:%M:%S"] * 5)
        got = '\n'.join(rules(session))
        cases.append(('cùng một lệnh năm lần thì báo R9', 'R9 ' in got, got, ''))

        # a long job waited for with sleep
        _fake_transcript(session, ["sleep 240; ls /tmp/x | wc -l"])
        got = '\n'.join(rules(session))
        cases.append(('việc dài được chờ bằng sleep thì báo R5', 'R5 ' in got, got, ''))

        # a scratch file under /tmp is not a project file
        _fake_transcript(session, ["cat > /tmp/scratch.py <<'EOF'\nx=1\nEOF"])
        got = '\n'.join(rules(session))
        cases.append(('tệp tạm trong /tmp thì không phải R1', 'R1 ' not in got, got, ''))

        # a write through a name the command set first: the rule must follow the name, or it says "R1?" and
        # leaves the reader with a line they cannot act on — and the count comes out ten times too small
        _fake_transcript(session, [
            "python3 - <<'PY'\np='src/film.js'\ns=open(p,encoding='utf-8').read()\nopen(p,'w').write(s)\nPY",
        ])
        got = '\n'.join(rules(session))
        cases.append(('ghi qua một tên biến thì vẫn nêu đúng tệp', 'src/film.js' in got, got, ''))
        cases.append(('ghi qua một tên biến thì không còn là R1?', 'R1?' not in got, got, ''))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    failed = 0
    for name, ok, got, extra in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}' + (f'  [{str(got)[:200]}]' if not ok else ''))
        if not ok:
            failed += 1
    if failed:
        print(f'rules --selftest: {failed}/{len(cases)} FAIL')
        return 1
    print(f'rules --selftest: {len(cases)}/{len(cases)} ok')
    return 0


def main(argv=None):
    argv = sys.argv[1:] if argv is None else list(argv)
    if argv and argv[0] == '--selftest':
        return selftest()
    if not argv:
        sys.exit(__doc__)
    session = argv[0]
    film = os.environ.get('SUPERVISE_FILM', '')
    lib = os.environ.get('SUPERVISE_LIB', '')
    print('\n'.join(rules(session, film, lib)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
