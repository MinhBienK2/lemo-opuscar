#!/usr/bin/env python3
"""Đo sáng mỗi khung của tờ nhịp: bắt khung CHÁY TRẮNG hoặc CHÌM TỐI.

Không thay thế mắt người chấm, nhưng đưa ra con số để biết nhát nào cần soi:
  cháy  — % pixel > 250 lớn, hoặc trung bình sáng quá cao → mất chi tiết
  tối  — trung bình sáng quá thấp, hoặc % pixel < 20 lớn → chủ thể chìm

usage: python3 out/wf/measure_beats.py <tập> [--beats <thư mục>]
"""
import json, os, sys
from PIL import Image

ep = os.path.abspath(sys.argv[1])
LIB = '/home/minhbien/Documents/lemo-opuscar'
beats = sys.argv[sys.argv.index('--beats') + 1] if '--beats' in sys.argv else os.path.join(ep, 'review/beatsheet')
B = json.load(open(os.path.join(beats, 'beats.json'), encoding='utf-8'))
rows = []
for b in B:
    f = b.get('f')
    if not f:
        continue
    if not os.path.isabs(f):
        for cand in (os.path.join(ep, f), os.path.join(LIB, f)):
            if os.path.isfile(cand):
                f = cand
                break
    if not os.path.isfile(f):
        continue
    im = Image.open(f).convert('L').resize((192, 108))
    px = list(im.getdata())
    n = len(px)
    mean = sum(px) / n
    hi = sum(1 for v in px if v > 250) / n
    lo = sum(1 for v in px if v < 20) / n
    p95 = sorted(px)[int(n * .95)]
    rows.append((b.get('id'), mean, hi, lo, p95))

print(f'{"id":>5} {"TB":>6} {"cháy%":>7} {"tối%":>6} {"p95":>5}  cờ')
for cid, mean, hi, lo, p95 in rows:
    flags = []
    if hi > .02 or mean > 175:
        flags.append('CHÁY')
    if mean < 45 or lo > .25:
        flags.append('TỐI')
    print(f'{str(cid):>5} {mean:6.1f} {hi*100:6.1f}% {lo*100:5.1f}% {p95:5d}  {" ".join(flags)}')
