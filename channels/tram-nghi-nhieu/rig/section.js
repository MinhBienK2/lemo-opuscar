// section(): cut a whole, finished object with one flat plane, the way a saw would, and fill every cut solid with a
// flat face. The cut object IS the whole object (same shell, same parts, same colours), so the viewer who saw it whole
// knows what they are looking into. Build the object whole first (it passes review.sh --props whole), then cut it.
//
//   const C = section(cooker, { normal: [0, 0, 1], at: 0 })  → { group, caps }
//     normal  the plane's normal in the object's own space; the side it points to is removed (point it at the camera)
//     at      where the plane sits along the normal (object units); 0 = through the object's origin
//     cap     (mesh, material) => material | null  — the face a cut solid gets; default: the mesh's own colour, a shade
//             darker (the inside of a thing is darker than its skin). Return null for no face.
//   Glass, glow and other transparent meshes are cut without a face. A mesh with userData.hollow = true is a thin
//   shell: cut without a face and drawn from both sides. A solid that should show an inside must be built with that
//   inside: a pot is a wall with thickness and an empty middle, not a filled cylinder (the cut would show a full disc).
//   The original object is left untouched; place C.group where the original was (it keeps its transform).
//   Points, lines and sprites are kept when their origin is on the kept side. Cut once per shot, not every frame.
import * as THREE from 'three';
import { toon } from './kit.js';

export function section(root, { normal = [0, 0, 1], at = 0, cap = defaultCap } = {}) {
  root.updateMatrixWorld(true);
  const n = new THREE.Vector3(...normal).normalize();
  const toRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const group = new THREE.Group();
  group.position.copy(root.position); group.quaternion.copy(root.quaternion); group.scale.copy(root.scale);
  group.name = (root.name || 'object') + ' (cut)';
  const caps = [];
  // a plane basis for the cap outlines
  const u = Math.abs(n.y) < .9 ? new THREE.Vector3(0, 1, 0).cross(n).normalize() : new THREE.Vector3(1, 0, 0).cross(n).normalize();
  const v = n.clone().cross(u).normalize(), o = n.clone().multiplyScalar(at);
  const box = new THREE.Box3().setFromObject(root), eps = Math.max(box.getSize(new THREE.Vector3()).length() * 2e-5, 1e-7);

  root.traverse(obj => {
    if (obj === root && !obj.isMesh) return;
    const M = new THREE.Matrix4().multiplyMatrices(toRoot, obj.matrixWorld);
    if ((obj.isPoints || obj.isLine || obj.isSprite) && !obj.children.length) {
      const p = new THREE.Vector3().setFromMatrixPosition(M);
      if (n.dot(p) - at <= 0) { const c = obj.clone(false); M.decompose(c.position, c.quaternion, c.scale); group.add(c); }
      return;
    }
    if (!obj.isMesh || !obj.geometry || !obj.visible) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    const mat = mats[0];
    const mlist = obj.isInstancedMesh ? [...Array(obj.count)].map((_, i) => {
      const im = new THREE.Matrix4(); obj.getMatrixAt(i, im); return new THREE.Matrix4().multiplyMatrices(M, im);
    }) : [M];
    for (const MM of mlist) {
      const res = cutGeometry(obj.geometry, MM, n, at, eps);
      if (!res) continue;
      const hollow = obj.userData.hollow || mat.transparent || mat.isMeshBasicMaterial;
      let m2 = mat;
      if (obj.userData.hollow && mat.side !== THREE.DoubleSide) { m2 = mat.clone(); m2.side = THREE.DoubleSide; }
      if (res.geo) {
        const piece = new THREE.Mesh(res.geo, m2);
        piece.castShadow = obj.castShadow; piece.receiveShadow = obj.receiveShadow; piece.layers.mask = obj.layers.mask;
        piece.renderOrder = obj.renderOrder; piece.name = obj.name; group.add(piece);
      }
      if (hollow || !res.segs.length) continue;
      const cm = cap(obj, mat); if (!cm) continue;
      const g = capGeometry(res.segs, n, u, v, o, eps);
      if (!g) continue;
      const face = new THREE.Mesh(g, cm);
      face.castShadow = obj.castShadow; face.receiveShadow = true; face.layers.mask = obj.layers.mask;
      face.name = (obj.name || 'part') + ' (cut face)'; group.add(face); caps.push(face);
    }
  });
  return { group, caps };
}

function defaultCap(obj, mat) {
  if (!mat.color) return null;
  const c = mat.color.clone().multiplyScalar(.82);
  return toon(c, { side: THREE.DoubleSide, map: null });
}

// clip every triangle against the plane (keep n·p <= at); returns the kept geometry and the cut segments (root space)
function cutGeometry(geo, M, n, at, eps) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const P = g.attributes.position; if (!P) return null;
  const N = g.attributes.normal, UV = g.attributes.uv, C = g.attributes.color;
  const nm = new THREE.Matrix3().getNormalMatrix(M);
  const out = { p: [], n: [], uv: [], c: [] }, segs = [];
  const vert = i => {
    const p = new THREE.Vector3().fromBufferAttribute(P, i).applyMatrix4(M);
    return {
      p, d: n.dot(p) - at,
      n: N ? new THREE.Vector3().fromBufferAttribute(N, i).applyMatrix3(nm).normalize() : null,
      uv: UV ? new THREE.Vector2().fromBufferAttribute(UV, i) : null,
      c: C ? new THREE.Vector3().fromBufferAttribute(C, i) : null,
    };
  };
  const mix = (a, b) => {
    const t = a.d / (a.d - b.d);
    return {
      p: a.p.clone().lerp(b.p, t), d: 0,
      n: a.n && a.n.clone().lerp(b.n, t).normalize(), uv: a.uv && a.uv.clone().lerp(b.uv, t), c: a.c && a.c.clone().lerp(b.c, t),
    };
  };
  const emit = (...vs) => { for (const x of vs) { out.p.push(x.p.x, x.p.y, x.p.z); if (x.n) out.n.push(x.n.x, x.n.y, x.n.z); if (x.uv) out.uv.push(x.uv.x, x.uv.y); if (x.c) out.c.push(x.c.x, x.c.y, x.c.z); } };
  let removed = 0;
  for (let i = 0; i < P.count; i += 3) {
    const t = [vert(i), vert(i + 1), vert(i + 2)];
    const keep = t.map(x => x.d <= eps);
    const k = keep.filter(Boolean).length;
    if (k === 3) { emit(...t); continue; }
    removed++;
    if (k === 0) continue;
    // Sutherland–Hodgman against one plane
    const poly = [], cut = [];
    for (let j = 0; j < 3; j++) {
      const a = t[j], b = t[(j + 1) % 3], ka = keep[j], kb = keep[(j + 1) % 3];
      if (ka) poly.push(a);
      if (ka !== kb) { const m = mix(a, b); poly.push(m); cut.push(m.p); }
    }
    for (let j = 1; j + 1 < poly.length; j++) emit(poly[0], poly[j], poly[j + 1]);
    if (cut.length === 2 && cut[0].distanceTo(cut[1]) > eps) segs.push(cut);
  }
  if (!removed) return { geo: geo.clone().applyMatrix4(M), segs: [] };
  if (!out.p.length) return { geo: null, segs };
  const r = new THREE.BufferGeometry();
  r.setAttribute('position', new THREE.Float32BufferAttribute(out.p, 3));
  if (out.n.length === out.p.length) r.setAttribute('normal', new THREE.Float32BufferAttribute(out.n, 3)); else r.computeVertexNormals();
  if (out.uv.length / 2 === out.p.length / 3) r.setAttribute('uv', new THREE.Float32BufferAttribute(out.uv, 2));
  if (out.c.length === out.p.length) r.setAttribute('color', new THREE.Float32BufferAttribute(out.c, 3));
  return { geo: r, segs };
}

// chain the cut segments into closed loops, nest them (a loop inside an odd number of loops is a hole), fill
function capGeometry(segs, n, u, v, o, eps) {
  const q = 1 / (eps * 4), key = p => `${Math.round(p.x * q)},${Math.round(p.y * q)},${Math.round(p.z * q)}`;
  const adj = new Map(), pt = new Map();
  segs.forEach(([a, b], i) => {
    for (const [p, w] of [[a, b], [b, a]]) {
      const k = key(p); pt.set(k, p);
      if (!adj.has(k)) adj.set(k, []);
      adj.get(k).push({ to: key(w), i });
    }
  });
  const used = new Set(), chains = [];
  for (const [i, [a]] of segs.entries()) {
    if (used.has(i)) continue;
    const start = key(a), loop = [start]; let cur = start, closed = false;
    for (let guard = 0; guard < segs.length + 2; guard++) {
      const e = (adj.get(cur) || []).find(x => !used.has(x.i));
      if (!e) break;
      used.add(e.i); cur = e.to;
      if (cur === start) { closed = true; break; }
      loop.push(cur);
    }
    // a chain that stopped early may continue from its first point the other way
    if (!closed) for (let guard = 0; guard < segs.length + 2; guard++) {
      const e = (adj.get(loop[0]) || []).find(x => !used.has(x.i));
      if (!e) break;
      used.add(e.i); loop.unshift(e.to);
    }
    chains.push({ pts: loop.map(k => pt.get(k)), closed });
  }
  // nearly closed outlines (a lathe whose axis points do not quite meet, a seam): join ends that almost touch
  const span = Math.max(...segs.flat().map(p => p.length()), 1e-6), tol = span * .02;
  const open = chains.filter(c => !c.closed && c.pts.length > 1);
  for (let changed = true; changed;) {
    changed = false;
    for (const a of open) {
      if (a.closed || a.gone) continue;
      if (a.pts.length > 2 && a.pts[0].distanceTo(a.pts.at(-1)) < tol) { a.closed = true; changed = true; continue; }
      let best = null, bd = tol;
      for (const b of open) {
        if (b === a || b.gone || b.closed) continue;
        for (const [rev, d] of [[false, a.pts.at(-1).distanceTo(b.pts[0])], [true, a.pts.at(-1).distanceTo(b.pts.at(-1))]]) if (d < bd) { bd = d; best = { b, rev }; }
      }
      if (best) { a.pts.push(...(best.rev ? best.b.pts.slice().reverse() : best.b.pts)); best.b.gone = true; changed = true; }
    }
  }
  const loops = chains.filter(c => c.closed && !c.gone && c.pts.length >= 3)
    .map(c => c.pts.map(p0 => { const p = p0.clone().sub(o); return new THREE.Vector2(p.dot(u), p.dot(v)); }));
  if (!loops.length) return null;
  const area = l => THREE.ShapeUtils.area(l);
  const inside = (p, l) => { let c = false; for (let i = 0, j = l.length - 1; i < l.length; j = i++) { const a = l[i], b = l[j]; if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) c = !c; } return c; };
  const info = loops.map(l => ({ l, A: Math.abs(area(l)) })).filter(x => x.A > eps * eps).sort((a, b) => b.A - a.A);
  info.forEach((x, i) => { x.parents = info.slice(0, i).filter(y => inside(x.l[0], y.l)); x.depth = x.parents.length; });
  const shapes = [];
  for (const x of info) {
    if (x.depth % 2) continue;
    const s = new THREE.Shape(area(x.l) < 0 ? x.l.slice().reverse() : x.l);
    for (const h of info) if (h.depth === x.depth + 1 && h.parents.includes(x)) s.holes.push(new THREE.Path(area(h.l) > 0 ? h.l.slice().reverse() : h.l));
    shapes.push(s);
  }
  if (!shapes.length) return null;
  const g = new THREE.ShapeGeometry(shapes), P = g.attributes.position, lift = n.clone().multiplyScalar(-eps * 2);
  for (let i = 0; i < P.count; i++) {
    const x = P.getX(i), y = P.getY(i);
    const p = o.clone().addScaledVector(u, x).addScaledVector(v, y).add(lift);
    P.setXYZ(i, p.x, p.y, p.z);
  }
  g.deleteAttribute('normal'); const nn = []; for (let i = 0; i < P.count; i++) nn.push(n.x, n.y, n.z);
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nn, 3));
  g.computeBoundingSphere();
  return g;
}
