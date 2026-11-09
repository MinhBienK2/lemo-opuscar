#!/bin/sh
# Independent review: a fresh model session that never sees the code or the maker's notes judges one part of an
# episode and writes, line by line, what to fix. Every run exits 0 on PASS, 1 on FAIL, 2 when it cannot run.
#
#   sh channels/tram-nghi-nhieu/review.sh <episode> --outline                 TREATMENT.md + FACTS.md, before any line
#   sh channels/tram-nghi-nhieu/review.sh <episode> --script [--chapter n]    voice/lines.json, before any voice
#   sh channels/tram-nghi-nhieu/review.sh <episode> --props                   every object of src/props.js, alone
#   sh channels/tram-nghi-nhieu/review.sh <episode> --storyboard              the framing of the film, before it is built
#   sh channels/tram-nghi-nhieu/review.sh <episode> --assets                  the documents against the code they describe
#   sh channels/tram-nghi-nhieu/review.sh <episode> --lines a-b               one scene just built (no stamp)
#   sh channels/tram-nghi-nhieu/review.sh <episode> [--chapter n]             the picture of a chapter / of the film
#   sh channels/tram-nghi-nhieu/review.sh <episode> --video [--chapter n]     after the render: four frames per line
#   sh channels/tram-nghi-nhieu/review.sh <episode> --final                   the final QA of the finished mp4
#
# The judges' rules live directly in the skill: .agents/skills/tram-nghi-nhieu/step*/PROMPT_CRITIC.md
# The reports go to <episode>/review/:
#   OUTLINE-REVIEW[-n].md, SCRIPT-REVIEW[-<ch>]-n.md, PROPS-REVIEW-n.md, ASSET-AUDIT-REVIEW-n.md,
#   REVIEW[-<ch>|-lines-a-b][-video]-n.md,
# A PASS of --outline, --script, --props, --storyboard, --assets, of a chapter or of the whole film stamps what was
# judged (gate.py); the voice (tts_vi.py), the mix (mix.py) and the render (core/render/video.mjs) refuse an episode
# whose stamps do not hold.
# An episode with src/chapters.js is judged chapter by chapter: --script --chapter n and --chapter n.
#
# Rounds: the outline 4, the words 6 (per chapter), the props 5, the storyboard 5, the cross-check of the documents 5,
# a scene 3, a chapter or the whole film 5. When the rounds are used
# up the episode needs the user, not another round: the script says so and exits 1.
#
# A machine flag (script: DIGIT LONG NOFACTS; picture: DARK SAME RUN NUM) fails its line unless the reviewer cleared it
# in the report with "CỜ SAI <FLAG>: <why>" (LONG and the picture flags only: a digit or a missing FACTS.md is never
# wrong). The maker cannot clear a flag.
#
# The reviewer: LEMO_CRITIC_CLI=claude|omp (default: claude), LEMO_CRITIC_MODEL for the
# model (default: that tool's own default model). Who judged is signed under every
# report and written into the stamp.
set -e

# The verdict line of a report. The critic may write it plain ("VERDICT: PASS") or in bold
# ("**VERDICT: PASS**"), with or without a heading mark in front — and a report whose verdict the tool
# cannot read is a round thrown away, not a verdict about the film.
VPASS='^#*[[:space:]]*[*_]{0,2}VERDICT: *[*_]{0,2} *PASS'
HERE=$(cd "$(dirname "$0")" && pwd)
CHANNEL=$(cd "$HERE" && while [ ! -f "CHANNEL.md" ] && [ "$PWD" != "/" ]; do cd ..; done; pwd)
LIB=$(cd "$HERE" && while [ ! -f "AGENTS.md" ] && [ "$PWD" != "/" ]; do cd ..; done; pwd)
GATE="python3 $CHANNEL/tools/gate.py"
die() { echo "review: $*" >&2; exit 2; }

# What a round cost in images. The reviewer runs in its own process, with its own transcript; that transcript
# says how many single frames it opened. A round that opens every frame of the film pays for pictures it does
# not look at twice — and the number is worth seeing, because it is the round's biggest cost.
critic_images() {
  d="$HOME/.claude/projects/$(printf "%s" "$1" | sed "s|/|-|g")"
  [ -d "$d" ] || return 0
  f=$(ls -t "$d"/*.jsonl 2>/dev/null | head -1)
  [ -n "$f" ] || return 0
  n=$(grep -oE '"file_path":"[^"]*/b_[0-9]{3}\.jpg"' "$f" 2>/dev/null | wc -l | tr -d ' ')
  u=$(grep -oE '"file_path":"[^"]*/b_[0-9]{3}\.jpg"' "$f" 2>/dev/null | sort -u | wc -l | tr -d ' ')
  [ -n "$n" ] && echo "$n lần đọc ảnh riêng ($u ảnh khác nhau)"
}
EP=$1; [ -n "$EP" ] && [ -d "$EP" ] || die "usage: review.sh <episode> [--outline | --script | --props | --storyboard | --assets | --final | --lines a-b | --chapter n] [--video]"
EP=$(cd "$EP" && pwd); shift
LINES=""; VIDEO=0; SCRIPT=0; PROPS=0; OUTLINE=0; STORYBOARD=0; ASSETS=0; FINAL=0; CHAPTER=""
while [ $# -gt 0 ]; do
  case "$1" in
    --lines) LINES=$2; shift 2 ;;
    --chapter|--scene) CHAPTER=$2; shift 2 ;;
    --video) VIDEO=1; shift ;;
    --script) SCRIPT=1; shift ;;
    --props) PROPS=1; shift ;;
    --outline) OUTLINE=1; shift ;;
    --storyboard) STORYBOARD=1; shift ;;
    --assets) ASSETS=1; shift ;;
    --final) FINAL=1; shift ;;
    *) die "unknown: $1" ;;
  esac
done

# —— the reviewer ——
[ -n "$LEMO_CRITIC" ] && die "LEMO_CRITIC (any command as the reviewer) is gone: choose LEMO_CRITIC_CLI=claude and LEMO_CRITIC_MODEL"
if [ "$LEMO_CRITIC_CLI" = "omp" ]; then
  echo "review: LEMO_CRITIC_CLI=omp is disabled by project policy; falling back to claude (unsetting non-claude model override)" >&2
  CLI="claude"
  unset LEMO_CRITIC_MODEL
else
  CLI=${LEMO_CRITIC_CLI:-claude}
fi
command -v "$CLI" >/dev/null || die "the reviewer '$CLI' is not installed"
CRITIC_ID="$CLI -p ${LEMO_CRITIC_MODEL:+--model $LEMO_CRITIC_MODEL}"; [ -n "$LEMO_CRITIC_MODEL" ] || CRITIC_ID="$CRITIC_ID(model mặc định của $CLI)"
# The clock must fit the work. A reviewer that opens 23 images cannot finish in the time one that reads three
# texts needs: the props round of tap-02 was killed by the clock at exactly 3600 s — an hour of a review that was
# nearly done, and its verdict was lost with it. So the default grows with the number of images the round has to
# open; a CRITIC_TIMEOUT given by hand still wins.
CRITIC_TIMEOUT_SET=${CRITIC_TIMEOUT:+1}
CRITIC_TIMEOUT=${CRITIC_TIMEOUT:-3600}   # how long the reviewer may think; a hung reviewer ends the round, it does not eat it
# The clock must fit the work, for the rounds that read a whole film as well: a reviewer that opens four frames
# per line of a sixty-line film is a two-hour job, and a one-hour clock kills it half-way (N118 — the props round
# of tap-02 died at exactly 3600 s). So the clock grows with the number of lines the round has to look at.
scale_clock() {   # $1 = how many lines the round has to see
  [ -n "$CRITIC_TIMEOUT_SET" ] && return 0
  case "${1:-0}" in ''|*[!0-9]*) return 0 ;; esac
  [ "$1" -gt 0 ] || return 0
  CRITIC_TIMEOUT=$((3600 + 120 * $1))
}
lines_of() {   # $1 = "a-b" (a range) or empty (the whole film); prints the number of lines
  if [ -n "$1" ]; then
    a=${1%-*}; b=${1#*-}
    case "$a$b" in ''|*[!0-9]*) echo 0; return ;; esac
    echo $((b - a + 1))
  else
    python3 -c "import json,sys;print(len(json.load(open(sys.argv[1]))))" "$EP/voice/lines.json" 2>/dev/null || echo 0
  fi
}
# The machine must have room for this round. A round that opens 23 images starts a browser for the frames it
# looks at, and the kernel kills a round that asks for more memory than the machine has: tap-03's storyboard
# round was SIGKILLed at 16:27 with the props round running beside it, and an hour of review went with it.
# The kernel does not warn and saves nothing. The rule and its numbers live in ONE place — tools/hook_load.py,
# which blocks the same work at the command line — so the round asks the same question at the moment it opens
# the reviewer, and refuses the same way. One rule, two doors.
room_state() {   # "<STATE>|<detail>|<avail MiB>|<swap %>" — always four fields
  # LEMO_ROOM_STATE is the seam for the test: it lets a selftest say "the box is full" without waiting
  # for the box to be full. It is a test seam, not a way to skip the check on a real round.
  if [ -n "$LEMO_ROOM_STATE" ]; then echo "$LEMO_ROOM_STATE"; return 0; fi
  python3 - "$LIB" <<'PY' 2>/dev/null || echo "OK|?|?"
import sys, os
sys.path.insert(0, os.path.join(sys.argv[1], 'tools'))
import hook_load
avail, swap_used = hook_load.meminfo()
pct = round((swap_used or 0) * 100)
over = hook_load.over_capacity()
if over:
    print('OVER|%s|%s|%s' % (over[1], avail, pct))
else:
    print('OK|-|%s|%s' % (avail, pct))
PY
}

refuse_no_room() {   # says what the machine can take, and stops the round before it costs anything
  # A test runs review.sh with a stub critic, and the result of a test must not depend on how busy the
  # machine happens to be. LEMO_ROOM_CHECK=off is the sanctioned way to run a round without the box check.
  [ "${LEMO_ROOM_CHECK:-on}" = "off" ] && return 0
  ROOM=$(room_state)
  RSTATE=${ROOM%%|*}
  REST=${ROOM#*|}; RDETAIL=${REST%%|*}; REST=${REST#*|}
  RAVAIL=${REST%%|*}; RSWAP=${REST#*|}
  if [ "$RSTATE" = "OVER" ]; then
    echo "review: máy đang quá tải ($RDETAIL) — vòng chấm này không mở được, và một vòng mở trên máy hết chỗ chỉ bị kernel giết (tap-03 mất một giờ vòng storyboard vì thế)." >&2
    echo "review: đợi việc đang chạy xong rồi chạy lại lệnh này (một job nền, để harness báo khi xong) — đừng mở thêm một vòng cùng lúc." >&2
    # Exit 3 is its own word: the round did not open because the box was full. It is not a crash, and the
    # trace must not send the next agent hunting for a crash log that was never written (tap-04, 17:42).
    exit 3
  fi
  [ -n "$ROOM_REPORTED" ] && return 0
  ROOM_REPORTED=1
  echo "review: máy còn $RAVAIL MiB RAM trống, swap đã dùng $RSWAP% — vòng này mở được." >&2
  return 0
}

critic() {   # $1 = the prompt; $2 = "no-verdict" when the reviewer answers with a list, not with a verdict
  VERDICTLESS=${2:-}
  # Every reviewer is told the same three facts: which round this is, where it works, and that everything it
  # needs is here. Without them a reviewer that is unsure starts hunting across the machine — it read the
  # harness, found another episode's review folder, and the round died of it (tap-05, 15:30).
  PROMPT="$1
---
Bối cảnh vòng chấm: ${ROUND_LABEL:-vòng chấm này}. Bạn làm việc trong thư mục $PWD, và mọi thứ bạn cần đều nằm ở đây. Nếu thư mục này không có PREVIOUS.md thì đây là lần chấm đầu của phần này — đừng đi tìm bản chấm cũ ở nơi khác. Đừng đi tìm tệp khác trên máy này (find /, thư mục /tmp khác, thư mục của tập khác): bên ngoài đây không có gì thuộc về vòng chấm này, và bản chấm của tập khác không phải của tập này."
  # The reviewer gets a wall clock. A reviewer that hangs is a round that never ends, and the round limit is
  # eaten by a round that never happened. A killed reviewer is not a verdict about the film: exit 2 says so.
  # The reviewer runs with its permission checks OFF. It works in a folder of its own outside the repository and
  # writes only its own answer there — and a headless run has nobody to answer a permission prompt: every command
  # comes back asking for permission, and the reviewer retries the same command until the wall clock kills it.
  # That is three hours of a round that never happened (N100).
  # No room, no round: the kernel kills a round that asks for more memory than the machine has, and the round
  # leaves nothing behind but a trace. The box is asked here too, at the moment the reviewer is about to start —
  # after the round's own renders, which is where the memory actually goes.
  refuse_no_room
  if command -v timeout >/dev/null 2>&1; then
    timeout -k 30 "$CRITIC_TIMEOUT" "$CLI" -p ${LEMO_CRITIC_MODEL:+--model "$LEMO_CRITIC_MODEL"} --dangerously-skip-permissions "$PROMPT" < /dev/null > out.txt 2>&1 &
  else
    "$CLI" -p ${LEMO_CRITIC_MODEL:+--model "$LEMO_CRITIC_MODEL"} --dangerously-skip-permissions "$PROMPT" < /dev/null > out.txt 2>&1 &
  fi
  CPID=$!
  # The denial is not printed where the watchdog can see it: in `claude -p` the CLI prints only the final
  # answer, and the words live in the session transcript. So the watchdog watches the transcript of the
  # reviewer as well — the folder the CLI files it under is the working folder with its slashes turned into dashes.
  TDIR="$HOME/.claude/projects/$(printf '%s' "$PWD" | sed 's|/|-|g')"
  # The watchdog must not be fooled by what the reviewer merely *read*. A real denial stands at the head of
  # a tool result ("…requires approval…"); a file the reviewer opened — the harness itself, a doc, a copy of
  # review.sh left in /tmp — carries the same words further down, and matching them there kills a live
  # reviewer: the round dies with a diagnosis about nothing (tap-05, 15:30). So the match is anchored at the
  # head of the content, and the file that is hit is named, so a false positive is visible at once.
  DENIED1="This command requires approval"
  DENIED2="The Bash command contains multiple operations"
  DENIED_WHERE=""
  denied() {
    DENIED_WHERE=$(grep -lE "(\"content\"|\"text\"):\s*\"[^\"]{0,40}($DENIED1|$DENIED2)" "$TDIR"/*.jsonl 2>/dev/null | head -1)
    [ -n "$DENIED_WHERE" ] || DENIED_WHERE=$(grep -lE "^(Error: )?($DENIED1|$DENIED2)" out.txt 2>/dev/null | head -1)
    [ -n "$DENIED_WHERE" ]
  }
  # the watchdog: a reviewer that asks for permission has nobody to answer it, and it retries the same command
  # until the clock kills it. The watchdog names that in minutes instead of burning the round in hours.
  ( while kill -0 "$CPID" 2>/dev/null; do
      if denied; then kill -TERM "$CPID" 2>/dev/null; break; fi
      sleep 10
    done ) &
  WPID=$!
  rc=0; wait "$CPID" || rc=$?
  kill "$WPID" 2>/dev/null || true
  if denied; then
    echo "review: người chấm không chạy được lệnh nào (hỏi quyền mà không ai trả lời) — vòng chấm này không có kết quả, đây không phải phán quyết về phim." >&2
    echo "review: dấu vết nằm trong ${DENIED_WHERE:-$TDIR} — nếu đó là bản sao của chính review.sh thì đây chỉ là văn bản của công cụ, chứ không phải lệnh bị chặn; đọc transcript của người chấm trong $TDIR để biết lệnh nào bị chặn, sửa nguyên nhân rồi chạy lại." >&2
    exit 2
  fi
  if [ "$rc" -eq 124 ]; then
    echo "review: người chấm không trả lời trong ${CRITIC_TIMEOUT}s — đây không phải phán quyết về phim. Đọc lý do (out.txt), sửa nguyên nhân rồi chạy lại; CRITIC_TIMEOUT=<giây> nâng đồng hồ." >&2
    exit 2
  fi
  # Hai pha của vòng chấm vật dựng trả lời bằng một DANH SÁCH, không phải bằng một phán quyết: người gọi tên mù
  # gọi tên từng vật mà không bao giờ thấy tên định dựng. Đòi chúng trả lời bằng dòng VERDICT là hỏi một câu mà
  # chúng không được hỏi, nên câu trả lời đúng vẫn bị đọc thành "không có câu trả lời" và vòng chấm chết vì một
  # lý do không liên quan gì tới phim. Với hai pha này, câu trả lời là chính danh sách: tệp người chấm viết ra,
  # hoặc phần nó in ra. Cảnh báo của CLI ('unrecognized_model', 'connectors are disabled') không phải câu trả lời.
  if [ "$VERDICTLESS" = "no-verdict" ]; then
    if [ -z "$(grep -vE 'unrecognized_model|connectors are disabled' out.txt 2>/dev/null | grep -vE '^[[:space:]]*$' | head -1)" ] \
       && [ -z "$(find . -maxdepth 1 -name '*.md' -size +0c -print -quit 2>/dev/null)" ]; then
      echo "review: người gọi tên không trả lời (chỉ có cảnh báo của CLI, không có danh sách nào) — đây không phải kết quả đo tên." >&2
      echo "review: đọc $W/out.txt để biết vì sao, sửa nguyên nhân rồi chạy lại." >&2
      exit 2
    fi
    return 0
  fi
  # A round that comes back with no verdict is not a judgement about the film — it is a reviewer that never
  # answered. Filed as a round it would advance the round number, shrink the budget, and tell the next round
  # that a previous round exists that nobody ever read. The warnings the CLI prints ('unrecognized_model',
  # 'connectors are disabled') are not an answer either: the model may still be working, but a file with
  # nothing in it is not a review.
  if ! grep -qiE 'VERDICT: *[*_]{0,2} *(PASS|REJECT|FAIL|ACCEPTED_FOR_PUBLISH|REJECTED)' out.txt 2>/dev/null \
     && ! grep -qiE 'VERDICT: *[*_]{0,2} *(PASS|REJECT|FAIL|ACCEPTED_FOR_PUBLISH|REJECTED)' ./*.md 2>/dev/null; then
    echo "review: người chấm không trả lời (không có dòng VERDICT nào) — đây không phải phán quyết về phim." >&2
    echo "review: đọc $W/out.txt để biết vì sao (cảnh báo của CLI như 'unrecognized_model' không phải câu trả lời), sửa nguyên nhân rồi chạy lại." >&2
    exit 2
  fi
  return 0
}
get_prompt() {
  _step=$1
  for _p in "$LIB/.agents/skills/tram-nghi-nhieu/$_step/PROMPT_CRITIC.md" \
            "$LIB/.claude/skills/tram-nghi-nhieu/$_step/PROMPT_CRITIC.md" \
            "$HOME/.agents/skills/tram-nghi-nhieu/$_step/PROMPT_CRITIC.md" \
            "$HOME/.claude/skills/tram-nghi-nhieu/$_step/PROMPT_CRITIC.md"; do
    if [ -f "$_p" ]; then cat "$_p"; return 0; fi
  done
  die "cannot find PROMPT_CRITIC.md for $_step"
}
sign() { printf '\n---\nNgười chấm: %s · review.sh %s · %s\n' "$CRITIC_ID" "$1" "$(date '+%Y-%m-%d %H:%M')" >> "$2"; }
# What "the reviewer is at work" means, said once and used everywhere. The reviewer prints its answer only when
# it is done, so its output file stays nearly empty the whole time it thinks. A session that reads that file,
# concludes the reviewer died, and opens a second reviewer on the same episode burns the round budget twice and
# leaves two reports on one file. The wait is the answer.
at_work() { echo "$1 reviewer at work in $W… (trả lời chỉ in ra ở cuối — file vẫn gần như rỗng là bình thường; chờ lệnh này xong, đừng mở vòng chấm thứ hai)" >&2; }
# The round number in a report is the tool's truth, not the reviewer's memory. A reviewer that is not told which
# round it is writes "ROUND: 1/5" every time, and a report that always says round 1 cannot tell a loop from a
# first attempt — nor can a reader who wants to know how much of the round budget is gone.
# The writing is a tool of its own (tools/set_round.py, with its own selftest), so it can be proved rather than
# trusted: a report with no round line, a report whose verdict is not the first line, and a report that guessed
# its round all end up carrying the truth.
set_round() {  # <file> <n> <limit>
  python3 "$CHANNEL/tools/set_round.py" "$@"
}
# next number of a report: next <prefix> → n for <prefix>n.md
next() { n=$(ls "$EP/review" 2>/dev/null | grep -cE "^$1[0-9]+\.md$" || true); echo $((n + 1)); }
# the flags still standing after the reviewer's "CỜ SAI": unflag <review> "<#n:A+B …>" "<flags it may clear>"
# The reviewer releases a machine flag in two shapes, and both are read here:
#   a heading "#17" then a line "CỜ SAI SAME: <why>", or
#   a per-beat bullet "- [c17]: CỜ SAME → CỜ SAI (mức nhẹ): <why>".
# A line that still says the flag is standing ("CÒN Ở", "VẪN CÒN", "CHƯA SỬA") releases nothing, and the
# FLAGS_STATUS summary is not a release: only the per-beat lines are.
unflag() {
  python3 - "$1" "$2" "$3" <<'PY'
import re, sys
text, flagged, may = open(sys.argv[1], encoding='utf-8').read(), sys.argv[2].split(), set(sys.argv[3].split())
NAMES = r'DARK|SAME|RUN|NUM'
cleared, hn, bn = {}, None, None
for ln in text.split('\n'):
    s = ln.strip()
    if s.startswith('## '):
        hn = bn = None; continue
    m = re.match(r'^#(\d+)\b', s)
    if m: hn = int(m.group(1)); continue
    bullet = bool(re.match(r'^(?:[-*]|\d+\.)\s', s))
    m = re.match(r'^(?:[-*]\s*|\d+\.\s*)?\[c(\d+)\]\s*:', s, re.I)
    if m: bn = int(m.group(1))
    if not re.search(r'CỜ\s*SAI', s): continue
    if re.search(r'CÒN\s*Ở|VẪN\s*CÒN|CHƯA\s*SỬA|ĐÃ\s*XỬ\s*LÝ', s, re.I): continue
    n = bn if (bullet and bn is not None) else hn
    if n is None: continue
    names = set()
    m = re.search(r'CỜ\s+(' + NAMES + r')\b[^→\n]{0,40}→\s*CỜ\s*SAI', s, re.I)
    if m: names.add(m.group(1).upper())
    else:
        m = re.search(r'CỜ\s*SAI[^:\n]{0,40}?\b(' + NAMES + r')\b', s, re.I)
        if m: names.add(m.group(1).upper())
    if names: cleared.setdefault(n, set()).update(names)
out = []
for f in flagged:
    k, fl = f.lstrip('#').split(':')
    left = [x for x in fl.split('+') if not (x in may and x in cleared.get(int(k), set()))]
    if left: out.append(f"#{k}:{'+'.join(left)}")
print(' '.join(out))
PY
}

mkdir -p "$EP/review"

# —————— one review of one part at a time ——————
# Two reviewers on one episode write one report: the second overwrites the first, the round is counted twice,
# and the round budget is spent twice. The lock is a directory, because mkdir is the one call that fails when
# the thing is already there. The lock is per part, so a props review and a storyboard review may run side by
# side, but two outline reviews may not. A lock left behind by a killed run is taken over, not obeyed forever.
SCOPE_ID="film"
[ "$OUTLINE" = 1 ] && SCOPE_ID="outline"
[ "$SCRIPT" = 1 ] && SCOPE_ID="script"
[ "$PROPS" = 1 ] && SCOPE_ID="props"
[ "$STORYBOARD" = 1 ] && SCOPE_ID="storyboard"
[ "$ASSETS" = 1 ] && SCOPE_ID="assets"
[ "$FINAL" = 1 ] && SCOPE_ID="final"
[ -n "$LINES" ] && SCOPE_ID="lines-$LINES"
# The chapter is resolved BEFORE the lock, and the lock is named after the chapter's OWN id: the same chapter
# can be asked for by its id ("ch4"), by its number ("4") or by "ch" + the number ("ch4"), and the gate resolves
# all three to one chapter. A lock named after the raw argument gives that one chapter three different locks —
# so two reviewers can sit on the same chapter at once, and the second one's report overwrites the first (tap-04
# had both "chapter-ch4" and "chapter-4" markers in the same episode).
CHID=""
if [ -n "$CHAPTER" ]; then
  R=$($GATE chapter "$EP" "$CHAPTER") || exit 2
  LINES=${R% *}; CHID=${R#* }
  echo "review: chapter $CHID -> lines $LINES" >&2
fi
[ -n "$CHID" ] && SCOPE_ID="chapter-$CHID"
[ "$VIDEO" = 1 ] && SCOPE_ID="$SCOPE_ID-video"
LOCK="$EP/.review-$SCOPE_ID.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  OLDPID=$(cat "$LOCK/pid" 2>/dev/null)
  if [ -n "$OLDPID" ] && kill -0 "$OLDPID" 2>/dev/null; then
    echo "review: đã có một vòng chấm '$SCOPE_ID' đang chạy (pid $OLDPID) trên tập này — đừng mở vòng thứ hai." >&2
    echo "review: hai người chấm một tập là hai bản chấm đè lên nhau, hai vòng bị tính, và hai lần tốn ngân sách. Chờ vòng đang chạy xong rồi đọc bản chấm nó đã ghi vào $EP/review/." >&2
    exit 1
  fi
  rm -rf "$LOCK"; mkdir "$LOCK" || die "cannot take the review lock $LOCK"
fi
# A round started before the lock was renamed still holds the lock under the raw argument's name ("chapter-4"),
# and it is the SAME chapter: it still counts as busy, or two reviewers would sit on one chapter at once. So every
# lock of this chapter is looked at — by id ("ch4"), by number ("4"), by anything the gate resolves to it.
if [ -n "$CHID" ]; then
  for LK in "$EP"/.review-chapter-*.lock; do
    [ -d "$LK" ] || continue
    [ "$LK" = "$LOCK" ] && continue          # this round's own lock
    LPID=$(cat "$LK/pid" 2>/dev/null)
    if [ -z "$LPID" ] || ! kill -0 "$LPID" 2>/dev/null; then rm -rf "$LK"; continue; fi
    LKEY=${LK##*/.review-chapter-}; LKEY=${LKEY%.lock}
    LCH=$($GATE chapter "$EP" "$LKEY" 2>/dev/null | awk '{print $2}')
    [ "$LCH" = "$CHID" ] || continue
    echo "review: đã có một vòng chấm của chương '$CHID' đang chạy (pid $LPID) trên tập này — đừng mở vòng thứ hai." >&2
    echo "review: chờ vòng đang chạy xong rồi đọc bản chấm nó đã ghi vào $EP/review/." >&2
    rm -rf "$LOCK"
    exit 1
  done
fi
echo $$ > "$LOCK/pid"
# ——— thứ tự các vòng: bước sau cần tem của bước trước ———
# Tem của vòng trước là hàng rào của vòng này: vòng chấm vật ràng danh mục vật mà bố cục hình và các lát cắt
# trỏ tới, và bàn giao thì không mở tem nào thiếu. Chạy vòng sau khi thiếu tem trước là vòng sau đang chấm
# thứ chưa ai chấm — và nó phải chạy lại sau, tốn một vòng. Đây là **cảnh báo**, không phải chặn: có lúc
# người làm cần xem bố cục trước khi dựng xong vật.
case "$SCOPE_ID" in
  script) PREV=outline ;;
  props) PREV=script ;;
  storyboard) PREV=props ;;
  assets) PREV=storyboard ;;
  film) PREV=assets ;;
  chapter-*) PREV=assets ;;
  final) PREV=picture ;;
  *) PREV="" ;;
esac
if [ -n "$PREV" ]; then
  PROW=$(python3 "$GATE" status "$EP" 2>/dev/null | grep -E "^$PREV +" | head -1)
  case "$PROW" in
    *"còn hiệu lực"*) ;;
    *) echo "review: cảnh báo — tem '$PREV' của tập này chưa có, hoặc đã hết hiệu lực.${PROW:+ ($PROW)}" >&2
       echo "review: vòng này đang chấm thứ mà '$PREV' chưa chấm; khi bàn giao, '$PREV' là hàng rào — phải chạy lại nó sau." >&2 ;;
  esac
fi
W=$(mktemp -d "${TMPDIR:-/tmp}/lemo-review-XXXXXX")   # outside the repository: the reviewer is not shown the code
# A round that dies must leave a trace. A silent death reads like "nobody has reviewed this yet": the producer
# waits for a verdict that was never written, or opens a second round on top of a half-finished one (N106).
DIED="$EP/review/.round-$SCOPE_ID.died"
RUNNING="$EP/review/.round-$SCOPE_ID.running"
mkdir -p "$EP/review"
rm -f "$DIED"
printf 'bắt đầu %s · pid %s\n' "$(date '+%H:%M:%S')" "$$" > "$RUNNING"
# A round that ends with a verdict is NOT a dead round. The gate used to call every non-zero exit "ĐÃ CHẾT" and
# told the producer "don't open a second round" — but a REJECT is exactly the case where the producer must
# open the next round after fixing. So the marker says which of the two happened: a round that wrote a report
# with a verdict has answered; a round that did not has failed to answer.
trap 'rc=$?; cd /;
  if [ "$rc" -ne 0 ]; then
    V=$(find "$EP/review" -maxdepth 1 -name "*.md" -newer "$RUNNING" 2>/dev/null | head -1)
    if [ -n "$V" ] && grep -qiE "VERDICT:" "$V" 2>/dev/null; then
      printf "vòng chấm có phán quyết (exit %s) lúc %s — không phải chết: đọc %s, sửa theo nó, rồi chạy vòng kế tiếp\n" "$rc" "$(date "+%H:%M:%S")" "${V##*/}" > "$DIED"
    elif [ "$rc" -eq 3 ]; then
      printf "vòng chấm không mở (exit 3) lúc %s — máy hết chỗ để mở vòng chấm, đây không phải chết: đợi việc đang chạy xong rồi chạy lại\n" "$(date "+%H:%M:%S")" > "$DIED"
    else
      printf "vòng chấm chết (exit %s) lúc %s — không có phán quyết: đọc log của job nền rồi chạy lại\n" "$rc" "$(date "+%H:%M:%S")" > "$DIED"
    fi
  fi
  rm -rf "$W" "$LOCK"; rm -f "$RUNNING"' EXIT
# The box is asked BEFORE the round spends anything: a props round renders the images of every object, and
# a round that opens on a machine that is already full gets killed by the kernel with an hour of review
# inside it. Refusing here costs a second; refusing after the renders costs the render too.
refuse_no_room

# ——————————————————————————————————————————— the outline ———————————————————————————————————————————
if [ "$OUTLINE" = 1 ]; then
  [ -f "$EP/TREATMENT.md" ] && [ -f "$EP/research/FACTS.md" ] || die "--outline needs TREATMENT.md and research/FACTS.md"
  # The treatment must be written, not copied. A slot of the template is a `<viết: …>` outside backticks;
  # a mention inside `…` is a mention, not a slot — the template's own first line mentions the slot, and
  # a finished treatment was once turned away for that mention.
  if ! python3 "$CHANNEL/tools/check_treatment.py" "$EP"; then
    echo "review --outline: TREATMENT.md còn chỗ của khuôn chưa viết — điền vào rồi chạy lại." >&2
    exit 1
  fi
  # The research file must be written, not copied. The outline judge reads it and asks whether every claim has
  # a source; a file that is still the template gives the judge nothing to object to, and a file with no
  # source is a film with nothing behind it. The gate says it here, before a review round is spent on it.
  if ! python3 "$CHANNEL/tools/check_research.py" "$EP"; then
    echo "review --outline: research/FACTS.md chưa được viết — còn dòng mẫu, hoặc chưa có mục (claim) nào, hoặc chưa có nguồn nào. Viết lại file rồi chạy lại." >&2
    exit 1
  fi
  n=$(next OUTLINE-REVIEW-)
  ROUND_LABEL="lần chấm thứ $n"
  if [ "$n" -gt 4 ]; then
    echo "review --outline: đã chấm 4 lần mà dàn ý vẫn chưa PASS. Dừng: báo người dùng các lỗi CHẶN còn lại của $EP/review/OUTLINE-REVIEW.md (câu hỏi có cần hẹp lại, đổi định dạng, dữ kiện nào thiếu nguồn) và hỏi hướng đi." >&2; exit 1
  fi
  cp "$EP/TREATMENT.md" "$EP/research/FACTS.md" "$CHANNEL/STRATEGY.md" "$W/"
  p=$((n - 1)); [ -f "$EP/review/OUTLINE-REVIEW-$p.md" ] && cp "$EP/review/OUTLINE-REVIEW-$p.md" "$W/PREVIOUS.md"
  cd "$W"
  PREV=""; [ -f PREVIOUS.md ] && PREV="
Đây là lần chấm thứ $n. PREVIOUS.md là bản chấm lần trước của chính bạn; người làm đã sửa theo nó. Trước tiên xét từng lỗi trong đó: đã sửa chưa, sửa đúng chưa. Đừng đổi ý về điều lần trước bạn đã chấp nhận; mục đích là đưa dàn ý tới PASS."
  at_work "review --outline:"
  critic "$(get_prompt "step1-outline")
$PREV
Thư mục làm việc của bạn: $W. Đọc FILM-FACTS.md (những điều máy đo được về phim — độ dài, âm lượng, chỗ im lặng, sự kiện), GATE.md (trạng thái từng tem), FACTS.md, TREATMENT.md, lines.json, và COVERAGE.txt (bạn đã xem được câu nào của phim), rồi mở từng tờ 'sheet_N.jpg' — mỗi tờ là mười hai khung hình **trích từ phim đã dựng**; ô trên khung ghi **mã câu** (c12 là câu 12 của lời kể) nếu COVERAGE.txt nói vậy, và số giây nếu không. Câu nào cần soi kỹ hơn thì mở khung gốc: python3 $LIB/tools/frames_at.py <mp4> <beats.json> <tệp> --lines c17 --cols 1 --w 1200 (beats.json ở review/beatsheet/beats.json hoặc out/beats/beats.json). Trong báo cáo, **nêu mã câu** của mọi lỗi bạn thấy (c27, không phải "khoảng 1:20"), và nói rõ câu nào bạn không soi được. Rồi viết FINAL-QA-REPORT.md ở đó theo mẫu, và in lại nó."
  [ -s OUTLINE-REVIEW.md ] || cp out.txt OUTLINE-REVIEW.md
  set_round OUTLINE-REVIEW.md "$n" 4
  sign "--outline" OUTLINE-REVIEW.md
  cp OUTLINE-REVIEW.md "$EP/review/OUTLINE-REVIEW-$n.md"; cp OUTLINE-REVIEW.md "$EP/review/OUTLINE-REVIEW.md"
  cat OUTLINE-REVIEW.md
  if grep -qE "$VPASS" OUTLINE-REVIEW.md; then
    $GATE stamp "$EP" outline "$EP/review/OUTLINE-REVIEW-$n.md" --critic "$CRITIC_ID"; echo "review --outline: PASS"; exit 0
  fi
  echo "review --outline: FAIL (sửa TREATMENT.md và FACTS.md theo $EP/review/OUTLINE-REVIEW.md, rồi chạy lại)"; exit 1
fi

# ——————————————————————————————————————————— the props ———————————————————————————————————————————
if [ "$PROPS" = 1 ]; then
  echo "review --props: three views of every object…" >&2
  # The director's cut ends the step: a written scope of what was cut, ending in VERDICT: PASS, stands for the
  # props. The stamp binds it to src/props.js by its hash, so a cut written for older code cannot pass newer code.
  CUT="$EP/review/PROPS-DIRECTORS-CUT.md"
  if [ -f "$CUT" ] && grep -qE "$VPASS" "$CUT"; then
    if ! python3 "$CHANNEL/tools/gate.py" cut "$EP" props "$CUT" >&2; then
      echo "review --props: bản cắt không còn nói về code hiện tại — viết lại bản cắt sau khi sửa code xong rồi chạy lại" >&2
      exit 1
    fi
    # The numbers in the cut must still point at the same props: a prop inserted into the catalogue moves
    # every later one, and a number that means something else is worse than no number (N130).
    if ! python3 "$CHANNEL/tools/check_props_refs.py" "$EP" >&2; then
      echo "review --props: bản cắt đang trỏ vào vật khác — số trong bản cắt phải là số của danh mục src/props.js hôm nay" >&2
      exit 1
    fi
    $GATE stamp "$EP" props "$CUT" --critic "$CRITIC_ID"
    echo "review --props: PASS (đạo diễn cắt: $CUT)"; exit 0
  fi
  n=$(next PROPS-REVIEW-)
  if [ "$n" -gt 5 ]; then
    echo "review --props: đã chấm 5 lần mà vật dựng vẫn chưa PASS. Dừng: hoặc báo người dùng các lỗi CHẶN còn lại của $EP/review/PROPS-REVIEW.md — vật nào nhóm A chưa đúng tên, vật nào nhóm B còn đọc thành vật thật khác — và hỏi hướng đi (bỏ vật đó khỏi danh sách, đổi cách dựng, hay hạ tiêu chuẩn nhóm B); hoặc chốt bằng đạo diễn cắt: viết $EP/review/PROPS-DIRECTORS-CUT.md, kết thúc bằng 'VERDICT: PASS' và nêu rõ vật nào cắt, rồi chạy lại. Đừng chấm lần thứ sáu." >&2; exit 1
  fi
  # The three views of every object. The renderer can be swapped, so the whole round can be run by a test
  # without a GPU, without a browser and without spending a reviewer's time.
  (cd "$LIB" && ${PROPCHECK:-node channels/tram-nghi-nhieu/propcheck.mjs} "$EP" --out "$W/p" >/dev/null) || exit 2
  mkdir -p "$W/blind"; cp "$W"/p/p_*.jpg "$W/blind/"
  N=$(ls "$W"/blind | wc -l)
  # The blind namer opens every one of these images, one by one. The clock grows with them: 180 s per image on
  # top of the hour, so a round of 23 objects is not killed half-way through its own work.
  [ -n "$CRITIC_TIMEOUT_SET" ] || CRITIC_TIMEOUT=$((3600 + 180 * N))
  # 1. blind: this session never sees the names
  cd "$W/blind"
  critic "Trong thư mục này có $N ảnh p_01.jpg … Mỗi ảnh là MỘT vật dựng 3D kiểu hoạt hình, nhìn từ ba phía (chéo, ngang, trên xuống), đặt trên nền trơn. Mở 4 ảnh cùng lúc (một lượt, bốn ảnh), rồi đọc từng ảnh một. Với mỗi ảnh, nói nó là vật gì như một người xem bình thường sẽ gọi: một cụm danh từ tiếng Việt cụ thể (\"quả chuối chín\", \"con chip máy tính\", \"cục pin điện thoại bị cắt đôi\"), cả trạng thái nếu thấy (xanh/chín, nguyên/cắt đôi). Đừng đoán theo một câu chuyện nào. Nếu không chắc, viết KHÔNG RÕ và nói nó giống những gì. Viết BLIND.md ở đây, mỗi ảnh một dòng:
#n (p_NN.jpg) TÊN: <tên> | CHẮC: cao|vừa|thấp | THẤY: <những chi tiết làm bạn gọi tên như vậy; chi tiết nào lạ>
Ghi tên file ảnh vào đầu dòng — tên file là sự thật, số bạn tự đánh thì không. Một ảnh, một dòng: đừng bỏ ảnh nào.
rồi in lại nó." no-verdict
  [ -s BLIND.md ] || cp out.txt BLIND.md
  cd "$W"; cp blind/BLIND.md .
  # 1b. a second blind namer for the objects the first namer was unsure about: "chắc thấp" and "KHÔNG RÕ" are
  # the measure of one person's doubt, not a verdict, and one guess is not a measurement. This namer sees the same
  # images and no name of anyone, so the two guesses can be compared.
  UNSURE=$(python3 - "$W/blind/BLIND.md" <<'PY'
import re, sys
out = []
for line in open(sys.argv[1], encoding='utf-8', errors='replace'):
    m = re.match(r'\s*#(\d+)\b', line)
    if not m:
        continue
    low = line.lower()
    if 'không rõ' in low or re.search(r'chắc\s*:\s*thấp', low):
        out.append(m.group(1))
print(' '.join(out))
PY
)
  mkdir -p "$W/blind2"
  for n in $UNSURE; do
    # "09" là số có số 0 ở đầu: printf hiểu nó là bát phân và báo lỗi, nên bỏ số 0 trước
    n=$(printf '%s' "$n" | sed 's/^0*//'); [ -n "$n" ] || n=0
    f=$(printf 'p_%02d.jpg' "$n")
    if [ -f "$W/p/$f" ]; then cp "$W/p/$f" "$W/blind2/"; fi
  done
  if [ -n "$(ls "$W/blind2" 2>/dev/null)" ]; then
    M=$(ls "$W/blind2" | wc -l)
    [ -n "$CRITIC_TIMEOUT_SET" ] || CRITIC_TIMEOUT=$((3600 + 180 * M))
    # Lần đoán thứ hai là phép đo BỔ SUNG: nếu nó không trả lời, vòng này đi tiếp với một lần đoán và nói rõ là thiếu —
    # đoán mù là phép đo của một người, lần đoán thứ hai là phép đo của một người khác; mất lần thứ hai thì mất
    # phép đo của người khác, nhưng không được để một phép đo phụ giết vòng chấm của cả vật dựng.
    if ! (cd "$W/blind2" && critic "Trong thư mục này có $M ảnh: $(ls "$W/blind2" | tr '\n' ' '). Mỗi ảnh là MỘT vật dựng 3D kiểu hoạt hình, nhìn từ ba phía (chéo, ngang, trên xuống), đặt trên nền trơn. Mở 4 ảnh cùng lúc (một lượt, bốn ảnh), rồi đọc từng ảnh một. Hãy gọi tên từng vật như một người xem bình thường sẽ gọi: một cụm danh từ tiếng Việt cụ thể, có cả trạng thái nếu thấy. Đừng đoán theo một câu chuyện nào. Đây là lần đoán thứ hai, độc lập: không ai cho bạn xem lần đoán trước. Nếu không chắc, viết KHÔNG RÕ và nói nó giống những gì. Viết BLIND2.md ở đây, mỗi ảnh một dòng:
#n (p_NN.jpg) TÊN: <tên> | CHẮC: cao|vừa|thấp | THẤY: <những chi tiết làm bạn gọi tên như vậy>
Ghi tên file ảnh vào đầu dòng — tên file là sự thật, số bạn tự đánh thì không. Một ảnh, một dòng: đừng bỏ ảnh nào.
rồi in lại nó." no-verdict); then
      echo "review --props: lần đoán thứ hai không trả lời — vòng này đi tiếp với một lần đoán; số đoán thứ hai là của người khác sẽ thiếu." >&2
    fi
    if [ -s "$W/blind2/BLIND2.md" ]; then cp "$W/blind2/BLIND2.md" "$W/BLIND2.md"; fi
  fi
  python3 -c "
import json; P=json.load(open('p/props.json'))
open('NAMES.md','w').write('\n'.join(f\"#{x['n']} {x['name']}  (p/p_{x['n']:02d}.jpg)\" for x in P)+'\n')"
  # 2. judge: the blind names against the intended ones
  # The judge opens every object's image too, so its clock is the big one again.
  [ -n "$CRITIC_TIMEOUT_SET" ] || CRITIC_TIMEOUT=$((3600 + 180 * N))
  critic "Bạn kiểm tra vật dựng cho kênh Trạm Nghĩ Nhiều, nơi mọi vật có thật phải dựng đúng là nó, nhìn một giây là biết (trực thăng ra trực thăng có cánh quạt, đuôi, càng; không bao giờ là một cái hộp thay cho nó). Một người xem khác, không biết vật định dựng là gì, đã gọi tên từng vật trong BLIND.md. BLIND2.md (nếu có) là lần đoán thứ hai, của một người khác, chỉ với những vật mà lần đoán đầu không chắc. NAMES.md là tên người làm định dựng. Ảnh ở p/. Số trong BLIND.md là người đoán mù tự đánh và có thể lệch với file ảnh (đã có vòng đánh số hoán đổi và thiếu mục): hãy mở đúng ảnh p_NN.jpg theo NAMES.md rồi tự nhìn.
Với từng vật: mở ảnh của nó, TỰ GỌI TÊN bằng mắt mình, rồi mới phán. Tên trong BLIND.md và BLIND2.md là lần đoán của người khác, và họ cũng có thể sai. ĐỘ CHẮC KHÔNG PHẢI LÀ PHÁN QUYẾT: một tên đúng nhưng \"chắc thấp\" vẫn là KHỚP, một tên sai nhưng \"chắc cao\" vẫn là HỎNG. Hai lần đoán lệch nhau thì ghi rõ lệch, và vật đó KHÔNG THỂ HỎNG CHỈ VÌ TÊN — nó HỎNG khi ảnh cho thấy vật khác.
KHỚP khi ảnh tự nó nói ra vật thật đó: danh từ chính là đúng vật đó (từ đồng nghĩa được), trạng thái đúng (xanh/chín, nguyên/cắt đôi, chất liệu như thuỷ tinh/nhựa/kim loại), tỉ lệ và bộ phận đặc trưng đúng. HỎNG khi: ảnh cho thấy một vật gần giống (bát thành đĩa, thuỷ tinh thành nhựa, chuối lốm đốm thành chuối chín), vật định dựng chỉ là một phần trong tên của vật khác (\"ống vàng có găng tay\" cho một bàn tay), hoặc ảnh không cho biết đó là vật gì sau một giây nhìn. Đừng nương tay: người xem phim chỉ có một giây. Riêng linh kiện kỹ thuật mà người thường không biết tên (thanh lưỡng kim, tiếp điểm công tắc, rơ-le, mâm nhiệt): KHỚP khi người xem tả đúng hình thật làm nên nó (hai lớp kim loại khác màu dán vào nhau; hai lá kim loại có đầu tiếp xúc bạc, nối dây điện; đĩa kim loại có dây điện trở) và không gọi nó thành một vật thường khác (kẹp quần áo, bản lề, bếp ga): đó là HỎNG. Mở ảnh của vật hỏng, chỉ ra vì sao nó bị gọi sai (thiếu bộ phận đặc trưng nào, tỉ lệ sai, màu hay chất liệu sai, trông như vật nào khác), và cách sửa bằng hình: thêm bộ phận gì, đổi hình dáng gì, chất liệu gì. Cả vật khớp cũng ghi chỗ còn thô (khối trơn, thiếu chi tiết bề mặt) nếu có.
Bốn nhóm, xếp theo CHÍNH CÁI TÊN trong NAMES.md — mỗi vật in ra nhóm của nó cùng lý do, không xếp sau:
A. VẬT ĐỨNG RIÊNG — người xem nhìn một mình vật đó cũng gọi được tên nó (giàn phơi, kẹp gỗ, áo phông, quần, khăn tắm, bồn chậu, quạt, túi, cân, nhiệt kế, ẩm kế, ghế, bàn). Nhóm này KHỚP khi ảnh tự nó đúng vật; HỎNG khi ảnh cho thấy vật khác, hoặc khi ảnh không cho biết sau một giây nhìn đó là vật gì — kể cả khi người đoán gọi KHÔNG RÕ (lúc đó bạn tự mở ảnh và tự phán: bạn cũng không gọi được tên thì HỎNG).
B. VẬT LÀ PHẦN HOẶC CƠ CHẾ — cái chỉ đọc được trong phim, không ai gọi tên được khi nó đứng riêng (sợi vải đan, tấm vải dệt, giọt nước đọng trên sợi, mặt nước cận, nửa áo ướt, áo úp, giọt nước rơi từ mép khăn, bàn tay người). Nhóm này chỉ HỎNG khi ảnh CHO THẤY MỘT VẬT THẬT KHÁC — nồi ba chân thay cho quần, lưới thép mắt xích thay cho tấm vải, mannequin gỗ thay cho bàn tay, bình thuỷ tinh thay cho giọt nước. Căn cứ để phán là ảnh bạn tự mở, không phải lời của người đoán mù: khi ảnh đúng là vật mà người xem gọi nhầm tên (một lưới sợi đan đọc thành đống lọ thuỷ tinh, một bàn tay đọc thành bàn chân), dòng đó là KHỚP kèm ghi chú tên mù — vật chỉ HỎNG khi ảnh thật sự thay bằng một vật khác. Tên mù là KHÔNG RÕ, hoặc là một danh từ chung đúng (nước, vải, sợi, tay, áo) thì ảnh vẫn được chấp nhận là vật đó: KHỚP, kèm ghi chỗ còn thô. Đây là luật của kênh: vật có thật phải dựng đúng là nó, không bao giờ là vật khác đứng thay cho nó.
Nhóm A và B cùng lấy ở tên: tên ngắn, danh từ quen thuộc (quần, áo, khăn, bồn, ghế, bàn) là A; tên có câu bổ nghĩa mô tả một mảnh hay một hiện tượng (sợi vải đan cận, giọt nước đọng trên sợi, mặt nước cận có gợn sóng, áo úp: mép dưới úp lên, mảng ẩm nằm trên mặt gấp) là B.
Viết PROPS-REVIEW.md ở thư mục này theo mẫu:
VERDICT: PASS | FAIL      (PASS khi không vật nào HỎNG: nhóm A phải đúng tên, nhóm B không được đọc thành vật thật khác)
#n <tên định dựng> — [A|B] — KHỚP|HỎNG — ảnh cho thấy: <bạn tự mở ảnh và thấy gì> — người xem gọi: <tên mù> (lần 2: <tên mù thứ hai> nếu có)
  → SỬA: <cách sửa bằng hình>
rồi in lại nó."
  # the critic may write the report under the name in its template or the name in the task line;
  # take either, or the round is lost in a file of warnings
  if [ ! -s PROPS-REVIEW.md ] && [ -s PROPS-CODE-REVIEW.md ]; then cp PROPS-CODE-REVIEW.md PROPS-REVIEW.md; fi
  [ -s PROPS-REVIEW.md ] || cp out.txt PROPS-REVIEW.md
  n=$(next PROPS-REVIEW-)
  { cat PROPS-REVIEW.md; printf '\n## Người xem không biết tên đã gọi\n'; cat BLIND.md; } > R.md
  set_round R.md "$n" 5
  sign "--props" R.md
  # The hash of the props code goes into the report: two rounds that judged the same code and disagreed about
  # a prop are the reviewer changing its mind, and the director has to see that (not guess it).
  CODE_SHA=$(python3 -c "import hashlib,sys;print(hashlib.sha1(open(sys.argv[1],'rb').read()).hexdigest())" "$EP/src/props.js" 2>/dev/null || echo "")
  printf '\n<!-- code: %s -->\n' "$CODE_SHA" >> R.md
  python3 - "$EP" "$n" "$CODE_SHA" "$W/R.md" <<'PY' >&2
import os, re, sys
ep, n, sha, cur = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
if n < 2:
    sys.exit(0)
prev = os.path.join(ep, 'review', f'PROPS-REVIEW-{n-1}.md')
if not os.path.isfile(prev):
    sys.exit(0)
# the group letter (A or B) is optional: a round written before the two-tier rubric has no group
VERDICT = re.compile(r'^#(\d+)\s+(.*?)\s+—\s+(?:[AB]\s+—\s+)?(KHỚP|HỎNG)', re.M)


def read(path):
    t = open(path, encoding='utf8', errors='replace').read()
    m = re.search(r'<!-- code: ([0-9a-f]*) -->', t)
    return (m.group(1) if m else None), {int(a): c for a, b, c in VERDICT.findall(t)}


old_sha, old = read(prev)
new_sha, new = read(cur)
if not old_sha or old_sha != new_sha:
    sys.exit(0)      # the code changed between the rounds: a different picture, a different verdict is expected
flips = [(k, old[k][1], new[k][1]) for k in sorted(new) if k in old and old[k][1] != new[k][1]]
if flips:
    print(f"review --props: ⚠ {len(flips)} vật đổi phán quyết giữa vòng {n-1} và vòng {n} MÀ MÃ KHÔNG ĐỔI "
          f"(src/props.js y hệt): " + ", ".join(f"#{k} {a}→{b}" for k, a, b in flips))
    print("  → Người chấm đổi ý trên cùng một bức ảnh. Sửa theo lời chấm vòng này có thể phá vật đang đúng: "
          "hãy nhìn lại ảnh của vật đó (review/props/p_NN.jpg) và tự xác nhận trước khi sửa.")
PY
  cp R.md "$EP/review/PROPS-REVIEW-$n.md"; cp R.md "$EP/review/PROPS-REVIEW.md"
  # The report's numbers must still point at the same props. The catalogue grows as the film is fixed, so a
  # number written two rounds ago can point at a different object today — and the image beside it is the new one.
  if ! python3 "$CHANNEL/tools/check_props_refs.py" "$EP" >&2; then
    echo "review --props: FAIL (các số trong bản chấm không còn trỏ vào vật cũ — sửa lại số trong bản chấm, hoặc dời vật để số không dịch)" >&2
    exit 1
  fi
  # Every prop needs exactly one verdict, and every verdict needs to say what the image shows. A prop
  # nobody judged is a prop that goes into the film unchecked (tap-01: vật #25 không có dòng nào); and a
  # verdict that only repeats the blind namer's words cannot be checked by anyone — two correct props were
  # sent for repair that way (tap-01: lưới sợi đan đọc thành lọ thuỷ tinh, bàn tay đọc thành bàn chân).
  if ! python3 "$CHANNEL/tools/props_report_check.py" "$EP" "$W/R.md" "$W/BLIND.md" "$N" >&2; then
    echo "review --props: FAIL (bản chấm chưa đủ — mỗi vật phải có đúng một dòng phán quyết, và dòng phải nói \"ảnh cho thấy:\" để người đọc kiểm tra được)" >&2
    exit 1
  fi
  mkdir -p "$EP/review/props"; cp p/p_*.jpg "$EP/review/props/"
  cat R.md
  if grep -qE "$VPASS" R.md; then $GATE stamp "$EP" props "$EP/review/PROPS-REVIEW-$n.md" --critic "$CRITIC_ID"; echo "review --props: PASS"; exit 0; fi
  echo "review --props: FAIL (sửa src/props.js theo $EP/review/PROPS-REVIEW.md, ảnh ở $EP/review/props/, rồi chạy lại)"; exit 1
fi

# ——————————————————————————————————————————— the storyboard ———————————————————————————————————————————
# The framing of the film, judged before the film is built. A step with no tool is a step nobody can skip and
# nobody can count: five rounds of a storyboard graded by hand are five rounds nobody signed.
if [ "$STORYBOARD" = 1 ]; then
  [ -f "$EP/LOOK.md" ] || die "--storyboard needs LOOK.md"
  # a label that names a line it does not sit on: a machine catches this in a second, before a round is spent
  LRC=0
  LAB=$(python3 "$CHANNEL/tools/check_labels.py" "$EP" 2>&1) || LRC=$?
  echo "$LAB"
  if [ "$LRC" = 1 ]; then
    echo "review --storyboard: nhãn lệch câu, hoặc nhãn vẽ một con số mà lời kể không nói — sửa src/film.js (nhãn phải nằm ở câu gọi tên nó; mọi con số trên nhãn phải có lời kể đọc) rồi chạy lại" >&2
    exit 1
  fi
  # The storyboard quotes the words of each line. When the words are rewritten, the quotes go stale and the
  # board describes a film that no longer exists — the same mistake as a treatment left behind by a new script.
  # The words are the standard; the board is what has to follow.
  SRC2=0
  STB=$(python3 "$CHANNEL/tools/check_storyboard.py" "$EP" 2>&1) || SRC2=$?
  echo "$STB"
  if [ "$SRC2" = 1 ]; then
    echo "review --storyboard: dàn ý lệch lời kể — sửa LOOK.md cho khớp voice/lines.json (lời kể là chuẩn) rồi chạy lại" >&2
    exit 1
  fi
  # The director's cut ends the step: a written scope of what was cut, ending in VERDICT: PASS, stands for the
  # storyboard. It must be at least as new as the last round it answers, or a cut from an earlier state of the
  # film would pass a later one.
  # The stamp binds the cut to LOOK.md + src/film.js by their hash — but a hash only says what was judged, not
  # what the cut was written about, so the cut itself has to be written after the last change of the code it
  # judges. That is the rule props and picture already have; the storyboard is the third kind, and it had none.
  CUT="$EP/review/STORYBOARD-DIRECTORS-CUT.md"
  if [ -f "$CUT" ] && grep -qE "$VPASS" "$CUT"; then
    if ! python3 "$CHANNEL/tools/gate.py" cut "$EP" storyboard "$CUT" >&2; then
      echo "review --storyboard: bản cắt không còn nói về dàn ý và mã nhát hiện tại — viết lại bản cắt (nêu rõ nhát nào đã cắt) sau khi sửa code xong rồi chạy lại" >&2
      exit 1
    fi
    $GATE stamp "$EP" storyboard "$CUT" --critic "$CRITIC_ID"
    echo "review --storyboard: PASS (đạo diễn cắt: $CUT)"; exit 0
  fi
  n=$(next STORYBOARD-REVIEW-)
  ROUND_LABEL="lần chấm thứ $n"
  if [ "$n" -gt 5 ]; then
    echo "review --storyboard: đã chấm 5 lần mà khung hình vẫn chưa PASS. Dừng: báo người dùng các lỗi CHẶN còn lại của $EP/review/STORYBOARD-REVIEW.md, hoặc chốt bằng đạo diễn cắt (review/STORYBOARD-DIRECTORS-CUT.md, kết thúc bằng 'VERDICT: PASS' và nêu rõ nhát nào đã cắt) rồi chạy lại." >&2; exit 1
  fi
  mkdir -p "$W/hero"
  cp "$EP"/review/hero/*.jpg "$W/hero/" 2>/dev/null || true
  cp "$EP/LOOK.md" "$W/"; [ -f "$EP/src/film.js" ] && cp "$EP/src/film.js" "$W/film.js"
  [ -f "$EP/TREATMENT.md" ] && cp "$EP/TREATMENT.md" "$W/"
  cd "$W"
  critic "$(get_prompt step3-storyboard)
Thư mục làm việc của bạn: $W. Đọc LOOK.md (bảng bố cục, từng nhát, góc máy, lý do máy đứng ở đó), film.js (nếu có: mã dựng khung hình) và TREATMENT.md; mở từng ảnh trong hero/ và soi nó. Chấm đúng những tiêu chí trên, nhớ rằng đây là vòng $n/5 và những gì đã sửa từ vòng trước thì không nêu lại là lỗi.
Viết STORYBOARD-REVIEW.md ở thư mục này theo mẫu, rồi in lại nó."
  [ -s STORYBOARD-REVIEW.md ] || cp out.txt STORYBOARD-REVIEW.md
  { cat STORYBOARD-REVIEW.md; } > R.md
  set_round R.md "$n" 5
  sign "--storyboard" R.md
  cp R.md "$EP/review/STORYBOARD-REVIEW-$n.md"; cp R.md "$EP/review/STORYBOARD-REVIEW.md"
  cat R.md
  if grep -qE "$VPASS" R.md; then $GATE stamp "$EP" storyboard "$EP/review/STORYBOARD-REVIEW-$n.md" --critic "$CRITIC_ID"; echo "review --storyboard: PASS"; exit 0; fi
  echo "review --storyboard: REJECT (sửa theo $EP/review/STORYBOARD-REVIEW.md, rồi chạy lại)"; exit 1
fi

# ————————————————————————————— the cross-check of the documents ————————————————————————————————
# Step 4 used to be a subagent whose report nobody read: five rounds and a 24 kB cross-check landed in a
# file that no tool opened and no stamp counted. A step with no tool is a step nobody can skip and nobody
# can count — so it gets one, with the same rules as the others: the report's verdict is read by the tool,
# the round number is the tool's, the report is signed, and a director's cut stands for the step only when it
# was written after the last change of the code it judges.
if [ "$ASSETS" = 1 ]; then
  [ -f "$EP/COMPONENTS_SPEC.md" ] || die "--assets: $EP/COMPONENTS_SPEC.md not written yet"
  $GATE need "$EP" outline storyboard || { echo "review --assets: soi tài liệu sau khi dàn ý và dàn ý hình đã qua: sh channels/tram-nghi-nhieu/review.sh $EP --outline rồi --storyboard" >&2; exit 1; }
  CUT="$EP/review/ASSET-AUDIT-DIRECTORS-CUT.md"
  if [ -f "$CUT" ] && grep -qE "$VPASS" "$CUT"; then
    if ! python3 "$CHANNEL/tools/gate.py" cut "$EP" assets "$CUT" >&2; then
      echo "review --assets: bản cắt không còn nói về bản đặc tả và mã hiện tại — viết lại bản cắt (nêu rõ mục nào đã cắt) sau khi sửa code xong rồi chạy lại" >&2
      exit 1
    fi
    $GATE stamp "$EP" assets "$CUT" --critic "$CRITIC_ID"
    echo "review --assets: PASS (đạo diễn cắt: $CUT)"; exit 0
  fi
  # the round number is the highest one that exists, not the number of files: a session that deleted an
  # early round must not be told it is on round 1 again
  n=$(ls "$EP/review" 2>/dev/null | grep -oE "^ASSET-AUDIT-REVIEW-[0-9]+\.md$" | grep -oE "[0-9]+" | sort -n | tail -1)
  n=$(( ${n:-0} + 1 ))
  if [ "$n" -gt 5 ]; then
    echo "review --assets: đã chấm 5 lần mà bản đặc tả vẫn chưa khớp mã. Dừng: báo người dùng các lỗi CHẶN còn lại của $EP/review/ASSET-AUDIT-REPORT.md, hoặc chốt bằng đạo diễn cắt (review/ASSET-AUDIT-DIRECTORS-CUT.md, kết thúc bằng 'VERDICT: PASS' và nêu rõ mục nào đã cắt) rồi chạy lại." >&2; exit 1
  fi
  cp "$EP/COMPONENTS_SPEC.md" "$W/"; [ -f "$EP/LOOK.md" ] && cp "$EP/LOOK.md" "$W/"
  [ -f "$EP/voice/lines.json" ] && cp "$EP/voice/lines.json" "$W/"
  mkdir -p "$W/src"; cp "$EP"/src/*.js "$W/src/" 2>/dev/null || true
  p=$((n - 1)); [ -f "$EP/review/ASSET-AUDIT-REVIEW-$p.md" ] && cp "$EP/review/ASSET-AUDIT-REVIEW-$p.md" "$W/PREVIOUS.md"
  cd "$W"
  critic "$(get_prompt step4-component-breakdown)
Thư mục làm việc của bạn: $W. Đọc COMPONENTS_SPEC.md (bản đặc tả), LOOK.md (dàn ý), voice/lines.json và src/*.js của tập. Soi xem bản đặc tả có nói đúng cái mã dựng không: mỗi linh kiện có thật trong mã chứ, mỗi cột \"Xuất hiện ở\" có đúng nhát không, mỗi mô tả và mỗi số đo có đúng hình không. Chấm đúng những tiêu chí trên, nhớ rằng đây là vòng $n/5 và những gì đã sửa từ vòng trước thì không nêu lại là lỗi.
Viết ASSET-AUDIT-REPORT.md ở thư mục này theo mẫu, rồi in lại nó."
  # the reviewer may write the report under the name in its template or the name of the round line; take
  # either, or the round is lost in a file of warnings
  if [ ! -s ASSET-AUDIT-REPORT.md ] && [ -s ASSET-AUDIT-REVIEW.md ]; then cp ASSET-AUDIT-REVIEW.md ASSET-AUDIT-REPORT.md; fi
  [ -s ASSET-AUDIT-REPORT.md ] || cp out.txt ASSET-AUDIT-REPORT.md
  { cat ASSET-AUDIT-REPORT.md; } > R.md
  set_round R.md "$n" 5
  sign "--assets" R.md
  cp R.md "$EP/review/ASSET-AUDIT-REVIEW-$n.md"; cp R.md "$EP/review/ASSET-AUDIT-REPORT.md"
  cat R.md
  if grep -qE "$VPASS" R.md; then $GATE stamp "$EP" assets "$EP/review/ASSET-AUDIT-REVIEW-$n.md" --critic "$CRITIC_ID"; echo "review --assets: PASS"; exit 0; fi
  echo "review --assets: REJECT (sửa theo $EP/review/ASSET-AUDIT-REPORT.md, rồi chạy lại)"; exit 1
fi

# ——————————————————————————————————————————— the words ———————————————————————————————————————————
if [ "$SCRIPT" = 1 ]; then
  [ -f "$EP/voice/lines.json" ] || die "--script: $EP/voice/lines.json not written yet"
  $GATE need "$EP" outline || { echo "review --script: chấm dàn ý trước: sh channels/tram-nghi-nhieu/review.sh $EP --outline" >&2; exit 1; }
  if [ -f "$EP/src/chapters.js" ] && [ -z "$CHID" ]; then
    echo "review --script: tập có src/chapters.js thì chấm lời từng chương (--script --chapter n); chấm cả lời một lần cũng được với tập ngắn, không với tập dài." >&2
  fi
  TAG=${CHID:+$CHID-}
  n=$(next "SCRIPT-REVIEW-$TAG")
  ROUND_LABEL="lần chấm thứ $n${CHID:+ của chương $CHID}"
  if [ "$n" -gt 6 ]; then
    echo "review --script: đã chấm 6 lần ${CHID:+chương $CHID }mà lời vẫn chưa PASS. Dừng: báo người dùng các lỗi CHẶN còn lại của $EP/review/SCRIPT-REVIEW${CHID:+-$CHID}.md và hỏi hướng đi (bỏ ý, đổi câu hỏi, dữ kiện nào cần nguồn). Đừng chấm lần thứ bảy." >&2; exit 1
  fi
  cp "$EP/voice/lines.json" "$CHANNEL/STRATEGY.md" "$W/"; [ -f "$EP/research/FACTS.md" ] && cp "$EP/research/FACTS.md" "$W/"
  p=$((n - 1)); [ -f "$EP/review/SCRIPT-REVIEW-$TAG$p.md" ] && cp "$EP/review/SCRIPT-REVIEW-$TAG$p.md" "$W/PREVIOUS.md"
  [ -f "$EP/review/script-lines-$TAG$p.json" ] && cp "$EP/review/script-lines-$TAG$p.json" "$W/PREVIOUS-lines.json"
  cp "$EP/voice/lines.json" "$EP/review/script-lines-$TAG$n.json"
  python3 "$LIB/tools/check_script.py" "$EP" > "$W/SCRIPT-AUDIT.txt" 2>&1 || true
  # the words the research file forbids: caught before a round is spent, not after
  VRC=0
  VF=$(python3 "$CHANNEL/tools/check_voice_facts.py" "$EP" 2>&1) || VRC=$?
  echo "$VF"
  if [ "$VRC" = 1 ]; then
    echo "review --script: lời kể nói cụm mà file nghiên cứu cấm — sửa voice/lines.json (và TREATMENT.md) theo $EP/research/FACTS.md rồi chạy lại" >&2
    exit 1
  fi
  python3 - "$W" "$EP" "$n" "$LINES" <<'PY'
import json, sys, os, re
W, EP, n, rng = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
L = json.load(open(W + '/lines.json'))
a, b = (map(int, rng.split('-')) if rng else (1, len(L)))
norm = lambda t: re.sub(r'[\s"“”]+', ' ', t).strip().lower()
prev, rew = {}, set()   # text of a line the last review passed -> True; the rewrites it asked for
if os.path.exists(W + '/PREVIOUS.md') and os.path.exists(W + '/PREVIOUS-lines.json'):
    R = open(W + '/PREVIOUS.md').read(); PL = json.load(open(W + '/PREVIOUS-lines.json'))
    ok = {int(m.group(1)): m.group(2) == 'OK' for m in re.finditer(r'^#(\d+)\s+(OK|FAIL)', R, re.M)}
    prev = {norm(x['text']): ok.get(i, False) for i, x in enumerate(PL, 1)}
    rew = {norm(q) for q in re.findall(r'VIẾT LẠI: *"([^"]+)"', R)} | {norm(q) for q in re.findall(r'THÊM SAU #\d+: *"([^"]+)"', R)}
title = json.load(open(EP + '/film.json')).get('title', '') if os.path.exists(EP + '/film.json') else ''
facts = os.path.exists(W + '/FACTS.md')
part = L[a - 1:b]
T = [f"# Chấm kịch bản: {title or '(chưa có tên)'}", '',
     f"Cả tập {len(L)} câu, {sum(len(x['text'].split()) for x in L)} chữ."]
if (a, b) != (1, len(L)):
    T += [f"Lần này chỉ chấm câu {a}–{b} (một chương, {sum(len(x['text'].split()) for x in part)} chữ). lines.json có cả tập: đọc các câu ngoài khoảng để hiểu mạch và để bắt ý lặp lại với chương khác, nhưng chỉ ghi điểm và lỗi cho câu {a}–{b}. Mục F (nhịp, độ dài) xét cho chương này."]
T.append('')
if os.path.exists(W + '/SCRIPT-AUDIT.txt'):
    audit = open(W + '/SCRIPT-AUDIT.txt').read()
    if '[WARNINGS]' in audit or '[ERRORS]' in audit:
        T += ['## Cảnh báo trùng lặp & nhịp điệu từ máy (tools/check_script.py):', audit[:1500], '']
if not facts: T += ['Cờ cả tập: NOFACTS', '']
fl = []
for i, x in enumerate(L, 1):
    if not a <= i <= b: continue
    f = (['DIGIT'] if re.search(r'\d', x['text']) else []) + (['LONG'] if len(x['text'].split()) > 32 else []) + ([] if facts else ['NOFACTS'])
    if f: fl.append(f"#{i}:{'+'.join(f)}")
    k = norm(x['text'])
    st = '' if not prev else ('GIỮ' if prev.get(k) else 'THEO-BẠN' if k in rew else 'CHƯA-SỬA' if k in prev else 'MỚI')
    T.append(f"#{i}  cờ: {' '.join(f) or '—'}{'  lần trước: ' + st if st else ''}  lời: {x['text']}")
if prev:
    T += ['', f"## Đây là lần chấm thứ {n}", '',
          "PREVIOUS.md là bản chấm lần trước của chính bạn. Người viết đã sửa theo nó. Mục đích của lần này là đưa lời tới PASS, không phải chấm một bài mới:",
          "- Trước tiên, với từng lỗi trong PREVIOUS.md: đã sửa chưa, sửa đúng chưa.",
          "- `GIỮ`: câu lần trước bạn cho OK và chữ không đổi. Ghi OK, đừng chấm lại; chỉ được đánh lỗi nếu nó sai dữ kiện (CHẶN nhóm A) hay câu bên cạnh mới đổi làm nó sai.",
          "- `THEO-BẠN`: câu là nguyên văn câu VIẾT LẠI / THÊM SAU bạn đưa lần trước. Đừng đánh lỗi nhóm E, F mới cho nó: bạn đã chọn câu đó. Chỉ đánh lỗi nếu nó sai dữ kiện.",
          "- `CHƯA-SỬA`: lần trước FAIL mà chữ không đổi. `MỚI`: câu mới hay sửa theo cách khác. Hai loại này chấm đầy đủ.",
          "- Một lỗi mới chỉ là CHẶN khi đúng định nghĩa CHẶN. Đừng đổi ý về điều lần trước bạn đã chấp nhận, đừng viết lại câu theo một cách khác chỉ vì cách đó hay hơn."]
    if n >= 4:
        T += ["- Từ lần thứ tư, chỉ lỗi CHẶN giữ lời lại: không còn CHẶN thì lời qua, các lỗi NẶNG, NHẸ còn lại người viết tự sửa theo ghi chú của bạn. Vì thế hãy dùng CHẶN đúng và đủ: dữ kiện sai hay không nguồn, nhân quả sai chiều, câu chỉ dựng được bằng ẩn dụ, thuật ngữ bịa, kết không trả lời câu hỏi."]
open(W + '/TASK.md', 'w').write('\n'.join(T) + '\n')
open(W + '/flags.txt', 'w').write(' '.join(fl))
PY
  cd "$W"
  at_work "review --script:"
  critic "$(get_prompt "step2-script")

$(cat TASK.md)

Thư mục làm việc của bạn: $W. Đọc lines.json, FACTS.md, STRATEGY.md (và PREVIOUS.md nếu có), rồi viết SCRIPT-REVIEW.md ở đó theo mẫu, và in lại nó."
  [ -s SCRIPT-REVIEW.md ] || cp out.txt SCRIPT-REVIEW.md
  FLAGGED=$(unflag SCRIPT-REVIEW.md "$(cat flags.txt)" "LONG")   # a digit or a missing FACTS.md is never wrong
  # from the fourth run only a CHẶN holds the words back
  if [ "$n" -ge 4 ] && [ -z "$FLAGGED" ] && ! grep -qE "$VPASS" SCRIPT-REVIEW.md && ! grep -q '\[CHẶN\]' SCRIPT-REVIEW.md && grep -q '^#[0-9]' SCRIPT-REVIEW.md; then
    sed -i "s/^VERDICT:.*/VERDICT: PASS (lần chấm thứ $n, không còn lỗi CHẶN; sửa nốt các lỗi NẶNG bên dưới theo VIẾT LẠI rồi chạy --script thêm một lần để đóng dấu lời mới)/" SCRIPT-REVIEW.md
  fi
  { cat SCRIPT-REVIEW.md; [ -n "$FLAGGED" ] && printf '\n## Cờ máy chưa sửa (tự động FAIL)\n%s\n' "$FLAGGED"; } > R.md
  set_round R.md "$n" 6
  sign "--script${CHID:+ --chapter $CHID}" R.md
  cp R.md "$EP/review/SCRIPT-REVIEW-$TAG$n.md"; cp R.md "$EP/review/SCRIPT-REVIEW${CHID:+-$CHID}.md"
  cat R.md
  if grep -qE "$VPASS" R.md && [ -z "$FLAGGED" ]; then
    $GATE stamp "$EP" script "$EP/review/SCRIPT-REVIEW-$TAG$n.md" ${CHID:+--chapter "$CHID"} --critic "$CRITIC_ID"
    echo "review --script: PASS${CHID:+ (chương $CHID)}"; exit 0
  fi
  echo "review --script: FAIL (sửa lines.json theo $EP/review/SCRIPT-REVIEW${CHID:+-$CHID}.md, rồi chạy lại)"; exit 1
fi

# ——————————————————————————————————————————— the final QA ———————————————————————————————————————————
# Step 7 used to have no tool: the final QA ran as a subagent whose report nothing read — no round number, no
# signature, nobody asked whether the step passed (N51). Now it is a round like any other, and the machine says
# what the critic cannot: a critic reads images, so it cannot hear whether the film has an audio track, how
# loud it is, or where it falls silent.
if [ "$FINAL" = 1 ]; then
  MP4=$(ls -t "$EP"/*.mp4 2>/dev/null | head -1); [ -n "$MP4" ] || die "--final: chưa có phim .mp4 trong $EP"
  $GATE check "$EP" --for render >/dev/null || { echo "review --final: các tem của bước trước chưa còn hiệu lực — chạy lại bước tương ứng trước" >&2; exit 1; }
  if ! python3 "$CHANNEL/tools/check_delivery.py" "$EP"; then
    echo "review --final: phim chưa giữ được những điều máy kiểm được — sửa theo dòng trên, dựng lại rồi chạy lại" >&2
    exit 1
  fi
  n=$(next "FINAL-QA-REVIEW-")
  # The last door of the same rule: the film is delivered with its props trail, so a broken trail is not a
  # publishing matter — it is a matter of what the film claims about its own objects.
  if ! python3 "$CHANNEL/tools/check_props_refs.py" "$EP" >&2; then
    echo "review --final: các số vật trong bản chấm và bản cắt không còn trỏ vào vật cũ — sửa lại số rồi chạy lại" >&2
    exit 1
  fi
  ROUND_LABEL="lần chấm nghiệm thu thứ $n"
  # The last gate reads the whole film: its clock grows with the number of lines in it.
  scale_clock "$(lines_of "")"
  if [ "$n" -gt 3 ]; then
    echo "review --final: đã nghiệm thu 3 lượt mà phim vẫn chưa được nhận. Dừng: báo người dùng các lỗi còn lại trong $EP/review/FINAL-QA-REPORT.md và hỏi hướng đi." >&2; exit 1
  fi
  mkdir -p "$W/frames"
  python3 - "$W" "$MP4" "$LIB" "$EP" <<'EOF'
import glob, json, os, subprocess, sys
W, mp4, LIB, EP = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]

# How many lines does the film have? The voice script says.
lines = []
lj = os.path.join(EP, 'voice', 'lines.json')
if os.path.isfile(lj):
    try:
        d = json.load(open(lj, encoding='utf8'))
        lines = d if isinstance(d, list) else (d.get('lines') or [])
    except Exception:
        lines = []

# A beats sheet that knows the TIME of each line lets this round see one frame of EVERY line. A sheet
# without timings cannot be cut from the mp4, so it does not count. The QA used to sample the film by time:
# 24 of 60 lines were never seen by the critic that accepted the film (tap-01, 16:31).
timed = []
for p in (os.path.join(EP, 'review', 'beatsheet', 'beats.json'),
          os.path.join(EP, 'out', 'beats', 'beats.json')):
    if not os.path.isfile(p):
        continue
    try:
        d = json.load(open(p, encoding='utf8'))
    except Exception:
        continue
    t = [b for b in d if isinstance(b, dict) and b.get('t0') is not None and b.get('t1') is not None]
    if len(t) > len(timed):
        timed = t

if timed and (not lines or len(timed) >= len(lines)):
    # one frame per line, cut from the rendered film, pasted with the library's sheet tool
    picks = []
    for b in timed:
        t0, t1 = b.get('t0'), b.get('t1')
        t = t0 + 0.6 * ((t1 - t0) if t1 is not None else 1.0)
        name = b.get('id') or ('c%d' % b.get('n', len(picks) + 1))
        f = os.path.join(W, 'frames', str(name) + '.jpg')
        r = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '%.3f' % t, '-i', mp4,
                            '-frames:v', '1', '-vf', 'scale=480:-1', '-q:v', '3', f], check=False)
        if r.returncode == 0 and os.path.isfile(f):
            picks.append(f)
    for k in range(0, len(picks), 12):
        subprocess.run([sys.executable, LIB + '/core/render/sheet.py', f'{W}/sheet_{k // 12 + 1}.jpg']
                       + picks[k:k + 12] + ['--cols', '4'], check=False)
    open(W + '/COVERAGE.txt', 'w').write(
        'Phim có %d câu lời kể. Các tờ sheet_N.jpg có MỘT khung hình cho MỌI câu, cắt từ chính file mp4;\n'
        'ô trên mỗi khung ghi mã câu (c12 = câu 12). Không câu nào bị bỏ sót.\n' % len(lines))
else:
    # no timed sheet: sample the film by time, and say plainly which lines were not shown
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4],
                         capture_output=True, text=True).stdout.strip()
    dur = float(out or 0)
    n = max(12, min(36, int(round(dur / 5))))
    for k in range(n):
        t = dur * (k + 0.5) / n
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{t:.2f}', '-i', mp4,
                        '-frames:v', '1', '-vf', 'scale=480:-1', f'{W}/frames/{k:02d}-{int(t):04d}s.jpg'], check=False)
    files = sorted(glob.glob(W + '/frames/*.jpg'))
    for p in range(0, len(files), 12):
        subprocess.run([sys.executable, LIB + '/core/render/sheet.py', f'{W}/sheet_{p // 12 + 1}.jpg']
                       + files[p:p + 12] + ['--cols', '4'], check=False)
    open(W + '/COVERAGE.txt', 'w').write(
        'Phim có %d câu lời kể, nhưng vòng này chỉ lấy %d khung hình theo thời gian: %d câu KHÔNG có khung nào.\n'
        'Đừng kết luận về những câu bạn không thấy — hãy nói rõ trong báo cáo là chưa soi.\n'
        % (len(lines), n, max(0, len(lines) - n)))
EOF
  cd "$W"
  at_work "review --final:"
  critic "$(get_prompt "step7-delivery")

Thư mục làm việc của bạn: $W. Đọc FILM-FACTS.md (những điều máy đo được về phim — độ dài, âm lượng, chỗ im lặng, sự kiện), GATE.md (trạng thái từng tem), FACTS.md, TREATMENT.md, lines.json, rồi mở từng tờ `sheet_N.jpg` — mỗi tờ là mười hai khung hình **trích từ phim đã dựng**, tên mỗi khung ghi số giây của nó trong phim. Rồi viết FINAL-QA-REPORT.md ở đó theo mẫu, và in lại nó."
  [ -s FINAL-QA-REPORT.md ] || cp out.txt FINAL-QA-REPORT.md
  set_round FINAL-QA-REPORT.md "$n" 3
  sign "--final" FINAL-QA-REPORT.md
  cp FINAL-QA-REPORT.md "$EP/review/FINAL-QA-REVIEW-$n.md"; cp FINAL-QA-REPORT.md "$EP/review/FINAL-QA-REPORT.md"
  cat FINAL-QA-REPORT.md
  # the gate owns the word: it accepts a report only when it really says ACCEPTED_FOR_PUBLISH, and it refuses
  # the template's own line, so a critic that copies the template does not publish a film nobody judged
  if $GATE stamp "$EP" final "$EP/review/FINAL-QA-REVIEW-$n.md" --critic "$CRITIC_ID"; then
    echo "review --final: ACCEPTED_FOR_PUBLISH"; exit 0
  fi
  echo "review --final: REJECTED (sửa theo $EP/review/FINAL-QA-REPORT.md, dựng lại rồi chạy lại)"; exit 1
fi

# ——————————————————————————————————————————— the picture ———————————————————————————————————————————
if [ -f "$EP/src/chapters.js" ] && [ -z "$LINES" ]; then
  die "tập có src/chapters.js: chấm hình từng chương (--chapter n) hay từng cảnh (--lines a-b); cổng mở khi mọi chương PASS"
fi
$GATE need "$EP" outline script props || { echo "review: lời và vật phải PASS trước khi chấm hình (lệnh ở dòng trên)" >&2; exit 1; }
if [ -n "$CHID" ]; then $GATE placeholders "$EP" "$CHID" || exit 1
elif [ -z "$LINES" ]; then $GATE placeholders "$EP" || exit 1; fi
if [ -n "$CHID" ]; then SCOPE="$CHID-"; SCOPE_NAME="một chương"; LIMIT=5
elif [ -n "$LINES" ]; then SCOPE="lines-$LINES-"; SCOPE_NAME="một cảnh"; LIMIT=3
else SCOPE=""; SCOPE_NAME="cả phim"; LIMIT=5; fi
[ "$VIDEO" = 1 ] && SCOPE="${SCOPE}video-"
# The clock fits what this round has to look at: a chapter, a scene, or the whole film.
scale_clock "$(lines_of "$LINES")"
# A long film judged as one picture is judged badly: the critic opens about twenty-five of its sixty frames, the
# round costs forty minutes, and the whole film gets five rounds. The chapter route exists for exactly this, and
# the tool says so before the budget is spent — not after.
if [ -z "$CHID" ] && [ -z "$LINES" ] && [ "$VIDEO" = 0 ] && [ ! -f "$EP/src/chapters.js" ]; then
  NL=$(python3 -c "import json,sys;print(len(json.load(open(sys.argv[1]))))" "$EP/voice/lines.json" 2>/dev/null || echo 0)
  case "$NL" in ''|*[!0-9]*) NL=0;; esac
  if [ "$NL" -gt 30 ]; then
    echo "review: phim dài ($NL câu) mà chưa có src/chapters.js — vòng chấm cả phim soi được khoảng 25 khung, tốn ~40 phút, và có 5 lượt cho cả phim." >&2
    if [ -f "$EP/review/SCRIPT.pass" ]; then
      echo "review: chia chương bây giờ cũng mở lại tem lời (mỗi chương một tem lời riêng) — thường rẻ hơn là chốt bằng đạo diễn cắt." >&2
    else
      echo "review: chia câu thành các chương (src/chapters.js) rồi chấm từng chương (--chapter <id>): mỗi chương có 5 lượt riêng và cổng mở khi mọi chương PASS. Quyết việc này lúc dàn ý thì rẻ hơn nhiều." >&2
    fi
  fi
fi
# The director's cut ends the step: a written scope of what was cut, ending in VERDICT: PASS, stands for the
# picture. The stamp binds it to the film's own files by their hash, so a cut written for an older film cannot
# pass a newer one.
CUT="$EP/review/REVIEW${CHID:+-$CHID}-DIRECTORS-CUT.md"
if [ "$VIDEO" = 0 ] && [ -z "$LINES" ] && [ -f "$CUT" ] && grep -qE "$VPASS" "$CUT"; then
  if ! python3 "$CHANNEL/tools/gate.py" cut "$EP" picture "$CUT" ${CHID:+--chapter "$CHID"} >&2; then
    echo "review: bản cắt không còn nói về code hiện tại — viết lại bản cắt sau khi sửa code xong rồi chạy lại" >&2
    exit 1
  fi
  $GATE stamp "$EP" picture "$CUT" ${CHID:+--chapter "$CHID"} --critic "$CRITIC_ID"
  echo "review: PASS (đạo diễn cắt: $CUT)"; exit 0
fi
n=$(next "REVIEW-$SCOPE")
ROUND_LABEL="lần chấm hình thứ $n"
if [ "$n" -gt "$LIMIT" ]; then
  if [ "$SCOPE_NAME" = "một cảnh" ]; then
    echo "review: cảnh $LINES đã chấm $LIMIT lượt. Ghi vào LOOK.md câu nào còn FAIL và vì sao, rồi dựng cảnh sau; lần chấm chương (hay cả phim) sẽ bắt lại nó." >&2
  else
    echo "review: ${CHID:+chương $CHID}${CHID:-cả phim} đã chấm $LIMIT lượt mà chưa PASS. Dừng: hoặc báo người dùng điểm và các lỗi còn lại của $EP/review/REVIEW.md và hỏi hướng đi; hoặc chốt bằng đạo diễn cắt: viết $CUT, kết thúc bằng 'VERDICT: PASS' và nêu rõ nhát nào đã cắt, rồi chạy lại; hoặc chấm lại đúng những câu đã sửa bằng --lines a-b (3 lượt mỗi cảnh, rẻ hơn một vòng cả phim nhiều lần). Nếu phim dài (>30 câu) mà chưa có src/chapters.js thì chia chương trước rồi chấm --chapter <id> (5 lượt mỗi chương, cổng mở khi mọi chương PASS). Đừng bàn giao như một phim đã đạt." >&2
  fi
  exit 1
fi

mkdir -p "$W/beats" "$W/ref"
# the same machine check as the storyboard gate: a label off its line must not reach the renderer
LRC=0
LAB=$(python3 "$CHANNEL/tools/check_labels.py" "$EP" 2>&1) || LRC=$?
echo "$LAB"
if [ "$LRC" = 1 ]; then
  echo "review: nhãn lệch câu, hoặc nhãn vẽ một con số mà lời kể không nói — sửa src/film.js (nhãn phải nằm ở câu gọi tên nó; mọi con số trên nhãn phải có lời kể đọc) rồi chạy lại" >&2
  exit 1
fi
SRC=0
SH=$(python3 "$CHANNEL/tools/check_shots.py" "$EP" 2>&1) || SRC=$?
echo "$SH"
if [ "$SRC" = 1 ]; then
  echo "review: mỗi câu lời kể phải có đúng một nhát hình, và các nhát phải đi đúng thứ tự của lời — sửa src/film.js rồi chạy lại" >&2
  exit 1
fi
# The catalogue and the film are two lists of the same objects, and nothing checked that they are the same
# list: a prop the critic judged from three views, that never reaches the screen. The picture is the first
# step where the shot code exists, so this is where the two lists can finally be compared.
PU=0
PUS=$(python3 "$CHANNEL/tools/check_props_used.py" "$EP" 2>&1) || PU=$?
echo "$PUS"
if [ "$PU" = 1 ]; then
  echo "review: có vật trong danh mục mà phim không đưa lên màn hình — đưa vật đó lên màn hình, hoặc bỏ nó khỏi danh mục, rồi chạy lại" >&2
  exit 1
fi
echo "review: beat frames…" >&2
REL=$(python3 -c "import os,sys; print(os.path.relpath(sys.argv[1], sys.argv[2]))" "$EP" "$LIB")   # the page server serves the library root
# The beat sheet is sixty rendered frames — the most expensive single step of a review, and the director has
# usually built one already (step 3 of the guide). If nothing in the film changed since that sheet was built, it is
# the same picture: use it, instead of paying for the same sixty frames twice in one round.
NEWEST=$(python3 -c "
import os, sys, glob
ep = sys.argv[1]
files = glob.glob(os.path.join(ep, 'src', '*.js')) + [os.path.join(ep, 'voice', 'lines.json'), os.path.join(ep, 'voice', 'proc', 'dur.json')]
print(max([os.path.getmtime(f) for f in files if os.path.isfile(f)] or [0]))" "$EP")
REUSED=""
if [ -z "$LINES" ]; then
  for CAND in "$EP/out/beats" "$EP/review/beatsheet"; do
    if [ -f "$CAND/beats.json" ] && ls "$CAND"/sheet_*.jpg >/dev/null 2>&1; then
      # A sheet drawn for a range of lines (--lines a-b) leaves the rest of the episode unmeasured. The reviewer of
      # the WHOLE film must not be handed half a film: only a sheet that covers every line can serve this round.
      if ! python3 -c "import json,sys; B=json.load(open(sys.argv[1])); sys.exit(1 if any(b.get('skipped') for b in B) else 0)" "$CAND/beats.json"; then
        echo "review: bỏ qua tờ sheet $CAND — nó chỉ dựng một khoảng câu, không phải cả phim." >&2
        continue
      fi
      if python3 -c "import os,sys; sys.exit(0 if os.path.getmtime(sys.argv[1]) >= float(sys.argv[2]) else 1)" "$CAND/beats.json" "$NEWEST"; then
        REUSED="$CAND"
        break
      fi
    fi
  done
fi
if [ -n "$REUSED" ]; then
  echo "review: dùng lại tờ sheet đã dựng ở $REUSED — không có mã nào đổi sau lần dựng đó." >&2
  cp "$REUSED"/*.jpg "$W/beats/" 2>/dev/null || true
  cp "$REUSED/beats.json" "$W/beats/" 2>/dev/null || true
else
  (cd "$LIB" && node channels/tram-nghi-nhieu/beatsheet.mjs "$REL" --out "$W/beats" ${LINES:+--lines "$LINES"} >/dev/null)
fi
cp "$EP/voice/lines.json" "$W/"; [ -f "$EP/research/FACTS.md" ] && cp "$EP/research/FACTS.md" "$W/"
cp "$W/beats/beats.json" "$W/"
for f in set_kitchen inside_banana flow cutaway_3; do [ -f "$CHANNEL/demo/stills/$f.jpg" ] && cp "$CHANNEL/demo/stills/$f.jpg" "$W/ref/"; done
# what the last round fixed and what is still open. The tool already knows it (check_progress.py compares the two
# last reviews); before this, only the console saw it and the reviewer started every round from zero.
python3 "$CHANNEL/tools/check_progress.py" "$EP" > "$W/PROGRESS.md" 2>/dev/null || true
# the sheets stay: they are how the reviewer reads the whole film at once (a sheet holds twelve frames with their
# line, their flags and their fill, where opening sixty frames one by one costs an hour and a lot of tokens)

MP4=""
if [ "$VIDEO" = 1 ]; then MP4=$(ls -t "$EP"/*.mp4 2>/dev/null | head -1); [ -n "$MP4" ] || die "--video: no mp4 in $EP yet"; fi
python3 - "$W" "$LINES" "$MP4" "$SCOPE_NAME" <<'EOF'
import json, sys, subprocess, os
W, rng, mp4, scope = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
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
rule = ("PASS khi mọi mục ≥ 4, không lỗi CHẶN, không câu FAIL" if scope == 'một cảnh'
        else "chấm như cả phim: PASS khi OVERALL ≥ 9, không lỗi CHẶN, không câu FAIL")
T = [f"# Chấm câu {a}–{b} ({scope}; {rule})", '']
sheets = sorted(x for x in os.listdir(W + '/beats') if x.startswith('sheet_') and x.endswith('.jpg'))
if sheets:
    T.append("## Đọc tờ sheet trước")
    T.append("Mỗi tờ dưới đây chứa nhiều câu: một khung hình mỗi câu, và dưới khung là mã câu, cờ máy, `fill N%` và lời của câu.")
    T.append("Mở hết các tờ này để soi toàn bộ phim — đừng mở từng ảnh riêng, trừ khi một tờ chưa đủ để quyết định.")
    for s in sheets: T.append(f"  beats/{s}")
    T.append('')
if a > 1: T.append(f"Câu {a-1} (chỉ để so, không chấm): beats/b_{a-1:03d}.jpg")
T.append("## Từng câu (ảnh riêng: mở khi tờ sheet chưa đủ)")
for x in pick:
    s = f"#{x['n']}  beats/b_{x['n']:03d}.jpg" + (f"  strips/s_{x['n']:03d}.jpg" if mp4 else '')
    fill = f"{int(x['fill'] * 100)}%" if 'fill' in x else "— (đo chưa có)"
    T.append(s + f"  cờ: {' '.join(x.get('flags') or []) or '—'}  fill {fill}  lời: {x['text']}")
open(W + '/TASK.md', 'w').write('\n'.join(T) + '\n')
open(W + '/flags.txt', 'w').write(' '.join(f"#{x['n']}:{'+'.join(x['flags'])}" for x in pick if x.get('flags')))
EOF

cd "$W"
at_work "review:"
critic "$(get_prompt "step6-assembly")

$(cat TASK.md)

Đây là vòng $n/$LIMIT của phần chấm này. Bạn không cần viết dòng \"ROUND\" — review.sh ghi số vòng thật vào bản chấm sau khi bạn viết xong.
Nếu có PROGRESS.md, hãy đọc nó trước khi chấm: nó nói vòng trước đã sửa được gì và còn mở gì. Câu đã sửa rồi thì đừng nêu lại là lỗi; câu còn mở thì phải soi kỹ và nói rõ đã sửa hay chưa.
Thư mục làm việc của bạn: $W. Mở từng ảnh của các câu trên, rồi viết REVIEW.md ở đó theo mẫu, và in lại nó."
# the critic may write the report under the name in its template (SCENE-REVIEW.md) or the name in the
# task line (REVIEW.md); take either, or the round is lost in a file of warnings
if [ ! -s REVIEW.md ] && [ -s SCENE-REVIEW.md ]; then cp SCENE-REVIEW.md REVIEW.md; fi
[ -s REVIEW.md ] || cp out.txt REVIEW.md
CI=$(critic_images "$W")
[ -n "$CI" ] && echo "review: vòng này tốn $CI" >&2
# the machine flags stand unless the reviewer cleared them with "CỜ SAI <FLAG>: <why>"
FLAGGED=$(unflag REVIEW.md "$(cat flags.txt)" "DARK SAME RUN NUM")
{ cat REVIEW.md; [ -n "$FLAGGED" ] && printf '\n## Cờ máy chưa sửa (tự động FAIL)\n%s\n' "$FLAGGED"; } > R.md
MODE="(cả phim)"; [ -n "$LINES" ] && MODE="--lines $LINES"; [ -n "$CHID" ] && MODE="--chapter $CHID"
[ "$VIDEO" = 1 ] && MODE="$MODE --video"
set_round R.md "$n" "$LIMIT"
sign "$MODE" R.md
cp R.md "$EP/review/REVIEW-$SCOPE$n.md"; cp R.md "$EP/review/REVIEW.md"
# what the last round fixed and what is still open: the next round must not start from zero
python3 "$CHANNEL/tools/check_progress.py" "$EP" 2>/dev/null || true
cat R.md
if grep -qE "$VPASS" R.md && [ -z "$FLAGGED" ]; then
  # only a review of a chapter or of the whole film, before the render, opens the gate
  if [ "$VIDEO" = 0 ] && [ -n "$CHID" ]; then $GATE stamp "$EP" picture "$EP/review/REVIEW-$SCOPE$n.md" --chapter "$CHID" --critic "$CRITIC_ID"
  elif [ "$VIDEO" = 0 ] && [ -z "$LINES" ]; then $GATE stamp "$EP" picture "$EP/review/REVIEW-$SCOPE$n.md" --critic "$CRITIC_ID"; fi
  echo "review: PASS"; exit 0
fi
echo "review: FAIL (sửa theo $EP/review/REVIEW.md, rồi chạy lại)"; exit 1
