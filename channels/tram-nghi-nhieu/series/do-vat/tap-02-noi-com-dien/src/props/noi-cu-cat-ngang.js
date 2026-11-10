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

  // nồi trong
  const trong = vessel(PROFILE_TRONG, { thick: .012, cut: 0, shell: toon('#8b939c'), face: toon('#767e86') });
  trong.group.position.y = .105;
  inside.add(trong.group);

  // ── cưa ngang cả vỏ, cả nồi trong, cả mâm nhiệt ──────────────────────────
  const whole = new THREE.Group();
  whole.add(shellRoot, inside);
  const cut = section(whole, { normal: [0, 0, 1], at: 0 });
  g.add(cut.group);

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
  // chốt (có đinh tán), đầu phải tự do, nằm trên hai chân đỡ.
  const bi = bimetal({ L: .100, w: .026, t: .006, top: '#d98a2b', bottom: '#8f99a6' });
  bi.position.set(-.048, .0265, 0);
  mech.add(bi);
  // hai chân đỡ thanh lưỡng kim
  for (const x of [-.042, -.024]) mech.add(mesh(rbox(.018, .0265, .020, .003), toon('#7c828e'), [x, .0132, 0]));

  // hai tiếp điểm: đặt sang bên phải, ra ngoài đầu tự do của thanh, để lúc
  // chúng rời nhau người xem thấy rõ. Lá cố định nằm cao trên chân gốm; lá
  // động bản lề bên phải vươn sang trái. Mát thì lá động bị thanh ép lên,
  // hai đầu tiếp xúc chạm nhau; nóng lên thì thanh cong, ép lá động nằm xuống,
  // hai đầu rời nhau.
  const CTX = .065;
  const fixLeaf = new THREE.Group();
  fixLeaf.add(mesh(new THREE.BoxGeometry(.026, .003, .020), toon('#c07a42'), [CTX + .010, .0225, 0]));
  fixLeaf.add(mesh(new THREE.SphereGeometry(.005, 14, 10), toon('#e6e9ed'), [CTX, .0240, 0]));
  mech.add(fixLeaf);
  mech.add(mesh(rbox(.011, .021, .018, .003), toon('#ece8df'), [CTX + .019, .0105, 0]));   // chân gốm
  const movLeaf = new THREE.Group();
  movLeaf.position.set(CTX + .015, .002, 0);
  movLeaf.add(mesh(new THREE.BoxGeometry(.015, .003, .020), toon('#c07a42'), [-.0075, 0, 0]));
  movLeaf.add(mesh(new THREE.SphereGeometry(.005, 14, 10), toon('#e6e9ed'), [-.015, .004, 0]));
  mech.add(movLeaf);
  mech.add(mesh(rbox(.010, .004, .020, .003), toon('#ece8df'), [CTX + .015, .002, 0]));    // bản lề
  const ct = {
    leaf: movLeaf,
    open: k => { movLeaf.rotation.z = -.592 * (1 - clamp01(k)); },
  };
  ct.open(0);
  // vòng lửa nhỏ ở chỗ hai đầu tiếp xúc rời nhau: bằng chứng thấy được
  // rằng mạch vừa bị tách, không chỉ là một hình chi tiết đã đổi vị trí.
  const arc = new THREE.Mesh(new THREE.SphereGeometry(.0045, 12, 8), glowMat('#bfe6ff', 3, { transparent: true, opacity: 0 }));
  arc.position.set(CTX, .015, 0);
  arc.layers.set(1);
  mech.add(arc);

  g.bimetal = bi; g.contacts = ct;
  // k = 0: còn mát, tiếp điểm khép, dây điện trở sáng.
  // k = 1: đã nóng, thanh cong ra bấm tách tiếp điểm, mạch mở, dây điện trở tắt.
  g.setHeat = k => {
    bi.bend(clamp01(k) * .18);
    ct.open(clamp01(k));
    arc.material.opacity = clamp01(k) * .80;
    coilGlow.material.opacity = clamp01(1 - k) * .26;
    coilMat.color.set('#5d4a40').lerp(new THREE.Color('#b8562a'), clamp01(1 - k));
  };
  g.setHeat(0);
  return g;
}

const clamp01 = x => Math.max(0, Math.min(1, x));

export const PROP = { name: 'nồi cơm đời đầu bị cưa ngang', view: () => noiCuCatNgang() };
