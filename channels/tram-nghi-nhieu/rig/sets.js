// Ready-made sets: a dressed, lit place to start an episode from, instead of a bare table in the dark.
// Every set follows one contract, so an episode can swap one for another:
//   const S = kitchen(scene, { time: 'morning' });   // or desk(), bathroom()
//   S.focus    — THREE.Vector3 on the work surface (y = 0) where the light lands: put the hero object here
//   S.cams     — { wide, medium, close, low }: camera poses [x, y, z, lookX, lookY, lookZ] framed on S.focus;
//                use them as keyframes in keys(), or as a start you nudge
//   S.key      — the key light (pass it to F.frame({ key: S.key }) for ?lightcam)
//   S.update(t, { light }) — call every frame: things sway and breathe; light 0..1 dims the day (night falls)
//   S.clear    — radius around S.focus kept free of set dressing (your objects go there)
// The work surface top is always y = 0, the back wall is the plane z = 0, the room runs toward +z.
// `time`: 'morning' | 'day' | 'evening' | 'night' sets the sky, the key colour and what hangs in the window (sun or moon),
// so the picture agrees with the words ("buổi sáng" is never a moon).
import * as THREE from 'three';
import { PAL, toon, glowMat, canvasTex, TEX, rbox, mesh, fxLayer, mulberry, lerp, surface } from './kit.js';
import { keyLight, ambience, wallWithHole, beam, pool } from './lights.js';

const TIMES = {
  morning: { key: '#ffe0b0', keyI: 3.0, sky: [[.72, .46, .4], [.32, .32, .62]], disc: '#fff0d8', discY: .9, fill: .55, skyC: '#6070b0', beam: '#ffd9a0' },
  day: { key: '#fff4e0', keyI: 3.2, sky: [[.62, .74, .9], [.36, .5, .82]], disc: '#fffbe8', discY: 1.6, fill: .62, skyC: '#7c8ccc', beam: '#fff0c8' },
  evening: { key: '#ffb070', keyI: 2.8, sky: [[.9, .48, .32], [.36, .22, .5]], disc: '#ffcf8a', discY: .6, fill: .48, skyC: '#6a5ca8', beam: '#ffb878' },
  night: { key: '#b4c6ff', keyI: 2.4, sky: [[.05, .05, .13], [.03, .035, .09]], disc: '#fff0d8', discY: 1.4, fill: .4, skyC: '#5a6aa8', beam: '#9fb2ff' },
};

// a painted surface with fine grain: walls, cabinet doors
export const paintTex = (base, seed = 5) => canvasTex(256, 256, (g, w, h) => {
  const r = mulberry(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
  for (let k = 0; k < 2500; k++) { g.fillStyle = `rgba(20,20,40,${r() * .07})`; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1); }
  for (let k = 0; k < 40; k++) { g.strokeStyle = `rgba(255,240,216,${r() * .06})`; g.lineWidth = 2; const y = r() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (r() - .5) * 8); g.stroke(); }
});
// square tiles with a few coloured ones
// a tiled wall that stays behind the subject: grout close to the tile colour and few accent tiles, so the
// background is low contrast and the brightest, busiest thing in the frame is still the subject
export const tileTex = (base = '#8a83a6', seed = 17, n = 8) => canvasTex(512, 512, (g, w, h) => {
  const r = mulberry(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
  const s = w / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const k = r(); g.fillStyle = k > .94 ? '#9a8fc8' : k > .9 ? '#d6b27a' : `rgb(${196 + r() * 12},${188 + r() * 10},${170 + r() * 10})`;
    g.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
    g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(i * s + 5, j * s + 5, s * .35, 3);
  }
  for (let k = 0; k < 3000; k++) { g.fillStyle = `rgba(30,25,40,${r() * .06})`; g.fillRect(r() * w, r() * h, 2, 2); }
});

// The window every set shares: frame and mullions in the wall hole, a sky, the sun or the moon, roofs, a branch whose
// leaves the key light prints into the room, and a soft shaft. Returns the parts that move.
function windowView(scene, WIN, T, { frameMat = toon('#efe2c8'), seed = 9 } = {}) {
  const fr = (w, h, x, y, d = .18) => { const m = mesh(rbox(w, h, d, .012), frameMat, [x, y, -.05]); m.userData.tag = 'frame'; scene.add(m); };
  const cx = (WIN.x0 + WIN.x1) / 2, cy = (WIN.y0 + WIN.y1) / 2, ww = WIN.x1 - WIN.x0, wh = WIN.y1 - WIN.y0;
  fr(ww + .1, .07, cx, WIN.y1 + .02); fr(ww + .1, .07, cx, WIN.y0 - .02);
  fr(.07, wh + .1, WIN.x0 - .02, cy); fr(.07, wh + .1, WIN.x1 + .02, cy);
  fr(.045, wh, cx, cy, .08); fr(ww, .045, cx, WIN.y0 + wh * .38, .08);
  scene.add(mesh(rbox(ww + .3, .045, .2, .015), frameMat, [cx, WIN.y0 - .03, .07]));
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), new THREE.ShaderMaterial({
    uniforms: { uA: { value: new THREE.Color(...T.sky[0]) }, uB: { value: new THREE.Color(...T.sky[1]) }, uDim: { value: 1 } }, fog: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec2 vUv; uniform vec3 uA, uB; uniform float uDim;
      void main(){ vec3 c = mix(uA, uB, smoothstep(.25,.75,vUv.y)); gl_FragColor = vec4(mix(vec3(.04,.045,.11), c, uDim), 1.); }`,
  }));
  sky.position.set(cx - .5, 1.8, -3); scene.add(sky);
  const disc = mesh(new THREE.CircleGeometry(.28, 40), glowMat(T.disc, 1.2), [cx - 1.1, WIN.y0 + T.discY, -2.9], { cast: false }); fxLayer(disc); scene.add(disc);
  const r = mulberry(seed), bm = new THREE.MeshBasicMaterial({ color: '#2a2450', fog: false });
  for (let x = cx - 3.5; x < cx + 3.5;) { const w = .4 + r() * .6, h = .25 + r() * .5; scene.add(mesh(new THREE.BoxGeometry(w, h, .05), bm, [x + w / 2, WIN.y0 - .3 + h / 2, -2.6], { cast: false, recv: false })); x += w + .08; }
  const branch = new THREE.Group(); branch.position.set(WIN.x1 - .2, WIN.y1 - .05, -.75); branch.userData.tag = 'branch'; scene.add(branch);
  const lm = new THREE.MeshBasicMaterial({ color: '#1a1830' });
  branch.add(mesh(new THREE.CylinderGeometry(.018, .03, 1.5, 6), lm, [0, 0, 0], { rot: [0, 0, 1.25] }));
  for (let i = 0; i < 14; i++) { const lf = mesh(new THREE.SphereGeometry(.07, 7, 5), lm, [-.65 + i * .1, -.04 + Math.sin(i * 1.9) * .1 + (r() - .5) * .08, (r() - .5) * .2], { rot: [r(), r(), r()], recv: false }); lf.scale.set(1.5, .5, .8); branch.add(lf); }
  return { sky, disc, branch };
}

// the key's direction: from the focus up through the middle of the window, so the window's light lands on the focus
const through = (WIN, focus, lift = 0) => new THREE.Vector3((WIN.x0 + WIN.x1) / 2, (WIN.y0 + WIN.y1) / 2 + lift, -.1).sub(focus).normalize();

// camera poses around a focus point: the wide one shows the window and the room, the close one fills the frame
function camsAround(f, side = 1) {
  const P = (dx, dy, dz, ly = 0) => [f.x + dx * side, f.y + dy, f.z + dz, f.x, f.y + ly, f.z];
  return {
    wide: [f.x + .9 * side, f.y + 1.35, f.z + 3.3, f.x - .1 * side, f.y + .55, f.z - .4],
    medium: P(.55, .75, 1.7, .12),
    close: P(.3, .32, .85, .06),
    low: P(.75, .12, 1.25, .1),
  };
}

function finish(scene, S, T, parts, extra = () => {}) {
  S.update = (t, { light = 1 } = {}) => {
    S.key.intensity = T.keyI * light;
    parts.sky.material.uniforms.uDim.value = light;
    parts.disc.material.color.multiplyScalar(0).add(new THREE.Color(T.disc).multiplyScalar(lerp(.3, 1.2, light)));
    if (parts.shaft) parts.shaft.material.uniforms.uA.value = .06 * light;
    S.amb.hemi.intensity = lerp(.3, T.fill, light);
    parts.branch.rotation.z = .05 * Math.sin(t * .8) + .02 * Math.sin(t * 2.1);
    extra(t, light);
  };
  S.update(0);
  return S;
}

// ── kitchen counter ─────────────────────────────────────────────────────
// tiled wall, window over a long wooden counter, cabinets, a shelf of jars, a clock, kettle, mug, spoon jar, a towel,
// a pot of herbs on the sill. Focus: the patch of counter in front of the window, where the sun lands.
export function kitchen(scene, { time = 'morning', props = true } = {}) {
  const T = TIMES[time];
  scene.background = new THREE.Color('#141629'); scene.fog = new THREE.Fog('#1a1d3a', 6, 14);
  const WIN = { x0: -1.55, x1: .25, y0: .5, y1: 2.25 };
  const focus = new THREE.Vector3(-.7, 0, .8);
  const dir = through(WIN, focus);
  const key = keyLight(scene, { from: focus.clone().addScaledVector(dir, 8), to: focus, color: T.key, intensity: T.keyI, size: 2.6, far: 16 });
  const amb = ambience(scene, { sky: T.skyC, ground: '#3a2840', fill: T.fill, rim: '#a07cff', rimI: .7, rimFrom: [3, 2.5, 3] });
  const M = { tile: toon('#ffffff', { map: tileTex() }), wood: toon('#ffffff', { map: TEX.wood() }), cab: toon('#ffffff', { map: paintTex('#4b3d86', 5) }),
    frame: toon('#efe2c8'), brass: toon('#c9973a'), cream: toon(PAL.cream), navy: toon(PAL.navy), red: toon(PAL.red), mustard: toon(PAL.mustard) };
  M.tile.map.repeat.set(5, 2.4); M.wood.map.repeat.set(5, 1);
  wallWithHole(scene, M.tile, { ...WIN, left: -6, right: 6, top: 3.2 });
  const parts = windowView(scene, WIN, T, { frameMat: M.frame });
  parts.shaft = beam(scene, key, { ...WIN, length: 2.4, alpha: .06, color: T.beam });
  scene.add(mesh(rbox(12, .08, 1.5, .02), M.wood, [0, -.04, .75]));
  scene.add(mesh(rbox(12, .06, .04, .01), M.frame, [0, .03, .02]));
  scene.add(mesh(new THREE.BoxGeometry(12, 1.6, .05), M.navy, [0, -.88, 1.42]));
  for (let x = -5.5; x < 5.6; x += .9) { scene.add(mesh(rbox(.84, .7, .05, .02), M.cab, [x, -.48, 1.47])); scene.add(mesh(rbox(.2, .025, .04, .01), M.brass, [x, -.2, 1.51])); }
  scene.add(mesh(rbox(2.4, .05, .3, .01), M.wood, [1.8, 1.55, .15]));
  ['#f04462', '#f7bd27', '#67e8f9', '#9a5be5'].forEach((c, i) => {
    scene.add(mesh(new THREE.CylinderGeometry(.08, .08, .2 + (i % 2) * .06, 18), toon(c), [1.05 + i * .36, 1.68 + (i % 2) * .03, .16]));
    scene.add(mesh(new THREE.CylinderGeometry(.085, .085, .04, 18), M.cream, [1.05 + i * .36, 1.8 + (i % 2) * .06, .16]));
  });
  const S = { key, amb, focus, clear: .6, cams: camsAround(focus, 1), window: WIN };
  const ck = clock(M); ck.position.set(1.15, 1.05, .02); scene.add(ck); S.clock = ck;
  const herbs = plant(); herbs.position.set(-1.3, WIN.y0, .09); scene.add(herbs); S.plant = herbs;
  if (props) {
    const k = kettle(); k.position.set(.95, 0, .38); scene.add(k);
    const m = mug(PAL.mustard); m.position.set(-1.95, 0, 1.2); scene.add(m);
    const j = new THREE.Group(); j.position.set(-2.15, 0, .38); scene.add(j);
    j.add(mesh(new THREE.CylinderGeometry(.11, .1, .26, 18), toon('#67b8c9'), [0, .13, 0]));
    for (let i = 0; i < 4; i++) { const sp = toon(i % 2 ? '#c9973a' : '#e8dcc4'); j.add(mesh(new THREE.CylinderGeometry(.012, .012, .42, 6), sp, [(i - 1.5) * .04, .36, (i % 2 - .5) * .04], { rot: [(i - 1.5) * .12, 0, (i - 1.5) * .15] })); j.add(mesh(new THREE.SphereGeometry(.035, 10, 6), sp, [(i - 1.5) * .07, .58, (i % 2 - .5) * .06])); }
    scene.add(towel(PAL.red, [.6, -.2, 1.52]));
    scene.add(mesh(new THREE.CylinderGeometry(.04, .045, .14, 14), M.cream, [-2.55, .07, .7]));
    scene.add(mesh(new THREE.CylinderGeometry(.04, .045, .14, 14), toon('#3b3360'), [-2.43, .07, .78]));
  }
  return finish(scene, S, T, parts, t => { ck.tick(t); herbs.rotation.y = .03 * Math.sin(t * 1.3); });
}

// ── study desk ──────────────────────────────────────────────────────────
// painted wall with a window and a cork board, a wooden desk, a desk lamp whose pool lights the focus, a stack of
// books, a pencil cup, a plant, a mug. The lamp is a second, warm light: switch it with S.lamp.intensity.
export function desk(scene, { time = 'night', props = true } = {}) {
  const T = TIMES[time];
  scene.background = new THREE.Color('#11132a'); scene.fog = new THREE.Fog('#171a36', 6, 14);
  const WIN = { x0: -2.4, x1: -.9, y0: .55, y1: 1.95 };
  const focus = new THREE.Vector3(.05, 0, .85);
  const dir = new THREE.Vector3(-3.2, 6, -6).normalize();
  const key = keyLight(scene, { from: new THREE.Vector3(-1.6, .4, .9).addScaledVector(dir, 8), to: new THREE.Vector3(-1.6, .4, .9), color: T.key, intensity: T.keyI * .8, size: 3, far: 18 });
  const amb = ambience(scene, { sky: T.skyC, ground: '#3a2438', fill: T.fill * .85 });
  const M = { wall: toon('#ffffff', { map: paintTex('#5b6aa8', 21) }), wood: toon('#ffffff', { map: TEX.wood() }), frame: toon('#efe2c8'),
    cork: toon('#ffffff', { map: corkTex() }), cream: toon(PAL.cream), navy: toon(PAL.navy), brass: toon('#c9973a') };
  M.wall.map.repeat.set(4, 3); M.wood.map.repeat.set(3, 1);
  wallWithHole(scene, M.wall, { ...WIN, left: -6, right: 6, top: 3.4 });
  const parts = windowView(scene, WIN, T, { frameMat: M.frame, seed: 13 });
  parts.shaft = beam(scene, key, { ...WIN, length: 2.2, alpha: .05, color: T.beam });
  // desk top, front edge, legs
  scene.add(mesh(rbox(4.2, .07, 1.6, .02), M.wood, [0, -.035, .8]));
  scene.add(mesh(rbox(4.2, .14, .05, .015), toon('#6b3d22'), [0, -.1, 1.6]));
  for (const x of [-2, 2]) scene.add(mesh(rbox(.08, 1.4, .08, .02), toon('#6b3d22'), [x, -.77, 1.5]));
  // cork board with notes and a pinned photo
  scene.add(mesh(rbox(1.5, 1.0, .04, .02), M.cork, [1.15, 1.35, .03]));
  const r = mulberry(5);
  ['#fff0d8', '#f7bd27', '#67e8f9', '#f04462', '#fff0d8'].forEach((c, i) => {
    scene.add(mesh(rbox(.26, .2 + r() * .1, .01, .004), toon(c), [.65 + i * .25, 1.2 + (i % 2) * .3 + r() * .05, .06], { rot: [0, 0, (r() - .5) * .3] }));
    scene.add(mesh(new THREE.SphereGeometry(.018, 8, 6), toon(PAL.red), [.65 + i * .25, 1.32 + (i % 2) * .3, .08]));
  });
  // the lamp: arm over the focus, a warm pool
  const L = new THREE.Group(); L.position.set(-.85, 0, .45); scene.add(L);
  L.add(mesh(new THREE.CylinderGeometry(.16, .18, .04, 24), M.navy, [0, .02, 0]));
  L.add(mesh(new THREE.CylinderGeometry(.018, .018, .7, 8), M.brass, [.05, .37, 0], { rot: [0, 0, -.15] }));
  L.add(mesh(new THREE.CylinderGeometry(.015, .015, .55, 8), M.brass, [.3, .76, .05], { rot: [0, -.3, -1.05] }));
  const shade = new THREE.Group(); shade.position.set(.55, .82, .14); shade.rotation.set(.25, 0, -.9); L.add(shade);
  shade.add(mesh(new THREE.ConeGeometry(.16, .2, 24, 1, true), toon(PAL.red, { side: THREE.DoubleSide }), [0, 0, 0]));
  const bulb = mesh(new THREE.SphereGeometry(.05, 12, 8), glowMat('#fff2c8', 3), [0, -.07, 0], { cast: false }); fxLayer(bulb); shade.add(bulb);
  const lamp = pool(scene, { from: new THREE.Vector3(-.2, 1.0, .65), to: focus, intensity: 3.6, angle: .55 });
  const S = { key, amb, focus, clear: .55, cams: camsAround(focus, 1), window: WIN, lamp };
  const pl = plant('#d9774a', 21); pl.position.set(-1.65, 0, .35); pl.scale.setScalar(1.6); scene.add(pl); S.plant = pl;
  if (props) {
    const bk = books(4, 3); bk.position.set(1.25, 0, .45); bk.rotation.y = -.15; scene.add(bk);
    const cup = new THREE.Group(); cup.position.set(.75, 0, .3); scene.add(cup);
    cup.add(mesh(new THREE.CylinderGeometry(.07, .065, .18, 18), toon('#2f8fa0'), [0, .09, 0]));
    ['#f7bd27', '#f04462', '#e8dcc4'].forEach((c, i) => cup.add(mesh(new THREE.CylinderGeometry(.008, .008, .3, 6), toon(c), [(i - 1) * .025, .25, (i % 2) * .02], { rot: [(i - 1) * .1, 0, (i - 1) * .12] })));
    const m = mug('#f7bd27'); m.position.set(1.45, 0, 1.15); scene.add(m);
    scene.add(mesh(rbox(.42, .01, .3, .004), toon('#fff0d8'), [-.95, .005, 1.25], { rot: [0, .25, 0] })); // a sheet of paper
  }
  return finish(scene, S, T, parts, t => { pl.rotation.y = .03 * Math.sin(t * 1.1); });
}

// ── bathroom sink ───────────────────────────────────────────────────────
// tiled wall, a small frosted window, a mirror, a basin in a counter, a tap, a toothbrush cup, soap, a towel.
// Focus: the counter beside the basin; S.basin and S.tap are the places water things happen (S.tapMouth is a point).
export function bathroom(scene, { time = 'morning', props = true } = {}) {
  const T = TIMES[time];
  scene.background = new THREE.Color('#121a2c'); scene.fog = new THREE.Fog('#18213a', 6, 14);
  const WIN = { x0: -2.5, x1: -1.5, y0: 1.0, y1: 2.0 };
  const focus = new THREE.Vector3(-.75, 0, .75);
  const dir = through(WIN, focus, .2);
  const key = keyLight(scene, { from: focus.clone().addScaledVector(dir, 8), to: focus, color: T.key, intensity: T.keyI, size: 2.8, far: 18 });
  const amb = ambience(scene, { sky: T.skyC, ground: '#3a3048', fill: T.fill + .1 });
  const M = { tile: toon('#ffffff', { map: tileTex('#7f9fae', 27, 8) }), counter: toon('#ffffff', { map: paintTex('#e8e2d4', 9) }), frame: toon('#efe2c8'),
    cab: toon('#ffffff', { map: paintTex('#2f8fa0', 4) }), chrome: toon('#c7c9d8'), cream: toon(PAL.cream) };
  M.tile.map.repeat.set(3.5, 1.8);
  wallWithHole(scene, M.tile, { ...WIN, left: -6, right: 6, top: 3.2 });
  const parts = windowView(scene, WIN, T, { frameMat: M.frame, seed: 4 });
  parts.shaft = beam(scene, key, { ...WIN, length: 2.2, alpha: .05, color: T.beam });
  scene.add(mesh(rbox(5, .1, 1.3, .03), M.counter, [0, -.05, .65]));
  scene.add(mesh(new THREE.BoxGeometry(5, 1.2, .05), M.cab, [0, -.7, 1.28]));
  for (let x = -2; x <= 2; x += 1) scene.add(mesh(rbox(.2, .025, .04, .01), M.chrome, [x, -.3, 1.32]));
  // basin: a white bowl sunk in the counter
  const basinC = new THREE.Vector3(.45, 0, .7);
  const bp = [[0, -.2], [.2, -.2], [.32, -.12], [.38, 0], [.4, .015]].map(([x, y]) => new THREE.Vector2(x, y));
  scene.add(mesh(new THREE.LatheGeometry(bp, 40), toon('#f4f1ea', { side: THREE.DoubleSide }), [basinC.x, 0, basinC.z]));
  scene.add(mesh(new THREE.CylinderGeometry(.03, .03, .01, 16), M.chrome, [basinC.x, -.195, basinC.z]));
  // tap
  const tap = new THREE.Group(); tap.position.set(basinC.x, 0, .2); scene.add(tap);
  tap.add(mesh(new THREE.CylinderGeometry(.04, .05, .24, 16), M.chrome, [0, .12, 0]));
  tap.add(mesh(new THREE.CylinderGeometry(.025, .025, .26, 12), M.chrome, [0, .23, .12], { rot: [Math.PI / 2, 0, 0] }));
  tap.add(mesh(rbox(.16, .03, .05, .012), M.chrome, [0, .29, -.02]));
  // mirror: a pale glossy panel with a frame
  scene.add(mesh(rbox(1.3, 1.0, .03, .02), M.frame, [.45, 1.55, .02]));
  scene.add(mesh(rbox(1.2, .9, .02, .01), toon('#bcd8e6'), [.45, 1.55, .04]));
  scene.add(mesh(rbox(.06, .7, .01, .005), toon('#eef8ff'), [.15, 1.6, .055], { rot: [0, 0, .5] }));
  // a vanity light over the mirror: a warm bar that pools on the counter, so the focus is lit from the room side
  const bar = mesh(rbox(.9, .06, .08, .02), glowMat('#fff2c8', 2.2), [.45, 2.12, .1], { cast: false }); fxLayer(bar); scene.add(bar);
  scene.add(mesh(rbox(1.0, .04, .12, .01), M.chrome, [.45, 2.17, .08]));
  const vanity = pool(scene, { from: new THREE.Vector3(.2, 2.2, 1.2), to: focus.clone().add(new THREE.Vector3(.35, 0, 0)), intensity: 3.2, angle: .6 });
  const S = { key, amb, focus, clear: .45, cams: camsAround(focus, 1), window: WIN, basin: basinC, tap, tapMouth: new THREE.Vector3(basinC.x, .21, .33), lamp: vanity };
  if (props) {
    const cup = new THREE.Group(); cup.position.set(-1.35, 0, .35); scene.add(cup);
    cup.add(mesh(new THREE.CylinderGeometry(.07, .06, .17, 18), toon('#f7bd27'), [0, .085, 0]));
    ['#f04462', '#67e8f9'].forEach((c, i) => { cup.add(mesh(new THREE.CylinderGeometry(.01, .01, .3, 6), toon(c), [(i - .5) * .04, .24, 0], { rot: [0, 0, (i - .5) * .3] })); cup.add(mesh(rbox(.03, .06, .025, .01), toon('#fff0d8'), [(i - .5) * .09, .4, 0], { rot: [0, 0, (i - .5) * .3] })); });
    scene.add(mesh(rbox(.2, .07, .13, .03), toon('#f49ab8'), [1.15, .035, .45], { rot: [0, .3, 0] }));
    scene.add(mesh(rbox(.26, .02, .17, .01), M.chrome, [1.15, .01, .45], { rot: [0, .3, 0] }));
    scene.add(towel('#2f8fa0', [-1.4, -.18, 1.32]));
    const pl = plant('#e8dcc4', 8); pl.position.set(-2.0, WIN.y0, .09); scene.add(pl); S.plant = pl;
  }
  return finish(scene, S, T, parts, t => { if (S.plant) S.plant.rotation.y = .03 * Math.sin(t * 1.2); });
}

// ── small dressing pieces (also useful on their own) ────────────────────
export function clock(M = { cream: toon(PAL.cream), red: toon(PAL.red), navy: toon(PAL.navy) }) {
  const ck = new THREE.Group();
  ck.add(mesh(new THREE.CylinderGeometry(.22, .22, .05, 40), M.cream, [0, 0, .02], { rot: [Math.PI / 2, 0, 0] }));
  ck.add(mesh(new THREE.TorusGeometry(.22, .025, 8, 40), M.red, [0, 0, .05]));
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ck.add(mesh(rbox(.015, .04, .01, .004), M.navy, [Math.sin(a) * .17, Math.cos(a) * .17, .05], { rot: [0, 0, -a] })); }
  const hh = new THREE.Group(), mh = new THREE.Group(); hh.position.z = mh.position.z = .055; ck.add(hh, mh);
  hh.add(mesh(rbox(.022, .11, .01, .005), M.navy, [0, .045, 0])); mh.add(mesh(rbox(.014, .16, .01, .005), M.navy, [0, .07, .008]));
  // tick(t, hours): the hands show `hours` (0..24); by default they creep with t. Spin them fast to say "days pass".
  ck.tick = (t, hours = 8 + t / 60) => { mh.rotation.z = -hours * Math.PI * 2; hh.rotation.z = -hours / 12 * Math.PI * 2; };
  ck.hands = { hh, mh };
  return ck;
}
export function plant(potColor = '#d9774a', seed = 31) {
  const g = new THREE.Group(); g.userData.tag = 'plant';
  g.add(mesh(new THREE.CylinderGeometry(.09, .07, .16, 16), toon(potColor), [0, .08, 0]));
  const r = mulberry(seed), lm = toon('#3f8a3a');
  for (let i = 0; i < 16; i++) { const l = mesh(new THREE.SphereGeometry(.05, 8, 6), lm, [(r() - .5) * .16, .2 + r() * .2, (r() - .5) * .12], { rot: [r() * 3, r() * 3, r() * 3] }); l.scale.set(1, .45, .7); g.add(l); }
  return g;
}
export function kettle(color = '#4f86a8') {
  const g = new THREE.Group();
  const kp = [[0, 0], [.17, 0], [.2, .05], [.2, .2], [.15, .3], [.06, .34], [0, .35]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(mesh(new THREE.LatheGeometry(kp, 32), toon(color), [0, 0, 0]));
  g.add(mesh(new THREE.TorusGeometry(.12, .018, 8, 20, Math.PI), toon(PAL.navy), [0, .34, 0]));
  g.add(mesh(new THREE.CylinderGeometry(.02, .035, .2, 8), toon(color), [.22, .19, 0], { rot: [0, 0, -.9] }));
  g.add(mesh(new THREE.SphereGeometry(.03, 10, 8), toon(PAL.red), [0, .37, 0]));
  return g;
}
export function mug(color = PAL.mustard, drink = '#5a3418') {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(.075, .07, .17, 20), toon(color), [0, .085, 0]));
  g.add(mesh(new THREE.TorusGeometry(.045, .013, 8, 16), toon(color), [.085, .09, 0]));
  if (drink) g.add(mesh(new THREE.CircleGeometry(.065, 20), toon(drink), [0, .15, 0], { rot: [-Math.PI / 2, 0, 0] }));
  return g;
}
export function books(n = 4, seed = 3) {
  const g = new THREE.Group(), r = mulberry(seed), cols = ['#f04462', '#2f8fa0', '#f7bd27', '#9a5be5', '#3f8a3a', '#fff0d8'];
  let y = 0;
  for (let i = 0; i < n; i++) { const h = .05 + r() * .04; g.add(mesh(rbox(.5 + r() * .12, h, .34 + r() * .06, .01), toon(cols[(seed + i) % cols.length]), [(r() - .5) * .05, y + h / 2, 0], { rot: [0, (r() - .5) * .25, 0] })); y += h; }
  return g;
}
export function towel(color = PAL.red, pos = [0, 0, 0]) {
  const tex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#fff0d8'; g.fillRect(0, 0, w, h); g.fillStyle = color; for (let y = 20; y < h; y += 70) g.fillRect(0, y, w, 16); g.fillStyle = '#252d50'; for (let y = 44; y < h; y += 70) g.fillRect(0, y, w, 5); });
  return mesh(surface(10, 16, (u, v) => [(u - .5) * .32, -v * .5 + .02 * Math.sin(u * 9), .02 * Math.sin(v * 5 + u * 3) + v * .03]), toon('#ffffff', { map: tex, side: THREE.DoubleSide }), pos);
}
const corkTex = () => canvasTex(256, 256, (g, w, h) => {
  const r = mulberry(6); g.fillStyle = '#b07a48'; g.fillRect(0, 0, w, h);
  for (let k = 0; k < 4000; k++) { g.fillStyle = `rgba(${r() > .5 ? '60,30,10' : '240,200,150'},${r() * .25})`; g.fillRect(r() * w, r() * h, 2, 2); }
});
