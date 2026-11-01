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
SESSIONS=${SUPERVISE_SESSIONS:-$HOME/.omp/agent/sessions/$SLUG}
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
FILM=""
BEST=0
# the films of the library: the discovery module is the one that knows where they are (films/ and channels/*/*)
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
[ -n "$FILM" ] || { echo "supervise: no film under production"; exit 0; }
FILM=${FILM%/}
echo "supervise: film $(basename "$FILM")"

SESSION=${SUPERVISE_SESSION:-}
if [ -z "$SESSION" ]; then
  # the session that wrote inside the film folder most recently
  SESSION=$(python3 - "$SESSIONS" "$FILM" <<'PY'
import glob, json, os, sys, time
sessions, film = sys.argv[1], sys.argv[2]
now = time.time()


def writes_film(path):
    """when the transcript last wrote inside the film folder — only write and edit count, so a session that
    merely runs the checks on that folder is not taken for the one that builds it"""
    last = ''
    try:
        with open(path, encoding='utf8', errors='replace') as fh:
            for line in fh:
                if '"tool_execution_start"' not in line:
                    continue
                try: d = json.loads(line)
                except Exception: continue
                if d.get('type') != 'custom' or d.get('customType') != 'tool_execution_start':
                    continue
                da = d.get('data', {})
                if da.get('toolName') not in ('write', 'edit'):
                    continue
                p = (da.get('args') or {}).get('path', '')
                if not isinstance(p, str) or not p.startswith(film):
                    continue
                at = da.get('startedAt', '')
                if at > last:
                    last = at
    except OSError:
        pass
    return last


files = sorted(glob.glob(os.path.join(sessions, '*.jsonl')), key=os.path.getmtime, reverse=True)[:25]
best, best_at = '', ''
for f in files:
    if now - os.path.getmtime(f) > 7200:
        continue
    # the session that writes the film's own files is the one to supervise
    at = writes_film(f)
    if at and at > best_at:
        best_at, best = at, f
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
} > "$GATE" 2>&1
echo "supervise: gate $( [ "$GATE_OK" -eq 1 ] && echo PASS || echo FAIL ) (filmcheck, drawcheck, citations, claims, facts, index)"

# --- the session's own tool log: what it did, and when -------------------------------
TOOLS=$(mktemp)
RULES=$(mktemp)
trap 'rm -rf "$LOCK" "$GATE" "$TOOLS" "$RULES"' EXIT
python3 - "$SESSION" > "$TOOLS" <<'PY'
import json, sys
path = sys.argv[1]
rows = []
try:
    for line in open(path):
        try: d = json.loads(line)
        except Exception: continue
        if d.get("type") == "custom" and d.get("customType") == "tool_execution_start":
            da = d.get("data", {})
            args = da.get("args", {})
            keep = {k: v for k, v in args.items() if k in ("path", "command", "intent", "name")}
            rows.append(f"{da.get('startedAt','')[11:19]} {da.get('toolName')} {json.dumps(keep, ensure_ascii=False)[:220]}")
except FileNotFoundError:
    pass
print("\n".join(rows[-80:]))
PY

# the rules the session broke, read off its own tool log (R1–R5 of CODING_STANDARDS.md)
python3 - "$SESSION" > "$RULES" <<'PY'
import json, re, sys
path = sys.argv[1]
out = []
try:
    for line in open(path):
        try: d = json.loads(line)
        except Exception: continue
        if d.get("type") != "custom" or d.get("customType") != "tool_execution_start":
            continue
        da = d.get("data", {})
        args = da.get("args", {})
        cmd = args.get("command", "") or ""
        tool = da.get("toolName", "")
        at = da.get("startedAt", "")[11:19]
        if tool == "bash":
            # a settle of a second after a kill is not a poll; a wait of half a minute is
            if re.search(r'(^|[;&|]\s*)sleep\s+([5-9]|\d{2,})', cmd):
                out.append(f"R5 {at} a long job is polled with sleep: {cmd[:120]}")
            if re.search(r'git\s+add\s+(-\S+\s+)*(-A|--all)\b', cmd):
                out.append(f"R3 {at} every file is staged on a dirty tree: {cmd[:120]}")
            # R1: a file written by the shell. The log truncates the command, so a heredoc that names one of the
            # film's source files is reported for a reader to check — not counted as a violation.
            writes = bool(re.search(r"open\(\s*[^)]*['\"]w['\"]|\.write\(|os\.replace|shutil\.(copy|move)", cmd))
            if writes and re.search(r'(cat|tee)\s*>|\bpython3?\s+-\s*<<|<<\s*[\'"]?EOF', cmd):
                out.append(f"R1 {at} a file is written by the shell: {cmd[:120]}")
            elif re.search(r'\bpython3?\s+-\s*<<', cmd) and re.search(r"['\"][^'\"]*\.(js|json|md)['\"]", cmd):
                out.append(f"R1? {at} a shell script touches a source file (the log truncates the command — read it "
                           f"before believing it): {cmd[:120]}")
        if tool in ("write", "edit") and isinstance(args.get("path"), str):
            p = args["path"]
            if "/src/" in p and p.endswith(".js"):
                try:
                    src = open(p, encoding="utf8").read()
                    if "fillText(" in src:
                        out.append(f"T9 {at} {p} draws a string with a raw fillText() — the reading check cannot see it")
                except OSError:
                    pass
except FileNotFoundError:
    pass
print("\n".join(out[-40:]))
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

if [ "$RUN_LLM" -eq 1 ]; then
  # :high was measured to run past four minutes on a trivial prompt; :medium answered the same review in two
  # and a half. SUPERVISE_MODEL overrides it.
  MODEL=${SUPERVISE_MODEL:-2tocom/MiniMax-M3.1-Flash:medium}
  # the evidence goes into files and the reviewer reads them: a long prompt comes back empty
  cp "$GATE" "$OUT/gate-latest.txt"
  cp "$TOOLS" "$OUT/session-latest.txt"
  cp "$RULES" "$OUT/rules-latest.txt"
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
