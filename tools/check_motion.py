#!/usr/bin/env python3
"""Check that the picture moves: python3 tools/check_motion.py <film> [--mp4 file.mp4]

A film whose frames hold still while the voice talks reads as a slide deck, however good each frame is. This measures the
finished .mp4 (the newest one in the film folder or out/), frame against frame, at 192×108 and 12 fps, the subtitle band
(bottom 20 %) left out and the cuts skipped. Camera moves (pan, track, drift) are taken out first: only what changes
inside the frame counts, so a film cannot pass by sliding still pictures across the screen:

  action     share of 1 s windows where something visibly moves (≥ 2 % of the picture changes between two frames)   ≥ 55 %
  big        share of 2 s windows with a big action (≥ 5 % of the picture: a walk, an entrance, a transformation)    ≥ 45 %
  dead       the longest run of seconds with no visible action, outside the board's silences                         ≤ 10 s
  beats      every acting beat changes its part of the frame: the box of 360 px around its "xy" (the whole frame
             without one) differs between just before the beat and the end of its move ("d", default 0.6 s)         ≥ 75 %
  camera     share of frames where the whole picture shifts (pan, track, drift)                                       ≤ 30 %

The beats come from events.json: the marks {type: 'mark', kind: 'beat', beat, t, d, xy} that rig/board.js writes, or,
in an older film, the sound events that carry a "beat". A film that reads as cinema measures about 60 %, 55 %, 9 s, with the camera still most of the time; a film built as a state
table (props switched on, poses swapped) measures about 30 %, 18 %, 16 s.
Exit 0 when everything passes, 1 when something fails, 2 when there is no film to measure.

    python3 tools/check_motion.py --selftest   proves the checker can still say "no"
"""
import contextlib, glob, io, json, os, subprocess, sys, tempfile
import numpy as np

W, H, FPS, BAND = 192, 108, 12, .8
M = 8                                   # margin dropped after the shift (wrap-around)
HY, HX = int(H * BAND), W               # the picture is measured in the top 80 % of the frame
FY, FX = np.meshgrid(np.fft.fftfreq(HY), np.fft.fftfreq(HX), indexing='ij')
WIN = np.outer(np.hanning(HY), np.hanning(HX))


def shift_of(a, b):
    A, B = np.fft.fft2((a - a.mean()) * WIN), np.fft.fft2((b - b.mean()) * WIN)
    R = A * np.conj(B); R /= np.abs(R) + 1e-9
    c = np.fft.ifft2(R).real; y, x = np.unravel_index(np.argmax(c), c.shape)
    def sub(v, n, ax):   # parabolic refinement of the peak
        l, m, r = (c[(v - 1) % n, x], c[v, x], c[(v + 1) % n, x]) if ax == 0 else (c[y, (v - 1) % n], c[y, v], c[y, (v + 1) % n])
        d = l - 2 * m + r; o = .5 * (l - r) / d if abs(d) > 1e-9 else 0
        v = v + o; return v - n if v > n / 2 else v
    return sub(y, HY, 0), sub(x, HX, 1)   # b moved by (-dy, -dx) relative to a


def still_diff(a, b, thr):
    dy, dx = shift_of(a, b)
    if abs(dy) > HY / 4 or abs(dx) > HX / 4: dy = dx = 0   # not a camera move (a cut, a flash)
    if abs(dy) < .15 and abs(dx) < .15: return (np.abs(b - a) > thr)[M:-M, M:-M].mean(), False
    bb = np.fft.ifft2(np.fft.fft2(b) * np.exp(-2j * np.pi * (FY * dy + FX * dx))).real
    # a pixel acts when it changes both ways: against the moved frame (the world under the camera) and against the frame
    # as it is (what is pinned to the screen: a scene tag, a vignette, the paper texture)
    return (np.minimum(np.abs(bb - a), np.abs(b - a)) > thr)[M:-M, M:-M].mean(), True


def load_events(film):
    """the board's events: events.json holds {"dur": …, "ev": […]}, or a bare list of events"""
    ep = os.path.join(film, 'events.json')
    if not os.path.isfile(ep): return []
    j = json.load(open(ep, encoding='utf-8'))
    return j.get('ev', j) if isinstance(j, dict) else j


def read_beats(ev):
    """the acting beats out of the board's events.

    A beat is a mark {type: 'mark', kind: 'beat', beat, t, d, xy} (what rig/board.js writes), or, in an older film,
    a sound event that carries a "beat". An event without a time, or without the name of the beat, is not a beat.
    """
    beats = {}
    for e in ev:
        if not isinstance(e.get('t'), (int, float)): continue
        if e.get('type') == 'mark' and e.get('kind') == 'beat' and e.get('beat'):
            beats[e['beat']] = e
        elif e.get('beat') and e['beat'] not in beats:
            beats[e['beat']] = {'t': e['t'], 'beat': e['beat']}
    return beats


def beat_span(t, d, cuts_t):
    """the frames a beat must change: from just before it to the end of its move, inside its own shot"""
    nxt = next((c for c in cuts_t if c > t + .05), 1e9)
    prv = max([c for c in cuts_t if c <= t + .05] or [0])
    i0 = int(round(max(t - .1, prv + .08) * FPS)); i1 = int(round(min(t + d, nxt - .08) * FPS))
    return i0, i1


def peaks(mov, cut, n):
    """the biggest action of every window of n frames; a window that is all cut counts as moving"""
    out = []
    for i in range(0, len(mov), n):
        m, c = mov[i:i + n], cut[i:i + n]
        out.append(m[~c].max() if (~c).any() else 1.0)
    return np.array(out)


def still_run(p1, q1):
    """the longest run of seconds with no visible action, outside the board's silences"""
    run = best = at = 0; best_at = 0
    for i, p in enumerate(p1):
        if p < .02 and not q1[i]:
            if run == 0: at = i
            run += 1
            if run > best: best, best_at = run, at
        else: run = 0
    return best, best_at


def verdict(action, big, best, best_at, camshare, n_beats=0, dead=()):
    """the measurements → the reasons the film is turned away. The thresholds live here, so a change in
    them shows up in the selftest and not only in a film."""
    bad = []
    if camshare > .3: bad.append(f'the camera moves in {camshare * 100:.0f} % of the frames (≤ 30 %): it drifts instead of holding while people and props act — hold is the default, a move needs something to follow or reveal')
    if action < .55: bad.append(f'something visibly moves in {action * 100:.0f} % of the seconds (≥ 55 %): the frames hold still while the voice talks — give every shot an action that runs over time (a walk, a prop that travels, a count, a line that draws)')
    if big < .45: bad.append(f'a big action in {big * 100:.0f} % of the 2 s windows (≥ 45 %): entrances, walks, transformations are missing — props pop in or stand still')
    if best > 10: bad.append(f'{best} s without a visible action from {best_at} s (≤ 10 s, outside the board silences)')
    if n_beats:
        ok = 1 - len(dead) / n_beats
        if ok < .75: bad.append(f'{len(dead)} of {n_beats} beats change nothing where they happen (≥ 75 % must): {", ".join(dead[:10])} — the beat is a word in the board but not a move on screen')
    return bad


def selftest():
    """a check that answers "yes" to everything is not a check: prove it can still say "no".

    The picture needs a built movie to measure, so what is proved here is the part that decides: the beat
    marks read out of events.json, the window a beat must change, and the thresholds that turn a
    measurement into a verdict. The inputs are the real shape rig/render.js writes, written into a
    temporary folder; nothing here needs ffmpeg and nothing here reads the repository.
    """
    cases = []

    # --- the beats out of events.json (the shape rig/render.js writes: markBeat) ---
    EV = {"dur": 149.3, "ev": [
        {"type": "voice", "id": "c1", "t": 2.4},
        {"type": "mark", "t": 2.4, "kind": "beat", "beat": "c1", "d": 3.873, "xy": [960.5, 540.2]},
        {"type": "mark", "t": 6.273, "kind": "beat", "beat": "c2", "d": 3.599, "xy": [1180.0, 470.0]},
        {"type": "silence", "t": 30.0, "t1": 34.0},
    ]}
    with tempfile.TemporaryDirectory() as td:
        with open(os.path.join(td, 'events.json'), 'w', encoding='utf-8') as f:
            json.dump(EV, f)
        ev = load_events(td)
    beats = read_beats(ev)
    cases.append(('the beat marks of a real events.json are read',
                  len(beats) == 2 and beats['c1']['t'] == 2.4 and beats['c1']['xy'] == [960.5, 540.2]
                  and beats['c2']['d'] == 3.599))

    old = read_beats([{"type": "voice", "id": "c1", "t": 2.4}, {"type": "step", "t": 5.0, "beat": "c1"}])
    cases.append(('a sound event that carries a beat is a beat too', old.get('c1', {}).get('t') == 5.0))
    cases.append(('an event without a time is not a beat',
                  read_beats([{"type": "mark", "kind": "beat", "beat": "c1"}]) == {}))
    cases.append(('a mark without the name of its beat is ignored, not a crash',
                  read_beats([{"type": "mark", "t": 5.0, "kind": "beat"}]) == {}))

    # --- the window a beat must change ---
    i0, i1 = beat_span(10.0, .6, [0.0, 20.0])
    cases.append(('a beat in the middle of a shot gets a window of its own', i0 == 119 and i1 == 127))
    i0, i1 = beat_span(10.05, .6, [0.0, 10.0, 10.2])
    cases.append(('a beat squeezed between two cuts has no window of its own', i1 - i0 < 2))

    # --- the thresholds ---
    good = verdict(.60, .55, 9, 40, .10, 60, [])
    cases.append(('a film that moves passes the thresholds', good == []))
    still = verdict(.20, .10, 12, 30, .10, 60, [])
    cases.append(('a film that holds still is caught',
                  len(still) == 3 and any('without a visible action' in m for m in still)
                  and any('something visibly moves in 20 %' in m for m in still)))
    cases.append(('a camera that drifts is caught',
                  any('the camera moves in 50 %' in m for m in verdict(.60, .55, 9, 40, .50, 60, []))))
    cases.append(('beats that change nothing are caught',
                  any('2 of 4 beats change nothing' in m
                      for m in verdict(.60, .55, 9, 40, .10, 4, ['c2@3.0', 'c3@5.0']))))
    cases.append(('the thresholds are the boundary they claim',
                  verdict(.55, .45, 10, 40, .30, 60, []) == [] and len(verdict(.54, .45, 10, 40, .30, 60, [])) == 1
                  and len(verdict(.55, .45, 10, 40, .31, 60, [])) == 1))

    # --- the longest still stretch ---
    p1 = np.array([.5] * 3 + [0.0] * 12 + [.5] * 3)
    q1 = np.zeros(len(p1), bool)
    cases.append(('a still stretch of 12 s is found', still_run(p1, q1) == (12, 3)))
    q2 = np.array([False] * 3 + [True] * 6 + [False] * 9)
    cases.append(('the board\'s silence is not counted as a still stretch', still_run(p1, q2) == (6, 9)))

    # --- a window of cuts ---
    cases.append(('a window of pure cuts counts as moving', float(peaks(np.zeros(4), np.ones(4, bool), 4)[0]) == 1.0))
    cases.append(('a still window measures nothing', float(peaks(np.zeros(4), np.zeros(4, bool), 4)[0]) == 0.0))

    # --- the command line itself ---
    argv = sys.argv
    sys.argv = ['check_motion.py']
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf):
            code = main()
    finally:
        sys.argv = argv
    cases.append(('the usage branch prints the docstring and exits 2', code == 2 and 'Check that the picture moves' in buf.getvalue()))

    failed = 0
    for name, ok in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}' if ok else f'FAIL {name}')
        if not ok: failed += 1
    if failed:
        print(f'FAIL: {failed} case(s)')
        return 1
    print('ok')
    return 0


def main():
    args = sys.argv[1:]
    if '--selftest' in args: return selftest()
    if not args or args[0].startswith('-'): print(__doc__); return 2
    FILM = args[0]
    MP4 = args[args.index('--mp4') + 1] if '--mp4' in args else None
    if not MP4:
        c = [f for f in glob.glob(os.path.join(FILM, '*.mp4')) + glob.glob(os.path.join(FILM, 'out', '*.mp4'))]
        MP4 = max(c, key=os.path.getmtime) if c else None
    if not MP4 or not os.path.isfile(MP4): print(f'check_motion: no .mp4 in {FILM}'); return 2

    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', MP4, '-vf', f'fps={FPS},scale={W}:{H},format=gray', '-f', 'rawvideo', '-'],
                         capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)[:, :int(H * BAND)]
    if len(fr) < FPS * 2: print(f'check_motion: {MP4} is too short to measure'); return 2
    raw_mov = (np.abs(np.diff(fr, axis=0)) > 6).mean(axis=(1, 2))   # share of pixels that change from frame i to i+1

    # A camera that pans, tracks or drifts changes every pixel while nothing in the frame acts. Take the camera out: estimate
    # the global shift between two frames (phase correlation, sub-pixel), move the second frame back by it, and count only
    # what still changes — people, props, lines, numbers.
    mov = np.empty(len(fr) - 1); cam = np.zeros(len(fr) - 1, bool)
    for i in range(len(fr) - 1): mov[i], cam[i] = still_diff(fr[i], fr[i + 1], 6)

    ev = load_events(FILM)
    cut = raw_mov > .35
    for e in ev:   # the board's cuts, as well as the ones the picture shows
        if e.get('type') == 'shot' and isinstance(e.get('t'), (int, float)):
            i = int(round(e['t'] * FPS)) - 1
            for k in (i - 1, i, i + 1):
                if 0 <= k < len(cut): cut[k] = True
    quiet = np.zeros(len(mov), bool)   # the board's silences are meant to be still
    for e in ev:
        if e.get('type') == 'silence' and isinstance(e.get('t'), (int, float)):
            a, b = int(e['t'] * FPS), int(e.get('t1', e['t'] + e.get('d', 1)) * FPS)
            quiet[max(0, a):max(0, b)] = True

    p1, p2 = peaks(mov, cut, FPS), peaks(mov, cut, 2 * FPS)
    action, big = (p1 >= .02).mean(), (p2 >= .05).mean()
    q1 = np.array([quiet[i:i + FPS].mean() > .5 for i in range(0, len(mov), FPS)])
    best, best_at = still_run(p1, q1)

    # the beats: each one must change the part of the frame where it happens
    beats = read_beats(ev)
    cuts_t = sorted(e['t'] for e in ev if e.get('type') == 'shot' and isinstance(e.get('t'), (int, float)))
    dead = []
    for bid, b in beats.items():
        t, d = b['t'], b.get('d') or .6
        i0, i1 = beat_span(t, d, cuts_t)
        i0, i1 = max(0, i0), min(len(fr) - 1, i1)
        if i1 - i0 < 2: continue   # a beat on a cut: the cut is its change
        if b.get('xy'):
            x, y = b['xy']; cx, cy, r = int(x / 1920 * W), int(y / 1080 * H), int(180 / 1920 * W)
            sl = (slice(max(0, cy - r), min(fr.shape[1], cy + r)), slice(max(0, cx - r), min(W, cx + r)))
        else: sl = (slice(None), slice(None))
        dy, dx = shift_of(fr[i0], fr[i1])   # a pan across the box is not the beat: line the two frames up first
        if abs(dy) > HY / 4 or abs(dx) > HX / 4: dy = dx = 0
        zz = np.fft.ifft2(np.fft.fft2(fr[i1]) * np.exp(-2j * np.pi * (FY * dy + FX * dx))).real
        a, z, z0 = fr[i0][sl], zz[sl], fr[i1][sl]
        if a.size == 0: continue
        if (np.minimum(np.abs(z - a), np.abs(z0 - a)) > 10).mean() < .03: dead.append(f'{bid}@{t:.1f}')

    print(f'motion: {os.path.basename(MP4)} {len(fr) / FPS:.0f} s')
    camshare = cam[~cut].mean() if (~cut).any() else 0
    print(f'  action {action * 100:.0f} % of seconds · big {big * 100:.0f} % of 2 s windows · longest still stretch {best} s (from {best_at} s)')
    print(f'  (camera moves taken out; the camera is moving in {camshare * 100:.0f} % of the frames)')
    if beats:
        n = len(beats); ok = 1 - len(dead) / n
        print(f'  beats {n - len(dead)}/{n} change their part of the frame')
    else:
        print('  beats: no beat marks in events.json (rig/board.js writes them; rebuild the film)')
    bad = verdict(action, big, best, best_at, camshare, len(beats), dead)
    for m in bad: print('BAD', m)
    print('PASS' if not bad else f'FAIL ({len(bad)})')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
