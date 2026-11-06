// Props that change state on screen, so a line about change has a picture of the change itself:
//   banana(): skin ripens per vertex (green → yellow → brown speckles), from everywhere or spreading out from spots;
//   bunch(): a hand of bananas on a crown;  apple(): streaked skin, stem, leaf (red or green);
//   bowl(), plate(): something to put them on.  Everything is a pure function of t.
import * as THREE from 'three';
import { PAL, toon, canvasTex, mesh, mulberry, clamp, lerp, ss, hash } from './kit.js';

export const C_GREEN = new THREE.Color('#8cc84c'), C_LIME = new THREE.Color('#d2d84a'), C_YEL = new THREE.Color('#f7c62f'),
  C_BROWN = new THREE.Color('#5a3518'), C_STEM = new THREE.Color('#4f6b2a'), C_TIP = new THREE.Color('#2e2216');

// centre line of a banana in its local XY plane: the stem at the origin, the body along +x, curving up toward +y
export function bananaCurve(len = .42, bend = .95) {
  const R = len / bend;
  return s => new THREE.Vector3(R * Math.sin(bend * s), R * (1 - Math.cos(bend * s)), 0);
}
// radius along the fruit: a thin stalk that flares into the body, a full middle, then a long taper to a small dark tip.
// The taper at both ends and the bend are what make it read as a banana and not a cucumber.
const rProfile = s => {
  if (s < .1) return .2 + .04 * s / .1;                                    // stalk
  if (s < .26) return lerp(.24, 1, ss((s - .1) / .16));                    // flares into the body
  if (s > .68) return lerp(1, .2, Math.pow((s - .68) / .32, 1.6));          // long taper to the tip
  return 1;
};

// one banana: a tube with five soft ridges; attribute aS (0 stem → 1 tip) and a per-vertex speckle seed
export function bananaGeo({ len = .42, rad = .04, bend = 1.15, nu = 72, nv = 30, cut = 1 } = {}) {
  const c = bananaCurve(len, bend), pos = [], sAt = [], spk = [], idx = [];
  const T = new THREE.Vector3(), N = new THREE.Vector3(), B = new THREE.Vector3(0, 0, 1), p = new THREE.Vector3();
  for (let i = 0; i <= nu; i++) {
    const s = i / nu * cut, o = c(s);
    T.subVectors(c(Math.min(s + .01, 1)), c(Math.max(s - .01, 0))).normalize();
    N.crossVectors(B, T).normalize();
    const r = rad * rProfile(s);
    for (let j = 0; j <= nv; j++) {
      const th = j / nv * Math.PI * 2, rr = r * (1 + .13 * Math.pow(Math.abs(Math.cos(2.5 * th)), .6) * clamp((s - .2) / .1) * clamp((.95 - s) / .1) - .065);   // five flat faces with soft edges
      p.copy(o).addScaledVector(N, Math.cos(th) * rr).addScaledVector(B, Math.sin(th) * rr);
      if (i === nu && cut >= 1) p.copy(o).addScaledVector(T, rad * .12);   // close the tip (a cut banana is closed by its section)
      if (i === 0) p.copy(o).addScaledVector(T, -rad * .1);    // close the stem end
      pos.push(p.x, p.y, p.z); sAt.push(s); spk.push(hash(i * 31.7 + j * 7.13) * .6 + hash(Math.floor(i / 3) * 3.1 + Math.floor(j / 2) * 9.7) * .4);
    }
  }
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const a = i * (nv + 1) + j, b = a + nv + 1;
    idx.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(pos.length), 3));
  g.setIndex(idx); g.computeVertexNormals();
  g.userData = { sAt, spk, len, rad, curve: c, cut, ring: pos.slice(nu * (nv + 1) * 3), nv };
  return g;
}

// The face of a banana cut across: cream flesh, a paler ring under the skin, and the core: three soft lobes meeting at
// the centre, lined with tiny dark seeds — what a real banana shows when it is sliced.
let _secTex = null;
export function bananaSectionTex() {
  return _secTex ??= canvasTex(512, 512, (g, w) => {
    const c = w / 2;
    g.fillStyle = '#f4ead0'; g.fillRect(0, 0, w, w);
    const rg = g.createRadialGradient(c, c, w * .08, c, c, w * .5);
    rg.addColorStop(0, '#efe0b4'); rg.addColorStop(.62, '#f6eed6'); rg.addColorStop(.86, '#fbf6e6'); rg.addColorStop(1, '#e9dcae');
    g.fillStyle = rg; g.beginPath(); g.arc(c, c, w * .5, 0, 7); g.fill();
    g.strokeStyle = 'rgba(190,165,105,.35)'; g.lineWidth = 3;
    for (let k = 0; k < 3; k++) {   // the three placental lobes
      const a = k * 2.094 - 1.57;
      g.beginPath(); g.moveTo(c, c); g.quadraticCurveTo(c + Math.cos(a - .5) * w * .13, c + Math.sin(a - .5) * w * .13, c + Math.cos(a) * w * .19, c + Math.sin(a) * w * .19);
      g.quadraticCurveTo(c + Math.cos(a + .5) * w * .13, c + Math.sin(a + .5) * w * .13, c, c); g.stroke();
      g.fillStyle = 'rgba(214,190,128,.45)'; g.fill();
      g.fillStyle = '#3b2a1a';
      for (let i = 0; i < 4; i++) { const r = w * (.05 + i * .035); g.beginPath(); g.arc(c + Math.cos(a) * r, c + Math.sin(a) * r, w * .009, 0, 7); g.fill(); }
    }
    g.fillStyle = '#d8c48c'; g.beginPath(); g.arc(c, c, w * .02, 0, 7); g.fill();
    g.strokeStyle = 'rgba(160,140,80,.12)'; g.lineWidth = 1.5;   // faint radial fibres
    for (let k = 0; k < 60; k++) { const a = k / 60 * 6.283; g.beginPath(); g.moveTo(c + Math.cos(a) * w * .22, c + Math.sin(a) * w * .22); g.lineTo(c + Math.cos(a) * w * .47, c + Math.sin(a) * w * .47); g.stroke(); }
  });
}

// skin colour for ripeness r (0 green, 1 ripe yellow, 1.5 speckled)
const _c = new THREE.Color();
export function skinColor(r, s, spk, out) {
  if (r < .5) out.copy(C_GREEN).lerp(C_LIME, ss(r / .5));
  else out.copy(C_LIME).lerp(C_YEL, ss((r - .5) / .45));
  if (r > 1.02 && spk > .97 - (r - 1) * .8) out.lerp(C_BROWN, .85);   // spk is 0..1: at 1.5 about a third of the skin is speckled
  if (s < .12) out.lerp(C_STEM, .75 * (1 - s / .12)).lerp(C_BROWN, .3 * clamp(r - .9));
  if (s > .988) out.copy(C_TIP); else if (s > .96) out.lerp(C_TIP, .45);
  return out;
}

// A banana mesh with ripen(t): base(t) is the ripeness everywhere; spots are {p (local), t0, speed} where the gas
// landed: the skin turns from that point outward.
export function banana(opts = {}) {
  const geo = bananaGeo(opts);
  const m = new THREE.Mesh(geo, toon('#ffffff', { vertexColors: true }));
  m.castShadow = m.receiveShadow = true;
  const P = geo.attributes.position, Cc = geo.attributes.color, { sAt, spk } = geo.userData;
  const v = new THREE.Vector3();
  m.spots = [];
  m.ripen = (base, t) => {
    for (let i = 0; i < P.count; i++) {
      let r = base;
      if (m.spots.length) {
        v.fromBufferAttribute(P, i);
        for (const sp of m.spots) {
          const a = t - sp.t0; if (a <= 0) continue;
          const R = sp.speed * a, d = v.distanceTo(sp.p);
          r = Math.max(r, sp.max * ss((R - d) / .05) * (1 - .25 * ss(d / .25)));
        }
      }
      skinColor(r, sAt[i], spk[i], _c); Cc.setXYZ(i, _c.r, _c.g, _c.b);
    }
    Cc.needsUpdate = true;
  };
  m.ripen(0, 0);
  if (geo.userData.cut < 1) {   // the section: a cap over the last ring, the flesh texture mapped across it
    const { ring, nv, curve, cut, rad } = geo.userData, o = curve(cut), cp = [o.x, o.y, o.z], uv = [.5, .5], id = [];
    const T = new THREE.Vector3().subVectors(curve(cut), curve(cut - .01)).normalize(), B = new THREE.Vector3(0, 0, 1), N = new THREE.Vector3().crossVectors(B, T);
    const v = new THREE.Vector3(), R = rad * rProfile(cut) * 1.08;
    for (let j = 0; j <= nv; j++) {
      v.set(ring[j * 3], ring[j * 3 + 1], ring[j * 3 + 2]); cp.push(v.x, v.y, v.z); v.sub(o);
      uv.push(.5 + v.dot(N) / R / 2, .5 + v.dot(B) / R / 2);
      if (j < nv) id.push(0, j + 1, j + 2);
    }
    const cg = new THREE.BufferGeometry();
    cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3)); cg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    cg.setIndex(id); cg.computeVertexNormals();
    const cap = new THREE.Mesh(cg, toon('#d6c9a6', { map: bananaSectionTex(), side: THREE.DoubleSide }));
    cap.castShadow = cap.receiveShadow = true; m.add(cap); m.section = { center: o.clone(), normal: T.clone(), R };
  }
  return m;
}

// A hand of bananas lying on its side: n fruits fanned from a crown. Returns { group, fruits, crown }.
export function bunch({ n = 5, seed = 3, len = .46 } = {}) {
  const r = mulberry(seed), group = new THREE.Group(), fruits = [];
  const crown = mesh(new THREE.CapsuleGeometry(.03, .17, 4, 10), toon('#5b6e2a'), [-.025, .035, 0], { rot: [Math.PI / 2, 0, 0] });
  group.add(crown);
  const stalk = mesh(new THREE.CylinderGeometry(.022, .026, .09, 8), toon('#3d4f1f'), [-.07, .07, 0], { rot: [0, 0, Math.PI / 2 - .6] });
  group.add(stalk);
  for (let i = 0; i < n; i++) {
    const u = n === 1 ? 0 : i / (n - 1) - .5;
    const b = banana({ len: len * (1 - .08 * Math.abs(u) + (r() - .5) * .04), bend: 1.0 + r() * .15 });
    const holder = new THREE.Group(); holder.add(b);
    holder.rotation.set(-u * .12 + (r() - .5) * .05, u * 1.0, -.06 + (r() - .5) * .05);
    holder.position.set(-.01 * Math.abs(u), .012 + .035 * (1 - 4 * u * u), -u * (n - 1) * .05);
    group.add(holder);
    fruits.push(b);
  }
  return { group, fruits, crown };
}

// apple: a lathe with dimples, streaked red skin, a stem and a leaf
export function apple({ R = .115, seed = 4, color = 'red' } = {}) {
  const base = color === 'green' ? '#8cc84c' : '#d8344a', streak = color === 'green' ? [60, 140, 40] : [150, 20, 40];
  const g = new THREE.Group(), pts = [];
  for (let i = 0; i <= 32; i++) {
    const a = i / 32 * Math.PI, y = -Math.cos(a) * R * .92, x = Math.sin(a) * R * (1 + .08 * Math.sin(a * 2) - .04);
    const dimple = Math.exp(-Math.pow((a - Math.PI) / .35, 2)) * R * .25 + Math.exp(-Math.pow(a / .3, 2)) * R * .12;
    pts.push(new THREE.Vector2(Math.max(x, .0005), y + (a > Math.PI / 2 ? -dimple : dimple)));
  }
  const r = mulberry(seed);
  const tex = canvasTex(512, 256, (c, w, h) => {
    c.fillStyle = base; c.fillRect(0, 0, w, h);
    for (let k = 0; k < 140; k++) { c.strokeStyle = `rgba(${streak[0] + r() * 40},${streak[1]},${streak[2]},${.2 + r() * .3})`; c.lineWidth = 2 + r() * 5; const x = r() * w; c.beginPath(); c.moveTo(x, 0); c.bezierCurveTo(x + (r() - .5) * 30, h * .3, x + (r() - .5) * 30, h * .7, x + (r() - .5) * 10, h); c.stroke(); }
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(247,189,39,0)'); gr.addColorStop(.75, 'rgba(247,189,39,0)'); gr.addColorStop(1, 'rgba(247,189,39,.55)');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
    for (let k = 0; k < 260; k++) { c.fillStyle = `rgba(255,236,200,${.25 + r() * .35})`; c.beginPath(); c.arc(r() * w, r() * h, 1 + r() * 1.6, 0, 7); c.fill(); }
  });
  tex.wrapS = THREE.RepeatWrapping;
  const body = mesh(new THREE.LatheGeometry(pts, 48), toon('#ffffff', { map: tex }), [0, 0, 0]);
  g.add(body);
  g.add(mesh(new THREE.CylinderGeometry(.006, .009, .07, 6), toon('#5a3a1e'), [.008, R * .78 + .02, 0], { rot: [0, 0, -.25] }));
  const leafShape = new THREE.Shape(); leafShape.moveTo(0, 0); leafShape.quadraticCurveTo(.035, .03, .08, 0); leafShape.quadraticCurveTo(.035, -.03, 0, 0);
  const leaf = mesh(new THREE.ShapeGeometry(leafShape), toon('#4f9a3a', { side: THREE.DoubleSide }), [.014, R * .78 + .045, 0], { rot: [.5, .3, .35] });
  g.add(leaf);
  g.R = R; g.body = body;
  return g;
}

// a shallow bowl (lathe) with a rim band; put fruit at y ≈ .06
export function bowl({ R = .42, color = '#f4ede0', band = PAL.red } = {}) {
  const g = new THREE.Group();
  const H = R * .55, t = R * .05;   // a deep bowl on a foot ring: the depth is what tells it from a plate
  const p = [[0, .012], [R * .36, .012], [R * .38, 0], [R * .44, 0], [R * .45, .03], [R * .7, H * .25], [R * .92, H * .65], [R, H], [R - t * .6, H + t * .3],
    [R - t, H - t * .2], [R * .87, H * .6], [R * .65, H * .22], [R * .38, t + .03], [0, t + .03]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(mesh(new THREE.LatheGeometry(p, 48), toon(color, { side: THREE.DoubleSide }), [0, 0, 0]));
  g.add(mesh(new THREE.TorusGeometry(R * .985, R * .022, 8, 64), toon(band), [0, H - R * .06, 0], { rot: [Math.PI / 2, 0, 0] }));
  return g;
}
// a flat plate with a printed rim
export function plate({ R = .5, color = '#f4ede0', rim = PAL.navy, accent = PAL.red } = {}) {
  const tex = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = color; c.fillRect(0, 0, w, h);
    c.strokeStyle = rim; c.lineWidth = 22; c.beginPath(); c.arc(w / 2, h / 2, w * .45, 0, 7); c.stroke();
    c.strokeStyle = accent; c.lineWidth = 6; c.beginPath(); c.arc(w / 2, h / 2, w * .38, 0, 7); c.stroke();
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; c.fillStyle = rim; c.beginPath(); c.arc(w / 2 + Math.cos(a) * w * .415, h / 2 + Math.sin(a) * w * .415, 7, 0, 7); c.fill(); }
  });
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(R, R * .8, .03, 64), toon('#ffffff', { map: tex }), [0, .015, 0]));
  return g;
}
