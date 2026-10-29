// The story's other people, drawn simpler than the host so she always reads as the lead:
// the crew (eight generic figures in red jumpsuits, told apart by build and hair, never a real actor's likeness),
// hostage icons, and the Professor as a silhouette.
import { cel, path, poly, ellP, line, limb, mix, LWK, TAU } from './cel.js';

const RED = { f: '#d8332f', s: '#a01e22', l: '#4e0c10' };
const GREY = { f: '#9a9196', s: '#7a7277', l: '#3a3438' };
const SKINS = ['#ffe0c8', '#f0c4a0', '#8a5a3c', '#ffd9c0', '#e8b48e', '#f6cfb0', '#d6a27c', '#ffe3d2'];
const HAIRS = ['#2a1a22', '#3b2a20', '#1e1418', '#5a3a26', '#2a1a14', '#8a8486', '#2e2420', '#6a4a30'];
// per member: height, width, hair style
export const CREW = [
  { h: .96, w: .92, hair: 'bob' }, { h: 1.06, w: 1.0, hair: 'slick' }, { h: .98, w: .95, hair: 'bun' }, { h: .97, w: .9, hair: 'mop' },
  { h: 1.03, w: 1.02, hair: 'curl' }, { h: 1.0, w: 1.08, hair: 'grey' }, { h: 1.1, w: 1.22, hair: 'buzz' }, { h: 1.08, w: 1.2, hair: 'buzz' },
];

function hairShape(g, kind, hx, hy, r, col, dir) {
  const H = { f: col, s: mix(col, '#000000', .3), l: mix(col, '#000000', .55) }, o = { f: H.f, s: H.s, so: [-6 * dir, -6], l: H.l, lw: 2.2 };
  if (kind === 'bob') cel(g, [[hx - r * 1.12, hy + r * .55, 1], [hx - r * 1.1, hy - r * .4], [hx - r * .3, hy - r * 1.14], [hx + r * .6, hy - r * 1.02], [hx + r * 1.12, hy - r * .3], [hx + r * 1.12, hy + r * .55, 1], [hx + r * .7, hy + r * .5], [hx + r * .55, hy - r * .35], [hx - r * .2, hy - r * .5], [hx - r * .75, hy + r * .5]], o);
  else if (kind === 'bun') { cel(g, ellP(hx - dir * r * .2, hy - r * 1.12, r * .42, r * .38), o); cel(g, [[hx - r * 1.04, hy, 1], [hx - r * .8, hy - r * .8], [hx, hy - r * 1.06], [hx + r * .8, hy - r * .8], [hx + r * 1.04, hy, 1], [hx + r * .7, hy - r * .4], [hx - r * .7, hy - r * .4]], o); }
  else if (kind === 'slick') cel(g, [[hx - r * 1.02, hy - r * .05, 1], [hx - r * .8, hy - r * .85], [hx + r * .1, hy - r * 1.1], [hx + r * .9, hy - r * .7], [hx + r * 1.02, hy - r * .05, 1], [hx + r * .6, hy - r * .55], [hx - r * .6, hy - r * .6]], o);
  else if (kind === 'mop' || kind === 'curl') {
    const n = kind === 'mop' ? 7 : 9, P = new Path2D();
    for (let k = 0; k < n; k++) { const a = Math.PI + k / (n - 1) * Math.PI; P.addPath(ellP(hx + Math.cos(a) * r * .86, hy + Math.sin(a) * r * .8 - r * .1, r * .36, r * .32)); }
    P.addPath(ellP(hx, hy - r * .5, r * .9, r * .5)); g.strokeStyle = H.l; g.lineWidth = 4.4 * LWK.k; g.stroke(P); g.fillStyle = H.f; g.fill(P);
  } else if (kind === 'grey') cel(g, [[hx - r * 1.02, hy + r * .1, 1], [hx - r * .96, hy - r * .5], [hx - r * .5, hy - r * .55], [hx - r * .4, hy - r * .9], [hx + r * .4, hy - r * .9], [hx + r * .5, hy - r * .55], [hx + r * .96, hy - r * .5], [hx + r * 1.02, hy + r * .1, 1], [hx + r * .8, hy - r * .2], [hx - r * .8, hy - r * .2]], o);
  else if (kind === 'buzz') cel(g, [[hx - r * 1.0, hy - r * .1, 1], [hx - r * .78, hy - r * .78], [hx, hy - r * 1.02], [hx + r * .78, hy - r * .78], [hx + r * 1.0, hy - r * .1, 1], [hx + r * .7, hy - r * .55], [hx - r * .7, hy - r * .55]], o);
}

// one crew member, feet at (0,0), ~600 units tall at s = 1. o: { i, s, dir (−1/1 or 0 facing us), ph (walk phase, null = stand),
// grey, prop(g) held in the front hand, eyes: true, sneak }
export function crew(g, x, y, o = {}) {
  const i = o.i || 0, M = CREW[i % 8], s = (o.s || 1) * M.h, dir = o.dir ?? 0, C = o.grey ? GREY : RED;
  const skin = o.grey ? '#c9c2c4' : SKINS[i % 8], skinL = mix(skin, '#5a2a20', .55), hair = o.grey ? '#6a6466' : HAIRS[i % 8];
  const prevK = LWK.k; LWK.k = (o.linePx || 2.6) / (2.2 * s);
  g.save(); g.translate(x, y); g.scale(s, s);
  const ww = M.w, walk = o.ph != null, ph = o.ph || 0, crouch = o.sneak ? 40 : 0, bob = walk ? -Math.abs(Math.cos(ph * TAU)) * 10 : 0;
  const hip = -250 + crouch + bob, sh = -470 + crouch + bob, hx = dir * 10, hy = -550 + crouch + bob, r = 62;
  // legs
  for (const sd of [1, -1]) {
    const p = (ph + (sd > 0 ? 0 : .5)) % 1, sw = walk ? Math.sin(p * TAU) * 80 * (dir || 1) : 0, lift = walk ? Math.max(0, Math.cos(p * TAU)) * 26 : 0;
    const a = [sd * 30 * ww, hip], f = [sd * 32 * ww + sw, -lift], k = [(a[0] + f[0]) / 2 + (dir || sd) * 18 + sw * .1, (hip - lift) / 2 + (walk ? 0 : 0)];
    cel(g, union2(limb(a, k, 30 * ww, 26 * ww), limb(k, f, 26 * ww, 22 * ww)), { f: sd > 0 ? C.s : C.f, l: C.l, lw: 2.2 });
    cel(g, [[f[0] - 26, f[1] - 18], [f[0] + 22 + (dir || 0) * 18, f[1] - 14], [f[0] + 30 + (dir || 0) * 18, f[1] + 6, 1], [f[0] - 26, f[1] + 6, 1]], { f: '#2a2a30', l: '#08080a', lw: 2 });
  }
  // back arm
  const arm = (sd, front) => {
    const swing = walk ? Math.sin((ph + (sd > 0 ? .5 : 0)) * TAU) * 60 * (dir || 1) : 0;
    const a = [sd * 74 * ww, sh + 20], hnd = o.hands?.[sd > 0 ? 1 : 0] || [sd * 92 * ww + swing, hip + 30];
    const e = [(a[0] + hnd[0]) / 2 + sd * 16, (a[1] + hnd[1]) / 2];
    cel(g, union2(limb(a, e, 24, 21), limb(e, hnd, 21, 19)), { f: front ? C.f : C.s, l: C.l, lw: 2.2 });
    cel(g, ellP(hnd[0], hnd[1] + 6, 20, 20), { f: skin, l: skinL, lw: 2 });
    if (front && o.prop) { g.save(); g.translate(hnd[0], hnd[1]); o.prop(g); g.restore(); }
  };
  arm(dir >= 0 ? -1 : 1, false);
  // torso
  cel(g, [[-70 * ww, sh, 1], [70 * ww, sh, 1], [86 * ww, sh + 40], [80 * ww, hip + 20], [-80 * ww, hip + 20], [-86 * ww, sh + 40]], { f: C.f, s: C.s, so: [-14, 0], l: C.l, lw: 2.2,
    clipFn: gg => { line(gg, [[dir * 14, sh], [dir * 14, hip + 20]], C.l, 1.6); cel(gg, poly([[-90 * ww, hip - 20], [90 * ww, hip - 20], [90 * ww, hip - 2], [-90 * ww, hip - 2]]), { f: C.s, l: C.l, lw: 1.4 }); } });
  cel(g, poly([[-26, sh - 18], [26, sh - 18], [30, sh + 8], [-30, sh + 8]]), { f: C.s, l: C.l, lw: 2 });
  // head
  cel(g, ellP(hx, hy, r * .96, r), { f: skin, s: mix(skin, '#a05040', .25), so: [-10 * (dir || 1), -4], l: skinL, lw: 2.2 });
  hairShape(g, M.hair, hx, hy, r, hair, dir || 1);
  if (o.eyes !== false) {
    const ex = hx + dir * 22, ey = hy + 6;
    for (const k of [-1, 1]) { g.fillStyle = '#2a1a22'; g.beginPath(); g.ellipse(ex + k * 22 * (1 - Math.abs(dir) * .3), ey, 6, 9, 0, 0, TAU); g.fill(); }
    line(g, [[ex - 10, hy + 34], [ex + 10, hy + 34]], skinL, 2);
  }
  arm(dir >= 0 ? 1 : -1, true);
  g.restore(); LWK.k = prevK;
}
function union2(a, b) { const P = new Path2D(); P.addPath(a); P.addPath(b); return P; }

// a hostage / person icon (pictogram, head + shoulders), coloured
export function personIcon(g, x, y, s, col) {
  const l = mix(col, '#1a0c18', .6);
  g.save(); g.translate(x, y); g.scale(s, s);
  cel(g, [[-34, 0, 1], [-30, -36], [-14, -48], [14, -48], [30, -36], [34, 0, 1]], { f: col, s: mix(col, '#2a1030', .3), so: [-6, 0], l, lw: 2 });
  cel(g, ellP(0, -68, 18, 19), { f: '#ffe0c8', s: '#f0b8a0', so: [-4, -2], l: '#9a5248', lw: 2 });
  g.restore();
}

// the Professor: a dark silhouette in profile facing right, glasses that can glint. Origin at the base of the neck.
export function professor(g, x, y, s, o = {}) {
  const D = o.col || '#141826', E = o.edge || '#3a4a6a';
  g.save(); g.translate(x, y); g.scale(s, s);
  const body = path([[-150, 40], [-60, -10], [40, -6], [120, 40], [150, 400, 1], [-170, 400, 1]]);
  const head = path([[-50, -40], [-70, -110], [-60, -190], [-10, -230], [50, -220], [80, -180], [86, -140], [100, -110], [84, -100], [86, -70], [70, -50], [40, -40], [20, -10], [-30, -10]]);
  g.fillStyle = D; g.fill(body); g.fill(head);
  g.strokeStyle = E; g.lineWidth = 4; g.stroke(head); g.stroke(body);
  // glasses: thin frame, the lens catches light
  g.strokeStyle = E; g.lineWidth = 5; g.beginPath(); g.ellipse(70, -128, 22, 17, 0, 0, TAU); g.stroke();
  line(g, [[48, -130], [0, -136]], E, 3);
  if (o.glint > 0) {
    g.fillStyle = `rgba(255,255,255,${o.glint})`; g.beginPath(); g.ellipse(70, -128, 20, 15, 0, 0, TAU); g.fill();
    const k = o.glint * 40; g.fillStyle = '#ffffff';
    g.beginPath(); g.moveTo(70, -128 - k); g.lineTo(74, -132); g.lineTo(70 + k, -128); g.lineTo(74, -124); g.lineTo(70, -128 + k); g.lineTo(66, -124); g.lineTo(70 - k, -128); g.lineTo(66, -132); g.fill();
  }
  g.restore();
}
