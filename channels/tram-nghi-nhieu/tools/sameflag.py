#!/usr/bin/env python3
"""Cờ SAME: hai câu liên tiếp có cùng một bố cục thì câu sau không có hình riêng.

    from sameflag import camera_moved

Cờ này đo **bố cục**: một bản thu nhỏ 16×9 của khung hình (phần trên, bỏ dải phụ đề) cùng một
biểu đồ màu. Trước đây chỉ có một phép so: `dl < .07` (bố cục gần như không đổi) hoặc `dh < .25`
(cùng bảng màu) và `dl < .15`. Nhưng máy quay đẩy vào — đúng cái chuyển động là chữ ký của kênh —
làm thay đổi bố cục rất ít ở tầng thu nhỏ: một căn phòng bị đẩy vào 12 % chỉ khác nhau ~0,05.
Nên cờ SAME bắn vào chính những cặp câu mà người làm cố tình đẩy camera vào, và người chấm phải
xoá từng cờ bằng tay: một tập có 22 cờ trên 60 câu, 21 cờ bị xoá; một tập khác 51 cờ trên 93 câu.

`camera_moved` hỏi câu đúng hơn: **một khung có khớp khung kia hơn khi nó được thu nhỏ (hoặc phóng
to) một chút không?** Nếu có, thì máy đã đi, bố cục đã đổi, và câu đó có hình riêng của nó —
không phải cờ SAME nữa. So sánh được làm trong vùng chung của hai khung (không dán nền ra ngoài,
vì nền dán tự nó làm sai lệch).

Đo trên dữ liệu thật của ba tập: 23 cờ → 12; 15 → 6; 51 → 17. Những cờ còn lại trùng với
đúng những cặp người chấm tay đã giữ lại.
"""
import sys

import numpy as np
from PIL import Image


def _gray(a):
    return a.mean(axis=2) if a.ndim == 3 else a


def camera_moved(a, b, dl):
    """True khi hai khung khớp nhau hơn nếu một khung được thu nhỏ (hoặc phóng to) một chút.

    a, b — hai bố cục (mảng 9×16, có thể có ba kênh màu); dl — khoảng cách chúng đo được.
    """
    a, b = _gray(a), _gray(b)
    h, w = a.shape
    for f, g in ((a, b), (b, a)):
        for s in (1.12, 1.25, 1.4):
            # máy đẩy vào: giữa khung cũ, phóng to, khớp khung mới
            nh, nw = int(round(h / s)), int(round(w / s))
            if nh <= h and nw <= w:
                y0, x0 = (h - nh) // 2, (w - nw) // 2
                crop = f[y0:y0 + nh, x0:x0 + nw]
                z = np.asarray(Image.fromarray((crop * 255).astype(np.uint8)).resize((w, h), Image.BILINEAR), dtype=float) / 255
                if np.abs(z - g).mean() < dl * .85:
                    return True
            # máy lùi ra: khung cũ thu nhỏ, khớp giữa khung mới
            nh, nw = int(round(h * s)), int(round(w * s))
            if nh < h and nw < w:
                small = np.asarray(Image.fromarray((f * 255).astype(np.uint8)).resize((nw, nh), Image.BILINEAR), dtype=float) / 255
                gc = g[(h - nh) // 2:(h - nh) // 2 + nh, (w - nw) // 2:(w - nw) // 2 + nw]
                if gc.shape == small.shape and np.abs(small - gc).mean() < dl * .85:
                    return True
    return False


def selftest():
    """ba ca: giống hệt thì không phải máy đã dịch; đẩy vào thì là; hai hình khác thì khác rõ"""
    failures = []

    def check(name, cond, detail=""):
        print("%-4s %s" % ("ok" if cond else "FAIL", name))
        if not cond:
            failures.append(name + (" — " + detail if detail else ""))

    room = np.zeros((9, 16, 3)) + .7
    room[1:5, 1:4] = .3      # một cửa sổ
    room[4:8, 5:13] = .5     # một cái bàn
    room[0:2, 10:14] = .9    # một cây đèn
    other = np.zeros((9, 16, 3)) + .7
    other[1:5, 8:11] = .2    # cửa sổ dời sang chỗ khác
    other[2:7, 1:9] = .5     # và cái bàn dời sang chỗ khác nữa
    other[5:9, 3:11] = .5

    dl_same = float(np.abs(room - room).mean())
    check("hai khung giống hệt thì khoảng cách bằng không", dl_same == 0.0, str(dl_same))
    check("hai khung giống hệt thì không phải máy đã dịch", camera_moved(room, room, dl_same) is False)

    h, w = 9, 16
    s = 1.12
    nh, nw = int(round(h / s)), int(round(w / s))
    y0, x0 = (h - nh) // 2, (w - nw) // 2
    crop = room[y0:y0 + nh, x0:x0 + nw]
    pushed = np.asarray(Image.fromarray((crop * 255).astype(np.uint8)).resize((w, h), Image.BILINEAR), dtype=float) / 255
    dl_push = float(np.abs(pushed - room).mean())
    check("máy đẩy vào thì bố cục ở tầng 16×9 gần như không đổi (đó là lý do cờ bắn sai)",
          dl_push < .07, "dl=%.4f" % dl_push)
    check("máy đẩy vào thì không phải cùng một hình", camera_moved(pushed, room, dl_push) is True)

    dl_other = float(np.abs(other - room).mean())
    check("hai bố cục khác nhau thì khoảng cách lớn hơn ngưỡng cờ", dl_other > .07, "dl=%.4f" % dl_other)

    for f in failures:
        print("FAIL %s" % f)
    print("%d ca đều đúng" % (5 - len(failures)) if not failures else "%d ca sai" % len(failures))
    return 1 if failures else 0


if __name__ == '__main__':
    if '--selftest' in sys.argv:
        sys.exit(selftest())
    print(__doc__)
    sys.exit(0)
