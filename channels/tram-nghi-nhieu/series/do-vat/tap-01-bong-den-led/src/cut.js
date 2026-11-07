// Sets 2 and 3: a bulb cut open on a table, seen from outside. The incandescent glows from the inside out and
// throws most of its energy at the glass; the LED makes its light right at the semiconductor chip and stays cool.
import * as THREE from 'three';
import { PAL, toon, glowMat, TEX, rbox, mesh, fxLayer, mulberry, clamp, seg, canvasTex } from '../../../../rig/kit.js';
import { squiggle, glowDots, halos, sparks, setDot, setHalo, setStreak, heatColor } from '../../../../rig/fx.js';
import { keyLight, ambience, wallWithHole, beam, pool, shadowFlags } from '../../../../rig/lights.js';
import { vessel, PROFILES } from '../../../../rig/cutaway.js';

const BULB = new THREE.Vector3(.15, 0, 1.75);   // where the bulb stands on the table
const CUT = 1.25;                                // the wedge removed from the shell, toward the camera
const GLASS_C = new THREE.Vector3(0, .9, 0);    // the glass envelope, approximated by a sphere for the photons
const GLASS_R = .45;
// a classic bulb: a narrow neck, a round body, a dome on top
const BULB_PROFILE = [[0, 0], [.13, 0], [.15, .16], [.19, .3], [.33, .52], [.43, .8], [.45, 1.05], [.39, 1.3], [.25, 1.5], [0, 1.58]];

// The room the bulb stands in: a table, a wall with a window, a lamp raking across the cut.
function buildRoom(scene) {
  scene.background = new THREE.Color('#10132a');
  scene.fog = new THREE.Fog('#161b38', 8, 18);

  const lamp = pool(scene, { from: new THREE.Vector3(-1.9, 4.4, 5.2), to: new THREE.Vector3(.15, .9, 1.75), intensity: 1.9, angle: .3, color: '#ffeedd' });
  const moon = keyLight(scene, { from: new THREE.Vector3(-5.2, 3.6, -2.2), to: new THREE.Vector3(-.8, 0, 1.6), intensity: 2.0, size: 3.5, color: '#9fb2ff' });
  ambience(scene, { fill: .3 });

  const wallMat = toon('#a9a0b8', { map: TEX.wall() }); wallMat.map.repeat.set(3, 2);
  const WIN = { x0: -2.9, x1: -1.5, y0: 1.0, y1: 2.5 };
  wallWithHole(scene, wallMat, { ...WIN, left: -5, right: 4, top: 4.2 });
  const frame = toon('#e8dcc4');
  for (const x of [WIN.x0, (WIN.x0 + WIN.x1) / 2, WIN.x1]) scene.add(mesh(rbox(.07, WIN.y1 - WIN.y0, .1, .02), frame, [x, (WIN.y0 + WIN.y1) / 2, .02]));
  for (const y of [WIN.y0, (WIN.y0 + WIN.y1) / 2 + .1, WIN.y1]) scene.add(mesh(rbox(WIN.x1 - WIN.x0 + .07, .07, .1, .02), frame, [(WIN.x0 + WIN.x1) / 2, y, .02]));
  scene.add(mesh(new THREE.PlaneGeometry(9, 6), new THREE.MeshBasicMaterial({ color: '#1d2550', fog: false }), [-1, 2, -3], { cast: false }));
  const moonDisc = mesh(new THREE.CircleGeometry(.3, 48), glowMat('#fff0d8', 1.4), [-3.6, 2.9, -2.9], { cast: false }); fxLayer(moonDisc); scene.add(moonDisc);
  beam(scene, moon, { ...WIN, length: 2.6, alpha: .06 });

  const tableMat = toon('#ffffff', { map: TEX.floor() }); tableMat.map.repeat.set(1.5, 1.5);
  scene.add(mesh(rbox(6, .16, 4.2, .03), tableMat, [0, -.08, 2.1]));
  scene.add(mesh(rbox(6, .7, .1, .02), toon('#5b3d8f'), [0, -.5, 4.2]));
  scene.add(mesh(rbox(.9, .02, .55, .01), toon('#7d4fc0'), [-1.5, .02, 2.9], { rot: [0, .3, 0] }));
  scene.add(mesh(rbox(1.4, .03, .1, .01), toon('#e8dcc4'), [1.7, .02, 1.2], { rot: [0, -.2, 0] }));
  return { lamp, moon };
}

// A toggle switch on the wall: the cause of the light.
function buildSwitch(scene) {
  const g = new THREE.Group(); g.position.set(1.05, 1.2, .03); scene.add(g);
  g.add(mesh(rbox(.22, .3, .04, .02), toon('#e8dcc4')));
  g.add(mesh(rbox(.1, .16, .05, .015), toon('#2b2f5c'), [0, .02, .02]));
  const lever = new THREE.Group(); lever.position.set(0, .04, .05); g.add(lever);
  lever.add(mesh(new THREE.CylinderGeometry(.018, .022, .13, 10), toon('#d4d8e6'), [0, .065, 0], { rot: [.3, 0, 0] }));
  lever.add(mesh(new THREE.SphereGeometry(.026, 10, 8), toon(PAL.red), [0, .13, .03]));
  return lever;
}

export function buildCutaway(kind) {
  const scene = new THREE.Scene();
  const { lamp, moon } = buildRoom(scene);
  const lever = buildSwitch(scene);

  // ── the glass envelope, cut open toward the camera ──
  const glassMat = toon('#bcd8e8', { transparent: true, opacity: .26, side: THREE.DoubleSide, depthWrite: false, emissive: new THREE.Color(0, 0, 0) });
  const V = vessel(BULB_PROFILE, { thick: .035, cut: CUT, shell: glassMat, face: toon('#9fb2c0'), shine: true });
  const bulb = new THREE.Group(); bulb.position.copy(BULB); bulb.position.y = .24; bulb.rotation.y = .12; scene.add(bulb);
  bulb.add(V.group); V.group.userData.tag = 'glass';
  const metal = toon('#b9bdc9');
  bulb.add(mesh(new THREE.CylinderGeometry(.16, .15, .26, 26), metal, [0, -.13, 0]));            // the screw base
  for (let i = 0; i < 5; i++) bulb.add(mesh(new THREE.TorusGeometry(.158, .012, 6, 26), metal, [0, -.22 + i * .045, 0], { rot: [Math.PI / 2, 0, 0] }));
  bulb.add(mesh(new THREE.CylinderGeometry(.13, .16, .05, 26), metal, [0, -.27, 0]));            // the contact rim

  const st = { on: 0, heat: 0 };
  let coil = null, irDots, irHalo, visDots, visHalo, eDots, eHalo, pDots, pHalo, chip = null;
  let IR = [], VIS = [], electrons = [], photons = [], sq = [];
  let ePath = null;

  if (kind === 'inc') {
    // ── the stem, the support wires and the coiled filament ──
    bulb.add(mesh(new THREE.CylinderGeometry(.022, .022, .52, 12), toon('#cfd6e0'), [0, .3, 0]));
    const filPts = [];
    for (let i = 0; i <= 120; i++) { const u = i / 120, a = u * Math.PI * 2 * 8; filPts.push(new THREE.Vector3(Math.cos(a) * .16, .66 + u * .36, Math.sin(a) * .16)); }
    const filCurve = new THREE.CatmullRomCurve3(filPts);
    coil = mesh(new THREE.TubeGeometry(filCurve, 220, .011, 7, false), toon('#8d8f98', { emissive: new THREE.Color(0, 0, 0) }), [0, 0, 0]);
    bulb.add(coil);
    for (const s of [-1, 1]) bulb.add(mesh(new THREE.CylinderGeometry(.007, .007, .22, 8), metal, [s * .08, .6, 0], { rot: [0, 0, s * .55] }));

    // ── photons: many red ones that die on the glass, a few yellow ones that get out ──
    const NIR = 520, NVIS = 70;
    irDots = sparks(NIR, '#e2300c', 1.5); irHalo = halos(NIR, '#ff5a20', .25, TEX.radial());
    visDots = glowDots(NVIS, .01, '#fff3cf', 1.3); visHalo = halos(NVIS, '#ffe9b0', .3, TEX.radial());
    bulb.add(irDots, irHalo, visDots, visHalo);
    const r = mulberry(23);
    for (let i = 0; i < NIR; i++) {
      const a0 = r() * Math.PI * 2, y = .66 + r() * .36;
      const p0 = new THREE.Vector3(Math.cos(a0) * .16, y, Math.sin(a0) * .16);
      const d = new THREE.Vector3(r() - .5, r() - .5, r() - .5).normalize();
      const rel = p0.clone().sub(GLASS_C);
      const b = rel.dot(d), c = rel.lengthSq() - GLASS_R * GLASS_R;
      const disc = b * b - c;
      // the exit point of a ray that starts inside the envelope
      const hit = disc > 0 && c < 0 ? -b + Math.sqrt(disc) : 99;
      IR.push({ p0, d, hit, t0: r() * 2.4, sp: 1.4 + r() * .8 });
    }
    for (let i = 0; i < NVIS; i++) {
      const a0 = r() * Math.PI * 2, y = .66 + r() * .36;
      const p0 = new THREE.Vector3(Math.cos(a0) * .16, y, Math.sin(a0) * .16);
      const ang = (r() - .5) * 1.1;                       // only the ones aimed at the open wedge get out
      const d = new THREE.Vector3(Math.sin(ang), (r() - .3) * .5, Math.cos(ang)).normalize();
      VIS.push({ p0, d, t0: r() * 2.4, sp: 1.8 + r() * .7 });
    }
    const NS = 7; sq = Array.from({ length: NS }, () => { const s = squiggle(); scene.add(s); return s; });
  } else {
    // ── the LED: a heatsink, a board, a stem and one little chip ──
    const heatMat = toon('#8d93a3', { emissive: new THREE.Color(0, 0, 0) });
    bulb.add(mesh(new THREE.CylinderGeometry(.12, .11, .14, 24), heatMat, [0, -.07, 0]));          // heatsink
    for (let i = 0; i < 6; i++) bulb.add(mesh(new THREE.BoxGeometry(.25, .012, .03), heatMat, [0, -.02, -.1 + i * .04]));  // fins
    bulb.add(mesh(rbox(.3, .14, .3, .02), toon('#1d2140'), [0, .26, 0]));                         // the epoxy body
    bulb.add(mesh(new THREE.CylinderGeometry(.13, .05, .1, 20), metal, [0, .41, 0]));             // the reflector cup
    bulb.add(mesh(rbox(.24, .03, .18, .01), toon('#2f7a4a'), [0, .06, 0]));                       // board
    bulb.add(mesh(rbox(.09, .06, .07, .01), toon('#252d50'), [.07, .11, .02]));                   // driver
    bulb.add(mesh(new THREE.CylinderGeometry(.024, .024, .38, 10), toon('#cfd6e0'), [0, .3, 0]));  // stem
    // the die: an n-layer, a p-layer and the phosphor on top
    const nMat = toon('#3f6fb5', { emissive: new THREE.Color(0, 0, 0) });
    const pMat = toon('#9a5be5', { emissive: new THREE.Color(0, 0, 0) });
    const nLayer = mesh(rbox(.14, .03, .14, .006), nMat, [0, .478, 0]); bulb.add(nLayer);
    bulb.add(mesh(rbox(.2, .016, .2, .006), metal, [0, .454, 0]));   // the die's metal base
    const pLayer = mesh(rbox(.14, .03, .14, .006), pMat, [0, .508, 0]); bulb.add(pLayer);
    const junction = mesh(rbox(.05, .006, .05, .002), glowMat('#eaf7ff', 1.4), [0, .526, 0]); junction.castShadow = false; bulb.add(junction);
    const phos = mesh(new THREE.SphereGeometry(.06, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2), toon('#fff0c8', { transparent: true, opacity: .4, side: THREE.DoubleSide, depthWrite: false }), [0, .524, 0]);
    phos.scale.set(1, .55, 1);
    bulb.add(phos);
    for (const s of [-1, 1]) bulb.add(mesh(new THREE.CylinderGeometry(.004, .004, .14, 8), toon('#d98a4a'), [s * .075, .39, 0], { rot: [0, 0, s * .45] }));
    // electrons crossing the junction, photons born where they land
    const NE = 260, NP = 260;
    eDots = glowDots(NE, .008, PAL.cyan, 1.25); eHalo = halos(NE, PAL.cyan, .25, TEX.radial());
    pDots = glowDots(NP, .008, '#eaf7ff', 1.2); pHalo = halos(NP, '#bfe9ff', .3, TEX.radial());
    bulb.add(eDots, eHalo, pDots, pHalo);
    const r = mulberry(31);
    ePath = new THREE.CatmullRomCurve3([new THREE.Vector3(-.42, .62, .02), new THREE.Vector3(-.22, .62, .02), new THREE.Vector3(-.08, .615, .02), new THREE.Vector3(0, .60, .02)]);
    for (let i = 0; i < 90; i++) electrons.push({ t0: r() * 1.6, sp: .9 + r() * .5, j: (r() - .5) * .9, k: (r() - .5) * .5 });
    for (let i = 0; i < 150; i++) photons.push({ t0: r() * 1.6, sp: 1.6 + r() * .9, a: (r() - .5) * 2.2, b: .4 + r() * .6 });
    chip = { nMat, pMat, phos };
  }

  // ── the prism and the colour card (the incandescent scene only) ──
  let beam1 = null, beam2 = null;
  if (kind === 'inc') {
    const prism = new THREE.Group(); prism.position.set(1.3, .04, 2.35); prism.rotation.y = -.5; scene.add(prism);
    prism.add(mesh(new THREE.CylinderGeometry(.2, .2, .26, 3), toon('#bcd8e8', { transparent: true, opacity: .55, side: THREE.DoubleSide, depthWrite: false }), [0, .15, 0], { rot: [0, 0, Math.PI / 2] }));
    prism.add(mesh(new THREE.CylinderGeometry(.22, .22, .04, 3), toon('#8fa3b8'), [0, .02, 0], { rot: [0, 0, Math.PI / 2] }));
    // the card that catches the light: a narrow visible band, then a long dull infrared one
    const strip = canvasTex(1024, 160, (g, w, h) => {
      const gr = g.createLinearGradient(0, 0, w * .3, 0);
      gr.addColorStop(0, '#7b4fd6'); gr.addColorStop(.35, '#3aa8e8'); gr.addColorStop(.7, '#4fd68a'); gr.addColorStop(1, '#f7bd27');
      g.fillStyle = gr; g.fillRect(0, 0, w * .3, h);
      const gr2 = g.createLinearGradient(w * .3, 0, w, 0);
      gr2.addColorStop(0, '#b33b1e'); gr2.addColorStop(.35, '#7a2412'); gr2.addColorStop(1, '#2a0d06');
      g.fillStyle = gr2; g.fillRect(w * .3, 0, w * .7, h);
      g.strokeStyle = '#171a2b'; g.lineWidth = 6; g.strokeRect(0, 0, w, h);
      g.strokeStyle = '#f7bd27'; g.lineWidth = 5; g.beginPath(); g.moveTo(w * .3, 0); g.lineTo(w * .3, h); g.stroke();
    });
    const card = new THREE.Group(); card.position.set(2.05, .02, 2.8); card.rotation.set(0, -.25, 0); scene.add(card);
    card.add(mesh(rbox(1.7, .05, .72, .02), toon('#e8dcc4')));
    card.add(mesh(new THREE.PlaneGeometry(1.6, .38), toon('#ffffff', { map: strip }), [0, .052, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }));
    // the light itself: from the bulb to the prism, and from the prism to the card
    const mkBeam = (a, b, r0, r1, col, al) => {
      const dir = new THREE.Vector3().subVectors(b, a), len = dir.length();
      const g = new THREE.CylinderGeometry(r0, r1, len, 18, 1, true);
      g.translate(0, len / 2, 0);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: new THREE.Color(col), transparent: true, opacity: al, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false }));
      m.position.copy(a); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      fxLayer(m); scene.add(m); return m;
    };
    beam1 = mkBeam(new THREE.Vector3(BULB.x, 1.28, BULB.z), new THREE.Vector3(1.3, .18, 2.35), .04, .03, '#ffca7a', .06);
    beam2 = mkBeam(new THREE.Vector3(1.38, .14, 2.42), new THREE.Vector3(2.0, .1, 2.75), .05, .09, '#ffb36b', .07);
  }

  // the filament is a light source of its own: it lights the glass from inside
  const filL = new THREE.PointLight('#ffb36b', 0, 2.2, 2); filL.position.set(BULB.x, 1.22, BULB.z); scene.add(filL);
  const chipL = new THREE.PointLight('#bfe9ff', 0, 1.1, 2); chipL.position.set(BULB.x, .82, BULB.z); scene.add(chipL);
  const _v = new THREE.Vector3(), _c = new THREE.Color(), _vel = new THREE.Vector3();

  function frame(t, cam, state = {}) {
    const on = state.on ?? st.on, heatK = clamp(state.heat ?? st.heat);
    st.on = on; st.heat = heatK;

    if (kind === 'inc') {
      // the filament: dark, then red, then orange-white
      filL.intensity = on * (.45 + .6 * heatK);
      if (coil) {
        const k = .5 + .5 * Math.sin(t * 11.3) * Math.sin(t * 4.7);
        _c.set('#c0341a').lerp(new THREE.Color('#fff0c8'), .15 + .75 * heatK * (.85 + .15 * k));
        coil.material.emissive.copy(_c).multiplyScalar(on * (.42 + .62 * heatK * (.85 + .15 * k)));
      }
      glassMat.emissive.set('#e03a12').multiplyScalar(on * heatK * .12);

      let ni = 0, nv = 0;
      for (const p of IR) {
        if (!on) break;
        const age = (t - p.t0) % 3.4;
        const dist = Math.min(p.sp * age, p.hit === 99 ? 1.05 : p.hit);
        _v.copy(p.p0).addScaledVector(p.d, dist);
        const fade = dist >= p.hit ? Math.max(0, 1 - (age - p.hit / p.sp) * 2.4) : 1;
        if (fade <= 0) continue;
        const sp = p.sp * .16;
        setStreak(irDots, ni, _v, _vel.copy(p.d).multiplyScalar(sp), .03 + .03 * fade, .0085);
        setHalo(irHalo, ni, _v, .05 * fade, cam.quaternion); ni++;
        if (ni >= 520) break;
      }
      for (const p of VIS) {
        if (!on) break;
        const age = (t - p.t0) % 2.6;
        _v.copy(p.p0).addScaledVector(p.d, p.sp * age);
        const fade = 1 - age / 2.6;
        setDot(visDots, nv, _v, fade); setHalo(visHalo, nv, _v, .035 * fade, cam.quaternion); nv++;
        if (nv >= 70) break;
      }
      irDots.count = ni; irHalo.count = ni; visDots.count = nv; visHalo.count = nv;
      irDots.instanceMatrix.needsUpdate = irHalo.instanceMatrix.needsUpdate = visDots.instanceMatrix.needsUpdate = visHalo.instanceMatrix.needsUpdate = true;

      // heat rising off the bulb
      sq.forEach((s, i) => {
        const U = s.U, period = 1.5, ph = i / sq.length;
        const age = ((t - 20) / period + ph) % 1, cyc = Math.floor((t - 20) / period + ph);
        const r = mulberry(i * 13 + cyc * 101);
        s.position.set(BULB.x + (r() - .5) * .5, 2.02 + r() * .12, BULB.z + (r() - .5) * .4);
        s.quaternion.copy(cam.quaternion);
        U.uHead.value = age * 1.1; U.uLen.value = .55; U.uCeil.value = 99;
        U.uAmp.value = .03 + .03 * r(); U.uFreq.value = 14 + 6 * r(); U.uPhase.value = r() * 6 + t * 4;
        U.uWidth.value = .03;
        heatColor(.55 + .45 * heatK, _c); U.uColor.value.copy(_c).multiplyScalar(2);
        U.uAlpha.value = Math.sin(age * Math.PI) * clamp(heatK * 1.4) * on;
      });
      if (beam1) { beam1.material.opacity = .06 * on * (.4 + .6 * heatK); beam2.material.opacity = .07 * on; }
    } else {
      // the LED: the light appears at once, the chip stays cool
      const k = .5 + .5 * Math.sin(t * 13.7) * Math.sin(t * 5.1);
      chipL.intensity = on * (.32 + .12 * k);
      chip.nMat.emissive.set(PAL.cyan).multiplyScalar(on * (.22 + .2 * k));
      chip.pMat.emissive.set('#b98cff').multiplyScalar(on * (.18 + .14 * k));
      chip.phos.material.opacity = .22 + .1 * k * on;
      let ne = 0, np = 0;
      for (const e of electrons) {
        if (!on) break;
        const age = (t - e.t0) % 2.2;
        const u = clamp(age * e.sp * .9);
        ePath.getPoint(u, _v); _v.z += e.j * .09 * (1 - u); _v.y += e.k * .035;
        const fade = 1 - u * .25;
        setDot(eDots, ne, _v, fade); setHalo(eHalo, ne, _v, .04 * fade, cam.quaternion); ne++;
        if (ne >= 90) break;
      }
      for (const p of photons) {
        if (!on) break;
        const age = (t - p.t0) % 1.9;
        const d = new THREE.Vector3(Math.sin(p.a) * .5, p.b, Math.cos(p.a) * .5).normalize();
        _v.set(0, .55, 0).addScaledVector(d, p.sp * age);
        const fade = 1 - age / 1.9;
        setDot(pDots, np, _v, fade); setHalo(pHalo, np, _v, .055 * fade, cam.quaternion); np++;
        if (np >= 150) break;
      }
      eDots.count = ne; eHalo.count = ne; pDots.count = np; pHalo.count = np;
      eDots.instanceMatrix.needsUpdate = eHalo.instanceMatrix.needsUpdate = pDots.instanceMatrix.needsUpdate = pHalo.instanceMatrix.needsUpdate = true;
    }
  }

  shadowFlags(scene);
  return { scene, frame, lever, st, lamp, moon, BULB, V, kind };
}
