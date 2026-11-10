// Vì sao ngủ trưa dậy lại mệt? — trang phim: 52 nhát, mỗi câu một nhát, theo shot list của TREATMENT.md.
// Mỗi nhát bám vào câu nó mang (V.L[id].t0/t1) nên nhịp quay đúng với lời kể.
import * as THREE from 'three';
import { film, label, subtitle, toScreen, markBeat, cardWindow } from '../../../../rig/render.js';
import { PAL, keys, seg, ss, eio, eo, lerp, clamp } from '../../../../rig/kit.js';
import { build } from './timeline.js';
import { loadVoice } from '../../../../rig/voice.js';
import { buildPhongNgu, buildKhongMao, buildKhe } from './set.js';

// Chữ tiếng Việt trong các texture vẽ tay phải có đúng dấu: nạp font TRƯỚC khi
// dựng vật, nếu không canvas sẽ vẽ bằng font dự phòng không có dấu ("DẬY LÊN"
// thành "CHÓ 7 ZEC").
await document.fonts.load('700 54px "Be Vietnam Pro"');
await document.fonts.load('900 54px "Be Vietnam Pro"');

const V = await loadVoice(build);
const F = film({ fov: 38 }), camera = F.camera;

const PHG = buildPhongNgu();      // N1 · phòng ngủ buổi chiều
const MAO = buildKhongMao();      // N2 · khối mô não trên bàn tối
const KHE = buildKhe();           // N3 · khe giữa hai tế bào
const setOf = { N1: PHG, N2: MAO, N3: KHE };

// ── 52 nhát: mỗi câu một hình ────────────────────────────────────────────
// Máy cắt theo nhịp lời kể: mỗi câu một bố cục riêng, không nhát nào kéo dài quá
// một câu, để mỗi câu đều có hình của riêng nó.
// sh(set, câu, tiêu cự, vị trí máy, điểm nhìn, đẩy máy trong nhát)
// Vị trí máy và điểm nhìn có thể là hàm: chúng bám vào chính vật (mặt đồng hồ,
// mặt bảng đo, mặt giấy…) nên vị trí vật đổi thì máy đi theo.
const sh = (s, id, fov, p, l, d = [0, 0, 0]) => ({
  s, ids: [id], fov,
  pose: u => {
    const pp = typeof p === 'function' ? p() : p;
    const ll = typeof l === 'function' ? l() : l;
    return { p: [pp[0] + d[0] * ss(u), pp[1] + d[1] * ss(u), pp[2] + d[2] * ss(u)], l: ll };
  },
});

// các điểm neo: lấy từ chính vật, theo khung cục bộ của vật
const LP = (o, x = 0, y = 0, z = 0) => { const v = new THREE.Vector3(x, y, z); o.localToWorld(v); return v; };
const A = {
  clockFace: () => LP(PHG.clock.face, 0, 0, .05).toArray(),
  clockTop: () => LP(PHG.clock, 0, .54, 0).toArray(),
  recFace: () => LP(PHG.rec, 0, .17, .21).toArray(),
  recMark30: () => LP(PHG.rec.dial, PHG.rec.mark30.x, PHG.rec.mark30.y, PHG.rec.mark30.z).toArray(),
  plate: () => LP(PHG.plate, 0, .02, .04).toArray(),
  paper15: () => LP(PHG.rec.paper, .181, 0, .60 * (1 - 15 / 45)).toArray(),
  paper30: () => LP(PHG.rec.paper, .181, 0, .60 * (1 - 30 / 45)).toArray(),
  paper20: () => LP(PHG.rec.paper, .181, 0, .60 * (1 - 20 / 45)).toArray(),
  paperMid: () => LP(PHG.rec.paper, .181, 0, .30).toArray(),
  gate: () => LP(PHG.rec.gate, 0, .03, 0).toArray(),
  boardFace: () => LP(PHG.board, 0, .25, -.06).toArray(),
  dial: () => LP(PHG.board.dial, 0, 0, .02).toArray(),
  green: () => LP(PHG.board.green, 0, 0, 0).toArray(),
  button: () => LP(PHG.board.button, 0, 0, .02).toArray(),
  lamp: () => LP(PHG.board.lamps[7], 0, 0, 0).toArray(),
  mug: () => LP(PHG.mug, 0, .14, 0).toArray(),
};
// neo + một khoảng lệch, để dựng máy quay quanh vật
const off = (a, dx, dy, dz) => { const p = a(); return [p[0] + dx, p[1] + dy, p[2] + dz]; };
// trung điểm của hai neo
const mid = (a, b) => { const p = a(), q = b(); return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2]; };

const SHOTS = [
  // ── N1 · buổi chiều: nằm xuống, chuông reo, đầu nặng ──
  sh('N1', 'c1', 52, [0.55, 1.62, 5.35], [-1.05, 0.62, 1.15], [0, 0, -.05]),   // cả buổi chiều: giường, bàn đầu giường, cửa sổ nắng xiên
  sh('N1', 'c2', 32, () => off(A.clockFace, .45, .34, 1.30), A.clockFace, [-.02, 0, -.02]), // đồng hồ báo thức reo, tay với ra chặn
  sh('N1', 'c3', 32, () => off(A.mug, .52, .32, .86), A.mug, [0, -.02, -.02]),   // tay cầm tách cà phê, hạ xuống — cái đầu nặng
  sh('N1', 'c4', 44, [-0.60, 1.60, 3.70], [-2.30, 0.55, 1.55], [0, 0, -.03]),   // cái giường đã nằm: chăn nhàu, gối lệch
  // ── N1 · máy ghi giấc ngủ: đo được phần bên trong ──
  sh('N1', 'c5', 36, () => off(A.recFace, .58, .62, 1.10), A.recFace, [0, 0, -.02]), // máy ghi giấc ngủ, cuộn giấy chạy ra
  sh('N1', 'c6', 30, () => off(A.recFace, .10, .22, .74), A.recFace, [.01, 0, -.02]), // đẩy vào mặt máy: đồng hồ nhỏ và hai nút
  sh('N1', 'c7', 32, () => off(A.paper15, .62, .46, .06), A.paper15, [0, 0, -.03]), // mặt giấy: vùng ngủ sóng chậm được tô đậm
  // ── N2 · trong não: sóng chậm dồn lên rồi giảm dần ──
  sh('N2', 'c8', 32, [-.15, 1.05, 2.35], [-.80, -.12, -.05], [0, 0, -.05]),   // nếp não phồng lên rồi xẹp dần
  // ── N1 · chuông cắt ngang giấc ngủ ──
  sh('N1', 'c9', 30, () => off(A.clockFace, 1.00, .55, 1.22), A.clockTop, [0, 0, -.03]), // chuông reo, mặt đồng hồ rung
  // ── N2 · cách kể quen thuộc: não chưa kịp chạy lại ──
  sh('N2', 'c10', 30, [-.25, 1.20, 2.15], [-.80, -.06, -.05], [0, 0, -.04]),  // tín hiệu bò trên nếp não
  sh('N2', 'c11', 26, [-.60, 1.00, 1.70], [-.80, -.02, -.02], [-.02, 0, -.03]), // gần hơn: tín hiệu vẫn bò
  // ── N2 · các nghiên cứu chia làm đôi ──
  sh('N2', 'c12', 40, [0.00, .72, 2.25], [0.00, -.13, -.02], [0, 0, -.04]),     // hai bản não cạnh nhau trên bàn
  sh('N2', 'c13', 32, [-1.75, 1.15, 2.75], [-.10, -.20, 0], [0, 0, -.03]),    // hai bản não cạnh nhau: bản sáng và bản tối
  // ── N1 · cái đo được ──
  sh('N1', 'c14', 44, [1.90, 1.35, 2.60], [-0.20, 0.65, 0.95], [0, 0, -.03]),   // quay lại bàn: bảng đo phản xạ
  sh('N1', 'c15', 30, () => off(A.boardFace, -.06, .34, 1.35), A.boardFace, [0, 0, -.03]), // đẩy vào bảng đo
  sh('N1', 'c16', 26, () => off(A.lamp, -.12, .32, 1.05), A.lamp, [0, 0, -.03]),   // lưới đèn trong bảng tắt dần
  sh('N1', 'c17', 24, () => off(A.dial, .16, .22, .62), A.dial, [0, 0, -.02]),    // đồng hồ kim: kim chùy xuống
  // ── N1 · ranh giới ba mươi phút ──
  sh('N1', 'c18', 32, () => off(A.paper30, .62, .46, .06), A.paper30, [0, 0, -.03]), // cổng gạch đậm ở mốc ba mươi phút
  sh('N1', 'c19', 42, () => off(A.paperMid, 1.05, .85, .28), A.paperMid, [0, 0, -.04]), // rộng, nhìn từ trên: cổng và hai đường đo phản xạ
  sh('N1', 'c20', 30, () => off(A.boardFace, -.05, .30, 1.25), A.boardFace, [0, 0, -.03]), // dưới ngưỡng: đèn trong bảng vẫn sáng gần hết
  // ── N1 · cơn lờ đờ không kéo dài ──
  sh('N1', 'c21', 30, () => off(A.clockFace, .38, .16, .60), A.clockFace, [0, 0, -.03]), // kim đồng hồ chạy nửa tiếng
  sh('N1', 'c22', 46, [1.20, 1.60, 3.00], [0.60, 1.10, 0.30], [0, 0, -.04]),   // cửa sổ sáng hơn, cơn lờ đờ đã qua
  // ── N1 · cảm giác và phép đo ──
  sh('N1', 'c23', 24, () => off(A.green, .14, .18, .44), A.green, [0, 0, -.02]), // đèn xanh báo "mình thấy"
  sh('N1', 'c24', 28, () => off(A.button, -.34, .24, .58), A.button, [0, 0, -.02]), // tay bấm nút đỏ: tự đánh giá là tốt hơn
  sh('N1', 'c25', 26, () => off(A.dial, .12, .16, .54), A.dial, [0, 0, -.02]),  // kim vẫn chùy: phép đo nói ngược lại
  sh('N1', 'c26', 30, () => off(() => mid(A.green, A.dial), .14, .24, .70), () => mid(A.green, A.dial), [0, 0, -.02]), // đèn xanh sáng, kim chùy — hai chiều ngược nhau
  // ── N2 → N3 · vào bên trong ──
  sh('N2', 'c27', 32, [-1.30, .95, 2.15], [-.80, -.04, -.05], [0, 0, -.10]),  // đẩy vào trong khối mô não
  // N3 · khe giữa hai tế bào: củ tế bào ở gần máy, hàng thụ thể ở xa.
  // Máy cận thì đứng ngay trong khe, nhìn thẳng vào hàng khía.
  sh('N3', 'c28', 48, [-.35, .62, -1.18], [.02, .06, 1.25], [0, 0, -.05]),  // rộng: khe giữa hai tế bào
  // ── N3 · adenosine ──
  sh('N3', 'c29', 40, [-.62, .36, .05], [.10, .12, .85], [0, 0, -.04]),  // đám phân tử trong khe (nhìn xuống khe, không có củ tế bào che)
  sh('N3', 'c30', 26, [.05, .13, 1.45], [.05, .12, .95], [0, 0, -.02]),    // cận: một phân tử adenosine
  sh('N3', 'c31', 42, [.30, .55, .30], [.00, .00, .90], [0, 0, -.05]), // rộng: đám đông dần lên
  sh('N3', 'c32', 34, [.02, .42, .32], [.02, .14, 1.35], [0, 0, -.03]),   // một phân tử rời đám, bay về phía thụ thể
  sh('N3', 'c33', 32, [-.08, .34, .60], [0, .13, 1.82], [0, 0, -.03]),    // phân tử bám vào túi của thụ thể
  sh('N3', 'c34', 48, [-.30, .62, -.35], [.02, .06, 1.05], [0, 0, -.05]), // rộng: khe chật ních đầy phân tử
  // ── N3 · lý thuyết: não chậm lúc vừa mở mắt ──
  sh('N3', 'c35', 42, [-1.62, .68, -1.02], [-.05, .16, .50], [0, 0, -.02]), // nhìn dọc sợi trục về phía khe
  sh('N3', 'c36', 36, [-1.30, .46, -.82], [-.05, .14, .45], [0, 0, -.02]), // gần hơn: vẫn chỉ là lý thuyết
  // ── N3 · cà phê ──
  sh('N3', 'c37', 28, [-.30, .32, 1.45], [-.30, .30, .95], [0, 0, -.04]),  // một phân tử mới xuất hiện
  sh('N3', 'c38', 38, [-.58, .50, -.62], [.05, .05, 1.15], [0, 0, -.03]),  // adenosine vẫn còn đầy khe
  sh('N3', 'c39', 34, [.10, .28, .62], [0, .13, 1.82], [0, 0, -.03]),   // phân tử mới bay thẳng vào túi
  sh('N3', 'c40', 36, [.30, .50, 1.05], [-.12, .10, 1.62], [0, 0, -.03]),   // adenosine bị đẩy ra khỏi túi, túi trống
  // ── N1 · thí nghiệm có cà phê ──
  sh('N1', 'c41', 46, [1.45, 1.20, 2.30], [.15, .56, 1.00], [0, 0, -.04]),   // hai tách, hai bảng đo: kim chạy ngược chiều
  // ── N1 · vì sao hay xảy ra đúng buổi chiều ──
  sh('N1', 'c42', 34, [-.10, 1.86, 1.45], [-.28, 1.86, .12], [0, 0, -.04]),  // đồng hồ 24 giờ trên tường, dải buổi chiều
  sh('N1', 'c43', 34, [-.02, 1.92, 1.02], [-.27, 1.79, .12], [0, 0, -.03]),  // cận: kim đen chỉ buổi chiều
  sh('N1', 'c44', 38, [-1.75, 1.35, 2.70], [-.75, .55, 1.20], [0, 0, -.03]), // góc bàn trống: không có gì để ăn
  // ── N2 · đừng rơi quá sâu ──
  sh('N2', 'c45', 32, [-.55, 1.05, 2.30], [-.80, -.14, -.05], [0, 0, -.05]),  // khối mô não, nếp chỉ thở nhẹ
  sh('N2', 'c46', 30, [-.95, .95, 1.85], [-.80, -.04, -.05], [0, 0, -.04]),  // nếp não không sâu xuống
  // ── N1 · giữ giấc trưa ở mức ngủ nông ──
  sh('N1', 'c47', 30, () => off(A.paper20, .34, .72, .34), A.paper20, [0, 0, -.03]), // mặt giấy: hai mươi phút, đường vẫn ở mức nông
  sh('N1', 'c48', 28, () => off(A.boardFace, .05, .32, 1.30), A.boardFace, [0, 0, -.03]), // bảng đo: đèn vẫn sáng gần hết
  // ── N3 · cà phê trước khi nằm ──
  sh('N3', 'c49', 34, [-.20, .30, .58], [-.22, .13, 1.80], [0, 0, -.03]),    // phân tử mới nằm chặn trong túi
  // ── N1 · kết ──
  sh('N1', 'c50', 34, () => off(A.mug, .22, .28, .72), A.mug, [0, 0, -.03]),  // tay đặt xuống bàn, tách cà phê bên cạnh
  sh('N2', 'c51', 32, [-.50, 1.20, 2.10], [-.80, -.08, -.05], [0, 0, -.04]), // tín hiệu trên nếp não vẫn đang bò
  sh('N1', 'c52', 50, [-0.30, 1.72, 5.20], [-0.70, 0.78, 1.05], [0, 0, -.05]),  // buổi chiều sáng hơn: cơn lờ đờ tự qua
];

// mốc thời gian của từng nhát: nhát i bắt đầu khi câu đầu bắt đầu, kết thúc khi câu cuối kết thúc
const MARK = SHOTS.map(sh => ({
  t0: V.L[sh.ids[0]].t0,
  t1: V.L[sh.ids[sh.ids.length - 1]].t1,
}));

// ── thẻ thuật ngữ: tên và con số đang hiện trên vật đo ──────────────────
// Mỗi thẻ bám vào một vật trong khung, lấy đúng toạ độ của chính vật đó
// (theo khung cục bộ của nó) nên vị trí vật đổi thì thẻ đi theo.
const CARDS = [
  { id: 'dongho',  text: 'ĐỒNG HỒ BÁO THỨC', at: () => LP(PHG.clock.face, 0, 0, .05).toArray(), lines: ['c2'], size: 28, anchor: 'đồng hồ báo thức' },
  { id: 'giacngu', text: 'BA MƯƠI PHÚT',     at: () => A.recMark30(), lines: ['c5'], size: 30, anchor: 'máy ghi giấc ngủ' },
  { id: 'muoilam', text: 'MƯỜI LĂM PHÚT',     at: () => LP(PHG.rec.paper, .181, 0, .60 * (1 - 15 / 45)).toArray(), lines: ['c7'], size: 30, anchor: 'máy ghi giấc ngủ' },
  { id: 'songcham',text: 'SÓNG CHẬM',     at: () => LP(MAO.chunk, 0, .17, .14).toArray(), lines: ['c8'], size: 30, anchor: 'khối mô não' },
  { id: 'nao10',   text: 'NÃO',               at: () => LP(MAO.chunk, -.46, .10, .30).toArray(), lines: ['c10', 'c11'], size: 32, anchor: 'khối mô não' },
  { id: 'haiben',  text: 'HAI BÊN',          at: () => LP(MAO.chunk, .52, .08, .06).toArray(), lines: ['c12'], size: 30, anchor: 'khối mô não' },
  { id: 'benthay', text: 'BÊN THẤY',         at: () => LP(MAO.chunk, -.42, .10, .28).toArray(), lines: ['c13'], size: 30, anchor: 'khối mô não' },
  { id: 'benkhongthay', text: 'BÊN KHÔNG THẤY', at: () => LP(MAO.chunk2, .42, .10, .28).toArray(), lines: ['c13'], size: 30, anchor: 'khối mô não' },
  { id: 'phanxa',  text: 'PHẢN XẠ',           at: () => LP(PHG.board.lamps[7], 0, 0, 0).toArray(), lines: ['c16'], size: 32, anchor: 'bảng đo phản xạ' },
  { id: 'cong30',  text: 'BA MƯƠI PHÚT',      at: () => LP(PHG.rec.paper, .181, 0, .60 * (1 - 30 / 45)).toArray(), lines: ['c18'], size: 30, hold: 3.2, anchor: 'máy ghi giấc ngủ' },
  { id: 'nuat',    text: 'NỬA TIẾNG',         at: () => LP(PHG.clock.face, 0, 0, .05).toArray(), lines: ['c21'], size: 30, anchor: 'đồng hồ báo thức' },
  { id: 'minhthay',text: 'MÌNH THẤY',         at: () => LP(PHG.board.green, 0, 0, 0).toArray(), lines: ['c23'], size: 30, anchor: 'bảng đo phản xạ' },
  { id: 'tudanhgia',text:'TỰ ĐÁNH GIÁ',       at: () => LP(PHG.board.button, 0, 0, .02).toArray(), lines: ['c24'], size: 28, anchor: 'bảng đo phản xạ' },
  { id: 'lodo',    text: 'LỜ ĐỜ',             at: () => LP(PHG.board.needle, 0, .02, .02).toArray(), lines: ['c26'], size: 32, anchor: 'bảng đo phản xạ' },
  { id: 'nao',     text: 'NÃO',               at: () => LP(MAO.chunk, -.50, .14, .24).toArray(), lines: ['c27'], size: 32, anchor: 'khối mô não' },
  { id: 'nao45',   text: 'NÃO',               at: () => LP(MAO.chunk, -.46, .10, .30).toArray(), lines: ['c45', 'c46'], size: 32, anchor: 'khối mô não' },
  { id: 'nao51',   text: 'NÃO',               at: () => LP(MAO.chunk, -.46, .10, .30).toArray(), lines: ['c51'], size: 32, anchor: 'khối mô não' },
  { id: 'adeno',   text: 'ADENOSINE',         at: () => KHE.dockPos(0).toArray(), lines: ['c30'], size: 30, anchor: 'phân tử adenosine' },
  { id: 'thuthe',  text: 'THỤ THỂ',           at: () => KHE.rim1.toArray(), lines: ['c33'], size: 30, anchor: 'hàng thụ thể' },
  { id: 'caphe',   text: 'CAFFEINE',         at: () => KHE.cafePos(.18).toArray(), lines: ['c37'], size: 30, anchor: 'phân tử caffeine' },
  { id: 'cocaphe', text: 'CÀ PHÊ TRONG TÁCH',  at: () => LP(PHG.mug, 0, .16, 0).toArray(), lines: ['c41'], size: 28, anchor: 'tách cà phê' },
  { id: 'buoichieu',text:'BUỔI CHIỀU',        at: () => LP(PHG.clock24, -.187, -.187, .012).toArray(), lines: ['c42'], size: 30, anchor: 'đồng hồ 24 giờ treo tường' },
  { id: 'nhipngay',text: 'NHỊP NGÀY',         at: () => LP(PHG.clock24, -.245, -.105, .030).toArray(), lines: ['c43'], size: 30, anchor: 'đồng hồ 24 giờ treo tường' },
  { id: 'khoongan',text: 'KHÔNG ĂN',          at: () => A.plate(), lines: ['c44'], size: 30, anchor: 'đĩa rỗng' },
  { id: 'ngunong', text: 'HAI MƯỜI PHÚT',      at: () => LP(PHG.rec.paper, .181, 0, .60 * (1 - 20 / 45)).toArray(), lines: ['c47'], size: 30, anchor: 'máy ghi giấc ngủ' },
  { id: 'ngunhe',  text: 'PHẢN XẠ TỐT',      at: () => LP(PHG.board.lamps[7], 0, 0, 0).toArray(), lines: ['c48'], size: 28, anchor: 'bảng đo phản xạ' },
  { id: 'caffeine',text: 'CAFFEINE',         at: () => KHE.cafePos(1).toArray(), lines: ['c49'], size: 30, anchor: 'phân tử caffeine' },
];
for (const C of CARDS) Object.assign(C, cardWindow(C, V));

// độ sáng của đèn tập trung theo từng câu: nhát cận cảnh sáng mạnh, nhát toàn cảnh để nhẹ lại
const FOCUS = {
  c1: 1.0, c2: 2.2, c3: 2.0, c4: 1.2, c5: 1.8, c6: 2.0, c7: 1.1, c8: 2.0,
  c9: 2.4, c10: 2.0, c11: 2.2, c12: 1.6, c13: 2.2, c14: 1.4, c15: 1.8,
  c16: 2.4, c17: 2.4, c18: 1.1, c19: 1.0, c20: 1.8, c21: 2.2, c22: 1.4,
  c23: 2.4, c24: 2.2, c25: 2.4, c26: 2.0, c27: 1.8, c28: 1.8, c29: 2.0,
  c30: 2.4, c31: 1.6, c32: 2.2, c33: 2.4, c34: 1.8, c35: 2.2, c36: 2.4,  c37: 2.2, c38: 1.8, c39: 2.2, c40: 2.4, c41: 1.8, c42: 1.6, c43: 2.2,
  c44: 1.6, c45: 1.4, c46: 2.0, c47: 1.1, c48: 2.0, c49: 2.2, c50: 1.6,
  c51: 2.0, c52: 1.2,
};
// hạ sáng đèn phòng ở nhát nào cần góc xa thật tối (nhìn thấy khác hẳn nhát trước)
const DIM = { c4: .78, c9: .86, c13: .86, c14: .85, c22: .72, c34: .80, c45: .82, c52: .78 };

function shotAt(t) {
  for (let i = 0; i < SHOTS.length; i++) {
    if (t < MARK[i].t1 || i === SHOTS.length - 1) {
      const sh = SHOTS[i];
      const u = clamp((t - MARK[i].t0) / Math.max(.001, MARK[i].t1 - MARK[i].t0));
      const { p, l } = sh.pose(u);
      return { sh, i, u, pos: p, look: l };
    }
  }
}

// ── trạng thái theo thời gian ────────────────────────────────────────────
// giờ hiện trên mặt đồng hồ: hai giờ rưỡi buổi chiều lúc nằm xuống, và kim
// chạy thêm nửa tiếng ở hai câu kể cơn lờ đờ.
const HOUR0 = 14.5;
const hourAt = t => {
  const a = V.L['c21'].t0, b = V.L['c22'].t1;
  return HOUR0 + (t < a ? 0 : clamp((t - a) / (b - a)) * .5);
};
// phần giấc ngủ đã đi qua, tính theo phút trên mặt giấy (trục 0…45 phút)
const NAP_FULL = 45;
const napAt = (id, t) => id === 'c47' ? 20 / NAP_FULL : 1;

// bảng đo phản xạ: số đèn đã tắt, kim, đèn xanh — theo câu đang kể
const boardState = (id, t) => {
  if (id === 'c15') return [0, 0, 0];
  if (id === 'c16') { const k = clamp((t - V.L.c16.t0) / (V.L.c16.t1 - V.L.c16.t0)); return [.85 * k, .95 * k, 0]; }
  if (id === 'c17' || id === 'c25') return [.85, .95, 0];
  if (id === 'c20' || id === 'c48') return [.18, .16, 0];
  if (id === 'c23') return [.85, .95, clamp((t - V.L.c23.t0) / 1.4)];
  if (id === 'c24' || id === 'c26') return [.85, .95, 1];
  if (id === 'c41') return [0, 0, 0];
  return [.85, .95, 1];
};

// ── âm thanh: giọng kể, foley, không khí, nhạc ───────────────────────
const EV = [...V.ev];                        // mỗi câu kể là một sự kiện giọng
const ev = (type, t, extra = {}) => EV.push({ type, t: +t.toFixed(3), ...extra });
const amb = (kind, t0, t1) => ev('amb', t0, { kind, t1: +t1.toFixed(3) });

// không khí theo nơi chốn: phòng buổi chiều, không gian của não, khe tế bào
amb('room', 0, 25.40);
amb('low', 25.40, 37.64);
amb('room', 37.64, 72.88);
amb('low', 72.88, 75.70);
amb('hum', 75.70, 112.57);
amb('room', 112.57, 128.83);
amb('low', 128.83, 130.54);
amb('room', 130.54, 138.92);
amb('hum', 138.92, 143.26);
amb('room', 143.26, V.end);

// nhạc: mỗi chặng bắt đầu ở nhát của nó
for (const [t, cue] of [[0, 'A'], [11.30, 'B'], [30.64, 'C'], [42.03, 'D'],
  [56.89, 'E'], [72.88, 'F'], [126.19, 'G'], [V.end - 3, 'end']])
  ev('music', t, { cue });

// foley: chỉ khi vật thể thật sự kêu
ev('alarm', 2.95, { v: .45 });            // chuông báo thức reo lần đầu
ev('button', 4.60, { v: .40 });           // tay bấm chặn chuông
ev('cloth_rustle', 5.60, { v: .35 });     // ngồi dậy, chăn nhàu
ev('cup_set', 7.20, { v: .40 });          // tách cà phê đặt xuống
ev('paper_slide', 11.60, { v: .35 });     // mặt giấy chạy ra khỏi máy
ev('scanner', 14.10, { v: .28 });         // máy ghi đang quét
ev('paper_slide', 16.40, { v: .30 });
ev('blip_down', 43.60, { v: .30 });       // đèn trong bảng đo tắt dần
ev('blip_down', 44.10, { v: .30 });
ev('blip_down', 44.60, { v: .30 });
ev('blip_down', 45.10, { v: .30 });
ev('alarm', 22.70, { v: .50 });           // chuông cắt ngang giấc ngủ
ev('blip_up', 30.00, { v: .22 });         // tín hiệu trên nếp não bắt đầu bò
ev('tick', 57.20, { v: .30 });            // kim đồng hồ chạy
ev('tick', 57.60, { v: .30 });
ev('tick', 58.00, { v: .30 });
ev('tick', 58.40, { v: .30 });
ev('blip_up', 62.60, { v: .30 });         // đèn xanh sáng lên
ev('button', 64.30, { v: .45 });          // tay bấm nút đỏ
ev('blip_up', 79.70, { v: .30 });         // một phân tử rời đám
ev('blip_up', 87.80, { v: .28 });         // phân tử chạm khía
ev('blip_down', 88.40, { v: .26 });
ev('blip_up', 101.10, { v: .30 });        // phân tử mới xuất hiện
ev('whoosh_soft', 104.90, { v: .30 });    // phân tử mới bay vào khía
ev('blip_down', 109.10, { v: .30 });      // phân tử cũ bị đẩy ra
ev('cup_set', 112.90, { v: .35 });        // hai tách cà phê trên bàn
ev('cup_set', 113.40, { v: .35 });
ev('paper_slide', 130.70, { v: .30 });    // mặt giấy của giấc ngủ hai mươi phút
ev('blip_up', 139.20, { v: .30 });        // phân tử ngồi chặn trong khía
ev('cup_set', 143.60, { v: .35 });        // tách cà phê đặt xuống
ev('button', 145.00, { v: .40 });         // tay tắt chuông
ev('step_soft', 147.60, { v: .35 });      // bước chân ra khỏi giường

// ── mốc nhịp: mỗi câu một điểm trên khung ────────────────────────────────
for (const id of Object.keys(V.L)) {
  const t0 = V.L[id].t0, t1 = V.L[id].t1, tm = (t0 + t1) / 2;
  const s = shotAt(tm);
  const C = CARDS.find(c => c.lines.includes(id));
  const at = C ? (C.mark ?? (typeof C.at === 'function' ? C.at(tm) : C.at)) : s.look;
  camera.fov = s.sh.fov;
  camera.position.set(s.pos[0], s.pos[1], s.pos[2]);
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);      // không có bước này, điểm bám rơi sai chỗ trên màn hình
  const [x, y] = toScreen(new THREE.Vector3(...at), camera);
  markBeat(ev, id, t0, +(t1 - t0).toFixed(3), [+x.toFixed(1), +y.toFixed(1)]);
}

window.DUR = V.end;
window.EV = EV;

// ── bàn tay: chỉ có ở những câu cần nó ──────────────────────────────────
// ngón tay chỉ theo +x của nhóm, cẳng tay trồi về -x.
function handFor(id, t) {
  const h = PHG.hand;
  h.visible = false;
  if (id === 'c2') {                       // với ra chặn chuông
    h.visible = true;
    h.position.set(-1.37, .84, .56);
    h.rotation.set(0, 0, .30);
    h.pose(.30, .45);
  } else if (id === 'c3') {                // cầm tách cà phê, hạ xuống
    h.visible = true;
    const k = clamp((t - V.L.c3.t0) / (V.L.c3.t1 - V.L.c3.t0));
    h.position.set(.03, .80 - k * .10, .70);
    h.rotation.set(0, .3, -1.35);
    h.pose(.85, .06);
  } else if (id === 'c24') {               // bấm nút đỏ trên bảng đo
    h.visible = true;
    const k = clamp((t - V.L.c24.t0) / 1.1);
    h.position.set(-.78 + k * .05, .70, 1.10 + k * .02);
    h.rotation.set(0, -.50, 0);
    h.pose(.75, .05);
  } else if (id === 'c50') {               // đặt tay xuống bàn
    h.visible = true;
    h.position.set(-.18, .58, .78);
    h.rotation.set(0, .5, 0);
    h.pose(.30, .45);
  } else if (id === 'c51') {               // tay tắt chuông
    h.visible = true;
    const k = clamp((t - V.L.c51.t0) / 1.4);
    h.position.set(-1.37 + k * .30, .84 - k * .05, .56);
    h.rotation.set(0, 0, .30);
    h.pose(.50 - k * .30, .35);
  }
}

window.render = t => {
  const s = shotAt(t);
  const sh = s.sh, u = s.u;
  const id = sh.ids[0];
  camera.fov = sh.fov;
  camera.position.set(s.pos[0], s.pos[1], s.pos[2]);
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();

  if (sh.s === 'N1') {
    // đèn tập trung đặt vào điểm nhìn: vùng sáng nhất của khung luôn là thứ đang kể
    const fx = FOCUS[id] ?? 1.0;
    PHG.spot.target.position.set(s.look[0], s.look[1], s.look[2]);
    // đèn lệch sang bên phải của máy: ánh sáng xiên để nếp vải và mép vật đọc ra,
    // không phải ánh sáng thẳng vào mặt làm vật thành một mảng bìa phẳng
    const fwd = new THREE.Vector3(s.look[0] - s.pos[0], 0, s.look[2] - s.pos[2]).normalize();
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
    PHG.spot.position.set(
      s.look[0] + right.x * .85 + fwd.x * .25,
      s.look[1] + 1.35,
      s.look[2] + right.z * .85 + fwd.z * .25);
    PHG.setHour(hourAt(t));
    // đồng hồ treo tường chỉ được đèn riêng khi máy quay nhìn nó: không có
    // đèn thì nó là một đĩa tím phẳng, không có bóng, không đọc ra là giấy
    PHG.clockLit(id === 'c42' ? clamp((t - V.L.c42.t0) / 1.4) : id === 'c43' ? 1 : 0);
    // mặt giấy đồ thị: nắng cửa sổ đổ bóng thân máy ngang qua dải giấy, không
    // có đèn riêng thì đồ thị không đọc được
    PHG.paperLit(id === 'c7' || id === 'c18' || id === 'c19' || id === 'c47' ? 1 : 0);
    // phút đang đo trên mặt giấy: mỗi câu một mốc, và đồ thị vẽ tới đúng mốc đó
    PHG.rec.setMinute(id === 'c7' ? 15 : id === 'c18' || id === 'c19' ? 30 : id === 'c47' ? 20 : 45);
    PHG.ring(t, (id === 'c2' && t > V.L.c2.t0) || (id === 'c9' && t > V.L.c9.t0) ? 1 : 0);
    const [lamps, needle, green] = boardState(id, t);
    PHG.measure(lamps, needle, green);
    // bảng thứ hai (thí nghiệm cà phê): người uống cà phê thì kim đi thẳng,
    // người kia thì kim tụt
    if (id === 'c41') PHG.measure2(.85, .95, 0); else PHG.measure2(0, 0, 0);
    handFor(id, t);
    PHG.update(t, { dim: DIM[id] ?? 1, focus: fx });
  } else if (sh.s === 'N2') {
    // sóng chậm: cực to ở đầu giấc ngủ rồi giảm dần
    const k8 = id === 'c8' ? 1 - .65 * clamp((t - V.L.c8.t0) / (V.L.c8.t1 - V.L.c8.t0)) : .35;
    MAO.wave(t, k8);
    // tín hiệu trên nếp não: não chưa kịp chạy lại thì tín hiệu vẫn bò
    const pk = id === 'c10' ? .18 + .16 * clamp((t - V.L.c10.t0) / (V.L.c10.t1 - V.L.c10.t0))
      : id === 'c11' ? .34
      : id === 'c51' ? .30
      : 0;
    MAO.pulse(t, pk);
    // bản bên trái sáng lên khi các nghiên cứu chia làm đôi
    const lk = id === 'c13' ? clamp((t - V.L.c13.t0) / 1.6) : id === 'c12' ? 0 : 1;
    MAO.leftLit(lk);
    MAO.darkRight(id === 'c13' ? lk : 0);
    MAO.update(t, { dim: DIM[id] ?? 1, focus: FOCUS[id] ?? 1 });
  } else if (sh.s === 'N3') {
    // đám phân tử: người thức càng lâu thì càng nhiều.
    // Nhát cận chỉ kể một phân tử thì đám trống, để nhìn thấy rõ phân tử đó.
    const crowd = id === 'c29' ? .18 : id === 'c31' ? .35 + .55 * clamp((t - V.L.c31.t0) / (V.L.c31.t1 - V.L.c31.t0))
      : id === 'c34' ? 1 : id === 'c38' ? .9 : id === 'c28' ? .05
      : id === 'c32' ? .20 : id === 'c30' || id === 'c33' || id === 'c37' || id === 'c39' || id === 'c40' || id === 'c49' ? 0
      : .55;
    KHE.crowd(t, crowd, id === 'c34' ? 1.9 : id === 'c38' ? 1.6 : id === 'c31' ? 1.4
      : id === 'c29' ? 1.3 : id === 'c28' ? 1.2 : 1);
    // phân tử bám vào túi: bay tới (c32), ngồi vào (c33), bị đẩy ra (c40).
    // Ở c39 adenosine vẫn còn ngồi trong túi — cà phê mới chen vào đúng chỗ đó.
    const dk = id === 'c32' ? .35 * clamp((t - V.L.c32.t0) / (V.L.c32.t1 - V.L.c32.t0))
      : id === 'c33' ? .35 + .65 * clamp((t - V.L.c33.t0) / (V.L.c33.t1 - V.L.c33.t0))
      : id === 'c40' ? 1 : id === 'c39' ? 1 : 0;
    KHE.docking(t, dk);
    // adenosine bị đẩy ra khỏi khía: chỉ hai nhát này mới đẩy, nhát khác giữ
    // nguyên chỗ đứng của phân tử (nếu gọi luôn thì phân tử bị nhảy vào khía)
    if (id === 'c40') KHE.pushed(t, clamp((t - V.L.c40.t0) / 1.4));
    else if (id === 'c49') KHE.pushed(t, 1);
    // phân tử caffeine: xuất hiện (c37), bay vào khía (c39), ngồi chặn (c49)
    const cf = id === 'c37' ? .18 * clamp((t - V.L.c37.t0) / (V.L.c37.t1 - V.L.c37.t0))
      : id === 'c39' ? .18 + .82 * clamp((t - V.L.c39.t0) / (V.L.c39.t1 - V.L.c39.t0))
      : id === 'c49' ? 1 : id === 'c40' ? 1 : 0;
    KHE.caffeine(t, cf);
    // tín hiệu trên sợi trục: lý thuyết thôi, còn yếu
    KHE.axon(t, id === 'c35' ? .22 : id === 'c36' ? .28 : id === 'c49' ? .8 : 0);
    KHE.update(t, { dim: DIM[id] ?? 1, focus: FOCUS[id] ?? 1 });
  }

  const set2 = setOf[sh.s];
  F.frame(set2.scene, {
    t, thick: sh.s === 'N2' ? 2.6 : sh.s === 'N3' ? 3.4 : 3.6,
    ref: sh.s === 'N2' ? .5 : sh.s === 'N3' ? 1.2 : 1.6,
    key: set2.key,
    fade: Math.min(1, t / .3 + .2, (window.DUR - t) / .4),
    // phụ đề khắc vào hình: lời của câu đang nói, theo đúng mốc thời gian của giọng đã thu
    // và các thẻ thuật ngữ: số đo đang hiện trên vật đo phải đọc được ngay
    overlay: (g, tt) => {
      const out = [];
      const s2 = V.sub(tt);
      if (s2) subtitle(g, s2);     // phụ đề: độ dài giữ do .srt quyết định, không tính vào TEXTS
      for (const C of CARDS) {
        const size = C.size ?? 40;
        g.save(); g.font = `900 ${size}px "Be Vietnam Pro"`;
        const bw = g.measureText(C.text).width + size, bh = size * 1.55;
        g.restore();
        const [ax, ay] = toScreen(new THREE.Vector3(...(typeof C.at === 'function' ? C.at(tt) : C.at)), camera);
        // đuôi thẻ vẽ ở góc dưới-trái, cách mép thẻ một khoảng cố định:
        // đặt thẻ lệch lên-trên-phải vật thì đuôi chỉ đúng vào vật.
        let x = ax + bw / 2 + 26 + (C.dx || 0), y = ay - bh / 2 - 44 + (C.dy || 0);
        x = clamp(x, bw / 2 + 30, 1916 - bw / 2);        // trọn trong khung
        y = clamp(y, bh / 2 + 8, 876 - bh / 2 - 48);    // trọn trên dải phụ đề
        const b = label(g, C.text, x, y, tt, C.t0, C.t1, { id: C.id, size });
        if (b) out.push(b);
      }
      return out;
    },
  });
};

// chẩn đoán: nhát đang quay, vị trí máy, và mốc thời gian thật của các câu
window.WORLD = () => {
  const wp = o => { const v = new THREE.Vector3(); o.getWorldPosition(v); return v.toArray().map(n => +n.toFixed(3)); };
  return {
    clock: wp(PHG.clock), rec: wp(PHG.rec), board: wp(PHG.board), board2: wp(PHG.board2),
    mug: wp(PHG.mug), mug2: wp(PHG.mug2), bed: wp(PHG.bed), clock24: wp(PHG.clock24),
    lamps7: wp(PHG.board.lamps[7]), green: wp(PHG.board.green), button: wp(PHG.board.button),
    paper: wp(PHG.rec.paper), face: wp(PHG.clock.face),
  };
};
window.DIAG = t => {
  const s = shotAt(t);
  return {
    shot: s.i + 1, ids: s.sh.ids, u: +s.u.toFixed(3),
    pos: s.pos.map(v => +v.toFixed(3)), look: s.look.map(v => +v.toFixed(3)),
    L: Object.fromEntries(Object.entries(V.L).slice(0, 4).map(([k, v]) => [k, [+v.t0.toFixed(3), +v.t1.toFixed(3)]])),
    mark: MARK.map(m => [+m.t0.toFixed(2), +m.t1.toFixed(2)]),
  };
};

window.TEXTS = t => { window.render(t); return F.texts(); };
await document.fonts.load('900 54px "Be Vietnam Pro"');
window.render(0);
window.READY = true;
