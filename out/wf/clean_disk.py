#!/usr/bin/env python3
"""Dọn ổ đĩa: xoá thư mục phiên chấm review ĐÃ XONG.

Chỉ xoá:
  - .claude/projects/-tmp-lemo-review-*   (phiên chấm chạy trong /tmp)
  - /tmp/lemo-review-*                    (thư mục làm việc của chúng)
và chỉ khi đã cũ hơn GIỜ giờ. Phiên của chính ta (thư mục theo đường dẫn dự án)
không bao giờ bị đụng tới.
"""
import glob, os, shutil, sys, time

HOURS = float(sys.argv[1]) if len(sys.argv) > 1 else 2.0
cut = time.time() - HOURS * 3600
freed = 0

def size(d):
    t = 0
    for root, _, fs in os.walk(d):
        for f in fs:
            try:
                t += os.path.getsize(os.path.join(root, f))
            except OSError:
                pass
    return t

for pat in ('/home/minhbien/.claude/projects/-tmp-lemo-review-*', '/tmp/lemo-review-*'):
    for d in sorted(glob.glob(pat)):
        if not os.path.isdir(d):
            continue
        try:
            newest = max(os.path.getmtime(os.path.join(r, f)) for r, _, fs in os.walk(d) for f in fs)
        except (ValueError, OSError):
            newest = os.path.getmtime(d)
        if newest > cut:
            print(f'GIỮ (còn mới): {d}')
            continue
        s = size(d)
        shutil.rmtree(d, ignore_errors=True)
        freed += s
        print(f'XOÁ {s/1e6:8.1f} MB  {d}')

print(f'--- giải phóng {freed/1e9:.2f} GB')
