// Motion graphics and physics kit for Trạm Nghĩ Nhiều and Lemo-Opuscar 2D films.
// Provides spring dynamics, squash & stretch, lightweight particle bursts, word-level triggers,
// dynamic camera parallax, and seamless transition helpers.
import { W, H, TAU } from './cel.js';
import { clamp01, seg } from './broll.js';

// ——— 1. Physics Solvers & Easing ———

/**
 * Analytical Damped Harmonic Oscillator (Spring)
 * Perfectly natural bounce from 0 to 1 as t progresses from 0.
 * @param {number} t - Progress time in seconds since start
 * @param {number} duration - Total settle duration (typically 0.4 - 0.8s)
 * @param {number} bounces - Number of oscillation peaks (default ~2.5)
 * @param {number} decay - Damping rate (higher = stops faster)
 */
export function spring(t, duration = 0.6, bounces = 2.5, decay = 5.0) {
  if (t <= 0) return 0;
  if (t >= duration) return 1;
  const p = t / duration;
  const omega = bounces * TAU;
  const envelope = Math.exp(-decay * p);
  return 1 - envelope * Math.cos(omega * p);
}

/**
 * Elastic overshoot helper for quick pop-ins
 */
export function elasticOut(t) {
  const p = clamp01(t);
  if (p === 0 || p === 1) return p;
  return Math.pow(2, -10 * p) * Math.sin((p - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

/**
 * Anticipation: Pulls slightly backward before bursting forward
 */
export function anticipate(t, pull = 0.25) {
  const p = clamp01(t);
  return p * p * ((pull + 1) * p - pull);
}

/**
 * Squash and Stretch factor: calculates sx and sy maintaining constant volume (area).
 * When an object hits ground or accelerates:
 * @param {number} t - Time in seconds
 * @param {number} peakTime - Point of maximum squash (e.g. 0.15s)
 * @param {number} dur - Total bounce duration
 * @param {number} amount - Peak compression (0.1 - 0.4)
 */
export function squash(t, peakTime = 0.15, dur = 0.45, amount = 0.28) {
  if (t < 0 || t > dur) return { sx: 1, sy: 1 };
  let s;
  if (t < peakTime) {
    const u = t / peakTime;
    s = amount * Math.sin(u * Math.PI * 0.5);
  } else {
    const u = (t - peakTime) / (dur - peakTime);
    // oscillate back and settle
    s = amount * Math.exp(-4 * u) * Math.cos(u * Math.PI * 2.5);
  }
  const sy = 1 - s;
  const sx = 1 / Math.max(0.01, sy);
  return { sx, sy };
}

/**
 * Organic wiggle / micro-shake for tension, hesitation, or vibrating thoughts
 */
export function wiggle(t, freq = 6, amp = 1, seed = 0) {
  const s1 = Math.sin(t * freq * 1.0 + seed);
  const s2 = Math.sin(t * freq * 1.618 + seed * 1.3);
  const s3 = Math.cos(t * freq * 0.73 + seed * 2.1);
  return (s1 * 0.5 + s2 * 0.35 + s3 * 0.15) * amp;
}

// ——— 2. Word-Level Kinetic Trigger Helper ———

/**
 * Declarative trigger generator pegged to audio word timestamps.
 * @param {number} T - Current global timeline time
 * @param {number} targetTime - Exact timestamp (from Whisper ASR) when the word is spoken
 * @param {object} opts - { enter = 0.35, hold = 1.2, exit = 0.3, bounce = true }
 */
export function kineticTrigger(T, targetTime, opts = {}) {
  const enter = opts.enter || 0.35;
  const hold = opts.hold || 1.2;
  const exit = opts.exit || 0.28;
  const tRel = T - targetTime;

  if (tRel < -enter) {
    return { active: false, enterP: 0, scale: 0, alpha: 0, tRel };
  }
  if (tRel < 0) {
    // Anticipation or ramping in right before the word hits
    const p = (tRel + enter) / enter;
    return { active: true, enterP: p, scale: p * 0.9, alpha: p, tRel };
  }
  if (tRel <= hold) {
    // Active display with spring bounce
    const sp = spring(tRel, enter, 2.2, 5.0);
    return { active: true, enterP: 1, scale: sp, alpha: 1, tRel };
  }
  if (tRel <= hold + exit) {
    // Exiting smoothly
    const p = 1 - (tRel - hold) / exit;
    return { active: true, enterP: 1, scale: p, alpha: p, tRel };
  }
  return { active: false, enterP: 1, scale: 0, alpha: 0, tRel };
}

// ——— 3. Lightweight 2D Particle Effects ———

/**
 * Cartoon Puff: Expanding and dissipating smoke circles (e.g. popping thoughts, explosions)
 */
export function particlePuff(g, x, y, progress, opts = {}) {
  const p = clamp01(progress);
  if (p <= 0 || p >= 1) return;
  const count = opts.count || 7;
  const baseR = opts.radius || 38;
  const color = opts.color || '#FAF8F5';
  const stroke = opts.stroke || '#12131A';
  const spread = (opts.spread || 75) * (1 - Math.pow(1 - p, 2));

  g.save();
  g.translate(x, y);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * TAU + (opts.seed || 0);
    const dist = spread * (0.8 + ((i * 13) % 5) * 0.1);
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    const r = baseR * (1 - p * 0.85) * (0.8 + ((i * 7) % 4) * 0.15);

    if (r > 1) {
      g.beginPath();
      g.arc(px, py, r, 0, TAU);
      g.fillStyle = color;
      g.fill();
      if (stroke) {
        g.strokeStyle = stroke;
        g.lineWidth = opts.lw || 2.5;
        g.stroke();
      }
    }
  }
  g.restore();
}

/**
 * Kinetic Sparks / Impact Stars
 */
export function particleSparks(g, x, y, progress, opts = {}) {
  const p = clamp01(progress);
  if (p <= 0 || p >= 1) return;
  const count = opts.count || 6;
  const maxLen = opts.length || 55;
  const color = opts.color || '#FFB703';
  const lw = opts.lw || 3.5;

  const d1 = maxLen * p;
  const d0 = maxLen * Math.max(0, p - 0.35) * 1.5;

  g.save();
  g.translate(x, y);
  g.strokeStyle = color;
  g.lineWidth = lw * (1 - p * 0.6);
  g.lineCap = 'round';

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * TAU + (opts.rot || 0);
    const c = Math.cos(angle), s = Math.sin(angle);
    g.beginPath();
    g.moveTo(c * d0, s * d0);
    g.lineTo(c * d1, s * d1);
    g.stroke();
  }
  g.restore();
}

/**
 * Speed lines for sudden dramatic realizations or panic moments
 */
export function speedBurst(g, cx, cy, progress, opts = {}) {
  const p = clamp01(progress);
  if (p <= 0 || p >= 1) return;
  const count = opts.count || 16;
  const innerR = (opts.innerRadius || 180) + p * 40;
  const outerR = (opts.outerRadius || 520) + p * 80;
  const color = opts.color || 'rgba(255, 183, 3, 0.45)';

  g.save();
  g.strokeStyle = color;
  g.lineWidth = opts.lw || 3;
  g.lineCap = 'round';

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * TAU + Math.sin(i * 3.7) * 0.08;
    const c = Math.cos(angle), s = Math.sin(angle);
    const r1 = innerR + ((i * 17) % 7) * 10;
    const r2 = outerR + ((i * 29) % 9) * 12;

    g.beginPath();
    g.moveTo(cx + c * r1, cy + s * r1);
    g.lineTo(cx + c * r2, cy + s * r2);
    g.stroke();
  }
  g.restore();
}

// ——— 4. Dynamic Camera & Parallax Controller ———

/**
 * Camera controller with organic drift, shake, and focal tracking
 */
export function kineticCamera(g, t, opts = {}) {
  const fx = opts.target ? opts.target[0] : W / 2;
  const fy = opts.target ? opts.target[1] : H / 2;
  const zoom = opts.zoom || 1.0;
  const ox = opts.ox || 0;
  const oy = opts.oy || 0;

  // Organic micro-drift
  const driftX = opts.drift !== false ? Math.sin(t * 0.7) * 12 : 0;
  const driftY = opts.drift !== false ? Math.cos(t * 0.55) * 8 : 0;

  // Shake
  const shakeAmp = opts.shake || 0;
  const shakeX = shakeAmp > 0 ? wiggle(t, 24, shakeAmp, 11) : 0;
  const shakeY = shakeAmp > 0 ? wiggle(t, 27, shakeAmp, 19) : 0;

  g.translate(fx, fy);
  g.scale(zoom, zoom);
  g.translate(-fx - ox - driftX - shakeX, -fy - oy - driftY - shakeY);
}

// ——— 5. Seamless Transition Helpers ———

/**
 * Iris / Zoom Through Hole Transition
 * Cuts or zooms cleanly through an opening into the next scene.
 */
export function irisTransition(g, cx, cy, progress, fill = '#12131A') {
  const p = clamp01(progress);
  if (p <= 0) return;
  if (p >= 1) {
    g.fillStyle = fill;
    g.fillRect(0, 0, W, H);
    return;
  }
  const maxR = Math.hypot(W, H);
  const r = (1 - Math.pow(1 - p, 2.5)) * maxR;

  g.save();
  g.fillStyle = fill;
  g.beginPath();
  g.rect(0, 0, W, H);
  g.arc(cx, cy, Math.max(0.1, r), 0, TAU, true);
  g.fill('evenodd');
  g.restore();
}

/**
 * Occlusion Wipe: a physical bar or silhouette wipes across the frame
 */
export function occlusionWipe(g, progress, dir = 'leftToRight', fill = '#12131A') {
  const p = clamp01(progress);
  if (p <= 0) return;
  if (p >= 1) {
    g.fillStyle = fill;
    g.fillRect(0, 0, W, H);
    return;
  }
  const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  g.save();
  g.fillStyle = fill;
  if (dir === 'leftToRight') {
    g.fillRect(0, 0, W * eased, H);
  } else if (dir === 'rightToLeft') {
    g.fillRect(W * (1 - eased), 0, W * eased, H);
  } else if (dir === 'bottomToTop') {
    g.fillRect(0, H * (1 - eased), W, H * eased);
  } else {
    g.fillRect(0, 0, W, H * eased);
  }
  g.restore();
}
