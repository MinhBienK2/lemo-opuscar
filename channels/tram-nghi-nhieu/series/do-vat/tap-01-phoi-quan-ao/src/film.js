// Vì sao phơi quần áo cần gió? — trang phim: 26 nhát theo shot list của TREATMENT.md.
// Mỗi nhát bám vào câu nó mang (V.L[id].t0/t1) nên nhịp quay đúng với lời kể.
import * as THREE from 'three';
import { film, label, subtitle, toScreen, markBeat, cardWindow } from '../../../../rig/render.js';
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

// Vị trí thật của phân tử đang bay lên khỏi mặt nước: thẻ thuật ngữ bám vào
// đúng nó, nên đuôi thẻ luôn chỉ vào vật chứ không chỉ vào chỗ trống.
const ESC_POS = () => { const p = WAT.surf.esc[0].m.position; return [p.x, p.y, p.z]; };

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
  sh('N1', 'c1', 46, [-1.62, 1.62, 2.75], [-1.25, .92, .85], [0, 0, 0]),   // áo ướt trên dây chiếm phần lớn khung; bồn chậu nằm ở chân áo, ngay dưới mép (máy lệch trái để bàn phơi không chắn)
  sh('N1', 'c2', 36, [-.95, 1.05, 1.85], [-1.25, .98, .86], [0, 0, -.02]),       // nửa dưới tấm áo: vệt ẩm, mép vải, giọt bám — ngước lên để thấy cả đường triều

  // ── N4 · phòng kín: cái thí nghiệm nhỏ ──
  // Cặp áo thí nghiệm (cmpA trước quạt nhỏ, cmpB ngoài tầm gió) ở góc trước-phải
  // của phòng: một khung chỉ có HAI cái áo, quan hệ giữa chúng đọc được.
  sh('N4', 'c3', 38, [-.72, 1.34, -2.62], [-1.46, 1.14, -3.30], [-.06, -.02, -.06]), // quạt
  sh('N4', 'c4', 50, [2.00, 1.15, -1.70], [1.98, 1.05, -2.60], [0, 0, -.02]),   // hai cái áo giống nhau treo cạnh nhau (máy trong phòng)
  sh('N4', 'c5', 50, [2.05, 1.28, -1.58], [1.85, 1.02, -2.60], [0, 0, -.02]),   // quạt + một áo trước quạt, một áo ngoài tầm gió
  sh('N4', 'c6', 46, [1.78, 1.12, -1.60], [1.92, 1.06, -2.60], [0, 0, -.03]),   // quạt nhỏ + CẢ HAI cái áo trong một khung (áo đối chiếu không bị cắt ở mép phải)
  sh('N4', 'c7', 42, [1.80, 1.58, -1.42], [2.02, 1.26, -2.62], [0, 0, -.02]),   // hai áo: một nhạt, một sẫm (máy nghiêng xuống, tường không nuốt khung)

  // ── N2 · trong sợi vải ──
  sh('N2', 'c8', 12, [.10, .06, .24], [0, .00, .00], [.02, 0, -.03]),        // nước còn nằm trong khe sợi
  sh('N2', 'c9', 19, [-.02, .104, .212], [-.02, .1015, .150], [0, -.001, -.006]),  // giọt nước bám trên sợi
  sh('N2', 'c10', 30, [.06, .10, .46], [.205, -.010, -.085], [-.02, -.02, -.02]),  // tấm vải đan: máy lùi xa để thấy cả tấm vải
  sh('N2', 'c11', 24, [.004, .016, .160], [.032, .005, .000], [0, .004, 0]),   // khe nước giữa hai sợi: nhìn chếch xuống khe
  sh('N2', 'c12', 22, [.045, .081, .115], [.0375, .0755, .010], [-.003, 0, -.008]), // rìa sợi: vệt nước bám trong xơ (máy sát vệt)

  // ── N3 · mặt nước ──
  // Sáu nhát này phải là SÁU hình khác nhau: cùng một mặt nước, nhưng mỗi câu một góc và một vật chính
  sh('N3', 'c13', 26, [-.80, .078, .190], [-.985, .046, .010], [-.01, 0, -.014]),  // cận: ba phân tử ở mép nước
  sh('N3', 'c14', 26, [-.115, .058, .100], [-.055, .026, .004], [.003, 0, -.008]),  // mặt nước: gợn chạy, phân tử nhảy trên sóng
  sh('N3', 'c15', 34, [.26, .135, .355], [-.10, .020, -.05], [.004, 0, -.007]),   // rộng: CẢ mặt nước nhảy lung tung, không chỉ một góc
  sh('N3', 'c16', 22, [.120, .100, .215], [.005, .072, .010], [0, 0, -.004]),     // cận: một phân tử bứt ra khỏi mặt nước
  // nhìn từ thấp nhưng NGHIÊNG XUỐNG: phân tử bay lên trên nền trời sáng, và
  // nửa dưới khung là mặt nước — trước đây 85 % khung là một mảng trời tối rỗng.
  sh('N3', 'c17', 38, [.115, .012, .330], [.000, .105, .000], [-.003, .012, -.012]),   // thấp, ngước lên, rộng: hạt bay cao có vệt kéo dài
  sh('N3', 'c18', 30, [.42, .185, .395], [-.35, .010, -.06], [-.01, 0, -.018]),   // rộng, góc đối diện: phần nước còn lại mát đi

  // ── N4 · vải lấy nhiệt của chính nó ──
  sh('N4', 'c19', 46, [1.35, 1.46, -2.40], [.42, 1.08, -3.30], [-.10, -.02, -.06]),  // tấm áo ướt trong phòng
  sh('N4', 'c20', 40, [-.55, 1.38, -2.45], [.30, 1.20, -3.24], [.02, -.01, -.04]),   // bàn tay chạm vào vải ướt
  sh('N4', 'c21', 36, [.78, 1.06, -2.70], [.44, 1.30, -3.26], [-.04, .02, -.04]),  // áo trong luồng gió, nhiệt đi ra

  // ── N4 · lớp hơi ẩm bám mặt áo ──
  // C22–C26 nói về một tầng hơi mỏng bám trên vải; mỗi câu một hình khác:
  // khoảng không phía trên (c22), hơi nước đi lên qua khoảng trống (c23),
  // cận cảnh lớp kính mờ (c24), mép đã bão hoà (c25), và cột hơi nước (c26).
  sh('N4', 'c22', 36, [.30, 1.05, -2.45], [.43, 1.56, -3.28], [0, 0, -.03]),   // nhìn LÊN khe không khí; mép áo còn ở đáy khung
  // c23: cận vào DẢI HƠI NƯỚC bay lên từ vai áo — hơi nước có đường đi,
  // không phải mấy hạt tròn đứng yên giữa mảng vải trơn.
  sh('N4', 'c23', 34, [.26, 1.25, -2.85], [.44, 1.52, -3.26], [0, 0, -.03]),   // nhìn LÊN khe không khí giữa vai áo và dây phơi
  sh('N4', 'c24', 36, [.70, 1.50, -2.30], [.42, 1.15, -3.26], [0, 0, -.02]),   // macro: lớp hơi bám sát mặt vải như kính mờ
  // c25: cận vào mép áo — dải ẩm đã bão hoà (vệt xanh) lan ra rồi dừng lại,
  // ngay trên nó là vải khô.
  sh('N4', 'c25', 40, [.22, 1.20, -1.85], [.42, 1.02, -3.28], [0, 0, -.02]),   // lùi ra: mép áo + vệt ẩm bão hoà, phía trên là vải khô
  sh('N4', 'c26', 34, [.66, .92, -2.52], [.44, 1.42, -3.26], [0, 0, -.03]),   // từ bên phải: kẹp gỗ và cột hơi nước bốc lên chậm

  // ── N4 · gió quét lớp ẩm ──
  sh('N4', 'c27', 42, [-2.05, 1.12, -2.55], [.34, 1.00, -3.28], [-.02, 0, -.02]),  // mặt quạt tiền cảnh trái, vệt ẩm trượt về quạt rồi mất
  // c28: máy ở phía gió đi, nhìn ngược lại — mép áo ướt ở giữa, dải hơi nước
  // bị kéo về phía máy. Khung này phải có vật chính, không phải một mảng tường.
  sh('N4', 'c28', 46, [.98, 1.24, -2.78], [.30, 1.16, -3.24], [.02, 0, -.02]),
  // c29: máy sát quạt — quạt là vật chính của nhát, nên chuỗi "cùng một tấm áo"
  // (c22–c32) bị cắt ở đây: nhát sau bắt đầu lại từ một vật khác.
  sh('N4', 'c29', 42, [-.72, 1.06, -2.62], [-1.42, .93, -3.28], [-.03, 0, -.02]),
  // c30: nhìn ngược dòng gió — quạt ở mép trái, mép áo ướt ở giữa, dải hơi nước
  // bị gió chở thẳng về phía máy.
  sh('N4', 'c30', 52, [.92, 1.24, -2.05], [.06, 1.10, -3.28], [.02, 0, -.02]),   // quạt bên trái, mép vải ướt giữa khung, hơi nước bị chở sang phải
  sh('N4', 'c31', 46, [1.20, 1.25, -2.50], [.20, 1.12, -3.30], [.02, 0, -.03]),  // gió mạnh hơn: quạt ở trái, mép ẩm bị quét xa sang phải
  sh('N4', 'c32', 44, [.30, .80, -2.20], [.10, 1.30, -3.30], [-.04, .02, -.05]),  // quạt ngược sáng: gió quét sạch, nước bốc hơi nhanh hơn

  // ── N4 · đo được ──
  sh('N4', 'c33', 54, [-1.45, 1.42, -4.15], [-1.80, 1.12, -5.55], [-.01, -.01, -.03]), // hai cái cân, hai áo, quạt nhỏ
  sh('N4', 'c34', 32, [-.98, 1.12, -4.70], [-1.82, .82, -5.52], [-.01, -.01, -.03]), // hai mặt cân nhìn CHÉO từ bên phải, không phải phóng to từ c33
  sh('N4', 'c35', 50, [1.72, 1.80, -5.30], [1.70, .88, -6.14], [-.02, -.01, -.02]), // từ trên nhìn xuống: cả bàn thí nghiệm trong một khung
  sh('N4', 'c36', 36, [1.10, 1.30, -5.35], [1.72, 1.00, -6.10], [.02, 0, -.03]),  // hai mặt kính, hai giọt nước, quạt
  sh('N4', 'c37', 40, [1.740, 1.100, -5.32], [1.700, .960, -6.13], [.002, 0, -.002]),  // HAI giọt cùng khung: giọt sau vách to hơn, mới còn một nửa

  // ── N1 · ba thứ quyết định tốc độ ──
  sh('N1', 'c38', 18, [-1.10, 1.82, 1.00], [-2.02, 1.94, -.95], [0, 0, -.03]),  // ba thứ trên tường: nhiệt kế + tấm vải + ẩm kế, đọc được số vạch
  // c39: rộng — trong một khung thấy CẢ ba thứ câu kể gọi tên: nhiệt độ (nhiệt kế
  // bên trái), độ ẩm (ẩm kế) và diện tích phơi (đàn áo bên phải).
  sh('N1', 'c39', 54, [-1.60, 1.80, 1.35], [-1.00, 1.55, -.75], [0, 0, -.02]),   // nhiệt kế + ẩm kế bên trái, dàn áo phơi bên phải
  // máy đứng GIỮA hai dây phơi (dây thứ nhất ở z = .85, dây thứ hai ở z = −.62):
  // không có mớ quần áo của dây thứ nhất che mất đàn áo.
  sh('N1', 'c40', 46, [-.35, 2.02, 2.40], [.72, 1.72, -.35], [0, 0, -.02]),   // dây thứ hai (đàn ba áo chồng) PHÍA SAU dây thứ nhất
  sh('N1', 'c41', 40, [-1.50, 1.98, -.35], [-1.72, 1.95, -.95], [0, 0, -.02]),      // ẩm kế: hai mươi gam
  sh('N1', 'c42', 30, [-1.60, 1.78, -.70], [-1.72, 1.905, -.97], [0, 0, -.01]),   // cận vòng gam/kg: "trên mỗi kilogam không khí khô"
  sh('N1', 'c43', 28, [-1.60, 1.93, -.55], [-1.74, 1.96, -.95], [0, 0, -.02]),      // trọn mặt đồng hồ, kim chạm vạch cuối
  // c44: nhìn rộng — cột thuỷ ngân bên trái, ẩm kế bên phải, tấm vải thử ở giữa.
  // "Nhiệt độ cao hơn thì sức chứa ấy càng cao hơn" cần thấy CẢ HAI đồng hồ.
  sh('N1', 'c44', 44, [-2.15, 1.96, .12], [-1.90, 1.94, -.95], [-.01, 0, -.02]),   // nhiệt kế ba mươi độ + nhiệt kế phòng + ẩm kế cùng một khung
  // c45: cận cảnh tấm vải thử đang ướt — hơi nước bốc lên TỪ VẢI, không bốc ra
  // từ chính đồng hồ đo; cột thuỷ ngân ở mép trái, đã dâng tới 30 °C.
  sh('N1', 'c45', 38, [-2.20, 1.78, -.20], [-2.18, 1.74, -.92], [0, 0, -.02]),   // cận vào TẤM VẢI THỬ + nhiệt kế ba mươi độ; góc khác hẳn c44, ẩm kế ra khỏi khung
  sh('N1', 'c46', 48, [-1.72, 1.88, -.38], [-1.80, 1.82, -.92], [0, 0, -.02]),     // MỘT ẩm kế (chín mươi phần trăm) + tấm vải thử bên cạnh: hơi nước bốc chậm

  // ── N1 · diện tích phơi, độ dày của vải ──
  // c47: quay lại hiên phơi, cùng bên với c48–c51 (dây phơi, tấm áo úp): câu 47
  // kể lớp hơi mờ quanh áo ướt, câu 48 kể chồng áo — hai câu cùng một chỗ
  // thì phim không nhảy cảnh giữa dòng.
  sh('N1', 'c47', 40, [-.20, 1.35, 2.30], [-1.25, 1.05, .82], [-.04, -.02, -.06]), // lớp hơi mờ quanh áo ướt ngoài hiên
  sh('N1', 'c48', 52, [.72, 1.62, .40], [.72, 1.45, -.62], [0, -.01, -.03]),        // đàn áo chồng và áo phơi một mặt
  sh('N1', 'c49', 50, [-.92, 1.30, 2.30], [-.92, .46, 1.26], [-.01, -.01, -.03]),  // nhìn xuống bàn phơi: áo úp và áo phơi rộng
  sh('N1', 'c50', 52, [.55, 1.32, 2.85], [.55, 1.24, .85], [0, 0, 0]),   // quần dày (còn ướt) và áo thun mỏng (đã khô)
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
  // c53: máy sát cửa sổ kín — cửa sổ chiếm nửa khung, cạnh nó là dây phơi
  // có áo ướt: "phơi trong nhà lâu khô hơn" phải thấy được cái áo trong nhà.
  sh('N4', 'c53', 46, [1.05, 1.58, -4.95], [-.35, 1.45, -6.35], [-.06, -.02, -.06]),   // áo ướt treo trong nhà, cửa sổ đọng hơi phía sau
  sh('N4', 'c54', 36, [-1.95, 1.12, -2.70], [-1.05, 1.02, -3.28], [.02, 0, -.02]),   // mặt quạt tiền cảnh trái, luồng gió chạy qua bàn tay
  // c55: cận hơn, quạt ra khỏi khung — và bàn tay cùng hướng với c54
  // (cánh tay đi vào từ bên phải, ngón chỉa về phía quạt), không lật gương.
  sh('N4', 'c55', 34, [-1.15, 1.40, -2.92], [-1.03, 1.02, -3.28], [0, 0, -.02]),   // nhìn XUỐNG lòng bàn tay: đọc ra là bàn tay, không phải chân thú
  // ── N1 · lời khuyên ──
  sh('N1', 'c56', 48, [-1.10, 1.75, 2.40], [-.20, 1.05, .85], [.16, -.02, -.16]),  // dây phơi: áo đã nhạt màu
  sh('N1', 'c57', 40, [-.60, 1.30, 2.00], [-1.20, .95, .85], [-.02, -.01, -.04]),  // áo đã khô
  sh('N1', 'c58', 44, [1.95, 1.50, .60], [.75, 1.20, -.95], [-.06, -.02, -.08]),    // lối thông gió: nước có chỗ để đi
  sh('N1', 'c59', 50, [2.14, 1.40, 1.70], [.90, 1.20, -.90], [-.03, 0, -.04]),       // túi nylon vẫy ở tiền cảnh, lối mở phía sau: nơi thoáng gió
  // c60: KHUNG MỚI — nhìn chéo xuống bàn phơi thứ hai, nơi chỉ có một cái áo
  // úp mặt trong lên, và khe hở giữa hai bàn. Không lặp lại khung của câu 49.
  sh('N1', 'c60', 48, [2.30, 1.16, 2.55], [.85, .44, 1.36], [-.02, -.01, -.04]),   // nhìn xuống: khe hở giữa hai bàn + cái áo úp lật góc
];

// Trong ruột vải (N2), mỗi nhất chỉ giữ MỘT vật chính. Lưới sợi nền ('aux')
// ẩn đi ở các nhất siêu cận, để khung đọc được đúng ý của câu thay vì một mớ sợi.
const N2VIS = {
  c8:  { aux: false, hero: true,  film: true,  fuzz: false, cloth: false, drop: false }, // nước còn nằm trong khe sợi
  c9:  { aux: false, hero: false, film: false, fuzz: false, cloth: false, drop: true },  // giọt nước bám trên sợi
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
// Câu nào ngắn thì thẻ không đủ lâu để đọc trọn: `hold` giữ thẻ lâu hơn (tính
// theo GIÂY), `lead` cho thẻ hiện sớm hơn. Cả hai chỉ được dùng khi vật thẻ
// bám vào vẫn còn trong khung và đuôi thẻ vẫn chỉ đúng vật.
const CARDS = [
  { id: 'doao',      text: 'QUẦN ÁO ƯỚT',    at: [-1.25, 1.28, .85],    lines: ['c1'],            size: 32 },
  { id: 'doquat',    text: 'QUẠT',          at: [1.20, .86, -2.60],    lines: ['c5', 'c6'],      size: 34 },
  { id: 'do2ao',     text: '2 ÁO',          at: [2.30, 1.22, -2.60],   lines: ['c4'],            size: 30 },
  { id: 'dogocxa',   text: 'KHÔNG CÓ GIÓ',  at: [2.30, 1.50, -2.60],   lines: ['c5'],            size: 28 },
  { id: 'dotruoc',   text: 'TRƯỚC QUẠT',    at: [1.70, 1.16, -2.60],   lines: ['c5', 'c6', 'c7'], size: 28 },
  { id: 'dosoi',     text: 'KHE GIỮA SỢI',  at: [0, .004, .004],        lines: ['c11'],           size: 30 },
  { id: 'do1pt',     text: '1 PHẦN NHỎ',    at: () => ESC_POS(),        lines: ['c16'],           size: 34, dx: 86, mark: [.005, .072, .010] },
  { id: 'dohoi',     text: 'PHÂN TỬ BAY LÊN', at: () => ESC_POS(),       lines: ['c17'],           size: 32, mark: [.000, .105, .000] },
  { id: 'do2kj',     text: 'HƠN 2 kJ / 1 g', at: [.42, 1.18, -3.26],   lines: ['c21'],           size: 30 },
  { id: 'dolop',     text: 'LỚP HƠI ẨM',    at: [.42, .98, -3.24],      lines: ['c24'],           size: 30 },
  { id: 'dolanht',   text: 'LẠNH',          at: tt => (tt < V.L['c20'].t0 ? [.42, 1.06, -3.28] : [.10, 1.30, -3.14]),
                                                    lines: ['c19', 'c20'],   size: 30 },
  { id: 'doBao',     text: 'BAO HÒA',       at: () => BAL.hemTop(),     lines: ['c25'],           size: 32 },
  { id: 'doquet',    text: 'BỊ QUÉT ĐI',    at: [.20, .86, -3.24],      lines: ['c27'],           size: 32 },
  { id: 'dochoi',    text: 'HƠI NƯỚC BỊ CHỞ ĐI', at: [.60, 1.18, -3.20], lines: ['c30'],           size: 30, hold: 1.5 },
  { id: 'doquetxa',  text: 'QUÉT XA HƠN',   at: [.90, 1.12, -3.00],     lines: ['c31'],           size: 28 },
  { id: 'do2can',    text: 'HAI CÂN',       at: [-1.56, .80, -5.45],    lines: ['c33', 'c34'],    size: 30 },
  { id: 'dogocxacan', text: 'GÓC XA',       at: [-2.04, .84, -5.55],    lines: ['c34'],           size: 28, lead: 0.8 },
  { id: 'dogiot',    text: 'HAI GIỌT NƯỚC', at: [1.36, .953, -6.13],    lines: ['c36'],           size: 30 },
  { id: 'do1nua',    text: 'TỐC ĐỘ CHẬM 1/2', at: [1.36, .953, -6.13], lines: ['c37'],           size: 26 },
  { id: 'dodientich', text: 'DIỆN TÍCH PHƠI', at: [1.02, 1.56, -.62],    lines: ['c39'],           size: 26 },
  { id: 'donhiet',   text: 'NHIỆT ĐỘ',      at: [-2.25, 2.11, -.966],   lines: ['c39'],           size: 30 },
  { id: 'doam',      text: 'ĐỘ ẨM',        at: [-1.72, 2.07, -.966],   lines: ['c39'],           size: 30 },
  { id: 'do3ao',     text: '3 ÁO',          at: [.45, 1.70, -.62],      lines: ['c40'],           size: 30 },
  { id: 'do20',      text: '20 g/kg',       at: [-1.6925, 1.927, -.968], lines: ['c41'],        size: 34, dx: 150 },
  { id: 'domoikg',   text: 'MỖI KG KHÔNG KHÍ KHÔ', at: [-1.72, 1.904, -.968], lines: ['c42'],  size: 26, hold: 0.8 },
  { id: 'do30',      text: '30 °C',         at: () => BAL.thermo30Top(), lines: ['c44', 'c45'], size: 34 },
  { id: 'do90',      text: '90 %',          at: [-1.6326, 1.9287, -.966], lines: ['c46'],         size: 34 },
  { id: 'dosucchua', text: 'SỨC CHỨA CAO HƠN', at: [-1.618, 1.868, -.968], lines: ['c44'],         size: 28 },
  { id: 'dox5',      text: '×5',            at: [-1.98, 1.96, -.90],    lines: ['c46'],           size: 34 },
  { id: 'dolopmo',   text: 'LỚP HƠI MỜ',    at: [-1.25, 1.18, .80],     lines: ['c47'],           size: 28 },
  { id: 'dochong',   text: 'CHỒNG ÁO',      at: [.30, 1.80, -.62],      lines: ['c48'],           size: 28 },
  { id: 'domot',     text: 'PHƠI MỘT MẶT',  at: [1.02, 1.78, -.60],     lines: ['c48'],           size: 30 },
  { id: 'doap',      text: 'ÁO ÚP',         at: () => BAL.upPos(),    lines: ['c49'],      size: 32 },
  { id: 'dophan',    text: 'PHƠI RỘNG',     at: () => BAL.spreadPos(), lines: ['c49'],      size: 28 },
  { id: 'doquan',    text: 'QUẦN DÀY',      at: [-.55, 1.28, .85],     lines: ['c50'],           size: 30 },
  { id: 'domong',    text: 'ÁO MỎNG',       at: [1.42, 1.30, .85],      lines: ['c50'],           size: 30 },
  { id: 'doquay',    text: 'QUAY LẠI BÁM ÁO', at: [2.26, 1.14, -5.02],  lines: ['c52'],           size: 30 },
  { id: 'domo',      text: 'HƠI BỊ CUỐN ĐI', at: [-1.10, 1.05, -3.30],   lines: ['c55'],           size: 28, hold: 0.4 },
  { id: 'dodi',      text: 'NƯỚC PHẢI ĐI ĐƯỢC', at: [-1.34, .80, .86],  lines: ['c57'],           size: 28, lead: 1.0 },
  { id: 'dothoang',  text: 'CHỖ THOÁNG GIÓ', at: [1.86, 1.18, .85],      lines: ['c59'],           size: 30 },
  { id: 'dotach',    text: 'TÁCH RIÊNG',    at: [.50, .44, 1.34],       lines: ['c60'],           size: 30 },
  { id: 'dohaimat',  text: 'CẢ HAI MẶT',    at: () => [BAL.flipCornerPos.x, BAL.flipCornerPos.y, BAL.flipCornerPos.z],
                                                    lines: ['c60'],           size: 30 },
];
// Thẻ hiện từ lúc máy cắt sang nhát của câu (tức từ lúc câu trước kết thúc)
// đến lúc câu của nó kết thúc: luôn đủ lâu để đọc trọn.
// Câu ngắn thì không đủ: `lead` (hiện sớm hơn, tính theo giây) và `hold` (giữ
// lâu hơn) kéo cửa sổ thẻ ra, đủ để đọc trọn mà vẫn chỉ đúng vật.
for (const C of CARDS) Object.assign(C, cardWindow(C, V));

// độ sáng của đèn tập trung theo từng câu: nhát cận cảnh sáng mạnh, nhát toàn cảnh để nhẹ lại
const FOCUS = {
  c1: 1.1, c2: .8, c3: 1.1, c4: 1.8, c5: 2.0, c6: 1.6, c7: 2.4,
  c8: 1.6, c9: 2.2, c10: 1.8, c11: 2.0, c12: 2.4, c13: 2.2, c14: 2.2,
  c15: 2.2, c16: 2.4, c17: 2.2, c18: 2.6, c19: 1.6, c20: 1.4, c21: 1.6,
  c22: 1.4, c23: 1.4, c24: 1.5, c25: 1.4, c26: 1.4, c27: 1.5, c28: 1.4,
  c29: 1.4, c30: 2.0, c31: 1.9, c32: 2.6, c33: 2.4, c34: 1.6, c35: 1.4, c36: 1.8, c37: 2.2,
  c38: 1.7, c39: 1.6, c40: 1.6, c41: 2.0, c42: 1.8, c43: 2.0,
  c44: 1.7, c45: 1.6, c46: 1.8, c47: 1.8, c48: 1.8, c49: 1.2, c50: 1.8, c51: 1.8,
  c52: 1.7, c53: 1.2, c54: 2.2, c55: 1.8, c56: .9, c57: 1.2, c58: 1.7,
  c59: 1.6, c60: 1.6,
};
// hạ sáng đèn phòng ở nhát nào cần góc xa thật tối (nhìn thấy khác hẳn nhát trước)
const DIM = { c4: .80, c5: .75, c7: .70, c19: .55, c21: .55, c27: .45, c31: .55, c32: .45, c33: 1.15, c49: 1.0, c29: .88, c52: .85, c53: .60, c35: .40, c37: .45 };

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

// ── mốc nhịp: mỗi câu một điểm trên khung ────────────────────────────────
// Mốc là chỗ thẻ thuật ngữ của câu bám vào (nếu câu có thẻ), không thì là
// điểm máy đang nhìn. Nhờ vậy mỗi câu đều có một chỗ để mắt rơi vào, và
// máy kiểm tra được câu nào đang kể mà không có hình.
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
    BAL.focus.color.set((sh.ids[0] === 'c19' || sh.ids[0] === 'c20') ? '#a9c8ff' : '#ffe0b0');   // vải ướt thành vải lạnh: ánh sáng lạnh
  }

  const set = setOf[sh.s];
  if (sh.s === 'N4' || sh.s === 'N1') {
    // trong phòng: quạt chạy ở các nhát có gió, tắt ở các nhát "không khí đứng yên"
    const id = sh.ids[0];
    const fanOn = (id === 'c52' || id === 'c53') ? 0 : 1;   // quạt đã tắt: không khí quay lại bám áo
    BAL.update(t, {
      wind: id === 'c59' ? 1.9 : 1,                        // câu 59: vải vẫy mạnh — nơi thoáng gió thì vải đung đưa
      fan: fanOn, t0: V.L['c35'].t0, hemT: V.L['c51'].t0,
      dim: DIM[id] ?? 1,                                           // góc xa của phòng thật tối
      lab: ['c35', 'c36', 'c37'].includes(id),                  // luồng gió ở bàn thí nghiệm
      labVis: ['c35', 'c36', 'c37'].includes(id),               // bàn thí nghiệm chỉ hiện ở câu của nó
      cmp: ['c4', 'c5', 'c6', 'c7'].includes(id),               // cặp áo thí nghiệm: quạt nhỏ quay
      cmpFade0: V.L['c5'].t1,                                   // đến hết câu 5, cái áo trước quạt còn ướt nguyên
      vap: id === 'c28' || id === 'c30' || id === 'c31',       // hơi nước bị gió chở đi
      vapRise: id === 'c23' || id === 'c26',                   // hơi nước bay lên khoảng không trên áo (c26: bay lên chậm)
      vapCol: id === 'c21' || id === 'c22' || id === 'c23' || id === 'c26',   // cột hơi nước bốc lên qua khoảng trống
      hemBand: id === 'c25' || id === 'c26',                   // mép áo đã bão hoà
      hemPulse: id === 'c25',                                   // vùng bão hoà phải THỞ, không đứng chết như vệt sơn
      vapBand: id === 'c22' || id === 'c23' || id === 'c26',      // dải hơi nước bay lên
      heat: id === 'c21',                                       // nhiệt rời khỏi tấm vải
      backAir: id === 'c52',                                     // không khí quay lại bám áo
      windVeil: id === 'c28',                                    // dải gió kéo từ quạt sang áo
      windVeil2: id === 'c31',                                   // mảnh ẩm bị quét xa hơn
      // câu 27: lớp ẩm trên vải bị gió quét về phía quạt rồi mất dần
      wetLayer: id === 'c27' ? 1 - clamp((t - V.L['c27'].t0) / (V.L['c27'].t1 - V.L['c27'].t0)) : 0,
      hemK: clamp((t - V.L['c24'].t1) / 2.5),
      dense: id === 'c45',                                     // hơi nước mỏng, bốc nhanh từ tấm vải thử (ba mươi độ)
      doorWind: id === 'c58' || id === 'c59',                  // gió qua lối mở ra hiên
      fanC: id === 'c33' || id === 'c34',                      // luồng gió của quạt nhỏ trên kệ
      vapBal: id === 'c47' || id === 'c57',                     // hạt hơi nước lơ lửng
      bag: id !== 'c56',                                         // túi nylon vẫy: dấu hiệu gió ở câu 59
      // câu 5–7 là CẶP ÁO THÍ NGHIỆM: đúng hai cái áo trong khung. Cái áo ướt
      // treo ở góc xa phòng (đạo cụ của câu 53) ẩn đi ở ba câu này — để lại
      // thì khung có ba cái áo và thẻ 'KHÔNG CÓ GIÓ' trông như chỉ sai.
      noBack: id === 'c5' || id === 'c6' || id === 'c7',
      // gió nhẹ ngoài hiên: dải mờ trôi qua dây phơi — không có nó thì các câu
      // ở hiên chỉ còn quần áo đứng yên, và câu 50 (áo mỏng khô nhanh hơn áo dày)
      // không có hình để kể
      breeze: ['c47', 'c48', 'c49', 'c50', 'c51', 'c56', 'c57', 'c58', 'c59', 'c60'].includes(id),
      vapApo: id === 'c49',                                    // hơi nước bị kẹt dưới cái áo úp
      paneFog: id === 'c53',                                   // hơi nước ngưng trên kính cửa sổ
      sweat: id === 'c54' || id === 'c55', sweatT: V.L['c55'].t0 + 1.2,
      // câu 54–55: luồng gió phải ĐI QUA bàn tay, không đứng bên cạnh nó
      ...(id === 'c54' || id === 'c55'
        ? { windX0: -1.42, windX1: 1.10, windY: .99, windY1: .04, windZ: -3.30, windScale: 2.6 }
        : {}),
      // câu 46: "cùng một luồng gió" phải có một vệt gió thật trong khung
      ...(id === 'c46'
        ? { windX0: -2.26, windX1: -1.52, windY: 1.60, windY1: 1.70, windZ: -.92, windScale: 2.0 }
        : {}),
      // câu 59: "nơi thoáng gió" cần một luồng khí thật — vệt gió chạy từ lối
      // mở (bên phải) sang trái, cùng chiều với chiếc túi nylon đang vẫy
      ...(id === 'c59'
        ? { streak: true, windX0: 1.78, windX1: .45, windY: 1.24, windY1: 1.02, windZ: .60, windScale: 2.6 }
        : {}),
      // hai cái áo của câu 49 không ở trong khung câu 60: câu 60 nói "không chồng
      // quần áo lên nhau", mà để lại chúng thì câu 60 có hai áo chồng nhau
      bench49: id !== 'c60',
      // câu 1 (khung mở đầu): cặp áo của câu 49 chưa tới giờ xuất hiện — để lại
      // thì chúng đứng ngay trước ống kính và chắn mất bồn chậu dưới mép áo ướt
      noCmp: id === 'c1',
      noBench: id === 'c1',                    // bàn phơi che mất bồn chậu dưới mép áo ướt ở câu 1
      // nhiệt kế treo trong cảnh LUÔN đọc hai mươi lăm độ (FACTS.md). Ba mươi
      // độ của câu 44–45 nằm ở MỘT THIẾT BỊ KHÁC: một nhiệt kế đặt cạnh tấm
      // vải thử. Thanh đỏ mờ đứng cạnh vỏ nhiệt kế (cột "ma" cũ) bị bỏ: nó
      // không đọc ra là một cột thuỷ ngân, và thẻ "30 °C" chỉ vào nó như
      // chỉ vào một que đỏ.
      tempTrack: [[0, .375], [V.L['c44'].t0, .375], [V.L['c45'].t1, .375]],
      t30: id === 'c44' || id === 'c45',                  // nhiệt kế ba mươi độ chỉ hiện ở câu 44–45
      t30only: id === 'c45',                              // câu 45: cận cảnh riêng, giấu nhiệt kế treo
      // Kim ẩm kế phải khớp với câu đang kể: c41–c42 nói không khí "chứa được tối đa"
      // 20 g/kg ở nhiệt độ này → kim chỉ hết cung (bão hoà); c46 nói không khí ẩm chín
      // mươi phần trăm → kim chỉ 90.
      // kim ẩm kế phải CHẠY thật: ở câu 42 nó đi lên tới vạch cuối (nơi câu 43
      // nói "đó là trần của nó"), nên câu 42 không còn là một khung đứng yên.
      // ẩm kế trong cảnh LUÔN đọc chín mươi phần trăm — đúng con số câu 46
      // đọc. Trước đây nó chỉ nửa chừng: một con số không câu nào đọc.
      rhTrack: [[0, .9], [V.L['c41'].t0, .9], [V.L['c41'].t0 + .18, .92], [V.L['c41'].t1, .96],
        [V.L['c42'].t0, .90], [V.L['c42'].t1, 1],
        [V.L['c43'].t0, .90], [V.L['c43'].t0 + .90, 1], [V.L['c44'].t0, 1],
        [V.L['c44'].t0 + 1.3, .72], [V.L['c45'].t1, .69], [V.L['c46'].t0 - .01, .69],
        [V.L['c46'].t0, .90]],
      // hai cái cân: kim chạy tới vạch trong lúc câu 33–34 nói số đo
      scaleT0: V.L['c33'].t0 + .6, scaleT1: V.L['c33'].t1,
      scale1From: .12, scale2From: .12,
      // câu 37: tắt nhãn đứng trên mặt bàn để không che mất giọt nước
      labTags: id !== 'c37',
      // câu 46: KHÔNG dùng ẩm kế thứ hai nữa — kim nó chỉ nửa, mà lời kể
      // không đọc con số nào như vậy, và dấu ngoặc nối hai đồng hồ đọc ra là
      // một tỉ lệ giữa chín mươi và nửa. Thay vào đó: mười phần trăm là MỘT
      // đồng hồ, và "chậm gấp năm lần" là tấm vải thử cạnh nó — hơi nước bốc
      // lên đặc và chậm.
      hygro2: false,
      cmpBar: false,
      vapSlow: id === 'c46',                              // hơi nước đặc, bốc chậm: thẻ "×5" bám vào nó
    });
    // lớp khí ẩm bám áo: dày lên, rồi bị gió quét đi, rồi mờ đục khi ẩm cao
    // lớp hơi ẩm: bám áo trong phòng; ở hiên thì mờ đục khi không khí ẩm
    const MIST = ['c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29', 'c30', 'c31', 'c32', 'c52', 'c53'];
    BAL.mist.visible = MIST.includes(id);
    BAL.mistFar.visible = ['c52', 'c53'].includes(id);
    BAL.mistBal.visible = id === 'c47';
    const thick = clamp((t - w('c25', 'bão')) / 6);
    BAL.mistG.scale.set(1, 1 + thick * .25, 1);
    // ở câu 22–23 lớp hơi ẩm phải MỎNG: lời nói "không khí ngay trên vải còn
    // trống" — một tấm kính phủ kín mặt áo thì hình trái lời.
    BAL.mist.material.opacity = id === 'c22' ? .07 : id === 'c23' ? .12 : id === 'c25' ? .16 : id === 'c24' ? .58 : id === 'c26' ? .28 : id === 'c32' ? .07 : .12 + thick * .13;
    BAL.mist.material.color.set(id === 'c22' ? '#8af2ff' : '#67e8f9');
    BAL.mistRim.material.opacity = id === 'c22' ? .22 : id === 'c25' ? .72 : id === 'c24' ? .85 : id === 'c26' ? .48 : id === 'c32' ? .14 : .26 + thick * .18;   // viền sáng của lớp hơi phải đọc được
    BAL.mistFar.material.opacity = id === 'c52' ? .58 : .46;  // lớp hơi bám quanh áo còn ướt ở góc phòng
    BAL.mistFar.material.color.set('#7fdcf0');
    if (id === 'c54' || id === 'c55') BAL.mist.material.opacity = .07;   // gió đã quét sạch
    if (id === 'c31') {                        // gió mạnh: lớp ẩm bị quét đi, chỉ còn vệt mỏng dưới gió
      BAL.mist.material.opacity = .10;
      BAL.mistRim.material.opacity = .30;
      BAL.mistG.position.x += .14; BAL.mistG.position.y -= .05;
    }
    BAL.mistBal.material.opacity = id === 'c47' ? .58 : .22;
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
      hand.rotation.set(0, Math.PI, id === 'c54' ? .10 : .06);
      hand.position.set(-1.05, 1.02 + Math.sin(t * 2.6) * .008, -3.30);   // tay đưa vào luồng gió, ngay trước miệng quạt
      hand.pose(.16, .7);   // ngón hơi cong, không xòe: đọc ra là bàn tay người, không phải chân thú
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
  else if (sh.s === 'N3') WAT.update(t, { coolK: sh.ids[0] === 'c18' ? 1 : 0 });

  const set2 = setOf[sh.s];
  F.frame(set2.scene, {
    t, thick: sh.s === 'N2' ? 2.2 : sh.s === 'N3' ? 3.4 : 3.6,
    ref: sh.s === 'N2' ? .34 : sh.s === 'N3' ? .5 : sh.s === 'N4' ? 1.2 : 2.4,
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
        const [ax, ay] = toScreen(new THREE.Vector3(...(typeof C.at === 'function' ? C.at(tt) : C.at)), camera);
        // đuôi thẻ vẽ ở góc dưới-trái, cách mép thẻ một khoảng cố định:
        // đặt thẻ lệch lên-trên-phải vật thì đuôi chỉ đúng vào vật.
        // dx đẩy thẻ sang phải thêm (vật to, như phân tử nước, không bị thẻ đè lên).
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
