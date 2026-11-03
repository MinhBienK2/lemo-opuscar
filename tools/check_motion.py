#!/usr/bin/env python3
"""Check that the picture moves: python3 tools/check_motion.py <film> [--mp4 file.mp4]

A film whose frames hold still while the voice talks reads as a slide deck, however good each frame is. This measures the
finished .mp4 (the newest one in the film folder or out/), frame against frame, at 192×108 and 12 fps, the subtitle band
(bottom 20 %) left out and the cuts skipped:

  action     share of 1 s windows where something visibly moves (≥ 2 % of the picture changes between two frames)   ≥ 55 %
  big        share of 2 s windows with a big action (≥ 5 % of the picture: a walk, an entrance, a transformation)    ≥ 45 %
  dead       the longest run of seconds with no visible action, outside the board's silences                         ≤ 10 s
  beats      every acting beat changes its part of the frame: the box of 360 px around its "xy" (the whole frame
             without one) differs between just before the beat and the end of its move ("d", default 0.6 s)         ≥ 75 %

The beats come from events.json: the marks {type: 'mark', kind: 'beat', beat, t, d, xy} that rig/board.js writes, or,
in an older film, the sound events that carry a "beat". A film that reads as cinema measures about 60 %, 55 %, 9 s; a film built as a state
table (props switched on, poses swapped) measures about 30 %, 18 %, 16 s.
Exit 0 when everything passes, 1 when something fails, 2 when there is no film to measure.
"""
import glob, json, os, subprocess, sys
import numpy as np

args = sys.argv[1:]
if not args or args[0].startswith('-'): print(__doc__); sys.exit(2)
FILM = args[0]
MP4 = args[args.index('--mp4') + 1] if '--mp4' in args else None
if not MP4:
    c = [f for f in glob.glob(os.path.join(FILM, '*.mp4')) + glob.glob(os.path.join(FILM, 'out', '*.mp4'))]
    MP4 = max(c, key=os.path.getmtime) if c else None
if not MP4 or not os.path.isfile(MP4): print(f'check_motion: no .mp4 in {FILM}'); sys.exit(2)

W, H, FPS, BAND = 192, 108, 12, .8
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', MP4, '-vf', f'fps={FPS},scale={W}:{H},format=gray', '-f', 'rawvideo', '-'],
                     capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)[:, :int(H * BAND)]
if len(fr) < FPS * 2: print(f'check_motion: {MP4} is too short to measure'); sys.exit(2)
mov = (np.abs(np.diff(fr, axis=0)) > 6).mean(axis=(1, 2))   # mov[i]: share of pixels that change from frame i to i+1

ev = []
EP = os.path.join(FILM, 'events.json')
if os.path.isfile(EP):
    j = json.load(open(EP, encoding='utf-8')); ev = j.get('ev', j) if isinstance(j, dict) else j
cut = mov > .35
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

def peaks(n):
    out = []
    for i in range(0, len(mov), n):
        m, c = mov[i:i + n], cut[i:i + n]
        out.append(m[~c].max() if (~c).any() else 1.0)   # a window that is all cut counts as moving
    return np.array(out)

p1, p2 = peaks(FPS), peaks(2 * FPS)
action, big = (p1 >= .02).mean(), (p2 >= .05).mean()
q1 = np.array([quiet[i:i + FPS].mean() > .5 for i in range(0, len(mov), FPS)])
run = best = at = 0; best_at = 0
for i, p in enumerate(p1):
    if p < .02 and not q1[i]:
        if run == 0: at = i
        run += 1
        if run > best: best, best_at = run, at
    else: run = 0

bad = []
BAD = bad.append
print(f'motion: {os.path.basename(MP4)} {len(fr) / FPS:.0f} s')
print(f'  action {action * 100:.0f} % of seconds · big {big * 100:.0f} % of 2 s windows · longest still stretch {best} s (from {best_at} s)')
if action < .55: BAD(f'something visibly moves in {action * 100:.0f} % of the seconds (≥ 55 %): the frames hold still while the voice talks — give every shot an action that runs over time (a walk, a prop that travels, a count, a line that draws)')
if big < .45: BAD(f'a big action in {big * 100:.0f} % of the 2 s windows (≥ 45 %): entrances, walks, transformations are missing — props pop in or stand still')
if best > 10: BAD(f'{best} s without a visible action from {best_at} s (≤ 10 s, outside the board silences)')

# the beats: each one must change the part of the frame where it happens
beats = {}
for e in ev:
    if not isinstance(e.get('t'), (int, float)): continue
    if e.get('type') == 'mark' and e.get('kind') == 'beat': beats[e['beat']] = e
    elif e.get('beat') and e['beat'] not in beats: beats[e['beat']] = {'t': e['t'], 'beat': e['beat']}
cuts_t = sorted(e['t'] for e in ev if e.get('type') == 'shot' and isinstance(e.get('t'), (int, float)))
dead = []
for bid, b in beats.items():
    t, d = b['t'], b.get('d') or .6
    nxt = next((c for c in cuts_t if c > t + .05), 1e9)
    prv = max([c for c in cuts_t if c <= t + .05] or [0])
    i0 = int(round(max(t - .1, prv + .08) * FPS)); i1 = int(round(min(t + d, nxt - .08) * FPS))
    i0, i1 = max(0, i0), min(len(fr) - 1, i1)
    if i1 - i0 < 2: continue   # a beat on a cut: the cut is its change
    if b.get('xy'):
        x, y = b['xy']; cx, cy, r = int(x / 1920 * W), int(y / 1080 * H), int(180 / 1920 * W)
        sl = (slice(max(0, cy - r), min(fr.shape[1], cy + r)), slice(max(0, cx - r), min(W, cx + r)))
    else: sl = (slice(None), slice(None))
    a, z = fr[i0][sl], fr[i1][sl]
    if a.size == 0: continue
    if (np.abs(z - a) > 10).mean() < .03: dead.append(f'{bid}@{t:.1f}')
if beats:
    n = len(beats); ok = 1 - len(dead) / n
    print(f'  beats {n - len(dead)}/{n} change their part of the frame')
    if ok < .75: BAD(f'{len(dead)} of {n} beats change nothing where they happen (≥ 75 % must): {", ".join(dead[:10])} — the beat is a word in the board but not a move on screen')
else:
    print('  beats: no beat marks in events.json (rig/board.js writes them; rebuild the film)')

for m in bad: print('BAD', m)
print('PASS' if not bad else f'FAIL ({len(bad)})')
sys.exit(1 if bad else 0)
