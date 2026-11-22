#!/bin/sh
# Vòng chấm hình cuối của tập 03 (điện thoại nóng khi sạc).
# Hai tham số này là BÀI HỌC, không phải lựa chọn:
#   LEMO_MAX_ROUNDS=8  — một vòng 184 câu mất ~3,5 giờ; nếu vòng bị giết giữa chừng mà trần đã cạn,
#                        phần chưa chấm biến thành MỞ **không ai chấm** (đúng tai hoạ của lần trước: 139 câu).
#                        Nâng trần NGAY từ vòng đầu, đừng đợi nó cạn vòng.
#   LEMO_CRITIC_BATCH=12 — lô 20 câu quá nặng cho người chấm (7 tiêu chí × 2 ảnh): nó bỏ dở
#                        ("không trả lời đủ"). Lô 12 thì chạy.
# Nếu lệnh bị giết giữa chừng: xoá review/picture.json + review/picture-*.md + review/PICTURE.md
# (sao lưu vào out/scratch/) rồi chạy lại y hệt — scope() chỉ gửi lại mục chưa có phán quyết.
set -e
LIB=/home/minhbien/Documents/lemo-opuscar
EP=channels/tram-nghi-nhieu/series/do-vat/tap-03-dien-thoai-nong-khi-sac
cd "$LIB"

echo "=== dựng lại tờ nhịp (184 câu, ~3 phút)"
LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/tools/beatsheet.mjs "$EP" --out "$EP/review/beatsheet" 2>&1 | tail -3

echo "=== chấm hình"
LEMO_CRITIC_MODEL=claude-opus-5-5 CRITIC_TIMEOUT=3600 LEMO_MAX_ROUNDS=8 LEMO_CRITIC_BATCH=12 \
  sh channels/tram-nghi-nhieu/tools/review.sh "$EP" picture 2>&1 | tail -20

echo "=== trạng thái"
python3 channels/tram-nghi-nhieu/tools/gate.py status "$EP" 2>&1 | sed -n '5,9p'
