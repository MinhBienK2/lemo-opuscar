"""Kiểm tra bảng cảnh: python src/check_shots.py

Ba lỗi hay gặp khi viết bảng cảnh:
  1. số thứ tự từ (k) trỏ ra ngoài câu — highlight sẽ không bao giờ hiện;
  2. chữ trên thẻ không có trong câu — hình nói một đằng, lời nói một nẻo;
  3. câu neo (at) không có trong kịch bản — cảnh sẽ không có thời điểm.
Cũng kiểm tra: mọi câu trong kịch bản đều có ít nhất một cảnh.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LINES = {L['id']: L['text'] for L in json.load(open(os.path.join(ROOT, 'voice/lines.json'), encoding='utf-8'))}
FILES = sys.argv[1:] or ['shots.js', 'shots_a.js', 'shots_b.js']

norm = lambda s: re.sub(r'[^\w]', '', s.lower().replace('đ', 'd'))
words = {i: [norm(w) for w in t.split()] for i, t in LINES.items()}
covered, problems = set(), []

for f in FILES:
    path = os.path.join(HERE, f)
    if not os.path.exists(path):
        continue
    src = open(path, encoding='utf-8').read()
    for m in re.finditer(r"\bat:\s*'([^']+)'", src):
        covered.add(m.group(1))
        if m.group(1) not in LINES:
            problems.append(f'{f}: câu neo không có trong kịch bản: {m.group(1)}')
    for m in re.finditer(r"\{\s*t:\s*'([^']*)',\s*at:\s*'([^']+)',\s*k:\s*(\d+)", src):
        text, lid, k = m.group(1), m.group(2), int(m.group(3))
        if lid not in LINES:
            problems.append(f'{f}: thẻ trỏ tới câu không có: {lid}')
            continue
        covered.add(lid)
        ws = words[lid]
        if k >= len(ws):
            problems.append(f'{f}: {lid} k={k} vượt quá {len(ws)} từ — "{text}"')
            continue
        # the words of the card must come from that line (allowing for a shortened form)
        card = [norm(w) for w in text.split()]
        if card and any(w not in ws for w in card):
            missing_w = [w for w in card if w not in ws]
            problems.append(f'{f}: "{text}" — từ không có trong câu {lid}: {", ".join(missing_w)}')

missing = [i for i in LINES if i not in covered]
print(f'câu trong kịch bản: {len(LINES)} | câu có cảnh: {len(covered)} | chưa có cảnh: {len(missing)}')
if missing:
    print('  chưa có cảnh:', ', '.join(missing))
for p in problems:
    print('  VẤN ĐỀ:', p)
print('OK' if not problems else f'{len(problems)} vấn đề')
