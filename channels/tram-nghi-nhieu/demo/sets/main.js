// Set reference: each ready-made set from rig/sets.js with a few props at its focus, seen from its four camera poses.
//   ?set=kitchen|desk|bathroom  ?time=morning|day|evening|night  ?flow=1 (a gas stream from the apple into the bunch)
//   ?inside=1: a tissue() cut open at the focus, a stream into one gate, cells turning outward from it; t 0..5   t 0 wide · 1 medium · 2 close · 3 low · 4 wide at light .2
import * as THREE from 'three';
import { film, Q } from '../../rig/render.js';
import { shadowFlags } from '../../rig/lights.js';
import * as SETS from '../../rig/sets.js';
import { bunch, apple, plate, banana } from '../../rig/props.js';
import { flow } from '../../rig/fx.js';
import { tissue } from '../../rig/inside.js';

await document.fonts.load('900 54px "Be Vietnam Pro"');
const F = film({ fov: 34 }), camera = F.camera, scene = new THREE.Scene();
const kind = Q.get('set') || 'kitchen';
const S = SETS[kind](scene, { time: Q.get('time') || undefined });
const P = plate({ R: .32 }); P.position.copy(S.focus); scene.add(P);
const B = bunch({ n: 4 }); B.group.position.copy(S.focus).add(new THREE.Vector3(-.08, .03, 0)); B.group.rotation.y = .4; scene.add(B.group);
B.fruits.forEach(f => f.ripen(.2, 0));
const A = apple(); A.position.copy(S.focus).add(new THREE.Vector3(.5, A.R * .92, .12)); scene.add(A);
const G = Q.get('flow') ? flow(A.position.clone().add(new THREE.Vector3(-.05, A.R * .7, 0)), S.focus.clone().add(new THREE.Vector3(.02, .07, .03))) : null;
if (G) scene.add(G);
let TI = null, TG = null;
if (Q.get('inside')) {
  [P, B.group, A].forEach(o => scene.remove(o));
  const ban = Q.get('inside') === 'banana';   // a chunk with the banana's own five-sided section, the whole banana beside it
  TI = tissue(ban ? { section: 5, rad: .1, d: .16, gates: 3, skinTo: '#f7c62f' } : { skinTo: '#f7c62f' });
  TI.group.position.copy(S.focus); scene.add(TI.group); TI.group.updateMatrixWorld(true);
  if (ban) { const W = banana({ len: .5, rad: .05 }); W.position.copy(S.focus).add(new THREE.Vector3(-.4, .0, -.25)); W.rotation.y = .5; scene.add(W); }
  const A2 = apple(); A2.position.copy(S.focus).add(new THREE.Vector3(.75, A2.R * .92, -.15)); scene.add(A2);
  TG = flow(A2.position.clone().add(new THREE.Vector3(-.04, A2.R * .8, 0)), TI.gatePos(ban ? 1 : 4), { size: .025 }); scene.add(TG);
}
shadowFlags(scene);
const order = ['wide', 'medium', 'close', 'low', 'wide'];
window.DUR = 5; window.EV = []; window.TEXTS = t => { window.render(t); return F.texts(); };
window.render = t => {
  if (TI) {
    const k = TI.cam(S.focus); camera.position.set(k[0], k[1], k[2]); camera.lookAt(k[3], k[4], k[5]); camera.updateProjectionMatrix();
    S.update(t, {}); TG.update(t + 10, Math.min(1, t / 1.2));
    const gi = Q.get('inside') === 'banana' ? 1 : 4;
    for (let i = 0; i < (gi === 1 ? 3 : 6); i++) TI.setGate(i, i === gi ? (t - 1.2) / .5 : 0);
    const g = TI.gatePos(gi).sub(TI.group.position); TI.setCells(TI.spread(g.x, g.y, t, 1.6, .18)); TI.setSkin((t - 2) / 2.5);
    F.frame(scene, { t, key: S.key }); return;
  }
  const i = Math.min(4, Math.floor(t)), k = S.cams[order[i]];
  camera.position.set(k[0], k[1], k[2]); camera.lookAt(k[3], k[4], k[5]); camera.updateProjectionMatrix();
  S.update(t, { light: i === 4 ? .2 : 1 });
  if (G) G.update(t + 40, 1);
  F.frame(scene, { t, key: S.key });
};
window.render(0); window.READY = true;
