// B-roll kit for "Trạm Nghĩ Nhiều": the dark ground, panels, the marker highlight, stamps, the pop-in ring,
// speech bubbles, chapter tags and the subtitles. Everything is flat vector cel: one fill, one hard shadow, a dark line.
import { cel, path, poly, rect, rrect, ellP, line, taper, mix, rgba, W, H, canvas, TAU } from './cel.js';
import { PAL } from './character.js';

export const INK = '#12131A', CREAM = '#FAF8F5';
export const ACCENT = PAL.cyan;      // the highlight colour: one per shot
export const STORY = PAL.violet;     // the topic colour (Rối's purple)
export const ease = {
  out: t => 1 - Math.pow(1 - clamp01(t), 3),
  inOut: t => { t = clamp01(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
  back: t => { t = clamp01(t); const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  in: t => { t = clamp01(t); return t * t; },
};
export function clamp01(t) { return Math.max(0, Math.min(1, t)); }
export const seg = (t, a, b) => clamp01((t - a) / (b - a));

// ——— the ground: a deep slate with a faint grid and a vignette ———
let GRID = null;
function grid() {
  if (GRID) return GRID;
  const [c, x] = canvas(64, 64), d = x.createImageData(64, 64);
  for (let i = 0; i < d.data.length; i += 4) { d.data[i] = d.data[i + 1] = d.data[i + 2] = 255; d.data[i + 3] = 16; }
  x.putImageData(d, 0, 0); GRID = c; return c;
}
export function ground(g, col = PAL.bg) {
  g.fillStyle = col; g.fillRect(-200, -200, W + 400, H + 400);
  g.save(); g.globalAlpha = .5; g.strokeStyle = '#2A2F42'; g.lineWidth = 1;
  for (let x = -200; x < W + 200; x += 96) line(g, [[x, -200], [x, H + 200]], '#1E2333', 1);
  for (let y = -200; y < H + 200; y += 96) line(g, [[-200, y], [W + 200, y]], '#1E2333', 1);
  g.restore();
  // the vignette
  const grd = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .95);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,.42)');
  g.fillStyle = grd; g.fillRect(-200, -200, W + 400, H + 400);
}

// ——— type ———
export function font(w, px, fam = 'Be Vietnam Pro') { return `${w} ${px}px "${fam}"`; }
export const REG = { list: null, id: '', skip: false };
export function reg(g, s, x0, y0, x1, y1, style) {
  if (!REG.list) return;
  const m = g.getTransform(), P = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
  const item = { id: REG.id + ':' + s, text: s, x0: Math.min(...P.map(p => p[0])), y0: Math.min(...P.map(p => p[1])), x1: Math.max(...P.map(p => p[0])), y1: Math.max(...P.map(p => p[1])) };
  // a piece that was drawn through text() also keeps where it was written, so a transition can draw it sharp again
  if (style && style.ax !== undefined) {
    item.ax = m.a * style.ax + m.c * style.ay + m.e;
    item.ay = m.b * style.ax + m.d * style.ay + m.f;
    item.font = style.font; item.align = style.align; item.base = style.base;
    item.fill = style.fill; item.stroke = style.stroke; item.sw = style.sw;
  }
  REG.list.push(item);
}
export function text(g, s, x, y, o = {}) {
  g.font = o.font || font(800, 48); g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic';
  if (REG.list && !o.noreg) {
    const w = g.measureText(s).width, px = parseFloat(/(\d+(\.\d+)?)px/.exec(g.font)[1]), x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    reg(g, s, x0, y - px * .8, x0 + w, y + px * .25, { ax: x, ay: y, font: g.font, align: g.textAlign, base: g.textBaseline, fill: o.fill || CREAM, stroke: o.stroke, sw: o.sw });
  }
  if (REG.skip) return;   // a transition is drawing the picture: the words are painted sharp on top instead
  if (o.stroke) { g.lineJoin = 'round'; g.strokeStyle = o.stroke; g.lineWidth = o.sw || 8; g.strokeText(s, x, y); }
  g.fillStyle = o.fill || CREAM; g.fillText(s, x, y);
  return g.measureText(s).width;
}
export function wrap(g, s, maxW) {
  const words = s.split(' '), out = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur);
  return out;
}

// ——— a dark panel with a hairline border and a soft shadow ———
export function panel(g, o, inner) {
  const { x, y, w, h, rot = 0, f = PAL.panel, l = '#2E3448', tape = false, pin = false, lift = 0 } = o;
  g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = rgba('#000000', .35); g.fillRect(-w / 2 + 10 + lift * 8, -h / 2 + 12 + lift * 10, w, h);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f, s: mix(f, '#000000', .5), so: [0, 10], l, lw: 2.4 });
  if (inner) { g.save(); g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip(); inner(g, w, h); g.restore(); }
  if (tape) { g.save(); g.translate(0, -h / 2); g.rotate(-.04); g.fillStyle = 'rgba(255,203,7,.22)'; g.fillRect(-46, -16, 92, 32); g.strokeStyle = 'rgba(255,203,7,.4)'; g.lineWidth = 1.5; g.strokeRect(-46, -16, 92, 32); g.restore(); }
  if (pin) { cel(g, ellP(0, -h / 2 + 16, 11, 11), { f: PAL.red.f, s: PAL.red.s, so: [-3, -3], l: PAL.red.l, lw: 2 }); g.fillStyle = '#fff'; g.beginPath(); g.arc(-3, -h / 2 + 12, 3, 0, TAU); g.fill(); }
  g.restore();
}

// ——— the marker highlight: a yellow stroke sweeping behind a word ———
export function hilite(g, x, y, w, h, p, col = PAL.hoodie.f, seed = 1) {
  if (p <= 0) return;
  const e = x + w * ease.out(p), wob = k => Math.sin(seed * 9.1 + k * 2.3) * h * .07;
  const top = [], bot = [];
  for (let k = 0; k <= 8; k++) { const xx = x + (e - x) * k / 8; top.push([xx, y + wob(k) + (k === 0 ? h * .1 : 0)]); bot.push([xx, y + h + wob(k + 4) - (k === 0 ? h * .08 : 0)]); }
  g.save(); g.globalAlpha = .88; g.fillStyle = col;
  g.fill(path(top.concat(bot.reverse()), true)); g.restore();
}

// ——— a rubber stamp: rotated, broken ink ———
export function stamp(g, s, x, y, o = {}) {
  const { rot = -.12, px = 54, col = PAL.red.f, p = 1 } = o;
  if (p <= 0) return;
  const k = 1 + (1 - ease.out(p)) * .6;
  const m = document.createElement('canvas').getContext('2d'); m.font = font(900, px);
  const w = m.measureText(s).width, cw = Math.ceil(w + 64), ch = Math.ceil(px * 1.6);
  m.canvas.width = cw; m.canvas.height = ch;
  m.strokeStyle = col; m.lineWidth = 6; m.strokeRect(10, 6, cw - 20, ch - 12);
  m.font = font(900, px); m.fillStyle = col; m.textAlign = 'center'; m.textBaseline = 'middle'; m.fillText(s, cw / 2, ch / 2 + px * .04);
  m.globalCompositeOperation = 'destination-out'; m.fillStyle = 'rgba(0,0,0,.55)';
  for (let i = 0; i < 46; i++) { const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1; m.fillRect(a * cw, b * ch, 5 + (i % 3) * 5, 3); }
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); g.globalAlpha = Math.min(1, p * 3);
  if (p >= 1) reg(g, s, -cw / 2, -ch / 2, cw / 2, ch / 2);
  g.drawImage(m.canvas, -cw / 2, -ch / 2); g.restore();
}

// ——— the pop-in circle: the host in a ring in the corner over b-roll ———
export function pip(g, cx, cy, r, p, draw, ring = PAL.hoodie) {
  if (p <= 0) return;
  const k = ease.back(p);
  g.save(); g.translate(cx, cy); g.scale(k, k);
  g.fillStyle = rgba('#000000', .45); g.beginPath(); g.arc(8, 12, r, 0, TAU); g.fill();
  g.save(); g.beginPath(); g.arc(0, 0, r, 0, TAU); g.clip(); draw(g, r); g.restore();
  g.lineWidth = 12; g.strokeStyle = ring.f; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.stroke();
  g.lineWidth = 3; g.strokeStyle = ring.l; g.beginPath(); g.arc(0, 0, r + 6, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, r - 6, 0, TAU); g.stroke();
  g.restore();
}

// ——— a speech bubble (Rối) ———
export function bubble(g, x, y, w, h, inner, o = {}) {
  const { rot = 0, tail = 'left' } = o;
  g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = rgba('#000000', .35); g.beginPath(); g.roundRect(-w / 2 + 6, -h / 2 + 8, w, h, 26); g.fill();
  g.fillStyle = PAL.cream; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 26); g.fill();
  g.strokeStyle = INK; g.lineWidth = 3.5; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 26); g.stroke();
  const tx = tail === 'left' ? -w / 2 + 26 : w / 2 - 26;
  g.fillStyle = PAL.cream; g.beginPath(); g.moveTo(tx - 18, h / 2 - 4); g.lineTo(tx + 16, h / 2 + 34); g.lineTo(tx + 22, h / 2 - 4); g.closePath(); g.fill();
  g.strokeStyle = INK; g.lineWidth = 3.5; g.stroke();
  g.fillStyle = PAL.cream; g.beginPath(); g.moveTo(tx - 18, h / 2 - 4); g.lineTo(tx + 16, h / 2 + 34); g.lineTo(tx + 22, h / 2 - 4); g.closePath(); g.fill();
  if (inner) { g.save(); g.beginPath(); g.rect(-w / 2 + 20, -h / 2 + 14, w - 40, h - 28); g.clip(); inner(g, w - 60, h - 40); g.restore(); }
  g.restore();
}

// ——— focus lines for the reaction close-up ———
export function focusLines(g, cx, cy, t, col = '#2A2F42', n = 64, r0 = 380) {
  g.save(); g.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const s = Math.sin(i * 91.7 + Math.floor(t * 12) * 3.1) * .5 + .5, a = i / n * TAU + s * .05, w = .006 + s * .01;
    const r1 = r0 + s * 160, r2 = 1500;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    g.lineTo(cx + Math.cos(a - w) * r2, cy + Math.sin(a - w) * r2); g.lineTo(cx + Math.cos(a + w) * r2, cy + Math.sin(a + w) * r2); g.fill();
  }
  g.restore();
}

// ——— redraw a registered text piece sharply ———
// A transition can blur the picture (a whip pan draws the frame several times); the words are drawn again on top,
// so the letters stay readable instead of becoming a stack of ghosts.
export function sharpText(g, t, dx = 0) {
  if (!t || t.ax === undefined || !t.font) return;
  g.save();
  g.font = t.font; g.textAlign = t.align || 'left'; g.textBaseline = t.base || 'alphabetic';
  const x = t.ax + dx, y = t.ay;
  if (t.stroke) { g.lineJoin = 'round'; g.strokeStyle = t.stroke; g.lineWidth = t.sw || 8; g.strokeText(t.text, x, y); }
  g.fillStyle = t.fill || CREAM; g.fillText(t.text, x, y);
  g.restore();
}

// ——— the subtitles: cream on dark, bottom centre, at most two lines ———
export function subtitle(g, s, a = 1) {
  if (!s || a <= 0) return;
  g.save(); g.globalAlpha = a; g.font = font(700, 44); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  const lines = wrap(g, s, 1400);
  lines.forEach((ln, i) => {
    const y = H - 66 - (lines.length - 1 - i) * 58;
    g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = 11; g.strokeText(ln, W / 2, y);
    g.fillStyle = '#FFFDF7'; g.fillText(ln, W / 2, y);
  });
  g.restore();
}

// ——— a chapter tag: a slanted label, top left ———
export function tag(g, s, x, y, p, o = {}) {
  const { col = PAL.hoodie, px = 36, rot = -.04, ink = INK } = o;
  if (p <= 0) return;
  const k = ease.back(p);
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k);
  g.font = font(900, px); const w = g.measureText(s).width + 56;
  cel(g, rect(-w / 2, -px * .78, w / 2 - 18, px * .78),
    { f: col.f, s: col.s, so: [0, -8], l: col.l, lw: 3 });
  g.fillStyle = ink; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(s, -9, px * .06);
  if (REG.list) reg(g, s, -w / 2 - 9, -px * .78, w / 2 - 9, px * .78);
  g.restore();
}

// ——— a progress ring (for the 47% figure) ———
export function ring(g, cx, cy, r, p, col = ACCENT, lw = 22) {
  g.save(); g.lineCap = 'round';
  g.strokeStyle = '#252A3C'; g.lineWidth = lw; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
  g.strokeStyle = col.f; g.lineWidth = lw; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * clamp01(p)); g.stroke();
  g.restore();
}

// ——— the low-battery big icon (the cold open) ———
export function batteryBig(g, x, y, w, level, t) {
  const h = w * .55, lv0 = Math.max(0, Math.min(1, level));
  cel(g, rect(x, y, x + w, y + h), { f: '#1F2331', s: '#12131A', l: lv0 < .25 ? PAL.red.f : '#5A6488', lw: 5 });
  cel(g, rect(x + w, y + h * .3, x + w + w * .13, y + h * .7), { f: lv0 < .25 ? PAL.red.f : '#5A6488', l: lv0 < .25 ? PAL.red.f : '#5A6488', lw: 4 });
  const lv = Math.max(0, Math.min(1, level));
  if (lv > 0) {
    const blink = lv < .25 ? (Math.sin(t * 8) > 0 ? 1 : .2) : 1;
    g.globalAlpha = blink;
    cel(g, rect(x + 10, y + 10, x + 10 + (w - 20) * lv, y + h - 10),
      { f: lv < .25 ? PAL.red.f : PAL.green.f, l: PAL.red.l, lw: 3 });
    g.globalAlpha = 1;
  }
}
