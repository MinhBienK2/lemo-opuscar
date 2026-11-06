// Effects: heat squiggles, glowing particles, halos, spark streaks, a toy hand, a speed table along a path.
import * as THREE from 'three';
import { toon, rbox, mesh, fxLayer, PAL, clamp, ss, hash } from './kit.js';

// A cartoon heat squiggle: a camera-facing ribbon whose centre line is a sine wave.
// It rises (uHead), and above uCeil folds back down (a wave bouncing off a lid).
const SQ_VS = `
uniform float uHead, uLen, uCeil, uAmp, uFreq, uPhase, uWidth;
varying float vS, vRefl, vY, vX;
void main(){
  float s = 0.5 - position.y;            // 0 = head, 1 = tail
  float yr = uHead - s * uLen;
  float refl = yr > uCeil ? 1.0 : 0.0;
  float y = refl > 0.5 ? 2.0 * uCeil - yr : yr;
  float a = uAmp * (0.6 + 0.4 * s) * (1.0 + 0.6 * refl);
  float x = a * sin(yr * uFreq + uPhase) + position.x * uWidth * (1.0 - 0.5 * s);
  vS = s; vRefl = refl; vY = yr; vX = position.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, 0.0, 1.0);
}`;
const SQ_FS = `
uniform vec3 uColor, uColor2; uniform float uAlpha;
varying float vS, vRefl, vY, vX;
void main(){
  if (vY < 0.0) discard;
  float a = uAlpha * smoothstep(0.0, 0.12, vS) * (1.0 - smoothstep(0.55, 1.0, vS));
  float core = 1.0 - pow(abs(vX) * 2.0, 2.0);
  vec3 c = mix(uColor, uColor2, vRefl);
  gl_FragColor = vec4(c * (0.6 + 0.8 * core), a * core);
}`;
export function squiggle(color = PAL.orange, color2 = PAL.red) {
  const U = {
    uHead: { value: 0 }, uLen: { value: .3 }, uCeil: { value: 99 }, uAmp: { value: .02 }, uFreq: { value: 40 }, uPhase: { value: 0 },
    uWidth: { value: .012 }, uColor: { value: new THREE.Color(color).multiplyScalar(2.2) }, uColor2: { value: new THREE.Color(color2).multiplyScalar(2.4) }, uAlpha: { value: 1 },
  };
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 60), new THREE.ShaderMaterial({
    uniforms: U, vertexShader: SQ_VS, fragmentShader: SQ_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  }));
  m.frustumCulled = false; m.renderOrder = 10; fxLayer(m); m.U = U;
  return m;
}

// glowing instanced spheres
export function glowDots(n, r, color, k = 4) {
  const im = new THREE.InstancedMesh(new THREE.SphereGeometry(r, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), toneMapped: false, transparent: true, depthWrite: false }), n);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); im.frustumCulled = false; im.renderOrder = 8; fxLayer(im); im.count = 0;
  return im;
}
// halo sprites (additive soft disc), instanced as camera-facing quads
export function halos(n, color, k = 1.5, tex) {
  const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(color).multiplyScalar(k), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), n);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); im.frustumCulled = false; im.renderOrder = 9; fxLayer(im); im.count = 0;
  return im;
}
// spark streaks: unit box stretched along velocity
export function sparks(n, color, k = 5) {
  const g = new THREE.BoxGeometry(1, 1, 1); g.translate(0, 0, -.5);
  const im = new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), toneMapped: false, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), n);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); im.frustumCulled = false; im.renderOrder = 9; fxLayer(im); im.count = 0;
  return im;
}

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _p = new THREE.Vector3(), _z = new THREE.Vector3(0, 0, 1);
export function setDot(im, i, p, s) { _m.compose(p, _q.identity(), _s.set(s, s, s)); im.setMatrixAt(i, _m); }
export function setHalo(im, i, p, s, camQ) { _m.compose(p, camQ, _s.set(s, s, s)); im.setMatrixAt(i, _m); }
export function setStreak(im, i, p, v, len, w) {
  _p.copy(v).normalize(); _q.setFromUnitVectors(_z, _p.negate());
  _m.compose(p, _q, _s.set(w, w, len)); im.setMatrixAt(i, _m);
}

// ── flow: an invisible agent (a gas, a smell, heat, a signal) made into a thing you can see at a glance ──
// A continuous stream of tinted, ink-outlined puffs that leaves the source, rides an arc through the air and pours
// into the receiver. Not a few sparkles: the puffs overlap into one body, so with the sound off it reads as
// "something goes from this to that". Pure function of t.
//   const F = flow(from, to, { color, size, lift, n, rate, seed, opacity });  scene.add(F);
//   pick a colour unlike both objects (the default pale cyan reads as "air"); size defaults to 5% of the distance
//   F.update(t, go)  go 0→1: how far the stream reaches (0 = nothing yet, 1 = it touches the receiver and keeps pouring);
//                    keyframe go on the words ("bay sang" → 0..1), and start the receiver's change when go reaches 1
//   F.head()         the front of the stream (a label, a camera that follows it);  F.at = the receiver point
//   F.amount(k)      0..1 thins the stream (a trace, "rất ít") without changing its path
export function flow(from, to, { color = '#a8e9ff', size, lift, n = 90, rate = .3, seed = 1, opacity = .38 } = {}) {
  const v3 = x => x.isVector3 ? x.clone() : new THREE.Vector3(...x);
  const A = v3(from), B = v3(to), d = A.distanceTo(B), R = size ?? d * .05, L = lift ?? d * .35;
  const M = A.clone().add(B).multiplyScalar(.5); M.y += L;
  const curve = new THREE.QuadraticBezierCurve3(A, M, B);
  const side = new THREE.Vector3().subVectors(B, A).cross(new THREE.Vector3(0, 1, 0)).normalize();
  const c = new THREE.Color(color);
  // soft, see-through puffs with no ink line of their own: they merge into one wisp instead of a bead chain
  const mat = toon(c, { emissive: c.clone().multiplyScalar(.45), transparent: true, opacity, depthWrite: false });
  // each puff fades toward its rim (alpha follows how squarely the surface faces the camera), so overlapping puffs
  // melt into one soft wisp instead of a pile of hard-edged discs
  mat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_maps>',
      '#include <normal_fragment_maps>\n  diffuseColor.a *= 1.6 * pow(smoothstep(0., 1., abs(dot(normalize(normal), normalize(vViewPosition)))), 1.6);');
  };
  mat.customProgramCacheKey = () => 'flow-soft';
  const im = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), mat, n);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); im.frustumCulled = false; im.renderOrder = 7; im.count = n; fxLayer(im);
  const g = new THREE.Group(); g.add(im); g.at = B.clone(); g.curve = curve;
  let go = 0, amt = 1; const p = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), m4 = new THREE.Matrix4();
  g.update = (t, g0) => {
    go = clamp(g0);
    for (let i = 0; i < n; i++) {
      const h = hash(i * 7.31 + seed), h2 = hash(i * 1.93 + seed * 5.1), h3 = hash(i * 4.47 + seed * 2.3);
      // one speed for all: puffs keep their even spacing forever (per-puff speeds drift into clumps and gaps within seconds)
      const s = (t * rate + (i + .6 * (h - .5)) / n + 1) % 1;
      let k = s <= go ? 1 : 0;
      k *= ss(s / .08) * (1 - ss((s - .88) / .12));                         // swells out of the source, sinks into the receiver
      k *= h3 < amt ? 1 : 0;
      curve.getPoint(s, p);
      const w = R * 2.2 * Math.sin(Math.PI * s) + R * .3;                  // the wisp fans out mid-air, narrow at both ends
      p.addScaledVector(side, w * ((h - .5) * 1.6 + .35 * Math.sin(t * 1.4 + i * 2.1)));
      p.y += w * ((h2 - .5) * 1.1 + .3 * Math.cos(t * 1.1 + i * 1.7));
      const r = R * (.45 + .9 * h2 * h2) * (1 + .5 * Math.sin(Math.PI * s)) * k + 1e-5;
      im.setMatrixAt(i, m4.compose(p, q, sc.set(r, r, r)));
    }
    im.instanceMatrix.needsUpdate = true;
  };
  g.head = () => curve.getPoint(Math.min(go, .97), new THREE.Vector3());
  g.amount = k => { amt = clamp(k); };
  return g;
}

// ── toy hand (cream skin, mustard sleeve), fingers along +x, palm facing -y ──
export function buildHand() {
  const skin = toon(PAL.cream), sleeve = toon(PAL.mustard), cuff = toon('#d99516');
  const g = new THREE.Group();
  mesh(rbox(.17, .065, .16, .03), skin, [0, 0, 0], { parent: g });
  const sl = mesh(new THREE.CylinderGeometry(.085, .095, .7, 24), sleeve, [-.42, 0, 0], { rot: [0, 0, Math.PI / 2], parent: g });
  mesh(new THREE.TorusGeometry(.088, .022, 10, 28), cuff, [-.1, 0, 0], { rot: [0, Math.PI / 2, 0], parent: g });
  mesh(new THREE.CylinderGeometry(.06, .07, .08, 20), skin, [-.07, 0, 0], { rot: [0, 0, Math.PI / 2], parent: g }); // wrist
  const fingers = [];
  const zs = [-.06, -.02, .02, .06], ls = [.05, .058, .055, .045];
  zs.forEach((z, i) => {
    const a = new THREE.Group(); a.position.set(.085, 0, z); g.add(a);
    const L = ls[i];
    mesh(new THREE.CapsuleGeometry(.021, L, 4, 10), skin, [L / 2 + .01, 0, 0], { rot: [0, 0, Math.PI / 2], parent: a });
    const b = new THREE.Group(); b.position.set(L + .02, 0, 0); a.add(b);
    mesh(new THREE.CapsuleGeometry(.02, L * .8, 4, 10), skin, [L * .4 + .01, 0, 0], { rot: [0, 0, Math.PI / 2], parent: b });
    fingers.push([a, b]);
  });
  const th = new THREE.Group(); th.position.set(.02, -.01, .08); th.rotation.set(0, -.7, 0); g.add(th);
  mesh(new THREE.CapsuleGeometry(.024, .05, 4, 10), skin, [.04, 0, 0], { rot: [0, 0, Math.PI / 2], parent: th });
  g.scale.setScalar(.85);
  g.pose = (curl, spread = 0) => {
    fingers.forEach(([a, b], i) => { a.rotation.set(0, (i - 1.5) * .08 * spread, -curl * 1.1); b.rotation.z = -curl * 1.2; });
    th.rotation.set(curl * .6, -.7 + curl * .5, -curl * .4);
  };
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

export const heatColor = (h, out = new THREE.Color()) => {
  const c0 = new THREE.Color(PAL.cyan), c1 = new THREE.Color(PAL.orange), c2 = new THREE.Color(PAL.red);
  h = clamp(h);
  return h < .55 ? out.copy(c0).lerp(c1, h / .55) : out.copy(c1).lerp(c2, (h - .55) / .45);
};

// Travel along a path whose speed depends on where you are: V(s) for s in 0..1 of arc length.
// Returns { total, sAt(age) }: the time to cross the whole path, and where a traveller is `age` seconds after leaving.
// Crowds through a narrow gate, traffic at a bottleneck, blood through a narrowed vessel.
export function speedTable(length, V, n = 400) {
  const T = new Float32Array(n + 1);
  for (let i = 1; i <= n; i++) T[i] = T[i - 1] + (length / n) / V((i - .5) / n);
  const total = T[n];
  const sAt = age => {
    if (age <= 0) return 0; if (age >= total) return 1;
    let lo = 0, hi = n; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (T[m] < age) lo = m; else hi = m; }
    return (lo + (age - T[lo]) / (T[hi] - T[lo])) / n;
  };
  const tAt = s => T[Math.round(clamp(s) * n)];
  return { total, sAt, tAt };
}
