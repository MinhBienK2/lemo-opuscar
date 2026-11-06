// Demo: why a phone charging under a pillow gets hot. 18 s, no voice: the picture alone tells it.
import * as THREE from 'three';
import { film, label, toScreen } from '../rig/render.js';
import { PAL, keys, seg, ss, eio, eo, lerp } from '../rig/kit.js';
import { buildRoom, PHONE } from './room.js';
import { buildMacro, GATE } from './macro.js';

const F = film({ fov: 36 }), camera = F.camera;
const room = buildRoom(), macro = buildMacro();

// ── shots ──
// S1 0–4 establish, push, then hand-off to the charger · S2 4–8 travel the cable into the port
// S3 8–13 cutaway inside the phone · S4 13–18 back at the pillow: trapped heat, the pull
const camWide = keys([
  [0, [2.15, 1.62, 3.35, -.78, .78, .52]],
  [3.05, [1.7, 1.42, 2.75, -.72, .74, .5]],
  [4.0, [.42, .98, .52, .13, .83, .07], eio],
]);
const S2 = (t, out) => { // follow the cable from charger to port
  const curve = room.curve, u = .02 + .9 * eio(seg(t, 4.0, 7.65));
  const p = curve.getPointAt(Math.min(u, 1)), a = curve.getPointAt(Math.min(u + .22, 1));
  const push = ss(seg(t, 7.5, 8.0));
  const side = new THREE.Vector3(.04, .16, .3).multiplyScalar(lerp(1, .25, push));
  out.pos.copy(p).add(side); out.look.copy(a).lerp(new THREE.Vector3(PHONE.x + .17, PHONE.y, PHONE.z), push);
  if (push > 0) out.pos.lerp(new THREE.Vector3(PHONE.x + .3, PHONE.y + .015, PHONE.z + .01), push * .85);
  // blend the start from the S1 end pose
  const b = ss(seg(t, 4.0, 4.5)); if (b < 1) { const e = camWide(4.0); out.pos.lerp(new THREE.Vector3(e[0], e[1], e[2]), 1 - b); out.look.lerp(new THREE.Vector3(e[3], e[4], e[5]), 1 - b); }
};
const camMacro = keys([
  [8.0, [0, .32, 3.4, 0, .25, 1.6]],
  [9.3, [2.6, 3.3, 4.9, 0, .2, .2]],
  [10.6, [.45, 1.55, 2.35, 0, .38, .2]],
  [12.55, [.36, 1.3, 1.95, 0, .4, .15], ss],
  [13.0, [1.6, 2.2, 3.1, 0, .3, .2], (u) => u * u],
]);
const camPillow = keys([
  [13.0, [-.62, .69, .86, -.85, .66, .6]],
  [14.3, [-.05, 1.05, 1.75, -.98, .72, .52], eo],
  [16.45, [-.08, 1.03, 1.68, -.98, .72, .52], ss],
  [17.5, [.05, 1.18, 2.0, -1.05, .9, .5], eio],
  [18.0, [.06, 1.19, 2.02, -1.05, .91, .5]],
]);

const tmp = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
function shot(t) {
  if (t < 4.0) { const k = camWide(t); tmp.pos.set(k[0], k[1], k[2]); tmp.look.set(k[3], k[4], k[5]); return { set: 'room', fov: lerp(36, 40, ss(seg(t, 3, 4))), thick: 3.6, ref: 2.6 }; }
  if (t < 8.0) { S2(t, tmp); return { set: 'room', fov: 40, thick: 3.0, ref: .25 }; }
  if (t < 13.0) { const k = camMacro(t); tmp.pos.set(k[0], k[1], k[2]); tmp.look.set(k[3], k[4], k[5]); return { set: 'macro', fov: 38, thick: 3.6, ref: 2.0 }; }
  const k = camPillow(t); tmp.pos.set(k[0], k[1], k[2]); tmp.look.set(k[3], k[4], k[5]); return { set: 'room', fov: 38, thick: 3.4, ref: .9 };
}


const ORANGE = new THREE.Color(PAL.orange), CYAN = new THREE.Color(PAL.cyan);
function overlay(g, t) {
  const [x, y] = toScreen(GATE.clone().add(new THREE.Vector3(0, .42, 0)), camera);
  const box = label(g, 'NHIỆT JOULE', x + 230, y - 70, t, 10.0, 12.85, { id: 'joule' });
  return box ? [box] : [];
}

window.DUR = 18;
window.EV = [];
window.TEXTS = t => { window.render(t); return F.texts(); };
window.render = t => {
  const sh = shot(t);
  camera.fov = sh.fov; camera.position.copy(tmp.pos); camera.lookAt(tmp.look); camera.updateProjectionMatrix();
  const set = sh.set === 'room' ? room : macro;
  set.update(t, camera);
  const fl = Math.max(0, 1 - Math.abs(t - 8.0) / .22), fl2 = Math.max(0, 1 - Math.abs(t - 13.0) / .2);
  F.frame(set.scene, {
    t, thick: sh.thick, ref: sh.ref, key: set.key,
    flash: CYAN.clone().multiplyScalar(fl * 1.4).add(ORANGE.clone().multiplyScalar(fl2 * 1.1)),
    fade: Math.min(1, t / .25 + .15, (18 - t) / .3),
    overlay: t >= 10 && t <= 12.85 ? overlay : null,
  });
};
await document.fonts.load('900 54px "Be Vietnam Pro"');
window.render(0);
window.READY = true;
