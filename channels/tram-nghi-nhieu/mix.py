"""The film's sound: a synthesized score, ambiences and foley, the voice lines, ducking and a bus compressor.
This file lives in the channel; the film it mixes is named by $FILM (the episode folder).
Usage: FILM=<episode> LIB=<library> OUT=<folder> $LIB/.venv/bin/python mix.py  → $OUT/mix.wav (48 kHz stereo; mux.sh masters it to −14 LUFS)
Score: 84 BPM in A minor, every section starting on its own downbeat at its shot (events "music"); the instruments are numpy:
a felt electric piano (sine partials with a soft attack), a marimba, a Karplus-Strong pizzicato bass, a soft kick, a brushed snare,
a vinyl crackle bed, a drone. The instrument code and the mix skeleton come from films/host-toon-test/mix.py (this repo).
"""
import os, sys, json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, lfilter
HERE = os.path.dirname(os.path.abspath(__file__))          # the channel (this file's folder)
FILM = os.environ.get('FILM') or os.path.join(HERE, '..')  # the episode (the film being mixed)


def _lib_root(start):
    """the library root, found by walking up until it holds core/audio/sfx.py"""
    d = os.path.abspath(start)
    while True:
        if os.path.isfile(os.path.join(d, 'core/audio/sfx.py')): return d
        p = os.path.dirname(d)
        if p == d: return os.path.abspath(start)
        d = p


LIB = os.environ.get('LIB') or _lib_root(HERE)
OUT = os.environ.get('OUT') or os.path.join(FILM, 'out')
sys.path.insert(0, os.path.join(LIB, 'core/audio'))
import sfx   # noqa: E402
from sfx import SR, t_, env_exp, bp, lp, hp, noise, brown, norm, add   # noqa: E402

if not os.path.isfile(os.path.join(FILM, 'events.json')):
    sys.exit(f"mix.py: no events.json in FILM={FILM}; set FILM to the episode folder")
E = json.load(open(os.path.join(FILM, 'events.json'))); DUR = E['dur']; EV = E['ev']
N = int((DUR + 1) * SR)
music, amb, fx, voice = (np.zeros((N, 2), np.float32) for _ in range(4))
rng = np.random.default_rng(7)
BPM = 84; BEAT = 60 / BPM; BAR = 4 * BEAT
M = lambda n: 440 * 2 ** ((n - 69) / 12)
NOTE = {'C': 0, 'C#': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
def mid(s): return 12 * (int(s[-1]) + 1) + NOTE[s[:-1]]

# ——— instruments ———
_cache = {}
def epiano(n, v=.8, d=1.8):        # a felt electric piano: soft sine partials
    k = ('e', n, d)
    if k not in _cache:
        tt = t_(d); f = M(n)
        x = sum(a * np.sin(2 * np.pi * f * r * tt + r) * env_exp(d, tau) for r, a, tau in [(1, 1, .9), (2, .22, .5), (3, .08, .3), (4.02, .04, .2)])
        x[:140] *= np.linspace(0, 1, 140) ** 1.5
        _cache[k] = norm(x, .5)
    return _cache[k] * v
def marimba(n, v=.8, d=1.2):
    k = ('m', n, d)
    if k not in _cache:
        tt = t_(d); f = M(n)
        x = sum(a * np.sin(2 * np.pi * f * r * tt) * env_exp(d, tau) for r, a, tau in [(1, 1, .45), (3.93, .35, .09), (9.2, .12, .03)])
        x[:480] += hp(noise(.01), 2000) * np.linspace(.2, 0, 480)
        x[:48] *= np.linspace(0, 1, 48); _cache[k] = norm(x, .5)
    return _cache[k] * v
def celesta(n, v=.6, d=2.5):
    k = ('c', n, d)
    if k not in _cache:
        tt = t_(d); f = M(n)
        x = sum(a * np.sin(2 * np.pi * f * r * tt) * env_exp(d, tau) for r, a, tau in [(1, 1, .9), (2, .4, .5), (3.01, .15, .25), (4.2, .08, .12)])
        x[:96] *= np.linspace(0, 1, 96); _cache[k] = norm(x, .45)
    return _cache[k] * v
def bass(n, v=.8, d=.6):
    k = ('b', n, d)
    if k not in _cache:
        f = M(n); P = SR / f; D = int(P); L = int((d + .4) * SR)
        exc = np.zeros(L); exc[:D] = lp(noise(D / SR), 900)[:D]
        b, a = [1.0], np.zeros(D + 2); a[0] = 1; a[D] = -.5 * .996; a[D + 1] = -.5 * .996
        y = lfilter(b, a, exc); y *= np.minimum(1, np.maximum(0, (d + .4 - t_(d + .4)[:L]) / .4))
        y += np.sin(2 * np.pi * f * t_(d + .4)[:L]) * env_exp(d + .4, .15)[:L] * .4
        _cache[k] = norm(lp(y, 1100), .55)
    return _cache[k] * v
def kick(v=.8):
    d = .35; tt = t_(d); f = 46 + 66 * np.exp(-tt / .03)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .12), .7) * v
def brush(v=.5):
    d = .22; return norm(bp(noise(d), 1500, 7000) * env_exp(d, .06), .4) * v
def shaker(v=.3):
    d = .07; return norm(hp(noise(d), 5000) * np.sin(np.pi * t_(d) / d) ** 2, .3) * v
def drone(d, notes=('A2', 'E3'), v=.25):
    tt = t_(d); x = sum(np.sin(2 * np.pi * M(mid(n)) * tt + np.sin(2 * np.pi * .18 * tt) * .5) + .3 * np.sin(2 * np.pi * M(mid(n)) * 2.003 * tt) for n in notes)
    e = np.minimum(1, tt / 1.5) * np.minimum(1, (d - tt) / 1.0)
    return lp(x, 850) * e / len(notes) * v
def vinyl(d, v=.06):   # the crackle of an old record
    x = hp(noise(d), 1800) * .5
    for k in rng.integers(0, int(d * SR), 260): x[k] += rng.normal() * .5
    return norm(x, .5) * v
def tick(v=.2): return sfx.click(1.6, v)

# ——— the score ———
CHORDS = {'Am': ('A', 'C', 'E'), 'F': ('F', 'A', 'C'), 'C': ('C', 'E', 'G'), 'G': ('G', 'B', 'D'), 'Em': ('E', 'G', 'B')}
PROG = ['Am', 'F', 'C', 'G']
MOTIF = [[(0, 'A4'), (.5, 'C5'), (1, 'E5'), (2.5, 'D5'), (3, 'C5')],
         [(0, 'A4'), (.5, 'C5'), (1, 'G5'), (2.5, 'E5'), (3, 'C5')],
         [(0, 'F4'), (.5, 'A4'), (1, 'C5'), (2.5, 'B4'), (3, 'A4')],
         [(0, 'G4'), (.5, 'B4'), (1, 'D5'), (2, 'C5'), (2.5, 'A4'), (3, 'G4')]]
def root(ch, octv=2): return mid(CHORDS[ch][0] + str(octv))
def fifth(ch, octv=2):
    n = mid(CHORDS[ch][2] + str(octv)); return n if n > root(ch, octv) else n + 12

def put(x, at, g=1.0, pan=0.0):
    add(music, x, at, g, pan)

def section(name, t0, t1):
    bars = int(np.ceil((t1 - t0) / BAR))
    for b in range(bars):
        tb = t0 + b * BAR; ch = PROG[b % 4]
        def at(beat): return tb + beat * BEAT
        def ok(beat): return at(beat) < t1 - .05
        if name == 'A':   # the cold open: a muted bass pulse and a ticking clock
            for k in range(8):
                if ok(k / 2): put(bass(mid('A2') + (12 if k % 4 == 3 else 0), .55, .2), at(k / 2), .9)
            for k in range(4):
                if ok(k): put(tick(.4), at(k), 1, .3)
        if name in ('B', 'C'):
            busy = name == 'C'
            for beat, n in [(0, root(ch)), (1.5, fifth(ch)), (2, root(ch)), (3, root(ch) + 12), (3.5, fifth(ch))]:
                if ok(beat): put(bass(n, .8, .35), at(beat), 1.0, -.1)
            for beat in (0, 2):
                if ok(beat): put(kick(.75), at(beat), .9)
            for beat in (1, 3):
                if ok(beat): put(brush(.45), at(beat), .8, .2)
            step = .25 if busy else .5
            for k in np.arange(0, 4, step):
                if ok(k): put(shaker(.22 + (.1 if k % 1 == 0 else 0)), at(k), .7, .35)
            for beat, n in MOTIF[b % 4]:
                if ok(beat):
                    put(epiano(mid(n), .55, 1.6), at(beat), .85, -.25)
                    if busy: put(marimba(mid(n) + 12, .3), at(beat), .55, .3)
        if name == 'D':   # sparse: a felt piano, half-time chords
            for k, nn in enumerate(CHORDS[ch]):
                if ok(k * 1.0): put(epiano(mid(nn + '4'), .45, 2.0), at(k), .8, -.2)
            if b % 2 == 0 and ok(0): put(bass(root(ch), .6, 1.2), at(0), .8)
            if b % 2 == 1 and ok(2.5): put(celesta(mid(CHORDS[ch][2] + '6'), .4), at(2.5), .7, .3)
        if name == 'E':   # tense: a low pulse with ticking, a dissonant top
            for k in range(8):
                if ok(k / 2): put(bass(mid('A1') + (12 if k % 4 == 3 else 0), .5, .16), at(k / 2), .85)
            for k in range(4):
                if ok(k): put(tick(.3), at(k), .8, -.35)
            if ok(0): put(drone(BAR, ('A1', 'E2'), .3), at(0), .8)
            for beat, n in [(0, 'E5'), (2, 'F5')]:
                if ok(beat): put(marimba(mid(n), .35), at(beat), .7, .3)
        if name == 'F':   # open: the dawn — a warm pad, a marimba theme
            for beat, n in MOTIF[b % 4]:
                if ok(beat): put(marimba(mid(n) + 12, .45, 1.6), at(beat), .8, -.2)
            for k, nn in enumerate(CHORDS[ch]):
                if ok(k * .5): put(epiano(mid(nn + '4'), .35, 2.4), at(k * .5), .7, .15)
            if ok(0): put(bass(root(ch), .55, 1.4), at(0), .8)
            if ok(2): put(celesta(mid(CHORDS[ch][2] + '6'), .4), at(2), .6, .3)
        if name == 'G':   # the close: the theme, quiet
            for beat, n in MOTIF[b % 4]:
                if ok(beat): put(epiano(mid(n), .5, 1.8), at(beat), .8, -.2); put(marimba(mid(n) + 12, .22, 1.6), at(beat), .5, .3)
            if ok(0): put(bass(root(ch), .5, 1.2), at(0), .75)

mus = sorted([e for e in EV if e['type'] == 'music'], key=lambda e: e['t'])
sil = [e for e in EV if e['type'] == 'silence']
starts = [(0.0, 'A')] + [(e['t'], e['cue']) for e in mus if e['cue'] not in ('stinger', 'end')]
ends = [e['t'] for e in mus if e['cue'] == 'end']
for i, (t0, name) in enumerate(starts):
    t1 = starts[i + 1][0] if i + 1 < len(starts) else (ends[0] if ends else DUR)
    for s in sil:
        if t0 < s['t'] < t1: t1 = s['t']
    section(name, t0, t1)
# the end card: a final A-minor chord
if ends:
    en = ends[0]
    for k, n in enumerate(('A3', 'E4', 'A4', 'C5', 'E5')): put(epiano(mid(n), .5, 3.0), en + k * .07, .8)
    put(bass(mid('A2'), .8, 2.6), en, .9); put(celesta(mid('A6'), .4, 3.0), en + .4, .7, .3)
# the silences: cut the music bus, tails included, with a 60 ms fade
for s in sil:
    a, b = int(s['t'] * SR), int(s['t1'] * SR); f = int(.06 * SR)
    if a - f >= 0: music[a - f:a] *= np.linspace(1, 0, f)[:, None]
    music[a:b] = 0
    if b + f <= len(music): music[b:b + f] *= np.linspace(0, 1, f)[:, None]
# the vinyl crackle under everything
add(music, vinyl(DUR + 1, .05), 0, .5)

# ——— ambiences ———
def fade(x, a=.4, b=.4):
    n = len(x); fa, fb = min(n // 2, int(a * SR)), min(n // 2, int(b * SR)); x[:fa] *= np.linspace(0, 1, fa); x[n - fb:] *= np.linspace(1, 0, fb); return x
def ambience(kind, d):
    tt = t_(d)
    if kind == 'room': return lp(brown(d), 700) * .28 + hp(noise(d), 4000) * .02
    if kind == 'night': return lp(brown(d), 380) * .45 + bp(noise(d), 4200, 4800) * (np.sin(2 * np.pi * 6.5 * tt) > .6) * .04
    if kind == 'scroll':   # the hiss of a phone
        return bp(noise(d), 2600, 7000) * (.16 + .1 * np.sin(2 * np.pi * 1.7 * tt)) + hp(noise(d), 6000) * .05
    if kind == 'dawn':
        birds = np.zeros(len(tt))
        for k in np.arange(.5, d, 1.7):
            n = 5 + int(rng.integers(0, 4)); s = int(k * SR)
            for j in range(n):
                f = 2400 + 900 * j / n
                c = np.sin(2 * np.pi * f * np.arange(int(.06 * SR)) / SR) * env_exp(.06, .03) * .06
                q = s + int(j * .07 * SR)
                birds[q:q + len(c)] += c[:max(0, len(birds) - q)]
        return lp(brown(d), 300) * .3 + birds
    if kind == 'low':
        x = lp(brown(d), 150) * .35
        for k in np.arange(0, d, 1.2):   # a slow pulse
            f = 70 * np.exp(-np.arange(int(.5 * SR)) / SR / .12)
            q = int(k * SR); c = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(.5, .1) * .12
            x[q:q + len(c)] += c[:max(0, len(x) - q)]
        return x
    return np.zeros(len(tt))
AMB_G = {'room': .3, 'night': .4, 'scroll': .35, 'dawn': .45, 'low': .45}
for e in EV:
    if e['type'] == 'amb':
        d = e['t1'] - e['t'] + .3; x = fade(norm(ambience(e['kind'], d), .5), .25, .35)
        add(amb, x, e['t'], AMB_G.get(e['kind'], .3) * .5)

# ——— foley ———
def paper(v=.5):
    d = .28; tt = t_(d); return norm(bp(noise(d), 1200, 7000) * np.sin(np.pi * tt / d) ** 1.5, .5) * v
def marker(d=.4, v=.4):
    tt = t_(d); f = 2100 + 300 * np.sin(2 * np.pi * 11 * tt)
    return norm(bp(noise(d), 2500, 6000) * .6 + np.sin(2 * np.pi * np.cumsum(f) / SR) * .15, .4) * np.sin(np.pi * tt / d) ** .5 * v
def ting(v=.6):
    d = 1.2; tt = t_(d); return norm(sum(a * np.sin(2 * np.pi * f * tt) * env_exp(d, tau) for f, a, tau in [(2637, 1, .4), (3951, .6, .25), (5274, .35, .15)]), .5) * v
def boing(v=.6):
    d = .6; tt = t_(d); f = 200 + 240 * np.exp(-tt / .3) * (1 + .3 * np.sin(2 * np.pi * 13 * tt))
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .25), .5) * v
def swish(v=.4):
    d = .5; tt = t_(d); return norm(bp(noise(d), 500, 4000) * np.sin(np.pi * tt / d) ** 2, .4) * v
def drain(v=.5):   # the battery running down
    d = 1.4; tt = t_(d); f = 520 * np.exp(-tt / .8) + 60
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, 1.2), .5) * v
def rise(v=.3):
    d = 1.0; tt = t_(d); return norm(bp(noise(d), 800, 5000) * (tt / d) ** 2, .4) * v
def step(v=.3):
    d = .18; return norm(bp(noise(d), 200, 1800) * env_exp(d, .04), .4) * v
FX = {
    'pop': lambda e: sfx.pop(.5), 'paper': lambda e: paper(.5), 'marker': lambda e: marker(.45, .4), 'ting': lambda e: ting(.45),
    'stamp': lambda e: sfx.thump(.9, 60) + np.pad(sfx.click(.7, .4), (0, int(.35 * SR) - len(sfx.click()))),
    'whoosh': lambda e: sfx.whoosh(.32, .45), 'boing': lambda e: boing(.55), 'swish': lambda e: swish(.45),
    'drain': lambda e: drain(.5), 'rise': lambda e: rise(.3), 'step': lambda e: step(.4), 'tick': lambda e: sfx.click(1.3, .3),
}
for k, e in enumerate(EV):
    f = FX.get(e['type'])
    if f: add(fx, f(e).astype(np.float32), e['t'], .7, float(np.sin(k * 2.3)) * .25)

# ——— the voice, centred and dry ———
for e in EV:
    if e['type'] == 'voice':
        y, sr = sf.read(os.path.join(FILM, 'voice/proc', e['id'] + '.wav'), dtype='float32'); add(voice, y, e['t'], .7)

# ——— ducking: the music and the ambience go down ~8 dB under the voice ——
env = np.abs(voice[:, 0]); w = int(.02 * SR); env = np.convolve(env, np.ones(w) / w, 'same')
key = (env > .02).astype(np.float32)
a, r = np.exp(-1 / (.03 * SR)), np.exp(-1 / (.35 * SR))
att = lfilter([1 - a], [1, -a], key); rel = lfilter([1 - r], [1, -r], key); sm = np.maximum(att, rel)
duck = (10 ** (-8 / 20)) ** np.clip(sm * 1.4, 0, 1)
mixd = music * .42 * duck[:, None] + amb * (.5 + .4 * duck[:, None]) + fx * .75 + voice
for c in range(2): mixd[:, c] = sfx.limit(sfx.compress(mixd[:, c], thr=.30, ratio=3.0), .82)
mixd = mixd[:int(DUR * SR)]
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'mix.wav'), mixd.astype(np.float32), SR, subtype='PCM_16')
print('mix', round(len(mixd) / SR, 2), 's, peak', round(float(np.abs(mixd).max()), 3))
if '--stats' in sys.argv:
    v = np.abs(voice[:len(mixd), 0]) > .02; bed = (music * .45 * duck[:, None] + amb * (.6 + .4 * duck[:, None]) + fx)[:len(mixd), 0]
    db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
    print('voice', round(db(voice[:len(mixd), 0][v]), 1), 'dB | bed under voice', round(db(bed[v]), 1), 'dB | bed in gaps', round(db(bed[~v]), 1), 'dB')
