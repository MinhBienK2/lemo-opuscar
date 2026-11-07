// Chapter 2 — Trong não: khe synapse giữa hai tế bào thần kinh, nơi adenosin tích tụ và nơi cà phê chặn cửa.
// Cả chương diễn ra trên một mặt bàn tối: một mẩu mô não, và ở góc bàn, tách cà phê cùng một chiếc đồng hồ nhỏ.
import * as THREE from 'three';
import { PAL, toon, glowMat, rbox, mesh, fxLayer, surface, clamp, lerp, seg, ss } from '../../../../rig/kit.js';
import { flow } from '../../../../rig/fx.js';
import { brainSpace, brainChunk, brainSkinTex, neuron, molecules, receptors, capillary } from '../../../../rig/brain.js';
import { coffeeCup, bodyClock, clockRing } from './props.js';
import { makeShots } from './shots.js';

export function build(scene, V) {
  const T = id => (V.L[id] ? V.L[id].t0 : 0);
  const W = (id, w) => V.w(id, w);

  // ── the place: a chunk of brain on a dark table, lit by one warm pool ──
  const SP = brainSpace(scene, { seed: 3 });

  // the tissue behind: a folded mass, the background layer of the frame
  const mass = brainChunk({ w: 3.2, d: 1.4, h: .8, seed: 3, cut: false, folds: 6, amp: .07 });
  mass.position.set(0, -1.1, -1.15);
  scene.add(mass);

  // ── the cleft: a low wall of tissue with a narrow crack through it, seen from above ──
  const GAP = .16, WALLT = .34, WALLH = .46, WALLD = .95;
  const skin = toon('#ffffff', { map: brainSkinTex(5) });
  const walls = new THREE.Group();
  walls.position.set(0, -.52, 0);
  scene.add(walls);
  walls.add(mesh(rbox(WALLT, WALLH, WALLD, .05), skin, [-(GAP + WALLT / 2), WALLH / 2, -.25]));
  walls.add(mesh(rbox(WALLT, WALLH, WALLD, .05), skin, [GAP + WALLT / 2, WALLH / 2, -.25]));
  // the two faces that look at each other: the inside of the cleft
  const faceMat = toon('#e7d3dd');
  walls.add(mesh(new THREE.PlaneGeometry(WALLD, WALLH), faceMat, [-GAP, WALLH / 2, -.25], { rot: [0, Math.PI / 2, 0], cast: false }));
  walls.add(mesh(new THREE.PlaneGeometry(WALLD, WALLH), faceMat, [GAP, WALLH / 2, -.25], { rot: [0, -Math.PI / 2, 0], cast: false }));
  // the floor of the cleft, and the tissue that closes the crack at the far end
  walls.add(mesh(new THREE.PlaneGeometry(GAP * 2, WALLD), toon('#c98fa8'), [0, .004, -.25], { rot: [-Math.PI / 2, 0, 0], cast: false }));
  walls.add(mesh(new THREE.PlaneGeometry(GAP * 2, WALLH), toon('#4a3340'), [0, WALLH / 2, -.7], { cast: false }));
  // below the floor the tissue is solid, so the cleft reads as a crack in one mass
  walls.add(mesh(rbox(GAP * 2 + WALLT * 2, .5, WALLD, .05), skin, [0, -.25, -.25]));

  // ── the tissue around the cleft: more neurons, so the place reads as brain ──
  for (const [x, y, z, s, seed] of [[-.62, .18, -.5, .5, 11], [.58, .3, -.62, .42, 13], [-.3, .62, -.75, .38, 17], [.42, .58, -.3, .34, 19]]) {
    const extra = neuron({ size: s, seed, dendrites: 4 });
    extra.position.set(x, y, z);
    extra.rotation.set(0, seed, .3);
    walls.add(extra);
  }
  // the folds of the cortex along the top of the cleft
  for (const sgn of [-1, 1]) {
    const fold = mesh(surface(24, 12, (u, v) => {
      const f = Math.sin(u * Math.PI * 5) * .035;
      return [sgn * (GAP + .02 + u * .3), f + v * .04, -.25 + (v - .5) * WALLD];
    }), skin, [0, WALLH - .02, 0], { cast: false });
    walls.add(fold);
  }

  // ── the presynaptic side: a neuron whose axon crosses the crack ──
  const N = neuron({ size: .55, seed: 5, dendrites: 4 });
  N.position.set(-.2, .42, -.25);
  N.rotation.set(0, 0, -.3);
  walls.add(N);
  const term = new THREE.Group();
  term.position.set(.02, .42, -.25);
  walls.add(term);
  for (let i = 0; i < 4; i++) {
    const b = mesh(new THREE.SphereGeometry(.04, 16, 12), toon('#9a5be5'), [0, (i - 1.5) * .05, (i % 2 ? .045 : -.045)], { parent: term });
    b.userData.tag = 'terminal';
  }

  // ── the postsynaptic side: the doors that receive the signal ──
  const rec = receptors({ n: 5, spacing: .16, size: .08, color: '#9a5be5' });
  rec.position.set(GAP - .03, .42, -.25);
  rec.rotation.y = -Math.PI / 2;
  walls.add(rec);

  // ── the fluid in the cleft, and the molecules in it ──
  const fluid = mesh(new THREE.BoxGeometry(GAP * 1.8, 1, WALLD * .9), toon('#5fb6d6', { transparent: true, opacity: .1, depthWrite: false }), [0, .5, -.25]);
  fluid.renderOrder = 3;
  fxLayer(fluid);
  walls.add(fluid);

  const aden = molecules({ n: 420, color: '#67e8f9', size: .015, k: 1.5, seed: 2 });
  walls.add(aden.mesh);
  const caff = molecules({ n: 90, color: '#f7bd27', size: .019, k: 1.3, seed: 8 });
  walls.add(caff.mesh);
  const BOX = { x: 0, y: .2, z: -.25, w: GAP * 1.5, h: .3, d: WALLD * .72 };

  // ── the clean-up flow: what empties the cleft while you sleep ──
  const wash = flow(new THREE.Vector3(-.05, .1, -.65), new THREE.Vector3(.05, .1, .15), { color: '#cfe8ff', size: .028, lift: .04, n: 120, rate: .55, seed: 4, opacity: .3 });
  walls.add(wash);

  // ── the signal that goes into the cell ──
  const sig = mesh(new THREE.SphereGeometry(.018, 14, 10), glowMat('#f7bd27', 2.4), [0, 0, 0], { cast: false });
  fxLayer(sig); walls.add(sig);

  // ── the desk that shares this table: the coffee cup and a small clock ──
  const cup = coffeeCup({});
  cup.position.set(1.25, -.6, .55);
  cup.updateSteam(0, 1);
  scene.add(cup);
  const small = bodyClock({ r: .16 });
  small.position.set(1.25, -.46, .02);
  small.rotation.x = -.4;
  scene.add(small);

  // a capillary further back, for depth
  const cap = capillary({ len: 2.2, R: .1, seed: 4, cells: 22 });
  cap.position.set(.1, -.75, -.9);
  cap.rotation.y = .25;
  scene.add(cap);

  // a brass ring with a needle, glimpsed in the tissue: the second clock, the one that measures the day
  const ring = clockRing({ R: .22, marks: 24 });
  ring.position.set(.72, -.44, -1.35);
  ring.rotation.set(-1.15, 0, .2);
  scene.add(ring);

  // ── the camera ──
  const shots = makeShots(V, [
    { id: 'cleft_wide', line: 'c20', cam: [0.62, 0.202, 1.728, -0.05, -0.22, -0.25] },
    { id: 'neuron_soma', line: 'c21', cam: [0.18, 0.179, 0.998, -0.12, -0.2, -0.25] },
    { id: 'cleft_tight', line: 'c22', cam: [0.06, 0.045, 0.794, 0.0, -0.26, -0.25] },
    { id: 'cleft_filling', line: 'c23', cam: [-0.12, 0.022, 0.742, 0.0, -0.3, -0.25] },
    { id: 'dots_grow', line: 'c24', cam: [0.1, 0.0, 0.666, 0.0, -0.32, -0.25] },
    { id: 'cleft_more', line: 'c25', cam: [0.2, 0.067, 1.024, 0.0, -0.26, -0.25] },
    { id: 'dots_close', line: 'c26', cam: [-0.08, -0.022, 0.64, 0.0, -0.32, -0.25] },
    { id: 'level_press', line: 'c27', cam: [0.22, 0.112, 0.845, 0.0, -0.26, -0.25] },
    { id: 'into_cleft', line: 'c28', cam: [0.04, -0.022, 0.717, 0.0, -0.34, -0.28] },
    { id: 'deep_tease', line: 'c29', cam: [-0.45, 0.224, 1.216, -0.1, -0.26, -0.25] },
    { id: 'deep_tease2', line: 'c30', cam: [0.42, 0.246, 1.216, 0.05, -0.26, -0.25] },
    { id: 'reason_one', line: 'c31', cam: [-0.2, 0.134, 0.947, 0.0, -0.28, -0.25] },
    { id: 'ring_tease', line: 'c32', cam: [1.25, 0.022, -0.64, 0.95, -0.38, -1.15] },
    { id: 'ring_tease2', line: 'c33', cam: [1.0, -0.134, -0.794, 0.95, -0.4, -1.15] },
    { id: 'ring_dip', line: 'c34', cam: [1.12, -0.224, -0.666, 0.95, -0.42, -1.15] },
    { id: 'ring_dip2', line: 'c35', cam: [0.78, -0.179, -0.922, 0.95, -0.4, -1.15] },
    { id: 'both_clocks', line: 'c36', cam: [0.55, 0.056, 0.32, 0.2, -0.3, -0.5] },
    { id: 'answer_inside', line: 'c37', cam: [0.12, 0.022, 0.768, 0.0, -0.3, -0.25] },
    { id: 'go_in', line: 'c38', cam: [0.04, -0.045, 0.64, 0.0, -0.34, -0.28] },
    { id: 'brain_wide', line: 'c39', cam: [1.05, 0.56, 2.368, 0.0, -0.3, -0.35] },
    { id: 'cut_face', line: 'c40', cam: [0.75, 0.291, 1.664, 0.0, -0.28, -0.3] },
    { id: 'cleft_open', line: 'c41', cam: [0.45, 0.157, 1.28, 0.0, -0.26, -0.25] },
    { id: 'cleft_mid', line: 'c42', cam: [0.05, 0.067, 0.998, 0.0, -0.26, -0.25] },
    { id: 'cleft_left', line: 'c43', cam: [-0.4, 0.045, 0.896, -0.02, -0.26, -0.25] },
    { id: 'doors', line: 'c44', cam: [0.32, 0.112, 0.742, 0.12, -0.26, -0.25] },
    { id: 'cleft_empty', line: 'c45', cam: [0.04, -0.022, 0.845, 0.0, -0.3, -0.25] },
    { id: 'cleft_side', line: 'c46', cam: [0.6, 0.067, 0.998, 0.0, -0.28, -0.25] },
    { id: 'dots_few', line: 'c47', cam: [-0.12, 0.0, 0.64, 0.0, -0.3, -0.25] },
    { id: 'cell_pair', line: 'c48', cam: [0.8, 0.246, 1.152, 0.0, -0.24, -0.25] },
    { id: 'adeno', line: 'c49', cam: [0.06, 0.067, 0.666, 0.0, -0.26, -0.25] },
    { id: 'dots_more', line: 'c50', cam: [-0.34, 0.022, 0.742, 0.0, -0.3, -0.25] },
    { id: 'cleft_full', line: 'c51', cam: [0.02, 0.067, 0.998, 0.0, -0.26, -0.25] },
    { id: 'dock', line: 'c52', cam: [0.36, 0.112, 0.589, 0.1, -0.26, -0.25] },
    { id: 'signal_in', line: 'c53', cam: [0.58, 0.134, 0.742, 0.18, -0.26, -0.25] },
    { id: 'cleft_press', line: 'c54', cam: [-0.14, 0.067, 1.024, 0.0, -0.26, -0.25] },
    { id: 'level_up', line: 'c55', cam: [0.02, 0.157, 0.819, 0.0, -0.24, -0.25] },
    { id: 'doors_busy', line: 'c56', cam: [0.36, 0.112, 0.64, 0.12, -0.26, -0.27] },
    { id: 'wide_again', line: 'c57', cam: [-1.0, 0.56, 1.92, -0.1, -0.3, -0.25] },
    { id: 'cleft_full2', line: 'c58', cam: [0.02, 0.09, 1.101, 0.0, -0.26, -0.25] },
    { id: 'cleft_press2', line: 'c59', cam: [-0.42, 0.045, 0.819, 0.0, -0.3, -0.25] },
    { id: 'door_close', line: 'c60', cam: [0.32, 0.112, 0.563, 0.11, -0.26, -0.25] },
    { id: 'caffeine_in', line: 'c61', cam: [-0.04, 0.045, 0.666, 0.02, -0.28, -0.25] },
    { id: 'blocked', line: 'c62', cam: [0.34, 0.112, 0.589, 0.11, -0.26, -0.26] },
    { id: 'still_there', line: 'c63', cam: [0.02, 0.0, 0.742, 0.0, -0.3, -0.25] },
    { id: 'desk_cup', line: 'c64', cam: [1.5, -0.314, 1.664, 1.25, -0.42, 0.55] },
    { id: 'desk_clock', line: 'c65', cam: [1.5, -0.291, 1.024, 1.25, -0.42, 0.05] },
    { id: 'desk_clock2', line: 'c66', cam: [1.0, -0.336, 0.64, 1.25, -0.42, 0.02] },
    { id: 'caffeine_more', line: 'c67', cam: [0.3, 0.112, 0.614, 0.11, -0.26, -0.26] },
    { id: 'still_there2', line: 'c68', cam: [-0.06, 0.022, 0.717, 0.0, -0.28, -0.25] },
    { id: 'blocked2', line: 'c69', cam: [0.28, 0.112, 0.538, 0.1, -0.26, -0.25] },
    { id: 'wash_start', line: 'c70', cam: [0.02, 0.022, 0.947, 0.0, -0.3, -0.25] },
    { id: 'wash_mid', line: 'c71', cam: [-0.3, 0.0, 0.742, 0.0, -0.32, -0.25] },
    { id: 'cleft_empty2', line: 'c72', cam: [0.02, -0.022, 0.819, 0.0, -0.34, -0.25] },
    { id: 'wide_after', line: 'c73', cam: [-0.95, 0.504, 1.856, -0.1, -0.3, -0.25] },
    { id: 'cleft_clean', line: 'c74', cam: [0.02, -0.045, 0.794, 0.0, -0.34, -0.25] },
    { id: 'wide_end', line: 'c75', cam: [1.0, 0.616, 2.176, 0.0, -0.28, -0.3] },
    { id: 'doors_free', line: 'c76', cam: [0.3, 0.112, 0.589, 0.11, -0.26, -0.25] },
    { id: 'cleft_clean2', line: 'c77', cam: [0.02, 0.0, 0.896, 0.0, -0.32, -0.25] },
  ]);

  // ── the state of the cleft, driven by the words ──
  const tMorning = T('c18'), tEmpty = T('c41'), tFull = T('c54'), tCaff = W('c58', 'trôi'), tBlock = T('c60');
  const tWash = T('c67'), tClean = T('c70');
  const tSignal = W('c48', 'bám'), tSignalEnd = W('c49', 'tín hiệu');

  const update = t => {
    // how full the cleft is: nearly empty in the morning, full by one in the afternoon
    const fill = .15 * ss(seg(t, tMorning, tEmpty)) + .85 * ss(seg(t, tEmpty, tFull));
    const level = lerp(.08, .8, fill);
    fluid.scale.y = level;
    fluid.position.y = level / 2;
    fluid.visible = level > .02;

    // adenosine in the cleft: the count grows with the level
    const clean = 1 - ss(seg(t, tClean, tClean + 3));
    aden.fill(BOX, Math.round((14 + fill * 250) * clean), 0);

    // caffeine: it arrives and sits in the doors, and stays there
    const caffGo = ss(seg(t, tCaff, tBlock + 3));
    for (let i = 0; i < 90; i++) {
      if (i >= Math.round(caffGo * 80)) { caff.put(i, 0, -99, 0); continue; }
      const door = i % 5, row = Math.floor(i / 5) % 4;
      caff.put(i, GAP - .05 - .01 * row, .42 + (row - 1.5) * .05, -.25 + (door - 2) * .16);
    }

    // the signal goes into the cell and stops at the caffeine
    const s = ss(seg(t, tSignal, tSignalEnd + .8));
    sig.visible = s > .01 && s < .99;
    sig.position.set(GAP - .03 - s * .16, .42, -.25);

    // the clean-up: the cleft is washed while you sleep
    const washGo = ss(seg(t, tWash, tWash + 2.2)) * (1 - ss(seg(t, tClean, tClean + 1.6)));
    wash.update(t, washGo);
    wash.amount(.4 + .6 * washGo);

    cap.blood.update(t);
    cup.updateSteam(t, 1 - .3 * ss(seg(t, tFull, tFull + 2)));
    small.tick(t, 13 + .5 * (t - tEmpty) / 60);
    ring.setHour(13 + .5 * (t - tEmpty) / 60);
  };

  const labels = t => {
    const out = [];
    const a0 = T('c46'), a1 = T('c49');
    if (t >= a0 && t <= a1) out.push({ text: 'ADENOSIN', anchor: new THREE.Vector3(0, -.2, -.25), t0: a0, t1: a1, dx: -250, dy: -130 });
    const b0 = T('c58'), b1 = T('c61');
    if (t >= b0 && t <= b1) out.push({ text: 'CỬA CHẶN ADENOSIN', anchor: new THREE.Vector3(GAP, -.2, -.25), t0: b0, t1: b1, dx: 240, dy: -120 });
    return out;
  };

  return {
    key: SP.key,
    update,
    cam: t => shots.at(t),
    labels,
    events: () => shots.events(),
    flashColor: () => new THREE.Color(PAL.cyan),
    ref: 1.2,
  };
}
