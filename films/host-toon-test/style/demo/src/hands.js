// Hands: drawn in a hand frame with the wrist at (0,0) and the fingers along +x; thumb on the −y side.
// Gestures are finger tables, so poses blend (lerp every number) instead of popping.
// Line hierarchy: one thick outline around the whole hand silhouette, thin lines inside (finger folds, thumb over palm).
import { limb, path, mix, TAU, LWK, cel, ribbon } from './cel.js';

// finger: [angle (rad, 0 = along the hand), length, curl 0..1]; order index, middle, ring, pinky
// view 'palm' = palm toward the viewer (curl shortens the finger), 'side' = hand in profile (curl bends it)
export const GEST = {
  relaxed: { view: 'side', f: [[-.02, 1, .22], [0, 1, .3], [.03, 1, .36], [.06, 1, .42]], th: [-.32, .95, .12] },
  open:    { view: 'palm', f: [[-.16, 1, 0], [-.04, 1, 0], [.08, 1, 0], [.2, 1, 0]], th: [-1.0, 1, .05] },
  spread:  { view: 'palm', f: [[-.36, 1, 0], [-.1, 1, 0], [.15, 1, 0], [.4, 1, 0]], th: [-1.3, 1, 0] },
  point:   { view: 'side', f: [[-.05, 1.08, 0], [.04, 1, 1], [.08, 1, 1], [.12, 1, 1]], th: [-.45, .95, .55] },
  fist:    { view: 'side', f: [[0, 1, 1], [.04, 1, 1], [.08, 1, 1], [.12, 1, 1]], th: [-.5, .9, .75] },
  thumb:   { view: 'side', f: [[.12, 1, 1], [.16, 1, 1], [.2, 1, 1], [.24, 1, 1]], th: [-1.5, 1.08, 0] },
  one:     { view: 'palm', f: [[-.06, 1.04, 0], [.02, 1, 1], [.1, 1, 1], [.18, 1, 1]], th: [-.35, .9, .85] },
  two:     { view: 'palm', f: [[-.2, 1.04, 0], [.02, 1, 0], [.12, 1, 1], [.2, 1, 1]], th: [-.35, .9, .85] },
  three:   { view: 'palm', f: [[-.22, 1, 0], [-.04, 1, 0], [.14, 1, 0], [.22, 1, 1]], th: [-.35, .9, .85] },
  four:    { view: 'palm', f: [[-.24, 1, 0], [-.08, 1, 0], [.08, 1, 0], [.24, 1, 0]], th: [-.35, .9, .9] },
  hold:    { view: 'side', f: [[.02, 1, .78], [.06, 1, .82], [.1, 1, .86], [.14, 1, .9]], th: [-.4, 1, .45] },
  pinch:   { view: 'side', f: [[-.2, 1, .5], [.08, 1, .8], [.12, 1, .86], [.16, 1, .9]], th: [-.55, 1, .3] },
};
const LEN = [33, 36, 33, 26], KY = [-14, -5, 4, 12], RAD = [7.2, 7.4, 7, 6.2];
const SKY = [-8, -4, 0, 4], SRAD = [7.4, 7.2, 7, 6.4];   // side view: knuckle offsets and finger radii

export function blendGest(a, b, t) {
  const A = typeof a === 'string' ? GEST[a] : a, B = typeof b === 'string' ? GEST[b] : b;
  const L = (x, y) => x + (y - x) * t;
  return { view: t < .5 ? A.view : B.view, f: A.f.map((q, i) => q.map((v, j) => L(v, B.f[i][j]))), th: A.th.map((v, j) => L(v, B.th[j])) };
}

function finger(kx, ky, a, L, c, r, view) {
  if (view === 'palm') {
    const l2 = L * (1 - c * .74), e = [kx + Math.cos(a) * l2, ky + Math.sin(a) * l2];
    return { P: limb([kx - 6, ky], e, r, r * .78), tip: e, folded: c > .6 };
  }
  const a1 = a + c * 1.05, a2 = a1 + c * 1.35, l1 = L * .56, l2 = L * .5;
  const m = [kx + Math.cos(a1) * l1, ky + Math.sin(a1) * l1], e = [m[0] + Math.cos(a2) * l2, m[1] + Math.sin(a2) * l2];
  const P = new Path2D(); P.addPath(limb([kx - 6, ky], m, r, r * .9)); P.addPath(limb(m, e, r * .9, r * .74));
  return { P, tip: e, mid: m, folded: c > .5 };
}

// a bent spine: start, direction, length, total bend (+ = toward the palm), n points
function spine(x, y, a, len, bend, n = 10) {
  const pts = [[x, y]]; let ang = a;
  for (let i = 1; i < n; i++) { ang += bend / (n - 1); x += Math.cos(ang) * len / (n - 1); y += Math.sin(ang) * len / (n - 1); pts.push([x, y]); }
  return pts;
}

// C = skin colours {f,s,h,l}; o = { gest, flip, lw, prop: g => draws the held object }
export function hand(g, C, o = {}) {
  const G = typeof o.gest === 'string' ? GEST[o.gest] : (o.gest || GEST.relaxed);
  const lw = o.lw || 2.2, thin = lw * .55, side = G.view === 'side';
  g.save(); if (o.flip) g.scale(1, -1);
  const palm = path([[0, -13], [20, -18], [40, -18], [47, -6], [47, 10], [41, 19], [20, 18], [0, 14]]);
  const [ta, tl, tc] = G.th, tr = [12, -11], L1 = 21 * tl, L2 = 17 * tl, t1 = ta + tc * .55, t2 = t1 + tc * 1.35;
  const tm = [tr[0] + Math.cos(t1) * L1, tr[1] + Math.sin(t1) * L1], te = [tm[0] + Math.cos(t2) * L2, tm[1] + Math.sin(t2) * L2];
  const thumb = new Path2D(); thumb.addPath(limb(tr, tm, 9.5, 8)); thumb.addPath(limb(tm, te, 8, 6.4));
  const fillPart = (P, sh = [-2, -3]) => {
    g.fillStyle = C.f; g.fill(P);
    g.save(); g.clip(P); const Q = new Path2D(); Q.addPath(P); Q.addPath(P, new DOMMatrix().translate(sh[0], sh[1])); g.fillStyle = C.s; g.fill(Q, 'evenodd'); g.restore();
  };
  // a part made of overlapping capsules: stroke the union at 2× then fill, so only its outer edge keeps a line
  const part = (P, sh) => { g.strokeStyle = mix(C.l, C.f, .2); g.lineWidth = thin * 2 * LWK.k; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(P); fillPart(P, sh); };
  const thick = (...ps) => { g.strokeStyle = C.l; g.lineWidth = lw * 2 * LWK.k; g.lineJoin = 'round'; g.lineCap = 'round'; for (const p of ps) g.stroke(p); };
  if (side) {
    // profile from the thumb side: the fingers are stacked in depth (pinky at the back, index in front)
    // and curl toward the palm, which in this view is the thumb's side (−y); the thumb is nearest the viewer
    const F = [3, 2, 1, 0].map(i => {
      const [a, len, c] = G.f[i], L = LEN[i] * len * 1.08, r = SRAD[i];
      let x = 40 - i * .8, y = SKY[i], ang = a; const pts = [[x, y]];
      [[.46, 0], [.31, 1.25], [.27, 1.45]].forEach(([k, b], j) => { if (j) ang -= c * b; else ang -= c * .95; x += Math.cos(ang) * L * k; y += Math.sin(ang) * L * k; pts.push([x, y]); });
      const P = new Path2D(); P.addPath(limb(pts[0], pts[1], r, r * .94)); P.addPath(limb(pts[1], pts[2], r * .94, r * .86)); P.addPath(limb(pts[2], pts[3], r * .86, r * .76));
      return { i, P, pts };
    });
    thick(palm, thumb, ...F.map(f => f.P));
    for (const f of F.slice(0, 3)) part(f.P, [-1, -3]);
    fillPart(palm, [0, -4]);
    if (o.prop) { g.save(); o.prop(g); g.restore(); }
    part(F[3].P);
    g.strokeStyle = mix(C.l, C.f, .45); g.lineWidth = thin * .9 * LWK.k; g.beginPath(); g.moveTo(16, 10); g.quadraticCurveTo(28, 14, 38, 9); g.stroke();
    part(thumb);
  } else {
    const F = G.f.map(([a, len, c], i) => ({ i, ...finger(40 - Math.abs(i - 1.2) * 2.5, KY[i], a, LEN[i] * len, c, RAD[i], 'palm') }));
    thick(palm, thumb, ...F.map(f => f.P));
    if (o.prop) { g.save(); o.prop(g); g.restore(); }
    for (const f of F.filter(f => !f.folded)) part(f.P);
    fillPart(palm, [0, -4]);
    g.fillStyle = mix(C.f, '#ffffff', .35); g.beginPath(); g.ellipse(26, 0, 9, 6, -.3, 0, TAU); g.fill();
    g.strokeStyle = mix(C.l, C.f, .45); g.lineWidth = thin * .9 * LWK.k; g.beginPath(); g.moveTo(14, 8); g.quadraticCurveTo(26, 2, 36, -6); g.stroke();
    for (const f of F.filter(f => f.folded)) part(f.P);
    part(thumb);
  }
  g.restore();
}

// ——— props, drawn in the hand frame (grip point ≈ (30, 4)) ———
export const PROPS = {
  magnifier: (P) => g => {
    g.translate(30, 2); g.rotate(-.3);
    cel(g, limb([-4, 0], [-74, 0], 7, 8), { f: P.wood.f, s: P.wood.s, so: [0, -3], l: P.wood.l, lw: 2.2 });
    cel(g, limb([6, 0], [26, 0], 5, 5), { f: P.gold.f, s: P.gold.s, so: [0, -2], l: P.gold.l, lw: 2 });
    const ring = new Path2D(); ring.arc(66, 0, 42, 0, TAU); ring.arc(66, 0, 33, 0, TAU, true);
    g.fillStyle = 'rgba(200,236,255,.32)'; g.beginPath(); g.arc(66, 0, 34, 0, TAU); g.fill();
    g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.ellipse(54, -14, 12, 5, -.7, 0, TAU); g.fill();
    cel(g, ring, { f: P.gold.f, s: P.gold.s, so: [-2, -3], l: P.gold.l, lw: 2.2, rule: 'evenodd' });
  },
  book: (P) => g => {
    g.translate(22, 10); g.rotate(-.12);
    cel(g, [[-20, -70, 1], [70, -76, 1], [76, 50, 1], [-14, 58, 1]], { f: P.book.f, s: P.book.s, so: [-4, -4], l: P.book.l, lw: 2.2 });
    cel(g, [[-20, -70, 1], [-8, -72, 1], [-2, 56, 1], [-14, 58, 1]], { f: P.book.s, l: P.book.l, lw: 2 });
    cel(g, [[10, -40, 1], [56, -43, 1], [57, -24, 1], [11, -21, 1]], { f: P.paper.f, l: P.book.l, lw: 1.6 });
    cel(g, [[48, -76, 1], [58, -77, 1], [59, -50, 1], [53, -56, 1], [48, -50, 1]], { f: P.accent.f, l: P.accent.l, lw: 1.6 });
  },
  marker: (P) => g => {
    g.translate(28, 4); g.rotate(-1.25);
    cel(g, [[-8, -60, 1], [8, -60, 1], [8, 40, 1], [-8, 40, 1]], { f: P.accent.f, s: P.accent.s, so: [3, 0], l: P.accent.l, lw: 2 });
    cel(g, [[-8, -60, 1], [8, -60, 1], [5, -74, 1], [-5, -74, 1]], { f: '#3a3640', l: '#1a1620', lw: 1.8 });
    cel(g, [[-8, 30, 1], [8, 30, 1], [8, 48, 1], [-8, 48, 1]], { f: '#3a3640', l: '#1a1620', lw: 1.8 });
  },
  card: (P) => g => {   // an evidence photo / index card
    g.translate(40, -8); g.rotate(-.2);
    cel(g, [[-10, -64, 1], [86, -64, 1], [86, 10, 1], [-10, 10, 1]], { f: P.paper.f, s: P.paper.s, so: [-3, -3], l: P.paper.l, lw: 2 });
    cel(g, [[-2, -56, 1], [78, -56, 1], [78, -10, 1], [-2, -10, 1]], { f: P.photo || '#7d8aa0', l: P.paper.l, lw: 1.4 });
  },
  mug: (P) => g => {
    g.translate(48, 2);
    cel(g, [[-30, -46, 1], [30, -46, 1], [26, 40, 1], [-26, 40, 1]], { f: P.paper.f, s: P.paper.s, so: [5, 0], l: P.paper.l, lw: 2.2 });
    cel(g, [[-30, -16, 1], [30, -16, 1], [29, 4, 1], [-29, 4, 1]], { f: P.accent.f, l: P.accent.l, lw: 1.6 });
  },
};
