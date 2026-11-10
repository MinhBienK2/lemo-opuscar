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
import { toon, glowMat, canvasTex, rbox, mesh, fxLayer, mulberry, clamp } from '../../../../../rig/kit.js';
import { vessel } from '../../../../../rig/cutaway.js';
import { pcb, spring, cable, button } from '../../../../../rig/parts.js';
import { section } from '../../../../../rig/section.js';

const PROFILE_BODY = [
  [0, 0], [.145, 0], [.185, .012], [.208, .045], [.218, .085],
  [.218, .185], [.210, .222], [.190, .245], [.176, .252],
];
// nồi trong: đáy rộng, miệng hơi loe
const PROFILE_POT = [
  [0, 0], [.140, 0], [.146, .008], [.150, .032], [.150, .060], [.150, .165], [.153, .172],
];

export const Y = {
  base: 0.022,      // mặt trên của đáy vỏ
  spring0: 0.024,   // chân lò xo
  bead: 0.053,      // tâm viên cầu
  plate0: 0.040,    // đáy mâm nhiệt
  plate1: 0.048,    // mặt trên mâm nhiệt = đáy nồi trong
  pot0: 0.048,      // đáy nồi trong (nồi trong đặt ngồi lên mâm nhiệt)
  pot1: 0.220,      // miệng nồi trong
};

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
  const alu = toon('#79808b');

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
  const domeOut = [[.176, 0], [.190, .006], [.184, .014], [.160, .034], [.115, .052], [.055, .064], [0, .068]];
  const domeIn = [[.166, -.002], [.180, .004], [.174, .012], [.152, .030], [.108, .046], [.050, .056], [0, .060]];
  const domeProf = [...domeOut, ...domeIn.slice().reverse(), domeOut[0]];
  lidBody.add(mesh(new THREE.LatheGeometry(domeProf.map(p => new THREE.Vector2(p[0], p[1])), 48), bodyMat));
  // vành nắm
  lidBody.add(mesh(new THREE.TorusGeometry(.186, .008, 8, 44), accentMat, [0, .004, 0], { rot: [Math.PI / 2, 0, 0] }));
  // lỗ thoát hơi: một hốc nhỏ trên nắm
  const vent = new THREE.Group(); vent.position.set(.085, .056, .02);
  vent.add(mesh(new THREE.CylinderGeometry(.020, .024, .012, 18), toon('#b9b2a4'), [0, .002, 0]));
  vent.add(mesh(new THREE.CylinderGeometry(.015, .015, .020, 18), toon('#2b2f3a'), [0, -.008, 0]));
  lidBody.add(vent);
  // núm cầm
  const knob = new THREE.Group(); knob.position.set(0, .068, 0);
  knob.add(mesh(new THREE.CylinderGeometry(.030, .036, .022, 20), accentMat, [0, .011, 0]));
  knob.add(mesh(new THREE.SphereGeometry(.030, 16, 12), accentMat, [0, .030, 0]));
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
  const btn = button({ r: .022, color: '#c8cdd8', bezel: '#5b6270', size: .9 });
  btn.rotation.x = Math.PI / 2; btn.position.set(.050, .008, .020);
  panel.add(btn);
  // nhãn nhỏ dưới nút
  panel.add(mesh(rbox(.052, .012, .004, .003), toon('#8b8f9c'), [.050, -.028, .020]));
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
  // vành thành đứng quanh chân nồi: một vòng nhôm dựng lên, thành 8 mm
  const collar = mesh(new THREE.LatheGeometry([
    [.164, Y.plate1 - .002], [.173, Y.plate1 - .002], [.173, Y.plate1 + .034], [.164, Y.plate1 + .034], [.164, Y.plate1 - .002],
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
  // một đĩa nhỏ ở lõ mâm: chỗ đặt lò xo
  inside.add(mesh(new THREE.CylinderGeometry(R_HOLE, R_HOLE, .004, 28), toon('#9aa0aa'), [0, Y.plate0 + .004, 0]));

  // ── dây điện trở: một vòng xoắn quanh vành mâm nhiệt ────────────────────
  // Đây là thứ người xem phải nhìn ra được ở câu "quanh thành là dây điện trở
  // xoắn lại". Dây thật của nồi cơm xoắn TIGHT quanh thành (vòng sát nhau),
  // khác hẳn một lò xo phòng sự có vòng thưa. Bốn vòng sát nhau cho ra một
  // dải dây sợi nhỏ mà vẫn là một cuộn xoắn rõ ràng. Dây quấn đúng quanh
  // vành thành của mâm nhiệt, nên từ ngoài nhìn vào thấy dây ôm lấy cái đĩa.
  const coilMat = toon('#8a6248');
  const coilPts = [];
  for (let i = 0; i <= 240; i++) {
    const u = i / 240, a = u * 2 * Math.PI * 4;
    coilPts.push(new THREE.Vector3(Math.cos(a) * .178, .038 + u * .048, Math.sin(a) * .178));
  }
  const coilCurve = new THREE.CatmullRomCurve3(coilPts);
  const coil = mesh(new THREE.TubeGeometry(coilCurve, 320, .0052, 8), coilMat);
  coil.name = 'day-dien-tro';
  // vòng dây điện trở cũng bị cưa: mặt cắt của ống xiên là một dải dẹt dài,
  // trông như một vải đỏ trải quanh nồi. Để ống rỗng, không tô mặt cắt.
  coil.userData.hollow = true;
  inside.add(coil);
  const coilGlow = new THREE.Mesh(new THREE.TubeGeometry(coilCurve, 320, .0070, 8),
    glowMat('#ff6a1f', 2, { transparent: true, opacity: 0, depthWrite: false }));
  coilGlow.layers.set(1);
  coilGlow.name = 'day-dien-tro-glow';
  inside.add(coilGlow);

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
  const wireMat = toon('#c8402f');
  // Hai dây phải TÁCH RA, mỗi dây một sợi tròn: hai sợi nằm sát nhau thì đọc
  // thành một dải đỏ dẹt trải trên bo, không phải hai sợi dây. Hai sợi cắt nhau
  // một lần (điểm giữa lệch sang hai bên) như một cặp dây xoắn: người xem thấy
  // đây là hai sợi riêng, không phải một vệt sơn.
  const wirePath = [
    [[-.004, .052, -.004], [-.048, .046, -.013], [-.088, .036, -.024]],
    [[-.016, .043, -.021], [-.046, .038, -.033], [-.100, .030, -.044]],
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
  const pot = vessel(PROFILE_POT, { thick: .012, cut: 0, shell: alu, face: toon('#5f6672'), shine: false });
  potRoot.add(pot.group);
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
  potRoot.position.y = Y.pot0;
  const potCut = section(potRoot, { normal: [0, 0, 1], at: 0 });

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
  // lò xo và viên cầu thêm vào sau khi cưa, nên chúng giữ nguyên khối
  g.add(focus);

  // các điểm neo để máy quay bám vào, và để đặt làn nhiệt
  g.beadPos = new THREE.Vector3(0, Y.bead, 0);
  g.platePos = new THREE.Vector3(0, Y.plate0 + .011, 0);
  g.potBottom = new THREE.Vector3(0, Y.pot0, 0);
  g.potMouth = new THREE.Vector3(0, Y.pot1, 0);
  g.potRadius = .150;
  g.chipPos = new THREE.Vector3(-.100, Y.base + .012, -.040);

  // ── đèn báo: một đèn nhỏ trên vành vỏ, phía sau (phía trước đã bị cưa mất) ──
  // Đèn đứng trên vành sau của vỏ — vành sau là vành còn nguyên sau khi cưa. Đèn
  // phải nằm trong khoảng trống dưới vòm nắp, không đụng vào vỏ nắp.
  const lampGrp = new THREE.Group();
  lampGrp.rotation.y = Math.PI / 2;                    // cùng hệ toạ độ với vỏ
  const lampBox = new THREE.Group(); lampBox.position.set(.164, .252, 0);
  lampBox.add(mesh(rbox(.024, .014, .016, .004), toon('#3a3f4c'), [0, .005, 0]));
  const lens = mesh(new THREE.SphereGeometry(.0065, 12, 8), glowMat('#ff4a3a', 1.6), [0, .012, -.005], { cast: false });
  fxLayer(lens); lampBox.add(lens);
  lampGrp.add(lampBox);
  g.add(lampGrp);

  // mâm nhiệt sau khi cưa: bản còn lại trong khung, không phải bản gốc đã bị cưa mất
  let plateCut = null;
  insideCut.group.traverse(o => { if (o.isMesh && o.name === 'mam-nhiet') plateCut = o; });
  g.plate = plateCut || plate;
  g.lamp = lens;
  g.potCut = potCut.group;
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
