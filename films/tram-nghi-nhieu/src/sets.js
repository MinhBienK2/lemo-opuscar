// The sets of "Trạm Nghĩ Nhiều": the night room (the desk), the sofa, the dawn street, and the small props.
// The same line language as the character: flat fills, one hard shadow, a dark line, no gradients on objects.
import { cel, path, poly, ellP, line, taper, ribbon, limb, mix, rgba, TAU, W, H, rect } from './cel.js';
import { PAL } from './character.js';
import { text, font, tag } from './broll.js';

// ——— the room: the host's desk at night ———
// cam = { x, y } shifts the layers for parallax
export function roomBack(g, t, cam = { x: 0, y: 0 }) {
  g.fillStyle = PAL.bg; g.fillRect(-200, -200, W + 400, H + 400);
  const px = (k, f) => { g.save(); g.translate(-cam.x * k, -cam.y * k); f(); g.restore(); };
  px(.25, () => {
    // the window: night, with a city full of lights
    const wx = 180, wy = 90, ww = 560, wh = 520;
    cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#151A2C', s: '#111524', l: '#2A3145', lw: 4 });
    g.save(); g.beginPath(); g.rect(wx + 6, wy + 6, ww - 12, wh - 12); g.clip();
    for (let i = 0; i < 90; i++) {   // the lights of the city
      const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1;
      const x = wx + 20 + a * (ww - 40), y = wy + 60 + b * (wh - 160);
      g.fillStyle = rgba(i % 3 ? PAL.hoodie.h : PAL.cyan.h, .25 + b * .5);
      g.fillRect(x, y, 4, 4);
    }
    g.fillStyle = '#1B2138'; g.fillRect(wx, wy + wh - 150, ww, 150);   // the skyline
    for (let i = 0; i < 8; i++) { const bw = 60 + (i % 3) * 24; g.fillStyle = i % 2 ? '#171C2E' : '#1E2440'; g.fillRect(wx + i * 72, wy + wh - 150 - (i % 4) * 40, bw, 200); }
    g.restore();
    line(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#2A3145', 5);
    line(g, [[wx, wy + wh * .45], [wx + ww, wy + wh * .45]], '#2A3145', 5);
    // the moonlight on the wall
    g.fillStyle = 'rgba(103,232,249,.05)'; g.beginPath();
    g.moveTo(wx + ww, wy + 120); g.lineTo(wx + ww + 260, wy + 200); g.lineTo(wx + ww + 320, H); g.lineTo(wx + ww - 40, H); g.closePath(); g.fill();
  });
  px(.55, () => {
    // a shelf with books, and a clock
    const sx = 1480, sy = 140, sw = 420;
    cel(g, rect(sx, sy, sx + sw, sy + 560), { f: '#1A1E2C', s: '#12141F', so: [-14, 0], l: '#2A3145', lw: 3 });
    const BOOKS = ['#3A4270', '#5A4A8A', '#4A5A80', '#6D3FD6', '#2A4A60', '#5A5A7A', '#8A6A3A'];
    for (let r = 0; r < 3; r++) {
      const by = sy + 34 + r * 178, bh = 130;
      cel(g, rect(sx + 18, by, sx + sw - 18, by + bh + 8), { f: '#232839', l: '#12141F', lw: 2 });
      let x = sx + 26, i = r * 3;
      while (x < sx + sw - 70) {
        const w = 24 + ((i * 37) % 4) * 8, h = bh - ((i * 53) % 5) * 10, c = BOOKS[i % BOOKS.length], tilt = (i % 9 === 4) ? .2 : 0;
        g.save(); g.translate(x + w / 2, by + bh + 8); g.rotate(tilt);
        cel(g, rect(-w / 2, -h, w / 2, 0), { f: c, s: mix(c, '#12131A', .35), so: [-5, 0], l: '#12131A', lw: 2 });
        line(g, [[-w / 2 + 5, -h + 18], [w / 2 - 5, -h + 18]], mix(c, '#fff', .4), 2);
        g.restore();
        x += w + 4 + (tilt ? 12 : 0); i++;
      }
      cel(g, rect(sx + 8, by + bh + 8, sx + sw - 8, by + bh + 26), { f: '#2C3245', l: '#12141F', lw: 2.4 });
    }
    // the clock on the wall: 23:40, too late
    const cx = sx + sw / 2, cy = sy - 74;
    cel(g, ellP(cx, cy, 62, 62), { f: '#1A1E2C', s: '#12141F', so: [-8, -6], l: '#2A3145', lw: 3 });
    for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(g, [[cx + Math.cos(a) * 48, cy + Math.sin(a) * 48], [cx + Math.cos(a) * 42, cy + Math.sin(a) * 42]], '#3A4260', 3); }
    const ha = -Math.PI / 2 + t * .02, ma = Math.PI * .5 - (t * .05) % TAU;
    line(g, [[cx, cy], [cx + Math.cos(ha) * 26, cy + Math.sin(ha) * 26]], PAL.cream, 5);
    line(g, [[cx, cy], [cx + Math.cos(ma) * 40, cy + Math.sin(ma) * 40]], PAL.hoodie.f, 4);
    cel(g, ellP(cx, cy, 6, 6), { f: PAL.hoodie.f, l: PAL.ink, lw: 2 });
  });
}
export function roomFront(g, t, cam = { x: 0, y: 0 }) {
  g.save(); g.translate(-cam.x * 1.2, -cam.y * 1.2);
  // the desk
  cel(g, rect(-200, 960, W + 200, H + 200), { f: '#2A2118', s: '#1C1610', so: [0, -8], l: '#0E0B08', lw: 3 });
  // the mug
  const mx = 520, my = 952;
  cel(g, rect(mx - 30, my - 66, mx + 27, my), { f: '#D8D4CC', s: '#A8A49C', so: [10, 0], l: '#12131A', lw: 2.6 });
  const hd = new Path2D(); hd.arc(mx + 36, my - 36, 16, -1.3, 1.3); g.strokeStyle = '#12131A'; g.lineWidth = 14; g.stroke(hd); g.strokeStyle = '#E8E4DC'; g.lineWidth = 8; g.stroke(hd);
  // the steam
  for (let i = 0; i < 3; i++) {
    const k = (t * .35 + i / 3) % 1;
    g.strokeStyle = rgba('#FFFFFF', .16 * (1 - k)); g.lineWidth = 5; g.beginPath();
    g.moveTo(mx - 16 + i * 16, my - 108 - k * 70);
    g.bezierCurveTo(mx - 28 + i * 16, my - 130 - k * 70, mx - 4 + i * 16, my - 145 - k * 70, mx - 16 + i * 16, my - 168 - k * 70); g.stroke();
  }
  // the desk lamp: a warm pool of light
  const lx = 900, ly = 946;
  const grd = g.createRadialGradient(lx - 60, ly - 150, 10, lx - 60, ly - 150, 560);
  grd.addColorStop(0, 'rgba(255,183,3,.17)'); grd.addColorStop(1, 'rgba(255,183,3,0)');
  g.fillStyle = grd; g.beginPath(); g.arc(lx - 60, ly - 150, 560, 0, TAU); g.fill();
  cel(g, poly([[lx - 62, ly], [lx + 62, ly], [lx + 44, ly - 26], [lx - 44, ly - 26]]), { f: '#33394E', s: '#222736', so: [0, -6], l: '#12131A', lw: 2.6 });
  line(g, [[lx - 20, ly - 26], [lx - 74, ly - 150]], '#33394E', 11);
  cel(g, poly([[lx - 168, ly - 158], [lx - 66, ly - 196], [lx - 40, ly - 132], [lx - 142, ly - 96]]),
    { f: '#33394E', s: '#222736', so: [-6, -6], l: '#12131A', lw: 2.6 });
  cel(g, poly([[lx - 158, ly - 120], [lx - 52, ly - 152], [lx - 44, ly - 134], [lx - 150, ly - 102]]), { f: rgba('#FFD976', .75), l: '#12131A', lw: 2 });
  g.restore();
}

// ——— the sofa at night: the scene where the scrolling happens ———
export function sofa(g, t) {
  g.fillStyle = '#0E0F16'; g.fillRect(-200, -200, W + 400, H + 400);
  // the window with the night behind it
  const wx = 1230, wy = 70, ww = 540, wh = 430;
  cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#151A2C', l: '#2A3145', lw: 4 });
  g.save(); g.beginPath(); g.rect(wx + 6, wy + 6, ww - 12, wh - 12); g.clip();
  for (let i = 0; i < 70; i++) {
    const a = Math.abs(Math.sin(i * 45.13) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 91.7) * 12345.678) % 1;
    g.fillStyle = rgba(i % 3 ? PAL.hoodie.h : PAL.cyan.h, .2 + b * .45); g.fillRect(wx + 20 + a * (ww - 40), wy + 40 + b * (wh - 120), 4, 4);
  }
  g.restore();
  line(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#2A3145', 5);
  // the floor
  cel(g, rect(-200, 1000, W + 200, H + 200), { f: '#171A26', s: '#101220', l: '#0A0C14', lw: 3 });
  // the sofa: a seat block, a back and two arms
  cel(g, rect(400, 740, 1500, 1010), { f: '#262B3E', s: '#1A1E2C', so: [0, -10], l: '#12131A', lw: 3.4 });
  cel(g, poly([[360, 660], [440, 596], [1460, 596], [1520, 660], [1520, 760], [360, 760]]),
    { f: '#2E3448', s: '#1A1E2C', so: [0, -8], l: '#12131A', lw: 3.4 });
  for (const x of [700, 950, 1200]) cel(g, rect(x, 600, x + 12, 736), { f: '#22273A', l: '#12131A', lw: 2 });
  cel(g, rect(330, 720, 420, 1010), { f: '#2E3448', s: '#1A1E2C', so: [-6, -6], l: '#12131A', lw: 3 });
  cel(g, rect(1480, 720, 1570, 1010), { f: '#2E3448', s: '#1A1E2C', so: [6, -6], l: '#12131A', lw: 3 });
  // a cushion on the floor
  cel(g, poly([[520, 1000], [700, 962], [860, 1000]]), { f: '#1E2333', l: '#12131A', lw: 2.6 });
}

// ——— the dawn street: soft fascination ———
export function street(g, t, camx = 0) {
  g.save(); g.translate(-camx * .3, 0);
  // the sky: flat bands, dawn
  g.fillStyle = '#1B2440'; g.fillRect(-400, -200, W + 800, 700);
  g.fillStyle = '#2B3358'; g.fillRect(-400, 380, W + 800, 140);
  g.fillStyle = '#4A4372'; g.fillRect(-400, 500, W + 800, 80);
  g.fillStyle = PAL.hoodie.f; g.fillRect(-400, 560, W + 800, 40);
  // the sun coming up
  cel(g, ellP(1450, 590, 74, 74), { f: '#FFE9A6', s: PAL.hoodie.f, so: [-10, -8], l: '#D98E00', lw: 3 });
  // the buildings, far
  for (let i = 0; i < 9; i++) {
    const x = -200 + i * 260, h = 200 + (i % 4) * 90;
    cel(g, path([[x, 620], [x + 200, 620], [x + 200, 620 - h], [x + 40, 620 - h - 40], [x, 620 - h]], true), { f: '#20263E', s: '#171C2E', l: '#12131A', lw: 2.6 });
  }
  g.restore();
  // the street and the trees, near
  cel(g, rect(-400, 900, W + 400, H + 200), { f: '#1E2130', s: '#14161F', l: '#0A0C14', lw: 3 });
  for (let k = 0; k < 6; k++) {
    const x = -100 + k * 420 - (camx * .7 % 420);
    line(g, [[x, 900], [x, 700]], '#232838', 14);
    cel(g, ellP(x, 640, 118, 96), { f: '#233A32', s: '#18271F', so: [-12, -10], l: '#0E1A14', lw: 3 });
    cel(g, ellP(x + 60, 676, 74, 58), { f: '#2A463C', s: '#18271F', so: [-8, -6], l: '#0E1A14', lw: 2.6 });
  }
  // the birds
  for (let i = 0; i < 4; i++) {
    const x = 300 + i * 240 + Math.sin(t * .3 + i) * 40, y = 180 + i * 46 + Math.sin(t * .6 + i * 2) * 14, k = Math.sin(t * 5 + i) * 8;
    line(g, [[x - 26, y + k], [x, y - 6], [x + 26, y + k]], '#4A4372', 4);
  }
}

// ——— a generic other person: a simple flat figure, drawn plainer than the host ———
export function person(g, x, y, s = 1, col = '#3A4260', o = {}) {
  // the origin is at the feet
  g.save(); g.translate(x, y); g.scale(s, s);
  const ph = o.ph || 0, bob = Math.sin(ph * TAU) * 3;
  // the legs
  for (const sd of [-1, 1]) {
    const sw = Math.sin(ph * TAU + (sd > 0 ? Math.PI : 0)) * 22;
    cel(g, limb([sd * 26, -30], [sd * 26 + sw, -390], 38, 30), { f: '#333A4E', s: '#232838', so: [-6, 0], l: PAL.ink, lw: 3 });
    cel(g, rect(sd * 26 + sw - 32, -34, sd * 26 + sw + 42, -8), { f: '#DDE1EA', s: '#A8AEC0', so: [-4, 3], l: PAL.ink, lw: 3 });
  }
  // the body: a plain hoodie, no face
  cel(g, poly([[-92, -390], [-108, -560], [-104, -700], [104, -700], [108, -560], [92, -390]]), { f: col, s: mix(col, '#12131A', .3), so: [-10, -6], l: PAL.ink, lw: 3 });
  // the arms
  cel(g, limb([-96, -660], [-118, -470], 30, 24), { f: col, s: mix(col, '#12131A', .3), so: [-6, -4], l: PAL.ink, lw: 3 });
  cel(g, limb([96, -660], [118, -470], 30, 24), { f: col, s: mix(col, '#12131A', .3), so: [-6, -4], l: PAL.ink, lw: 3 });
  // the head
  cel(g, ellP(0, -790 + bob, 58, 64), { f: PAL.skin.f, s: PAL.skin.s, so: [-10, -7], l: PAL.ink, lw: 3 });
  cel(g, ellP(0, -838 + bob, 60, 32), { f: '#2A3145', s: '#1B2130', so: [-6, -4], l: PAL.ink, lw: 3 });
  for (const sx of [-1, 1]) { cel(g, ellP(sx * 24, -798 + bob, 6.5, 8.5), { f: PAL.ink }); line(g, [[sx * 24 - 14, -822 + bob], [sx * 24 + 13, -825 + bob]], PAL.ink, 5.5); }
  line(g, [[-11, -764 + bob], [11, -764 + bob]], PAL.ink, 4);
  g.restore();
}

// ——— a phone with a feed: the scrolling column ———
export function feedColumn(g, x, y, w, h, scroll, o = {}) {
  const n = o.n || 6;
  cel(g, rect(x - w / 2, y - h / 2, x + w / 2, y + h / 2), { f: '#161925', s: '#0E1017', so: [8, 8], l: '#2A3145', lw: 3 });
  g.save(); g.beginPath(); g.rect(x - w / 2 + 4, y - h / 2 + 4, w - 8, h - 8); g.clip();
  const ch = 150;
  for (let i = 0; i < n; i++) {
    const yy = y - h / 2 + 20 + ((i * ch + scroll) % (n * ch));
    const col = ['#2B3358', '#232B3E', '#2E3448'][i % 3];
    cel(g, rect(x - w / 2 + 16, yy, x + w / 2 - 16, yy + ch - 16),
      { f: col, s: mix(col, '#12131A', .4), so: [0, 6], l: '#12131A', lw: 2 });
    // the thumbnail and the lines
    cel(g, ellP(x - w / 2 + 56, yy + 46, 28, 28), { f: PAL.hoodie.f, s: PAL.hoodie.s, l: PAL.ink, lw: 2 });
    for (let k = 0; k < 2; k++) line(g, [[x - w / 2 + 100, yy + 34 + k * 22], [x + w / 2 - 40 - (k ? 90 : 0), yy + 34 + k * 22]], '#5A6488', 8);
    line(g, [[x - w / 2 + 30, yy + 96], [x + w / 2 - 40, yy + 96]], '#39415E', 6);
  }
  g.restore();
}

// ——— a thought bubble ———
export function thought(g, x, y, r, p = 1) {
  if (p <= 0) return;
  g.save(); g.globalAlpha = p;
  cel(g, ellP(x, y, r, r * .78), { f: '#1E2333', s: '#151926', so: [-6, -5], l: '#3A4260', lw: 2.6 });
  for (let i = 0; i < 3; i++) {
    const k = 1 - i * .34, yy = y + r * .85 + i * 26;
    cel(g, ellP(x - i * 18, yy, r * .18 * k, r * .15 * k), { f: '#1E2333', s: '#151926', l: '#3A4260', lw: 2 });
  }
  g.restore();
}

// ——— a small hour block row: the waking hours ———
export function hourRow(g, x, y, w, h, p, o = {}) {
  const n = o.n || 24, hi = o.hi || 0;
  const bw = w / n;
  for (let i = 0; i < n; i++) {
    const on = i < Math.round(n * p);
    const col = on ? (i % 2 ? PAL.cyan.f : PAL.cyan.s) : '#232839';
    cel(g, rect(x + i * bw + 2, y, x + (i + 1) * bw - 2, y + h),
      { f: col, s: mix(col, '#12131A', .35), so: [0, 4], l: '#12131A', lw: 1.6 });
  }
  if (hi) {   // the marked block
    const i = Math.min(n - 1, Math.round(n * hi));
    cel(g, rect(x + i * bw - 3, y - 10, x + (i + 1) * bw + 3, y + h + 10),
      { f: 'rgba(255,183,3,0)', l: PAL.hoodie.f, lw: 4 });
  }
}
