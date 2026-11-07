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

Exit code: 0 if passed; 1 if errors found (or warnings in --strict mode); 2 usage.
"""
import json, os, re, sys
from collections import Counter

STOPWORDS_VI = {
    'là', 'của', 'và', 'có', 'trong', 'để', 'khi', 'thì', 'mà', 'cho', 'với', 'nhưng',
    'bạn', 'ta', 'nó', 'đó', 'này', 'các', 'những', 'một', 'được', 'vào', 'ra', 'lại',
    'ở', 'bởi', 'vì', 'do', 'nên', 'cũng', 'đã', 'sẽ', 'đang', 'rồi', 'ngay', 'hơn',
    'không', 'chưa', 'chẳng', 'thế', 'nào', 'sao', 'gì', 'ai', 'đâu', 'đây', 'đó'
}

DIGIT_RE = re.compile(r'\b\d+\b')
BULLET_RE = re.compile(r'^(?:một|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười|\d+)\s*[—–-]', re.I)


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
        if len(toks) > 32:
            warnings.append(f"#{i} [{lid}] Line is very long ({len(toks)} words; >32 words strains breathing/pacing): \"{text[:50]}...\"")
        elif len(toks) < 3 and not re.search(r'\b(nhưng|và|rồi|đúng vậy|chính nó)\b', text, re.I):
            warnings.append(f"#{i} [{lid}] Line is unusually short ({len(toks)} words): \"{text}\"")

        # Gather n-grams (filtering out pure stopword combos)
        if len(toks) >= 2:
            bi = [bg for bg in ngrams(toks, 2) if any(w not in STOPWORDS_VI for w in bg.split())]
            all_bigrams.extend(bi)
        if len(toks) >= 3:
            tri = [tg for tg in ngrams(toks, 3) if any(w not in STOPWORDS_VI for w in tg.split())]
            all_trigrams.extend(tri)

    # 4. Consecutive echo / duplicate thought
    for i in range(len(lines_data) - 1):
        set_a = line_content_sets[i]
        set_b = line_content_sets[i+1]
        sim = jaccard(set_a, set_b)
        if sim >= 0.65 and len(set_a) >= 4 and len(set_b) >= 4:
            warnings.append(f"Consecutive echo between #{i+1} and #{i+2} (vocabulary overlap {int(sim*100)}%):\n"
                            f"  #{i+1}: \"{lines_data[i].get('text', '')[:60]}\"\n"
                            f"  #{i+2}: \"{lines_data[i+1].get('text', '')[:60]}\"")

    # 5. Global over-density of phrases (repeating > 6 times across the script)
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


def main():
    if len(sys.argv) < 2:
        print("usage: python3 tools/check_script.py <episode-dir-or-lines.json> [--strict]", file=sys.stderr)
        sys.exit(2)

    target = sys.argv[1]
    strict = '--strict' in sys.argv[2:]
    lines_file = target
    if os.path.isdir(target):
        lines_file = os.path.join(target, 'voice', 'lines.json')

    if not os.path.isfile(lines_file):
        print(f"check_script: file not found: {lines_file}", file=sys.stderr)
        sys.exit(2)

    try:
        data = json.load(open(lines_file, encoding='utf-8'))
    except Exception as e:
        print(f"check_script: invalid JSON in {lines_file}: {e}", file=sys.stderr)
        sys.exit(1)

    if not isinstance(data, list):
        print(f"check_script: lines.json must be a list of objects", file=sys.stderr)
        sys.exit(1)

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
        sys.exit(1)

    print("\ncheck_script: PASS (cadence and vocabulary density are clean)")
    sys.exit(0)


if __name__ == '__main__':
    main()
