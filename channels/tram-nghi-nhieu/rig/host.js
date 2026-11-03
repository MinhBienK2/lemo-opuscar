// host.js — the two ways the host comments on the story without taking it over (board.json: shot "host"):
//
//   hostPip(g, T, sh, o)    pip: a ring in a corner over the story world, popping in at the shot's cut and out at its end
//                           o: {corner: 'br'|'bl'|'tr'|'tl', r: 150, E: 'smug', talk, blink, at: t0, out: t1}
//   reactClose(g, T, o)     react: a close-up of the host's face filling the frame, for one beat (a gag, a wince, a "wait…")
//                           o: {E: 'skeptical', talk, blink, bg, lines: true}
//
// desk (the host at home) and scene (the host inside the story world, in costume) are drawn by the episode with figure().
// Draw the story frame first, then hostPip over it; reactClose replaces the frame.
import { figure, PAL } from './character.js';
import { pip, focusLines, ease, clamp01 } from './broll.js';
import { W, H } from './cel.js';

const CORNERS = { br: [W - 230, H - 330], bl: [230, H - 330], tr: [W - 230, 240], tl: [230, 240] };

export function hostPip(g, T, sh, o = {}) {
  const t0 = o.at ?? sh.t0, t1 = o.out ?? sh.t1, r = o.r || 150;
  const p = Math.min(clamp01((T - t0) / .35), Number.isFinite(t1) ? clamp01((t1 - T) / .25) : 1);
  if (p <= 0) return;
  globalThis.SEEN?.add?.('pip');
  const [cx, cy] = o.xy || CORNERS[o.corner || 'br'];
  pip(g, cx, cy, r, p, gg => {
    gg.fillStyle = o.bg || PAL.bg; gg.fillRect(-r, -r, 2 * r, 2 * r);
    gg.save(); gg.translate(0, r * .78); figure(gg, { s: r / 175, t: T, crop: 'bust', E: o.E || 'talk', talk: o.talk, blink: o.blink || 0 }); gg.restore();
  });
}

export function reactClose(g, T, o = {}) {
  globalThis.SEEN?.add?.('react');
  g.fillStyle = o.bg || PAL.bg; g.fillRect(0, 0, W, H);
  if (o.lines !== false) focusLines(g, W / 2, H * .42, T);
  const k = .97 + .03 * ease.out((T - (o.at ?? T)) / .2);   // a small settle on the cut in
  g.save(); g.translate(W / 2, H * .84); g.scale(k, k);
  figure(g, { s: o.s || 2.7, t: T, crop: 'bust', E: o.E || 'skeptical', talk: o.talk, blink: o.blink || 0 });
  g.restore();
}
