// core/cast/adapter-2d.mjs — the 2D adapter.
//
// Draws a cast character on a 2D canvas, in the library's cel look: flat fills,
// one ink line, a hard shadow. Every number comes from the cast module
// (core/cast/cast.mjs); this file only knows how to put them on a canvas.
//
//   createView(canvas)     → the target the character is drawn in
//   createCharacter(spec)   → { draw(view, pose), setPose(pose) }

import { clamp, lerp, ss } from '/core/lib.js';
import { readSpec, metrics, palette, faceOf, createPose } from './cast.mjs';

const INK = '#1D202A';
const INK_PX = 2.8;                       // the ink line, in canvas pixels
const TAU = Math.PI * 2;

export function createView(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('cast 2d: the canvas has no 2d context');
  return { kind: '2d', canvas, ctx, width: canvas.width, height: canvas.height };
}

export function createCharacter(spec) {
  const S = readSpec(spec);
  const M = metrics(S), P = palette(S);
  let cur = createPose({});

  const setPose = pose => (cur = createPose(pose ?? cur));

  function draw(view, pose) {
    const p = createPose(pose ?? cur);
    cur = p;
    const g = view.ctx, W = view.width, H = view.height;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, W, H);
    const scale = (H * 0.78) / M.total;           // pixels per head unit
    g.save();
    g.setTransform(scale, 0, 0, -scale, W / 2, H * 0.9);   // y up, feet at the origin
    g.lineJoin = 'round'; g.lineCap = 'round';
    paint(g, p, M, P, INK_PX / scale);
    g.restore();
  }

  return { draw, setPose };
}

// ———————————————————————————————————————————————————————— the drawing

function paint(g, pose, M, P, ink) {
  const yaw = pose.body * Math.PI / 180;
  const turn = Math.max(0.3, Math.cos(yaw));            // 1 = facing us
  const shift = Math.sin(yaw) * M.headR * 0.9;          // the face slides as the body turns
  const shK = 0.66 + 0.34 * turn;                      // the shoulders narrow when turned
  const F = faceOf(pose);
  const shY = M.shoulderY, hipY = M.hipY, neckY = M.neckY;

  // the shadow on the floor
  g.fillStyle = 'rgba(0,0,0,0.28)';
  g.beginPath();
  g.ellipse(0, 0, M.u * (0.58 + 0.16 * Math.abs(pose.legStance)), M.u * 0.12, 0, 0, TAU);
  g.fill();

  // the legs
  for (const dir of [-1, 1]) {
    const footX = dir * (M.hipHalf * 0.42 + pose.legStance * 0.40 * M.u);
    const hipX = dir * M.hipHalf * 0.5;
    const kneeX = lerp(hipX, footX, 0.5);
    capsule(g, hipX, hipY, kneeX, M.kneeY, M.thighR * 2, P.pants, ink);
    capsule(g, kneeX, M.kneeY, footX, M.u * 0.07, M.shinR * 2, P.pants, ink);
    g.beginPath();                                     // the shoe
    g.roundRect(footX - M.u * 0.13, 0, M.u * 0.36, M.u * 0.15, [M.u * 0.05, M.u * 0.05, M.u * 0.07, M.u * 0.07]);
    g.fillStyle = P.ink; g.fill();
  }

  // the arms: a swing to the back puts them behind the body
  const arms = [-1, 1].map(dir => armGeom(dir, pose, M, shK));
  if (pose.armSwing < 0) for (const a of arms) drawArm(g, a, M, P, ink, true);

  // the neck, behind the collar
  capsule(g, 0, shY - M.u * 0.06, 0, neckY + M.u * 0.06, M.u * 0.22, P.skinShade, ink);

  // the hood, behind the shoulders
  g.fillStyle = P.hoodieShade;
  g.beginPath();
  g.ellipse(0, shY + M.u * 0.02, M.shoulderHalf * shK * 0.74, M.u * 0.36, 0, 0, TAU);
  g.fill();

  // the torso
  const shHalf = M.shoulderHalf * shK, hipHalf = M.hipHalf;
  g.beginPath();
  g.moveTo(-shHalf, shY);
  g.lineTo(shHalf, shY);
  g.quadraticCurveTo(shHalf * 1.03, shY - M.torso * 0.52, hipHalf, hipY);
  g.lineTo(-hipHalf, hipY);
  g.quadraticCurveTo(-shHalf * 1.03, shY - M.torso * 0.52, -shHalf, shY);
  g.closePath();
  g.fillStyle = P.hoodie; g.fill();
  g.strokeStyle = INK; g.lineWidth = 2 * ink; g.stroke();
  g.beginPath();                                        // the hem
  g.moveTo(-hipHalf, hipY); g.lineTo(hipHalf, hipY);
  g.strokeStyle = P.hoodieShade; g.lineWidth = 1.6 * ink; g.stroke();

  if (pose.armSwing >= 0) for (const a of arms) drawArm(g, a, M, P, ink, false);

  // the head, tilted
  g.save();
  g.translate(0, neckY);
  g.rotate(-pose.head * Math.PI / 180);
  g.translate(0, -neckY);
  drawHead(g, M, P, F, shift, turn, ink);
  g.restore();
}

// The arm: the shoulder, the elbow and the hand, for one side.
function armGeom(dir, pose, M, shK) {
  const sx = dir * M.shoulderHalf * shK * 0.92;
  const sy = M.shoulderY - M.u * 0.10;
  const s = pose.armSwing;
  let hx, hy;
  if (s >= 0) { hx = sx - dir * 0.34 * M.u * s; hy = sy - M.arm * (1 - 0.30 * s); }   // in front
  else { hx = sx + dir * 0.26 * M.u * -s; hy = sy - M.arm * (1 - 0.18 * -s); }        // behind
  const bend = ss(Math.abs(s)) * M.u * 0.10;
  return {
    sx, sy, hx, hy,
    ex: lerp(sx, hx, 0.5) + dir * bend,
    ey: lerp(sy, hy, 0.52),
  };
}

function drawArm(g, a, M, P, ink, behind) {
  const sleeve = P.hoodieShade;                       // the sleeves read against the body
  capsule(g, a.sx, a.sy, a.ex, a.ey, M.upperR * 2, sleeve, ink);
  capsule(g, a.ex, a.ey, a.hx, a.hy, M.foreR * 2, sleeve, ink);
  g.beginPath();                                         // the hand
  g.arc(a.hx, a.hy, M.u * 0.13, 0, TAU);
  g.fillStyle = behind ? P.skinShade : P.skin; g.fill();
  g.strokeStyle = INK; g.lineWidth = 2 * ink; g.stroke();
}

function drawHead(g, M, P, F, shift, turn, ink) {
  const R = M.headR, cy = M.headCY, cx = shift;
  const hairCx = cx + shift * 0.22;
  const hw = R * 1.20;
  const top = cy + R * 1.14, bot = cy - M.hairDrop;

  // the hair mass, behind the face
  g.beginPath();
  g.roundRect(hairCx - hw, bot, hw * 2, top - bot, [hw, hw, hw * 0.42, hw * 0.42]);
  g.fillStyle = P.hair; g.fill();
  g.strokeStyle = INK; g.lineWidth = 2 * ink; g.stroke();

  // the face
  g.beginPath();
  g.ellipse(cx, cy, R * 0.99 * turn, R * 1.02, 0, 0, TAU);
  g.fillStyle = P.skin; g.fill();
  g.strokeStyle = INK; g.lineWidth = 1.3 * ink; g.stroke();

  // the fringe, over the forehead (the upper arc of the hair, then the hairline)
  g.beginPath();
  g.ellipse(cx, cy, hw * 0.99, R * 1.14, 0, Math.PI, 0, true);
  g.quadraticCurveTo(cx, cy + R * 1.18, cx - hw * 0.99, cy);
  g.closePath();
  g.fillStyle = P.hair; g.fill();
  g.strokeStyle = INK; g.lineWidth = 2 * ink; g.stroke();

  // the eyes
  const ex = M.eyeDX * turn, ey = cy + M.eyeDY;
  const lidK = clamp(1 - F.lid, 0, 1.3);
  const tall = M.eyeStyle === 'oval' ? 1.35 : 1.15;
  for (const dir of [-1, 1]) {
    const x = cx + dir * ex + shift * 0.15;
    if (lidK < 0.22) {                                   // a closed eye: a line
      g.beginPath();
      g.moveTo(x - M.eyeR * 1.1, ey); g.lineTo(x + M.eyeR * 1.1, ey);
      g.strokeStyle = INK; g.lineWidth = 2.2 * ink; g.stroke();
      continue;
    }
    g.beginPath();
    g.ellipse(x, ey, M.eyeR * tall * turn, M.eyeR * tall * lidK, 0, 0, TAU);
    g.fillStyle = P.white; g.fill();
    g.strokeStyle = INK; g.lineWidth = 0.6 * ink; g.stroke();
    const px = x + F.lookX * M.eyeR * 0.42, py = ey + F.lookY * M.eyeR * 0.42;
    g.beginPath();
    g.ellipse(px, py, M.eyeR * 0.95 * turn, M.eyeR * 0.95 * lidK, 0, 0, TAU);
    g.fillStyle = P.ink; g.fill();
    g.beginPath();                                     // the glint
    g.arc(px - M.eyeR * 0.3, py + M.eyeR * 0.3, M.eyeR * 0.22, 0, TAU);
    g.fillStyle = P.white; g.fill();
  }

  // the brows
  const browY = ey + M.u * 0.13 + F.browY * M.u * 0.06;
  for (const dir of [-1, 1]) {
    const x = cx + dir * ex + shift * 0.15;
    const ang = (dir < 0 ? F.browL : F.browR) * Math.PI / 180;
    g.save();
    g.translate(x, browY);
    g.rotate(dir < 0 ? ang : -ang);
    g.beginPath();
    g.moveTo(-M.u * 0.14, 0); g.lineTo(M.u * 0.14, 0);
    g.strokeStyle = INK; g.lineWidth = 2.4 * ink; g.stroke();
    g.restore();
  }

  // the mouth
  const mx = cx + shift * 0.2, my = cy + M.mouthDY, mw = M.mouthW;
  if (F.mouthOpen > 0.08) {
    g.beginPath();
    g.ellipse(mx, my - F.mouthOpen * M.u * 0.05, mw * 0.42, F.mouthOpen * M.u * 0.16, 0, 0, TAU);
    g.fillStyle = P.ink; g.fill();
  } else {
    g.beginPath();
    g.moveTo(mx - mw * 0.5, my);
    g.quadraticCurveTo(mx, my - F.smile * M.u * 0.13, mx + mw * 0.5, my);
    g.strokeStyle = INK; g.lineWidth = 2.2 * ink; g.stroke();
  }

  // the blush
  if (F.blush > 0.01) {
    g.fillStyle = `rgba(242,160,160,${(0.55 * F.blush).toFixed(3)})`;
    for (const dir of [-1, 1]) {
      g.beginPath();
      g.ellipse(cx + dir * M.eyeDX * 1.05 + shift * 0.15, cy - M.u * 0.02, M.u * 0.15, M.u * 0.09, 0, 0, TAU);
      g.fill();
    }
  }
}

// A limb: a round-capped line, ink under the fill.
function capsule(g, ax, ay, bx, by, w, fill, ink) {
  g.strokeStyle = INK; g.lineWidth = w + 2 * ink;
  g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
  g.strokeStyle = fill; g.lineWidth = w;
  g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
}
