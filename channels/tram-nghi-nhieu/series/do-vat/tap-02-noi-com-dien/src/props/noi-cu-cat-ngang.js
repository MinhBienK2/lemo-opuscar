// Nồi cơm đời đầu bị cưa ngang: cùng một mẫu với noi-com-doi-dau.js — thân sành,
// nắp vòm có núm, vạng sơn quanh thân, nút bấm mơ bên hông — rồi cưa ngang ở
// mặt phẳng z = 0 để nhìn vào trong.
//
// Nhìn vào trong thấy: lòng vỏ tối (không cháy trắng), đáy lòng vỏ là một mặt
// đáy thật có bóng; ngay trên đáy ấy là cơ lưỡng kim và hai tiếp điểm. Cao hơn
// một chút, bộ mâm nhiệt nhô lên, trên mâm nhiệt là nồi trong, dây điện trở ép
// sát dưới mâm nhiệt.
//
// Nóng lên thì thanh lưỡng kim cong ra bấm tách tiếp điểm, mạch mở, dây điện
// trở tắt.
import * as THREE from 'three';
import { toon, glowMat, rbox, mesh, GRAD3 } from '../../../../../rig/kit.js';
import { vessel } from '../../../../../rig/cutaway.js';
import { bimetal, button } from '../../../../../rig/parts.js';
import { section } from '../../../../../rig/section.js';
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
  // Người xem phải thấy được chuỗi nhân quả: thanh lưỡng kim nằm ngang, đầu tự
  // do ở bên phải; dưới đầu tự do là lá đồng động bản lề; trên lá động là
  // đầu tiếp điểm cố định. Khi còn mát, thanh phẳng ép lá động sát vào điểm
  // cố định (mạch khép, dây điện trở sáng). Khi nóng, thanh cong xuống, đẩy
  // lá động rời ra (mạch hở, dây điện trở tắt).
  // Cơ nằm sau mặt cắt nên còn nguyên và vẫn động được.
  const mech = new THREE.Group();
  mech.position.set(0, 0, -.070);
  g.add(mech);

  // thanh lưỡng kim: hai lớp kim loại ép dính, lớp đồng ở trên. Đầu trái bắt
  // chốt (có đinh tán), đầu phải tự do, nhờ một chân gốm bên trái.
  const BI_L = .070;
  const bi = bimetal({ L: BI_L, w: .026, t: .006, top: '#d98a2b', bottom: '#8f99a6' });
  bi.position.set(-.025, .0295, 0);
  mech.add(bi);
  // chân gốm bắt chốt trái của thanh
  mech.add(mesh(rbox(.018, .0295, .020, .003), toon('#7c828e'), [-.016, .0148, 0]));

  // Hai đầu tiếp xúc. Đầu tự do của thanh mang theo một hạt cầu nhỏ treo
  // dưới nó; đối diện, ở trên, là một lá đồng cố định mang hạt cầu thứ hai.
  // Mát thì hai hạt cầu chạm nhau (mạch khép, dây điện trở sáng); nóng lên
  // thì thanh cong xuống, hạt cầu của thanh rơi theo, hai hạt cầu rời nhau
  // (mạch hở, dây điện trở tắt).
  //
  // Trước đây cơ nằm cao hơn và xa lá đồng động, hai đầu tiếp xúc không bao
  // giờ chạm nhau: trong khung không thấy cái gì bấm vào cái gì, nên câu
  // "thanh cong ra bấm tách tiếp điểm" không có hình để chỉ. Nay cơ nằm ở đáy
  // nồi trong, đúng chỗ công tắc nhiệt cơ của nồi đời đầu.
  const CTX = .040;
  const fixLeaf = new THREE.Group();
  fixLeaf.add(mesh(new THREE.BoxGeometry(.055, .003, .020), toon('#c07a42'), [.0475, .0410, 0]));
  fixLeaf.add(mesh(new THREE.SphereGeometry(.005, 14, 10), toon('#e6e9ed'), [CTX, .0345, 0]));
  mech.add(fixLeaf);
  // chân gốm đứng lá đồng cố định
  mech.add(mesh(rbox(.012, .0395, .020, .003), toon('#ece8df'), [.070, .0198, 0]));
  // hạt cầu treo dưới đầu tự do của thanh: đi theo thanh khi thanh cong xuống
  const ballA = mesh(new THREE.SphereGeometry(.005, 14, 10), toon('#e6e9ed'), [.040, .0245, 0]);
  mech.add(ballA);
  // Lá cố định cứng: chính đầu tự do của thanh rơi xuống mới tách hai đầu
  // tiếp xúc. Không có lá động, không có bản lề ở đây.
  const ct = {
    leaf: fixLeaf,
    open: () => {},
  };
  // Vòng lửa nhỏ ở chỗ hai đầu tiếp xúc rời nhau: bằng chứng thấy được
  // rằng mạch vừa bị tách, không chỉ là một hình chi tiết đã đổi vị trí.
  // Vòng lửa phải NHỎ và chỉ lóe đúng lúc tiếp điểm tách: một quả cầu sáng
  // to đè lên chỗ tách thì câu "mạch mở" lại không thấy được khoảng hở
  // giữa hai đầu tiếp xúc. Một đốm trắng cháy to che khoảng hở cũng là
  // lỗi: tia lửa phải nhỏ, vàng ấm, và chỉ lóe một lúc.
  const arc = new THREE.Mesh(new THREE.SphereGeometry(.0022, 12, 8), glowMat('#ffd9a0', .9, { transparent: true, opacity: 0 }));
  arc.position.set(CTX, .0295, 0);
  arc.layers.set(1);
  mech.add(arc);

  // Đầu tự do của thanh cong xuống thì hạt cầu treo dưới nó cũng phải đi theo.
  // Hàm bend() của rig chỉ uốn các đỉnh của thanh, nên hạt cầu phải được đặt
  // lại theo đúng công thức uốn ấy, nếu không nó đứng lơ lửng giữa không trung.
  const placeBall = kk => {
    const bend = clamp01(kk) * .18, y0 = -.005, x0 = BI_L - .005;
    let x = x0, y = y0;
    if (bend > 1e-3) {
      const R = BI_L / (bend * 1.6), a = x0 / R;
      x = Math.sin(a) * (R + y0);
      y = Math.cos(a) * (R + y0) - R;
    }
    ballA.position.set(-.025 + x, .0295 + y, 0);
  };
  placeBall(0);

  g.bimetal = bi; g.contacts = ct;
  // k = 0: còn mát, tiếp điểm khép, dây điện trở sáng.
  // k = 1: đã nóng, thanh cong ra bấm tách tiếp điểm, mạch mở, dây điện trở tắt.
  g.setHeat = k => {
    bi.bend(clamp01(k) * .18);
    placeBall(clamp01(k));
    ct.open(clamp01(k));
    // tia lửa chỉ lóe đúng lúc tiếp điểm tách rồi tắt hẳn: câu "mạch mở" phải
    // thấy được khoảng hở giữa hai đầu tiếp xúc, không phải một quả cầu sáng
    const d = Math.abs(clamp01(k) - .82);
    arc.material.opacity = Math.max(0, 1 - d / .10) * .32;
    coilGlow.material.opacity = clamp01(1 - k) * .26;
    coilMat.color.set('#5d4a40').lerp(new THREE.Color('#b8562a'), clamp01(1 - k));
  };
  g.setHeat(0);
  return g;
}

const clamp01 = x => Math.max(0, Math.min(1, x));

export const PROP = { name: 'nồi cơm đời đầu bị cưa ngang', view: () => noiCuCatNgang() };
