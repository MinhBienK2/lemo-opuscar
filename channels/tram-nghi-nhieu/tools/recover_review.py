#!/usr/bin/env python3
"""recover_review.py — dựng lại bản chấm mà một vòng chấm đã xoá mất

    python3 channels/tram-nghi-nhieu/tools/recover_review.py --transcript <đường dẫn> \
        --file STORYBOARD-REVIEW.md [--out <tệp>] [--episode <thư mục tập>]

**Vì sao cần.** Vòng chấm làm việc trong một thư mục tạm (`/tmp/lemo-review-XXXXXX`), và
`review.sh` xoá thư mục đó khi vòng kết thúc. Bản chấm của người chấm nằm trong đó cho tới
lúc nó được chép ra `review/` — nếu vòng chết trước bước chép ấy thì bản chấm biến mất
cùng thư mục, và dấu vết ghi *"không có phán quyết"* dù phán quyết đã có, đã viết ra, và
đã tự in md5 của nó.

Nó xảy ra thật ở tap-04, vòng storyboard lúc 17:42 ngày 09-11: người chấm viết xong
`STORYBOARD-REVIEW.md` (VERDICT: REJECT) lúc 17:39:58 và in md5
`92ecbcc7d16a0e9ec74a74ecda8d8958`; `timeout` giết CLI lúc 17:42:25 vì một *workflow*
nền còn đang chạy; bẫy EXIT xoá thư mục tạm, mất bản chấm, và dấu vết nói vòng đó không
có phán quyết. Một giờ công sức và 193 USD biến mất, và người làm chạy lại vòng thứ hai.

**Công cụ này không đoán.** Nó dựng lại bản chấm từ **transcript của chính CLI người chấm**
— transcript nằm ở `~/.claude/projects/-tmp-lemo-review-XXXX/<id>.jsonl`, *ngoài* thư mục
tạm, nên nó còn lại sau khi thư mục tạm bị xoá. Mọi thao tác ghi lên bản chấm đều có trong
transcript: `Write`, `Edit`, và các lệnh shell `python3 - <<'EOF'` sửa chữa bằng
`s.replace(...)`.

Rồi nó **đối chiếu**: md5 của bản dựng lại phải bằng đúng con số mà người chấm đã tự in.
Hai con số khác nhau nghĩa là bản dựng lại không đúng byte nào, và công cụ nói thẳng là
không đúng, kèm chỗ khác nhau.

Exit code: 0 dựng lại được và khớp md5 của người chấm; 1 dựng lại được nhưng không khớp
(hoặc có thao tác nào không hiểu); 2 không dựng lại được; 3 sai cách dùng.
"""
import argparse
import ast
import glob
import hashlib
import json
import os
import re
import sys

# Một lệnh shell sửa bản chấm bằng heredoc: `python3 - <<'EOF' … EOF`
HEREDOC = re.compile(r"python3\s+-?\s*<<'(\w+)'[ \t]*\r?\n(.*?)\r?\n\1[ \t]*$", re.S | re.M)
# md5 mà chính người chấm in ra: `92ecbcc7…  STORYBOARD-REVIEW.md`
MD5_LINE = re.compile(r'^\s*([0-9a-f]{32})\s+\*?(\S+)\s*$', re.M)


# ——— đọc transcript ————————————————————————————————————————————————

def load(path):
    """[(loại, khối)] theo đúng thứ tự transcript; bỏ bản trùng 'api-request-blob'."""
    events = []
    with open(path, encoding='utf-8', errors='replace') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
            except ValueError:
                continue
            if rec.get('type') not in ('assistant', 'user'):
                continue
            msg = rec.get('message') or {}
            content = msg.get('content')
            if isinstance(content, str):
                content = [{'type': 'text', 'text': content}]
            if not isinstance(content, list):
                continue
            for block in content:
                if isinstance(block, dict):
                    events.append((rec.get('type'), block))
    return events


def tool_uses(events):
    """các lời gọi công cụ, theo thứ tự."""
    return [b for kind, b in events if kind == 'assistant' and b.get('type') == 'tool_use']


def tool_results(events):
    """các kết quả công cụ, theo thứ tự."""
    return [b for kind, b in events if kind == 'user' and b.get('type') == 'tool_result']


def result_text(block):
    c = block.get('content')
    if isinstance(c, str):
        return c
    if isinstance(c, list):
        return '\n'.join(b.get('text', '') for b in c if isinstance(b, dict))
    return ''


# ——— dựng lại bản chấm ————————————————————————————————————————————————

def apply_edit(text, old, new, replace_all):
    """trả về (bản mới, số lần khớp)"""
    if not old:
        return text, 0
    n = text.count(old)
    if n == 0:
        return text, 0
    if replace_all:
        return text.replace(old, new), n
    return text.replace(old, new, 1), n


def heredoc_replaces(body, target):
    """các phép `s.replace(a, b)` trong một đoạn python, theo thứ tự.

    Trả về (danh sách phép, danh sách điều không hiểu). Đây là **phân tích**, không phải
    chạy mã: đoạn heredoc của người chấm được đọc bằng `ast`, và chỉ những phép thay
    chữa trên biến `s` mới được chấp nhận. Một đoạn làm gì khác sẽ được ghi ra là
    "không hiểu" và bản dựng lại sẽ không được coi là đúng byte nào.

    Đoạn cũng có thể gán đường dẫn vào một biến (`p='/tmp/…'`) rồi mở tệp đó — đoạn đó
    chỉ được chấp nhận nếu tệp nó mở **chính là** bản chấm đang dựng lại.
    """
    ops, unknown = [], []
    paths = {}
    try:
        tree = ast.parse(body)
    except SyntaxError:
        return ops, ['heredoc không parse được như python']
    for node in tree.body:
        if isinstance(node, ast.Import) or isinstance(node, ast.ImportFrom):
            continue
        if isinstance(node, ast.Assign) and len(node.targets) == 1 \
                and isinstance(node.targets[0], ast.Name):
            name = node.targets[0].id
            val = node.value
            if name != 's':
                # một biến đường dẫn: chỉ nhớ lại, không sửa gì
                try:
                    const = ast.literal_eval(val)
                except (ValueError, SyntaxError):
                    unknown.append('gán %s bằng biểu thức không phải chữa ký' % name)
                    continue
                if isinstance(const, str):
                    paths[name] = const
                continue
            # s = open(p).read()  → đọc lại chính tệp: trạng thái hiện tại đã là nó
            if isinstance(val, ast.Call) and isinstance(val.func, ast.Attribute) \
                    and val.func.attr == 'read' and isinstance(val.func.value, ast.Call) \
                    and isinstance(val.func.value.func, ast.Name) \
                    and val.func.value.func.id == 'open':
                continue
            if isinstance(val, ast.Call) and isinstance(val.func, ast.Attribute) \
                    and val.func.attr == 'replace' and isinstance(val.func.value, ast.Name) \
                    and val.func.value.id == 's':
                try:
                    args = [ast.literal_eval(a) for a in val.args]
                except (ValueError, SyntaxError):
                    unknown.append('s.replace(...) có đối số không phải chữa ký')
                    continue
                if len(args) == 2 and all(isinstance(a, str) for a in args):
                    ops.append((args[0], args[1], 0))
                elif len(args) == 3 and all(isinstance(a, str) for a in args[:2]) \
                        and isinstance(args[2], int):
                    ops.append((args[0], args[1], args[2]))
                else:
                    unknown.append('s.replace(...) có hình dạng lạ')
                continue
            unknown.append('gán s bằng biểu thức không phải s.replace')
            continue
        if isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
            func = node.value.func
            # open(p, 'w').write(s) → chốt nội dung
            if isinstance(func, ast.Attribute) and func.attr == 'write':
                if not (isinstance(func.value, ast.Call)
                        and isinstance(func.value.func, ast.Name)
                        and func.value.func.id == 'open'):
                    unknown.append('ghi tệp bằng biểu thức không phải open(...).write')
                    continue
                args = func.value.args
                fname = None
                if args:
                    if isinstance(args[0], ast.Name):
                        fname = paths.get(args[0].id)
                    else:
                        try:
                            fname = ast.literal_eval(args[0])
                        except (ValueError, SyntaxError):
                            fname = None
                if not isinstance(fname, str) or os.path.basename(fname) != target:
                    unknown.append('heredoc ghi vào một tệp khác bản chấm đang dựng')
                    continue
                arg = node.value.args[0] if node.value.args else None
                if isinstance(arg, ast.Name) and arg.id == 's':
                    continue
                unknown.append('ghi tệp bằng biểu thức không phải s')
                continue
            continue
        unknown.append('câu lệnh %s' % type(node).__name__)
    return ops, unknown


def replay(events, target):
    """dựng lại nội dung `target`.

    Trả về (nội dung, danh sách việc không khớp, danh sách việc không hiểu).
    """
    state = None
    missed, unknown = [], []
    for block in tool_uses(events):
        name = block.get('name')
        inp = block.get('input') or {}
        if name == 'Write':
            fp = inp.get('file_path') or ''
            if os.path.basename(fp) == target:
                state = inp.get('content') or ''
        elif name == 'Edit':
            fp = inp.get('file_path') or ''
            if os.path.basename(fp) != target:
                continue
            if state is None:
                missed.append('Edit trước Write đầu tiên')
                continue
            new, n = apply_edit(state, inp.get('old_string', ''), inp.get('new_string', ''),
                                bool(inp.get('replace_all')))
            if n == 0:
                missed.append('Edit: không tìm thấy old_string (%r)'
                              % (inp.get('old_string', '')[:80]))
            state = new
        elif name == 'Bash':
            cmd = inp.get('command') or ''
            if target not in cmd or state is None:
                continue
            for m in HEREDOC.finditer(cmd):
                body = m.group(2)
                ops, unk = heredoc_replaces(body, target)
                unknown.extend(unk)
                for old, new, count in ops:
                    if not old:
                        continue
                    hits = state.count(old)
                    if hits == 0:
                        missed.append('shell replace: không tìm thấy %r' % old[:80])
                        continue
                    state = state.replace(old, new) if count == 0 else state.replace(old, new, count)
    return state, missed, unknown


# ——— md5 mà người chấm tự in ————————————————————————————————————————

def critic_md5(events, target):
    """md5 cuối cùng mà chính người chấm in ra cho `target`."""
    best = None
    for block in tool_results(events):
        for m in MD5_LINE.finditer(result_text(block)):
            if os.path.basename(m.group(2)) == target:
                best = m.group(1)
    for block in tool_uses(events):
        if block.get('name') == 'Bash':
            cmd = block.get('input', {}).get('command') or ''
            if 'md5sum' in cmd and target in cmd:
                pass
    # và câu trả lời cuối của người chấm, nơi nó tự khoe md5
    for kind, block in events:
        if kind != 'assistant' or block.get('type') != 'text':
            continue
        text = block.get('text') or ''
        if target in text:
            for m in re.finditer(r'\b([0-9a-f]{32})\b', text):
                best = m.group(1)
    return best


def md5_of(text):
    return hashlib.md5(text.encode('utf-8')).hexdigest()


def same_report(a, b):
    """hai bản chấm có phải cùng một bản không.

    `review.sh` làm hai việc với bản chấm trước khi chép ra `review/`: đóng dấu số vòng
    (`ROUND: 1/5`) và thêm chân ký (`---` + `Người chấm: …`). Nên bản nằm trong `review/`
    **không bao giờ** giống hệt bản người chấm viết ra — khác đúng hai chỗ đó. So sánh
    phải bỏ qua chúng, nếu không thì "bản chấm đã mất" và "bản chấm đã sống" trông
    giống nhau.
    """
    def norm(t):
        t = re.sub(r'^ROUND:.*$', 'ROUND:', t, flags=re.M)
        t = re.sub(r'\n---\nNgười chấm:.*\n?$', '\n', t)
        return t.strip()

    return norm(a) == norm(b)


# ——— tìm transcript ————————————————————————————————————————————————

def transcripts():
    """mọi transcript của một vòng chấm còn trên máy."""
    pat = os.path.expanduser('~/.claude/projects/-tmp-lemo-review-*/*.jsonl')
    return sorted(glob.glob(pat))


def episode_needles(episode):
    """những dòng dài của `TREATMENT.md` của tập — dấu vân tay của tập đó.

    Người chấm được đưa `TREATMENT.md` của tập vào thư mục làm việc và đọc nó, nên
    transcript của vòng chấm chứa nguyên văn những dòng đó. Đếm **bao nhiêu dòng dài
    của tập** xuất hiện trong transcript là cách phân biệt tập này với tập khác — mạnh
    hơn nhiều so với đếm từ khóa, vì "dây chun" và "nóng" xuất hiện trong bản chấm của
    tập khác (tập 03 cũng nói về dây chun và nóng).
    """
    p = os.path.join(episode, 'TREATMENT.md')
    if not os.path.exists(p):
        return []
    text = open(p, encoding='utf-8', errors='replace').read()
    return [l.strip() for l in text.split('\n') if len(l.strip()) > 60]


def pick_transcript(target, episode):
    """chọn transcript của tập này.

    Trả về (đường dẫn, điểm, danh sách ứng viên).

    Chọn theo **dấu vân tay của tập** — bao nhiêu dòng dài của `TREATMENT.md` của tập
    xuất hiện trong transcript. Trong số ứng viên cùng điểm, phân biệt bằng câu hỏi
    *bản chấm nào đã mất*: một vòng mà bản chấm của nó vẫn còn trong `review/` thì không
    phải thứ cần dựng lại, và nó bị loại. Nếu vẫn không chọn được, công cụ **không đoán**:
    nó trả về danh sách ứng viên để người gọi tự chỉ đường bằng `--transcript`.
    """
    needles = episode_needles(episode) if episode else []
    survived = None
    if episode:
        p = os.path.join(episode, 'review', target)
        if os.path.exists(p):
            survived = open(p, encoding='utf-8', errors='replace').read()
    scored = []
    for p in transcripts():
        try:
            events = load(p)
        except OSError:
            continue
        state, _, _ = replay(events, target)
        if not state:
            continue
        if needles:
            raw = '\n'.join(result_text(b) for b in tool_results(events))
            raw += '\n' + '\n'.join((b.get('text') or '') for b in tool_uses(events))
            hits = sum(1 for l in needles if l in raw)
        else:
            hits = 0
        scored.append((hits, p, state))
    if not scored:
        return None, 0, []
    scored.sort(key=lambda x: (-x[0], x[1]))
    top = scored[0][0]
    if top == 0:
        return None, 0, [p for _, p, _ in scored]
    tied = [(p, s) for h, p, s in scored if h == top]
    if len(tied) == 1:
        return tied[0][0], top, [tied[0][0]]
    # nhiều vòng chấm của cùng một tập: loại vòng mà bản chấm của nó vẫn còn trong review/
    lost = [(p, s) for p, s in tied if survived is None or not same_report(s, survived)]
    if len(lost) == 1:
        return lost[0][0], top, [p for p, _ in tied]
    return None, top, [p for p, _ in tied]


# ——— dùng ————————————————————————————————————————————————————————

def main(argv=None):
    ap = argparse.ArgumentParser(description='dựng lại bản chấm bị vòng chấm xoá mất')
    ap.add_argument('--transcript', help='đường dẫn transcript của CLI người chấm')
    ap.add_argument('--file', default='STORYBOARD-REVIEW.md', help='tên bản chấm cần dựng lại')
    ap.add_argument('--out', help='ghi bản dựng lại ra đây (mặc định: in ra màn hình)')
    ap.add_argument('--episode', help='thư mục tập — dùng để chọn đúng transcript')
    ap.add_argument('--selftest', action='store_true')
    args = ap.parse_args(argv)

    if args.selftest:
        return selftest()

    target = args.file
    paths = []
    if args.transcript:
        paths = [args.transcript]
    elif args.episode:
        best, score, candidates = pick_transcript(target, args.episode)
        if best is None:
            print('recover_review: không chọn được transcript của %s cho bản chấm %s.'
                  % (args.episode, target), file=sys.stderr)
            if candidates:
                print('recover_review: %d ứng viên có cùng điểm — chỉ định --transcript bằng tay:'
                      % len(candidates), file=sys.stderr)
                for p in candidates:
                    print('    %s' % p, file=sys.stderr)
            else:
                print('recover_review: không có transcript nào trên máy chứa bản chấm %s.'
                      % target, file=sys.stderr)
            return 2
        print('recover_review: chọn transcript %s (khớp %d dòng của TREATMENT.md của tập)'
              % (best, score))
        paths = [best]
    else:
        print('recover_review: cần --transcript hoặc --episode', file=sys.stderr)
        return 3

    if len(paths) != 1:
        print('recover_review: cần đúng một transcript', file=sys.stderr)
        return 3

    events = load(paths[0])
    state, missed, unknown = replay(events, target)
    if state is None:
        print('recover_review: transcript %s không có bản chấm %s' % (paths[0], target), file=sys.stderr)
        return 2

    got = md5_of(state)
    want = critic_md5(events, target)
    print('recover_review: transcript %s' % paths[0])
    print('recover_review: bản dựng lại %d byte, md5 %s' % (len(state.encode('utf-8')), got))
    if want:
        if want == got:
            print('recover_review: khớp md5 người chấm tự in (%s) — bản dựng lại ĐÚNG BYTE NÀO' % want)
        else:
            print('recover_review: KHỚP — người chấm in %s, dựng lại ra %s. Bản này KHÔNG đúng byte nào.'
                  % (want, got), file=sys.stderr)
    else:
        print('recover_review: không tìm thấy md5 người chấm tự in — không có gì để đối chiếu.', file=sys.stderr)
    for m in missed:
        print('recover_review: không khớp — %s' % m, file=sys.stderr)
    for u in unknown:
        print('recover_review: không hiểu — %s' % u, file=sys.stderr)

    if args.out:
        try:
            with open(args.out, 'x', encoding='utf-8') as f:
                f.write(state)
        except FileExistsError:
            print('recover_review: %s đã có — không ghi đè. Chọn tên khác.' % args.out, file=sys.stderr)
            return 2
        print('recover_review: đã ghi %s' % args.out)

    ok = (want == got) and not missed and not unknown
    return 0 if ok else 1


# ——— selftest ————————————————————————————————————————————————————————

def selftest():
    import tempfile

    def transcript_of(blocks):
        recs = []
        for b in blocks:
            recs.append(json.dumps({'type': 'assistant', 'message': {'role': 'assistant',
                                                                      'content': [b]}},
                                    ensure_ascii=False))
        return '\n'.join(recs) + '\n'

    base = '# Bản chấm\n\nVERDICT: REJECT\n\n  9. Thẻ `14 %` ở c36\n  10. c4 dùng góc nhìn xuống\n'
    # một Write, một Edit, một heredoc sửa chữa
    heredoc = ("python3 - <<'EOF'\n"
               "p='/tmp/lemo-review-XXXX/STORYBOARD-REVIEW.md'\n"
               "s=open(p).read()\n"
               "s=s.replace(\"  9. Thẻ `14 %` ở c36\",\"  10. Thẻ `14 %` ở c36\")\n"
               "open(p,'w').write(s)\n"
               "EOF\n")
    blocks = [
        {'type': 'tool_use', 'name': 'Write',
         'input': {'file_path': '/tmp/lemo-review-XXXX/STORYBOARD-REVIEW.md', 'content': base}},
        {'type': 'tool_use', 'name': 'Edit',
         'input': {'file_path': '/tmp/lemo-review-XXXX/STORYBOARD-REVIEW.md',
                   'old_string': '  10. c4 dùng góc nhìn xuống',
                   'new_string': '  11. c4 dùng góc nhìn xuống'}},
        {'type': 'tool_use', 'name': 'Bash', 'input': {'command': heredoc}},
    ]
    events = load_from_text(transcript_of(blocks))
    state, missed, unknown = replay(events, 'STORYBOARD-REVIEW.md')
    assert state is not None, 'phải dựng lại được'
    assert '  10. Thẻ' in state, 'heredoc phải đổi số thứ tự'
    assert '  11. c4' in state, 'Edit phải áp dụng'
    assert not missed, missed
    assert not unknown, unknown

    # một Edit không khớp phải được báo, không được bỏ qua im lặng
    bad = [blocks[0], {'type': 'tool_use', 'name': 'Edit',
                       'input': {'file_path': '/tmp/lemo-review-XXXX/STORYBOARD-REVIEW.md',
                                 'old_string': 'KHÔNG CÓ TRONG TỆP', 'new_string': 'x'}}]
    state, missed, unknown = replay(load_from_text(transcript_of(bad)), 'STORYBOARD-REVIEW.md')
    assert missed, 'Edit không khớp phải được báo'

    # md5 người chấm in ra phải được đọc và dùng làm chuẩn
    recs = transcript_of(blocks)
    recs += json.dumps({'type': 'user', 'message': {'role': 'user', 'content': [
        {'type': 'tool_result', 'content': '92ecbcc7d16a0e9ec74a74ecda8d8958  STORYBOARD-REVIEW.md\n'}]}},
        ensure_ascii=False) + '\n'
    events = load_from_text(recs)
    state, _, _ = replay(events, 'STORYBOARD-REVIEW.md')
    assert critic_md5(events, 'STORYBOARD-REVIEW.md') == '92ecbcc7d16a0e9ec74a74ecda8d8958'

    print('recover_review: selftest OK')
    return 0


def load_from_text(text):
    """load() nhưng từ một chuỗi (cho selftest)."""
    import tempfile
    with tempfile.NamedTemporaryFile('w', suffix='.jsonl', delete=False, encoding='utf-8') as f:
        f.write(text)
        path = f.name
    try:
        return load(path)
    finally:
        os.unlink(path)


if __name__ == '__main__':
    sys.exit(main())
