#!/usr/bin/env python3
"""Check a film's storyboard (board.json) before and after it is built: python3 tools/check_board.py <film>

The board is the film's script for the picture: every scene a place with its light and its cast, cut into shots (wide,
medium, close, insert; how the host is there; how the camera moves; why), every beat an action anchored on a spoken word. The film is built from
it (rig/board.js). The check refuses a vague board — and a busy one: words and sounds are budgets, not quotas.

  structure  every scene has id, place, light, cast, lines, shots, beats; the scenes' lines are voice/lines.json, in order
  anchors    every beat and every cut sits on a word its line actually says ("line@word+0.1", "line@start", "line@end")
  shots      every shot has a size, a subject, a host mode (desk, scene, pip, react, none), a camera (hold, push, pull,
             track, pan) and a why; no shot longer than 12 s, the mean ≤ 8 s; a new place opens on a wide shot; ≥ 20 % of
             shots are close or insert (the camera goes to the thing being talked about); the host fills the frame (desk
             or scene) ≤ 50 % of the time; the camera holds in ≥ 65 % of the film (pan, track, push, pull ≤ 35 %)
  words      every label says its kind: term (a new idea + a one-line "def"), name, place, time, number, doc, stamp; no
             label repeats words of the line being spoken (except a term or a name); no question marks; 1–4 term cards;
             ≤ 1 stamp a scene; on average ≤ 1 new word on screen every 6 s
  sound      every sfx is a known sound (core/audio/foley.py, or the channel's mix.py FX) and names its cause; body sounds
             (breath, hand taps…) only in a close shot; graphic sounds only for a term, a chart, a doc or a stamp;
             ≤ 25 sound moments a minute, ≥ 25 % of the 3 s windows with no sound effect, ≤ 3 sounds inside one second;
             at least one real silence (a scene's "silence") before the turn
  script     no line reads out who is speaking ("Rối nói: …") — a character speaks with their own voice
  cast       the channel can ask for more (board_rules.json next to CHANNEL.md: {"require_who": {"host": 2},
             "require_flags": ["aha"], "forbid_cast": ["roi"], "one_voice": true, "require_move": true})
  picture    with "require_frame": "props" (each recurring thing: look ≥ 12 words, its states, where it is drawn from),
             every scene a "set" (layers back to front, the thing that lives), every shot but a react a "frame" (layout
             with a place and a share of the frame, layers, focus, light, start ≠ end; no two shots of a scene alike)
  moves      with "require_move": every acting beat is a move — "move" (one of MOVES), "d" (0.2–8 s) and "xy" (where it
             happens); each scene uses ≥ 2 kinds; ≤ 40 % of the beats only act in place (gesture, act); film.js times
             ≥ 70 % of the beats by id (BD.u / BD.p / BD.t), draws no prop behind a bare "if (x > 0)" that ignores x,
             and never zooms a wide frame past 1.6× (a close shot draws its subject at its own size)
  code       src/film.js loads the board, draws its signals, plays its events, and names its scenes and its shots
Exit 0 when everything passes, 1 when something fails, 2 when there is no board to check.

    python3 tools/check_board.py --selftest   # prove the check can fail
"""
import contextlib, io, json, os, re, sys, tempfile, unicodedata

# the moves of a beat: what changes on screen, over time (rig/keys.js has a helper for each)
MOVES = {'enter', 'exit', 'walk', 'carry', 'travel', 'grow', 'count', 'draw', 'break', 'transform', 'swap', 'open', 'fall', 'fill', 'work', 'gesture', 'act'}
IN_PLACE = {'gesture', 'act'}

HERE = os.path.dirname(os.path.abspath(__file__)); LIB = os.path.dirname(HERE)

def load(p, d=None):
    try: return json.load(open(p, encoding='utf-8'))
    except FileNotFoundError: return d
    except json.JSONDecodeError as e: print(f'BAD {p} is not valid JSON: {e}'); raise

def norm(s):
    s = unicodedata.normalize('NFD', (s or '').lower()).replace('đ', 'd')
    return re.sub(r'[^\w]', '', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))

def check(film):
    """Check one film's board. Returns (code, bad, notes, summary)."""
    BP = os.path.join(film, 'board.json')
    if not os.path.isfile(BP): print(f'check_board: no board.json in {film}'); return 2, [], [], ''
    try:
        board = load(BP)
        lines = load(os.path.join(film, 'voice/lines.json'), [])
        words = load(os.path.join(film, 'voice/words.json'), {}) or {}
        dur = load(os.path.join(film, 'voice/proc/dur.json'), None) or load(os.path.join(film, 'voice/dur.json'), {}) or {}
    except json.JSONDecodeError:
        return 1, [], [], ''
    text_of = {l['id']: l.get('text', '') for l in lines}
    order = [l['id'] for l in lines]
    bad = []
    notes = []
    def BAD(msg): bad.append(msg)

    # the channel's rules and its sounds
    chan = film
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
        if host > .5: BAD(f'the host fills the frame (desk or scene) {host:.0%} of the time (≤ 50 %): the picture explains, the host comes in when they add something')
        moving = sum(b - a for a, b, x, _ in shots_all if x.get('cam', 'hold') != 'hold') / max(1e-6, sum(durs))
        if moving > .35: BAD(f'the camera moves in {moving:.0%} of the film (≤ 35 %): hold is the default and people and props make the motion; move only to follow something that moves, or to reveal something new')
    def shot_at(t):
        for a, b, x, _ in shots_all:
            if a - 1e-6 <= t < b: return x
        return {}

    # —— beats ——
    who_count, flags, beat_ids_acting, all_sfx, words_on, terms, moves = {}, set(), [], [], [], 0, []
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
            if rules.get('require_move') and who != 'none':
                mv, d, xy = b.get('move'), b.get('d'), b.get('xy')
                if mv not in MOVES: BAD(f'{where}: "move" must be one of {sorted(MOVES)} — what changes on screen, over time (got {mv!r})')
                else: moves.append((sid, mv))
                if not isinstance(d, (int, float)) or not .2 <= d <= 8: BAD(f'{where}: "d" is how long the move takes, 0.2–8 s (got {d!r})')
                if not (isinstance(xy, list) and len(xy) == 2 and 0 <= xy[0] <= 1920 and 0 <= xy[1] <= 1080): BAD(f'{where}: "xy" is where on screen the move happens, [x, y] in 1920×1080 (got {xy!r})')
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
        if s.get('amb') and BEDS and s.get('amb') not in BEDS and s.get('amb') not in ('room', 'night', 'scroll', 'dawn', 'low'): BAD(f'scene {sid}: ambience "{s["amb"]}" is not a bed (foley.BEDS or the channel\'s)')

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

    if rules.get('require_move') and moves:
        for sid in dict.fromkeys(x for x, _ in moves):
            kinds = {m for x, m in moves if x == sid}
            if len(kinds) < 2: BAD(f'scene {sid}: every beat is "{next(iter(kinds))}" — a scene needs ≥ 2 kinds of move (something enters, travels, grows, breaks…)')
        inplace = sum(1 for _, m in moves if m in IN_PLACE) / len(moves)
        if inplace > .4: BAD(f'{inplace:.0%} of the beats only act in place (gesture, act; ≤ 40 %): things must travel, grow, break and change on screen')
    # —— the picture, described before it is drawn (rules "require_frame") ——
    # A board that only names things ("a phone, a charger") leaves the agent to invent the picture while it types
    # coordinates. With "require_frame" every prop has a look and its states, every scene its layers, every shot a frame:
    # where things sit, what overlaps what, where the eye goes, the light, and how the frame differs at its end.
    WHERE = re.compile(r'(trái|phải|giữa|trên|dưới|góc|chính giữa|left|right|cent|top|bottom|corner)', re.I | re.U)
    SHARE = re.compile(r'(\d+\s*%|\d\s*/\s*\d|nửa|một phần|cả khung|toàn khung|half|third|full frame)', re.I | re.U)
    def words_n(x): return len(str(x or '').split())
    if rules.get('require_frame'):
        RIG_PROPS = None   # the names rig/props.js draws, read by node; None when node or the file is missing
        pj = os.path.abspath(os.path.join(chan, "rig/props.js"))
        if os.path.isfile(pj):
            import subprocess
            try:
                out = subprocess.run(['node', '--input-type=module', '-e', f'const m = await import({json.dumps("file://" + pj)}); console.log(Object.keys(m.PROPS).join(" "))'],
                                     capture_output=True, text=True, timeout=20)
                if out.returncode == 0: RIG_PROPS = set(out.stdout.split())
            except Exception: pass
        props = board.get('props') or {}
        if not props: BAD('the board has no "props": describe once how every recurring thing looks and the states it goes through')
        for pid, P in props.items():
            w = f'prop {pid}'
            if words_n(P.get('look')) < 12: BAD(f'{w}: "look" must describe the thing so anyone draws the same one (≥ 12 words: shape, proportions, the details that make it recognisable, colours)')
            st = P.get('states') or {}
            if not st: BAD(f'{w}: no "states" — name each state the story puts it in, and how it looks ("nguoi": "màn hình tắt", "nong": "quầng đỏ cam quanh thân")')
            for k, v in st.items():
                if words_n(v) < 3: BAD(f'{w}: state "{k}" must say how it looks (≥ 3 words)')
            if not P.get('draw'): BAD(f'{w}: no "draw" — where it is drawn from: "rig:<name>" (rig/props.js), "asset:<set>/<name>" (rig/assets), or "src:<function>" (the episode\'s src/sets.js)')
            else:
                d = str(P['draw'])
                if d.startswith('rig:') and RIG_PROPS is not None and d[4:] not in RIG_PROPS:
                    BAD(f'{w}: "draw": "{d}" — rig/props.js has no "{d[4:]}" (see rig/catalog/CATALOG.md); draw it there, in the same mould, or use "src:<function>"')
                elif d.startswith('asset:') and not os.path.isfile(os.path.join(chan, 'rig/assets', d[6:] + '.svg')):
                    BAD(f'{w}: "draw": "{d}" — no rig/assets/{d[6:]}.svg; fetch it with rig/assets/fetch.py add "<Name>" or draw it')
                elif not re.match(r'(rig|asset|src):\S', d):
                    BAD(f'{w}: "draw" must be "rig:<name>", "asset:<set>/<name>" or "src:<function>", got "{d}"')
        used = {b.get('who')[5:] for s0 in scenes for b in s0.get('beats') or [] if str(b.get('who') or '').startswith('prop:')}
        miss = sorted(x for x in used if x not in props)
        if miss: BAD(f'beats act with props {miss} that "props" does not describe')
        for s0 in scenes:
            sid = s0.get('id', '?'); S0 = s0.get('set') or {}
            if words_n(S0.get('layers')) < 12: BAD(f'scene {sid}: "set.layers" must lay the place out back to front (≥ 12 words: wall, furniture, the props, what stands in front)')
            if words_n(S0.get('alive')) < 3: BAD(f'scene {sid}: "set.alive" — the one thing of this place that moves on its own (a clock hand, a fan, rain on the window)')
            layouts = {}
            for x in s0.get('shots') or []:
                w = f'scene {sid} shot {x.get("id")}'
                if x.get('host') == 'react': continue   # the rig draws the host's face
                F = x.get('frame') or {}
                if not F: BAD(f'{w}: no "frame" — describe the picture before it is drawn (layout, layers, focus, light, start, end)'); continue
                lay = str(F.get('layout') or '')
                if words_n(lay) < 8 or not WHERE.search(lay) or not SHARE.search(lay):
                    BAD(f'{w}: "frame.layout" must place the subject: where in the frame and how much of it ("gối chiếm 60 % khung, lệch trái"), got "{lay[:60]}"')
                for k, n in (('layers', 8), ('focus', 5), ('light', 4), ('start', 4), ('end', 4)):
                    if words_n(F.get(k)) < n: BAD(f'{w}: "frame.{k}" must be concrete (≥ {n} words)')
                if F.get('start') and norm(F.get('start')) == norm(F.get('end')): BAD(f'{w}: "frame.start" and "frame.end" are the same — what changes in this shot?')
                if lay and norm(lay) in layouts: BAD(f'{w}: same layout as shot {layouts[norm(lay)]} — a new shot is a new picture, not the same drawing seen from a little further along')
                layouts[norm(lay)] = x.get('id')
    for who, n in (rules.get('require_who') or {}).items():
        if who_count.get(who, 0) < n: BAD(f'the channel asks for ≥ {n} beats where "{who}" acts; the board has {who_count.get(who, 0)}')
    for f in rules.get('require_flags') or []:
        if f not in flags: BAD(f'the channel asks for a beat flagged "{f}" (see its SKILL); the board has none')
    for who in rules.get('forbid_cast') or []:
        hit = [s.get('id') for s in scenes if who in (s.get('cast') or [])] + [k for k in who_count if k == who]
        if hit: BAD(f'the channel no longer casts "{who}" (see its CHANNEL.md); the board still does in {sorted(set(map(str, hit)))}')
    if rules.get('one_voice'):
        keys = ('voice', 'pitch', 'rate')
        odd = [l['id'] for l in lines if any(l.get(k) not in (None, '', '+0Hz', '+0%') for k in keys)]
        if odd: BAD(f'the channel speaks with one voice: lines {odd[:8]} change the voice, pitch or rate — the narrator says them in their own voice')

    # —— the code uses the board ——
    fp = os.path.join(film, 'src/film.js')
    if os.path.isfile(fp):
        code = open(fp, encoding='utf-8').read()
        for need, why in [(r'(loadBoard|bindBoard)\s*\(', 'load the board (loadBoard from rig/board.js)'), (r'\.signals\s*\(', 'draw its signals (BD.signals(g, T))'), (r'\.events\s*\(', 'play its sound (BD.events() into window.EV)')]:
            if not re.search(need, code): BAD(f'src/film.js does not {why}')
        miss = [s['id'] for s in scenes if s.get('id') and f"'{s['id']}'" not in code and f'"{s["id"]}"' not in code and f'{s["id"]}:' not in code]
        if miss: BAD(f'src/film.js never names the scenes {miss} — the board is not driving the picture')
        shot_ids = [x['id'] for s in scenes for x in s.get('shots') or [] if x.get('id') and x['id'] != s.get('id')]
        unnamed = [i for i in shot_ids if not re.search(r'[\'"`]' + re.escape(i) + r'[\'"`]|\b' + re.escape(i) + r'\s*:', code)]
        if shot_ids and len(unnamed) > .15 * len(shot_ids): BAD(f'src/film.js never draws the shots {unnamed[:8]} — each shot is its own frame (BD.shot(T))')
        if rules.get('require_move'):
            # each beat timed by its own id: BD.u('b1', T), BD.p('b1', T), BD.t('b1') — not a table of states switched on
            used = [b for b in beat_ids_acting if re.search(r'\.(u|p|t|on)\(\s*[\'"`]' + re.escape(b) + r'[\'"`]', code)]
            if beat_ids_acting and len(used) / len(beat_ids_acting) < .7:
                BAD(f'src/film.js times {len(used)} of {len(beat_ids_acting)} acting beats by their id with BD.u / BD.p / BD.t (≥ 70 %) — missing e.g. {[b for b in beat_ids_acting if b not in used][:8]}')
            src = code + ''.join(open(os.path.join(film, 'src', f), encoding='utf-8').read() for f in os.listdir(os.path.join(film, 'src')) if f.endswith('.js') and f != 'film.js')
            pops = [m.group(0) for m in re.finditer(r'if\s*\(\s*([\w.]+)\s*>\s*0(?:\.5|\.\d+)?\s*\)\s*([\w.]+)\(([^;]*?)\)\s*;', src) if m.group(1) not in m.group(3)]
            if pops: BAD(f'{len(pops)} prop(s) pop in: drawn behind "if (x > 0)" without using x, e.g. {pops[0][:90]!r} — pass the progress in and move the thing in (keys.js enter / travel / grow)')
            zooms = [m.group(0) for m in re.finditer(r'\[\s*(1\.[7-9]\d*|[2-9](?:\.\d+)?)\s*,\s*\d{3,4}\s*,\s*\d{3,4}\s*\]', src)]
            if zooms: BAD(f'{len(zooms)} camera zoom(s) past 1.6× on a wide frame, e.g. {zooms[0]} — a close shot draws its subject whole at its own size (a face with figure s≈3, a hand with its prop), not a crop of the wide')
        else:
            used = [b for b in beat_ids_acting if re.search(r'[\'"`]' + re.escape(b) + r'[\'"`]', code)]
            if beat_ids_acting and len(used) / len(beat_ids_acting) < .7:
                BAD(f'src/film.js animates {len(used)} of {len(beat_ids_acting)} acting beats by their id (≥ 70 %) — missing e.g. {[b for b in beat_ids_acting if b not in used][:8]}')
    else:
        notes.append('note: no src/film.js yet — the code checks run once it exists')

    summary = (f'board: {len(scenes)} scenes, {len(shots_all)} shots, {len(beat_ids_acting)} acting beats, '
               f'{len(set(words_on))} words on screen, {len(all_sfx)} sounds'
               + ('' if words else ' (times estimated: no voice/words.json yet)'))
    return (1 if bad else 0), bad, notes, summary

# —— the selftest: a board of the shape the library asks for, and the ways a real one falls short ——
GOOD_BOARD = """{
  "palette": {"amber": "#f2b134", "night": "#1b2436"},
  "scenes": [
    {
      "id": "s1",
      "place": "quầy báo đêm, đèn treo vàng",
      "light": "đèn vàng ấm rọi từ trên xuống",
      "cast": ["host"],
      "silence": "một nhịp im lặng ngay trước câu hỏi",
      "lines": ["c1", "c2", "c3"],
      "shots": [
        {"id": "s1-a", "size": "wide", "subject": "Lan ngồi ở quầy báo đêm", "host": "none", "cam": "hold", "why": "mở không gian và giới thiệu nhân vật"},
        {"id": "s1-b", "size": "close", "subject": "tay Lan nâng lớp vải ngoài", "host": "none", "cam": "hold", "why": "đi vào đúng thứ đang nói", "at": "c2@start"},
        {"id": "s1-c", "size": "insert", "subject": "mười hai lớp vải xếp chồng", "host": "none", "cam": "hold", "why": "cho thấy cấu tạo bên trong", "at": "c3@start"}
      ],
      "beats": [
        {"id": "b1", "at": "c1@start", "who": "host", "do": "Lan chào và giới thiệu chủ đề", "label": {"text": "Áo khoác mười hai lớp", "kind": "term", "def": "lớp áo dày chống gió lạnh"}},
        {"id": "b2", "at": "c2@start", "who": "host", "do": "Lan vuốt lớp vải ngoài của áo", "label": {"text": "3 kg", "kind": "number", "xy": [140, 320]}, "sfx": [{"type": "cloth_rustle", "off": 0.5, "cause": "lớp vải ngoài cọ vào tay Lan"}]},
        {"id": "b3", "at": "c3@start", "who": "host", "do": "Lan tách một lớp vải ra", "label": {"text": "12 lớp", "kind": "number", "xy": [160, 340]}}
      ]
    },
    {
      "id": "s2",
      "place": "hành lang chung cư, đèn buồng",
      "light": "đèn hành lang nhấp nháy vàng",
      "cast": ["host"],
      "lines": ["c4", "c5", "c6"],
      "shots": [
        {"id": "s2-a", "size": "wide", "subject": "hành lang chung cư vắng người", "host": "none", "cam": "hold", "why": "đổi không gian và mở câu hỏi"},
        {"id": "s2-b", "size": "close", "subject": "Lan kéo khóa áo lên vai", "host": "none", "cam": "hold", "why": "trả lời bằng hành động", "at": "c5@start"},
        {"id": "s2-c", "size": "insert", "subject": "lớp vải ngoài cùng phủ sương", "host": "none", "cam": "hold", "why": "kết bằng một hình ảnh cụ thể", "at": "c6@start"}
      ],
      "beats": [
        {"id": "b4", "at": "c4@start", "who": "host", "do": "Lan dựng câu hỏi về chiếc áo"},
        {"id": "b5", "at": "c5@start", "who": "host", "do": "Lan kéo khóa áo lên vai"},
        {"id": "b6", "at": "c6@start", "who": "host", "do": "Lan chỉ vào lớp vải ngoài cùng"}
      ]
    }
  ]
}
"""

GOOD_LINES = """[
  {"id": "c1", "text": "Chào bạn, hôm nay mình nói về chiếc áo khoác nặng."},
  {"id": "c2", "text": "Chiếc áo này nặng ba ký lô gam."},
  {"id": "c3", "text": "Nó nặng vì trong đó có mười hai lớp vải."},
  {"id": "c4", "text": "Vậy tại sao ta lại cần nó?"},
  {"id": "c5", "text": "Vì ở ngoài trời lạnh và gió thổi ngang."},
  {"id": "c6", "text": "Hãy nhìn kỹ lớp ngoài cùng của chiếc áo."}
]
"""

GOOD_DUR = """{"c1": 4.0, "c2": 4.0, "c3": 4.0, "c4": 4.0, "c5": 4.0, "c6": 4.0}
"""

def selftest():
    """Prove the check can fail: a board with a real defect must be turned away.

    Every case is a real board written into a temp folder; the good one is the shape the library asks
    for, the bad ones are the ways a board goes wrong while it is being written.
    """
    def put(film, name, text):
        path = os.path.join(film, name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)

    def film(name):
        d = os.path.join(tmp, name)
        os.makedirs(d, exist_ok=True)
        put(d, 'voice/lines.json', GOOD_LINES)
        put(d, 'voice/dur.json', GOOD_DUR)
        return d

    def board_of(text):
        return json.loads(text)

    with tempfile.TemporaryDirectory() as tmp:
        good = film('good')
        put(good, 'board.json', GOOD_BOARD)

        no_size = film('shot-without-size')
        b = board_of(GOOD_BOARD); del b['scenes'][0]['shots'][1]['size']
        put(no_size, 'board.json', json.dumps(b, ensure_ascii=False))

        no_why = film('shot-without-why')
        b = board_of(GOOD_BOARD); del b['scenes'][0]['shots'][1]['why']
        put(no_why, 'board.json', json.dumps(b, ensure_ascii=False))

        bad_anchor = film('beat-on-a-word-the-line-never-says')
        b = board_of(GOOD_BOARD); b['scenes'][0]['beats'][1]['at'] = 'c2@khongco'
        put(bad_anchor, 'board.json', json.dumps(b, ensure_ascii=False))

        long_shot = film('shot-held-too-long')
        b = board_of(GOOD_BOARD)
        put(long_shot, 'board.json', json.dumps(b, ensure_ascii=False))
        put(long_shot, 'voice/dur.json', '{"c1": 4.0, "c2": 20.0, "c3": 4.0, "c4": 4.0, "c5": 4.0, "c6": 4.0}')

        no_silence = film('scene-without-silence')
        b = board_of(GOOD_BOARD); del b['scenes'][0]['silence']
        put(no_silence, 'board.json', json.dumps(b, ensure_ascii=False))

        wrong_order = film('scenes-not-in-the-order-of-lines-json')
        b = board_of(GOOD_BOARD); b['scenes'][0]['lines'] = ['c2', 'c1', 'c3']
        put(wrong_order, 'board.json', json.dumps(b, ensure_ascii=False))

        echo = film('label-repeats-the-words-being-spoken')
        b = board_of(GOOD_BOARD)
        b['scenes'][0]['beats'][1]['label'] = {"text": "chiếc áo", "kind": "place", "xy": [140, 320]}
        put(echo, 'board.json', json.dumps(b, ensure_ascii=False))

        says_who = film('a-line-that-reads-out-who-speaks')
        put(says_who, 'board.json', GOOD_BOARD)
        put(says_who, 'voice/lines.json', GOOD_LINES.replace(
            '{"id": "c1", "text": "Chào bạn, hôm nay mình nói về chiếc áo khoác nặng."}',
            '{"id": "c1", "text": "Rối nói: chào bạn, hôm nay mình nói về chiếc áo khoác nặng."}'))

        no_code = film('film-js-that-never-loads-the-board')
        put(no_code, 'board.json', GOOD_BOARD)
        put(no_code, 'src/film.js', '// the board is never loaded\nexport function frame(g, T) { g.clear(); }\n')

        no_board = film('no-board')
        put(no_board, 'voice/lines.json', GOOD_LINES)

        cases = [
            ('a complete board passes', good, 0, None),
            ('a shot with no size is caught', no_size, 1, '"size" must be one of'),
            ('a shot with no why is caught', no_why, 1, '"why" must say why'),
            ('a beat on a word the line never says is caught', bad_anchor, 1, 'is not a word of line'),
            ('a shot held for more than 12 s is caught', long_shot, 1, 'on one frame'),
            ('a scene with no silence is caught', no_silence, 1, 'no scene has a "silence"'),
            ('scenes that do not follow lines.json are caught', wrong_order, 1, 'lines are not voice/lines.json in order'),
            ('a label that repeats the spoken words is caught', echo, 1, 'repeats the words being spoken'),
            ('a line that reads out who speaks is caught', says_who, 1, 'reads out who speaks'),
            ('a film.js that never loads the board is caught', no_code, 1, 'does not load the board'),
            ('a film with no board.json is turned away', no_board, 2, None),
        ]
        bad = 0
        for name, folder, want_code, want_msg in cases:
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                code, problems, _, _ = check(folder)
            ok = code == want_code and (want_msg is None or any(want_msg in m for m in problems))
            if not ok:
                bad += 1
            print(f'{"ok   " if ok else "FAIL"} {name}'
                  + ('' if ok else f' — code {code}, problems: {problems} {buf.getvalue().strip()}'))
    print('ok' if not bad else f'FAIL: {bad} case(s)')
    return 0 if not bad else 1

def main(argv):
    if len(argv) > 1 and argv[1] == '--selftest':
        return selftest()
    if len(argv) < 2 or argv[1].startswith('-'):
        print(__doc__); return 2
    code, bad, notes, summary = check(argv[1])
    for n in notes: print(n)
    if not summary: return code
    print(summary)
    for m in bad: print('BAD', m)
    print('PASS' if not bad else f'FAIL ({len(bad)})')
    return code

if __name__ == '__main__':
    sys.exit(main(sys.argv))
