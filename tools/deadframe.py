#!/usr/bin/env python3
"""deadframe.py — đo xem khung hình nào của phim *trống*, và báo ra câu nào.

Vì sao có: một tấm phim có thể qua mọi vòng chấm mà vẫn có những câu mà
người xem không nhìn ra điều gì — một bức tường trơn, một vật thể nhỏ lơ lửng
trong nền rỗng, một tấm xám xịt. Rubric chấm hình không có câu hỏi về bố cục,
nên không vòng chấm nào nhắc ("khung hình rỗng đi qua nhiều vòng chấm" —
`improvements/retro/2026-10-30-tram-nghi-nhieu.md`). Đây là phép đo cho câu
hỏi đó: **mật độ chi tiết** của từng khung.

Phép đo: cắt đúng một khung giữa mỗi câu (đúng cách `tools/frames_at.py` cắt),
thu nhỏ về bề ngang 320 px, tính mật độ cạnh (Sobel) — tỉ lệ pixel có biên độ
vượt ngưỡng. Một khung trống có mật độ gần 0; một khung có vật thể nhỏ trong
nền rỗng cũng có mật độ thấp, vì nền không có gì. Ngưỡng mặc định là **35 % trung
vị của chính phim đó** — không phải con số tuyệt đối, vì phim nào cũng khác.

Dùng:
  python3 tools/deadframe.py <mp4> <beats.json> [--at 0.6] [--ratio 0.35]
                              [--min 0.004] [--lines c1,c13-c18] [--json]

Kết quả: một bảng câu → mật độ, đánh dấu câu nào dưới ngưỡng. `--json` thì in
mảng JSON để một công cụ khác đọc. Thoát với 1 nếu có câu dưới ngưỡng.
"""
import json
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image

WIDTH = 320          # bề ngang sau khi thu nhỏ — đủ để đo, rẻ để chạy
EDGE = 40            # ngưỡng biên độ Sobel (0..255 trên thang 0..255)


def cut_frame(mp4, t, path):
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '%.3f' % t, '-i', mp4,
                    '-frames:v', '1', '-q:v', '3', path], check=True)
    return path


def edge_density(path):
    """tỉ lệ pixel có biên — càng thấp càng 'trống'"""
    im = Image.open(path).convert('L')
    h = int(round(im.height * WIDTH / float(im.width)))
    im = im.resize((WIDTH, max(1, h)), Image.BILINEAR)
    a = np.asarray(im, dtype=np.float32)
    gx = np.zeros_like(a)
    gy = np.zeros_like(a)
    gx[:, 1:-1] = a[:, 2:] - a[:, :-2]
    gy[1:-1, :] = a[2:, :] - a[:-2, :]
    mag = np.abs(gx) + np.abs(gy)
    return float((mag > EDGE).mean())


def measure(mp4, beats, at=0.6, lines=''):
    """mỗi câu → mật độ chi tiết của khung giữa câu"""
    wanted = _pick(beats, lines)
    out = []
    tmpdir = tempfile.mkdtemp(prefix='deadframe-')
    try:
        for b in wanted:
            t0, t1 = b.get('t0'), b.get('t1')
            if t0 is None:
                continue
            t = t0 + at * ((t1 - t0) if t1 is not None else 1.0)
            name = '%s.jpg' % (b.get('id') or ('n%d' % b.get('n')))
            p = os.path.join(tmpdir, name)
            try:
                cut_frame(mp4, t, p)
                d = edge_density(p)
            except subprocess.CalledProcessError:
                continue
            out.append({'id': b.get('id') or ('n%d' % b.get('n')), 't': round(t, 2), 'density': d})
    finally:
        for f in os.listdir(tmpdir):
            try:
                os.remove(os.path.join(tmpdir, f))
            except OSError:
                pass
        try:
            os.rmdir(tmpdir)
        except OSError:
            pass
    return out


def _pick(beats, spec):
    if not spec:
        return [b for b in beats if b.get('t0') is not None]
    want = []
    for part in spec.split(','):
        part = part.strip()
        if not part:
            continue
        if '-' in part:
            a, b = part.split('-', 1)
            want += list(range(_num(a), _num(b) + 1))
        else:
            want.append(_num(part))
    by_id = {b.get('id'): b for b in beats if b.get('id')}
    out = []
    for n in want:
        b = by_id.get('c%d' % n) or next((x for x in beats if x.get('n') == n), None)
        if b is not None and b.get('t0') is not None:
            out.append(b)
    return out


def _num(s):
    s = s.strip()
    return int(s[1:]) if s.startswith('c') else int(s)


def flagged(rows, ratio=0.35, floor=0.004):
    """ngưỡng: dưới max(tỉ lệ × trung vị, sàn tuyệt đối)"""
    if not rows:
        return [], 0.0
    vals = sorted(r['density'] for r in rows)
    mid = len(vals) // 2
    median = vals[mid] if len(vals) % 2 else 0.5 * (vals[mid - 1] + vals[mid])
    limit = max(ratio * median, floor)
    return [r for r in rows if r['density'] < limit], median


def selftest():
    """phép đo phải phân biệt được 'trống' với 'có chi tiết'"""
    import struct
    fails = []

    def check(name, cond, detail=''):
        print('%-4s %s' % ('ok' if cond else 'FAIL', name))
        if not cond:
            fails.append(name)
            print('       %s' % detail)

    tmp = tempfile.mkdtemp(prefix='deadframe-test-')
    try:
        flat = os.path.join(tmp, 'flat.jpg')
        Image.new('L', (320, 180), 40).save(flat)
        d_flat = edge_density(flat)

        busy = os.path.join(tmp, 'busy.jpg')
        rng = np.random.default_rng(7)
        Image.fromarray(rng.integers(0, 255, (180, 320), dtype=np.uint8)).save(busy)
        d_busy = edge_density(busy)

        half = os.path.join(tmp, 'half.jpg')
        a = np.full((180, 320), 40, dtype=np.uint8)
        a[60:120, 40:120] = 220
        Image.fromarray(a).save(half)
        d_half = edge_density(half)

        check('khung trơn có mật độ 0', d_flat == 0.0, 'd=%r' % d_flat)
        check('khung nhiễu có mật độ lớn', d_busy > 0.2, 'd=%r' % d_busy)
        check('khung một vật nhỏ có mật độ thấp hơn khung nhiễu', d_half < d_busy / 4,
              'd=%r vs %r' % (d_half, d_busy))
        check('ngưỡng không bắt khung nhiễu', flagged([{'id': 'c1', 'density': d_busy}])[0] == [],
              'bị bắt')
        check('ngưỡng bắt khung trơn', len(flagged([{'id': 'c1', 'density': d_flat},
                                                   {'id': 'c2', 'density': d_busy}])[0]) == 1,
              'không bắt')
    finally:
        import shutil
        shutil.rmtree(tmp, ignore_errors=True)

    if fails:
        print('\n%d ca sai' % len(fails))
        return 1
    print('\n5 ca đều đúng')
    return 0


def main(argv):
    if '--selftest' in argv:
        return selftest()
    if len(argv) < 3:
        print(__doc__)
        return 2
    mp4, beats_path = argv[1], argv[2]
    at = float(argv[argv.index('--at') + 1]) if '--at' in argv else 0.6
    ratio = float(argv[argv.index('--ratio') + 1]) if '--ratio' in argv else 0.35
    floor = float(argv[argv.index('--min') + 1]) if '--min' in argv else 0.004
    lines = argv[argv.index('--lines') + 1] if '--lines' in argv else ''
    with open(beats_path, encoding='utf-8') as fh:
        beats = json.load(fh)
    rows = measure(mp4, beats, at, lines)
    if not rows:
        print('deadframe: không lấy được khung nào')
        return 1
    bad, median = flagged(rows, ratio, floor)
    if '--json' in argv:
        print(json.dumps({'median': median, 'rows': rows, 'flagged': [r['id'] for r in bad]},
                         ensure_ascii=False))
        return 1 if bad else 0
    print('mật độ chi tiết (trung vị %.4f, ngưỡng %.4f)' % (median, max(ratio * median, floor)))
    for r in sorted(rows, key=lambda x: x['density']):
        mark = '  <-- trống' if r in bad else ''
        print('  %-6s %.4f%s' % (r['id'], r['density'], mark))
    print('\n%d trên %d câu trống' % (len(bad), len(rows)))
    for r in bad:
        print('  %s' % r['id'])
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
