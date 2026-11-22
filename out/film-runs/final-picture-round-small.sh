#!/bin/sh
# Vòng chấm hình LẠI cho tập 03 — bản dự phòng, dùng đúng thông số mà kinh nghiệm đã chứng minh.
#
# Vì sao thông số này (khác với những lần trước):
#   • `LEMO_MAX_ROUNDS` cao hơn bộ đếm vòng hiện tại: `review.py` tăng bộ đếm vòng TRƯỚC khi
#     chấm, nên một vòng bị giết vẫn tiêu một lượt. Lần chạy sau cần trần cao hơn bộ đếm,
#     không thì mọi mục chưa chấm thành MỞ và bước đóng với 0 mục được chấm.
#   • `--again all`: bước này đã đổi người chấm (opus-5-5 → opus-5-5-thinking), và
#     `scope()` không tự chấm lại mục đã MỞ mà hình không đổi.
#   • **lô 4 câu, `CRITIC_TIMEOUT=1800`**: lô 6 câu với 3600 s đã treo 40 phút một lần
#     (tap-03 tóc ẩm). Lô nhỏ + giờ chờ ngắn để lô treo chết nhanh thay vì giết cả vòng.
#
# Nếu lệnh bị giết giữa chừng: chạy lại Y HỆT, với `LEMO_MAX_ROUNDS` nâng cao thêm
# (vì vòng bị giết vẫn tiêu một lượt vòng).
set -e
LIB=/home/minhbien/Documents/lemo-opuscar
EP=channels/tram-nghi-nhieu/series/do-vat/tap-03-dien-thoai-nong-khi-sac
cd "$LIB"

R=$(python3 -c "import json;print(json.load(open('$EP/review/picture.json')).get('round',0))")
MAX=$((R + 4))
echo "=== bộ đếm vòng hiện tại: $R → trần đặt: $MAX"
echo "=== dựng lại tờ nhịp (184 câu, ~3 phút)"
LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/tools/beatsheet.mjs "$EP" --out "$EP/review/beatsheet" 2>&1 | tail -2

echo "=== chấm hình (lô 4, giờ chờ 1800)"
LEMO_CRITIC_MODEL=claude-opus-5-5-thinking CRITIC_TIMEOUT=1800 LEMO_MAX_ROUNDS=$MAX LEMO_CRITIC_BATCH=4 \
  sh channels/tram-nghi-nhieu/tools/review.sh "$EP" picture --again all 2>&1 | tail -20

echo "=== trạng thái"
python3 channels/tram-nghi-nhieu/tools/gate.py status "$EP" 2>&1 | sed -n '5,9p'
