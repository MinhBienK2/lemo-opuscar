// Inside a thing, without leaving the room: a cut-open block that sits in the lit set (on S.focus), so the camera
// looks at the inside of an object the viewer has just seen whole. Not a wall of dots in a dark void.
//   skin  — a coloured rind on top, with gates (receptors, pores, doors) that visibly open;
//   flesh — the cut face, packed with rounded cells; each cell changes state (colour, swell) and holds a few grains
//           that shrink as it changes (starch → sugar, water → ice, anything that is used up).
// Everything is set per frame from t, so it keyframes like the rest of the rig.
//   const T = tissue({ skin: '#8cc84c', skinTo: '#f7c62f', cell: '#f3e6c8', cellTo: '#f5b440', gates: 6 });
//   T.group.position.copy(S.focus); scene.add(T.group);       // rests on y = 0, cut face toward +z
//   camera: T.cam(S.focus) → [x, y, z, lookX, lookY, lookZ] close on the cut face, the skin and the set behind in frame
//   T.setGate(i, k)            gate i opens (k 0 → 1);  T.gatePos(i) its world position (aim flow() at it)
//   T.setCell(i, k) / T.setCells((cell, i) => k)      cell state 0 → 1;  T.cells[i] = { x, y } on the face
//   T.setCells(T.spread(x, y, t, t0, speed))   a state that runs outward from a point (x, y on the face) from t0 on
//   T.setSkin(k)               the rind's colour, skin → skinTo
// A box reads as "a box". When the viewer must see the thing itself cut open, give it the thing's own cross-section:
//   tissue({ section: 5, rad: .12, d: .2 })    a rounded pentagon: a chunk of banana;  section: 32 → round (apple, carrot,
//   a stem, a pipe);  section: 6 → a pencil. Same API; it lies on y = 0, cut face toward +z, gates along the top of the rind.
import * as THREE from 'three';
import { toon, rbox, mesh, mulberry, clamp, ss } from './kit.js';

export function tissue({ w = .72, h = .3, d = .3, rind = .04, skin = '#8cc84c', skinTo = null, flesh = '#efe0bc',
  cell = '#f3e6c8', cellTo = '#f5b440', grain = '#ffffff', gates = 6, r = null, seed = 3, faceLight = 2.2,
  section = 0, rad = null } = {}) {
  if (section >= 3) { const R = rad ?? h * .6; return chunk({ sides: section, R, d, rind: Math.min(rind, R * .13), r: r ?? R * .075, skin, skinTo, flesh, cell, cellTo, grain, gates, seed, faceLight }); }
  r = r ?? .028;
  const g = new THREE.Group(), rnd = mulberry(seed);
  // the cut face gets its own soft light from the camera side: a set's key usually comes through the window behind,
  // which would leave the face (where the mechanism happens) in shadow and turn every colour to mud
  if (faceLight > 0) {
    const L = new THREE.SpotLight('#fff1dc', faceLight, 2.2, .7, .9, 2); L.position.set(.15, h * 1.6, d / 2 + .9);
    L.target.position.set(0, h * .45, d / 2); g.add(L, L.target); L.castShadow = false; g.faceLight = L;
  }
  // the body behind the cut face, and the rind on top (slightly domed so the key light grades across it)
  const body = mesh(rbox(w, h - rind, d, .02), toon(flesh), [0, (h - rind) / 2, 0]); g.add(body);
  const skinMat = toon(skin);
  const rindM = mesh(rbox(w + .01, rind, d + .01, .018), skinMat, [0, h - rind / 2, 0]); g.add(rindM);
  const c0 = new THREE.Color(skin), c1 = new THREE.Color(skinTo || skin);
  // cells: hex-packed on the cut face (z = d/2), flattened spheres that bulge out of it
  const cells = [], fh = h - rind - .02;
  for (let row = 0, y = r + .012; y < fh - r * .6; row++, y += r * 1.72)
    for (let x = -w / 2 + r + .012 + (row % 2) * r; x < w / 2 - r * .9; x += r * 2.02) cells.push({ x, y });
  const n = cells.length, cm = toon('#ffffff');
  const CI = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 18, 12), cm, n); CI.castShadow = CI.receiveShadow = true;
  const GI = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), toon(grain), n * 3); GI.castShadow = false;
  g.add(CI, GI);
  const ca = new THREE.Color(cell), cb = new THREE.Color(cellTo), tmp = new THREE.Color();
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const state = new Float32Array(n), jit = cells.map(() => [rnd(), rnd(), rnd()]);
  const draw = () => {
    for (let i = 0; i < n; i++) {
      const k = state[i], { x, y } = cells[i], sw = 1 + .12 * ss(k);
      m4.compose(p.set(x, y, d / 2 - r * .15), q, s.set(r * .97 * sw, r * .86 * sw, r * .5 * sw)); CI.setMatrixAt(i, m4);
      CI.setColorAt(i, tmp.copy(ca).lerp(cb, ss(k)).multiplyScalar(.94 + .1 * jit[i][0]));
      for (let j = 0; j < 3; j++) {                                    // grains: used up as the cell turns
        const a = jit[i][j] * 6.28 + j * 2.1, gr = r * .2 * (1 - ss(k * 1.3)) + 1e-5;
        m4.compose(p.set(x + Math.cos(a) * r * .42, y + Math.sin(a) * r * .38, d / 2 + r * .26), q, s.set(gr, gr, gr * .7));
        GI.setMatrixAt(i * 3 + j, m4);
      }
    }
    CI.instanceMatrix.needsUpdate = GI.instanceMatrix.needsUpdate = true; if (CI.instanceColor) CI.instanceColor.needsUpdate = true;
  };
  // gates on the rind, along the front edge so the camera on the cut face sees them: a ring and a hinged lid
  const G = [], ringMat = toon('#3e5a22'), lidMat = toon('#d8f08a');
  for (let i = 0; i < gates; i++) {
    const x = -w / 2 + w * (i + .5) / gates + (rnd() - .5) * .02, z = d / 2 - .045;
    const holder = new THREE.Group(); holder.position.set(x, h + .002, z); g.add(holder);
    holder.add(mesh(new THREE.TorusGeometry(.024, .007, 8, 20), ringMat, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
    const hinge = new THREE.Group(); hinge.position.set(0, .004, -.024); holder.add(hinge);
    hinge.add(mesh(new THREE.CylinderGeometry(.022, .022, .008, 18), lidMat, [0, 0, .024]));
    G.push({ holder, hinge });
  }
  const T = {
    group: g, cells, n,
    setCell: (i, k) => { state[i] = clamp(k); },
    setCells: f => { for (let i = 0; i < n; i++) state[i] = clamp(f(cells[i], i)); draw(); },
    spread: (x, y, t, t0, speed = .25) => c => { const a = t - t0; return a <= 0 ? 0 : ss((speed * a - Math.hypot(c.x - x, c.y - y)) / .05); },
    setGate: (i, k) => { G[i].hinge.rotation.x = -1.9 * ss(k); },
    gatePos: i => G[i].holder.getWorldPosition(new THREE.Vector3()),
    setSkin: k => { skinMat.color.copy(c0).lerp(c1, ss(k)); },
    cam: f => [f.x + .18, f.y + h * 1.9, f.z + d / 2 + 1.05, f.x, f.y + h * .5, f.z + d / 2 - .05],
    update: draw,
  };
  draw();
  return T;
}

// a chunk cut from a long thing with the given cross-section (polygon with rounded corners, or a circle for sides ≥ 24)
function chunk({ sides, R, d, rind, skin, skinTo, flesh, cell, cellTo, grain, gates, r, seed, faceLight }) {
  const g = new THREE.Group(), rnd = mulberry(seed);
  const a0 = -Math.PI / 2 + Math.PI / sides;                      // a flat side down
  const poly = (rr, round) => {
    const S = new THREE.Shape();
    if (sides >= 24) { S.absarc(0, 0, rr, 0, Math.PI * 2, false); return S; }
    const P = [...Array(sides)].map((_, i) => new THREE.Vector2(Math.cos(a0 + i * 2 * Math.PI / sides) * rr, Math.sin(a0 + i * 2 * Math.PI / sides) * rr));
    for (let i = 0; i < sides; i++) {
      const p = P[i], a = P[(i + sides - 1) % sides], b = P[(i + 1) % sides];
      const pa = p.clone().lerp(a, round), pb = p.clone().lerp(b, round);
      if (i === 0) S.moveTo(pa.x, pa.y); else S.lineTo(pa.x, pa.y);
      S.quadraticCurveTo(p.x, p.y, pb.x, pb.y);
    }
    S.closePath(); return S;
  };
  const inside = (x, y, rr) => {                                  // point inside the (unrounded) section of radius rr
    if (sides >= 24) return Math.hypot(x, y) < rr;
    const ap = rr * Math.cos(Math.PI / sides);
    for (let i = 0; i < sides; i++) { const a = a0 + (i + .5) * 2 * Math.PI / sides; if (x * Math.cos(a) + y * Math.sin(a) > ap) return false; }
    return true;
  };
  const cy = sides >= 24 ? R : R * Math.cos(Math.PI / sides);    // centre height: the section rests on y = 0
  const ex = (S, dd) => { const G = new THREE.ExtrudeGeometry(S, { depth: dd, bevelEnabled: false, curveSegments: 24 }); G.translate(0, cy, -dd / 2); G.computeVertexNormals(); return G; };
  if (faceLight > 0) {
    const L = new THREE.SpotLight('#fff1dc', faceLight, 2.4, .7, .9, 2); L.position.set(.15, cy * 2.6, d / 2 + .9);
    L.target.position.set(0, cy, d / 2); g.add(L, L.target); L.castShadow = false; g.faceLight = L;
  }
  const Ri = R - rind;
  g.add(mesh(ex(poly(Ri, .32), d), toon(flesh)));
  const skinMat = toon(skin), ring = poly(R, .32); ring.holes.push(poly(Ri, .32));
  const rindM = new THREE.Mesh(ex(ring, d + .006), skinMat); rindM.castShadow = rindM.receiveShadow = true; g.add(rindM);
  const c0 = new THREE.Color(skin), c1 = new THREE.Color(skinTo || skin);
  // cells: hex-packed inside the section, on the cut face
  const cells = [];
  for (let row = 0, y = -Ri + r; y < Ri - r * .5; row++, y += r * 1.72)
    for (let x = -Ri + r + (row % 2) * r; x < Ri - r * .5; x += r * 2.02) if (inside(x, y, Ri - r * 1.05)) cells.push({ x, y: y + cy });
  const n = cells.length;
  const CI = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 18, 12), toon('#ffffff'), n); CI.castShadow = CI.receiveShadow = true;
  const GI = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), toon(grain), n * 3); GI.castShadow = false;
  g.add(CI, GI);
  const ca = new THREE.Color(cell), cb = new THREE.Color(cellTo), tmp = new THREE.Color();
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const state = new Float32Array(n), jit = cells.map(() => [rnd(), rnd(), rnd()]);
  const draw = () => {
    for (let i = 0; i < n; i++) {
      const k = state[i], { x, y } = cells[i], sw = 1 + .12 * ss(k);
      m4.compose(p.set(x, y, d / 2 - r * .15), q, s.set(r * .97 * sw, r * .86 * sw, r * .5 * sw)); CI.setMatrixAt(i, m4);
      CI.setColorAt(i, tmp.copy(ca).lerp(cb, ss(k)).multiplyScalar(.94 + .1 * jit[i][0]));
      for (let j = 0; j < 3; j++) {
        const a = jit[i][j] * 6.28 + j * 2.1, gr = r * .2 * (1 - ss(k * 1.3)) + 1e-5;
        m4.compose(p.set(x + Math.cos(a) * r * .42, y + Math.sin(a) * r * .38, d / 2 + r * .26), q, s.set(gr, gr, gr * .7));
        GI.setMatrixAt(i * 3 + j, m4);
      }
    }
    CI.instanceMatrix.needsUpdate = GI.instanceMatrix.needsUpdate = true; if (CI.instanceColor) CI.instanceColor.needsUpdate = true;
  };
  // gates on the upper faces of the rind (a circle: over its top arc), near the cut face, each lying on the surface
  const G = [], ringMat = toon('#3e5a22'), lidMat = toon('#d8f08a'), gs = R * .17;
  const faces = sides >= 24 ? [...Array(gates)].map((_, i) => Math.PI / 2 + (gates > 1 ? (i / (gates - 1) - .5) * 1.4 : 0))
    : [...Array(sides)].map((_, k) => a0 + (k + .5) * 2 * Math.PI / sides).filter(f => Math.sin(f) > .3).sort((a, b) => Math.sin(b) - Math.sin(a));
  for (let i = 0; i < gates; i++) {
    const a = faces[i % faces.length], row = Math.floor(i / faces.length), z = d / 2 - gs * 1.6 - row * gs * 2.6;
    const rr = (sides >= 24 ? R : cy) + .001;                       // on the circle, or on the middle of a flat face
    const holder = new THREE.Group(); holder.position.set(Math.cos(a) * rr, cy + Math.sin(a) * rr, z);
    holder.rotation.z = a - Math.PI / 2; g.add(holder);
    holder.add(mesh(new THREE.TorusGeometry(gs, gs * .3, 8, 20), ringMat, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
    const hinge = new THREE.Group(); hinge.position.set(0, gs * .2, -gs); holder.add(hinge);
    hinge.add(mesh(new THREE.CylinderGeometry(gs * .9, gs * .9, gs * .35, 18), lidMat, [0, 0, gs]));
    G.push({ holder, hinge });
  }
  const T = {
    group: g, cells, n,
    setCell: (i, k) => { state[i] = clamp(k); },
    setCells: f => { for (let i = 0; i < n; i++) state[i] = clamp(f(cells[i], i)); draw(); },
    spread: (x, y, t, t0, speed = .25) => c => { const a = t - t0; return a <= 0 ? 0 : ss((speed * a - Math.hypot(c.x - x, c.y - y)) / .05); },
    setGate: (i, k) => { G[i].hinge.rotation.x = -1.9 * ss(k); },
    gatePos: i => G[i].holder.getWorldPosition(new THREE.Vector3()),
    setSkin: k => { skinMat.color.copy(c0).lerp(c1, ss(k)); },
    cam: f => [f.x + .12, f.y + cy * 2.4, f.z + d / 2 + R * 6.5, f.x, f.y + cy, f.z + d / 2 - .02],
    update: draw,
  };
  draw();
  return T;
}
