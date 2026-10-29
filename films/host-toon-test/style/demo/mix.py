"""The film's sound: a synthesized score, ambiences and foley from events.json, the voice lines, ducking and a bus compressor.
Usage: LIB=<library> OUT=<folder> $LIB/.venv/bin/python mix.py  → $OUT/mix.wav (default: out/ next to this file) (48 kHz stereo; mux.sh sets −14 LUFS)
Score: 104 BPM in D minor, every section starting on its own downbeat at its shot (events "music"); instruments are numpy:
marimba (sine partials 1 : 3.9 : 9.2), Karplus-Strong pizzicato bass (a damped comb filter), celesta, soft kick, brush snare, shaker, drone."""
import os, sys, json, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.environ.get('LIB') or os.path.abspath(os.path.join(HERE, '../..'))
OUT = os.environ.get('OUT') or os.path.join(HERE, 'out')
sys.path.insert(0, os.path.join(LIB, 'core/audio'))
import sfx   # noqa: E402
from sfx import SR, t_, env_exp, bp, lp, hp, noise, brown, norm, add   # noqa: E402
from scipy.signal import lfilter   # noqa: E402

E = json.load(open(os.path.join(HERE, 'events.json'))); DUR = E['dur']; EV = E['ev']
N = int((DUR + 1) * SR)
music, amb, fx, voice = (np.zeros((N, 2), np.float32) for _ in range(4))
rng = np.random.default_rng(3)
BPM = 104; BEAT = 60 / BPM; BAR = 4 * BEAT
M = lambda n: 440 * 2 ** ((n - 69) / 12)
NOTE = {'C': 0, 'C#': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
def mid(s): return 12 * (int(s[-1]) + 1) + NOTE[s[:-1]]

# ——— instruments ———
_cache = {}
def marimba(n, v=.8, d=1.2):
    k = ('m', n, d)
    if k not in _cache:
        tt = t_(d); f = M(n)
        x = sum(a * np.sin(2 * np.pi * f * r * tt) * env_exp(d, tau) for r, a, tau in [(1, 1, .45), (3.93, .35, .09), (9.2, .12, .03)])
        x[:480] += hp(noise(.01), 2000) * np.linspace(.2, 0, 480)   # mallet
        x[:48] *= np.linspace(0, 1, 48); _cache[k] = norm(x, .5)
    return _cache[k] * v
def celesta(n, v=.6, d=2.5):
    k = ('c', n, d)
    if k not in _cache:
        tt = t_(d); f = M(n)
        x = sum(a * np.sin(2 * np.pi * f * r * tt) * env_exp(d, tau) for r, a, tau in [(1, 1, .9), (2, .4, .5), (3.01, .15, .25), (4.2, .08, .12)])
        x[:96] *= np.linspace(0, 1, 96); _cache[k] = norm(x, .45)
    return _cache[k] * v
def bass(n, v=.8, d=.5):
    k = ('b', n, d)
    if k not in _cache:   # Karplus-Strong: a noise burst through a comb with a lowpassed, slightly lossy feedback
        f = M(n); P = SR / f; D = int(P); L = int((d + .4) * SR)
        exc = np.zeros(L); exc[:D] = lp(noise(D / SR), 900)[:D]
        b, a = [1.0], np.zeros(D + 2); a[0] = 1; a[D] = -.5 * .996; a[D + 1] = -.5 * .996
        y = lfilter(b, a, exc); y *= np.minimum(1, np.maximum(0, (d + .4 - t_(d + .4)[:L]) / .4))
        y += np.sin(2 * np.pi * f * t_(d + .4)[:L]) * env_exp(d + .4, .15)[:L] * .4   # the body's thump
        _cache[k] = norm(lp(y, 1200), .55)
    return _cache[k] * v
def kick(v=.8):
    d = .35; tt = t_(d); f = 48 + 70 * np.exp(-tt / .03)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .12), .7) * v
def brush(v=.5):
    d = .22; return norm(bp(noise(d), 1500, 7000) * env_exp(d, .06), .4) * v
def shaker(v=.3):
    d = .07; return norm(hp(noise(d), 5000) * np.sin(np.pi * t_(d) / d) ** 2, .3) * v
def tom(n=45, v=.7):
    d = .4; tt = t_(d); f = M(n) * (1 + .4 * np.exp(-tt / .04))
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .14) + lp(noise(d), 800) * env_exp(d, .02) * .3, .6) * v
def drone(d, notes=('D2', 'A2'), v=.25):
    tt = t_(d); x = sum(np.sin(2 * np.pi * M(mid(n)) * tt + np.sin(2 * np.pi * .2 * tt) * .5) + .3 * np.sin(2 * np.pi * M(mid(n)) * 2.003 * tt) for n in notes)
    e = np.minimum(1, tt / 1.5) * np.minimum(1, (d - tt) / 1.0)
    return lp(x, 900) * e / len(notes) * v
def tick(v=.2):
    return sfx.click(1.6, v)

# ——— the score ———
CHORDS = {'Dm': ('D', 'F', 'A'), 'Bb': ('Bb', 'D', 'F'), 'Gm': ('G', 'Bb', 'D'), 'A': ('A', 'C#', 'E'), 'F': ('F', 'A', 'C'), 'C': ('C', 'E', 'G'), 'D': ('D', 'F#', 'A')}
PROG = ['Dm', 'Bb', 'Gm', 'A']
MOTIF = [[(0, 'D5'), (.5, 'F5'), (1, 'A5'), (2.5, 'G5'), (3, 'F5')], [(0, 'D5'), (.5, 'F5'), (1, 'Bb5'), (2.5, 'A5'), (3, 'F5')],
         [(0, 'D5'), (.5, 'G5'), (1, 'Bb5'), (2.5, 'A5'), (3, 'G5')], [(0, 'C#5'), (.5, 'E5'), (1, 'A5'), (2, 'G5'), (2.5, 'F5'), (3, 'E5')]]
def root(ch, octv=2): return mid(CHORDS[ch][0] + str(octv))
def fifth(ch, octv=2): n = mid(CHORDS[ch][2] + str(octv)); return n if n > root(ch, octv) else n + 12

def put(x, at, g=1.0, pan=0.0, bus=None):
    add(music if bus is None else bus, x, at, g, pan)

def section(name, t0, t1):
    bars = int(np.ceil((t1 - t0) / BAR))
    for b in range(bars):
        tb = t0 + b * BAR; ch = PROG[b % 4]
        def at(beat): return tb + beat * BEAT
        def ok(beat): return at(beat) < t1 - .05
        if name == 'A':   # cold open: muted bass 8ths on D, ticking clock
            for k in range(8):
                if ok(k / 2): put(bass(mid('D2') + (12 if k % 4 == 3 else 0), .55, .18), at(k / 2), .9)
            for k in range(4):
                if ok(k): put(tick(.35), at(k), 1, .3)
        if name in ('B', 'C', 'F'):
            busy = name == 'C'
            for beat, n in [(0, root(ch)), (1.5, fifth(ch)), (2, root(ch)), (3, root(ch) + 12), (3.5, fifth(ch))]:
                if ok(beat): put(bass(n, .8, .35), at(beat), 1.0, -.1)
            for beat in (0, 2):
                if ok(beat) and not (name == 'B' and b < 1): put(kick(.8), at(beat), .9)
            for beat in (1, 3):
                if ok(beat): put(brush(.5), at(beat), .8, .2)
            step = .25 if busy else .5
            for k in np.arange(0, 4, step):
                if ok(k): put(shaker(.25 + .1 * (k % 1 == 0)), at(k), .7, .35)
            if b >= 2 or name != 'B':
                if (b // 4) % 2 == 0 or busy:
                    for beat, n in MOTIF[b % 4]:
                        if ok(beat):
                            put(marimba(mid(n), .7), at(beat), .9, -.25)
                            if busy: put(marimba(mid(n) + 12, .35), at(beat), .6, .3)
                else:   # answer phrase: chord tones on the off-beats
                    for k, nn in enumerate(CHORDS[ch]):
                        if ok(.5 + k): put(marimba(mid(nn + '4'), .5), at(.5 + k), .8, .25)
        if name == 'D':   # sparse: marimba + celesta arpeggios, chords at half speed; major colour under love2
            cs = ['Dm', 'Dm', 'Bb', 'Bb', 'F', 'F', 'C', 'A'][b % 8] if t0 + b * BAR > LOVE2 - .1 else ['Dm', 'Dm', 'Bb', 'Bb', 'Gm', 'Gm', 'A', 'A'][b % 8]
            for k, nn in enumerate(CHORDS[cs]):
                if ok(k * 1.0): put(marimba(mid(nn + '4'), .45, 1.6), at(k * 1.0), .8, -.2)
            if b % 2 == 0 and ok(0): put(bass(root(cs), .6, 1.2), at(0), .8)
            if b % 2 == 1 and ok(3): put(celesta(mid(CHORDS[cs][2] + '6'), .5), at(3), .7, .3)
        if name == 'G':   # coda: marimba theme, celesta doubling, soft bass
            for beat, n in MOTIF[b % 4]:
                if ok(beat): put(marimba(mid(n), .5, 1.5), at(beat), .8, -.2); put(celesta(mid(n) + 12, .25, 1.5), at(beat), .5, .3)
            if ok(0): put(bass(root(ch), .6, 1.0), at(0), .8)
    if name == 'E':   # loss: a drone and single celesta notes
        put(drone(t1 - t0), t0, 1.0)
        for k, n in enumerate(['D6', 'A5', 'F5', 'E5', 'D5']):
            tt = t0 + 1.2 + k * 2 * BAR / 2
            if tt < t1 - 1: put(celesta(mid(n), .5, 3.0), tt, .8, (-.3, .3)[k % 2])

mus = sorted([e for e in EV if e['type'] == 'music'], key=lambda e: e['t'])
sil = [e for e in EV if e['type'] == 'silence']
LOVE2 = next(e['t'] for e in EV if e['type'] == 'voice' and e['id'] == 'love2')
starts = [(0.0, 'A')] + [(e['t'], e['cue']) for e in mus if e['cue'] not in ('stinger', 'end')]
for i, (t0, name) in enumerate(starts):
    t1 = starts[i + 1][0] if i + 1 < len(starts) else next(e['t'] for e in mus if e['cue'] == 'end')
    for s in sil:   # a section stops where a silence begins
        if t0 < s['t'] < t1: t1 = s['t']
    section(name, t0, t1)
    if name == 'C': put(tom(45, .8), t0, .9); put(tom(41, .8), t0 + BEAT / 2, .9)
# the haul stinger: marimba D-major chord + kick + a noise swell into it
st = next(e['t'] for e in mus if e['cue'] == 'stinger')
sw = lp(noise(.8), 3000) * np.linspace(0, 1, int(.8 * SR)) ** 2 * .25; put(sw, st - .8, 1)
for n in ('D4', 'F#4', 'A4', 'D5', 'F#5'): put(marimba(mid(n), .8, 2.0), st, .7)
put(kick(1), st, 1.0); put(celesta(mid('A6'), .5), st + .05, .6, .3)
# the end: final D-major chord on the end card
en = next(e['t'] for e in mus if e['cue'] == 'end')
for k, n in enumerate(('D3', 'A3', 'D4', 'F#4', 'A4', 'D5')): put(marimba(mid(n), .6, 3.0), en + k * .06, .8)
put(bass(mid('D2'), .8, 2.5), en, .9); put(celesta(mid('D6'), .5, 3.0), en + .4, .7, .3)
# silences: cut everything in the music bus, tails included, with a 60 ms fade
for s in sil:
    a, b = int(s['t'] * SR), int(s['t1'] * SR); f = int(.06 * SR)
    music[a - f:a] *= np.linspace(1, 0, f)[:, None]; music[a:b] = 0; music[b:b + f] *= np.linspace(0, 1, f)[:, None]

# ——— ambiences ———
def fade(x, a=.4, b=.4):
    n = len(x); fa, fb = min(n // 2, int(a * SR)), min(n // 2, int(b * SR)); x[:fa] *= np.linspace(0, 1, fa); x[n - fb:] *= np.linspace(1, 0, fb); return x
def ambience(kind, d):
    tt = t_(d)
    if kind == 'press':
        clat = np.zeros(len(tt))
        for k in np.arange(0, d, .25): c = sfx.clack(.6 + .15 * (int(k * 4) % 3), .5); s = int(k * SR); clat[s:s + len(c)] += c[:len(clat) - s]
        return lp(brown(d), 300) * .5 + np.sin(2 * np.pi * 100 * tt) * .05 + lp(clat, 2500) * .35
    if kind == 'night': return lp(brown(d), 400) * .5 + bp(noise(d), 4200, 4800) * (np.sin(2 * np.pi * 7 * tt) > .6) * .05
    if kind in ('room', 'study', 'low'): return lp(brown(d), 900 if kind != 'low' else 150) * (.25 if kind != 'low' else .35)
    if kind == 'street': return lp(brown(d), 600) * .5 + bp(noise(d), 300, 1200) * (.2 + .15 * np.sin(2 * np.pi * .15 * tt)) * .3
    if kind == 'earth': return lp(brown(d), 160) * .7
    if kind == 'cafe': return bp(noise(d), 300, 1600) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 1.3 * tt) * np.sin(2 * np.pi * .7 * tt))) * .18 + lp(brown(d), 500) * .2
    if kind == 'tunnel':
        x = lp(brown(d), 300) * .5
        for k in np.arange(.7, d, 1.3): x[int(k * SR):int(k * SR) + 4800] += drip(.25)[:len(x) - int(k * SR)][:4800]
        return x
    if kind == 'sea': return lp(noise(d), 1200) * (.35 + .65 * np.sin(2 * np.pi * .13 * tt) ** 2) * .5
    return np.zeros(len(tt))
def drip(v=.5):
    d = .1; tt = t_(d); f = 1500 * np.exp(-tt / .03) + 600
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .02), .5) * v
AMB_G = {'press': .55, 'night': .35, 'room': .25, 'study': .22, 'street': .35, 'earth': .45, 'cafe': .5, 'low': .3, 'tunnel': .5, 'sea': .45}
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
    d = .6; tt = t_(d); f = 220 + 260 * np.exp(-tt / .3) * (1 + .3 * np.sin(2 * np.pi * 14 * tt))
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(d, .25), .5) * v
def crack(v=.8):
    d = .5; x = hp(noise(d), 1500) * env_exp(d, .015)
    for k in range(6): s = int((.02 + k * .045) * SR); c = sfx.click(.5 + k * .1, .5); x[s:s + len(c)] += c[:len(x) - s]
    th = sfx.thump(.5, 55); x[:len(th)] += th[:len(x)]
    return norm(x, .7) * v
def toll(v=.5):
    d = 3.0; tt = t_(d); f = M(mid('D3'))
    return norm(sum(a * np.sin(2 * np.pi * f * r * tt) * env_exp(d, tau) for r, a, tau in [(1, 1, 1.2), (2.01, .5, .7), (2.76, .3, .4), (4.07, .15, .2)]), .5) * v
def rise(v=.3):
    d = 1.0; tt = t_(d); return norm(bp(noise(d), 800, 5000) * (tt / d) ** 2, .4) * v
def heart(v=.5):
    return np.concatenate([sfx.pop(.6), np.zeros(int(.05 * SR))])[:int(.23 * SR)] * v
FX = {
    'pop': lambda e: sfx.pop(.35 if e.get('out') else .5), 'step': lambda e: sfx.step(.18 if e.get('soft') else .28), 'tick': lambda e: sfx.click(1.3, .3),
    'paper': lambda e: paper(.5), 'marker': lambda e: marker(2.6 if e.get('long') else .45, .3 if e.get('long') else .4), 'dig': lambda e: sfx.thump(.4, 90),
    'whoosh': lambda e: sfx.whoosh(.32, .45), 'stamp': lambda e: sfx.thump(.9, 60) + np.pad(sfx.click(.7, .4), (0, int(.35 * SR) - len(sfx.click()))),
    'ting': lambda e: ting(.45), 'toll': lambda e: toll(.5), 'heart': lambda e: heart(.6), 'pin': lambda e: sfx.click(.9, .4), 'door': lambda e: sfx.thump(1.0, 48),
    'scope': lambda e: sfx.clack(1.3, .4), 'rustle': lambda e: paper(.35), 'slide': lambda e: lp(paper(.4), 1500), 'boing': lambda e: boing(.55), 'crack': lambda e: crack(.7),
    'drip': lambda e: drip(.5), 'rise': lambda e: rise(.3),
}
for k, e in enumerate(EV):
    f = FX.get(e['type'])
    if f: add(fx, f(e).astype(np.float32), e['t'], .7, float(np.sin(k * 2.3)) * .25)

# ——— voice, centred and dry ———
for e in EV:
    if e['type'] == 'voice':
        y, sr = sf.read(os.path.join(HERE, 'voice/proc', e['id'] + '.wav'), dtype='float32'); add(voice, y, e['t'], .7)

# ——— ducking: music and ambience go down ~8 dB under the voice (fast attack, slow release) ———
env = np.abs(voice[:, 0]); w = int(.02 * SR); env = np.convolve(env, np.ones(w) / w, 'same')
key = (env > .02).astype(np.float32)
a, r = np.exp(-1 / (.03 * SR)), np.exp(-1 / (.35 * SR))
att = lfilter([1 - a], [1, -a], key); rel = lfilter([1 - r], [1, -r], key); sm = np.maximum(att, rel)
duck = (10 ** (-8 / 20)) ** np.clip(sm * 1.4, 0, 1)
mixd = music * .45 * duck[:, None] + amb * (.6 + .4 * duck[:, None]) + fx + voice
for c in range(2): mixd[:, c] = sfx.limit(sfx.compress(mixd[:, c], thr=.35, ratio=2.5), .95)
mixd = mixd[:int(DUR * SR)]
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'mix.wav'), mixd.astype(np.float32), SR, subtype='PCM_16')
print('mix', round(len(mixd) / SR, 2), 's, peak', round(float(np.abs(mixd).max()), 3))
if '--stats' in sys.argv:   # level check: voice against the bed while she speaks, and the bed alone in the gaps
    v = np.abs(voice[:len(mixd), 0]) > .02; bed = (music * .45 * duck[:, None] + amb * (.6 + .4 * duck[:, None]) + fx)[:len(mixd), 0]
    db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
    print('voice', round(db(voice[:len(mixd), 0][v]), 1), 'dB | bed under voice', round(db(bed[v]), 1), 'dB | bed in gaps', round(db(bed[~v]), 1), 'dB')
