// The inside of a head, staged as a diorama: a chunk of brain tissue on a dark table, neurons growing out of it,
// a synaptic cleft between two faces, a blood vessel cut open lengthwise. Everything is built from the same kit
// as the rest of the channel (toon materials, canvas textures, ink lines) so a brain set looks like the same world
// as a kitchen table.
import * as THREE from 'three';
import { PAL, toon, glowMat, canvasTex, rbox, mesh, fxLayer, mulberry, lerp, clamp, seg, ss, surface } from './kit.js';
import { keyLight, ambience, pool } from './lights.js';
import { glowDots, setDot } from './fx.js';

// ── textures ─────────────────────────────────────────────────────────────
// brain tissue seen from outside: pale lilac-pink with the little dark speckles of glial nuclei.
export function brainSkinTex(seed = 3) {
  return canvasTex(512, 512, (g, w, h) => {
    const r = mulberry(seed);
    g.fillStyle = '#d7a8bd'; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 240; k++) { // soft blotches of tissue
      g.fillStyle = `rgba(${190 + r() * 40},${120 + r() * 40},${150 + r() * 40},${.1 + r() * .18})`;
      g.beginPath(); g.ellipse(r() * w, r() * h, 20 + r() * 60, 14 + r() * 40, r() * 3, 0, 7); g.fill();
    }
    for (let k = 0; k < 2600; k++) { // glial nuclei
      g.fillStyle = `rgba(${70 + r() * 40},${40 + r() * 30},${70 + r() * 30},${.25 + r() * .4})`;
      g.beginPath(); g.arc(r() * w, r() * h, 1 + r() * 2.4, 0, 7); g.fill();
    }
    for (let k = 0; k < 60; k++) { // small blood vessels under the surface
      g.strokeStyle = `rgba(${150 + r() * 50},${50 + r() * 40},${70 + r() * 30},${.2 + r() * .25})`;
      g.lineWidth = 1 + r() * 3; g.beginPath();
      let x = r() * w, y = r() * h; g.moveTo(x, y);
      for (let j = 0; j < 5; j++) { x += (r() - .5) * 90; y += (r() - .5) * 90; g.lineTo(x, y); }
      g.stroke();
    }
  });
}

// the cut face of a chunk: cortex on top (dense cell bodies), white matter below (pale fibres)
export function brainCutTex(seed = 7) {
  return canvasTex(512, 512, (g, w, h) => {
    const r = mulberry(seed);
    g.fillStyle = '#e7d3dd'; g.fillRect(0, 0, w, h);                       // white matter
    for (let k = 0; k < 900; k++) {                                       // fibres
      g.strokeStyle = `rgba(255,245,250,${.1 + r() * .3})`; g.lineWidth = 1 + r() * 2;
      const y = r() * h; g.beginPath(); g.moveTo(0, y);
      for (let x = 0; x <= w; x += 48) g.lineTo(x, y + Math.sin(x * .02 + k) * 6); g.stroke();
    }
    const band = h * .34;                                                  // cortex
    g.fillStyle = '#c98fa8'; g.fillRect(0, 0, w, band);
    for (let k = 0; k < 1800; k++) {                                       // cell bodies in the cortex
      g.fillStyle = `rgba(${90 + r() * 50},${40 + r() * 30},${70 + r() * 30},${.35 + r() * .4})`;
      g.beginPath(); g.arc(r() * w, r() * h * .95, 1.4 + r() * 3, 0, 7); g.fill();
    }
    g.strokeStyle = 'rgba(70,40,60,.45)'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, band); g.lineTo(w, band); g.stroke();
  });
}

// ── a chunk of tissue ────────────────────────────────────────────────────
// A slab of brain with folded gyri on top and a cut face toward the camera. update() lets the folds breathe
// (the slow wave of deep sleep) and the tissue can be lit from a warm pool.
export function brainChunk({ w = 1.9, d = 1.3, h = .8, seed = 3, cut = true, folds = 5, amp = .055 } = {}) {
  const g = new THREE.Group();
  const skin = toon('#ffffff', { map: brainSkinTex(seed) });
  skin.map.repeat.set(1.4, 1);
  const face = toon('#ffffff', { map: brainCutTex(seed + 4) });
  // the folded top: gyri as a standing wave across the slab
  const top = mesh(surface(72, 48, (u, v) => {
    const x = (u - .5) * w, z = (v - .5) * d;
    const fold = Math.sin(u * Math.PI * 2 * folds) * Math.cos(v * Math.PI * 1.6) * amp;
    return [x, h / 2 + fold, z];
  }), skin, [0, 0, 0], { recv: true });
  g.add(top);
  const base = mesh(rbox(w, h * .96, d, .05), skin, [0, 0, 0]);
  base.position.y = -h * .48 + .01; base.scale.set(1, 1, 1); g.add(base);
  if (cut) { // the cross-section face toward the camera
    const f = mesh(new THREE.PlaneGeometry(w, h * .96), face, [0, -h * .48 + .01, d / 2 + .006], { cast: false });
    g.add(f);
  }
  // the fold animation: the same wave, applied to the vertices every frame
  const P = top.geometry.attributes.position, baseY = new Float32Array(P.count);
  for (let i = 0; i < P.count; i++) baseY[i] = P.getY(i);
  g.wave = (t, k = 1) => {
    for (let i = 0; i < P.count; i++) {
      const x = P.getX(i), z = P.getZ(i);
      const fold = Math.sin(x * Math.PI * 2 * folds / w + t * 1.1) * Math.cos(z * Math.PI * 1.6 / d) * amp;
      P.setY(i, baseY[i] + fold * (k - 1));
    }
    P.needsUpdate = true;
  };
  g.top = top; g.h = h; g.w = w; g.d = d;
  return g;
}

// ── a neuron ─────────────────────────────────────────────────────────────
// soma with a nucleus bulge, a crown of dendrites, one long myelinated axon and its terminal bulbs.
export function neuron({ size = 1, soma = '#e8b6c8', dend = '#c98fa8', axon = '#9a5be5', seed = 5, dendrites = 5, myelin = true } = {}) {
  const r = mulberry(seed), g = new THREE.Group();
  const som = toon(soma);
  const body = mesh(new THREE.IcosahedronGeometry(.115, 2), som, [0, 0, 0]);
  // the body is not a ball: squash it a little and give it a couple of bumps
  const P = body.geometry.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < P.count; i++) {
    v.fromBufferAttribute(P, i);
    v.y *= .88;
    v.multiplyScalar(1 + .06 * Math.sin(v.x * 40 + v.y * 30) * Math.cos(v.z * 35));
    P.setXYZ(i, v.x, v.y, v.z);
  }
  body.geometry.computeVertexNormals();
  g.add(body);
  const dm = toon(dend);
  for (let i = 0; i < dendrites; i++) {
    const a = (i / dendrites) * Math.PI * 2 + r() * .5, len = .16 + r() * .12;
    const d = new THREE.Group(); d.position.set(Math.cos(a) * .08, .02 + (r() - .5) * .05, Math.sin(a) * .08);
    d.rotation.set((r() - .5) * .9, -a, .5 + r() * .5);
    g.add(d);
    mesh(new THREE.CapsuleGeometry(.028, len, 4, 10), dm, [0, len / 2, 0], { rot: [0, 0, 0], parent: d });
    for (let k = 0; k < 3; k++) {  // a few branches on each dendrite
      const b = new THREE.Group(); b.position.set(0, len * (.4 + r() * .5), 0);
      b.rotation.set((r() - .5) * 1.4, (r() - .5) * 1.4, (r() - .5) * 1.4); d.add(b);
      mesh(new THREE.CapsuleGeometry(.016, .09 + r() * .05, 4, 8), dm, [0, .05, 0], { parent: b });
    }
  }
  const ax = toon(axon);
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(.22, -.05, .12),
    new THREE.Vector3(.5, -.02, .06),
    new THREE.Vector3(.78, -.08, .22),
  ]);
  g.add(mesh(new THREE.TubeGeometry(curve, 40, .026, 10, false), ax));
  if (myelin) for (let i = 1; i <= 6; i++) {
    const p = curve.getPoint(i / 7);
    mesh(new THREE.CapsuleGeometry(.05, .07, 4, 12), ax, [p.x, p.y, p.z], { rot: [0, 0, Math.PI / 2 - .25] });
  }
  const end = curve.getPoint(1);
  for (let i = 0; i < 4; i++) {  // the terminal bulbs, where the molecules are let go
    const t = new THREE.Group(); t.position.copy(end).add(new THREE.Vector3((r() - .5) * .05, (r() - .5) * .05, (r() - .5) * .05));
    g.add(t);
    mesh(new THREE.SphereGeometry(.035, 14, 10), ax, [0, 0, 0], { parent: t });
  }
  g.soma = body; g.curve = curve; g.end = end;
  g.scale.setScalar(size);
  return g;
}

// ── molecules in a volume ────────────────────────────────────────────────
// adenosine and friends: instanced dots that can be filled or cleared around a point.
export function molecules({ n = 400, color = '#67e8f9', size = .014, k = 1.7, seed = 2 } = {}) {
  const im = glowDots(n, size, color, k);
  const r = mulberry(seed), pts = [];
  for (let i = 0; i < n; i++) pts.push([r(), r(), r(), r()]);
  const P = new THREE.Vector3();
  // place(i, u, v, w): u,v,w are 0..1 inside the box (x, y, z)
  const set = (i, u, v, w) => { P.set(u, v, w); setDot(im, i, P, 1); };
  return {
    mesh: im, pts,
    // scatter: every dot gets its own place in the box, shown up to `count`
    fill(box, count, seedShift = 0) {
      const c = Math.min(count, n);
      for (let i = 0; i < n; i++) {
        if (i >= c) { set(i, 0, -99, 0); continue; }
        const p = pts[(i + seedShift) % n];
        set(i, box.x + (p[0] - .5) * box.w, box.y + (p[1] - .5) * box.h, box.z + (p[2] - .5) * box.d);
      }
      im.count = n; im.instanceMatrix.needsUpdate = true;
    },
    // one dot at a place, for a hand-placed molecule
    put(i, x, y, z, s = 1) { P.set(x, y, z); setDot(im, i, P, 1); im.count = Math.max(im.count, i + 1); im.instanceMatrix.needsUpdate = true; },
  };
}

// ── receptors on a membrane ──────────────────────────────────────────────
// the doors on the far side of the cleft: a row of little proteins with a notch. A caffeine molecule can sit in one.
export function receptors({ n = 7, spacing = .12, size = .1, color = '#9a5be5' } = {}) {
  const g = new THREE.Group(), doors = [];
  const m = toon(color);
  for (let i = 0; i < n; i++) {
    const d = new THREE.Group(); d.position.set((i - (n - 1) / 2) * spacing, 0, 0);
    g.add(d);
    const body = mesh(rbox(size * .8, size * 1.25, size * .5, .015), m, [0, 0, 0], { parent: d });
    const notch = mesh(rbox(size * .34, size * .5, size * .55, .01), toon('#252d50'), [0, -size * .18, 0], { parent: d });
    doors.push({ d, body, notch });
  }
  g.doors = doors;
  return g;
}

// ── a blood vessel, cut open lengthwise ──────────────────────────────────
// a pipe lying on its side with half of its wall removed, so the blood inside is visible; red cells drift along it.
export function capillary({ len = 1.4, R = .11, seed = 4, cells = 26 } = {}) {
  const g = new THREE.Group();
  const wall = toon('#d98a8f', { side: THREE.DoubleSide });
  // an open half tube: the near half of the pipe is cut away
  const tube = mesh(new THREE.CylinderGeometry(R, R, len, 36, 1, true, Math.PI * .15, Math.PI * 1.15), wall, [0, 0, 0], { rot: [0, 0, Math.PI / 2] });
  g.add(tube);
  // the cut edge, a lighter line along both rims
  for (const s of [-1, 1]) {
    const rim = mesh(new THREE.TorusGeometry(R, .012, 8, 24, Math.PI * 1.15), toon('#f2c9c4'), [0, 0, 0], { rot: [0, Math.PI / 2, Math.PI * .15 + s * 0] });
    rim.rotation.set(0, Math.PI / 2, Math.PI * .15); rim.scale.set(1, 1, 1);
    g.add(rim);
  }
  const im = glowDots(cells, .026, '#f04462', 1.1);
  const P = new THREE.Vector3();
  const blood = { mesh: im, update(t) {
    for (let i = 0; i < cells; i++) {
      const s = ((t * .16 + i / cells) % 1);
      const x = -len / 2 + s * len;
      const a = hash2(i) * 6.28;
      P.set(x, Math.sin(a) * R * .3, Math.cos(a) * R * .3);
      im.setMatrixAt(i, P);
    }
    im.count = cells; im.instanceMatrix.needsUpdate = true;
  } };
  g.blood = blood; g.len = len; g.R = R;
  return g;
}
const hash2 = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ── the space the brain sits in ──────────────────────────────────────────
// A dark room with one warm pool on the tissue and a violet rim: the inside of a head, lit like a table.
export function brainSpace(scene, { seed = 3, w = 2.2, d = 1.6 } = {}) {
  scene.background = new THREE.Color('#0c0e20'); scene.fog = new THREE.Fog('#12152c', 3.2, 9);
  const key = keyLight(scene, { from: new THREE.Vector3(-1.4, 2.6, 1.8), to: new THREE.Vector3(0, 0, 0), color: '#ffd9b0', intensity: 2.6, size: 2.4, far: 14 });
  const amb = ambience(scene, { sky: '#4a5aa8', ground: '#2a1830', fill: .34, rim: '#9a7bff', rimI: .9, rimFrom: [2.5, 1.6, -2] });
  const lamp = pool(scene, { from: new THREE.Vector3(.2, 1.5, 1.5), to: new THREE.Vector3(0, .2, 0), intensity: 3.2, angle: .6 });
  // the table the tissue stands on
  const table = mesh(rbox(9, .2, 7, .04), toon('#252d50'), [0, -.62, 0]);
  scene.add(table);
  return { key, amb, lamp, focus: new THREE.Vector3(0, .3, 0) };
}
