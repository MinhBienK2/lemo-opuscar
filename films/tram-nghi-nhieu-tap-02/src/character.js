// "Kẻ Nghĩ Nhiều" (The Overthinker) and his sidekick "Rối" — the channel's characters, drawn as minimalist vector cel.
//
// Look: a squircle head in off-white, messy dark-navy hair, an ahoge shaped like a lamp filament with a glowing bulb,
// an oversized mustard hoodie with a low-battery icon on the chest, dark outlines. Rối is a purple tangled scribble ball.
//
// Units: the figure origin is the base of the neck, y down; the head centre is (0,-150) with a radius of 100; the feet are at y ≈ 860.
// Everything is flat: one fill, one hard shadow, a dark line. No gradients.
import { cel, path, poly, ellP, line, taper, ribbon, limb, ik, mix, rgba, LWK, TAU, rect } from './cel.js';

export const PAL = {
  bg: '#12131A', bg2: '#1B1D27',
  skin: { f: '#FAF8F5', s: '#E4E0DA', h: '#FFFFFF', l: '#1D202A' },
  hair: { f: '#232A44', s: '#161B2E', h: '#3C4670', l: '#0E1220' },
  hoodie: { f: '#FFB703', s: '#D98E00', h: '#FFD976', l: '#1D202A' },
  ink: '#1D202A',
  cream: '#FAF8F5',
  muted: '#8A90A6',
  panel: '#232838', panel2: '#2C3247',
  violet: { f: '#8B5CF6', s: '#6D3FD6', h: '#B79BFA', l: '#2A1550' },
  cyan: { f: '#67E8F9', s: '#22B8D6', h: '#B6F3FF', l: '#0B3B47' },
  red: { f: '#F0525B', s: '#C22A38', h: '#FF9AA0', l: '#3A0B12' },
  green: { f: '#4ADE80', s: '#2AA85A', h: '#A7F3C4', l: '#0B3A20' },
};

// ——— expressions: flat number tables that blend ———
const E0 = {
  open: 1, lidL: 0, lidR: 0, lookX: 0, lookY: 0, smile: 0, mo: 0, mw: 1, ms: 0, mr: 0,
  browL: 0, browR: 0, browY: 0, blush: 0, ahoge: 0, glint: 0, sweat: 0, gloom: 0, sparkles: 0,
  q: 0, ex: 0, vein: 0, hatch: 0, spark: 0, tired: 0,
};
const B = (l, r, y = 0) => ({ browL: l, browR: r, browY: y });
export const EXPR = {
  neutral: {},
  talk: { smile: .12 },
  smile: { smile: .8, ms: .12, blush: .18, ...B(-2, -2) },
  happy: { smile: 1, mo: .28, mw: 1.05, blush: .3, ahoge: .9, ...B(-5, -5) },
  excited: { smile: 1, mo: .5, mw: 1.15, blush: .28, ahoge: 1, sparkles: 1, ...B(-8, -8) },
  surprised: { open: 1.1, mo: .45, mr: .9, ms: 0, ahoge: 1, ex: 1, ...B(-12, -12, 3) },
  shocked: { open: 1.15, mo: .7, mr: .5, ms: -.3, sweat: 1, ahoge: 1, ex: 1, ...B(-14, -8) },
  thinking: { lookX: .5, lookY: -.55, lidL: .16, lidR: .1, smile: -.1, mw: .7, q: 1, ...B(-7, 2, 2) },
  skeptical: { lidL: .38, lidR: .16, lookX: .3, smile: -.15, mw: .8, ...B(6, -10, 1) },
  smug: { lidL: .4, lidR: .4, smile: .9, glint: 1, blush: .25, ...B(3, -5) },
  worried: { smile: -.45, mw: .72, mo: .08, sweat: 1, lookX: -.25, ahoge: -.35, ...B(-10, 5) },
  sad: { lidL: .32, lidR: .32, smile: -.6, lookY: .5, ahoge: -1, gloom: 1, ...B(-9, 6) },
  tired: { lidL: .5, lidR: .5, smile: -.25, lookY: .2, ahoge: -.6, gloom: .6, tired: 1, ...B(-4, 4) },
  annoyed: { lidL: .45, lidR: .45, smile: -.35, mw: .65, vein: 1, ahoge: -.2, ...B(9, -2) },
  embarrassed: { blush: 1, hatch: 1, smile: .3, mo: .1, sweat: 1, lookX: -.6, lookY: .35, ...B(-8, 2) },
  determined: { lidL: .2, lidR: .2, smile: .1, ahoge: .75, ...B(8, -4) },
  deadpan: { lidL: .55, lidR: .55, smile: 0, mw: .6, ...B(0, 0) },
  flat: { lidL: .3, lidR: .3, smile: -.1, mw: .7, ...B(0, 0) },
  spin: { open: 1.05, lookX: .1, smile: .2, mo: .2, mr: .6, ahoge: 1, ...B(-6, -6) },
};
export function expr(name, over) { return { ...E0, ...(EXPR[name] || {}), ...(over || {}) }; }
export function blendE(a, b, t) {
  const A = typeof a === 'string' ? expr(a) : a, Bq = typeof b === 'string' ? expr(b) : b, o = {};
  for (const k in E0) o[k] = A[k] + (Bq[k] - A[k]) * t;
  return o;
}

// ——— shapes ———
// a squircle: a superellipse |x/a|^n + |y/b|^n = 1 (n = 4 gives the rounded-square look)
export function squircle(x, y, a, b, n = 4.2, steps = 64) {
  const p = new Path2D();
  for (let i = 0; i <= steps; i++) {
    const th = i / steps * TAU, ct = Math.cos(th), st = Math.sin(th);
    const px = x + a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n), py = y + b * Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
    i ? p.lineTo(px, py) : p.moveTo(px, py);
  }
  p.closePath(); return p;
}
function star(g, x, y, r, col) {
  g.fillStyle = col; g.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * .3 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  g.closePath(); g.fill();
}

// ——— the head ———
// E drives the face; yaw turns it; the hair is drawn in three passes (back mass, side locks, front fringe).
function head(g, o) {
  const { E, yaw = 0, roll = 0, pitch = 0, t = 0, blink = 0, talk = { o: 0, b: .5 }, lw } = o;
  const S = PAL.skin, H = PAL.hair, HR = 100;
  const hy = -150 + pitch * 6;          // the head rides on the neck
  const yshift = yaw * 6;               // the features slide with the turn
  g.save(); g.translate(yshift, 0); g.rotate(roll, 0, hy);
  // the skull: a squircle, flat fill with a hard shadow on the left
  const skull = squircle(0, hy, HR * 1.02, HR * 1.06);
  cel(g, skull, { f: S.f, s: S.s, so: [-13, -9], l: S.l, lw });
  // hair: the back mass, so the head reads as a head from behind
  const back = squircle(0, hy - 12, HR * 1.1, HR * 1.12);
  cel(g, back, { f: H.s, l: H.l, lw });
  g.restore();
  g.save(); g.translate(yshift, 0); g.rotate(roll, 0, hy);
  // the face is drawn on top of the hair mass: a squircle again, slightly narrower
  const face = squircle(yaw * 10, hy + 4, HR * .96, HR * .98);
  cel(g, face, { f: S.f, s: S.s, so: [-11, -8], l: S.l, lw });
  const fx = yaw * 14, fy = hy + 4 + pitch * 8;   // the feature box follows the turn
  // the ears
  for (const sx of [-1, 1]) {
    const ex = fx + sx * 92 + yaw * 6;
    cel(g, ellP(ex, fy + 20, 10, 17), { f: S.f, s: S.s, so: [sx * 3, 2], l: S.l, lw: lw * .85 });
  }
  // the eyes
  const eyes = [-1, 1].map(sx => ({ sx, ex: fx + sx * 40, ey: fy + 22 }));
  for (const e of eyes) eye(g, e.ex, e.ey, e.sx, E, blink, talk, lw);
  // the brows
  for (const e of eyes) {
    const up = e.sx < 0 ? E.browL : E.browR;
    const w = 30, x = e.ex + e.sx * 3, y = fy - 16 + E.browY - up * .8;
    const tilt = up * .045;
    taper(g, [[x - w, y + tilt * w], [x, y - 3], [x + w, y - tilt * w]], PAL.ink, lw * 1.25, [.2, .2]);
  }
  // the mouth
  mouth(g, fx, fy + 74, E, talk, lw);
  // the blush
  for (const e of eyes) {
    if (E.blush < .04) continue;
    g.fillStyle = rgba('#F0525B', Math.min(.6, E.blush * .5));
    g.beginPath(); g.ellipse(e.ex + e.sx * 46, fy + 48, 16, 7, 0, 0, TAU); g.fill();
  }
  // the nose: one small line
  line(g, [[fx + 3, fy + 50], [fx + 9, fy + 56]], mix(S.l, S.f, .35), lw * .8);
  // the hair on top of the face: messy navy locks
  hair(g, hy, yaw, t, E, lw);
  // the ahoge: a lamp filament, curling, with a glowing bulb
  ahoge(g, hy, yaw, t, E, lw);
  // the face effects
  fxDraw(g, fx, fy, E, t, lw);
  g.restore();
  return { fx, fy, hy };
}

function eye(g, cx, cy, sx, E, blink, talk, lw) {
  const open = Math.max(0, E.open * (1 - blink));
  const lid = E.sx === undefined ? 0 : 0;
  const lidK = (sx < 0 ? E.lidL : E.lidR);
  const W = 21, Hh = 25 * open * (1 - lidK * .55);
  if (E.tired > .3 && open < .55) {   // a tired eye: a flat line under the lid
    line(g, [[cx - W, cy], [cx + W, cy]], PAL.ink, lw * 1.1);
    line(g, [[cx - W * .7, cy + 7], [cx + W * .6, cy + 7]], rgba(PAL.ink, .45), lw * .6);
    return;
  }
  if (open < .1) { line(g, [[cx - W, cy + 2], [cx + W, cy + 1]], PAL.ink, lw * 1.1); return; }
  const ix = cx + E.lookX * 11, iy = cy + E.lookY * 7;
  // the sclera
  g.save();
  g.beginPath(); g.ellipse(cx, cy, W, Hh, 0, 0, TAU); g.clip();
  g.fillStyle = '#FFFFFF'; g.fillRect(cx - W, cy - Hh, W * 2, Hh * 2);
  // the iris
  const ir = Math.min(W * .8, Hh * .92);
  g.fillStyle = PAL.ink; g.beginPath(); g.ellipse(ix, iy, ir * .78, ir, 0, 0, TAU); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(ix - ir * .32, iy - ir * .34, ir * .27, 0, TAU); g.fill();
  if (E.sparkles > .1) star(g, ix + ir * .3, iy + ir * .2, ir * .55 * E.sparkles, '#fff');
  g.restore();
  // the lash line
  g.strokeStyle = PAL.ink; g.lineWidth = lw * 1.05; g.lineCap = 'round';
  g.beginPath(); g.ellipse(cx, cy, W, Hh, 0, Math.PI * 1.05, Math.PI * 2.05); g.stroke();
}

function mouth(g, cx, cy, E, talk, lw) {
  const o = Math.max(E.mo, talk ? talk.o * .62 : 0);
  const w = 26 * E.mw * (1 - E.mr * .4) * (E.smile < 0 ? 1.05 : 1);
  const sm = E.ms;
  if (E.q > .5 && o < .15) {   // a small "hmm" mouth
    line(g, [[cx - w * .5, cy + 3], [cx - w * .15, cy - 2], [cx + w * .2, cy + 3], [cx + w * .5, cy - 1]], PAL.ink, lw);
    return;
  }
  if (o < .1) {   // a closed mouth: a curve, smile or frown
    const dip = sm * 7;
    g.strokeStyle = PAL.ink; g.lineWidth = lw; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - w * .7, cy - dip * .5);
    g.quadraticCurveTo(cx, cy + dip, cx + w * .7, cy - dip * .5); g.stroke();
    return;
  }
  const h = 10 + o * 26, y0 = cy - sm * 6;
  cel(g, [[cx - w, y0, 1], [cx - w * .35, y0 - 1], [cx + w * .35, y0 - 1], [cx + w, y0, 1],
    [cx + w * .62, y0 + h * .78], [cx, y0 + h], [cx - w * .62, y0 + h * .78]],
    { f: '#3A1520', s: '#7A1E30', l: PAL.ink, lw: lw * .85 });
  // the tongue
  if (o > .45) { g.fillStyle = '#F0525B'; g.beginPath(); g.ellipse(cx, y0 + h * .82, w * .42, h * .26, 0, 0, TAU); g.fill(); }
}

function hair(g, hy, yaw, t, E, lw) {
  const H = PAL.hair, R = 100;
  const wob = Math.sin(t * 1.7) * 1.6;
  const a = R * 1.08, b = R * 1.1, n = 4.2;
  const sp = (ct, st) => [a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n), b * Math.sign(st) * Math.pow(Math.abs(st), 2 / n)];
  // the cap: the top half of a squircle, closed along a ragged hairline
  const cap = new Path2D();
  for (let i = 0; i <= 40; i++) {
    const th = Math.PI + i / 40 * Math.PI;
    const [px, py] = sp(Math.cos(th), Math.sin(th));
    i ? cap.lineTo(px, py + hy) : cap.moveTo(px, py + hy);
  }
  const hairline = [[.96, -.16], [.72, -.32], [.46, -.43], [.18, -.47], [-.18, -.49], [-.46, -.45], [-.72, -.35], [-.96, -.19]];
  for (const [fx, fy] of hairline) cap.lineTo(fx * a, fy * b + hy);
  cap.closePath();
  cel(g, cap, { f: H.f, s: H.s, so: [-10, -8], l: H.l, lw });
  // the fringe: tapered strands hanging from the hairline, clear of the eyes
  const locks = [
    [-88, -66, 14], [-54, -44, 22], [-14, -26, 26],
    [26, 2, 24], [62, 28, 18], [88, 50, 10],
  ];
  locks.forEach(([x0, x1, drop], k) => {
    const sway2 = Math.sin(t * 1.9 + x0) * 2.4;
    const spine = [[x0, hy - 80 + wob], [(x0 + x1) / 2, hy - 74 + drop * .3], [x1 + sway2, hy - 70 + drop]];
    cel(g, ribbon(spine, u => 24 * (1 - u * .78)), { f: k % 2 ? mix(H.f, H.h, .16) : H.f, s: H.s, so: [-5, -4], l: H.l, lw: lw * .8 });
  });
  // the crown: a few messy spikes
  for (const [x, h, w, ang] of [[-58, 34, 20, -.45], [-6, 42, 23, -.1], [48, 30, 18, .3]]) {
    const p = path([[x - w, hy - 98], [x + Math.sin(ang) * 18, hy - 98 - h], [x + w, hy - 92], [x + w * .5, hy - 104]], false);
    cel(g, p, { f: H.f, s: H.s, so: [-6, -4], l: H.l, lw: lw * .8 });
  }
  // the shine on the cap
  g.save(); g.clip(cap);
  for (let k = 0; k < 3; k++) {
    const pts = [];
    for (let j = 0; j < 5; j++) { const ang = Math.PI * (1.15 + k * .12) + j * .04; pts.push([-14 + Math.cos(ang) * 70, hy - 34 + Math.sin(ang) * 48]); }
    taper(g, pts, rgba(H.h, .7), 7, [.4, .4]);
  }
  g.restore();
}

function ahoge(g, hy, yaw, t, E, lw) {
  const k = E.ahoge;                       // up for excitement, down for sadness
  const bob = Math.sin(t * 3.1) * 4 + Math.sin(t * 7.3) * 1.4;
  const base = [yaw * 8 + 4, hy - 104];
  const pts = [];
  // a filament: a small curl that leans and springs
  const curl = 1 + k * .8;
  for (let i = 0; i <= 16; i++) {
    const u = i / 16;
    const a = u * Math.PI * 1.8 * curl;
    const rad = 38 * (1 - u * .5);
    pts.push([base[0] + Math.sin(a) * rad * .6 + u * 20, base[1] - u * (58 + k * 44) + Math.cos(a) * rad * .4 + bob * u * .5]);
  }
  const P = ribbon(pts, u => 8 * Math.pow(1 - u, .5) + 1.2);
  cel(g, P, { f: PAL.hair.f, l: PAL.hair.l, lw: lw * .8 });
  // the bulb at the tip: it glows with the mood
  const tip = pts[pts.length - 1], glow = .35 + .65 * Math.max(0, k);
  const r = 8 + 4 * glow;
  const grd = g.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], r * 3.4);
  grd.addColorStop(0, rgba(PAL.hair.h, .55 * glow)); grd.addColorStop(1, rgba(PAL.hair.h, 0));
  g.fillStyle = grd; g.beginPath(); g.arc(tip[0], tip[1], r * 3.4, 0, TAU); g.fill();
  cel(g, ellP(tip[0], tip[1], r, r), { f: PAL.hair.h, s: PAL.hair.f, l: PAL.hair.l, lw: lw * .7 });
  if (glow > .6) star(g, tip[0], tip[1], r * 1.7, rgba('#FFF3C4', .7));
}

function fxDraw(g, fx, fy, E, t, lw) {
  if (E.sweat > .1) {   // a sweat drop at the temple
    const x = fx + 78, y = fy - 18 + Math.sin(t * 3) * 2;
    cel(g, poly([[x, y - 15], [x + 9, y + 6], [x, y + 14], [x - 9, y + 6]]), { f: '#8FD3FF', s: '#4FA8D8', l: PAL.ink, lw: lw * .7 });
  }
  if (E.vein > .1) {   // the pop-vein mark
    const x = fx - 76, y = fy - 34;
    line(g, [[x, y], [x + 6, y + 10], [x - 4, y + 14], [x + 4, y + 24]], PAL.red.f, lw * .9);
    line(g, [[x + 14, y - 6], [x + 20, y + 4], [x + 10, y + 8], [x + 18, y + 18]], PAL.red.f, lw * .9);
  }
  if (E.hatch > .1) {   // the embarrassment hatch
    for (let k = 0; k < 3; k++) line(g, [[fx - 80 + k * 9, fy + 30], [fx - 74 + k * 9, fy + 20]], rgba(PAL.red.f, E.hatch * .9), lw * .7);
  }
  if (E.gloom > .1) {   // the gloom cloud
    const x = fx, y = fy - 92;
    g.fillStyle = rgba('#3C4463', E.gloom * .8);
    for (const [dx, dy, r] of [[-34, 0, 22], [-8, -8, 26], [24, 0, 20], [4, 10, 24]]) { g.beginPath(); g.arc(x + dx, y + dy, r, 0, TAU); g.fill(); }
  }
  if (E.glint > .1) {   // a star in the eye
    star(g, fx + 40, fy + 18, 22 * E.glint, '#FFFFFF');
  }
}

// ——— hands: a simple mitten with a thumb, plus a few gestures ———
function hand(g, x, y, rot, gest, flip, lw, prop) {
  g.save(); g.translate(x, y); g.rotate(rot + (flip ? Math.PI : 0));
  const S = PAL.skin;
  if (gest === 'point') {
    cel(g, path([[-13, -6], [26, -3], [30, 3], [26, 8], [-13, 10]], true), { f: S.f, s: S.s, so: [-4, -3], l: S.l, lw });
    cel(g, ellP(-6, 4, 13, 12), { f: S.f, s: S.s, so: [-4, -3], l: S.l, lw });
  } else if (gest === 'open') {
    cel(g, ellP(0, 0, 20, 22), { f: S.f, s: S.s, so: [-5, -4], l: S.l, lw });
    for (let k = 0; k < 4; k++) line(g, [[-11 + k * 7, -18], [-11 + k * 7, -24]], S.l, lw * .8);
    line(g, [[-20, 2], [-27, -4]], S.l, lw * .8);
  } else if (gest === 'fist') {
    cel(g, ellP(0, 0, 17, 16), { f: S.f, s: S.s, so: [-5, -4], l: S.l, lw });
    line(g, [[-8, -4], [8, -4]], S.l, lw * .8);
  } else if (gest === 'hold') {
    cel(g, ellP(0, 0, 15, 16), { f: S.f, s: S.s, so: [-5, -4], l: S.l, lw });
    if (prop) prop(g);
  } else if (gest === 'four' || gest === 'three' || gest === 'two' || gest === 'one') {
    const n = { one: 1, two: 2, three: 3, four: 4 }[gest] || 1;
    cel(g, ellP(0, 4, 15, 13), { f: S.f, s: S.s, so: [-4, -3], l: S.l, lw });
    for (let k = 0; k < n; k++) {
      const fx2 = -8 + k * 8;
      cel(g, rect(fx2 - 3, -24 - (n === 1 ? 4 : 0), fx2 + 3, -6), { f: S.f, s: S.s, l: S.l, lw: lw * .8 });
    }
  } else {   // relaxed
    cel(g, ellP(0, 2, 14, 18), { f: S.f, s: S.s, so: [-4, -3], l: S.l, lw });
    line(g, [[-12, 6], [12, 6]], rgba(S.l, .35), lw * .6);
  }
  g.restore();
}

// ——— the figure ———
// o: { t, E, s, blink, talk, headYaw, headRoll, headPitch, bodyYaw, lean, armL, armR, legs, crop, linePx, battery }
export function figure(g, o = {}) {
  const E = o.E || expr('neutral'), t = o.t || 0;
  const s = o.s === undefined ? 1 : o.s;
  // the line weight is fixed on the screen: the drawing happens inside a scale of s, so the widths are divided by it
  const lw = (o.linePx || 3.2) / s;
  const HD = PAL.hoodie;
  const breathe = Math.sin(t * 1.9) * 3;
  const sway = Math.sin(t * .8) * .012;
  g.save(); g.scale(s, s);
  const bodyYaw = o.bodyYaw || 0, lean = o.lean || 0;
  g.rotate(sway, 0, 0); g.translate(0, breathe * .3);
  // legs (drawn first, behind the torso)
  if (o.crop !== 'bust') {
    const legs = o.legs || { mode: 'stand' };
    const walk = legs.mode === 'walk' ? Math.sin((legs.ph || 0) * TAU) : 0;
    const walk2 = legs.mode === 'walk' ? Math.sin((legs.ph || 0) * TAU + Math.PI) : 0;
    const L = PAL.skin;
    for (const [sd, ph] of [[-1, walk], [1, walk2]]) {
      // standing: the leg swings; sitting: the thigh goes forward and the shin drops to the floor
      const sit = legs.mode === 'sit';
      const hip = [sd * 34, 290];
      const knee = sit ? [sd * 40 + 96, 420] : [sd * 34 + ph * 34, 460];
      const foot = sit ? [sd * 44 + 96, 660] : [sd * 36 + ph * 70, 650];
      cel(g, limb(hip, knee, 46, 38), { f: '#3A4258', s: '#2A3044', so: [-6, 0], l: PAL.ink, lw });
      cel(g, limb(knee, foot, 38, 31), { f: '#3A4258', s: '#2A3044', so: [-6, 0], l: PAL.ink, lw });
      cel(g, path([[foot[0] - 40, foot[1]], [foot[0] + 46, foot[1]], [foot[0] + 54, foot[1] + 30], [foot[0] - 44, foot[1] + 30]], true),
        { f: '#EDEFF5', s: '#C6CBD8', so: [-5, 3], l: PAL.ink, lw });
    }
  }
  // the torso: an oversized hoodie
  const sh = 124;                                   // the shoulder half-width
  const body = path([[-sh, 26], [-sh - 12, 170], [-sh - 2, 300], [sh + 2, 300], [sh + 12, 170], [sh, 26]], true);
  cel(g, body, { f: HD.f, s: HD.s, so: [-16, -6], l: HD.l, lw });
  // the hood, bunched behind the neck
  cel(g, path([[-86, 34], [-34, -30], [34, -30], [86, 34], [54, 58], [-54, 58]], true),
    { f: HD.s, s: mix(HD.s, PAL.ink, .25), so: [-10, -6], l: HD.l, lw });
  // the hood opening
  cel(g, path([[-56, 22], [-30, -24], [30, -24], [56, 22], [36, 38], [-36, 38]], true),
    { f: mix(HD.s, PAL.ink, .45), l: HD.l, lw: lw * .9 });
  // the pocket
  cel(g, rect(-84, 244, 84, 318),
    { f: mix(HD.f, HD.s, .35), s: HD.s, so: [0, 8], l: HD.l, lw: lw * .9 });
  // the drawstrings
  for (const sx of [-1, 1]) {
    const dx = sx * 24, dy = 26 + Math.sin(t * 2.2 + sx) * 3;
    line(g, [[dx, 20], [dx + sx * 3, dy + 62]], mix(PAL.cream, HD.s, .3), lw * 1.5);
    cel(g, ellP(dx + sx * 3, dy + 70, 6, 8), { f: PAL.cream, l: PAL.ink, lw: lw * .6 });
  }
  // the low-battery icon on the chest
  battery(g, -86, 96, 54, o.battery === undefined ? .12 : o.battery, t, lw);
  // the arms
  const arm = (cfg, sx) => {
    const a = cfg || {};
    const shoulder = [sx * 118, 58];
    const target = a.at || [sx * 140, 310];
    const up = 140, fore = 130;
    const elbow = ik(shoulder, target, up * (a.upper || 1), fore * (a.fore || 1), sx > 0 ? 1 : -1);
    const sleeve = PAL.hoodie;
    cel(g, limb(shoulder, elbow, 40, 32), { f: sleeve.f, s: sleeve.s, so: [-8, -4], l: sleeve.l, lw });
    cel(g, limb(elbow, target, 32, 25), { f: sleeve.f, s: sleeve.s, so: [-8, -4], l: sleeve.l, lw });
    // the cuff and the hand
    const ang = Math.atan2(target[1] - elbow[1], target[0] - elbow[0]);
    const cuff = [target[0] - Math.cos(ang) * 14, target[1] - Math.sin(ang) * 14];
    cel(g, ellP(cuff[0], cuff[1], 27, 22, ang), { f: sleeve.s, s: mix(sleeve.s, PAL.ink, .3), so: [-6, -4], l: sleeve.l, lw });
    hand(g, target[0], target[1], ang + Math.PI / 2 + (a.rot || 0), a.gest || 'relaxed', a.flip, lw, a.prop);
  };
  arm(o.armL, -1); arm(o.armR, 1);
  // the head
  const hd = head(g, { E, yaw: o.headYaw || 0, roll: o.headRoll || 0, pitch: o.headPitch || 0, t, blink: o.blink || 0, talk: o.talk || { o: 0, b: .5 }, lw });
  g.restore();
  return hd;
}

// the chest icon: a low battery
export function battery(g, x, y, w, level, t, lw = 3) {
  const h = w * .55;
  cel(g, rect(x, y, x + w, y + h), { f: 'rgba(0,0,0,0)', l: PAL.ink, lw: lw * .8 });
  cel(g, rect(x + w, y + h * .3, x + w + w * .12, y + h * .7), { f: PAL.ink, l: PAL.ink, lw: lw * .6 });
  const lv = Math.max(0, Math.min(1, level));
  if (lv > 0) {
    const blink = lv < .25 ? (Math.sin(t * 7) > 0 ? 1 : .35) : 1;
    g.globalAlpha = blink;
    cel(g, rect(x + 3, y + 3, x + 3 + (w - 6) * lv, y + h - 3),
      { f: lv < .25 ? PAL.red.f : PAL.green.f, l: PAL.ink, lw: lw * .5 });
    g.globalAlpha = 1;
  }
}

// ——— Rối: the sidekick, a purple tangled scribble ball ———
export function roi(g, x, y, s = 1, o = {}) {
  const t = o.t || 0, E = o.E || {};
  const V = PAL.violet;
  const spin = t * (o.spin === undefined ? 1.4 : o.spin);
  const squash = 1 + Math.sin(t * 6) * .06;
  g.save(); g.translate(x, y); g.scale(s * squash, s / squash);
  // the tangle: a looping scribble
  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const u = i / 120, a = u * TAU * 3.2 + spin, r = 46 * (1 - .38 * u) + Math.sin(a * 2.4) * 9;
    pts.push([Math.cos(a) * r, Math.sin(a) * r * .92]);
  }
  const P = ribbon(pts, u => 7 * Math.sin(Math.PI * Math.min(1, u * 1.02)) + 1.5);
  cel(g, P, { f: V.f, l: V.l, lw: 2.6 });
  // a second, thinner loop for the tangle
  const pts2 = [];
  for (let i = 0; i <= 90; i++) {
    const u = i / 90, a = -u * TAU * 2.4 + spin * .7, r = 30 * (1 - .3 * u) + Math.cos(a * 3) * 7;
    pts2.push([Math.cos(a) * r, Math.sin(a) * r * .9]);
  }
  cel(g, ribbon(pts2, u => 5 * Math.sin(Math.PI * Math.min(1, u * 1.02)) + 1), { f: V.h, l: V.l, lw: 2 });
  // the face: two eyes and a mouth
  const ey = -4 + Math.sin(t * 2) * 1.5;
  for (const sx of [-1, 1]) {
    cel(g, ellP(sx * 15, ey, 8.5, 9.5), { f: PAL.cream, l: PAL.ink, lw: 2 });
    cel(g, ellP(sx * 15 + (E.lookX || 0) * 3, ey + (E.lookY || 0) * 3, 4.4, 5), { f: PAL.ink });
  }
  const mo = E.mo === undefined ? .4 : E.mo;
  cel(g, ellP(0, ey + 20, 8, 2 + mo * 7), { f: '#3A1520', l: PAL.ink, lw: 1.8 });
  // the little antenna
  line(g, [[0, -44], [4, -60]], PAL.ink, 3);
  cel(g, ellP(4, -63, 5, 5), { f: V.h, l: PAL.ink, lw: 2 });
  g.restore();
}
