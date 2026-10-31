// "Thức khuya trả thù: Tại sao càng mệt ta càng không muốn ngủ?" — Tập 02 của Trạm Nghĩ Nhiều.
// Built with the authentic character staging, room sets, whip transitions, and foley grammar of Tap 01.
import { figure, expr, blendE, PAL, roi } from '../../../../rig/character.js';
import { cel, path, poly, ellP, line, canvas, W, H, TAU, rect } from '../../../../rig/cel.js';
import { ground, panel, hilite, stamp, pip, bubble, focusLines, subtitle, tag, text, sharpText, font, ease, seg, clamp01, INK, CREAM, ACCENT, REG } from '../../../../rig/broll.js';
import * as S from '../../../../rig/sets.js';
import { build } from './timeline.js';

const cv = document.getElementById('c'), G = cv.getContext('2d');
const [buf, B] = canvas(W, H);
let TL, SHOTS, EV = [];

// ——— animation tools ———
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

// blinks: deterministic every 2-5 s
const BLINKS = []; { let s = 17, t = 1.0; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 250) { BLINKS.push(t); if (r() < 0.2) BLINKS.push(t + 0.28); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < 0.16) return Math.sin(d / 0.16 * Math.PI); } return 0; }

function camera(g, z, fx, fy, ox = 0, oy = 0) { g.translate(fx, fy); g.scale(z, z); g.translate(-fx - ox, -fy - oy); }
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id], w = (id, k) => TL.w(id, k);
const talkAt = T => TL.talk(T);
const sway = T => Math.sin(T * 0.55) * 0.035;

// character at his wooden desk
function desk(g, T, o, z = 1, f = [1320, 420], cardFn, over) {
  ground(g);
  g.save(); camera(g, z, f[0], f[1]);
  const cam = { x: 0, y: 0 };
  S.roomBack(g, T, cam);
  if (cardFn) cardFn(g);
  kng(g, 1250, 640, { s: 1.15, talk: talkAt(T), headRoll: sway(T) * 0.6, ...o }, T);
  if (over) over(g);
  S.roomFront(g, T, cam);
  g.restore();
}

// a glowing phone in hand
function phone(g, glow = 1) {
  const grd = g.createRadialGradient(0, 0, 4, 0, 0, 190);
  grd.addColorStop(0, `rgba(155, 241, 255, ${0.5 * glow})`);
  grd.addColorStop(1, 'rgba(155, 241, 255, 0)');
  g.fillStyle = grd; g.beginPath(); g.arc(0, 0, 190, 0, TAU); g.fill();
  cel(g, rect(-26, -46, 26, 46), { f: '#0E1017', s: '#1B1F2C', so: [-6, -6], l: '#3A4260', lw: 3 });
  cel(g, rect(-19, -38, 19, 38), { f: `rgba(155, 241, 255, ${0.85 * glow})`, l: '#12131A', lw: 2 });
  for (let i = 0; i < 4; i++) line(g, [[-12, -24 + i * 15], [12 - i * 4, -24 + i * 15]], 'rgba(18, 19, 26, 0.5)', 4);
}

// ——— the shots ———
function shots() {
  const at = (id, d) => L(id).t0 - d;
  return [
    // 1 — Cold open: lying on sofa with phone at 01:00 AM
    { n: 'cold', t: 0, f(g, lt, T) {
      g.save(); camera(g, 1 + lt * 0.012, 960, 540);
      ground(g);
      S.sofa(g, T);
      const px = 860, py = 560;
      const grd = g.createRadialGradient(px, py, 20, px, py, 620);
      grd.addColorStop(0, 'rgba(155, 241, 255, 0.28)');
      grd.addColorStop(1, 'rgba(155, 241, 255, 0)');
      g.fillStyle = grd; g.fillRect(0, 0, W, H);
      kng(g, 720, 460, {
        s: 0.85,
        E: expr('tired', { lookY: 0.2 }),
        talk: talkAt(T),
        headYaw: 0.12,
        headPitch: 0.18,
        armR: { at: [165, 60], gest: 'hold', rot: 0.5, prop: gg => phone(gg, 1) },
        armL: { at: [-150, 250] },
        legs: { mode: 'sit' }
      }, T);
      text(g, '01:00', 80, 130, { font: font(900, 84), fill: PAL.red.f });
      text(g, 'mắt đã cay xè, ngón tay vẫn lướt', 80, 190, { font: font(400, 42, 'Patrick Hand'), fill: PAL.muted });
      g.restore();
    }, ev: () => [[0, 'music', { cue: 'A' }], [0, 'amb', { kind: 'night', t1: at('know', 0.35) }]] },

    // 2 — Know: tomorrow 07:00 wakeup call
    { n: 'know', t: at('know', 0.35), tr: 'whip', f(g, lt, T) {
      const t0 = L('know').t0;
      const Ex = ek(T, [[0, 'tired'], [t0 + 2.0, 'worried']]);
      desk(g, T, {
        E: Ex,
        headYaw: -0.12 + sway(T),
        armR: ak(T, [[0, { at: [140, 250] }], [t0 + 0.3, { at: [-185, 95], gest: 'point', rot: -0.15 }]])
      }, 1 + seg(lt, 0, 4.4) * 0.035, [1120, 440],
      g => {
        // Table alarm clock ringing 07:00
        const sp = ease.back(seg(lt, 0.1, 0.5));
        panel(g, { x: 560, y: 470, w: 720, h: 480, rot: -0.02, pin: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 50, y0 = -ch / 2;
          text(gg, '07:00', x0, y0 + 130, { font: font(900, 108), fill: PAL.red.f });
          text(gg, 'SÁNG MAI PHẢI THỨC DẬY', x0, y0 + 220, { font: font(800, 46), fill: CREAM });
          text(gg, 'nhưng càng mệt, càng không muốn ngủ', x0, y0 + 310, { font: font(400, 40, 'Patrick Hand'), fill: PAL.muted });
        });
      });
      roi(g, 380, 720, 1.25, { t: T, E: { mo: 0.2, lookX: 0.4 } });
    }, ev() { return [[this.t - 0.12, 'whoosh'], [this.t + 0.1, 'pop'], [L('know').t0 + 2.0, 'boing']]; } },

    // 3 — Title card
    { n: 'intro', t: at('intro', 0.35), tr: 'whip', f(g, lt, T) {
      const t0 = L('intro').t0, nameT = w('intro', 2), hiT = w('intro', 8);
      const Ex = ek(T, [[0, 'happy'], [t0 + 1.3, 'talk'], [w('intro', 5), 'smile']]);
      const wave = T > t0 - 0.3 && T < t0 + 1.6, wv = Math.sin((T - t0) * 13) * 0.28;
      desk(g, T, {
        E: Ex,
        headYaw: -0.1 + sway(T),
        headRoll: 0.04,
        armL: ak(T, [[0, { at: [-140, 250] }], [t0 - 0.2, { at: [-180, -80], gest: 'open', rot: -0.1 + (wave ? wv : 0), flip: true }], [t0 + 1.5, { at: [-140, 250] }]], 0.3),
        armR: ak(T, [[0, { at: [140, 250] }]])
      }, 1, [1320, 420],
      g => {
        const p = ease.back(seg(lt, 0.05, 0.5));
        panel(g, { x: 560 - (1 - p) * 900, y: 470, w: 720, h: 560, rot: -0.03, pin: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 56, y0 = -ch / 2;
          text(gg, 'TRẠM', x0, y0 + 130, { font: font(900, 96), fill: PAL.hoodie.f });
          text(gg, 'NGHĨ NHIỀU', x0, y0 + 240, { font: font(900, 96), fill: PAL.hoodie.f });
          text(gg, 'Thức khuya trả thù', x0, y0 + 330, { font: font(400, 42, 'Patrick Hand'), fill: PAL.muted });
          hilite(gg, x0 - 10, y0 + 356, 430, 58, seg(T, hiT - 0.1, hiT + 0.35), PAL.hoodie.f, 4);
          text(gg, 'TẬP 02', x0, y0 + 480, { font: font(800, 46), fill: CREAM });
        });
      }, g => {
        tag(g, 'KẺ NGHĨ NHIỀU', 1320, 830, seg(T, nameT - 0.1, nameT + 0.25), { col: PAL.hoodie, px: 34 });
      });
    }, ev() { return [[this.t + 0.05, 'paper'], [w('intro', 2) - 0.1, 'pop'], [w('intro', 8), 'marker'], [this.t, 'music', { cue: 'B' }]]; } },

    // 4 — The Term: Bedtime Procrastination
    { n: 'term', t: at('term', 0.3), f(g, lt, T) {
      const t0 = L('term').t0, defT = w('term', 11);
      ground(g);
      g.save(); camera(g, 1.03, 880, 520);
      panel(g, { x: 880, y: 500, w: 1040, h: 520, rot: -0.02, pin: true }, (gg, cw, ch) => {
        const x0 = -cw / 2 + 60, y0 = -ch / 2;
        hilite(gg, x0 - 10, y0 + 78, 520, 76, seg(T, defT - 0.1, defT + 0.35), PAL.cyan.f, 3);
        text(gg, 'BEDTIME PROCRASTINATION', x0, y0 + 140, { font: font(900, 72), fill: CREAM });
        text(gg, '= trì hoãn giờ ngủ', x0, y0 + 230, { font: font(800, 54), fill: CREAM });
        text(gg, 'không có lý do ngoại cảnh bắt buộc', x0, y0 + 310, { font: font(400, 40, 'Patrick Hand'), fill: PAL.muted });
        text(gg, 'Frontiers in Psychology (2014)', x0, y0 + 390, { font: font(400, 34, 'Patrick Hand'), fill: PAL.muted });
      });
      stamp(g, 'TÂM LÝ HỌC', 920, 760, { rot: 0.08, px: 44, p: seg(T, t0 + 2.2, t0 + 2.45) });
      g.restore();
      pip(g, 185, 790, 165, seg(lt, 0.8, 1.2), (gg, r) => {
        gg.fillStyle = PAL.bg; gg.fillRect(-r, -r, 2 * r, 2 * r);
        gg.save(); gg.translate(0, 150); figure(gg, { s: 0.88, t: T, blink: blink(T), talk: talkAt(T), E: ek(T, [[0, 'talk'], [defT, 'thinking']]) }); gg.restore();
      });
    }, ev() { const t0 = L('term').t0, defT = w('term', 11); return [[this.t, 'amb', { kind: 'room', t1: at('daytime', 0.3) }], [defT - 0.1, 'marker'], [t0 + 2.2, 'stamp']]; } },

    // 5 — Daytime: The busy day eating up all autonomy
    { n: 'daytime', t: at('daytime', 0.3), tr: 'whip', f(g, lt, T) {
      const t0 = L('daytime').t0;
      ground(g);
      S.feedColumn(g, 470, 520, 520, 840, T * 280);
      for (let i = 0; i < 4; i++) {
        const p = seg(T, t0 + i * 0.35, t0 + i * 0.35 + 0.5);
        S.thought(g, 1400, 250 + i * 158, 92 - i * 9, p);
      }
      text(g, 'BAN NGÀY BẬN RỘN', 1400, 140, { font: font(900, 64), align: 'center', fill: CREAM });
      text(g, 'không có 1 giờ cho riêng mình', 1400, 856, { font: font(400, 36, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { return [[this.t - 0.12, 'whoosh'], [this.t, 'music', { cue: 'C' }]]; } },

    // 6 — Revenge: The late night sofa as revenge
    { n: 'revenge', t: at('revenge', 0.3), tr: 'iris', f(g, lt, T) {
      ground(g);
      S.sofa(g, T);
      const px = 860, py = 560;
      const grd = g.createRadialGradient(px, py, 20, px, py, 620);
      grd.addColorStop(0, 'rgba(155, 241, 255, 0.22)');
      grd.addColorStop(1, 'rgba(155, 241, 255, 0)');
      g.fillStyle = grd; g.fillRect(0, 0, W, H);
      kng(g, 720, 460, {
        s: 0.85,
        E: expr('smile'),
        talk: talkAt(T),
        headYaw: 0.12,
        headPitch: 0.18,
        armR: { at: [165, 60], gest: 'hold', rot: 0.5, prop: gg => phone(gg, 1) },
        armL: { at: [-150, 250] },
        legs: { mode: 'sit' }
      }, T);
      text(g, '23:45', 60, 120, { font: font(900, 72), fill: PAL.muted });
      text(g, 'đòi lại một chút quyền tự do', 60, 176, { font: font(400, 38, 'Patrick Hand'), fill: PAL.muted });
    }, ev() { return [[this.t, 'amb', { kind: 'night', t1: at('irony', 0.3) }]]; } },

    // 7 — Irony: The consequence falls on you
    { n: 'irony', t: at('irony', 0.25), tr: 'whip', f(g, lt, T) {
      ground(g, '#161925');
      focusLines(g, 960, 470, T, '#222A40', 70, 420);
      kng(g, 1000, 1020, { s: 3.1, E: expr('tired', { ms: -0.3, lookY: 0.2 }), headRoll: -0.04, talk: null }, T);
      g.globalAlpha = seg(T, L('irony').t0 + 0.6, L('irony').t0 + 1.1);
      text(g, 'NGƯỜI GÁNH NỢ LÀ CHÍNH BẠN', 960, 140, { font: font(900, 64), align: 'center', fill: PAL.red.f });
      g.globalAlpha = 1;
    }, ev() { return [[this.t - 0.12, 'whoosh'], [this.t, 'boing']]; } },

    // 8 — Roi: Rối warns that screens don't give freedom
    { n: 'roi', t: at('roi', 0.25), f(g, lt, T) {
      ground(g);
      roi(g, 620, 620, 3.1, { t: T, E: { mo: 0.5, lookX: 0.2 } });
      bubble(g, 1240, 420, 820, 300, (gg, w, h) => {
        text(gg, 'Màn hình không mang lại tự do,', 0, -34, { font: font(800, 46), align: 'center', base: 'middle', fill: INK });
        text(gg, 'nó chỉ đánh cắp nốt', 0, 20, { font: font(800, 46), align: 'center', base: 'middle', fill: INK });
        text(gg, 'năng lượng của bạn.', 0, 74, { font: font(800, 46), align: 'center', base: 'middle', fill: PAL.violet.f });
      });
    }, ev() { return [[this.t, 'boing'], [this.t, 'music', { cue: 'D' }]]; } },

    // 9 — Action: 15 minutes of daytime autonomy
    { n: 'action', t: at('action', 0.3), tr: 'whip', f(g, lt, T) {
      const t0 = L('action').t0, hiT = w('action', 12);
      desk(g, T, {
        E: ek(T, [[0, 'smile'], [hiT, 'excited']]),
        headYaw: -0.1 + sway(T),
        armL: ak(T, [[0, { at: [-140, 250] }], [t0 + 0.5, { at: [-180, 80], gest: 'point', rot: -0.1 }]])
      }, 1, [1320, 420],
      g => {
        panel(g, { x: 560, y: 470, w: 720, h: 480, rot: -0.02, pin: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 50, y0 = -ch / 2;
          text(gg, 'HÀNH ĐỘNG HÔM NAY', x0, y0 + 120, { font: font(900, 56), fill: PAL.green.f });
          text(gg, '15 phút tự do ban ngày', x0, y0 + 210, { font: font(800, 48), fill: CREAM });
          hilite(gg, x0 - 10, y0 + 236, 480, 56, seg(T, hiT - 0.1, hiT + 0.35), PAL.green.f, 4);
          text(gg, 'trước khi đi ngủ', x0, y0 + 340, { font: font(400, 38, 'Patrick Hand'), fill: PAL.muted });
        });
      });
    }, ev() { return [[this.t - 0.12, 'whoosh'], [this.t + 0.05, 'paper'], [w('action', 12), 'marker']]; } },

    // 10 — Close: Peaceful night, good night
    { n: 'close', t: at('close', 0.4), f(g, lt, T) {
      desk(g, T, {
        E: expr('sleepy', { smile: 0.4 }),
        headYaw: -0.1 + sway(T),
        armL: { at: [-140, 250] },
        armR: { at: [140, 250] }
      }, 1, [1320, 420],
      g => {
        panel(g, { x: 560, y: 470, w: 720, h: 420, rot: -0.03, tape: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 50, y0 = -ch / 2;
          text(gg, 'Đừng để đêm muộn', x0, y0 + 130, { font: font(900, 52), fill: CREAM });
          text(gg, 'phải trả nợ ban ngày.', x0, y0 + 210, { font: font(900, 52), fill: PAL.hoodie.f });
          text(gg, 'Ngủ ngon nhé.', x0, y0 + 310, { font: font(400, 48, 'Patrick Hand'), fill: PAL.muted });
        });
      });
    }, ev() { return [[L('close').t1 + 0.3, 'paper'], [L('close').t1 + 0.3, 'music', { cue: 'end' }]]; } }
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
  else if (sh.tr === 'iris' && T - sh.t < 0.55) {
    const list = REG.list; REG.list = null; drawShot(g, i - 1, T); REG.list = list;
    const r = ease.inOut((T - sh.t) / 0.55) * 1250;
    g.save(); g.beginPath(); g.arc(1000, 560, r, 0, TAU); g.clip(); drawShot(g, i, T); g.restore();
    g.lineWidth = 22; g.strokeStyle = PAL.hoodie.f; g.beginPath(); g.arc(1000, 560, r, 0, TAU); g.stroke();
  } else drawShot(g, i, T);

  // fade in / fade out at start and end
  const fo = Math.max(1 - T / 0.25, seg(T, TL.end - 0.6, TL.end));
  if (fo > 0) { g.fillStyle = `rgba(0,0,0,${fo})`; g.fillRect(0, 0, W, H); }
  for (const c of TL.cues) if (T >= c.t0 && T < c.t1) subtitle(g, c.text);
};

window.TEXTS = T => { REG.list = []; window.render(T); const l = REG.list; REG.list = null; return l; };

async function setup() {
  const j = p => fetch(p).then(r => r.json());
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
