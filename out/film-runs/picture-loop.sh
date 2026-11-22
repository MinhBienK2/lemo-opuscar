#!/bin/sh
# Chạy vòng chấm hình cho tập 03 cho tới khi bước `picture` đóng hoặc hết việc.
#
# Vì sao cần chạy vòng nối tiếp thay vì một lệnh dài:
#   • `review.py` ghi state sau MỖI lô (`gate.save` trong vòng lặp), nên vòng bị giết vẫn giữ
#     phần đã chấm — không mất tiến độ.
#   • Nhưng mỗi lần chạy lại lại tăng bộ đếm vòng một lần, và khi bộ đếm vượt `MAX_ROUNDS`
#     thì bước đóng lại với mọi mục chưa chấm thành MỞ — chấm được 0 mục mà bước "XONG".
#     ⇒ `LEMO_MAX_ROUNDS` phải lớn hơn bộ đếm hiện tại, và mỗi lần chạy lại ta lại nâng nó.
#   • Lô 4 câu + `CRITIC_TIMEOUT=1800`: một lô treo chết nhanh thay vì kéo cả vòng.
#
# Vòng lặp ở đây chỉ chạy lại lệnh khi nó bị GIẾT (mã khác 0) hoặc khi bước chưa đóng.
set -e
LIB=/home/minhbien/Documents/lemo-opuscar
EP=channels/tram-nghi-nhieu/series/do-vat/tap-03-dien-thoai-nong-khi-sac
cd "$LIB"

LOG=out/film-runs/picture-loop.log
: > "$LOG"
TRIES=12

i=0
while [ $i -lt $TRIES ]; do
  i=$((i + 1))
  R=$(python3 -c "import json;print(json.load(open('$EP/review/picture.json')).get('round',0))" 2>/dev/null || echo 0)
  MAX=$((R + 3))
  N=$(python3 -c "
import json
from collections import Counter
d=json.load(open('$EP/review/picture.json'))
print(sum(1 for v in d.get('items',{}).values() if v.get('verdict')=='PASS'))" 2>/dev/null || echo 0)
  echo "[$(date +%H:%M)] lần $i · bộ đếm vòng $R · trần $MAX · đã ĐẠT $N/184" | tee -a "$LOG"

  # `--again all` chỉ cần khi đổi người chấm; các lần sau scope() tự gửi mục chưa chấm.
  EXTRA=""
  if [ "$i" = "1" ]; then EXTRA="--again all"; fi

  set +e
  LEMO_CRITIC_MODEL=claude-opus-5-5-thinking CRITIC_TIMEOUT=1800 \
    LEMO_MAX_ROUNDS=$MAX LEMO_CRITIC_BATCH=4 \
    sh channels/tram-nghi-nhieu/tools/review.sh "$EP" picture $EXTRA 2>&1 | tail -6 | tee -a "$LOG"
  ST=$?
  set -e

  # bước đã đóng thì hết việc
  if python3 -c "
import sys; sys.path.insert(0,'channels/tram-nghi-nhieu/tools')
import gate
sys.exit(0 if gate.why_open('$EP','picture') is None else 1)"; then
    echo "[$(date +%H:%M)] bước picture ĐÓNG" | tee -a "$LOG"
    break
  fi
  echo "[$(date +%H:%M)] lần $i xong (mã $ST) — chạy tiếp" | tee -a "$LOG"
done

echo "=== trạng thái cuối"
python3 channels/tram-nghi-nhieu/tools/gate.py status "$EP" 2>&1 | sed -n '5,9p'
