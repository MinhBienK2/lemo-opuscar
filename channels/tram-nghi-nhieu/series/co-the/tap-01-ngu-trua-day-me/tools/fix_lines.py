#!/usr/bin/env python3
"""Đưa mã nguồn của tập về đúng số câu sau khi cắt bớt câu.

Sau khi người chấm bảo bỏ mười mấy câu lặp, danh sách câu đã đánh số lại (c1..c185) và mọi tham chiếu
tới số câu trong src/*.js phải đi theo. Script này:
  1. đổi mọi id cũ thành id mới (theo tools/line_remap.json) trong src/*.js;
  2. gỡ những dòng shot mà câu của nó đã bị bỏ;
  3. sửa lại ranh giới năm chương trong src/chapters.js.

Dùng: python3 tools/fix_lines.py
"""
import json, os, re, glob

HERE = os.path.dirname(os.path.abspath(__file__))
EP = os.path.dirname(HERE)
m = json.load(open(os.path.join(HERE, 'line_remap.json')))
lines = json.load(open(os.path.join(EP, 'voice', 'lines.json'), encoding='utf-8'))
ids = {x['id'] for x in lines}

# the shot rows whose line was cut: they have to go, or the camera would jump to a line that no longer exists
ORPHANS = {
    'ch1': ['desk_medium', 'glass_close'],
    'ch3': ['c_still_dark', 'a_clock_20', 'a_clock_20_light', 'b_the_cut', 'b_layers', 'b_white_matter',
            'b_gap_csf', 'b_vessel_layers', 'a_back_to_stream', 'n_top_down'],
    'ch5': ['desk_evening'],
}

for f in glob.glob(os.path.join(EP, 'src', '*.js')):
    if f.endswith('timeline.js'):
        continue
    s = open(f, encoding='utf-8').read()
    s2 = re.sub(r"'c(\d+)'", lambda mo: "'" + m.get('c' + mo.group(1), 'c' + mo.group(1)) + "'", s)
    if s2 != s:
        open(f, 'w', encoding='utf-8').write(s2)
        print('remapped', os.path.basename(f))

for ch, drop in ORPHANS.items():
    p = os.path.join(EP, 'src', f'{ch}.js')
    if not os.path.isfile(p):
        continue
    s = open(p, encoding='utf-8').read()
    n = 0
    for rid in drop:
        s2 = re.sub(r"\n[^\n]*id: '" + rid + r"'[^\n]*\n", "\n", s)
        if s2 != s:
            n += 1
        s = s2
    open(p, 'w', encoding='utf-8').write(s)
    if n:
        print(ch, 'removed', n, 'orphan shots')

print('done')
