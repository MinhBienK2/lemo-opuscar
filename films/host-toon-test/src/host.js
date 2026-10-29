// The host: a young scholar in clean modern cel style.
// Head is 2.5D: every face feature sits on a 3D head and is projected with yaw / pitch, so turns are smooth.
// Expressions are flat number tables (E) that blend; hands are finger tables (hands.js); arms and legs are 2-bone IK.
// Units: figure origin at the base of the neck, y down; head (cranium) radius 100, centre at (0,-150); feet at y≈860.
import { cel, path, poly, ellP, line, taper, ribbon, limb, ik, mix, rgba, LWK, TAU, toP } from './cel.js';
import { hand, blendGest, PROPS, GEST } from './hands.js';

export const PAL = {
  skin: { f: '#ffe3d2', s: '#f2b4a2', h: '#fff6ef', l: '#9a5248' },
  blush: '#ff8a8a',
  hair: { f: '#45303a', s: '#2b1b24', h: '#8a6170', l: '#22121b' },
  lash: '#2a1520',
  iris: { f: '#c9822e', s: '#6e3712', h: '#ffd88a', l: '#3e1d0a' },
  eyeW: '#fffaf6',
  mouthIn: '#8c2a3e', tongue: '#ff8f8f',
  frame: { f: '#d9a441', l: '#6b4714' },
  accent: { f: '#ffd23f', s: '#e0a81c', h: '#fff1a6', l: '#7a5408' },   // highlighter yellow: the host's signature
  wood: { f: '#c98a52', s: '#9a5f30', l: '#4e2c12' },
  gold: { f: '#e0b14a', s: '#a87822', l: '#5a3c0a' },
  book: { f: '#2f6f8c', s: '#1f4c63', l: '#10293a' },
  paper: { f: '#fbf6ea', s: '#dccfb6', l: '#6b5a48' },
};
export const COSTUME = {
  scholar: {
    top: { f: '#2f8088', s: '#1f5a62', h: '#6cbcbc', l: '#11393f' }, shirt: { f: '#fbf4e6', s: '#e0d0b8', l: '#6b5a48' },
    bottom: { f: '#2e3350', s: '#1d2138', l: '#0e1020' }, legs: { f: '#3b3448', s: '#272233', l: '#120e18' },
    shoe: { f: '#6a3a2a', s: '#45241a', h: '#a0644c', l: '#22100a' }, collar: 'peter', bow: true, skirt: true, buttons: true,
  },
  heist: {   // a plain red work jumpsuit for "inside the story" scenes (no mask, no logos)
    top: { f: '#d8332f', s: '#a01e22', h: '#ff7a64', l: '#4e0c10' }, shirt: { f: '#d8332f', s: '#a01e22', l: '#4e0c10' },
    bottom: { f: '#d8332f', s: '#a01e22', l: '#4e0c10' }, legs: { f: '#d8332f', s: '#a01e22', l: '#4e0c10' },
    shoe: { f: '#2a2a30', s: '#16161a', h: '#55555f', l: '#08080a' }, collar: 'stand', bow: false, skirt: false, zip: true, belt: true,
  },
  field: {   // trench coat for investigations
    top: { f: '#c9a36e', s: '#9c7748', h: '#ead0a0', l: '#4a3216' }, shirt: { f: '#fbf4e6', s: '#e0d0b8', l: '#6b5a48' },
    bottom: { f: '#2e3350', s: '#1d2138', l: '#0e1020' }, legs: { f: '#3b3448', s: '#272233', l: '#120e18' },
    shoe: { f: '#6a3a2a', s: '#45241a', h: '#a0644c', l: '#22100a' }, collar: 'trench', bow: true, skirt: true, belt: true,
  },
};

// ——— expressions ———
const E0 = {
  open: 1, low: 0, iris: 1, lookX: 0, lookY: 0, happy: 0, blank: 0, sparkle: 0, lidL: 0, lidR: 0,
  biL: 0, boL: 0, baL: 2, biR: 0, boR: 0, baR: 2,           // brow inner / outer dy (+ = down), arch
  mo: 0, mw: 1, ms: .25, mr: 0, mt: 1, mk: 0, cat: 0,        // mouth open, width, smile, round, teeth, skew, cat-ω
  blush: .22, ahoge: .3, glint: 0,
  sweat: 0, vein: 0, gloom: 0, sparkles: 0, q: 0, ex: 0, bulb: 0, hatch: 0,
};
const B = (i, o, a = 2) => ({ biL: i, boL: o, baL: a, biR: i, boR: o, baR: a });
export const EXPR = {
  neutral: {},
  talk: { ms: .35 },
  smile: { ms: .85, low: .18, blush: .32, ...B(-3, -1, 3) },
  happy: { happy: 1, ms: 1, mo: .38, mw: 1.05, blush: .45, ahoge: .8, ...B(-5, -3, 3) },
  excited: { open: 1.06, sparkle: 1, ms: .9, mo: .62, mw: 1.12, blush: .42, ahoge: 1, sparkles: 1, ...B(-9, -7, 4) },
  surprised: { open: 1.16, iris: .74, mo: .5, mr: .85, ms: 0, ahoge: 1, ex: 1, ...B(-13, -10, 5) },
  shocked: { open: 1.2, blank: 1, mo: .72, mr: .45, ms: -.4, mw: 1.1, sweat: 1, ahoge: 1, ...B(-15, -8, 4) },
  thinking: { lookX: .55, lookY: -.75, lidL: .12, lidR: .12, mk: .55, ms: -.05, mw: .62, q: 1, biL: -6, boL: -2, baL: 2, biR: 3, boR: 4, baR: 1 },
  skeptical: { lidL: .36, lidR: .16, lookX: .35, ms: -.2, mk: -.7, mw: .75, biL: 5, boL: 3, baL: 0, biR: -11, boR: -13, baR: 4 },
  smug: { lidL: .38, lidR: .38, cat: 1, ms: .9, glint: 1, blush: .3, lookX: -.15, ...B(3, -5, 2) },
  worried: { ms: -.55, mw: .7, mo: .1, sweat: 1, lookX: -.3, lookY: .1, ahoge: -.4, ...B(-11, 5, 1) },
  sad: { lidL: .3, lidR: .3, ms: -.75, mw: .7, lookY: .55, ahoge: -1, gloom: 1, ...B(-11, 7, 1) },
  annoyed: { lidL: .42, lidR: .42, ms: -.45, mw: .6, vein: 1, ahoge: -.2, ...B(11, -3, 0) },
  embarrassed: { blush: 1, hatch: 1, ms: .25, mk: .35, mo: .08, sweat: 1, lookX: -.65, lookY: .4, ...B(-9, 2, 2) },
  determined: { lidL: .2, lidR: .2, ms: .08, mw: .9, ahoge: .8, ...B(9, -5, 1) },
  deadpan: { lidL: .52, lidR: .52, iris: .86, ms: 0, mw: .55, ...B(0, 0, 0) },
  scared: { open: 1.1, iris: .64, mo: .38, mw: 1.2, ms: -.65, sweat: 1, ahoge: -.5, ...B(-13, 6, 1) },
};
export function expr(name, over) { return { ...E0, ...(EXPR[name] || {}), ...(over || {}) }; }
export function blendE(a, b, t) {
  const A = typeof a === 'string' ? expr(a) : a, Bq = typeof b === 'string' ? expr(b) : b, o = {};
  for (const k in E0) o[k] = A[k] + (Bq[k] - A[k]) * t;
  return o;
}

// ——— 3D head helpers ———
function projector(yaw, pitch) {
  const ca = Math.cos(yaw), sa = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  return (x, y, z) => { const X = x * ca + z * sa, Z1 = -x * sa + z * ca; return [X, y * cp - Z1 * sp, y * sp + Z1 * cp]; };
}
const FACE = [[-96, -14, 22], [-93, 22, 34], [-84, 54, 42], [-63, 84, 52], [-32, 104, 64], [0, 110, 70]];
const hairlineY = x => -50 + 30 * Math.pow(Math.abs(x) / 96, 2.2);
const sphereZ = (x, y, r = 104) => Math.sqrt(Math.max(0, r * r - x * x - y * y));
function lock(x0, y0, x1, y1, tx, ty, bend = 0) {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, dx = tx - mx, dy = ty - my, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return [[x0, y0], [x0 + dx * .55 + nx * bend, y0 + dy * .55 + ny * bend], [tx, ty, 1], [x1 + dx * .5 + nx * bend * .7, y1 + dy * .5 + ny * bend * .7], [x1, y1]];
}
// fringe: [root x, tip x, tip y, width, bend]; parted on the character's left (screen right at yaw 0)
const FRINGE = [[-84, -92, 26, 28, -5], [-62, -74, 2, 32, -5], [-40, -52, -10, 30, -3], [-19, -32, -16, 26, -2], [2, -10, -8, 30, 2], [24, 20, -20, 22, 3], [46, 50, -6, 30, 5], [70, 84, 16, 28, 6]];

function headBack(g, P, yaw, pitch, E, t) {
  const ox = -Math.sin(yaw) * 26, H = P.hair, sw = Math.sin(t * 2.1) * 1.5;
  const half = [[-104, -50], [-114, 4], [-113, 50], [-104, 88], [-97, 112 + sw, 1], [-84, 100], [-72, 110 + sw, 1], [-58, 96]];
  const pts = [...half, [0, 92], ...half.slice().reverse().map(([x, y, s]) => [-x, y, s])].map(([x, y, s]) => [x + ox, y, s]);
  pts.push([ox, -96]);
  cel(g, pts, { f: H.s, s: mix(H.s, '#000000', .25), so: [-8, -8], l: H.l, lw: 2.2 });
}

function headFront(g, P, yaw, pitch, E, t, opt) {
  const pr = projector(yaw, pitch), H = P.hair, S = P.skin, lw = 2.2;
  const fsOf = (nx, ny, nz) => Math.max(.3, pr(nx, ny, nz)[2]);
  const blink = opt.blink || 0;
  const ears = () => { for (const sx of [-1, 1]) {
    const nz = pr(sx, 0, 0)[2];
    if (nz < -.15) continue;
    const [ex, ey] = pr(sx * 97, 26, -6), w = 7 + 9 * Math.max(0, nz);
    cel(g, ellP(ex, ey, w, 21), { f: S.f, s: S.s, sh: [ellP(ex + sx * 2, ey + 2, w * .5, 12)], l: S.l, lw });
  } };
  // face = cranium circle ∪ jaw
  // (ears come after the face so the back-of-head hair can tuck them)
  const jaw3 = [...FACE, ...FACE.slice(0, -1).reverse().map(([x, y, z]) => [-x, y, z])];
  const jaw = path(jaw3.map(([x, y, z]) => pr(x, y, z)));
  const crane = ellP(0, 0, 100, 100);
  g.strokeStyle = S.l; g.lineWidth = lw * 2 * LWK.k; g.lineJoin = 'round'; g.stroke(jaw); g.stroke(crane);
  const faceP = new Path2D(); faceP.addPath(jaw); faceP.addPath(crane);
  g.fillStyle = S.f; g.fill(jaw); g.fill(crane);
  g.save(); g.clip(faceP);
  // hard cel shadow on the side away from the light (top-left light), follows the turn
  const sh = new Path2D(); sh.addPath(jaw, new DOMMatrix().translate(-12 - Math.sin(yaw) * 10, -6)); sh.addPath(crane, new DOMMatrix().translate(-12 - Math.sin(yaw) * 10, -6));
  g.fillStyle = S.s; g.fill(faceP); g.fillStyle = S.f; g.fill(sh);
  // fringe shadow on the forehead
  g.fillStyle = mix(S.f, S.s, .75);
  for (const [rx, tx, ty, w, b] of FRINGE) {
    const r0 = pr(rx - w / 2, hairlineY(rx) - 6, sphereZ(rx, hairlineY(rx))), r1 = pr(rx + w / 2, hairlineY(rx) - 6, sphereZ(rx, hairlineY(rx))), tp = pr(tx, ty, sphereZ(tx, ty, 100) + 4);
    g.fill(path(lock(r0[0] - 3, r0[1] + 10, r1[0] + 4, r1[1] + 10, tp[0] + 2, tp[1] + 10, b)));
  }
  g.restore();
  // hair over the back of the head: the crescent between the silhouette and the front/back boundary (an ellipse of x-radius R·cos yaw)
  { const sy = Math.sin(yaw), bx = sy > 0 ? -1 : 1, rc = 100 * Math.cos(yaw);
    if (Math.abs(sy) > .05) {
      const pts = [];
      for (let i = 0; i <= 14; i++) { const th = -Math.PI / 2 + i / 14 * Math.PI * .78; pts.push([bx * 112 * Math.cos(th), 112 * Math.sin(th)]); }
      pts.push([bx * 92, 104, 1]);
      for (let i = 14; i >= 0; i--) { const th = -Math.PI / 2 + i / 14 * Math.PI * .74; pts.push([bx * rc * Math.cos(th), 102 * Math.sin(th)]); }
      cel(g, pts, { f: H.f, s: H.s, so: [-8, -8], l: H.l, lw });
    }
    ears(); }
  // blush
  for (const sx of [-1, 1]) {
    const [bx, by, bz] = pr(sx * 50, 52, 76), fs = fsOf(sx * .5, .2, .85);
    if (bz < 0) continue;
    g.fillStyle = rgba(P.blush, Math.min(.85, E.blush)); g.beginPath(); g.ellipse(bx, by, 17 * fs, 7, 0, 0, TAU); g.fill();
    if (E.hatch > .05) for (let k = 0; k < 3; k++) line(g, [[bx - 9 * fs + k * 7 * fs, by + 5], [bx - 4 * fs + k * 7 * fs, by - 5]], rgba('#e0505a', E.hatch * .8), lw * .7);
  }
  // nose: small shadow wedge on the side away from the light + a tip mark
  { const [nx, ny] = pr(0, 54, 104), s2 = Math.sin(yaw);
    g.fillStyle = S.s; g.beginPath(); g.moveTo(nx + 2 + s2 * 2, ny - 12); g.lineTo(nx + 5 + s2 * 4, ny); g.lineTo(nx - 1, ny + 2); g.closePath(); g.fill();
    line(g, [[nx - 2.5, ny + 2], [nx + 2.5, ny + 1.6]], S.l, lw * .8); }
  // mouth
  { const [mx, my] = pr(0, 79, 90), fs = fsOf(0, .45, .9); mouth(g, P, mx, my, 34 * (.55 + .45 * Math.cos(yaw)), E, lw, fs); }
  // eyes
  const eyes = [-1, 1].map(sx => { const [ex, ey] = pr(sx * 42, 26, 86); return { sx, ex, ey, fs: fsOf(sx * .42, .1, .9) }; });
  for (const e of eyes) eye(g, P, e.ex, e.ey, e.fs, e.sx, E, blink, lw, e.sx < 0 ? E.lidR : E.lidL);
  // glasses
  if (opt.glasses !== false) glasses(g, P, pr, eyes, E, yaw, lw, t);
  // hair cap
  const cx = -Math.sin(yaw) * 4;
  const cap = new Path2D();
  cap.arc(cx, -4, 110, Math.PI * .93, Math.PI * 2.07);
  const hl = []; for (let i = 0; i <= 12; i++) { const x = 98 - i * (196 / 12), y = hairlineY(x); hl.push(pr(x, y, sphereZ(x, y))); }
  for (const p of hl) cap.lineTo(p[0], p[1]);
  cap.closePath();
  const capFull = cap;
  // side locks (bob front pieces), behind the fringe
  const sides = [-1, 1].map(sx => {
    const r0 = pr(sx * 92, -36, 34), r1 = pr(sx * 74, -40, 64), tip = pr(sx * 84, 116, 44);
    const bend = sx * -6 + Math.sin(t * 2 + sx) * 1.5;
    return lock(r0[0], r0[1], r1[0], r1[1], tip[0] + Math.sin(t * 1.7 + sx) * 1.5, tip[1], bend);
  });
  const hairSt = { f: H.f, s: H.s, h: H.h, l: H.l, lw };
  for (const sp of sides) cel(g, sp, { ...hairSt, so: [-7, -6] });
  cel(g, capFull, { ...hairSt, so: [-10, -10] });
  // fringe: dark under-layer, then the locks
  const locks = FRINGE.map(([rx, tx, ty, w, b]) => {
    const y0 = hairlineY(rx) - 10, r0 = pr(rx - w / 2, y0, sphereZ(rx - w / 2, y0, 106)), r1 = pr(rx + w / 2, y0, sphereZ(rx + w / 2, y0, 106));
    const tp = pr(tx, ty, sphereZ(tx, ty, 100) + 7);
    return lock(r0[0], r0[1], r1[0], r1[1], tp[0] + Math.sin(t * 1.9 + rx) * .8, tp[1], b);
  });
  g.fillStyle = H.s; for (const L of locks) { const [a, , tp, , c] = L; g.fill(path(lock(a[0] - 8, a[1], c[0] + 8, c[1], tp[0], tp[1] - 4, 0))); }
  for (const L of locks) cel(g, L, { ...hairSt, l: mix(H.l, H.s, .3), lw: lw * .75, so: [-5, -6] });
  // angel ring (hair sheen), clipped to the cap + fringe
  g.save(); const HC = new Path2D(); HC.addPath(capFull); for (const L of locks) HC.addPath(path(L)); g.clip(HC);
  for (let k = 0; k < 7; k++) {
    if (k === 3) continue;
    const a0 = Math.PI * (1.14 + k * .1), pts = [];
    for (let j = 0; j < 5; j++) { const a = a0 + j * .018 * (k % 2 ? 4 : 3.2); pts.push([cx - 2 + Math.cos(a) * 80, -16 + Math.sin(a) * 66]); }
    taper(g, pts, rgba(H.h, .85), 6, [.35, .35]);
  }
  g.restore();
  // pencil hair-pin on the character's right side (screen left at yaw 0)
  { const [px, py, pz] = pr(-80, -30, 56); if (pz > -10) { g.save(); g.translate(px, py); g.scale(.82, .82); pencil(g, P, 0, 0, -.62, lw / .82); g.restore(); } }
  // ahoge (the antenna strand): perks up, droops when sad
  { const [ax, ay] = pr(4, -104, 22), k = E.ahoge, wob = Math.sin(t * 5.5) * 3;
    const tip = [ax + 26 + wob, ay - 30 - 26 * k], mid = [ax + 6, ay - 24 - 10 * k];
    const end = [tip[0] + 16 - 6 * k, tip[1] + 18 - 30 * Math.max(0, -k) + 6];
    cel(g, ribbon([[ax - 3, ay + 6], mid, tip, end], u => 10 * Math.pow(1 - u, .7) + 1), { f: H.f, l: H.l, lw: lw * .8 }); }
  // brows through the hair ("see-through fringe")
  for (const sx of [-1, 1]) {
    const L = sx < 0, bi = L ? E.biR : E.biL, bo = L ? E.boR : E.boL, ba = L ? E.baR : E.baL;
    const a = pr(sx * 18, -14 + bi, 96), c = pr(sx * 68, -14 + bo, 76), m = pr(sx * 42, -20 + (bi + bo) / 2 - ba, 92);
    if (pr(sx * 42, -16, 92)[2] < 35) continue;
    taper(g, [a, m, c], rgba(S.f, .9), 11, [.12, .4]);
    taper(g, [a, m, c], mix(H.l, H.f, .2), 6.5, [.1, .45]);
  }
  fx(g, P, E, t, lw);
}

function halo(g, col, cx, cy, rx, ry, a0, a1, th, teeth) {
  const up = [], dn = [];
  for (let i = 0; i <= teeth * 2; i++) {
    const u = i / (teeth * 2), a = a0 + (a1 - a0) * u, env = Math.sin(u * Math.PI) * .7 + .3;
    up.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    const d = th * env * (i % 2 ? 1.9 : .55);
    dn.push([cx + Math.cos(a) * (rx - d * .15), cy + Math.sin(a) * ry + d]);
  }
  g.fillStyle = rgba(col, .85); g.beginPath(); up.forEach((p, i) => g[i ? 'lineTo' : 'moveTo'](p[0], p[1])); for (let i = dn.length - 1; i >= 0; i--) g.lineTo(dn[i][0], dn[i][1]); g.closePath(); g.fill();
}

function pencil(g, P, x, y, ang, lw) {
  g.save(); g.translate(x, y); g.rotate(ang);
  const A = P.accent;
  cel(g, poly([[-34, -6], [24, -6], [24, 6], [-34, 6]]), { f: A.f, s: A.s, sh: [poly([[-34, 1], [24, 1], [24, 6], [-34, 6]])], l: A.l, lw: lw * .8 });
  cel(g, poly([[24, -6], [40, 0], [24, 6]]), { f: '#f2cf9e', l: A.l, lw: lw * .8 });
  cel(g, poly([[35, -2], [40, 0], [35, 2]]), { f: '#3a2a2a' });
  cel(g, poly([[-42, -6], [-34, -6], [-34, 6], [-42, 6]]), { f: '#c8c8d0', l: '#55556a', lw: lw * .7 });
  cel(g, path([[-50, -6], [-42, -6, 1], [-42, 6, 1], [-50, 6], [-53, 0]]), { f: '#ff9aa8', l: '#8a3a4a', lw: lw * .7 });
  g.restore();
}

function eye(g, P, cx, cy, fs, side, E, blink, lw, lidX) {
  const W2 = 28 * Math.max(.38, fs), h = 60, X = u => cx + side * u * W2, lash = P.lash;
  const open = Math.max(0, E.open * (1 - blink));
  if (E.happy > .5 && blink < .5) {   // ^ ^ happy closed eyes
    taper(g, [[X(-1.05), cy + 8], [X(-.2), cy - 10], [X(.6), cy - 8], [X(1.1), cy + 6]], lash, 7, [.2, .2]);
    return;
  }
  if (open < .12) { taper(g, [[X(-1), cy + 4], [X(0), cy + 10], [X(1.1), cy + 3]], lash, 6, [.2, .15]); return; }
  const lid = Math.max(0, Math.min(.9, lidX || 0));
  const inY = cy + h * .1, outY = cy - h * .02;
  const topY = cy - h * .5 * open + lid * h * .62 * Math.max(.5, open);
  const botY = cy + h * .44 - E.low * h * .28;
  const WP = path([[X(-1), inY, 1], [X(-.55), topY + h * .09], [X(.2), topY], [X(1), outY, 1], [X(.55), botY - h * .03], [X(-.3), botY]]);
  g.save(); g.clip(WP);
  g.fillStyle = P.eyeW; g.fill(WP);
  g.fillStyle = mix(P.eyeW, P.skin.s, .55); g.fillRect(cx - 60, topY - 10, 120, h * .16 + 10);
  const sc = E.iris, irx = W2 * .66 * sc, iry = h * .43 * sc;
  const ix = cx + side * W2 * .02 + E.lookX * W2 * .34, iy = cy + h * .06 + E.lookY * h * .15;
  if (E.blank > .5) {
    g.fillStyle = lash; g.beginPath(); g.ellipse(ix, iy, 4.5, 5.5, 0, 0, TAU); g.fill();
  } else {
    const I = P.iris, IR = ellP(ix, iy, irx, iry);
    g.fillStyle = I.f; g.fill(IR);
    g.save(); g.clip(IR);
    g.fillStyle = I.s; g.fillRect(ix - irx, iy - iry, irx * 2, iry * .9);
    g.fillStyle = mix(I.s, lash, .55); g.fillRect(ix - irx, iy - iry, irx * 2, iry * .35);
    g.fillStyle = mix(I.s, lash, .7); g.beginPath(); g.ellipse(ix, iy + iry * .02, irx * .42, iry * .46, 0, 0, TAU); g.fill();
    g.fillStyle = I.h; g.beginPath(); g.ellipse(ix, iy + iry * .92, irx * 1.05, iry * .5, 0, 0, TAU); g.fill();
    g.fillStyle = mix(I.h, '#ffffff', .5); g.beginPath(); g.ellipse(ix + irx * .1, iy + iry * 1.02, irx * .55, iry * .26, 0, 0, TAU); g.fill();
    g.restore();
    g.strokeStyle = I.l; g.lineWidth = lw * .7 * LWK.k; g.stroke(IR);
    g.fillStyle = '#ffffff';
    g.beginPath(); g.ellipse(ix - irx * .36, iy - iry * .36, irx * .4, iry * .27, -.5, 0, TAU); g.fill();
    g.beginPath(); g.arc(ix + irx * .42, iy + iry * .36, irx * .17, 0, TAU); g.fill();
    if (E.sparkle > .05) star(g, ix + irx * .25, iy - iry * .05, irx * .55 * E.sparkle, '#ffffff');
  }
  g.restore();
  // lower lid line + lash
  line(g, [[X(.98), outY + h * .14], [X(.55), botY + .5], [X(.1), botY + 1]], mix(P.skin.l, P.skin.f, .25), lw * .75);
  // upper lash band, thick toward the outer corner with a flick
  const t = h * .12;
  cel(g, [[X(-1.04), inY + 1, 1], [X(-.55), topY + h * .09 - t * .5], [X(.2), topY - t * .7], [X(.95), outY - t * .9], [X(1.3), outY - t * 1.8, 1],
    [X(1.04), outY + t * .4], [X(.2), topY + t * .4], [X(-.55), topY + h * .09 + t * .3], [X(-.98), inY + t * .55, 1]], { f: lash });
  for (let k = 0; k < 2; k++) { const u = .62 + k * .22, bx = X(u), by = topY + (outY - topY) * ((u - .2) / .8) - t * .4;
    cel(g, [[bx - side * 2, by, 1], [bx + side * (5 + k * 3), by - h * (.13 + k * .05), 1], [bx + side * 3, by + 1, 1]], { f: lash }); }
  line(g, [[X(-.3), topY - h * .17], [X(.5), topY - h * .21], [X(.95), outY - h * .26]], mix(P.skin.l, P.skin.f, .35), lw * .7);
}

function star(g, x, y, r, col) {
  g.fillStyle = col; g.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * .28 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  g.closePath(); g.fill();
}

function mouth(g, P, cx, cy, mw, E, lw, fs) {
  const lc = P.skin.l, k = 6;
  let hw = mw / 2 * E.mw * (1 - E.mr * .42);
  const lY = cy - E.ms * k + E.mk * 3, rY = cy - E.ms * k - E.mk * 3;
  if (E.cat > .5 && E.mo < .1) {   // ω cat mouth
    line(g, [[cx - hw * .9, cy - 4], [cx - hw * .45, cy + 3], [cx, cy - 2]], lc, lw * .95);
    line(g, [[cx, cy - 2], [cx + hw * .45, cy + 3], [cx + hw * .9, cy - 4]], lc, lw * .95);
    return;
  }
  if (E.mo < .06) {
    line(g, [[cx - hw, lY], [cx, cy + E.ms * 3.5], [cx + hw, rY]], lc, lw);
    line(g, [[cx - hw * .25, cy + 8 + E.ms * 2], [cx + hw * .2, cy + 8 + E.ms * 2]], mix(lc, P.skin.f, .55), lw * .6);
    return;
  }
  const h = E.mo * 30;
  const pts = [[cx - hw, lY, 1], [cx - hw * .4, cy - 1 - E.mr * h * .3], [cx + hw * .4, cy - 1 - E.mr * h * .3], [cx + hw, rY, 1],
    [cx + hw * (.62 - E.mr * .1), cy + h * .82], [cx, cy + h], [cx - hw * (.62 - E.mr * .1), cy + h * .82]];
  if (E.ms > .5) { pts[1][1] -= 1; pts[2][1] -= 1; }
  const MP = path(pts);
  g.save(); g.clip(MP);
  g.fillStyle = P.mouthIn; g.fill(MP);
  g.fillStyle = P.tongue; g.beginPath(); g.ellipse(cx + 2, cy + h * 1.02, hw * .62, h * .42, 0, 0, TAU); g.fill();
  if (E.mt > .5 && E.mo > .22) { g.fillStyle = '#ffffff'; g.fillRect(cx - hw * 2, cy - 20, hw * 4, 20 + Math.min(6.5, h * .24)); }
  g.restore();
  g.strokeStyle = lc; g.lineWidth = lw * LWK.k; g.lineJoin = 'round'; g.stroke(MP);
}

function glasses(g, P, pr, eyes, E, yaw, lw, t) {
  const F = P.frame, rims = [];
  for (const e of eyes) {
    const [gx, gy] = pr(e.sx * 43, 30, 98), rx = 37 * Math.max(.36, e.fs), ry = 34;
    rims.push({ gx, gy, rx, ry, sx: e.sx });
  }
  for (const r of rims) {
    const L = ellP(r.gx, r.gy, r.rx, r.ry);
    g.fillStyle = 'rgba(214,236,255,.10)'; g.fill(L);
    if (E.glint > .02) {
      g.save(); g.clip(L);
      if (E.glint > .9) { g.fillStyle = 'rgba(255,255,255,.96)'; g.fill(L); }
      g.fillStyle = `rgba(255,255,255,${.8 * Math.min(1, E.glint)})`;
      const d = (t * 40) % 120 - 60;
      for (const [o, w] of [[d - 10, 10], [d + 10, 5]]) { g.beginPath(); g.moveTo(r.gx + o - 40, r.gy + 40); g.lineTo(r.gx + o - 40 + w, r.gy + 40); g.lineTo(r.gx + o + 40 + w, r.gy - 40); g.lineTo(r.gx + o + 40, r.gy - 40); g.fill(); }
      g.restore();
    } else {   // a quiet lens sheen
      g.save(); g.clip(L); g.fillStyle = 'rgba(255,255,255,.35)';
      g.beginPath(); g.moveTo(r.gx - r.rx * .7, r.gy - r.ry * .1); g.lineTo(r.gx - r.rx * .2, r.gy - r.ry * .9); g.lineTo(r.gx - r.rx * .02, r.gy - r.ry * .9); g.lineTo(r.gx - r.rx * .52, r.gy + r.ry * .05); g.fill();
      g.restore();
    }
    g.strokeStyle = F.l; g.lineWidth = lw * 1.6 * LWK.k; g.stroke(L);
    g.strokeStyle = F.f; g.lineWidth = lw * .7 * LWK.k; g.stroke(L);
  }
  // bridge
  const [a, b] = rims[0].gx < rims[1].gx ? rims : [rims[1], rims[0]];
  const p0 = [a.gx + a.rx * .92, a.gy - a.ry * .3], p1 = [b.gx - b.rx * .92, b.gy - b.ry * .3], m = [(p0[0] + p1[0]) / 2, Math.min(p0[1], p1[1]) - 6];
  line(g, [p0, m, p1], F.l, lw * 1.6); line(g, [p0, m, p1], F.f, lw * .7);
  // temple arm on the side whose ear shows
  const s = Math.sin(yaw);
  if (Math.abs(s) > .12) {
    const r = s > 0 ? rims.find(q => q.sx < 0) : rims.find(q => q.sx > 0), sx = r.sx;
    const ear = pr(sx * 92, 16, -4), st0 = [r.gx + sx * r.rx * .98, r.gy - r.ry * .2];
    line(g, [st0, ear], F.l, lw * 1.6); line(g, [st0, ear], F.f, lw * .7);
  }
}

// manga symbols, head-local
function fx(g, P, E, t, lw) {
  if (E.sweat > .05) {
    const y = -40 + ((t * .35) % 1) * 18, x = 104, a = Math.min(1, E.sweat);
    g.globalAlpha = a;
    cel(g, [[x, y - 26, 1], [x + 11, y], [x, y + 11], [x - 11, y]], { f: '#cdeeff', l: '#4a7aa8', lw, h: '#ffffff', hi: [[[x - 5, y - 3], [x - 2, y - 11], [x - 6, y + 3]]] });
    g.globalAlpha = 1;
  }
  if (E.vein > .05) {
    g.save(); g.translate(-74, -78); g.scale(E.vein * (1 + .08 * Math.sin(t * 12)), E.vein * (1 + .08 * Math.sin(t * 12)));
    for (let k = 0; k < 4; k++) { g.save(); g.rotate(k * Math.PI / 2); line(g, [[4, -16], [5, -5], [16, -4]], '#e2384a', lw * 2.4); g.restore(); }
    g.restore();
  }
  if (E.gloom > .05) {
    g.save(); g.globalAlpha = Math.min(1, E.gloom) * .7;
    for (let k = 0; k < 9; k++) { const x = -70 + k * 17, len = 30 + (k % 3) * 18; line(g, [[x, -62], [x, -62 + len]], '#5a4a8a', lw * 1.2); }
    g.restore();
  }
  if (E.sparkles > .05) {
    for (let k = 0; k < 3; k++) { const ph = (t * .9 + k / 3) % 1, a = Math.sin(ph * Math.PI); const [x, y] = [[-150, -90], [150, -60], [130, -150]][k];
      star(g, x, y, 22 * a * E.sparkles, P.accent.f); star(g, x, y, 10 * a * E.sparkles, '#ffffff'); }
  }
  const mark = (ch, k) => {
    if (k < .05) return;
    const s = .5 + .5 * Math.min(1, k), bob = Math.sin(t * 4) * 4;
    g.save(); g.translate(150, -170 + bob); g.scale(s, s); g.rotate(.15);
    g.font = '900 96px "Be Vietnam Pro"'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 10; g.strokeStyle = '#2a1a28'; g.lineJoin = 'round'; g.strokeText(ch, 0, 0);
    g.fillStyle = ch === '?' ? '#8fd3ff' : P.accent.f; g.fillText(ch, 0, 0);
    g.restore();
  };
  mark('?', E.q); mark('!', E.ex);
  if (E.bulb > .05) {
    g.save(); g.translate(0, -230); const s = Math.min(1, E.bulb); g.scale(s, s);
    for (let k = 0; k < 7; k++) { const a = -Math.PI + k * Math.PI / 6; line(g, [[Math.cos(a) * 52, Math.sin(a) * 52], [Math.cos(a) * 70, Math.sin(a) * 70]], P.accent.s, lw * 2); }
    cel(g, ellP(0, -4, 34, 34), { f: P.accent.h, s: P.accent.f, so: [-6, -6], l: P.accent.l, lw: lw * 1.2 });
    cel(g, poly([[-16, 26], [16, 26], [14, 44], [-14, 44]]), { f: '#b8b8c8', l: '#4a4a5a', lw: lw * 1.2 });
    g.restore();
  }
}

// ——— the full figure ———
// o: { s (px per unit), costume, E, headYaw, headPitch, headRoll, bodyYaw, lean, t, blink, talk:{o,b},
//      armL / armR: { at:[x,y] hand target (figure units), gest, rot, prop, behind, flip, bend }, shrug,
//      legs: { mode: 'stand'|'walk'|'crouch', ph, feet }, crop: 'bust'|'full', linePx }
// armR is the character's right arm (screen left when facing us).
export function figure(g, o) {
  const s = o.s || 1, C = COSTUME[o.costume || 'scholar'], P = PAL, t = o.t || 0;
  const prevK = LWK.k; LWK.k = (o.linePx || 3) / (2.2 * s);
  let E = o.E || expr('neutral');
  if (o.talk) { const tk = o.talk; E = { ...E, mo: Math.max(E.mo, tk.o * .78), mw: E.mw * (.82 + tk.b * .36), mr: Math.max(E.mr, (1 - tk.b) * .5 * tk.o) }; }
  const by = o.bodyYaw || 0, cxB = Math.sin(by) * 34, breathe = Math.sin(t * 1.6) * 1.6, shrug = o.shrug || 0;
  g.save(); g.scale(s, s); g.rotate(o.lean || 0);
  const legs = o.crop === 'bust' ? null : (o.legs || { mode: 'stand' });
  const crouch = legs?.mode === 'crouch' ? (legs.k ?? 1) : 0;
  const bob = legs?.mode === 'walk' ? -Math.abs(Math.cos((legs.ph || 0) * TAU)) * 10 : 0;
  const bodyY = crouch * 150 + bob, hipY = 300 + bodyY;
  const headX = cxB * .5 + (o.headX || 0), headY = -138 + bodyY + breathe * .5 + (o.headY || 0);
  const headM = () => { g.translate(headX, headY + 100); g.rotate(o.headRoll || 0); g.translate(0, -100); };
  const yaw = (o.headYaw || 0) + by * .5, pitch = o.headPitch || 0;
  g.save(); headM(); headBack(g, P, yaw, pitch, E, t); g.restore();
  if (legs) drawLegs(g, C, legs, hipY, cxB, crouch);
  const shY = 40 + bodyY - shrug * 20 + breathe * .4;
  const arms = [[-1, o.armR], [1, o.armL]].map(([sd, a]) => armGeom(sd, a || {}, cxB, shY, by, bodyY));
  for (const A of arms) if (A.behind) drawArm(g, P, C, A);
  // neck
  cel(g, poly([[headX - 21, -70 + bodyY], [headX + 21, -70 + bodyY], [cxB * .8 + 23, 8 + bodyY], [cxB * .8 - 23, 8 + bodyY]]), { f: P.skin.f, s: P.skin.s, sh: [poly([[-60, -70 + bodyY], [60, -70 + bodyY], [60, -34 + bodyY], [-60, -20 + bodyY]])], l: P.skin.l, lw: 2.2 });
  drawTorso(g, P, C, cxB, by, bodyY, shrug, legs);
  g.save(); headM(); headFront(g, P, yaw, pitch, E, t, { blink: o.blink || 0, glasses: o.glasses }); g.restore();
  for (const A of arms) if (!A.behind) drawArm(g, P, C, A);
  g.restore();
  LWK.k = prevK;
}

const UA = 132, FA = 122;   // upper arm, forearm
function armGeom(sd, a, cxB, shY, by, bodyY) {
  const sh = [cxB + sd * 86 * (1 - Math.abs(Math.sin(by)) * .18), shY];
  const at = a.at ? [a.at[0], a.at[1] + bodyY] : [cxB + sd * 100, 296 + bodyY];
  let el; const ua = UA * (a.upper ?? 1), fa = FA * (a.fore ?? 1);   // < 1 = foreshortened toward the camera
  if (a.bend != null) el = ik(sh, at, ua, fa, a.bend);
  else {   // elbows down (and a little outward) unless told otherwise
    const e1 = ik(sh, at, ua, fa, 1), e2 = ik(sh, at, ua, fa, -1);
    const score = e => e[1] + sd * (e[0] - sh[0]) * .35;
    el = score(e1) > score(e2) ? e1 : e2;
  }
  return { sd, sh, el, wr: at, gest: a.gest || 'relaxed', rot: a.rot || 0, prop: a.prop, behind: !!a.behind, flip: a.flip ?? (sd > 0), hs: a.hs || 1.02, near: a.fore != null && a.fore < .8 };
}
function drawArm(g, P, C, A) {
  const T = C.top, lw = 2.2;
  const up = Math.max(0, (A.sh[1] - A.el[1]) / UA);
  const sh = [A.sh[0] + A.sd * 2 * up, A.sh[1] - 8 * up];   // the shoulder rises with the arm
  const ang = Math.atan2(A.wr[1] - A.el[1], A.wr[0] - A.el[0]);
  const wr = [A.wr[0] - Math.cos(ang) * 6, A.wr[1] - Math.sin(ang) * 6];
  const upper = limb(sh, A.el, 27, 23), fore = limb(A.el, wr, 23, A.near ? 24 : 21);
  g.strokeStyle = T.l; g.lineWidth = lw * 2 * LWK.k; g.lineJoin = 'round'; g.stroke(upper); g.stroke(fore);
  const both = new Path2D(); both.addPath(upper); both.addPath(fore);
  g.fillStyle = T.f; g.fill(both);
  g.save(); g.clip(both); const Q = new Path2D(); Q.addPath(both, new DOMMatrix().translate(-7, -6)); g.fillStyle = T.s; g.fill(both); g.fillStyle = T.f; g.fill(Q); g.restore();
  // sleeve fold at the elbow + cuff
  const n = [Math.cos(ang + Math.PI / 2), Math.sin(ang + Math.PI / 2)];
  line(g, [[A.el[0] - n[0] * 10, A.el[1] - n[1] * 10], [A.el[0] + Math.cos(ang) * 8, A.el[1] + Math.sin(ang) * 8]], T.l, lw * .6);
  const c0 = [wr[0] - Math.cos(ang) * 12, wr[1] - Math.sin(ang) * 12];
  cel(g, limb(c0, wr, 20, 20), { f: C.shirt.f, s: C.shirt.s, so: [-3, -3], l: C.shirt.l, lw });
  g.save(); g.translate(A.wr[0], A.wr[1]); g.rotate(ang + A.rot); g.scale(A.hs, A.hs);
  hand(g, P.skin, { gest: A.gest, flip: A.flip, lw: lw / A.hs, prop: !A.prop ? null : typeof A.prop === 'function' ? A.prop : PROPS[A.prop](P) });
  g.restore();
}

function drawTorso(g, P, C, cxB, by, bodyY, shrug, legs) {
  const T = C.top, lw = 2.2, y = bodyY, sy = -shrug * 20, far = 1 - Math.abs(Math.sin(by)) * .22;
  const wL = by > 0 ? far : 1, wR = by < 0 ? far : 1;
  const X = x => cxB + (x < 0 ? x * wL : x * wR);
  if (legs && C.skirt) {
    const B = C.bottom, hem = 450 + y;
    cel(g, [[X(-74), 256 + y], [X(74), 256 + y], [X(128), hem, 1], [X(44), hem + 8], [X(-44), hem + 8], [X(-128), hem, 1]], { f: B.f, s: B.s, so: [-12, 0], l: B.l, lw,
      clipFn: gg => { for (const x of [-100, -52, -6, 40, 86]) line(gg, [[X(x * .6), 270 + y], [X(x), hem + 8]], B.l, lw * .6); } });
  }
  const hemY = legs ? (C.skirt ? 318 : 300) : 700;
  const body = [[X(-26), -6 + y], [X(-74), 14 + y + sy], [X(-96), 44 + y + sy], [X(-94), 110 + y], [X(-80), 196 + y], [X(-76), 246 + y], [X(-86), hemY + y, 1], [X(0), hemY + 8 + y], [X(86), hemY + y, 1], [X(76), 246 + y], [X(80), 196 + y], [X(94), 110 + y], [X(96), 44 + y + sy], [X(74), 14 + y + sy], [X(26), -6 + y]];
  const vx = cxB + Math.sin(by) * 16;
  cel(g, body, { f: T.f, s: T.s, so: [-16, -4], h: T.h, l: T.l, lw,
    clipFn: gg => {
      if (C.collar === 'peter' || C.collar === 'trench') {   // V opening with the shirt inside
        cel(gg, [[X(-26), -8 + y], [X(26), -8 + y], [vx, 150 + y, 1]], { f: C.shirt.f, s: C.shirt.s, sh: [[[X(-26), -8 + y], [X(26), -8 + y], [X(26), 22 + y], [X(-26), 30 + y]]] });
        line(gg, [[X(-26), -8 + y], [vx, 150 + y]], T.l, lw); line(gg, [[X(26), -8 + y], [vx, 150 + y]], T.l, lw);
        if (C.buttons) for (const k of [0, 1, 2]) cel(gg, ellP(vx + 3, 176 + k * 40 + y, 6, 6), { f: C.shirt.f, l: T.l, lw: lw * .8 });
        line(gg, [[vx, 150 + y], [vx + Math.sin(by) * 6, hemY + 8 + y]], T.l, lw * .8);
        if (C.collar === 'trench') for (const sd of [-1, 1]) cel(gg, [[X(sd * 30), -8 + y], [X(sd * 92), 34 + y], [X(sd * 52), 128 + y], [vx + sd * 3, 150 + y]], { f: T.f, s: T.s, so: [-6, -4], l: T.l, lw });
      } else if (C.zip) {
        line(gg, [[vx, -6 + y], [vx + Math.sin(by) * 6, hemY + 8 + y]], T.l, lw);
        for (let k = 0; k < 13; k++) line(gg, [[vx - 3, 8 + k * 22 + y], [vx + 3, 8 + k * 22 + y]], T.l, lw * .5);
        cel(gg, poly([[X(-56), 80 + y], [X(-20), 80 + y], [X(-20), 116 + y], [X(-56), 116 + y]]), { f: T.f, s: T.s, sh: [poly([[X(-56), 80 + y], [X(-20), 80 + y], [X(-20), 88 + y], [X(-56), 88 + y]])], l: T.l, lw: lw * .8 });
      }
      if (C.belt) cel(gg, poly([[X(-110), 232 + y], [X(110), 232 + y], [X(110), 254 + y], [X(-110), 254 + y]]), { f: T.s, l: T.l, lw: lw * .8 });
    } });
  if (C.collar === 'peter') {
    for (const sd of [-1, 1]) cel(g, [[vx + sd * 2, 6 + y], [X(sd * 12), -8 + y], [X(sd * 40), -12 + y], [X(sd * 54), 8 + y], [X(sd * 44), 30 + y], [vx + sd * 9, 30 + y]], { f: C.shirt.f, s: C.shirt.s, so: [-4, -5], l: C.shirt.l, lw });
  } else if (C.collar === 'stand') {
    cel(g, [[X(-30), -16 + y], [X(30), -16 + y], [X(36), 10 + y], [X(-36), 10 + y]], { f: T.f, s: T.s, so: [-6, -4], l: T.l, lw });
  }
  if (C.bow) {
    const A = P.accent, bx = vx, byy = 20 + y;
    for (const sd of [-1, 1]) cel(g, [[bx, byy], [bx + sd * 23, byy - 13], [bx + sd * 27, byy + 5], [bx + sd * 20, byy + 14]], { f: A.f, s: A.s, so: [-3, -3], l: A.l, lw });
    cel(g, [[bx - 4, byy + 4], [bx - 11, byy + 36, 1], [bx - 3, byy + 30], [bx + 2, byy + 38, 1], [bx + 4, byy + 4]], { f: A.f, s: A.s, so: [-2, 0], l: A.l, lw });
    cel(g, ellP(bx, byy + 1, 7, 7), { f: A.f, s: A.s, so: [-2, -2], l: A.l, lw });
  }
}

const TH = 236, SH = 228;   // thigh, shin
function drawLegs(g, C, L, hipY, cxB, crouch) {
  const Lg = C.legs, lw = 2.2, ph = L.ph || 0, wide = C.skirt ? 1 : 1.3;
  for (const sd of [1, -1]) {
    const hip = [cxB + sd * 38, hipY];
    let ank = [cxB + sd * 40, 770];
    if (L.mode === 'walk') { const p = (ph + (sd > 0 ? 0 : .5)) % 1, sw = Math.sin(p * TAU); ank = [cxB + sd * 22 + sw * 110 * (L.dir || 1), 770 - Math.max(0, Math.cos(p * TAU)) * 34]; }
    if (crouch) ank = [cxB + sd * (44 + 16 * crouch), 770];
    if (L.feet) ank = L.feet[sd > 0 ? 1 : 0];
    const bend = L.mode === 'walk' ? (L.dir || 1) : sd;
    const th = TH * (1 - .5 * crouch), sh = SH * (1 - .08 * crouch);   // crouching: the thighs point at the camera
    const knee = ik(hip, ank, th, sh, bend);
    const thigh = limb(hip, knee, (27 + 6 * crouch) * wide, (20 + 6 * crouch) * wide), shin = limb(knee, ank, 20 * wide, 13 * wide);
    g.strokeStyle = Lg.l; g.lineWidth = lw * 2 * LWK.k; g.lineJoin = 'round'; g.stroke(thigh); g.stroke(shin);
    const both = new Path2D(); both.addPath(thigh); both.addPath(shin);
    g.fillStyle = Lg.s; g.fill(both);
    g.save(); g.clip(both); g.fillStyle = Lg.f; const Q = new Path2D(); Q.addPath(both, new DOMMatrix().translate(-8, 0)); g.fill(Q); g.restore();
    const S = C.shoe, d = sd * .35 + (L.mode === 'walk' ? (L.dir || 1) * .65 : 0), fx = ank[0], fy = ank[1] + 12;
    const toe = Math.sign(d || sd);
    cel(g, [[fx - toe * 16, fy - 16], [fx + toe * 14, fy - 18], [fx + toe * 38, fy - 2], [fx + toe * 38, fy + 12, 1], [fx - toe * 20, fy + 12, 1], [fx - toe * 22, fy - 4]], { f: S.f, s: S.s, so: [0, -6], h: S.h, l: S.l, lw });
  }
}

// convenience: the host as a bust (head + shoulders)
export function bust(g, o) { figure(g, { ...o, crop: 'bust' }); }
export { GEST };
