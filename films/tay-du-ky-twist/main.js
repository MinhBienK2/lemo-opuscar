// MỘT VÒNG LỘN, MƯỜI BỐN NĂM — the film: scene, book, spreads, camera, render(t)
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { clamp, lerp, seg, ss, eio, eo, back, TAU, mulberry, track } from './lib.js';
import { cv, paperFill, INK } from './paper.js';
import { makeBook, coverCanvases, texOf, BW, BD, PG } from './book.js';
import { pages, buildSets, updatePops } from './sets2.js';
import { cutMesh, particles, blobShadow } from './cutmesh.js';
import { makePost } from './post.js';
import * as HUD from './hud.js';
import * as T from './timing.js';

const W = 1920, H = 1080;
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('stage').appendChild(renderer.domElement);
const ov = document.getElementById('ov'), OX = ov.getContext('2d');
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(30, W / H, .004, 30);
const post = makePost(renderer, scene, cam, W, H);

// ---------- assets ----------
await Promise.all([
  '500 40px Fredoka', '600 40px Fredoka', '700 40px Fredoka',
  '700 40px "Be Vietnam Pro"', '800 40px "Be Vietnam Pro"', '900 40px "Be Vietnam Pro"',
  '40px "Lilita One"',
].map(f => document.fonts.load(f, 'ẦữộợẩẤỆỐ')));
const hdr = await new RGBELoader().loadAsync('assets/lythwood_lounge_2k.hdr');
hdr.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = hdr; scene.background = hdr; scene.backgroundBlurriness = .35;
scene.backgroundRotation.set(0, 2.1, 0); scene.environmentRotation.set(0, 2.1, 0);

const tl = new THREE.TextureLoader();
const wt = n => { const t = tl.load(`assets/walnut_${n}.jpg`); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2.4, 1.6); t.anisotropy = 12; return t; };
const wdiff = wt('diff'); wdiff.colorSpace = THREE.SRGBColorSpace;
const deskMat = new THREE.MeshStandardMaterial({ map: wdiff, normalMap: wt('nor'), roughnessMap: wt('rough'), color: '#b98f6a', envMapIntensity: .55, roughness: .85 });
const desk = new THREE.Mesh(new THREE.BoxGeometry(2.8, .04, 1.8), deskMat);
desk.position.set(0, -.021, .26); desk.receiveShadow = true; scene.add(desk);
// lamp: stand, arm, shade, bulb
const brass = new THREE.MeshStandardMaterial({ color: '#b98a3a', metalness: .9, roughness: .35 });
const lampG = new THREE.Group(); lampG.position.set(-.42, 0, .58);
const base = new THREE.Mesh(new THREE.CylinderGeometry(.06, .075, .018, 32), brass); base.position.y = .009; lampG.add(base);
const stem = new THREE.Mesh(new THREE.CylinderGeometry(.008, .008, .34, 12), brass); stem.position.y = .18; lampG.add(stem);
const arm = new THREE.Mesh(new THREE.CylinderGeometry(.007, .007, .3, 12), brass); arm.position.set(.11, .34, -.02); arm.rotation.z = -1.0; lampG.add(arm);
const shade = new THREE.Mesh(new THREE.ConeGeometry(.11, .09, 32, 1, true), new THREE.MeshStandardMaterial({ color: '#2f4a44', metalness: .4, roughness: .5, side: THREE.DoubleSide }));
shade.position.set(.23, .42, -.02); shade.rotation.z = .35; lampG.add(shade);
const bulb = new THREE.Mesh(new THREE.SphereGeometry(.026, 20, 14), new THREE.MeshStandardMaterial({ color: '#fff3d8', emissive: '#ffd9a0', emissiveIntensity: 4 }));
bulb.position.set(.225, .40, -.02); lampG.add(bulb);
lampG.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
scene.add(lampG);
// a cup and a pencil
const cup = new THREE.Mesh(new THREE.CylinderGeometry(.032, .027, .06, 28), new THREE.MeshStandardMaterial({ color: '#e8e0d0', roughness: .5 }));
cup.position.set(.46, .03, .5); cup.castShadow = cup.receiveShadow = true; scene.add(cup);
const pencil = new THREE.Mesh(new THREE.CylinderGeometry(.004, .004, .16, 6), new THREE.MeshStandardMaterial({ color: '#e0a83a', roughness: .55 }));
pencil.rotation.set(0, .6, Math.PI / 2); pencil.position.set(-.06, .004, .62); pencil.castShadow = true; scene.add(pencil);

// ---------- the book ----------
const cover = coverCanvases((x, px, py, w, h) => {
  // a small paper monkey on the cover medallion
  x.save(); x.beginPath(); x.arc(px + w / 2, py + h / 2, Math.min(w, h) * .46, 0, TAU); x.clip();
  x.fillStyle = '#f4e9cf'; x.fillRect(px, py, w, h);
  x.fillStyle = '#e6c98e'; x.beginPath(); x.ellipse(px + w * .5, py + h * .95, w * .55, h * .3, 0, 0, TAU); x.fill();
  x.fillStyle = '#c0562e'; x.beginPath(); x.arc(px + w * .5, py + h * .5, w * .26, 0, TAU); x.fill();
  x.fillStyle = '#e8c9a0'; x.beginPath(); x.ellipse(px + w * .5, py + h * .52, w * .17, h * .16, 0, 0, TAU); x.fill();
  x.fillStyle = '#2a2030'; x.beginPath(); x.arc(px + w * .44, py + h * .5, 5, 0, TAU); x.arc(px + w * .56, py + h * .5, 5, 0, TAU); x.fill();
  x.restore();
});
// the cover title is Vietnamese, so the title is drawn here, not in book.js
{
  const x = cover.c.getContext('2d'), w = cover.c.width, h = cover.c.height, y = cover.m.getContext('2d');
  const gold = (k, col, fn) => { k.save(); fn(k, col); k.restore(); };
  const both = fn => { gold(x, '#e0b456', fn); gold(y, 'rgb(0,90,255)', fn); };
  both((k, col) => {
    k.fillStyle = col; k.textAlign = 'center';
    k.font = '150px "Lilita One"'; k.fillText('MỘT VÒNG LỘN', w * .62, h * .34);
    k.font = '176px "Lilita One"'; k.fillText('MƯỜI BỐN NĂM', w * .62, h * .53);
    k.font = '800 62px "Be Vietnam Pro"'; k.fillText('TÂY DU KÝ & VỞ KỊCH THỈNH KINH', w * .62, h * .66);
    k.font = 'italic 56px "Be Vietnam Pro"'; k.fillText('một cuốn sách bật lên', w * .62, h * .78);
  });
}
const book = makeBook(cover);
scene.add(book.root);
const P = pages(), PT = {}; for (const k in P) PT[k] = texOf(P[k]);
const SPREAD = [
  { sky: PT.sky0, ground: PT.ground0 }, { sky: PT.sky1, ground: PT.ground1 },
  { sky: PT.sky2, ground: PT.ground2 }, { sky: PT.sky3, ground: PT.ground3 },
  { sky: PT.sky4, ground: PT.ground4 }, { sky: PT.sky5, ground: PT.ground5 },
  { sky: PT.sky6, ground: PT.ground6 },
];
const { L: POPS, ex: EX } = buildSets(book);

// ---------- lights ----------
const spot = new THREE.SpotLight('#fff0dc', 0, 3.2, .8, .55, 2);
spot.position.set(-.2, .44, .56); spot.target.position.set(.02, 0, .18);
spot.castShadow = true; spot.shadow.mapSize.set(2048, 2048); spot.shadow.bias = -.00006; spot.shadow.normalBias = .0004; spot.shadow.radius = 4;
spot.shadow.camera.near = .05; spot.shadow.camera.far = 2;
scene.add(spot, spot.target);
const bulbLight = new THREE.PointLight('#ffcf94', 0, .7, 2); bulbLight.position.set(-.195, .40, .56); scene.add(bulbLight);
const sun = new THREE.DirectionalLight('#fff3e0', 0); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -.00008; sun.shadow.normalBias = .0003; sun.shadow.radius = 4;
Object.assign(sun.shadow.camera, { left: -.3, right: .3, top: .3, bottom: -.3, near: .1, far: 3 });
sun.target.position.set(0, .05, .12); scene.add(sun, sun.target);
const hemi = new THREE.HemisphereLight('#cfe6ff', '#caa27a', 0); scene.add(hemi);

// ---------- dust in the lamp beam ----------
const glowTex = (() => {
  const c = cv(64, 64), x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.3, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const dust = particles(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: new THREE.Color(1.2, 1.0, .75) }), 70, (i, t) => {
  const on = 1 - seg(t, T.OPEN[1] + 2, T.OPEN[1] + 5);
  if (on <= 0) return null;
  const R = mulberry(i * 7 + 1), sp = .003 + R() * .005;
  return { x: lerp(-.36, -.05, R()) + Math.sin(t * .3 + i) * .02, y: .02 + ((R() * .4 + t * sp) % .4), z: lerp(.2, .62, R()), s: (.0016 + R() * .002) * on };
});
scene.add(dust);

// ---------- helpers ----------
const line = id => T.L[id];
const at = (id, off = 0) => T.L[id].t0 + off;
const end = (id, off = 0) => T.L[id].t1 + off;

// ---------- camera shots ----------
// Each shot: [t0, t1, pos0, tgt0, pos1, tgt1, fov, aper, focusOffset?]
const S = (t0, t1, p0, q0, p1, q1, fov = 30, aper = 2.6) => ({ t0, t1, p0, q0, p1, q1, fov, aper });
const V = (x, y, z) => [x, y, z];
const SH = [];
const openEnd = T.OPEN[1];
// A · cold open
SH.push(S(0, 2.6, V(.46, .24, 1.05), V(-.02, .10, .2), V(.28, .30, .86), V(-.01, .07, .18), 34, 3.0));
SH.push(S(2.6, at('a1') - .1, V(.10, .38, .70), V(-.02, .04, .16), V(.02, .34, .60), V(-.02, .03, .16), 30, 2.4));
SH.push(S(at('a1') - .1, openEnd + .9, V(.02, .36, .62), V(-.02, .04, .16), V(.0, .20, .70), V(0, .08, .12), 30, 2.0));
// A2 · the road
SH.push(S(openEnd + .9, at('a4'), V(0, .17, .72), V(0, .07, .1), V(-.02, .10, .55), V(-.03, .04, .12), 30, 2.2));
SH.push(S(at('a4'), end('a5'), V(-.02, .075, .44), V(-.03, .035, .15), V(.02, .06, .34), V(.0, .03, .16), 30, 2.5));
// B · hall
SH.push(S(at('b1'), end('b2'), V(0, .30, .78), V(0, .10, .1), V(0, .16, .55), V(0, .08, .11), 30, 2.2));
SH.push(S(at('b3'), end('b5'), V(-.10, .10, .40), V(-.11, .04, .12), V(-.06, .08, .33), V(-.09, .04, .12), 30, 2.4));
SH.push(S(at('b5') + .2, end('b7'), V(0, .145, .50), V(0, .05, .19), V(0, .135, .47), V(0, .05, .19), 32, 2.4));
SH.push(S(end('b7') - .2, end('b8'), V(0, .24, .70), V(0, .07, .1), V(0, .26, .74), V(0, .07, .1), 30, 2.0));
// C · register
SH.push(S(at('c1'), end('c3'), V(0, .34, .72), V(0, .04, .15), V(0, .19, .50), V(0, .03, .15), 30, 2.2));
SH.push(S(at('c3') + .2, end('c4'), V(.02, .22, .44), V(.02, .02, .15), V(.05, .12, .33), V(.05, .02, .15), 30, 2.6));
SH.push(S(at('c5'), end('c6'), V(.06, .09, .30), V(.06, .02, .18), V(.06, .10, .29), V(.06, .02, .19), 30, 2.8));
SH.push(S(at('c7'), end('c7'), V(-.10, .10, .34), V(-.10, .03, .08), V(-.10, .08, .30), V(-.10, .03, .08), 30, 2.6));
SH.push(S(at('c8'), end('c8'), V(0, .28, .66), V(0, .05, .14), V(0, .30, .70), V(0, .05, .14), 30, 2.0));
// D · shelf
SH.push(S(at('d1'), end('d2'), V(0, .26, .70), V(0, .10, .1), V(0, .14, .46), V(0, .09, .08), 30, 2.2));
SH.push(S(at('d3'), end('d4'), V(-.16, .10, .34), V(-.15, .06, .06), V(-.02, .10, .34), V(-.02, .06, .06), 30, 2.5));
SH.push(S(at('d4') + .1, end('d5'), V(-.13, .17, .42), V(-.13, .08, .09), V(-.13, .16, .40), V(-.13, .08, .09), 32, 2.6));
SH.push(S(at('d6'), end('d8'), V(.10, .12, .34), V(.08, .06, .06), V(-.06, .12, .34), V(-.06, .06, .06), 30, 2.6));
SH.push(S(at('d9'), end('d10'), V(.02, .10, .28), V(.02, .05, .12), V(.02, .10, .27), V(.02, .05, .12), 30, 2.8));
SH.push(S(at('d11'), end('d13'), V(0, .11, .34), V(0, .03, .2), V(0, .10, .30), V(0, .03, .2), 30, 2.7));
// E · sutras
SH.push(S(at('e1'), end('e3'), V(0, .28, .72), V(0, .12, .08), V(0, .16, .50), V(0, .10, .1), 30, 2.2));
SH.push(S(at('e4'), end('e6'), V(-.05, .09, .32), V(-.05, .03, .16), V(-.02, .09, .30), V(-.02, .03, .16), 30, 2.6));
SH.push(S(at('e7'), end('e9'), V(-.05, .07, .26), V(-.05, .025, .18), V(-.04, .07, .25), V(-.04, .025, .18), 30, 2.8));
SH.push(S(at('e10'), end('e12'), V(0, .22, .60), V(0, .06, .1), V(0, .24, .64), V(0, .06, .1), 30, 2.0));
SH.push(S(at('e13'), end('e15'), V(.0, .34, .84), V(.0, .06, .18), V(.0, .38, .9), V(.0, .06, .18), 32, 2.4));
// F · river
SH.push(S(at('f1'), end('f2'), V(0, .26, .74), V(0, .05, .12), V(0, .12, .46), V(0, .04, .14), 30, 2.2));
SH.push(S(at('f3'), end('f4'), V(-.02, .08, .30), V(-.02, .03, .14), V(-.02, .07, .28), V(-.02, .03, .14), 30, 2.7));
SH.push(S(at('f4') + .2, end('f5'), V(.02, .12, .40), V(.02, .02, .16), V(.02, .10, .34), V(.02, .02, .16), 30, 2.6));
SH.push(S(at('f5') + .3, end('f6'), V(.09, .06, .28), V(.09, .02, .21), V(.09, .055, .26), V(.09, .02, .21), 30, 3.0));
SH.push(S(at('f7'), end('f10'), V(0, .22, .62), V(0, .04, .12), V(0, .24, .66), V(0, .04, .12), 30, 2.0));
// G · ford
SH.push(S(at('g1'), end('g2'), V(0, .28, .74), V(0, .05, .12), V(0, .13, .48), V(0, .04, .14), 30, 2.2));
SH.push(S(at('g3'), end('g4'), V(-.10, .09, .30), V(-.10, .03, .10), V(-.06, .08, .28), V(-.06, .03, .12), 30, 2.7));
SH.push(S(at('g5'), end('g6'), V(.06, .12, .36), V(.06, .05, .08), V(.06, .11, .33), V(.06, .05, .08), 30, 2.6));
SH.push(S(at('g7'), end('g8'), V(0, .09, .28), V(0, .03, .12), V(0, .09, .27), V(0, .03, .12), 30, 2.9));
SH.push(S(at('g9'), T.DUR - 6, V(0, .20, .58), V(0, .05, .12), V(.36, .30, .96), V(.0, .06, .18), 32, 2.6));
SH.push(S(T.DUR - 6, T.DUR, V(.42, .26, 1.02), V(-.02, .10, .2), V(.5, .24, 1.06), V(-.02, .10, .2), 34, 3.0));
const SHOTS = SH.map(s => ({ ...s, f: track([[s.t0, [...s.p0, ...s.q0, s.fov, s.aper]], [s.t1, [...s.p1, ...s.q1, s.fov, s.aper]]]) }));
function camAt(t) {
  let s = SHOTS[0]; for (const x of SHOTS) if (t >= x.t0) s = x;
  const v = s.f(t);
  return { pos: new THREE.Vector3(v[0], v[1], v[2]), tgt: new THREE.Vector3(v[3], v[4], v[5]), fov: v[6], aper: v[7] };
}

// ---------- light ----------
function lightsAt(t) {
  const open = seg(t, T.OPEN[0], T.OPEN[0] + 1.2) * (1 - seg(t, T.CLOSE[0], T.CLOSE[1]));
  const real = 1 - open;
  const night = seg(t, at('f1'), at('f1') + 1) * (1 - seg(t, T.TURNS[5][0], T.TURNS[5][1]));
  return { sunI: open * (2.4 - night * .7), lampI: real * 2.6 + open * .35, hemiI: .12 + open * .55, envI: .5 * real + open * .42, exp: 1 };
}

// ---------- sound events ----------
const EV = [];
EV.push({ t: T.OPEN[0], type: 'creak' }, { t: T.OPEN[1] - .15, type: 'thump' });
for (const r of POPS) EV.push({ t: T.RISE[r.spread] + r.d + .12, type: 'pop', s: r.spread });
for (const [a, b] of T.TURNS) EV.push({ t: a + .5, type: 'page', d: b - a - .8 });
EV.push({ t: T.CLOSE[0], type: 'creak' }, { t: T.CLOSE[1], type: 'thump' });
for (const c of T.CH) EV.push({ t: c.t0 - 2.2, type: 'stamp' });
for (const s of T.STAMPS) EV.push({ t: s, type: 'stamp' });
for (const s of T.POPSFX) EV.push({ t: s.t, type: s.type });
EV.push({ t: at('f5') + .4, type: 'tear' }, { t: at('g3'), type: 'water' }, { t: at('f4'), type: 'splash' });
EV.sort((a, b) => a.t - b.t);
window.EV = EV; window.DUR = T.DUR;

// ---------- render ----------
const tmpV = new THREE.Vector3();
function toScreen(v) { const p = v.clone().project(cam); if (p.z > 1) return null; return [(p.x * .5 + .5) * W, (-p.y * .5 + .5) * H]; }

window.render = function (t) {
  // book open / close
  const op = eio(seg(t, T.OPEN[0], T.OPEN[1])) * (1 - eio(seg(t, T.CLOSE[0], T.CLOSE[1])));
  book.setOpen(Math.PI / 2 * op + (t > T.OPEN[0] - .8 && t < T.OPEN[0] ? Math.sin(t * 60) * .004 * seg(t, T.OPEN[0] - .8, T.OPEN[0]) : 0));
  let spread = 0, turning = -1;
  for (let i = 0; i < T.TURNS.length; i++) {
    if (t >= T.TURNS[i][0] + .5) spread = i + 1;
    if (t >= T.TURNS[i][0] + .5 && t < T.TURNS[i][1] - .3) turning = i;
  }
  book.groundMat.map = SPREAD[spread].ground; book.groundMat.needsUpdate = true;
  book.backMat.map = SPREAD[turning >= 0 ? turning : spread].sky; book.backMat.needsUpdate = true;
  if (turning >= 0) {
    const a = T.TURNS[turning][0] + .5, b = T.TURNS[turning][1] - .3;
    book.leafFront.material.map = SPREAD[turning].ground; book.leafBack.material.map = SPREAD[turning + 1].sky;
    book.leafFront.material.emissiveMap = book.leafFront.material.map; book.leafBack.material.emissiveMap = book.leafBack.material.map;
    book.leafFront.material.needsUpdate = book.leafBack.material.needsUpdate = true;
    book.setLeaf(eio(seg(t, a, b)));
  } else book.setLeaf(0);
  updatePops(POPS, t);

  // mechanisms
  const bobbing = (arr, on, amp = .0008) => arr.forEach((r, i) => { r.g.position.y = (r.g.userData.y0 ?? (r.g.userData.y0 = r.g.position.y)) + (on ? Math.abs(Math.sin(t * 4 + i)) * amp : 0); });
  // road: the strip slides, the party bobs
  if (EX.road) {
    const walking = seg(t, at('a2'), end('a4')) * (1 - seg(t, end('a5') - .3, end('a5')));
    EX.road.g.position.x = -0.02 * eio(seg(t, at('a2'), end('a4')));
    bobbing(EX.party, walking > .5 && t < end('a5'), .0007);
  }
  // hall: the four job cards flip open on the three names + the monk
  if (EX.cards) EX.cards.forEach((r, i) => {
    const t0 = at('b6') + [0, .55, 1.5, 2.5][i];
    const k = back(seg(t, t0, t0 + .5), 1.5);
    r.g.visible = k > .001; r.g.scale.set(k, Math.max(.001, k), 1); r.g.rotation.y = (1 - k) * -1.2;
  });
  // register: gatefold, brush, stamp
  if (EX.fold) EX.fold.forEach(({ g, side }, i) => {
    const k = eio(seg(t, at('c8') - .4, at('c8') + .5));
    g.rotation.z = side * -1.35 * (1 - k);
    g.visible = t > at('c1') - .5 && t < T.FOLD[2] + .5;
  });
  if (EX.brush) EX.brush.g.rotation.z = -0.4 + Math.sin(t * 9) * .05 * (t > at('c4') && t < end('c5') ? 1 : 0);
  if (EX.stamp81) {
    const k = seg(t, at('c5') + .2, at('c5') + .5);
    EX.stamp81.g.position.y = .002 + (1 - back(k, 1.4)) * .06;
    EX.stamp81.g.scale.setScalar(.6 + .4 * ss(k));
    EX.stamp81.g.visible = t > at('c5');
  }
  if (EX.pre) {
    const k = seg(t, at('c7') + .2, at('c7') + 1.2);
    EX.pre.g.position.y = .01 + (1 - k) * .09;
    EX.pre.g.rotation.z = -.3 * k;
    EX.pre.g.visible = t > at('c7');
  }
  // shelf: owners descend, demons lift on strings, rhinos cut
  if (EX.owners) EX.owners.forEach((g, i) => {
    const t0 = at(['d2', 'd6', 'd7'][i]) + .3;
    g.position.y = .12 + (1 - eio(seg(t, t0, t0 + .7))) * .14;
    g.visible = t > t0 - .2;
    g.rotation.z = Math.sin(t * 1.6 + i) * .04;
  });
  if (EX.demons) EX.demons.forEach((r, i) => {
    const lift = eio(seg(t, at('d4') + .5 + i * .1, at('d4') + 1.3 + i * .1));
    r.g.position.y = .02 + lift * .05;
    r.g.rotation.z = Math.sin(t * 1.8 + i) * .05;
  });
  if (EX.rhinos) EX.rhinos.forEach((r, i) => {
    const cut = seg(t, at('d11') + .2 + i * .25, at('d11') + .5 + i * .25);
    r.g.rotation.z = -.25 * cut; r.g.scale.x = 1 - .25 * cut;
    r.g.visible = t > at('d10');
  });
  // sutras: bowl slides, blanks flip
  if (EX.bowl) EX.bowl.g.position.x = lerp(-.05, .04, eio(seg(t, at('e8'), at('e8') + 1.0)));
  if (EX.blank) EX.blank.forEach((r, i) => { r.g.rotation.y = (1 - eio(seg(t, at('e4') + i * .3, at('e4') + .6 + i * .3))) * -1.4; });
  // river: turtle flips, packets fall, tear grows
  if (EX.turtle) EX.turtle.g.rotation.z = .5 * eio(seg(t, at('f4'), at('f4') + .6));
  if (EX.packets) EX.packets.forEach((r, i) => {
    const k = eio(seg(t, at('f4') + .2 + i * .12, at('f4') + .9 + i * .12));
    r.g.position.y = .012 - k * .012; r.g.rotation.z = .8 * k;
  });
  if (EX.tear) {
    const k = eio(seg(t, at('f5') + .3, at('f5') + 1.4));
    EX.tear.g.scale.set(Math.max(.001, k), 1, 1);
    EX.tear.g.visible = t > at('f5') + .3;
  }
  // ford: boat drifts, corpse floats, band breaks
  if (EX.boat) EX.boat.g.position.x = lerp(-.02, .0, seg(t, at('g2'), at('g4')));
  if (EX.fordParty) bobbing(EX.fordParty, t > at('g2') && t < end('g4'), .0006);
  if (EX.corpse) {
    const k = seg(t, at('g3') - .2, end('g4'));
    EX.corpse.g.position.x = lerp(-.16, .02, k);
    EX.corpse.g.rotation.z = Math.sin(t * 2) * .05;
  }
  if (EX.band) { const k = seg(t, at('g7'), at('g7') + .8); EX.band.g.scale.setScalar(1 - .6 * k); EX.band.g.rotation.z = k * .4; }
  if (EX.thrones) EX.thrones.forEach((g, i) => { g.visible = t > at('g5') - .3; g.position.y = .01 + (1 - eio(seg(t, at('g5') + i * .2, at('g5') + .8 + i * .2))) * .1; });

  // lights
  const Lt = lightsAt(t);
  sun.intensity = Lt.sunI; sun.position.set(-.35, .55, .75);
  spot.intensity = Lt.lampI; bulbLight.intensity = Lt.lampI * .35; hemi.intensity = Lt.hemiI;
  scene.environmentIntensity = Lt.envI; scene.backgroundIntensity = .55 + Lt.envI * .4;
  // camera
  const C = camAt(t);
  cam.position.copy(C.pos); cam.fov = C.fov; cam.lookAt(C.tgt); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  post.dof.focus = C.pos.distanceTo(C.tgt); post.dof.aper = C.aper; post.dof.maxCoc = 13;
  post.vig.uniforms.fade.value = 1; post.vig.uniforms.warm.value = .14;
  post.bloom.strength = .16 + seg(t, T.OPEN[0], T.OPEN[0] + 1) * .12;
  for (const p of [dust]) p.userData.update(t);
  scene.updateMatrixWorld(true);
  post.composer.render();
  // overlay
  OX.clearRect(0, 0, W, H);
  HUD.draw(OX, t);
  if (t < 1.6 || t > T.DUR - 1.8) OX.fillStyle = `rgba(0,0,0,${1 - seg(t, 0, 1.6) * (1 - seg(t, T.DUR - 1.8, T.DUR))})`, OX.fillRect(0, 0, W, H);
};
window.DBG = { book, cam, EX, screen: (x, y, z) => toScreen(new THREE.Vector3(x, y, z)) };
window.TEXTS = t => HUD.texts(t);
window.render(0);
window.READY = true;
