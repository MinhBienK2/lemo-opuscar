// "Tại sao ta luôn tưởng mình đúng?" — Tập 07 của Trạm Nghĩ Nhiều (series Tâm lý hành vi).
// Mọi cảnh là hàm của thời gian cục bộ; mọi mốc thời gian đến từ timeline.js (giọng đọc thật).
// Hợp đồng trang: window.render(t), window.DUR, window.READY, window.EV, window.TEXTS(t).
import { figure, expr, blendE, PAL, roi } from '../../../../rig/character.js';
import { cel, path, poly, ellP, line, mix, rgba, canvas, W, H, TAU, rect } from '../../../../rig/cel.js';
import { ground, panel, hilite, stamp, pip, bubble, focusLines, subtitle, tag, text, revealText, sharpText, font, ease, seg, clamp01, INK, CREAM, ACCENT, STORY, REG, ambientMotes } from '../../../../rig/broll.js';
import * as S from '../../../../rig/sets.js';
import { hand, GEST, blendGest } from '../../../../rig/hands.js';
import { applyPaperTexture, renderGrainFx, drawHalftoneField, drawDossierHeader, drawStampSlam, drawEvidenceTag, drawSunburst, drawSparkle, drawSwissMetric } from '../../../../rig/styles.js';
import { build } from './timeline.js';

const cv = document.getElementById('c'), G = cv.getContext('2d');
const [buf, B] = canvas(W, H);
let TL, SHOTS, EV = [];

// ——— công cụ diễn xuất ———
const E = x => typeof x === 'string' ? expr(x) : expr(x[0], x[1]);
function ek(T, keys, bl = .14) {   // biểu cảm, trộn dần trong bl giây
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const cur = E(keys[i][1]); if (i === 0) return cur;
  const u = seg(T, keys[i][0], keys[i][0] + bl); return u >= 1 ? cur : blendE(E(keys[i - 1][1]), cur, ease.inOut(u));
}
const lerp = (a, b, u) => a + (b - a) * u;
function ak(T, keys, d = .34) {    // vị trí tay, back-ease
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const c = keys[i][1]; if (i === 0) return c;
  const p = keys[i - 1][1], u = ease.back(seg(T, keys[i][0], keys[i][0] + d)), v = ease.inOut(seg(T, keys[i][0], keys[i][0] + d * .7));
  return { ...(v < .5 ? p : c), at: [lerp(p.at[0], c.at[0], u), lerp(p.at[1], c.at[1], u)], rot: lerp(p.rot || 0, c.rot || 0, v), gest: v < .5 ? (p.gest || 'relaxed') : (c.gest || 'relaxed') };
}
const BLINKS = []; { let s = 11, t = 1.1; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 220) { BLINKS.push(t); if (r() < .22) BLINKS.push(t + .26); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < .16) return Math.sin(d / .16 * Math.PI); } return 0; }
function cam(g, z, fx, fy, ox = 0, oy = 0) { g.translate(fx, fy); g.scale(z, z); g.translate(-fx - ox, -fy - oy); }
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id];

// màu của tập phim
const PAPER = '#EFE9DA', PAPER_S = '#CFC7B2', INK2 = '#2A2A24', GREY = '#6E6757';
const WOOD = '#3A2E20', WOOD2 = '#241C14', NAVY = '#3B4A63', CY = '#67E8F9', RED = '#F0525B', YEL = '#FFB703', AMBER = '#8A5A2A';

// ——————————————————————————————————————————————
// ĐẠO CỤ: bàn làm việc lúc nửa đêm
// ——————————————————————————————————————————————
function deskScene(g, T, o = {}) {
  deskWall(g, T, o);
  deskSurface(g, T, o);
}
// tường sau và vòng sáng của đèn bàn (vẽ trước nhân vật)
function deskWall(g, T, o = {}) {
  const top = o.top === undefined ? 560 : o.top;
  g.fillStyle = '#0E1017'; g.fillRect(-200, -200, W + 400, H + 400);
  cel(g, rect(-200, -200, W + 200, top), { f: '#161A26', l: '#12131A', lw: 3 });
  for (let i = 0; i < 4; i++) line(g, [[-200, 120 + i * 170], [W + 200, 120 + i * 170]], '#1E2333', 4);
  // vòng sáng của đèn bàn
  const lx = o.lx === undefined ? 520 : o.lx, ly = o.ly === undefined ? 300 : o.ly;
  const grd = g.createRadialGradient(lx, ly, 40, lx, ly, 820);
  grd.addColorStop(0, 'rgba(255,183,3,.20)'); grd.addColorStop(.5, 'rgba(255,183,3,.06)'); grd.addColorStop(1, 'rgba(255,183,3,0)');
  g.fillStyle = grd; g.fillRect(-200, -200, W + 400, H + 400);
}
// mặt bàn (vẽ sau nhân vật: nhân vật đứng sau bàn thì chân phải khuất)
function deskSurface(g, T, o = {}) {
  const top = o.top === undefined ? 560 : o.top;
  cel(g, rect(-200, top, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
  for (let i = 0; i < 6; i++) line(g, [[-200, top + 46 + i * 96], [W + 200, top + 30 + i * 96]], '#241C14', 5);
}

// bàn nhìn từ trên xuống: mặt bàn chiếm gần hết khung
function deskTop(g, T, o = {}) {
  g.fillStyle = '#0E1017'; g.fillRect(-200, -200, W + 400, H + 400);
  cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
  for (let i = 0; i < 8; i++) line(g, [[-200, -60 + i * 160], [W + 200, -86 + i * 160]], '#241C14', 5);
  const lx = o.lx === undefined ? 640 : o.lx, ly = o.ly === undefined ? 260 : o.ly;
  const grd = g.createRadialGradient(lx, ly, 40, lx, ly, 900);
  grd.addColorStop(0, 'rgba(255,183,3,.20)'); grd.addColorStop(1, 'rgba(255,183,3,0)');
  g.fillStyle = grd; g.fillRect(-200, -200, W + 400, H + 400);
}

// một mẩu báo chí: giấy, tiêu đề, các dòng chữ
function clipping(g, x, y, w, h, rot = 0, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: o.f || PAPER, s: o.s || PAPER_S, so: [7, 9], l: INK2, lw: 2.6 });
  if (o.head !== false) {
    cel(g, rect(-w / 2 + 9, -h / 2 + 9, w / 2 - 9, -h / 2 + 36), { f: o.headCol || NAVY, l: INK2, lw: 1.8 });
    if (o.label) text(g, o.label, -w / 2 + 18, -h / 2 + 30, { font: font(800, 20), fill: PAPER });
  }
  const n = o.lines === undefined ? 4 : o.lines;
  for (let i = 0; i < n; i++) line(g, [[-w / 2 + 16, -h / 2 + 58 + i * 22], [w / 2 - 16 - ((i * 37) % 4) * 20, -h / 2 + 58 + i * 22]], o.lineCol || GREY, 6);
  if (o.photo) cel(g, rect(-w / 2 + 16, -h / 2 + 58 + n * 22 + 8, -w / 2 + 16 + 86, -h / 2 + 58 + n * 22 + 78), { f: '#8C8474', s: '#6E6757', l: INK2, lw: 2 });
  g.restore();
}

// một chồng mẩu báo
function stack(g, x, y, n, rot = 0, o = {}) {
  for (let i = 0; i < n; i++) {
    const k = (i + 1) / n;
    clipping(g, x + Math.sin(i * 2.1) * 7, y - i * 9, o.w || 250, o.h || 160, rot + Math.sin(i * 1.3) * .035, o.clip || {});
  }
}

// ngăn kéo: mặt kéo, tay nắm kéo, giấy bị đẩy vào
function drawerFront(g, x, y, w, h, open = 0) {
  cel(g, rect(x - w / 2, y - h / 2, x + w / 2, y + h / 2), { f: '#2A2118', s: '#1C1610', so: [0, 10], l: '#0E0B08', lw: 3.4 });
  cel(g, rect(x - w / 2 + 26, y - 22, x + w / 2 - 26, y + 22), { f: '#6E6757', s: '#4A4436', so: [0, 8], l: '#0E0B08', lw: 2.6 });
  for (let i = 0; i < 3; i++) line(g, [[x - w / 2 + 30, y - h / 2 + 40 + i * 42], [x + w / 2 - 30, y - h / 2 + 40 + i * 42]], '#241C14', 4);
  if (open > 0) {
    cel(g, rect(x - w / 2 + 14, y - h / 2 - 8 - 96 * open, x + w / 2 - 14, y - h / 2 + 6), { f: '#100C08', l: '#0E0B08', lw: 3 });
  }
}

// tay lớn (đạo cụ của tập phim)
function bigHand(g, x, y, rot, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(2.0, 2.0);
  hand(g, PAL.skin, { lw: 2.6, ...o });
  g.restore();
}

// bút đỏ trong tay
function penProp(g, col = '#D8402F') {
  cel(g, rect(-120, -11, 96, 11), { f: col, s: mix(col, '#2A2A24', .35), so: [0, 8], l: INK2, lw: 2.4 });
  cel(g, poly([[96, -11], [140, 0], [96, 11]]), { f: '#E8DCC0', l: INK2, lw: 2.4 });
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: biểu đồ tự đánh giá của tài xế
// ——————————————————————————————————————————————
// mỗi chấm là một tài xế tự xếp mình vào phân vị của mình
function selfRate(g, x, y, w, p, o = {}) {
  const n = o.n || 40, hot = o.hot || YEL;
  line(g, [[x, y], [x + w, y]], '#8A8274', 5);
  for (let i = 0; i <= 10; i++) {
    const px = x + w * i / 10;
    line(g, [[px, y - 8], [px, y + 8]], '#6E6757', 3);
    if (i % 5 === 0) text(g, i * 10 + '%', px, y + 34, { font: font(700, 22), align: 'center', fill: GREY });
  }
  // đường trung vị
  const med = x + w * .5;
  line(g, [[med, y - 96], [med, y + 96]], RED, 7);
  text(g, 'trung vị', med, y - 116, { font: font(800, 30), align: 'center', fill: RED });
  // các chấm tự xếp: đám đông dồn sang bên phải
  const seed = [];
  for (let i = 0; i < n; i++) {
    const u = .58 + ((i * 37) % 41) / 100;         // phân vị tự đánh giá
    seed.push({ u, row: i % 4, j: Math.sin(i * 1.7) * 10 });
  }
  seed.forEach((s, i) => {
    const q = ease.out(seg(p, i * .012, i * .012 + .3));
    if (q <= 0) return;
    const px = x + w * s.u + s.j, py = y - 34 - s.row * 26;
    cel(g, ellP(px, py, 13 * q, 13 * q), { f: hot, s: mix(hot, '#2A2A24', .3), so: [3, 3], l: INK2, lw: 2.2 });
  });
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: tờ dữ kiện 1979 và hai nhóm
// ——————————————————————————————————————————————
function evidenceSheet(g, x, y, rot, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, rect(-340, -230, 340, 230), { f: '#F3EEDF', s: '#C9C2B0', so: [12, 16], l: INK2, lw: 3.4 });
  cel(g, rect(-340, -230, 340, -170), { f: NAVY, l: INK2, lw: 2.4 });
  text(g, o.title || 'BỘ DỮ KIỆN', -312, -188, { font: font(900, 38), fill: PAPER });
  for (let i = 0; i < 7; i++) line(g, [[-312, -140 + i * 34], [312 - ((i * 53) % 5) * 26, -140 + i * 34]], '#4A4436', 7);
  if (o.foot) { text(g, o.foot, 312, 200, { font: font(400, 26, 'Patrick Hand'), align: 'right', fill: GREY }); }
  g.restore();
}

// hai thẻ đánh giá: mạnh / yếu, đặt cạnh nhau
function verdictCard(g, x, y, w, h, rot, label, strong, p) {
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: '#F3EEDF', s: '#C9C2B0', so: [8, 10], l: INK2, lw: 3 });
  cel(g, rect(-w / 2 + 8, -h / 2 + 8, w / 2 - 8, -h / 2 + 52), { f: strong ? '#2F6B3A' : '#8A2B2B', l: INK2, lw: 2.4 });
  text(g, label, 0, -h / 2 + 38, { font: font(900, 28), align: 'center', fill: PAPER });
  const q = ease.back(seg(p, 0, .4));
  if (q > 0) {
    g.save(); g.scale(q, q);
    text(g, strong ? 'MẠNH' : 'YẾU', 0, 26, { font: font(900, 74), align: 'center', fill: strong ? '#2F6B3A' : '#8A2B2B' });
    g.restore();
  }
  g.restore();
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: tường 52 vấn đề
// ——————————————————————————————————————————————
function issueWall(g, T, o = {}) {
  const cols = 13, rows = 4, cw = 128, ch = 120, gap = 10;
  const x0 = 960 - (cols * (cw + gap) - gap) / 2, y0 = 214;
  for (let i = 0; i < 52; i++) {
    const cx2 = x0 + (i % cols) * (cw + gap), cy2 = y0 + Math.floor(i / cols) * (ch + gap);
    const p = ease.out(seg(T, (o.t0 || 0) + i * .035, (o.t0 || 0) + i * .035 + .28));
    if (p <= 0) continue;
    g.save(); g.translate(cx2 + cw / 2, cy2 + ch / 2); g.rotate(((i * 31) % 7 - 3) * .014); g.scale(p, p);
    cel(g, rect(-cw / 2, -ch / 2, cw / 2, ch / 2), { f: '#F3EEDF', s: '#C9C2B0', so: [6, 8], l: INK2, lw: 2.4 });
    cel(g, rect(-cw / 2 + 10, -ch / 2 + 12, cw / 2 - 10, -ch / 2 + 34), { f: NAVY, l: INK2, lw: 1.8 });
    for (let k = 0; k < 3; k++) line(g, [[-cw / 2 + 14, -ch / 2 + 56 + k * 22], [cw / 2 - 14 - (k % 2) * 18, -ch / 2 + 56 + k * 22]], '#6E6757', 5);
    // dấu "không" vẽ bằng nét (không phải chữ): không bị đo thời gian đọc
    const sp = o.stamp === undefined ? 0 : ease.out(seg(T, o.stamp, o.stamp + .26));
    if (sp > 0) {
      g.save(); g.globalAlpha = sp; g.rotate(-.12);
      cel(g, ellP(0, 0, 30, 30), { f: 'rgba(0,0,0,0)', l: '#2F6B3A', lw: 5 });
      line(g, [[-14, 0], [14, 0]], '#2F6B3A', 6);
      g.restore();
    }
    g.restore();
  }
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: sổ tay viết tay
// ——————————————————————————————————————————————
function notebook(g, x, y, rot, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, rect(-420, -250, 420, 250), { f: '#3A2E20', s: '#241C14', so: [12, 16], l: '#0E0B08', lw: 3 });
  cel(g, rect(-400, -230, 400, 230), { f: '#F7F2E4', s: '#D8D0BC', so: [4, 6], l: INK2, lw: 2.6 });
  cel(g, rect(-400, -230, -368, 230), { f: '#D8402F', l: INK2, lw: 2.4 });
  for (let i = 0; i < 6; i++) line(g, [[-340, -190 + i * 76], [340 - (i % 3) * 40, -190 + i * 76]], 'rgba(110,130,165,.35)', 1.6);
  if (o.title) text(g, o.title, -336, -196, { font: font(400, 34, 'Patrick Hand'), fill: GREY });
  g.restore();
}

// gương tay — đạo cụ của hành động "xét ngược lại"
function handMirror(g, x, y, s, p) {
  g.save(); g.translate(x, y); g.rotate(-.3); g.scale(s, s);
  const q = ease.back(seg(p, 0, .5));
  g.save(); g.scale(q, q);
  cel(g, ellP(0, 0, 150, 170), { f: '#2A3145', s: '#1B2130', so: [8, 10], l: '#12131A', lw: 3.4 });
  cel(g, ellP(0, 0, 122, 142), { f: '#B8C8D8', s: '#8FA2B4', so: [0, 0], l: '#12131A', lw: 2.4 });
  line(g, [[-70, 60], [40, -40]], '#E8F2FA', 12);
  cel(g, rect(-26, 150, 26, 330), { f: '#4A3A28', s: '#2A2118', so: [0, 10], l: '#0E0B08', lw: 3 });
  g.restore();
  g.restore();
}

// xe hơi lúc đêm — bối cảnh hiện trường của tập phim
function carNightBack(g, T) {
  g.fillStyle = '#080B12'; g.fillRect(-200, -200, W + 400, H + 400);
  // thành phố ngoài kính chắn
  g.save(); g.beginPath(); g.rect(0, 60, W, 470); g.clip();
  g.fillStyle = '#101828'; g.fillRect(-200, 60, W + 400, 470);
  for (let i = 0; i < 70; i++) {
    const a = Math.abs(Math.sin(i * 45.13) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 91.7) * 12345.678) % 1;
    g.fillStyle = rgba(i % 3 ? PAL.hoodie.h : PAL.cyan.h, .22 + b * .5);
    g.fillRect(a * (W + 400) - 200, 90 + b * 380, 5, 5);
  }
  for (let i = 0; i < 14; i++) {   // đèn đường chạy qua
    const x = ((i * 210 + T * 190) % (W + 500)) - 250;
    cel(g, rect(x, 250, x + 26, 520), { f: '#1A2130', l: '#0B0F18', lw: 2 });
    cel(g, ellP(x + 13, 250, 22, 10), { f: '#FFE9A6', s: YEL, so: [0, 0], l: '#12131A', lw: 2 });
  }
  g.restore();
  // khung kính chắn
  cel(g, rect(-200, -200, W + 200, 60), { f: '#0C0F16', l: '#12131A', lw: 3 });
  line(g, [[-200, 60], [W + 200, 60]], '#2A3145', 8);
  line(g, [[300, 60], [300, 530]], '#2A3145', 8);
  line(g, [[1620, 60], [1620, 530]], '#2A3145', 8);
}
// phần trước: bảng điều khiển, vô-lăng, gương chiếu hậu
function carNightFront(g, T, o = {}) {
  cel(g, rect(-200, 530, W + 200, H + 200), { f: '#1A1F2C', s: '#12131A', so: [0, -12], l: '#0A0C14', lw: 3 });
  cel(g, ellP(760, 780, 190, 190), { f: 'none', l: '#2A3145', lw: 26 });
  line(g, [[700, 700], [620, 790]], '#3A4260', 16);
  line(g, [[820, 700], [900, 790]], '#3A4260', 16);
  cel(g, ellP(760, 780, 70, 70), { f: '#232838', l: '#12131A', lw: 3 });
  // gương chiếu hậu
  cel(g, rect(860, 120, 1120, 220), { f: '#101828', s: '#0A0F18', so: [6, 8], l: '#2A3145', lw: 4 });
  g.save(); g.beginPath(); g.rect(868, 128, 244, 84); g.clip();
  for (let i = 0; i < 26; i++) {
    const a = Math.abs(Math.sin(i * 12.9) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 78.2) * 12345.678) % 1;
    g.fillStyle = rgba(PAL.hoodie.h, .25 + b * .4); g.fillRect(870 + a * 240, 130 + b * 80, 5, 5);
  }
  g.restore();
  line(g, [[990, 220], [990, 300]], '#2A3145', 10);
  // đồng hồ bảng điều khiển
  text(g, o.clock || '02:20', 1540, 700, { font: font(900, 54), fill: CY });
  text(g, 'giờ', 1540, 740, { font: font(700, 26), align: 'right', fill: PAL.muted });
}

// bảng điện tử lớn: bảng tin đang chạy
function newsBoard(g, T, o = {}) {
  cel(g, rect(280, 130, 1640, 900), { f: '#0D1420', s: '#080C14', so: [12, 14], l: '#2A3140', lw: 4 });
  cel(g, rect(306, 156, 1614, 874), { f: '#141C2A', l: '#0A0F18', lw: 2.4 });
  cel(g, rect(306, 156, 1614, 232), { f: '#1D2739', l: '#2A3140', lw: 2.4 });
  text(g, o.title || 'BẢNG TIN', 336, 206, { font: font(900, 38), fill: PAL.muted });
  for (let i = 0; i < 6; i++) {
    const y = 266 + i * 98, on = (i < (o.on === undefined ? 3 : o.on));
    cel(g, rect(340, y, 1580, y + 78), { f: on ? '#1B2636' : '#182233', l: '#26314A', lw: 1.8 });
    cel(g, ellP(392, y + 39, 20, 20), { f: on ? YEL : '#3A4260', l: '#12131A', lw: 2 });
    for (let k = 0; k < 2; k++) line(g, [[440, y + 26 + k * 26], [1300 - k * 150, y + 26 + k * 26]], on ? '#5A6488' : '#39415E', 8);
  }
}

// ——————————————————————————————————————————————
// CẢNH
// ——————————————————————————————————————————————
function shots() {
  // Mỗi cảnh bám vào một câu thoại: mở ra ngay trước khi câu đó bắt đầu. Mọi mốc thời gian đến từ
  // voice/proc/dur.json — không gõ tay.
  const ORDER = [
    ['desk', null, 0], ['read', 'hook1', .3], ['drawer', 'hook2', .3], ['proud', 'hook3', .3],
    ['title', 'intro', .3], ['poster', 'myth', .3], ['def', 'myth2', .3], ['roi1', 'myth3', .25],
    ['car', 'drv1', .3], ['chart93', 'drv2', .3], ['replica', 'drv3', .3], ['half', 'drv4', .3],
    ['mirror', 'bias1', .3], ['lab79', 'bias2', .3], ['two', 'bias3', .3], ['twob', 'bias4', .3], ['n151', 'bias5', .3],
    ['bk1', 'bk1', .3], ['bk32', 'bk3', .3], ['bkscare', 'bk5', .3],
    ['wall52', 'turn1', .3], ['zero', 'turn3', .3], ['why', 'turn4', .3],
    ['mech', 'mech1', .3], ['mech2', 'mech2', .3], ['mech3', 'mech3', .3],
    ['act1', 'act1', .3], ['act2', 'act2', .3], ['act3', 'act3', .3], ['act4', 'act4', .3], ['act5', 'act5', .3],
    ['hop', 'hop1', .3], ['roi2', 'roi', .3], ['close', 'close', .3], ['next', 'next', .3],
  ];
  const START = {};
  for (const [name, anchor, lead] of ORDER) START[name] = anchor ? L(anchor).t0 - lead : 0;
  const at = (name, d = 0) => (START[name] !== undefined ? START[name] + d : 0);

  return [
    // 1 — mở: bàn làm việc lúc hai giờ sáng (Mode A)
    { n: 'desk', t: START.desk, f(g, lt, T) {
      g.save(); cam(g, 1.03 + seg(lt, 0, 4) * .05, 960, 620);
      deskWall(g, T, { top: 520 });
      kng(g, 1180, 400, {
        s: 1.0, E: ek(T, [[0, 'tired'], [START.read + 1, 'thinking']]),
        headYaw: -.16, headPitch: .1, talk: TL.talk(T),
      }, T);
      deskSurface(g, T, { top: 520 });
      stack(g, 640, 690, 6, -.02, { w: 260, h: 168, clip: { headCol: NAVY } });
      stack(g, 1420, 700, 3, .04, { w: 240, h: 156, clip: { headCol: '#8A2B2B' } });
      text(g, '02:14', 78, 128, { font: font(900, 66), fill: PAL.muted });
      ambientMotes(g, T, 16, { x0: 120, y0: 60, x1: 1800, y1: 900 });
      g.restore();
    }, ev: () => [[0, 'amb', { kind: 'room', t1: at('title') }], [0, 'tick']] },

    // 2 — đọc tin, chỉ đọc tin đồng ý (Mode A)
    { n: 'read', t: START.read, f(g, lt, T) {
      const t0 = L('hook1').t0;
      g.save(); cam(g, 1.06 + seg(lt, 0, 6) * .04, 900, 640);
      deskWall(g, T, { top: 470 });
      kng(g, 1320, 330, {
        s: 1.06, E: ek(T, [[0, 'thinking'], [t0 + 2.2, 'happy']]),
        headYaw: -.2, headPitch: .14,
        armL: ak(T, [[0, { at: [-150, 250] }], [t0 + 1.4, { at: [-120, 60], gest: 'hold', rot: -.35 }]], .4),
        armR: ak(T, [[0, { at: [150, 250] }], [t0 + 2.0, { at: [130, 90], gest: 'hold', rot: .3 }]], .4),
        talk: TL.talk(T),
      }, T);
      deskSurface(g, T, { top: 470 });
      // mẩu báo đang đọc, và chồng báo đồng ý bên trái
      const hp = ease.out(seg(T, t0 + 1.2, t0 + 2.0));
      clipping(g, lerp(520, 560, hp), 700, 300, 190, -.03 + hp * .02, { label: 'ĐỒNG Ý', headCol: '#2F6B3A', photo: true });
      stack(g, 300, 780, 5, -.05, { w: 230, h: 150, clip: { headCol: '#2F6B3A' } });
      text(g, 'chỉ đọc tin đồng ý', 560, 420, { font: font(400, 40, 'Patrick Hand'), align: 'center', fill: PAL.hoodie.f });
      g.restore();
    }, ev() { return [[this.t, 'paper'], [L('hook1').t0 + 1.3, 'pop'], [this.t, 'amb', { kind: 'room', t1: at('drawer') }]]; } },

    // 3 — các mẩu còn lại bị gạt vào ngăn kéo (Mode C close)
    { n: 'drawer', t: START.drawer, f(g, lt, T) {
      const t0 = L('hook2').t0;
      g.save(); cam(g, 1.12 + seg(lt, 0, 4) * .03, 960, 700);
      deskTop(g, T, { lx: 900, ly: 320 });
      drawerFront(g, 960, 880, 900, 260, seg(T, t0 + 1.2, t0 + 2.2));
      // mẩu báo bị đẩy vào ngăn kéo
      const push = ease.inOut(seg(T, t0 + .8, t0 + 2.4));
      for (let i = 0; i < 3; i++) {
        clipping(g, lerp(700, 900, push) + i * 26, lerp(560, 800, push), 260, 168, .04 + i * .03, { headCol: '#8A2B2B', lines: 3 });
      }
      bigHand(g, lerp(560, 690, push), lerp(520, 690, push), -.5 + push * .35, {
        gest: blendGest(GEST.relaxed, GEST.one, seg(T, t0 + .8, t0 + 1.6)),
      });
      text(g, 'mấy mẩu còn lại', 960, 330, { font: font(400, 44, 'Patrick Hand'), align: 'center', fill: GREY });
      g.restore();
    }, ev() { return [[this.t, 'paper'], [L('hook2').t0 + 1.2, 'swish'], [this.t, 'amb', { kind: 'room', t1: at('proud') }]]; } },

    // 4 — tự tin (Mode D, cận cảnh)
    { n: 'proud', t: START.proud, f(g, lt, T) {
      const t0 = L('hook3').t0;
      ground(g, '#14161F');
      focusLines(g, 960, 500, T, '#232839', 56, 320);
      kng(g, 960, 620, {
        s: 1.5, E: ek(T, [[0, 'thinking'], [t0 + 1.6, 'smug']]),
        headYaw: .04, headPitch: -.04, headRoll: .02, talk: TL.talk(T),
      }, T);
      const bp = ease.out(seg(T, t0 + .8, t0 + 1.6));
      if (bp > 0) {
        g.save(); g.globalAlpha = bp;
        text(g, 'người lý trí nhất phòng', 960, 250, { font: font(900, 52), align: 'center', fill: PAL.hoodie.f });
        g.restore();
      }
    }, ev() { return [[this.t, 'ting'], [L('hook3').t0 + 1.8, 'pop'], [this.t, 'amb', { kind: 'room', t1: at('title') }]]; } },

    // 5 — thẻ tiêu đề tập (Mode A)
    { n: 'title', t: START.title, f(g, lt, T) {
      const t0 = L('intro').t0;
      deskWall(g, T, { top: 560 });
      kng(g, 1420, 400, {
        s: 1.0, E: ek(T, [[0, 'thinking'], [t0 + 1.8, 'talk']]),
        headYaw: -.12, headPitch: .06, talk: TL.talk(T),
      }, T);
      deskSurface(g, T, { top: 560 });
      const p = ease.back(seg(lt, .05, .6));
      if (p > 0) {
        g.save(); g.translate(600 - (1 - p) * 700, 620); g.rotate(-.03);
        cel(g, rect(-420, -190, 420, 190), { f: '#F3EEDF', s: '#C9C2B0', so: [14, 18], l: INK2, lw: 3.4 });
        cel(g, ellP(-278, -178, 15, 15), { f: PAL.red.f, s: PAL.red.s, so: [-4, -4], l: PAL.red.l, lw: 2 });
        text(g, 'TẠI SAO TA', -380, -66, { font: font(900, 74), fill: INK2 });
        text(g, 'LUÔN TƯỞNG', -380, 12, { font: font(900, 74), fill: INK2 });
        text(g, 'MÌNH ĐÚNG?', -380, 90, { font: font(900, 74), fill: INK2 });
        revealText(g, 'thiên lệch xác nhận · tập 07', -378, 156, seg(T, t0 + 2.4, t0 + 3.6), { font: font(400, 34, 'Patrick Hand'), fill: GREY });
        g.restore();
      }
      // câu thứ hai của chương: câu trả lời không nằm ở chỗ "bạn ngu"
      const t2 = L('intro2').t0;
      revealText(g, 'câu trả lời không phải là bạn ngu', 960, 856, seg(T, t2 + .3, t2 + 1.6), { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      text(g, '02:14', 78, 128, { font: font(900, 66), fill: PAL.muted });
    }, ev() { return [[this.t, 'paper'], [this.t, 'pop'], [L('intro').t0 + 2.4, 'marker'], [this.t, 'music', { cue: 'B' }], [this.t, 'amb', { kind: 'room', t1: at('poster') }]]; } },

    // 6 — cách giải thích quen thuộc (Mode A, tường hồ sơ)
    { n: 'poster', t: START.poster, f(g, lt, T) {
      const t0 = L('myth').t0;
      ground(g, '#161A26');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1B2032', s: '#12161F', l: '#0B0E16', lw: 3 });
      drawHalftoneField(g, { cx: 960, cy: 470, w: 1320, h: 640, step: 30, color: '#FFB703', maxR: 3.4, densityFn: (x, y) => .22 * (1 - Math.min(1, Math.hypot(x, y) / 720)) });
      for (let i = 0; i < 5; i++) line(g, [[-200, 130 + i * 210], [W + 200, 130 + i * 210]], '#232839', 4);
      g.save(); g.translate(960, 470); g.rotate(.012);
      cel(g, rect(-640, -300, 640, 300), { f: '#E7E1D0', s: '#C4BCA6', so: [14, 18], l: INK2, lw: 3.4 });
      text(g, 'NÃO BỘ LỌC', -580, -140, { font: font(900, 96), fill: INK2 });
      text(g, 'TIN THEO Ý', -580, -14, { font: font(900, 96), fill: INK2 });
      line(g, [[-580, 44], [180, 44]], '#B9AE95', 6);
      revealText(g, 'cách giải thích quen thuộc nhất', -578, 140, seg(T, t0 + .3, t0 + 1.5), { font: font(400, 44, 'Patrick Hand'), fill: GREY });
      revealText(g, 'chỉ nhận tin khớp với điều đã tin', -578, 214, seg(T, t0 + .8, t0 + 2.0), { font: font(400, 44, 'Patrick Hand'), fill: GREY });
      cel(g, ellP(-580, -292, 15, 15), { f: PAL.red.f, s: PAL.red.s, so: [-4, -4], l: PAL.red.l, lw: 2 });
      g.restore();
      stamp(g, 'PHỔ BIẾN', 1420, 700, { rot: .1, px: 56, p: ease.out(seg(T, t0 + 1.4, t0 + 1.8)) });
      roi(g, 250, 830, 1.5, { t: T, E: { mo: .35, lookX: .35 } });
    }, ev() { return [[this.t, 'pop'], [L('myth').t0 + 1.4, 'stamp'], [this.t, 'music', { cue: 'C' }], [this.t, 'amb', { kind: 'room', t1: at('def') }]]; } },

    // 7 — định nghĩa (Mode B, thẻ trên bàn)
    { n: 'def', t: START.def, f(g, lt, T) {
      const t0 = L('myth2').t0;
      deskTop(g, T, { lx: 860, ly: 300 });
      g.save(); g.translate(960, 560); g.rotate(-.018);
      cel(g, rect(-620, -240, 620, 240), { f: '#F7F2E4', s: '#D8D0BC', so: [14, 18], l: INK2, lw: 3.4 });
      cel(g, rect(-620, -240, 620, -176), { f: NAVY, l: INK2, lw: 2.4 });
      text(g, 'THIÊN LỆCH XÁC NHẬN', -592, -196, { font: font(900, 34), fill: PAPER });
      revealText(g, 'tìm và diễn giải bằng chứng', -586, -96, seg(T, t0 + .6, t0 + 2.0), { font: font(400, 44, 'Patrick Hand'), fill: INK2 });
      revealText(g, 'theo hướng có lợi cho', -586, -30, seg(T, t0 + 1.4, t0 + 2.8), { font: font(400, 44, 'Patrick Hand'), fill: INK2 });
      revealText(g, 'niềm tin sẵn có', -586, 36, seg(T, t0 + 2.0, t0 + 3.4), { font: font(400, 44, 'Patrick Hand'), fill: INK2 });
      line(g, [[-586, 84], [586, 84]], '#B9AE95', 5);
      revealText(g, 'NICKERSON · 1998', -586, 150, seg(T, t0 + 2.4, t0 + 3.4), { font: font(800, 32), fill: AMBER });
      g.restore();
      bigHand(g, 230, 820, -.35, { gest: blendGest(GEST.relaxed, GEST.thumb, seg(T, t0 + .4, t0 + 1.2)), flip: true });
    }, ev() { return [[this.t, 'paper'], [L('myth2').t0 + 1.2, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('roi1') }]]; } },

    // 8 — Rối: chưa ai kiểm tra (Mode B)
    { n: 'roi1', t: START.roi1, f(g, lt, T) {
      const t0 = L('myth3').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      stack(g, 700, 640, 5, -.03, { w: 270, h: 172, clip: { headCol: NAVY } });
      stack(g, 1300, 660, 2, .05, { w: 250, h: 160, clip: { headCol: '#8A2B2B' } });
      if (T > t0 + .4) pip(g, 420, 420, 120, ease.back(seg(T, t0 + .4, t0 + .9)), (gg, r) => {
        gg.fillStyle = '#F3EEDF'; gg.fillRect(-r, -r, 2 * r, 2 * r);
        roi(gg, 0, 10, r / 120 * 1.9, { t: T, E: { mo: .5, lookX: .3 } });
      });
      bubble(g, 1160, 380, 900, 260, (gg) => {
        text(gg, 'NGHE HỢP LÝ', 0, -40, { font: font(900, 56), align: 'center', base: 'middle', fill: PAL.violet.f });
        text(gg, 'NHƯNG CHƯA AI KIỂM TRA', 0, 34, { font: font(900, 44), align: 'center', base: 'middle', fill: PAL.violet.f });
      }, { tail: 'left' });
    }, ev() { return [[this.t, 'pop'], [this.t + .3, 'boing'], [this.t, 'amb', { kind: 'room', t1: at('car') }]]; } },

    // 9 — hiện trường: lái xe lúc đêm (Mode C)
    { n: 'car', t: START.car, f(g, lt, T) {
      const t0 = L('drv1').t0;
      g.save(); cam(g, 1.04 + seg(lt, 0, 6) * .03, 960, 560);
      carNightBack(g, T);
      kng(g, 560, 320, {
        s: 1.0, E: ek(T, [[0, 'thinking'], [t0 + 2.4, 'smug']]),
        headYaw: .3, headPitch: .04, talk: TL.talk(T),
      }, T);
      carNightFront(g, T, { clock: '02:20' });
      // tay đặt trên vô-lăng
      bigHand(g, 700, 700, .18, { gest: GEST.hold });
      text(g, 'NĂM 1981', 1350, 240, { font: font(900, 58), align: 'center', fill: CREAM });
      revealText(g, 'hỏi tài xế tự đánh giá', 1350, 310, seg(T, t0 + .5, t0 + 1.8), { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      g.restore();
    }, ev() { return [[this.t, 'music', { cue: 'D' }], [this.t, 'amb', { kind: 'night', t1: at('chart93') }]]; } },

    // 10 — biểu đồ tự đánh giá: 93% (Mode B, biểu đồ Thụy Sĩ)
    { n: 'chart93', t: START.chart93, f(g, lt, T) {
      const t0 = L('drv2').t0;
      ground(g, '#12141E');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: '#141A28', s: '#0E121C', l: '#0A0D14', lw: 3 });
      for (let i = 0; i <= 12; i++) line(g, [[240 + i * 120, 240], [240 + i * 120, 760]], '#1E2536', 2);
      for (let i = 0; i <= 5; i++) line(g, [[240, 240 + i * 104], [1680, 240 + i * 104]], '#1E2536', 2);
      text(g, 'mỗi chấm là một tài xế', 960, 170, { font: font(800, 42), align: 'center', fill: CREAM });
      selfRate(g, 300, 640, 1320, seg(T, t0 + 1.0, t0 + 3.0));
      const np = ease.out(seg(T, t0 + 1.3, t0 + 1.9));
      if (np > 0) text(g, '93%', 960, 830, { font: font(900, 120 * np), align: 'center', fill: YEL });
      text(g, 'so với tài xế trung vị', 960, 860, { font: font(400, 32, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { return [[this.t, 'tick'], [L('drv2').t0 + 1.2, 'marker'], [L('drv2').t0 + 2.6, 'pop'], [this.t, 'amb', { kind: 'low', t1: at('replica') }]]; } },

    // 11 — bản lặp lại năm 2023 (Mode B)
    { n: 'replica', t: START.replica, f(g, lt, T) {
      const t0 = L('drv3').t0;
      ground(g, '#12141E');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: '#141A28', s: '#0E121C', l: '#0A0D14', lw: 3 });
      for (let i = 0; i <= 12; i++) line(g, [[240 + i * 120, 300], [240 + i * 120, 700]], '#1E2536', 2);
      selfRate(g, 300, 620, 1320, seg(T, t0 + 1.2, t0 + 3.2), { n: 54, hot: CY });
      text(g, 'BẢN LẶP LẠI · 2023', 960, 190, { font: font(900, 48), align: 'center', fill: CREAM });
      const np = ease.out(seg(T, t0 + 1.0, t0 + 1.6));
      text(g, '1.203', 960, 810, { font: font(900, 116 * np), align: 'center', fill: CY });
      revealText(g, 'người tham gia · kết quả tương tự', 960, 860, seg(T, t0 + 1.4, t0 + 2.6), { font: font(400, 32, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { return [[this.t, 'paper'], [L('drv3').t0 + 1.2, 'marker'], [this.t, 'amb', { kind: 'low', t1: at('half') }]]; } },

    // 12 — nửa số lái xe giỏi hơn bạn (Mode B)
    { n: 'half', t: START.half, f(g, lt, T) {
      const t0 = L('drv4').t0;
      ground(g, '#12141E');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: '#141A28', s: '#0E121C', l: '#0A0D14', lw: 3 });
      selfRate(g, 300, 620, 1320, 1, { n: 54, hot: CY });
      // vùng bên trái đường trung vị: nơi có một nửa người lái xe giỏi hơn bạn
      const ap = ease.out(seg(T, t0 + .8, t0 + 1.6));
      if (ap > 0) {
        g.save(); g.globalAlpha = ap * .9;
        cel(g, rect(300, 440, 960, 660), { f: 'rgba(240,82,91,.22)', s: 'rgba(240,82,91,.10)', l: RED, lw: 5 });
        g.restore();
      }
      if (ap > 0) {
        g.save(); g.globalAlpha = ap;
        line(g, [[960, 380], [960, 700]], RED, 8);
        text(g, 'một nửa lái xe', 630, 400, { font: font(800, 40), align: 'center', fill: RED });
        text(g, 'giỏi hơn bạn', 630, 446, { font: font(800, 40), align: 'center', fill: RED });
        g.restore();
      }
      text(g, 'TRUNG VỊ', 960, 760, { font: font(900, 36), align: 'center', fill: RED });
      text(g, 'không thể quá một nửa', 960, 848, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { return [[this.t, 'marker'], [L('drv4').t0 + .8, 'marker'], [this.t, 'amb', { kind: 'low', t1: at('mirror') }]]; } },

    // 13 — bước sang chuyện khác: soi gương (Mode A)
    { n: 'mirror', t: START.mirror, f(g, lt, T) {
      const t0 = L('bias1').t0;
      deskWall(g, T, { top: 520, lx: 620 });
      kng(g, 1300, 380, {
        s: 1.04, E: ek(T, [[0, 'thinking'], [t0 + 1.6, 'determined']]),
        headYaw: -.3, headPitch: .08, talk: TL.talk(T),
        armR: ak(T, [[0, { at: [150, 250] }], [t0 + .8, { at: [110, 110], gest: 'hold', rot: .4 }]], .4),
      }, T);
      deskSurface(g, T, { top: 520, lx: 620 });
      handMirror(g, 760, 700, 1.0, seg(T, t0 + .6, t0 + 1.1));
      revealText(g, 'còn ở chỗ khác', 960, 300, seg(T, t0 + .05, t0 + .9), { font: font(800, 46), align: 'center', fill: CREAM });
    }, ev() { return [[this.t, 'pop'], [L('bias1').t0 + .6, 'ting'], [this.t, 'amb', { kind: 'room', t1: at('lab79') }]]; } },

    // 14 — phòng thí nghiệm 1979: hai nhóm, một bộ dữ kiện (Mode C)
    { n: 'lab79', t: START.lab79, f(g, lt, T) {
      const t0 = L('bias2').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: '#1A1F2C', s: '#12131A', so: [0, -10], l: '#0A0C14', lw: 3 });
      // hai nhóm ngồi hai bên bàn
      cel(g, rect(340, 720, 1580, 900), { f: '#4A3A28', s: '#2A2118', so: [0, 12], l: '#0E0B08', lw: 3.4 });
      evidenceSheet(g, 960, 700, -.02, { title: 'BỘ DỮ KIỆN' });
      S.person(g, 300, 900, .82, '#33405A', { ph: 0 });
      S.person(g, 1620, 900, .82, '#3A4260', { ph: 0 });
      // nhãn hai nhóm
      text(g, 'NHÓM ỦNG HỘ', 300, 300, { font: font(900, 40), align: 'center', fill: '#2F6B3A' });
      text(g, 'NHÓM PHẢN ĐỐI', 1620, 300, { font: font(900, 40), align: 'center', fill: '#8A2B2B' });
      revealText(g, 'năm 1979 · ba nhà tâm lý học', 960, 210, seg(T, t0 + .6, t0 + 2.2), { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      revealText(g, 'cùng đọc một bộ dữ kiện', 960, 260, seg(T, t0 + 1.4, t0 + 2.8), { font: font(800, 44), align: 'center', fill: CREAM });
      // hai người chỉ vào cùng một tờ
      const ap = seg(T, t0 + 2.6, t0 + 3.4);
      if (ap > 0) {
        g.globalAlpha = ap;
        line(g, [[380, 800], [700, 720]], YEL, 7);
        line(g, [[1540, 800], [1220, 720]], YEL, 7);
        g.globalAlpha = 1;
      }
      // Rối ngồi ở góc bàn, theo dõi
      roi(g, 960, 962, 1.1, { t: T, E: { mo: .4, lookX: -.1 } });
    }, ev() { return [[this.t, 'paper'], [this.t, 'amb', { kind: 'room', t1: at('two') }]]; } },

    // 15 — nhóm ủng hộ: mạnh / yếu (Mode B)
    { n: 'two', t: START.two, f(g, lt, T) {
      const t0 = L('bias3').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      // tờ dữ kiện ở giữa, hai thẻ đánh giá hai bên
      evidenceSheet(g, 960, 570, -.015, { title: 'BỘ DỮ KIỆN' });
      verdictCard(g, 470, 640, 340, 240, -.05, 'ỦNG HỘ', true, seg(T, t0 + .5, t0 + 1.3));
      verdictCard(g, 1450, 640, 340, 240, .05, 'CHỐNG LẠI', false, seg(T, t0 + 1.6, t0 + 2.4));
      revealText(g, 'bằng chứng ủng hộ thì mạnh', 960, 196, seg(T, t0 + .2, t0 + 1.4), { font: font(800, 42), align: 'center', fill: CREAM });
      revealText(g, 'bằng chứng chống lại thì yếu', 960, 252, seg(T, t0 + .8, t0 + 1.8), { font: font(400, 40, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { return [[this.t, 'paper'], [L('bias3').t0 + .8, 'pop'], [L('bias3').t0 + 2.4, 'pop'], [this.t, 'amb', { kind: 'room', t1: at('twob') }]]; } },

    // 16 — hai kết luận ngược nhau (Mode D, đối chiếu)
    { n: 'twob', t: START.twob, f(g, lt, T) {
      const t0 = L('bias4').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: '#1A1F2C', s: '#12131A', so: [0, -10], l: '#0A0C14', lw: 3 });
      // cột bên trái và cột bên phải, cùng dữ kiện
      const p = ease.out(seg(T, t0 + .6, t0 + 1.4));
      cel(g, rect(360, 300, 900, 800), { f: '#F7F2E4', s: '#D8D0BC', so: [10, 12], l: INK2, lw: 3.4 });
      cel(g, rect(1020, 300, 1560, 800), { f: '#F7F2E4', s: '#D8D0BC', so: [10, 12], l: INK2, lw: 3.4 });
      text(g, 'ỦNG HỘ', 630, 360, { font: font(900, 42), align: 'center', fill: '#2F6B3A' });
      text(g, 'PHẢN ĐỐI', 1290, 360, { font: font(900, 42), align: 'center', fill: '#8A2B2B' });
      const rows = [['bằng chứng ủng hộ', 1], ['bằng chứng chống lại', 0]];
      rows.forEach((r, i) => {
        const y = 470 + i * 150;
        text(g, r[0], 630, y, { font: font(400, 32, 'Patrick Hand'), align: 'center', fill: GREY });
        text(g, r[0], 1290, y, { font: font(400, 32, 'Patrick Hand'), align: 'center', fill: GREY });
        const q = ease.back(seg(T, t0 + 1.2 + i * .8, t0 + 1.8 + i * .8));
        if (q > 0) {
          g.save(); g.globalAlpha = q;
          text(g, i === 0 ? 'MẠNH' : 'YẾU', 630, y + 66, { font: font(900, 62), align: 'center', fill: '#2F6B3A' });
          text(g, i === 0 ? 'YẾU' : 'MẠNH', 1290, y + 66, { font: font(900, 62), align: 'center', fill: '#8A2B2B' });
          g.restore();
        }
      });
      // đường phân chia
      line(g, [[960, 260], [960, 840]], '#5A6488', 5);
      revealText(g, 'cùng dữ kiện, hai kết luận', 960, 200, seg(T, t0 + .4, t0 + 2.0), { font: font(900, 46), align: 'center', fill: CREAM });
    }, ev() { return [[this.t, 'pop'], [L('bias4').t0 + 1.2, 'pop'], [L('bias4').t0 + 2.0, 'pop'], [this.t, 'amb', { kind: 'room', t1: at('n151') }]]; } },

    // 17 — 151 sinh viên (Mode B, thẻ nguồn)
    { n: 'n151', t: START.n151, f(g, lt, T) {
      const t0 = L('bias5').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      evidenceSheet(g, 960, 520, .015, { title: 'BỘ DỮ KIỆN', foot: 'LORD · ROSS · LEPPER · 1979' });
      // những người ngồi hai bên không ai chịu đổi ý
      const n = 15;
      for (let i = 0; i < n; i++) {
        const side = i % 2 ? 1 : -1, k = Math.floor(i / 2);
        const x = 960 + side * (420 + k * 42), y = 760 + (k % 3) * 26;
        cel(g, ellP(x, y, 20, 20), { f: side > 0 ? '#8A2B2B' : '#2F6B3A', s: mix(side > 0 ? '#8A2B2B' : '#2F6B3A', '#12131A', .35), so: [3, 3], l: INK2, lw: 2 });
      }
      const np = ease.out(seg(T, t0 + .6, t0 + 1.2));
      text(g, '151', 960, 210, { font: font(900, 130 * np), align: 'center', fill: INK2 });
      text(g, 'sinh viên · không ai chịu đổi ý', 960, 268, { font: font(800, 44), align: 'center', fill: INK2 });
      revealText(g, 'họ gọi đó là đồng hóa thiên lệch', 960, 856, seg(T, t0 + .3, t0 + 1.6), { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: GREY });
    }, ev() { return [[this.t, 'paper'], [L('bias5').t0 + .6, 'pop'], [this.t, 'amb', { kind: 'room', t1: at('bk1') }]]; } },

    // 18 — lời đồn: càng đính chính càng tin (Mode A, bảng tin)
    { n: 'bk1', t: START.bk1, f(g, lt, T) {
      const t0 = L('bk1').t0;
      ground(g, '#0E131D');
      cel(g, rect(-200, 800, W + 200, 880), { f: '#3A2E20', s: '#241C14', so: [0, 10], l: '#0E0B08', lw: 3 });
      cel(g, rect(-200, 880, W + 200, H + 200), { f: '#1A140E', l: '#0E0B08', lw: 3 });
      newsBoard(g, T, { title: 'BẢNG TIN · NĂM 2010', on: 3 });
      // phần đính chính nằm dưới bài báo
      const sp = ease.out(seg(T, t0 + 2.6, t0 + 3.4));
      if (sp > 0) {
        g.save(); g.globalAlpha = sp;
        cel(g, rect(520, 470, 1440, 560), { f: '#FFE9A6', s: '#D8C58A', so: [6, 8], l: INK2, lw: 2.6 });
        text(g, 'ĐÍNH CHÍNH: Iraq không có vũ khí hủy diệt', 980, 528, { font: font(800, 30), align: 'center', fill: INK2 });
        g.restore();
      }
      revealText(g, 'lời đồn phổ biến', 960, 92, seg(T, t0 + .4, t0 + 1.8), { font: font(800, 42), align: 'center', fill: CREAM });
      stamp(g, 'LỜI ĐỒN', 1460, 790, { rot: -.1, px: 60, p: ease.out(seg(T, t0 + 2.2, t0 + 2.6)) });
      // câu "năm 2010, hai nhà nghiên cứu đo được hiệu ứng bật ngược" → con dấu đỏ đập lên bảng tin
      const tb = L('bk2').t0;
      stamp(g, 'BẬT NGƯỢC', 700, 690, { rot: -.08, px: 64, p: ease.out(seg(T, tb + .3, tb + .7)) });
    }, ev() { return [[this.t, 'pop'], [L('bk1').t0 + 2.2, 'stamp'], [L('bk2').t0 + .3, 'stamp'], [this.t, 'music', { cue: 'E' }], [this.t, 'amb', { kind: 'low', t1: at('bk32') }]]; } },

    // 19 — 32% lên 64% (Mode B, biểu đồ giấy)
    { n: 'bk32', t: START.bk32, f(g, lt, T) {
      const t0 = L('bk3').t0, t4 = L('bk4').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      // hai cột: nhóm đối chứng và nhóm được đính chính
      const BASE = 400, x1 = 700, x2 = 1220;
      const h32 = BASE * .32, h64 = BASE * .64;
      const p = ease.out(seg(T, t0 + 1.2, t0 + 2.2));
      cel(g, rect(x1 - 110, 760 - h32, x1 + 110, 760), { f: '#8C8474', s: '#6E6757', so: [6, 6], l: INK2, lw: 3 });
      cel(g, rect(x2 - 110, 760 - h64 * p, x2 + 110, 760), { f: RED, s: '#A8321F', so: [6, 6], l: INK2, lw: 3 });
      line(g, [[420, 760], [1500, 760]], '#8A8274', 5);
      text(g, '32%', x1, 760 - h32 - 30, { font: font(900, 78), align: 'center', fill: GREY });
      if (p > .9) text(g, '64%', x2, 760 - h64 - 30, { font: font(900, 78), align: 'center', fill: RED });
      text(g, 'không đính chính', x1, 812, { font: font(700, 34), align: 'center', fill: GREY });
      text(g, 'được đính chính', x2, 812, { font: font(700, 34), align: 'center', fill: RED });
      revealText(g, 'nhóm bảo thủ đồng ý Iraq có vũ khí hủy diệt', 960, 210, seg(T, t4 + .4, t4 + 2.2), { font: font(800, 40), align: 'center', fill: CREAM });
      revealText(g, '4 thí nghiệm · 2 ra hiệu ứng', 960, 264, seg(T, t0 + .4, t0 + 2.0), { font: font(400, 36, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      // mũi tên đi lên giữa hai cột
      const ap = seg(T, t0 + 1.4, t0 + 2.0);
      if (ap > 0) {
        g.globalAlpha = ap;
        line(g, [[960, 640], [960, 420]], RED, 9);
        line(g, [[960, 420], [928, 472]], RED, 9);
        line(g, [[960, 420], [992, 472]], RED, 9);
        g.globalAlpha = 1;
      }
    }, ev() { return [[this.t, 'paper'], [L('bk3').t0 + 1.2, 'marker'], [L('bk4').t0 + 1.4, 'pop'], [this.t, 'amb', { kind: 'low', t1: at('bkscare') }]]; } },

    // 20 — im lặng trước cú lật (Mode D)
    { n: 'bkscare', t: START.bkscare, f(g, lt, T) {
      const t0 = L('bk5').t0;
      ground(g, '#0E1119');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#181C28', s: '#12151F', l: '#0B0E16', lw: 3 });
      focusLines(g, 960, 470, T, '#22283A', 60, 340);
      // con dấu đỏ chồng lên lời đồn
      const p = ease.out(seg(T, t0 + .5, t0 + .9));
      if (p > 0) {
        g.save(); g.globalAlpha = p; g.translate(960, 470); g.rotate(-.08);
        cel(g, rect(-520, -230, 520, 230), { f: '#E7E1D0', s: '#C4BCA6', so: [12, 16], l: INK2, lw: 3.4 });
        text(g, 'CÀNG ĐÍNH CHÍNH', -480, -70, { font: font(900, 72), fill: INK2 });
        text(g, 'CÀNG TIN MÌNH', -480, 20, { font: font(900, 72), fill: INK2 });
        g.restore();
        if (p > .6) stamp(g, 'CHƯA KIỂM', 1330, 560, { rot: -.12, px: 84, p: ease.out(seg(T, t0 + .9, t0 + 1.3)) });
      }
      text(g, 'đây mới là chỗ đáng sợ', 960, 800, { font: font(900, 56), align: 'center', fill: CREAM });
    }, ev() { return [[this.t - .7, 'silence', { t: this.t - .7, t1: this.t + .15 }], [this.t, 'stamp'], [this.t, 'amb', { kind: 'low', t1: at('wall52') }]]; } },

    // 21 — năm thí nghiệm mới, 52 vấn đề (Mode B, tường thẻ)
    { n: 'wall52', t: START.wall52, f(g, lt, T) {
      const t0 = L('turn1').t0, t2 = L('turn2').t0;
      ground(g, '#12141E');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1B2032', s: '#12161F', l: '#0B0E16', lw: 3 });
      issueWall(g, T, { t0: t0 + .6 });
      revealText(g, 'năm 2019 · hai nhà nghiên cứu khác · 5 thí nghiệm', 960, 150, seg(T, t0 + .4, t0 + 2.0), { font: font(800, 44), align: 'center', fill: CREAM });
      const np = ease.out(seg(T, t2 + .05, t2 + .5));
      text(g, '52 vấn đề', 620, 830, { font: font(900, 72 * np), align: 'center', fill: YEL });
      text(g, '10.100+ người', 1300, 830, { font: font(900, 72 * np), align: 'center', fill: CY });
    }, ev() { return [[this.t, 'music', { cue: 'F' }], [this.t, 'paper'], [this.t, 'amb', { kind: 'low', t1: at('zero') }]]; } },

    // 22 — không một trường hợp nào bật ngược (Mode D)
    { n: 'zero', t: START.zero, f(g, lt, T) {
      const t0 = L('turn3').t0;
      ground(g, '#12141E');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1B2032', s: '#12161F', l: '#0B0E16', lw: 3 });
      issueWall(g, T, { t0: START.wall52 + .6, stamp: t0 + .4 });
      const np = ease.out(seg(T, t0 - .3, t0 + .2));
      if (np > 0) {
        g.save(); g.globalAlpha = np;
        cel(g, rect(600, 300, 1320, 620), { f: '#0E1119', s: '#0A0C12', so: [10, 12], l: '#2A3140', lw: 4 });
        text(g, '0', 960, 520, { font: font(900, 280 * np), align: 'center', fill: CREAM });
        g.restore();
      }
    }, ev() { return [[L('turn3').t0 + .4, 'stamp'], [this.t, 'amb', { kind: 'low', t1: at('why') }]]; } },

    // 23 — vì sao: câu hỏi phức tạp, phần đính chính bị bỏ qua (Mode C)
    { n: 'why', t: START.why, f(g, lt, T) {
      const t0 = L('turn4').t0;
      deskTop(g, T, { lx: 780, ly: 300 });
      // tờ câu hỏi dài, nằm đè lên mục đính chính
      g.save(); g.translate(960, 560); g.rotate(-.015);
      cel(g, rect(-560, -300, 560, 300), { f: '#F3EEDF', s: '#C9C2B0', so: [12, 16], l: INK2, lw: 3.4 });
      cel(g, rect(-560, -300, 560, -230), { f: NAVY, l: INK2, lw: 2.4 });
      text(g, 'CÂU HỎI DÀI, NHIỀU MỆNH ĐỀ', -530, -252, { font: font(900, 30), fill: PAPER });
      for (let i = 0; i < 9; i++) line(g, [[-530, -196 + i * 38], [530 - ((i * 61) % 6) * 24, -196 + i * 38]], '#4A4436', 7);
      g.restore();
      // tay nhấc tờ câu hỏi lên, lộ ra mục đính chính bị che
      const lift = ease.inOut(seg(T, t0 + 1.6, t0 + 3.0));
      g.save(); g.translate(960, 560 - lift * 210); g.rotate(-.015 - lift * .12);
      cel(g, rect(-560, -300, 560, 300), { f: '#F3EEDF', s: '#C9C2B0', so: [12, 16], l: INK2, lw: 3.4 });
      cel(g, rect(-560, -300, 560, -230), { f: NAVY, l: INK2, lw: 2.4 });
      text(g, 'CÂU HỎI DÀI, NHIỀU MỆNH ĐỀ', -530, -252, { font: font(900, 30), fill: PAPER });
      for (let i = 0; i < 9; i++) line(g, [[-530, -196 + i * 38], [530 - ((i * 61) % 6) * 24, -196 + i * 38]], '#4A4436', 7);
      g.restore();
      if (lift > .1) {
        g.save(); g.globalAlpha = lift;
        cel(g, rect(560, 640, 1360, 760), { f: '#FFE9A6', s: '#D8C58A', so: [6, 8], l: INK2, lw: 2.6 });
        text(g, 'ĐÍNH CHÍNH: không có vũ khí hủy diệt', 960, 712, { font: font(800, 34), align: 'center', fill: INK2 });
        g.restore();
      }
      revealText(g, 'người ta đọc câu hỏi, bỏ qua cả phần đính chính', 960, 210, seg(T, t0 + .6, t0 + 2.6), { font: font(800, 44), align: 'center', fill: CREAM });
      text(g, '0 trường hợp bật ngược', 960, 830, { font: font(800, 42), align: 'center', fill: YEL });
      bigHand(g, 1450, 430 - lift * 190, -.5 + lift * .3, { gest: blendGest(GEST.relaxed, GEST.pinch, seg(T, t0 + 1.4, t0 + 2.0)), flip: true });
    }, ev() { return [[this.t, 'paper'], [L('turn4').t0 + 1.6, 'swish'], [L('turn4').t0 + 2.2, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('mech') }]]; } },

    // 24 — cơ chế: không phải vì cố ý, mà vì không đọc (Mode A)
    { n: 'mech', t: START.mech, f(g, lt, T) {
      const t0 = L('mech1').t0;
      deskWall(g, T, { top: 520, lx: 640 });
      kng(g, 1120, 380, {
        s: 1.02, E: ek(T, [[0, 'thinking'], [t0 + 2.2, 'determined']]),
        headYaw: -.2, headPitch: .1, talk: TL.talk(T),
        armR: ak(T, [[0, { at: [150, 250] }], [t0 + 1.4, { at: [190, 150], gest: 'point', rot: .5 }]], .4),
      }, T);
      deskSurface(g, T, { top: 520, lx: 640 });
      // đống giấy chưa đọc ở bên phải
      stack(g, 1480, 700, 6, .05, { w: 250, h: 160, clip: { headCol: '#8A2B2B' } });
      revealText(g, 'phần lớn việc bám niềm tin', 860, 250, seg(T, t0 + .6, t0 + 1.8), { font: font(800, 46), align: 'center', fill: CREAM });
      revealText(g, 'mà vì ta không đọc', 860, 312, seg(T, t0 + 1.8, t0 + 2.8), { font: font(800, 46), align: 'center', fill: YEL });
    }, ev() { return [[this.t, 'paper'], [this.t, 'amb', { kind: 'room', t1: at('mech2') }]]; } },

    // 25 — đính chính vẫn hơn không đính chính (Mode B, thẻ nguồn)
    { n: 'mech2', t: START.mech2, f(g, lt, T) {
      const t0 = L('mech2').t0;
      deskTop(g, T, { lx: 900, ly: 320 });
      g.save(); g.translate(960, 560); g.rotate(.014);
      cel(g, rect(-600, -230, 600, 230), { f: '#F7F2E4', s: '#D8D0BC', so: [14, 18], l: INK2, lw: 3.4 });
      cel(g, rect(-600, -230, 600, -166), { f: NAVY, l: INK2, lw: 2.4 });
      text(g, 'TỔNG HỢP CÁC NGHIÊN CỨU ĐÍNH CHÍNH', -570, -186, { font: font(900, 32), fill: PAPER });
      revealText(g, 'được đính chính', -560, -70, seg(T, t0 + .6, t0 + 1.8), { font: font(900, 68), fill: '#2F6B3A' });
      text(g, 'vẫn hơn', 40, -70, { font: font(900, 68), align: 'center', fill: INK2 });
      revealText(g, 'không được đính chính', -560, 30, seg(T, t0 + 1.6, t0 + 2.8), { font: font(900, 68), fill: '#8A2B2B' });
      line(g, [[-560, 96], [560, 96]], '#B9AE95', 5);
      revealText(g, 'WALTER & TUKACHINSKY · 2020', -560, 160, seg(T, t0 + 2.0, t0 + 3.0), { font: font(800, 32), fill: AMBER });
      g.restore();
    }, ev() { return [[this.t, 'paper'], [L('mech2').t0 + 1.6, 'pop'], [this.t, 'amb', { kind: 'room', t1: at('mech3') }]]; } },

    // 26 — bật ngược thì hiếm (Mode B, Rối ở góc)
    { n: 'mech3', t: START.mech3, f(g, lt, T) {
      const t0 = L('mech3').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      // một cây bóng yếu dần, và cây "không" sáng lên
      const p = ease.out(seg(T, t0 + .8, t0 + 1.6));
      cel(g, rect(420, 330, 1500, 700), { f: '#8C8474', s: '#6E6757', so: [8, 10], l: INK2, lw: 3.4 });
      text(g, 'BẬT NGƯỢC', 960, 560, { font: font(900, 110), align: 'center', fill: '#6E6757' });
      if (p > 0) {
        g.save(); g.globalAlpha = p;
        cel(g, rect(420, 330, 1500, 700), { f: '#2F6B3A', s: '#255530', so: [8, 10], l: INK2, lw: 3.4 });
        text(g, 'HIẾM', 960, 560, { font: font(900, 130), align: 'center', fill: '#F7F2E4' });
        g.restore();
      }
      revealText(g, 'bật ngược thì hiếm', 960, 300, seg(T, t0 + .4, t0 + 1.6), { font: font(800, 42), align: 'center', fill: CREAM });
      revealText(g, 'do cách hỏi', 960, 770, seg(T, t0 + 1.4, t0 + 2.4), { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      if (T > t0 + .4) pip(g, 380, 780, 110, ease.back(seg(T, t0 + .4, t0 + .9)), (gg, r) => {
        gg.fillStyle = '#F3EEDF'; gg.fillRect(-r, -r, 2 * r, 2 * r);
        roi(gg, 0, 10, r / 110 * 1.8, { t: T, E: { mo: .45, lookX: .3 } });
      });
    }, ev() { return [[this.t, 'pop'], [this.t + .4, 'boing'], [this.t, 'amb', { kind: 'room', t1: at('act1') }]]; } },

    // 27 — hành động: hai việc (Mode A)
    { n: 'act1', t: START.act1, f(g, lt, T) {
      const t0 = L('act1').t0;
      deskWall(g, T, { top: 520, lx: 620 });
      kng(g, 1340, 380, {
        s: 1.02, E: ek(T, [[0, 'determined'], [t0 + 1.8, 'happy']]),
        headYaw: -.16, headPitch: .06, talk: TL.talk(T),
      }, T);
      deskSurface(g, T, { top: 520, lx: 620 });
      handMirror(g, 620, 700, .95, seg(T, t0 + .5, t0 + 1.0));
      notebook(g, 1180, 760, .04, { title: 'sổ tay' });
      revealText(g, 'có hai việc, đều làm được ngay', 820, 250, seg(T, t0 + .4, t0 + 1.8), { font: font(900, 48), align: 'center', fill: CREAM });
      text(g, 'MỘT', 620, 430, { font: font(900, 52), align: 'center', fill: YEL });
      text(g, 'HAI', 1180, 430, { font: font(900, 52), align: 'center', fill: YEL });
      g.restore?.();
    }, ev() { return [[this.t, 'pop'], [L('act1').t0 + .5, 'ting'], [this.t, 'music', { cue: 'G' }], [this.t, 'amb', { kind: 'room', t1: at('act2') }]]; } },

    // 28 — hành động một: xét ngược lại (Mode C close)
    { n: 'act2', t: START.act2, f(g, lt, T) {
      const t0 = L('act2').t0;
      deskTop(g, T, { lx: 820, ly: 300 });
      // tờ giấy và bản soi ngược của nó
      g.save(); g.translate(860, 520); g.rotate(-.02);
      cel(g, rect(-380, -250, 380, 250), { f: '#F3EEDF', s: '#C9C2B0', so: [12, 16], l: INK2, lw: 3.4 });
      for (let i = 0; i < 6; i++) line(g, [[-350, -200 + i * 60], [350 - ((i * 43) % 4) * 30, -200 + i * 60]], '#4A4436', 7);
      g.restore();
      handMirror(g, 1420, 620, 1.0, seg(T, t0 + 1.2, t0 + 1.7));
      revealText(g, 'xét ngược lại', 860, 250, seg(T, t0 + .4, t0 + 1.4), { font: font(900, 62), align: 'center', fill: YEL });
      revealText(g, 'bắt người ta cân nhắc chiều ngược lại thì cái thiên lệch giảm', 960, 830, seg(T, t0 + 1.4, t0 + 3.4), { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: GREY });
      revealText(g, 'LORD · LEPPER · PRESTON · 1985', 960, 866, seg(T, t0 + 2.0, t0 + 3.0), { font: font(800, 30), align: 'center', fill: AMBER });
    }, ev() { return [[this.t, 'paper'], [L('act2').t0 + 1.2, 'ting'], [this.t, 'amb', { kind: 'room', t1: at('act3') }]]; } },

    // 29 — hành động hai: viết ra trước điều sẽ khiến mình đổi ý (Mode B, thẻ)
    { n: 'act3', t: START.act3, f(g, lt, T) {
      const t0 = L('act3').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: '#1A1F2C', s: '#12131A', so: [0, -10], l: '#0A0C14', lw: 3 });
      g.save(); g.translate(960, 520); g.rotate(.012);
      cel(g, rect(-620, -250, 620, 250), { f: '#F7F2E4', s: '#D8D0BC', so: [14, 18], l: INK2, lw: 3.4 });
      cel(g, rect(-620, -250, 620, -186), { f: '#2F6B3A', l: INK2, lw: 2.4 });
      text(g, 'ĐIỀU RĂN THỨ NĂM', -590, -204, { font: font(900, 32), fill: PAPER });
      revealText(g, 'viết ra trước điều gì', -580, -90, seg(T, t0 + .6, t0 + 1.8), { font: font(400, 46, 'Patrick Hand'), fill: INK2 });
      revealText(g, 'sẽ khiến mình đổi ý', -580, -24, seg(T, t0 + 1.4, t0 + 2.6), { font: font(400, 46, 'Patrick Hand'), fill: INK2 });
      line(g, [[-580, 40], [580, 40]], '#B9AE95', 5);
      revealText(g, 'TETLOCK & GARDNER · 2015', -580, 110, seg(T, t0 + 1.8, t0 + 2.8), { font: font(800, 32), fill: AMBER });
      g.restore();
      bigHand(g, 1420, 720, -.4, { gest: blendGest(GEST.relaxed, GEST.thumb, seg(T, t0 + .6, t0 + 1.4)), flip: true });
    }, ev() { return [[this.t, 'paper'], [L('act3').t0 + 1.4, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('act4') }]]; } },

    // 30 — viết dòng trong sổ (Mode C close)
    { n: 'act4', t: START.act4, f(g, lt, T) {
      const t0 = L('act4').t0;
      deskTop(g, T, { lx: 900, ly: 300 });
      notebook(g, 900, 560, -.03, { title: 'sổ tay' });
      const w1 = seg(T, t0 + .8, t0 + 2.0), w2 = seg(T, t0 + 2.6, t0 + 3.8);
      revealText(g, 'điều gì sẽ khiến mình đổi ý:', 520, 430, w1, { font: font(400, 52, 'Patrick Hand'), fill: INK2 });
      revealText(g, '…', 520, 520, w2, { font: font(400, 52, 'Patrick Hand'), fill: GREY });
      // bút đang viết
      const hp = ease.out(seg(T, t0 + 1.0, t0 + 1.6));
      bigHand(g, lerp(1420, 1180, hp), lerp(700, 560, hp), -.55 + hp * .2, {
        gest: blendGest(GEST.relaxed, GEST.hold, seg(T, t0 + .8, t0 + 1.4)),
        prop: gg => penProp(gg),
      });
      revealText(g, 'mỗi lần đọc một tin mình thích, mở sổ ra', 960, 800, seg(T, t0 + .2, t0 + 2.0), { font: font(800, 40), align: 'center', fill: CREAM });
      // Rối ở góc bàn, nghiêng đầu nhìn dòng đang viết
      roi(g, 1660, 700, 1.5, { t: T, E: { mo: .45, lookX: -.35 } });
    }, ev() { return [[this.t, 'paper'], [L('act4').t0 + 1.0, 'marker'], [L('act4').t0 + 2.6, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('act5') }]]; } },

    // 31 — đọc phần đính chính (Mode C close)
    { n: 'act5', t: START.act5, f(g, lt, T) {
      const t0 = L('act5').t0;
      deskTop(g, T, { lx: 820, ly: 280 });
      // tờ bài báo với đoạn đính chính tô vàng
      g.save(); g.translate(900, 520); g.rotate(-.02);
      cel(g, rect(-520, -320, 520, 320), { f: '#F3EEDF', s: '#C9C2B0', so: [12, 16], l: INK2, lw: 3.4 });
      cel(g, rect(-520, -320, 520, -252), { f: NAVY, l: INK2, lw: 2.4 });
      text(g, 'BÀI BÁO', -490, -272, { font: font(900, 30), fill: PAPER });
      for (let i = 0; i < 5; i++) line(g, [[-490, -214 + i * 40], [490 - ((i * 47) % 4) * 26, -214 + i * 40]], '#4A4436', 7);
      g.restore();
      const hp = ease.out(seg(T, t0 + .8, t0 + 1.6));
      if (hp > 0) {
        g.save(); g.globalAlpha = hp;
        cel(g, rect(380, 700, 1420, 820), { f: '#FFE9A6', s: '#D8C58A', so: [6, 8], l: INK2, lw: 2.6 });
        text(g, 'ĐÍNH CHÍNH', 400, 770, { font: font(900, 40), fill: INK2 });
        revealText(g, 'đọc nó', 760, 770, seg(T, t0 + 1.0, t0 + 2.0), { font: font(400, 44, 'Patrick Hand'), fill: INK2 });
        g.restore();
      }
      bigHand(g, 1520, 780, .3, { gest: GEST.hold, flip: true });
      text(g, 'đọc phần đính chính', 960, 250, { font: font(800, 44), align: 'center', fill: CREAM });
    }, ev() { return [[this.t, 'paper'], [L('act5').t0 + 1.4, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('hop') }]]; } },

    // 32 — hy vọng: dự báo tốt hơn (Mode B)
    { n: 'hop', t: START.hop, f(g, lt, T) {
      const t0 = L('hop1').t0;
      ground(g, '#12141E');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: '#141A28', s: '#0E121C', l: '#0A0D14', lw: 3 });
      drawSunburst(g, 960, 780, .2, { rays: 18, r: 1200, col1: '#1E2A3C', col2: '#141A28' });
      for (let i = 0; i <= 12; i++) line(g, [[240 + i * 120, 300], [240 + i * 120, 720]], '#1E2536', 2);
      // đường đi lên của độ chính xác
      const p = ease.out(seg(T, t0 + .8, t0 + 2.6));
      g.save(); g.beginPath(); g.rect(240, 240, 1440, 520); g.clip();
      g.strokeStyle = CY; g.lineWidth = 11; g.lineCap = 'round'; g.lineJoin = 'round';
      g.beginPath();
      for (let i = 0; i <= 24; i++) { const u = i / 24 * p, xx = 300 + u * 1300, yy = 700 - Math.pow(u, .8) * 330; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
      g.stroke(); g.restore();
      for (let i = 0; i < 5; i++) {
        const u = i / 4, xx = 300 + u * 1300 * p, yy = 700 - Math.pow(u * p, .8) * 330;
        cel(g, ellP(xx, yy, 13, 13), { f: CY, s: '#22B8D6', so: [3, 3], l: '#12131A', lw: 2 });
      }
      const np = ease.out(seg(T, t0 + .1, t0 + .7));
      text(g, '20.000+', 520, 300, { font: font(900, 74 * np), align: 'center', fill: CREAM });
      text(g, 'người dự báo', 520, 350, { font: font(700, 30), align: 'center', fill: GREY });
      text(g, '60 phút', 960, 300, { font: font(900, 74 * np), align: 'center', fill: CREAM });
      text(g, 'một buổi huấn luyện', 960, 350, { font: font(700, 30), align: 'center', fill: GREY });
      text(g, '+10%', 1400, 300, { font: font(900, 74 * np), align: 'center', fill: YEL });
      text(g, 'độ chính xác', 1400, 350, { font: font(700, 30), align: 'center', fill: GREY });
      revealText(g, 'TETLOCK & GARDNER · SUPERFORECASTING', 960, 200, seg(T, t0 + .4, t0 + 1.6), { font: font(800, 34), align: 'center', fill: PAL.muted });
      revealText(g, 'cải thiện được bằng cách cập nhật, không phải bằng tài năng', 960, 790, seg(T, t0 + 1.6, t0 + 3.0), { font: font(400, 36, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { return [[this.t, 'tick'], [L('hop1').t0 + 1.4, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('roi2') }]]; } },

    // 33 — Rối nói (Mode B)
    { n: 'roi2', t: START.roi2, f(g, lt, T) {
      const t0 = L('roi').t0;
      deskScene(g, T, { top: 560, lx: 640 });
      roi(g, 420, 720, 2.6, { t: T, E: { mo: .5, lookX: .2 } });
      bubble(g, 1180, 400, 1080, 300, (gg) => {
        text(gg, 'NÃO BẠN KHÔNG GHÉT BẠN', 0, -54, { font: font(900, 52), align: 'center', base: 'middle', fill: PAL.violet.f });
        text(gg, 'NÓ CHỈ KHÔNG ĐỌC', 0, 30, { font: font(900, 56), align: 'center', base: 'middle', fill: PAL.violet.f });
      }, { tail: 'left' });
      if (T > t0 + .6) drawSparkle(g, 620, 520, 26, YEL, T);
    }, ev() { return [[this.t, 'pop'], [this.t + .3, 'boing'], [this.t, 'amb', { kind: 'room', t1: at('close') }]]; } },

    // 34 — kết (Mode A)
    { n: 'close', t: START.close, f(g, lt, T) {
      const t0 = L('close').t0;
      deskWall(g, T, { top: 520, lx: 620 });
      kng(g, 1330, 390, {
        s: 1.06, E: ek(T, [[0, 'thinking'], [t0 + 2.4, 'smile']]),
        headYaw: -.14, headPitch: .08, talk: TL.talk(T),
        armL: ak(T, [[0, { at: [-150, 250] }], [t0 + 1.2, { at: [-140, 150], gest: 'hold', rot: -.3 }]], .4),
      }, T);
      deskSurface(g, T, { top: 520, lx: 620 });
      notebook(g, 700, 780, -.04, { title: 'sổ tay' });
      revealText(g, 'đọc phần đính chính là việc của bạn', 780, 300, seg(T, t0 + .8, t0 + 2.4), { font: font(800, 42), align: 'center', fill: YEL });
      text(g, '02:31', 78, 128, { font: font(900, 66), fill: PAL.muted });
    }, ev() { return [[this.t, 'paper'], [this.t, 'amb', { kind: 'room', t1: at('next') }]]; } },

    // 35 — thẻ cuối (Mode A)
    { n: 'next', t: START.next, f(g, lt, T) {
      const t0 = L('next').t0, endT = L('next').t1 + .5;
      deskWall(g, T, { top: 560 });
      kng(g, 1330, 400, {
        s: 1.0, E: ek(T, [[0, 'talk'], [t0 + 2.6, 'smile'], [endT + .4, 'happy']]),
        headYaw: -.12, talk: TL.talk(T),
        armL: ak(T, [[0, { at: [-150, 250] }], [endT + .4, { at: [-190, -70], gest: 'open', rot: -.1 }]], .3),
      }, T);
      deskSurface(g, T, { top: 560 });
      const p = ease.back(seg(lt, .05, .6));
      if (p > 0) {
        g.save(); g.translate(580 - (1 - p) * 700, 600); g.rotate(-.03);
        cel(g, rect(-370, -180, 370, 180), { f: '#F3EEDF', s: '#C9C2B0', so: [14, 18], l: INK2, lw: 3.4 });
        cel(g, ellP(-230, -170, 15, 15), { f: PAL.red.f, s: PAL.red.s, so: [-4, -4], l: PAL.red.l, lw: 2 });
        text(g, 'TRẠM', -330, -98, { font: font(900, 74), fill: INK2 });
        text(g, 'NGHĨ NHIỀU', -330, -14, { font: font(900, 74), fill: INK2 });
        text(g, 'TẬP SAU', -330, 50, { font: font(400, 36, 'Patrick Hand'), fill: GREY });
        text(g, 'Tại sao ta hay trả lời theo thói quen?', -330, 112, { font: font(800, 34), fill: INK2 });
        g.restore();
      }
      text(g, '02:31', 78, 128, { font: font(900, 66), fill: PAL.muted });
    }, ev() { return [[L('next').t1 + .3, 'paper'], [L('next').t1 + .3, 'music', { cue: 'end' }]]; } },
  ];
}

// ——— chuyển cảnh ———
function drawShot(g, i, T) { const sh = SHOTS[i]; REG.id = sh.n; g.save(); sh.f(g, T - sh.t, T); g.restore(); }
function drawSharp(g, texts, dx) { for (const t of texts) sharpText(g, t, dx); }
function smear(g, i, T, dx) {
  const list = REG.list; REG.list = [];
  B.setTransform(1, 0, 0, 1, 0, 0); B.clearRect(0, 0, W, H);
  REG.skip = true; drawShot(B, i, T); REG.skip = false;
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
  else drawShot(g, i, T);
  // vân giấy + hạt phim: bề mặt in, không phải vector phẳng
  applyPaperTexture(g, .16, true);
  renderGrainFx(g, T, 190);
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
