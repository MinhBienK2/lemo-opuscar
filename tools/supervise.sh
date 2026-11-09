#!/bin/sh
# Supervise the film session that is running: sh tools/supervise.sh [--dry]
#
# What it does, every time it runs:
#   1. finds the session that is running (the newest transcript of this repository's session folder)
#   2. finds the film under production (the newest film folder with work in it)
#   3. runs the mechanical gate on that film: filmcheck, drawcheck, the citation check
#   4. asks a reviewer model to judge the session's work against the library's rules, with the gate's
#      output and the session's own tool log as the evidence
#   5. appends one entry to improvements/supervision/<date>.md — the findings and, for each one,
#      the guard it needs. The entry names what the supervisor could not see.
#
# The supervisor never edits the film, never commits and never touches the running session: it reports.
# It never leaves a background process behind: every run ends in this script.
#
# Environment:
#   SUPERVISE_LLM=always|on-fail|never   when the reviewer model runs (default: always)
#   SUPERVISE_MODEL=<model>              the reviewer model (default: 2tocom/MiniMax-M3.1-Flash:medium)
#   SUPERVISE_SESSION=<path>             a transcript to supervise instead of the newest one
#   SUPERVISE_LLM=never                  mechanical checks only
set -e
LIB=$(cd "$(dirname "$0")/.." && pwd)
OMP=${OMP:-$HOME/.local/bin/omp}
# cron gives a bare PATH, so the tools the gate needs are looked up here: node lives in the nvm
# directory, and the script is useless without it.
NODE=$(command -v node || true)
[ -n "$NODE" ] || for n in "$HOME"/.nvm/versions/node/*/bin/node; do [ -x "$n" ] && NODE="$n" && break; done
[ -n "$NODE" ] || { echo "supervise: no node on PATH — the gate cannot run" >&2; exit 1; }
PY=$(command -v python3 || true)
[ -n "$PY" ] || PY=python3
SLUG=$(printf '%s' "$LIB" | sed "s|^$HOME||; s|/|-|g")
CLSLUG=$(printf '%s' "$LIB" | sed "s|/|-|g")
# The transcripts live in the session folder of whichever tool ran the film. Claude Code writes them under
# ~/.claude/projects/<the whole path, slashes as dashes>/, omp under ~/.omp/agent/sessions/<the path under the
# home, slashes as dashes>/ — two different names for the same place. Both are read, because a supervisor that
# watches the wrong folder watches nothing and says nothing was broken.
SESSIONS=${SUPERVISE_SESSIONS:-}
if [ -z "$SESSIONS" ]; then
  SESSIONS="$HOME/.claude/projects/$CLSLUG:$HOME/.omp/agent/sessions/$SLUG"
fi
OUT="$LIB/improvements/supervision"
DATE=$(date +%F)
NOW=$(date +%H:%M)
DRY=0
[ "${1:-}" = "--dry" ] && DRY=1
mkdir -p "$OUT"
LOG="$OUT/$DATE.md"
STATE="$OUT/state.json"

echo "supervise: $DATE $NOW"

# --- 0. one cycle at a time ---------------------------------------------------------
# a cycle takes minutes and cron fires every fifteen: without a lock two cycles write the same entry file
LOCK="$OUT/.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  # a lock left behind by a killed cycle must not stop the watch forever
  OLD=$(cat "$LOCK/pid" 2>/dev/null || echo 0)
  if [ "$OLD" -gt 0 ] && kill -0 "$OLD" 2>/dev/null; then
    echo "supervise: a cycle is already running (pid $OLD)"
    exit 0
  fi
  rm -rf "$LOCK"
  mkdir "$LOCK" 2>/dev/null || { echo "supervise: a cycle is already running"; exit 0; }
fi
echo $$ > "$LOCK/pid"
trap 'rm -rf "$LOCK" "$GATE" "$TOOLS" "$RULES"' EXIT

# --- 1. the session that is running -------------------------------------------------
# The film under production comes first: the session that writes its files is the one to supervise, and a
# supervisor that watches itself is decoration.
FILM=${SUPERVISE_FILM:-}
BEST=0
# the films of the library: the discovery module is the one that knows where they are (films/ and channels/*/*)
# SUPERVISE_FILM names the film to watch when more than one is under production — the discovery below
# picks the one with the newest file, which is not always the one a supervisor is watching.
if [ -z "$FILM" ]; then
if ! FILMS=$("$NODE" "$LIB/core/render/films.mjs" --films); then
  echo "supervise: the discovery module could not list the films" >&2
  exit 1
fi
for rel in $FILMS; do
  d="$LIB/$rel/"
  [ -d "$d/src" ] || continue
  # the newest file of the film: find takes an absolute date here, not a relative one
  T=$(find "$d" -path "$d/out" -prune -o -type f -newermt "$(date -d '2 days ago' '+%Y-%m-%d %H:%M')" -print 2>/dev/null | head -20 | xargs -r stat -c %Y 2>/dev/null | sort -n | tail -1)
  T=${T:-0}
  if [ "$T" -gt "$BEST" ]; then BEST=$T; FILM="$d"; fi
done
fi
[ -n "$FILM" ] || { echo "supervise: no film under production"; exit 0; }
FILM=${FILM%/}
echo "supervise: film $(basename "$FILM")"

# The channel the film belongs to, and its own gate. A film under channels/<name>/ is judged by that
# channel's stamps; the supervisor has to read them, or it reports on the files while the film itself goes
# unjudged.
CHANNEL_GATE=""
case "$FILM" in
  "$LIB"/channels/*)
    CH_REL=${FILM#"$LIB"/channels/}
    CH_NAME=${CH_REL%%/*}
    [ -f "$LIB/channels/$CH_NAME/tools/gate.py" ] && CHANNEL_GATE="$LIB/channels/$CH_NAME/tools/gate.py"
    ;;
esac

SESSION=${SUPERVISE_SESSION:-}
if [ -z "$SESSION" ]; then
  # the session that wrote inside the film folder most recently
  SESSION=$(python3 - "$SESSIONS" "$FILM" "$LIB/tools/transcript.py" <<'PY'
import glob, os, re, sys, time
sessions, film, lib = sys.argv[1], sys.argv[2], sys.argv[3]
sys.path.insert(0, os.path.dirname(os.path.abspath(lib)))
import transcript
now = time.time()
# The sessions write their paths the way AGENTS.md tells them to: relative to the library root. The film
# folder may be given absolute or relative. So both sides are measured from the same place before they
# are compared — otherwise the comparison never matches, and the picker falls back to "the newest
# session", which is how it came to watch the wrong one.
LIB = os.path.abspath(lib)


def norm(path):
    try:
        return os.path.relpath(os.path.abspath(path), LIB)
    except ValueError:
        return path


film_rel = norm(film)


def writes_film(path):
    """when the transcript last wrote inside the film folder — only write and edit count, so a session that
    merely runs the checks on that folder is not taken for the one that builds it"""
    last = ''
    try:
        for at, tool, args in transcript.events(path):
            if tool not in ('write', 'edit'):
                continue
            p = args.get('path', '')
            if not norm(p).startswith(film_rel):
                continue
            if at > last:
                last = at
    except OSError:
        pass
    return last


files = []
for d in sessions.split(':'):
    files += glob.glob(os.path.join(d, '*.jsonl'))
files = sorted(files, key=os.path.getmtime, reverse=True)[:50]
# the main session is the one the user talks to; a subagent gets its own transcript named
# "<timestamp>_<uuid>.jsonl". The main session is the one to supervise.
def is_subagent(path):
    return bool(re.match(r'^\d{4}-\d{2}-\d{2}T[\d-]+_\S+\.jsonl$', os.path.basename(path)))

best, best_at = '', ''
fallback, fallback_at = '', ''
for f in files:
    if now - os.path.getmtime(f) > 7200:
        continue
    at = writes_film(f)
    if not at:
        continue
    if is_subagent(f):
        if at > fallback_at:
            fallback_at, fallback = at, f
        continue
    # the session that writes the film's own files is the one to supervise
    if at > best_at:
        best_at, best = at, f
if not best:
    best = fallback
if not best:
    for f in files:
        if now - os.path.getmtime(f) < 7200:
            best = f
            break
print(best)
PY
)
fi
if [ -z "$SESSION" ]; then
  echo "supervise: no session in progress — nothing to supervise"
  exit 0
fi
echo "supervise: session $(basename "$SESSION")"

# --- 2. the mechanical gate ----------------------------------------------------------
GATE=$(mktemp)
trap 'rm -rf "$LOCK" "$GATE"' EXIT
GATE_OK=1
gate_step() {   # run one check, keep its output, remember whether it passed
  NAME=$1; shift
  echo "=== $NAME"
  if "$@"; then echo "    ok"; else echo "    FAILED"; GATE_OK=0; fi
}
{
  gate_step filmcheck "$NODE" "$LIB/core/render/filmcheck.mjs" "$FILM"
  gate_step drawcheck "$NODE" "$LIB/core/render/drawcheck.mjs" "$FILM"
  if [ -f "$FILM/research/FACTS.md" ]; then
    gate_step citations "$PY" "$LIB/tools/check_citations.py" "$FILM/research/FACTS.md"
    gate_step claims "$PY" "$LIB/tools/check_claims.py" "$FILM"
    gate_step facts "$PY" "$LIB/tools/check_facts.py" "$FILM/research/FACTS.md"
  fi
  # the film's index row: a film that is not built yet is "not built yet", not a fault
  gate_step index "$PY" "$LIB/tools/check_films_index.py"
  # a film's treatment is a deliverable: it must be committable, or the episode vanishes with the machine
  gate_step tracked "$PY" "$LIB/tools/check_tracked.py" "$FILM"
  # The channel's own gate: where the episode stands, and whether the render may run at all. The checks above
  # answer "is this file well formed"; this one answers "has this film been judged" — and a green gate that
  # never asks that question is a green gate that cannot see a film a reviewer rejected. It is asked of the
  # channel the film belongs to, because the channel is the one that knows what its stamps mean.
  if [ -n "$CHANNEL_GATE" ]; then
    gate_step channel-gate "$PY" "$CHANNEL_GATE" status "$FILM"
    # a film that has been built and whose gate is closed must not be handed over; a film still being built
    # is not a fault — its gate is closed on purpose
    if ls "$FILM"/*.mp4 "$FILM"/out/*.mp4 >/dev/null 2>&1; then
      gate_step gate-render "$PY" "$CHANNEL_GATE" check --for render "$FILM"
    fi
  fi
} > "$GATE" 2>&1
echo "supervise: gate $( [ "$GATE_OK" -eq 1 ] && echo PASS || echo FAIL ) (filmcheck, drawcheck, citations, claims, facts, index, tracked, channel gate)"

# --- the session's own tool log: what it did, and when -------------------------------
TOOLS=$(mktemp)
RULES=$(mktemp)
trap 'rm -rf "$LOCK" "$GATE" "$TOOLS" "$RULES"' EXIT
python3 - "$SESSION" "$LIB/tools/transcript.py" > "$TOOLS" <<'PY'
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(sys.argv[2])))
import transcript
rows = []
for at, tool, args in transcript.events(sys.argv[1]):
    keep = {k: v for k, v in args.items() if k in ("path", "command", "intent", "name")}
    rows.append(f"{at[11:19] if 'T' in at else at} {tool} {json.dumps(keep, ensure_ascii=False)[:220]}")
print("\n".join(rows[-80:]))
PY

# the rules the session broke, read off its own tool log (R1–R5 of CODING_STANDARDS.md)
SUPERVISE_FILM="$FILM" SUPERVISE_LIB="$LIB" python3 - "$SESSION" "$LIB/tools/transcript.py" > "$RULES" <<'PY'
import collections, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(sys.argv[2])))
import transcript
out = []
drawn = set()   # a file is reported once, not once per edit
# is the film under production a three.js film? its src/ says so.
film = os.environ.get("SUPERVISE_FILM", "")
three_d = False
if film:
    src_dir = os.path.join(film, "src")
    if os.path.isdir(src_dir):
        for name in os.listdir(src_dir):
            if name.endswith(".js"):
                try:
                    if re.search(r"from\s+['\"]three['\"]|require\(['\"]three['\"]\)", open(os.path.join(src_dir, name), encoding="utf8").read()):
                        three_d = True
                except OSError:
                    pass
# the same command five times over is a poll, whatever it looks for (R9). Counted first, reported last: the
# report keeps the last forty lines, and a poll loop is the finding that must never be the one that falls off.
seen = collections.Counter()
for at, tool, args in transcript.events(sys.argv[1]):
    cmd = " ".join((args.get("command", "") or "").split())
    if tool == "bash" and cmd:
        seen[cmd.strip()] += 1
polls = [f"R9 {n} lần cùng một lệnh — một vòng dò, không phải việc: {cmd[:120]}"
         for cmd, n in seen.most_common() if n >= 5]


# is the file the command names a file of the project, or a scratch file under /tmp? R1 is about the project's own
# files: a heredoc that writes a scratch script in /tmp is the way a long script gets to a program, not a violation.
def project_file(f, cmd):
    if not f or f.startswith("/tmp/") or f.startswith("/dev/") or f.startswith("~"):
        return False
    root = os.environ.get("SUPERVISE_LIB", "")
    if root and f.startswith(root):
        return True
    if "/" in f:
        return True          # a path with a directory: src/film.js, voice/lines.json, review/x.md
    # a bare name: it belongs to the project unless the command changed into /tmp first
    return not re.search(r"cd\s+/tmp\b", cmd)


# the files the command writes, as opposed to the files it merely names: a script that reads core/render/still.mjs
# and writes src/film.js has written one file, not two.
def write_targets(cmd):
    tg = []
    body = cmd
    m = re.search(r"<<-?\s*['\"]?[A-Za-z_]\w*", cmd)
    if m:
        body = cmd[m.end():]
    for m2 in re.finditer(r"open\(\s*([^,)]{1,160}?)\s*,\s*['\"]w", body):
        expr = m2.group(1).strip().strip("'\"")
        if re.fullmatch(r"[\w./-]+", expr):
            tg.append(expr)
        else:
            for m3 in re.finditer(re.escape(expr) + r"\s*=\s*['\"]([^'\"]+)['\"]", body):
                tg.append(m3.group(1))
    tg += re.findall(r"(?<![0-9&])>{1,2}\s*([\w./-]+)", cmd)
    tg += re.findall(r"\bsed\s+-i(?:\.\w+)?\s+(?:'[^']*'|\"[^\"]*\"|\S+)\s+([\w./-]+)", cmd)
    for m4 in re.finditer(r"\b(?:cp|mv)\s+(?:-\S+\s+)*([\w./-]+)\s+([\w./-]+)", cmd):
        tg.append(m4.group(2))
    tg += re.findall(r"os\.replace\([^,]+,\s*['\"]?([\w./-]+)", body)
    tg += re.findall(r"shutil\.(?:copy|move)\([^,]+,\s*['\"]?([\w./-]+)", body)
    return tg


r1_n = 0
r1_files = {}
r10_n = 0
reread = {}          # how often a project file is read (R11)
imgread = {}         # how often the same frame is looked at again (R12)
for at, tool, args in transcript.events(sys.argv[1]):
    cmd = " ".join((args.get("command", "") or "").split())   # one line: a heredoc must not spill into the report
    at = at[11:19] if 'T' in at else at
    if tool == "read":
        p = args.get("path", "")
        if p.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            # by name, not by path: the same frame is looked at from a different scratch folder each time
            imgread[os.path.basename(p)] = imgread.get(os.path.basename(p), 0) + 1
        elif p and not p.startswith("/tmp/"):
            reread[p] = reread.get(p, 0) + 1
    if tool == "bash":
        # a settle of a second after a kill is not a poll; a wait of half a minute is
        if re.search(r'(^|[;&|]\s*)sleep\s+([5-9]|\d{2,})', cmd):
            out.append(f"R5 {at} a long job is polled with sleep: {cmd[:120]}")
        if re.search(r'git\s+add\s+(-\S+\s+)*(-A|--all)\b', cmd):
            out.append(f"R3 {at} every file is staged on a dirty tree: {cmd[:120]}")
        # R1: a file written by the shell. Four shapes: a heredoc (the shell hands a body to a program, which then
        # decides what to write), a redirect into a file, an in-place edit (sed -i), and a copy or a move. The log
        # truncates the command, so the rule reads the shape and the file name, not the whole script.
        repo_file = r"[\w./-]+\.(?:md|js|mjs|py|json|sh|html|txt|css|yml|yaml|toml|mp4|srt)\b"
        heredoc = bool(re.search(r"<<-?\s*['\"]?[A-Za-z_]", cmd))
        redirect = bool(re.search(r"(?<![0-9&])>{1,2}\s*[\w./-]+\.(?:md|js|mjs|py|json|sh|html|txt|css|yml|yaml|toml)\b", cmd))
        in_place = bool(re.search(r"\bsed\s+-i\b|\bcp\b\s|\bmv\b\s", cmd))
        names_repo_file = bool(re.search(repo_file, cmd))
        # only the files a person edits count: a rendered frame copied into a review folder is a build step
        src_ext = r"\.(?:md|js|mjs|py|json|sh|html|txt|css|yml|yaml|toml)\b"
        targets = [f for f in write_targets(cmd) if project_file(f, cmd) and re.search(src_ext, f)]
        is_r1 = bool(targets)
        # R10: a hand-rolled ffmpeg montage of frames. The library has core/render/sheet.py for this. A command that
        # both edits a file and tiles frames is reported once, as the edit.
        jpgs = len(re.findall(r'-i\s+\S+\.jpg', cmd))
        is_r10 = 'ffmpeg' in cmd and jpgs >= 2 and bool(re.search(r'filter_complex|tile=|hstack|vstack|xstack', cmd))
        if is_r1:
            targets = [f for f in re.findall(repo_file, cmd) if project_file(f, cmd)]
            if targets:
                r1_n += 1
                for f in set(targets):
                    r1_files[f] = r1_files.get(f, 0) + 1
        elif is_r10:
            r10_n += 1
        elif re.search(r'\bpython3?\s+-\s*<<', cmd) and re.search(r"['\"][^'\"]*\.(js|json|md)['\"]", cmd):
            out.append(f"R1? {at} a shell script touches a source file (the log truncates the command — read it "
                       f"before believing it): {cmd[:120]}")
    if tool in ("write", "edit"):
        p = args.get("path", "")
        if "/src/" in p and p.endswith(".js") and p not in drawn:
            try:
                src = open(p, encoding="utf8").read()
                # T9 is about text drawn straight onto the screen canvas. A three.js film paints its
                # textures the same way — the "MAX 400" on a scale, the "°C" on a thermometer — and that
                # text is a marking on an object, which is exactly what the channel wants on screen. Firing
                # on a 3D film would bury the real findings under fifteen reports of the same prop file.
                if "fillText(" in src and not three_d:
                    drawn.add(p)
                    out.append(f"T9 {at} {p} draws a string with a raw fillText() — the reading check cannot see it")
            except OSError:
                pass
if r1_n:
    top = ", ".join(f"{f}×{n}" for f, n in sorted(r1_files.items(), key=lambda kv: -kv[1])[:8])
    out.append(f"R1 {r1_n} lần — file của dự án bị ghi bằng shell, không bằng công cụ sửa file: {top}. "
               f"Dùng `edit`, hoặc `python3 tools/replace.py` khi đoạn cần thay quá dài.")
if r10_n:
    out.append(f"R10 {r10_n} lần — montage ffmpeg tự viết: `core/render/sheet.py` xếp các khung lại và đặt tên từng khung.")
# the cost of the session, in bytes. A transcript grows with every event, and a transcript that has grown
# by hundreds of megabytes is a session that has stopped making and started looking: the number says so before
# anyone reads the log.
try:
    SIZE = os.path.getsize(sys.argv[1])
except OSError:
    SIZE = 0
if SIZE:
    out.append(f"COST the transcript is {SIZE/1048576:.0f} MB — a session's cost is measurable in bytes, and a "
               f"transcript that grows by hundreds of megabytes is a session looking, not making.")
# R11: the same big file read again and again. The read is the cost: a 200 kB source file read to find one function
# buys nothing, and a session that reads it fifteen times is paying for the same context over and over.
for f, n in sorted(reread.items(), key=lambda kv: -kv[1]):
    if n >= 15:
        out.append(f"R11 {n} lần đọc lại {f} — đọc cả tệp để tìm một chỗ sửa: grep tên rồi đọc đoạn (`offset`, `limit`), "
                   f"và giữ một bản đồ mã (tên hàm → dòng) bên cạnh mã nguồn.")
# R12: the same frame looked at again and again. An image is a megabyte of context, so a session that opens one
# frame twenty times pays for that picture twenty times; the sheet of twelve frames would have shown it once.
if imgread:
    again = sum(n - 1 for n in imgread.values())
    out.append(f"R12 {sum(imgread.values())} lần mở ảnh, {again} lần là mở lại một tệp đã xem — ảnh vào ngữ cảnh là ~1 MB mỗi lần.")
for f, n in sorted(imgread.items(), key=lambda kv: -kv[1]):
    if n >= 10:
        out.append(f"R12 {n} lần xem lại {f} — mở `sheet_*.jpg` (mười hai khung một tờ) thay vì mở từng khung, và ghi lại khung nào đã xem để không xem lại.")
print("\n".join(out[-40:] + polls))
PY
if [ -s "$RULES" ]; then
  echo "supervise: the session broke $(wc -l < "$RULES") of the library's rules"
else
  echo "supervise: the session broke none of the library's rules"
fi

# --- 3. the reviewer model -----------------------------------------------------------
MODE=${SUPERVISE_LLM:-always}
RUN_LLM=0
if [ "$MODE" = "always" ]; then RUN_LLM=1; fi
if [ "$MODE" = "on-fail" ] && [ "$GATE_OK" -eq 0 ]; then RUN_LLM=1; fi
# the session has gone quiet: the cheap checks still run, the model does not — a model call every fifteen minutes
# on a film nobody is working on is a cost with nothing to read
QUIET_MIN=${SUPERVISE_QUIET_MIN:-45}
AGE=$(( ( $(date +%s) - $(stat -c %Y "$SESSION") ) / 60 ))
if [ "$AGE" -ge "$QUIET_MIN" ]; then
  RUN_LLM=0
  MODE="quiet (the session has been still for ${AGE} minutes)"
fi
REVIEW="(the reviewer model did not run: SUPERVISE_LLM=$MODE)"
SESSION_NAME=$(basename "$SESSION")
FILM_NAME=$(basename "$FILM")

# the evidence goes into files and the reviewer reads them: a long prompt comes back empty.
# The files are written every cycle, not only when the reviewer model runs: a cycle with the model
# switched off still produced evidence, and throwing it away left the last written report hours old.
cp "$GATE" "$OUT/gate-latest.txt"
cp "$TOOLS" "$OUT/session-latest.txt"
cp "$RULES" "$OUT/rules-latest.txt"
if [ "$RUN_LLM" -eq 1 ]; then
  # :high was measured to run past four minutes on a trivial prompt; :medium answered the same review in two
  # and a half. SUPERVISE_MODEL overrides it.
  MODEL=${SUPERVISE_MODEL:-2tocom/MiniMax-M3.1-Flash:medium}
  PROMPT=$(mktemp)
  cat > "$PROMPT" <<EOF
You are the supervisor of a film that is being produced right now in the repository $LIB.
The film folder is $FILM. The session that is producing it is $SESSION_NAME.

Judge the work against the rules of this library:
- improvements/lessons.md — the distilled rules of the past sessions, each with the guard that enforces it.
- CODING_STANDARDS.md — the judgement rules (R1–R6).
- DIRECTOR.md §11 — what a film must satisfy before it is delivered.

Your evidence, in files you can read:
1. $OUT/gate-latest.txt — the mechanical gate that just ran on the film.
2. $OUT/session-latest.txt — the tool log of the session, newest last.
3. $OUT/rules-latest.txt — the rules this session broke, read off its own tool log.
4. the film folder $FILM — read the files that matter (its research/FACTS.md, its src/, its TREATMENT.md).

Report only what the evidence shows. For every finding give: the evidence (a file, a line, a tool call), what it costs, and the guard that would catch it next time — a check, a CI job, a hook, or the words "no guard possible — recorded only". A finding with no evidence is not a finding.

Answer in this exact shape, and nothing outside it:

<verdict>PASS or CONCERNS</verdict>
<finding>
EVIDENCE: ...
IMPACT: ...
GUARD: ...
</finding>
(one <finding> block per finding; no block if there is nothing to report)
EOF
  REVIEW=$("$OMP" -p --no-session --model "$MODEL" --tools=read,grep,glob --max-time=600 "$(cat "$PROMPT")" 2>&1) || REVIEW=""
  # one retry: a model that times out is worth a second chance before the cycle gives up on it
  if [ -z "$(printf '%s' "$REVIEW" | tr -d '[:space:]')" ] || ! printf '%s' "$REVIEW" | grep -q '<verdict>'; then
    REVIEW=$("$OMP" -p --no-session --model "$MODEL" --tools=read,grep,glob --max-time=600 "$(cat "$PROMPT")" 2>&1) || REVIEW=""
  fi
  # an empty answer is a failure, not a pass
  if [ -z "$(printf '%s' "$REVIEW" | tr -d '[:space:]')" ] || ! printf '%s' "$REVIEW" | grep -q '<verdict>'; then
    REVIEW="(the reviewer did not answer this cycle — see improvements/supervision/reviewer.log)"
  fi
  # the raw output is kept next to the entries, so a failure can be read
  printf '%s\n' "$REVIEW" > "$OUT/reviewer.log"
  rm -f "$PROMPT"
fi

# --- 4. the entry ---------------------------------------------------------------------
ENTRY=$(mktemp)
{
  echo "## $NOW — $(basename "$SESSION") — $(basename "$FILM")"
  echo
  echo "Gate: $( [ "$GATE_OK" -eq 1 ] && echo PASS || echo FAIL ) — the checks below only. The delivery gate is" \
       "\`sh core/render/review.sh $FILM\`, which also runs the reading check, the voice check, the stills and the" \
       "loudness pass; a PASS here is not a film that is ready to ship."
  echo "Reviewer model: $( [ "$RUN_LLM" -eq 1 ] && echo ran || echo "skipped ($MODE)" )."
  echo
  echo '```'
  cat "$GATE"
  echo '```'
  echo
  if [ -s "$RULES" ]; then
    echo "The rules this session broke, read off its own tool log:"
    echo
    echo '```'
    cat "$RULES"
    echo '```'
    echo
  fi
  echo "$REVIEW"
  echo
} > "$ENTRY"

if [ "$DRY" -eq 1 ]; then
  cat "$ENTRY"
  rm -f "$ENTRY"
  echo "supervise: dry run — nothing written"
  exit 0
fi

if [ -f "$LOG" ]; then
  printf '\n' >> "$LOG"
fi
cat "$ENTRY" >> "$LOG"
rm -f "$ENTRY"

python3 - "$STATE" "$SESSION" "$FILM" "$( [ "$GATE_OK" -eq 1 ] && echo pass || echo fail )" <<'PY'
import json, os, sys
path, session, film, gate = sys.argv[1:5]
state = {}
if os.path.exists(path):
    try: state = json.load(open(path))
    except Exception: state = {}
state.update({"session": session, "film": film, "gate": gate, "at": os.popen("date -Is").read().strip()})
json.dump(state, open(path, "w"), indent=2)
PY

echo "supervise: entry written to improvements/supervision/$DATE.md"
