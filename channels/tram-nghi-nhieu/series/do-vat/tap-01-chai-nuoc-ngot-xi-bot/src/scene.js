// Set construction: desk, room shell, window with moon, lamp pool, and tabletop props.
import * as THREE from 'three';
import { PAL, toon, glowMat, canvasTex, TEX, rbox, mesh, fxLayer, mulberry, clamp, lerp, seg, ss, eo, back } from '../../../../rig/kit.js';
import { keyLight, pool, ambience, wallWithHole, beam, shadowFlags } from '../../../../rig/lights.js';
import { vessel, PROFILES } from '../../../../rig/cutaway.js';
import { buildHand } from '../../../../rig/fx.js';

export function buildScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#10132a');
  scene.fog = new THREE.Fog('#161b38', 7, 16);

  // ── Lights ──
  // Focused table lamp rifting from camera side onto the bottle and cut faces
  const lamp = pool(scene, {
    from: new THREE.Vector3(-2.4, 4.6, 5.0),
    to: new THREE.Vector3(.15, .9, 1.75),
    intensity: 3.5,
    angle: .36,
  });

  // Moonlight through the back window shaping the room and shadows
  const moon = keyLight(scene, {
    from: new THREE.Vector3(-5.2, 3.6, -2.2),
    to: new THREE.Vector3(-.8, 0, 1.6),
    intensity: 2.2,
    size: 3.5,
    color: '#9fb2ff',
  });

  ambience(scene, { fill: .32 });

  // ── Back Wall with Window ──
  const wallMat = toon('#a9a0b8', { map: TEX.wall() });
  wallMat.map.repeat.set(3, 2);
  const WIN = { x0: -2.9, x1: -1.5, y0: 1.0, y1: 2.5 };
  wallWithHole(scene, wallMat, { ...WIN, left: -5, right: 4, top: 4.2 });

  const frameMat = toon('#e8dcc4');
  for (const x of [WIN.x0, (WIN.x0 + WIN.x1) / 2, WIN.x1]) {
    scene.add(mesh(rbox(.07, WIN.y1 - WIN.y0, .1, .02), frameMat, [x, (WIN.y0 + WIN.y1) / 2, .02]));
  }
  for (const y of [WIN.y0, (WIN.y0 + WIN.y1) / 2 + .1, WIN.y1]) {
    scene.add(mesh(rbox(WIN.x1 - WIN.x0 + .07, .07, .1, .02), frameMat, [(WIN.x0 + WIN.x1) / 2, y, .02]));
  }

  // Outside sky and glowing moon disc
  scene.add(mesh(new THREE.PlaneGeometry(9, 6), new THREE.MeshBasicMaterial({ color: '#1d2550', fog: false }), [-1, 2, -3], { cast: false }));
  const moonDisc = mesh(new THREE.CircleGeometry(.32, 48), glowMat('#fff0d8', 1.6), [-3.6, 2.9, -2.9], { cast: false });
  fxLayer(moonDisc);
  scene.add(moonDisc);

  // Tree branch outside window that sways in the wind
  const branch = new THREE.Group();
  branch.position.set(-2.6, 2.6, -.5);
  scene.add(branch);
  const leafMat = toon('#24294a');
  const rb = mulberry(4);
  branch.add(mesh(new THREE.CylinderGeometry(.02, .035, 1.6, 6), leafMat, [0, 0, 0], { rot: [0, 0, 1.1] }));
  for (let i = 0; i < 7; i++) {
    branch.add(mesh(
      new THREE.SphereGeometry(.075, 8, 6),
      leafMat,
      [-.7 + i * .16, .12 * Math.sin(i * 1.7) + .1 + (rb() - .5) * .1, (rb() - .5) * .15],
      { rot: [rb(), rb(), rb()] }
    ));
  }

  // Light beam dust
  const dust = beam(scene, moon, { ...WIN, length: 2.6, alpha: .07 });

  // ── Table ──
  const tableMat = toon('#ffffff', { map: TEX.floor() });
  tableMat.map.repeat.set(1.5, 1.5);
  scene.add(mesh(rbox(6, .16, 4.2, .03), tableMat, [0, -.08, 2.1]));
  scene.add(mesh(rbox(6, .7, .1, .02), toon('#5b3d8f'), [0, -.5, 4.2])); // Apron toward camera

  // Coaster under bottle
  scene.add(mesh(new THREE.CylinderGeometry(.5, .52, .03, 48), toon('#f7bd27'), [.15, .015, 1.75]));

  // ── Glass with Ice on the left ──
  const glassVessel = vessel(PROFILES.glass, {
    thick: .03,
    cut: .001,
    shell: toon('#9fd6e8', { transparent: true, opacity: .55 }),
    fill: .7,
    liquid: '#c58a3a',
    liquidAlpha: .5,
    shine: true,
  });
  glassVessel.group.position.set(-1.25, 0, 2.2);
  glassVessel.group.scale.setScalar(.8);
  scene.add(glassVessel.group);

  // Ice cubes in glass
  for (let i = 0; i < 3; i++) {
    scene.add(mesh(
      rbox(.16, .16, .16, .03),
      toon('#e8f6ff', { transparent: true, opacity: .8 }),
      [-1.25 + (i - 1) * .09, .42 + i * .06, 2.2 + (i % 2) * .06],
      { rot: [i * .7, i * .5, 0] }
    ));
  }

  // ── Opener on table ──
  const opener = new THREE.Group();
  opener.position.set(1.15, .03, 2.55);
  opener.rotation.y = .5;
  scene.add(opener);
  opener.add(mesh(rbox(.7, .04, .14, .02), toon('#c7c9d8'), [0, 0, 0]));
  opener.add(mesh(rbox(.36, .07, .17, .03), toon('#252d50'), [-.22, .01, 0]));

  // ── Stack of Books ──
  for (const [x, c, h] of [[1.3, '#9a5be5', .14], [1.32, '#f7bd27', .1], [1.28, '#67e8f9', .12]]) {
    scene.add(mesh(
      rbox(1.1, h, .75, .02),
      toon(c),
      [x, h / 2 + (c === '#f7bd27' ? .14 : c === '#67e8f9' ? .24 : 0), .75],
      { rot: [0, .2, 0] }
    ));
  }

  // ── Toy Hand for opening ──
  const hand = buildHand();
  hand.position.set(.15 + .3, 1.7, 1.75 + .3);
  hand.visible = false;
  scene.add(hand);

  shadowFlags(scene);

  return {
    scene,
    moon,
    lamp,
    branch,
    dust,
    hand,
  };
}
