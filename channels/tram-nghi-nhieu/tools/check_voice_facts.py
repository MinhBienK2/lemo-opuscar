#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lời kể không được nói điều file nghiên cứu cấm — kiểm bằng máy, không bằng mắt.

`research/FACTS.md` là file quyền lực của tập phim: nó nói cái gì đúng, cái gì được phép
nói, và — điều quan trọng nhất — **cái gì không được nói**. Một câu lời kể đi ngược lệnh
cấm đó là tập phim nói dối chính mình trước mặt người xem, và một người đọc file nghiên cứu
đúng một tiếng sẽ không nhận ra ngay.

Lỗi này đã xảy ra trong tập 02 (điện thoại nóng lúc sạc): `research/FACTS.md` cấm nói
"chỗ nóng nhất trong máy", còn lời kể lại nói "Đây là chỗ nóng nhất trong cả cái máy". Người đọc
phải đọc file nghiên cứu rồi đi tìm trong `voice/lines.json` — một tiếng đọc mất.

`tools/check_claims.py` của thư viện đã canh những con số bị cấm ("90 %", "100 W"), nhưng nó
không canh được một câu không có số trong nó. Máy thì canh được, và canh mỗi lần.

Hai luật:

  1. **Cụm từ bị cấm.** Mỗi lệnh cấm trong file nghiên cứu có hình dạng "không nói \"…\"",
     "không được nói \"…\"", "tránh nói \"…\"", "không nói được \"…\"", "đừng nói \"…\"" —
     lệnh cấm bám ngay một cụm trong dấu nháy. Cụm ấy không được nói trong lời kể, cũng
     không được nói trong `TREATMENT.md`.
  2. **Hạng từ bị cấm.** Một siêu từ tiếng Việt là "<từ> nhất". Có những cụm *không* phải
     hạng ("duy nhất", "độc nhất", "thứ nhất") và có những cụm là từ của máy quay trong kênh
     này ("cận nhất", "xa nhất", "gần nhất") — chúng được bỏ qua, và lý do nằm trong hằng
     số `NOT_A_RANKING`. Một siêu từ chỉ bị cấm khi **mọi** lần xuất hiện của nó trong file
     nghiên cứu đều nằm trong một lệnh cấm; nếu có một lần nào đứng ngoài lệnh cấm thì file
     nghiên cứu *cho phép* hạng đó, và máy im.

Cách so sánh: hai bên được bỏ dấu câu, hạ chữ thường, bỏ mấy từ rác ("cả", "cái", "cùng",
"chính") rồi bóp khoảng trắng. Nhờ vậy "chỗ nóng nhất trong máy" của file nghiên cứu và
"chỗ nóng nhất trong cả cái máy" của lời kể trở thành một cụm — cùng một lời nói dối.

Một câu kể *phủ nhận* một hạng thì được phép ("đây không phải chỗ nóng nhất"): phim nói
"không" về một hạng là phủ nhận, không phải xếp hạng.

Dùng:  python3 channels/tram-nghi-nhieu/tools/check_voice_facts.py <tập>
Thoát mã 0 = lời kể nằm trong giới hạn của file nghiên cứu; 1 = có câu vượt; 2 = không chạy
được (thiếu file, sai cú pháp).
"""
import json
import os
import re
import sys

# ——— lệnh cấm trong file nghiên cứu ———

# khoảng trắng giữa các từ của lệnh: được phép xuống dòng (file nghiên cứu gói dòng), nhưng
# không được qua một dòng trống — một dòng trống là một đoạn mới, không còn cùng câu.
WS = r'(?:[ \t]+|\n[ \t]*)'
# các lệnh cấm. "không nói được" đứng trước "không nói" để "không nói được" không bị cắt
# làm đôi; "không được nói" là một lệnh riêng, không phải "không nói" + "được nói".
MARKER_SRC = (rf'(?:không{WS}nói(?:{WS}được)?|không{WS}được{WS}nói'
              rf'|tránh{WS}nói|đừng{WS}nói)')
MARKER = re.compile(MARKER_SRC)
# lệnh cấm bám ngay một cụm trong dấu nháy: đó là cụm bị cấm. Chỉ khoảng trắng được xen
# giữa — một dòng trống ở giữa là một đoạn khác, không phải lệnh cấm.
PROHIBITION = re.compile(MARKER_SRC + WS + r'["“]([^"”]{1,160})["”]')

# ——— những "<từ> nhất" không phải hạng ———

# "duy nhất" (chỉ một), "độc nhất" (độc nhất), "thứ nhất" (thứ tự) không xếp hạng gì cả.
# "cận nhất", "xa nhất", "gần nhất" là từ của máy quay trong kênh này: LOOK.md ghi "cận
# nhất vào chỗ chen" nghĩa là máy quay tới gần nhất, không phải chỗ nào nóng nhất.
NOT_A_RANKING = {
    'duy', 'độc', 'thứ',
    'cận', 'xa', 'gần',
}

# từ rác: chúng nói về cách nói, không nói về vật. Bỏ chúng ở cả hai bên rồi mới so, nên
# "chỗ nóng nhất trong cả cái máy" và "chỗ nóng nhất trong máy" là một cụm.
FILLERS = {'cả', 'cái', 'cùng', 'chính'}

# phủ nhận một hạng: phim nói "không" về hạng thì được phép. Mỗi cụm là một cách phủ nhận
# của lời kể tiếng Việt; cụm phải nằm ngay trước hạng, không quá bốn từ.
NEGATIONS = ('không phải', 'chẳng phải', 'chưa phải', 'không hề', 'đâu phải', 'không có', 'chẳng có')
# hạng phải nằm sau phủ nhận, không cách quá bốn từ
NEGATION_GAP = 4

# dấu hết câu: một hạng nằm sau dấu này thì không còn trong lệnh cấm nữa. Dấu chấm và dấu
# hai chấm chỉ hết câu khi sau nó là khoảng trắng — "0,622" hay "https://…" không phải hết
# câu.
SENTENCE_END = re.compile(r';|(?<=\S)[.:](?=\s|$)')
PARAGRAPH = re.compile(r'\n[ \t]*\n')

# siêu từ: "<từ> nhất"
SUPERLATIVE = re.compile(r'(\w+)\s+nhất', re.UNICODE)


def normalise(text):
    """văn bản đem đi so: chữ thường, không dấu câu, không từ rác, một khoảng trắng"""
    t = re.sub(r'[\W_]+', ' ', text.lower(), flags=re.UNICODE)
    return ' '.join(w for w in t.split() if w not in FILLERS)


def forbidden_phrases(facts):
    """các cụm file nghiên cứu cấm: [(cụm, dòng của file nghiên cứu)]"""
    out = []
    for m in PROHIBITION.finditer(facts):
        phrase = normalise(m.group(1))
        if not phrase:
            continue
        root = phrase.rsplit(' ', 1)[0] if phrase.endswith(' nhất') else None
        if root in NOT_A_RANKING:
            continue                    # "cận nhất" là từ máy quay, không phải một lời cấm
        out.append((phrase, facts.count('\n', 0, m.start()) + 1))
    return out


def forbidden_superlatives(facts):
    """các siêu từ file nghiên cứu cấm: {siêu từ: dòng của file nghiên cứu}

    Một siêu từ bị cấm khi mọi lần xuất hiện của nó trong file nghiên cứu đều nằm trong một
    lệnh cấm: lệnh cấm gần nhất phải nằm trong cùng câu, trước nó, không có dấu hết câu
    nào ở giữa. Xuất hiện một lần nào đó ngoài lệnh cấm thì file nghiên cứu cho phép hạng đó.
    """
    markers = list(MARKER.finditer(facts))
    seen = {}
    for m in SUPERLATIVE.finditer(facts):
        word = m.group(1).lower()
        if word in NOT_A_RANKING:
            continue
        key = f'{word} nhất'
        inside = False
        prev = None
        for mk in markers:
            if mk.end() <= m.start():
                prev = mk
            else:
                break
        if prev is not None:
            between = facts[prev.end():m.start()]
            if not SENTENCE_END.search(between) and not PARAGRAPH.search(between):
                inside = True
        seen.setdefault(key, []).append((inside, m.start()))
    out = {}
    for key, hits in seen.items():
        if all(inside for inside, _ in hits):
            out[key] = facts.count('\n', 0, hits[0][1]) + 1
    return out


def load_lines(path):
    """các câu lời kể: [(mã câu, lời)]"""
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    if isinstance(data, dict):
        data = data.get('lines', [])
    out = []
    for i, item in enumerate(data, 1):
        if isinstance(item, str):
            out.append((f'c{i}', item))
        else:
            out.append((str(item.get('id') or f'c{i}'), item.get('text') or ''))
    return out


def unnegated(norm, key):
    """câu này có lần xuất hiện nào của `key` mà câu đó không phủ nhận không

    Phim nói "không" về một hạng là phủ nhận, không phải xếp hạng — "đây không phải chỗ nóng
    nhất" thì được phép. `norm` là câu đã bình thường hoá, nên mỗi từ là một phần tử của
    danh sách; cụm phủ nhận phải nằm ngay trước cụm, không quá `NEGATION_GAP` từ.
    """
    words = norm.split()
    part = key.split()
    out = []
    for i in range(len(words) - len(part) + 1):
        if ' '.join(words[i:i + len(part)]) != key:
            continue
        before = words[max(0, i - NEGATION_GAP):i]
        denied = False
        for n in NEGATIONS:
            np = n.split()
            for j in range(len(before) - len(np) + 1):
                if ' '.join(before[j:j + len(np)]) == n:
                    denied = True
                    break
            if denied:
                break
        if not denied:
            out.append(i)
    return out


def check_voice(lines, phrases, superlatives):
    """những câu lời kể vượt giới hạn của file nghiên cứu

    [(mã câu, lời, loại, cụm bị cấm, dòng file nghiên cứu)]
    """
    bad = []
    for cid, text in lines:
        norm = normalise(text)
        for phrase, line in phrases:
            if unnegated(norm, phrase):
                bad.append((cid, text, 'phrase', phrase, line))
        for key, line in superlatives.items():
            if unnegated(norm, key):
                bad.append((cid, text, 'ranking', key, line))
    return bad


def check_treatment(treatment, phrases, superlatives):
    """những dòng dàn ý vượt giới hạn của file nghiên cứu: [(dòng, lời, loại, cụm, dòng FACTS)]"""
    bad = []
    for no, text in enumerate(treatment.splitlines(), 1):
        norm = normalise(text)
        for phrase, line in phrases:
            if unnegated(norm, phrase):
                bad.append((no, text, 'phrase', phrase, line))
        for key, line in superlatives.items():
            if unnegated(norm, key):
                bad.append((no, text, 'ranking', key, line))
    return bad


def report(where, bad):
    """in ra từng lỗi, mỗi lỗi một dòng, nói luôn phải làm gì

    Một câu có thể vượt giới hạn theo cả hai luật (nói cụm bị cấm và xếp hạng bị cấm); nó
    vẫn là một câu, nên nó được in một dòng, với cả hai lý do.
    """
    seen = {}
    order = []
    for loc, text, kind, phrase, line in bad:
        if loc not in seen:
            seen[loc] = (text, [])
            order.append(loc)
        seen[loc][1].append((kind, phrase, line))
    for loc in order:
        text, reasons = seen[loc]
        parts = []
        for kind, phrase, line in reasons:
            what = 'nói cụm bị cấm' if kind == 'phrase' else 'xếp hạng bị cấm'
            parts.append(f'{what} "{phrase}" (research/FACTS.md:{line})')
        how = ('đổi câu này, cụm đó không được nói trong phim.' if any(k == 'phrase' for k, _, _ in reasons)
               else 'bỏ "nhất", hoặc nói theo cách file nghiên cứu cho phép.')
        print(f'  BAD {where}{loc}: "{text.strip()}" — {"; ".join(parts)} cấm. → {how}')


def check_episode(ep):
    """kiểm một tập; trả về (mã thoát, số lỗi)"""
    facts_path = os.path.join(ep, 'research', 'FACTS.md')
    lines_path = os.path.join(ep, 'voice', 'lines.json')
    for path in (facts_path, lines_path):
        if not os.path.isfile(path):
            print(f'check_voice_facts: thiếu {path}', file=sys.stderr)
            return 2, 0
    try:
        with open(facts_path, encoding='utf-8') as f:
            facts = f.read()
        lines = load_lines(lines_path)
    except (OSError, ValueError) as e:
        print(f'check_voice_facts: không đọc được {ep}: {e}', file=sys.stderr)
        return 2, 0

    phrases = forbidden_phrases(facts)
    superlatives = forbidden_superlatives(facts)

    bad_voice = check_voice(lines, phrases, superlatives)

    treatment_path = os.path.join(ep, 'TREATMENT.md')
    treatment = ''
    if os.path.isfile(treatment_path):
        try:
            with open(treatment_path, encoding='utf-8') as f:
                treatment = f.read()
        except OSError as e:
            print(f'check_voice_facts: không đọc được {treatment_path}: {e}', file=sys.stderr)
            return 2, 0
    bad_treatment = check_treatment(treatment, phrases, superlatives)

    n = 0
    if bad_voice:
        print(f'check_voice_facts: {len(bad_voice)} câu lời kể vượt giới hạn của file nghiên cứu')
        report('voice/lines.json ', bad_voice)
        n += len(bad_voice)
    if bad_treatment:
        print(f'check_voice_facts: {len(bad_treatment)} dòng dàn ý vượt giới hạn của file nghiên cứu')
        report('TREATMENT.md:', bad_treatment)
        n += len(bad_treatment)
    if not n:
        print('check_voice_facts: lời kể nằm trong giới hạn của file nghiên cứu')
    return (1 if n else 0), n


# ——— selftest ———

FACTS_TAP02 = """# Facts — Vì sao điện thoại nóng lúc sạc?

## 5. Túi pin là nhiều lớp mỏng xếp chồng

- **Cách nói:** "một túi pin là nhiều lớp mỏng xếp chồng" — không nói "chỗ nóng nhất trong máy", không nói
  "ma sát ở chỗ hạt chen chúc".
"""

FACTS_SUPPORTED = """# Facts — Vì sao điện thoại nóng lúc sạc?

## 5. Túi pin là nhiều lớp mỏng xếp chồng

- **Cách nói:** "chỗ nóng nhất trong máy" là cách gọi thân mật của tập, không phải lệnh cấm.
"""

FACTS_NOT_A_RANKING = """# Facts — Vì sao điện thoại nóng lutc sạc?

## 5. Túi pin là nhiều lớp mỏng xếp chồng

- **Cách nói:** "một túi pin là nhiều lớp mỏng xếp chồng" — không nói "chỗ nóng nhất trong máy".
- **Phạm vi:** không nói duy nhất. Cũng không nói cận nhất.
"""

LINES_CLEAN = [{"id": "c1", "text": "Cái máy này mình vừa cầm lên."},
                {"id": "c2", "text": "Nóng rõ ở mặt lưng."}]
LINES_BAD = [{"id": "c42", "text": "Đây là chỗ nóng nhất trong cả cái máy."}]


def build_episode(root, facts, lines, treatment=None):
    """dựng một tập trong thư mục tạm: research/FACTS.md + voice/lines.json (+ TREATMENT.md)"""
    os.makedirs(os.path.join(root, 'research'), exist_ok=True)
    os.makedirs(os.path.join(root, 'voice'), exist_ok=True)
    with open(os.path.join(root, 'research', 'FACTS.md'), 'w', encoding='utf-8') as f:
        f.write(facts)
    with open(os.path.join(root, 'voice', 'lines.json'), 'w', encoding='utf-8') as f:
        json.dump(lines, f, ensure_ascii=False)
    if treatment is not None:
        with open(os.path.join(root, 'TREATMENT.md'), 'w', encoding='utf-8') as f:
            f.write(treatment)


def run(root):
    """chạy kiểm trên một thư mục tập; trả về (mã thoát, chữ đã in)"""
    import contextlib
    import io
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        code, _ = check_episode(root)
    return code, buf.getvalue()


def selftest():
    """một cái kiểm trả lời "được" cho mọi thứ thì không phải kiểm — chứng minh nó còn trả lời "không".

    Mỗi ca là một việc thật của một tập thật: tập 02 (điện thoại nóng lúc sạc) và những lỗi
    đã từng lọt qua.
    """
    import contextlib
    import io
    import tempfile

    cases = []

    # 1. ca thật của tập 02: file nghiên cứu cấm "chỗ nóng nhất trong máy", lời kể nói
    #    "chỗ nóng nhất trong cả cái máy" — phải bị chặn.
    with tempfile.TemporaryDirectory() as d:
        build_episode(d, FACTS_TAP02, LINES_BAD)
        code, out = run(d)
        cases.append(('tập 02 nói "chỗ nóng nhất trong cả cái máy" thì phải bị chặn',
                      code == 1 and 'chỗ nóng nhất trong máy' in out and 'c42' in out, code, out))

    # 2. lời kể sạch thì qua.
    with tempfile.TemporaryDirectory() as d:
        build_episode(d, FACTS_TAP02, LINES_CLEAN)
        code, out = run(d)
        cases.append(('lời kể sạch thì qua', code == 0, code, out))

    # 3. "duy nhất" không phải hạng: dàn ý nói "một việc duy nhất" thì qua.
    with tempfile.TemporaryDirectory() as d:
        build_episode(d, FACTS_NOT_A_RANKING, LINES_CLEAN,
                      treatment='| 4 | Củ sạc làm một việc duy nhất |\n')
        code, out = run(d)
        cases.append(('"duy nhất" không phải hạng, thì qua', code == 0, code, out))

    # 4. "cận nhất" là từ của máy quay trong kênh này, thì qua.
    with tempfile.TemporaryDirectory() as d:
        build_episode(d, FACTS_NOT_A_RANKING, LINES_CLEAN,
                      treatment='| 2:08 | N4 · các chỗ hạt chen chúc | Cận nhất vào chỗ chen |\n')
        code, out = run(d)
        cases.append(('"cận nhất" là từ máy quay, thì qua', code == 0, code, out))

    # 5. file nghiên cứu cho phép hạng (hạng đứng ngoài lệnh cấm) thì lời kể nói hạng đó qua.
    with tempfile.TemporaryDirectory() as d:
        build_episode(d, FACTS_SUPPORTED,
                      [{"id": "c50", "text": "Đây là chỗ nóng nhất trong cả cái máy."}])
        code, out = run(d)
        cases.append(('file nghiên cứu cho phép hạng thì qua', code == 0, code, out))

    # 6. dàn ý nói cụm bị cấm thì phải bị chặn.
    with tempfile.TemporaryDirectory() as d:
        build_episode(d, FACTS_TAP02, LINES_CLEAN,
                      treatment='| 14 | Ma sát ở chỗ hạt chen chúc sinh nhiệt |\n')
        code, out = run(d)
        cases.append(('dàn ý nói cụm bị cấm thì phải bị chặn',
                      code == 1 and 'TREATMENT.md' in out and 'ma sát ở chỗ hạt chen chúc' in out,
                      code, out))

    # 6b. dàn ý nói hạng bị cấm (kể cả khi khác cụm bị cấm) thì cũng phải bị chặn.
    with tempfile.TemporaryDirectory() as d:
        build_episode(d, FACTS_TAP02, LINES_CLEAN,
                      treatment='| 14 | Đó là chỗ nóng nhất trong pin |\n')
        code, out = run(d)
        cases.append(('dàn ý xếp hạng bị cấm thì phải bị chặn',
                      code == 1 and 'TREATMENT.md' in out and 'nóng nhất' in out, code, out))

    # 6c. lời kể phủ nhận một hạng thì được phép.
    with tempfile.TemporaryDirectory() as d:
        build_episode(d, FACTS_TAP02,
                      [{"id": "c42", "text": "Đây không phải chỗ nóng nhất trong cả cái máy."}])
        code, out = run(d)
        cases.append(('lời kể phủ nhận hạng thì qua', code == 0, code, out))

    # 7. thiếu file thì máy không chạy được, và phải nói thiếu file nào.
    with tempfile.TemporaryDirectory() as d:
        os.makedirs(os.path.join(d, 'research'), exist_ok=True)
        with open(os.path.join(d, 'research', 'FACTS.md'), 'w', encoding='utf-8') as f:
            f.write(FACTS_TAP02)
        code, out = run(d)
        cases.append(('thiếu voice/lines.json thì báo thiếu file, mã 2',
                      code == 2 and 'lines.json' in out, code, out))

    # 8. sai cú pháp thì mã 2.
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        code = main([])
    cases.append(('không có đối số thì báo cáo cách dùng, mã 2',
                  code == 2 and 'usage' in buf.getvalue().lower(), code, buf.getvalue()))

    failed = 0
    for name, ok, code, out in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}')
        if not ok:
            failed += 1
            print('       ' + ' / '.join(l.strip() for l in out.splitlines() if l.strip())[:200])
    if failed:
        print(f'check_voice_facts --selftest: {failed}/{len(cases)} FAIL')
        return 1
    print(f'check_voice_facts --selftest: {len(cases)}/{len(cases)} ok')
    return 0


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    if argv and argv[0] == '--selftest':
        return selftest()
    if not argv:
        print('usage: python3 check_voice_facts.py <episode-folder>', file=sys.stderr)
        return 2
    code, _ = check_episode(argv[0])
    return code


if __name__ == '__main__':
    sys.exit(main())
