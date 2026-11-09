// set.js — ba nơi chốn của tập 04.
//
//   N1  bếp buổi sáng   : hũ thủy tinh có nắp, dây chun quấn quanh, máy sấy tóc, dây thép đối chứng,
//                         một vòng dây chùng chặt bằng ghim.
//   N2  trong sợi dây   : mặt cắt của cao su và mạng chuỗi polymer, với móc liên kết chéo,
//                         vùng nhiệt và một quả cân treo trong lát cắt.
//   N3  bàn đo ban đêm : đồng hồ đo lực, dây chun treo vật nặng, thước, nhiệt kế, máy sấy tóc.
//
// Mỗi bộ trả về { group, focus, cams, key, update } và đặt sẵn vật của tập vào chỗ của nó,
// để film.js chỉ lo chuyển động và máy quay.
import * as THREE from 'three';
import { toon, mesh, rbox, canvasTex, PAL, clamp, lerp, ss, mulberry, fxLayer, glowMat } from '../../../../rig/kit.js';
import { keyLight, ambience, pool, beam } from '../../../../rig/lights.js';
import { kitchen, desk } from '../../../../rig/sets.js';
import { jar, bandRing, bandStrip, strap, jouleBand, hairdryer, steelWire, pin, weight, ruler, thermometer, dynamometer, chain, crosslink, heatFlow, heatFront } from './props.js';

// Tia sáng hình nón mà rig dựng sẵn (beam) chạy ngang qua mặt quầy, và mọi
// cận cảnh của tập này đều nằm ngay trong thể tích đó: máy quay ở trong tia
// sáng, nên tia sáng thành một vệt kem phủ lên cả khung. Tắt nó đi — vật đập
// nền của tập là vật thật trên quầy, không phải vệt sáng.
// Chỉ tắt đúng tia sáng: tia có uniform uCol, còn trời (mặt phẳng gradient)
// có uA + uB nên phải để trời lại.
function noShaft(scene) {
  scene.traverse(o => {
    const u = o.material && o.material.uniforms;
    if (o.isMesh && u && u.uCol && u.uA) o.visible = false;
  });
}

// ── N1: bếp ──────────────────────────────────────────────────────────────
export function buildKitchen(scene) {
  const S = kitchen(scene, { time: 'morning' });
  noShaft(scene);
  // Nắng sớm hơi tối với tấm bàn gỗ; tăng 15 % ánh sáng chính để miệng hũ và
  // vòng dây đọc rõ trong các khung cận cảnh (c1–c8, c42–c48).
  S.key.intensity *= 1.15;
  const F = S.focus;                                   // (-.7, 0, .8)

  // nắp hũ: sợi dây chun quấn quanh nắp, siết chặt hơn khi nóng
  const jar1 = jar({ R: .068, H: .19, lidColor: '#e6dfcd' });
  jar1.position.set(F.x - .13, 0, F.z - .02);
  scene.add(jar1);
  // Dây **đứng** quanh miệng nắp: mỏng theo bán kính, rộng theo chiều cao —
  // đúng dây chun thật quấn quanh nắp hũ, và nhô lên trên miệng nắp.
  // Dây **đứng** quanh miệng nắp: mỏng theo bán kính, rộng theo chiều cao —
  // đúng dây chun thật quấn quanh nắp hũ, và nhô lên trên miệng nắp. Dây chỉ
  // **co lại một chút** khi siết (shrink nhỏ), vì co nhiều thì dây chuiy vào
  // trong nắp và biến mất — mất hẳn cái mà câu kể nói.
  const band1 = bandRing({ R: .075, w: .007, h: .020, color: '#e0465c', shrink: .05 });
  band1.position.set(jar1.position.x, .2055, jar1.position.z);
  scene.add(band1);
  // vết của dây ăn vào rãnh nắp: một vòng mờ ngay dưới mép dây, quanh miệng nắp
  const groove1 = mesh(new THREE.TorusGeometry(.0696, .0022, 8, 32), toon('#a89c88'), [jar1.position.x, .1945, jar1.position.z], { rot: [Math.PI / 2, 0, 0] });
  scene.add(groove1);

  // hũ thứ hai lấy ra từ tủ lạnh (chương bốn) — trước đó nó chưa ở trong cảnh
  const jar2 = jar({ R: .068, H: .19, lidColor: '#e6dfcd' });
  jar2.position.set(F.x + .11, 0, F.z - .02);
  scene.add(jar2);
  const band2 = bandRing({ R: .075, w: .007, h: .020, color: '#e0465c', shrink: .05 });
  band2.position.set(jar2.position.x, .2055, jar2.position.z);
  scene.add(band2);
  const groove2 = mesh(new THREE.TorusGeometry(.0696, .0022, 8, 32), toon('#a89c88'), [jar2.position.x, .1945, jar2.position.z], { rot: [Math.PI / 2, 0, 0] });
  scene.add(groove2);

  // máy sấy tóc: tay cầm cố định ở một chỗ, miệng hướng thẳng về dây.
  // Nó đứng **gần** hũ (cách .37 m) để một khung hình ngắn vừa thấy cả máy vừa
  // thấy vòng dây: máy quay xa thì máy chỉ còn là một vệt nhỏ ở mép khung.
  const dry = hairdryer();
  dry.position.set(F.x - .50, .14, F.z);
  scene.add(dry);
  // Nêm sáng ấm **từ phía máy quay**: nắng buổi sáng đi từ cửa sổ ra sau lưng
  // vật, nên mặt máy sấy tóc quay về khung là mặt tối — nó đọc ra là một
  // cụng xanh lơ lửng, không phải cái máy sấy tóc hồng. Nêm này đưa mặt máy
  // về màu thật và cùng lúc kéo nửa phải khung ra khỏi bóng.
  const fillK = new THREE.DirectionalLight('#ffd9b0', 1.7);
  fillK.position.set(F.x - .30, .55, F.z + 1.1);
  fillK.target.position.set(F.x - .50, .16, F.z);
  scene.add(fillK, fillK.target);
  const mouth = dry.mouth.getWorldPosition(new THREE.Vector3());
  // luồng hơi nóng chạy dọc mặt quầy, qua cả dây quanh nắp, dây thép và dây chùng
  const flowHot = heatFlow(mouth, new THREE.Vector3(F.x + 1.05, .13, F.z), { color: '#ffb37a', n: 240, rate: .45, opacity: .15, size: .0035, lift: .05 });
  scene.add(flowHot);
  // một vệt sáng nhẹ từ phía máy quay: để mặt trước của hũ không chìm trong bóng
  pool(scene, { from: new THREE.Vector3(F.x - .10, 1.05, F.z + 1.30), to: new THREE.Vector3(F.x - .10, .14, F.z), color: '#ffe6c4', intensity: .45, angle: .52 });

  // Dây thép mỏng làm đối chứng: một đầu ghim cố định, đầu kia tự do nằm trước
  // một vạch trên thước gỗ — nung nóng thì đầu tự do tiến ra. Nó nằm **sát
  // **vế phải** của quầy: sợi thép có riêng một nhát cận của nó, và nó không cạnh
  // tranh chỗ với vòng dây chùng — vòng dây phải nằm sát hũ để câu "cao su
  // không phải lúc nào cũng co" có được một khung chứa cả hai vật.
  const pinW = pin();
  pinW.position.set(F.x + .70, 0, F.z + .02);
  scene.add(pinW);
  const wire = steelWire({ len: .30, r: .005 });
  wire.position.set(F.x + .70 + .15, .006, F.z + .02);
  scene.add(wire);
  // thước gỗ nằm ngay sau sợi dây, vạch centimet chạy ngang theo hướng dây trượt
  const rul = ruler({ len: .24, w: .05 });
  rul.position.set(F.x + .90, .001, F.z + .02);
  scene.add(rul);

  // Một vòng dây chùng: hai đầu móc lỏng qua hai cái ghim, mỗi đầu lộ ra
  // một đoạn trước ghim; nung nóng thì dây dài ra, hai đầu trượt ra xa hơn.
  // Nó nằm **ngay cạnh hũ** (cách mép hũ chừng 6 cm) và **trong luồng hơi nóng**:
  // nhát "cao su không phải lúc nào cũng co" phải thấy cùng khung cái dây đã
  // siết trên nắp hũ và cái dây chùng này.
  // Ghim nhô lên 8 mm: đầu đĩa của ghim phải **thấy trên mặt dải dây**, thì
  // người xem mới đọc ra "hai đầu dây móc qua hai cái ghim".
  const pinS1 = pin(), pinS2 = pin();
  pinS1.position.set(F.x + .04, .008, F.z + .02); pinS2.position.set(F.x + .28, .008, F.z + .02);
  scene.add(pinS1, pinS2);
  // Dây nằm **phẳng** trên quầy và **rộng** (5 cm) như một dải lương cao su:
  // một sợi mảnh nằm nghiêng nhìn từ trên xuống chỉ là một vệt nhỏ, và khung
  // hình không đọc ra đó là vật chính.
  // Dây nằm trong một nhóm riêng: `setLen(k)` của dải luôn đặt lại trục x của
  // nó về 0 (dải giãn ra quanh giữa), nên đặt thẳng `slack.position` thì vị
  // trí bị ghi đè mỗi khung hình và dải trôi về giữa quầy, lệch khỏi hai ghim.
  const slackG = new THREE.Group();
  slackG.position.set(F.x + .16, .005, F.z + .02);
  scene.add(slackG);
  const slack = bandStrip({ len: .32, w: .050, h: .010, color: '#d8566a', pivot: 'center' });
  slackG.add(slack);

  return {
    ...S, props: { jar1, band1, groove1, jar2, band2, groove2, dry, wire, pinW, rul, pinS1, pinS2, slack, flowHot },
    dryMouth: mouth,
    dryGrip: new THREE.Vector3(F.x - .65, .08, F.z),
  };
}

// ── N2: trong sợi dây ────────────────────────────────────────────────────
// Mặt cắt của khối cao su ở sau, mạng chuỗi ở trước. Mọi thứ ở đây to như bên trong vật.
export function buildInside(scene) {
  scene.background = canvasTex(64, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#40326c'); gr.addColorStop(1, '#251c42');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  scene.fog = new THREE.Fog('#2c2350', 2.9, 6.4);
  const key = keyLight(scene, { from: new THREE.Vector3(.5, 2.0, 1.5), to: new THREE.Vector3(0, 0, 0), color: '#ffe9c8', intensity: 3.5, size: 1.8 });
  const amb = ambience(scene, { sky: '#6f67b2', ground: '#41355f', fill: 1.0, rim: '#b79bff', rimI: 1.15, rimFrom: [-2, 1.6, -1.6] });
  // Nêm sáng mềm từ bên trái: nhóm sợi tiền cảnh (c10, c12–c14, c17) nằm ở
  // x = −0.86, phía tối của nguồn sáng chính; không có nêm này thì cả nhóm
  // chìm vào nền tím và máy đo báo khung tối.
  const fillL = new THREE.DirectionalLight('#ffd9b0', .85);
  fillL.position.set(-1.6, 1.1, 1.4); fillL.target.position.set(-.86, .10, .52);
  scene.add(fillL, fillL.target);

  // vệt sáng từ trên rọi xuống mặt cắt: nguồn sáng **có mặt trong khung**,
  // không phải một căn phòng tối không có gì dẫn mắt.
  // Vệt sáng là **ánh sáng**, không phải một vật: nó không được chặn tia đo của
  // máy, vì hộp của nó là một khối lớn nằm ngang qua cả khung — đo độ phủ mà
  // bị nó che thì máy đo mất vật thật, và khung bị báo là trống.
  const shaft = beam(scene, key, { x0: -.20, x1: .20, y0: 1.20, y1: 1.55, z: -.34, length: 2.6, alpha: .13, color: '#ffe4bc' });
  shaft.raycast = () => {};

  // khối cao su bị cắt: mặt cắt toả ra, sau mạng chuỗi
  const blk = mesh(rbox(7.0, 4.6, .5, .06), toon('#4a3768'), [0, 0, -1.45]);
  scene.add(blk);
  // các lớn của mặt cắt: những vệt màu nhạt hơn, để mặt cắt không phẳng
  const rnd = mulberry(7);
  for (let i = 0; i < 26; i++) {
    const x = (rnd() - .5) * 6.4, y = (rnd() - .5) * 4.0;
    scene.add(mesh(new THREE.CircleGeometry(.07 + rnd() * .16, 12), toon(rnd() > .5 ? '#5c4683' : '#412f66'), [x, y, -1.19], { cast: false }));
  }

  // mạng chuỗi: tám sợi chạy song song theo trục x, đan qua nhau ở độ sâu
  // khác nhau. Hạt **to và sát nhau** (khoảng cách giữa tâm hạt 2,6 cm, đường
  // kính hạt 3,6 cm) nên đọc ra là dây xích, không phải mưa hạt. Sợi đan **sát
  // nhau** (5,5 cm) để khung hình có mật độ đủ: một mạng thưa trên nền tím
  // trông như mưa hạt rơi, và người xem không thấy đó là một mạng.
  const net = new THREE.Group(); scene.add(net);
  const chains = [];
  for (let i = 0; i < 8; i++) {
    const c = chain({ n: 64, bead: .010, len: .82, turns: 5, rad: .026 + (i % 3) * .009, color: i % 2 ? '#f7bd27' : '#ff9a3d', seed: 11 + i });
    c.position.set(0, -.1575 + i * .045, -.20 + (i % 3) * .12);
    c.rotation.x = (i - 3.5) * .10;
    net.add(c); chains.push(c);
  }
  // Họ thứ hai: sợi **xiên**, cắt ngang họ ngang. Một mạng toàn những sợi
  // nằm song song là mấy sợi cạnh nhau, không phải một mạng; hai họ đan vào
  // nhau thì người xem mới thấy "mạng polymer" trong một khung.
  // Sợi xiên **vừa phải**: cả mạng phải nằm gọn trong một khối dưới 1,2 m,
  // nếu không máy coi cả mạng là một vật lớn và bỏ qua nó khi đo độ phủ.
  for (let i = 0; i < 4; i++) {
    const c = chain({ n: 64, bead: .010, len: .72, turns: 5, rad: .022 + (i % 2) * .009, color: i % 2 ? '#ff9a3d' : '#f7bd27', seed: 71 + i });
    c.position.set(0, -.09 + i * .06, -.15 + (i % 2) * .09);
    c.rotation.z = (i % 2 ? 1 : -1) * (.34 + i * .03);
    net.add(c); chains.push(c);
  }
  // Sợi **để nắm**: một sợi xích thò ra khỏi mạng về phía tay, đầu ngoài của
  // nó là một hạt xác định — bàn tay ở c18 nắm **đúng hạt này**. Không có nó
  // thì tay nắm lơ lửng trong khoảng không, và nhát "mình kéo dây ra" không
  // có sợi nào được kéo.
  // Sợi này **ngắn** và **nằm trong nhóm mạng**: nhóm mạng phải còn **dưới
  // 1,2 m** (đường chéo của khối bao quanh nó), nếu không máy đo coi cả mạng
  // là một vật quá cỡ và bỏ qua — mạng biến thành "không có gì trong khung".
  const grab = chain({ n: 16, bead: .011, len: .18, turns: 1.6, rad: .012, color: '#ff9a3d', seed: 131 });
  grab.position.set(.39, .0675, -.08);
  net.add(grab); chains.push(grab);

  // móc liên kết chéo: những cầu nhỏ **vòng quanh hai sợi liền nhau**, giữ
  // mạng không trượt. Vòng vàng to, đặt đúng chỗ hai sợi cắt nhau — móc nối
  // nằm lơ lửng ở chỗ khác thì nó không nối gì cả, và cảnh đọc ra là mấy vòng
  // tròn rơi lơ lửng chứ không phải một mạng.
  const links = [];
  for (let j = 0; j < 6; j++) {
    const l = crosslink({ r: .040, color: '#f0c76a', through: 'x' });
    l.position.set((j % 2 ? .14 : -.14), -.10 + j * .045, -.16 + (j % 3) * .06);
    l.rotation.z = .5 * Math.sin(j * 2.1);
    scene.add(l); links.push(l);
  }

  // vệt nhiệt chạy dọc mạng
  const front = heatFront({ len: 1.2, w: .34 });
  front.position.set(0, 0, .25);
  scene.add(front);

  // dải dây treo giữa hai điểm: vùng nóng thẳng, vùng lạnh thõng.
  // Dải **ngắn và mập** (50 cm × 5,5 cm): một dải dài và mỏng thì chiếm mãi
  // chỗ trống của khung, và người xem không đọc ra đâu là vùng nóng.
  const sag = sagBand({ len: .50, bandW: .055 });
  sag.position.set(0, .74, .58);
  scene.add(sag);

  // nhóm sợi đặt sẵn ở tiền cảnh trái: mỗi sợi một cách cuộn khác nhau.
  // Đây là chỗ các câu "một sợi cuộn thế này", "nhiều cách cuộn", "xếp khác
  // đi" lấy hình — không lấy từ đám hạt trong mạng, vì đám hạt đó nhìn mọi câu
  // giống nhau.
  const fam = strandFamily({ count: 4, len: .70, n: 80, bead: .0075, gap: .075 });
  fam.position.set(-.86, .10, .52);
  scene.add(fam);

  // Một sợi **đơn** ở tiền cảnh, chạy ngang khung: đây là hình riêng cho câu
  // "mỗi chuỗi là một dãy mắt xích dài". Lấy hình từ đám hạt của mạng thì
  // không được — đám hạt đó nhìn mọi câu giống nhau. Ở đây **hạt tách rời**
  // (khoảng cách gấp đôi đường kính hạt) để người xem thấy "một dãy", không
  // phải "một thanh trơn"; sợi hơi xoắn (một vòng) để nó không phải một
  // đường thẳng máy móc.
  const strand = chain({ n: 26, bead: .0085, len: .50, turns: 1.0, rad: .05, color: '#ff9a3d', seed: 91, spread: .12 });
  strand.position.set(-.12, .12, .46);
  strand.setCoil(.55);
  scene.add(strand);

  // hai mạng cạnh nhau để so sánh: bên trái mát, bên phải nóng. Hai cột
  // **đứng**, song song, cách nhau .32 m — người xem thấy ngay cột nào cuộn
  // chặt hơn cột nào.
  const pair = new THREE.Group(); scene.add(pair);
  const cool = [], hot = [];
  for (let i = 0; i < 3; i++) {
    const a = chain({ n: 34, bead: .012, len: .30, turns: 3, rad: .024, color: '#67e8f9', seed: 40 + i });
    a.rotation.z = Math.PI / 2;
    a.position.set(-.16, -.28 + i * .28, (i % 2) * .06);
    pair.add(a); cool.push(a);
    const b = chain({ n: 34, bead: .012, len: .30, turns: 3, rad: .024, color: '#ff8a3d', seed: 60 + i });
    b.rotation.z = Math.PI / 2;
    b.position.set(.16, -.28 + i * .28, (i % 2) * .06);
    pair.add(b); hot.push(b);
  }
  pair.position.set(.52, .30, .46);

  // quả cân nhỏ treo trong lát cắt
  const wgt = weight({ R: .05, H: .11, color: '#c9973a' });
  wgt.position.set(0, -.52, .18);
  scene.add(wgt);

  // hai đoạn dây cùng một mức kéo, mỗi đoạn treo một quả cân nhỏ giữa hai ghim
  const segA = tensionSegment({ len: .30, seed: 2 });
  segA.position.set(-.13, .08, .52);
  // đoạn **nóng**: dải màu cam, để người xem đọc ra nó là dải nóng chứ không
  // phải một dải đỏ nữa — hai dải phải **khác màu** thì câu "dây nóng co chặt
  // hơn dây mát" mới đọc được trong một khung
  const segB = tensionSegment({ len: .30, seed: 5, color: '#ff8a3d' });
  segB.position.set(.13, .08, .52);
  scene.add(segA, segB);

  const focus = new THREE.Vector3(0, 0, 0);
  return {
    group: scene, scene, focus, key, amb,
    cams: {
      wide: [0, .1, 3.1, 0, 0, 0],
      medium: [.5, .35, 1.7, 0, .05, 0],
      close: [.25, .18, .82, 0, .02, 0],
      face: [0, .1, 2.2, 0, 0, -.6],
    },
    props: { blk, net, chains, links, front, sag, pair, cool, hot, wgt, segA, segB, fam, strand },
  };
}

// Một đoạn dây chun ở trạng thái đang kéo căng: hai ghim ở hai đầu, một quả cân nhỏ treo
// giữa. setPull(k): k = 1 là đoạn dây co lại (quả cân nhích lên), k = 0 là dài nguyên.
function tensionSegment({ len = .30, drop = .17, color = '#e0465c' } = {}) {
  const g = new THREE.Group();
  for (const x of [-len / 2, len / 2]) {
    const p = new THREE.Group(); p.position.set(x, .2, 0);
    p.add(mesh(new THREE.CylinderGeometry(.013, .017, .17, 10), toon('#4a5064'), [0, -.085, 0]));
    p.add(mesh(new THREE.CylinderGeometry(.026, .026, .012, 14), toon('#39405a'), [0, .002, 0]));
    g.add(p);
  }
  // Đoạn dây phải **đủ to** để người xem đọc ra nó là một dải dây đang bị kéo:
  // một dải 4 cm và một quả cân 11 cm ở cự ly 30 cm chỉ chiếm một góc khung.
  const band = bandStrip({ len, w: .055, h: .024, color });
  band.position.y = .115; g.add(band);
  const cord = mesh(new THREE.CylinderGeometry(.0045, .0045, drop, 8), toon('#d8d2c0'), [0, .115 - drop / 2, 0]);
  g.add(cord);
  const wgt = weight({ R: .055, H: .11, color: '#c9973a' });
  wgt.position.y = .115 - drop; g.add(wgt);
  g.band = band; g.cord = cord; g.wgt = wgt; g.drop = drop;
  g.setPull = k => {
    const c = clamp(k);
    band.setLen(1 - .18 * c);
    const wy = .115 - drop * (1 - .55 * c);
    wgt.position.y = wy;
    cord.scale.y = (.115 - wy) / drop;
    cord.position.y = (.115 + wy) / 2;
  };
  g.setPull(0);
  return g;
}

// Một nhóm sợi chuỗi đặt cạnh nhau: mỗi sợi một cách cuộn khác nhau.
// Đây là chỗ các câu "một sợi cuộn thế này", "rất nhiều cách cuộn", "xếp khác
// đi thì là một cách khác" lấy hình. Lấy hình từ đám hạt trong mạng thì không
// được: đám hạt đó nhìn mọi câu giống nhau, và câu nào cũng phải có **hình
// riêng** của nó.
function strandFamily({ count = 4, gap = .17, len = .70, n = 34, bead = .0155, color = '#ff9a3d', color2 = '#f7bd27', seed = 200 } = {}) {
  const g = new THREE.Group();
  const list = [];
  for (let i = 0; i < count; i++) {
    const c = chain({ n, bead, len, turns: 4 + (i % 3), rad: .034 + (i % 2) * .016, color: i % 2 ? color2 : color, seed: seed + i * 13, spread: .55 });
    c.position.set(0, (i - (count - 1) / 2) * gap, (i % 2) * .05);
    g.add(c); list.push(c);
  }
  g.chains = list;
  return g;
}

// Một dải dây treo giữa hai ghim: vùng nóng (bên trái) co lại nên bị kéo thẳng,
// vùng lạnh (bên phải) dài ra nên thõng xuống. setSag(cold, taut) là **độ thõng**
// của vùng lạnh (0..1) và **mức bị néo căng** của vùng nóng (0..1).
// Dải là chuỗi khối nhỏ nối tiếp nên nó **cong thật** — một mảng phẳng bị dịch
// xuống thì vẫn là một mảng phẳng, không cong, và mắt người xem đọc ra một thanh
// thẳng chứ không phải một sợi dây thõng.
// Dải quay mặt về phía máy (cao theo trục y, mỏng theo trục z) để chỗ thõng hiện
// ra rõ. Vùng nóng **tự sáng và ửng cam dần theo mức nung** — người xem tắt tiếng
// vẫn biết vùng nào đang nóng, và thấy nhiệt **đi vào** dải chứ không thấy nó
// xuất hiện từ hư không.
function sagBand({ len = .82, bandW = .034, bandT = .012, drop = .16, color = '#e0465c', hotColor = '#ff8a3d', sag0 = .10 } = {}) {
  const g = new THREE.Group();
  const N = 56;
  const cCold = new THREE.Color(color), cHot = new THREE.Color(hotColor);
  // hai ghim giữ hai đầu dải: dải treo giữa hai điểm thì phải thấy hai điểm.
  // Hai ghim **ngang nhau**, nên vùng nóng bị kéo thẳng sẽ là một đường thẳng nằm
  // ngang, còn vùng lạnh thõng xuống thành một vòng tròn treo dưới dây.
  const P0 = new THREE.Vector3(-len / 2, 0, 0);
  const P2 = new THREE.Vector3(len / 2, 0, 0);
  for (const P of [P0, P2]) {
    const p = new THREE.Group(); p.position.set(P.x, P.y, 0);
    p.add(mesh(new THREE.CylinderGeometry(.0040, .0040, .052, 8), toon('#b9bfd0'), [0, .026, 0]));
    p.add(mesh(new THREE.CylinderGeometry(.0038, .0038, .024, 8), toon('#9aa1b4'), [0, .002, 0], { rot: [Math.PI / 2, 0, 0] }));
    g.add(p);
  }
  // đường giữa của dải, theo u = 0..1 từ ghim trái sang ghim phải
  const pt = (u, cold, taut) => {
    // chưa bị nung: cả dải thõng đều, thành một vòng mềm
    let y = -sag0 * Math.sin(Math.PI * u);
    if (taut > 0) {
      // vùng nóng (trái) đi thẳng từ ghim trái tới chỗ tiếp giáp; vùng lạnh
      // (phải) thõng xuống rồi trở lại đường ngang ở ghim phải. Ở chỗ tiếp
      // giáp cả hai nhánh đều **tiếp tuyến ngang**, nên không có góc gấp:
      // đường dây đi liền mạch, đọc ra là một sợi dây chứ không phải hai mảnh.
      const yf = u <= .5
        ? 0
        : -cold * drop * Math.pow(Math.sin(Math.PI * (u - .5) / .5), 1.5);
      y = lerp(y, yf, taut);
    }
    return y;
  };
  // Dải **liền mạch**: một dải dẹt có mặt cắt chữ nhật, dựng bằng M+1 lát cắt
  // nối tiếp nhau. Trước đây dải là 56 khối rời có khe hở giữa, và khe hở ấy
  // biến dải thành **một cái lược** — khung hình đọc ra mấy cái que toả ra như
  // mặt trời, không phải một sợi dây. Dải liền thì là một sợi.
  const ribbon = (u0, u1, M, mat) => {
    const pos = new Float32Array((M + 1) * 4 * 3);
    const idx = [];
    for (let i = 0; i < M; i++) {
      const a = i * 4, b = (i + 1) * 4;
      for (let k = 0; k < 4; k++) {
        const k2 = (k + 1) % 4;
        idx.push(a + k, b + k, b + k2, a + k, b + k2, a + k2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setIndex(idx);
    const m = mesh(geo, mat, [0, 0, 0]);
    g.add(m);
    return { m, geo, pos, M, u0, u1 };
  };
  // vùng nóng ở bên TRÁI: nhiệt ở c22 đi từ trái sang phải, nên c23 phải
  // cho nóng đến từ cùng phía — cùng một chiều, một bộ. Hai nửa **chạm nhau
  // đúng chỗ tiếp giáp** (u = .5), nên dải là một sợi liền mạch.
  const hotR = ribbon(0, .5, N / 2, toon(color, { emissive: '#ff5a12', emissiveIntensity: 0 }));
  const coldR = ribbon(.5, 1, N / 2, toon(color));
  g.setSag = (cold, taut) => {
    const c = clamp(cold), tt = clamp(taut);
    const du = 1 / (4 * N);
    const hw = bandW / 2, ht = bandT / 2;
    for (const R of [hotR, coldR]) {
      for (let i = 0; i <= R.M; i++) {
        const u = R.u0 + (R.u1 - R.u0) * (i / R.M);
        const x = P0.x + u * len;
        const y = pt(u, c, tt);
        // tiếp tuyến ở chỗ này: lát cắt xoay theo hướng dải đi, nối liền nhau.
        // Vết được lấy **bằng bước nhỏ** (1/4 lát cắt) và **trong cùng một
        // nhánh**: lấy chênh lệch quanh mốc tiếp giáp thì phép tính lấy phải
        // một bên thẳng, một bên cong, ra một góc xiên quá mức.
        const dy = (pt(Math.min(1, u + du), c, tt) - pt(Math.max(0, u - du), c, tt)) / (2 * du * len);
        const a = Math.atan(dy), sa = Math.sin(a), ca = Math.cos(a);
        for (let k = 0; k < 4; k++) {
          const sy = (k === 0 || k === 3) ? -1 : 1;
          const sz = (k < 2) ? -1 : 1;
          const p = (i * 4 + k) * 3;
          R.pos[p] = x - sa * sy * hw;
          R.pos[p + 1] = y + ca * sy * hw;
          R.pos[p + 2] = sz * ht;
        }
      }
      R.geo.attributes.position.needsUpdate = true;
      R.geo.computeVertexNormals();
      R.geo.computeBoundingSphere();
    }
    // vùng nóng ửng cam và tự sáng **dần theo mức nung** — nhiệt thấy được là
    // vào từ bên trái, không phải bật lên đã sẵn.
    hotR.m.material.color.lerpColors(cCold, cHot, tt);
    hotR.m.material.emissiveIntensity = .55 * tt;
  };
  g.setSag(0, 0);
  return g;
}

// ── N3: bàn đo ban đêm ───────────────────────────────────────────────────
export function buildDesk(scene) {
  const S = desk(scene, { time: 'night' });
  noShaft(scene);
  const F = S.focus;                                   // (.05, 0, .85)
  const Z = F.z + .06;                                 // (.91) mặt bàn nơi dựng bàn đo
  const GX = F.x - .35;                                // (-.30) cột dây chun
  const SX = GX + .40;                                 // (.10)  cột sợi thép
  const TOP = .30;                                     // chỗ dây treo từ móc dưới đồng hồ
  const BAND = .16;                                    // chiều dài dây chun treo
  const DROP = .079;                                   // từ đáy dây xuống đáy quả cân

  // chân đế, cột đứng phía sau, đồng hồ đo lực ở đầu cột (vạt kẹp đưa đồng hồ
  // ra trước cột, để dây treo không bị cột che mất)
  const stand = x => {
    const g = new THREE.Group(); g.position.set(x, 0, Z - .09); scene.add(g);
    g.add(mesh(new THREE.CylinderGeometry(.052, .062, .014, 20), toon('#39405a'), [0, .007, 0]));
    g.add(mesh(new THREE.CylinderGeometry(.011, .014, .41, 14), toon('#4a5064'), [0, .205, 0]));
    g.add(mesh(new THREE.BoxGeometry(.014, .014, .09), toon('#4a5064'), [0, .381, .045]));
    const gauge = dynamometer({ R: .055 });
    gauge.position.set(0, .381, .09);
    g.add(gauge);
    return gauge;
  };
  const gauge = stand(GX);
  const gauge2 = stand(SX);

  // dây chun treo thẳng đứng từ móc dưới đồng hồ, quả cân bên dưới
  // dải treo ở bàn đo **móc vào móc dưới đồng hồ**, nên không ghim thêm ghim
  const band = strap({ len: BAND, w: .020, t: .009, color: '#e0465c', pinned: false });
  band.position.set(GX, TOP, Z);
  scene.add(band);
  const wgt = weight({ R: .023, H: .05, color: '#c9973a' });
  wgt.position.set(GX, TOP - BAND - DROP, Z);
  scene.add(wgt);

  // thước đứng cạnh dây: đáy quả cân đọc được trên vạch.
  // Thước **rộng** (9 cm) như một thước dựng: một thước hẹp chỉ là một vệt
  // mảnh, và khung hình không đọc ra đó là bộ đo.
  const rul = ruler({ len: .42, w: .09, vertical: true });
  rul.position.set(GX - .075, .21, Z - .04);
  scene.add(rul);

  // sợi thép đi qua cùng một bàn đo khi so hai đường lực–giãn
  const wire = steelWire({ len: BAND, r: .003 });
  wire.rotation.z = Math.PI / 2;                      // treo dọc, treo từ đỉnh
  wire.position.set(SX, TOP - BAND / 2, Z);
  scene.add(wire);
  const wgt2 = weight({ R: .023, H: .05, color: '#c7c9d8' });
  wgt2.position.set(SX, TOP - BAND - DROP, Z);
  scene.add(wgt2);

  // nhiệt kế chính: đo nhiệt độ của dây lúc thổi hơi nóng. Nó đứng **gần**
  // cột đo, không xa: xa thì một khung hình phải chứa cả hai thứ thì không
  // thứ nào đủ lớn để đọc.
  const th = thermometer({ len: .28 });
  th.position.set(GX + .10, 0, Z + .10);
  scene.add(th);
  // một nhiệt kế nhỏ đặt cạnh dây: đo riêng độ nóng sinh ra khi kéo (hiệu ứng Joule).
  // Dây chun quấn quanh bầu nhiệt kế, đuôi dây nằm sang trái cho tay nắm và giật.
  const th2 = thermometer({ len: .20 });
  const JX = GX + .78, JZ = Z + .02, JY = .022;
  th2.position.set(JX, 0, JZ);
  scene.add(th2);
  const jb = jouleBand({ R: .024, tail: .055 });
  jb.position.set(JX, JY, JZ);
  scene.add(jb);

  // Bảng ghi chép trên tường ngay sau bàn đo. Không có nó thì nửa trên khung
  // của c28 và c37 là một mảng tường xanh trống trơn: người xem tắt tiếng không
  // đọc ra đây là chỗ đo. Bảng **rộng hơn 1,2 m** — máy đo coi vật quá cỡ là
  // không phải chủ thể, nên nó làm nền chứ không thành vật chính của cảnh.
  // Bảng **sáng** (nút gỗ, giấy và màu bút): một mảng tối trơn ở giữa khung
  // làm máy đo báo khung tối, và khung tối thì không đọc được.
  const board = new THREE.Group(); board.position.set(-.08, .62, .015); scene.add(board);
  board.add(mesh(rbox(1.55, 1.05, .035, .02), toon('#ddc79c'), [0, 0, 0]));
  board.add(mesh(rbox(1.62, .05, .05, .015), toon('#c9973a'), [0, .54, .005]));
  {
    const rr = mulberry(404);
    // giấy nhớ: trang trắng có mấy nét chữ vô nghĩa — **không** vẽ đường cong
    // lực–giãn ở đây, phần đó là câu chuyện của phim, không phải của nền.
    for (let i = 0; i < 3; i++) {
      const x = -.50 + i * .50, y = .16 + i * .15;
      board.add(mesh(rbox(.26, .32, .006, .003), toon('#fbf4e2'), [x, y, .022], { rot: [0, 0, (rr() - .5) * .12] }));
      for (let l = 0; l < 4; l++) {
        board.add(mesh(rbox(.16 - l * .018, .014, .003, .001), toon('#9aa0b8'),
          [x - .02, y + .10 - l * .055, .026], { rot: [0, 0, (rr() - .5) * .1] }));
      }
    }
    const notes = ['#f7bd27', '#67e8f9', '#f04462', '#8be0a8', '#ffb37a'];
    for (let i = 0; i < 5; i++) {
      const w = .18 + rr() * .08, h = .14 + rr() * .06;
      const x = -.62 + i * .31 + (rr() - .5) * .05, y = .02 + (i % 2) * .14 + (rr() - .5) * .04;
      board.add(mesh(rbox(w, h, .008, .004), toon(notes[i]), [x, y, .022], { rot: [0, 0, (rr() - .5) * .18] }));
      board.add(mesh(new THREE.SphereGeometry(.014, 8, 6), toon('#f04462'), [x, y + h / 2 - .01, .03]));
    }
  }

  const dry = hairdryer();
  dry.position.set(GX - .42, .17, Z);
  scene.add(dry);
  const mouth = dry.mouth.getWorldPosition(new THREE.Vector3());
  const flowHot = heatFlow(mouth, new THREE.Vector3(GX, .22, Z), { color: '#ffb37a', n: 240, rate: .45, opacity: .15, size: .003, lift: .04 });
  scene.add(flowHot);

  // ánh sáng: đèn bàn của set chiếu từ bên trái; mở rộng hình nón của nó cho
  // vừa cả hai cột đo, thêm một nêm sáng mềm từ phía máy quay để đọc được
  // vạch thước, kim đồng hồ và cột thủy ngân
  S.lamp.angle = .78; S.lamp.intensity = 4.4;
  S.amb.hemi.intensity = .72;
  const fill = new THREE.DirectionalLight('#cfe0ff', 1.05);
  fill.position.set(.9, 1.3, 2.6); fill.target.position.set(GX, .18, Z);
  scene.add(fill, fill.target);

  return {
    ...S,
    props: { gauge, gauge2, band, wgt, wire, wgt2, rul, th, th2, jb, dry, flowHot },
    dryMouth: mouth,
    dryGrip: new THREE.Vector3(GX - .42 - .20, .21, Z),
    GX, SX, Z, TOP, BAND, DROP, JX, JY, JZ,
  };
}
