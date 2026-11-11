// Bát đong nước: một bát nhựa có vạch chia vôi in trên thành, nước đầy trong bát.
import * as THREE from 'three';
import { toon, canvasTex, mesh, fxLayer, clamp } from '../../../../../rig/kit.js';

// ── vật tự biết mình đang ở câu nào, và lúc nào có tiếng ────────────────
// film.js đặt sẵn window.EV: mỗi câu kể có một sự kiện 'voice' (mốc đầu
// câu), và mỗi tiếng hiệu ứng có sự kiện của riêng nó ('cup_set' là lúc bát
// đặt xuống bàn). Vật đọc thẳng hai thứ đó, nên không phải gõ tay mốc thời
// gian vào trong vật.
function lineStart(id) {
  const ev = window.EV || [];
  for (const e of ev) if (e.type === 'voice' && e.id === id) return e.t;
  return null;
}
function evTime(type) {
  const ev = window.EV || [];
  for (const e of ev) if (e.type === type) return e.t;
  return null;
}

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
  // Thân bát nằm trong một bản lề ở mép đáy: bát lắc trên đáy thì nó xoay quanh
  // mép đáy (đúng như một cái bát đặt xuống rồi lắc), nên không bao giờ có
  // chỗ nào của bát cắm xuống mặt bàn.
  const pivot = new THREE.Group();
  pivot.position.x = R * .55;
  g.add(pivot);
  const body = mesh(new THREE.LatheGeometry(prof.map(p => new THREE.Vector2(p[0], p[1])), 40), bowlMat);
  body.position.x = -R * .55;
  pivot.add(body);

  // Mặt nước trong bát. Bán kính mặt nước phải khớp với bán kính ruột bát
  // đúng tại cao độ mực nước, nếu rộng hơn thì nước trồi ra ngoài thành.
  //
  // Mặt nước nằm trong nhóm RIÊNG, không nằm trong nhóm của thành bát: bát có
  // thể lắc, nhưng nước luôn nằm ngang — nước không đi theo bát nghiêng.
  const wet = new THREE.Group(); g.add(wet);
  const tilt = new THREE.Group(); wet.add(tilt);
  const WATER_H = H * .72;               // vạch "2"
  const LEVEL3 = H * .93;                // vạch "3" — mực nước câu lời khuyên
  const water = mesh(new THREE.CircleGeometry(R * .875, 36), toon('#8fd3e8', { transparent: true, opacity: .82 }),
    [0, 0, 0], { rot: [-Math.PI / 2, 0, 0] });
  tilt.add(water);
  // Không vẽ gợn sóng trên mặt nước: ở cỡ này vài cung tròn đọc ra như một vệt
  // trắng vẽ vòng trên mặt nước, không phải gợn sóng. Mặt nước phẳng màu
  // xanh nhạt đọc ra là nước rõ hơn.
  // khi rót thì nước trong bát biến mất, thay bằng dòng nước bên ngoài
  let waterOn = true;
  g.setWater = v => { waterOn = !!v; wet.visible = waterOn; };
  g.rim = H;                         // chiều cao miệng bát

  // bán kính ruột bát ở cao độ y: thành bát loe dần, mặt nước phải loe theo
  const innerR = y => {
    if (y <= H * .45) {
      const t = clamp((y - .010) / (H * .45 - .010));
      return R * (.68 + .16 * t);
    }
    const t = clamp((y - H * .45) / (H - H * .45));
    return R * (.84 + ((R - .006) / R - .84) * t);
  };
  // đặt mặt nước: cao độ y, mặt nước nghiêng th (đơn vị rad), bát nghiêng
  // rock. Mặt nước phải nằm gọn trong thành bát: bát nghiêng thì ở bên cao
  // thành bát sát miệng hơn, nên mặt nước phải nhỏ lại.
  const setSurface = (y, th, rock = 0) => {
    const rel = th - rock;                       // nghiêng của mặt nước so với bát
    const s = Math.abs(Math.sin(rel));
    const c = Math.max(.25, Math.cos(th));
    let r = innerR(y) - .0015;
    for (let i = 0; i < 4; i++) {
      const need = (innerR(y - r * s) - .0015) / c;
      if (need < r) r = need;
    }
    wet.position.y = y;
    tilt.rotation.z = th;
    const k = r / (R * .875);
    water.scale.set(k, k, 1);
  };
  setSurface(WATER_H, 0, 0);

  // ── nhịp của bát ──────────────────────────────────────────────────────
  // Có tiếng "bát đặt xuống" (tiếng bát chạm bàn) thì bát phải lắc: nó
  // đặt xuống hơi mạnh, lắc lư trên đáy rồi đứng yên. Nước trong bát thì
  // VẪN NẰM NGANG — nước không đi theo bát nghiêng — nên mặt nước trượt
  // sang một bên trong miệng bát. Đó là cách người xem đọc ra cái lắc.
  //
  // Lắc phải NHANH: hai khung liền nhau phải khác nhau thấy được, nếu chậm
  // thì hình đứng yên và người xem tưởng bát không có nước.
  let memo = null;
  g.updateProp = t => {
    if (!marks) return;             // bát nhỏ để rót: không có nhịp riêng
    if (!waterOn) return;
    if (!memo) {
      memo = { t48: lineStart('c48'), tSet: evTime('cup_set') };
      if (memo.t48 == null) memo.t48 = 143.9;
      if (memo.tSet == null) memo.tSet = memo.t48 + .3;
    }
    const tau = t - memo.tSet;
    const w = (tau > 0 && tau < 3.2)
      ? Math.exp(-.7 * tau) * Math.sin(2 * Math.PI * 1.45 * tau) : 0;
    // bát lắc quanh mép đáy
    pivot.rotation.z = .085 * w;
    // Mực nước lên tới vạch "3": câu "hãy xem lại lượng nước bạn đã đổ" nói
    // về LƯỢNG nước, nên bát phải cho thấy mực nước ở đúng vạch chia.
    const k = clamp((t - memo.t48) / 2.6);
    const base = WATER_H + (LEVEL3 - WATER_H) * (k * k * (3 - 2 * k));
    // mặt nước sóng nhẹ trong bát
    setSurface(base + .008 * w, .05 * w, .085 * w);
  };
  return g;
}

export const PROP = { name: 'bát đong nước', view: () => batDongNuoc() };
