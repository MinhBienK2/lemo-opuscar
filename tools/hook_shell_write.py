"""Chặn việc ghi file của dự án bằng shell (luật R1).

Claude Code gọi hook này **trước** mỗi lần chạy lệnh `Bash` (PreToolUse). Đầu vào là JSON trên
stdin; đầu ra là mã thoát:

- `0` — cho qua (không in gì);
- `2` — **chặn** lệnh này, và thông điệp trên stderr được đưa lại cho người làm.

**Vì sao cần.** Một heredoc trong shell ghi đè tệp của dự án không chỉ là cách viết khác: nó làm hỏng
chữ tiếng Việt trong tệp (một lần như vậy đã làm hỏng lời kể của tập 02), và nó không có bản sao lưu.
Phiên tập 02 ghi file bằng shell **42 lần**; phiên tập 01, **370 lần**. Luật viết trong prompt khởi
đầu ("sửa file bằng `edit`/`write`, không dùng heredoc") không cứu được phiên nào — cũng như luật
"đọc log một lần" (N103, N108).

**Luật ở đây là hẹp, để không chặn nhầm.** Chỉ chặn khi lệnh **ghi một tệp nguồn của dự án**:
- một heredoc (`<<'PY' … PY`) có trong thân nó lệnh ghi (`open(…, 'w')`, `.write_text(`, `.write_bytes(`)
  và trong đó có đường dẫn tới tệp nguồn; hoặc
- một chuyển hướng ghi (`> tệp`, `>> tệp`, `tee tệp`) trỏ vào tệp nguồn của dự án.

Mọi thứ khác đều đi qua: đọc bằng heredoc, ghi ra `/tmp`, ghi ra `out/` hay `review/`, ghi tệp nhật ký
(`.log`), ảnh, phim. Vì vậy lệnh dài, script tự kiểm tra và `python3 tools/replace.py --batch -` vẫn
chạy bình thường.

    python3 tools/hook_shell_write.py --selftest     # chứng minh bằng ví dụ
"""
import json
import os
import re
import sys

# tệp nguồn: đuôi nào đáng bảo vệ
SOURCE_EXT = ('.js', '.mjs', '.cjs', '.jsx', '.ts', '.py', '.md', '.json', '.html', '.css',
              '.sh', '.yaml', '.yml', '.txt', '.svg')
# nơi không chặn: tệp sinh ra lúc chạy, không phải mã nguồn
SKIP_DIR = ('/out/', '/review/', '/node_modules/', '/.git/', '/__pycache__/', '/dist/', '/build/')
# …nhưng **script** không phải tệp sinh ra lúc chạy: một .review-local.sh viết bằng shell là mã nguồn lọt vào
# thư mục của tập, và nó được commit cùng tập đó. Ngoại lệ cho out/ và review/ không áp dụng cho chúng.
SCRIPT_EXT = ('.sh', '.py', '.bash', '.zsh')
SKIP_EXT = ('.log', '.tmp', '.output', '.jpg', '.jpeg', '.png', '.webp', '.mp4', '.wav', '.mp3', '.jsonl')

WRITE_API = re.compile(
    r"open\(\s*(?P<q1>['\"])(?P<p1>[^'\"]+)(?P=q1)\s*,\s*['\"]w"        # open('tệp', 'w')
    r"|\(\s*(?P<q2>['\"])(?P<p2>[^'\"]+)(?P=q2)\s*\)\s*\.\s*write_text\("  # Path('tệp').write_text(
    r"|\(\s*(?P<q3>['\"])(?P<p3>[^'\"]+)(?P=q3)\s*\)\s*\.\s*write_bytes\(")  # Path('tệp').write_bytes(

# một heredoc ghi tệp qua một **biến** ("p = 'research/FACTS.md'; open(p, 'w')") không để lộ đường dẫn,
# nên WRITE_API không nhìn thấy nó — và tệp bị ghi là tệp nguồn thật (FACTS.md là tệp mà cả phim trích dẫn,
# và mà các kiểm tra claim/facts đọc). Đường dẫn được gán vào một biến rồi biến ấy được ghi vào thì chặn.
ASSIGN = re.compile(r"(?m)^\s*(?P<v>[A-Za-z_]\w*)\s*=\s*(?P<q>['\"])(?P<p>[^'\"]+)(?P=q)")


def var_project_writes(body, root=None):
    """Các tệp nguồn của dự án mà thân heredoc ghi vào qua một biến"""
    out = []
    body = body or ''
    root = root or project_root()
    for m in ASSIGN.finditer(body):
        v, p = m.group('v'), m.group('p')
        v = re.escape(v)
        writes = (re.search(r"open\(\s*%s\s*,\s*['\"][wax]" % v, body)
                  or re.search(r"Path\(\s*%s\s*\)\s*\.\s*write_(?:text|bytes)\(" % v, body)
                  or re.search(r"\b%s\s*\.\s*write_(?:text|bytes)\(" % v, body))
        if writes and is_source(p, root):
            out.append(p)
    return out


HEREDOC = re.compile(r"<<-?\s*(['\"]?)([A-Za-z_]\w*)\1")
REDIRECT = re.compile(r"(?:^|[^0-9<>=])>>?\s*(?!&)(?P<p>[^\s|;&)'\"]+)")
TEE = re.compile(r"\btee\s+(?:-a\s+)?(?P<p>[^\s|;&)'\"]+)")
QUOTED = re.compile(r"'[^']*'|\"(?:\\.|[^\"\\])*\"")
TARGET_PREFIX = re.compile(r"(?:>>?|\btee(?:\s+-a)?)\s*$")


def shell_text(command):
    """Phần shell của lệnh: bỏ thân heredoc, và bỏ chuỗi trong nháy (trừ chuỗi ngay sau `>` / `tee`, là đích ghi)."""
    lines, skip = [], None
    for line in (command or '').split('\n'):
        if skip is not None:
            if line.strip() == skip:
                skip = None
            continue
        lines.append(line)
        m = HEREDOC.search(line)
        if m:
            skip = m.group(2)
    text = '\n'.join(lines)
    out, last = [], 0
    for m in QUOTED.finditer(text):
        out.append(text[last:m.start()])
        if TARGET_PREFIX.search(text[:m.start()]):
            out.append(m.group(0)[1:-1])
        else:
            out.append(' ')
        last = m.end()
    out.append(text[last:])
    return ''.join(out)

MESSAGE = (
    'Lệnh này ghi tệp của dự án bằng shell (%s). Ghi bằng shell không chỉ là cách viết khác: nó làm hỏng '
    'chữ tiếng Việt trong tệp, và không có bản sao lưu (luật R1 — ở tập 02 có một heredoc đã hỏng lời kể '
    'của cả tập).\n'
    'Cách làm đúng: dùng công cụ sửa file (`edit` / `write`). Đoạn cần thay quá dài để khớp chính xác '
    'thì dùng `python3 tools/replace.py <tệp> <đoạn cũ> <đoạn mới>`, hoặc `python3 tools/replace.py '
    '--batch <edits.json>` cho nhiều sửa — nó đếm số lần khớp, đi theo liên kết tượng trỏ, và ghi '
    'nguyên tệp mới đè lên tệp cũ.\n')


def project_root():
    return os.path.abspath(os.environ.get('CLAUDE_PROJECT_DIR') or os.getcwd())


def is_source(path, root):
    """Tệp này có phải tệp nguồn của dự án không (đường dẫn tương đối được hiểu là so với thư mục gốc)"""
    p = path.strip().strip('"\'')
    if not p or p.startswith('-') or '<' in p:
        return False
    if p.startswith('/dev/') or p.startswith('/proc/') or p.startswith('~'):
        return False
    if '$' in p or '`' in p:    # có biến shell: không biết nó trỏ đi đâu, nên không chặn
        return False
    ext = os.path.splitext(p)[1].lower()
    if ext in SKIP_EXT or not ext:
        return False
    full = p if os.path.isabs(p) else os.path.join(root, p)
    full = os.path.normpath(full)
    if not full.startswith(root + os.sep):
        return False
    low = full.replace('\\', '/')
    if ext not in SCRIPT_EXT and any(d in low for d in SKIP_DIR):
        return False
    return ext in SOURCE_EXT


def heredoc_bodies(command):
    """[(marker, thân)] của mọi heredoc trong lệnh"""
    out = []
    lines = (command or '').split('\n')
    for i, line in enumerate(lines):
        for m in HEREDOC.finditer(line):
            marker = m.group(2)
            body = []
            for nxt in lines[i + 1:]:
                if nxt.strip() == marker:
                    break
                body.append(nxt)
            else:
                body = []
            out.append('\n'.join(body))
    return out


def writes_in(body):
    """Các đường dẫn mà thân heredoc này ghi vào"""
    out = []
    for m in WRITE_API.finditer(body or ''):
        p = m.group('p1') or m.group('p2') or m.group('p3')
        if p:
            out.append(p)
    return out


def targets(command):
    """Các tệp mà lệnh này ghi vào, theo cách ghi"""
    out = []
    for body in heredoc_bodies(command):
        for p in writes_in(body):
            out.append(('heredoc', p))
    text = shell_text(command)
    for m in REDIRECT.finditer(text):
        out.append(('redirect', m.group('p')))
    for m in TEE.finditer(text):
        out.append(('tee', m.group('p')))
    return out


def decide(command, root=None):
    """(mã thoát, thông điệp) cho một lệnh"""
    root = root or project_root()
    for kind, path in targets(command):
        if is_source(path, root):
            return 2, MESSAGE % (f'{kind}: {path}')
    for body in heredoc_bodies(command):
        for path in var_project_writes(body, root):
            return 2, MESSAGE % (f'heredoc (ghi qua biến): {path}')
    return 0, ''


def selftest():
    root = os.path.abspath('/tmp/du-an')
    cases = [
        # (lệnh, có chặn không)
        ("python3 - <<'PY'\nopen('src/film.js','w').write('x')\nPY", True),
        ("cat > src/film.js <<'EOF'\nhello\nEOF", True),
        ("cat >> channels/x/TREATMENT.md <<'EOF'\nhello\nEOF", True),
        ("tee src/props.js <<'EOF'\nhello\nEOF", True),
        ("python3 - <<'PY'\nfrom pathlib import Path\nPath('src/set.js').write_text('x')\nPY", True),
        # — không chặn —
        ("git commit -m 'a > b.md'", False),
        ("echo 'x > y.md'", False),
        ('node -e "f=x=>y.js"', False),
        ('echo x > "$HOME/notes.md"', False),
        ('echo x > $OUT/notes.md', False),
        ('echo x > ${DIR}/notes.md', False),
        ('echo x > ~/notes.md', False),
        # — chặn: đích có nháy, và `2>&1 >` —
        ('echo x > "tools/foo.py"', True),
        ('echo x > tools/foo.py', True),
        ('cmd 2>&1 > notes.md', True),
        ("python3 - <<'PY'\nimport json\nprint(json.load(open('src/film.js')))\nPY", False),
        ("cat > /tmp/note.txt <<'EOF'\nhello\nEOF", False),
        ("cat > out/log.txt <<'EOF'\nhello\nEOF", False),
        ("cat > review/NOTE.md <<'EOF'\nhello\nEOF", False),
        ("python3 tools/replace.py --batch - <<'JSON'\n[{\"file\":\"src/film.js\"}]\nJSON", False),
        ("sh build.sh > /tmp/build.log 2>&1", False),
        ("echo x > /dev/null", False),
        ("python3 - <<'PY'\nprint('sys.stdout.write is fine')\nPY", False),
        ("node channels/tram-nghi-nhieu/propcheck.mjs tap --out out/p", False),
        # — ghi qua biến: đường dẫn không lộ ra nên WRITE_API không thấy —
        ("python3 - <<'PY'\np='research/FACTS.md'\ns=open(p).read()\nopen(p,'w').write(s.replace('a','b'))\nPY", True),
        ("python3 - <<'PY'\np='/tmp/ghi.txt'\nopen(p,'w').write('x')\nPY", False),
        ("python3 - <<'PY'\np='out/beats/beats.json'\nopen(p,'w').write('{}')\nPY", False),
        ("python3 - <<'PY'\np='review/NOTE.md'\nopen(p,'w').write('x')\nPY", False),
        # — script trong thư mục của tập vẫn là mã nguồn, kể cả khi nằm trong review/ —
        ("cat > review/.review-local.sh <<'EOF'\necho x\nEOF", True),
        ("cat > out/helper.py <<'EOF'\nprint(1)\nEOF", True),
    ]
    failed = 0
    for cmd, want in cases:
        rc, msg = decide(cmd, root)
        ok = (rc == 2) == want
        failed += 0 if ok else 1
        first = cmd.split('\n')[0][:52]
        print(('ok   ' if ok else 'FAIL ') + f'{first:<54} → {"chặn" if rc == 2 else "cho qua"}')
    # đường dẫn tuyệt đối trong dự án cũng phải bị chặn
    rc, _ = decide(f"cat > {root}/src/film.js <<'EOF'\nx\nEOF", root)
    if rc != 2:
        failed += 1
        print('FAIL đường dẫn tuyệt đối trong dự án phải bị chặn')
    else:
        print('ok   đường dẫn tuyệt đối trong dự án → chặn')
    print(f'hook_shell_write --selftest: {"đều đúng" if not failed else str(failed) + " ca hỏng"}')
    return 0 if not failed else 1


def main():
    if '--selftest' in sys.argv:
        return selftest()
    try:
        data = json.loads(sys.stdin.read())
    except ValueError:
        return 0
    command = ((data.get('tool_input') or {}).get('command')) or ''
    rc, message = decide(command)
    if rc != 0:
        sys.stderr.write(message)
    return rc


if __name__ == '__main__':
    sys.exit(main())
