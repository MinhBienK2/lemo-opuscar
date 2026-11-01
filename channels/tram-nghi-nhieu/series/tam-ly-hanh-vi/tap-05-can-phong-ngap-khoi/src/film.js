// "Căn phòng ngập khói 1968 — Tại sao càng đông người, ta càng bất động?" — Tập 05 của Trạm Nghĩ Nhiều.
// Đạo diễn chuẩn điện ảnh: Chuyển góc máy liên tục mỗi 3–6 giây (Macro ngòi bút, Cận mặt kính Tuấn, Macro lỗ thông gió,
// Cận mặt người lạ vô cảm, Đồng hồ bấm giờ vintage 1968, Cửa sổ đón nắng).
// Người dẫn chuyện Kẻ Nghĩ Nhiều đóng vai trò Voiceover thuần túy, hoàn toàn không che chắn khung hình của câu chuyện.
import { figure, expr, blendE, PAL, roi } from '../../../../rig/character.js';
import { cel, path, poly, ellP, line, canvas, W, H, TAU, rect } from '../../../../rig/cel.js';
import { ground, panel, hilite, stamp, bubble, subtitle, tag, text, sharpText, font, ease, seg, clamp01, INK, CREAM, ACCENT, REG, ambientMotes } from '../../../../rig/broll.js';
import * as ST from './stage.js';
import { build } from './timeline.js';

const cv = document.getElementById('c'), G = cv.getContext('2d');
const [buf, B] = canvas(W, H);
let TL, SHOTS, EV = [];

const E = x => typeof x === 'string' ? expr(x) : expr(x[0], x[1]);
function ek(T, keys, bl = 0.14) {
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const cur = E(keys[i][1]); if (i === 0) return cur;
  const u = seg(T, keys[i][0], keys[i][0] + bl); return u >= 1 ? cur : blendE(E(keys[i - 1][1]), cur, ease.inOut(u));
}
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id];
const talkAt = T => TL.talk(T);
const sway = T => Math.sin(T * 0.55) * 0.035;

function shots() {
  const at = (id, d = 0) => L(id).t0 + d;
  const rv = (T, id, a = .3, b = 1.2) => seg(T, at(id, a), at(id, b));

  return [
    // [Góc 1: 0s - ~5.8s] CẬN CẢNH ĐẶC TẢ (Extreme Close-Up): Ngòi bút chấm mực cào sột soạt trên giấy thi 1968
    { n: 'macro_pen', t: 0, tr: 'iris', f(g, lt, T) {
      ST.macroPen(g, T);
      tag(g, 'ĐẠI HỌC COLUMBIA · 1968', 260, 100, seg(T, 0.4, 1.0), { col: PAL.cyan, px: 32 });
    }, ev: () => [[.2, 'music', { cue: 'A' }], [.4, 'amb', { kind: 'room', t1: at('smoke1', .4) }], [.3, 'pop']] },

    // [Góc 2: ~5.8s - ~12.8s] CẬN CẢNH MẶT TUẤN (Medium Close-Up): Tuấn đeo kính tròn, ngước mắt nhìn lên đồng hồ
    { n: 'tuan_face_intro', t: at('intro2', -.1), tr: 'cut', f(g, lt, T) {
      ST.tuanFaceCloseUp(g, T, { emotion: 'neutral', lookUp: true });
    }, ev: () => [[L('intro2').t0 + .3, 'ting']] },

    // [Góc 3: ~12.8s - ~17.8s] GÓC TOÀN TỪ TRÊN CAO (High-Angle Wide): Căn phòng gạch trống trải, Tuấn lọt thỏm ở giữa bàn
    { n: 'room_high_angle', t: at('intro3', -.1), tr: 'cut', f(g, lt, T) {
      ST.columbiaRoom(g, T);
      ST.tuanStudent(g, 960, 610, { emotion: 'neutral', action: 'write' }, T);
      ST.testingDesk(g, T, { confederates: false });
      ambientMotes(g, T, 12, { x0: 200, y0: 200, x1: 1720, y1: 850 });
    }, ev: () => [[L('intro3').t0 + .4, 'paper']] },

    // [Góc 4: ~17.8s - ~21.5s] CẬN CẢNH KHE THÔNG GIÓ CHÂN TƯỜNG (Vent Macro): Lưới sắt rỉ sét, điềm báo nguy hiểm
    { n: 'vent_macro_still', t: at('intro4', -.1), tr: 'cut', f(g, lt, T) {
      ST.ventMacro(g, T, 0);
      const pAlert = rv(T, 'intro4', 0.2, 1.0);
      if (pAlert > 0) {
        g.save(); g.strokeStyle = PAL.red.f; g.lineWidth = 6; g.setLineDash([14, 12]);
        g.beginPath(); g.ellipse(960, 530, 640, 280, 0, 0, TAU); g.stroke();
        g.setLineDash([]); g.restore();
      }
    }, ev: () => [[L('intro4').t0 + .3, 'ting']] },

    // [Góc 5: ~21.5s - ~27.0s] ACTION MACRO: Khói trắng xì ra phì phì từ lưới thông gió
    { n: 'vent_smoke_burst', t: at('smoke1', -.1), tr: 'cut', f(g, lt, T) {
      const t1 = L('smoke1').t0;
      const intensity = seg(T, t1, t1 + 4.5) * 1.1;
      ST.ventMacro(g, T, intensity);
    }, ev: () => [[at('smoke1', -.1), 'music', { cue: 'B' }], [L('smoke1').t0 + .3, 'whoosh']] },

    // [Góc 6: ~27.0s - ~34.5s] PHẢN ỨNG CẬN CẢNH: Tuấn ngửi thấy mùi khét, giật mình hoang mang
    { n: 'tuan_smell_smoke', t: at('smoke2', -.1), tr: 'cut', f(g, lt, T) {
      ST.tuanFaceCloseUp(g, T, { emotion: 'worried', lookRight: true, action: 'cough' });
    }, ev: () => [[L('smoke2').t0 + .6, 'pop']] },

    // [Góc 7: ~34.5s - ~38.5s] KHÓI BÒ TRÊN SÀN & SUY NGHĨ: Tòa nhà cháy thật rồi!
    { n: 'smoke_floor_thought', t: at('smoke3', -.1), tr: 'cut', f(g, lt, T) {
      ST.columbiaRoom(g, T);
      ST.dynamicSmoke(g, T, 0.75);
      ST.tuanStudent(g, 960, 610, { emotion: 'worried', action: 'hesitate', lookRight: true }, T);
      ST.testingDesk(g, T, { confederates: false });
      const pThought = rv(T, 'smoke3', 0.3, 1.2);
      if (pThought > 0) {
        g.save(); g.globalAlpha = Math.min(1, pThought * 1.8);
        bubble(g, 980, 360, 800, 190, (gg) => {
          text(gg, 'Tòa nhà đang cháy thật rồi!', 0, 0, { font: font(800, 42), align: 'center', base: 'middle', fill: PAL.red.s });
        }, { tail: 'left' });
        g.restore();
      }
    }, ev: () => [[L('smoke3').t0 + .3, 'pop']] },

    // [Góc 8: ~38.5s - ~41.8s] TOÀN CẢNH TUẤN MỘT MÌNH TRONG PHÒNG KHÓI
    { n: 'alone_room_view', t: at('alone1', -.1), tr: 'cut', f(g, lt, T) {
      ST.columbiaRoom(g, T);
      ST.dynamicSmoke(g, T, 0.65);
      ST.tuanStudent(g, 960, 610, { emotion: 'worried', action: 'hesitate' }, T);
      ST.testingDesk(g, T, { confederates: false });
    }, ev: () => [[L('alone1').t0 + .3, 'paper']] },

    // [Góc 9: ~41.8s - ~47.2s] HÀNH ĐỘNG THOÁT HIỂM: Tuấn đẩy ghế, chạy vội ra cửa thoát hiểm
    { n: 'tuan_run_escape', t: at('alone2', -.1), tr: 'cut', f(g, lt, T) {
      const t2 = L('alone2').t0;
      ST.columbiaRoom(g, T);
      ST.dynamicSmoke(g, T, 0.7);
      const runProg = seg(T, t2 + 0.5, t2 + 2.8);
      const posX = 960 - runProg * 660; // chạy từ 960 sang cánh cửa ở 300
      ST.tuanStudent(g, posX, 580, { emotion: 'worried', action: 'escape', headPitch: -6 }, T);
      ST.testingDesk(g, T, { confederates: false });
    }, ev: () => [[L('alone2').t0 + .6, 'step'], [L('alone2').t0 + 1.4, 'step']] },

    // [Góc 10: ~47.2s - ~54.5s] MACRO ĐỒNG HỒ BẤM GIỜ: 75% chạy ra báo < 2 phút
    { n: 'stopwatch_alone_stat', t: at('alone3', -.1), tr: 'cut', f(g, lt, T) {
      const t3 = L('alone3').t0;
      const elapsed = Math.min(120, seg(T, t3, t3 + 3.0) * 120);
      ST.stopwatchMacro(g, T, elapsed, {
        label: '75% THOÁT HIỂM',
        labelColor: '#4ADE80',
        sub: 'chạy ra báo cháy trong vòng < 2 phút'
      });
    }, ev: () => [[L('alone3').t0 + .4, 'stamp']] },

    // [Góc 11: ~54.5s - ~62.0s] CẮT CỨNG SANG CĂN PHÒNG THỨ HAI: Có hai người lạ ngồi cạnh
    { n: 'room_two_strangers', t: at('group1', -.1), tr: 'whip', f(g, lt, T) {
      ST.columbiaRoom(g, T);
      ST.passiveActor(g, 620, 620, { s: 0.95 }, T);
      ST.passiveActor(g, 1300, 620, { s: 0.95 }, T);
      ST.tuanStudent(g, 960, 610, { emotion: 'neutral', action: 'write' }, T);
      ST.testingDesk(g, T, { confederates: true });
    }, ev: () => [[at('group1', -.1), 'music', { cue: 'B' }], [at('group1', -.1), 'whoosh'], [L('group2').t0 + .4, 'pop']] },

    // [Góc 12: ~62.0s - ~67.8s] CẬN MẶT NGƯỜI LẠ (Stranger Face): Lạnh tanh như tượng đá, tuyệt đối làm lơ
    { n: 'actor_stone_cold', t: at('group3', -.1), tr: 'cut', f(g, lt, T) {
      ST.strangerFace(g, T);
      tag(g, 'DIỄN VIÊN ĐƯỢC CÀI VÀO: LÀM LƠ 100%', 960, 180, seg(T, L('group3').t0 + 0.3, L('group3').t0 + 1.2), { col: PAL.red, px: 34 });
    }, ev: () => [[L('group3').t0 + .4, 'marker']] },

    // [Góc 13: ~67.8s - ~72.0s] KHÓI CHE MỜ ĐÈN TRẦN: Không khí căng thẳng nghẹt thở
    { n: 'smoke_heavy_ceiling', t: at('group4', -.1), tr: 'cut', f(g, lt, T) {
      ST.columbiaRoom(g, T);
      ST.dynamicSmoke(g, T, 0.95);
      ST.passiveActor(g, 620, 620, { s: 0.95 }, T);
      ST.passiveActor(g, 1300, 620, { s: 0.95 }, T);
      ST.tuanStudent(g, 960, 610, { emotion: 'worried', action: 'cough' }, T);
      ST.testingDesk(g, T, { confederates: true });
    }, ev: () => [[L('group4').t0 + .3, 'whoosh']] },

    // [Góc 14: ~72.0s - ~76.5s] CẬN TUẤN: Ho sặc sụa, mắt trợn trừng liếc nhìn hai bên
    { n: 'tuan_cough_look_around', t: at('group5', -.1), tr: 'cut', f(g, lt, T) {
      ST.tuanFaceCloseUp(g, T, { emotion: 'worried', action: 'cough', lookRight: true });
    }, ev: () => [[L('group5').t0 + .4, 'pop']] },

    // [Góc 15: ~76.5s - ~83.0s] CẬN NGÓN TAY LẬT GIẤY: Người lạ thản nhiên lật trang giấy xoạt
    { n: 'stranger_turn_page', t: at('group6', -.1), tr: 'cut', f(g, lt, T) {
      ST.strangerFace(g, T);
    }, ev: () => [[L('group6').t0 + .6, 'paper']] },

    // [Góc 16: ~83.0s - ~85.5s] GÓC NGHIÊNG CĂNG THẲNG (Dutch Angle / Tense Mid-Shot)
    { n: 'dutch_angle_tension', t: at('hesitate1', -.1), tr: 'cut', f(g, lt, T) {
      g.save(); g.translate(960, 540); g.rotate(-0.04); g.translate(-960, -540);
      ST.columbiaRoom(g, T);
      ST.dynamicSmoke(g, T, 0.88);
      ST.tuanStudent(g, 960, 610, { emotion: 'worried', action: 'hesitate' }, T);
      ST.testingDesk(g, T, { confederates: true });
      g.restore();
    }, ev: () => [[L('hesitate1').t0 + .3, 'ting']] },

    // [Góc 17: ~85.5s - ~90.5s] HÀNH ĐỘNG TUẤN NHỔM DẬY RỒI NGỒI XUỐNG
    { n: 'tuan_half_stand', t: at('hesitate2', -.1), tr: 'cut', f(g, lt, T) {
      const h2 = L('hesitate2').t0;
      ST.columbiaRoom(g, T);
      ST.dynamicSmoke(g, T, 0.9);
      ST.passiveActor(g, 620, 620, { s: 0.95 }, T);
      ST.passiveActor(g, 1300, 620, { s: 0.95 }, T);
      // Nhổm dậy ở giây 1, ngồi thụp xuống ở giây 2.5
      const standLift = Math.sin(clamp01((T - h2) / 3.0) * Math.PI) * 45;
      ST.tuanStudent(g, 960, 610 - standLift, { emotion: 'worried', action: 'hesitate' }, T);
      ST.testingDesk(g, T, { confederates: true });
    }, ev: () => [[L('hesitate2').t0 + .6, 'boing']] },

    // [Góc 18: ~90.5s - ~96.5s] CẬN TUẤN PHẨY KHÓI RỒI GỤC ĐẦU VIẾT TIẾP
    { n: 'tuan_wave_smoke_give_up', t: at('hesitate3', -.1), tr: 'cut', f(g, lt, T) {
      ST.tuanFaceCloseUp(g, T, { emotion: 'worried', action: 'cough', lookRight: false });
    }, ev: () => [[L('hesitate3').t0 + .5, 'paper']] },

    // [Góc 19: ~96.5s - ~101.5s] ẨN DỤ ĐIỆN ẢNH: Hiểu lầm tập thể (Pluralistic Ignorance)
    { n: 'pluralistic_concept', t: at('mech1', -.1), tr: 'cut', f(g, lt, T) {
      ground(g, '#10131E');
      tag(g, 'HIỂU LẦM TẬP THỂ (PLURALISTIC IGNORANCE)', 960, 320, 1, { col: PAL.violet, px: 46 });
      const pChain = rv(T, 'mech1', 0.5, 1.8);
      if (pChain > 0) {
        g.save(); g.globalAlpha = pChain;
        // 3 bóng người bị xích ràng buộc
        for (let i = 0; i < 3; i++) {
          const x = 560 + i * 400, y = 620;
          cel(g, ellP(x, y - 90, 45, 50), { f: '#353D50', s: '#252B3A', l: INK, lw: 3 });
          cel(g, rect(x - 50, y - 40, x + 50, y + 110), { f: '#252B3A', l: INK, lw: 3 });
        }
        line(g, [[560, 620], [1360, 620]], PAL.red.f, 8);
        g.restore();
      }
    }, ev: () => [[L('mech1').t0 + .4, 'marker']] },

    // [Góc 20: ~101.5s - ~108.0s] LƯỚI ÁNH NHÌN CHÉO: Nhìn sang người khác tìm tín hiệu
    { n: 'cross_eyelines', t: at('mech2', -.1), tr: 'cut', f(g, lt, T) {
      ground(g, '#121624');
      const cx = 960, cy = 540;
      // 3 cặp mắt tam giác nhìn nhau
      for (let i = 0; i < 3; i++) {
        const a = i / 3 * TAU - Math.PI / 2;
        const x = cx + Math.cos(a) * 320, y = cy + Math.sin(a) * 240;
        cel(g, ellP(x, y, 70, 70), { f: '#FAF8F5', s: '#DCD6C8', so: [0, 8], l: INK, lw: 3.5 });
        cel(g, ellP(x, y, 22, 22), { f: INK, l: INK, lw: 2 });
      }
      // Các mũi tên nhìn vòng tròn
      P_drawLoopArrows(g, cx, cy, 320, 240, T);
    }, ev: () => [[L('mech2').t0 + .5, 'ting']] },

    // [Góc 21: ~108.0s - ~114.0s] MẶT NẠ BÌNH THẢN (Mask of Calmness)
    { n: 'calm_mask_dilemma', t: at('mech3', -.1), tr: 'cut', f(g, lt, T) {
      ground(g, '#141726');
      const cx = 960, cy = 480;
      // Chiếc mặt nạ mỉm cười giả tạo
      cel(g, ellP(cx, cy, 180, 220), { f: '#F0ECE1', s: '#D4CEBF', so: [0, 12], l: INK, lw: 4 });
      line(g, [[cx - 70, cy - 30], [cx - 20, cy - 34]], INK, 6);
      line(g, [[cx + 20, cy - 34], [cx + 70, cy - 30]], INK, 6);
      line(g, [[cx - 60, cy + 80], [cx, cy + 100], [cx + 60, cy + 80]], INK, 6);
      tag(g, 'SỢ BỊ COI LÀ HOẢNG LOẠN NGỚ NGẨN', cx, 840, 1, { col: PAL.red, px: 38 });
    }, ev: () => [[L('mech3').t0 + .4, 'stamp']] },

    // [Góc 22: ~114.0s - ~120.5s] VÒNG LẶP GƯƠNG MÙ: Kết luận sai lầm rằng không sao
    { n: 'false_conclusion', t: at('mech4', -.1), tr: 'cut', f(g, lt, T) {
      ST.columbiaRoom(g, T);
      ST.dynamicSmoke(g, T, 0.95);
      ST.passiveActor(g, 620, 620, { s: 0.95 }, T);
      ST.passiveActor(g, 1300, 620, { s: 0.95 }, T);
      ST.tuanStudent(g, 960, 610, { emotion: 'worried', action: 'hesitate' }, T);
      ST.testingDesk(g, T, { confederates: true });
    }, ev: () => [[L('mech4').t0 + .4, 'paper']] },

    // [Góc 23: ~120.5s - ~125.0s] ĐỒNG HỒ CÁN MỐC 6 PHÚT (Minute 6 Cutoff)
    { n: 'minute_six_cutoff', t: at('stats1', -.1), tr: 'cut', f(g, lt, T) {
      ST.stopwatchMacro(g, T, 360, {
        label: '6 PHÚT HÍT KHÓI',
        labelColor: '#F04462',
        sub: 'phòng mịt mù, thí nghiệm phải dừng cưỡng chế'
      });
    }, ev: () => [[L('stats1').t0 + .4, 'ting']] },

    // [Góc 24: ~125.0s - ~138.0s] BẢNG ĐỐI KHÁNG CHẤN ĐỘNG: 10% THOÁT HIỂM VS 90% NGỒI YÊN
    { n: 'shocking_contrast_stat', t: at('stats2', -.1), tr: 'cut', f(g, lt, T) {
      ground(g, '#0E111C');
      const cx = 960;
      tag(g, 'KHI CÓ 2 NGƯỜI LẠ NGỒI CẠNH', cx, 180, 1, { col: PAL.cyan, px: 42 });

      // Cột 1: 10% dám đứng dậy
      cel(g, rect(220, 300, 880, 820), { f: '#18241D', s: '#101813', so: [0, 12], l: '#22C55E', lw: 4 });
      text(g, '10%', 550, 480, { font: font(900, 120), align: 'center', fill: '#4ADE80' });
      text(g, 'dám đứng dậy đi báo cháy', 550, 620, { font: font(700, 40), align: 'center', fill: CREAM });

      // Cột 2: 90% ngồi yên hít khói
      cel(g, rect(1040, 300, 1700, 820), { f: '#2B161A', s: '#1C0D10', so: [0, 12], l: '#EF4444', lw: 4 });
      text(g, '90%', 1370, 480, { font: font(900, 120), align: 'center', fill: '#F87171' });
      text(g, 'ngồi yên suốt 6 phút', 1370, 620, { font: font(700, 40), align: 'center', fill: CREAM });
    }, ev: () => [[L('stats2').t0 + .4, 'stamp'], [L('stats3').t0 + .6, 'ting']] },

    // [Góc 25: ~138.0s - ~149.0s] ĐÁM ĐÔNG LÀM TÊ LIỆT TRÁCH NHIỆM
    { n: 'diffusion_paralysis', t: at('action1', -.1), tr: 'cut', f(g, lt, T) {
      ground(g, '#101422');
      tag(g, 'ĐÁM ĐÔNG LÀM TÊ LIỆT TRÁCH NHIỆM', 960, 240, 1, { col: PAL.red, px: 42 });
      // Hình vẽ chiếc loa bị bỏ rơi
      const lx = 960, ly = 580;
      cel(g, poly([[lx - 120, ly - 60], [lx + 100, ly - 140], [lx + 100, ly + 140], [lx - 120, ly + 60]]), { f: '#E2E8F0', s: '#94A3B8', so: [0, 8], l: INK, lw: 4 });
      cel(g, ellP(lx + 100, ly, 28, 140), { f: '#F04462', l: INK, lw: 3 });
      cel(g, rect(lx - 190, ly - 50, lx - 120, ly + 50), { f: '#475569', l: INK, lw: 3 });
    }, ev: () => [[at('action1', -.1), 'music', { cue: 'C' }], [L('action1').t0 + .4, 'whoosh']] },

    // [Góc 26: ~149.0s - 166.3s] CỬA SỔ MỞ TOANG ĐÓN NẮNG VÀNG — Kẻ Nghĩ Nhiều & Rối chào kết
    { n: 'sunlight_resolution', t: at('action3', -.1), tr: 'cut', f(g, lt, T) {
      const a4 = L('action4').t0;
      ST.sunlightWindow(g, T);
      // Kẻ Nghĩ Nhiều và Rối đứng giữa luồng nắng trong 6 giây cuối
      kng(g, 960, 680, { s: 1.15, talk: talkAt(T), E: ek(T, [[0, 'determined'], [a4, 'smile']]), headYaw: sway(T) }, T);
      roi(g, 1180, 520, 1.3, { t: T });
      tag(g, 'HÃY LÀ NGƯỜI ĐẦU TIÊN ĐỨNG DẬY', 960, 820, 1, { col: PAL.hoodie, px: 38 });
    }, ev: () => [[L('action3').t0 + .4, 'whoosh'], [L('action4').t1 + .1, 'music', { cue: 'end' }]] }
  ];
}

function P_drawLoopArrows(g, cx, cy, rx, ry, T) {
  g.save();
  g.strokeStyle = '#E63946'; g.lineWidth = 5; g.setLineDash([16, 12]);
  g.beginPath();
  g.ellipse(cx, cy, rx * 0.85, ry * 0.85, 0, 0, TAU);
  g.stroke();
  g.setLineDash([]);
  g.restore();
}

// ——— transitions engine ———
function drawShot(g, i, T) { const sh = SHOTS[i]; REG.id = sh.n; g.save(); sh.f(g, T - sh.t, T); g.restore(); }
function drawSharp(g, texts, dx) { for (const t of texts) sharpText(g, t, dx); }
function smear(g, i, T, dx) {
  const list = REG.list; REG.list = [];
  B.setTransform(1, 0, 0, 1, 0, 0); B.clearRect(0, 0, W, H);
  REG.skip = true; drawShot(B, i, T); REG.skip = false;
  const texts = REG.list; REG.list = list;
  const n = 7, step = dx > 0 ? 70 : -70;
  for (let k = 0; k < n; k++) { g.globalAlpha = 1 / (k + 1); g.drawImage(buf, dx - step * k, 0); }
  g.globalAlpha = 1; REG.list = list;
  drawSharp(g, texts, dx);
}

function iris(g, p, cx = W / 2, cy = H / 2, col = '#12141F') {
  if (p >= 1) return;
  const maxR = Math.hypot(W, H) * 0.55;
  const r = maxR * Math.max(0, p);
  g.save(); g.fillStyle = col; g.beginPath();
  g.rect(0, 0, W, H); g.arc(cx, cy, r, 0, TAU, true);
  g.fill(); g.restore();
}

window.render = T => {
  const g = G; g.setTransform(1, 0, 0, 1, 0, 0);
  let i = SHOTS.length - 1; while (i > 0 && T < SHOTS[i].t) i--;
  const sh = SHOTS[i], nx = SHOTS[i + 1], WH = 0.16, IR = 0.35;

  drawShot(g, i, T);

  // Chuyển cảnh điện ảnh
  if (sh.tr === 'whip' && T - sh.t < WH) {
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    smear(g, i, T, (1 - ease.out((T - sh.t) / WH)) * W * 0.5);
  } else if (nx && nx.tr === 'whip' && nx.t - T < WH) {
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    smear(g, i, T, -ease.inOut(1 - (nx.t - T) / WH) * W * 0.5);
  } else if (sh.tr === 'iris' && T - sh.t < IR) {
    iris(g, ease.out((T - sh.t) / IR));
  } else if (nx && nx.tr === 'iris' && nx.t - T < IR) {
    iris(g, 1 - ease.in((nx.t - T) / IR));
  }

  // fade in / fade out ở đầu và cuối
  const fo = Math.max(1 - T / 0.25, seg(T, TL.end - 0.6, TL.end));
  if (fo > 0) { g.fillStyle = `rgba(0,0,0,${fo})`; g.fillRect(0, 0, W, H); }

  // end card kênh
  const cp = seg(T, TL.end - 3.8, TL.end - 3.2);
  if (cp > 0) {
    g.fillStyle = `rgba(18,19,26,${cp})`; g.fillRect(0, 0, W, H);
    g.save(); g.globalAlpha = cp;
    text(g, 'TRẠM NGHĨ NHIỀU', W / 2, 452, { font: font(900, 92), align: 'center', fill: PAL.hoodie.f });
    text(g, 'TẬP 05', W / 2, 524, { font: font(800, 46), align: 'center', fill: CREAM });
    text(g, 'hẹn gặp bạn ở tập sau', W / 2, 606, { font: font(400, 46, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    g.restore();
  }

  const activeCue = TL.cues.findLast(c => T >= c.t0 && T < c.t1);
  if (activeCue) subtitle(g, activeCue.text);
};

window.TEXTS = T => { REG.list = []; window.render(T); const l = REG.list; REG.list = null; return l; };

async function setup() {
  const j = p => fetch(p).then(r => r.ok ? r.json() : {});
  const [dur, words, lips] = await Promise.all([j('voice/proc/dur.json'), j('voice/words.json'), j('voice/lips.json')]);
  TL = build(dur, words, lips);
  SHOTS = shots();
  for (const sh of SHOTS) for (const [t, type, x] of (sh.ev ? sh.ev() : [])) EV.push({ t: +t.toFixed(3), type, shot: sh.n, ...(x || {}) });
  for (const id in TL.L) EV.push({ t: TL.L[id].t0, type: 'voice', id });
  EV.sort((a, b) => a.t - b.t);
  window.EV = EV;
  window.DUR = +TL.end.toFixed(2);
  window.CUES = TL.cues;
  window.SHOTS = SHOTS.map(s => ({ n: s.n, t: s.t }));
  await Promise.all(['900 40px "Be Vietnam Pro"', '800 40px "Be Vietnam Pro"', '700 40px "Be Vietnam Pro"', '400 40px "Patrick Hand"'].map(f => document.fonts.load(f, 'ẠẾỘữ')));
  window.render(0);
  window.READY = true;
}
setup();
