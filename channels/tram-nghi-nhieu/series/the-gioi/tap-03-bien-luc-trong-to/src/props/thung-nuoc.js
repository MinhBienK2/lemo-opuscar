// Thùng nước inox trên bốn chân: thân thùng mở miệng, vành miệng, mặt nước
// bên trong, nắp đã tháo ra đặt cạnh, bản lề, thang leo bám vào thân và một
// vòi lấy nước có tay nắm đỏ.
import * as THREE from 'three';
import { PAL, toon, rbox, mesh } from '../../../../../rig/kit.js';

export const TANK_R = .55, TANK_STAND = .36, TANK_BODY = .72;

export function thungNuoc(opts = {}) {
  const waterCol = opts.water ?? '#ffa653';
  const night = !!opts.night, red = !!opts.red;
  const group = new THREE.Group();
  const plastic = toon('#a9a5a0');                       // nhựa xám trung tính: màu đến từ ánh sáng
  const plasticDark = toon('#6f7a88');
  const STEEL = TANK_STAND, BODY_R = TANK_R, BODY_H = TANK_BODY;
  for (const [dx, dz] of [[-.40, -.40], [.40, -.40], [-.40, .40], [.40, .40]]) {
    group.add(mesh(new THREE.CylinderGeometry(.045, .045, STEEL, 10), toon('#4a5568'), [dx, STEEL / 2, dz]));
  }
  for (const dz of [-.40, .40]) group.add(mesh(rbox(.90, .05, .05, .01), toon('#3f4a5c'), [0, .14, dz]));
  for (const dx of [-.40, .40]) group.add(mesh(rbox(.05, .05, .90, .01), toon('#3f4a5c'), [dx, .14, 0]));
  // thân thùng: không có nắp trên (miệng mở), đáy thùng là một đĩa riêng
  group.add(mesh(new THREE.CylinderGeometry(BODY_R, BODY_R * .97, BODY_H, 30, 1, true), plastic, [0, STEEL + BODY_H / 2, 0]));
  group.add(mesh(new THREE.CircleGeometry(BODY_R * .97, 30), plasticDark, [0, STEEL, 0], { rot: [Math.PI / 2, 0, 0], cast: false }));
  group.add(mesh(new THREE.TorusGeometry(BODY_R + .005, .03, 8, 30), plasticDark, [0, STEEL + BODY_H * .30, 0], { rot: [Math.PI / 2, 0, 0] }));
  group.add(mesh(new THREE.TorusGeometry(BODY_R + .01, .045, 8, 30), plasticDark, [0, STEEL + BODY_H - .02, 0], { rot: [Math.PI / 2, 0, 0] }));
  // miệng thùng: thành trong (tối) + mặt nước
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(BODY_R - .05, BODY_R - .05, BODY_H - .05, 30, 1, true),
    toon('#3c4450', { side: THREE.BackSide }));
  inner.position.set(0, STEEL + BODY_H / 2, 0); group.add(inner);
  // Mặt nước ban đêm phải là MẢNH TỐI có lấp lánh nhẹ, không phải một vùng
  // sáng trắng: cảnh cận chân trời (c35/c37) là bầu trời, nên trời phải là
  // chỗ sáng nhất, không phải mặt nước.
  const water = mesh(new THREE.CircleGeometry(BODY_R - .055, 34),
    toon(night ? '#3f6a9e' : waterCol, { emissive: new THREE.Color(waterCol).multiplyScalar(red ? .85 : night ? .18 : .70) }),
    [0, STEEL + BODY_H - .04, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  group.add(water);
  // vệt nắng hắt trên mặt nước (Mặt Trời thấp phản chiếu thành một vệt sáng).
  // Ban đêm vệt này phải nhạt và lạnh: nó hứa lấy màu trời chứ không tự sáng.
  const glint = mesh(new THREE.PlaneGeometry(.60, .16),
    toon(night ? '#b9cdf0' : '#fff0d0',
      { emissive: new THREE.Color(night ? '#7d9ed8' : '#ffcf8a').multiplyScalar(night ? .30 : red ? 1.8 : 1.4),
        transparent: true, opacity: night ? .45 : .92 }),
    [0, STEEL + BODY_H - .025, -.10], { rot: [-Math.PI / 2, 0, 0], cast: false });
  group.add(glint);
  group.add(mesh(rbox(.10, .10, .16, .02), toon('#4a5568'), [0, STEEL + BODY_H + .01, -BODY_R]));   // bản lề
  // thang leo bám vào thân thùng
  const lad = new THREE.Group(); lad.position.set(BODY_R + .15, 0, .18); lad.rotation.z = -.10;
  for (const dz of [-.16, .16]) lad.add(mesh(new THREE.CylinderGeometry(.028, .028, STEEL + BODY_H + .16, 8), toon('#5e6875'), [0, (STEEL + BODY_H + .16) / 2, dz]));
  for (let i = 0; i < 5; i++) lad.add(mesh(new THREE.CylinderGeometry(.022, .022, .34, 8), toon('#6f7a88'), [0, .20 + i * .21, 0], { rot: [Math.PI / 2, 0, 0] }));
  group.add(lad);
  // vòi lấy nước
  group.add(mesh(new THREE.CylinderGeometry(.035, .035, .28, 8), toon('#5e6875'), [.16, .20, BODY_R + .04], { rot: [Math.PI / 2, 0, 0] }));
  group.add(mesh(new THREE.CylinderGeometry(.022, .022, .13, 8), toon('#5e6875'), [.16, .13, BODY_R + .16]));
  group.add(mesh(new THREE.TorusGeometry(.055, .015, 6, 14), toon(PAL.red), [.16, .26, BODY_R + .11], { rot: [Math.PI / 2, 0, 0] }));

  // nắp: đã tháo ra, nằm sát đất cạnh thùng → miệng thùng mở, thấy mặt nước
  const lid = new THREE.Group();
  lid.position.set(-(BODY_R + .44), .035, .40);
  lid.rotation.set(Math.PI / 2, 0, .38);
  lid.add(mesh(new THREE.CylinderGeometry(BODY_R + .03, BODY_R + .03, .06, 30), toon('#8e99a6'), [0, .03, 0]));
  lid.add(mesh(new THREE.TorusGeometry(BODY_R + .03, .026, 8, 30), toon('#6f7a88'), [0, .005, 0], { rot: [Math.PI / 2, 0, 0] }));
  lid.add(mesh(new THREE.CylinderGeometry(.055, .055, .07, 10), toon('#6f7a88'), [0, .075, 0]));
  return { group, lid, water, glint };
}

export const PROP = {
  name: 'thùng nước có nắp tháo, thang leo và vòi',
  view: () => {
    const p = thungNuoc();
    p.group.add(p.lid);        // trong phim nắp nằm riêng; ảnh ba phía đặt cạnh thùng
    return p.group;
  },
};
