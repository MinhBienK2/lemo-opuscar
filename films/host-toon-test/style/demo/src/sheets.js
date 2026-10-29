// Model sheets for the host: ?test=turn | expr | hands | poses
import { figure, expr, EXPR, COSTUME, PAL } from './host.js';
import { hand, GEST } from './hands.js';
import { LWK } from './cel.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
const Q = new URLSearchParams(location.search), TEST = Q.get('test') || 'turn';
const BG = '#efe9e1', INK = '#2a1f2a';

function title(txt, sub) {
  g.fillStyle = INK; g.font = '900 40px "Be Vietnam Pro"'; g.textAlign = 'left'; g.textBaseline = 'top'; g.fillText(txt, 30, 22);
  g.font = '500 22px "Be Vietnam Pro"'; g.fillStyle = '#6a5a66'; g.fillText(sub, 30, 70);
}
function label(x, y, s) { g.fillStyle = '#5a4a56'; g.font = '700 22px "Be Vietnam Pro"'; g.textAlign = 'center'; g.textBaseline = 'top'; g.fillText(s, x, y); }
function cell(x, y, w, h) { g.fillStyle = '#f8f4ee'; g.fillRect(x, y, w, h); g.strokeStyle = '#d6cdc2'; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, w - 2, h - 2); }

const SHEETS = {
  turn(t) {
    title('NHI — model sheet · turnaround', 'Host Toon · 2.5D head: yaw −0.8 → +0.8 · scholar costume · lines stay 3 px at every size');
    const yaws = [-.8, -.4, 0, .4, .8];
    yaws.forEach((y, i) => {
      const x = 200 + i * 300;
      g.save(); g.translate(x, 330); figure(g, { s: .86, E: expr('smile'), headYaw: y, bodyYaw: y * .6, t }); g.restore();
      label(x, 1030, `yaw ${y}`);
    });
  },
  expr(t) {
    title('NHI — expressions', 'Each is a table of numbers (brows, lids, iris, mouth, symbols): any two blend smoothly');
    const names = ['neutral', 'smile', 'happy', 'excited', 'surprised', 'shocked', 'thinking', 'skeptical', 'smug', 'worried', 'sad', 'annoyed', 'embarrassed', 'determined', 'deadpan', 'scared'];
    names.forEach((n, i) => {
      const cx = 30 + (i % 8) * 233, cy = 110 + Math.floor(i / 8) * 480;
      cell(cx, cy, 225, 470);
      g.save(); g.beginPath(); g.rect(cx, cy, 225, 470); g.clip();
      g.translate(cx + 112, cy + 330); figure(g, { s: .98, crop: 'bust', E: expr(n), headYaw: n === 'thinking' ? .25 : n === 'embarrassed' ? -.3 : .12, t: t + i * .37 }); g.restore();
      g.fillStyle = 'rgba(248,244,238,.92)'; g.fillRect(cx + 40, cy + 428, 145, 32); label(cx + 112, cy + 432, n);
    });
  },
  hands(t) {
    title('NHI — hands & props', 'Finger tables (angle, length, curl) per gesture, two views (palm / side); props held in the hand frame');
    const names = ['relaxed', 'open', 'spread', 'point', 'fist', 'thumb', 'one', 'two', 'three', 'four', 'hold', 'pinch'];
    names.forEach((n, i) => {
      const cx = 30 + (i % 6) * 310, cy = 110 + Math.floor(i / 6) * 300;
      cell(cx, cy, 300, 290);
      g.save(); g.translate(cx + 140, cy + 225); g.rotate(-Math.PI / 2 + .2); g.scale(2.4, 2.4); LWK.k = 1.2 / 2.4 * 2.2 / 2.2;
      hand(g, PAL.skin, { gest: n, lw: 2.2 }); g.restore(); LWK.k = 1;
      label(cx + 150, cy + 252, n);
    });
    const props = ['magnifier', 'book', 'marker', 'card', 'mug'];
    props.forEach((p, i) => {
      const cx = 30 + i * 372, cy = 720;
      cell(cx, cy, 362, 340);
      g.save(); g.translate(cx + 140, cy + 200); g.rotate(-.4); g.scale(1.9, 1.9); LWK.k = 1.2 / 1.9 * 1.4;
      hand(g, PAL.skin, { gest: p === 'card' ? 'pinch' : 'hold', lw: 2.2, prop: (await_prop(p)) }); g.restore(); LWK.k = 1;
      label(cx + 181, cy + 300, p);
    });
  },
  poses(t) {
    title('NHI — key poses & costumes', 'Arms and legs are 2-bone IK on hand / foot targets; costumes swap colour sets and collar / skirt / zip');
    const P = [
      ['explain', 'scholar', { E: expr('talk'), armL: { at: [150, 150], gest: 'open', rot: -.8, fore: .55 } }],
      ['point', 'scholar', { E: expr('determined'), headYaw: .35, bodyYaw: .2, armL: { at: [330, -14], gest: 'point', flip: false } }],
      ['think', 'scholar', { E: expr('thinking'), headYaw: .2, headRoll: -.06, armL: { at: [24, 30], gest: 'fist', upper: .5, fore: .9, bend: 1, rot: .1, flip: false }, armR: { at: [70, 140], gest: 'relaxed', fore: .62, rot: -.3 } }],
      ['magnify', 'field', { E: expr('surprised'), headYaw: -.25, armR: { at: [-80, -70], gest: 'hold', prop: 'magnifier', rot: -1.6, flip: true } }],
      ['shrug', 'scholar', { E: expr('skeptical'), shrug: 1, armR: { at: [-180, 180], gest: 'open', rot: .9, fore: .7 }, armL: { at: [180, 180], gest: 'open', rot: -.9, flip: true, fore: .7 } }],
      ['cheer', 'heist', { E: expr('excited'), headYaw: -.3, bodyYaw: -.2, armR: { at: [-150, -160], gest: 'fist', rot: -.3 } }],
    ];
    P.forEach(([n, c, o], i) => {
      const x = 170 + i * 316;
      g.save(); g.translate(x, 330); figure(g, { s: .8, costume: c, t: t + i, ...o }); g.restore();
      label(x, 1030, `${n} · ${c}`);
    });
  },
  action(t) {
    title('NHI — in the scene', 'Full body for the Zack-D-style inserts: walk cycle, sneak, carry, present');
    const P = [
      ['walk ·  ph 0', 'scholar', { E: expr('smile'), headYaw: .5, bodyYaw: .5, armR: { at: [-170, 255] }, armL: { at: [190, 255] }, legs: { mode: 'walk', ph: .25 } }],
      ['walk ·  ph ½', 'scholar', { E: expr('talk'), headYaw: .5, bodyYaw: .5, armR: { at: [-60, 288] }, armL: { at: [120, 288] }, legs: { mode: 'walk', ph: .75 } }],
      ['sneak', 'heist', { E: expr('worried'), headYaw: .4, bodyYaw: .3, lean: .08, armL: { at: [150, 160], gest: 'open', rot: -.6, fore: .7 }, armR: { at: [-40, 200], gest: 'relaxed' }, legs: { mode: 'crouch', k: .8 } }],
      ['carry', 'heist', { E: expr('determined'), headYaw: -.2, armR: { at: [-60, 170], gest: 'hold', prop: 'book', rot: -.2, fore: .7 }, armL: { at: [110, 290], gest: 'relaxed' } }],
      ['wave', 'field', { E: expr('happy'), headYaw: .15, armL: { at: [180, -110], gest: 'open', rot: -.1, flip: true } }],
    ];
    P.forEach(([n, c, o], i) => {
      const x = 200 + i * 380;
      g.save(); g.translate(x, 330); figure(g, { s: .8, costume: c, t: t + i, ...o }); g.restore();
      label(x, 1030, `${n} · ${c}`);
    });
  },
};
import { PROPS } from './hands.js';
function await_prop(p) { return PROPS[p](PAL); }

window.render = t => { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = BG; g.fillRect(0, 0, 1920, 1080); SHEETS[TEST](t); };
window.DUR = 4;
document.fonts.load('900 40px "Be Vietnam Pro"').then(() => document.fonts.load('500 22px "Be Vietnam Pro"')).then(() => document.fonts.load('700 22px "Be Vietnam Pro"')).then(() => { window.render(0); window.READY = true; });
