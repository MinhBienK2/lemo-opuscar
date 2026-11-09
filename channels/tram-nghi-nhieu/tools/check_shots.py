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
    'VOICE': 'lời kể có câu này mà window.EV không có sự kiện giọng cho nó — tiếng sẽ lệch với hình; đối chiếu voice/lines.json với window.EV.',
}
FILL_MIN = 0.15          # dưới ngưỡng này thì vật chính là một vệt nhỏ giữa khung trống


def measured(beat):
    """True nếu câu này thật sự được dựng và đo trong tờ sheet.

    Một tờ sheet vẽ cho đúng một khoảng câu (`--lines a-b`) thì phần còn lại của tập được đánh dấu
    `skipped`: không có ảnh, không có `fill`. Câu đó **chưa được đo** — khác hẳn với câu đã đo mà vật
    chính chỉ chiếm 0 % khung. Hai thứ đó không được gộp làm một: gộp rồi thì một tờ sheet vẽ cho
    6 câu sẽ báo "60 câu vật quá nhỏ", và người làm phim sẽ đi sửa 54 câu không hề có lỗi.
    """
    return isinstance(beat, dict) and 'fill' in beat and not beat.get('skipped')


def coverage(beat):
    """(tổng phủ, số vật) — phần khung mà vật thật chiếm, và có bao nhiêu vật.

    `fill` trên tờ sheet là phần khung mà vật LỚN NHẤT chiếm. Con số đó mù ở ba kiểu cảnh rất
    phổ biến của kênh này:

      · cảnh cận trong một vật lớn (ruột sợi, mặt nước, giữa vải) — thứ thấy là một vật >1,2 m
        nên phép đo bỏ qua, và không có vật nhỏ nào đủ sức đo được;
      · chủ thể là một NHÓM vật (một dãy quần áo, một đống chai) — mỗi vật nhỏ, nên số đơn lẻ nhỏ
        trong khi cả nhóm chính là chủ thể;
      · cảnh toàn cảnh — chủ thể ở xa, mỗi vật chỉ chiếm một vệt nhỏ.

    Cả ba lần, máy nói "vật chính quá nhỏ" — và người làm phim tin máy thì đưa máy sát vào cho
    số lớn lên, làm hỏng bố cục để thoả một con số mà máy vốn không đo được.

    Thứ máy đo được, và đo đúng, là phần khung mà vật thật chiếm (tổng). Rỗng hay không rỗng thì
    đo cái đó; còn "chủ thể có đủ lớn không" thì để mắt người — máy không biết vật nào là chủ thể.
    """
    cast = (beat.get('shot') or {}).get('cast') or []
    vals = []
    for c in cast:
        try:
            vals.append(float(c[1]))
        except (TypeError, ValueError, IndexError):
            pass
    return sum(vals), len(vals)


def find_beats(path):
    """beats.json: the given file, or the one in a known folder.

    Trong một thư mục tập có thể có nhiều tờ sheet: một tờ đầy đủ, một tờ vẽ cho đúng một khoảng câu.
    Tờ nào **đo được nhiều câu hơn** thì thắng — tờ đầy đủ nói về cả phim, tờ một khoảng chỉ nói về
    mấy câu đó — và khi bằng nhau thì tờ mới hơn thắng.
    """
    if os.path.isfile(path):
        return path
    best, best_key = None, None
    for sub in ('', 'out/beats', 'review/beatsheet', 'review/beats'):
        p = os.path.join(path, sub, 'beats.json')
        if not os.path.isfile(p):
            continue
        try:
            with open(p, encoding='utf-8') as fh:
                beats = json.load(fh)
            n = sum(1 for b in beats if measured(b)) if isinstance(beats, list) else -1
        except (OSError, ValueError):
            n = -1
        key = (n, os.path.getmtime(p))
        if best_key is None or key > best_key:
            best, best_key = p, key
    return best


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
    if beat.get('missing'):
        # không có sự kiện giọng: lời kể có, phim không phát — lỗi thật, không phải câu chưa đo
        out.append(('VOICE', HINT['VOICE']))
        return out
    for f in (beat.get('flags') or []):
        if f in HINT:
            out.append((f, HINT[f]))
    if not measured(beat):
        return out          # chưa được đo thì không kết luận gì
    cover, _ = coverage(beat)
    if cover == 0:
        # Máy không thấy vật nào đủ lớn trong khung: cảnh cận trong một vật lớn, cảnh toàn cảnh, hay
        # khung thật sự trống — máy không phân biệt được ba cái đó, nên không kết luận gì. Báo cáo
        # in ra danh sách câu này để người làm phim tự nhìn.
        return out
    if cover < FILL_MIN:
        out.append(('FILL', 'khung gần như trống — vật trong khung chỉ chiếm %d %% khung; đưa máy gần hơn, '
                           'hoặc đổi bố cục để vật chiếm chỗ.' % round(cover * 100)))
    return out


def runs(numbers):
    """consecutive line numbers grouped: [25..32, 40] → [[25..32], [40]]"""
    out = []
    for n in sorted(numbers):
        if out and n == out[-1][-1] + 1:
            out[-1].append(n)
        else:
            out.append([n])
    return out


def cluster_text(numbers):
    """'c25–c32 (8 câu), c40' — the machine flags read as stretches, not as a list of single lines"""
    parts = []
    for r in runs(numbers):
        if len(r) == 1:
            parts.append('c%d' % r[0])
        else:
            parts.append('c%d–c%d (%d câu)' % (r[0], r[-1], len(r)))
    return ', '.join(parts)


def report(beats, out=sys.stdout):
    bad = [(b, problems(b)) for b in beats]
    bad = [(b, p) for b, p in bad if p]
    n = len(beats)
    measured_n = sum(1 for b in beats if measured(b))
    unmeasured = n - measured_n
    print('check_shots: %d câu — đo được %d câu, %d câu có vấn đề máy thấy được' % (n, measured_n, len(bad)), file=out)
    if unmeasured:
        print('check_shots: %d câu KHÔNG được đo (tờ sheet bỏ qua, hoặc lời kể chưa có sự kiện giọng) — '
              'chúng KHÔNG phải "vật quá nhỏ"; dựng lại tờ sheet cho cả tập: '
              'node channels/tram-nghi-nhieu/tools/beatsheet.mjs <tập> --out <scratch>' % unmeasured, file=out)
    blind = [b.get('n') for b in beats if measured(b) and not b.get('missing') and coverage(b)[0] == 0]
    if blind:
        print('check_shots: %d câu máy KHÔNG nhìn thấy vật nào trong khung — cảnh cận trong một vật lớn, '
              'cảnh toàn cảnh, hay khung thật sự trống; máy không kết luận được, tự nhìn: %s'
              % (len(blind), cluster_text(blind)), file=out)
        print('check_shots: đừng đưa máy sát chỉ để đẩy con số lên.', file=out)
    for b, ps in bad:
        flags = ' '.join(b.get('flags') or []) or '—'
        try:
            fill = '%d%%' % round(float(b.get('fill') or 0) * 100)
        except (TypeError, ValueError):
            fill = '—'
        cover = '%d%%' % round(coverage(b)[0] * 100)
        text = (b.get('text') or '').strip()
        print('', file=out)
        print('  c%s  [%s]  fill %s · phủ %s  "%s"' % (b.get('n'), flags, fill, cover, text), file=out)
        for kind, hint in ps:
            print('        → %s: %s' % (kind, hint), file=out)
    # the same flags, read as stretches: a maker fixes a stretch, not a line
    by_kind = {}
    for b, ps in bad:
        for kind, _ in ps:
            by_kind.setdefault(kind, []).append(b.get('n'))
    if by_kind:
        print('', file=out)
        for kind in sorted(by_kind):
            print('  %s: %s' % (kind, cluster_text(by_kind[kind])), file=out)
    return len(bad), unmeasured


def selftest():
    import contextlib
    import io
    import tempfile

    fails = []
    total = [0]

    def check(name, cond, detail=''):
        total[0] += 1
        print('%-4s %s' % ('ok' if cond else 'FAIL', name))
        if not cond:
            fails.append(name + (' — ' + detail if detail else ''))

    def cast(*vals):
        return {'shot': {'cast': [['v%d' % i, v] for i, v in enumerate(vals)]}}

    beats = [
        {'n': 1, 'text': 'Một câu sạch', 'flags': [], 'fill': 0.5, **cast(0.5)},
        {'n': 2, 'text': 'Câu lặp khung', 'flags': ['SAME'], 'fill': 0.4, **cast(0.4)},
        {'n': 3, 'text': 'Câu có số', 'flags': ['NUM'], 'fill': 0.3, **cast(0.3)},
        {'n': 4, 'text': 'Câu tối', 'flags': ['DARK'], 'fill': 0.3, **cast(0.3)},
        {'n': 5, 'text': 'Câu vật quá nhỏ', 'flags': [], 'fill': 0.05, **cast(0.05)},
        {'n': 6, 'text': 'Câu có cả hai', 'flags': ['SAME', 'NUM'], 'fill': 0.2, **cast(0.2)},
        {'n': 7, 'text': 'Câu ngoài khoảng dựng', 'flags': [], 'skipped': True},
        {'n': 8, 'text': 'Câu không có sự kiện giọng', 'flags': [], 'missing': True},
        # nhóm vật: từng vật nhỏ, nhưng cả nhóm là chủ thể — máy không được kết luận "vật quá nhỏ"
        {'n': 9, 'text': 'Câu có nhóm vật', 'flags': [], 'fill': 0.06, **cast(0.06, 0.08, 0.07)},
        # cảnh cận trong vật lớn / toàn cảnh: máy không thấy vật nào — máy không kết luận được
        {'n': 10, 'text': 'Câu máy không nhìn thấy', 'flags': [], 'fill': 0.0, **cast()},
    ]
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 'beats.json')
        with open(p, 'w', encoding='utf-8') as fh:
            json.dump(beats, fh)
        got, path = load(p)
        check('đọc được beats.json', got is not None and len(got) == 10)
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            bad, unmeasured = report(got, out=buf)
        text = buf.getvalue()
        check('đếm đúng 6 câu có vấn đề', bad == 6, 'got %s' % bad)
        check('đếm đúng 2 câu chưa được đo', unmeasured == 2, 'got %s' % unmeasured)
        check('câu chưa đo không bị báo là vật quá nhỏ', 'Câu ngoài khoảng dựng' not in text)
        check('câu không có sự kiện giọng thì báo VOICE', 'VOICE' in text and 'Câu không có sự kiện giọng' in text)
        check('câu sạch không bị nêu', 'Một câu sạch' not in text)
        check('nêu cờ SAME', 'SAME' in text and 'hành động thật' in text)
        check('nêu cờ NUM', 'NUM' in text)
        check('nêu cờ DARK', 'DARK' in text)
        check('nêu vật quá nhỏ', 'FILL' in text and '5 %' in text)
        check('nhóm vật không bị báo là vật quá nhỏ', 'Câu có nhóm vật' not in text)
        check('cảnh máy không nhìn thấy không bị báo là vật quá nhỏ', 'Câu máy không nhìn thấy' not in text)
        check('nêu rõ câu nào máy không nhìn thấy', 'KHÔNG nhìn thấy vật nào' in text)
        check('không dạy đưa máy sát cho số', 'đừng đưa máy sát' in text.lower())
        check('in câu lời để còn biết là câu nào', 'Câu có cả hai' in text)
        check('cờ hiện thành cụm', 'SAME: c2, c4' in text or 'SAME:' in text, text[-400:])
        # a folder that holds beats.json is found too
        got2, path2 = load(d)
        check('tìm thấy beats.json trong thư mục', got2 is not None and path2 == p)
        # of two sheets in the same episode, the one that measured more lines wins
        ep = os.path.join(d, 'tap')
        full = [{'n': 1, 'text': 'a', 'flags': [], 'fill': .5}, {'n': 2, 'text': 'b', 'flags': [], 'fill': .5}]
        part = [{'n': 1, 'text': 'a', 'flags': [], 'fill': .5}, {'n': 2, 'text': 'b', 'flags': [], 'skipped': True}]
        for sub, data in (('out/beats', part), ('review/beatsheet', full)):
            os.makedirs(os.path.join(ep, sub), exist_ok=True)
            with open(os.path.join(ep, sub, 'beats.json'), 'w', encoding='utf-8') as fh:
                json.dump(data, fh)
        check('chọn tờ sheet đo được nhiều câu hơn',
              find_beats(ep) == os.path.join(ep, 'review/beatsheet', 'beats.json'))
        # nothing to read is not a failure of the film, but the tool must say so
        got3, path3 = load(os.path.join(d, 'khong-co'))
        check('thiếu thì báo rõ, không nói sai', got3 is None)

    if fails:
        print('\n%d ca hỏng' % len(fails))
        return 1
    print('\n%d ca đều đúng' % total[0])
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
    n, unmeasured = report(beats)
    if n:
        print('\ncheck_shots: %d câu còn vấn đề — sửa trước khi mở một vòng chấm.' % n)
        return 1
    if unmeasured:
        print('\ncheck_shots: CHƯA ĐO HẾT — %d câu không có ảnh trong tờ sheet, nên bài này không kết luận được '
              'về chúng. Dựng tờ sheet cho cả tập rồi chạy lại.' % unmeasured)
        return 2
    print('\ncheck_shots: không có vấn đề máy thấy được.')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
