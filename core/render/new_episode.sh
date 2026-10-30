#!/bin/sh
# Create a new episode of a channel: sh core/render/new_episode.sh <channel> <episode> [title]
#
# The scaffold replaces the old ritual of copying the previous episode's folder. A copy carries the
# old episode with it — its treatment, its research file, its title, its name in build.sh — and the
# copies were found on screen (core/render/filmcheck.mjs). This script writes the templates of the
# layout contract (docs/layout.md) and nothing else: an episode starts empty of identity.
#
# The channel's shared code is attached, never copied: the episode's src/ imports the channel's rig
# by relative path, the episode's build.sh calls the channel's mix.py (with FILM=this folder) and
# the channel's voice scripts (with this folder's paths).
#
# It refuses to run unless the channel exists (channels/<channel>/CHANNEL.md) and refuses to touch
# an episode that already exists. Nothing is written outside channels/<channel>/<episode>/.
set -e

usage() {
  printf 'usage: sh core/render/new_episode.sh <channel> <episode> [title]\n' >&2
}

die() {
  printf 'new_episode: %s\n' "$*" >&2
  exit 1
}

[ $# -ge 2 ] && [ $# -le 3 ] || { usage; exit 2; }

CHANNEL=$1
EPISODE=$2
TITLE=${3:-}

# the library root: the upward search of docs/layout.md (the depth of the channel never counts)
LIB=$(cd "$(dirname "$0")" && while [ ! -f core/render/review.sh ] && [ "$PWD" != / ]; do cd ..; done && pwd)
if [ ! -f "$LIB/core/render/review.sh" ]; then
  die "cannot find the library root (no core/render/review.sh above $(dirname "$0"))"
fi

case "$CHANNEL" in
  ''|.|..|*/*) die "not a channel name: '$CHANNEL'" ;;
esac
case "$EPISODE" in
  ''|.|..|*/*) die "not an episode name: '$EPISODE'" ;;
esac

CHANNEL_DIR="$LIB/channels/$CHANNEL"
if [ ! -f "$CHANNEL_DIR/CHANNEL.md" ]; then
  die "there is no channel '$CHANNEL': $CHANNEL_DIR/CHANNEL.md does not exist. An episode belongs to a channel — make the channel first, or name one that exists."
fi

DIR="$CHANNEL_DIR/$EPISODE"
if [ -e "$DIR" ]; then
  die "the episode '$EPISODE' already exists: $DIR. An episode is never overwritten — delete it yourself if you really mean to start again."
fi

[ -n "$TITLE" ] || TITLE="$CHANNEL — $EPISODE"
# the movie name: the channel and the episode, so two channels with an episode of the same name
# never write the same movie (filmcheck.mjs enforces that the name is unique in the library)
NAME="$CHANNEL-$EPISODE"
MOVIE="$NAME.mp4"

# the title goes into JSON and into HTML: quote it so a " in the title cannot break the file
TITLE_JSON=$(printf '%s' "$TITLE" | sed 's/\\/\\\\/g; s/"/\\"/g')
TITLE_HTML=$(printf '%s' "$TITLE" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g')

mkdir -p "$DIR/research" "$DIR/src" "$DIR/voice" "$DIR/out"

# ---------------------------------------------------------------------------------------------
# TREATMENT.md — the headings DIRECTOR.md §4 asks for, in its order
# ---------------------------------------------------------------------------------------------
{
  printf '# TREATMENT — %s\n\n' "$TITLE"
  printf 'Kênh / channel: **%s** · Tập / episode: `%s` · Phim / movie: `%s`\n\n' "$CHANNEL" "$EPISODE" "$MOVIE"
  cat <<'EOF'
> Write this before drawing anything, and before opening the channel's previous episode or its demo
> (`DIRECTOR.md` §4). Every heading below is one the director expects to find; the placeholders are
> what you must replace. Write in the channel's language.

## 1. Ba cấu trúc ứng viên / Three candidate structures

**A. <structure>** — <a few lines: the shape of the film, what it buys, what it costs>

**B. <structure>** — <a few lines>

**C. <structure>** — <a few lines>

**Chosen: <A, B or C>** — <why; and what the first idea would have been, and why it is not this one>

## 2. Logline và cung / Logline and arc

> <one sentence>

- Setup: <the opening image>
- Turn: <what changes>
- Ending: <the last image, and the one action the viewer can take today>

## 3. So với tập trước / Benchmark — learn, don't learn

| From | Learn | Don't learn |
|---|---|---|
| the channel's previous episode | <what this episode keeps of it> | <what it must not repeat> |
| the channel's `DEMO.md` | <what this episode keeps of it> | <what it must not repeat> |

## 4. Danh sách cảnh / Shot list

| # | Shot | Framing | Angle | Camera move | Duration | Why it is shot that way |
|---|---|---|---|---|---|---|
| 1 | <shot> | <wide / full / medium / close / insert> | <angle> | <push / pull / pan / track / crane / zoom / none> | <s> | <why> |
| 2 | <shot> | <framing> | <angle> | <move> | <s> | <why> |

## 5. Nhịp truyện / Beat sheet

| Time | Beat | What is on screen | Line id |
|---|---|---|---|
| 0:00 | <beat> | <image> | <line id> |
| 0:00 | <beat> | <image> | <line id> |

## 6. Bản đồ nhạc / Cue map

Tempo: <bpm> · Key: <key> · Meter: <n/n>

| Section | Bars | Instrumentation | Cut on | Key action on | Subtitle on |
|---|---|---|---|---|---|
| A | <bars> | <instruments> | <beat> | <beat> | <beat> |

## 7. Bảng âm thanh / Sound design table

| Section | Ambience bed | Main foley | Music state |
|---|---|---|---|
| A | <bed> | <foley> | <state> |

## 8. Phụ đề và chữ / Subtitle and title design

- Type: <the fonts the channel uses, and where they live>
- Subtitles: <size, position, colour, how many lines>
- Titles: <the title card, how it is composed>
EOF
} > "$DIR/TREATMENT.md"

# ---------------------------------------------------------------------------------------------
# CREDITS — the credit lines the film will need, with this episode's own title
# ---------------------------------------------------------------------------------------------
{
  printf '# Credits & licences: %s (%s, episode `%s`)\n\n' "$TITLE" "$CHANNEL" "$EPISODE"
  cat <<'EOF'
Every third-party asset of the film, with its source and its licence. The shared code belongs to
the channel and is used from there — it is never copied into this episode.

| Asset | Source | Licence |
|---|---|---|
| All drawing, the shots and the animation (`src/`) | Canvas 2D code written for this episode | yours |
| The character rig and the shared drawing helpers (`../../rig/`) | the channel's shared code — used from the channel, never copied here | yours |
| The mix (`../../mix.py`) | the channel's shared mix: music, ambience, foley | yours / MIT |
| The voice (`../../voice/`) | the channel's voice pipeline — a stock neural voice, no cloning | the voice service's terms |
| The fonts (`../../fonts/`) | the channel's fonts | SIL Open Font License 1.1 (see the OFL files in the channel's `fonts/`) |
| Sources of the research | listed in `research/FACTS.md` — no image, audio, logo or dataset from any research group is used in the film; every chart is drawn in code | — |
EOF
} > "$DIR/CREDITS"

# ---------------------------------------------------------------------------------------------
# research/FACTS.md — the rule of the file, one claim as a template, the forbidden values
# ---------------------------------------------------------------------------------------------
{
  printf '# Facts — %s\n\n' "$TITLE"
  cat <<'EOF'
Every number the film puts on screen has its source in this file. The voice says them; the film
shows them. Nothing goes on screen that is not written down here.

**The rule of this file:** every number on screen has a source here, and a value this file forbids
must not appear in the film. (Mọi con số trên màn hình đều có nguồn ở đây; một giá trị mà file
này cấm thì **không được nói** trong phim.)

## 1. <claim, in the words the film will use>

> <the sentence of the source, quoted>

<Author>, *<Title of the paper>*, **<Journal>** <volume>(<issue>), <year>, p. <first page>–<last page>. DOI: <doi or link>

- Used in the film: <the number that goes on screen, and where it appears>
- Scope: <what the source supports, and what it does not — the boundary the film must not cross>
- Wording: <the source's own wording of the number, kept as it is>

<!-- Copy this section for every other claim of the episode. Each one: the source, the number on
     screen, and the limit of what the source says. Write every bullet in that claim's own words:
     the same bullet written twice in one file is what tools/check_facts.py reports. -->

## Suy luận của tập phim / The film's own inferences (not research findings)

- <what this episode puts together that no single source says>

## Giá trị không được nói / Values this film must not show

- "<value>" — không được nói trong phim: <why the source does not support it, and what may be said instead>

## Nguồn / Sources

- <Author> (<year>). <Title of the paper>. <Journal>. DOI: <doi or link>
EOF
} > "$DIR/research/FACTS.md"

# ---------------------------------------------------------------------------------------------
# film.json — the manifest: the film's own facts
# ---------------------------------------------------------------------------------------------
printf '{\n  "title": "%s",\n  "movie": "%s",\n  "runtime": ""\n}\n' "$TITLE_JSON" "$MOVIE" > "$DIR/film.json"

# ---------------------------------------------------------------------------------------------
# index.html — the page shell of the channel's episodes; the contract is written by src/film.js
# ---------------------------------------------------------------------------------------------
{
  printf '<!doctype html>\n'
  printf '<html lang="en"><head><meta charset="utf-8"><title>%s</title>\n' "$TITLE_HTML"
  cat <<'EOF'
<link rel="stylesheet" href="../fonts/fonts.css">
<style>html,body{margin:0;background:#12131A;overflow:hidden}canvas{display:block}</style>
</head><body><canvas id="c" width="1920" height="1080"></canvas>
<!-- The page contract (core/README.md): this page must expose window.READY = true once the fonts
     and the images are loaded, window.render(t) to draw the frame at second t, window.DUR for the
     length of the film in seconds, and window.TEXTS(t) for the on-screen texts with their boxes.
     They are written by src/film.js — the shell above is the one the channel's episodes use.
     Set the language of the page (html lang) to the channel's. -->
<script type="module" src="src/film.js"></script></body></html>
EOF
} > "$DIR/index.html"

# ---------------------------------------------------------------------------------------------
# build.sh — the build order of the channel's episodes, with this episode's own name
# ---------------------------------------------------------------------------------------------
{
  printf '#!/bin/sh\n'
  cat <<'EOF'
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
CHANNEL=${CHANNEL:-$(cd "$HERE/.." && pwd)}
OUT=${OUT:-$HERE/out}; mkdir -p "$OUT"; OUT=$(cd "$OUT" && pwd); export LIB OUT CHANNEL
EOF
  printf 'NAME=%s\n' "$NAME"
  cat <<'EOF'
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
if [ -n "$PS" ]; then PS=$(awk -v d="$PS" 'BEGIN { printf "%.1f", d * 0.4 }'); else PS=1; fi
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
EOF
} > "$DIR/build.sh"
chmod +x "$DIR/build.sh"

# ---------------------------------------------------------------------------------------------
# voice/lines.json — the script of the episode, empty: no line of another episode is carried over
# ---------------------------------------------------------------------------------------------
printf '[]\n' > "$DIR/voice/lines.json"

# ---------------------------------------------------------------------------------------------
# what was created, and what the author must do next
# ---------------------------------------------------------------------------------------------
printf 'new_episode: created the episode %s of the channel %s\n\n' "$EPISODE" "$CHANNEL"
find "$DIR" | LC_ALL=C sort | sed "s|^$LIB/||"
cat <<EOF

Next:
  1. TREATMENT.md — write the treatment before drawing anything (DIRECTOR.md §4): the three
     candidate structures and the one you chose, the logline and the arc, the shot list, the beat
     sheet, the cue map, the sound design table, the subtitle and title design.
  2. research/FACTS.md — one section per claim: the source, the number that goes on screen, the
     limit of what the source says. List the values the film must not show.
  3. voice/lines.json — the script, one idea per line:
       {"id": "<id>", "text": "<what is said>", "voice": "<voice>", "rate": "+0%", "pitch": "+0Hz"}
  4. src/ — the drawings: src/film.js (the page: window.READY, window.render(t), window.DUR,
     window.TEXTS(t)) and src/timeline.js (the order of the lines and the subtitle chunks).
     The channel's rig is imported by relative path — import { cel } from '../../rig/cel.js' —
     and the library by its absolute path — import { clamp } from '/core/lib.js'.
  5. The voice, with the channel's scripts and this episode's paths (run from this folder):
       \$LIB/.venv/bin/python "\$CHANNEL/voice/tts_vi.py" voice/lines.json voice/
  6. sh build.sh — the build ends with the gate: sh core/render/review.sh <this folder>
  7. film.json — measure the runtime from the finished movie and put it in the manifest:
       ffprobe -v error -show_entries format=duration -of csv=p=0 "$MOVIE"
EOF
