// The cutaway: the phone opened up at macro scale, battery layers, the narrow gate where electrons jam and spark.
import * as THREE from 'three';
import { PAL, toon, glowMat, TEX, rbox, mesh, fxLayer, mulberry, clamp, lerp, seg, ss } from '../rig/kit.js';
import { squiggle, glowDots, halos, sparks, setDot, setHalo, setStreak, heatColor } from '../rig/fx.js';

export const GATE = new THREE.Vector3(0, .5, .1);

export function buildMacro() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0e1020');
  scene.fog = new THREE.Fog('#151a36', 6, 16);

  scene.add(new THREE.HemisphereLight('#6070b8', '#3a2238', .85));
  const key = new THREE.DirectionalLight('#b8c8ff', 2.4); key.position.set(-4, 7, 3); key.target.position.set(0, 0, 0);
  key.castShadow = true; key.shadow.mapSize.set(4096, 4096); Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 20 });
  key.shadow.bias = -.0004; key.shadow.normalBias = .02; scene.add(key, key.target);
  const rim = new THREE.DirectionalLight('#a57bff', 1.1); rim.position.set(4, 3, -5); scene.add(rim);
  const screenL = new THREE.PointLight('#ffb36b', 1.5, 7, 2); screenL.position.set(0, 2.2, -2.6); scene.add(screenL);
  const heatL = new THREE.PointLight(PAL.orange, 0, 3.5, 2); heatL.position.copy(GATE).add(new THREE.Vector3(0, .5, 0)); scene.add(heatL);

  // fabric the phone lies on (the bed sheet, huge)
  const sheet = toon('#6d6a8a', { map: TEX.sheet() }); sheet.map.repeat.set(4, 4);
  const ground = surface(20, 14);
  function surface(w, d) {
    const g = new THREE.PlaneGeometry(w, d, 120, 80); g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); p.setY(i, .06 * Math.sin(x * 1.3 + z * .4) + .05 * Math.sin(z * 1.9 - x * .7) - .02); }
    g.computeVertexNormals(); return g;
  }
  scene.add(mesh(ground, sheet, [0, -.12, 0], { cast: false }));

  // ── the phone shell (open top) ──
  const navy = toon(PAL.navy), ink = toon(PAL.ink), cream = toon(PAL.cream), brass = toon('#d4a24a');
  const W = 2.1, D = 4.2, Hh = .5;
  scene.add(mesh(rbox(W, .1, D, .05), navy, [0, -.05, 0]));
  scene.add(mesh(rbox(.12, Hh, D, .05), navy, [-W / 2 + .06, Hh / 2 - .08, 0]));
  scene.add(mesh(rbox(.12, Hh, D, .05), navy, [W / 2 - .06, Hh / 2 - .08, 0]));
  scene.add(mesh(rbox(W, Hh, .12, .05), navy, [0, Hh / 2 - .08, -D / 2 + .06]));
  // front wall with the charging port
  scene.add(mesh(rbox(.75, Hh, .12, .04), navy, [-.65, Hh / 2 - .08, D / 2 - .06]));
  scene.add(mesh(rbox(.75, Hh, .12, .04), navy, [.65, Hh / 2 - .08, D / 2 - .06]));
  scene.add(mesh(rbox(.56, .14, .12, .03), navy, [0, .02, D / 2 - .06]));
  scene.add(mesh(rbox(.56, .14, .12, .03), navy, [0, .36, D / 2 - .06]));
  scene.add(mesh(rbox(.4, .1, .3, .03), brass, [0, .19, D / 2 - .12])); // port tongue
  // screen panel lifted on its hinge at the back, glowing toward us (backdrop)
  const scr = new THREE.Group(); scr.position.set(0, .42, -D / 2); scr.rotation.x = -1.25; scene.add(scr);
  scr.add(mesh(rbox(W - .02, .08, D - .02, .05), navy, [0, 0, D / 2]));
  const st = TEX.screen(); st.center.set(.5, .5);
  scr.add(mesh(new THREE.PlaneGeometry(W - .2, D - .25), new THREE.MeshBasicMaterial({ map: st, color: new THREE.Color(.55, .55, .55), toneMapped: false }), [0, .045, D / 2], { rot: [-Math.PI / 2, 0, Math.PI], cast: false }));

  // logic board, chips, camera at the back
  const board = toon('#3b3f7a');
  scene.add(mesh(rbox(1.8, .06, .9, .02), board, [0, .05, -1.45]));
  const r = mulberry(17);
  for (let k = 0; k < 9; k++) scene.add(mesh(rbox(.12 + r() * .25, .05 + r() * .05, .1 + r() * .2, .015), k % 3 ? ink : toon('#5a5f9a'), [-.75 + r() * 1.5, .1, -1.8 + r() * .7]));
  for (const x of [-.55, -.25]) { scene.add(mesh(new THREE.CylinderGeometry(.13, .14, .1, 28), ink, [x, .12, -1.7])); scene.add(mesh(new THREE.CylinderGeometry(.08, .08, .02, 24), toon('#2f8fa0'), [x, .18, -1.7])); }
  // copper trace from the port to the battery terminal
  const trace = toon('#d98a4a');
  scene.add(mesh(rbox(.16, .03, .7, .01), trace, [0, .02, 1.65]));
  // ── battery: a stack of layers ──
  const bat = new THREE.Group(); bat.position.set(0, 0, .15); scene.add(bat);
  const BW = 1.7, BD = 2.5;
  const layerCols = ['#d98a4a', '#efe2c8', '#9ea9c2', '#efe2c8', '#d98a4a', '#efe2c8', '#9ea9c2', '#efe2c8'];
  const layerMats = layerCols.map(c => toon(c, { emissive: new THREE.Color(0, 0, 0) }));
  layerCols.forEach((c, i) => bat.add(mesh(rbox(BW - (i % 2) * .04, .042, BD - (i % 2) * .04, .012, 2), layerMats[i], [0, .04 + i * .042, 0])));
  const topY = .04 + 8 * .042;
  const pouch = toon(PAL.cyan, { emissive: new THREE.Color(0, 0, 0) });
  // pouch cover: cut back to show the layers in front
  bat.add(mesh(rbox(BW + .04, .05, BD * .55, .02), pouch, [0, topY, -BD * .225]));
  bat.add(mesh(rbox(.06, topY + .03, BD + .04, .02), pouch, [-BW / 2 - .02, topY / 2, 0]));
  bat.add(mesh(rbox(.06, topY + .03, BD + .04, .02), pouch, [BW / 2 + .02, topY / 2, 0]));
  const term = mesh(rbox(.36, .08, .14, .02), brass, [0, topY - .02, BD / 2 + .02]); bat.add(term);
  // the gate: a funnel narrowing to a slot (resistance)
  const gateMat = toon('#2b2f5c', { emissive: new THREE.Color(0, 0, 0) });
  const gy = topY + .07;
  const wallL = mesh(rbox(.08, .13, .95, .03), gateMat, [-.3, gy + .02, .58], { rot: [0, -.55, 0] }); bat.add(wallL);
  const wallR = mesh(rbox(.08, .13, .95, .03), gateMat, [.3, gy + .02, .58], { rot: [0, .55, 0] }); bat.add(wallR);
  bat.add(mesh(rbox(.32, .34, .16, .04), gateMat, [-.245, gy + .1, -.02]));
  bat.add(mesh(rbox(.32, .34, .16, .04), gateMat, [.245, gy + .1, -.02]));
  bat.add(mesh(rbox(.82, .08, .2, .03), gateMat, [0, gy + .29, -.02]));
  for (const x of [-.09, .09]) bat.add(mesh(new THREE.CylinderGeometry(.03, .03, .3, 12), brass, [x, gy + .08, -.02]));
  GATE.set(0, gy + .02, .15 - .02);

  // electron path (world): port → trace → terminal → funnel → slot → spread into the stack
  const P = [[0, .14, 2.3], [0, .12, 1.9], [0, .16, 1.45], [0, gy, 1.25], [0, gy, .95], [0, gy, .3], [0, gy, .13], [0, gy, -.05], [0, gy - .02, -.4], [0, gy - .12, -.9]].map(p => new THREE.Vector3(...p));
  const path = new THREE.CatmullRomCurve3(P, false, 'catmullrom', .3);
  // width and speed along the path (by arc length fraction)
  const SN = 400, Ttab = new Float32Array(SN + 1), Wd = s => {
    if (s < .3) return .05;
    if (s < .5) return lerp(.05, .55, ss((s - .3) / .2));
    if (s < .68) return lerp(.55, .05, ss((s - .5) / .18));
    if (s < .74) return .05;
    return lerp(.05, .55, ss((s - .74) / .2));
  };
  const V = s => s < .4 ? 1.1 : s < .58 ? lerp(1.1, .3, (s - .4) / .18) : s < .69 ? lerp(.3, .07, (s - .58) / .11) : s < .73 ? .1 : 1.0;
  const L = path.getLength();
  for (let i = 1; i <= SN; i++) { const s = (i - .5) / SN; Ttab[i] = Ttab[i - 1] + (L / SN) / V(s) / 1.0; }
  const TTOT = Ttab[SN];
  const sAt = tt => { // inverse of Ttab
    if (tt <= 0) return 0; if (tt >= TTOT) return 1;
    let lo = 0, hi = SN; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (Ttab[m] < tt) lo = m; else hi = m; }
    return (lo + (tt - Ttab[lo]) / (Ttab[hi] - Ttab[lo])) / SN;
  };
  const S_GATE = .71, T_GATE = Ttab[Math.round(S_GATE * SN)];
  const DT = .011, T0 = 8.0;
  const NE = 900, eDots = glowDots(NE, .027, PAL.cyan, 1.15), eHalo = halos(NE, PAL.cyan, .25, TEX.radial());
  scene.add(eDots, eHalo);
  const NSP = 500, spk = sparks(NSP, PAL.orange, 6), spkHalo = halos(160, PAL.orange, 1.2, TEX.radial());
  scene.add(spk, spkHalo);
  const NS = 10, sq = Array.from({ length: NS }, () => { const s = squiggle(); scene.add(s); return s; });
  const heatGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: TEX.radial(), color: new THREE.Color(PAL.orange), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  heatGlow.rotation.x = -Math.PI / 2; heatGlow.position.set(0, topY + .03, .15); fxLayer(heatGlow); scene.add(heatGlow);

  const H = t => .1 + .9 * ss(seg(t, 8.6, 12.6));
  const _v = new THREE.Vector3(), _t = new THREE.Vector3(), _n = new THREE.Vector3(), _vel = new THREE.Vector3(), _c = new THREE.Color();
  const side = new THREE.Vector3(1, 0, 0);

  function update(t, cam) {
    const h = H(t);
    heatColor(h, _c);
    pouch.color.copy(_c); pouch.emissive.copy(_c).multiplyScalar(.08 + .3 * h * h);
    layerMats.forEach((m, i) => m.emissive.set(PAL.orange).lerp(new THREE.Color(PAL.red), h).multiplyScalar(.25 * h * h * (i % 2 ? .6 : 1)));
    heatL.intensity = .35 * h * h; gateMat.emissive.set(PAL.red).multiplyScalar(.35 * h * h); heatL.color.copy(_c);
    heatGlow.material.color.copy(_c).multiplyScalar(.35 * h); heatGlow.scale.set(1.6 + .6 * h, 2.2, 1);
    screenL.intensity = 1.5;

    // electrons
    const tb = t - T0;
    const kHi = Math.floor((tb + 2.0) / DT), kLo = Math.floor((tb + 2.0 - TTOT) / DT);
    let n = 0, ns = 0, nh = 0;
    for (let k = Math.max(kLo, -9999); k <= kHi && n < NE; k++) {
      const age = tb + 2.0 - k * DT; // seconds since this one left the port (prefilled 2 s)
      if (age < 0 || age > TTOT) continue;
      const s = sAt(age);
      path.getPointAt(s, _v);
      const r1 = Math.sin(k * 12.9898) * 43758.5453 % 1, r2 = Math.sin(k * 78.233) * 12543.1 % 1;
      const w = Wd(s);
      const jam = s > .55 && s < .72 ? 1 : 0;
      _v.x += r1 * w + jam * .012 * Math.sin(t * 31 + k);
      _v.y += Math.abs(r2) * .05 + jam * .01 * Math.sin(t * 27 + k * 3);
      const fade = s > .9 ? 1 - (s - .9) / .1 : 1;
      setDot(eDots, n, _v, fade); setHalo(eHalo, n, _v, .1 * fade, cam.quaternion); n++;
      // sparks: each electron squeezing through the slot throws a burst
      const since = age - T_GATE;
      if (since > 0 && since < .5) {
        const rr = mulberry(k * 977 + 3);
        if (rr() < .15 + .35 * h) {
          const nb = 3 + Math.floor(rr() * 3);
          for (let j = 0; j < nb && ns < NSP; j++) {
            const vx = (rr() - .5) * 2.4, vy = .6 + rr() * 1.4, vz = (rr() - .5) * 1.6;
            const life = .25 + rr() * .25; if (since > life) continue;
            const g = since;
            _t.set(GATE.x + (rr() < .5 ? -.07 : .07) + vx * g, GATE.y + .03 + vy * g - 2.2 * g * g, GATE.z + vz * g);
            _vel.set(vx, vy - 4.4 * g, vz);
            const fadeS = 1 - g / life;
            setStreak(spk, ns, _t, _vel, .07 * fadeS + .02, .012); ns++;
            if (j === 0 && nh < 160) { setHalo(spkHalo, nh, _t, .14 * fadeS, cam.quaternion); nh++; }
          }
        }
      }
    }
    eDots.count = eHalo.count = n; spk.count = ns; spkHalo.count = nh;
    eDots.instanceMatrix.needsUpdate = eHalo.instanceMatrix.needsUpdate = spk.instanceMatrix.needsUpdate = spkHalo.instanceMatrix.needsUpdate = true;

    // heat squiggles off the battery
    sq.forEach((s, i) => {
      const U = s.U, period = 1.6, ph = i / NS;
      const age = ((t - 8) / period + ph) % 1, cyc = Math.floor((t - 8) / period + ph);
      const r = mulberry(i * 13 + cyc * 101);
      s.position.set((r() - .5) * 1.5, topY + .05, .15 + (r() - .5) * 1.8);
      s.quaternion.copy(cam.quaternion);
      U.uHead.value = age * 1.6; U.uLen.value = .5; U.uCeil.value = 99;
      U.uAmp.value = .03 + .03 * h; U.uFreq.value = 14 + 6 * r(); U.uPhase.value = r() * 6 + t * 4;
      U.uWidth.value = .03;
      heatColor(.45 + .55 * h, _c); U.uColor.value.copy(_c).multiplyScalar(2);
      U.uAlpha.value = Math.sin(age * Math.PI) * clamp((h - .25) * 1.6);
    });
  }
  return { scene, update, GATE, key };
}
