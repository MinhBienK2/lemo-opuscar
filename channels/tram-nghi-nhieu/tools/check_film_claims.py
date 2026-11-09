#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""check_film_claims.py — lời hứa của file nghiên cứu phải được giữ trong phim.

  python3 channels/tram-nghi-nhieu/tools/check_film_claims.py <tập>
  python3 channels/tram-nghi-nhieu/tools/check_film_claims.py --selftest

`research/FACTS.md` không chỉ là "cái gì đúng". Nó còn có hai loại dòng nói **cái gì phim phải làm**:

  · **Dùng trong phim:** — giá trị, câu hay hình mà bản nghiên cứu chốt là phim sẽ dùng;
  · **Phim nói:** — câu lời kể, viết nguyên văn trong dấu nháy.

Hai loại đó là **lời hứa**, và không ai đối chiếu: `check_claims.py` của thư viện đi theo hướng ngược
(là con số trên màn hình có được file nghiên cứu đỡ không), nên một file nghiên cứu hứa "nhiệt kế trong
cảnh chỉ hai mươi lăm độ" rồi phim không có nhiệt kế nào cũng trả lời PASS. Một lời hứa không được
giữ thì tập phim nói dối chính file của nó, và người xem không có cách nào biết (N82).

Bài này đối chiếu hai chiều:

  1. **Câu "Phim nói:"** — câu trong dấu nháy phải có trong `voice/lines.json` (bỏ dấu câu, bỏ
     chữ hoa thường, gộp khoảng trắng). Khi không có, bài này in ra **câu gần nhất** mà phim thật sự
     nói, để người đọc thấy ngay: phim nói câu khác, hay file nghiên cứu trích sai.
  2. **Giá trị "Dùng trong phim:"** — mỗi con số trong dòng đó (viết bằng số hoặc bằng chữ) phải
     xuất hiện ở lời kể hoặc ở thẻ chữ trong `src/*.js`. Số viết bằng chữ được đổi ra số (mười
     chữ trong tiếng Việt), và số trong ngoặc ngay sau được coi là **cách viết khác** của cùng
     một giá trị, nên "hai kilojoule bốn trăm năm mươi cho mỗi gram (2,44 kJ/g)" chỉ còn một lời
     hứa, không phải hai. Một số nằm trong một biểu thức tính ("2500,8 − 59,0 + 1,0 ≈ 2442 J/g")
     là công thức, không phải giá trị phim phải chiếu, nên máy không hỏi.

Cả hai lớp đều là **cảnh báo**, và bài này trả mã 0: một lời hứa chưa được giữ nguyên văn có thể là
file nghiên cứu trích lại ý thay vì trích nguyên văn, và một bài kiểm tra chặn ở chỗ không phải
nguyên nhân thì tệ hơn không có bài kiểm tra (xem N85). Muốn chặn thì thêm `--strict`.

Máy không đọc được: một giá trị nằm trong hình mà không nằm trong lời kể cũng không nằm trong thẻ chữ
(vẽ thẳng vào texture, đo bằng canvas) — bài này nói rõ và không kết luận.
"""
import json
import os
import re
import sys

# ——— số tiếng Việt ———
DIGITS = {'không': 0, 'một': 1, 'hai': 2, 'ba': 3, 'bốn': 4, 'năm': 5, 'sáu': 6, 'bảy': 7,
          'tám': 8, 'chín': 9, 'chín': 9, 'mười': 10}
WORD = re.compile(r'\b(' + '|'.join(sorted(set(list(DIGITS) + ['lẻ', 'trăm', 'nghìn', 'ngàn', 'triệu',
                                                               'tỷ', 'phần']), key=len, reverse=True)) + r')\b')


def parse_vn(words):
    """một dãy chữ số tiếng Việt → số: 'hai mươi lăm' → 25, 'một trăm hai mươi ba' → 123"""
    total = group = cur = 0
    tens = False
    frac = None
    for w in words:
        if w == 'phần':
            frac = cur or 1
            cur = 0
            tens = False
            continue
        if w in DIGITS and w != 'mười':
            cur += DIGITS[w]
        elif w == 'mười':
            cur = (cur or 1) * 10 if not tens else cur
            tens = True
        elif w == 'lẻ':
            tens = False
        elif w == 'trăm':
            group = (cur or 1) * 100
            cur = 0
            tens = False
        elif w in ('nghìn', 'ngàn'):
            total += (group + cur or 1) * 1000
            group = cur = 0
            tens = False
        elif w == 'triệu':
            total += (group + cur or 1) * 1000000
            group = cur = 0
            tens = False
        elif w in ('tỷ', 'ty'):
            total += (group + cur or 1) * 1000000000
            group = cur = 0
            tens = False
    value = total + group + cur
    if frac:
        value = frac / value if value else 0
    return value


def number_runs(text):
    """the number-word runs of a text: [('hai mươi lăm', 25), ...]"""
    out = []
    for m in WORD.finditer(text):
        start = m.start()
        words = []
        end = start
        while True:
            wm = WORD.match(text, end)
            if not wm:
                break
            words.append(wm.group(1))
            end = wm.end()
        if words:
            out.append((text[start:end], parse_vn(words)))
            # continue after this run
            m = WORD.search(text, end)
    return out


DIGIT_NUM = re.compile(r'\d+(?:[.,]\d+)?')


def norm(s):
    s = s.lower().replace('đ', 'd')
    s = re.sub(r'[^\w\s%°]', ' ', s)
    return ' '.join(s.split())


def promised_lines(facts):
    """the lines of the research file that promise something to the film"""
    out = []
    for line in facts.splitlines():
        low = line.lower()
        if 'dùng trong phim' in low or 'phim nói' in low or 'phim noi' in low:
            out.append(line)
    return out


def quoted(line):
    """the sentence a 'Phim nói:' line promises, in quotes"""
    m = re.search(r'[“"«]([^"”»]{8,})[”"»]', line)
    return m.group(1) if m else None


def digits_in(text):
    """the digit strings a text carries, with the separators normalised"""
    out = set()
    for m in DIGIT_NUM.finditer(text):
        s = m.group(0).replace(' ', '')
        out.add(s)
        out.add(s.replace(',', '.'))
        if ',' in s:
            out.add(s.replace(',', ''))
        if '.' in s:
            out.add(s.replace('.', ','))
    return out


def value_present(value, text, digits):
    """is this promised value anywhere in the film's words?"""
    if value is None:
        return True
    if abs(value - round(value)) < 1e-9:
        cands = {str(int(round(value))), str(int(round(value))).replace(',', '.')}
    else:
        cands = {('%g' % value), ('%.2f' % value).rstrip('0').rstrip('.'),
                 ('%.2f' % value), ('%.1f' % value), str(value)}
    for c in cands:
        if c in digits:
            return True
        # a value written in words in the film ("hai mươi lăm độ")
        if re.search(r'\b' + re.escape(c) + r'\b', text):
            return True
    return False


def nearest(texts, quote):
    """the line of the film that says the promised thing in other words — the closest one, by words shared"""
    q = set(norm(quote).split())
    if not q:
        return None
    best, score = None, 0
    for t in texts:
        s = set(norm(t).split())
        if not s:
            continue
        n = len(q & s)
        if n > score:
            best, score = t, n
    return best if score >= 2 else None


def check(episode):
    facts_p = os.path.join(episode, 'research', 'FACTS.md')
    if not os.path.isfile(facts_p):
        return [], ['không có %s' % facts_p], []
    facts = open(facts_p, encoding='utf8').read()
    # the film's words: the narration, and the text of the cards in the code
    words = []
    said = []
    lines_p = os.path.join(episode, 'voice', 'lines.json')
    if os.path.isfile(lines_p):
        try:
            for l in json.load(open(lines_p, encoding='utf8')):
                t = str(l.get('text', ''))
                words.append(t)
                said.append('%s: %s' % (l.get('id', '?'), t))
        except (OSError, ValueError):
            pass
    src = os.path.join(episode, 'src')
    if os.path.isdir(src):
        for name in sorted(os.listdir(src)):
            if name.endswith('.js'):
                try:
                    words.append(open(os.path.join(src, name), encoding='utf8').read())
                except OSError:
                    pass
    if not said:
        return [], ['chưa có lời kể (voice/lines.json) — bài này chưa kết luận được gì']
    text = norm(' '.join(words))
    digits = digits_in(' '.join(words))

    warnings, notes = [], []
    for line in promised_lines(facts):
        if 'phim nói' in line.lower() or 'phim noi' in line.lower():
            q = quoted(line)
            if not q:
                notes.append('dòng "Phim nói:" không có câu trong dấu nháy: %s' % line[:80])
                continue
            if norm(q) not in text:
                near = nearest(said, q)
                warnings.append('lời hứa "Phim nói:" không có nguyên văn trong lời kể: "%s"%s'
                                % (q[:90], (' — câu gần nhất: "%s"' % near[:90]) if near else ''))
            continue
        # "Dùng trong phim:" — the values it promises
        body = line.split(':', 1)[1] if ':' in line else line
        promises = []          # (label, value) — a value written in words, or in digits
        for phrase, value in number_runs(body):
            if value and value >= 1:
                promises.append((phrase, value))
        for m in DIGIT_NUM.finditer(body):
            s = m.group(0)
            # a number inside an arithmetic expression ("2500,8 − 59,0 + 1,0 − 0,94 ≈ 2442 J/g") is
            # the recipe, not a value the film shows
            window = body[max(0, m.start() - 30):m.end() + 30]
            if re.search(r'\d\s*[+\-−–=≈×*/]\s*\d', window):
                continue
            try:
                promises.append((s, float(s.replace(',', '.'))))
            except ValueError:
                pass
        reported = False
        for label, value in promises:
            if reported:
                break
            ok = value_present(value, text, digits)
            if not ok and ' ' in label:
                # the same value may be written in digits right after the words ("… (2,44 kJ/g)")
                near = body[body.find(label) + len(label):][:40]
                alt = DIGIT_NUM.search(near)
                if alt:
                    try:
                        ok = value_present(float(alt.group(0).replace(',', '.')), text, digits)
                    except ValueError:
                        ok = False
            if not ok:
                warnings.append('lời hứa trong "Dùng trong phim:" không thấy trong phim: "%s" (= %g)'
                                % (label, value))
                reported = True
    return warnings, notes


def selftest():
    import shutil
    import tempfile
    cases = []
    tmp = tempfile.mkdtemp(prefix='film-claims-')
    try:
        ep = os.path.join(tmp, 'tap-x')
        os.makedirs(os.path.join(ep, 'research'))
        os.makedirs(os.path.join(ep, 'voice'))
        os.makedirs(os.path.join(ep, 'src'))
        open(os.path.join(ep, 'research', 'FACTS.md'), 'w', encoding='utf8').write(
            '# FACTS\n\n'
            '- **Dùng trong phim:** nhiệt độ **hai mươi lăm độ** (25 °C).\n'
            '- **Dùng trong phim:** áp suất **3,17 kPa**.\n'
            '- **Phim nói:** **"không khí chứa được khoảng hai mươi gam hơi nước"**\n')
        open(os.path.join(ep, 'voice', 'lines.json'), 'w', encoding='utf8').write(json.dumps(
            [{'id': 'c1', 'text': 'Nhiệt kế trong cảnh chỉ hai mươi lăm độ.'},
             {'id': 'c2', 'text': 'Không khí chứa được khoảng hai mươi gam hơi nước.'}]))
        open(os.path.join(ep, 'src', 'film.js'), 'w', encoding='utf8').write(
            "const CARDS = [{ t: '3,17 kPa' }];\n")
        w, n = check(ep)
        cases.append(('câu "Phim nói:" có trong lời kể thì không báo lỗi',
                      not any('Phim nói' in x for x in w), w, ''))
        cases.append(('số viết bằng chữ đã đổi ra số thì không báo',
                      not any('hai mươi lăm' in x for x in w), w, ''))
        cases.append(('số có trong thẻ chữ thì không báo',
                      not any('3,17' in x for x in w), w, ''))
        # now a promise the film does not keep
        open(os.path.join(ep, 'research', 'FACTS.md'), 'w', encoding='utf8').write(
            '- **Dùng trong phim:** hệ số **1,58 kPa**.\n'
            '- **Phim nói:** **"câu này phim không nói"**\n')
        w, n = check(ep)
        cases.append(('lời hứa mà phim không giữ thì báo',
                      any('1,58' in x for x in w) and any('không nói' in x for x in w), w, ''))
        # a film with no script yet: the machine cannot conclude, and says so
        open(os.path.join(ep, 'voice', 'lines.json'), 'w', encoding='utf8').write('[]')
        w, n = check(ep)
        cases.append(('chưa có lời kể thì nói thẳng là không kết luận được',
                      any('chưa có lời kể' in x for x in n), n, ''))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    failed = 0
    for name, ok, got, extra in cases:
        print('%s %s' % ('ok  ' if ok else 'FAIL', name) + ('' if ok else '  [%s]' % str(got)[:200]))
        if not ok:
            failed += 1
    if failed:
        print('check_film_claims --selftest: %d/%d FAIL' % (failed, len(cases)))
        return 1
    print('check_film_claims --selftest: %d/%d ok' % (len(cases), len(cases)))
    return 0


def main(argv):
    if '--selftest' in argv:
        return selftest()
    strict = '--strict' in argv
    argv = [a for a in argv if not a.startswith('--')]
    if len(argv) < 1:
        print(__doc__)
        return 0
    warnings, notes = check(argv[0])
    for x in notes:
        print('  note: %s' % x)
    if notes and not warnings:
        print('check_film_claims: %s' % notes[0])
        return 2
    for x in warnings:
        print('  cảnh báo: %s' % x)
    if warnings:
        print('check_film_claims: %d lời hứa của file nghiên cứu mà phim chưa giữ đúng nguyên văn — '
              'đọc lại và quyết định: file nghiên cứu sửa, hay phim sửa.' % len(warnings))
        return 1 if strict else 0
    print('check_film_claims: phim giữ đúng những gì file nghiên cứu hứa.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
