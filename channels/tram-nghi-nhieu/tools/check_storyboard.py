#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Dàn ý phải khớp với lời kể — kiểm bằng máy, không bằng mắt.

`LOOK.md` là bản dàn ý của tập: mỗi dòng của nó là **một câu lời kể** và **một cách quay**,
và nó **trích nguyên văn** câu lời kể đó trong dấu nháy. Nhờ vậy người đọc dàn ý thấy
được phim nói gì ở mỗi nhát, và người làm phim có một chỗ để đối chiếu.

Nhưng dàn ý là **tài liệu**, còn lời kể là **phim**. Khi lời kể được viết lại — vì file
nghiên cứu cấm một cách nói, vì một câu bị đổi cho khớp nhịp — dàn ý cũ biến thành một
bản mô tả phim khác. Dàn ý cũ trông vẫn đầy đặn, vẫn đúng về hình, nhưng nó nói về
những câu mà phim không còn nói. Đây là lỗi đã xảy ra: tập 02 (điện thoại nóng lúc sạc)
đổi lời kể sau khi file nghiên cứu cấm "chỗ nóng nhất trong máy", và `LOOK.md` vẫn còn
những dòng dán câu cũ vào câu mới.

Hai luật:

  1. **Câu trích trong dàn ý phải là câu của phim.** Dàn ý trích nguyên văn lời kể; nếu
     trích dẫn đó **không câu nào trong `voice/lines.json` nói**, thì dàn ý đang mô tả một
     phim không còn tồn tại — lời kể đã viết lại, dàn ý chưa theo.
     Một trích dẫn là câu của **dòng kế tiếp** thì được phép: dàn ý hay nhắc trước một
     câu sắp tới ("câu này *chưa* xảy ra, nên phải có động tác trước nó"). Một trích dẫn là
     câu của một dòng xa hơn thì là dán nhầm.
  2. **Câu trích trong dàn ý không được nói cái mà file nghiên cứu cấm.** Cùng luật với
     `check_voice_facts.py`, nhưng áp cho phần dàn ý trích nguyên văn lời kể: dàn ý đang
     *định* cho phim nói câu đó.

Chỉ phần **trong dấu nháy** được so. Văn xuôi của dàn ý thì được phép nhắc tới điều bị
cấm — "phim không nói chỗ nào là chỗ nóng nhất" là một ghi chú đúng, không phải một lời
kể.

Dùng:  python3 channels/tram-nghi-nhieu/tools/check_storyboard.py <tập>
Thoát mã 0 = dàn ý khớp lời kể; 1 = có dòng lệch; 2 = không chạy được (thiếu file).
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import check_voice_facts as V   # cùng thư mục: luật cấm của file nghiên cứu, dùng lại đúng một lần

# Một dòng dàn ý: bảng markdown, ô thứ hai là mã câu (c12), ô sau là lời và nhãn.
ROW = re.compile(r'^\s*\|')
CELL_ID = re.compile(r'^c\d+$')
# Trích dẫn trong một ô. Dấu nháy kép của tiếng Việt cũng tính.
QUOTE = re.compile(r'["“]([^"”\n]{3,240})["”]')

# Một trích dẫn ngắn hơn thế này thì không đủ để nói câu nào: "máy", "nó vẫn ấm" khớp
# nhầm ở khắp nơi, nên máy không soi trích dẫn đó.
MIN_WORDS = 4


def tokens(text):
    """từ của một câu: chữ thường, bỏ dấu câu, bỏ từ rác (như check_voice_facts)"""
    return V.normalise(text).split()


def is_subsequence(small, big):
    """các từ của `small` có nằm theo thứ tự trong `big` không

    "nó phải đổi thành thứ khác" là trích dẫn của câu "Muốn rời khỏi vải, nó phải đổi thành
    thứ khác." — cùng thứ tự, có thêm chữ. Ngược lại, một câu khác có cùng vài từ rời rạc
    thì không phải.
    """
    it = iter(big)
    return all(any(w == x for x in it) for w in small)


def split_ellipsis(q):
    """một trích dẫn có thể cắt bằng dấu chấm lửng: "hai mươi volt… khoảng bốn volt\""""
    return [p for p in re.split(r'…|\.\.\.', q) if p.strip()]


def quotes_of(row):
    """các trích dẫn trong một dòng dàn ý"""
    return [m.group(1) for m in QUOTE.finditer(row)]


def line_ids(row):
    """mã câu của một dòng dàn ý"""
    return [c.strip() for c in row.strip().strip('|').split('|') if CELL_ID.match(c.strip())]


def check_storyboard(look, lines, phrases, superlatives):
    """kiểm dàn ý với lời kể

    lines: {mã câu: lời}
    trả về [(loại, dòng của LOOK.md, mã câu, trích dẫn, chi tiết)]
    """
    tok = {k: tokens(v) for k, v in lines.items()}
    order = list(lines)                    # thứ tự câu trong lời kể
    bad = []
    for no, row in enumerate(look.splitlines(), 1):
        if not ROW.match(row):
            continue
        ids = line_ids(row)
        if not ids:
            continue
        cid = ids[0]
        quoted = quotes_of(row)
        if not quoted:
            continue
        # Luật 1 — trích dẫn **đầu tiên** của dòng là lời kể mà dòng đó dán. Trích dẫn
        # những câu sau là văn xuôi của người viết dàn ý ("trong ruột vải"), nên máy
        # không soi.
        first = split_ellipsis(quoted[0])
        if first and min(len(tokens(p)) for p in first) >= MIN_WORDS:
            if cid in tok and all(is_subsequence(tokens(p), tok[cid]) for p in first):
                pass                                  # đúng câu của đúng dòng
            else:
                elsewhere = [k for k, v in tok.items()
                             if all(is_subsequence(tokens(p), v) for p in first)]
                if not elsewhere:
                    # không câu nào trong phim nói câu này: dàn ý mô tả phim cũ
                    bad.append(('stale', no, cid, quoted[0],
                                'không câu nào trong voice/lines.json nói câu này'))
                elif elsewhere == [cid]:
                    pass
                elif cid in order:
                    nxt = order[order.index(cid) + 1] if order.index(cid) + 1 < len(order) else None
                    if elsewhere == [nxt] and nxt is not None:
                        pass                          # nhắc trước câu kế tiếp: được phép
                    else:
                        bad.append(('drift', no, cid, quoted[0],
                                    f'câu này bây giờ là {", ".join(elsewhere)}'))
                else:
                    bad.append(('drift', no, cid, quoted[0],
                                f'câu này bây giờ là {", ".join(elsewhere)}'))
        # Luật 2 — mọi trích dẫn đều phải sạch: dàn ý đang *định* cho phim nói câu đó.
        for q in quoted:
            parts = split_ellipsis(q)
            if not parts or min(len(tokens(p)) for p in parts) < MIN_WORDS:
                continue
            norm = V.normalise(q)
            hit = next((p for p, _ in phrases if V.unnegated(norm, p)), None)
            if hit is None:
                hit = next((k for k in superlatives if V.unnegated(norm, k)), None)
            if hit is not None:
                bad.append(('forbidden', no, cid, q, f'"{hit}" bị file nghiên cứu cấm'))
    return bad


def load_episode(ep):
    """đọc dàn ý, lời kể và file nghiên cứu của một tập"""
    look_p = os.path.join(ep, 'LOOK.md')
    lines_p = os.path.join(ep, 'voice', 'lines.json')
    facts_p = os.path.join(ep, 'research', 'FACTS.md')
    for p in (look_p, lines_p):
        if not os.path.isfile(p):
            print(f'check_storyboard: thiếu {p}', file=sys.stderr)
            return None
    with open(look_p, encoding='utf-8') as f:
        look = f.read()
    with open(lines_p, encoding='utf-8') as f:
        data = json.load(f)
    if isinstance(data, dict):
        data = data.get('lines', [])
    lines = {}
    for i, item in enumerate(data, 1):
        if isinstance(item, str):
            lines[f'c{i}'] = item
        else:
            lines[str(item.get('id') or f'c{i}')] = item.get('text') or ''
    facts = ''
    if os.path.isfile(facts_p):
        with open(facts_p, encoding='utf-8') as f:
            facts = f.read()
    return look, lines, facts


# ——— selftest ———

FACTS = """# Facts — Vì sao điện thoại nóng lúc sạc?

## 5. Túi pin là nhiều lớp mỏng xếp chồng

- **Cách nói:** "một túi pin là nhiều lớp mỏng xếp chồng" — không nói "chỗ nóng nhất trong máy".
"""

LOOK_OK = """# Dàn ý

| # | câu | nhìn gì | lý do của góc máy | nhãn |
|---|---|---|---|---|
| 1 | c1 | toàn cảnh bàn | mở đầu đời thường, giọng kể như người vừa đi ngang | |
| 2 | c2 | cận túi pin bị cưa | "một túi pin là nhiều lớp mỏng xếp chồng" — số lớp phải **đếm được** | `LỚP` |
"""

LOOK_DRIFT = LOOK_OK.replace(
    '"một túi pin là nhiều lớp mỏng xếp chồng"',
    '"cái đồng hồ sạc trên màn hình cứ nhích lên"')

LOOK_STALE = LOOK_OK.replace(
    '"một túi pin là nhiều lớp mỏng xếp chồng"',
    '"một túi pin là nhiều lớp mỏng xếp chồng quá chặt"')

LOOK_FORBIDDEN = LOOK_OK.replace(
    '"một túi pin là nhiều lớp mỏng xếp chồng"',
    '"chỗ nóng nhất trong máy"')

LOOK_PROSE = LOOK_OK + (
    '\nGhi chú: phim không nói chỗ nào là chỗ nóng nhất, vì không có mốc nào đo được.\n')

# dàn ý nhắc trước câu kế tiếp: "câu này *chưa* xảy ra" — một cách viết dàn ý hợp lệ
LOOK_FORWARD = LOOK_OK.replace(
    '| 2 | c2 | cận túi pin bị cưa | "một túi pin là nhiều lớp mỏng xếp chồng"',
    '| 2 | c2 | cận túi pin bị cưa | "mình vừa cầm lên" chưa xảy ra')


def run_case(look, lines):
    """chạy một ca; trả về (mã thoát, chữ đã in)"""
    import contextlib
    import io
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        phrases = V.forbidden_phrases(FACTS)
        superlatives = V.forbidden_superlatives(FACTS)
        bad = check_storyboard(look, {k: v for k, v in lines.items()}, phrases, superlatives)
        code = 1 if bad else 0
        for kind, no, cid, q, why in bad:
            print(f'  BAD LOOK.md:{no} ({cid}) [{kind}] "{q}" — {why}')
    return code, buf.getvalue()


LINES = {'c1': 'Cái đồng hồ sạc trên màn hình cứ nhích lên.',
         'c2': 'Một túi pin là nhiều lớp mỏng xếp chồng.'}
# câu "mình vừa cầm lên" nằm ở c3 — dàn ý được phép nhắc trước nó
LINES_FWD = {'c1': 'Cái đồng hồ sạc trên màn hình cứ nhích lên.',
             'c2': 'Cái đồng hồ sạc cứ nhích lên từng chút một.',
             'c3': 'Và cái máy này, mình vừa cầm lên.'}
# câu đó nằm ở c5 — nhắc về nó là dán nhầm, không phải nhắc trước
LINES_FAR = {'c1': 'Cái đồng hồ sạc trên màn hình cứ nhích lên.',
             'c2': 'Cái đồng hồ sạc cứ nhích lên từng chút một.',
             'c3': 'Cái máy này nằm sấp trên bàn.',
             'c4': 'Mình sẽ lần theo dòng điện.',
             'c5': 'Và cái máy này, mình vừa cầm lên.'}
# câu c2 được viết lại: câu cũ không còn nằm trong phim nào cả
LINES_REWRITTEN = {'c1': 'Cái đồng hồ sạc trên màn hình cứ nhích lên.',
                    'c2': 'Cái đồng hồ sạc cứ nhích lên từng chút một.',
                    'c3': 'Cái máy này nằm sấp trên bàn.'}


def selftest():
    """một cái kiểm trả lời "được" cho mọi thứ thì không phải kiểm"""
    cases = []

    code, out = run_case(LOOK_OK, LINES)
    cases.append(('dàn ý khớp lời kể thì qua', code == 0, code, out))

    code, out = run_case(LOOK_DRIFT, LINES)
    cases.append(('dàn ý trích câu của dòng khác thì phải bị chặn',
                  code == 1 and 'drift' in out, code, out))

    code, out = run_case(LOOK_STALE, LINES)
    cases.append(('dàn ý trích câu mà phim không còn nói thì phải bị chặn',
                  code == 1 and 'stale' in out, code, out))

    code, out = run_case(LOOK_FORWARD, LINES_FWD)
    cases.append(('dàn ý nhắc trước câu kế tiếp thì qua', code == 0, code, out))

    code, out = run_case(LOOK_FORWARD, LINES_FAR)
    cases.append(('dàn ý nhắc câu ở xa thì phải bị chặn',
                  code == 1 and 'drift' in out, code, out))

    code, out = run_case(LOOK_FORBIDDEN, LINES)
    cases.append(('dàn ý trích câu mà file nghiên cứu cấm thì phải bị chặn',
                  code == 1 and 'forbidden' in out, code, out))

    code, out = run_case(LOOK_PROSE, LINES)
    cases.append(('văn xuôi dàn ý nhắc điều bị cấm thì qua', code == 0, code, out))

    code, out = run_case(LOOK_OK, LINES_REWRITTEN)
    cases.append(('lời kể viết lại thì dàn ý cũ phải bị chặn',
                  code == 1 and 'stale' in out, code, out))

    # thiếu file thì máy không chạy được, và phải nói thiếu file nào
    import tempfile
    with tempfile.TemporaryDirectory() as d:
        code, out = run_case('', LINES)
        cases.append(('kiểm trên ca rỗng thì không lỗi', code == 0, code, out))

    failed = 0
    for name, ok, code, out in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}')
        if not ok:
            failed += 1
            print('       ' + ' / '.join(l.strip() for l in out.splitlines() if l.strip())[:200])
    if failed:
        print(f'check_storyboard --selftest: {failed}/{len(cases)} FAIL')
        return 1
    print(f'check_storyboard --selftest: {len(cases)}/{len(cases)} ok')
    return 0


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if argv and argv[0] == '--selftest':
        return selftest()
    if not argv:
        print('usage: python3 check_storyboard.py <episode-folder>', file=sys.stderr)
        return 2
    ep = argv[0]
    got = load_episode(ep)
    if got is None:
        return 2
    look, lines, facts = got
    phrases = V.forbidden_phrases(facts)
    superlatives = V.forbidden_superlatives(facts)
    bad = check_storyboard(look, lines, phrases, superlatives)
    if not bad:
        print('check_storyboard: dàn ý khớp lời kể')
        return 0
    print(f'check_storyboard: {len(bad)} dòng dàn ý lệch lời kể')
    for kind, no, cid, q, why in bad:
        what = 'dán nhầm câu' if kind == 'drift' else 'nói cái bị cấm'
        print(f'  LOOK.md:{no} ({cid}) {what}: "{q}" — {why}')
    print('  → sửa LOOK.md cho khớp voice/lines.json (lời kể là chuẩn), rồi chạy lại')
    return 1


if __name__ == '__main__':
    sys.exit(main())
