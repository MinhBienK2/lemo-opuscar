"""Score, foley and mix: .venv/bin/python mix.py  → out/mix.wav"""
import os, sys, json, math
import numpy as np, soundfile as sf
LIB = os.environ.get('LIB', os.path.abspath('../..'))
sys.path.insert(0, os.path.join(LIB, 'core/audio'))
from sfx import SR, add, compress, limit, noise, lp, hp, bp, norm, env_exp, t_, creak, thump, pop as fpop, ding

HERE = os.path.dirname(os.path.abspath(__file__))
T = json.load(open(os.path.join(HERE, 'timing.json')))
EV = json.load(open(os.path.join(HERE, 'events.json')))['ev']
DUR = T['DUR']
N = int(DUR * SR)
mix = np.zeros((N, 2), np.float32)
mus = np.zeros((N, 2), np.float32)
fx = np.zeros((N, 2), np.float32)
rng = np.random.default_rng(11)

def put(buf, x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= len(buf) or i + len(x) <= 0: return
    if i < 0: x = x[-i:]; i = 0
    x = x[:len(buf) - i]
    l, r = math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)
    buf[i:i + len(x), 0] += x * gain * l
    buf[i:i + len(x), 1] += x * gain * r

# ---------- instruments ----------
def note(f, d, tau=1.2, harm=((1, 1), (2, .4), (3, .16)), detune=0.0):
    tt = t_(d)
    x = np.zeros_like(tt)
    for k, a in harm:
        x += a * np.sin(2 * np.pi * f * k * (1 + detune) * tt + rng.random() * 6)
    return x * np.exp(-tt / tau) * (1 - np.exp(-tt / .004))

def musicbox(f, d=1.6):
    tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) + .35 * np.sin(2 * np.pi * f * 2.01 * tt) + .12 * np.sin(2 * np.pi * f * 3.9 * tt)
    return x * np.exp(-tt / .55) * (1 - np.exp(-tt / .002))

def pizz(f, d=.5):
    tt = t_(d)
    x = sum(a * np.sin(2 * np.pi * f * k * tt) for k, a in ((1, 1), (2, .5), (3, .3), (4, .12)))
    return x * np.exp(-tt / .16) * (1 - np.exp(-tt / .003))

def clarinet(f, d):
    tt = t_(d)
    vib = 1 + .004 * np.sin(2 * np.pi * 5 * tt) * np.clip(tt / .4, 0, 1)
    x = np.sin(2 * np.pi * f * vib * tt) + .25 * np.sin(2 * np.pi * f * 3 * tt) + .1 * np.sin(2 * np.pi * f * 5 * tt)
    e = np.clip(tt / .08, 0, 1) * np.clip((d - tt) / .18, 0, 1)
    return x * e

def glock(f, d=.9):
    tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) + .5 * np.sin(2 * np.pi * f * 2.76 * tt) + .2 * np.sin(2 * np.pi * f * 5.4 * tt)
    return x * np.exp(-tt / .3) * (1 - np.exp(-tt / .001))

def brush(d=.18, v=1.0):
    x = bp(noise(d), 1800, 7000) * env_exp(d, .05)
    return norm(x) * v

def gong(f=98, d=4.0):
    tt = t_(d)
    x = sum(a * np.sin(2 * np.pi * f * k * tt + rng.random() * 6) for k, a in ((1, 1), (1.48, .5), (2.1, .35), (3.2, .2)))
    return x * np.exp(-tt / 1.6) * (1 - np.exp(-tt / .01))

def toy(f, d=.7):
    tt = t_(d)
    x = np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * f * 3 * tt)
    return x * np.exp(-tt / .22) * (1 - np.exp(-tt / .002))

def drone(f, d):
    tt = t_(d)
    x = sum(np.sin(2 * np.pi * f * k * tt + .3 * np.sin(2 * np.pi * .07 * tt)) for k in (1, 1.005, 2))
    return lp(x * .3, 400) * np.clip(tt / 1.5, 0, 1) * np.clip((d - tt) / 1.5, 0, 1)

def lowpiano(f, d=2.4):
    tt = t_(d)
    x = sum(a * np.sin(2 * np.pi * f * k * tt) for k, a in ((1, 1), (2, .35), (3, .12)))
    return x * np.exp(-tt / .9) * (1 - np.exp(-tt / .004))

NOTE = {'D2': 73.42, 'F2': 87.31, 'A2': 110.0, 'Bb2': 116.54, 'C3': 130.81, 'D3': 146.83, 'F3': 174.61, 'G3': 196.0, 'A3': 220.0, 'Bb3': 233.08, 'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.0, 'A4': 440.0, 'Bb4': 466.16, 'C5': 523.25, 'D5': 587.33, 'F5': 698.46, 'A5': 880.0}
def n(k): return NOTE[k]

# ---------- score ----------
BPM = 96; BEAT = 60 / BPM; BAR = BEAT * 4
OPEN = T['OPEN']; CH = T['CH']; CLOSE = T['CLOSE']
ch_t = {c['spread']: c['t0'] for c in CH}
S = [0.0, ch_t[1], ch_t[2], ch_t[3], ch_t[4], ch_t[5], ch_t[6], CLOSE[0], DUR]
# A · cover: music box alone
for i, k in enumerate(['D5', 'A4', 'F4', 'D4', 'A4', 'F4', 'D4', 'A3']):
    put(mus, musicbox(n(k), 1.8), 1.0 + i * BAR, .16, -.2)
# B · road: pizzicato + brushes + bass
t = S[1]
i = 0
while t < S[2] - .4:
    chord = [['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3'], ['F2', 'A2', 'C3'], ['C3', 'E4', 'G3']][(i // 2) % 4]
    for j, k in enumerate(chord):
        put(mus, pizz(n(k)), t + j * BEAT * .5, .13, (-.35, 0, .35)[j])
    put(mus, note(n(chord[0]) / 2, BAR * 1.2, 1.4, ((1, 1), (2, .5))), t, .12, 0)
    for b in (1, 3): put(mus, brush(), t + b * BEAT, .10, .25)
    t += BAR; i += 1
# C · hall: clarinet + glockenspiel
t = S[2]; i = 0
while t < S[3] - .4:
    k = ['D4', 'F4', 'A4', 'F4'][i % 4]
    put(mus, clarinet(n(k), BAR * 1.4), t, .11, -.15)
    put(mus, glock(n(['A5', 'D5', 'F5', 'A5'][i % 4]), 1.2), t + BEAT * 2, .09, .3)
    put(mus, pizz(n('D3')), t, .10, 0)
    t += BAR; i += 1
# D · register: toy piano + tick
t = S[3]; i = 0
while t < S[4] - .4:
    for j, k in enumerate(['D4', 'F4', 'A4', 'C5']):
        put(mus, toy(n(k)), t + j * BEAT, .08, -.2 + j * .12)
    put(mus, brush(.08, .7), t + BEAT * 2, .06, 0)
    t += BAR; i += 1
# E · shelf: drone + low pizz
t = S[4]; i = 0
while t < S[5] - .4:
    if i == 0: put(mus, drone(n('D2'), S[5] - S[4]), S[4], .12, 0)
    put(mus, pizz(n(['D3', 'Bb2', 'F2', 'C3'][i % 4])), t, .10, 0)
    if i % 2 == 0: put(mus, glock(n('D5'), .8), t + BEAT * 3, .05, .4)
    t += BAR; i += 1
# F · sutras: celesta + clarinet
t = S[5]; i = 0
while t < S[6] - .4:
    put(mus, glock(n(['F5', 'D5', 'A5', 'F5'][i % 4]), 1.4), t, .10, -.25)
    put(mus, clarinet(n(['D4', 'A3', 'F4', 'C4'][i % 4]), BAR * 2), t, .07, .2)
    put(mus, pizz(n('D3')), t, .08, 0)
    t += BAR; i += 1
# G · river: sparse music box, then silence 2 bars before the tear
t = S[6]; i = 0
tear = T['L']['f5']['t0'] + .4
while t < S[7] - .4:
    if t < tear - 4.6 or t > tear + 1.2:
        put(mus, musicbox(n(['D5', 'F5', 'A4', 'D5'][i % 4]), 1.6), t, .09, -.2)
    t += BAR * 2; i += 1
# H · ford: low piano + music box reprise
t = S[7]; i = 0
while t < DUR - 2:
    put(mus, lowpiano(n(['D2', 'Bb2', 'F2', 'D2'][i % 4]), 3.0), t, .11, 0)
    if i % 2 == 0: put(mus, musicbox(n(['A4', 'D5'][i % 2]), 2.0), t + BAR, .07, .2)
    t += BAR * 2; i += 1

# ---------- foley ----------
def paper_page(d=1.8):
    n = bp(noise(d), 900, 6000)
    x = n * (np.abs(np.sin(np.linspace(0, math.pi * 3, len(n)))) ** 2)
    return norm(lp(x, 8000)) * .8
def paper_tear(d=1.1):
    x = bp(noise(d), 1200, 9000)
    e = np.linspace(0, 1, len(x)) ** .4 * (1 - np.linspace(0, 1, len(x)) ** 6)
    clicks = (rng.random(len(x)) < .002).astype(float)
    from scipy.signal import butter, sosfilt
    burst = sosfilt(butter(2, 2000, 'high', fs=SR, output='sos'), clicks)
    return norm(x * e + hp(burst, 2000) * .8)
def stamp(d=.35):
    tt = t_(d)
    return norm(np.sin(2 * np.pi * 120 * tt) * env_exp(d, .04) + hp(noise(d), 800) * env_exp(d, .012)) * .8
def splash(d=.8):
    return norm(bp(noise(d), 300, 4000) * env_exp(d, .18)) * .7
def water(d=2.2):
    n = bp(noise(d), 200, 1400)
    x = n * (.6 + .4 * np.sin(np.linspace(0, 9, len(n))))
    return norm(x) * .5
def ting():
    tt = t_(1.2); return norm(np.sin(2 * np.pi * 2637 * tt) * env_exp(1.2, .35) + .4 * np.sin(2 * np.pi * 3951 * tt) * env_exp(1.2, .2)) * .6
def flip():
    tt = t_(.18); return norm(bp(noise(.18), 1500, 7000) * env_exp(.18, .02)) * .6

for e in EV:
    ty = e['type']; t0 = e['t']
    if ty == 'pop': put(fx, fpop(), t0, .20, (rng.random() - .5) * .6)
    elif ty == 'page': put(fx, paper_page(min(2.4, e.get('d', 1.6) + .3)), t0, .26, 0)
    elif ty == 'creak': put(fx, creak(), t0, .30, -.1)
    elif ty == 'thump': put(fx, thump(f=90), t0, .34, 0)
    elif ty == 'stamp': put(fx, stamp(), t0, .40, 0)
    elif ty == 'tear': put(fx, paper_tear(), t0, .45, .1)
    elif ty == 'splash': put(fx, splash(), t0, .30, -.1)
    elif ty == 'water': put(fx, water(), t0, .16, .1)
    elif ty == 'ting': put(fx, ting(), t0, .18, .2)
    elif ty == 'flip': put(fx, flip(), t0, .22, .1)
    elif ty == 'step': put(fx, brush(.06, .5), t0, .04, 0)

# ---------- ambience ----------
room = lp(noise(3), 500) * .5
room2 = np.tile(room, int(DUR / 3) + 2)[:N]
put(fx, room2 * (1 - np.clip((np.arange(N) / SR - OPEN[1]) / 3, 0, 1)), 0, .05, 0)
paper_bed = lp(noise(4), 900) * .4
pb = np.tile(paper_bed, int(DUR / 4) + 2)[:N]
put(fx, pb, OPEN[1], .035, 0)
# close: room comes back
put(fx, room2, CLOSE[0], .05, 0)

# ---------- voice ----------
voice = np.zeros(N, np.float32)
vd = json.load(open(os.path.join(HERE, 'voice/dur.json')))
for lid, rec in T['L'].items():
    p = os.path.join(HERE, 'voice', lid + '.wav')
    if not os.path.exists(p): continue
    y, sr = sf.read(p, dtype='float32')
    if y.ndim > 1: y = y.mean(1)
    if sr != SR:
        from scipy.signal import resample_poly
        y = resample_poly(y, SR, sr).astype(np.float32)
    y = hp(y, 90)
    y = compress(y, thr=.20, ratio=3.0, att=.004, rel=.12)
    i = int(rec['t0'] * SR); voice[i:i + len(y)] += y[:max(0, N - i)] * .9
voice = limit(voice, .92)

# duck music under the voice (RMS envelope)
# A moving average is an IIR filter: sosfilt does it in linear time (np.convolve with a 16 800-tap kernel on
# 29 M samples would take hours).
def smooth(x, tau):
    """One-pole moving average of x with the time constant tau (seconds), normalised to keep x's own mean."""
    from scipy.signal import butter, sosfilt
    a = 1 - np.exp(-1 / (tau * SR))
    sos = butter(2, [max(1e-5, a * .5), min(.9995, a * 4)], 'band', fs=SR, output='sos')
    y = sosfilt(sos, x)
    return y - y.mean() + x.mean()
env = np.sqrt(np.maximum(smooth(voice ** 2, .05), 0))
duck = 1 - .62 * np.clip(env / (np.percentile(env[env > 1e-4], 70) + 1e-6), 0, 1)
duck = smooth(duck, .35)
mus *= duck[:, None] * .85
fx *= (1 - .25 * np.clip(env * 4, 0, 1))[:, None]

mix = voice[:, None] * 1.0 + mus + fx
# gentle master: remove DC, soft limit, normalize
mix = mix - mix.mean(0)
mix = np.tanh(mix * 1.05) * .92
mix = limit(mix, .95)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out/mix.wav'), mix, SR)
print('mix.wav', round(len(mix) / SR, 1), 's  peak', round(float(np.abs(mix).max()), 3), ' voice', round(float(np.abs(voice).max()), 3))
