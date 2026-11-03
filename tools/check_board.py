#!/usr/bin/env python3
"""Check a film's storyboard (board.json) before and after it is built: python3 tools/check_board.py <film>

The board is the film's script for the picture: every scene a place with its light and its cast, cut into shots (wide,
medium, close, insert; how the host is there; how the camera moves; why), every beat an action anchored on a spoken word. The film is built from
it (rig/board.js). The check refuses a vague board — and a busy one: words and sounds are budgets, not quotas.

  structure  every scene has id, place, light, cast, lines, shots, beats; the scenes' lines are voice/lines.json, in order
  anchors    every beat and every cut sits on a word its line actually says ("line@word+0.1", "line@start", "line@end")
  shots      every shot has a size, a subject, a host mode (desk, scene, pip, react, none), a camera (hold, push, pull,
             track, pan) and a why; no shot longer than 12 s, the mean ≤ 8 s; a new place opens on a wide shot; ≥ 20 % of
             shots are close or insert (the camera goes to the thing being talked about); the host is in the frame (desk or
             scene) 15–45 % of the time, and comments on the story at least once from a pip or a react; ≥ 3 camera moves
  words      every label says its kind: term (a new idea + a one-line "def"), name, place, time, number, doc, stamp; no
             label repeats words of the line being spoken (except a term or a name); no question marks; 1–4 term cards;
             ≤ 1 stamp a scene; on average ≤ 1 new word on screen every 6 s
  sound      every sfx is a known sound (core/audio/foley.py, or the channel's mix.py FX) and names its cause; body sounds
             (breath, hand taps…) only in a close shot; graphic sounds only for a term, a chart, a doc or a stamp;
             ≤ 25 sound moments a minute, ≥ 25 % of the 3 s windows with no sound effect, ≤ 3 sounds inside one second;
             at least one real silence (a scene's "silence") before the turn
  script     no line reads out who is speaking ("Rối nói: …") — a character speaks with their own voice
  cast       the channel can ask for more (board_rules.json next to CHANNEL.md: {"require_who": {"roi": 2},
             "require_flags": ["aha"]})
  code       src/film.js loads the board, draws its signals, plays its events, and names its scenes and its shots
Exit 0 when everything passes, 1 when something fails, 2 when there is no board to check.
"""
import json, os, re, sys, unicodedata

args = sys.argv[1:]
if not args or args[0].startswith('-'): print(__doc__); sys.exit(2)
FILM = args[0]
HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.path.dirname(HERE)
BP = os.path.join(FILM, 'board.json')
if not os.path.isfile(BP): print(f'check_board: no board.json in {FILM}'); sys.exit(2)

def load(p, d=None):
    try: return json.load(open(p, encoding='utf-8'))
    except FileNotFoundError: return d
    except json.JSONDecodeError as e: print(f'BAD {p} is not valid JSON: {e}'); sys.exit(1)

def norm(s):
    s = unicodedata.normalize('NFD', (s or '').lower()).replace('đ', 'd')
    return re.sub(r'[^\w]', '', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))

board = load(BP)
lines = load(os.path.join(FILM, 'voice/lines.json'), [])
words = load(os.path.join(FILM, 'voice/words.json'), {}) or {}
dur = load(os.path.join(FILM, 'voice/proc/dur.json'), None) or load(os.path.join(FILM, 'voice/dur.json'), {}) or {}
text_of = {l['id']: l.get('text', '') for l in lines}
order = [l['id'] for l in lines]
bad = []
def BAD(msg): bad.append(msg)

# the channel's rules and its sounds
chan = FILM
while chan != os.path.dirname(chan) and not os.path.isfile(os.path.join(chan, 'CHANNEL.md')): chan = os.path.dirname(chan)
rules = load(os.path.join(chan, 'board_rules.json'), {}) if os.path.isfile(os.path.join(chan, 'CHANNEL.md')) else {}
sys.path.insert(0, os.path.join(LIB, 'core/audio'))
try:
    import foley; KNOWN = set(foley.FOLEY); BEDS = set(foley.BEDS)
except Exception as e:   # numpy missing in this python: fall back to the names in the file
    src = open(os.path.join(LIB, 'core/audio/foley.py'), encoding='utf-8').read()
    KNOWN = set(re.findall(r'^def ([a-z][a-z_]*)\(k', src, re.M)); BEDS = set()
mixp = os.path.join(chan, 'mix.py')
if os.path.isfile(mixp):
    m = re.search(r'FX = \{(.*?)\n\}', open(mixp, encoding='utf-8').read(), re.S)
    if m: KNOWN |= set(re.findall(r"'([a-z_]+)':\s*lambda", m.group(1)))
GRAPHIC = {'label_in', 'label_out', 'bar_grow', 'count_tick', 'reveal_soft', 'dot_place', 'line_draw'}
BODY = {'sigh_breath', 'gasp_breath', 'hand_tap', 'finger_snap', 'clap', 'cloth_rustle'}
KINDS = {'term', 'name', 'place', 'time', 'number', 'doc', 'stamp'}
SIZES = {'wide', 'medium', 'close', 'insert'}
# how the host is on screen: desk (at home), scene (inside the story world), pip (a ring in a corner over the story),
# react (a cut to their face for a beat), none (the story plays full frame, the host is only heard)
HOSTS = {'desk', 'scene', 'pip', 'react', 'none'}
CAMS = {'hold', 'push', 'pull', 'track', 'pan'}

# —— structure ——
scenes = board.get('scenes') or []
if not scenes: BAD('the board has no scenes')
pal = board.get('palette') or {}
seen_lines, ids = [], set()
for s in scenes:
    sid = s.get('id', '?')
    for k in ('id', 'place', 'light', 'cast', 'lines', 'shots', 'beats'):
        if not s.get(k): BAD(f'scene {sid}: no "{k}"')
    if len(str(s.get('place', ''))) < 6: BAD(f'scene {sid}: "place" must say where we are ("quầy báo đêm, đèn treo vàng"), not "{s.get("place", "")}"')
    seen_lines += s.get('lines') or []
if order and seen_lines != order:
    miss = [i for i in order if i not in seen_lines]; extra = [i for i in seen_lines if i not in order]
    BAD(f'the scenes\' lines are not voice/lines.json in order' + (f'; missing {miss}' if miss else '') + (f'; not in lines.json {extra}' if extra else ''))

# —— time of a word ——
def line_times():
    t, L = 0.0, {}
    for i in order:
        n = max(1, len(text_of[i].split()))
        d = dur.get(i) or (words.get(i) or [{}])[-1].get('t1') or n * .43
        L[i] = (t, t + d); t += d + .3
    return L
LT = line_times()
ANCH = re.compile(r'^([\w-]+)@(start|end|[^+#-]+?)(?:#(\d+))?\s*([+-]\s*[\d.]+)?$', re.U)
def resolve(a, where):
    m = ANCH.match(str(a or '').strip())
    if not m: BAD(f'{where}: bad anchor "{a}" (write line@word, line@word+0.2, line@word#2, line@start, line@end)'); return None
    lid, w, nth, off = m.groups(); o = float(off.replace(' ', '')) if off else 0.0
    if lid not in LT: BAD(f'{where}: anchor "{a}" names a line "{lid}" that is not in voice/lines.json'); return None
    t0, t1 = LT[lid]
    if w == 'start': return lid, t0 + o
    if w == 'end': return lid, t1 + o
    want = norm(w.split()[0]); toks = [norm(x) for x in text_of[lid].split()]
    if want not in toks and not any(x.startswith(want) or want.startswith(x) for x in toks if x):
        BAD(f'{where}: "{w}" is not a word of line {lid}: "{text_of[lid]}"'); return lid, t0 + o
    ws = words.get(lid)
    if ws:
        k = 0
        for x in ws:
            if norm(x['w']) == want:
                k += 1
                if k >= int(nth or 1): return lid, t0 + max(0, x['t0']) + o
        for x in ws:
            n = norm(x['w'])
            if n and (n.startswith(want) or want.startswith(n)): return lid, t0 + max(0, x['t0']) + o
        return lid, t0 + o
    i = next(j for j, x in enumerate(toks) if x == want or x.startswith(want) or want.startswith(x))
    return lid, t0 + (t1 - t0) * i / max(1, len(toks)) + o

# —— script ——
for l in lines:
    if re.match(r'^\s*(rối|roi|kẻ nghĩ nhiều|người dẫn)\s*(nói|hỏi|bảo|:)', l.get('text', ''), re.I | re.U):
        BAD(f'line {l["id"]}: "{l["text"][:40]}…" reads out who speaks — give the character the line in their own voice')

# —— shots ——
def scene_start(s):
    sl = s.get('lines') or []
    return LT[sl[0]][0] - .35 if sl and sl[0] in LT else None
total = max((t1 for _, t1 in LT.values()), default=0) + .5
shots_all = []   # (t0, t1, shot, scene id)
for k, s in enumerate(scenes):
    sid, sh = s.get('id', '?'), s.get('shots') or []
    st = 0.0 if k == 0 else scene_start(s)
    nxt = scene_start(scenes[k + 1]) if k + 1 < len(scenes) else total
    ts = []
    for j, x in enumerate(sh):
        where = f'scene {sid} shot {x.get("id", j)}'
        if not x.get('id'): BAD(f'{where}: a shot with no id')
        if x.get('id') in ids: BAD(f'{where}: the id is used twice')
        ids.add(x.get('id'))
        if x.get('size') not in SIZES: BAD(f'{where}: "size" must be one of {sorted(SIZES)}')
        if len(str(x.get('subject', '')).split()) < 3: BAD(f'{where}: "subject" must say what the frame shows (≥ 3 words)')
        if x.get('host') not in HOSTS: BAD(f'{where}: "host" must be one of {sorted(HOSTS)} — how is the host in this frame?')
        if x.get('cam', 'hold') not in CAMS: BAD(f'{where}: "cam" must be one of {sorted(CAMS)}')
        if len(str(x.get('why', '')).split()) < 3: BAD(f'{where}: "why" must say why the frame is shot this way (≥ 3 words)')
        if j == 0: ts.append(st); continue
        r = resolve(x.get('at'), where)
        ts.append(r[1] if r else st)
    for j, x in enumerate(sh):
        if st is None or nxt is None: break
        t0, t1 = ts[j], ts[j + 1] if j + 1 < len(sh) else nxt
        shots_all.append((t0, t1, x, sid))
        if t1 - t0 > 12: BAD(f'scene {sid} shot {x.get("id")}: {t1 - t0:.1f} s on one frame — cut to the next idea (≤ 12 s)')
    if sh and sh[0].get('size') != 'wide' and k > 0 and not s.get('same_place'):
        BAD(f'scene {sid}: a new place opens on a wide shot (an establishing frame), not "{sh[0].get("size")}"')
    if len(sh) >= 3 and len({x.get('size') for x in sh}) < 2: BAD(f'scene {sid}: every shot is "{sh[0].get("size")}" — vary the frame')
if shots_all:
    durs = [b - a for a, b, _, _ in shots_all]; mean = sum(durs) / len(durs)
    if mean > 8: BAD(f'mean shot {mean:.1f} s (≤ 8 s: a new idea, a new shot)')
    near = sum(1 for _, _, x, _ in shots_all if x.get('size') in ('close', 'insert'))
    if near / len(shots_all) < .2: BAD(f'only {near} of {len(shots_all)} shots are close or insert (≥ 20 %): go to the thing being talked about instead of labelling it')
    host = sum(b - a for a, b, x, _ in shots_all if x.get('host') in ('desk', 'scene')) / max(1e-6, sum(durs))
    if not .15 <= host <= .45: BAD(f'the host is in the frame (desk or scene) {host:.0%} of the time (15–45 %): the story world plays full frame, the host frames it')
    if not any(x.get('host') in ('pip', 'react') for _, _, x, _ in shots_all):
        BAD('the host never comments on the story: give at least one shot "host": "pip" (a ring in a corner) or "react" (a cut to their face)')
    cams = {x.get('cam', 'hold') for _, _, x, _ in shots_all}
    if len(cams) < 3: BAD(f'the camera only does {sorted(cams)}: use ≥ 3 of {sorted(CAMS)}, each for a reason (a push for an idea, a track with someone walking)')
def shot_at(t):
    for a, b, x, _ in shots_all:
        if a - 1e-6 <= t < b: return x
    return {}

# —— beats ——
who_count, flags, beat_ids_acting, all_sfx, words_on, terms = {}, set(), [], [], [], 0
for s in scenes:
    sid, cast = s.get('id', '?'), set(s.get('cast') or [])
    sl = s.get('lines') or []
    stamps = 0
    for b in s.get('beats') or []:
        bid = b.get('id'); where = f'scene {sid} beat {bid}'
        if not bid: BAD(f'scene {sid}: a beat with no id'); continue
        if bid in ids: BAD(f'{where}: the id is used twice')
        ids.add(bid)
        r = resolve(b.get('at'), where)
        if not r: continue
        lid, t = r
        if lid not in sl: BAD(f'{where}: anchored on {lid}, which is not one of this scene\'s lines {sl}')
        who = b.get('who') or 'none'; who_count[who] = who_count.get(who, 0) + 1
        for f in b.get('flags') or []: flags.add(f)
        if who != 'none' and not who.startswith('prop:') and who not in cast: BAD(f'{where}: "{who}" is not in the scene\'s cast {sorted(cast)}')
        do = str(b.get('do') or '')
        if len(do.split()) < 3: BAD(f'{where}: "do" must say who does what to what (≥ 3 words), got "{do}"')
        if who != 'none': beat_ids_acting.append(bid)
        loud_graphic = bool(b.get('chart'))
        spoken = [norm(x) for x in text_of.get(lid, '').split()]
        for L0 in ([b['label']] if isinstance(b.get('label'), dict) else b.get('label') or []):
            tx, kind = str(L0.get('text', '')), L0.get('kind')
            if not tx: BAD(f'{where}: a label with no text')
            if kind not in KINDS: BAD(f'{where}: label "{tx}" must say its "kind": one of {sorted(KINDS)}')
            words_on.append(tx)
            if kind == 'term':
                terms += 1; loud_graphic = True
                if not L0.get('def') or len(str(L0['def']).split()) > 10: BAD(f'{where}: term "{tx}" needs a "def": what it means, in ≤ 10 words')
            if kind == 'stamp': stamps += 1
            if kind in ('doc', 'stamp'): loud_graphic = True
            if len(tx.split()) > 5 or len(tx) > 32: BAD(f'{where}: label "{tx}" is a sentence — a label names a thing in ≤ 5 words')
            if '?' in tx: BAD(f'{where}: label "{tx}" is a question — the voice asks, the screen names')
            lw = [norm(x) for x in tx.split() if norm(x)]
            if kind not in ('term', 'name') and len(lw) >= 2 and any(spoken[k:k + 2] == lw[m:m + 2] for k in range(len(spoken)) for m in range(len(lw) - 1)):
                BAD(f'{where}: label "{tx}" repeats the words being spoken — name a thing, a place, a time or a number instead')
            if kind == 'name' and not (L0.get('to') or L0.get('on')): BAD(f'{where}: name "{tx}" must point at its thing ("to": [x, y]) or sit on it ("on": true)')
            xy = L0.get('xy')
            if kind != 'term':
                if not (isinstance(xy, list) and len(xy) == 2): BAD(f'{where}: label "{tx}" has no "xy": [x, y]')
                elif not (40 <= xy[0] <= 1880 and 40 <= xy[1] <= 860): BAD(f'{where}: label "{tx}" at {xy} is outside the frame or in the subtitle band (y > 860)')
            if L0.get('hold') is not None and L0['hold'] < 3 and not L0.get('stay'): BAD(f'{where}: label "{tx}" holds {L0["hold"]} s — leave words up (≥ 3 s, or to the end of the shot)')
            if L0.get('color') and L0['color'] not in pal and not str(L0['color']).startswith('#'): BAD(f'{where}: label colour "{L0["color"]}" is not in the palette')
        C = b.get('chart')
        if C:
            box = C.get('box')
            if C.get('kind') not in ('bars', 'compare', 'people', 'dots'): BAD(f'{where}: chart kind must be bars, compare, people or dots')
            if not (isinstance(box, list) and len(box) == 4 and box[0] >= 0 and box[1] >= 40 and box[0] + box[2] <= 1920 and box[1] + box[3] <= 860):
                BAD(f'{where}: chart "box": [x, y, w, h] must sit inside the frame, above the subtitle band')
            if C.get('kind') in ('bars', 'compare') and not all('label' in i and 'value' in i for i in C.get('items') or [None]):
                BAD(f'{where}: a bar chart needs items [{{label, value, color}}] — every bar is named')
        for x in [b['sfx']] if isinstance(b.get('sfx'), dict) else b.get('sfx') or []:
            ty = x.get('type'); tt = t + float(x.get('off', 0))
            if ty not in KNOWN: BAD(f'{where}: sfx "{ty}" is not a known sound (.venv/bin/python core/audio/foley.py lists them)')
            if len(str(x.get('cause', '')).split()) < 2: BAD(f'{where}: sfx "{ty}" has no "cause" — name the thing that makes it ("hộp gỗ đặt xuống bàn")')
            if ty in GRAPHIC and not loud_graphic: BAD(f'{where}: "{ty}" — a graphic sound only for a term card, a chart, a doc or a stamp; a name or a place comes in silently')
            if ty in BODY and shot_at(tt).get('size') not in ('close', 'insert'): BAD(f'{where}: "{ty}" is a body sound — only heard in a close shot')
            if ty not in GRAPHIC and not (b.get('change') or who != 'none'): BAD(f'{where}: sfx "{ty}" on a beat where nothing moves (no "who", no "change")')
            all_sfx.append((tt, ty, bid))
    if stamps > 1: BAD(f'scene {sid}: {stamps} stamps — a verdict is pressed once')
    tr = (s.get('in') or {}).get('tr')
    if tr in ('whip', 'iris', 'light', 'prop') and not (s.get('in') or {}).get('sfx'): BAD(f'scene {sid}: a "{tr}" entrance with no sound')
    if s.get('in') and s['in'].get('sfx'): all_sfx.append((scene_start(s) or 0, s['in']['sfx'], sid))
    if s.get('amb') and BEDS and s['amb'] not in BEDS and s['amb'] not in ('room', 'night', 'scroll', 'dawn', 'low'): BAD(f'scene {sid}: ambience "{s["amb"]}" is not a bed (foley.BEDS or the channel\'s)')

if not 1 <= terms <= 4: BAD(f'{terms} term cards — an episode names its idea: 1–4 terms, each with its "def"')
if total and len(set(words_on)) > total / 6: BAD(f'{len(set(words_on))} different words on screen in {total:.0f} s — at most one every 6 s; let the picture and the voice carry the rest')
all_sfx.sort()
for i in range(len(all_sfx)):
    j = i
    while j + 1 < len(all_sfx) and all_sfx[j + 1][0] - all_sfx[i][0] < 1.0: j += 1
    if j - i >= 3: BAD(f'{j - i + 1} sounds inside one second at {all_sfx[i][0]:.1f} s ({", ".join(x[1] for x in all_sfx[i:j + 1])}) — too busy, keep the one with the clearest cause'); break
fts = [x[0] for x in all_sfx]
moments = sum(1 for k, x in enumerate(fts) if k == 0 or x - fts[k - 1] > .6)
if total and moments / total * 60 > 25: BAD(f'{moments / total * 60:.0f} sound moments a minute (≤ 25): keep the sounds of the turns, the reveals and the story\'s own object; drop the rest')
wins = [any(a <= x < a + 3 for x in fts) for a in range(0, int(total) - 2, 3)]
if wins and wins.count(False) / len(wins) < .25: BAD(f'only {wins.count(False) / len(wins):.0%} of the 3 s windows are free of sound effects (≥ 25 %): let the voice and the room carry')
if not any(s.get('silence') for s in scenes): BAD('no scene has a "silence" — the turn needs a real pause before it')

for who, n in (rules.get('require_who') or {}).items():
    if who_count.get(who, 0) < n: BAD(f'the channel asks for ≥ {n} beats where "{who}" acts; the board has {who_count.get(who, 0)}')
for f in rules.get('require_flags') or []:
    if f not in flags: BAD(f'the channel asks for a beat flagged "{f}" (see its SKILL); the board has none')

# —— the code uses the board ——
fp = os.path.join(FILM, 'src/film.js')
if os.path.isfile(fp):
    code = open(fp, encoding='utf-8').read()
    for need, why in [(r'(loadBoard|bindBoard)\s*\(', 'load the board (loadBoard from rig/board.js)'), (r'\.signals\s*\(', 'draw its signals (BD.signals(g, T))'), (r'\.events\s*\(', 'play its sound (BD.events() into window.EV)')]:
        if not re.search(need, code): BAD(f'src/film.js does not {why}')
    miss = [s['id'] for s in scenes if s.get('id') and f"'{s['id']}'" not in code and f'"{s["id"]}"' not in code and f'{s["id"]}:' not in code]
    if miss: BAD(f'src/film.js never names the scenes {miss} — the board is not driving the picture')
    shot_ids = [x['id'] for s in scenes for x in s.get('shots') or [] if x.get('id') and x['id'] != s.get('id')]
    unnamed = [i for i in shot_ids if not re.search(r'[\'"`]' + re.escape(i) + r'[\'"`]|\b' + re.escape(i) + r'\s*:', code)]
    if shot_ids and len(unnamed) > .15 * len(shot_ids): BAD(f'src/film.js never draws the shots {unnamed[:8]} — each shot is its own frame (BD.shot(T))')
    used = [b for b in beat_ids_acting if re.search(r'[\'"`]' + re.escape(b) + r'[\'"`]', code)]
    if beat_ids_acting and len(used) / len(beat_ids_acting) < .7:
        BAD(f'src/film.js animates {len(used)} of {len(beat_ids_acting)} acting beats by their id (≥ 70 %) — missing e.g. {[b for b in beat_ids_acting if b not in used][:8]}')
else:
    print('note: no src/film.js yet — the code checks run once it exists')

nb = len(ids)
print(f'board: {len(scenes)} scenes, {len(shots_all)} shots, {len(beat_ids_acting)} acting beats, {len(set(words_on))} words on screen, {len(all_sfx)} sounds'
      + ('' if words else ' (times estimated: no voice/words.json yet)'))
for m in bad: print('BAD', m)
print('PASS' if not bad else f'FAIL ({len(bad)})')
sys.exit(1 if bad else 0)
