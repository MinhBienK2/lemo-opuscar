// Multi-Style Scene Engine for "Trạm Nghĩ Nhiều"
// Integrates proven techniques adapted from Lemo-Opuscar library styles:
// - Halftone Dossier (paper mottling, Ben-Day halftone shading, case files, tactile stamps)
// - Mid-century Toon (50s retro sunburst, UPA geometric accents, squash-and-stretch pops)
// - Swiss Motion & Dark Keynote (strict modular grid, massive typographic scale, precision rulers)
// - Late-Night Mind Lab (signature volumetric desk lamp, ambient floating motes, warm glow)

import { W, H, TAU, canvas, rect, rrect, line, poly, ellP, rgba } from './cel.js';
import { PAL } from './character.js';
import { text, font, clamp01, seg, ease, sharpText, INK, CREAM } from './broll.js';
import { spring, squash, wiggle } from './motion.js';

// ——————————————————————————————————————————————————————————————————————————
// 1. PAPER TEXTURE & GRAIN LAYER (Adapted from styles/halftone-dossier & midcentury-toon)
// ——————————————————————————————————————————————————————————————————————————
let PAPER_CANVAS = null;

function getPaperCanvas() {
  if (PAPER_CANVAS) return PAPER_CANVAS;
  const [cv, ctx] = canvas(W, H);

  // 1. Base subtle mottling
  const smallW = 96, smallH = 54;
  const [scv, sctx] = canvas(smallW, smallH);
  const sim = sctx.createImageData(smallW, smallH);
  let seed = 42;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < sim.data.length; i += 4) {
    const v = 240 + Math.floor(rnd() * 15);
    sim.data[i] = v;
    sim.data[i + 1] = v - 2;
    sim.data[i + 2] = v - 6;
    sim.data[i + 3] = 255;
  }
  sctx.putImageData(sim, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(scv, 0, 0, W, H);

  // 2. High-frequency paper noise
  const base = ctx.getImageData(0, 0, W, H);
  for (let i = 0; i < base.data.length; i += 4) {
    const n = (rnd() - 0.5) * 18;
    base.data[i] = Math.max(0, Math.min(255, base.data[i] + n));
    base.data[i + 1] = Math.max(0, Math.min(255, base.data[i + 1] + n));
    base.data[i + 2] = Math.max(0, Math.min(255, base.data[i + 2] + n - 2));
  }
  ctx.putImageData(base, 0, 0);

  // 3. Vignette
  const gr = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.95);
  gr.addColorStop(0, 'rgba(255,255,255,0)');
  gr.addColorStop(1, 'rgba(60,50,40,0.28)');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, W, H);

  // 4. Subtle center fold crease
  ctx.strokeStyle = 'rgba(100,80,60,0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2 + 1, H);
  ctx.stroke();

  PAPER_CANVAS = cv;
  return cv;
}

/**
 * Apply paper texture and film grain to the current canvas context.
 * Call this at the end of window.render() to instantly give the entire film
 * an authentic physical print feel.
 */
export function applyPaperTexture(g, opacity = 0.22, darkBlend = true) {
  const paper = getPaperCanvas();
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (darkBlend) {
    g.globalCompositeOperation = 'screen';
    g.globalAlpha = opacity * 0.35;
    g.drawImage(paper, 0, 0);
    g.globalCompositeOperation = 'overlay';
    g.globalAlpha = opacity;
    g.drawImage(paper, 0, 0);
  } else {
    g.globalCompositeOperation = 'multiply';
    g.globalAlpha = opacity;
    g.drawImage(paper, 0, 0);
  }
  g.restore();
}

/**
 * Render dynamic dust specks and ink specks that re-seed every 2 frames.
 */
export function renderGrainFx(g, t, count = 280) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const frame = Math.floor(t * 12); // twos
  let s = (frame * 1234567) ^ 0x9e3779b9;
  const rnd = () => {
    s = Math.imul(s ^ (s >>> 15), 1 | s);
    s = s + Math.imul(s ^ (s >>> 7), 61 | s) ^ s;
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };

  g.fillStyle = 'rgba(255, 248, 235, 0.45)';
  for (let i = 0; i < count; i++) {
    const x = rnd() * W, y = rnd() * H, r = 0.5 + rnd() * 1.5;
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.fill();
  }
  g.fillStyle = 'rgba(18, 19, 26, 0.3)';
  for (let i = 0; i < Math.floor(count * 0.2); i++) {
    const x = rnd() * W, y = rnd() * H, r = 0.5 + rnd() * 1.2;
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.fill();
  }
  g.restore();
}

// ——————————————————————————————————————————————————————————————————————————
// 2. HALFTONE BEN-DAY SHADING (Adapted from styles/halftone-dossier)
// ——————————————————————————————————————————————————————————————————————————

/**
 * Render a rotated grid of Ben-Day halftone dots within a bounding box.
 * @param {CanvasRenderingContext2D} g - Context
 * @param {object} o - Options
 */
export function drawHalftoneField(g, o = {}) {
  const {
    cx = W / 2, cy = H / 2, w = 800, h = 600,
    step = 22, color = '#FFB703',
    angle = 0.26, // ~15 degrees
    densityFn = (x, y) => 0.5,
    maxR = 8.5
  } = o;

  g.save();
  g.translate(cx, cy);
  g.rotate(angle);
  g.fillStyle = color;

  const halfW = w / 2 * 1.4, halfH = h / 2 * 1.4;
  g.beginPath();
  for (let y = -halfH; y <= halfH; y += step) {
    for (let x = -halfW; x <= halfW; x += step) {
      // transform back to local coordinate for density function
      const lx = x * Math.cos(-angle) - y * Math.sin(-angle);
      const ly = x * Math.sin(-angle) + y * Math.cos(-angle);
      const d = clamp01(densityFn(lx, ly));
      if (d > 0.05) {
        const r = d * maxR;
        g.moveTo(x + r, y);
        g.arc(x, y, r, 0, TAU);
      }
    }
  }
  g.fill();
  g.restore();
}

/**
 * Halftone dot wipe transition between scenes.
 */
export function drawHalftoneWipe(g, p, color = '#FFB703') {
  if (p <= 0 || p >= 1) return;
  g.save();
  g.fillStyle = color;
  const step = 64;
  g.beginPath();
  for (let y = 0; y <= H + step; y += step) {
    for (let x = 0; x <= W + step; x += step) {
      const delay = (x / W * 0.6 + y / H * 0.4) * 0.35;
      const u = clamp01((p - delay) / 0.65);
      const r = Math.sin(u * Math.PI) * (step * 0.78);
      if (r > 0.5) {
        g.moveTo(x + r, y);
        g.arc(x, y, r, 0, TAU);
      }
    }
  }
  g.fill();
  g.restore();
}

// ——————————————————————————————————————————————————————————————————————————
// 3. DOSSIER / EVIDENCE SCENE KIT (Adapted from styles/halftone-dossier)
// ——————————————————————————————————————————————————————————————————————————

/**
 * Render an authentic police/academic Case File Header banner.
 */
export function drawDossierHeader(g, title, caseNo = 'NO.2026-CHIPHI-CHIM', label = 'HỒ SƠ TÂM LÝ') {
  g.save();
  // Header tag pill
  const pillW = 280, pillH = 38;
  g.fillStyle = '#1D202A';
  g.beginPath();
  g.roundRect(80, 50, pillW, pillH, 8);
  g.fill();

  text(g, label, 96, 75, { font: font(800, 18), fill: '#FFB703', noreg: true });
  text(g, caseNo, 230, 75, { font: font(700, 16), fill: '#FAF8F5', noreg: true });

  // Main case file title
  if (title) {
    text(g, title, 80, 130, { font: font(900, 42), fill: '#FAF8F5', stroke: '#12131A', sw: 8 });
  }

  // Red accent index rule
  g.strokeStyle = '#F0525B';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(80, 146);
  g.lineTo(W - 80, 146);
  g.stroke();

  // Subtle tape mark in corner
  g.fillStyle = 'rgba(255, 203, 7, 0.28)';
  g.fillRect(W - 180, 40, 90, 28);
  g.strokeStyle = 'rgba(255, 203, 7, 0.5)';
  g.lineWidth = 1.5;
  g.strokeRect(W - 180, 40, 90, 28);

  g.restore();
}

/**
 * Heavy impact rubber stamp that slams onto the page with bounce and ink grain.
 */
export function drawStampSlam(g, str, x, y, p, o = {}) {
  if (p <= 0) return;
  const { color = '#F0525B', px = 64, rot = -0.14 } = o;

  // Impact bounce dynamics
  const scale = p < 1 ? 2.4 - 1.4 * ease.out(p) : 1 + 0.05 * Math.sin((p - 1) * 20) * Math.exp(-(p - 1) * 8);
  const alpha = Math.min(0.95, p * 1.5);

  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(scale, scale);
  g.globalAlpha = alpha;

  const m = document.createElement('canvas').getContext('2d');
  m.font = font(900, px);
  const tw = m.measureText(str).width;
  const padX = 40, padY = 20;
  const bw = tw + padX * 2, bh = px * 1.35 + padY * 2;

  // Double border
  g.strokeStyle = color;
  g.lineWidth = 9;
  g.beginPath();
  g.roundRect(-bw / 2, -bh / 2, bw, bh, 18);
  g.stroke();

  g.lineWidth = 3.5;
  g.beginPath();
  g.roundRect(-bw / 2 + 14, -bh / 2 + 14, bw - 28, bh - 28, 10);
  g.stroke();

  // Misregistered shadow
  text(g, str, 3, 3 + px * 0.35, {
    font: font(900, px),
    align: 'center',
    fill: 'rgba(29, 32, 42, 0.4)',
    noreg: true
  });

  // Main stamp text
  text(g, str, 0, px * 0.35, {
    font: font(900, px),
    align: 'center',
    fill: color
  });

  g.restore();
}

/**
 * An evidence tag pinned with red string.
 */
export function drawEvidenceTag(g, x, y, tagText, subText, o = {}) {
  const { w = 260, h = 140, rot = 0.05, pin = true } = o;
  g.save();
  g.translate(x, y);
  g.rotate(rot);

  // Soft shadow
  g.fillStyle = 'rgba(0, 0, 0, 0.4)';
  g.beginPath();
  g.roundRect(-w / 2 + 8, -h / 2 + 10, w, h, 14);
  g.fill();

  // Card body (Cream Kraft)
  g.fillStyle = '#F4ECDD';
  g.beginPath();
  g.roundRect(-w / 2, -h / 2, w, h, 14);
  g.fill();
  g.strokeStyle = '#1D202A';
  g.lineWidth = 4;
  g.stroke();

  // Clipped corner / eyelet hole
  g.fillStyle = '#12131A';
  g.beginPath();
  g.arc(0, -h / 2 + 20, 7, 0, TAU);
  g.fill();

  // Red string line
  if (pin) {
    g.strokeStyle = '#F0525B';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(0, -h / 2 + 20);
    g.lineTo(15, -h / 2 - 40);
    g.stroke();
    // Red pin head
    g.fillStyle = '#F0525B';
    g.beginPath();
    g.arc(15, -h / 2 - 40, 8, 0, TAU);
    g.fill();
  }

  // Tag texts
  text(g, tagText, 0, -h / 2 + 65, {
    font: font(900, 28),
    align: 'center',
    fill: '#1D202A'
  });

  if (subText) {
    text(g, subText, 0, -h / 2 + 105, {
      font: font(700, 20),
      align: 'center',
      fill: '#F0525B'
    });
  }

  g.restore();
}

// ——————————————————————————————————————————————————————————————————————————
// 4. MIDCENTURY TOON RETRO SCENE KIT (Adapted from styles/midcentury-toon)
// ——————————————————————————————————————————————————————————————————————————

/**
 * Render dynamic retro sunburst rays radiating from a center point.
 */
export function drawSunburst(g, cx, cy, rot = 0, o = {}) {
  const { rays = 20, r = 1400, col1 = '#1A2138', col2 = '#131724' } = o;
  g.save();
  g.translate(cx, cy);
  g.rotate(rot);

  const angleStep = TAU / rays;
  for (let i = 0; i < rays; i++) {
    g.fillStyle = i % 2 === 0 ? col1 : col2;
    g.beginPath();
    g.moveTo(0, 0);
    g.arc(0, 0, r, i * angleStep, (i + 1) * angleStep);
    g.closePath();
    g.fill();
  }
  g.restore();
}

/**
 * Mid-century atomic sparkle icon.
 */
export function drawSparkle(g, x, y, size = 30, color = '#FFB703', rot = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(0, -size);
  g.quadraticCurveTo(0, 0, size, 0);
  g.quadraticCurveTo(0, 0, 0, size);
  g.quadraticCurveTo(0, 0, -size, 0);
  g.quadraticCurveTo(0, 0, 0, -size);
  g.fill();
  g.restore();
}

// ——————————————————————————————————————————————————————————————————————————
// 5. SWISS MOTION PRECISION METRIC KIT (Adapted from styles/swiss-motion)
// ——————————————————————————————————————————————————————————————————————————

/**
 * High-contrast Swiss precision metric gauge / comparison layout.
 */
export function drawSwissMetric(g, x, y, numStr, unitStr, labelStr, p = 1, o = {}) {
  const { color = '#67E8F9', subColor = '#FAF8F5' } = o;
  g.save();
  g.translate(x, y);

  // Big bold numeral
  text(g, numStr, 0, 0, {
    font: font(900, 96),
    fill: color,
    stroke: '#12131A',
    sw: 10
  });

  const m = document.createElement('canvas').getContext('2d');
  m.font = font(900, 96);
  const nw = m.measureText(numStr).width;

  // Unit
  if (unitStr) {
    text(g, unitStr, nw + 12, -40, {
      font: font(800, 36),
      fill: '#FFB703'
    });
  }

  // Label underneath
  if (labelStr) {
    text(g, labelStr, 0, 48, {
      font: font(700, 26),
      fill: subColor
    });
  }

  // Progress ruler
  g.strokeStyle = '#2E3448';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(0, 68);
  g.lineTo(360, 68);
  g.stroke();

  g.strokeStyle = color;
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(0, 68);
  g.lineTo(360 * clamp01(p), 68);
  g.stroke();

  g.restore();
}

// ——————————————————————————————————————————————————————————————————————————
// 6. SCENE DIRECTOR DISPATCHER
// ——————————————————————————————————————————————————————————————————————————

/**
 * Universal Director helper: applies background & atmospheric styling for a scene block.
 * @param {CanvasRenderingContext2D} g - Context
 * @param {number} t - Current time
 * @param {'dossier'|'midcentury'|'swiss'|'mindlab'} style - Target scene style
 * @param {object} o - Style-specific options
 */
export function setupSceneStyle(g, t, style = 'mindlab', o = {}) {
  switch (style) {
    case 'dossier':
      // Halftone Dossier: Archive warm/dark paper, halftone bloom, case header
      g.fillStyle = o.dark ? '#18203F' : '#141824';
      g.fillRect(0, 0, W, H);
      drawHalftoneField(g, {
        cx: W * 0.85, cy: H * 0.4, w: 900, h: 700,
        color: 'rgba(255, 183, 3, 0.12)',
        densityFn: (x, y) => Math.max(0, 1 - Math.hypot(x, y) / 450)
      });
      break;

    case 'midcentury':
      // 50s Retro Toon: Sunburst rays, warm vibrant energy
      drawSunburst(g, W / 2, H * 0.55, t * 0.05, {
        col1: '#1E2638', col2: '#141A28', rays: 24
      });
      break;

    case 'swiss':
      // Swiss Motion: Grid, stark contrast, clean layout
      g.fillStyle = '#0F1117';
      g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      g.lineWidth = 1;
      for (let x = 96; x < W; x += 144) {
        line(g, [[x, 0], [x, H]], 'rgba(255,255,255,0.06)', 1);
      }
      for (let y = 64; y < H; y += 120) {
        line(g, [[0, y], [W, y]], 'rgba(255,255,255,0.06)', 1);
      }
      break;

    case 'mindlab':
    default:
      // Signature Trạm Nghĩ Nhiều late-night desk with volumetric light
      g.fillStyle = '#12131A';
      g.fillRect(0, 0, W, H);
      // Soft radial lamp glow
      const lampX = o.lampX ?? 450, lampY = o.lampY ?? 540;
      const grd = g.createRadialGradient(lampX, lampY, 50, lampX, lampY, 750);
      grd.addColorStop(0, 'rgba(255, 200, 100, 0.14)');
      grd.addColorStop(0.5, 'rgba(255, 183, 3, 0.05)');
      grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
      g.fillStyle = grd;
      g.fillRect(0, 0, W, H);
      break;
  }
}
