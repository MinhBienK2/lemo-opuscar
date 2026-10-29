// Overlay: narration subtitles, chapter signs, insert cards, the end card.
import * as T from './timing.js';
import { seg, ss, eio, back, clamp, lerp } from './lib.js';

const CREAM = '#fffaf0', INK = '#3a2a24', RED = '#b8322c', GOLD = '#e0b456';

function wrap(x, text, max, font) {
  x.font = font;
  const words = text.split(' '), lines = []; let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (x.measureText(test).width > max && cur) { lines.push(cur); cur = w; } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function subs(x, t) {
  for (const c of T.SUBS) {
    if (t < c.t0 - .1 || t > c.t1 + .25) continue;
    const a = Math.min(seg(t, c.t0 - .1, c.t0 + .12), 1 - seg(t, c.t1 + .1, c.t1 + .25));
    const font = '600 40px "Be Vietnam Pro"';
    const lines = wrap(x, c.text, 1520, font);
    x.save(); x.globalAlpha = a; x.font = font; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.lineJoin = 'round'; x.lineWidth = 10; x.strokeStyle = INK; x.fillStyle = CREAM;
    lines.forEach((ln, i) => {
      const y = 986 - (lines.length - 1 - i) * 52;
      x.strokeText(ln, 960, y); x.fillText(ln, 960, y);
    });
    x.restore();
  }
}

function chapter(x, t) {
  for (const c of T.CH) {
    const t0 = c.t0 - 1.2, t1 = c.t0 + 4.6;
    if (t < t0 || t > t1) continue;
    const k = back(seg(t, t0, t0 + .55), 1.5) * (1 - eio(seg(t, t1 - .5, t1)));
    const y = lerp(-160, 96, k);
    x.save(); x.translate(0, y);
    // hanging sign
    x.strokeStyle = 'rgba(58,42,36,.55)'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(420, 0); x.lineTo(420, 54); x.moveTo(1500, 0); x.lineTo(1500, 54); x.stroke();
    x.fillStyle = 'rgba(58,42,36,.18)'; x.beginPath(); x.roundRect(392, 62, 1136, 108, 12); x.fill();
    x.beginPath(); x.roundRect(400, 54, 1120, 108, 12); x.fillStyle = '#f2e2c0'; x.fill();
    x.lineWidth = 5; x.strokeStyle = INK; x.stroke();
    x.fillStyle = RED; x.beginPath(); x.roundRect(424, 76, 96, 64, 8); x.fill();
    x.fillStyle = '#fff'; x.font = '800 26px "Be Vietnam Pro"'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('CH', 472, 108);
    x.fillStyle = INK; x.font = '800 44px "Be Vietnam Pro"'; x.textAlign = 'left';
    x.fillText(c.title, 548, 110);
    x.restore();
  }
}

function inserts(x, t) {
  for (const c of T.INSERTS) {
    if (t < c.t0 || t > c.t1) continue;
    const k = back(seg(t, c.t0, c.t0 + .45), 1.4) * (1 - eio(seg(t, c.t1 - .35, c.t1)));
    const w = c.w || 620, h = c.h || 200, px = c.x ?? 120, py = c.y ?? 150;
    x.save(); x.translate(px + w / 2, py + h / 2); x.rotate(-.025); x.scale(k, k); x.translate(-w / 2, -h / 2);
    x.fillStyle = 'rgba(30,20,14,.22)'; x.beginPath(); x.roundRect(8, 10, w, h, 8); x.fill();
    x.fillStyle = '#f6ecd2'; x.beginPath(); x.roundRect(0, 0, w, h, 8); x.fill();
    x.lineWidth = 4; x.strokeStyle = INK; x.stroke();
    // tape
    x.save(); x.globalAlpha = .55; x.fillStyle = '#e8d8b0'; x.fillRect(w * .42, -14, 96, 26); x.restore();
    x.fillStyle = RED; x.font = '800 24px "Be Vietnam Pro"'; x.textAlign = 'left'; x.textBaseline = 'top';
    x.fillText(c.tag, 26, 20);
    x.fillStyle = INK; x.font = '700 34px "Be Vietnam Pro"';
    const lines = wrap(x, c.text, w - 52, '700 34px "Be Vietnam Pro"');
    lines.slice(0, 3).forEach((ln, i) => x.fillText(ln, 26, 58 + i * 44));
    if (c.sub) { x.fillStyle = '#6a5a4a'; x.font = '500 22px "Be Vietnam Pro"'; x.fillText(c.sub, 26, h - 40); }
    x.restore();
  }
}

function endCard(x, t) {
  const t0 = T.DUR - 5.4;
  if (t < t0) return;
  const a = seg(t, t0, t0 + .8);
  x.save(); x.globalAlpha = a;
  x.textAlign = 'center';
  x.fillStyle = 'rgba(20,14,10,.55)'; x.fillRect(0, 0, 1920, 1080);
  x.fillStyle = GOLD; x.font = '110px "Lilita One"'; x.fillText('MỘT VÒNG LỘN', 960, 440);
  x.fillStyle = '#f4ead4'; x.font = '96px "Lilita One"'; x.fillText('MƯỜI BỐN NĂM', 960, 546);
  x.fillStyle = 'rgba(244,234,212,.8)'; x.font = '500 30px "Be Vietnam Pro"';
  x.fillText('Tây Du Ký · một bài luận bằng giấy', 960, 620);
  x.restore();
}

export function draw(x, t) {
  subs(x, t); inserts(x, t); chapter(x, t); endCard(x, t);
}

// Every piece of text on screen at t, with its box in pixels, for the reading-time check
// (core/render/readcheck.mjs). The subtitle bar is left out: its hold is set by the .srt.
export function texts(t) {
  const out = [];
  for (const c of T.CH) {                                   // the chapter sign
    const t0 = c.t0 - 1.2, t1 = c.t0 + 4.6;
    if (t < t0 || t > t1) continue;
    out.push({ id: 'ch-' + c.id, text: c.title, x0: 400, y0: 54, x1: 1520, y1: 162 });
  }
  for (const c of T.INSERTS) {                             // the insert cards
    if (t < c.t0 || t > c.t1) continue;
    const w = c.w || 620, h = c.h || 200, px = c.x ?? 120, py = c.y ?? 150;
    out.push({ id: 'ins-' + c.tag, text: c.text + (c.sub ? ' ' + c.sub : ''), x0: px, y0: py, x1: px + w, y1: py + h });
  }
  return out;
}
