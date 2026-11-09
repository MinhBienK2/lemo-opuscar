#!/usr/bin/env python3
"""Mỗi nhãn phải nêu được vật nó gắn vào — python3 check_label_anchors.py <tập>

Người xem đọc một nhãn và tự hiểu: nhãn đó nói về **cái gì**. Nhưng nhãn nằm trong
khung, và trong khung có thể có nhiều vật giống nhau — hai cái áo treo cạnh nhau,
một cái áo và một cái khăn. Khi nhãn không nêu được vật của nó, người xem gán
nhãn cho vật sai và hiểu sai cả câu.

Ở tập 01, nghiệm thu cuối bắt được đúng lỗi này lúc 2:18: nhãn **"CHỒNG LÊN
NHAU"** chỉ vào *một cái áo đang treo cạnh chiếc khác trên cùng dây*, chứ không
phải vào chỗ hai cái áo chồng lên nhau. Người xem đọc nhãn, thấy một cái áo, và
hiểu rằng nó nói về cái áo đó.

Máy **không** đo được cái này (đó là lỗi đọc của người xem, và người chấm hình
bắt được nó bằng mắt — câu `nhan` trong `step6-assembly/RUBRIC.md`). Nhưng máy
đo được một thứ liên quan: **nhãn có mã neo không, và mã neo có đúng không.**

Mỗi thẻ trong bảng `CARDS` của `src/film.js` có thể mang thêm một trường:

    { id: 'dochong', text: 'CHỒNG ÁO', anchor: 'đàn áo phơi chồng trên dây', ... }

`anchor` là **tên vật trong `src/props.js`** — danh mục vật của tập, mà khóa của nó
chính là tên vật. Ba câu hỏi, mỗi câu một lỗi:

1. **Mã neo có trong danh mục không.** Mã neo không tồn tại là nhãn trỏ vào một
   vật mà phim không có.
2. **Nhãn có nói về vật khác không.** Chữ của nhãn được so với tên của mọi vật
   trong danh mục: nếu có vật khác **khớp chữ của nhãn rõ hơn** vật neo, thì
   nhãn đang nói về vật đó chứ không phải vật nó trỏ vào — đúng hình dạng của lỗi
   2:18 (chữ "chồng" thuộc về *đàn áo phơi chồng trên dây*, còn nhãn lại trỏ vào
   *một cái áo đơn*).
3. **Nhãn có mơ hồ không.** Nếu chữ của nhãn là **chuỗi con** của tên một vật
   khác (nhãn "ÁO PHÔNG" mà danh mục có cả "áo phông còn ướt (màu sẫm)" lẫn "áo
   phông đã khô (màu sáng)"), thì nhãn đọc ra là của cả hai: nó **bắt buộc** phải
   có phần định tính để không nhầm ("áo màu sẫm", "áo ngoài").

Thẻ **không** có mã neo thì máy không kiểm được gì về nó, và nói ra điều đó
(thay vì im lặng). Thẻ có mã neo thì ba câu hỏi trên áp dụng đầy đủ, và một
lỗi làm vòng chấm **đỏ** — cùng kiểu với `check_labels.py`.

**Kế hoạch migrate (ba bước, không bật cờ một lần).** Thẻ thiếu mã neo hiện
chỉ được **đếm và in ra**, chưa làm đỏ: có sáu tập đang chạy, và làm đỏ ngay
lúc này là chặn cả những tập đang đúng. Cách đi:

  1. **Thêm mã neo** cho mọi thẻ của mọi tập. Đo bằng `--survey`: nó in ra
     từng tập, còn thiếu bao nhiêu thẻ. "Hết thiếu" là một **sự đo được**, không
     phải một lời hứa.
  2. **Chạy ở chế độ cảnh báo** (mặc định hôm nay): thẻ thiếu mã neo vẫn được
     đếm, vẫn in, vẫn không làm đỏ — cổng chấm vẫn xanh, nhưng ai đọc log cũng
     thấy còn bao nhiêu thẻ chưa có neo.
  3. **Chuyển sang đỏ** khi `--survey` báo "0 thẻ thiếu" ở **mọi** tập: đặt
     `STRICT = True` trong tệp này, và từ đó thẻ thiếu mã neo cũng làm vòng
     chấm đỏ, y như ba câu hỏi kia.

Bước 3 là một sửa tệp có dấu vết trong git, không phải một lần bật cờ rồi
quên. Xem N142.

Mã ra: 0 không lỗi; 1 có lỗi; 2 dùng sai, hoặc tập chưa có bảng nhãn.
"""
import os
import re
import sys
import tempfile
import unicodedata

# những từ không mang tên: chúng nối một cụm lại với nhau
STOP = {'va', 'cua', 'la', 'co', 'duoc', 'voi', 'nhu', 'mot', 'cai', 'chiec', 'con', 'bi',
        'thay', 'cho', 'hay', 'hoac', 'de', 'khi', 'o', 'nay', 'do', 'nen', 'da', 'se',
        'van', 'tu', 'den', 'ra', 'vao', 'theo', 'bang', 'me', 'ben', 'trong', 'ngoai',
        'phia', 'duoi', 'giua', 'tren', 'day', 'moi', 'mot', 'ca', 've', 'cua', 'ma'}

WORD = re.compile(r'[a-z]{2,}')

# Bước 3 của kế hoạch migrate (xem docstring): đặt True khi `--survey` báo
# "0 thẻ thiếu" ở mọi tập. Hôm nay vẫn False — thẻ thiếu mã neo chỉ được đếm.
STRICT = False

# `đ` không phải dấu phụ nên NFD không bỏ nó — mà tiếng Việt thì đầy `đ`.
# Không sửa thì "đàn áo phơi chồng" thành "an ao phoi chong": từ "đàn" biến
# mất, và tên vật khớp nhầm với nhau. Mọi so khớp dựa trên tên vật đều cần nó.
D_STROKE = str.maketrans({'đ': 'd', 'Đ': 'D'})


def strip_accents(s):
    s = s.lower().translate(D_STROKE)
    return ''.join(c for c in unicodedata.normalize('NFD', s) if not unicodedata.combining(c))


def tokens(s):
    """những từ mang nghĩa của một nhãn hay một tên vật"""
    return {w for w in WORD.findall(strip_accents(s)) if w not in STOP}


def catalogue_names(ep):
    """tên vật trong `src/props.js` — khóa của danh mục chính là tên vật"""
    path = os.path.join(ep, 'src', 'props.js')
    try:
        src = open(path, encoding='utf8').read()
    except OSError:
        return None
    i = src.find('export const PROPS')
    if i < 0:
        return None
    return re.findall(r"^\s{2}'([^']+)'\s*:", src[i:], re.M)


def cards_of(ep):
    """[(id, text, lines, anchor)] — bảng CARDS của `src/film.js`"""
    path = os.path.join(ep, 'src', 'film.js')
    try:
        src = open(path, encoding='utf8').read()
    except OSError:
        return None
    i = src.find('const CARDS = [')
    if i < 0:
        return None
    j = src.find('\n];', i)
    body = src[i:j if j > 0 else len(src)]
    out = []
    for entry in entries_of(body):
        cid = re.search(r"\bid:\s*'([^']*)'", entry)
        text = re.search(r"\btext:\s*'([^']*)'", entry)
        lines = re.search(r"\blines:\s*\[([^\]]*)\]", entry)
        anchor = re.search(r"\banchor:\s*'([^']*)'", entry)
        if not (cid and text):
            continue
        out.append((cid.group(1), text.group(1),
                    lines.group(1) if lines else '',
                    anchor.group(1) if anchor else None))
    return out


def entries_of(body):
    """cắt một mảng đối tượng thành từng `{ ... }`, không vấp dấu ngoặc trong chuỗi"""
    out = []
    depth = 0
    start = None
    quote = None
    for k, ch in enumerate(body):
        if quote:
            if ch == quote and body[k - 1:k] != '\\':
                quote = None
            continue
        if ch in '"\'':
            quote = ch
            continue
        if ch == '{':
            if depth == 0:
                start = k
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start is not None:
                out.append(body[start:k + 1])
                start = None
    return out


def check(ep):
    """(số lỗi, danh sách lỗi, số thẻ chưa có mã neo, tổng số thẻ)"""
    cat = catalogue_names(ep)
    if cat is None:
        return None, ['không đọc được danh mục vật (src/props.js)'], 0, 0
    cards = cards_of(ep)
    if cards is None:
        return None, ['không đọc được bảng nhãn (const CARDS trong src/film.js)'], 0, 0
    names = {n: tokens(n) for n in cat}
    bad = []
    no_anchor = 0
    for cid, text, lines, anchor in cards:
        if not anchor:
            no_anchor += 1
            continue
        if anchor not in names:
            bad.append('%s: mã neo "%s" không có trong danh mục vật của src/props.js' % (cid, anchor))
            continue
        tt = tokens(text)
        if not tt:
            continue                      # nhãn chỉ có số và ký hiệu: không có tên để đối chiếu
        here = len(tt & names[anchor])
        best, bestname = 0, None
        for name, ntok in names.items():
            if name == anchor:
                continue
            s = len(tt & ntok)
            if s > best:
                best, bestname = s, name
        if best > here:
            bad.append('%s: nhãn "%s" khớp vật "%s" rõ hơn với vật neo "%s" — nhãn đang nói về vật khác'
                        % (cid, text, bestname, anchor))
            continue
        # mơ hồ: chữ của nhãn là chuỗi con của tên một vật khác
        for name, ntok in names.items():
            if name == anchor or not tt <= ntok:
                continue
            if len(tt) < 2:
                break                   # một từ chung ("ÁO") là loại vật, không phải tên
            extra = tt - ntok
            if not extra:
                bad.append('%s: nhãn "%s" đọc ra là của "%s" y như vật neo "%s" — phải có phần định tính '
                           '(ví dụ "áo màu sẫm")' % (cid, text, name, anchor))
            break
    return len(bad), bad, no_anchor, len(cards)


def report(ep):
    n, bad, no_anchor, total = check(ep)
    if n is None:
        for b in bad:
            print('check_label_anchors: %s' % b, file=sys.stderr)
        print('check_label_anchors: kiểm tra mã neo chưa áp dụng')
        return 2
    if bad:
        print('check_label_anchors: %d nhãn sai' % len(bad))
        for b in bad:
            print('  ' + b)
    else:
        print('check_label_anchors: %d nhãn có mã neo, không nhãn nào sai' % (total - no_anchor))
    if no_anchor:
        msg = ('  (%d/%d thẻ chưa có mã neo — máy không kiểm được chúng; thêm '
               '`anchor: \'<tên vật trong src/props.js>\'` vào thẻ đó)' % (no_anchor, total))
        if STRICT:
            # bước 3 của kế hoạch migrate: thiếu mã neo cũng làm đỏ
            print(msg + ' — CHẾ ĐỘ NGHIÊM: thẻ thiếu mã neo cũng làm vòng chấm đỏ')
            bad.append('%d/%d thẻ chưa có mã neo' % (no_anchor, total))
            return 1
        print(msg)
    return 1 if bad else 0


def survey(channel_root):
    """đo xem còn tập nào thiếu mã neo — bước 1 và 2 của kế hoạch migrate

    In ra từng tập: còn thiếu bao nhiêu thẻ. Khi mọi dòng đều "0", bước 3 (đặt
    STRICT = True trong tệp này) là an toàn.
    """
    import glob
    eps = sorted(glob.glob(os.path.join(channel_root, 'series', '*', '*')))
    eps = [e for e in eps if os.path.isdir(e)]
    if not eps:
        print('check_label_anchors --survey: không tìm thấy tập nào trong %s' % channel_root,
              file=sys.stderr)
        return 2
    missing_total = 0
    for ep in eps:
        n, bad, no_anchor, total = check(ep)
        if n is None:
            print('  %s — chưa có bảng nhãn (%s)' % (os.path.basename(ep), bad[0] if bad else '?'))
            continue
        missing_total += no_anchor
        if bad:
            print('  %s — %d nhãn sai, %d/%d thẻ chưa có mã neo'
                  % (os.path.basename(ep), len(bad), no_anchor, total))
        else:
            print('  %s — %d thẻ, %d chưa có mã neo' % (os.path.basename(ep), total, no_anchor))
    print('check_label_anchors --survey: còn %d thẻ chưa có mã neo trong %d tập'
          % (missing_total, len(eps)))
    if missing_total:
        print('  → bước 1 (thêm mã neo) chưa xong. Chế độ hiện tại: cảnh báo (không đỏ).')
    else:
        print('  → không còn thẻ thiếu mã neo: bước 3 (đặt STRICT = True) là an toàn.')
    return 0


def selftest():
    """tự kiểm: một nhãn đúng vật thì im, một nhãn trỏ nhầm vật thì bị bắt"""
    props = """export const PROPS = {
  'áo phông còn ướt (màu sẫm)': () => {},
  'áo phông đã khô (màu sáng)': () => {},
  'đàn áo phơi chồng trên dây': () => {},
};
"""
    good = """const CARDS = [
  { id: 'a', text: 'ÁO PHÔNG MÀU SẪM', anchor: 'áo phông còn ướt (màu sẫm)', lines: ['c1'] },
  { id: 'b', text: 'CHỒNG ÁO', anchor: 'đàn áo phơi chồng trên dây', lines: ['c2'] },
  { id: 'c', text: '20 g/kg', lines: ['c3'] },
];
"""
    wrong = """const CARDS = [
  { id: 'a', text: 'CHỒNG LÊN NHAU', anchor: 'áo phông còn ướt (màu sẫm)', lines: ['c1'] },
];
"""
    vague = """const CARDS = [
  { id: 'a', text: 'ÁO PHÔNG', anchor: 'áo phông còn ướt (màu sẫm)', lines: ['c1'] },
];
"""
    ghost = """const CARDS = [
  { id: 'a', text: 'QUẠT', anchor: 'quạt bàn có lưới', lines: ['c1'] },
];
"""
    with tempfile.TemporaryDirectory() as d:
        os.makedirs(os.path.join(d, 'src'))
        open(os.path.join(d, 'src', 'props.js'), 'w', encoding='utf8').write(props)
        cases = [(good, 0, None), (wrong, 1, 'vật khác'), (vague, 1, 'định tính'), (ghost, 1, 'không có trong danh mục')]
        for body, want_code, want_text in cases:
            open(os.path.join(d, 'src', 'film.js'), 'w', encoding='utf8').write(body)
            n, bad, _, _ = check(d)
            code = 2 if n is None else (1 if bad else 0)
            assert code == want_code, 'mã ra %s, cần %s (%s)' % (code, want_code, bad)
            if want_text:
                assert any(want_text in b for b in bad), 'thiếu %r trong %s' % (want_text, bad)
        # một nhãn đúng vật thì im lặng — ca âm tính
        open(os.path.join(d, 'src', 'film.js'), 'w', encoding='utf8').write(good)
        n, bad, no_anchor, total = check(d)
        assert not bad and no_anchor == 1 and total == 3, (bad, no_anchor, total)
    print('check_label_anchors: selftest OK')
    return 0


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--selftest':
        return selftest()
    if len(sys.argv) > 1 and sys.argv[1] == '--survey':
        here = os.path.dirname(os.path.abspath(__file__))
        return survey(os.path.dirname(here))
    if len(sys.argv) < 2:
        print('usage: check_label_anchors.py <tập> | --survey', file=sys.stderr)
        return 2
    return report(sys.argv[1])


if __name__ == '__main__':
    sys.exit(main())
