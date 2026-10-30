#!/bin/sh
# Render the channel's demo: the cast sheet, one character drawn in 2D and in 3D from one spec.
#   sh build.sh          → test.mp4, test.jpg and styleframe.jpg next to this script
#
# The demo is a page, not a film: no voice, no music, no subtitles, no end card. The library's own tools
# render it like any other page (the page contract in core/README.md).
#
# On a machine without GPU drivers the 3D half needs a software backend:
#   LEMO_ANGLE=swiftshader sh build.sh
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$(cd "$HERE" && while [ ! -f core/render/review.sh ] && [ "$PWD" != / ]; do cd ..; done && pwd)}
OUT=${OUT:-$HERE}; mkdir -p "$OUT"; OUT=$(cd "$OUT" && pwd)
cd "$LIB"
LEMO_ANGLE=${LEMO_ANGLE:-swiftshader}   # the cast sheet has a 3D half; without a backend it renders blank
export LEMO_ANGLE

# the film: ten seconds of the pose loop. The demo has no sound, so the video is the deliverable as it is.
node core/render/video.mjs "$HERE" --fps 24 --out "$OUT/video.mp4"
cp "$OUT/video.mp4" "$OUT/test.mp4"

# the poster and the style frame
node core/render/still.mjs "$HERE" 0.5 --out "$OUT" --prefix styleframe_ >/dev/null
cp "$OUT/styleframe_0.5.jpg" "$OUT/styleframe.jpg"
ffmpeg -v error -y -ss 1.5 -i "$OUT/test.mp4" -frames:v 1 -q:v 2 "$OUT/test.jpg"
rm -f "$OUT/video.mp4" "$OUT/styleframe_0.5.jpg"

echo "demo: $OUT/test.mp4"
echo "      $OUT/test.jpg"
echo "      $OUT/styleframe.jpg"
