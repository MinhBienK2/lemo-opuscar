// Đồng hồ 24 giờ treo tường: mặt tròn có 24 vạch giờ, một dải giờ tô đậm là
// buổi chiều (giờ buồn ngủ), và một kim đen chỉ giờ hiện tại.
import * as THREE from 'three';
import { PAL, toon, canvasTex, rbox, mesh, clamp, lerp } from '../../../../../rig/kit.js';

const matMat = () => canvasTex(1024, 1024, (g, w, h) => {
  const cx = w / 2, cy = h / 2, R = w * .47;
  g.fillStyle = '#f4efe1'; g.fillRect(0, 0, w, h);
  g.beginPath(); g.arc(cx, cy, R, 0, 7); g.fill();
  // dải giờ buồn ngủ: 13 giờ tới 17 giờ (nửa dưới mặt đồng hồ)
  const a0 = (13 / 24) * Math.PI * 2 - Math.PI / 2, a1 = (17 / 24) * Math.PI * 2 - Math.PI / 2;
  g.beginPath(); g.arc(cx, cy, R * .88, a0, a1); g.lineWidth = R * .17;
  g.strokeStyle = 'rgba(154,91,229,.35)'; g.stroke();
  // vạch giờ: vạch lớn ở 0, 6, 12, 18
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const big = i % 6 === 0;
    const r1 = R * .96, r0 = R * (big ? .80 : .87);
    g.strokeStyle = big ? '#2c3152' : 'rgba(44,49,82,.55)';
    g.lineWidth = big ? 12 : 6;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    g.stroke();
  }
  g.fillStyle = '#2c3152'; g.font = '700 54px "Be Vietnam Pro"'; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const [i, t] of [[0, '0'], [6, '6'], [12, '12'], [18, '18']]) {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2, r = R * .68;
    g.fillText(t, cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  g.font = '700 44px "Be Vietnam Pro"'; g.fillStyle = '#7a4fc0';
  g.fillText('BUỔI CHIỀU', cx, cy + R * .40);
});

export function dongHo24Gio() {
  const g = new THREE.Group();
  // tấm treo gỗ
  g.add(mesh(rbox(0.62, 0.62, 0.05, 0.02), toon('#8a5a34'), [0, 0, -0.045]));
  // mặt đồng hồ
  const face = mesh(new THREE.CircleGeometry(0.30, 48), toon('#ffffff', { map: matMat() }), [0, 0, 0.001]);
  g.add(face);
  // vòng viền
  g.add(mesh(new THREE.TorusGeometry(0.305, 0.028, 12, 48), toon(PAL.navy), [0, 0, 0.012]));
  // kim đen, quay theo giờ
  const hand = new THREE.Group(); g.add(hand);
  hand.add(mesh(rbox(0.022, 0.24, 0.012, 0.004), toon('#20233c'), [0, 0.10, 0.028]));
  hand.add(mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 14), toon(PAL.red), [0, 0, 0.032], { rot: [Math.PI / 2, 0, 0] }));
  // kim chỉ giờ: 0 giờ ở trên, quay theo chiều kim đồng hồ
  g.setHour = (h = 15) => { hand.rotation.z = -(h / 24) * Math.PI * 2; };
  g.setHour(15);
  return g;
}

export const PROP = { name: 'đồng hồ 24 giờ treo tường', view: () => dongHo24Gio() };
