#!/usr/bin/env python3
"""Mỗi nhãn trong phim phải nằm ở câu nói ra nó — kiểm bằng máy, không bằng mắt.

Một nhãn trong `src/film.js` gắn với một câu lời kể. Nếu nhãn tên "LỚP HƠI ẨM" mà câu gọi tên
lớp hơi ẩm là câu 24, mà nhãn lại hiện từ câu 22, thì người xem đọc nhãn ở câu 22 và không thấy
gì đúng — đó là lỗi bản chấm hình của tập 1 (11/11/2026), và nó lọt qua cổng storyboard vì
cổng đó chỉ đọc LOOK.md.

Cách kiểm:
  1. đọc `CARDS` trong `src/film.js`: mỗi nhãn có `text` (chữ trên màn hình) và `lines` (câu
     mà nhãn gắn vào). Cửa sổ hiện của nhãn bắt đầu ở **hết câu trước** câu đầu tiên trong
     `lines`, nên nhãn luôn xuất hiện sớm hơn lời một nhịp — đó là chủ ý.
  2. đọc `voice/lines.json`: câu n (dòng n) là `c<n>`.
  3. với mỗi nhãn, tìm câu đầu tiên **gọi tên nó**: câu có nhiều từ đặc trưng của nhãn nhất.
     Ngưỡng: nhãn có 1 từ thì cần 1; 2 từ thì cần 2; từ 3 từ trở lên thì cần 3 (vì "288 g"
     sẽ khớp nhầm với "hai mươi" ở một câu khác nếu chỉ cần 2).
  4. nếu câu gọi tên đó **sớp hơn câu đầu của `lines` hơn một nhịp**, nhãn bị báo: nó nằm ở
     câu nào trong khi lời nói về nó ở câu nào.

Số trong nhãn đọc thành chữ ("3 ÁO" → "ba áo", "20 g/kg" → "hai mươi"), và đơn vị (g, kg, kJ,
%, °C) không tính là từ đặc trưng.

Dùng:  python3 channels/tram-nghi-nhieu/tools/check_labels.py <tập>
Thoát mã 0 = không có nhãn nào lệch; 1 = có nhãn lệch (in ra từng cái).
"""
import json
import os
import re
import sys
import unicodedata

# từ không mang nghĩa: chúng xuất hiện ở mọi câu và không nói lên vật gì
STOP = {
    'va', 'vao', 'cua', 'la', 'co', 'khong', 'de', 'thi', 'se', 'nay', 'hay', 'nhe',
    'voi', 'ma', 'ra', 've', 'bi', 'va', 'o', 'mot',
}
# đơn vị: không phải từ đặc trưng
UNITS = {'g', 'kg', 'kj', 'c', 'o', 'v', 'm', 's', 'n', 'pa', 'hz', '%', '°'}

WORDS = {
    1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn', 5: 'năm', 6: 'sáu', 7: 'bảy', 8: 'tám',
    9: 'chín', 10: 'mười', 11: 'mười một', 12: 'mười hai', 13: 'mười ba',
    14: 'mười bốn', 15: 'mười lăm', 16: 'mười sáu', 17: 'mười bảy', 18: 'mười tám',
    19: 'mười chín', 20: 'hai mươi', 30: 'ba mươi', 40: 'bốn mươi', 50: 'năm mươi',
    60: 'sáu mươi', 70: 'bảy mươi', 80: 'tám mươi', 90: 'chín mươi',
    100: 'một trăm', 200: 'hai trăm', 300: 'ba trăm',
}


def strip_accents(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s)
                   if unicodedata.category(c) != 'Mn')


def number_words(n):
    if n in WORDS:
        return WORDS[n]
    if n < 100:
        t, u = divmod(n, 10)
        tens = {1: 'mười', 2: 'hai mươi', 3: 'ba mươi', 4: 'bốn mươi', 5: 'năm mươi',
                6: 'sáu mươi', 7: 'bảy mươi', 8: 'tám mươi', 9: 'chín mươi'}.get(t, '')
        return (tens + ' ' + WORDS.get(u, '')).strip()
    if n < 1000:
        h, r = divmod(n, 100)
        head = {1: 'một trăm', 2: 'hai trăm', 3: 'ba trăm', 4: 'bốn trăm',
                5: 'năm trăm', 6: 'sáu trăm', 7: 'bảy trăm', 8: 'tám trăm',
                9: 'chín trăm'}.get(h, '')
        return (head + ' ' + number_words(r)).strip()
    return str(n)


def tokens(s):
    """the distinctive words of a label or a line: no accents, no digits, no function words"""
    s = strip_accents(s).lower()
    s = re.sub(r'\d+', lambda m: ' ' + number_words(int(m.group())) + ' ', s)
    out = []
    for w in re.split(r'[^a-z0-9°]+', s):
        if not w or w in STOP or w in UNITS or len(w) < 2:
            continue
        out.append(w)
    return out


def cards_of(film_js):
    m = re.search(r'const\s+CARDS\s*=\s*\[(.*?)\n\];', film_js, re.S)
    if not m:
        return []
    out = []
    for body in re.findall(r'\{([^{}]*)\}', m.group(1)):
        t = re.search(r"text:\s*'([^']*)'", body)
        l = re.search(r"lines:\s*\[([^\]]*)\]", body)
        if not t or not l:
            continue
        lines = [x.strip().strip("'\"") for x in l.group(1).split(',') if x.strip()]
        out.append((t.group(1), lines))
    return out


def numbers_in(text):
    """the figures a label draws: 288 g, 20 g/kg, 90 %, 1/2, 30 °C"""
    out = []
    for m in re.finditer(r'(\d+(?:[.,]\d+)?)\s*(?:/\s*(\d+))?', text):
        try:
            v = float(m.group(1).replace(',', '.'))
        except ValueError:
            continue
        if m.group(2):                      # "1/2" is one half, not one
            try:
                v = v / float(m.group(2))
            except (ValueError, ZeroDivisionError):
                pass
        out.append((v, m.group(0).strip()))
    return out


def said_numbers(text):
    """the figures a line says, as the words the voice speaks"""
    said = []
    s = strip_accents(text).lower()
    for m in re.finditer(r'\d+(?:[.,]\d+)?', s):
        try:
            said.append(float(m.group(0).replace(',', '.')))
        except ValueError:
            pass
    words = re.findall(r'[a-z]+', s)
    NUMW = ('khong', 'mot', 'hai', 'ba', 'bon', 'nam', 'sau', 'bay', 'tam', 'chin', 'muoi',
            'tram', 'nghin', 'ngan', 'trieu', 'ty', 'ti', 'linh', 'le', 'ruoi', 'mot',
            'nua', 'phan')
    run = []
    for w in words:
        if w in NUMW:
            run.append(w)
        else:
            if run:
                said.append(' '.join(run))
                run = []
    if run:
        said.append(' '.join(run))
    return said


def is_said(value, spoken, all_said):
    """is this figure said? the words of the figure, or a fraction said as 'mot nua'"""
    words = number_words(int(value)) if float(value).is_integer() else None
    if words:
        w = strip_accents(words)
        for s in spoken:
            # an empty line says nothing: '' is a substring of every word, so it would answer
            # "said" for every figure in the film
            if not s:
                continue
            ss = strip_accents(s).lower()
            if w in ss or ss in w:
                return True
    # "mot nua" says a half
    if abs(value - 0.5) < 1e-9:
        for s in spoken:
            ss = strip_accents(s).lower()
            if 'mot nua' in ss or 'nua' in ss:
                return True
    return False


def selftest():
    """a check that answers "yes" to everything is not a check: prove it can still say "no".

    Every case here is a real line of a real episode, so a change in the helpers that makes the
    check pass everything shows up here instead of in a film.
    """
    cases = [
        ('numbers_in("1/2 TỐC ĐỘ") có giá trị 0.5',
         lambda: numbers_in('1/2 TỐC ĐỘ')[0][0] == 0.5),
        ('một câu rỗng không được trả lời "đã nói"',
         lambda: not is_said(288, [''], [''])),
        ('"hai cái kim lệch nhau" không nói 288',
         lambda: not is_said(288, ['hai cái kim lệch nhau'], ['hai cái kim lệch nhau'])),
        ('"hai mươi gam" nói 20',
         lambda: is_said(20, ['hai mươi gam'], ['hai mươi gam'])),
        ('"một nửa" nói 1/2',
         lambda: is_said(0.5, ['tốc độ bay hơi rơi còn một nửa'], ['tốc độ bay hơi rơi còn một nửa'])),
        ('"ba mươi độ" nói 30',
         lambda: is_said(30, ['ba mươi độ thì hơi nước lan xa hơn'], ['ba mươi độ thì hơi nước lan xa hơn'])),
    ]
    bad = [name for name, ok in cases if not ok()]
    for name, ok in cases:
        print(f'  {"ok  " if ok() else "FAIL"} {name}')
    if bad:
        print(f'check_labels --selftest: {len(bad)}/{len(cases)} FAIL')
        return 1
    print(f'check_labels --selftest: {len(cases)}/{len(cases)} ok')
    return 0


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--selftest':
        return selftest()
    if len(sys.argv) < 2:
        print('usage: check_labels.py <episode>', file=sys.stderr)
        return 2
    ep = sys.argv[1]
    film = os.path.join(ep, 'src', 'film.js')
    linesf = os.path.join(ep, 'voice', 'lines.json')
    if not os.path.isfile(film) or not os.path.isfile(linesf):
        print(f'check_labels: thiếu {film} hoặc {linesf}', file=sys.stderr)
        return 2
    body = open(film, encoding='utf-8').read()
    cards = cards_of(body)
    if not cards:
        # a film that draws labels some other way gets no verdict from this check, and it must say so
        print('check_labels: không tìm thấy bảng CARDS trong src/film.js — kiểm tra nhãn chưa áp dụng')
        return 2
    lines = json.load(open(linesf, encoding='utf-8'))
    texts = [(l.get('text') or '') for l in lines]
    ltok = [set(tokens(t)) for t in texts]

    bad = []
    for text, lines_ids in cards:
        if not lines_ids:
            continue
        nums = []
        for x in lines_ids:
            m = re.fullmatch(r'c(\d+)', x)
            if m:
                nums.append(int(m.group(1)))
        if not nums:
            continue
        first = min(nums)
        wt = set(tokens(text))
        if not wt:
            continue
        need = 1 if len(wt) == 1 else (2 if len(wt) == 2 else 3)
        naming = None
        for i, tk in enumerate(ltok, 1):
            if len(wt & tk) >= need:
                naming = i
                break
        if naming is None:
            continue                      # nhãn là số của biểu đồ, không có câu nào gọi tên
        if first < naming - 1:
            said = texts[naming - 1]
            bad.append((text, first, naming, said))

    if not bad:
        print('check_labels: mọi nhãn nằm đúng câu')
    else:
        print(f'check_labels: {len(bad)} nhãn nằm lệch câu')
        for text, first, naming, said in bad:
            print(f'  "{text}" gắn từ câu {first}; câu gọi tên nó là câu {naming}: "{said}"')

    # a figure drawn on a label that the voice never says: the viewer reads a number the story never
    # explains. The other way round (a number said but not drawn) is the machine's NUM flag; this is
    # the same mistake the other way round.
    spoken_all = [strip_accents(t).lower() for t in texts]
    spoken_all += [strip_accents(str(l.get('say') or '')).lower() for l in lines]
    silent = []
    for text, lines_ids in cards:
        for value, raw in numbers_in(text):
            if is_said(value, spoken_all, spoken_all):
                continue
            silent.append((text, raw))
            break
    if silent:
        print(f'check_labels: {len(silent)} nhãn vẽ con số mà phim không nói')
        for text, raw in silent:
            print(f'  "{text}" — con số {raw} không có trong lời kể')
        return 1
    return 0 if not bad else 1


if __name__ == '__main__':
    sys.exit(main())
