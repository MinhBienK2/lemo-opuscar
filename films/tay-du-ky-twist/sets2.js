// Seven spreads: page art + pop-up pieces + mechanisms. Times come from timing.js (built from the real voice).
import * as THREE from 'three';
import * as P from './props.js';
import { cutMesh, thread, blobShadow } from './cutmesh.js';
import { cv, paperFill, INK, GRAIN } from './paper.js';
import { mulberry, clamp, lerp, seg, ss, eio, back, TAU, spring } from './lib.js';
import { BW, BD, texOf } from './book.js';
import { drawFigure } from './figures.js';
import { OPEN, TURNS, RISE, FOLD } from './timing.js';

const PW = 2048, PH = Math.round(2048 * BD / BW);
const gx = xm => (xm / BW + .5) * PW, gz = zm => zm / BD * PH;

function page(fn, seed) { const c = cv(PW, PH), x = c.getContext('2d'); fn(x); x.save(); x.globalAlpha = .55; x.fillStyle = x.createPattern(GRAIN, 'repeat'); x.fillRect(0, 0, PW, PH); x.restore(); return c; }
function grad(x, stops) { const g = x.createLinearGradient(0, 0, 0, PH); stops.forEach(([o, c]) => g.addColorStop(o, c)); x.fillStyle = g; x.fillRect(0, 0, PW, PH); }
function dots(x, seed, n, cols, r0 = 4, r1 = 9) { const R = mulberry(seed); for (let i = 0; i < n; i++) { x.beginPath(); x.arc(R() * PW, R() * PH, r0 + R() * (r1 - r0), 0, TAU); x.fillStyle = cols[(R() * cols.length) | 0]; x.fill(); } }
function band(x, y0, y1, col) { x.fillStyle = col; x.fillRect(0, y0 * PH, PW, (y1 - y0) * PH); }
function hills(x, seed, y, col, h, n = 5) {
  const R = mulberry(seed);
  x.beginPath(); x.moveTo(0, PH);
  for (let i = 0; i <= n; i++) { const px = PW * i / n, py = PH * (y + (R() - .5) * h); x.lineTo(px, py); }
  x.lineTo(PW, PH); x.closePath(); x.fillStyle = col; x.fill();
}

// ---------- page art ----------
export function pages() {
  const A = {};
  // 0 · the road
  A.sky0 = page(x => {
    grad(x, [[0, '#8ec3d8'], [.62, '#d8e6d2'], [1, '#f0d9a8']]);
    const R = mulberry(5);
    for (let i = 0; i < 5; i++) { const cx = PW * (.1 + i * .2), cy = PH * (.14 + R() * .18); x.beginPath(); x.ellipse(cx, cy, 130 + R() * 90, 44 + R() * 20, 0, 0, TAU); x.fillStyle = 'rgba(255,250,240,.6)'; x.fill(); }
    x.fillStyle = 'rgba(255,240,190,.85)'; x.beginPath(); x.arc(PW * .76, PH * .2, 78, 0, TAU); x.fill();
    for (let i = 0; i < 4; i++) { const px = PW * (.2 + i * .13), py = PH * .12; x.strokeStyle = 'rgba(70,60,50,.5)'; x.lineWidth = 5; x.beginPath(); x.moveTo(px - 16, py); x.quadraticCurveTo(px, py - 12, px + 16, py); x.stroke(); }
  }, 1);
  A.ground0 = page(x => {
    grad(x, [[0, '#e6c98e'], [1, '#d8b878']]);
    band(x, .28, .34, '#c9a877');
    dots(x, 8, 220, ['#c9a877', '#f2ddb0', '#b8925e'], 3, 9);
    // the road: a pale band across the page
    x.beginPath(); x.moveTo(0, PH * .78); x.quadraticCurveTo(PW * .5, PH * .62, PW, PH * .8); x.lineTo(PW, PH); x.lineTo(0, PH); x.closePath();
    x.fillStyle = '#f2ddb0'; x.fill(); x.lineWidth = 6; x.strokeStyle = 'rgba(150,120,70,.35)'; x.stroke();
  }, 2);
  // 1 · Linh Sơn hall
  A.sky1 = page(x => {
    grad(x, [[0, '#f2d98a'], [.5, '#f6e7c0'], [1, '#e8cf9a']]);
    const R = mulberry(11);
    for (let i = 0; i < 9; i++) { x.save(); x.translate(PW * .5, PH * .55); x.rotate(i / 9 * TAU); x.fillStyle = 'rgba(255,255,235,.16)'; x.beginPath(); x.moveTo(0, 0); x.lineTo(-90, -PH); x.lineTo(90, -PH); x.closePath(); x.fill(); x.restore(); }
    for (let i = 0; i < 6; i++) { const cx = PW * (.1 + i * .17), cy = PH * (.1 + R() * .2); x.beginPath(); x.ellipse(cx, cy, 120, 40, 0, 0, TAU); x.fillStyle = 'rgba(255,252,240,.7)'; x.fill(); }
  }, 3);
  A.ground1 = page(x => {
    grad(x, [[0, '#e8d8b0'], [1, '#d8c398']]);
    for (let i = 0; i < 8; i++) { x.beginPath(); x.moveTo(0, PH * (.1 + i * .11)); x.lineTo(PW, PH * (.1 + i * .11)); x.lineWidth = 4; x.strokeStyle = 'rgba(140,110,70,.22)'; x.stroke(); }
    band(x, .62, .78, '#b8322c');
    dots(x, 12, 90, ['#c9a24a', '#e0b456'], 4, 8);
  }, 4);
  // 2 · the register (graphite on cream: outside the story)
  A.sky2 = page(x => {
    paperFill(x, PW, PH, '#f4eeda', 21, .05);
    for (let i = 0; i < 40; i++) { x.beginPath(); x.moveTo(0, PH * i / 40); x.lineTo(PW, PH * i / 40); x.lineWidth = 1.5; x.strokeStyle = 'rgba(90,85,95,.12)'; x.stroke(); }
    x.strokeStyle = 'rgba(70,72,82,.4)'; x.lineWidth = 4;
    for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(PW * .55, PH * (.12 + i * .14)); x.lineTo(PW * .9, PH * (.12 + i * .14)); x.stroke(); }
  }, 5);
  A.ground2 = page(x => {
    paperFill(x, PW, PH, '#efe7d2', 22, .05);
    x.strokeStyle = 'rgba(70,72,82,.35)'; x.lineWidth = 3;
    for (let i = 0; i < 22; i++) { const y = PH * (.05 + i * .043); x.beginPath(); x.moveTo(0, y); x.lineTo(PW, y); x.stroke(); }
    x.fillStyle = 'rgba(184,50,44,.10)'; x.fillRect(PW * .06, PH * .08, PW * .1, PH * .84);
  }, 6);
  // 3 · the demon shelf
  A.sky3 = page(x => {
    grad(x, [[0, '#4a2b4a'], [1, '#6a3a5a']]);
    const R = mulberry(31);
    for (let i = 0; i < 70; i++) { x.beginPath(); x.arc(R() * PW, R() * PH * .8, 1 + R() * 2, 0, TAU); x.fillStyle = 'rgba(255,220,180,.25)'; x.fill(); }
    x.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 4; i++) x.fillRect(0, PH * (.2 + i * .2), PW, PH * .04);
  }, 7);
  A.ground3 = page(x => {
    grad(x, [[0, '#3f4a34'], [1, '#556047']]);
    band(x, .2, .26, '#2f3826');
    dots(x, 33, 140, ['#6a7a4a', '#8a9a5a', '#3a4430'], 4, 10);
  }, 8);
  // 4 · the sutra hall
  A.sky4 = page(x => {
    grad(x, [[0, '#1f2a4a'], [.7, '#2a3a5f'], [1, '#3a4a70']]);
    const R = mulberry(41);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { x.fillStyle = 'rgba(224,180,86,.22)'; x.fillRect(PW * (.05 + i * .16), PH * (.08 + j * .22), PW * .12, PH * .18); }
    for (let i = 0; i < 90; i++) { x.beginPath(); x.arc(R() * PW, R() * PH, 1 + R() * 2, 0, TAU); x.fillStyle = 'rgba(255,230,170,.35)'; x.fill(); }
  }, 9);
  A.ground4 = page(x => {
    grad(x, [[0, '#24304f'], [1, '#1a2340']]);
    for (let i = 0; i < 9; i++) { x.beginPath(); x.moveTo(0, PH * (.08 + i * .1)); x.lineTo(PW, PH * (.08 + i * .1)); x.lineWidth = 3; x.strokeStyle = 'rgba(224,180,86,.18)'; x.stroke(); }
    band(x, .56, .62, '#e0b456');
  }, 10);
  // 5 · the river
  A.sky5 = page(x => {
    grad(x, [[0, '#9fb8ae'], [.6, '#c9d6c2'], [1, '#dfe4cf']]);
    const R = mulberry(51);
    for (let i = 0; i < 6; i++) { x.beginPath(); x.ellipse(PW * (.1 + i * .18), PH * (.12 + R() * .2), 150, 34, 0, 0, TAU); x.fillStyle = 'rgba(255,255,250,.4)'; x.fill(); }
  }, 11);
  A.ground5 = page(x => {
    grad(x, [[0, '#5f8a7a'], [1, '#3f6a5f']]);
    for (let i = 0; i < 14; i++) { x.beginPath(); x.moveTo(0, PH * (.04 + i * .07)); for (let k = 0; k <= 8; k++) x.lineTo(PW * k / 8, PH * (.04 + i * .07) + Math.sin(k * 1.3 + i) * 10); x.lineWidth = 4; x.strokeStyle = 'rgba(255,255,255,.16)'; x.stroke(); }
  }, 12);
  // 6 · the ford at dawn
  A.sky6 = page(x => {
    grad(x, [[0, '#f2b48a'], [.45, '#f6d2a8'], [1, '#f8e6c8']]);
    const R = mulberry(61);
    for (let i = 0; i < 4; i++) { x.beginPath(); x.ellipse(PW * (.15 + i * .22), PH * (.1 + R() * .16), 180, 40, 0, 0, TAU); x.fillStyle = 'rgba(255,250,240,.55)'; x.fill(); }
    x.fillStyle = 'rgba(255,220,150,.7)'; x.beginPath(); x.arc(PW * .2, PH * .3, 60, 0, TAU); x.fill();
  }, 13);
  A.ground6 = page(x => {
    grad(x, [[0, '#d8c9a8'], [1, '#c9b894']]);
    band(x, .5, .62, '#a8c0b8');
    dots(x, 63, 120, ['#b8a888', '#e8dcc0'], 3, 8);
  }, 14);
  return A;
}

// ---------- pop-ups ----------
function popper(list, spread, parent, item, x, y, z, o = {}) {
  const g = new THREE.Group(); g.position.set(x, y, z);
  const m = cutMesh(item, o); if (o.flip) m.scale.x = -1; if (o.ry) m.rotation.y = o.ry;
  g.add(m); parent.add(g);
  const rec = { g, m, spread, d: o.d ?? 0, dir: o.dir ?? (z > .15 ? -1 : 1), sway: o.sway || 0, ph: o.ph ?? x * 40, pop: o.pop !== false, upd: o.upd, item };
  list.push(rec); return rec;
}
function riseOf(r, t) {
  const t0 = RISE[r.spread] + r.d, tf = FOLD[r.spread] + (.3 - r.g.position.z) * .6;
  const up = r.pop ? back(seg(t, t0, t0 + .55), 1.7) : (t >= t0 ? 1 : 0);
  const dn = 1 - ss(seg(t, tf, tf + .4));
  return Math.min(up, dn);
}

export function buildSets(book) {
  const L = [], S = book.stage, K = book.sky, ex = {};
  const figCache = new Map();
  function fig(kind, o = {}) {
    const key = kind + JSON.stringify(o);
    if (figCache.has(key)) return figCache.get(key);
    const c = cv(900, 1160); drawFigure(c.getContext('2d'), { kind, ...o });
    const it = { c, w: .034, h: .044, ax: .5, ay: 1 };
    figCache.set(key, it); return it;
  }

  // ===== 0 · the road =====
  {
    const s = 0, dz = z => (.3 - z) * 1.2;
    popper(L, s, K, P.mountain(.24, .1, '#b5a37a', '#9a8660', 3), -.08, 0, .004, { d: 0, dir: -1 });
    popper(L, s, K, P.mountain(.18, .075, '#c9b894', '#ad9a72', 4), .1, 0, .003, { d: .1, dir: -1 });
    popper(L, s, K, P.pagoda(.075), .155, 0, .02, { d: .25, dir: -1 });
    popper(L, s, S, P.mountain(.1, .035, '#c9a877', '#b08f60', 5), -.16, 0, .06, { d: .3 });
    popper(L, s, S, P.mountain(.08, .028, '#d8b878', '#bd9a62', 6), .16, 0, .055, { d: .35 });
    const road = popper(L, s, S, P.roadStrip(.44, .05), 0, 0, .17, { d: .15, pop: false });
    ex.road = road;
    ex.party = [];
    for (const [k, o, x] of [['monk', { prop: 'staff' }, -.05], ['monkey', { prop: 'staff' }, -.01], ['pig', { prop: 'rake' }, .03], ['sand', { prop: 'spade' }, .07]]) {
      const it = fig(k, o);
      const r = popper(L, s, S, { ...it, w: .03, h: .04 }, x, 0, .17 + (x + .05) * .12, { d: .5 + x });
      ex.party.push(r);
    }
    popper(L, s, K, P.sunDisc(.035), -.14, .17, .004, { d: .2, dir: -1 });
    ex.clouds = [];
    for (const [x, y] of [[-.1, .2], [.06, .24], [.15, .18]]) ex.clouds.push(popper(L, s, K, P.cloud(.09, x * 40), x, y, .01, { d: .1, dir: -1, sway: .01 }));
    // distance sign
    popper(L, s, S, P.card(.075, .026, '108.000 DẶM', '#f4ead4', '#b8322c', .3), .14, .012, .09, { d: .6 });
  }

  // ===== 1 · the hall =====
  {
    const s = 1, dz = z => (.3 - z) * 1.2;
    popper(L, s, S, P.hall(.24, .12), 0, 0, .035, { d: .1 });
    const lotus = popper(L, s, S, P.lotus(.035), 0, .02, .11, { d: .35 });
    const buddha = popper(L, s, S, { ...fig('buddha', { prop: 'fan' }), w: .032, h: .042 }, 0, .045, .11, { d: .45 });
    ex.buddha = buddha;
    const guan = popper(L, s, S, { ...fig('guan', { prop: 'vase' }), w: .03, h: .04 }, -.12, 0, .12, { d: .55 });
    ex.guan = guan;
    ex.cards = [];
    for (let i = 0; i < 4; i++) {
      const r = popper(L, s, S, P.card(.05, .07, ['ĐƯỜNG TĂNG', 'NGỘ KHÔNG', 'BÁT GIỚI', 'SA TĂNG'][i], '#fffdf7', '#2a2030', .2), -.13 + i * .085, .004, .22, { d: .8 + i * .12 });
      ex.cards.push(r);
    }
    popper(L, s, K, P.cloud(.11, 3), -.1, .22, .01, { d: .2, dir: -1 });
    popper(L, s, K, P.cloud(.09, 4), .12, .26, .01, { d: .3, dir: -1 });
  }

  // ===== 2 · the register =====
  {
    const s = 2;
    const reg = popper(L, s, S, P.register(.32, .13, 80), 0, .002, .16, { d: .1, pop: false });
    ex.register = reg;
    // gatefold panels, hinged on the left/right edges of the register
    ex.fold = [];
    for (const side of [-1, 1]) {
      const g = new THREE.Group(); g.position.set(side * .16, .002, .16);
      const m = cutMesh(P.register(.16, .13, 40), { shadow: false }); m.position.x = side * .08;
      g.add(m); S.add(g); ex.fold.push({ g, side });
    }
    ex.brush = popper(L, s, S, P.card(.01, .05, '', '#c9a24a', '#2a2030', 0), .06, .02, .1, { d: .7, pop: false });
    ex.stamp81 = popper(L, s, S, P.stamp(.022), .04, .002, .17, { d: .9, pop: false });
    ex.pre = popper(L, s, S, { ...fig('monk', { prop: 'staff' }), w: .018, h: .024 }, -.1, .01, .08, { d: 1.1, pop: false });
    ex.wukongRiver = popper(L, s, S, { ...fig('monkey', { prop: 'staff' }), w: .026, h: .034 }, .13, 0, .2, { d: 1.3, pop: false });
  }

  // ===== 3 · the shelf =====
  {
    const s = 3;
    popper(L, s, K, P.shelf(.4, .14), 0, .02, .006, { d: 0, dir: -1 });
    ex.demons = [];
    const cols = [{}, { pal: { robe: '#3f5f7a', robeS: '#2a4257', skin: '#c98f5e', skinS: '#a86f45' } }, { pal: { robe: '#7a5a2a', robeS: '#5a3f1a', skin: '#e0a0a0', skinS: '#c08080' } }, { pal: { robe: '#3f6a4a', robeS: '#2a4a34', skin: '#b8c98a', skinS: '#94a86a' } }];
    for (let i = 0; i < 4; i++) {
      const r = popper(L, s, S, { ...fig('demon', { mouth: i % 2 ? 'grin' : 'o', ...cols[i] }), w: .026, h: .034 }, -.15 + i * .1, .02, .07, { d: .3 + i * .1 });
      ex.demons.push(r);
    }
    ex.rhinos = [];
    for (let i = 0; i < 3; i++) {
      const r = popper(L, s, S, { ...fig('demon', { pal: { robe: '#5a5a5a', robeS: '#3a3a3a', skin: '#8a8a7a', skinS: '#6a6a5a' }, mouth: 'flat' }), w: .022, h: .03 }, -.06 + i * .06, .02, .2, { d: .8 + i * .1 });
      ex.rhinos.push(r);
    }
    ex.owners = [];
    for (const [i, txt] of ['LÃO TỬ', 'VĂN THÙ', 'QUÁN ÂM'].entries()) {
      const g = new THREE.Group(); g.position.set(-.14 + i * .14, .12, .12);
      const t = cutMesh(P.tag(.06, .018, txt)); t.position.y = .012; g.add(t);
      const th = thread(.1); g.add(th);
      S.add(g); ex.owners.push(g);
    }
    ex.tags = [];
    for (let i = 0; i < 4; i++) ex.tags.push(popper(L, s, S, P.tag(.032, .012, ['LÒ VÀNG', 'SƯ TỬ', 'CÁ SEN', 'LÔNG VÀNG'][i]), -.15 + i * .1, .052, .07, { d: .5 + i * .1 }));
  }

  // ===== 4 · the sutras =====
  {
    const s = 4;
    ex.scrolls = [];
    for (let i = 0; i < 12; i++) {
      const r = popper(L, s, K, P.scroll(.032, .1, false), -.19 + (i % 6) * .075, .02 + Math.floor(i / 6) * .12, .008, { d: .05 * i, dir: -1 });
      ex.scrolls.push(r);
    }
    const table = popper(L, s, S, P.card(.2, .012, '', '#c9a24a', '#2a2030', 0), 0, .002, .18, { d: .5, pop: false });
    ex.table = table;
    ex.bowl = popper(L, s, S, P.bowl(.022), -.05, .016, .18, { d: .8, pop: false });
    ex.blank = [];
    for (let i = 0; i < 3; i++) ex.blank.push(popper(L, s, S, P.scroll(.03, .01, true), -.06 + i * .04, .02, .14, { d: .9 + i * .1, pop: false }));
    ex.att = [];
    for (const side of [-1, 1]) ex.att.push(popper(L, s, S, { ...fig('attend', { mouth: 'grin', armL: .5, armR: 1.2 }), w: .026, h: .034 }, side * .1, 0, .12, { d: 1.0, pop: false }));
  }

  // ===== 5 · the river =====
  {
    const s = 5;
    ex.waves = [];
    for (let i = 0; i < 3; i++) ex.waves.push(popper(L, s, S, P.waveStrip(.44, .045, ['#6f9a8a', '#5f8a7a', '#4f7a6a'][i], 3 + i), 0, .002 + i * .002, .08 + i * .05, { d: .05 * i, pop: false }));
    ex.turtle = popper(L, s, S, P.turtle(.09), -.02, .004, .14, { d: .5, pop: false });
    ex.packets = [];
    for (let i = 0; i < 3; i++) ex.packets.push(popper(L, s, S, P.scroll(.045, .016, false), -.02 + i * .03, .012, .15, { d: .7, pop: false }));
    ex.riverParty = [];
    for (const [k, o, x] of [['monk', { prop: 'staff' }, -.06], ['monkey', { prop: 'staff' }, -.02], ['pig', { prop: 'rake' }, .02], ['sand', { prop: 'spade' }, .06]]) {
      ex.riverParty.push(popper(L, s, S, { ...fig(k, o), w: .026, h: .034 }, x, .008, .15, { d: .6, pop: false }));
    }
    ex.tear = popper(L, s, S, P.tear(.1, .06), .1, .004, .22, { d: .9, pop: false });
  }

  // ===== 6 · the ford =====
  {
    const s = 6;
    ex.boat = popper(L, s, S, P.boat(.1), -.02, .002, .16, { d: .2, pop: false });
    ex.fordParty = [];
    for (const [k, o, x] of [['monk', { prop: 'staff' }, -.04], ['monkey', { prop: 'staff' }, -.005], ['pig', { prop: 'rake' }, .025], ['sand', { prop: 'spade' }, .055]]) {
      ex.fordParty.push(popper(L, s, S, { ...fig(k, o), w: .024, h: .032 }, x, .02, .16, { d: .3, pop: false }));
    }
    ex.corpse = popper(L, s, S, P.corpse(.05), -.12, .006, .1, { d: .5, pop: false });
    ex.thrones = [];
    for (const side of [-1, 1]) {
      const g = new THREE.Group(); g.position.set(side * .12, .01, .06);
      const l = cutMesh(P.lotus(.028)); g.add(l);
      const f = cutMesh({ ...fig(side < 0 ? 'monk' : 'monkey', { prop: 'staff' }), w: .02, h: .028 }); f.position.y = .012; g.add(f);
      S.add(g); ex.thrones.push(g);
    }
    ex.band = popper(L, s, S, P.band(.025), 0, .02, .12, { d: .7, pop: false });
  }
  return { L, ex };
}

export function updatePops(L, t) {
  for (const r of L) {
    const k = riseOf(r, t);
    r.g.visible = k > .001;
    r.g.scale.y = Math.max(.001, k);
    r.g.rotation.x = (1 - k) * (r.dir < 0 ? -.9 : .9);
    if (r.sway) r.g.rotation.z = Math.sin(t * 1.4 + r.ph) * r.sway;
    r.m.position.y = 0;
  }
}
