// "Hiệu ứng ánh đèn sân khấu: Không ai để ý bạn nhiều như bạn nghĩ" — Tập 03 của Trạm Nghĩ Nhiều.
// The numbers of the film live on paper: a note taped to the wall of his room, and the sheet lying on
// his wooden desk under the yellow lamp. The café he walks into, and Rối, who names what is happening.
import { figure, expr, blendE, PAL, roi } from '../../../../rig/character.js';
import { cel, path, poly, ellP, line, canvas, W, H, TAU, rect } from '../../../../rig/cel.js';
import { ground, panel, hilite, stamp, pip, bubble, focusLines, subtitle, tag, text, sharpText, font, ease, seg, clamp01, INK, CREAM, ACCENT, REG } from '../../../../rig/broll.js';
import * as S from '../../../../rig/sets.js';
import * as C from './cafe.js';
import * as P from './paper.js';
import { build } from './timeline.js';

const cv = document.getElementById('c'), G = cv.getContext('2d');
const [buf, B] = canvas(W, H);
let TL, SHOTS, EV = [];

// ——— animation tools ———
const E = x => typeof x === 'string' ? expr(x) : expr(x[0], x[1]);
function ek(T, keys, bl = 0.14) {
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const cur = E(keys[i][1]); if (i === 0) return cur;
  const u = seg(T, keys[i][0], keys[i][0] + bl); return u >= 1 ? cur : blendE(E(keys[i - 1][1]), cur, ease.inOut(u));
}
const lerp = (a, b, u) => a + (b - a) * u;
function ak(T, keys, d = 0.34) {
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const c = keys[i][1]; if (i === 0) return c;
  const p = keys[i - 1][1], u = ease.back(seg(T, keys[i][0], keys[i][0] + d)), v = ease.inOut(seg(T, keys[i][0], keys[i][0] + d * 0.7));
  return {
    ...(v < 0.5 ? p : c),
    at: [lerp(p.at[0], c.at[0], u), lerp(p.at[1], c.at[1], u)],
    rot: lerp(p.rot || 0, c.rot || 0, v),
    gest: v < 0.5 ? (p.gest || 'relaxed') : (c.gest || 'relaxed')
  };
}

// blinks: deterministic every 2-5 s
const BLINKS = []; { let s = 17, t = 1.0; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 250) { BLINKS.push(t); if (r() < 0.2) BLINKS.push(t + 0.28); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < 0.16) return Math.sin(d / 0.16 * Math.PI); } return 0; }

function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id], w = (id, k) => TL.w(id, k);
const talkAt = T => TL.talk(T);
const sway = T => Math.sin(T * 0.55) * 0.035;

// ——— the two framings ———
// the room: a note taped to the wall above the desk, the host on the right
const NOTE = { x: 430, y: 640, w: 560, h: 360, rot: -.03 };
// the desk, close: the sheet lies on the wood, under the lamp. The page stays above the subtitle band.
const SHEET = { tl: [336, 528], tr: [1306, 496], bl: [292, 908], br: [1326, 872], w: 970, h: 380 };

// the room, the desk and the yellow lamp — the channel's own set
function room(g, T) {
  ground(g);
  const cam = { x: 0, y: 0 };
  S.roomBack(g, T, cam);
  S.roomFront(g, T, cam);
}

// the wooden desk, close up: the lamp's pool of light on the wood
function deskPlane(g, T) {
  ground(g, '#14172A');
  cel(g, rect(-100, -100, W + 100, 312), { f: '#1A1E2C', s: '#12151F', l: '#12131A', lw: 3 });
  cel(g, rect(-100, 312, W + 100, H + 120), { f: '#3A2A1C', s: '#2A1E14', so: [0, -12], l: '#140E08', lw: 3 });
  for (let i = 0; i < 10; i++) line(g, [[-100, 386 + i * 72], [W + 100, 362 + i * 72]], 'rgba(18,10,4,.32)', 3);
  // the lamp: the shade at the top, the warm pool on the wood
  cel(g, poly([[60, 30], [400, 30], [336, 128], [124, 128]]), { f: '#33394E', s: '#222736', so: [-6, -6], l: PAL.ink, lw: 2.6 });
  cel(g, poly([[84, 114], [376, 114], [362, 142], [98, 142]]), { f: 'rgba(255,217,118,.85)', l: PAL.ink, lw: 2 });
  const grd = g.createRadialGradient(760, 620, 20, 760, 620, 1020);
  grd.addColorStop(0, 'rgba(255,183,3,.22)'); grd.addColorStop(1, 'rgba(255,183,3,0)');
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
}

// a note taped to the wall
function wallNote(g, T, content, o = {}) {
  const p = o.p === undefined ? 1 : o.p;
  const k = ease.back(p);
  g.save();
  g.translate(NOTE.x + (1 - k) * -260, NOTE.y); g.rotate(NOTE.rot);
  P.sheet(g, 0, 0, NOTE.w, NOTE.h, 0, { f: '#F4F0E6' });
  // the tape that holds it up
  g.save(); g.translate(-NOTE.w / 2 + 54, -NOTE.h / 2); g.rotate(-.05);
  g.fillStyle = 'rgba(255,203,7,.22)'; g.fillRect(-44, -15, 88, 30);
  g.strokeStyle = 'rgba(255,203,7,.4)'; g.lineWidth = 1.5; g.strokeRect(-44, -15, 88, 30); g.restore();
  g.save(); g.translate(-NOTE.w / 2, -NOTE.h / 2);
  content(g, NOTE.w, NOTE.h);
  g.restore();
  g.restore();
}

// the sheet on the desk, in perspective
function deskSheet(g, T, content) {
  deskPlane(g, T);
  P.sheetQuad(g, SHEET.tl, SHEET.tr, SHEET.br, SHEET.bl, { f: '#F4F0E6' });
  P.onSheet(g, SHEET, (gg) => content(gg, SHEET.w, SHEET.h));
  // the marker he left on the desk, and the ring of his cup
  P.markerPen(g, 250, 452, -.18, 1.15);
  g.strokeStyle = 'rgba(120,78,40,.28)'; g.lineWidth = 6; g.beginPath(); g.ellipse(1500, 812, 52, 17, .25, 0, TAU); g.stroke();
}

// ——— what is written on the paper, shot by shot (the page is measured: the origin is the top left) ———
function sheetHook(g, w, h, T, t0) {
  const k = w / 970;
  P.shirt(g, w * .22, h * .52, 3.0 * k, { fill: 'rgba(255,255,255,.55)' });
  P.turtle(g, w * .22, h * .52 + 18 * k, .9 * k, { rot: -.12 });
  P.handText(g, 'áo hình con rùa', w * .46, h * .46, { size: Math.max(30, w * .062), p: seg(T, t0 + .3, t0 + .9) });
  P.handText(g, 'mặt thứ ba trong quán', w * .46, h * .66, { size: Math.max(22, w * .045), col: '#6E6A5E', p: seg(T, t0 + .6, t0 + 1.2) });
}

function sheetTitle(g, w, h, T, t0) {
  text(g, 'TRẠM', w * .1, h * .34, { font: font(900, w * .125), fill: PAL.hoodie.f });
  text(g, 'NGHĨ NHIỀU', w * .1, h * .52, { font: font(900, w * .125), fill: PAL.hoodie.f });
  P.handText(g, 'Hiệu ứng ánh đèn sân khấu', w * .11, h * .72, { size: Math.max(26, w * .062), p: seg(T, t0 + .7, t0 + 1.5) });
  text(g, 'TẬP 03', w * .1, h * .92, { font: font(800, Math.max(30, w * .07)), fill: '#2A2F42' });
}

function sheetTerm(g, w, h, T, t0) {
  const k = w / 970;
  P.handNumber(g, 'HIỆU ỨNG ÁNH ĐÈN SÂN KHẤU', w * .5, h * .30, { size: Math.max(40, 50 * k), align: 'center', p: seg(T, t0 + .15, t0 + .95) });
  P.handNumber(g, 'SPOTLIGHT EFFECT', w * .5, h * .48, { size: Math.max(28, 34 * k), align: 'center', col: '#6E6A5E', p: seg(T, t0 + .5, t0 + 1.1) });
  const u = seg(T, t0 + .8, t0 + 1.6);
  if (u > 0) {
    const x0 = w * .2, x1 = x0 + w * .6 * u, y = h * .60;
    g.save(); g.strokeStyle = '#2A2F42'; g.lineWidth = 5 * k; g.lineCap = 'round'; g.beginPath();
    for (let i = 0; i <= 16; i++) { const x = lerp(x0, x1, i / 16), yv = y + Math.sin(i * 1.7) * 4 * k; i ? g.lineTo(x, yv) : g.moveTo(x, yv); }
    g.stroke(); g.restore();
  }
}

function sheetStudy(g, w, h, T, t0) {
  const k = w / 970;
  const x0 = w * .06, x1 = w * .94, y0 = h * .08, y1 = h * .55;
  const rp = seg(T, t0 + .1, t0 + .8);
  if (rp > 0) {
    g.save();
    g.beginPath(); g.rect(x0 - 8, y0 - 8, (x1 - x0 + 16) * Math.min(1, rp * 1.6), y1 - y0 + 16); g.clip();
    g.strokeStyle = '#2A2F42'; g.lineWidth = 5 * k; g.lineJoin = 'round';
    g.strokeRect(x0, y0, x1 - x0, y1 - y0);
    g.restore();
  }
  const tp = seg(T, t0 + .6, t0 + 1.2);
  if (tp > 0) {
    g.save(); g.globalAlpha = tp;
    P.shirt(g, x0 + (x1 - x0) * .1, (y0 + y1) / 2, 1.3 * k, { fill: 'rgba(255,255,255,.6)' });
    P.turtle(g, x0 + (x1 - x0) * .1, (y0 + y1) / 2 + 8 * k, .55 * k);
    g.restore();
  }
  const op = seg(T, t0 + 1.1, t0 + 1.8);
  if (op > 0) {
    g.save(); g.globalAlpha = op; g.strokeStyle = '#2A2F42'; g.lineWidth = 5 * k;
    for (let i = 0; i < 5; i++) {
      const cx = x1 - (x1 - x0) * .3 + i * (x1 - x0) * .062, cy = (y0 + y1) / 2 - h * .02;
      g.beginPath(); g.arc(cx, cy, 20 * k, 0, TAU); g.stroke();
      g.beginPath(); g.moveTo(cx - 18 * k, cy + 58 * k); g.lineTo(cx + 18 * k, cy + 58 * k); g.stroke();
    }
    g.restore();
  }
  P.handText(g, 'người mặc áo', x0 + (x1 - x0) * .1, h * .66, { size: Math.max(24, 30 * k), align: 'center', p: seg(T, t0 + 1.2, t0 + 1.8) });
  P.handText(g, 'người quan sát', x1 - (x1 - x0) * .16, h * .66, { size: Math.max(24, 30 * k), align: 'center', p: seg(T, t0 + 1.4, t0 + 2.0) });
  P.handText(g, 'Cornell', x1 - 220 * k, h * .12, { size: Math.max(26, 32 * k), p: seg(T, t0 + .1, t0 + .7) });
  P.handNumber(g, '2000', x1 - 100 * k, h * .12, { size: Math.max(26, 32 * k), p: seg(T, t0 + .3, t0 + .9) });
}

function sheetGuess(g, w, h, T, t0) {
  const k = w / 970;
  const cx = w * .28, cy = h * .24, r = Math.min(w, h) * .21;
  P.handPie(g, cx, cy, r, .46 * seg(T, t0 + .2, t0 + 1.3), { col: PAL.cyan.f });
  P.handNumber(g, '46 %', cx, h * .62, { size: Math.max(48, 76 * k), align: 'center', p: seg(T, t0 + .5, t0 + 1.1) });
  P.handText(g, 'người mặc áo đoán', cx, h * .78, { size: Math.max(24, 30 * k), align: 'center', p: seg(T, t0 + .6, t0 + 1.2) });
}

function sheetReal(g, w, h, T, t0) {
  const k = w / 970;
  const r = Math.min(w, h) * .21, cy = h * .24;
  const cx = w * .26, bx = w * .74;
  P.handPie(g, cx, cy, r, .46, { col: PAL.cyan.f });
  P.handNumber(g, '46 %', cx, h * .62, { size: Math.max(48, 76 * k), align: 'center' });
  P.handText(g, 'người mặc áo đoán', cx, h * .78, { size: Math.max(24, 30 * k), align: 'center' });
  const bp = seg(T, t0 + .5, t0 + 1.2);
  if (bp > 0) {
    g.save(); g.globalAlpha = bp;
    P.handPie(g, bx, cy, r, .23 * seg(T, t0 + .8, t0 + 1.9), { col: PAL.cyan.f });
    P.handNumber(g, '23 %', bx, h * .62, { size: Math.max(48, 76 * k), align: 'center', p: seg(T, t0 + 1.2, t0 + 1.8) });
    P.handText(g, 'khảo sát thật', bx, h * .78, { size: Math.max(24, 30 * k), align: 'center', p: seg(T, t0 + 1.5, t0 + 2.0) });
    g.restore();
  }
}

function sheetMech(g, w, h, T, t0) {
  const k = w / 970;
  const hx = w * .16, hy = h * .40;
  const p1 = seg(T, t0 + .1, t0 + .7);
  if (p1 > 0) {
    g.save(); g.globalAlpha = p1; g.strokeStyle = '#2A2F42'; g.fillStyle = '#2A2F42'; g.lineWidth = 5 * k;
    g.beginPath(); g.arc(hx, hy, 34 * k, 0, TAU); g.stroke();
    g.beginPath(); g.arc(hx - 12 * k, hy - 4 * k, 4.5 * k, 0, TAU); g.fill();
    g.beginPath(); g.arc(hx + 12 * k, hy - 4 * k, 4.5 * k, 0, TAU); g.fill();
    g.restore();
  }
  P.handText(g, 'tôi', hx, hy + 66 * k, { size: Math.max(24, 30 * k), align: 'center', p: seg(T, t0 + .4, t0 + 1.0) });
  const p2 = seg(T, t0 + .7, t0 + 1.6);
  if (p2 > 0) { g.save(); g.globalAlpha = p2; P.handArrow(g, hx + 48 * k, hy - 20 * k, hx + 300 * k, hy - 90 * k, { w: 6 * k }); g.restore(); }
  P.handText(g, 'cảm giác của chính mình', hx + 180 * k, hy - 120 * k, { size: Math.max(24, 30 * k), align: 'center', p: seg(T, t0 + 1.1, t0 + 1.8) });
  const p3 = seg(T, t0 + 1.6, t0 + 2.3);
  if (p3 > 0) { g.save(); g.globalAlpha = p3; P.handArrow(g, hx + 300 * k, hy - 84 * k, hx + 300 * k, hy + 36 * k, { w: 5 * k }); g.restore(); }
  P.handText(g, 'điều chỉnh', hx + 318 * k, hy - 20 * k, { size: Math.max(24, 30 * k), p: seg(T, t0 + 1.9, t0 + 2.5) });
  const p4 = seg(T, t0 + 2.3, t0 + 3.0);
  if (p4 > 0) {
    g.save(); g.globalAlpha = p4; g.strokeStyle = '#2A2F42'; g.lineWidth = 5 * k; g.setLineDash([12 * k, 10 * k]);
    g.beginPath(); g.moveTo(hx + 220 * k, hy + 86 * k); g.lineTo(hx + 380 * k, hy + 86 * k); g.stroke(); g.setLineDash([]);
    g.restore();
  }
  P.handText(g, 'thực tế', hx + 300 * k, hy + 124 * k, { size: Math.max(24, 30 * k), align: 'center', p: seg(T, t0 + 2.5, t0 + 3.1) });
}

function sheetAnchor(g, w, h, T, t0) {
  const k = w / 970;
  P.handNumber(g, '73 %', w * .07, h * .44, { size: Math.max(56, 104 * k), p: seg(T, t0 + .2, t0 + 1.0) });
  P.handText(g, 'số người được hỏi nói', w * .09, h * .60, { size: Math.max(24, 30 * k), p: seg(T, t0 + .8, t0 + 1.4) });
  P.handText(g, 'họ đã nghĩ tới một con số khác', w * .09, h * .70, { size: Math.max(24, 30 * k), p: seg(T, t0 + 1.1, t0 + 1.7) });
  const bx = w * .76;
  const p2 = seg(T, t0 + 1.5, t0 + 2.2);
  if (p2 > 0) {
    g.save(); g.globalAlpha = p2; g.strokeStyle = '#2A2F42'; g.lineWidth = 5 * k;
    g.beginPath(); g.arc(bx, h * .24, 58 * k, 0, TAU); g.stroke();
    g.restore();
    P.handNumber(g, '?', bx, h * .30, { size: Math.max(36, 60 * k), align: 'center', col: '#2A2F42', p: seg(T, t0 + 1.5, t0 + 2.1) });
    P.handArrow(g, bx, h * .36, bx, h * .66, { w: 5 * k });
  }
  P.handText(g, 'cao hơn', bx + 86 * k, h * .50, { size: Math.max(24, 30 * k), p: seg(T, t0 + 2.0, t0 + 2.6) });
  P.handText(g, 'rồi mới điều chỉnh', bx, h * .78, { size: Math.max(22, 28 * k), align: 'center', col: '#6E6A5E', p: seg(T, t0 + 1.8, t0 + 2.4) });
}

function sheetAction(g, w, h, T, t0) {
  const k = w / 970;
  text(g, 'HÀNH ĐỘNG HÔM NAY', w * .5, h * .26, { font: font(900, Math.max(36, 52 * k)), align: 'center', fill: '#2A2F42' });
  P.handText(g, 'Trước khi rời quán, hãy nhìn xem', w * .5, h * .46, { size: Math.max(28, 38 * k), align: 'center', p: seg(T, t0 + .6, t0 + 1.5) });
  P.handText(g, 'người bên cạnh đang nhìn cái gì.', w * .5, h * .60, { size: Math.max(28, 38 * k), align: 'center', p: seg(T, t0 + 1.3, t0 + 2.2) });
  const p2 = seg(T, t0 + 2.0, t0 + 2.8);
  if (p2 > 0) {
    g.save(); g.globalAlpha = p2; g.strokeStyle = '#2A2F42'; g.lineWidth = 5 * k; g.lineCap = 'round';
    g.beginPath(); g.ellipse(w * .5, h * .74, 66 * k, 32 * k, 0, 0, TAU); g.stroke();
    g.beginPath(); g.arc(w * .5, h * .74, 13 * k, 0, TAU); g.fillStyle = '#2A2F42'; g.fill();
    g.restore();
  }
}

// ——— the shots ———
function shots() {
  const at = (id, d) => L(id).t0 - d;
  return [
    // 1 — The note on the wall: the shirt with the turtle on it
    { n: 'hook', t: 0, f(g, lt, T) {
      const t0 = L('hook').t0;
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      wallNote(g, T, (gg, w, h) => sheetHook(gg, w, h, T, t0), { p: seg(T, 0, .5) });
      kng(g, 1290, 640, {
        s: 1.15, talk: talkAt(T),
        E: ek(T, [[0, 'thinking'], [t0 + 1.4, 'talk']]),
        headYaw: -.1 + sway(T),
        headPitch: .05
      }, T);
      S.roomFront(g, T, cam);
    }, ev: () => [[0, 'amb', { kind: 'room', t1: at('feel', .5) }], [0, 'paper'], [0.15, 'pop']] },

    // 2 — The café: everybody turns to look
    { n: 'feel', t: at('feel', .5), tr: 'whip', f(g, lt, T) {
      const t0 = L('feel').t0;
      const walk = ease.out(seg(T, t0 - .5, t0 + 1.5));
      const px = lerp(210, 690, walk);
      C.cafeBack(g, T, {});
      C.spotlight(g, px, 0, 200, 900, seg(T, t0 - .4, t0 + .6));
      const look = [px, 520];
      C.patron(g, 1480, 890, .7, '#3A4260', { look, ph: T * .8, hair: '#2A3145' });
      C.patron(g, 1790, 890, .66, '#4A4260', { look, ph: T * .6, phone: true, hair: '#3A2E4A' });
      C.patron(g, 1180, 890, .68, '#3A4260', { look, ph: T * .7, cup: true, hair: '#2A3145' });
      kng(g, px, 430, {
        s: 1.12, legs: { mode: 'walk', ph: T * 1.15 },
        E: ek(T, [[0, 'worried'], [t0 + 1.2, 'shocked']]),
        talk: talkAt(T),
        headYaw: .12, headPitch: .1
      }, T);
      C.cafeFront(g, T, {});
    }, ev: () => [[at('feel', .5), 'music', { cue: 'B' }], [at('feel', .5), 'amb', { kind: 'low', t1: at('intro', .45) }], [at('feel', .5), 'whoosh'], [at('feel', .5) + .1, 'pop'], [L('feel').t0 + .2, 'step'], [L('feel').t0 + .7, 'step'], [L('feel').t0 + 1.2, 'step']] },

    // 3 — The card of the channel
    { n: 'intro', t: at('intro', .45), tr: 'whip', f(g, lt, T) {
      const t0 = L('intro').t0;
      const wave = T > t0 - .3 && T < t0 + 1.6, wv = Math.sin((T - t0) * 13) * .28;
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      wallNote(g, T, (gg, w, h) => sheetTitle(gg, w, h, T, t0), { p: seg(T, t0 - .45, t0 + .05) });
      kng(g, 1290, 640, {
        s: 1.15, talk: talkAt(T),
        E: ek(T, [[0, 'smile'], [t0 + 2.2, 'talk']]),
        headYaw: -.1 + sway(T),
        armL: ak(T, [[0, { at: [-140, 250] }], [t0 + .2, { at: [-180, -80], gest: 'open', rot: -.1 + (wave ? wv : 0) }], [t0 + 1.6, { at: [-140, 250] }]], .3)
      }, T);
      S.roomFront(g, T, cam);
      tag(g, 'KẺ NGHĨ NHIỀU', 1540, 790, seg(T, t0 + .3, t0 + .7), { col: PAL.hoodie, px: 34 });
    }, ev: () => [[at('intro', .45), 'music', { cue: 'C' }], [at('intro', .45), 'amb', { kind: 'room', t1: at('nuance', .35) }], [at('intro', .45), 'whoosh'], [at('intro', .45) + .05, 'paper'], [at('intro', .45) + .18, 'pop']] },

    // 4 — The name of the effect, written by hand
    { n: 'term', t: at('term', .4), tr: 'whip', f(g, lt, T) {
      const t0 = L('term').t0;
      deskSheet(g, T, (gg, w, h) => sheetTerm(gg, w, h, T, t0));
    }, ev: () => [[at('term', .4), 'whoosh'], [L('term').t0 + .15, 'marker'], [L('term').t0 + 1.5, 'ting']] },

    // 5 — The room of the experiment, drawn on the sheet
    { n: 'study', t: at('study', .35), tr: 'whip', f(g, lt, T) {
      const t0 = L('study').t0;
      deskSheet(g, T, (gg, w, h) => sheetStudy(gg, w, h, T, t0));
    }, ev: () => [[at('study', .35), 'music', { cue: 'D' }], [at('study', .35), 'whoosh'], [L('study').t0 + .1, 'marker'], [L('study').t0 + 1.3, 'paper']] },

    // 6 — What the shirt-wearer thought: 46 %
    { n: 'guess', t: at('guess', .4), tr: 'whip', f(g, lt, T) {
      const t0 = L('guess').t0;
      deskSheet(g, T, (gg, w, h) => sheetGuess(gg, w, h, T, t0));
    }, ev: () => [[at('guess', .4), 'whoosh'], [L('guess').t0 + .3, 'marker']] },

    // 7 — What the survey found: 23 %
    { n: 'real', t: at('real', .35), tr: 'whip', f(g, lt, T) {
      const t0 = L('real').t0;
      deskSheet(g, T, (gg, w, h) => sheetReal(gg, w, h, T, t0));
      roi(g, 1660, 330, 1.1, { t: T });
    }, ev: () => [[at('real', .35), 'music', { cue: 'E' }], [at('real', .35), 'whoosh'], [L('real').t0 + .5, 'marker'], [L('real').t0 + 1.6, 'pop'], [L('real').t0 + 2.9, 'boing']] },

    // 8 — Rối points at the number and names it
    { n: 'roi', t: at('roi', .35), tr: 'iris', f(g, lt, T) {
      const t0 = L('roi').t0;
      const bp = seg(T, t0 + .3, t0 + .7);
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      wallNote(g, T, (gg, w, h) => sheetReal(gg, w, h, T, t0 - 1));
      kng(g, 1290, 640, {
        s: 1.15, talk: talkAt(T),
        E: ek(T, [[0, 'surprised'], [t0 + 1.6, 'talk']]),
        headYaw: -.14 + sway(T)
      }, T);
      S.roomFront(g, T, cam);
      roi(g, 790, 660, 1.5, { t: T });
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        bubble(g, 1180, 300, 900, 250, (gg, bw, bh) => {
          text(gg, 'Vẫn có người nhìn bạn —', 0, -32, { font: font(800, 46), align: 'center', base: 'middle', fill: INK });
          text(gg, 'chỉ là ít hơn bạn tưởng nhiều.', 0, 34, { font: font(800, 46), align: 'center', base: 'middle', fill: PAL.violet.s });
        });
        g.restore();
      }
    }, ev: () => [[at('roi', .35), 'boing'], [L('roi').t0 + .3, 'pop']] },

    // 9 — The mechanism: the anchor and the short adjustment
    { n: 'mech', t: at('mech', .35), tr: 'whip', f(g, lt, T) {
      const t0 = L('mech').t0;
      deskSheet(g, T, (gg, w, h) => sheetMech(gg, w, h, T, t0));
    }, ev: () => [[at('mech', .35), 'music', { cue: 'F' }], [at('mech', .35), 'whoosh'], [L('mech').t0 + .7, 'marker'], [L('mech').t0 + 1.6, 'marker']] },

    // 10 — The evidence: 73 %
    { n: 'anchor', t: at('anchor', .35), tr: 'whip', f(g, lt, T) {
      const t0 = L('anchor').t0;
      deskSheet(g, T, (gg, w, h) => sheetAnchor(gg, w, h, T, t0));
    }, ev: () => [[at('anchor', .35), 'whoosh'], [L('anchor').t0 + .2, 'marker'], [L('anchor').t0 + 1.6, 'pop']] },

    // 11 — The café again: this time somebody really is looking
    { n: 'nuance', t: at('nuance', .35), tr: 'whip', f(g, lt, T) {
      const t0 = L('nuance').t0;
      const px = 720;
      C.cafeBack(g, T, {});
      C.spotlight(g, px, 0, 220, 900, seg(T, t0 - .3, t0 + .5));
      const bp = seg(T, t0 + .3, t0 + .7);
      C.patron(g, 1230, 890, .68, '#3A4260', { look: [px, 470], ph: T * .7, cup: true, hair: '#2A3145' });
      C.patron(g, 1560, 890, .7, '#4A4260', { look: [1620, 840], ph: T * .6, phone: true, hair: '#3A2E4A' });
      C.patron(g, 1850, 890, .64, '#3A4260', { look: [1900, 860], ph: T * .5, hair: '#2A3145' });
      kng(g, px, 430, {
        s: 1.12, legs: { mode: 'stand' },
        E: ek(T, [[0, 'shocked'], [t0 + 1.2, 'embarrassed']]),
        talk: talkAt(T),
        headYaw: .14, headPitch: .08
      }, T);
      C.cafeFront(g, T, {});
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        bubble(g, 1480, 300, 640, 180, (gg, bw, bh) => {
          text(gg, 'Bạn ơi, cái áo này', 0, -26, { font: font(800, 42), align: 'center', base: 'middle', fill: INK });
          text(gg, 'lạ ghê!', 0, 28, { font: font(800, 42), align: 'center', base: 'middle', fill: INK });
        }, { tail: 'right' });
        g.restore();
      }
    }, ev: () => [[at('nuance', .35), 'music', { cue: 'G' }], [at('nuance', .35), 'amb', { kind: 'low', t1: L('action').t1 + .4 }], [at('nuance', .35), 'whoosh'], [L('nuance').t0 + .3, 'pop'], [L('nuance').t0 + .6, 'step']] },

    // 12 — The note he leaves on the desk
    { n: 'action', t: at('action', .45), tr: 'whip', f(g, lt, T) {
      const t0 = L('action').t0;
      deskSheet(g, T, (gg, w, h) => sheetAction(gg, w, h, T, t0));
    }, ev: () => [[at('action', .45), 'whoosh'], [L('action').t0 + .2, 'marker'], [L('action').t0 + 2.6, 'paper'], [L('action').t1 + .2, 'pop'], [L('action').t1 + .3, 'music', { cue: 'end' }]] }
  ];
}

// ——— transitions ———
function drawShot(g, i, T) { const sh = SHOTS[i]; REG.id = sh.n; g.save(); sh.f(g, T - sh.t, T); g.restore(); }
function drawSharp(g, texts, dx) { for (const t of texts) sharpText(g, t, dx); }
function smear(g, i, T, dx) {
  const list = REG.list; REG.list = [];
  B.setTransform(1, 0, 0, 1, 0, 0); B.clearRect(0, 0, W, H);
  REG.skip = true; drawShot(B, i, T); REG.skip = false;
  const texts = REG.list; REG.list = list;
  const n = 7, step = dx > 0 ? 70 : -70;
  for (let k = 0; k < n; k++) { g.globalAlpha = 1 / (k + 1); g.drawImage(buf, dx - step * k, 0); }
  g.globalAlpha = 1; REG.list = list;
  drawSharp(g, texts, dx);
}

window.render = T => {
  const g = G; g.setTransform(1, 0, 0, 1, 0, 0);
  let i = SHOTS.length - 1; while (i > 0 && T < SHOTS[i].t) i--;
  const sh = SHOTS[i], nx = SHOTS[i + 1], WH = 0.16;
  if (sh.tr === 'whip' && T - sh.t < WH) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); smear(g, i, T, (1 - ease.out((T - sh.t) / WH)) * W * 0.5); }
  else if (nx && nx.tr === 'whip' && nx.t - T < WH) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); smear(g, i, T, -ease.inOut(1 - (nx.t - T) / WH) * W * 0.5); }
  else if (sh.tr === 'iris' && T - sh.t < 0.55) {
    const list = REG.list; REG.list = null; drawShot(g, i - 1, T); REG.list = list;
    const r = ease.inOut((T - sh.t) / 0.55) * 1250;
    g.save(); g.beginPath(); g.arc(1000, 560, r, 0, TAU); g.clip(); drawShot(g, i, T); g.restore();
    g.lineWidth = 22; g.strokeStyle = PAL.hoodie.f; g.beginPath(); g.arc(1000, 560, r, 0, TAU); g.stroke();
  } else drawShot(g, i, T);

  // fade in / fade out at start and end
  const fo = Math.max(1 - T / 0.25, seg(T, TL.end - 0.6, TL.end));
  if (fo > 0) { g.fillStyle = `rgba(0,0,0,${fo})`; g.fillRect(0, 0, W, H); }
  // the end card of the channel
  const cp = seg(T, TL.end - 4.0, TL.end - 3.4);
  if (cp > 0) {
    // the picture fades out under the end card, so the card stands alone
    g.fillStyle = `rgba(18,19,26,${cp})`; g.fillRect(0, 0, W, H);
    g.save(); g.globalAlpha = cp;
    text(g, 'TRẠM NGHĨ NHIỀU', W / 2, 452, { font: font(900, 92), align: 'center', fill: PAL.hoodie.f });
    text(g, 'TẬP 03', W / 2, 524, { font: font(800, 46), align: 'center', fill: CREAM });
    text(g, 'hẹn gặp bạn ở tập sau', W / 2, 606, { font: font(400, 46, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    g.restore();
  }
  const activeCue = TL.cues.findLast(c => T >= c.t0 && T < c.t1);
  if (activeCue) subtitle(g, activeCue.text);
};

window.TEXTS = T => { REG.list = []; window.render(T); const l = REG.list; REG.list = null; return l; };

async function setup() {
  const j = p => fetch(p).then(r => r.ok ? r.json() : {});
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
