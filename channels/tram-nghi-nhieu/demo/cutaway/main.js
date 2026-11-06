// Cutaway reference: a soda bottle on a table at night, sliced open toward the camera. 8 s, no voice.
// Sealed: gas sits dissolved (cyan specks). Cap off: specks gather into bubbles on the wall, rise, and a foam head climbs out.
import * as THREE from 'three';
import { film } from '../../rig/render.js';
import { PAL, toon, glowMat, canvasTex, TEX, rbox, mesh, fxLayer, mulberry, keys, seg, ss, eo, back, lerp, clamp } from '../../rig/kit.js';
import { keyLight, pool, ambience, wallWithHole, beam, shadowFlags } from '../../rig/lights.js';
import { sparks, setStreak } from '../../rig/fx.js';
import { vessel, fizz, dissolved, foam, PROFILES } from '../../rig/cutaway.js';

await document.fonts.load('900 54px "Be Vietnam Pro"');
const F = film({ fov: 34 }), camera = F.camera;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#10132a');
scene.fog = new THREE.Fog('#161b38', 7, 16);

// ── set: back wall with a window, a table running toward us ──
// the focus is lit by a lamp from the camera's side (cut faces must face the light); the moon only shapes the room
const lamp = pool(scene, { from: new THREE.Vector3(-2.4, 4.6, 5.0), to: new THREE.Vector3(.15, .9, 1.75), intensity: 3.4, angle: .34 });
// the window still prints its moonlight on the wall and the table: a second, weaker light from behind
const moon = keyLight(scene, { from: new THREE.Vector3(-5.2, 3.6, -2.2), to: new THREE.Vector3(-.8, 0, 1.6), intensity: 2.2, size: 3.5, color: '#9fb2ff' });
ambience(scene, { fill: .32 });
const wallMat = toon('#a9a0b8', { map: TEX.wall() }); wallMat.map.repeat.set(3, 2);
const WIN = { x0: -2.9, x1: -1.5, y0: 1.0, y1: 2.5 };
wallWithHole(scene, wallMat, { ...WIN, left: -5, right: 4, top: 4.2 });
const frame = toon('#e8dcc4');
for (const x of [WIN.x0, (WIN.x0 + WIN.x1) / 2, WIN.x1]) scene.add(mesh(rbox(.07, WIN.y1 - WIN.y0, .1, .02), frame, [x, (WIN.y0 + WIN.y1) / 2, .02]));
for (const y of [WIN.y0, (WIN.y0 + WIN.y1) / 2 + .1, WIN.y1]) scene.add(mesh(rbox(WIN.x1 - WIN.x0 + .07, .07, .1, .02), frame, [(WIN.x0 + WIN.x1) / 2, y, .02]));
// outside: sky card, moon, a branch whose shadow lands on the table
scene.add(mesh(new THREE.PlaneGeometry(9, 6), new THREE.MeshBasicMaterial({ color: '#1d2550', fog: false }), [-1, 2, -3], { cast: false }));
const moonDisc = mesh(new THREE.CircleGeometry(.32, 48), glowMat('#fff0d8', 1.6), [-3.6, 2.9, -2.9], { cast: false }); fxLayer(moonDisc); scene.add(moonDisc);
const branch = new THREE.Group(); branch.position.set(-2.6, 2.6, -.5); scene.add(branch);
const leafMat = toon('#24294a'), rb = mulberry(4);
branch.add(mesh(new THREE.CylinderGeometry(.02, .035, 1.6, 6), leafMat, [0, 0, 0], { rot: [0, 0, 1.1] }));
for (let i = 0; i < 7; i++) branch.add(mesh(new THREE.SphereGeometry(.075, 8, 6), leafMat, [-.7 + i * .16, .12 * Math.sin(i * 1.7) + .1 + (rb() - .5) * .1, (rb() - .5) * .15], { rot: [rb(), rb(), rb()] }));
const dust = beam(scene, moon, { ...WIN, length: 2.6, alpha: .07 });

const tableMat = toon('#ffffff', { map: TEX.floor() }); tableMat.map.repeat.set(1.5, 1.5);
scene.add(mesh(rbox(6, .16, 4.2, .03), tableMat, [0, -.08, 2.1]));
scene.add(mesh(rbox(6, .7, .1, .02), toon('#5b3d8f'), [0, -.5, 4.2])); // table apron toward us

// ── the bottle: sliced open toward the camera ──
const CAM0 = new THREE.Vector3(1.6, 1.4, 6.4);
const B = new THREE.Group(); B.position.set(.15, 0, 1.75); B.scale.setScalar(.8); scene.add(B);
B.rotation.y = Math.atan2(CAM0.x - B.position.x, CAM0.z - B.position.z) - .1;
const V = vessel(PROFILES.bottle, { thick: .045, cut: 1.9, shell: toon('#3f9a72'), face: toon('#cdeedd'), fill: 1.62, liquid: '#8a3a22', liquidAlpha: .62 });
B.add(V.group); V.group.userData.tag = 'bottle';
// paper label: a band on the body, cut like the shell
const labelTex = canvasTex(1024, 256, (g, w, h) => {
  g.fillStyle = '#f04462'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#fff0d8'; g.fillRect(0, 34, w, 12); g.fillRect(0, h - 46, w, 12);
  g.font = '900 120px "Be Vietnam Pro"'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const x of [w * .25, w * .75]) g.fillText('FIZZ', x, h / 2 + 6);
});
const band = [[.385, .55], [.385, 1.0]].map(([r, y]) => new THREE.Vector2(r, y));
B.add(mesh(new THREE.LatheGeometry(band, 128, V.cut / 2 + .02, Math.PI * 2 - V.cut - .04), toon('#ffffff', { map: labelTex, side: THREE.DoubleSide })));
// cap: ridged, red; it twists and flies at T_OPEN
const cap = new THREE.Group(); B.add(cap);
const capMat = toon('#f04462');
cap.add(mesh(new THREE.CylinderGeometry(.175, .175, .13, 24, 1), capMat, [0, .065, 0]));
for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; cap.add(mesh(rbox(.025, .12, .03, .01), capMat, [Math.sin(a) * .178, .065, Math.cos(a) * .178], { rot: [0, a, 0] })); }
scene.add(mesh(new THREE.CylinderGeometry(.5, .52, .03, 48), toon('#f7bd27'), [B.position.x, .015, B.position.z])); // coaster

// a glass waiting on the left, an opener, a book behind
const G = vessel(PROFILES.glass, { thick: .03, cut: .001, shell: toon('#9fd6e8', { transparent: true, opacity: .55 }), fill: .7, liquid: '#c58a3a', liquidAlpha: .5, shine: true });
G.group.position.set(-1.25, 0, 2.2); G.group.scale.setScalar(.8); scene.add(G.group);
for (let i = 0; i < 3; i++) scene.add(mesh(rbox(.16, .16, .16, .03), toon('#e8f6ff', { transparent: true, opacity: .8 }), [-1.25 + (i - 1) * .09, .5 + i * .06, 2.2 + (i % 2) * .06], { rot: [i, i * .7, 0] }));
const opener = new THREE.Group(); opener.position.set(1.15, .03, 2.55); opener.rotation.y = .5; scene.add(opener);
opener.add(mesh(rbox(.7, .04, .14, .02), toon('#c7c9d8'), [0, 0, 0])); opener.add(mesh(rbox(.36, .07, .17, .03), toon('#252d50'), [-.22, .01, 0]));
for (const [x, c, h] of [[1.3, '#9a5be5', .14], [1.32, '#f7bd27', .1], [1.28, '#67e8f9', .12]]) scene.add(mesh(rbox(1.1, h, .75, .02), toon(c), [x, .0 + h / 2 + (c === '#f7bd27' ? .14 : c === '#67e8f9' ? .24 : 0), .75], { rot: [0, .2, 0] }));

// warm light at the focus: the mouth of the bottle, it blooms when the cap goes
const warm = new THREE.PointLight(PAL.orange, 0, 3, 2); warm.position.set(B.position.x + .6, 2.3, B.position.z + 1.3); scene.add(warm);

// ── the mechanism ──
const T_OPEN = 2.4;
const rate = t => clamp((t - T_OPEN) / .35) * (1 - .4 * clamp((t - 5) / 3));
const fz = fizz(V, { rate, sites: 80, n: 1200 }); B.add(fz.mesh);
const ds = dissolved(V, { amount: t => 1 - .85 * ss(seg(t, T_OPEN, 6)) }); B.add(ds.mesh);
const fm = foam(V, { height: t => 1.25 * ss(seg(t, T_OPEN + .5, 7.2)) }); B.add(fm.mesh);
const puff = sparks(160, '#dff6ff', 1.6); B.add(puff);
shadowFlags(scene);

const cam = keys([[0, [1.5, 2.3, 6.4, -.45, .95, 1.6]], [2.2, [1.35, 2.25, 5.7, -.25, 1.0, 1.7]], [4.0, [1.1, 2.15, 5.0, -.05, 1.05, 1.75]], [8, [1.1, 2.35, 5.6, 0, 1.25, 1.75]]]);
const _p = new THREE.Vector3(), _v = new THREE.Vector3();
window.DUR = 8;
window.EV = [{ type: 'amb', kind: 'night', t: 0, t1: 8 }];
window.TEXTS = t => { window.render(t); return F.texts(); };
window.render = t => {
  const k = cam(t); camera.position.set(k[0], k[1], k[2]); camera.lookAt(k[3], k[4], k[5]); camera.updateProjectionMatrix();
  branch.rotation.z = .05 * Math.sin(t * .9);
  // cap: twist, then pop off up and to the right, spinning
  const tw = ss(seg(t, T_OPEN - .7, T_OPEN)), fly = Math.max(0, t - T_OPEN);
  cap.position.set(fly * .9, V.mouth + fly * 2.6 - 4.5 * fly * fly + .02 * tw, fly * .4);
  cap.rotation.set(fly * 5, tw * 1.4, fly * 2);
  cap.visible = cap.position.y > -1;
  // the gas escaping as the cap lifts: a short burst of streaks
  let n = 0; const r = mulberry(11);
  for (let i = 0; i < 160; i++) {
    const tb = T_OPEN + r() * .25, a = t - tb, life = .35 + r() * .3, vx = (r() - .5) * 2.2, vy = 1.5 + r() * 2, vz = (r() - .5) * 2.2;
    if (a < 0 || a > life) continue;
    _p.set(vx * a * .6, V.mouth + .05 + vy * a, vz * a * .6); _v.set(vx, vy, vz);
    setStreak(puff, n++, _p, _v, .12 * (1 - a / life) + .03, .012);
  }
  puff.count = n; puff.instanceMatrix.needsUpdate = true;
  warm.intensity = .9 * ss(seg(t, T_OPEN - .1, T_OPEN + .3)) * (1 - .5 * ss(seg(t, 4, 8))) + .25;
  fz.update(t); ds.update(t); fm.update(t);
  const fl = Math.max(0, 1 - Math.abs(t - T_OPEN - .05) / .18);
  F.frame(scene, { t, thick: 3.4, ref: 4, key: moon, flash: new THREE.Color(PAL.cyan).multiplyScalar(fl * .5), fade: Math.min(1, t / .25 + .15) });
};
window.render(0);
window.READY = true;
