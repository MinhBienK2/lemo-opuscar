#!/usr/bin/env python3
"""Mỗi câu kể phải có nhát của riêng nó — kiểm bằng máy, không bằng mắt.

Kênh nói một luật rõ ràng: **một câu, một hình**. Câu `c12` được kể thì phải có một nhát
riêng mang câu đó; không có thì khán giả nhìn một hình đứng yên trong lúc người kể vẫn
nói tiếp. Nhưng chẳng có máy nào đo chuyện đó: `src/film.js` của tập 3D khai báo danh sách
nhát (`const SHOTS = [...]`), mỗi nhát gắn với câu nó mang, còn `voice/lines.json` khai
báo các câu đã kể — và không có bài kiểm nào nối hai danh sách đó với nhau. Một câu rơi
khỏi danh sách nhát thì phim vẫn được dựng, vẫn có tiếng, và không ai hay.

Bài kiểm này đọc hai danh sách đó và nói ra chỗ lệch:

  1. **S1** — mỗi câu trong `voice/lines.json` phải có ít nhất một nhát mang nó.
     Câu không có nhát = hình đứng yên suốt câu nói.
  2. **S2** — mỗi câu một nhát mang phải có thật trong `voice/lines.json`.
     Nhát gọi tên một câu không tồn tại là nhát vô nghĩa.
  3. **S3** — không câu nào được hai nhát mang. Câu đó chỉ có một hình.
  4. **S4** — các nhát đi theo thứ tự lời: đọc các câu theo thứ tự nhát, không được lùi.
     Nhát mang `c40` đứng trước nhát mang `c10` là hình ngược lời.
  5. **S5** — mỗi nhát mang **đúng một** câu: một nhát nuốt hai câu là cách làm cho hình
     tụt lại sau lời.

Cách đọc: `src/film.js` được bỏ comment trước (một nhát bị comment ra không phải nhát),
rồi đọc mảng `SHOTS`. Mỗi phần tử của mảng là một nhát, viết theo một trong hai cách:

    sh('N1', 'c1', 40, [...], [...], [0, 0, 0])      // nhát gọi hàm `sh`
    { s: 'N1', ids: ['c51'], fov: 30, pose: ... }    // nhát viết thẳng, có thể mang nhiều câu

Dùng:  python3 channels/tram-nghi-nhieu/tools/check_shots.py <tập>
Thoát mã 0 = mọi câu có nhát của riêng nó; 1 = có lỗi (in ra từng cái); 2 = không chạy được
(sai cú pháp dòng lệnh, hoặc thiếu file) — và nói rõ thiếu gì.
"""
import json
import os
import re
import sys
import tempfile
import contextlib
import io

# ── đọc mã nguồn: bỏ comment, không cắt nhầm trong chuỗi ────────────────────


def strip_comments(src):
    """bản của mã nguồn đã bỏ comment, giữ nguyên độ dài (mỗi ký tự comment thành khoảng trắng).

    Một nhát bị comment ra không phải nhát: nếu không bỏ comment, dòng
    `// sh('N1', 'c9', ...)` sẽ được đếm như một nhát thật.
    """
    out = list(src)
    i, n = 0, len(src)
    while i < n:
        c = src[i]
        if c == '/' and i + 1 < n and src[i + 1] == '/':
            j = src.find('\n', i)
            j = n if j < 0 else j
            for k in range(i, j):
                out[k] = ' '
            i = j
        elif c == '/' and i + 1 < n and src[i + 1] == '*':
            j = src.find('*/', i + 2)
            j = n if j < 0 else j + 2
            for k in range(i, j):
                if out[k] != '\n':
                    out[k] = ' '
            i = j
        elif c in '"\'':
            quote = c
            i += 1
            while i < n:
                if src[i] == '\\':
                    i += 2
                    continue
                if src[i] == quote:
                    i += 1
                    break
                if src[i] == '\n':
                    break            # chuỗi không đóng trên dòng này: dừng ở đây
                i += 1
        else:
            i += 1
    return ''.join(out)


def shots_body(src):
    """phần thân của mảng `SHOTS` (giữa `[` ngoài cùng và `]` ngoài cùng), hoặc None.

    Dấu ngoặc trong chuỗi không được tính: `']'` trong một nhãn không đóng mảng.
    """
    m = re.search(r'\bSHOTS\s*=\s*\[', src)
    if not m:
        return None
    start = src.index('[', m.start())
    depth = 0
    i, n = start, len(src)
    while i < n:
        c = src[i]
        if c in '"\'':
            quote = c
            i += 1
            while i < n:
                if src[i] == '\\':
                    i += 2
                    continue
                if src[i] == quote:
                    i += 1
                    break
                i += 1
            continue
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                return src[start + 1:i]
        i += 1
    return None


def split_entries(body):
    """chia mảng SHOTS thành từng phần tử, theo dấu phẩy ở độ sâu 0."""
    parts, cur = [], []
    depth = 0
    i, n = 0, len(body)
    while i < n:
        c = body[i]
        if c in '"\'':
            quote = c
            j = i + 1
            while j < n:
                if body[j] == '\\':
                    j += 2
                    continue
                if body[j] == quote:
                    break
                j += 1
            cur.append(body[i:j + 1])
            i = j + 1
            continue
        if c in '([{':
            depth += 1
        elif c in ')]}':
            depth -= 1
        if c == ',' and depth == 0:
            parts.append(''.join(cur))
            cur = []
        else:
            cur.append(c)
        i += 1
    if ''.join(cur).strip():
        parts.append(''.join(cur))
    return parts


def call_args(entry):
    """các đối số của lời gọi hàm ở đầu phần tử, hoặc None nếu phần tử không phải lời gọi hàm."""
    m = re.match(r'\s*([A-Za-z_$][\w$]*)\s*\(', entry)
    if not m:
        return None
    start = entry.index('(', m.start())
    depth = 0
    i, n = start, len(entry)
    while i < n:
        c = entry[i]
        if c in '"\'':
            quote = c
            i += 1
            while i < n:
                if entry[i] == '\\':
                    i += 2
                    continue
                if entry[i] == quote:
                    i += 1
                    break
                i += 1
            continue
        if c in '([{':
            depth += 1
        elif c in ')]}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    inner = entry[start + 1:i]
    args, cur, depth = [], [], 0
    j = 0
    while j < len(inner):
        c = inner[j]
        if c in '"\'':
            quote = c
            k = j + 1
            while k < len(inner):
                if inner[k] == '\\':
                    k += 2
                    continue
                if inner[k] == quote:
                    break
                k += 1
            cur.append(inner[j:k + 1])
            j = k + 1
            continue
        if c in '([{':
            depth += 1
        elif c in ')]}':
            depth -= 1
        if c == ',' and depth == 0:
            args.append(''.join(cur))
            cur = []
        else:
            cur.append(c)
        j += 1
    args.append(''.join(cur))
    return args


def literal(text):
    """giá trị của một chuỗi nguyên văn, hoặc None nếu không phải chuỗi nguyên văn."""
    t = text.strip()
    if len(t) >= 2 and t[0] in '"\'' and t[-1] == t[0]:
        return t[1:-1]
    return None


IDS_FIELD = re.compile(r'\bids\s*:\s*\[([^\]]*)\]')
IDS_KEY = re.compile(r'\bids\s*:')


def shot_ids(entry):
    """(các câu nhát mang, đọc được hay không).

    Nhát viết bằng lời gọi `sh(set, câu, …)` mang đúng một câu; nhát viết thẳng bằng
    `ids: ['c7', 'c8']` có thể mang nhiều câu. Câu không phải chuỗi nguyên văn (một
    biến, một hàm) thì máy không đọc được — và một bài kiểm không đọc được thì không
    được kết luận gì.
    """
    args = call_args(entry)
    if args is not None and len(args) >= 2:
        set_name = literal(args[0]) or '?'
        ids = literal(args[1])
        if ids is None:
            return set_name, None
        return set_name, [ids]
    m = IDS_FIELD.search(entry)
    if m:
        set_name = None
        s = re.search(r"\bs\s*:\s*'([^']*)'", entry)
        if s:
            set_name = s.group(1)
        raw = [x for x in m.group(1).split(',') if x.strip()]
        ids = []
        for x in raw:
            v = literal(x)
            if v is None:
                return set_name or '?', None
            ids.append(v)
        return set_name or '?', ids
    if IDS_KEY.search(entry):
        # `ids: IDS` — danh sách câu nằm trong một biến: máy không đọc được, nên không kết luận được
        return '?', None
    return '?', []


def shots_of(src):
    """các nhát của phim: mỗi nhát là (số thứ tự, tên bối cảnh, danh sách câu, đọc được hay không)."""
    body = shots_body(src)
    if body is None:
        return None
    out = []
    for entry in split_entries(body):
        if not entry.strip():
            continue
        set_name, ids = shot_ids(entry)
        out.append((len(out) + 1, set_name, ids if ids is not None else [], ids is not None))
    return out


# ── luật ───────────────────────────────────────────────────────────────────


def check_episode(folder):
    """(các lỗi, mã thoát). Mã 2 = không chạy được (thiếu file, hoặc đọc không nổi)."""
    film_path = os.path.join(folder, 'src', 'film.js')
    lines_path = os.path.join(folder, 'voice', 'lines.json')
    for path in (film_path, lines_path):
        if not os.path.isfile(path):
            return [f'thiếu {path}'], 2

    try:
        lines = json.load(open(lines_path, encoding='utf-8'))
    except (OSError, ValueError) as e:
        return [f'không đọc được {lines_path}: {e}'], 2
    if not isinstance(lines, list):
        return [f'{lines_path} không phải một danh sách câu'], 2
    line_ids = [l.get('id') for l in lines if isinstance(l, dict)]
    if any(not i for i in line_ids):
        return [f'{lines_path} có một câu không có mã (id)'], 2

    try:
        src = strip_comments(open(film_path, encoding='utf-8').read())
    except OSError as e:
        return [f'không đọc được {film_path}: {e}'], 2

    shots = shots_of(src)
    if shots is None:
        return [f'không tìm thấy mảng SHOTS trong {film_path} — bài kiểm này không đọc '
                f'được danh sách nhát của phim, nên không kết luận được gì'], 2

    unreadable = [no for no, _s, _i, ok in shots if not ok]
    if unreadable:
        return [f'nhát {", ".join(str(n) for n in unreadable)} gắn câu bằng biểu thức, '
                f'máy không đọc được câu nào — bài kiểm này không kết luận được gì'], 2

    order = {lid: i for i, lid in enumerate(line_ids)}
    problems = []

    # S1 — mỗi câu có nhất một nhát mang nó
    carried = {}
    for no, set_name, ids, _ok in shots:
        for lid in ids:
            where = carried.setdefault(lid, [])
            if not any(n == no for n, _s in where):   # một nhát không mang hai lần cùng một câu
                where.append((no, set_name))
    for lid in line_ids:
        if lid not in carried:
            problems.append(
                f"câu '{lid}' không có nhát nào mang — khán giả nhìn một hình đứng yên "
                f"suốt câu nói")

    # S2 — nhát gọi tên một câu không có trong lời kể
    for no, set_name, ids, _ok in shots:
        for lid in ids:
            if lid not in order:
                problems.append(
                    f"nhát {no} ({set_name}) mang câu '{lid}' không có trong voice/lines.json")

    # S3 — không câu nào được hai nhát mang
    for lid, where in carried.items():
        if len(where) > 1:
            nos = ', '.join(str(no) for no, _s in where)
            problems.append(
                f"câu '{lid}' bị {len(where)} nhát mang (nhát {nos}) — một câu chỉ có một hình")

    # S4 — các nhát đi theo thứ tự lời
    last = None
    for no, set_name, ids, _ok in shots:
        for lid in ids:
            if lid not in order:
                continue
            if last is not None and order[lid] < order[last[1]]:
                problems.append(
                    f"nhát {no} mang câu '{lid}' nhưng câu '{last[1]}' đã đi trước ở nhát "
                    f"{last[0]} — hình không theo thứ tự lời kể")
            last = (no, lid)

    # S5 — mỗi nhát mang đúng một câu
    for no, set_name, ids, _ok in shots:
        if len(ids) != 1:
            got = ', '.join(f"'{i}'" for i in ids) if ids else 'không câu nào'
            problems.append(
                f"nhát {no} ({set_name}) mang {len(ids)} câu ({got}) — luật của kênh là "
                f"một câu một nhát")

    return problems, (1 if problems else 0)


# ── tự kiểm ───────────────────────────────────────────────────────────────

HERE = os.path.dirname(os.path.abspath(__file__))
CHANNEL = os.path.abspath(os.path.join(HERE, '..'))
SERIES = os.path.join(CHANNEL, 'series')


def real_episode(name):
    """đường dẫn một tập thật của kênh (tìm trong series/<cột>/<tập>)."""
    for col in sorted(os.listdir(SERIES)) if os.path.isdir(SERIES) else []:
        cands = os.path.join(SERIES, col, name)
        if os.path.isfile(os.path.join(cands, 'src', 'film.js')):
            return cands
    return None


def copy_episode(src, dst):
    """chép một tập thật vào thư mục tạm (tập thật không bao giờ bị sửa)."""
    os.makedirs(os.path.join(dst, 'src'))
    os.makedirs(os.path.join(dst, 'voice'))
    for rel in ('src/film.js', 'voice/lines.json'):
        with open(os.path.join(src, rel), encoding='utf-8') as f:
            body = f.read()
        with open(os.path.join(dst, rel), 'w', encoding='utf-8') as f:
            f.write(body)


def fake_episode(dst, ids, shots):
    """dựng một tập nhỏ: các câu `ids`, các nhát `shots` (mỗi nhát là (set, [câu]))."""
    os.makedirs(os.path.join(dst, 'src'), exist_ok=True)
    os.makedirs(os.path.join(dst, 'voice'), exist_ok=True)
    lines = [{'id': i, 'text': f'Câu {i}.', 'gap': 0.3} for i in ids]
    with open(os.path.join(dst, 'voice', 'lines.json'), 'w', encoding='utf-8') as f:
        json.dump(lines, f, ensure_ascii=False)
    body = ["const SHOTS = ["]
    for set_name, shot_ids_ in shots:
        if len(shot_ids_) == 1 and re.fullmatch(r'c\d+', shot_ids_[0]):
            body.append(f"  sh('{set_name}', '{shot_ids_[0]}', 40, [0, 0, 0], [0, 0, 0]),")
        else:
            ids_txt = ', '.join(f"'{i}'" for i in shot_ids_)
            body.append(f"  {{ s: '{set_name}', ids: [{ids_txt}], fov: 40, }},")
    body.append("];")
    with open(os.path.join(dst, 'src', 'film.js'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(body) + '\n')


def selftest():
    """một bài kiểm trả lời "không có gì sai" với mọi thứ thì không phải bài kiểm.

    Mỗi ca dựng một tập trong thư mục tạm và chạy đúng bộ kiểm này; hai tập thật của kênh
    (tập 01 và tập 02) được chép vào thư mục tạm để chứng minh bài kiểm chấp nhận phim
    thật — tập thật không bao giờ bị sửa.
    """
    cases = []

    with tempfile.TemporaryDirectory() as td:
        # 1. hai tập thật của kênh: không lỗi nào
        for name in ('tap-01-phoi-quan-ao', 'tap-02-dien-thoai-nong-luc-sac'):
            real = real_episode(name)
            if not real:
                cases.append((f'tập thật {name} có trong kênh', False, 'không tìm thấy tập'))
                continue
            dst = os.path.join(td, name)
            copy_episode(real, dst)
            problems, code = check_episode(dst)
            cases.append((f'tập thật {name} qua bài kiểm', code == 0 and not problems,
                          f'exit {code}: {problems[:2]}'))

        # 2. một câu không có nhát
        d = os.path.join(td, 'no-shot')
        fake_episode(d, ['c1', 'c2'], [('N1', ['c1'])])
        problems, code = check_episode(d)
        cases.append(('một câu không có nhát bị báo', code == 1 and
                      any("'c2' không có nhát" in p for p in problems), f'exit {code}: {problems}'))

        # 3. một nhát gọi tên câu không có thật
        d = os.path.join(td, 'ghost')
        fake_episode(d, ['c1'], [('N1', ['c1']), ('N4', ['c9'])])
        problems, code = check_episode(d)
        cases.append(('một nhát gọi tên câu không có thật bị báo', code == 1 and
                      any("không có trong voice/lines.json" in p for p in problems),
                      f'exit {code}: {problems}'))

        # 4. một câu bị hai nhát mang
        d = os.path.join(td, 'twice')
        fake_episode(d, ['c1', 'c2'], [('N1', ['c1']), ('N4', ['c1'])])
        problems, code = check_episode(d)
        cases.append(('một câu bị hai nhát mang bị báo', code == 1 and
                      any("bị 2 nhát mang" in p for p in problems), f'exit {code}: {problems}'))

        # 5. các nhát đi ngược thứ tự lời
        d = os.path.join(td, 'backwards')
        fake_episode(d, ['c1', 'c2', 'c3'], [('N1', ['c3']), ('N4', ['c1'])])
        problems, code = check_episode(d)
        cases.append(('các nhát đi ngược thứ tự lời bị báo', code == 1 and
                      any('không theo thứ tự lời kể' in p for p in problems),
                      f'exit {code}: {problems}'))

        # 6. một nhát mang hai câu
        d = os.path.join(td, 'two-in-one')
        fake_episode(d, ['c1', 'c2'], [('N1', ['c1', 'c2'])])
        problems, code = check_episode(d)
        cases.append(('một nhát mang hai câu bị báo', code == 1 and
                      any('mang 2 câu' in p for p in problems), f'exit {code}: {problems}'))

        # 7. thiếu voice/lines.json: không chạy được, không phải lỗi của phim
        d = os.path.join(td, 'no-lines')
        fake_episode(d, ['c1'], [('N1', ['c1'])])
        os.remove(os.path.join(d, 'voice', 'lines.json'))
        problems, code = check_episode(d)
        cases.append(('thiếu voice/lines.json thì thoát mã 2', code == 2 and
                      any('thiếu' in p for p in problems), f'exit {code}: {problems}'))

        # 8. một nhát gắn câu bằng biểu thức: máy không đọc được, nên không kết luận được gì
        d = os.path.join(td, 'unreadable')
        fake_episode(d, ['c1'], [('N1', ['c1'])])
        with open(os.path.join(d, 'src', 'film.js'), 'w', encoding='utf-8') as f:
            f.write("const IDS = ['c1'];\nconst SHOTS = [\n"
                    "  { s: 'N1', ids: IDS, fov: 40, },\n];\n")
        problems, code = check_episode(d)
        cases.append(('nhát gắn câu bằng biểu thức thì thoát mã 2', code == 2 and
                      any('không đọc được' in p for p in problems), f'exit {code}: {problems}'))

        # 9. dòng lệnh không có đối số
        argv = sys.argv
        sys.argv = ['check_shots.py']
        buf = io.StringIO()
        err = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(err):
                code = main([])
        finally:
            sys.argv = argv
        cases.append(('dòng lệnh thiếu đối số thì thoát mã 2', code == 2, f'exit {code}'))

    bad = 0
    for name, ok, got in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}' + ('' if ok else f' — {got}'))
        if not ok:
            bad += 1
    if bad:
        print(f'FAIL: {bad} ca')
        return 1
    print('ok')
    return 0


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    if '--selftest' in argv:
        return selftest()
    if not argv:
        print('usage: check_shots.py <tập>', file=sys.stderr)
        return 2
    folder = argv[0]
    if not os.path.isdir(folder):
        print(f'check_shots: không có thư mục tập {folder}', file=sys.stderr)
        return 2
    problems, code = check_episode(folder)
    if code == 2:
        for p in problems:
            print(f'check_shots: {p}', file=sys.stderr)
        print('check_shots: không chạy được — không kết luận được gì về phim này',
              file=sys.stderr)
        return 2
    if problems:
        print(f'check_shots: {len(problems)} lỗi')
        for p in problems:
            print(f'  {p}')
        return 1
    print('check_shots: mọi câu đều có nhát của riêng nó')
    return 0


if __name__ == '__main__':
    sys.exit(main())
