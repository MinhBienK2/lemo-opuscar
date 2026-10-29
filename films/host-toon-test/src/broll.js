// B-roll kit in the host's own line language: paper ground, the study set, cards, highlighter, stamps, the pop-in circle.
// Everything is flat cel: one fill, one hard shadow, a coloured line (cel.js), never gradients on objects.
import { cel, path, poly, ellP, line, limb, mix, rgba, LWK, TAU, W, H, canvas } from './cel.js';
import { PAL } from './host.js';

export const INK = '#2a1f2a', CREAM = '#f4ede2';
export const STORY = { f: '#d8332f', s: '#a01e22', h: '#ff7a64', l: '#4e0c10' };   // the topic's story colour (per film)
export const ease = {
  out: t => 1 - Math.pow(1 - clamp01(t), 3),
  inOut: t => { t = clamp01(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
  back: t => { t = clamp01(t); const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
};
export function clamp01(t) { return Math.max(0, Math.min(1, t)); }
export const seg = (t, a, b) => clamp01((t - a) / (b - a));

// paper grain, made once
let GRAIN = null;
function grain() {
  if (GRAIN) return GRAIN;
  const [c, x] = canvas(512, 512), d = x.createImageData(512, 512);
  let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 10; }
  x.putImageData(d, 0, 0); GRAIN = c; return c;
}
export function paper(g, col = CREAM) {
  g.fillStyle = col; g.fillRect(-200, -200, W + 400, H + 400);
  const p = g.createPattern(grain(), 'repeat'); g.fillStyle = p; g.fillRect(-200, -200, W + 400, H + 400);
}

// text helpers (Be Vietnam Pro for type, Patrick Hand for handwriting)
export function font(w, px, fam = 'Be Vietnam Pro') { return `${w} ${px}px "${fam}"`; }
// REG.list, when set (by a page's TEXTS(t)), collects the screen box of every text() drawn, for the reading-time check
export const REG = { list: null, id: '' };
export function reg(g, s, x0, y0, x1, y1) {
  if (!REG.list) return;
  const m = g.getTransform(), P = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
  REG.list.push({ id: REG.id + ':' + s, text: s, x0: Math.min(...P.map(p => p[0])), y0: Math.min(...P.map(p => p[1])), x1: Math.max(...P.map(p => p[0])), y1: Math.max(...P.map(p => p[1])) });
}
export function text(g, s, x, y, o = {}) {
  g.font = o.font || font(800, 48); g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'alphabetic';
  if (REG.list && !o.noreg) {
    const w = g.measureText(s).width, px = parseFloat(/(\d+(\.\d+)?)px/.exec(g.font)[1]), x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    reg(g, s, x0, y - px * .8, x0 + w, y + px * .25);
  }
  if (o.stroke) { g.lineJoin = 'round'; g.strokeStyle = o.stroke; g.lineWidth = o.sw || 8; g.strokeText(s, x, y); }
  g.fillStyle = o.fill || INK; g.fillText(s, x, y);
  return g.measureText(s).width;
}

// highlighter swipe behind a word: p 0..1 draws it left → right, slightly uneven like a real marker
export function hilite(g, x, y, w, h, p, col = PAL.accent.f, seed = 1) {
  if (p <= 0) return;
  const e = x + w * ease.out(p), wob = k => Math.sin(seed * 9.1 + k * 2.3) * h * .06;
  const top = [], bot = [];
  for (let k = 0; k <= 8; k++) { const xx = x + (e - x) * k / 8; top.push([xx, y + wob(k) + (k === 0 ? h * .1 : 0)]); bot.push([xx, y + h + wob(k + 4) - (k === 0 ? h * .08 : 0)]); }
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = col;
  g.fill(path(top.concat(bot.reverse()), true)); g.restore();
}

// a paper card / photo with tape or a pin, cel shadow under it
export function card(g, o, inner) {
  const { x, y, w, h, rot = 0, f = PAL.paper.f, l = PAL.paper.l, tape = true, pin = false, lift = 0 } = o;
  g.save(); g.translate(x, y); g.rotate(rot);
  g.fillStyle = rgba(INK, .16 + lift * .08); g.fillRect(-w / 2 + 8 + lift * 6, -h / 2 + 10 + lift * 10, w, h);
  cel(g, poly([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]), { f, s: mix(f, '#b9a88a', .45), sh: [poly([[-w / 2, h / 2 - 10], [w / 2, h / 2 - 10], [w / 2, h / 2], [-w / 2, h / 2]])], l, lw: 2.4 });
  if (inner) { g.save(); g.beginPath(); g.rect(-w / 2, -h / 2, w, h); g.clip(); inner(g, w, h); g.restore(); }
  if (tape) { g.save(); g.translate(0, -h / 2); g.rotate(-.05); g.fillStyle = 'rgba(255,240,190,.78)'; g.fillRect(-46, -16, 92, 32); g.strokeStyle = 'rgba(160,130,70,.5)'; g.lineWidth = 1.5; g.strokeRect(-46, -16, 92, 32); g.restore(); }
  if (pin) { cel(g, ellP(0, -h / 2 + 16, 11, 11), { f: STORY.f, s: STORY.s, so: [-3, -3], l: STORY.l, lw: 2 }); g.fillStyle = '#fff'; g.beginPath(); g.arc(-3, -h / 2 + 12, 3, 0, TAU); g.fill(); }
  g.restore();
}

// rubber stamp: rotated box text in the story colour, slightly broken ink
export function stamp(g, s, x, y, o = {}) {
  const { rot = -.12, px = 54, col = STORY.f, p = 1 } = o;
  if (p <= 0) return;
  const k = 1 + (1 - ease.out(p)) * .6;
  // drawn on its own canvas so the worn-ink gaps only cut the stamp
  const m = document.createElement('canvas').getContext('2d'); m.font = font(900, px);
  const w = m.measureText(s).width, cw = Math.ceil(w + 64), ch = Math.ceil(px * 1.6);
  m.canvas.width = cw; m.canvas.height = ch;
  m.strokeStyle = col; m.lineWidth = 6; m.strokeRect(10, 6, cw - 20, ch - 12);
  m.font = font(900, px); m.fillStyle = col; m.textAlign = 'center'; m.textBaseline = 'middle'; m.fillText(s, cw / 2, ch / 2 + px * .04);
  m.globalCompositeOperation = 'destination-out'; m.fillStyle = 'rgba(0,0,0,.55)';
  for (let i = 0; i < 46; i++) { const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1; m.fillRect(a * cw, b * ch, 5 + (i % 3) * 5, 3); }
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k); g.globalAlpha = Math.min(1, p * 3); g.globalCompositeOperation = 'multiply';
  if (p >= 1) reg(g, s, -cw / 2, -ch / 2, cw / 2, ch / 2);
  g.drawImage(m.canvas, -cw / 2, -ch / 2); g.restore();
}

// the pop-in circle: host inside a ring in the corner over b-roll. p 0..1 (spring), draw(g, r) paints the inside
export function pip(g, cx, cy, r, p, draw, ring = PAL.accent) {
  if (p <= 0) return;
  const k = ease.back(p);
  g.save(); g.translate(cx, cy); g.scale(k, k);
  g.fillStyle = rgba(INK, .22); g.beginPath(); g.arc(8, 12, r, 0, TAU); g.fill();
  g.save(); g.beginPath(); g.arc(0, 0, r, 0, TAU); g.clip(); draw(g, r); g.restore();
  g.lineWidth = 12; g.strokeStyle = ring.f; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.stroke();
  g.lineWidth = 3; g.strokeStyle = ring.l; g.beginPath(); g.arc(0, 0, r + 6, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, r - 6, 0, TAU); g.stroke();
  g.restore();
}

// speed lines / focus lines for the reaction close-up (screen-space)
export function focusLines(g, cx, cy, t, col = INK, n = 64, r0 = 380) {
  g.save(); g.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const s = Math.sin(i * 91.7 + Math.floor(t * 12) * 3.1) * .5 + .5, a = i / n * TAU + s * .05, w = .006 + s * .01;
    const r1 = r0 + s * 160, r2 = 1500;
    g.beginPath(); g.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    g.lineTo(cx + Math.cos(a - w) * r2, cy + Math.sin(a - w) * r2); g.lineTo(cx + Math.cos(a + w) * r2, cy + Math.sin(a + w) * r2); g.fill();
  }
  g.restore();
}

// subtitles: white Be Vietnam Pro 700 with an ink outline, bottom centre, at most two lines
export function subtitle(g, s, a = 1) {
  if (!s || a <= 0) return;
  g.save(); g.globalAlpha = a; g.font = font(700, 44); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  const lines = wrap(g, s, 1400);
  lines.forEach((ln, i) => {
    const y = H - 70 - (lines.length - 1 - i) * 58;
    g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = 9; g.strokeText(ln, W / 2, y);
    g.fillStyle = '#fffaf2'; g.fillText(ln, W / 2, y);
  });
  g.restore();
}
export function wrap(g, s, maxW) {
  const words = s.split(' '), out = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur);
  return out;
}

// ——— the study: the host's home set (talking-head mode) ———
// cam: { x, y, z } shifts layers with parallax; the host is drawn by the caller between `back` and `front`
export function studyBack(g, t, cam = { x: 0, y: 0 }) {
  const wall = '#e9dcc8', wallS = '#dccab0';
  g.fillStyle = wall; g.fillRect(-200, -200, W + 400, H + 400);
  const px = (k, f) => { g.save(); g.translate(-cam.x * k, -cam.y * k); f(); g.restore(); };
  px(.3, () => {
    // wainscot + a big arched window with soft light
    g.fillStyle = wallS; g.fillRect(-200, 760, W + 400, 400); line(g, [[-200, 760], [W + 200, 760]], '#b59c7c', 3);
    for (let x = -120; x < W + 200; x += 180) line(g, [[x, 790], [x, 1100]], '#c6af8f', 2);
    const wx = 300, wy = 110, ww = 420, wh = 560;
    const arch = new Path2D(); arch.moveTo(wx, wy + ww / 2); arch.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0); arch.lineTo(wx + ww, wy + wh); arch.lineTo(wx, wy + wh); arch.closePath();
    cel(g, arch, { f: '#cfe6e4', s: '#b6d4d6', sh: [poly([[wx, wy + wh - 120], [wx + ww, wy + wh - 260], [wx + ww, wy + wh], [wx, wy + wh]])], l: '#7a6248', lw: 5 });
    g.save(); g.clip(arch); g.fillStyle = 'rgba(255,255,255,.35)';
    for (const k of [0, 1]) { g.beginPath(); g.moveTo(wx + 60 + k * 120, wy); g.lineTo(wx + 140 + k * 120, wy); g.lineTo(wx + 20 + k * 120, wy + wh); g.lineTo(wx - 60 + k * 120, wy + wh); g.fill(); }
    g.restore();
    line(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#7a6248', 6); line(g, [[wx, wy + wh * .55], [wx + ww, wy + wh * .55]], '#7a6248', 6);
    cel(g, poly([[wx - 24, wy + wh], [wx + ww + 24, wy + wh], [wx + ww + 14, wy + wh + 26], [wx - 14, wy + wh + 26]]), { f: '#c98a52', s: '#9a5f30', so: [0, -8], l: '#4e2c12', lw: 2.6 });
    // light patch on the wall
    g.fillStyle = 'rgba(255,248,225,.45)'; g.beginPath(); g.moveTo(wx + ww + 60, wy + 260); g.lineTo(wx + ww + 300, wy + 300); g.lineTo(wx + ww + 360, 760); g.lineTo(wx + ww + 80, 760); g.fill();
  });
  px(.55, () => {
    // bookshelf on the right
    const sx = 1340, sy = 120, sw = 520, sh = 700;
    cel(g, poly([[sx, sy], [sx + sw, sy], [sx + sw, sy + sh], [sx, sy + sh]]), { f: '#8a5a36', s: '#6a4024', so: [-14, 0], l: '#3a2010', lw: 3 });
    const BOOKS = ['#2f6f8c', '#d8332f', '#e0b14a', '#2f8088', '#6a4c7a', '#c9a36e', '#3b3448', '#e07a4a', '#4a7a50'];
    for (let r = 0; r < 4; r++) {
      const by = sy + 30 + r * 170, bh = 130;
      cel(g, poly([[sx + 20, by], [sx + sw - 20, by], [sx + sw - 20, by + bh + 8], [sx + 20, by + bh + 8]]), { f: '#5a3820', l: '#3a2010', lw: 2 });
      let x = sx + 28; let i = r * 3;
      while (x < sx + sw - 60) {
        const w = 22 + ((i * 37) % 4) * 7, h = bh - ((i * 53) % 5) * 9, c = BOOKS[i % BOOKS.length], tilt = (i % 11 === 5) ? .18 : 0;
        if (r === 1 && i % 7 === 3) { x += 46; i++; continue; }
        g.save(); g.translate(x + w / 2, by + bh + 8); g.rotate(tilt);
        cel(g, poly([[-w / 2, -h], [w / 2, -h], [w / 2, 0], [-w / 2, 0]]), { f: c, s: mix(c, '#2a1030', .3), so: [-5, 0], l: mix(c, '#1a0c18', .7), lw: 2 });
        line(g, [[-w / 2 + 4, -h + 16], [w / 2 - 4, -h + 16]], mix(c, '#fff', .45), 2);
        g.restore();
        x += w + 3 + (tilt ? 10 : 0); i++;
      }
      cel(g, poly([[sx + 10, by + bh + 8], [sx + sw - 10, by + bh + 8], [sx + sw - 10, by + bh + 26], [sx + 10, by + bh + 26]]), { f: '#a8714a', s: '#8a5a36', so: [0, -6], l: '#3a2010', lw: 2.4 });
    }
    // a globe on top
    cel(g, ellP(sx + 120, sy - 56, 50, 50), { f: '#7cb8c0', s: '#4f8c96', so: [-12, -8], l: '#22484e', lw: 2.6,
      clipFn: gg => { gg.fillStyle = '#a6c46a'; gg.fill(path([[sx + 90, sy - 90], [sx + 130, sy - 96], [sx + 140, sy - 60], [sx + 110, sy - 40], [sx + 96, sy - 62]])); } });
    cel(g, poly([[sx + 100, sy - 4], [sx + 140, sy - 4], [sx + 130, sy - 14], [sx + 110, sy - 14]]), { f: '#e0b14a', l: '#5a3c0a', lw: 2 });
  });
}
export function studyFront(g, t, cam = { x: 0, y: 0 }) {
  g.save(); g.translate(-cam.x * 1.2, -cam.y * 1.2);
  // desk edge with a mug and a stack of books
  cel(g, poly([[-200, 958], [W + 200, 938], [W + 200, H + 200], [-200, H + 200]]), { f: '#b5794a', s: '#8a5a36', sh: [poly([[-200, 990], [W + 200, 970], [W + 200, H + 200], [-200, H + 200]])], l: '#3a2010', lw: 3 });
  const bx = 1560;
  [['#2f6f8c', 0, 220], ['#e0b14a', 6, 200], ['#d8332f', -4, 210]].forEach(([c, dx, w], i) => {
    const y = 944 - i * 36;
    cel(g, poly([[bx + dx, y - 34], [bx + dx + w, y - 36], [bx + dx + w, y], [bx + dx, y + 2]]), { f: c, s: mix(c, '#2a1030', .3), so: [0, -8], l: mix(c, '#1a0c18', .7), lw: 2.4 });
    cel(g, poly([[bx + dx + w - 10, y - 30], [bx + dx + w - 2, y - 31], [bx + dx + w - 2, y - 4], [bx + dx + w - 10, y - 3]]), { f: PAL.paper.f, l: mix(c, '#1a0c18', .7), lw: 1.4 });
  });
  const mx = 300, my = 950;
  cel(g, poly([[mx - 44, my - 96], [mx + 44, my - 96], [mx + 40, my], [mx - 40, my]]), { f: PAL.paper.f, s: PAL.paper.s, so: [10, 0], l: PAL.paper.l, lw: 2.6 });
  const hdl = new Path2D(); hdl.arc(mx + 52, my - 52, 22, -1.3, 1.3); g.strokeStyle = PAL.paper.l; g.lineWidth = 14; g.stroke(hdl); g.strokeStyle = PAL.paper.f; g.lineWidth = 8; g.stroke(hdl);
  cel(g, poly([[mx - 43, my - 70], [mx + 43, my - 70], [mx + 42, my - 50], [mx - 42, my - 50]]), { f: PAL.accent.f, l: PAL.accent.l, lw: 1.6 });
  for (let i = 0; i < 3; i++) { const k = (t * .4 + i / 3) % 1; g.strokeStyle = rgba('#ffffff', .6 * Math.sin(k * Math.PI)); g.lineWidth = 4; g.beginPath(); g.moveTo(mx - 14 + i * 14, my - 108 - k * 60); g.bezierCurveTo(mx - 24 + i * 14, my - 128 - k * 60, mx - 4 + i * 14, my - 140 - k * 60, mx - 14 + i * 14, my - 160 - k * 60); g.stroke(); }
  g.restore();
}
