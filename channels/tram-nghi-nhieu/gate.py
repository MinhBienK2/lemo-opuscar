"""The review gate of an episode: what the independent reviewer passed is what gets rendered.
  python3 gate.py stamp <episode> script|picture   review.sh writes the stamp when a review passes
  python3 gate.py check <episode>                   mix.py asks before every build; exit 1 with the reason
A stamp is a hash of what was judged: the words of voice/lines.json (script), and also src/*.js but timeline.js,
index.html (picture). Any change after the pass breaks the stamp, and the review must be run again.
LEMO_REVIEW_GATE=0 turns the check off (the channel owner, for a test build; never to ship an episode).
"""
import glob, hashlib, json, os, sys


def words(ep):
    return '\n'.join(x['text'] for x in json.load(open(os.path.join(ep, 'voice/lines.json'))))


def digest(ep, kind):
    h = hashlib.sha256(words(ep).encode())
    if kind == 'picture':
        files = sorted(f for f in glob.glob(os.path.join(ep, 'src/*.js')) if not f.endswith('timeline.js'))
        files += [os.path.join(ep, 'index.html')]
        for f in files:
            if os.path.isfile(f): h.update(f.encode()[-80:] + open(f, 'rb').read())
    return h.hexdigest()


def stamp_path(ep, kind): return os.path.join(ep, 'review', f'{kind.upper()}.pass')


def check(ep):
    """None when the episode may be built, else the reason it may not"""
    if os.environ.get('LEMO_REVIEW_GATE') == '0' or not os.path.isfile(os.path.join(ep, 'voice/lines.json')): return None
    for kind, cmd, what in (('script', '--script', 'lời kể'), ('picture', '', 'hình cả phim')):
        p = stamp_path(ep, kind)
        run = f"sh channels/tram-nghi-nhieu/review.sh {os.path.relpath(ep)} {cmd}".rstrip()
        if not os.path.isfile(p):
            return f"{what} chưa được người chấm độc lập cho PASS. Chạy: {run}"
        if open(p).read().strip() != digest(ep, kind):
            return f"{what} đã đổi sau lần PASS cuối ({p}). Chấm lại: {run}"
    return None


if __name__ == '__main__':
    if len(sys.argv) < 3: sys.exit(__doc__)
    op, ep = sys.argv[1], os.path.abspath(sys.argv[2])
    if op == 'stamp':
        os.makedirs(os.path.join(ep, 'review'), exist_ok=True)
        open(stamp_path(ep, sys.argv[3]), 'w').write(digest(ep, sys.argv[3]) + '\n')
    elif op == 'check':
        r = check(ep)
        if r: sys.exit('cổng chấm: ' + r)
        print('cổng chấm: PASS')
    else: sys.exit(__doc__)
