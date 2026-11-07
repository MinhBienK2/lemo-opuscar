// The film's own overlay drawing: the closing card with the numbers.
import { PAL } from '../../../../rig/kit.js';
import { seg, ss, back } from '../../../../rig/kit.js';

// a rounded rectangle on the overlay, in corner coordinates
export const rect = (g, x0, y0, x1, y1, r = 0) => {
  g.beginPath();
  if (r > 0 && g.roundRect) g.roundRect(x0, y0, x1 - x0, y1 - y0, r);
  else g.rect(x0, y0, x1 - x0, y1 - y0);
};

// a line of text on the overlay
export const text = (g, str, x, y, o = {}) => {
  const { size = 52, color = PAL.red, align = 'center' } = o;
  g.save();
  g.font = `900 ${size}px "Be Vietnam Pro"`;
  g.textAlign = align; g.textBaseline = 'middle';
  g.fillStyle = color;
  g.fillText(str, x, y);
  g.restore();
};

// the closing card: a number and what it costs, in the channel's card style
export function card(g, lines, x, y, t, t0, t1) {
  if (t < t0 || t > t1) return null;
  const k = back(seg(t, t0, t0 + .4), 2.2) * (1 - ss(seg(t, t1 - .25, t1)));
  g.save(); g.translate(x, y); g.scale(k, k);
  g.font = '900 52px "Be Vietnam Pro"';
  const w = Math.max(...lines.map(l => g.measureText(l).width)) + 70, h = lines.length * 66 + 34, r = 22;
  g.fillStyle = PAL.ink; rect(g, -w / 2 + 7, -h / 2 + 9, w / 2 + 7, h / 2 + 9, r); g.fill();
  g.fillStyle = PAL.cream; rect(g, -w / 2, -h / 2, w / 2, h / 2, r); g.fill();
  g.lineWidth = 6; g.strokeStyle = PAL.ink; g.stroke();
  lines.forEach((l, i) => text(g, l, 0, -h / 2 + 42 + i * 66));
  g.restore();
  return k > .99 ? { id: 'card', text: lines.join(' '), x0: x - w / 2, y0: y - h / 2, x1: x + w / 2, y1: y + h / 2 } : null;
}
