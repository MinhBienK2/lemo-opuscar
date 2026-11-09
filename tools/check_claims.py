"""Check that the numbers the film shows are the numbers its research file supports:
python3 tools/check_claims.py <film-folder> [<film-folder> ...]

The check proves itself: python3 tools/check_claims.py --selftest runs its own cases — a forbidden value, a number
with nothing behind it, a number attributed to the wrong year, a value that needs its qualifier — on film folders
written to a temporary directory.

Three classes of error, all seen in a real episode:

  1. A value the research file forbids. The research file names such values ("Cảnh báo cho thẻ "9,5 phút"...",
     "không được nói ...") — a value no source supports, or one that belongs to another paper. A film that shows it
     contradicts its own research file. The value is looked up in the film's drawing code and in its script.

  2. A number the research file never mentions at all: nothing behind it.

  3. A number with a year the research file does not give it. A card that says "nghiên cứu năm 2009" for a number
     that belongs to another paper is a misattribution, and the research file is where the correct year lives.

The research file is read as sentences. A sentence that forbids a value ("không được nói", "KHÔNG có trong nguồn",
"Cảnh báo", "Đề nghị sửa") does not support anything — the number it names is exactly the one not to say.

A fourth class is reported but does not fail: the film words a number differently from the way the research file
words it ("94 nghiên cứu" against "94 lần thử độc lập"). Whether that wording is a lie or a fair paraphrase is a
reader's judgement — the report names the pair so the reviewer reads it.

Exit code: 0 no number contradicts the research file; 1 some number does; 2 usage.
"""
import os
import re
import subprocess
import sys
import tempfile

# a sentence of the research file that forbids a value
FORBIDDEN = re.compile(r'(không được nói|không nói|KHÔNG có trong nguồn|không có trong nguồn|Cảnh báo|'
                        r'được nói là|không được nói thành)', re.I)
# a quoted value that the sentence proposes instead ("Đề nghị sửa thẻ thành "gần 10 phút" hoặc "11 phút"")
PROPOSAL = re.compile(r'(sửa thẻ thành|sửa thành|hoặc|thay bằng|dùng)\s*$', re.I)
# a sentence that allows a value only with a qualifier ("Nếu giữ "9,5 phút" thì phải nói rõ đó là nhóm phân tán")
CONDITIONAL = re.compile(r'(nếu giữ|phải nói rõ|nói rõ đó|là nhóm|chỉ khi|must say|only if)', re.I)
# the qualifier a conditional sentence demands
QUALIFIER = re.compile(r'nói rõ(?: rằng)?(?:\s+đó)?(?:\s+là)?\s+([^.;]{3,80})', re.I)
# a value in quotes inside such a sentence
QUOTED = re.compile(r'["“]([^"”]{2,80})["”]')
# a number the research file says belongs to another paper: "20,3 phút KHÔNG có trong bài Leroy (2009)"
WRONG_YEAR = re.compile(r'không có trong (?:bài |nguồn )?[^.;]{0,60}?\((\d{4})\)', re.I)
# a source entry: the line that names the paper the numbers come from
SOURCE_ENTRY = re.compile(r'(doi\s*:|https?://|pmid\s*:|arxiv)', re.I)
# a stat card in the shot list
CARD = re.compile(r"num:\s*'([^']*)'(.{0,600}?)unit:\s*'([^']*)'", re.S)
NOTE = re.compile(r"note:\s*'([^']*)'")
YEAR = re.compile(r'\b((?:19|20)\d{2})\b')

# the digits the film may write as words
WORDS = {'1': 'một', '2': 'hai', '3': 'ba', '4': 'bốn', '5': 'năm', '6': 'sáu', '7': 'bảy', '8': 'tám', '9': 'chín',
         '10': 'mười', '11': 'mười một', '12': 'mười hai', '13': 'mười ba', '14': 'mười bốn', '15': 'mười lăm',
         '16': 'mười sáu', '17': 'mười bảy', '18': 'mười tám', '19': 'mười chín', '20': 'hai mươi'}


def normalise(text):
    """the file's own way of writing a number: 9.5 and 9,5 are the same number"""
    t = text.replace('\u00a0', ' ').replace('−', '-')
    t = re.sub(r'(?<=\d),(?=\d)', '.', t)
    return t.lower()


def sentences(text):
    """the research file as sentences: a line break or a full stop ends one"""
    out = []
    for line in text.splitlines():
        for part in re.split(r'(?<=[.!?])\s+', line):
            if part.strip():
                out.append(part)
    return out


def as_float(s):
    try:
        return float(str(s).replace(',', '.').strip())
    except ValueError:
        return None


def mentions(sentence, number):
    """the sentence names that number — as a digit, as a decimal or as a Vietnamese word"""
    n = normalise(str(number).strip())
    if re.search(r'(?<![\d.,])' + re.escape(n) + r'(?![\d.,])', sentence):
        return True
    v = as_float(n)
    if v is None:
        return False
    # the same number written with a comma instead of a dot
    if re.search(r'(?<![\d.,])' + re.escape(str(n).replace('.', ',')) + r'(?![\d])', sentence):
        return True
    # the number rounded to the same number of decimals ("20" for 20,3)
    dec = len(n.split('.')[1]) if '.' in n else 0
    if dec:
        for m in re.finditer(r'(?<![\d.,])(\d+)(?:[.,](\d+))?(?![\d])', sentence):
            whole, frac = m.group(1), m.group(2) or ''
            if len(frac) == dec and float(whole + '.' + frac) == v:
                return True
    word = WORDS.get(n.replace(',', '.')) or WORDS.get(n)
    if word and word in sentence.lower():
        return True
    return False


def mentions_pair(text, number, unit):
    """the text names the number with its unit — "20,3 phút" counts for the card "20 phút"."""
    if mentions(text, number):
        return True
    u = normalise(unit)
    if u and u not in normalise(text):
        return False
    v = as_float(number)
    if v is None:
        return False
    for m in re.finditer(r'(?<![\d.,])(\d+)(?:[.,](\d+))?(?![\d])', text):
        whole, frac = m.group(1), m.group(2) or '0'
        if abs(float(whole + '.' + frac) - v) < 0.5:
            return True
    return False


def selftest():
    """The check's own cases: every defect it exists to catch must be caught, every good card must pass.

    The research files are the ones of real episodes — "Vì sao điện thoại nóng lúc sạc?" (tập 02) and "Tại sao ta
    không tập trung được?" (tập 03) of the channel Trạm Nghĩ Nhiều — and the cards are the ones that were on screen
    when the defects were found. Every case is built in a temporary directory, so the check never reads the
    repository."""
    script = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'check_claims.py')

    def run(facts, code, voice=None):
        """a film folder — a research file, a drawing code and a voice script — checked from scratch"""
        with tempfile.TemporaryDirectory() as d:
            os.makedirs(os.path.join(d, 'research'))
            os.makedirs(os.path.join(d, 'src'))
            with open(os.path.join(d, 'research', 'FACTS.md'), 'w', encoding='utf8') as f:
                f.write(facts)
            with open(os.path.join(d, 'src', 'shots.js'), 'w', encoding='utf8') as f:
                f.write(code)
            if voice is not None:
                os.makedirs(os.path.join(d, 'voice'))
                with open(os.path.join(d, 'voice', 'lines.json'), 'w', encoding='utf8') as f:
                    f.write(voice)
            p = subprocess.run([sys.executable, script, d], capture_output=True, text=True)
            return p.returncode, p.stdout + p.stderr

    # the research file of tập 02: the cổng USB-C and the values the film must not show
    charger = '''# Facts — Vì sao điện thoại nóng lúc sạc?

**Quy tắc của file này:** mỗi con số trên màn hình có nguồn ở đây, và một giá trị mà file này cấm thì **không được nói** trong phim.

## 3. Cổng USB-C đưa vào máy tới hai mươi volt, và một cổng đảm bảo được sáu mươi oát khi cáp chỉ chịu được ba ampe

> "When Port Present PDP would be > 60W but the cable Vbus Current Handling Capability = 3A, the Port Shall set Port Present PDP = 60W"

USB Implementers Forum (2026), *Universal Serial Bus Type-C and Power Delivery — Source Power Requirements Compliance Test Specification*, Rev. 1.2 (2026-11-04). https://usb.org/document-library/usb-power-delivery

- **Dùng trong phim:** nhãn củ sạc trong khung ghi **60 W**; con số này là mức công suất mà một cổng USB-C đảm bảo được khi cáp chỉ chịu được 3 A ở mức **20 V**.
- **Phạm vi:** 20 V và 60 W là **giới hạn của chuẩn và của cáp**, không phải của mọi củ sạc; một củ sạc thường đưa ít hơn nhiều. Phim không nói mọi củ sạc đều sáu mươi oát.
- **Cách nói:** "trên nhãn củ sạc ghi sáu mươi oát" và "cổng đưa vào hai mươi volt" — không nói "hai mươi ampe", không nói "một trăm oát".

## Giá trị không được nói / Values this film must not show

- "90 %" — không được nói trong phim: không có nguồn nào cho hiệu suất của một củ sạc cụ thể, và không có nguồn nào cho phần trăm điện vào máy mà bị thất thoát. Phim chỉ nói "việc đổi ấy không bao giờ trọn vẹn".
- "1,5 A" — không được nói trong phim: nguồn ở mục 3 nói về **khả năng** của cáp, không nói dòng điện thật của một cái máy trong khung, và phim không đo được dòng điện thật.
- "100 W" — không được nói trong phim: đây là trần của **cả chuẩn PD ở 20 V / 5 A** (mục 3), không phải công suất của củ sạc trong khung, và phim không nói chuẩn nào.
'''
    # the research file of tập 03: the twenty minutes, and the year they do not belong to
    focus = '''# Facts — Tại sao ta không tập trung được?

**Quy tắc của file này:** mỗi con số trên màn hình có nguồn ở đây, và một giá trị mà file này cấm thì **không được nói** trong phim.

## 4. Trước khi người ta tự nhảy sang việc khác, đã có khoảng hai mươi phút

- **Dùng trong phim:** con số 20 phút là của bài CHI 2008 của Mark, Gudith & Klocke.

## 5. Cảnh báo cho thẻ số liệu

- **Cảnh báo:** con số 20,3 phút KHÔNG có trong bài Leroy (2009); nó là số của một nghiên cứu khác (bài CHI 2008 của Mark).

## Nguồn / Sources

- Mark, I., Gudith, D. & Klocke, U. (2008). *The Cost of Interrupted Work: More Speed and Stress*. CHI '08. DOI: 10.1145/1357054.1357072
'''
    # the research file of tập 03: the number that is only allowed with its qualifier
    dispersed = '''# Facts — Tại sao ta không tập trung được?

## 6. Thời gian trước khi người ta tự nhảy sang việc khác

- **Số 9,5 phút:** con số 9,5 phút không có trong nguồn nào; nó là 9 phút 56 giây ở nhóm phân tán.
- **Cách nói:** Nếu giữ "9,5 phút" thì phải nói rõ đó là nhóm phân tán.
'''
    # the research file of tập 03: ninety-four trials, not ninety-four studies
    trials = '''# Facts — Tại sao ta không tập trung được?

## 3. Chín mươi bốn lần thử độc lập

> "Findings from 94 independent tests indicate that people are more likely to remember an interrupted task if they are given the two tasks as a single task."

Mark, I., Gudith, D. & Klocke, U. (2008). *The Cost of Interrupted Work: More Speed and Stress*. CHI '08. DOI: 10.1145/1357054.1357072
'''
    card_current = '''export const CARDS = [
  { id: 'charger', title: 'DÒNG ĐIỆN', num: '1,5', unit: 'A' },
];
'''
    prop_label = '''export const PROPS = [
  { id: 'charger-label', title: 'CỦ SẠC 100 W' },
];
'''
    prop_label_ok = '''export const PROPS = [
  { id: 'charger-label', title: 'CỦ SẠC' },
];
'''
    voice_label = '{"lines": [{"id": "l1", "text": "Trên nhãn củ sạc trong khung ghi 100 W."}]}\n'
    card_unsupported = '''export const CARDS = [
  { id: 'timer', title: 'THỜI GIAN', num: '47', unit: 'giây' },
];
'''
    card_wrong_year = '''export const CARDS = [
  { id: 'focus', title: 'TRƯỚC KHI NHẢY SANG VIỆC KHÁC', num: '20', unit: 'phút', note: 'nghiên cứu năm 2009' },
];
'''
    card_no_qualifier = '''export const CARDS = [
  { id: 'focus', title: 'TRƯỚC KHI NHẢY SANG VIỆC KHÁC', num: '9,5', unit: 'phút' },
];
'''
    card_qualifier = '''export const CARDS = [
  { id: 'focus', title: 'TRƯỚC KHI NHẢY SANG VIỆC KHÁC', num: '9,5', unit: 'phút', note: 'chỉ nhóm phân tán' },
];
'''
    card_supported = '''export const CARDS = [
  { id: 'charger', title: 'NHÃN CỦ SẠC', num: '60', unit: 'W', note: 'giới hạn của chuẩn và của cáp' },
];
'''
    card_wording = '''export const CARDS = [
  { id: 'trials', title: 'SỐ LẦN THỬ', num: '94', unit: 'nghiên cứu' },
];
'''
    cases = [
        ('a card shows a value the research file forbids',
         charger, card_current, None, 1, 'the research file forbids this number'),
        ('a prop label shows a value the research file forbids',
         charger, prop_label, None, 1, 'the film shows "100 W", which its research file forbids'),
        ('the voice script says a value the research file forbids',
         charger, prop_label_ok, voice_label, 1, 'the film shows "100 W", which its research file forbids'),
        ('a card shows a number the research file never mentions',
         charger, card_unsupported, None, 1, 'the research file never mentions 47'),
        ('a card gives a number a year the research file does not give it',
         focus, card_wrong_year, None, 1, 'the research file says this number does not come from that year'),
        ('a card shows a value the research file allows only with a qualifier',
         dispersed, card_no_qualifier, None, 1, 'the research file allows this number only "nhóm phân tán"'),
        ('the same card with the qualifier on screen passes',
         dispersed, card_qualifier, None, 0, 'check_claims: PASS'),
        ('a card the research file supports passes',
         charger, card_supported, None, 0, 'check_claims: PASS'),
        ('a number the research file words differently is reported, not failed',
         trials, card_wording, None, 0, 'the research file words this number differently'),
    ]
    failed = 0
    for name, facts, code_text, voice, want, expect in cases:
        got, out = run(facts, code_text, voice)
        if got == want and expect in out:
            print(f'ok   {name}')
        else:
            failed += 1
            print(f'FAIL {name} — expected exit {want} and "{expect}", got exit {got}: '
                  + ' / '.join(l.strip() for l in out.splitlines() if l.strip())[:200])
    if failed:
        print(f'FAIL: {failed} case(s)')
        return 1
    print('ok')
    return 0


def main():
    if '--selftest' in sys.argv[1:]:
        return selftest()
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    if not args:
        print('usage: python3 tools/check_claims.py <film-folder> [<film-folder> ...]')
        return 2
    bad = 0
    for folder in args:
        facts_path = os.path.join(folder, 'research', 'FACTS.md')
        try:
            facts = open(facts_path, encoding='utf8').read()
        except OSError:
            print(f'--- {folder}\n  no research file — nothing to check')
            continue
        print(f'--- {folder}')
        ss = [(s, bool(FORBIDDEN.search(s))) for s in sentences(facts)]
        ns = [(normalise(s), is_forbidden) for s, is_forbidden in ss]
        # the source entries: the whole lines that name a paper, with its year
        source_lines = [ln for ln in facts.splitlines() if SOURCE_ENTRY.search(ln)]

        code_files = []
        src = os.path.join(folder, 'src')
        if os.path.isdir(src):
            code_files = [os.path.join(src, f) for f in sorted(os.listdir(src)) if f.endswith('.js')]

        # 1. the values the research file forbids, and the ones it allows only with a qualifier
        forbidden = {}     # value -> the sentence that forbids it
        conditional = {}   # value -> (sentence, the qualifier it demands)
        for s, is_forbidden in ss:
            for qm in QUOTED.finditer(s):
                q = qm.group(1).strip()
                if not re.search(r'\d', q):
                    continue
                # a value the sentence proposes instead of forbidding is not forbidden
                if PROPOSAL.search(s[:qm.start()]):
                    continue
                if is_forbidden:
                    forbidden.setdefault(q, s)
                elif CONDITIONAL.search(s):
                    qual = QUALIFIER.search(s)
                    conditional.setdefault(q, (s, qual.group(1).strip() if qual else ''))
        code = ''.join(open(p, encoding='utf8').read() for p in code_files)
        script = ''
        try:
            script = open(os.path.join(folder, 'voice', 'lines.json'), encoding='utf8').read()
        except OSError:
            pass
        haystack = normalise(code + '\n' + script)
        for value in sorted(forbidden):
            if normalise(value) in haystack:
                where = [os.path.basename(p) for p in code_files if normalise(value) in normalise(open(p, encoding='utf8').read())]
                print(f'  BAD the film shows "{value}", which its research file forbids'
                      + (f' ({", ".join(where)})' if where else ' (voice/lines.json)'))
                bad += 1

        # 2 and 3. every numeric card is backed by the research file
        for path in code_files:
            src_text = open(path, encoding='utf8').read()
            for m in CARD.finditer(src_text):
                num, unit = m.group(1), m.group(3)
                if not re.search(r'\d', num):
                    continue                       # a word in the number slot is not a number
                # the note belongs to this card: the card is the object literal the number sits in
                start = src_text.rfind('{', 0, m.start())
                end = src_text.find('}', m.end())
                card = src_text[start:end if end > 0 else m.end() + 400]
                note = NOTE.search(card)
                years = set(YEAR.findall(note.group(1))) if note else set()
                base = os.path.basename(path)

                supporting = [s for s, f in ns if not f and mentions(s, num)]
                forbidden_hits = [s for s, f in ns if f and mentions(s, num)]
                anywhere = [s for s, f in ns if mentions(s, num)]

                # a value the research file allows only with a qualifier: the qualifier must be on screen too
                for value, (sent, qual) in conditional.items():
                    if not mentions(sent, num):
                        continue
                    key = qual.lower()
                    if key and key in normalise(src_text[max(0, m.start() - 600):m.start() + 900]):
                        continue
                    print(f'  BAD {base}: the card "{num} {unit}" — the research file allows this number only '
                          f'"{qual}"')
                    bad += 1

                if not anywhere:
                    print(f'  BAD {base}: the card "{num} {unit}" — the research file never mentions {num}')
                    bad += 1
                    continue
                if supporting and not any(normalise(unit) in s for s in supporting):
                    print(f'  REPORT {base}: the card says "{num} {unit}"; the research file words this number '
                          f'differently — read it and use its wording')
                    continue
                if not supporting:
                    if forbidden_hits:
                        print(f'  BAD {base}: the card "{num} {unit}" — the research file forbids this number')
                        bad += 1
                    else:
                        print(f'  REPORT {base}: the card says "{num} {unit}"; the research file words this number '
                              f'differently — read it and use its wording')
                    continue
                if years:
                    # a year the research file says the number does NOT belong to — this comes first: the paper that
                    # holds the number may still name that year somewhere, and the sentence that forbids it wins
                    wrong = [y for y in years if any(
                        (m := WRONG_YEAR.search(s)) and m.group(1) == y and mentions_pair(s, num, unit)
                        for s, _ in ss)]
                    if wrong:
                        note_text = note.group(1) if note else ''
                        print(f'  BAD {base}: the card "{num} {unit}" is attributed to "{note_text}", but the '
                              f'research file says this number does not come from that year')
                        bad += 1
                        continue
                    # the year comes from the source entry the number belongs to: the number is in the paragraph
                    # above, the year in the "Nguồn" line below it. The entry is a whole line, so it is read as one.
                    good = [s for s in source_lines
                            if mentions_pair(s, num, unit) and all(y in s for y in years)]
                    if not good:
                        note_text = note.group(1) if note else ''
                        print(f'  BAD {base}: the card "{num} {unit}" is attributed to "{note_text}", but the '
                              f'research file does not give this number that year')
                        bad += 1
    if bad:
        print(f'check_claims: FAILED ({bad} problem{"s" if bad > 1 else ""})')
        return 1
    print('check_claims: PASS')
    return 0


if __name__ == '__main__':
    sys.exit(main())
