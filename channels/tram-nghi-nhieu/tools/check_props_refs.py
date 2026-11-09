#!/usr/bin/env python3
"""The props reports must still point at the same props — python3 check_props_refs.py <episode>

The props round judges the objects of `src/props.js` by their **position** in the catalogue: the
critic writes "#25 bàn tay người", the image is `review/props/p_25.jpg`, and the director's cut says
"đã sửa #25 bàn tay, giữ nguyên". That trail breaks the moment a prop is **inserted** into the
catalogue: every later prop moves one place, and the numbers in the old reports point at the wrong
objects while the images show the new ones.

In tap-01 it already happened: the round-5 review fixed "#25 bàn tay người" (a hand that read as a
wooden mannequin foot), and the cut repeated the number. A prop was inserted before the hand, so
today "#25" is the dry bench and the hand is "#26" — the reader who opens `p_25.jpg` to check the
hand's fix finds a bench, and the hand's fix looks unverified.

So this check reads the catalogue and the props reports, and asks one question of every reference to
a prop: **does the catalogue's N-th prop still carry that name?** The names in the reports are
shortened ("#12 cân bếp" for "cân nhà bếp có mặt đồng hồ kim"), so the comparison is on words: every
content word of the written name must appear in the catalogue's name at that number. Two ways out,
and both are right: re-number the reports (or re-write the cut) so the numbers are the catalogue's,
or move the prop so the numbers stay put. A number that means something else is worse than no
number, because it looks right.

Only the documents that gate the film are read: the director's cut and the **last** review. The
older rounds are history — their numbers were right for the catalogue of their day, and nobody acts
on them any more.

Only four **shapes** count as a reference to a prop; the rest of a report is prose:

    #25 bàn tay người — B — HỎNG — …        the review's verdict row
    | **Bàn thí nghiệm (#16)** — …           the cut's table row (name before the number)
    **#5 quần đùi hai ống** — …              the cut's bold item (name after the number)
    (#2 kẹp quần áo, #9 bồn chậu, …)        the cut's inline list (name after the number)

The blind namer's own words ("#7 TÊN: áo thun kem bị ướt nước…") are **not** compared: the namer
writes what a viewer would call it, the catalogue writes the film's own name for it. The summary
line ("nhóm A: #2 (kẹp quần áo gỗ)") is a restatement of the rows above it, not a reference.

Exit code: 0 every reference matches; 1 some do not; 2 usage.
"""
import os
import re
import sys
import unicodedata

# the words that are not part of a name: they glue a phrase together
STOP = {'và', 'của', 'là', 'có', 'được', 'với', 'như', 'một', 'cái', 'chiếc', 'con', 'bị',
        'thay', 'cho', 'hay', 'hoặc', 'để', 'khi', 'ở', 'này', 'đó', 'nên', 'đã', 'sẽ', 'vẫn'}

# "#25 bàn tay người — B — HỎNG" — the review's verdict row, at the start of a line
VERDICT = re.compile(r'(?m)^#(\d+)\s+(.+?)\s+—\s+[AB]\s+—')
# "| **Bàn thí nghiệm (#16)** — …" — the cut's table row: the name comes before the number
ROW = re.compile(r'\|\s*\*\*([^*]{2,60}?)\s*\(#(\d+)\)\*\*')
# "**#5 quần đùi hai ống** — …" — the cut's bold item: the name comes after the number
BOLD = re.compile(r'\*\*#(\d+)\s+([^*]{2,60}?)\*\*')
# "(#2 kẹp quần áo, #9 bồn chậu, …)" — the cut's inline list: the name comes after the number
INLINE = re.compile(r'\(#(\d+)\s+([^,()]{2,40})[,)]')
WORD = re.compile(r'[a-zà-ỹ]{2,}')


def strip_accents(s):
    s = s.lower()
    return ''.join(c for c in unicodedata.normalize('NFD', s) if not unicodedata.combining(c))


def catalogue_names(ep):
    """the names of the props catalogue, in order — None when the episode has none yet

    An episode that has not reached the props step has no `src/props.js`. That is not an error and
    not a crash: there is nothing to check yet, and a traceback here would send the next agent
    hunting for a broken tool instead of reading the message.
    """
    try:
        src = open(os.path.join(ep, 'src', 'props.js'), encoding='utf8').read()
    except OSError:
        return None
    i = src.find('export const PROPS')
    if i < 0:
        return None
    body = src[i:]
    return re.findall(r"^\s{2}'([^']+)'\s*:", body, re.M)


def prop_words(name):
    return {w for w in WORD.findall(strip_accents(name)) if w not in STOP}


def report_files(ep):
    """the two documents that gate the film: the director's cut, and the last review"""
    d = os.path.join(ep, 'review')
    if not os.path.isdir(d):
        return []
    files = [f for f in os.listdir(d) if re.fullmatch(r'PROPS-REVIEW-(\d+)\.md', f)]
    out = []
    if files:
        last = max(files, key=lambda f: int(re.search(r'(\d+)', f).group(1)))
        out.append(os.path.join(d, last))
    cut = os.path.join(d, 'PROPS-DIRECTORS-CUT.md')
    if os.path.isfile(cut):
        out.append(cut)
    return out


def references(text):
    """every (number, name) the report points at a prop with"""
    out = []
    for m in VERDICT.finditer(text):
        out.append((int(m.group(1)), m.group(2).strip()))
    for m in ROW.finditer(text):
        out.append((int(m.group(2)), m.group(1).strip()))
    for m in BOLD.finditer(text):
        out.append((int(m.group(1)), m.group(2).strip()))
    for m in INLINE.finditer(text):
        out.append((int(m.group(1)), m.group(2).strip()))
    return out


def check(ep):
    names = catalogue_names(ep)
    if not names:
        return None      # no catalogue yet — nothing to check
    cat = [prop_words(n) for n in names]
    # which catalogue entry owns each word: a word that only one entry has is a *name* word
    owner = {}
    for i, ws in enumerate(cat):
        for w in ws:
            owner.setdefault(w, set()).add(i)

    problems = []
    for path in report_files(ep):
        text = open(path, encoding='utf8').read()
        for n, name in references(text):
            words = prop_words(name)
            if not words:
                continue
            if not any(w in owner for w in words):
                continue          # not a reference to a prop (a line number, a round number)
            if n < 1 or n > len(names):
                problems.append((os.path.basename(path), '#%d %s' % (n, name),
                                 'danh mục có %d vật, không có vật #%d' % (len(names), n), 'error'))
                continue
            missing = words - cat[n - 1]
            if not missing:
                continue          # the number still points at the prop that was written
            kind, why = one_detail(n, name, words, missing, names, cat, owner)
            problems.append((os.path.basename(path), '#%d %s' % (n, name), why, kind))
    return problems


def one_detail(n, name, words, missing, names, cat, owner):
    """what happened, and how serious it is

    Two kinds, and they are not the same:

    - **error** — the name belongs to another prop, so the number points at the wrong object. The report
      cannot be followed any more: the reader opens `p_NN.jpg` and sees something else. This must stop
      the round.
    - **note** — the number is right but the written name is not the catalogue's name for it (the critic
      called it "bàn thí nghiệm", the catalogue calls it "bàn gỗ với hai mặt kính và vách ngăn"). The
      trail still works; the film's vocabulary and the catalogue's have drifted apart. That is worth
      saying, and it is not worth failing a round over — a critic that shortened a name has not broken
      anything.
    """
    distinctive = {w for w in words if len(owner.get(w, ())) == 1}
    elsewhere = None
    if distinctive:
        holders = set.intersection(*[owner[w] for w in distinctive])
        if len(holders) == 1:
            elsewhere = holders.pop()
    if elsewhere is not None and elsewhere != n - 1:
        return ('error', '"%s" là vật #%d trong danh mục (%s), không phải #%d (%s) — '
                'số trong bản chấm đã trỏ sang vật khác'
                % (name, elsewhere + 1, names[elsewhere], n, names[n - 1]))
    return ('note', '"%s" không phải tên vật #%d — danh mục gọi nó là "%s"; số vẫn đúng, nhưng tên nên '
            'theo danh mục để người đọc tìm thấy vật'
            % (name, n, names[n - 1]))


def selftest():
    import shutil
    import tempfile
    failures = []

    def check_case(name, cond, detail=""):
        print("%-4s %s" % ("ok" if cond else "FAIL", name))
        if not cond:
            failures.append(name + (" — " + detail if detail else ""))

    root = tempfile.mkdtemp(prefix="lemo-props-refs-")
    try:
        ep = os.path.join(root, "tap-x")
        os.makedirs(os.path.join(ep, 'src'))
        os.makedirs(os.path.join(ep, 'review'))

        def catalogue(*names):
            with open(os.path.join(ep, 'src', 'props.js'), 'w', encoding='utf8') as fh:
                fh.write("export const PROPS = {\n")
                for i, n in enumerate(names):
                    fh.write("  '%s': () => p%d(),\n" % (n, i))
                fh.write("};\n")

        def write(fname, text):
            with open(os.path.join(ep, 'review', fname), 'w', encoding='utf8') as fh:
                fh.write(text)

        catalogue('kẹp quần áo bằng gỗ', 'bàn phơi gỗ có nan', 'bàn tay người')

        # a review whose numbers match the catalogue
        write('PROPS-REVIEW-1.md',
              "#1 kẹp quần áo bằng gỗ — A — KHỚP — người xem gọi: \"kẹp gỗ\"\n"
              "#3 bàn tay người — B — HỎNG — người xem gọi: \"bàn chân\"\n")
        check_case("bản chấm khớp danh mục thì không báo", not check(ep))

        # the blind namer writes his own words — that is not a reference to a catalogue name
        write('PROPS-REVIEW-1.md',
              "#1 kẹp quần áo bằng gỗ — A — KHỚP — người xem gọi: \"kẹp gỗ\"\n"
              "#3 bàn tay người — B — HỎNG — người xem gọi: \"bàn chân\"\n"
              "# BLIND\n"
              "#3 TÊN: bàn chân mannequin gắn vào một cán gỗ dài | CHẮC: thấp | THẤY: một khối gỗ\n")
        check_case("tên của người đoán mù không bị so với danh mục", not check(ep))

        # a summary line restates the rows: it is not a new reference
        write('PROPS-REVIEW-1.md',
              "#1 kẹp quần áo bằng gỗ — A — KHỚP — người xem gọi: \"kẹp gỗ\"\n"
              "#3 bàn tay người — B — HỎNG — người xem gọi: \"bàn chân\"\n"
              "- Tổng hợp: 1 vật HỎNG — nhóm A: #1 (kẹp quần áo gỗ), #2 (lưới kim loại thay nan gỗ)\n")
        check_case("dòng tổng hợp không bị coi là cách viện dẫn mới", not check(ep))

        # the catalogue grew: the hand moved from #2 to #3
        write('PROPS-REVIEW-2.md', "#2 bàn tay người — B — HỎNG — người xem gọi: \"bàn chân\"\n")
        probs = check(ep)
        check_case("số cũ không trỏ vào vật cũ thì báo", len(probs) == 1, str(probs))
        check_case("số dịch chỗ thì là lỗi, không phải ghi chú",
                   bool(probs) and probs[0][3] == 'error', str(probs))
        check_case("báo đúng vật đã dịch chỗ",
                   bool(probs) and 'bàn tay người' in probs[0][2] and '#3' in probs[0][2], str(probs))

        # the cut's table row: the name comes before the number
        write('PROPS-DIRECTORS-CUT.md',
              "| **Cân bếp (#1)** — mặt đồng hồ | số trên mặt cân |\n")
        probs = check(ep)
        check_case("tên viết tắt trong bản cắt vẫn khớp", len(probs) == 1, str(probs))

        # a name that is not the catalogue's name at that number
        write('PROPS-DIRECTORS-CUT.md',
              "| **Bàn thí nghiệm (#1)** — nhãn đứng | nhãn che mất giọt |\n")
        probs = check(ep)
        check_case("tên không phải của danh mục thì báo",
                   any('không phải tên vật #1' in p[2] for p in probs), str(probs))
        check_case("tên không khớp thì chỉ là ghi chú, không chặn vòng",
                   sum(1 for p in probs if p[3] == 'note') == 1
                   and all(p[3] == 'error' for p in probs if 'đã trỏ sang vật khác' in p[2]),
                   str(probs))
    finally:
        shutil.rmtree(root, ignore_errors=True)
    total = 10
    for f in failures:
        print("FAIL %s" % f)
    print("%d ca đều đúng" % (total - len(failures)) if not failures else "%d ca sai" % len(failures))
    return 1 if failures else 0


if __name__ == '__main__':
    if '--selftest' in sys.argv:
        sys.exit(selftest())
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    probs = check(sys.argv[1])
    if probs is None:
        print('props: tập này chưa có danh mục vật (src/props.js) — chưa đến bước vật, không có gì để kiểm tra.')
        sys.exit(0)
    errors = [p for p in probs if p[3] == 'error']
    notes = [p for p in probs if p[3] != 'error']
    for f, ref, why, kind in probs:
        print("%s%s: %s — %s" % (f, '' if kind == 'error' else ' (ghi chú)', ref, why))
    if errors:
        print("props: %d cách viện dẫn không còn trỏ vào vật cũ — sửa lại số trong bản chấm, "
              "hoặc dời vật để số không dịch." % len(errors))
        sys.exit(1)
    if notes:
        print("props: mọi cách viện dẫn vẫn trỏ đúng vật; %d tên viết không theo danh mục "
              "(xem dòng trên — không chặn vòng)." % len(notes))
        sys.exit(0)
    print("props: mọi cách viện dẫn vẫn trỏ đúng vật.")
    sys.exit(0)
