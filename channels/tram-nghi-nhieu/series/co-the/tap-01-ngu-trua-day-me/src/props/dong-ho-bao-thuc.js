// Đồng hồ báo thức: mặt số tròn, hai chuông trên đỉnh, hai chân sau.
// Khi reo, cả cái đồng hồ rung nhẹ và hai chuông lắc.
import * as THREE from 'three';
import { PAL, toon, rbox, mesh, canvasTex } from '../../../../../rig/kit.js';
import { clock } from '../../../../../rig/sets.js';

export function dongHoBaoThuc({ color = PAL.red } = {}) {
  const g = new THREE.Group();
  const M = { cream: toon(PAL.cream), red: toon(color), navy: toon(PAL.navy), brass: toon('#c9973a') };

  // mặt số (đồng hồ của rig, quay về phía +z)
  const face = clock(M);
  face.position.y = 0.26;
  g.add(face);

  // số trên mặt số: đồng hồ của rig chỉ có vạch, nhưng một mặt số trống
  // không cho người xem biết đó là số mấy — in số 1…12 lên một đĩa mỏng
  // đè lên mặt đồng hồ.
  const nums = canvasTex(256, 256, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    c.fillStyle = '#1d2136';
    c.font = '700 30px "Be Vietnam Pro"';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) {
      const a = i / 12 * Math.PI * 2;
      c.fillText(String(i), w / 2 + Math.sin(a) * w * .34, h / 2 - Math.cos(a) * h * .34);
    }
  });
  const numPlate = mesh(new THREE.CircleGeometry(.20, 40), toon('#ffffff', { map: nums, transparent: true }), [0, 0.26, .047]);
  numPlate.material.depthWrite = false;
  g.add(numPlate);

  // hai chuông trên đỉnh: nửa cầu úp xuống, và một thanh nối
  const bell = new THREE.Group(); bell.position.set(0, 0.44, 0.0); g.add(bell);
  bell.add(mesh(new THREE.SphereGeometry(0.115, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.red, [-0.135, 0, 0]));
  bell.add(mesh(new THREE.SphereGeometry(0.115, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.red, [0.135, 0, 0]));
  bell.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 10), M.brass, [0, 0.03, 0], { rot: [0, 0, Math.PI / 2] }));
  bell.add(mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.10, 10), M.brass, [0, -0.02, 0]));

  // hai chân sau
  for (const sx of [-1, 1]) {
    g.add(mesh(rbox(0.05, 0.13, 0.09, 0.015), M.red, [sx * 0.13, 0.03, -0.03], { rot: [0.22, 0, 0] }));
  }
  // nút chỉnh phía sau
  g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 12), M.brass, [0, 0.26, -0.05], { rot: [Math.PI / 2, 0, 0] }));

  // dấu hiệu rung: hai vòng cung nở ra từ đỉnh chuông khi đồng hồ reo — không có
  // dấu hiệu này thì lời kể "đồng hồ reo" không có gì để nhìn. Hai vòng cung
  // cùng tâm ở đỉnh chuông, mở ra hai bên như sóng âm.
  const arcs = new THREE.Group(); arcs.position.set(0, .46, 0); arcs.visible = false; g.add(arcs);
  const arcM = toon(PAL.mustard);
  // vòng cung bám đúng đỉnh mỗi chuông: vòng trái mở lên-trái, vòng phải
  // mở lên-phải, như hai sóng âm toả ra từ chuông.
  const arcL = mesh(new THREE.TorusGeometry(.105, .013, 8, 20, Math.PI * .42), arcM, [-.135, 0, 0], { rot: [0, 0, Math.PI * .58] });
  const arcR = mesh(new THREE.TorusGeometry(.105, .013, 8, 20, Math.PI * .42), arcM, [.135, 0, 0], { rot: [0, 0, Math.PI * .00] });
  arcs.add(arcL, arcR);

  // reo: cả cái đồng hồ rung, hai chuông lắc theo hai pha khác nhau.
  // Vị trí gốc của đồng hồ được chốt lại ở lần reo đầu tiên: lắc thì lệch so với
  // chỗ nó đứng, không phải nhảy về gốc toạ độ.
  let base = null;
  g.ring = (t, k = 1) => {
    if (!base) base = g.position.clone();
    const s = k * 0.011;
    g.position.x = base.x + Math.sin(t * 47) * s;
    g.position.y = base.y + Math.sin(t * 61) * s * 0.6;
    bell.rotation.z = Math.sin(t * 43) * s * 2.2;
    bell.rotation.x = Math.sin(t * 53) * s * 1.6;
    // hai vòng cung cùng nở ra khi chuông reo, lớn dần theo nhịp
    arcs.visible = k > .01;
    const gr = 1 + .16 * Math.abs(Math.sin(t * 26));
    arcL.scale.setScalar(gr); arcR.scale.setScalar(gr);
    arcL.position.x = -.012 * Math.sin(t * 26); arcR.position.x = .012 * Math.sin(t * 26);
  };
  g.hands = face.hands;
  g.face = face;
  g.bell = bell;
  g.tick = (t, hours) => face.tick(t, hours);
  return g;
}

export const PROP = { name: 'đồng hồ báo thức', view: () => dongHoBaoThuc() };
