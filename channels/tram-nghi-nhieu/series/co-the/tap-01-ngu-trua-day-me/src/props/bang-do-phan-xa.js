// Bảng đo phản xạ: một bảng gỗ nghiêng có lưới đèn tròn (mỗi đèn là một lần
// đo), một đồng hồ kim, một nút đỏ và một đèn xanh báo cảm nhận của người đo.
import * as THREE from 'three';
import { PAL, toon, canvasTex, rbox, mesh, clamp, lerp } from '../../../../../rig/kit.js';

// mặt bảng: lưới tròn in sẵn, chữ nhỏ của thang đo
const matLuoi = () => canvasTex(512, 384, (g, w, h) => {
  g.fillStyle = '#efe7d2'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(60,50,40,.18)'; g.lineWidth = 2;
  for (let y = 0; y < h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.strokeStyle = 'rgba(60,50,40,.35)'; g.lineWidth = 3;
  for (let x = 0; x < w; x += 102) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  // tiêu đề nằm trên dải trống phía trên lưới đèn, không để đèn cắt chữ.
  // Chữ hạ xuống thấp một chút: dấu hỏi của Ả vươn cao hơn chữ hoa, đặt
  // chữ sát mép trên thì dấu bị cắt mất, và "PHẢN" thành "PHAN".
  g.fillStyle = '#3b4266'; g.font = '700 38px "Be Vietnam Pro"';
  g.fillText('ĐO PHẢN XẠ', 14, 44);
});

export function bangDoPhanXa({ cols = 4, rows = 4 } = {}) {
  const g = new THREE.Group();
  const woodTex = (() => { const t = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#a9713f'; c.fillRect(0, 0, w, h); for (let k = 0; k < 900; k++) { c.fillStyle = `rgba(90,50,20,${Math.random() * .18})`; c.fillRect(Math.random() * w, Math.random() * h, 3, 2); } }); return t; })();
  const wood = toon('#ffffff', { map: woodTex });
  const woodDark = toon('#b8a488', { map: woodTex });
  const cream = toon(PAL.cream), navy = toon(PAL.navy), red = toon(PAL.red);

  // chân đế
  g.add(mesh(rbox(0.66, 0.06, 0.40, 0.02), wood, [0, 0.03, 0]));
  // mặt đế dưới: gỗ sẫm có vân, không phải một mảng navy trơn
  g.add(mesh(rbox(0.62, 0.03, 0.36, 0.01), woodDark, [0, 0.065, 0]));

  // mặt bảng nghiêng
  const tilt = -0.42;
  const panel = new THREE.Group(); panel.position.set(0, 0.09, -0.05); panel.rotation.x = tilt; g.add(panel);
  panel.add(mesh(rbox(0.64, 0.42, 0.035, 0.015), wood, [0, 0.19, 0]));
  panel.add(mesh(rbox(0.58, 0.36, 0.012, 0.008), toon('#ffffff', { map: matLuoi() }), [0, 0.19, 0.022]));

  // lưới đèn tròn: mỗi đèn là một lần đo
  const lamps = [];
  const on = toon('#ffe9a8', { emissive: '#ffca63', emissiveIntensity: .26 });
  const off = toon('#6b6f8c');
  for (let i = 0; i < cols * rows; i++) {
    const cx = (i % cols - (cols - 1) / 2) * 0.088;
    const cy = 0.28 - Math.floor(i / cols) * 0.078;
    const m = mesh(new THREE.SphereGeometry(0.026, 16, 12), on.clone(), [cx, cy, 0.038]);
    m.material = on.clone();
    panel.add(m);
    const ring = mesh(new THREE.TorusGeometry(0.030, 0.007, 8, 20), navy, [cx, cy, 0.032]);
    panel.add(ring);
    lamps.push(m);
  }

  // đồng hồ kim: mặt tròn, vạch, kim
  const dial = new THREE.Group(); dial.position.set(0.215, 0.185, 0.036); panel.add(dial);
  dial.add(mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.02, 28), cream, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  dial.add(mesh(new THREE.TorusGeometry(0.076, 0.009, 8, 28), navy, [0, 0, 0.012]));
  for (let i = 0; i <= 10; i++) {
    const a = (-125 + i * 25) * Math.PI / 180;
    dial.add(mesh(rbox(0.008, 0.022, 0.006, 0.002), navy, [Math.sin(a) * 0.058, Math.cos(a) * 0.058, 0.014], { rot: [0, 0, -a] }));
  }
  const needle = mesh(rbox(0.010, 0.062, 0.006, 0.002), red, [0, 0.030, 0.016]);
  const needlePivot = new THREE.Group(); needlePivot.position.z = 0.014; needlePivot.add(needle); dial.add(needlePivot);
  dial.add(mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.012, 12), navy, [0, 0, 0.018], { rot: [Math.PI / 2, 0, 0] }));

  // nút đỏ lớn
  const btn = mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.028, 20), red, [-0.215, 0.075, 0.05], { rot: [Math.PI / 2, 0, 0] });
  panel.add(btn);
  panel.add(mesh(new THREE.TorusGeometry(0.052, 0.008, 8, 22), navy, [-0.215, 0.075, 0.038]));

  // đèn xanh: cảm nhận của người đo
  const green = mesh(new THREE.SphereGeometry(0.028, 16, 12), toon('#3f8a3a'), [0.215, 0.075, 0.05]);
  panel.add(green);
  panel.add(mesh(new THREE.TorusGeometry(0.032, 0.007, 8, 20), navy, [0.215, 0.075, 0.038]));

  // ── trạng thái ──
  // k = 0…1: bao nhiêu phần đèn đã tắt (phản xạ tụt dần)
  g.setLamps = (k = 0) => {
    const n = Math.round(clamp(k) * lamps.length);
    lamps.forEach((m, i) => {
      m.material = i < n ? off : on;
      m.material.emissiveIntensity = i < n ? 0 : .26;
      m.material.needsUpdate = true;
    });
  };
  // k = 0…1: kim chỉ (0 là cao, 1 là thấp hẳn)
  g.setNeedle = (k = 0) => { needlePivot.rotation.z = lerp(0, -125 * Math.PI / 180, clamp(k)); };
  // k = 0…1: đèn xanh sáng lên
  g.setGreen = (k = 0) => {
    const c = clamp(k);
    green.material.color.set('#3f8a3a').lerp(new THREE.Color('#8bff7a'), c);
    green.material.emissive = new THREE.Color('#8bff7a');
    green.material.emissiveIntensity = c * .9;
    green.material.needsUpdate = true;
  };
  g.setLamps(0); g.setNeedle(0); g.setGreen(0);
  g.lamps = lamps; g.needle = needlePivot; g.green = green; g.button = btn; g.dial = dial;
  return g;
}

export const PROP = { name: 'bảng đo phản xạ', view: () => bangDoPhanXa() };
