// film.js — trang phim của tập 05: 25 nhát, một câu lời kể một nhát hình.
//
// Năm nơi: K bếp buổi sáng · L bàn thí nghiệm · P trong vũng nước quanh viên
// đá · N mặt đá ở cấp nano · K2 bếp buổi chiều.
// Lời kể đi một chiều: hiện tượng ở bếp (1–7) → đo ở bàn thí nghiệm (8–9) →
// cơ chế quanh viên đá (10–18) → tổng hợp và cái giới hạn (19–22) →
// quay lại bếp lúc chiều (23–25).
//
// Quy tắc số: chỉ hai con số được lên hình — 10 % (c9) và -21 °C (c21).
// Mỗi con số đều có câu lời đọc nó, và mỗi con số là một vật trong khung.
import * as THREE from 'three';
import { film, label, subtitle, toScreen, cardWindow } from '../../../../rig/render.js';
import { keys, ss, clamp, lerp } from '../../../../rig/kit.js';
import { build } from './timeline.js';
import { loadVoice } from '../../../../rig/voice.js';
import { buildKitchen, buildLab, buildPuddle, buildNano, KL } from './set.js';

const V = await loadVoice(build);
const F = film({ fov: 36 }), camera = F.camera;

// ── năm nơi chốn ────────────────────────────────────────────────────────
const SC = { K: new THREE.Scene(), L: new THREE.Scene(), P: new THREE.Scene(), N: new THREE.Scene(), K2: new THREE.Scene() };
const K = buildKitchen(SC.K, { time: 'morning', bagAt: 'back' });
const L = buildLab(SC.L);
const P = buildPuddle(SC.P);
const N = buildNano(SC.N);
const E = buildKitchen(SC.K2, { time: 'evening', bagAt: 'front' });
const setOf = { K, L, P, N, K2: E };

// bàn tay: bếp buổi sáng (rắc muối, rửa muối, cho muối vào ly), bàn thí nghiệm
// (khuấy, đặt bát muối), bếp buổi chiều (đặt túi muối xuống).
function gripSide(hand, x, y, z, curl = .85) {
  hand.position.set(x, y, z);
  hand.rotation.set(0, 0, 0);
  hand.pose(curl, .12);
  hand.visible = true;
}
function gripDown(hand, x, y, z, curl = .85) {
  hand.position.set(x, y, z);
  hand.rotation.set(0, 0, -Math.PI / 2);
  hand.pose(curl, .12);
  hand.visible = true;
}
// Tay **ngang**, ngón chỉ về phía -x: dùng khi tay phải bám một vật ở mép
// phải mà không được che miệng vật (que khuấy trong ly, mép tô muối).
function gripLeft(hand, x, y, z, curl = .85) {
  hand.position.set(x, y, z);
  hand.rotation.set(0, Math.PI, 0);
  hand.pose(curl, .12);
  hand.visible = true;
}

// ── bảng nhát: 25 nhát, đúng thứ tự câu lời kể ─────────────────────────
// pos/look: vị trí máy và điểm nhìn. d: máy trượt trong nhát (luôn có lý do ở cột Vì sao).
// dLook: điểm nhìn trượt theo, để máy nghiêng mà chủ thể vẫn nằm trong khung.
// fov2: tiêu cự cuối nhát — vài câu mở rộng rồi đi vào chứng cứ ngay trong nhát,
// thay vì cắt thành hai nhát (một câu lời kể, một nhát hình).
const SHOTS = [
  // ── K: bếp buổi sáng ──
  // Mở khung: thấp ngang mép khay, tay bóp muối rắc lên viên đá bên trái,
  // viên đá đối chứng nằm cạnh, chiếc búa nằm giữa khay.
  { ids: ['c1'], s: 'K', pos: [-.46, .40, 1.46], look: [-.82, .09, .76], fov: 34, d: [0, 0, 0] },
  { ids: ['c2'], s: 'K', pos: [-.18, .38, 1.30], look: [-.60, .09, .73], fov: 36, d: [.055, 0, -.028] },
  // Khung câu hỏi: máy lên cao và sang phải, tay ở **mép phải** khay, cả hai
  // viên đá cùng lọt khung (vòng chấm hình ảnh 2: tay đứng giữa che mất một
  // viên đá và cánh tay là một ống trụ xanh giữa khung).
  { ids: ['c3'], s: 'K', pos: [-.10, .72, 1.90], look: [-.80, .10, .78], fov: 40, d: [-.02, 0, .04] },
  { ids: ['c4'], s: 'K', pos: [-.20, .36, 1.24], look: [-.66, .09, .82], fov: 30, d: [.006, -.012, -.008] },
  // Cận mặt đá: máy lùi ra cho cả viên đá lọt khung, lấy cả mép dưới để
  // thấy dòng nước mủng chảy; que nhiệt kế đứng bên trái. Nhìn **thấp hơn**
  // (look ở y = 0,055) để viên đá dâng lên nửa trên khung, chừa dải phụ đề
  // dưới cho trống (vòng chấm hình ảnh 3 ở c5: dải phụ đề nằm ngay trên
  // mép dưới của viên đá).
  { ids: ['c5'], s: 'K', pos: [-.57, .33, .94], look: [-.88, .055, .74], fov: 30, d: [.008, -.010, -.014] },
  // Hai ly: máy ở gần, tiêu cự hẹp, lấy đúng hai ly và **hai cột đỏ**; ấm
  // nước nằm ngoài khung. Cảnh này sáng hơn (l: nâng key).
  { ids: ['c6'], s: 'K', pos: [-.10, .34, 1.34], look: [.23, .11, .78], fov: 25, d: [-.02, 0, -.03], l: 1.35 },
  // Mặt đá đối chứng với lớp băng mờ: máy **áp sát mặt trên** viên đá, để
  // lưới tinh thể chiếm gần hết khung — một khung rộng để lưới tinh thể
  // nhỏ trên mặt đá trắng thì đọc ra là mặt bàn trống (vòng chấm hình ảnh 3
  // ở c7: "khung gần như trống").
  { ids: ['c7'], s: 'K', pos: [-.40, .30, .87], look: [-.545, .160, .745], fov: 30, d: [.004, .022, -.010] },
  // ── L: bàn thí nghiệm ──
  // c8 mở toàn cảnh rồi đi vào bình nước sạch — bằng chứng phải đọc được
  // trong chính nhát này, không ở một nhát nữa không ai nhớ. Máy đi vào từ
  // **bên trái** hàng chéo, nên ba bình kia nằm sau bình nước sạch và
  // không chồng lên nó (vòng chấm hình ảnh 2: cảnh chui vào bình quá gần,
  // bình thành một mảng thuỷ tinh trừu tượng). Cuối nhát máy **hạ xuống
  // sát miệng bình và ngả nhìn xuống lớp băng**, để lớp băng chiếm phần
  // lớn khung thay vì một khối tròn nhạt ở đáy khung (vòng chấm hình ảnh 3
  // ở c8).
  { ids: ['c8'], s: 'L', pos: [.30, .50, 1.50], look: [-.30, .14, .78], fov: 34, fov2: 23, d: [-.93, -.12, -.65], dLook: [-.25, .028, -.12] },
  { ids: ['c9'], s: 'L', pos: [.25, .50, 1.45], look: [-.40, .25, .74], fov: 28, d: [.03, -.01, -.05], l: 1.2 },
  // ── K: quay lại vũng nước quanh viên đá ──
  { ids: ['c10'], s: 'K', pos: [-.40, .38, 1.34], look: [-.78, .11, .78], fov: 34, d: [.02, 0, .03] },
  // ── P: trong vũng nước ──
  { ids: ['c11'], s: 'P', pos: [.16, .085, .46], look: [0, .035, 0], fov: 32, d: [-.01, -.022, -.012] },
  // Máy ở sát mảnh đá đang rã: mảnh đá chiếm khoảng một phần ba bề ngang
  // khung, vệt nước đục quanh nó đọc ra là nước muối đã tan.
  { ids: ['c12'], s: 'P', pos: [.12, .060, .25], look: [.02, .028, .02], fov: 30, d: [-.02, -.005, .04] },
  // ── N: mặt đá ở cấp nano ──
  // Bậc cự ly: c13 (tiến sát) → c14 (cận cảnh, hẹp nhất) → c15 (lùi ra để thấy
  // lớp ion bên dưới) → c16 (nâng lên nhìn xuống lớp nước đang mỏng đi).
  { ids: ['c13'], s: 'N', pos: [-.02, .24, .32], look: [-.03, .02, -.02], fov: 36, d: [-.004, -.006, -.015] },
  { ids: ['c14'], s: 'N', pos: [-.04, .22, .24], look: [-.03, .03, -.03], fov: 40, d: [.004, 0, -.008] },
  { ids: ['c15'], s: 'N', pos: [.17, .20, .40], look: [.015, .02, 0], fov: 38, d: [-.02, -.006, .02] },
  { ids: ['c16'], s: 'N', pos: [.16, .15, .30], look: [.02, .012, 0], fov: 32, d: [.004, .016, -.01] },
  // ── P: hạt muối tan trong nước ──
  // Máy nằm **ngang** ở độ cao mặt nước: hạt muối ở dưới khung, trần nước
  // lấp loáng ở trên khung, và dải nhiệt chạy từ hạt lên trần nước — đúng
  // câu "nó lấy nhiệt từ chính lớp nước quanh đá" (vòng chấm hình ảnh 2 ở
  // c17: máy quá gần, quả cầu ion khổng lồ, không thấy mặt nước).
  { ids: ['c17'], s: 'P', pos: [.30, .055, .12], look: [.195, .058, -.08], fov: 34, d: [-.015, 0, .01] },
  // ── K: nhiệt kế trong vũng nước — cùng một trục nhìn với c10, chỉ khóa dài hơn,
  // để người xem so được hai mức cột đỏ của cùng một que.
  { ids: ['c18'], s: 'K', pos: [-.60, .30, 1.12], look: [-.90, .13, .80], fov: 24, d: [.004, -.005, -.008] },
  // ── L: tổng hợp và cái giới hạn ──
  // Tô muối ở góc trước-phải khung, dải nhiệt quay mặt về máy quay, tay
  // bám mép phải của tô (vòng chấm hình ảnh 2: tô đọc ra là hộp carton, dòng
  // nhiệt là một sợi thẳng màu cam, và tay trải ra che hết mặt tô).
  // Khung lùi ra và nghiêng trái để **bình nước muối mười phần trăm** ở
  // phía sau cùng khung: "hai cơ chế cộng lại" phải thấy được cả hai.
  { ids: ['c19'], s: 'L', pos: [.30, .40, .95], look: [-.20, .06, .50], fov: 34, d: [.012, -.006, .006] },
  { ids: ['c20'], s: 'L', pos: [-.05, .46, 1.60], look: [-.31, .24, .80], fov: 26, fov2: 24, d: [-.02, 0, -.06] },
  // Máy nhìn **qua miệng bình** từ trên xuống: bình đậm nằm trong bể đá,
  // nên phải cao hơn miệng bể thì mới không phải xuyên qua đá. Máy đứng
  // **trong** bể (trên đống đá) để vành bể không cắt ngang khung — đứng ngoài
  // bể thì vành thép luôn nằm giữa ống kính và bình (vòng chấm hình ảnh 2:
  // "vành bể cắt ngang khung"). Cột đỏ lệch sang trái một phần ba khung để
  // thẻ "-21 °C" không nằm lên đầu cột.
  { ids: ['c21'], s: 'L', pos: [-.06, .34, .80], look: [-.17, .235, .87], fov: 24, d: [-.003, .004, -.005] },
  { ids: ['c22'], s: 'L', pos: [-.02, .30, 1.06], look: [-.19, .17, .87], fov: 24, d: [.008, 0, -.008] },
  // ── K2: bếp buổi chiều ──
  { ids: ['c23'], s: 'K2', pos: [.48, .52, 2.05], look: [.00, .10, 1.05], fov: 30, d: [-.03, 0, .04] },
  { ids: ['c24'], s: 'K2', pos: [-1.30, .30, 1.36], look: [-1.45, .13, 1.07], fov: 30, d: [.01, -.008, -.02] },
  { ids: ['c25'], s: 'K2', pos: [-.62, .34, 1.28], look: [-.70, .10, .80], fov: 38, d: [-.02, 0, .04] },
];

// ── thời gian ───────────────────────────────────────────────────────────
const T = id => V.L[id].t0, E1 = id => V.L[id].t1;
const DUR = id => Math.max(.001, E1(id) - T(id));
const num = id => parseInt(id.slice(1), 10);

// ── trạng thái: những đại lượng đổi theo thời gian ───────────────────────
// Viên đá có muối nhỏ dần và vũng nước lan ra suốt phim.
// Mọi bảng khoá **tăng dần theo thời gian** và kết thúc ở [V.end, giá trị]:
// một cặp [1, giá trị] ở cuối bảng làm mảng mất thứ tự, và bất kỳ lần sắp
// xếp lại nào sau này cũng sẽ làm hỏng cả phim (vòng chấm 1 đã bắt lỗi này).
const meltK = keys([[0, 0], [T('c1'), 0], [E1('c1'), .04], [T('c3'), .07], [E1('c5'), .13], [T('c7'), .17], [T('c10'), .23], [E1('c12'), .29], [T('c17'), .37], [E1('c18'), .45], [V.end, .45]]);
const meltE = keys([[0, .45], [T('c23'), .52], [E1('c23'), .64], [T('c25'), .80], [V.end, .84]]);
const pudK = keys([[0, .18], [T('c1'), .18], [E1('c1'), .28], [T('c5'), .40], [T('c10'), .56], [E1('c12'), .63], [T('c17'), .75], [E1('c18'), .82], [V.end, .82]]);
const pudE = keys([[0, .82], [T('c23'), .9], [V.end, 1]]);
// vệt muối trên mặt đá tan dần (c1 → c10)
const patchK = keys([[0, 0], [T('c1'), 0], [E1('c1'), .14], [T('c5'), .5], [T('c10'), .96], [E1('c10'), 1], [V.end, 1]]);
// lớp băng mờ mọc trên mặt viên đá đối chứng (c7)
const frostK = keys([[0, 0], [T('c7'), 0], [E1('c7'), 1], [V.end, 1]]);
// dòng nước nhỏ chảy xuống mép viên đá (c5 rồi đều)
const flowK = keys([[0, 0], [T('c5'), 0], [E1('c5'), 1], [T('c10'), .6], [E1('c12'), .3], [T('c18'), .22], [V.end, .22]]);
// hộp muối cạn dần suốt phim
const tinK = keys([[0, 0], [T('c1'), 0], [E1('c1'), .12], [T('c10'), .38], [T('c18'), .58], [T('c23'), .97], [E1('c23'), 1], [V.end, 1]]);
// que nhiệt kế trong vũng nước: dưới không độ ngay từ c10, tụt thêm ở c18.
// Thang que: 5,5 mm mỗi độ, nên từ −1,0 độ xuống −4,0 độ là 1,65 cm cột đỏ
// — đọc được, chứ không phải 2 mm như lần trước.
const thK = keys([[0, -1.0], [T('c10'), -1.0], [E1('c10'), -1.6], [T('c17'), -2.6], [E1('c18'), -4.0], [V.end, -4.0]]);
// hai ly ở bếp: ly nước sạch đứng yên, ly nước muối tụt nhẹ khi muối tan
const glassK = keys([[0, 18], [T('c6'), 18], [E1('c6'), 16], [V.end, 16]]);
// vệt muối trong ly nước muối tan dần (c6)
const saltInBK = keys([[0, 0], [T('c6'), 0], [E1('c6'), 1], [V.end, 1]]);
// sữa trong túi zip đông dần trong bát đá muối (c24)
const zipK = keys([[0, 0], [T('c24'), 0], [E1('c24'), 1], [V.end, 1]]);
// bàn thí nghiệm: que nhiệt kế của ba bình.
// Cột của bình 10 % về tới −6,6 độ **trước khi c9 bắt đầu**, để suốt câu kể
// "khoảng sáu phần sáu độ dưới không" có một khoảng thời gian để đọc.
const th10 = keys([[0, 0], [T('c9') - .2, -6.6], [V.end, -6.6]]);
const thHalf = keys([[0, 0], [T('c19'), 0], [E1('c19'), -12.5], [V.end, -12.5]]);
const thDense = keys([[0, 0], [T('c19'), 0], [E1('c20'), -21], [V.end, -21]]);
// băng mọc trong các bình: nước sạch đông **trước và nhiều nhất**, bình 10 %
// đông kế, bình nửa đặc đông sau, bình đậm chưa đông.
// Bình nước sạch phải **đã đông một ít ngay khi c8 mở**, nếu không bằng
// chứng "nước sạch đông cứng" nằm ở một nhát khác, không phải ở nhát đang
// kể (vòng chấm hình ảnh 2).
const fzPure = keys([[0, 0], [T('c8'), .52], [E1('c8'), .95], [V.end, .95]]);
const fz10 = keys([[0, 0], [T('c9'), 0], [E1('c9'), .55], [V.end, .55]]);
const fzHalf = keys([[0, 0], [T('c19'), 0], [E1('c19'), .18], [E1('c20'), .42], [V.end, .42]]);
// Bình đậm đóng băng muộn nhất, ở c22: tới mốc −21 °C nó kết tinh thành
// muối hai nước. Ở c21 nó đã **hơi đục** để nổi lên giữa bể đá vỡ
// (vòng chấm hình ảnh 2: chủ thể chìm trong nhiễu đá trắng).
const fzDense = keys([[0, 0], [T('c21'), .28], [E1('c21'), .45], [T('c22'), .45], [E1('c22'), .8], [V.end, .8]]);
// tinh thể muối hai nước mọc ở đáy bình đậm (c22)
const hydK = keys([[0, 0], [T('c22'), 0], [E1('c22'), 1], [V.end, 1]]);
// trong vũng nước: mảnh đá nhỏ rã dần (c12)
const chipK = keys([[0, 0], [T('c12'), 0], [E1('c12'), .8], [V.end, .8]]);
// đống muối trong bát ở bàn thí nghiệm tan dần (c19)
const dishDiss = keys([[0, 0], [T('c19'), 0], [E1('c19'), 1], [V.end, 1]]);
// mặt đá ở nano: lớp nước trên mặt — **hai** đại lượng, không một:
// c14 lớp nước dày thêm (phân tử bám), c16 lớp nước mỏng đi (ion chặn).
const layerThin = keys([[0, 0], [T('c13'), 0], [T('c16'), 0], [E1('c16'), 1], [V.end, 1]]);
const layerWet = keys([[0, .6], [T('c13'), .6], [E1('c14'), 1], [T('c16'), 1], [E1('c16'), .15], [V.end, .15]]);
const patchN = keys([[0, 0], [T('c13'), 0], [E1('c14'), .3], [E1('c16'), 1], [V.end, 1]]);

// ── các vật, đọc từ bộ dựng cảnh ───────────────────────────────────────
const KP = K.props, LP = L.props, PP = P.props, NP = N.props, EP = E.props;

// ── trạng thái theo câu ─────────────────────────────────────────────────
// id: câu đang kể; t: thời gian trong câu đó; sc: nơi đang quay.
function applyState(id, t, sc) {
  const k = num(id);

  // ── bếp ──
  if (sc === 'K' || sc === 'K2') {
    const q = sc === 'K' ? KP : EP;
    const melt = sc === 'K' ? meltK(t) : meltE(t);
    const pud = sc === 'K' ? pudK(t) : pudE(t);
    q.iceSalt.setMelt(melt);
    q.iceCtrl.setMelt(0);
    q.pud.setLevel(pud);
    q.patch.setDissolve(sc === 'K' ? patchK(t) : 1);
    q.patch.visible = sc === 'K';
    // vệt muối nằm **trên mặt viên đá**, mà viên đá xuống thấp dần khi tan:
    // vệt phải đi xuống theo, nếu không nó bay lơ lửng trên đá (vòng chấm
    // hình ảnh 2 ở c5: một mảng chữ nhật lơ lửng trước mặt viên đá).
    q.patch.position.y = .012 + .15 * (1 - .62 * melt) + .002;
    q.frost.setGrow(sc === 'K' ? frostK(t) : 1);
    q.frost.position.y = .164;
    q.stream.setFlow(sc === 'K' ? flowK(t) : .12, t);
    q.thPud.setTemp(sc === 'K' ? thK(t) : -4.0);
    q.tin.setUsed(sc === 'K' ? tinK(t) : 1);
    q.thA.setTemp(18);
    q.thB.setTemp(glassK(t));
    // túi sữa trong bát đá: chỉ ở bếp buổi chiều nó đông dần (c24)
    q.zip.setFrozen(sc === 'K' ? 0 : zipK(t));
    // hạt muối rơi: c1 rắc lên viên đá, c3 rơi xuống mép khay
    q.fall.update(t, k === 1 ? 1 : 0);
    q.fallEdge.update(t, k === 3 ? 1 : 0);
    // ly nước muối: que khuấy quay và vệt muối tan (c6)
    q.rodB.rotation.y = k === 6 ? t * 3.4 : .2;
    q.saltInB.setDissolve(k === 6 ? saltInBK(t) : 1);
    // tay
    const h = q.hand, h2 = q.hand2;
    h.visible = false; h2.visible = false;
    if (sc === 'K') {
      // tay thấp xuống sát viên đá: tay và đá là một hành động, không phải
      // hai vệt nhỏ quanh một mảng bàn trống (vòng chấm 1)
      if (k === 1) gripSide(h, KL.salt[0] - .195, .185, KL.salt[1] - .02, .55);
      if (k === 3) gripLeft(h, -.30, .215, .98, .45);
      if (k === 6) {
        // Tay cầm que khuấy **ngang từ bên phải**, ngón ở trên miệng ly:
        // không có cánh tay thòi xuống che miệng ly (vòng chấm hình ảnh 2).
        gripLeft(h2, KL.glassB[0] + .145, .245, KL.glassB[1], .7);
      }
    } else {
      // bếp buổi chiều: tay đặt túi muối xuống cạnh hộp muối
      if (k === 23) {
        // tay ấn túi muối xuống quầy: cán tay chạy ra khỏi khung phía trên,
        // trong khung chỉ còn bàn tay trên túi muối
        gripDown(h, KL.bagFront[0] + .02, .30, KL.bagFront[1], .5);
      }
    }
  }

  // ── bàn thí nghiệm ──
  if (sc === 'L') {
    // nước sạch đóng băng trước và đông nhiều nhất: điểm đông của nó cao
    // hơn mọi dung dịch muối (vòng chấm 1 bắt lỗi bình nước sạch đông ít nhất)
    LP.beakers[0].setFreeze(fzPure(t));
    LP.beakers[1].setFreeze(fz10(t));
    LP.beakers[2].setFreeze(fzHalf(t));
    LP.beakers[3].setFreeze(fzDense(t));
    LP.ths[0].setTemp(th10(t));
    LP.ths[1].setTemp(thHalf(t));
    LP.ths[2].setTemp(thDense(t));
    LP.hyd.setGrow(hydK(t));
    // tô muối: đống muối tan và dòng lượn nhiệt chạy vào nó (c19) — nhiệt là
    // thứ vô hình, ở bàn thí nghiệm nó cũng phải là một vật có vật lý
    const melting = k === 19;
    LP.dish.setUsed(melting ? dishDiss(t) : 0);
    LP.dishHeat.visible = melting && dishDiss(t) > .05;
    if (LP.dishHeat.visible) {
      // dải nhiệt phải **lượn**, không phải một sợi thẳng: chu kỳ của dải
      // là uLen × uFreq, nên uFreq 9 chỉ vẽ được chưa tới nửa vòng sin
      // (vòng chấm hình ảnh 2 ở c19: "nhiệt là một sợi thẳng màu cam").
      // Dải chạy **từ đống muối lên**, chứ không đổ từ trên xuống: uHead
      // là đỉnh dải, uLen là chiều dài, và phần dưới mặt đất bị bỏ.
      LP.dishHeat.U.uHead.value = .05 + dishDiss(t) * .02;
      LP.dishHeat.U.uLen.value = .10;
      LP.dishHeat.U.uAmp.value = .016;
      LP.dishHeat.U.uFreq.value = 170;
      LP.dishHeat.U.uWidth.value = .009;
      LP.dishHeat.U.uPhase.value = t * 3;
      // mặt dải nhiệt **luôn quay về phía máy quay**: nhìn nghiêng nó là
      // một sợi mảnh, không phải một dải
      LP.dishHeat.rotation.y = Math.atan2(
        camera.position.x - LP.dishHeat.position.x,
        camera.position.z - LP.dishHeat.position.z);
    }
    // que khuấy: tay cầm và khuấy ở c9
    const stirring = k === 9;
    LP.rod.visible = true;
    LP.rod.rotation.set(0, stirring ? t * 2.6 : .2, -.12);
    LP.hand.visible = false; LP.hand2.visible = false;
    if (stirring) {
      // Tay cầm que khuấy **ngang từ bên phải**: cánh tay không thòi xuống
      // che miệng bình mười phần trăm, và cánh tay chạy ra ngoài khung bên
      // phải chứ không cắt ngang qua bình (vòng chấm hình ảnh 2: c9 có một
      // ống trụ xanh nằm ngang giữa khung).
      // Ngón tay ở đúng que khuấy: que nằm ở x = BX[1], ngón tay của bàn tay
      // cỡ nửa vươn được 19 cm từ lòng bàn tay.
      gripLeft(LP.hand, LP.rod.position.x + .15, .345, LP.rod.position.z, .7);
    }
    if (melting) {
      // Tay bám **mép phải** của tô muối: lòng bàn tay nằm ngoài khung bên
      // phải, ngón cuộn qua vành tô. Tay không được trải ra che mặt tô, và
      // dải nhiệt phải còn thấy được (vòng chấm hình ảnh 2 ở c19). Ngón tay
      // cuộn (curl .55) thì đầu ngón nằm ~13 cm về phía lòng bàn tay và
      // ~5 cm thấp hơn: lòng bàn tay phải đặt cao và lệch sang phải để
      // đầu ngón rơi đúng vành tô.
      gripLeft(LP.hand2, LP.dish.position.x + .217, .087, LP.dish.position.z, .55);
    }
  }

  // ── trong vũng nước ──
  if (sc === 'P') {
    // Ở c17 máy quay nhìn hạt muối từ rất gần: đám ion phải **lùi ra**,
    // nếu không có cầu ion nổi ngay trước ống kính và che mất hạt
    // (vòng chấm hình ảnh 2 ở c17). Ở c12 ion cũng phải nhỏ lại: chủ thể
    // của c12 là mảnh đá đang rã, không phải đám ion.
    PP.ion.scale.setScalar(k === 17 ? .18 : k === 12 ? .22 : .32);
    // vùng trống trước ống kính: không có nó thì một cầu ion cách máy vài
    // centimet là một quả bóng khổng lồ ở giữa khung (vòng chấm hình ảnh 2).
    PP.ion.setClear(.17);
    PP.ion.update(t, camera);
    PP.chip.setMelt(chipK(t));
    // ở c17 những chấm sáng và cụm phân tử phải **lùi hẳn**: chúng là của
    // c11 và c12, ở c17 chỉ hạt muối và dải nhiệt là chủ thể. Ở c12 chúng
    // cũng lùi: chủ thể của c12 là mảnh đá đang rã.
    PP.dots.visible = k !== 17;
    PP.dots.update(t, camera);
    PP.mols.forEach(m => { m.visible = k !== 17 && k !== 12; });
    PP.mols.forEach((m, i) => { m.rotation.y = t * .4 + i; m.rotation.x = t * .22 + i; });
    // hạt muối: rơi rồi tan, ở c11 (muối tan ra thành hai ion) và ở c17
    const g = grainState(k, t);
    PP.grain.visible = g.diss < .98;
    PP.grain.setFall(g.fall);
    PP.grain.setDissolve(g.diss);
    PP.heat.visible = g.diss > .10 && g.diss < .98;
    if (PP.heat.visible) {
      // dải nhiệt: rộng, uốn lượn, màu ấm — đủ tách ra khỏi nền xanh để
      // "nó lấy nhiệt từ chính lớp nước" là một hình (vòng chấm hình ảnh 2).
      // Dải chạy từ hạt muối lên **tới mặt nước** ở trên khung.
      PP.heat.U.uHead.value = .06 + g.diss * .03;
      PP.heat.U.uLen.value = .13;
      PP.heat.U.uAmp.value = .022;
      PP.heat.U.uFreq.value = 90;
      PP.heat.U.uWidth.value = .012;
      PP.heat.U.uPhase.value = t * 3;
    }
  }

  // ── mặt đá ở nano ──
  if (sc === 'N') {
    // Ở c16 chủ thể là **lớp nước mỏng đi**: phân tử nước nhỏ lại và lùi
    // khỏi ống kính (một quả bóng trắng khổng lồ che mất cả mặt đá), ion
    // lùi ra và nhỏ lại, còn lưới tinh thể thì sáng dần lên (vòng chấm hình
    // ảnh 2 ở c16).
    NP.mol.scale.setScalar(k === 16 ? .70 : 1.5);
    NP.mol.update(t, camera);
    NP.mol.setClear(k === 16 ? .26 : .16);
    NP.ion.visible = k >= 15;              // ion clorua chỉ xuất hiện ở c15
    NP.ion.scale.setScalar(k === 16 ? .22 : .42);
    NP.ion.setClear(k === 16 ? .26 : .13);
    NP.ion.update(t, camera);
    NP.face.setLayer(layerThin(t), layerWet(t));
    NP.patch.setDissolve(patchN(t));
  }
}

// hạt muối trong vũng nước: rơi rồi tan. Ở c11 nó tan ra thành hai ion,
// ở c17 nó tan trong lớp nước quanh đá và lấy nhiệt.
function grainState(k, t) {
  const run = (id, a, b) => {
    const u = clamp((t - T(id)) / Math.max(.01, E1(id) - T(id)));
    return { fall: clamp(u * a), diss: clamp((u - b) * a) };
  };
  if (k === 11) return run('c11', 2.2, .45);
  // c17: hạt vỡ **sớm** — dòng nhiệt phải có mặt ngay trong nhát, không phải
  // ở nửa sau của câu (vòng chấm hình ảnh 2: không có gì trên hình).
  if (k === 17) return run('c17', 1.7, .18);
  return { fall: 1, diss: 1 };             // ở nhát khác hạt đã tan hết
}

// ── thẻ số: chỉ hai, và mỗi thẻ có câu lời đọc nó ──────────────────────
// Thẻ "-21 °C" không trỏ vào vạch không độ mà trỏ vào **đầu cột thủy nghiện**
// trong bình đậm — đó là chỗ con số -21 độ đang ở. Đầu cột lấy đúng thang của
// que nhiệt kế (columnY), nên thẻ không trôi khỏi vật nó nói.
const denseColumn = tt => {
  const th = LP.ths[2];
  const y = th.columnY(thDense(tt));
  return [th.position.x, th.position.y + y, th.position.z + .012];
};
// Thẻ "10 %" neo ở mép phải của bình nước muối mười phần trăm, ở đúng
// chỗ vạch miệng bình — người xem nhìn thẻ rồi nhìn xuống thì thấy bình.
// Thẻ "nước sạch" neo ở miệng bình nước sạch: bốn bình trong bể trông giống
// nhau, không có nhãn thì không ai biết bình nào đông trước (vòng chấm
// hình ảnh 2).
const brineBeaker = () => [LP.beakers[1].position.x + .05, .245, LP.beakers[1].position.z];
const pureBeaker = () => [LP.beakers[0].position.x, .235, LP.beakers[0].position.z];
// cardWindow mở thẻ từ **cuối câu trước**; thẻ phải mở đúng lúc câu của nó
// bắt đầu, nên bù lại đúng khoảng lặng giữa hai câu (một số âm).
const lead = id => {
  const n = +id.slice(1);
  return n > 1 ? V.L['c' + (n - 1)].t1 - V.L[id].t0 : 0;
};
const CARDS = [
  // Thẻ "nước sạch" chỉ sống trong nhát của nó: nó kết thúc **trước khi
  // c9 bắt đầu**, vì từ đó máy quay đã sang bình mười phần trăm và mũi
  // tên của thẻ sẽ chỉ vào chỗ trống.
  { id: 'nuoc-sach', text: 'nước sạch', at: pureBeaker, lines: ['c8'], ids: ['c8'], size: 32, hold: 1.2, win: [T('c8'), T('c9') - .25], anchor: 'bình thuỷ tinh có miệng và vạch chia, nước trong' },
  { id: 'muoi-muoi-phan-tram', text: '10 %', at: brineBeaker, lines: ['c9'], ids: ['c9'], size: 34, lead: lead('c9'), hold: 1.1, anchor: 'bình thuỷ tinh có miệng và vạch chia, nước trong' },
  { id: 'muoi-hai-muoi-mot-do', text: '-21 °C', at: denseColumn, lines: ['c21'], ids: ['c21'], size: 40, lead: lead('c21'), hold: .8, anchor: 'que nhiệt kế thủy tinh, cột thủy nghiện đỏ dưới vạch không độ' },
];
// cardWindow trả về một đối tượng {t0,t1}; bảng `windows` của thẻ là danh
// sách **cặp** [t0,t1]. Nếu đặt nhầm đối tượng vào đây thì `w[0]` là undefined
// và **không thẻ nào mở ra** — cả hai thẻ của tập biến mất.
// Một thẻ có `win` riêng thì lấy cửa sổ đó: thẻ "nước sạch" chỉ được hiện
// trong nhát của nó, không trôi sang cuối câu trước (lúc đó máy quay còn ở
// cảnh khác và mũi tên của thẻ sẽ chỉ vào không trung).
for (const C of CARDS) {
  if (C.win) { C.windows = [[C.win[0], C.win[1]]]; continue; }
  const w = cardWindow(C, V);
  C.windows = [[w.t0, w.t1]];
}

// ── sự kiện của phim ────────────────────────────────────────────────────
const EV = [...V.ev];
const ev = (type, t, extra = {}) => EV.push({ type, t: +t.toFixed(3), ...extra });

// không khí: mỗi chặng một loại — bếp thì tiếng bếp, bàn thí nghiệm thì tiếng
// máy, trong nước và ở cấp nano thì trầm.
{
  let i = 0;
  while (i < SHOTS.length) {
    const s = SHOTS[i].s;
    let j = i;
    while (j + 1 < SHOTS.length && SHOTS[j + 1].s === s) j++;
    const kind = (s === 'K' || s === 'K2') ? 'kitchen' : s === 'L' ? 'lab' : 'low';
    ev('amb', V.L[SHOTS[i].ids[0]].t0, { kind, t1: +V.L[SHOTS[j].ids[0]].t1.toFixed(3) });
    i = j + 1;
  }
}
// nhạc: mỗi chặng bắt đầu ở nhát của nó
for (const [id, cue] of [['c1', 'A'], ['c8', 'B'], ['c10', 'C'], ['c13', 'D'], ['c19', 'E'], ['c23', 'F']])
  ev('music', T(id), { cue });
ev('music', V.end - 2.2, { cue: 'end' });

// foley: chỉ khi vật thể thật sự kêu
const FOLEY = [
  ['c1', .05, 'hand_tap', .16],                    // tay bóp muối
  ['c1', .45, 'plastic_set', .18],                 // hộp muối rung khi muối rơi
  ['c2', .10, 'whoosh_soft', .24],                 // máy trượt sang viên đá đối chứng
  ['c3', .25, 'cloth_rustle', .22],                // tay rửa muối
  ['c5', .30, 'blip_up', .14],                     // giọt nước rơi khỏi mặt đá
  ['c6', .35, 'glass_set', .18],                   // muối rơi vào ly
  ['c7', .35, 'blip_up', .16],                     // lớp băng mờ mọc lên
  ['c8', .15, 'glass_set', .20],                   // bình đặt vào bể
  ['c9', .25, 'blip_up', .20],                     // cột thủy nghiện trượt xuống
  ['c13', .20, 'blip_up', .16],
  ['c14', .25, 'blip_up', .18],
  ['c16', .30, 'blip_up', .18],
  ['c17', .70, 'blip_up', .20],                    // hạt muối tan
  ['c18', .30, 'blip_up', .18],                    // cột thủy nghiện tụt thêm
  ['c19', .25, 'plastic_set', .20],                // bát muối đặt xuống
  ['c20', .30, 'blip_up', .18],                    // băng mọc trong bình
  ['c21', .30, 'blip_up', .20],                    // cột dừng ở mốc
  ['c22', .30, 'blip_up', .16],                    // tinh thể mọc lên
  ['c23', .20, 'cloth_rustle', .22],               // tay đặt túi muối
  ['c24', .25, 'glass_set', .18],                  // bát đá đặt xuống
  ['c25', .30, 'whoosh_soft', .26],                // máy lùi xa
];
for (const [id, dt, kind, v] of FOLEY) ev(kind, T(id) + dt, { v });

// ── dựng khung ──────────────────────────────────────────────────────────
window.DUR = V.end;
window.EV = EV;

function shotAt(t) {
  let i = 0;
  while (i < SHOTS.length - 1 && t >= V.L[SHOTS[i].ids[0]].t1) i++;
  const sh = SHOTS[i], id = sh.ids[0];
  const u = clamp((t - V.L[id].t0) / Math.max(.001, V.L[id].t1 - V.L[id].t0));
  return { i, sh, u, id };
}

window.render = t => {
  const s = shotAt(t), sh = s.sh, id = s.id;
  const u = s.u, e = ss(u);
  // tiêu cự: vài câu mở rộng rồi đi vào chứng cứ (xem fov2 trong bảng nhát)
  camera.fov = sh.fov2 ? lerp(sh.fov, sh.fov2, e) : sh.fov;
  camera.position.set(sh.pos[0] + sh.d[0] * e, sh.pos[1] + sh.d[1] * e, sh.pos[2] + sh.d[2] * e);
  const dl = sh.dLook || [0, 0, 0];
  camera.lookAt(sh.look[0] + dl[0] * e, sh.look[1] + dl[1] * e, sh.look[2] + dl[2] * e);
  camera.updateProjectionMatrix();

  applyState(id, t, sh.s);

  const set = setOf[sh.s];
  // Nhất sáng theo nơi chốn: bếp sáng .78, bếp chiều .74 (màu key đổi sang
  // hổ phách trong rig, không phải cắt đều), bàn thí nghiệm .86, và hai cảnh
  // vi mô thấp hơn bàn thí nghiệm — trước đây cảnh nano sáng nhất toàn phim.
  // `l` của nhát là nút sáng riêng cho một nhát (c6 là cảnh hai ly, phải sáng).
  const base = sh.s === 'K2' ? .74 : sh.s === 'K' ? .78 : sh.s === 'L' ? .86 : sh.s === 'N' ? .72 : .80;
  if (set.update) set.update(t, { light: base * (sh.l ?? 1) });

  const dist = camera.position.distanceTo(new THREE.Vector3(sh.look[0], sh.look[1], sh.look[2]));
  F.frame(SC[sh.s], {
    t,
    thick: clamp(1.95 + dist * .7, 2.0, 3.8),
    ref: dist,
    key: set.key || null,
    fade: Math.min(1, t / .3 + .2, (window.DUR - t) / .4),
    overlay: (g, tt) => {
      const out = [];
      const sub = V.sub(tt);
      if (sub) subtitle(g, sub);
      for (const C of CARDS) {
        const win = C.windows.find(w => tt >= w[0] && tt <= w[1]);
        if (!win) continue;
        const size = C.size ?? 30;
        g.save(); g.font = `900 ${size}px "Be Vietnam Pro"`;
        const bw = g.measureText(C.text).width + size, bh = size * 1.55;
        g.restore();
        const a = typeof C.at === 'function' ? C.at(tt) : C.at;
        const [ax, ay] = toScreen(new THREE.Vector3(a[0], a[1], a[2]), camera);
        let x = ax + bw / 2 + 26;
        let y = ay - bh / 2 - 44;
        // khung là 1920×1080: thẻ không được tràn ra ngoài, và không được
        // chồng lên dải phụ đề ở dưới khung
        x = clamp(x, bw / 2 + 30, 1920 - bw / 2 - 30);
        y = clamp(y, bh / 2 + 8, 1080 - bh / 2 - 110);
        const b = label(g, C.text, x, y, tt, win[0], win[1], { id: C.id, size });
        if (b) out.push(b);
      }
      return out;
    },
  });
};

// ── mốc nhịp: mỗi câu một điểm trên khung ───────────────────────────────
// Điểm là chỗ thẻ của câu bám vào (nếu câu có thẻ), không thì là điểm máy đang nhìn.
F.markBeats(ev, V, (id, t) => {
  const C = CARDS.find(c => c.ids.includes(id));
  if (C) {
    const a = C.at(t);
    return toScreen(new THREE.Vector3(a[0], a[1], a[2]), camera);
  }
  const s = shotAt(t);
  return toScreen(new THREE.Vector3(s.sh.look[0], s.sh.look[1], s.sh.look[2]), camera);
});

// chẩn đoán: nhát đang quay và trạng thái
window.DIAG = t => {
  const s = shotAt(t);
  return {
    shot: s.i + 1, ids: s.sh.ids, u: +s.u.toFixed(3),
    pos: s.sh.pos.map(v => +v.toFixed(3)), look: s.sh.look.map(v => +v.toFixed(3)),
    fov: +(s.sh.fov2 ? lerp(s.sh.fov, s.sh.fov2, ss(s.u)) : s.sh.fov).toFixed(1),
    cards: CARDS.map(c => [c.id, c.ids.join(','), c.windows.map(w => [+w[0].toFixed(2), +w[1].toFixed(2)])]),
  };
};

window.TEXTS = t => { window.render(t); return F.texts(); };
window.SCENES = SC; window.CAM = camera; window.THREE_NS = THREE; window.RND = F.renderer;
window.P1 = K; window.P2 = L; window.P3 = P; window.P4 = N; window.P5 = E;
await document.fonts.load('900 54px "Be Vietnam Pro"');
window.render(0);
window.READY = true;
