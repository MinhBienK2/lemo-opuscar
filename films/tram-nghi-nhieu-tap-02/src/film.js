// "Tại sao ta hay trì hoãn?" — Tập 02 của kênh Trạm Nghĩ Nhiều.
// Shots are functions of local time; every time comes from timeline.js (the real voice).
// Page contract: window.render(t), DUR, READY, EV (sound events), TEXTS(t) (on-screen text for the reading check), CUES (subtitles).
import { figure, expr, blendE, PAL, roi } from './character.js';
import { cel, path, poly, ellP, line, mix, rgba, canvas, W, H, TAU, rect } from './cel.js';
import { ground, panel, hilite, stamp, pip, bubble, subtitle, tag, text, font, ease, seg, clamp01, INK, CREAM, ACCENT, STORY, REG } from './broll.js';
import * as S from './sets.js';
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

// ——— the props of this episode ———
// a clock face: the hour hand and the minute hand are drawn from the time
function clockFace(g, x, y, r, hh, mm, o = {}) {
  const { face = '#1A1E2C', tick = '#3A4260', hcol = PAL.cream, mcol = PAL.hoodie.f } = o;
  cel(g, ellP(x, y, r, r), { f: face, s: '#12141F', so: [-10, -8], l: '#2A3145', lw: 3 });
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(g, [[x + Math.cos(a) * r * .84, y + Math.sin(a) * r * .84], [x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72]], tick, 3); }
  const ha = -Math.PI / 2 + ((hh % 12) + mm / 60) / 12 * TAU, ma = -Math.PI / 2 + mm / 60 * TAU;
  line(g, [[x, y], [x + Math.cos(ha) * r * .44, y + Math.sin(ha) * r * .44]], hcol, r * .045);
  line(g, [[x, y], [x + Math.cos(ma) * r * .66, y + Math.sin(ma) * r * .66]], mcol, r * .03);
  cel(g, ellP(x, y, r * .055, r * .055), { f: mcol, l: PAL.ink, lw: 2 });
}
// a note card: a sheet of paper with a tape
function note(g, x, y, w, h, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = rgba('#000000', .35); g.fillRect(-w / 2 + 10, -h / 2 + 12, w, h);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: '#F3EFE6', s: '#D8D2C4', so: [0, 10], l: '#B9B2A2', lw: 2.4 });
  g.save(); g.translate(0, -h / 2); g.rotate(-.04); g.fillStyle = 'rgba(255,203,7,.3)'; g.fillRect(-46, -16, 92, 32); g.restore();
  g.restore();
}
// a bar of a chart: the fill grows from the bottom
function bar(g, x, y, w, h, p, col) {
  cel(g, rect(x, y - h, x + w, y), { f: '#1E2333', s: '#171B28', so: [0, 8], l: '#12131A', lw: 2.4 });
  const hh = h * p;
  if (hh > 2) cel(g, rect(x + 6, y - hh + 6, x + w - 6, y - 6), { f: col, s: mix(col, '#000000', .35), so: [0, 5], l: '#12131A', lw: 2 });
}

// ——— the shots ———
// each: { n, t (start), f(g, lt, T), ev: () => [[t, type, extra]] }
function shots() {
  const at = (id, d) => L(id).t0 - d;
  const dur = id => L(id).t1 - L(id).t0;
  return [
    // 1 — the cold open: 23:45, and a report due at 23:59
    { n: 'cold', t: 0, f(g, lt, T) {
      // the moment he says "I will do it": from here the clock runs down to the five minutes he promises.
      // Two fixed labels, never one per second: a label that changes every second is a new text piece every second.
      const sw = w('hook', 12), drain = seg(T, sw, sw + 1.6);
      const mins = 15 - 10 * drain;
      g.save(); camera(g, 1 + lt * .01, 960, 540);
      ground(g);
      clockFace(g, 620, 470, 235, 23, 45 + lt * .35);
      text(g, '23:45', 620, 810, { font: font(900, 92), align: 'center', fill: CREAM });
      // the task, and the time left on it
      note(g, 1300, 430, 720, 480, .02);
      text(g, 'BÁO CÁO', 990, 290, { font: font(900, 72), fill: PAL.ink });
      text(g, 'hạn 23:59', 990, 350, { font: font(400, 40, 'Patrick Hand'), fill: '#5A5348' });
      const bx = 990, by = 420, bw = 560;
      cel(g, rect(bx, by, bx + bw, by + 44), { f: '#E4DFD2', l: '#C9C2B2', lw: 2 });
      const lw2 = bw * mins / 15;
      if (lw2 > 4) cel(g, rect(bx + 2, by + 2, bx + 2 + lw2 - 4, by + 42), { f: mins <= 8 ? PAL.red.f : PAL.hoodie.f, l: PAL.ink, lw: 2 });
      // the label names the promise the voice makes, and the bar runs down to it
      if (T < sw) text(g, 'còn 15 phút', bx, by + 120, { font: font(900, 46), fill: PAL.ink });
      else text(g, 'còn 5 phút', bx, by + 120, { font: font(900, 46), fill: PAL.red.f });
      text(g, '“còn năm phút nữa”', bx, by + 190, { font: font(400, 40, 'Patrick Hand'), fill: '#5A5348' });
      g.restore();
    }, ev: () => [[0, 'music', { cue: 'A' }], [0, 'amb', { kind: 'room', t1: at('hook2', .3) }], [0.5, 'tick'], [1.5, 'tick'], [2.5, 'tick'], [3.5, 'tick']] },

    // 2 — the thesis, said at once
    { n: 'hook2', t: at('hook2', .35), tr: 'whip', f(g, lt, T) {
      const t0 = L('hook2').t0;
      const Ex = ek(T, [[0, 'thinking'], [t0 + 2.2, 'talk'], [t0 + 4.2, 'determined']]);
      desk(g, T, { E: Ex, headYaw: -.12 + sway(T), bodyYaw: -.05,
        armR: ak(T, [[0, { at: [140, 250] }], [t0 + .4, { at: [-190, 90], gest: 'point', rot: -.15, flip: false }]]) },
        1 + seg(lt, 0, 4.6) * .035, [1120, 440]);
      roi(g, 380, 720, 1.25, { t: T, E: { mo: .2, lookX: .4 } });
    }, ev() { return [[this.t - .12, 'whoosh'], [this.t + .1, 'pop'], [L('hook2').t0 + 2.2, 'boing']]; } },

    // 3 — the title card
    { n: 'title', t: at('intro', .35), f(g, lt, T) {
      const t0 = L('intro').t0, nameT = w('intro', 2), hiT = w('intro', 5);
      const Ex = ek(T, [[0, 'happy'], [t0 + 1.2, 'talk'], [w('intro', 5), 'smile']]);
      const wave = T > t0 - .3 && T < t0 + 1.5, wv = Math.sin((T - t0) * 13) * .28;
      desk(g, T, { E: Ex, headYaw: -.1 + sway(T), headRoll: .04,
        armL: ak(T, [[0, { at: [-140, 250] }], [t0 - .2, { at: [-180, -80], gest: 'open', rot: -.1 + (wave ? wv : 0), flip: true }], [t0 + 1.5, { at: [-140, 250] }]], .3),
        armR: ak(T, [[0, { at: [140, 250] }]]) }, 1, [1320, 420],
      g => {
        const p = ease.back(seg(lt, .05, .5));
        panel(g, { x: 560 - (1 - p) * 900, y: 470, w: 720, h: 560, rot: -.03, tape: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 56, y0 = -ch / 2;
          text(gg, 'TRẠM', x0, y0 + 130, { font: font(900, 96), fill: PAL.hoodie.f });
          text(gg, 'NGHĨ NHIỀU', x0, y0 + 240, { font: font(900, 96), fill: PAL.hoodie.f });
          text(gg, 'Tại sao ta hay trì hoãn?', x0, y0 + 330, { font: font(400, 42, 'Patrick Hand'), fill: PAL.muted });
          hilite(gg, x0 - 10, y0 + 356, 470, 58, seg(T, hiT - .1, hiT + .35), PAL.hoodie.f, 4);
          text(gg, 'TẬP 02', x0, y0 + 480, { font: font(800, 46), fill: CREAM });
        });
      }, g => {
        tag(g, 'KẺ NGHĨ NHIỀU', 1320, 830, seg(T, nameT - .1, nameT + .25), { col: PAL.hoodie, px: 34 });
      });
    }, ev() { return [[this.t + .05, 'paper'], [w('intro', 2) - .1, 'pop'], [w('intro', 5), 'marker'], [this.t, 'music', { cue: 'B' }]]; } },

    // 4 — what actually predicts procrastination (the 691 correlations)
    { n: 'chart', t: at('f1', .3), f(g, lt, T) {
      const t0 = L('f1').t0, t2 = L('f2').t0;
      const p1 = ease.out(seg(T, t0 + .4, t0 + 1.6)), p2 = ease.out(seg(T, t2 + .3, t2 + 1.4)), p3 = ease.out(seg(T, t2 + 1.9, t2 + 2.8));
      ground(g);
      g.save(); camera(g, 1.02, 780, 540);
      text(g, '691 mối tương quan', 250, 190, { font: font(800, 44), fill: PAL.muted });
      line(g, [[250, 830], [1420, 830]], '#3A4260', 4);
      bar(g, 330, 830, 250, 400, p1, PAL.red.f);
      bar(g, 760, 830, 250, 320, p2, PAL.hoodie.f);
      bar(g, 1190, 830, 250, 120, p3, '#5A6488');
      text(g, 'độ khó chịu', 455, 890, { font: font(800, 40), align: 'center', fill: CREAM });
      text(g, 'của việc', 455, 934, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      text(g, 'hạn càng xa', 885, 890, { font: font(800, 40), align: 'center', fill: CREAM });
      text(g, 'càng trì hoãn', 885, 934, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      text(g, 'tính cách', 1315, 890, { font: font(800, 40), align: 'center', fill: CREAM });
      text(g, 'chỉ liên quan yếu', 1315, 934, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      g.restore();
      pip(g, 1650, 740, 175, popP(lt, 1.0, dur('f1') + .3), pipHost({ E: ek(T, [[0, 'talk'], [w('f1', 12), 'excited']]), headYaw: -.25 }, T));
    }, ev() { const t0 = L('f1').t0, t2 = L('f2').t0; return [[this.t + .1, 'pop'], [t0 + .4, 'rise'], [t2 + .3, 'rise'], [t2 + 1.9, 'ting'], [this.t, 'music', { cue: 'C' }]]; } },

    // 5 — the third predictor: believing you can do it
    { n: 'self', t: at('self', .3), f(g, lt, T) {
      const t0 = L('self').t0, p = ease.out(seg(T, t0 + .3, t0 + 1.4));
      ground(g);
      g.save(); camera(g, 1.05, 900, 520);
      note(g, 900, 520, 900, 620, -.015);
      text(g, 'TIN VÀO KHẢ NĂNG', 520, 320, { font: font(900, 62), fill: PAL.ink });
      text(g, 'của chính mình', 520, 390, { font: font(400, 40, 'Patrick Hand'), fill: '#5A5348' });
      const bx = 520, by = 560, bw = 660;
      cel(g, rect(bx, by, bx + bw, by + 60), { f: '#E4DFD2', l: '#C9C2B2', lw: 2 });
      const lv = .12 * p;
      if (lv > .01) cel(g, rect(bx + 4, by + 4, bx + 4 + (bw - 8) * lv, by + 56), { f: PAL.red.f, l: PAL.ink, lw: 2 });
      // the label names the state it sits next to: 12 % and "12 %" always agree
      text(g, '12%', bx + bw + 30, by + 48, { font: font(900, 56), fill: PAL.red.f });
      text(g, 'không tin, không dám bắt đầu', 520, 700, { font: font(400, 40, 'Patrick Hand'), fill: '#5A5348' });
      g.restore();
      pip(g, 1640, 760, 175, popP(lt, 1.0, dur('self') + .3), pipHost({ E: ek(T, [[0, 'worried'], [w('self', 8), 'flat']]), headYaw: -.2 }, T));
    }, ev() { const t0 = L('self').t0; return [[this.t + .1, 'pop'], [t0 + .3, 'rise'], [this.t, 'music', { cue: 'D' }]]; } },

    // 6 — the brain's own reason: now beats later
    { n: 'emo', t: at('emo', .3), f(g, lt, T) {
      const t0 = L('emo').t0, tilt = nk(T, [[t0 + .2, 0], [t0 + 1.6, -.14]]);
      ground(g);
      const cx = 960, cy = 470;
      cel(g, poly([[cx - 90, cy + 250], [cx + 90, cy + 250], [cx, cy]]), { f: '#2A3044', s: '#1A1E2C', so: [0, 8], l: PAL.ink, lw: 2.6 });
      g.save(); g.translate(cx, cy); g.rotate(tilt);
      line(g, [[-460, 0], [460, 0]], '#4A5270', 14);
      // the near reward: heavy and red; the later one: small and pale
      line(g, [[-460, 0], [-460, 104]], '#4A5270', 6);
      line(g, [[460, 0], [460, -104]], '#4A5270', 6);
      cel(g, ellP(-460, 156, 104, 104), { f: PAL.red.f, s: PAL.red.s, so: [-10, -8], l: PAL.ink, lw: 3 });
      cel(g, ellP(460, -156, 44, 44), { f: '#8A90A6', s: '#5A6488', so: [-6, -6], l: PAL.ink, lw: 2.6 });
      g.restore();
      text(g, 'BÂY GIỜ', 500, 880, { font: font(900, 54), align: 'center', fill: PAL.red.f });
      text(g, 'hết khó chịu', 500, 934, { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      text(g, 'MỘT GIỜ NỮA', 1420, 700, { font: font(900, 54), align: 'center', fill: '#8A90A6' });
      text(g, 'xong việc, nhận thưởng', 1420, 754, { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      text(g, 'tương lai xa luôn bị chiết khấu', 960, 1010, { font: font(400, 42, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { const t0 = L('emo').t0; return [[this.t + .1, 'pop'], [t0 + .2, 'swish'], [t0 + 1.6, 'thump'], [this.t, 'amb', { kind: 'low', t1: at('myth', .3) }], [this.t, 'music', { cue: 'E' }]]; } },

    // 7 — the myth, stamped out
    { n: 'myth', t: at('myth', .3), f(g, lt, T) {
      const t0 = L('myth').t0, st = w('myth', 6);
      ground(g);
      panel(g, { x: 960, y: 470, w: 1100, h: 380, rot: -.02, tape: true }, (gg, cw, ch) => {
        const x0 = -cw / 2 + 70, y0 = -ch / 2;
        hilite(gg, x0 + 595, y0 + 112, 250, 110, seg(T, t0 + .4, t0 + 1.0), PAL.red.f, 6);
        text(gg, 'TRÌ HOÃN = LƯỜI', x0, y0 + 190, { font: font(900, 96), fill: CREAM });
      });
      stamp(g, 'SAI', 1420, 700, { rot: -.16, px: 92, p: seg(T, st - .05, st + .15) });
      pip(g, 330, 720, 165, popP(lt, .9, dur('myth') + .3), pipHost({ E: ek(T, [[0, 'skeptical'], [st, 'determined']]), headYaw: -.18 }, T));
    }, ev() { const st = w('myth', 6); return [[this.t + .05, 'paper'], [st - .05, 'stamp'], [this.t, 'amb', { kind: 'room', t1: at('method', .3) }], [this.t, 'music', { cue: 'F' }]]; } },

    // 8 — the method, with its numbers
    { n: 'method', t: at('method', .3), f(g, lt, T) {
      const t0 = L('method').t0, nw = w('method', 8);
      ground(g);
      g.save(); camera(g, 1.03, 860, 520);
      note(g, 860, 520, 1240, 560, .012);
      // the marker strokes go behind the words, so the words stay readable
      hilite(g, 316, 344, 165, 78, seg(T, t0 + .5, t0 + 1.1), PAL.hoodie.f, 2);
      hilite(g, 596, 344, 160, 78, seg(T, t0 + 1.6, t0 + 2.2), PAL.cyan.f, 5);
      text(g, 'NẾU', 330, 400, { font: font(900, 84), fill: PAL.ink });
      text(g, '…', 480, 400, { font: font(900, 84), fill: '#8A8478' });
      text(g, 'THÌ', 600, 400, { font: font(900, 84), fill: PAL.ink });
      text(g, '…', 760, 400, { font: font(900, 84), fill: '#8A8478' });
      text(g, 'một tình huống cụ thể', 330, 560, { font: font(400, 38, 'Patrick Hand'), fill: '#5A5348' });
      text(g, 'một hành động cụ thể', 760, 560, { font: font(400, 38, 'Patrick Hand'), fill: '#5A5348' });
      // the numbers, once the line reaches them — inside the card, where nothing covers them
      const pnum = seg(T, nw - .2, nw + .5);
      if (pnum > 0) {
        g.globalAlpha = pnum;
        text(g, '94 nghiên cứu', 1040, 390, { font: font(900, 48), fill: PAL.ink });
        text(g, 'd = 0,65', 1040, 470, { font: font(900, 46), fill: '#2A6E7A' });
        g.globalAlpha = 1;
      }
      g.restore();
      pip(g, 330, 760, 165, popP(lt, 1.0, dur('method') + .3), pipHost({ E: ek(T, [[0, 'talk'], [nw, 'excited']]), headYaw: -.22 }, T));
    }, ev() { const t0 = L('method').t0, nw = w('method', 8); return [[this.t + .05, 'paper'], [t0 + .5, 'marker'], [t0 + 1.6, 'marker'], [nw - .1, 'ting'], [this.t, 'music', { cue: 'G' }]]; } },

    // 9 — the plan for this film, written out
    { n: 'plan', t: at('plan', .3), f(g, lt, T) {
      const t0 = L('plan').t0, hi = w('plan', 3);
      ground(g);
      g.save(); camera(g, 1.02, 900, 520);
      note(g, 900, 500, 1300, 620, -.01);
      // the marker strokes go behind the words
      hilite(g, 320, 286, 250, 62, seg(T, t0 + .3, t0 + .8), PAL.hoodie.f, 2);
      hilite(g, 320, 516, 250, 62, seg(T, hi, hi + .5), PAL.cyan.f, 5);
      text(g, 'NẾU 21:30 mình ngồi xuống bàn,', 340, 330, { font: font(800, 52), fill: PAL.ink });
      text(g, 'THÌ mình viết 3 dòng tiêu đề', 340, 560, { font: font(800, 52), fill: PAL.ink });
      text(g, 'trong 5 phút, không mở mạng.', 340, 620, { font: font(800, 52), fill: PAL.ink });
      g.restore();
      clockFace(g, 1560, 300, 120, 21, 30, { tick: '#3A4260' });
      pip(g, 330, 780, 160, popP(lt, 1.0, dur('plan') + .3), pipHost({ E: ek(T, [[0, 'determined'], [hi, 'smile']]), headYaw: -.18 }, T));
    }, ev() { const t0 = L('plan').t0, hi = w('plan', 3); return [[this.t + .05, 'paper'], [t0 + .3, 'marker'], [hi, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('counter', .3) }]]; } },

    // 10 — the counter-case: sometimes the delay is the work
    { n: 'counter', t: at('counter', .35), tr: 'iris', f(g, lt, T) {
      const t0 = L('counter').t0;
      // the set first, then him on the seat: the sofa is behind him, the head above the back
      S.sofa(g, T);
      kng(g, 900, 530, { s: 1.0, legs: { mode: 'sit' }, talk: talkAt(T), E: ek(T, [[0, 'thinking'], [t0 + 2.4, 'smile']]), headYaw: -.1 + sway(T) * .5 }, T);
      // the ideas, drifting up: light bubbles, the warm note of this shot
      for (let i = 0; i < 3; i++) {
        const u = seg(T, t0 + .6 + i * .9, t0 + 3.4 + i * .9);
        if (u <= 0) continue;
        const y = 520 - u * 280, x = 1100 + i * 165 + Math.sin(u * 6 + i) * 22, r = 62 - i * 10;
        g.globalAlpha = (1 - u) * .95;
        cel(g, ellP(x, y, r, r * .8), { f: '#F3EFE6', s: '#D8D2C4', so: [-7, -6], l: PAL.violet.l, lw: 2.6 });
        cel(g, ellP(x - 18, y + r * .92, r * .16, r * .13), { f: '#F3EFE6', l: PAL.violet.l, lw: 2 });
        cel(g, ellP(x - 34, y + r * 1.28, r * .1, r * .08), { f: '#F3EFE6', l: PAL.violet.l, lw: 1.6 });
        g.globalAlpha = 1;
      }
      tag(g, 'ỦNG CẤ Ý TƯỞNG', 250, 200, seg(T, t0 + .4, t0 + .9), { col: PAL.hoodie, px: 40 });
      text(g, 'có lúc trì hoãn là công việc', 960, 200, { font: font(400, 46, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { const t0 = L('counter').t0; return [[this.t, 'amb', { kind: 'dawn', t1: at('punch', .3) }], [t0 + .6, 'pop'], [t0 + 1.5, 'pop'], [t0 + 2.4, 'pop'], [this.t, 'music', { cue: 'F' }]]; } },

    // 11 — the punch: it is a signal, not a fault
    { n: 'punch', t: at('punch', .3), f(g, lt, T) {
      const t0 = L('punch').t0, st = w('punch', 6);
      ground(g);
      panel(g, { x: 960, y: 460, w: 1220, h: 420, rot: -.015, tape: true }, (gg, cw, ch) => {
        const x0 = -cw / 2 + 70, y0 = -ch / 2;
        text(gg, 'TRÌ HOÃN KHÔNG PHẢI LỖI', x0, y0 + 170, { font: font(900, 60), fill: CREAM });
        text(gg, 'Nó là một dấu hiệu:', x0, y0 + 280, { font: font(400, 46, 'Patrick Hand'), fill: PAL.muted });
        hilite(gg, x0 + 560, y0 + 306, 300, 66, seg(T, st - .3, st + .3), PAL.hoodie.f, 7);
        text(gg, 'việc này đang làm mình khó chịu', x0, y0 + 360, { font: font(800, 52), fill: CREAM });
      });
      stamp(g, 'DẤU HIỆU', 1480, 760, { rot: -.13, px: 62, p: seg(T, st - .05, st + .2) });
      pip(g, 300, 740, 165, popP(lt, .9, dur('punch') + .3), pipHost({ E: ek(T, [[0, 'talk'], [st, 'determined']]), headYaw: -.2 }, T));
    }, ev() { const st = w('punch', 6); return [[this.t + .05, 'paper'], [st - .05, 'stamp'], [this.t - .02, 'silence', { t1: this.t + .9 }]]; } },

    // 12 — Rối asks the one question
    { n: 'roi', t: at('roi', .9), f(g, lt, T) {
      const t0 = L('roi').t0;
      ground(g);
      roi(g, 620, 620, 3.1, { t: T, E: { mo: .5, lookX: .2 } });
      bubble(g, 1240, 420, 860, 320, (gg, w2, h) => {
        gg.fillStyle = INK; gg.font = font(800, 50); gg.textAlign = 'center'; gg.textBaseline = 'middle';
        gg.fillText('Cái gì đang khó chịu?', 0, -44);
        gg.fillStyle = PAL.violet.f; gg.fillText('Rồi viết ba dòng.', 0, 34);
      });
    }, ev() { const t0 = L('roi').t0; return [[this.t, 'pop'], [this.t + .3, 'boing'], [t0 + 1.2, 'ting']]; } },

    // 13 — the close: the three lines are actually written
    { n: 'close', t: at('close', .3), f(g, lt, T) {
      const t0 = L('close').t0, wr = [w('close', 6), w('close', 9), w('close', 12)];
      const Ex = ek(T, [[0, 'determined'], [t0 + 2.6, 'smile']]);
      // the writing arm: it reaches the page and trembles a little while the lines appear
      const arm = ak(T, [[0, { at: [-140, 250] }], [t0 + .3, { at: [-152, 208] }]], .4);
      const armL = { ...arm, at: [arm.at[0] + Math.sin(T * 9) * 7, arm.at[1] + Math.cos(T * 11) * 4] };
      desk(g, T, { E: Ex, headYaw: -.06 + sway(T) * .5, headPitch: nk(T, [[t0, .18], [t0 + 2, .06]]), armL },
        1.05, [1180, 430],
      g => {
        // the page on the desk, and the three lines as they are written
        const x0 = 830, y0 = 890, w2 = 540, h2 = 360;
        g.save(); g.translate(x0, y0); g.rotate(-.02);
        g.fillStyle = rgba('#000000', .3); g.fillRect(-w2 / 2 + 8, -h2 / 2 + 10, w2, h2);
        cel(g, rect(-w2 / 2, -h2 / 2, w2 / 2, h2 / 2), { f: '#F3EFE6', s: '#D8D2C4', so: [0, 8], l: '#B9B2A2', lw: 2.2 });
        for (let i = 0; i < 3; i++) {
          const p = seg(T, wr[i] - .15, wr[i] + .55);
          if (p <= 0) continue;
          const y = -h2 / 2 + 110 + i * 86;
          cel(g, rect(-w2 / 2 + 40, y, -w2 / 2 + 40 + (w2 - 90) * p, y + 22), { f: '#5A5348', l: '#5A5348', lw: 1.6 });
          if (p > .6) cel(g, ellP(-w2 / 2 + 24, y + 10, 9, 9), { f: PAL.ink, l: PAL.ink, lw: 1 });
        }
        g.restore();
        // the phone, face down: the other choice, not taken
        cel(g, rect(1420, 866, 1500, 930), { f: '#0E1017', s: '#1B1F2C', so: [0, 5], l: '#12131A', lw: 2.4 });
      });
    }, ev() { const t0 = L('close').t0; return [[this.t, 'amb', { kind: 'room', t1: at('next', .4) }], [this.t + .4, 'marker'], [this.t + 1.5, 'marker'], [this.t + 2.6, 'marker'], [this.t, 'music', { cue: 'G' }]]; } },

    // 14 — the end card
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
        panel(g, { x: 560 - (1 - p) * 900, y: 470, w: 780, h: 560, rot: -.03, tape: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 56, y0 = -ch / 2;
          text(gg, 'TRẠM', x0, y0 + 120, { font: font(900, 88), fill: PAL.hoodie.f });
          text(gg, 'NGHĨ NHIỀU', x0, y0 + 220, { font: font(900, 88), fill: PAL.hoodie.f });
          text(gg, 'TẬP SAU', x0, y0 + 310, { font: font(400, 42, 'Patrick Hand'), fill: PAL.muted });
          hilite(gg, x0 - 10, y0 + 348, 560, 58, seg(T, endT + .4, endT + .8), PAL.hoodie.f, 5);
          text(gg, 'Tại sao ta sợ thất bại', x0, y0 + 396, { font: font(800, 36), fill: CREAM });
          text(gg, 'hơn cả thành công?', x0, y0 + 440, { font: font(800, 36), fill: CREAM });
          text(gg, 'theo dõi kênh để xem tiếp', x0, y0 + 505, { font: font(400, 36, 'Patrick Hand'), fill: PAL.muted });
        });
      });
    }, ev() { return [[L('next').t1 + .3, 'paper'], [L('next').t1 + .3, 'music', { cue: 'end' }]]; } },
  ];
}

// ——— transitions ———
function drawShot(g, i, T) { const sh = SHOTS[i]; REG.id = sh.n; g.save(); sh.f(g, T - sh.t, T); g.restore(); }
function smear(g, i, T, dx) {   // whip pan: the frame drawn several times along x (a directional blur)
  const list = REG.list; REG.list = null;
  B.setTransform(1, 0, 0, 1, 0, 0); B.clearRect(0, 0, W, H); drawShot(B, i, T);
  const n = 7, step = dx > 0 ? 70 : -70;
  for (let k = 0; k < n; k++) { g.globalAlpha = 1 / (k + 1); g.drawImage(buf, dx - step * k, 0); }
  g.globalAlpha = 1; REG.list = list;
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
