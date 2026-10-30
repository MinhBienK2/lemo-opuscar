#!/bin/sh
# Install the pre-commit hook: sh tools/install_precommit.sh [--force]
#
# The hook looks at the staged files only:
#   - node --check on every staged .js under films/, channels/ or styles/
#   - node core/render/drawcheck.mjs on every film whose src/ has staged changes
#   - node core/render/filmcheck.mjs on every film that has staged changes
#   - python3 tools/check_tracked.py on every film that has staged changes: its treatment must be committable
#   - the citation, claims and facts checks on every film whose research file has staged changes
#   - python3 tools/check_films_index.py when FILMS.md or a film's manifest is staged
#
# The films are never globbed: core/render/films.mjs is the one module that knows where they are, and the hook asks
# it for the list. Under the new layout a staged path names the channel first and the episode second, so the film a
# staged file belongs to can only be found by asking the module.
#
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
    films/*.js|channels/*.js|styles/*.js)
      # a demo folder can carry its own package.json, so the file is checked as the ES module it is
      cp "\$f" "\$CHECK/\$(basename "\$f" .js).mjs"
      node --check "\$CHECK/\$(basename "\$f" .js).mjs" || { echo "pre-commit: \$f does not parse"; bad=1; }
      ;;
  esac
done
# the films of the library: the discovery module is the one that knows where they are
if ! FILMS=\$(node "\$LIB/core/render/films.mjs" --films); then
  echo "pre-commit: the discovery module could not list the films"
  exit 1
fi
if [ -z "\$FILMS" ] && printf '%s\n' "\$STAGED" | grep -q '^\(films\|channels\)/'; then
  echo "pre-commit: no film was found although a film was staged: the discovery module found nothing"
  exit 1
fi
# the films that hold a staged file under the given prefix
films_with() {
  for f in \$STAGED; do
    for d in \$FILMS; do
      case "\$f" in "\$d\$1"*) printf '%s\n' "\$d";; esac
    done
  done | sort -u
}
for d in \$(films_with "/src/"); do
  node "\$LIB/core/render/drawcheck.mjs" "\$d" || bad=1
done
# the film itself: any staged file under a film makes the film its own episode worth checking.
# Its treatment is a deliverable: the rule that keeps it committable must still match this film's path.
for d in \$(films_with "/"); do
  node "\$LIB/core/render/filmcheck.mjs" "\$d" || bad=1
  python3 "\$LIB/tools/check_tracked.py" "\$d" || bad=1
done
# the film's research file and the numbers on screen
for d in \$(films_with "/research/FACTS.md"); do
  python3 "\$LIB/tools/check_citations.py" "\$d/research/FACTS.md" || bad=1
  python3 "\$LIB/tools/check_claims.py" "\$d" || bad=1
  python3 "\$LIB/tools/check_facts.py" "\$d/research/FACTS.md" || bad=1
done
# the index must name the files that exist
if printf '%s\n' "\$STAGED" | grep -qx 'FILMS.md' || printf '%s\n' "\$STAGED" | grep -q '/film\.json\$'; then
  python3 "\$LIB/tools/check_films_index.py" || bad=1
fi
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
