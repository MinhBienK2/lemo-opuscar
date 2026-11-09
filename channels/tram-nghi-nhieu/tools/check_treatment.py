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

Exit code: 0 the treatment is written; 1 it is not; 2 usage.
"""
import os
import re
import sys

CODE = re.compile(r'`[^`]*`')          # a mention inside `…` is not a slot to fill
SLOT = re.compile(r'<viết:')


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
    print(f"check_treatment: {'the treatment is written' if not bad else str(len(bad)) + ' problem(s)'}")
    return 0 if not bad else 1


if __name__ == '__main__':
    sys.exit(main())
