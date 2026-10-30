// core/cast/adapter-3d.mjs — the 3D adapter.
//
// Builds the same cast character in three.js that adapter-2d.mjs draws on a
// canvas: the same proportions, the same palette, the same hair, the same face.
// Every number comes from the cast module (core/cast/cast.mjs); this file only
// knows how to put them in space.
//
//   createView(canvas)     → the target the character is drawn in
//   createCharacter(spec)   → { draw(view, pose), setPose(pose) }
//
// three is a bare specifier: the page's import map resolves it (see
// styles/backrooms/demo/index.html).

import * as THREE from 'three';
import { readSpec, metrics, palette, faceOf, createPose, UNIT_METERS } from './cast.mjs';

const TAU = Math.PI * 2;

export function createView(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(canvas.width, canvas.height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, canvas.width / canvas.height, 0.05, 60);

  const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(1.4, 2.4, 2.2);
  const fill = new THREE.DirectionalLight(0xa8c8ff, 0.9); fill.position.set(-2.2, 1.1, 1.4);
  const rim = new THREE.DirectionalLight(0xffd7a8, 1.7); rim.position.set(-1.0, 1.8, -2.4);
  scene.add(key, fill, rim, new THREE.AmbientLight(0xffffff, 0.5));

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 48),
    new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  scene.add(shadow);

  return { kind: '3d', canvas, renderer, scene, camera, shadow, framed: false };
}

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grd.addColorStop(0, 'rgba(0,0,0,0.55)');
  grd.addColorStop(0.55, 'rgba(0,0,0,0.28)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// ———————————————————————————————————————————————————————— the character

export function createCharacter(spec) {
  const S = readSpec(spec);
  const M = metrics(S), P = palette(S);
  const U = UNIT_METERS;                       // metres per head unit
  const u = n => n * U;

  const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...extra });
  const M_SKIN = mat(P.skin), M_SKIN_SHADE = mat(P.skinShade);
  const M_HAIR = mat(P.hair), M_HOODIE = mat(P.hoodie), M_HOODIE_SHADE = mat(P.hoodieShade);
  const M_PANTS = mat(P.pants), M_INK = mat(P.ink);

  // a limb segment: the joint is at the group's origin, the segment hangs down
  function segment(len, r, material) {
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 18), material);
    m.position.y = -(len / 2 + r);
    return m;
  }

  // ——— the body ———
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const hipY = u(M.hipY), shY = u(M.shoulderY), headCY = u(M.headCY), neckY = u(M.neckY);

  // the torso
  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(u(M.shoulderHalf) * 0.92, u(M.hipHalf) * 1.08, u(M.torso), 24), M_HOODIE);
  torso.position.y = (hipY + shY) / 2;
  body.add(torso);

  // the hood, behind the shoulders
  const hood = new THREE.Mesh(new THREE.SphereGeometry(u(M.u) * 0.52, 20, 14), M_HOODIE_SHADE);
  hood.scale.set(1.05, 0.62, 0.72);
  hood.position.set(0, shY - u(M.u) * 0.06, -u(M.u) * 0.30);
  body.add(hood);

  // the neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(u(M.u) * 0.13, u(M.u) * 0.15, u(M.neck), 16), M_SKIN_SHADE);
  neck.position.y = (shY + neckY) / 2;
  body.add(neck);

  // ——— the legs ———
  const thighR = u(M.thighR), shinR = u(M.shinR);
  const thighLen = u(M.thighLen), shinLen = u(M.shinLen);
  const legs = [-1, 1].map(dir => {
    const g = new THREE.Group();
    g.position.set(dir * u(M.hipHalf) * 0.5, hipY, 0);
    g.add(segment(thighLen, thighR, M_PANTS));
    const knee = new THREE.Group();
    knee.position.y = -(thighLen + 2 * thighR);
    g.add(knee);
    knee.add(segment(shinLen, shinR, M_PANTS));
    const ankle = new THREE.Group();
    ankle.position.y = -(shinLen + 2 * shinR);
    knee.add(ankle);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(u(M.u) * 0.30, u(M.u) * 0.16, u(M.u) * 0.48), M_INK);
    shoe.position.set(0, u(M.u) * 0.08, u(M.u) * 0.10);
    ankle.add(shoe);
    body.add(g);
    return { g, dir };
  });

  // ——— the arms ———
  const upperR = u(M.upperR), foreR = u(M.foreR);
  const upperLen = u(M.upperLen), foreLen = u(M.foreLen);
  const arms = [-1, 1].map(dir => {
    const g = new THREE.Group();
    g.position.set(dir * u(M.shoulderHalf) * 0.90, shY - u(M.u) * 0.08, 0);
    g.add(segment(upperLen, upperR, M_HOODIE));
    const elbow = new THREE.Group();
    elbow.position.y = -(upperLen + 2 * upperR);
    g.add(elbow);
    elbow.add(segment(foreLen, foreR, M_HOODIE));
    const wrist = new THREE.Group();
    wrist.position.y = -(foreLen + 2 * foreR);
    elbow.add(wrist);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(u(M.u) * 0.14, 16, 12), M_SKIN);
    wrist.add(hand);
    body.add(g);
    return { g, dir };
  });

  // ——— the head ———
  const head = new THREE.Group();
  head.position.y = headCY;
  body.add(head);

  const R = u(M.headR);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(R * 1.02, 40, 28), M_SKIN);
  skull.scale.set(1, 1.04, 0.98);
  head.add(skull);

  // the hair: a shell that falls to the length of the hair, and a fringe over
  // the forehead. The shell leaves the face open; the fringe fills the top of
  // that opening, so the hairline is the fringe's rim.
  const hair = new THREE.Group();
  const drop = u(M.hairDrop);
  const OPEN = 0.62;                                   // the opening of the face, in radians
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.06, 36, 26, Math.PI / 2 + OPEN, TAU - 2 * OPEN, 0, TAU), M_HAIR);
  shell.scale.set(1.02, (R * 1.05 + drop) / (2 * R), 1.02);
  shell.position.y = (R * 1.05 - drop) / 2;
  hair.add(shell);
  const fringe = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.07, 32, 20, Math.PI / 2 - OPEN, 2 * OPEN, 0, 1.02), M_HAIR);
  hair.add(fringe);
  head.add(hair);

  // ——— the face ———
  // every feature sits on the skull's surface: the skull is a sphere of Rs,
  // squashed a little in z (0.98) and stretched a little in y (1.04).
  const eyeR = u(M.eyeR);
  const Rs = R * 1.02;
  const surfaceZ = (x, y) => Math.sqrt(Math.max(0.0001, Rs * Rs - x * x - y * y)) * 0.98;
  const eyeZ = surfaceZ(u(M.eyeDX), u(M.eyeDY));
  const eyes = [-1, 1].map(dir => {
    const g = new THREE.Group();
    g.position.set(dir * u(M.eyeDX), u(M.eyeDY), eyeZ * 0.90);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(eyeR * 1.18, 20, 16),
      new THREE.MeshStandardMaterial({ color: P.white, roughness: 0.5 }));
    g.add(ball);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(eyeR * 0.95, 16, 12), M_INK);
    pupil.position.set(0, 0, eyeR * 0.72);
    ball.add(pupil);
    head.add(g);
    return { g, ball, pupil, dir };
  });

  const browY = u(M.eyeDY) + u(M.u) * 0.13;
  const brows = [-1, 1].map(dir => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(u(M.u) * 0.18, u(M.u) * 0.05, u(M.u) * 0.06), M_INK);
    b.position.set(dir * u(M.eyeDX), browY, surfaceZ(dir * u(M.eyeDX), browY) + u(M.u) * 0.012);
    head.add(b);
    return { b, dir };
  });

  const mouthY = u(M.mouthDY);
  const mouthZ = surfaceZ(0, mouthY);
  const mouthArc = new THREE.Mesh(new THREE.TorusGeometry(u(M.mouthW) * 0.5, u(M.u) * 0.022, 8, 24, Math.PI), M_INK);
  head.add(mouthArc);
  const mouthOpen = new THREE.Mesh(new THREE.SphereGeometry(u(M.u) * 0.12, 16, 12), M_INK);
  mouthOpen.visible = false;
  head.add(mouthOpen);

  const blushes = [-1, 1].map(dir => {
    const c = new THREE.Mesh(new THREE.CircleGeometry(u(M.u) * 0.15, 20),
      new THREE.MeshBasicMaterial({ color: P.blush, transparent: true, opacity: 0.5 }));
    const cx = dir * u(M.eyeDX) * 1.05;
    c.position.set(cx, -u(M.u) * 0.02, surfaceZ(cx, -u(M.u) * 0.02) * 1.01);
    head.add(c);
    return c;
  });

  // ——— the pose ———
  let cur = createPose({});
  let mouthKey = null;

  function applyPose(pose) {
    const p = createPose(pose), F = faceOf(p);

    // the body turns; the feet follow the ground when the legs spread
    body.rotation.y = p.body * Math.PI / 180;
    const stance = p.legStance * 0.30;
    for (const { g, dir } of legs) g.rotation.z = dir * stance;
    root.position.y = -u(M.leg) * (1 - Math.cos(stance));

    // the head tilts (positive = to the right, as in the 2D adapter)
    head.rotation.z = -p.head * Math.PI / 180;

    // the arms swing forward and back
    for (const { g, dir } of arms) {
      g.rotation.x = -p.armSwing * 0.95;
      g.rotation.z = dir * 0.12;
    }

    // the face
    const lid = Math.max(0.06, 1 - F.lid);
    for (const { ball, pupil } of eyes) {
      ball.scale.set(1, lid, 1);
      pupil.position.set(F.lookX * eyeR * 0.45, F.lookY * eyeR * 0.45, eyeR * 0.72);
    }
    for (const { b, dir } of brows) {
      const ang = (dir < 0 ? F.browL : F.browR) * Math.PI / 180;
      b.rotation.z = dir < 0 ? ang : -ang;
      b.position.y = browY + F.browY * u(M.u) * 0.06;
    }
    const key = Math.round(F.smile * 12);
    if (key !== mouthKey) {
      mouthKey = key;
      const arc = Math.max(0.18, Math.min(1, Math.abs(F.smile)));
      mouthArc.geometry.dispose();
      mouthArc.geometry = new THREE.TorusGeometry(u(M.mouthW) * 0.5, u(M.u) * 0.022, 8, 24, Math.PI * arc);
      mouthArc.rotation.z = F.smile >= 0 ? Math.PI : 0;
      mouthArc.position.set(0, mouthY + (F.smile >= 0 ? 1 : -1) * u(M.mouthW) * 0.5 * arc, mouthZ * 0.99);
    }
    mouthOpen.visible = F.mouthOpen > 0.08;
    if (mouthOpen.visible) {
      mouthOpen.scale.set(u(M.mouthW) * 0.42, F.mouthOpen * u(M.u) * 0.30, u(M.u) * 0.10);
      mouthOpen.position.set(0, mouthY, mouthZ * 0.90);
    }
    for (const c of blushes) c.material.opacity = 0.5 * F.blush;
  }

  const setPose = pose => (cur = createPose(pose ?? cur));

  function draw(view, pose) {
    const p = createPose(pose ?? cur);
    cur = p;
    applyPose(p);
    if (rig.parent !== view.scene) view.scene.add(rig);
    if (!view.framed) {
      const H = u(M.total);
      view.camera.position.set(0, H * 0.55, H * 2.4);
      view.camera.lookAt(0, H * 0.5, 0);
      view.shadow.scale.setScalar(H * 0.30);
      view.framed = true;
    }
    view.renderer.render(view.scene, view.camera);
  }

  const rig = root;
  applyPose(cur);
  return { draw, setPose };
}
