// The paper of this episode: the sheet on the desk, the hand-written numbers on it and the doodle of the shirt.
// Everything is drawn as if written with a marker on a napkin — the numbers of the film live here, not in floating boxes.
import { cel, path, poly, ellP, line, mix, rgba, TAU, rect } from '../../../../rig/cel.js';
import { PAL } from '../../../../rig/character.js';
import { text, font, ease } from '../../../../rig/broll.js';

const INK = '#2A2F42';

// ——— a sheet of paper: a soft shadow, a warm white, a coffee ring ———
export function sheet(g, x, y, w, h, rot = 0, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = rgba('#000000', .32); g.fillRect(-w / 2 + 8, -h / 2 + 12, w, h);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: o.f || '#F2EEE4', s: '#D9D3C4', so: [0, 8], l: '#B9B2A2', lw: 2.4 });
  if (o.ring) { g.strokeStyle = 'rgba(120,78,40,.22)'; g.lineWidth = 6; g.beginPath(); g.ellipse(w * .3, h * .22, 46, 15, .3, 0, TAU); g.stroke(); }
  if (o.fold) { line(g, [[-w / 2, 0], [w / 2, 0]], 'rgba(120,110,90,.35)', 2); }
  g.restore();
}

// ——— handwriting: the text is revealed from left to right, as the marker writes it ———
export function handText(g, s, x, y, o = {}) {
  if (o.p !== undefined && o.p <= 0) return 0;
  const size = o.size || 44, fam = o.fam || 'Patrick Hand', weight = o.weight || 400;
  g.save();
  g.font = font(weight, size, fam); g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic';
  const w = g.measureText(s).width;
  const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  if (o.p !== undefined && o.p < 1) {
    const prog = Math.max(0, Math.min(1, o.p));
    g.beginPath(); g.rect(x0 - 4, y - size * 1.2, w * prog + 6, size * 2.4); g.clip();
  }
  text(g, s, x, y, { font: g.font, align: o.align || 'left', base: o.base || 'alphabetic', fill: o.col || INK });
  g.restore();
  return w;
}

// ——— a T-shirt, drawn flat ———
export function shirt(g, x, y, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const ink = o.ink || INK;
  g.strokeStyle = ink; g.lineWidth = 4; g.lineJoin = 'round';
  g.beginPath();
  g.moveTo(-58, -46); g.lineTo(-24, -62); g.quadraticCurveTo(0, -40, 24, -62); g.lineTo(58, -46);
  g.lineTo(74, -6); g.lineTo(46, 4); g.lineTo(42, 74); g.lineTo(-42, 74); g.lineTo(-46, 4); g.lineTo(-74, -6);
  g.closePath();
  if (o.fill) { g.fillStyle = o.fill; g.fill(); }
  g.stroke();
  g.restore();
}

// ——— a sheet of paper lying on the desk, in perspective ———
export function sheetQuad(g, tl, tr, br, bl, o = {}) {
  g.save();
  g.fillStyle = rgba('#000000', .3);
  g.beginPath(); g.moveTo(tl[0] + 6, tl[1] + 12); g.lineTo(tr[0] + 6, tr[1] + 12); g.lineTo(br[0] + 6, br[1] + 12); g.lineTo(bl[0] + 6, bl[1] + 12); g.closePath(); g.fill();
  g.fillStyle = o.f || '#F4F0E6'; g.strokeStyle = o.l || '#B9B2A2'; g.lineWidth = 2.4; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(tl[0], tl[1]); g.lineTo(tr[0], tr[1]); g.lineTo(br[0], br[1]); g.lineTo(bl[0], bl[1]); g.closePath();
  g.fill(); g.stroke();
  g.restore();
}

// ——— draw on a sheet in perspective: the flat page is mapped onto the four corners ———
export function onSheet(g, c, fn) {
  const a = (c.tr[0] - c.tl[0]) / c.w, b = (c.tr[1] - c.tl[1]) / c.w;
  const cc = (c.bl[0] - c.tl[0]) / c.h, d = (c.bl[1] - c.tl[1]) / c.h;
  g.save(); g.setTransform(a, b, cc, d, c.tl[0], c.tl[1]);
  fn(g);
  g.restore();
}

// ——— a number, written big on the paper ———
export function handNumber(g, s, x, y, o = {}) {
  return handText(g, s, x, y, { ...o, fam: 'Be Vietnam Pro', weight: 900 });
}

// ——— a hand-drawn circle with a marked part of it ———
export function handPie(g, cx, cy, r, p, o = {}) {
  const col = o.col || PAL.cyan.f, n = 30;
  const pt = a => [cx + Math.cos(a) * (r + Math.sin(a * 5.3) * 3), cy + Math.sin(a) * (r + Math.cos(a * 3.7) * 3)];
  // the marked part
  if (p > 0) {
    const a1 = -Math.PI / 2, a2 = a1 + TAU * Math.min(1, p);
    const pts = [[cx, cy]];
    for (let i = 0; i <= n; i++) pts.push(pt(a1 + (a2 - a1) * i / n));
    g.save(); g.globalAlpha = .34; g.fillStyle = col; g.fill(path(pts, true)); g.restore();
  }
  // the outline
  const out = [];
  for (let i = 0; i < n; i++) out.push(pt(-Math.PI / 2 + TAU * i / n));
  g.save(); g.strokeStyle = o.ink || INK; g.lineWidth = 4; g.lineJoin = 'round'; g.stroke(path(out, true)); g.restore();
}

// ——— the doodle of the shirt: a turtle, drawn with a marker ———
export function turtle(g, x, y, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(o.rot || 0);
  const ink = o.ink || INK;
  g.strokeStyle = ink; g.lineWidth = 6; g.lineJoin = 'round'; g.lineCap = 'round';
  // the legs and the tail, behind the shell
  for (const [lx, ly] of [[-44, 30], [-18, 38], [22, 36], [46, 28]]) { g.beginPath(); g.ellipse(lx, ly, 20, 13, 0, 0, TAU); g.stroke(); }
  g.beginPath(); g.moveTo(-58, 0); g.quadraticCurveTo(-80, 6, -70, 24); g.stroke();
  // the head
  g.beginPath(); g.ellipse(78, -10, 23, 19, .2, 0, TAU); g.stroke();
  g.beginPath(); g.arc(88, -16, 4, 0, TAU); g.fillStyle = ink; g.fill();
  // the shell
  g.beginPath(); g.ellipse(0, 0, 62, 42, 0, 0, TAU); g.stroke();
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(-34, -26); g.lineTo(-12, 0); g.lineTo(-34, 26);
  g.moveTo(4, -40); g.lineTo(14, 0); g.lineTo(4, 40);
  g.moveTo(38, -24); g.lineTo(14, 0); g.lineTo(38, 24);
  g.stroke();
  g.restore();
}

// ——— the marker in his hand ———
export function markerPen(g, x, y, rot = 0, s = 1) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  cel(g, rect(-46, -13, 30, 13), { f: '#F0F3F7', s: '#C6CBD6', so: [4, 6], l: PAL.ink, lw: 2.4 });
  cel(g, poly([[30, -13], [56, -8], [56, 8], [30, 13]]), { f: '#2A2F42', s: '#1B1F2C', l: PAL.ink, lw: 2.2 });
  cel(g, poly([[52, -7], [68, -3], [68, 3], [52, 7]]), { f: '#8B5CF6', s: '#6B3FC4', l: PAL.ink, lw: 2 });
  g.restore();
}

// ——— an arrow, drawn by hand ———
export function handArrow(g, x0, y0, x1, y1, o = {}) {
  const ink = o.ink || INK, w = o.w || 5;
  g.save(); g.strokeStyle = ink; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round';
  const wob = o.wob === undefined ? 4 : o.wob;
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  g.beginPath();
  g.moveTo(x0, y0);
  g.quadraticCurveTo(mx + wob, my - wob, x1, y1);
  g.stroke();
  const a = Math.atan2(y1 - my, x1 - mx);
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x1 - 22 * Math.cos(a - .5), y1 - 22 * Math.sin(a - .5));
  g.moveTo(x1, y1);
  g.lineTo(x1 - 22 * Math.cos(a + .5), y1 - 22 * Math.sin(a + .5));
  g.stroke();
  g.restore();
}
