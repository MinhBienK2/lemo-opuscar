// Bát đong nước: một bát nhựa có vạch chia vôi in trên thành, nước đầy trong bát.
import * as THREE from 'three';
import { toon, canvasTex, mesh, fxLayer } from '../../../../../rig/kit.js';

export function batDongNuoc(opts = {}) {
  const g = new THREE.Group();
  const R = opts.R || .090, H = opts.H || .105;
  const marks = opts.marks !== false;

  // thành bát: một nón cấp, dày ở đáy
  const prof = [[0, 0], [R * .55, 0], [R * .70, .006], [R * .86, H * .45], [R, H], [R - .006, H], [R * .84, H * .45], [R * .68, .010], [0, .010]];
  const tex = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = '#eef2f4'; c.fillRect(0, 0, w, h);
    if (!marks) {
      // bát nhỏ để rót: trơn trơn, không vạch không chữ — ở cỡ này mấy nét trên thân
      // đọc như chữ viết bậy, trong khi ruột bát phải là thứ người xem thấy
      return;
    }
    // Vạch chia nằm trên thành ngoài, ở phía gần máy quay: câu cuối tập trỏ
    // vào bát để xem lại lượng nước, và vạch phải nằm ở chỗ máy quay nhìn
    // thấy được. Vạch in sâu trong ruột bát thì mặt nước che mất.
    c.strokeStyle = '#4e6470'; c.fillStyle = '#4e6470'; c.lineWidth = 6;
    c.font = 'bold 44px sans-serif'; c.textAlign = 'left'; c.textBaseline = 'middle';
    for (let i = 1; i <= 4; i++) {
      const y = h * .82 - i * h * .068;
      c.beginPath(); c.moveTo(68, y); c.lineTo(144, y); c.stroke();
      c.fillText(String(i), 156, y);
    }
  });
  const bowlMat = toon('#ffffff', { map: tex });
  // bát nhỏ để rót: cho ruột bát sáng lên, để người xem thấy đây là một cái bát có
  // miệng và có ruột, chứ không phải một khối trụ trắn có lỗ đen
  if (!marks) bowlMat.emissive = new THREE.Color('#3a4048');
  g.add(mesh(new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0], p[1])), 40), bowlMat));

  // mặt nước trong bát
  const wet = new THREE.Group(); g.add(wet);
  const water = mesh(new THREE.CircleGeometry(R * .86, 36), toon('#8fd3e8', { transparent: true, opacity: .82 }),
    [0, H * .72, 0], { rot: [-Math.PI / 2, 0, 0] });
  wet.add(water);
  // Gợn sóng trên mặt nước phải lệch tâm và méo, không được là ba vòng đồng
  // tâm: ba vòng tròn đồng tâm đọc ra như một cái mục tiêu bắn vào, không phải
  // mặt nước.
  for (const [i, k] of [[0, .30], [1, .52]]) {
    const t = mesh(new THREE.TorusGeometry(R * k, .0018, 6, 40), toon('#cdeef8'),
      [R * (i ? .07 : -.05), H * .72 + .001, R * (i ? .05 : -.03)], { rot: [Math.PI / 2, 0, 0] });
    t.scale.set(1, .74, 1);
    wet.add(t);
  }
  // khi rót thì nước trong bát biến mất, thay bằng dòng nước bên ngoài
  g.setWater = v => { wet.visible = v; };
  g.rim = H;                         // chiều cao miệng bát
  return g;
}

export const PROP = { name: 'bát đong nước', view: () => batDongNuoc() };
