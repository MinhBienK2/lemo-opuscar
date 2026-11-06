#!/bin/sh
# Independent review: a fresh model session that sees only the pictures and the words of an episode (never its code,
# never the maker's notes) judges it with CRITIC.md and writes what to fix, line by line.
#   sh channels/tram-nghi-nhieu/review.sh <episode> [--lines 5-8] [--video]
#     --lines a-b  judge only these lines (a scene just built); default: every line
#     --video      also judge the finished film: four frames from the mp4 across each line
# Writes <episode>/review/REVIEW.md (and REVIEW-<n>.md, the history), prints it, exits 0 on PASS and 1 on FAIL.
# A line with a machine flag (DARK SAME RUN NUM) fails even if the reviewer passed it.
# The reviewer: $LEMO_CRITIC if set (a command; the prompt is appended as its last argument, it runs in the review
# folder), else `omp -p` (with --model $LEMO_CRITIC_MODEL if set), else `claude -p`. Use your own model: a new session
# of it is independent enough, and it has your eyes.
set -e
HERE=$(cd "$(dirname "$0")" && pwd); LIB=$(cd "$HERE/../.." && pwd)
EP=$1; [ -n "$EP" ] && [ -d "$EP" ] || { echo "usage: review.sh <episode> [--lines a-b] [--video]" >&2; exit 2; }
EP=$(cd "$EP" && pwd); shift
LINES=""; VIDEO=0
while [ $# -gt 0 ]; do case "$1" in --lines) LINES=$2; shift 2 ;; --video) VIDEO=1; shift ;; *) echo "unknown: $1" >&2; exit 2 ;; esac; done

W=$(mktemp -d "${TMPDIR:-/tmp}/lemo-review-XXXXXX")   # outside the repository: the reviewer cannot wander into the code
trap 'cd /; rm -rf "$W"' EXIT
mkdir -p "$W/beats" "$W/ref"
echo "review: beat frames…" >&2
REL=$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], sys.argv[2]))" "$EP" "$LIB")   # the page server serves the library root
(cd "$LIB" && node channels/tram-nghi-nhieu/beatsheet.mjs "$REL" --out "$W/beats" >/dev/null)
cp "$EP/voice/lines.json" "$W/"; [ -f "$EP/research/FACTS.md" ] && cp "$EP/research/FACTS.md" "$W/"
cp "$W/beats/beats.json" "$W/"
for f in set_kitchen inside_banana flow cutaway_3; do [ -f "$HERE/demo/stills/$f.jpg" ] && cp "$HERE/demo/stills/$f.jpg" "$W/ref/"; done
rm -f "$W/beats/"sheet_*.jpg

MP4=""; [ "$VIDEO" = 1 ] && MP4=$(ls -t "$EP"/*.mp4 2>/dev/null | head -1)
python3 - "$W" "$LINES" "$MP4" <<'EOF'
import json, sys, subprocess, os
W, rng, mp4 = sys.argv[1], sys.argv[2], sys.argv[3]
B = json.load(open(W + '/beats.json'))
a, b = (map(int, rng.split('-')) if rng else (1, len(B)))
pick = [x for x in B if a <= x['n'] <= b]
if mp4:
    os.makedirs(W + '/strips', exist_ok=True)
    for x in pick:
        if x.get('missing'): continue
        t0, t1 = x['t0'], x['t1']; ins = []
        for k in range(4): ins += ['-ss', f"{t0 + (t1 - t0) * (k + .5) / 4:.2f}", '-i', mp4]
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *ins, '-filter_complex',
                        ''.join(f'[{k}:v]scale=480:-1,trim=end_frame=1[v{k}];' for k in range(4)) + ''.join(f'[v{k}]' for k in range(4)) + 'hstack=4',
                        '-frames:v', '1', f"{W}/strips/s_{x['n']:03d}.jpg"], check=False)
T = [f"# Chấm câu {a}–{b}" + (" (cả phim)" if (a, b) == (1, len(B)) else " (một cảnh; câu trước đó chỉ để so)"), '']
if a > 1: T.append(f"Câu {a-1} (chỉ để so, không chấm): beats/b_{a-1:03d}.jpg")
for x in pick:
    s = f"#{x['n']}  beats/b_{x['n']:03d}.jpg" + (f"  strips/s_{x['n']:03d}.jpg" if mp4 else '')
    T.append(s + f"  cờ: {' '.join(x.get('flags') or []) or '—'}  lời: {x['text']}")
open(W + '/TASK.md', 'w').write('\n'.join(T) + '\n')
EOF

PROMPT="$(cat "$HERE/CRITIC.md")

$(cat "$W/TASK.md")

Thư mục làm việc của bạn: $W. Mở từng ảnh của các câu trên, rồi viết REVIEW.md ở đó theo mẫu, và in lại nó."
echo "review: reviewer at work in $W…" >&2
cd "$W"
if [ -n "$LEMO_CRITIC" ]; then sh -c "$LEMO_CRITIC \"\$1\"" _ "$PROMPT" < /dev/null > out.txt 2>&1 || true
elif command -v omp >/dev/null; then omp -p ${LEMO_CRITIC_MODEL:+--model "$LEMO_CRITIC_MODEL"} --cwd "$W" "$PROMPT" < /dev/null > out.txt 2>&1 || true
else claude -p "$PROMPT" < /dev/null > out.txt 2>&1 || true; fi
[ -s REVIEW.md ] || cp out.txt REVIEW.md

# the machine flags stand: a flagged line in range fails the review whatever the verdict says
FLAGGED=$(python3 -c "
import json,sys; B=json.load(open('beats.json')); r='$LINES'
a,b=(map(int,r.split('-')) if r else (1,len(B)))
print(' '.join(f\"#{x['n']}:{'+'.join(x['flags'])}\" for x in B if a<=x['n']<=b and x.get('flags')))")
mkdir -p "$EP/review"; n=$(ls "$EP/review" | grep -c '^REVIEW-' || true); n=$((n + 1))
{ cat REVIEW.md; [ -n "$FLAGGED" ] && printf '\n## Cờ máy chưa sửa (tự động FAIL)\n%s\n' "$FLAGGED"; } > "$EP/review/REVIEW-$n.md"
cp "$EP/review/REVIEW-$n.md" "$EP/review/REVIEW.md"
cat "$EP/review/REVIEW.md"
if grep -q '^VERDICT: *PASS' "$EP/review/REVIEW.md" && [ -z "$FLAGGED" ]; then echo "review: PASS"; exit 0; fi
echo "review: FAIL (sửa theo $EP/review/REVIEW.md, rồi chạy lại)"; exit 1
