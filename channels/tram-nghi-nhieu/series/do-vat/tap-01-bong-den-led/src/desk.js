// Set 1: a desk at night. Two bulbs hang side by side over it — one incandescent, one LED — and a toy hand
// reaches in to touch them. The hand is the question: same bulb, one hot, one cool.
import * as THREE from 'three';
import { PAL, toon, glowMat, TEX, rbox, mesh, fxLayer, mulberry, clamp, lerp, seg, ss, eo, back } from '../../../../rig/kit.js';
import { squiggle, glowDots, halos, setDot, setHalo, buildHand } from '../../../../rig/fx.js';
import { keyLight, ambience, wallWithHole, beam, shadowFlags } from '../../../../rig/lights.js';

export const INC = new THREE.Vector3(-.62, 1.22, 1.28);   // the incandescent bulb (glass centre)
export const LEDP = new THREE.Vector3(.62, 1.22, 1.28);   // the LED bulb

const WIN = { x0: -2.75, x1: -1.5, y0: 1.2, y1: 2.2 };

export function buildDesk() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#10121c');
  scene.fog = new THREE.Fog('#151a33', 6, 14);

  // ── lights: the moon through the window shapes the room; the two bulbs are the warm and the cool source ──
  const moon = keyLight(scene, { from: new THREE.Vector3(-8.5, 4.4, -3.9), to: new THREE.Vector3(0, .805, 1.3), color: '#9fb2ff', intensity: 2.6, size: 3.6 });
  ambience(scene, { fill: .3 });
  const incL = new THREE.PointLight('#ffb36b', .7, 2.6, 2); incL.position.set(INC.x, INC.y - .18, INC.z); scene.add(incL);
  const ledL = new THREE.PointLight('#bcd8ff', 1.15, 3.4, 2); ledL.position.set(LEDP.x, LEDP.y - .1, LEDP.z); scene.add(ledL);
  const deskL = new THREE.PointLight('#ffd9a0', .35, 2.2, 2); deskL.position.set(.2, 1.0, 1.9); scene.add(deskL);

  // ── materials ──
  const M = {
    wall: toon('#cbb79c', { map: TEX.wall() }),
    floor: toon('#ffffff', { map: TEX.floor() }),
    wood: toon('#ffffff', { map: TEX.wood() }),
    woodDark: toon('#6b3d22'),
    cream: toon(PAL.cream), navy: toon(PAL.navy), ink: toon(PAL.ink),
    brass: toon('#c9973a'), metal: toon('#b9bdc9'),
    glass: toon('#dff0f6', { transparent: true, opacity: .3, side: THREE.DoubleSide, depthWrite: false }),
    book1: toon('#f04462'), book2: toon('#2f8fa0'), book3: toon('#f7bd27'),
    leaf: toon('#3d8a5a', { side: THREE.DoubleSide }),
    pot: toon('#c75a3a', { map: TEX.floor() }),
    shade: toon('#f2d9a6'),
    frame: toon('#efe2c8'),
  };
  M.wall.map.repeat.set(3, 2); M.floor.map.repeat.set(2, 2); M.wood.map.repeat.set(2, 1);

  // ── room shell ──
  const floor = mesh(new THREE.PlaneGeometry(10, 8), M.floor, [-.4, 0, 3.2], { rot: [-Math.PI / 2, 0, 0], cast: false }); scene.add(floor);
  wallWithHole(scene, M.wall, { ...WIN, left: -5, right: 4.4, top: 3.6 });
  // the window: frame, mullions and a sill, so the moon prints its shape on the desk
  {
    const W = M.frame, w = WIN.x1 - WIN.x0, h = WIN.y1 - WIN.y0, cx = (WIN.x0 + WIN.x1) / 2, cy = (WIN.y0 + WIN.y1) / 2;
    const fr = (bw, bh, x, y, d = .18) => scene.add(mesh(rbox(bw, bh, d, .02), W, [x, y, -.05]));
    fr(w + .12, .09, cx, WIN.y1 + .02); fr(w + .12, .09, cx, WIN.y0 - .02);
    fr(.09, h, WIN.x0 - .02, cy); fr(.09, h, WIN.x1 + .02, cy);
    fr(.05, h, cx, cy, .1); fr(w, .05, cx, cy + .12, .1);
    scene.add(mesh(rbox(w + .34, .06, .26, .02), W, [cx, WIN.y0 - .09, .05]));   // the sill
  }
  scene.add(mesh(rbox(7.4, .12, .05, .02), M.woodDark, [-.3, .06, .03]));   // baseboard
  // a framed picture on the wall, so the room has a past
  {
    const c = document.createElement('canvas'); c.width = 256; c.height = 192;
    const g = c.getContext('2d');
    g.fillStyle = '#f7bd27'; g.fillRect(0, 0, 256, 192);
    g.fillStyle = '#f04462'; g.beginPath(); g.arc(170, 74, 32, 0, 7); g.fill();
    g.fillStyle = '#252d50'; g.beginPath(); g.moveTo(0, 192); g.lineTo(70, 88); g.lineTo(132, 150); g.lineTo(190, 108); g.lineTo(256, 192); g.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    scene.add(mesh(rbox(.66, .5, .04, .012), M.woodDark, [1.35, 1.75, .02]));
    scene.add(mesh(new THREE.PlaneGeometry(.54, .4), toon('#ffffff', { map: t }), [1.35, 1.75, .043], { cast: false }));
  }
  // outside the window: sky card, a building, a branch that prints leafy shadows
  scene.add(mesh(new THREE.PlaneGeometry(12, 7), new THREE.MeshBasicMaterial({ color: '#1d2550', fog: false }), [-1.5, 2.2, -3.2], { cast: false }));
  {
    const r = mulberry(9);
    for (let i = 0; i < 7; i++) {
      const w = .35 + r() * .5, h = .5 + r() * 1.4, x = -3.6 + i * .78;
      scene.add(mesh(new THREE.BoxGeometry(w, h, .12), new THREE.MeshBasicMaterial({ color: '#0d1024' }), [x + w / 2, .8 + h / 2, -3.05], { cast: false, recv: false }));
      for (let k = 0; k < 3; k++) if (r() > .45) scene.add(mesh(new THREE.PlaneGeometry(.06, .08), glowMat('#ffc46b', 1.1), [x + .1 + r() * (w - .2), .95 + r() * h * .85, -2.98], { cast: false, recv: false }));
    }
  }
  const branch = new THREE.Group(); branch.position.set(-3.6, 2.45, -.95); scene.add(branch); branch.userData.tag = 'branch';
  {
    const r = mulberry(7), bm = new THREE.MeshBasicMaterial({ color: '#0b0d18' });
    const twig = (p, len, ang, depth) => {
      const g = new THREE.Group(); g.position.copy(p); g.rotation.z = ang; branch.add(g);
      mesh(new THREE.CylinderGeometry(.012 * depth, .02 * depth, len, 6), bm, [0, -len / 2, 0], { parent: g, recv: false });
      for (let k = 0; k < 5; k++) mesh(new THREE.SphereGeometry(.07 + r() * .05, 6, 4), bm, [(r() - .5) * .3, -len * (.3 + r() * .7), (r() - .5) * .2], { parent: g, recv: false }).scale.set(1.4, .55, 1);
      return g;
    };
    const P = new THREE.Vector3();
    twig(P.set(0, 0, 0), 1.5, -.85, 2); twig(P.set(-.45, -.35, 0), .95, -.3, 1.4); twig(P.set(-.85, -.65, 0), .85, -1.35, 1.2);
  }
  beam(scene, moon, { ...WIN, length: 2.8, alpha: .07 });

  // ── the desk ──
  const desk = new THREE.Group(); desk.position.set(0, 0, 1.28); scene.add(desk);
  desk.add(mesh(rbox(2.6, .09, 1.45, .02), M.wood, [0, .76, 0]));
  desk.add(mesh(rbox(2.5, .18, .06, .02), M.woodDark, [0, .63, -.71]));       // back rail
  desk.add(mesh(rbox(.5, .22, 1.3, .02), M.woodDark, [.95, .62, 0]));          // drawer block
  desk.add(mesh(rbox(.46, .04, .04, .015), M.brass, [.95, .66, .66]));
  for (const [x, z] of [[-1.16, -.6], [1.16, -.6], [-1.16, .6], [1.16, .6]]) desk.add(mesh(new THREE.CylinderGeometry(.055, .045, .72, 12), M.woodDark, [x, .36, z]));
  // a runner of cloth and a shelf below, so the desk is a place, not a board
  { const cloth = toon('#e7dcc6', { map: TEX.sheet() }); desk.add(mesh(rbox(1.7, .015, .3, .01), cloth, [-.15, .812, -.5], { rot: [0, .06, 0] })); }
  desk.add(mesh(rbox(2.4, .05, 1.2, .02), M.woodDark, [0, .2, 0]));

  // ── things on the desk ──
  const books = new THREE.Group(); books.position.set(-.92, .81, .3); books.rotation.y = .25; desk.add(books);
  const paperTex = TEX.sheet();
  books.add(mesh(rbox(.42, .07, .3, .01), toon('#ffffff', { map: paperTex, color: '#f04462' }), [0, .035, 0]));
  books.add(mesh(rbox(.38, .06, .27, .01), toon('#ffffff', { map: paperTex, color: '#2f8fa0' }), [.02, .1, .01], { rot: [0, .12, 0] }));
  books.add(mesh(rbox(.34, .05, .25, .01), toon('#ffffff', { map: paperTex, color: '#f7bd27' }), [-.01, .155, -.01], { rot: [0, -.1, 0] }));
  const mug = new THREE.Group(); mug.position.set(.86, .81, .42); desk.add(mug);
  mug.add(mesh(new THREE.CylinderGeometry(.075, .065, .13, 22), toon(PAL.cream), [0, .065, 0]));
  mug.add(mesh(new THREE.TorusGeometry(.04, .013, 8, 18), toon(PAL.cream), [.09, .07, 0], { rot: [0, Math.PI / 2, 0] }));
  mug.add(mesh(new THREE.CylinderGeometry(.06, .06, .02, 20), toon('#6b4a2a'), [0, .128, 0]));
  const cup = new THREE.Group(); cup.position.set(-.28, .81, -.52); desk.add(cup);
  cup.add(mesh(new THREE.CylinderGeometry(.055, .05, .11, 18), toon('#2f8fa0'), [0, .055, 0]));
  for (let i = 0; i < 3; i++) cup.add(mesh(new THREE.CylinderGeometry(.008, .008, .28, 8), i ? M.book3 : M.book1, [(i - 1) * .025, .2, 0], { rot: [0, 0, (i - 1) * .12] }));
  const plant = new THREE.Group(); plant.position.set(-1.05, .81, -.42); desk.add(plant);
  plant.add(mesh(new THREE.CylinderGeometry(.11, .085, .2, 20), M.pot, [0, .1, 0]));
  plant.add(mesh(new THREE.TorusGeometry(.115, .018, 8, 22), toon('#a8482d'), [0, .2, 0], { rot: [Math.PI / 2, 0, 0] }));
  const leaves = [];
  { const r = mulberry(41);
    for (let k = 0; k < 7; k++) { const g = new THREE.Group(); g.position.set(0, .19, 0); g.rotation.set(0, k * 2.4 + r(), 0); plant.add(g);
      const lf = mesh(new THREE.SphereGeometry(.1, 10, 8), M.leaf, [.07, .16 + r() * .12, 0], { parent: g }); lf.scale.set(.32, 1.3, .07); lf.rotation.z = -.5 - r() * .4; leaves.push(g); } }
  // a desk lamp, switched off, and a folded sheet of paper
  const lamp = new THREE.Group(); lamp.position.set(.95, .81, -.42); desk.add(lamp);
  lamp.add(mesh(new THREE.CylinderGeometry(.09, .1, .03, 22), M.brass, [0, .015, 0]));
  lamp.add(mesh(new THREE.CylinderGeometry(.012, .012, .3, 10), M.brass, [0, .17, 0], { rot: [0, 0, .2] }));
  lamp.add(mesh(new THREE.CylinderGeometry(.06, .1, .13, 24, 1, true), M.shade, [.05, .34, 0], { rot: [0, 0, -.35] }));
  desk.add(mesh(rbox(.3, .008, .22, .004), toon('#ffffff', { map: TEX.sheet() }), [-.3, .808, .48], { rot: [0, .3, 0] }));

  // ── the two bulbs, hanging from a brass rod ──
  scene.add(mesh(new THREE.CylinderGeometry(.016, .016, 2.6, 12), M.brass, [0, 2.32, 1.28], { rot: [0, 0, Math.PI / 2] }));
  scene.add(mesh(new THREE.CylinderGeometry(.02, .02, .5, 10), M.brass, [.62, 2.55, 1.28]));

  const mkBulb = (pos, kind) => {
    const g = new THREE.Group(); g.position.copy(pos); scene.add(g);
    const cord = mesh(new THREE.CylinderGeometry(.008, .008, .86, 8), M.ink, [0, .68, 0], { parent: g });
    // screw base
    g.add(mesh(new THREE.CylinderGeometry(.048, .042, .07, 20), M.metal, [0, .19, 0]));
    for (let i = 0; i < 4; i++) g.add(mesh(new THREE.TorusGeometry(.047, .006, 6, 20), M.metal, [0, .17 + i * .015, 0], { rot: [Math.PI / 2, 0, 0] }));
    // glass envelope: warm for the old bulb, cool for the new one
    const glassMat = kind === 'inc'
      ? toon('#ffab4a', { transparent: true, opacity: .78, side: THREE.DoubleSide, depthWrite: false })
      : toon('#a9d4ff', { transparent: true, opacity: .62, side: THREE.DoubleSide, depthWrite: false });
    const glass = mesh(new THREE.SphereGeometry(.145, 26, 20), glassMat, [0, 0, 0], { parent: g });
    glass.scale.set(1, 1.12, 1);
    const neck = mesh(new THREE.CylinderGeometry(.05, .055, .07, 16), glassMat, [0, .13, 0], { parent: g });
    const inner = new THREE.Group(); inner.position.y = -.02; g.add(inner);
    let glow, glowL, filament, chip;
    if (kind === 'inc') {
      // a coiled filament, dark until the current arrives
      const pts = [];
      for (let i = 0; i <= 40; i++) { const u = i / 40, a = u * Math.PI * 2 * 4; pts.push(new THREE.Vector3(Math.cos(a) * .05, -.07 + u * .14, Math.sin(a) * .05)); }
      filament = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, .008, 6, false), toon('#6b6f7a', { emissive: new THREE.Color(0, 0, 0) }), [0, 0, 0], { parent: inner });
      glow = mesh(new THREE.SphereGeometry(.05, 16, 12), glowMat('#ffb36b', .8, { transparent: true, opacity: 0 }), [0, 0, 0], { parent: inner }); fxLayer(glow);
    } else {
      chip = new THREE.Group(); inner.add(chip);
      chip.add(mesh(rbox(.11, .012, .07, .004), toon('#2f7a4a'), [0, -.06, 0]));
      chip.add(mesh(rbox(.045, .014, .045, .004), toon('#fff0d8', { emissive: new THREE.Color('#67e8f9') }), [0, -.045, 0]));
      glow = mesh(new THREE.PlaneGeometry(.5, .5), new THREE.MeshBasicMaterial({ map: TEX.radial(), color: new THREE.Color('#bfe9ff').multiplyScalar(.6), transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), [0, 0, 0], { parent: inner }); fxLayer(glow);
    }
    // the halo of light around the bulb
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: TEX.radial(), color: new THREE.Color(kind === 'inc' ? '#ffc27a' : '#cfe6ff'), transparent: true, opacity: .22, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    halo.position.y = 0; halo.scale.set(.85, .95, 1); fxLayer(halo); g.add(halo);
    return { g, glass, filament, glow, halo, chip, kind };
  };

  const inc = mkBulb(INC, 'inc');
  const led = mkBulb(LEDP, 'led');

  // ── heat above the incandescent bulb ──
  const NS = 6, sq = Array.from({ length: NS }, () => { const s = squiggle(); scene.add(s); return s; });

  // ── the toy hand ──
  const hand = buildHand(); hand.scale.setScalar(.52);
  if (hand.children[1]) hand.children[1].scale.set(.6, 1.35, .6);   // a longer arm, so it leaves the frame
  scene.add(hand); hand.visible = false;
  const aim = (obj, fingers, normal) => {
    const f = fingers.clone().normalize(), n = normal.clone().normalize();
    const z = new THREE.Vector3().crossVectors(f, n.clone().negate()).normalize();
    const m = new THREE.Matrix4().makeBasis(f, n.clone().negate(), z);
    obj.quaternion.setFromRotationMatrix(m);
  };
  // two touches: the hot bulb first, then the cool one
  const HAND_PATH = [
    new THREE.Vector3(.62, .86, 1.86),
    new THREE.Vector3(.24, 1.06, 1.70),
    new THREE.Vector3(-.16, 1.18, 1.56),
    new THREE.Vector3(-.33, 1.21, 1.47),
  ];
  const HAND_PATH2 = [
    new THREE.Vector3(-.72, .86, 1.88),
    new THREE.Vector3(-.30, 1.06, 1.74),
    new THREE.Vector3(.16, 1.18, 1.58),
    new THREE.Vector3(.34, 1.21, 1.49),
  ];
  const curve1 = new THREE.CatmullRomCurve3(HAND_PATH, false, 'catmullrom', .4);
  const curve2 = new THREE.CatmullRomCurve3(HAND_PATH2, false, 'catmullrom', .4);

  const _v = new THREE.Vector3(), _c = new THREE.Color();
  // the touch windows are set by the film (it sends the times in)
  let TOUCH1 = [9.5, 10.2], TOUCH2 = [16, 16.6];
  const heat = t => ss(seg(t, TOUCH1[0], TOUCH1[0] + .5)) * (1 - ss(seg(t, TOUCH1[1], TOUCH1[1] + .8)));

  function update(t, cam, opts = {}) {
    if (opts.touch1) TOUCH1 = opts.touch1;
    if (opts.touch2) TOUCH2 = opts.touch2;
    // the moon and the room never move; the branch sways
    branch.rotation.z = .03 * Math.sin(t * .8) + .015 * Math.sin(t * 2.1);
    leaves.forEach((g, i) => { g.rotation.x = .05 * Math.sin(t * 1.1 + i); });

    const h = heat(t);
    // the incandescent: dark, then glowing when the current is on
    const on = opts.on === undefined ? (t > 8.0 && t < 21.0) : opts.on;
    const warm = on ? 1 : 0;
    const fMat = inc.filament.material;
    const glowK = warm * (.55 + .45 * Math.sin(t * 9.3) * Math.sin(t * 3.1));
    _c.set('#ff7a2a').lerp(new THREE.Color('#fff0d8'), glowK * .8);
    fMat.emissive.copy(_c).multiplyScalar(warm * (.55 + glowK * .75));
    inc.glow.material.opacity = warm * (.2 + .1 * glowK);
    inc.glow.material.color.copy(_c);
    inc.halo.material.opacity = warm * .22 + h * .14;
    inc.halo.material.color.set('#ffc27a').lerp(new THREE.Color(PAL.red), h * .6);
    incL.intensity = warm * .7 + h * .4;
    incL.color.set('#ffb36b').lerp(new THREE.Color(PAL.red), h * .5);

    // the LED: cool, steady, breathing very slightly
    const ledK = .55 + .45 * Math.pow(.5 + .5 * Math.sin(t * 2.2), 3);
    led.glow.material.opacity = .07 + .05 * ledK;
    led.halo.material.opacity = .1 + .06 * ledK;
    ledL.intensity = .8 + .35 * ledK;
    led.chip.children[1].material.emissive.set('#67e8f9').multiplyScalar(.22 + .12 * ledK);

    // the hand: in, touch, recoil — first the hot bulb, then the cool one
    const win = (t >= TOUCH1[0] - 1.7 && t < TOUCH1[1] + .9) ? [TOUCH1, curve1, new THREE.Vector3(-.79, .05, -.6)]
      : (t >= TOUCH2[0] - 1.7 && t < TOUCH2[1] + .9) ? [TOUCH2, curve2, new THREE.Vector3(.76, .05, -.65)] : null;
    hand.visible = !!win;
    if (win) {
      const [tw, curve, dir] = win, t0 = tw[0], t1 = tw[1];
      const inT = seg(t, t0 - 1.6, t0 - .35);
      const outT = seg(t, t1, t1 + .7);
      const u = clamp(inT * .92 - outT * 1.25);
      curve.getPoint(clamp(u), _v);
      hand.position.copy(_v);
      aim(hand, dir, new THREE.Vector3(.25, .9, .35));
      const curl = clamp(seg(t, t0 - .2, t0 + .1)) * (1 - ss(seg(t, t1 - .05, t1 + .25)));
      hand.pose(curl * .9, .4);
    }

    // heat above the hot bulb
    sq.forEach((s, i) => {
      const U = s.U, period = 1.1, ph = i / NS;
      const on2 = warm > 0 || h > 0;
      s.visible = on2;
      if (!on2) return;
      const age = ((t - 8) / period + ph) % 1, cyc = Math.floor((t - 8) / period + ph);
      const r = mulberry(i * 17 + cyc * 5);
      s.position.set(INC.x + (r() - .5) * .18, INC.y + .13, INC.z + (r() - .5) * .12);
      s.quaternion.copy(cam.quaternion);
      U.uHead.value = age * .42; U.uLen.value = .2; U.uCeil.value = 99;
      U.uAmp.value = .009 + .006 * r(); U.uFreq.value = 60 + 30 * r(); U.uPhase.value = r() * 6 + t * 3;
      U.uWidth.value = .008;
      U.uColor.value.set(PAL.orange).multiplyScalar(2.2); U.uColor2.value.set(PAL.red).multiplyScalar(2.6);
      U.uAlpha.value = Math.sin(age * Math.PI) * clamp((warm + h) * .6);
    });
  }

  shadowFlags(scene);
  return { scene, update, key: moon, INC, LEDP, inc, led };
}
