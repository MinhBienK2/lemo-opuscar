"""Sắp lại thứ tự câu của chương 3 và tính lại phần đẩy cảnh.

  python src/fix_order.py        # sửa voice/lines.json (thứ tự câu của chương 3)
  node   src/fix_order.mjs       # in ra các sửa đổi của bảng cảnh (JSON)

Vì sao: các câu viết thêm được chèn vào kịch bản, nên thứ tự đọc của một chương có vài câu
lệch với thứ tự đã định. Bảng cảnh neo vào câu, nên câu nào nói sau cảnh đó thì chữ trên
thẻ sẽ không kịp hiện lên. Script này đặt lại thứ tự và báo những chỗ cần sửa.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PATH = os.path.join(ROOT, 'voice/lines.json')

# thứ tự đọc của chương 3, theo logic của câu chuyện
CH3 = ['c3_1', 'c3_17', 'c3_18', 'c3_19', 'c3_20', 'c3_2', 'c3_3', 'c3_4', 'c3_5', 'c3_6', 'c3_7',
       'c3_8', 'c3_21', 'c3_22', 'c3_23', 'c3_24', 'c3_9', 'c3_10', 'c3_11', 'c3_12', 'c3_13',
       'c3_14', 'c3_15', 'c3_25', 'c3_26', 'c3_27', 'c3_28', 'c3_16']


def main():
    lines = json.load(open(PATH, encoding='utf-8'))
    ids = [L['id'] for L in lines]
    cur = [i for i in ids if i.startswith('c3_')]
    if cur == CH3:
        print('thứ tự chương 3 đã đúng')
        return
    missing = [i for i in CH3 if i not in cur]
    extra = [i for i in cur if i not in CH3]
    if missing or extra:
        raise SystemExit(f'không khớp: thiếu {missing}, thừa {extra}')
    # chỉ đổi chỗ các câu của chương 3, giữ nguyên vị trí của chúng trong danh sách
    slots = [k for k, i in enumerate(ids) if i.startswith('c3_')]
    by = {L['id']: L for L in lines}
    for k, lid in zip(slots, CH3):
        lines[k] = by[lid]
    json.dump(lines, open(PATH, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('đã sắp lại thứ tự chương 3')


if __name__ == '__main__':
    main()
