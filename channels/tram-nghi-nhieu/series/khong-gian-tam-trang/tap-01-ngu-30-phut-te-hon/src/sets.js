// sets.js — các nơi chốn của tập này, vẽ riêng cho phim này.
// Rig của kênh (../../../../rig/) cung cấp ngôn ngữ vẽ; file này cung cấp nơi chốn.
// Mỗi nơi vẽ hai lớp: 'back' (tường, màn hình, đồ vật xa) và 'front' (mặt bàn, đệm ghế — thứ che
// người). Nhân vật vẽ giữa hai lớp nên Kẻ ngồi sau đệm, nằm sau nệm, đứng sau quầy.
import { cel, path, poly, ellP, line, rect, rrect, mix, rgba, TAU, W, H } from '../../../../rig/cel.js';
import { PAL } from '../../../../rig/character.js';
import { text, font, tag } from '../../../../rig/broll.js';

const INK = '#1D202A';
const front = o => (o && o.part === 'front');

// ——— 1. văn phòng buổi chiều thứ Sáu ———
export function vanPhong(g, t, o = {}) {
  if (front(o)) {
    // đệm sofa và hai tay vịn: Kẻ ngồi sau đệm, chỉ thấy từ ngực trở lên
    cel(g, rect(1120, 700, 1900, 1010), { f: '#4A4038', s: '#332C26', so: [0, -12], l: INK, lw: 4 });
    cel(g, rect(1040, 730, 1140, 1010), { f: '#554A40', s: '#332C26', so: [-6, -6], l: INK, lw: 4 });
    cel(g, rect(1860, 730, 1940, 1010), { f: '#554A40', s: '#332C26', so: [6, -6], l: INK, lw: 4 });
    return;
  }
  g.fillStyle = '#4A3E32'; g.fillRect(-200, -200, W + 400, H + 400);
  // cửa sổ lớn bên trái, nắng chiều xiên qua kính lọc
  const wx = 90, wy = 70, ww = 760, wh = 560;
  cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#1B2136', l: '#39415C', lw: 5 });
  g.save(); g.beginPath(); g.rect(wx + 8, wy + 8, ww - 16, wh - 16); g.clip();
  g.fillStyle = '#D8A94E'; g.fillRect(wx, wy, ww, wh);
  g.fillStyle = '#7A5A34'; g.fillRect(wx, wy + 300, ww, 120);
  g.fillStyle = '#4E3A22'; g.fillRect(wx, wy + 420, ww, 90);
  g.fillStyle = PAL.hoodie.f; g.fillRect(wx, wy + 510, ww, 50);
  for (let i = 0; i < 12; i++) {
    const bx = wx + 20 + (i % 6) * 124, bh = 120 + ((i * 37) % 5) * 60;
    g.fillStyle = '#1E2434'; g.fillRect(bx, wy + 510 - bh, 84, bh);
    for (let k = 0; k < 5; k++) { g.fillStyle = PAL.hoodie.h; g.fillRect(bx + 12 + (k % 3) * 24, wy + 500 - bh + 18 + Math.floor(k / 3) * 34, 8, 10); }
  }
  g.restore();
  line(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#39415C', 6);
  line(g, [[wx, wy + wh * .42], [wx + ww, wy + wh * .42]], '#39415C', 6);
  g.fillStyle = 'rgba(255,203,7,.10)';
  g.beginPath(); g.moveTo(wx + ww, wy + 120); g.lineTo(wx + ww + 300, wy + 210); g.lineTo(wx + ww + 380, H); g.lineTo(wx + ww - 60, H); g.closePath(); g.fill();

  // tường phải: bảng ghim và đồng hồ treo
  g.fillStyle = '#7A5A3E'; g.fillRect(1080, 0, W - 880, H);
  cel(g, rect(1120, 130, 1420, 540), { f: '#232838', l: '#39415C', lw: 4 });
  for (let i = 0; i < 4; i++) cel(g, rect(1140 + i * 10, 160 + i * 26, 1390 - i * 8, 186 + i * 26), { f: '#2E3448', l: '#39415C', lw: 2 });
  // đồng hồ treo tường (đồng hồ Kẻ nhìn ở nhịp hook3)
  cel(g, ellP(1620, 210, 78, 78), { f: '#F2EFE6', s: '#D8D4C8', so: [-8, -6], l: INK, lw: 5 });
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(g, [[1620 + Math.cos(a) * 60, 210 + Math.sin(a) * 60], [1620 + Math.cos(a) * 51, 210 + Math.sin(a) * 51]], '#6B7288', 4); }
  // sàn
  cel(g, rect(-200, 900, W + 200, H + 200), { f: '#2A2118', s: '#1C1610', so: [0, -8], l: '#0E0B08', lw: 3 });
  // lưng sofa và gối
  cel(g, poly([[1060, 620], [1160, 546], [1880, 546], [1940, 620], [1940, 740], [1060, 740]]),
    { f: '#2E5A5A', s: '#1E3E3E', so: [0, -8], l: INK, lw: 4 });
  cel(g, poly([[1150, 700], [1270, 636], [1390, 700], [1270, 742]]), { f: '#8C6E4E', l: INK, lw: 3 });
  // bàn làm việc nhỏ bên trái, bình nước
  cel(g, rect(240, 860, 700, 900), { f: '#3A2E22', l: INK, lw: 4 });
  cel(g, rect(268, 900, 308, 1010), { f: '#3A2E22', l: INK, lw: 4 });
  cel(g, rect(632, 900, 672, 1010), { f: '#3A2E22', l: INK, lw: 4 });
  cel(g, rect(330, 806, 400, 860), { f: '#3E4A66', s: '#2A3348', l: INK, lw: 3 });
}

// ——— 2. góc đọc sách của Kẻ Nghĩ Nhiều ở nhà ———
export function nhaKe(g, t, o = {}) {
  if (front(o)) {
    // mặt bàn gỗ: sổ tay nằm trên bàn, Kẻ đứng sau bàn
    cel(g, rect(690, 758, 1310, 796), { f: '#4A3A28', s: '#33261A', so: [0, 8], l: INK, lw: 4 });
    cel(g, rect(650, 796, 1350, H + 200), { f: '#2E241A', s: '#1E1710', so: [0, -10], l: '#0E0B08', lw: 4 });
    return;
  }
  g.fillStyle = '#3E6B5A'; g.fillRect(-200, -200, W + 400, H + 400);
  // kệ sách bên trái: bốn kệ, sách đứng nghiêng
  cel(g, rect(90, 96, 640, 790), { f: '#2A2118', s: '#1C1610', so: [0, 10], l: INK, lw: 4 });
  const spines = [PAL.hoodie.f, PAL.cyan.f, PAL.red.f, PAL.violet.f, '#E0A64A'];
  for (let row = 0; row < 4; row++) {
    const y = 150 + row * 160;
    cel(g, rect(104, y + 118, 626, y + 138), { f: '#3A2E22', l: INK, lw: 3 });
    for (let i = 0; i < 11; i++) {
      const a = Math.abs(Math.sin(i * 12.9898 + row * 7.233) * 43758.5453) % 1;
      const w = 26 + a * 16, x = 118 + i * 46;
      const h = 96 + (a * 3 % 1) * 20;
      cel(g, rect(x, y + 118 - h, x + w, y + 118), { f: spines[(i + row) % spines.length], s: '#1C1610', so: [0, 4], l: INK, lw: 2 });
    }
  }
  // cửa sổ đêm bên phải: sao và mặt trăng
  const wx = 1440, wy = 96, ww = 420, wh = 380;
  cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#151A2C', l: '#2A3145', lw: 5 });
  g.save(); g.beginPath(); g.rect(wx + 8, wy + 8, ww - 16, wh - 16); g.clip();
  for (let i = 0; i < 60; i++) {
    const a = Math.abs(Math.sin(i * 45.13) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 91.7) * 12345.678) % 1;
    g.fillStyle = rgba(i % 3 ? PAL.hoodie.h : PAL.cyan.h, .2 + b * .45); g.fillRect(wx + 20 + a * (ww - 40), wy + 40 + b * (wh - 90), 4, 4);
  }
  cel(g, ellP(wx + 300, wy + 110, 42, 42), { f: '#F4ECDD', l: INK, lw: 2 });
  cel(g, ellP(wx + 322, wy + 96, 38, 38), { f: '#151A2C', l: INK, lw: 2 });
  g.restore();
  line(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#2A3145', 5);
  // đèn bàn: sợi sáng vàng hắt lên sổ tay
  cel(g, poly([[1120, 470], [1250, 470], [1232, 524], [1138, 524]]), { f: '#33394E', s: '#222736', so: [0, -6], l: INK, lw: 3 });
  line(g, [[1185, 524], [1185, 640]], '#33394E', 11);
  cel(g, ellP(1185, 668, 62, 26), { f: '#FFD976', s: PAL.hoodie.f, so: [-4, -4], l: INK, lw: 3 });
  const grd = g.createRadialGradient(1185, 690, 30, 1185, 690, 760);
  grd.addColorStop(0, 'rgba(255,203,7,.20)');
  grd.addColorStop(1, 'rgba(255,203,7,0)');
  g.fillStyle = grd; g.beginPath(); g.arc(1185, 690, 760, 0, TAU); g.fill();
  // sàn
  cel(g, rect(-200, 900, W + 200, H + 200), { f: '#232838', s: '#1A1E2A', so: [0, -8], l: '#0E0B08', lw: 3 });
}

// ——— 3. phòng thí nghiệm giấc ngủ ———
export function phongThiNghiem(g, t, o = {}) {
  if (front(o)) {
    // chiếc giường thí nghiệm ở tiền cảnh: người tham gia nằm sau nệm
    cel(g, rect(120, 700, 1120, 760), { f: '#C8CEDC', s: '#9AA2B6', so: [0, -8], l: INK, lw: 4 });
    cel(g, rect(120, 760, 1120, 830), { f: '#E2E6F0', l: '#9AA2B6', lw: 3 });
    return;
  }
  g.fillStyle = '#4A6B8A'; g.fillRect(-200, -200, W + 400, H + 400);
  for (let i = 0; i < 9; i++) line(g, [[0, 120 + i * 110], [W, 120 + i * 110]], '#222736', 2);
  // đèn trần dài
  for (let i = 0; i < 3; i++) {
    const lx = 340 + i * 620;
    cel(g, rect(lx - 150, 40, lx + 150, 76), { f: '#E8EAF0', l: '#5A6488', lw: 3 });
    const grd = g.createRadialGradient(lx, 80, 20, lx, 80, 700);
    grd.addColorStop(0, 'rgba(220,228,255,.16)'); grd.addColorStop(1, 'rgba(220,228,255,0)');
    g.fillStyle = grd; g.fillRect(lx - 700, 0, 1400, 900);
  }
  // sàn
  cel(g, rect(-200, 860, W + 200, H + 200), { f: '#44536F', s: '#33415C', so: [0, -6], l: '#12151F', lw: 3 });
  // màn hình đo lớn bên phải
  cel(g, rect(1180, 130, 1830, 640), { f: '#0E1620', l: '#39415C', lw: 5 });
  g.save(); g.beginPath(); g.rect(1192, 142, 626, 486); g.clip();
  g.fillStyle = '#0A1A24'; g.fillRect(1192, 142, 626, 486);
  g.strokeStyle = 'rgba(103,232,249,.14)'; g.lineWidth = 1;
  for (let x = 1200; x < 1820; x += 48) line(g, [[x, 142], [x, 628]], 'rgba(103,232,249,.14)', 1);
  for (let y = 150; y < 630; y += 48) line(g, [[1192, y], [1818, y]], 'rgba(103,232,249,.14)', 1);
  g.restore();
  cel(g, rect(1460, 640, 1550, 700), { f: '#39415C', l: INK, lw: 3 });
  cel(g, rect(1380, 700, 1630, 740), { f: '#39415C', l: INK, lw: 3 });
  // tủ thiết bị
  cel(g, rect(1000, 420, 1150, 860), { f: '#2A3040', s: '#1F2431', so: [-8, 0], l: INK, lw: 4 });
  for (let i = 0; i < 5; i++) cel(g, rect(1020, 460 + i * 80, 1130, 510 + i * 80), { f: '#39415C', l: '#12151F', lw: 2 });
  for (let i = 0; i < 5; i++) { const on = ((t * 2 + i) % 6) < 3; cel(g, ellP(1110, 485 + i * 80, 7, 7), { f: on ? PAL.green.f : '#4A5164' }); }
}

// ——— 3. bảng ghim ba cột ———
export function bangBaNhanh(g, t, o = {}) {
  g.fillStyle = '#241E16'; g.fillRect(-200, -200, W + 400, H + 400);
  const grd = g.createRadialGradient(1290, 430, 40, 1290, 430, 900);
  grd.addColorStop(0, 'rgba(255,203,7,.14)'); grd.addColorStop(1, 'rgba(255,203,7,0)');
  g.fillStyle = grd; g.fillRect(-200, -200, W + 400, H + 400);
  cel(g, rect(700, 130, 1880, 800), { f: '#20242F', s: '#15181F', so: [0, 12], l: '#39415C', lw: 5 });
  cel(g, rect(760, 180, 1820, 750), { f: '#F4ECDD', s: '#DED4C0', so: [0, 6], l: INK, lw: 3 });
  cel(g, ellP(800, 200, 12, 12), { f: PAL.red.f, s: PAL.red.s, so: [-3, -3], l: PAL.red.l, lw: 2 });
  g.fillStyle = '#fff'; g.beginPath(); g.arc(797, 196, 3.5, 0, TAU); g.fill();
  cel(g, ellP(1780, 200, 12, 12), { f: PAL.red.f, s: PAL.red.s, so: [-3, -3], l: PAL.red.l, lw: 2 });
  // thước kẻ treo ngang dưới tờ giấy
  cel(g, rect(820, 776, 1760, 806), { f: '#E4DCC8', l: INK, lw: 2 });
  for (let i = 0; i < 24; i++) line(g, [[820 + i * 40, 776], [820 + i * 40, i % 5 ? 790 : 798]], '#6B7288', 2);
}

// ——— 4. buồng đo đường sóng não ———
export function giacNguSau(g, t, o = {}) {
  if (front(o)) {
    // nệm giường đo ở tiền cảnh
    cel(g, rect(-100, 720, 520, 790), { f: '#C8CEDC', s: '#9AA2B6', so: [0, -8], l: INK, lw: 4 });
    cel(g, rect(10, 660, 220, 726), { f: '#E2E6F0', l: '#9AA2B6', lw: 3 });
    cel(g, poly([[220, 700], [500, 712], [500, 726], [220, 720]]), { f: '#6E7A94', l: INK, lw: 3 });
    return;
  }
  g.fillStyle = '#0A1420'; g.fillRect(-200, -200, W + 400, H + 400);
  // màn hình EEG lớn bên trái
  cel(g, rect(300, 110, 1180, 620), { f: '#0A1218', l: '#2E3A4E', lw: 6 });
  g.save(); g.beginPath(); g.rect(314, 124, 852, 482); g.clip();
  g.fillStyle = '#07101A'; g.fillRect(314, 124, 852, 482);
  g.strokeStyle = 'rgba(103,232,249,.10)'; g.lineWidth = 1;
  for (let x = 320; x < 1170; x += 54) line(g, [[x, 124], [x, 606]], 'rgba(103,232,249,.10)', 1);
  for (let y = 130; y < 610; y += 54) line(g, [[314, y], [1166, y]], 'rgba(103,232,249,.10)', 1);
  g.restore();
  // bảng điện tử bên phải: nơi các biểu đồ mọc lên
  cel(g, rect(1240, 110, 1880, 680), { f: '#0C1119', s: '#080C12', so: [0, 10], l: '#2E3A4E', lw: 6 });
  // đèn ngủ vàng ở góc trái
  cel(g, rect(30, 640, 90, 680), { f: '#3A4260', l: INK, lw: 3 });
  const grd = g.createRadialGradient(60, 620, 10, 60, 620, 320);
  grd.addColorStop(0, 'rgba(255,203,7,.22)'); grd.addColorStop(1, 'rgba(255,203,7,0)');
  g.fillStyle = grd; g.beginPath(); g.arc(60, 620, 320, 0, TAU); g.fill();
  cel(g, ellP(60, 620, 30, 26), { f: '#FFD976', s: PAL.hoodie.f, so: [-4, -4], l: INK, lw: 3 });
  // sàn
  cel(g, rect(-200, 900, W + 200, H + 200), { f: '#232838', s: '#1A1E2A', so: [0, -6], l: '#0E0B08', lw: 3 });
}

// ——— 5. bàn đo của phòng thí nghiệm ———
export function banDo(g, t, o = {}) {
  if (front(o)) {
    // mặt bàn: che chân nhân vật, và ba tờ phiếu nằm trên bàn
    cel(g, rect(-200, 780, W + 200, H + 200), { f: '#7C88A4', s: '#5B6784', so: [0, -10], l: '#141720', lw: 4 });
    cel(g, rect(700, 690, 790, 790), { f: '#D8D4CC', s: '#A8A49C', so: [8, 0], l: INK, lw: 3 });
    return;
  }
  g.fillStyle = '#8C93A8'; g.fillRect(-200, -200, W + 400, H + 400);
  const grd = g.createRadialGradient(1520, 380, 60, 1520, 380, 900);
  grd.addColorStop(0, 'rgba(230,240,255,.13)'); grd.addColorStop(1, 'rgba(230,240,255,0)');
  g.fillStyle = grd; g.fillRect(-200, -200, W + 400, H + 400);
  // bảng đo lớn bên phải: nơi biểu đồ hiện ra
  cel(g, rect(1180, 150, 1860, 640), { f: '#0C1119', s: '#080C12', so: [0, 10], l: '#39415C', lw: 6 });
}

// ——— 6. quầy cà phê ven đường ———
export function quanCaPhe(g, t, o = {}) {
  if (front(o)) {
    // mặt quầy gỗ: Kẻ ngồi sau quầy
    cel(g, rect(-200, 720, 1080, 800), { f: '#7A5334', s: '#54381F', so: [0, -10], l: INK, lw: 4 });
    cel(g, rect(-200, 800, 1080, H + 200), { f: '#5E4128', s: '#412C1A', so: [0, -8], l: INK, lw: 3 });
    return;
  }
  g.fillStyle = '#8A5A2E'; g.fillRect(-200, -200, W + 400, H + 400);
  // cửa sổ kính bên phải, nắng chiều
  const wx = 1180, wy = 90, ww = 640, wh = 520;
  cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#24304A', l: '#4A4438', lw: 5 });
  g.save(); g.beginPath(); g.rect(wx + 8, wy + 8, ww - 16, wh - 16); g.clip();
  g.fillStyle = '#E8B44A'; g.fillRect(wx, wy, ww, wh);
  g.fillStyle = '#7A5334'; g.fillRect(wx, wy + 300, ww, 110);
  g.fillStyle = PAL.hoodie.f; g.fillRect(wx, wy + 410, ww, 110);
  g.fillStyle = '#1E2434';
  for (let i = 0; i < 5; i++) g.fillRect(wx + i * 140, wy + 250 - (i % 3) * 60, 110, 380);
  g.restore();
  // máy pha
  cel(g, rect(700, 470, 960, 720), { f: '#8A92A6', s: '#5A6488', so: [-8, -6], l: INK, lw: 4 });
  cel(g, rect(730, 510, 930, 580), { f: '#2A3040', l: INK, lw: 3 });
  for (let i = 0; i < 4; i++) cel(g, ellP(760 + i * 44, 545, 12, 12), { f: '#4A5164', l: INK, lw: 2 });
  cel(g, rect(760, 610, 900, 640), { f: '#39415C', l: INK, lw: 2 });
  // kệ tách
  cel(g, rect(120, 470, 340, 720), { f: '#3A2A1E', l: INK, lw: 4 });
  for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) {
    cel(g, rect(140 + i * 38, 500 + r * 110, 170 + i * 38, 540 + r * 110), { f: '#E4E0D6', l: INK, lw: 2 });
  }
  // bàn gỗ sát cửa sổ: cái "giường" đặt tách lên
  cel(g, rect(1180, 700, 1560, 740), { f: '#5A4632', s: '#3E3020', so: [0, -8], l: INK, lw: 4 });
  cel(g, rect(1210, 800, 1250, 900), { f: '#3E3020', l: INK, lw: 4 });
  cel(g, rect(1490, 800, 1530, 900), { f: '#3E3020', l: INK, lw: 4 });
  cel(g, poly([[1210, 700], [1310, 664], [1410, 700], [1310, 730]]), { f: '#D8CDB4', l: INK, lw: 3 });
  // đồng hồ đếm ngược treo trên tường
  cel(g, ellP(1080, 300, 78, 78), { f: '#F2EFE6', s: '#D8D4C8', so: [-8, -6], l: INK, lw: 5 });
  for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; line(g, [[1080 + Math.cos(a) * 60, 300 + Math.sin(a) * 60], [1080 + Math.cos(a) * 51, 300 + Math.sin(a) * 51]], '#6B7288', 4); }
}

// ——— 7. bàn hồ sơ giấy ———
export function banHoSo(g, t, o = {}) {
  if (front(o)) {
    // mặt bàn và bìa hồ sơ nằm trên bàn
    cel(g, rect(-200, 700, W + 200, H + 200), { f: '#5A4530', s: '#3E2F20', so: [0, -10], l: '#0E0B08', lw: 4 });
    cel(g, rect(700, 620, 1600, 790), { f: '#C8A97E', s: '#9C8158', so: [0, 10], l: INK, lw: 4 });
    cel(g, rect(740, 646, 1560, 686), { f: '#EFE3CC', l: '#9C8158', lw: 2 });
    line(g, [[760, 666], [900, 740], [1060, 680], [1200, 730]], '#F0525B', 4);
    cel(g, ellP(790, 666, 13, 13), { f: PAL.red.f, s: PAL.red.s, so: [-3, -3], l: PAL.red.l, lw: 2 });
    return;
  }
  g.fillStyle = '#7A3A2A'; g.fillRect(-200, -200, W + 400, H + 400);
  const grd = g.createRadialGradient(960, 640, 40, 960, 640, 820);
  grd.addColorStop(0, 'rgba(255,255,255,.10)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(-200, -200, W + 400, H + 400);
  cel(g, rect(300, 60, 420, 110), { f: '#33394E', l: INK, lw: 3 });
}

// ——— 8. bàn làm việc buổi tối ———
export function banLamViecToi(g, t, o = {}) {
  if (front(o)) {
    // mặt bàn, sổ tay và bút
    cel(g, rect(-200, 760, 1360, H + 200), { f: '#2A2118', s: '#1C1610', so: [0, -10], l: '#0E0B08', lw: 4 });
    cel(g, rect(1080, 690, 1420, 810), { f: '#F4ECDD', s: '#DED4C0', so: [0, 6], l: INK, lw: 3 });
    line(g, [[1260, 660], [1300, 700]], '#E0523F', 7);
    return;
  }
  g.fillStyle = '#3A3A4A'; g.fillRect(-200, -200, W + 400, H + 400);
  // cửa sổ đêm bên trái
  const wx = 120, wy = 110, ww = 520, wh = 470;
  cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#151A2C', l: '#2A3145', lw: 5 });
  g.save(); g.beginPath(); g.rect(wx + 8, wy + 8, ww - 16, wh - 16); g.clip();
  for (let i = 0; i < 70; i++) {
    const a = Math.abs(Math.sin(i * 45.13) * 43758.5453) % 1, b = Math.abs(Math.sin(i * 91.7) * 12345.678) % 1;
    g.fillStyle = rgba(i % 3 ? PAL.hoodie.h : PAL.cyan.h, .2 + b * .45); g.fillRect(wx + 20 + a * (ww - 40), wy + 40 + b * (wh - 90), 4, 4);
  }
  g.restore();
  line(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#2A3145', 5);
  // giường ở góc phải
  cel(g, rect(1400, 700, 1920, 780), { f: '#C8CEDC', s: '#9AA2B6', so: [0, -8], l: INK, lw: 4 });
  cel(g, rect(1440, 630, 1660, 700), { f: '#E2E6F0', l: '#9AA2B6', lw: 3 });
  cel(g, poly([[1400, 700], [1700, 706], [1690, 790], [1410, 786]]), { f: '#3E4A66', s: '#2A3348', so: [0, 5], l: INK, lw: 3 });
  // đèn bàn và vệt sáng
  cel(g, poly([[880, 250], [1000, 250], [980, 300], [900, 300]]), { f: '#33394E', s: '#222736', so: [0, -6], l: INK, lw: 3 });
  line(g, [[930, 300], [930, 400]], '#33394E', 10);
  cel(g, ellP(930, 420, 60, 24), { f: '#FFD976', s: PAL.hoodie.f, so: [-4, -4], l: INK, lw: 3 });
  const grd = g.createRadialGradient(930, 430, 30, 930, 430, 720);
  grd.addColorStop(0, 'rgba(255,203,7,.20)'); grd.addColorStop(1, 'rgba(255,203,7,0)');
  g.fillStyle = grd; g.beginPath(); g.arc(930, 430, 720, 0, TAU); g.fill();
}
