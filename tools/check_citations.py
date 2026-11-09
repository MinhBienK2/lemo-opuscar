"""Check that every source in a research file is traceable: python tools/check_citations.py <file.md> [<file.md> ...]

The check proves itself: python tools/check_citations.py --selftest runs its own cases — a source that cannot be
looked up must be caught, a good file must pass — on files written to a temporary directory.

A source entry is a list item or a blockquote that looks like a reference: it carries a year and a citation-ish pattern
(an author and a year, a journal-ish word, or a DOI/PMID/URL). Every entry must name a place to look the source up:
DOI:, PMID: (PubMed:), http://, https:// or arXiv:. A source that is cited with an identifier elsewhere in the same file
counts as traceable, so a short "sources used" list at the end of a research file does not have to repeat the DOI.

Prose is left alone: a line without a year is not a source, and the file's own "no sources" boilerplate is skipped.

Exit code: 0 every source is traceable; 1 some source is not; 2 usage.
"""
import os, re, subprocess, sys, tempfile

LIST_ITEM = re.compile(r'^\s*(?:[-*+]\s+|\d+[.)]\s+)')
QUOTE = re.compile(r'^\s*>')
HEADING = re.compile(r'^\s*#{1,6}\s')
YEAR = re.compile(r'\b(?:18|19|20)\d{2}\b')
IDENTIFIER = re.compile(r'(?i)(?:\bdoi\s*:?\s*(?!<doi\s+or\s+link>)\S|\bpmid\s*:?\s*\d+|\bpubmed\s*:?\s*\S|\barxiv\s*:?\s*\S|https?://(?!<)\S)')
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


def selftest():
    """The check's own cases: every defect it exists to catch must be caught, every good file must pass.

    The files are the research file of a real episode ("Vì sao phơi quần áo cần gió?", tập 01 of the channel
    Trạm Nghĩ Nhiều) — the good ones as they are, the bad ones as they were when the defect was found. Every case
    is written to a temporary directory, so the check never reads the repository."""
    script = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'check_citations.py')

    def run(text):
        """a research file in a temporary directory, checked from scratch"""
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, 'FACTS.md')
            with open(path, 'w', encoding='utf8') as f:
                f.write(text)
            p = subprocess.run([sys.executable, script, path], capture_output=True, text=True)
            return p.returncode, p.stdout + p.stderr

    # every source carries its identifier
    good = '''# Facts — Vì sao phơi quần áo cần gió?

## Nguồn / Sources

- Alduchov, O. A. & Eskridge, R. E. (1996). Improved Magnus Form Approximation of Saturation Vapor Pressure. *Journal of Applied Meteorology* 35(4), 601–609. DOI: 10.1175/1520-0450(1996)035<0601:IMFAOS>2.0.CO;2
- Teske, M. E., Thistle, H. W., Riley, C. M. & Hewitt, A. J. (2018). Laboratory Measurements of Evaporation Rate of Droplets at Low Relative Wind Speed. *Transactions of the ASABE* 61(3), 919–923. DOI: 10.13031/trans.12743
- Wikipedia, *Evaporation* (truy cập 08/11/2026). https://en.wikipedia.org/wiki/Evaporation
'''
    # the same source, written once without its DOI and once with it: the second entry traces the first
    traceable = '''# Facts — Vì sao phơi quần áo cần gió?

## 8. Nước được giữ trong vải, và vải khô theo hai giai đoạn

- Sousa, L. H. C. D., Motta Lima, O. C. & Pereira, N. C. (2006). Analysis of Drying Kinetics and Moisture Distribution in Convective Textile Fabric Drying. *Drying Technology* 24(4), 485–497.

## Nguồn / Sources

- Sousa, L. H. C. D., Motta Lima, O. C. & Pereira, N. C. (2006), "Analysis of Drying Kinetics and Moisture Distribution in Convective Textile Fabric Drying", *Drying Technology* **24**(4), 485–497. DOI: 10.1080/07373930600611984
'''
    # a source with nowhere to look it up
    untraceable = '''# Facts — Vì sao phơi quần áo cần gió?

## 8. Nước được giữ trong vải, và vải khô theo hai giai đoạn

- **Dùng trong phim:** nước nằm trong vải không chỉ trên mặt mà còn bám trong sợi.

## Nguồn / Sources

- Sousa, L. H. C. D., Motta Lima, O. C. & Pereira, N. C. (2006). Analysis of Drying Kinetics and Moisture Distribution in Convective Textile Fabric Drying. *Drying Technology* 24(4), 485–497.
'''
    # a placeholder of the research template that was never filled in
    template = '''# Facts — Vì sao phơi quần áo cần gió?

## Nguồn / Sources

- Wikipedia, *Evaporation* (truy cập 08/11/2026). <doi or link>
'''
    # prose: a quote with no year in it and a prop with a clock on it are not sources
    prose = '''# Facts — Vì sao phơi quần áo cần gió?

## 1. Nước rời khỏi vải bằng cách hoá hơi

> "The specific latent heat of condensation of water in the temperature range from −25 °C to 40 °C is approximated by the following empirical cubic function: L_water(T) ≈ (2500.8 − 2.36 T + 0.0016 T² − 0.00006 T³) J/g"

- **Đạo cụ:** trên đồng hồ treo tường, kim chỉ ở 15:20; cân nhà bếp đặt cạnh khung phơi.
'''
    cases = [
        ('a source with no DOI/PMID/URL is caught', untraceable, 1, 'no DOI/PMID/URL in this source'),
        ('an unexpanded template placeholder is caught', template, 1, 'unexpanded template placeholder in research file'),
        ('every source with a DOI/PMID/URL passes', good, 0, 'every source is traceable'),
        ('a source cited with its identifier elsewhere in the same file is traceable', traceable, 0, 'every source is traceable'),
        ('prose with no year in it is not a source', prose, 0, 'every source is traceable'),
    ]
    failed = 0
    for name, text, code, expect in cases:
        got, out = run(text)
        if got == code and expect in out:
            print(f'ok   {name}')
        else:
            failed += 1
            print(f'FAIL {name} — expected exit {code} and "{expect}", got exit {got}: '
                  + ' / '.join(l.strip() for l in out.splitlines() if l.strip())[:200])
    if failed:
        print(f'FAIL: {failed} case(s)')
        return 1
    print('ok')
    return 0


def main():
    if '--selftest' in sys.argv[1:]:
        return selftest()
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
