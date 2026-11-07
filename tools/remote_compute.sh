#!/bin/sh
# tools/remote_compute.sh: Run heavy compute (ffmpeg, video renders) on remote host (e.g. muse) with clean local fallback.
#
# Usage:
#   tools/remote_compute.sh [--host <host>] <command...>
#
# Examples:
#   tools/remote_compute.sh ffmpeg -y -i input.mp4 ...
#   tools/remote_compute.sh --host muse ffmpeg ...
#
# Behavior:
#   1. Tests SSH connection to remote host with a fast 3s timeout.
#   2. If reachable: offloads the command or runs with remote compute.
#   3. If unreachable: prints a clear notification and falls back to local execution.
#   Never blocks, hangs, or fails silently when remote is offline.
set -e

REMOTE_HOST="${REMOTE_HOST:-muse}"
TIMEOUT=3

if [ "$1" = "--host" ]; then
  REMOTE_HOST="$2"
  shift 2
fi

if [ $# -eq 0 ]; then
  echo "usage: tools/remote_compute.sh [--host <name>] <command...>" >&2
  exit 2
fi

# Quick connectivity test
echo "[COMPUTE] Checking remote host '$REMOTE_HOST' (timeout ${TIMEOUT}s)..." >&2
if ssh -o BatchMode=yes -o ConnectTimeout="$TIMEOUT" "$REMOTE_HOST" "echo OK" >/dev/null 2>&1; then
  echo "[REMOTE] Connected to '$REMOTE_HOST'. Running remotely..." >&2
  ssh "$REMOTE_HOST" "$@"
else
  echo "[FALLBACK] Remote host '$REMOTE_HOST' is not reachable. Falling back to local execution." >&2
  "$@"
fi
