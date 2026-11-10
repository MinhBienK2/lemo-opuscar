// Nồi cơm điện: thân vỏ có độ dày và lòng rỗng, nắp có lỗ thoát hơi và núm cầm,
// tay cầm hai bên, bảng điều khiển ở mặt trước với nút bấm và đèn báo hai màu
// (đỏ khi đang nấu, hổ phách khi chuyển sang giữ ấm), chân đế và dây điện.
import * as THREE from 'three';
import { toon, glowMat, canvasTex, rbox, mesh, fxLayer, PAL, mulberry } from '../../../../../rig/kit.js';
import { vessel } from '../../../../../rig/cutaway.js';
import { button, cable } from '../../../../../rig/parts.js';

// thân nồi: hình trụ bọc tròn, vai thuôn, miệng hơi trong
const PROFILE_BODY = [
  [0, 0], [.145, 0], [.185, .012], [.208, .045], [.218, .085],
  [.218, .185], [.210, .222], [.190, .245], [.176, .252],
];

// Vân vỏ nồi: một mảng trắng nhẵn ở tiền cảnh đọc ra như một khối sơn, không
// phải vỏ máy. Vân này là hạt mịn và vàng vân dọc rất nhạt, đủ để bề mặt có
// chiều sâu mà không thành hoa văn.
function shellTex() {
  return canvasTex(512, 512, (g, w, h) => {
    const r = mulberry(41);
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) {
      const x = r() * w, y = r() * h, a = r();
      g.fillStyle = `rgba(150,140,120,${.04 + a * .09})`;
      g.fillRect(x, y, a > .82 ? 2 : 1, 1);
    }
    for (let i = 0; i < 70; i++) {                       // vàng vân dọc của khuôn
      const x = r() * w;
      g.fillStyle = `rgba(120,112,96,${.02 + r() * .025})`;
      g.fillRect(x, 0, 1 + r() * 2, h);
    }
  });
}

export function noiComDien(opts = {}) {
  const g = new THREE.Group();
  const shellColor = opts.shell || '#e7e2d6';
  const accent = opts.accent || '#3d4a72';
  const stx = shellTex(); stx.repeat.set(3, 1.5);
  const bodyMat = toon(shellColor, { map: stx });
  const accentMat = toon(accent);

  // ── thân: vỏ có độ dày, lòng rỗng (sau này cưa ngang sẽ thấy ra thành nồi) ──
  const body = vessel(PROFILE_BODY, { thick: .022, cut: 0, shell: bodyMat, face: toon('#cdc6b6') });
  g.add(body.group);
  g.body = body;

  // vành đế dưới (chân nồi)
  g.add(mesh(new THREE.TorusGeometry(.196, .012, 8, 40), accentMat, [0, .012, 0], { rot: [Math.PI / 2, 0, 0] }));

  // ── nắp: nhóm riêng để mở được ──
  const lid = new THREE.Group();
  lid.position.set(0, .252, -.175);          // bản lề ở phía sau
  const lidBody = new THREE.Group(); lidBody.position.set(0, 0, .175);
  lid.add(lidBody);
  // vòng lathe đi từ ngoài vào trong và lên: chiều này cho mặt ngoài quay ra
  const lidProf = [[.176, -.006], [.190, 0], [.184, .008], [.160, .028], [.115, .046], [.055, .058], [0, .062]];
  lidBody.add(mesh(new THREE.LatheGeometry(lidProf.map(p => new THREE.Vector2(p[0], p[1])), 48), bodyMat));
  // mặt trong nắp: một đĩa phẳng, để mở nắp ra thấy mặt dưới chứ không phải mặt sau
  lidBody.add(mesh(new THREE.CylinderGeometry(.172, .168, .008, 44),
    toon('#dcd6c8', { emissive: new THREE.Color('#2e2a22') }), [0, -.006, 0]));
  // vành nắm
  lidBody.add(mesh(new THREE.TorusGeometry(.186, .008, 8, 44), accentMat, [0, .002, 0], { rot: [Math.PI / 2, 0, 0] }));
  // lỗ thoát hơi: một hốc nhỏ trên nắm
  const vent = new THREE.Group(); vent.position.set(.085, .046, .02);
  vent.add(mesh(new THREE.CylinderGeometry(.020, .024, .012, 18), toon('#b9b2a4'), [0, .002, 0]));
  vent.add(mesh(new THREE.CylinderGeometry(.015, .015, .020, 18), toon('#2b2f3a'), [0, -.008, 0]));
  lidBody.add(vent);
  // núm cầm
  const knob = new THREE.Group(); knob.position.set(0, .062, 0);
  knob.add(mesh(new THREE.CylinderGeometry(.030, .036, .022, 20), accentMat, [0, .011, 0]));
  knob.add(mesh(new THREE.SphereGeometry(.030, 16, 12), accentMat, [0, .030, 0]));
  lidBody.add(knob);
  g.add(lid);
  g.lid = lid; g.vent = vent; g.knob = knob;

  // ── bản lề: một trục thép ở phía sau, nắp xoay quanh đúng trục đó ──
  g.add(mesh(new THREE.CylinderGeometry(.009, .009, .075, 14), toon('#8b919c'), [0, .252, -.175], { rot: [0, 0, Math.PI / 2] }));
  g.add(mesh(rbox(.022, .030, .020, .005), toon('#8b919c'), [0, .240, -.175]));
  // tai bản lề trên nắp: nằm ngay tại trục, xoay theo nắp
  lid.add(mesh(rbox(.052, .009, .026, .004), toon('#8b919c'), [0, .004, .002]));

  // ── tay cầm hai bên ──
  for (const s of [-1, 1]) {
    const h = new THREE.Group(); h.position.set(s * .205, .175, 0);
    h.add(mesh(rbox(.052, .062, .10, .018), accentMat, [s * .022, 0, 0]));
    h.add(mesh(rbox(.030, .038, .086, .014), toon('#2f3a5c'), [s * .048, 0, 0]));
    g.add(h);
  }

  // ── bảng điều khiển ở mặt trước ──
  const panel = new THREE.Group(); panel.position.set(0, .105, .212);
  panel.add(mesh(rbox(.20, .095, .022, .012), toon('#f2ece0'), [0, 0, 0]));
  panel.add(mesh(rbox(.20, .095, .006, .012), accentMat, [0, 0, -.010]));
  // đèn báo: một đĩa nhỏ trong vành
  const lamp = new THREE.Group(); lamp.position.set(-.050, .014, .014);
  lamp.add(mesh(new THREE.CylinderGeometry(.021, .021, .008, 20), toon('#3a3f4c'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  const bulb = mesh(new THREE.CircleGeometry(.016, 20), glowMat('#ff4a3a', 1.6), [0, 0, .006], { cast: false });
  fxLayer(bulb); lamp.add(bulb);
  panel.add(lamp);
  // nút bấm
  const btn = button({ r: .026, color: '#c8cdd8', bezel: '#6b7280', size: .9 });
  btn.rotation.x = Math.PI / 2; btn.position.set(.050, .010, .016);
  panel.add(btn);
  // nhãn nhỏ dưới đèn
  panel.add(mesh(rbox(.052, .012, .004, .003), toon('#8b8f9c'), [-.050, -.026, .012]));
  g.add(panel);
  g.lamp = bulb; g.btn = btn;

  // ── chân đế ──
  for (const [x, z] of [[-.13, -.13], [.13, -.13], [-.13, .13], [.13, .13]])
    g.add(mesh(new THREE.CylinderGeometry(.026, .022, .018, 12), toon('#2b2f3a'), [x, .009, z]));

  // ── dây điện: chạy ra sau nồi rồi lên tường, cắm vào ổ cắm ──
  // Đầu dây không được nằm vắt ngang trên mặt bàn: nồi đang nấu mà phích
  // cắm rời nằm trên bàn thì cảnh vô lý. Dây phải đi tới ổ cắm trên tường
  // (điểm cuối toạ độ cục bộ của nồi: ứng với (-1.00, .30, .03) trong không
  // gian, đúng chỗ có ổ cắm dựng trong set).
  const cord = cable({
    points: [[0, .05, -.21], [-.02, .03, -.40], [.06, .10, -.55], [.18, .25, -.62], [.255, .30, -.667], [.255, .30, -.70]],
    r: .008, color: '#2c2f36', plug: 'wall', size: 1,
  });
  g.add(cord);

  // ── hơi nước: mấy mảng mờ bay lên từ lỗ nắm (chất khí vô hình thành vật) ──
  // Hơi nước không được là một quả bóng trắng đặc trên nắm: nó là một mảng mờ
  // không có bóng đổ, sáng đều, nhiều mảng nhỏ chồng lên nhau.
  const steamMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#e2f3ff'), transparent: true, opacity: .42,
    depthWrite: false, toneMapped: false,
  });
  const steam = new THREE.Group();
  for (const [i, k] of [[1, 1], [.66, .66], [.40, .40]].entries()) {
    const p = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), steamMat);
    p.userData.k = k; p.scale.setScalar(.001);
    fxLayer(p); steam.add(p);
  }
  g.add(steam);
  g.steam = steam;

  // ── trạng thái ──
  // Đèn báo có ba trạng thái: tắt, đỏ khi đang nấu, hổ phách khi chuyển sang
  // giữ ấm. Hổ phách phải ĐỌC RA là hổ phách: nhân màu lên quá mạnh sẽ cắt
  // mất kênh xanh, màu vàng thuần, và câu kể "chuyển từ đỏ sang hổ phách" sẽ
  // không đúng với cái đèn trên màn hình.
  const RED = new THREE.Color('#ff4a3a'), AMBER = new THREE.Color('#ffa42b');
  g.setIndicator = state => {
    const c = state === 'off' ? new THREE.Color('#4a4438') : state === 'amber' ? AMBER : RED;
    const k = state === 'off' ? .5 : state === 'amber' ? 1.12 : 1.8;
    bulb.material.color.copy(c).multiplyScalar(k);
    bulb.material.opacity = 1;
  };
  g.setSteam = k => {
    const on = k > .02;
    steam.visible = on;
    if (on) steam.children.forEach((p, i) => {
      const s = p.userData.k;
      p.scale.setScalar((.012 + .016 * k) * s);
      p.position.set(.085 + (i - 1) * .007 * s, .296 + .02 * k + i * .016 * s, .02);
      p.rotation.y = i * 1.9;
    });
  };
  g.setLid = k => { lid.rotation.x = -k * 1.15; };      // 0 = đậy, 1 = mở
  g.setButton = k => btn.press(k);
  g.setIndicator('red');
  g.setSteam(0);
  g.setLid(0);
  return g;
}

export const PROP = { name: 'nồi cơm điện', view: () => noiComDien() };
