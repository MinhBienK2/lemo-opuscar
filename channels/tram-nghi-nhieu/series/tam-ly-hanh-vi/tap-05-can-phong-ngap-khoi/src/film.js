// "Căn phòng ngập khói 1968 — Tại sao càng đông người, ta càng bất động?" — Tập 05 của Trạm Nghĩ Nhiều.
// Hoàn toàn không có slide trắng; bối cảnh phòng kín 1968 có khói xì thực tế; nhân vật Tuấn và 2 diễn viên phụ;
// Kẻ Nghĩ Nhiều & Rối đóng vai trò người quan sát thứ ba đồng hành giải mã tâm lý.
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

const BLINKS = []; { let s = 31, t = 1.0; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 250) { BLINKS.push(t); if (r() < 0.2) BLINKS.push(t + 0.28); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < 0.16) return Math.sin(d / 0.16 * Math.PI); } return 0; }
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id];
const talkAt = T => TL.talk(T);
const sway = T => Math.sin(T * 0.55) * 0.035;

function shots() {
  const at = (id, d = 0) => L(id).t0 + d;
  const rv = (T, id, a = .3, b = 1.2) => seg(T, at(id, a), at(id, b));

  return [
    // [Cảnh 1: 0:00 - ~26s] Căn phòng Đại học Columbia 1968 (intro1 đến intro4)
    // Toàn bộ căn phòng thật; Tuấn ngồi cắm cúi viết; Kẻ Nghĩ Nhiều & Rối ở ngưỡng cửa kể chuyện
    { n: 'room_intro', t: 0, tr: 'iris', f(g, lt, T) {
      const t1 = L('intro1').t0, t2 = L('intro2').t0, t4 = L('intro4').t0;
      ST.columbiaRoom(g, T);
      // Nhân vật chính Tuấn ở giữa bàn
      ST.tuanStudent(g, 960, 610, { emotion: 'neutral', action: 'write' }, T);
      ST.testingDesk(g, T, { confederates: false });

      // Người dẫn chuyện thứ ba: Kẻ Nghĩ Nhiều & Rối ở góc trái cửa phòng
      kng(g, 280, 680, { s: 0.95, talk: talkAt(T), E: ek(T, [[0, 'determined'], [t2, 'smile']]), headYaw: 0.12 + sway(T) }, T);
      roi(g, 180, 520, 1.1, { t: T });

      // Nhãn bối cảnh ở góc
      tag(g, 'ĐẠI HỌC COLUMBIA · 1968', 260, 110, seg(T, 0.4, 1.0), { col: PAL.cyan, px: 32 });

      // intro4: Đèn rọi vào lỗ thông gió chân tường
      const pVent = rv(T, 'intro4', 0.2, 1.2);
      if (pVent > 0) {
        g.save();
        g.strokeStyle = PAL.red.f; g.lineWidth = 5; g.setLineDash([12, 10]);
        g.beginPath(); g.ellipse(1730, 665, 140, 75, 0, 0, TAU); g.stroke();
        g.setLineDash([]);
        g.restore();
      }
      ambientMotes(g, T, 10, { x0: 200, y0: 200, x1: 1720, y1: 850 });
    }, ev: () => [[.2, 'music', { cue: 'A' }], [.4, 'amb', { kind: 'room', t1: at('smoke1', .4) }], [.3, 'pop'], [L('intro4').t0 + .4, 'ting']] },

    // [Cảnh 2: ~26s - ~50s] Khói trắng bắt đầu xì ra từ lưới thông gió (smoke1 đến smoke3)
    // Cận cảnh lỗ thông gió phì khói cuồn cuộn, Tuấn giật mình hoang mang
    { n: 'smoke_vent', t: at('smoke1', -.1), tr: 'cut', f(g, lt, T) {
      const t1 = L('smoke1').t0, t2 = L('smoke2').t0, t3 = L('smoke3').t0;
      ST.columbiaRoom(g, T);

      // Mức độ khói tăng dần từ 0.2 lên 0.75
      const smokeDensity = seg(T, t1, t3 + 3.0) * 0.85;
      ST.dynamicSmoke(g, T, smokeDensity);

      // Tuấn ngừng viết, ngẩng đầu ngửi ngửi, mắt chớp lo lắng
      const isSmelling = T > t1 + 1.5;
      ST.tuanStudent(g, 960, 610, { emotion: isSmelling ? 'worried' : 'neutral', action: 'hesitate', headPitch: isSmelling ? -6 : 0, lookRight: true }, T);
      ST.testingDesk(g, T, { confederates: false });

      // Kẻ Nghĩ Nhiều ở tiền cảnh góc trái
      kng(g, 260, 700, { s: 0.9, talk: talkAt(T), E: ek(T, [[0, 'thinking'], [t2, 'worried']]), headYaw: 0.16 }, T);
      roi(g, 170, 540, 1.0, { t: T });

      // smoke3: Dòng suy nghĩ của Tuấn xuất hiện
      const pThought = rv(T, 'smoke3', 0.4, 1.4);
      if (pThought > 0) {
        g.save(); g.globalAlpha = Math.min(1, pThought * 1.8);
        bubble(g, 1020, 360, 800, 190, (gg) => {
          text(gg, 'Tòa nhà đang cháy thật rồi!', 0, 0, { font: font(800, 42), align: 'center', base: 'middle', fill: PAL.red.s });
        }, { tail: 'left' });
        g.restore();
      }
    }, ev: () => [[at('smoke1', -.1), 'music', { cue: 'B' }], [L('smoke1').t0 + .4, 'whoosh'], [L('smoke3').t0 + .4, 'pop']] },

    // [Cảnh 3: ~50s - ~75s] Thí nghiệm A: Khi Tuấn ở một mình (alone1 đến alone3)
    // Phản xạ tự nhiên: đứng bật dậy chạy ra cửa báo cháy (75% trong 2 phút)
    { n: 'alone_escape', t: at('alone1', -.1), tr: 'cut', f(g, lt, T) {
      const t1 = L('alone1').t0, t2 = L('alone2').t0, t3 = L('alone3').t0;
      ST.columbiaRoom(g, T);
      ST.dynamicSmoke(g, T, 0.65);

      // Tuấn đứng dậy và chạy về phía cửa (từ x: 960 -> 320)
      const isRun = T >= t2 + 0.8;
      const escapeX = isRun ? Math.max(300, 960 - (T - (t2 + 0.8)) * 380) : 960;
      const escapeY = isRun ? 560 : 610;
      ST.tuanStudent(g, escapeX, escapeY, { emotion: 'worried', action: isRun ? 'escape' : 'hesitate', headPitch: -4 }, T);

      ST.testingDesk(g, T, { confederates: false });

      // alone3: Kẻ Nghĩ Nhiều giơ chiếc đồng hồ đo giây: 75% trong 2 phút
      kng(g, 1560, 680, { s: 1.0, talk: talkAt(T), E: ek(T, [[0, 'determined'], [t3, 'smile']]), headYaw: -0.14 }, T);
      const pStat = rv(T, 'alone3', 0.4, 1.4);
      if (pStat > 0) {
        g.save(); g.globalAlpha = Math.min(1, pStat * 1.8);
        cel(g, rect(1120, 220, 1720, 430), { f: '#1E2333', s: '#151824', so: [0, 8], l: PAL.ink, lw: 3.5 });
        text(g, '75%', 1420, 310, { font: font(900, 88), align: 'center', base: 'middle', fill: PAL.green.f });
        text(g, 'báo cháy trong < 2 phút', 1420, 380, { font: font(700, 36), align: 'center', base: 'middle', fill: CREAM });
        g.restore();
      }
    }, ev: () => [[L('alone2').t0 + .8, 'step'], [L('alone3').t0 + .5, 'stamp']] },

    // [Cảnh 4: ~75s - ~112s] Thí nghiệm B: Hai người lạ ngồi cạnh làm lơ (group1 đến hesitate3)
    // Xung đột kịch tính: Tuấn ho sặc sụa, nhìn 2 người làm lơ, ngập ngừng ngồi thụp xuống
    { n: 'group_conflict', t: at('group1', -.1), tr: 'whip', f(g, lt, T) {
      const t1 = L('group1').t0, t4 = L('group4').t0, t5 = L('group5').t0, h2 = L('hesitate2').t0;
      ST.columbiaRoom(g, T);

      // Khói ngập dày đặc khắp phòng
      const smokeD = seg(T, t1, at('hesitate3', 2.0)) * 0.95;
      ST.dynamicSmoke(g, T, smokeD);

      // Hai người lạ (Confederates) ngồi bên cạnh bình thản lật giấy
      ST.passiveActor(g, 620, 620, { s: 0.95 }, T);
      ST.passiveActor(g, 1300, 620, { s: 0.95 }, T);

      // Tuấn ở giữa: ban đầu viết -> ho sặc sụa (t5) -> ngập ngừng nhổm dậy rồi ngồi thụp xuống (h2)
      let action = 'write';
      if (T >= h2) action = 'hesitate';
      else if (T >= t5) action = 'cough';
      ST.tuanStudent(g, 960, 610, { emotion: 'worried', action, headYaw: Math.sin(T * 3.5) * 0.25, lookRight: true }, T);

      ST.testingDesk(g, T, { confederates: true });

      // Kẻ Nghĩ Nhiều & Rối ở tiền cảnh quan sát bi kịch
      kng(g, 240, 720, { s: 0.88, talk: talkAt(T), E: ek(T, [[0, 'thinking'], [t5, 'worried'], [h2, 'sad']]), headYaw: 0.16 }, T);
      roi(g, 150, 560, 1.1, { t: T });
    }, ev: () => [[at('group1', -.1), 'music', { cue: 'B' }], [at('group1', -.1), 'whoosh'], [L('group5').t0 + .4, 'pop'], [L('hesitate2').t0 + .5, 'boing']] },

    // [Cảnh 5: ~112s - ~142s] Cơ chế tâm lý & Con số gây sốc (mech1 đến stats3)
    // Hiểu lầm tập thể (Pluralistic Ignorance) & Bảng số liệu: 10% vs 90%
    { n: 'stats_mechanism', t: at('mech1', -.1), tr: 'cut', f(g, lt, T) {
      const m1 = L('mech1').t0, s1 = L('stats1').t0, s2 = L('stats2').t0;
      ST.columbiaRoom(g, T);
      ST.dynamicSmoke(g, T, 0.92);

      // Căn phòng ngập khói, 3 người ngồi bất động trong sương mù
      ST.passiveActor(g, 620, 620, { s: 0.95 }, T);
      ST.passiveActor(g, 1300, 620, { s: 0.95 }, T);
      ST.tuanStudent(g, 960, 610, { emotion: 'worried', action: 'hesitate' }, T);
      ST.testingDesk(g, T, { confederates: true });

      // Kẻ Nghĩ Nhiều ở trung tâm giải thích cơ chế
      kng(g, 420, 670, { s: 1.05, talk: talkAt(T), E: ek(T, [[0, 'determined'], [s2, 'shocked']]), headYaw: -0.1 }, T);
      roi(g, 310, 520, 1.2, { t: T });

      // Mech badge
      tag(g, 'HIỂU LẦM TẬP THỂ (PLURALISTIC IGNORANCE)', 960, 180, seg(T, m1 + 0.3, m1 + 1.0), { col: PAL.violet, px: 36 });

      // stats2 & stats3: Bảng đối chiếu chấn động 10% vs 90%
      const pStats = rv(T, 'stats2', 0.3, 1.3);
      if (pStats > 0) {
        g.save(); g.globalAlpha = Math.min(1, pStats * 1.8);
        cel(g, rect(1100, 260, 1780, 520), { f: '#1B1F2E', s: '#12141D', so: [0, 10], l: PAL.ink, lw: 4 });
        text(g, 'CÓ 2 NGƯỜI LẠ NGỒI CẠNH', 1440, 310, { font: font(800, 32), align: 'center', base: 'middle', fill: PAL.muted });
        // 10% dám đứng dậy
        text(g, '10%', 1260, 390, { font: font(900, 72), align: 'center', base: 'middle', fill: PAL.green.f });
        text(g, 'dám báo cháy', 1260, 450, { font: font(700, 30), align: 'center', base: 'middle', fill: CREAM });
        // 90% ngồi yên hít khói
        text(g, '90%', 1620, 390, { font: font(900, 72), align: 'center', base: 'middle', fill: PAL.red.f });
        text(g, 'ngồi yên 6 phút', 1620, 450, { font: font(700, 30), align: 'center', base: 'middle', fill: CREAM });
        g.restore();
      }
    }, ev: () => [[L('mech1').t0 + .4, 'marker'], [L('stats2').t0 + .4, 'stamp'], [L('stats3').t0 + .6, 'ting']] },

    // [Cảnh 6: ~142s - ~166s] Mở toang cửa sổ: Bài học thức tỉnh & Tạm biệt (action1 đến action4)
    // Ánh nắng ùa vào, khói tan dần, Kẻ Nghĩ Nhiều kéo Tuấn đứng dậy
    { n: 'resolution', t: at('action1', -.1), tr: 'cut', f(g, lt, T) {
      const a1 = L('action1').t0, a4 = L('action4').t0;
      ground(g, '#101422');

      // Khung cửa sổ mở toang đón ánh nắng bầu trời xanh
      const wx = 620, wy = 140, ww = 680, wh = 520;
      cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#87CEEB', s: '#5FA8C8', so: [0, 8], l: PAL.ink, lw: 4 });
      // Ánh nắng vàng rọi vào phòng
      const sunGrd = g.createRadialGradient(wx + 340, wy + 180, 50, wx + 340, wy + 260, 700);
      sunGrd.addColorStop(0, 'rgba(255, 236, 179, 0.45)');
      sunGrd.addColorStop(1, 'rgba(255, 236, 179, 0)');
      g.fillStyle = sunGrd; g.fillRect(0, 0, 1920, 1080);

      // Cánh cửa sổ mở hai bên
      cel(g, rect(wx - 120, wy, wx, wy + wh), { f: '#3E2A1C', s: '#2A1C12', l: PAL.ink, lw: 3 });
      cel(g, rect(wx + ww, wy, wx + ww + 120, wy + wh), { f: '#3E2A1C', s: '#2A1C12', l: PAL.ink, lw: 3 });

      // Kẻ Nghĩ Nhiều và Rối đứng giữa luồng sáng
      kng(g, 960, 680, { s: 1.15, talk: talkAt(T), E: ek(T, [[0, 'determined'], [a4, 'smile']]), headYaw: sway(T) }, T);
      roi(g, 1180, 520, 1.3, { t: T });

      // Lời kêu gọi hành động
      tag(g, 'HÃY LÀ NGƯỜI ĐẦU TIÊN ĐỨNG DẬY', 960, 780, seg(T, a1 + 0.4, a1 + 1.2), { col: PAL.hoodie, px: 36 });
    }, ev: () => [[at('action1', -.1), 'music', { cue: 'C' }], [L('action1').t0 + .4, 'whoosh'], [L('action4').t1 + .1, 'music', { cue: 'end' }]] }
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
