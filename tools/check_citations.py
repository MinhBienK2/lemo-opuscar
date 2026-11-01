"""Check that every source in a research file is traceable: python tools/check_citations.py <file.md> [<file.md> ...]

A source entry is a list item or a blockquote that looks like a reference: it carries a year and a citation-ish pattern
(an author and a year, a journal-ish word, or a DOI/PMID/URL). Every entry must name a place to look the source up:
DOI:, PMID: (PubMed:), http://, https:// or arXiv:. A source that is cited with an identifier elsewhere in the same file
counts as traceable, so a short "sources used" list at the end of a research file does not have to repeat the DOI.

Prose is left alone: a line without a year is not a source, and the file's own "no sources" boilerplate is skipped.

Exit code: 0 every source is traceable; 1 some source is not; 2 usage.
"""
import re, sys

LIST_ITEM = re.compile(r'^\s*(?:[-*+]\s+|\d+[.)]\s+)')
QUOTE = re.compile(r'^\s*>')
HEADING = re.compile(r'^\s*#{1,6}\s')
YEAR = re.compile(r'\b(?:18|19|20)\d{2}\b')
IDENTIFIER = re.compile(r'(?i)(?:\bdoi\s*:\s*(?!<doi\s+or\s+link>)\S|\bpmid\s*:\s*\S|\bpubmed\s*:\s*\S|\barxiv\s*:\s*\S|https?://(?!<)\S)')
TEMPLATE_PLACEHOLDER = re.compile(r'(?i)<(?:doi\s+or\s+link|author|the\s+sentence\s+of\s+the\s+source|claim,\s+in\s+the\s+words)>')
JOURNALISH = re.compile(r'(?i)\b(?:journal\w*|review\w*|science|nature|psycholog\w*|cognition|psychiatr\w*|perspectives?|'
                        r'medicine|biology|physics|chemistry|econom\w*|sociolog\w*|communication\w*|proceedings?|transactions?|'
                        r'bulletin|quarterly|annals|archives?|encyclop\w*|dictionar\w*|handbook|atlas|monograph\w*|universit\w*|'
                        r'institute|association|gazette|annual|international|compendium|antholog\w*)\b')
MONTH = (r'(?:january|february|march|april|may|june|july|august|september|october|november|december'
         r'|jan|feb|mar|apr|jun|jul|aug|sept?|oct|nov|dec)')
# an author: a name with initials (John D. Eastwood), a surname with initials (Killingsworth, M. A.), "et al.", two surnames
# joined by &, or a surname that carries the year itself (Kaplan (1989))
AUTHOR = re.compile(
    r"(?:\b[A-ZÀ-Þ][a-zà-öø-ÿ’'\-]{2,}\s+(?:[A-Z]\.\s*)+"            # John D. Eastwood
    r"|\b[A-ZÀ-Þ][a-zà-öø-ÿ’'\-]{2,},\s*(?:[A-Z]\.\s*)+"             # Killingsworth, M. A.
    r"|\b[A-Z]\.\s*[A-Z]\."                                          # M. A.
    r"|\b[A-ZÀ-Þ][a-zà-öø-ÿ’'\-]{2,}\s+et\s+al\."                     # Hartig et al.
    r"|\b[A-ZÀ-Þ][a-zà-öø-ÿ’'\-]{2,}\s*&\s*[A-ZÀ-Þ][a-zà-öø-ÿ’'\-]{2,}"   # Smallwood & Schooler
    rf"|\b(?!{MONTH}\b)[A-ZÀ-Þ][a-zà-öø-ÿ’'\-]{{3,}}\s*\(?(?:18|19|20)\d{{2}}\b)")
NAME = re.compile(r"\b[A-ZÀ-Þ][a-zà-öø-ÿ’'\-]{3,}\b")      # a capitalised word: an author, a title, a journal
NO_SOURCE = re.compile(r'(?i)\b(?:no|without|không có)\s+(?:any\s+)?sources?\b')


def blocks(lines):
    """The text blocks of a markdown file: {kind, start, text}. A block is a paragraph, a list item or a quote."""
    out, cur = [], None
    for no, line in enumerate(lines, 1):
        if not line.strip() or HEADING.match(line):
            cur = None
            continue
        kind = 'quote' if QUOTE.match(line) else ('list' if LIST_ITEM.match(line) else 'para')
        cont = (cur is not None and cur['kind'] == kind
                and (kind == 'quote' or kind == 'para' or (line[:1].isspace() and not LIST_ITEM.match(line))))
        if cont:
            cur['lines'].append(line)
        else:
            cur = {'kind': kind, 'start': no, 'lines': [line]}
            out.append(cur)
    for b in out:
        b['text'] = ' '.join(l.strip() for l in b['lines'])
    return out


def is_source(text):
    """True when a block looks like a reference: a year next to an author, a journal or an identifier.

    A year alone is not enough — a plot note with a date in it is prose, not a source."""
    if NO_SOURCE.search(text): return False
    years = [m.start() for m in YEAR.finditer(text)]
    if not years: return False
    near = lambda m, d: any(abs(m.end() - y) <= d for y in years)
    if any(near(m, 60) for m in AUTHOR.finditer(text)): return True
    if any(near(m, 40) for m in JOURNALISH.finditer(text)): return True
    return any(near(m, 60) for m in IDENTIFIER.finditer(text))


def same_source(a, b):
    """True when two blocks point at the same source: the same year and at least one name in common."""
    return bool(set(YEAR.findall(a)) & set(YEAR.findall(b))) and bool(set(NAME.findall(a)) & set(NAME.findall(b)))


def check(path):
    """The source entries of one file that cannot be looked up; each with the line it starts on."""
    try:
        lines = open(path, encoding='utf-8').read().splitlines()
    except OSError as e:
        print(f'check_citations: cannot read {path}: {e.strerror}')
        return None
    bs = blocks(lines)
    entries = [b for b in bs if b['kind'] in ('list', 'quote') and is_source(b['text'])]
    found = [b for b in bs if is_source(b['text']) and IDENTIFIER.search(b['text'])]
    bad = []
    for no, line in enumerate(lines, 1):
        if TEMPLATE_PLACEHOLDER.search(line):
            bad.append((no, 'unexpanded template placeholder in research file'))
    for e in entries:
        if TEMPLATE_PLACEHOLDER.search(e['text']):
            continue
        if IDENTIFIER.search(e['text']): continue
        if any(same_source(e['text'], f['text']) for f in found if not TEMPLATE_PLACEHOLDER.search(f['text'])): continue
        bad.append((e['start'], 'no DOI/PMID/URL in this source'))
    for no, msg in bad:
        print(f'{path}:{no}: {msg}')
    return bad


def main():
    args = sys.argv[1:]
    if not args:
        print('usage: python tools/check_citations.py <file.md> [<file.md> ...]', file=sys.stderr)
        return 2
    n, unreadable = 0, False
    for path in args:
        bad = check(path)
        if bad is None:
            unreadable = True
            continue
        n += len(bad)
        print(f'check_citations: {len(bad)} problem(s) in {path}' if bad else f'check_citations: OK {path}')
    if unreadable: return 2
    if n: return 1
    print('check_citations: every source is traceable')
    return 0


if __name__ == '__main__':
    sys.exit(main())
