// Nồi cơm điện bị cưa ngang: vỏ nồi, nồi trong (thành có độ dày, lòng rỗng), mâm nhiệt
// tròn có lõ mâm nhiệt, dây điện trở xoắn quanh vành mâm, lò xo nhấn viên cầu đầu dò
// nhiệt vào đáy nồi, hai dây mảnh chạy xuống bo mạch.
// Dựng nguyên vật trước, rồi cưa bằng section() — mặt cắt được tô đúng màu vật.
import * as THREE from 'three';
import { toon, glowMat, rbox, mesh, fxLayer, PAL, clamp, canvasTex } from '../../../../../rig/kit.js';
import { vessel } from '../../../../../rig/cutaway.js';
import { pcb, chip, spring } from '../../../../../rig/parts.js';
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

// Mặt trên của một con chip trong bộ khoá của bo mạch: vỏ epoxy đen có chữ in
// mờ. Ở cận cảnh, một khối đen trơn không viền không chi tiết đọc ra như một
// mảng bị đen, không phải một linh kiện. Đổi vỏ sang xám sáng, chữ in đậm:
// con chip phải nhìn ra là một con chip.
function chipTopTex() {
  return canvasTex(256, 256, (x, W, H) => {
    x.fillStyle = '#7a818c'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#20242a';
    x.font = 'bold 34px monospace'; x.textAlign = 'center';
    x.fillText('IC-7404', W / 2, H * .52);
    x.font = '24px monospace'; x.fillText('2416', W / 2, H * .70);
    x.beginPath(); x.arc(W * .16, H * .16, 13, 0, Math.PI * 2);
    x.fillStyle = '#3a4048'; x.fill();
    // vài chân nhựa mờ ở mép vỏ, để mép vỏ không phẳng như một tấm bìa
    x.strokeStyle = 'rgba(32,36,42,.55)'; x.lineWidth = 4;
    x.strokeRect(6, 6, W - 12, H - 12);
  });
}

// sửa một cụm linh kiện: vỏ chip xám sáng, chữ in đậm, thân chip bớt chìm
function lightChips(group) {
  group.traverse(o => {
    if (!o.isMesh || !o.material) return;
    for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
      if (!m.color) continue;
      if (m.map) {
        // chỉ mặt trên chip (vân 256×256) được đổi; vân của bo mạch giữ nguyên
        if (m.map.image && m.map.image.width === 256) {
          m.map = chipTopTex();
          m.color.set('#ffffff');
          m.emissive = new THREE.Color('#2b3038');
          m.needsUpdate = true;
        }
        continue;
      }
      if (m.color.getHexString() !== '1d1f24') continue;
      m.color.set('#8e97a4');
      m.emissive = new THREE.Color('#4a525e');
    }
  });
}

// Con IC ở cuối hai dây: vỏ xám sáng, ký hiệu in trên mặt trên và mặt trước,
// hai hàng chân cắm vào bo. Vỏ epoxy đen của chip trong bộ khoá, khi soi cận
// cảnh, đọc ra là một hộp xám không vân đặt trên bo, không phải một linh kiện.
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
  // Ký hiệu in ở cả ba mặt có thể quay về phía máy: con chip nhìn từ bất kỳ
  // góc nào cũng phải đọc ra là một linh kiện có ký hiệu, không phải một hộp.
  g.add(mesh(new THREE.BoxGeometry(w, h, d), [front, body, top, body, front, body], [0, h / 2 + h * .4, 0]));
  // hai hàng chân: mỗi bên tám chân, chân bẻ xuống cắm vào bo
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
  // một hàng chân dọc mặt gần: máy quay nhìn thẳng vào mặt này, mặt không có
  // chân thì đọc ra là một khối đặc, không phải một linh kiện có chân cắm
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
  const root = new THREE.Group();
  const shellMat = toon(opts.shell || '#e7e2d6');
  // Thành nồi trong phải tối: một thành sáng, dưới đèn nồi, thành một mảng kem
  // trơn chiếm nửa khung — người xem không đọc ra đó là thành nồi, và mắt cũng
  // không đi vào đáy nồi. Thành tối thì đáy nồi mới là thứ được nhìn thấy.
  const alu = toon('#8b929e');

  // ── vỏ nồi ──
  const shell = vessel(PROFILE_BODY, { thick: .022, cut: 0, shell: shellMat, face: toon('#cdc6b6') });
  root.add(shell.group);

  // ── bo mạch ở đáy nồi ──
  // Bo không mang thêm linh kiện: ba tụ điện của hàm pcb() mọc lên cao hơn mâm
  // nhiệt, nhìn từ trên xuống thì đọc ra ba trụ xanh-trắng đứng không lý do
  // trên mâm nhiệt. Bo trần chỉ có vân mạch in, con chip thật là con chip dưới
  // đây, đặt ở cuối hai dây.
  const board = pcb({ w: .30, d: .20, seed: 12, parts: false });
  board.position.set(0, Y.base, -.055);
  // trong bóng đáy nồi, thân chip đen tuyệt đối đọc như một lỗ hổng: làm nó thành
  // xám than và có chút sáng tự phát để vẫn thấy là một con chip.
  lightChips(board);
  root.add(board);

  // ── chân đỡ mâm nhiệt: ba cột nhỏ, để giữa trống cho lò xo và bo mạch ──
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2 + .5;
    root.add(mesh(new THREE.CylinderGeometry(.013, .015, Y.plate0 - Y.base, 10),
      toon('#8d93a0'), [Math.cos(a) * .088, (Y.base + Y.plate0) / 2, Math.sin(a) * .088]));
  }

  // ── mâm nhiệt: một đĩa nhôm tròn, có lõ ở giữa và vành nhô lên ──
  // Đĩa tròn là thứ người xem phải nhìn ra được ở câu "mâm nhiệt tròn".
  const R_PLATE = .158, R_HOLE = .022;
  const plateProf = [
    [R_HOLE, Y.plate0], [.140, Y.plate0], [R_PLATE, Y.plate0 + .006],
    [R_PLATE, Y.plate0 + .020], [.150, Y.plate0 + .022], [.148, Y.plate0 + .008],
    [R_HOLE, Y.plate0 + .008],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const plateMat = toon('#b9bdc4');
  const plate = mesh(new THREE.LatheGeometry(plateProf, 64), plateMat);
  root.add(plate);
  // mặt trên của mâm nhiệt: một đĩa có vân xoắn. Một đĩa trơn sẽ đọc ra như
  // một cái chảo trắng, không phải mâm nhiệt; vân xoắn là dấu hiệu của đĩa
  // điện trở nóng.
  const spiralTex = canvasTex(1024, 1024, (c, w, h) => {
    c.fillStyle = '#b9bdc4'; c.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    c.strokeStyle = '#868c97'; c.lineWidth = 16; c.lineCap = 'round';
    c.beginPath();
    for (let i = 0; i <= 1600; i++) {
      const u = i / 1600, a = u * Math.PI * 2 * 5, r = 46 + u * (w / 2 - 70);
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.stroke();
    c.strokeStyle = '#7c828d'; c.lineWidth = 12;
    c.beginPath(); c.arc(cx, cy, w / 2 - 26, 0, 7); c.stroke();
  });
  root.add(mesh(new THREE.CircleGeometry(.146, 64), toon('#ffffff', { map: spiralTex }),
    [0, Y.plate1 + .0006, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }));
  // một đĩa nhỏ ở lõ mâm: chỗ đặt lò xo
  root.add(mesh(new THREE.CylinderGeometry(R_HOLE, R_HOLE, .004, 28), toon('#9aa0aa'), [0, Y.plate0 + .004, 0]));

  // ── dây điện trở: một vòng xoắn quanh vành mâm nhiệt ──
  // Đây là thứ người xem phải nhìn ra được ở câu "quanh thành là dây điện trở xoắn lại":
  // một cuộn dây tròn thật, đứng quanh vành, nóng lên thể đỏ.
  // Dây nằm ngoài vành mâm (r = 165 mm), trong khoảng trống giữa đáy nồi trong và
  // vỏ nồi, nên khi nồi trong còn ở trong khung thì dây vẫn kín; khi bỏ nồi trong
  // đi thì dây lộ ra thành một cuộn xoắn rõ ràng.
  const coilMat = toon('#8a6248');
  const coilPts = [];
  for (let i = 0; i <= 150; i++) {
    const u = i / 150, a = u * 2 * Math.PI * 2;
    coilPts.push(new THREE.Vector3(Math.cos(a) * .165, .038 + u * .048, Math.sin(a) * .165));
  }
  const coilCurve = new THREE.CatmullRomCurve3(coilPts);
  const coil = mesh(new THREE.TubeGeometry(coilCurve, 240, .0052, 8), coilMat);
  coil.name = 'day-dien-tro';
  // vòng dây điện trở cũng bị cưa: mặt cắt của ống xiên là một dải dẹt dài,
  // trông như một vải đỏ trải quanh nồi. Để ống rỗng, không tô mặt cắt.
  coil.userData.hollow = true;
  root.add(coil);
  const coilGlow = new THREE.Mesh(new THREE.TubeGeometry(coilCurve, 240, .0070, 8),
    glowMat('#ff6a1f', 2, { transparent: true, opacity: 0, depthWrite: false }));
  coilGlow.layers.set(1);
  coilGlow.name = 'day-dien-tro-glow';
  root.add(coilGlow);

  // ── lò xo nhấn viên cầu ──
  // Lò xo là một cuộn dây thật có vòng hở, đọc ra là lò xo chứ không phải một đống xám.
  // Lò xo và viên cầu không nằm trong phần bị cưa: chúng là tâm của cảnh, phải
  // giữ tròn trọn thì người xem mới tin được là lò xo đang ép viên cầu xuống.
  const focus = new THREE.Group();
  const sp = spring({ r: .014, len: .026, turns: 6, wire: .0024, color: '#9aa3b2' });
  sp.position.set(0, Y.spring0, 0);
  focus.add(sp);
  // chân lò xo: một bản nhỏ trên bo mạch
  focus.add(mesh(rbox(.046, .010, .046, .004), toon('#6b7280'), [0, Y.spring0 - .004, 0]));

  // ── viên cầu đầu dò nhiệt: một hạt cầu thật, nằm trên lò xo ──
  // Đầu dò nhiệt dạng hạt là một quả cầu nhỏ. Trụ kem có nắp xám ở trên đọc ra
  // như một nắp nút: người xem không đọc được đó là viên cầu, mà câu kể lại gọi
  // đúng nó là viên cầu. Một khối cầu có bóng đổ và viền mực thì không nhầm
  // được, và vẫn là một vật thật để dựng.
  const bead = new THREE.Group(); bead.position.set(0, Y.bead, 0);
  bead.add(mesh(new THREE.SphereGeometry(.0096, 24, 18), toon('#f2e9d4')));
  // que ép: đầu dò nhiệt đẩy thẳng vào đáy nồi. Đầu que chạm đúng mặt trong của
  // đáy nồi (y = 60 mm), nên câu "lò xo ép nó vào đáy nồi" mới đúng trong hình.
  bead.add(mesh(new THREE.CylinderGeometry(.0034, .0034, .013, 12), toon('#b9bfc8'), [0, -.0122, 0]));
  focus.add(bead);

  // ── hai dây mảnh từ viên cầu chạy xuống bo mạch ──
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
    root.add(w);
    // hai đầu sợi có nắp tròn: ống tròn không có nắp, đầu hở đọc ra như một
    // cái lưỡi dẹt úp xuống
    for (const e of [0, 1]) {
      const pt = curve.getPoint(e);
      root.add(mesh(new THREE.SphereGeometry(.0011, 10, 8), wireMat, [pt.x, pt.y, pt.z]));
    }
  }

  // ── con chip đo nhiệt độ, ở cuối hai dây ──
  const ic = chipIC({ w: .044, d: .044, h: .009 });
  ic.position.set(-.100, Y.base + .006, -.040);
  root.add(ic);

  // ── nồi trong: thành nhôm có độ dày, lòng rỗng ──
  // Nồi trong được cưa riêng, nên câu nào cần thấy mâm nhiệt (c7) thì ẩn nồi đi.
  const potRoot = new THREE.Group();
  const pot = vessel(PROFILE_POT, { thick: .012, cut: 0, shell: alu, face: toon('#7f8792') });
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

  // ── cưa ngang: mặt phẳng z = 0, phía bị bỏ là phía +z (về phía máy quay) ──
  const cut = section(root, { normal: [0, 0, 1], at: 0 });
  const g = cut.group;
  g.name = 'nồi cơm điện bị cưa ngang';
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
  const lampBox = new THREE.Group(); lampBox.position.set(0, .252, -.120);
  lampBox.add(mesh(rbox(.040, .018, .020, .006), toon('#3a3f4c'), [0, .006, 0]));
  const lens = mesh(new THREE.SphereGeometry(.008, 12, 8), glowMat('#ff4a3a', 1.6), [0, .016, .005], { cast: false });
  fxLayer(lens); lampBox.add(lens);
  g.add(lampBox);

  g.plate = plate;
  g.lamp = lens;
  g.potCut = potCut.group;
  // dây điện trở xoắn quanh vành: ở cận cảnh nó là một vòng đỏ dẹt chắn cả
  // khung, và người xem tưởng đó là hai sợi dây. Ở những câu kể về dây mảnh thì
  // vòng dây điện trở phải ẩn đi.
  g.setCoil = v => {
    cut.group.traverse(o => { if (o.name && o.name.startsWith('day-dien-tro')) o.visible = v; });
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
