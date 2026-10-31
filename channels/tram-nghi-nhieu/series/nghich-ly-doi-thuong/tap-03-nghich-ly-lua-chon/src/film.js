// "Nghịch lý lựa chọn" — Tập 03 của series Nghịch lý đời thường, kênh Trạm Nghĩ Nhiều.
// Shots are functions of local time; every time comes from timeline.js (the real voice).
// Page contract: window.render(t), DUR, READY, EV (sound events), TEXTS(t) (on-screen text for the reading check), CUES (subtitles).
import { figure, expr, blendE, PAL, roi, battery } from '../../../../rig/character.js';
import { cel, path, poly, ellP, line, limb, mix, rgba, canvas, W, H, TAU, rect } from '../../../../rig/cel.js';
import { ground, panel, hilite, stamp, pip, bubble, focusLines, subtitle, tag, ring, batteryBig, text, revealText, sharpText, font, ease, seg, clamp01, INK, CREAM, ACCENT, STORY, REG } from '../../../../rig/broll.js';
import * as S from '../../../../rig/sets.js';
import { build, norm } from './timeline.js';

const cv = document.getElementById('c'), G = cv.getContext('2d');
const [buf, B] = canvas(W, H);
let TL, SHOTS, EV = [];

// ——— animation tools ———
const E = x => typeof x === 'string' ? expr(x) : expr(x[0], x[1]);
function ek(T, keys, bl = .14) {   // expression keys [[t, name | [name, over]]], blended over bl seconds
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const cur = E(keys[i][1]); if (i === 0) return cur;
  const u = seg(T, keys[i][0], keys[i][0] + bl); return u >= 1 ? cur : blendE(E(keys[i - 1][1]), cur, ease.inOut(u));
}
const lerp = (a, b, u) => a + (b - a) * u;
function ak(T, keys, d = .34) {   // arm keys [[t, {at, gest, rot, fore, upper, flip, prop}]]: back-eased move
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const c = keys[i][1]; if (i === 0) return c;
  const p = keys[i - 1][1], u = ease.back(seg(T, keys[i][0], keys[i][0] + d)), v = ease.inOut(seg(T, keys[i][0], keys[i][0] + d * .7));
  return { ...(v < .5 ? p : c), at: [lerp(p.at[0], c.at[0], u), lerp(p.at[1], c.at[1], u)], rot: lerp(p.rot || 0, c.rot || 0, v),
    fore: lerp(p.fore ?? 1, c.fore ?? 1, v), upper: lerp(p.upper ?? 1, c.upper ?? 1, v), gest: v < .5 ? (p.gest || 'relaxed') : (c.gest || 'relaxed') };
}
function nk(T, keys, d = .5) {   // numeric keys [[t, value]]: eased in-out
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  if (i === 0) return keys[0][1];
  return lerp(keys[i - 1][1], keys[i][1], ease.inOut(seg(T, keys[i][0], keys[i][0] + d)));
}
// blinks: every 2–5 s, sometimes double; deterministic
const BLINKS = []; { let s = 11, t = 1.2; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 200) { BLINKS.push(t); if (r() < .2) BLINKS.push(t + .28); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < .16) return Math.sin(d / .16 * Math.PI); } return 0; }
function camera(g, z, fx, fy, ox = 0, oy = 0) { g.translate(fx, fy); g.scale(z, z); g.translate(-fx - ox, -fy - oy); }
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id], w = (id, k) => TL.w(id, k);
// the time of the n-th time a word is said in a line (n = 0 is the first time)
function wn(id, word, n = 0) {
  const ws = TL.words[id] || [], t = norm(word); let k = 0;
  for (const x of ws) {
    if (norm(x.w) === t) { if (k === n) return L(id).t0 + Math.max(0, Math.min(L(id).t1 - L(id).t0, x.t0)); k++; }
  }
  return L(id).t0;
}
const talkAt = T => TL.talk(T);
const sway = T => Math.sin(T * .55) * .035;
const FULL = .72;
const feet = s => 1010 - 650 * (s || FULL);
// the ink colours for the charts drawn on paper: the paper is light, so the writing on it is dark
const INK2 = '#2A2A24', GREY = '#6E6757', AMBER = '#8A5A2A', DARKCYAN = '#1B7F94';

// ——— the desk, seen from above: the wood, the lamp pool, and what lies on it ———
function deskTop(g, T, o = {}) {
  ground(g, '#14161F');
  cel(g, rect(-200, -140, W + 200, H + 200), { f: '#2A2118', s: '#1C1610', so: [0, -10], l: '#0E0B08', lw: 3 });
  for (let i = 0; i < 7; i++) line(g, [[-200, 90 + i * 160], [W + 200, 62 + i * 160]], '#241C14', 6);
  const grd = g.createRadialGradient(540, 300, 40, 540, 300, 980);
  grd.addColorStop(0, 'rgba(255,183,3,.22)'); grd.addColorStop(1, 'rgba(255,183,3,0)');
  g.fillStyle = grd; g.fillRect(-200, -140, W + 400, H + 300);
  if (o.cup !== false) cupTop(g, 1450, 800, T);
}
function cupTop(g, x, y, T) {
  cel(g, ellP(x, y, 92, 92), { f: '#D8D4CC', s: '#A8A49C', so: [10, 12], l: '#12131A', lw: 2.6 });
  cel(g, ellP(x, y, 68, 68), { f: '#4A3222', s: '#33231A', so: [0, 0], l: '#12131A', lw: 2.4 });
  cel(g, ellP(x - 14, y - 16, 26, 18), { f: '#6E4A30', l: '#12131A', lw: 1.6 });
  for (let i = 0; i < 2; i++) {   // the steam, seen from above: two pale curls
    const k = (T * .3 + i / 2) % 1;
    g.strokeStyle = rgba('#FFFFFF', .18 * (1 - k)); g.lineWidth = 6; g.beginPath();
    g.arc(x + 10 + i * 26, y - 40 - k * 60, 26 + k * 30, .4, 4.2); g.stroke();
  }
}

// ——— a sheet of paper: a menu, a chart, a note ———
function sheet(g, x, y, w, h, rot = 0, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: o.f || '#EFE9DA', s: o.s || '#CFC7B2', so: [10, 14], l: '#2A2A24', lw: 2.6 });
  if (o.grid) {
    g.save(); g.beginPath(); g.rect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12); g.clip();
    for (let gx = -w / 2 + 20; gx < w / 2; gx += 34) line(g, [[gx, -h / 2], [gx, h / 2]], 'rgba(110,130,165,.30)', 1.4);
    for (let gy = -h / 2 + 20; gy < h / 2; gy += 34) line(g, [[-w / 2, gy], [w / 2, gy]], 'rgba(110,130,165,.30)', 1.4);
    g.restore();
  }
  g.restore();
}

// ——— the menu: a paper card with a header and rows of dishes and prices ———
// rows: [{ name: <the drawn name line>, price: <the drawn price line> }]
function menuCard(g, x, y, w, h, rot = 0, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: '#F1EBDC', s: '#CFC7B2', so: [12, 16], l: '#2A2A24', lw: 3 });
  if (o.title) text(g, o.title, -w / 2 + 44, -h / 2 + 76, { font: font(900, 54), fill: '#2A2A24' });
  if (o.rule) line(g, [[-w / 2 + 40, -h / 2 + 100], [w / 2 - 40, -h / 2 + 100]], '#B9AE95', 4);
  const n = o.rows || 8, top = -h / 2 + (o.title ? 150 : 70), rowH = (h - (o.title ? 210 : 130)) / n;
  for (let i = 0; i < n; i++) {
    const yy = top + i * rowH, len = (o.nameLens ? o.nameLens[i] : 0.52 + (i % 3) * .12) * (w - 300);
    if (o.crossed && o.crossed.includes(i)) {
      line(g, [[-w / 2 + 50, yy - 8], [-w / 2 + 60 + len, yy - 14]], '#C0392B', 6);
      g.globalAlpha = .45;
    }
    line(g, [[-w / 2 + 50, yy], [-w / 2 + 50 + len, yy]], o.crossed && o.crossed.includes(i) ? '#8C8474' : '#4A4436', 9);
    line(g, [[w / 2 - 120, yy], [w / 2 - 50, yy]], '#4A4436', 7);
    g.globalAlpha = 1;
    if (o.highlight === i) {
      cel(g, rect(-w / 2 + 36, yy - 26, w / 2 - 36, yy + 26), { f: 'rgba(255,183,3,.22)', l: '#C88A00', lw: 4 });
    }
  }
  g.restore();
}

// ——— a pencil, lying on the desk ———
function pencil(g, x, y, rot = 0, s = 1) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  cel(g, rect(-150, -11, 120, 11), { f: '#E0A32E', s: '#A87518', so: [0, 10], l: '#2A2A24', lw: 2.4 });
  cel(g, poly([[120, -11], [168, 0], [120, 11]]), { f: '#E8DCC0', l: '#2A2A24', lw: 2.4 });
  cel(g, poly([[152, -4], [168, 0], [152, 4]]), { f: '#2A2A24', l: '#2A2A24', lw: 1.6 });
  cel(g, rect(-178, -11, -150, 11), { f: '#E06A6A', l: '#2A2A24', lw: 2.4 });
  g.restore();
}

// ——— a magnifier, held in a hand ———
function magnifier(g, s = 1) {
  g.save(); g.scale(s, s);
  cel(g, ellP(0, 0, 62, 62), { f: 'rgba(180,220,255,.16)', s: 'rgba(180,220,255,.10)', so: [0, 0], l: '#B9C6DA', lw: 9 });
  cel(g, rect(52, -13, 190, 13), { f: '#3A4260', s: '#232838', so: [0, 8], l: '#12131A', lw: 2.6 });
  g.restore();
}

// ——— a jar of jam ———
const JAM = ['#C4473E', '#E08A2E', '#8B4FA8', '#D9B23A', '#4E8B6B', '#B0563F', '#D46A8C', '#5C7BC4'];
function jamJar(g, x, y, s, i, glow = 0) {
  const c = JAM[i % JAM.length];
  g.save(); g.translate(x, y); g.scale(s, s);
  if (glow > 0) {
    const grd = g.createRadialGradient(0, 0, 10, 0, 0, 150);
    grd.addColorStop(0, rgba('#67E8F9', .55 * glow)); grd.addColorStop(1, rgba('#67E8F9', 0));
    g.fillStyle = grd; g.beginPath(); g.arc(0, 0, 150, 0, TAU); g.fill();
  }
  cel(g, rect(-28, -34, 28, 38), { f: '#E6E2D6', s: '#BFB9A8', so: [7, 0], l: '#2A2A24', lw: 2.4 });
  cel(g, rect(-23, -6, 23, 32), { f: c, s: mix(c, '#2A2A24', .28), so: [0, 0], l: '#2A2A24', lw: 2 });
  cel(g, rect(-31, -48, 31, -30), { f: '#B9B3A4', s: '#8E887A', so: [6, 0], l: '#2A2A24', lw: 2.4 });
  cel(g, rect(-23, -22, 23, -8), { f: '#F2EEE2', l: '#B9B3A4', lw: 1.6 });
  line(g, [[-16, -15], [10, -15]], '#8E887A', 4);
  g.restore();
}

// ——— the cork board: the mind lab of the episode ———
function corkBoard(g, x, y, w, h) {
  cel(g, rect(x - 22, y - 22, x + w + 22, y + h + 22), { f: '#6A4A2C', s: '#4A3220', so: [12, 14], l: '#241A10', lw: 4 });
  cel(g, rect(x, y, x + w, y + h), { f: '#4A3B2A', s: '#332818', so: [0, 0], l: '#241A10', lw: 2.6 });
  for (let i = 0; i < 260; i++) {
    const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1;
    g.fillStyle = rgba('#2A2013', .18 + a * .2); g.fillRect(x + a * w, y + b * h, 5 + (i % 3) * 4, 4);
  }
}
function pinCard(g, x, y, w, h, rot = 0, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: o.f || '#EDE7D8', s: '#C9C2B0', so: [7, 9], l: '#2A2A24', lw: 2.4 });
  if (o.active) cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: 'rgba(255,183,3,.16)', l: '#FFB703', lw: 5 });
  cel(g, ellP(0, -h / 2 + 15, 12, 12), { f: PAL.red.f, s: PAL.red.s, so: [-3, -3], l: PAL.red.l, lw: 2 });
  g.fillStyle = '#fff'; g.beginPath(); g.arc(-3, -h / 2 + 11, 3.4, 0, TAU); g.fill();
  g.restore();
}
function thread(g, x1, y1, x2, y2, col = '#D8402F') {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + 26;
  g.strokeStyle = col; g.lineWidth = 4; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo(mx, my, x2, y2); g.stroke();
}

// ——— a plate with a dish ———
function plate(g, x, y, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  cel(g, ellP(0, 0, 96, 44), { f: '#E8E2D4', s: '#B5AD9A', so: [0, 12], l: '#2A2A24', lw: 2.6 });
  cel(g, ellP(0, 0, 66, 28), { f: '#DCD5C4', l: '#B5AD9A', lw: 2 });
  if (o.food !== false) {
    cel(g, ellP(-8, -6, 34, 16), { f: '#D9A441', s: '#A9762A', so: [0, 4], l: '#2A2A24', lw: 2 });
    cel(g, ellP(16, -10, 20, 11), { f: '#7FA05A', l: '#2A2A24', lw: 1.8 });
    cel(g, ellP(-26, -12, 13, 8), { f: '#C4473E', l: '#2A2A24', lw: 1.8 });
  }
  g.restore();
}

// ——— a plate outline left empty: the dish that was not chosen ———
function ghostPlate(g, x, y, s = 1, a = 1) {
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
  g.setLineDash([14, 12]);
  cel(g, ellP(0, 0, 96, 44), { f: 'rgba(0,0,0,0)', l: '#6E7A9C', lw: 5 });
  g.setLineDash([]);
  line(g, [[-34, -6], [18, -12]], '#4A5578', 5);
  line(g, [[-34, 8], [10, 2]], '#4A5578', 5);
  g.restore();
}

// ——— the scene helpers ———
// the night room: the desk, the lamp, the host
function room(g, T, o = {}, z = 1, f = [1320, 420], extra, over) {
  ground(g);
  g.save(); camera(g, z, f[0], f[1]);
  const cam = { x: 0, y: 0 };
  S.roomBack(g, T, cam);
  if (extra) extra(g);
  kng(g, o.x === undefined ? 1250 : o.x, o.y === undefined ? 640 : o.y, { s: o.s === undefined ? 1.15 : o.s, talk: talkAt(T), headRoll: sway(T) * .6, ...o }, T);
  if (over) over(g);
  S.roomFront(g, T, cam);
  g.restore();
}
// the cork board, seen straight on
function boardScene(g, T, o = {}, z = 1, f = [960, 540], extra, over) {
  ground(g, '#15171F');
  g.save(); camera(g, z, f[0], f[1]);
  const cam = { x: 0, y: 0 };
  S.roomBack(g, T, cam);
  corkBoard(g, 700, 120, 1060, 760);
  if (extra) extra(g);
  if (o.host !== false) kng(g, 330, 950, { s: .95, talk: talkAt(T), headRoll: sway(T) * .5, headYaw: .35, ...o }, T);
  if (over) over(g);
  g.restore();
}
// a plain stage for a chart: the sheet lies on the desk
function chartScene(g, T, o = {}, z = 1, f = [960, 540], extra, over) {
  deskTop(g, T, { cup: o.cup !== false });
  g.save(); camera(g, z, f[0], f[1]);
  if (extra) extra(g);
  if (over) over(g);
  g.restore();
}
// the forest plot: one dot per condition, the mean, and the confidence band
function forestPlot(g, cx, cy, w, h, o = {}) {
  const px = cx - w / 2, py = cy - h / 2;
  const zx = px + w * .42;                       // the zero line
  const sx = v => zx + v * (w * .30);            // effect size to x
  // the confidence band
  cel(g, rect(sx(-.09), py + 10, sx(.12), py + h - 10), { f: 'rgba(103,232,249,.18)', l: 'rgba(103,232,249,.55)', lw: 2.4 });
  // the zero line
  line(g, [[zx, py], [zx, py + h]], '#8A8274', 4);
  // the dots: 63 conditions, deterministic
  for (let i = 0; i < 63; i++) {
    const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1;
    const c = Math.abs(Math.sin(i * 39.3467) * 24634.6345) % 1;
    const v = (a - .45) * .9 + (c - .5) * .25;
    const yy = py + 26 + b * (h - 52);
    cel(g, ellP(sx(v), yy, 7, 7), { f: '#4A5578', s: '#2E3448', so: [2, 2], l: '#12131A', lw: 1.6 });
  }
  // the mean
  cel(g, ellP(sx(.02), py + h * .5, 15, 15), { f: PAL.hoodie.f, s: '#C88A00', so: [3, 3], l: '#12131A', lw: 2.4 });
  line(g, [[sx(.02), py + 18], [sx(.02), py + h - 18]], rgba('#FFB703', .55), 3);
  // the axis
  line(g, [[px + 10, py + h - 6], [px + w - 10, py + h - 6]], '#8A8274', 3);
  if (o.flat) {   // the same dots against the size of the choice set: a flat line
    line(g, [[px + 40, py + h * .52], [px + w - 40, py + h * .52]], '#8A5A2A', 5);
    line(g, [[px + 40, py + h * .52 - 9], [px + 40, py + h * .52 + 9]], '#8A5A2A', 5);
    line(g, [[px + w - 40, py + h * .52 - 9], [px + w - 40, py + h * .52 + 9]], '#8A5A2A', 5);
  }
}

// ——— the shots ———
// each: { n, t (start), f(g, lt, T), ev: () => [[t, type, extra]] }
function shots() {
  const at = (id, d) => L(id).t0 - d;
  const dur = id => L(id).t1 - L(id).t0;
  return [
    // 1 — the cold open: a menu on the desk, and nobody choosing
    { n: 'cold', t: 0, f(g, lt, T) {
      g.save(); camera(g, 1 + seg(lt, 0, 5.5) * .035, 960, 520);
      deskTop(g, T);
      menuCard(g, 900, 500, 880, 640, -.04, { rows: 8 });
      pencil(g, 1490, 700, .5, 1);
      g.restore();
    }, ev: () => [[0, 'paper'], [0, 'amb', { kind: 'room', t1: at('hook', .2) }]] },

    // 2 — the host with the menu, tapping his pencil
    { n: 'hook', t: at('hook', .35), tr: 'whip', f(g, lt, T) {
      const t0 = L('hook').t0;
      room(g, T, { x: 1240, y: 660, s: 1.2, E: ek(T, [[0, 'thinking'], [t0 + 2.2, 'tired']]), headYaw: -.1 + sway(T),
        armL: ak(T, [[0, { at: [-150, 250] }], [t0 + .4, { at: [-120, 120], gest: 'hold', rot: -.2 }]], .4),
        armR: ak(T, [[0, { at: [150, 250] }], [t0 + .6, { at: [130, 150], gest: 'hold', rot: .3 }]], .4) },
        1 + seg(lt, 0, 9) * .03, [1180, 440],
        g => {   // the menu, held in both hands
          g.save(); g.translate(1240, 700); g.rotate(.02);
          menuCard(g, 0, 0, 460, 320, 0, { title: 'THỰC ĐƠN', rows: 3 });
          g.restore();
        },
        g => {
          text(g, '23:52', 78, 128, { font: font(900, 66), fill: PAL.muted });
          roi(g, 420, 760, 1.25, { t: T, E: { mo: .25, lookX: .3 } });
        });
    }, ev() { return [[this.t - .12, 'whoosh'], [this.t, 'pop'], [L('hook').t0 + 2.2, 'boing'], [this.t, 'amb', { kind: 'room', t1: at('hook2', .2) }]]; } },

    // 3 — the menu comes down: the face
    { n: 'hook2', t: at('hook2', .3), f(g, lt, T) {
      const t0 = L('hook2').t0;
      const Ex = ek(T, [[0, 'tired'], [t0 + 2.6, 'worried']]);
      ground(g, '#161925');
      focusLines(g, 980, 470, T, '#222A40', 64, 400);
      kng(g, 1000, 800, { s: 2.6, E: Ex, headPitch: nk(T, [[0, .2], [t0 + 2.6, .5]]), headRoll: -.03, talk: talkAt(T) }, T);
      menuCard(g, 250, 700, 520, 300, .06, { rows: 3 });
      g.globalAlpha = .9;
      text(g, '23:52', 78, 128, { font: font(900, 66), fill: PAL.muted });
      g.globalAlpha = 1;
    }, ev() { return [[this.t, 'swish'], [this.t, 'amb', { kind: 'room', t1: at('intro', .2) }]]; } },

    // 4 — the title card, pinned on the desk
    { n: 'title', t: at('intro', .3), f(g, lt, T) {
      const t0 = L('intro').t0, nameT = wn('intro', 'Kẻ'), hiT = wn('intro', 'lựa');
      const Ex = ek(T, [[0, 'happy'], [t0 + 1.4, 'talk'], [wn('intro', 'nay'), 'smile']]);
      const wave = T > t0 - .3 && T < t0 + 1.8, wv = Math.sin((T - t0) * 13) * .28;
      room(g, T, { x: 1250, y: 640, s: 1.15, E: Ex, headYaw: -.1 + sway(T), headRoll: .04,
        armL: ak(T, [[0, { at: [-140, 250] }], [t0 - .2, { at: [-180, -80], gest: 'open', rot: -.1 + (wave ? wv : 0), flip: true }], [t0 + 1.8, { at: [-140, 250] }]], .3),
        armR: ak(T, [[0, { at: [140, 250] }]]) }, 1, [1320, 420],
        g => {
          const p = ease.back(seg(lt, .05, .55));
          panel(g, { x: 540 - (1 - p) * 900, y: 470, w: 780, h: 520, rot: -.03, tape: true }, (gg, cw, ch) => {
            const x0 = -cw / 2 + 56, y0 = -ch / 2;
            text(gg, 'TRẠM', x0, y0 + 120, { font: font(900, 92), fill: PAL.hoodie.f });
            text(gg, 'NGHĨ NHIỀU', x0, y0 + 226, { font: font(900, 92), fill: PAL.hoodie.f });
            hilite(gg, x0 - 10, y0 + 316, 470, 56, seg(T, hiT - .1, hiT + .35), PAL.hoodie.f, 4);
            revealText(gg, 'Nghịch lý lựa chọn', x0, y0 + 356, seg(T, hiT - .1, hiT + .7), { font: font(400, 44, 'Patrick Hand'), fill: '#2A2A24' });
            text(gg, 'TẬP 03', x0, y0 + 430, { font: font(800, 46), fill: CREAM });
          });
        },
        g => { tag(g, 'KẺ NGHĨ NHIỀU', 1320, 830, seg(T, nameT - .1, nameT + .25), { col: PAL.hoodie, px: 34 }); });
    }, ev() { return [[this.t + .05, 'paper'], [wn('intro', 'Kẻ') - .1, 'pop'], [wn('intro', 'lựa'), 'marker'], [this.t, 'music', { cue: 'B' }]]; } },

    // 5 — the popular explanation, on the wall
    { n: 'myth', t: at('myth', .3), f(g, lt, T) {
      const t0 = L('myth').t0;
      ground(g, '#171A24');
      // the wall
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1E2333', s: '#151926', so: [0, 0], l: '#12131A', lw: 3 });
      for (let i = 0; i < 5; i++) line(g, [[-200, 120 + i * 210], [W + 200, 120 + i * 210]], '#232839', 4);
      // the poster
      g.save(); g.translate(1080, 470); g.rotate(.015);
      cel(g, rect(-560, -300, 560, 300), { f: '#E7E1D0', s: '#C4BCA6', so: [12, 16], l: '#2A2A24', lw: 3.4 });
      text(g, 'TÊ LIỆP', -500, -150, { font: font(900, 118), fill: '#2A2A24' });
      text(g, 'QUYẾT ĐỊNH', -500, -20, { font: font(900, 118), fill: '#2A2A24' });
      line(g, [[-500, 40], [200, 40]], '#B9AE95', 6);
      text(g, '?', -500, 190, { font: font(900, 150), fill: '#B9AE95' });
      text(g, 'một câu trả lời quen', -380, 180, { font: font(400, 40, 'Patrick Hand'), fill: '#6E6757' });
      cel(g, ellP(-430, -300, 14, 14), { f: PAL.red.f, s: PAL.red.s, so: [-3, -3], l: PAL.red.l, lw: 2 });
      g.restore();
      stamp(g, 'PHỔ BIẾN', 1290, 720, { rot: .1, px: 52, p: seg(T, t0 + 1.2, t0 + 1.5) });
      roi(g, 360, 700, 1.9, { t: T, E: { mo: .4, lookX: .4 } });
      text(g, '23:52', 78, 128, { font: font(900, 66), fill: PAL.muted });
    }, ev() { return [[this.t, 'pop'], [this.t + 1.3, 'stamp'], [this.t, 'amb', { kind: 'room', t1: at('myth2', .2) }]]; } },

    // 6 — checking it: the magnifying glass
    { n: 'check', t: at('myth2', .3), tr: 'whip', f(g, lt, T) {
      const t0 = L('myth2').t0;
      room(g, T, { x: 1230, y: 660, s: 1.35, E: ek(T, [[0, 'thinking'], [t0 + 2.4, 'determined']]), headYaw: -.18 + sway(T),
        armR: ak(T, [[0, { at: [150, 250] }], [t0 + .5, { at: [120, 90], gest: 'hold', rot: .35 }]], .4),
        armL: ak(T, [[0, { at: [-150, 250] }], [t0 + .3, { at: [-130, 140], gest: 'hold', rot: -.3 }]], .4) },
        1 + seg(lt, 0, 8) * .04, [1150, 460],
        g => { menuCard(g, 1230, 760, 560, 360, .02, { rows: 5 }); },
        g => {
          g.save(); g.translate(1330, 790); g.rotate(.2); magnifier(g, 1.1); g.restore();
          roi(g, 420, 700, 1.5, { t: T, E: { mo: .5, lookX: .3 } });
        });
    }, ev() { return [[this.t - .12, 'whoosh'], [this.t, 'paper'], [this.t, 'amb', { kind: 'room', t1: at('jam', .2) }]]; } },

    // 7 — the jam table: six, and twenty-four
    { n: 'jam', t: at('jam', .3), f(g, lt, T) {
      const t0 = L('jam').t0;
      ground(g, '#1A1D28');
      // the counter
      cel(g, rect(-200, 700, W + 200, H + 200), { f: '#3A3228', s: '#26211A', so: [0, -10], l: '#12131A', lw: 3 });
      // the two tables
      cel(g, rect(120, 250, 900, 700), { f: '#E7E1D0', s: '#C4BCA6', so: [0, 12], l: '#2A2A24', lw: 3 });
      cel(g, rect(1020, 250, 1800, 700), { f: '#E7E1D0', s: '#C4BCA6', so: [0, 12], l: '#2A2A24', lw: 3 });
      for (let i = 0; i < 6; i++) jamJar(g, 220 + (i % 3) * 270, 350 + Math.floor(i / 3) * 180, .95, i);
      for (let i = 0; i < 24; i++) jamJar(g, 1090 + (i % 8) * 88, 310 + Math.floor(i / 8) * 135, .58, i);
      text(g, '6 vị', 510, 790, { font: font(900, 62), align: 'center', fill: CREAM });
      text(g, '24 vị', 1410, 790, { font: font(900, 62), align: 'center', fill: CREAM });
      text(g, 'một bàn nếm thử, năm 2000', 960, 170, { font: font(400, 40, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      roi(g, 330, 830, 1.35, { t: T, E: { mo: .3, lookX: .5 } });
    }, ev() { const t0 = L('jam').t0; const r = [[this.t, 'paper'], [this.t, 'amb', { kind: 'room', t1: at('jam2', .2) }]]; for (let i = 0; i < 4; i++) r.push([t0 + .3 + i * .22, 'pop']); return r; } },

    // 8 — the two numbers
    { n: 'jam2', t: at('jam2', .3), f(g, lt, T) {
      const t0 = L('jam2').t0, barT = wn('jam2', '30'), barT2 = wn('jam2', 'phần');
      ground(g, '#14161F');
      sheet(g, 960, 500, 1200, 700, -.01, { grid: true });
      const p = ease.out(seg(T, barT, barT + 1.1)), p2 = ease.out(seg(T, barT2, barT2 + .8));
      // the tall bar: 30%
      cel(g, rect(420, 700, 720, 700 - 380 * p), { f: PAL.hoodie.f, s: '#C88A00', so: [0, 8], l: '#12131A', lw: 3 });
      // the short bar: 3%
      cel(g, rect(1200, 700, 1500, 700 - 38 * p2), { f: PAL.red.f, s: '#B22634', so: [0, 8], l: '#12131A', lw: 3 });
      line(g, [[300, 700], [1620, 700]], '#8A8274', 4);
      text(g, '30%', 570, 700 - 380 * p - 24, { font: font(900, 112), align: 'center', fill: INK2 });
      text(g, '3%', 1350, 700 - 38 * p2 - 24, { font: font(900, 112), align: 'center', fill: INK2 });
      text(g, 'người đã mua', 960, 780, { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: GREY });
      text(g, 'bên sáu vị', 570, 840, { font: font(800, 40), align: 'center', fill: GREY });
      text(g, 'bên hai mươi bốn vị', 1350, 840, { font: font(800, 40), align: 'center', fill: GREY });
    }, ev() { const t0 = L('jam2').t0; return [[this.t, 'music', { cue: 'C' }], [wn('jam2', 'phần', 0), 'marker'], [wn('jam2', 'phần', 1), 'marker'], [this.t, 'amb', { kind: 'room', t1: at('jam3', .2) }]]; } },

    // 9 — the story, printed everywhere
    { n: 'jam3', t: at('jam3', .3), f(g, lt, T) {
      ground(g, '#14161F');
      for (let i = 0; i < 10; i++) {
        const col = i % 5, row = Math.floor(i / 5);
        const x = 780 + col * 290, y = 210 + row * 300;
        g.save(); g.translate(x, y); g.rotate((i % 3 - 1) * .025);
        cel(g, rect(-130, -105, 130, 105), { f: '#CFC9B8', s: '#A8A292', so: [8, 10], l: '#2A2A24', lw: 2.4 });
        cel(g, rect(-106, -80, 18, 22), { f: '#8A8274', l: '#2A2A24', lw: 1.6 });
        for (let k = 0; k < 4; k++) line(g, [[-106, -44 + k * 24], [-106 + 70 + (k % 2) * 46, -44 + k * 24]], '#8A8274', 7);
        g.restore();
      }
      kng(g, 400, 1010, { s: 1.3, E: expr('thinking', { lookX: .5, lookY: -.3 }), talk: talkAt(T), headYaw: .3 }, T);
      roi(g, 640, 830, 1.5, { t: T, E: { mo: .3, lookX: .3 } });
    }, ev() { const r = [[this.t, 'amb', { kind: 'scroll', t1: at('meta', .2) }]]; for (let i = 0; i < 5; i++) r.push([this.t + .25 + i * .18, 'paper']); return r; } },

    // 10 — the meta-analysis: 63 dots around zero
    { n: 'meta', t: at('meta', .3), f(g, lt, T) {
      const t0 = L('meta').t0;
      chartScene(g, T, {}, 1, [960, 540], g => {
        sheet(g, 960, 500, 1240, 720, -.012, { grid: true });
        forestPlot(g, 960, 480, 1080, 470, {});
        text(g, '50 thí nghiệm · 63 điều kiện · 5.036 người', 960, 186, { font: font(800, 46), align: 'center', fill: INK2 });
        text(g, 'mỗi chấm là một thí nghiệm', 960, 836, { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: GREY });
        text(g, 'hiệu ứng của việc thêm lựa chọn', 960, 236, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: GREY });
      });
      pencil(g, 1620, 800, -.4, .9);
    }, ev() { return [[this.t, 'paper'], [this.t, 'amb', { kind: 'low', t1: at('meta2', .2) }], [this.t, 'music', { cue: 'D' }]]; } },

    // 11 — the mean, and its confidence band
    { n: 'meta2', t: at('meta2', .3), f(g, lt, T) {
      const t0 = L('meta2').t0, nT = wn('meta2', 'trung');
      chartScene(g, T, { cup: false }, 1, [960, 540], g => {
        sheet(g, 960, 520, 1300, 640, -.01, { grid: true });
        const a = ease.out(seg(T, nT - .2, nT + .5));
        // the band
        cel(g, rect(420, 300, 1500, 380), { f: 'rgba(103,232,249,.20)', l: 'rgba(103,232,249,.6)', lw: 3 });
        line(g, [[960, 300], [960, 380]], '#6E7A9C', 4);
        text(g, '−0,09', 400, 356, { font: font(800, 48), align: 'right', fill: DARKCYAN });
        text(g, '+0,12', 1520, 356, { font: font(800, 48), fill: DARKCYAN });
        text(g, '0', 960, 356, { font: font(800, 44), align: 'center', fill: GREY });
        g.save(); g.globalAlpha = a;
        text(g, '0,02', 960, 600, { font: font(900, 210), align: 'center', fill: INK2 });
        g.restore();
        text(g, 'hiệu ứng trung bình', 960, 676, { font: font(800, 46), align: 'center', fill: AMBER });
        text(g, 'khoảng tin 95%', 960, 244, { font: font(400, 36, 'Patrick Hand'), align: 'center', fill: GREY });
      });
    }, ev() { const nT = wn('meta2', 'trung'); return [[this.t, 'amb', { kind: 'low', t1: at('meta3', .2) }], [nT - .1, 'marker']]; } },

    // 12 — and it does not depend on how many options there were
    { n: 'meta3', t: at('meta3', .3), f(g, lt, T) {
      const t0 = L('meta3').t0, fT = wn('meta3', 'chẳng');
      chartScene(g, T, {}, 1, [960, 540], g => {
        sheet(g, 960, 500, 1240, 720, -.012, { grid: true });
        forestPlot(g, 960, 460, 1080, 430, {});
        // the axis of the choice set
        line(g, [[420, 700], [1500, 700]], '#8A8274', 4);
        for (let i = 0; i <= 4; i++) line(g, [[420 + i * 270, 700], [420 + i * 270, 716]], '#8A8274', 3);
        text(g, 'số lựa chọn', 960, 774, { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: GREY });
        g.globalAlpha = ease.out(seg(T, fT - .3, fT + .4));
        line(g, [[430, 300], [1490, 306]], '#8A5A2A', 6);
        g.globalAlpha = 1;
        text(g, 'không quan hệ (p = 0,14)', 960, 252, { font: font(800, 50), align: 'center', fill: INK2 });
      });
    }, ev() { const fT = wn('meta3', 'chẳng'); return [[this.t, 'amb', { kind: 'low', t1: at('rep', .2) }], [fT - .2, 'marker']]; } },

    // 13 — the replication that found nothing
    { n: 'rep', t: at('rep', .3), tr: 'whip', f(g, lt, T) {
      const t0 = L('rep').t0, stT = wn('rep', 'hiệu');
      ground(g, '#14161F');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1E2333', l: '#12131A', lw: 3 });
      corkBoard(g, 560, 180, 820, 620);
      pinCard(g, 970, 490, 620, 420, -.02, {});
      text(g, 'lặp lại ở Đức', 970, 380, { font: font(800, 52), align: 'center', fill: '#2A2A24' });
      text(g, '504 người', 970, 470, { font: font(900, 76), align: 'center', fill: '#2A2A24' });
      line(g, [[740, 520], [1200, 520]], '#B9AE95', 4);
      text(g, 'hiệu ứng: 0,02', 970, 590, { font: font(800, 46), align: 'center', fill: '#6E6757' });
      stamp(g, 'KHÔNG RA HIỆU ỨNG', 970, 640, { rot: -.06, px: 44, p: seg(T, stT - .1, stT + .2) });
      roi(g, 300, 700, 1.6, { t: T, E: { mo: .3, lookX: .4 } });
      text(g, '23:52', 78, 128, { font: font(900, 66), fill: PAL.muted });
    }, ev() { const stT = wn('rep', 'hiệu'); return [[this.t - .12, 'whoosh'], [this.t, 'paper'], [stT - .1, 'stamp'], [this.t, 'amb', { kind: 'low', t1: at('meta4', .2) }]]; } },

    // 14 — the newer the study, the smaller the effect
    { n: 'meta4', t: at('meta4', .3), f(g, lt, T) {
      const t0 = L('meta4').t0;
      chartScene(g, T, {}, 1, [960, 540], g => {
        sheet(g, 960, 520, 1200, 700, -.01, { grid: true });
        // the scatter: the publication year against the effect
        for (let i = 0; i < 22; i++) {
          const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1;
          const x = 420 + (i / 21) * 1060, y = 300 + a * 250 + b * 90;
          cel(g, ellP(x, y, 11, 11), { f: '#4A5578', s: '#2E3448', so: [2, 2], l: '#12131A', lw: 1.6 });
        }
        line(g, [[420, 320], [1480, 640]], '#8A5A2A', 6);
        line(g, [[420, 690], [1480, 690]], '#8A8274', 4);
        text(g, 'năm công bố', 1480, 764, { font: font(400, 36, 'Patrick Hand'), align: 'right', fill: GREY });
        text(g, 'cỡ hiệu ứng', 330, 300, { font: font(400, 36, 'Patrick Hand'), fill: GREY });
      });
    }, ev() { return [[this.t, 'amb', { kind: 'low', t1: at('turn', .2) }], [this.t + .5, 'marker']]; } },

    // 15 — the punch: the popular explanation gets stamped out
    { n: 'turn', t: at('turn', .3), f(g, lt, T) {
      const t0 = L('turn').t0, stT = wn('turn', 'sai');
      ground(g, '#14161F');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1E2333', s: '#151926', so: [0, 0], l: '#12131A', lw: 3 });
      g.save(); g.translate(960, 470); g.rotate(-.02);
      cel(g, rect(-520, -290, 520, 290), { f: '#E7E1D0', s: '#C4BCA6', so: [12, 16], l: '#2A2A24', lw: 3.4 });
      text(g, 'TÊ LIỆP', -450, -130, { font: font(900, 108), fill: '#2A2A24' });
      text(g, 'QUYẾT ĐỊNH', -450, -6, { font: font(900, 108), fill: '#2A2A24' });
      line(g, [[-450, 54], [140, 54]], '#B9AE95', 6);
      text(g, '?', -450, 200, { font: font(900, 140), fill: '#B9AE95' });
      g.restore();
      stamp(g, 'SAI', 960, 400, { rot: -.14, px: 170, p: seg(T, stT - .05, stT + .2) });
      roi(g, 420, 780, 1.5, { t: T, E: { mo: .6, lookX: .2 } });
    }, ev() { const stT = wn('turn', 'sai'); return [[stT - .7, 'silence', { t: stT - .7, t1: stT + .1 }], [stT - .05, 'stamp'], [this.t, 'music', { cue: 'E' }], [this.t, 'amb', { kind: 'low', t1: at('turn2', .2) }]]; } },

    // 16 — the board: what the fatigue is really made of
    { n: 'board', t: at('turn2', .3), tr: 'iris', f(g, lt, T) {
      const t0 = L('turn2').t0;
      boardScene(g, T, { E: ek(T, [[0, 'determined'], [t0 + 2.4, 'thinking']]), headYaw: .3 },
        1, [960, 540], g => {
          const cards = [[900, 260, 'lựa chọn thứ hai'], [1360, 260, 'hối tiếc'], [900, 620, 'kỳ vọng'], [1360, 620, 'bốn yếu tố']];
          for (const [cx, cy, label] of cards) {
            pinCard(g, cx, cy, 380, 210, (cx % 7) * .01 - .02, {});
            text(g, label, cx, cy + 12, { font: font(800, 44), align: 'center', fill: '#2A2A24' });
          }
          thread(g, 860, 355, 1340, 355); thread(g, 860, 520, 1340, 520);
          thread(g, 1040, 355, 1040, 515); thread(g, 1530, 355, 1530, 515);
          text(g, 'CÁI ĐAU THẬT', 1150, 830, { font: font(900, 66), align: 'center', fill: PAL.hoodie.f });
        });
    }, ev() { return [[this.t, 'paper'], [this.t, 'music', { cue: 'F' }], [this.t, 'amb', { kind: 'room', t1: at('ghost', .2) }]]; } },

    // 17 — the second choice is still lit
    { n: 'ghost', t: at('ghost', .3), f(g, lt, T) {
      const t0 = L('ghost').t0, gT = wn('ghost', 'bỏ');
      chartScene(g, T, { cup: false }, 1, [960, 540], g => {
        jamJar(g, 760, 520, 2.4, 3, 0);
        jamJar(g, 1180, 520, 2.4, 5, ease.out(seg(T, gT - .2, gT + .6)));
        text(g, 'món đã chọn', 760, 830, { font: font(400, 36, 'Patrick Hand'), align: 'center', fill: PAL.muted });
        text(g, 'lựa chọn thứ hai', 1180, 830, { font: font(800, 44), align: 'center', fill: ACCENT.h });
      });
    }, ev() { const gT = wn('ghost', 'bỏ'); return [[this.t, 'amb', { kind: 'room', t1: at('ghost2', .2) }], [gT, 'ting']]; } },

    // 18 — the ones that were left behind
    { n: 'ghost2', t: at('ghost2', .3), f(g, lt, T) {
      const t0 = L('ghost2').t0;
      chartScene(g, T, { cup: false }, 1, [960, 540], g => {
        plate(g, 960, 520, 1.9);
        const spots = [[300, 380], [520, 700], [1420, 380], [1620, 660], [760, 800], [1180, 300]];
        spots.forEach(([x, y], i) => {
          const p = seg(T, t0 + .2 + i * .16, t0 + .6 + i * .16);
          ghostPlate(g, x, y, .95, p);
        });
        text(g, 'những món đã bỏ', 300, 300, { font: font(800, 40), align: 'center', fill: CREAM });
        text(g, 'món đã chọn', 960, 830, { font: font(800, 42), align: 'center', fill: CREAM });
      });
    }, ev() { const t0 = L('ghost2').t0; const r = [[this.t, 'amb', { kind: 'room', t1: at('ghost3', .2) }]]; for (let i = 0; i < 3; i++) r.push([t0 + .3 + i * .2, 'pop']); return r; } },

    // 19 — the road not taken
    { n: 'ghost3', t: at('ghost3', .3), f(g, lt, T) {
      const t0 = L('ghost3').t0, p = seg(T, t0, t0 + .6);
      ground(g, '#14161F');
      S.thought(g, 1160, 420, 300, p);
      // a road that forks into many
      g.save(); g.translate(1160, 420);
      line(g, [[0, 150], [0, 60]], '#4A5578', 9);
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i - 2.5) * .38;
        line(g, [[0, 60], [Math.cos(a) * 190, 60 + Math.sin(a) * 190]], '#4A5578', 7);
        cel(g, ellP(Math.cos(a) * 205, 60 + Math.sin(a) * 205, 13, 13), { f: '#2A3145', l: '#5A6488', lw: 2.4 });
      }
      g.restore();
      kng(g, 520, 900, { s: 1.5, E: expr('sad', { lookY: .2 }), talk: talkAt(T), headPitch: .3 }, T);
    }, ev() { return [[this.t, 'swish'], [this.t, 'amb', { kind: 'room', t1: at('regret', .2) }]]; } },

    // 20 — regret
    { n: 'regret', t: at('regret', .3), f(g, lt, T) {
      const t0 = L('regret').t0;
      ground(g, '#171A24');
      focusLines(g, 900, 460, T, '#222A40', 60, 380);
      kng(g, 900, 790, { s: 2.4, E: ek(T, [[0, 'sad'], [t0 + 2, 'tired']]), headPitch: .35, talk: talkAt(T) }, T);
      bubble(g, 1520, 380, 560, 200, (gg, w, h) => {
        text(gg, 'hối tiếc', 0, 6, { font: font(900, 62), align: 'center', base: 'middle', fill: PAL.violet.f });
      }, { tail: 'right' });
      roi(g, 420, 780, 1.5, { t: T, E: { mo: .2, lookX: .5 } });
    }, ev() { return [[this.t, 'boing'], [this.t, 'amb', { kind: 'low', t1: at('bar', .2) }]]; } },

    // 21 — the expectation rises, the satisfaction does not
    { n: 'bar', t: at('bar', .3), f(g, lt, T) {
      const t0 = L('bar').t0, l1 = wn('bar', 'kỳ'), l2 = wn('bar', 'vọng');
      chartScene(g, T, {}, 1, [960, 540], g => {
        sheet(g, 960, 500, 1240, 700, -.012, { grid: true });
        line(g, [[400, 720], [1520, 720]], '#8A8274', 4);
        line(g, [[400, 720], [400, 230]], '#8A8274', 4);
        // the expectation, rising
        const p1 = ease.out(seg(T, l1 - .2, l1 + 1.1));
        g.save(); g.beginPath(); g.rect(400, 230, 1120, 490); g.clip();
        g.strokeStyle = PAL.hoodie.f; g.lineWidth = 10; g.lineCap = 'round'; g.lineJoin = 'round';
        g.beginPath();
        for (let i = 0; i <= 20; i++) { const u = i / 20 * p1, xx = 400 + u * 1120, yy = 700 - u * 400; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
        g.stroke(); g.restore();
        // the satisfaction, flat
        const p2 = ease.out(seg(T, l2 - .2, l2 + .9));
        g.save(); g.beginPath(); g.rect(400, 230, 1120, 490); g.clip();
        g.strokeStyle = DARKCYAN; g.lineWidth = 10; g.lineCap = 'round';
        g.beginPath();
        for (let i = 0; i <= 20; i++) { const u = i / 20 * p2, xx = 400 + u * 1120, yy = 660 - Math.min(u, p2) * 40; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
        g.stroke(); g.restore();
        text(g, 'kỳ vọng', 1420, 272, { font: font(800, 46), align: 'right', fill: AMBER });
        text(g, 'hài lòng với món đã chọn', 1420, 644, { font: font(800, 42), align: 'right', fill: DARKCYAN });
      });
    }, ev() { const l1 = wn('bar', 'kỳ'); return [[this.t, 'amb', { kind: 'low', t1: at('bar2', .2) }], [l1 - .2, 'marker']]; } },

    // 22 — the ruler: the ideal above, the chosen below
    { n: 'bar2', t: at('bar2', .3), f(g, lt, T) {
      const t0 = L('bar2').t0;
      chartScene(g, T, { cup: false }, 1, [960, 540], g => {
        // the ruler
        cel(g, rect(1180, 200, 1260, 800), { f: '#E0D6BC', s: '#B4A98C', so: [8, 8], l: '#2A2A24', lw: 3 });
        for (let i = 0; i < 10; i++) line(g, [[1180, 250 + i * 55], [1180 + (i % 2 ? 26 : 46), 250 + i * 55]], '#6E6757', 4);
        // the ideal line
        line(g, [[900, 300], [1520, 300]], PAL.hoodie.f, 7);
        text(g, 'món lý tưởng', 1500, 270, { font: font(400, 40, 'Patrick Hand'), align: 'right', fill: PAL.hoodie.f });
        // the chosen dish
        plate(g, 900, 620, 1.6);
        text(g, 'món bạn chọn', 900, 800, { font: font(400, 40, 'Patrick Hand'), align: 'center', fill: PAL.muted });
        // the gap
        line(g, [[1080, 300], [1080, 600]], rgba('#F0525B', .8), 5);
        text(g, 'hụt', 1060, 450, { font: font(900, 46), align: 'right', fill: PAL.red.f });
      });
    }, ev() { return [[this.t, 'amb', { kind: 'low', t1: at('four', .2) }], [this.t + .4, 'marker']]; } },

    // 23 — the four factors
    { n: 'four', t: at('four', .3), f(g, lt, T) {
      const t0 = L('four').t0;
      boardScene(g, T, { E: expr('determined'), headYaw: .35 }, 1, [960, 540], g => {
        text(g, '4 yếu tố', 1150, 200, { font: font(900, 78), align: 'center', fill: PAL.hoodie.f });
        text(g, '99 quan sát · 53 nghiên cứu · 7.202 người', 1150, 262, { font: font(800, 40), align: 'center', fill: CREAM });
        const titles = ['lựa chọn phức tạp', 'nhiệm vụ khó', 'chưa rõ ý mình', 'đi mua hay đi dạo'];
        for (let i = 0; i < 4; i++) {
          const x = 940 + (i % 2) * 480, y = 400 + Math.floor(i / 2) * 300;
          pinCard(g, x, y, 420, 230, .01 * (i - 1), {});
          text(g, titles[i], x, y - 18, { font: font(800, 36), align: 'center', fill: '#2A2A24' });
        }
      });
    }, ev() { return [[this.t, 'paper'], [this.t, 'music', { cue: 'G' }], [this.t, 'amb', { kind: 'room', t1: at('f1', .2) }]]; } },

    // 24 — the four cards, one at a time
    { n: 'factors', t: at('f1', .3), f(g, lt, T) {
      const titles = ['lựa chọn phức tạp', 'nhiệm vụ khó', 'chưa rõ ý mình', 'đi mua hay đi dạo'];
      const subs = ['nhiều món giống nhau', 'nhiều tiêu chí, ít thời gian', 'không biết mình muốn gì', 'mua thì phải quyết, dạo thì không'];
      const ids = ['f1', 'f2', 'f3', 'f4'];
      const cur = ids.findIndex(id => T >= L(id).t0 && T < L(id).t1);
      const idx = cur < 0 ? 3 : cur;
      boardScene(g, T, { E: ek(T, [[0, 'talk'], [wn('f3', 'rõ'), 'thinking']]), headYaw: .3 },
        1, [960, 540], g => {
          for (let i = 0; i < 4; i++) {
            const x = 940 + (i % 2) * 480, y = 300 + Math.floor(i / 2) * 300;
            const p = seg(T, L(ids[i]).t0 - .5, L(ids[i]).t0 + .3);
            if (p <= 0) continue;
            pinCard(g, x, y, 420, 230, .01 * (i - 1), { active: i === idx });
            text(g, titles[i], x, y - 18, { font: font(800, 36), align: 'center', fill: '#2A2A24' });
            text(g, subs[i], x, y + 46, { font: font(400, 30, 'Patrick Hand'), align: 'center', fill: '#6E6757' });
          }
        });
    }, ev() { const r = [[this.t, 'amb', { kind: 'room', t1: at('f5', .2) }]]; for (const id of ['f1', 'f2', 'f3', 'f4']) r.push([L(id).t0 - .4, 'pop']); return r; } },

    // 25 — the reversal: for people who know what they want, more is better
    { n: 'f5', t: at('f5', .3), f(g, lt, T) {
      const t0 = L('f5').t0, bT = wn('f5', 'rõ'), bT2 = wn('f5', 'đảo');
      chartScene(g, T, {}, 1, [960, 540], g => {
        sheet(g, 960, 500, 1240, 700, -.012, { grid: true });
        line(g, [[300, 630], [1620, 630]], '#8A8274', 4);
        const p = ease.out(seg(T, bT, bT + .9)), p2 = ease.out(seg(T, bT2, bT2 + .9));
        cel(g, rect(480, 630, 760, 630 + 160 * p), { f: PAL.red.f, s: '#B22634', so: [0, 8], l: '#12131A', lw: 3 });
        cel(g, rect(1160, 630, 1440, 630 - 190 * p2), { f: PAL.green.f, s: '#2AA85A', so: [0, 8], l: '#12131A', lw: 3 });
        text(g, 'chưa rõ ý mình', 620, 838, { font: font(800, 42), align: 'center', fill: '#B22634' });
        text(g, 'đã rõ ý mình', 1300, 380, { font: font(800, 42), align: 'center', fill: '#2AA85A' });
        text(g, 'b = 0,50', 960, 252, { font: font(900, 64), align: 'center', fill: INK2 });
        text(g, 'hiệu ứng đảo chiều', 960, 314, { font: font(400, 36, 'Patrick Hand'), align: 'center', fill: GREY });
      });
    }, ev() { const bT = wn('f5', 'rõ'); return [[this.t, 'amb', { kind: 'room', t1: at('f6', .2) }], [bT, 'marker']]; } },

    // 26 — Rối objects
    { n: 'f6', t: at('f6', .3), f(g, lt, T) {
      const t0 = L('f6').t0;
      ground(g, '#14161F');
      roi(g, 620, 640, 3.2, { t: T, E: { mo: .5, lookX: .2 } });
      bubble(g, 1330, 420, 820, 260, (gg, w, h) => {
        text(gg, 'CÓ NGƯỜI', 0, -48, { font: font(800, 46), align: 'center', base: 'middle', fill: INK });
        text(gg, 'CẦN NHIỀU HƠN', 0, 14, { font: font(800, 46), align: 'center', base: 'middle', fill: PAL.violet.f });
      });
      text(g, '23:52', 78, 128, { font: font(900, 66), fill: PAL.muted });
    }, ev() { return [[this.t, 'pop'], [this.t + .3, 'boing'], [this.t, 'amb', { kind: 'room', t1: at('model', .2) }]]; } },

    // 27 — the model: satisficing
    { n: 'model', t: at('model', .3), f(g, lt, T) {
      const t0 = L('model').t0, mT = wn('model2', 'Simon');
      chartScene(g, T, {}, 1, [960, 540], g => {
        // the model card
        panel(g, { x: 880, y: 460, w: 1080, h: 460, rot: -.02, tape: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 60, y0 = -ch / 2;
          text(gg, 'SATISFICING', x0, y0 + 150, { font: font(900, 104), fill: PAL.hoodie.f });
          line(gg, [[x0, y0 + 190], [x0 + 700, y0 + 190]], '#4A4436', 5);
          revealText(gg, 'đủ tốt là được', x0, y0 + 280, seg(T, mT - .1, mT + .6), { font: font(400, 44, 'Patrick Hand'), fill: PAL.muted });
          text(gg, 'HERBERT SIMON · 1955', x0, y0 + 370, { font: font(800, 38), fill: CREAM });
        });
      });
    }, ev() { const mT = wn('model2', 'Simon'); return [[this.t, 'paper'], [this.t, 'music', { cue: 'D' }], [this.t, 'amb', { kind: 'room', t1: at('model3', .2) }], [mT - .1, 'marker']]; } },

    // 28 — the funnel: eliminate by aspects
    { n: 'model3', t: at('model3', .3), f(g, lt, T) {
      const t0 = L('model3').t0;
      chartScene(g, T, {}, 1, [960, 540], g => {
        sheet(g, 960, 500, 1240, 720, -.012, { grid: true });
        // the funnel
        const x0 = 620, x1 = 1300, yT = 240, yB = 720;
        g.save(); g.beginPath();
        g.moveTo(x0, yT); g.lineTo(x1, yT); g.lineTo(x1 - 250, yB); g.lineTo(x0 + 250, yB); g.closePath();
        g.clip();
        g.fillStyle = 'rgba(255,183,3,.13)'; g.fill();
        g.strokeStyle = '#6E7A9C'; g.lineWidth = 5; g.stroke();
        // the items dropping out
        for (let i = 0; i < 26; i++) {
          const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1;
          const xx = x0 + 40 + a * (x1 - x0 - 80), yy = yT + 30 + b * 120;
          if (b < .45) continue;
          line(g, [[xx - 26, yy], [xx + 26, yy - 12]], '#C0392B', 5);
        }
        g.restore();
        // the three criteria on the left
        text(g, '3 tiêu chí', 400, 300, { font: font(900, 62), fill: INK2 });
        for (let i = 0; i < 3; i++) {
          const yy = 400 + i * 96;
          cel(g, rect(270, yy - 34, 530, yy + 34), { f: '#EDE7D8', s: '#C9C2B0', so: [6, 7], l: '#2A2A24', lw: 2.4 });
          line(g, [[300, yy], [300 + 150 + i * 40, yy]], '#6E6757', 8);
        }
        // what is left
        plate(g, 960, 762, .9);
        text(g, 'còn lại một món', 960, 840, { font: font(800, 44), align: 'center', fill: AMBER });
      });
    }, ev() { const t0 = L('model3').t0; const r = [[this.t, 'amb', { kind: 'room', t1: at('action', .2) }]]; for (let i = 0; i < 6; i++) r.push([t0 + .5 + i * .25, 'marker']); return r; } },

    // 29 — the three criteria, written by hand
    { n: 'action', t: at('action', .3), f(g, lt, T) {
      const t0 = L('action').t0, w1 = wn('action', 'viết');
      chartScene(g, T, {}, 1, [960, 540], g => {
        sheet(g, 960, 470, 940, 620, .015, {});
        text(g, 'ba tiêu chí', 960, 250, { font: font(800, 52), align: 'center', fill: '#2A2A24' });
        const words = ['nhanh', 'rẻ', 'gần'];
        const under = [220, 150, 190];
        words.forEach((wd, i) => {
          const p = seg(T, w1 + i * .8, w1 + i * .8 + .6);
          revealText(g, wd, 600, 420 + i * 110, p, { font: font(400, 52, 'Patrick Hand'), fill: '#2A2A24' });
          const u = seg(T, w1 + i * .8 + .35, w1 + i * .8 + .7);
          if (u > 0) line(g, [[560, 460 + i * 110], [560 + under[i] * u, 452 + i * 110]], '#2A2A24', 5);
        });
      });
      pencil(g, 1520, 620, -.25, 1);
    }, ev() { const w1 = wn('action', 'viết'); const r = [[this.t, 'paper'], [this.t, 'amb', { kind: 'room', t1: at('action2', .2) }]]; for (let i = 0; i < 3; i++) r.push([w1 + i * .8, 'marker']); return r; } },

    // 30 — the sweep: everything crossed out but one
    { n: 'action3', t: at('action2', .3), f(g, lt, T) {
      const t0 = L('action2').t0, stT = wn('action3', 'gọi');
      chartScene(g, T, {}, 1, [960, 540], g => {
        const crossed = [];
        for (let i = 0; i < 8; i++) if (i !== 5) crossed.push(i);
        menuCard(g, 960, 520, 1080, 660, -.02, { title: 'THỰC ĐƠN', rows: 8, crossed, highlight: 5 });
        text(g, 'còn lại một món', 960, 830, { font: font(400, 40, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      });
      stamp(g, 'GỌI MÓN NÀY', 1370, 640, { rot: .08, px: 56, p: seg(T, stT - .1, stT + .2) });
    }, ev() { const t0 = L('action2').t0, stT = wn('action3', 'gọi'); const r = [[this.t, 'amb', { kind: 'room', t1: at('roi', .2) }]]; for (let i = 0; i < 5; i++) r.push([t0 + .3 + i * .22, 'marker']); r.push([stT - .1, 'stamp']); return r; } },

    // 31 — Rối closes the argument
    { n: 'roi', t: at('roi', .3), f(g, lt, T) {
      const t0 = L('roi').t0;
      ground(g, '#14161F');
      roi(g, 600, 620, 3.2, { t: T, E: { mo: .4, lookX: .1 } });
      bubble(g, 1310, 400, 760, 240, (gg, w, h) => {
        text(gg, 'ĐỦ TỐT', 0, -34, { font: font(900, 62), align: 'center', base: 'middle', fill: PAL.violet.f });
        text(gg, 'LÀ ĐƯỢC', 0, 40, { font: font(900, 62), align: 'center', base: 'middle', fill: PAL.violet.f });
      });
      text(g, '23:52', 78, 128, { font: font(900, 66), fill: PAL.muted });
    }, ev() { return [[this.t, 'pop'], [this.t + .3, 'ting'], [this.t, 'amb', { kind: 'room', t1: at('close', .2) }]]; } },

    // 32 — six minutes later, he eats
    { n: 'close', t: at('close', .3), f(g, lt, T) {
      const t0 = L('close').t0;
      const Ex = ek(T, [[0, 'smile'], [t0 + 2.6, 'happy']]);
      room(g, T, { x: 1180, y: 660, s: 1.25, E: Ex, headYaw: -.12 + sway(T),
        armR: ak(T, [[0, { at: [150, 250] }], [t0 + 1.2, { at: [120, 150], gest: 'hold', rot: .3 }]], .4) },
        1 + seg(lt, 0, 9) * .03, [1180, 430],
        g => {
          plate(g, 1180, 936, 1.15);
          menuCard(g, 1650, 860, 420, 260, .06, { rows: 3, crossed: [0, 1, 2] });
        },
        g => {
          text(g, '23:58', 78, 128, { font: font(900, 66), fill: PAL.muted });
        });
    }, ev() { return [[this.t, 'music', { cue: 'G' }], [this.t, 'amb', { kind: 'room', t1: at('next', .2) }]]; } },

    // 33 — the end card
    { n: 'next', t: at('next', .3), f(g, lt, T) {
      const t0 = L('next').t0, endT = L('next').t1 + .5;
      const Ex = ek(T, [[0, 'talk'], [t0 + 3, 'smile'], [endT + .4, 'happy']]);
      const wave = T > endT + .4, wv = Math.sin((T - endT) * 12) * .28;
      room(g, T, { x: 1250, y: 640, s: 1.15, E: Ex, headYaw: -.1 + sway(T),
        armL: ak(T, [[0, { at: [-140, 250] }], [endT + .4, { at: [-180, -80], gest: 'open', rot: -.1 + (wave ? wv : 0), flip: true }]], .3),
        armR: ak(T, [[0, { at: [140, 250] }]]) }, 1, [1320, 420],
        g => {
          const p = ease.back(seg(T, endT - .1, endT + .35));
          if (p <= 0) return;
          panel(g, { x: 540 - (1 - p) * 900, y: 470, w: 800, h: 520, rot: -.03, tape: true }, (gg, cw, ch) => {
            const x0 = -cw / 2 + 56, y0 = -ch / 2;
            text(gg, 'TRẠM', x0, y0 + 116, { font: font(900, 88), fill: PAL.hoodie.f });
            text(gg, 'NGHĨ NHIỀU', x0, y0 + 216, { font: font(900, 88), fill: PAL.hoodie.f });
            text(gg, 'TẬP SAU', x0, y0 + 300, { font: font(400, 42, 'Patrick Hand'), fill: PAL.muted });
            text(gg, 'Tại sao ta luôn nghĩ mình đúng?', x0, y0 + 396, { font: font(800, 42), fill: CREAM });
            text(gg, 'theo dõi kênh để xem tiếp', x0, y0 + 470, { font: font(400, 36, 'Patrick Hand'), fill: PAL.muted });
          });
        });
    }, ev() { return [[L('next').t1 + .3, 'paper'], [L('next').t1 + .3, 'music', { cue: 'end' }]]; } },
  ];
}

// ——— transitions ———
function drawShot(g, i, T) { const sh = SHOTS[i]; REG.id = sh.n; g.save(); sh.f(g, T - sh.t, T); g.restore(); }
// the words of a smeared frame are drawn sharp again on top: a blurred picture is a look, blurred letters are a mess
function drawSharp(g, texts, dx) {
  for (const t of texts) sharpText(g, t, dx);
}
function smear(g, i, T, dx) {   // whip pan: the frame drawn several times along x (a directional blur)
  const list = REG.list; REG.list = [];
  B.setTransform(1, 0, 0, 1, 0, 0); B.clearRect(0, 0, W, H);
  REG.skip = true; drawShot(B, i, T); REG.skip = false;   // the picture only: the words are painted sharp on top
  const texts = REG.list; REG.list = list;
  const n = 7, step = dx > 0 ? 70 : -70;
  for (let k = 0; k < n; k++) { g.globalAlpha = 1 / (k + 1); g.drawImage(buf, dx - step * k, 0); }
  g.globalAlpha = 1; REG.list = list;
  drawSharp(g, texts, dx);
}

window.render = T => {
  const g = G; g.setTransform(1, 0, 0, 1, 0, 0);
  let i = SHOTS.length - 1; while (i > 0 && T < SHOTS[i].t) i--;
  const sh = SHOTS[i], nx = SHOTS[i + 1], WH = .16;
  if (sh.tr === 'whip' && T - sh.t < WH) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); smear(g, i, T, (1 - ease.out((T - sh.t) / WH)) * W * .5); }
  else if (nx && nx.tr === 'whip' && nx.t - T < WH) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); smear(g, i, T, -ease.inOut(1 - (nx.t - T) / WH) * W * .5); }
  else if (sh.tr === 'iris' && T - sh.t < .55) {
    const list = REG.list; REG.list = null; drawShot(g, i - 1, T); REG.list = list;
    const r = ease.inOut((T - sh.t) / .55) * 1250;
    g.save(); g.beginPath(); g.arc(1000, 560, r, 0, TAU); g.clip(); drawShot(g, i, T); g.restore();
    g.lineWidth = 22; g.strokeStyle = PAL.hoodie.f; g.beginPath(); g.arc(1000, 560, r, 0, TAU); g.stroke();
  } else drawShot(g, i, T);
  // fade in from black at the very start, out at the very end
  const fo = Math.max(1 - T / .25, seg(T, TL.end - .6, TL.end));
  if (fo > 0) { g.fillStyle = `rgba(0,0,0,${fo})`; g.fillRect(0, 0, W, H); }
  for (const c of TL.cues) if (T >= c.t0 && T < c.t1) subtitle(g, c.text);
};
window.TEXTS = T => { REG.list = []; window.render(T); const l = REG.list; REG.list = null; return l; };

async function setup() {
  const j = p => fetch(p).then(r => r.json());
  const [dur, words, lips] = await Promise.all([j('voice/proc/dur.json'), j('voice/words.json'), j('voice/lips.json')]);
  TL = build(dur, words, lips);
  SHOTS = shots();
  for (const sh of SHOTS) for (const [t, type, x] of (sh.ev ? sh.ev() : [])) EV.push({ t: +t.toFixed(3), type, shot: sh.n, ...(x || {}) });
  for (const id in TL.L) EV.push({ t: TL.L[id].t0, type: 'voice', id });
  EV.sort((a, b) => a.t - b.t);
  window.EV = EV; window.DUR = +TL.end.toFixed(2); window.CUES = TL.cues; window.SHOTS = SHOTS.map(s => ({ n: s.n, t: s.t }));
  await Promise.all(['900 40px "Be Vietnam Pro"', '800 40px "Be Vietnam Pro"', '700 40px "Be Vietnam Pro"', '400 40px "Patrick Hand"'].map(f => document.fonts.load(f, 'ẠẾỘữ')));
  window.render(0); window.READY = true;
}
setup();
