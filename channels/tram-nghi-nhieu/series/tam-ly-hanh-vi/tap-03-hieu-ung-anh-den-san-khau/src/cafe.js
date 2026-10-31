// The café: the familiar coffee shop of "Kẻ Nghĩ Nhiều" — the set of this episode only.
// Same line language as the channel's sets: flat fills, one hard shadow, a dark line, no gradients on objects.
import { cel, path, poly, ellP, line, limb, mix, rgba, TAU, W, H, rect } from '../../../../rig/cel.js';
import { PAL } from '../../../../rig/character.js';
import { text, font } from '../../../../rig/broll.js';

// ——— the room: the wall, the window, the counter, the lamps ———
export function cafeBack(g, t, o = {}) {
  g.fillStyle = '#1A1F30'; g.fillRect(-200, -200, W + 400, H + 400);
  // the floor
  cel(g, rect(-200, 880, W + 200, H + 200), { f: '#232838', s: '#1A1E2C', l: '#12131A', lw: 3 });

  // the door on the left: glass, the street behind it, a small bell
  cel(g, rect(60, 250, 330, 880), { f: '#141A2A', s: '#0F1420', so: [-8, 0], l: '#2E3448', lw: 3.4 });
  g.save(); g.beginPath(); g.rect(72, 262, 318, 868); g.clip();
  for (let i = 0; i < 46; i++) {
    const a = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 78.233) * 12345.678) % 1;
    g.fillStyle = rgba(i % 3 ? PAL.hoodie.h : PAL.cyan.h, .22 + b * .4);
    g.fillRect(90 + a * 210, 300 + b * 480, 4, 4);
  }
  g.fillStyle = '#1B2138'; g.fillRect(72, 700, 318, 180);
  g.restore();
  line(g, [[195, 262], [195, 868]], '#2E3448', 5);
  cel(g, ellP(300, 600, 9, 9), { f: '#8A6A3A', s: '#6A5028', l: PAL.ink, lw: 2 });

  // the window on the right: the street, the lights, the reflections
  const wx = 1440, wy = 150, ww = 420, wh = 470;
  cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#141A2A', s: '#0F1420', l: '#2E3448', lw: 3.4 });
  g.save(); g.beginPath(); g.rect(wx + 7, wy + 7, ww - 14, wh - 14); g.clip();
  for (let i = 0; i < 60; i++) {
    const a = Math.abs(Math.sin(i * 45.13) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 91.7) * 12345.678) % 1;
    g.fillStyle = rgba(i % 3 ? PAL.hoodie.h : PAL.cyan.h, .2 + b * .45);
    g.fillRect(wx + 20 + a * (ww - 40), wy + 40 + b * (wh - 120), 4, 4);
  }
  g.fillStyle = '#1B2138'; g.fillRect(wx, wy + wh - 130, ww, 130);
  for (let i = 0; i < 5; i++) { const bw = 70 + (i % 3) * 26; g.fillStyle = i % 2 ? '#171C2E' : '#1E2440'; g.fillRect(wx + i * 88, wy + wh - 130 - (i % 3) * 36, bw, 170); }
  g.restore();
  line(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#2E3448', 5);
  // the reflection of the lamps on the glass
  g.fillStyle = 'rgba(255,217,118,.06)';
  g.beginPath(); g.moveTo(wx + 120, wy); g.lineTo(wx + 190, wy); g.lineTo(wx + 250, wy + wh); g.lineTo(wx + 60, wy + wh); g.closePath(); g.fill();

  // the counter on the right, with the espresso machine and the cups
  cel(g, rect(1180, 620, W + 120, 880), { f: '#3B2A1C', s: '#2A1D13', so: [0, 10], l: '#171009', lw: 3 });
  cel(g, rect(1180, 596, W + 120, 640), { f: '#4A3524', s: '#33241A', l: '#171009', lw: 3 });
  cel(g, rect(1240, 430, 1420, 596), { f: '#33394E', s: '#222736', so: [-6, -6], l: PAL.ink, lw: 2.6 });
  cel(g, rect(1256, 452, 1404, 520), { f: '#1B2030', l: '#12131A', lw: 2 });
  line(g, [[1300, 520], [1300, 560]], '#5A6488', 8);
  line(g, [[1360, 520], [1360, 560]], '#5A6488', 8);
  for (let i = 0; i < 4; i++) cel(g, ellP(1470 + (i % 2) * 62, 560 - Math.floor(i / 2) * 34, 24, 9), { f: '#D8D4CC', s: '#A8A49C', l: PAL.ink, lw: 2 });

  // the chalkboard menu
  cel(g, rect(690, 140, 1080, 420), { f: '#1E2A2C', s: '#162022', so: [-10, -8], l: '#12131A', lw: 3.4 });
  cel(g, rect(706, 156, 1064, 404), { f: 'none', l: '#3A5A58', lw: 2 });
  text(g, 'HÔM NAY', 730, 204, { font: font(400, 40, 'Patrick Hand'), fill: '#C8D8D2' });
  const MENU = ['cà phê sữa đá', 'bạc xỉu', 'trà sen', 'bánh mì que'];
  MENU.forEach((m, i) => text(g, m, 730, 268 + i * 44, { font: font(400, 38, 'Patrick Hand'), fill: '#9FB5B2' }));

  // the pendant lamps and their warm pools
  const LAMPS = o.lamps || [[330, 250], [1200, 210], [1680, 250]];
  for (const [lx, ly] of LAMPS) {
    line(g, [[lx, 0], [lx, ly - 40]], '#2E3448', 5);
    cel(g, poly([[lx - 56, ly], [lx + 56, ly], [lx + 26, ly - 44], [lx - 26, ly - 44]]), { f: '#33394E', s: '#222736', so: [0, -6], l: PAL.ink, lw: 2.6 });
    cel(g, ellP(lx, ly + 2, 44, 12), { f: 'rgba(255,217,118,.85)', l: PAL.ink, lw: 2 });
    const grd = g.createRadialGradient(lx, ly, 10, lx, ly, 520);
    grd.addColorStop(0, 'rgba(255,183,3,.10)'); grd.addColorStop(1, 'rgba(255,183,3,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(lx, ly, 520, 0, TAU); g.fill();
  }

  // a plant in the corner
  cel(g, poly([[1180, 880], [1188, 780], [1290, 780], [1298, 880]]), { f: '#4A3524', s: '#33241A', l: '#171009', lw: 3 });
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * .38, len = 150 + (i % 3) * 34;
    const ex = 1239 + Math.cos(a) * len, ey = 780 + Math.sin(a) * len;
    cel(g, limb([1239, 790], [ex, ey], 16, 8), { f: i % 2 ? '#2A463C' : '#233A32', s: '#18271F', l: '#0E1A14', lw: 2.6 });
  }
}

// ——— the round table, the cup, the napkin ———
export function cafeFront(g, t, o = {}) {
  const cx = o.x === undefined ? 960 : o.x, cy = o.y === undefined ? 905 : o.y, rx = o.rx || 430, ry = o.ry || 88;
  cel(g, ellP(cx, cy + 30, rx, ry), { f: '#241A11', s: '#1A1209', so: [0, 12], l: '#171009', lw: 3 });
  cel(g, ellP(cx, cy, rx, ry), { f: '#4A3524', s: '#33241A', l: '#171009', lw: 3 });
  cel(g, ellP(cx, cy - 6, rx - 34, ry - 12), { f: '#563E2B', l: '#33241A', lw: 2 });
  // the cup and its steam
  const mx = cx + 150, my = cy - 26;
  cel(g, ellP(mx, my + 4, 62, 20), { f: '#E4E0D6', s: '#B0ACA2', l: PAL.ink, lw: 2.4 });
  cel(g, poly([[mx - 34, my - 76], [mx + 34, my - 76], [mx + 24, my - 2], [mx - 24, my - 2]]), { f: '#D8D4CC', s: '#A8A49C', so: [8, 0], l: PAL.ink, lw: 2.6 });
  const hd = new Path2D(); hd.arc(mx + 40, my - 42, 18, -1.3, 1.3); g.strokeStyle = PAL.ink; g.lineWidth = 14; g.stroke(hd); g.strokeStyle = '#E8E4DC'; g.lineWidth = 8; g.stroke(hd);
  for (let i = 0; i < 3; i++) {
    const k = (t * .32 + i / 3) % 1;
    g.strokeStyle = rgba('#FFFFFF', .16 * (1 - k)); g.lineWidth = 4; g.beginPath();
    g.moveTo(mx - 16 + i * 16, my - 104 - k * 62);
    g.bezierCurveTo(mx - 26 + i * 16, my - 124 - k * 62, mx - 6 + i * 16, my - 138 - k * 62, mx - 16 + i * 16, my - 158 - k * 62); g.stroke();
  }
  // the coffee ring on the table
  g.strokeStyle = 'rgba(60,38,20,.35)'; g.lineWidth = 5; g.beginPath(); g.ellipse(cx - 180, cy + 10, 46, 15, .2, 0, TAU); g.stroke();
}

// ——— a patron: a plain figure whose head can turn towards a point ———
export function patron(g, x, y, s = 1, col = '#3A4260', o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const bob = Math.sin((o.ph || 0) * TAU) * 2.5;
  const hair = o.hair || '#2A3145';
  // the legs
  for (const sd of [-1, 1]) cel(g, limb([sd * 28, -40], [sd * 28, -392], 44, 38), { f: '#333A4E', s: '#232838', so: [-6, 0], l: PAL.ink, lw: 3 });
  // the body
  cel(g, poly([[-92, -390], [-106, -560], [-100, -700], [100, -700], [106, -560], [92, -390]]), { f: col, s: mix(col, '#12131A', .32), so: [-10, -6], l: PAL.ink, lw: 3 });
  // the arms: one holds a cup, one holds a phone
  const armCol = { f: col, s: mix(col, '#12131A', .32), so: [-6, -4], l: PAL.ink, lw: 3 };
  if (o.cup) {
    cel(g, limb([-92, -650], [-70, -508], 28, 22), armCol);
    cel(g, rect(-92, -512, -48, -474), { f: '#D8D4CC', s: '#A8A49C', so: [4, 4], l: PAL.ink, lw: 2.2 });
  } else cel(g, limb([-92, -650], [-116, -470], 28, 24), armCol);
  if (o.phone) {
    cel(g, limb([92, -650], [88, -512], 28, 22), armCol);
    cel(g, rect(70, -516, 104, -470), { f: '#0E1017', s: '#1B1F2C', l: '#3A4260', lw: 2.4 });
    cel(g, rect(74, -512, 100, -474), { f: 'rgba(155,241,255,.6)', l: PAL.ink, lw: 1.6 });
  } else cel(g, limb([92, -650], [116, -470], 28, 24), armCol);
  // the head: it turns towards the point it is looking at
  const hy = -770 + bob;
  const look = o.look ? Math.atan2(o.look[1] - (y + hy * s), o.look[0] - x) : 0;
  const turn = Math.max(-.55, Math.min(.55, look));
  g.save(); g.translate(0, hy); g.rotate(turn); g.translate(0, -hy);
  cel(g, ellP(0, hy, 54, 60), { f: PAL.skin.f, s: PAL.skin.s, so: [-10, -7], l: PAL.ink, lw: 3 });
  // the hair: a cap that sits on the head, with a little at the sides
  cel(g, ellP(0, hy - 40, 57, 34), { f: hair, s: mix(hair, '#12131A', .3), so: [-6, -4], l: PAL.ink, lw: 3 });
  cel(g, ellP(-50, hy - 10, 12, 26), { f: hair, s: mix(hair, '#12131A', .3), l: PAL.ink, lw: 3 });
  cel(g, ellP(50, hy - 10, 12, 26), { f: hair, s: mix(hair, '#12131A', .3), l: PAL.ink, lw: 3 });
  for (const sx of [-1, 1]) { cel(g, ellP(sx * 21, hy + 6, 6, 8), { f: PAL.ink }); line(g, [[sx * 21 - 12, hy - 14], [sx * 21 + 12, hy - 17]], PAL.ink, 5); }
  line(g, [[-10, hy + 30], [10, hy + 30]], PAL.ink, 4);
  g.restore();
  g.restore();
}

// ——— the spotlight: a cone of light over one person ———
export function spotlight(g, x, y, w, h, p = 1, col = '255,217,118') {
  if (p <= 0) return;
  g.save(); g.globalAlpha = .16 * p;
  g.fillStyle = `rgba(${col},1)`;
  g.beginPath();
  g.moveTo(x - 46, 0); g.lineTo(x + 46, 0); g.lineTo(x + w, y + h); g.lineTo(x - w, y + h);
  g.closePath(); g.fill();
  g.globalAlpha = .13 * p;
  g.fillStyle = `rgba(${col},1)`;
  g.beginPath(); g.ellipse(x, y + h, w * .92, 44, 0, 0, TAU); g.fill();
  g.restore();
}
