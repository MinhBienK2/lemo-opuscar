"""Every link in every document of the library points at something that exists.

    python3 tools/check_doc_links.py [root]

A document is read by an agent that will follow its pointers. A pointer to a file that is not there
is not a broken link the reader notices: the agent moves on, and the rule the pointer carried never
reaches anybody. So a pointer is a promise, and this check is the promise kept.

What is checked: the target of every markdown link ``](target)`` in every ``.md`` file of the
repository, resolved against the folder of the file that holds it. What is not checked: a URL, an
anchor (``#section``), an image with no file behind it, a path that is a pattern rather than a file.

Exit code: 0 every link resolves; 1 some link does not.
"""
import os
import re
import sys

LINK = re.compile(r'\]\(([^)]+)\)')
CODE = re.compile(r'`[^`]*`')
FENCE = re.compile(r'```.*?```', re.S)
SKIP_DIRS = {'.git', 'node_modules', '.venv', 'out', '__pycache__', '.pytest_cache'}
SKIP_NAMES = {'_template'}   # a scaffold's links point at files the author has not written yet


def markdown_files(root):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith('.') or d in {'.agents', '.claude', '.github'}]
        dirnames[:] = [d for d in dirnames if d not in SKIP_NAMES]
        for name in filenames:
            if name.endswith('.md'):
                yield os.path.join(dirpath, name)


def target_of(link):
    """the path part of a link: 'a.md#anchor' → 'a.md', '<a b.md>' → 'a b.md'"""
    link = link.strip()
    if link.startswith('<'):
        link = link[1:link.find('>')] if '>' in link else link[1:]
    if ' ' in link and not link.startswith('<'):
        link = link.split(' ')[0]
    link = link.split('#')[0].split('?')[0]
    return link.strip()


def broken_links(root):
    """the links of the documents under `root` that point at nothing; each as (file, target)"""
    out = []
    for path in markdown_files(root):
        try:
            text = open(path, encoding='utf8', errors='replace').read()
        except OSError:
            continue
        # a link written inside code is an example, not a pointer: 'ctx.subj[name](t)' is a call, not a target
        text = FENCE.sub('', CODE.sub('', text))
        for raw in LINK.findall(text):
            tgt = target_of(raw)
            if not tgt or tgt.startswith(('http://', 'https://', 'mailto:', '//')):
                continue
            if os.path.isabs(tgt):
                continue
            full = os.path.normpath(os.path.join(os.path.dirname(path), tgt))
            if not os.path.exists(full):
                out.append((path, tgt))
    return out


def selftest():
    """The shapes a pointer really takes — a link that resolves, and one that does not."""
    import tempfile
    with tempfile.TemporaryDirectory() as d:
        os.makedirs(os.path.join(d, 'docs'))
        open(os.path.join(d, 'docs', 'a.md'), 'w', encoding='utf-8').write(
            '# A\n\n[x](b.md) and [y](b.md#anchor) and [z](https://example.com) '
            'and `not a link](nope.md)`\n')
        open(os.path.join(d, 'docs', 'b.md'), 'w', encoding='utf-8').write('# B\n')
        open(os.path.join(d, 'docs', 'c.md'), 'w', encoding='utf-8').write('# C\n\n[x](gone.md)\n')
        cases = [
            ('a link to a file that is there resolves', 'docs/a.md', False),
            ('a link to a file that is not there is caught', 'docs/c.md', True),
        ]
        bad = 0
        for name, rel, want_bad in cases:
            broken = broken_links(d)
            hits = [t for p, t in broken if os.path.relpath(p, d) == rel]
            ok = bool(hits) == want_bad
            if not ok:
                bad += 1
            print(('ok   ' if ok else 'FAIL ') + name)
        print('ok' if not bad else f'FAIL: {bad} case(s)')
        return 0 if not bad else 1


def main():
    if '--selftest' in sys.argv:
        return selftest()
    root = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
    bad = 0
    for path, tgt in broken_links(root):
        rel = os.path.relpath(path, root)
        print(f"BAD {rel}: link target not found: {tgt}")
        bad += 1
    if bad:
        print(f"doc-links: FAILED ({bad} broken link(s))")
        return 1
    print("doc-links: PASS")
    return 0


if __name__ == '__main__':
    sys.exit(main())
