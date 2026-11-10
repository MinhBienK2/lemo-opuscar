// Nhiệt kế thủy ngữ: một cột thủy ngữ trong ống kính, bọt ở cuối, tựa trên một
// tấm thang chia có vạch. setTemp(độ) đưa cột thủy ngữ lên đúng vạch.
// Ống kính nằm bên trái, thang chia và số ở bên phải, không đè lên nhau: nhìn thấy
// cả cột thủy ngữ lẫn số độ trong cùng một khung.
import * as THREE from 'three';
import { toon, canvasTex, rbox, mesh, fxLayer } from '../../../../../rig/kit.js';

const TUBE_X = -.034;                 // ống kính nằm bên trái tấm thang chia

export function nhietKe(opts = {}) {
  const g = new THREE.Group();
  const L = (opts.length || .230);       // chiều dài thang chia
  const sc = opts.scale || 1;
  const T0 = -10, T1 = 130;             // hai đầu vạch
  const W = .115;                       // bề rộng tấm thang chia

  // tấm thang chia: vạch và số in lên bằng canvas
  const tex = canvasTex(512, 1024, (c, w, h) => {
    // Tấm thang là một tấm tối có chữ sáng. Một tấm giấy trắng dưới đèn nồi thì
    // thành vùng sáng nhất của khung, mắt người xem đi vào chỗ trống chứ không
    // vào đỉnh cột thủy ngữ; tấm tối để cột đỏ đứng ra, đúng như LOOK c31.
    const grd0 = c.createLinearGradient(0, 0, w, 0);
    grd0.addColorStop(0, '#161c33'); grd0.addColorStop(.36, '#1b2240'); grd0.addColorStop(1, '#2b3455');
    c.fillStyle = grd0; c.fillRect(0, 0, w, h);
    // Dải tối hơn dưới ống kính: cột thủy ngữ phải đọc ra trên nền tối. Nền sáng
    // phía sau nó làm cả khung siêu cận đỉnh cột thủy ngữ cháy trắng, mất nét
    // mực và mất chiều sâu của kênh; người xem không thấy đâu là đỉnh cột.
    const bw = w * .34;
    const grd = c.createLinearGradient(0, 0, bw, 0);
    grd.addColorStop(0, '#0a0d1a'); grd.addColorStop(.78, '#101528'); grd.addColorStop(1, '#1b2240');
    c.fillStyle = grd; c.fillRect(0, 0, bw, h);
    // số độ nằm bên phải, vạch kẻ ra từ số: chữ sáng trên nền tối.
    // Số phải TO: ở khung cận cảnh con số "100" chỉ cao mười mấy pixel thì
    // người xem điện thoại không đọc được nhiệt độ nào đang ghim nồi.
    c.strokeStyle = '#efe4c8'; c.fillStyle = '#efe4c8';
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let d = T0; d <= T1; d += 10) {
      const y = h - (d - T0) / (T1 - T0) * h;
      const big = d % 20 === 0;
      if (d !== 100) {                 // vạch 100 thay bằng dải đỏ sôi ở dưới
        c.lineWidth = big ? 12 : 6;
        c.beginPath(); c.moveTo(w * .30, y); c.lineTo(w * (big ? .50 : .40), y); c.stroke();
      }
      if (big) { c.font = 'bold 96px sans-serif'; c.fillText(String(d), w * .96, y); }
    }
    // Vạch sôi ở một trăm độ: một dải đỏ, thay luôn vạch thường ở vạch 100, đứng
    // đúng ngang hàng con số "100". Nếu để vạch thường rồi vẽ đè lên, thì đầu
    // vạch còn ló ra ngoài dải đỏ và thang có hai vạch ở một nhiệt độ.
    const y100 = h - (100 - T0) / (T1 - T0) * h;
    // viền mực quanh dải đỏ: một dải đỏ trơn không viền đọc ra như lớp đồ họa
    // phủ lên thang, không phải vạch in trên thang
    c.strokeStyle = '#161c33'; c.lineWidth = 30;
    c.beginPath(); c.moveTo(w * .34, y100); c.lineTo(w * .43, y100); c.stroke();
    c.strokeStyle = '#e0563f'; c.lineWidth = 18;
    c.beginPath(); c.moveTo(w * .34, y100); c.lineTo(w * .43, y100); c.stroke();
    // Chữ "SÔI" nằm NGANG HÀNG dải đỏ, giữa dải và số "100". Đặt dưới dải thì nó
    // trôi xuống lao giữa hai vạch và người xem đọc nhầm nó là mốc 90 độ; đặt bên
    // trái dải thì nó nằm sau ống kính. Chữ phải to đủ đọc, và không được nằm
    // trên con số "100" — số và chữ là hai thứ khác nhau.
    c.fillStyle = '#ff8062';
    c.font = 'bold 50px sans-serif'; c.textAlign = 'right'; c.textBaseline = 'alphabetic';
    c.fillText('SÔI', w * .60, y100 + 18);
  });
  const plate = mesh(rbox(W, L, .010, .004), toon('#ffffff', { map: tex }), [0, L / 2 - .03, 0]);
  g.add(plate);
  // khung của tấm thang: một tấm nền lớn hơn một chút, màu xám xanh. Không có
  // khung thì tấm thang trắng trên nền sáng thành một mảnh trắng không mép, số
  // độ trên đó như đang lơ lửng, không phải một vật để cầm.
  g.add(mesh(rbox(W + .014, L + .014, .008, .006), toon('#3c4457'), [0, L / 2 - .03, -.006]));

  // chân đế nhỏ và gá cắm cho ống kính
  g.add(mesh(rbox(.030, .012, .022, .004), toon('#7b8390'), [TUBE_X, -.034, .010]));

  // ống kính: một trụ thủy tinh trong suốt
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(.0082, .0082, L, 18),
    toon('#cfe6f2', { transparent: true, opacity: .32, depthWrite: false }));
  glass.position.set(TUBE_X, L / 2 - .03, .012);
  fxLayer(glass); g.add(glass);

  // cột thủy ngữ đỏ: phải đủ đậm để người xem thấy rõ mức nó dừng, vì cả câu
  // kể của tập này là so mức cột này với vạch của thang chia
  const col = mesh(new THREE.CylinderGeometry(.0072, .0072, 1, 14),
    toon('#d8402a', { emissive: new THREE.Color('#7a2410') }), [TUBE_X, 0, .012]);
  g.add(col);
  // đỉnh cột phải tròn: một cột bị cắt phẳng đọc ra là một ống nhựa, chứ không
  // phải đỉnh của cột thủy ngữ — mà đỉnh cột mới là tín hiệu mà câu kể chỉ
  const tip = mesh(new THREE.SphereGeometry(.0072, 14, 10),
    toon('#e8452c', { emissive: new THREE.Color('#8a2812') }), [TUBE_X, 0, .012]);
  g.add(tip);
  // bọt ở cuối
  const bulb = mesh(new THREE.SphereGeometry(.0135, 16, 12), toon('#e04b38'), [TUBE_X, -.030, .012]);
  g.add(bulb);
  // khung ống: hai thanh nhỏ giữ kính, mảnh để không che cột thủy ngữ
  for (const s of [-1, 1]) g.add(mesh(rbox(.0035, L, .005, .0015), toon('#79808d'), [TUBE_X + s * .0112, L / 2 - .03, .012]));

  g.setTemp = deg => {
    const k = Math.max(0, Math.min(1, (deg - T0) / (T1 - T0)));
    // vạch của độ d nằm ở cao độ (-0.03 + k·L) tính từ đáy tấm thang; cột thủy
    // ngữ đáy ở vạch mười độ âm (-0.03) và đỉnh chạm đúng vạch của độ d, nên
    // chiều cao cột đúng bằng k·L
    const h = Math.max(.004, k * L);
    col.scale.y = h;
    col.position.y = -.030 + h / 2;
    // Đỉnh cột là mặt trên của bọt tròn, không phải tâm của nó: tâm bọt nằm
    // thấp hơn một bán kính. Nếu đặt tâm bọt đúng vạch thì bọt lọt lên trên,
    // người xem đọc cột cao hơn thật vài độ — ở khung cận cảnh, đỉnh cột
    // chạm vạch 120 trong khi câu kể nói cột đang ở 112.
    tip.position.y = -.030 + h - .0072;
    tip.visible = h > .006;
  };
  g.setTemp(20);
  g.top = L - .03;                      // đỉnh của cột thủy ngữ
  g.tubeX = TUBE_X;
  g.scale.setScalar(sc);
  return g;
}

export const PROP = { name: 'nhiệt kế thủy ngữ', view: () => nhietKe() };
