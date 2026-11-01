// "Trạm Nghĩ Nhiều — Tập 02: Bẫy Chi Phí Chìm: Tại sao bạn không thể buông tay?"
// Đạo diễn điện ảnh kết hợp đa phong cách (Multi-Style Scene Director Engine):
// - Halftone Dossier (hồ sơ vụ án, tem mực vỡ, hạt trame Ben-Day)
// - Mid-century Toon (sunburst, hoạt hình nảy 50s, chuyển động lò xo)
// - Swiss Motion (lưới đồ họa chính xác, thước đo vi lượng hạch hạnh nhân 2.5x)
// - Late-Night Mind Lab & Bình minh ban công
// - Toàn bộ phim được phủ texture giấy và bụi phim (applyPaperTexture & renderGrainFx)

import { figure, expr, blendE, PAL, roi, battery } from '../../../../rig/character.js';
import { cel, path, poly, ellP, line, limb, mix, rgba, canvas, W, H, TAU, rect, rrect } from '../../../../rig/cel.js';
import { ground, panel, hilite, stamp, bubble, focusLines, subtitle, tag, text, sharpText, font, ease, seg, clamp01, INK, CREAM, ACCENT, STORY, REG, ambientMotes } from '../../../../rig/broll.js';
import { spring, squash, wiggle, kineticCamera } from '../../../../rig/motion.js';
import {
  applyPaperTexture, renderGrainFx, drawHalftoneField, drawDossierHeader,
  drawStampSlam, drawEvidenceTag, drawSunburst, drawSparkle, drawSwissMetric,
  setupSceneStyle, drawHalftoneWipe
} from '../../../../rig/styles.js';
import * as S from '../../../../rig/sets.js';
import { build } from './timeline.js';

const cv = document.getElementById('c'), G = cv.getContext('2d');
let TL, SHOTS = [], EV = [];

const E = x => typeof x === 'string' ? expr(x) : expr(x[0], x[1]);
function ek(T, keys, bl = 0.14) {
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const cur = E(keys[i][1]); if (i === 0) return cur;
  const u = seg(T, keys[i][0], keys[i][0] + bl); return u >= 1 ? cur : blendE(E(keys[i - 1][1]), cur, ease.inOut(u));
}
const lerp = (a, b, u) => a + (b - a) * u;
function ak(T, keys, d = 0.34) {
  let i = keys.length - 1; while (i > 0 && T < keys[i][0]) i--;
  const c = keys[i][1]; if (i === 0) return c;
  const p = keys[i - 1][1], u = ease.back(seg(T, keys[i][0], keys[i][0] + d)), v = ease.inOut(seg(T, keys[i][0], keys[i][0] + d * 0.7));
  return {
    ...(v < 0.5 ? p : c),
    at: [lerp(p.at[0], c.at[0], u), lerp(p.at[1], c.at[1], u)],
    rot: lerp(p.rot || 0, c.rot || 0, v),
    fore: lerp(p.fore ?? 1, c.fore ?? 1, v),
    upper: lerp(p.upper ?? 1, c.upper ?? 1, v),
    gest: v < 0.5 ? (p.gest || 'relaxed') : (c.gest || 'relaxed')
  };
}

const BLINKS = [1.2, 3.8, 4.1, 7.5, 11.2, 14.8, 19.3, 24.1, 28.5, 33.2, 39.0, 44.5, 49.2, 55.0, 61.3, 67.8, 73.4, 80.1, 88.5, 95.2, 103.4, 111.0, 119.5, 128.2, 137.0, 145.3, 154.2, 163.5, 172.0, 181.4, 190.2, 199.5, 208.4, 217.1, 226.3, 235.0, 244.2, 253.1, 262.4, 271.0];
function blink(T) {
  for (const b of BLINKS) { const d = T - b; if (d >= 0 && d < 0.16) return Math.sin(d / 0.16 * Math.PI); }
  return 0;
}
function camera(g, z, fx, fy, ox = 0, oy = 0) { g.translate(fx, fy); g.scale(z, z); g.translate(-fx - ox, -fy - oy); }
function kng(g, x, y, o, T) { g.save(); g.translate(x, y); figure(g, { t: T, blink: blink(T), linePx: 3.4, ...o }); g.restore(); }
const L = id => (TL && TL.L && TL.L[id]) || { t0: 0, t1: 0 };
const talkAt = T => TL ? TL.talk(T) : { o: 0, b: 0.5 };
const sway = T => Math.sin(T * 0.55) * 0.035;

// Common props
function drawSuitcase(g, x, y, openP = 0, stones = 3) {
  g.save();
  g.translate(x, y);
  // Shadow
  g.fillStyle = 'rgba(0,0,0,0.45)';
  g.beginPath();
  g.ellipse(0, 75, 170, 35, 0, 0, TAU);
  g.fill();

  // Suitcase body
  cel(g, rrect(-140, -50, 280, 120, 16), { f: '#4A3425', s: '#2E1E14', so: [-6, 10], l: '#1D140D', lw: 4 });
  // Leather bands
  cel(g, rect(-80, -50, -55, 70), { f: '#8A5832', l: '#1D140D', lw: 2.5 });
  cel(g, rect(55, -50, 80, 70), { f: '#8A5832', l: '#1D140D', lw: 2.5 });
  // Brass buckles
  cel(g, rrect(-85, 0, 30, 20, 4), { f: '#E8B43A', l: '#1D140D', lw: 2 });
  cel(g, rrect(55, 0, 30, 20, 4), { f: '#E8B43A', l: '#1D140D', lw: 2 });
  // Handle
  g.strokeStyle = '#2E1E14'; g.lineWidth = 10; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-35, -50); g.lineTo(-35, -80); g.lineTo(35, -80); g.lineTo(35, -50); g.stroke();

  // Heavy stone blocks inside
  if (stones > 0) {
    for (let i = 0; i < stones; i++) {
      const sx = -60 + i * 55, sy = -75 - (i % 2) * 20;
      cel(g, rrect(sx - 30, sy - 25, 60, 45, 8), { f: '#717582', s: '#4D515E', so: [-4, 6], l: '#2B2D35', lw: 3 });
      text(g, 'GẠCH', sx, sy + 6, { font: font(800, 14), fill: '#FAF8F5', align: 'center', noreg: true });
    }
  }

  // Chain wrapping to floor
  g.strokeStyle = '#5A6278'; g.lineWidth = 6; g.lineCap = 'round';
  g.beginPath(); g.moveTo(120, 20); g.quadraticCurveTo(180, 40, 230, 75); g.stroke();
  g.restore();
}

// Definition of 18 Scene Blocks
function shots() {
  return [
    // 1 (0.0s - 15.10s) · Chiếc vali gạch đá lúc 2h sáng
    {
      n: 's1_suitcase', t: 0,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'mindlab', { lampX: 480, lampY: 520 });
        ambientMotes(g, T, 35);
        // Desk environment
        g.fillStyle = '#1A1822'; g.fillRect(0, 780, W, 300);
        g.strokeStyle = '#282535'; g.lineWidth = 4; line(g, [[0, 780], [W, 780]], '#282535', 4);

        // Kẻ Nghĩ Nhiều sitting tired
        kng(g, 520, 680, {
          s: 1.12,
          E: ek(T, [[0, 'tired'], [6, ['worried', 'sweat']]]),
          headPitch: 0.12 + Math.sin(T * 0.8) * 0.04,
          talk: talkAt(T),
          shrug: 0.15
        }, T);

        // Suitcase and heavy chain
        drawSuitcase(g, 1150, 720, 0, 3);
        // Anchor of Rối
        roi(g, 1420, 740, 1.05, { t: T, alert: true });

        // Headline title tag
        drawEvidenceTag(g, 1150, 320, 'CHIẾC VALI QUÁ KHỨ', '1.000 NGÀY NÍU GIỮ', { w: 340, h: 140, rot: -0.04 });
      },
      ev: () => [
        [0, 'music', { cue: 'A' }],
        [0, 'amb', { kind: 'night', t1: 15.1 }],
        [1.2, 'foley', { kind: 'whoosh' }],
        [8.5, 'foley', { kind: 'paper' }]
      ]
    },

    // 2 (15.10s - 31.50s) · Cuốn sổ 1.000 ngày & Cảm giác mắc kẹt
    {
      n: 's2_journal', t: 15.10,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'dossier');
        drawDossierHeader(g, 'HỒ SƠ BỆNH ÁN NHẬN THỨC', 'CASE #02-1000-DAYS', 'CHỨNG CỨ SỐ 01');

        // Center notebook
        const cardW = 760, cardH = 460;
        panel(g, { x: 720, y: 560, w: cardW, h: cardH, rot: -0.02, pin: true }, (gg, pw, ph) => {
          gg.fillStyle = '#F4ECDD'; gg.fillRect(-pw/2, -ph/2, pw, ph);
          // Notebook lines
          for (let ly = -ph/2 + 70; ly < ph/2 - 20; ly += 36) {
            line(gg, [[-pw/2 + 40, ly], [pw/2 - 40, ly]], '#D9D0BE', 1.5);
          }
          text(gg, 'DỰ ÁN / MỐI QUAN HỆ BẾ TẮC', -pw/2 + 60, -ph/2 + 50, { font: font(900, 28), fill: '#1D202A' });
          text(gg, 'Thời gian tích lũy:', -pw/2 + 60, -ph/2 + 130, { font: font(700, 24), fill: '#6B7280' });
          text(gg, '1.000 NGÀY', -pw/2 + 60, -ph/2 + 220, { font: font(900, 80), fill: '#F0525B' });
          hilite(gg, -pw/2 + 50, -ph/2 + 250, 420, 24, seg(lt, 2, 3.5), '#FFB703');
          text(gg, '"Mình đã đầu tư quá nhiều, giờ dừng lại là mất trắng!"', -pw/2 + 60, -ph/2 + 320, { font: font(800, 22), fill: '#1D202A' });
        });

        // Host in corner observing
        kng(g, 1500, 720, {
          s: 0.95,
          E: expr('worried'),
          talk: talkAt(T),
          arms: ak(T, [[15.1, { at: [1420, 700], gest: 'point' }]])
        }, T);

        drawStampSlam(g, 'MẮC KẸT 3 NĂM', 1120, 520, seg(lt, 4, 4.8), { px: 48, rot: -0.18 });
      },
      ev: () => [
        [15.1, 'amb', { kind: 'room', t1: 31.5 }],
        [17.0, 'foley', { kind: 'paper' }],
        [19.8, 'foley', { kind: 'stamp' }]
      ]
    },

    // 3 (31.50s - 40.62s) · Bảng sơ đồ điều tra Mind Lab
    {
      n: 's3_board', t: 31.50,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'dossier');
        drawDossierHeader(g, 'BẢNG SƠ ĐỒ ĐIỀU TRA: BẪY CHI PHÍ CHÌM', 'MIND LAB #01');

        // Pins and red yarn connecting
        const pA = [460, 440], pB = [960, 380], pC = [1440, 520];
        g.strokeStyle = '#F0525B'; g.lineWidth = 4;
        g.beginPath(); g.moveTo(pA[0], pA[1]); g.lineTo(pB[0], pB[1]); g.lineTo(pC[0], pC[1]); g.stroke();

        drawEvidenceTag(g, pA[0], pA[1], 'TIỀN ĐÃ MẤT', 'KHÔNG THỂ THU HỒI', { w: 260, h: 120 });
        drawEvidenceTag(g, pB[0], pB[1], 'CÔNG SỨC ĐÃ ĐỔ', '3 NĂM TUỔI TRẺ', { w: 260, h: 120 });
        drawEvidenceTag(g, pC[0], pC[1], 'BẢN NGÃ CỐ CHẤP', 'SỢ BỊ COI LÀ THẤT BẠI', { w: 280, h: 130 });

        kng(g, 960, 840, {
          s: 0.9,
          E: expr('explain'),
          talk: talkAt(T)
        }, T);
      },
      ev: () => [
        [31.5, 'foley', { kind: 'whoosh' }],
        [35.0, 'foley', { kind: 'marker' }]
      ]
    },

    // 4 (40.62s - 60.57s) · Thí nghiệm vé kịch 100$ (Arkes & Blumer 1985)
    {
      n: 's4_theater_test', t: 40.62,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'dossier');
        drawDossierHeader(g, 'THÍ NGHIỆM VÉ KỊCH (ARKES & BLUMER, 1985)', 'DOI:10.1016/0749-5978(85)90049-4');

        // Ticket 1: 100$
        panel(g, { x: 550, y: 520, w: 420, h: 320, rot: -0.04, pin: true }, (gg, pw, ph) => {
          gg.fillStyle = '#FFF8EB'; gg.fillRect(-pw/2, -ph/2, pw, ph);
          text(gg, 'TẤM VÉ SỐ 01', -pw/2 + 40, -ph/2 + 50, { font: font(800, 22), fill: '#6B7280' });
          text(gg, '100 ĐÔ LA', -pw/2 + 40, -ph/2 + 130, { font: font(900, 64), fill: '#F0525B' });
          text(gg, 'Chuyến trượt tuyết Michigan', -pw/2 + 40, -ph/2 + 190, { font: font(700, 20), fill: '#1D202A' });
          text(gg, 'Bão tuyết dữ dội ngoài trời', -pw/2 + 40, -ph/2 + 230, { font: font(700, 18), fill: '#D97706' });
        });
        drawStampSlam(g, 'VẪN LÁI XE ĐI!', 550, 520, seg(lt, 3, 3.8), { px: 42, rot: -0.15 });

        // Ticket 2: 50$
        panel(g, { x: 1080, y: 540, w: 420, h: 320, rot: 0.03, tape: true }, (gg, pw, ph) => {
          gg.fillStyle = '#F4ECDD'; gg.fillRect(-pw/2, -ph/2, pw, ph);
          text(gg, 'TẤM VÉ SỐ 02', -pw/2 + 40, -ph/2 + 50, { font: font(800, 22), fill: '#6B7280' });
          text(gg, '50 ĐÔ LA', -pw/2 + 40, -ph/2 + 130, { font: font(900, 64), fill: '#3B82F6' });
          text(gg, 'Thích chuyến này hơn nhiều', -pw/2 + 40, -ph/2 + 190, { font: font(700, 20), fill: '#1D202A' });
          text(gg, 'Nhưng vẫn chọn vé 100$', -pw/2 + 40, -ph/2 + 230, { font: font(700, 18), fill: '#DC2626' });
        });

        kng(g, 1620, 720, {
          s: 0.92,
          E: ek(T, [[40.6, 'explain'], [50, 'shocked']]),
          talk: talkAt(T)
        }, T);
      },
      ev: () => [
        [40.6, 'music', { cue: 'B' }],
        [44.0, 'foley', { kind: 'stamp' }],
        [52.0, 'foley', { kind: 'paper' }]
      ]
    },

    // 5 (60.57s - 77.86s) · Thảm họa kiêu hãnh: Dự án Concorde
    {
      n: 's5_concorde', t: 60.57,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'swiss');
        // Technical header
        text(g, 'CASE STUDY: HIỆU ỨNG CONCORDE (1969)', 120, 140, { font: font(900, 36), fill: '#67E8F9' });
        text(g, 'BỘT TIỀN VÀO HỐ SÂU PHI KINH TẾ', 120, 190, { font: font(700, 24), fill: '#94A3B8' });

        // Concorde supersonic silhouette
        g.save();
        g.translate(580, 520);
        g.fillStyle = '#E2E8F0'; g.strokeStyle = '#67E8F9'; g.lineWidth = 4;
        const pts = [[-240, 0], [180, -90], [280, 0], [180, 90]];
        cel(g, poly(pts), { f: '#1E293B', s: '#0F172A', l: '#67E8F9', lw: 3 });
        g.restore();

        // The money funnel
        g.save();
        g.translate(1250, 500);
        const funnel = [[-180, -120], [180, -120], [50, 120], [-50, 120]];
        cel(g, poly(funnel), { f: '#334155', l: '#F0525B', lw: 4 });
        text(g, 'HÀNG TỶ BẢNG ANH', 0, -40, { font: font(900, 26), fill: '#FAF8F5', align: 'center', noreg: true });
        text(g, 'ĐỔ VÀO HỐ ĐEN', 0, 40, { font: font(800, 22), fill: '#F0525B', align: 'center', noreg: true });
        g.restore();

        drawStampSlam(g, 'TIẾC TIỀN NÊN MẤT TIỀN!', 1250, 680, seg(lt, 4, 4.8), { px: 46 });
      },
      ev: () => [
        [60.57, 'foley', { kind: 'whoosh' }],
        [68.0, 'foley', { kind: 'stamp' }]
      ]
    },

    // 6 (77.86s - 86.92s) · Cán cân bất đối xứng: Tiền quá khứ vs Thời gian
    {
      n: 's6_scale', t: 77.86,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'dossier');
        drawDossierHeader(g, 'CÁN CÂN BẤT ĐỐI XỨNG CỦA TÂM LÝ', 'TRỌNG LƯỢNG ẢO');

        // Central Balance Scale
        const cx = 960, cy = 520;
        line(g, [[cx, cy - 140], [cx, cy + 180]], '#475569', 10); // pillar
        cel(g, rrect(cx - 100, cy + 180, 200, 30, 8), { f: '#1E293B', l: '#0F172A', lw: 3 });

        // Tilted beam (tilted down to the left)
        const tilt = 0.16;
        g.save(); g.translate(cx, cy - 120); g.rotate(tilt);
        line(g, [[-300, 0], [300, 0]], '#E2E8F0', 8);

        // Left Pan (Heavy past)
        drawEvidenceTag(g, -300, 180, 'TIỀN ĐÃ MẤT', 'QUÁ KHỨ CỐ ĐỊNH', { w: 240, h: 110, pin: false });
        // Right Pan (Lifted future)
        drawEvidenceTag(g, 300, 80, 'THỜI GIAN SỐNG', 'TƯƠNG LAI BỊ ĐÈ', { w: 240, h: 110, pin: false });
        g.restore();

        kng(g, 1580, 750, { s: 0.92, E: expr('worried'), talk: talkAt(T) }, T);
      },
      ev: () => [
        [77.86, 'foley', { kind: 'marker' }]
      ]
    },

    // 7 (86.92s - 101.83s) · Chiếc gương bản ngã Kẻ Thất Bại
    {
      n: 's7_mirror', t: 86.92,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'dossier');
        drawDossierHeader(g, 'CHIẾC GƯƠNG BẢN NGÃ & NỖI SỢ PHÁN XÉT', 'TÂM LÝ HỌC HIỆN SINH');

        // Ornate mirror
        const mx = 800, my = 540;
        cel(g, rrect(mx - 220, my - 260, 440, 520, 28), { f: '#1E2333', s: '#0C0D14', l: '#FFB703', lw: 8 });
        // Reflection inside mirror
        g.save(); g.beginPath(); g.roundRect(mx - 200, my - 240, 400, 480, 20); g.clip();
        kng(g, mx, my + 160, { s: 0.95, E: expr('tired'), talk: talkAt(T), shrug: 0.2 }, T);
        g.restore();

        // Stamped across mirror
        drawStampSlam(g, 'KẺ THẤT BẠI?', mx, my, seg(lt, 3, 3.8), { color: '#F0525B', px: 56, rot: -0.12 });

        kng(g, 1450, 720, { s: 1.0, E: expr('explain'), talk: talkAt(T) }, T);
      },
      ev: () => [
        [86.92, 'music', { cue: 'C' }],
        [90.0, 'foley', { kind: 'stamp' }]
      ]
    },

    // 8 (101.83s - 122.12s) · Hạch hạnh nhân 2.5x (Loss Aversion)
    {
      n: 's8_amygdala', t: 101.83,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'swiss');
        text(g, 'KHOA HỌC THẦN KINH: HẠCH HẠNH NHÂN (AMYGDALA)', 100, 140, { font: font(900, 36), fill: '#67E8F9' });
        text(g, 'KAHNEMAN & TVERSKY (1979) — LOSS AVERSION', 100, 190, { font: font(700, 24), fill: '#94A3B8' });

        // Brain outline graphic
        const bx = 520, by = 540;
        g.save(); g.translate(bx, by);
        cel(g, ellP(0, 0, 220, 170), { f: '#1E293B', s: '#0F172A', l: '#67E8F9', lw: 4 });
        // Amygdala pulsing red core
        const pulse = 1 + 0.15 * Math.sin(T * 8);
        const redGlow = g.createRadialGradient(20, 30, 10, 20, 30, 90 * pulse);
        redGlow.addColorStop(0, 'rgba(240, 82, 91, 0.9)');
        redGlow.addColorStop(1, 'rgba(240, 82, 91, 0)');
        g.fillStyle = redGlow; g.beginPath(); g.arc(20, 30, 90 * pulse, 0, TAU); g.fill();
        cel(g, ellP(20, 30, 24 * pulse, 18 * pulse), { f: '#F0525B', l: '#FFFFFF', lw: 2 });
        text(g, 'HẠCH HẠNH NHÂN', 20, 80, { font: font(800, 18), fill: '#FAF8F5', align: 'center', noreg: true });
        g.restore();

        // Swiss Metric gauge
        drawSwissMetric(g, 1020, 480, '2.5x', 'LẦN', 'NỖI ĐAU MẤT MÁT LỚN HƠN NIỀM VUI', seg(lt, 2, 4));
      },
      ev: () => [
        [101.83, 'foley', { kind: 'whoosh' }],
        [108.0, 'foley', { kind: 'marker' }]
      ]
    },

    // 9 (122.12s - 140.52s) · Rối tự bào chữa
    {
      n: 's9_roi_cloud', t: 122.12,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'midcentury');
        drawSunburst(g, 960, 540, T * 0.03, { rays: 24, col1: '#1C2233', col2: '#121622' });

        // Kẻ Nghĩ Nhiều troubled
        kng(g, 720, 720, {
          s: 1.05,
          E: expr('worried'),
          talk: talkAt(T),
          shrug: 0.2
        }, T);

        // Giant purple cloud Rối puffing
        const rx = 1200, ry = 480;
        roi(g, rx, ry, 1.8 + Math.sin(T * 3) * 0.15, { t: T, alert: true });

        // Rationalization bubbles
        bubble(g, rx - 180, ry - 140, 320, 80, (gg) => {
          text(gg, '"Cố thêm 1 tháng nữa thôi..."', 0, 8, { font: font(800, 20), fill: '#12131A', align: 'center', noreg: true });
        });
        bubble(g, rx + 120, ry + 120, 300, 76, (gg) => {
          text(gg, '"Biết đâu ngày mai sẽ khác!"', 0, 8, { font: font(800, 20), fill: '#12131A', align: 'center', noreg: true });
        });
      },
      ev: () => [
        [122.12, 'foley', { kind: 'boing' }],
        [128.0, 'foley', { kind: 'paper' }]
      ]
    },

    // 10 (140.52s - 152.33s) · Đồng hồ cát thời gian
    {
      n: 's10_hourglass', t: 140.52,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'mindlab');
        ambientMotes(g, T, 40);

        // Giant luminous Hourglass
        const hx = 960, hy = 500;
        g.save(); g.translate(hx, hy);
        // Glass bulbs
        cel(g, poly([[-120, -180], [120, -180], [15, 0], [-15, 0]]), { f: 'rgba(103, 232, 249, 0.15)', l: '#67E8F9', lw: 5 });
        cel(g, poly([[-15, 0], [15, 0], [120, 180], [-120, 180]]), { f: 'rgba(103, 232, 249, 0.15)', l: '#67E8F9', lw: 5 });
        // Falling golden sand particles
        g.fillStyle = '#FFB703';
        for (let i = 0; i < 28; i++) {
          const sy = ((T * 120 + i * 16) % 180);
          g.beginPath(); g.arc((Math.sin(i * 12) * 8), sy, 3, 0, TAU); g.fill();
        }
        g.restore();

        text(g, 'THỜI GIAN LÀ MỘT CHIỀU', 960, 220, { font: font(900, 48), fill: '#FAF8F5', align: 'center' });
        text(g, 'BẠN ĐANG DÙNG TƯƠNG LAI ĐỂ TRẢ GIÁ CHO QUÁ KHỨ', 960, 760, { font: font(800, 32), fill: '#FFB703', align: 'center' });
      },
      ev: () => [
        [140.52, 'music', { cue: 'D' }],
        [144.0, 'foley', { kind: 'marker' }]
      ]
    },

    // 11 (152.33s - 167.06s) · Căn phòng song song (Chi phí cơ hội)
    {
      n: 's11_parallel_room', t: 152.33,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'swiss');

        // Split Screen Line
        line(g, [[W/2, 0], [W/2, H]], '#67E8F9', 4);

        // Left: Depleted reality
        g.fillStyle = '#12141C'; g.fillRect(0, 0, W/2, H);
        text(g, 'HIỆN TẠI: KIỆT QUỆ & MẮC KẸT', W/4, 200, { font: font(900, 28), fill: '#94A3B8', align: 'center' });
        kng(g, W/4, 680, { s: 0.95, E: expr('tired'), talk: talkAt(T) }, T);

        // Right: Stolen potential
        g.fillStyle = '#1E2538'; g.fillRect(W/2, 0, W/2, H);
        text(g, 'TIỀM NĂNG BỊ ĐÁNH CẮP', W * 3/4, 200, { font: font(900, 28), fill: '#FFB703', align: 'center' });
        drawSparkle(g, W * 3/4, 460, 40, '#FFB703', T);
        text(g, 'CƠ HỘI MỚI · TỰ DO · PHÁT TRIỂN', W * 3/4, 620, { font: font(800, 30), fill: '#FAF8F5', align: 'center' });

        drawStampSlam(g, 'CHI PHÍ CƠ HỘI!', 960, 480, seg(lt, 3, 3.8), { px: 46 });
      },
      ev: () => [
        [152.33, 'foley', { kind: 'whoosh' }],
        [158.0, 'foley', { kind: 'stamp' }]
      ]
    },

    // 12 (167.06s - 177.54s) · Dấu mộc CÀNG CỐ GỒNG, CÀNG CHẾT CHÌM
    {
      n: 's12_swamp_stamp', t: 167.06,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'dossier');
        // Quicksand dark pit
        cel(g, ellP(960, 680, 500, 160), { f: '#0A0C12', l: '#F0525B', lw: 4 });
        drawSuitcase(g, 960, 650, 0, 4);

        // Giant dramatic stamp slam
        drawStampSlam(g, 'CÀNG CỐ GỒNG, CÀNG CHẾT CHÌM!', 960, 420, seg(lt, 1.2, 2.0), { color: '#F0525B', px: 54 });
      },
      ev: () => [
        [167.06, 'foley', { kind: 'whoosh' }],
        [168.3, 'foley', { kind: 'stamp' }]
      ]
    },

    // 13 (177.54s - 198.49s) · Tư duy từ điểm 0 (Zero-Based Thinking)
    {
      n: 's13_zero_based', t: 177.54,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'midcentury');
        drawSunburst(g, 960, 520, T * 0.04, { col1: '#1E293B', col2: '#131926', rays: 20 });

        // Giant Card in center
        panel(g, { x: 960, y: 520, w: 820, h: 480, rot: 0.01, pin: true }, (gg, pw, ph) => {
          gg.fillStyle = '#FFFDF5'; gg.fillRect(-pw/2, -ph/2, pw, ph);
          text(gg, 'TƯ DUY TỪ ĐIỂM 0 (ZERO-BASED THINKING)', 0, -ph/2 + 60, { font: font(900, 32), fill: '#1E293B', align: 'center' });
          text(gg, '0', 0, 30, { font: font(900, 150), fill: '#F59E0B', stroke: '#1E293B', sw: 12, align: 'center' });
          drawSparkle(gg, -120, -20, 25, '#F59E0B', T);
          drawSparkle(gg, 120, 40, 20, '#F59E0B', -T);
          text(gg, '"Nếu hôm nay bắt đầu lại từ đầu..."', 0, ph/2 - 80, { font: font(800, 26), fill: '#1E293B', align: 'center' });
          text(gg, '"...bạn có tiếp tục chọn nó không?"', 0, ph/2 - 40, { font: font(800, 26), fill: '#EF4444', align: 'center' });
        });

        kng(g, 260, 740, { s: 1.0, E: expr('smile'), talk: talkAt(T) }, T);
      },
      ev: () => [
        [177.54, 'music', { cue: 'E' }],
        [180.0, 'foley', { kind: 'ting' }]
      ]
    },

    // 14 (198.49s - 224.02s) · Bài kiểm tra Andy Grove 1985
    {
      n: 's14_andy_grove', t: 198.49,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'dossier');
        drawDossierHeader(g, 'BÀI KIỂM TRA NGƯỜI NGOÀI CUỘC (ANDY GROVE, 1985)', 'INTEL HISTORICAL MEMO');

        panel(g, { x: 740, y: 540, w: 780, h: 420, rot: -0.02, tape: true }, (gg, pw, ph) => {
          gg.fillStyle = '#F4ECDD'; gg.fillRect(-pw/2, -ph/2, pw, ph);
          text(gg, 'ANDY GROVE HỎI GORDON MOORE:', -pw/2 + 50, -ph/2 + 60, { font: font(900, 24), fill: '#64748B' });
          text(gg, '"Nếu ban quản trị sa thải chúng ta..."', -pw/2 + 50, -ph/2 + 140, { font: font(800, 32), fill: '#1E293B' });
          text(gg, '"...và thuê một CEO mới toanh..."', -pw/2 + 50, -ph/2 + 200, { font: font(800, 32), fill: '#1E293B' });
          text(gg, '"...anh nghĩ người đó sẽ làm gì?"', -pw/2 + 50, -ph/2 + 260, { font: font(900, 36), fill: '#EF4444' });
          text(gg, '-> "Họ sẽ từ bỏ mảng bộ nhớ ngay lập tức."', -pw/2 + 50, -ph/2 + 340, { font: font(800, 26), fill: '#059669' });
        });

        // Host stepping back observing with clarity
        kng(g, 1500, 720, {
          s: 1.05,
          E: expr('smile'),
          talk: talkAt(T),
          headTilt: -0.06
        }, T);
      },
      ev: () => [
        [198.49, 'foley', { kind: 'paper' }],
        [205.0, 'foley', { kind: 'marker' }]
      ]
    },

    // 15 (224.02s - 240.52s) · Cắt xích mỏ neo & Chìa khóa
    {
      n: 's15_cut_chain', t: 224.02,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'midcentury');
        drawSunburst(g, 960, 540, T * 0.05, { col1: '#1E293B', col2: '#0F172A', rays: 28 });

        // Broken chain graphic in center
        const cx = 960, cy = 480;
        g.strokeStyle = '#94A3B8'; g.lineWidth = 10;
        // Left broken half
        line(g, [[cx - 280, cy], [cx - 60, cy - 30]], '#94A3B8', 10);
        // Right broken half
        line(g, [[cx + 60, cy + 30], [cx + 280, cy]], '#94A3B8', 10);

        // Glowing Golden Key
        g.save(); g.translate(cx, cy);
        cel(g, ellP(0, -50, 45, 45), { f: '#F59E0B', l: '#FFFFFF', lw: 4 });
        cel(g, rect(-12, -20, 12, 90), { f: '#F59E0B', l: '#FFFFFF', lw: 4 });
        cel(g, rect(12, 30, 45, 50), { f: '#F59E0B', l: '#FFFFFF', lw: 3 });
        drawSparkle(g, 60, -40, 30, '#F59E0B', T);
        g.restore();

        // Kẻ Nghĩ Nhiều lamp lighting up!
        kng(g, 420, 720, {
          s: 1.1,
          E: expr('happy'),
          talk: talkAt(T),
          lightOn: true
        }, T);

        drawStampSlam(g, 'GIẢI PHÓNG!', 960, 680, seg(lt, 2, 2.8), { color: '#10B981', px: 60 });
      },
      ev: () => [
        [224.02, 'foley', { kind: 'whoosh' }],
        [226.0, 'foley', { kind: 'ting' }],
        [228.0, 'foley', { kind: 'stamp' }]
      ]
    },

    // 16 (240.52s - 255.99s) · Giao thức Cắt lỗ 30 ngày
    {
      n: 's16_stop_loss', t: 240.52,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'dossier');
        drawDossierHeader(g, 'GIAO THỨC HÀNH ĐỘNG: CẮT LỖ CẢM XÚC (STOP-LOSS)', 'QUY TẮC 30 NGÀY');

        panel(g, { x: 780, y: 550, w: 760, h: 420, rot: -0.01, pin: true }, (gg, pw, ph) => {
          gg.fillStyle = '#FFFDF5'; gg.fillRect(-pw/2, -ph/2, pw, ph);
          text(gg, 'CAM KẾT CÁ NHÂN VỚI CHÍNH MÌNH', -pw/2 + 50, -ph/2 + 60, { font: font(900, 26), fill: '#1E293B' });
          text(gg, '1. Đặt hạn chót dứt khoát: Đúng 30 ngày.', -pw/2 + 50, -ph/2 + 130, { font: font(800, 24), fill: '#1E293B' });
          text(gg, '2. Nếu sau 30 ngày vẫn bế tắc và hao mòn:', -pw/2 + 50, -ph/2 + 180, { font: font(800, 24), fill: '#1E293B' });
          text(gg, '   -> CẮT LỖ VÀ BƯỚC ĐI KHÔNG HỐI TIẾC.', -pw/2 + 50, -ph/2 + 230, { font: font(900, 26), fill: '#EF4444' });
          text(gg, '3. Giữ lại bài học, vứt bỏ chiếc vali gạch đá.', -pw/2 + 50, -ph/2 + 300, { font: font(800, 24), fill: '#059669' });
        });

        drawStampSlam(g, 'ĐÃ CẮT LỖ CẢM XÚC', 780, 580, seg(lt, 3, 3.8), { color: '#059669', px: 46 });

        kng(g, 1500, 720, { s: 1.0, E: expr('smile'), talk: talkAt(T) }, T);
      },
      ev: () => [
        [240.52, 'foley', { kind: 'paper' }],
        [246.0, 'foley', { kind: 'stamp' }]
      ]
    },

    // 17 (255.99s - 265.88s) · Bình minh ban công
    {
      n: 's17_sunrise', t: 255.99,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'midcentury');
        // Gentle morning gradient
        const dawnGr = g.createLinearGradient(0, 0, 0, H);
        dawnGr.addColorStop(0, '#0F172A');
        dawnGr.addColorStop(0.6, '#334155');
        dawnGr.addColorStop(1, '#D97706');
        g.fillStyle = dawnGr; g.fillRect(0, 0, W, H);

        // Balcony railing
        g.strokeStyle = '#1E293B'; g.lineWidth = 8;
        line(g, [[0, 820], [W, 820]], '#1E293B', 8);
        for (let x = 100; x < W; x += 160) line(g, [[x, 820], [x, 1080]], '#1E293B', 6);

        // Host peacefully holding tea mug
        kng(g, 960, 680, {
          s: 1.15,
          E: expr('smile'),
          talk: talkAt(T)
        }, T);

        // Small Rối resting on his shoulder peacefully
        roi(g, 840, 560, 0.55, { t: T, alert: false });

        text(g, 'NGÀY MAI LUÔN BẮT ĐẦU TỪ CON SỐ 0', 960, 280, {
          font: font(900, 48),
          fill: '#FEF3C7',
          stroke: '#0F172A',
          sw: 10,
          align: 'center'
        });
      },
      ev: () => [
        [255.99, 'music', { cue: 'F' }],
        [255.99, 'amb', { kind: 'dawn', t1: 277.95 }]
      ]
    },

    // 18 (265.88s - 277.95s) · Thẻ kết & Lời tạm biệt
    {
      n: 's18_endcard', t: 265.88,
      f(g, lt, T) {
        setupSceneStyle(g, T, 'mindlab');
        ambientMotes(g, T, 30);

        // Center endcard panel
        panel(g, { x: 960, y: 520, w: 860, h: 520, pin: true }, (gg, pw, ph) => {
          gg.fillStyle = '#181C28'; gg.fillRect(-pw/2, -ph/2, pw, ph);
          // Battery full indicator
          battery(gg, -60, -ph/2 + 60, 1.0);
          text(gg, 'PIN: 100% (ĐÃ NẠP LẠI NĂNG LƯỢNG)', 20, -ph/2 + 70, { font: font(800, 22), fill: '#10B981', noreg: true });

          text(gg, 'TRẠM NGHĨ NHIỀU', 0, -ph/2 + 150, { font: font(900, 52), fill: '#FFB703', align: 'center' });
          text(gg, 'Hôm nay, bạn sẽ can đảm buông tay chiếc vali nào?', 0, -ph/2 + 230, { font: font(700, 30), fill: '#FAF8F5', align: 'center' });
          text(gg, 'Để lại bình luận và đăng ký kênh để cùng giải mã tâm lý mỗi tuần.', 0, -ph/2 + 290, { font: font(700, 22), fill: '#94A3B8', align: 'center' });

          // Next episode tease
          cel(gg, rrect(-260, 80, 520, 60, 12), { f: '#0F172A', l: '#FFB703', lw: 2 });
          text(gg, 'TẬP TIẾP THEO: NGHỊCH LÝ LỰA CHỌN', 0, 118, { font: font(800, 20), fill: '#FFB703', align: 'center', noreg: true });
        });
      },
      ev: () => [
        [270.0, 'music', { cue: 'end' }]
      ]
    }
  ];
}

// Global render loop
window.render = function(T) {
  if (!TL) return;
  G.save();
  G.setTransform(1, 0, 0, 1, 0, 0);
  G.clearRect(0, 0, W, H);

  // Active shot
  let curShot = SHOTS[0];
  for (let i = SHOTS.length - 1; i >= 0; i--) {
    if (T >= SHOTS[i].t) { curShot = SHOTS[i]; break; }
  }

  const lt = T - curShot.t;
  curShot.f(G, lt, T);

  // Subtitle cue
  if (TL.cues) {
    const activeCue = TL.cues.findLast(c => T >= c.t0 && T < c.t1);
    if (activeCue) subtitle(G, activeCue.text);
  }

  // Fade in / out
  const fo = Math.max(1 - T / 0.35, seg(T, TL.end - 0.7, TL.end));
  if (fo > 0) {
    G.fillStyle = `rgba(18, 19, 26, ${fo})`;
    G.fillRect(0, 0, W, H);
  }

  // Universal tactile texture layers (Halftone Dossier + Midcentury paper)
  applyPaperTexture(G, 0.20, true);
  renderGrainFx(G, T, 220);

  G.restore();
};

window.TEXTS = T => {
  REG.list = [];
  window.render(T);
  const l = REG.list;
  REG.list = null;
  return l || [];
};

async function setup() {
  const j = p => fetch(p).then(r => r.ok ? r.json() : {});
  const [dur, words, lips] = await Promise.all([
    j('voice/proc/dur.json'),
    j('voice/words.json'),
    j('voice/lips.json')
  ]);
  TL = build(dur, words, lips);
  window.DUR = +TL.end.toFixed(2);
  SHOTS = shots();

  // Populate events
  EV = [];
  for (const sh of SHOTS) {
    for (const [t, type, x] of (sh.ev ? sh.ev() : [])) {
      EV.push({ t: +t.toFixed(3), type, shot: sh.n, ...(x || {}) });
    }
  }
  for (const id in TL.L) {
    EV.push({ t: +TL.L[id].t0.toFixed(3), type: 'voice', file: `voice/proc/${id}.wav`, id });
  }
  EV.sort((a, b) => a.t - b.t);
  window.EV = EV;
  window.CUES = TL.cues;
  window.SHOTS = SHOTS.map(s => ({ n: s.n, t: s.t }));

  await Promise.all([
    '900 40px "Be Vietnam Pro"',
    '800 40px "Be Vietnam Pro"',
    '700 40px "Be Vietnam Pro"',
    '400 40px "Patrick Hand"'
  ].map(f => document.fonts.load(f, 'ẠẾỘữ0123456789')));

  window.render(0);
  window.READY = true;
}
setup();
