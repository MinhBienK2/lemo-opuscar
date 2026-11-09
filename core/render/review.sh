#!/bin/sh
# Review a film end to end: sh core/render/review.sh <film-folder>
#   1. filmcheck — the film is its own episode: its own name, its own treatment, its own shots (node core/render/filmcheck.mjs)
#   2. drawcheck — the drawing code's calling conventions (node core/render/drawcheck.mjs)
#   3. claims    — the numbers on screen against the numbers the research file supports (tools/check_claims.py)
#   3b. board   — the storyboard (board.json) against the script, the sounds and the code (tools/check_board.py)
#       treatment — TREATMENT.md and LOOK.md of a channel that asks for a board (tools/check_treatment.py)
#   4. facts     — the research file against itself: no duplicated bullet, no wrong cross-reference (tools/check_facts.py)
#   5. readcheck — every text stays on screen long enough to be read (node core/render/readcheck.mjs)
#      scenecheck — films and episodes only: the picture stages the story instead of reading it (node core/render/scenecheck.mjs)
#   6. stills    — review frames every 2 s, from 0 to the film's length (core/render/still.mjs)
#   7. sheet     — the frames on one contact sheet (core/render/sheet.py)
#   8. the film  — measured loudness and black frames, when a finished .mp4 is in the folder
#      motion   — a film with a board: the picture moves, and every beat changes its part of the frame (tools/check_motion.py)
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

# A step that never finishes says nothing about the film, and it looks exactly like a step that is working hard.
# So every step gets a wall clock: past it, the step is killed and reported as "could not run", not as a verdict.
# REVIEW_TIMEOUT=<seconds> raises or lowers the clock for one run (the GPU steps are the slow ones).
STEP_TIMEOUT=${REVIEW_TIMEOUT:-3600}
have_timeout=0
command -v timeout >/dev/null 2>&1 && have_timeout=1

run() {   # run a step, keep going when it fails
  NAME=$1; shift
  echo "--- $NAME"
  if [ "$have_timeout" -eq 1 ]; then
    set -- timeout -k 30 "$STEP_TIMEOUT" "$@"
  fi
  if "$@"; then
    echo "    ok"
  else
    RC=$?
    # exit 2 is the check's own "I could not run" — a crash or a film edited under the check.
    # It is not a verdict about the film, and saying so stops the reader from chasing a defect that is not there.
    # 124 is timeout's own "the clock ran out" — the same thing said in another voice.
    if [ "$RC" -eq 2 ]; then echo "    COULD NOT RUN (exit 2) — not a verdict about the film"
    elif [ "$RC" -eq 124 ]; then echo "    COULD NOT RUN (no answer in ${STEP_TIMEOUT}s) — not a verdict about the film"
    else echo "    FAILED"; fi
    FAIL=$((FAIL + 1))
  fi
}

run filmcheck node "$HERE/core/render/filmcheck.mjs" "$FOLDER"
# drawcheck audits 2D canvas helpers (rect/path/cel); a three.js film has none, so it is not this check's business
if grep -rqsE "from ['\"]three['\"]" "$FOLDER/src" "$FOLDER"/*.js 2>/dev/null; then
  echo "--- drawcheck"; echo "    skipped: three.js film (no 2D drawing helpers to audit)"
else
  run drawcheck node "$HERE/core/render/drawcheck.mjs" "$FOLDER"
fi
# the numbers on screen against the numbers the research file supports
# The channel an episode belongs to: the folder above the episode that holds CHANNEL.md.
BCH=$(cd "$FOLDER" && while [ ! -f CHANNEL.md ] && [ "$PWD" != / ]; do cd ..; done && pwd)
if [ -f "$FOLDER/research/FACTS.md" ]; then
  run claims python3 "$HERE/tools/check_claims.py" "$FOLDER"
  run facts python3 "$HERE/tools/check_facts.py" "$FOLDER/research/FACTS.md"
  run citations python3 "$HERE/tools/check_citations.py" "$FOLDER/research/FACTS.md"
  # A channel knows how its own episodes bind a line to a shot — the 3D episodes declare their shots in
  # their own SHOTS array, a shape the library's 2D timing check does not read. When the channel ships a
  # checker of its own, the channel's checker wins, the same way the treatment check does below.
  if [ -f "$BCH/tools/check_shots.py" ]; then
    # --note: ở cổng bàn giao thì chỉ lỗi cấu trúc mới chặn (câu thiếu tiếng — tiếng sẽ lệch với hình,
    # và sau này không sửa được). Các cờ phép so sánh (SAME/RUN/DARK/NUM, kể cả FILL) thì không chặn:
    # người chấm hình đã phán (tem PICTURE.pass) và máy không có quyền phủ quyết của người chấm. Vòng chấm
    # hình của kênh vẫn gọi bài này KHÔNG có cờ này — mọi cờ đều chặn, vì đó là lúc người làm phim còn
    # sửa được.
    run timing python3 "$BCH/tools/check_shots.py" --note "$FOLDER"
  else
    run timing python3 "$HERE/tools/check_timing.py" "$FOLDER"
  fi
fi
# the storyboard as data: a film that has a board.json, or that belongs to a channel asking for one (board_rules.json),
# is checked against it — beats on words, a signal for every line, a cause for every sound, a film built from the board
if [ -f "$FOLDER/board.json" ] || [ -f "$BCH/board_rules.json" ]; then
  run board "$PY" "$HERE/tools/check_board.py" "$FOLDER"
  # …and directed before it was drawn: benchmark, three structures, cue map, sound, content review, the look rounds
  # A channel knows the shape of its own treatment; the library's check asks for DIRECTOR.md's shape and would
  # fail every episode of a channel whose treatment has its own headings. So the channel's check wins when it has one.
  if [ -f "$BCH/tools/check_treatment.py" ]; then
    run treatment python3 "$BCH/tools/check_treatment.py" "$FOLDER"
  else
    run treatment python3 "$HERE/tools/check_treatment.py" "$FOLDER"
  fi
fi
# a film's own film folder: the subtitles sit at the bottom, so nothing else may be down there.
# The band is matched on the path, so it must match the one-shots under films/ and the episodes under channels/.
BAND=""
case "$FOLDER" in */films/*|films/*|*/channels/*|channels/*) BAND="--band 880";; esac
# A channel states its own limits in scene_rules.json (the channel writes "two numbers a minute"; the library's
# default is looser), and the delivery review passes them to the check — so the rule a channel writes down is
# the rule the gate keeps. It also says how the reading check must draw: a channel that draws at 2× on a small
# GPU loses the browser halfway through the film, and the check that never finished says nothing about the film.
NUMOPT=""; QOPT=""; MOTION=0
# The walk starts inside the folder, so the path it compares is absolute: a relative folder turns into "." and
# dirname(".") is "." forever, and the gate then spins without printing a line until it is killed.
_d=$(cd "$FOLDER" 2>/dev/null && while [ ! -f CHANNEL.md ] && [ "$PWD" != / ]; do cd ..; done && pwd)
if [ -f "$_d/CHANNEL.md" ] && [ -f "$_d/scene_rules.json" ]; then
  N=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('numbersPer20s',''))" "$_d/scene_rules.json" 2>/dev/null || true)
  [ -n "$N" ] && NUMOPT="--numbers-per-20s $N"
  Q=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1])).get('readcheckQ',''))" "$_d/scene_rules.json" 2>/dev/null || true)
  [ -n "$Q" ] && QOPT="$Q"
  # A channel that asks for the motion check gets it, even when it has no board.json: the check asks whether
  # the picture moves and whether each beat changes its own part of the frame — the two things a reviewer of a
  # diorama keeps saying out loud ("the props stand still", "the camera drifts").
  M=$(python3 -c "import json,sys;print(1 if json.load(open(sys.argv[1])).get('checkMotion') else 0)" "$_d/scene_rules.json" 2>/dev/null || echo 0)
  [ "$M" = "1" ] && MOTION=1
fi
if [ -n "$QOPT" ]; then
  run readcheck node "$HERE/core/render/readcheck.mjs" "$FOLDER" $BAND --q "$QOPT"
else
  run readcheck node "$HERE/core/render/readcheck.mjs" "$FOLDER" $BAND
fi
# a narrated film must stage its story, not read it: text-led frames, different looks, spoken numbers, foley on words
if [ -n "$BAND" ]; then run scenecheck node "$HERE/core/render/scenecheck.mjs" "$FOLDER" --band 880 $NUMOPT; fi

# the voice: every line has to transcribe back to the script. The run happens in a scratch folder, so the
# film's own words.json is never rewritten by a check.
# The ASR script is the episode's own, or the channel's: the channel holds it once, the episode does not copy it.
ASR="$FOLDER/voice/asr_vi.py"
if [ ! -f "$ASR" ]; then
  # the channel is the folder above the episode that holds CHANNEL.md — the episode may sit in a series
  # folder, so the search walks up instead of looking one level up
  CHANNEL=$(cd "$FOLDER" && while [ ! -f CHANNEL.md ] && [ "$PWD" != / ]; do cd ..; done && pwd)
  [ -f "$CHANNEL/voice/asr_vi.py" ] && ASR="$CHANNEL/voice/asr_vi.py"
fi
if [ -f "$FOLDER/voice/lines.json" ] && { [ -f "$ASR" ] || [ -f "$HERE/core/tts/asr_check.py" ]; }; then
  echo "--- voice"
  # the speech is a local artefact: a film whose voice has not been generated has nothing to check, and a
  # check that cannot run must say so instead of failing on a file that was never there
  NWAV=0
  for w in "$FOLDER"/voice/*.wav; do [ -f "$w" ] && NWAV=$((NWAV + 1)); done
  if [ "$NWAV" -eq 0 ]; then
    echo "    skipped: this film has no generated voice (the speech is local; build it to check the narration)"
  else
  # the model first: a missing model must not look like a failing check
  HFC=${HF_HOME:-$HOME/.cache/huggingface}
  MODEL=$(ls -d "$HFC"/hub/models--Systran--faster-whisper-* 2>/dev/null | head -1)
  if [ -z "$MODEL" ] && [ -f "$ASR" ]; then
    echo "    skipped: no whisper model under HF_HOME=$HFC (point HF_HOME at a local folder that holds one)"
  else
    VD="$TMP/voice"; mkdir -p "$VD"; cp "$FOLDER/voice/lines.json" "$VD/lines.json"
    for w in "$FOLDER"/voice/*.wav; do [ -f "$w" ] && cp "$w" "$VD/"; done
    # the run must not kill the gate: a missing model is a skip, and the branch below decides what the log says
    ASR_STATUS=0
    if [ -f "$ASR" ]; then
      "$PY" "$ASR" "$VD/lines.json" "$VD/" --model small >"$TMP/voice.txt" 2>&1 || ASR_STATUS=$?
    else
      "$PY" "$HERE/core/tts/asr_check.py" "$VD/lines.json" "$VD/" >"$TMP/voice.txt" 2>&1 || ASR_STATUS=$?
    fi
    if grep -qE 'PermissionError|LocalEntryNotFoundError|ConnectionError|couldn.t be found|no such host' "$TMP/voice.txt"; then
      echo "    skipped: the whisper model could not be loaded (point HF_HOME at a local folder that holds one)"
    elif grep -q '^DIFF' "$TMP/voice.txt"; then
      # A line that does not transcribe back is not always a wrong recording: Whisper is an English-first model and
      # mangles Vietnamese tones (rìa → trì, vải → vậy, cân → cưng, úp → út). The ASR script itself says to read
      # the DIFF lines and judge them, so the gate judges them too — and a judgement is written down: a line id and
      # why it was cleared, in voice/asr-cleared.txt. An uncleared difference still fails the film.
      CLEARED="$FOLDER/voice/asr-cleared.txt"
      UNFORGIVEN=$(python3 - "$TMP/voice.txt" "$CLEARED" <<'PY'
import re, sys
log, cleared = sys.argv[1], sys.argv[2]
ok = set()
try:
    for line in open(cleared, encoding='utf-8'):
        m = re.match(r'\s*([A-Za-z0-9_-]+)\s*[:—-]\s*\S', line)   # an id and a reason, both present
        if m: ok.add(m.group(1))
except OSError:
    pass
left = []
for line in open(log, encoding='utf-8', errors='replace'):
    if not line.startswith('DIFF'): continue
    m = re.search(r'\b([A-Za-z0-9_-]+)\b(?=\s*\|)', line)   # the line id, before the '|'
    lid = m.group(1) if m else ''
    if lid not in ok: left.append(line.rstrip())
print('\n'.join(left))
PY
)
      if [ -n "$UNFORGIVEN" ]; then
        echo "    FAILED: some lines do not transcribe back to the script:"
        printf '%s\n' "$UNFORGIVEN" | sed 's/^/      /'
        if [ -f "$CLEARED" ]; then
          echo "      (cleared lines are listed in $CLEARED — one id and why, per line)"
        else
          echo "      (a line that the recording says correctly but the model mangles may be cleared in"
          echo "       $CLEARED — one id and why, per line; do not change the script to please the model)"
        fi
        FAIL=$((FAIL + 1))
      else
        echo "    ok: every line either transcribes back or is cleared with a written reason:"
        grep '^DIFF' "$TMP/voice.txt" | sed 's/^/      /'
      fi
    elif [ "$ASR_STATUS" -ne 0 ]; then
      echo "    FAILED: the voice check could not run (exit $ASR_STATUS):"
      tail -5 "$TMP/voice.txt" | sed 's/^/      /'
      FAIL=$((FAIL + 1))
    else
      echo "    ok: every line transcribes back"
    fi
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
  # artifact freshness: the movie must not be older than the sources it was built from
  echo "--- freshness: $MP4"
  STALE=0
  for src in "$FOLDER"/src/*.js "$FOLDER"/voice/lines.json; do
    if [ -f "$src" ] && [ "$src" -nt "$MP4" ]; then
      echo "    FAILED: source file $src is newer than $MP4 — the delivered movie is stale; run build.sh again"
      FAIL=$((FAIL + 1))
      STALE=1
      break
    fi
  done
  if [ "$STALE" -eq 0 ]; then
    echo "    ok: movie is up to date with source files"
  fi

  # the filters print their summary at the info level, so -v error would hide it: the log is captured and the lines we need are picked out
  echo "--- loudness: $MP4"
  if ffmpeg -hide_banner -nostats -i "$MP4" -af ebur128=peak=true -f null - 2>"$TMP/loud.txt"; then
    I=$(grep -E '^\s+I:\s+' "$TMP/loud.txt" | tail -1 | sed 's/^ *//')
    LRA=$(grep -E '^\s+LRA:\s+' "$TMP/loud.txt" | tail -1 | sed 's/^ *//')
    PEAK=$(grep -E '^\s+Peak:\s+' "$TMP/loud.txt" | tail -1 | sed 's/^ *//')
    echo "    ${I:-loudness unknown}${LRA:+, $LRA}${PEAK:+, $PEAK}"
    IV=$(echo "$I" | awk '{print $2}')
    PV=$(echo "$PEAK" | awk '{print $2}')
    if [ -n "$IV" ] && [ -n "$PV" ]; then
      BAD_LOUD=$(awk -v i="$IV" -v p="$PV" 'BEGIN { if (i + 0 < -20 || i + 0 > -11 || p + 0 > -0.8) print 1; else print 0 }')
      if [ "$BAD_LOUD" = "1" ]; then
        echo "    FAILED: loudness out of bounds (target -14 LUFS, true peak <= -1.0 dBFS; measured $IV LUFS, peak $PV dBFS)"
        FAIL=$((FAIL + 1))
      fi
    fi
  else
    echo "    FAILED: ffmpeg could not read $MP4"; FAIL=$((FAIL + 1))
  fi
  # the manifest's runtime against the movie's own length: the index publishes this number, so it must be
  # measured, never written by hand
  echo "--- runtime: the manifest against the movie"
  RT=$("$PY" - "$FOLDER/film.json" "$MP4" <<'PY'
import json, subprocess, sys
try:
    d = json.load(open(sys.argv[1], encoding="utf-8"))
except Exception:
    print("SKIP the manifest could not be read")
    sys.exit(0)
claim = (d.get("runtime") or "").strip()
if not claim:
    print("SKIP the manifest has no runtime")
    sys.exit(0)
parts = claim.split(":")
if len(parts) != 2 or not all(p.strip().isdigit() for p in parts):
    print(f"BAD {claim} is not M:SS")
    sys.exit(0)
want = int(parts[0]) * 60 + int(parts[1])
try:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                          sys.argv[2]], capture_output=True, text=True, timeout=60).stdout.strip()
    secs = float(out.split(",")[0])
except Exception:
    print("SKIP ffprobe could not read the movie")
    sys.exit(0)
mm, ss = int(secs // 60), int(round(secs - 60 * (secs // 60)))
if abs(secs - want) > 1.5:
    print(f"BAD the manifest says {claim}, the movie is {mm}:{ss:02d}")
else:
    print(f"ok the manifest says {claim}, the movie is {secs:.1f}s")
PY
)
  case "$RT" in
    BAD*) echo "    FAILED: $RT"; FAIL=$((FAIL + 1)) ;;
    ok*) echo "    $RT" ;;
    *) echo "    $RT" ;;
  esac

  # the frames the movie really has. A render that lost frames keeps its length (the audio carries on)
  # and its metadata, so nothing else says so: only the frame count does.
  echo "--- frames: the movie against the film"
  FR=$("$PY" - "$FOLDER/events.json" "$MP4" <<'PY'
import json, os, subprocess, sys
try:
    dur = float(json.load(open(sys.argv[1], encoding="utf-8")).get("dur") or 0)
except Exception:
    dur = 0
if dur <= 0:
    print("SKIP the film has no duration in events.json")
    sys.exit(0)
try:
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_frames",
                          "-show_entries", "stream=nb_read_frames,r_frame_rate", "-of", "json",
                          sys.argv[2]], capture_output=True, text=True, timeout=300).stdout
    st = json.loads(out)["streams"][0]
    have = int(st["nb_read_frames"]); num, den = (st["r_frame_rate"].split("/") + ["1"])[:2]
except Exception:
    print("SKIP ffprobe could not count the frames")
    sys.exit(0)
fps = float(num) / float(den or 1)
want = round(dur * fps)
if want <= 0:
    print("SKIP the film's length and the movie's fps do not give a frame count")
    sys.exit(0)
missing = want - have
if missing <= max(3, round(want * 0.01)):
    print(f"ok {have} frames, the film asks for {want} ({dur:.1f}s at {fps:g} fps)")
else:
    print(f"BAD the movie has {have} frames but the film asks for {want} — {missing} frames are missing "
          f"(a render that died mid-film leaves the audio running over the last frame)")
PY
)
  case "$FR" in
    BAD*) echo "    FAILED: $FR"; FAIL=$((FAIL + 1)) ;;
    *) echo "    $FR" ;;
  esac

  # a film directed from a board must move: actions over time, not props switched on
  if [ -f "$FOLDER/board.json" ] || [ -f "$BCH/board_rules.json" ] || [ "$MOTION" = "1" ]; then
    run motion "$PY" "$HERE/tools/check_motion.py" "$FOLDER" --mp4 "$MP4"
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
