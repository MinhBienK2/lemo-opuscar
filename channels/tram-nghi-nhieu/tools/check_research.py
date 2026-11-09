"""The research file of an episode must be written, not copied: python3 check_research.py <episode>

The outline gate reads `research/FACTS.md` and asks whether every claim of the film has a source. If the
file is still the template, the judge reads an empty file and has nothing to object to — the same silence
as a check that answers "yes" to every input. `check_facts.py` passes such a file (it has no duplicated
bullet and no wrong cross-reference), and `check_citations.py` only names the two lines it happens to
match, so nothing stops the film from being built on a research file nobody wrote.

This check says what is missing, in the file's own lines, before a review round is spent on it:

  1. the file exists and has content;
  2. no line still holds a placeholder of the template (`<Author>`, `<doi or link>`, `<value>`, …);
  3. there is at least one claim — a numbered section heading (`## 1. …`);
  4. there is at least one source — a line that carries a year next to an author, a journal or an
     identifier, the same test the library's `check_citations.py` uses;
  5. **no claim rests on Wikipedia alone** — an encyclopedia is a cross-reference, not a source: a claim
     whose every link is `wikipedia.org` is a claim without a primary source.

Exit code: 0 the research file is written; 1 it is not; 2 usage.

The shape asked here is **this channel's**: a claim is a numbered heading, `## 1. …`. A channel that keeps
its research file in another shape needs its own check — a check that asks one channel's shape and is run on
another channel's file reports errors on a file that was written correctly (N29).
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, os.path.join(LIB, 'tools'))
try:
    from check_citations import blocks, is_source          # the library's own test of "this line is a source"
except ImportError:                                        # pragma: no cover — the library is always there
    blocks = is_source = None

COMMENT = re.compile(r'<!--.*?-->', re.S)
CODE = re.compile(r'`[^`]*`')          # a mention inside `…` is not a slot to fill
# a placeholder of the template: <Author>, <Title of the paper>, <doi or link>, <value>, <claim, in the words
# the film will use>, <first page>–<last page>, <the sentence of the source, quoted>
PLACEHOLDER = re.compile(r'<\s*[^<>\n]{1,90}\s*>')
# an HTML tag is not a placeholder
TAG = re.compile(r'^(?:/?[a-z][a-z0-9]*(?:\s+[a-z-]+(?:\s*=\s*"[^"]*")?)*|/[a-z][a-z0-9]*)$', re.I)
# a claim: a numbered section heading
CLAIM = re.compile(r'^\s{0,3}#{2,4}\s*(?:\d+[.)]\s*)?\S')
NUMBERED = re.compile(r'^\s{0,3}#{2,4}\s*\d+[.)]\s*\S')


def placeholders(text):
    """The lines that still hold a template placeholder, with the placeholder itself."""
    out = []
    for no, line in enumerate(text.splitlines(), 1):
        stripped = CODE.sub('', COMMENT.sub('', line))
        if re.search(r'doi|https?://', line, re.I):
            continue        # a DOI may carry angle brackets of its own: 10.1175/…(1996)035<0601:IMFAOS>2.0.CO
        for m in PLACEHOLDER.finditer(stripped):
            inner = m.group(0)[1:-1].strip()
            if not inner or TAG.match(inner):
                continue
            if inner.startswith('!') or inner.startswith('?'):
                continue
            if '://' in inner:
                continue
            out.append((no, m.group(0)))
            break
    return out


def sources(text):
    """The blocks that look like a reference: a year next to an author, a journal or an identifier."""
    if is_source is None:
        return []
    return [b for b in blocks(text.splitlines()) if is_source(b['text'])]


def claims(text):
    """The claim sections of the file: each a heading with a number, and the lines under it."""
    out, cur = [], None
    for ln in text.splitlines():
        if NUMBERED.match(ln):
            cur = {'head': ln, 'lines': []}
            out.append(cur)
        elif cur is not None:
            cur['lines'].append(ln)
    return out


def wiki_only(text):
    """The claim sections that rest on Wikipedia alone — a claim with no primary source behind it.

    A primary source is a link that is not Wikipedia, or an identifier of its own (a DOI, an ISBN, an
    arXiv number): a book or a paper named with its publisher counts even without a link."""
    out = []
    for c in claims(text):
        body = '\n'.join(c['lines'])
        urls = re.findall(r'https?://[^\s)>\]]+', body)
        if not urls or not all('wikipedia.org' in u for u in urls):
            continue
        if re.search(r'\b(?:doi|isbn|issn|arxiv|pmid)\b', body, re.I):
            continue
        out.append((c['head'].strip(), urls))
    return out


def check(path):
    """The problems of one research file; each as (line, message)."""
    try:
        text = open(path, encoding='utf-8').read()
    except OSError as e:
        return [(0, f'cannot read the research file: {e.strerror}')]
    bad = []
    if not text.strip():
        return [(0, 'the research file is empty')]
    ph = placeholders(text)
    if ph:
        for no, what in ph:
            bad.append((no, f'the file still holds the template: {what}'))
    lines = text.splitlines()
    claims = [ln for ln in lines if NUMBERED.match(ln)]
    if not claims:
        bad.append((0, 'no claim found: a claim is a numbered heading, "## 1. …"'))
    src = sources(text)
    if not src:
        bad.append((0, 'no source found: a source is a line with a year next to an author, a journal or a DOI'))
    for head, urls in wiki_only(text):
        bad.append((0, f'{head} — the only link is Wikipedia; an encyclopedia is a cross-reference, '
                       f'not a source: give this claim a primary source (a book, a paper, a specification, '
                       f'a datasheet)'))
    return bad


def selftest():
    """The cases this check must get right — each one a real defect found in a real episode."""
    GOOD = """# Facts

## 1. Nước rời khỏi vải bằng cách hoá hơi

> "The specific latent heat of condensation of water is 2500.8 J/g"

Rogers, R. R. & Yau, M. K. (1989), *A Short Course in Cloud Physics*, Pergamon Press. DOI: 10.1000/xyz.

- **Dùng trong phim:** hai kilojoule bốn trăm năm mươi cho mỗi gram (2,44 kJ/g).
"""
    TEMPLATE = """# Facts — tên tập

Every number the film puts on screen has its source in this file.

## 1. <claim, in the words the film will use>

> <the sentence of the source, quoted>

<Author>, *<Title of the paper>*, **<Journal>** <volume>(<issue>), <year>, p. <first page>–<last page>. DOI: <doi or link>

- Used in the film: <the number that goes on screen, and where it appears>
- Scope: <what the source supports, and what it does not>

## Nguồn / Sources

- <Author> (<year>). <Title of the paper>. <Journal>. DOI: <doi or link>
"""
    cases = [
        ('a written file passes', GOOD, True),
        ('a file with no claim fails', GOOD.replace('## 1. Nước rời khỏi vải bằng cách hoá hơi', '## Ghi chú'), False),
        ('a file with no source fails', GOOD.replace('DOI: 10.1000/xyz.', 'in a book.').replace('(1989)', ''), False),
        ('the template itself fails', TEMPLATE, False),
        ('a claim resting on Wikipedia alone fails',
         GOOD.replace('DOI: 10.1000/xyz.', 'Wikipedia, *Joule heating*. https://en.wikipedia.org/wiki/Joule_heating'), False),
        ('a claim with a primary source beside Wikipedia passes',
         GOOD.replace('DOI: 10.1000/xyz.', 'Wikipedia, *Joule heating*. https://en.wikipedia.org/wiki/Joule_heating\n'
                                           'Rogers, R. R. (1989), *Cloud Physics*, Pergamon. DOI: 10.1000/abc.'), True),
    ]
    bad = 0
    for name, text, want_ok in cases:
        path = '/tmp/check_research_selftest.md'
        open(path, 'w', encoding='utf-8').write(text)
        problems = check(path)
        got_ok = not problems
        mark = 'ok  ' if got_ok == want_ok else 'FAIL'
        if got_ok != want_ok:
            bad += 1
        print(f"{mark} {name}" + ('' if got_ok else f" — {problems[0][1]}"))
    print('ok' if not bad else f'FAIL: {bad} case(s)')
    return 0 if not bad else 1


def main():
    args = sys.argv[1:]
    if args and args[0] == '--selftest':
        return selftest()
    if not args:
        print('usage: python3 check_research.py <episode-folder>', file=sys.stderr)
        return 2
    ep = args[0]
    path = os.path.join(ep, 'research', 'FACTS.md') if os.path.isdir(ep) else ep
    bad = check(path)
    for no, msg in bad:
        print(f"{path}:{no}: {msg}" if no else f"{path}: {msg}")
    print(f"check_research: {'the research file is written' if not bad else str(len(bad)) + ' problem(s)'}")
    return 0 if not bad else 1


if __name__ == '__main__':
    sys.exit(main())
