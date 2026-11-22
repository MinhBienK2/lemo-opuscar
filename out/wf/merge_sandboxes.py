#!/usr/bin/env python3
"""Gộp mã từ các hộp cát (wk-*) vào tập thật bằng hợp nhất 3 chiều.

Mỗi hộp cát là một bản sao của src/ lúc bắt đầu. Người sửa đổi vài dòng trong
src/film.js, src/set.js, src/props/*.js. Vì các nhóm sửa nằm ở vùng khác nhau
của cùng một tệp, hợp nhất 3 chiều (base = bản gốc, ours = tập thật hiện tại,
theirs = hộp cát) ghép được mà không cần chọn bên.

usage: python3 merge_sandboxes.py <tập> wk-a wk-b ...
"""
import os, subprocess, sys, filecmp, shutil, glob

ep = os.path.abspath(sys.argv[1])
sboxes = sys.argv[2:]
LIB = '/home/minhbien/Documents/lemo-opuscar'
CO = os.path.join(LIB, 'channels/tram-nghi-nhieu/series/co-the')

base = os.path.join(LIB, 'out/wf/base')
shutil.rmtree(base, ignore_errors=True)
shutil.copytree(os.path.join(ep, 'src'), base)

changed_any = False
for sb in sboxes:
    sbdir = os.path.join(CO, sb)
    for rel in sorted(glob.glob(os.path.join(sbdir, 'src', '**', '*'), recursive=True)):
        if not os.path.isfile(rel):
            continue
        r = os.path.relpath(rel, sbdir)
        cur = os.path.join(ep, r)
        if not os.path.isfile(cur):
            print(f'!! {sb}: {r} không có trong tập thật — bỏ qua')
            continue
        if filecmp.cmp(rel, cur, shallow=False):
            continue
        b = os.path.join(base, r)
        if not os.path.isfile(b):
            print(f'!! {sb}: {r} không có trong bản gốc — bỏ qua')
            continue
        p = subprocess.run(['git', 'merge-file', '-p', '-L', 'ours', '-L', 'base', '-L', 'theirs',
                            cur, b, rel], capture_output=True, text=True)
        if p.returncode == 0:
            open(cur, 'w').write(p.stdout)
            print(f'OK  {sb}: {r} — hợp nhất sạch')
            changed_any = True
        else:
            print(f'XUNG DOT {sb}: {r} ({p.returncode} vùng) — giữ bản tập thật, xem file thủ công')
            open(cur + '.theirs', 'w').write(p.stdout)

print('---')
print('đã gộp' if changed_any else 'không có gì để gộp')
