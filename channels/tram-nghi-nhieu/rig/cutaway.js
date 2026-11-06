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
  for (const phi of [a0, -a0]) group.add(cutFace(wall, phi, face));
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
    const faces = [a0, -a0].map(phi => { const f = cutFace(liq, phi, m); f.renderOrder = 3; return f; });
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
export const PROFILES = {
  bottle: [[0, 0], [.34, 0], [.38, .05], [.38, 1.15], [.33, 1.45], [.16, 1.85], [.14, 2.15], [.15, 2.2]],
  glass: [[0, 0], [.32, 0], [.34, .03], [.42, 1.1]],
  can: [[0, 0], [.3, 0], [.34, .06], [.34, 1.1], [.29, 1.2]],
  bulb: [[0, 0], [.12, 0], [.14, .3], [.42, .8], [.46, 1.1], [.36, 1.45], [.0, 1.62]],
};
