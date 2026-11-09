// Nơi chốn của tập 03 — ba nơi, mỗi nơi một tầng của câu trả lời.
//
// N1 · bàn bếp   — hiện tượng đời thường, thí nghiệm hai chai, lời khuyên.
// N2 · trong thành chai — vật liệu bị kéo giãng hai hướng, nóng quá thì trượt.
// N3 · trong bụng chai — khí bị giam: nóng thì đẩy ra, nguội thì hút vào.
//
// Quy ước: một đơn vị = một mét. Mặt bàn ở y = 0, tường sau ở z = 0,
// máy quay luôn nhìn từ phía +z.
import * as THREE from 'three';
import { PAL, toon, rbox, mesh, canvasTex, glowMat, fxLayer, mulberry, lerp, clamp } from '../../../../rig/kit.js';
import { keyLight, ambience } from '../../../../rig/lights.js';
import { kitchen, clock, kettle, towel } from '../../../../rig/sets.js';
import {
  createBottle, createPreform, createThermometer, createGauge, createChains,
  createWaterSurface, createWallSlice, createSteam, createArrows, createHand, createCap, createMug,
} from './props.js';

export function buildKitchen(scene) {
  const S = kitchen(scene, { time: 'morning', props: true });
  const g = S.group || scene;
  const F = S.focus;                       // vùng đặt vật: trên mặt bàn, trước cửa sổ

  // Hai chai thí nghiệm, giống hệt nhau:
  //   A · hở nắp  — rót nước sôi vào, khí thoát ra được, thành co và nhăn.
  //   B · có nắp — vặn kín lúc còn nóng, thành phồng; để nguội thì bị hút méo.
  // Một chai thứ ba (C) chỉ dùng cho cảnh lời khuyên ở cuối tập.
  const A = createBottle({ cap: false, label: true });
  const B = createBottle({ cap: true, label: true, morph: 1 });
  B.setCap(false);
  const C = createBottle({ cap: false, label: true });
  const rowZ = F.z + .04;
  A.group.position.set(F.x - .22, 0, rowZ);
  // Hai chai thí nghiệm phải **cùng z**: lệch sâu thì trong khung hai chai
  // lệch cỡ, và người xem đọc "hai chai khác nhau" thay vì "hai chai giống
  // hệt nhau" (đó là điều câu c5 nói).
  B.group.position.set(F.x + .05, 0, rowZ);
  C.group.position.set(F.x + .34, 0, rowZ - .04);
  for (const b of [A, B, C]) g.add(b.group);

  // ấm siêu tốc (bộ có sẵn của rig đã có một chiếc; thêm chiếc thứ hai ở đây
  // để rót nước sôi ngay trong khung) và cốc để đổ nước ra
  const pot = kettle('#4f86a8');
  // Ấm đứng **xa sang trái và đằng sau**: ở c5 (hai chai giống hệt nhau) vòi
  // ấm cắt ngang mép trái khung là một mảng xanh vô nghĩa, mà câu kể cả hai
  // chai phải đứng được ngay giữa khung.
  pot.position.set(F.x - .82, 0, rowZ - .12);
  pot.rotation.y = 0;                        // vòi hướng sang +x: rót vào chai bên phải
  g.add(pot);
  // cốc: nước sôi rót ra từ ấm, đứng trên bàn từ đầu tập để nguội; cuối tập
  // nước đã nguội được rót vào chai sạch rồi vặn nắp
  const cup = createMug('#d7ae63', '#bfe4f2');
  cup.position.set(F.x + .46, 0, rowZ + .10);
  cup.scale.setScalar(.72);            // cốc nhỏ: miệng ở y = 0,1224, mặt nước ở y = 0,108
  // Hơi nước bốc từ cốc: ở cận cảnh nó to bằng cái chai và đọc ra một vật lạ,
  // lại che mất mặt đồng hồ nhiệt kế ở c62. Trong phim nó **không bốc** (vật dựng
  // trong danh mục giữ nguyên: đó là dấu hiệu nước sôi của cốc).
  const cupSteam = cup.getObjectByName('hoi-nuoc-coc');
  if (cupSteam) cupSteam.visible = false;
  g.add(cup);

  // nhiệt kế bếp có đầu dò: que cắm trong nước sôi ở cốc, mặt đồng hồ quay
  // về phía máy.
  //
  // Nó **không** đứng trong miệng chai A. Lý do: mặt đồng hồ nằm ngay trên
  // miệng chai, nên nó che hết cột hơi nước — mà cột hơi nước ở miệng chai
  // chính là hình phim cần thấy rõ nhất. Đứng trong cốc thì đồng hồ vẫn đọc
  // được (đầu dò cắm trong nước sôi của chính ấm đó) mà miệng chai thì trống.
  const th = createThermometer();
  th.group.position.set(cup.position.x - .014, .012, cup.position.z + .006);
  th.group.rotation.set(.10, 0, .05);
  g.add(th.group);

  // đồng hồ áp suất: **vặn vào nắp chai B** (nắp vặn kín ở c37), nên nó đo đúng
  // áp suất bên trong chai và không đứng lơ lửng trên bàn như một cái đồng hồ bàn.
  const gg = createGauge({ R: .020 });
  gg.group.position.set(0, .0305, 0);   // đáy mặt đồng hồ nằm ngay trên đỉnh nắp
  gg.group.rotation.x = -.12;
  B.cap.add(gg.group);

  // Hai mẩu preform trên mặt bàn:
  //   pre  — mẩu chuẩn, không bao giờ nong: đứng cạnh chai A đang co (c29),
  //          làm thước đo "hình cũ" của vật liệu.
  //   pre2 — mẩu thí nghiệm: người xem thấy nó nong thành chai (c9), rồi bàn tay
  //          cầm cái chai đó đi khỏi mặt bàn.
  const pre = createPreform();
  pre.group.position.set(F.x - .54, 0, rowZ + .15);
  pre.group.rotation.y = .5;
  g.add(pre.group);
  const pre2 = createPreform();
  pre2.group.position.set(F.x - .42, 0, rowZ + .24);
  pre2.group.rotation.y = -.35;
  g.add(pre2.group);

  // hơi nước bốc lên từ miệng chai A: cột cao, đáy rộng bằng miệng chai
  // Cột hơi nước phải **mỏng hơn miệng chai**: cột to là nó che mất miệng
  // chai và dòng nước sôi đang rót vào.
  const steam = createSteam({ n: 24, h: .100, r0: .0015, r1: .0045, size: .0060, alpha: .20 });
  steam.group.position.set(A.group.position.x, .21, rowZ);
  g.add(steam.group);

  // hơi nước ở miệng chai B: chai B cũng đang có nước sôi bên trong (hai chai giống
  // hệt nhau), và người xem phải thấy nó **còn nóng** trước khi nắp vặn lên. Không
  // thì chai B sẽ phồng lên mà không ai biết vì sao.
  const steamB = createSteam({ n: 26, h: .085, r0: .0015, r1: .0040, size: .0080, alpha: .30 });
  steamB.group.position.set(B.group.position.x, .21, rowZ);
  g.add(steamB.group);

  // Mũi tên áp lực chỉ có **bên trong chai** (N3): đặt ngoài thì đọc ra là gai
  // đâm vào thân chai, không phải áp lực đẩy thành ra.

  // nắp chai rời nằm sấp trên mặt bàn cạnh chai C: cuối tập, tay cầm nó lên
  // và vặn vào miệng chai C. Nắp phải **có mặt trên màn hình** — một cái nắp
  // chỉ được nhắc tới trong lời kể thì người xem không biết nó trông thế nào.
  // Nắp rời nằm sấp trên mặt bàn **sát chân chai B** (cách chân ~10 cm), ở
  // 1/3 phải khung c59 — đó là vật câu đó gọi tên, nó phải thấy được.
  const cap = createCap();
  cap.group.position.set(B.group.position.x + .055, .0152, rowZ + .03);
  cap.group.rotation.x = Math.PI / 2;          // nằm nghiêng, mặt ren hướng về máy
  g.add(cap.group);

  // bàn tay: rót nước, vặn nắp, đổ nước ra cốc
  const hand = createHand();          // cỡ .45: một bàn tay ~25 cm
  hand.group.position.set(F.x - .40, .05, rowZ + .06);
  g.add(hand.group);

  // **Vệt nắng cửa sổ** trên mặt bàn. Khung mở đầu (c1) và khung lời khuyên
  // (c60) không có vệt sáng này thì bàn bếp đọc ra một cảnh đêm trong nhà: mặt
  // bàn chỉ nhận ánh sáng trời xanh, còn nguồn sáng ấm từ cửa sổ không rơi vào
  // khung. Đây là **ánh sáng**, không phải vật: một mảng gradient cộng lên mặt
  // bàn, mềm cả bốn cạnh để không có mép cứng.
  const patch = new THREE.Mesh(
    new THREE.PlaneGeometry(2.9, 2.0),
    new THREE.MeshBasicMaterial({
      map: canvasTex(256, 256, (c, w, h) => {
        c.clearRect(0, 0, w, h);
        const gr = c.createLinearGradient(0, 0, 0, h);
        gr.addColorStop(0, 'rgba(255,238,196,.52)');
        gr.addColorStop(1, 'rgba(255,204,126,.10)');
        c.fillStyle = gr; c.fillRect(0, 0, w, h);
        c.globalCompositeOperation = 'destination-in';
        const m = c.createRadialGradient(w / 2, h / 2, w * .16, w / 2, h / 2, w * .62);
        m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = m; c.fillRect(0, 0, w, h);
      }),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
  patch.rotation.x = -Math.PI / 2;
  patch.position.set(F.x + .05, .004, F.z + .02);
  g.add(patch);

  // **Ánh sáng bật lên từ mặt bàn**: đèn chính của rig đi xuyên qua lỗ cửa sổ,
  // nên mặt trước của vật ở bàn chỉ nhận đèn trời xanh. Một nguồn sáng ấm
  // nhỏ ở phía trước-trái (như ánh sáng bật lên từ mặt bàn gỗ) làm mặt
  // trước của chai và ấm ấm lên — nếu không, khung mở đầu đọc ra một cảnh
  // đêm trong nhà.
  const bounce = new THREE.PointLight('#ffd2a0', 1.5, 3.4, 2);
  bounce.position.set(F.x - .45, .45, F.z + .60);
  g.add(bounce);

  return {
    group: g, key: S.key, amb: S.amb, focus: F, cams: S.cams, clear: S.clear,
    A, B, C, pot, cup, th, gg, pre, pre2, steam, steamB, hand, cap, clock: S.clock,
    // toạ độ thật của từng vật, để phim không phải gõ tay
    pos: {
      A: [A.group.position.x, 0, A.group.position.z],
      B: [B.group.position.x, 0, B.group.position.z],
      C: [C.group.position.x, 0, C.group.position.z],
      pre: [pre.group.position.x, 0, pre.group.position.z],
      pre2: [pre2.group.position.x, 0, pre2.group.position.z],
      gg: [B.group.position.x, .241, B.group.position.z],
      cup: [cup.position.x, 0, cup.position.z],
      pot: [pot.position.x, 0, pot.position.z],
      cap: [cap.group.position.x, cap.group.position.y, cap.group.position.z],
    },
    update(t, { light = 1 } = {}) { S.update(t, { light }); },
  };
}

// ── N2 · trong thành chai ────────────────────────────────────────────────
// Thành chai phóng to như một bức tường cong; hai bộ móc xích nằm ngay
// trong lớp nhựa: một bộ theo vòng quanh thân, một bộ theo chiều dọc.
export function buildInsideWall(scene) {
  const g = new THREE.Group(); g.name = 'trong-thanh-chai';
  scene.background = new THREE.Color('#0d1024');
  scene.fog = new THREE.Fog('#141a38', 2.2, 9);
  const focus = new THREE.Vector3(0, 0, 0);

  // cỡ thật của cảnh: bán kính 0,27 m, cao 0,18 m — móc xích nằm trong lớp này.
  // Lớp nhựa trong suốt: người xem phải thấy móc xích nằm **bên trong** nó.
  // Nó phải **đọc được là nhựa**, không phải một mảng tối: nên độ trong suốt
  // cao hơn và có ánh sáng phụ từ phía máy.
  const wall = createWallSlice({ R: .27, th: .0108, h: .18, opacity: .42 });
  wall.group.position.set(0, 0, 0);
  g.add(wall.group);

  const chains = createChains({ R: .256, N: 40, linkL: .038, axialN: 7, axialStep: .024, axialL: .022, tube: .0038, axialR: .250 });
  chains.group.position.set(0, 0, 0);
  g.add(chains.group);

  // vệt nhiệt cam ăn vào thành: một mảng sáng loang dần
  const heat = mesh(new THREE.SphereGeometry(.055, 24, 16), glowMat('#ff7a2a', 1.4), [0, -.02, -.16], { cast: false });
  heat.scale.set(1.4, .55, .35);
  fxLayer(heat); g.add(heat);

  const key = keyLight(scene, { from: new THREE.Vector3(.35, .5, .75), to: focus, color: '#ffd9a0', intensity: 2.6, size: 2.2, far: 12 });
  // N2 còn một nguồn sáng phụ từ phía máy: vệt nhiệt cam chỉ xuất hiện ở c21, nên
  // lượt N2 đầu (c13–c16) phải có ánh sáng riêng, không được tối mịt. Nó phải
  // **đủ sáng để đọc lớp nhựa cong**, không phải một vệt tối trên nền tối.
  const fillFront = keyLight(scene, { from: new THREE.Vector3(.10, .16, .95), to: focus, color: '#cfe2ff', intensity: 2.4, size: 1.6, far: 6 });
  const amb = ambience(scene, { sky: '#4a5aa0', ground: '#2a1a30', fill: .80, rim: '#a07cff', rimI: .8, rimFrom: [-2, 2, 2] });
  scene.add(g);
  return { group: g, key, amb, focus, wall, chains, heat, clear: .6 };
}

// ── N3 · trong bụng chai ─────────────────────────────────────────────────
// Nhìn từ trong ra: mặt nước sôi ở dưới, thành chai bao quanh, hơi nước
// bốc lên, mũi tên vàng đẩy từ trong ra.
export function buildInsideBottle(scene) {
  const g = new THREE.Group(); g.name = 'trong-bung-chai';
  scene.background = new THREE.Color('#0b1428');
  scene.fog = new THREE.Fog('#101a34', 1.6, 7);
  const focus = new THREE.Vector3(0, .05, 0);

  // thành chai từ bên trong: một lathe quay ngược mặt
  const inner = mesh(new THREE.CylinderGeometry(.031, .031, .17, 40, 1, true),
    toon('#9fd0e0', { side: THREE.BackSide, transparent: true, opacity: .35 }), [0, .085, 0]);
  g.add(inner);
  const bottom = mesh(new THREE.CircleGeometry(.031, 40), toon('#8fc6d8', { side: THREE.DoubleSide }), [0, .002, 0], { rot: [-Math.PI / 2, 0, 0] });
  g.add(bottom);

  // trong N3, thành chai của cảnh đã làm việc của "cổ chai quanh mặt nước"
  const water = createWaterSurface({ R: .0295, y: .012, rim: false });
  g.add(water.group);

  // trong N3 máy quay rất gần: búp hơi nước phải nhỏ, nếu không chúng thành
  // những quả bóng trắng to đè lên nhau
  const steam = createSteam({ n: 26, h: .060, r0: .003, r1: .008, size: .0045, alpha: .30 });
  steam.group.position.set(0, .16, 0);
  g.add(steam.group);

  const arrows = createArrows({ n: 12, len: .026, rad: .018 });
  arrows.group.position.set(0, .085, 0);
  g.add(arrows.group);

  // vệt nhiệt ở mặt nước: nhiệt loang lên từ nước vào nhựa (c20)
  // Quả cầu nhiệt phải **nằm trong bụng chai** (đường kính thành 6,2 cm) —
  // to hơn thì nó tràn ra ngoài thành và khung chỉ còn một quả cầu cam.
  const heat = mesh(new THREE.SphereGeometry(.05, 24, 16), glowMat('#ff7a2a', .9),
    [0, .016, 0], { cast: false });
  heat.scale.set(.45, .22, .45);
  fxLayer(heat); g.add(heat);

  // nắp ở miệng chai: từ lúc nắp vặn kín (c38), miệng bị chặn lại
  const lid = new THREE.Group(); lid.position.set(0, .166, 0);
  lid.add(mesh(new THREE.CylinderGeometry(.017, .017, .012, 24), toon('#2f8fa0'), [0, 0, 0]));
  lid.add(mesh(new THREE.TorusGeometry(.017, .0022, 8, 24), toon('#2f8fa0'), [0, -.006, 0], { rot: [Math.PI / 2, 0, 0] }));
  lid.visible = false;
  g.add(lid);

  const key = keyLight(scene, { from: new THREE.Vector3(.2, .35, .55), to: focus, color: '#ffe0b0', intensity: 2.4, size: 1.8, far: 8 });
  const amb = ambience(scene, { sky: '#3f4f96', ground: '#241830', fill: .40, rim: '#7ad7ff', rimI: .7, rimFrom: [-1.5, 1.5, 1.5] });
  scene.add(g);
  return { group: g, key, amb, focus, water, steam, arrows, inner, heat, lid, clear: .5 };
}
