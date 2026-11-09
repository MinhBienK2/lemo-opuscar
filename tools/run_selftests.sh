#!/bin/sh
# Every check that can fail must prove it can: sh tools/run_selftests.sh
#
# A guard that no one runs is a guard that is broken in silence. Each checker here carries its own
# `--selftest` — a real input it must catch and a real input it must let pass. This script runs every
# one of them, and it fails when a checker has no selftest at all: a check that can answer "yes" to
# everything is not a check (see improvements/lessons.md, N30).
#
# Exit code: 0 every selftest passed and every checker has one; 1 something failed or something is missing.
set -e
HERE=$(cd "$(dirname "$0")/.." && pwd)
cd "$HERE"
status=0
ran=0
missing=""

# the checkers of the library and of the channels: every *.py that says "--selftest" in itself
for f in tools/*.py channels/*/tools/*.py; do
  [ -f "$f" ] || continue
  case "$(basename "$f")" in __init__.py) continue;; esac
  if grep -q -- '--selftest' "$f"; then
    if python3 "$f" --selftest >/tmp/selftest.$$ 2>&1; then
      echo "ok   $f"
    else
      echo "FAIL $f"
      sed 's/^/       /' /tmp/selftest.$$
      status=1
    fi
    ran=$((ran + 1))
  elif case "$(basename "$f")" in check_*.py) true;; *) false;; esac; then
    # a checker that can turn a film away and has no example of what it must catch
    missing="$missing $f"
  fi
done
rm -f /tmp/selftest.$$

if [ -n "$missing" ]; then
  echo "FAIL these checks have no --selftest, so nothing proves they can fail:$missing"
  status=1
fi
[ "$ran" -gt 0 ] || { echo "FAIL no selftest was found: the step would pass without checking anything"; status=1; }
[ "$status" -eq 0 ] && echo "ok   $ran selftests passed"
exit $status
