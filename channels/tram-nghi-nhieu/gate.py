"""The review gate of an episode: what the independent reviewer passed is what gets rendered.
  python3 gate.py stamp <episode> script|props|picture <review file>   review.sh, when a review passes
  python3 gate.py check <episode>                                         mix.py asks before every build; exit 1 with the reason
A stamp holds a hash of what was judged, and the hash of the review that passed it:
  script   the words of voice/lines.json
  props    src/props.js (every real object, judged alone by --props)
  picture  the words, src/*.js but timeline.js, index.html
Any change after the pass breaks the stamp, and the review must be run again. A review file edited after the stamp,
or one that does not say PASS, breaks it too. There is no switch to turn the gate off: an episode that never passed
is not built.
"""
import glob, hashlib, json, os, re, sys

KINDS = (('script', '--script', 'lời kể'), ('props', '--props', 'vật dựng (src/props.js)'), ('picture', '', 'hình cả phim'))


def words(ep):
    return '\n'.join(x['text'] for x in json.load(open(os.path.join(ep, 'voice/lines.json'))))


def digest(ep, kind):
    h = hashlib.sha256()
    if kind in ('script', 'picture'): h.update(words(ep).encode())
    files = []
    if kind == 'props': files = [os.path.join(ep, 'src/props.js')]
    if kind == 'picture':
        files = sorted(f for f in glob.glob(os.path.join(ep, 'src/*.js')) if not f.endswith('timeline.js'))
        files += [os.path.join(ep, 'index.html')]
    for f in files:
        if os.path.isfile(f): h.update(f.encode()[-80:] + open(f, 'rb').read())
    return h.hexdigest()


def sha(path): return hashlib.sha256(open(path, 'rb').read()).hexdigest()


def passed(review): return bool(re.search(r'^VERDICT: *PASS', open(review).read(), re.M))


def stamp_path(ep, kind): return os.path.join(ep, 'review', f'{kind.upper()}.pass')


def stamp(ep, kind, review):
    if not passed(review): sys.exit(f'gate: {review} does not say VERDICT: PASS')
    os.makedirs(os.path.join(ep, 'review'), exist_ok=True)
    open(stamp_path(ep, kind), 'w').write(f'{digest(ep, kind)}\n{sha(review)} {os.path.relpath(review, ep)}\n')


def check(ep):
    """None when the episode may be built, else the reason it may not"""
    if not os.path.isfile(os.path.join(ep, 'voice/lines.json')): return None
    for kind, cmd, what in KINDS:
        p = stamp_path(ep, kind)
        run = f"sh channels/tram-nghi-nhieu/review.sh {os.path.relpath(ep)} {cmd}".rstrip()
        if kind == 'props' and not os.path.isfile(os.path.join(ep, 'src/props.js')):
            return f"tập chưa có src/props.js: mọi vật có thật phải nằm ở đó và qua {run} trước khi dựng cảnh"
        if not os.path.isfile(p):
            return f"{what} chưa được người chấm độc lập cho PASS. Chạy: {run}"
        got = open(p).read().split()
        if len(got) != 3 or got[0] != digest(ep, kind):
            return f"{what} đã đổi sau lần PASS cuối ({p}). Chấm lại: {run}"
        review = os.path.join(ep, got[2])
        if not os.path.isfile(review) or sha(review) != got[1] or not passed(review):
            return f"bản chấm {got[2]} không còn là bản đã PASS (bị sửa hay mất). Chấm lại: {run}"
    return None


if __name__ == '__main__':
    if len(sys.argv) < 3: sys.exit(__doc__)
    op, ep = sys.argv[1], os.path.abspath(sys.argv[2])
    if op == 'stamp' and len(sys.argv) == 5 and sys.argv[3] in [k[0] for k in KINDS]:
        stamp(ep, sys.argv[3], os.path.abspath(sys.argv[4]))
    elif op == 'check':
        r = check(ep)
        if r: sys.exit('cổng chấm: ' + r)
        print('cổng chấm: PASS')
    else: sys.exit(__doc__)
