#!/usr/bin/env python3
"""Ghép lời của năm chương thành voice/lines.json của tập, rồi báo cáo những câu quá dài hoặc có chữ số.

Dùng: python3 tools/merge_lines.py <thư mục tập>
Các câu phải nối tiếp id (c1..c200), không mất câu, không trùng id.
"""
import json, os, re, sys

EP = sys.argv[1] if len(sys.argv) > 1 else '.'
V = os.path.join(EP, 'voice')
lines, seen = [], set()
for n in range(1, 6):
    p = os.path.join(V, f'lines-c{n}.json')
    if not os.path.isfile(p):
        print(f'missing {p}'); sys.exit(1)
    for L in json.load(open(p, encoding='utf-8')):
        if L['id'] in seen:
            print(f'duplicate id {L["id"]}'); sys.exit(1)
        seen.add(L['id'])
        lines.append({'id': L['id'], 'text': L['text'], 'gap': L.get('gap', 0.3)})
lines.sort(key=lambda L: int(L['id'][1:]))
ids = [L['id'] for L in lines]
expect = [f'c{i}' for i in range(1, len(lines) + 1)]
if ids != expect:
    print('ids are not continuous:', [a for a, b in zip(ids, expect) if a != b][:10]); sys.exit(1)

bad = []
for L in lines:
    w = len(L['text'].split())
    if w > 30: bad.append(f'{L["id"]}: {w} words')
    if re.search(r'\d', L['text']): bad.append(f'{L["id"]}: has a digit')
    if w < 8: bad.append(f'{L["id"]}: only {w} words')
json.dump(lines, open(os.path.join(V, 'lines.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
total = sum(len(L['text'].split()) for L in lines)
print(f'lines.json: {len(lines)} lines, {total} words, ~{total / 4.4 + sum(L["gap"] for L in lines):.0f} s of speech')
for b in bad: print('  check:', b)
