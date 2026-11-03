"""Foley by material and by gesture (numpy/scipy, mono float32 @ SR). Every sound has a cause you can see:
a card set on a counter, a glass touching another, a pen ticking a box, a page turning, a scene cutting.

    from foley import FOLEY, CATALOG, play
    x = play('card_set', v=.6, var=3)      # var: the take — the same name never sounds twice the same

Names are grouped by what makes them (CATALOG holds a one-line description of each, `python foley.py` prints it):
  paper     paper_slide paper_flip page_turn paper_crumple paper_tear card_set card_flip envelope
  pen       pen_tick pen_cross pen_scribble pen_circle pen_cap chalk_tap
  wood      wood_knock wood_set drawer chair_creak door_knock door_close
  glass     glass_clink glass_set bottle_set pour
  metal     can_set can_open coin coin_pile keys metal_tap bell_desk
  plastic   plastic_click plastic_set button switch
  ceramic   cup_set spoon_stir
  cloth     cloth_rustle sit_down stand_up
  body      step_soft step_hard clap finger_snap hand_tap gasp_breath sigh_breath
  devices   beep blip_up blip_down phone_buzz notify keyboard mouse_click camera_shutter scanner timer_tick alarm cash_register
  graphics  label_in label_out bar_grow count_tick reveal_soft dot_place line_draw  (for labels and charts that appear on screen:
            quiet and short, so a label coming in is heard without sounding like an object)
  scene     whoosh_soft whoosh_hard swipe iris_open iris_close light_on light_off riser impact_soft impact_hard thud_low
            silence_cut (a click of the room tone dropping out, before a punch)
Ambience beds (play_bed(kind, d)): cafe crowd office street rain lab hum night_city kitchen classroom
"""
import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000


def _t(d): return np.arange(int(round(d * SR))) / SR
def _env(d, tau): return np.exp(-_t(d) / tau)
def _bp(x, lo, hi, o=2): return sosfilt(butter(o, [max(20, lo), min(SR / 2 - 100, hi)], 'band', fs=SR, output='sos'), x)
def _lp(x, f, o=2): return sosfilt(butter(o, min(f, SR / 2 - 100), 'low', fs=SR, output='sos'), x)
def _hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def _norm(x, p=1.0): m = np.abs(x).max() if len(x) else 0; return x * (p / m) if m > 0 else x
def _pad(x, d): n = int(round(d * SR)); return np.pad(x, (0, max(0, n - len(x))))[:max(n, len(x))]


class _Take:
    """the random state of one take: detune, timing jitter, noise"""
    def __init__(self, var): self.r = np.random.default_rng(1000 + int(var))
    def noise(self, d): return self.r.standard_normal(int(round(d * SR)))
    def j(self, a=.06): return 1 + (self.r.random() * 2 - 1) * a   # a jitter factor around 1


def _modal(k, d, modes, exc=.002, bright=4000):
    """a struck object: a short noise excitation through damped resonances (f, amp, tau)"""
    tt = _t(d); x = _hp(k.noise(d), 200) * _env(d, exc) * .4
    for f, a, tau in modes:
        f *= k.j(.03); x = x + a * np.sin(2 * np.pi * f * tt + k.r.random() * 6) * _env(d, tau * k.j(.1))
    return _lp(x, bright * k.j(.1))


def _brush(k, d, lo, hi, shape=1.5):
    """friction: band noise under a smooth envelope"""
    tt = _t(d); return _bp(k.noise(d), lo, hi) * np.sin(np.pi * tt / d) ** shape


def _seq(parts, d):
    """place (start, sound) pairs into one buffer of d seconds"""
    out = np.zeros(int(round(d * SR)))
    for s, x in parts:
        i = int(s * SR)
        if i >= len(out): continue
        n = min(len(x), len(out) - i); out[i:i + n] += x[:n]
    return out


# —— paper ——
def paper_slide(k):
    """a sheet or a card slid across a surface"""
    d = .32 * k.j(.15); tt = _t(d); return _brush(k, d, 900, 6500, 1.2) * (1 + .4 * np.sin(2 * np.pi * 13 * tt) ** 2)
def paper_flip(k):
    d = .22; return _brush(k, d, 1500, 9000, 3) + _lp(k.noise(d), 600) * _env(d, .03) * .3
def page_turn(k):
    d = .55; tt = _t(d); x = _brush(k, d, 1200, 8000, 1.2) * (1 + .6 * np.sin(2 * np.pi * 7 * tt) ** 2)
    return x + _seq([(.42, _lp(k.noise(.1), 800) * _env(.1, .015) * 1.5)], d)
def paper_crumple(k):
    d = .7; out = np.zeros(int(d * SR))
    for _ in range(26):
        s = k.r.random() * .6; c = _hp(k.noise(.03), 1500) * _env(.03, .004) * (.3 + k.r.random())
        i = int(s * SR); out[i:i + len(c)] += c[:len(out) - i]
    return out
def paper_tear(k):
    d = .5; tt = _t(d); x = _bp(k.noise(d), 1800, 9000) * (np.abs(np.sin(2 * np.pi * 47 * tt)) ** 4 + .3)
    return x * np.minimum(1, tt / .05) * np.minimum(1, (d - tt) / .1)
def card_set(k):
    """a card or a ticket laid on a table: a soft slap with the table under it"""
    d = .2; return _hp(k.noise(d), 700) * _env(d, .012) + _modal(k, d, [(240, .4, .03), (520, .25, .02)], bright=3000) * .6
def card_flip(k):
    d = .25; return _seq([(0, paper_flip(k) * .6), (.12, card_set(k) * .7)], d)
def envelope(k):
    d = .6; return _seq([(0, paper_slide(k)), (.3, paper_flip(k) * .7)], d)


# —— pen and chalk ——
def pen_tick(k):
    """a check mark: two short strokes"""
    d = .3; return _seq([(0, _brush(k, .07, 2500, 7000, 1)), (.09, _brush(k, .16, 2200, 7000, 1))], d)
def pen_cross(k):
    d = .45; return _seq([(0, _brush(k, .16, 2200, 7000, 1)), (.22, _brush(k, .16, 2400, 7500, 1))], d)
def pen_scribble(k, d=.8):
    tt = _t(d); f = 9 * k.j(.2)
    return _bp(k.noise(d), 2000, 7000) * (np.abs(np.sin(2 * np.pi * f * tt)) ** 2 * .8 + .2) * np.sin(np.pi * tt / d) ** .4
def pen_circle(k):
    d = .6; tt = _t(d); return _bp(k.noise(d), 2200, 6500) * (.6 + .4 * np.sin(2 * np.pi * 3 * tt)) * np.sin(np.pi * tt / d) ** .6
def pen_cap(k): return _modal(k, .08, [(3200, .5, .01), (5400, .3, .006)], exc=.001, bright=9000)
def chalk_tap(k): return _hp(k.noise(.06), 1500) * _env(.06, .006) + _modal(k, .06, [(900, .3, .01)])


# —— wood ——
def wood_knock(k):
    d = .25; return _seq([(0, _modal(k, .2, [(420, .8, .03), (980, .4, .015), (1800, .2, .008)])),
                          (.12, _modal(k, .13, [(430, .6, .025), (1000, .3, .012)]))], d)
def wood_set(k): return _modal(k, .25, [(180, .8, .05), (410, .5, .03), (900, .2, .015)], exc=.004, bright=2500)
def drawer(k):
    d = .7; tt = _t(d); return _bp(k.noise(d), 300, 2500) * np.minimum(1, tt / .1) * (tt < .55) + _seq([(.55, wood_set(k))], d)
def chair_creak(k):
    d = .45; tt = _t(d); f0 = 85 * k.j(.2); saw = 2 * ((tt * f0 * (1 + .25 * np.sin(2 * np.pi * 6 * tt))) % 1) - 1
    return _bp(saw, 500, 3200) * np.abs(np.sin(2 * np.pi * 17 * tt)) ** 3 * np.sin(np.pi * tt / d)
def door_knock(k):
    return _seq([(i * .22 * k.j(.05), _modal(k, .2, [(160, 1, .04), (380, .4, .02)], bright=1800)) for i in range(3)], .8)
def door_close(k):
    d = .6; return _modal(k, d, [(80, 1, .12), (190, .5, .06), (450, .2, .03)], exc=.01, bright=1500) + _lp(k.noise(d), 300) * _env(d, .05) * .4


# —— glass ——
def glass_clink(k): return _modal(k, .9, [(2350, 1, .25), (3720, .6, .15), (5510, .35, .09), (1380, .2, .3)], exc=.0008, bright=12000)
def glass_set(k): return _modal(k, .4, [(1900, .4, .06), (3100, .25, .04), (300, .6, .03)], exc=.002, bright=8000)
def bottle_set(k): return _modal(k, .45, [(800, .5, .08), (1650, .35, .05), (220, .7, .04)], exc=.002, bright=6000)
def pour(k, d=1.0):
    tt = _t(d); f = 600 + 900 * tt / d
    return _bp(k.noise(d), 300, 3000) * .4 * (1 + .5 * np.sin(2 * np.pi * np.cumsum(f / 60) / SR * 60)) * np.sin(np.pi * tt / d) ** .5


# —— metal ——
def can_set(k): return _modal(k, .3, [(640, .6, .04), (1530, .5, .03), (2900, .3, .02), (200, .5, .03)], exc=.002, bright=7000)
def can_open(k):
    d = .6; return _seq([(0, _modal(k, .06, [(3000, .6, .01)], exc=.001, bright=10000)),
                         (.05, _hp(k.noise(.4), 2500) * _env(.4, .12) * .7)], d)
def coin(k): return _modal(k, .7, [(4100, 1, .2), (6800, .5, .12), (2600, .3, .15)], exc=.0006, bright=14000)
def coin_pile(k):
    return _seq([(i * .07 * k.j(.3), coin(_Take(k.r.integers(1e6))) * (.5 + .5 * k.r.random())) for i in range(6)], .9)
def keys(k):
    return _seq([(k.r.random() * .25, _modal(_Take(k.r.integers(1e6)), .3, [(3500 * k.j(.3), .6, .06), (5200, .3, .04)], exc=.0005, bright=12000)) for _ in range(9)], .6)
def metal_tap(k): return _modal(k, .5, [(1180, 1, .12), (2950, .5, .07), (4700, .25, .04)], exc=.0008, bright=10000)
def bell_desk(k): return _modal(k, 1.4, [(2490, 1, .6), (6150, .4, .25), (3540, .25, .35)], exc=.0005, bright=12000)


# —— plastic ——
def plastic_click(k): return _modal(k, .07, [(2900, .6, .012), (4600, .4, .008), (1500, .35, .018)], exc=.0015, bright=10000)
def plastic_set(k): return _modal(k, .15, [(1100, .5, .02), (2300, .4, .012), (380, .5, .02)], exc=.003, bright=6000)
def button(k): return _seq([(0, plastic_click(k)), (.07, plastic_click(k) * .5)], .2)
def switch(k): return _modal(k, .1, [(1800, .7, .015), (3600, .3, .008)], exc=.001, bright=9000) + _lp(k.noise(.1), 400) * _env(.1, .01) * .4


# —— ceramic ——
def cup_set(k): return _modal(k, .35, [(1250, .6, .06), (2700, .35, .04), (320, .7, .03)], exc=.003, bright=6000)
def spoon_stir(k):
    return _seq([(i * .17 * k.j(.1), _modal(_Take(k.r.integers(1e6)), .12, [(3300, .4, .03), (5100, .2, .02)], exc=.0008, bright=10000)) for i in range(5)], .95)


# —— cloth and body ——
def cloth_rustle(k, d=.5): return _brush(k, d, 500, 4500, .8) * .7
def sit_down(k): return _seq([(0, cloth_rustle(k, .35)), (.25, _lp(k.noise(.2), 400) * _env(.2, .04) * 1.4), (.28, chair_creak(k) * .4)], .8)
def stand_up(k): return _seq([(0, chair_creak(k) * .4), (.1, cloth_rustle(k, .45))], .7)
def step_soft(k): return _lp(k.noise(.16), 900) * _env(.16, .025) + _bp(k.noise(.16), 1000, 3000) * _env(.16, .01) * .3
def step_hard(k): return _modal(k, .18, [(160, .7, .025), (700, .3, .012)], exc=.004, bright=3500) + _seq([(0, _hp(k.noise(.08), 2000) * _env(.08, .005) * .5)], .18)
def clap(k): return _bp(k.noise(.12), 700, 6000) * _env(.12, .012)
def finger_snap(k): return _hp(k.noise(.08), 2000) * _env(.08, .006) + _modal(k, .08, [(2200, .5, .01)], bright=8000)
def hand_tap(k): return _lp(k.noise(.1), 1500) * _env(.1, .012) + _modal(k, .1, [(260, .5, .02)], bright=2000)
def gasp_breath(k): d = .35; tt = _t(d); return _bp(k.noise(d), 700, 4500) * np.minimum(1, tt / .05) * _env(d, .12) * .7
def sigh_breath(k): d = 1.0; tt = _t(d); return _bp(k.noise(d), 300, 2500) * np.sin(np.pi * tt / d) ** 1.5 * .6


# —— devices ——
def _tone(f, d, v=1.0, a=.004, r=.02):
    tt = _t(d); x = np.sin(2 * np.pi * f * tt); n = len(x)
    ea = np.minimum(1, tt / a); er = np.minimum(1, (d - tt) / r); return x * ea * er * v
def beep(k): return _tone(1400 * k.j(.02), .14)
def blip_up(k):
    d = .12; tt = _t(d); f = 900 + 900 * tt / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, (d - tt) / .02) * .8
def blip_down(k):
    d = .12; tt = _t(d); f = 1800 - 900 * tt / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, (d - tt) / .02) * .8
def phone_buzz(k):
    d = .9; tt = _t(d); x = np.sign(np.sin(2 * np.pi * 150 * tt)) * .5 + _bp(k.noise(d), 100, 900) * .3
    return _lp(x, 1200) * ((tt % .45) < .3)
def notify(k): return _seq([(0, _tone(1320, .16, .7)), (.12, _tone(1760, .3, .6, r=.2))], .5)
def keyboard(k, n=8):
    return _seq([(i * .085 * k.j(.35), plastic_click(_Take(k.r.integers(1e6))) * (.5 + .5 * k.r.random())) for i in range(n)], n * .1 + .1)
def mouse_click(k): return _seq([(0, plastic_click(k) * .7), (.06, plastic_click(k) * .4)], .15)
def camera_shutter(k): return _seq([(0, _modal(k, .05, [(2500, .6, .008)], exc=.001, bright=9000)), (.07, _hp(k.noise(.08), 1500) * _env(.08, .015))], .2)
def scanner(k, d=1.2): tt = _t(d); return (_bp(k.noise(d), 400, 3000) * .3 + _tone(220, d, .2, r=.1)) * np.sin(np.pi * tt / d) ** .3
def timer_tick(k): return _modal(k, .05, [(3000, .6, .006), (1500, .3, .008)], exc=.0008, bright=9000)
def alarm(k): return _seq([(i * .25, _tone(2000, .12, .7)) for i in range(4)], 1.0)
def cash_register(k): return _seq([(0, plastic_click(k)), (.1, metal_tap(k) * .5), (.25, bell_desk(k) * .6)], 1.2)


# —— graphics on screen (labels, charts): quiet, short, never louder than an object ——
def label_in(k): return _seq([(0, _brush(k, .1, 2000, 9000, 2) * .4), (.03, _tone(1500 * k.j(.05), .08, .35))], .15)
def label_out(k): return _brush(k, .12, 1500, 7000, 2) * .3
def bar_grow(k, d=.6):
    tt = _t(d); f = 300 + 500 * tt / d; return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d) * .3 + _brush(k, d, 1000, 5000, 1) * .15
def count_tick(k): return _tone(2200 * k.j(.03), .04, .4, a=.001, r=.02)
def reveal_soft(k): d = .5; tt = _t(d); return _bp(k.noise(d), 2000, 9000) * (tt / d) ** 2 * .4 + _seq([(.4, _tone(1760, .25, .25, r=.2))], d)
def dot_place(k): return _modal(k, .08, [(1700 * k.j(.1), .4, .015)], exc=.001, bright=8000) * .6
def line_draw(k, d=.5): return _brush(k, d, 2500, 8000, .5) * .3


# —— scene: cuts and transitions ——
def _sweep(k, d, lo, hi, q=.3):
    n = k.noise(d); tt = _t(d); out = np.zeros_like(n)
    for i in range(0, len(n), 480):
        h = min(len(n), i + 480); f = lo + (hi - lo) * np.sin(np.pi * i / len(n)); seg = _bp(n[max(0, i - 2000):h], f * (1 - q), f * (1 + q))[-(h - i):]; out[i:h] = seg
    return out * np.sin(np.pi * tt / d) ** 2
def whoosh_soft(k): return _sweep(k, .45, 400, 2200) * .7
def whoosh_hard(k): return _sweep(k, .32, 600, 4200, .4) + _seq([(.22, _lp(k.noise(.15), 300) * _env(.15, .03) * .6)], .32)
def swipe(k): return _sweep(k, .2, 1500, 6000, .5) * .7
def iris_open(k): d = .5; tt = _t(d); return _sweep(k, d, 300, 1500) * .5 + _tone(440, d, .12, r=.3) * (tt / d)
def iris_close(k): d = .5; tt = _t(d); return _sweep(k, d, 1500, 300) * .5 + _tone(330, d, .12, r=.3) * (1 - tt / d)
def light_on(k): return _seq([(0, switch(k)), (.05, _tone(120, .4, .05, r=.3) + _hp(k.noise(.4), 6000) * _env(.4, .2) * .05)], .5)
def light_off(k): return _seq([(0, switch(k)), (.04, _lp(k.noise(.15), 200) * _env(.15, .03) * .3)], .3)
def riser(k, d=1.5): tt = _t(d); return _bp(k.noise(d), 500, 6000) * (tt / d) ** 2.5 * .7 + _tone(220, d, .15, r=.05) * (tt / d) ** 2
def impact_soft(k): d = .6; return _modal(k, d, [(60, 1, .15), (120, .4, .08)], exc=.01, bright=900) + _lp(k.noise(d), 500) * _env(d, .05) * .3
def impact_hard(k): d = .9; return _modal(k, d, [(50, 1, .25), (110, .5, .12)], exc=.02, bright=1200) + _bp(k.noise(d), 200, 5000) * _env(d, .08) * .6
def thud_low(k): return _modal(k, .4, [(70, 1, .08)], exc=.01, bright=600)
def silence_cut(k): return _lp(k.noise(.05), 2000) * _env(.05, .005) * .3


# the fixed ones above take only the take; a few take a length
FOLEY = {n: f for n, f in globals().items() if callable(f) and not n.startswith('_') and n not in ('play', 'play_bed')}
for _n in ('np', 'butter', 'sosfilt'): FOLEY.pop(_n, None)
CATALOG = {n: ((f.__doc__ or '').strip().split('\n')[0]) for n, f in FOLEY.items()}
GAIN = {}   # per-family loudness: graphics sit low, scene cuts mid, objects full
for n in 'label_in label_out bar_grow count_tick reveal_soft dot_place line_draw'.split(): GAIN[n] = .35
for n in 'whoosh_soft whoosh_hard swipe iris_open iris_close riser'.split(): GAIN[n] = .55


def play(name, v=.6, var=0, d=None):
    """the sound `name`, take `var`, peak-normalized to v times its family's gain"""
    if name not in FOLEY: raise KeyError(f"foley: no sound '{name}'. Known: {' '.join(sorted(FOLEY))}")
    f, k = FOLEY[name], _Take(var)
    try: x = f(k, d) if d is not None else f(k)
    except TypeError: x = f(k)
    x = np.asarray(x, dtype=np.float64)
    n = int(.004 * SR)
    if len(x) > 2 * n: x[-n:] *= np.linspace(1, 0, n)
    return (_norm(x, 1.0) * v * GAIN.get(name, 1.0)).astype(np.float32)


# —— ambience beds ——
def play_bed(kind, d, var=0):
    k = _Take(var); tt = _t(d); b = lambda: np.cumsum(k.noise(d)) / 300
    def murmur(n_voices, lo, hi):
        x = np.zeros(len(tt))
        for _ in range(n_voices):
            f = k.r.uniform(1.5, 4); x += _bp(k.noise(d), lo * k.j(.2), hi * k.j(.2)) * (.5 + .5 * np.sin(2 * np.pi * f * tt + k.r.random() * 6)) ** 2
        return x
    if kind == 'cafe': x = murmur(6, 300, 1800) * .5 + _lp(k.noise(d), 300) * .2; x = x + _seq([(s, cup_set(_Take(i)) * .15) for i, s in enumerate(np.arange(1.3, d, 3.7))], d)
    elif kind == 'crowd': x = murmur(10, 250, 2000) * .6
    elif kind == 'office': x = _lp(k.noise(d), 200) * .2 + _seq([(s, keyboard(_Take(i), 6) * .15) for i, s in enumerate(np.arange(.7, d, 4.1))], d) + _tone(60, d, .02, r=.5)
    elif kind == 'street': x = _lp(_hp(b(), 20), 500) * .6 + _sweep(k, d, 200, 800, .5) * .15
    elif kind == 'rain': x = _bp(k.noise(d), 800, 9000) * .3 + _lp(k.noise(d), 400) * .2
    elif kind == 'lab': x = _tone(120, d, .04, r=.5) + _tone(240, d, .02, r=.5) + _hp(k.noise(d), 5000) * .03
    elif kind == 'hum': x = _tone(50, d, .05, r=.5) + _tone(100, d, .03, r=.5) + _lp(k.noise(d), 200) * .1
    elif kind == 'night_city': x = _lp(_hp(b(), 20), 300) * .5 + _bp(k.noise(d), 3800, 5200) * (np.sin(2 * np.pi * 6 * tt) > .7) * .05
    elif kind == 'kitchen': x = _lp(k.noise(d), 300) * .15 + _seq([(s, spoon_stir(_Take(i)) * .12) for i, s in enumerate(np.arange(2, d, 5.3))], d) + _tone(55, d, .03, r=.5)
    elif kind == 'classroom': x = murmur(8, 300, 2500) * .35 + _seq([(s, chair_creak(_Take(i)) * .1) for i, s in enumerate(np.arange(1.7, d, 4.9))], d)
    else: raise KeyError(f"foley: no bed '{kind}'. Known: cafe crowd office street rain lab hum night_city kitchen classroom")
    n = min(len(x), int(.4 * SR)); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    return (_norm(x, .5)).astype(np.float32)


BEDS = 'cafe crowd office street rain lab hum night_city kitchen classroom'.split()

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 2 and sys.argv[1] == '--demo':   # write every sound, one after another, to a wav
        import soundfile as sf
        parts, t = [], 0.0
        for n in sorted(FOLEY):
            x = play(n, .7); parts.append((t, x)); t += len(x) / SR + .35
        sf.write(sys.argv[2], _seq(parts, t).astype(np.float32), SR); print('wrote', sys.argv[2], round(t, 1), 's')
    else:
        for n in sorted(FOLEY): print(f'{n:16s} {CATALOG[n]}')
