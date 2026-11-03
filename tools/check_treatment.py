#!/usr/bin/env python3
"""Check that a film was directed before it was drawn: python3 tools/check_treatment.py <film>

TREATMENT.md follows DIRECTOR.md §2–§7, one "## " heading per part (Vietnamese or English, matched on the heading):
  benchmark   "## Phim mẫu" / "## Benchmark": 1–2 reference works, each with a "Học:" (learn) and a "Không lấy:" (don't take)
  structures  "## Ba cấu trúc" / "## Three structures": ≥ 3 candidates as list items, and a "Chọn:" (chose) line with why
  logline     "## Logline": one sentence, then setup → turn → ending
  beats       "## Beat sheet" / "## Bảng nhịp": second by second
  cue map     "## Cue map": tempo or sections, where the music changes, where the silences are
  sound       "## Âm thanh" / "## Sound": the bed, the motif, the accents of each section
  review      "## Chấm lời" / "## Content review": what the second reader found and how it was fixed
The shot list, with its "why" column, is board.json (tools/check_board.py).

LOOK.md proves the look before the film is animated (DIRECTOR.md §5): ≥ 2 rounds "## Vòng 1", "## Vòng 2" …, each naming
the stills it rendered, a "Thấy:" (what was wrong) and a "Sửa:" (what was changed).
Exit 0 when both pass, 1 when something fails, 2 when there is no TREATMENT.md.
"""
import os, re, sys

args = sys.argv[1:]
if not args or args[0].startswith('-'): print(__doc__); sys.exit(2)
FILM = args[0]
TP = os.path.join(FILM, 'TREATMENT.md')
if not os.path.isfile(TP): print(f'check_treatment: no TREATMENT.md in {FILM}'); sys.exit(2)
bad = []
BAD = bad.append

def sections(text):
    out, cur = {}, None
    for ln in text.splitlines():
        m = re.match(r'^##\s+(.+?)\s*$', ln)
        if m: cur = m.group(1).strip().lower(); out[cur] = []
        elif cur is not None: out[cur].append(ln)
    return out

def find(secs, *keys):
    for h, body in secs.items():
        if any(k in h for k in keys): return '\n'.join(body)
    return None

# a candidate is a list item, a ### heading, or a paragraph that opens on a bold name (**A. …**)
items = lambda body: [l for l in body.splitlines() if re.match(r'^\s*([-*]|\d+[.)])\s+\S|^###\s+\S|^\*\*(?!(chọn|chosen|choice))', l, re.I)]
has = lambda body, *keys: any(re.search(k, body, re.I | re.U) for k in keys)

secs = sections(open(TP, encoding='utf-8').read())
b = find(secs, 'phim mẫu', 'benchmark')
if b is None: BAD('TREATMENT.md has no "## Phim mẫu" (benchmark): 1–2 reference works that set the bar for this topic (DIRECTOR.md §2)')
else:
    if not has(b, r'học\s*[:|]', r'learn\s*[:|]', r'\|\s*(học|learn)\s*\|'): BAD('"## Phim mẫu": say what to learn from each work ("Học: …")')
    if not has(b, r'không lấy', r"(don't|do not|not) (take|learn)"): BAD('"## Phim mẫu": say what not to take ("Không lấy: …")')
    # the bar is set from outside: the channel's own episodes and STYLE.md are what the film already knows
    refs = [l for l in b.splitlines() if l.strip() and not re.match(r'^\s*\|?\s*[-:| ]+$', l) and not re.search(r'(học|learn)\s*\|', l, re.I)]
    if refs and all(re.search(r'\btập\s*\d|tap-\d|STYLE\.md|series|kênh|channel', l, re.I) for l in refs):
        BAD('"## Phim mẫu": every reference is the channel itself — name 1–2 works from outside it (a channel, a film, an ad) that set the bar for this topic')
s = find(secs, 'ba cấu trúc', 'cấu trúc', 'structures')
if s is None: BAD('TREATMENT.md has no "## Ba cấu trúc": three candidate structures and the one chosen (DIRECTOR.md §4)')
else:
    if len(items(s)) < 3: BAD(f'"## Ba cấu trúc": {len(items(s))} candidates listed (≥ 3, one list item each)')
    if not has(s, r'chọn\**\s*:', r'chose(n)?\**\s*:', r'choice\**\s*:'): BAD('"## Ba cấu trúc": say which one you chose and why ("Chọn: … vì …")')
for keys, name, why in [(('logline',), 'Logline', 'one sentence, then setup → turn → ending'),
                        (('beat sheet', 'bảng nhịp'), 'Beat sheet', 'what happens, second by second'),
                        (('cue map',), 'Cue map', 'where the music changes, where the silences fall'),
                        (('âm thanh', 'sound'), 'Âm thanh', 'the bed, the motif and the accents of each section'),
                        (('chấm lời', 'content review'), 'Chấm lời', 'what the second reader found and how it was fixed')]:
    body = find(secs, *keys)
    if body is None or len(body.strip()) < 40: BAD(f'TREATMENT.md has no "## {name}" worth reading: {why}')

LP = os.path.join(FILM, 'LOOK.md')
if not os.path.isfile(LP): BAD('no LOOK.md: render stills with the real drawing code, look, fix, at least twice — and write down each round (DIRECTOR.md §5)')
else:
    rounds = {h: '\n'.join(v) for h, v in sections(open(LP, encoding='utf-8').read()).items() if re.match(r'(vòng|round)\s*\d', h)}
    if len(rounds) < 2: BAD(f'LOOK.md has {len(rounds)} round(s) (≥ 2: "## Vòng 1", "## Vòng 2" …)')
    for h, body in rounds.items():
        if not has(body, r'thấy\s*:', r'saw\s*:') or not has(body, r'sửa\s*:', r'fix(ed)?\s*:'):
            BAD(f'LOOK.md "{h}": write what you saw on the stills ("Thấy: …") and what you changed ("Sửa: …")')

print(f'treatment: {len(secs)} sections' + (f', LOOK.md' if os.path.isfile(LP) else ''))
for m in bad: print('BAD', m)
print('PASS' if not bad else f'FAIL ({len(bad)})')
sys.exit(1 if bad else 0)
