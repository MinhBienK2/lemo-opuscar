#!/usr/bin/env python3
"""Check voice/lines.json for repetition, cadence, and TTS pitfalls.

Usage:
    python3 tools/check_script.py <episode-or-lines.json> [--strict]

What it audits:
  1. Repetitive concepts & n-grams: phrases repeated too frequently across the script or in tight clusters.
  2. Adjacent echoes: consecutive lines that repeat the same thought or share >60% vocabulary.
  3. Cadence & line length: lines over 30 words (strains single breath / TTS pacing) or under 3 words.
  4. Raw digits: numbers written as digits ("30") instead of spelled out ("ba mươi").
  5. Slide-deck numbered bullet points: lines starting with "Một —", "Hai —", "1.", etc.
  6. Numbers split across two lines: "...tối đa khoảng hai" + "mươi gam hơi nước" — the viewer reads
     "mươi gam hơi nước", a broken number.

Exit code: 0 if passed; 1 if errors found (or warnings in --strict mode); 2 usage.

    python3 tools/check_script.py --selftest   proves the checker can still say "no"
"""
import contextlib, io, json, os, re, sys, tempfile
from collections import Counter

STOPWORDS_VI = {
    'là', 'của', 'và', 'có', 'trong', 'để', 'khi', 'thì', 'mà', 'cho', 'với', 'nhưng',
    'bạn', 'ta', 'nó', 'đó', 'này', 'các', 'những', 'một', 'được', 'vào', 'ra', 'lại',
    'ở', 'bởi', 'vì', 'do', 'nên', 'cũng', 'đã', 'sẽ', 'đang', 'rồi', 'ngay', 'hơn',
    'không', 'chưa', 'chẳng', 'thế', 'nào', 'sao', 'gì', 'ai', 'đâu', 'đây', 'đó'
}

DIGIT_RE = re.compile(r'\b\d+\b')
# "Một — ..." is a slide deck, and so is "1. ..." / "1 — ...". The period must be followed by a space,
# so "3.5 độ" stays a number and not a bullet.
BULLET_RE = re.compile(r'^(?:một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)\s*[—–-]|^\d+\s*(?:[—–-]|\.\s)', re.I)

# A number written in words can be cut in half between two lines: "...tối đa khoảng hai" + "mươi gam hơi nước".
# The viewer reads "mươi gam hơi nước" — a broken number, and one that contradicts the number on screen.
# The tail words below never start a Vietnamese phrase on their own, so a line that begins with one is a
# continuation of the number the previous line ended.
NUM_HEAD = {'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'}
NUM_TAIL = {'mươi', 'lăm', 'trăm', 'nghìn', 'ngàn', 'triệu', 'tỷ'}


def split_number_at_boundary(prev_text, text):
    """True when the previous line ends with the head of a number and this line begins with its tail."""
    prev_words = tokenize(prev_text or '')
    words = tokenize(text or '')
    if not prev_words or not words:
        return False
    return prev_words[-1] in NUM_HEAD and words[0] in NUM_TAIL


def tokenize(text):
    clean = re.sub(r'[^\w\s]', ' ', text.lower())
    return [w for w in clean.split() if w]


def content_words(tokens):
    return [w for w in tokens if w not in STOPWORDS_VI and len(w) > 1]


def ngrams(tokens, n=2):
    return [' '.join(tokens[i:i+n]) for i in range(len(tokens) - n + 1)]


def jaccard(set1, set2):
    if not set1 or not set2:
        return 0.0
    return len(set1 & set2) / len(set1 | set2)


def audit_script(lines_data, strict=False):
    errors = []
    warnings = []

    total_words = 0
    all_tokens = []
    all_bigrams = []
    all_trigrams = []
    line_content_sets = []

    for i, line in enumerate(lines_data, 1):
        text = line.get('text', '').strip()
        lid = line.get('id', f'c{i}')
        toks = tokenize(text)
        cw = content_words(toks)
        total_words += len(toks)
        all_tokens.extend(cw)
        line_content_sets.append(set(cw))

        # 1. Slide-deck / robotic numbered bullets
        if BULLET_RE.match(text):
            errors.append(f"#{i} [{lid}] Robotic slide-deck bullet format: \"{text[:45]}...\"")

        # 2. Raw digits
        digits = DIGIT_RE.findall(text)
        if digits:
            msg = f"#{i} [{lid}] Contains raw digits ({', '.join(digits)}): \"{text[:45]}...\" — spell numbers in words for natural TTS"
            if strict:
                errors.append(msg)
            else:
                warnings.append(msg)
        if len(toks) > 30:
            warnings.append(f"#{i} [{lid}] Line is very long ({len(toks)} words; >30 words strains breathing/pacing): \"{text[:50]}...\"")
        elif len(toks) < 3 and not re.search(r'\b(nhưng|và|rồi|đúng vậy|chính nó)\b', text, re.I):
            warnings.append(f"#{i} [{lid}] Line is unusually short ({len(toks)} words): \"{text}\"")

        # Gather n-grams (filtering out pure stopword combos)
        if len(toks) >= 2:
            bi = [bg for bg in ngrams(toks, 2) if any(w not in STOPWORDS_VI for w in bg.split())]
            all_bigrams.extend(bi)
        if len(toks) >= 3:
            tri = [tg for tg in ngrams(toks, 3) if any(w not in STOPWORDS_VI for w in tg.split())]
            all_trigrams.extend(tri)

    # 4. A number cut in half between two lines
    for i in range(len(lines_data) - 1):
        a_text = lines_data[i].get('text', '')
        b_text = lines_data[i+1].get('text', '')
        if split_number_at_boundary(a_text, b_text):
            warnings.append(f"Number split across two lines between #{i+1} and #{i+2}:\n"
                            f"  #{i+1}: \"{a_text[-60:]}\"\n"
                            f"  #{i+2}: \"{b_text[:60]}\" — the viewer reads a broken number; keep the whole number in one line")

    # 5. Consecutive echo / duplicate thought
    for i in range(len(lines_data) - 1):
        set_a = line_content_sets[i]
        set_b = line_content_sets[i+1]
        sim = jaccard(set_a, set_b)
        if sim >= 0.65 and len(set_a) >= 4 and len(set_b) >= 4:
            warnings.append(f"Consecutive echo between #{i+1} and #{i+2} (vocabulary overlap {int(sim*100)}%):\n"
                            f"  #{i+1}: \"{lines_data[i].get('text', '')[:60]}\"\n"
                            f"  #{i+2}: \"{lines_data[i+1].get('text', '')[:60]}\"")

    # 6. Global over-density of phrases (repeating > 6 times across the script)
    ngram_counts = Counter(all_trigrams + all_bigrams)
    for phrase, count in ngram_counts.most_common(12):
        if count >= 7:
            warnings.append(f"Phrase \"{phrase}\" repeats {count} times across the script — check for excessive repetition")

    # 6. Local cluster repetition (phrase repeated 3+ times in any 6-line window)
    window_size = 6
    for start_idx in range(len(lines_data) - window_size + 1):
        window_lines = lines_data[start_idx:start_idx + window_size]
        window_toks = []
        for l in window_lines:
            window_toks.extend(tokenize(l.get('text', '')))
        win_bigrams = [bg for bg in ngrams(window_toks, 2) if any(w not in STOPWORDS_VI for w in bg.split())]
        for phrase, c in Counter(win_bigrams).items():
            if c >= 3:
                first_line = start_idx + 1
                last_line = start_idx + window_size
                warnings.append(f"Local repetition: \"{phrase}\" repeats {c} times in lines #{first_line}–#{last_line}")
                break

    return errors, warnings, total_words


def selftest():
    """a check that answers "yes" to everything is not a check: prove it can still say "no".

    Every line here is a real line of a real episode (two episodes of the channel), so a change in
    the helpers that makes the check pass everything shows up here instead of in a film. Each case is run
    through the checker itself, on a file written in a temporary folder, and the exit code is the verdict.
    """
    # real lines of two episodes
    REAL = [
        {"id": "c1", "text": "Điện thoại nằm sấp trên bàn cạnh giường, dây cắm thẳng vào ổ.", "gap": 2.4},
        {"id": "c2", "text": "Cái đồng hồ sạc trên màn hình cứ nhích lên từng chút một.", "gap": 0.3},
        {"id": "c3", "text": "Và cái máy này, mình vừa cầm lên.", "gap": 0.3},
        {"id": "c4", "text": "Ấm. Rõ ràng là nóng ở mặt lưng.", "gap": 0.7},
        {"id": "c5", "text": "Vì sao điện thoại nóng lúc sạc?", "gap": 0.9},
    ]
    # a real line of tap-01, with the two defects a script must never carry
    BULLET = {"id": "c3", "text": "Vì sao phơi quần áo cần gió? Mình làm thí nghiệm nhỏ.", "gap": 0.45}
    REPEAT = [
        {"id": "c13", "text": "Muốn rời khỏi vải, nước phải đổi thành hơi nước.", "gap": 0.45},
        {"id": "c23", "text": "Chỗ trống đó, hơi nước mới đi được.", "gap": 0.2},
        {"id": "c28", "text": "Gió làm đường đi của hơi nước ngắn lại.", "gap": 0.2},
    ]

    def run(lines, strict=False):
        """chạy chính checker này trên một lines.json trong thư mục tạm; trả về (mã thoát, chữ in ra)"""
        with tempfile.TemporaryDirectory() as td:
            path = os.path.join(td, 'lines.json')
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(lines, f, ensure_ascii=False)
            argv = sys.argv
            sys.argv = ['check_script.py', path] + (['--strict'] if strict else [])
            buf = io.StringIO()
            try:
                with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
                    code = main()
            finally:
                sys.argv = argv
        return code, buf.getvalue()

    def lines(*texts, start=1):
        return [{"id": f'c{i}', "text": t, "gap": 0.3} for i, t in enumerate(texts, start)]

    cases = []

    # a real script is clean
    code, out = run(REAL)
    cases.append(('a real episode script passes', code == 0 and '[ERRORS]' not in out and 'PASS' in out))

    # the slide-deck bullet: the one the channel's own rules forbid
    code, out = run([dict(BULLET, text='Một — ' + BULLET['text'])])
    cases.append(('a slide-deck bullet is an error', code == 1 and 'slide-deck bullet' in out))

    code, out = run([dict(BULLET, text='1. ' + BULLET['text'])])
    cases.append(('a numbered slide-deck bullet is an error', code == 1 and 'slide-deck bullet' in out))

    # a number written as a digit: a warning by default, an error under --strict
    digit = dict(BULLET, text=BULLET['text'] + ' Ở 30 ĐỘ.')
    code, out = run([digit])
    cases.append(('raw digits are a warning, and the script still passes', code == 0 and 'raw digits' in out))
    code, out = run([digit], strict=True)
    cases.append(('raw digits are an error under --strict', code == 1 and 'raw digits' in out))

    # the cadence: too long, too short
    long_line = ' '.join(['nước'] * 31)
    code, out = run([dict(BULLET, text=long_line)])
    cases.append(('a line of 31 words is too long', code == 0 and 'very long' in out))
    code, out = run([dict(BULLET, text=' '.join(['nước'] * 30))])
    cases.append(('a line of 30 words is left alone', code == 0 and 'very long' not in out))
    code, out = run([dict(BULLET, text='Hai số.')])
    cases.append(('a line of two words is too short', code == 0 and 'unusually short' in out))

    # the repetition: the same phrase over and over
    code, out = run(lines(*[f'Hơi nước đi lên {i}.' for i in range(7)]))
    cases.append(('a phrase repeated seven times is caught', code == 0 and 'repeats 7 times' in out))
    code, out = run(lines(*[f'Nhiệt độ {i} ở đây.' for i in range(6)]))
    cases.append(('the same phrase in every line of a window is caught', code == 0 and 'Local repetition' in out))

    # a number cut in half between two lines: the defect tap-01 shipped (1:58)
    code, out = run(lines('Cái áo cần khoảng hai', 'mươi gam hơi nước để khô.'))
    cases.append(('a number split across two lines is caught', code == 0 and 'Number split across two lines' in out))
    code, out = run(lines('Cái áo cần khoảng hai mươi', 'gam hơi nước để khô.'))
    cases.append(('a whole number in one line is left alone', code == 0 and 'Number split across two lines' not in out))
    code, out = run(lines('Nhiệt độ cao nhất.', 'Trăm phần trăm hơi nước bay ra.'))
    cases.append(('a line that ends in a number word but no tail follows is left alone',
                  code == 0 and 'Number split across two lines' not in out))

    # the real repeated phrase of tap-01 is caught when the script says it seven times
    code, out = run(lines(*[r['text'] for r in REPEAT] * 3))
    cases.append(('the real phrase of tap-01, said nine times, is caught', code == 0 and 'repeats' in out))

    # the command line itself
    argv = sys.argv
    sys.argv = ['check_script.py']
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            code = main()
    finally:
        sys.argv = argv
    cases.append(('the usage branch exits 2', code == 2 and 'usage' in buf.getvalue()))

    failed = 0
    for name, ok in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}' if ok else f'FAIL {name}')
        if not ok: failed += 1
    if failed:
        print(f'FAIL: {failed} case(s)')
        return 1
    print('ok')
    return 0


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--selftest':
        return selftest()

    if len(sys.argv) < 2:
        print("usage: python3 tools/check_script.py <episode-dir-or-lines.json> [--strict]", file=sys.stderr)
        return 2

    target = sys.argv[1]
    strict = '--strict' in sys.argv[2:]
    lines_file = target
    if os.path.isdir(target):
        lines_file = os.path.join(target, 'voice', 'lines.json')

    if not os.path.isfile(lines_file):
        print(f"check_script: file not found: {lines_file}", file=sys.stderr)
        return 2

    try:
        data = json.load(open(lines_file, encoding='utf-8'))
    except Exception as e:
        print(f"check_script: invalid JSON in {lines_file}: {e}", file=sys.stderr)
        return 1

    if not isinstance(data, list):
        print(f"check_script: lines.json must be a list of objects", file=sys.stderr)
        return 1

    errors, warnings, total_words = audit_script(data, strict=strict)
    print(f"check_script: {len(data)} lines, {total_words} words audited in {lines_file}")
    if errors:
        print(f"\n[ERRORS] ({len(errors)}):")
        for e in errors:
            print(f"  ✗ {e}")
    if warnings:
        print(f"\n[WARNINGS] ({len(warnings)}):")
        for w in warnings[:15]:
            print(f"  ⚠ {w}")
        if len(warnings) > 15:
            print(f"  ... and {len(warnings) - 15} more warnings.")

    if errors or (strict and warnings):
        print(f"\ncheck_script: FAILED ({len(errors)} error(s), {len(warnings)} warning(s))")
        return 1

    print("\ncheck_script: PASS (cadence and vocabulary density are clean)")
    return 0


if __name__ == '__main__':
    sys.exit(main())
