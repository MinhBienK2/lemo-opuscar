// "Tại sao ngủ 30 phút lại tệ hơn không ngủ?" — Tập 01 của series Không gian và Tâm trạng.
//
// Board.json điều khiển hình (SKILL.md §4): mỗi shot của board là một khung hình,
// và SHOTS[shot.id] dưới đây là hàm vẽ riêng của khung đó. Nhịp (beat) của board định
// thời điểm thay đổi của đạo cụ: BD.u('tên_nhịp', T, .4) chạy 0 → 1 trong .4 giây kể từ
// đúng từ neo. Nhãn, con trỏ và biểu đồ do BD.signals() vẽ; tiếng do BD.events() đưa vào
// window.EV. Rig của kênh dùng từ kênh (không sao chép); bối cảnh của tập nằm trong ./sets.js.
import { figure, expr, blendE, PAL } from '../../../../rig/character.js';
import { cel, path, poly, ellP, line, rect, rrect, mix, rgba, canvas, W, H, TAU } from '../../../../rig/cel.js';
import { ground, panel, hilite, stamp, pip, bubble, subtitle, tag, text, font, ease, seg, clamp01, INK, CREAM, ACCENT, REG } from '../../../../rig/broll.js';
import { loadBoard } from '../../../../rig/board.js';
import { hostPip, reactClose } from '../../../../rig/host.js';
import { extra } from '../../../../rig/extras.js';
import { build } from './timeline.js';
import * as E from './sets.js';

const cv = document.getElementById('c'), G = cv.getContext('2d');
const [buf, B] = canvas(W, H);

let TL, BD, EV = [];
let T0 = 0;                      // thời điểm bắt đầu của cảnh đang vẽ
let T = 0;                       // thời gian hiện tại: đạo cụ động dùng nó (hơi thở, hơi nước)

// ——— công cụ ———
const lerp = (a, b, u) => a + (b - a) * u;
const E_ = x => typeof x === 'string' ? expr(x) : expr(x[0], x[1]);

// chớp mắt theo một nhịp ngẫu nhiên nhưng lặp lại được
const BLINKS = [];
{ let s = 17, t = 1.0; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 400) { BLINKS.push(t); if (r() < .2) BLINKS.push(t + .28); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < .16) return Math.sin(d / .16 * Math.PI); } return 0; }

const sway = T => Math.sin(T * .55) * .035;
const talkAt = T => TL.talk(T);

const SHL = [315, 235], SHR = [458, 236];
function armAt(sh, deg) {
  const a = deg * Math.PI / 180, l = Math.hypot(sh[0], sh[1]);
  return { at: [sh[0] + Math.cos(a) * l, sh[1] + Math.sin(a) * l] };
}
const ARM = {
  rest: () => [armAt(SHL, 0), armAt(SHR, 0)],
  hold: () => [armAt(SHL, -22), armAt(SHR, -22)],
  open: () => [armAt(SHL, -34), armAt(SHR, -34)],
  up: () => [armAt(SHL, -52), armAt(SHR, -52)],
  wave: () => [armAt(SHL, -18), armAt(SHR, -128)],
  point: () => [armAt(SHL, -52), armAt(SHR, -128)],
  pointR: () => [armAt(SHL, -46), armAt(SHR, -124)],
  pointUp: () => [armAt(SHL, -74), armAt(SHR, -104)],
  temple: () => [armAt(SHL, -20), armAt(SHR, -104)],
  chin: () => [armAt(SHL, -18), armAt(SHR, -96)],
  write: () => [armAt(SHL, -26), armAt(SHR, -34)],
  count: () => [armAt(SHL, -22), armAt(SHR, -40)],
  cross: () => [armAt(SHL, -74), armAt(SHR, -104)],
  push: () => [armAt(SHL, -30), armAt(SHR, -30)],
  reach: () => [armAt(SHL, -40), armAt(SHR, -40)],
  breath: () => [armAt(SHL, 0), armAt(SHR, -8)]
};
function armState(name, k = 0) {
  const f = ARM[name] || ARM.rest;
  const [l, r] = f();
  return { armL: { at: l }, armR: { at: r } };
}

// ——— đạo cụ ———
// đồng hồ số bảy đoạn: con số trên điện thoại, vẽ bằng hình chứ không phải chữ
function sevenSeg(g, x, y, str, dw, dh, col) {
  const SEG = { '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg' };
  const t = Math.max(2, dh * .13), w = dw * .66, gap = dw * .18;
  for (let i = 0; i < str.length; i++) {
    const ox = x + i * (w + gap), on = SEG[str[i]] || '';
    const R = (sx, sy, sw, sh) => { g.fillStyle = col; g.fillRect(ox + sx, y + sy, sw, sh); };
    if (on.includes('a')) R(t, 0, w - 2 * t, t);
    if (on.includes('g')) R(t, (dh - t) / 2, w - 2 * t, t);
    if (on.includes('d')) R(t, dh - t, w - 2 * t, t);
    if (on.includes('f')) R(0, t / 2, t, dh / 2 - t);
    if (on.includes('b')) R(w - t, t / 2, t, dh / 2 - t);
    if (on.includes('e')) R(0, dh / 2 + t / 2, t, dh / 2 - t);
    if (on.includes('c')) R(w - t, dh / 2 + t / 2, t, dh / 2 - t);
  }
}
// điện thoại: màn hình đếm ngược 30 phút
function phoneProp(g, x, y, k, glow = 0, txt = '') {
  g.save(); g.translate(x, y);
  if (glow > 0) {
    const grd = g.createRadialGradient(0, 0, 4, 0, 0, 190);
    grd.addColorStop(0, `rgba(155,241,255,${0.42 * glow})`);
    grd.addColorStop(1, 'rgba(155,241,255,0)');
    g.fillStyle = grd; g.beginPath(); g.arc(0, 0, 190, 0, TAU); g.fill();
  }
  cel(g, rect(-26, -46, 26, 46), { f: '#0E1017', s: '#1B1F2C', so: [-6, -6], l: '#3A4260', lw: 3 });
  cel(g, rect(-19, -38, 19, 38), { f: `rgba(155,241,255,${0.45 + 0.5 * glow})`, l: '#12131A', lw: 2 });
  sevenSeg(g, -13, -26, '30', 11, 42, '#0E1017');
  g.restore();
}
// đồng hồ treo tường
function clockProp(g, x, y, r, hour, min) {
  cel(g, ellP(x, y, r, r), { f: '#F2EFE6', s: '#D8D4C0', so: [-8, -6], l: INK, lw: 5 });
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(g, [[x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78], [x + Math.cos(a) * r * .66, y + Math.sin(a) * r * .66]], '#6B7288', 4); }
  const ha = -Math.PI / 2 + (hour % 12 + min / 60) / 12 * TAU, ma = (min / 60) * TAU;
  line(g, [[x, y], [x + Math.cos(ha) * r * .44, y + Math.sin(ha) * r * .44]], INK, 6);
  line(g, [[x, y], [x + Math.cos(ma) * r * .66, y + Math.sin(ma) * r * .66]], PAL.hoodie.f, 5);
  cel(g, ellP(x, y, 7, 7), { f: PAL.hoodie.f, l: INK, lw: 2 });
}
// tờ giấy có dòng chữ
function sheetProp(g, x, y, w, h, lines = [], rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: '#F4ECDD', s: '#DED4C0', so: [0, 6], l: INK, lw: 3 });
  lines.forEach((ln, i) => {
    const y0 = -h / 2 + 52 + i * (ln.step || 54);
    if (ln.str) text(g, ln.str, -w / 2 + 26, y0, { font: font(ln.w ?? 800, ln.px ?? 40), fill: ln.fill || INK });
    if (ln.rule) line(g, [[-w / 2 + 20, y0 + 10], [-w / 2 + w - 26, y0 + 10]], ln.rule, ln.lw || 6);
  });
  g.restore();
}
// tách cà phê
function cupProp(g, x, y, s = 1, steam = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  cel(g, rect(-34, -52, 30, 0), { f: '#D8D4CC', s: '#A8A49C', so: [9, 0], l: INK, lw: 3 });
  g.strokeStyle = INK; g.lineWidth = 11; g.beginPath(); g.arc(38, -26, 15, -1.3, 1.3); g.stroke();
  g.strokeStyle = '#E8E4DC'; g.lineWidth = 6; g.beginPath(); g.arc(38, -26, 15, -1.3, 1.3); g.stroke();
  for (let i = 0; i < 3; i++) {
    const k = (T * .35 + i / 3) % 1;
    g.strokeStyle = `rgba(255,255,255,${.16 * (1 - k) * steam})`; g.lineWidth = 5; g.beginPath();
    g.moveTo(-14 + i * 14, -56 - k * 66);
    g.bezierCurveTo(-26 + i * 14, -76 - k * 66, -2 + i * 14, -92 - k * 66, -14 + i * 14, -110 - k * 66);
    g.stroke();
  }
  g.restore();
}
// laptop trên đùi
function laptopProp(g, x, y, k = 1) {
  if (k <= 0) return;
  g.save(); g.translate(x, y); g.rotate(-.06);
  cel(g, rect(-80, -6, 80, 16), { f: '#2A3040', s: '#1F2431', so: [0, 5], l: INK, lw: 3 });
  cel(g, poly([[-70, -6], [70, -6], [54, -56], [-54, -56]]), { f: '#141926', s: '#0E1017', so: [0, 5], l: INK, lw: 3 });
  cel(g, poly([[-64, -12], [64, -12], [50, -50], [-50, -50]]), { f: 'rgba(103,232,249,.22)', l: '#39415C', lw: 2 });
  g.restore();
}
// sổ tay
function notebookProp(g, x, y, k = 1, under = 0) {
  if (k <= 0) return;
  g.save(); g.translate(x, y); g.rotate(-.08);
  cel(g, rect(-92, -58, 92, 58), { f: '#F4ECDD', s: '#DED4C0', so: [0, 6], l: INK, lw: 3 });
  line(g, [[-70, -30], [50, -30]], '#9AA2B6', 4);
  line(g, [[-70, -6], [30, -6]], '#9AA2B6', 4);
  if (under > 0) line(g, [[-70, -30], [50, -30]], PAL.red.f, 6);
  g.restore();
}
// đường sóng não
function eegTrace(g, x, y, w, h, t0, deep) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.strokeStyle = PAL.cyan.f; g.lineWidth = 4; g.beginPath();
  const N = 240;
  for (let i = 0; i <= N; i++) {
    const u = i / N, px = x + u * w, tt = t0 + u * 26;
    let v = Math.sin(tt * 7) * .06 + Math.sin(tt * 19) * .03 + Math.sin(tt * 43) * .015;
    const inDeep = u > .42 && u < .72;
    if (inDeep) {
      const k = Math.sin((u - .42) / .30 * Math.PI);
      v = v * (1 - k * .7) - k * .28 * deep;
      v += Math.sin(tt * 1.6) * .05 * k;
    }
    const py = y + h * .55 - v * h * 2.4;
    i ? g.lineTo(px, py) : g.moveTo(px, py);
  }
  g.stroke(); g.restore();
}
// lưới ô đêm
function nightGrid(g, x, y, cell, n = 14, filled = 0, hi = -1) {
  for (let i = 0; i < n; i++) {
    const bx = x + i * (cell + 8);
    const on = i < filled;
    cel(g, rect(bx, y, bx + cell, y + cell), { f: on ? '#7A3B3B' : '#2A3040', s: on ? '#5A2A2A' : '#1F2431', so: [0, 4], l: on ? PAL.red.l : '#3A4260', lw: 2 });
  }
  if (hi >= 0) {
    const bx = x + hi * (cell + 8);
    cel(g, rect(bx - 4, y - 4, bx + cell + 4, y + cell + 4), { f: 'none', l: PAL.hoodie.f, lw: 4 });
  }
}
// con dấu đỏ
function stampProp(g, x, y, k, txt = 'KHÔNG AI BIẾT') {
  if (k <= 0) return;
  const s = 1 + (1 - ease.out(k)) * .6;
  g.save(); g.translate(x, y); g.rotate(-.12); g.scale(s, s); g.globalAlpha = Math.min(.95, k * 1.5);
  g.font = font(900, 44); const w = g.measureText(txt).width + 44;
  g.strokeStyle = PAL.red.f; g.lineWidth = 6; g.strokeRect(-w / 2, -32, w, 64);
  text(g, txt, 0, 2, { font: font(900, 44), align: 'center', base: 'middle', fill: PAL.red.f });
  g.restore();
}
// nhân vật chính (người dẫn), đặt tại (hx, hy)
function host(g, hx, hy, o = {}) {
  g.save(); g.translate(hx, hy);
  figure(g, {
    t: T, blink: blink(T), talk: talkAt(T), headRoll: sway(T) * .6,
    s: o.s ?? 1, E: o.E, legs: { mode: o.leg || 'stand' },
    armL: o.armL, armR: o.armR, battery: .12
  });
  g.restore();
}
// người của câu chuyện: nhân viên phòng thí nghiệm, người tham gia, nhân viên quán
function story(g, x, y, o = {}) {
  g.save(); g.translate(x, y);
  extra(g, {
    x: 0, y: 0, s: o.s ?? 1, look: o.look || 'researcher', E: o.E || 'neutral',
    armL: o.armL || 'down', armR: o.armR || 'down', at: o.at, turn: o.turn ?? 0,
    gaze: o.gaze, sit: o.sit, t: T, blink: blink(T), talk: talkAt(T) * (o.talk ?? .5)
  });
  g.restore();
}

// ——— bảng nhịp: một dòng cho mỗi nhịp của board ———
// Trạng thái của một nhịp tại thời gian T: số thì nội suy, biểu cảm thì trộn, chuỗi thì đổi ở giữa.
const TIMES = {};
function st(scene, T) {
  const rows = CHOREO[scene];
  if (!TIMES[scene]) TIMES[scene] = rows.map(r => BD.t(r[0]));
  const ts = TIMES[scene];
  let i = 0; while (i + 1 < rows.length && ts[i + 1] <= T) i++;
  const cur = rows[i][1], prev = i ? rows[i - 1][1] : cur;
  const k = i === 0 ? 1 : clamp01((T - ts[i]) / .45);
  const e = ease.inOut(k);
  const out = {};
  for (const key in cur) {
    const b = cur[key], a = prev[key];
    if (typeof b === 'number') out[key] = (typeof a === 'number' ? lerp(a, b, e) : b);
    else out[key] = (k < .5 && a !== undefined) ? a : b;
  }
  out.E = blendE(E_(prev.E || 'neutral'), E_(cur.E || 'neutral'), e);
  out.armL = armState(cur.aL || 'rest');
  out.armR = armState(cur.aR || 'rest');
  return out;
}

const CHOREO = {
  vanphong: [
    ['vanphong_b01', { hx: 1290, hy: 520, E: 'sleepy', leg: 'sit', aL: 'rest', aR: 'rest', phone: 0, timer: 0 }],
    ['vanphong_b02', { hx: 1290, hy: 520, E: 'sleepy', leg: 'sit', aL: 'rest', aR: 'breath', phone: 0, timer: 0 }],
    ['vanphong_b03', { hx: 1290, hy: 520, E: 'sleepy', leg: 'sit', aL: 'rest', aR: 'hold', phone: .6, timer: 1 }],
    ['vanphong_b04', { hx: 1290, hy: 516, E: 'sleepy', leg: 'sit', aL: 'rest', aR: 'rest', phone: 1, timer: 1 }],
    ['vanphong_b05', { hx: 1290, hy: 540, E: 'surprised', leg: 'sit', aL: 'up', aR: 'up', phone: 1, timer: 0, alarm: 1 }],
    ['vanphong_b06', { hx: 1290, hy: 545, E: 'tired', leg: 'sit', aL: 'hold', aR: 'hold', phone: 1, timer: 0, lap: 1 }],
    ['vanphong_b07', { hx: 1290, hy: 545, E: 'tired', leg: 'sit', aL: 'rest', aR: 'temple', phone: 1, timer: 0, lap: 1 }],
    ['vanphong_b08', { hx: 1290, hy: 545, E: 'thinking', leg: 'sit', aL: 'rest', aR: 'rest', phone: 1, timer: 0, lap: 1 }],
    ['vanphong_b09', { hx: 1290, hy: 545, E: 'thinking', leg: 'sit', aL: 'rest', aR: 'pointUp', phone: 1, timer: 0, lap: 1 }],
    ['vanphong_b10', { hx: 1290, hy: 545, E: 'tired', leg: 'sit', aL: 'rest', aR: 'rest', phone: 1, timer: 0, lap: 1 }],
    ['vanphong_b11', { hx: 1290, hy: 545, E: 'thinking', leg: 'sit', aL: 'rest', aR: 'pointUp', phone: 1, timer: 0, lap: 1 }],
    ['vanphong_b12', { hx: 1290, hy: 545, E: 'skeptical', leg: 'sit', aL: 'open', aR: 'open', phone: 1, timer: 0, lap: 1 }],
  ],
  nha_ke: [
    ['nha_ke_b01', { hx: 900, hy: 520, E: 'smile', leg: 'stand', aL: 'rest', aR: 'wave' }],
    ['nha_ke_b02', { hx: 900, hy: 520, E: 'determined', leg: 'stand', aL: 'rest', aR: 'pointR' }],
    ['nha_ke_b03', { hx: 900, hy: 520, E: 'thinking', leg: 'stand', aL: 'rest', aR: 'count' }],
    ['nha_ke_b04', { hx: 900, hy: 520, E: 'neutral', leg: 'stand', aL: 'rest', aR: 'rest' }],
    ['nha_ke_b05', { hx: 900, hy: 520, E: 'thinking', leg: 'stand', aL: 'hold', aR: 'write', note: 1 }],
    ['nha_ke_b06', { hx: 900, hy: 520, E: 'determined', leg: 'stand', aL: 'hold', aR: 'write', note: 1, under: 1 }],
    ['nha_ke_b07', { hx: 900, hy: 520, E: 'determined', leg: 'stand', aL: 'rest', aR: 'pointR', note: 1, under: 1 }],
    ['nha_ke_b08', { hx: 900, hy: 520, E: 'smile', leg: 'stand', aL: 'rest', aR: 'rest', note: 1, under: 1 }],
    ['nha_ke_b09', { hx: 900, hy: 520, E: 'smile', leg: 'stand', aL: 'rest', aR: 'pointUp', note: 1, under: 1 }],
    ['nha_ke_b10', { hx: 900, hy: 520, E: 'happy', leg: 'stand', aL: 'cross', aR: 'cross', note: 1, under: 1 }],
    ['nha_ke_b11', { hx: 900, hy: 520, E: 'sad', leg: 'stand', aL: 'cross', aR: 'cross', note: 1, under: 1 }],
  ],
  phongthi: [
    ['phongthi_b01', { staff: 0, s1: 0, s2: 0, form: 0, bed1: 0, bed2: 0, bed3: 0, counter: 0 }],
    ['phongthi_b02', { staff: 1, s1: 1, s2: 0, form: 0, bed1: 0, bed2: 0, bed3: 0, counter: 0 }],
    ['phongthi_b03', { staff: 1, s1: 1, s2: 0, form: 0, bed1: 0, bed2: 0, bed3: 0, counter: 0 }],
    ['phongthi_b04', { staff: 1, s1: 1, s2: 0, form: 0, bed1: 0, bed2: 0, bed3: 0, counter: 0 }],
    ['phongthi_b05', { staff: 1, s1: 0, s2: 1, form: 1, bed1: 0, bed2: 0, bed3: 0, counter: 0 }],
    ['phongthi_b06', { staff: 1, s1: 0, s2: 1, form: 1, bed1: 0, bed2: 0, bed3: 0, counter: 0 }],
    ['phongthi_b07', { staff: 1, s1: 0, s2: 1, form: 1, bed1: 0, bed2: 0, bed3: 0, counter: 0 }],
    ['phongthi_b08', { staff: 1, s1: 0, s2: 1, form: 1, bed1: 0, bed2: 0, bed3: 0, counter: 0 }],
    ['phongthi_b09', { staff: 0, s1: 0, s2: 0, form: 1, bed1: 0, bed2: 0, bed3: 0, counter: 0, beds: 1 }],
    ['phongthi_b10', { staff: 0, s1: 0, s2: 0, form: 1, bed1: 1, bed2: 0, bed3: 0, counter: 0, beds: 1 }],
    ['phongthi_b11', { staff: 0, s1: 0, s2: 0, form: 1, bed1: 1, bed2: 1, bed3: 0, counter: 0, beds: 1 }],
    ['phongthi_b12', { staff: 0, s1: 0, s2: 0, form: 1, bed1: 1, bed2: 1, bed3: 1, counter: 0, beds: 1 }],
    ['phongthi_b13', { staff: 0, s1: 0, s2: 0, form: 1, bed1: 1, bed2: 1, bed3: 1, counter: 0, beds: 1 }],
  ],
  banhanh: [
    ['banhanh_b01', { c1: 0, c2: 0, c3: 0, belief: 0, curve: 0, arrow: 0, clock: 0, run: 0, mark35: 0, strike: 0, write: 0, circle: 0 }],
    ['banhanh_b02', { c1: 0, c2: 0, c3: 0, belief: 1, curve: 0, arrow: 0, clock: 0, run: 0, mark35: 0, strike: 0, write: 0, circle: 0 }],
    ['banhanh_b03', { c1: 0, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 0, clock: 0, run: 0, mark35: 0, strike: 0, write: 0, circle: 0 }],
    ['banhanh_b04', { c1: 0, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 0, clock: 0, run: 0, mark35: 0, strike: 0, write: 0, circle: 0 }],
    ['banhanh_b05', { c1: 0, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 0, clock: 0, run: 0, mark35: 0, strike: 0, write: 0, circle: 0 }],
    ['banhanh_b06', { c1: 0, c2: 0, c3: 1.35, curve: 0, arrow: 0, clock: 0, run: 0, mark35: 0, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b07', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 0, clock: 0, run: 0, mark35: 0, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b08', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 1, clock: 0, run: 0, mark35: 0, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b09', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 1, clock: 0, run: 0, mark35: 0, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b10', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 1, clock: 0, run: 0, mark35: 0, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b11', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 1, clock: 1, run: 0, mark35: 0, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b12', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 1, clock: 1, run: .7, mark35: 0, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b13', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b14', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 0, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b15', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b16', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 0, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b17', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 1, write: 0, circle: 0, staff: 1 }],
    ['banhanh_b18', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 1, write: 1, circle: 0, staff: 1 }],
    ['banhanh_b19', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 1, write: 1, circle: 0, staff: 1 }],
    ['banhanh_b20', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 1, write: 1, circle: 0, staff: 1 }],
    ['banhanh_b21', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 1, write: 1, circle: 1, staff: 1 }],
    ['banhanh_b22', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 1, write: 1, circle: 1, staff: 1 }],
    ['banhanh_b23', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 1, write: 1, circle: 1, staff: 1 }],
    ['banhanh_b24', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 1, write: 1, circle: 1, staff: 1 }],
    ['banhanh_b25', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 1, write: 1, circle: 1, staff: 1 }],
    ['banhanh_b26', { c1: 1, c2: 0, c3: 0, belief: 1.35, curve: 1, arrow: 1, clock: 1, run: 1, mark35: 1, strike: 1, write: 1, circle: 1, staff: 1 }],
  ],
  giacsau: [
    ['giacsau_b01', { deep: 0, line: 0, mark: 0, ruler: 0, mid: 0, shallow: 0, arrow: 0, stamp: 0 }],
    ['giacsau_b02', { deep: .8, line: 0, mark: 0, ruler: 0, mid: 0, shallow: 0, arrow: 0, stamp: 0 }],
    ['giacsau_b03', { deep: .8, line: 0, mark: 1, ruler: 0, mid: 0, shallow: 0, arrow: 0, stamp: 0 }],
    ['giacsau_b04', { deep: .8, line: 1, mark: 1, ruler: 0, mid: 0, shallow: 0, arrow: 0, stamp: 0 }],
    ['giacsau_b05', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 0, shallow: 0, arrow: 0, stamp: 0 }],
    ['giacsau_b06', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 0, shallow: 0, arrow: 0, stamp: 0 }],
    ['giacsau_b07', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: 0, arrow: 0, stamp: 0 }],
    ['giacsau_b08', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: 0, arrow: 0, stamp: 0 }],
    ['giacsau_b09', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: 0, arrow: 0, stamp: 0 }],
    ['giacsau_b10', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: .8, arrow: 0, stamp: 0 }],
    ['giacsau_b11', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: .8, arrow: 0, stamp: 0 }],
    ['giacsau_b12', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: .8, arrow: 0, stamp: 0 }],
    ['giacsau_b13', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: .8, arrow: 1, stamp: 0 }],
    ['giacsau_b14', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: .8, arrow: 1, stamp: 0 }],
    ['giacsau_b15', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: .8, arrow: 1, stamp: .6 }],
    ['giacsau_b16', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: .8, arrow: 1, stamp: 1 }],
    ['giacsau_b17', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: .8, arrow: 1, stamp: 1 }],
    ['giacsau_b18', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: .8, arrow: 1, stamp: 1 }],
    ['giacsau_b19', { deep: .8, line: 1, mark: 1, ruler: 1, mid: 1, shallow: .8, arrow: 1, stamp: 1 }],
  ],
  tudanhgia: [
    ['tudanhgia_b01', { forms3: 1, flip: 0, compare: 0, clock: 0, drop: 0, marks: 0, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b02', { forms3: 1, flip: 0, compare: 0, clock: 0, drop: 0, marks: 0, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b03', { forms3: 1, flip: 1, compare: 0, clock: 0, drop: 0, marks: 0, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b04', { forms3: 1, flip: 1, compare: 1, clock: 0, drop: 0, marks: 0, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b05', { forms3: 1, flip: 1, compare: 1, clock: 0, drop: 0, marks: 0, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b06', { forms3: 1, flip: 1, compare: 1, clock: 0, drop: 0, marks: 0, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b07', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 0, marks: 0, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b08', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: .5, marks: 0, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b09', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 1, marks: 1, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b10', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 1, marks: 1, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b11', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 1, marks: 1, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b12', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 1, marks: 1, tick: 0, strip: 0, result: 0 }],
    ['tudanhgia_b13', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 1, marks: 1, tick: 0, strip: 1, result: 0 }],
    ['tudanhgia_b14', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 1, marks: 1, tick: 0, strip: 1, result: 0 }],
    ['tudanhgia_b15', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 1, marks: 1, tick: 1, strip: 1, result: 0 }],
    ['tudanhgia_b16', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 1, marks: 1, tick: 1, strip: 1, result: 0 }],
    ['tudanhgia_b17', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 1, marks: 1, tick: 1, strip: 1, result: 0 }],
    ['tudanhgia_b18', { forms3: 1, flip: 1, compare: 1, clock: 1, drop: 1, marks: 1, tick: 1, strip: 1, result: 1 }],
  ],
  quantcafe: [
    ['quantcafe_b01', { bar: 0, dark: 0, pillow: 0, cup: 0, cupx: 0, glow: 0, strike: 0, clock: 0 }],
    ['quantcafe_b02', { bar: 0, dark: 0, pillow: 0, cup: 0, cupx: 0, glow: 0, strike: 0, clock: 0 }],
    ['quantcafe_b03', { bar: 0, dark: 0, pillow: 0, cup: 0, cupx: 0, glow: 0, strike: 0, clock: 0 }],
    ['quantcafe_b04', { bar: 0, dark: 0, pillow: 0, cup: 1, cupx: 1330, glow: 0, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b05', { bar: 0, dark: 0, pillow: 0, cup: 1, cupx: 1330, glow: .6, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b06', { bar: 0, dark: 0, pillow: 0, cup: 1, cupx: 1330, glow: 1, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b07', { bar: 0, dark: 0, pillow: 0, cup: 1, cupx: 1330, glow: 1, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b08', { bar: 0, dark: 0, pillow: 0, cup: 1, cupx: 1330, glow: 1, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b09', { bar: 0, dark: 0, pillow: 0, cup: 1, cupx: 480, glow: .3, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b10', { bar: 1, dark: 0, pillow: 0, cup: 1, cupx: 480, glow: .3, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b11', { bar: 1, dark: 1, pillow: 0, cup: 1, cupx: 480, glow: .3, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b12', { bar: 1, dark: 1, pillow: 0, cup: 1, cupx: 480, glow: .3, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b13', { bar: 1, dark: 1, pillow: 0, cup: 1, cupx: 420, glow: .3, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b14', { bar: 1, dark: 1, pillow: 0, cup: 1, cupx: 1330, glow: .3, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b15', { bar: 1, dark: 1, pillow: 1, cup: 1, cupx: 1330, glow: .3, strike: 0, clock: 0, barista: 1 }],
    ['quantcafe_b16', { bar: 1, dark: 1, pillow: 1, cup: 1, cupx: 1330, glow: .3, strike: 1, clock: 0, barista: 1 }],
    ['quantcafe_b17', { bar: 1, dark: 1, pillow: 1, cup: 1, cupx: 1330, glow: .3, strike: 1, clock: 1, barista: 1 }],
    ['quantcafe_b18', { bar: 1, dark: 1, pillow: 1, cup: 1, cupx: 1330, glow: .3, strike: 1, clock: 1, barista: 1 }],
    ['quantcafe_b19', { bar: 1, dark: 1, pillow: 1, cup: 1, cupx: 1330, glow: .3, strike: 1, clock: 1, barista: 1 }],
  ],
  chiphi: [
    ['chiphi_b01', { file: 0, page: 0, cells: 0, cell: 0, arrow: 0, cell6: 0, two: 0, strip: 0, stamp: 0 }],
    ['chiphi_b02', { file: 0, page: 0, cells: 0, cell: 0, arrow: 0, cell6: 0, two: 0, strip: 0, stamp: 0 }],
    ['chiphi_b03', { file: 0, page: 0, cells: 0, cell: 0, arrow: 0, cell6: 0, two: 0, strip: 0, stamp: 0 }],
    ['chiphi_b04', { file: 1, page: 0, cells: 0, cell: 0, arrow: 0, cell6: 0, two: 0, strip: 0, stamp: 0, staff: 1 }],
    ['chiphi_b05', { file: 1, page: 1, cells: 0, cell: 0, arrow: 0, cell6: 0, two: 0, strip: 0, stamp: 0, staff: 1 }],
    ['chiphi_b06', { file: 1, page: 1, cells: 1, cell: 0, arrow: 0, cell6: 0, two: 0, strip: 0, stamp: 0, staff: 1 }],
    ['chiphi_b07', { file: 1, page: 1, cells: 1, cell: 4, arrow: 0, cell6: 0, two: 0, strip: 0, stamp: 0, staff: 1 }],
    ['chiphi_b08', { file: 1, page: 1, cells: 1, cell: 4, arrow: 1, cell6: 0, two: 0, strip: 0, stamp: 0, staff: 1 }],
    ['chiphi_b09', { file: 1, page: 1, cells: 1, cell: 4, arrow: 1, cell6: 0, two: 0, strip: 0, stamp: 0, staff: 1 }],
    ['chiphi_b10', { file: 1, page: 1, cells: 1, cell: 4, arrow: 1, cell6: 6, two: 0, strip: 0, stamp: 0, staff: 1 }],
    ['chiphi_b11', { file: 1, page: 1, cells: 1, cell: 4, arrow: 1, cell6: 6, two: 1, strip: 0, stamp: 0, staff: 1 }],
    ['chiphi_b12', { file: 1, page: 1, cells: 1, cell: 4, arrow: 1, cell6: 6, two: 1, strip: 0, stamp: 0, staff: 1 }],
    ['chiphi_b13', { file: 1, page: 1, cells: 1, cell: 4, arrow: 1, cell6: 6, two: 1, strip: 1, stamp: 1, staff: 1 }],
    ['chiphi_b14', { file: 1, page: 1, cells: 1, cell: 4, arrow: 1, cell6: 6, two: 1, strip: 1, stamp: 1, staff: 1 }],
    ['chiphi_b15', { file: 1, page: 1, cells: 1, cell: 4, arrow: 1, cell6: 6, two: 1, strip: 1, stamp: 1, staff: 1 }],
  ],
  hanhdong: [
    ['hanhdong_b01', { phone: 0, keys: 0, down: 0, cup: 0, glow: 0, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'thinking', leg: 'stand', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b02', { phone: 1, keys: 0, down: 0, cup: 0, glow: 0, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'thinking', leg: 'stand', aL: 'hold', aR: 'count' }],
    ['hanhdong_b03', { phone: 1, keys: 0, down: 0, cup: 0, glow: 0, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'thinking', leg: 'stand', aL: 'hold', aR: 'count' }],
    ['hanhdong_b04', { phone: 1, keys: 0, down: 0, cup: 0, glow: 0, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'tired', leg: 'stand', aL: 'rest', aR: 'temple' }],
    ['hanhdong_b05', { phone: 1, keys: 0, down: 0, cup: 0, glow: 0, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'tired', leg: 'stand', aL: 'rest', aR: 'temple' }],
    ['hanhdong_b06', { phone: 1, keys: 0, down: .6, cup: 0, glow: 0, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'neutral', leg: 'stand', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b07', { phone: 1, keys: 0, down: .6, cup: 0, glow: 0, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'neutral', leg: 'stand', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b08', { phone: 1, keys: 1, down: .6, cup: 0, glow: 0, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'neutral', leg: 'stand', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b09', { phone: 1, keys: 2, down: .6, cup: 0, glow: 0, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'determined', leg: 'stand', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b10', { phone: 1, keys: 2, down: 1, cup: 1, glow: 0, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'determined', leg: 'stand', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b11', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 0, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 560, E: 'happy', leg: 'stand', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b12', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 0, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 580, E: 'thinking', leg: 'sit', aL: 'hold', aR: 'write' }],
    ['hanhdong_b13', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 0, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 580, E: 'thinking', leg: 'sit', aL: 'hold', aR: 'write' }],
    ['hanhdong_b14', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 580, E: 'determined', leg: 'sit', aL: 'hold', aR: 'write' }],
    ['hanhdong_b15', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 0, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 580, E: 'determined', leg: 'sit', aL: 'hold', aR: 'write' }],
    ['hanhdong_b16', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 0, c30: 0, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 580, E: 'determined', leg: 'sit', aL: 'hold', aR: 'hold' }],
    ['hanhdong_b17', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 580, E: 'determined', leg: 'sit', aL: 'hold', aR: 'hold' }],
    ['hanhdong_b18', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 0, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 580, E: 'determined', leg: 'sit', aL: 'hold', aR: 'hold' }],
    ['hanhdong_b19', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 0, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 580, E: 'happy', leg: 'sit', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b20', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 1, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 580, E: 'happy', leg: 'sit', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b21', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 1, blanket: 0, lamp: 1, title: 0, dark: 0, hx: 960, hy: 580, E: 'happy', leg: 'sit', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b22', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 1, blanket: 0, lamp: .8, title: 0, dark: 0, hx: 960, hy: 580, E: 'thinking', leg: 'sit', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b23', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 1, blanket: 0, lamp: .6, title: 0, dark: 0, hx: 960, hy: 580, E: 'thinking', leg: 'sit', aL: 'rest', aR: 'pointUp' }],
    ['hanhdong_b24', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 1, blanket: 0, lamp: .5, title: 0, dark: 0, hx: 960, hy: 580, E: 'sad', leg: 'sit', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b25', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 1, blanket: .6, lamp: .35, title: 0, dark: 0, hx: 960, hy: 580, E: 'sleepy', leg: 'sit', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b26', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 1, blanket: 1, lamp: .25, title: 0, dark: 0, hx: 960, hy: 580, E: 'sleepy', leg: 'sit', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b27', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 1, blanket: 1, lamp: .2, title: 1, dark: 0, hx: 960, hy: 580, E: 'sleepy', leg: 'sit', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b28', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 1, blanket: 1, lamp: .15, title: 1, dark: .22, hx: 960, hy: 580, E: 'sleepy', leg: 'sit', aL: 'rest', aR: 'rest' }],
    ['hanhdong_b29', { phone: 1, keys: 2, down: 1, cup: 1, glow: .7, note: 1, write: 1, under: 1, score: 1, cards: 1, c30: 1, c10: 1, ccafe: 1, blanket: 1, lamp: .1, title: 1, dark: .42, hx: 960, hy: 580, E: 'sleepy', leg: 'sit', aL: 'rest', aR: 'rest' }],
  ],
};

// ——— mỗi shot là một khung hình ———
// Tên khung = id của shot trong board.json. Khung 'wide' vẽ cả nơi chốn; khung 'medium',
// 'close', 'insert' vẽ phần cần thấy, theo tâm của vật (focus trong board).
const SHOTS = {
  // 1. văn phòng
  'vanphong_van_wide'(g, T, sh) {
    E.vanPhong(g, T);
    const s = st('vanphong', T);
    host(g, s.hx, s.hy, { E: s.E, leg: s.leg, armL: s.armL, armR: s.armR });
    if (s.phone > 0) phoneProp(g, lerp(1150, s.hx + 40, s.phone), lerp(790, s.hy + 120, s.phone), s.phone, s.alarm ? (0.5 + 0.5 * Math.sin(T * 18)) : s.timer * .6, s.alarm ? '' : '30:00');
    if (s.lap > 0) laptopProp(g, s.hx - 10, s.hy + 210, s.lap);
    E.vanPhong(g, T, { part: 'front' });
  },
  'vanphong_van_phone'(g, T, sh) {
    // cận cảnh: chiếc điện thoại đếm ngược trên bàn
    g.fillStyle = '#171A26'; g.fillRect(0, 0, W, H);
    cel(g, rect(240, 860, 700, 900), { f: '#3A2E22', l: INK, lw: 4 });
    cel(g, rect(268, 900, 308, 1010), { f: '#3A2E22', l: INK, lw: 4 });
    cel(g, rect(632, 900, 672, 1010), { f: '#3A2E22', l: INK, lw: 4 });
    const s = st('vanphong', T);
    g.save(); g.translate(960, 640); g.scale(4.2, 4.2); phoneProp(g, 0, 0, 1, .8); g.restore();
  },
  'vanphong_van_wake'(g, T, sh) {
    E.vanPhong(g, T);
    const s = st('vanphong', T);
    host(g, s.hx, s.hy, { E: s.E, leg: s.leg, armL: s.armL, armR: s.armR });
    if (s.phone > 0) phoneProp(g, lerp(1150, s.hx + 40, s.phone), lerp(790, s.hy + 120, s.phone), s.phone, s.alarm ? (0.5 + 0.5 * Math.sin(T * 18)) : s.timer * .6);
    E.vanPhong(g, T, { part: 'front' });
  },
  'vanphong_van_clock'(g, T, sh) {
    E.vanPhong(g, T);
    clockProp(g, 1620, 210, 78, 16, 30);
  },
  'vanphong_van_desk'(g, T, sh) {
    E.vanPhong(g, T);
    const s = st('vanphong', T);
    host(g, s.hx, s.hy, { E: s.E, leg: s.leg, armL: s.armL, armR: s.armR });
    E.vanPhong(g, T, { part: 'front' });
  },

  // 2. nhà Kẻ
  'nha_ke_ke_wide'(g, T, sh) {
    E.nhaKe(g, T);
    const s = st('nha_ke', T);
    host(g, s.hx, s.hy, { E: s.E, leg: s.leg, armL: s.armL, armR: s.armR });
    if (s.note > 0) notebookProp(g, s.hx + 40, s.hy + 220, s.note, s.under || 0);
    E.nhaKe(g, T, { part: 'front' });
  },
  'nha_ke_ke_note'(g, T, sh) {
    E.nhaKe(g, T);
    const s = st('nha_ke', T);
    notebookProp(g, 960, 660, 1, s.under || 0);
    text(g, 'tại sao ngủ 30 phút', 960, 560, { font: font(800, 46), align: 'center', fill: INK });
  },
  'nha_ke_ke_belief'(g, T, sh) {
    E.nhaKe(g, T);
    const s = st('nha_ke', T);
    host(g, s.hx, s.hy, { E: s.E, leg: s.leg, armL: s.armL, armR: s.armR });
    if (s.note > 0) notebookProp(g, s.hx + 40, s.hy + 220, s.note, s.under || 0);
    E.nhaKe(g, T, { part: 'front' });
  },
  'nha_ke_ke_close'(g, T, sh) {
    // cận mặt người dẫn: chế độ react
    reactClose(g, T, { at: sh.t0, E: 'skeptical', talk: talkAt(T) });
  },

  // 3. phòng thí nghiệm
  'phongthi_lab_wide'(g, T, sh) {
    E.phongThiNghiem(g, T);
    eegTrace(g, 1192, 142, 626, 486, T, .8);
    const s = st('phongthi', T);
    if (s.staff > 0) story(g, s.s1 ? 1240 : 1300, 900, { s: .95, look: 'researcher', armR: 'point', at: [1400, 420], turn: -.3 });
    E.phongThiNghiem(g, T, { part: 'front' });
  },
  'phongthi_lab_form'(g, T, sh) {
    // cận: tờ phiếu thí nghiệm trên tay
    g.fillStyle = '#1A1E2B'; g.fillRect(0, 0, W, H);
    const s = st('phongthi', T);
    sheetProp(g, 960, 640, 1560, 1180, [
      { str: 'PHÒNG THÍ NGHIỆM GIẤC NGỦ', px: 72, step: 190 },
      { str: '24 người tham gia', px: 62, step: 190 },
      { str: 'Đêm trước: ngủ 5 tiếng', px: 62, step: 190 },
      { str: 'Buổi chiều: làm bài ngay', px: 62, step: 190 }
    ], -.03);
    if (s.form > 0) { g.save(); g.strokeStyle = PAL.red.f; g.lineWidth = 9; g.beginPath(); g.ellipse(960, 500, 600, 66, -.03, 0, TAU); g.stroke(); g.restore(); }
  },
  'phongthi_lab_test'(g, T, sh) {
    // đèn nghiệm bật: người tham gia nằm trên giường và làm bài ngay
    E.phongThiNghiem(g, T);
    g.save(); g.globalAlpha = .42; g.fillStyle = '#EAF2FF'; g.fillRect(0, 0, W, 780); g.restore();
    story(g, 420, 700, { s: .78, look: 'participant', sit: true, E: 'tired', armL: 'down', armR: 'down', gaze: [.3, 0], turn: .12, t: T, blink: blink(T), talk: 0 });
    // vạch điện cực trên đầu người nằm
    g.save(); g.strokeStyle = PAL.cyan.f; g.lineWidth = 5;
    g.beginPath(); g.moveTo(430, 430); g.quadraticCurveTo(470, 470, 436, 512); g.stroke(); g.restore();
    E.phongThiNghiem(g, T, { part: 'front' });
  },
  'phongthi_lab_beds'(g, T, sh) {
    E.phongThiNghiem(g, T);
    const s = st('phongthi', T);
    if (s.beds > 0) {
      if (s.bed1) cel(g, rect(114, 694, 426, 916), { f: 'none', l: PAL.hoodie.f, lw: 6 });
      if (s.bed2) cel(g, rect(464, 694, 776, 916), { f: 'none', l: PAL.cyan.f, lw: 6 });
      if (s.bed3) cel(g, rect(814, 694, 1126, 916), { f: 'none', l: PAL.red.f, lw: 6 });
    }
    E.phongThiNghiem(g, T, { part: 'front' });
  },

  // 4. bảng ghim ba cột
  'banhanh_board_wide'(g, T, sh) {
    E.bangBaNhanh(g, T);
    const s = st('banhanh', T);
    drawColumns(g, s);
    if (s.staff > 0) story(g, 1180, 900, { s: .9, look: 'researcher', armR: 'point', at: [1290, 460], turn: -.2 });
  },
  'banhanh_board_r'(g, T, sh) {
    // cận: cột cao nhất Rối vẽ
    E.bangBaNhanh(g, T);
    const s = st('banhanh', T);
    drawColumns(g, s);
  },
  'banhanh_board_three'(g, T, sh) {
    E.bangBaNhanh(g, T);
    const s = st('banhanh', T);
    drawColumns(g, s);
  },
  'banhanh_board_clock'(g, T, sh) {
    // cận: chiếc đồng hồ nhỏ ở mốc 35 phút
    E.bangBaNhanh(g, T);
    const s = st('banhanh', T);
    if (s.clock > 0) {
      const cx = 1140, cy = 600;
      cel(g, ellP(cx, cy, 52, 52), { f: '#F4ECDD', s: '#DED4C0', so: [-5, -4], l: INK, lw: 4 });
      const ma = (s.run || 0) * (35 / 60) * TAU;
      line(g, [[cx, cy], [cx + Math.cos(ma) * 34, cy + Math.sin(ma) * 34]], PAL.cyan.f, 5);
      line(g, [[cx, cy], [cx + 8, cy - 22]], INK, 4);
      if (s.mark35 > 0) { g.save(); g.strokeStyle = PAL.red.f; g.lineWidth = 5; g.beginPath(); g.arc(cx, cy, 44, -1.2, .4); g.stroke(); g.restore(); }
      text(g, '35 phút', cx, cy + 84, { font: font(800, 30), align: 'center', fill: PAL.cyan.f });
    }
  },
  'banhanh_board_gap'(g, T, sh) {
    // cận: khoảng trống giữa hai cột được khoanh tròn
    E.bangBaNhanh(g, T);
    const s = st('banhanh', T);
    drawColumns(g, s);
    if (s.circle > 0) {
      g.save(); g.globalAlpha = Math.min(1, s.circle * 1.4);
      g.strokeStyle = PAL.red.f; g.lineWidth = 7; g.beginPath();
      g.ellipse(1290, 520, 100, 150, 0, 0, TAU); g.stroke(); g.restore();
    }
  },

  // 5. buồng đo
  'giacsau_eeg_wide'(g, T, sh) {
    E.giacNguSau(g, T);
    const s = st('giacsau', T);
    if (s.deep > 0) {
      g.save(); g.globalAlpha = s.deep * .9;
      cel(g, rect(574, 104 + 582 * .38, 1846, 104 + 582 * .95), { f: rgba('#8B5CF6', .5), l: PAL.violet.f, lw: 4 });
      g.restore();
    }
    eegTrace(g, 574, 104, 1272, 582, T, s.deep || .2);
  },
  'giacsau_eeg_trace'(g, T, sh) {
    // cận: đường sóng lao xuống vùng sâu
    g.fillStyle = '#121722'; g.fillRect(0, 0, W, H);
    cel(g, rect(300, 110, 1180, 620), { f: '#0A1218', l: '#2E3A4E', lw: 6 });
    const s = st('giacsau', T);
    if (s.deep > 0) {
      g.save(); g.globalAlpha = s.deep * .9;
      cel(g, rect(314, 124 + 482 * .38, 1166, 124 + 482 * .95), { f: rgba('#8B5CF6', .5), l: PAL.violet.f, lw: 4 });
      g.restore();
    }
    eegTrace(g, 314, 124, 852, 482, T, s.deep || .2);
    if (s.mark > 0) { g.save(); g.strokeStyle = PAL.violet.f; g.lineWidth = 6; g.beginPath(); g.moveTo(760, 520); g.lineTo(980, 520); g.stroke(); g.restore(); }
  },
  'giacsau_eeg_bars'(g, T, sh) {
    // bảng điện tử bên phải: hai thanh đo
    g.fillStyle = '#121722'; g.fillRect(0, 0, W, H);
    cel(g, rect(1240, 110, 1880, 680), { f: '#0C1119', s: '#080C12', so: [0, 10], l: '#2E3A4E', lw: 6 });
    text(g, 'PHÚT NGỦ SÂU', 1300, 190, { font: font(800, 36), fill: CREAM });
    const bars = [['ngủ lâu', 14.7, PAL.violet.f], ['ngủ ngắn', 0.8, PAL.cyan.f]];
    bars.forEach(([lb, v, col], i) => {
      const bx = 1330 + i * 260, bh = 380 * v / 16, by = 620 - bh;
      cel(g, rect(bx, by, bx + 170, 620), { f: col, s: mix(col, '#000', .3), so: [0, 8], l: INK, lw: 3 });
      text(g, lb, bx + 85, 672, { font: font(800, 32), align: 'center', fill: CREAM });
      text(g, v === 14.7 ? '14,7' : '0,8', bx + 85, by - 22, { font: font(900, 52), align: 'center', fill: CREAM });
    });
  },
  'giacsau_eeg_dots'(g, T, sh) {
    // mười chấm, tám chấm tô đậm
    g.fillStyle = '#121722'; g.fillRect(0, 0, W, H);
    cel(g, rect(1240, 110, 1880, 680), { f: '#0C1119', s: '#080C12', so: [0, 10], l: '#2E3A4E', lw: 6 });
    text(g, 'TỈNH DẬY KHI NGỦ SÂU', 1300, 190, { font: font(800, 32), fill: CREAM });
    for (let i = 0; i < 10; i++) {
      const cx = 1330 + (i % 5) * 110, cy = 300 + Math.floor(i / 5) * 130;
      cel(g, ellP(cx, cy, 34, 34), { f: i < 8 ? PAL.violet.f : '#5A6488', l: INK, lw: 3 });
    }
    text(g, '8 trên 10 người', 1560, 400, { font: font(900, 54), align: 'center', fill: PAL.violet.f });
  },
  'giacsau_eeg_shallow'(g, T, sh) {
    // vùng ngủ nông mở ra bên trái
    g.fillStyle = '#121722'; g.fillRect(0, 0, W, H);
    cel(g, rect(300, 110, 1180, 620), { f: '#0A1218', l: '#2E3A4E', lw: 6 });
    g.save(); g.globalAlpha = .8;
    cel(g, rect(314, 130, 900, 420), { f: rgba('#67E8F9', .12), l: PAL.cyan.f, lw: 4 });
    g.restore();
    text(g, 'giấc ngủ nông', 600, 480, { font: font(800, 40), align: 'center', fill: PAL.cyan.f });
  },
  'giacsau_eeg_stamp'(g, T, sh) {
    // con dấu đỏ trên vùng sâu
    g.fillStyle = '#121722'; g.fillRect(0, 0, W, H);
    const s = st('giacsau', T);
    cel(g, rect(300, 110, 1180, 620), { f: '#0A1218', l: '#2E3A4E', lw: 6 });
    eegTrace(g, 314, 124, 852, 482, T, .9);
    if (s.stamp > 0) stampProp(g, 1400, 430, s.stamp, 'GIẤC NGỦ SÂU');
  },

  // 6. bàn đánh giá
  'tudanhgia_desk_wide'(g, T, sh) {
    E.banDo(g, T);
    const s = st('tudanhgia', T);
    drawForms(g, s);
    E.banDo(g, T, { part: 'front' });
  },
  'tudanhgia_desk_sheets'(g, T, sh) {
    // cận: ba tờ phiếu, cả ba mang dấu tốt
    g.fillStyle = '#1A1D27'; g.fillRect(0, 0, W, H);
    cel(g, rect(0, 700, W, H), { f: '#3E4658', s: '#2A3040', so: [0, -10], l: '#141720', lw: 4 });
    const s = st('tudanhgia', T);
    for (let i = 0; i < 3; i++) {
      const x = 560 + i * 300;
      sheetProp(g, x, 560, 250, 340, [
        { str: 'TÔI THẤY', px: 26, step: 62 },
        { str: 'TỐT HƠN', px: 26, step: 62 },
        { str: '✓', px: 32, step: 62, fill: PAL.green.l }
      ], -.04 + i * .01);
    }
    if (s.flip > 0) { cel(g, rect(1060, 390, 1360, 730), { f: '#DED4C0', s: '#C7BFA9', so: [0, 5], l: INK, lw: 3 }); }
  },
  'tudanhgia_desk_clock'(g, T, sh) {
    // cận: chiếc đồng hồ đo tụt xuống dưới vạch gốc
    g.fillStyle = '#1A1D27'; g.fillRect(0, 0, W, H);
    cel(g, rect(0, 700, W, H), { f: '#3E4658', s: '#2A3040', so: [0, -10], l: '#141720', lw: 4 });
    const s = st('tudanhgia', T);
    const x = 960, y = 520;
    cel(g, rect(x - 320, y - 180, x + 320, y + 180), { f: '#0C1118', l: '#39415C', lw: 4 });
    line(g, [[x - 240, y - 30], [x + 240, y - 30]], '#39415C', 3);
    line(g, [[x - 240, y + 110], [x + 240, y + 110]], PAL.red.f, 5);
    text(g, 'trước khi ngủ', x - 120, y - 60, { font: font(700, 26), align: 'center', fill: '#8A8F6B' });
    text(g, 'sau khi dậy', x - 120, y + 160, { font: font(700, 26), align: 'center', fill: '#8A8F6B' });
    const drop = ease.out(clamp01(s.drop || 0));
    line(g, [[x, y - 110], [x + lerp(-170, 148, drop), y + lerp(84, -22, drop)]], PAL.cyan.f, 8);
  },
  'tudanhgia_desk_strip'(g, T, sh) {
    // cận: dải thang tự chấm vẫn thẳng
    g.fillStyle = '#1A1D27'; g.fillRect(0, 0, W, H);
    cel(g, rect(0, 700, W, H), { f: '#3E4658', s: '#2A3040', so: [0, -10], l: '#141720', lw: 4 });
    cel(g, rect(480, 460, 1440, 600), { f: '#F4ECDD', s: '#DED4C0', so: [0, 6], l: INK, lw: 3 });
    line(g, [[520, 530], [1400, 530]], '#8A8F6B', 6);
    text(g, 'đánh giá của bạn: phẳng lặng', 960, 660, { font: font(700, 34), align: 'center', fill: '#8A8F6B' });
  },

  // 7. quán cà phê
  'quantcafe_cafe_wide'(g, T, sh) {
    E.quanCaPhe(g, T);
    const s = st('quantcafe', T);
    drawCafe(g, s);
    E.quanCaPhe(g, T, { part: 'front' });
  },
  'quantcafe_cafe_cup'(g, T, sh) {
    // cận: tách cà phê cạnh chiếc gối
    E.quanCaPhe(g, T);
    const s = st('quantcafe', T);
    drawCafe(g, s);
  },
  'quantcafe_cafe_bar'(g, T, sh) {
    // thanh ba mươi phút đầu trên mặt quầy
    E.quanCaPhe(g, T);
    const s = st('quantcafe', T);
    drawCafe(g, s);
  },
  'quantcafe_cafe_back'(g, T, sh) {
    // tách quay lại cạnh gối, vị trí cũ bị gạch
    E.quanCaPhe(g, T);
    const s = st('quantcafe', T);
    drawCafe(g, s);
  },

  // 8. hồ sơ
  'chiphi_file_wide'(g, T, sh) {
    E.banHoSo(g, T);
    const s = st('chiphi', T);
    drawFile(g, s);
    E.banHoSo(g, T, { part: 'front' });
  },
  'chiphi_file_open'(g, T, sh) {
    // bìa hồ sơ thiếu ngủ mở ra
    E.banHoSo(g, T);
    const s = st('chiphi', T);
    drawFile(g, s);
  },
  'chiphi_file_grid'(g, T, sh) {
    // cận: mười bốn ô đêm
    g.fillStyle = '#14161F'; g.fillRect(0, 0, W, H);
    cel(g, rect(0, 620, W, H), { f: '#332C26', s: '#241E19', so: [0, -10], l: '#0E0B08', lw: 4 });
    const s = st('chiphi', T);
    cel(g, rect(300, 120, 1620, 420), { f: '#EFE3CC', l: '#9C8158', lw: 3 });
    text(g, 'LỊCH NGỦ 14 ĐÊM', 960, 200, { font: font(800, 40), align: 'center', fill: '#5A3A22' });
    nightGrid(g, 380, 250, 74, 14, s.cells ? 14 : 0, s.cell ? s.cell - 1 : -1);
    if (s.arrow > 0) {
      g.save(); g.strokeStyle = PAL.red.f; g.lineWidth = 7;
      const x0 = 380 + (s.cell - 1) * 82 + 37, x1 = 380 + 13 * 82 + 37;
      g.beginPath(); g.moveTo(x0, 287); g.lineTo(x1, 287); g.stroke();
      g.beginPath(); g.moveTo(x1, 287); g.lineTo(x1 - 24, 271); g.lineTo(x1 - 24, 303); g.closePath(); g.fillStyle = PAL.red.f; g.fill();
      g.restore();
    }
    if (s.two > 0) for (const i of [12, 13]) {
      const bx = 380 + i * 82;
      g.save(); g.strokeStyle = PAL.violet.f; g.lineWidth = 6;
      g.beginPath(); g.ellipse(bx + 37, 287, 44, 44, 0, 0, TAU); g.stroke(); g.restore();
    }
  },
  'chiphi_file_stamp'(g, T, sh) {
    // con dấu đỏ giữa hồ sơ
    g.fillStyle = '#14161F'; g.fillRect(0, 0, W, H);
    cel(g, rect(0, 620, W, H), { f: '#332C26', s: '#241E19', so: [0, -10], l: '#0E0B08', lw: 4 });
    const s = st('chiphi', T);
    cel(g, rect(400, 260, 1520, 700), { f: '#EFE3CC', l: '#9C8158', lw: 3 });
    text(g, 'HỒ SƠ THIẾU NGỦ', 960, 340, { font: font(900, 52), align: 'center', fill: '#5A3A22' });
    if (s.stamp > 0) stampProp(g, 960, 560, s.stamp, 'KHÔNG AI BIẾT');
  },

  // 9. bàn làm việc buổi tối
  'hanhdong_desk_wide'(g, T, sh) {
    E.banLamViecToi(g, T);
    const s = st('hanhdong', T);
    drawNight(g, s);
  },
  'hanhdong_desk_alarm'(g, T, sh) {
    // cận: ô phút trên điện thoại
    g.fillStyle = '#141620'; g.fillRect(0, 0, W, H);
    cel(g, rect(0, 640, W, H), { f: '#2A2118', s: '#1C1610', so: [0, -10], l: '#0E0B08', lw: 4 });
    const s = st('hanhdong', T);
    const x = 960, y = 420;
    cel(g, rect(x - 190, y - 300, x + 190, y + 40), { f: '#0E1017', s: '#1B1F2C', so: [-8, -8], l: '#3A4260', lw: 4 });
    cel(g, rect(x - 160, y - 280, x + 160, y - 20), { f: s.down > .5 ? '#141926' : 'rgba(103,232,249,.22)', l: '#39415C', lw: 3 });
    if (s.keys > 0 && s.down < .5) {
      text(g, s.keys > 1 ? '10' : '30', x, y - 100, { font: font(900, 150), align: 'center', fill: PAL.cyan.f });
      text(g, 'phút', x, y - 40, { font: font(700, 50), align: 'center', fill: '#8A8F6B' });
    }
  },
  'hanhdong_desk_cup'(g, T, sh) {
    // cận: tách cà phê cạnh gối
    g.fillStyle = '#141620'; g.fillRect(0, 0, W, H);
    cel(g, rect(0, 660, W, H), { f: '#2A2118', s: '#1C1610', so: [0, -10], l: '#0E0B08', lw: 4 });
    const s = st('hanhdong', T);
    cupProp(g, 900, 560, 1.6, s.glow ? 1 : .4);
    cel(g, poly([[1160, 600], [1320, 530], [1480, 600], [1320, 664]]), { f: '#D8CDB4', l: INK, lw: 3 });
  },
  'hanhdong_desk_cards'(g, T, sh) {
    // ba thẻ số xếp cạnh nhau
    g.fillStyle = '#141620'; g.fillRect(0, 0, W, H);
    cel(g, rect(0, 620, W, H), { f: '#2A2118', s: '#1C1610', so: [0, -10], l: '#0E0B08', lw: 4 });
    const s = st('hanhdong', T);
    const cards = [['30 phút', PAL.red.f, s.c30], ['10 phút', PAL.hoodie.f, s.c10], ['cà phê', PAL.cyan.f, s.ccafe]];
    cards.forEach(([txt, col, on], n) => {
      const x = 560 + n * 380, y = 480;
      cel(g, rect(x - 160, y - 100, x + 160, y + 100), { f: '#F4ECDD', s: '#DED4C0', so: [0, 10], l: INK, lw: 3 });
      if (on > 0) text(g, txt, x, y + 26, { font: font(900, 56), align: 'center', fill: col });
      else { g.save(); g.globalAlpha = .3; text(g, txt, x, y + 26, { font: font(900, 56), align: 'center', fill: '#8A8F6B' }); g.restore(); }
    });
  },
  'hanhdong_desk_end'(g, T, sh) {
    E.banLamViecToi(g, T);
    const s = st('hanhdong', T);
    drawNight(g, s);
  },
};

// ——— các phần vẽ dùng chung ———
// ba cột 10 / 20 / 30 phút trên bảng ghim
function drawColumns(g, s) {
  const base = 700, x1 = 980, x2 = 1290, x3 = 1590, xb = 1760;
  if (s.belief > 0) {   // cột cao của cách hiểu phổ biến: người dẫn tự vẽ, không phải nhân vật nào
    const h = 250 * s.belief;
    cel(g, rect(xb - 40, base - h, xb + 40, base), { f: PAL.violet.f, s: mix(PAL.violet.f, '#000', .28), so: [0, 8], l: INK, lw: 3 });
    line(g, [[xb - 56, base - h - 26], [xb + 56, base - h - 26]], PAL.violet.f, 6);
  }
  if (s.c1 > 0) {
    const h = 250 * s.c1;
    cel(g, rect(x1 - 62, base - h, x1 + 62, base), { f: PAL.hoodie.f, s: mix(PAL.hoodie.f, '#000', .25), so: [0, 8], l: INK, lw: 3 });
  }
  if (s.c2 > 0) {
    cel(g, rect(x2 - 62, base - 250 * s.c2, x2 + 62, base), { f: 'none', s: '#DED4C0', l: '#C7BFA9', lw: 4 });
    g.save(); g.setLineDash([14, 10]); g.strokeStyle = '#C7BFA9'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(x2 - 62, base); g.lineTo(x2 + 62, base); g.stroke(); g.restore();
  }
  if (s.c3 > 0) {
    const h = 250 * s.c3;
    cel(g, rect(x3 - 62, base, x3 + 62, base + h * .55), { f: PAL.red.f, s: mix(PAL.red.f, '#000', .3), so: [0, 8], l: INK, lw: 3 });
  }
  line(g, [[880, base], [1700, base]], '#8A8F6B', 5);
  text(g, '10 phút', x1, base + 54, { font: font(800, 34), align: 'center', fill: '#8A8F6B' });
  text(g, '20 phút', x2, base + 54, { font: font(800, 34), align: 'center', fill: '#8A8F6B' });
  text(g, '30 phút', x3, base + 54, { font: font(800, 34), align: 'center', fill: '#8A8F6B' });
  if (s.curve > 0) {
    g.save(); g.strokeStyle = PAL.red.f; g.lineWidth = 6; g.beginPath();
    const x0 = x3 - 62, y0 = base + 120;
    g.moveTo(x0, base - 40);
    g.quadraticCurveTo(x0 + 40, y0, x0 + 120, y0);
    if (s.curve > 1) g.quadraticCurveTo(x0 + 210, y0, x0 + 300, base - 90);
    g.stroke(); g.restore();
  }
  if (s.arrow > 0) {
    g.save(); g.strokeStyle = PAL.hoodie.f; g.lineWidth = 6;
    g.beginPath(); g.moveTo(x1 + 70, base - 250); g.lineTo(x1 + 190, base - 250); g.stroke();
    g.beginPath(); g.moveTo(x1 + 190, base - 250); g.lineTo(x1 + 164, base - 266); g.lineTo(x1 + 164, base - 234); g.closePath(); g.fillStyle = PAL.hoodie.f; g.fill();
    g.restore();
  }
  if (s.strike > 0) {
    g.save(); g.strokeStyle = PAL.red.f; g.lineWidth = 6;
    g.beginPath(); g.moveTo(x2 - 84, base + 44); g.lineTo(x2 + 84, base + 60); g.stroke(); g.restore();
  }
  if (s.write > 0) text(g, 'không phải chuẩn', x2 + 190, base + 30, { font: font(800, 36), fill: PAL.red.f });
}
// ba phiếu tự đánh giá trên bàn đo
function drawForms(g, s) {
  if (s.forms3 > 0) {
    for (let i = 0; i < 3; i++) {
      const x = 340 + i * 190;
      sheetProp(g, x, 700, 170, 230, [
        { str: 'TÔI THẤY', px: 24, step: 42 },
        { str: 'TỐT HƠN', px: 24, step: 42 },
        { str: '✓', px: 30, step: 42, fill: PAL.green.l }
      ], -.04 + i * .01);
    }
    if (s.compare > 0) {
      g.save(); g.strokeStyle = PAL.green.l; g.lineWidth = 5;
      for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(320 + i * 190, 660); g.lineTo(360 + i * 190, 660); g.stroke(); }
      g.restore();
    }
  }
  if (s.clock > 0) {
    const x = 1550, y = 655;
    cel(g, rect(x - 110, y - 65, x + 110, y + 65), { f: '#0C1218', l: '#39415C', lw: 3 });
    line(g, [[x - 80, y - 10], [x + 80, y - 10]], '#39415C', 3);
    line(g, [[x - 80, y + 40], [x + 80, y + 40]], PAL.red.f, 4);
    text(g, 'trước khi ngủ', x - 40, y - 26, { font: font(700, 22), align: 'center', fill: '#8A8F6B' });
    text(g, 'sau khi dậy', x - 40, y + 70, { font: font(700, 22), align: 'center', fill: '#8A8F6B' });
    const drop = ease.out(clamp01(s.drop || 0));
    line(g, [[x, y - 40], [x + lerp(-60, 52, drop), y + lerp(30, -8, drop)]], PAL.cyan.f, 6);
  }
  if (s.strip > 0) {
    cel(g, rect(880, 830, 1400, 880), { f: '#F4ECDD', s: '#DED4C0', so: [0, 6], l: INK, lw: 3 });
    line(g, [[900, 856], [1380, 856]], '#8A8F6B', 5);
    text(g, 'đánh giá của bạn: phẳng lặng', 1140, 905, { font: font(700, 26), align: 'center', fill: '#8A8F6B' });
  }
  if (s.result > 0) {
    sheetProp(g, 1010, 700, 220, 260, [
      { str: 'KẾT QUẢ ĐO', px: 26, step: 46 },
      { str: '4,0 lần/s', px: 26, step: 46 }
    ], .03);
  }
}
// quán cà phê: tách, thanh thời gian, gối, đồng hồ
function drawCafe(g, s) {
  if (s.bar > 0) {
    const x0 = 700, y0 = 790, w = 620;
    cel(g, rect(x0, y0, x0 + w, y0 + 40), { f: '#2A3040', l: INK, lw: 3 });
    if (s.dark > 0) cel(g, rect(x0, y0, x0 + w * .28, y0 + 40), { f: '#7A3B3B', s: '#5A2A2A', l: INK, lw: 3 });
    text(g, 'vừa mở mắt', x0 + w * .14, y0 + 78, { font: font(800, 28), align: 'center', fill: '#C9A2A2' });
    text(g, '30 phút đầu', x0 + w * .14, y0 - 16, { font: font(700, 26), align: 'center', fill: '#8A8F6B' });
    text(g, 'sau đó', x0 + w * .82, y0 + 78, { font: font(700, 26), align: 'center', fill: '#8A8F6B' });
  }
  if (s.pillow > 0) cel(g, poly([[560, 760], [660, 726], [760, 760], [660, 792]]), { f: '#E4DCC8', l: INK, lw: 3 });
  if (s.clock > 0) clockProp(g, 1080, 300, 78, 15, 30);
  if (s.cup > 0) {
    const cx = s.cupx;
    if (s.glow > 0) {
      const grd = g.createRadialGradient(cx, 770, 10, cx, 770, 260);
      grd.addColorStop(0, 'rgba(103,232,249,.30)'); grd.addColorStop(1, 'rgba(103,232,249,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(cx, 770, 260, 0, TAU); g.fill();
    }
    cupProp(g, cx, 790, 1, s.glow ? 1 : .3);
    if (s.strike > 0) {
      g.save(); g.strokeStyle = PAL.red.f; g.lineWidth = 6;
      g.beginPath(); g.moveTo(s.cupx < 500 ? 250 : 700, 800); g.lineTo(s.cupx < 500 ? 350 : 800, 812); g.stroke(); g.restore();
    }
  }
  if (s.barista > 0) story(g, 830, 880, { s: .85, look: 'seller', armR: 'hold', turn: .2 });
}
// hồ sơ giấy: bìa, lịch ngủ, dải thang, con dấu
function drawFile(g, s) {
  if (s.file > 0) {
    cel(g, rect(600, 230, 1320, 300), { f: '#EFE3CC', l: '#9C8158', lw: 2 });
    text(g, 'HỒ SƠ THIẾU NGỦ', 960, 282, { font: font(900, 46), align: 'center', fill: '#5A3A22' });
  }
  if (s.page > 0) {
    cel(g, rect(600, 330, 1320, 470), { f: '#EFE3CC', l: '#9C8158', lw: 2 });
    text(g, 'LỊCH NGỦ 14 ĐÊM', 960, 372, { font: font(800, 32), align: 'center', fill: '#5A3A22' });
    nightGrid(g, 640, 396, 44, 14, s.cells ? 14 : 0, s.cell ? s.cell - 1 : -1);
    if (s.cell6 > 0) {
      const bx = 640 + (s.cell6 - 1) * 52;
      cel(g, rect(bx - 5, 391, bx + 49, 445), { f: 'none', l: PAL.cyan.f, lw: 5 });
    }
    if (s.two > 0) for (const i of [12, 13]) {
      const bx = 640 + i * 52;
      g.save(); g.strokeStyle = PAL.violet.f; g.lineWidth = 5;
      g.beginPath(); g.ellipse(bx + 22, 418, 34, 34, 0, 0, TAU); g.stroke(); g.restore();
    }
    if (s.arrow > 0) {
      g.save(); g.strokeStyle = PAL.red.f; g.lineWidth = 6;
      const x0 = 640 + (s.cell - 1) * 52 + 22, x1 = 640 + 13 * 52 + 22;
      g.beginPath(); g.moveTo(x0, 418); g.lineTo(x1, 418); g.stroke();
      g.beginPath(); g.moveTo(x1, 418); g.lineTo(x1 - 20, 404); g.lineTo(x1 - 20, 432); g.closePath(); g.fillStyle = PAL.red.f; g.fill();
      g.restore();
    }
  }
  if (s.strip > 0) {
    cel(g, rect(620, 500, 1300, 550), { f: '#EFE3CC', l: '#9C8158', lw: 2 });
    line(g, [[640, 528], [1280, 528]], '#8A8F6B', 5);
    text(g, 'tự chấm: phẳng lặng', 960, 585, { font: font(700, 28), align: 'center', fill: '#8A8F6B' });
  }
  if (s.stamp > 0) stampProp(g, 960, 660, s.stamp, 'KHÔNG AI BIẾT');
  if (s.staff > 0) story(g, 1420, 900, { s: .9, look: 'office', armR: 'point', at: [960, 560], turn: -.3 });
}
// bàn làm việc buổi tối: đèn, điện thoại, tách, sổ, thẻ, chăn, thẻ tiêu đề
function drawNight(g, s) {
  if (s.phone > 0) {
    const x = 980, y = 760;
    cel(g, rect(x - 62, y - 110, x + 62, y + 6), { f: '#0E1017', s: '#1B1F2C', so: [-5, -5], l: '#3A4260', lw: 3 });
    cel(g, rect(x - 52, y - 100, x + 52, y - 4), { f: s.down > .5 ? '#141926' : 'rgba(103,232,249,.22)', l: '#39415C', lw: 2 });
    if (s.keys > 0 && s.down < .5) {
      text(g, s.keys > 1 ? '10' : '30', x, y - 34, { font: font(900, 62), align: 'center', fill: PAL.cyan.f });
      text(g, 'phút', x, y - 6, { font: font(700, 26), align: 'center', fill: '#8A8F6B' });
    }
  }
  if (s.cup > 0) {
    const x = 1500, y = 800;
    if (s.glow > 0) {
      const grd = g.createRadialGradient(x, y - 20, 8, x, y - 20, 220);
      grd.addColorStop(0, 'rgba(255,203,7,.26)'); grd.addColorStop(1, 'rgba(255,203,7,0)');
      g.fillStyle = grd; g.beginPath(); g.arc(x, y - 20, 220, 0, TAU); g.fill();
    }
    cupProp(g, x, y, 1, s.glow ? 1 : .3);
  }
  if (s.note > 0) {
    sheetProp(g, 1250, 720, 300, 200, [
      { str: 'ghi chú', px: 30, step: 50 },
      { str: 'đừng tin cảm giác', px: 30, step: 50, fill: INK },
      { rule: 1, rule: PAL.red.f, step: 50 }
    ], -.03);
    if (s.write > 0) { g.save(); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(1130, 706); g.lineTo(1330, 700); g.stroke(); g.restore(); }
    if (s.under > 0) { g.save(); g.strokeStyle = PAL.red.f; g.lineWidth = 6; g.beginPath(); g.moveTo(1130, 720); g.lineTo(1330, 714); g.stroke(); g.restore(); }
  }
  if (s.score > 0) sheetProp(g, 700, 790, 260, 190, [{ str: 'BẢNG ĐIỂM', px: 28 }], .02);
  if (s.cards > 0) {
    const cards = [['30 phút', PAL.red.f, s.c30], ['10 phút', PAL.hoodie.f, s.c10], ['cà phê', PAL.cyan.f, s.ccafe]];
    cards.forEach(([txt, col, on], n) => {
      const x = 780 + n * 210, y = 840 - n * 6;
      cel(g, rect(x - 84, y - 52, x + 84, y + 52), { f: '#F4ECDD', s: '#DED4C0', so: [0, 7], l: INK, lw: 3 });
      if (on > 0) text(g, txt, x, y + 12, { font: font(900, 32), align: 'center', fill: col });
      else { g.save(); g.globalAlpha = .3; text(g, txt, x, y + 12, { font: font(900, 32), align: 'center', fill: '#8A8F6B' }); g.restore(); }
    });
  }
  if (s.lamp < 1) {
    g.save(); g.globalAlpha = (1 - s.lamp) * .88; g.fillStyle = '#05060B'; g.fillRect(0, 0, W, H); g.restore();
  }
  if (s.dark > 0) {
    g.save(); g.globalAlpha = clamp01(s.dark) * .9; g.fillStyle = '#05060B'; g.fillRect(0, 0, W, H); g.restore();
  }
  if (s.title > 0) {   // thẻ tiêu đề nằm trên lớp tối: nó là hình cuối cùng người xem thấy
    const p = ease.back(clamp01(s.title));
    g.save(); g.globalAlpha = clamp01(s.title); g.translate(W / 2, 760);
    cel(g, rect(-380, -60, 380, 60), { f: PAL.hoodie.f, s: PAL.hoodie.s, so: [0, 10], l: INK, lw: 4 });
    text(g, 'TRẠM NGHĨ NHIỀU', 0, 18, { font: font(900, 62), align: 'center', fill: INK });
    g.restore();
  }
}

// ——— khung hình ———
window.render = time => {
  const g = G;
  T = time;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, W, H);
  const sc = BD.scene(time);
  T0 = sc.t0;
  const sh = BD.shot(time);
  if (sh.host === 'react') {
    reactClose(g, time, { at: sh.t0, E: 'skeptical', talk: talkAt(time) });
  } else {
    g.save();
    BD.camera(g, time);
    (SHOTS[sh.id] || SHOTS[Object.keys(SHOTS).find(k => k.startsWith(sc.id))] || (() => {}))(g, time, sh);
    g.restore();
    if (sh.host === 'pip') {
      hostPip(g, time, sh, { corner: 'br', r: 150, E: 'skeptical', talk: talkAt(time) });
    }
  }
  BD.signals(g, time);
  // phụ đề, sau cùng
  for (const c of TL.cues) if (time >= c.t0 && time < c.t1) subtitle(g, c.text);
};

window.TEXTS = T => { REG.list = []; window.render(T); const l = REG.list; REG.list = null; return l; };

async function setup() {
  const j = p => fetch(p).then(r => r.json());
  const [dur, words, lips] = await Promise.all([
    j('voice/proc/dur.json'), j('voice/words.json'), j('voice/lips.json')
  ]);
  TL = build(dur, words, lips);
  BD = await loadBoard('board.json', TL.L, words);
  EV = [...BD.events()];
  for (const id in TL.L) EV.push({ t: TL.L[id].t0, type: 'voice', id });
  EV.sort((a, b) => a.t - b.t);
  window.EV = EV;
  window.DUR = +TL.end.toFixed(2);
  window.CUES = TL.cues;
  await Promise.all([
    '900 40px "Be Vietnam Pro"', '800 40px "Be Vietnam Pro"', '700 40px "Be Vietnam Pro"', '400 40px "Patrick Hand"'
  ].map(f => document.fonts.load(f, 'ẠẾỘữ')));
  window.render(0);
  window.READY = true;
}
setup();
