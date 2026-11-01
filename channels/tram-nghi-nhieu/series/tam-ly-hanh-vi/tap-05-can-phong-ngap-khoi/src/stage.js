// Cinematic Camera Stages and Macro Inserts for Tap 05 — Căn phòng ngập khói 1968.
// Designed with authentic cinematic shot types: Extreme Close-ups, Dutch angles, POV, and dynamic smoke particles.
import { cel, path, poly, ellP, line, mix, rgba, TAU, rect } from '../../../../rig/cel.js';
import { PAL } from '../../../../rig/character.js';

export const INK = '#151824';

// ——— SHOT 1: Macro ngòi bút chấm mực cào trên giấy thi 1968 (macroPen) ———
export function macroPen(g, T) {
  // Nền giấy thi cổ màu ngà vàng thô ráp
  g.fillStyle = '#F5F1E6';
  g.fillRect(0, 0, 1920, 1080);

  // Các dòng kẻ in màu xanh nhạt cổ điển
  g.save();
  g.strokeStyle = 'rgba(70, 100, 140, 0.28)';
  g.lineWidth = 4;
  for (let y = 180; y <= 980; y += 160) {
    line(g, [[120, y], [1800, y]], 'rgba(70, 100, 140, 0.28)', 4);
  }
  g.restore();

  // Dòng chữ mực đen ướt đang viết dở
  const writeProgress = Math.min(1, T * 0.45);
  g.save();
  g.font = 'bold 52px "Be Vietnam Pro"';
  g.fillStyle = '#181C28';
  g.fillText('BÀI KHẢO SÁT THÁI ĐỘ SINH VIÊN (1968)', 160, 310);
  g.font = 'italic 46px "Patrick Hand"';
  g.fillStyle = '#2A3048';
  const sampleText = 'Tôi cảm thấy việc học tập tại trường đem lại nhiều cơ hội...';
  const len = Math.floor(sampleText.length * writeProgress);
  g.fillText(sampleText.substring(0, len), 160, 470);
  g.restore();

  // Chiếc ngòi bút máy kim loại to bản đang viết
  const penX = 160 + len * 22;
  const penY = 470;
  g.save();
  g.translate(penX, penY);
  g.rotate(-0.55 + Math.sin(T * 12) * 0.04);

  // Thân bút gỗ mun
  cel(g, poly([[-28, -600], [28, -600], [20, -120], [-20, -120]]), { f: '#2B1A0E', s: '#1A0F07', so: [8, 0], l: INK, lw: 3.5 });
  // Khâu kim loại vàng
  cel(g, rect(-20, -120, 20, -80), { f: '#FFD700', s: '#D4AF37', l: INK, lw: 3 });
  // Ngòi kim loại thép ánh bạc
  cel(g, poly([[-18, -80], [18, -80], [14, -30], [0, 0], [-14, -30]]), { f: '#E2E8F0', s: '#94A3B8', so: [4, 0], l: INK, lw: 3 });
  // Khe dẫn mực ở ngòi
  line(g, [[0, -60], [0, -10]], '#181C28', 2.5);
  // Giọt mực ướt lấp lánh ở đầu ngòi
  cel(g, ellP(0, -2, 4, 4), { f: '#181C28', l: '#181C28', lw: 1 });
  g.restore();

  // Ánh sáng đèn vàng rọi từ góc trên
  const lampGrd = g.createRadialGradient(960, 300, 100, 960, 500, 1100);
  lampGrd.addColorStop(0, 'rgba(255, 230, 150, 0.22)');
  lampGrd.addColorStop(1, 'rgba(255, 230, 150, 0)');
  g.fillStyle = lampGrd;
  g.fillRect(0, 0, 1920, 1080);
}

// ——— SHOT 2: Cận cảnh gương mặt Tuấn đeo kính tròn (tuanFaceCloseUp) ———
export function tuanFaceCloseUp(g, T, o = {}) {
  // Nền phòng tối phía sau mờ nhẹ
  g.fillStyle = '#141826';
  g.fillRect(0, 0, 1920, 1080);

  // Khuôn mặt Tuấn zoom cận cảnh (x: 960, y: 520, scale: 3.2)
  g.save();
  g.translate(960, 540);
  g.scale(3.4, 3.4);

  const breathe = Math.sin(T * 2.4) * 2;
  g.translate(0, breathe);

  // Cổ và cổ áo sơ mi
  cel(g, rect(-32, 50, 32, 100), { f: PAL.skin.s, l: INK, lw: 2.5 });
  cel(g, poly([[-38, 70], [0, 105], [38, 70], [0, 78]]), { f: '#FFFFFF', s: '#DDD7C9', l: INK, lw: 2.4 });

  // Đầu Tuấn
  const isWorried = o.emotion === 'worried';
  const headPitch = (o.headPitch || 0) + (isWorried ? Math.sin(T * 14) * 2 : 0);
  g.translate(0, headPitch);

  cel(g, ellP(0, -10, 48, 54), { f: PAL.skin.f, s: PAL.skin.s, so: [0, 8], l: INK, lw: 3.5 });
  // Tóc rẽ ngôi cổ điển
  cel(g, poly([[-48, -32], [36, -48], [52, -10], [46, 6], [36, -18], [-12, -34], [-44, -14]]), { f: '#1D212F', s: '#12141D', l: INK, lw: 3 });

  // Gọng kính tròn to bản
  g.strokeStyle = '#2A3045';
  g.lineWidth = 4;
  g.beginPath();
  g.ellipse(-20, -10, 18, 18, 0, 0, TAU);
  g.ellipse(20, -10, 18, 18, 0, 0, TAU);
  g.stroke();
  line(g, [[-2, -10], [2, -10]], '#2A3045', 4);

  // Tròng mắt
  const eyeX = (o.lookRight ? 7 : -2) + Math.sin(T * 2.2) * 2;
  const eyeY = o.lookUp ? -4 : 0;
  g.fillStyle = INK;
  g.beginPath();
  g.arc(-20 + eyeX, -10 + eyeY, 6.5, 0, TAU);
  g.arc(20 + eyeX, -10 + eyeY, 6.5, 0, TAU);
  g.fill();

  // Đốm sáng phản quang trong kính
  g.fillStyle = '#FFFFFF';
  g.beginPath();
  g.arc(-23 + eyeX, -13 + eyeY, 2.5, 0, TAU);
  g.arc(17 + eyeX, -13 + eyeY, 2.5, 0, TAU);
  g.fill();

  // Giọt mồ hôi lăn bên thái dương nếu lo lắng
  if (isWorried) {
    const swY = -10 + (T * 18) % 36;
    cel(g, ellP(44, swY, 5, 8), { f: '#67E8F9', l: INK, lw: 1.8 });
    // Cánh mũi phập phồng
    line(g, [[-4, 16], [0, 18], [4, 16]], INK, 2.5);
  }

  // Miệng
  g.strokeStyle = PAL.mouth;
  g.lineWidth = 3.5;
  g.beginPath();
  if (o.action === 'cough') {
    g.ellipse(0, 26, 8, 11, 0, 0, TAU);
    g.fillStyle = PAL.mouth; g.fill();
  } else if (isWorried) {
    g.moveTo(-12, 24); g.lineTo(12, 22); g.stroke();
  } else {
    g.moveTo(-10, 22); g.lineTo(10, 22); g.stroke();
  }

  g.restore();
}

// ——— SHOT 3: Cận cảnh lỗ thông gió chân tường & khói xì phì phì (ventMacro) ———
export function ventMacro(g, T, smokeIntensity = 0.5) {
  // Bờ tường gạch thô cận cảnh
  g.fillStyle = '#1A1E2C';
  g.fillRect(0, 0, 1920, 1080);

  // Ván sàn gỗ phía dưới
  cel(g, rect(0, 780, 1920, 1080), { f: '#2B1C10', s: '#1A1008', l: '#120A05', lw: 4 });

  // Lưới sắt thông gió to bản ở trung tâm (Vent Frame)
  const vx = 360, vy = 280, vw = 1200, vh = 500;
  cel(g, rect(vx, vy, vx + vw, vy + vh), { f: '#0E1018', s: '#07080D', so: [0, 14], l: '#2B3248', lw: 6 });

  // Các bu-lông 4 góc
  for (const [bx, by] of [[vx + 30, vy + 30], [vx + vw - 30, vy + 30], [vx + 30, vy + vh - 30], [vx + vw - 30, vy + vh - 30]]) {
    cel(g, ellP(bx, by, 14, 14), { f: '#3E4662', s: '#252B3D', l: INK, lw: 2.8 });
  }

  // Các thanh chắn sắt dọc
  g.save();
  for (let x = vx + 60; x < vx + vw - 40; x += 60) {
    line(g, [[x, vy + 20], [x, vy + vh - 20]], '#252C40', 8);
    line(g, [[x - 3, vy + 20], [x - 3, vy + vh - 20]], '#434C68', 3);
  }
  g.restore();

  // Khói trắng xì ra cuồn cuộn qua các nan sắt
  if (smokeIntensity > 0) {
    const d = Math.min(1.2, smokeIntensity);
    const puffs = 40;
    for (let i = 0; i < puffs; i++) {
      const seed = i * 43.1;
      const prog = ((T * 0.45 + i / puffs) % 1.0);
      const x = vx + 200 + prog * 1100 + Math.sin(T * 2.2 + seed) * 45;
      const y = vy + vh * 0.5 - Math.sin(prog * Math.PI) * 160 + Math.cos(T * 1.8 + seed) * 35;
      const r = (50 + prog * 200) * d;
      const alpha = Math.min(0.65, (1 - prog * 0.6) * 0.75 * d);

      const grad = g.createRadialGradient(x, y, r * 0.15, x, y, r);
      grad.addColorStop(0, `rgba(250, 252, 255, ${alpha})`);
      grad.addColorStop(0.5, `rgba(230, 238, 250, ${alpha * 0.75})`);
      grad.addColorStop(1, 'rgba(210, 222, 242, 0)');

      g.fillStyle = grad;
      g.beginPath();
      g.arc(x, y, r, 0, TAU);
      g.fill();
    }
  }
}

// ——— SHOT 4: Cận cảnh mặt người lạ thản nhiên như tượng đá (strangerFace) ———
export function strangerFace(g, T, o = {}) {
  // Không gian phòng mù sương
  g.fillStyle = '#161928';
  g.fillRect(0, 0, 1920, 1080);

  // Khói mờ trôi ngang tiền cảnh
  const dGrd = g.createLinearGradient(0, 0, 0, 1080);
  dGrd.addColorStop(0, 'rgba(20, 24, 38, 0.95)');
  dGrd.addColorStop(1, 'rgba(20, 24, 38, 0.7)');
  g.fillStyle = dGrd; g.fillRect(0, 0, 1920, 1080);

  // Người lạ zoom cận cảnh (x: 960, y: 520, scale: 3.2)
  g.save();
  g.translate(960, 520);
  g.scale(3.2, 3.2);

  // Áo len xám cao cổ
  cel(g, rect(-40, 50, 40, 120), { f: '#353D50', s: '#252B3A', l: INK, lw: 3 });

  // Đầu cắm cúi tuyệt đối không biểu cảm
  cel(g, ellP(0, -10, 46, 52), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 3.5 });
  // Tóc nâu hạt dẻ
  cel(g, poly([[-46, -34], [34, -48], [48, -12], [-42, -18]]), { f: '#3E2A1E', l: INK, lw: 3 });

  // Mắt nhắm nghiền hoặc nhìn cắm xuống bài thi
  line(g, [[-26, -10], [-8, -13]], INK, 4.5);
  line(g, [[8, -13], [26, -10]], INK, 4.5);

  // Miệng mím chặt phẳng lì (Deadpan / No reaction)
  line(g, [[-12, 18], [12, 18]], INK, 3.5);

  g.restore();

  // Khói lãng đãng bay ngang qua mặt người lạ
  for (let i = 0; i < 8; i++) {
    const sy = 400 + i * 70;
    const sx = ((T * 80 + i * 260) % 2200) - 200;
    const sGrad = g.createRadialGradient(sx, sy, 20, sx, sy, 140);
    sGrad.addColorStop(0, 'rgba(240, 245, 255, 0.35)');
    sGrad.addColorStop(1, 'rgba(240, 245, 255, 0)');
    g.fillStyle = sGrad;
    g.beginPath(); g.arc(sx, sy, 140, 0, TAU); g.fill();
  }
}

// ——— SHOT 5: Chiếc đồng hồ bấm giờ vintage 1968 (stopwatchMacro) ———
export function stopwatchMacro(g, T, elapsedSeconds = 120, o = {}) {
  // Nền tối với lưới mờ
  g.fillStyle = '#10131E';
  g.fillRect(0, 0, 1920, 1080);

  const cx = 960, cy = 480, r = 260;

  // Vỏ thép bóng đồng hồ bấm giờ
  cel(g, ellP(cx, cy, r + 24, r + 24), { f: '#CBD5E1', s: '#94A3B8', so: [0, 14], l: INK, lw: 5 });
  // Núm bấm trên đỉnh
  cel(g, rect(cx - 24, cy - r - 64, cx + 24, cy - r - 16), { f: '#E2E8F0', s: '#64748B', l: INK, lw: 4 });
  cel(g, ellP(cx, cy - r - 64, 38, 14), { f: '#FFD700', s: '#D4AF37', l: INK, lw: 3 });

  // Mặt đồng hồ trắng kem
  cel(g, ellP(cx, cy, r, r), { f: '#FAF8F5', s: '#DCD6C8', l: INK, lw: 4 });

  // 60 vạch chia giây
  for (let k = 0; k < 60; k++) {
    const a = k / 60 * TAU - Math.PI / 2;
    const isMajor = k % 5 === 0;
    const r0 = r * (isMajor ? 0.82 : 0.89);
    line(g, [[cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a) * r * 0.94, cy + Math.sin(a) * r * 0.94]], INK, isMajor ? 4 : 2);
  }

  // Số hiển thị 0, 1, 2, 3... phút
  g.font = 'bold 36px "Be Vietnam Pro"';
  g.fillStyle = INK; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('60', cx, cy - r * 0.72);
  g.fillText('15', cx + r * 0.72, cy);
  g.fillText('30', cx, cy + r * 0.72);
  g.fillText('45', cx - r * 0.72, cy);

  // Kim đồng hồ quay theo elapsedSeconds
  const needleAngle = -Math.PI / 2 + (elapsedSeconds / 60) * TAU;
  line(g, [[cx, cy], [cx + Math.cos(needleAngle) * r * 0.85, cy + Math.sin(needleAngle) * r * 0.85]], '#E63946', 5);
  cel(g, ellP(cx, cy, 12, 12), { f: '#E63946', l: INK, lw: 2.5 });

  // Bảng số liệu nổi bật ở đáy
  if (o.label) {
    cel(g, rect(cx - 380, 840, cx + 380, 980), { f: '#1E2333', s: '#12141F', so: [0, 8], l: PAL.ink, lw: 3.5 });
    g.font = 'bold 44px "Be Vietnam Pro"';
    g.fillStyle = o.labelColor || '#4ADE80';
    g.fillText(o.label, cx, 890);
    g.font = '500 32px "Be Vietnam Pro"';
    g.fillStyle = '#FAF8F5';
    g.fillText(o.sub || '', cx, 940);
  }
}

// ——— SHOT 6: Cửa sổ bật mở đón ánh nắng (sunlightWindow) ———
export function sunlightWindow(g, T, o = {}) {
  // Nền phòng tối
  g.fillStyle = '#10131E';
  g.fillRect(0, 0, 1920, 1080);

  const wx = 580, wy = 120, ww = 760, wh = 580;

  // Bầu trời trong xanh ngoài cửa sổ
  cel(g, rect(wx, wy, wx + ww, wy + wh), { f: '#7DD3FC', s: '#38BDF8', so: [0, 10], l: INK, lw: 4 });
  // Đám mây trắng trôi ngoài trời
  cel(g, ellP(wx + 220 + Math.sin(T * 0.2) * 40, wy + 160, 90, 45), { f: '#FFFFFF', l: 'transparent' });
  cel(g, ellP(wx + 280 + Math.sin(T * 0.2) * 40, wy + 140, 110, 55), { f: '#FFFFFF', l: 'transparent' });

  // Luồng nắng vàng óng ùa vào phòng
  const sunGrd = g.createRadialGradient(wx + 380, wy + 180, 60, wx + 380, wy + 320, 850);
  sunGrd.addColorStop(0, 'rgba(255, 237, 160, 0.55)');
  sunGrd.addColorStop(0.6, 'rgba(255, 225, 120, 0.22)');
  sunGrd.addColorStop(1, 'rgba(255, 220, 100, 0)');
  g.fillStyle = sunGrd; g.fillRect(0, 0, 1920, 1080);

  // Khung và cánh cửa sổ mở toang hai bên
  cel(g, rect(wx - 140, wy, wx, wy + wh), { f: '#483424', s: '#322316', l: INK, lw: 3.5 });
  cel(g, rect(wx + ww, wy, wx + ww + 140, wy + wh), { f: '#483424', s: '#322316', l: INK, lw: 3.5 });
  line(g, [[wx, wy], [wx, wy + wh]], INK, 5);
  line(g, [[wx + ww, wy], [wx + ww, wy + wh]], INK, 5);
}

// ——— Căn phòng gạch thí nghiệm 1968 (Columbia testing room) ———
export function columbiaRoom(g, T, o = {}) {
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
  cel(g, rect(1240, 160, 1340, 280), { f: '#FAF8F5', s: '#DCD6C8', l: '#141724', lw: 1.8 });
  cel(g, rect(1380, 180, 1500, 260), { f: '#F0ECE1', s: '#D4CEBF', l: '#141724', lw: 1.8 });

  // Chiếc đồng hồ kim treo tường
  const clockX = 960, clockY = 160, clockR = 64;
  cel(g, ellP(clockX, clockY, clockR, clockR), { f: '#FAF8F5', s: '#DCD6C8', so: [0, 8], l: '#151824', lw: 4 });
  for (let k = 0; k < 12; k++) {
    const a = k / 12 * TAU;
    line(g, [[clockX + Math.cos(a) * clockR * 0.8, clockY + Math.sin(a) * clockR * 0.8],
             [clockX + Math.cos(a) * clockR * 0.92, clockY + Math.sin(a) * clockR * 0.92]], '#2A3042', 2.5);
  }
  const minAngle = -Math.PI / 2 + (T * 0.15) % TAU;
  const hourAngle = -Math.PI / 2 + ((T * 0.15) / 12 + 0.8) % TAU;
  line(g, [[clockX, clockY], [clockX + Math.cos(minAngle) * clockR * 0.72, clockY + Math.sin(minAngle) * clockR * 0.72]], '#151824', 3.5);
  line(g, [[clockX, clockY], [clockX + Math.cos(hourAngle) * clockR * 0.48, clockY + Math.sin(hourAngle) * clockR * 0.48]], '#E63946', 4);
  cel(g, ellP(clockX, clockY, 5, 5), { f: '#E63946', l: '#151824', lw: 2 });

  // Cửa gỗ thoát hiểm bên trái
  const doorX = 80, doorY = 140, doorW = 240, doorH = 540;
  cel(g, rect(doorX, doorY, doorX + doorW, doorY + doorH), { f: '#3E2A1C', s: '#2A1C12', so: [-8, 0], l: '#140E08', lw: 4 });
  cel(g, rect(doorX + 24, doorY + 30, doorX + doorW - 24, doorY + 240), { f: '#4E3624', s: '#362418', l: '#140E08', lw: 2.6 });
  cel(g, rect(doorX + 24, doorY + 270, doorX + doorW - 24, doorY + doorH - 30), { f: '#4E3624', s: '#362418', l: '#140E08', lw: 2.6 });
  cel(g, ellP(doorX + doorW - 40, doorY + doorH * 0.52, 14, 14), { f: '#FFD700', s: '#D4AF37', so: [2, 2], l: '#140E08', lw: 2 });

  // Sàn gỗ phòng
  cel(g, rect(0, 680, 1920, 1080), { f: '#2E2014', s: '#20160D', so: [0, -8], l: '#140E08', lw: 3.5 });
  for (let i = 0; i < 7; i++) {
    const y = 730 + i * 52;
    line(g, [[0, y], [1920, y]], '#1E140C', 2.4);
  }

  // Lưới thông gió chân tường
  const ventX = 1620, ventY = 620, ventW = 220, ventH = 90;
  cel(g, rect(ventX, ventY, ventX + ventW, ventY + ventH), { f: '#12141F', s: '#0C0D14', so: [0, 6], l: '#2A3045', lw: 3.5 });
  for (let vx = ventX + 16; vx < ventX + ventW - 10; vx += 24) {
    line(g, [[vx, ventY + 10], [vx, ventY + ventH - 10]], '#3E4765', 3.5);
  }

  const lampGrd = g.createRadialGradient(960, 200, 40, 960, 500, 900);
  lampGrd.addColorStop(0, 'rgba(255, 236, 179, 0.14)');
  lampGrd.addColorStop(1, 'rgba(255, 236, 179, 0)');
  g.fillStyle = lampGrd;
  g.fillRect(0, 0, 1920, 1080);
}

export function testingDesk(g, T, o = {}) {
  const dx = 480, dy = 660, dw = 960, dh = 240;
  cel(g, rect(dx, dy, dx + dw, dy + dh), { f: '#483424', s: '#322316', so: [0, 10], l: '#150E09', lw: 3.5 });
  cel(g, rect(dx + 40, dy + dh, dx + 70, 980), { f: '#2C1E14', s: '#1C120A', l: '#150E09', lw: 3 });
  cel(g, rect(dx + dw - 70, dy + dh, dx + dw - 40, 980), { f: '#2C1E14', s: '#1C120A', l: '#150E09', lw: 3 });

  cel(g, rect(dx + 260, dy + 40, dx + 420, dy + 180), { f: '#FAF8F5', s: '#DDD7C9', so: [4, 6], l: '#1A1E2C', lw: 2.2 });
  for (let py = dy + 70; py < dy + 170; py += 22) {
    line(g, [[dx + 280, py], [dx + 400, py]], '#3A4258', 1.8);
  }
  cel(g, rect(dx + 440, dy + 80, dx + 448, dy + 150), { f: '#C59B27', s: '#967417', l: '#12141F', lw: 1.8 });

  if (o.confederates) {
    cel(g, rect(dx + 60, dy + 40, dx + 220, dy + 180), { f: '#F0ECE1', s: '#D4CEBF', so: [3, 5], l: '#1A1E2C', lw: 2 });
    for (let py = dy + 70; py < dy + 170; py += 22) {
      line(g, [[dx + 80, py], [dx + 200, py]], '#555C72', 1.6);
    }
    cel(g, rect(dx + dw - 220, dy + 40, dx + dw - 60, dy + 180), { f: '#F0ECE1', s: '#D4CEBF', so: [3, 5], l: '#1A1E2C', lw: 2 });
    for (let py = dy + 70; py < dy + 170; py += 22) {
      line(g, [[dx + dw - 200, py], [dx + dw - 80, py]], '#555C72', 1.6);
    }
  }
}

export function dynamicSmoke(g, T, density = 0) {
  if (density <= 0) return;
  const d = Math.min(1, density);
  const ventX = 1720;

  g.save();
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

export function tuanStudent(g, x, y, o = {}, T = 0) {
  g.save();
  g.translate(x, y);
  const s = o.s || 1.0;
  g.scale(s, s);

  const breathe = Math.sin(T * 2.6) * 2.5;
  g.translate(0, breathe);

  cel(g, poly([[-32, 20], [32, 20], [28, 90], [-28, 90]]), { f: '#FAF8F5', s: '#DDD7C9', so: [0, 6], l: INK, lw: 3 });
  cel(g, poly([[-24, 20], [0, 42], [24, 20], [0, 24]]), { f: '#FFFFFF', s: '#DDD7C9', l: INK, lw: 2.2 });
  cel(g, poly([[-8, 38], [8, 38], [6, 85], [0, 95], [-6, 85]]), { f: '#3B4D3C', s: '#29362A', l: INK, lw: 2 });

  const isCough = o.action === 'cough';
  const isEscape = o.action === 'escape';
  const isHesitate = o.action === 'hesitate';

  if (isCough) {
    line(g, [[26, 32], [20, -10]], INK, 8);
    cel(g, ellP(12, -18, 16, 14), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 2.4 });
  } else if (isHesitate) {
    line(g, [[-26, 32], [-45, 60], [-20, 75]], INK, 7);
    line(g, [[26, 32], [48, 15], [30, -5]], INK, 7);
    cel(g, ellP(24, -14, 15, 13), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 2.2 });
  } else {
    line(g, [[-26, 32], [-40, 65], [-15, 80]], INK, 7);
    line(g, [[26, 32], [42, 65], [20, 80]], INK, 7);
    cel(g, ellP(20, 82, 14, 12), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 2.2 });
  }

  const headYaw = o.headYaw || 0;
  const headPitch = (o.headPitch || 0) + (isCough ? Math.sin(T * 18) * 4 : 0);
  g.save();
  g.translate(0, -20);
  g.rotate(headYaw * 0.15);
  g.translate(0, headPitch);

  cel(g, ellP(0, -26, 34, 38), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 3 });
  cel(g, poly([[-34, -40], [28, -52], [38, -25], [34, -12], [26, -30], [-10, -42], [-32, -26]]), { f: '#1D212F', s: '#12141D', l: INK, lw: 2.8 });

  g.strokeStyle = '#2A3045';
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(-14, -26, 12, 12, 0, 0, TAU);
  g.ellipse(14, -26, 12, 12, 0, 0, TAU);
  g.stroke();
  line(g, [[-2, -26], [2, -26]], '#2A3045', 3);

  const isWorried = o.emotion === 'worried' || isCough || isHesitate;
  g.fillStyle = INK;
  if (isWorried) {
    const eyeX = (o.lookRight ? 5 : 0) + Math.sin(T * 2.5) * 2;
    g.beginPath();
    g.arc(-14 + eyeX, -26, 4.5, 0, TAU);
    g.arc(14 + eyeX, -26, 4.5, 0, TAU);
    g.fill();
    cel(g, ellP(32, -24 + (T * 12) % 24, 4, 7), { f: '#67E8F9', l: INK, lw: 1.6 });
  } else {
    g.beginPath();
    g.arc(-14, -23, 4, 0, TAU);
    g.arc(14, -23, 4, 0, TAU);
    g.fill();
  }

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

export function passiveActor(g, x, y, o = {}, T = 0) {
  g.save();
  g.translate(x, y);
  const s = o.s || 0.95;
  g.scale(s, s);

  cel(g, poly([[-30, 20], [30, 20], [26, 92], [-26, 92]]), { f: '#3A4255', s: '#292E3C', so: [0, 5], l: INK, lw: 2.8 });

  g.save();
  g.translate(0, -16);
  cel(g, ellP(0, -24, 30, 34), { f: PAL.skin.f, s: PAL.skin.s, l: INK, lw: 2.8 });
  cel(g, poly([[-30, -38], [24, -48], [32, -22], [-26, -24]]), { f: '#3E2A1E', l: INK, lw: 2.5 });
  line(g, [[-16, -20], [-6, -22]], INK, 3);
  line(g, [[6, -22], [16, -20]], INK, 3);
  g.restore();

  const flip = (T % 3.5) < 0.6 ? Math.sin((T % 3.5) / 0.6 * Math.PI) * 12 : 0;
  line(g, [[-24, 30], [-36, 60], [-10, 75 - flip]], INK, 6);
  line(g, [[24, 30], [36, 60], [10, 75]], INK, 6);

  g.restore();
}
