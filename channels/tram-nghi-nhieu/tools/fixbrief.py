#!/usr/bin/env python3
"""The brief for a fixer: the items the critic failed, everything a fresh subagent needs to fix them alone.

  python3 channels/tram-nghi-nhieu/tools/fixbrief.py <episode> <step> [id …]
      step: look | props | picture        ids: default every item still to fix (FAIL)
  python3 channels/tram-nghi-nhieu/tools/fixbrief.py --selftest

The director does not open the critic's images. It hands each brief, as the whole prompt, to one fixer subagent:
what the critic saw and asked for, the questions every item must pass, the files the fixer may edit, the command
that renders the result, and the short text answer the director gets back. The fixer looks, edits, renders, looks
again, and answers in text. The critic stays independent: the next review round judges the fixed items in a fresh
session.

Props: one brief per prop (a line `=== BRIEF <id> ===` opens each), so fixers run in parallel, one file each.
Look and picture share src/film.js: one brief for at most MAX items, for one fixer; the items left over are named
at the end of the brief, for the next fixer, after this one.
Writes nothing but out/scratch/fix/<id>/only.json (the name list propcheck.mjs --only reads, for props).
"""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gate  # noqa: E402

CHANNEL = os.path.dirname(HERE)
LIB = os.path.abspath(os.path.join(CHANNEL, '..', '..'))
STEPS = ('look', 'props', 'picture')
CODE_SKIP = ('timeline.js', 'props.js')
MAX = 8   # items per look/picture fixer: one fixer's context holds this many frames and their code


def rubric_rows(step):
    import review
    _, crit = review.rubric(step)
    return crit


def rows_of(rec):
    v = rec.get('rows')
    return v if isinstance(v, dict) else {}


# ——— where an item lives ———

def code_hits(ep, lid, limit=8):
    """'src/film.js:515' places where the episode's code names this line id"""
    if not lid: return []
    pat = re.compile(r"""['"]%s['"]""" % re.escape(lid))
    hits = []
    for f in sorted(glob.glob(os.path.join(ep, 'src/**/*.js'), recursive=True)):
        if os.path.basename(f) in CODE_SKIP: continue
        for n, line in enumerate(open(f, encoding='utf-8', errors='replace'), 1):
            if pat.search(line):
                hits.append(f'{os.path.relpath(f, LIB)}:{n}')
                if len(hits) >= limit: return hits
    return hits


def look_rows(ep, lid):
    p = os.path.join(ep, 'LOOK.md')
    if not os.path.isfile(p) or not lid: return []
    pat = re.compile(r'\|\s*%s\s*\|' % re.escape(lid))
    return [f'LOOK.md:{n}: {line.strip()[:220]}' for n, line in enumerate(open(p, encoding='utf-8'), 1) if pat.search(line)]


def beats_by_id(ep):
    p = os.path.join(ep, 'review/beatsheet/beats.json')
    if not os.path.isfile(p): return {}
    return {str(b.get('id') or f"c{b['n']}"): b for b in json.load(open(p, encoding='utf-8'))}


def line_at(B, t):
    """the line spoken at t seconds, from the beat sheet"""
    if t is None: return None
    for k, b in B.items():
        if b.get('t0') is not None and b['t0'] <= t < b.get('t1', b['t0']): return k
    return None


def hero_time(stem):
    m = re.search(r't_?(\d+(?:\.\d+)?)$', stem)
    return float(m.group(1)) if m else None


def places(ep, lid):
    return [f'- `{h}`' for h in code_hits(ep, lid)] + [f'- {r}' for r in look_rows(ep, lid)]


# ——— the brief ———

def questions(crit):
    return [f'- **{c}**: {q}' for c, k, q in crit if k == 'CHẶN']


def judged(rec, crit):
    kinds = {c: k for c, k, _ in crit}
    out = []
    for c, (v, seen, fix) in rows_of(rec).items():
        if v != 'LỖI': continue
        out.append(f"- **{c}** [{kinds.get(c, '?')}] thấy: {seen}" + (f' → SỬA: {fix}' if fix else ''))
    return out or ['- (vòng chấm không để lại dòng LỖI nào: mở ảnh và tự nhìn theo các câu hỏi ở trên)']


def head(ep, step, ids, crit):
    rel = os.path.relpath(ep, LIB)
    return [f'# Sửa sau vòng chấm: {gate.WHAT[step]} ({step}) · {", ".join(ids)}', '',
            f'Tập: `{rel}`. Mọi lệnh chạy từ gốc thư viện `{LIB}`.',
            'Một người chấm độc lập vừa chấm các mục dưới đây là LỖI. Bạn là người sửa: tự nhìn, sửa, dựng lại, nhìn '
            'lại, rồi trả lời bằng chữ. Vòng chấm sau (một người chấm mới) chấm lại; bạn để `review/` nguyên như cũ.',
            'Người chấm có thể sai: mở ảnh nó nói tới và tự nhìn trước khi sửa. Khi nó sai, giữ nguyên mục đó và nói '
            'trong câu trả lời bạn thấy gì.', '',
            '## Câu hỏi mỗi mục phải ĐẠT (câu CHẶN của vòng chấm)'] + questions(crit) + ['']


def tail():
    return ['## Xong khi',
            'Với từng mục: ảnh MỚI (dựng sau lần sửa cuối) trả lời ĐẠT mọi câu hỏi CHẶN ở trên, và bạn chỉ ra được điều '
            'thấy trong ảnh đó cho từng câu. Dựng thử tối đa ba lần cho một mục; lần thứ ba vẫn chưa được thì dừng mục '
            'đó và nói vì sao (thường là lỗi nằm ở bước trước: dàn ý, lời kể, hay một vật).',
            '', '## Phạm vi',
            '- Chỉ sửa các tệp ghi ở "Sửa ở đâu". `core/`, `rig/`, `channels/tram-nghi-nhieu/tools/`, `voice/` và '
            '`review/*.json` giữ nguyên: lỗi của công cụ thì ghi vào câu trả lời.',
            '- Sửa tệp bằng công cụ sửa file (Edit / Write). Ảnh thử để trong `out/scratch/fix/`.',
            '', '## Trả lời (chỉ chữ, mỗi mục một dòng, không gì khác)',
            '<mã> | ĐÃ SỬA hoặc CHƯA SỬA ĐƯỢC hoặc NGƯỜI CHẤM SAI | sửa gì (tệp:dòng) | ảnh mới: <đường dẫn> | '
            'tự chấm: <tiêu chí>=ĐẠT/LỖI, …']


def brief_props(ep, st, crit, ids):
    import props_catalog
    cat = {x['id']: x for x in props_catalog.catalog(ep)}
    rel = os.path.relpath(ep, LIB)
    out = []
    for i in ids:
        rec, x = st['items'].get(i, {}), cat.get(i)
        if not x:
            out += [f'## {i}: không còn trong danh mục vật', '']; continue
        d = os.path.join(ep, 'out/scratch/fix', i); os.makedirs(d, exist_ok=True)
        json.dump([x['name']], open(os.path.join(d, 'only.json'), 'w', encoding='utf-8'), ensure_ascii=False)
        shared = [f for f in props_catalog._closure(ep, os.path.basename(x['file'])) if f.startswith('_')] \
            if x.get('layout') == 'split' else []
        fd = f'{rel}/out/scratch/fix/{i}'
        out += [f"## {i} — \"{x['name']}\" (lần sai {rec.get('fails', 0)}/3)", '', 'Người chấm thấy:'] + judged(rec, crit) + [
            '', 'Sửa ở đâu:', (f"- `{rel}/{x['file']}` (chỉ tệp này)." +
            (f" Phần dùng chung {', '.join('`src/props/' + f + '`' for f in shared)} giữ nguyên: sửa nó là sửa mọi vật "
             'dùng nó.' if shared else '')) if x.get('layout') == 'split' else
            (f"- hàm dựng của vật này trong `{rel}/{x['file']}`, và chỉ hàm đó. Tệp này chung cho mọi vật của tập (kiểu "
             'cũ): người sửa vật chạy lần lượt, một người một lúc.'),
            f"- `PROP.name` giữ nguyên (\"{x['name']}\"): nhãn của phim neo vào nó.", '',
            'Nhìn vật (ảnh ba phía; dựng một lần TRƯỚC khi sửa để so, rồi sau mỗi lần sửa):',
            f'`LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/tools/propcheck.mjs {rel} --out {fd} --only {fd}/only.json`', '']
    return out


def brief_picture(ep, st, crit, ids):
    rel = os.path.relpath(ep, LIB)
    B = beats_by_id(ep)
    out = ['Các mục dùng chung mã của tập: sửa lần lượt từng mục.', '']
    for i in ids:
        rec, b = st['items'].get(i, {}), B.get(i, {})
        t = b.get('t')
        out += [f"## {i} (lần sai {rec.get('fails', 0)}/3)", '',
                f"Lời: {b.get('text', '?')}",
                f"Thời gian: {b.get('t0', '?')}–{b.get('t1', '?')} s · nhãn đang hiện: {' · '.join(b.get('shown') or []) or '(không có)'}",
                f"Khung người chấm đã thấy: `{b.get('f', '?')}`", '', 'Người chấm thấy:'] + judged(rec, crit) + [
                '', 'Sửa ở đâu (máy quay, đèn, vị trí vật, nhãn của câu này):'] + places(ep, i) + [
                '- Vật dựng sai (không phải máy quay hay ánh sáng): ghi vào câu trả lời; vật sửa ở bước props.', '',
                'Nhìn khung:', f'`LEMO_ANGLE=vulkan node core/render/still.mjs {rel} {t} --out {rel}/out/scratch/fix/{i}`'
                if t is not None else '(chưa có thời điểm: dựng tờ nhịp trước)', '']
    return out


def brief_look(ep, st, crit, ids):
    rel = os.path.relpath(ep, LIB)
    H, B = gate.hero_files(ep), beats_by_id(ep)
    out = ['Các mục dùng chung mã của tập và `LOOK.md`: sửa lần lượt từng mục.', '']
    for i in ids:
        rec, p, t = st['items'].get(i, {}), H.get(i), hero_time(i)
        m = re.match(r'c\d+(?=_|$)', i)
        lid = m.group(0) if m else line_at(B, t)   # named after its line (c13_t40.46), or found by its time
        out += [f"## {i}" + (f' · câu {lid}' if lid else '') + f" (lần sai {rec.get('fails', 0)}/3)", '',
                f"Khung người chấm đã thấy: `{os.path.relpath(p, LIB) if p else '?'}`" + (f' (t = {t} s)' if t is not None else ''),
                '', 'Người chấm thấy:'] + judged(rec, crit) + [
                '', 'Sửa ở đâu: góc máy, đèn, vị trí vật trong mã của tập (`src/`), và dòng của nhát trong `LOOK.md`:'] + places(ep, lid) + [
                '', 'Nhìn khung, rồi chép ảnh mới đè lên khung chính (vòng sau chấm lại đúng ảnh đó):',
                (f'`LEMO_ANGLE=vulkan node core/render/still.mjs {rel} {t} --out {rel}/out/scratch/fix/{i}`, '
                 f'rồi chép tệp ảnh vừa dựng thành `{os.path.relpath(p, LIB)}`') if t is not None and p else
                '(tên ảnh không có thời điểm t_<giây>: dựng lại khung bằng lệnh đã dựng nó)', '']
    return out


def make(ep, step, ids=None):
    st = gate.load(ep, step)
    fails = [k for k, r in st['items'].items() if r.get('verdict') == 'FAIL']
    ids = list(ids or []) or fails
    if not ids: return None
    if step == 'look': ids.sort(key=lambda i: (hero_time(i) is None, hero_time(i) or 0, i))   # in film order
    crit = rubric_rows(step)
    if step == 'props':   # one brief per prop: fixers run in parallel
        return '\n'.join(f'=== BRIEF {i} ===\n' + '\n'.join(head(ep, step, [i], crit) + brief_props(ep, st, crit, [i]) + tail()) + '\n'
                         for i in ids)
    ids, rest = ids[:MAX], ids[MAX:]
    body = {'picture': brief_picture, 'look': brief_look}[step](ep, st, crit, ids)
    more = ['', f'=== CÒN {len(rest)} MỤC cho người sửa kế tiếp, sau người này: '
                f'fixbrief.py <tập> {step} {" ".join(rest)}'] if rest else []
    return '\n'.join(head(ep, step, ids, crit) + body + tail() + more) + '\n'


def main(argv):
    if argv[:1] == ['--selftest']: return selftest()
    if len(argv) < 2 or argv[1] not in STEPS or not os.path.isdir(argv[0]):
        print(__doc__, file=sys.stderr); return 2
    ep = os.path.abspath(argv[0])
    text = make(ep, argv[1], argv[2:])
    if text is None:
        print(f'fixbrief: bước {argv[1]} không còn mục phải sửa'); return 0
    sys.stdout.write(text)
    return 0


def selftest():
    import shutil, tempfile
    tmp = tempfile.mkdtemp(prefix='fixbrief-selftest-')
    ok = True

    def expect(cond, what):
        nonlocal ok
        print(('ok   ' if cond else 'FAIL ') + what); ok = ok and cond
    try:
        ep = os.path.join(tmp, 'tap')
        for d in ('voice', 'src', 'review/beatsheet', 'review/hero'): os.makedirs(os.path.join(ep, d))
        json.dump([{'id': 'c1', 'text': 'một'}, {'id': 'c2', 'text': 'áo ướt bay hơi'}],
                  open(os.path.join(ep, 'voice/lines.json'), 'w'), ensure_ascii=False)
        open(os.path.join(ep, 'src/film.js'), 'w').write("sh('N1', 'c1', 24);\nsh('N1', 'c2', 30);\n")
        open(os.path.join(ep, 'LOOK.md'), 'w').write('| 2 | c2 | cận áo ướt | x |\n')
        json.dump([{'n': 2, 'id': 'c2', 'text': 'áo ướt bay hơi', 't0': 4.0, 't1': 6.0, 't': 5.0,
                    'f': 'x/b_002.jpg', 'shown': ['HƠI NƯỚC']}], open(os.path.join(ep, 'review/beatsheet/beats.json'), 'w'),
                  ensure_ascii=False)
        gate.save(ep, 'picture', {'step': 'picture', 'round': 2, 'items': {
            'c1': {'verdict': 'PASS', 'rows': {}},
            'c2': {'verdict': 'FAIL', 'fails': 1, 'rows': {'thay-ro': ['LỖI', 'áo chỉ là vệt nhỏ giữa tường trống', 'đưa máy lại gần']}}}})
        t = make(ep, 'picture')
        expect(t is not None and '## c2' in t and '## c1' not in t, 'default scope is the items still to fix')
        expect('áo chỉ là vệt nhỏ' in t and 'đưa máy lại gần' in t, "the critic's evidence and fix reach the fixer")
        expect('src/film.js:2' in t and 'LOOK.md:1' in t, 'the code place and the LOOK.md row of the line are found')
        expect('still.mjs' in t and ' 5.0 ' in t, "the render command is at the line's time")
        expect('dung-loi' in t and t.count('**dung-loi**') == 1, 'every CHẶN question is listed once')
        many = {f'c{k}': {'verdict': 'FAIL', 'fails': 1, 'rows': {}} for k in range(1, MAX + 4)}
        gate.save(ep, 'picture', {'step': 'picture', 'round': 3, 'items': many})
        t = make(ep, 'picture')
        expect(t.count('\n## c') == MAX and f'CÒN 3 MỤC' in t, f'one fixer gets at most {MAX} items; the rest are named')
        open(os.path.join(ep, 'review/hero/t_5.0.jpg'), 'wb').write(b'x')
        gate.save(ep, 'look', {'step': 'look', 'round': 1, 'items': {'t_5.0': {'verdict': 'FAIL', 'fails': 1, 'rows': {}}}})
        t = make(ep, 'look')
        expect('câu c2' in t and 'src/film.js:2' in t, 'a hero still named by its time is matched to its line')
        gate.save(ep, 'picture', {'step': 'picture', 'round': 4, 'items': {'c2': {'verdict': 'PASS', 'rows': {}}}})
        expect(make(ep, 'picture') is None, 'nothing to fix: no brief')
        expect(hero_time('c13_t40.46') == 40.46 and hero_time('t_102.0') == 102.0 and hero_time('x') is None,
               'the time of a hero still is read from its name')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print('fixbrief selftest:', 'PASS' if ok else 'FAIL')
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
