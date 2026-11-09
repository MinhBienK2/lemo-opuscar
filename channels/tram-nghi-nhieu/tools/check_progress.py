#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""So hai vòng chấm hình liên tiếp của một tập: cái gì đã sửa, cái gì còn mở, điểm đi đâu.

Vòng chấm cả phim trả về một bản báo dài (vài chục nghìn chữ) với hàng chục lỗi. Người đọc muốn biết
đúng một điều: **vòng này có gần lên không, và lỗi nào của vòng trước vẫn còn nguyên**. Không có máy đọc
điều đó, người đọc phải mở hai bản báo, tự đối chiếu, và rất dễ kết luận nhầm ("còn nhiều lỗi" trong khi
lỗi đã giảm từ 27 xuống 9).

Cách dùng:
    python3 tools/check_progress.py <tập>            # so vòng gần nhất với vòng trước
    python3 tools/check_progress.py <tập> --all      # in mọi vòng

Đọc trong `review/REVIEW*.md`:
  - `VERDICT: PASS|REJECT`, `SCORES: NHỊP_ĐIỆU=n CHUYỂN_ĐỘNG=n ÁNH_SÁNG=n`, `OVERALL: x/5`
  - câu FAIL chặn:  `- [c41]: **FAIL ...`
  - cờ máy còn mở:   mục "Cờ máy chưa sửa (tự động FAIL)" với các dòng `#41:SAME`
  - cờ máy đã bác:   `CỜ SAI <FLAG>` trong mục FLAGS_STATUS
"""
import os
import re
import sys

SCORE_KEYS = ('NHỊP_ĐIỆU', 'CHUYỂN_ĐỘNG', 'ÁNH_SÁNG')
FLAG_NAMES = ('DARK', 'SAME', 'RUN', 'NUM')


def review_files(ep):
    d = os.path.join(ep, 'review')
    if not os.path.isdir(d):
        return []
    out = []
    seen = set()
    for f in sorted(os.listdir(d)):
        if not f.startswith('REVIEW') or not f.endswith('.md'):
            continue
        if 'DIRECTORS-CUT' in f:
            continue
        p = os.path.join(d, f)
        # REVIEW.md is a copy of the latest numbered review: the same text twice is one round
        h = hash(open(p, 'rb').read())
        if h in seen:
            continue
        seen.add(h)
        out.append(p)
    out.sort(key=lambda p: os.path.getmtime(p))
    return out


def scope_of(path):
    """the name without the round number: REVIEW-3-1.md and REVIEW-3.md are one scope"""
    return re.sub(r'\d+(?=\.md$)', '', os.path.basename(path))


def parse(path):
    """the verdict, the scores and the open failures of one review file"""
    text = open(path, encoding='utf-8', errors='replace').read()
    v = re.search(r'^VERDICT:\s*(\w+)', text, re.M)
    verdict = v.group(1) if v else '?'

    scores = {}
    s = re.search(r'^SCORES:\s*(.+)$', text, re.M)
    if s:
        # \w, not [A-Z]: the keys are Vietnamese ("NHỊP_ĐIỆU"), and a class of ASCII capitals splits
        # them into fragments ("U", "N_ĐỘNG", "NG") — so no score ever matched, and the comparison
        # between two rounds silently said nothing about the scores.
        for k, n in re.findall(r'([\w]+)=(\d+)', s.group(1)):
            scores[k] = int(n)

    overall = None
    o = re.search(r'OVERALL:\s*([\d.,]+)\s*/\s*(\d+)', text)
    if o:
        overall = float(o.group(1).replace(',', '.'))

    # the machine flags: their own section, cut out before the failures are read
    flags = {}
    for m in re.finditer(r'#(\d+):([A-Z]+(?:\+[A-Z]+)*)', text):
        flags.setdefault('c' + m.group(1), set()).update(m.group(2).split('+'))
    # a flag the reviewer called wrong is not open: "CỜ SAI SAME: …" or "24 cờ là CỜ SAI (c5, c15, …)".
    # Only the type the bullet is about is dropped: a beat whose SAME flag is wrong may still owe a RUN.
    for m in re.finditer(r'(?m)^- ([A-Z]+):(.*(?:\n(?!- )[^\n]*)*)', text):
        kind, body = m.group(1), m.group(2)
        if 'CỜ SAI' not in body:
            continue
        tail = body.split('CỜ SAI', 1)[1]
        for b in re.findall(r'\b[c#](\d+)\b', tail):
            flags.get('c' + b, set()).discard(kind)

    # the failures: the reviewers write them in several shapes, so every shape is read
    body = re.split(r'^#+.*Cờ máy chưa sửa.*$', text, flags=re.M)[0]
    fails = set()
    anchors = list(re.finditer(r'(?m)^[ \t]*(?:[-*][ \t]*)?(?:\[c(\d+)\]|#(\d+))[:\s—\-]', body))
    for i, a in enumerate(anchors):
        end = anchors[i + 1].start() if i + 1 < len(anchors) else len(body)
        chunk = body[a.start():end]
        if re.search(r'\bFAIL\b', chunk):
            fails.add('c' + (a.group(1) or a.group(2)))
    # a failure named in the running text ("#37 là câu FAIL rõ ràng nhất")
    for m in re.finditer(r'#(\d+)[^\n]{0,120}?\bFAIL\b', body):
        fails.add('c' + m.group(1))

    return {'file': path, 'verdict': verdict, 'scores': scores, 'overall': overall,
            'fails': fails, 'flags': flags}


def beat_no(beat):
    m = re.match(r'c(\d+)$', beat)
    return int(m.group(1)) if m else 0


def show(a, b):
    """a = older, b = newer"""
    print('so sánh: %s  →  %s' % (os.path.basename(a['file']), os.path.basename(b['file'])))
    print('phán quyết: %s → %s' % (a['verdict'], b['verdict']))
    if a['overall'] is not None and b['overall'] is not None:
        d = b['overall'] - a['overall']
        print('điểm tổng: %.1f/5 → %.1f/5 (%s%.1f)' % (
            a['overall'], b['overall'], '+' if d >= 0 else '', d))
    for k in SCORE_KEYS:
        if k in a['scores'] and k in b['scores']:
            d = b['scores'][k] - a['scores'][k]
            if d:
                print('  %-12s %d → %d (%s%d)' % (k, a['scores'][k], b['scores'][k],
                                                 '+' if d > 0 else '', d))
            else:
                print('  %-12s %d → %d' % (k, a['scores'][k], b['scores'][k]))

    fixed = sorted(a['fails'] - b['fails'], key=beat_no)
    still = sorted(a['fails'] & b['fails'], key=beat_no)
    fresh = sorted(b['fails'] - a['fails'], key=beat_no)
    print('câu FAIL chặn: %d → %d' % (len(a['fails']), len(b['fails'])))
    if fixed:
        print('  đã sửa:      %s' % ', '.join(fixed))
    if still:
        print('  CÒN MỞ:      %s' % ', '.join(still))
    if fresh:
        print('  mới phát hiện: %s' % ', '.join(fresh))

    def open_flags(r):
        s = set()
        for beat, fs in r['flags'].items():
            for f in fs:
                s.add((beat, f))
        return s
    fa, fb = open_flags(a), open_flags(b)
    print('cờ máy còn mở: %d → %d' % (len(fa), len(fb)))
    stillf = sorted(fa & fb, key=lambda x: (beat_no(x[0]), x[1]))
    gonef = sorted(fa - fb, key=lambda x: (beat_no(x[0]), x[1]))
    newf = sorted(fb - fa, key=lambda x: (beat_no(x[0]), x[1]))
    if gonef:
        print('  đã xử lý:    %s' % ', '.join('%s:%s' % x for x in gonef))
    if stillf:
        print('  CÒN MỞ:      %s' % ', '.join('%s:%s' % x for x in stillf))
    if newf:
        print('  mới:         %s' % ', '.join('%s:%s' % x for x in newf))

    if not still and not stillf and a['verdict'] != 'PASS' and b['verdict'] != 'PASS':
        print('không còn lỗi nào của vòng trước — nếu vòng này vẫn REJECT, chặn là chỗ khác: đọc kỹ phần')
        print('"KHUYẾN NGHỊ ĐẠO DIỄN" của vòng mới nhé.')
    if still or stillf:
        print('lỗi còn mở nằm ở trên: sửa đúng những câu đó, đừng làm lại những câu đã qua.')


def selftest():
    """The shapes a reviewer really writes must all be read — each one a line from a real report.

    The parsers here are the ones that say "what did the last round fix", so a parser that stops
    reading a shape the reviewers use makes the next round start from zero again.
    """
    import tempfile
    cases = [
        ('a failure written as a beat bullet is a failure',
         'VERDICT: REJECT\n\n- [c41]: **FAIL** vật chính chìm trong một mảng trống.\n',
         lambda r: r['fails'] == {'c41'} and r['verdict'] == 'REJECT'),
        ('a failure named in the running text is a failure',
         'VERDICT: REJECT\n\n#37 là câu FAIL rõ ràng nhất của vòng này.\n',
         lambda r: 'c37' in r['fails']),
        ('a machine flag is read',
         'VERDICT: REJECT\n\n## Cờ máy chưa sửa (tự động FAIL)\n#41:SAME\n',
         lambda r: r['flags'].get('c41') == {'SAME'}),
        ('a flag the reviewer called wrong is not open',
         'VERDICT: REJECT\n\n- SAME: c5 không giống c6\n  CỜ SAI SAME: hai nhát khác góc máy\n',
         lambda r: 'c5' not in r.get('flags', {})),
        ('the scores and the overall are read',
         'VERDICT: REJECT\nSCORES: NHỊP_ĐIỆU=4 CHUYỂN_ĐỘNG=3 ÁNH_SÁNG=4\nOVERALL: 5.9/5\n',
         lambda r: r['scores'].get('CHUYỂN_ĐỘNG') == 3 and r['overall'] == 5.9),
        ('a report with no failures has none',
         'VERDICT: PASS\n\n## Nhận xét\n- Mọi thứ ổn.\n',
         lambda r: not r['fails'] and not r['flags']),
    ]
    bad = 0
    with tempfile.TemporaryDirectory() as d:
        for i, (name, text, ok) in enumerate(cases):
            p = os.path.join(d, 'r%d.md' % i)
            open(p, 'w', encoding='utf-8').write(text)
            try:
                r = parse(p)
                good = bool(ok(r))
            except Exception as e:                       # a parser that raises must not pass
                good = False
                r = {'error': str(e)}
            if not good:
                bad += 1
            print(('ok   ' if good else 'FAIL ') + name)
            if not good:
                print('      got: %r' % (r,))
    print('ok' if not bad else 'FAIL: %d case(s)' % bad)
    return 0 if not bad else 1


def main():
    if '--selftest' in sys.argv:
        return selftest()
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        print(__doc__)
        return 2
    ep = args[0]
    files = review_files(ep)
    if not files:
        print('không có bản chấm nào trong %s/review' % ep)
        return 2
    rounds = [parse(f) for f in files]
    if '--all' in sys.argv:
        for r in rounds:
            print('%-28s %-6s điểm %s  FAIL %d  cờ %d' % (
                os.path.basename(r['file']), r['verdict'],
                r['overall'] if r['overall'] is not None else '?',
                len(r['fails']), sum(len(v) for v in r['flags'].values())))
        return 0
    if len(rounds) < 2:
        print('chỉ có %d bản chấm — chưa có gì để so. Bản chấm: %s' % (
            len(rounds), ', '.join(os.path.basename(r['file']) for r in rounds)))
        return 0
    # the two last rounds of the same scope (a chapter and the whole film are not comparable)
    scope = scope_of(rounds[-1]['file'])
    same = [r for r in rounds if scope_of(r['file']) == scope]
    if len(same) < 2:
        print('chỉ có %d bản chấm trong phạm vi "%s" — chưa có gì để so.' % (len(same), scope))
        return 0
    show(same[-2], same[-1])
    return 0


if __name__ == '__main__':
    sys.exit(main())
