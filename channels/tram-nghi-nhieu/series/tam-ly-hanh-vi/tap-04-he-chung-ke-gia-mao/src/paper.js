// The evidence page of this episode: the sheet lying on the desk under the yellow lamp, the handwriting
// on it, and the diagrams the host draws while he talks. Everything is ink on paper — the numbers of the
// film live here, never in floating boxes.
import { cel, path, poly, ellP, line, mix, rgba, TAU, rect } from '../../../../rig/cel.js';
import { PAL } from '../../../../rig/character.js';
import { text, revealText, font, ease, seg, ambientMotes } from '../../../../rig/broll.js';

export const INK = '#2A2F42';
export const PAPER = '#F2EEE4';
export const PAGE = { x: 148, y: 84, w: 1624, h: 748 };   // the sheet, frontal, on the desk

// ——— the desk under the lamp, with the sheet on it ———
export function deskScene(g, T, o = {}) {
  g.fillStyle = '#14172A'; g.fillRect(-100, -100, 2020, 1280);
  cel(g, rect(-100, -100, 2020, 250), { f: '#1A1E2C', s: '#12151F', l: '#12131A', lw: 3 });
  cel(g, rect(-100, 250, 2020, 1180), { f: '#3A2A1C', s: '#2A1E14', so: [0, -12], l: '#140E08', lw: 3 });
  for (let i = 0; i < 12; i++) line(g, [[-100, 320 + i * 74], [2020, 296 + i * 74]], 'rgba(18,10,4,.32)', 3);
  // the lamp: the shade at the top, the warm pool on the wood
  cel(g, poly([[40, -40], [420, -40], [352, 70], [108, 70]]), { f: '#33394E', s: '#222736', so: [-6, -6], l: PAL.ink, lw: 2.6 });
  cel(g, poly([[66, 56], [394, 56], [378, 86], [82, 86]]), { f: 'rgba(255,217,118,.8)', l: PAL.ink, lw: 2 });
  const lampPulse = Math.sin(T * 1.8) * 0.025;
  const grd = g.createRadialGradient(820, 430, 40, 820, 430, 1150);
  grd.addColorStop(0, `rgba(255,183,3,${0.20 + lampPulse})`); grd.addColorStop(1, 'rgba(255,183,3,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 1920, 1080);
  ambientMotes(g, T, 12, { x0: 240, y0: 120, x1: 1680, y1: 840 });
  // the marker and the coffee ring on the wood
  if (o.marker !== false) markerPen(g, 1700, 880, -.22, 1.25);
  g.strokeStyle = 'rgba(120,78,40,.26)'; g.lineWidth = 6; g.beginPath(); g.ellipse(120, 900, 54, 18, .25, 0, TAU); g.stroke();
}

// the sheet itself
export function sheet(g, T, o = {}) {
  const p = o.p === undefined ? 1 : o.p;
  const k = ease.back(Math.max(0, Math.min(1, p)));
  g.save();
  g.translate(PAGE.x + PAGE.w / 2, PAGE.y + PAGE.h / 2);
  g.scale(.96 + .04 * k, .96 + .04 * k);
  g.translate(-PAGE.w / 2, -PAGE.h / 2);
  g.fillStyle = rgba('#000000', .34); g.fillRect(6, 14, PAGE.w, PAGE.h);
  cel(g, rect(0, 0, PAGE.w, PAGE.h), { f: PAPER, s: '#D9D3C4', so: [0, 8], l: '#B9B2A2', lw: 2.6 });
  // the tape at the top corner
  g.save(); g.translate(PAGE.w - 90, -18); g.rotate(-.06);
  g.fillStyle = 'rgba(255,203,7,.22)'; g.fillRect(-48, -16, 96, 32);
  g.strokeStyle = 'rgba(255,203,7,.4)'; g.lineWidth = 1.5; g.strokeRect(-48, -16, 96, 32); g.restore();
  g.restore();
}

// draw inside the sheet, in page coordinates
export function withPage(g, fn) {
  g.save();
  g.translate(PAGE.x, PAGE.y);
  fn(g);
  g.restore();
}

// ——— writing on the sheet ———
export function pTitle(g, s, x, y, o = {}) {
  const size = o.size || 60, col = o.col || INK;
  return revealText(g, s, x, y, o.p === undefined ? 1 : o.p, {
    font: font(900, size), fill: col, align: o.align || 'left', base: o.base || 'alphabetic'
  });
}
export function pHand(g, s, x, y, o = {}) {
  const size = o.size || 34, col = o.col || INK;
  return revealText(g, s, x, y, o.p === undefined ? 1 : o.p, {
    font: font(o.weight || 400, size, 'Patrick Hand'), fill: col, align: o.align || 'left', base: o.base || 'alphabetic'
  });
}
export function pNum(g, s, x, y, o = {}) {
  const size = o.size || 96, col = o.col || INK;
  return revealText(g, s, x, y, o.p === undefined ? 1 : o.p, {
    font: font(900, size), fill: col, align: o.align || 'left', base: o.base || 'alphabetic'
  });
}
export function pNote(g, s, x, y, o = {}) {
  // a small note in the margin, in a different ink
  const size = o.size || 28, col = o.col || '#6E6A5E';
  return revealText(g, s, x, y, o.p === undefined ? 1 : o.p, {
    font: font(400, size, 'Patrick Hand'), fill: col, align: o.align || 'left', base: o.base || 'alphabetic'
  });
}
// a ruled line of the notebook
export function pRule(g, y, x0, x1, o = {}) {
  g.save(); g.strokeStyle = o.col || 'rgba(60,66,88,.22)'; g.lineWidth = o.lw || 2; g.lineCap = 'round';
  g.beginPath();
  const n = 14;
  for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; const yy = y + Math.sin(i * 1.9) * 1.6; i ? g.lineTo(x, yy) : g.moveTo(x, yy); }
  g.stroke(); g.restore();
}
// a hand-drawn check mark or a cross
export function pMark(g, x, y, o = {}) {
  const s = o.s || 30, col = o.col || PAL.green.f, kind = o.kind || 'check';
  if (o.p !== undefined && o.p <= 0) return;
  g.save(); g.strokeStyle = col; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath();
  if (kind === 'check') { g.moveTo(x - s * .5, y); g.lineTo(x - s * .1, y + s * .38); g.lineTo(x + s * .55, y - s * .42); }
  else { g.moveTo(x - s * .4, y - s * .4); g.lineTo(x + s * .4, y + s * .4); g.moveTo(x + s * .4, y - s * .4); g.lineTo(x - s * .4, y + s * .4); }
  g.stroke(); g.restore();
}
// a hand-drawn arrow
export function pArrow(g, x0, y0, x1, y1, o = {}) {
  const w = o.w || 5, col = o.col || INK, p = o.p === undefined ? 1 : o.p;
  if (p <= 0) return;
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
  const ex = x1 - dx / len * 26, ey = y1 - dy / len * 26;
  g.save(); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(ex, ey); g.stroke();
  const a = Math.atan2(dy, dx);
  g.beginPath();
  g.moveTo(x1, y1); g.lineTo(x1 - 24 * Math.cos(a - .45), y1 - 24 * Math.sin(a - .45));
  g.moveTo(x1, y1); g.lineTo(x1 - 24 * Math.cos(a + .45), y1 - 24 * Math.sin(a + .45));
  g.stroke(); g.restore();
}
// a gear, drawn with a marker
export function pGear(g, cx, cy, r, teeth, rot, o = {}) {
  const col = o.col || INK, lw = o.lw || 6, p = o.p === undefined ? 1 : o.p;
  if (p <= 0) return;
  g.save(); g.translate(cx, cy); g.rotate(rot);
  g.strokeStyle = col; g.lineWidth = lw; g.lineJoin = 'round';
  g.beginPath();
  const R = r, r0 = r * .74;
  for (let i = 0; i < teeth; i++) {
    const a0 = i / teeth * TAU, a1 = (i + .42) / teeth * TAU, a2 = (i + .58) / teeth * TAU, a3 = (i + 1) / teeth * TAU;
    const pt = (a, rr) => [Math.cos(a) * rr, Math.sin(a) * rr];
    const q0 = pt(a0, R), q1 = pt(a1, R), q2 = pt(a2, r0), q3 = pt(a3, r0), q4 = pt(a3, R);
    if (i === 0) g.moveTo(q0[0], q0[1]); else g.lineTo(q0[0], q0[1]);
    g.lineTo(q1[0], q1[1]); g.lineTo(q2[0], q2[1]); g.lineTo(q3[0], q3[1]); g.lineTo(q4[0], q4[1]);
  }
  g.closePath(); g.stroke();
  g.beginPath(); g.arc(0, 0, r * .22, 0, TAU); g.stroke();
  g.restore();
}
// a T-shirt, drawn flat
export function pTshirt(g, x, y, s, o = {}) {
  const col = o.col || '#D8434F', p = o.p === undefined ? 1 : o.p;
  if (p <= 0) return;
  g.save(); g.translate(x, y); g.scale(s * p, s * p);
  g.strokeStyle = INK; g.lineWidth = 6; g.lineJoin = 'round';
  g.beginPath();
  g.moveTo(-64, -50); g.lineTo(-26, -68); g.quadraticCurveTo(0, -42, 26, -68); g.lineTo(64, -50);
  g.lineTo(82, -6); g.lineTo(51, 4); g.lineTo(47, 82); g.lineTo(-47, 82); g.lineTo(-51, 4); g.lineTo(-82, -6);
  g.closePath();
  g.fillStyle = col; g.fill(); g.stroke();
  g.restore();
}
// the marker in his hand
export function markerPen(g, x, y, rot = 0, s = 1) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  cel(g, rect(-46, -13, 30, 13), { f: '#F0F3F7', s: '#C6CBD6', so: [4, 6], l: PAL.ink, lw: 2.4 });
  cel(g, poly([[30, -13], [56, -8], [56, 8], [30, 13]]), { f: '#2A2F42', s: '#1B1F2C', l: PAL.ink, lw: 2.2 });
  cel(g, poly([[52, -7], [68, -3], [68, 3], [52, 7]]), { f: '#8B5CF6', s: '#6B3FC4', l: PAL.ink, lw: 2 });
  g.restore();
}
// the open notebook: two ruled pages and a spine
export function notebook(g, x, y, w, h, o = {}) {
  const p = o.p === undefined ? 1 : o.p;
  const k = ease.back(Math.max(0, Math.min(1, p)));
  g.save(); g.translate(x, y); g.scale(k, k);
  g.fillStyle = rgba('#000000', .35); g.fillRect(-w / 2 + 8, -h / 2 + 14, w, h);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: '#F6F2E8', s: '#DCD6C7', so: [0, 8], l: '#B9B2A2', lw: 2.6 });
  cel(g, rect(-12, -h / 2, 12, h / 2), { f: '#D6CFBE', s: '#C3BBA8', l: '#A9A190', lw: 2 });
  for (let i = 1; i <= 6; i++) {
    const yy = -h / 2 + i * h / 7;
    g.save(); g.strokeStyle = 'rgba(60,66,88,.20)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(-w / 2 + 30, yy); g.lineTo(w / 2 - 30, yy); g.stroke(); g.restore();
  }
  g.restore();
}
// a balance scale: the beam tilts
export function balance(g, cx, cy, s, tilt, o = {}) {
  const col = o.col || INK, lw = o.lw || 6;
  g.save(); g.translate(cx, cy); g.scale(s, s);
  g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(0, 120); g.lineTo(0, -40); g.stroke();
  g.beginPath(); g.moveTo(-70, 120); g.lineTo(70, 120); g.stroke();
  g.save(); g.rotate(tilt);
  g.beginPath(); g.moveTo(-190, -40); g.lineTo(190, -40); g.stroke();
  for (const sx of [-190, 190]) { g.beginPath(); g.moveTo(sx, -40); g.lineTo(sx, 10); g.stroke(); g.beginPath(); g.ellipse(sx, 24, 62, 18, 0, 0, TAU); g.stroke(); }
  g.restore();
  g.restore();
}
// a wall clock face with the hands at a given hour
export function clockFace(g, cx, cy, r, hour, o = {}) {
  const col = o.col || INK, lw = o.lw || 6;
  g.save();
  g.strokeStyle = col; g.lineWidth = lw;
  g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.beginPath(); g.moveTo(cx + Math.cos(a) * r * .82, cy + Math.sin(a) * r * .82); g.lineTo(cx + Math.cos(a) * r * .94, cy + Math.sin(a) * r * .94); g.stroke(); }
  const ha = (hour % 12) / 12 * TAU - Math.PI / 2, ma = (hour % 1) / 1 * TAU - Math.PI / 2;
  g.lineWidth = lw * .9; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ha) * r * .5, cy + Math.sin(ha) * r * .5); g.stroke();
  g.lineWidth = lw * .7; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ma) * r * .74, cy + Math.sin(ma) * r * .74); g.stroke();
  g.fillStyle = col; g.beginPath(); g.arc(cx, cy, 7, 0, TAU); g.fill();
  g.restore();
}

// ——— tactile physical metaphors ———
export function pTrophy(g, cx, cy, s = 1, o = {}) {
  const p = o.p === undefined ? 1 : o.p;
  if (p <= 0) return;
  g.save(); g.translate(cx, cy); g.scale(s * p, s * p);
  // base
  cel(g, rect(-44, 70, 44, 94), { f: '#2A1E14', s: '#1A120B', so: [0, 4], l: '#140E08', lw: 2.6 });
  cel(g, rect(-32, 54, 32, 70), { f: '#3E2E1E', s: '#2A1E14', l: '#140E08', lw: 2 });
  // stem
  cel(g, rect(-10, 20, 10, 54), { f: '#FFD700', s: '#D4AF37', l: INK, lw: 2.4 });
  // cup body
  cel(g, poly([[-36, -34], [36, -34], [28, 20], [-28, 20]]), { f: '#FFD700', s: '#E5C100', so: [3, 3], l: INK, lw: 2.8 });
  // cup rim
  cel(g, ellP(0, -34, 38, 10), { f: '#FFE853', s: '#D4AF37', l: INK, lw: 2.4 });
  // handles
  g.strokeStyle = INK; g.lineWidth = 4;
  g.beginPath(); g.arc(-36, -10, 18, -Math.PI / 2, Math.PI / 2, true); g.stroke();
  g.beginPath(); g.arc(36, -10, 18, -Math.PI / 2, Math.PI / 2, false); g.stroke();
  // optional cloth covering
  if (o.cloth > 0) {
    const cp = ease.inOut(Math.min(1, o.cloth));
    g.save(); g.globalAlpha = cp;
    cel(g, poly([[-55, -45], [55, -45], [45, 60], [-45, 60]]), { f: '#4A4260', s: '#352F47', l: INK, lw: 3 });
    g.restore();
  }
  g.restore();
}

export function pHighJump(g, cx, cy, s = 1, o = {}) {
  const p = o.p === undefined ? 1 : o.p;
  if (p <= 0) return;
  g.save(); g.translate(cx, cy); g.scale(s * p, s * p);
  // two vertical posts
  line(g, [[-160, 100], [-160, -120]], INK, 6);
  line(g, [[160, 100], [160, -120]], INK, 6);
  line(g, [[-190, 100], [-130, 100]], INK, 5);
  line(g, [[130, 100], [190, 100]], INK, 5);
  for (let y = -100; y <= 80; y += 30) {
    line(g, [[-160, y], [-146, y]], '#6E6A5E', 2.4);
    line(g, [[146, y], [160, y]], '#6E6A5E', 2.4);
  }
  const barY = 40 - (o.raise || 0) * 110;
  cel(g, rect(-164, barY - 6, 164, barY + 6), { f: PAL.red.f, s: PAL.red.s, l: INK, lw: 2.6 });
  if ((o.raise || 0) > 0) {
    line(g, [[0, -160], [0, barY - 6]], '#8B5CF6', 4);
    cel(g, ellP(0, barY - 10, 12, 8), { f: '#A78BFA', l: INK, lw: 2 });
  }
  g.restore();
}

export function pTreadmill(g, cx, cy, s = 1, o = {}) {
  const p = o.p === undefined ? 1 : o.p;
  if (p <= 0) return;
  g.save(); g.translate(cx, cy); g.scale(s * p, s * p);
  cel(g, poly([[-180, 80], [160, 60], [180, 88], [-160, 108]]), { f: '#252A3C', s: '#1A1E2C', l: INK, lw: 3 });
  cel(g, ellP(-160, 94, 20, 14), { f: '#3E4665', l: INK, lw: 2 });
  cel(g, ellP(160, 74, 20, 14), { f: '#3E4665', l: INK, lw: 2 });
  line(g, [[140, 70], [140, -40], [100, -40]], INK, 5);
  const t = o.t || 0;
  const leg = Math.sin(t * 12) * 26;
  line(g, [[-20, 30], [-20 + leg, 76]], INK, 5);
  line(g, [[-20, 30], [-20 - leg, 76]], INK, 5);
  line(g, [[-20, 30], [-10, -20]], INK, 6);
  cel(g, ellP(-8, -44, 22, 22), { f: PAL.skin.f, l: INK, lw: 2.6 });
  cel(g, poly([[-2, -56], [16, -50], [14, -30], [-4, -32]]), { f: '#FFFFFF', s: '#DCD6C8', l: INK, lw: 2 });
  if (o.crack > 0) {
    line(g, [[2, -50], [8, -42], [4, -34]], PAL.red.f, 2.4);
  }
  g.restore();
}

export function pWaxSeal(g, cx, cy, s = 1, o = {}) {
  const p = o.p === undefined ? 1 : o.p;
  if (p <= 0) return;
  const k = ease.back(Math.min(1, p));
  g.save(); g.translate(cx, cy); g.scale(s * k, s * k);
  cel(g, ellP(0, 0, 48, 44), { f: '#DC2626', s: '#991B1B', so: [2, 4], l: '#7F1D1D', lw: 3 });
  cel(g, ellP(0, 0, 36, 32), { f: '#B91C1C', l: '#7F1D1D', lw: 2 });
  text(g, 'ĐÚNG', 0, 8, { font: font(900, 22), fill: '#FEE2E2', align: 'center', base: 'middle' });
  g.restore();
}
