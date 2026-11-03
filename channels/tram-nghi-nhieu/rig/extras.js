// extras.js — the people of an episode who are not Kẻ Nghĩ Nhiều: a shopper, a researcher, a participant, a crowd.
// Same line language as the cast (flat fill, one dark line ~3.4 px), a face that acts, two arms that do things.
//
//   import { extra, crowd, LOOKS } from '../../../../rig/extras.js';
//   const P = extra(g, { x: 900, y: 860, s: 1, look: 'researcher', E: 'thinking', gaze: [.6, 0],
//                        armR: 'point', at: [1300, 600], armL: 'hold', talk: .4, t: T, blink: 0 });
//   drawClipboard(g, ...P.handL);      // the hands are returned in screen space, for the prop they hold
//
// x, y   the feet (standing) or the seat (sit: true); s the scale (1 ≈ 520 px tall standing)
// look   a preset from LOOKS (see rig/catalog/people-*.jpg), or your own { skin, hair, hairCol, top, bottom, acc, hat }
//        acc: one or a list of 'glasses' | 'coat' | 'apron' | 'lanyard' | 'scarf' (khăn quàng đỏ) | 'vest' (áo phản quang)
//             | 'stetho' (ống nghe) | 'badge' (phù hiệu) | 'tie'
//        hat: 'police' | 'nurse' | 'chef' | 'hard' (mũ bảo hộ) | 'nonla' (nón lá) | 'helmet' (mũ bảo hiểm) | 'cap'
// E      neutral | happy | surprised | worried | thinking | annoyed | sad | sly | pain | shocked | sleepy
//        (or {brow, mouth, eyes} numbers −1…1)
// gaze   [−1…1, −1…1] where the eyes look; turn −1…1 turns the head that way
// arms   down | point | hold | wave | hip | up | chin | cross | reach | open   (point/reach go toward `at` = [x, y] on screen)
//        recoil (hand jerked back from something hot) | head (hand on the head) | cover (hand over the mouth)
//        | ear (phone at the ear) | drink (cup at the mouth) | shrug | hug (arms around a thing in front) | hold2 (low, in front)
//        loops that run with t: knit | type | write | stir | clap | fan (fanning the face) | wipe (wiping sweat) | shiver
//        or a move between two poses: { from: 'down', to: 'reach', k: BD.u('b_lay', T, .5) } — the hand travels, it never jumps
//        or a point on screen: [x, y] (the hand goes there; animate the point to carry a thing along a path)
// walk   the phase of a walk cycle (e.g. lt * 1.2): legs swing and the body bobs; animate x with it so the feet don't slide
// talk   0…1 mouth opening (from the voice) · blink 0…1 · t the time (breathing, a small sway)
// sweat  0…1 drops on the forehead · lean −1…1 the body leans (toward a thing, away from it) · rot radians around the
//        feet (rot: −Math.PI / 2 lies the person down, head to the left, e.g. on a bed's mattress anchor)
// Returns { head: [x, y], handL: [x, y], handR: [x, y], top: y } in screen space.
import { W, H, TAU } from './cel.js';

const INK = '#1D202A';
export const LOOKS = {
  shopper:     { skin: '#F2C9A0', hair: 'short', hairCol: '#2B2118', top: '#4F86C6', bottom: '#2E3A55' },
  researcher:  { skin: '#E8B98E', hair: 'bun', hairCol: '#3A2A20', top: '#F4F1EA', bottom: '#3B4466', acc: 'glasses' },
  participant: { skin: '#C98E64', hair: 'short', hairCol: '#18120E', top: '#6BAA75', bottom: '#2A2F45' },
  seller:      { skin: '#F0C39B', hair: 'long', hairCol: '#4A2E1E', top: '#D8574A', bottom: '#33313B', acc: 'apron' },
  elder:       { skin: '#E9C2A0', hair: 'bald', hairCol: '#BDB7AE', top: '#8A6E9E', bottom: '#3A3A44', acc: 'glasses' },
  student:     { skin: '#F5D0AE', hair: 'cap', hairCol: '#22201C', top: '#F2A541', bottom: '#2D3A5A' },
  office:      { skin: '#D9A57B', hair: 'long', hairCol: '#16110D', top: '#5C6B8A', bottom: '#262B3A', acc: 'lanyard' },
  doctor:      { skin: '#EBC09A', hair: 'short', hairCol: '#5A4030', top: '#FFFFFF', bottom: '#4A5A7A', acc: ['coat', 'stetho'] },
  nurse:       { skin: '#F2CBA6', hair: 'bun', hairCol: '#1E1712', top: '#E6F1F7', bottom: '#E6F1F7', acc: 'badge', hat: 'nurse' },
  police:      { skin: '#E3B48C', hair: 'short', hairCol: '#16110D', top: '#6B7A45', bottom: '#5A673A', acc: 'badge', hat: 'police' },
  teacher:     { skin: '#F2CBA6', hair: 'long', hairCol: '#16110D', top: '#F7F4EE', bottom: '#2E3A55', acc: 'glasses' },
  chef:        { skin: '#E8B98E', hair: 'short', hairCol: '#2B2118', top: '#FAFAF7', bottom: '#2A2A30', acc: 'apron', hat: 'chef' },
  worker:      { skin: '#C98E64', hair: 'short', hairCol: '#18120E', top: '#3F5E8C', bottom: '#2A3550', acc: 'vest', hat: 'hard' },
  farmer:      { skin: '#C48A5E', hair: 'short', hairCol: '#18120E', top: '#8A6A48', bottom: '#3A3A44', hat: 'nonla' },
  pupil:       { skin: '#F5D0AE', hair: 'short', hairCol: '#18120E', top: '#FAFAF7', bottom: '#2D3A5A', acc: 'scarf' },
  shipper:     { skin: '#D9A57B', hair: 'short', hairCol: '#18120E', top: '#E07A2E', bottom: '#2A2F45', hat: 'helmet' },
  businessman: { skin: '#E3B48C', hair: 'short', hairCol: '#16110D', top: '#2E3550', bottom: '#2E3550', acc: 'tie' },
};
const EXPR = {
  neutral:   { brow: 0, mouth: 0, eyes: 0 },
  happy:     { brow: .3, mouth: .9, eyes: -.3 },
  surprised: { brow: .9, mouth: -.2, eyes: .8, o: .7 },
  worried:   { brow: -.6, mouth: -.5, eyes: .2, tilt: 1 },
  thinking:  { brow: -.2, mouth: -.15, eyes: 0, side: 1 },
  annoyed:   { brow: -.9, mouth: -.4, eyes: -.4 },
  sad:       { brow: -.5, mouth: -.8, eyes: -.2, tilt: 1 },
  sly:       { brow: .2, mouth: .5, eyes: -.5, side: 1 },
  pain:      { brow: -.9, mouth: -.7, eyes: -.75, o: .25, tilt: 1 },
  shocked:   { brow: 1, mouth: -.4, eyes: 1, o: 1 },
  sleepy:    { brow: -.2, mouth: -.1, eyes: -.85 },
};
const lerp = (a, b, k) => a + (b - a) * k;
function stroke(g, w = 3.4) { g.strokeStyle = INK; g.lineWidth = w; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); }
function fillStroke(g, col, w) { g.fillStyle = col; g.fill(); stroke(g, w); }
function ell(g, x, y, rx, ry, rot = 0) { g.beginPath(); g.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); }
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }

// an arm from the shoulder to a hand target, two segments with a soft elbow (2-joint IK)
function arm(g, sx, sy, tx, ty, len, col, skin, bend, lw) {
  let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy); const L = len;
  if (d > 2 * L * .98) { const k = 2 * L * .98 / d; dx *= k; dy *= k; d = 2 * L * .98; }
  const ex = sx + dx / 2 - bend * dy / d * Math.sqrt(Math.max(0, L * L - d * d / 4)), ey = sy + dy / 2 + bend * dx / d * Math.sqrt(Math.max(0, L * L - d * d / 4));
  const hx = sx + dx, hy = sy + dy;
  g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(ex, ey, hx, hy);
  g.strokeStyle = INK; g.lineWidth = lw + 6.8; g.lineCap = 'round'; g.stroke();
  g.strokeStyle = col; g.lineWidth = lw; g.stroke();
  ell(g, hx, hy, lw * .62, lw * .58); fillStroke(g, skin);
  return [hx, hy];
}

export function extra(g, o = {}) {
  const lk = typeof o.look === 'string' ? LOOKS[o.look] || LOOKS.shopper : { ...LOOKS.shopper, ...(o.look || {}) };
  const ACC = new Set([].concat(lk.acc || [])), has = a => ACC.has(a);
  const E = typeof o.E === 'object' ? { ...EXPR.neutral, ...o.E } : EXPR[o.E || 'neutral'] || EXPR.neutral;
  const s = o.s ?? 1, t = o.t || 0, sit = !!o.sit, turn = o.turn || 0, talk = o.talk || 0, blink = o.blink || 0;
  const breath = Math.sin(t * 2.1 + (o.phase || 0)) * 3, sway = Math.sin(t * .7 + (o.phase || 0)) * 2;
  g.save(); g.translate(o.x ?? W / 2, o.y ?? H - 200); if (o.rot) g.rotate(o.rot); g.scale(s, s);
  const toLocal = ([X, Y]) => { const inv = g.getTransform().inverse(); return [inv.a * X + inv.c * Y + inv.e, inv.b * X + inv.d * Y + inv.f]; };
  const toScreen = ([x, y]) => { const k = g.getTransform(); return [k.a * x + k.c * y + k.e, k.b * x + k.d * y + k.f]; };
  const walk = o.walk != null && !sit, wph = walk ? o.walk * TAU : 0, bob = walk ? -Math.abs(Math.sin(wph)) * 10 : 0;
  const lean = o.lean || 0;
  const hipY = (sit ? 0 : -230) + bob, shY = hipY - 170 + breath * .3, neckY = shY - 18, headY = neckY - 78, bx = sway;
  // legs
  g.lineCap = 'round';
  if (sit) {
    for (const k of [-1, 1]) { g.beginPath(); g.moveTo(bx + k * 34, hipY); g.lineTo(bx + k * 40 + 120, hipY + 6); g.lineTo(bx + k * 40 + 125, hipY + 150);
      g.strokeStyle = INK; g.lineWidth = 50; g.stroke(); g.strokeStyle = lk.bottom; g.lineWidth = 43; g.stroke(); }
  } else {
    for (const k of [-1, 1]) {
      const fx = k * 40 + (walk ? k * Math.sin(wph) * 46 : 0), fy = -18 - (walk ? Math.max(0, k * Math.cos(wph)) * 22 : 0);
      g.beginPath(); g.moveTo(bx + k * 34, hipY); g.lineTo(fx, fy);
      g.strokeStyle = INK; g.lineWidth = 50; g.stroke(); g.strokeStyle = lk.bottom; g.lineWidth = 43; g.stroke();
      ell(g, fx + k * 6, fy + 6, 36, 16); fillStroke(g, '#2A2A30'); }
  }
  // body: from here up, the torso pivots at the hip when the person leans
  g.save(); if (lean) { g.translate(bx, hipY); g.rotate(lean * .3); g.translate(-bx, -hipY); }
  const coat = has('coat');
  g.beginPath(); g.moveTo(bx - 78, shY + 10); g.quadraticCurveTo(bx - 90, hipY - 40, bx - 70, hipY + 12); g.lineTo(bx + 70, hipY + 12);
  g.quadraticCurveTo(bx + 90, hipY - 40, bx + 78, shY + 10); g.quadraticCurveTo(bx, shY - 14, bx - 78, shY + 10); g.closePath();
  fillStroke(g, coat ? '#FFFFFF' : lk.top);
  if (coat) { g.beginPath(); g.moveTo(bx, shY); g.lineTo(bx, hipY + 10); stroke(g, 2.5); }
  if (has('vest')) { rr(g, bx - 70, shY + 6, 140, hipY - shY - 4, 18); fillStroke(g, '#F2C23A');
    for (const y of [shY + 70, shY + 120]) { g.fillStyle = '#E8E8E8'; g.fillRect(bx - 68, y, 136, 12); } g.beginPath(); g.moveTo(bx, shY); g.lineTo(bx, hipY + 8); stroke(g, 2.5); }
  if (has('tie')) { g.beginPath(); g.moveTo(bx - 16, shY - 4); g.lineTo(bx, shY + 22); g.lineTo(bx + 16, shY - 4); g.closePath(); fillStroke(g, '#FAFAF7', 2.5);
    g.beginPath(); g.moveTo(bx, shY + 6); g.lineTo(bx - 9, shY + 90); g.lineTo(bx, shY + 104); g.lineTo(bx + 9, shY + 90); g.closePath(); fillStroke(g, '#B23A48', 2.5); }
  if (has('badge')) { rr(g, bx + 26, shY + 36, 26, 18, 3); fillStroke(g, lk.hat === 'police' ? '#E8C547' : '#FFFFFF', 2.5); }
  if (lk.hat === 'police') for (const k of [-1, 1]) { rr(g, bx + k * 52 - 14, shY + 2, 28, 10, 3); fillStroke(g, '#C8323C', 2); }
  if (has('apron')) { rr(g, bx - 52, shY + 50, 104, hipY - shY - 30, 14); fillStroke(g, '#F4E9D8'); }
  if (has('lanyard')) { g.beginPath(); g.moveTo(bx - 24, shY + 2); g.lineTo(bx, shY + 70); g.lineTo(bx + 24, shY + 2); stroke(g, 3); rr(g, bx - 16, shY + 68, 32, 42, 5); fillStroke(g, '#FFFFFF', 2.5); }
  // head
  const hx = bx + turn * 10, hy = headY + breath * .2 + (E.tilt ? 4 : 0);
  ell(g, bx, neckY + 6, 18, 20); fillStroke(g, lk.skin);
  if (has('scarf')) { g.beginPath(); g.moveTo(bx - 34, shY - 6); g.quadraticCurveTo(bx, shY + 22, bx + 34, shY - 6); g.lineTo(bx + 30, shY + 8); g.quadraticCurveTo(bx, shY + 34, bx - 30, shY + 8); g.closePath(); fillStroke(g, '#D7263D', 2.6);
    g.beginPath(); g.moveTo(bx - 4, shY + 16); g.lineTo(bx - 20, shY + 70); g.lineTo(bx - 4, shY + 66); g.lineTo(bx + 6, shY + 74); g.lineTo(bx + 8, shY + 18); g.closePath(); fillStroke(g, '#D7263D', 2.6); }
  if (has('stetho')) { g.beginPath(); g.moveTo(bx - 28, shY - 2); g.quadraticCurveTo(bx - 34, shY + 70, bx, shY + 80); g.quadraticCurveTo(bx + 34, shY + 70, bx + 28, shY - 2); stroke(g, 3.6); ell(g, bx, shY + 86, 9, 9); fillStroke(g, '#9AA3B5', 2.5); }
  if (lk.hair === 'long') {   // behind the head: the crown and two locks down to the shoulders, never under the chin
    ell(g, hx - turn * 4, hy - 8, 72, 72); fillStroke(g, lk.hairCol);
    for (const k of [-1, 1]) { rr(g, hx + k * 50 - 22 - turn * 4, hy - 10, 44, 120, 20); fillStroke(g, lk.hairCol); }
  }
  ell(g, hx, hy, 62, 70); fillStroke(g, lk.skin);
  ell(g, hx - 61 + turn * 8, hy + 6, 10, 14); fillStroke(g, lk.skin); ell(g, hx + 61 + turn * 8, hy + 6, 10, 14); fillStroke(g, lk.skin);
  g.fillStyle = lk.hairCol;
  if (lk.hair === 'short' || lk.hair === 'long' || lk.hair === 'bun') { g.beginPath(); g.ellipse(hx, hy - 28, 64, 46, 0, Math.PI, TAU); g.quadraticCurveTo(hx + 30 + turn * 10, hy - 30, hx - 10, hy - 34); g.quadraticCurveTo(hx - 40, hy - 20, hx - 64, hy - 22); g.closePath(); fillStroke(g, lk.hairCol); }
  if (lk.hair === 'bun') { ell(g, hx + 6, hy - 84, 26, 22); fillStroke(g, lk.hairCol); }
  if (lk.hair === 'bald') { g.beginPath(); g.arc(hx - 56, hy - 6, 14, 0, TAU); g.arc(hx + 56, hy - 6, 14, 0, TAU); g.fill(); }
  const HAT = lk.hat || (lk.hair === 'cap' ? 'cap' : null);
  if (HAT === 'police') { g.beginPath(); g.ellipse(hx, hy - 52, 74, 24, 0, 0, TAU); fillStroke(g, '#5A673A'); rr(g, hx - 60, hy - 64, 120, 22, 8); fillStroke(g, '#6B7A45');
    rr(g, hx - 60, hy - 46, 120, 10, 3); fillStroke(g, '#C8323C', 2.5); ell(g, hx, hy - 58, 10, 10); fillStroke(g, '#E8C547', 2.5); g.beginPath(); g.ellipse(hx + 8, hy - 36, 54, 9, 0, 0, Math.PI); fillStroke(g, '#2A2F1E', 2.5); }
  if (HAT === 'nurse') { g.beginPath(); g.moveTo(hx - 40, hy - 56); g.lineTo(hx - 30, hy - 86); g.lineTo(hx + 30, hy - 86); g.lineTo(hx + 40, hy - 56); g.closePath(); fillStroke(g, '#FFFFFF', 2.8);
    g.fillStyle = '#E04050'; g.fillRect(hx - 4, hy - 82, 8, 20); g.fillRect(hx - 10, hy - 76, 20, 8); }
  if (HAT === 'chef') { rr(g, hx - 48, hy - 78, 96, 30, 6); fillStroke(g, '#FFFFFF'); for (const k of [-1, 0, 1]) { ell(g, hx + k * 30, hy - 100 - (k ? 0 : 10), 30, 28); fillStroke(g, '#FFFFFF'); } rr(g, hx - 48, hy - 78, 96, 26, 6); g.fillStyle = '#FFFFFF'; g.fill(); }
  if (HAT === 'hard') { g.beginPath(); g.ellipse(hx, hy - 38, 68, 56, 0, Math.PI, TAU); g.closePath(); fillStroke(g, '#F2C23A'); g.beginPath(); g.ellipse(hx, hy - 38, 84, 10, 0, 0, TAU); fillStroke(g, '#F2C23A'); rr(g, hx - 8, hy - 96, 16, 50, 6); fillStroke(g, '#E5B22A', 2.5); }
  if (HAT === 'nonla') { g.beginPath(); g.moveTo(hx - 118, hy - 30); g.lineTo(hx, hy - 120); g.lineTo(hx + 118, hy - 30); g.quadraticCurveTo(hx, hy - 14, hx - 118, hy - 30); fillStroke(g, '#E9D29A');
    for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(hx - 118 * i / 4, hy - 30 - 90 * (1 - i / 4) + 0); g.lineTo(hx + 118 * i / 4, hy - 30 - 90 * (1 - i / 4)); stroke(g, 1.6); } }
  if (HAT === 'helmet') { g.beginPath(); g.ellipse(hx, hy - 30, 72, 62, 0, Math.PI, TAU); g.closePath(); fillStroke(g, '#E07A2E'); g.beginPath(); g.moveTo(hx - 70, hy - 30); g.lineTo(hx + 72, hy - 30); stroke(g, 3.4);
    rr(g, hx - 40, hy - 74, 80, 12, 5); g.fillStyle = 'rgba(255,255,255,.35)'; g.fill(); }
  if (HAT === 'cap') { g.beginPath(); g.ellipse(hx, hy - 34, 66, 42, 0, Math.PI, TAU); g.closePath(); fillStroke(g, lk.top); g.beginPath(); g.ellipse(hx + 40 + turn * 30, hy - 34, 50, 10, 0, 0, TAU); fillStroke(g, lk.top); }
  // face: eyes look at gaze, brows and mouth from the expression
  const [gx, gy] = o.gaze || [turn * .6, 0], ex = hx + turn * 12 + (E.side ? 6 : 0), ey = hy + 4;
  const open = lerp(1, .08, blink) * (1 + E.eyes * .35);
  for (const k of [-1, 1]) {
    const cx = ex + k * 24;
    ell(g, cx, ey, 11, 13 * open); g.fillStyle = '#FFFFFF'; g.fill(); stroke(g, 2.6);
    if (open > .25) { ell(g, cx + gx * 5, ey + gy * 5, 5.5, 6.5 * Math.min(1, open)); g.fillStyle = INK; g.fill(); }
    const by = ey - 24 - E.brow * 7, inner = E.brow < 0 ? -E.brow * 7 : 0;
    g.beginPath(); g.moveTo(cx - 12, by + (k > 0 ? inner : 0)); g.lineTo(cx + 12, by + (k < 0 ? inner : 0)); stroke(g, 4.2);
  }
  ell(g, ex + 2, ey + 22, 5, 4); g.fillStyle = 'rgba(0,0,0,.12)'; g.fill();
  const my = ey + 40, mw = 18 + E.mouth * 6, curve = E.mouth * 10, mo = Math.max(talk * 16, (E.o || 0) * 14);
  if (mo > 1.5) { ell(g, ex + 2, my + mo * .3, mw * .7, mo * .7); fillStroke(g, '#7A2E2E', 2.6); }
  else { g.beginPath(); g.moveTo(ex + 2 - mw, my - curve * .2); g.quadraticCurveTo(ex + 2, my + curve, ex + 2 + mw, my - curve * .2); stroke(g, 3.4); }
  if (has('glasses')) for (const k of [-1, 1]) { ell(g, ex + k * 24, ey, 19, 17); stroke(g, 3); }
  if (o.sweat > 0) for (let i = 0; i < 3; i++) {   // drops slide down the temples
    const ph = ((t * .5 + i * .37) % 1), k = i % 2 ? 1 : -1, x = hx + k * (40 + i * 6), y = hy - 40 + ph * 60;
    g.globalAlpha = o.sweat * Math.sin(ph * Math.PI); g.beginPath(); g.moveTo(x, y - 20); g.quadraticCurveTo(x + 13, y + 4, x, y + 10); g.quadraticCurveTo(x - 13, y + 4, x, y - 20);
    g.fillStyle = '#9ED3F2'; g.fill(); stroke(g, 2); g.globalAlpha = 1; }
  // arms: rest poses, or toward a point on screen
  const at = o.at ? toLocal(o.at) : null, sL = [bx - 70, shY + 18], sR = [bx + 70, shY + 18], len = 112;
  const pose = (name, side) => {
    const k = side === 'L' ? -1 : 1, [sx, sy] = side === 'L' ? sL : sR;
    switch (name) {
      case 'point': case 'reach': return at && ((side === 'R') === (at[0] >= bx) || name === 'reach') ? at : [sx + k * 200, sy - 40];
      case 'hold': return [sx + k * 10, sy + 120];
      case 'wave': return [sx + k * 70, sy - 150 + Math.sin(t * 9) * 14];
      case 'hip': return [sx + k * 46, sy + 150];
      case 'up': return [sx + k * 40, sy - 200];
      case 'chin': return [hx + k * 16, hy + 60];
      case 'cross': return [bx - k * 30, sy + 80];
      case 'open': return [sx + k * 140, sy + 60];
      case 'recoil': return [sx + k * 36, sy - 60];
      case 'head': return [hx + k * 52, hy - 58];
      case 'cover': return [hx + k * 6, hy + 44];
      case 'ear': return [hx + k * 66, hy + 14];
      case 'drink': return [hx + k * 14, hy + 52];
      case 'shrug': return [sx + k * 96, sy - 24];
      case 'hug': return [bx - k * 26, sy + 70];
      case 'hold2': return [bx + k * 34, sy + 150];
      case 'fan': return [hx + k * 70 + Math.sin(t * 14) * 18, hy + 20 + Math.cos(t * 14) * 6];
      case 'wipe': return [hx + k * (Math.sin(t * 4) * 40), hy - 44];
      case 'shiver': return [bx - k * 20 + Math.sin(t * 40) * 3, sy + 60];
      // loops: two hands working in front of the body, out of phase
      case 'knit': return [bx - k * 18 + Math.sin(t * 7 + (k > 0 ? 0 : Math.PI)) * 10, sy + 104 + Math.cos(t * 7 + (k > 0 ? 0 : Math.PI)) * 9];
      case 'type': return [bx + k * 48, sy + 128 - Math.max(0, Math.sin(t * 11 + (k > 0 ? 0 : 1.9))) * 14];
      case 'write': return k > 0 ? [bx + 40 + Math.sin(t * 6) * 22, sy + 132 + Math.sin(t * 12) * 5] : [bx - 40, sy + 136];
      case 'stir': return [bx + k * 30 + Math.cos(t * 5) * 22 * k, sy + 120 + Math.sin(t * 5) * 10];
      case 'clap': return [bx + k * (8 + Math.abs(Math.sin(t * 6)) * 46), sy + 70];
      default: return [sx + k * 12, sy + 210];
    }
  };
  const arm0 = (a, side) => {
    if (Array.isArray(a)) return toLocal(a);
    if (a && typeof a === 'object') { const A = pose(a.from || 'down', side), B = pose(a.to || 'down', side), k = Math.max(0, Math.min(1, a.k ?? 1));
      return [lerp(A[0], B[0], k), lerp(A[1], B[1], k)]; }
    return pose(a || 'down', side);
  };
  const tL = arm0(o.armL, 'L'), tR = arm0(o.armR, 'R');
  const sleeve = coat ? '#FFFFFF' : lk.top;
  const hL = arm(g, ...sL, ...tL, len, sleeve, lk.skin, -1, 30), hR = arm(g, ...sR, ...tR, len, sleeve, lk.skin, 1, 30);
  const out = { head: toScreen([hx, hy]), handL: toScreen(hL), handR: toScreen(hR), top: toScreen([hx, hy - 75])[1] };
  g.restore(); g.restore();
  return out;
}

// a crowd: n people in rows, each with its own look, phase and small motion; `hot` people (by index) can be lit
export function crowd(g, o = {}) {
  const n = o.n || 12, cols = o.cols || 6, [x, y, w, h] = o.box || [200, 300, 1500, 500], t = o.t || 0, hot = new Set(o.hot || []);
  const looks = Object.keys(LOOKS), rows = Math.ceil(n / cols), out = [];
  for (let r = rows - 1; r >= 0; r--) for (let c = 0; c < cols; c++) {
    const i = r * cols + c; if (i >= n) continue;
    const s = (o.s || .45) * (1 - r * .08), px = x + (c + .5 + (r % 2) * .3) * w / cols, py = y + h - r * (h / rows) * .55;
    const lk = { ...LOOKS[looks[(i * 7 + 3) % looks.length]] };
    if (o.dim && !hot.has(i)) { lk.top = '#5A6488'; lk.bottom = '#3A4260'; }
    out[i] = extra(g, { x: px, y: py, s, look: lk, t, phase: i * 1.7, E: hot.has(i) ? (o.hotE || 'happy') : (o.E || 'neutral'),
      armR: hot.has(i) ? (o.hotArm || 'up') : 'down', blink: ((t * .4 + i * .37) % 1) < .04 ? 1 : 0, turn: Math.sin(i * 2.3) * .3 });
  }
  return out;
}
