// Props of this episode: the things that live on the desk and on the tissue, and that change state on screen.
// Reusable parts of the brain live in the channel rig (rig/brain.js); what belongs to this episode only stays here.
import * as THREE from 'three';
import { PAL, toon, glowMat, canvasTex, rbox, mesh, fxLayer, cushionGeo, mulberry, clamp, lerp, seg, ss } from '../../../../rig/kit.js';
import { squiggle } from '../../../../rig/fx.js';
import { clock } from '../../../../rig/sets.js';

// A toy phone lying on the desk, screen up. The screen never shows a time of its own: the wall clock and the
// desk clock carry the time of the day, and one number must not show twice in one frame. `alarm()` opens the
// alarm chooser instead, with the two nap lengths as the two buttons.
export function phone({ w = .085, h = .17, color = '#252d50', screen = '#8fd7e8' } = {}) {
  const g = new THREE.Group();
  const body = mesh(rbox(w, .012, h, .012), toon(color), [0, 0, 0]);
  g.add(body);
  const tex = canvasTex(256, 512, (c, W, H) => {
    c.fillStyle = screen; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(255,255,255,.35)';
    for (let k = 0; k < 40; k++) c.fillRect(0, 40 + k * 12, W, 3);
  });
  const scr = mesh(new THREE.PlaneGeometry(w * .88, h * .88), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), [0, .0065, 0], { rot: [-Math.PI / 2, 0, 0], cast: false, recv: false });
  g.add(scr);
  const draw = fn => { const c = tex.image.getContext('2d'); c.save(); c.translate(128, 256); c.rotate(-Math.PI / 2); c.translate(-128, -256); fn(c); c.restore(); tex.needsUpdate = true; };
  // a chat bubble: something is waiting, no number on it
  g.message = () => draw(c => {
    c.fillStyle = screen; c.fillRect(0, 0, 256, 512);
    c.fillStyle = 'rgba(255,255,255,.22)';
    for (let k = 0; k < 40; k++) c.fillRect(0, 40 + k * 12, 256, 3);
    c.fillStyle = 'rgba(255,255,255,.85)';
    c.beginPath(); c.roundRect(30, 150, 196, 90, 22); c.fill();
    c.fillStyle = 'rgba(30,60,100,.55)';
    for (let k = 0; k < 3; k++) c.fillRect(50, 175 + k * 22, 130 - k * 28, 10);
  });
  // the alarm chooser: ten minutes or twenty minutes
  g.alarm = () => draw(c => {
    c.fillStyle = screen; c.fillRect(0, 0, 256, 512);
    c.fillStyle = 'rgba(255,255,255,.22)';
    for (let k = 0; k < 40; k++) c.fillRect(0, 40 + k * 12, 256, 3);
    c.fillStyle = '#12203a';
    c.font = '900 46px "Be Vietnam Pro", sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('BÁO THỨC', 128, 120);
    c.fillStyle = 'rgba(255,255,255,.9)';
    c.beginPath(); c.roundRect(34, 180, 188, 80, 18); c.fill();
    c.beginPath(); c.roundRect(34, 280, 188, 80, 18); c.fill();
    c.fillStyle = '#1c3a5e';
    c.font = '900 54px "Be Vietnam Pro", sans-serif';
    c.fillText('10 PHÚT', 128, 220);
    c.fillText('20 PHÚT', 128, 320);
  });
  g.message();
  // the time of the day, drawn on the screen — only where the wall clock is not in the same frame
  g.setTime = (hh, mm) => draw(c => {
    c.fillStyle = screen; c.fillRect(0, 0, 256, 512);
    c.fillStyle = 'rgba(255,255,255,.22)';
    for (let k = 0; k < 40; k++) c.fillRect(0, 40 + k * 12, 256, 3);
    c.fillStyle = '#12203a';
    c.font = '900 86px "Be Vietnam Pro", sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0'), 128, 230);
    c.font = '700 34px "Be Vietnam Pro", sans-serif';
    c.fillStyle = 'rgba(20,40,70,.6)';
    c.fillText('Đồng hồ', 128, 320);
  });
  return g;
}

// The cushion somebody put their head on for twenty minutes: a folded jacket, soft, with a dent in it.
export function napCushion({ L = .38, T = .16, D = .3, color = '#9a5be5' } = {}) {
  const g = new THREE.Group();
  const body = mesh(cushionGeo(L, T, D, .03), toon(color), [0, 0, 0]);
  g.add(body);
  const band = mesh(rbox(L * .9, .02, D * .25, .01), toon('#f7bd27'), [0, T * .42, 0]);
  g.add(band);
  return g;
}

// A cup of coffee gone cold, and the steam that leaves it: the squiggle is the only moving thing on the table.
export function coffeeCup({ color = '#fff0d8', drink = '#3a2415', steam = true, scale = 1 } = {}) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(.075, .07, .17, 22), toon(color), [0, .085, 0]));
  g.add(mesh(new THREE.TorusGeometry(.045, .013, 8, 16), toon(color), [.085, .09, 0]));
  g.add(mesh(new THREE.CircleGeometry(.066, 22), toon(drink), [0, .152, 0], { rot: [-Math.PI / 2, 0, 0] }));
  let sq = null;
  if (steam) {
    sq = squiggle('#cfe8ff', '#ffffff');
    sq.position.set(0, .16, 0);
    sq.scale.setScalar(1);
    g.add(sq);
  }
  g.steam = sq;
  g.updateSteam = (t, amount = 1) => {
    if (!sq) return;
    const U = sq.U;
    U.uHead.value = .05 + amount * (.5 + .06 * Math.sin(t * .7));
    U.uLen.value = .28 * amount;
    U.uCeil.value = .42;
    U.uAmp.value = .012 * amount;
    U.uAlpha.value = .55 * amount;
    sq.visible = amount > .01;
  };
  g.scale.setScalar(scale);
  return g;
}

// A wall clock whose face can carry a second hand that does something: the ninety-minute hand of the body.
export function bodyClock({ r = .22, face = PAL.cream, rim = PAL.red } = {}) {
  const M = { cream: toon(face), red: toon(rim), navy: toon(PAL.navy) };
  const ck = clock(M);
  ck.userData.tag = 'clock';
  // a third hand: the slow one
  const slow = new THREE.Group(); slow.position.z = .058; ck.add(slow);
  slow.add(mesh(rbox(.009, .13, .008, .003), toon(PAL.cyan), [0, .055, 0]));
  ck.slow = slow;
  ck.setSlow = (frac) => { slow.rotation.z = -frac * Math.PI * 2; };  // 0..1 around the dial
  ck.r = r; ck.scale.setScalar(r / .22);
  return ck;
}

// A toy person at the desk: head with hair and drooping eyelids, shoulders, two arms ending in hands.
// It is what the whole first chapter is about — a tired body — so it has to be in the frame, not just a hand.
// set(lean, head, reach, open) poses it: leaning on the desk, head down, reaching for the glass, eyes open.
export function toyPerson({ shirt = '#3b4a8a', skin = '#f0c9a4', hair = '#2b2036', trousers = '#2b3358' } = {}) {
  const g = new THREE.Group();
  const skinM = toon(skin), shirtM = toon(shirt), hairM = toon(hair), trouserM = toon(trousers);
  const body = new THREE.Group(); g.add(body);
  // the lap: a block of trousers going forward under the desk
  body.add(mesh(rbox(.30, .17, .38, .08), trouserM, [0, .05, .10]));

  const torso = new THREE.Group(); torso.position.set(0, .13, 0); body.add(torso);
  torso.add(mesh(rbox(.33, .44, .25, .11), shirtM, [0, .22, 0]));
  // the collar, so the neck reads
  torso.add(mesh(new THREE.CylinderGeometry(.075, .09, .07, 14), skinM, [0, .47, 0]));

  const armL = new THREE.Group(), armR = new THREE.Group();
  armL.position.set(-.17, .40, .02); armR.position.set(.17, .40, .02);
  torso.add(armL, armR);
  // a limb between two points: shoulder → elbow → hand, so the arm really bends
  const limb = (parent, a, b, r, mat) => {
    const dir = b.clone().sub(a), len = dir.length();
    const m = mesh(new THREE.CapsuleGeometry(r, Math.max(.01, len - r * 2), 4, 12), mat, [0, 0, 0]);
    m.position.copy(a).add(b).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    parent.add(m);
    return m;
  };
  for (const a of [armL, armR]) {
    limb(a, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -.20, .24), .058, shirtM);
    limb(a, new THREE.Vector3(0, -.20, .24), new THREE.Vector3(0, -.38, .46), .05, skinM);
    a.add(mesh(new THREE.SphereGeometry(.062, 16, 12), skinM, [0, -.39, .47]));
  }

  const head = new THREE.Group(); head.position.set(0, .50, .02); torso.add(head);
  head.add(mesh(new THREE.SphereGeometry(.125, 26, 20), skinM, [0, 0, 0]));
  // the hair: a cap over the back of the head
  head.add(mesh(new THREE.SphereGeometry(.133, 26, 20, 0, Math.PI * 2, 0, Math.PI * .58), hairM, [0, .012, -.018]));
  // the eyes: two dark lids, flat when closed
  const eyeL = mesh(new THREE.SphereGeometry(.03, 14, 10), toon('#241d2e'), [-.048, .012, .108]);
  const eyeR = mesh(new THREE.SphereGeometry(.03, 14, 10), toon('#241d2e'), [.048, .012, .108]);
  eyeL.scale.set(1, .5, .3); eyeR.scale.set(1, .5, .3);
  head.add(eyeL, eyeR);
  // the mouth: a small dark line
  const mouth = mesh(new THREE.SphereGeometry(.035, 12, 8), toon('#c47f6b'), [0, -.055, .112]);
  mouth.scale.set(1, .35, .2);
  head.add(mouth);

  g.set = (lean = 0, headDown = 0, reach = 0, open = 0) => {
    torso.rotation.x = lean;
    head.rotation.x = headDown;
    armR.rotation.y = -reach;
    armR.rotation.z = -reach * .25;
    eyeL.scale.set(1, .5 + .45 * open, .3);
    eyeR.scale.set(1, .5 + .45 * open, .3);
  };
  g.set(0, 0, 0, 0);
  g.userData = { torso, head, armL, armR, eyeL, eyeR };
  return g;
}

// upright facing the camera, its needle turning once around it in a day (or in an hour, for a sleep cycle).
export function clockRing({ R = .5, marks = 24, hours = 24, seed = 5 } = {}) {
  const g = new THREE.Group();
  const brass = toon('#c9973a');
  g.add(mesh(new THREE.TorusGeometry(R, .035, 12, 64), brass, [0, 0, 0]));
  // the dial: a cream face with the hour marks on it, so the ring reads as a clock and not as a hoop
  g.add(mesh(new THREE.CircleGeometry(R - .035, 64), toon('#fff0d8'), [0, 0, -.004], { cast: false }));
  for (let i = 0; i < marks; i++) {
    const a = Math.PI / 2 - (i / marks) * Math.PI * 2;
    const big = i % 6 === 0;
    g.add(mesh(rbox(big ? .05 : .028, big ? .11 : .06, .015, .004), toon('#252d50'),
      [Math.cos(a) * (R - .09), Math.sin(a) * (R - .09), .002], { rot: [0, 0, a], cast: false }));
  }
  for (let i = 0; i < marks; i++) {
    const a = Math.PI / 2 - (i / marks) * Math.PI * 2;
    const big = i % 6 === 0;
    g.add(mesh(rbox(big ? .035 : .018, big ? .09 : .05, .02, .004), brass, [Math.cos(a) * R, Math.sin(a) * R, 0], { rot: [0, 0, a] }));
  }
  const needle = new THREE.Group(); g.add(needle);
  needle.add(mesh(rbox(R * .78, .022, .012, .005), toon(PAL.red), [R * .39, 0, 0]));
  needle.add(mesh(new THREE.ConeGeometry(.045, .09, 12), toon(PAL.red), [R * .82, 0, 0], { rot: [0, 0, -Math.PI / 2] }));
  needle.add(mesh(new THREE.SphereGeometry(.045, 14, 10), toon(PAL.cream), [0, 0, 0]));
  g.needle = needle;
  g.setHour = (h) => { needle.rotation.z = Math.PI / 2 - (h / hours) * Math.PI * 2; };
  g.setHour(0);
  return g;
}
