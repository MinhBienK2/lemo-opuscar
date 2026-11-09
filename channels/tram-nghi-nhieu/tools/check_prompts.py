#!/usr/bin/env python3
"""check_prompts.py — a prompt must reach the reviewer WHOLE.

`review.sh` hands the reviewer its instructions as a shell string. The moment that string holds an
unescaped `"` inside it, the shell stops the string there: the rest of the prompt becomes SEPARATE
WORDS, and the reviewer is asked the first fragment of a long rubric and nothing else.

That is not a hypothesis: the props judge of `review.sh` lost 4 077 of its 4 941 characters — the
KHỚP/HỎNG rubric, the two groups A and B, the output template and the line "rồi in lại nó." — because
four quote marks around two words were not escaped. The rounds still ran, the reviewer still answered,
and the report still said PASS; the reviewer had simply never been told what a good prop is.

This checker reads the shell file and says, for every `critic "…"`, whether the shell hands that
command ONE prompt (plus the optional `no-verdict` flag) or several words.

    python3 channels/tram-nghi-nhieu/tools/check_prompts.py [file ...]
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT = [os.path.join(HERE, "review.sh")]

# After the prompt string these may follow and nothing else: the flag that says "this phase answers
# with a list, not with a verdict".
EXTRA_WORDS = {"no-verdict"}
# and the shell's own command terminators.
TERMINATORS = (")", ";", "&&", "||", "|", "&", "\\", "fi", "do", "done", "else", "then", "{", "}")


def scan(text):
    """Every `critic "…"` call: its line, the words that follow the prompt, and its head."""
    out = []
    i = 0
    while True:
        j = text.find('critic "', i)
        if j < 0:
            break
        before = text[j - 1] if j else " "
        after = text[j + 7:j + 8]
        if not (before.isspace() or before in "(;") or after not in (" ", "\t", '"'):
            i = j + 7
            continue
        p = j + 8                      # the opening quote
        while p < len(text):
            c = text[p]
            if c == "\\":
                p += 2
                continue
            if text.startswith("$(", p):
                p = _skip_substitution(text, p)
                continue
            if c == "`":
                q = text.find("`", p + 1)
                p = len(text) if q < 0 else q + 1
                continue
            if c == '"':
                break
            p += 1
        if p >= len(text):
            out.append((text.count("\n", 0, j) + 1, "chuỗi không đóng", ""))
            break
        line_no = text.count("\n", 0, j) + 1
        # the rest of the COMMAND, not just of the line: a prompt cut in the middle leaves words on
        # the lines that follow, and the shell hands them to the reviewer as separate arguments.
        end = _command_end(text, p + 1)
        bad = _extra_words(text[p + 1:end])
        out.append((line_no, bad, text[j + 8:p][:60]))
        i = p + 1
    return out


def _command_end(text, p):
    """Where the shell command that starts before p ends."""
    in_str = False
    while p < len(text):
        c = text[p]
        if c == "\\":
            p += 2
            continue
        if text.startswith("$(", p):
            p = _skip_substitution(text, p)
            continue
        if c == '"':
            in_str = not in_str
            p += 1
            continue
        if c == "\n" and not in_str:
            return p
        p += 1
    return len(text)


def _extra_words(rest):
    """The words that follow the prompt in its command, minus the ones the tool allows."""
    s = rest.lstrip()
    if not s or s.startswith(TERMINATORS) or s.startswith("#"):
        return ""
    m = re.match(r"([A-Za-z_][A-Za-z0-9_-]*)", s)
    if not m:
        return s.split()[0] if s.split() else ""
    word = m.group(1)
    if word in EXTRA_WORDS:
        s = s[m.end():].lstrip()
        if not s or s.startswith(TERMINATORS):
            return ""
        return word
    return word


def _skip_substitution(text, p):
    """The end of a `$( … )` substitution, quotes inside it included."""
    p += 2
    depth = 1
    while p < len(text) and depth:
        c = text[p]
        if c == "\\":
            p += 2
            continue
        if text.startswith("$(", p):
            depth += 1
            p += 2
            continue
        if c == "(":
            depth += 1
        elif c == ")":
            depth -= 1
        p += 1
    return p


def check(path):
    """The prompts of one file that the shell would cut in pieces."""
    text = open(path, encoding="utf-8").read()
    return [(ln, extra, head) for ln, extra, head in scan(text) if extra]


def selftest():
    good = (
        'critic "Hãy mở ảnh, viết BLIND.md ở đây, mỗi ảnh một dòng:\n'
        '#n TÊN: <tên> | CHẮC: cao\n'
        'rồi in lại nó."\n'
        'critic "$(get_prompt "step1-outline")\n'
        'Thư mục làm việc của bạn: $W."\n'
        'critic "Hãy gọi tên." no-verdict\n'
        'critic "Hãy gọi tên." no-verdict); then\n'
    )
    broken = (
        'critic "ĐỘ CHẮC: một tên đúng nhưng "chắc thấp" vẫn là KHỚP, một tên sai nhưng "chắc cao"'
        ' vẫn là HỎNG.\n'
        'Viết PROPS-REVIEW.md ở thư mục này theo mẫu:\n'
        'rồi in lại nó."\n'
    )
    import tempfile
    failures = []
    with tempfile.TemporaryDirectory() as tmp:
        ok = os.path.join(tmp, "ok.sh")
        with open(ok, "w", encoding="utf-8") as fh:
            fh.write(good)
        bad = os.path.join(tmp, "bad.sh")
        with open(bad, "w", encoding="utf-8") as fh:
            fh.write(broken)
        if check(ok):
            failures.append("một prompt đúng bị báo hỏng")
        if not check(bad):
            failures.append("một prompt bị cắt không bị bắt")
    if failures:
        for f in failures:
            print("FAIL", f)
        return 1
    print("ok  the checker catches a prompt the shell would cut")
    return 0


def main():
    if "--selftest" in sys.argv:
        return selftest()
    files = [a for a in sys.argv[1:] if not a.startswith("-")] or DEFAULT
    bad = 0
    for f in files:
        for line_no, extra, head in check(f):
            bad += 1
            print(f"{f}:{line_no}: prompt bị cắt — sau chuỗi còn lại: {extra!r}\n    …{head}…")
    if bad:
        print(f"\n{bad} prompt không tới người chấm nguyên vẹn.")
        return 1
    print("ok  mọi prompt tới người chấm nguyên vẹn")
    return 0


if __name__ == "__main__":
    sys.exit(main())
