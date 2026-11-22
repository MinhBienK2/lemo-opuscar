#!/usr/bin/env python3
"""Chờ workflow kết thúc: đọc journal.jsonl của workflow, thoát khi mọi agent đã có kết quả."""
import json, os, sys, time

D = sys.argv[1]
N = int(sys.argv[2]) if len(sys.argv) > 2 else 5
J = os.path.join(D, 'journal.jsonl')
deadline = time.time() + 100 * 60
seen = {}
last = None
while time.time() < deadline:
    try:
        rows = [json.loads(l) for l in open(J, encoding='utf-8') if l.strip()]
    except Exception:
        rows = []
    done = 0
    for r in rows:
        t = r.get('type', '')
        if t in ('result', 'completed', 'done', 'finished', 'agent-result'):
            done += 1
    # ghi ra mỗi khi trạng thái đổi, để không phải hỏi lại
    sig = (len(rows), done)
    if sig != last:
        print(f'{time.strftime("%H:%M:%S")}: journal {len(rows)} dòng, {done} kết quả', flush=True)
        last = sig
    if done >= N:
        print('XONG: mọi agent đã có kết quả', flush=True)
        sys.exit(0)
    time.sleep(20)
print('HẾT GIỜ', flush=True)
sys.exit(1)
