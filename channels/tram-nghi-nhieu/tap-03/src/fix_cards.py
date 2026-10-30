"""Sửa chữ trên thẻ cho khớp với câu đã đổi: python src/fix_cards.py

Mỗi dòng trong FIX là: (file, tên cảnh, số thứ tự dòng trên thẻ, câu neo, chữ mới).
Chữ mới phải là những từ có thật trong câu neo; script tự tìm chỉ số từ (k) của nó.

  python src/fix_cards.py
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LINES = {L['id']: L['text'] for L in json.load(open(os.path.join(ROOT, 'voice/lines.json'), encoding='utf-8'))}

norm = lambda s: re.sub(r'[^\w]', '', s.lower().replace('đ', 'd'))

# (file, shot, card index, anchor line, new text)
FIX = [
    ('shots.js', 'cold2', 2, 'hook2', 'một câu hỏi không liên quan'),
    ('shots.js', 'intro2', 0, 'intro2', 'một câu hỏi về sự tập trung'),
    ('shots.js', 'ch1a', 0, 'c1_1', 'trên điện thoại'),
    ('shots.js', 'ch1a', 1, 'c1_1', 'suốt mấy tuần liền'),
    ('shots.js', 'ch1e', 0, 'c1_5', 'những lần bị hỏi'),
    ('shots.js', 'ch1i', 0, 'c1_9', 'đúng lúc không nên đi'),
    ('shots.js', 'ch2a', 0, 'c2_2', 'bấm giây bên cạnh'),
    ('shots.js', 'ch2a', 1, 'c2_2', 'hơn bảy trăm giờ'),
    ('shots.js', 'ch2c', 0, 'c2_4', 'hơn một nửa số đoạn đó bị ngắt'),
    ('shots.js', 'ch2p', 0, 'c2_17', 'cơ thể ngồi yên'),
    ('shots.js', 'ch2p', 1, 'c2_17', 'não đang làm việc'),
    ('shots.js', 'ch3b', 0, 'c3_3', 'điện thoại của họ rung lên'),
    ('shots.js', 'ch3b', 1, 'c3_3', 'không hề chạm vào máy'),
    ('shots.js', 'ch3f', 0, 'c3_7', 'một nhiệm vụ ngắn trong phòng thí nghiệm'),
    ('shots.js', 'ch3f', 1, 'c3_7', 'số người tham gia không nhiều'),
    ('shots.js', 'ch3h', 0, 'c3_9', 'mang máy theo suốt hai tuần'),
    ('shots.js', 'ch3m', 0, 'c3_14', 'ta đánh dấu một cái mốc'),
    ('shots.js', 'ch4a', 0, 'c4_1', 'Ta lười, ta yếu'),
    ('shots.js', 'ch4b', 0, 'c4_2', 'bộ não như một máy tính có giới hạn'),
    ('shots.js', 'ch4i', 0, 'c4_9', 'khi chán, ta thường chọn việc khó hơn'),
    ('shots.js', 'ch5d', 0, 'c5_4', 'rút ngắn thành'),
    ('shots.js', 'ch5d', 1, 'c5_4', 'lặp lại khắp nơi như một sự thật'),
    ('shots.js', 'ch5h', 0, 'c5_8', 'dòng chảy'),
    ('shots.js', 'ch5m', 0, 'c5_13', 'bị phá trật tự bởi khoảng trống'),
]


def word_index(lid, text, after=0):
    ws = [norm(w) for w in LINES[lid].split()]
    for i, w in enumerate(ws):
        if i >= after and w == norm(text.split()[0]):
            return i
    raise SystemExit(f'không tìm thấy "{text}" trong câu {lid}')


def main():
    for f, shot, idx, lid, new in FIX:
        path = os.path.join(HERE, f)
        src = open(path, encoding='utf-8').read()
        # find the shot block: from "{ n: 'shot'" to the next shot
        m = re.search(r"\{ n: '" + re.escape(shot) + r"'", src)
        if not m:
            raise SystemExit('không thấy cảnh ' + shot)
        nxt = re.search(r"\n  \{ n: '", src[m.end():])
        block = src[m.start(): m.end() + nxt.start()] if nxt else src[m.start():]
        lines = re.findall(r"\{ t: '[^']*', at: '[^']+', k: \d+[^}]*\}", block)
        if idx >= len(lines):
            raise SystemExit(f'{shot}: không có dòng thẻ số {idx}')
        old = lines[idx]
        k = word_index(lid, new)
        cm = re.search(r"col: ([^,}]+)", old)
        col = cm.group(1) if cm else 'PAL.hoodie.f'
        newline = "{ t: '%s', at: '%s', k: %d, col: %s }" % (new, lid, k, col)
        block2 = block.replace(old, newline, 1)
        src = src.replace(block, block2, 1)
        open(path, 'w', encoding='utf-8').write(src)
        print(f'{shot} [{idx}] → "{new}" ({lid} k={k})')


if __name__ == '__main__':
    main()
