// "Hội chứng Kẻ Giả Mạo — Tại sao càng nỗ lực, càng sợ bị vạch trần?" — Tập 04 của Trạm Nghĩ Nhiều.
// Refactored into 16 cohesive Scene Blocks with tactile physical metaphors (high jump, gold trophy, treadmill, wax ledger)
// and diverse transition grammar (Cut, Iris, Whip pan on major shifts only).
import { figure, expr, blendE, PAL, roi } from '../../../../rig/character.js';
import { cel, path, poly, ellP, line, canvas, W, H, TAU, rect } from '../../../../rig/cel.js';
import { ground, panel, hilite, stamp, bubble, subtitle, tag, text, sharpText, font, ease, seg, clamp01, INK, CREAM, ACCENT, REG } from '../../../../rig/broll.js';
import * as S from '../../../../rig/sets.js';
import * as ST from './stage.js';
import * as P from './paper.js';
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
const lerp = (a, b, u) => a + (b - a) * u;
function ak(T, keys, d = 0.34) {
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const c = keys[i][1]; if (i === 0) return c;
  const p = keys[i - 1][1], u = ease.back(seg(T, keys[i][0], keys[i][0] + d)), v = ease.inOut(seg(T, keys[i][0], keys[i][0] + d * 0.7));
  return {
    ...(v < 0.5 ? p : c),
    at: [lerp(p.at[0], c.at[0], u), lerp(p.at[1], c.at[1], u)],
    rot: lerp(p.rot || 0, c.rot || 0, v),
    gest: v < 0.5 ? (p.gest || 'relaxed') : (c.gest || 'relaxed')
  };
}

const BLINKS = []; { let s = 29, t = 1.0; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 750) { BLINKS.push(t); if (r() < 0.2) BLINKS.push(t + 0.28); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < 0.16) return Math.sin(d / 0.16 * Math.PI); } return 0; }
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id];
const talkAt = T => TL.talk(T);
const sway = T => Math.sin(T * 0.55) * 0.035;
const BINK = '#101320';

function page(g, T, t0, drawFn, o = {}) {
  P.deskScene(g, T, o);
  P.sheet(g, T, { p: seg(T, t0 - 0.2, t0 + 0.4) });
  P.withPage(g, gg => drawFn(gg, T, T - t0));
}

// ——— 16 Scene Blocks ———
function shots() {
  const at = (id, d = 0) => L(id).t0 + d;
  const rv = (T, id, a = .3, b = 1.2) => seg(T, at(id, a), at(id, b));

  return [
    // [Khối 1: 0:00 - ~0:15] Phòng họp kết thúc bài thuyết trình (hook, hook2, hook3)
    { n: 'meet', t: 0, tr: 'iris', f(g, lt, T) {
      const t0 = L('hook').t0, t2 = L('hook2').t0, t3 = L('hook3').t0;
      ST.meetingBack(g, T, {});
      kng(g, 1440, 330, { s: .95, talk: talkAt(T), E: ek(T, [[0, 'determined'], [t0 + 2, 'smile'], [t3 + 0.8, 'embarrassed']]), headYaw: -.12 + sway(T), headPitch: .04 }, T);
      ST.meetingFront(g, T, {});
      tag(g, 'PHÒNG HỌP', 190, 130, seg(T, .2, .8), { col: PAL.hoodie, px: 34 });

      // hook2: lời khen của đồng nghiệp xuất hiện êm ái nội cảnh
      const bp = seg(T, t2 + .3, t2 + .8);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        bubble(g, 560, 250, 900, 210, (gg) => {
          text(gg, 'Phần này làm tốt lắm,', 0, -34, { font: font(800, 44), align: 'center', base: 'middle', fill: BINK });
          text(gg, 'cảm ơn cậu.', 0, 34, { font: font(800, 44), align: 'center', base: 'middle', fill: PAL.violet.s });
        }, { tail: 'left' });
        g.restore();
      }

      // hook3: những cái bắt tay chúc mừng, nhân vật bẽn lẽn
      const hp = seg(T, t3 + .4, t3 + .9);
      if (hp > 0) {
        g.save(); g.globalAlpha = Math.min(1, hp * 2);
        for (let i = 0; i < 3; i++) {
          const x = 300 + i * 140, y = 640 - i * 16;
          cel(g, ellP(x, y, 26, 26), { f: PAL.skin.f, s: PAL.skin.s, so: [-4, 4], l: PAL.ink, lw: 2.4 });
        }
        g.restore();
      }
    }, ev: () => [[.2, 'music', { cue: 'A' }], [.6, 'amb', { kind: 'low', t1: at('hook4', .4) }], [.3, 'pop'], [L('hook2').t0 + .3, 'pop'], [L('hook3').t0 + .4, 'pop']] },

    // [Khối 2: ~0:15 - ~0:26] Hành lang vắng và tiếng nói nội tâm (hook4, hook5)
    // Chuyển cảnh whip pan hợp lý vì đổi không gian từ phòng họp ra hành lang
    { n: 'corridor', t: at('hook4', -.1), tr: 'whip', f(g, lt, T) {
      const t4 = L('hook4').t0, t5 = L('hook5').t0;
      ST.corridor(g, T, {});
      const isWalk = T < t5 + 0.3;
      const posX = isWalk ? 560 + seg(T, t4, t5) * 320 : 880;
      kng(g, posX, 470, { s: .8, legs: { mode: isWalk ? 'walk' : 'stand', ph: T * 1.05 }, talk: talkAt(T), E: ek(T, [[0, 'smile'], [t4 + 1.6, 'worried'], [t5 + 1.2, 'worried']]), headYaw: .14, headPitch: .08 }, T);

      // hook5: suy nghĩ sợ bị phát hiện hiện lên trong cùng hành lang (không whip pan)
      const bp = seg(T, t5 + .5, t5 + 1.1);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 1.6);
        bubble(g, posX - 320, 270, 740, 210, (gg) => {
          P.pHand(gg, 'lỡ họ biết mình', 0, -32, { size: 44, align: 'center', p: rv(T, 'hook5', .5, 1.6) });
          P.pHand(gg, 'thật ra không đủ thì sao?', 0, 32, { size: 44, align: 'center', p: rv(T, 'hook5', 1.4, 2.6) });
        }, { tail: 'right' });
        g.restore();
      }
    }, ev: () => [[at('hook4', -.1), 'whoosh'], [at('hook4', -.1) + .3, 'step'], [L('hook4').t0 + .8, 'step'], [L('hook5').t0 + .5, 'boing']] },

    // [Khối 3: ~0:26 - ~0:33] Cận cảnh bàn tay siết chặt cuốn sổ (hook6)
    { n: 'hands', t: at('hook6', -.1), tr: 'iris', f(g, lt, T) {
      ground(g, '#101320');
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      cel(g, rect(400, 560, 1400, 930), { f: '#4A3626', s: '#33241A', so: [0, 10], l: '#140E08', lw: 3.4 });
      line(g, [[400, 560], [1400, 560]], '#6B4E35', 5);
      cel(g, rect(470, 600, 810, 730), { f: '#4A4260', s: '#332C46', so: [0, 8], l: '#12131A', lw: 3 });
      cel(g, rect(500, 620, 780, 640), { f: '#FAF8F5', s: '#DCD6C8', l: '#12131A', lw: 2 });
      cel(g, ellP(390, 690, 62, 44), { f: PAL.skin.f, s: PAL.skin.s, so: [-6, 4], l: PAL.ink, lw: 2.6 });
      cel(g, ellP(890, 690, 62, 44), { f: PAL.skin.f, s: PAL.skin.s, so: [6, 4], l: PAL.ink, lw: 2.6 });
      const pool = g.createRadialGradient(640, 700, 30, 640, 700, 620);
      pool.addColorStop(0, 'rgba(255,183,3,.14)'); pool.addColorStop(1, 'rgba(255,183,3,0)');
      g.fillStyle = pool; g.fillRect(80, 380, 1240, 700);
      S.roomFront(g, T, cam);
    }, ev: () => [[L('hook6').t0 + .4, 'paper']] },

    // [Khối 4: ~0:33 - ~0:56] Toàn cảnh bàn làm việc & Lời chào Kẻ Nghĩ Nhiều (intro, intro2)
    // Cắt góc máy trực tiếp (Direct Cut) từ cận bàn sang toàn cảnh
    { n: 'intro', t: at('intro', -.2), tr: 'cut', f(g, lt, T) {
      const t0 = L('intro').t0, t2 = L('intro2').t0;
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      kng(g, 1290, 640, { s: 1.15, talk: talkAt(T), E: ek(T, [[0, 'smile'], [t0 + 2, 'talk'], [t2 + 1.8, 'determined']]), headYaw: -.1 + sway(T), headPitch: .05 }, T);
      roi(g, 760, 640, 1.5, { t: T });
      S.roomFront(g, T, cam);
      tag(g, 'KẺ NGHĨ NHIỀU', 1600, 250, seg(T, t0 + .4, t0 + .9), { col: PAL.hoodie, px: 32 });

      // intro2: Lời khẳng định hiện lên trong cùng cảnh bàn làm việc (không whip pan)
      const bp = seg(T, t2 + .3, t2 + .8);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        bubble(g, 450, 330, 860, 190, (gg) => {
          text(gg, 'Đây không phải tính cách', 0, -26, { font: font(800, 42), align: 'center', base: 'middle', fill: BINK });
          text(gg, 'của bạn.', 0, 30, { font: font(800, 42), align: 'center', base: 'middle', fill: BINK });
        }, { tail: 'right' });
        g.restore();
      }
    }, ev: () => [[at('intro', -.2), 'music', { cue: 'B' }], [at('intro', -.2), 'amb', { kind: 'room', t1: at('c1_1', .4) }], [at('intro', -.2) + .1, 'pop'], [L('intro2').t0 + .3, 'boing']] },

    // [Khối 5: ~0:56 - ~1:08] Bàn nghiên cứu: Cỗ máy gồm 3 bánh răng (intro3)
    { n: 'intro3', t: at('intro3', -.1), tr: 'cut', f(g, lt, T) {
      const t0 = L('intro3').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'CỖ MÁY CÓ BA BÁNH RĂNG', 90, 130, { size: 66, p: rv(T, 'intro3', .3, 1.3) });
        P.pGear(gg, 420, 400, 150, 12, .3 + T * 0.05, { p: rv(T, 'intro3', 1, 1.8), col: P.INK });
        P.pGear(gg, 700, 460, 120, 10, -.2 - T * 0.06, { p: rv(T, 'intro3', 1.5, 2.3), col: P.INK });
        P.pGear(gg, 900, 380, 100, 8, .5 + T * 0.08, { p: rv(T, 'intro3', 2, 2.8), col: P.INK });
      });
    }, ev: () => [[L('intro3').t0 + .4, 'marker'], [L('intro3').t0 + 1.2, 'marker']] },

    // [Khối 6: ~1:08 - ~2:05] Hồ sơ nghiên cứu gốc 1978 — Clance & Imes (c1_1 đến c1_5)
    // Toàn bộ câu chuyện lịch sử 1978 diễn ra trên cùng trang tài liệu, nội dung trượt vào tự nhiên
    { n: 'c1_history', t: at('c1_1', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_1').t0;
      page(g, T, t0, (gg) => {
        // c1_1: Năm 1978
        P.pNum(gg, '1978', 110, 220, { size: 160, p: rv(T, 'c1_1', .3, 1.3) });
        P.pHand(gg, 'Clance & Imes', 110, 300, { size: 50, p: rv(T, 'c1_1', .8, 1.7) });
        P.pNote(gg, 'Psychotherapy, 15(3), 241–247', 110, 370, { size: 30, p: rv(T, 'c1_1', 1.2, 2) });

        // c1_2: 150+ người phụ nữ thành công
        const p150 = rv(T, 'c1_2', .3, 1.3);
        if (p150 > 0) {
          gg.globalAlpha = p150;
          P.pNum(gg, '150+', 760, 220, { size: 160, p: p150 });
          P.pHand(gg, 'phụ nữ thành công', 760, 300, { size: 48, p: p150 });
          for (let i = 0; i < 16; i++) {
            const x = 760 + (i % 8) * 88, y = 340 + Math.floor(i / 8) * 64;
            cel(gg, ellP(x, y, 18, 20), { f: '#B9B2A2', s: '#9A9284', l: P.INK, lw: 2 });
          }
        }

        // c1_3: Những lời thú nhận thật
        const pQuotes = rv(T, 'c1_3', .3, 1.3);
        if (pQuotes > 0) {
          gg.globalAlpha = pQuotes;
          P.pHand(gg, '“mình không đủ giỏi để ở đây”', 110, 480, { size: 42, col: PAL.red.s, p: pQuotes });
          P.pHand(gg, '“khả năng của tôi bị đánh giá quá cao”', 110, 540, { size: 42, col: PAL.red.s, p: rv(T, 'c1_3', 1, 1.8) });
        }

        // c1_4: Đặt tên Hiện tượng Kẻ Giả Mạo
        const pName = rv(T, 'c1_4', .3, 1.4);
        if (pName > 0) {
          gg.globalAlpha = pName;
          P.pTitle(gg, 'HIỆN TƯỢNG KẺ GIẢ MẠO', 110, 640, { size: 68, col: PAL.violet.s, p: pName });
        }

        // c1_5: Nỗi sợ bị vạch trần
        const pFear = rv(T, 'c1_5', .3, 1.3);
        if (pFear > 0) {
          stamp(gg, 'SỢ BỊ VẠCH TRẦN', 1280, 540, { px: 52, rot: -.12, p: pFear, col: PAL.red.f });
        }
      });
    }, ev: () => [[at('c1_1', -.1), 'music', { cue: 'C' }], [at('c1_1', -.1), 'amb', { kind: 'room', t1: at('c4_1', .4) }], [at('c1_1', -.1), 'whoosh'], [L('c1_1').t0 + .3, 'marker'], [L('c1_2').t0 + .3, 'marker'], [L('c1_4').t0 + .4, 'stamp']] },

    // [Khối 7: ~2:05 - ~3:05] Tổng quan số liệu Bravata 2020: Thước đo tỷ lệ 9%–82% (c1_6 đến c1_19)
    { n: 'c1_stats', t: at('c1_6', -.1), tr: 'cut', f(g, lt, T) {
      const t0 = L('c1_6').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'TỈ LỆ CÓ CẢM GIÁC KẺ GIẢ MẠO', 90, 140, { size: 54, p: rv(T, 'c1_9', .3, 1.3) });

        P.pNum(gg, '62', 110, 260, { size: 140, p: rv(T, 'c1_8', .3, 1.3) });
        P.pHand(gg, 'nghiên cứu tổng hợp', 110, 330, { size: 40, p: rv(T, 'c1_8', 1, 1.8) });
        P.pNum(gg, '14.161', 620, 260, { size: 140, p: rv(T, 'c1_8', 1.5, 2.4) });
        P.pHand(gg, 'người tham gia', 620, 330, { size: 40, p: rv(T, 'c1_8', 1.9, 2.7) });

        const pBar = rv(T, 'c1_9', 1.1, 2.2);
        if (pBar > 0) {
          const x0 = 140, x1 = 1480, y = 470;
          line(gg, [[x0, y], [x1, y]], P.INK, 5);
          for (let i = 0; i <= 10; i++) line(gg, [[x0 + (x1 - x0) * i / 10, y - 12], [x0 + (x1 - x0) * i / 10, y + 12]], P.INK, 4);
          const a = x0 + (x1 - x0) * .09, b = x0 + (x1 - x0) * .82;
          line(gg, [[a, y - 60], [a, y + 60]], PAL.green.f, 8);
          line(gg, [[b, y - 60], [b, y + 60]], PAL.red.f, 8);
          gg.globalAlpha = pBar;
          P.pNum(gg, '9%', a, y - 90, { size: 76, align: 'center', col: PAL.green.s, p: pBar });
          P.pNum(gg, '82%', b, y - 90, { size: 76, align: 'center', col: PAL.red.s, p: pBar });
        }

        // c1_13: Không phải bệnh lý
        const pNoPath = rv(T, 'c1_13', .3, 1.3);
        if (pNoPath > 0) {
          stamp(gg, 'KHÔNG PHẢI BỆNH LÝ', 1240, 260, { px: 46, rot: .08, p: pNoPath, col: PAL.green.f });
        }
        P.pNote(gg, 'Bravata và cộng sự, 2020', 90, 700, { size: 30, p: rv(T, 'c1_10', 1.1, 1.9) });
      });
    }, ev: () => [[L('c1_8').t0 + .4, 'marker'], [L('c1_9').t0 + 1.2, 'marker'], [L('c1_13').t0 + .4, 'stamp']] },

    // [Khối 8: ~3:05 - ~4:15] Bánh răng 1: Thước đo tự tăng & Đạo cụ CỘT XÀ NHẢY CAO (c2_2 đến c2_6)
    // Ẩn dụ vật lý: Cột xà nhảy cao tự động nâng cao hơn mỗi khi nhảy qua
    { n: 'gear1_highjump', t: at('c2_2', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c2_2').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'BÁNH RĂNG 1: THƯỚC ĐO TỰ TĂNG', 90, 140, { size: 58, p: rv(T, 'c2_2', .3, 1.3) });

        // Đạo cụ Cột xà nhảy cao (High Jump) ở trung tâm
        const raiseProgress = rv(T, 'c2_4', .5, 2.5);
        P.pHighJump(gg, 420, 480, 1.4, { p: rv(T, 'c2_2', .6, 1.5), raise: raiseProgress });

        P.pHand(gg, 'vừa nhảy qua mức cũ', 700, 340, { size: 48, p: rv(T, 'c2_2', 1.2, 2.2) });
        P.pHand(gg, 'xà tự động nâng lên gấp đôi', 700, 420, { size: 48, col: PAL.red.s, p: rv(T, 'c2_4', .8, 1.8) });

        // c2_6: Locke & Latham 35 năm nghiên cứu
        const pLocke = rv(T, 'c2_6', .3, 1.4);
        if (pLocke > 0) {
          P.pNum(gg, '35 năm', 700, 560, { size: 100, p: pLocke });
          P.pNote(gg, 'Locke & Latham, 2002: Mục tiêu tự đặt luôn đẩy xa hơn', 700, 620, { size: 32, p: pLocke });
        }
      });
    }, ev: () => [[at('c2_2', -.1), 'music', { cue: 'D' }], [at('c2_2', -.1), 'whoosh'], [L('c2_2').t0 + .4, 'marker'], [L('c2_4').t0 + .8, 'ting']] },

    // [Khối 9: ~4:15 - ~5:10] Bánh răng 2: Quy công ra ngoài & Đạo cụ CÚP VÀNG TRÙM KHĂN (c2_9 đến c2_34)
    // Ẩn dụ vật lý: Cúp vàng thành tích bị trùm khăn giấu đi vì cho rằng do may mắn
    { n: 'gear2_trophy', t: at('c2_9', -.1), tr: 'cut', f(g, lt, T) {
      const t0 = L('c2_9').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'BÁNH RĂNG 2: QUY CÔNG RA NGOÀI', 90, 140, { size: 58, p: rv(T, 'c2_9', .3, 1.3) });

        // Đạo cụ Chiếc cúp vàng với khăn che
        const clothCover = rv(T, 'c2_10', .3, 2.0);
        P.pTrophy(gg, 400, 430, 1.5, { p: rv(T, 'c2_9', .6, 1.5), cloth: clothCover });

        P.pHand(gg, 'Thành công → Trùm khăn, coi do may mắn', 680, 360, { size: 46, col: PAL.green.s, p: rv(T, 'c2_10', .4, 1.5) });
        P.pHand(gg, 'Thất bại → Nhận hết về mình, tự dằn vặt', 680, 450, { size: 46, col: PAL.red.s, p: rv(T, 'c2_11', .4, 1.5) });

        // c2_33: Thí nghiệm 2023 trên 170 người
        const pIbr = rv(T, 'c2_33', .3, 1.4);
        if (pIbr > 0) {
          P.pNum(gg, '170 người', 680, 580, { size: 90, p: pIbr });
          P.pNote(gg, 'Ibrahim et al., 2023: Thiên lệch không tự phục vụ (non-self-serving bias)', 680, 640, { size: 30, p: pIbr });
        }
      });
    }, ev: () => [[L('c2_9').t0 + .4, 'marker'], [L('c2_10').t0 + .8, 'paper'], [L('c2_33').t0 + .5, 'marker']] },

    // [Khối 10: ~5:10 - ~6:10] Bánh răng 3: Chỉ nhớ lần vấp & Đèn Spotlight rọi áo xấu hổ (c2_15 đến c2_37)
    { n: 'gear3_spotlight', t: at('c2_15', -.1), tr: 'cut', f(g, lt, T) {
      const t0 = L('c2_15').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'BÁNH RĂNG 3: CHỈ NHỚ LẦN BỊ THẤY', 90, 140, { size: 56, p: rv(T, 'c2_15', .3, 1.3) });

        // 20 khung khen phủ mờ vs 1 mẩu giấy đỏ bị gạch chéo
        for (let i = 0; i < 20; i++) {
          const x = 120 + (i % 10) * 140, y = 260 + Math.floor(i / 10) * 90;
          const bad = i === 13, p = rv(T, 'c2_16', .2 + i * .05, .8 + i * .05);
          if (p > 0) {
            gg.globalAlpha = p;
            cel(gg, rect(x, y - 26, x + 100, y + 26), { f: bad ? '#E7A9A9' : '#DCD6C6', s: bad ? '#C97F7F' : '#C3BBA8', l: P.INK, lw: 2.6 });
            if (bad) P.pMark(gg, x + 50, y, { s: 34, col: PAL.red.f, kind: 'cross', p });
          }
        }
        P.pHand(gg, '20 lần tốt bạn quên · 1 lần vấp nhớ cả năm', 120, 480, { size: 44, p: rv(T, 'c2_16', 1.5, 2.6) });

        // Spotlight & Chiếc áo T-shirt Barry Manilow (c2_19 đến c2_21)
        const pTshirt = rv(T, 'c2_20', .3, 1.4);
        if (pTshirt > 0) {
          P.pTshirt(gg, 320, 630, 1.1, { p: pTshirt });
          P.pHand(gg, 'Đoán 50% người để ý → Thực tế chỉ 23%', 520, 620, { size: 46, col: PAL.violet.s, p: pTshirt });
          P.pNote(gg, 'Gilovich, Medvec & Savitsky, 2000 (Spotlight Effect)', 520, 670, { size: 30, p: pTshirt });
        }
      });
    }, ev: () => [[L('c2_15').t0 + .4, 'marker'], [L('c2_16').t0 + 1.2, 'stamp'], [L('c2_20').t0 + .5, 'pop']] },

    // [Khối 11A: ~4:41 - ~5:10] Vì sao càng nỗ lực càng sợ & Chỗ trống tri thức (c3_1 đến c3_5)
    { n: 'c3_gap', t: at('c3_1', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c3_1').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'TẠI SAO CÀNG NỖ LỰC, CÀNG SỢ?', 90, 140, { size: 54, p: rv(T, 'c3_1', .3, 1.4) });
        P.pHand(gg, 'càng biết nhiều · càng thấy chỗ trống lớn hơn', 90, 230, { size: 44, p: rv(T, 'c3_3', .3, 1.3) });

        // Vùng tri thức: phần đã biết vs chỗ trống lớn dần
        const pBox = rv(T, 'c3_3', 1, 2);
        if (pBox > 0) {
          gg.globalAlpha = pBox;
          const x0 = 160, x1 = 1460, y = 320, h = 200;
          cel(gg, rect(x0, y, x1, y + h), { f: '#E4DECF', s: '#CDC6B6', l: P.INK, lw: 4 });
          const k = rv(T, 'c3_4', .3, 1.6);
          if (k > 0) {
            const cut = x0 + (x1 - x0) * (1 - .55 * k);
            cel(gg, rect(cut, y, x1, y + h), { f: '#8F96AC', s: '#6E7488', l: P.INK, lw: 4 });
            P.pHand(gg, 'chỗ trống lớn dần', (cut + x1) / 2, y + 120, { size: 40, align: 'center', col: '#FAF8F5', p: k });
          }
          P.pHand(gg, 'phần đã biết', x0 + 40, y + 120, { size: 40, col: P.INK, p: pBox });
        }
        P.pHand(gg, 'học càng sâu, ranh giới vô tri càng rộng', 90, 680, { size: 42, p: rv(T, 'c3_4', 1.2, 2.4) });
      });
    }, ev: () => [[at('c3_1', -.1), 'music', { cue: 'E' }], [at('c3_1', -.1), 'whoosh'], [L('c3_1').t0 + .4, 'marker'], [L('c3_3').t0 + 1, 'marker']] },

    // [Khối 11B: ~5:10 - ~5:50] Cán cân tâm lý: Thất bại đau hơn thành công vui (c3_6 đến c3_20)
    { n: 'c3_loss', t: at('c3_6', -.1), tr: 'cut', f(g, lt, T) {
      const t0 = L('c3_6').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'THẤT BẠI ĐAU HƠN THÀNH CÔNG VUI', 90, 140, { size: 56, p: rv(T, 'c3_6', .3, 1.3) });
        const p = rv(T, 'c3_6', .8, 1.8);
        if (p > 0) {
          P.balance(gg, 800, 390, 1.2, .24);
          P.pHand(gg, 'thành công', 560, 260, { size: 46, col: PAL.green.s, p });
          P.pHand(gg, 'thất bại', 1040, 580, { size: 46, col: PAL.red.s, p });
        }
        P.pHand(gg, 'Tâm lý sợ mất mát (Loss Aversion): Nỗi đau gấp đôi niềm vui', 90, 680, { size: 44, p: rv(T, 'c3_7', .3, 1.5) });
      });
    }, ev: () => [[L('c3_6').t0 + .5, 'marker']] },

    // [Khối 11C: ~5:50 - ~6:05] Vòng xoáy 1978 & Đạo cụ MÁY CHẠY BỘ MẶT NẠ GIẤY (c3_21 đến c3_22)
    { n: 'c3_treadmill', t: at('c3_21', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c3_21').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'VÒNG XOÁY NĂM 1978: CÀNG LÀM, CÀNG SỢ', 90, 140, { size: 56, p: rv(T, 'c3_21', .3, 1.4) });
        const crack = rv(T, 'c3_22', .3, 2);
        P.pTreadmill(gg, 400, 440, 1.5, { p: rv(T, 'c3_21', .5, 1.5), t: T, crack });

        const nodes = ['lo lắng', 'nỗ lực quá mức', 'thành công', 'sợ bị lộ'];
        const cx = 1100, cy = 440, R = 180;
        const pCycle = rv(T, 'c3_21', .8, 2.0);
        if (pCycle > 0) {
          gg.globalAlpha = pCycle;
          const pts = nodes.map((n, i) => [cx + Math.cos(-Math.PI / 2 + i / nodes.length * TAU) * R, cy + Math.sin(-Math.PI / 2 + i / nodes.length * TAU) * R]);
          pts.forEach((q, i) => {
            const nx = pts[(i + 1) % pts.length];
            P.pArrow(gg, q[0], q[1], nx[0], nx[1], { w: 4, p: pCycle, col: P.INK });
          });
          pts.forEach((q, i) => {
            cel(gg, ellP(q[0], q[1], 110, 36), { f: '#E4DECF', s: '#CDC6B6', l: P.INK, lw: 2.6 });
            P.pHand(gg, nodes[i], q[0], q[1] + 12, { size: 34, align: 'center', p: pCycle });
          });
        }
        P.pHand(gg, 'càng làm càng sợ · càng sợ càng làm', 90, 690, { size: 46, col: PAL.red.s, p: rv(T, 'c3_13', .3, 1.5) });
      });
    }, ev: () => [[at('c3_21', -.1), 'whoosh'], [L('c3_21').t0 + .4, 'marker'], [L('c3_22').t0 + .6, 'ting']] },
    // [Khối 12: ~7:05 - ~7:35] Cán cân Dunning-Kruger 1999 (c3_14 đến c3_18)
    { n: 'dunning_balance', t: at('c3_14', -.1), tr: 'cut', f(g, lt, T) {
      const t0 = L('c3_14').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'NGHIÊN CỨU 1999 NÓI NGƯỢC LẠI', 90, 140, { size: 56, p: rv(T, 'c3_14', .3, 1.3) });

        // Cán cân so sánh
        const pBal = rv(T, 'c3_17', .3, 1.5);
        if (pBal > 0) {
          P.balance(gg, 800, 380, 1.2, -.18);
          P.pHand(gg, 'Nhóm yếu nhất: Điểm thật thứ 12 → Tự đoán thứ 62', 240, 560, { size: 44, col: PAL.red.s, p: pBal });
          P.pNote(gg, 'Kruger & Dunning, 1999 (Unskilled and Unaware of It)', 240, 620, { size: 30, p: pBal });
          P.pHand(gg, 'Người mắc impostor: Ngược lại — có năng lực nhưng đánh giá thấp mình', 240, 680, { size: 42, col: PAL.green.s, p: rv(T, 'c3_18', .3, 1.4) });
        }
      });
    }, ev: () => [[L('c3_14').t0 + .4, 'stamp'], [L('c3_17').t0 + .6, 'marker']] },

    // [Khối 13: ~7:35 - ~8:20] Cái giá: Văn phòng đêm, đồng hồ quay và ghế trống (c4_2 đến c4_7)
    { n: 'night_office', t: at('c4_2', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c4_2').t0;
      ground(g, '#111320');
      // Dàn ghế phòng họp với chiếc ghế trống nổi bật
      const chairs = [[420, 760, .78], [760, 690, .92], [1180, 680, .95], [1520, 750, .82]];
      const empty = [1400, 900, .7];
      const drawChair = (x, y, s, col, seatCol, tilt) => {
        g.save(); g.translate(x, y); g.scale(s, s); g.rotate(tilt);
        cel(g, rect(-100, -150, 100, -70), { f: col, s: seatCol, so: [0, 6], l: PAL.ink, lw: 3 });
        cel(g, rect(-115, -70, 115, -20), { f: col, s: seatCol, so: [0, 6], l: PAL.ink, lw: 3 });
        cel(g, rect(-100, -20, -78, 70), { f: seatCol, s: seatCol, l: PAL.ink, lw: 3 });
        cel(g, rect(78, -20, 100, 70), { f: seatCol, s: seatCol, l: PAL.ink, lw: 3 });
        g.restore();
      };
      chairs.forEach(c => drawChair(c[0], c[1], c[2], '#3A4260', '#252C40', 0));
      drawChair(empty[0], empty[1], empty[2], '#2A3040', '#1B1F2C', .18);

      // Đồng hồ quay nhanh chỉ 1h sáng và pin đỏ nhấp nháy
      P.clockFace(g, 360, 280, 110, 1 + T * 0.2);
      tag(g, 'KIỆT SỨC · LO ÂU', 280, 440, seg(T, t0 + .4, t0 + .9), { col: PAL.red, px: 32 });

      const bp = seg(T, t0 + .5, t0 + 1.2);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        bubble(g, 980, 300, 860, 200, (gg) => {
          text(gg, 'Chiếc ghế mà không ai ngồi:', 0, -26, { font: font(800, 40), align: 'center', base: 'middle', fill: BINK });
          text(gg, 'vai trò dẫn dắt bị bỏ lỡ.', 0, 30, { font: font(800, 40), align: 'center', base: 'middle', fill: PAL.red.s });
        }, { tail: 'right' });
        g.restore();
      }
    }, ev: () => [[at('c4_2', -.1), 'music', { cue: 'F' }], [at('c4_2', -.1), 'whoosh'], [L('c4_2').t0 + .9, 'paper'], [L('c4_10').t0 + .5, 'pop']] },

    // [Khối 14: ~8:20 - ~8:50] Rà soát can thiệp 2024 (c5_20 đến c5_25)
    { n: 'interv_review', t: at('c5_20', -.1), tr: 'cut', f(g, lt, T) {
      const t0 = L('c5_20').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'RÀ SOÁT CÁC CAN THIỆP 2024', 90, 140, { size: 56, p: rv(T, 'c5_20', .3, 1.3) });
        P.pNum(gg, '31', 110, 310, { size: 160, p: rv(T, 'c5_20', .4, 1.4) });
        P.pHand(gg, 'nghiên cứu can thiệp', 110, 380, { size: 44, p: rv(T, 'c5_20', 1.2, 2.1) });

        P.pNum(gg, '1.017', 680, 310, { size: 160, p: rv(T, 'c5_22', .3, 1.3) });
        P.pHand(gg, 'người thử nghiệm có nhóm chứng', 680, 380, { size: 44, p: rv(T, 'c5_22', 1, 1.9) });

        P.pHand(gg, 'Kết quả: Giảm kiệt sức · Tăng tự thương (self-compassion)', 110, 560, { size: 46, col: PAL.green.s, p: rv(T, 'c5_22', 1.8, 2.8) });
        P.pNote(gg, 'Para et al., 2024: Frontiers in Psychology', 110, 640, { size: 30, p: rv(T, 'c5_22', 2.2, 3) });
      });
    }, ev: () => [[at('c5_20', -.1), 'music', { cue: 'G' }], [L('c5_20').t0 + .4, 'marker'], [L('c5_22').t0 + .4, 'marker']] },

    // [Khối 15: ~8:50 - ~9:55] Giải pháp: SỔ BẰNG CHỨNG BẤT ĐỐI XỨNG & CON DẤU ĐỎ (c5_4 đến c5_18)
    // Ẩn dụ vật lý: Cuốn sổ da thật, nét mực ướt và con dấu sáp đỏ "XÁC NHẬN"
    { n: 'evidence_ledger', t: at('c5_4', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c5_4').t0;
      page(g, T, t0, (gg) => {
        P.pTitle(gg, 'SỔ BẰNG CHỨNG BẤT ĐỐI XỨNG', 90, 140, { size: 58, p: rv(T, 'c5_4', .3, 1.4) });

        // Cuốn sổ mở rộng ở trung tâm
        P.notebook(gg, 810, 450, 1280, 520, { p: rv(T, 'c5_6', .3, 1.2) });

        // Quy tắc 1: Tên người cụ thể
        const pR1 = rv(T, 'c5_6', .8, 1.8);
        if (pR1 > 0) {
          P.pHand(gg, 'Quy tắc 1: Có tên người cụ thể xác nhận', 240, 280, { size: 42, col: PAL.violet.s, p: pR1 });
          P.pHand(gg, '— Báo cáo tháng 3: Sếp ghi nhận (chị Lan)', 260, 360, { size: 38, p: pR1 });
          // Con dấu đỏ xác nhận
          P.pWaxSeal(gg, 1260, 350, 1.2, { p: rv(T, 'c5_7', .3, 1.2) });
        }

        // Quy tắc 2: Tỷ lệ 1:1
        const pR2 = rv(T, 'c5_10', .3, 1.4);
        if (pR2 > 0) {
          P.pHand(gg, 'Quy tắc 2: Cân bằng 1 : 1 (Mỗi lần nghi ngờ, ghi 1 bằng chứng)', 240, 470, { size: 42, col: PAL.green.s, p: pR2 });
        }

        // Quy tắc 3: Đổi câu hỏi
        const pR3 = rv(T, 'c5_13', .3, 1.4);
        if (pR3 > 0) {
          P.pHand(gg, 'Quy tắc 3: Đổi từ “Liệu mình có đủ?” → “Ai đã thấy mình làm việc này?”', 240, 580, { size: 40, col: P.INK, p: pR3 });
        }

        P.pNote(gg, 'Công cụ tự nhận thức, không thay thế chuyên gia tâm lý', 90, 710, { size: 30, p: rv(T, 'c5_18', .3, 1.4) });
      });
    }, ev: () => [[at('c5_4', -.1), 'whoosh'], [L('c5_6').t0 + .3, 'paper'], [L('c5_7').t0 + .4, 'stamp'], [L('c5_10').t0 + .4, 'marker'], [L('c5_13').t0 + .4, 'marker']] },

    // [Khối 16: ~9:55 - 10:22] Kết bài: Phòng ngủ ấm áp, ngọn đèn dịu dần (c6_1 đến c6_4)
    // Khép lại bằng ống kính tròn Iris Wipe mượt mà
    { n: 'closing', t: at('c6_1', -.1), tr: 'cut', f(g, lt, T) {
      const t0 = L('c6_1').t0;
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      kng(g, 1290, 640, { s: 1.15, talk: talkAt(T), E: ek(T, [[0, 'smile'], [t0 + 2, 'determined']]), headYaw: -.1 + sway(T) }, T);
      roi(g, 760, 650, 1.4, { t: T });
      S.roomFront(g, T, cam);
      tag(g, 'TỐI NAY', 1600, 250, seg(T, t0 + .4, t0 + .9), { col: PAL.hoodie, px: 32 });
    }, ev: () => [[at('c6_1', -.1), 'amb', { kind: 'night', t1: at('c6_4', .4) }], [L('c6_1').t0 + .4, 'paper'], [L('c6_4').t1 + .1, 'music', { cue: 'end' }]] }
  ];
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
  g.save();
  g.fillStyle = col;
  g.beginPath();
  g.rect(0, 0, W, H);
  g.arc(cx, cy, r, 0, TAU, true);
  g.fill();
  g.restore();
}

window.render = T => {
  const g = G; g.setTransform(1, 0, 0, 1, 0, 0);
  let i = SHOTS.length - 1; while (i > 0 && T < SHOTS[i].t) i--;
  const sh = SHOTS[i], nx = SHOTS[i + 1], WH = 0.16, IR = 0.35;

  drawShot(g, i, T);

  // Transitions between scene blocks
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
  } else if (sh.tr === 'fade' && T - sh.t < 0.25) {
    const p = 1 - ease.out((T - sh.t) / 0.25);
    g.fillStyle = `rgba(0,0,0,${p})`; g.fillRect(0, 0, W, H);
  }

  // fade in / fade out at start and end
  const fo = Math.max(1 - T / 0.25, seg(T, TL.end - 0.6, TL.end));
  if (fo > 0) { g.fillStyle = `rgba(0,0,0,${fo})`; g.fillRect(0, 0, W, H); }

  // end card of the channel
  const cp = seg(T, TL.end - 4.0, TL.end - 3.4);
  if (cp > 0) {
    g.fillStyle = `rgba(18,19,26,${cp})`; g.fillRect(0, 0, W, H);
    g.save(); g.globalAlpha = cp;
    text(g, 'TRẠM NGHĨ NHIỀU', W / 2, 452, { font: font(900, 92), align: 'center', fill: PAL.hoodie.f });
    text(g, 'TẬP 04', W / 2, 524, { font: font(800, 46), align: 'center', fill: CREAM });
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
  window.EV = EV; window.DUR = +TL.end.toFixed(2); window.CUES = TL.cues; window.SHOTS = SHOTS.map(s => ({ n: s.n, t: s.t }));
  await Promise.all(['900 40px "Be Vietnam Pro"', '800 40px "Be Vietnam Pro"', '700 40px "Be Vietnam Pro"', '400 40px "Patrick Hand"'].map(f => document.fonts.load(f, 'ẠẾỘữ')));
  window.render(0); window.READY = true;
}
setup();
