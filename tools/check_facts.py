"""Check that the research file is consistent with itself: python3 tools/check_facts.py <research-file> [<file> ...]

The check proves itself: python3 tools/check_facts.py --selftest runs its own cases — the same bullet twice, the
reference to a section that is not there, the number a section does not hold — on files written to a temporary
directory.

Two defects, both found in a real episode while it was being made:

  1. A bullet that says the same thing twice. The file is the film's authority; a reader who finds the same
     claim twice stops trusting the file.

  2. A cross-reference to a section that does not exist ("mục 13" when the effect is in "mục 12"). The number
     that the episode states in the voice is then traced to the wrong place.

The section headings are the "### N. …" lines; a reference is a "mục N" or "mục N–M" in the text.

Exit code: 0 the file is consistent; 1 it is not; 2 usage.
"""
import os
import re
import subprocess
import sys
import tempfile
from collections import Counter


def selftest():
    """The check's own cases: every defect it exists to catch must be caught, every good file must pass.

    The files are the research file of a real episode ("Vì sao phơi quần áo cần gió?", tập 01 of the channel
    Trạm Nghĩ Nhiều) — the good one as it is, the bad ones as they were when the defect was found. Every case is
    written to a temporary directory, so the check never reads the repository."""
    script = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'check_facts.py')

    def run(text):
        """a research file in a temporary directory, checked from scratch"""
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, 'FACTS.md')
            with open(path, 'w', encoding='utf8') as f:
                f.write(text)
            p = subprocess.run([sys.executable, script, path], capture_output=True, text=True)
            return p.returncode, p.stdout + p.stderr

    # every reference points at a section that exists and holds the number it claims
    good = '''# Facts — Vì sao phơi quần áo cần gió?

## 2. Không khí khô chỉ chứa được khoảng hai mươi gam hơi nước cho mỗi kilogam khi trời hai mươi lăm độ

- **Dùng trong phim:** áp suất hơi nước bão hoà ở hai mươi lăm độ là **3,17 kPa** (mục 3); từ đó suy ra không khí bão hoà ở nhiệt độ đó chứa được khoảng **hai mươi gam hơi nước trên mỗi kilogam không khí khô**.
- **Cách nói:** con số 3,17 kPa ở mục 3 là áp suất hơi nước bão hoà ở hai mươi lăm độ.

## 3. Tốc độ bay hơi tỉ lệ với chênh lệch áp suất hơi nước, nên độ ẩm cao làm nước bay hơi chậm

Áp suất hơi nước bão hoà tính bằng công thức của mục 2: 1,70 kPa ở mười lăm độ, 2,34 kPa ở hai mươi độ, **3,17 kPa** ở hai mươi lăm độ, 4,25 kPa ở ba mươi độ.
'''
    # the same bullet, written twice
    twice = '''# Facts — Vì sao phơi quần áo cần gió?

## 4. Không có gió thì nước bay hơi chậm hơn một nửa

- **Dùng trong phim:** khi tốc độ gió giảm về gần không, tốc độ bay hơi của một giọt nước **rơi xuống còn khoảng một nửa** giá trị của nó khi có gió.
- **Dùng trong phim:** khi tốc độ gió giảm về gần không, tốc độ bay hơi của một giọt nước **rơi xuống còn khoảng một nửa** giá trị của nó khi có gió.
'''
    # the same bullet, written twice in two different spellings
    subject = '''# Facts — Vì sao phơi quần áo cần gió?

## 2. Không khí khô chỉ chứa được khoảng hai mươi gam hơi nước cho mỗi kilogam khi trời hai mươi lăm độ

- **Dùng trong phim:** không khí bão hoà ở hai mươi lăm độ chứa được khoảng **hai mươi gam hơi nước trên mỗi kilogam không khí khô**.

## Suy luận của tập phim / The film's own inferences (not research findings)

- **Khả năng chứa hơi nước của không khí.** Từ mục 2: tỉ lệ khối lượng hơi nước bão hoà là w = 0,622·e_s/(P − e_s) (P = 101,325 kPa).
- **Khả năng chứa hơi nước của không khí.** Từ mục 2: Ở hai mươi lăm độ w ≈ 20 g/kg.
'''
    # a reference to a section the file does not have
    missing = '''# Facts — Vì sao phơi quần áo cần gió?

## 5. Gió quyết định điện trở mà hơi nước phải vượt qua để đi khỏi bề mặt

- **Dùng trong phim:** gió làm giảm điện trở khí động — **tốc độ gió gấp đôi thì điện trở đó giảm một nửa** (208/u₂) — xem mục 13.
'''
    # a reference to a section that does not hold the number the line claims
    wrong = '''# Facts — Vì sao phơi quần áo cần gió?

## 2. Không khí khô chỉ chứa được khoảng hai mươi gam hơi nước cho mỗi kilogam khi trời hai mươi lăm độ

- **Dùng trong phim:** áp suất hơi nước bão hoà ở hai mươi lăm độ là **3,17 kPa** (mục 3); từ đó suy ra không khí bão hoà ở nhiệt độ đó chứa được khoảng **hai mươi gam hơi nước trên mỗi kilogam không khí khô**.
- **Cách nói:** con số 3,17 kPa ở mục 3 là áp suất hơi nước bão hoà ở hai mươi lăm độ.

## 3. Tốc độ bay hơi tỉ lệ với chênh lệch áp suất hơi nước, nên độ ẩm cao làm nước bay hơi chậm

Áp suất hơi nước bão hoà tính bằng công thức của mục 2: 1,70 kPa ở mười lăm độ, 2,34 kPa ở hai mươi độ.
'''
    cases = [
        ('the same bullet written twice is caught', twice, 1, 'the same bullet is written 2 times'),
        ('the same bullet written twice in two spellings is caught', subject, 1, 'the same subject is written 2 times'),
        ('a reference to a section that does not exist is caught', missing, 1, 'no section 13 exists'),
        ('a reference to a section that does not hold the number is caught', wrong, 1, 'but section 3 does not hold it'),
        ('a consistent file passes', good, 0, 'check_facts: PASS'),
    ]
    failed = 0
    for name, text, code, expect in cases:
        got, out = run(text)
        if got == code and expect in out:
            print(f'ok   {name}')
        else:
            failed += 1
            print(f'FAIL {name} — expected exit {code} and "{expect}", got exit {got}: '
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
