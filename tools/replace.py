"""Replace a snippet in a file, exactly once, and write the whole file atomically.

    python3 tools/replace.py <file> <old-snippet-file> <new-snippet-file> [--count N]

The rule R1 exists because a shell write can truncate a file before it fails, and leaves no record of what was
intended. This is the sanctioned way to script an edit when the snippet is too long for an exact-match edit tool:

  - it counts the matches and refuses to write unless there are exactly N of them (N = 1 by default) — the most
    common way a scripted edit goes wrong is a snippet that occurs twice, and one of the two is not the one meant;
  - it writes to a temporary file in the same folder and renames it over the target, so the target is never
    half-written: a reader sees the old file or the new file, never a truncated one;
  - when it refuses, it prints where the matches are (line numbers and the line itself), so the next attempt
    uses a snippet that is unique.

The snippets are files, so the agent writes them with a file-editing tool (which is what R1 asks for) and this
script does the replacement itself.

Exit code: 0 the file was rewritten; 1 nothing was written (no match, or more than one, or the file is missing).
"""
import argparse
import os
import sys
import tempfile


def read(path):
    with open(path, encoding='utf8') as f:
        return f.read()


def where(text, needle):
    """the line numbers (1-based) where the needle sits"""
    return [i + 1 for i, line in enumerate(text.splitlines()) if needle.strip() and needle.strip() in line]


def main():
    ap = argparse.ArgumentParser(description='replace a snippet in a file, exactly once')
    ap.add_argument('file')
    ap.add_argument('old')
    ap.add_argument('new')
    ap.add_argument('--count', type=int, default=1, help='how many matches are expected (default 1)')
    a = ap.parse_args()

    if not os.path.isfile(a.file):
        print(f'replace: FAIL {a.file} does not exist')
        return 1
    old, new = read(a.old), read(a.new)
    if old == new:
        print('replace: FAIL the old snippet and the new snippet are the same')
        return 1
    body = read(a.file)
    n = body.count(old)
    if n != a.count:
        print(f'replace: FAIL {a.file} holds the old snippet {n} time(s), {a.count} expected — nothing was written')
        if n:
            lines = where(body, old)
            print(f'  it sits on line(s): {", ".join(map(str, lines[:12]))}')
            for i, line in enumerate(body.splitlines(), 1):
                if old.strip() and old.strip() in line:
                    print(f'  {i}: {line.strip()[:160]}')
                    if len(lines) > 12 and i == lines[12]:
                        print('  …')
                        break
        print('  write a snippet that is unique, or pass --count with the number you mean')
        return 1

    # write the whole file next to the target, then rename it over: the target is never half-written
    d = os.path.dirname(os.path.abspath(a.file))
    fd, tmp = tempfile.mkstemp(dir=d, prefix='.replace-')
    try:
        with os.fdopen(fd, 'w', encoding='utf8') as f:
            f.write(body.replace(old, new, a.count))
        os.replace(tmp, a.file)
    except BaseException:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise
    print(f'replace: {a.file} — {n} occurrence(s) replaced')
    return 0


if __name__ == '__main__':
    sys.exit(main())
