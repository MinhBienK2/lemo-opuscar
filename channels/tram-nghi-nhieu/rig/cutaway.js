// The inside of a thing: the object at macro scale, standing in a lit set, sliced open toward the camera.
// The camera stays OUTSIDE the object and looks into the cut: the shell, the cut faces and the stuff inside all
// catch the same key light, so the inside reads as a place, not as particles floating in a void.
import * as THREE from 'three';
import { toon, glowMat, mesh, fxLayer, mulberry, hash, clamp, lerp, GRAD3 } from './kit.js';

// A vessel turned on a lathe (bottle, glass, can, bulb, pipe, tank) with a wedge removed toward +z.
// profile: outer [r, y] from bottom (r = 0) to the mouth. thick: wall thickness. cut: wedge angle (rad).
// fill: liquid level (y) or null. Returns { group, rIn(y), rOut(y), mouth, bottom, level, cut, liquid }.
export function vessel(profile, { thick = .05, cut = 1.7, shell = toon('#4fa37a'), face = toon('#d9f2e4', { grad: GRAD3 }),
  fill = null, liquid = '#7a2f2a', liquidAlpha = .55, shine = true } = {}) {
  const group = new THREE.Group();
  const out = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const y0 = out[0].y, mouth = out[out.length - 1].y;
  const inn = out.map(p => new THREE.Vector2(Math.max(p.x - thick, .004), Math.max(p.y, y0 + thick))).filter((p, i) => i > 0);
  const interp = pts => y => {
    if (y <= pts[0].y) return pts[0].x;
    for (let i = 1; i < pts.length; i++) if (y <= pts[i].y) { const a = pts[i - 1], b = pts[i]; return lerp(a.x, b.x, (y - a.y) / Math.max(b.y - a.y, 1e-6)); }
    return pts[pts.length - 1].x;
  };
  const rOut = interp(out), rIn = interp(inn);
  // closed outline of the wall: outer up, across the lip, inner down to the axis
  const wall = [...out, ...inn.slice().reverse(), new THREE.Vector2(0, y0 + thick)];
  const a0 = cut / 2, a1 = Math.PI * 2 - cut;
  group.add(mesh(new THREE.LatheGeometry(wall, 128, a0, a1), shell));
  if (cut > .05) for (const phi of [a0, -a0]) group.add(cutFace(wall, phi, face));
  if (shine) for (const [phi, w, k] of [[a0 + .45, .07, .55], [a0 + .62, .025, .45]]) {
    const strip = out.filter(p => p.y > y0 + .05 && p.y < mouth - .02).map(p => new THREE.Vector2(p.x + .004, p.y));
    if (strip.length < 2) strip.splice(0, strip.length, new THREE.Vector2(rOut(y0 + .1) + .004, y0 + .1), new THREE.Vector2(rOut(mouth - .05) + .004, mouth - .05));
    const s = new THREE.Mesh(new THREE.LatheGeometry(strip, 4, phi, w), glowMat('#ffffff', k, { transparent: true, opacity: cut > .05 ? .55 : .25, depthWrite: false }));
    fxLayer(s); group.add(s);
  }
  const V = { group, rIn, rOut, mouth, bottom: y0 + thick, level: fill, cut, thick };
  if (fill != null) {
    const lp = inn.filter(p => p.y < fill).map(p => new THREE.Vector2(p.x - .002, p.y));
    const liq = [new THREE.Vector2(0, y0 + thick + .001), ...lp, new THREE.Vector2(rIn(fill) - .002, fill), new THREE.Vector2(0, fill)];
    const m = toon(liquid, { transparent: true, opacity: liquidAlpha, depthWrite: false, side: THREE.DoubleSide });
    const body = new THREE.Mesh(new THREE.LatheGeometry(liq, 96, a0, a1), m); body.renderOrder = 3;
    const faces = (cut > .05 ? [a0, -a0] : []).map(phi => { const f = cutFace(liq, phi, m); f.renderOrder = 3; return f; });
    // the liquid line on the cut faces: a bright meniscus so the level reads at a glance
    const line = new THREE.Group(); line.position.y = fill; line.rotation.y = a0 + a1 - Math.PI / 2;
    line.add(mesh(new THREE.TorusGeometry(rIn(fill) - .004, .006, 6, 96, a1), glowMat('#fff0d8', .9), [0, 0, 0], { rot: [Math.PI / 2, 0, 0], cast: false }));
    for (const o of [body, ...faces]) { fxLayer(o); group.add(o); }
    if (cut > .05) { fxLayer(line); group.add(line); }
    V.liquid = { body, faces, mat: m, line };
  }
  return V;
}

// A flat cross-section face for a lathe outline at angle phi (the cut you look into).
function cutFace(outline, phi, mat) {
  const g = new THREE.ShapeGeometry(new THREE.Shape(outline));
  g.rotateY(phi - Math.PI / 2);
  const m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true;
  if (mat.side === undefined || mat.side === THREE.FrontSide) mat.side = THREE.DoubleSide;
  return m;
}

// Is a point (x, z at height y) inside the remaining liquid and not in the removed wedge?
const inWedge = (x, z, cut) => Math.abs(Math.atan2(x, z)) < cut / 2;

// Bubbles that are born on the inner wall, cling while they grow, let go and rise, and pop at the surface.
// rate(t) 0..1: how many sites fire (0 while the pressure holds the gas dissolved). All closed-form in t (seekable).
// Returns { mesh, update(t), arrivals(t) } — arrivals(t) counts bubbles that reached the surface (feeds a foam head).
export function fizz(V, { n = 900, sites = 70, seed = 7, rate = () => 1, per = .22, r0 = .006, rDetach = .03, grow = .06, rise = .9, acc = 2.2,
  color = '#f4fdff', back = true } = {}) {
  const r = mulberry(seed), S = [];
  for (let i = 0; i < sites; i++) {
    const y = lerp(V.bottom + .02, V.level - .08, Math.pow(r(), .8));
    let phi; do phi = (r() - .5) * Math.PI * 2; while (Math.abs(phi) < V.cut / 2 + .12 || (!back && Math.abs(phi) > 2.2));
    const onFloor = r() < .2, rad = onFloor ? r() * (V.rIn(V.bottom) - .03) : V.rIn(y) - .012;
    S.push({ phi, y: onFloor ? V.bottom + .01 : y, rad });
  }
  const geo = new THREE.SphereGeometry(1, 20, 14);
  const m = new THREE.InstancedMesh(geo, toon(color, { grad: GRAD3, emissive: new THREE.Color(color).multiplyScalar(.35) }), n);
  m.frustumCulled = false; m.castShadow = false;
  const M = new THREE.Matrix4(), Qi = new THREE.Quaternion(), P = new THREE.Vector3(), Sc = new THREE.Vector3();
  const tau = (rDetach - r0) / grow, life = 4;
  function* alive(t) {
    for (let s = 0; s < sites; s++) {
      const st = S[s];
      for (let j = Math.floor((t - life) / per) - 1; j <= Math.floor(t / per); j++) {
        const tb = (j + hash(s * 131 + j * 7.3)) * per; const a = t - tb;
        if (a < 0 || a > life || hash(s * 17.1 + j * 3.7) > rate(tb)) continue;
        yield { st, a, k: s * 9973 + j };
      }
    }
  }
  function pos(st, a, k) {
    if (a < tau) { const rr = r0 + grow * a; return [st.rad, st.y, st.phi, rr, false]; }
    const d = a - tau, y = st.y + rise * d + .5 * acc * d * d;
    const rad = st.rad * (1 - clamp(d * 1.5)) * .9 + .1 * st.rad;
    return [rad, y, st.phi + .3 * Math.sin(k + a * 7) * clamp(d * 3) / (1 + rad), rDetach * (1 + .25 * d), y > V.level - .01];
  }
  return {
    mesh: m,
    update(t) {
      let i = 0;
      for (const { st, a, k } of alive(t)) {
        if (i >= n) break;
        const [rad, y, phi, rr, popped] = pos(st, a, k);
        if (popped) continue;
        P.set(Math.sin(phi) * rad, y, Math.cos(phi) * rad);
        M.compose(P, Qi, Sc.set(rr, rr, rr)); m.setMatrixAt(i++, M);
      }
      m.count = i; m.instanceMatrix.needsUpdate = true;
    },
    arrivals(t) {
      let c = 0; for (const { st, a, k } of alive(t)) if (pos(st, a, k)[4]) c++;
      return c;
    },
  };
}

// Gas still dissolved in the liquid: tiny specks spread through it; amount(t) 0..1 is the share still dissolved.
export function dissolved(V, { n = 500, seed = 3, amount = () => 1, size = .008, color = '#9fe8ff', k = 1.2 } = {}) {
  const r = mulberry(seed), pts = [];
  while (pts.length < n) {
    const y = lerp(V.bottom + .02, V.level - .02, r()), phi = (r() - .5) * Math.PI * 2;
    if (Math.abs(phi) < V.cut / 2 + .05) continue;
    pts.push([phi, y, Math.sqrt(r()) * (V.rIn(y) - .02), r()]);
  }
  const m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), glowMat(color, k), n);
  fxLayer(m); m.frustumCulled = false;
  const M = new THREE.Matrix4(), Qi = new THREE.Quaternion(), P = new THREE.Vector3(), Sc = new THREE.Vector3();
  return {
    mesh: m,
    update(t) {
      const f = amount(t); let i = 0;
      for (const [phi, y, rad, h] of pts) {
        if (h > f) continue;
        const w = .01 * Math.sin(t * 3 + h * 40);
        P.set(Math.sin(phi + w) * rad, y + w, Math.cos(phi + w) * rad);
        M.compose(P, Qi, Sc.setScalar(size)); m.setMatrixAt(i++, M);
      }
      m.count = i; m.instanceMatrix.needsUpdate = true;
    },
  };
}

// A foam head that climbs the vessel and, past the mouth, domes up and spills down the outside.
// height(t): how far the foam front has travelled above the liquid level (world units; may go past the mouth).
export function foam(V, { n = 900, seed = 5, height = () => 0, color = '#eadccc', size = [.025, .06], dome = .12 } = {}) {
  const r = mulberry(seed), B = [];
  for (let i = 0; i < n; i++) B.push({ u: Math.pow(r(), .7), phi: (r() - .5) * Math.PI * 2, rr: Math.sqrt(r()), s: lerp(size[0], size[1], r()), w: r() * 6 });
  const m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 12), toon(color, { grad: GRAD3 }), n);
  m.frustumCulled = false;
  const M = new THREE.Matrix4(), Qi = new THREE.Quaternion(), P = new THREE.Vector3(), Sc = new THREE.Vector3();
  const neck = V.mouth - V.level;
  return {
    mesh: m,
    update(t) {
      const h = height(t); let i = 0;
      if (h > 0) for (const b of B) {
        const d = b.u * h; // distance travelled by this bubble from the liquid surface
        const grow = clamp((h - d) / .08) * b.s;
        if (grow < .004) continue;
        let x, y, z;
        if (d < neck) { // inside: fills the bore
          if (Math.abs(b.phi) < V.cut / 2) continue;
          y = V.level + d; const rad = b.rr * (V.rIn(y) - b.s * .6);
          x = Math.sin(b.phi) * rad; z = Math.cos(b.phi) * rad;
        } else if (d < neck + dome) { // a dome over the mouth
          const q = (d - neck) / dome, rad = V.rOut(V.mouth) * (.4 + 1.2 * q) * b.rr;
          y = V.mouth + dome * Math.sin(q * Math.PI * .5) * (1 - .5 * b.rr); x = Math.sin(b.phi) * rad; z = Math.cos(b.phi) * rad;
        } else { // down the outside of the shell
          y = Math.max(V.mouth - (d - neck - dome) * 1.4, V.bottom - V.thick);
          const fall = V.mouth - y, rad = V.rOut(y) + b.s * .7 + .06 * b.rr * Math.min(fall, 1) + .01 * Math.sin(b.w + y * 9);
          x = Math.sin(b.phi) * rad; z = Math.cos(b.phi) * rad;
        }
        P.set(x, y, z); M.compose(P, Qi, Sc.setScalar(grow)); m.setMatrixAt(i++, M);
      }
      m.count = i; m.instanceMatrix.needsUpdate = true;
    },
  };
}

// Profiles to start from (outer [r, y], bottom → mouth). Scale or edit them; they are only shapes.
// glass is seen through, so it stays whole unless asked; an opaque can is cut open to show its inside
export const CUT = { bottle: 0, glass: 0, bulb: 0, can: 1.7 };
export const PROFILES = {
  bottle: [[0, 0], [.34, 0], [.38, .05], [.38, 1.15], [.33, 1.45], [.16, 1.85], [.14, 2.15], [.15, 2.2]],
  glass: [[0, 0], [.32, 0], [.34, .03], [.42, 1.1]],
  can: [[0, 0], [.3, 0], [.34, .06], [.34, 1.1], [.29, 1.2]],
  bulb: [[0, 0], [.12, 0], [.14, .3], [.42, .8], [.46, 1.1], [.36, 1.45], [.18, 1.6], [.0, 1.63]],
};

// A real thing cut open, with the parts that make it recognisable and its own materials (not a green shell):
//   preset('bottle' | 'can' | 'bulb' | 'glass', { scale, fill, liquid, cut }) → the vessel V, plus V.parts.
// can: aluminium, a printed band, a recessed lid with a pull tab. bulb: clear glass, a threaded metal screw base
// with a black contact, the glass stem, two support wires and a short coiled filament, dark when off
// (V.parts.filament.material.color.set(...).multiplyScalar(k) to light it). bottle: green glass with a cap. glass: clear drinking glass.
export function preset(kind, { scale = .25, fill = null, liquid = '#c98a2e', cut = CUT[kind] } = {}) {
  let prof = PROFILES[kind];
  if (kind === 'bulb' || kind === 'bottle') {   // a smooth outline: a faceted glass reads as crumpled plastic
    const c = new THREE.SplineCurve(prof.map(([r, y]) => new THREE.Vector2(r, y)));
    prof = c.getSpacedPoints(48).map(p => [Math.max(p.x, 0), p.y]); prof[prof.length - 1] = PROFILES[kind].at(-1); prof[0] = PROFILES[kind][0];
  }
  prof = prof.map(([r, y]) => [r * scale, y * scale]);
  const glassMat = c => toon(c, { transparent: true, opacity: .2, depthWrite: false, side: THREE.DoubleSide });
  const M = {
    bottle: { shell: toon('#3f9a64', { transparent: true, opacity: .55, depthWrite: false, side: THREE.DoubleSide }), face: toon('#bfe3c9', { grad: GRAD3, transparent: true, opacity: .7 }), thick: .012 * scale / .25 },
    can: { shell: toon('#c9cfd8'), face: toon('#9aa2ad', { grad: GRAD3 }), thick: .004 * scale / .25 },
    bulb: { shell: glassMat('#a9c4d2'), face: glassMat('#c4d8e2'), thick: .006 * scale / .25 },
    glass: { shell: glassMat('#e6f4ff'), face: glassMat('#ffffff'), thick: .01 * scale / .25 },
  }[kind];
  const V = vessel(prof, { ...M, fill, liquid, cut });
  const g = V.group, top = prof[prof.length - 1][1], R = Math.max(...prof.map(p => p[0])), parts = {};
  if (M.shell.transparent) g.traverse(o => { if (o.isMesh) fxLayer(o); });
  const a0 = cut / 2, a1 = Math.PI * 2 - cut;
  if (kind === 'can') {   // the inside of the can is darker than its outside, so the opening reads as an opening
    const inn = prof.slice(1).map(([r, y]) => new THREE.Vector2(r - M.thick * 1.5, Math.max(y, M.thick * 1.5)));
    g.add(mesh(new THREE.LatheGeometry(inn, 96, a0, a1), toon('#7b828d', { side: THREE.BackSide }), [0, 0, 0], { cast: false }));
    const band = new THREE.CylinderGeometry(R * 1.004, R * 1.004, top * .5, 96, 1, true, a0, a1);
    g.add(mesh(band, toon('#d23a3a', { side: THREE.DoubleSide }), [0, top * .45, 0]));
    g.add(mesh(new THREE.CylinderGeometry(R * 1.006, R * 1.006, top * .05, 96, 1, true, a0, a1), toon('#f4f4f4', { side: THREE.DoubleSide }), [0, top * .45, 0]));
    const lid = new THREE.CylinderGeometry(R * .86, R * .86, R * .04, 64, 1, false, a0, a1);
    g.add(mesh(lid, toon('#b8bec8'), [0, top - R * .08, 0]));
    g.add(mesh(new THREE.TorusGeometry(R * .9, R * .045, 8, 64, a1), toon('#d7dce4'), [0, top - R * .03, 0], { rot: [Math.PI / 2, 0, a0 + a1 - Math.PI / 2 + Math.PI] }));
    const tab = new THREE.Group(); tab.position.set(-R * .3, top - R * .05, -R * .1); g.add(tab);
    mesh(new THREE.TorusGeometry(R * .14, R * .035, 6, 20), toon('#aab1bb'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0], parent: tab });
    mesh(new THREE.BoxGeometry(R * .32, R * .03, R * .16), toon('#aab1bb'), [R * .2, 0, 0], { parent: tab });
    parts.tab = tab;
  }
  if (kind === 'bulb') {
    const metal = toon('#c7b27a'), r0 = PROFILES.bulb[1][0] * scale, h = R * .55;
    const base = new THREE.Group(); base.position.y = -h; g.add(base);
    mesh(new THREE.CylinderGeometry(r0 * 1.05, r0 * 1.0, h, 40), metal, [0, h / 2, 0], { parent: base });
    for (let i = 0; i < 4; i++) mesh(new THREE.TorusGeometry(r0 * 1.07, r0 * .1, 8, 40), metal, [0, h * (.18 + i * .2), 0], { rot: [Math.PI / 2, 0, 0], parent: base });
    mesh(new THREE.CylinderGeometry(r0 * .6, r0 * .9, h * .15, 32), toon('#1e1e22'), [0, -h * .06, 0], { parent: base });
    mesh(new THREE.SphereGeometry(r0 * .32, 16, 10), metal, [0, -h * .15, 0], { parent: base });
    const stemH = top * .45, stem = new THREE.Mesh(new THREE.CylinderGeometry(r0 * .25, r0 * .7, stemH, 20), glassMat('#c4d8e2'));
    stem.position.y = stemH / 2; fxLayer(stem); g.add(stem);
    const wire = toon('#6b6b70'), fy = top * .56, fw = R * .16;   // a short tight coil between two support wires
    for (const sx of [-1, 1]) {
      const c = new THREE.LineCurve3(new THREE.Vector3(sx * r0 * .15, stemH * .8, 0), new THREE.Vector3(sx * fw, fy, 0));
      g.add(mesh(new THREE.TubeGeometry(c, 4, R * .012, 6), wire, [0, 0, 0], { cast: false }));
    }
    const pts = []; for (let i = 0; i <= 120; i++) { const u = i / 120, a = u * Math.PI * 2 * 14; pts.push(new THREE.Vector3(lerp(-fw, fw, u), fy + Math.sin(a) * R * .018, Math.cos(a) * R * .018)); }
    const fil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 360, R * .005, 6), glowMat('#5a4a3a', 1));
    fxLayer(fil); g.add(fil); parts.filament = fil; parts.base = base;
  }
  if (kind === 'bottle') {
    const capR = prof[prof.length - 1][0] * 1.12;
    g.add(mesh(new THREE.CylinderGeometry(capR, capR, top * .05, 32, 1, false, a0, a1), toon('#d8b04a'), [0, top + top * .02, 0]));
  }
  V.parts = parts;
  return V;
}
