"""The round number in a report is the tool's truth, not the reviewer's memory.

A reviewer that is not told which round it is writes "ROUND: 1/5" every time, and a report that
always says round 1 cannot tell a loop from a first attempt — nor can a reader who wants to know
how much of the round budget is gone. So the tool writes the line after the report is written:

    python3 set_round.py <report.md> <n> <limit>

The line lands where the reviewer wrote it (the template puts it in the header), or right after the
verdict, or at the top of the file if the report has no verdict at all — a report without a round
number is worse than one with a wrong number, because it says nothing.

Exit code: 0 the report carries the round; 1 the report could not be read or written.
"""
import os
import re
import sys

ROUND_LINE = re.compile(r'^ROUND:.*$', re.M)
VERDICT_LINE = re.compile(r'^VERDICT:.*$', re.M)


def set_round(text, n, lim):
    """The report's text with the round written into it."""
    line = f"ROUND: {n}/{lim}"
    if ROUND_LINE.search(text):
        return ROUND_LINE.sub(lambda m: line, text, count=1)
    if VERDICT_LINE.search(text):
        # the verdict is not always the first line (a report may open with its scores), so the round
        # goes after the verdict wherever it is — not only at the top of the file
        return VERDICT_LINE.sub(lambda m: m.group(0) + '\n' + line, text, count=1)
    return line + '\n' + text


def selftest():
    """The cases this must get right — each one a header a real report has."""
    cases = [
        ('the placeholder in the template is replaced', 3, 5,
         'SCORES: A=4\nVERDICT: PASS\nROUND: (số vòng do review.sh ghi)\n\nbody\n',
         'SCORES: A=4\nVERDICT: PASS\nROUND: 3/5\n\nbody\n'),
        ('a report with no round line gets one after the verdict', 2, 4,
         'VERDICT: REJECT\n\nbody\n',
         'VERDICT: REJECT\nROUND: 2/4\n\nbody\n'),
        ('a report with no verdict gets the round on top', 1, 6,
         'no verdict here\nbody\n',
         'ROUND: 1/6\nno verdict here\nbody\n'),
        ('a wrong round the reviewer guessed is overwritten', 4, 5,
         'VERDICT: PASS\nROUND: 1/5\n\nbody\n',
         'VERDICT: PASS\nROUND: 4/5\n\nbody\n'),
    ]
    bad = 0
    for name, n, lim, src, want in cases:
        got = set_round(src, n, lim)
        ok = got == want
        if not ok:
            bad += 1
        print(('ok   ' if ok else 'FAIL ') + name)
        if not ok:
            print(f'      got:  {got!r}\n      want: {want!r}')
    print('ok' if not bad else f'FAIL: {bad} case(s)')
    return 0 if not bad else 1


def main():
    args = sys.argv[1:]
    if args and args[0] == '--selftest':
        return selftest()
    if len(args) < 3:
        print('usage: python3 set_round.py <report.md> <n> <limit>', file=sys.stderr)
        return 2
    path, n, lim = args[0], args[1], args[2]
    try:
        text = open(path, encoding='utf-8', errors='replace').read()
    except OSError as e:
        print(f'set_round: cannot read {path}: {e.strerror}', file=sys.stderr)
        return 1
    out = set_round(text, n, lim)
    if out == text:
        print(f'set_round: {path} already carries the round {n}/{lim}')
        return 0
    try:
        open(path, 'w', encoding='utf-8').write(out)
    except OSError as e:
        print(f'set_round: cannot write {path}: {e.strerror}', file=sys.stderr)
        return 1
    print(f'set_round: {path} → ROUND: {n}/{lim}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
