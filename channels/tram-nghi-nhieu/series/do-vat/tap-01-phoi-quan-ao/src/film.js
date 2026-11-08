// Vì sao phơi quần áo cần gió? — trang phim: 26 nhát theo shot list của TREATMENT.md.
// Mỗi nhát bám vào câu nó mang (V.L[id].t0/t1) nên nhịp quay đúng với lời kể.
import * as THREE from 'three';
import { film, label, subtitle, toScreen } from '../../../../rig/render.js';
import { PAL, keys, seg, ss, eio, eo, lerp, clamp } from '../../../../rig/kit.js';
import { build } from './timeline.js';
import { loadVoice } from '../../../../rig/voice.js';
import { buildBalcony, buildFabric, buildWater } from './set.js';

const V = await loadVoice(build);
const F = film({ fov: 38 }), camera = F.camera;

const BAL = buildBalcony();
const FAB = buildFabric();
const WAT = buildWater();

const setOf = { N1: BAL, N4: BAL, N2: FAB, N3: WAT };

// ── 60 nhát: mỗi câu một hình ────────────────────────────────────────────
// Máy cắt theo nhịp lời kể: mỗi câu một bố cục riêng (rộng – trung – cận – siêu cận xen kẽ),
// không nhát nào kéo dài quá một câu, để mỗi câu đều có hình của riêng nó.
// sh(set, câu, tiêu cự, vị trí máy, điểm nhìn, đẩy máy trong nhát)
const sh = (s, id, fov, p, l, d = [0, 0, 0]) => ({
  s, ids: [id], fov,
  pose: u => ({ p: [p[0] + d[0] * ss(u), p[1] + d[1] * ss(u), p[2] + d[2] * ss(u)], l }),
});

const SHOTS = [
  // ── N1 · hiên phơi: mở đầu đời thường ──
  sh('N1', 'c1', 40, [-1.40, 1.55, 3.20], [-1.25, .70, .85], [0, 0, 0]),   // áo ướt trên dây, bồn chậu trọn khung
  sh('N1', 'c2', 34, [-.95, 1.06, 1.78], [-1.25, .78, .85], [0, 0, -.02]),       // nửa dưới tấm áo: vệt ẩm, mép vải, giọt bám, bồn chậu bên dưới

  // ── N4 · phòng kín: cái thí nghiệm nhỏ ──
  sh('N4', 'c3', 38, [-.72, 1.34, -2.62], [-1.46, 1.14, -3.30], [-.06, -.02, -.06]), // quạt
  sh('N4', 'c4', 46, [-1.80, 1.50, -4.92], [-1.80, 1.42, -5.58], [0, 0, -.02]),   // hai cái áo giống nhau treo cạnh nhau
  sh('N4', 'c5', 46, [-2.40, 1.86, -1.95], [-.30, 1.42, -4.15], [.02, 0, -.04]),     // góc tối: quạt ở góc trái, một áo trước quạt, một áo ở góc xa
  sh('N4', 'c6', 30, [-.30, 1.24, -2.45], [-1.44, 1.15, -3.28], [-.02, 0, -.04]),  // miệng quạt: chỗ nào có quạt mới có gió
  sh('N4', 'c7', 40, [.42, 1.46, -2.30], [.80, 1.28, -4.00], [.05, 0, -.06]),      // hai áo: một nhạt, một sẫm

  // ── N2 · trong sợi vải ──
  sh('N2', 'c8', 12, [.10, .06, .24], [0, .00, .00], [.02, 0, -.03]),        // nước còn nằm trong khe sợi
  sh('N2', 'c9', 12, [-.02, .102, .200], [-.02, .100, .15], [0, -.005, -.02]),  // giọt nước bám trên sợi
  sh('N2', 'c10', 30, [.06, .10, .46], [.205, -.010, -.085], [-.02, -.02, -.02]),  // tấm vải đan: máy lùi xa để thấy cả tấm vải
  sh('N2', 'c11', 24, [.004, .016, .160], [.032, .005, .000], [0, .004, 0]),   // khe nước giữa hai sợi: nhìn chếch xuống khe
  sh('N2', 'c12', 24, [.055, .086, .175], [.040, .078, .010], [-.004, 0, -.012]), // rìa sợi: vệt nước bám trong xơ

  // ── N3 · mặt nước ──
  sh('N3', 'c13', 46, [.10, .16, .70], [0, .00, -.30], [-.03, -.02, -.04]),     // mặt nước là một dải sáng nằm ngang
  sh('N3', 'c14', 42, [-.26, .012, .40], [-.02, .11, -.45], [.10, 0, -.05]), // chân trời thấp: mặt nước là một vệt sáng
  sh('N3', 'c15', 26, [.26, .09, .40], [.00, .00, -.30], [-.03, 0, -.04]),    // phân tử nhảy lung tung trên mặt
  sh('N3', 'c16', 18, [.05, .06, .14], [.00, .02, .01], [0, 0, 0]),      // cận: một phân tử rời cụm
  sh('N3', 'c17', 30, [.26, .10, .40], [.02, .09, .00], [-.02, .02, -.04]),  // một phân tử bứt ra ngoài
  sh('N3', 'c18', 38, [.20, .14, .40], [-.02, .02, -.26], [.04, 0, -.06]),    // phần nước còn lại mát đi

  // ── N4 · vải lấy nhiệt của chính nó ──
  sh('N4', 'c19', 46, [1.35, 1.46, -2.40], [.42, 1.08, -3.30], [-.10, -.02, -.06]),  // tấm áo ướt trong phòng
  sh('N4', 'c20', 28, [-.35, 1.46, -2.82], [.12, 1.26, -3.18], [.02, -.01, -.04]),   // bàn tay chạm vào vải ướt
  sh('N4', 'c21', 36, [.78, 1.06, -2.70], [.44, 1.30, -3.26], [-.04, .02, -.04]),  // áo trong luồng gió, nhiệt đi ra

  // ── N4 · lớp hơi ẩm bám mặt áo ──
  sh('N4', 'c22', 26, [.95, 1.02, -2.85], [.50, 1.28, -3.26], [.02, .02, -.04]),  // lớp hơi mỏng trên mặt áo
  sh('N4', 'c23', 32, [.55, 1.26, -2.92], [.44, 1.56, -3.32], [0, 0, -.03]),   // khoảng không trên mặt áo: hơi nước đi được
  sh('N4', 'c24', 30, [.78, 1.30, -2.62], [.44, 1.38, -3.24], [0, -.01, -.02]),  // cận cổ áo từ bên phải: vành cổ, lỗ cổ tối, vai, lớp hơi bám sát mặt vải
  sh('N4', 'c25', 42, [.52, .50, -2.25], [.42, .95, -3.28], [0, 0, -.02]),  // máy THẤP hơn mép áo và ngẩng lên: lấy cả mép + lớp hơi + ba giọt bám
  sh('N4', 'c26', 36, [.62, .62, -2.76], [.44, 1.05, -3.26], [0, 0, -.03]),    // nhìn lên từ dưới: lớp hơi ôm vải, hơi nước bay lên chậm

  // ── N4 · gió quét lớp ẩm ──
  sh('N4', 'c27', 46, [-.95, 1.15, -2.70], [-1.30, 1.00, -3.28], [-.02, 0, -.03]),  // quạt và mép áo: gió quét lớp ẩm
  sh('N4', 'c28', 28, [1.10, 1.34, -2.55], [.55, 1.30, -3.22], [.02, 0, -.02]),  // dọc theo đường gió tới tấm áo
  sh('N4', 'c29', 42, [.75, 1.56, -4.85], [2.28, 1.22, -5.08], [0, 0, -.04]),     // gió trượt qua mà không sấy nước
  sh('N4', 'c30', 26, [1.55, 1.22, -2.78], [.85, 1.18, -3.18], [.02, 0, -.02]),   // hơi nước bị gió chở đi
  sh('N4', 'c31', 56, [.85, 1.34, -2.05], [.05, 1.15, -3.60], [.02, 0, -.03]),  // quạt ở trái, mặt quạt quay về phía máy, mép áo A ở giữa
  sh('N4', 'c32', 44, [.30, .80, -2.20], [.10, 1.30, -3.30], [-.04, .02, -.05]),  // quạt ngược sáng: gió quét sạch, nước bốc hơi nhanh hơn

  // ── N4 · đo được ──
  sh('N4', 'c33', 52, [-.20, 1.55, -2.40], [-1.40, 1.10, -5.20], [.02, -.01, -.05]), // hai cái cân, hai áo, quạt nhỏ
  sh('N4', 'c34', 18, [-1.80, 1.10, -4.35], [-1.80, .86, -5.60], [-.01, -.01, -.03]), // hai cái kim lệch nhau
  sh('N4', 'c35', 40, [.30, 1.25, -5.40], [1.75, .95, -6.10], [-.02, -.01, -.02]), // quạt nhỏ ở cuối bàn
  sh('N4', 'c36', 36, [1.10, 1.30, -5.35], [1.72, 1.00, -6.10], [.02, 0, -.03]),  // hai mặt kính, hai giọt nước, quạt
  sh('N4', 'c37', 30, [1.85, 1.08, -5.72], [1.42, 1.05, -6.18], [.01, 0, -.01]),   // giọt sau vách: không có gió

  // ── N1 · ba thứ quyết định tốc độ ──
  sh('N1', 'c38', 46, [-1.55, 1.85, 1.35], [-1.10, 1.86, -.80], [0, 0, -.03]),  // ba thứ: nhiệt kế, ẩm kế, đàn áo
  sh('N1', 'c39', 15, [-2.02, 1.94, -.42], [-2.16, 1.95, -.93], [-.01, 0, -.04]),    // nhiệt kế và ẩm kế cùng khung
  sh('N1', 'c40', 34, [-.45, 1.80, .35], [-.95, 1.93, -.72], [0, -.01, -.03]),      // ba cái áo chồng, nhìn ngang
  sh('N1', 'c41', 26, [-1.36, 1.96, -.46], [-1.50, 1.95, -.95], [0, 0, -.02]),      // ẩm kế: hai mươi gam
  sh('N1', 'c42', 30, [-1.12, 1.80, -.34], [-1.50, 1.94, -.92], [0, 0, -.02]),     // cửa sổ số: hai mươi gam trên mỗi kilogam
  sh('N1', 'c43', 16, [-1.36, 1.82, -.60], [-1.49, 1.885, -.94], [0, 0, -.02]),    // vạch đỏ ở cuối thang: trần của nó
  sh('N1', 'c44', 17, [-2.16, 1.94, -.62], [-2.26, 1.94, -.95], [-.01, 0, -.02]),  // cột thuỷ ngữ dâng lên
  sh('N1', 'c45', 34, [-2.30, 2.00, -.10], [-1.95, 1.94, -.92], [0, 0, -.03]),     // nhiệt kế và ẩm kế cùng khung
  sh('N1', 'c46', 18, [-1.32, 1.98, -.48], [-1.50, 1.95, -.93], [0, 0, -.02]),     // kim ẩm kế ở chín mươi phần trăm

  // ── N1 · diện tích phơi, độ dày của vải ──
  sh('N1', 'c47', 40, [-.20, 1.35, 2.30], [-1.25, 1.05, .82], [-.04, -.02, -.06]), // lớp hơi mờ quanh áo ướt ngoài hiên
  sh('N1', 'c48', 40, [1.45, 1.80, 1.60], [1.00, 1.45, -.72], [0, -.01, -.04]),     // cái áo phơi một mặt: nửa này còn ẩm
  sh('N1', 'c49', 46, [.20, 1.74, 2.58], [.20, .02, 1.31], [-.01, -.01, -.03]),  // nhìn xuống: cái áo úp và cái áo trải rộng nằm cạnh nhau trên sàn cùng khung
  sh('N1', 'c50', 52, [.45, 1.32, 3.20], [.45, 1.30, .85], [0, 0, 0]),   // máy TRÊN thanh lan can: quần dày và áo thun mỏng cùng đọc được
  { s: 'N1', ids: ['c51'], fov: 30,                                            // giọt tụ ở mép khăn rồi rơi
    pose: u => {
      const t0 = V.L['c51'].t0, t1 = V.L['c51'].t1;
      const t = t0 + u * (t1 - t0);
      const tf = V.L['c51'].t0 + 1.3;                 // lúc giọt bắt đầu rơi khỏi mép
      const f = ss(clamp((t - tf) / 1.7));
      return { p: [lerp(.72, .66, u), lerp(.76, .72, u), lerp(1.42, 1.36, u)],
               l: [.25, lerp(.768, .7270, f), .862] };
    } },

  // ── N4 · không khí đứng yên, và cái mát của gió ──
  sh('N4', 'c52', 38, [1.18, 1.56, -4.28], [2.22, 1.24, -5.05], [-.03, -.01, -.05]), // lớp hơi quay lại bám quanh áo
  sh('N4', 'c53', 54, [.60, 1.70, -1.55], [.70, 1.25, -3.30], [-.10, -.03, -.08]),   // toàn cảnh phòng, quạt đã tắt
  sh('N4', 'c54', 44, [.20, 1.28, -2.75], [-.90, 1.10, -3.25], [.06, 0, -.06]),    // đầu quạt và bàn tay đưa vào luồng gió
  sh('N4', 'c55', 32, [-.72, 1.28, -2.76], [-.52, 1.03, -3.27], [.03, -.01, -.03]), // mồ hôi bám trên da bị gió cuốn

  // ── N1 · lời khuyên ──
  sh('N1', 'c56', 48, [-1.10, 1.75, 2.40], [-.20, 1.05, .85], [.16, -.02, -.16]),  // dây phơi: áo đã nhạt màu
  sh('N1', 'c57', 40, [-.60, 1.30, 2.00], [-1.20, .95, .85], [-.02, -.01, -.04]),  // áo đã khô
  sh('N1', 'c58', 38, [2.05, 1.52, 1.30], [-.40, 1.30, .85], [-.06, -.02, -.08]),    // gió có chỗ để đi
  sh('N1', 'c59', 34, [2.60, 1.55, 2.30], [1.86, 1.25, .85], [-.03, 0, -.04]),       // túi nylon vẫy: nơi thoáng gió
  sh('N1', 'c60', 30, [-.50, 1.86, 2.24], [-.50, .02, 1.72], [-.03, -.01, -.05]),  // nhìn gần thẳng xuống: áo phơi rộng, cả hai mặt phơi ra
];

// Trong ruột vải (N2), mỗi nhất chỉ giữ MỘT vật chính. Lưới sợi nền ('aux')
// ẩn đi ở các nhất siêu cận, để khung đọc được đúng ý của câu thay vì một mớ sợi.
const N2VIS = {
  c8:  { aux: false, hero: true,  film: true,  fuzz: false, cloth: false, drop: false }, // nước còn nằm trong khe sợi
  c9:  { aux: true,  hero: true,  film: false, fuzz: false, cloth: false, drop: true },  // giọt nước bám trên sợi
  c10: { aux: false, hero: false, film: false, fuzz: false, cloth: true,  drop: false }, // tấm vải đan
  c11: { aux: false, hero: true,  film: true,  fuzz: false, cloth: false, drop: false }, // khe nước giữa hai sợi
  c12: { aux: false, hero: true,  film: false, fuzz: true,  cloth: false, drop: false }, // rìa sợi, vệt nước trong xơ
};

// mốc thời gian của từng nhát: nhát i bắt đầu khi câu đầu bắt đầu, kết thúc khi câu cuối kết thúc
const MARK = SHOTS.map(sh => ({
  t0: V.L[sh.ids[0]].t0,
  t1: V.L[sh.ids[sh.ids.length - 1]].t1,
}));

// ── thẻ thuật ngữ: tên và con số đang hiện trên vật đo ──────────────────
// Mỗi thẻ bám vào một vật trong khung (toạ độ thế giới), tự đặt lệch lên
// trên-phải vật đó để đuôi thẻ chỉ đúng vào vật, và luôn nằm trọn trong
// khung, trên dải phụ đề. Thẻ hiện từ lúc máy cắt sang nhát của câu, nên
// đọc được trọn vẹn trước khi câu kế tiếp cất tiếng.
const CARDS = [
  { id: 'doao',      text: 'QUẦN ÁO ƯỚT',    at: [-1.25, 1.28, .85],    lines: ['c1'],            size: 32 },
  { id: 'doquat',    text: 'QUẠT',          at: [-1.50, 1.16, -3.30],  lines: ['c3'],            size: 34 },
  { id: 'do2ao',     text: '2 ÁO',          at: [-1.80, 1.50, -5.56],  lines: ['c4'],            size: 30 },
  { id: 'doquat2',   text: 'CHỖ NÀO CÓ QUẠT', at: [-1.44, 1.16, -3.30], lines: ['c6'],           size: 30 },
  { id: 'dosoi',     text: 'KHE GIỮA SỢI',  at: [0, .004, .004],        lines: ['c11'],           size: 30 },
  { id: 'do1pt',     text: '1 PHÂN TỬ',     at: [0, .02, .01],          lines: ['c15', 'c16'],    size: 34 },
  { id: 'dohoi',     text: 'HƠI NƯỚC',      at: [.02, .10, .02],        lines: ['c17', 'c18'],    size: 32 },
  { id: 'do2kj',     text: '2 kJ',          at: [.42, 1.18, -3.26],     lines: ['c21'],           size: 34 },
  { id: 'dolop',     text: 'LỚP HƠI ẨM',    at: [.42, 1.20, -3.24],     lines: ['c22', 'c23'],    size: 30 },
  { id: 'doBao',     text: 'BAO HÒA',       at: [.40, .64, -3.26],      lines: ['c25'],           size: 32 },
  { id: 'doquet',    text: 'BỊ QUÉT ĐI',    at: [-1.44, 1.16, -3.30],   lines: ['c27'],           size: 32 },
  { id: 'dochoi',    text: 'HƠI NƯỚC BỊ CHỞ ĐI', at: [.85, 1.18, -3.18], lines: ['c30', 'c31'],   size: 30 },
  { id: 'do288',     text: '288 g',         at: [-2.04, .84, -5.55],    lines: ['c33', 'c34'],    size: 34 },
  { id: 'do88',      text: '88 g',          at: [-1.56, .84, -5.55],    lines: ['c33', 'c34'],    size: 34 },
  { id: 'dogiot',    text: 'HAI GIỌT NƯỚC', at: [1.42, 1.02, -6.12],    lines: ['c35', 'c36'],    size: 30 },
  { id: 'donhiet',   text: 'NHIỆT ĐỘ',      at: [-2.25, 1.95, -.97],    lines: ['c39'],           size: 30 },
  { id: 'do3ao',     text: '3 ÁO',          at: [-.95, 1.80, -.72],     lines: ['c40'],           size: 30 },
  { id: 'do20',      text: '20 g/kg',       at: [-1.47, 1.94, -.94],    lines: ['c41', 'c42'],    size: 34 },
  { id: 'do30',      text: '30 °C',         at: [-2.258, 1.930, -.95],  lines: ['c45'],           size: 34 },
  { id: 'do90',      text: '90 %',          at: [-1.47, 1.94, -.94],    lines: ['c46'],           size: 34 },
  { id: 'domot',     text: 'PHƠI MỘT MẶT',  at: [1.00, 1.86, -.72],     lines: ['c48'],           size: 30 },
  { id: 'doap',      text: 'ÁO ÚP',         at: [.85, .10, 1.26],      lines: ['c49'],           size: 32 },
  { id: 'doquan',    text: 'QUẦN DÀY',      at: [-.55, 1.28, .85],     lines: ['c50'],           size: 30 },
  { id: 'domong',    text: 'ÁO MỎNG',       at: [1.50, 1.36, .85],      lines: ['c50'],           size: 30 },
  { id: 'doquay',    text: 'QUAY LẠI BÁM ÁO', at: [2.25, 1.34, -5.05],  lines: ['c52', 'c53'],    size: 30 },
  { id: 'domo',      text: 'MỒ HÔI',        at: [-.48, 1.08, -3.30],    lines: ['c54', 'c55'],    size: 32 },
  { id: 'dodi',      text: 'NƯỚC PHẢI ĐI ĐƯỢC', at: [-1.25, 1.30, .85], lines: ['c56', 'c57'],    size: 30 },
  { id: 'dothoang',  text: 'CHỖ THOÁNG GIÓ', at: [1.86, 1.44, .85],     lines: ['c58', 'c59'],    size: 30 },
  { id: 'dohaimat',  text: 'CẢ HAI MẶT',    at: [-.45, .05, 1.40],    lines: ['c60'],           size: 30 },
];
// Thẻ hiện từ lúc máy cắt sang nhát của câu (tức từ lúc câu trước kết thúc)
// đến lúc câu của nó kết thúc: luôn đủ lâu để đọc trọn.
for (const C of CARDS) {
  const n0 = +C.lines[0].slice(1), n1 = +C.lines[C.lines.length - 1].slice(1);
  C.t0 = n0 > 1 ? V.L['c' + (n0 - 1)].t1 : V.L[C.lines[0]].t0;
  C.t1 = V.L['c' + n1].t1;
}

// độ sáng của đèn tập trung theo từng câu: nhát cận cảnh sáng mạnh, nhát toàn cảnh để nhẹ lại
const FOCUS = {
  c1: 1.1, c2: .8, c3: 1.1, c4: 1.6, c5: 1.8, c6: 1.4, c7: 2.4,
  c8: 1.6, c9: 2.2, c10: 1.8, c11: 2.0, c12: 2.0, c13: 2.0, c14: 2.0,
  c15: 2.0, c16: 2.0, c17: 2.0, c18: 1.9, c19: 1.6, c20: 1.4, c21: 2.4,
  c22: 1.1, c23: 1.6, c24: 1.8, c25: 1.7, c26: 1.8, c27: 2.2, c28: 2.0,
  c29: 1.9, c30: 2.0, c31: 1.9, c32: 2.6, c33: 2.4, c34: 1.3, c35: .9, c36: 1.8, c37: 1.8,
  c38: 1.7, c39: 1.4, c40: 1.4, c41: 1.7, c42: 1.8, c43: 1.7,
  c44: 1.8, c45: 1.8, c46: 2.6, c47: 1.8, c48: 1.5, c49: 2.2, c50: 1.8, c51: 1.8,
  c52: 1.7, c53: .6, c54: 2.2, c55: 1.8, c56: .9, c57: .9, c58: 1.7,
  c59: 1.6, c60: 1.4,
};
// hạ sáng đèn phòng ở nhát nào cần góc xa thật tối (nhìn thấy khác hẳn nhát trước)
const DIM = { c4: .85, c5: .38, c7: .45, c19: .55, c21: .55, c27: .45, c31: .55, c32: .45, c33: 1.15, c49: .85, c29: .88, c52: .85, c53: .34, c35: .35, c37: .40 };

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

// ── trạng thái theo thời gian: vải ướt → khô, quạt, giọt, lớp khí ẩm ──
const T = {};
for (const id of Object.keys(V.L)) T[id] = V.L[id].t0;
const w = (id, word) => { try { return V.w(id, word); } catch { return V.L[id].t0; } };

// ── âm thanh: giọng kể, foley, không khí, nhạc ───────────────────────
const EV = [...V.ev];                        // mỗi câu kể là một sự kiện giọng
const ev = (type, t, extra = {}) => EV.push({ type, t: +t.toFixed(3), ...extra });
const amb = (kind, t0, t1) => ev('amb', t0, { kind, t1: +t1.toFixed(3) });

// không khí theo nơi chốn: hiên lúc bình minh, phòng kín, trong sợi, trên mặt nước
amb('dawn', 0, 9.6);
amb('room', 9.6, 27.6);
amb('hum', 27.6, 40.0);
amb('low', 40.0, 56.1);
amb('room', 56.1, 107.5);
amb('dawn', 107.5, 149.3);
amb('room', 149.3, 161.1);
amb('dawn', 161.1, 173.6);

// nhạc: mỗi chặng bắt đầu ở nhát của nó
for (const [t, cue] of [[0, 'A'], [9.9, 'B'], [27.8, 'C'], [56.2, 'D'], [107.6, 'E'], [149.4, 'F'], [161.2, 'G'], [172.2, 'end']])
  ev('music', t, { cue });

// foley: chỉ khi vật thể thật sự kêu
ev('cloth_rustle', 3.2, { v: .30 });        // áo ướt đung đưa ngoài hiên
ev('switch', 9.55, { v: .50 });             // bật quạt
ev('whoosh', 9.90, { v: .35 });             // luồng gió đầu tiên
ev('blip_down', 29.80, { v: .30 });         // giọt nước trên sợi nhỏ dần
ev('blip_up', 35.60, { v: .25 });           // hạt hơi nước bốc lên
ev('blip_up', 44.70, { v: .30 });           // một phân tử rời mặt nước
ev('cloth_rustle', 56.50, { v: .35 });      // bàn tay tới gần tấm áo
ev('impact_soft', 57.60, { v: .30 });       // tay chạm vào vải ướt
ev('whoosh_soft', 65.70, { v: .25 });       // không khí trượt trên vải
ev('whoosh', 70.50, { v: .50 });            // gió thổi tới, quét lớp ẩm
ev('whoosh_soft', 86.90, { v: .35 });       // hơi nước bị gió chở đi
ev('whoosh_hard', 89.90, { v: .45 });       // gió mạnh hơn
ev('whoosh_soft', 99.90, { v: .30 });       // quạt nhỏ thổi qua mặt kính
ev('blip_up', 107.70, { v: .30 });          // nhiệt kế chạy
ev('blip_up', 128.60, { v: .30 });          // ẩm kế chạy tới chín mươi phần trăm
ev('cloth_rustle', 136.70, { v: .40 });     // đàn áo chồng
ev('cloth_rustle', 140.50, { v: .35 });     // vải trên dây còn đung đưa trong gió (cái áo úp nằm tĩnh trên sàn)
ev('impact_soft', 148.40, { v: .25 });      // giọt nước rơi xuống sàn
ev('switch', 149.30, { v: .50 });           // tắt quạt
ev('switch', 155.60, { v: .45 });           // bật lại quạt cho bàn tay
ev('whoosh', 155.80, { v: .40 });
ev('cloth_rustle', 161.30, { v: .40 });     // quần áo trên dây
ev('cloth_rustle', 167.90, { v: .45 });     // lời khuyên trên dây phơi

window.DUR = V.end;
window.EV = EV;

window.render = t => {
  const s = shotAt(t);
  const sh = s.sh, u = s.u;
  camera.fov = sh.fov;
  camera.position.set(s.pos[0], s.pos[1], s.pos[2]);
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();

  // đèn tập trung đặt vào điểm nhìn: vùng sáng nhất của khung luôn là thứ đang kể
  if (sh.s === 'N1' || sh.s === 'N4') {
    const fx = FOCUS[sh.ids[0]] ?? 1.0;
    BAL.focus.target.position.set(s.look[0], s.look[1], s.look[2]);
    // đèn tập trung lệch sang bên phải của máy: ánh sáng xiên để nếp vải và mép vải đọc ra,
    // không phải ánh sáng thẳng vào mặt làm tấm áo thành mảng bìa phẳng
    const fwd = new THREE.Vector3(s.look[0] - s.pos[0], 0, s.look[2] - s.pos[2]).normalize();
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
    BAL.focus.position.set(
      s.look[0] + right.x * .70 + fwd.x * .18,
      s.look[1] + .80,
      s.look[2] + right.z * .70 + fwd.z * .18);
    BAL.focus.intensity = fx;
    BAL.focus.color.set(sh.ids[0] === 'c19' ? '#a9c8ff' : '#ffe0b0');   // vải ướt thành vải lạnh: ánh sáng lạnh
  }

  const set = setOf[sh.s];
  if (sh.s === 'N4' || sh.s === 'N1') {
    // trong phòng: quạt chạy ở các nhát có gió, tắt ở các nhát "không khí đứng yên"
    const id = sh.ids[0];
    const fanOn = (id === 'c52' || id === 'c53') ? 0 : 1;   // quạt đã tắt: không khí quay lại bám áo
    BAL.update(t, {
      wind: 1, fan: fanOn, t0: V.L['c35'].t0, hemT: V.L['c51'].t0,
      dim: DIM[id] ?? 1,                                           // góc xa của phòng thật tối
      lab: ['c35', 'c36', 'c37'].includes(id),                  // luồng gió ở bàn thí nghiệm
      vap: id === 'c30' || id === 'c31',                       // hơi nước bị gió chở đi
      vapRise: id === 'c23' || id === 'c26',                   // hơi nước bay lên khoảng không trên áo (c26: bay lên chậm)
      fanC: id === 'c33' || id === 'c34',                      // luồng gió của quạt nhỏ trên kệ
      vapBal: id === 'c47',                                   // hạt hơi nước lơ lửng ngoài hiên
      sweat: id === 'c54' || id === 'c55', sweatT: V.L['c55'].t0 + 1.2,
      temp: (id === 'c44' || id === 'c45') ? .50 : .375,      // .50 = ba mươi độ, .375 = hai mươi lăm độ
      rh: ['c38', 'c39', 'c41', 'c42', 'c43', 'c45', 'c46'].includes(id) ? .9 : .5,
    });
    // lớp khí ẩm bám áo: dày lên, rồi bị gió quét đi, rồi mờ đục khi ẩm cao
    // lớp hơi ẩm: bám áo trong phòng; ở hiên thì mờ đục khi không khí ẩm
    const MIST = ['c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29', 'c30', 'c31', 'c32', 'c52', 'c53'];
    BAL.mist.visible = MIST.includes(id);
    BAL.mistFar.visible = ['c52', 'c53'].includes(id);
    BAL.mistBal.visible = id === 'c47';
    const thick = clamp((t - w('c25', 'bão')) / 6);
    BAL.mistG.scale.set(1, 1 + thick * .25, 1);
    BAL.mist.material.opacity = id === 'c22' ? .40 : id === 'c25' ? .30 : id === 'c24' ? .34 : id === 'c26' ? .30 : .12 + thick * .13;
    BAL.mist.material.color.set(id === 'c22' ? '#8af2ff' : '#67e8f9');
    BAL.mistRim.material.opacity = id === 'c22' ? .95 : id === 'c25' ? .72 : id === 'c24' ? .55 : id === 'c26' ? .48 : .26 + thick * .18;   // viền sáng của lớp hơi phải đọc được
    BAL.mistFar.material.opacity = .22;                       // lớp hơi bám quanh áo còn ướt ở góc phòng
    BAL.mistFar.material.color.set('#7fdcf0');
    if (id === 'c54' || id === 'c55') BAL.mist.material.opacity = .07;   // gió đã quét sạch
    if (id === 'c31') {                        // gió mạnh: lớp ẩm bị quét đi, chỉ còn vệt mỏng dưới gió
      BAL.mist.material.opacity = .10;
      BAL.mistRim.material.opacity = .30;
      BAL.mistG.position.x += .14; BAL.mistG.position.y -= .05;
    }
    BAL.mistBal.material.opacity = id === 'c47' ? .32 : .22;
    BAL.mistBal.material.color.set('#9fd4e8');
    // giọt nước rơi ở mép khăn
    BAL.hemDrop.group.visible = id === 'c51';
    // bàn tay: chạm vào tấm áo (áo nguội) rồi rút lại; đứng trong luồng gió của quạt
    const hand = BAL.hand;
    const touchShot = id === 'c20', windShot = id === 'c54' || id === 'c55';
    hand.visible = touchShot || windShot;
    if (touchShot) {
      const k = clamp((t - w('c20', 'Chạm')) / 1.6);
      const push = k < .45 ? ss(k / .45) : 1 - ss((k - .45) / .55);
      // lòng bàn tay ép vào mặt áo, ngón tay chĩa ngang, mu bàn tay quay về máy
      hand.rotation.set(Math.PI / 2, 0, -Math.PI / 2);   // ngón chĩa vào mặt áo, mu bàn tay quay về máy
      hand.position.set(.14, 1.30, lerp(-3.13, -3.17, push));   // đầu ngón áp hẳn vào mặt áo
      hand.pose(.22 + .30 * (1 - push), .25);
    } else if (windShot) {
      // mu bàn tay ngửa lên cho máy (trục y của bàn tay là "trên"), ngón chĩa về phía quạt:
      // lớp mồ hôi bám trên da phải đọc được, không nằm khuất dưới lòng bàn tay.
      // c54 nhìn nghiêng nên xoay thêm để bàn tay nằm ngang qua luồng gió, không chồng lên ống kính.
      // c54: ngón chĩa về phía quạt (ngược dòng gió), cẳng tay rời khung bên phải.
      // c55: ngón chĩa theo dòng gió, cẳng tay rời khung bên trái — mu bàn tay ngửa lên cho máy.
      hand.rotation.set(0, id === 'c54' ? Math.PI : .28, id === 'c54' ? .10 : 0);
      hand.position.set(-.55, 1.02 + Math.sin(t * 2.6) * .008, -3.30);   // tay đưa vào luồng gió, ngay trước áo A
      hand.pose(.08, .8);
    }
    // c47: ngoài hiên có lớp hơi mờ đục — khung này phải mờ và tối hơn hẳn, để tách khỏi hai nhát sáng hai bên
    if (sh.s === 'N1') BAL.scene.fog = id === 'c47' ? new THREE.Fog('#93a6d6', 1.1, 4.2) : null;
  } else if (sh.s === 'N2') {
    FAB.update(t);
    // Trong ruột vải, mỗi nhát chỉ có MỘT vật chính — lưới sợi nền ẩn đi khi
    // máy đi vào khe nước, để người xem đọc được "khe giữa hai sợi" chứ không phải một mớ sợi.
    const id2 = sh.ids[0];
    const v = N2VIS[id2] || N2VIS.c11;
    for (const ch of FAB.fibres.group.children) {
      if (ch.userData.role) ch.visible = ch.userData.role === 'hero' ? v.hero : v.aux;
    }
    FAB.fibres.filmG.visible = v.film;
    FAB.fibres.fuzzG.visible = v.fuzz;
    FAB.cloth.group.visible = v.cloth;
    FAB.drop.group.visible = v.drop;
  }
  else if (sh.s === 'N3') WAT.update(t, { cool: sh.ids[0] === 'c18' });

  const set2 = setOf[sh.s];
  F.frame(set2.scene, {
    t, thick: sh.s === 'N2' || sh.s === 'N3' ? 3.4 : 3.6,
    ref: sh.s === 'N2' ? .18 : sh.s === 'N3' ? .5 : sh.s === 'N4' ? 1.2 : 2.4,
    key: set2.key || set2.sun,
    fade: Math.min(1, t / .3 + .2, (window.DUR - t) / .4),
    // phụ đề khắc vào hình: lời của câu đang nói, theo đúng mốc thời gian của giọng đã thu
    // và các thẻ thuật ngữ: số đo đang hiện trên vật đo phải đọc được ngay
    overlay: (g, tt) => {
      const out = [];
      const s = V.sub(tt);
      if (s) subtitle(g, s);     // phụ đề: độ dài giữ do .srt quyết định, không tính vào TEXTS
      for (const C of CARDS) {
        const size = C.size ?? 40;
        g.save(); g.font = `900 ${size}px "Be Vietnam Pro"`;
        const bw = g.measureText(C.text).width + size, bh = size * 1.55;
        g.restore();
        const [ax, ay] = toScreen(new THREE.Vector3(...C.at), camera);
        // đuôi thẻ vẽ ở góc dưới-trái, cách mép thẻ một khoảng cố định:
        // đặt thẻ lệch lên-trên-phải vật thì đuôi chỉ đúng vào vật
        let x = ax + bw / 2 + 26, y = ay - bh / 2 - 44;
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
