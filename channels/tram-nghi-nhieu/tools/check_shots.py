#!/usr/bin/env python3
"""check_shots.py — những lỗi mà máy thấy được, trước khi tốn một vòng chấm.

Bước 6 của quy trình đã bảo đạo diễn dựng tờ sheet nhịp điệu
(`beatsheet.mjs <tập> --out <scratch>`). Cái tờ sheet đó đã mang sẵn những cờ máy
(DARK, SAME, RUN, NUM) và tỉ lệ `fill` của vật chính trong khung — nhưng nó nằm trong
ảnh và trong `beats.json`, nên đạo diễn phải tự đi tìm. Công cụ này biến chúng thành
một danh sách đọc được, kèm đề xuất sửa, và trả về mã 1 nếu còn lỗi.

Vì sao phải có: một vòng chấm hình tốn khoảng 40 phút, và người chấm chỉ mở được
khoảng 25/60 khung. Những lỗi máy đã thấy sẵn thì không nên để người chấm là người
phát hiện ra — và càng không nên để tới sau khi đã trả tiền cho một vòng chấm.

Dùng:
  python3 channels/tram-nghi-nhieu/tools/check_shots.py <tập>            # đọc out/beats/beats.json
  python3 channels/tram-nghi-nhieu/tools/check_shots.py <beats.json>
  python3 channels/tram-nghi-nhieu/tools/check_shots.py --selftest
"""
import json
import os
import sys

# mỗi cờ máy, nói thẳng cần làm gì — cùng giọng với những gì người chấm nói
HINT = {
    'DARK': 'vùng chính chìm trong bóng — thêm đèn điểm hoặc một vệt sáng nhỏ.',
    'SAME': 'khung này gần như y hệt câu trước — cho vật một hành động thật (vải rung, giọt trượt, cánh quạt quay, kim dịch chuyển), hoặc đổi hẳn bố cục; chỉ lia máy thì vật vẫn đứng yên.',
    'RUN': 'nhiều câu liên tiếp trên cùng một bộ đạo cụ — cho câu này một hình riêng (góc khác, cắt vào trong vật, so sánh hai vật).',
    'NUM': 'lời kể có con số mà hình không có số đọc được — thêm đồng hồ / thước đo / bảng số, hoặc bỏ số khỏi lời.',
}
FILL_MIN = 0.15          # dưới ngưỡng này thì vật chính là một vệt nhỏ giữa khung trống


def find_beats(path):
    """beats.json: the given file, the one inside a folder, or the one inside an episode folder"""
    if os.path.isfile(path):
        return path
    for sub in ('', 'out/beats', 'review/beatsheet', 'review/beats'):
        p = os.path.join(path, sub, 'beats.json')
        if os.path.isfile(p):
            return p
    return None


def load(path):
    p = find_beats(path)
    if not p:
        return None, None
    try:
        with open(p, encoding='utf-8') as fh:
            return json.load(fh), p
    except (OSError, ValueError):
        return None, p


def problems(beat):
    """the machine problems of one line: [(kind, text)]"""
    out = []
    for f in (beat.get('flags') or []):
        if f in HINT:
            out.append((f, HINT[f]))
    try:
        fill = float(beat.get('fill') or 0)
    except (TypeError, ValueError):
        fill = 0.0
    if fill < FILL_MIN:
        out.append(('FILL', 'vật chính chỉ chiếm %d %% khung — đưa máy gần hơn, hoặc đổi bố cục để vật chiếm chỗ. '
                           '(Một cảnh bên trong vật — ruột sợi, mặt nước, giữa vải — được phép trống: bỏ qua câu này nếu đó là cảnh cận trong vật.)'
                    % round(fill * 100)))
    return out


def report(beats, out=sys.stdout):
    bad = [(b, problems(b)) for b in beats]
    bad = [(b, p) for b, p in bad if p]
    n = len(beats)
    print('check_shots: %d câu, %d câu có vấn đề máy thấy được' % (n, len(bad)), file=out)
    for b, ps in bad:
        flags = ' '.join(b.get('flags') or []) or '—'
        try:
            fill = '%d%%' % round(float(b.get('fill') or 0) * 100)
        except (TypeError, ValueError):
            fill = '—'
        text = (b.get('text') or '').strip()
        print('', file=out)
        print('  c%s  [%s]  fill %s  "%s"' % (b.get('n'), flags, fill, text), file=out)
        for kind, hint in ps:
            print('        → %s: %s' % (kind, hint), file=out)
    return len(bad)


def selftest():
    import contextlib
    import io
    import tempfile

    fails = []

    def check(name, cond, detail=''):
        print('%-4s %s' % ('ok' if cond else 'FAIL', name))
        if not cond:
            fails.append(name + (' — ' + detail if detail else ''))

    beats = [
        {'n': 1, 'text': 'Một câu sạch', 'flags': [], 'fill': 0.5},
        {'n': 2, 'text': 'Câu lặp khung', 'flags': ['SAME'], 'fill': 0.4},
        {'n': 3, 'text': 'Câu có số', 'flags': ['NUM'], 'fill': 0.3},
        {'n': 4, 'text': 'Câu tối', 'flags': ['DARK'], 'fill': 0.3},
        {'n': 5, 'text': 'Câu vật quá nhỏ', 'flags': [], 'fill': 0.05},
        {'n': 6, 'text': 'Câu có cả hai', 'flags': ['SAME', 'NUM'], 'fill': 0.2},
    ]
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'beats.json')
        with open(p, 'w', encoding='utf-8') as fh:
            json.dump(beats, fh)
        got, path = load(p)
        check('đọc được beats.json', got is not None and len(got) == 6)
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            bad = report(got, out=buf)
        text = buf.getvalue()
        check('đếm đúng 5 câu có vấn đề', bad == 5, 'got %s' % bad)
        check('câu sạch không bị nêu', 'Một câu sạch' not in text)
        check('nêu cờ SAME', 'SAME' in text and 'hành động thật' in text)
        check('nêu cờ NUM', 'NUM' in text)
        check('nêu cờ DARK', 'DARK' in text)
        check('nêu vật quá nhỏ', 'FILL' in text and '5 %' in text)
        check('in câu lời để còn biết là câu nào', 'Câu có cả hai' in text)
        # a folder that holds beats.json is found too
        got2, path2 = load(d)
        check('tìm thấy beats.json trong thư mục', got2 is not None and path2 == p)
        # nothing to read is not a failure of the film, but the tool must say so
        got3, path3 = load(os.path.join(d, 'khong-co'))
        check('thiếu thì báo rõ, không nói sai', got3 is None)

    if fails:
        print('\n%d ca hỏng' % len(fails))
        return 1
    print('\n8 ca đều đúng')
    return 0


def main(argv):
    if '--selftest' in argv:
        return selftest()
    if len(argv) < 2:
        print(__doc__)
        return 0
    beats, path = load(argv[1])
    if not beats:
        print('check_shots: không đọc được beats.json ở %s — hãy dựng tờ sheet trước: '
              'node channels/tram-nghi-nhieu/tools/beatsheet.mjs <tập> --out <scratch>' % argv[1],
              file=sys.stderr)
        return 2
    n = report(beats)
    if n:
        print('\ncheck_shots: %d câu còn vấn đề — sửa trước khi mở một vòng chấm.' % n)
        return 1
    print('\ncheck_shots: không có vấn đề máy thấy được.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
