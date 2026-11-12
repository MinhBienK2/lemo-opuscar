// Đồng hồ đo phần trăm: mặt tròn, có kim chỉ, đo phần trăm màu còn lại.
//
// Mỗi mặt có một vòng hai mươi chấm (mỗi chấm một phần trăm rưỡi), các chấm
// đã đếm được sáng lên, và kim chỉ đứng đúng ở chấm cuối cùng. Hai cái
// giống nhau y hệt nên so sánh được với nhau.
import * as THREE from 'three';
import { toon, canvasTex, mesh, fxLayer, mulberry } from '../../../../../rig/kit.js';

// vòng chấm, độ giữa hai chấm (140° cho 20 chấm), và góc của vạch 0 %
export const DIAL = { RING: .245, STEP: 7.37, A0: 160 };

// mặt đồng hồ: giấy dày, có vân nhẹ
export function dialFace() {
  return canvasTex(256, 256, (c, w, h) => {
    const grd = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    grd.addColorStop(0, '#fffaec'); grd.addColorStop(1, '#efe6d0');
    c.fillStyle = grd; c.fillRect(0, 0, w, h);
    const r = mulberry(7);
    for (let k = 0; k < 4000; k++) {
      c.fillStyle = `rgba(90,80,55,${r() * .07})`; c.fillRect(r() * w, r() * h, 3, 2);
    }
  });
}

export function dongHoDoPhanTram(opts = {}) {
  const {
    center = { x: 0, y: 0 }, percent = 15, color = '#ff6a4a',
    wire = 0, face = null,
  } = opts;
  const { RING, STEP, A0 } = DIAL;
  const g = new THREE.Group(); g.name = 'đồng hồ đo phần trăm';
  g.position.set(center.x, center.y, .60);

  const faceTex = face || dialFace();

  const acc = new THREE.Color(color);
  const nLit = Math.round(percent / 1.25);      // số chấm đã đếm được
  const aEnd = (A0 - (percent / 1.25) * STEP) * Math.PI / 180;  // kim ở vạch đang đọc
  g.add(mesh(new THREE.CircleGeometry(.30, 48),
    toon('#ffffff', { map: faceTex, emissive: new THREE.Color('#4a4230') }), [0, 0, 0], { cast: false }));
  g.add(mesh(new THREE.CylinderGeometry(.325, .325, .09, 40), toon('#98a0ba'), [0, 0, -.055], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.TorusGeometry(.315, .028, 12, 48), toon('#d3d8e6'), [0, 0, .005], { cast: false }));
  // cung vạch 0–25 % khắc trên mặt đồng hồ
  const arc = new THREE.Mesh(new THREE.RingGeometry(RING - .040, RING + .040, 60, 1,
    (A0 - 19 * STEP) * Math.PI / 180, 19 * STEP * Math.PI / 180),
    new THREE.MeshBasicMaterial({ color: '#b9bece', transparent: true, opacity: .85, toneMapped: false }));
  arc.position.z = .012;
  fxLayer(arc);
  g.add(arc);
  // phần đã đo được: một mảng cung màu tính từ 0 % tới kim chỉ
  const filled = new THREE.Mesh(new THREE.RingGeometry(RING - .038, RING + .038, 40, 1,
    aEnd, (A0 * Math.PI / 180) - aEnd),
    new THREE.MeshBasicMaterial({
      color: acc.clone().multiplyScalar(.9), transparent: true, opacity: .40,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
  filled.position.z = .014;
  fxLayer(filled);
  g.add(filled);
  for (let v = 0; v < 20; v++) {
    const a = (A0 - v * STEP) * Math.PI / 180;
    const lit = v < nLit;
    g.add(mesh(new THREE.SphereGeometry(lit ? .030 : .017, 12, 10),
      lit ? toon(color, { emissive: acc.clone().multiplyScalar(1.35) }) : toon('#b9bed0'),
      [Math.cos(a) * RING, Math.sin(a) * RING, .035], { cast: false }));
  }
  // kim chỉ: đi từ tâm tới đúng vạch đang đọc, có đuôi đối trọng
  const nGeo = new THREE.BoxGeometry(RING + .06, .020, .013);
  nGeo.translate((RING + .06) / 2 - .06, 0, 0);
  const needle = mesh(nGeo, toon('#2b2f47'), [0, 0, .022], { cast: false });
  needle.rotation.z = aEnd;
  g.add(needle);
  g.add(mesh(new THREE.CylinderGeometry(.034, .034, .045, 16), toon('#dde1ee'), [0, 0, .032], { rot: [Math.PI / 2, 0, 0], cast: false }));
  // dây treo mặt đồng hồ
  if (wire > 0) {
    g.add(mesh(new THREE.CylinderGeometry(.010, .010, wire, 6), toon('#8f95b0'), [0, .35 + wire / 2, .02], { cast: false }));
  }
  g.add(mesh(new THREE.TorusGeometry(.05, .013, 8, 16), toon('#8f95b0'), [0, .34, .02], { rot: [Math.PI / 2, 0, 0], cast: false }));
  g.userData.parts = { needle, filled };
  return g;
}

// Ảnh vật: một mặt đồng hồ, mũi kim ở vạch 15 %.
export const PROP = {
  name: 'đồng hồ đo phần trăm',
  view: () => dongHoDoPhanTram({ percent: 15, color: '#ff6a4a' }),
};
