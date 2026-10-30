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

// C = skin colours {f,s,h,l}; o = { gest, flip, lw, prop: g => draws the held object }
export function hand(g, C, o = {}) {
  const G = typeof o.gest === 'string' ? (GEST[o.gest] || GEST.relaxed) : (o.gest || GEST.relaxed);
  const lw = o.lw || 2.4, thin = lw * .55, side = G.view === 'side';
  g.save(); if (o.flip) g.scale(1, -1);
  const palm = path([[0, -13], [20, -18], [40, -18], [47, -6], [47, 10], [41, 19], [20, 18], [0, 14]]);
  const [ta, tl, tc] = G.th, tr = [12, -11], L1 = 21 * tl, L2 = 17 * tl, t1 = ta + tc * .55, t2 = t1 + tc * 1.35;
  const tm = [tr[0] + Math.cos(t1) * L1, tr[1] + Math.sin(t1) * L1], te = [tm[0] + Math.cos(t2) * L2, tm[1] + Math.sin(t2) * L2];
  const thumb = new Path2D(); thumb.addPath(limb(tr, tm, 9.5, 8)); thumb.addPath(limb(tm, te, 8, 6.4));
  const fillPart = (P, sh = [-2, -3]) => {
    g.fillStyle = C.f; g.fill(P);
    g.save(); g.clip(P); const Q = new Path2D(); Q.addPath(P); Q.addPath(P, new DOMMatrix().translate(sh[0], sh[1])); g.fillStyle = C.s; g.fill(Q, 'evenodd'); g.restore();
  };
  const part = (P, sh) => { g.strokeStyle = mix(C.l, C.f, .2); g.lineWidth = thin * 2 * (LWK.k || 1); g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(P); fillPart(P, sh); };
  const thick = (...ps) => { g.strokeStyle = C.l; g.lineWidth = lw * 2 * (LWK.k || 1); g.lineJoin = 'round'; g.lineCap = 'round'; for (const p of ps) g.stroke(p); };
  if (side) {
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
    g.strokeStyle = mix(C.l, C.f, .45); g.lineWidth = thin * .9 * (LWK.k || 1); g.beginPath(); g.moveTo(16, 10); g.quadraticCurveTo(28, 14, 38, 9); g.stroke();
    part(thumb);
  } else {
    const F = G.f.map(([a, len, c], i) => ({ i, ...finger(40 - Math.abs(i - 1.2) * 2.5, KY[i], a, LEN[i] * len, c, RAD[i], 'palm') }));
    thick(palm, thumb, ...F.map(f => f.P));
    if (o.prop) { g.save(); o.prop(g); g.restore(); }
    for (const f of F.filter(f => !f.folded)) part(f.P);
    fillPart(palm, [0, -4]);
    g.fillStyle = mix(C.f, '#ffffff', .35); g.beginPath(); g.ellipse(26, 0, 9, 6, -.3, 0, TAU); g.fill();
    g.strokeStyle = mix(C.l, C.f, .45); g.lineWidth = thin * .9 * (LWK.k || 1); g.beginPath(); g.moveTo(14, 8); g.quadraticCurveTo(26, 2, 36, -6); g.stroke();
    for (const f of F.filter(f => f.folded)) part(f.P);
    part(thumb);
  }
  g.restore();
}
