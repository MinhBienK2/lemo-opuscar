// Nồi cơm đời đầu bị cưa ngang: thân sành cắt ra, ngay trên đáy nồi là một thanh
// lưỡng kim và hai tiếp điểm; nóng lên thì thanh cong ra bấm tách tiếp điểm,
// mạch mở, dây điện trở tắt.
// Thân nồi được cưa bằng section(); cơ lưỡng kim và tiếp điểm nằm sau mặt cắt
// nên vẫn còn nguyên và vẫn động được.
import * as THREE from 'three';
import { toon, glowMat, rbox, mesh, fxLayer, PAL } from '../../../../../rig/kit.js';
import { vessel } from '../../../../../rig/cutaway.js';
import { bimetal } from '../../../../../rig/parts.js';
import { section } from '../../../../../rig/section.js';

const PROFILE_CU = [
  [0, 0], [.150, 0], [.182, .020], [.196, .062], [.198, .120],
  [.188, .180], [.172, .228], [.150, .250], [.140, .256],
];

export function noiCuCatNgang(opts = {}) {
  const g = new THREE.Group();
  const glaze = toon(opts.glaze || '#eee4cf');
  const band = toon(opts.band || '#2f6f7e');

  // ── thân sành: dựng nguyên rồi cưa ──
  const shellRoot = new THREE.Group();
  const body = vessel(PROFILE_CU, { thick: .016, cut: 0, shell: glaze, face: toon('#d8cdb6') });
  shellRoot.add(body.group);
  // Nồi cơm đời đầu đặt thẳng mặt đáy xuống bàn. Không có chân cao: ba cây
  // cột trong lòng nồi (đặt ở bán kính 125 mm, cao 96 mm) đứng ngay giữa
  // cơ lưỡng kim, đọc ra như ba cái cột không rõ ý nghĩa.
  // ── dây điện trừ nằm ngay dưới đáy nồi, cưa cắt cùng thân nồi nên thấy được một nửa
  const coilMat = toon('#5d4a40');
  const coil = mesh(new THREE.TorusGeometry(.112, .011, 10, 44), coilMat, [0, -.026, 0], { rot: [Math.PI / 2, 0, 0] });
  shellRoot.add(coil);
  const coilGlow = new THREE.Mesh(new THREE.TorusGeometry(.112, .015, 10, 44), glowMat('#ff6a1f', 2, { transparent: true, opacity: 0 }));
  coilGlow.position.y = -.026; coilGlow.rotation.x = Math.PI / 2; coilGlow.layers.set(1);
  shellRoot.add(coilGlow);
  const cut = section(shellRoot, { normal: [0, 0, 1], at: 0 });
  g.add(cut.group);
  // vạng sơn quanh thân: chỉ vẽ nửa sau, để không che cơ lưỡng kim ở đáy nồi
  g.add(mesh(new THREE.CylinderGeometry(.200, .200, .026, 40, 1, true, Math.PI / 2, Math.PI),
    band, [0, .120, 0]));

  // ── cơ lưỡng kim và tiếp điểm ────────────────────────────────────────────
  // Người xem phải thấy được chuỗi nhân quả: thanh lưỡng kim nằm ngang, đầu tự
  // do ở bên phải; dưới đầu tự do là lá đồng động bản lề; trên lá động là
  // đầu tiếp điểm cố định. Khi còn mát, thanh phẳng ép lá động sát vào điểm
  // cố định (mạch khép, dây điện trở sáng). Khi nóng, thanh cong xuống, đẩy
  // lá động rời ra (mạch hở, dây điện trở tắt).
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

  // ── dây điện trừ nằm ngay dưới đáy nồi, cưa cắt cùng thân nồi nên thấy được một nửa

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
