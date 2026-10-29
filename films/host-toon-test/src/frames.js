// Style frames: ?f=host (talking head + insert card) | ?f=scene (the host inside the story, full body)
import { figure, expr, PAL, COSTUME } from './host.js';
import { cel, poly, ellP, line, limb, mix, rgba, W, H } from './cel.js';
import { paper, studyBack, studyFront, card, hilite, stamp, text, font, subtitle, INK, STORY, focusLines, pip } from './broll.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
const Q = new URLSearchParams(location.search), F = Q.get('f') || 'host';

// a generic banknote (not a real currency design): tinted paper, value, emblem
export function note(g, x, y, w, rot = 0, tint = '#e8a25c') {
  const h = w * .52;
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, poly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]), { f: mix(tint, '#fff6e6', .45), s: mix(tint, '#7a3a10', .2), so: [-4, -4], l: mix(tint, '#2a1008', .7), lw: 2 });
  g.strokeStyle = mix(tint, '#7a3a10', .35); g.lineWidth = 1.4; g.strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);
  g.fillStyle = mix(tint, '#7a3a10', .3); g.beginPath(); g.arc(w * .22, 0, h * .3, 0, 7); g.fill();
  g.fillStyle = mix(tint, '#2a1008', .6); g.font = font(900, h * .42); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('50', -w / 2 + 12, -h * .12);
  g.restore();
}
export function brick(g, x, y, w, rot = 0) {   // a strapped bundle of notes, seen from the side
  const h = w * .32;
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, poly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]), { f: '#f2c79a', s: '#d39a64', sh: [poly([[-w / 2, 0], [w / 2, 0], [w / 2, h / 2], [-w / 2, h / 2]])], l: '#6a3a14', lw: 2.2,
    clipFn: gg => { for (let k = 1; k < 6; k++) line(gg, [[-w / 2, -h / 2 + k * h / 6], [w / 2, -h / 2 + k * h / 6]], '#c08450', 1); } });
  cel(g, poly([[-w * .08, -h / 2 - 2], [w * .08, -h / 2 - 2], [w * .08, h / 2 + 2], [-w * .08, h / 2 + 2]]), { f: '#fbf6ea', l: '#6a3a14', lw: 1.8 });
  g.restore();
}

function hostFrame(t) {
  paper(g);
  const cam = { x: 0, y: 0 };
  studyBack(g, t, cam);
  // the insert card, left: plan vs. reality
  card(g, { x: 560, y: 470, w: 640, h: 560, rot: -.035, pin: true, tape: false }, (gg, w, h) => {
    const x0 = -w / 2 + 50, y0 = -h / 2;
    text(gg, 'PHI VỤ XƯỞNG IN TIỀN', x0, y0 + 92, { font: font(900, 40), fill: STORY.f });
    line(gg, [[x0, y0 + 112], [w / 2 - 50, y0 + 112]], PAL.paper.l, 2);
    text(gg, 'Kế hoạch', x0, y0 + 186, { font: font(400, 40, 'Patrick Hand'), fill: '#6b5a48' });
    text(gg, '2,4 tỷ € · 11 ngày', x0, y0 + 244, { font: font(800, 52) });
    line(gg, [[x0 - 6, y0 + 226], [x0 + 470, y0 + 220]], STORY.f, 6);
    text(gg, 'Thực tế', x0, y0 + 330, { font: font(400, 40, 'Patrick Hand'), fill: '#6b5a48' });
    hilite(gg, x0 - 10, y0 + 352, 470, 70, 1, PAL.accent.f, 3);
    text(gg, '984 triệu €', x0, y0 + 406, { font: font(900, 64) });
    text(gg, '67 con tin · 8 người · 1 Giáo sư', x0, y0 + 488, { font: font(400, 36, 'Patrick Hand'), fill: '#4a3a30' });
  });
  stamp(g, '128 GIỜ', 870, 190, { rot: .12, px: 46 });
  // the host, waist up, turned toward the card, pointing
  g.save(); g.translate(1320, 560);
  figure(g, { s: 1.55, E: expr('smug', { glint: .3, lidL: .2, lidR: .2, mo: .25, cat: 0, ms: .7 }), headYaw: -.28, headRoll: .04, bodyYaw: -.15,
    armR: { at: [-250, 60], gest: 'point', rot: -.15, flip: false }, t, linePx: 3.4 });
  g.restore();
  studyFront(g, t, cam);
  subtitle(g, 'Họ không cướp tiền của ai cả — họ tự in ra.');
}

function sceneFrame(t) {
  // inside the mint's print hall: cool industrial wall, presses, conveyor of sheets, money bricks
  g.fillStyle = '#4f6e72'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#5d7e82'; for (let x = 0; x < W; x += 240) g.fillRect(x, 0, 120, 640);
  cel(g, poly([[0, 600], [W, 600], [W, 640], [0, 640]]), { f: '#3e5a5e', l: '#1e3033', lw: 2 });
  // high windows with light shafts
  for (const x of [260, 760, 1260, 1760]) {
    cel(g, poly([[x - 80, 60], [x + 80, 60], [x + 80, 260], [x - 80, 260]]), { f: '#cfe6e4', s: '#a9cfd2', sh: [poly([[x - 80, 180], [x + 80, 120], [x + 80, 260], [x - 80, 260]])], l: '#1e3033', lw: 3 });
    g.fillStyle = 'rgba(255,250,225,.10)'; g.beginPath(); g.moveTo(x - 80, 260); g.lineTo(x + 80, 260); g.lineTo(x + 300, H); g.lineTo(x + 40, H); g.fill();
  }
  // floor
  cel(g, poly([[0, 760], [W, 760], [W, H], [0, H]]), { f: '#8a8f8a', s: '#6f746f', sh: [poly([[0, 760], [W, 760], [W, 800], [0, 800]])], l: '#2e322e', lw: 3 });
  for (let k = -6; k < 14; k++) line(g, [[W / 2 + k * 160, 760], [W / 2 + k * 420, H]], 'rgba(46,50,46,.35)', 2);
  // the press, right
  const px = 1180, py = 330;
  cel(g, poly([[px, py], [px + 640, py], [px + 640, py + 430], [px, py + 430]]), { f: '#3f7f7a', s: '#2c5f5b', so: [-30, 0], l: '#10302e', lw: 3.4,
    clipFn: gg => { for (let i = 0; i < 5; i++) gg.fillStyle = '#356f6a', gg.fillRect(px + 30 + i * 120, py + 40, 90, 60); } });
  for (let i = 0; i < 3; i++) {   // the press rollers, turning (tick marks slide along them)
    const ry = py + 150 + i * 62;
    cel(g, limb([px + 70, ry], [px + 570, ry], 27, 27), { f: '#b8c0bc', s: '#8a948f', sh: [poly([[px, ry + 8], [px + 640, ry + 8], [px + 640, ry + 40], [px, ry + 40]])], l: '#2e322e', lw: 3,
      clipFn: gg => { for (let k = 0; k < 12; k++) { const x = px + 70 + ((k * 46 + t * 140 * (i % 2 ? -1 : 1)) % 552 + 552) % 552; line(gg, [[x, ry - 27], [x + 10, ry + 27]], '#6f7873', 3); } gg.fillStyle = 'rgba(255,255,255,.5)'; gg.fillRect(px + 60, ry - 18, 520, 6); } });
  }
  cel(g, poly([[px - 40, py + 330], [px + 680, py + 330], [px + 680, py + 360], [px - 40, py + 360]]), { f: '#2e322e', l: '#101210', lw: 2 });
  for (let i = 0; i < 7; i++) note(g, px - 10 + i * 100 + (t * 90) % 100, py + 312, 92, 0);
  // warning stripes + the generic sign
  cel(g, poly([[px + 40, py - 80], [px + 380, py - 80], [px + 380, py - 20], [px + 40, py - 20]]), { f: '#f4ede2', l: '#10302e', lw: 2.6 });
  text(g, 'MÁY IN SỐ 3', px + 210, py - 38, { font: font(900, 34), align: 'center', fill: '#10302e' });
  // pallets of bricks, left
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4 - (r > 2 ? 1 : 0); c++) brick(g, 230 + c * 118 + (r % 2) * 30, 900 - r * 40, 112);
  cel(g, poly([[150, 924], [700, 924], [700, 952], [150, 952]]), { f: '#c98a52', s: '#9a5f30', so: [0, -8], l: '#4e2c12', lw: 2.4 });
  // flying notes
  for (let i = 0; i < 9; i++) note(g, 300 + i * 190 + Math.sin(i * 3.1 + t) * 30, 120 + (i * 97) % 300, 70, Math.sin(i * 1.7 + t * 2) * .7);
  // the host inside the story: red jumpsuit, full body, holding up a bundle, excited
  g.save(); g.translate(880, 300);
  figure(g, { s: .76, costume: 'heist', E: expr('excited', { glint: 0 }), headYaw: .32, bodyYaw: .25, lean: -.03,
    armL: { at: [200, -240], gest: 'hold', rot: -1.3, flip: true, prop: gg => brick(gg, 34, 4, 120, .1), fore: .9 },
    armR: { at: [-150, 150], gest: 'open', rot: .7, fore: .7 }, t, linePx: 3, legs: { mode: 'stand', feet: [[-70, 770], [60, 760]] } });
  g.restore();
  // chapter tag, top left
  cel(g, poly([[60, 60], [520, 60], [500, 130], [60, 130]]), { f: STORY.f, s: STORY.s, so: [0, -8], l: STORY.l, lw: 3 });
  text(g, 'NGÀY 3 · XƯỞNG IN', 90, 110, { font: font(900, 38), fill: '#fffaf2' });
  subtitle(g, 'Mỗi giờ, máy chạy ra thêm vài triệu euro mới tinh.');
}

window.render = t => { g.setTransform(1, 0, 0, 1, 0, 0); (F === 'scene' ? sceneFrame : hostFrame)(t); };
window.DUR = 4;
Promise.all([font(900, 40), font(800, 40), font(700, 40), font(500, 22), font(400, 40, 'Patrick Hand')].map(f => document.fonts.load(f, 'ẠẾỘữ'))).then(() => { window.render(0); window.READY = true; });
