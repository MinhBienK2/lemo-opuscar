// "Kẻ Nghĩ Nhiều" (The Overthinker) and his sidekick "Rối" — 2D Character Rig
// Faithfully matching the authentic vector cartoon aesthetic from the_overthinker_2d_character_rig.html
import { cel, path, poly, ellP, line, taper, ribbon, limb, ik, mix, rgba, LWK, TAU, rect } from './cel.js';

export const PAL = {
  bg: '#12131a', bg2: '#0c0d13',
  ink: '#171a2b',
  skin: { f: '#fff0d8', s: '#ecd6b8', h: '#ffffff', l: '#171a2b' },
  hair: { f: '#202746', s: '#161c36', h: '#46517a', l: '#171a2b' },
  hoodie: { f: '#f7bd27', s: '#d99516', h: '#ffd34f', l: '#171a2b' },
  pants: { f: '#252d50', s: '#191f3a', l: '#171a2b' },
  cream: '#fff0d8',
  muted: '#aaaaba',
  panel: '#151722', panel2: '#2a2e40',
  violet: { f: '#9a5be5', s: '#7d3fc4', h: '#be8df5', l: '#171a2b' },
  cyan: { f: '#67e8f9', s: '#22b8d6', h: '#b6f3ff', l: '#171a2b' },
  red: { f: '#f04462', s: '#c22a38', h: '#ff9aa0', l: '#171a2b' },
  green: { f: '#4ade80', s: '#2aa85a', h: '#a7f3c4', l: '#171a2b' },
  accent: { f: '#f7bd27', s: '#d99516', h: '#ffd34f', l: '#171a2b' },
  yellow: '#f7bd27',
  bulb: '#ffd34f',
  mouth: '#a94345',
  blush: '#d9bda5'
};

// Expressions: mapped to the friendly vector facial rig
const E0 = {
  face: 'sleepy',
  open: 1, lookX: 0, lookY: 0, smile: 0, mo: 0, mw: 1, ms: 0,
  browL: 0, browR: 0, browY: 0, blush: 0, ahoge: 1, glow: 1,
  sweat: 0, gloom: 0, sparkles: 0, tired: 0
};

export const EXPR = {
  neutral: { face: 'sleepy' },
  talk: { face: 'sleepy', mo: .3 },
  smile: { face: 'happy', smile: .8 },
  happy: { face: 'happy', smile: 1, mo: .25 },
  excited: { face: 'happy', smile: 1, mo: .45, sparkles: 1 },
  surprised: { face: 'surprised', open: 1.2, mo: .6 },
  shocked: { face: 'surprised', open: 1.3, mo: .75, sweat: 1 },
  thinking: { face: 'thinking', lookX: .6, lookY: -.4, browL: -4, browR: 2 },
  skeptical: { face: 'worried', lookX: .4, browL: 4, browR: -4 },
  smug: { face: 'happy', smile: .9, lookX: -.2 },
  worried: { face: 'worried', smile: -.6 },
  sad: { face: 'worried', smile: -.8, gloom: 1 },
  tired: { face: 'sleepy', tired: 1, smile: -.2 },
  annoyed: { face: 'worried', smile: -.5, browL: -5, browR: -5 },
  embarrassed: { face: 'happy', blush: 1, smile: .4 },
  determined: { face: 'happy', browL: -6, browR: -6 },
  deadpan: { face: 'sleepy', smile: 0 },
  flat: { face: 'sleepy', smile: 0 },
  spin: { face: 'happy', mo: .3 },
};

export function expr(name, over) {
  const base = typeof name === 'string' ? (EXPR[name] || { face: name }) : (name || {});
  return { ...E0, ...base, ...(over || {}) };
}

export function blendE(a, b, t) {
  const A = typeof a === 'string' ? expr(a) : (a || E0);
  const Bq = typeof b === 'string' ? expr(b) : (b || E0);
  const o = {};
  for (const k in E0) {
    if (typeof A[k] === 'number' && typeof Bq[k] === 'number') {
      o[k] = A[k] + (Bq[k] - A[k]) * t;
    } else {
      o[k] = t < .5 ? A[k] : Bq[k];
    }
  }
  return o;
}

// Export squircle & animeHead for any external caller compatibility
export function squircle(x, y, a, b, n = 4.2, steps = 64) {
  const p = new Path2D();
  for (let i = 0; i <= steps; i++) {
    const th = i / steps * TAU, ct = Math.cos(th), st = Math.sin(th);
    const px = x + a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n), py = y + b * Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
    i ? p.lineTo(px, py) : p.moveTo(px, py);
  }
  p.closePath(); return p;
}
export function animeHead(x, y, a, b, yaw = 0) {
  return new Path2D("M326 111 Q330 65 389 66 Q453 67 463 122 L454 195 Q439 224 394 225 Q343 222 326 188Z");
}

// SVG Path definitions from reference rig
const PATHS = {
  head: new Path2D("M326 111 Q330 65 389 66 Q453 67 463 122 L454 195 Q439 224 394 225 Q343 222 326 188Z"),
  hair: new Path2D("M320 142 Q300 103 330 91 Q318 59 359 64 Q378 37 408 65 Q438 47 449 83 Q480 91 463 130 Q453 111 442 110 Q430 126 413 114 Q390 136 369 116 Q347 139 320 142Z"),
  bulb: new Path2D("M390 69 Q377 49 392 34 Q409 19 421 36 Q433 53 413 69 L413 79 L393 79Z"),
  hoodie: new Path2D("M315 220 Q330 197 360 196 L424 196 Q455 207 469 240 L450 393 Q391 416 319 393 L298 250Z"),
  collarSh: new Path2D("M345 203 Q390 246 438 204"),
  collarRim: new Path2D("M355 204 Q390 237 425 204"),
  armL: new Path2D("M315 235 Q282 230 270 267 L249 335 Q248 354 269 357 Q285 358 294 339 L327 284Z"),
  handL: new Path2D("M251 337 Q239 349 246 363 Q258 375 278 356 L286 342Z"),
  armR: new Path2D("M458 236 Q490 239 502 275 L517 337 Q516 355 496 359 Q479 358 473 340 L448 284Z"),
  handR: new Path2D("M499 337 Q519 339 525 355 Q521 371 499 364 L482 350Z"),
  pantL: new Path2D("M330 390 L326 478 Q326 490 345 490 L369 490 L377 395Z"),
  pantR: new Path2D("M385 395 L395 478 Q395 491 414 490 L437 490 L425 389Z"),
  shoeL: new Path2D("M324 480 Q300 490 305 508 Q310 520 366 515 Q383 510 369 491Z"),
  shoeR: new Path2D("M394 482 Q382 494 390 510 Q398 520 451 514 Q466 506 439 489Z")
};

// Main character figure
export function figure(g, o = {}) {
  const E = o.E ? expr(o.E) : expr('sleepy');
  const t = o.t || 0;
  const s = o.s === undefined ? 1 : o.s;
  const blink = o.blink || 0;
  const talk = o.talk || { o: 0 };
  const batteryLevel = o.battery === undefined ? 0.12 : o.battery;

  // The base scale factor maps the 800x560 SVG rig to the 1920x1080 canvas
  const S_BASE = 1.35;
  const scale = s * S_BASE;

  g.save();
  g.scale(scale, scale);

  // Character origin is (0,0) at neck/chest center (SVG 390, 204)
  // Gentle breathing and floating motion
  const breathe = Math.sin(t * 1.55) * 2;
  const sway = Math.sin(t * 0.8) * 0.015;
  g.rotate(sway);
  g.translate(0, breathe);
  g.translate(-390, -204);

  // 1. Legs & Shoes (drawn behind torso)
  if (o.crop !== 'bust') {
    const legs = o.legs || { mode: 'stand' };
    const isWalk = legs.mode === 'walk';
    const isSit = legs.mode === 'sit';
    const ph = isWalk ? (legs.ph || 0) : 0;
    const sw = isWalk ? Math.sin(ph * TAU) * 16 : 0;

    g.save();
    g.lineJoin = 'round';
    g.lineCap = 'round';
    g.strokeStyle = PAL.ink;
    g.lineWidth = 7;

    // Sitting mode adjustments
    if (isSit) {
      g.translate(20, -10);
    }

    // Left leg
    g.save();
    if (isWalk) g.translate(sw, 0);
    g.fillStyle = PAL.pants.f;
    g.fill(PATHS.pantL); g.stroke(PATHS.pantL);
    g.fillStyle = PAL.cream;
    g.fill(PATHS.shoeL); g.stroke(PATHS.shoeL);
    g.strokeStyle = PAL.yellow; g.lineWidth = 5;
    g.beginPath(); g.moveTo(309, 505); g.lineTo(366, 505); g.stroke();
    g.restore();

    // Right leg
    g.save();
    if (isWalk) g.translate(-sw, 0);
    g.strokeStyle = PAL.ink; g.lineWidth = 7;
    g.fillStyle = PAL.pants.f;
    g.fill(PATHS.pantR); g.stroke(PATHS.pantR);
    g.fillStyle = PAL.cream;
    g.fill(PATHS.shoeR); g.stroke(PATHS.shoeR);
    g.strokeStyle = PAL.yellow; g.lineWidth = 5;
    g.beginPath(); g.moveTo(394, 505); g.lineTo(449, 505); g.stroke();
    g.restore();

    g.restore();
  }

  // 2. Hoodie Torso
  g.lineJoin = 'round';
  g.lineCap = 'round';
  g.strokeStyle = PAL.ink;
  g.lineWidth = 8;
  g.fillStyle = PAL.yellow;
  g.fill(PATHS.hoodie);
  g.stroke(PATHS.hoodie);

  // Collar shadow & rim
  g.strokeStyle = PAL.yellowSh;
  g.lineWidth = 7;
  g.stroke(PATHS.collarSh);

  g.strokeStyle = PAL.ink;
  g.lineWidth = 7;
  g.stroke(PATHS.collarRim);

  // 3. Arms
  // Check if custom arm positions are passed
  const hasArmL = o.armL && o.armL.at;
  const hasArmR = o.armR && o.armR.at;

  // Left arm
  g.save();
  if (hasArmL) {
    const at = o.armL.at;
    const ang = Math.atan2(at[1] - 250, at[0] - 315) - Math.PI / 2;
    g.translate(315, 235); g.rotate(ang * 0.5); g.translate(-315, -235);
  } else if (o.pose === 'explain' || (o.armL && o.armL.gest === 'open')) {
    g.translate(315, 235); g.rotate(-0.38); g.translate(-315, -235);
  } else if (o.pose === 'point' || (o.armL && o.armL.gest === 'point')) {
    g.translate(315, 235); g.rotate(-0.55); g.translate(-315, -235);
  }
  g.strokeStyle = PAL.ink; g.lineWidth = 8; g.fillStyle = PAL.yellow;
  g.fill(PATHS.armL); g.stroke(PATHS.armL);
  g.lineWidth = 7; g.fillStyle = PAL.cream;
  g.fill(PATHS.handL); g.stroke(PATHS.handL);
  g.restore();

  // Right arm
  g.save();
  if (hasArmR) {
    const at = o.armR.at;
    const ang = Math.atan2(at[1] - 250, at[0] - 460) - Math.PI / 2;
    g.translate(458, 236); g.rotate(ang * 0.5); g.translate(-458, -236);
  } else if (o.pose === 'explain') {
    g.translate(458, 236); g.rotate(0.42); g.translate(-458, -236);
  } else if (o.pose === 'point' || (o.armR && o.armR.gest === 'point')) {
    g.translate(458, 236); g.rotate(0.65); g.translate(-458, -236);
  }
  g.strokeStyle = PAL.ink; g.lineWidth = 8; g.fillStyle = PAL.yellow;
  g.fill(PATHS.armR); g.stroke(PATHS.armR);
  g.lineWidth = 7; g.fillStyle = PAL.cream;
  g.fill(PATHS.handR); g.stroke(PATHS.handR);
  g.restore();

  // 4. Hoodie details: drawstrings & battery
  // Drawstrings
  g.strokeStyle = PAL.cream;
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(369, 224); g.lineTo(367, 268);
  g.moveTo(421, 222); g.lineTo(420, 318);
  g.stroke();

  // Zig-zag knot on right drawstring
  g.strokeStyle = PAL.ink;
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(416, 278); g.lineTo(425, 289); g.lineTo(416, 300); g.lineTo(426, 311);
  g.stroke();

  // Low battery icon on chest
  const batColor = batteryLevel < 0.25 ? PAL.red.f : PAL.green.f;
  g.fillStyle = batColor;
  g.strokeStyle = PAL.ink;
  g.lineWidth = 3;
  g.beginPath();
  g.roundRect(381, 303, 37, 17, 4);
  g.fill(); g.stroke();

  // Battery level bar
  const batFillW = Math.max(2, Math.min(30, 30 * batteryLevel));
  g.fillStyle = PAL.cream;
  g.beginPath();
  g.roundRect(385, 307, batFillW, 9, 1);
  g.fill();

  // Battery terminal notch
  g.fillStyle = PAL.ink;
  g.fillRect(420, 308, 4, 7);

  // 5. Head, Hair, Bulb & Face
  g.save();
  const headSway = (o.headRoll || 0) + Math.sin(t * 1.8) * 0.02;
  const headPitch = (o.headPitch || 0) * 4;
  g.translate(390, 204);
  g.rotate(headSway);
  g.translate(0, headPitch);
  g.translate(-390, -204);

  // Head base
  g.fillStyle = PAL.cream;
  g.strokeStyle = PAL.ink;
  g.lineWidth = 8;
  g.fill(PATHS.head);
  g.stroke(PATHS.head);

  // Hair
  g.fillStyle = PAL.hair.f;
  g.fill(PATHS.hair);
  g.stroke(PATHS.hair);

  // Hair highlights
  g.strokeStyle = PAL.hair.h;
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(350, 83); g.lineTo(340, 101);
  g.moveTo(380, 72); g.lineTo(373, 88);
  g.moveTo(426, 77); g.lineTo(416, 94);
  g.stroke();

  // Glowing lightbulb on top of head
  g.save();
  g.shadowColor = PAL.bulb;
  g.shadowBlur = E.glow === undefined ? 12 : 12 * E.glow;
  g.strokeStyle = PAL.bulb;
  g.lineWidth = 5;
  g.stroke(PATHS.bulb);
  g.beginPath();
  g.moveTo(397, 84); g.lineTo(411, 84);
  g.moveTo(399, 90); g.lineTo(409, 90);
  g.lineWidth = 4;
  g.stroke();
  g.restore();

  // Face features
  const faceType = E.face || 'sleepy';

  // Eyebrows
  g.strokeStyle = PAL.ink;
  g.lineWidth = 6;
  if (faceType === 'worried' || E.smile < -0.2) {
    g.beginPath();
    g.moveTo(348, 147); g.quadraticCurveTo(367, 156, 383, 144);
    g.moveTo(407, 144); g.quadraticCurveTo(426, 156, 442, 147);
    g.stroke();
  } else {
    g.beginPath();
    g.moveTo(348, 153); g.quadraticCurveTo(367, 139, 383, 153);
    g.moveTo(407, 153); g.quadraticCurveTo(426, 139, 442, 153);
    g.stroke();
  }

  // Eyes
  if (blink > 0.5) {
    g.strokeStyle = PAL.ink;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(356, 160); g.lineTo(376, 160);
    g.moveTo(415, 160); g.lineTo(435, 160);
    g.stroke();
  } else if (faceType === 'happy' || E.smile > 0.7) {
    g.strokeStyle = PAL.ink;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(356, 164); g.quadraticCurveTo(366, 154, 376, 164);
    g.moveTo(415, 164); g.quadraticCurveTo(425, 154, 435, 164);
    g.stroke();
  } else {
    g.fillStyle = PAL.ink;
    const eyeRy = (faceType === 'surprised' || E.open > 1.1) ? 14 : 9;
    const lookX = (E.lookX || 0) * 4;
    const lookY = (E.lookY || 0) * 3;
    g.beginPath();
    g.ellipse(366 + lookX, 160 + lookY, 8, eyeRy, 0, 0, TAU);
    g.ellipse(425 + lookX, 160 + lookY, 8, eyeRy, 0, 0, TAU);
    g.fill();
    // Specular dots
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(364 + lookX, 157 + lookY, 2.5, 0, TAU);
    g.arc(423 + lookX, 157 + lookY, 2.5, 0, TAU);
    g.fill();
  }

  // Blush tick marks
  g.strokeStyle = PAL.blush;
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(346, 177); g.lineTo(356, 180);
  g.moveTo(432, 180); g.lineTo(442, 177);
  g.stroke();

  // Mouth
  const mouthOpen = Math.max(talk.o, E.mo || 0);
  if (mouthOpen > 0.2 || faceType === 'surprised') {
    const mo = Math.max(mouthOpen, faceType === 'surprised' ? 0.6 : 0);
    g.fillStyle = PAL.mouth;
    g.strokeStyle = PAL.ink;
    g.lineWidth = 4;
    g.beginPath();
    g.ellipse(396, 192, 11, 6 + mo * 10, 0, 0, TAU);
    g.fill(); g.stroke();
  } else if (faceType === 'worried' || E.smile < -0.2) {
    g.strokeStyle = PAL.mouth;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(385, 196); g.quadraticCurveTo(397, 185, 410, 196);
    g.stroke();
  } else if (faceType === 'happy' || E.smile > 0.4) {
    g.strokeStyle = PAL.mouth;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(382, 184); g.quadraticCurveTo(397, 204, 413, 184);
    g.stroke();
  } else {
    g.strokeStyle = PAL.mouth;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(384, 190); g.quadraticCurveTo(397, 198, 409, 189);
    g.stroke();
  }

  g.restore(); // Head transform
  g.restore(); // Main transform
  return { fx: 0, fy: -100, hy: -100 };
}

// Sidekick Rối: authentic purple scribble monster
export function roi(g, x, y, s = 1, o = {}) {
  const t = o.t || 0;
  const floatY = Math.sin(t * 2.5) * 8;
  const floatRot = Math.sin(t * 1.8) * 0.08;

  g.save();
  g.translate(x, y + floatY);
  g.rotate(floatRot);
  g.scale(s, s);

  // Scribble loops
  g.strokeStyle = PAL.violet.f;
  g.lineWidth = 5;
  g.setLineDash([8, 5]);
  g.lineCap = 'round';
  const p1 = new Path2D("M-42 0 C-55 -42 4 -57 35 -30 S51 29 9 43 S-54 29 -42 0Z");
  const p2 = new Path2D("M-34 -20 C-4 -57 49 -5 20 26 S-46 41 -26 -4 S36 -40 39 7");
  const p3 = new Path2D("M-46 13 C-15 -22 5 55 45 8");
  g.stroke(p1); g.stroke(p2); g.stroke(p3);
  g.setLineDash([]);

  // Eyes
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.ellipse(-13, -2, 12, 15, 0, 0, TAU);
  g.ellipse(17, -3, 12, 15, 0, 0, TAU);
  g.fill();

  // Pupils
  g.fillStyle = PAL.ink;
  g.beginPath();
  g.arc(-10, 1, 5, 0, TAU);
  g.arc(20, 0, 5, 0, TAU);
  g.fill();

  // Specular dots
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.arc(-12, -4, 2, 0, TAU);
  g.arc(18, -5, 2, 0, TAU);
  g.fill();

  g.restore();
}

// Low battery chest icon
export function battery(g, x, y, w, level, t, lw = 3) {
  g.save();
  g.translate(x, y);
  const s = w / 37;
  g.scale(s, s);
  const batColor = level < 0.25 ? PAL.red.f : PAL.green.f;
  g.fillStyle = batColor;
  g.strokeStyle = PAL.ink;
  g.lineWidth = 3;
  g.beginPath();
  g.roundRect(0, 0, 37, 17, 4);
  g.fill(); g.stroke();

  const batFillW = Math.max(2, Math.min(30, 30 * level));
  g.fillStyle = PAL.cream;
  g.beginPath();
  g.roundRect(4, 4, batFillW, 9, 1);
  g.fill();

  g.fillStyle = PAL.ink;
  g.fillRect(39, 5, 4, 7);
  g.restore();
}
