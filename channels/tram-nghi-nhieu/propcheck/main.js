// propcheck: each object of a module alone, in a plain lit studio, from three sides — "do you know what this is?"
//   ?mod=/channels/tram-nghi-nhieu/series/<cột>/<tập>/src/props.js   (default: ./rig.js, the rig's own objects)
//   window.render(t): t = 3·k + v, object k, view v (0 three-quarter, 1 side at eye level, 2 from above); window.PROPS = names
import * as THREE from 'three';
import { film, Q } from '../rig/render.js';
import { keyLight, ambience } from '../rig/lights.js';
import { toon } from '../rig/kit.js';

await document.fonts.load('900 54px "Be Vietnam Pro"');
const { PROPS } = await import(Q.get('mod') || './rig.js');
const names = Object.keys(PROPS);
const F = film({ fov: 30, near: .005, far: 60 }), camera = F.camera, scene = new THREE.Scene();
scene.background = new THREE.Color('#d9d2c4');
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), toon('#cfc6b4'));
floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
ambience(scene, { sky: '#e8e4ff', ground: '#8a7a70', fill: .9, rim: '#ffffff', rimI: .6 });
const key = keyLight(scene, { color: '#fff1dc', intensity: 3.2, from: new THREE.Vector3(2.5, 4, 3), to: new THREE.Vector3(0, 0, 0), size: 2 });
let cur = -1, obj = null, box = new THREE.Box3(), ctr = new THREE.Vector3(), R = 1;
function show(k) {
  if (k === cur) return; cur = k;
  if (obj) scene.remove(obj);
  obj = PROPS[names[k]](); scene.add(obj); obj.updateMatrixWorld(true);
  obj.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  box.setFromObject(obj);   // the long side across the front view
  const sz = box.getSize(new THREE.Vector3());
  if (sz.z > sz.x * 1.3) { obj.rotation.y += Math.PI / 2; obj.updateMatrixWorld(true); box.setFromObject(obj); }
  obj.position.y -= box.min.y; obj.position.x -= (box.min.x + box.max.x) / 2; obj.position.z -= (box.min.z + box.max.z) / 2;
  obj.updateMatrixWorld(true); box.setFromObject(obj); box.getCenter(ctr);
  R = box.getSize(new THREE.Vector3()).length() / 2;
  key.shadow.camera.left = key.shadow.camera.bottom = -R * 2; key.shadow.camera.right = key.shadow.camera.top = R * 2;
  key.shadow.camera.updateProjectionMatrix();
}
const VIEWS = [[.6, .45], [0, .08], [.3, 1.2]];   // [azimuth, elevation] rad: three-quarter, front (across the long side), top
window.PROPS = names; window.DUR = names.length * 3; window.EV = [];
window.render = t => {
  const k = Math.min(names.length - 1, Math.floor(t / 3)), v = Math.floor(t) % 3; show(k);
  const [az, el] = VIEWS[v], d = R / Math.sin(THREE.MathUtils.degToRad(15)) * 1.05;
  camera.position.set(ctr.x + d * Math.cos(el) * Math.sin(az), ctr.y + d * Math.sin(el), ctr.z + d * Math.cos(el) * Math.cos(az));
  camera.lookAt(ctr); camera.updateProjectionMatrix();
  F.frame(scene, { t, ref: d, key });
};
window.TEXTS = t => { window.render(t); return F.texts(); };
window.READY = true;
