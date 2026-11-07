#!/bin/sh
# Sinh giọng cho nhiều câu song song: tách lines.json thành N phần, chạy N tiến trình tts_vi.py.
# Dùng: sh tools/tts_parallel.sh <thư mục tập> [số tiến trình]
set -e
EP=$1
N=${2:-6}
LIB=/home/minhbien/Documents/lemo-opuscar
VOICE=$EP/voice
TMP=$(mktemp -d)
python3 - "$VOICE/lines.json" "$TMP" "$N" <<'PY'
import json, os, sys
lines = json.load(open(sys.argv[1], encoding='utf-8'))
tmp, n = sys.argv[2], int(sys.argv[3])
for i in range(n):
    part = lines[i::n]
    if part:
        json.dump(part, open(os.path.join(tmp, f'part{i}.json'), 'w', encoding='utf-8'), ensure_ascii=False)
print('split into', n, 'parts')
PY
i=0
for p in "$TMP"/part*.json; do
  i=$((i + 1))
  HF_HOME=$HOME/hf-cache LIB=$LIB "$LIB/.venv/bin/python" "$LIB/channels/tram-nghi-nhieu/voice/tts_vi.py" "$p" "$VOICE" > "$TMP/log$i.txt" 2>&1 &
done
wait
cat "$TMP"/log*.txt | grep -v '^ ' | tail -5
python3 - "$VOICE" <<'PY'
import json, os, sys
V = sys.argv[1]
dur = {}
for f in sorted(os.listdir(V)):
    if f.endswith('.wav'):
        dur[f[:-4]] = None
lines = json.load(open(os.path.join(V, 'lines.json'), encoding='utf-8'))
print('wav files:', len(dur), 'of', len(lines))
PY
rm -rf "$TMP"
