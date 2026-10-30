// "Tại sao càng rảnh, ta càng thấy mệt?" — Tập 01 của kênh Trạm Nghĩ Nhiều.
// Shots are functions of local time; every time comes from timeline.js (the real voice).
// Page contract: window.render(t), DUR, READY, EV (sound events), TEXTS(t) (on-screen text for the reading check), CUES (subtitles).
import { figure, expr, blendE, PAL, roi, battery } from '../../rig/character.js';
import { cel, path, poly, ellP, line, limb, mix, rgba, canvas, W, H, TAU, rect } from '../../rig/cel.js';
import { ground, panel, hilite, stamp, pip, bubble, focusLines, subtitle, tag, ring, batteryBig, text, sharpText, font, ease, seg, clamp01, INK, CREAM, ACCENT, STORY, REG } from '../../rig/broll.js';
import * as S from '../../rig/sets.js';
import { build } from './timeline.js';

const cv = document.getElementById('c'), G = cv.getContext('2d');
const [buf, B] = canvas(W, H);
let TL, SHOTS, EV = [];

// ——— animation tools ———
const E = x => typeof x === 'string' ? expr(x) : expr(x[0], x[1]);
function ek(T, keys, bl = .14) {   // expression keys [[t, name | [name, over]]], blended over bl seconds
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const cur = E(keys[i][1]); if (i === 0) return cur;
  const u = seg(T, keys[i][0], keys[i][0] + bl); return u >= 1 ? cur : blendE(E(keys[i - 1][1]), cur, ease.inOut(u));
}
const lerp = (a, b, u) => a + (b - a) * u;
function ak(T, keys, d = .34) {   // arm keys [[t, {at, gest, rot, fore, upper, flip, prop}]]: back-eased move
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const c = keys[i][1]; if (i === 0) return c;
  const p = keys[i - 1][1], u = ease.back(seg(T, keys[i][0], keys[i][0] + d)), v = ease.inOut(seg(T, keys[i][0], keys[i][0] + d * .7));
  return { ...(v < .5 ? p : c), at: [lerp(p.at[0], c.at[0], u), lerp(p.at[1], c.at[1], u)], rot: lerp(p.rot || 0, c.rot || 0, v),
    fore: lerp(p.fore ?? 1, c.fore ?? 1, v), upper: lerp(p.upper ?? 1, c.upper ?? 1, v), gest: v < .5 ? (p.gest || 'relaxed') : (c.gest || 'relaxed') };
}
function nk(T, keys, d = .5) {   // numeric keys [[t, value]]: eased in-out
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  if (i === 0) return keys[0][1];
  return lerp(keys[i - 1][1], keys[i][1], ease.inOut(seg(T, keys[i][0], keys[i][0] + d)));
}
// blinks: every 2–5 s, sometimes double; deterministic
const BLINKS = []; { let s = 11, t = 1.2; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 200) { BLINKS.push(t); if (r() < .2) BLINKS.push(t + .28); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < .16) return Math.sin(d / .16 * Math.PI); } return 0; }
function camera(g, z, fx, fy, ox = 0, oy = 0) { g.translate(fx, fy); g.scale(z, z); g.translate(-fx - ox, -fy - oy); }
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id], w = (id, k) => TL.w(id, k);
const talkAt = T => TL.talk(T);
const sway = T => Math.sin(T * .55) * .035;
const FULL = .72;                       // the scale of a full-body figure (the feet then land at y ≈ 1000)
const feet = s => 1010 - 650 * (s || FULL);

// the character at his desk: x, y of the neck base on screen
function desk(g, T, o, z = 1, f = [1320, 420], cardFn, over) {
  ground(g);
  g.save(); camera(g, z, f[0], f[1]);
  const cam = { x: 0, y: 0 };
  S.roomBack(g, T, cam);
  if (cardFn) cardFn(g);
  kng(g, 1250, 640, { s: 1.15, talk: talkAt(T), headRoll: sway(T) * .6, ...o }, T);
  if (over) over(g);
  S.roomFront(g, T, cam);
  g.restore();
}
const pipHost = (o, T) => (gg, r) => {
  gg.fillStyle = PAL.bg; gg.fillRect(-r, -r, 2 * r, 2 * r);
  const grd = gg.createRadialGradient(0, 40, 10, 0, 40, r * 1.3);
  grd.addColorStop(0, 'rgba(255,183,3,.18)'); grd.addColorStop(1, 'rgba(255,183,3,0)');
  gg.fillStyle = grd; gg.fillRect(-r, -r, 2 * r, 2 * r);
  gg.save(); gg.translate(0, 112); figure(gg, { s: 1.05, t: T, blink: blink(T), talk: talkAt(T), linePx: 3, ...o }); gg.restore();
};
const popP = (lt, a, b) => lt < b ? seg(lt, a, a + .3) : 1 - seg(lt, b, b + .22);

// a phone in a hand
function phone(g, glow = 1) {
  const grd = g.createRadialGradient(0, 0, 4, 0, 0, 190);
  grd.addColorStop(0, rgba('#9BF1FF', .5 * glow)); grd.addColorStop(1, rgba('#9BF1FF', 0));
  g.fillStyle = grd; g.beginPath(); g.arc(0, 0, 190, 0, TAU); g.fill();
  cel(g, rect(-26, -46, 26, 46), { f: '#0E1017', s: '#1B1F2C', so: [-6, -6], l: '#3A4260', lw: 3 });
  cel(g, rect(-19, -38, 19, 38), { f: rgba('#9BF1FF', .8 * glow), l: '#12131A', lw: 2 });
  for (let i = 0; i < 4; i++) line(g, [[-12, -24 + i * 15], [12 - i * 4, -24 + i * 15]], rgba('#12131A', .5), 4);
}

// ——— the shots ———
// each: { n, t (start), f(g, lt, T), ev: () => [[t, type, extra]] }
function shots() {
  const at = (id, d) => L(id).t0 - d;
  const dur = id => L(id).t1 - L(id).t0;
  return [
    // 1 — the cold open: a phone on 3%
    { n: 'cold', t: 0, f(g, lt, T) {
      g.save(); camera(g, 1 + lt * .012, 960, 540);
      ground(g);
      batteryBig(g, 620, 300, 680, .03, T);
      text(g, '3%', 960, 640, { font: font(900, 170), align: 'center', fill: PAL.red.f });
      text(g, 'HẾT PIN', 960, 760, { font: font(900, 64), align: 'center', fill: CREAM });
      text(g, 'một ngày không làm việc gì cả', 960, 824, { font: font(400, 44, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      g.restore();
    }, ev: () => [[0, 'music', { cue: 'A' }], [0, 'amb', { kind: 'room', t1: at('hook2', .3) }]] },

    // 2 — the hook: the desk at night
    { n: 'hook2', t: at('hook2', .35), tr: 'whip', f(g, lt, T) {
      const t0 = L('hook2').t0;
      const Ex = ek(T, [[0, 'talk'], [t0 + 2.4, 'thinking']]);
      desk(g, T, { E: Ex, headYaw: -.12 + sway(T), bodyYaw: -.06,
        armR: ak(T, [[0, { at: [140, 250] }], [t0 + .3, { at: [-185, 95], gest: 'point', rot: -.15, flip: false }]]) },
        1 + seg(lt, 0, 4.4) * .035, [1120, 440]);
      roi(g, 380, 720, 1.25, { t: T, E: { mo: .2, lookX: .4 } });
    }, ev() { return [[this.t - .12, 'whoosh'], [this.t + .1, 'pop'], [L('hook2').t0 + 2.4, 'boing']]; } },

    // 3 — the title card
    { n: 'title', t: at('intro', .35), f(g, lt, T) {
      const t0 = L('intro').t0, nameT = w('intro', 2), hiT = w('intro', 8);
      const Ex = ek(T, [[0, 'happy'], [t0 + 1.3, 'talk'], [w('intro', 5), 'smile']]);
      const wave = T > t0 - .3 && T < t0 + 1.6, wv = Math.sin((T - t0) * 13) * .28;
      desk(g, T, { E: Ex, headYaw: -.1 + sway(T), headRoll: .04,
        armL: ak(T, [[0, { at: [-140, 250] }], [t0 - .2, { at: [-180, -80], gest: 'open', rot: -.1 + (wave ? wv : 0), flip: true }], [t0 + 1.5, { at: [-140, 250] }]], .3),
        armR: ak(T, [[0, { at: [140, 250] }]]) }, 1, [1320, 420],
      g => {
        const p = ease.back(seg(lt, .05, .5));
        panel(g, { x: 560 - (1 - p) * 900, y: 470, w: 720, h: 560, rot: -.03, tape: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 56, y0 = -ch / 2;
          text(gg, 'TRẠM', x0, y0 + 130, { font: font(900, 96), fill: PAL.hoodie.f });
          text(gg, 'NGHĨ NHIỀU', x0, y0 + 240, { font: font(900, 96), fill: PAL.hoodie.f });
          text(gg, 'Tại sao càng rảnh, ta càng mệt?', x0, y0 + 330, { font: font(400, 42, 'Patrick Hand'), fill: PAL.muted });
          hilite(gg, x0 - 10, y0 + 356, 430, 58, seg(T, hiT - .1, hiT + .35), PAL.hoodie.f, 4);
          text(gg, 'TẬP 01', x0, y0 + 480, { font: font(800, 46), fill: CREAM });
        });
      }, g => {
        tag(g, 'KẺ NGHĨ NHIỀU', 1320, 830, seg(T, nameT - .1, nameT + .25), { col: PAL.hoodie, px: 34 });
      });
    }, ev() { return [[this.t + .05, 'paper'], [w('intro', 2) - .1, 'pop'], [w('intro', 8), 'marker'], [this.t, 'music', { cue: 'B' }]]; } },

    // 4 — the 47% figure
    { n: 'f1', t: at('f1', .3), f(g, lt, T) {
      const t0 = L('f1').t0, p = ease.out(seg(T, t0, t0 + 1.3));
      ground(g);
      g.save(); camera(g, 1.05, 700, 520);
      ring(g, 700, 470, 225, p * .47, ACCENT, 30);
      g.globalAlpha = seg(T, t0 + .9, t0 + 1.3);
      text(g, '47%', 700, 520, { font: font(900, 140), align: 'center', fill: CREAM });
      g.globalAlpha = 1;
      text(g, 'thời gian thức', 700, 580, { font: font(400, 40, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      S.hourRow(g, 290, 830, 820, 44, p * .47, { n: 24, hi: .47 });
      // no caption under the chart: the voice says the sentence, and the band under it belongs to the subtitles
      g.restore();
      pip(g, 1650, 720, 165, popP(lt, 1.0, dur('f1') + .3), pipHost({ E: ek(T, [[0, 'talk'], [w('f1', 7), 'excited']]), headYaw: -.25 }, T));
    }, ev() { const t0 = L('f1').t0; return [[this.t + .1, 'pop'], [t0 + .9, 'ting'], [this.t, 'music', { cue: 'C' }]]; } },

    // 5 — the reaction: even while you enjoy it
    { n: 'f2', t: at('f2', .25), f(g, lt, T) {
      ground(g, '#161925');
      focusLines(g, 960, 470, T, '#222A40', 70, 420);
      kng(g, 1000, 1020, { s: 3.1, E: expr('tired', { ms: -.3, lookY: .2 }), headRoll: -.04, talk: null }, T);
      g.globalAlpha = seg(T, L('f2').t0 + .6, L('f2').t0 + 1.1);
      text(g, 'ĐẦU LANG THANG', 110, 120, { font: font(900, 54), fill: PAL.muted });
      g.globalAlpha = 1;
    }, ev() { return [[this.t, 'boing'], [L('f2').t0 + .6, 'rise']]; } },

    // 6 — drifting away in the middle of a conversation
    { n: 'drift', t: at('drift', .25), f(g, lt, T) {
      const t0 = L('drift').t0, d0 = w('drift', 3), dr = ease.inOut(seg(T, d0 + .4, d0 + 3));
      ground(g);
      S.person(g, 560, 1010, 1.15, '#3A4260', { t: T });
      kng(g, 1180, feet(.95), { s: .95, E: expr('talk'), talk: talkAt(T), headYaw: -.18 }, T);
      S.thought(g, 560 - dr * 300, 470 - dr * 190, 76, seg(T, d0, d0 + .5));
      g.globalAlpha = 1 - dr * .8;
      for (let i = 0; i < 3; i++) { g.fillStyle = PAL.muted; g.beginPath(); g.arc(560 - dr * (330 + i * 46), 470 - dr * (210 + i * 30), 7 - i, 0, TAU); g.fill(); }
      g.globalAlpha = 1;
      text(g, '…', 560 - dr * 380, 470 - dr * 250, { font: font(900, 54), fill: PAL.muted, align: 'center' });
    }, ev() { const d0 = w('drift', 3); return [[this.t, 'amb', { kind: 'room', t1: at('bored', .2) }], [d0 + .4, 'swish']]; } },

    // 7 — what boredom actually is
    { n: 'bored', t: at('bored', .2), f(g, lt, T) {
      const t0 = L('bored').t0, defT = w('bored', 6);
      ground(g);
      g.save(); camera(g, 1.03, 880, 520);
      panel(g, { x: 880, y: 500, w: 1020, h: 520, rot: -.02, pin: true }, (gg, cw, ch) => {
        const x0 = -cw / 2 + 60, y0 = -ch / 2;
        hilite(gg, x0 - 10, y0 + 78, 250, 76, seg(T, defT - .1, defT + .35), PAL.hoodie.f, 3);
        text(gg, 'CHÁN', x0, y0 + 150, { font: font(900, 108), fill: CREAM });
        text(gg, '=  mệt  +  bồn chồn', x0, y0 + 250, { font: font(800, 54), fill: CREAM });
        text(gg, 'một cảm giác có tên gọi', x0, y0 + 320, { font: font(400, 40, 'Patrick Hand'), fill: PAL.muted });
        text(gg, 'vì không có gì để tập trung', x0, y0 + 400, { font: font(400, 40, 'Patrick Hand'), fill: PAL.muted });
      });
      stamp(g, 'KHÔNG PHẢI LÀ THIẾU VIỆC', 900, 760, { rot: .09, px: 44, p: seg(T, t0 + 2.2, t0 + 2.45) });
      g.restore();
      pip(g, 185, 790, 165, popP(lt, .8, dur('bored') + .3), pipHost({ E: ek(T, [[0, 'talk'], [defT, 'thinking']]), headYaw: .2 }, T));
    }, ev() { const t0 = L('bored').t0, defT = w('bored', 6); return [[this.t, 'amb', { kind: 'room', t1: at('scroll1', .5) }], [this.t, 'music', { cue: 'D' }], [defT - .1, 'marker'], [t0 + 2.2, 'stamp']]; } },

    // 8 — inside the scene: the sofa at night
    { n: 'scroll1', t: at('scroll1', .5), tr: 'iris', f(g, lt, T) {
      const t0 = L('scroll1').t0, openT = w('scroll1', 3);
      ground(g);
      S.sofa(g, T);
      // the phone light on the face
      const px = 860, py = 560;
      const grd = g.createRadialGradient(px, py, 20, px, py, 620);
      grd.addColorStop(0, 'rgba(155,241,255,.20)'); grd.addColorStop(1, 'rgba(155,241,255,0)');
      g.fillStyle = grd; g.fillRect(0, 0, W, H);
      kng(g, 720, 460, { s: .85, E: ek(T, [[0, 'flat'], [openT, 'flat']]), talk: talkAt(T), headYaw: .12, headPitch: .18,
        armR: { at: [165, 60], gest: 'hold', rot: .5, prop: gg => phone(gg, 1) },
        armL: { at: [-150, 250] }, legs: { mode: 'sit' } }, T);
      text(g, '21:40', 60, 120, { font: font(900, 72), fill: PAL.muted });
      text(g, 'ngày thứ ba, không có việc gì', 60, 176, { font: font(400, 38, 'Patrick Hand'), fill: PAL.muted });
    }, ev() { return [[this.t, 'amb', { kind: 'night', t1: at('scroll2', .2) }], [this.t + .05, 'whoosh']]; } },

    // 9 — the feed fills the head
    { n: 'scroll2', t: at('scroll2', .2), f(g, lt, T) {
      const t0 = L('scroll2').t0;
      ground(g);
      S.feedColumn(g, 470, 520, 520, 840, T * 300);
      // the thoughts stacking up on the right
      for (let i = 0; i < 4; i++) {
        const p = seg(T, t0 + i * .35, t0 + i * .35 + .5);
        S.thought(g, 1400, 250 + i * 158, 92 - i * 9, p);
        if (p > .5) {
          const y = 250 + i * 158;
          line(g, [[1360, y - 12], [1440, y - 12]], rgba('#4A5578', p * .8), 8);
          line(g, [[1360, y + 12], [1420, y + 12]], rgba('#3A4260', p * .8), 8);
        }
      }
      text(g, 'đầu lại đông', 1400, 140, { font: font(900, 64), align: 'center', fill: CREAM });
      text(g, 'càng lướt, càng đầy', 1400, 856, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { const r = [[this.t, 'amb', { kind: 'scroll', t1: at('myth', .3) }]]; for (let i = 0; i < 6; i++) r.push([this.t + i * .3, 'pop']); return r; } },

    // 10 — the familiar answer: a drained battery
    { n: 'myth', t: at('myth', .3), tr: 'whip', f(g, lt, T) {
      const t0 = L('myth').t0, mv = w('myth', 9);
      ground(g);
      g.save(); camera(g, 1.02, 900, 500);
      panel(g, { x: 1180, y: 430, w: 840, h: 400, rot: .02, tape: true }, (gg, cw, ch) => {
        const x0 = -cw / 2 + 60, y0 = -ch / 2;
        text(gg, 'HẾT PIN Ý CHÍ', x0, y0 + 140, { font: font(900, 78), fill: CREAM });
        text(gg, 'câu trả lời quen thuộc nhất', x0, y0 + 220, { font: font(400, 40, 'Patrick Hand'), fill: PAL.muted });
      });
      g.restore();
      // the battery is already empty: the caption "hết pin" names the state that is on screen
      batteryBig(g, 170, 350, 540, .04, T);
      text(g, 'hết pin', 440, 760, { font: font(900, 58), align: 'center', fill: PAL.red.f });
      pip(g, 1640, 700, 165, popP(lt, .9, dur('myth') + .3), pipHost({ E: ek(T, [[0, 'talk'], [mv, 'skeptical']]), headYaw: -.2, headRoll: .06 }, T));
    }, ev() { const mv = w('myth', 9); return [[this.t - .12, 'whoosh'], [this.t, 'amb', { kind: 'low', t1: at('truth', .3) }], [this.t, 'music', { cue: 'E' }], [mv, 'drain']]; } },

    // 11 — what the replication found
    { n: 'truth', t: at('truth', .3), f(g, lt, T) {
      const t0 = L('truth').t0, barT = w('truth', 11);
      ground(g);
      // 23 labs, one by one
      for (let i = 0; i < 23; i++) {
        const p = seg(T, t0 + i * .09, t0 + i * .09 + .4);
        const x = 190 + (i % 12) * 132, y = 300 + Math.floor(i / 12) * 150;
        g.save(); g.translate(x, y); g.scale(ease.back(p), ease.back(p));
        cel(g, ellP(0, 0, 44, 44), { f: p > .5 ? PAL.panel2 : PAL.panel, s: '#12131A', so: [-6, -5], l: '#3A4260', lw: 2.6 });
        cel(g, poly([[-14, 10], [14, 10], [18, -14], [-18, -14]]), { f: p > .5 ? ACCENT.s : '#2A3145', l: '#12131A', lw: 2 });
        g.restore();
      }
      text(g, '23 phòng thí nghiệm', 860, 160, { font: font(900, 46), align: 'center', fill: CREAM });
      // the effect-size chart: the bars stay at zero
      const cx = 860, cy = 660, bw = 110, p = ease.out(seg(T, barT, barT + 1.4));
      g.strokeStyle = '#3A4260'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(cx - 420, cy); g.lineTo(cx + 460, cy); g.stroke();
      for (let i = 0; i < 6; i++) {
        const h = (i === 5 ? 12 : 26 + (i % 3) * 16) * p;
        cel(g, rect(cx - 380 + i * bw, cy, cx - 380 + i * bw + 62, cy - h),
          { f: i === 5 ? PAL.red.f : '#3A4260', s: i === 5 ? PAL.red.s : '#2A3145', so: [0, 5], l: '#12131A', lw: 2 });
      }
      text(g, 'hiệu ứng gần như bằng 0', cx, 770, { font: font(900, 52), align: 'center', fill: CREAM });
      text(g, 'không tìm thấy hiệu ứng nào đáng kể', cx, 822, { font: font(400, 36, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { const t0 = L('truth').t0, barT = w('truth', 11); const r = [[this.t, 'amb', { kind: 'low', t1: at('rest', .2) }]]; for (let i = 0; i < 23; i++) r.push([t0 + i * .09, 'pop']); r.push([barT, 'marker']); return r; } },

    // 12 — so the head never rests
    { n: 'rest', t: at('rest', .2), f(g, lt, T) {
      const t0 = L('rest').t0;
      const Ex = ek(T, [[0, 'talk'], [t0 + 2.4, 'tired']]);
      desk(g, T, { E: Ex, headPitch: nk(T, [[0, 0], [t0 + 2.6, .5]]), headRoll: nk(T, [[0, 0], [t0 + 2.6, .1]]),
        headYaw: sway(T) * .4 }, 1 + ease.inOut(seg(lt, 0, 5)) * .06, [1320, 340]);
    }, ev() { return [[this.t, 'amb', { kind: 'room', t1: at('nature', .4) }]]; } },

    // 13 — the dawn walk
    { n: 'nature', t: at('nature', .4), tr: 'whip', f(g, lt, T) {
      const camx = lt * 170;
      S.street(g, T, camx);
      const walkX = 900 - (camx * .7) % 700;
      kng(g, walkX, feet(FULL), { s: FULL, E: expr('smile', { ms: .3 }), talk: talkAt(T), headYaw: .12,
        armL: { at: [-150, 250], gest: 'relaxed' }, armR: { at: [150, 250], gest: 'relaxed' },
        legs: { mode: 'walk', ph: lt * 1.15 } }, T);
      text(g, 'chỉ cần một chỗ nhẹ nhàng', 300, 200, { font: font(400, 40, 'Patrick Hand'), fill: '#C9C2E8' });
    }, ev() { return [[this.t - .12, 'whoosh'], [this.t, 'amb', { kind: 'dawn', t1: at('screen', .2) }], [this.t, 'music', { cue: 'F' }], [this.t + .4, 'step'], [this.t + 1.0, 'step'], [this.t + 1.6, 'step']]; } },

    // 14 — screen against the street
    { n: 'screen', t: at('screen', .2), f(g, lt, T) {
      ground(g);
      // left: the screen
      panel(g, { x: 500, y: 540, w: 780, h: 800, rot: 0 }, gg => {
        S.feedColumn(gg, 0, 0, 600, 660, T * 900);
        gg.fillStyle = rgba('#12131A', .82); gg.fillRect(-300, -320, 600, 120);
        text(gg, 'MÀN HÌNH', 0, -240, { font: font(900, 46), align: 'center', fill: PAL.cyan.h });
      });
      // right: outside
      panel(g, { x: 1420, y: 540, w: 780, h: 800, rot: 0 }, gg => {
        gg.fillStyle = '#2B3358'; gg.fillRect(-300, -300, 600, 380);
        gg.fillStyle = '#4A4372'; gg.fillRect(-300, 40, 600, 60);
        gg.fillStyle = PAL.hoodie.f; gg.fillRect(-300, 100, 600, 30);
        cel(gg, ellP(140, 120, 42, 42), { f: '#FFE9A6', l: PAL.hoodie.s, lw: 2.4 });
        gg.fillStyle = '#1E2130'; gg.fillRect(-300, 130, 600, 170);
        line(gg, [[-140, 130], [-140, 40]], '#232838', 10);
        cel(gg, ellP(-140, 10, 84, 68), { f: '#233A32', s: '#18271F', l: '#0E1A14', lw: 2.6 });
        text(gg, 'ĐI DẠO', 0, -240, { font: font(900, 46), align: 'center', fill: PAL.cream });
      });
    }, ev() { return [[this.t, 'amb', { kind: 'dawn', t1: at('feedwork', .2) }]]; } },

    // 15 — scrolling is a job
    { n: 'feedwork', t: at('feedwork', .2), f(g, lt, T) {
      const t0 = L('feedwork').t0, st = w('feedwork', 7);
      ground(g);
      panel(g, { x: 960, y: 520, w: 1180, h: 620, rot: -.02, tape: true }, (gg, cw, ch) => {
        const x0 = -cw / 2 + 60, y0 = -ch / 2;
        text(gg, 'MỘT CÔNG VIỆC KHÔNG LƯƠNG', x0, y0 + 130, { font: font(900, 64), fill: CREAM });
        for (let i = 0; i < 3; i++) {
          const yy = y0 + 230 + i * 110, w = (cw - 140) * (1 - i * .22);
          cel(gg, rect(x0, yy, x0 + w, yy + 54), { f: i === 0 ? ACCENT.s : '#2A3145', s: '#1E2333', so: [0, 6], l: '#12131A', lw: 2 });
        }
        text(gg, 'giờ của bạn, đi làm', x0, y0 + 520, { font: font(400, 40, 'Patrick Hand'), fill: PAL.muted });
      });
      stamp(g, 'CÔNG VIỆC', 700, 780, { rot: -.13, px: 66, p: seg(T, st - .05, st + .15) });
    }, ev() { const st = w('feedwork', 8); return [[this.t, 'amb', { kind: 'scroll', t1: at('roi', .9) }], [st - .05, 'stamp']]; } },

    // 16 — Rối speaks up
    { n: 'roi', t: at('roi', .9), f(g, lt, T) {
      const t0 = L('roi').t0;
      ground(g);
      roi(g, 620, 620, 3.1, { t: T, E: { mo: .5, lookX: .2 } });
      bubble(g, 1240, 420, 820, 300, (gg, w, h) => {
        // every string goes through text(): it registers the box, so the reading check can see it
        text(gg, 'Nghỉ mà không có kế hoạch,', 0, -34, { font: font(800, 46), align: 'center', base: 'middle', fill: INK });
        text(gg, 'cũng là một việc —', 0, 20, { font: font(800, 46), align: 'center', base: 'middle', fill: INK });
        text(gg, 'và nó tốn pin.', 0, 74, { font: font(800, 46), align: 'center', base: 'middle', fill: PAL.violet.f });
      });
      batteryBig(g, 1420, 640, 300, .06, T);
      text(g, '6%', 1570, 730, { font: font(900, 54), fill: PAL.red.f });
    }, ev() { const t0 = L('roi').t0; return [[this.t, 'pop'], [this.t + .3, 'boing'], [t0 + 1.2, 'ting']]; } },

    // 17 — the quiet close
    { n: 'close', t: at('close', .2), f(g, lt, T) {
      const t0 = L('close').t0;
      const Ex = ek(T, [[0, 'tired'], [t0 + 1.2, 'smile'], [t0 + 2.4, 'happy']]);
      desk(g, T, { E: Ex, headYaw: -.14 + sway(T), headPitch: nk(T, [[0, .3], [t0 + 1.4, 0]]),
        armR: ak(T, [[0, { at: [140, 250] }], [t0 + 1.6, { at: [190, 60], gest: 'open', rot: .2, flip: false }]]) },
        1 + ease.inOut(seg(lt, 0, 4.5)) * .04, [1320, 400]);
    }, ev() { return [[this.t, 'amb', { kind: 'room', t1: at('next', .4) }], [this.t, 'music', { cue: 'G' }]]; } },

    // 18 — the end card
    { n: 'next', t: at('next', .4), f(g, lt, T) {
      const t0 = L('next').t0, endT = L('next').t1 + .4;
      const Ex = ek(T, [[0, 'talk'], [t0 + 2, 'smile'], [endT + .4, 'happy']]);
      const wave = T > endT + .4, wv = Math.sin((T - endT) * 12) * .28;
      desk(g, T, { E: Ex, headYaw: -.1 + sway(T),
        armL: ak(T, [[0, { at: [-140, 250] }], [endT + .4, { at: [-180, -80], gest: 'open', rot: -.1 + (wave ? wv : 0), flip: true }]], .3),
        armR: ak(T, [[0, { at: [140, 250] }]]) }, 1, [1320, 420],
      g => {
        const p = ease.back(seg(T, endT - .1, endT + .35));
        if (p <= 0) return;
        panel(g, { x: 560 - (1 - p) * 900, y: 470, w: 760, h: 560, rot: -.03, tape: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 56, y0 = -ch / 2;
          text(gg, 'TRẠM', x0, y0 + 120, { font: font(900, 88), fill: PAL.hoodie.f });
          text(gg, 'NGHĨ NHIỀU', x0, y0 + 220, { font: font(900, 88), fill: PAL.hoodie.f });
          text(gg, 'TẬP SAU', x0, y0 + 310, { font: font(400, 42, 'Patrick Hand'), fill: PAL.muted });
          hilite(gg, x0 - 10, y0 + 348, 520, 58, seg(T, endT + .4, endT + .8), PAL.hoodie.f, 5);
          text(gg, 'Tại sao bạn không bao giờ đủ ngủ?', x0, y0 + 390, { font: font(800, 40), fill: CREAM });
          text(gg, 'theo dõi kênh để xem tiếp', x0, y0 + 490, { font: font(400, 36, 'Patrick Hand'), fill: PAL.muted });
        });
      });
    }, ev() { return [[L('next').t1 + .3, 'paper'], [L('next').t1 + .3, 'music', { cue: 'end' }]]; } },
  ];
}

// ——— transitions ———
function drawShot(g, i, T) { const sh = SHOTS[i]; REG.id = sh.n; g.save(); sh.f(g, T - sh.t, T); g.restore(); }
// the words of a smeared frame are drawn sharp again on top: a blurred picture is a look, blurred letters are a mess
function drawSharp(g, texts, dx) {
  for (const t of texts) sharpText(g, t, dx);
}
function smear(g, i, T, dx) {   // whip pan: the frame drawn several times along x (a directional blur)
  const list = REG.list; REG.list = [];
  B.setTransform(1, 0, 0, 1, 0, 0); B.clearRect(0, 0, W, H);
  REG.skip = true; drawShot(B, i, T); REG.skip = false;   // the picture only: the words are painted sharp on top
  const texts = REG.list; REG.list = list;
  const n = 7, step = dx > 0 ? 70 : -70;
  for (let k = 0; k < n; k++) { g.globalAlpha = 1 / (k + 1); g.drawImage(buf, dx - step * k, 0); }
  g.globalAlpha = 1; REG.list = list;
  drawSharp(g, texts, dx);
}

window.render = T => {
  const g = G; g.setTransform(1, 0, 0, 1, 0, 0);
  let i = SHOTS.length - 1; while (i > 0 && T < SHOTS[i].t) i--;
  const sh = SHOTS[i], nx = SHOTS[i + 1], WH = .16;
  if (sh.tr === 'whip' && T - sh.t < WH) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); smear(g, i, T, (1 - ease.out((T - sh.t) / WH)) * W * .5); }
  else if (nx && nx.tr === 'whip' && nx.t - T < WH) { g.fillStyle = '#000'; g.fillRect(0, 0, W, H); smear(g, i, T, -ease.inOut(1 - (nx.t - T) / WH) * W * .5); }
  else if (sh.tr === 'iris' && T - sh.t < .55) {
    const list = REG.list; REG.list = null; drawShot(g, i - 1, T); REG.list = list;
    const r = ease.inOut((T - sh.t) / .55) * 1250;
    g.save(); g.beginPath(); g.arc(1000, 560, r, 0, TAU); g.clip(); drawShot(g, i, T); g.restore();
    g.lineWidth = 22; g.strokeStyle = PAL.hoodie.f; g.beginPath(); g.arc(1000, 560, r, 0, TAU); g.stroke();
  } else drawShot(g, i, T);
  // fade in from black at the very start, out at the very end
  const fo = Math.max(1 - T / .25, seg(T, TL.end - .6, TL.end));
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
