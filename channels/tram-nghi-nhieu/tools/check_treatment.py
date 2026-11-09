"""The treatment of an episode must be written, not copied: python3 check_treatment.py <episode>

The scaffold writes `TREATMENT.md` from the channel's template, and the template says two things about
itself: *thay mọi chỗ `<viết: …>`* (fill every slot) and *xoá các dòng hướng dẫn bắt đầu bằng `>`
khi xong* (delete the guidance lines when you are done). Two gates read that file, and both used to look
for the literal string `<viết:` anywhere — which fires on the guidance line that merely *mentions* the
placeholder, so a finished treatment was turned away with a message about a placeholder it did not have.

This check reads the file the way the template means it:

  1. a slot is a `<viết: …>` outside backticks — a mention inside `…` is a mention, not a slot to fill;
  2. the file must not be empty.

A line that starts with `>` is **not** a defect by itself: the channel writes the film's own decisions on
such lines, and the outline reviewer judges them. Only the empty slots are the scaffold's.

`LOOK.md` is checked too, in the channel's own shape: at least two rounds (`## Vòng 1`, `## Vòng 2` …).
The library's check asks for DIRECTOR.md's shape — a "Thấy:" line and a "Sửa:" line per round — which the
channel's rounds do not use, so the library's check would turn away a finished episode. The channel knows
its own shape; the delivery gate calls this check instead of the library's when the channel has one.

Exit code: 0 the treatment is written; 1 it is not; 2 usage.
"""
import os
import re
import sys

CODE = re.compile(r'`[^`]*`')          # a mention inside `…` is not a slot to fill
SLOT = re.compile(r'<viết:')
ROUND = re.compile(r'^##\s+Vòng\s+(\d+[a-z]?)', re.M)   # "Vòng 5" and "Vòng 5b" are two rounds


def check(path):
    """The problems of one treatment file; each as (line, message)."""
    try:
        text = open(path, encoding='utf-8').read()
    except OSError as e:
        return [(0, f'cannot read the treatment: {e.strerror}')]
    bad = []
    if not text.strip():
        return [(0, 'the treatment is empty')]
    for no, line in enumerate(text.splitlines(), 1):
        if SLOT.search(CODE.sub('', line)):
            bad.append((no, 'a slot of the template is still empty'))
    return bad


def check_look(path):
    """The problems of one look file; each as (line, message). The channel's own shape."""
    try:
        text = open(path, encoding='utf-8').read()
    except OSError as e:
        return [(0, f'cannot read the look file: {e.strerror}')]
    rounds = ROUND.findall(text)
    if len(rounds) < 2:
        return [(0, f'LOOK.md has {len(rounds)} round(s) (≥ 2: "## Vòng 1", "## Vòng 2" …)')]
    seen, dup = set(), []
    for r in rounds:
        if r in seen:
            dup.append(r)
        seen.add(r)
    if dup:
        return [(0, f'LOOK.md repeats round(s) {", ".join(sorted(set(dup)))}')]
    return []


def selftest():
    """The cases this check must get right — each one a real file of a real episode."""
    cases = [
        ('a mention inside backticks is not a slot',
         "> Dàn ý của tập. Thay mọi chỗ `<viết: …>`. Xoá các dòng hướng dẫn bắt đầu bằng `>` khi xong.\n"
         "\n## Câu hỏi\n- Câu hỏi: Vì sao điện thoại nóng lúc sạc?\n", False),
        ('an empty slot is a slot',
         "## Câu hỏi\n- Câu hỏi: <viết: câu hỏi>\n", True),
        ('a line that starts with ">" is the film\'s own, not a defect',
         "## Câu hỏi\n- Câu hỏi: Vì sao điện thoại nóng lúc sạc?\n> Tập ngắn dưới tám phút, không chia chương.\n", False),
        ('a written treatment passes',
         "# Dàn ý\n\n## Câu hỏi\n- Câu hỏi: Vì sao điện thoại nóng lúc sạc?\n\n## Tầng\n1. Một\n2. Hai\n", False),
    ]
    bad = 0
    for name, text, want_bad in cases:
        path = '/tmp/check_treatment_selftest.md'
        open(path, 'w', encoding='utf-8').write(text)
        problems = check(path)
        mark = 'ok  ' if bool(problems) == want_bad else 'FAIL'
        if bool(problems) != want_bad:
            bad += 1
        print(f"{mark} {name}" + ('' if problems else ''))
    looks = [
        ('two look rounds pass', "## Vòng 1\n- Thấy: …\n\n## Vòng 2\n- Sửa: …\n", False),
        ('one look round is not enough', "## Vòng 1\n- Thấy: …\n", True),
        ('the same round twice is one round', "## Vòng 1\n- a\n\n## Vòng 1\n- b\n", True),
    ]
    for name, text, want_bad in looks:
        path = '/tmp/check_treatment_selftest_look.md'
        open(path, 'w', encoding='utf-8').write(text)
        problems = check_look(path)
        mark = 'ok  ' if bool(problems) == want_bad else 'FAIL'
        if bool(problems) != want_bad:
            bad += 1
        print(f"{mark} {name}" + ('' if problems else ''))
    print('ok' if not bad else f'FAIL: {bad} case(s)')
    return 0 if not bad else 1


def main():
    args = sys.argv[1:]
    if args and args[0] == '--selftest':
        return selftest()
    if not args:
        print('usage: python3 check_treatment.py <episode-folder>', file=sys.stderr)
        return 2
    ep = args[0]
    path = os.path.join(ep, 'TREATMENT.md') if os.path.isdir(ep) else ep
    bad = check(path)
    for no, msg in bad:
        print(f"{path}:{no}: {msg}" if no else f"{path}: {msg}")
    look = os.path.join(os.path.dirname(path) or '.', 'LOOK.md')
    if os.path.isdir(ep) and os.path.isfile(look):
        for no, msg in check_look(look):
            print(f"{look}:{no}: {msg}" if no else f"{look}: {msg}")
            bad.append((no, msg))
    print(f"check_treatment: {'the treatment is written' if not bad else str(len(bad)) + ' problem(s)'}")
    return 0 if not bad else 1


if __name__ == '__main__':
    sys.exit(main())
