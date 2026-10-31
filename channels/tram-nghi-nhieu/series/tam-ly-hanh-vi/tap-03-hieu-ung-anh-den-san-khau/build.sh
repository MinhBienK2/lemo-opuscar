#!/bin/sh
# Rebuild the film from source: sh build.sh   (OUT=<folder> to choose where everything is written)
# The channel's shared code is used, never copied: the rig is imported from the channel, the mix is
# the channel's mix.py (FILM=this folder), the voice scripts are the channel's.
# The voice is already in voice/; to make it again (from this folder):
#   $LIB/.venv/bin/python "$CHANNEL/voice/tts_vi.py" voice/lines.json voice/
#   $LIB/.venv/bin/python "$CHANNEL/voice/asr_vi.py" voice/lines.json voice/ --model small
#   $LIB/.venv/bin/python "$CHANNEL/voice/process.py" voice/
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
# the library root: the upward search of docs/layout.md — the depth of the channel never counts
LIB=${LIB:-$(cd "$HERE" && while [ ! -f core/render/review.sh ] && [ "$PWD" != / ]; do cd ..; done && pwd)}
# the channel: the folder above the episode, the one that holds CHANNEL.md
CHANNEL=${CHANNEL:-$(cd "$HERE" && while [ ! -f CHANNEL.md ] && [ "$PWD" != / ]; do cd ..; done && pwd)}
OUT=${OUT:-$HERE/out}; mkdir -p "$OUT"; OUT=$(cd "$OUT" && pwd); export LIB OUT CHANNEL
NAME=tram-nghi-nhieu-series-tam-ly-hanh-vi-tap-03-hieu-ung-anh-den-san-khau
echo "library: $LIB"
echo "channel: $CHANNEL"
# what the episode must have before there is anything to build: the tools would answer with a stack
# trace, this answers with a sentence
if [ ! -f "$HERE/src/film.js" ]; then
  echo "this episode has no shots yet: $HERE/src/film.js is missing." >&2
  echo "  write src/film.js (the page: window.READY, window.render(t), window.DUR, window.TEXTS(t))" >&2
  echo "  and src/timeline.js (the order of the lines), then build again." >&2
  exit 1
fi
cd "$LIB"
# the timeline: an episode that generates it from the script has mk_timeline.py, one that writes it
# by hand has none — the stage is the same either way
if [ -f "$HERE/mk_timeline.py" ]; then
  "$LIB/.venv/bin/python" "$HERE/mk_timeline.py"
fi
if [ ! -f "$HERE/src/timeline.js" ]; then
  echo "this episode has no shots yet: $HERE/src/timeline.js is missing (the cues are timed from it)." >&2
  exit 1
fi
node core/render/events.mjs "$HERE"
if [ ! -f "$HERE/events.json" ]; then
  echo "no events.json in FILM=$HERE — the episode has no shots yet (src/film.js must set window.DUR and window.EV)." >&2
  exit 1
fi
if [ ! -f "$HERE/voice/proc/dur.json" ]; then
  echo "no voice yet in $HERE/voice — the cues are timed from it. Make it first:" >&2
  echo "  $LIB/.venv/bin/python \"$CHANNEL/voice/tts_vi.py\" voice/lines.json voice/" >&2
  exit 1
fi
FILM=$HERE "$LIB/.venv/bin/python" "$CHANNEL/mix.py"
node core/render/video.mjs "$HERE" --workers 4 --out "$OUT/video.mp4"
node --input-type=module -e "
import fs from 'fs'; const { build } = await import('$HERE/src/timeline.js');
const r = p => JSON.parse(fs.readFileSync('$HERE/' + p)); const T = build(r('voice/proc/dur.json'), r('voice/words.json'), r('voice/lips.json'));
fs.writeFileSync('$OUT/cues.json', JSON.stringify(T.cues.map(c => ({ t0: c.t0, t1: c.t1, text: c.text }))));"
"$LIB/.venv/bin/python" core/render/srt.py "$OUT/cues.json" "$OUT/$NAME.transcript.srt"
sh core/render/mux.sh "$OUT/video.mp4" "$OUT/mix.wav" "$OUT/$NAME.mp4" 24 0
# the poster is a frame of this film, at 40% of its length — never a time copied from another film
PS=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/$NAME.mp4" 2>/dev/null | cut -d, -f1)
if [ -n "$PS" ]; then PS=$(LC_ALL=C awk -v d="$PS" 'BEGIN { printf "%.1f", d * 0.4 }'); else PS=1; fi
ffmpeg -v error -y -ss "$PS" -i "$OUT/$NAME.mp4" -frames:v 1 -q:v 2 "$OUT/poster.jpg"
# the deliverables stay in the project folder, where they are committed and where the review finds them.
# The captions are already burned into the picture: the .srt is the transcript for the platform, and it is not
# named like the film so that a player does not load it on top of the captions that are in the picture.
cp "$OUT/$NAME.mp4" "$OUT/$NAME.transcript.srt" "$OUT/poster.jpg" "$HERE/"
# the review gate: the checks must pass before the film is called done (REVIEW=0 skips it)
if [ "${REVIEW:-1}" = "1" ]; then
  set +e
  sh core/render/review.sh "$HERE"
  ST=$?
  set -e
else
  echo "review skipped (REVIEW=0)"
  ST=0
fi
echo "film: $OUT/$NAME.mp4"
exit $ST
