#!/bin/sh
# Install the pre-commit hook: sh tools/install_precommit.sh [--force]
#
# The hook looks at the staged files only:
#   - node --check on every staged .js under films/ or styles/
#   - node core/render/drawcheck.mjs on every films/<name> whose src/ has staged changes
# An existing hook is never overwritten without --force; a hook that is already this one is left alone.
set -e
LIB=$(cd "$(dirname "$0")/.." && pwd)
FORCE=0
if [ $# -gt 1 ]; then
  echo "usage: sh tools/install_precommit.sh [--force]" >&2
  exit 2
fi
if [ "${1:-}" = "--force" ]; then FORCE=1; fi
REPO=$(git rev-parse --show-toplevel 2>/dev/null || echo "$LIB")
HOOK="$REPO/.git/hooks/pre-commit"
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
cat > "$TMP" <<EOF
#!/bin/sh
# pre-commit: the staged drawing code must parse and must call its own helpers correctly.
# Installed by tools/install_precommit.sh - change that script, not this file.
set -e
LIB="$LIB"
REPO=\$(git rev-parse --show-toplevel)
cd "\$REPO"
STAGED=\$(git diff --cached --name-only --diff-filter=ACMR)
CHECK=\$(mktemp -d)
trap 'rm -rf "\$CHECK"' EXIT
bad=0
for f in \$STAGED; do
  case "\$f" in
    films/*.js|styles/*.js)
      # a demo folder can carry its own package.json, so the file is checked as the ES module it is
      cp "\$f" "\$CHECK/\$(basename "\$f" .js).mjs"
      node --check "\$CHECK/\$(basename "\$f" .js).mjs" || { echo "pre-commit: \$f does not parse"; bad=1; }
      ;;
  esac
done
for name in \$(printf '%s\n' "\$STAGED" | sed -n 's|^films/\([^/]*\)/src/.*|\1|p' | sort -u); do
  node "\$LIB/core/render/drawcheck.mjs" "films/\$name" || bad=1
done
if [ "\$bad" -ne 0 ]; then
  echo "pre-commit: the staged code does not pass the checks"
  exit 1
fi
echo "pre-commit: the staged code passes"
EOF
if [ -e "$HOOK" ]; then
  if cmp -s "$TMP" "$HOOK"; then
    echo "install_precommit: $HOOK is already the hook of this library; nothing to do"
    exit 0
  fi
  if [ "$FORCE" -ne 1 ]; then
    echo "install_precommit: $HOOK exists and is not the hook of this library; leaving it alone (run with --force to replace it)"
    exit 1
  fi
fi
mkdir -p "$(dirname "$HOOK")"
cp "$TMP" "$HOOK"
chmod +x "$HOOK"
echo "install_precommit: installed $HOOK (staged .js files are parsed, films with staged src/ changes are audited)"
