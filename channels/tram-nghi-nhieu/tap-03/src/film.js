// "Tại sao ta không tập trung được?" — Tập 03 của kênh Trạm Nghĩ Nhiều (bản dài, khoảng hai mươi phút).
// Shots là hàm của thời gian cục bộ; mọi thời gian đến từ timeline.js (giọng đọc thật).
// Trang hợp đồng: window.render(t), DUR, READY, EV (sự kiện âm thanh), TEXTS(t) (chữ trên hình cho bước đọc), CUES (phụ đề).
import { figure, expr, blendE, PAL, roi } from '../../rig/character.js';
import { cel, path, poly, ellP, line, taper, mix, rgba, canvas, W, H, TAU, rect } from '../../rig/cel.js';
import { ground, panel, hilite, stamp, pip, bubble, subtitle, tag, text, sharpText, font, ease, seg, clamp01, ring, wrap, batteryBig, INK, CREAM, ACCENT, STORY, REG } from '../../rig/broll.js';
import * as S from '../../rig/sets.js';
import { build } from './timeline.js';
import { buildShots } from './shots.js';

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
const lerp = (a, b, u) => a + (b - 0) * u;
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
const BLINKS = []; { let s = 11, t = 1.2; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 1400) { BLINKS.push(t); if (r() < .2) BLINKS.push(t + .28); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < .16) return Math.sin(d / .16 * Math.PI); } return 0; }
function camera(g, z, fx, fy, ox = 0, oy = 0) { g.translate(fx, fy); g.scale(z, z); g.translate(-fx - ox, -fy - oy); }
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id], w = (id, k) => TL.w(id, k);
const talkAt = T => TL.talk(T);
const sway = T => Math.sin(T * .55) * .035;

// ——— the host at his desk: x, y of the neck base on screen ———
function desk(g, T, o, z = 1, f = [1320, 420], cardFn, over, setOpts) {
  ground(g);
  g.save(); camera(g, z, f[0], f[1]);
  const cam = { x: 0, y: 0 };
  S.roomBack(g, T, cam);
  if (cardFn) cardFn(g);
  kng(g, 1250, 640, { s: 1.15, talk: talkAt(T), headRoll: sway(T) * .6, ...o }, T);
  if (over) over(g);
  S.roomFront(g, T, cam, setOpts);
  g.restore();
}
const pipHost = (o, T) => (gg, r) => {
  gg.fillStyle = PAL.bg; gg.fillRect(-r, -r, 2 * r, 2 * r);
  const grd = gg.createRadialGradient(0, 40, 10, 0, 40, r * 1.3);
  grd.addColorStop(0, 'rgba(255,183,3,.18)'); grd.addColorStop(1, 'rgba(255,183,3,0)');
  gg.fillStyle = grd; gg.fillRect(-r, -r, 2 * r, 2 * r);
  gg.save(); gg.translate(0, 112); figure(gg, { s: 1.05, t: T, blink: blink(T), talk: talkAt(T), linePx: 3, ...o }); gg.restore();
};
const popP = (lt, a, b) => lt < b ? seg(lt, a, a + .3) : 1 - seg(lt, b, b + .22);

// ——— the props ———
// a clock face: the hour hand and the minute hand are drawn from the time
function clockFace(g, x, y, r, hh, mm, o = {}) {
  const { face = '#1A1E2C', tick = '#3A4260', hcol = PAL.cream, mcol = PAL.hoodie.f } = o;
  cel(g, ellP(x, y, r, r), { f: face, s: '#12141F', so: [-10, -8], l: '#2A3145', lw: 3 });
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(g, [[x + Math.cos(a) * r * .84, y + Math.sin(a) * r * .84], [x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72]], tick, 3); }
  const ha = -Math.PI / 2 + ((hh % 12) + mm / 60) / 12 * TAU, ma = -Math.PI / 2 + mm / 60 * TAU;
  line(g, [[x, y], [x + Math.cos(ha) * r * .44, y + Math.sin(ha) * r * .44]], hcol, r * .045);
  line(g, [[x, y], [x + Math.cos(ma) * r * .66, y + Math.sin(ma) * r * .66]], mcol, r * .03);
  cel(g, ellP(x, y, r * .055, r * .055), { f: mcol, l: PAL.ink, lw: 2 });
}
// a note card: a sheet of paper with a tape
function note(g, x, y, w, h, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = rgba('#000000', .35); g.fillRect(-w / 2 + 10, -h / 2 + 12, w, h);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: '#F3EFE6', s: '#D8D2C4', so: [0, 10], l: '#B9B2A2', lw: 2.4 });
  g.save(); g.translate(0, -h / 2); g.rotate(-.04); g.fillStyle = 'rgba(255,203,7,.3)'; g.fillRect(-46, -16, 92, 32); g.restore();
  g.restore();
}
// a bar of a chart: the fill grows from the bottom
function bar(g, x, y, w, h, p, col) {
  cel(g, rect(x, y - h, x + w, y), { f: '#1E2333', s: '#171B28', so: [0, 8], l: '#12131A', lw: 2.4 });
  const hh = h * p;
  if (hh > 2) cel(g, rect(x + 6, y - hh + 6, x + w - 6, y - 6), { f: col, s: mix(col, '#000000', .35), so: [0, 5], l: '#12131A', lw: 2 });
}
// a line of text on a card, with the marker highlight sweeping behind it
function hiLine(g, x, y, s, p, col = PAL.hoodie.f, px = 60, seed = 1, fill = PAL.ink) {
  const w = g.measureText(s).width;
  hilite(g, x - 6, y - px * .78, w + 12, px * .96, p, col, seed);
  text(g, s, x, y, { font: font(900, px), fill });
  return w;
}
// the biggest font size at which a string fits a box; the text is never cut by the edge of its card
function fitPx(g, s, maxW, px, weight = 900, floor = 26) {
  g.font = font(weight, px);
  while (px > floor && g.measureText(s).width > maxW) { px -= 2; g.font = font(weight, px); }
  return px;
}

// ——— the beats: the reusable shots ———
// Each beat draws one whole frame. The shot table (shots.js) says which beat, with which words.
const BEATS = {

  // 1 — the host at the desk, talking; one card on the other side of the frame
  talk(g, lt, T, sh) {
    const t0 = L(sh.line).t0, dur = L(sh.line).t1 - L(sh.line).t0;
    const Ex = ek(T, (sh.keys || [[0, 'talk']]).map(k => [k[0] === 'w' ? w(sh.line, k[1]) : k[0], k[2] || k[1]]));
    const z = sh.z || 1 + seg(lt, 0, dur) * .03;
    desk(g, T, {
      E: Ex, headYaw: (sh.yaw ?? -.1) + sway(T), headRoll: sway(T) * .5,
      armL: sh.armL ? ak(T, sh.armL) : undefined, armR: sh.armR ? ak(T, sh.armR) : undefined,
    }, z, sh.f || [1320, 420],
    g => {
      if (!sh.card) return;
      const c = sh.card, p = ease.back(seg(lt, .1, .5));
      if (p <= 0) return;
      g.save(); g.translate(c.x ?? 640, c.y ?? 500); g.scale(p, p); g.rotate(c.rot ?? -.02);
      const cw = c.w ?? 720, ch = c.h ?? 520;
      cel(g, rect(-cw / 2, -ch / 2, cw / 2, ch / 2), { f: '#F3EFE6', s: '#D8D2C4', so: [0, 10], l: '#B9B2A2', lw: 2.4 });
      g.save(); g.translate(0, -ch / 2); g.rotate(-.04); g.fillStyle = 'rgba(255,203,7,.3)'; g.fillRect(-46, -16, 92, 32); g.restore();
      let y = -ch / 2 + (c.pad ?? 96);
      const usable = cw - 108;   // the card's inner width: the text never reaches its edge
      if (c.title) { const px = fitPx(g, c.title, usable, c.titlePx ?? 54); text(g, c.title, -cw / 2 + 54, y, { font: font(900, px), fill: PAL.ink }); y += c.titleGap ?? 74; }
      if (c.sub) { const px = fitPx(g, c.sub, usable, 38, 400, 24); text(g, c.sub, -cw / 2 + 54, y, { font: font(400, px, 'Patrick Hand'), fill: '#5A5348' }); y += c.subGap ?? 64; }
      for (const line of (c.lines || [])) {
        // a highlight can be tied to a word: at: 'line id', k: word index
        const at = typeof line.at === 'string' ? w(line.at, line.k ?? 0) : (line.at ?? t0);
        const pw = seg(T, at, at + .5);
        if (pw <= 0) continue;
        g.globalAlpha = pw;
        // a long line wraps into two lines of the card instead of running past its edge
        g.font = font(900, line.px ?? 46);
        const rows = wrap(g, line.t, usable);
        const px = fitPx(g, rows[0], usable, line.px ?? 46);
        rows.forEach((r, i) => hiLine(g, -cw / 2 + 54, y + i * (px + 8), r, pw, line.col || PAL.hoodie.f, px, (line.seed ?? 3)));
        g.globalAlpha = 1;
        y += (line.gap ?? 66) + (rows.length - 1) * (px + 8);
      }
      g.restore();
    });
  },

  // 2 — one big number, the way the channel shows a figure
  stat(g, lt, T, sh) {
    const t0 = L(sh.line).t0, dur = L(sh.line).t1 - L(sh.line).t0;
    const p = ease.out(seg(lt, .2, 1.2));
    ground(g);
    const cx = 960, cy = 470;
    ring(g, cx, cy, 300, p, sh.col || ACCENT, 26);
    text(g, sh.num, cx, cy + 42, { font: font(900, sh.px ?? 150), align: 'center', fill: CREAM });
    if (sh.unit) text(g, sh.unit, cx, cy + 132, { font: font(400, 44, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    if (sh.label) text(g, sh.label, cx, cy + 340, { font: font(800, 46), align: 'center', fill: sh.labelCol || CREAM });
    if (sh.note) text(g, sh.note, cx, cy + 392, { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    if (sh.pip) pip(g, 1650, 760, 170, popP(lt, .9, dur + .3), pipHost({ E: ek(T, [[0, 'talk'], [t0 + 1, sh.pipE || 'excited']]), headYaw: -.25 }, T));
  },

  // 3 — a chart of bars, each one growing when the voice reaches it
  bars(g, lt, T, sh) {
    const items = sh.items;
    ground(g);
    g.save(); camera(g, sh.z || 1.02, 900, 520);
    if (sh.title) text(g, sh.title, 250, 190, { font: font(800, 46), fill: PAL.muted });
    const base = 760, top = sh.top ?? 380, max = sh.max ?? 1;
    line(g, [[250, base], [1660, base]], '#3A4260', 4);
    items.forEach((it, i) => {
      const at0 = it.at ?? (L(sh.line).t0 + .4 + i * .8);
      const p = ease.out(seg(T, at0, at0 + .9));
      const bw = it.w ?? 240, x = 300 + i * (bw + 90);
      bar(g, x, base, bw, top, p * (it.v / max), it.col || PAL.hoodie.f);
      const lp = fitPx(g, it.label, bw - 8, 38, 800, 20);
      text(g, it.label, x + bw / 2, base + 56, { font: font(800, lp), align: 'center', fill: CREAM });
      if (it.sub) { const sp = fitPx(g, it.sub, bw - 8, 32, 400, 18); text(g, it.sub, x + bw / 2, base + 98, { font: font(400, sp, 'Patrick Hand'), align: 'center', fill: PAL.muted }); }
      if (it.num && p > .55) {
        g.globalAlpha = (p - .55) / .45;
        text(g, it.num, x + bw / 2, base - top * (it.v / max) - 24, { font: font(900, 46), align: 'center', fill: it.numCol || CREAM });
        g.globalAlpha = 1;
      }
    });
    g.restore();
    if (sh.pip) pip(g, 1650, 760, 170, popP(lt, 1.0, (sh.dur ?? 4) + .3), pipHost({ E: ek(T, [[0, 'talk'], [sh.pipAt ?? 1, sh.pipE || 'excited']]), headYaw: -.25 }, T));
  },

  // 4 — a claim on the left, the evidence on the right, and a stamp on the claim
  compare(g, lt, T, sh) {
    const t0 = L(sh.line).t0;
    ground(g);
    const px = (x, w, head, body, col, isClaim) => {
      panel(g, { x, y: 500, w, h: 420, rot: x < 960 ? -.015 : .015, tape: true }, (gg, cw, ch) => {
        const x0 = -cw / 2 + 56, y0 = -ch / 2;
        text(gg, head, x0, y0 + 108, { font: font(800, 40), fill: col });
        const lines = body.split('\n');
        lines.forEach((s, i) => { const px = fitPx(gg, s, cw - 112, i === 0 ? 52 : 44); text(gg, s, x0, y0 + 186 + i * 74, { font: font(900, px), fill: CREAM }); });
      });
    };
    px(600, 780, sh.leftHead, sh.left, sh.leftCol || PAL.red.f);
    px(1340, 780, sh.rightHead, sh.right, sh.rightCol || ACCENT);
    if (sh.stamp) stamp(g, sh.stamp, sh.stampX ?? 600, sh.stampY ?? 700, { rot: -.14, px: sh.stampPx ?? 84, p: seg(T, sh.stampAt ?? t0 + .6, (sh.stampAt ?? t0 + .6) + .25) });
    if (sh.pip) pip(g, 1650, 790, 160, popP(lt, 1.0, (sh.dur ?? 4) + .3), pipHost({ E: ek(T, [[0, 'skeptical'], [sh.stampAt ?? t0 + .6, 'determined']]), headYaw: -.2 }, T));
  },

  // 5 — the phone on the desk, and the notifications that keep opening the door
  phone(g, lt, T, sh) {
    const t0 = L(sh.line).t0;
    ground(g);
    g.save(); camera(g, 1.05, 900, 520);
    // the phone lies on the desk, screen up
    cel(g, rect(640, 560, 1240, 980), { f: '#0E1017', s: '#1B1F2C', so: [0, 10], l: '#12131A', lw: 3 });
    cel(g, rect(662, 582, 1218, 958), { f: '#171B27', l: '#2A3044', lw: 2 });
    sh.notifs.forEach((n, i) => {
      const at = n.at ?? t0 + .4 + i * 1.1, p = ease.out(seg(T, at, at + .35));
      if (p <= 0) return;
      const y = 610 + i * 92;
      g.save(); g.globalAlpha = p; g.translate(662 + (1 - p) * 120, 0);
      cel(g, rect(662, y, 1218, y + 74), { f: n.col || '#232838', s: '#12131A', so: [0, 5], l: '#2E3448', lw: 2 });
      cel(g, ellP(698, y + 37, 20, 20), { f: n.dot || PAL.red.f, l: PAL.ink, lw: 2 });
      const px = fitPx(g, n.t, 1218 - 738 - 16, 34, 700, 20);
      text(g, n.t, 738, y + 48, { font: font(700, px), fill: CREAM });
      g.restore();
    });
    g.restore();
    if (sh.counter) {
      const p = ease.out(seg(T, sh.counter.at, sh.counter.at + .5));
      text(g, sh.counter.t, 960, 300, { font: font(900, 92), align: 'center', fill: sh.counter.col || PAL.red.f });
      if (sh.counter.sub) text(g, sh.counter.sub, 960, 362, { font: font(400, 40, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      if (p > 0) { /* the number is drawn at once; p keeps the beat honest */ }
    }
    if (sh.pip) pip(g, 1650, 780, 165, popP(lt, 1.0, (sh.dur ?? 4) + .3), pipHost({ E: ek(T, [[0, 'talk'], [sh.pipAt ?? 1, sh.pipE || 'worried']]), headYaw: -.22 }, T));
  },

  // 6 — a work day cut into fragments: the strip of blocks
  strip(g, lt, T, sh) {
    const t0 = L(sh.line).t0;
    ground(g);
    if (sh.title) text(g, sh.title, 250, 200, { font: font(800, 46), fill: PAL.muted });
    const x0 = 250, w = 1400, y = 520;
    const total = sh.blocks.reduce((a, b) => a + b.w, 0);
    let x = x0;
    sh.blocks.forEach((b, i) => {
      const bw = w * b.w / total, p = ease.out(seg(T, b.at ?? t0 + i * .5, (b.at ?? t0 + i * .5) + .5));
      if (p > 0) {
        cel(g, rect(x, y, x + bw * p - 6, y + 150), { f: b.col || PAL.hoodie.f, s: mix(b.col || PAL.hoodie.f, '#000000', .35), so: [0, 6], l: PAL.ink, lw: 2 });
        if (b.label && bw > 120) text(g, b.label, x + 16, y + 92, { font: font(800, 32), fill: PAL.ink });
      }
      x += bw;
    });
    // the gaps between the blocks: the cost, drawn as holes
    x = x0;
    sh.blocks.forEach((b, i) => {
      const bw = w * b.w / total; x += bw;
      if (i < sh.blocks.length - 1 && sh.gapLabel) {
        const gx = x - 26;
        line(g, [[gx, y - 40], [gx, y + 190]], PAL.red.f, 3);
        if (i === Math.floor(sh.blocks.length / 2)) text(g, sh.gapLabel, gx, y - 60, { font: font(800, 34), align: 'center', fill: PAL.red.f });
      }
    });
    if (sh.foot) text(g, sh.foot, 960, y + 250, { font: font(400, 40, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    if (sh.pip) pip(g, 1650, 780, 165, popP(lt, 1.0, (sh.dur ?? 4) + .3), pipHost({ E: ek(T, [[0, 'tired'], [sh.pipAt ?? 1, 'flat']]), headYaw: -.2 }, T));
  },

  // 7 — a checklist: the six things to do
  check(g, lt, T, sh) {
    const t0 = L(sh.line).t0, dur = L(sh.line).t1 - t0;
    ground(g);
    // the list is written on a sheet of paper: a frame of nothing but dark ground reads as a black frame
    const x0 = 170, y0 = 150, w = 1120, h = 760;
    note(g, x0 + w / 2, y0 + h / 2, w, h, -.012);
    let y = y0 + 90;
    if (sh.title) { const px = fitPx(g, sh.title, w - 120, 52); text(g, sh.title, x0 + 60, y, { font: font(900, px), fill: PAL.ink }); y += 80; }
    sh.items.forEach((it, i) => {
      const at = it.at ?? t0 + i * .8, p = ease.out(seg(T, at, at + .4));
      if (p <= 0) return;
      const yy = y + i * 120;
      g.save(); g.globalAlpha = p; g.translate((1 - p) * -60, 0);
      cel(g, rect(x0 + 60, yy, x0 + 116, yy + 56), { f: '#F3EFE6', l: '#8A8478', lw: 3 });
      if (p > .8) {
        const q = ease.out(seg(T, at + .3, at + .6));
        g.globalAlpha = p * q;
        line(g, [[x0 + 72, yy + 28], [x0 + 86, yy + 44], [x0 + 104, yy + 12]], PAL.green.f, 7);
        g.globalAlpha = p;
      }
      const px = fitPx(g, it.t, w - 220, 42);
      text(g, it.t, x0 + 150, yy + 42, { font: font(800, px), fill: PAL.ink });
      if (it.s) { const sp = fitPx(g, it.s, w - 220, 32, 400, 22); text(g, it.s, x0 + 150, yy + 84, { font: font(400, sp, 'Patrick Hand'), fill: '#5A5348' }); }
      g.restore();
    });
    if (sh.pip) pip(g, 1650, 790, 160, popP(lt, 1.0, dur + .8), pipHost({ E: ek(T, [[0, 'determined'], [sh.pipAt ?? 1, 'smile']]), headYaw: -.18 }, T));
  },

  // 8 — the three conditions of flow
  flow(g, lt, T, sh) {
    const t0 = L(sh.line).t0;
    ground(g);
    if (sh.title) text(g, sh.title, 960, 220, { font: font(800, 46), align: 'center', fill: PAL.muted });
    sh.items.forEach((it, i) => {
      const at = it.at ?? t0 + i * 1.1, p = ease.back(seg(T, at, at + .5));
      if (p <= 0) return;
      const x = 400 + i * 560;
      g.save(); g.translate(x, 520); g.scale(p, p);
      cel(g, ellP(0, 0, 190, 190), { f: '#232838', s: '#12131A', so: [0, 10], l: '#2E3448', lw: 2.6 });
      text(g, it.n, 0, 24, { font: font(900, 76), align: 'center', base: 'middle', fill: it.col || PAL.hoodie.f });
      text(g, it.t, 0, 250, { font: font(800, 38), align: 'center', fill: CREAM });
      if (it.s) text(g, it.s, 0, 296, { font: font(400, 32, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      g.restore();
    });
    if (sh.pip) pip(g, 1650, 790, 160, popP(lt, 1.0, (sh.dur ?? 4) + .3), pipHost({ E: ek(T, [[0, 'talk'], [sh.pipAt ?? 1, 'excited']]), headYaw: -.25 }, T));
  },

  // 9 — attention as money: the coins that get spent
  money(g, lt, T, sh) {
    const t0 = L(sh.line).t0;
    ground(g);
    const spent = sh.spent ?? 6;
    for (let i = 0; i < spent; i++) {
      const at = t0 + i * .55, p = ease.out(seg(T, at, at + .5));
      if (p <= 0) continue;
      const x = 380 + i * 180, y = 620 - (1 - p) * 120;
      g.save(); g.globalAlpha = p;
      cel(g, ellP(x, y, 52, 52), { f: PAL.hoodie.f, s: PAL.hoodie.s, so: [0, 6], l: PAL.ink, lw: 2.6 });
      text(g, '⏱', x, y + 16, { font: font(900, 46), align: 'center', fill: PAL.ink });
      g.restore();
    }
    if (sh.total) {
      text(g, sh.total, 960, 830, { font: font(900, 54), align: 'center', fill: PAL.red.f });
    }
    if (sh.label) text(g, sh.label, 960, 250, { font: font(800, 46), align: 'center', fill: PAL.muted });
  },

  // 10 — the head close-up with the thoughts drifting away
  head(g, lt, T, sh) {
    const t0 = L(sh.line).t0;
    ground(g);
    g.save(); camera(g, 1.12, 960, 470);
    kng(g, 960, 700, { s: 1.25, crop: 'bust', E: ek(T, [[0, 'tired'], [t0 + 1.4, 'flat']]), headYaw: -.1 + sway(T), talk: talkAt(T) }, T);
    const thoughts = sh.thoughts || ['bữa trưa', 'tin nhắn', 'việc khác'];
    thoughts.forEach((s, i) => {
      // the bubbles start with the shot, so the first one is on screen for its whole life
      const at = T - lt + i * 1.1, u = seg(T, at, at + 3.4);
      if (u <= 0 || u >= 1) return;
      const y = 520 - u * 300, x = 1200 + i * 90 + Math.sin(u * 7 + i) * 26;
      // the bubble is as big as the words in it: a thought that does not fit its bubble is cut in half
      g.font = font(400, 30, 'Patrick Hand');
      const rows = wrap(g, s, 170);
      const wMax = Math.max(...rows.map(t => g.measureText(t).width));
      const r = Math.max(58, wMax / 2 + 22);
      g.globalAlpha = (1 - u) * .95;
      cel(g, ellP(x, y, r, r * .8), { f: '#F3EFE6', s: '#D8D2C4', so: [-7, -6], l: PAL.violet.l, lw: 2.6 });
      cel(g, ellP(x - 18, y + r * .92, r * .16, r * .13), { f: '#F3EFE6', l: PAL.violet.l, lw: 2 });
      const px = Math.min(30, Math.max(21, r * .52));
      rows.forEach((t, k) => text(g, t, x, y + 10 + (k - (rows.length - 1) / 2) * (px + 4), { font: font(400, px, 'Patrick Hand'), align: 'center', base: 'middle', fill: '#3A3428' }));
      g.globalAlpha = 1;
    });
    g.restore();
    // the low battery: the opening device of every episode of the channel, and its clock
    if (sh.battery) {
      const b = sh.battery, lv = lerp(b.from ?? 1, b.to ?? .2, seg(T, t0, t0 + (b.dur ?? 8)));
      batteryBig(g, b.x ?? 300, b.y ?? 380, b.w ?? 250, lv, T);
      text(g, b.label ?? 'pin của tập này', (b.x ?? 300) + (b.w ?? 250) / 2, (b.y ?? 380) + (b.w ?? 250) * .78, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }
    // the label sits above the head, where nothing else is drawn
    if (sh.label) text(g, sh.label, 960, 150, { font: font(400, 44, 'Patrick Hand'), align: 'center', fill: '#C3C9DC' });
  },

  // 11 — the fake slide from the press release, stamped
  myth(g, lt, T, sh) {
    const t0 = L(sh.line).t0, st = sh.stampAt ?? t0 + .8;
    ground(g);
    panel(g, { x: 960, y: 480, w: 1280, h: 560, rot: -.015, tape: true }, (gg, cw, ch) => {
      const x0 = -cw / 2 + 70, y0 = -ch / 2;
      text(gg, sh.head, x0, y0 + 90, { font: font(800, 40), fill: PAL.muted });
      text(gg, sh.claim, x0, y0 + 220, { font: font(900, 74), fill: CREAM });
      if (sh.quote) {
        text(gg, '“' + sh.quote + '”', x0, y0 + 320, { font: font(400, 36, 'Patrick Hand'), fill: PAL.muted });
      }
      if (sh.source) text(gg, sh.source, x0, y0 + 430, { font: font(400, 32, 'Patrick Hand'), fill: '#5A6488' });
    });
    stamp(g, sh.stamp || 'SAI', 1430, 720, { rot: -.15, px: 92, p: seg(T, st, st + .2) });
    if (sh.pip) pip(g, 330, 760, 165, popP(lt, .9, (sh.dur ?? 4) + .3), pipHost({ E: ek(T, [[0, 'skeptical'], [st, 'determined']]), headYaw: -.18 }, T));
  },

  // 12 — Rối warns: one bubble, one question
  roi(g, lt, T, sh) {
    ground(g);
    roi(g, 620, 620, 3.1, { t: T, E: { mo: .5, lookX: .2 } });
    bubble(g, 1240, 420, 880, 340, (gg, w2, h) => {
      text(gg, sh.text, 0, -40, { font: font(800, 50), align: 'center', base: 'middle', fill: INK });
      if (sh.sub) text(gg, sh.sub, 0, 40, { font: font(800, 44), align: 'center', base: 'middle', fill: PAL.violet.f });
    });
  },

  // 13 — a chapter card
  chapter(g, lt, T, sh) {
    const t0 = L(sh.line).t0;
    ground(g);
    // the chapter card is a sheet of paper on the desk: a frame of dark ground only reads as a black frame
    note(g, 900, 520, 1360, 700, -.015);
    const n = sh.n2 || sh.n;
    text(g, n, 330, 640, { font: font(900, 300), fill: PAL.hoodie.f });
    text(g, n, 330, 640, { font: font(900, 300), stroke: '#C98F00', sw: 6, fill: 'rgba(0,0,0,0)' });
    const px = fitPx(g, sh.title, 900, 76);
    text(g, sh.title, 570, 500, { font: font(900, px), fill: PAL.ink });
    text(g, sh.sub, 570, 580, { font: font(400, 42, 'Patrick Hand'), fill: '#5A5348' });
    // the host in the corner, listening
    pip(g, 1650, 790, 160, popP(lt, .8, 3.2), pipHost({ E: ek(T, [[0, 'tired'], [t0 + .8, 'talk']]), headYaw: -.2 }, T));
  },

  // 14 — the closing card
  end(g, lt, T, sh) {
    const t0 = L(sh.line).t0, endT = L(sh.line).t1 + .4;
    const Ex = ek(T, [[0, 'talk'], [t0 + 2, 'smile'], [endT + .4, 'happy']]);
    const wave = T > endT + .4, wv = Math.sin((T - endT) * 12) * .28;
    desk(g, T, { E: Ex, headYaw: -.1 + sway(T),
      armL: ak(T, [[0, { at: [-140, 250] }], [endT + .4, { at: [-180, -80], gest: 'open', rot: -.1 + (wave ? wv : 0), flip: true }]], .3),
      armR: ak(T, [[0, { at: [140, 250] }]]) }, 1, [1320, 420],
    g => {
      const p = ease.back(seg(T, endT - .1, endT + .35));
      if (p <= 0) return;
      panel(g, { x: 560 - (1 - p) * 900, y: 470, w: 780, h: 560, rot: -.03, tape: true }, (gg, cw, ch) => {
        const x0 = -cw / 2 + 56, y0 = -ch / 2;
        text(gg, 'TRẠM', x0, y0 + 120, { font: font(900, 88), fill: PAL.hoodie.f });
        text(gg, 'NGHĨ NHIỀU', x0, y0 + 220, { font: font(900, 88), fill: PAL.hoodie.f });
        text(gg, 'TẬP SAU', x0, y0 + 310, { font: font(400, 42, 'Patrick Hand'), fill: PAL.muted });
        hilite(gg, x0 - 10, y0 + 348, 560, 58, seg(T, endT + .4, endT + .8), PAL.hoodie.f, 5);
        text(gg, 'Tại sao ta sợ thất bại', x0, y0 + 396, { font: font(800, 36), fill: CREAM });
        text(gg, 'hơn cả thành công?', x0, y0 + 440, { font: font(800, 36), fill: CREAM });
        text(gg, 'theo dõi kênh để xem tiếp', x0, y0 + 505, { font: font(400, 36, 'Patrick Hand'), fill: PAL.muted });
      });
    });
  },
};

// ——— the shot table (shots.js) becomes the shot list ———
function shots() {
  const TABLE = buildShots({ L: TL.L, w });
  return TABLE.map(sh => ({
    ...sh,
    // a shot starts at its anchor line, a little before the voice begins
    t: sh.t !== undefined ? sh.t : (TL.L[sh.at] ? TL.L[sh.at].t0 + (sh.off ?? -.3) : 0),
    f: (g, lt, T) => {
      const b = BEATS[sh.beat];
      if (!b) { ground(g); return; }
      b(g, lt, T, sh);
    },
  }));
}

// ——— transitions ———
function drawShot(g, i, T) { const sh = SHOTS[i]; REG.id = sh.n; g.save(); sh.f(g, T - sh.t, T); g.restore(); }
function drawSharp(g, texts, dx) { for (const t of texts) sharpText(g, t, dx); }
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
  // the sound events of a shot are relative to the start of that shot
  for (const sh of SHOTS) for (const [t, type, x] of (sh.ev ? sh.ev() : [])) {
    const ex = { ...(x || {}) };
    if (ex.dur) { ex.t1 = +(sh.t + t + ex.dur).toFixed(3); delete ex.dur; }   // an ambience with a length
    EV.push({ t: +(sh.t + t).toFixed(3), type, shot: sh.n, ...ex });
  }
  for (const id in TL.L) EV.push({ t: TL.L[id].t0, type: 'voice', id });
  EV.sort((a, b) => a.t - b.t);
  window.EV = EV; window.DUR = +TL.end.toFixed(2); window.CUES = TL.cues; window.SHOTS = SHOTS.map(s => ({ n: s.n, t: s.t }));
  await Promise.all(['900 40px "Be Vietnam Pro"', '800 40px "Be Vietnam Pro"', '700 40px "Be Vietnam Pro"', '400 40px "Patrick Hand"'].map(f => document.fonts.load(f, 'ẠẾỘữ')));
  window.render(0); window.READY = true;
}
setup();
