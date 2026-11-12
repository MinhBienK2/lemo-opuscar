// Trang phim: 37 nhát, mỗi câu lời kể một nhát, theo shot list của LOOK.md.
// Mỗi nhát bám vào câu nó mang (V.L[id].t0/t1) nên nhịp quay đúng với lời kể.
import * as THREE from 'three';
import { film, label, subtitle, toScreen, markBeat } from '../../../../rig/render.js';
import { PAL, keys, seg, ss, eio, eo, lerp, clamp } from '../../../../rig/kit.js';
import { build } from './timeline.js';
import { loadVoice } from '../../../../rig/voice.js';
import { buildSanThuong, buildKhongKhi, buildTiaDo, buildKhongGian, buildBuiMo } from './set.js';

const V = await loadVoice(build);
const F = film({ fov: 44, far: 400 }), camera = F.camera;

const N1D = buildSanThuong('dusk');       // sân thượng, chiều muộn
const N1R = buildSanThuong('hoang-hon');  // sân thượng, Mặt Trời sát chân trời
const N6 = buildSanThuong('xep-chieu');    // sân thượng, đã lặn nắng
const N2 = buildKhongKhi();                // trong không khí, ban ngày
const N3 = buildTiaDo();                   // trong không khí, chiều muộn, dọc theo tia
const N4 = buildKhongGian();               // từ không gian
const N5 = buildBuiMo();                   // sát chân trời: dải nhạt và bụi mờ
const setOf = { N1D, N1R, N6, N2, N3, N4, N5 };

// ── 37 nhát ──────────────────────────────────────────────────────────────
// sh(cảnh, câu, tiêu cự, vị trí máy, điểm nhìn, đẩy máy trong nhát, độ dày nét)
// `ink` là độ dày nét riêng của nhát: trong không khí có những sợi sáng rất
// mảnh, nét quá dày thì nuốt hết sợi và nó đọc ra là cái que tối.
const sh = (s, id, fov, p, l, d = [0, 0, 0], ink = null) => ({
  s, ids: [id], fov, ink,
  pose: u => {
    const pp = typeof p === 'function' ? p() : p;
    const ll = typeof l === 'function' ? l() : l;
    // điểm nhìn có thể là mảng [x,y,z] hoặc Vector3 của three.js
    const l3 = (ll && typeof ll.x === 'number') ? [ll.x, ll.y, ll.z] : ll;
    return { p: [pp[0] + d[0] * ss(u), pp[1] + d[1] * ss(u), pp[2] + d[2] * ss(u)], l: l3 };
  },
});

// điểm nhìn tính từ hướng: hướng ngang `az` (lệch sang phải so với -z) và
// độ cao `el`, ở khoảng cách `dist` trước máy.
const aim = (p, az, el, dist = 10) => [
  p[0] + dist * Math.sin(az) * Math.cos(el),
  p[1] + dist * Math.sin(el),
  p[2] - dist * Math.cos(az) * Math.cos(el),
];

// một điểm trên mặt cầu, ở hướng nhìn của máy: `a` lệch sang phải, `b` lệch
// lên trên, tính theo hướng nhìn của chính máy đó.
function shellPoint(radius, camPos, a = 0, b = 0) {
  const c = new THREE.Vector3(camPos[0], camPos[1], camPos[2]);
  const up = new THREE.Vector3(0, 1, 0);
  const u = c.clone().normalize();                       // từ tâm về máy
  const right = new THREE.Vector3().crossVectors(u, up);
  if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
  right.normalize();
  const upv = new THREE.Vector3().crossVectors(right, u).normalize();
  return u.addScaledVector(right, a).addScaledVector(upv, b).normalize().multiplyScalar(radius).toArray();
}

// Điểm trên VÒNG MÉP của một vỏ cầu: chỗ mà đường nhìn của máy tiếp tuyến
// với vỏ. Mũi tên của thẻ phải chỉ vào đúng vòng viền đó — chỉ vào một điểm
// bất kỳ trên mặt cầu thì mũi tên sẽ chạm vào biển hoặc lục địa.
// `ang` tính theo khung của máy: 0 = bên trái, 90° = phía trên.
function limbPoint(radius, camPos, ang) {
  const c = new THREE.Vector3(camPos[0], camPos[1], camPos[2]);
  const d = c.length();
  const u = c.clone().normalize();                       // từ tâm về máy
  const up = new THREE.Vector3(0, 1, 0);
  const lef = new THREE.Vector3().crossVectors(u, up);    // bên trái của máy
  if (lef.lengthSq() < 1e-6) lef.set(-1, 0, 0);
  lef.normalize();
  const upv = new THREE.Vector3().crossVectors(lef, u).normalize();
  const w = lef.multiplyScalar(Math.cos(ang)).addScaledVector(upv, Math.sin(ang)).normalize();
  const rr = Math.min(.999, radius / d);
  return u.multiplyScalar(rr).addScaledVector(w, Math.sqrt(1 - rr * rr)).multiplyScalar(radius).toArray();
}

const P = {
  c01: [0.10, 1.62, 2.30],
  c02: [1.45, 1.56, -1.00],
  c03: [-0.30, 1.66, 2.30],
  c21: [-0.40, 1.58, 3.40],
  c22: [0.20, 1.75, 4.20],
  c23: [-0.30, 1.66, 2.30],
  c24: [-0.20, 1.68, 2.20],
  c35: [0.10, 1.62, 2.30],
  c36: [1.45, 1.40, -1.85],
  c37: [0.95, 1.28, -2.85],
};

const SHOTS = [
  // ── N1D · sân thượng, chiều muộn ──
  // c01: mở đầu — đứng trên sân thượng, tầm mắt người. Mặt Trời thấp lệch
  // phải, lan can và tờ giấy ở gần, thùng nước giữa, thành phố xa.
  sh('N1D', 'c01', 44, P.c01, aim(P.c01, 0.20, 0.045), [0, 0, -.02]),
  // c02: câu kể ba thứ cùng lúc (chân trời đỏ rực, trời cao còn xanh, tờ
  // giấy nhuốm cam). Máy lùi lại cho lan can vào khung: tờ giấy vắt trên
  // thanh ở góc dưới bên trái, chân trời đỏ ở giữa, trời cao còn xanh ở trên.
  sh('N1D', 'c02', 46, P.c02, aim(P.c02, -0.05, -0.05), [0, 0, -.01]),
  // c03: ngướng lên cho trời tràn khung — câu hỏi bỏ ngỏ ở trên cao.
  sh('N1D', 'c03', 52, P.c03, aim(P.c03, -0.18, 0.40), [0, .06, -.02]),
  // ── N2 · trong không khí, ban ngày ──
  // c04: vào trong không khí: rộng, thấy cả chùm sáng ngang và lớp hạt.
  sh('N2', 'c04', 42, [0.20, 0.60, 3.20], [0, 0.30, -2.00], [0, 0, -.04], 2.3),
  // c05: chùm sáng trắng đi ngang qua một lớp hạt nhỏ.
  sh('N2', 'c05', 34, [-3.00, 0.50, 2.40], [0.40, 0.45, -0.40], [0, 0, -.03], 2.3),
  // c06: cận hai hạt sát chùm sáng: chúng rực lên, và dòng sáng bị rẽ sang
  // bên, có một dòng bay về phía máy.
  sh('N2', 'c06', 32, [0, 0.30, 2.60], [0, 0.16, -0.20], [0, 0, -.012], 2.0),
  // c07: ba thứ cùng khung — dòng bị rẽ (trái, phải) và chùm đi thẳng (giữa).
  // Máy lùi lại để miệng ống sáng nằm trọn trong khung.
  sh('N2', 'c07', 40, [0, 0.50, 5.20], [0, 0.05, -1.00], [0, 0, -.03], 2.3),
  // c08: hai hạt cạnh nhau, mỗi hạt một dải sóng.
  sh('N2', 'c08', 28, [0, 0.34, 2.40], [0, 0.28, 0], [0, 0, -.015], 2.3),
  // c09: cận hơn nữa để đọc dải sóng ngắn (chín lần uốn) và dải sóng dài.
  sh('N2', 'c09', 30, [-0.10, 0.30, 1.90], [-0.05, 0.30, 0], [0, 0, -.012], 2.3),
  // c10: ngước lên — dòng sáng xanh bay về từ mọi hướng. Tâm của các dòng
  // nằm đúng giữa khung.
  sh('N2', 'c10', 48, [0, -0.40, 4.00], [0, 2.30, -6.00], [0, .05, -.05], 2.3),
  // c11: rộng và cao hơn: cả khung lấp đầy màu xanh.
  sh('N2', 'c11', 40, [0, 0.80, 5.20], [0, 2.60, -7.60], [0, .04, -.04], 2.3),
  // c12: tách hai thứ ánh sáng — chùm đi thẳng vào mắt ta.
  sh('N2', 'c12', 34, [0, 0.10, 3.30], [0, 0.02, -2.00], [0, 0, -.03], 2.3),
  // c13: nhìn dọc theo chùm thẳng: nó phải đi qua không khí suốt đường đi.
  // Máy đứng cạnh chùm và nghiêng, nên chùm chạy chéo qua khung và chạm mép
  // khung hai bên — không kết thúc bằng một mũi nhọn giữa hình.
  sh('N2', 'c13', 34, [-3.00, 1.00, 3.00], [1.00, 0.00, -0.60], [0, 0, -.03], 2.3),
  // ── N3 · chiều muộn, nhìn ngược dọc theo tia ──
  // c14: quay ngược dọc theo tia về phía nơi Mặt Trời thấp hơn.
  sh('N3', 'c14', 40, [4.60, 0.70, 2.60], [-4.00, 0.10, -0.60], [0, 0, -.04]),
  // c15: thước đo quãng đếm các lớp — con số phải đi kèm vật mang nó.
  sh('N3', 'c15', 32, [2.00, 1.90, 3.40], [-6.00, 1.20, 0.20], [0, 0, -.02]),
  // c16: các lớp hạt dày dần dọc theo tia. Máy nhìn CHÉP bên (vuông góc gần
  // với tia) thì 14 lớp thành những dải song song, mỗi dải rõ hơn dải trước.
  sh('N3', 'c16', 32, [-13.40, 0.35, 23.50], [-4.88, 0.00, 0.00], [0.10, 0, -.28]),
  // c17: chùm sáng mất gần hết màu xanh khi đi qua lớp không khí dày.
  sh('N3', 'c17', 34, [2.20, 0.50, 3.40], [-8.00, 0.05, -0.40], [0, 0, -.02]),
  // c18: thước đo phần trăm màu xanh.
  sh('N3', 'c18', 24, [-4.60, 1.12, 2.40], [-6.50, 1.00, 0.60], [0, 0, -.010]),
  // c19: thước đo phần trăm màu đỏ — cùng góc, lật xuống dưới.
  sh('N3', 'c19', 24, [-4.60, -0.75, 2.40], [-6.50, -0.85, 0.60], [0, 0, -.010]),
  // ── N1R · sân thượng, Mặt Trời sát chân trời ──
  // c20: đĩa Mặt Trời đỏ rực, ngay giữa khung.
  sh('N1R', 'c20', 30, [1.55, 1.55, -0.20], [5.63, 1.79, -9.33], [0, 0, -.02]),
  // c21: cả sân thượng nhuốm cam, bóng đổ dài về phía máy.
  sh('N1R', 'c21', 40, P.c21, aim(P.c21, 0.15, -0.13), [0, 0, -.03]),
  // c22: tờ giấy, mặt tường và mặt nước trong thùng — ba thứ cùng lúc.
  // Máy lùi xa để tờ giấy (trên lan can, xa nhất) vẫn nằm giữa khung, còn
  // tường nhà thang bên trái và mặt nước trong thùng bên phải cùng vào khung.
  sh('N1R', 'c22', 50, [0.00, 1.95, 4.20], [-0.16, 1.08, -1.90], [0, 0, -.04]),
  // c23: ngẩng lên — phần trời cao vẫn còn xanh trong khi chân trời đỏ.
  sh('N1R', 'c23', 50, P.c23, aim(P.c23, 0.10, 0.12), [0, .04, -.02]),
  // c24: càng ngẩng, càng xanh — ánh sáng ở trên cao chỉ đi qua ít không khí.
  sh('N1R', 'c24', 52, P.c24, aim(P.c24, 0.05, 0.17), [0, .05, -.02]),
  // ── N5 · sát chân trời: dải nhạt và bụi mờ ──
  // c25: dải nhạt gần như trắng nằm giữa dải đỏ và dải xanh. Máy hạ thấp hơn
  // dải để dải rơi vào khoảng 1/3 trên khung, phần dưới để cho tầng khí thấp.
  sh('N5', 'c25', 30, [0.50, 2.55, 4.00], [0.50, 2.85, -18], [0, 0, -.05]),
  // c26: cận một hạt bụi mờ, cạnh nó là hạt không khí nhỏ xíu. Máy cận và
  // ngẩng lên một chút, nên hạt bụi đứng trên nền trời phẳng, to gấp nhiều
  // lần hạt không khí đứng cạnh nó.
  sh('N5', 'c26', 22, [-0.55, 3.05, 1.10], [0.00, 3.58, 0.00], [0.04, 0.04, -.08]),
  // c27: lùi ra: cả dải nhạt, hạt bụi lơ lửng trong đó. Máy ngang tầm mắt
  // với dải để dải nằm giữa khung.
  sh('N5', 'c27', 34, [0.20, 3.05, 5.20], [0.20, 2.95, -18], [0, 0, -.06]),
  // ── N4 · từ không gian ──
  // c28: Trái Đất từ không gian, vùng sáng còn hẹp chạy vòng chân trời.
  sh('N4', 'c28', 30, [2.20, 1.40, 3.80], [0, 0, 0], [0, 0, -.05]),
  // c29: tiến sát hơn, vệt sáng hẹp lại.
  sh('N4', 'c29', 26, [1.40, 0.90, 3.00], [0, 0, 0], [0, 0, -.035]),
  // c30: hai vỏ: khí quyển và lớp ozon mỏng hơn, ở trên cao.
  sh('N4', 'c30', 30, [1.55, 1.30, 3.70], [-0.35, 0.30, 0.25], [0, 0, -.02]),
  // c31: chùm sáng cam đỏ đi qua lớp mỏng, phần đỏ bị nuốt, xanh lọt.
  sh('N4', 'c31', 30, [2.60, 1.20, 4.10], [0, 0, 0], [0, 0, -.02]),
  // c32: màu xanh lọt qua rọi xuống mặt đêm — máy nghiêng theo đúng chỗ
  // tia xanh rơi xuống (P là điểm rọi, tính từ vị trí máy của c32).
  sh('N4', 'c32', 28, [2.05, -0.45, 3.05], [0.5203, -0.1000, 0.8480], [0, 0, -.020]),
  // c33: lùi ra, vùng sáng lùi dần theo vệt sáng.
  sh('N4', 'c33', 30, [2.60, 1.60, 3.40], [0, 0, 0], [0, 0, -.04]),
  // c34: nhãn đi theo vùng sáng.
  sh('N4', 'c34', 28, [2.00, 2.00, 3.00], [0, 0, 0], [0, 0, -.03]),
  // ── N6 · sân thượng, xế chiều ──
  // c35: quay lại đúng góc khung mở, nhưng trời đã đổi màu.
  sh('N6', 'c35', 40, P.c35, aim(P.c35, 0.20, 0.045), [0, 0, -.02]),
  // c36: cận tờ giấy — giờ nó xanh nhạt.
  // c36: cận tờ giấy trên lan can — ngắm thẳng vào chính tờ giấy, không vào
  // phía sau nó.
  sh('N6', 'c36', 30, P.c36, () => N6.paperAt, [0, 0, -.008]),
  // c37: lùi lại khung mở, xế chiều.
  // Cùng một chỗ với c01/c35 — câu chốt đòi người xem thấy "cùng một nơi,
  // màu khác", nên máy đứng đúng chỗ của khung mở, chỉ rộng ra và ngước
  // thêm một chút cho dải trời xanh tím chiếm phần trên.
  sh('N6', 'c37', 46, P.c35, aim(P.c35, 0.10, 0.075), [0, 0, -.01]),
];

const MARK = SHOTS.map(s => ({ t0: V.L[s.ids[0]].t0, t1: V.L[s.ids[s.ids.length - 1]].t1 }));

// ── thẻ thuật ngữ ────────────────────────────────────────────────────────
// Mũi tên của thẻ phải chạm vào đúng vật, nên điểm neo lấy từ chính bối cảnh.
const CARDS = [
  // "chín lần" là so sánh giữa hai dải sóng: mũi tên chỉ vào dải sóng ngắn
  // (hạt bên trái), dải sóng dài là dải rẽ yếu.
  { id: 'chinlan', text: 'CHÍN LẦN', at: () => N2.waveShortAt.toArray(), lines: ['c09'], size: 34 },
  // "gần 38 lần" đi kèm thước đo quãng — con số phải bám vào vật đếm.
  { id: 'gam38', text: 'GẦN 38 LẦN', at: () => [-8.00, 1.60, 0.55], lines: ['c15'], size: 32 },
  // "2,5 %" và "15 %": mũi tên chỉ vào đúng chấm sáng đang cháy trên thước đo.
  { id: 'xanh25', text: 'XANH CÒN 2,5 %', at: () => [-7.00, 1.07, 0.62], lines: ['c18'], size: 28 },
  { id: 'do15', text: 'ĐỎ CÒN 15 %', at: () => [-6.96, -0.83, 0.62], lines: ['c19'], size: 28 },
  // Hai vỏ ở c30: khí quyển (xanh, dày) và lớp ozon (mỏng, ở trên cao).
  { id: 'khi', text: 'LỚP KHÍ QUYỂN', at: () => limbPoint(1.085, [1.55, 1.30, 3.70], .785), lines: ['c30'], size: 24 },
  { id: 'ozon', text: 'LỚP OZON', at: () => limbPoint(1.13, [1.55, 1.30, 3.70], 1.745), lines: ['c30'], size: 24 },
  // Nhãn của vùng sáng: neo vào điểm trên vệt sáng, lệch sang một bên để thẻ
  // không nằm đè lên Trái Đất.
  { id: 'vungsang', text: 'MẶT TRỜI LẶN 0° → 6°', at: () => {
    const v = new THREE.Vector3(2.00, 2.00, 3.00).normalize();
    const s = N4.SUN.clone().normalize();
    const perp = v.clone().addScaledVector(s, -v.dot(s)).normalize();
    const side = new THREE.Vector3().crossVectors(s, perp).normalize();
    return perp.multiplyScalar(Math.cos(.62)).addScaledVector(side, Math.sin(.62)).multiplyScalar(1.02).toArray();
  }, lines: ['c34'], size: 28 },
];
// Cửa sổ của thẻ: đúng luật của rig (rig/render.js, cardWindow) — thẻ hiện từ
// khi máy cắt sang câu của nó (tức câu trước vừa hết) cho tới khi câu đó hết.
// Rig tính bằng cách ghép 'c' + (n-1), nên chỉ đúng với mã câu không chèn số 0;
// tập này dùng mã có số 0 (c01…c37), nên cửa sổ được tính ở đây, cùng luật.
const IDS = Object.keys(V.L);
function cardWindowHere(C) {
  const i = IDS.indexOf(C.lines[0]);
  return {
    t0: i > 0 ? V.L[IDS[i - 1]].t1 : V.L[C.lines[0]].t0,
    t1: V.L[C.lines[C.lines.length - 1]].t1,
  };
}
for (const C of CARDS) {
  Object.assign(C, cardWindowHere(C));
}

// ── trạng thái của bối cảnh theo câu đang kể ─────────────────────────────
function stateN2(id, t) {
  // Mỗi câu chỉ bật đúng những tầng hình của nó: hạt sát chùm (hot), dòng
  // bị rẽ (rays), dòng bay về phía máy (toCam), dòng từ mọi hướng (all),
  // dải sóng (waves), chùm thẳng (straight) và vị trí miệng ống của nó.
  // `mols`: 'all' thì đầy hạt khí; 'few' thì bỏ hẳn (câu ngước lên).
  const s = {
    c04: { hot: 1, side: true, rays: false, toCam: false, all: false, waves: false, straight: false, straightCore: false, mols: 'all' },
    c05: { hot: 1, side: true, rays: false, toCam: false, all: false, waves: false, straight: false, straightCore: false, mols: 'all' },
    c06: { hot: 1, side: true, rays: true, toCam: true, all: false, waves: false, straight: false, straightCore: false, mols: 'all' },
    c07: { hot: 1, side: true, rays: true, toCam: false, all: false, waves: false, straight: false, straightCore: false, mols: 'all' },
    c08: { hot: 1, side: true, rays: false, toCam: false, all: false, waves: true, straight: false, straightCore: false, mols: 'all' },
    c09: { hot: 1, side: true, rays: false, toCam: false, all: false, waves: true, straight: false, straightCore: false, mols: 'all' },
    c10: { hot: 0, side: false, rays: false, toCam: false, all: true, waves: false, straight: false, straightCore: false, dotRed: false, mols: 'few' },
    c11: { hot: 0, side: false, rays: false, toCam: false, all: true, waves: false, straight: false, straightCore: false, dotRed: false, mols: 'few' },
    c12: { hot: 0, side: false, rays: true, toCam: false, all: false, waves: false, straight: true, straightCore: false, straightZ: 2.40, straightScale: 1, mols: 'all' },
    c13: { hot: 1, side: true, rays: false, toCam: false, all: false, waves: false, straight: false, straightCore: false, mols: 'all' },
  }[id] || { hot: 1, side: true, rays: false, toCam: false, all: false, waves: false, straight: false, straightCore: false, dotRed: true, mols: 'all' };
  N2.update(t, s);
}

function stateN3(id, t) {
  // Ở c16 máy nhìn chéo các lớp hạt, nên thước đo và đồng hồ phải biến mất
  // (chúng nằm đúng chỗ các dải hội tụ và che mất lớp), các tấm sương phải
  // tắt (chúng dính các dải thành một vệt mờ), hạt phải to lên và chùm sáng
  // phải mờ đi, để dải hạt là chủ thể của khung.
  const s = {
    c16: { hideTools: true, hideBent: true, dimBeam: true, grainScale: 2.6, sheetAlpha: 0 },
  }[id] || {};
  N3.update(t, s);
}

function stateN4(id, t) {
  const s = {
    c28: { dep: .25, red: .85, blue: .25 },
    c29: { dep: .35, red: .75, blue: .35 },
    c30: { dep: .45, red: .70, blue: .45 },
    c31: { dep: .55, red: 1.0, blue: 1.0 },
    c32: { dep: .65, red: .85, blue: 1.0 },
    c33: { dep: .80, red: .55, blue: .90 },
    c34: { dep: 1.0, red: .35, blue: .80 },
  }[id] || { dep: .5, red: 1, blue: .5 };
  N4.update(t, s);
}

function shotAt(t) {
  for (let i = 0; i < SHOTS.length; i++) {
    if (t < MARK[i].t1 || i === SHOTS.length - 1) {
      const s = SHOTS[i];
      const u = clamp((t - MARK[i].t0) / Math.max(.001, MARK[i].t1 - MARK[i].t0));
      const { p, l } = s.pose(u);
      return { sh: s, i, u, pos: p, look: l };
    }
  }
}

// ── âm thanh ────────────────────────────────────────────────────────────
const EV = [...V.ev];
const ev = (type, t, extra = {}) => EV.push({ type, t: +t.toFixed(3), ...extra });
const amb = (kind, t0, t1) => ev('amb', t0, { kind, t1: +t1.toFixed(3) });
const T = id => V.L[id].t0;

amb('street', 0, T('c04'));            // sân thượng, chiều muộn
amb('hum', T('c04'), T('c14'));         // trong không khí, ban ngày
amb('low', T('c14'), T('c20'));         // trong không khí, chiều muộn
amb('street', T('c20'), T('c25'));      // sân thượng, Mặt Trời sát chân trời
amb('low', T('c25'), T('c28'));         // sát chân trời
amb('low', T('c28'), T('c35'));         // không gian
amb('night_city', T('c35'), V.end);     // sân thượng, xế chiều

for (const [t, cue] of [[0, 'A'], [T('c04'), 'B'], [T('c14'), 'C'], [T('c20'), 'D'],
  [T('c25'), 'E'], [T('c28'), 'F'], [T('c35'), 'G'], [V.end, 'end']])
  ev('music', t, { cue });

// foley: chỉ ở chỗ có việc thật xảy ra — một lần vào mỗi nơi chốn, và một
// tiếng nhẹ mỗi khi thẻ thuật ngữ hiện ra.
ev('whoosh_soft', T('c04'), { v: .40 });
ev('whoosh_soft', T('c14'), { v: .45 });
ev('whoosh_soft', T('c20'), { v: .45 });
ev('whoosh_soft', T('c25'), { v: .40 });
ev('whoosh_soft', T('c28'), { v: .50 });
ev('whoosh_soft', T('c35'), { v: .40 });
ev('line_draw', T('c15'), { v: .22 });   // thước đo quãng hiện ra
ev('dot_place', T('c18'), { v: .26 });  // chấm xanh trên thước đo
ev('dot_place', T('c19'), { v: .26 });  // chấm đỏ trên thước đo
for (const C of CARDS) ev('label_in', C.t0 + .25, { v: .20 });

// ── mốc nhịp ────────────────────────────────────────────────────────────
for (const id of Object.keys(V.L)) {
  const t0 = V.L[id].t0, t1 = V.L[id].t1, tm = (t0 + t1) / 2;
  const s = shotAt(tm);
  const C = CARDS.find(c => c.lines.includes(id));
  const at = C ? (typeof C.at === 'function' ? C.at(tm) : C.at) : s.look;
  camera.fov = s.sh.fov;
  camera.position.set(s.pos[0], s.pos[1], s.pos[2]);
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  const [x, y] = toScreen(new THREE.Vector3(...at), camera);
  markBeat(ev, id, t0, +(t1 - t0).toFixed(3), [+x.toFixed(1), +y.toFixed(1)]);
}

window.DUR = V.end;
window.EV = EV;

window.render = t => {
  const s = shotAt(t);
  const shot = s.sh, id = shot.ids[0];
  camera.fov = shot.fov;
  camera.position.set(s.pos[0], s.pos[1], s.pos[2]);
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();

  const set2 = setOf[shot.s];
  if (shot.s === 'N2') stateN2(id, t);
  else if (shot.s === 'N3') stateN3(id, t);
  else if (shot.s === 'N4') stateN4(id, t);
  else if (shot.s === 'N5') N5.update(t, id === 'c26' ? { grainUp: true } : {}, camera);
  else set2.update(t);

  // Viền mực: "ref" là khoảng cách mà nét đạt độ dày chuẩn. Nó phải bằng khoảng
  // cách từ máy tới vật đang nhìn, nếu không nét ở xa sẽ mất. Lấy theo khoảng
  // cách thật của mỗi cảnh thay vì một con số chung cho cả tập.
  const dSub = Math.hypot(s.pos[0] - s.look[0], s.pos[1] - s.look[1], s.pos[2] - s.look[2]);
  const ref = clamp(dSub * .85, .3, 9);

  F.frame(set2.scene, {
    t, thick: shot.ink ?? clamp(2.6 + ref * .18, 2.8, 4.4), ref, key: set2.key,
    fade: Math.min(1, t / .3 + .2, (window.DUR - t) / .4),
    overlay: (g, tt) => {
      const out = [];
      const s2 = V.sub(tt);
      if (s2) subtitle(g, s2);
      for (const C of CARDS) {
        const size = C.size ?? 40;
        g.save(); g.font = `900 ${size}px "Be Vietnam Pro"`;
        const bw = g.measureText(C.text).width + size, bh = size * 1.55;
        g.restore();
        const [ax, ay] = toScreen(new THREE.Vector3(...(typeof C.at === 'function' ? C.at(tt) : C.at)), camera);
        let x = ax + bw / 2 + 26 + (C.dx || 0), y = ay - bh / 2 - 44 + (C.dy || 0);
        x = clamp(x, bw / 2 + 30, 1916 - bw / 2);
        y = clamp(y, bh / 2 + 8, 876 - bh / 2 - 48);
        const b = label(g, C.text, x, y, tt, C.t0, C.t1, { id: C.id, size });
        if (b) out.push(b);
      }
      return out;
    },
  });
};

window.DIAG = t => {
  const s = shotAt(t);
  return {
    shot: s.i + 1, ids: s.sh.ids, u: +s.u.toFixed(3),
    pos: s.pos.map(v => +v.toFixed(3)), look: s.look.map(v => +v.toFixed(3)),
    fov: s.sh.fov,
    mark: MARK.map(m => [+m.t0.toFixed(2), +m.t1.toFixed(2)]),
  };
};

window.TEXTS = t => { window.render(t); return F.texts(); };
window.__THREE = THREE; window.__cam = camera;
window.__pick = t => setOf[shotAt(t).sh.s];
await document.fonts.load('900 54px "Be Vietnam Pro"');
window.render(0);
window.READY = true;
