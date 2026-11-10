// Tế bào thần kinh: thân có nhân, chùm nhánh, một sợi trục có myelin và các củ
// ở cuối — củ tế bào là nơi phân tử được thả ra vào khe.
//
// Sợi trục và lớp myelin được phủ vân sợi và tách màu: một ống tím trơn một
// mảng không có đường viền mực, đọc ra là một thanh plastic chứ không phải
// một sợi trục có dây.
import * as THREE from 'three';
import { neuron } from '../../../../../rig/brain.js';
import { toon, canvasTex, mulberry, mesh } from '../../../../../rig/kit.js';

// vân sợi: sợi nhỏ chạy dọc theo thân sợi
const axonTex = () => canvasTex(256, 256, (g, w, h) => {
  const r = mulberry(11);
  g.fillStyle = '#9a5be5'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) {
    g.strokeStyle = `rgba(${175 + r() * 60 | 0},${125 + r() * 60 | 0},240,${.10 + r() * .22})`;
    g.lineWidth = 1 + r() * 3;
    const x = r() * w;
    g.beginPath(); g.moveTo(x, 0);
    for (let y = 0; y <= h; y += 32) g.lineTo(x + Math.sin(y * .03 + i) * 5, y);
    g.stroke();
  }
  for (let i = 0; i < 26; i++) {          // lỗ chân tăm trên vỏ sợi
    const x = r() * w, y = r() * h;
    g.fillStyle = 'rgba(58,32,110,.30)';
    g.beginPath(); g.arc(x, y, 2 + r() * 4, 0, 6.3); g.fill();
  }
});

// da thân tế bào: hồng nhạt lấm tấm
const somaTex = () => canvasTex(256, 256, (g, w, h) => {
  const r = mulberry(17);
  g.fillStyle = '#eec6b0'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 260; i++) {
    const x = r() * w, y = r() * h;
    g.fillStyle = `rgba(${180 + r() * 50 | 0},${100 + r() * 50 | 0},${100 + r() * 40 | 0},${.10 + r() * .18})`;
    g.beginPath(); g.arc(x, y, 2 + r() * 7, 0, 6.3); g.fill();
  }
});

export function teBaoThanKinh({ size = 3, seed = 5, dendrites = 5 } = {}) {
  const g = neuron({ size, seed, dendrites, soma: '#eec6b0', dend: '#c9a48f', axon: '#9a5be5' });
  const tex = axonTex();
  const fib = toon('#ffffff', { map: tex });
  const sheath = toon('#c9a6ff', { map: tex });
  const skin = toon('#ffffff', { map: somaTex() });
  // Thân sợi của tế bào thần kinh dựng sẵn quá dày: ở cận cảnh nó chiếm
  // góc khung như một tấm tím trơn. Ở đây thân sợi được dựng lại mảnh đi, để
  // nó đọc ra là một SỢI có dây, và bầu myelin thành những hạt rõ ràng.
  let curve = null;
  g.traverse(o => {
    if (!o.isMesh) return;
    const gt = o.geometry?.type, p = o.geometry?.parameters || {};
    if (gt === 'TubeGeometry') {
      curve = o.geometry.parameters.path;
      o.visible = false;                                     // thân sợi cũ: dựng lại mảnh
    } else if (gt === 'CapsuleGeometry' && (p.radius ?? 0) > .04) o.visible = false;  // myelin cũ: dựng lại
    else if (gt === 'IcosahedronGeometry') o.material = skin;        // thân tế bào: có da
    else if (gt === 'SphereGeometry' && (p.radius ?? 1) < .05) o.visible = false;    // củ cuối: đã có đồ riêng
  });
  const C = curve ?? g.curve;
  g.add(mesh(new THREE.TubeGeometry(C, 48, .015, 12, false), fib));
  g.curve = C;
  // ── myelin: các đoạn vỏ mỡ nằm rải rác trên sợi trục, CÓ KHE HỞ ──────
  // Một ống liền là một ống nhựa; sợi trục thật là những đoạn bọc mỡ cách
  // nhau, và khe hở là nơi tín hiệu nhảy qua.
  const P = new THREE.Vector3(), T = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion();
  const N = 6;
  for (let i = 1; i <= N; i++) {
    const u = i / (N + 1);
    C.getPoint(u, P); C.getTangent(u, T);
    const cap = mesh(new THREE.CapsuleGeometry(.030, .052, 4, 12), sheath, [0, 0, 0]);
    cap.position.copy(P);
    q.setFromUnitVectors(up, T);
    cap.quaternion.copy(q);
    g.add(cap);
  }
  g.name = 'te-bao-than-kinh';
  return g;
}

export const PROP = { name: 'tế bào thần kinh', view: () => teBaoThanKinh() };
