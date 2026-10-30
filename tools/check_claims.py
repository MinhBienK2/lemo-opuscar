"""Check that the numbers the film shows are the numbers its research file supports:
python3 tools/check_claims.py <film-folder> [<film-folder> ...]

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
import sys

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


def main():
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
