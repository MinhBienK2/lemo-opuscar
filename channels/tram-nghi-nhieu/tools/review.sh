#!/bin/sh
# Independent review of one step of an episode, item by item: sh channels/tram-nghi-nhieu/tools/review.sh <episode> <step>
#   step: outline | script | look | props | picture | final      (details: review.py, the rubrics: step*/RUBRIC.md)
# Exit 0 the step is closed, 1 items to fix, 2 the round could not run.
HERE=$(dirname "$(readlink -f "$0")")   # also when called through the channel-root symlink
LIB=$(cd "$HERE/../../.." && pwd)
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY=python3
exec "$PY" "$HERE/review.py" "$@"
