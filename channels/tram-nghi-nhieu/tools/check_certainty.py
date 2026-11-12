#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Một claim mà phim đã nói là chưa chắc thì không được nói lại như chân lý.

Đây là lỗi xảy ra trong tập `co-the/tap-01` (ngủ trưa): câu c10 nói *"Cách kể
quen thuộc là: dậy giữa ngủ sâu, não chưa kịp chạy lại"*, ba câu sau (c12–c14)
nói thẳng các nghiên cứu *"chia làm đôi"* và *"đừng vội tin chỗ đó"* — rồi đến
c51 phim khẳng định lại, không chút dè dặt: *"Bạn chỉ dậy đúng lúc não còn chưa
chạy được"*. Người xem đã được dặn *"đừng vội tin"* rồi lại được khẳng định.
File nghiên cứu của chính tập đó đã cấm đúng điều này: *"phim vì thế không được
nói 'ngủ sâu là nguyên nhân' như một sự thật đã chốt"* — và `check_claims.py`
không bắt được, vì nó canh **con số**, còn đây là **một câu không có số nào**.

Cách sửa không phải là canh từ vựng. Từ vựng thì không cứu được: "dậy giữa ngủ
sâu, não chưa kịp chạy lại" và "não còn chưa chạy được" không chung từ nào đủ
để ghép, và mọi ngưỡng ghép từ đều báo động giả (đo ở ngưỡng 4 từ chung: 5 báo
động trên 52 câu, chỉ 2 trong đó là lỗi thật).

Cách sửa là **hợp đồng**: `research/FACTS.md` khai báo **những câu lời kể nói về
claim nào**, và máy kiểm **chính câu đó có dấu hiệu chắc chắn hay không**. Người
viết kịch bản khai một lần; máy canh mãi.

Trong `research/FACTS.md`, mỗi claim thêm một dòng:

    - **Lời kể ở:** c10, c12, c13, c14, c35, c36, c51

Dòng đó liệt kê những câu lời kể **nói về claim đó**. Máy làm hai việc:

  1. **Claim có bị phim nói là chưa chắc không.** Dấu hiệu nằm ở tiêu đề claim
     ("… thì chưa chắc") hoặc ở đoạn *Phạm vi* ("chia làm đôi", "tranh cãi",
     "chưa có kết luận", "người ta vẫn chưa thống nhất", "không được nói").
  2. **Mỗi câu trong danh sách có dấu hiệu chắc chắn không.** Dấu hiệu của câu là
     lời nói không chắc chắn ("chia làm đôi", "có bên thấy…", "đừng vội tin",
     "có lý thuyết rằng", "lý thuyết thôi, chưa ai chắc", "có khi", "thường",
     "nghe hợp lý", "cách kể quen thuộc") — tức là câu đó **giữ được** cái dấu
     hiệu mà chính phim đã dán cho claim. Một câu trong danh sách mà không có
     dấu hiệu thì là lỗi: nó khẳng định claim mà phim vừa nói là chưa chắc.

Claim **không** khai báo dòng "Lời kể ở:" thì máy không đo được gì về nó, và
nói ra điều đó (thay vì im lặng). Cột "Lời kể ở:" chỉ làm việc khi claim **có**
bị phim nói là chưa chắc — một claim chắc thì các câu của nó không cần dấu hiệu.

Dùng:  python3 channels/tram-nghi-nhieu/tools/check_certainty.py <tập>
Thoát mã 0 = không câu nào khẳng định claim chưa chắc; 1 = có câu vượt; 2 = không
chạy được (thiếu file, sai cú pháp).
"""
import json
import os
import re
import sys

# ── dấu hiệu claim CHƯA CHẮC (nằm ở tiêu đề claim hoặc ở đoạn "Phạm vi") ──
UNCERTAIN = [
    'chưa chắc', 'chưa rõ', 'chưa có kết luận', 'chia làm đôi', 'tranh cãi',
    'đang tranh', 'không thống nhất', 'chưa thống nhất', 'không được nói',
    'vẫn còn tranh', 'mới là khoảng', 'là khoảng', 'không chắc',
]
# những cách nói "chưa ai chứng minh được" — dạng câu, không phải cụm cố định
UNCERTAIN_RE = [
    r'chưa\s+có[^.]{0,80}?chứng\s+minh',
    r'chưa\s+có[^.]{0,80}?chứng\s+nghiệm',
    # "phim nói 'có thể', không nói 'chắc chắn'" — cách file nghiên cứu nói rằng
    # claim này chỉ được nói với mức chắc chắn thấp
    r'không\s+nói\s+["“”]?chắc\s+chắn',
]
# ── lệnh CẤM: file nghiên cứu không cho phép khẳng định claim này ──
# Khác với "chưa chắc": ở đây file nghiên cứu nói thẳng là phim không được
# nói claim đó như sự thật. Nên mọi câu nói về nó đều phải giữ dấu hiệu — kể
# cả câu lặp lại sau. (Với claim chỉ "chưa chắc" thì một lần đã mang dấu hiệu
# là đủ: phim đã nói ra sự chắc chắn của mình, câu lặp lại sau đó là cách
# người kể nhắc lại, không phải một lần khẳng định mới.)
PROHIBITED = [
    'không được nói', 'không nói được', 'không nói', 'đừng nói', 'tránh nói',
    'không được khẳng định', 'không được tuyên bố',
]
# ── dấu hiệu lời kể KHÔNG CHẮC CHẮN (nằm trong chính câu) ──
HEDGE = [
    'cách kể quen thuộc', 'cách giải thích quen thuộc', 'lời kể quen thuộc',
    'chia làm đôi', 'có bên thấy', 'có bên không thấy', 'tranh cãi',
    'chưa chắc', 'chưa ai chắc', 'đừng vội tin', 'đừng tin', 'chưa có kết luận',
    'có lý thuyết', 'lý thuyết thôi', 'giả thuyết', 'được cho là', 'người ta nói',
    'quan niệm', 'nói phổ biến', 'có khi', 'thường', 'đa số', 'phần lớn',
    'có vẻ', 'dường như', 'hình như', 'có lẽ', 'nghe hợp lý', 'nghe nói',
    'tương truyền', 'có thể', 'đôi khi', 'thỉnh thoảng', 'khoảng',
    'một thí nghiệm', 'một số', 'phần nào',
]

# dòng khai báo trong FACTS.md: "- **Lời kể ở:** c10, c12, c13" — chỉ phần danh sách ở
# đầu dòng được đọc là danh sách câu; phần giải thích sau (nếu có) là lời người viết
# giải thích, và nó cứng có mã câu trong đó.
LISTED = re.compile(r'^\s*[-*]\s*\*\*Lời kể ở:?\*\*:?\s*((?:c\d+\s*(?:,\s*)?)+)', re.M)
# đoạn "Phạm vi" của một claim
SCOPE = re.compile(r'^\s*[-*]\s*\*\*Phạm vi:?\*\*:?\s*(.+?)\s*$', re.M)
# đầu đề claim: "## 2. …"
CLAIM = re.compile(r'^##\s+\d+\.\s*(.+?)\s*$', re.M)
# mã câu: c12
CID = re.compile(r'\bc\d+\b')


def strip_md(t):
    """bỏ dấu ** và * để so khớp không vướng ký hiệu markdown"""
    return t.replace('**', '').replace('*', '')


def claims(facts_text):
    """[(mã, tiêu đề, đoạn Phạm vi, danh sách câu)] cho mỗi claim"""
    heads = list(CLAIM.finditer(facts_text))
    out = []
    for i, h in enumerate(heads):
        end = heads[i + 1].start() if i + 1 < len(heads) else len(facts_text)
        body = facts_text[h.end():end]
        scope = SCOPE.search(body)
        listed = LISTED.search(body)
        ids = CID.findall(listed.group(1)) if listed else []
        out.append({
            'id': h.group(0).split('.')[0].replace('#', '').strip(),
            'title': strip_md(h.group(1)),
            'scope': strip_md(scope.group(1)) if scope else '',
            'lines': ids,
            'declared': bool(listed),
        })
    return out


def prohibited(claim):
    """file nghiên cứu có cấm khẳng định claim này không"""
    hay = (claim['title'] + ' ' + claim['scope']).lower()
    return any(m in hay for m in PROHIBITED)


def uncertain(claim):
    """claim này phim có nói là chưa chắc không"""
    hay = (claim['title'] + ' ' + claim['scope']).lower()
    if any(m in hay for m in UNCERTAIN):
        return True
    return any(re.search(p, hay) for p in UNCERTAIN_RE)


def hedged(text):
    t = text.lower()
    return any(h in t for h in HEDGE)


def narration(ep):
    """{mã câu: lời kể}"""
    for name in ('voice/lines.json', 'voice/script.json'):
        p = os.path.join(ep, name)
        if os.path.isfile(p):
            break
    else:
        return None
    try:
        d = json.load(open(p, encoding='utf-8'))
    except (OSError, ValueError):
        return None
    rows = d if isinstance(d, list) else d.get('lines', d)
    if isinstance(rows, dict):
        rows = list(rows.values())
    out = {}
    for r in rows:
        if not isinstance(r, dict):
            continue
        cid = r.get('id') or r.get('c')
        if cid:
            out[cid] = r.get('text', '')
    return out


def check(ep):
    facts = os.path.join(ep, 'research', 'FACTS.md')
    if not os.path.isfile(facts):
        return None
    lines = narration(ep)
    if lines is None:
        return None
    text = open(facts, encoding='utf-8').read()
    bad, notes = [], []
    for c in claims(text):
        if not uncertain(c):
            continue
        if not c['declared']:
            notes.append(f"claim {c['id']} phim nói là chưa chắc mà chưa khai 'Lời kể ở:' — "
                         f"máy chưa kiểm được câu nào của nó")
            continue
        strict = prohibited(c)
        unhedged = [(cid, lines.get(cid, '')) for cid in c['lines']
                    if cid in lines and not hedged(lines.get(cid, ''))]
        if strict:
            # bị cấm: KHÔNG câu nào được khẳng định nó
            for cid, t in unhedged:
                bad.append((c, cid, t))
        elif unhedged and len(unhedged) == len([x for x in c['lines'] if x in lines]):
            # chỉ chưa chắc: phim phải mang dấu hiệu ở đâu đó
            notes.append(f"claim {c['id']} (“{c['title'][:50]}”) phim nói là chưa chắc mà không câu nào "
                         f"mang dấu hiệu: {', '.join(cid for cid, _ in unhedged)}")
    return bad, notes


def main(argv):
    args = [a for a in argv[1:] if not a.startswith('-')]
    if not args:
        print(__doc__.strip())
        print('\nDùng: python3 check_certainty.py <tập>')
        return 2
    rc = 0
    for ep in args:
        r = check(ep)
        if r is None:
            print(f"check_certainty: {ep} — không chạy được (thiếu FACTS.md hoặc lời kể)")
            rc = 2
            continue
        bad, notes = r
        for n in notes:
            print(f"check_certainty: GHI CHÚ — {n}")
        if bad:
            rc = 1
            for c, cid, t in bad:
                print(f"check_certainty: LỖI — claim {c['id']} (“{c['title'][:60]}”) "
                      f"mà câu {cid} khẳng định nó không kèm dấu hiệu chắc chắn:")
                print(f"    {cid}: {t}")
                if c['scope']:
                    print(f"    file nghiên cứu đã dặn: {c['scope'][:200]}")
        else:
            print(f"check_certainty: {ep} — không câu nào khẳng định claim chưa chắc")
    return rc


if __name__ == '__main__':
    sys.exit(main(sys.argv))
