// Smart UI & Explainer Components for Trạm Nghĩ Nhiều and Lemo-Opuscar.
// Encodes the 3-Clock Timing Architecture (Structure Lead, Fact Sync, Withheld Reveal)
// to prevent label-bar desyncs, visual freezes, and early spoilers.
import { cel, rect, line, W, H } from './cel.js';
import { seg, clamp01, text, font } from './broll.js';
import { spring, elasticOut } from './motion.js';

/**
 * 1. Dynamic Bar with Clock-Locked Label
 * Ensures the value label NEVER appears on an empty baseline;
 * only fades/pops in when the bar actually reaches the value.
 */
export function dynamicBar(g, {
  x, y, w = 180, maxH = 400, val, maxVal = 100,
  t, t0, dur = 1.0,
  label = null, unit = '%',
  fill = '#FFB703', stroke = '#C88A00',
  textColor = '#2A2A24', subLabel = '', subColor = '#6E6757'
}) {
  const p = clamp01(seg(t, t0, t0 + dur));
  // Ease-out cubic curve
  const easeP = 1 - Math.pow(1 - p, 3);
  const targetH = maxH * (val / maxVal);
  const currentH = targetH * easeP;

  // Draw the bar
  cel(g, rect(x, y - currentH, x + w, y), { f: fill, s: stroke, so: [6, 6], l: '#12131A', lw: 3 });

  // Sub-label below baseline (Clock 1: visible from start or fast fade)
  if (subLabel) {
    text(g, subLabel, x + w / 2, y + 42, { font: font(700, 32), align: 'center', fill: subColor });
  }

  // Value label on top (Clock 2: ONLY visible when bar is at >= 85% height)
  if (p >= 0.85) {
    const labelAlpha = (p - 0.85) / 0.15;
    g.save();
    g.globalAlpha = labelAlpha;
    const displayVal = label !== null ? label : `${val}${unit}`;
    text(g, displayVal, x + w / 2, y - currentH - 34, { font: font(900, 96), align: 'center', fill: textColor });
    g.restore();
  }
}

/**
 * 2. Gated Reveal (Anti-Spoiler Container)
 * Guarantees that punchlines, conclusion stamps, or debunk text
 * are strictly hidden until the spoken reveal timestamp tGate.
 */
export function gatedReveal(g, { t, tGate, dur = 0.45, anim = 'pop', renderFn }) {
  if (t < tGate) return;
  const p = clamp01(seg(t, tGate, tGate + dur));
  g.save();
  if (anim === 'pop') {
    const s = elasticOut(p);
    renderFn(g, s, p);
  } else if (anim === 'fade') {
    g.globalAlpha = p;
    renderFn(g, 1, p);
  } else {
    renderFn(g, p, p);
  }
  g.restore();
}

/**
 * 3. Strike Behind (Layer-Safe Strike-Through)
 * Draws a red cancel line / strike-through BEHIND the text glyphs
 * so text remains 100% legible, without cutting through letters.
 */
export function strikeBehind(g, {
  p1, p2, t, t0, dur = 0.5,
  color = '#D8402F', lw = 12,
  textFn = null
}) {
  const p = clamp01(seg(t, t0, t0 + dur));
  if (p > 0) {
    // Current stroke endpoint
    const cx = p1[0] + (p2[0] - p1[0]) * p;
    const cy = p1[1] + (p2[1] - p1[1]) * p;
    line(g, [p1, [cx, cy]], color, lw);
  }
  // Render text on top of the line
  if (textFn) {
    textFn(g);
  }
}

/**
 * 4. Compound Shot Clock Manager
 * Extracts independent clocks for multiple lines in a single scene.
 * Prevents collapsing all cues onto line 1's t0.
 */
export function compoundClocks(TL, lineIds) {
  const clocks = {};
  for (const lid of lineIds) {
    const lineObj = TL && TL.L ? TL.L[lid] : null;
    if (lineObj) {
      clocks[lid] = {
        id: lid,
        t0: lineObj.t0,
        t1: lineObj.t1,
        dur: lineObj.t1 - lineObj.t0,
        wordTime: (w) => (lineObj.words && lineObj.words[w] ? lineObj.words[w].t0 : lineObj.t0)
      };
    } else {
      clocks[lid] = { id: lid, t0: 0, t1: 0, dur: 0, wordTime: () => 0 };
    }
  }
  return clocks;
}
