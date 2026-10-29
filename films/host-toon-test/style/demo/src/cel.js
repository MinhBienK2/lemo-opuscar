// Cel drawing tools: smooth/sharp paths, flat fill + hard shadow + hard highlight + coloured line, ribbons, limbs.
// Adapted from Lemo-Opuscar styles/cel-anime-80s/demo/cel.js (MIT, see demo CREDITS).
export const W = 1920, H = 1080, TAU = Math.PI * 2;
export const LWK = { k: 1 };   // global line-weight multiplier

export function canvas(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

// pts: [[x,y], [x,y,1] (1 = sharp corner)]; Catmull-Rom → cubic Bézier
export function path(pts, closed = true, tension = 1) {
  const p = new Path2D(), n = pts.length;
  if (n < 2) return p;
  const P = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  p.moveTo(pts[0][0], pts[0][1]);
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2), k = tension / 6;
    let c1x = p1[0] + (p2[0] - p0[0]) * k, c1y = p1[1] + (p2[1] - p0[1]) * k;
    let c2x = p2[0] - (p3[0] - p1[0]) * k, c2y = p2[1] - (p3[1] - p1[1]) * k;
    if (p1[2] || (!closed && i === 0)) { c1x = p1[0] + (p2[0] - p1[0]) / 3; c1y = p1[1] + (p2[1] - p1[1]) / 3; }
    if (p2[2] || (!closed && i === segs - 1)) { c2x = p2[0] - (p2[0] - p1[0]) / 3; c2y = p2[1] - (p2[1] - p1[1]) / 3; }
    p.bezierCurveTo(c1x, c1y, c2x, c2y, p2[0], p2[1]);
  }
  if (closed) p.closePath();
  return p;
}
export const poly = (pts, closed = true) => path(pts.map(q => [q[0], q[1], 1]), closed);
export const toP = x => x instanceof Path2D ? x : path(x);
export function ellP(x, y, rx, ry, rot = 0) { const p = new Path2D(); p.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), rot, 0, TAU); return p; }
export function union(...ps) { const U = new Path2D(); for (const p of ps) U.addPath(toP(p)); return U; }

// flat fill + shadow + highlight + line
// o = { f, s, so:[dx,dy] auto shadow, sh:[shapes], s2/sh2 second shadow, h, ho:[dx,dy] auto highlight, hi:[shapes], rim:{c,d}, l, lw, clipFn }
const crescent = (P, d) => { const Q = new Path2D(); Q.addPath(P); Q.addPath(P, new DOMMatrix().translate(d[0], d[1])); return Q; };
export function cel(g, pts, o) {
  const P = toP(pts);
  if (o.f) { g.fillStyle = o.f; g.fill(P, o.rule || 'nonzero'); }
  if (o.so || o.ho || o.rim || (o.sh && o.sh.length) || (o.hi && o.hi.length) || o.clipFn) {
    g.save(); g.clip(P, o.rule || 'nonzero');
    if (o.so) { g.fillStyle = o.s; g.fill(crescent(P, o.so), 'evenodd'); }
    if (o.sh) { g.fillStyle = o.s; for (const s of o.sh) g.fill(toP(s)); }
    if (o.s2 && o.sh2) { g.fillStyle = o.s2; for (const s of o.sh2) g.fill(toP(s)); }
    if (o.ho) { g.fillStyle = o.h; g.fill(crescent(P, o.ho), 'evenodd'); }
    if (o.hi) { g.fillStyle = o.h; for (const s of o.hi) g.fill(toP(s)); }
    if (o.rim) { g.fillStyle = o.rim.c; g.fill(crescent(P, o.rim.d), 'evenodd'); }
    if (o.clipFn) o.clipFn(g, P);
    g.restore();
  }
  if (o.l) stroke(g, P, o.l, o.lw || 2.2);
  return P;
}
export function stroke(g, P, col, lw) {
  g.strokeStyle = col; g.lineWidth = lw * LWK.k; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(toP(P));
}
export function line(g, pts, col, lw = 2, closed = false) { stroke(g, pts instanceof Path2D ? pts : path(pts, closed), col, lw); }
// tapered stroke: open centre line drawn as a filled ribbon, thick in the middle, pointed at both ends
export function taper(g, pts, col, lw, ends = [.15, .15]) {
  const sp = resample(pts, 18);
  g.fillStyle = col; g.fill(path(ribbon(sp, u => lw * LWK.k * Math.min(1, u / ends[0] + .15, (1 - u) / ends[1] + .15)), true));
}
// outline-only-on-the-outside for a union of shapes: stroke all with 2×lw, then fill all (call fills after)
export function outlineUnion(g, shapes, col, lw) {
  g.strokeStyle = col; g.lineWidth = lw * 2 * LWK.k; g.lineJoin = 'round'; g.lineCap = 'round';
  for (const s of shapes) g.stroke(toP(s));
}

// resample a smooth open path through pts to n points (Catmull-Rom)
export function resample(pts, n) {
  if (pts.length < 3) { const out = []; for (let i = 0; i < n; i++) { const u = i / (n - 1); out.push([pts[0][0] + (pts[1][0] - pts[0][0]) * u, pts[0][1] + (pts[1][1] - pts[0][1]) * u]); } return out; }
  const out = [], m = pts.length - 1;
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1) * m, k = Math.min(m - 1, Math.floor(u)), f = u - k;
    const p0 = pts[Math.max(0, k - 1)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(m, k + 2)];
    const c = (a, b, c2, d) => .5 * ((2 * b) + (-a + c2) * f + (2 * a - 5 * b + 4 * c2 - d) * f * f + (-a + 3 * b - 3 * c2 + d) * f * f * f);
    out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
  }
  return out;
}
// Ribbon: centre line + width function → closed outline
export function ribbon(spine, width) {
  const n = spine.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = spine[Math.max(0, i - 1)], b = spine[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    const w = width(i / (n - 1)) / 2;
    L.push([spine[i][0] - dy * w, spine[i][1] + dx * w]); R.push([spine[i][0] + dy * w, spine[i][1] - dx * w]);
  }
  return L.concat(R.reverse());
}
// Limb: a tapered capsule from a (radius ra) to b (radius rb), as a Path2D
export function limb(a, b, ra, rb) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || .001, ang = Math.atan2(dy, dx);
  const s = Math.asin(Math.max(-1, Math.min(1, (ra - rb) / L)));
  const p = new Path2D();
  p.arc(a[0], a[1], ra, ang + Math.PI / 2 + s, ang + Math.PI * 1.5 - s);
  p.arc(b[0], b[1], rb, ang - Math.PI / 2 - s, ang + Math.PI / 2 + s);
  p.closePath();
  return p;
}
// 2-bone IK: shoulder s, target t, lengths a,b, bend sign → elbow point
export function ik(s, t, a, b, bend = 1) {
  let dx = t[0] - s[0], dy = t[1] - s[1], d = Math.hypot(dx, dy);
  const dd = Math.max(Math.abs(a - b) + .01, Math.min(a + b - .01, d));
  const ang = Math.atan2(dy, dx), cosA = (a * a + dd * dd - b * b) / (2 * a * dd);
  const A = Math.acos(Math.max(-1, Math.min(1, cosA)));
  return [s[0] + Math.cos(ang - bend * A) * a, s[1] + Math.sin(ang - bend * A) * a];
}

// colour tools
export function hex(c) { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
export function mix(a, b, t) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
export function rgba(c, a) { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})`; }
// a colour set from one base: fill, shadow, highlight, line
export function tone(f, o = {}) { return { f, s: o.s || mix(f, o.sh || '#3a2050', .32), h: o.h || mix(f, '#ffffff', .4), l: o.l || mix(f, '#1a0c18', .72) }; }
