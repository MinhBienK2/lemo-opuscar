// Nồi cơm đời đầu: thân sành, nắm có núm, chân cao, nút bấm cơ có cần bấm,
// không có bảng điện tử — chỉ có công tắc nhiệt cơ ở đáy nồi (xem noi-cu-cat-ngang.js).
//
// Ở cảnh bếp (c36) nồi này nằm cạnh nồi hiện đại: cắm vào ổ điện trên tường,
// cần bấm ở vị trí "nấu", và đèn báo nhỏ trên bảng trước NHẤP NHÁY theo nhịp
// công tắc nhiệt cơ — sáng khi mạch khép, tắt khi công tắc ngắt. Đèn ấy là thứ
// báo trước cho người xem thấy cái cơ chế sắp được mổ ở hai câu sau.
import * as THREE from 'three';
import { toon, glowMat, rbox, mesh, fxLayer, TEX } from '../../../../../rig/kit.js';
import { vessel } from '../../../../../rig/cutaway.js';
import { cable } from '../../../../../rig/parts.js';
import { flow } from '../../../../../rig/fx.js';
import { fitFlow } from './_flowbox.js';

const PROFILE_CU = [
  [0, 0], [.150, 0], [.182, .020], [.196, .062], [.198, .120],
  [.188, .180], [.172, .228], [.150, .250], [.140, .256],
];

export function noiComDoiDau(opts = {}) {
  const g = new THREE.Group();
  const glaze = toon(opts.glaze || '#eee4cf');
  const band = toon(opts.band || '#2f6f7e');
  const brass = toon('#c9973a');

  const body = vessel(PROFILE_CU, { thick: .016, cut: 0, shell: glaze, face: toon('#d8cdb6') });
  g.add(body.group);
  g.body = body;

  // vành sơn quanh thân
  g.add(mesh(new THREE.CylinderGeometry(.200, .200, .026, 40), band, [0, .120, 0]));

  // ── nắm: vòm sành có núm ──
  const lid = new THREE.Group(); lid.position.set(0, .256, -.150);
  const lidBody = new THREE.Group(); lidBody.position.set(0, 0, .150);
  lid.add(lidBody);
  const lidProf = [[.150, -.006], [.162, 0], [.160, .020], [.135, .048], [.090, .072], [.045, .086], [0, .090]];
  lidBody.add(mesh(new THREE.LatheGeometry(lidProf.map(p => new THREE.Vector2(p[0], p[1])), 44), glaze));
  lidBody.add(mesh(new THREE.TorusGeometry(.160, .007, 8, 40), band, [0, .002, 0], { rot: [Math.PI / 2, 0, 0] }));
  const knob = new THREE.Group(); knob.position.set(0, .090, 0);
  knob.add(mesh(new THREE.SphereGeometry(.028, 16, 12), glaze, [0, .014, 0]));
  knob.add(mesh(new THREE.CylinderGeometry(.012, .016, .020, 14), brass, [0, -.002, 0]));
  lidBody.add(knob);
  g.add(lid);
  g.lid = lid;

  // ── nút bấm cơ: một cần bấm nhô ra ở mặt trước, trên một bảng nhỏ ──
  const panel = new THREE.Group(); panel.position.set(0, .070, .196);
  panel.add(mesh(rbox(.13, .075, .020, .010), toon('#e2d8c2'), [0, 0, 0]));
  const lever = new THREE.Group(); lever.position.set(0, .004, .012);
  lever.add(mesh(rbox(.052, .020, .046, .008), brass, [0, .008, .020]));
  lever.add(mesh(new THREE.CylinderGeometry(.010, .010, .040, 12), brass, [0, .018, .040], { rot: [Math.PI / 2, 0, 0] }));
  panel.add(lever);
  g.add(panel);
  g.lever = lever;

  // ── đèn báo của công tắc nhiệt cơ ───────────────────────────────────────
  // Một đĩa nhỏ trong vành, giống đèn của nồi hiện đại nhưng nhỏ hơn và cũ
  // hơn: nồi đời đầu chỉ có đèn, không có màn hình.
  const lamp = new THREE.Group(); lamp.position.set(.040, .012, .012);
  lamp.add(mesh(new THREE.CylinderGeometry(.018, .018, .008, 20), toon('#3a3f4c'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  const bulb = mesh(new THREE.CircleGeometry(.014, 20), glowMat('#ff4a3a', 1.6), [0, 0, .006], { cast: false });
  fxLayer(bulb); lamp.add(bulb);
  // Quầng sáng quanh đèn: một chấm nhỏ đổi sáng tắt thì người xem chỉ thấy
  // một ô màu nhấp nháy, không đọc ra là một cái đèn vừa bật. Quầng sáng phải
  // nở ra rồi co lại, để lần đổi trạng thái ấy thành một việc xảy ra trước mắt.
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: TEX.radial('rgba(255,236,200,1)'), color: 0xff7a4a, transparent: true, opacity: .30,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
  }));
  halo.scale.set(.040, .040, 1); fxLayer(halo); lamp.add(halo);
  panel.add(lamp);

  // ── chân cao: ba chân sành ──
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2 + .5;
    const leg = new THREE.Group(); leg.position.set(Math.cos(a) * .125, .048, Math.sin(a) * .125);
    leg.add(mesh(new THREE.CylinderGeometry(.020, .026, .096, 12), glaze, [0, -.048, 0]));
    leg.add(mesh(new THREE.TorusGeometry(.021, .006, 6, 16), brass, [0, -.088, 0], { rot: [Math.PI / 2, 0, 0] }));
    g.add(leg);
  }

  // ── dây điện: dựng riêng, xem noiComDoiDauCord() ──────────────────────
  // Dây chạy tới ổ trên tường, dài gấp rưỡi cái nồi: nếu nằm trong nhóm nồi
  // thì khung đo vật bị kéo dài và nồi rút lại thành một chấm giữa khung.
  // Dây là phụ kiện của cảnh, không phải thân vật.

  // ── hơi nước bay lên từ lỗ nắm ─────────────────────────────────────────
  // Nồi đang nấu (cần bấm ở vị trí "nấu", đèn báo nhấp nháy) thì hơi nước phải
  // ra khỏi nắp. Cột hơi trôi sang phải khung hình, để nó không đè lên nồi
  // hiện đại đứng bên trái. Đây là thứ động lớn nhất của nồi đời đầu trong
  // cảnh bếp, và nó báo trước cho người xem biết ngay sau đó máy sẽ đi vào
  // bên trong nồi này.
  const steamFlow = flow(new THREE.Vector3(0, .34, 0), new THREE.Vector3(.30, 1.55, -.30),
    { color: '#dceeff', size: .050, n: 100, rate: .45, opacity: .30, seed: 5, lift: .18 });
  fitFlow(steamFlow);
  g.add(steamFlow);

  g.setLid = k => { lid.rotation.x = -k * 1.15; };
  g.setLever = k => { lever.rotation.x = -k * .5; lever.position.z = .012 - k * .012; };
  g.setLid(0);
  // Cần bấm ở vị trí "nấu": nồi đang chạy, nên đèn báo mới nhấp nháy được.
  g.setLever(1);

  // ── nhịp công tắc nhiệt cơ ───────────────────────────────────────────────
  // Nồi đời đầu không có vi mạch: nó chỉ có một công tắc nhiệt cơ đóng cắt.
  // Đèn báo sáng khi mạch khép (dây điện trở nóng) và tắt khi công tắc ngắt,
  // nên nó nhấp nháy đều đặn — đúng nhịp của cơ chế mà hai câu sau sẽ mổ ra.
  // Ở cảnh toàn cảnh (c36) đèn này là thứ động rõ nhất của nồi đời đầu.
  const LAMP_CYCLE = 1.10;              // một vòng đóng–cắt
  const LAMP_ON = .58;                  // phần thời gian mạch khép
  const lampOn = new THREE.Color('#ff4a3a'), lampOff = new THREE.Color('#2a1414');
  const white = new THREE.Color('#ffffff');
  let lastOn = true, flashT = -99;
  g.updateProp = t => {
    const u = (t % LAMP_CYCLE) / LAMP_CYCLE;
    const on = u < LAMP_ON;
    // Lần chuyển trạng thái: công tắc vừa ngắt hoặc vừa khép, đèn chớp một
    // cái cho người xem thấy có việc xảy ra, không phải đèn tự nhiên nhấp nháy.
    if (on !== lastOn) { lastOn = on; flashT = t; }
    const fl = Math.exp(-(t - flashT) * 5);
    const lit = on ? 1 : 0;
    bulb.material.color.copy(on ? lampOn : lampOff).lerp(white, .55 * fl);
    bulb.scale.setScalar(1 + .25 * fl);
    const hs = .040 + .030 * fl;
    halo.scale.set(hs, hs, 1);
    halo.material.opacity = (.05 + .30 * lit) + .35 * fl;
    halo.material.color.copy(on ? lampOn : lampOff).lerp(white, .5 * fl);
    // hơi nước: bay liên tục, cột hơi đổi hình mỗi khung
    steamFlow.update(t, 1);
  };
  // Khung dựng riêng để soi vật không gọi update(): các hạt hơi phải có mặt
  // ngay từ lúc dựng, nếu không chúng nằm ở gốc toạ độ với kích thước 1.
  g.updateProp(0);
  return g;
}

export const PROP = { name: 'nồi cơm đời đầu', view: () => noiComDoiDau() };

// Dây điện của nồi đời đầu, dựng riêng khỏi thân nồi (lý do như ở
// noiComDienCord): dây là phụ kiện của cảnh, không kéo theo khung vật.
// Ổ cắm trên tường dùng chung với nồi hiện đại, nồi đời đầu cắm vào lỗ
// còn lại. Dây phải vắt trên mặt bàn chứ không vắt võng trong không khí:
// một sợi dây thẳng đứng giữa bàn và tường nhìn là bịa đặt.
export function noiComDoiDauCord() {
  return cable({
    points: [[0, .04, -.19], [-.15, .012, -.33], [-.40, .012, -.49], [-.62, .012, -.62],
      [-.80, .04, -.72], [-.8726, .17, -.768], [-.8726, .30, -.768]],
    r: .007, color: '#3a2f26', plug: 'wall',
  });
}
