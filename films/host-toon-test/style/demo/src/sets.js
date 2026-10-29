// The film's places and insert cards, all in the host's cel line language (cel.js, broll.js).
// Every set takes (g, t, …) and draws in screen space 1920×1080 unless it says "world".
import { cel, path, poly, ellP, line, limb, mix, rgba, TAU, W, H } from './cel.js';
import { PAL } from './host.js';
import { text, font, hilite, INK, STORY, ease, seg, clamp01, wrap } from './broll.js';

const HAND = 'Patrick Hand';

// ——— money (a made-up note design: tinted paper, a "50", an emblem; never a real banknote) ———
export function note(g, x, y, w, rot = 0, tint = '#e8a25c') {
  const h = w * .52;
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, poly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]), { f: mix(tint, '#fff6e6', .45), s: mix(tint, '#7a3a10', .2), so: [-4, -4], l: mix(tint, '#2a1008', .7), lw: 2 });
  g.strokeStyle = mix(tint, '#7a3a10', .35); g.lineWidth = 1.4; g.strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);
  g.fillStyle = mix(tint, '#7a3a10', .3); g.beginPath(); g.arc(w * .22, 0, h * .3, 0, TAU); g.fill();
  g.fillStyle = mix(tint, '#2a1008', .6); g.font = font(900, h * .42); g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillText('50', -w / 2 + 12, -h * .12);
  g.restore();
}
export function brick(g, x, y, w, rot = 0) {   // a strapped bundle of notes, from the side
  const h = w * .32;
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, poly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]), { f: '#f2c79a', s: '#d39a64', sh: [poly([[-w / 2, 0], [w / 2, 0], [w / 2, h / 2], [-w / 2, h / 2]])], l: '#6a3a14', lw: 2.2,
    clipFn: gg => { for (let k = 1; k < 6; k++) line(gg, [[-w / 2, -h / 2 + k * h / 6], [w / 2, -h / 2 + k * h / 6]], '#c08450', 1); } });
  cel(g, poly([[-w * .08, -h / 2 - 2], [w * .08, -h / 2 - 2], [w * .08, h / 2 + 2], [-w * .08, h / 2 + 2]]), { f: '#fbf6ea', l: '#6a3a14', lw: 1.8 });
  g.restore();
}

// ——— chapter tag: story-colour slanted label, top left; p 0..1 slides it in ———
export function chapter(g, s, p = 1) {
  if (p <= 0) return;
  g.save(); g.font = font(900, 38); const w = g.measureText(s).width + 70;
  g.translate(-(1 - ease.back(p)) * (w + 80), 0);
  cel(g, poly([[60, 60], [60 + w, 60], [40 + w, 130], [60, 130]]), { f: STORY.f, s: STORY.s, so: [0, -8], l: STORY.l, lw: 3 });
  text(g, s, 90, 110, { font: font(900, 38), fill: '#fffaf2' });
  g.restore();
  return { x0: 60, y0: 60, x1: 60 + w, y1: 130 };
}

// ——— the print hall (cold open and the "print" scene) ———
export function printHall(g, t) {
  g.fillStyle = '#4f6e72'; g.fillRect(-300, -300, W + 600, H + 600);
  g.fillStyle = '#5d7e82'; for (let x = -240; x < W + 240; x += 240) g.fillRect(x, -300, 120, 940);
  cel(g, poly([[-300, 600], [W + 300, 600], [W + 300, 640], [-300, 640]]), { f: '#3e5a5e', l: '#1e3033', lw: 2 });
  for (const x of [260, 760, 1260, 1760]) {
    cel(g, poly([[x - 80, 60], [x + 80, 60], [x + 80, 260], [x - 80, 260]]), { f: '#cfe6e4', s: '#a9cfd2', sh: [poly([[x - 80, 180], [x + 80, 120], [x + 80, 260], [x - 80, 260]])], l: '#1e3033', lw: 3 });
    g.fillStyle = 'rgba(255,250,225,.10)'; g.beginPath(); g.moveTo(x - 80, 260); g.lineTo(x + 80, 260); g.lineTo(x + 300, H); g.lineTo(x + 40, H); g.fill();
  }
  cel(g, poly([[-300, 760], [W + 300, 760], [W + 300, H + 300], [-300, H + 300]]), { f: '#8a8f8a', s: '#6f746f', sh: [poly([[-300, 760], [W + 300, 760], [W + 300, 800], [-300, 800]])], l: '#2e322e', lw: 3 });
  for (let k = -6; k < 14; k++) line(g, [[W / 2 + k * 160, 760], [W / 2 + k * 420, H + 300]], 'rgba(46,50,46,.35)', 2);
  const px = 1180, py = 330;
  cel(g, poly([[px, py], [px + 640, py], [px + 640, py + 430], [px, py + 430]]), { f: '#3f7f7a', s: '#2c5f5b', so: [-30, 0], l: '#10302e', lw: 3.4,
    clipFn: gg => { gg.fillStyle = '#356f6a'; for (let i = 0; i < 5; i++) gg.fillRect(px + 30 + i * 120, py + 40, 90, 60); } });
  for (let i = 0; i < 3; i++) {
    const ry = py + 150 + i * 62;
    cel(g, limb([px + 70, ry], [px + 570, ry], 27, 27), { f: '#b8c0bc', s: '#8a948f', sh: [poly([[px, ry + 8], [px + 640, ry + 8], [px + 640, ry + 40], [px, ry + 40]])], l: '#2e322e', lw: 3,
      clipFn: gg => { for (let k = 0; k < 12; k++) { const x = px + 70 + ((k * 46 + t * 140 * (i % 2 ? -1 : 1)) % 552 + 552) % 552; line(gg, [[x, ry - 27], [x + 10, ry + 27]], '#6f7873', 3); } gg.fillStyle = 'rgba(255,255,255,.5)'; gg.fillRect(px + 60, ry - 18, 520, 6); } });
  }
  cel(g, poly([[px - 40, py + 330], [px + 680, py + 330], [px + 680, py + 360], [px - 40, py + 360]]), { f: '#2e322e', l: '#101210', lw: 2 });
  for (let i = 0; i < 7; i++) note(g, px - 10 + i * 100 + (t * 90) % 100, py + 312, 92, 0);
  cel(g, poly([[px + 40, py - 80], [px + 380, py - 80], [px + 380, py - 20], [px + 40, py - 20]]), { f: '#f4ede2', l: '#10302e', lw: 2.6 });
  text(g, 'MÁY IN SỐ 3', px + 210, py - 38, { font: font(900, 34), align: 'center', fill: '#10302e' });
  // a second press, left, half in shadow
  cel(g, poly([[-260, 360], [260, 360], [260, 760], [-260, 760]]), { f: '#365f5b', s: '#264845', so: [-30, 0], l: '#10302e', lw: 3.4 });
  for (let i = 0; i < 2; i++) { const ry = 470 + i * 70; cel(g, limb([-200, ry], [200, ry], 25, 25), { f: '#a6aeaa', s: '#7f8984', so: [0, -10], l: '#2e322e', lw: 3 }); }
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4 - (r > 2 ? 1 : 0); c++) brick(g, 330 + c * 118 + (r % 2) * 30, 920 - r * 40, 112);
  cel(g, poly([[250, 944], [800, 944], [800, 972], [250, 972]]), { f: '#c98a52', s: '#9a5f30', so: [0, -8], l: '#4e2c12', lw: 2.4 });
}
// notes fluttering through the hall (drawn last, in front)
export function flyingNotes(g, t, n = 9, k = 1) {
  for (let i = 0; i < n; i++) {
    const fy = ((i * 97 + t * (40 + (i % 3) * 25)) % 700) - 60;
    note(g, 200 + i * 190 + Math.sin(i * 3.1 + t) * 40, 80 + fy, 70 * k, Math.sin(i * 1.7 + t * 2) * .8);
  }
}

// ——— the Professor's hangar at night, chalkboard of the plan ———
export function hangar(g, t, chalk = 1) {
  g.fillStyle = '#1b2236'; g.fillRect(-300, -300, W + 600, H + 600);
  // corrugated arch
  const arch = new Path2D(); arch.moveTo(-200, H); arch.lineTo(-200, 500); arch.quadraticCurveTo(W / 2, -380, W + 200, 500); arch.lineTo(W + 200, H); arch.closePath();
  cel(g, arch, { f: '#26304a', s: '#1e263c', so: [40, 0], l: '#0c1020', lw: 4, clipFn: gg => { for (let x = -200; x < W + 200; x += 70) line(gg, [[x, -300], [x + (x - W / 2) * .2, H]], 'rgba(12,16,32,.5)', 3); } });
  // a hanging lamp and its pool of light
  line(g, [[1180, -100], [1180, 170]], '#0c1020', 4);
  cel(g, poly([[1130, 170], [1230, 170], [1260, 220], [1100, 220]]), { f: '#3a4562', l: '#0c1020', lw: 3 });
  g.fillStyle = 'rgba(255,226,150,.13)'; g.beginPath(); g.moveTo(1110, 220); g.lineTo(1250, 220); g.lineTo(1620, 980); g.lineTo(740, 980); g.fill();
  cel(g, ellP(1180, 222, 34, 10), { f: '#ffe7a6', l: '#8a6a20', lw: 2 });
  // floor
  cel(g, poly([[-300, 900], [W + 300, 900], [W + 300, H + 300], [-300, H + 300]]), { f: '#2a2f3e', s: '#20242f', sh: [poly([[-300, 900], [W + 300, 900], [W + 300, 930], [-300, 930]])], l: '#0c1020', lw: 3 });
  g.fillStyle = 'rgba(255,226,150,.10)'; g.beginPath(); g.ellipse(1180, 960, 440, 60, 0, 0, TAU); g.fill();
  // chalkboard on an easel
  const bx = 360, by = 230, bw = 820, bh = 540;
  line(g, [[bx + 120, by + bh], [bx + 60, 920]], '#5a3a26', 10); line(g, [[bx + bw - 120, by + bh], [bx + bw - 60, 920]], '#5a3a26', 10);
  cel(g, poly([[bx - 18, by - 18], [bx + bw + 18, by - 18], [bx + bw + 18, by + bh + 18], [bx - 18, by + bh + 18]]), { f: '#7a5236', s: '#5a3a26', so: [0, -8], l: '#2a160a', lw: 3 });
  cel(g, poly([[bx, by], [bx + bw, by], [bx + bw, by + bh], [bx, by + bh]]), { f: '#2f4a42', s: '#283f38', so: [16, 0], l: '#14221e', lw: 2 });
  g.save(); g.globalAlpha = chalk; const C = 'rgba(240,240,230,.85)';
  // the plan in chalk: the building, a vault, a tunnel line, a clock, "11 NGÀY"
  line(g, [[bx + 70, by + 300], [bx + 330, by + 300], [bx + 330, by + 140], [bx + 200, by + 80], [bx + 70, by + 140], [bx + 70, by + 300]], C, 4);
  for (let k = 0; k < 4; k++) line(g, [[bx + 100 + k * 64, by + 160], [bx + 100 + k * 64, by + 290]], C, 3);
  line(g, [[bx + 200, by + 300], [bx + 200, by + 420], [bx + 640, by + 420], [bx + 640, by + 330]], C, 4);
  g.setLineDash([12, 12]); line(g, [[bx + 200, by + 420], [bx + 640, by + 420]], 'rgba(255,210,63,.9)', 5); g.setLineDash([]);
  line(g, [[bx + 580, by + 330], [bx + 700, by + 330], [bx + 700, by + 260], [bx + 580, by + 260], [bx + 580, by + 330]], C, 4);
  g.strokeStyle = C; g.lineWidth = 4; g.beginPath(); g.arc(bx + 600, by + 130, 56, 0, TAU); g.stroke();
  line(g, [[bx + 600, by + 130], [bx + 600, by + 92]], C, 4); line(g, [[bx + 600, by + 130], [bx + 628, by + 146]], C, 4);
  text(g, '11 NGÀY', bx + 430, by + 230, { font: font(400, 46, HAND), fill: C });
  text(g, '?', bx + 760, by + 120, { font: font(400, 70, HAND), fill: C });
  g.restore();
}

// ——— the plan's place: a map card of the Iberian peninsula (simplified outline) with a pin ———
const IBERIA = [[-300, -170], [-150, -200], [10, -186], [150, -205], [250, -150], [300, -60], [240, 10], [210, 90], [130, 160], [40, 190], [-80, 205], [-170, 160], [-245, 160], [-300, 120], [-268, 40], [-290, -40], [-330, -110]];
export function mapInner(pinP, labelP) {
  return (g, w, h) => {
    g.fillStyle = '#cfe3e6'; g.fillRect(-w / 2, -h / 2, w, h);
    for (let k = -6; k < 7; k++) line(g, [[-w / 2, k * 60], [w / 2, k * 60 + 10]], 'rgba(90,130,140,.25)', 1.5);
    g.save(); g.translate(0, 10);
    cel(g, path(IBERIA), { f: '#f1e2bf', s: '#e2cd9e', so: [10, 10], l: '#7a6248', lw: 3 });
    line(g, [[-238, -150], [-200, 0], [-232, 150]], 'rgba(122,98,72,.6)', 2.2);   // the border, roughly
    text(g, 'TÂY BAN NHA', 40, -60, { font: font(900, 30), align: 'center', fill: '#a08a64' });
    // Madrid dot and Toledo pin
    cel(g, ellP(-10, 20, 7, 7), { f: INK, l: INK, lw: 1 }); text(g, 'Madrid', 4, 12, { font: font(400, 30, HAND), fill: '#5a4a3a' });
    if (pinP > 0) {
      const k = ease.back(pinP), py = 70 - (1 - k) * 80;
      g.fillStyle = rgba(INK, .25); g.beginPath(); g.ellipse(-40, 70, 14 * k, 5 * k, 0, 0, TAU); g.fill();
      line(g, [[-40, 70], [-40, py - 34]], '#6b5a48', 3);
      cel(g, ellP(-40, py - 44, 16, 16), { f: STORY.f, s: STORY.s, so: [-4, -4], l: STORY.l, lw: 2.4 });
    }
    if (labelP > 0) { g.globalAlpha = clamp01(labelP * 2); text(g, 'Toledo', -60, 116, { font: font(400, 40, HAND), fill: INK, align: 'right' }); g.globalAlpha = 1; }
    g.restore();
  };
}
// an abandoned farmhouse, drawn on a photo card
export function farmInner(t) {
  return (g, w, h) => {
    g.fillStyle = '#f2d9a8'; g.fillRect(-w / 2, -h / 2, w, h);
    cel(g, ellP(w * .28, -h * .22, 40, 40), { f: '#fff1c2', l: '#c99a40', lw: 2 });
    cel(g, poly([[-w / 2, h * .1], [w / 2, h * .02], [w / 2, h / 2], [-w / 2, h / 2]]), { f: '#c9a86a', s: '#b08f52', sh: [poly([[-w / 2, h * .3], [w / 2, h * .28], [w / 2, h / 2], [-w / 2, h / 2]])], l: '#6a5030', lw: 2 });
    const x = -w * .3, y = h * .12;
    cel(g, poly([[x, y], [x + 230, y], [x + 230, y - 120], [x, y - 120]]), { f: '#e8d6b4', s: '#cdb48a', so: [-20, 0], l: '#5a4028', lw: 2.4 });
    cel(g, poly([[x - 20, y - 116], [x + 115, y - 190], [x + 250, y - 116]]), { f: '#b0563a', s: '#8a3e28', so: [0, 10], l: '#4a1e10', lw: 2.4 });
    for (const [dx, dy] of [[30, -90], [150, -90]]) cel(g, poly([[x + dx, y + dy], [x + dx + 44, y + dy], [x + dx + 44, y + dy + 40], [x + dx, y + dy + 40]]), { f: '#3a3040', l: '#5a4028', lw: 2 });
    cel(g, poly([[x + 96, y], [x + 136, y], [x + 136, y - 64], [x + 96, y - 64]]), { f: '#6a4024', l: '#3a2010', lw: 2 });
    for (let k = 0; k < 6; k++) line(g, [[x + 250 + k * 30, y + 4], [x + 250 + k * 30, y - 40]], '#7a5a36', 3);
    line(g, [[x + 245, y - 30], [x + 420, y - 32]], '#7a5a36', 3);
    // a dry tree
    line(g, [[w * .3, h * .1], [w * .3, -h * .1], [w * .22, -h * .2]], '#5a4028', 5); line(g, [[w * .3, -h * .06], [w * .38, -h * .16]], '#5a4028', 4);
  };
}
// a tear-off calendar: p 0..1 flips through five months
export function calendar(g, x, y, p) {
  const n = Math.min(5, 1 + Math.floor(p * 5)), f = (p * 5) % 1;
  g.save(); g.translate(x, y);
  cel(g, poly([[-110, -120], [110, -120], [110, 130], [-110, 130]]), { f: '#fbf6ea', s: '#dccfb6', so: [8, 8], l: '#6b5a48', lw: 2.4 });
  cel(g, poly([[-110, -120], [110, -120], [110, -60], [-110, -60]]), { f: STORY.f, l: STORY.l, lw: 2.4 });
  for (const k of [-60, 60]) cel(g, ellP(k, -126, 10, 14), { f: '#6b5a48', l: INK, lw: 1.6 });
  text(g, 'THÁNG', 0, -78, { font: font(900, 32), fill: '#fffaf2', align: 'center' });
  text(g, String(n), 0, 70, { font: font(900, 120), align: 'center', noreg: n < 5 });
  if (n < 5 && p < 1) {   // the page tearing off
    g.save(); g.translate(0, -60); g.rotate(-f * 1.4); g.globalAlpha = 1 - f;
    cel(g, poly([[-110, 0], [110, 0], [110, 190], [-110, 190]]), { f: '#fbf6ea', l: '#6b5a48', lw: 2 });
    text(g, String(n), 0, 130, { font: font(900, 120), align: 'center', noreg: true }); g.restore();
  }
  g.restore();
}

// ——— line-up wall (height chart), world width 2600 ———
export function lineupWall(g) {
  g.fillStyle = '#d9d2c4'; g.fillRect(-400, -300, 3400, 1700);
  for (let k = 0; k < 9; k++) { const y = 860 - k * 90; line(g, [[-400, y], [3000, y]], 'rgba(60,50,40,.35)', k % 2 ? 2 : 4); text(g, (150 + k * 10) + '', -300, y - 8, { font: font(700, 24), fill: 'rgba(60,50,40,.55)', noreg: true }); }
  cel(g, poly([[-400, 870], [3000, 870], [3000, 1400], [-400, 1400]]), { f: '#8a7d6a', s: '#76695a', sh: [poly([[-400, 870], [3000, 870], [3000, 900], [-400, 900]])], l: '#3a3024', lw: 3 });
}
// a name tag on a string, popping in (p 0..1)
export function tag(g, s, x, y, p, o = {}) {
  if (p <= 0) return null;
  const k = ease.back(p), col = o.col || STORY;
  g.save(); g.font = font(900, o.px || 40); const w = g.measureText(s).width + 44, h = (o.px || 40) * 1.5;
  g.translate(x, y); g.scale(k, k); g.rotate(o.rot || 0);
  cel(g, poly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]), { f: col.f, s: col.s, so: [0, -6], l: col.l, lw: 2.6 });
  text(g, s, 0, h * .22, { font: font(900, o.px || 40), fill: o.ink || '#fffaf2', align: 'center' });
  g.restore();
  return { x0: x - w / 2, y0: y - h / 2, x1: x + w / 2, y1: y + h / 2 };
}

// ——— the Mint: a generic neoclassical facade (world x 0..2600), morning; door 0 open .. 1 shut ———
export function mintFacade(g, t, door = 0, o = {}) {
  const sky = o.night ? '#1d2a44' : '#cfe2e8';
  g.fillStyle = sky; g.fillRect(-400, -300, 3600, 1700);
  if (!o.night) { cel(g, ellP(2300, 160, 70, 70), { f: '#fff3c4', l: '#e0b860', lw: 2 }); for (const [x, y, s] of [[300, 140, 1], [1500, 90, .8], [2700, 200, 1.1]]) cloud(g, x, y, s); }
  const F = { f: '#efe4cf', s: '#d6c6a6', l: '#6a5638' };
  cel(g, poly([[100, 300], [2500, 300], [2500, 900], [100, 900]]), { f: F.f, s: F.s, so: [-30, 0], l: F.l, lw: 3 });
  for (let k = 0; k < 13; k++) {   // windows
    const x = 180 + k * 180; if (k >= 5 && k <= 7) continue;
    for (const y of [380, 600]) {
      const lit = o.night ? '#ffd88a' : '#7d98a8';
      cel(g, poly([[x, y], [x + 90, y], [x + 90, y + 140], [x, y + 140]]), { f: lit, s: mix(lit, '#2a3040', .3), so: [10, 10], l: F.l, lw: 2.2 });
      line(g, [[x + 45, y], [x + 45, y + 140]], F.l, 2); line(g, [[x, y + 70], [x + 90, y + 70]], F.l, 2);
      if (o.windowFn) o.windowFn(g, x, y, k);
    }
  }
  // portico: pediment + six columns
  cel(g, poly([[1020, 270], [1300, 120], [1580, 270]]), { f: F.f, s: F.s, sh: [poly([[1020, 270], [1580, 270], [1580, 290], [1020, 290]])], l: F.l, lw: 3 });
  cel(g, poly([[1000, 270], [1600, 270], [1600, 310], [1000, 310]]), { f: F.f, s: F.s, so: [0, -8], l: F.l, lw: 3 });
  for (let k = 0; k < 6; k++) { const x = 1050 + k * 100; cel(g, poly([[x - 26, 310], [x + 26, 310], [x + 26, 820], [x - 26, 820]]), { f: '#f6eedd', s: F.s, so: [-14, 0], l: F.l, lw: 2.6, clipFn: gg => { line(gg, [[x - 8, 310], [x - 8, 820]], 'rgba(106,86,56,.35)', 2); line(gg, [[x + 8, 310], [x + 8, 820]], 'rgba(106,86,56,.35)', 2); } }); }
  // the doors
  const dx = 1220, dw = 160, dy = 600, dh = 220;
  cel(g, poly([[dx, dy], [dx + dw, dy], [dx + dw, dy + dh], [dx, dy + dh]]), { f: '#2a2026', l: F.l, lw: 2.4 });
  const half = dw / 2 * door;
  for (const sd of [0, 1]) { const x0 = sd ? dx + dw - half : dx; if (half > 1) cel(g, poly([[x0, dy], [x0 + half, dy], [x0 + half, dy + dh], [x0, dy + dh]]), { f: '#6a4024', s: '#4a2a14', so: [sd ? -6 : 6, 0], l: '#2a1408', lw: 2.4 }); }
  text(g, 'XƯỞNG IN TIỀN', 1300, 252, { font: font(900, 30), fill: F.l, align: 'center', noreg: !!o.night });
  // steps and street
  for (let k = 0; k < 4; k++) cel(g, poly([[950 - k * 40, 820 + k * 22], [1650 + k * 40, 820 + k * 22], [1650 + k * 40, 842 + k * 22], [950 - k * 40, 842 + k * 22]]), { f: F.f, s: F.s, so: [0, -6], l: F.l, lw: 2 });
  cel(g, poly([[-400, 900], [3200, 900], [3200, 1400], [-400, 1400]]), { f: o.night ? '#2a3348' : '#a9a49a', s: o.night ? '#222a3c' : '#948f86', sh: [poly([[-400, 900], [3200, 900], [3200, 930], [-400, 930]])], l: '#3a3630', lw: 3 });
}
function cloud(g, x, y, s) { const P = new Path2D(); for (const [dx, dy, r] of [[-60, 10, 40], [0, -10, 55], [60, 8, 42], [20, 20, 40]]) P.addPath(ellP(x + dx * s, y + dy * s, r * s, r * s * .8)); g.strokeStyle = '#a8c4cc'; g.lineWidth = 6; g.stroke(P); g.fillStyle = '#fbfdfd'; g.fill(P); }

// ——— cross-section of the ground (world, width 3400): the Mint left, the Professor's hangar right ———
// dig 0..1 = the decoy tunnel dug; real 0..1 = the real tunnel drawn as a highlighter path
export const TUNNEL = [[560, 760], [700, 840], [1100, 860], [1700, 850], [2300, 870], [2780, 820], [2900, 700], [2900, 520]];
export function crossSection(g, t, o = {}) {
  g.fillStyle = '#cfe2e8'; g.fillRect(-300, -300, 4000, 700);
  // strata
  const S = [['#b98a5a', 400], ['#a5774a', 560], ['#8f663e', 720], ['#7a5634', 920], ['#664729', 1500]];
  S.forEach(([c, y], i) => cel(g, path([[-300, y, 1], ...Array.from({ length: 12 }, (_, k) => [k * 350, y + Math.sin(k * 1.7 + i) * 16]), [3800, y, 1], [3800, 1500, 1], [-300, 1500, 1]]), { f: c, l: mix(c, '#2a1408', .5), lw: 2 }));
  for (let k = 0; k < 60; k++) { const x = (k * 263) % 3600 - 100, y = 440 + (k * 151) % 900; cel(g, ellP(x, y, 10 + k % 4 * 4, 7 + k % 3 * 3), { f: '#c9a070', l: '#5a3a1e', lw: 1.4 }); }
  line(g, [[-300, 400], [3800, 400]], '#3a2a1a', 4);
  // the Mint on the surface (small), with a vault below
  const F = { f: '#efe4cf', s: '#d6c6a6', l: '#6a5638' };
  cel(g, poly([[260, 160], [880, 160], [880, 400], [260, 400]]), { f: F.f, s: F.s, so: [-14, 0], l: F.l, lw: 3 });
  cel(g, poly([[440, 160], [570, 90], [700, 160]]), { f: F.f, l: F.l, lw: 3 });
  for (let k = 0; k < 5; k++) cel(g, poly([[470 + k * 50, 180], [490 + k * 50, 180], [490 + k * 50, 395], [470 + k * 50, 395]]), { f: '#f6eedd', l: F.l, lw: 2 });
  text(g, 'XƯỞNG IN TIỀN', 570, 140, { font: font(900, 28), fill: F.l, align: 'center' });
  cel(g, poly([[440, 680], [700, 680], [700, 800], [440, 800]]), { f: '#5a5a62', s: '#45454c', so: [10, 0], l: '#1a1a20', lw: 3 });   // the vault
  line(g, [[570, 400], [570, 680]], '#3a2a1a', 3); g.setLineDash([10, 10]); line(g, [[560, 400], [560, 680]], 'rgba(58,42,26,.4)', 2); g.setLineDash([]);
  text(g, 'HẦM KHO', 570, 718, { font: font(900, 30), fill: '#f4ede2', align: 'center' });
  // the decoy: dug down-left from the vault, ends at nothing
  const dig = o.dig || 0;
  if (dig > 0) {
    const D = [[440, 760], [360, 800], [250, 860], [150, 930]], n = dig * (D.length - 1), pts = [D[0]];
    for (let i = 1; i <= Math.ceil(n); i++) { const f = Math.min(1, n - i + 1), a = D[i - 1], b = D[i]; pts.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]); }
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#3a2614'; g.lineWidth = 64; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke();
    g.strokeStyle = '#4a321c'; g.lineWidth = 52; g.stroke();
  }
  // the Professor's hangar on the surface, right
  cel(g, path([[2700, 400, 1], [2700, 260], [2900, 170], [3100, 260], [3100, 400, 1]]), { f: '#8a9aa8', s: '#6f7f8c', so: [-16, 0], l: '#2a3440', lw: 3, clipFn: gg => { for (let x = 2710; x < 3100; x += 40) line(gg, [[x, 160], [x, 400]], 'rgba(42,52,64,.4)', 2); } });
  cel(g, poly([[2860, 300], [2940, 300], [2940, 400], [2860, 400]]), { f: '#3a4450', l: '#2a3440', lw: 2 });
  text(g, 'NHÀ KHO', 2900, 140, { font: font(900, 28), fill: '#2a3440', align: 'center' });
  // the real tunnel: a highlighter path that draws itself
  const real = o.real || 0;
  if (real > 0) {
    const n = real * (TUNNEL.length - 1), pts = [TUNNEL[0]];
    for (let i = 1; i <= Math.ceil(n); i++) { const f = Math.min(1, n - i + 1), a = TUNNEL[i - 1], b = TUNNEL[i]; pts.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]); }
    g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = '#2a1a0c'; g.lineWidth = 70; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke();
    g.strokeStyle = '#3a2614'; g.lineWidth = 58; g.stroke();
    g.save(); g.globalCompositeOperation = 'source-over'; g.strokeStyle = rgba(PAL.accent.f, .85); g.lineWidth = 22; g.stroke(); g.restore();
    return pts[pts.length - 1];
  }
  return TUNNEL[0];
}

// ——— the café: a window table, two cups, a lent phone; the sign says HANOI (the bar in the story) ———
export function cafe(g, t, o = {}) {
  g.fillStyle = '#3a2a2e'; g.fillRect(-300, -300, W + 600, H + 600);
  // window to the street at dawn
  cel(g, poly([[200, 120], [1720, 120], [1720, 640], [200, 640]]), { f: '#f2c9a0', s: '#e8b080', sh: [poly([[200, 460], [1720, 420], [1720, 640], [200, 640]])], l: '#1e1416', lw: 4 });
  for (const x of [700, 1220]) line(g, [[x, 120], [x, 640]], '#1e1416', 10);
  text(g, 'HANOI', 960, 230, { font: font(900, 110), fill: rgba('#d8332f', .55), align: 'center' });
  cel(g, poly([[0, 640], [W, 640], [W, 690], [0, 690]]), { f: '#7a4a30', s: '#5a3420', so: [0, -10], l: '#1e1416', lw: 3 });
  // two silhouettes at the window: left = the inspector (hair tied back), right = the stranger with glasses
  const sil = (x, flip, k) => {
    g.save(); g.translate(x, 640); g.scale(flip, 1);
    g.fillStyle = '#1e1a24'; g.beginPath(); g.moveTo(-150, 0); g.bezierCurveTo(-150, -150, -90, -190, 0, -190); g.bezierCurveTo(90, -190, 150, -150, 150, 0); g.fill();
    g.beginPath(); g.ellipse(0, -270, 78, 90, 0, 0, TAU); g.fill();
    if (k === 'tie') { g.beginPath(); g.ellipse(-80, -270, 34, 26, 0, 0, TAU); g.fill(); }
    if (k === 'glasses') { g.strokeStyle = '#5a6a8a'; g.lineWidth = 5; g.beginPath(); g.ellipse(52, -276, 22, 16, 0, 0, TAU); g.stroke(); }
    g.restore();
  };
  sil(560, 1, 'tie'); sil(1360, -1, 'glasses');
  // the table, front
  cel(g, poly([[-100, 760], [W + 100, 760], [W + 100, H + 300], [-100, H + 300]]), { f: '#a8714a', s: '#8a5a36', sh: [poly([[-100, 760], [W + 100, 760], [W + 100, 790], [-100, 790]])], l: '#3a2010', lw: 3 });
  const cup = (x) => { cel(g, poly([[x - 50, 800], [x + 50, 800], [x + 42, 900], [x - 42, 900]]), { f: '#fbf6ea', s: '#dccfb6', so: [10, 0], l: '#6b5a48', lw: 2.4 }); cel(g, ellP(x, 800, 50, 12), { f: '#5a3420', l: '#6b5a48', lw: 2 }); cel(g, ellP(x, 905, 80, 16), { f: '#fbf6ea', s: '#dccfb6', so: [0, -6], l: '#6b5a48', lw: 2 }); };
  cup(560); cup(1360);
  // the phone sliding across (p 0..1)
  const px = 1240 - (o.phone || 0) * 520;
  cel(g, poly([[px - 40, 850], [px + 40, 846], [px + 46, 940], [px - 34, 944]]), { f: '#2a2a34', s: '#16161e', so: [-4, -4], l: '#08080c', lw: 2.4 });
  cel(g, poly([[px - 32, 858], [px + 32, 855], [px + 36, 928], [px - 28, 932]]), { f: '#5a7a9a', l: '#08080c', lw: 1.4 });
}

// ——— dark slate board with photo cards (the losses) ———
export function slate(g) {
  g.fillStyle = '#23262c'; g.fillRect(-300, -300, W + 600, H + 600);
  for (let k = 0; k < 40; k++) { const x = (k * 487) % W, y = (k * 311) % H; g.fillStyle = 'rgba(255,255,255,.025)'; g.fillRect(x, y, 160, 3); }
}

// ——— inside the real tunnel (world x scrolls): an arched bore with lamps ———
export function tunnelInside(g, t, camX) {
  g.fillStyle = '#2a1a10'; g.fillRect(-300, -300, W + 600, H + 600);
  const bore = new Path2D(); bore.moveTo(-300, 980); bore.lineTo(-300, 380); bore.quadraticCurveTo(W / 2, -100, W + 300, 380); bore.lineTo(W + 300, 980); bore.closePath();
  cel(g, bore, { f: '#6a4a2c', s: '#563a20', sh: [poly([[-300, 300], [W + 300, 300], [W + 300, 420], [-300, 420]])], l: '#1a0e06', lw: 4 });
  // timber frames, parallax with the camera
  for (let k = -2; k < 8; k++) {
    const x = ((k * 520 - camX) % 3120 + 3120) % 3120 - 600;
    cel(g, poly([[x, 980], [x + 36, 980], [x + 36, 300], [x, 300]]), { f: '#8a5a32', s: '#6a4024', so: [-10, 0], l: '#2a1408', lw: 2.4 });
    cel(g, poly([[x - 40, 300], [x + 520, 300], [x + 520, 336], [x - 40, 336]]), { f: '#8a5a32', s: '#6a4024', so: [0, -8], l: '#2a1408', lw: 2.4 });
    // a lamp on each frame
    line(g, [[x + 260, 336], [x + 260, 380]], '#1a0e06', 3);
    cel(g, ellP(x + 260, 392, 16, 16), { f: '#ffe7a6', l: '#8a6a20', lw: 2 });
    g.fillStyle = 'rgba(255,226,150,.12)'; g.beginPath(); g.ellipse(x + 260, 392, 170, 120, 0, 0, TAU); g.fill();
  }
  // floor with rails
  cel(g, poly([[-300, 900], [W + 300, 900], [W + 300, H + 300], [-300, H + 300]]), { f: '#4a3220', s: '#3a2616', sh: [poly([[-300, 900], [W + 300, 900], [W + 300, 930], [-300, 930]])], l: '#1a0e06', lw: 3 });
  for (let k = -2; k < 30; k++) { const x = ((k * 90 - camX * 1.0) % 2880 + 2880) % 2880 - 300; cel(g, poly([[x, 960], [x + 50, 960], [x + 56, 990], [x - 6, 990]]), { f: '#6a4a2c', l: '#1a0e06', lw: 1.6 }); }
  line(g, [[-300, 970], [W + 300, 970]], '#9a9aa2', 6); line(g, [[-300, 1010], [W + 300, 1010]], '#9a9aa2', 7);
}

// ——— the postcard: a beach at sunset (Palawan), in the inner of a card ———
export function beachInner(t) {
  return (g, w, h) => {
    const x0 = -w / 2, y0 = -h / 2;
    g.fillStyle = '#ffcf9a'; g.fillRect(x0, y0, w, h);
    g.fillStyle = '#ffb27a'; g.fillRect(x0, y0 + h * .3, w, h * .2);
    cel(g, ellP(w * .12, y0 + h * .46, 70, 70), { f: '#fff1c2', l: '#e09040', lw: 2 });
    cel(g, poly([[x0, y0 + h * .5], [w / 2, y0 + h * .5], [w / 2, y0 + h * .78], [x0, y0 + h * .78]]), { f: '#3a8aa0', s: '#2f7488', sh: [poly([[x0, y0 + h * .5], [w / 2, y0 + h * .5], [w / 2, y0 + h * .55], [x0, y0 + h * .55]])], l: '#1a4a58', lw: 2 });
    for (let k = 0; k < 5; k++) { const y = y0 + h * (.56 + k * .045), dx = Math.sin(t * 1.2 + k) * 20; line(g, [[x0 + 80 + dx + k * 40, y], [x0 + 260 + dx + k * 40, y]], 'rgba(255,240,200,.6)', 3); line(g, [[w * .05 + dx, y], [w * .2 + dx, y]], 'rgba(255,240,200,.8)', 3); }
    cel(g, path([[x0, y0 + h * .78, 1], [x0 + w * .3, y0 + h * .74], [w / 2, y0 + h * .82, 1], [w / 2, h / 2, 1], [x0, h / 2, 1]]), { f: '#f2d49a', s: '#e0bc7a', so: [0, 10], l: '#8a6a3a', lw: 2 });
    // a palm, swaying
    const px = x0 + w * .2, py = y0 + h * .86, sw = Math.sin(t * 1.1) * .04;
    const top = [px + 60 + sw * 400, y0 + h * .2];
    g.lineCap = 'round'; g.strokeStyle = '#4a3020'; g.lineWidth = 22; g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px + 70, y0 + h * .5, top[0], top[1]); g.stroke();
    g.strokeStyle = '#7a5434'; g.lineWidth = 14; g.stroke();
    for (let k = 0; k < 6; k++) { const a = -Math.PI + k * .6 + sw; const e = [top[0] + Math.cos(a) * 150, top[1] + Math.sin(a) * 60 + 50]; cel(g, path([top, [(top[0] + e[0]) / 2, Math.min(top[1], e[1]) - 30], e, [(top[0] + e[0]) / 2, (top[1] + e[1]) / 2 + 6]], false), { f: '#2f6a3a', l: '#14301a', lw: 2 }); }
    // two small figures far down the beach
    for (const [x, c] of [[w * .22, '#2a2030'], [w * .27, '#2a2030']]) { g.fillStyle = c; g.beginPath(); g.ellipse(x, y0 + h * .74, 7, 8, 0, 0, TAU); g.fill(); g.fillRect(x - 7, y0 + h * .755, 14, 34); }
  };
}

// ——— the plan card (goal and haul share it): stage 0 = the plan, 1 = the plan crossed out + reality ———
export function planInner(o) {
  return (g, w, h) => {
    const x0 = -w / 2 + 70, y0 = -h / 2, B = [];
    text(g, 'KẾ HOẠCH CỦA GIÁO SƯ', x0, y0 + 100, { font: font(900, 50), fill: STORY.f });
    line(g, [[x0, y0 + 126], [w / 2 - 70, y0 + 126]], PAL.paper.l, 2.4);
    text(g, 'Mục tiêu', x0, y0 + 210, { font: font(400, 46, HAND), fill: '#6b5a48' });
    hilite(g, x0 - 12, y0 + 232, 420 * 1.0, 92, o.hi1 || 0, PAL.accent.f, 2);
    text(g, '2,4 tỷ €', x0, y0 + 304, { font: font(900, 86) });
    text(g, 'toàn tờ 50 € · trong 11 ngày', x0, y0 + 376, { font: font(400, 46, HAND), fill: '#4a3a30' });
    if (o.cross > 0) { const e = x0 - 10 + 560 * ease.out(o.cross); line(g, [[x0 - 10, y0 + 278], [e, y0 + 270 - (e - x0) * .02]], STORY.f, 9); }
    if (o.real > 0) {
      g.globalAlpha = clamp01(o.real * 2);
      text(g, 'Thực tế', x0, y0 + 470, { font: font(400, 46, HAND), fill: '#6b5a48' });
      hilite(g, x0 - 12, y0 + 494, 560, 92, o.hi2 || 0, PAL.accent.f, 5);
      text(g, '984 triệu €', x0, y0 + 566, { font: font(900, 86) });
      g.globalAlpha = 1;
    }
    if (o.icons) for (let i = 0; i < 5; i++) note(g, w / 2 - 220 + i * 18, y0 + 270 - i * 20, 150, -.2 + i * .06);
  };
}
// the rules card: rows appear (rows 0..4), row 3 / 4 can be broken
export const RULES = ['Không tên thật', 'Không hỏi chuyện riêng', 'Không yêu đương', 'Không đổ một giọt máu'];
export function rulesInner(o) {
  return (g, w, h) => {
    const x0 = -w / 2 + 60, y0 = -h / 2;
    text(g, '4 LUẬT CỦA GIÁO SƯ', x0, y0 + 92, { font: font(900, 46), fill: STORY.f });
    line(g, [[x0, y0 + 116], [w / 2 - 60, y0 + 116]], PAL.paper.l, 2.4);
    RULES.forEach((r, i) => {
      const p = o.rows?.[i] ?? 1; if (p <= 0) return;
      const y = y0 + 196 + i * 92, broken = o.broken?.[i] || 0;
      g.save(); g.globalAlpha = clamp01(p * 2); g.translate((1 - ease.out(p)) * -40, 0);
      if (o.hi === i) hilite(g, x0 + 50, y - 50, 560, 66, o.hiP || 0, PAL.accent.f, i + 1);
      text(g, (i + 1) + '.', x0, y, { font: font(900, 46), fill: STORY.f });
      text(g, r, x0 + 56, y, { font: font(800, 46), fill: broken > 0 ? mix(INK, '#9a9196', broken * .7) : INK });
      if (broken > 0) line(g, [[x0 + 50, y - 16], [x0 + 50 + 600 * ease.out(broken), y - 20]], STORY.f, 7);
      g.restore();
    });
  };
}
