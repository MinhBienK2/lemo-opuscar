// keys.js — motion over time. A beat of the board is a move with a start, a length and a path, never a switch:
// a thing that appears comes in from somewhere, a pose that changes travels to the next one, a number counts up.
//
//   import { span, keys, poseKeys, faceKeys, enter, travel, walkTo, count, drawOn, shake, landing, whip } from '../../../../rig/keys.js';
//
//   span(T, t0, d, e)            0 → 1 from t0 over d seconds, eased ('inOut' default, 'out', 'back', 'in', 'lin')
//   keys(T, [[t, v], …], d)       a number or a point [x, y] that holds each value and moves to the next over d s
//   poseKeys(T, [[t, {…}], …], d) an arm or a pose: numbers and points travel (swing, at, k…), words switch half-way
//   faceKeys(T, [[t, 'smile'], [t, ['worried', {sweat: 1}]]], bl)   the face blends over bl s (host: expr/blendE)
//   enter(T, t0, {from, d, rot, t1}) → {x, y, rot, s, a}: comes in from `from` ([dx, dy]) with a small overshoot,
//                                  leaves the same way from t1; g.translate(x, y), g.rotate(rot), g.scale(s, s)
//   travel(T, t0, d, A, B, lift) → [x, y] on an arc from A to B: thrown, carried, dropped, handed over
//   walkTo(T, t0, d, x0, x1, stride) → {x, ph, moving}: a walk whose feet don't slide (ph goes to extra({walk}) or legs.ph)
//   count(T, t0, d, n)            an integer that counts up to n (eased out): the number is the bar
//   drawOn(g, pts, p, col, lw)    a line that draws itself along pts as p goes 0 → 1 (a path, a crack, an arrow, a thread)
//   shake(T, t0, amp, d)          a jolt that dies out: add it to x
//   landing(T, t0, d) → [sx, sy]  squash when a thing lands, then back to 1
//   whip(g, T, t, drawA, drawB, o) a whip pan across a cut at t (the frame smeared sideways, 0.16 s): true while it draws
import { ease, clamp01 } from './broll.js';
import { expr, blendE } from './character.js';
import { canvas, W, H } from './cel.js';

export const lerp = (a, b, u) => a + (b - a) * u;
const EASE = { ...ease, lin: t => clamp01(t) };
const mixv = (a, b, u) => Array.isArray(a) ? a.map((v, i) => lerp(v, b[i], u)) : lerp(a, b, u);

export function span(T, t0, d = .5, e = 'inOut') { return EASE[e](clamp01((T - t0) / d)); }

function find(T, list) { let i = list.length - 1; while (i > 0 && T < list[i][0]) i--; return i; }

export function keys(T, list, d = .5, e = 'inOut') {
  const i = find(T, list); if (i === 0) return list[0][1];
  return mixv(list[i - 1][1], list[i][1], span(T, list[i][0], d, e));
}

export function poseKeys(T, list, d = .4) {
  const i = find(T, list), c = list[i][1]; if (i === 0) return c;
  const p = list[i - 1][1], u = span(T, list[i][0], d, 'inOut'), out = {};
  for (const k of new Set([...Object.keys(p), ...Object.keys(c)])) {
    const a = p[k], b = c[k];
    out[k] = typeof b === 'number' && typeof a === 'number' ? lerp(a, b, u)
      : Array.isArray(b) && Array.isArray(a) ? mixv(a, b, ease.back(clamp01((T - list[i][0]) / d)))
      : (u < .5 && a !== undefined ? a : b);
  }
  return out;
}

const face = x => typeof x === 'string' ? expr(x) : expr(x[0], x[1]);
export function faceKeys(T, list, bl = .15) {
  const i = find(T, list), cur = face(list[i][1]); if (i === 0) return cur;
  const u = clamp01((T - list[i][0]) / bl); return u >= 1 ? cur : blendE(face(list[i - 1][1]), cur, ease.inOut(u));
}

export function enter(T, t0, o = {}) {
  const [dx, dy] = o.from || [0, -260], d = o.d ?? .45, u = clamp01((T - t0) / d), k = ease.back(u);
  let x = dx * (1 - k), y = dy * (1 - k), a = clamp01(u * 4);
  if (o.t1 != null && T > o.t1) { const v = ease.in(clamp01((T - o.t1) / (o.dOut ?? .3))); x = dx * v; y = dy * v; a = 1 - v; }
  return { x, y, rot: (o.rot || 0) * (1 - k), s: .9 + .1 * Math.min(1, k), a: T < t0 ? 0 : a };
}

export function travel(T, t0, d, A, B, lift = 120) {
  const u = span(T, t0, d, 'inOut');
  return [lerp(A[0], B[0], u), lerp(A[1], B[1], u) - Math.sin(u * Math.PI) * lift];
}

export function walkTo(T, t0, d, x0, x1, stride = 170) {
  const u = span(T, t0, d, 'inOut'), x = lerp(x0, x1, u);
  return { x, ph: Math.abs(x - x0) / stride, moving: u > 0 && u < 1 };
}

export function count(T, t0, d, n) { return Math.round(n * ease.out(clamp01((T - t0) / d))); }

export function drawOn(g, pts, p, col, lw = 5) {
  if (p <= 0 || pts.length < 2) return;
  const seg = []; let tot = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); tot += l; }
  let left = tot * clamp01(p);
  g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length && left > 0; i++) {
    const u = Math.min(1, left / seg[i - 1]); left -= seg[i - 1];
    g.lineTo(lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u));
  }
  g.stroke(); g.restore();
}

export function shake(T, t0, amp = 8, d = .25) {
  const u = (T - t0) / d; return u < 0 || u > 1 ? 0 : Math.sin((T - t0) * 90) * amp * (1 - u);
}

export function landing(T, t0, d = .3) {
  const u = (T - t0) / d; if (u < 0 || u > 1) return [1, 1];
  const q = Math.sin(u * Math.PI) * (1 - u) * .5; return [1 + q * .5, 1 - q * .6];
}

let BUF = null;
export function whip(g, T, t, drawA, drawB, o = {}) {
  const d = o.d ?? .16, dir = o.dir ?? 1;
  if (Math.abs(T - t) >= d) return false;
  if (!BUF) BUF = canvas(W, H);
  const [buf, B] = BUF, before = T < t, u = before ? 1 - (t - T) / d : (T - t) / d;
  const dx = before ? -ease.inOut(u) * W * .5 * dir : (1 - ease.out(u)) * W * .5 * dir;
  B.setTransform(1, 0, 0, 1, 0, 0); B.clearRect(0, 0, W, H); (before ? drawA : drawB)(B);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  for (let k = 0; k < 7; k++) { g.globalAlpha = 1 / (k + 1); g.drawImage(buf, dx - (dx > 0 ? 70 : -70) * k, 0); }
  g.restore();
  return true;
}
