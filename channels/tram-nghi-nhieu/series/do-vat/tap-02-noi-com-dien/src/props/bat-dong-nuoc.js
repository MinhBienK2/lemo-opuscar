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
    // vào bát để xem lại lượng nước. Vạch số 3 phải nằm NGAY DƯỚI mép mặt
    // nước mà người xem thấy, thì câu mới đọc ra là "nước tới vạch 3".
    // Mép nước người xem thấy luôn nằm CAO HƠN mực nước thật (vì máy quay
    // nhìn xuống, mép nước ta thấy là mép ở phía xa của bát), nên số 3 phải
    // in ở sát miệng bát thay vì đúng cao độ mực nước.
    c.strokeStyle = '#4e6470'; c.fillStyle = '#3f5566'; c.lineWidth = 4;
    c.textAlign = 'left'; c.textBaseline = 'middle';
    // Chỗ các vạch trên tờ: hồ sơ lathe có 9 điểm, v = j/8, hàng 512 ứng với
    // v = 0 (đáy bát), hàng 256 là miệng bát. Số 3 ở hàng 266 (sát miệng),
    // số 2 ở hàng 290, số 1 ở hàng 318.
    for (const [n, y] of [[3, 264], [2, 290], [1, 318]]) {
      // Vạch kẻ ngay cạnh số, chứ không kẻ xa: thành bát cong, vạch ở xa
      // hơn sẽ lệch cao độ trên màn hình so với số nó đi kèm.
      c.beginPath(); c.moveTo(120, y); c.lineTo(133, y); c.stroke();
      c.font = 'bold 24px sans-serif';
      c.fillText(String(n), 140, y);
    }
  });
  const bowlMat = toon('#ffffff', { map: tex });
  // bát nhỏ để rót: cho ruột bát sáng lên, để người xem thấy đây là một cái bát có
  // miệng và có ruột, chứ không phải một khối trụ trắn có lỗ đen
  if (!marks) bowlMat.emissive = new THREE.Color('#3a4048');
  g.add(mesh(new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0], p[1])), 40), bowlMat));

  // Mặt nước trong bát. Bán kính mặt nước phải khớp với bán kính ruột bát
  // đúng tại cao độ mực nước, nếu rộng hơn thì nước trồi ra ngoài thành.
  const wet = new THREE.Group(); g.add(wet);
  const WATER_H = H * .72;
  const water = mesh(new THREE.CircleGeometry(R * .875, 36), toon('#8fd3e8', { transparent: true, opacity: .82 }),
    [0, WATER_H, 0], { rot: [-Math.PI / 2, 0, 0] });
  wet.add(water);
  // Không vẽ gợn sóng trên mặt nước: ở cỡ này vài cung tròn đọc ra như một vệt
  // trắng vẽ vòng trên mặt nước, không phải gợn sóng. Mặt nước phẳng màu
  // xanh nhạt đọc ra là nước rõ hơn.
  // khi rót thì nước trong bát biến mất, thay bằng dòng nước bên ngoài
  g.setWater = v => { wet.visible = v; };
  g.rim = H;                         // chiều cao miệng bát
  return g;
}

export const PROP = { name: 'bát đong nước', view: () => batDongNuoc() };
