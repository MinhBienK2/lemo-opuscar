// Vì sao chai nhựa bị co lại khi rót nước sôi vào? — trang phim: 63 nhát, một câu một hình.
//
// Mỗi nhát bám vào câu nó mang (V.L[id].t0 → V.L[id].t1) nên nhịp quay đúng với lời kể.
// Ba nơi chốn: N1 bàn bếp · N2 trong thành chai · N3 trong bụng chai.
//
// Lời kể đi vào ra nhiều lần, mỗi lần đi vào đều có một lý do: vào thành chai để thấy
// hai hướng kéo giãng (c10), vào bụng chai để thấy nhiệt đi từ nước vào nhựa (c20),
// vào lại thành chai để thấy nhiệt ăn vào lớp móc xích (c21), vào bụng chai để thấy
// khí bị giam (c36, c38) và khí co lại (c49).
//
// Quy tắc số: chỉ hai con số được lên hình — 100 °C (c18) và 70 °C (c23). Cả hai đều
// được lời kể đọc. Đồng hồ áp suất cố tình không có số.
import * as THREE from 'three';
import { film, label, subtitle, toScreen, cardWindow } from '../../../../rig/render.js';
import { keys, ss, lerp, clamp } from '../../../../rig/kit.js';
import { flow } from '../../../../rig/fx.js';
import { build } from './timeline.js';
import { loadVoice } from '../../../../rig/voice.js';
import { buildKitchen, buildInsideWall, buildInsideBottle } from './set.js';

const V = await loadVoice(build);
const F = film({ fov: 36 }), camera = F.camera;

// ── ba nơi chốn ────────────────────────────────────────────────────────────
const SC = { N1: new THREE.Scene(), N2: new THREE.Scene(), N3: new THREE.Scene() };
const N1 = buildKitchen(SC.N1);
const N2 = buildInsideWall(SC.N2);
const N3 = buildInsideBottle(SC.N3);
const setOf = { N1, N2, N3 };

function sceneOf(set, key) {
  let o = set && set.group;
  while (o && !o.isScene) o = o.parent;
  if (o) return o;
  if (set && set.group) SC[key].add(set.group);
  return SC[key];
}

// ── toạ độ thật của vật (đọc từ bộ dựng cảnh, không gõ tay) ───────────────
const P = N1.pos;
const A = P.A, B = P.B, C = P.C, PRE = P.pre, PRE2 = P.pre2;
const POT = P.pot, CUP = P.cup, GG = P.gg, CAP = P.cap;
const MOUTH_A = [A[0], .196, A[2]];          // miệng chai A
const NECK_B = [B[0], .208, B[2]];          // miệng chai B
const NECK_C = [C[0], .208, C[2]];          // miệng chai C
const RIM_CUP = [CUP[0], .1224, CUP[2]];    // miệng cốc (cốc thu 0,72)

// ── hình học ấm: đầu vòi và quai cầm (đọc từ rig/sets.js) ──────────────────
// Ấm nghiêng TILT quanh trục z: đầu vòi chĩa xuống, quai cầm nằm trên cao.
const TILT = -.20;
// Đầu vòi thật của ấm: `rig/sets.js` vẽ vòi là một trụ trục (r0 .035 → r1 .02),
// dài .20, đặt ở [.22,.19], xoay −0,9 rad. **Đầu hẹp** (chỗ nước chảy ra) nằm ở
// [.2983,.2522] trong hệ toạ độ của ấm; ấm nghiêng TILT nên vòi thật trong
// không gian nằm ở rotZ([.2983,.2522], TILT). Số này phải đúng tới centimet —
// lệch 1 cm là tia nước rơi ra **không từ vòi**: người xem thấy một cột nước
// lơ lửng giữa không trung, và không đọc được "đang rót".
const SPOUT = [.2983, .2522];
const BAR = [0, .460];                      // đỉnh quai cầm
const rotZ = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
const SPOUT_R = rotZ(SPOUT, TILT), BAR_R = rotZ(BAR, TILT);
// tư thế rót: đầu vòi nằm trên miệng chai, cao hơn .045
const pourPose = (tx, ty, tz) => [tx - SPOUT_R[0], ty - SPOUT_R[1], tz];
const HOME = [POT[0], 0, POT[2]];           // ấm đứng trên bàn
// Đầu vòi cao hơn miệng chai 7 cm — vừa đủ để tia nước thấy rõ là một tia
// chạy từ vòi xuống miệng, mà vẫn để miệng chai chiếm được chỗ trong khung.
// Cao hơn nữa thì khung phải kéo dài ra, miệng chai lại rơi xuống mép dưới.
const POUR_A = pourPose(A[0], MOUTH_A[1] + .070, A[2]);
const POUR_CUP = pourPose(CUP[0], RIM_CUP[1] + .045, CUP[2]);
// Tay nắm **vòi** của ấm, không phải đỉnh quai: đỉnh quai nằm ở y .58 (quá
// cao, không bao giờ vào được khung cận miệng chai), còn vòi nằm ngay trên
// miệng chai — đúng cái mà câu cần thấy: tay đang rót. Chỗ nắm tính ở
// `GRIP_DIR` (58 % từ gốc vòi lên đầu vòi); vị trí tay được đặt bằng
// `placeHand` — đầu ngón giữa nằm đúng trên vòi, không lơ lửng.
// quai cốc (nằm bên phải cốc) và vị trí của nó khi cốc bị nghiêng
const HANDLE_CUP = [.0612, .0648];          // quai cốc (thu theo cốc)
const handleAt = (cx, cy, cz, tilt) => {
  const c = Math.cos(tilt), s = Math.sin(tilt);
  return [cx + HANDLE_CUP[0] * c - HANDLE_CUP[1] * s,
    cy + HANDLE_CUP[0] * s + HANDLE_CUP[1] * c, cz];
};
// đầu vòi khi rót (dùng cho dòng nước)
const tipAt = (kx, ky, kz) => [kx + SPOUT_R[0], ky + SPOUT_R[1], kz];
// Gốc vòi (đầu rộng) trong hệ toạ độ của ấm: `rig/sets.js` vẽ vòi là một
// trụ dài 0,20 m đặt ở [0.22, 0.19], xoay −0,9 rad — đầu rộng nằm ở
// [0.1417, 0.1278]. Chỗ tay nắm là 58 % từ gốc vòi lên đầu vòi: đủ gần đầu
// vòi để người xem thấy "tay đang rót", nhưng không chắn chỗ nước chảy ra.
const SPOUT_BASE = [.1417, .1278];
const GRIP_K = .58;
const GRIP_LOCAL = [lerp(SPOUT_BASE[0], SPOUT[0], GRIP_K), lerp(SPOUT_BASE[1], SPOUT[1], GRIP_K)];
const GRIP_DIR = rotZ(GRIP_LOCAL, TILT);

// ── dòng nước sôi: một dòng cho chai, một dòng cho cốc ────────────────────
const POUR_TIP_A = tipAt(POUR_A[0], POUR_A[1], POUR_A[2]);
const POUR_TIP_C = tipAt(POUR_CUP[0], POUR_CUP[1], POUR_CUP[2]);
// Tia nước: **mỏng và nhạt**. Hạt 3,4 mm với độ đặc .74 đọc ra là "một que
// sáng", không đọc ra là nước chảy — và nó nuốt mất luôn đầu vòi.
const POUR_A_FLOW = flow(POUR_TIP_A, [MOUTH_A[0], MOUTH_A[1] - .010, MOUTH_A[2]],
  { color: '#bfe9ff', size: .0026, n: 72, rate: .55, opacity: .50, lift: .008 });
const POUR_CUP_FLOW = flow(POUR_TIP_C, [CUP[0], RIM_CUP[1] - .012, CUP[2]],
  { color: '#bfeaff', size: .0075, n: 56, rate: .55, opacity: .5 });
// nước đã nguội từ cốc sang chai C ở c63: người xem phải thấy nước đi vào chai
// trước khi nắp vặn lên, không phải thấy "vặn nắp một cái chai rỗng".
const POUR_C_TO_C = flow([C[0] + .002, .284, C[2]], [C[0], .196, C[2]],
  { color: '#e6f7ff', size: .0062, n: 52, rate: .5, opacity: .58 });
N1.group.add(POUR_A_FLOW, POUR_CUP_FLOW, POUR_C_TO_C);

// ── 63 nhát: một câu một hình ─────────────────────────────────────────────
// sh(nơi, câu, tiêu cự, vị trí máy, điểm nhìn, lệch máy) — vị trí/điểm nhìn/lệch
// có thể là hàm (t, u) để máy đi trong nhát.
const sh = (s, id, fov, pos, look, d = [0, 0, 0]) => ({ s, ids: [id], fov, pos, look, d });

const SHOTS = [
  // ── N1 · bàn bếp: hiện tượng đời thường ──
  // cận miệng chai A: dòng nước sôi rơi vào, cột hơi nước bốc lên. Tay cầm quai
  // nằm ngoài khung (nó ở cách miệng chai nửa mét) — tay vào khung ở c2 và c8.
  // c1: khung phải có **cả đầu vòi, cả tia nước, cả miệng chai**: đầu vòi ở
  // y .306, miệng chai ở y .196, nên khung cao từ .17 tới .31.
  // c1: khung phải có **cả vòi, cả tia nước, cả miệng chai**, và miệng chai
  // phải ở giữa khung chứ không rơi xuống mép dưới.
  sh('N1', 'c1', 30, [-.9000, .2500, 1.0750], [-.9200, .2150, A[2]]),
  sh('N1', 'c2', 26, [-.860, .120, 1.020], [-.920, .075, A[2]]),
  sh('N1', 'c3', 42, [-.560, .800, 1.720], [-.790, .270, .860]),
  sh('N1', 'c4', 30, [-.920, .250, 1.290], [-.920, .118, A[2]], [0, 0, -.090]),
  // hai chai giống hệt nhau: A và B, chai C nằm ngoài khung
  // c5: hai chai giống hệt nhau, **không có thân ấm và mảnh preform** lọt vào
  // mép khung (chúng làm hình đọc nhầm thành ba vật khác nhau).
  sh('N1', 'c5', 30, [-.760, .190, 1.480], [-.785, .105, .880]),
  // máy trượt sang mẩu preform: câu này trỏ sang một thứ khác trên bàn
  // c6–c8: mẩu preform là một **vật nhỏ** (cao ~8 cm) — máy phải **lùi ra**,
  // không được dí vào nó. Dán sát thì mẩu preform thành một mảng nhựa trắng
  // chắn ngang khung, người xem không đọc ra đó là một mẩu nhựa nhỏ xíu.
  // Ba nhát này phải **khác nhau rõ**: c6 thấy **hai mẩu** trên bàn, c7 là
  // **cận cổ** mẩu preform (thành dày + ren xoắn — cái đáng chú ý của một mẩu
  // chưa nong), c8 thấy **bàn tay cầm mẩu preform lên**.
  sh('N1', 'c6', 30, [-.900, .210, 1.500], [-1.150, .050, 1.030]),
  sh('N1', 'c7', 26, [-1.075, .165, 1.215], [-1.120, .135, 1.085]),
  sh('N1', 'c8', 24, [-.960, .150, 1.420], [-1.110, .060, 1.075]),
  // lùi ra cho cả cái chai nong nằm trọn trong khung, rồi đi theo tay
  // c9: khung phải chứa **trọn** cái chai vừa nong (dài 19,6 cm), nên khung
  // cao ~0,16 m: fov 28 ở cự ly 0,38 m.
  // c9: máy **đi theo tay** đưa cái chai vừa nong đi — nếu máy đứng yên thì
  // cuối nhát chỉ còn một mặt bàn trống.
  // c9: máy **đi theo tay** đưa cái chai vừa nong đi — nếu máy đứng yên thì
  // cuối nhát chỉ còn một mặt bàn trống. Máy và điểm nhìn đều đi theo mẩu
  // preform (nó nong lên và được tay đưa đi), nên cái chai luôn ở giữa khung.
  sh('N1', 'c9', 28,
    (t, u) => [-.985 - .330 * ss(u), .250 + .120 * ss(u), 1.230 + .190 * ss(u)],
    (t, u) => [-1.115 - .320 * ss(u), .090 + .070 * ss(u), PRE2[2] + .055 * ss(u)]),

  // ── N2 · trong thành chai: hai hướng kéo giãng ──
  // c10: mảng nhựa không được lấp kín khung — máy lên cao hơn mép cắt để
  // **nền tối lộ ra ở trên**, và thẻ `HAI HƯỚNG` đứng trên nền tối đó.
  sh('N2', 'c10', 34, [.060, .120, .560], [.000, .010, .260]),
  sh('N2', 'c11', 34, [.240, .100, .460], [.070, .000, .250]),
  // c12: nhìn dọc trục chai nhưng **lệch một chút**, không phải thẳng đứng từ
  // trên xuống — nhìn thẳng đứng thì khung thành một sơ đồ kỹ thuật, mất cảm
  // giác là lớp nhựa cong.
  // c12: phải thấy **cả hai** bộ móc xích cùng lúc (một vòng quanh thân, một
  // bộ dọc thân) — vòng có đường kính 0,51 m nên máy phải lùi đủ xa.
  // c12: phải thấy **cả hai** bộ móc xích cùng lúc (một vòng quanh thân, một
  // bộ dọc thân) để câu "không giãn giống nhau" có cái mà so — góc nhìn từ
  // bên trái, khác hẳn góc của c14 (bên phải).
  sh('N2', 'c12', 40, [.300, .150, .740], [.000, .005, .250]),
  // c13: cú đẩy vào lớp nhựa — móc xích **chưa lộ** (chúng lộ ra ở c14), nên
  // khung là lớp nhựa cong, rìa khung tối lại.
  // c13: máy **đi sát** vào lớp nhựa cong — khung là một mảng nhựa cong tối
  // viền, có mép cắt ở đáy; móc xích chưa lộ (nó ở c14 mới hiện).
  // Móc xích nằm ở **giữa chiều cao** mảng nhựa và đầu bộ dọc thân chỉ kém
  // mép trên 1,2 cm, nên không có máy nào đứng ngoài vừa lấp kín khung bằng
  // nhựa vừa giấu móc xích. Vì vậy ở c13 móc xích **ẩn hẳn**, và khung chỉ
  // còn lớp nhựa: hai mép cắt sáng (trên và bên phải) gặp nhau ở góc mảng, còn
  // độ cong của lớp nhựa đọc ra qua mép cắt chạy chéo. Nền tối ngoài mép cắt
  // = rìa khung tối.
  sh('N2', 'c13', 24, [-.160, .050, .240], [.030, .048, .220]),
  // c14: hai bộ móc xích lộ ra — phải thấy **cả hai bộ** cùng lúc, nên khung
  // rộng hơn c13 và không sát chúng như cận cảnh.
  // c14: **cả hai** bộ móc xích cùng trong khung — vòng quanh thân (cung
  // tròn ở đáy khung) và bộ dọc thân (cột ở giữa) — máy ở góc 35°, không từ
  // trên xuống, để hai hướng đọc ra khác nhau.
  // Vòng móc xích có đường kính 0,51 m: để nó khép kín trong khung, máy phải
  // lùi ra ~0,58 m và nâng lên 0,12 m (fov 36). Bộ dọc thân đứng lệch trái
  // giữa khung, tách khỏi cung của vòng; neo thẻ `MÓC XÍCH` rơi vào vùng
  // nhựa trống nên thẻ không đè lên móc xích.
  sh('N2', 'c14', 42, [.125, .144, .652], [.050, .014, .260]),
  // c15: nửa sau của cú lùi ra từ c14 — móc xích ở bên trái khung, vùng nhựa
  // trống ở bên phải, cùng một mặt cắt. Câu "nhựa không có trí nhớ" cần cái
  // đối chiếu, không cần một khung trống.
  // Máy nhìn chéo về phía mép cắt nên cung móc xích dồn sang mép trái + đáy
  // khung, còn phần nhựa trong suốt bên trên-phải trống trơn — đúng câu kể.
  sh('N2', 'c15', 30, [.131, .120, .586], [-.020, .045, .264]),
  sh('N2', 'c16', 30, [-.140, .030, .380], [-.030, .000, .250]),

  // ── N1 · rót lại, và cái mốc nhiệt ──
  // c17: tua lại cảnh mở đầu từ **một góc khác hẳn** (thấp hơn, lệch sang phải),
  // nhưng vẫn phải có đầu vòi + tia nước + miệng chai trong một khung.
  // c17: tua lại cảnh rót nhưng **từ một góc khác hẳn** — máy ở bên phải,
  // nhìn chéo qua miệng chai; thân ấm và cánh tay nằm ngoài khung, khung
  // chỉ còn vòi, tia nước và miệng chai.
  sh('N1', 'c17', 28, [-.7700, .3900, 1.0200], [-.9250, .2450, A[2]]),
  // siêu cận mặt nhiệt kế trong cốc: số "100" khắc trên đĩa và cột rơi ở đỉnh
  // mặt nhiệt kế trong cốc: máy lùi xa (xa hơn mặt phẳng cắt gần của
  // ống kính) để thấy trọn mặt đồng hồ, cột rơi và vành cốc
  sh('N1', 'c18', 28, [-.2380, .1950, 1.1550], [-.2540, .1880, .9620]),
  // khung rộng: thành chai lấm vệt ấm (dưới) lẫn cột hơi nước dày (trên)
  // c19: khung phải có **cả thân chai (vệt ấm) lẫn miệng chai (gốc cột hơi
  // nước)** trong một hình — máy nhìn thấp hơn và lùi xa hơn, không chỉ nhìn
  // vào tường.
  sh('N1', 'c19', 30, [-.905, .2000, 1.3300], [-.920, .1750, A[2]]),
  // N3: nhiệt đi từ mặt nước vào thành
  // c20: máy phải thấy **mặt nước ở dưới, vệt nhiệt loang lên, và mũi tên nhiệt
  // chạy vào thành** — dí sát quả cầu nhiệt thì khung chỉ còn một quả cầu cam
  // không đọc ra là gì.
  sh('N3', 'c20', 46, [.000, .075, .125], [.000, .055, .000]),
  // N2: nhiệt ăn vào lớp móc xích
  sh('N2', 'c21', 30, [.130, .020, .350], [.010, -.005, .240]),
  // ngoài miệng chai: cột hơi nước mỏng đứng thẳng lên từ miệng chai
  // c22: cột hơi nước phải **mọc ra từ miệng chai** — nên miệng chai phải có
  // mặt trong khung, không cắt ở mép dưới. Máy nhìn thấp hơn miệng chai.
  sh('N1', 'c22', 30, [-.905, .2300, 1.1100], [-.920, .2200, A[2]]),
  // siêu cận vạch đỏ bảy mươi độ trên mặt đồng hồ (trong cốc)
  // siêu cận vạch đỏ bảy mươi độ: vạch ở bên trái, cột rơi ở giữa, con số
  // in ở bên phải — ba thứ cùng một khung
  // c23: nới tiêu cự để thấy **cả vạch đỏ, con số 70 khắc trên đĩa và một
  // mặt đồng hồ**; số 70 khắc sẵn trên đĩa nên không cần thẻ chữ đè lên nó.
  // c23: khung phải có **vành cốc và mặt nước** ở dưới mặt đồng hồ — không có
  // cốc thì câu "mốc bảy mươi độ" mất hết bối cảnh vật lý (nước sôi trong cốc).
  sh('N1', 'c23', 26, [-.3000, .1900, 1.2400], [-.2620, .1600, .9650]),
  // vệt ấm lan rộng trên thành chai
  // c24: vệt nhiệt lan rộng trên thành chai — máy lùi ra một chút để thấy
  // **cả vệt ấm** chứ không chỉ một mảng nhựa nhạt chiếm trọn khung.
  sh('N1', 'c24', 30, [-.9050, .1750, 1.0450], [-.9200, .1350, A[2]]),

  // ── N2 · vật liệu trượt, rồi chai co ──
  sh('N2', 'c25', 30, [.090, .010, .340], [.000, .000, .245]),
  sh('N2', 'c26', 30, [-.110, .020, .350], [-.020, .000, .245]),
  sh('N2', 'c27', 30, [.040, .040, .320], [.000, .000, .235]),
  sh('N1', 'c28', 28, [-.880, .160, 1.040], [-.920, .085, A[2]]),
  sh('N1', 'c29', 34, [-1.050, .180, 1.240], [-1.080, .060, .920]),
  // c30: lùi thêm và nới tiêu cự để thấy **cả cái chai nằm trên bàn** kèm bóng
  // đổ dưới — đây là bằng chứng, không phải một vệt nhăn trong khung.
  sh('N1', 'c30', 32, [-.760, .240, 1.360], [-.845, .075, A[2]], [0, 0, .140]),
  // chai A đã nhăn đứng cạnh chai B còn thẳng
  sh('N1', 'c31', 32, [-.780, .200, 1.180], [-.780, .080, .860]),

  // ── N2 · hai hướng co lệch nhau, rồi cái nếp ──
  sh('N2', 'c32', 32, [.070, .030, .360], [.000, .000, .240]),
  sh('N2', 'c33', 28, [-.090, .030, .330], [-.015, .000, .240]),
  sh('N1', 'c34', 26, [-.870, .140, 1.020], [-.920, .090, A[2]], [0, .050, 0]),

  // ── lực ngược lại: khí bị giam trong chai ──
  // c35: chai B là lần đầu người xem thấy nó — nó phải nổi bật.
  // c35: chai B phải chiếm khoảng 1/3 khung, ở giữa, cùng cột hơi nước.
  // c35: chai B + cột hơi nước của nó ở giữa khung; chai A chỉ ló một mép bên
  // trái, không cắt cụt ngang nửa (đọc như lỗi cắt khung).
  // c35: máy **cao hơn miệng chai** để nhìn xuống thấy **lỗ miệng tối** và
  // ren trong — máy thấp hơn thì miệng chai đọc ra là một mặt tròn sáng, tức
  // là "đã có nắp" (ngược hẳn câu kể: chai B còn hở).
  sh('N1', 'c35', 30, [-.640, .330, 1.330], [-.650, .150, B[2]]),
  sh('N3', 'c36', 46, [.000, .100, .046], [.000, .030, -.004]),
  // tay vặn nắp: máy lùi ra, thấy trọn bàn tay trên nắp và cánh tay chạy ra
  // khung bên phải (bàn tay của rig dài, đứng sát ống kính sẽ thành một khối)
  // c37: lùi xa và sang phải để **cổ tay bàn tay còn trong khung** — bàn tay bị cắt
  // cụt ở mép phải thì nhìn như một khối lạ lùng bay vào khung.
  // c37: máy **thấp hơn** — từ trên cao xuống thì lòng bàn tay là thứ đầu
  // tiên máy thấy, và nó che mất cái nắp.
  sh('N1', 'c37', 30, [-.5600, .2150, 1.2400], [-.6000, .2150, B[2]]),
  sh('N3', 'c38', 46, [.000, .060, .042], [.000, .150, -.006]),
  // c39: máy vẫn ở trong bụng chai nên không lùi được; để mũi tên không méo ở
  // rìa khung thì **hạ tiêu cự** thay vì lùi máy ra ngoài chai.
  // c39: máy lùi ra (ngoài vỏ chai, vỏ là mặt trong nên nhìn xuyên qua được)
  // để mũi tên không méo ở rìa khung.
  sh('N3', 'c39', 40, [.000, .110, .120], [.000, .085, -.010]),
  // c40: cả cái chai B phồng lên phải trong khung (từ mặt bàn tới nắp),
  // không cắt cụt ngang vai chai.
  sh('N1', 'c40', 30, [-.640, .130, 1.330], [-.650, .100, B[2]]),

  // ── đồng hồ áp suất, rồi chai hở nắp ──
  // đồng hồ áp suất vặn trên nắp chai B
  // đồng hồ áp suất vặn trên nắp chai B: máy cận mặt đồng hồ
  sh('N1', 'c41', 30, [-.6350, .2500, 1.0100], [-.6500, .2410, .8930]),
  // siêu cận kim đồng hồ dâng lên
  // c42: siêu cận kim đồng hồ — tâm mặt đồng hồ phải ở **giữa khung**, không
  // rơi xuống dưới (thẻ chữ bị đẩy ra rìa khi neo nằm quá thấp).
  sh('N1', 'c42', 26, [-.6000, .2150, 1.0100], [-.6500, .2300, .8900]),
  // chai A hở nắp: khung rộng hơn c22, để thấy cả miệng chai lẫn thành đã nhăn
  // khung rộng hơn hẳn c22: miệng chai, cột hơi mỏng, và thành đã nhăn
  sh('N1', 'c43', 30, [-.8600, .2200, 1.1500], [-.9100, .1400, A[2]]),
  // c44: dịch máy sang phải và nới tiêu cự để **khác hẳn c28** (cùng vật, cùng
  // trạng thái, cách nhau 40 giây).
  sh('N1', 'c44', 30, [-.790, .155, 1.060], [-.920, .085, A[2]]),
  // hai chai cạnh nhau, đồng hồ áp suất ở giữa
  sh('N1', 'c45', 32, [-.780, .210, 1.220], [-.780, .080, .860]),
  // c46: chai B đang phồng — máy nghiêng theo thân chai, nhìn từ cao xuống
  // để thấy cả bụng phồng chứ không chỉ nhãn.
  sh('N1', 'c46', 32, [-.520, .230, 1.250], [-.650, .105, B[2]]),
  // c47: khung nhỏ hơn c34 để hai nhát cùng một vật không trùng nhau.
  sh('N1', 'c47', 32, [-.860, .140, 1.220], [-.920, .120, A[2]]),
  sh('N1', 'c48', 30, [-.570, .230, 1.180], [-.645, .110, B[2]]),

  // ── để nguội: khí co lại, thành bị hút vào ──
  // c49: đồng bộ với c39 — cùng tiêu cự, cùng một không gian đảo chiều.
  sh('N3', 'c49', 40, [.000, .110, .120], [.000, .085, -.010]),
  sh('N3', 'c50', 40, [.000, .105, .125], [.000, .090, -.012]),
  // c51: vật chính là **cái méo của chai B** — siết tiêu cự, đặt chai ở 1/3
  // trái, và đồng hồ áp suất nằm **trên khung** (nó ở trên miệng chai, cao
  // hơn khung) để nó không cạnh tranh sự chú ý với cái méo.
  // c51: soi thẳng eo chai B bị hút méo — càng gần, cái lõm càng đọc được.
  // c51: máy xiên sang phải ~20° để eo lõm đọc ra bằng **đường viền**, và
  // khung chỉ cần **từ đáy tới vai** — eo nằm ở 1/3 chiều cao thân chai.
  sh('N1', 'c51', 26, [-.4900, .1050, 1.0600], [-.6450, .0800, B[2]]),

  // ── chốt: hai chai, ba trạng thái, một cơ chế ──
  // c52: hai chai A (nhăn) và B (méo) cùng khung. Mẩu preform **không** kịp
  // vào khung này ( nó cách chai B nửa mét, đưa vào thì hai chai chỉ còn là hai
  // chấm nhỏ) — nên khung này chỉ có hai cái chai, đúng câu kể.
  sh('N1', 'c52', 34, [-.880, .250, 1.420], [-.830, .090, .880]),
  sh('N1', 'c53', 30, [-.920, .200, 1.140], [-.920, .095, A[2]], [0, 0, -.080]),

  // ── chốt lại cơ chế ──
  sh('N2', 'c54', 30, [.110, .030, .360], [.000, .000, .240]),
  // mặt đồng hồ: cột rơi ở trên xa vạch đỏ bảy mươi độ
  // lần này cận hơn và từ phía phải: vạch đỏ, cột rơi nằm trên vạch
  sh('N1', 'c55', 30, [-.2560, .2050, 1.1150], [-.2560, .1800, .9700]),
  sh('N2', 'c56', 30, [-.050, .030, .340], [.000, .000, .240]),
  sh('N1', 'c57', 28, [-.870, .170, 1.060], [-.920, .085, A[2]]),
  sh('N1', 'c58', 34, [-.810, .290, 1.180], [-.915, .140, A[2]], [0, -.020, 0]),
  // c59: siết khung để **cái nắp rời thấy được** (nó là vật câu này gọi tên),
  // đặt nắp ở 1/3 phải, hai chai ở 1/3 trái.
  // c59: nắp rời **và** chiếc đồng hồ áp suất trên nắp chai B phải cùng trong
  // khung — đồng hồ nằm ở y .25, nên điểm nhìn phải cao hơn và tiêu cự rộng hơn.
  sh('N1', 'c59', 24, [-.640, .230, 1.700], [-.620, .110, .880]),

  // ── lời khuyên ──
  // c60: đây là nhát **lời khuyên** — sự kiện duy nhất là dòng nước ngắn lại, nên
  // khung phải vừa đủ để dòng nước (6,5 mm) đọc được, không phải một cảnh rộng.
  // c60: lời khuyên — tia nước **ngắn lại, không chạm miệng chai**. Khung phải có
  // miệng chai, chỗ tia nước dừng, và bàn tay cầm ấm; không phải thân ấm chiếm
  // nửa khung.
  // c60: khung rộng vừa để có **cả bàn tay cầm ấm, cả tia nước ngắn lại, cả
  // miệng chai** — lời khuyên phải thấy được tay đang rót dở.
  // c60: máy **lùi sang phải** để thân ấm không chiếm nửa khung: thứ phải
  // thấy là **miệng chai** (dưới) và **tia nước ngắn lại** (trên), tay nắm
  // vòi nằm bên trái.
  sh('N1', 'c60', 26, [-.7700, .2450, 1.1500], [-.9050, .2050, A[2]]),
  sh('N1', 'c61', 24, [-.870, .110, 1.000], [-.920, .075, A[2]]),
  // cốc nước sôi trên bàn, nhiệt kế cắm trong cốc, cột rơi hạ dần
  // nhiệt kế đã đặt xuống bàn cạnh cốc, cột rơi hạ dần
  // c62: sự kiện của nhát là **cột rơi hạ dần**, nên mặt đồng hồ nhiệt kế cắm
  // trong cốc phải chiếm phần lớn khung.
  sh('N1', 'c62', 26, [-.1500, .1900, 1.1700], [-.2250, .1520, .9500]),
  // khung rộng của cả màn cuối: chai C, cốc nước đã nguội, nắp rời và tay
  // c63: máy **lùi sang bên phải và cao lên** — phải nhìn được **mặt nước
  // trong cốc** (cốc nghiêng về phía máy) và phải thấy cả dòng nước từ môi
  // cốc xuống miệng chai C, và sau đó là cả bàn tay vặn nắp.
  sh('N1', 'c63', 34, [-.0800, .4000, 1.2400], [-.4300, .2300, .8400]),
];

// mốc thời gian của từng nhát: nhát i bắt đầu khi câu đầu bắt đầu, kết thúc khi câu cuối kết thúc
const MARK = SHOTS.map(s => ({ t0: V.L[s.ids[0]].t0, t1: V.L[s.ids[s.ids.length - 1]].t1 }));

function shotAt(t) {
  for (let i = 0; i < SHOTS.length; i++) {
    if (t < MARK[i].t1 || i === SHOTS.length - 1) {
      const s = SHOTS[i];
      const u = clamp((t - MARK[i].t0) / Math.max(.001, MARK[i].t1 - MARK[i].t0));
      const pick = v => (typeof v === 'function' ? v(t, u) : v);
      return { sh: s, i, u, pos: pick(s.pos), look: pick(s.look), drift: pick(s.d) };
    }
  }
}

// ── thẻ thuật ngữ: mỗi thẻ bám vào vật nó gọi tên ──────────────────────────
// `lines` là câu trong voice/lines.json (máy kiểm tra nhãn dựa vào đó);
// `ids` là câu lấy thời gian để mở/đóng thẻ. Hai thứ phải là một.
// Thẻ nằm **ngay bên phải vật nó gọi tên**, mũi tên chỉ vào mép phải của vật:
// đó là cách rig vẽ thẻ (mũi tên luôn chỉ xuống-trái), và vùng bên phải vật
// phải trống. Vì vậy **mỗi neo đặt ở mép phải của vật** — đặt neo giữa vật thì
// thẻ nằm đè lên chính vật nó gọi tên.
const CARDS = [
  // mép phải của mảng thành nhựa: thẻ rơi xuống nền tối phía trên-phải
  { id: 'hai-huong', text: 'HAI HƯỚNG', at: () => [.090, .045, .254], lines: ['c10'], ids: ['c10'], size: 34 },
  // chỉ mở từ c14 — câu "Những móc xích dài..." mới gọi tên nó, và neo nằm
  // trên một móc xích thật sự có trong khung của nhát đó
  { id: 'moc-xich', text: 'MÓC XÍCH', at: () => [.020, .010, .250], lines: ['c14'], ids: ['c14'], size: 30 },
  // mép phải của con số "100" khắc trên mặt đồng hồ nhiệt kế
  { id: 'mot-tram-do', text: '100 °C', at: () => [-.2465, .1954, .9719], lines: ['c18'], ids: ['c18'], size: 30 },
  // số "70" đã khắc sẵn trên mặt đĩa, không cần thẻ chữ đè lên nó
  { id: 'nep', text: 'NẾP', at: () => [A[0], .100, A[2] + .032], lines: ['c34'], ids: ['c34'], size: 34 },
  // Thẻ nằm ở **câu gọi tên nó**: LOOK gán "NẮP KÍN" cho c38 (N3, miệng chai
  // bị nắp chặn lại), không phải c37 (bàn tay đang vặn nắp).
  // mép phải của cái nắp chặn miệng chai (nhìn lên từ trong bụng chai)
  { id: 'nap-kin', text: 'NẮP KÍN', at: () => [.017, .166, .000], lines: ['c38'], ids: ['c38'], size: 30 },
  // mép phải của thân chai B lúc nó phồng lên (chỉ mở từ c40 — câu gọi tên)
  {
    id: 'phong-len', text: 'PHỒNG LÊN',
    at: () => [B[0] + .033, .100, B[2] + .033],
    lines: ['c40'], ids: ['c40'], size: 30,
  },
  { id: 'ap-suat', text: 'ÁP SUẤT', at: () => [GG[0] + .021, GG[1] + .002, GG[2] + .010], lines: ['c41'], ids: ['c41'], size: 30 },
  // mép phải của miệng chai A: thẻ nằm trên nền tường bếp, không đè lên chai
  { id: 'chai-ho-nap', text: 'CHAI HỞ NẮP', at: () => [A[0] + .033, .196, A[2]], lines: ['c43', 'c44'], ids: ['c43', 'c44'], size: 28 },
  // mép phải của eo chai B lúc nó bị hút vào (chỉ mở từ c51 — câu gọi tên)
  {
    id: 'hut-vao', text: 'HÚT VÀO',
    at: () => [B[0] + .033, .095, B[2] + .030],
    lines: ['c51'], ids: ['c51'], size: 30,
  },
];
// Cửa sổ hiện của thẻ: dùng **chung công thức của rig** (`cardWindow`) để tập
// này và các tập khác không trôi lệch nhau sau này. Thẻ hiện từ lúc máy cắt sang
// nhát của câu (tức từ hết câu trước) đến hết câu của nó.
for (const C of CARDS) C.windows = [cardWindow(C, V)];

// ── thời gian ──────────────────────────────────────────────────────────────
const T = id => V.L[id].t0, E = id => V.L[id].t1;

// ── trạng thái vật theo thời gian ─────────────────────────────────────────
// Ấm: rót vào chai A (c1), rót lại (c17), dừng giữa chừng (c60).
//
// **Ấm phải đứng yên ở tư thế rót suốt lúc nước chảy.** Trước đây ấm trôi từ
// tư thế rót về chỗ cũ ngay trong lúc đang rót, nên đầu vòi rời khỏi chỗ
// dòng nước vẽ ra: người xem thấy một cột nước **đứng lơ lửng**, không
// mọc ra từ vòi. Mọi lần đổi Ấm giờ đều nằm trong một nhát mà máy không thấy
// ấm (cận miệng chai, hoặc nhát trong thành chai / trong bụng chai).
const kx = keys([
  [0, POUR_A[0]], [T('c2'), POUR_A[0]], [T('c2') + .35, HOME[0]],
  [T('c16'), HOME[0]], [T('c17'), POUR_A[0]], [T('c20'), POUR_A[0]], [E('c20'), HOME[0]],
  [T('c59'), HOME[0]], [T('c60'), POUR_A[0]], [T('c61'), POUR_A[0]], [E('c61'), HOME[0]],
  [1, HOME[0]],
]);
const ky = keys([
  [0, POUR_A[1]], [T('c2'), POUR_A[1]], [T('c2') + .35, HOME[1]],
  [T('c16'), HOME[1]], [T('c17'), POUR_A[1]], [T('c20'), POUR_A[1]], [E('c20'), HOME[1]],
  [T('c59'), HOME[1]], [T('c60'), POUR_A[1]], [T('c61'), POUR_A[1]], [E('c61'), HOME[1]],
  [1, HOME[1]],
]);
const kz = keys([
  [0, POUR_A[2]], [T('c2'), POUR_A[2]], [T('c2') + .35, HOME[2]],
  [T('c16'), HOME[2]], [T('c17'), POUR_A[2]], [T('c20'), POUR_A[2]], [E('c20'), HOME[2]],
  [T('c59'), HOME[2]], [T('c60'), POUR_A[2]], [T('c61'), POUR_A[2]], [E('c61'), HOME[2]],
  [1, HOME[2]],
]);
const kr = keys([
  [0, TILT], [T('c2'), TILT], [T('c2') + .35, 0],
  [T('c16'), 0], [T('c17'), TILT], [T('c20'), TILT], [E('c20'), 0],
  [T('c59'), 0], [T('c60'), TILT], [T('c61'), TILT], [E('c61'), 0],
  [1, 0],
]);
// dòng nước: chạy khi rót; ở c60 nó ngắn lại trước khi chạm miệng chai
const goA = keys([
  [0, 0], [T('c1'), 0], [T('c1') + .20, 1], [T('c2'), 1], [T('c2') + .18, 0],
  [T('c17'), 0], [T('c17') + .18, 1], [T('c20'), 1], [T('c20') + .12, 0],
  // Ở c59 ấm **đã về chỗ cũ** và dòng nước **đã cắt** — nhát đó nói về cái
  // nắp, không phải về việc rót. Rồi ở c60 ấm quay lại tư thế rót và tia
  // nước **ngắn lại** trước khi chạm miệng chai: đó mới là sự kiện của
  // nhát, và người xem phải thấy nó ngắn đi chứ không thấy một tia đứng yên.
  [T('c59'), 0], [T('c59') + .30, 0], [T('c60'), 1],
  [T('c60') + .90, .72], [E('c60'), .72], [T('c61'), 0], [1, 0],
]);
// ấm không rót vào cốc nữa: nước sôi trong cốc đã đứng đó từ đầu tập và đã nguội bớt
const goCup = keys([[0, 0], [1, 0]]);
// hơi nước ở miệng chai A: lúc rót là cột dày (c1, c17), rồi mỏng dần — ở c22 nó
// vẫn là **một cột mỏng** (đúng lời kể "hơi nước bốc lên thành cột"), và ở c43, khi
// chai hở nắp, nó chỉ còn là làn mỏng: dấu hiệu khí thoát ra được.
// Lúc đang rót, cột hơi nước phải **mỏng lại**: cột đặc nuốt mất tia nước,
// và người xem đọc "cột khói trắng cạnh ấm", không đọc được "đang rót nước sôi".
const steamPow = keys([
  [0, .55], [T('c1'), .55], [T('c3'), .35],
  // Ở c5 hai chai được giới thiệu là **giống hệt nhau** — nên cả hai miệng
  // phải sạch hơi nước, không phải một miệng có cột hơi và một miệng không.
  [T('c5'), 0],
  [T('c17'), .55], [T('c20'), .78],
  [T('c22'), .78], [T('c25'), .70], [T('c42'), .55], [T('c43'), .35], [T('c44'), .35],
  [T('c56'), .40], [T('c58'), .28], [1, .25],
]);
// độ rộng của cột hơi nước: lúc rót là cột dày (dòng ý 10), ở dòng ý 13 nó là
// **một cột mỏng**, và ở dòng ý 24 (chai hở nắp) chỉ còn là một làn mỏng —
// dấu hiệu khí thoát ra được.
const steamSpread = keys([
  [0, .55], [T('c3'), .40], [T('c17'), .55], [T('c19'), .80], [T('c22'), .42],
  [T('c25'), .40], [T('c42'), .30], [T('c43'), .20], [T('c44'), .20],
  [T('c56'), .24], [T('c58'), .16], [1, .14],
]);
// hơi nước ở miệng chai B: chai B cũng có nước sôi bên trong (hai chai giống hệt
// nhau). Người xem phải thấy nó **còn nóng** trước khi nắp vặn lên — không thì chai B
// sẽ phồng lên mà không ai biết vì sao. Nắp vặn xong thì hơi nước bị chặn lại.
// Hơi nước ở miệng chai B: chai B cũng có nước sôi bên trong (hai chai giống hệt
// nhau). Người xem phải thấy nó còn nóng trước khi nắp vặn lên. Nhưng cột hơi
// nước của B chỉ bật lên ở c35: lúc c5, khi hai chai được giới thiệu là
// giống hệt nhau, cả hai miệng phải sạch hơi nước.
const steamBPow = keys([
  [0, 0], [T('c35'), 0], [T('c35') + .30, .45], [T('c37'), .55], [T('c38'), 0], [1, 0],
]);
// nhiệt kế: cột rơi lên khi nước sôi vào, rồi hạ dần khi nước nguội trong cốc
// cột rơi của nhiệt kế: nước sôi trong cốc nguội dần theo thời gian; cuối tập
// nhiệt kế được nhổ ra khỏi cốc nên cột rơi tụt nhanh
const thLevel = keys([
  [0, .15], [E('c1'), .55], [E('c2'), 1], [T('c20'), .97], [T('c40'), .94],
  [T('c55'), .91], [T('c61'), .89], [E('c62'), .58], [1, .58],
]);
// vệt nhiệt trên vai chai A: nóng lên ngay khi rót, còn loang sau đó, và **tắt hẳn**
// khi chai đã nguội — ở cuối tập (c60–c61) chai đã nguội lâu rồi, không còn vệt nhiệt
const aHot = keys([
  [0, 0], [T('c1'), .55], [E('c2'), 1], [E('c4') + .25, 0],
  [T('c17') + .30, .25], [T('c19'), .85], [T('c24'), 1], [T('c28'), .70],
  [T('c44'), .40], [T('c48'), .16], [T('c52'), 0], [1, 0],
]);
// vệt nóng của chai B: nó vào muộn hơn (sau lần rót ở c17), rồi nguội đi
// **cùng nhịp** với chai A — hai chai phải trông giống nhau.
const bHot = keys([
  [0, 0], [T('c5'), 0], [T('c17'), 0], [T('c19'), .90], [T('c24'), 1],
  [T('c28'), .70], [T('c44'), .40], [T('c48'), .16], [T('c52'), 0], [1, 0],
]);
// chai A: nếp bắt đầu nhăn từ c2, co về hình cũ sau lần rót thứ hai
const aShrink = keys([
  [0, 0], [T('c19'), 0], [T('c22'), .18], [T('c25'), .42],
  [T('c28'), .80], [T('c31'), .88], [T('c43'), .90], [T('c44'), 1], [1, 1],
]);
const aWrinkle = keys([
  // c2 là phần **mở đầu** (nhìn về sau): chai A lúc đó đã co và nhăn. Khi tập
  // quay lại về lúc bắt đầu thí nghiệm (sau c4), A trở về nguyên trạng — hai
  // chai ở c5 phải **giống hệt nhau**, nếu không câu kể đó sai ngay trên hình.
  [0, 0], [T('c2'), .30], [E('c4') + .25, 0], [T('c19'), .10], [T('c24'), .48],
  [T('c28'), .78], [T('c31'), .92], [T('c43'), .94], [T('c44'), 1], [1, 1],
]);
// chai B: khí nóng đẩy ra (c39–c40), để nguội thì khí co lại và hút vào (c49–c51)
const bBulge = keys([
  [0, 0], [T('c38'), 0], [E('c40'), 1], [T('c48'), 1], [E('c50'), 0], [1, 0],
]);
const bSuck = keys([[0, 0], [T('c48'), 0], [E('c51'), 1], [1, 1]]);
// đồng hồ áp suất: kim chỉ lên khi còn nóng, rơi xuống dưới vạch khi nguội
// kim đồng hồ rơi xuống dưới vạch **trong lúc c52** (khung rộng, đồng hồ còn
// trong khung): rơi ở c50 thì không ai thấy, vì c50 nằm trong bụng chai.
// Kim đồng hồ **đang chỉ lên** ở c42 (lời kể: "Kim đang chỉ lên") — nên nó
// phải lên tới gần đỉnh thang trước khi câu đó bắt đầu, chứ không phải chỉ
// chệch sang bên. Rồi ở c52 (nước nguội) kim rơi xuống dưới vạch.
const gLevel = keys([
  // Ở c41 kim ở **vạch 0** (đánh dấu đỏ), rồi ở c42 nó **lên** gần đỉnh
  // thang: nhát c42 phải thấy kim đang chạy, không thấy kim đứng yên.
  [0, 0], [T('c41'), 0], [T('c42'), .18], [E('c42'), .55],
  [T('c48'), .55], [T('c51'), .55], [E('c51'), -.08], [1, -.08],
]);
// móc xích trong thành chai: bị kéo căng, rồi trượt về hình cũ (c25–c27),
// và trượt lại ở phần chốt cơ chế (c54–c56)
const relax = keys([
  [0, 0], [T('c24'), 0], [E('c27'), 1], [T('c53'), 1], [T('c54'), 0], [E('c56'), 1], [1, 1],
]);
// mẩu preform thí nghiệm nong thành chai ở c9, rồi bàn tay cầm đi
const preInflate = keys([[0, 0], [T('c9'), 0], [E('c9'), 1], [1, 1]]);
const pre2X = keys([[0, 0], [T('c9'), 0], [T('c9') + .45, 0], [E('c9'), -.34], [1, -.34]]);
const pre2Y = keys([[0, 0], [T('c9'), 0], [T('c9') + .45, 0], [E('c9'), .09], [1, .09]]);
const pre2Z = keys([[0, 0], [T('c9'), 0], [T('c9') + .45, 0], [E('c9'), .06], [1, .06]]);
// nắp rời: nằm trên bàn, tay cầm lên và vặn vào miệng chai C ở c63.
// C63 có hai nhịt: rót nước đã nguội sang chai C (trước), rồi vặn nắp (sau).
const T63 = T('c63');
// Lịch của nhát cuối (giây, tính từ đầu câu):
//   +0.20  cốc bắt đầu nghiêng trên miệng chai C
//   +0.42  dòng nước chảy          +0.88  dòng nước tắt
//   +1.15  cốc đã đứng thẳng lại    +1.62  cốc chạm bàn, tay rời quai cốc
//   +1.95  nắp bắt đầu nhấc lên    +2.15  tay đã cầm nắp, nắp tới cao miệng chai
//   +2.60  nắp tới trên miệng chai C, bắt đầu vặn
// Vặn kéo dài tới cuối phim (đuôi phim), không dừng khi câu đã hết — nếu dừng
// thì ba giây cuối hình đứng yên.
const tPourOn = T63 + .42, tPourOff = T63 + .88;
const tCapGo = T63 + 1.70, tCapLift = T63 + 1.95, tCapGrab = T63 + 2.15, tCapAt = T63 + 2.60;
// nắp rời nằm sấp trên bàn cạnh chai B (nó phải **thấy được** ở c59, câu gọi
// tên nó), rồi tay cầm lên và vặn vào miệng chai C ở c63.
// `capCarry` là **nguồn duy nhất** cho vị trí nắp: tay và nắp luôn khớp nhau —
// không có chuyện cái nắp tự bay vào miệng chai.
function capCarry(t) {
  const END = (typeof window !== 'undefined' && window.DUR) ? window.DUR : E('c63') + 3.0;
  const kLift = ss(clamp((t - tCapLift) / .20));    // nhấc nắp khỏi bàn
  const kMove = ss(clamp((t - tCapGrab) / .50));    // mang nắp tới miệng chai
  const kDown = ss(clamp((t - tCapAt) / .20));      // hạ nắp xuống miệng chai
  const kScrew = ss(clamp((t - tCapAt) / Math.max(.5, END - .30 - tCapAt)));
  const th = Math.PI + 1.6 * kScrew;               // tay quanh trục miệng chai
  const nx = NECK_C[0] - .100 * Math.cos(th), nz = NECK_C[2] + .100 * Math.sin(th);
  return {
    th, nx, nz, kLift, kMove, kDown, kScrew,
    x: lerp(CAP[0], NECK_C[0], kMove),
    y: lerp(lerp(CAP[1], NECK_C[1] + .014, kLift), NECK_C[1] + .004, kDown),
    z: lerp(CAP[2], NECK_C[2], kMove),
    rx: 0,                                       // nắp nằm sấp trên bàn (đọc là nắp, không phải một ống)
    ry: lerp(0, th, kScrew),
  };
}
// cốc: cầm lên, nghiêng rót nước đã nguội sang chai C, rồi đặt xuống bàn
// rót vào chai C: **môi cốc** (điểm thấp nhất của vành cốc khi nghiêng) phải
// nằm ngay trên miệng chai C. Cốc nghiêng 1,05 rad thì môi cốc lệch .1331
// sang **phải** và lên .0141 so với đáy cốc — nên đáy cốc đứng ở
// C[0] − .1331, môi cốc rơi đúng vào miệng chai C, cao hơn nó bốn phân để có
// dòng nước. Cốc nghiêng sang **phải** là cố ý: miệng cốc hướng về phía máy
// thì máy mới nhìn thấy **mặt nước trong cốc** (nghiêng ngược lại thì cốc là
// một khối rỗng, người xem không thấy nước đâu).
// Đường đi của cốc: cầm lên → nghiêng rót vào miệng chai C → đặt xuống
// **chỗ khác**, ở **phía sau bên trái** chai C. Nếu cốc quay về chỗ cũ thì nó
// đi ngang **trước ống kính** và che mất chai C đúng lúc tay vặn nắp.
// (Thấy ở bản dựng đầu: lúc cốc quay về, cốc chiếm gần hết khung.)
const CUP_REST_X = CUP[0] - .30, CUP_REST_Z = CUP[2] - .16;
const cupX = keys([
  [0, CUP[0]], [T63, CUP[0]], [T63 + .35, C[0] - .1331],
  [T63 + .95, C[0] - .1331], [T63 + 1.45, CUP_REST_X], [1, CUP_REST_X],
]);
const cupY = keys([
  // Cốc được nâng cao: môi cốc phải **cao hơn miệng chai ~7 cm**, thì dòng
  // nước mới thấy rõ là nước chảy từ cốc xuống chai (cũng dễ thấy mặt nước
  // trong cốc khi máy nhìn từ trên xuống).
  [0, 0], [T63, 0], [T63 + .20, .270], [T63 + 1.30, .270],
  [T63 + 1.62, 0], [1, 0],
]);
const cupZ = keys([
  [0, CUP[2]], [T63, CUP[2]], [T63 + .35, C[2]],
  [T63 + .95, C[2]], [T63 + 1.45, CUP_REST_Z], [1, CUP_REST_Z],
]);
const cupTilt = keys([
  [0, 0], [T63, 0], [T63 + .30, -1.05], [T63 + .90, -1.05],
  [T63 + 1.15, 0], [1, 0],
]);
// mực nước trong cốc: đầy cho tới lúc rót (c63), rồi còn khoảng 30 %
const cupFill = keys([
  [0, 1], [tPourOn, 1], [tPourOff, .30], [1, .30],
]);
// dòng nước đã nguội chạy đúng lúc cốc nghiêng
const goC = keys([
  [0, 0], [tPourOn, 0], [tPourOn + .07, 1], [tPourOff, 1],
  [tPourOff + .07, 0], [1, 0],
]);
// chai A được tay cầm lên và xoay ở c58
const aLift = keys([[0, 0], [T('c58'), 0], [T('c58') + .35, .055], [E('c58'), 0], [1, 0]]);
const aSpin = keys([[0, 0], [T('c58'), 0], [T('c58') + .40, -.90], [1, -.90]]);
// vệt nhiệt ở N2: nó loang trong lớp móc xích
const heatScale = keys([
  [0, .01], [T('c20'), .01], [T('c21'), 1], [T('c24'), 1.25], [E('c27'), .6], [T('c34'), .6], [1, .6],
]);

// ── âm thanh: giọng kể, không khí, nhạc, foley ────────────────────────────
const EV = [...V.ev];
const ev = (type, t, extra = {}) => EV.push({ type, t: +t.toFixed(3), ...extra });

// không khí: bàn bếp thì có tiếng bếp; hai nơi bên trong thì trầm
{
  let i = 0;
  while (i < SHOTS.length) {
    const s = SHOTS[i].s;
    let j = i;
    while (j + 1 < SHOTS.length && SHOTS[j + 1].s === s) j++;
    ev('amb', MARK[i].t0, { kind: s === 'N1' ? 'kitchen' : 'low', t1: +MARK[j].t1.toFixed(3) });
    i = j + 1;
  }
}

// nhạc: mỗi chặng bắt đầu ở nhát của nó
for (const [id, cue] of [['c10', 'B'], ['c17', 'C'], ['c28', 'D'], ['c35', 'E'],
  ['c43', 'B'], ['c49', 'E'], ['c53', 'D'], ['c59', 'G']])
  ev('music', T(id), { cue });
ev('music', V.end - 3.0, { cue: 'end' });

// foley: chỉ khi vật thể thật sự kêu
const FOLEY = [
  ['c1', .10, 'pour', .55], ['c2', .30, 'whoosh_soft', .28],
  ['c9', .35, 'whoosh_soft', .34], ['c9', .70, 'bottle_set', .30],
  ['c13', .25, 'whoosh_soft', .22], ['c17', .10, 'pour', .55],
  ['c18', .15, 'blip_up', .24], ['c23', .20, 'blip_up', .22],
  ['c25', .30, 'whoosh_soft', .30], ['c27', .40, 'cloth_rustle', .24],
  ['c28', .20, 'whoosh_soft', .26], ['c31', .30, 'cloth_rustle', .20],
  ['c34', .15, 'cloth_rustle', .28], ['c37', .25, 'plastic_click', .40],
  ['c37', .60, 'plastic_click', .30], ['c39', .20, 'whoosh_hard', .34],
  ['c41', .20, 'blip_up', .26], ['c42', .35, 'blip_up', .20],
  ['c43', .25, 'whoosh_soft', .26], ['c49', .20, 'blip_down', .26],
  ['c50', .40, 'blip_down', .22], ['c51', .30, 'impact_soft', .30],
  ['c58', .15, 'hand_tap', .24], ['c60', .30, 'whoosh_soft', .26],
  ['c62', .10, 'pour', .50],
];
for (const [id, dt, kind, v] of FOLEY) ev(kind, T(id) + dt, { v });
// c63: rót nước đã nguội sang chai C, rồi vặn nắp — hai tiếng, đúng hai nhịt
ev('pour', tPourOn - .05, { v: .42 });
ev('plastic_click', tCapAt + .30, { v: .40 });
ev('plastic_click', tCapAt + 1.10, { v: .32 });

// ── mốc nhịp: mỗi câu một điểm trên khung ────────────────────────────────
F.markBeats(ev, V, (id, tm) => {
  const s = shotAt(tm);
  camera.fov = s.sh.fov;
  camera.position.set(s.pos[0], s.pos[1], s.pos[2]);
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();
  const C = CARDS.find(c => c.ids.includes(id));
  const at = C ? (typeof C.at === 'function' ? C.at(tm) : C.at) : s.look;
  const [x, y] = toScreen(new THREE.Vector3(at[0], at[1], at[2]), camera);
  return [x, y];
});

// ── trạng thái vật trong nhát ─────────────────────────────────────────────
function applyState(id, t) {
  // chai A: co và nhăn
  N1.A.setState({ shrink: aShrink(t), wrinkle: aWrinkle(t) });
  N1.A.setHot(aHot(t));
  // Chai B cũng vừa được rót nước sôi (ngoài khung) — nên ở c5, khi hai chai
  // được giới thiệu là "giống hệt nhau", cả hai phải mang cùng một vệt nóng.
  N1.B.setHot(bHot(t));
  // chai B: phồng rồi bị hút vào; nắp chỉ có từ lúc tay vặn (c37)
  N1.B.setState({ bulge: bBulge(t), suck: bSuck(t) });
  N1.B.setCap(t >= T('c37'));
  // chai C (chai mới cho lời khuyên) chỉ xuất hiện ở cuối tập
  N1.C.group.visible = t >= T('c59');
  // c58: tay cầm chai A lên và xoay
  N1.A.group.position.set(A[0], aLift(t), A[2]);
  N1.A.group.rotation.y = aSpin(t);
  // mẩu preform thí nghiệm nong thành chai rồi được bàn tay cầm đi
  N1.pre2.setInflate(preInflate(t));
  N1.pre2.group.position.set(PRE2[0] + pre2X(t), pre2Y(t), PRE2[2] + pre2Z(t));
  // ấm: rót nước
  N1.pot.position.set(kx(t), ky(t), kz(t));
  N1.pot.rotation.z = kr(t);
  // nắp rời: nằm trên bàn, rồi được cầm lên vặn vào chai C
  // nắp rời chỉ xuất hiện từ c59 — câu gọi tên nó ("còn cái nắp thì quyết định
  // cái nào thắng"); trước đó không có nắp rời trên bàn.
  N1.cap.group.visible = t >= T('c59');
  const cc = capCarry(t);
  N1.cap.group.position.set(cc.x, cc.y, cc.z);
  N1.cap.group.rotation.set(cc.rx, cc.ry, 0);
  // cốc: ở c63 tay cầm nó lên nghiêng, rót nước đã nguội sang chai C rồi đặt xuống
  N1.cup.position.set(cupX(t), cupY(t), cupZ(t));
  N1.cup.rotation.z = cupTilt(t);
  // Mặt nước trong cốc: **xanh nhạt bán trong suốt, có vân gợn sóng và bọt
  // sôi**, không phải một đĩa trắng đục như sữa. Sau khi rót (c63) cốc còn
  // khoảng 30 % nước: cốc không được trống.
  const wd = N1.cup.getObjectByName('water');
  if (wd) {
    const f = cupFill(t);
    // Mặt nước phải **thấy được suốt lúc rót**. Khi cốc nghiêng 1,05 rad mà
    // máy nhìn ở góc khoảng 57°, thì chỉ phần nước **sát miệng cốc** mới lọt
    // vào khung nhìn: mặt nước lùi sâu hơn ~3,5 cm là **biến mất** khỏi khung,
    // người xem tưởng cốc rỗng. Nên:
    //   · cốc nghiêng → mặt nước **bám sát miệng cốc**, chỉ nhỏ lại
    //     (đó là dấu hiệu nước đang rót đi);
    //   · cốc đứng → mực nước **hạ xuống trong cốc**, mặt nước phẳng kín
    //     miệng (đáy cốc thấp, cốc không bao giờ trống).
    const up = clamp(Math.abs(cupTilt(t)) / .30);
    const level = lerp(.010 + .140 * f, .150 - .012 * (1 - f), up);
    const rad = lerp(1, Math.sqrt(f), up);
    wd.position.y = level - .150;        // trong nhóm, mặt nước nằm ở y = .15
    wd.scale.set(rad, 1, rad);
    const m = wd.getObjectByName('mat-nuoc');
    if (m) {
      m.material.opacity = .72;
      m.material.color.set('#e6f7ff');
      if (m.material.emissive) m.material.emissive.set('#2d5f80');
    }
  }
  // nhiệt kế: nó đứng trong cốc nước sôi suốt tập (đầu dò nhúng trong nước,
  // mặt đồng hồ ở trên vành cốc); cuối tập nó được đặt xuống bàn cạnh cốc,
  // trước khi người ta rót nước đã nguội sang chai C.
  N1.th.setLevel(thLevel(t));
  // Số "70" và vạch đỏ 70 **chỉ hiện từ c23** — lúc đó lời kể mới gọi tên
  // mốc bảy mươi độ. Trước đó trên mặt đồng hồ chỉ có "100".
  N1.th.setSeventy(t >= T('c23'));
  const thIn = [cupX(t) - .014, .012 + cupY(t), cupZ(t) + .006];
  const thOut = [-.320, .005, 1.010];                // nằm ngang trên bàn, trước cốc
  // Nhiệt kế **ở lại trong cốc** tới c63: c62 là cận mặt đồng hồ khi cột rơi hạ,
  // nếu rút nhiệt kế ra sớm thì khung c62 không còn mặt đồng hồ nào. Nó trượt ra
  // khỏi cốc **trước lúc rót** (nó phải nằm ngang trên bàn, không đứng giữa
  // khung như biển báo có chân, và không phải là que cắm lơ lửng trong dòng
  // nước đang chảy).
  const thU = ss(clamp((t - (T63 - .30)) / .35));
  N1.th.group.position.set(
    lerp(thIn[0], thOut[0], thU),
    lerp(thIn[1], thOut[1], thU),
    lerp(thIn[2], thOut[2], thU));
  // Nhiệt kế cuối tập **nằm ngang** trên bàn: nó vừa được nhổ ra khỏi cốc thì
  // phải nằm đó (que chĩa sang +x).
  N1.th.group.rotation.set(lerp(.10, 0, thU), 0, lerp(.05, -Math.PI / 2, thU));
  // đồng hồ áp suất
  N1.gg.setLevel(gLevel(t));
  // đồng hồ áp suất **chỉ hiện từ c39** (lúc nắp đã vặn kín): ở c37 bàn tay
  // đang vặn nắp, mà một cái đồng hồ đã treo sẵn trên nắp thì đọc ra là
  // "tay cầm đồng hồ" chứ không phải "tay vặn nắp".
  N1.gg.group.visible = t >= T('c39');
  // Và mặt đồng hồ phải **thẳng đứng**: nắp thì xoay khi vặn, đồng hồ thì đứng.
  N1.gg.group.rotation.set(-.12, -cc.ry, 0);
  // hơi nước ở miệng chai A
  N1.steam.group.visible = steamPow(t) > .05;
  // Cột hơi nước đứng đúng trên trục miệng chai — tức đúng chỗ tia nước rơi
  // vào. Lúc rót nó phải **nhích sang bên và nhỏ lại**, nếu không người xem chỉ
  // thấy một cột trắng đứng giữa miệng chai mà không thấy nước.
  const sg = clamp(1 - goA(t) * .55);
  N1.steam.group.scale.set(sg, lerp(1, .72, 1 - sg), sg);
  N1.steam.group.position.x = A[0] + (1 - sg) * .030;
  N1.steam.setSpread(steamSpread(t));
  // hơi nước ở miệng chai B: chỉ lúc miệng chai còn hở (trước khi nắp vặn lên)
  N1.steamB.group.visible = steamBPow(t) > .05;
  // vệt nhiệt trong thành chai (N2)
  N2.heat.visible = t > T('c20');
  const hs = heatScale(t);
  N2.heat.scale.set(1.4 * hs, .55 * hs, .35 * hs);
  N2.heat.position.set(0, -.015, .235);
  // móc xích và lớp nhựa ở N2
  N2.chains.setRelax(relax(t));
  // Móc xích là **vật liệu bị kéo căng** — nó hiện ngay từ lượt N2 đầu (c10),
  // và câu c13 đẩy máy vào sâu để người xem **nhìn thấy** nó; câu c14 mới gọi
  // tên nó, và thẻ `MÓC XÍCH` cũng mở đúng ở c14.
  // Móc xích là **vật liệu bị kéo căng** — nó hiện từ lượt N2 đầu (c10) vì hai
  // hướng kéo giãng chính là hai hướng của nó. Nhưng ở c13 câu kể nói "có một
  // thứ mà mắt thường không thấy": nếu móc xích lộ trọn vẹn ngay ở c13 thì
  // nhịp lộ diễn mất, và nhát c14 không còn gì để lộ. Ở c13 **ẩn** móc xích
  // đi (chỉ còn lớp nhựa cong), rồi c14 nó mới hiện — đúng lúc được gọi tên.
  N2.chains.setShow(t >= T('c10') ? 1 : 0);
  // Ở c13 móc xích **chưa được gọi tên**, nhưng câu kể nói "có một thứ mà
  // mắt thường không thấy" — nên ở c13 chỉ lộ **hai móc đầu ở rìa khung**
  // (có hình trước khi có tên), còn vòng quanh thân vẫn ẩn tới c14.
  const hintHooks = t >= T('c13') && t < T('c14');
  N2.chains.group.children.forEach(c => {
    c.children.forEach((e, i, arr) => {
      e.visible = hintHooks ? (e.userData.dir === 'axial' && i >= arr.length - 2) : true;
    });
  });
  N2.wall.setStretch(.9 * (1 - relax(t)), .35 * (1 - relax(t)));
  // ở N3: vệt nhiệt ở mặt nước, và nắp chặn miệng chai từ c38
  N3.heat.visible = t >= T('c19') && t < T('c21');
  const nh = clamp((t - T('c19')) / (T('c21') - T('c19')));
  // Vệt nhiệt **phải nằm trong bụng chai** (thành trong đường kính 6,2 cm):
  // to hơn thì nó tràn ra ngoài thành, khung chỉ còn một quả cầu cam chứ
  // không còn mặt nước, không còn thành chai, không còn mũi tên nhiệt.
  N3.heat.scale.set(.30 + .30 * nh, .16 + .12 * nh, .30 + .30 * nh);
  N3.lid.visible = t >= T('c38');
}

// ── bàn tay: chỉ xuất hiện khi nó đang làm việc ──────────────────────────
const HAND_AT = {
  c1: 'kettle', c2: 'kettle',
  c8: 'pre2', c9: 'pre2',
  c17: 'kettle', c18: 'kettle', c19: 'kettle',
  c37: 'bcap',
  c58: 'bottleA',
  c60: 'kettle',
  c63: 'ccap',
};
// ── bàn tay: đặt bằng toán học, không đoán ────────────────────────────────
// Bàn tay của rig (cỡ .45) dài 25 cm. Vị trí **đầu ngón giữa** tính ra từ
// chính hình học của rig (rig/fx.js, buildHand): gốc ngón [0.2014, 0.004,
// −0.025], ba đốt dài [0.062, 0.040, 0.030]; mỗi khớp gập thêm 1.0 / 1.3 /
// 0.9 lần `curl` rad. Nhờ vậy tay được **đặt vào đúng vật nó nắm** — trước đây
// ngón tay chỉ chạm mép vật, hoặc lơ lửng trong không trung.
const HAND_S = .45;
const FROOT = [.2014, .004, -.025], FL = [.062, .04, .03];
function fingerTip(curl) {
  const a = [-curl, -curl * 2.3, -curl * 3.2];
  let x = FROOT[0], y = FROOT[1];
  FL.forEach((L, i) => { x += L * Math.cos(a[i]); y += L * Math.sin(a[i]); });
  return [x, y, FROOT[2]];
}
// đặt tay sao cho **đầu ngón giữa** nằm ở `tip`, ngón chỉ theo hướng `d`
function placeHand(o, tip, d, curl, s = HAND_S) {
  const lt = fingerTip(curl);
  const hz = Math.hypot(d[0], d[2]);
  const beta = Math.atan2(d[1], hz), psi = Math.atan2(-d[2], d[0]);
  const cb = Math.cos(beta), sb = Math.sin(beta);
  const A = lt[0] * cb - lt[1] * sb, B = lt[0] * sb + lt[1] * cb;
  o.x = tip[0] - s * (A * Math.cos(psi));
  o.y = tip[1] - s * B;
  o.z = tip[2] - s * (-A * Math.sin(psi) + lt[2]);
  o.rotY = psi; o.rotZ = beta;
}
const HG = {};
function applyHand(id, t) {
  const g = N1.hand.group;
  const kind = HAND_AT[id];
  g.visible = !!kind;
  if (!kind) return;
  let x = 0, y = 0, z = 0, rotY = 0, rotZ = 0, curl = .45, spread = .32;
  let hs = 1;                       // cỡ bàn tay (1 = bàn tay bình thường của rig)
  if (kind === 'kettle') {
    // Tay nắm **vòi ấm**: đầu ngón ở chỗ nắm, ngón chỉ xuống, cổ tay ở
    // trên — khoảng trống giữa vòi và miệng chai. Ngón nằm dọc theo vòi thì
    // người xem chỉ thấy móng tay, không thấy bàn tay.
    const gp = [kx(t) + GRIP_DIR[0], ky(t) + GRIP_DIR[1], kz(t)];
    placeHand(HG, [gp[0] + .006, gp[1] - .012, gp[2] + .026], [.28, -.96, 0], .40);
    x = HG.x; y = HG.y; z = HG.z; rotY = HG.rotY; rotZ = HG.rotZ;
    curl = .40; spread = .22;
  } else if (kind === 'pre2') {
    // Cầm mẩu preform: đầu ngón chạm thân mẩu, ngón chỉ sang phải, rồi cầm
    // cái chai đã nong đi.
    const u = clamp((t - T('c9')) / Math.max(.001, E('c9') - T('c9')));
    const k = ss(clamp((u - .40) / .60));
    const px = PRE2[0] + pre2X(t), py = pre2Y(t), pz = PRE2[2] + pre2Z(t);
    placeHand(HG, [px - .018, py + .030, pz + .010], [1, 0, 0], lerp(.22, .48, k));
    x = HG.x; y = HG.y; z = HG.z; rotY = HG.rotY; rotZ = HG.rotZ;
    curl = lerp(.22, .48, k); spread = lerp(.38, .24, k);
  } else if (kind === 'bcap') {
    // Vặn nắp lên miệng chai B: **đầu ngón vòm qua mặt xa của nắp** (đầu
    // ngón và móng nhìn thấy ở phía xa nắp), cổ tay lùi về phía khuỷu.
    // Tay đến từ bên phải, ngón chạm nắp, cánh tay xoay theo vòng nắp.
    const u = clamp((t - T('c37')) / Math.max(.001, E('c37') - T('c37')));
    const a = lerp(0, .35, ss(u));
    placeHand(HG, [NECK_B[0] - .016, NECK_B[1] + .020, NECK_B[2]],
      [-Math.cos(a), 0, -Math.sin(a)], .38, HAND_S * .76);
    x = HG.x; y = HG.y; z = HG.z; rotY = HG.rotY; rotZ = HG.rotZ;
    curl = .38; spread = .24;
    hs = .76;                       // bàn tay nhỏ lại: nắp phải đọc ra là nắp,
                                    // chứ không phải một khối tay đè lên nó
  } else if (kind === 'ccap') {
    // c63 có ba nhịt: nắm quai cốc rót nước đã nguội sang chai C, rồi thả cốc
    // và cầm nắp rời, rồi vặn nắp lên miệng chai C (tay quay quanh trục miệng
    // chai). Tay đi **qua chỗ nắp nằm** rồi mới vặn — nắp không tự bay.
    const cc = capCarry(t);
    const hp = handleAt(cupX(t), cupY(t), cupZ(t), cupTilt(t));
    // tay ở quai cốc khi rót, rồi đi tới chỗ nắp, cầm nắp lên và đưa tới miệng chai
    const kGo = ss(clamp((t - tCapGo) / .50));       // rời quai cốc → chỗ nắp
    const kGrab = ss(clamp((t - tCapGrab) / .50));   // cầm nắp → đưa tới miệng chai
    // Cổ tay lùi lại 14 cm về phía khuỷu: đầu ngón tay của bàn tay rig nằm
    // ở +15,5 cm dọc trục cổ tay, nên muốn ngón vòm quanh nắp thì cổ tay phải
    // đứng cách nắp 15 cm. Tay đặt cao hơn nắp 1,4 cm và ngón gập xuống.
    // Cổ tay lùi 15 cm về phía khuỷu: đầu ngón của bàn tay rig nằm ở 15 cm
    // dọc trục cổ tay, nên muốn ngón chạm nắp thì cổ tay phải đứng cách nắp
    // 15 cm. Khi cầm nắp rời trên bàn, ngón hướng +x (tay ở bên trái nắp); khi
    // đưa nắp lên miệng chai, tay xoay nửa vòng để ngón hướng -x.
    const hx = lerp(hp[0] + .145, CAP[0] - .150, kGo);
    const hy = lerp(hp[1], CAP[1] + .045, kGo);
    const hz = lerp(hp[2], CAP[2] + .010, kGo);
    const gx = lerp(hx, cc.x + .150, kGrab);
    const gy = lerp(hy, cc.y + .006, kGrab);
    const gz = lerp(hz, cc.z + .010, kGrab);
    if (cc.kScrew > .02) {
      // Lúc vặn, tay đứng **bên trái nắp**, ngón chỉ sang phải, và quay theo
      // vòng nắp quanh trục miệng chai: đầu ngón vòm qua mặt xa nắp.
      const a = cc.kScrew * 1.6;
      placeHand(HG, [cc.x - .016, cc.y + .012, cc.z], [Math.cos(a), 0, Math.sin(a)], .38);
      x = HG.x; y = HG.y; z = HG.z; rotY = HG.rotY; rotZ = HG.rotZ;
    } else {
      x = gx; y = gy; z = gz;
      rotY = lerp(lerp(lerp(Math.PI, 0, kGo), Math.PI, kGrab), cc.th, cc.kScrew);
    }
    // Khi rót, tay đứng **bên phải quai cốc** và ngón hướng -x (rotY = π) thì
    // đầu ngón mới chạm đúng quai: quai ở hp, đầu ngón ở cổ tay + 14,5 cm.
    // Trước đây tay đứng ở hp + .117 với ngón hướng +x, nên đầu ngón lọt ra
    // 26 cm quá quai — tay nằm ngoài khung và cốc như tự nghiêng, không ai rót.
    // Khi đi sang cái nắp, ngón xoay về +x (nắp nằm sấp, tay cầm từ bên trái),
    // rồi khi vặn thì ngón lại quay về -x quanh trục miệng chai.
    // (rotY của cả hai nhánh đã tính ở trên)
    curl = lerp(.35, .30, cc.kScrew); spread = .20;
  } else if (kind === 'bottleA') {
    // cầm chai A lên, xoay dưới ánh sáng cửa sổ
    const u = clamp((t - T('c58')) / Math.max(.001, E('c58') - T('c58')));
    const k = ss(clamp(u / .35));
    // Đầu ngón chạm thân chai, tay đứng bên trái chai.
    placeHand(HG, [A[0] - .032, .085 + aLift(t) + .010, A[2] + .026], [1, 0, 0],
      lerp(.30, .52, k));
    x = HG.x; y = HG.y; z = HG.z; rotY = HG.rotY; rotZ = HG.rotZ;
    curl = lerp(.30, .52, k); spread = lerp(.30, .20, k);
  }
  g.position.set(x, y, z);
  g.rotation.set(0, rotY, rotZ);
  g.scale.setScalar(hs);
  N1.hand.pose(curl, spread);
}

// ── cập nhật vật: mỗi vật một lần mỗi khung hình ─────────────────────────
function updateProps(t, id) {
  N1.A.update(t);
  N1.B.update(t);
  N1.C.update(t);
  N1.pre.update(t);
  N1.pre2.update(t);
  N1.steam.update(t, steamPow(t));
  N1.steamB.update(t, steamBPow(t));
  N2.chains.update(t);
  N3.water.update(t);
  N3.steam.update(t, (id === 'c36' || id === 'c49') ? .9 : .25);
  N3.arrows.update(t);
  POUR_A_FLOW.update(t, goA(t));
  POUR_CUP_FLOW.update(t, goCup(t));
  POUR_C_TO_C.update(t, goC(t));
  // mũi tên trong bụng chai: ra ngoài khi khí còn nóng, vào trong khi nguội
  if (id === 'c39') N3.arrows.setPower(.95, 1);
  else if (id === 'c49' || id === 'c50') N3.arrows.setPower(.95, -1);
  else N3.arrows.setPower(0, 1);
}

// ── dựng khung ────────────────────────────────────────────────────────────
window.DUR = V.end;
window.EV = EV;

window.render = t => {
  const s = shotAt(t);
  const sh = s.sh, u = s.u, id = sh.ids[0];
  camera.fov = sh.fov;
  camera.position.set(
    s.pos[0] + s.drift[0] * ss(u),
    s.pos[1] + s.drift[1] * ss(u),
    s.pos[2] + s.drift[2] * ss(u));
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();

  applyState(id, t);
  applyHand(id, t);
  updateProps(t, id);

  const set = setOf[sh.s];
  const dist = camera.position.distanceTo(new THREE.Vector3(s.look[0], s.look[1], s.look[2]));
  F.frame(sceneOf(set, sh.s), {
    t,
    thick: clamp(1.95 + dist * .7, 2.0, 3.8),
    ref: dist,
    key: set.key || null,
    fade: Math.min(1, t / .3 + .2, (window.DUR - t) / .4),
    // phụ đề khắc vào hình, và các thẻ thuật ngữ bám vào vật
    overlay: (g, tt) => {
      const out = [];
      const sub = V.sub(tt);
      if (sub) subtitle(g, sub);
      for (const C of CARDS) {
        const win = C.windows.find(w => tt >= w.t0 && tt <= w.t1);
        if (!win) continue;
        const size = C.size ?? 40;
        g.save(); g.font = `900 ${size}px "Be Vietnam Pro"`;
        const bw = g.measureText(C.text).width + size, bh = size * 1.55;
        g.restore();
        const a = typeof C.at === 'function' ? C.at(tt) : C.at;
        const [ax, ay] = toScreen(new THREE.Vector3(a[0], a[1], a[2]), camera);
        // Thẻ nằm ngay bên phải vật: mũi tên của rig luôn chỉ xuống-trái, nên
        // tâm thẻ là (neo + nửa bề ngang + 26) và đuôi thẻ chạm đúng neo.
        const x = ax + bw / 2 + 26;
        const y = ay - bh / 2 - 44;
        // Neo ngoài khung, hoặc thẻ tràn khung, thì **không hiện thẻ**: thẻ bị
        // kẹp vào góc màn hình là thẻ không bám vào vật nó gọi tên.
        // Thẻ phải nằm trọn trong khung — kể cả **mũi tên** vương ra (26 px sang
        // trái, 44 px xuống dưới) và cả lúc thẻ bật ra quá chuẩn (~16%).
        if (ax < 8 || ax > 1912 || ay < 8 || ay > 1072) continue;
        if (x + bw / 2 * 1.16 > 1916 || x - bw / 2 * 1.16 - 30 < 4) continue;
        if (y - bh / 2 * 1.16 - 4 < 4 || y + bh / 2 * 1.16 + 46 > 1076) continue;
        if (y - bh / 2 < 4 || y + bh / 2 > 1076) continue;
        const b = label(g, C.text, x, y, tt, win.t0, win.t1, { id: C.id, size });
        if (b) out.push(b);
      }
      return out;
    },
  });
};

// chẩn đoán: nhát đang quay, vị trí máy, và mốc thời gian thật của các câu
window.DIAG = t => {
  const s = shotAt(t);
  return {
    shot: s.i + 1, ids: s.sh.ids, u: +s.u.toFixed(3),
    pos: s.pos.map(v => +v.toFixed(3)), look: s.look.map(v => +v.toFixed(3)),
    mark: MARK.map(m => [+m.t0.toFixed(2), +m.t1.toFixed(2)]),
    cards: CARDS.map(c => [c.id, c.ids.join(','), c.lines.join(','), c.windows.map(w => [+w[0].toFixed(2), +w[1].toFixed(2)])]),
  };
};

window.TEXTS = t => { window.render(t); return F.texts(); };
await document.fonts.load('900 54px "Be Vietnam Pro"');
window.render(0);
window.READY = true;
