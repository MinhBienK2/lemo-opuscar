"""The review gate of an episode: what the independent reviewer passed is what gets voiced, mixed and rendered.

  python3 gate.py check <episode> [--for voice|render]   exit 1 with the reason when the step may not run
      voice   the outline and the words have passed (tts_vi.py asks before it makes a voice)
      render  outline, words, props and picture have passed (mix.py and core/render/video.mjs ask; the default)
  python3 gate.py need <episode> <kind>...               exit 1 unless these kinds have passed (review.sh asks)
  python3 gate.py placeholders <episode> [<chapter>]     exit 1 when a src file of the film (or chapter) is a placeholder
  python3 gate.py chapter <episode> <n|id>              prints "<first line>-<last line> <id>" of a chapter
  python3 gate.py stamp <episode> <kind> <review> [--chapter <id>] --critic "<who judged>"
      written by review.sh, and only by it, when a review passes
  python3 gate.py cut <episode> <kind> <cut> [--chapter <id>]
      exit 1 when a director's cut is older than the code it judges (a cut written before the last edit says
      nothing about the code that is there now)

The stamps live in <episode>/review/:
  OUTLINE.pass        the outline (TREATMENT.md + research/FACTS.md) passed review.sh --outline. It is not reopened by
                      later edits of the treatment: change the structure itself (ideas, their order, the chapters) and
                      you run --outline again because the script review will fail on it, not because the gate says so.
  SCRIPT.pass         the words of voice/lines.json                          review.sh --script
  SCRIPT-<ch>.pass    the words of one chapter                               review.sh --script --chapter <n>
  PROPS.pass          src/props.js                                           review.sh --props
  STORYBOARD.pass     LOOK.md + src/film.js                                  review.sh --storyboard
  PICTURE.pass        the words, src/*.js but timeline.js, index.html        review.sh (whole film, no --lines/--video)
  PICTURE-<ch>.pass   the chapter's words, its own files, the shared files   review.sh --chapter <n>

An episode with src/chapters.js is a long episode: its words and its picture pass chapter by chapter, and the gate
opens when every chapter holds a valid stamp (or the whole film holds one). A chapter owns src/<id>.js and the files it
lists in `files: [...]`; every other src/*.js is shared, so a change to a shared file reopens every chapter.

A stamp holds the hash of what was judged, the hash of the review that passed it and who judged it. Any change after
the pass breaks it, as does a review edited after the stamp. A src file that still says "placeholder" or "giữ chỗ" never
renders. No switch turns the gate off. The gate catches mistakes, not forgery: a stamp or a review written by hand is
not a review, and an episode built from one has not passed.
"""
import glob, hashlib, json, os, re, sys

SHARED_EXCLUDE = ('timeline.js',)
PLACEHOLDER = re.compile(r'placeholder|giữ chỗ', re.I)
WHAT = {'outline': 'dàn ý (TREATMENT.md + FACTS.md)', 'script': 'lời kể', 'props': 'vật dựng (src/props.js)',
        'storyboard': 'khung hình (LOOK.md + src/film.js)', 'picture': 'hình'}
FLAG = {'outline': '--outline', 'script': '--script', 'props': '--props', 'storyboard': '--storyboard', 'picture': ''}


# ——— what an episode holds ———

def lines(ep):
    p = os.path.join(ep, 'voice/lines.json')
    return json.load(open(p, encoding='utf-8')) if os.path.isfile(p) else None


def chapters(ep):
    """[{id, a, b, files}] from src/chapters.js (a, b: 1-based line numbers), or [] for an episode without chapters"""
    p = os.path.join(ep, 'src/chapters.js')
    if not os.path.isfile(p): return []
    txt = open(p, encoding='utf-8').read()
    L = lines(ep) or []
    pos = {str(x.get('id')): i + 1 for i, x in enumerate(L)}
    out = []
    for m in re.finditer(r"\{[^{}]*?id:\s*['\"]([^'\"]+)['\"][^{}]*?\}", txt, re.S):
        body, cid = m.group(0), m.group(1)
        r = re.search(r"lines:\s*\[\s*['\"]?([^'\",\s\]]+)['\"]?\s*,\s*['\"]?([^'\",\s\]]+)['\"]?", body)
        if not r: continue
        ends = []
        for k in r.groups():
            ends.append(pos.get(k) or (int(k) if k.isdigit() else int(re.sub(r'\D', '', k) or 0)))
        f = re.search(r"files:\s*\[([^\]]*)\]", body)
        files = re.findall(r"['\"]([^'\"]+)['\"]", f.group(1)) if f else []
        if os.path.isfile(os.path.join(ep, 'src', cid + '.js')): files.append(cid + '.js')
        out.append({'id': cid, 'a': ends[0], 'b': ends[1], 'files': sorted(set(files))})
    return out


def chapter(ep, key):
    C = chapters(ep)
    for i, c in enumerate(C, 1):
        if key in (c['id'], str(i), f'ch{key}'): return c
    return None


def coverage(ep):
    """None when the chapters cover every line once, in order; else what is wrong"""
    C, n, want = chapters(ep), len(lines(ep) or []), 1
    for c in C:
        if c['a'] != want: return f"chương {c['id']} bắt đầu ở câu {c['a']}, lẽ ra là câu {want} (src/chapters.js)"
        want = c['b'] + 1
    if C and want != n + 1: return f"các chương dừng ở câu {want - 1}, lời có {n} câu (src/chapters.js)"
    return None


def src_files(ep):
    return sorted(os.path.basename(f) for f in glob.glob(os.path.join(ep, 'src/*.js'))
                  if os.path.basename(f) not in SHARED_EXCLUDE)


def picture_files(ep, ch=None):
    """the files a picture review of the whole film (ch None) or of one chapter depends on"""
    S = src_files(ep)
    if ch is None: return S
    owned = {f for c in chapters(ep) for f in c['files']}
    return sorted([f for f in S if f not in owned] + [f for f in ch['files'] if f in S])


def placeholders(ep, ch=None):
    return [f for f in picture_files(ep, ch) if PLACEHOLDER.search(open(os.path.join(ep, 'src', f), encoding='utf-8').read())]


# ——— hashes and stamps ———

def words(ep, ch=None):
    L = lines(ep) or []
    a, b = (ch['a'], ch['b']) if ch else (1, len(L))
    return '\n'.join(x['text'] for x in L[a - 1:b])


def digest(ep, kind, ch=None):
    h = hashlib.sha256()
    if kind == 'outline':
        for f in ('TREATMENT.md', 'research/FACTS.md'):
            p = os.path.join(ep, f)
            if os.path.isfile(p): h.update(open(p, 'rb').read())
        return h.hexdigest()
    if kind in ('script', 'picture'): h.update(words(ep, ch).encode())
    files = []
    if kind == 'props': files = [os.path.join(ep, 'src/props.js')]
    if kind == 'storyboard': files = [os.path.join(ep, 'LOOK.md')]
    if kind == 'picture':
        files = [os.path.join(ep, 'src', f) for f in picture_files(ep, ch)] + [os.path.join(ep, 'index.html')]
    for f in files:
        if os.path.isfile(f): h.update(f.encode()[-80:] + open(f, 'rb').read())
    return h.hexdigest()


def sha(path): return hashlib.sha256(open(path, 'rb').read()).hexdigest()


def passed(review):
    """a verdict of PASS — it may sit under a heading ('## VERDICT: PASS'), the way a director's cut ends"""
    return bool(re.search(r'^#*\s*VERDICT: *PASS', open(review, encoding='utf-8').read(), re.M))


def stamp_path(ep, kind, ch=None):
    return os.path.join(ep, 'review', f"{kind.upper()}{'-' + ch['id'] if ch else ''}.pass")


def newest_code_mtime(ep, kind, ch=None):
    """when the code this kind judges was last touched"""
    files = []
    if kind == 'props':
        files = [os.path.join(ep, 'src/props.js')]
    if kind == 'picture':
        files = [os.path.join(ep, 'src', f) for f in picture_files(ep, ch)] + [os.path.join(ep, 'index.html')]
    ts = [os.path.getmtime(f) for f in files if os.path.isfile(f)]
    return max(ts) if ts else None


def stale_cut(ep, kind, cut, ch=None):
    """why a director's cut may not be used, or None when it may

    The cut is the way out of the round limit, so it has to say something about the film as it is now. A cut
    written before the last change of the code says nothing about that code: accepting it would stamp code
    nobody looked at. The cut therefore has to be written after the code it judges.
    """
    if kind not in ('props', 'picture'):
        return None
    t = newest_code_mtime(ep, kind, ch)
    if t is None or not os.path.isfile(cut):
        return None
    if os.path.getmtime(cut) < t - 1:
        return (f'bản cắt {os.path.basename(cut)} viết trước lần sửa code cuối cùng, nên nó không nói gì '
                f'về code hiện tại — viết lại bản cắt (nêu rõ vật nào cắt, vật nào sửa) sau khi sửa code xong, '
                f'rồi chạy lại')
    return None


def stamp(ep, kind, review, ch=None, critic=''):
    if not passed(review): sys.exit(f'gate: {review} does not say VERDICT: PASS')
    if not critic: sys.exit('gate: a stamp names who judged it (--critic); only review.sh writes stamps')
    os.makedirs(os.path.join(ep, 'review'), exist_ok=True)
    open(stamp_path(ep, kind, ch), 'w').write(
        f'{digest(ep, kind, ch)}\n{sha(review)} {os.path.relpath(review, ep)}\ncritic: {critic}\n')


def valid(ep, kind, ch=None):
    """None when the stamp holds, else why not"""
    p = stamp_path(ep, kind, ch)
    if not os.path.isfile(p): return 'chưa có PASS'
    got = open(p, encoding='utf-8').read().split('\n')
    head = (got[0].strip(), *got[1].split()) if len(got) > 2 else ()
    if len(head) != 3 or not got[2].startswith('critic: '): return f'con dấu {os.path.basename(p)} không đúng mẫu của review.sh'
    if kind not in ('outline', 'storyboard') and head[0] != digest(ep, kind, ch):
        return 'đã đổi sau lần PASS cuối'
    if kind in ('outline', 'storyboard') and head[0] != digest(ep, kind, ch):
        # The outline and the storyboard are plans, not the film: they are deliberately not reopened by later edits
        # (a treatment is refined after it passes, and LOOK.md is kept in step with the assembly). A reader must
        # still be able to see that what was judged is no longer what is on disk.
        what = 'dàn ý' if kind == 'outline' else 'bản LOOK.md'
        print(f'gate: cảnh báo — {os.path.basename(p)} chấm một {what} khác với hiện tại (đã sửa sau lần PASS). '
              f'{what.capitalize()} không bị mở lại, nhưng bản chấm không nói về {what} đang dùng.',
              file=sys.stderr)
    review = os.path.join(ep, head[2])
    if not os.path.isfile(review) or sha(review) != head[1] or not passed(review):
        return f'bản chấm {head[2]} không còn là bản đã PASS (bị sửa hay mất)'
    return None


def run_cmd(ep, kind, ch=None):
    rel = os.path.relpath(ep)
    return f"sh channels/tram-nghi-nhieu/review.sh {rel} {FLAG[kind]}{' --chapter ' + ch['id'] if ch else ''}".replace('  ', ' ').rstrip()


def kind_ok(ep, kind):
    """None when this kind has passed for the whole film, or (script, picture) chapter by chapter"""
    whole = valid(ep, kind)
    if whole is None: return None
    C = chapters(ep)
    if kind in ('script', 'picture') and C:
        bad = [(c, valid(ep, kind, c)) for c in C]
        bad = [(c, why) for c, why in bad if why]
        if not bad: return None
        c, why = bad[0]
        more = f" (và {len(bad) - 1} chương khác)" if len(bad) > 1 else ''
        return f"{WHAT[kind]} của chương {c['id']}: {why}{more}. Chạy: {run_cmd(ep, kind, c)}"
    return f"{WHAT[kind]}: {whole}. Chạy: {run_cmd(ep, kind)}"


NEEDS = {'voice': ('outline', 'script'), 'render': ('outline', 'script', 'props', 'storyboard', 'picture')}


def status(ep):
    """where the episode stands: every stamp, whether it still holds, and the last verdict"""
    for kind in ('outline', 'script', 'props', 'storyboard', 'picture'):
        p = stamp_path(ep, kind)
        if not os.path.isfile(p):
            print(f'{kind:<11} chưa có PASS')
            continue
        why = valid(ep, kind)
        print(f'{kind:<11} {"PASS còn hiệu lực" if why is None else "PASS đã hết hiệu lực: " + why}')
    reports = sorted(glob.glob(os.path.join(ep, 'review', '*REVIEW*.md')) + glob.glob(os.path.join(ep, 'review', 'REVIEW*.md')),
                     key=os.path.getmtime)
    if reports:
        last = reports[-1]
        head = open(last, encoding='utf-8', errors='replace').read()
        verdict = re.search(r'^#*\s*VERDICT: *\w+', head, re.M)
        print(f'last verdict: {verdict.group(0).strip() if verdict else "?"} ({os.path.relpath(last, ep)})')
    movies = [f for f in glob.glob(os.path.join(ep, '*.mp4')) + glob.glob(os.path.join(ep, 'out', '*.mp4'))]
    print('movie:', ', '.join(os.path.basename(m) for m in movies) if movies else 'chưa có')


def check(ep, step='render'):
    """None when the step may run, else the reason it may not"""
    L = lines(ep)
    if not L: return None   # the channel's demo, a rig test: no words, nothing to gate
    cov = coverage(ep)
    if cov: return cov
    for kind in NEEDS[step]:
        if kind == 'props' and not os.path.isfile(os.path.join(ep, 'src/props.js')):
            return f"tập chưa có src/props.js: mọi vật có thật phải nằm ở đó và qua {run_cmd(ep, 'props')} trước khi dựng cảnh"
        why = kind_ok(ep, kind)
        if why: return why
    if step == 'render':
        ph = placeholders(ep)
        if ph: return f"src/{', src/'.join(ph)} vẫn là file giữ chỗ (placeholder): dựng thật rồi chấm lại"
    return None


if __name__ == '__main__':
    a = sys.argv[1:]
    opt = lambda k: a[a.index(k) + 1] if k in a and a.index(k) + 1 < len(a) else None
    if len(a) < 2: sys.exit(__doc__)
    op, ep = a[0], os.path.abspath(a[1])
    if op == 'check':
        step = opt('--for') or 'render'
        if step not in NEEDS: sys.exit(__doc__)
        r = check(ep, step)
        if r: sys.exit('cổng chấm: ' + r)
        print('cổng chấm: PASS')
    elif op == 'need' and len(a) >= 3 and all(k in WHAT for k in a[2:]):
        for k in a[2:]:
            why = kind_ok(ep, k)
            if why: sys.exit('cổng chấm: ' + why)
    elif op == 'placeholders':
        c = chapter(ep, a[2]) if len(a) >= 3 else None
        ph = placeholders(ep, c)
        if ph: sys.exit(f"src/{', src/'.join(ph)} vẫn là file giữ chỗ (placeholder): dựng thật trước khi chấm")
    elif op == 'status' and len(a) >= 2:
        status(os.path.abspath(a[1]))
    elif op == 'cut' and len(a) >= 4 and a[2] in WHAT:
        ch = chapter(ep, opt('--chapter')) if opt('--chapter') else None
        why = stale_cut(ep, a[2], os.path.abspath(a[3]), ch)
        if why: sys.exit('cổng chấm: ' + why)
        print('bản cắt còn hợp lệ')
    elif op == 'chapter' and len(a) >= 3:
        c = chapter(ep, a[2])
        if not c: sys.exit(f"gate: không có chương '{a[2]}' trong {ep}/src/chapters.js")
        print(f"{c['a']}-{c['b']} {c['id']}")
    elif op == 'stamp' and len(a) >= 4 and a[2] in WHAT:
        ch = None
        if opt('--chapter'):
            ch = chapter(ep, opt('--chapter'))
            if not ch: sys.exit(f"gate: không có chương '{opt('--chapter')}'")
        stamp(ep, a[2], os.path.abspath(a[3]), ch, opt('--critic') or '')
    else: sys.exit(__doc__)
