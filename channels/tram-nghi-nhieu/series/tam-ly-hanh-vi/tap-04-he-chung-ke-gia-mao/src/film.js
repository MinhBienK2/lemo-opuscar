// "Hội chứng Kẻ Giả Mạo" — Tập 04 của kênh Trạm Nghĩ Nhiều (bản dài, khoảng mười phút).
// Mọi con số của phim nằm trên tờ giấy trên bàn: phòng họp, hành lang lúc nửa đêm, và tờ giấy dưới
// đèn bàn vàng. Rối thì đứng bên cạnh và gọi tên cái cỗ máy.
// Hợp đồng trang: window.render(t), DUR, READY, EV (sự kiện âm thanh), TEXTS(t) (chữ trên hình), CUES (phụ đề).
import { figure, expr, blendE, PAL, roi } from '../../../../rig/character.js';
import { cel, path, poly, ellP, line, taper, mix, rgba, canvas, W, H, TAU, rect } from '../../../../rig/cel.js';
import { ground, panel, hilite, stamp, pip, bubble, subtitle, tag, text, revealText, sharpText, font, ease, seg, clamp01, ring, wrap, INK as BINK, CREAM, ACCENT, STORY, REG } from '../../../../rig/broll.js';
import * as S from '../../../../rig/sets.js';
import { build } from './timeline.js';
import * as P from './paper.js';
import * as ST from './stage.js';

const cv = document.getElementById('c'), G = cv.getContext('2d');
const [buf, B] = canvas(W, H);
let TL, SHOTS, EV = [];

// ——— animation tools ———
const E = x => typeof x === 'string' ? expr(x) : expr(x[0], x[1]);
function ek(T, keys, bl = 0.14) {   // expression keys [[t, name | [name, over]]], blended over bl seconds
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const cur = E(keys[i][1]); if (i === 0) return cur;
  const u = seg(T, keys[i][0], keys[i][0] + bl); return u >= 1 ? cur : blendE(E(keys[i - 1][1]), cur, ease.inOut(u));
}
const lerp = (a, b, u) => a + (b - a) * u;
const BLINKS = []; { let s = 23, t = 1.0; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 1400) { BLINKS.push(t); if (r() < .2) BLINKS.push(t + .28); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < .16) return Math.sin(d / .16 * Math.PI); } return 0; }
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id], w = (id, k) => TL.w(id, k);
const talkAt = T => TL.talk(T);
const sway = T => Math.sin(T * .55) * .035;

// ——— the desk under the lamp: the page where the numbers of the film live ———
function page(g, T, t0, draw, o = {}) {
  P.deskScene(g, T, o);
  P.sheet(g, T, { p: seg(T, t0 - .5, t0 + .05) });
  P.withPage(g, gg => draw(gg, T, t0));
}

// ——— the shots ———
function shots() {
  const at = (id, d = 0) => L(id).t0 + d;
  const rv = (T, id, a = .3, b = 1.2) => seg(T, at(id, a), at(id, b));   // the reveal of a written line

  return [
    // ——— mở đầu: phòng họp ———
    { n: 'meet', t: 0, f(g, lt, T) {
      const t0 = L('hook').t0;
      ST.meetingBack(g, T, {});
      kng(g, 1440, 330, { s: .95, talk: talkAt(T), E: ek(T, [[0, 'determined'], [t0 + 2, 'smile']]), headYaw: -.12 + sway(T), headPitch: .04 }, T);
      ST.meetingFront(g, T, {});
      tag(g, 'PHÒNG HỌP', 190, 130, seg(T, .2, .8), { col: PAL.hoodie, px: 34 });
    }, ev: () => [[.2, 'music', { cue: 'A' }], [.6, 'amb', { kind: 'low', t1: at('hook4', .4) }], [.3, 'pop']] },

    { n: 'praise', t: at('hook2', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('hook2').t0;
      ST.meetingBack(g, T, {});
      kng(g, 1440, 330, { s: .95, talk: talkAt(T), E: ek(T, [[0, 'smile'], [t0 + 2, 'smile']]), headYaw: -.12 + sway(T) }, T);
      ST.meetingFront(g, T, {});
      const bp = seg(T, t0 + .3, t0 + .8);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        bubble(g, 560, 250, 900, 210, (gg, bw, bh) => {
          text(gg, 'Phần này làm tốt lắm,', 0, -34, { font: font(800, 44), align: 'center', base: 'middle', fill: BINK });
          text(gg, 'cảm ơn cậu.', 0, 34, { font: font(800, 44), align: 'center', base: 'middle', fill: PAL.violet.s });
        }, { tail: 'left' });
        g.restore();
      }
    }, ev: () => [[at('hook2', -.1), 'whoosh'], [L('hook2').t0 + .3, 'pop']] },

    { n: 'handshake', t: at('hook3', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('hook3').t0;
      ST.meetingBack(g, T, {});
      kng(g, 1440, 330, { s: .95, talk: talkAt(T), E: ek(T, [[0, 'smile'], [t0 + 1.4, 'embarrassed']]), headYaw: -.1 + sway(T) }, T);
      ST.meetingFront(g, T, {});
      const bp = seg(T, t0 + .4, t0 + .9);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        for (let i = 0; i < 3; i++) {
          const x = 300 + i * 140, y = 640 - i * 16;
          cel(g, ellP(x, y, 26, 26), { f: PAL.skin.f, s: PAL.skin.s, so: [-4, 4], l: PAL.ink, lw: 2.4 });
        }
        g.restore();
      }
    }, ev: () => [[at('hook3', -.1), 'whoosh'], [L('hook3').t0 + .4, 'pop'], [L('hook3').t0 + .9, 'pop']] },

    // ——— hành lang ———
    { n: 'corridor', t: at('hook4', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('hook4').t0;
      ST.corridor(g, T, {});
      kng(g, 560, 470, { s: .64, legs: { mode: 'walk', ph: T * 1.05 }, talk: talkAt(T), E: ek(T, [[0, 'smile'], [t0 + 1.6, 'worried']]), headYaw: .16, headPitch: .06 }, T);
    }, ev: () => [[at('hook4', -.1), 'whoosh'], [at('hook4', -.1) + .3, 'step'], [L('hook4').t0 + .8, 'step'], [L('hook4').t0 + 1.5, 'step']] },

    { n: 'thought', t: at('hook5', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('hook5').t0;
      ST.corridor(g, T, {});
      kng(g, 1290, 470, { s: 1.0, talk: talkAt(T), E: ek(T, [[0, 'worried'], [t0 + 2, 'worried']]), headYaw: -.18, headPitch: .1 }, T);
      const bp = seg(T, t0 + .5, t0 + 1.1);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 1.6);
        bubble(g, 740, 290, 1060, 290, (gg, bw, bh) => {
          P.pHand(gg, 'lỡ họ biết mình', 0, -40, { size: 46, align: 'center', p: rv(T, 'hook5', .5, 1.6) });
          P.pHand(gg, 'thật ra không đủ thì sao?', 0, 40, { size: 46, align: 'center', p: rv(T, 'hook5', 1.4, 2.6) });
        }, { tail: 'right' });
        g.restore();
      }
    }, ev: () => [[at('hook5', -.1), 'whoosh'], [L('hook5').t0 + .5, 'boing']] },

    { n: 'hands', t: at('hook6', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('hook6').t0;
      ground(g, '#101320');
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      // his hands, holding a closed notebook on the desk
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
    }, ev: () => [[at('hook6', -.1), 'whoosh'], [L('hook6').t0 + .4, 'paper']] },

    // ——— giới thiệu: cỗ máy ———
    { n: 'intro', t: at('intro', -.2), tr: 'whip', f(g, lt, T) {
      const t0 = L('intro').t0;
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      kng(g, 1290, 640, { s: 1.15, talk: talkAt(T), E: ek(T, [[0, 'smile'], [t0 + 2, 'talk']]), headYaw: -.1 + sway(T), headPitch: .05 }, T);
      roi(g, 760, 640, 1.5, { t: T });
      S.roomFront(g, T, cam);
      tag(g, 'KẺ NGHĨ NHIỀU', 1600, 250, seg(T, t0 + .4, t0 + .9), { col: PAL.hoodie, px: 32 });
    }, ev: () => [[at('intro', -.2), 'music', { cue: 'B' }], [at('intro', -.2), 'amb', { kind: 'room', t1: at('c1_1', .4) }], [at('intro', -.2), 'whoosh'], [at('intro', -.2) + .1, 'pop']] },

    { n: 'intro2', t: at('intro2', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('intro2').t0;
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      kng(g, 1290, 640, { s: 1.15, talk: talkAt(T), E: ek(T, [[0, 'talk'], [t0 + 2.4, 'determined']]), headYaw: -.1 + sway(T) }, T);
      roi(g, 760, 640, 1.5, { t: T });
      const bp = seg(T, t0 + .3, t0 + .8);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        bubble(g, 450, 330, 860, 190, (gg, bw, bh) => {
          text(gg, 'Đây không phải tính cách', 0, -26, { font: font(800, 42), align: 'center', base: 'middle', fill: BINK });
          text(gg, 'của bạn.', 0, 30, { font: font(800, 42), align: 'center', base: 'middle', fill: BINK });
        }, { tail: 'right' });
        g.restore();
      }
      S.roomFront(g, T, cam);
    }, ev: () => [[at('intro2', -.1), 'whoosh'], [L('intro2').t0 + .3, 'boing']] },

    { n: 'intro3', t: at('intro3', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('intro3').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'CỖ MÁY CÓ BA BÁNH RĂNG', 90, 130, { size: 66, p: rv(T, 'intro3', .3, 1.3) });
        P.pGear(gg, 420, 400, 150, 12, .3, { p: rv(T, 'intro3', 1, 1.8), col: P.INK });
        P.pGear(gg, 700, 460, 120, 10, -.2, { p: rv(T, 'intro3', 1.5, 2.3), col: P.INK });
        P.pGear(gg, 900, 380, 100, 8, .5, { p: rv(T, 'intro3', 2, 2.8), col: P.INK });
      });
    }, ev: () => [[at('intro3', -.1), 'whoosh'], [L('intro3').t0 + .4, 'marker'], [L('intro3').t0 + 1.2, 'marker']] },

    // ——— chương 1: cái tên và con số ———
    { n: 'c1a', t: at('c1_1', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_1').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pNum(gg, '1978', 110, 250, { size: 190, p: rv(T, 'c1_1', .3, 1.3) });
        P.pHand(gg, 'Clance & Imes', 110, 340, { size: 56, p: rv(T, 'c1_1', .8, 1.7) });
        P.pNote(gg, 'Psychotherapy, 15(3), 241–247', 110, 420, { size: 32, p: rv(T, 'c1_1', 1.2, 2) });
        P.pHand(gg, 'hai nhà tâm lý học', 110, 540, { size: 46, p: rv(T, 'c1_1', 1.8, 2.6) });
        P.pNote(gg, 'Georgia State University', 110, 610, { size: 32, p: rv(T, 'c1_1', 1.5, 2.3) });
      });
    }, ev: () => [[at('c1_1', -.1), 'music', { cue: 'C' }], [at('c1_1', -.1), 'amb', { kind: 'room', t1: at('c4_1', .4) }], [at('c1_1', -.1), 'whoosh'], [L('c1_1').t0 + .3, 'marker'], [L('c1_1').t0 + 1.6, 'marker']] },

    { n: 'c1b', t: at('c1_2', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_2').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pNum(gg, '150+', 110, 250, { size: 190, p: rv(T, 'c1_2', .3, 1.3) });
        P.pHand(gg, 'người phụ nữ thành công', 110, 340, { size: 52, p: rv(T, 'c1_2', .9, 1.8) });
        for (let i = 0; i < 24; i++) {
          const x = 780 + (i % 8) * 88, y = 200 + Math.floor(i / 8) * 92;
          cel(gg, ellP(x, y, 22, 26), { f: '#B9B2A2', s: '#9A9284', l: P.INK, lw: 2.2 });
          cel(gg, poly([[x - 22, y + 46], [x + 22, y + 46], [x + 14, y + 18], [x - 14, y + 18]]), { f: '#B9B2A2', s: '#9A9284', l: P.INK, lw: 2.2 });
        }
        P.pHand(gg, 'có bằng tiến sĩ, là giảng viên,', 110, 540, { size: 42, p: rv(T, 'c1_2', 1.2, 2.1) });
        P.pHand(gg, 'hoặc là sinh viên được ghi nhận', 110, 600, { size: 42, p: rv(T, 'c1_2', 1.4, 2.3) });
      });
    }, ev: () => [[at('c1_2', -.1), 'whoosh'], [L('c1_2').t0 + .3, 'marker']] },

    { n: 'c1c', t: at('c1_3', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_3').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'LỜI CỦA HỌ, NĂM 1978', 90, 140, { size: 56, p: rv(T, 'c1_3', .3, 1.3) });
        const rows = ['“mình không đủ giỏi để ở đây”', '“khả năng của tôi bị đánh giá quá cao”', '“chắc ai đó chọn nhầm tôi”'];
        rows.forEach((r, i) => {
          const y = 300 + i * 130, p = rv(T, 'c1_3', .7 + i * .6, 1.4 + i * .6);
          P.pMark(gg, 140, y - 14, { s: 34, col: PAL.red.f, kind: 'cross', p });
          P.pHand(gg, r, 200, y, { size: 46, p, col: PAL.red.s });
        });
      });
    }, ev: () => [[at('c1_3', -.1), 'whoosh'], [L('c1_3').t0 + .9, 'marker'], [L('c1_3').t0 + 2.4, 'stamp']] },

    { n: 'c1d', t: at('c1_4', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_4').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'HIỆN TƯỢNG', 110, 250, { size: 120, p: rv(T, 'c1_4', .3, 1.4) });
        P.pTitle(gg, 'KẺ GIẢ MẠO', 110, 390, { size: 120, col: PAL.violet.s, p: rv(T, 'c1_4', 1.1, 2.2) });
        P.pHand(gg, '“sự giả lả trí tuệ”', 110, 520, { size: 46, p: rv(T, 'c1_4', .6, 1.5) });
        P.pNote(gg, 'Clance & Imes, 1978', 110, 600, { size: 32, p: rv(T, 'c1_4', .6, 1.5) });
      });
    }, ev: () => [[at('c1_4', -.1), 'whoosh'], [L('c1_4').t0 + .4, 'marker'], [L('c1_4').t0 + 1.4, 'marker'], [L('c1_4').t0 + 2.4, 'ting']] },

    { n: 'c1e', t: at('c1_5', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_5').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'ĐỊNH NGHĨA', 90, 140, { size: 54, p: rv(T, 'c1_5', .3, 1.2) });
        P.pHand(gg, 'thành công có thật', 90, 270, { size: 52, p: rv(T, 'c1_5', .9, 1.9) });
        P.pHand(gg, 'nhưng không tin được', 90, 360, { size: 52, p: rv(T, 'c1_5', 1.6, 2.6) });
        P.pHand(gg, 'và sợ bị vạch trần', 90, 450, { size: 52, col: PAL.red.s, p: rv(T, 'c1_5', 2.3, 3.3) });
        P.pNote(gg, 'Bravata và cộng sự, 2020', 90, 540, { size: 32, p: rv(T, 'c1_5', 1.8, 2.6) });
      });
    }, ev: () => [[at('c1_5', -.1), 'whoosh'], [L('c1_5').t0 + .9, 'marker'], [L('c1_5').t0 + 1.7, 'marker']] },

    { n: 'c1f', t: at('c1_6', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_6').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pHand(gg, 'Nỗi sợ không nằm ở việc làm sai.', 90, 300, { size: 52, p: rv(T, 'c1_6', .3, 1.4) });
        P.pHand(gg, 'Nó nằm ở việc bị người khác nhìn ra.', 90, 390, { size: 52, col: PAL.red.s, p: rv(T, 'c1_6', 1.1, 2.2) });
        const sp = rv(T, 'c1_6', 1.8, 2.7);
        if (sp > 0) stamp(gg, 'BỊ VẠCH TRẦN', 1180, 570, { px: 66, rot: -.14, p: sp, col: PAL.red.f });
      });
    }, ev: () => [[at('c1_6', -.1), 'whoosh'], [L('c1_6').t0 + 1.8, 'stamp']] },

    { n: 'c1g', t: at('c1_8', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_8').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pNum(gg, '62', 110, 250, { size: 170, p: rv(T, 'c1_8', .3, 1.3) });
        P.pHand(gg, 'nghiên cứu đã rà lại toàn bộ', 110, 320, { size: 44, p: rv(T, 'c1_8', 1, 1.9) });
        P.pNum(gg, '14.161', 110, 540, { size: 150, p: rv(T, 'c1_8', 1.6, 2.6) });
        P.pHand(gg, 'người tham gia', 110, 610, { size: 44, p: rv(T, 'c1_8', 2, 2.8) });
      });
    }, ev: () => [[at('c1_8', -.1), 'whoosh'], [L('c1_8').t0 + .4, 'marker'], [L('c1_8').t0 + 1.8, 'marker']] },

    { n: 'c1h', t: at('c1_9', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_9').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'TỈ LỆ CÓ CẢM GIÁC KẺ GIẢ MẠO', 90, 140, { size: 54, p: rv(T, 'c1_9', .3, 1.3) });
        const p = rv(T, 'c1_9', 1.1, 2.2);
        if (p > 0) {
          const x0 = 140, x1 = 1480, y = 420;
          line(gg, [[x0, y], [x1, y]], P.INK, 5);
          for (let i = 0; i <= 10; i++) line(gg, [[x0 + (x1 - x0) * i / 10, y - 12], [x0 + (x1 - x0) * i / 10, y + 12]], P.INK, 4);
          const a = x0 + (x1 - x0) * .09, b = x0 + (x1 - x0) * .82;
          line(gg, [[a, y - 60], [a, y + 60]], PAL.green.f, 8);
          line(gg, [[b, y - 60], [b, y + 60]], PAL.red.f, 8);
          gg.globalAlpha = p;
          P.pNum(gg, '9%', a, y - 90, { size: 76, align: 'center', col: PAL.green.s, p });
          P.pNum(gg, '82%', b, y - 90, { size: 76, align: 'center', col: PAL.red.s, p });
        }
        P.pHand(gg, 'tùy cách đo', 90, 620, { size: 44, p: rv(T, 'c1_10', .3, 1.4) });
        P.pNote(gg, 'Bravata và cộng sự, 2020', 90, 690, { size: 30, p: rv(T, 'c1_10', 1.1, 1.9) });
      });
    }, ev: () => [[at('c1_9', -.1), 'whoosh'], [L('c1_9').t0 + 1.2, 'marker']] },

    { n: 'c1i', t: at('c1_13', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_13').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'NÓ KHÔNG PHẢI MỘT BỆNH LÝ', 90, 160, { size: 64, p: rv(T, 'c1_13', .3, 1.3) });
        P.pHand(gg, 'Không có trong sách phân loại bệnh tâm thần.', 90, 270, { size: 46, p: rv(T, 'c1_13', .5, 1.5) });
        const p = rv(T, 'c1_13', 1.8, 2.7);
        if (p > 0) {
          ['DSM', 'ICD'].forEach((s, i) => {
            const x = 560 + i * 420, y = 470;
            cel(gg, rect(x - 130, y - 90, x + 130, y + 90), { f: '#E4DECF', s: '#CDC6B6', l: P.INK, lw: 4 });
            P.pTitle(gg, s, x, y + 20, { size: 74, align: 'center', p });
            gg.globalAlpha = p;
            P.pMark(gg, x, y, { s: 200, col: PAL.red.f, kind: 'cross', p });
          });
        }
        P.pNote(gg, 'Bravata và cộng sự, 2020', 90, 640, { size: 32, p: rv(T, 'c1_13', 1.7, 2.5) });
      });
    }, ev: () => [[at('c1_13', -.1), 'whoosh'], [L('c1_13').t0 + 1.8, 'stamp']] },

    { n: 'c1j', t: at('c1_14', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_14').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'CÁCH CHỮA', 90, 220, { size: 84, p: rv(T, 'c1_14', .3, 1.3) });
        const p = rv(T, 'c1_14', 1.1, 2);
        if (p > 0) {
          cel(gg, rect(560, 260, 1400, 560), { f: '#E4DECF', s: '#CDC6B6', l: P.INK, lw: 4 });
          P.pNum(gg, '?', 980, 480, { size: 240, align: 'center', p });
        }
        P.pHand(gg, 'Chưa có nghiên cứu nào đánh giá được cách chữa nó.', 90, 660, { size: 44, p: rv(T, 'c1_14', 1.8, 2.9) });
      });
    }, ev: () => [[at('c1_14', -.1), 'whoosh'], [L('c1_14').t0 + 1.2, 'marker']] },

    { n: 'c1k', t: at('c1_19', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c1_19').t0;
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      kng(g, 1290, 640, { s: 1.15, talk: talkAt(T), E: ek(T, [[0, 'talk'], [t0 + 2, 'determined']]), headYaw: -.1 + sway(T) }, T);
      roi(g, 740, 650, 1.4, { t: T });
      const bp = seg(T, t0 + .4, t0 + .9);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        bubble(g, 480, 330, 880, 200, (gg, bw, bh) => {
          text(gg, 'Bạn thật sự giỏi.', 0, -26, { font: font(800, 44), align: 'center', base: 'middle', fill: BINK });
          text(gg, 'Bạn chỉ không tin thôi.', 0, 32, { font: font(800, 44), align: 'center', base: 'middle', fill: PAL.violet.s });
        }, { tail: 'right' });
        g.restore();
      }
      S.roomFront(g, T, cam);
    }, ev: () => [[at('c1_19', -.1), 'whoosh'], [L('c1_19').t0 + .4, 'boing']] },

    // ——— chương 2: ba bánh răng ———
    { n: 'gear1', t: at('c2_2', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c2_2').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pGear(gg, 380, 400, 150, 12, .3 + T * .1, { p: rv(T, 'c2_2', .3, 1.3), col: P.INK });
        P.pTitle(gg, 'BÁNH ĐẦU', 640, 250, { size: 60, p: rv(T, 'c2_2', .7, 1.6) });
        P.pHand(gg, 'thước đo tự tăng', 640, 350, { size: 52, p: rv(T, 'c2_2', 1.3, 2.3) });
        P.pHand(gg, 'mục tiêu mới > mục tiêu cũ', 640, 430, { size: 46, col: PAL.red.s, p: rv(T, 'c2_2', 1.9, 2.9) });
        for (let i = 0; i < 5; i++) {
          const h = 70 + i * 52, x = 700 + i * 160, y = 660;
          const p = rv(T, 'c2_3', .3 + i * .25, 1 + i * .25);
          if (p > 0) {
            gg.globalAlpha = p;
            cel(gg, rect(x, y - h, x + 80, y), { f: i === 4 ? PAL.hoodie.f : '#B9B2A2', s: i === 4 ? PAL.hoodie.s : '#9A9284', l: P.INK, lw: 3 });
          }
        }
        P.pHand(gg, 'mục tiêu mới > mục tiêu cũ', 110, 700, { size: 40, p: rv(T, 'c2_3', .5, 1.5) });
      });
    }, ev: () => [[at('c2_2', -.1), 'music', { cue: 'D' }], [at('c2_2', -.1), 'whoosh'], [L('c2_2').t0 + .4, 'marker']] },

    { n: 'gear1b', t: at('c2_4', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c2_4').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'KHOẢNG CÁCH KHÔNG HẸP LẠI', 90, 150, { size: 58, p: rv(T, 'c2_4', .3, 1.3) });
        const p = rv(T, 'c2_4', .9, 1.9);
        if (p > 0) {
          const x0 = 200, y = 620;
          line(gg, [[x0, y], [1480, y]], P.INK, 5);
          const bars = [[420, 120], [700, 210], [980, 300], [1260, 390]];
          bars.forEach((b, i) => {
            const bp = rv(T, 'c2_4', 1.2 + i * .3, 2 + i * .3);
            if (bp > 0) {
              gg.globalAlpha = bp;
              cel(gg, rect(b[0], y - b[1], b[0] + 90, y), { f: '#B9B2A2', s: '#9A9284', l: P.INK, lw: 3 });
            }
          });
          const mp = rv(T, 'c2_5', .3, 1.2);
          if (mp > 0) {
            gg.globalAlpha = mp;
            line(gg, [[380, 420], [1380, 420]], PAL.red.f, 7);
            P.pHand(gg, 'mục tiêu mới', 1180, 400, { size: 36, col: PAL.red.s, p: mp });
            P.pHand(gg, 'khoảng cách vẫn vậy', 700, 700, { size: 40, p: mp });
          }
        }
      });
    }, ev: () => [[at('c2_4', -.1), 'whoosh'], [L('c2_4').t0 + 1.2, 'marker']] },

    { n: 'gear1c', t: at('c2_6', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c2_6').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pNum(gg, '35 năm', 110, 260, { size: 160, p: rv(T, 'c2_6', .3, 1.3) });
        P.pHand(gg, 'nghiên cứu về đặt mục tiêu', 110, 350, { size: 48, p: rv(T, 'c2_6', 1, 1.9) });
        P.pNote(gg, 'Locke & Latham, 2002', 110, 430, { size: 34, p: rv(T, 'c2_6', 1.6, 2.5) });
        P.pHand(gg, 'mục tiêu tự đặt', 110, 570, { size: 50, p: rv(T, 'c2_7', .3, 1.3) });
        P.pHand(gg, 'mục tiêu được giao', 110, 650, { size: 50, col: '#6E6A5E', p: rv(T, 'c2_7', 1.1, 2.1) });
        P.pArrow(gg, 520, 558, 760, 545, { w: 6, col: PAL.green.s, p: rv(T, 'c2_7', 1.8, 2.6) });
        P.pHand(gg, 'hiệu suất cao hơn', 800, 560, { size: 44, col: PAL.green.s, p: rv(T, 'c2_7', 2.2, 3) });
      });
    }, ev: () => [[at('c2_6', -.1), 'whoosh'], [L('c2_6').t0 + .4, 'marker'], [L('c2_6').t0 + 1.6, 'marker']] },

    { n: 'gear2', t: at('c2_9', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c2_9').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pGear(gg, 330, 320, 120, 10, -.2 + T * .08, { p: rv(T, 'c2_9', .3, 1.3), col: P.INK });
        P.pTitle(gg, 'BÁNH THỨ HAI', 640, 250, { size: 60, p: rv(T, 'c2_9', .7, 1.6) });
        P.pHand(gg, 'Bạn quy công cho kẻ khác.', 640, 350, { size: 50, p: rv(T, 'c2_9', 1.2, 2.2) });
        const p = rv(T, 'c2_10', .3, 1.3);
        if (p > 0) {
          gg.globalAlpha = p;
          P.pHand(gg, 'được khen → do may, do thời điểm, do hỏi đúng câu', 200, 540, { size: 42, col: PAL.green.s, p });
          P.pArrow(gg, 1250, 525, 1470, 490, { w: 6, col: PAL.green.s, p });
        }
        const q = rv(T, 'c2_11', .3, 1.3);
        if (q > 0) {
          gg.globalAlpha = q;
          P.pHand(gg, 'bị chê → do thiếu năng lực, do không đủ giỏi', 200, 630, { size: 42, col: PAL.red.s, p: q });
          P.pArrow(gg, 1250, 615, 1470, 650, { w: 6, col: PAL.red.s, p: q });
        }
        P.pNote(gg, 'thiên lệch tự phục vụ', 200, 700, { size: 38, p: rv(T, 'c2_12', .3, 1.2) });
      });
    }, ev: () => [[at('c2_9', -.1), 'whoosh'], [L('c2_9').t0 + 1.9, 'marker']] },

    { n: 'gear2b', t: at('c2_33', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c2_33').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'MỘT THÍ NGHIỆM ĐO ĐÚNG CÁI NÀY', 90, 150, { size: 56, p: rv(T, 'c2_33', .3, 1.3) });
        P.pNum(gg, '2023', 110, 330, { size: 140, p: rv(T, 'c2_33', 1, 1.9) });
        P.pNum(gg, '170', 700, 330, { size: 140, p: rv(T, 'c2_33', 1.6, 2.5) });
        P.pHand(gg, 'người tham gia', 700, 400, { size: 42, p: rv(T, 'c2_33', 2.2, 3) });
        P.pHand(gg, 'được khen → ra ngoài', 110, 540, { size: 46, col: PAL.green.s, p: rv(T, 'c2_34', .3, 1.4) });
        P.pHand(gg, 'bị chê → vào trong', 110, 620, { size: 46, col: PAL.red.s, p: rv(T, 'c2_34', 1.2, 2.3) });
        P.pNote(gg, 'Ibrahim, Göddertz & Herzberg, 2023', 110, 700, { size: 30, p: rv(T, 'c2_34', 1.9, 2.6) });
      });
    }, ev: () => [[at('c2_33', -.1), 'whoosh'], [L('c2_33').t0 + 1, 'marker']] },

    { n: 'gear3', t: at('c2_15', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c2_15').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'BÁNH THỨ BA', 90, 140, { size: 60, p: rv(T, 'c2_15', .3, 1.3) });
        P.pHand(gg, 'hồ sơ của bạn chỉ có lần xấu', 90, 230, { size: 46, p: rv(T, 'c2_15', .9, 1.9) });
        for (let i = 0; i < 20; i++) {
          const x = 180 + (i % 10) * 140, y = 360 + Math.floor(i / 10) * 90;
          const bad = i === 13, p = rv(T, 'c2_16', .3 + i * .06, .9 + i * .06);
          if (p > 0) {
            gg.globalAlpha = p;
            cel(gg, rect(x, y - 26, x + 100, y + 26), { f: bad ? '#E7A9A9' : '#DCD6C6', s: bad ? '#C97F7F' : '#C3BBA8', l: P.INK, lw: 2.6 });
            if (bad) P.pMark(gg, x + 50, y, { s: 34, col: PAL.red.f, kind: 'cross', p });
          }
        }
        P.pHand(gg, '20 lần tốt · 1 lần vấp', 90, 660, { size: 46, p: rv(T, 'c2_16', 1.6, 2.7) });
      });
    }, ev: () => [[at('c2_15', -.1), 'whoosh'], [L('c2_15').t0 + 1.5, 'marker'], [L('c2_15').t0 + 2.6, 'stamp']] },

    { n: 'spotlight', t: at('c2_19', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c2_19').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'TA TƯỞNG CẢ PHÒNG ĐANG NHÌN MÌNH', 90, 140, { size: 54, p: rv(T, 'c2_19', .3, 1.3) });
        P.pTshirt(gg, 300, 400, 1.3, { p: rv(T, 'c2_20', .3, 1.2) });
        P.pHand(gg, 'một chiếc áo gây xấu hổ', 560, 330, { size: 46, p: rv(T, 'c2_20', .6, 1.7) });
        const p = rv(T, 'c2_21', .3, 1.3);
        if (p > 0) {
          gg.globalAlpha = p;
          P.pNum(gg, '46%', 620, 520, { size: 110, col: PAL.red.s, p });
          P.pHand(gg, 'họ đoán', 620, 570, { size: 38, col: PAL.red.s, p });
          P.pNum(gg, '23%', 1120, 520, { size: 110, col: PAL.green.s, p });
          P.pHand(gg, 'thực tế', 1120, 570, { size: 38, col: PAL.green.s, p });
        }
        P.pNote(gg, 'Gilovich, Medvec & Savitsky, 2000 · Nghiên cứu 1', 90, 690, { size: 30, p: rv(T, 'c2_22', .3, 1.2) });
      });
    }, ev: () => [[at('c2_19', -.1), 'whoosh'], [L('c2_21').t0 + .3, 'pop']] },

    { n: 'search', t: at('c2_37', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c2_37').t0;
      ground(g, '#101320');
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      // the phone, glowing on the desk
      cel(g, rect(520, 620, 900, 900), { f: '#1B1F2C', s: '#12141F', so: [0, 8], l: PAL.ink, lw: 3.4 });
      cel(g, rect(540, 640, 880, 880), { f: '#3A4A6E', s: '#2A3550', l: PAL.ink, lw: 2.4 });
      for (let i = 0; i < 5; i++) {
        const y = 680 + i * 40;
        cel(g, rect(570, y, 850 - (i % 2) * 180, y + 18), { f: i === 2 ? '#E7A9A9' : '#6E7C9E', s: i === 2 ? '#C97F7F' : '#5A6788', l: PAL.ink, lw: 1.6 });
      }
      const grd = g.createRadialGradient(710, 760, 20, 710, 760, 420);
      grd.addColorStop(0, 'rgba(103,232,249,.22)'); grd.addColorStop(1, 'rgba(103,232,249,0)');
      g.fillStyle = grd; g.fillRect(300, 400, 900, 680);
      kng(g, 1300, 640, { s: 1.15, talk: talkAt(T), E: ek(T, [[0, 'worried'], [t0 + 2, 'worried']]), headYaw: -.2, headPitch: .12 }, T);
      S.roomFront(g, T, cam);
    }, ev: () => [[at('c2_37', -.1), 'whoosh'], [L('c2_37').t0 + .5, 'swish'], [L('c2_37').t0 + 1.1, 'swish']] },

    // ——— chương 3: vì sao càng nỗ lực càng sợ ———
    { n: 'question', t: at('c3_1', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c3_1').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'TẠI SAO CÀNG NỖ LỰC,', 120, 280, { size: 92, p: rv(T, 'c3_1', .3, 1.4) });
        P.pTitle(gg, 'CÀNG SỢ BỊ VẠCH TRẦN?', 120, 420, { size: 92, col: PAL.red.s, p: rv(T, 'c3_1', 1.2, 2.3) });
        P.pHand(gg, 'Câu hỏi này có ba câu trả lời.', 120, 560, { size: 48, p: rv(T, 'c3_2', .3, 1.4) });
      });
    }, ev: () => [[at('c3_1', -.1), 'music', { cue: 'E' }], [at('c3_1', -.1), 'whoosh'], [L('c3_1').t0 + .4, 'marker'], [L('c3_1').t0 + 1.3, 'marker']] },

    { n: 'know', t: at('c3_3', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c3_3').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'CÀNG BIẾT, CÀNG THẤY CHỖ TRỐNG', 90, 140, { size: 58, p: rv(T, 'c3_3', .3, 1.3) });
        const p = rv(T, 'c3_3', 1.1, 2);
        if (p > 0) {
          gg.globalAlpha = p;
          const x0 = 180, x1 = 1440, y = 330, h = 190;
          cel(gg, rect(x0, y, x1, y + h), { f: '#E4DECF', s: '#CDC6B6', l: P.INK, lw: 4 });
          const k = rv(T, 'c3_4', .3, 1.6);
          if (k > 0) {
            gg.globalAlpha = k;
            const cut = x0 + (x1 - x0) * (1 - .55 * k);
            cel(gg, rect(cut, y, x1, y + h), { f: '#8F96AC', s: '#6E7488', l: P.INK, lw: 4 });
            P.pHand(gg, 'chỗ trống lớn dần', (cut + x1) / 2, y + 120, { size: 40, align: 'center', col: '#FAF8F5', p: k });
          }
          P.pHand(gg, 'phần đã biết', x0 + 40, y + 120, { size: 40, col: P.INK, p });
        }
        P.pHand(gg, 'mỗi lần học thêm, chỗ trống lớn hơn', 90, 700, { size: 44, p: rv(T, 'c3_4', 1.2, 2.4) });
      });
    }, ev: () => [[at('c3_3', -.1), 'whoosh'], [L('c3_3').t0 + 1.2, 'marker']] },

    { n: 'loss', t: at('c3_6', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c3_6').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'THẤT BẠI ĐAU HƠN THÀNH CÔNG VUI', 90, 140, { size: 56, p: rv(T, 'c3_6', .3, 1.3) });
        const p = rv(T, 'c3_6', 1, 1.9);
        if (p > 0) {
          gg.globalAlpha = p;
          P.balance(gg, 800, 380, 1, .22);
          P.pHand(gg, 'thành công', 560, 250, { size: 44, col: PAL.green.s, p });
          P.pHand(gg, 'thất bại', 1020, 570, { size: 44, col: PAL.red.s, p });
        }
        P.pHand(gg, 'giá trị: thất bại > thành công', 90, 660, { size: 46, p: rv(T, 'c3_7', .3, 1.5) });
      });
    }, ev: () => [[at('c3_6', -.1), 'whoosh'], [L('c3_6').t0 + 1, 'marker']] },

    { n: 'effort', t: at('c3_10', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c3_10').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'CÔNG SỨC BẠN BỎ RA', 90, 140, { size: 60, p: rv(T, 'c3_10', .3, 1.3) });
        const p = rv(T, 'c3_10', 1, 2);
        if (p > 0) {
          gg.globalAlpha = p;
          cel(gg, poly([[300, 640], [900, 420], [1400, 640]]), { f: '#DCD6C6', s: '#C3BBA8', l: P.INK, lw: 4 });
          cel(gg, ellP(640, 520, 110, 96), { f: '#9A9284', s: '#7E7768', so: [8, 8], l: P.INK, lw: 3.4 });
          P.pArrow(gg, 780, 560, 1000, 470, { w: 7, p });
        }
        P.pHand(gg, 'chi phí của sự thừa nhận', 90, 700, { size: 46, p: rv(T, 'c3_12', .3, 1.6) });
      });
    }, ev: () => [[at('c3_10', -.1), 'whoosh'], [L('c3_10').t0 + 1.2, 'marker']] },

    { n: 'cycle', t: at('c3_21', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c3_21').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'VÒNG XOÁY NĂM 1978', 90, 140, { size: 58, p: rv(T, 'c3_21', .3, 1.3) });
        const nodes = ['lo lắng', 'chăm chỉ', 'đạt kết quả', 'được khen', 'rồi lại lo'];
        const cx = 810, cy = 430, R = 230;
        const p = rv(T, 'c3_21', 1, 2);
        if (p > 0) {
          gg.globalAlpha = p;
          const pts = nodes.map((n, i) => [cx + Math.cos(-Math.PI / 2 + i / nodes.length * TAU) * R, cy + Math.sin(-Math.PI / 2 + i / nodes.length * TAU) * R]);
          pts.forEach((q, i) => {
            const nx = pts[(i + 1) % pts.length];
            P.pArrow(gg, q[0], q[1], nx[0], nx[1], { w: 4, p, col: P.INK });
          });
          pts.forEach((q, i) => {
            const np = rv(T, 'c3_21', 1.2 + i * .3, 1.9 + i * .3);
            if (np > 0) {
              gg.globalAlpha = np;
              cel(gg, ellP(q[0], q[1], 130, 44), { f: '#E4DECF', s: '#CDC6B6', l: P.INK, lw: 3 });
              P.pHand(gg, nodes[i], q[0], q[1] + 14, { size: 40, align: 'center', p: np });
            }
          });
        }
      });
    }, ev: () => [[at('c3_21', -.1), 'whoosh'], [L('c3_21').t0 + 1.1, 'marker']] },

    { n: 'cycle2', t: at('c3_22', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c3_22').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'NHIỀU LẦN THÀNH CÔNG LẶP LẠI', 90, 150, { size: 54, p: rv(T, 'c3_22', .3, 1.3) });
        P.pTitle(gg, 'MỘT MÌNH, KHÔNG ĐỦ', 90, 260, { size: 68, col: PAL.red.s, p: rv(T, 'c3_22', 1, 2) });
        P.pHand(gg, 'để phá vỡ vòng xoáy này.', 90, 350, { size: 50, p: rv(T, 'c3_22', 1.6, 2.6) });
        P.pNote(gg, 'Clance & Imes, 1978', 90, 440, { size: 32, p: rv(T, 'c3_22', 2.2, 3) });
        P.pHand(gg, 'càng làm, càng sợ · càng sợ, càng làm', 90, 600, { size: 48, p: rv(T, 'c3_13', .3, 1.5) });
      });
    }, ev: () => [[at('c3_22', -.1), 'whoosh'], [L('c3_22').t0 + 1.1, 'marker'], [L('c3_22').t0 + 2, 'ting']] },

    { n: 'myth', t: at('c3_14', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c3_14').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'MỘT CÂU NÓI ĐẸP', 90, 150, { size: 52, p: rv(T, 'c3_14', .3, 1.2) });
        P.pHand(gg, '“Người giỏi luôn tự hạ thấp mình.”', 90, 280, { size: 62, p: rv(T, 'c3_14', .9, 2) });
        const p = rv(T, 'c3_15', .3, 1.1);
        if (p > 0) {
          gg.globalAlpha = p;
          P.pMark(gg, 800, 300, { s: 460, col: PAL.red.f, kind: 'cross', p });
        }
        P.pHand(gg, 'nhóm cuối bảng xếp hạng', 90, 560, { size: 50, col: PAL.red.s, p: rv(T, 'c3_15', .8, 2) });
      });
    }, ev: () => [[at('c3_14', -.1), 'whoosh'], [L('c3_15').t0 + .4, 'stamp']] },

    { n: 'dunning', t: at('c3_17', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c3_17').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'NHÓM KÉM NHẤT THÌ PHÓNG ĐẠI', 90, 140, { size: 56, p: rv(T, 'c3_16', .3, 1.3) });
        const p = rv(T, 'c3_17', .3, 1.3);
        if (p > 0) {
          gg.globalAlpha = p;
          const x0 = 200, x1 = 1460, y = 430;
          line(gg, [[x0, y], [x1, y]], P.INK, 5);
          const pos = (v) => x0 + (x1 - x0) * v / 100;
          [[12, PAL.green.s, 'điểm thật'], [62, PAL.red.s, 'tự đánh giá']].forEach((d, i) => {
            const x = pos(d[0]);
            line(gg, [[x, y - 70], [x, y + 70]], d[1], 9);
            P.pNum(gg, d[0] + '', x, y - 110, { size: 96, align: 'center', col: d[1], p });
            P.pHand(gg, d[2], x, y + 130, { size: 40, align: 'center', col: d[1], p });
          });
          P.pHand(gg, 'thứ hạng', x0, y + 190, { size: 38, p });
        }
        P.pHand(gg, 'kỹ năng hài, ngữ pháp, logic', 90, 620, { size: 42, p: rv(T, 'c3_18', .3, 1.4) });
        P.pNote(gg, 'nghiên cứu này không nói về hội chứng kẻ giả mạo', 90, 690, { size: 30, p: rv(T, 'c3_18', 1.1, 2.2) });
      });
    }, ev: () => [[at('c3_17', -.1), 'whoosh'], [L('c3_17').t0 + .4, 'marker']] },

    // ——— chương 4: cái giá ———
    { n: 'cost', t: at('c4_2', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c4_2').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'NÓ ĐI CÙNG', 90, 150, { size: 56, p: rv(T, 'c4_2', .3, 1.3) });
        const items = [['trầm cảm', PAL.violet.s], ['lo âu', PAL.violet.s], ['hài lòng công việc giảm', PAL.red.s], ['kiệt sức', PAL.red.s]];
        items.forEach((it, i) => {
          const x = 150 + (i % 2) * 760, y = 280 + Math.floor(i / 2) * 200, p = rv(T, 'c4_2', .4 + i * .4, 1.1 + i * .4);
          if (p > 0) {
            gg.globalAlpha = p;
            cel(gg, rect(x, y, x + 660, y + 130), { f: '#E4DECF', s: '#CDC6B6', so: [0, 8], l: P.INK, lw: 3 });
            P.pHand(gg, it[0], x + 40, y + 80, { size: 50, col: it[1], p });
          }
        });
        P.pNote(gg, 'Bravata và cộng sự, 2020', 90, 690, { size: 30, p: rv(T, 'c4_2', 1.2, 2.1) });
      });
    }, ev: () => [[at('c4_2', -.1), 'music', { cue: 'F' }], [at('c4_2', -.1), 'whoosh'], [L('c4_2').t0 + .9, 'paper']] },

    { n: 'distress', t: at('c4_8', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c4_8').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pNum(gg, '15%', 110, 300, { size: 200, p: rv(T, 'c4_8', .3, 1.3) });
        P.pHand(gg, 'khó chịu tâm lý tự báo', 110, 400, { size: 48, p: rv(T, 'c4_8', 1.1, 2.1) });
        P.pHand(gg, 'sinh viên y khoa, năm 2004', 110, 480, { size: 44, col: '#6E6A5E', p: rv(T, 'c4_8', 1.7, 2.7) });
        P.pNote(gg, 'tương quan, không phải nguyên nhân', 110, 600, { size: 32, p: rv(T, 'c4_8', 2.4, 3.2) });
      });
    }, ev: () => [[at('c4_8', -.1), 'whoosh'], [L('c4_8').t0 + .4, 'marker']] },

    { n: 'hours', t: at('c4_9', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c4_9').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'LÀM VIỆC QUÁ NHIỀU GIỜ', 90, 150, { size: 58, p: rv(T, 'c4_9', .3, 1.3) });
        const p = rv(T, 'c4_9', 1, 1.9);
        if (p > 0) {
          gg.globalAlpha = p;
          P.clockFace(gg, 700, 420, 180, 1.5);
          P.pHand(gg, 'một giờ sáng', 700, 690, { size: 42, p });
        }
        P.pHand(gg, 'làm thêm giờ', 1000, 380, { size: 46, p: rv(T, 'c4_9', 1.6, 2.7) });
      });
    }, ev: () => [[at('c4_9', -.1), 'whoosh'], [L('c4_9').t0 + 1, 'tick']] },

    { n: 'chair', t: at('c4_10', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c4_10').t0;
      ground(g, '#111320');
      // a circle of chairs in a meeting room; one of them is empty and pushed back
      const chairs = [[420, 760, .78], [760, 690, .92], [1180, 680, .95], [1520, 750, .82]];
      const empty = [1400, 900, .7];
      const drawChair = (x, y, s, col, seatCol, tilt) => {
        g.save(); g.translate(x, y); g.scale(s, s); g.rotate(tilt);
        cel(g, rect(-100, -150, 100, -70), { f: col, s: seatCol, so: [0, 6], l: PAL.ink, lw: 3 });   // the back
        cel(g, rect(-115, -70, 115, -20), { f: col, s: seatCol, so: [0, 6], l: PAL.ink, lw: 3 });    // the seat
        cel(g, rect(-100, -20, -78, 70), { f: seatCol, s: seatCol, l: PAL.ink, lw: 3 });
        cel(g, rect(78, -20, 100, 70), { f: seatCol, s: seatCol, l: PAL.ink, lw: 3 });
        g.restore();
      };
      chairs.forEach((c, i) => drawChair(c[0], c[1], c[2], '#3A4260', '#252C40', 0));
      // the empty one, turned away and pushed back
      drawChair(empty[0], empty[1], empty[2], '#2A3040', '#1B1F2C', .18);
      const hp = seg(T, t0 + .4, t0 + 1);
      if (hp > 0) {
        g.save(); g.globalAlpha = Math.min(1, hp * 1.6);
        g.strokeStyle = PAL.red.f; g.lineWidth = 6; g.setLineDash([14, 12]);
        g.beginPath(); g.ellipse(empty[0], empty[1] - 60, 150, 130, 0, 0, TAU); g.stroke();
        g.setLineDash([]); g.restore();
      }
      const bp = seg(T, t0 + .5, t0 + 1);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        bubble(g, 980, 300, 860, 200, (gg, bw, bh) => {
          text(gg, 'Chiếc ghế mà không ai ngồi:', 0, -26, { font: font(800, 40), align: 'center', base: 'middle', fill: BINK });
          text(gg, 'vai trò dẫn dắt.', 0, 30, { font: font(800, 40), align: 'center', base: 'middle', fill: PAL.red.s });
        }, { tail: 'right' });
        g.restore();
      }
    }, ev: () => [[at('c4_10', -.1), 'whoosh'], [L('c4_10').t0 + .5, 'pop']] },

    { n: 'self', t: at('c4_7', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c4_7').t0;
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      kng(g, 1290, 640, { s: 1.15, talk: talkAt(T), E: ek(T, [[0, 'sad'], [t0 + 2.4, 'talk']]), headYaw: -.12 + sway(T), headPitch: .08 }, T);
      roi(g, 760, 660, 1.4, { t: T });
      S.roomFront(g, T, cam);
    }, ev: () => [[at('c4_7', -.1), 'whoosh'], [L('c4_7').t0 + .6, 'boing']] },

    // ——— chương 5: công cụ ———
    { n: 'interv', t: at('c5_20', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c5_20').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'NGƯỜI TA ĐÃ THỬ', 90, 140, { size: 60, p: rv(T, 'c5_19', .3, 1.3) });
        P.pNum(gg, '31', 110, 330, { size: 180, p: rv(T, 'c5_20', .4, 1.4) });
        P.pHand(gg, 'nghiên cứu can thiệp', 110, 400, { size: 48, p: rv(T, 'c5_20', 1.2, 2.1) });
        P.pHand(gg, 'rà soát năm 2024', 110, 480, { size: 48, p: rv(T, 'c5_20', 1.8, 2.7) });
        const p = rv(T, 'c5_21', .3, 1.2);
        if (p > 0) {
          gg.globalAlpha = p;
          cel(gg, rect(980, 200, 1420, 320), { f: '#E4DECF', s: '#CDC6B6', l: P.INK, lw: 3 });
          P.pHand(gg, 'đào tạo', 1200, 275, { size: 46, align: 'center', p });
          cel(gg, rect(980, 380, 1420, 500), { f: '#E4DECF', s: '#CDC6B6', l: P.INK, lw: 3 });
          P.pHand(gg, 'coaching, tư vấn', 1200, 455, { size: 46, align: 'center', p });
        }
      });
    }, ev: () => [[at('c5_20', -.1), 'music', { cue: 'G' }], [at('c5_20', -.1), 'whoosh'], [L('c5_20').t0 + .4, 'marker']] },

    { n: 'rct', t: at('c5_22', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c5_22').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pNum(gg, '1.017', 110, 290, { size: 170, p: rv(T, 'c5_22', .3, 1.3) });
        P.pHand(gg, 'người, thử nghiệm có nhóm chứng', 110, 370, { size: 46, p: rv(T, 'c5_22', 1, 1.9) });
        P.pHand(gg, 'coaching nhóm trực tuyến:', 110, 490, { size: 46, p: rv(T, 'c5_22', 1.7, 2.6) });
        P.pHand(gg, 'IS ↓ · kiệt sức ↓ · tự thương ↑', 110, 570, { size: 46, col: PAL.green.s, p: rv(T, 'c5_22', 2.3, 3.2) });
        P.pHand(gg, 'một thử nghiệm khác: 227 người,', 110, 660, { size: 40, p: rv(T, 'c5_23', .3, 1.3) });
        P.pHand(gg, 'bốn buổi luyện tự thương, mỗi buổi bốn mươi lăm phút.', 110, 720, { size: 40, p: rv(T, 'c5_23', 1.1, 2.2) });
        P.pHand(gg, 'IS ↓ · hoàn hảo không lành ↓', 110, 780, { size: 40, col: PAL.green.s, p: rv(T, 'c5_24', .3, 1.3) });
      });
    }, ev: () => [[at('c5_22', -.1), 'whoosh'], [L('c5_22').t0 + .4, 'marker'], [L('c5_22').t0 + 2.3, 'pop']] },

    { n: 'thin', t: at('c5_25', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c5_25').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'BẰNG CHỨNG CÒN MỎNG', 90, 200, { size: 76, p: rv(T, 'c5_25', .3, 1.4) });
        const p = rv(T, 'c5_25', 1.2, 2.2);
        if (p > 0) {
          gg.globalAlpha = p;
          // thin ice with a crack
          cel(gg, rect(200, 420, 1420, 600), { f: '#DCE8F2', s: '#B9CBDD', l: P.INK, lw: 4 });
          P.pArrow(gg, 700, 500, 900, 520, { w: 5, col: PAL.red.f, p });
          P.pArrow(gg, 860, 560, 960, 460, { w: 5, col: PAL.red.f, p });
        }
        P.pHand(gg, 'đo trước — đo sau', 90, 690, { size: 46, p: rv(T, 'c5_25', 2, 3) });
      });
    }, ev: () => [[at('c5_25', -.1), 'whoosh'], [L('c5_25').t0 + 1.2, 'paper']] },

    { n: 'ledger', t: at('c5_4', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c5_4').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'SỔ BẰNG CHỨNG', 120, 260, { size: 110, p: rv(T, 'c5_4', .3, 1.4) });
        P.pTitle(gg, 'BẤT ĐỐI XỨNG', 120, 400, { size: 110, col: PAL.violet.s, p: rv(T, 'c5_4', 1.1, 2.2) });
        P.pHand(gg, 'một cuốn sổ · ba quy tắc', 120, 560, { size: 50, p: rv(T, 'c5_5', .3, 1.4) });
      });
    }, ev: () => [[at('c5_4', -.1), 'whoosh'], [L('c5_4').t0 + .4, 'marker'], [L('c5_4').t0 + 1.2, 'marker']] },

    { n: 'rule1', t: at('c5_6', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c5_6').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'QUY TẮC MỘT', 110, 150, { size: 54, col: PAL.violet.s, p: rv(T, 'c5_6', .3, 1.3) });
        P.notebook(gg, 810, 440, 1180, 520, { p: rv(T, 'c5_6', .6, 1.4) });
        const cols = [['việc', 300], ['ngày', 700], ['ai đã xác nhận', 1030]];
        cols.forEach((c, i) => {
          const cp = rv(T, 'c5_6', 1.1 + i * .35, 1.8 + i * .35);
          if (cp > 0) {
            gg.globalAlpha = cp;
            P.pHand(gg, c[0], c[1], 330, { size: 44, p: cp });
          }
        });
        const lp = rv(T, 'c5_7', .3, 1.2);
        if (lp > 0) {
          gg.globalAlpha = lp;
          P.pHand(gg, '— báo cáo tháng ba, sếp ghi nhận', 300, 420, { size: 38, p: lp });
          P.pHand(gg, '— 12/03', 700, 420, { size: 38, p: lp });
          P.pHand(gg, '— chị Lan', 1030, 420, { size: 38, p: lp });
        }
        P.pHand(gg, 'mỗi dòng: việc · ngày · một người xác nhận', 110, 700, { size: 42, p: rv(T, 'c5_7', 1.2, 2.3) });
      });
    }, ev: () => [[at('c5_6', -.1), 'whoosh'], [L('c5_6').t0 + .3, 'paper'], [L('c5_7').t0 + .3, 'marker']] },

    { n: 'rule2', t: at('c5_10', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c5_10').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'QUY TẮC HAI: CÂN BẰNG', 90, 150, { size: 60, p: rv(T, 'c5_10', .3, 1.3) });
        const p = rv(T, 'c5_10', 1, 1.9);
        if (p > 0) {
          gg.globalAlpha = p;
          P.balance(gg, 800, 400, 1, 0);
          for (let i = 0; i < 3; i++) {
            cel(gg, rect(500 + i * 60, 340 - i * 52, 560 + i * 60, 400 - i * 52), { f: PAL.red.f, s: PAL.red.s, l: PAL.ink, lw: 2.6 });
            cel(gg, rect(980 + i * 60, 340 - i * 52, 1040 + i * 60, 400 - i * 52), { f: PAL.green.f, s: PAL.green.s, l: PAL.ink, lw: 2.6 });
          }
          P.pHand(gg, 'bị vạch trần', 610, 215, { size: 38, align: 'center', col: PAL.red.s, p });
          P.pHand(gg, 'được công nhận', 990, 215, { size: 38, align: 'center', col: PAL.green.s, p });
        }
        P.pHand(gg, '1 : 1', 90, 680, { size: 50, p: rv(T, 'c5_10', 1.8, 2.9) });
        P.pHand(gg, 'cân bằng mẫu số', 90, 740, { size: 42, p: rv(T, 'c5_11', .3, 1.3) });
      });
    }, ev: () => [[at('c5_10', -.1), 'whoosh'], [L('c5_10').t0 + 1, 'marker']] },

    { n: 'rule3', t: at('c5_13', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c5_13').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'QUY TẮC BA: ĐỔI CÂU HỎI', 90, 150, { size: 60, p: rv(T, 'c5_13', .3, 1.3) });
        const p = rv(T, 'c5_13', 1, 1.9);
        if (p > 0) {
          gg.globalAlpha = p;
          cel(gg, rect(120, 250, 1500, 400), { f: '#E4DECF', s: '#CDC6B6', l: P.INK, lw: 3 });
          P.pHand(gg, '“Liệu họ có biết mình không đủ?”', 170, 340, { size: 50, col: PAL.red.s, p });
          P.pMark(gg, 1400, 330, { s: 70, col: PAL.red.f, kind: 'cross', p });
          cel(gg, rect(120, 460, 1500, 610), { f: '#E4DECF', s: '#CDC6B6', l: P.INK, lw: 3 });
          P.pHand(gg, '“Ai đã thấy mình làm việc này?”', 170, 550, { size: 50, col: PAL.green.s, p });
          P.pMark(gg, 1400, 540, { s: 70, col: PAL.green.f, kind: 'check', p });
        }
        P.pHand(gg, 'không có đáp án', 90, 680, { size: 44, col: PAL.red.s, p: rv(T, 'c5_13', 1.8, 2.8) });
        P.pHand(gg, 'có đáp án: nằm trong sổ', 90, 740, { size: 44, col: PAL.green.s, p: rv(T, 'c5_14', .3, 1.4) });
      });
    }, ev: () => [[at('c5_13', -.1), 'whoosh'], [L('c5_13').t0 + 1, 'marker'], [L('c5_14').t0 + .3, 'pop']] },

    { n: 'talk', t: at('c5_15', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c5_15').t0;
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      kng(g, 1180, 640, { s: 1.1, talk: talkAt(T), E: ek(T, [[0, 'determined'], [t0 + 2, 'smile']]), headYaw: -.16 + sway(T) }, T);
      S.person(g, 620, 1120, .78, '#4A4260', { ph: .3 });
      const bp = seg(T, t0 + .4, t0 + .9);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 2);
        bubble(g, 900, 330, 860, 190, (gg, bw, bh) => {
          text(gg, 'Cảm ơn cậu, tôi ghi nhận', 0, -26, { font: font(800, 38), align: 'center', base: 'middle', fill: BINK });
          text(gg, 'điều đó nhé.', 0, 28, { font: font(800, 38), align: 'center', base: 'middle', fill: BINK });
        }, { tail: 'left' });
        g.restore();
      }
      S.roomFront(g, T, cam);
    }, ev: () => [[at('c5_15', -.1), 'whoosh'], [L('c5_15').t0 + .4, 'pop']] },

    { n: 'caution', t: at('c5_18', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c5_18').t0;
      page(g, T, t0, (gg, TT, t) => {
        P.pTitle(gg, 'MỘT LƯU Ý', 90, 160, { size: 56, p: rv(T, 'c5_18', .3, 1.2) });
        P.pHand(gg, 'công cụ của tập phim', 90, 300, { size: 54, p: rv(T, 'c5_18', 1, 2) });
        P.pHand(gg, 'không phải liệu pháp', 90, 390, { size: 54, col: PAL.red.s, p: rv(T, 'c5_18', 1.7, 2.7) });
        P.pNote(gg, 'thay thế cho sự im lặng, không thay thế chuyên gia', 90, 520, { size: 34, p: rv(T, 'c5_18', 2.4, 3.2) });
      });
    }, ev: () => [[at('c5_18', -.1), 'whoosh'], [L('c5_18').t0 + 1, 'marker']] },

    // ——— chương 6: hành động hôm nay ———
    { n: 'tonight', t: at('c6_1', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c6_1').t0;
      ST.bedroom(g, T, {});
      P.notebook(g, 1270, 640, 480, 280, { p: seg(T, t0 - .3, t0 + .3) });
      const bp = seg(T, t0 + .4, t0 + 1);
      if (bp > 0) {
        g.save(); g.globalAlpha = Math.min(1, bp * 1.5);
        P.pHand(g, 'mở cuốn sổ ra', 1030, 470, { size: 44, p: bp, col: '#E8E4DC' });
        g.restore();
      }
    }, ev: () => [[at('c6_1', -.1), 'amb', { kind: 'night', t1: at('c6_4', .4) }], [at('c6_1', -.1), 'whoosh'], [L('c6_1').t0 + .4, 'paper']] },

    { n: 'lines', t: at('c6_2', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c6_2').t0;
      ST.bedroom(g, T, {});
      P.notebook(g, 1270, 730, 560, 320, { p: seg(T, t0 - .4, t0 + .2) });
      const rows = ['việc mình đã làm', 'ai đã thấy', 'một lần mình làm tốt', 'hơn mình nghĩ'];
      rows.forEach((r, i) => {
        const p = seg(T, at('c6_2', .4 + i * .7), at('c6_2', 1.2 + i * .7));
        if (p > 0) {
          g.save(); g.globalAlpha = Math.min(1, p * 1.5);
          P.pHand(g, r, 1010, 620 + i * 70, { size: 34, p, col: '#2A2F42' });
          g.restore();
        }
      });
    }, ev: () => [[at('c6_2', -.1), 'whoosh'], [L('c6_2').t0 + .5, 'marker'], [L('c6_2').t0 + 1.2, 'marker'], [L('c6_2').t0 + 1.9, 'marker']] },

    { n: 'end', t: at('c6_4', -.1), tr: 'whip', f(g, lt, T) {
      const t0 = L('c6_4').t0;
      ground(g);
      const cam = { x: 0, y: 0 };
      S.roomBack(g, T, cam);
      kng(g, 1290, 640, { s: 1.15, talk: talkAt(T), E: ek(T, [[0, 'smile'], [t0 + 2, 'determined']]), headYaw: -.1 + sway(T) }, T);
      roi(g, 760, 650, 1.4, { t: T });
      S.roomFront(g, T, cam);
    }, ev: () => [[at('c6_4', -.1), 'whoosh'], [L('c6_6').t1 + .1, 'music', { cue: 'end' }]] }
  ];
}

// ——— transitions ———
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

window.render = T => {
  const g = G; g.setTransform(1, 0, 0, 1, 0, 0);
  let i = SHOTS.length - 1; while (i > 0 && T < SHOTS[i].t) i--;
  const sh = SHOTS[i], nx = SHOTS[i + 1], WH = 0.16;
  if (sh.tr === 'whip' && T - sh.t < WH) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); smear(g, i, T, (1 - ease.out((T - sh.t) / WH)) * W * 0.5); }
  else if (nx && nx.tr === 'whip' && nx.t - T < WH) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); smear(g, i, T, -ease.inOut(1 - (nx.t - T) / WH) * W * 0.5); }
  else drawShot(g, i, T);

  // fade in / fade out at start and end
  const fo = Math.max(1 - T / 0.25, seg(T, TL.end - 0.6, TL.end));
  if (fo > 0) { g.fillStyle = `rgba(0,0,0,${fo})`; g.fillRect(0, 0, W, H); }
  // the end card of the channel
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
