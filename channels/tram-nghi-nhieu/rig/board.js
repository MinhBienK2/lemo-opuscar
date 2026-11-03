// board.js — the episode's storyboard as data. board.json says what happens on which word; the film is built from it.
//
//   import { loadBoard } from '../../../../rig/board.js';
//   const BD = await loadBoard('board.json', TL.L, words);   // TL.L: {lineId: {t0, t1}}, words: voice/words.json
//   BD.t('b12')            the absolute time of beat b12 (its anchor word, plus its offset)
//   BD.u('b12', T)         0 → 1 over the beat's "d" seconds from that time (eased out), for the beat's motion
//   BD.p('b12', T, 'back') the same with another ease (inOut default; back for a thing that lands with an overshoot)
//                          A beat is a move: "move" says which (enter, walk, carry…), "d" how long, "xy" where on screen;
//                          rig/keys.js has the moves, tools/check_motion.py checks that the frame changes there
//   BD.scene(T)            the scene on screen at T: {id, t0, t1, place, light, ...}
//   BD.shot(T)             the shot on screen at T: {id, t0, t1, size: wide|medium|close|insert, host, cam, subject, scene}
//                          host: desk | scene | pip | react | none (rig/host.js draws pip and react)
//   BD.camera(g, T)        moves the camera of that shot (cam: hold | push | pull | track | pan): call it inside g.save()
//                          before drawing the frame, g.restore() after, then BD.signals — labels stay where they were put
//   BD.signals(g, T)       draws the labels, pointers and charts of the shot on screen at T (registered in TEXTS)
//   BD.events()            the board's sound: every beat's sfx, every scene's entrance sound, its ambience bed and music
//                          cue, and a {type: 'shot'} mark at every cut (silent; scenecheck counts the shots)
//
// A label says what kind of word it is (label.kind): term (a new idea: the term and a one-line "def", a card), name (who or
// what a thing is), place, time, number (on a thing or a bar), doc (a document of the story), stamp (a verdict). A label
// stays for the rest of its shot unless it says "hold"; a cut clears the frame.
//
// An anchor is "line@word", "line@word+0.2", "line@word-0.1", "line@word#2" (the 2nd time the word is said), "line@start",
// "line@end". The word is matched in voice/words.json without tone marks or punctuation; a word of several syllables
// ("bản giấy") is matched on its first one. The schema and the rules are checked by tools/check_board.py.
import { text, font, ease, clamp01, CREAM, INK } from './broll.js';
import { rrect, line, W, H, TAU } from './cel.js';

export const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^\p{L}\p{N}]/gu, '');

export function resolveAnchor(a, L, words) {
  const m = /^([\w-]+)@(start|end|[^+#-]+?)(?:#(\d+))?\s*([+-]\s*[\d.]+)?$/u.exec(String(a).trim());
  if (!m) throw new Error(`board: bad anchor "${a}" — write line@word, line@word+0.2, line@word#2, line@start or line@end`);
  const [, id, w, nth, off] = m, l = L[id];
  if (!l) throw new Error(`board: anchor "${a}" names a line "${id}" that is not in the timeline`);
  const o = off ? parseFloat(off.replace(/\s/g, '')) : 0;
  if (w === 'start') return l.t0 + o;
  if (w === 'end') return l.t1 + o;
  const ws = words[id] || [], want = norm(w.trim().split(/\s+/)[0]);
  let k = 0, hit = null;
  for (const x of ws) if (norm(x.w) === want && ++k >= (+nth || 1)) { hit = x; break; }
  if (!hit) for (const x of ws) { const n = norm(x.w); if (n && (n.startsWith(want) || want.startsWith(n))) { hit = x; break; } }
  if (!hit) { console.warn(`board: "${w}" not heard in ${id} (words.json); the beat sits at the line's start`); return l.t0 + o; }
  return l.t0 + Math.max(0, hit.t0) + o;
}

// board.json says how the host is in a shot; true and false are the older spelling of desk and none
const hostMode = h => h === true ? 'desk' : h === false || h == null ? 'none' : h;

export async function loadBoard(url, L, words) {
  const b = await fetch(url).then(r => { if (!r.ok) throw new Error(`board: cannot load ${url} (${r.status})`); return r.json(); });
  return bindBoard(b, L, words);
}

export function bindBoard(board, L, words) {
  const INKT = board.ink || CREAM;   // the colour of chart and legend text: CREAM on a dark place, INK on a light one
  const pal = board.palette || {}, col = c => (c && pal[c] && (pal[c].color || pal[c])) || c || CREAM;
  const scenes = board.scenes.map(s => ({ ...s, beats: s.beats || [] }));
  const T = {};
  for (const s of scenes) for (const b of s.beats) { T[b.id] = resolveAnchor(b.at, L, words); b.scene = s.id; }
  scenes.forEach((s, i) => {
    const first = L[s.lines[0]], beat0 = Math.min(...s.beats.map(b => T[b.id]), Infinity);
    s.t0 = i === 0 ? 0 : Math.min(first ? first.t0 - (s.lead ?? .35) : Infinity, beat0 - .05);
  });
  scenes.forEach((s, i) => { s.t1 = i + 1 < scenes.length ? scenes[i + 1].t0 : Infinity; });
  // shots: the first one opens with its scene, each next one cuts on its anchor word
  for (const s of scenes) {
    s.shots = (s.shots && s.shots.length ? s.shots : [{ id: s.id, size: 'medium', host: (s.cast || []).includes('host') ? 'desk' : 'none' }])
      .map((x, j) => ({ ...x, host: hostMode(x.host), cam: x.cam || 'hold', scene: s.id, t0: j === 0 || !x.at ? s.t0 : resolveAnchor(x.at, L, words) }));
    s.shots.forEach((x, j) => { x.t1 = j + 1 < s.shots.length ? s.shots[j + 1].t0 : s.t1; });
  }
  const shots = scenes.flatMap(s => s.shots);
  const shot = Tm => { let i = shots.length - 1; while (i > 0 && Tm < shots[i].t0) i--; return shots[i]; };
  const beats = scenes.flatMap(s => s.beats), byId = Object.fromEntries(beats.map(b => [b.id, b]));
  const t = id => { if (!(id in T)) throw new Error(`board: no beat "${id}"`); return T[id]; };

  const scene = Tm => { let i = scenes.length - 1; while (i > 0 && Tm < scenes[i].t0) i--; return scenes[i]; };

  function events() {
    const ev = [];
    for (const s of scenes) {
      const sh0 = s.shots[0].id;
      if (s.in && s.in.sfx) ev.push({ t: Math.max(0, s.t0 - (s.in.pre ?? .05)), type: s.in.sfx, shot: sh0, cause: `scene ${s.in.tr || 'cut'}` });
      if (s.amb) ev.push({ t: s.t0, type: 'amb', kind: s.amb, t1: Number.isFinite(s.t1) ? s.t1 : s.t0 + 8, shot: sh0 });
      if (s.music) ev.push({ t: s.t0, type: 'music', cue: s.music, shot: sh0 });
      if (s.silence) { const ts = resolveAnchor(s.silence.at, L, words); const d = s.silence.d ?? 1; ev.push({ t: ts, t1: ts + d, type: 'silence', d, shot: shot(ts).id }); }
      for (const x of s.shots) ev.push({ t: +x.t0.toFixed(3), type: 'shot', shot: x.id, size: x.size, host: x.host, cam: x.cam });
      // a silent mark for every acting beat: where and how long it moves (tools/check_motion.py reads it)
      for (const b of s.beats) if (b.who && b.who !== 'none') ev.push({ t: +T[b.id].toFixed(3), type: 'mark', kind: 'beat', beat: b.id, move: b.move, d: b.d, xy: b.xy, shot: shot(T[b.id]).id });
      for (const b of s.beats) for (const x of [].concat(b.sfx || [])) {
        const tt = T[b.id] + (x.off || 0);
        ev.push({ t: +tt.toFixed(3), type: x.type, v: x.v, d: x.d, shot: shot(tt).id, beat: b.id, cause: x.cause });
      }
    }
    return ev;
  }

  // the camera of a shot: a slow push or pull on its "focus" ([x, y], default the centre) by "amount" (default 3 %), or a
  // track/pan by "move" ([dx, dy] px over the shot, default [-90, 0]); eased so the cut lands on a still frame
  function camera(g, Tm) {
    const sh = shot(Tm), d = Number.isFinite(sh.t1) ? sh.t1 - sh.t0 : 6, p = ease.inOut(clamp01((Tm - sh.t0) / d));
    const [fx, fy] = sh.focus || [W / 2, H / 2];
    if (sh.cam === 'push' || sh.cam === 'pull') {
      const a = sh.amount ?? .03, z = sh.cam === 'push' ? 1 + a * p : 1 + a * (1 - p);
      g.translate(fx, fy); g.scale(z, z); g.translate(-fx, -fy);
    } else if (sh.cam === 'track' || sh.cam === 'pan') {
      const [dx, dy] = sh.move || [-90, 0], z = 1 + Math.hypot(dx, dy) / W;   // a little wider so the edge never shows
      g.translate(W / 2, H / 2); g.scale(z, z); g.translate(-W / 2 + dx * (p - .5), -H / 2 + dy * (p - .5));
    }
    return sh;
  }

  // ——— the signals: a label on a thing, a pointer to it, a chart that grows ———
  // a term card: the word of a new idea and what it means, pinned to the frame like a note
  function termCard(g, L0, k, a) {
    const [x, y] = L0.xy || [80, 90], c = col(L0.color || 'term');
    g.font = font(900, 60); const w1 = g.measureText(L0.text.toUpperCase()).width;
    g.font = font(600, 36); const w2 = L0.def ? g.measureText(L0.def).width : 0;
    const wd = Math.max(L0.w || 0, w1 + 96, w2 + 96);
    g.save(); g.globalAlpha = k; g.translate(x, y); g.rotate(-.012); const sc = .92 + .08 * ease.back(a); g.scale(sc, sc);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fill(rrect(10, 12, wd, L0.def ? 190 : 120, 14));
    g.fillStyle = '#FFF8E6'; g.fill(rrect(0, 0, wd, L0.def ? 190 : 120, 14)); g.strokeStyle = INK; g.lineWidth = 3.4; g.stroke(rrect(0, 0, wd, L0.def ? 190 : 120, 14));
    g.fillStyle = c; g.fill(rrect(0, 0, 18, L0.def ? 190 : 120, 8));
    text(g, L0.text.toUpperCase(), 48, 78, { font: font(900, 60), fill: INK });
    if (L0.def) text(g, L0.def, 48, 146, { font: font(600, 36), fill: '#3B3F4E' });
    g.restore();
  }
  // a stamp: a verdict pressed onto the thing, once
  function stampMark(g, L0, k, a) {
    const [x, y] = L0.xy, c = col(L0.color || '#D6453D'), px = L0.size || 64;
    g.save(); g.globalAlpha = k * .92; g.translate(x, y); g.rotate(L0.rot ?? -.12); const sc = 1 + .5 * (1 - ease.out(a)); g.scale(sc, sc);
    g.font = font(900, px); const w = g.measureText(L0.text).width;
    g.strokeStyle = c; g.lineWidth = 7; g.stroke(rrect(-w / 2 - 26, -px * .85, w + 52, px * 1.3, 10));
    text(g, L0.text.toUpperCase(), 0, px * .18, { font: font(900, px), align: 'center', fill: c });
    g.restore();
  }

  function label(g, b, L0, Tm, sh) {
    const a = clamp01((Tm - T[b.id]) / .25), end = L0.hold != null ? T[b.id] + L0.hold : sh.t1;
    const out = L0.stay ? 1 : 1 - clamp01((Tm - end) / .25);
    const k = Math.min(a, out); if (k <= 0) return;
    if (L0.kind === 'term') return termCard(g, L0, k, a);
    if (L0.kind === 'stamp') return stampMark(g, L0, k, a);
    const [x, y] = L0.xy, c = col(L0.color), px = L0.size || 40, style = L0.style || (L0.kind === 'doc' ? 'note' : 'tag');
    g.save(); g.globalAlpha = k;
    const sc = .85 + .15 * ease.back(a); g.translate(x, y); g.scale(sc, sc);
    g.font = font(style === 'big' ? 900 : 800, style === 'big' ? px * 1.6 : px);
    const w = g.measureText(L0.text).width, h = (style === 'big' ? px * 1.6 : px) * 1.25;
    if (L0.to) {   // a leader line from the label to the thing it names, drawn first
      const [tx, ty] = L0.to; g.save(); g.scale(1 / sc, 1 / sc);
      line(g, [[0, 0], [tx - x, ty - y]], c, 4); g.beginPath(); g.arc(tx - x, ty - y, 8, 0, TAU); g.fillStyle = c; g.fill(); g.restore();
    }
    if (style !== 'plain') {
      g.fillStyle = 'rgba(0,0,0,.28)'; g.fill(rrect(-w / 2 - 22 + 6, -h / 2 + 8, w + 44, h, 16));
      g.fillStyle = style === 'note' ? '#FFF6D8' : c; g.fill(rrect(-w / 2 - 22, -h / 2, w + 44, h, 16));
      g.strokeStyle = INK; g.lineWidth = 3.4; g.stroke(rrect(-w / 2 - 22, -h / 2, w + 44, h, 16));
    }
    const ink = style === 'plain' ? c : (L0.ink || INK);
    text(g, L0.text, 0, h * .18, { font: g.font, align: 'center', fill: ink });
    g.restore();
  }

  function chart(g, b, C, Tm) {
    const a0 = T[b.id], grow = C.grow ?? .9, p = ease.out((Tm - a0) / grow);
    const hold = C.hold ?? 6, out = C.stay ? 1 : 1 - clamp01((Tm - a0 - hold) / .3);
    if (Tm < a0 || out <= 0) return;
    const [x, y, w, h] = C.box, items = C.items || [], max = C.max ?? Math.max(...items.map(i => i.value)) * 1.1;
    const ink = C.ink || INKT;
    g.save(); g.globalAlpha = out;
    if (C.title) text(g, C.title, x, y - 22, { font: font(800, 36), fill: ink });
    if (C.kind === 'bars' || C.kind === 'compare') {
      const n = items.length, gap = w * .08, bw = (w - gap * (n + 1)) / n;
      line(g, [[x, y + h], [x + w, y + h]], ink, 4);
      items.forEach((it, i) => {
        const st = clamp01((p * n - i * .5) / 1), v = it.value * ease.out(st), bh = h * v / max, bx = x + gap + i * (bw + gap);
        if (bh > 2) { const r = Math.min(10, bh / 2); g.fillStyle = col(it.color); g.fill(rrect(bx, y + h - bh, bw, bh, r)); g.strokeStyle = INK; g.lineWidth = 3.4; g.stroke(rrect(bx, y + h - bh, bw, bh, r)); }
        const num = (C.fmt ? C.fmt.replace('{v}', fmtNum(v, it.value)) : fmtNum(v, it.value) + (C.unit || ''));
        // the number appears when the bar has reached its value: a number that changes while it grows is a new
        // piece of text every frame, and no one can read it anyway
        if (st > .98) text(g, num, bx + bw / 2, y + h - bh - 16, { font: font(900, 46), align: 'center', fill: ink });
        text(g, it.label, bx + bw / 2, y + h + 46, { font: font(800, 34), align: 'center', fill: ink });
      });
    } else if (C.kind === 'people' || C.kind === 'dots') {
      // n icons, k of them in the highlight colour: "3 of 10", "1 in 4"
      const n = C.n || 10, k = C.k || 0, cols = C.cols || Math.min(n, 10), rows = Math.ceil(n / cols), cw = w / cols, ch = h / rows;
      for (let i = 0; i < n; i++) {
        const st = clamp01(p * n * 1.2 - i * .9), cx = x + (i % cols + .5) * cw, cy = y + (Math.floor(i / cols) + .5) * ch;
        if (st <= 0) continue;
        const r = Math.min(cw, ch) * .3 * ease.back(st), hot = i < k && Tm >= a0 + (C.kAt ?? grow);
        g.fillStyle = hot ? col(C.color || 'hot') : '#5A6488';
        if (C.kind === 'people') { g.beginPath(); g.arc(cx, cy - r * .9, r * .55, 0, TAU); g.fill(); g.fill(rrect(cx - r * .75, cy - r * .25, r * 1.5, r * 1.4, r * .5)); }
        else { g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); }
      }
      if (C.caption) text(g, C.caption, x + w / 2, y + h + 50, { font: font(800, 38), align: 'center', fill: ink });
    }
    g.restore();
  }
  const fmtNum = (v, target) => Number.isInteger(target) ? String(Math.round(v)) : v.toFixed(1).replace('.', ',');

  function pointer(g, b, P, Tm) {
    const a0 = T[b.id], hold = P.hold ?? 1.6, k = Math.min(clamp01((Tm - a0) / .2), 1 - clamp01((Tm - a0 - hold) / .2));
    if (k <= 0) return;
    const [x, y] = P.xy, c = col(P.color || 'hot'), r = (P.r || 70) * (1 + .08 * Math.sin((Tm - a0) * 8));
    g.save(); g.globalAlpha = k; g.strokeStyle = c; g.lineWidth = 7;
    if (P.kind === 'arrow') {
      const [fx, fy] = P.from || [x - 160, y - 120], q = ease.out((Tm - a0) / .3);
      line(g, [[fx, fy], [fx + (x - fx) * q, fy + (y - fy) * q]], c, 7);
      if (q > .95) { const ang = Math.atan2(y - fy, x - fx); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 28 * Math.cos(ang - .45), y - 28 * Math.sin(ang - .45)); g.lineTo(x - 28 * Math.cos(ang + .45), y - 28 * Math.sin(ang + .45)); g.closePath(); g.fillStyle = c; g.fill(); }
    } else { g.beginPath(); g.ellipse(x, y, r * (P.wide || 1.3), r, -.05, 0, TAU * ease.out((Tm - a0) / .35)); g.stroke(); }
    g.restore();
  }

  function signals(g, Tm) {
    const s = scene(Tm), sh = shot(Tm);
    for (const b of s.beats) {
      // a cut clears the frame: only what was put up during this shot is drawn (a label with "stay" crosses cuts)
      if (Tm < T[b.id] || (T[b.id] < sh.t0 - 1e-6 && ![].concat(b.label || []).some(x => x.stay))) continue;
      if (b.chart) chart(g, b, b.chart, Tm);
      if (b.point) pointer(g, b, b.point, Tm);
      for (const L0 of [].concat(b.label || [])) if (T[b.id] >= sh.t0 - 1e-6 || L0.stay) label(g, b, L0, Tm, sh);
    }
    if (s.legend && Tm >= s.t0 + .3) {   // what the colours mean, for as long as the scene uses them
      let y = s.legend.xy ? s.legend.xy[1] : 70; const x = s.legend.xy ? s.legend.xy[0] : 60;
      for (const key of s.legend.keys || []) {
        const p = pal[key]; if (!p) continue;
        g.fillStyle = p.color || p; g.beginPath(); g.arc(x + 14, y - 12, 14, 0, TAU); g.fill();
        text(g, p.name || key, x + 40, y, { font: font(800, 32), fill: s.legend.ink || INKT }); y += 48;
      }
    }
  }

  return {
    board, scenes, beats, byId, palette: pal, color: col,
    shots, t, u: (id, Tm, d) => ease.out((Tm - t(id)) / (d ?? byId[id]?.d ?? .4)),
    p: (id, Tm, e = 'inOut', d) => (ease[e] || ease.inOut)(clamp01((Tm - t(id)) / (d ?? byId[id]?.d ?? .6))), on: (id, Tm) => Tm >= t(id), scene, shot, camera, events, signals,
  };
}
