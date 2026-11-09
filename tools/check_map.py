#!/usr/bin/env python3
"""check_map.py — bản đồ mã (`src/MAP.md`) có còn đúng với mã không.

  python3 tools/check_map.py <tập>          # tập có src/MAP.md
  python3 tools/check_map.py <thư mục src>   # thư mục src chứa MAP.md
  python3 tools/check_map.py --selftest

Bản đồ mã là cách chữa luật đọc lại (R11): nó ghi tên hàm → dòng, để người đọc mở đúng chỗ thay vì
đọc cả tệp. Nhưng một bản đồ sai còn tệ hơn không có bản đồ: nó đưa người đọc tới nhầm chỗ, và
người đọc đã học được cách bỏ qua nó thì không đọc gì nữa (N74).

Bài này đối chiếu hai thứ:
  · số dòng trong tiêu đề (`## src/film.js (524 dòng)`) với số dòng thật của tệp;
  · mỗi dòng của bảng (`| 330–392 | window.render(t) — …`) với tên mà dòng đó nói tới — tên có
    còn nằm trong (hoặc gần) khoảng dòng đó không.

Chỉ kiểm tra những gì bản đồ *tự nêu tên*: một dòng không có tên trong backtick thì máy không biết
đối chiếu với cái gì, và bài này nói thẳng là không kết luận được (không đoán).
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

# a row of the table: | 330–392 | what it is |   (also "10-15", "27", "490–498")
ROW = re.compile(r'^\|\s*(\d+)\s*(?:[–—-]\s*(\d+))?\s*\|(.*)\|')
HEAD = re.compile(r'^##\s+(\S+)\s*\((\d+)\s*dòng')
# a name in backticks: `window.render(t)`, `SHOTS`, `buildBalcony()`
TICKED = re.compile(r'`([^`]+)`')
# a name that is a real identifier: letters, digits, dot, underscore, optional ()
IDENT = re.compile(r'^[A-Za-z_$][\w$]*(\.[\w$]+)*(\(\))?$')

TOL = 25          # a name may sit a little off the line the map gives it
LINE_TOL = 40     # a heading's line count may be off by this much before it is a finding
PCT_TOL = 0.03    # ... or by this share of the file

# words that are in almost every line of a source file: they never pin a row down, and a row that
# names only such words would look "found" everywhere
GENERIC = {'const', 'let', 'var', 'function', 'class', 'return', 'new', 'this', 'async', 'await',
           'import', 'export', 'from', 'default', 'true', 'false', 'null', 'undefined', 'if', 'else',
           'for', 'while', 'of', 'in', 'typeof', 'Math', 'JSON', 'Object', 'Array', 'string',
           'number', 'boolean', 'void', 'null', 'get', 'set'}


def names_in(text):
    """the code names a row names: `foo`, `foo()`, `a.b`, `const a99`"""
    out = []
    for raw in TICKED.findall(text):
        n = raw.strip()
        if not n:
            continue
        for tok in n.replace('()', ' ').replace('(', ' ').replace(')', ' ').split():
            tok = tok.strip('.,;:')
            if tok in GENERIC:
                continue
            if IDENT.match(tok):
                out.append(tok)
    return out


def file_lines(path):
    try:
        with open(path, encoding='utf8') as fh:
            return fh.read().splitlines()
    except OSError:
        return None


def resolve(folder, src, name):
    """the file a heading names — (path, tried).

    The heading in a map says `src/props.js`, but the tool can be given the episode folder **or** the src
    folder, and the map may be written before the file is named the same way. So the name is tried in every
    place it could mean: against the folder given, against src, and — when the name already carries the
    `src/` prefix — against src with the prefix taken off (N96: the tool joined "src" with a name that
    already had "src/" and then reported the file as missing, so the maker fixed the map by hand and the
    tool never got the chance to say what was wrong).
    """
    cands = []
    if os.path.isabs(name):
        cands.append(name)
    else:
        cands.append(os.path.join(folder, name))
        cands.append(os.path.join(src, name))
        cands.append(os.path.join(src, os.path.basename(name)))
        if name.startswith('src/'):
            cands.append(os.path.join(src, name[len('src/'):]))
    for c in cands:
        if os.path.isfile(c):
            return c, cands
    return cands[0] if cands else name, cands


def check(folder):
    """(findings, notes) — findings are things a person must fix; notes are what the machine cannot judge"""
    src = folder if os.path.basename(folder.rstrip('/')) == 'src' else os.path.join(folder, 'src')
    mp = os.path.join(src, 'MAP.md')
    if not os.path.isfile(mp):
        return [], ['không có %s — tập này chưa có bản đồ mã' % mp]
    findings, notes = [], []
    text = open(mp, encoding='utf8').read()
    cur_file, cur_lines = None, None
    checked = 0
    for line in text.splitlines():
        m = HEAD.match(line)
        if m:
            cur_file = m.group(1).strip('`')
            said = int(m.group(2))
            path, tried = resolve(folder, src, cur_file)
            body = file_lines(path)
            if body is None:
                notes.append('%s: tệp không có (đã thử: %s)' % (cur_file, ', '.join(tried)))
                cur_lines = None
                continue
            have = len(body)
            drift = abs(have - said)
            if drift > LINE_TOL and drift > said * PCT_TOL:
                findings.append('%s: bản đồ nói %d dòng, tệp thật có %d dòng' % (cur_file, said, have))
            cur_lines = body
            continue
        r = ROW.match(line)
        if not r or cur_lines is None:
            continue
        lo = int(r.group(1))
        hi = int(r.group(2) or r.group(1))
        names = names_in(r.group(3))
        if not names:
            notes.append('%s dòng %d: không nêu tên nào để đối chiếu' % (cur_file, lo))
            continue
        checked += 1
        window = range(max(1, lo - TOL), min(len(cur_lines), hi + TOL) + 1)
        blob = '\n'.join(cur_lines[i - 1] for i in window)
        found = [n for n in names if n in blob]
        if not found:
            findings.append('%s dòng %d–%d: bản đồ nói %s, mã không có ở gần đó' %
                            (cur_file, lo, hi, ', '.join(names[:3])))
    return findings, notes


def selftest():
    import shutil
    import tempfile
    cases = []
    tmp = tempfile.mkdtemp(prefix='check-map-')
    try:
        src = os.path.join(tmp, 'src')
        os.makedirs(src)
        with open(os.path.join(src, 'film.js'), 'w', encoding='utf8') as fh:
            fh.write('\n'.join('const a%d = %d;' % (i, i) for i in range(1, 101)) + '\n')
        with open(os.path.join(src, 'MAP.md'), 'w', encoding='utf8') as fh:
            fh.write('# MAP\n\n## src/film.js (100 dòng)\n\n| Dòng | Cái gì |\n|---|---|\n'
                     '| 10–20 | `const a11` và `const a15` |\n'
                     '| 60–70 | `const a65` |\n'
                     '| 30–40 | `const a99` |\n'
                     '| 50 | một câu không nêu tên |\n')
        f, n = check(tmp)
        cases.append(('dòng đúng thì không báo', not any('dòng 10' in x for x in f), f, ''))
        cases.append(('tên không ở gần dòng đó thì báo', any('a99' in x for x in f), f, ''))
        cases.append(('dòng không nêu tên thì ghi chú, không kết luận',
                      any('không nêu tên' in x for x in n) and not any('không nêu tên' in x for x in f), n, ''))
        # the line count in the heading
        with open(os.path.join(src, 'MAP.md'), 'w', encoding='utf8') as fh:
            fh.write('# MAP\n\n## src/film.js (40 dòng)\n')
        f, n = check(tmp)
        cases.append(('số dòng trong tiêu đề lệch nhiều thì báo', any('dòng' in x for x in f), f, ''))
        # the heading says `src/film.js` (with the prefix, and in backticks) and the tool is given the src
        # folder — the file must still be found (N96)
        with open(os.path.join(src, 'MAP.md'), 'w', encoding='utf8') as fh:
            fh.write('# MAP\n\n## `src/film.js` (100 dòng)\n')
        f, n = check(src)
        cases.append(('tiêu đề có `src/` mà thư mục truyền vào là src thì vẫn tìm thấy tệp',
                      not any('tệp không có' in x for x in n), n, ''))
        cases.append(('số dòng đúng thì không báo khi tìm thấy tệp', not f, f, ''))
        # a map that does not exist
        f, n = check(os.path.join(tmp, 'khong-co'))
        cases.append(('không có bản đồ thì ghi chú, không đoán', not f and n, f, ''))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    failed = 0
    for name, ok, got, extra in cases:
        print('%s %s' % ('ok  ' if ok else 'FAIL', name) + ('' if ok else '  [%s]' % str(got)[:200]))
        if not ok:
            failed += 1
    if failed:
        print('check_map --selftest: %d/%d FAIL' % (failed, len(cases)))
        return 1
    print('check_map --selftest: %d/%d ok' % (len(cases), len(cases)))
    return 0


def main(argv):
    if '--selftest' in argv:
        return selftest()
    if len(argv) < 1:
        print(__doc__)
        return 0
    findings, notes = check(argv[0])
    for n in notes:
        print('  note: %s' % n)
    if findings:
        print('check_map: %d dòng của bản đồ không khớp mã:' % len(findings))
        for f in findings:
            print('  - %s' % f)
        return 1
    print('check_map: bản đồ khớp mã.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
