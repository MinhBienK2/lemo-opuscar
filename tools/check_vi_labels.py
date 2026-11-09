#!/usr/bin/env python3
"""check_vi_labels.py — bắt lỗi chính tả tiếng Việt trong chữ sẽ hiện lên màn hình.

Vì sao có: ở tap-01, bản dựng lúc 15:38 có `CHÓNG ÁO` (chồng), `PHỎI MỘT MẶT` (phơi),
`NƯỚC PHẢI ƠI ĐƯỢC` (ôi), `CHỔ THOÁNG GIÓ` (chỗ), `CÀ HAI MẶT` (cả) — sáu lỗi trong
sáu mươi câu, và **không vòng chấm nào nhắc**. Người xem thấy lỗi đó ở khung hình
đầu tiên, nhưng vòng chấm hình không được hỏi câu đó.

Máy đo được chính tả thì không cần người. Bảng ở đây là **bảng nhầm lẫn**: những
dạng gần như luôn sai trong tiếng Việt (`phỏi` vs `phơi`, `chổ` vs `chỗ`,
`đươc` vs `được`…). Mỗi lần phim nào lộ thêm một lỗi, thêm dạng đó vào bảng.

Có hai loại:
- **chính tả** — một từ sai nằm trong bảng nhầm lẫn;
- **cụt** — một nhãn bị cắt cụt (`SỨC CHỪA CAO HƠN`, `HƠN 2 KJ / 19`): nhãn
  kết thúc bằng một từ bị bỏ lửng, hoặc bằng một con số trần.

Dùng:
  python3 tools/check_vi_labels.py <tập>            # src/*.js + voice/lines.json
  python3 tools/check_vi_labels.py --selftest

Thoát với 1 nếu có lỗi.
"""
import json
import os
import re
import sys

# --- bảng nhầm lẫn ------------------------------------------------------------
# (mẫu, cách đúng, vì sao sai). Mẫu viết bằng regex, không phân biệt hoa thường.
CONFUSABLE = [
    (r'\bphỏi\b', 'phơi', 'phỏi không phải từ tiếng Việt'),
    (r'\bchổ\b', 'chỗ', 'chổ không phải từ tiếng Việt'),
    (r'\bcà hai\b', 'cả hai', 'cà + số lượng phải là "cả"'),
    (r'(?<!nhanh )\bchóng\b(?!\s*(mặt|về|lắm|quá))', 'chồng', 'chỗ này là "chồng"'),
    (r'\bphải ơi\b', 'phải ôi', '"ôi" là "ui" có dấu huyền'),
    (r'\bnước ơi\b', 'nước ôi', '"ôi" là "ui" có dấu huyền'),
    (r'\bơi được\b', 'ôi được', '"ôi" là "ui" có dấu huyền'),
    (r'\bđươc\b', 'được', 'sai dấu huyền'),
    (r'\bngươi\b', 'người', 'sai dấu huyền'),
    (r'\bnhứng\b', 'những', 'sai dấu'),
    (r'\bkông\b', 'không', 'thiếu dấu huyền'),
    (r'\bthoai\b', 'thoại', 'thiếu dấu huyền'),
    (r'\bnhiêt\b', 'nhiệt', 'sai dấu'),
    (r'\bthoàng\b', 'thoáng', 'sai dấu'),
    (r'\btỷ lệ\b', 'tỉ lệ', '"tỉ lệ" viết bằng dấu huyền'),
    (r'\bhoạ\b(?!\s*\w)', 'hỏa', 'hoạ không phải từ đứng riêng'),
    (r'\bmới\w*\s+được\b(?<!chưa )', 'mới được', 'kiểm tra lại dấu câu'),
]

# --- nhãn bị cắt cụt -----------------------------------------------------------
# một nhãn kết thúc bằng một từ bị bỏ lửng là nhãn bị cắt, không phải nhãn.
DANGLING = {
    'và', 'của', 'là', 'không', 'có', 'được', 'phải', 'để', 'như', 'thì', 'mà',
    'hơn', 'nhỏ', 'lớn', 'nhiều', 'ít', 'mới', 'còn', 'vào', 'ra', 'trên', 'dưới',
    'cùng', 'với', 'theo', 'cho', 'từ', 'tới', 'bằng', 'bởi', 'do', 'ở', 'khô',
    'vẫn', 'chỉ', 'rất', 'quá', 'lại', 'nên', 'vì', 'hay', 'hoặc', 'mà',
}
# một nhãn kết thúc bằng số trần, sau dấu gạch chéo, là số bị mất đơn vị
BARE_AFTER_SLASH = re.compile(r'/\s*\d+\s*$')


def has_viet(s):
    return any('à' <= c <= 'ỹ' or c in 'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỂỄỆỈỊỌỎỐỒỔỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ' for c in s)


def check_text(text):
    """trả về danh sách lỗi của một đoạn chữ"""
    bad = []
    low = text.lower()
    for pat, right, why in CONFUSABLE:
        for m in re.finditer(pat, low, flags=re.IGNORECASE):
            bad.append(('chính tả', m.group(0), right, why))
    words = re.findall(r'[^\W\d_]+', low, flags=re.UNICODE)
    if words and words[-1] in DANGLING:
        bad.append(('cụt', words[-1], '(câu bị cắt)', 'nhãn kết thúc bằng từ bị bỏ lửng'))
    if BARE_AFTER_SLASH.search(text):
        bad.append(('cụt', text.strip()[-12:], '(thiếu đơn vị)', 'nhãn kết thúc bằng số trần'))
    return bad


def strings_from_js(path):
    """mọi chuỗi trong một tệp .js, kèm số dòng"""
    out = []
    try:
        with open(path, encoding='utf-8') as fh:
            lines = fh.read().split('\n')
    except OSError:
        return out
    for n, line in enumerate(lines, 1):
        # bỏ qua dòng chú thích thuần
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('*'):
            continue
        for m in re.finditer(r"'([^'\\\n]{2,})'|\"([^\"\\\n]{2,})\"|`([^`\\]{2,})`", line):
            s = m.group(1) or m.group(2) or m.group(3) or ''
            if has_viet(s):
                out.append((n, s))
    return out


def strings_from_lines(path):
    out = []
    try:
        with open(path, encoding='utf-8') as fh:
            data = json.load(fh)
    except (OSError, ValueError):
        return out
    items = data if isinstance(data, list) else data.get('lines', [])
    for i, item in enumerate(items):
        if isinstance(item, dict):
            t = item.get('text') or item.get('line') or ''
            if t:
                out.append((i + 1, t))
    return out


def scan(episode):
    findings = []
    src = os.path.join(episode, 'src')
    if os.path.isdir(src):
        for name in sorted(os.listdir(src)):
            if name.endswith('.js'):
                p = os.path.join(src, name)
                for n, s in strings_from_js(p):
                    for kind, got, right, why in check_text(s):
                        findings.append((os.path.relpath(p, episode), n, kind, got, right, why, s))
    voice = os.path.join(episode, 'voice', 'lines.json')
    for n, s in strings_from_lines(voice):
        for kind, got, right, why in check_text(s):
            findings.append((os.path.relpath(voice, episode), n, kind, got, right, why, s))
    return findings


def selftest():
    fails = []

    def check(name, cond, detail=''):
        print('%-4s %s' % ('ok' if cond else 'FAIL', name))
        if not cond:
            fails.append(name)
            print('       %s' % detail)

    cases = [
        ('CHÓNG ÁO', 'chính tả'),
        ('PHỎI MỘT MẶT', 'chính tả'),
        ('NƯỚC PHẢI ƠI ĐƯỢC', 'chính tả'),
        ('CHỔ THOÁNG GIÓ', 'chính tả'),
        ('CÀ HAI MẶT', 'chính tả'),
        ('ĐƯƠC', 'chính tả'),
        ('SỨC CHỪA CAO HƠN', 'cụt'),
        ('HƠN 2 KJ / 19', 'cụt'),
    ]
    for text, want in cases:
        got = check_text(text)
        check('bắt: %s' % text, bool(got) and got[0][0] == want, 'got=%r' % (got,))

    ok_cases = [
        'CHỒNG ÁO', 'PHƠI MỘT MẶT', 'NƯỚC PHẢI ÔI ĐƯỢC', 'CHỖ THOÁNG GIÓ', 'CẢ HAI MẶT',
        'ĐƯỢC', 'NHIỆT KẾ', 'CHÓNG MẶT', 'NHANH CHÓNG LẮM', 'ĐỒNG HỒ SẠC', 'CỔNG USB-C',
        '20 V', '4 V', '5 V', '60 W', 'CUỘN CẢM', 'ĐIỆN TRỞ', 'MẠCH SẠC', 'TỤI PIN',
        'LI-ION', 'KÍNH HIỆN', 'BỘ MÁCH', 'CẢM BIẾN NHIỆT', 'ỐP CASE', 'NHIỆT KẾ',
    ]
    for text in ok_cases:
        got = check_text(text)
        check('không báo nhầm: %s' % text, not got, 'got=%r' % (got,))

    if fails:
        print('\n%d ca sai' % len(fails))
        return 1
    print('\n%d ca đều đúng' % (len(cases) + len(ok_cases)))
    return 0


def main(argv):
    if '--selftest' in argv:
        return selftest()
    if len(argv) < 2:
        print(__doc__)
        return 2
    episode = argv[1]
    findings = scan(episode)
    if not findings:
        print('check_vi_labels: %s — sạch' % os.path.basename(episode))
        return 0
    for f, n, kind, got, right, why, text in findings:
        print('%s:%d  [%s] "%s" → "%s"  (%s)' % (f, n, kind, got, right, why))
    print('\n%d lỗi chữ trong %s' % (len(findings), os.path.basename(episode)))
    return 1


if __name__ == '__main__':
    sys.exit(main(sys.argv))
