#!/bin/sh
# The watchdog of the review round: does it still catch a blocked reviewer, and does it stay quiet when the
# reviewer's transcript merely quotes them? The code under test is cut out of review.sh itself, so this test
# cannot drift away from the thing it checks.
#
# Why it matters: the watchdog used to look for the bare words "requires approval" anywhere in the reviewer's
# transcript. review.sh itself said those words out loud, so a reviewer that read the harness — it happens the
# moment the reviewer is unsure where it is — carried them in its transcript, the watchdog fired on a live
# reviewer, and the round died with a diagnosis that was about nothing (tap-05, 15:30). A false positive here
# costs a whole review round, so the test keeps both halves: a real denial must be caught, a quoted phrase must
# not.
#
#   sh channels/tram-nghi-nhieu/tools/watchdog_selftest.sh
LIB=$(cd "$(dirname "$0")/../../.." && pwd)
WORK=$(mktemp -d)
export HOME="$WORK/home"
mkdir -p "$HOME/.claude/projects/-tmp-work"
TDIR="$HOME/.claude/projects/-tmp-work"
sed -n '/# The watchdog must not be fooled/,/^  }$/p' "$LIB/channels/tram-nghi-nhieu/tools/review.sh" > "$WORK/watchdog.sh"
if [ ! -s "$WORK/watchdog.sh" ]; then
  echo "FAIL  không tìm thấy mã của watchdog trong review.sh — review.sh đã đổi, cần sửa tệp kiểm này theo"
  rm -rf "$WORK"; exit 1
fi
. "$WORK/watchdog.sh"
cd "$WORK"; echo "câu trả lời của người chấm" > out.txt
fail=0

# A — the reviewer opened a file that happens to contain the words (the harness, a doc, a stale copy of
# review.sh). The words sit far from the head of the content: the watchdog must stay quiet (tap-05, 15:30).
python3 - "$TDIR/a.jsonl" <<'PY'
import json, sys
body = ("1\t#!/bin/sh\n2\t# The reviewer runs with its permission checks OFF ... every command comes back\n"
        "3\t# \"This command requires approval\", and the reviewer retries the same command.\n")
open(sys.argv[1], "w").write(json.dumps({"type": "user", "message": {"content": [
    {"type": "tool_result", "content": body}]}}) + "\n")
PY
if denied; then echo "FAIL  văn bản của chính công cụ kích hoạt watchdog (tập 05, 15:30)"; fail=1
else echo "ok    văn bản của chính công cụ không kích hoạt watchdog"; fi

# B — a real denial, at the head of a tool result: the watchdog must fire.
python3 - "$TDIR/b.jsonl" <<'PY'
import json, sys
open(sys.argv[1], "w").write(json.dumps({"type": "user", "message": {"content": [
    {"type": "tool_result", "content": "This command requires approval"}]}}) + "\n")
PY
if denied; then echo "ok    lệnh bị chặn thật thì watchdog kích hoạt"; else echo "FAIL  lệnh bị chặn thật mà watchdog không thấy"; fail=1; fi

# C — the other real wording, at the head of a tool result.
python3 - "$TDIR/c.jsonl" <<'PY'
import json, sys
open(sys.argv[1], "w").write(json.dumps({"type": "user", "message": {"content": [
    {"type": "tool_result", "content": "The Bash command contains multiple operations. "
     "The following part requires approval: python3 -c 'x'"}]}}) + "\n")
PY
if denied; then echo "ok    lệnh bị chặn (cách viết thứ hai) thì watchdog kích hoạt"; else echo "FAIL  cách viết thứ hai mà watchdog không thấy"; fail=1; fi

# D — the denial lands in the reviewer's stdout instead of the transcript.
rm -f "$TDIR"/*.jsonl
printf '%s\n' 'Error: This command requires approval' > out.txt
if denied; then echo "ok    lệnh bị chặn thật trong out.txt thì watchdog kích hoạt"; else echo "FAIL  lệnh bị chặn trong out.txt mà watchdog không thấy"; fail=1; fi

rm -rf "$WORK"
if [ "$fail" = 0 ]; then echo "watchdog_selftest: 4/4 ok"; exit 0; fi
echo "watchdog_selftest: có ca hỏng"; exit 1
