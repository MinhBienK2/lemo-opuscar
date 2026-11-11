// Nồi cơm điện bị cưa ngang: đúng vỏ của nồi cơm điện (thân + nắp vòm + núm +
// bảng công tắc + tay cầm + chân + dây điện) rồi cưa ngang theo MỘT mặt phẳng
// z = 0, để người xem thấy cả vỏ nồi lẫn ruột bên trong: nồi trong (thành có
// độ dày), mâm nhiệt tròn, dây điện trở quanh vành mâm, lò xo nhấn viên cầu đầu
// dò nhiệt, hai dây mảnh chạy xuống bo mạch.
//
// Vì sao cưa ở z = 0: cảnh N2 quay vào ruột nồi từ phía +z, và mọi điểm neo của
// phim (viên cầu, con chip, bo mạch) đều nằm trong hệ toạ độ này — mặt phẳng
// cưa không được dịch chuyển. Nhưng bảng công tắc của nồi nằm ở mặt trước
// (z > 0), cưa thẳng là mất sạch, mà mất bảng công tắc thì hình không còn đọc ra
// là "nồi cơm điện". Nên cả vỏ được xoay 90° quanh trục đứng TRƯỚC khi cưa:
// mặt trước của nồi quay sang bên phải, bảng công tắc bị cưa đôi đúng ở mặt
// phẳng z = 0 (nửa còn lại mang nút bấm), nắp vòm nằm trên trục nên bị cưa thành
// nửa vòm. Mọi mép cắt vẫn nằm trong một mặt phẳng, không mép nào cong.
import * as THREE from 'three';
import { toon, glowMat, canvasTex, rbox, mesh, fxLayer, mulberry, clamp, GRAD3 } from '../../../../../rig/kit.js';
import { vessel } from '../../../../../rig/cutaway.js';
import { pcb, spring, cable, button } from '../../../../../rig/parts.js';
import { section } from '../../../../../rig/section.js';
import { lopGao } from './gao.js';

const PROFILE_BODY = [
  [0, 0], [.145, 0], [.185, .012], [.208, .045], [.218, .085],
  [.218, .185], [.210, .222], [.190, .245], [.176, .252],
];
// nồi trong: đáy rộng, miệng hơi loe
const PROFILE_POT = [
  [0, 0], [.140, 0], [.146, .008], [.150, .032], [.150, .060], [.150, .165], [.153, .172],
];
// lòng vỏ: một lớp tối ốp bên trong thân nồi. Không có lớp này thì khoang
// trong là một mảng kem trơn sáng, và cả cái nồi bị cưa đọc ra y như một mặt
// nạ hàn: một khung kem bao quanh một ô xám phẳng. Có lớp tối thì khoang
// trong đọc ra là một hõm hút sáng, có chiều sâu. (Cùng cách lớp lòng vỏ của
// noi-cu-cat-ngang làm.)
const LINER = [
  [.150, .020], [.180, .045], [.192, .085], [.192, .185], [.184, .222], [.164, .244], [.150, .251],
];
// vành miệng nồi trong: một sống nhôm cuộn ở mép, để đọc ra độ dày thành
const POT_RIM = [[.1400, .1665], [.1545, .1665], [.1545, .1755], [.1400, .1755], [.1400, .1665]];

export const Y = {
  base: 0.022,      // mặt trên của đáy vỏ
  spring0: 0.024,   // chân lò xo
  bead: 0.053,      // tâm viên cầu
  plate0: 0.040,    // đáy mâm nhiệt
  plate1: 0.048,    // mặt trên mâm nhiệt = đáy nồi trong
  pot0: 0.048,      // đáy nồi trong (nồi trong đặt ngồi lên mâm nhiệt)
  pot1: 0.220,      // miệng nồi trong
};

// Dây điện trở quấn quanh vành thành của mâm nhiệt. Ba số này phải đi cùng
// nhau, và bước xoắn (COIL_Y1 - COIL_Y0) / số vòng là thứ quyết định chữ
// "xoắn" có đọc được hay không: bước xoắn phải lớn hơn đường kính sợi dây,
// nếu không các vòng ép vào nhau thành một dải đồng trơn.
// Vành thành dựng tới đúng bán kính trong của dây (COIL_R - WIRE_R) để dây
// ôm sát vành chứ không lơ lửng cách vành một khe sáng.
const COIL_R = .180;      // bán kính đường tròn dây quanh trục
const COIL_Y0 = .036;     // đáy dải dây
const COIL_Y1 = .092;     // đỉnh dải dây
const WIRE_R = .0052;     // bán kính sợi dây (đường kính 10,4 mm)

// Vân vỏ nồi: hạt mịn và vàng vân dọc rất nhạt của khuôn. Vân này cho bề mặt có
// chiều sâu mà không thành hoa văn. (Cùng vân với vỏ nồi nguyên vẹn.)
function shellTex() {
  return canvasTex(512, 512, (g, w, h) => {
    const r = mulberry(41);
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) {
      const x = r() * w, y = r() * h, a = r();
      g.fillStyle = `rgba(150,140,120,${.04 + a * .09})`;
      g.fillRect(x, y, a > .82 ? 2 : 1, 1);
    }
    for (let i = 0; i < 70; i++) {
      const x = r() * w;
      g.fillStyle = `rgba(120,112,96,${.02 + r() * .025})`;
      g.fillRect(x, 0, 1 + r() * 2, h);
    }
  });
}

// Vân của THÀNH TRONG nồi. Thành trong là một mảng lớn, nhìn thẳng từ phía
// máy quay: nếu chỉ có một màu toon đều, nó đọc ra y như một ô xám phẳng dán
// vào khung — đúng cái cảm giác "mặt nạ hàn" mà người xem đã chê. Vân này là
// ba thứ: thành tối dần về đáy (đáy sâu thì tối, miệng nồi thì sáng), một
// dải sáng mảnh chạy dọc thành (vệt phản chiếu của thành cong — thành cong mà
// không có vệt sáng thì đọc ra là một tấm bằng phẳng), và mấy vết ẩm loang
// nhẹ của thành nồi dùng lâu.
//
// Toạ độ v của Lathe: 0 ở đáy ngoài, ~0.46 ở miệng nồi, ~0.92 ở đáy trong.
// Canvas đảo chiều: y = (1 - v) * h. Nên thành trong nằm ở dải y ≈ 0.08h…0.54h,
// đáy trong ở mép trên dải đó, miệng nồi ở mép dưới. Toạ độ u chạy vòng quanh
// nồi; nửa sau của thành (nửa ta thấy) là u ≈ 0.25…0.75.
function potWallTex() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    const yTop = .08 * h, yLip = .54 * h;
    const grad = g.createLinearGradient(0, 0, 0, yLip);
    grad.addColorStop(0, '#7d7d7d');     // đáy trong: sâu, tối
    grad.addColorStop(.55, '#bcbcbc');   // giữa thành
    grad.addColorStop(1, '#ffffff');     // gần miệng nồi: sáng
    g.fillStyle = grad; g.fillRect(0, 0, w, yLip);
    // vệt phản chiếu của thành cong: một dải sáng mảnh chạy dọc, lệch trái
    for (const [cx, wd, a] of [[.38, .055, .34], [.62, .022, .16]]) {
      const rg = g.createRadialGradient(cx * w, (yTop + yLip) / 2, 0, cx * w, (yTop + yLip) / 2, wd * w);
      rg.addColorStop(0, `rgba(255,255,255,${a})`);
      rg.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = rg;
      g.fillRect(cx * w - wd * w, yTop, wd * 2 * w, yLip - yTop);
    }
    // vết ẩm loang nhẹ trên thành: mấy vệt mờ, không đều, không thành vòng
    const r = mulberry(23);
    for (let i = 0; i < 26; i++) {
      const x = r() * w, y = yTop + r() * (yLip - yTop);
      const rr = 14 + r() * 40;
      const rg = g.createRadialGradient(x, y, 0, x, y, rr);
      rg.addColorStop(0, `rgba(74,74,74,${(.05 + r() * .07).toFixed(3)})`);
      rg.addColorStop(1, 'rgba(74,74,74,0)');
      g.fillStyle = rg; g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill();
    }
  });
}

// Cạnh bo mạch bị cưa: nhìn vào cạnh bo phải thấy lớp gốm thủy tinh và lớp đồng
// của bo, chứ không phải một mảng xanh phẳng một màu. Vân này lặp theo chiều
// dày của bo (6 mm), nên dọc cạnh bo là từng lớp vật liệu.
function pcbEdgeTex() {
  const t = canvasTex(64, 64, (c, W, H) => {
    c.fillStyle = '#2a7a4a'; c.fillRect(0, 0, W, H);            // lớp mặt phủ
    c.fillStyle = '#d6cfb8'; c.fillRect(0, H * .16, W, H * .68); // lớp gốm thủy tinh
    c.fillStyle = '#bd8a41'; c.fillRect(0, H * .28, W, 3);      // lớp đồng
    c.fillStyle = '#bd8a41'; c.fillRect(0, H * .64, W, 3);
    c.fillStyle = '#2a7a4a'; c.fillRect(0, H * .86, W, H * .14);
  });
  t.repeat.set(1, 150);
  return t;
}

// Con IC ở cuối hai dây: vỏ xám sáng, ký hiệu in trên mặt trên và mặt trước,
// hai hàng chân cắm vào bo. Vỏ epoxy đen khi soi cận cảnh đọc ra là một hộp
// xám không vân đặt trên bo, không phải một linh kiện.
function chipIC({ w = .044, d = .044, h = .009 } = {}) {
  const g = new THREE.Group();
  const markTex = () => canvasTex(256, 256, (x, W, H) => {
    x.fillStyle = '#8e96a2'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#22262c';
    x.font = 'bold 40px monospace'; x.textAlign = 'center';
    x.fillText('IC-7404', W / 2, H * .46);
    x.font = '26px monospace'; x.fillText('2416', W / 2, H * .64);
    x.fillStyle = '#3b414a';
    x.beginPath(); x.arc(W * .15, H * .18, 14, 0, Math.PI * 2); x.fill();
  });
  const body = toon('#98a1ae');
  const top = toon('#ffffff', { map: markTex() });
  const front = toon('#ffffff', { map: markTex() });
  // thứ tự mặt của BoxGeometry: +x, -x, +y, -y, +z, -z.
  g.add(mesh(new THREE.BoxGeometry(w, h, d), [front, body, top, body, front, body], [0, h / 2 + h * .4, 0]));
  const leg = toon('#cfd4da');
  for (let i = 0; i < 8; i++) {
    const t = (i + .5) / 8 - .5;
    for (const s of [-1, 1]) {
      g.add(mesh(new THREE.BoxGeometry(h * .55, h * .22, w * .09), leg,
        [s * (w / 2 + h * .28), h * .30, t * w * .82]));
      g.add(mesh(new THREE.BoxGeometry(h * .20, h * .55, w * .09), leg,
        [s * (w / 2 + h * .50), h * .12, t * w * .82]));
    }
  }
  for (let i = 0; i < 8; i++) {
    const t = (i + .5) / 8 - .5;
    g.add(mesh(new THREE.BoxGeometry(w * .09, h * .22, h * .55), leg,
      [t * w * .82, h * .30, d / 2 + h * .28]));
    g.add(mesh(new THREE.BoxGeometry(w * .09, h * .55, h * .20), leg,
      [t * w * .82, h * .12, d / 2 + h * .50]));
  }
  return g;
}

export function noiCatNgang(opts = {}) {
  const g = new THREE.Group();
  g.name = 'nồi cơm điện bị cưa ngang';
  const shellColor = opts.shell || '#e7e2d6';
  const accent = opts.accent || '#3d4a72';
  const stx = shellTex(); stx.repeat.set(3, 1.5);
  const bodyMat = toon(shellColor, { map: stx });
  const accentMat = toon(accent);
  // Thành nồi trong phải tối: một thành sáng, dưới đèn nồi, thành một mảng kem
  // trơn chiếm nửa khung — người xem không đọc ra đó là thành nồi, và mắt cũng
  // không đi vào đáy nồi. Thành tối thì đáy nồi mới là thứ được nhìn thấy.
  // Mặt cắt của thành thì tô sáng: độ dày 12 mm phải đọc ra được như một sống
  // nhôm, để đọc ra "một cái nồi trong một cái nồi".
  const potWall = toon('#616a77', { grad: GRAD3, map: potWallTex() });
  const potCutFace = toon('#aab3bd');
  const potRimMat = toon('#bcc4ce');
  // lòng vỏ: tối, để khoang trong là một hõm hút sáng chứ không phải một mảng
  // kem trơn sáng.
  const linerMat = toon('#4c453b', { grad: GRAD3 });
  // đồng và gốm cho chân cắm, đầu nối
  const brassMat = toon('#c9973a'), termMat = toon('#ded7c6');

  // ── vỏ nồi, dựng trong hệ toạ độ riêng của nồi (+z là mặt trước) ──────
  // Hệ toạ độ này xoay 90° quanh trục đứng: mặt trước của nồi (bảng công tắc)
  // quay sang +x, nắp vòm ở trên trục. Sau khi xoay, mặt phẳng cưa z = 0 của
  // cảnh chính chính là mặt phẳng x = 0 của hệ này.
  const cooker = new THREE.Group();
  cooker.rotation.y = Math.PI / 2;

  // thân: vỏ có độ dày, lòng rỗng. Không có dải bóng loé (shine): dải ấy bị cưa
  // thành một mảnh vỏ mỏng nằm ngay trên mặt cắt — đúng vết mà người xem đã
  // chê trước đây.
  const body = vessel(PROFILE_BODY, { thick: .022, cut: 0, shell: bodyMat, face: toon('#cdc6b6'), shine: false });
  cooker.add(body.group);

  // LÒNG VỎ TỐI. Không có lớp này thì phía trong vỏ là một mảng kem trơn sáng,
  // và cả cái nồi bị cưa đọc ra y như một mặt nạ hàn: một khung kem bao quanh
  // một ô xám phẳng. Lớp tối biến khoang trong thành một hõm hút sáng, có
  // chiều sâu, và đáy nồi trong nằm giữa một hõm tối thì đọc ra là ruột của
  // một chiếc nồi. (Cùng cách lớp lòng vỏ của noi-cu-cat-ngang làm.)
  const liner = mesh(new THREE.LatheGeometry(LINER.map(p => new THREE.Vector2(p[0], p[1])), 96), linerMat);
  liner.userData.hollow = true;                 // vỏ mỏng: cưa mà không tô mặt cắt
  cooker.add(liner);

  // vành đế dưới (chân nồi)
  cooker.add(mesh(new THREE.TorusGeometry(.198, .011, 8, 40), accentMat, [0, .012, 0], { rot: [Math.PI / 2, 0, 0] }));

  // ── nắp vòm: nửa vòm, núm, lỗ thoát hơi ────────────────────────────────
  // Nắp nằm trên trục nồi nên mặt phẳng cưa đi qua đúng giữa vòm: người xem
  // thấy một nửa vòm úp, và bên dưới vòm là cả ruột nồi.
  //
  // Vòm dựng bằng một vòng lathe KÍN (ngoài – trong – ngoài) để vỏ nắp có
  // độ dày thật: cắt nó thì mặt cắt phải cho thấy được lớp vỏ, chứ không
  // phải một mảnh giấy phẳng. Mép dưới của vòm đặt đúng lên vành thân nồi
  // (r = 176 mm, y = 252 mm) nên nắp không chui vào thân.
  const lid = new THREE.Group(); lid.position.set(0, .252, -.175);   // bản lề ở phía sau
  const lidBody = new THREE.Group(); lidBody.position.set(0, 0, .175);
  lid.add(lidBody);
  const domeOut = [[.176, 0], [.191, .007], [.187, .019], [.168, .042], [.128, .064], [.074, .079], [.026, .088], [0, .090]];
  const domeIn = [[.166, -.003], [.181, .004], [.177, .015], [.158, .035], [.120, .056], [.070, .071], [.024, .079], [0, .081]];
  const domeProf = [...domeOut, ...domeIn.slice().reverse(), domeOut[0]];
  lidBody.add(mesh(new THREE.LatheGeometry(domeProf.map(p => new THREE.Vector2(p[0], p[1])), 48), bodyMat));
  // Mặt trong của nắp phải có BẬC, không phải một mảng xám phẳng: nắp vòm
  // thật có vòng dập nổi (vòng đập hút chân không khí). Các vòng này cũng là
  // thứ cho ta biết đó là một CÁI NẮP úp xuống chứ không phải một vòm trơn.
  const domeSteps = [
    [.162, -.002], [.156, .005], [.148, .007], [.146, .014], [.136, .016], [.132, .025],
    [.120, .027], [.114, .036], [.100, .040], [.092, .049], [.076, .056], [.064, .063],
    [.048, .069], [.030, .072], [.014, .077], [0, .078],
  ];
  const domeStepMesh = mesh(new THREE.LatheGeometry(domeSteps.map(p => new THREE.Vector2(p[0], p[1])), 48),
    toon('#c9bfa6', { grad: GRAD3 }));
  domeStepMesh.userData.hollow = true;
  lidBody.add(domeStepMesh);
  // vành nắm
  lidBody.add(mesh(new THREE.TorusGeometry(.186, .008, 8, 44), accentMat, [0, .004, 0], { rot: [Math.PI / 2, 0, 0] }));
  // lỗ thoát hơi: một hốc nhỏ trên nắm, có vành và một lỗ đen thật
  const vent = new THREE.Group(); vent.position.set(.070, .073, .018);
  // vành lỗ: một sọc nhôm nhô lên mặt vòm
  vent.add(mesh(new THREE.TorusGeometry(.020, .0035, 6, 22), toon('#8f887b'), [0, .0055, 0], { rot: [Math.PI / 2, 0, 0] }));
  // miệng lỗ: một đĩa đen nằm ngay trên mặt vòm, để lỗ đọc ra là một lỗ
  vent.add(mesh(new THREE.CylinderGeometry(.016, .016, .004, 18), toon('#1b1f26'), [0, .0055, 0]));
  lidBody.add(vent);
  // núm cầm: một cổ + một nắp cầm, để đọc ra là một cái núm để cầm
  const knob = new THREE.Group(); knob.position.set(0, .090, 0);
  knob.add(mesh(new THREE.CylinderGeometry(.013, .017, .022, 16), toon('#c6bfae'), [0, .008, 0]));
  knob.add(mesh(new THREE.CylinderGeometry(.031, .036, .014, 20), accentMat, [0, .024, 0]));
  knob.add(mesh(new THREE.SphereGeometry(.030, 16, 12), accentMat, [0, .038, 0]));
  lidBody.add(knob);
  cooker.add(lid);

  // ── bản lề: một trục thép ở phía sau, nắp xoay quanh đúng trục đó ───────
  cooker.add(mesh(new THREE.CylinderGeometry(.009, .009, .075, 14), toon('#8b919c'), [0, .252, -.175], { rot: [0, 0, Math.PI / 2] }));
  cooker.add(mesh(rbox(.022, .030, .020, .005), toon('#8b919c'), [0, .240, -.175]));
  // tai bản lề trên nắp: nằm ngay tại trục, xoay theo nắp
  lid.add(mesh(rbox(.052, .009, .026, .004), toon('#8b919c'), [0, .006, .002]));

  // ── tay cầm hai bên ────────────────────────────────────────────────────
  for (const s of [-1, 1]) {
    const h = new THREE.Group(); h.position.set(s * .205, .175, 0);
    h.add(mesh(rbox(.052, .062, .10, .018), accentMat, [s * .022, 0, 0]));
    h.add(mesh(rbox(.030, .038, .086, .014), toon('#2f3a5c'), [s * .048, 0, 0]));
    cooker.add(h);
  }

  // ── bảng công tắc ở mặt trước của nồi ─────────────────────────────────
  // Sau khi xoay 90°, bảng nằm ở bên phải và bị cưa đôi đúng ở mặt phẳng z = 0.
  // Nửa còn lại mang nút bấm và nhãn — đủ để đọc ra đây là bảng công tắc của một
  // chiếc nồi cơm điện, chứ không phải một mảng vỏ trơn.
  const panel = new THREE.Group(); panel.position.set(0, .105, .212);
  // viền xanh bao quanh tấm kem: một tấm kem trên nền vỏ nồi thì chìm hẳn vào
  // thân nồi, đọc ra không ra là bảng công tắc. Có viền xanh bao ngoài thì
  // bảng là một vật thể riêng gắn lên thân.
  panel.add(mesh(rbox(.214, .108, .020, .014), accentMat, [0, 0, -.004]));
  panel.add(mesh(rbox(.200, .095, .024, .012), toon('#f2ece0'), [0, 0, .006]));

  // ĐÈN BÁO trên bảng công tắc: một đĩa nhỏ trong vành tối. Đèn nằm trên bảng
  // (không phải trên vành vỏ) thì bảng mới đọc ra là bảng công tắc của một
  // chiếc nồi cơm điện, chứ không phải một mảng vỏ trơn bên hông.
  const lampBox = new THREE.Group(); lampBox.position.set(.030, .028, .020);
  lampBox.add(mesh(new THREE.CylinderGeometry(.019, .019, .010, 22), toon('#3a3f4c'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  const lens = mesh(new THREE.CircleGeometry(.013, 24), glowMat('#ff4a3a', 1.6), [0, 0, .006], { cast: false });
  lens.name = 'den-bao';
  fxLayer(lens);
  lampBox.add(lens);
  panel.add(lampBox);

  // MÀN HÌNH NHỎ: một ô tối có đồng hồ sáng, như bảng điện tử của nồi.
  const dispTex = canvasTex(256, 128, (c, w, h) => {
    c.fillStyle = '#10151b'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#ffb648'; c.font = 'bold 62px monospace'; c.textAlign = 'center';
    c.fillText('0:45', w / 2, h * .74);
  });
  panel.add(mesh(rbox(.046, .026, .005, .003), toon('#1b2028'), [.083, .026, .020]));
  panel.add(mesh(new THREE.PlaneGeometry(.038, .019), toon('#ffffff', { map: dispTex, emissive: new THREE.Color('#3a2a0c') }),
    [.083, .026, .0232], { cast: false }));

  // NÚT BẤM to: nút nhỏ trên nền kem biến mất, bảng công tắc không có gì để
  // bấm nên không đọc ra là bảng công tắc.
  const btn = button({ r: .026, color: '#c8cdd8', bezel: '#5b6270', size: .9 });
  btn.rotation.x = Math.PI / 2; btn.position.set(.050, -.014, .020);
  panel.add(btn);
  // nhãn nhỏ dưới nút
  panel.add(mesh(rbox(.052, .012, .004, .003), toon('#8b8f9c'), [.050, -.038, .020]));
  cooker.add(panel);

  // ── chân đế ─────────────────────────────────────────────────────────────
  for (const [x, z] of [[-.13, -.13], [.13, -.13], [-.13, .13], [.13, .13]])
    cooker.add(mesh(new THREE.CylinderGeometry(.026, .022, .018, 12), toon('#2b2f3a'), [x, .009, z]));

  // ── dây điện: ra sau nồi rồi nằm xuống sàn, cắm vào phích ───────────────
  // Dây phải nằm hoàn toàn ở nửa còn lại của mặt cưa, nếu không nó bị cưa đứt
  // thành mấy đoạn lơ lửng. Dây cũng phải ngắn: một sợi dây dài kéo theo cả
  // khung hình, nồi co lại còn một nửa.
  cooker.add(cable({
    points: [[.030, .050, -.200], [.100, .030, -.270], [.160, .012, -.330], [.205, .010, -.300], [.215, .010, -.240]],
    r: .010, color: '#2c2f36', plug: 'wall', size: 1,
  }));

  // ── ruột nồi: hệ toạ độ của cảnh, không xoay theo vỏ ──────────────────
  // Mọi thứ bên trong (mâm nhiệt, dây điện trở, bo mạch, viên cầu) nằm ở hệ
  // toạ độ mà phim bám vào, nên chúng không được xoay theo vỏ.
  const inside = new THREE.Group();

  // ── bo mạch ở đáy nồi ──────────────────────────────────────────────────
  // Bo không mang thêm linh kiện: ba tụ điện của hàm pcb() mọc lên cao hơn mâm
  // nhiệt, nhìn từ trên xuống thì đọc ra ba trụ xanh-trắng đứng không lý do
  // trên mâm nhiệt. Bo trần chỉ có vân mạch in, con chip thật là con chip dưới
  // đây, đặt ở cuối hai dây.
  const board = pcb({ w: .26, d: .13, seed: 12, parts: false });
  board.position.set(0, Y.base, -.040);
  board.traverse(o => { if (o.isMesh) o.name = 'bo-mach'; });
  inside.add(board);
  // mối hàn dọc cạnh bo: nhìn cận cảnh, cạnh bo phải có những chấm hàn bị cưa
  // đôi, chứ không phải một sốc xanh phẳng.
  for (let i = 0; i < 7; i++)
    inside.add(mesh(new THREE.SphereGeometry(.0019, 10, 8), toon('#c9a24a'), [-.105 + i * .035, Y.base + .006, -.001]));

  // ── LINH KIỆN THẬT trên bo mạch ───────────────────────────────────────
  // Bo trần (chỉ có vân mạch in) đọc ra không phải là một bo mạch, mà là một
  // miếng nhựa xanh. Bo của một nồi cơm phải có tụ điện, điện trở, một con IC
  // nhỏ và một bộ nối. Chúng đặt sát mép trước của bo — đúng chỗ mặt phẳng
  // cưa đi qua — nên nhìn vào khung thấy ngay mặt cắt của chúng: một hàng
  // linh kiện nhỏ dựng đứng giữa bo mạch và mâm nhiệt.
  const capMat = toon('#2f5fa8'), capTopMat = toon('#c9ced6');
  const resMat = toon('#d8c9a4'), icMat = toon('#31363e'), conMat = toon('#20252c');
  const Y_BOARD = Y.base + .006;               // mặt trên của bo
  // tụ điện
  const cap1 = new THREE.Group(); cap1.position.set(.040, Y_BOARD, 0);
  cap1.add(mesh(new THREE.CylinderGeometry(.0095, .0095, .011, 20), capMat, [0, .0055, 0]));
  cap1.add(mesh(new THREE.CylinderGeometry(.0098, .0098, .0014, 20), capTopMat, [0, .0112, 0]));
  inside.add(cap1);
  // điện trở nằm ngang
  inside.add(mesh(new THREE.CylinderGeometry(.0026, .0026, .018, 10), resMat,
    [.063, Y_BOARD + .0026, 0], { rot: [0, 0, Math.PI / 2] }));
  // con IC nhỏ
  inside.add(mesh(rbox(.018, .005, .011, .001), icMat, [.081, Y_BOARD + .0025, 0]));
  // bộ nối: một hộp đen với mấy chân đồng
  const con = new THREE.Group(); con.position.set(.113, Y_BOARD, 0);
  con.add(mesh(rbox(.022, .009, .017, .002), conMat, [0, .0045, 0]));
  for (let i = 0; i < 4; i++)
    con.add(mesh(new THREE.BoxGeometry(.0022, .003, .0022), brassMat, [-.0075 + i * .005, .0098, 0]));
  inside.add(con);

  // ── chân đỡ mâm nhiệt: ba cột nhỏ, để giữa trống cho lò xo và bo mạch ──
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2 + .5;
    inside.add(mesh(new THREE.CylinderGeometry(.013, .015, Y.plate0 - Y.base, 10),
      toon('#8d93a0'), [Math.cos(a) * .088, (Y.base + Y.plate0) / 2, Math.sin(a) * .088]));
  }

  // ── mâm nhiệt: một đĩa nhôm tròn, có lõ ở giữa và vành thành đứng ─────────
  // Đĩa tròn là thứ người xem phải nhìn ra được ở câu "mâm nhiệt tròn". Nhưng
  // đáy nồi trong nằm ngay trên đĩa, nên từ phía trước chỉ thấy một vành
  // nhôm mỏng quanh chân nồi — mâm nhiệt không đọc ra. Vì vậy mâm nhiệt có
  // một vành thành đứng lên cao quanh chân nồi, và dây điện trở quấn quanh
  // đúng vành đó: nhìn vào thấy một chiếc đĩa tròn nằm trong lòng nồi, có vòng
  // dây điện trở xoắn quanh vành.
  const R_PLATE = .170, R_HOLE = .022;
  const plateProf = [
    [R_HOLE, Y.plate0], [.150, Y.plate0], [R_PLATE, Y.plate0 + .004],
    [R_PLATE, Y.plate1], [R_HOLE, Y.plate1], [R_HOLE, Y.plate0],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const plateMat = toon('#c6ccd3');
  const plate = mesh(new THREE.LatheGeometry(plateProf, 64), plateMat);
  plate.name = 'mam-nhiet';
  inside.add(plate);
  // vành thành đứng quanh chân nồi: một vòng nhôm dựng lên. Mép ngoài của
  // vành dựng đến đúng bán kính trong của sợi dây điện trở, để dây ôm sát
  // vành — sợi dây mỏng đi thì vành cũng phải trồi ra tương ứng, nếu không
  // sẽ hở ra một khe sáng giữa dây và vành, đúng thứ phải tránh.
  const collar = mesh(new THREE.LatheGeometry([
    [.164, Y.plate1 - .002], [COIL_R - WIRE_R, Y.plate1 - .002], [COIL_R - WIRE_R, Y.plate1 + .034], [.164, Y.plate1 + .034], [.164, Y.plate1 - .002],
  ].map(([x, y]) => new THREE.Vector2(x, y)), 56), plateMat);
  collar.name = 'vanh-mam-nhiet';
  inside.add(collar);
  // mặt trên của mâm nhiệt: một đĩa có vân xoắn. Một đĩa trơn sẽ đọc ra như
  // một cái chảo trắng, không phải mâm nhiệt; vân xoắn là dấu hiệu của đĩa
  // điện trở nóng. Vân phủ kín tới mép vành để vành mâm vẫn đọc ra là một
  // đĩa tròn có độ dày, chứ không phải một sốc bạc.
  const spiralTex = canvasTex(1024, 1024, (c, w, h) => {
    c.fillStyle = '#c6ccd3'; c.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    c.strokeStyle = '#7d848f'; c.lineWidth = 18; c.lineCap = 'round';
    c.beginPath();
    for (let i = 0; i <= 1600; i++) {
      const u = i / 1600, a = u * Math.PI * 2 * 5, r = 46 + u * (w / 2 - 70);
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.stroke();
    c.strokeStyle = '#6e757f'; c.lineWidth = 14;
    c.beginPath(); c.arc(cx, cy, w / 2 - 26, 0, 7); c.stroke();
  });
  inside.add(mesh(new THREE.CircleGeometry(.166, 72), toon('#ffffff', { map: spiralTex }),
    [0, Y.plate1 + .0006, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }));
  // VIỀN SÁNG TỐI của mâm nhiệt: một sống nhôm tối ở mép đĩa. Đĩa trơn một
  // màu đọc ra như một cái đĩa nhạt, có viền sáng-tối thì đọc ra là một bộ
  // linh kiện có khối lượng.
  inside.add(mesh(new THREE.TorusGeometry(.1685, .0038, 8, 56), toon('#7e858f'),
    [0, Y.plate1 - .002, 0], { rot: [Math.PI / 2, 0, 0] }));
  // một đĩa nhỏ ở lõ mâm: chỗ đặt lò xo. Đĩa này phải nhỏ hơn lỗ của mâm,
  // để còn chỗ cho hai dây mảnh đi xuống qua lỗ.
  inside.add(mesh(new THREE.CylinderGeometry(.011, .011, .004, 28), toon('#9aa0aa'), [0, Y.plate0 + .004, 0]));

  // ── dây điện trở: một vòng xoắn quanh vành mâm nhiệt ────────────────────
  // Đây là thứ người xem phải nhìn ra được ở câu "quanh thành là dây điện trở
  // xoắn lại". Chữ "xoắn" chỉ đọc được khi GIỮA hai vòng còn một khe hở có
  // bóng: các vòng ép sát nhau thì thành một dải đồng trơn, nhìn từ trên xuống
  // chỉ thấy một vòng, không thấy dây xoắn mấy vòng. Bốn vòng trên dải cao
  // 56 mm nghĩa là bước xoắn chỉ 14 mm, mà sợi dây đã dày 14,4 mm — vòng này
  // nằm đè lên vòng kia, không bao giờ có khe. Nên bớt một vòng (còn 3 vòng,
  // bước xoắn 18,7 mm) VÀ làm sợi dây mỏng lại (10,4 mm): khe còn 8,3 mm, khe
  // ấy tự bóng và đọc ra ngay là một cuộn xoắn.
  // Dây quấn đúng quanh vành thành của mâm nhiệt, nên từ ngoài nhìn vào thấy dây
  // ôm lấy cái đĩa — vì vậy vành thành dựng tới đúng bán kính trong của dây.
  const coilMat = toon('#8a6248');
  const coilPts = [];
  for (let i = 0; i <= 240; i++) {
    const u = i / 240, a = u * 2 * Math.PI * 3;
    coilPts.push(new THREE.Vector3(Math.cos(a) * COIL_R, COIL_Y0 + u * (COIL_Y1 - COIL_Y0), Math.sin(a) * COIL_R));
  }
  const coilCurve = new THREE.CatmullRomCurve3(coilPts);
  // Dây vẫn phải có khối: một sợi mảnh trên ảnh xa đọc ra như một vòng sơn, không
  // phải là dây điện trở. 10,4 mm là đủ dày để có mặt sáng lấp lánh, mỏng đến
  // vừa để còn khe giữa các vòng.
  const coil = mesh(new THREE.TubeGeometry(coilCurve, 320, WIRE_R, 10), coilMat);
  coil.name = 'day-dien-tro';
  // vòng dây điện trở cũng bị cưa: mặt cắt của ống xiên là một dải dẹt dài,
  // trông như một vải đỏ trải quanh nồi. Để ống rỗng, không tô mặt cắt.
  // Ống rỗng cũng là chỗ duy nhất người xem thấy các vòng xếp chồng thật sự.
  coil.userData.hollow = true;
  inside.add(coil);
  // Vệt sáng bám theo đúng đường xoắn mới, và chỉ dày hơn sợi dây 1,2 mm:
  // dày hơn nữa là vệt sáng tràn sang khe giữa các vòng, khóa khe lại và biến
  // cuộn dây thành một dải sáng liền. Lớp 1: không viền mực, không bóng.
  const coilGlow = new THREE.Mesh(new THREE.TubeGeometry(coilCurve, 320, WIRE_R + .0012, 10),
    glowMat('#ff6a1f', 2, { transparent: true, opacity: 0, depthWrite: false }));
  coilGlow.layers.set(1);
  coilGlow.name = 'day-dien-tro-glow';
  inside.add(coilGlow);

  // HAI ĐẦU NỐI của dây điện trở: hai cục gốm có đinh đồng trên bo mạch, và
  // hai sợi dây nối từ đầu cuộn dây xoắn xuống hai cục đó. Không có đầu nối
  // thì cuộn dây trôi lơ lửng, không đọc ra là một linh kiện có mạch.
  for (const [tx, tz] of [[.100, -.017], [.100, -.044]]) {
    inside.add(mesh(rbox(.016, .009, .014, .002), termMat, [tx, Y.base + .0045, tz]));
    inside.add(mesh(new THREE.CylinderGeometry(.0028, .0028, .004, 10), brassMat, [tx, Y.base + .010, tz]));
  }
  // hai dây nối từ cuộn dây xuống hai đầu nối. Hai đầu cuộn được lấy thẳng
  // từ đường xoắn nên dây nối luôn chạm đúng vào dây, dù sau này đổi số vòng
  // hay độ dày sợi dây: số vòng là số nguyên nên cả hai đầu vẫn nằm ở cùng
  // một góc quanh trục, đúng chỗ vành mâm.
  for (const [end, tx, tz] of [[0, .100, -.017], [1, .100, -.044]]) {
    const ep = coilCurve.getPoint(end);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(ep.x, ep.y, ep.z),
      new THREE.Vector3(ep.x * .94, ep.y - .010, ep.z * .94),
      new THREE.Vector3((ep.x + tx) / 2, Y.base + .014, (ep.z + tz) / 2),
      new THREE.Vector3(tx, Y.base + .012, tz),
    ]);
    inside.add(mesh(new THREE.TubeGeometry(curve, 40, .0016, 8), brassMat));
  }

  // ── lò xo nhấn viên cầu ────────────────────────────────────────────────
  // Lò xo là một cuộn dây thật có vòng hở, đọc ra là lò xo chứ không phải một đống xám.
  // Lò xo và viên cầu không nằm trong phần bị cưa: chúng là tâm của cảnh, phải
  // giữ tròn trọn thì người xem mới tin được là lò xo đang ép viên cầu xuống.
  const focus = new THREE.Group();
  const sp = spring({ r: .014, len: .026, turns: 6, wire: .0024, color: '#9aa3b2' });
  sp.position.set(0, Y.spring0, 0);
  focus.add(sp);
  // chân lò xo: một bản nhỏ trên bo mạch
  focus.add(mesh(rbox(.046, .010, .046, .004), toon('#6b7280'), [0, Y.spring0 - .004, 0]));

  // ── viên cầu đầu dò nhiệt: một hạt cầu thật, nằm trên lò xo ───────────
  // Đầu dò nhiệt dạng hạt là một quả cầu nhỏ. Trụ kem có nắp xám ở trên đọc ra
  // như một nắp nút: người xem không đọc được đó là viên cầu, mà câu kể lại gọi
  // đúng nó là viên cầu. Một khối cầu có bóng đổ và viền mực thì không nhầm
  // được, và vẫn là một vật thật để dựng.
  const bead = new THREE.Group(); bead.position.set(0, Y.bead, 0);
  // Viên cầu là một hạt cầu nhỏ, không có que: que ép sẽ đọc ra như một cái
  // kim loại cắm xuyên qua lò xo. Hạt cầu ngồi trên vòng trên cùng của lò xo
  // và đỉnh của nó chạm đúng mặt trong của đáy nồi (y = 60 mm), nên câu "lò xo
  // ép nó thẳng vào đáy nồi" đúng ngay trong hình.
  bead.add(mesh(new THREE.SphereGeometry(.007, 24, 18), toon('#f2e9d4')));
  focus.add(bead);

  // ── hai dây mảnh từ viên cầu chạy xuống bo mạch ───────────────────────
  // Hai dây phải thấy được từ viên cầu xuống tới con chip ở đầu kia bo mạch,
  // vì câu "hai dây mảnh chạy xuống bo mạch" và câu "dải sáng chạy trên hai dây"
  // đều dựa vào đúng đường đi đó.
  //
  // Mặt phẳng cưa của cảnh là z = 0, phía +z (phía máy quay) bị cưa mất. Một
  // sợi dây nằm *trong* mặt phẳng đó bị cưa dọc theo chiều dài: chỉ còn lại một
  // mảng vỏ, đọc ra như một dải đỏ dẹt trải trên bo, không phải một sợi dây.
  // Vì vậy cả hai dây nằm hoàn toàn sau mặt phẳng cưa (z < 0): chúng không bị
  // cưa nữa, hiện trọn tròn, và dải sáng tín hiệu chạy dọc theo chúng.
  // Hai dây phải TÁCH RA, mỗi dây một sợi tròn: hai sợi nằm sát nhau thì đọc
  // thành một dải đỏ dẹt trải trên bo, không phải hai sợi dây.
  //
  // Hai dây đi xuống qua Lỗ của mâm nhiệt, rồi mới chạy dọc trong khe giữa
  // bo mạch và mâm. Nếu chạy xuyên qua thân mâm thì chúng nằm trong kim loại
  // và không ai nhìn thấy: câu "hai dây mảnh chạy lên bo mạch" sẽ không có
  // gì để chỉ. Lỗ của mâm rộng 22 mm, lò xo chiếm 16 mm, nên hai dây đi
  // sát mép lỗ, cách lò xo một khe.
  const wireMat = toon('#c8402f');
  const wirePath = [
    [[-.005, .0500, -.0030], [-.012, .0485, -.0105], [-.015, .0455, -.0125],
     [-.015, .0395, -.0125], [-.040, .0330, -.0180], [-.092, .0295, -.0255]],
    [[.004, .0500, -.0040], [.006, .0485, -.0145], [.009, .0455, -.0165],
     [.009, .0395, -.0165], [-.030, .0330, -.0215], [-.088, .0290, -.0275]],
  ];
  for (const p of wirePath) {
    const curve = new THREE.CatmullRomCurve3(p.map(v => new THREE.Vector3(...v)));
    // dây mảnh: ống tròn đường kính 2 mm. Ở cận cảnh một sợi to trông như
    // một dải đỏ dẹt trải trên bo, không phải một sợi dây; dây thật của đầu
    // dò nhiệt mảnh lắm, và mảnh thì đọc ra là sợi.
    const w = mesh(new THREE.TubeGeometry(curve, 44, .0011, 10), wireMat);
    inside.add(w);
    // hai đầu sợi có nắp tròn: ống tròn không có nắp, đầu hở đọc ra như một
    // cái lưỡi dẹt úp xuống
    for (const e of [0, 1]) {
      const pt = curve.getPoint(e);
      inside.add(mesh(new THREE.SphereGeometry(.0011, 10, 8), wireMat, [pt.x, pt.y, pt.z]));
    }
  }

  // ── con chip đo nhiệt độ, ở cuối hai dây ───────────────────────────────
  const ic = chipIC({ w: .044, d: .044, h: .009 });
  ic.position.set(-.100, Y.base + .006, -.040);
  inside.add(ic);

  // ── nồi trong: thành nhôm có độ dày, lòng rỗng ─────────────────────────
  // Nồi trong được cưa riêng, nên câu nào cần thấy mâm nhiệt (c7) thì ẩn nồi đi.
  const potRoot = new THREE.Group();
  // Thành nồi trong: xám xanh TỐI. Một thành sáng, dưới đèn nồi, thành một
  // mảng kem trơn chiếm nửa khung — người xem không đọc ra đó là thành nồi.
  // Thành tối thì đáy nồi mới là thứ được nhìn thấy.
  const pot = vessel(PROFILE_POT, { thick: .012, cut: 0, shell: potWall, face: potCutFace, shine: false });
  pot.group.traverse(o => { if (o.isMesh) o.name = 'thanh-noi-trong'; });
  potRoot.add(pot.group);
  // VÀNH MIỆNG nồi trong: một sống nhôm cuộn ở mép, và mặt cắt của thành được
  // tô sáng. Nhờ hai cái đó, 12 mm độ dày của thành đọc ra được: nồi trong là
  // một cái nồi có thành, nằm trong một cái nồi khác.
  potRoot.add(mesh(new THREE.LatheGeometry(POT_RIM.map(p => new THREE.Vector2(p[0], p[1])), 56), potRimMat));
  // Mặt đáy nồi trong: một đĩa nhôm có vân xoắn đồng tâm và vành hàn ở mép.
  // Một mặt đáy trơn một màu đọc ra như một mảng kem dán phẳng, không phải
  // đáy nồi — câu "không còn gì để hấp nhiệt" cần một cái đáy nhìn ra được
  // là đáy.
  const floorTex = canvasTex(1024, 1024, (c, w, h) => {
    c.fillStyle = '#9aa1ab'; c.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    for (let r = 30; r < w / 2 - 18; r += 26) {
      c.strokeStyle = 'rgba(255,255,255,.10)'; c.lineWidth = 5;
      c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke();
      c.strokeStyle = 'rgba(38,44,54,.16)'; c.lineWidth = 5;
      c.beginPath(); c.arc(cx, cy, r + 8, 0, 7); c.stroke();
    }
    // vành hàn ở mép đĩa, đậm hơn
    c.strokeStyle = '#666d79'; c.lineWidth = 30;
    c.beginPath(); c.arc(cx, cy, w / 2 - 26, 0, 7); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 6;
    c.beginPath(); c.arc(cx, cy, w / 2 - 42, 0, 7); c.stroke();
  });
  const floor = mesh(new THREE.CircleGeometry(.130, 72), toon('#ffffff', { map: floorTex }),
    [0, .0121, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  potRoot.add(floor);
  // LỚP CƠM ĐỨNG SẴN trong nồi trong. Vật này được chấm đứng một mình, không
  // có bối cảnh: một khoang nồi trống, tô xám đều, đọc ra như một mặt kính
  // đặt trong khung máy — và cả cái nồi đọc ra như một mặt nạ hàn. Có lớp cơm
  // thì người xem biết ngay đây là một NỒI CƠM bị cưa. Trong phim, bối cảnh dựng
  // lớp cơm riêng (có đội hình sôi, hạt nở, mực nước) nên lớp cố định này
  // được tắt đi.
  const riceStatic = lopGao({ R: .128, y: .014, h: .072, n: 520, seed: 3, half: true, gs: .78 });
  potRoot.position.y = Y.pot0;
  // Mặt cắt của thành nồi trong tô sáng: độ dày 12 mm phải đọc ra được như
  // một sống nhôm, chứ không phải một vệt tối.
  const potCut = section(potRoot, {
    normal: [0, 0, 1], at: 0,
    cap: (obj, mat) => obj.name === 'thanh-noi-trong'
      ? potCutFace
      : (mat.color ? toon(mat.color.clone().multiplyScalar(.82), { side: THREE.DoubleSide, map: null }) : null),
  });

  // ── cưa ngang ──────────────────────────────────────────────────────────
  // Vỏ: mặt phẳng cưa của hệ xoay 90° là x = 0 (giữ nửa x ≥ 0). Vỏ bị cưa theo
  // một mặt phẳng duy nhất nên mọi mép cắt đều thẳng và nằm chung một mặt
  // phẳng z = 0 của cảnh.
  const shellCut = section(cooker, { normal: [-1, 0, 0], at: 0 });
  // Ruột: mặt phẳng z = 0 của cảnh, phía bị bỏ là phía +z (về phía máy quay).
  const insideCut = section(inside, {
    normal: [0, 0, 1], at: 0,
    // cạnh bo mạch bị cưa: tô lớp vật liệu thật của bo, không phải một mảng
    // xanh phẳng một màu
    cap: (obj, mat) => obj.name === 'bo-mach'
      ? toon('#ffffff', { map: pcbEdgeTex(), side: THREE.DoubleSide })
      : (mat.color ? toon(mat.color.clone().multiplyScalar(.82), { side: THREE.DoubleSide, map: null }) : null),
  });

  g.add(shellCut.group);
  g.add(insideCut.group);
  g.add(potCut.group);
  // Lớp cơm cố định đặt NGOÀI nhóm bị cưa: lớp cơm đã giữ sẵn nửa sau (đúng
  // như mặt cưa của nồi) nên không cần cưa nữa, và đặt ngoài thì bối cảnh tắt
  // được nó bằng `visible` — nếu nằm trong nhóm bị cưa, bản cưa vẫn hiện và
  // câu "không còn gì để hấp nhiệt nữa" lại có một bát cơm trong khung.
  riceStatic.position.y = Y.pot0 + .014;
  g.add(riceStatic);
  // lò xo và viên cầu thêm vào sau khi cưa, nên chúng giữ nguyên khối
  g.add(focus);

  // các điểm neo để máy quay bám vào, và để đặt làn nhiệt
  g.beadPos = new THREE.Vector3(0, Y.bead, 0);
  g.platePos = new THREE.Vector3(0, Y.plate0 + .011, 0);
  g.potBottom = new THREE.Vector3(0, Y.pot0, 0);
  g.potMouth = new THREE.Vector3(0, Y.pot1, 0);
  g.potRadius = .150;
  g.chipPos = new THREE.Vector3(-.100, Y.base + .012, -.040);

  // mâm nhiệt sau khi cưa: bản còn lại trong khung, không phải bản gốc đã bị cưa mất
  let plateCut = null;
  insideCut.group.traverse(o => { if (o.isMesh && o.name === 'mam-nhiet') plateCut = o; });
  g.plate = plateCut || plate;
  // đèn báo sau khi cưa: bản còn lại trong khung
  let lampCut = null;
  shellCut.group.traverse(o => { if (o.isMesh && o.name === 'den-bao') lampCut = o; });
  g.lamp = lampCut || lens;
  g.potCut = potCut.group;
  // lớp cơm cố định trong nồi (xem chỗ dựng): bối cảnh tắt đi khi dựng lớp cơm
  // riêng của phim
  g.riceStatic = riceStatic;
  // dây điện trở xoắn quanh vành: ở cận cảnh nó là một vòng đỏ dẹt chắn cả
  // khung, và người xem tưởng đó là hai sợi dây. Ở những câu kể về dây mảnh thì
  // vòng dây điện trở phải ẩn đi.
  g.setCoil = v => {
    g.traverse(o => { if (o.name && o.name.startsWith('day-dien-tro')) o.visible = v; });
  };
  g.setLamp = state => {
    const c = state === 'off' ? new THREE.Color('#4a4438') : state === 'amber' ? new THREE.Color('#ffa42b') : new THREE.Color('#ff4a3a');
    // xem setIndicator của nồi: hổ phách không được nhân lên tới mức thành
    // vàng thuần, không thì đèn không còn là đèn hổ phách nữa
    lens.material.color.copy(c).multiplyScalar(state === 'off' ? .5 : state === 'amber' ? 1.12 : 1.8);
  };
  g.setLamp('red');
  g.setHeat = k => {                                         // dây điện trở đỏ lên
    plateMat.color.set('#b9bdc4').lerp(new THREE.Color('#c8b6a6'), clamp(k) * .5);
    coilMat.color.set('#8a6248').lerp(new THREE.Color('#c8401a'), clamp(k));
    coilGlow.material.opacity = clamp(k) * .50;
  };
  return g;
}

export const PROP = { name: 'nồi cơm điện bị cưa ngang', view: () => noiCatNgang() };
