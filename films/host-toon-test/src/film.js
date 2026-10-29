// "Phi vụ triệu đô trong 2 phút": the film. Shots are functions of local time; all times come from timeline.js.
// Page contract: window.render(t), DUR, READY, EV (sound events), TEXTS(t) (on-screen text for the reading check), CUES (subtitles).
import { figure, expr, blendE, PAL } from './host.js';
import { blendGest, GEST } from './hands.js';
import { cel, poly, ellP, line, limb, mix, rgba, canvas, W, H, TAU } from './cel.js';
import { paper, studyBack, studyFront, card, hilite, stamp, text, font, subtitle, pip, focusLines, INK, STORY, ease, seg, clamp01, REG } from './broll.js';
import * as S from './sets.js';
import { crew, personIcon, professor } from './cast.js';
import { build } from './timeline.js';

const cv = document.getElementById('c'), G = cv.getContext('2d');
const [buf, B] = canvas(W, H);
let TL, SHOTS, EV = [];

// ——— small animation tools ———
const E = x => typeof x === 'string' ? expr(x) : expr(x[0], x[1]);
function ek(T, keys, bl = .14) {   // expression keys [[t, name | [name, over]]], blended over bl seconds
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const cur = E(keys[i][1]); if (i === 0) return cur;
  const u = seg(T, keys[i][0], keys[i][0] + bl); return u >= 1 ? cur : blendE(E(keys[i - 1][1]), cur, ease.inOut(u));
}
const lerp = (a, b, u) => a + (b - a) * u;
function ak(T, keys, d = .34) {   // arm keys [[t, {at, gest, rot, fore, upper, flip, prop, bend}]]: back-eased move, blended fingers
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const c = keys[i][1]; if (i === 0) return c;
  const p = keys[i - 1][1], u = ease.back(seg(T, keys[i][0], keys[i][0] + d)), v = ease.inOut(seg(T, keys[i][0], keys[i][0] + d * .7));
  return { ...(v < .5 ? p : c), at: [lerp(p.at[0], c.at[0], u), lerp(p.at[1], c.at[1], u)], rot: lerp(p.rot || 0, c.rot || 0, v),
    fore: lerp(p.fore ?? 1, c.fore ?? 1, v), upper: lerp(p.upper ?? 1, c.upper ?? 1, v), gest: blendGest(p.gest || 'relaxed', c.gest || 'relaxed', v) };
}
function nk(T, keys, d = .5) {   // numeric keys [[t, value]]: eased in-out
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  if (i === 0) return keys[0][1];
  return lerp(keys[i - 1][1], keys[i][1], ease.inOut(seg(T, keys[i][0], keys[i][0] + d)));
}
// blinks: every 2-5 s, sometimes double; deterministic
const BLINKS = []; { let s = 11, t = 1.2; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 200) { BLINKS.push(t); if (r() < .2) BLINKS.push(t + .28); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < .16) return Math.sin(d / .16 * Math.PI); } return 0; }
function camera(g, z, fx, fy, ox = 0, oy = 0) { g.translate(fx, fy); g.scale(z, z); g.translate(-fx - ox, -fy - oy); }
function nhi(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id], w = (id, k) => TL.w(id, k);
const talkAt = T => TL.talk(T);
const sway = T => Math.sin(T * .55) * .035;

// the host at her desk: x, y of the neck base on screen; o goes to figure()
function desk(g, T, o, z = 1, f = [1320, 420], card, over) {
  paper(g);
  g.save(); camera(g, z, f[0], f[1]);
  const cam = { x: 0, y: 0 };
  studyBack(g, T, cam);
  if (card) card(g);
  nhi(g, 1320, 560, { s: 1.55, talk: talkAt(T), headRoll: sway(T) * .6, ...o }, T);
  if (over) over(g);
  studyFront(g, T, cam);
  g.restore();
}
const pipHost = (o, T) => (gg, r) => { gg.fillStyle = '#e9dcc8'; gg.fillRect(-r, -r, 2 * r, 2 * r); gg.fillStyle = '#cfe6e4'; gg.fillRect(-r, -r, r * .9, r * 1.2); gg.save(); gg.translate(0, 78); figure(gg, { s: .92, crop: 'bust', t: T, blink: blink(T), talk: talkAt(T), linePx: 3, ...o }); gg.restore(); };
const popP = (lt, a, b) => lt < b ? seg(lt, a, a + .3) : 1 - seg(lt, b, b + .22);

// ——— the shots ———
// each: { n, t (start), f(g, lt, T), ev: () => [[t, type, extra]] }, set up in setup() once the timeline is known
function shots() {
  const at = (id, d) => L(id).t0 - d;
  return [
    { n: 'cold', t: 0, f(g, lt, T) {
      g.save(); camera(g, 1 + lt * .012, 1400, 520); S.printHall(g, T); S.flyingNotes(g, T); g.restore();
    }, ev: () => [[0, 'amb', { kind: 'press', t1: at('hook2', .3) }]] },

    { n: 'hook2', t: at('hook2', .3), tr: 'whip', f(g, lt, T) {
      const t0 = L('hook2').t0, glintT = w('hook2', 8), tuT = w('hook2', 7);
      const Ex = ek(T, [[0, 'talk'], [tuT - .1, ['smug', { glint: 0 }]], [glintT - .05, ['smug', { glint: 1 }]], [glintT + .5, ['smug', { glint: 0 }]]], .1);
      desk(g, T, { E: Ex, headYaw: -.22 + sway(T), bodyYaw: -.12,
        armR: ak(T, [[0, { at: [-110, 320] }], [t0 + .3, { at: [-250, 60], gest: 'point', rot: -.15, flip: false }]]) }, 1 + seg(lt, 0, 3.4) * .035, [1100, 440],
      g => {
        card(g, { x: 560, y: 470, w: 640, h: 540, rot: -.035, pin: true, tape: false, lift: 0 }, (gg, cw, ch) => {
          text(gg, 'TIỀN TỪ ĐÂU RA?', -cw / 2 + 50, -ch / 2 + 92, { font: font(900, 46), fill: STORY.f });
          for (let i = 0; i < 5; i++) S.note(gg, -60 + i * 40, 40 - i * 14, 260, -.25 + i * .1, i % 2 ? '#e8a25c' : '#d9b46a');
        });
        stamp(g, 'TỰ IN', 600, 600, { rot: -.14, px: 84, p: seg(T, tuT - .2, tuT) });
      });
    }, ev() { const tu = w('hook2', 7), gl = w('hook2', 8); return [[this.t - .12, 'whoosh'], [L('hook2').t0 + .3, 'paper'], [tu - .1, 'stamp'], [gl, 'ting']]; } },

    { n: 'title', t: at('intro', .3), f(g, lt, T) {
      const t0 = L('intro').t0, nameT = w('intro', 2), hiT = w('intro', 16);
      const Ex = ek(T, [[0, 'happy'], [t0 + 1.4, 'talk'], [w('intro', 5), 'smile'], [w('intro', 7), 'excited'], [w('intro', 11), 'talk']]);
      const wave = T > t0 - .2 && T < t0 + 1.5, wv = Math.sin((T - t0) * 14) * .25;
      desk(g, T, { E: Ex, headYaw: -.1 + sway(T), headRoll: .05,
        armL: ak(T, [[0, { at: [100, 320] }], [t0 - .2, { at: [180, -110], gest: 'open', rot: -.1 + wv * (wave ? 1 : 0), flip: true }], [t0 + 1.5, { at: [100, 320] }]], .3),
        armR: ak(T, [[0, { at: [-100, 320] }], [w('intro', 7), { at: [-250, 60], gest: 'open', rot: .3, flip: false }], [w('intro', 7) + 2.2, { at: [-100, 320] }]]) }, 1, [1320, 420],
      g => {
        const p = ease.back(seg(lt, .05, .5));
        card(g, { x: 560 - (1 - p) * 900, y: 470, w: 700, h: 560, rot: -.03, tape: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 56, y0 = -ch / 2;
          text(gg, 'PHI VỤ', x0, y0 + 130, { font: font(900, 96), fill: STORY.f });
          text(gg, 'TRIỆU ĐÔ', x0, y0 + 240, { font: font(900, 96), fill: STORY.f });
          text(gg, 'Phần 1 & 2', x0, y0 + 340, { font: font(800, 52) });
          hilite(gg, x0 - 10, y0 + 382, 330, 76, seg(T, hiT - .1, hiT + .35), PAL.accent.f, 4);
          text(gg, 'trong 2 phút', x0, y0 + 440, { font: font(400, 64, 'Patrick Hand') });
        });
      }, g => {
        S.tag(g, 'NHI · người dẫn chuyện', 1320, 800, seg(T, nameT - .1, nameT + .25), { col: { f: PAL.accent.f, s: PAL.accent.s, l: PAL.accent.l }, ink: INK, px: 34 });
      });
    }, ev() { return [[this.t + .05, 'paper'], [w('intro', 2) - .1, 'pop'], [w('intro', 16), 'marker'], [this.t, 'music', { cue: 'B' }]]; } },

    { n: 'prof', t: at('prof', .35), tr: 'whip', f(g, lt, T) {
      const gT = w('prof', 11), z = 1 + ease.inOut(seg(lt, 0, 3.6)) * .14;
      g.save(); camera(g, z, 1400, 380); S.hangar(g, T);
      g.save(); g.translate(1460, 560); g.scale(-1, 1); professor(g, 0, 0, 1.35, { glint: Math.max(0, 1 - Math.abs(T - gT - .1) / .3) }); g.restore();
      g.restore();
    }, ev() { return [[this.t - .12, 'whoosh'], [w('prof', 11) + .05, 'ting'], [this.t, 'amb', { kind: 'night', t1: at('train', .35) }]]; } },

    { n: 'map', t: at('train', .35), f(g, lt, T) {
      const t0 = L('train').t0, ox = ease.inOut(seg(lt, 2.2, 4.4)) * 120;
      paper(g, '#efe5d4');
      g.save(); camera(g, 1.0, 960, 540, ox, 0);
      card(g, { x: 540, y: 470, w: 760, h: 560, rot: -.03, pin: false, tape: true }, S.mapInner(seg(lt, .3, .8), seg(lt, .7, 1.0)));
      const fp = ease.back(seg(T, w('train', 13) - .2, w('train', 13) + .25));
      if (fp > 0) card(g, { x: 1440 + (1 - fp) * 700, y: 380, w: 600, h: 400, rot: .04, tape: true }, S.farmInner(T));
      for (let i = 0; i < 8; i++) { const p = seg(T, t0 + .1 + i * .1, t0 + .35 + i * .1); if (p > 0) personIcon(g, 1150 + i * 64, 840 - ease.back(p) * 20, .95, STORY.f); }
      const cp = seg(T, w('train', 9), w('train', 11) + .5);
      if (T > w('train', 9) - .3) { S.calendar(g, 1790, 700, cp); hilite(g, 1690, 852, 200, 56, seg(T, w('train', 11), w('train', 11) + .3), PAL.accent.f, 6); if (T > w('train', 11)) text(g, '5 tháng', 1790, 898, { font: font(400, 50, 'Patrick Hand'), align: 'center' }); }
      g.restore();
      S.chapter(g, 'KẾ HOẠCH', seg(lt, .15, .5));
    }, ev() { const r = [[this.t + .15, 'pop'], [this.t + .4, 'pin']]; for (let i = 0; i < 8; i++) r.push([L('train').t0 + .1 + i * .1, 'tick']); r.push([w('train', 9), 'paper'], [w('train', 10), 'paper'], [w('train', 11), 'marker'], [w('train', 13) - .2, 'paper']); return r; } },

    { n: 'lineup', t: at('names', .3), f(g, lt, T) {
      const ox = lerp(-70, 70, ease.inOut(seg(lt, 0, 9.4)));
      const NAMES = ['TOKYO', 'BERLIN', 'NAIROBI', 'RIO', 'DENVER', 'MOSCOW', 'HELSINKI', 'OSLO'], WI = [7, 8, 9, 10, 11, 12, 13, 14];
      g.save(); camera(g, 1, 960, 540, ox, 0); S.lineupWall(g);
      for (let i = 0; i < 8; i++) {
        const x = 200 + i * 220, ti = w('names', WI[i]) - .25, p = seg(T, ti, ti + .3);
        crew(g, x, 900, { i, s: .66 * (1 + ease.back(p) * .02), dir: 0 });
        S.tag(g, NAMES[i], x, 300 - (i % 2) * 40, p, { px: 34, rot: (i % 2 ? .04 : -.04) });
      }
      g.restore();
    }, ev() { const r = [[this.t, 'amb', { kind: 'room', t1: at('enter', .6) }]]; for (let i = 7; i <= 14; i++) r.push([w('names', i) - .25, 'pop']); return r; } },

    { n: 'rules', t: at('rules', .12), f(g, lt, T) {
      const K = [3, 6, 10, 14].map(k => w('rules', k)), n = K.filter(k => T >= k - .1).length, hiT = w('rules', 15);
      const Ex = ek(T, [[0, 'talk'], [K[3] - .1, 'determined']]);
      const G4 = ['four', 'one', 'two', 'three', 'four'][n];
      desk(g, T, { E: Ex, headYaw: -.2 + sway(T), bodyYaw: -.1,
        armL: ak(T, [[0, { at: [100, 320] }], [L('rules').t0, { at: [190, -100], gest: 'four', rot: -.1, flip: true }], ...K.map((k, i) => [k - .1, { at: [190 + (i % 2) * 10, -110 - i * 4], gest: ['one', 'two', 'three', 'four'][i], rot: -.1, flip: true }])], .25) }, 1 + seg(lt, 0, 8) * .04, [1100, 440],
      g => card(g, { x: 560, y: 480, w: 760, h: 560, rot: -.03, pin: true, tape: false }, S.rulesInner({ rows: K.map(k => seg(T, k - .3, k + .05)), hi: 3, hiP: seg(T, hiT - .05, hiT + .4) })));
      void G4;
    }, ev() { const r = [[this.t, 'amb', { kind: 'study', t1: at('enter', .5) }]]; [3, 6, 10, 14].forEach(k => r.push([w('rules', k) - .1, 'tick'])); r.push([w('rules', 15), 'marker']); return r; } },

    { n: 'enter', t: at('enter', .5), tr: 'iris', f(g, lt, T) {
      const ox = lerp(0, 560, ease.inOut(seg(lt, .4, 4.6))), lockT = w('enter', 13), cntT = w('enter', 15);
      const walkP = seg(lt, .3, 4.0), gone = seg(T, lockT - .55, lockT - .15);
      g.save(); camera(g, 1, 960, 540, ox, 0);
      S.mintFacade(g, T, ease.out(seg(T, lockT - .1, lockT + .15)));
      // the group, drawn on its own layer so it fades as one when they slip inside
      const group = c => {
        const gx = lerp(150, 1240, walkP), ph = lt * 1.15;
        for (let i = 0; i < 8; i++) if (i >= 4) crew(c, gx + 140 - (i % 4) * 170, 955, { i, s: .56, dir: 1, ph: ph + i * .13, sneak: true });
        for (let i = 0; i < 4; i++) crew(c, gx + 60 - i * 170 - (i > 1 ? 120 : 0), 1000, { i, s: .58, dir: 1, ph: ph + i * .13, sneak: true });
        nhi(c, gx - 255, 680, { s: .42, costume: 'heist', E: ek(T, [[0, 'worried'], [L('enter').t0 + 1.2, 'determined']]), headYaw: .45, bodyYaw: .45, lean: .07,
          armL: { at: [150, 160], gest: 'open', rot: -.6, fore: .7 }, armR: { at: [-40, 200], gest: 'relaxed' }, legs: { mode: 'walk', ph: ph + .5, dir: 1 }, talk: null }, T);
      };
      if (gone <= 0) group(g);
      else if (gone < 1) { B.setTransform(1, 0, 0, 1, 0, 0); B.clearRect(0, 0, W, H); B.setTransform(g.getTransform()); group(B);
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1 - gone; g.drawImage(buf, 0, 0); g.restore(); }
      if (T > lockT) { const p = ease.back(seg(T, lockT, lockT + .3)); g.save(); g.translate(1300, 720); g.scale(p, p);
        cel(g, poly([[-40, -10], [40, -10], [40, 50], [-40, 50]]), { f: PAL.gold.f, s: PAL.gold.s, so: [-6, -6], l: PAL.gold.l, lw: 3 });
        const sh = new Path2D(); sh.arc(0, -10, 26, Math.PI, 0); g.strokeStyle = '#6a6a72'; g.lineWidth = 12; g.stroke(sh); g.restore(); }
      g.restore();
      S.chapter(g, 'NGÀY 1 · THỨ SÁU', seg(lt, .7, 1.05));
      if (T > cntT - .1) {
        const p = ease.back(seg(T, cntT - .1, cntT + .2)), n = Math.round(67 * ease.out(seg(T, cntT, cntT + .8)));
        g.save(); g.translate(1640, 200); g.scale(p, p);
        cel(g, poly([[-180, -80], [180, -80], [180, 80], [-180, 80]]), { f: '#fbf6ea', s: '#dccfb6', so: [8, 8], l: '#6b5a48', lw: 2.6 });
        text(g, String(n), -60, 40, { font: font(900, 110), fill: STORY.f, align: 'center', noreg: true });
        text(g, 'con tin', 70, 30, { font: font(400, 50, 'Patrick Hand'), align: 'center', noreg: true });
        REG.list && REG.list.push({ id: 'enter:67', text: '67 con tin', x0: 1460, y0: 120, x1: 1820, y1: 280 });
        g.restore();
      }
    }, ev() { const r = [[this.t, 'music', { cue: 'C' }], [this.t, 'amb', { kind: 'street', t1: at('goal', .05) }], [this.t + .05, 'whoosh'], [this.t + .7, 'pop']];
      for (let k = 0; k < 14; k++) r.push([this.t + .3 + k * .43, 'step', { soft: 1 }]); r.push([w('enter', 13), 'door'], [w('enter', 15) - .1, 'pop']); return r; } },

    { n: 'goal', t: at('goal', .05), f(g, lt, T) {
      const hiT = w('goal', 5), z = 1 + ease.inOut(seg(lt, 0, 5)) * .06;
      paper(g, '#efe5d4');
      g.save(); camera(g, z, 620, 420);
      card(g, { x: 860, y: 470, w: 1180, h: 700, rot: -.02, pin: true, tape: false }, S.planInner({ hi1: seg(T, hiT - .1, hiT + .35), icons: true }));
      g.restore();
      pip(g, 1690, 700, 165, popP(lt, 1.0, 4.9), pipHost({ E: ek(T, [[0, 'talk'], [hiT, 'excited']]), headYaw: -.25 }, T));
    }, ev() { return [[this.t + .02, 'paper'], [w('goal', 5) - .1, 'marker'], [this.t + 1.0, 'pop'], [this.t + 4.9, 'pop', { out: 1 }]]; } },

    { n: 'trick', t: at('trick', .3), f(g, lt, T) {
      const rT = w('trick', 8), z = lerp(1.07, 1, ease.inOut(seg(lt, 2.2, 4)));
      paper(g, '#e9dcc8');
      g.save(); camera(g, z, 960, 520);
      const COLS = ['#2f6f8c', '#4a7a50', '#8a8f9a', '#c9a36e', '#6a4c7a', '#e07a4a', '#2f8088'];
      let n = 0;
      for (let r = 0; r < 6; r++) for (let c = 0; c < 12 && n < 67; c++, n++) {
        const x = 300 + c * 120 + (r % 2) * 30 + 15, y = 250 + r * 112, robber = (n * 37) % 67 < 8;
        const u = seg(T, rT - .2 + c * .06, rT + c * .06), col = robber ? STORY.f : mix(COLS[n % 7], STORY.f, ease.out(u));
        personIcon(g, x, y - Math.sin(u * Math.PI) * 14, .95, col);
      }
      g.restore();
    }, ev() { const r = [[this.t, 'amb', { kind: 'room', t1: at('police', .3) }]]; for (let c = 0; c < 12; c += 2) r.push([w('trick', 8) - .2 + c * .06, 'tick']); return r; } },

    { n: 'police', t: at('police', .3), f(g, lt, T) {
      const qT = w('police', 4), ox = lerp(1550, 2150, ease.inOut(seg(lt, 0, 4.4))), z = 1.7;
      g.save(); camera(g, z, 960, 520, ox - 960, -60);
      S.mintFacade(g, T, 1, { night: true, windowFn: (gg, x, y, k) => { for (let j = 0; j < 2; j++) personIcon(gg, x + 24 + j * 42, y + 136, .62, STORY.f);
        if (T > qT && (k + (y > 500 ? 1 : 0)) % 2 === 0) { const p = ease.back(seg(T, qT + (k % 4) * .08, qT + .3 + (k % 4) * .08)); if (p > 0) { gg.save(); gg.translate(x + 45, y + 40); gg.scale(p, p); text(gg, '?', 0, 0, { font: font(900, 64), fill: '#8fd3ff', stroke: INK, sw: 8, align: 'center', noreg: true }); gg.restore(); } } } });
      g.fillStyle = 'rgba(30,40,90,.38)'; g.globalCompositeOperation = 'multiply'; g.fillRect(-1000, -1000, 5000, 3000); g.globalCompositeOperation = 'source-over';
      g.restore();
      // the scope: dark ring around a circle that drifts a little
      const cx = 960 + Math.sin(lt * 1.3) * 40, cy = 480 + Math.cos(lt * 1.1) * 24, r = 380;
      g.save(); g.fillStyle = '#0a0c14'; g.beginPath(); g.rect(-50, -50, W + 100, H + 100); g.arc(cx, cy, r, 0, TAU, true); g.fill('evenodd');
      g.strokeStyle = '#0a0c14'; g.lineWidth = 3; line(g, [[cx - r, cy], [cx - 40, cy]], '#0a0c14', 3); line(g, [[cx + 40, cy], [cx + r, cy]], '#0a0c14', 3); line(g, [[cx, cy - r], [cx, cy - 40]], '#0a0c14', 3); line(g, [[cx, cy + 40], [cx, cy + r]], '#0a0c14', 3);
      g.strokeStyle = '#2a3048'; g.lineWidth = 14; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); g.restore();
      pip(g, 250, 700, 160, popP(lt, 2.3, 4.25), pipHost({ E: ek(T, [[0, 'skeptical']]), shrug: .8, headRoll: -.08 }, T));
    }, ev() { return [[this.t, 'amb', { kind: 'night', t1: at('print', .35) }], [this.t + .1, 'scope'], [w('police', 4), 'pop'], [this.t + 2.3, 'pop'], [this.t + 4.25, 'pop', { out: 1 }]]; } },

    { n: 'print', t: at('print', .35), f(g, lt, T) {
      const oy = lerp(70, -10, ease.inOut(seg(lt, 0, 3.2))), z = lerp(1.08, 1, ease.inOut(seg(lt, 0, 3.2)));
      g.save(); camera(g, z, 960, 540, 0, oy); S.printHall(g, T);
      crew(g, 1720, 960, { i: 4, s: .5, dir: -1, ph: lt * 1.1, prop: gg => S.brick(gg, 0, 0, 90, .1) });
      const lift = ease.back(seg(lt, .2, .6));
      nhi(g, 880, 300, { s: .76, costume: 'heist', E: expr('excited'), headYaw: .32, bodyYaw: .25, lean: -.03,
        armL: { at: [lerp(130, 200, lift), lerp(100, -240, lift)], gest: 'hold', rot: -1.3, flip: true, prop: gg => S.brick(gg, 34, 4, 120, .1), fore: .9 },
        armR: { at: [-150, 150], gest: 'open', rot: .7, fore: .7 }, legs: { mode: 'stand', feet: [[-70, 770], [60, 760]] } }, T);
      S.flyingNotes(g, T + 3);
      g.restore();
    }, ev() { return [[this.t - .6, 'amb', { kind: 'press', t1: at('decoy', .35) + .2 }], [this.t + .3, 'rustle']]; } },

    { n: 'xsec', t: at('decoy', .35), tr: 'whip', f(g, lt, T) {
      const d = L('decoy'), tn = L('tunnel'), digP = seg(T, w('decoy', 3), w('decoy', 10) + .2), fakeT = w('decoy', 17);
      const realP = seg(T, tn.t0 + .1, w('tunnel', 14) + .2), ox = lerp(0, 1480, ease.inOut(seg(T, tn.t0 + .1, w('tunnel', 14) + .4)));
      g.save(); camera(g, 1, 960, 540, ox, 0);
      const tip = S.crossSection(g, T, { dig: digP, real: realP });
      if (digP > 0 && digP < 1) personIcon(g, 440 - digP * 260, 800 + digP * 110, .7, STORY.f);
      stamp(g, 'GIẢ', 230, 790, { rot: -.16, px: 80, p: seg(T, fakeT - .05, fakeT + .15) });
      if (realP > 0 && realP < 1) cel(g, ellP(tip[0], tip[1], 22, 22), { f: PAL.accent.h, l: PAL.accent.l, lw: 3 });
      g.restore();
      pip(g, 1690, 700, 160, popP(T - d.t0, 3.7, d.t1 - d.t0 + .3), pipHost({ E: ek(T, [[0, 'talk'], [fakeT - .1, ['smug', { glint: 1 }]], [fakeT + .4, ['smug', { glint: 0 }]]]), headYaw: -.2 }, T));
    }, ev() { const r = [[this.t - .12, 'whoosh'], [this.t, 'amb', { kind: 'earth', t1: L('tunnel').t1 + .5 }]];
      for (let k = 0; k < 6; k++) r.push([w('decoy', 3) + k * .28, 'dig']);
      r.push([L('decoy').t0 + 3.7, 'pop'], [w('decoy', 17), 'stamp'], [w('decoy', 17) + .1, 'ting'], [L('decoy').t1 + .3, 'pop', { out: 1 }], [L('tunnel').t0 + .1, 'marker', { long: 1 }]); return r; } },

    { n: 'but', t: L('tunnel').t1 + .6, f(g, lt, T) {
      const t0 = L('but').t0;
      const Ex = ek(T, [[0, ['sad', { gloom: 0, ahoge: -.2, ms: -.25, lookY: .5 }]], [t0 - .3, ['worried', { sweat: 0, ms: -.3, mw: .8, lookX: 0, lookY: 0 }]]], .4);
      desk(g, T, { E: Ex, headYaw: sway(T) * .5, headPitch: nk(T, [[0, .12], [t0 - .4, 0]]) }, 1 + ease.inOut(seg(lt, 0, 5.2)) * .08, [1320, 340]);
    }, ev() { return [[this.t, 'silence', { t1: L('but').t0 - .1 }], [this.t, 'amb', { kind: 'study', t1: at('love1', .3) }], [L('but').t0 - .05, 'music', { cue: 'D' }]]; } },

    { n: 'love1', t: at('love1', .3), f(g, lt, T) {
      const st = w('love1', 2), tk = w('love1', 8), rio = tk + .7, ht = w('love1', 12) - .1;
      const shake = T > st && T < st + .25 ? Math.sin((T - st) * 90) * 8 * (1 - (T - st) / .25) : 0;
      paper(g, '#efe5d4');
      g.save(); g.translate(shake, 0);
      card(g, { x: 760, y: 480, w: 1020, h: 560, rot: -.02, pin: true, tape: false }, S.rulesInner({ broken: [0, 0, seg(T, st, st + .3), 0] }));
      stamp(g, 'PHÁ LUẬT', 1060, 560, { rot: -.1, px: 70, p: seg(T, st - .05, st + .12) });
      S.tag(g, 'TOKYO', 1590, 320, seg(T, tk - .1, tk + .2), { px: 46, rot: -.05 });
      S.tag(g, 'RIO', 1640, 620, seg(T, rio - .1, rio + .2), { px: 46, rot: .05 });
      const hp = ease.back(seg(T, ht, ht + .3));
      if (hp > 0) { g.save(); g.translate(1620, 470); g.scale(hp * (1 + Math.sin(T * 8) * .05), hp); heart(g, 0, 0, 56); g.restore(); }
      g.restore();
    }, ev() { const tk = w('love1', 8); return [[w('love1', 2), 'stamp'], [tk - .1, 'pop'], [tk + .6, 'pop'], [w('love1', 12) - .1, 'heart']]; } },

    { n: 'love2', t: at('love2', .3), f(g, lt, T) {
      const ph = seg(T, w('love2', 3), w('love2', 6)), hT = w('love2', 5), rT = w('love2', 13);
      g.save(); camera(g, 1 + ease.inOut(seg(lt, 0, 5)) * .05, 960, 440); S.cafe(g, T, { phone: ease.inOut(ph) });
      S.tag(g, 'GIÁO SƯ', 1360, 250, seg(lt, .2, .5), { px: 36, col: { f: '#2a3048', s: '#1a1e30', l: '#0a0c14' } });
      S.tag(g, 'RAQUEL · thanh tra', 560, 250, seg(T, w('love2', 11) - .15, w('love2', 11) + .15), { px: 36, col: { f: '#2f6f8c', s: '#1f4c63', l: '#10293a' } });
      const hp = ease.back(seg(T, hT, hT + .35));
      if (hp > 0) { g.save(); g.translate(960, 330 - seg(T, hT, hT + 3) * 40); g.scale(hp, hp); heart(g, 0, 0, 64); g.restore(); }
      g.restore();
    }, ev() { return [[this.t, 'amb', { kind: 'cafe', t1: L('love2').t1 + .1 }], [this.t + .2, 'pop'], [w('love2', 3), 'slide'], [w('love2', 5), 'heart'], [w('love2', 11) - .15, 'pop']]; } },

    { n: 'react', t: L('love2').t1 + .64, f(g, lt, T) {
      paper(g, '#ffd6dc'); focusLines(g, 960, 470, T, '#f29bb0', 70, 420);
      nhi(g, 960, 1180, { s: 4.4, crop: 'bust', E: expr('surprised', { blush: .9, sparkles: 1, ex: 1 }), headRoll: -.05, talk: null, headY: -6 }, T);
    }, ev() { return [[this.t, 'boing'], [this.t, 'silence', { t1: L('blood').t0 - .05, keepFx: 1 }]]; } },

    { n: 'blood', t: L('love2').t1 + 1.8, f(g, lt, T) {
      const vT = w('blood', 8), mT = w('blood', 6);
      paper(g, '#2a1f2a');
      card(g, { x: 900, y: 500, w: 1020, h: 560, rot: -.02, pin: true, tape: false, f: '#e8e0d0' }, (gg, cw, ch) => {
        S.rulesInner({ broken: [0, 0, 1, seg(T, vT, vT + .3)] })(gg, cw, ch);
        const cp = ease.out(seg(T, vT - .05, vT + .25));
        if (cp > 0) { const C = [[-cw / 2, 120], [-300, 100], [-200, 150], [-60, 90], [80, 160], [200, 110], [330, 170], [cw / 2, 130]], n = Math.ceil(cp * (C.length - 1));
          line(gg, C.slice(0, n + 1), '#2a1f2a', 5); }
      });
      const dp = seg(T, mT, mT + 1.4);
      if (dp > 0) { const y = 700 + ease.inOut(dp) * 200 * dp; g.save(); g.translate(600, y); g.scale(1, 1 + dp * .2);
        cel(g, [[0, -34, 1], [20, 0], [0, 20], [-20, 0]], { f: STORY.f, s: STORY.s, so: [-5, -5], l: STORY.l, lw: 3, h: STORY.h, hi: [[[-8, -4], [-4, -14], [-10, 4]]] }); g.restore(); }
    }, ev() { return [[this.t, 'amb', { kind: 'low', t1: at('escape', .5) }], [L('blood').t0 - .05, 'music', { cue: 'E' }], [w('blood', 6) + 1.3, 'drip'], [w('blood', 8), 'crack']]; } },

    { n: 'dead', t: at('dead', .45), f(g, lt, T) {
      const D = [[7, 'OSLO', w('dead', 0) + .2], [5, 'MOSCOW', w('dead', 1)], [1, 'BERLIN', w('dead', 4)]], noteT = w('dead', 5);
      slate(g); g.save(); camera(g, 1 + ease.inOut(seg(lt, 0, 8.6)) * .05, 960, 480);
      D.forEach(([i, nm, gt], k) => {
        const x = 480 + k * 480, gp = seg(T, gt, gt + .6);
        card(g, { x, y: 450, w: 340, h: 420, rot: [-.04, .02, -.02][k], tape: true }, (gg, cw, ch) => {
          gg.fillStyle = mix('#cfe2e8', '#8a8a8a', gp); gg.fillRect(-cw / 2, -ch / 2, cw, ch);
          crew(gg, 0, 700, { i, s: 1.3, dir: 0, grey: gp > .5 });
          if (gp > 0) { gg.fillStyle = `rgba(60,60,64,${gp * .35})`; gg.fillRect(-cw / 2, -ch / 2, cw, ch); }
        });
        S.tag(g, nm, x, 730, 1, { px: 40, col: gp > .5 ? { f: '#6a6466', s: '#4a4446', l: '#2a2426' } : STORY });
      });
      if (T > noteT - .1) { g.globalAlpha = seg(T, noteT - .1, noteT + .3); text(g, 'anh trai của Giáo sư', 1440, 820, { font: font(400, 46, 'Patrick Hand'), fill: '#f4ede2', align: 'center' }); line(g, [[1300, 836], [1580, 832]], '#f4ede2', 3); g.globalAlpha = 1; }
      g.restore();
    }, ev() { return [[w('dead', 0) + .2, 'toll'], [w('dead', 1), 'toll'], [w('dead', 4), 'toll']]; } },

    { n: 'escape', t: at('escape', .5), f(g, lt, T) {
      const camX = lt * 300, ph = lt * 1.25;
      S.tunnelInside(g, T, camX);
      for (const [x, i, s] of [[1500, 6, .55], [1760, 2, .52], [300, 0, .54]]) crew(g, x, 985, { i, s, dir: 1, ph: ph + i * .3, prop: i === 2 ? null : gg => S.brick(gg, 0, 0, 80, .1) });
      nhi(g, 900, 590, { s: .46, costume: 'heist', E: ek(T, [[0, 'determined'], [L('escape').t0 + 2, 'smile']]), headYaw: .45, bodyYaw: .5,
        armR: { at: [-40, 170], gest: 'hold', prop: gg => S.brick(gg, 40, 0, 110, .05), rot: -.2, fore: .7 }, armL: { at: [150 + Math.sin(ph * TAU) * 50, 260] }, legs: { mode: 'walk', ph, dir: 1 } }, T);
      S.chapter(g, '128 GIỜ SAU', seg(lt, .5, .85));
    }, ev() { const r = [[this.t - .6, 'amb', { kind: 'tunnel', t1: at('haul', .25) }], [this.t, 'music', { cue: 'F' }], [this.t + .5, 'pop']];
      for (let k = -2; k < 10; k++) r.push([this.t + k * .4, 'step']); return r; } },

    { n: 'haul', t: at('haul', .25), tr: 'whip', f(g, lt, T) {
      const cr = L('haul').t0, nT = w('haul', 2), sT = w('haul', 2) + .3;
      paper(g, '#efe5d4');
      g.save(); camera(g, 1 + ease.inOut(seg(lt, 0, 3)) * .05, 620, 560);
      card(g, { x: 860, y: 470, w: 1180, h: 700, rot: -.02, pin: true, tape: false }, S.planInner({ cross: seg(T, cr, cr + .35), real: seg(T, cr + .1, cr + .4), hi2: seg(T, nT - .05, nT + .35) }));
      stamp(g, '128 GIỜ', 1270, 260, { rot: .12, px: 60, p: seg(T, sT - .05, sT + .12) });
      g.restore();
    }, ev() { return [[this.t - .12, 'whoosh'], [L('haul').t0, 'marker', { cross: 1 }], [w('haul', 2), 'marker'], [w('haul', 2) + .3, 'stamp'], [w('haul', 2) + .3, 'music', { cue: 'stinger' }]]; } },

    { n: 'half', t: at('half', .3), f(g, lt, T) {
      const t0 = L('half').t0, jT = w('half', 13);
      const Ex = ek(T, [[0, 'talk'], [w('half', 6), 'smile']]);
      desk(g, T, { E: Ex, headYaw: -.2 + sway(T), bodyYaw: -.12, armR: ak(T, [[0, { at: [-110, 320] }], [t0 + .2, { at: [-250, 60], gest: 'point', rot: -.15, flip: false }], [w('half', 6), { at: [-110, 320] }]]) }, 1, [1320, 420],
      g => {
        card(g, { x: 560, y: 470, w: 700, h: 540, rot: -.03, pin: true, tape: false }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 56, y0 = -ch / 2, bw = cw - 112, p = ease.out(seg(T, t0, t0 + 1.2));
          text(gg, 'THỰC TẾ / MỤC TIÊU', x0, y0 + 90, { font: font(900, 40), fill: STORY.f });
          cel(gg, poly([[x0, y0 + 140], [x0 + bw, y0 + 140], [x0 + bw, y0 + 230], [x0, y0 + 230]]), { f: '#efe5d4', l: PAL.paper.l, lw: 3 });
          if (p > 0) cel(gg, poly([[x0, y0 + 140], [x0 + bw * .41 * p, y0 + 140], [x0 + bw * .41 * p, y0 + 230], [x0, y0 + 230]]), { f: STORY.f, s: STORY.s, sh: [poly([[x0, y0 + 210], [x0 + bw, y0 + 210], [x0 + bw, y0 + 230], [x0, y0 + 230]])], l: STORY.l, lw: 3 });
          text(gg, '41 %', x0, y0 + 340, { font: font(900, 96) });
          text(gg, '984 triệu / 2,4 tỷ €', x0 + 250, y0 + 330, { font: font(400, 40, 'Patrick Hand'), fill: '#4a3a30' });
          const jp = ease.back(seg(T, jT - .2, jT + .15));
          if (jp > 0) { gg.save(); gg.translate(x0 + 470, y0 + 450); gg.scale(jp * .55, jp * .55); jumpsuit(gg); gg.restore(); }
        });
      });
    }, ev() { return [[this.t, 'amb', { kind: 'study', t1: at('palawan', .35) }], [L('half').t0, 'rise'], [w('half', 13) - .2, 'pop']]; } },

    { n: 'palawan', t: at('palawan', .35), f(g, lt, T) {
      const lT = w('palawan', 9);
      paper(g, '#efe5d4');
      g.save(); camera(g, 1.03, 960, 470, lerp(-30, 30, seg(lt, 0, 5.8)), 0);
      card(g, { x: 960, y: 440, w: 1120, h: 640, rot: -.025, tape: true }, S.beachInner(T));
      if (T > lT - .2) { g.globalAlpha = seg(T, lT - .2, lT + .2); text(g, 'Palawan, Philippines', 1440, 840, { font: font(400, 54, 'Patrick Hand'), align: 'center' }); g.globalAlpha = 1; }
      g.restore();
      S.chapter(g, '1 NĂM SAU', seg(lt, .2, .55));
    }, ev() { return [[this.t, 'amb', { kind: 'sea', t1: at('next', .4) + 1.2 }], [this.t, 'music', { cue: 'G' }], [this.t + .2, 'pop']]; } },

    { n: 'next', t: at('next', .4), f(g, lt, T) {
      const gT = w('next', 7), endT = L('next').t1 + .3;
      const Ex = ek(T, [[0, 'talk'], [gT - .1, ['smug', { glint: 1 }]], [gT + .5, ['smug', { glint: 0 }]], [endT + .6, 'happy']]);
      const wave = T > endT + .5, wv = Math.sin((T - endT) * 13) * .25;
      desk(g, T, { E: Ex, headYaw: nk(T, [[0, -.1], [endT, -.25]]) + sway(T), bodyYaw: -.1,
        armR: ak(T, [[0, { at: [-110, 320] }], [L('next').t0 + .3, { at: [24, 30], gest: 'fist', upper: .5, fore: .9, bend: -1, rot: .1, flip: true }], [endT, { at: [-110, 320] }]]),
        armL: ak(T, [[0, { at: [100, 320] }], [endT + .5, { at: [180, -110], gest: 'open', rot: -.1 + (wave ? wv : 0), flip: true }]], .3) }, 1, [1320, 420],
      g => {
        const p = ease.back(seg(T, endT, endT + .45));
        if (p > 0) card(g, { x: 560 - (1 - p) * 900, y: 460, w: 700, h: 560, rot: -.035, tape: true }, (gg, cw, ch) => {
          const x0 = -cw / 2 + 56, y0 = -ch / 2;
          text(gg, 'PHI VỤ', x0, y0 + 110, { font: font(900, 80), fill: STORY.f });
          text(gg, 'TIẾP THEO', x0, y0 + 200, { font: font(900, 80), fill: STORY.f });
          gg.save(); gg.translate(-30, y0 + 380); goldBar(gg); gg.restore();
          text(gg, '?', cw / 2 - 120, y0 + 440, { font: font(900, 180), fill: PAL.accent.s, stroke: INK, sw: 10, align: 'center' });
        });
      });
    }, ev() { return [[w('next', 7), 'ting'], [L('next').t1 + .3, 'paper'], [L('next').t1 + .3, 'music', { cue: 'end' }]]; } },
  ];
}

function slate(g) { S.slate(g); }
function heart(g, x, y, r) {
  cel(g, [[x, y + r * .9, 1], [x - r, y - r * .1], [x - r * .9, y - r * .7], [x - r * .45, y - r * .95], [x, y - r * .55, 1], [x + r * .45, y - r * .95], [x + r * .9, y - r * .7], [x + r, y - r * .1]],
    { f: '#ff5a7a', s: '#d8335a', so: [-r * .15, -r * .12], h: '#ffd0da', hi: [ellP(x - r * .45, y - r * .5, r * .18, r * .12, -.6)], l: '#6a0c22', lw: 3 });
}
function goldBar(g) {
  cel(g, poly([[-150, 40], [150, 40], [110, -40], [-110, -40]]), { f: PAL.gold.f, s: PAL.gold.s, sh: [poly([[-150, 40], [150, 40], [140, 26], [-140, 26]])], h: '#ffe9a6', hi: [poly([[-100, -30], [-20, -30], [-50, 10], [-120, 10]])], l: PAL.gold.l, lw: 3 });
}
function jumpsuit(g) {   // a red jumpsuit on a hanger, as an icon
  const R = STORY;
  line(g, [[0, -170], [0, -140]], '#6a6a72', 5); line(g, [[-90, -110], [0, -140], [90, -110]], '#6a6a72', 5);
  cel(g, [[-90, -110, 1], [90, -110, 1], [150, 0, 1], [110, 20, 1], [80, -40], [80, 260, 1], [10, 260, 1], [0, 80], [-10, 260, 1], [-80, 260, 1], [-80, -40], [-110, 20, 1], [-150, 0, 1]], { f: R.f, s: R.s, so: [-10, 0], l: R.l, lw: 3,
    clipFn: gg => line(gg, [[0, -110], [0, 80]], R.l, 2) });
}

// ——— transitions ———
function drawShot(g, i, T) { const sh = SHOTS[i]; REG.id = sh.n; g.save(); sh.f(g, T - sh.t, T); g.restore(); }
function smear(g, i, T, dx) {   // whip pan: the frame drawn several times along x (a directional blur)
  const list = REG.list; REG.list = null;
  B.setTransform(1, 0, 0, 1, 0, 0); drawShot(B, i, T);
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
    g.lineWidth = 22; g.strokeStyle = PAL.accent.f; g.beginPath(); g.arc(1000, 560, r, 0, TAU); g.stroke();
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
