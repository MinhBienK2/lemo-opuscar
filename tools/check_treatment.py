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

    python3 tools/check_treatment.py --selftest   # prove the check can fail
"""
import os, re, sys, tempfile

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
# a line that says what to learn (or what not to take) is not a reference work
LEARN = re.compile(r'^\s*[-*]?\s*\**\s*(học|không lấy|learn|don\'?t take|not take|do not take)\s*[:|]', re.I | re.U)

def check(film):
    """The problems of one film's treatment and LOOK. Returns (code, bad, info)."""
    TP = os.path.join(film, 'TREATMENT.md')
    if not os.path.isfile(TP): return 2, [], ''
    bad = []
    BAD = bad.append

    secs = sections(open(TP, encoding='utf-8').read())
    b = find(secs, 'phim mẫu', 'benchmark')
    if b is None: BAD('TREATMENT.md has no "## Phim mẫu" (benchmark): 1–2 reference works that set the bar for this topic (DIRECTOR.md §2)')
    else:
        if not has(b, r'học\s*[:|]', r'learn\s*[:|]', r'\|\s*(học|learn)\s*\|'): BAD('"## Phim mẫu": say what to learn from each work ("Học: …")')
        if not has(b, r'không lấy', r"(don't|do not|not) (take|learn)"): BAD('"## Phim mẫu": say what not to take ("Không lấy: …")')
        # the bar is set from outside: the channel's own episodes and STYLE.md are what the film already knows
        # (the references are the works themselves; the "Học:"/"Không lấy:" lines under a work are not references)
        refs = [l for l in b.splitlines() if l.strip() and not re.match(r'^\s*\|?\s*[-:| ]+$', l) and not re.search(r'(học|learn)\s*\|', l, re.I) and not LEARN.match(l)]
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

    LP = os.path.join(film, 'LOOK.md')
    if not os.path.isfile(LP): BAD('no LOOK.md: render stills with the real drawing code, look, fix, at least twice — and write down each round (DIRECTOR.md §5)')
    else:
        rounds = {h: '\n'.join(v) for h, v in sections(open(LP, encoding='utf-8').read()).items() if re.match(r'(vòng|round)\s*\d', h)}
        if len(rounds) < 2: BAD(f'LOOK.md has {len(rounds)} round(s) (≥ 2: "## Vòng 1", "## Vòng 2" …)')
        for h, body in rounds.items():
            if not has(body, r'thấy\s*:', r'saw\s*:') or not has(body, r'sửa\s*:', r'fix(ed)?\s*:'):
                BAD(f'LOOK.md "{h}": write what you saw on the stills ("Thấy: …") and what you changed ("Sửa: …")')

    info = f'treatment: {len(secs)} sections' + (f', LOOK.md' if os.path.isfile(LP) else '')
    return (1 if bad else 0), bad, info

# —— the selftest: the treatment of DIRECTOR.md §2–§7, and the ways a real one falls short ——
GOOD_TREATMENT = """# Treatment — Chiếc áo mười hai lớp

## Phim mẫu

- **The Secret Life of Walter Mitty (2013)** — một cuộc trình duyệt mở rộng giữa đời thường.
  - Học: mở đầu bằng hành động cụ thể, nhịp chậm lại đúng chỗ người ta phải thở.
  - Không lấy: nhân vật, màu, góc máy, nhạc.
- **Koyaanisqatsi (1982)** — phim tài liệu xếp tầng, không lời thoại.
  - Học: cách dùng hình khối thay cho lời giải thích.
  - Không lấy: nhịp điệu, bảng màu, cách dựng.

## Ba cấu trúc

- **A. Một hành trình**: Lan đi từ quầy báo ra hành lang, tìm ra chiếc áo và hiểu vì sao nó nặng.
- **B. Một danh sách**: ba lớp vải, ba câu hỏi, ba câu trả lời.
- **C. Một đồng hồ**: đếm ngược từ hoàng hôn đến khuya, mỗi giờ một lớp vải.

**Chọn: A** — vì hành trình cho Lan một chỗ để đứng, và mốc thời gian tự nói thay lời giải thích.

## Logline

Một người kể chiếc áo khoác mười hai lớp từ lúc còn nặng cho đến lúc thành vũ khí.
Thiết lập: chiếc áo treo ở quầy báo đêm. Bước ngoặt: Lan mở lớp vải bên trong. Kết thúc: trời sáng, áo vẫn còn đó.

## Beat sheet

- 0.0–4.0 s: quầy báo đêm, chiếc áo treo trên dây.
- 4.3–8.3 s: tay Lan nâng lớp vải ngoài, máy đi vào gần.
- 8.6–12.6 s: mười hai lớp vải xếp chồng, từng lớp một.
- 12.9–16.9 s: câu hỏi về trọng lượng, một nhịp im lặng.
- 17.2–21.2 s: Lan kéo khóa áo lên vai, bước vào hành lang.
- 21.5–25.5 s: lớp vải ngoài cùng phủ sương, kết.

## Cue map

- 0.0–8.6 s: 72 BPM, chỉ tiếng phòng và tiếng vải.
- 8.6–12.9 s: nhịp nặng, mỗi lớp vải một nhịp.
- 12.9–17.2 s: im lặng thật, không nhạc.
- 17.2–25.5 s: 96 BPM, một nốt dài kéo theo bước chân.

## Âm thanh

- Nền: tiếng quầy báo đêm, tiếng gió ngoài hành lang.
- Điểm nhấn: tiếng vải cọ vào tay, tiếng khóa áo rẽ, tiếng đồng hồ quầy báo.
- Kỹ thuật: âm thanh cảnh đi vào sớm ở lúc chuyển cảnh, và âm thanh cảnh kéo dài qua mỗi lần cắt.

## Chấm lời

Bạn đọc thứ hai thấy câu mở đầu nói quá nhiều, và không thấy câu hỏi nào cả. Đã sửa: cắt câu mở xuống còn một dòng,
và thêm nhịp im lặng trước câu hỏi ở 12.9 s.
"""

GOOD_LOOK = """# LOOK — Chiếc áo mười hai lớp

## Vòng 1

- Render: `out/look-01.png`, khung rộng của quầy báo đêm.
- Thấy: đèn vàng quá tối, áo khoác chìm hẳn vào nền, viền mực mất ở vai áo.
- Sửa: nâng đèn thêm 20 %, đổi nền sang xanh lục và vẽ lại viền mực đậm hơn.

## Vòng 2

- Render: `out/look-02.png`, khung gần của bàn tay đang nâng lớp vải.
- Thấy: ngón tay đè lên mặt vải, không đọc được lớp nào là lớp nào.
- Sửa: tách ngón tay ra khỏi mặt vải, mở rộng khung và thêm một vòng mực cho mép lớp vải.
"""

def selftest():
    """Prove the check can fail: a treatment that misses a part of DIRECTOR.md §2–§7 must be caught.

    Every case is a real file written into a temp folder; the good one is the shape the library asks
    for, the bad ones are the shapes a treatment falls into when it is written in a hurry.
    """
    def put(film, name, text):
        with open(os.path.join(film, name), 'w', encoding='utf-8') as f:
            f.write(text)

    def cut(text, start, end=None):
        """The part of a file between two markers — how a real edit leaves a file."""
        i = text.index(start)
        j = text.index(end) if end else len(text)
        return text[:i] + text[j:]

    with tempfile.TemporaryDirectory() as tmp:
        def film(name):
            d = os.path.join(tmp, name)
            os.makedirs(d, exist_ok=True)
            return d

        # the good film
        good = film('good')
        put(good, 'TREATMENT.md', GOOD_TREATMENT)
        put(good, 'LOOK.md', GOOD_LOOK)

        no_bench = film('no-benchmark')
        put(no_bench, 'TREATMENT.md', cut(GOOD_TREATMENT, '## Phim mẫu', '## Ba cấu trúc'))
        put(no_bench, 'LOOK.md', GOOD_LOOK)

        no_dont = film('no-dont-take')
        put(no_dont, 'TREATMENT.md', GOOD_TREATMENT
            .replace('  - Không lấy: nhân vật, màu, góc máy, nhạc.\n', '')
            .replace('  - Không lấy: nhịp điệu, bảng màu, cách dựng.\n', ''))
        put(no_dont, 'LOOK.md', GOOD_LOOK)

        own = film('benchmark-is-the-channel')
        head = GOOD_TREATMENT[:GOOD_TREATMENT.index('## Phim mẫu')]
        tail = GOOD_TREATMENT[GOOD_TREATMENT.index('## Ba cấu trúc'):]
        own_t = head + ('## Phim mẫu\n\n'
                        '- **Tập 1 (series do-vat)** — xem lại chính công việc của kênh này.\n'
                        '  - Học: nhịp và cách cắt, như tập 1 của kênh này.\n'
                        '  - Không lấy: màu của tập 1 trong channel này.\n\n') + tail
        put(own, 'TREATMENT.md', own_t)
        put(own, 'LOOK.md', GOOD_LOOK)

        # the same, with learn lines that do not name the channel: only the work is the channel
        own_quiet = film('benchmark-is-the-channel-quiet-learn-lines')
        own_q_t = head + ('## Phim mẫu\n\n'
                          '- **Tập 1 (series do-vat)** — xem lại chính công việc của kênh này.\n'
                          '  - Học: nhịp cắt và cách dựng.\n'
                          '  - Không lấy: nhân vật, màu, nhạc.\n\n') + tail
        put(own_quiet, 'TREATMENT.md', own_q_t)
        put(own_quiet, 'LOOK.md', GOOD_LOOK)

        two = film('two-structures')
        put(two, 'TREATMENT.md', GOOD_TREATMENT.replace(
            '- **C. Một đồng hồ**: đếm ngược từ hoàng hôn đến khuya, mỗi giờ một lớp vải.\n', ''))
        put(two, 'LOOK.md', GOOD_LOOK)

        no_choice = film('no-choice')
        put(no_choice, 'TREATMENT.md', cut(GOOD_TREATMENT, '**Chọn: A**', '## Logline'))
        put(no_choice, 'LOOK.md', GOOD_LOOK)

        no_cue = film('no-cue-map')
        put(no_cue, 'TREATMENT.md', cut(GOOD_TREATMENT, '## Cue map', '## Âm thanh'))
        put(no_cue, 'LOOK.md', GOOD_LOOK)

        one_round = film('one-look-round')
        put(one_round, 'TREATMENT.md', GOOD_TREATMENT)
        put(one_round, 'LOOK.md', cut(GOOD_LOOK, '## Vòng 2'))

        no_fix = film('look-round-without-fix')
        put(no_fix, 'TREATMENT.md', GOOD_TREATMENT)
        put(no_fix, 'LOOK.md', GOOD_LOOK.replace('- Sửa: tách ngón tay ra khỏi mặt vải, mở rộng khung và thêm một vòng mực cho mép lớp vải.\n', ''))

        no_look = film('no-look')
        put(no_look, 'TREATMENT.md', GOOD_TREATMENT)

        nothing = film('nothing')

        cases = [
            ('a complete treatment and two look rounds pass', good, 0, None),
            ('a treatment with no benchmark is caught', no_bench, 1, 'no "## Phim mẫu"'),
            ('a benchmark with no "Không lấy" is caught', no_dont, 1, 'say what not to take'),
            ('a benchmark that only names the channel itself is caught', own, 1, 'every reference is the channel itself'),
            ('a channel-only benchmark with quiet learn lines is caught', own_quiet, 1, 'every reference is the channel itself'),
            ('two candidate structures are caught', two, 1, 'candidates listed'),
            ('a treatment with no choice is caught', no_choice, 1, 'say which one you chose'),
            ('a treatment with no cue map is caught', no_cue, 1, 'no "## Cue map"'),
            ('a LOOK.md with one round is caught', one_round, 1, 'round(s) (≥ 2'),
            ('a look round with no "Sửa:" is caught', no_fix, 1, 'write what you saw on the stills'),
            ('a film with no LOOK.md is caught', no_look, 1, 'no LOOK.md'),
            ('a film with no TREATMENT.md is turned away', nothing, 2, None),
        ]
        bad = 0
        for name, folder, want_code, want_msg in cases:
            code, problems, _ = check(folder)
            ok = code == want_code and (want_msg is None or any(want_msg in m for m in problems))
            if not ok:
                bad += 1
            print(f'{"ok   " if ok else "FAIL"} {name}'
                  + ('' if ok else f' — code {code}, problems: {problems}'))
    print('ok' if not bad else f'FAIL: {bad} case(s)')
    return 0 if not bad else 1

def main(argv):
    if len(argv) > 1 and argv[1] == '--selftest':
        return selftest()
    if len(argv) < 2 or argv[1].startswith('-'):
        print(__doc__); return 2
    FILM = argv[1]
    code, bad, info = check(FILM)
    if code == 2:
        print(f'check_treatment: no TREATMENT.md in {FILM}'); return 2
    print(info)
    for m in bad: print('BAD', m)
    print('PASS' if not bad else f'FAIL ({len(bad)})')
    return code

if __name__ == '__main__':
    sys.exit(main(sys.argv))
