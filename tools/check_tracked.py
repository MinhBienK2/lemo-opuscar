#!/usr/bin/env python3
"""Every film's treatment must be committable.

The treatment is a deliverable (DIRECTOR.md §11): it travels with the film into the repository. The rule that
keeps it tracked lives in .gitignore as a negation — `!films/*/TREATMENT.md` and `!channels/*/*/TREATMENT.md` —
and a negation that stops matching a new layout is invisible: the file stays on disk, the film looks complete,
and the treatment is simply not in the repository (that is what the first retro recorded as F10).

So this check asks git, not the .gitignore: a film whose TREATMENT.md exists on disk must be addable.

    python3 tools/check_tracked.py            # every film the discovery module lists
    python3 tools/check_tracked.py <folder>   # one film
    python3 tools/check_tracked.py --selftest  # prove the check can fail

Exit 0 when every treatment can be committed, 1 when one cannot, 2 on usage error.
"""
import contextlib, io, json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NODE = os.environ.get('NODE', 'node')
DISCOVERY = os.path.join(ROOT, 'core', 'render', 'films.mjs')


def films():
    """The films, from the one module that knows where they are."""
    r = subprocess.run([NODE, DISCOVERY, '--json'], capture_output=True, text=True)
    if r.returncode != 0:
        print(f'check_tracked: FAIL the discovery module failed: {r.stderr.strip()[:200]}')
        sys.exit(2)
    return json.loads(r.stdout).get('films', [])


def addable(rel, root=ROOT):
    """Can git take this path? `--dry-run` says so without touching the index."""
    r = subprocess.run(['git', '-C', root, 'add', '--dry-run', '--', rel], capture_output=True, text=True)
    if r.returncode == 0:
        return True
    return 'ignored' not in (r.stderr or '').lower()


def check(folder, root=ROOT):
    """A treatment that git will not take is a film whose rationale never reaches the repository."""
    treatment = os.path.join(folder, 'TREATMENT.md')
    if not os.path.exists(treatment):
        return None                      # a film in preparation has no treatment yet
    rel = os.path.relpath(treatment, root)
    if addable(rel, root):
        return None
    print(f'check_tracked: FAIL the treatment of {os.path.relpath(folder, root)} cannot be committed: {rel}')
    print("              a film's treatment is a deliverable (DIRECTOR.md §11); the .gitignore rule that")
    print('              keeps it tracked does not match this path any more — fix the rule, not the file.')
    return rel


def selftest():
    """Prove the check can fail: a treatment git will not take must be caught.

    The subject of this check is git and the layout of the repository, so the selftest builds a
    throwaway repository in a temp folder and asks git about it there — never about this one.
    """
    def put(path, text):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)

    cases = []
    with tempfile.TemporaryDirectory() as tmp:
        root = os.path.join(tmp, 'repo')
        os.makedirs(root)
        subprocess.run(['git', '-C', root, 'init', '-q'], capture_output=True, text=True)
        # the rule the repository uses: every treatment is ignored, the films' own are kept
        put(os.path.join(root, '.gitignore'), '**/TREATMENT.md\n!films/*/TREATMENT.md\n')
        put(os.path.join(root, 'films/x/TREATMENT.md'), '# Treatment\n')
        put(os.path.join(root, 'films/x/series/y/TREATMENT.md'), '# Treatment\n')
        os.makedirs(os.path.join(root, 'films/z'), exist_ok=True)
        cases = [
            ('a treatment the .gitignore keeps tracked passes', os.path.join(root, 'films/x'), False),
            ('a treatment the .gitignore swallows is caught', os.path.join(root, 'films/x/series/y'), True),
            ('a film with no treatment yet is not a failure', os.path.join(root, 'films/z'), False),
        ]
        bad = 0
        for name, folder, want_bad in cases:
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                got = check(folder, root)
            ok = bool(got) == want_bad
            if not ok:
                bad += 1
            print(f'{"ok   " if ok else "FAIL"} {name}' + ('' if ok else f' — {buf.getvalue().strip() or "nothing was caught"}'))
    print('ok' if not bad else f'FAIL: {bad} case(s)')
    return 0 if not bad else 1


def main(argv):
    if len(argv) > 1 and argv[1] == '--selftest':
        return selftest()
    if len(argv) > 1:
        folders = [os.path.abspath(a) for a in argv[1:]]
    else:
        folders = [f['dir'] for f in films()]
    bad = 0
    for folder in folders:
        if not os.path.isdir(folder):
            print(f'check_tracked: FAIL no such film folder: {folder}')
            bad += 1
            continue
        if check(folder):
            bad += 1
    if bad:
        print(f'check_tracked: {bad} treatment(s) cannot be committed')
        return 1
    print(f'check_tracked: every treatment can be committed ({len(folders)} film(s))')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
