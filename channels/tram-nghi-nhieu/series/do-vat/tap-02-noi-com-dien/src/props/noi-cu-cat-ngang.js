// Nồi cơm đời đầu bị cưa ngang: cùng một mẫu với noi-com-doi-dau.js — thân sành,
// nắp vòm có núm, vạng sơn quanh thân, nút bấm mơ bên hông — rồi cưa ngang ở
// mặt phẳng z = 0 để nhìn vào trong.
//
// Nhìn vào trong thấy: lòng vỏ tối (không cháy trắng), đáy lòng vỏ là một mặt
// đáy thật có bóng; ngay trên đáy ấy là cơ lưỡng kim và hai tiếp điểm. Cao hơn
// một chút, bộ mâm nhiệt nhô lên, trên mâm nhiệt là nồi trong, dây điện trở ép
// sát dưới mâm nhiệt.
//
// Cơ chế ở đây là một công tắc nhiệt cơ, đúng như công tắc nhiệt cơ thật của
// nồi đời đầu:
//
//   · thanh lưỡng kim nằm ngang, đầu trái bắt chốt, đầu phải tự do;
//   · đầu tự do mang một hạt cầu bạc treo dưới nó;
//   · ngay TRÊN hạt cầu ấy là đầu tiếp xúc thứ hai, gắn cứng vào một lá
//     đồng đứng trên chân gốm.
//
// Mát thì hai hạt cầu chạm nhau: mạch khép, dây điện trở sáng. Nóng lên thì
// thanh cong xuống, hạt cầu của thanh hạ theo, hai đầu tiếp xúc RỜI nhau:
// mạch mở, dây điện trở tắt. Lá đồng gắn cứng nên không đuổi theo — khoảng
// hở do chính thanh lưỡng kim cong ra mà mở, đúng câu "nóng lên thì cong ra,
// bấm tách tiếp điểm".
//
// Cái tách ấy phải nhanh và dứt khoát: người xem phải thấy một cú "cạch" của
// tiếp điểm, chứ không phải một sự trượt chậm không ai nhận ra là đã hở mạch.
import * as THREE from 'three';
import { toon, glowMat, rbox, mesh, GRAD3, ss } from '../../../../../rig/kit.js';
import { vessel } from '../../../../../rig/cutaway.js';
import { bimetal, button } from '../../../../../rig/parts.js';
import { section } from '../../../../../rig/section.js';
import { flow } from '../../../../../rig/fx.js';
import { fitFlow } from './_flowbox.js';
import { lopGao } from './gao.js';

const PROFILE_CU = [
  [0, 0], [.150, 0], [.182, .020], [.196, .062], [.198, .120],
  [.188, .180], [.172, .228], [.150, .250], [.140, .256],
];
// lòng vỏ: một lớp tối ốp trong thân sành, đáy lùi xuống dưới mặt đáy
const LINER = [
  [0, .020], [.132, .020], [.164, .020], [.178, .062], [.180, .120],
  [.170, .180], [.154, .228], [.132, .250], [.122, .256],
];
// nắp vòm: vỏ dày, để mặt cưa nhìn ra là một lớp sành chứ không phải mảnh giấy
const LID = [
  [.150, -.006], [.162, 0], [.160, .020], [.135, .048], [.090, .072], [.045, .086], [0, .090],
  [0, .078], [.038, .075], [.080, .062], [.122, .040], [.146, .016], [.148, 0], [.138, -.006],
  [.150, -.006],
];
// nồi trong: nồi nhôm thành thẳng, nhỏ hơn miệng vỏ, đáy phẳng để đặt lên mâm nhiệt
const PROFILE_TRONG = [
  [0, 0], [.086, 0], [.104, .010], [.112, .026], [.115, .060],
  [.116, .100], [.117, .112], [.111, .118],
];

// Giây người xem nghe tiếng "cạch" của nút bấm cơ (âm 'switch' trong film.js):
// đúng giây đó nút bị nhấn xuống và dây điện trở bắt đầu nóng.
const SWITCH_T = 112.75;
// Giây tiếp điểm tách: đúng giây có tiếng "bíp" tắt (âm 'blip_down') và câu
// "Mạch mở, dây điện trở tắt" bắt đầu. Tia lửa và lúc dây điện trở tắt phải
// trùng với tiếng đó, người xem mới tin là mạch vừa đứt.
const TRIP_T = 119.84;

const clamp01 = x => Math.max(0, Math.min(1, x));

export function noiCuCatNgang(opts = {}) {
  const g = new THREE.Group();
  const glaze = toon(opts.glaze || '#eee4cf');
  const band = toon(opts.band || '#2f6f7e');
  const brass = toon('#c9973a');
  const alu = toon('#98a0a8');
  const inPot = toon('#5f5749', { grad: GRAD3 });

  // ── vỏ sành: đúng thân của nồi cơm đời đầu ───────────────────────────────
  // Hạ vỏ xuống 18 mm cho đáy lòng vỏ nằm ngay dưới chân cơ lưỡng kim: cơ
  // lưỡng kim phải đứng trên một mặt đáy thật, không trôi lơ lửng.
  const shellRoot = new THREE.Group();
  shellRoot.position.y = -.018;
  const body = vessel(PROFILE_CU, { thick: .016, cut: 0, shell: glaze, face: toon('#d8cdb6') });
  shellRoot.add(body.group);

  // lòng vỏ tối: mặt trong không tự phát sáng, nên mọi mặt cắt và nét mực bên
  // trong còn đọc được
  const liner = mesh(new THREE.LatheGeometry(LINER.map(p => new THREE.Vector2(p[0], p[1])), 96), inPot);
  liner.userData.hollow = true;
  shellRoot.add(liner);

  // vạng sơn quanh thân: một vành mỏng bọc sát thân vỏ. Cưa ngang thì chỉ lộ
  // hai mặt cắt nhỏ ở hai bên, không chắn ngang miệng nồi.
  shellRoot.add(mesh(new THREE.LatheGeometry(
    [[.196, .107], [.203, .107], [.203, .133], [.196, .133], [.196, .107]].map(p => new THREE.Vector2(p[0], p[1])), 64), band));

  // ── nắp vòm có núm ────────────────────────────────────────────────────────
  const lid = new THREE.Group(); lid.position.set(0, .256, 0);
  lid.add(mesh(new THREE.LatheGeometry(LID.map(p => new THREE.Vector2(p[0], p[1])), 64), glaze));
  lid.add(mesh(new THREE.TorusGeometry(.160, .007, 8, 40), band, [0, .002, 0], { rot: [Math.PI / 2, 0, 0] }));
  const knob = new THREE.Group(); knob.position.set(0, .090, 0);
  knob.add(mesh(new THREE.SphereGeometry(.028, 16, 12), glaze, [0, .014, 0]));
  knob.add(mesh(new THREE.CylinderGeometry(.012, .016, .020, 14), brass, [0, -.002, 0]));
  lid.add(knob);
  shellRoot.add(lid);

  // ── nút bấm cơ (công tắc cam) bên hông phải ───────────────────────────────
  // Đặt lệch về phía sau một chút để nằm trọn trong nửa còn lại sau khi cưa.
  const swA = 1.745;                       // góc trên mặt vỏ, tính từ phía trước
  const swN = new THREE.Vector3(Math.sin(swA), 0, Math.cos(swA));
  const sw = button({ r: .020, color: '#c9973a', bezel: '#7d828b' });
  sw.position.copy(swN).multiplyScalar(.194).setY(.070);
  sw.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), swN);
  shellRoot.add(sw);

  // ── trong lòng: bộ mâm nhiệt nhô lên, nồi trong đặt trên mâm nhiệt ─────────
  // Bộ mâm nhiệt là một vỏ nhôm đúc rỗng giữa, đặt trên đáy lòng vỏ; cơ lưỡng
  // kim nằm trong khoảng rỗng ấy nên vẫn thấy được từ mọi góc nhìn.
  const inside = new THREE.Group();
  inside.add(mesh(new THREE.LatheGeometry(
    [[.118, .002], [.132, .002], [.132, .092], [.118, .092], [.118, .002]].map(p => new THREE.Vector2(p[0], p[1])), 64), alu));
  // mâm nhiệt
  inside.add(mesh(new THREE.LatheGeometry(
    [[0, .092], [.132, .092], [.132, .100], [.128, .105], [0, .105]].map(p => new THREE.Vector2(p[0], p[1])), 64), alu));

  // dây điện trở ép sát dưới mâm nhiệt
  const coilMat = toon('#5d4a40');
  const coil = mesh(new THREE.TorusGeometry(.098, .006, 8, 48), coilMat, [0, .086, 0], { rot: [Math.PI / 2, 0, 0] });
  inside.add(coil);
  const coilGlow = new THREE.Mesh(new THREE.TorusGeometry(.098, .0085, 8, 48), glowMat('#ff6a1f', 2, { transparent: true, opacity: 0 }));
  coilGlow.position.y = .086; coilGlow.rotation.x = Math.PI / 2; coilGlow.layers.set(1);
  inside.add(coilGlow);

  // nồi trong. Mặt trong của nồi phải TỐI và có dải sáng cong (gradient 3
  // bậc): một mảng xám sáng lớn ở giữa khung đọc ra như một màn hình phẳng,
  // và cả cái nồi đọc ra như một hộp điện tử chứ không phải một cái nồi cơm
  // bị cưa.
  const trong = vessel(PROFILE_TRONG, { thick: .012, cut: 0, shell: toon('#4a4740', { grad: GRAD3 }), face: toon('#3a3833') });
  trong.group.position.y = .105;
  // vành miệng nồi trong: một sống nhôm cuộn ở mép. Không có vành này, nồi
  // trong đọc ra là một tấm phẳng có mép vát, không phải một cái nồi có miệng.
  trong.group.add(mesh(new THREE.TorusGeometry(.1145, .0042, 8, 44), toon('#b9c0c8'), [0, .1155, 0], { rot: [Math.PI / 2, 0, 0] }));
  inside.add(trong.group);

  // ── cưa ngang cả vỏ, cả nồi trong, cả mâm nhiệt ──────────────────────────
  const whole = new THREE.Group();
  whole.add(shellRoot, inside);
  const cut = section(whole, { normal: [0, 0, 1], at: 0 });
  g.add(cut.group);

  // Lớp cơm trong nồi. Nồi đời đầu được dựng để cơ lưỡng kim ở đáy nhìn ra;
  // lớp cơm cho người xem biết đây là một cái NỒI CƠM đang nấu, chứ không
  // phải một cái hộp rỗng. Cơm giữ sẵn nửa sau, đúng như mặt cưa của nồi, nên
  // đặt sau khi cưa là không cần cưa thêm.
  const rice = lopGao({ R: .100, y: .110, h: .068, n: 520, seed: 5, half: true, gs: .78 });
  g.add(rice);

  // ── cơ lưỡng kim và tiếp điểm ────────────────────────────────────────────
  // Người xem phải thấy được chuỗi nhân quả: thanh lưỡng kim nằm ngang, đầu
  // tự do ở bên phải, ở đầu tự do treo một hạt cầu bạc; ngay bên cạnh hạt
  // cầu ấy là đầu tiếp xúc thứ hai, gắn cứng vào một lá đồng.
  //
  // Mát thì hai hạt cầu chạm nhau: mạch khép, dây điện trở sáng. Nóng lên thì
  // thanh cong xuống, hạt cầu ở đầu thanh hạ theo, hai hạt cầu rời nhau:
  // đúng câu "nóng lên thì cong ra, bấm tách tiếp điểm". Lá đồng gắn cứng
  // nên không đuổi theo — khoảng hở do chính thanh lưỡng kim cong mà mở.
  //
  // Cơ nằm sau mặt cắt nên còn nguyên và vẫn động được. Nâng cả cơ lên 5 mm:
  // ở cận cảnh c39 máy quay đặt đúng ngay trên cơ, nên hạt cầu ở đầu thanh
  // rơi xuống thì phải còn nằm trên dải phụ đề, không chuiy xuống dưới.
  const mech = new THREE.Group();
  mech.position.set(0, .005, -.070);
  g.add(mech);

  // thanh lưỡng kim: hai lớp kim loại ép dính, lớp đồng ở trên. Đầu trái bắt
  // chốt (có đinh tán), đầu phải tự do, nhờ một chân gốm bên trái.
  const BI_L = .070;
  const BEND_MAX = .24;                    // độ cong tối đa của thanh
  const bi = bimetal({ L: BI_L, w: .026, t: .006, top: '#d98a2b', bottom: '#8f99a6' });
  bi.position.set(-.025, .0295, 0);
  mech.add(bi);
  // chân gốm bắt chốt trái của thanh
  mech.add(mesh(rbox(.018, .0345, .020, .003), toon('#7c828e'), [-.016, .01725, 0]));

  // Lá đồng đặt cứng: bản lề ở đầu phải (chốt trong chân gốm), đầu tự do ở
  // bên trái mang hạt cầu bạc thứ hai. Hạt cầu này nằm NGANG HÀNG với hạt
  // cầu ở đầu thanh, cách đúng một đường kính hạt cầu — hai đầu tiếp xúc
  // nhìn thẳng vào nhau, và không có gì chen giữa.
  const CTX = .055;
  const ARM_Y = .0245;                     // tâm hạt cầu trên lá đồng
  const PIVX = .0755, PIVY = .0410;
  const arm = new THREE.Group();
  arm.position.set(PIVX, PIVY, 0);
  mech.add(arm);
  // thanh lá chạy từ hạt cầu (đầu trái) về tới chốt bản lề (đầu phải)
  arm.add(mesh(new THREE.BoxGeometry(.0225, .003, .020), toon('#c07a42'), [-.00925, 0, 0]));
  arm.add(mesh(new THREE.SphereGeometry(.005, 14, 10), toon('#e6e9ed'), [CTX - PIVX, ARM_Y - PIVY, 0]));
  // chân gốm đứng lá đồng
  mech.add(mesh(rbox(.012, .0395, .020, .003), toon('#ece8df'), [.070, .0198, 0]));

  // hạt cầu treo ở đầu tự do của thanh: đi theo thanh khi thanh cong xuống
  const ballA = mesh(new THREE.SphereGeometry(.005, 14, 10), toon('#e6e9ed'), [.045, .0245, 0]);
  mech.add(ballA);

  // Đầu tự do của thanh cong xuống thì hạt cầu treo ở đó cũng phải đi theo.
  // Hàm bend() của rig chỉ uốn các đỉnh của thanh, nên hạt cầu phải được đặt
  // lại theo đúng công thức uốn ấy, nếu không nó đứng lơ lửng giữa không trung.
  const placeBall = kk => {
    const bend = clamp01(kk) * BEND_MAX, y0 = -.005, x0 = BI_L;
    let x = x0, y = y0;
    if (bend > 1e-3) {
      const R = BI_L / (bend * 1.6), a = x0 / R;
      x = Math.sin(a) * (R + y0);
      y = Math.cos(a) * (R + y0) - R;
    }
    ballA.position.set(-.025 + x, .0295 + y, 0);
  };
  placeBall(0);

  // Vòng lửa nhỏ ở chỗ hai đầu tiếp xúc rời nhau: bằng chứng thấy được
  // rằng mạch vừa bị tách, không chỉ là một hình chi tiết đã đổi vị trí.
  // Vòng lửa phải NHỎ và chỉ lóe đúng lúc tiếp điểm tách: một quả cầu sáng
  // to đè lên chỗ tách thì câu "mạch mở" lại không thấy được khoảng hở
  // giữa hai đầu tiếp xúc.
  const arc = new THREE.Mesh(new THREE.SphereGeometry(.0016, 12, 8), glowMat('#ffd9a0', .9, { transparent: true, opacity: 0 }));
  arc.layers.set(1);
  mech.add(arc);
  // quầng sáng nhỏ quanh tia lửa: đủ để thấy "có tia lửa", không đủ để che
  // mất khoảng hở giữa hai hạt cầu
  const arcGlow = new THREE.Mesh(new THREE.SphereGeometry(.0042, 14, 10), glowMat('#ffcf8a', 1.1, { transparent: true, opacity: 0 }));
  arcGlow.layers.set(1);
  mech.add(arcGlow);
  // Tia lửa phải nằm ĐÚNG khoảng hở giữa hai hạt cầu, nên vị trí nó được
  // tính lại mỗi khung theo hạt cầu của thanh đang ở đâu.
  const placeArc = () => {
    const x = (ballA.position.x + CTX) / 2, y = (ballA.position.y + ARM_Y) / 2;
    arc.position.set(x, y, 0);
    arcGlow.position.set(x, y, 0);
  };
  placeArc();

  // ── nhiệt: thứ vô hình phải vẽ thành vật ─────────────────────────────────
  // Dòng hơi nóng chảy từ dây điện trở xuống thanh lưỡng kim: đây là mắt
  // xích của câu "nóng lên thì cong ra" — người xem phải thấy nhiệt đi từ
  // dây điện trở tới tận thanh, chứ không thấy thanh tự nhiên cong.
  const heatFlow = flow(new THREE.Vector3(-.069, .084, -.070), new THREE.Vector3(.030, .030, -.070),
    { color: '#ff9a4a', size: .006, n: 70, rate: 1.6, opacity: .30, seed: 3, lift: .012 });
  g.add(heatFlow);

  // Hơi nóng bốc lên từ nồi trong ra khỏi miệng nồi: nồi đang nấu, khí nóng
  // trong nồi phải đi ra. Ở cảnh toàn cơ (c37) đây là thứ động rõ nhất
  // trong khung. Cột hơi nghiêng một chút về sau và sang phải để hơi trôi
  // theo luồng khí, và để bả puffs lệch tải theo chiều ngang — một cột hơi
  // thẳng đứng không đổi thì người xem coi như một vệt sơn.
  const steamFlow = flow(new THREE.Vector3(0, .168, 0), new THREE.Vector3(.05, .430, .05),
    { color: '#e2f3ff', size: .026, n: 120, rate: 2.8, opacity: .20, seed: 7 });
  g.add(steamFlow);

  // Hơi nóng bốc lên từ chính đầu tự do của thanh lưỡng kim — đầu nóng nhất,
  // vì nhiệt truyền từ dây điện trở sang đúng chỗ ấy. Ở cận cảnh c39 (cực
  // gần hai đầu tiếp xúc) đây là thứ duy nhất còn động sau khi mạch đã mở,
  // để khung hình không đứng yên một cách vô lý. Vì vậy cột hơi này phải
  // NGẮN: một cột dài bay lên ngoài khung thì trong cận cảnh chẳng còn gì.
  const shimmer = flow(new THREE.Vector3(.045, .037, -.070), new THREE.Vector3(.030, .088, -.070),
    { color: '#ffb27a', size: .007, n: 30, rate: 1.4, opacity: .30, seed: 11, lift: .004 });
  fitFlow(heatFlow, steamFlow, shimmer);
  g.add(shimmer);

  // ── thanh lưỡng kim nóng lên: màu của thanh đỏ dần ────────────────────────
  // Vùng nóng lan từ đầu tự do (gần dây điện trở) về phía chốt: nhiệt truyền
  // dọc thanh, và chỗ nào vừa nóng thì vừa đỏ.
  const stripGeo = bi.children[0].geometry;          // lớp đồng ở trên
  const basePos = stripGeo.userData.base;
  const colAttr = new THREE.BufferAttribute(new Float32Array(basePos.length), 3);
  stripGeo.setAttribute('color', colAttr);
  const stripMat = bi.children[0].material;
  stripMat.vertexColors = true;
  stripMat.needsUpdate = true;

  // ── trạng thái ────────────────────────────────────────────────────────────
  let heat = 0;        // 0..1: nhiệt của cơ, do film.js đưa vào

  // k = 0: còn mát, tiếp điểm khép, dây điện trở sáng.
  // k = 1: đã nóng, thanh cong ra bấm tách tiếp điểm, mạch mở, dây điện trở tắt.
  g.setHeat = k => { heat = clamp01(k); };

  g.updateProp = t => {
    // Nút bấm cơ: nhấn xuống đúng giây người xem nghe tiếng "cạch", rồi
    // GIỮ ở chỗ đã nhấn — công tắc nhiệt cơ có lưỡi chốt, không nảy lên.
    sw.press(ss((t - SWITCH_T) / .12));

    const k = clamp01(heat);
    // thanh cong dần theo nhiệt; hạt cầu treo và tia lửa đi theo thanh
    bi.bend(k * BEND_MAX);
    placeBall(k);
    placeArc();

    // dây điện trở: sáng và nhấp nháy như lửa khi mạch khép, tắt hẳn đúng
    // lúc tiếp điểm tách. Nhấp nháy là hiện tượng có thật của dây điện trở,
    // và nó làm cho khung cận cảnh có sự sống ngay cả khi cơ chế đang chậm.
    const elec = 1 - ss((t - TRIP_T) / .12);
    const flick = 1 + (.20 * Math.sin(t * 44) + .13 * Math.sin(t * 29 + 1.7)) * elec;
    coilGlow.material.opacity = .34 * elec * flick;
    coilMat.color.set('#5d4a40').lerp(new THREE.Color('#c85a26'), elec * clamp01(.35 + k));

    // thanh đỏ lên theo vùng nóng, và vùng nóng nhấp nháy theo dây điện trở.
    // Sau khi dây tắt thì thanh nguội dần: vùng đỏ tắt dần — đó là bằng
    // chứng thấy được cho câu "dây điện trở tắt".
    const cool = ss((t - TRIP_T) / .8);
    const front = k * (BI_L + .030);
    const arr = colAttr.array;
    for (let i = 0; i < basePos.length; i += 3) {
      const d = (BI_L - basePos[i]) - front;
      let hot = d <= 0 ? 1 : Math.max(0, 1 - d / .020);
      hot *= hot * (1 - .85 * cool);
      const f = 1 + hot * 1.10 * flick;
      arr[i] = f;
      arr[i + 1] = 1 - hot * .42 * flick;
      arr[i + 2] = 1 - hot * .78 * flick;
    }
    colAttr.needsUpdate = true;

    // tia lửa: chỉ lóe đúng lúc hai đầu tiếp xúc rời nhau rồi tắt hẳn
    const arcK = clamp01(1 - Math.abs((t - TRIP_T) - .05) / .05);
    arc.material.opacity = arcK * .40;
    arcGlow.material.opacity = arcK * .30;

    // nhiệt: dòng hơi nóng chạy từ dây điện trở xuống thanh, và hơi bốc ra
    // khỏi miệng nồi. Trước khi nút bấm cơ được nhấn thì cả nồi còn mát:
    // không có nhiệt, không có hơi. Dây điện trở tắt thì dòng nhiệt từ
    // dây cũng tắt theo, còn hơi trong nồi vẫn còn.
    const hotOn = ss((t - SWITCH_T) / .5);
    const elecHeat = hotOn * (1 - ss((t - TRIP_T) / .25));
    heatFlow.visible = elecHeat > .01;
    if (elecHeat > .01) heatFlow.update(t, elecHeat);
    // Hơi nồi dâng lên theo lúc nước sôi, không theo nhiệt của thanh: dây
    // điện trở còn sáng là nồi còn bốc hơi, và trong khung toàn cơ (c37) đây
    // là thứ duy nhất động — phải đủ rõ thì người xem mới thấy nồi đang nấu.
    steamFlow.visible = hotOn > .01;
    if (hotOn > .01) { steamFlow.amount(ss((t - SWITCH_T) / 1.3)); steamFlow.update(t, hotOn); }
    // hơi nóng còn sót của thanh: thanh còn nóng thì vẫn còn hơi bốc lên
    const shim = hotOn * clamp01(.2 + k * .8);
    shimmer.visible = shim > .01;
    if (shim > .01) { shimmer.amount(shim); shimmer.update(t, shim); }
  };

  g.setHeat(0);
  g.updateProp(0);
  return g;
}

export const PROP = { name: 'nồi cơm đời đầu bị cưa ngang', view: () => noiCuCatNgang() };
