#!/bin/sh
# Rebuild the film from source: sh build.sh   (OUT=<folder> to choose where everything is written)
# The voice is already in voice/; to make it again: $LIB/.venv/bin/python voice/tts_vi.py voice/lines.json voice/ && $LIB/.venv/bin/python voice/process.py
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE/../.." && pwd)}
OUT=${OUT:-$HERE/out}; mkdir -p "$OUT"; OUT=$(cd "$OUT" && pwd); export LIB OUT
cd "$LIB"
node core/render/events.mjs "$HERE"
"$LIB/.venv/bin/python" "$HERE/mix.py"
node core/render/video.mjs "$HERE" --workers 4 --out "$OUT/video.mp4"
node --input-type=module -e "
import fs from 'fs'; const { build } = await import('$HERE/src/timeline.js');
const r = p => JSON.parse(fs.readFileSync('$HERE/' + p)); const T = build(r('voice/proc/dur.json'), r('voice/words.json'), r('voice/lips.json'));
fs.writeFileSync('$OUT/cues.json', JSON.stringify(T.cues.map(c => ({ t0: c.t0, t1: c.t1, text: c.text }))));"
"$LIB/.venv/bin/python" core/render/srt.py "$OUT/cues.json" "$OUT/phi-vu-trieu-do-2-phut.srt"
sh core/render/mux.sh "$OUT/video.mp4" "$OUT/mix.wav" "$OUT/phi-vu-trieu-do-2-phut.mp4" 24 0
ffmpeg -v error -y -ss 11.5 -i "$OUT/phi-vu-trieu-do-2-phut.mp4" -frames:v 1 -q:v 2 "$OUT/poster.jpg"
