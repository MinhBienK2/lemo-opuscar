#!/usr/bin/env python3
"""Lấy một khung của mỗi câu được chỉ định, từ chính cái mp4 đã dựng, rồi dán lại thành một tờ.

Vì sao có: tờ sheet nhịp điệu (`beatsheet.mjs`) là ảnh **dựng riêng** — máy đo được, nhưng không
phải cái người xem sẽ xem. Khi đánh giá khách quan một phim đã xong, phải nhìn **trên chính file
mp4**: mỗi khung cắt đúng giữa câu lời kể, rồi dán lại thành một tờ để đọc cả phim trong một ảnh.

Dùng:
  python3 tools/frames_at.py <mp4> <beats.json> <out.jpg> [--lines c1,c13-c18] [--at .6]

`beats.json` là của `beatsheet.mjs` (nó có `t0`/`t1` của từng câu). Không có `--lines` thì lấy
tất cả. Ảnh được dán bằng công cụ của thư viện (`core/render/sheet.py`), không tự vẽ.
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.dirname(HERE)
SHEET = os.path.join(LIB, 'core', 'render', 'sheet.py')


def parse_lines(spec, beats):
    """'c1,c13-c18' → the beats those ids name (by `id`, else by number)"""
    wanted = []
    for part in (spec or '').split(','):
        part = part.strip()
        if not part:
            continue
        if '-' in part:
            a, b = part.split('-', 1)
            wanted += list(range(_num(a), _num(b) + 1))
        else:
            wanted.append(_num(part))
    by_id = {b.get('id'): b for b in beats if b.get('id')}
    out = []
    for n in wanted:
        b = by_id.get('c%d' % n) or next((x for x in beats if x.get('n') == n), None)
        if b is not None and b.get('t0') is not None:
            out.append(b)
    return out


def _num(s):
    s = s.strip()
    return int(s[1:]) if s.startswith('c') else int(s)


def take(mp4, beats, out, lines='', at=0.6):
    picks = parse_lines(lines, beats) if lines else [b for b in beats if b.get('t0') is not None]
    tmp = []
    try:
        for b in picks:
            t0, t1 = b.get('t0'), b.get('t1')
            t = t0 + at * ((t1 - t0) if t1 is not None else 1.0)
            f = '/tmp/_fa_%s.jpg' % (b.get('id') or ('n%d' % b.get('n')))
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '%.3f' % t, '-i', mp4,
                            '-frames:v', '1', '-q:v', '3', f], check=True)
            tmp.append(f)
        if not tmp:
            return None
        subprocess.run([sys.executable, SHEET, out] + tmp + ['--cols', '3'], check=True)
        return out
    finally:
        for f in tmp:
            try:
                os.remove(f)
            except OSError:
                pass


def selftest():
    """the line picking is the part that can be wrong silently"""
    beats = [{'n': 1, 'id': 'c1', 't0': 1.0, 't1': 3.0}, {'n': 2, 'id': 'c2', 't0': 3.0, 't1': 5.0},
             {'n': 13, 'id': 'c13', 't0': 20.0, 't1': 22.0}, {'n': 14, 'id': 'c14', 't0': 22.0, 't1': 24.0},
             {'n': 15, 'id': 'c15', 't0': 24.0, 't1': 26.0}, {'n': 20, 'id': 'c20', 't0': 30.0, 't1': 32.0}]
    cases = [
        ('một câu', [b['id'] for b in parse_lines('c13', beats)], ['c13']),
        ('một khoảng câu', [b['id'] for b in parse_lines('c13-c15', beats)], ['c13', 'c14', 'c15']),
        ('vài câu', [b['id'] for b in parse_lines('c1,c20', beats)], ['c1', 'c20']),
        ('số thay vì mã câu', [b['id'] for b in parse_lines('2', beats)], ['c2']),
        ('câu không có mốc thời gian thì không lấy', parse_lines('c99', beats), []),
    ]
    fails = 0
    for name, got, want in cases:
        ok = got == want
        print('%-4s %s' % ('ok' if ok else 'FAIL', name))
        if not ok:
            fails += 1
            print('       got %s, want %s' % (got, want))
    print('\n%d ca đều đúng' % len(cases) if not fails else '\n%d ca hỏng' % fails)
    return 1 if fails else 0


def main(argv):
    if '--selftest' in argv:
        return selftest()
    if len(argv) < 4:
        print(__doc__)
        return 2
    mp4, beats_path, out = argv[1], argv[2], argv[3]
    lines, at = '', 0.6
    if '--lines' in argv:
        lines = argv[argv.index('--lines') + 1]
    if '--at' in argv:
        at = float(argv[argv.index('--at') + 1])
    with open(beats_path, encoding='utf-8') as fh:
        beats = json.load(fh)
    if not take(mp4, beats, out, lines, at):
        print('frames_at: không lấy được khung nào')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
