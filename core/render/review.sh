#!/bin/sh
# Review a film end to end: sh core/render/review.sh <film-folder>
#   1. drawcheck — the drawing code's calling conventions (node core/render/drawcheck.mjs)
#   2. readcheck — every text stays on screen long enough to be read (node core/render/readcheck.mjs)
#   3. stills    — review frames every 2 s, from 0 to the film's length (core/render/still.mjs)
#   4. sheet     — the frames on one contact sheet (core/render/sheet.py)
#   5. the film  — measured loudness and black frames, when a finished .mp4 is in the folder
# Every step runs even when an earlier one fails; the line at the end says PASS or FAIL.
# The library root comes from this script's own path, so it works from any folder.
set -e
HERE=$(cd "$(dirname "$0")/../.." && pwd)
PY="$HERE/.venv/bin/python"
FOLDER=${1:-}
[ -n "$FOLDER" ] || { echo "usage: sh core/render/review.sh <film-folder>" >&2; exit 2; }
[ -d "$FOLDER" ] || { echo "review: no folder $FOLDER" >&2; exit 2; }
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
FAIL=0

run() {   # run a step, keep going when it fails
  NAME=$1; shift
  echo "--- $NAME"
  if "$@"; then echo "    ok"; else echo "    FAILED"; FAIL=$((FAIL + 1)); fi
}

run drawcheck node "$HERE/core/render/drawcheck.mjs" "$FOLDER"
run readcheck node "$HERE/core/render/readcheck.mjs" "$FOLDER"

# the voice: every line has to transcribe back to the script. The run happens in a scratch folder, so the
# film's own words.json is never rewritten by a check.
if [ -f "$FOLDER/voice/lines.json" ] && { [ -f "$FOLDER/voice/asr_vi.py" ] || [ -f "$HERE/core/tts/asr_check.py" ]; }; then
  echo "--- voice"
  # the model first: a missing model must not look like a failing check
  HFC=${HF_HOME:-$HOME/.cache/huggingface}
  MODEL=$(ls -d "$HFC"/hub/models--Systran--faster-whisper-* 2>/dev/null | head -1)
  if [ -z "$MODEL" ] && [ -f "$FOLDER/voice/asr_vi.py" ]; then
    echo "    skipped: no whisper model under HF_HOME=$HFC (point HF_HOME at a local folder that holds one)"
  else
    VD="$TMP/voice"; mkdir -p "$VD"; cp "$FOLDER/voice/lines.json" "$VD/lines.json"
    for w in "$FOLDER"/voice/*.wav; do [ -f "$w" ] && cp "$w" "$VD/"; done
    if [ -f "$FOLDER/voice/asr_vi.py" ]; then
      "$PY" "$FOLDER/voice/asr_vi.py" "$VD/lines.json" "$VD/" --model small >"$TMP/voice.txt" 2>&1
    else
      "$PY" "$HERE/core/tts/asr_check.py" "$VD/lines.json" "$VD/" >"$TMP/voice.txt" 2>&1
    fi
    if grep -qE 'PermissionError|LocalEntryNotFoundError|ConnectionError|couldn.t be found|no such host' "$TMP/voice.txt"; then
      echo "    skipped: the whisper model could not be loaded (point HF_HOME at a local folder that holds one)"
    elif grep -q '^DIFF' "$TMP/voice.txt"; then
      echo "    FAILED: some lines do not transcribe back to the script:"
      grep '^DIFF' "$TMP/voice.txt" | sed 's/^/      /'
      FAIL=$((FAIL + 1))
    else
      echo "    ok: every line transcribes back"
    fi
  fi
fi

DUR=$(node -e 'try { const d = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); const v = Number(d.dur); if (v > 0) console.log(v); } catch (e) {}' "$FOLDER/events.json" 2>/dev/null || true)
if [ -n "$DUR" ]; then
  RANGE="0:$DUR:2"
else
  RANGE="0:120:2"
  echo "--- no duration in $FOLDER/events.json; falling back to the range $RANGE"
fi
run stills node "$HERE/core/render/still.mjs" "$FOLDER" --range "$RANGE" --out "$FOLDER/out/review" --prefix f_

FRAMES=""
for f in "$FOLDER"/out/review/f_*.jpg; do [ -f "$f" ] && FRAMES="$FRAMES $f"; done
if [ -n "$FRAMES" ]; then
  # shellcheck disable=SC2086 # the frame names carry no spaces
  run sheet "$PY" "$HERE/core/render/sheet.py" "$FOLDER/out/review/sheet.jpg" $FRAMES
else
  echo "--- sheet"; echo "    FAILED: no frames to tile"; FAIL=$((FAIL + 1))
fi

MP4=""
for f in "$FOLDER"/*.mp4 "$FOLDER"/out/*.mp4; do
  [ -f "$f" ] || continue
  if [ -z "$MP4" ] || [ "$f" -nt "$MP4" ]; then MP4=$f; fi
done
if [ -n "$MP4" ]; then
  # the filters print their summary at the info level, so -v error would hide it: the log is captured and the lines we need are picked out
  echo "--- loudness: $MP4"
  if ffmpeg -hide_banner -nostats -i "$MP4" -af ebur128 -f null - 2>"$TMP/loud.txt"; then
    I=$(grep -E '^ +I: ' "$TMP/loud.txt" | tail -1 | sed 's/^ *//')
    LRA=$(grep -E '^ +LRA: ' "$TMP/loud.txt" | tail -1 | sed 's/^ *//')
    echo "    ${I:-loudness unknown}${LRA:+, $LRA}"
  else
    echo "    FAILED: ffmpeg could not read $MP4"; FAIL=$((FAIL + 1))
  fi
  echo "--- black frames: $MP4"
  if ffmpeg -hide_banner -nostats -i "$MP4" -vf blackdetect=d=0.5 -f null - 2>"$TMP/black.txt"; then
    N=$(grep -c 'black_start' "$TMP/black.txt" || true)
    if [ "$N" -gt 0 ]; then
      echo "    $N black stretch(es) of 0.5 s or more:"
      grep 'black_' "$TMP/black.txt" | sed 's/^/      /'
    else
      echo "    no black stretch of 0.5 s or more"
    fi
  else
    echo "    FAILED: ffmpeg could not read $MP4"; FAIL=$((FAIL + 1))
  fi
else
  echo "--- the film: no .mp4 in $FOLDER (skipped)"
fi

if [ "$FAIL" -gt 0 ]; then
  echo "review: FAIL $FOLDER ($FAIL step(s) failed)"
  exit 1
fi
echo "review: PASS $FOLDER"
