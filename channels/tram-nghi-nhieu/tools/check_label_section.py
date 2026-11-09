#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bản chấm phải **liệt kê** nhãn đọc nhầm — python3 check_label_section.py <bản chấm> <tập>

Máy đo được một nửa của lời nói về nhãn: nó biết nhãn có mã neo không, và mã neo
có đúng vật không (`check_label_anchors.py`). Nửa còn lại — **người xem có đọc
nhầm nhãn nào không** — chỉ mắt người chấm thấy được, và chỉ khi người chấm
thật sự nhìn.

Vì vậy lời dặn trong mẫu người chấm (`step6-assembly/PROMPT_CRITIC.md`,
`step7-delivery/PROMPT_CRITIC.md`) là một **lời hứa**: "Liệt kê mọi nhãn như vậy
ở mục `## NHÃN ĐỌC NHẦM`". Không có máy nào hỏi xem mục đó có trong bản chấm
không, nên một bản chấm không có mục đó vẫn xanh, vẫn đóng tem, vẫn xuất bản —
và lỗi 2:18 của tap-01 (nhãn "CHỒNG LÊN NHAU" chỉ vào một cái áo đơn) có thể
đi qua nguyên vẹn.

Công cụ này hỏi đúng câu đó, và hỏi thêm hai câu mà người chấm hay trả lời
bằng trí nhớ:

  1. **Mục `## NHÃN ĐỌC NHẦM` có trong bản chấm không.** Không có → đỏ, y như
     `check_labels.py`: bản chấm chưa nói lời hứa của nó.
  2. **Mục đó có trả lời không.** Rỗng (không dòng nào, cũng không ghi
     `KHÔNG CÓ`) → đỏ: người chấm đã quên trả lời.
  3. **Câu mà bản chấm nhắc tới có thật không.** Bản chấm nói "c99" mà phim
     chỉ có 40 câu → bản chấm đang nói về thứ không có trong phim → đỏ.
  4. **Nhãn mà bản chấm nêu có thật trong phim không.** Bản chấm viết một nhãn
     không tồn tại trong `src/film.js` → hoặc bản chấm nói về phim khác, hoặc
     nó nhớ sai → đỏ.
  5. *(cảnh báo, không đỏ)* một dòng nào đó không nêu rõ chữ nhãn, hoặc không
     nêu mã câu — người đọc không biết mở cảnh nào để kiểm.

Công cụ này **chỉ xét bản chấm của vòng đang chạy**: `review.sh` gọi nó ngay
sau khi người chấm viết xong bản chấm của vòng hình và vòng nghiệm thu cuối.
Những bản chấm cũ đã nằm trên đĩa không bị soi lại — xem kế hoạch migrate của
N142 trong `improvements/README.md`.

Dùng:  python3 channels/tram-nghi-nhieu/tools/check_label_section.py <bản chấm> <tập>
        (tập = thư mục tập: đọc `voice/lines.json` và `src/film.js` trong đó)
Thoát mã 0 = không lỗi; 1 = có lỗi; 2 = dùng sai hoặc không đọc được tập.
"""
import json
import os
import re
import sys
import tempfile
import unicodedata

# những từ không mang tên: chúng nối một cụm lại với nhau
STOP = {'va', 'cua', 'la', 'co', 'duoc', 'voi', 'nhu', 'mot', 'cai', 'chiec', 'con', 'bi',
        'thay', 'cho', 'hay', 'hoac', 'de', 'khi', 'o', 'nay', 'do', 'nen', 'da', 'se',
        'van', 'tu', 'den', 'ra', 'vao', 'theo', 'bang', 'me', 'ben', 'trong', 'ngoai',
        'phia', 'duoi', 'giua', 'tren', 'day', 'moi', 'ca', 've', 'ma', 'nham', 'the',
        'thieu', 'chi', 'loi', 'dung', 'the', 'roi', 'sau', 'truoc', 'cung'}

WORD = re.compile(r'[a-z]{2,}')
HEADING = re.compile(r'^\s{0,3}#{1,6}\s*(.+?)\s*$')
BULLET = re.compile(r'^\s*(?:[-*+•]|\d+[.)])\s+')
CUE = re.compile(r'\bc(\d+)\b')
# một chữ nhãn được nêu: trong ngoặc kép, hoặc một dãy chữ IN HOA
QUOTED = re.compile(r'[“”"«»\']([^“”"«»\']{2,60})[“”"«»\']')
CAPS = re.compile(r'\b([A-ZĐÁÀẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÉÈẺẼẸÊỀẾỂỄỆÍÌỈĨỊÓÒỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÚÙỦŨỤƯỪỨỬỮỰỲÝỶỸỴ]{2,}(?:\s+[A-ZĐÁÀẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÉÈẺẼẸÊỀẾỂỄỆÍÌỈĨỊÓÒỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÚÙỦŨỤƯỪỨỬỮỰỲÝỶỸỴ]{2,})*)')
# người chấm đề xuất một nhãn MỚI (chưa có trong phim) — đó không phải lỗi.
# Chỉ những cụm nói rõ "nên đổi/đề xuất/thay bằng" mới được tính; "đã bị đổi tên"
# là nhãn cũ, và nhãn cũ là bản chấm sai.
PROPOSE = ('nen ', 'de xuat', 'goi lai', 'doi thanh', 'sua thanh', 'thay bang',
          'them nhan', 'nen doi', 'nen sua', 'nen goi', 'nen them')

# `đ` không phải dấu phụ nên NFD không bỏ nó — mà tiếng Việt thì đầy `đ`.
# Không sửa thì "đàn áo" thành "an ao", và từ "đàn" biến mất khỏi mọi so khớp.
D_STROKE = str.maketrans({'đ': 'd', 'Đ': 'D'})


def strip_accents(s):
    s = s.lower().translate(D_STROKE)
    return ''.join(c for c in unicodedata.normalize('NFD', s) if not unicodedata.combining(c))


def norm(s):
    """chữ so sánh được: bỏ dấu, bỏ câu, gộp khoảng trắng"""
    s = strip_accents(s)
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    return ' '.join(s.split())


def tokens(s):
    """những từ mang nghĩa của một nhãn hay một tên vật"""
    return {w for w in WORD.findall(strip_accents(s)) if w not in STOP}


def section_of(text):
    """(phần thân của mục NHÃN ĐỌC NHẦM, có mục hay không)

    Tên mục được so không dấu. Trước hết so **trùng khít**; chỉ khi không có
    mục nào trùng khít mới so bằng cách chứa — nếu không, một tiêu đề bản chấm
    có nhắc "nhãn đọc nhầm" trong câu đề sẽ nuốt mất mục thật.
    """
    lines = text.splitlines()
    heads = [(i, HEADING.match(line)) for i, line in enumerate(lines)]
    heads = [(i, m) for i, m in heads if m]

    def pick(pred):
        for i, m in heads:
            if pred(norm(m.group(1))):
                return i
        return None

    start = pick(lambda h: h.rstrip(':') == 'nhan doc nham')
    if start is None:
        start = pick(lambda h: 'nhan doc nham' in h)
    if start is None:
        return None, False
    body = []
    for line in lines[start + 1:]:
        if HEADING.match(line):
            break
        body.append(line)
    return body, True


def lines_of(ep):
    """mã câu có thật trong `voice/lines.json`"""
    path = os.path.join(ep, 'voice', 'lines.json')
    try:
        data = json.load(open(path, encoding='utf8'))
    except (OSError, ValueError):
        return None
    if isinstance(data, dict):
        data = data.get('lines', [])
    out = set()
    for row in data:
        if isinstance(row, dict):
            cid = row.get('id')
            if cid:
                out.add(str(cid))
        elif isinstance(row, str):
            out.add(row)
    return out


def card_texts(ep):
    """chữ của mọi nhãn trong bảng CARDS của `src/film.js`"""
    path = os.path.join(ep, 'src', 'film.js')
    try:
        src = open(path, encoding='utf8').read()
    except OSError:
        return None
    i = src.find('const CARDS = [')
    if i < 0:
        return []
    out = []
    for m in re.finditer(r"\btext:\s*'([^']*)'", src[i:]):
        t = m.group(1)
        if t:
            out.append(t)
    return out


# Chữ không chỉ nằm trong CARDS: đạo cụ còn **in chữ lên mình** (thang đo, đồng hồ,
# biển báo). Người chấm nói về một nhãn như vậy là nói về thứ có thật trong phim —
# không phải về nhãn không tồn tại. Không biết những chữ đó thì luật sẽ đỏ oan.
DRAWN = re.compile(r"'([^'\n]{2,60})'")


def drawn_texts(ep):
    """mọi chữ mà đạo cụ in ra trong `src/props.js` và `src/film.js`

    Chỉ nhận chữ viết HOA toàn bộ (nhãn trên vật luôn viết hoa); chữ thường trong
    mã ("sans-serif", "bold 54px") không phải nhãn.
    """
    out = []
    for name in ('props.js', 'film.js'):
        path = os.path.join(ep, 'src', name)
        try:
            src = open(path, encoding='utf8').read()
        except OSError:
            continue
        for m in DRAWN.finditer(src):
            t = m.group(1)
            letters = [c for c in t if c.isalpha()]
            if len(letters) < 2:
                continue
            if not all(c.isupper() for c in letters):
                continue
            out.append(t)
    return out


def label_candidates(line):
    """những chữ nhãn mà dòng này nêu ra: trong ngoặc kép, hoặc viết IN HOA"""
    out = []
    for m in QUOTED.finditer(line):
        out.append(m.group(1))
    for m in CAPS.finditer(line):
        out.append(m.group(1))
    return [c for c in out if tokens(c)]


def matches_card(cand, cards):
    """chữ này có phải một nhãn của phim không (bằng chính nó, hoặc là một phần của nó)"""
    ct = tokens(cand)
    if not ct:
        return False
    nc = norm(cand)
    for card in cards:
        if norm(card) == nc:
            return True
        if ct <= tokens(card):
            return True
    return False


def check(report_path, ep):
    """(số lỗi, danh sách lỗi, số cảnh báo)"""
    try:
        text = open(report_path, encoding='utf8', errors='replace').read()
    except OSError as e:
        return 1, ['không đọc được bản chấm %s (%s)' % (report_path, e)], []

    body, has = section_of(text)
    if not has:
        return 1, ['bản chấm không liệt kê nhãn đọc nhầm — thiếu mục "## NHÃN ĐỌC NHẦM"'], []

    cues = lines_of(ep)
    cards = card_texts(ep)
    if cues is None or cards is None:
        return 1, ['không đọc được tập %s (voice/lines.json hoặc src/film.js)' % ep], []
    known = list(cards) + drawn_texts(ep)

    bullets = [ln for ln in body if BULLET.match(ln)]
    said_none = any(norm(ln).startswith('khong co') for ln in body if ln.strip())
    if not bullets:
        if said_none:
            return 0, [], []
        return 1, ['mục "## NHÃN ĐỌC NHẦM" rỗng — ghi "KHÔNG CÓ" nếu không nhãn nào mơ hồ'], []

    bad = []
    warns = []
    for ln in bullets:
        low = norm(ln)
        # (3) câu có thật không
        for c in CUE.findall(low):
            if ('c' + c) not in cues:
                bad.append('bản chấm nhắc tới câu c%s mà phim không có câu đó' % c)
        # (4) nhãn có thật trong phim không
        cands = label_candidates(ln)
        if not cands:
            warns.append('dòng "%s" không nêu rõ chữ nhãn — người đọc không biết nói về nhãn nào'
                         % ln.strip()[:80])
        else:
            # một nhãn người chấm **đề xuất thêm** không phải lỗi: phim chưa có nó là đúng.
            # Một nhãn không khớp nhãn nào mà không có ý đề xuất thì là bản chấm sai.
            proposed = any(w in low for w in PROPOSE)
            for cand in cands:
                if not matches_card(cand, known):
                    msg = 'bản chấm nêu nhãn "%s" mà phim không có nhãn nào như vậy' % cand.strip()
                    if proposed:
                        warns.append(msg + ' (có vẻ là nhãn đề xuất thêm — ghi rõ đi để không bị hiểu là nhãn của phim)')
                    else:
                        bad.append(msg)
                    break
        # (5) cảnh báo: dòng không nêu mã câu
        if not CUE.search(low):
            warns.append('dòng "%s" không nêu mã câu — người đọc không biết mở cảnh nào' % ln.strip()[:80])
    return len(bad), bad, warns


def report(report_path, ep):
    n, bad, warns = check(report_path, ep)
    if n:
        print('check_label_section: %d lỗi trong bản chấm' % n)
        for b in bad:
            print('  ' + b)
    else:
        print('check_label_section: bản chấm có mục NHÃN ĐỌC NHẦM, nhãn nêu đều có thật trong phim')
    for w in warns:
        print('  (cảnh báo) ' + w)
    return 1 if n else 0


def selftest():
    """tự kiểm: bản chấm có mục thì im, bản chấm không có mục thì bị bắt"""
    lines = '[{"id": "c1", "text": "Quần áo ướt."}, {"id": "c2", "text": "Hai cái áo."}]'
    film = """const CARDS = [
  { id: 'a', text: 'QUẦN ÁO ƯỚT', lines: ['c1'] },
  { id: 'b', text: 'CHỒNG LÊN NHAU', lines: ['c2'] },
];
"""
    ok = """# Bản chấm

VERDICT: PASS

## NHÃN ĐỌC NHẦM
- c2 "CHỒNG LÊN NHAU": nhãn chỉ vào một cái áo đơn, dễ đọc nhầm sang chiếc áo bên cạnh.
"""
    none = """# Bản chấm

VERDICT: PASS

## NHÃN ĐỌC NHẦM
KHÔNG CÓ
"""
    missing = """# Bản chấm

VERDICT: PASS

## NHẬN XÉT
- mọi thứ ổn
"""
    empty = """# Bản chấm

VERDICT: PASS

## NHÃN ĐỌC NHẦM
"""
    ghost_label = """# Bản chấm

VERDICT: PASS

## NHÃN ĐỌC NHẦM
- c1 "NHIỆT ĐỘ 30 ĐỘ": nhãn này không có trong phim.
"""
    ghost_cue = """# Bản chấm

VERDICT: PASS

## NHÃN ĐỌC NHẦM
- c99 "CHỒNG LÊN NHAU": câu này không có trong phim.
"""
    # mẫu không dấu, và mục có phần đuôi — vẫn là một mục
    plain = """# Bản chấm

VERDICT: PASS

## NHAN DOC NHAM (MO HO)
- c1 "QUẦN ÁO ƯỚT": dễ đọc nhầm sang chiếc áo khô.
"""
    # tiêu đề nhắc "nhãn đọc nhầm" trong câu đề KHÔNG được nuốt mất mục thật
    titled = """# Bản chấm — soi nhãn đọc nhầm

VERDICT: PASS

## NHẬN XÉT
- không có gì

## NHÃN ĐỌC NHẦM
- c1 "QUẦN ÁO ƯỚT": dễ đọc nhầm sang chiếc áo khô.
"""
    # nhãn cũ (đã bị đổi tên) là bản chấm sai, KHÔNG phải nhãn đề xuất thêm
    stale = """# Bản chấm

VERDICT: PASS

## NHÃN ĐỌC NHẦM
- c1 "QUẦN ÁO KHÔ": nhãn này đã bị đổi tên trong phim rồi.
"""
    # chữ ĐỒNG CỨNG trên đạo cụ (không nằm trong CARDS) vẫn là chữ có thật
    drawn_ok = """# Bản chấm

VERDICT: PASS

## NHÃN ĐỌC NHẦM
- c1 "HUMIDITY": chữ trên đồng hồ đo độ ẩm, dễ nhầm với nhãn khác trên cùng mặt bàn.
"""
    with tempfile.TemporaryDirectory() as d:
        ep = os.path.join(d, 'ep')
        os.makedirs(os.path.join(ep, 'voice'))
        os.makedirs(os.path.join(ep, 'src'))
        open(os.path.join(ep, 'voice', 'lines.json'), 'w', encoding='utf8').write(lines)
        open(os.path.join(ep, 'src', 'film.js'), 'w', encoding='utf8').write(film)
        open(os.path.join(ep, 'src', 'props.js'), 'w', encoding='utf8').write(
            "const x = () => { c.font = 'bold 54px sans-serif'; c.fillText('HUMIDITY', 0, 0); };\n")

        def write(name, txt):
            p = os.path.join(d, name)
            open(p, 'w', encoding='utf8').write(txt)
            return p

        n, bad, _ = check(write('ok.md', ok), ep)
        assert n == 0, bad
        n, bad, _ = check(write('none.md', none), ep)
        assert n == 0, bad
        n, bad, _ = check(write('plain.md', plain), ep)
        assert n == 0, bad
        n, bad, _ = check(write('titled.md', titled), ep)
        assert n == 0, bad
        n, bad, _ = check(write('drawn.md', drawn_ok), ep)
        assert n == 0, bad
        n, bad, _ = check(write('missing.md', missing), ep)
        assert n == 1 and 'không liệt kê' in bad[0], bad
        n, bad, _ = check(write('empty.md', empty), ep)
        assert n == 1 and 'rỗng' in bad[0], bad
        n, bad, _ = check(write('ghost.md', ghost_label), ep)
        assert n == 1 and 'không có nhãn nào như vậy' in bad[0], bad
        n, bad, _ = check(write('cue.md', ghost_cue), ep)
        assert n == 1 and 'c99' in bad[0], bad
        n, bad, _ = check(write('stale.md', stale), ep)
        assert n == 1 and 'không có nhãn nào như vậy' in bad[0], bad
    print('check_label_section: selftest OK')
    return 0


def main():
    if len(sys.argv) > 1 and sys.argv[1] == '--selftest':
        return selftest()
    if len(sys.argv) < 3:
        print('usage: check_label_section.py <bản chấm> <tập>', file=sys.stderr)
        return 2
    return report(sys.argv[1], sys.argv[2])


if __name__ == '__main__':
    sys.exit(main())
