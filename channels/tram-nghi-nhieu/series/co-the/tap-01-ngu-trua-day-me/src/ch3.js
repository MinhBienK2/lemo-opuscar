// Chapter 3 — Trong não lúc ngủ sâu: mạch máu, kênh chất lỏng quanh mạch, dòng dọn rác,
// mặt cắt của một mẩu não, và lúc tỉnh dậy giữa giấc ngủ sâu.
// Bốn nơi trong cùng một đầu: mạch máu và kênh của nó (giữa), mạng ống (sau bên phải),
// mẩu não bị cắt (bên phải xa), và vùng não còn tối khi tỉnh dậy giữa chừng (bên trái).
import * as THREE from 'three';
import { PAL, TEX, toon, rbox, mesh, fxLayer, clamp, lerp, seg, ss, mulberry } from '../../../../rig/kit.js';
import { flow, glowDots, setDot } from '../../../../rig/fx.js';
import { pool } from '../../../../rig/lights.js';
import { brainSpace, brainChunk, brainSkinTex, molecules, capillary } from '../../../../rig/brain.js';
import { makeShots } from './shots.js';

const TMP = new THREE.Vector3();

// The vessel lies open upward, so the camera looks down into the blood in it.
const OPEN = -2.44;           // how the half-pipe is tipped
const VY = -.10, VR = .20;    // the axis of the vessel and its radius
const CZ = .30, CY = -.24;    // the channel of fluid along its bank

// ── helpers ─────────────────────────────────────────────────────────────
// A blood vessel with its near half cut away, so the blood in it is visible. The two rim rings the
// channel rig draws are turned the other way round, so that they sit on the cut edges of the pipe.
function vessel({ len = 2.6, R = .16, seed = 4, cells = 26 } = {}) {
  const c = capillary({ len, R, seed, cells });
  // the inside of the pipe is in shadow, so its wall is lifted a little to keep the blood readable
  const wall = toon('#eda7b0', { side: THREE.DoubleSide });
  wall.emissive = new THREE.Color('#3d1720');
  c.children[0].material = wall;
  c.blood.mesh.material.color.set('#ff4a5e').multiplyScalar(1.7);
  c.blood.mesh.scale.setScalar(1.35);   // the red cells are a little bigger, so they read as cells
  c.add(c.blood.mesh);                  // the rig leaves the cells out of the pipe: put them in
  // the red cells drift along the pipe; they are placed with a real matrix, so they show up
  const br = mulberry(seed + 3), cells2 = [];
  for (let i = 0; i < cells; i++) cells2.push(br());
  c.blood.update = t => {
    c.blood.mesh.count = cells;
    for (let i = 0; i < cells; i++) {
      const s = (t * .16 + i / cells) % 1;
      const a = cells2[i] * 6.28;
      setDot(c.blood.mesh, i, TMP.set(-len / 2 + s * len, Math.sin(a) * R * .32, Math.cos(a) * R * .32), 1);
    }
    c.blood.mesh.instanceMatrix.needsUpdate = true;
  };
  for (const rim of c.children) if (rim.geometry && rim.geometry.type === 'TorusGeometry') {
    rim.rotation.set(0, -Math.PI / 2, Math.PI * .15);
  }
  return c;
}

// The groove of fluid that runs along the bank of a vessel: a floor, two low walls, and the fluid inside.
function channel(len) {
  const g = new THREE.Group();
  const wall = toon('#c98fa8');
  const floor = mesh(new THREE.BoxGeometry(len, .02, 1), toon('#e7d3dd'), [0, -.032, 0]);
  const wallB = mesh(new THREE.BoxGeometry(len, .045, .018), wall, [0, -.014, 0]);
  const wallF = mesh(new THREE.BoxGeometry(len, .045, .018), wall, [0, -.014, 0]);
  const fluid = mesh(new THREE.BoxGeometry(len, .014, 1), toon('#8fd7e8', {
    transparent: true, opacity: .45, emissive: new THREE.Color('#67e8f9').multiplyScalar(.18), depthWrite: false,
  }), [0, -.018, 0]);
  fluid.renderOrder = 3; fxLayer(fluid);
  g.add(floor, wallB, wallF, fluid);
  g.floor = floor; g.wallB = wallB; g.wallF = wallF; g.fluid = fluid;
  // w: how wide the groove is open; f: how much of it the fluid has reached
  g.setWidth = w => { floor.scale.z = w; fluid.scale.z = w * .9; wallB.position.z = -w; wallF.position.z = w; };
  g.setFill = f => { fluid.scale.x = Math.max(.001, f); fluid.position.x = -len / 2 + len * f / 2; };
  g.setWidth(0); g.setFill(0);
  return g;
}

// A clock with a face but no digits: one hand, twelve ticks.
function dialClock({ r = .22, ticks = 12, face = PAL.cream, rim = PAL.red } = {}) {
  const M = { cream: toon(face), red: toon(rim), navy: toon(PAL.navy) };
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(r, r, .05, 40), M.cream, [0, 0, .02], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.TorusGeometry(r, .025, 8, 40), M.red, [0, 0, .05]));
  for (let i = 0; i < ticks; i++) {
    const a = i / ticks * Math.PI * 2, big = i % 3 === 0;
    g.add(mesh(rbox(big ? .016 : .01, big ? .05 : .03, .01, .004), M.navy,
      [Math.sin(a) * r * .78, Math.cos(a) * r * .78, .05], { rot: [0, 0, -a] }));
  }
  const hand = new THREE.Group(); hand.position.z = .062; g.add(hand);
  hand.add(mesh(rbox(.018, r * .84, .012, .005), M.navy, [0, r * .36, 0]));
  hand.add(mesh(new THREE.ConeGeometry(.026, .06, 12), M.red, [0, r * .82, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.CylinderGeometry(.022, .022, .03, 12), M.red, [0, 0, .062], { rot: [Math.PI / 2, 0, 0] }));
  g.setFrac = f => { hand.rotation.z = -f * Math.PI * 2; };
  return g;
}

// A hollow of tissue, opened toward the camera: a little window into the brain.
function pod({ seed = 31, day = false } = {}) {
  const g = new THREE.Group();
  const skin = toon('#ffffff', { map: brainSkinTex(seed), side: THREE.DoubleSide });
  skin.color.setScalar(.72);
  g.add(mesh(new THREE.SphereGeometry(.26, 26, 16, 0, Math.PI * 2, 0, Math.PI * .52), skin, [0, 0, 0], { rot: [-Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.PlaneGeometry(.42, .42), toon(day ? '#e7d9b8' : '#141a3c'), [0, 0, -.17], { cast: false }));
  g.add(mesh(new THREE.CylinderGeometry(.032, .032, .44, 14), toon('#c9556a'), [0, .02, -.08], { rot: [0, 0, Math.PI / 2] }));
  const fl = mesh(rbox(.4, .018, .055, .007), toon(day ? '#a8d8e8' : '#67e8f9', {
    transparent: true, opacity: .5, emissive: new THREE.Color('#67e8f9').multiplyScalar(.35), depthWrite: false,
  }), [0, -.08, .03]);
  fl.renderOrder = 3; fxLayer(fl); g.add(fl);
  const w = molecules({ n: 10, color: '#f7bd27', size: .016, k: 1.5, seed: day ? 3 : 4 });
  g.add(w.mesh);
  g.waste = w; g.fluid = fl; g.day = day;
  return g;
}

export function build(scene, V) {
  const T = id => (V.L[id] ? V.L[id].t0 : 0);
  const W = (id, w) => V.w(id, w);

  // ── the place: inside a head, at night, one warm pool on the tissue ──
  const SP = brainSpace(scene, { seed: 3 });
  SP.amb.hemi.intensity = .28;
  SP.key.intensity = 2.1;
  const poolN = pool(scene, { from: new THREE.Vector3(2.3, 1.5, .9), to: new THREE.Vector3(2.3, -.2, -.7), intensity: 0, angle: .62 });
  const poolC = pool(scene, { from: new THREE.Vector3(-3.1, 1.7, 1.6), to: new THREE.Vector3(-3.6, 0, 0), intensity: 0, angle: .58 });

  // ── the tissue the whole thing sits in ──
  const massTex = brainSkinTex(3); massTex.repeat.set(2.2, 1);
  const massMat = toon('#ffffff', { map: massTex });
  const mass = brainChunk({ w: 2.8, d: 1.0, h: .8, seed: 3, cut: false, folds: 7, amp: .12 });
  mass.position.set(0, .238, -1.6);
  mass.traverse(o => { if (o.material) o.material = massMat; });
  scene.add(mass);

  // the patch of light that spreads back over the tissue
  const glowPatch = mesh(new THREE.PlaneGeometry(1.5, .85), new THREE.MeshBasicMaterial({
    map: TEX.radial(), color: new THREE.Color('#ffe9c4').multiplyScalar(1.1), transparent: true, opacity: 0,
    depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  }), [-.45, -.06, -1.09], { cast: false });
  glowPatch.renderOrder = 5; fxLayer(glowPatch);
  scene.add(glowPatch);

  // the ridge of tissue the vessel lies in
  const bedTex = brainSkinTex(7); bedTex.repeat.set(4, 1);
  const bedMat = toon('#ffffff', { map: bedTex });
  bedMat.color.setScalar(.62);
  const bed = mesh(rbox(3.2, .16, .9, .07), bedMat, [-.2, -.40, .02]);
  scene.add(bed);
  // a few soft lumps of tissue along its edge, so the ridge is not a plank
  const lumpMat = toon('#ffffff', { map: brainSkinTex(13) });
  lumpMat.color.setScalar(.6);
  for (const [x, z, s] of [[-1.25, .34, .22], [.5, .38, .19], [1.28, .22, .2], [-.55, -.35, .18]]) {
    const l = mesh(new THREE.SphereGeometry(s, 18, 12), lumpMat, [x, -.34, z]);
    l.scale.set(1.25, .55, 1); scene.add(l);
  }

  // a near edge of tissue, cut off by the frame: the foreground layer
  const fg = brainChunk({ w: 2.8, d: .9, h: .5, seed: 23, cut: false, folds: 3, amp: .05 });
  fg.position.set(0, -.55, 1.6);
  scene.add(fg);

  // ── the vessel ──
  const cap = vessel({ len: 2.8, R: VR, seed: 4, cells: 30 });
  cap.rotation.x = OPEN;
  cap.position.set(0, VY, 0);
  scene.add(cap);
  // a small warm light that reaches down into the open pipe, so the blood in it is seen
  const capLight = new THREE.PointLight('#ffd2a8', 0, 2.8, 2);
  capLight.position.set(0, .62, .34);
  scene.add(capLight);

  // ── the channel of fluid along its bank ──
  const CH = channel(2.4);
  CH.position.set(0, CY, CZ);
  scene.add(CH);

  // ── the stream itself: a slow one, and the surge of deep sleep ──
  const flowA = flow(new THREE.Vector3(-1.2, CY, CZ), new THREE.Vector3(1.55, CY, CZ),
    { color: '#6ec8ea', size: .024, lift: .006, n: 90, rate: .20, seed: 4, opacity: .16 });
  scene.add(flowA);
  const flowB = flow(new THREE.Vector3(-1.2, CY, CZ), new THREE.Vector3(1.55, CY, CZ),
    { color: '#b6e8ff', size: .03, lift: .006, n: 60, rate: .55, seed: 9, opacity: .15 });
  scene.add(flowB);

  // the small grains that drift in the stream, evenly spaced
  const sdots = glowDots(26, .013, '#dff6ff', 1.3);
  sdots.count = 26;
  scene.add(sdots);

  // ── the waste the brain makes ──
  const waste = glowDots(240, .022, '#f7bd27', 1.7);
  waste.count = 240;
  scene.add(waste);
  const rnd = mulberry(21), PW = [];
  for (let i = 0; i < 240; i++) PW.push({ x: -1.1 + rnd() * 2.2, a: 3.3 + rnd() * 1.6, r: VR + rnd() * .03, ph: rnd() * 6.28 });

  // ── the narrow cleft at the end of the channel ──
  const cleftSkin = toon('#ffffff', { map: brainSkinTex(11) });
  const cA = mesh(rbox(.6, .36, .18, .06), cleftSkin, [1.5, CY, CZ + .11]);
  const cB = mesh(rbox(.6, .36, .18, .06), cleftSkin, [1.5, CY, CZ - .11]);
  scene.add(cA, cB);

  // ── the network of tubes along every vessel ──
  const net = [];
  const netSpec = [
    { len: 1.9, R: .085, y: -.26, z: -.42, tilt: .02 },
    { len: 1.5, R: .07, y: -.30, z: -.72, tilt: -.04 },
    { len: 2.1, R: .095, y: -.22, z: -1.02, tilt: .03 },
    { len: 1.2, R: .062, y: -.32, z: -1.28, tilt: -.02 },
    { len: 1.7, R: .08, y: -.34, z: -.18, tilt: .05 },
    { len: 1.35, R: .066, y: -.20, z: -1.5, tilt: -.03 },
  ];
  for (let i = 0; i < netSpec.length; i++) {
    const s = netSpec[i];
    const g = new THREE.Group();
    g.position.set(2.3, s.y, s.z);
    g.rotation.z = s.tilt;
    const v = vessel({ len: s.len, R: s.R, seed: 20 + i, cells: 16 });
    v.rotation.x = OPEN;
    g.add(v);
    // the tube that hugs the vessel and runs parallel with it
    const tube = mesh(new THREE.CylinderGeometry(s.R * .5, s.R * .5, s.len * .95, 16, 1, true),
      toon('#8fd7e8', { transparent: true, opacity: 0, emissive: new THREE.Color('#67e8f9').multiplyScalar(.5), depthWrite: false, side: THREE.DoubleSide }),
      [0, -s.R * 1.45, s.R * .9], { rot: [0, 0, Math.PI / 2] });
    tube.renderOrder = 3; fxLayer(tube);
    g.add(tube);
    const dots = glowDots(16, .017, '#bff2ff', 1.6);
    dots.count = 16;
    g.add(dots);
    scene.add(g);
    net.push({ g, tube, dots, v, len: s.len, R: s.R });
  }

  // ── the two little windows into the tissue: day and night ──
  const podDay = pod({ seed: 31, day: true });
  podDay.position.set(.66, -.2, -1.02);
  scene.add(podDay);
  const podNight = pod({ seed: 32, day: false });
  podNight.position.set(1.3, -.2, -1.02);
  scene.add(podNight);

  // ── the clock inside the brain ──
  const brainClock = dialClock({ r: .21 });
  brainClock.position.set(-1.5, -.11, .38);
  brainClock.rotation.x = -.42;
  scene.add(brainClock);

  // ── the regions of the brain that are still dark ──
  const regL = brainChunk({ w: 1.0, d: 1.1, h: .55, seed: 9, cut: false, folds: 4, amp: .05 });
  regL.position.set(-4.15, -.002, 0);
  scene.add(regL);
  const regR = brainChunk({ w: 1.0, d: 1.1, h: .55, seed: 10, cut: false, folds: 4, amp: .05 });
  regR.position.set(-3.05, -.002, 0);
  scene.add(regR);
  const regLMat = toon('#ffffff', { map: brainSkinTex(9) });
  const regRMat = toon('#ffffff', { map: brainSkinTex(10) });
  regL.traverse(o => { if (o.material) o.material = regLMat; });
  regR.traverse(o => { if (o.material) o.material = regRMat; });

  // the bright nodes in the two regions, beating at different rates
  const nFast = glowDots(34, .022, '#ffd9a0', 2.2); nFast.count = 34;
  const nSlow = glowDots(34, .022, '#8f9dd8', 1.1); nSlow.count = 34;
  scene.add(nFast, nSlow);
  const nr = mulberry(29), NF = [], NS = [];
  for (let i = 0; i < 34; i++) NF.push({ x: -3.05 + nr() * .78, z: (nr() - .5) * .95, y: .27 + nr() * .05, ph: nr() * 6.28 });
  for (let i = 0; i < 34; i++) NS.push({ x: -4.15 + nr() * .78, z: (nr() - .5) * .95, y: .27 + nr() * .05, ph: nr() * 6.28 });

  // the mist that settles over a region that has just woken
  const mkMist = () => {
    const g = new THREE.Group(), ms = [];
    for (let i = 0; i < 5; i++) {
      const m = mesh(new THREE.SphereGeometry(.3 + i * .045, 18, 12), toon('#dbe7ff', { transparent: true, opacity: 0, depthWrite: false }), [(i - 2) * .09, .05 + (i % 2) * .06, (i % 3 - 1) * .07]);
      m.renderOrder = 6; fxLayer(m);
      g.add(m); ms.push(m);
    }
    g.mist = ms; return g;
  };
  const mistL = mkMist(); mistL.position.set(-4.15, .18, .02); scene.add(mistL);
  const mistR = mkMist(); mistR.position.set(-3.05, .18, .02); scene.add(mistR);

  // the light that comes in from the eyes
  const beam = mesh(new THREE.ConeGeometry(.44, 1.9, 26, 1, true), new THREE.MeshBasicMaterial({
    color: new THREE.Color('#ffe9c4').multiplyScalar(1.25), transparent: true, opacity: 0, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
  }), [-3.05, .3, 1.25], { rot: [-Math.PI / 2, 0, 0] });
  beam.renderOrder = 6; fxLayer(beam);
  scene.add(beam);

  // the clock with no numbers, at the corner of the frame
  const slowClock = dialClock({ r: .17, ticks: 12, face: '#e6ecf7' });
  slowClock.position.set(-2.62, -.30, .72);
  slowClock.rotation.x = -.3;
  scene.add(slowClock);

  // ── the camera: one shot per line, each a different size and angle ──
  const shots = makeShots(V, [
    { id: 'a_night_brain', area: 'a', line: 'c79', cam: [2.0, 1.25, 3.0, .1, -.15, -.3] },
    { id: 'a_channel_look', area: 'a', line: 'c80', cam: [1.0, .68, 1.35, .4, -.2, .24] },
    { id: 'a_channel_thin', area: 'a', line: 'c81', cam: [.35, .45, .85, .08, -.24, .27] },
    { id: 'a_flow_start', area: 'a', line: 'c82', cam: [-1.75, .6, 1.25, -.7, -.2, .25] },
    { id: 'a_hug_vessel', area: 'a', line: 'c83', cam: [1.1, .75, 1.0, .7, -.12, .1] },
    { id: 'a_stream_macro', area: 'a', line: 'c84', cam: [.28, .34, .78, .08, -.24, .28] },
    { id: 'a_into_gap', area: 'a', line: 'c85', cam: [2.05, .16, .34, 1.5, -.24, .3] },
    { id: 'a_wide_night', area: 'a', line: 'c86', cam: [1.2, 1.0, 2.2, .1, -.1, -.4] },
    { id: 'a_deep_flow', area: 'a', line: 'c87', cam: [.62, .52, 1.3, .2, -.2, .22] },
    { id: 'a_waste_macro', area: 'a', line: 'c88', cam: [-.38, .48, .98, -.08, -.24, .28] },
    { id: 'a_stuck_wall', area: 'a', line: 'c89', cam: [1.2, .48, 1.0, .85, -.16, .06] },
    { id: 'a_sweep_by', area: 'a', line: 'c90', cam: [.7, .38, .95, .5, -.2, .18] },
    { id: 'a_carried_away', area: 'a', line: 'c91', cam: [1.35, .4, 1.05, 1.5, -.2, .24] },
    { id: 'n_tubes_appear', area: 'n', line: 'c92', cam: [1.15, .95, .95, 2.15, -.2, -.75] },
    { id: 'n_tube_macro', area: 'n', line: 'c93', cam: [2.05, .05, -.02, 2.25, -.24, -.42] },
    { id: 'n_net_glow', area: 'n', line: 'c94', cam: [2.3, .78, .6, 2.3, -.2, -.85] },
    { id: 'a_two_windows', area: 'a', line: 'c95', cam: [.98, .12, .05, .98, -.16, -1.02] },
    { id: 'a_every_night', area: 'a', line: 'c96', cam: [1.4, .9, 2.05, .1, -.12, -.3] },
    { id: 'c_wake_up', area: 'c', line: 'c97', cam: [-3.3, .52, 1.1, -3.4, .04, .05] },
    { id: 'c_two_states', area: 'c', line: 'c98', cam: [-3.6, .72, 2.3, -3.6, .04, .05] },
    { id: 'c_slow_nodes', area: 'c', line: 'c99', cam: [-3.05, .48, .85, -3.2, .09, .02] },
    { id: 'c_light_in', area: 'c', line: 'c100', cam: [-3.62, .52, 1.2, -3.35, .07, .06] },
    { id: 'c_mist', area: 'c', line: 'c101', cam: [-3.0, .58, 1.15, -3.2, .07, .05] },
    { id: 'a_clock_30', area: 'a', line: 'c102', cam: [-1.24, .32, .84, -1.5, -.09, .36] },
    { id: 'a_clock_15', area: 'a', line: 'c103', cam: [-1.12, .44, 1.1, -1.5, -.09, .36] },
    { id: 'a_clock_crawl', area: 'a', line: 'c104', cam: [-1.3, .5, 1.25, -1.5, -.09, .36] },
    { id: 'a_clock_final', area: 'a', line: 'c105', cam: [-.95, .6, 1.5, -1.35, -.08, .3] },
  ]);

  // ── the words that drive the picture ──
  const tDila = W('c80', 'chìm');
  const tC80 = T('c78'), tC81 = T('c79'), tC82 = T('c80');
  const tFlow = W('c80', 'chảy');
  const tDeep = T('c83'), tC88 = T('c84'), tStuck = T('c85'), tSweep = W('c86', 'cuốn');
  const tC92 = T('c88'), tC94 = T('c90'), tC97 = T('c93'), tC98 = T('c94');
  const tC99 = T('c95'), tC100 = T('c96'), tC101 = T('c97'), tC102 = T('c102');
  const tC103 = T('c103'), tC104 = T('c98'), tC105 = T('c105'), tC106 = T('c106');

  const idxAt = t => { let i = 0; for (let k = 0; k < shots.t0.length; k++) if (t >= shots.t0[k]) i = k; return i; };

  // how far the waste has been carried away from the wall
  const sweepAt = t => {
    if (t < tSweep) return 0;
    if (t < tC92) return ss(seg(t, tSweep, tSweep + 4.2));
    if (t < tC97) return 1;
    if (t < tC98) { const u = (t - tC97) % 2.8; return ss(seg(u, .3, 2.0)); }
    return 0;
  };

  const update = t => {
    // ── the light follows the place ──
    const i = idxAt(t);
    const cur = shots.rows[i].area, prv = i > 0 ? shots.rows[i - 1].area : cur;
    const k = ss(seg(t, shots.t0[i], shots.t0[i] + .8));
    const L = (area, on, off) => lerp(prv === area ? on : off, cur === area ? on : off, k);
    const deep = ss(seg(t, tDeep - 1.2, tDeep + 2.5));
    const dark = ss(seg(t, tC103 + .6, tC103 + 2.6)) * (1 - ss(seg(t, tC104, tC104 + 1.8)));
    SP.lamp.intensity = L('a', 3.1, .5) * (1 - .45 * dark);
    capLight.intensity = L('a', 1.5, .1) * (1 - .3 * dark);
    poolN.intensity = L('n', 3.2, .3);
    poolC.intensity = L('c', 3.4, .35);
    SP.amb.rim.intensity = .9 + .5 * deep;

    // ── the vessel opens, and the groove along it opens with it ──
    const dil = ss(seg(t, tDila, tDila + 2.6));
    cap.scale.set(1, 1 + .16 * dil + .07 * deep, 1 + .16 * dil + .07 * deep);
    cap.blood.update(t);
    const awake = ss(seg(t, tC81, tC81 + 1.6)) * (1 - ss(seg(t, tC82, tC82 + 1.8)));
    let w = lerp(.04, .10, dil);
    w = lerp(w, .14, deep);
    w = lerp(w, .026, awake);
    w *= ss(seg(t, tC80, tC80 + 1.3));
    CH.setWidth(w);
    const fill = ss(seg(t, tFlow, tFlow + 3.6));
    CH.setFill(fill);

    // ── the stream ──
    const strong = ss(seg(t, tDeep, tDeep + 2.2));
    flowA.update(t, fill);
    flowA.amount(clamp(.22 + .78 * strong - .16 * awake));
    flowB.update(t, fill);
    flowB.amount(clamp(strong * .9));
    for (let j = 0; j < 26; j++) {
      const u = (t * (.22 + .34 * strong) + j / 26) % 1;
      setDot(sdots, j, TMP.set(-1.15 + u * 2.7, CY, CZ), (.25 + .75 * strong) * fill);
    }
    sdots.instanceMatrix.needsUpdate = true;

    // ── the waste: in the stream, then stuck to the wall, then carried off ──
    const sp = sweepAt(t);
    const inStream = 1 - ss(seg(t, tStuck, tStuck + 1.5));
    const born = ss(seg(t, tC88 - 1.6, tC88 + .6));
    for (let j = 0; j < 240; j++) {
      const q = PW[j];
      const wx = q.x, wy = VY + Math.sin(q.a) * q.r, wz = Math.cos(q.a) * q.r;
      const sx = q.x + .5 * Math.sin(t * .6 + q.ph), sy = CY, sz = CZ;
      let px = lerp(wx, sx, inStream), py = lerp(wy, sy, inStream), pz = lerp(wz, sz, inStream);
      const ex = q.x + sp * (3.1 - q.x);
      px = lerp(px, ex, sp); py = lerp(py, CY, sp); pz = lerp(pz, CZ, sp);
      setDot(waste, j, TMP.set(px, py, pz), (1 - ss(seg(sp, .5, 1)) * .96) * born);
    }
    waste.instanceMatrix.needsUpdate = true;

    // ── the network of tubes ──
    const netHot = ss(seg(t, tC94, tC94 + 1.6));
    for (let j = 0; j < net.length; j++) {
      const n = net[j];
      const one = ss(seg(t, tC92 + j * .42, tC92 + j * .42 + 1.1));
      n.tube.material.opacity = one * (.3 + .3 * netHot);
      n.v.blood.update(t);
      for (let k = 0; k < 16; k++) {
        const u = (t * (.16 + .34 * netHot + .2 * deep) + k / 16 + j * .07) % 1;
        setDot(n.dots, k, TMP.set(-n.len * .45 + u * n.len * .9, -n.R * 1.45, n.R * .9), one * (.55 + .45 * netHot));
      }
      n.dots.instanceMatrix.needsUpdate = true;
    }

    // ── the two windows: one at day, one at night ──
    podDay.fluid.material.opacity = .28;
    podDay.waste.fill({ x: 0, y: -.08, z: .03, w: .32, h: .02, d: .02 }, 10);
    podNight.fluid.material.opacity = .5 + .35 * netHot;
    podNight.waste.fill({ x: -.17 + ((t * .5) % 1) * .34, y: -.08, z: .03, w: .32, h: .02, d: .02 }, 10);

    // ── the clock inside the brain: the nap length, the length of the grogginess, then the slow crawl ──
    let frac = 0;
    if (t >= tC103 && t < tC104) frac = lerp(0, 30 / 60, ss(seg(t, tC103 + .5, tC103 + 3.4)));
    else if (t >= tC104 && t < tC105) frac = lerp(30 / 60, 15 / 60, ss(seg(t, tC104 + .5, tC104 + 3.4)));
    else if (t >= tC105) frac = 15 / 60 + (t - tC105) * .012;
    brainClock.setFrac(frac);
    // the tissue goes dark, then a patch of light comes back
    massMat.color.setScalar(.85 - .45 * dark);
    const gp = ss(seg(t, tC104, tC104 + 2.6));
    glowPatch.material.opacity = gp * .85;
    glowPatch.scale.setScalar(.3 + .8 * gp);

    // ── the regions of the brain: one still dark, one awake ──
    const awakeR = ss(seg(t, tC99, tC99 + 2.6));
    regRMat.color.setScalar(lerp(.42, 1.0, awakeR));
    regLMat.color.setScalar(.26 + .1 * ss(seg(t, tC105, tC105 + 3)));
    for (let j = 0; j < 34; j++) {
      const p = NF[j];
      setDot(nFast, j, TMP.set(p.x, p.y, p.z), (.25 + .95 * awakeR) * (.55 + .45 * Math.sin(t * 2.3 + p.ph)));
      const q = NS[j];
      setDot(nSlow, j, TMP.set(q.x, q.y, q.z), .45 * (.6 + .4 * Math.sin(t * .85 + q.ph)));
    }
    nFast.instanceMatrix.needsUpdate = true;
    nSlow.instanceMatrix.needsUpdate = true;
    // the mist: thick on the side that is still deep, thin on the side that woke
    const mL = ss(seg(t, tC99, tC99 + 1.8)) * (1 - ss(seg(t, tC105, tC105 + 3.4)));
    const mR = ss(seg(t, tC102, tC102 + 1.6)) * (1 - ss(seg(t, tC104, tC105 + 2.6)));
    for (const m of mistL.mist) m.material.opacity = mL * .34;
    for (const m of mistR.mist) m.material.opacity = mR * .34;
    // the light from the eyes
    beam.material.opacity = ss(seg(t, tC101, tC101 + 1.4)) * (1 - ss(seg(t, tC102, tC104))) * .5;

    // ── the clock with no numbers ──
    slowClock.setFrac(Math.max(0, t - tC105) * .06);

    // ── the breath of the tissue ──
    mass.wave(t, 1 + .5 * deep);
    regL.wave(t, 1 + .4 * awakeR);
    regR.wave(t, 1 + .4 * awakeR);
  };

  const labels = t => {
    const out = [];
    const a0 = W('c87', 'sâu'), a1 = a0 + 3.2;
    if (t >= a0 && t <= a1) out.push({ text: 'GIẤC NGỦ SÂU', anchor: new THREE.Vector3(.18, CY, CZ), t0: a0, t1: a1, dx: 40, dy: -190 });
    const b0 = W('c99', 'chừng'), b1 = b0 + 3.6;
    if (t >= b0 && t <= b1) out.push({ text: 'TỈNH DẬY GIỪA CHỪNG', anchor: new THREE.Vector3(-3.15, .12, .05), t0: b0, t1: b1, dx: 60, dy: -210 });
    return out;
  };

  return {
    key: SP.key,
    update,
    cam: t => shots.at(t),
    labels,
    events: () => shots.events(),
    flashColor: () => new THREE.Color(PAL.cyan),
    ref: 1.6,
  };
}
