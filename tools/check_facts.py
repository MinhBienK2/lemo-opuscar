"""Check that the research file is consistent with itself: python3 tools/check_facts.py <research-file> [<file> ...]

Two defects, both found in a real episode while it was being made:

  1. A bullet that says the same thing twice. The file is the film's authority; a reader who finds the same
     claim twice stops trusting the file.

  2. A cross-reference to a section that does not exist ("mục 13" when the effect is in "mục 12"). The number
     that the episode states in the voice is then traced to the wrong place.

The section headings are the "### N. …" lines; a reference is a "mục N" or "mục N–M" in the text.

Exit code: 0 the file is consistent; 1 it is not; 2 usage.
"""
import re
import sys
from collections import Counter


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    if not args:
        print('usage: python3 tools/check_facts.py <research-file> [<research-file> ...]')
        return 2
    bad = 0
    for path in args:
        try:
            text = open(path, encoding='utf8').read()
        except OSError:
            print(f'check_facts: no {path}')
            continue
        print(f'--- {path}')
        lines = text.splitlines()

        # 1. the same bullet twice
        bullets = [ln.strip() for ln in lines if re.match(r'^\s*[-*]\s+\S', ln)]

        def key_of(b):
            """the bullet's subject: the words before its first parenthesis or colon"""
            text = re.sub(r'\*\*|\*|`', '', b)
            text = re.split(r'[(:]', text, 1)[0]
            return re.sub(r'\s+', ' ', text).strip().lower()

        def subject(b):
            """the bullet without the markers, so two spellings of the same bullet compare equal"""
            return re.sub(r'\s+', ' ', re.sub(r'\*\*|\*|`', '', b)).strip().lower()

        keys = [subject(b) for b in bullets]
        for key, count in Counter(keys).items():
            if count > 1 and len(key) >= 12:
                first = bullets.index(next(b for b, k in zip(bullets, keys) if k == key))
                print(f'  BAD the same bullet is written {count} times (first at line {first + 1}): "{key[:90]}"')
                bad += 1

        # the same bullet written twice with different wording: the subject before the parenthesis
        prefixes = [key_of(b) for b in bullets]
        for key, count in Counter(prefixes).items():
            if count > 1 and len(key) >= 25 and len(key.split()) >= 5:
                first = bullets.index(next(b for b, k in zip(bullets, prefixes) if k == key))
                print(f'  BAD the same subject is written {count} times (first at line {first + 1}): "{key[:90]}"')
                bad += 1

        # 2. a reference to a section that does not exist, or to a section that does not hold the number
        sections = {}     # number -> the text of that section
        current = None
        for ln in lines:
            m = re.match(r'^#{2,4}\s*(\d+)\s*[.、]', ln)
            if m:
                current = int(m.group(1))
                sections[current] = []
            elif current is not None:
                sections[current].append(ln)
        for i, ln in enumerate(lines):
            for m in re.finditer(r'mục\s+(\d+)', ln, re.I):
                n = int(m.group(1))
                if n not in sections:
                    print(f'  BAD line {i + 1} points at "mục {n}", and no section {n} exists '
                          f'(the file has: {sorted(sections)})')
                    bad += 1
                    continue
                # the number the sentence claims for that section must be in it. Only a number that the sentence
                # ties to the section counts — a year, a DOI or a page number in the same line is not the claim.
                body = '\n'.join(sections[n])
                claim = re.search(r'con số\s+[^,.;]{0,40}?(\d+[.,]?\d*)', ln)
                if not claim:
                    claim = re.search(r'(?:hiệu ứng|kích thước hiệu ứng)\s+[^,.;]{0,30}?(\d+[.,]?\d*)', ln)
                if claim:
                    num = claim.group(1)
                    variants = {num, num.replace(',', '.'), num.replace('.', ',')}
                    if not any(v in body for v in variants):
                        print(f'  BAD line {i + 1} points at "mục {n}" and claims the number {num}, '
                              f'but section {n} does not hold it')
                        bad += 1
    if bad:
        print(f'check_facts: FAILED ({bad} problem{"s" if bad > 1 else ""})')
        return 1
    print('check_facts: PASS')
    return 0


if __name__ == '__main__':
    sys.exit(main())
