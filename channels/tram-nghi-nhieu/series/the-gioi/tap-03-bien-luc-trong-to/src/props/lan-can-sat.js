// Lan can sắt ở mép sân thượng: bệ chân, tay vịn, hai nan ngang, nan dọc
// và ba trụ có nắp tròn trên đầu. Vật thật, đứng một mình được: đường viền
// mực của nan là thứ đọc ra "lan can", chứ không phải một thanh trơn.
import * as THREE from 'three';
import { toon, TEX, rbox, mesh } from '../../../../../rig/kit.js';

export function lanCanSat(opts = {}) {
  const W = opts.width ?? 11.0;
  const g = new THREE.Group();
  const iron = toon('#3b3f5e');
  const ironLit = toon('#57506e');
  g.add(mesh(rbox(W, .34, .26, .03), toon('#6a5a52', { map: TEX.wall() }), [0, .17, 0]));            // bệ chân
  g.add(mesh(rbox(W, .14, .16, .03), toon('#6b5a52'), [0, 1.16, 0]));                               // tay vịn
  g.add(mesh(new THREE.CylinderGeometry(.045, .045, W, 12), ironLit, [0, 1.06, 0], { rot: [0, 0, Math.PI / 2] }));
  g.add(mesh(new THREE.CylinderGeometry(.028, .028, W, 10), iron, [0, .55, 0], { rot: [0, 0, Math.PI / 2] }));
  for (let x = -W / 2; x <= W / 2 + .01; x += .38) {
    g.add(mesh(new THREE.CylinderGeometry(.018, .018, .95, 8), iron, [x, .60, 0]));
  }
  for (const x of [-W / 2, 0, W / 2]) {
    g.add(mesh(new THREE.CylinderGeometry(.05, .05, 1.16, 12), ironLit, [x, .58, 0]));
    g.add(mesh(new THREE.SphereGeometry(.055, 10, 8), ironLit, [x, 1.18, 0]));
  }
  return g;
}

export const PROP = { name: 'lan can sắt có nan', view: () => lanCanSat() };
