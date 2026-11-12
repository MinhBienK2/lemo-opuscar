"""The layout of an episode: what may sit where, and where everything else belongs.

  python3 layout.py <episode>      list what is off the layout, and where it belongs; exit 1 when something is
  python3 layout.py --selftest

The layout itself is written once, in CHANNEL.md ("Một tập"). This checker is that tree in code: gate.py status
and every review.sh round print its findings, so an agent sees a stray folder the moment it makes one. It never
moves or deletes anything.
"""
import fnmatch, os, re, sys

ROOT_FILES = ('TREATMENT.md', 'LOOK.md', 'COMPONENTS_SPEC.md', 'CREDITS', 'film.json', 'index.html', 'build.sh',
              'events.json', 'poster.jpg', 'mk_timeline.py', '*.mp4', '*.transcript.srt', '*.fingerprint.json')
ROOT_DIRS = ('research', 'voice', 'src', 'review', 'out')   # research, voice, out: anything inside
SRC_FILES = ('*.js', 'MAP.md')
SRC_DIRS = {'props': ('*.js',)}
REVIEW_FILES = ('outline.json', 'script.json', 'look.json', 'props.json', 'picture.json',
                'OUTLINE.md', 'SCRIPT.md', 'LOOK.md', 'PROPS.md', 'PICTURE.md', 'FINAL-QA.md', '.lock-*')
REVIEW_ROUND = re.compile(r'^(outline|script|look|props|picture|final)-\d+\.md$')
REVIEW_DIRS = ('hero', 'beatsheet')
# what the review before 2026-11-09 left behind: nothing reads it any more
OLD_REVIEW = ('*.pass', '*-REVIEW*.md', 'REVIEW*.md', '*-DIRECTORS-CUT.md', '*-REPORT.md', '*-FIX-*.md',
              'script-lines-*.json', '.round-*', '.attempts-*', '.review-*.lock')
OLD_REVIEW_DIRS = ('props',)
IMAGES = ('*.jpg', '*.jpeg', '*.png', '*.webp')

SCRATCH = 'ảnh thử: chuyển vào out/scratch/'
OLD = 'dấu của cách chấm cũ (trước 2026-11-09): không công cụ nào đọc nữa, xoá được'
KINDS = (SCRATCH, OLD)


def match(name, pats): return any(fnmatch.fnmatchcase(name, p) for p in pats)


def problems(ep):
    """[(path relative to the episode, what is wrong and where it belongs)]"""
    out = []

    def bad(rel, why): out.append((rel, why))
    for n in sorted(os.listdir(ep)):
        p = os.path.join(ep, n)
        if os.path.isdir(p):
            if n in ROOT_DIRS: continue
            if match(n, OLD_REVIEW): bad(n + '/', OLD); continue
            images = any(match(f, IMAGES) for f in os.listdir(p))
            bad(n + '/', SCRATCH if images else 'thư mục ngoài bố cục: bản thử để trong out/scratch/')
        elif match(n, ROOT_FILES): continue
        elif match(n, OLD_REVIEW): bad(n, OLD)
        elif n.endswith('.py') or n.endswith('.mjs') or n.endswith('.sh'):
            bad(n, 'công cụ chép vào tập: công cụ của kênh ở channels/tram-nghi-nhieu/tools/, gọi nó từ đó')
        elif match(n, IMAGES): bad(n, SCRATCH)
        else: bad(n, 'tệp ngoài bố cục (CHANNEL.md, "Một tập")')
    src = os.path.join(ep, 'src')
    if os.path.isdir(src):
        for n in sorted(os.listdir(src)):
            p = os.path.join(src, n)
            if os.path.isdir(p):
                if n in SRC_DIRS:
                    for f in sorted(os.listdir(p)):
                        if not match(f, SRC_DIRS[n]): bad(f'src/{n}/{f}', f'src/{n}/ chỉ giữ {", ".join(SRC_DIRS[n])}')
                else: bad(f'src/{n}/', 'thư mục ngoài bố cục: src/ giữ các tệp .js và src/props/')
            elif not match(n, SRC_FILES):
                bad(f'src/{n}', 'ghi chú về mã thì gộp vào src/MAP.md' if n.endswith('.md')
                    else 'src/ chỉ giữ mã .js (và src/MAP.md)')
    rv = os.path.join(ep, 'review')
    if os.path.isdir(rv):
        for n in sorted(os.listdir(rv)):
            p = os.path.join(rv, n)
            if os.path.isdir(p):
                if n in REVIEW_DIRS: continue
                bad(f'review/{n}/', OLD if n in OLD_REVIEW_DIRS or match(n, OLD_REVIEW) else SCRATCH)
            elif match(n, REVIEW_FILES) or REVIEW_ROUND.match(n): continue
            elif match(n, OLD_REVIEW): bad(f'review/{n}', OLD)
            elif match(n, IMAGES): bad(f'review/{n}', SCRATCH)
            else: bad(f'review/{n}', 'review/ chỉ giữ những gì review.py ghi, hero/ và beatsheet/')
    return out


def report(ep, limit=6):
    """short lines for a person: the leftovers of one kind are counted, not listed one by one"""
    P = problems(ep)
    if not P: return []
    R = []
    for kind in KINDS:
        ps = [p for p, w in P if w == kind]
        if not ps: continue
        shown = ', '.join(ps[:limit]) + (f' … (+{len(ps) - limit})' if len(ps) > limit else '')
        R.append(f'{kind} — {shown}')
    R += [f'{p} — {w}' for p, w in P if w not in KINDS]
    return R


def selftest():
    import shutil, tempfile
    tmp = tempfile.mkdtemp(prefix='layout-selftest-')
    ok = True

    def expect(cond, what):
        nonlocal ok
        print(('ok   ' if cond else 'FAIL ') + what)
        ok = ok and cond

    def touch(rel):
        p = os.path.join(ep, rel); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'w').close()
    try:
        ep = os.path.join(tmp, 'tap')
        for f in ('TREATMENT.md', 'LOOK.md', 'COMPONENTS_SPEC.md', 'CREDITS', 'film.json', 'index.html', 'build.sh',
                  'events.json', 'poster.jpg', 'tap.mp4', 'tap.transcript.srt', 'tap.fingerprint.json',
                  'research/FACTS.md',
                  'voice/lines.json', 'voice/c1.wav', 'src/film.js', 'src/set.js', 'src/shots.js', 'src/MAP.md',
                  'src/props.js', 'src/props/am-dun.js', 'src/props/_vai.js', 'review/outline.json',
                  'review/OUTLINE.md', 'review/outline-3.md', 'review/FINAL-QA.md', 'review/.lock-props',
                  'review/hero/h1.jpg', 'review/beatsheet/beats.json', 'out/scratch/t_1.jpg', 'out/video.mp4'):
            touch(f)
        expect(problems(ep) == [], 'the standard episode is clean')
        touch('review/stills3/t_1.jpg'); touch('stills/a.png')
        P = dict(problems(ep))
        expect(P.get('review/stills3/') == SCRATCH and P.get('stills/') == SCRATCH, 'scratch stills are sent to out/scratch/')
        touch('review/OUTLINE.pass'); touch('review/PROPS-REVIEW-2.md'); touch('review/.round-final.died')
        touch('.review-props.lock'); touch('review/props/p_1.jpg'); touch('.review-look.lock/pid')
        P = dict(problems(ep))
        expect(all(P.get(k) == OLD for k in ('review/OUTLINE.pass', 'review/PROPS-REVIEW-2.md', 'review/.round-final.died',
                                             '.review-props.lock', 'review/props/', '.review-look.lock/')),
               'the old review marks are named as such')
        touch('check_headroom.py'); touch('src/API.md'); touch('src/props/notes.txt')
        P = dict(problems(ep))
        expect('công cụ' in P.get('check_headroom.py', ''), 'a tool copied into the episode is caught')
        expect('MAP.md' in P.get('src/API.md', '') and 'src/props/notes.txt' in P, 'notes in src/ go to MAP.md')
        R = report(ep, limit=2)
        expect(any(r.endswith('(+4)') for r in R if r.startswith(OLD)), 'the report counts the leftovers instead of listing them')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print('layout selftest:', 'PASS' if ok else 'FAIL')
    return 0 if ok else 1


def main(a):
    if a[:1] == ['--selftest']: return selftest()
    if len(a) != 1 or not os.path.isdir(a[0]): sys.exit(__doc__)
    P = problems(os.path.abspath(a[0]))
    if not P:
        print('bố cục: đúng'); return 0
    print('bố cục: có thứ nằm sai chỗ (CHANNEL.md, "Một tập")')
    for kind in KINDS + tuple(dict.fromkeys(w for _, w in P if w not in KINDS)):
        ps = [p for p, w in P if w == kind]
        if ps: print(f'  {kind}:\n' + '\n'.join('    ' + p for p in ps))
    return 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
