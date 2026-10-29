#!/bin/sh
# sh build.sh   (rebuilds the film from source; the voice is already in voice/)
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/home/pc599/Documents/lemo-opuscar}
export LIB
cd "$HERE"
FPS=${FPS:-24}
NAME=mot-vong-lon-muoi-bon-nam
node render.mjs events
"$LIB/.venv/bin/python" mix.py
FPS=$FPS node render.mjs video ${WORKERS:-8}
# the renderer writes out/seg_*.mp4; join them in worker order (numeric, not lexicographic) into out/video.mp4
: > out/list.txt
for i in $(seq 0 $(( $(ls out/seg_*.mp4 2>/dev/null | wc -l) - 1 ))); do echo "file 'out/seg_$i.mp4'" >> out/list.txt; done
ffmpeg -y -v error -f concat -safe 0 -i out/list.txt -c copy out/video.mp4
sh "$LIB/core/render/mux.sh" out/video.mp4 out/mix.wav "$HERE/$NAME.mp4" $FPS 1
node make_srt.mjs
ffmpeg -v error -y -ss 12 -i "$HERE/$NAME.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
echo "built $HERE/$NAME.mp4"
