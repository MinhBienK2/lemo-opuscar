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
[ -d "$HOME/hf-cache" ] && export HF_HOME=${HF_HOME:-$HOME/hf-cache}
NAME=tram-nghi-nhieu-series-the-gioi-tap-01-cau-vong
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
# the timeline: generated from the script by the episode's own mk_timeline.py, or else by the channel's
# (FILM=this folder), which only writes a timeline.js it wrote itself: one written by hand is left alone
if [ -f "$HERE/mk_timeline.py" ]; then
  "$LIB/.venv/bin/python" "$HERE/mk_timeline.py"
elif [ -f "$CHANNEL/mk_timeline.py" ] && { [ ! -f "$HERE/src/timeline.js" ] || head -1 "$HERE/src/timeline.js" | grep -q "mk_timeline.py của kênh"; }; then
  FILM="$HERE" "$LIB/.venv/bin/python" "$CHANNEL/mk_timeline.py"
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
# two workers, not four: at ss=2 (3840×2160) four browsers overrun the 6 GB of a small GPU, the
# browser dies mid-film, ffmpeg closes the segment — and the film loses frames in silence.
# A machine with more VRAM can raise this; a machine with less should lower it.
node core/render/video.mjs "$HERE" --workers 2 --out "$OUT/video.mp4"
node --input-type=module -e "
import fs from 'fs'; const { build } = await import('$HERE/src/timeline.js');
const r = p => JSON.parse(fs.readFileSync('$HERE/' + p)); const T = build(r('voice/proc/dur.json'), r('voice/words.json'), r('voice/lips.json'));
fs.writeFileSync('$OUT/cues.json', JSON.stringify(T.cues.map(c => ({ t0: c.t0, t1: c.t1, text: c.text }))));"
"$LIB/.venv/bin/python" core/render/srt.py "$OUT/cues.json" "$OUT/$NAME.transcript.srt"
sh core/render/mux.sh "$OUT/video.mp4" "$OUT/mix.wav" "$OUT/$NAME.mp4" 24 0
# the poster is a frame of this film, at 40% of its length — never a time copied from another film
PS=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/$NAME.mp4" 2>/dev/null | cut -d, -f1)
if [ -n "$PS" ]; then PS=$(LC_ALL=C awk -v d="$PS" 'BEGIN { printf "%.1f", d * 0.4 }'); else PS=1; fi
ffmpeg -y -ss "$PS" -i "$OUT/$NAME.mp4" -vframes 1 -q:v 2 "$OUT/poster.jpg" >/dev/null 2>&1 || true
# the length of the film is measured from the movie that was just built, never written by hand: the index
# publishes this number, and a guess is a lie with a timestamp on it
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/$NAME.mp4" 2>/dev/null | cut -d, -f1)
if [ -n "$DUR" ]; then
  "$LIB/.venv/bin/python" - "$HERE/film.json" "$DUR" <<'PY'
import re, sys
path, secs = sys.argv[1], float(sys.argv[2])
mm, ss = int(secs // 60), int(round(secs - 60 * (secs // 60)))
if ss == 60:
    mm, ss = mm + 1, 0
rt = f"{mm}:{ss:02d}"
try:
    body = open(path, encoding="utf-8").read()
except OSError:
    sys.exit(0)
new = re.sub(r'("runtime"\s*:\s*)"[^"]*"', lambda m: m.group(1) + f'"{rt}"', body, count=1)
if new != body:
    open(path, "w", encoding="utf-8").write(new)
    print(f"film.json: runtime {rt} (measured from the movie)")
PY
fi
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
