// Stage sets and dynamic smoke environment for Tap 05 — Căn phòng ngập khói 1968.
// Staged in a believable 1968 Columbia University brick testing room with animated smoke simulation.
import { cel, path, poly, ellP, line, mix, rgba, TAU, rect } from '../../../../rig/cel.js';
import { PAL } from '../../../../rig/character.js';
import * as S from '../../../../rig/sets.js';

export const INK = '#151824';

// ——— Căn phòng gạch thí nghiệm 1968 (Columbia testing room) ———
export function columbiaRoom(g, T, o = {}) {
  // Nền tường gạch 1960s
  g.fillStyle = '#161928';
  g.fillRect(0, 0, 1920, 1080);

  // Mảng tường gạch phía sau
  cel(g, rect(0, 0, 1920, 680), { f: '#22283A', s: '#1A1F2E', l: '#121520', lw: 3 });

  // Nét vữa gạch cổ điển
  g.save();
  g.strokeStyle = 'rgba(26, 31, 46, 0.6)';
  g.lineWidth = 2;
  for (let y = 60; y < 660; y += 48) {
    line(g, [[0, y], [1920, y]], 'rgba(18, 22, 34, 0.5)', 2);
    const offset = (y / 48) % 2 === 0 ? 0 : 44;
    for (let x = offset; x < 1920; x += 88) {
      line(g, [[x, y], [x, y + 48]], 'rgba(18, 22, 34, 0.4)', 2);
    }
  }
  g.restore();

  // Bảng thông báo gỗ trên tường
  cel(g, rect(1180, 120, 1560, 340), { f: '#38281A', s: '#261B11', so: [0, 8], l: '#120C08', lw: 3 });
  cel(g, rect(1200, 140, 1540, 320), { f: '#8B7355', s: '#6E5A42', l: '#120C08', lw: 2 });
  // Tờ thông báo ghim trên bảng
  cel(g, rect(1240, 160, 1340, 280), { f: '#FAF8F5', s: '#DCD6C8', l: '#141724', lw: 1.8 });
  cel(g, rect(1380, 180, 1500, 260), { f: '#F0ECE1', s: '#D4CEBF', l: '#141724', lw: 1.8 });

  // Chiếc đồng hồ kim treo tường (1968 vintage clock)
  const clockX = 960, clockY = 160, clockR = 64;
  cel(g, ellP(clockX, clockY, clockR, clockR), { f: '#FAF8F5', s: '#DCD6C8', so: [0, 8], l: '#151824', lw: 4 });
  for (let k = 0; k < 12; k++) {
    const a = k / 12 * TAU;
    line(g, [[clockX + Math.cos(a) * clockR * 0.8, clockY + Math.sin(a) * clockR * 0.8],
             [clockX + Math.cos(a) * clockR * 0.92, clockY + Math.sin(a) * clockR * 0.92]], '#2A3042', 2.5);
  }
  // Kim đồng hồ quay theo thời gian T
  const minAngle = -Math.PI / 2 + (T * 0.15) % TAU;
  const hourAngle = -Math.PI / 2 + ((T * 0.15) / 12 + 0.8) % TAU;
  line(g, [[clockX, clockY], [clockX + Math.cos(minAngle) * clockR * 0.72, clockY + Math.sin(minAngle) * clockR * 0.72]], '#151824', 3.5);
  line(g, [[clockX, clockY], [clockX + Math.cos(hourAngle) * clockR * 0.48, clockY + Math.sin(hourAngle) * clockR * 0.48]], '#E63946', 4);
  cel(g, ellP(clockX, clockY, 5, 5), { f: '#E63946', l: '#151824', lw: 2 });

  // Cửa gỗ thoát hiểm bên trái (Room Door)
  const doorX = 80, doorY = 140, doorW = 240, doorH = 540;
  cel(g, rect(doorX, doorY, doorX + doorW, doorY + doorH), { f: '#3E2A1C', s: '#2A1C12', so: [-8, 0], l: '#140E08', lw: 4 });
  cel(g, rect(doorX + 24, doorY + 30, doorX + doorW - 24, doorY + 240), { f: '#4E3624', s: '#362418', l: '#140E08', lw: 2.6 });
  cel(g, rect(doorX + 24, doorY + 270, doorX + doorW - 24, doorY + doorH - 30), { f: '#4E3624', s: '#362418', l: '#140E08', lw: 2.6 });
  // Tay nắm cửa đồng vàng
  cel(g, ellP(doorX + doorW - 40, doorY + doorH * 0.52, 14, 14), { f: '#FFD700', s: '#D4AF37', so: [2, 2], l: '#140E08', lw: 2 });

  // Sàn gỗ phòng (Floor)
  cel(g, rect(0, 680, 1920, 1080), { f: '#2E2014', s: '#20160D', so: [0, -8], l: '#140E08', lw: 3.5 });
  for (let i = 0; i < 7; i++) {
    const y = 730 + i * 52;
    line(g, [[0, y], [1920, y]], '#1E140C', 2.4);
  }

  // Lưới thông gió chân tường bên phải (Vent Grate) — Nơi khói xì ra
  const ventX = 1620, ventY = 620, ventW = 220, ventH = 90;
  cel(g, rect(ventX, ventY, ventX + ventW, ventY + ventH), { f: '#12141F', s: '#0C0D14', so: [0, 6], l: '#2A3045', lw: 3.5 });
  for (let vx = ventX + 16; vx < ventX + ventW - 10; vx += 24) {
    line(g, [[vx, ventY + 10], [vx, ventY + ventH - 10]], '#3E4765', 3.5);
  }

  // Luồng sáng đèn tuýp hắt xuống phòng
  const lampGrd = g.createRadialGradient(960, 200, 40, 960, 500, 900);
  lampGrd.addColorStop(0, 'rgba(255, 236, 179, 0.14)');
  lampGrd.addColorStop(1, 'rgba(255, 236, 179, 0)');
  g.fillStyle = lampGrd;
  g.fillRect(0, 0, 1920, 1080);
}

// Bàn và ghế gỗ nơi Tuấn ngồi làm bài
export function testingDesk(g, T, o = {}) {
  // Mặt bàn gỗ trong phòng thi
  const dx = 480, dy = 660, dw = 960, dh = 240;
  cel(g, rect(dx, dy, dx + dw, dy + dh), { f: '#483424', s: '#322316', so: [0, 10], l: '#150E09', lw: 3.5 });
  // Chân bàn
  cel(g, rect(dx + 40, dy + dh, dx + 70, 980), { f: '#2C1E14', s: '#1C120A', l: '#150E09', lw: 3 });
  cel(g, rect(dx + dw - 70, dy + dh, dx + dw - 40, 980), { f: '#2C1E14', s: '#1C120A', l: '#150E09', lw: 3 });

  // Tờ giấy phiếu khảo sát của Tuấn (Survey Questionnaire)
  cel(g, rect(dx + 260, dy + 40, dx + 420, dy + 180), { f: '#FAF8F5', s: '#DDD7C9', so: [4, 6], l: '#1A1E2C', lw: 2.2 });
  for (let py = dy + 70; py < dy + 170; py += 22) {
    line(g, [[dx + 280, py], [dx + 400, py]], '#3A4258', 1.8);
  }

  // Cây bút mực gỗ
  cel(g, rect(dx + 440, dy + 80, dx + 448, dy + 150), { f: '#C59B27', s: '#967417', l: '#12141F', lw: 1.8 });

  // Nếu có 2 người lạ (Confederates) ngồi cùng bàn
  if (o.confederates) {
    // Tờ giấy của người lạ 1 (bên trái)
    cel(g, rect(dx + 60, dy + 40, dx + 220, dy + 180), { f: '#F0ECE1', s: '#D4CEBF', so: [3, 5], l: '#1A1E2C', lw: 2 });
    for (let py = dy + 70; py < dy + 170; py += 22) {
      line(g, [[dx + 80, py], [dx + 200, py]], '#555C72', 1.6);
    }
    // Tờ giấy của người lạ 2 (bên phải)
    cel(g, rect(dx + dw - 220, dy + 40, dx + dw - 60, dy + 180), { f: '#F0ECE1', s: '#D4CEBF', so: [3, 5], l: '#1A1E2C', lw: 2 });
    for (let py = dy + 70; py < dy + 170; py += 22) {
      line(g, [[dx + dw - 200, py], [dx + dw - 80, py]], '#555C72', 1.6);
    }
  }
}

// ——— Mô phỏng khói trắng Canvas chuyển động chân thực (Dynamic Billowing Smoke) ———
export function dynamicSmoke(g, T, density = 0) {
  if (density <= 0) return;
  const d = Math.min(1, density);
  const ventX = 1720, ventY = 660;

  g.save();
  // Khói bò trên sàn từ ventX lan tỏa sang trái (x: 1720 -> 200)
  const puffs = 28;
  for (let i = 0; i < puffs; i++) {
    const seed = i * 29.3;
    const prog = ((T * 0.35 + i / puffs) % 1.0);
    const x = ventX - prog * 1540 + Math.sin(T * 1.4 + seed) * 36;
    const y = 840 - Math.pow(prog, 0.7) * 440 * d + Math.cos(T * 1.8 + seed * 1.2) * 28;
    const r = (35 + prog * 110) * (0.8 + 0.4 * Math.sin(seed + T));
    const alpha = Math.min(0.55 * d, (1 - prog * 0.7) * 0.65 * d);

    const grad = g.createRadialGradient(x, y, r * 0.15, x, y, r);
    grad.addColorStop(0, `rgba(245, 248, 255, ${alpha})`);
    grad.addColorStop(0.65, `rgba(225, 232, 245, ${alpha * 0.7})`);
    grad.addColorStop(1, 'rgba(210, 220, 240, 0)');

    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.fill();
  }
  g.restore();
}

// ——— Nhân vật chính của câu chuyện: Tuấn (Nam sinh viên 1968) ———
export function tuanStudent(g, x, y, o = {}, T = 0) {
  g.save();
  g.translate(x, y);
  const s = o.s || 1.0;
  g.scale(s, s);

  const breathe = Math.sin(T * 2.6) * 2.5;
  g.translate(0, breathe);

  // Thân áo sơ mi trắng ngà
  cel(g, poly([[-32, 20], [32, 20], [28, 90], [-28, 90]]), { f: '#FAF8F5', s: '#DDD7C9', so: [0, 6], l: INK, lw: 3 });
  // Cổ áo sơ mi
  cel(g, poly([[-24, 20], [0, 42], [24, 20], [0, 24]]), { f: '#FFFFFF', s: '#DDD7C9', l: INK, lw: 2.2 });
  // Cà vạt xanh rêu cổ điển
  cel(g, poly([[-8, 38], [8, 38], [6, 85], [0, 95], [-6, 85]]), { f: '#3B4D3C', s: '#29362A', l: INK, lw: 2 });

  // Cánh tay & Bàn tay
  const isCough = o.action === 'cough';
  const isEscape = o.action === 'escape';
  const isHesitate = o.action === 'hesitate';

  if (isCough) {
    // Đưa tay lên che miệng ho
    line(g, [[26, 32], [20, -10]], INK, 8);
    cel(g, ellP(12, -18, 16, 14), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 2.4 });
  } else if (isHesitate) {
    // Một tay chống cằm, một tay giơ lơ lửng ngập ngừng
    line(g, [[-26, 32], [-45, 60], [-20, 75]], INK, 7);
    line(g, [[26, 32], [48, 15], [30, -5]], INK, 7);
    cel(g, ellP(24, -14, 15, 13), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 2.2 });
  } else {
    // Tư thế cắm cúi viết bài
    line(g, [[-26, 32], [-40, 65], [-15, 80]], INK, 7);
    line(g, [[26, 32], [42, 65], [20, 80]], INK, 7);
    cel(g, ellP(20, 82, 14, 12), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 2.2 });
  }

  // Đầu Tuấn
  const headYaw = o.headYaw || 0;
  const headPitch = (o.headPitch || 0) + (isCough ? Math.sin(T * 18) * 4 : 0);
  g.save();
  g.translate(0, -20);
  g.rotate(headYaw * 0.15);
  g.translate(0, headPitch);

  // Khuôn mặt
  cel(g, ellP(0, -26, 34, 38), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 3 });
  // Tóc đen chải rẽ ngôi thập niên 60
  cel(g, poly([[-34, -40], [28, -52], [38, -25], [34, -12], [26, -30], [-10, -42], [-32, -26]]), { f: '#1D212F', s: '#12141D', l: INK, lw: 2.8 });

  // Kính cận gọng tròn cổ điển
  g.strokeStyle = '#2A3045';
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(-14, -26, 12, 12, 0, 0, TAU);
  g.ellipse(14, -26, 12, 12, 0, 0, TAU);
  g.stroke();
  line(g, [[-2, -26], [2, -26]], '#2A3045', 3);

  // Mắt (con ngươi hoang mang hoặc chớp)
  const isWorried = o.emotion === 'worried' || isCough || isHesitate;
  g.fillStyle = INK;
  if (isWorried) {
    // Mắt mở to lo lắng nhìn sang phải
    const eyeX = (o.lookRight ? 5 : 0) + Math.sin(T * 2.5) * 2;
    g.beginPath();
    g.arc(-14 + eyeX, -26, 4.5, 0, TAU);
    g.arc(14 + eyeX, -26, 4.5, 0, TAU);
    g.fill();
    // Giọt mồ hôi lo lắng rơi bên thái dương
    cel(g, ellP(32, -24 + (T * 12) % 24, 4, 7), { f: '#67E8F9', l: INK, lw: 1.6 });
  } else {
    // Mắt cắm cúi nhìn xuống bài
    g.beginPath();
    g.arc(-14, -23, 4, 0, TAU);
    g.arc(14, -23, 4, 0, TAU);
    g.fill();
  }

  // Miệng
  g.strokeStyle = PAL.mouth;
  g.lineWidth = 3;
  g.beginPath();
  if (isCough) {
    g.ellipse(0, -10, 6, 8, 0, 0, TAU);
    g.fillStyle = PAL.mouth; g.fill();
  } else if (isWorried) {
    g.moveTo(-10, -10); g.lineTo(10, -12); g.stroke();
  } else {
    g.moveTo(-8, -12); g.lineTo(8, -12); g.stroke();
  }

  g.restore();
  g.restore();
}

// ——— Người lạ thụ động (Confederate Actor: ngồi bất động làm bài) ———
export function passiveActor(g, x, y, o = {}, T = 0) {
  g.save();
  g.translate(x, y);
  const s = o.s || 0.95;
  g.scale(s, s);

  // Thân áo len xám cổ lọ
  cel(g, poly([[-30, 20], [30, 20], [26, 92], [-26, 92]]), { f: '#3A4255', s: '#292E3C', so: [0, 5], l: INK, lw: 2.8 });

  // Đầu cắm cúi tuyệt đối không ngước lên
  g.save();
  g.translate(0, -16);
  cel(g, ellP(0, -24, 30, 34), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 2.8 });
  // Tóc nâu hạt dẻ
  cel(g, poly([[-30, -38], [24, -48], [32, -22], [-26, -24]]), { f: '#3E2A1E', l: INK, lw: 2.5 });
  // Mắt nhắm nghiền cắm cúi
  line(g, [[-16, -20], [-6, -22]], INK, 3);
  line(g, [[6, -22], [16, -20]], INK, 3);
  g.restore();

  // Tay cầm bút lật trang giấy đều đặn (nhịp 3.5s một lần)
  const flip = (T % 3.5) < 0.6 ? Math.sin((T % 3.5) / 0.6 * Math.PI) * 12 : 0;
  line(g, [[-24, 30], [-36, 60], [-10, 75 - flip]], INK, 6);
  line(g, [[24, 30], [36, 60], [10, 75]], INK, 6);

  g.restore();
}
