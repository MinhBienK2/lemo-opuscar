// "Hiệu ứng Chim Mồi" — Tập 06 của Trạm Nghĩ Nhiều (series Tâm lý hành vi).
// Mọi cảnh là hàm của thời gian cục bộ; mọi mốc thời gian đến từ timeline.js (giọng đọc thật).
// Hợp đồng trang: window.render(t), window.DUR, window.READY, window.EV, window.TEXTS(t).
import { figure, expr, blendE, PAL, roi } from '../../../../rig/character.js';
import { cel, path, poly, ellP, line, taper, mix, rgba, canvas, W, H, TAU, rect } from '../../../../rig/cel.js';
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
function nk(T, keys, d = .5) {    // số, trộn dần
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  if (i === 0) return keys[0][1];
  return lerp(keys[i - 1][1], keys[i][1], ease.inOut(seg(T, keys[i][0], keys[i][0] + d)));
}
const BLINKS = []; { let s = 11, t = 1.1; const r = () => (s = (s * 16807) % 2147483647) / 2147483647; while (t < 220) { BLINKS.push(t); if (r() < .22) BLINKS.push(t + .26); t += 2 + r() * 3; } }
function blink(T) { for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < .16) return Math.sin(d / .16 * Math.PI); } return 0; }
function cam(g, z, fx, fy, ox = 0, oy = 0) { g.translate(fx, fy); g.scale(z, z); g.translate(-fx - ox, -fy - oy); }
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => TL.L[id];

// màu của tập phim
const TEA = '#C89A5B', TEA_D = '#8A6433', CUP = '#F1EAD8', CUP_S = '#CFC5AC', WOOD = '#2A2118', WOOD2 = '#1C1610';
const PAPER = '#EFE9DA', PAPER_S = '#CFC7B2', INK2 = '#2A2A24', GREY = '#6E6757', AMBER = '#8A5A2A';

// ——————————————————————————————————————————————
// ĐẠO CỤ: bàn tay (rig nhỏ hơn cảnh, nên phóng to)
// ——————————————————————————————————————————————
function bigHand(g, x, y, rot, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(1.9, 1.9);
  hand(g, PAL.skin, { lw: 2.6, ...o });
  g.restore();
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: quầy trà sữa ban đêm
// ——————————————————————————————————————————————
function shopRoom(g, T) {
  g.fillStyle = '#0E1420'; g.fillRect(-200, -200, W + 400, H + 400);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 18; c++) {
    const x = -100 + c * 130 + (r % 2 ? 65 : 0), y = -80 + r * 96;
    cel(g, rect(x, y, x + 124, y + 90), { f: r % 2 ? '#16202F' : '#131C29', l: '#0C1420', lw: 2 });
  }
  // bảng neon "TRÀ SỮA" treo trên tường
  g.save(); g.translate(1330, 210);
  cel(g, rect(-300, -92, 300, 92), { f: '#101826', s: '#0A111C', so: [10, 12], l: '#0B1420', lw: 3.4 });
  text(g, 'TRÀ SỮA', 0, 26, { font: font(900, 76), align: 'center', fill: '#FF6E9C' });
  g.restore();
  const grd = g.createRadialGradient(1330, 210, 30, 1330, 210, 700);
  grd.addColorStop(0, 'rgba(255,90,140,.20)'); grd.addColorStop(1, 'rgba(255,90,140,0)');
  g.fillStyle = grd; g.fillRect(600, -200, 1500, 900);
  // kệ chai sữa phía sau bên trái
  cel(g, rect(40, 470, 900, 506), { f: '#1D2836', s: '#141C27', so: [0, 8], l: '#0B1119', lw: 3 });
  for (let i = 0; i < 9; i++) {
    const x = 84 + i * 90, hgt = 150 + ((i * 47) % 4) * 18, bw = 52;
    cel(g, poly([[x, 470], [x, 470 - hgt + 46], [x + 9, 470 - hgt + 30], [x + 9, 470 - hgt], [x + bw - 9, 470 - hgt], [x + bw - 9, 470 - hgt + 30], [x + bw, 470 - hgt + 46], [x + bw, 470]]),
      { f: i % 3 ? '#2B3B50' : '#37485F', s: '#18222F', so: [4, 4], l: '#0E1620', lw: 2.4 });
    cel(g, rect(x + 7, 470 - hgt - 12, x + bw - 7, 470 - hgt + 2), { f: '#1B2634', l: '#0E1620', lw: 2 });
    cel(g, rect(x + 8, 470 - hgt + 74, x + bw - 8, 470 - hgt + 126), { f: '#E4DCC6', l: '#0E1620', lw: 1.8 });
  }
}

// mặt quầy gỗ: vẽ sau người đứng sau quầy để che thân dưới
function counterFront(g, T) {
  cel(g, rect(-200, 830, W + 200, 900), { f: '#4A3A28', s: '#2A2118', so: [0, 10], l: '#0E0B08', lw: 3 });
  cel(g, rect(-200, 900, W + 200, H + 200), { f: '#1C1610', s: '#120E09', so: [0, 0], l: '#0E0B08', lw: 3 });
  for (let i = 0; i < 5; i++) line(g, [[-200, 930 + i * 42], [W + 200, 916 + i * 42]], '#241C14', 4);
  const grd2 = g.createLinearGradient(0, 830, 0, 900);
  grd2.addColorStop(0, 'rgba(255,110,156,.20)'); grd2.addColorStop(1, 'rgba(255,110,156,0)');
  g.fillStyle = grd2; g.fillRect(-200, 830, W + 400, 70);
}

function milkTeaCup(g, x, y, s, o = {}) {
  const h = 190 * s, wTop = 104 * s, wBot = 74 * s;
  g.save(); g.translate(x, y);
  cel(g, poly([[-wTop / 2, -h], [wTop / 2, -h], [wBot / 2, 0], [-wBot / 2, 0]]), { f: CUP, s: CUP_S, so: [6, 6], l: '#2A2A24', lw: 3 });
  // trà sữa đọng từ đáy ly lên
  const lv = o.lv === undefined ? .62 : o.lv, lvl = -h * (1 - lv);
  g.save();
  g.beginPath();
  g.moveTo(-wTop / 2 + 5, -h + 5); g.lineTo(wTop / 2 - 5, -h + 5); g.lineTo(wBot / 2 - 4, -3); g.lineTo(-wBot / 2 + 4, -3); g.closePath();
  g.clip();
  cel(g, rect(-wTop, lvl, wTop, 0), { f: TEA, s: TEA_D, l: TEA_D, lw: 2 });
  for (let i = 0; i < 5; i++) {
    const ix = -wTop / 2 + 16 + (i % 3) * 26, iy = lvl - 26 + Math.floor(i / 3) * 24;
    cel(g, rect(ix, iy, ix + 20, iy + 20), { f: '#F6F1E4', l: '#BFB49B', lw: 1.6 });
  }
  g.restore();
  // nắp ly
  cel(g, ellP(0, -h, wTop / 2 + 4, 22 * s), { f: '#EFE7D6', s: CUP_S, so: [4, 4], l: '#2A2A24', lw: 3 });
  // ống hút
  if (o.straw !== false) {
    g.save(); g.rotate(o.strawRot || -.12);
    cel(g, rect(-4 * s, -h - 66 * s, 4 * s, -h + 6), { f: '#E8574C', l: '#2A2A24', lw: 2.4 });
    g.restore();
  }
  g.restore();
}

function priceCard(g, x, y, txt, o = {}) {
  const sc = o.s || 1, px = 40 * sc;
  // the card is as wide as the number needs: the digits never run over the edge
  g.save();
  g.font = font(900, px);
  const tw = Math.max(96 * sc, g.measureText(txt).width + 26 * sc);
  const h = 84 * sc, w = tw;
  g.translate(x, y); g.rotate(o.rot || 0);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: '#F7F2E4', s: '#D8D0BC', so: [6, 8], l: '#2A2A24', lw: 3 });
  cel(g, rect(-w / 2 + 6, -h / 2 + 6, w / 2 - 6, -h / 2 + 26), { f: o.hot ? '#F0525B' : '#3B4A63', l: '#2A2A24', lw: 2 });
  text(g, txt, 0, h / 2 - 22, { font: font(900, px), align: 'center', fill: INK2 });
  g.restore();
}

// ba ly trên quầy, mỗi ly một thẻ giá
function counterRow(g, T, o = {}) {
  const y = 830, sc = o.s || 1, dx = o.dx || 0;
  const items = [
    { x: 700, s: .78, lv: .55, txt: '35.000', hot: false },
    { x: 980, s: 1.00, lv: .72, txt: '60.000', hot: true },
    { x: 1260, s: .86, lv: .48, txt: '65.000', hot: false },
  ];
  items.forEach((it, i) => {
    const x = it.x + dx;
    milkTeaCup(g, x, y, it.s * sc, { lv: it.lv, strawRot: i === 1 ? -.06 : -.1 });
    priceCard(g, x + 126 * sc, y - 190 * it.s * sc - 96, it.txt, { rot: (i - 1) * .04, s: .95 * sc, hot: it.hot });
  });
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: giấy vẽ tay
// ——————————————————————————————————————————————
// vòng sáng đèn bàn trên mặt bàn gỗ: không để mặt bàn thành một mảng tối phẳng
function deskLamp(g, cx = 700, cy = 380, r = 900) {
  const grd = g.createRadialGradient(cx, cy, 40, cx, cy, r);
  grd.addColorStop(0, 'rgba(255,183,3,.20)');
  grd.addColorStop(.45, 'rgba(255,183,3,.07)');
  grd.addColorStop(1, 'rgba(255,183,3,0)');
  g.fillStyle = grd; g.fillRect(-200, -200, W + 400, H + 400);
}

function sheet(g, x, y, w, h, rot = 0, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: o.f || PAPER, s: o.s || PAPER_S, so: [12, 16], l: INK2, lw: 3 });
  if (o.grid !== false) {
    g.save(); g.beginPath(); g.rect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16); g.clip();
    for (let gx = -w / 2 + 20; gx < w / 2; gx += 34) line(g, [[gx, -h / 2], [gx, h / 2]], 'rgba(110,130,165,.28)', 1.4);
    for (let gy = -h / 2 + 20; gy < h / 2; gy += 34) line(g, [[-w / 2, gy], [w / 2, gy]], 'rgba(110,130,165,.28)', 1.4);
    g.restore();
  }
  g.restore();
}

function bar(g, x, y, w, h, col, p) {   // cột vẽ tay
  const hh = h * clamp01(p);
  cel(g, rect(x, y - hh, x + w, y), { f: col, s: mix(col, '#2A2A24', .28), so: [6, 6], l: INK2, lw: 3 });
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: bảng giá ba mức
// ——————————————————————————————————————————————
function priceBoard(g, x, y, o = {}) {
  const sc = o.s || 1, w = 780, h = 430;
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(sc, sc);
  cel(g, rect(-w / 2, -h / 2, w / 2, h / 2), { f: '#F3EEDF', s: '#C9C2B0', so: [12, 16], l: INK2, lw: 3.4 });
  cel(g, rect(-w / 2 + 26, -h / 2 + 26, w / 2 - 26, -h / 2 + 96), { f: '#3B4A63', l: INK2, lw: 2.4 });
  text(g, o.title || 'BẢNG GIÁ', -w / 2 + 46, -h / 2 + 78, { font: font(900, 44), fill: '#F3EEDF' });
  const rows = o.rows || [
    { k: 'CỠ NHỎ', p: '35.000', cross: false },
    { k: 'CỠ LỚN', p: '60.000', cross: false },
    { k: 'CỠ VỪA', p: '65.000', cross: false },
  ];
  rows.forEach((r, i) => {
    const y0 = -h / 2 + 150 + i * 96;
    text(g, r.k, -w / 2 + 46, y0 + 46, { font: font(800, 42), fill: INK2 });
    text(g, r.p, w / 2 - 46, y0 + 46, { font: font(900, 48), align: 'right', fill: r.cross ? '#8C8474' : INK2 });
    if (r.cross) line(g, [[-w / 2 + 40, y0 + 56], [w / 2 - 40, y0 + 10]], '#D8402F', 9);
    if (r.hot) cel(g, rect(w / 2 - 220, y0 + 4, w / 2 - 30, y0 + 66), { f: 'rgba(255,183,3,.20)', l: '#C88A00', lw: 3.4 });
  });
  g.restore();
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: tường thẻ thí nghiệm
// ——————————————————————————————————————————————
function cardWall(g, T, o = {}) {
  const cols = 10, rows = 4, cw = 142, ch = 150, gap = 12;
  const x0 = 960 - (cols * (cw + gap) - gap) / 2, y0 = 228;
  for (let i = 0; i < 38; i++) {
    const cxx = x0 + (i % cols) * (cw + gap), cyy = y0 + Math.floor(i / cols) * (ch + gap);
    const dead = i < 19 && (o.dead !== false);   // 19 thẻ dùng sản phẩm thật: không ra hiệu ứng
    const p = seg(T, (o.t0 || 0) + i * .04, (o.t0 || 0) + i * .04 + .3);
    if (p <= 0) continue;
    g.save(); g.translate(cxx + cw / 2, cyy + ch / 2); g.rotate(((i * 37) % 7 - 3) * .012); g.scale(p, p);
    cel(g, rect(-cw / 2, -ch / 2, cw / 2, ch / 2), { f: dead ? '#D9D2BF' : '#F3EEDF', s: '#B9B19C', so: [7, 9], l: INK2, lw: 2.6 });
    cel(g, rect(-cw / 2 + 10, -ch / 2 + 12, cw / 2 - 10, -ch / 2 + 34), { f: dead ? '#8C8474' : '#3B4A63', l: INK2, lw: 2 });
    for (let k = 0; k < 4; k++) line(g, [[-cw / 2 + 14, -ch / 2 + 60 + k * 26], [cw / 2 - 14 - (k % 2) * 24, -ch / 2 + 60 + k * 26]], dead ? '#A79E8B' : '#4A4436', 6);
    if (dead) {
      line(g, [[-cw / 2 + 16, -ch / 2 + 20], [cw / 2 - 16, ch / 2 - 20]], '#D8402F', 9);
      line(g, [[cw / 2 - 16, -ch / 2 + 20], [-cw / 2 + 16, ch / 2 - 20]], '#D8402F', 9);
    }
    g.restore();
  }
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: vòng xác suất
// ——————————————————————————————————————————————
function probWheel(g, x, y, r, o = {}) {
  cel(g, ellP(x, y, r, r), { f: '#F7F2E4', s: '#D8D0BC', so: [8, 10], l: INK2, lw: 3.4 });
  const a0 = -Math.PI / 2, sweep = o.sweep === undefined ? 1.6 : o.sweep;
  g.save(); g.beginPath(); g.moveTo(x, y); g.arc(x, y, r - 12, a0, a0 + sweep); g.closePath();
  g.fillStyle = o.col || '#3B4A63'; g.fill();
  g.strokeStyle = INK2; g.lineWidth = 3; g.stroke();
  g.restore();
  line(g, [[x, y], [x + Math.cos(a0 + sweep) * (r - 12), y + Math.sin(a0 + sweep) * (r - 12)]], INK2, 4);
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: tivi cũ
// ——————————————————————————————————————————————
function tvProp(g, x, y, s) {
  g.save(); g.translate(x, y);
  cel(g, rect(-260 * s, -190 * s, 260 * s, 170 * s), { f: '#3A332C', s: '#241E19', so: [10, 12], l: '#12131A', lw: 3.4 });
  cel(g, rect(-230 * s, -165 * s, 130 * s, 60 * s), { f: '#101820', l: '#12131A', lw: 3 });
  g.save(); g.beginPath(); g.rect(-230 * s, -165 * s, 360 * s, 225 * s); g.clip();
  cel(g, rect(-230 * s, -165 * s, 130 * s, 60 * s), { f: '#1B5C7A', l: '#12131A', lw: 3 });
  for (let i = 0; i < 5; i++) {
    const fx = -180 * s + i * 62 * s, fy = -20 * s + (i % 2) * 40 * s;
    cel(g, poly([[fx, fy], [fx + 46 * s, fy - 20 * s], [fx + 46 * s, fy + 20 * s]]), { f: '#F0A63C', l: '#12131A', lw: 2.4 });
  }
  for (let i = 0; i < 6; i++) {
    const cx2 = -190 * s + i * 58 * s;
    cel(g, rect(cx2, -60 * s, cx2 + 16 * s, 60 * s), { f: '#D14A7A', l: '#12131A', lw: 2 });
  }
  g.restore();
  cel(g, ellP(190 * s, -110 * s, 20 * s, 20 * s), { f: '#6E6757', l: '#12131A', lw: 2.4 });
  cel(g, rect(-40 * s, 170 * s, 40 * s, 240 * s), { f: '#3A332C', l: '#12131A', lw: 3 });
  g.restore();
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: kệ siêu thị
// ——————————————————————————————————————————————
function wineShelf(g, T) {
  g.fillStyle = '#101722'; g.fillRect(-200, -200, W + 400, H + 400);
  for (let r = 0; r < 3; r++) {
    const y = 330 + r * 250;
    cel(g, rect(-200, y + 150, W + 200, y + 190), { f: '#2A3140', s: '#1B2130', so: [0, 8], l: '#0B1119', lw: 3 });
    for (let i = 0; i < 16; i++) {
      const x = -60 + i * 122, hgt = 150 + ((i * 53) % 5) * 14;
      const col = ['#3E2A46', '#4A3324', '#26384A', '#4A2430'][i % 4];
      cel(g, rect(x, y + 150 - hgt, x + 62, y + 150), { f: col, s: mix(col, '#12131A', .35), so: [5, 5], l: '#0E1420', lw: 2.6 });
      cel(g, rect(x + 16, y + 150 - hgt - 30, x + 46, y + 150 - hgt + 4), { f: mix(col, '#ffffff', .18), l: '#0E1420', lw: 2.4 });
      cel(g, rect(x + 18, y + 40, x + 44, y + 100), { f: '#EFE9DA', l: '#12131A', lw: 1.8 });
    }
  }
  cel(g, rect(-200, 90, W + 200, 210), { f: '#16202F', s: '#101722', so: [0, 8], l: '#0B1119', lw: 3 });
}

// ——————————————————————————————————————————————
// ĐẠO CỤ: màn hình đặt vé máy bay
// ——————————————————————————————————————————————
function flightScreen(g, T) {
  cel(g, rect(520, 150, 1400, 830), { f: '#0D1420', s: '#080C14', so: [12, 14], l: '#2A3140', lw: 4 });
  cel(g, rect(548, 178, 1372, 802), { f: '#141C2A', l: '#0A0F18', lw: 2.4 });
  cel(g, rect(580, 200, 1340, 262), { f: '#1D2739', l: '#2A3140', lw: 2.4 });
  for (let i = 0; i < 5; i++) cel(g, rect(600 + i * 150, 218, 730 + i * 150, 244), { f: '#3B4A63', l: '#2A3140', lw: 1.8 });
  for (let i = 0; i < 6; i++) {
    const y = 300 + i * 84;
    cel(g, rect(580, y, 1340, y + 68), { f: i % 2 ? '#182233' : '#1B2636', l: '#26314A', lw: 1.8 });
    cel(g, ellP(620, y + 34, 18, 18), { f: '#67E8F9', l: '#12131A', lw: 2 });
    for (let k = 0; k < 3; k++) line(g, [[660, y + 20 + k * 14], [900 + k * 90, y + 20 + k * 14]], '#4A5A78', 6);
    cel(g, rect(1180, y + 16, 1310, y + 52), { f: '#FFB703', l: '#12131A', lw: 2.4 });
  }
}

// ——————————————————————————————————————————————
// CẢNH
// ——————————————————————————————————————————————
function shots() {
  // Mỗi cảnh bám vào một câu thoại: mở ra ngay trước khi câu đó bắt đầu. Mọi mốc thời gian đến từ
  // voice/proc/dur.json — không gõ tay.
  const ORDER = [
    ['counter', null, 0], ['hand', 'hook', .3], ['owner', 'hook2', .25], ['grab', 'hook3', .25],
    ['title', 'intro', .3], ['myth', 'myth', .3], ['check', 'myth2', .25],
    ['lab', 'lab1', .3], ['labnum', 'lab3', .3], ['cars', 'lab4', .3], ['decoy', 'decoy1', .3],
    ['turn', 'turn', .25], ['rat', 'rat1', .3], ['rat4', 'rat4', .3], ['mech', 'mech', .3],
    ['rep', 'rep1', .3], ['repzero', 'rep3', .25], ['wheel', 'rep4', .3], ['tv', 'rep6', .3],
    ['attempts', 'rep7', .3], ['wild', 'wild1', .3], ['regular', 'wild3', .3], ['flight', 'wild4', .3],
    ['model', 'model', .3], ['action', 'action1', .3], ['action3', 'action3', .3], ['roi', 'roi', .3],
    ['close', 'close', .3], ['next', 'next', .3],
  ];
  const START = {};
  for (const [name, anchor, lead] of ORDER) START[name] = anchor ? L(anchor).t0 - lead : 0;
  const at = (name, d = 0) => (START[name] !== undefined ? START[name] + d : (TL.L[name] ? TL.L[name].t0 + d : 0));

  return [
    // 1 — quầy trà sữa lúc nửa đêm: ba ly, ba mức giá
    { n: 'counter', t: START.counter, f(g, lt, T) {
      g.save(); cam(g, 1.06 + seg(lt, 0, 5) * .06, 980, 700);
      shopRoom(g, T);
      counterFront(g, T);
      counterRow(g, T, { s: 1 });
      g.restore();
    }, ev: () => [[0, 'amb', { kind: 'night', t1: at('owner') }]] },

    // 2 — tay chìa ra, ngập ngừng trước ba ly (Mode C)
    { n: 'hand', t: START.hand, f(g, lt, T) {
      const t0 = L('hook').t0;
      g.save(); cam(g, 1.12 + seg(lt, 0, 6) * .05, 980, 700);
      shopRoom(g, T);
      counterFront(g, T);
      counterRow(g, T, { s: 1.04 });
      // bàn tay từ trái chìa vào, chỉ về phía ly nhỏ — rồi đổi ý
      const reach = ease.out(seg(T, t0 + .8, t0 + 2.6));
      bigHand(g, lerp(268, 512, reach), lerp(930, 812, reach), -.42 + reach * .5,
        { gest: blendGest(GEST.relaxed, GEST.one, seg(T, t0 + 1.2, t0 + 2.8)) });
      g.restore();
    }, ev() { return [[this.t, 'pop'], [L('hook').t0 + 1.6, 'step'], [L('hook').t0 + 2.6, 'paper'], [this.t, 'amb', { kind: 'night', t1: at('owner') }]]; } },

    // 3 — chủ quán sau quầy (Mode C, whip pan vào)
    { n: 'owner', t: START.owner, tr: 'whip', f(g, lt, T) {
      const t0 = L('hook2').t0;
      g.save(); cam(g, 1.02, 980, 620);
      shopRoom(g, T);
      // chủ quán đứng sau quầy (thân bị mặt quầy che)
      S.person(g, 1520, 905, .86, '#33405A', { ph: 0 });
      counterFront(g, T);
      counterRow(g, T, { s: .95, dx: -60 });
      // Kẻ Nghĩ Nhiều ở bên phải, nhìn hàng ly
      kng(g, 1690, 660, { s: .62, E: ek(T, [[0, 'thinking'], [t0 + 2.6, 'worried']]), headYaw: .3, headPitch: .06, talk: TL.talk(T) }, T);
      g.restore();
    }, ev() { return [[this.t - .12, 'whoosh'], [this.t, 'pop'], [L('hook2').t0 + 2.6, 'paper'], [this.t, 'amb', { kind: 'night', t1: at('grab') }]]; } },

    // 4 — tay nâng ly lớn, cỡ vừa bị bỏ lại (Mode C close)
    { n: 'grab', t: START.grab, f(g, lt, T) {
      const t0 = L('hook3').t0;
      g.save(); cam(g, 1.16 + seg(lt, 0, 6) * .03, 980, 660);
      shopRoom(g, T);
      counterFront(g, T);
      const lift = ease.out(seg(T, t0 + .8, t0 + 2.4));
      // ly nhỏ vẫn ở trên quầy
      milkTeaCup(g, 560, 830, .78, { lv: .55 });
      priceCard(g, 690, 610, '35.000', { rot: -.05, s: .92 });
      // ly vừa (mồi câu) đứng lại, thẻ giá của nó
      milkTeaCup(g, 1420, 830, .86, { lv: .48 });
      priceCard(g, 1560, 600, '65.000', { rot: .05, s: .92 });
      // ly lớn được nhấc lên: ly nằm trong tay, ngón tay quàng qua thân ly
      const cy2 = lerp(830, 540, lift);
      bigHand(g, 914, cy2 - 57, .1, {
        gest: blendGest(GEST.one, GEST.hold, seg(T, t0 + 1.0, t0 + 2.2)),
        prop: gg => milkTeaCup(gg, 45, 30, .55, { lv: .72, strawRot: -.06 }),
      });
      priceCard(g, 1244, cy2 - 236, '60.000', { rot: .04, s: .92, hot: true });
      // mũi tên: từ thẻ 65.000 sang ly lớn — cùng tiền hơn mà nhiều hơn
      const ap = seg(T, t0 + 3.4, t0 + 4.2);
      if (ap > 0) {
        g.globalAlpha = ap;
        line(g, [[1460, 570], [1230, 500]], '#F0525B', 8);
        line(g, [[1230, 500], [1258, 528]], '#F0525B', 8);
        line(g, [[1230, 500], [1272, 494]], '#F0525B', 8);
        g.globalAlpha = 1;
      }
      g.restore();
    }, ev() { return [[this.t, 'step'], [L('hook3').t0 + 1.6, 'pop'], [L('hook3').t0 + 3.4, 'marker'], [this.t, 'amb', { kind: 'night', t1: at('title') }]]; } },

    // 5 — thẻ tiêu đề tập trên bàn làm việc (Mode A)
    { n: 'title', t: START.title, f(g, lt, T) {
      const t0 = L('intro').t0, cam0 = { x: 0, y: 0 };
      S.roomBack(g, T, cam0);
      kng(g, 1320, 700, { s: 1.12, E: ek(T, [[0, 'happy'], [t0 + 2.2, 'talk']]), headYaw: -.12 + Math.sin(T * .5) * .02, armL: ak(T, [[0, { at: [-150, 250] }], [t0 - .1, { at: [-190, -70], gest: 'open', rot: -.1 }], [t0 + 2.4, { at: [-150, 250] }]], .3), armR: ak(T, [[0, { at: [150, 250] }]]) }, T);
      S.roomFront(g, T, cam0);
      const p = ease.back(seg(lt, .05, .6));
      if (p > 0) {
        g.save(); g.translate(600 - (1 - p) * 700, 600); g.rotate(-.03);
        cel(g, rect(-400, -178, 400, 178), { f: '#F3EEDF', s: '#C9C2B0', so: [14, 18], l: INK2, lw: 3.4 });
        cel(g, ellP(-258, -166, 15, 15), { f: PAL.red.f, s: PAL.red.s, so: [-4, -4], l: PAL.red.l, lw: 2 });
        const hi = seg(T, t0 + 2.3, t0 + 3.1);
        if (hi > 0) hilite(g, -366, -16, 420, 54, hi, '#FFB703', 5);
        text(g, 'HIỆU ỨNG', -366, -60, { font: font(900, 80), fill: INK2 });
        text(g, 'CHIM MỒI', -366, 26, { font: font(900, 80), fill: INK2 });
        revealText(g, 'vì sao món tệ lại hấp dẫn hơn?', -364, 122, seg(T, t0 + 2.5, t0 + 4.0), { font: font(400, 36, 'Patrick Hand'), fill: GREY });
        text(g, 'TẬP 06', 366, 122, { font: font(800, 40), align: 'right', fill: AMBER });
        g.restore();
      }
      text(g, '23:52', 78, 128, { font: font(900, 66), fill: PAL.muted });
    }, ev() { return [[this.t, 'paper'], [this.t, 'pop'], [L('intro').t0 + 3.0, 'marker'], [this.t, 'music', { cue: 'B' }], [this.t, 'amb', { kind: 'room', t1: at('myth') }]]; } },

    // 6 — áp phích "bị lừa" trên tường (Mode A)
    { n: 'myth', t: START.myth, f(g, lt, T) {
      const t0 = L('myth').t0;
      ground(g, '#171A24');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1E2333', s: '#151926', l: '#12131A', lw: 3 });
      for (let i = 0; i < 5; i++) line(g, [[-200, 120 + i * 210], [W + 200, 120 + i * 210]], '#232839', 4);
      g.save(); g.translate(960, 470); g.rotate(.014);
      cel(g, rect(-620, -300, 620, 300), { f: '#E7E1D0', s: '#C4BCA6', so: [14, 18], l: INK2, lw: 3.4 });
      text(g, 'NGƯỜI BÁN', -560, -140, { font: font(900, 108), fill: INK2 });
      text(g, 'LỪA BẠN', -560, -10, { font: font(900, 108), fill: INK2 });
      line(g, [[-560, 46], [180, 46]], '#B9AE95', 6);
      text(g, 'cách giải thích quen thuộc nhất', -560, 140, { font: font(400, 42, 'Patrick Hand'), fill: GREY });
      text(g, 'mà não bạn thì bị lừa', -560, 216, { font: font(400, 42, 'Patrick Hand'), fill: GREY });
      cel(g, ellP(-560, -292, 15, 15), { f: PAL.red.f, s: PAL.red.s, so: [-4, -4], l: PAL.red.l, lw: 2 });
      g.restore();
      stamp(g, 'PHỔ BIẾN', 1300, 720, { rot: .1, px: 54, p: seg(T, t0 + 1.3, t0 + 1.7) });
      roi(g, 380, 760, 1.5, { t: T, E: { mo: .35, lookX: .35 } });
    }, ev() { return [[this.t, 'pop'], [L('myth').t0 + 1.3, 'stamp'], [this.t, 'amb', { kind: 'room', t1: at('check') }]]; } },

    // 7 — soi kính lúp vào áp phích (Mode A close)
    { n: 'check', t: START.check, f(g, lt, T) {
      const t0 = L('myth2').t0;
      ground(g, '#161A26');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1E2333', s: '#151926', l: '#12131A', lw: 3 });
      g.save(); g.translate(1420, 470); g.rotate(.02);
      cel(g, rect(-330, -160, 330, 160), { f: '#E7E1D0', s: '#C4BCA6', so: [10, 12], l: INK2, lw: 3 });
      text(g, 'BỊ LỪA', -290, -30, { font: font(900, 78), fill: INK2 });
      text(g, 'chưa ai kiểm tra', -290, 60, { font: font(400, 40, 'Patrick Hand'), fill: GREY });
      g.restore();
      kng(g, 620, 900, { s: 1.32, E: ek(T, [[0, 'thinking'], [t0 + 2.2, 'determined']]), headYaw: .3, headPitch: .16, armR: ak(T, [[0, { at: [150, 250] }], [t0 + .5, { at: [120, 90], gest: 'hold', rot: .35 }]], .4), armL: ak(T, [[0, { at: [-150, 250] }], [t0 + .3, { at: [-130, 140], gest: 'hold', rot: -.3 }]], .4), talk: TL.talk(T) }, T);
      // kính lúp: tay phải của Kẻ Nghĩ Nhiều cầm cán, kính hướng về thẻ "BỊ LỪA"
      g.save(); g.translate(986, 596); g.rotate(2.34);
      cel(g, ellP(0, 0, 96, 96), { f: 'rgba(180,220,255,.16)', s: 'rgba(180,220,255,.10)', so: [0, 0], l: '#B9C6DA', lw: 9 });
      cel(g, rect(78, -18, 250, 18), { f: '#3A4260', s: '#232838', so: [0, 8], l: '#12131A', lw: 2.6 });
      g.restore();
      roi(g, 320, 800, 1.35, { t: T, E: { mo: .45, lookX: .3 } });
    }, ev() { return [[this.t, 'paper'], [L('myth2').t0 + 1.2, 'tick'], [this.t, 'amb', { kind: 'room', t1: at('lab') }]]; } },

    // 8 — bàn thí nghiệm 1982: hai thẻ lựa chọn, thẻ thứ ba được đặt vào (Mode B)
    { n: 'lab', t: START.lab, f(g, lt, T) {
      const t0 = L('lab1').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      deskLamp(g);
      for (let i = 0; i < 7; i++) line(g, [[-200, 40 + i * 150], [W + 200, 16 + i * 150]], '#241C14', 5);
      const card = (x, y, rot, o) => {
        g.save(); g.translate(x, y); g.rotate(rot);
        cel(g, rect(-210, -130, 210, 130), { f: '#F3EEDF', s: '#C9C2B0', so: [10, 12], l: INK2, lw: 3 });
        cel(g, rect(-190, -108, 190, -58), { f: o.hot ? '#C88A00' : '#3B4A63', l: INK2, lw: 2.4 });
        text(g, o.t, -176, -70, { font: font(800, 38), fill: '#F3EEDF' });
        line(g, [[-170, -14], [170 - (o.v || 0), -14]], '#4A4436', 7);
        line(g, [[-170, 34], [170 - (o.w || 0), 34]], '#4A4436', 7);
        text(g, o.p1, 176, -2, { font: font(700, 34), align: 'right', fill: GREY });
        text(g, o.p2, 176, 46, { font: font(700, 34), align: 'right', fill: GREY });
        g.restore();
      };
      card(520, 560, -.03, { t: 'Ô TÔ A', p1: 'rẻ hơn', p2: 'chất lượng thấp' });
      card(1400, 560, .03, { t: 'Ô TÔ B', p1: 'đắt hơn', p2: 'chất lượng cao' });
      const dp = ease.back(seg(T, t0 + 3.4, t0 + 4.1));
      if (dp > 0) {
        g.save(); g.globalAlpha = clamp01(dp * 1.4);
        card(960, 560, -.015, { t: 'Ô TÔ C', p1: 'đắt hơn', p2: 'chất lượng thấp', hot: true });
        g.restore();
      }
      g.save(); g.translate(960, 800); g.rotate(.5);
      cel(g, rect(-160, -12, 130, 12), { f: '#E0A32E', s: '#A87518', so: [0, 10], l: INK2, lw: 2.4 });
      cel(g, poly([[130, -12], [180, 0], [130, 12]]), { f: '#E8DCC0', l: INK2, lw: 2.4 });
      g.restore();
      text(g, 'HUBER · PAYNE · PUTO · 1982', 960, 250, { font: font(800, 44), align: 'center', fill: CREAM });
      text(g, '153 sinh viên · 6 nhóm hàng · 2 thuộc tính', 960, 310, { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { return [[this.t, 'paper'], [L('lab1').t0 + 3.4, 'pop'], [this.t, 'music', { cue: 'C' }], [this.t, 'amb', { kind: 'room', t1: at('labnum') }]]; } },

    // 9 — sơ đồ mức tăng: +9,2 điểm phần trăm (Mode B, giấy kẻ ô)
    { n: 'labnum', t: START.labnum, f(g, lt, T) {
      const t0 = L('lab3').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      deskLamp(g);
      sheet(g, 960, 520, 1240, 720, -.012, { grid: true });
      const p = ease.out(seg(T, t0 + 1.0, t0 + 2.0));
      // một cột duy nhất: tỷ lệ chọn món mục tiêu, và mảng vàng ở trên là phần tăng thêm
      const H0 = 330, D = 66;
      bar(g, 780, 760, 240, H0, '#8C8474', 1);
      g.save();
      g.beginPath(); g.rect(780, 760 - H0 - D, 240, D); g.clip();
      cel(g, rect(780, 760 - H0 - D, 1020, 760 - H0), { f: PAL.hoodie.f, s: '#C88A00', l: INK2, lw: 3 });
      g.restore();
      line(g, [[780, 760 - H0 - D], [1020, 760 - H0 - D]], '#C0392B', 5);
      line(g, [[780, 760 - H0], [1020, 760 - H0]], '#C0392B', 5);
      line(g, [[900, 760 - H0 - D], [900, 760 - H0]], '#C0392B', 5);
      text(g, '+9,2', 1300, 440, { font: font(900, 130), align: 'center', fill: INK2 });
      text(g, 'điểm phần trăm', 1300, 496, { font: font(700, 34), align: 'center', fill: AMBER });
      text(g, 'món mục tiêu', 900, 810, { font: font(700, 38), align: 'center', fill: GREY });
      text(g, 'được chọn nhiều hơn khi có mồi câu', 960, 866, { font: font(400, 38, 'Patrick Hand'), align: 'center', fill: GREY });
      // bút chì vẽ nét dài lên mảng vàng
      if (p > .15) {
        g.save(); g.translate(900, 760 - H0 - D * p); g.rotate(-1.35);
        cel(g, rect(-14, -7, 130, 7), { f: '#E0A32E', s: '#A87518', so: [0, 8], l: INK2, lw: 2.2 });
        cel(g, poly([[130, -7], [168, 0], [130, 7]]), { f: '#E8DCC0', l: INK2, lw: 2.2 });
        g.restore();
      }
    }, ev() { return [[this.t, 'paper'], [L('lab3').t0 + 1.2, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('cars') }]]; } },

    // 10 — nhóm ô tô: 44% → 66% (Mode B)
    { n: 'cars', t: START.cars, f(g, lt, T) {
      const t0 = L('lab4').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      deskLamp(g);
      sheet(g, 960, 500, 1240, 720, .008, { grid: true });
      const p = ease.out(seg(T, t0 + 1.2, t0 + 2.2));
      const BASE = 420;                       // 100% = 420 px
      const H44 = BASE * .44, H66 = BASE * .66;
      line(g, [[600, 760], [1420, 760]], '#8A8274', 4);
      // cột "không có mồi câu": 44%
      cel(g, rect(700, 760 - H44, 880, 760), { f: '#8C8474', s: '#6E6757', so: [6, 6], l: INK2, lw: 3 });
      // cột "có mồi câu": 66%, mọc lên theo nhịp
      const hh = H66 * p;
      cel(g, rect(1120, 760 - hh, 1300, 760), { f: PAL.hoodie.f, s: '#C88A00', so: [6, 6], l: INK2, lw: 3 });
      text(g, '44%', 790, 760 - H44 - 34, { font: font(900, 100), align: 'center', fill: GREY });
      text(g, '66%', 1210, 760 - hh - 34, { font: font(900, 100), align: 'center', fill: INK2 });
      text(g, 'không có mồi câu', 790, 812, { font: font(700, 34), align: 'center', fill: GREY });
      text(g, 'có mồi câu', 1210, 812, { font: font(700, 34), align: 'center', fill: AMBER });
      text(g, 'nhóm ô tô', 960, 205, { font: font(800, 42), align: 'center', fill: INK2 });
      // mũi tên đi lên giữa hai cột
      const ap = seg(T, t0 + 1.4, t0 + 2.1);
      if (ap > 0) {
        g.globalAlpha = ap;
        line(g, [[990, 660], [990, 430]], '#C0392B', 9);
        line(g, [[990, 430], [958, 482]], '#C0392B', 9);
        line(g, [[990, 430], [1022, 482]], '#C0392B', 9);
        g.globalAlpha = 1;
      }
    }, ev() { return [[this.t, 'paper'], [L('lab4').t0 + 1.3, 'marker'], [L('lab4').t0 + 1.4, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('decoy') }]]; } },

    // 11 — món mồi câu bị gạch: 2% (Mode B close)
    { n: 'decoy', t: START.decoy, f(g, lt, T) {
      const t0 = L('decoy1').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      deskLamp(g);
      sheet(g, 960, 520, 1180, 660, -.02, { grid: true });
      g.save(); g.translate(960, 470);
      cel(g, rect(-300, -170, 300, 170), { f: '#F3EEDF', s: '#C9C2B0', so: [10, 12], l: INK2, lw: 3 });
      cel(g, rect(-278, -148, 278, -96), { f: '#B9AE95', l: INK2, lw: 2.4 });
      text(g, 'Ô TÔ C', -262, -108, { font: font(800, 40), fill: '#F3EEDF' });
      line(g, [[-260, -30], [260, -30]], '#4A4436', 7);
      line(g, [[-260, 26], [260, 26]], '#4A4436', 7);
      text(g, 'đắt hơn', 262, -18, { font: font(700, 34), align: 'right', fill: GREY });
      text(g, 'chất lượng thấp', 262, 38, { font: font(700, 34), align: 'right', fill: GREY });
      const xp = ease.out(seg(T, t0 + .8, t0 + 1.5));
      if (xp > 0) {
        g.globalAlpha = xp;
        line(g, [[-280, -160], [280, 160]], '#D8402F', 12);
        g.globalAlpha = 1;
      }
      g.restore();
      const np = ease.out(seg(T, t0 + 2.0, t0 + 2.6));
      text(g, '2%', 960, 780, { font: font(900, 160 * np), align: 'center', fill: INK2 });
      text(g, 'gần như không ai chọn nó', 960, 840, { font: font(800, 40), align: 'center', fill: AMBER });
      if (T < t0 + 2.4) bigHand(g, lerp(1300, 1120, xp), lerp(700, 640, xp), -.6 + xp * .5, { gest: blendGest(GEST.relaxed, GEST.thumb, seg(T, t0 + .8, t0 + 1.5)), flip: true });
    }, ev() { return [[this.t, 'paper'], [L('decoy1').t0 + .8, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('turn') }]]; } },

    // 12 — cú lật: "chỉ là một cái bẫy marketing" (Mode D)
    { n: 'turn', t: START.turn, f(g, lt, T) {
      const t0 = L('turn').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1E2333', s: '#151926', l: '#12131A', lw: 3 });
      g.save(); g.translate(960, 470); g.rotate(-.02);
      cel(g, rect(-620, -290, 620, 290), { f: '#E7E1D0', s: '#C4BCA6', so: [14, 18], l: INK2, lw: 3.4 });
      text(g, 'NGƯỜI BÁN', -560, -140, { font: font(900, 104), fill: INK2 });
      text(g, 'LỪA BẠN', -560, -14, { font: font(900, 104), fill: INK2 });
      line(g, [[-560, 46], [180, 46]], '#B9AE95', 6);
      text(g, 'chỉ là một cái bẫy marketing', -560, 150, { font: font(800, 44), fill: INK2 });
      g.restore();
      stamp(g, 'BẪY MARKETING', 960, 700, { rot: -.1, px: 78, p: ease.out(seg(T, t0 + .6, t0 + 1.0)) });
      focusLines(g, 960, 470, T, '#2A2F42', 60, 380);
    }, ev() { return [[this.t, 'pop'], [L('turn').t0 + .6, 'stamp'], [this.t, 'amb', { kind: 'low', t1: at('rat') }]]; } },

    // 13 — hai đường: 19,6 và 13,0 (Mode B, giấy kẻ ô)
    { n: 'rat', t: START.rat, f(g, lt, T) {
      const t0 = L('rat1').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      deskLamp(g);
      sheet(g, 960, 500, 1240, 720, -.01, { grid: true });
      const p1 = ease.out(seg(T, t0 + 1.2, t0 + 2.2)), p2 = ease.out(seg(T, t0 + 2.6, t0 + 3.6));
      line(g, [[560, 760], [1420, 760]], '#8A8274', 4);
      line(g, [[560, 760], [560, 240]], '#8A8274', 4);
      const curve = (col, p, hh) => {
        if (p <= 0) return;
        g.save(); g.beginPath(); g.rect(560, 240, 860, 520); g.clip();
        g.strokeStyle = col; g.lineWidth = 11; g.lineCap = 'round'; g.lineJoin = 'round';
        g.beginPath();
        for (let i = 0; i <= 24; i++) { const u = i / 24 * p, xx = 560 + u * 860, yy = 760 - Math.pow(u, .7) * hh; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
        g.stroke(); g.restore();
      };
      curve('#D8402F', p1, 470);
      curve('#3B8FA8', p2, 470 * .66);
      text(g, '19,6', 700, 300, { font: font(900, 84), fill: '#D8402F' });
      text(g, 'hiệu ứng thật', 700, 336, { font: font(700, 32), align: 'center', fill: GREY });
      text(g, '13,0', 1120, 610, { font: font(900, 84), fill: '#3B8FA8' });
      text(g, 'mô hình suy luận', 1120, 646, { font: font(700, 32), align: 'center', fill: GREY });
      text(g, 'hiệu ứng (điểm)', 700, 820, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: GREY });
      // Rối trong vòng tròn, đặt ở góc dưới phải tờ giấy — không đè lên số hay đường vẽ
      if (T > t0 + .6) pip(g, 1455, 660, 96, ease.back(seg(T, t0 + .6, t0 + 1.0)), (gg, r) => {
        gg.fillStyle = '#F3EEDF'; gg.fillRect(-r, -r, 2 * r, 2 * r);
        roi(gg, 0, 10, r / 96 * 1.55, { t: T, E: { mo: .5, lookX: -.3 } });
      });
    }, ev() { return [[this.t, 'paper'], [L('rat1').t0 + 1.2, 'marker'], [L('rat1').t0 + 2.6, 'marker'], [this.t, 'music', { cue: 'D' }], [this.t, 'amb', { kind: 'low', t1: at('rat4') }]]; } },

    // 14 — bảng giá tiết lộ món nào đáng (Mode B)
    { n: 'rat4', t: START.rat4, f(g, lt, T) {
      const t0 = L('rat4').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      deskLamp(g);
      priceBoard(g, 960, 520, { rot: -.02, rows: [
        { k: 'CỠ NHỎ', p: '35.000', cross: false },
        { k: 'CỠ LỚN', p: '60.000', cross: false, hot: true },
        { k: 'CỠ VỪA', p: '65.000', cross: false },
      ] });
      const ap = seg(T, t0 + .6, t0 + 1.4);
      if (ap > 0) {
        g.globalAlpha = ap;
        line(g, [[960, 560], [960, 430]], '#C0392B', 9);
        line(g, [[960, 430], [930, 480]], '#C0392B', 9);
        line(g, [[960, 430], [990, 480]], '#C0392B', 9);
        g.globalAlpha = 1;
      }
      text(g, 'món này đáng', 960, 830, { font: font(900, 62), align: 'center', fill: INK2 });
      text(g, 'bảng giá không bán hàng — bảng giá nói', 960, 856, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: GREY });
    }, ev() { return [[this.t, 'paper'], [L('rat4').t0 + .6, 'marker'], [this.t, 'amb', { kind: 'low', t1: at('mech') }]]; } },

    // 15 — ba ly đặt cạnh nhau: não so sánh cạnh nhau (Mode C)
    { n: 'mech', t: START.mech, f(g, lt, T) {
      const t0 = L('mech').t0;
      ground(g, '#161A26');
      cel(g, rect(-200, 830, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      counterRow(g, T, { s: .95, dx: -40 });
      const ap = seg(T, t0 + .8, t0 + 1.8);
      if (ap > 0) {
        g.globalAlpha = ap;
        for (const [x1, x2] of [[800, 950], [1080, 1230]]) {
          line(g, [[x1, 430], [x2, 430]], '#67E8F9', 7);
          line(g, [[x2, 430], [x2 - 40, 408]], '#67E8F9', 7);
          line(g, [[x2, 430], [x2 - 40, 452]], '#67E8F9', 7);
        }
        g.globalAlpha = 1;
      }
      text(g, 'não so sánh bằng cách đặt mọi món cạnh nhau', 960, 250, { font: font(800, 46), align: 'center', fill: CREAM });
      kng(g, 1760, 1010, { s: .72, E: ek(T, [[0, 'thinking'], [t0 + 1.6, 'determined']]), headYaw: -.3, talk: TL.talk(T) }, T);
    }, ev() { return [[this.t, 'pop'], [L('mech').t0 + .8, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('rep') }]]; } },

    // 16 — "chỗ đáng sợ": im lặng, rồi tường 38 thẻ (Mode B)
    { n: 'rep', t: START.rep, f(g, lt, T) {
      const t0 = L('rep1').t0;
      ground(g, '#12141E');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1B2032', s: '#12161F', l: '#0B0E16', lw: 3 });
      cardWall(g, T, { t0: t0 + 1.4 });
      text(g, '38 thí nghiệm', 960, 158, { font: font(900, 66), align: 'center', fill: CREAM });
      text(g, 'năm 2014 · ba nhà nghiên cứu khác', 960, 202, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      roi(g, 96, 640, 1.3, { t: T, E: { mo: .4, lookX: .45 } });
    }, ev() { return [[this.t - .6, 'silence', { t: this.t - .6, t1: this.t + .1 }], [this.t, 'music', { cue: 'E' }], [this.t, 'amb', { kind: 'low', t1: at('repzero') }]]; } },

    // 17 — 19 thẻ bị gạch đỏ: không thí nghiệm nào ra hiệu ứng (Mode B close)
    { n: 'repzero', t: START.repzero, f(g, lt, T) {
      const t0 = L('rep3').t0;
      ground(g, '#12141E');
      cel(g, rect(-200, -200, W + 200, H + 200), { f: '#1B2032', s: '#12161F', l: '#0B0E16', lw: 3 });
      const cols = 7, cw = 178, ch = 172, gap = 18;
      const x0 = 960 - (cols * (cw + gap) - gap) / 2, y0 = 244;
      for (let i = 0; i < 19; i++) {
        const cxx = x0 + (i % cols) * (cw + gap), cyy = y0 + Math.floor(i / cols) * (ch + gap);
        g.save(); g.translate(cxx + cw / 2, cyy + ch / 2); g.rotate(((i * 29) % 7 - 3) * .014);
        cel(g, rect(-cw / 2, -ch / 2, cw / 2, ch / 2), { f: '#F3EEDF', s: '#C9C2B0', so: [8, 10], l: INK2, lw: 2.8 });
        cel(g, rect(-cw / 2 + 12, -ch / 2 + 14, cw / 2 - 12, -ch / 2 + 40), { f: '#3B4A63', l: INK2, lw: 2.2 });
        for (let k = 0; k < 4; k++) line(g, [[-cw / 2 + 16, -ch / 2 + 74 + k * 30], [cw / 2 - 16 - (k % 2) * 26, -ch / 2 + 74 + k * 30]], '#4A4436', 7);
        const xp = ease.out(seg(T, t0 + 1.2 + i * .17, t0 + 1.6 + i * .17));
        if (xp > 0) {
          g.globalAlpha = xp;
          line(g, [[-cw / 2 + 18, -ch / 2 + 22], [cw / 2 - 18, ch / 2 - 22]], '#D8402F', 11);
          line(g, [[cw / 2 - 18, -ch / 2 + 22], [-cw / 2 + 18, ch / 2 - 22]], '#D8402F', 11);
          g.globalAlpha = 1;
        }
        g.restore();
      }
      text(g, '19 thí nghiệm dùng sản phẩm thật', 960, 140, { font: font(800, 48), align: 'center', fill: CREAM });
      text(g, 'nếm · uống · xem ảnh', 960, 184, { font: font(400, 36, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      text(g, 'không thí nghiệm nào ra hiệu ứng', 960, 856, { font: font(900, 52), align: 'center', fill: '#F0525B' });
      // tay cầm bút đỏ gạch từng thẻ một
      const hp = ease.out(seg(T, t0 + 1.2, t0 + 1.8));
      const step = Math.min(18, Math.floor(seg(T, t0 + 1.2, t0 + 4.6) * 19));
      const gx = x0 + (step % 7) * (cw + gap) + cw / 2, gy = y0 + Math.floor(step / 7) * (ch + gap) + ch / 2;
      g.save(); g.translate(gx + 96, gy + 26); g.rotate(-.55);
      cel(g, rect(-110, -10, 60, 10), { f: '#D8402F', s: '#A8321F', so: [0, 8], l: INK2, lw: 2.2 });
      cel(g, poly([[60, -10], [102, 0], [60, 10]]), { f: '#E8DCC0', l: INK2, lw: 2.2 });
      g.restore();
      bigHand(g, gx + 130, gy + 46, -.55, { gest: blendGest(GEST.relaxed, GEST.hold, hp), flip: true });
    }, ev() { return [[this.t, 'paper'], [this.t + 1.2, 'marker'], [this.t + 1.6, 'marker'], [this.t + 2.2, 'marker'], [this.t + 3.0, 'marker'], [this.t + 3.4, 'marker'], [this.t + 3.8, 'marker'], [this.t, 'amb', { kind: 'low', t1: at('wheel') }]]; } },

    // 18 — bằng số thì có, vẽ thành hình thì không (Mode B)
    { n: 'wheel', t: START.wheel, f(g, lt, T) {
      const t0 = L('rep4').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      deskLamp(g);
      sheet(g, 960, 540, 1300, 660, -.01, { grid: true });
      const p1 = ease.out(seg(T, t0 + 1.0, t0 + 1.8));
      // cột: cùng câu hỏi, khi thuộc tính viết bằng số
      const B0 = 250;
      cel(g, rect(470, 700 - B0 * .5, 570, 700), { f: '#8C8474', s: '#6E6757', so: [5, 5], l: INK2, lw: 3 });
      cel(g, rect(630, 700 - B0 * p1, 730, 700), { f: PAL.hoodie.f, s: '#C88A00', so: [5, 5], l: INK2, lw: 3 });
      line(g, [[420, 700], [790, 700]], '#8A8274', 4);
      text(g, '14%', 520, 700 - B0 * .5 - 28, { font: font(900, 74), align: 'center', fill: GREY });
      text(g, '28%', 680, 700 - B0 * p1 - 28, { font: font(900, 74), align: 'center', fill: INK2 });
      text(g, 'bằng số', 600, 762, { font: font(700, 38), align: 'center', fill: AMBER });
      text(g, 'hiệu ứng có', 600, 812, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: GREY });
      // vòng xác suất: cùng câu hỏi, nhưng thuộc tính là hình
      probWheel(g, 1250, 430, 150, { sweep: 1.6 });
      text(g, 'vẽ thành hình', 1250, 632, { font: font(700, 38), align: 'center', fill: AMBER });
      text(g, 'cùng câu hỏi đó', 1250, 678, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: GREY });
      const eq = seg(T, t0 + 2.6, t0 + 3.2);
      text(g, '24%  =  26%', 1250, 742, { font: font(900, 56), align: 'center', fill: GREY });
      if (eq > 0) {
        g.globalAlpha = eq;
        text(g, 'không đổi', 1250, 802, { font: font(900, 50), align: 'center', fill: '#F0525B' });
        g.globalAlpha = 1;
      }
      text(g, 'hiệu ứng chỉ sống trong bảng số', 960, 190, { font: font(800, 46), align: 'center', fill: CREAM });
    }, ev() { return [[this.t, 'paper'], [L('rep4').t0 + 1.0, 'marker'], [L('rep4').t0 + 2.6, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('tv') }]]; } },

    // 19 — tivi: ảnh thật làm món mục tiêu tụt (Mode B)
    { n: 'tv', t: START.tv, f(g, lt, T) {
      const t0 = L('rep6').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      deskLamp(g);
      sheet(g, 700, 560, 900, 620, .006, { grid: true });
      tvProp(g, 700, 470, 1.02);
      text(g, '53%', 1460, 330, { font: font(900, 110), align: 'center', fill: GREY });
      const dp = ease.out(seg(T, t0 + 2.2, t0 + 3.0));
      text(g, '35%', 1460, 330 + 190 * dp, { font: font(900, 110), align: 'center', fill: '#F0525B' });
      if (dp > 0) {
        g.globalAlpha = dp;
        // mũi tên đi xuống bên phải hai con số, không đè lên chữ
        line(g, [[1660, 380], [1660, 520]], '#C0392B', 9);
        line(g, [[1660, 520], [1632, 470]], '#C0392B', 9);
        line(g, [[1660, 520], [1688, 470]], '#C0392B', 9);
        g.globalAlpha = 1;
      }
      text(g, 'ảnh thật: hiệu ứng đảo chiều', 700, 810, { font: font(800, 42), align: 'center', fill: '#F0525B' });
      text(g, 'chất lượng hình vẽ bằng ảnh, không bằng số', 700, 850, { font: font(400, 32, 'Patrick Hand'), align: 'center', fill: GREY });
    }, ev() { return [[this.t, 'paper'], [L('rep6').t0 + 2.2, 'marker'], [this.t, 'amb', { kind: 'low', t1: at('attempts') }]]; } },

    // 20 — 91 lần thử, 11 lần ra hiệu ứng (Mode B)
    { n: 'attempts', t: START.attempts, f(g, lt, T) {
      const t0 = L('rep7').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      deskLamp(g);
      sheet(g, 960, 540, 1340, 640, -.008, { grid: true });
      const cols = 13, rows = 7, step = 78, x0 = 960 - (cols - 1) * step / 2, y0 = 250;
      const filled = [0, 3, 6, 11, 22, 30, 44, 51, 58, 70, 83];
      for (let i = 0; i < 91; i++) {
        const cx2 = x0 + (i % cols) * step, cy2 = y0 + Math.floor(i / cols) * step;
        const on = filled.includes(i);
        const p = ease.out(seg(T, t0 + .6 + i * .045, t0 + 1.0 + i * .045));
        if (p <= 0) continue;
        cel(g, ellP(cx2, cy2, 26 * p, 26 * p), { f: on ? PAL.hoodie.f : '#C4BCA6', s: on ? '#C88A00' : '#A79E8B', so: [3, 3], l: INK2, lw: 2.2 });
      }
      text(g, '91 lần thử', 960, 200, { font: font(900, 58), align: 'center', fill: CREAM });
      text(g, '11 lần ra hiệu ứng đáng tin', 960, 790, { font: font(900, 46), align: 'center', fill: PAL.hoodie.f });
      text(g, 'thống kê dự báo là gần 30%', 960, 832, { font: font(400, 34, 'Patrick Hand'), align: 'center', fill: GREY });
    }, ev() { return [[this.t, 'paper'], [this.t + .8, 'pop'], [this.t + 1.6, 'pop'], [this.t + 2.4, 'pop'], [this.t, 'amb', { kind: 'low', t1: at('wild') }]]; } },

    // 21 — kệ siêu thị: 3,6 triệu giao dịch, hiệu ứng ~1% (Mode C, whip pan)
    { n: 'wild', t: START.wild, tr: 'whip', f(g, lt, T) {
      const t0 = L('wild2').t0;
      wineShelf(g, T);
      kng(g, 1560, 1000, { s: .8, E: ek(T, [[0, 'thinking'], [t0 + 2.4, 'surprised']]), headYaw: -.28, talk: TL.talk(T) }, T);
      text(g, '3,6 triệu giao dịch rượu vang', 960, 200, { font: font(900, 62), align: 'center', fill: CREAM });
      text(g, '755.158 khách hàng', 960, 250, { font: font(400, 36, 'Patrick Hand'), align: 'center', fill: PAL.muted });
      const p = ease.out(seg(T, t0 + 1.4, t0 + 2.0));
      text(g, 'hiệu ứng chỉ khoảng 1%', 960, 850, { font: font(900, 66), align: 'center', fill: PAL.hoodie.f });
      const hp = ease.out(seg(T, t0 + .6, t0 + 1.2));
      bigHand(g, lerp(1760, 1560, hp), 700, -.3, { gest: blendGest(GEST.relaxed, GEST.hold, hp), flip: true });
    }, ev() { return [[this.t - .12, 'whoosh'], [this.t + .6, 'pop'], [this.t + 1.0, 'pop'], [this.t + 1.4, 'pop'], [this.t, 'music', { cue: 'F' }], [this.t, 'amb', { kind: 'scroll', t1: at('regular') }]]; } },

    // 22 — người mua thường xuyên: hiệu ứng biến mất (Mode C)
    { n: 'regular', t: START.regular, f(g, lt, T) {
      const t0 = L('wild3').t0;
      shopRoom(g, T);
      S.person(g, 1620, 905, .84, '#33405A', { ph: 0 });
      counterFront(g, T);
      kng(g, 1120, 940, { s: .92, E: ek(T, [[0, 'smile'], [t0 + 1.4, 'happy']]), headYaw: .12, talk: TL.talk(T) }, T);
      milkTeaCup(g, 720, 830, .9, { lv: .7, strawRot: -.06 });
      text(g, 'người mua thường xuyên', 960, 220, { font: font(900, 56), align: 'center', fill: CREAM });
      const p = ease.out(seg(T, t0 + .4, t0 + 1.0));
      text(g, 'hiệu ứng biến mất hẳn', 960, 820, { font: font(900, 62), align: 'center', fill: PAL.hoodie.f });
      bigHand(g, lerp(1400, 1300, p), 700, -.4, { gest: blendGest(GEST.relaxed, GEST.hold, p), flip: true });
    }, ev() { return [[this.t, 'pop'], [this.t + .4, 'step'], [this.t, 'amb', { kind: 'room', t1: at('flight') }]]; } },

    // 23 — trang đặt vé máy bay: không có hiệu ứng (Mode B)
    { n: 'flight', t: START.flight, f(g, lt, T) {
      const t0 = L('wild4').t0;
      ground(g, '#0E131D');
      // mặt bàn gỗ dưới màn hình
      cel(g, rect(-200, 800, W + 200, 880), { f: '#3A2E20', s: '#241C14', so: [0, 10], l: '#0E0B08', lw: 3 });
      cel(g, rect(-200, 880, W + 200, H + 200), { f: '#1A140E', l: '#0E0B08', lw: 3 });
      flightScreen(g, T);
      // chén cà phê và sổ tay trên bàn
      cel(g, ellP(300, 800, 62, 26), { f: '#D8D4CC', s: '#A8A49C', so: [6, 8], l: '#12131A', lw: 2.6 });
      cel(g, ellP(300, 796, 44, 18), { f: '#4A3222', l: '#12131A', lw: 2 });
      cel(g, rect(1480, 760, 1700, 830), { f: '#F3EEDF', s: '#C9C2B0', so: [8, 10], l: INK2, lw: 2.6 });
      text(g, 'hơn 140.000 lượt tìm kiếm', 960, 110, { font: font(900, 58), align: 'center', fill: CREAM });
      const p = ease.out(seg(T, t0 + 2.2, t0 + 2.8));
      text(g, 'không ra hiệu ứng nào', 960, 838, { font: font(900, 58), align: 'center', fill: '#F0525B' });
      const hp = ease.out(seg(T, t0 + .6, t0 + 1.2));
      g.save(); g.translate(lerp(1300, 1080, hp), lerp(500, 560, hp)); g.rotate(.2);
      cel(g, poly([[0, 0], [0, 34], [10, 24], [18, 44], [26, 40], [18, 22], [32, 20]]), { f: CREAM, s: '#B9B3A4', so: [4, 4], l: '#12131A', lw: 2.4 });
      g.restore();
    }, ev() { return [[this.t, 'paper'], [this.t + .6, 'step'], [this.t + 1.0, 'step'], [this.t + 1.4, 'step'], [this.t, 'amb', { kind: 'scroll', t1: at('model') }]]; } },

    // 24 — mô hình: mồi câu là một câu nói (Mode A)
    { n: 'model', t: START.model, f(g, lt, T) {
      const t0 = L('model').t0, cam0 = { x: 0, y: 0 };
      S.roomBack(g, T, cam0);
      kng(g, 1400, 700, { s: 1.06, E: ek(T, [[0, 'thinking'], [t0 + 2.4, 'determined']]), headYaw: -.2, armL: ak(T, [[0, { at: [-150, 250] }], [t0 + .6, { at: [-130, 110], gest: 'point', rot: -.4 }]], .4), armR: ak(T, [[0, { at: [150, 250] }]]), talk: TL.talk(T) }, T);
      S.roomFront(g, T, cam0);
      const cross = ease.out(seg(T, t0 + 2.6, t0 + 3.3));
      // bảng giá dựng trên mặt bàn
      priceBoard(g, 640, 660, { rot: -.03, s: .74, rows: [
        { k: 'CỠ NHỎ', p: '35.000', cross: false },
        { k: 'CỠ LỚN', p: '60.000', cross: false, hot: true },
        { k: 'CỠ VỪA', p: '65.000', cross: cross > .02 },
      ] });
      text(g, 'mồi câu là một câu nói:', 700, 300, { font: font(700, 42), align: 'center', fill: PAL.muted });
      text(g, '"món này đáng"', 700, 372, { font: font(900, 58), align: 'center', fill: PAL.hoodie.f });
    }, ev() { return [[this.t, 'paper'], [L('model').t0 + 2.6, 'marker'], [this.t, 'music', { cue: 'G' }], [this.t, 'amb', { kind: 'room', t1: at('action') }]]; } },

    // 25 — hành động: gạch món bị áp đảo khỏi bảng so sánh (Mode A close)
    { n: 'action', t: START.action, f(g, lt, T) {
      const t0 = L('action1').t0;
      ground(g, '#14161F');
      cel(g, rect(-200, -160, W + 200, H + 200), { f: WOOD, s: WOOD2, so: [0, -10], l: '#0E0B08', lw: 3 });
      deskLamp(g);
      for (let i = 0; i < 7; i++) line(g, [[-200, 40 + i * 150], [W + 200, 16 + i * 150]], '#241C14', 5);
      priceBoard(g, 900, 470, { rot: -.015, rows: [
        { k: 'CỠ NHỎ', p: '35.000', cross: false },
        { k: 'CỠ LỚN', p: '60.000', cross: false, hot: true },
        { k: 'CỠ VỪA', p: '65.000', cross: false },
      ] });
      const xp = ease.out(seg(T, t0 + 1.4, t0 + 2.2));
      if (xp > 0) {
        g.save(); g.globalAlpha = xp;
        // gạch qua dòng "CỠ VỪA" — món bị áp đảo
        line(g, [[610, 664], [1290, 646]], '#D8402F', 12);
        g.globalAlpha = 1;
        // cây bút đỏ vừa gạch xong: đầu bút còn nằm ở cuối vạch gạch
        g.save(); g.translate(1138, 646);
        cel(g, rect(-130, -12, 105, 12), { f: '#D8402F', s: '#A8321F', so: [0, 10], l: INK2, lw: 2.4 });
        cel(g, poly([[105, -12], [152, 0], [105, 12]]), { f: '#E8DCC0', l: INK2, lw: 2.4 });
        g.restore();
        // tay nắm thân bút, ngón tay quàng quanh
        bigHand(g, lerp(1120, 1092, xp), lerp(688, 642, xp), .06, { gest: blendGest(GEST.relaxed, GEST.hold, xp) });
      }
      text(g, 'gạch món bị áp đảo khỏi bảng so sánh', 900, 776, { font: font(900, 46), align: 'center', fill: CREAM });
      text(g, 'tệ hơn ở mọi tiêu chí = không phải đối thủ của món nào', 900, 820, { font: font(400, 32, 'Patrick Hand'), align: 'center', fill: PAL.muted });
    }, ev() { return [[this.t, 'paper'], [L('action1').t0 + 1.4, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('action3') }]]; } },

    // 26 — nhớ giá món mình hay uống (Mode A close)
    { n: 'action3', t: START.action3, f(g, lt, T) {
      const t0 = L('action3').t0, cam0 = { x: 0, y: 0 };
      S.roomBack(g, T, cam0);
      kng(g, 1420, 780, { s: 1.0, E: ek(T, [[0, 'determined'], [t0 + 2.6, 'smile']]), headYaw: -.2, headPitch: .12, armL: ak(T, [[0, { at: [-150, 250] }], [t0 + .8, { at: [-150, 120], gest: 'hold', rot: -.3 }]], .4), talk: TL.talk(T) }, T);
      S.roomFront(g, T, cam0);
      // sổ ghi nằm trên mặt bàn, mép dưới chạm mép bàn
      g.save(); g.translate(556, 762); g.rotate(-.05);
      cel(g, rect(-300, -215, 300, 215), { f: '#F3EEDF', s: '#C9C2B0', so: [12, 16], l: INK2, lw: 3 });
      cel(g, rect(-300, -215, -262, 215), { f: '#D8402F', l: INK2, lw: 2.4 });
      for (let i = 0; i < 5; i++) line(g, [[-230, -190 + i * 72], [230 - (i % 2) * 60, -190 + i * 72]], 'rgba(110,130,165,.45)', 1.6);
      revealText(g, 'cà phê đen đá', -232, -114, seg(T, t0 + 1.0, t0 + 2.2), { font: font(400, 50, 'Patrick Hand'), fill: INK2 });
      revealText(g, '35.000đ', -232, -34, seg(T, t0 + 2.4, t0 + 3.4), { font: font(900, 62), fill: INK2 });
      revealText(g, 'quen rồi → không bị mồi câu', -232, 62, seg(T, t0 + 3.2, t0 + 4.6), { font: font(400, 40, 'Patrick Hand'), fill: GREY });
      g.restore();
    }, ev() { return [[this.t, 'paper'], [L('action3').t0 + 1.2, 'marker'], [L('action3').t0 + 2.6, 'marker'], [this.t, 'amb', { kind: 'room', t1: at('roi') }]]; } },

    // 27 — Rối nói (Mode B)
    { n: 'roi', t: START.roi, f(g, lt, T) {
      shopRoom(g, T);
      counterFront(g, T);
      // ba ly trên quầy, thẻ giá của chúng
      milkTeaCup(g, 1180, 830, .84, { lv: .55 });
      priceCard(g, 1180, 620, '35.000', { rot: -.05, s: .92 });
      milkTeaCup(g, 1500, 830, 1.04, { lv: .72, strawRot: -.06 });
      priceCard(g, 1500, 590, '60.000', { rot: .03, s: .92, hot: true });
      // Rối đứng bên trái trên quầy
      roi(g, 560, 690, 3.0, { t: T, E: { mo: .5, lookX: .2 } });
      bubble(g, 1180, 350, 1000, 300, (gg, w, h) => {
        text(gg, 'MỒI CÂU', 0, -50, { font: font(900, 62), align: 'center', base: 'middle', fill: PAL.violet.f });
        text(gg, 'KHÔNG BÁN ĐƯỢC GÌ', 0, 30, { font: font(900, 54), align: 'center', base: 'middle', fill: PAL.violet.f });
      }, { tail: 'left' });
    }, ev() { return [[this.t, 'pop'], [this.t + .3, 'boing'], [this.t, 'amb', { kind: 'room', t1: at('close') }]]; } },

    // 28 — cận cảnh: bạn không bị lừa, bạn đang tin cái bảng giá nói (Mode A)
    { n: 'close', t: START.close, f(g, lt, T) {
      const t0 = L('close').t0, cam0 = { x: 0, y: 0 };
      S.roomBack(g, T, cam0);
      kng(g, 1300, 760, { s: 1.16, E: ek(T, [[0, 'smile'], [t0 + 3.2, 'happy']]), headYaw: -.14, headRoll: .03, armL: ak(T, [[0, { at: [-150, 250] }], [t0 + .8, { at: [-135, 175], gest: 'hold', rot: -.25 }]], .4), armR: ak(T, [[0, { at: [150, 250] }]]), talk: TL.talk(T) }, T);
      S.roomFront(g, T, cam0);
      milkTeaCup(g, 800, 950, .78, { lv: .6, strawRot: -.06 });
      // bảng giá đặt trên mặt bàn, không đè lên cửa sổ
      priceBoard(g, 336, 686, { rot: -.05, s: .74, rows: [
        { k: 'CỠ NHỎ', p: '35.000', cross: false },
        { k: 'CỠ LỚN', p: '60.000', cross: false, hot: true },
        { k: 'CỠ VỪA', p: '65.000', cross: true },
      ] });
      text(g, '23:58', 78, 128, { font: font(900, 66), fill: PAL.muted });
    }, ev() { return [[this.t, 'pop'], [this.t + .4, 'ting'], [this.t, 'music', { cue: 'G' }], [this.t, 'amb', { kind: 'room', t1: at('next') }]]; } },

    // 29 — thẻ cuối (Mode A)
    { n: 'next', t: START.next, f(g, lt, T) {
      const t0 = L('next').t0, endT = L('next').t1 + .5, cam0 = { x: 0, y: 0 };
      S.roomBack(g, T, cam0);
      kng(g, 1250, 700, { s: 1.1, E: ek(T, [[0, 'talk'], [t0 + 3.2, 'smile'], [endT + .4, 'happy']]), headYaw: -.12, armL: ak(T, [[0, { at: [-150, 250] }], [endT + .4, { at: [-190, -80], gest: 'open', rot: -.1 }]], .3), armR: ak(T, [[0, { at: [150, 250] }]]) }, T);
      S.roomFront(g, T, cam0);
      const p = ease.back(seg(lt, .05, .6));
      if (p > 0) {
        g.save(); g.translate(560 - (1 - p) * 700, 560); g.rotate(-.03);
        cel(g, rect(-350, -172, 350, 172), { f: '#F3EEDF', s: '#C9C2B0', so: [14, 18], l: INK2, lw: 3.4 });
        cel(g, ellP(-220, -162, 15, 15), { f: PAL.red.f, s: PAL.red.s, so: [-4, -4], l: PAL.red.l, lw: 2 });
        text(g, 'TRẠM', -310, -92, { font: font(900, 76), fill: INK2 });
        text(g, 'NGHĨ NHIỀU', -310, -6, { font: font(900, 76), fill: INK2 });
        text(g, 'TẬP SAU', -310, 58, { font: font(400, 38, 'Patrick Hand'), fill: GREY });
        text(g, 'Tại sao ta luôn tưởng mình đúng?', -310, 118, { font: font(800, 36), fill: INK2 });
        g.restore();
      }
      text(g, '23:58', 78, 128, { font: font(900, 66), fill: PAL.muted });
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
