// character.js — "Ren" (The Forensic Explainer): 2D Detailed Scholarly & Cute Avatar
// Designed for YouTube Niche/Documentary Explainers & Situational In-Scene Interactions (Zack D. 2D style)

export const PAL = {
  // Skin tones
  skin: '#FDF0E6',
  skinShadow: '#E8CEBE',
  skinDeep: '#D1AB97',
  blush: 'rgba(238, 114, 114, 0.28)',
  lip: '#D97D7D',
  mouthInside: '#4A1D24',
  tongue: '#E57385',
  teeth: '#FFFFFF',

  // Hair
  hairDark: '#20222A',
  hairMid: '#343846',
  hairLight: '#52596E',
  hairHighlight: 'rgba(255, 255, 255, 0.45)',

  // Eyes
  sclera: '#F7F8FA',
  eyeShadow: '#D2D8E2',
  irisOuter: '#1E486D',
  irisMid: '#2B7BB9',
  irisInner: '#5BC0EB',
  pupil: '#0F1E2E',
  eyeHighlight: '#FFFFFF',

  // Clothing - Smart Scholarly Investigator Look
  blazer: '#182433',
  blazerLapel: '#111B27',
  blazerShadow: '#0C131C',
  shirt: '#F4F5F7',
  shirtShadow: '#D5DAE2',
  tieAccent: '#C92A2A', // Money Heist Red accent
  trousers: '#2B303A',
  trousersShadow: '#1C2027',
  shoes: '#ECEFF4',
  shoesTrim: '#4C566A',

  // Accessories
  glassesFrame: '#C59B27', // Brushed gold intellectual glasses
  glassesLens: 'rgba(225, 245, 254, 0.18)',
  glassesGlint: 'rgba(255, 255, 255, 0.55)',
  lineArt: '#1A1C23',
};

const TAU = Math.PI * 2;

// --- Helper Functions ---
function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// --- Eye Rendering ---
function drawDetailedEye(ctx, cx, cy, rx, ry, {
  blink = 0,
  look = [0, 0],
  squint = 0,
  pupilDilation = 1.0,
  sparkle = true,
  isLeft = true
} = {}) {
  ctx.save();
  ctx.translate(cx, cy);

  const openHeight = Math.max(0.05, 1 - blink);
  const currentRy = ry * openHeight;

  // Clip to eye shape
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, currentRy, 0, 0, TAU);
  ctx.save();
  ctx.clip();

  // 1. Sclera (White)
  ctx.fillStyle = PAL.sclera;
  ctx.fill();

  // 2. Upper eyelid cast shadow
  ctx.fillStyle = PAL.eyeShadow;
  ctx.beginPath();
  ctx.ellipse(0, -currentRy * 0.45, rx * 1.05, currentRy * 0.65, 0, 0, TAU);
  ctx.fill();

  // 3. Iris
  const maxLookX = rx * 0.42;
  const maxLookY = currentRy * 0.35;
  const irisX = clamp(look[0] * maxLookX, -maxLookX, maxLookX);
  const irisY = clamp(look[1] * maxLookY, -maxLookY, maxLookY);
  const irisR = ry * 0.88;

  // Iris Outer gradient
  const irisGrad = ctx.createRadialGradient(irisX, irisY, irisR * 0.2, irisX, irisY, irisR);
  irisGrad.addColorStop(0, PAL.irisInner);
  irisGrad.addColorStop(0.55, PAL.irisMid);
  irisGrad.addColorStop(1, PAL.irisOuter);

  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.ellipse(irisX, irisY, irisR * 0.88, irisR, 0, 0, TAU);
  ctx.fill();

  // Iris texture rings
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(irisX, irisY, irisR * 0.55, irisR * 0.62, 0, 0, TAU);
  ctx.stroke();

  // 4. Pupil
  const pupilR = irisR * 0.42 * pupilDilation;
  ctx.fillStyle = PAL.pupil;
  ctx.beginPath();
  ctx.ellipse(irisX, irisY, pupilR * 0.9, pupilR, 0, 0, TAU);
  ctx.fill();

  // 5. Highlights
  if (sparkle && blink < 0.6) {
    // Primary glint (studio key light)
    ctx.fillStyle = PAL.eyeHighlight;
    ctx.beginPath();
    ctx.ellipse(irisX - irisR * 0.32, irisY - irisR * 0.35, irisR * 0.28, irisR * 0.24, -0.2, 0, TAU);
    ctx.fill();

    // Secondary cute secondary catchlight
    ctx.beginPath();
    ctx.arc(irisX + irisR * 0.36, irisY + irisR * 0.28, irisR * 0.12, 0, TAU);
    ctx.fill();
  }

  ctx.restore(); // end clip

  // 6. Eyelid Contours & Eyelashes
  ctx.lineWidth = 3.2;
  ctx.strokeStyle = PAL.hairDark;
  ctx.lineCap = 'round';

  if (blink < 0.85) {
    // Upper lash line (crisp curve with subtle wing)
    ctx.beginPath();
    const wingX = isLeft ? -rx * 1.15 : rx * 1.15;
    const innerX = isLeft ? rx * 0.95 : -rx * 0.95;
    ctx.moveTo(innerX, 0);
    ctx.quadraticCurveTo(0, -currentRy * 1.08, wingX, -currentRy * 0.35);
    ctx.stroke();

    // Double eyelid crease
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(32, 34, 42, 0.45)';
    ctx.beginPath();
    ctx.moveTo(innerX * 0.7, -currentRy * 1.15);
    ctx.quadraticCurveTo(0, -currentRy * 1.45, wingX * 0.85, -currentRy * 0.85);
    ctx.stroke();

    // Subtle lower lash accent
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(32, 34, 42, 0.35)';
    ctx.beginPath();
    ctx.arc(0, currentRy * 0.9, rx * 0.5, 0.15, Math.PI - 0.15);
    ctx.stroke();
  } else {
    // Fully closed blink smile curve
    ctx.beginPath();
    ctx.lineWidth = 3.4;
    ctx.arc(0, 0, rx * 0.95, 0.1, Math.PI - 0.1);
    ctx.stroke();
  }

  ctx.restore();
}

// --- Mouth & Visemes ---
function drawDetailedMouth(ctx, cx, cy, mouthWidth, {
  viseme = 'closed', // 'closed', 'smile', 'talk_a', 'talk_o', 'talk_e', 'shock', 'smirk'
  talk = 0,
  scale = 1
} = {}) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  const w = mouthWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (viseme === 'closed' && talk < 0.1) {
    // Gentle confident natural mouth
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = PAL.hairDark;
    ctx.beginPath();
    ctx.moveTo(-w * 0.5, 0);
    ctx.quadraticCurveTo(0, 1.5, w * 0.5, 0);
    ctx.stroke();

    // Lower lip shadow hint
    ctx.fillStyle = PAL.skinShadow;
    ctx.beginPath();
    ctx.ellipse(0, 6, w * 0.24, 2.5, 0, 0, TAU);
    ctx.fill();
  } else if (viseme === 'smile' && talk < 0.1) {
    // Warm scholarly smile
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = PAL.hairDark;
    ctx.beginPath();
    ctx.moveTo(-w * 0.55, -2);
    ctx.quadraticCurveTo(0, 5, w * 0.55, -2);
    ctx.stroke();

    // Dimple corners
    ctx.beginPath();
    ctx.moveTo(-w * 0.55, -3); ctx.lineTo(-w * 0.58, -0.5);
    ctx.moveTo(w * 0.55, -3); ctx.lineTo(w * 0.58, -0.5);
    ctx.stroke();
  } else if (viseme === 'smirk') {
    // Asymmetrical intriguing grin ("Here is where it gets crazy...")
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = PAL.hairDark;
    ctx.beginPath();
    ctx.moveTo(-w * 0.45, 2);
    ctx.quadraticCurveTo(0, 1, w * 0.6, -5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w * 0.6, -6);
    ctx.lineTo(w * 0.63, -3);
    ctx.stroke();
  } else {
    // Open talking mouth with teeth & tongue (parametric with talk)
    const openH = Math.max(8, talk * 24 + (viseme === 'shock' ? 32 : viseme === 'talk_o' ? 22 : 14));
    const mouthW = viseme === 'talk_o' || viseme === 'shock' ? w * 0.65 : w * 0.85;

    // Mouth cavity path
    ctx.beginPath();
    ctx.moveTo(-mouthW * 0.5, -2);
    ctx.quadraticCurveTo(0, -4, mouthW * 0.5, -2);
    ctx.quadraticCurveTo(mouthW * 0.55, openH, 0, openH);
    ctx.quadraticCurveTo(-mouthW * 0.55, openH, -mouthW * 0.5, -2);
    ctx.closePath();

    ctx.save();
    ctx.clip();

    // 1. Dark interior
    ctx.fillStyle = PAL.mouthInside;
    ctx.fill();

    // 2. Upper teeth
    ctx.fillStyle = PAL.teeth;
    ctx.beginPath();
    ctx.rect(-mouthW * 0.4, -4, mouthW * 0.8, openH * 0.38);
    ctx.fill();

    // 3. Tongue
    ctx.fillStyle = PAL.tongue;
    ctx.beginPath();
    ctx.ellipse(0, openH + 2, mouthW * 0.45, openH * 0.55, 0, 0, TAU);
    ctx.fill();

    ctx.restore(); // end clip

    // Outline
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = PAL.hairDark;
    ctx.stroke();

    // Lower lip accent
    ctx.fillStyle = PAL.skinShadow;
    ctx.beginPath();
    ctx.ellipse(0, openH + 6, w * 0.28, 3, 0, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

// --- Eyebrow Rendering ---
function drawEyebrow(ctx, cx, cy, len, {
  tilt = 0, // -1 sad/shocked, 0 neutral, +1 intense/inquisitive
  arch = 3,
  isLeft = true
} = {}) {
  ctx.save();
  ctx.translate(cx, cy);

  const dir = isLeft ? 1 : -1;
  const innerY = tilt * -6;
  const outerY = tilt * 4;

  ctx.lineWidth = 3.6;
  ctx.strokeStyle = PAL.hairDark;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(-len * 0.5 * dir, innerY);
  ctx.quadraticCurveTo(0, -arch + (innerY + outerY) * 0.5, len * 0.5 * dir, outerY);
  ctx.stroke();

  ctx.restore();
}

// --- Wireframe Glasses ---
function drawGlasses(ctx, headW, { tilt = 0 } = {}) {
  ctx.save();
  ctx.translate(0, -32 + tilt * 2);

  const glassR = 27;
  const dist = 37;

  [-dist, dist].forEach((gx, idx) => {
    // Glass frame
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = PAL.glassesFrame;
    ctx.beginPath();
    ctx.arc(gx, 0, glassR, 0, TAU);
    ctx.stroke();

    // Lens reflection
    ctx.fillStyle = PAL.glassesLens;
    ctx.fill();

    // Diagonal intellectual reflection glint
    ctx.save();
    ctx.beginPath();
    ctx.arc(gx, 0, glassR - 1, 0, TAU);
    ctx.clip();

    const grad = ctx.createLinearGradient(gx - glassR, -glassR, gx + glassR, glassR);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.0)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');

    ctx.fillStyle = grad;
    ctx.fillRect(gx - glassR, -glassR, glassR * 2, glassR * 2);
    ctx.restore();
  });

  // Nose bridge
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = PAL.glassesFrame;
  ctx.beginPath();
  ctx.arc(0, -6, 12, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Temple arms back to ears
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-dist - glassR, -2);
  ctx.lineTo(-headW * 0.48, -12);
  ctx.moveTo(dist + glassR, -2);
  ctx.lineTo(headW * 0.48, -12);
  ctx.stroke();

  ctx.restore();
}

// --- Detailed Head Drawing ---
export function drawHead(ctx, pose = {}) {
  const {
    x = 0, y = 0, scale = 1,
    look = [0, 0],
    blink = 0,
    viseme = 'closed',
    talk = 0,
    expression = 'neutral', // 'neutral', 'explain', 'smirk', 'shock', 'ponder', 'intense'
    headAngle = 0,
    ambientTint = null
  } = pose;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(headAngle);
  ctx.scale(scale, scale);

  const headW = 138;
  const headH = 178;

  // 1. Neck (behind head)
  ctx.fillStyle = PAL.skinShadow;
  ctx.beginPath();
  ctx.moveTo(-28, 45);
  ctx.lineTo(28, 45);
  ctx.lineTo(34, 110);
  ctx.lineTo(-34, 110);
  ctx.closePath();
  ctx.fill();

  // Neck muscle definition
  ctx.strokeStyle = PAL.skinDeep;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-16, 70); ctx.lineTo(-24, 105);
  ctx.moveTo(16, 70); ctx.lineTo(24, 105);
  ctx.stroke();

  // 2. Ears
  [-headW * 0.49, headW * 0.49].forEach((ex, idx) => {
    const isLeft = idx === 0;
    ctx.fillStyle = PAL.skin;
    ctx.beginPath();
    ctx.ellipse(ex, -28, 14, 22, (isLeft ? -0.1 : 0.1), 0, TAU);
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = PAL.skinDeep;
    ctx.stroke();

    // Ear inner folds
    ctx.beginPath();
    ctx.arc(ex + (isLeft ? 3 : -3), -28, 7, 0.4, 2.8);
    ctx.stroke();
  });

  // 3. Face shape (soft V-line jaw, clean rounded chin)
  ctx.fillStyle = PAL.skin;
  ctx.beginPath();
  ctx.moveTo(-headW * 0.48, -55);
  // Cranium & Temples
  ctx.bezierCurveTo(-headW * 0.52, -10, -headW * 0.45, 25, -headW * 0.28, 62);
  // Chin curve
  ctx.quadraticCurveTo(0, 92, headW * 0.28, 62);
  // Right jaw
  ctx.bezierCurveTo(headW * 0.45, 25, headW * 0.52, -10, headW * 0.48, -55);
  ctx.quadraticCurveTo(0, -95, -headW * 0.48, -55);
  ctx.closePath();
  ctx.fill();

  ctx.lineWidth = 2.6;
  ctx.strokeStyle = PAL.hairDark;
  ctx.stroke();

  // 4. Soft Blush on Cheeks (Adds youth & charisma)
  ctx.fillStyle = PAL.blush;
  ctx.beginPath();
  ctx.ellipse(-headW * 0.32, -14, 22, 11, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(headW * 0.32, -14, 22, 11, 0, 0, TAU);
  ctx.fill();

  // 5. Nose (cute minimal anime/editorial nose with shadow)
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = PAL.skinDeep;
  ctx.beginPath();
  ctx.moveTo(1, -22);
  ctx.lineTo(-2, -6);
  ctx.lineTo(6, -4);
  ctx.stroke();

  // 6. Eyes & Eyebrows based on Expression Preset
  let eyeSquint = 0;
  let pupilScale = 1.0;
  let browTilt = 0;
  let browArch = 3.5;
  let currentViseme = viseme;

  if (expression === 'explain') {
    browTilt = 0.45;
    browArch = 4.2;
    currentViseme = viseme === 'closed' ? 'talk_a' : viseme;
  } else if (expression === 'smirk') {
    browTilt = -0.35;
    browArch = 3.0;
    currentViseme = 'smirk';
  } else if (expression === 'shock') {
    pupilScale = 0.72;
    browTilt = -0.85;
    browArch = 6.0;
    currentViseme = 'shock';
  } else if (expression === 'ponder') {
    eyeSquint = 0.25;
    browTilt = 0.6;
    browArch = 2.5;
  } else if (expression === 'intense') {
    eyeSquint = 0.35;
    browTilt = 0.75;
    browArch = 2.0;
  }

  // Left Eye
  drawDetailedEye(ctx, -38, -32, 22, 19, {
    blink, look, squint: eyeSquint, pupilDilation: pupilScale, isLeft: true
  });
  // Right Eye
  drawDetailedEye(ctx, 38, -32, 22, 19, {
    blink, look, squint: eyeSquint, pupilDilation: pupilScale, isLeft: false
  });

  // Eyebrows
  drawEyebrow(ctx, -38, -54, 38, { tilt: browTilt, arch: browArch, isLeft: true });
  drawEyebrow(ctx, 38, -54, 38, { tilt: -browTilt * 0.7, arch: browArch, isLeft: false });

  // 7. Mouth
  drawDetailedMouth(ctx, 0, 26, 36, {
    viseme: currentViseme, talk, scale: 1.0
  });

  // 8. Wireframe Scholarly Glasses
  drawGlasses(ctx, headW, { tilt: headAngle });

  // 9. Hair Layer (Front bangs & stylish wavy layers)
  ctx.fillStyle = PAL.hairDark;
  ctx.beginPath();
  // Hair volume top
  ctx.moveTo(-headW * 0.54, -50);
  ctx.bezierCurveTo(-headW * 0.62, -120, -headW * 0.25, -145, 0, -145);
  ctx.bezierCurveTo(headW * 0.35, -145, headW * 0.62, -115, headW * 0.54, -45);
  // Bangs falling across forehead
  ctx.quadraticCurveTo(headW * 0.42, -72, headW * 0.25, -55);
  ctx.quadraticCurveTo(headW * 0.18, -40, headW * 0.08, -68);
  ctx.quadraticCurveTo(-headW * 0.05, -52, -headW * 0.18, -62);
  ctx.quadraticCurveTo(-headW * 0.35, -78, -headW * 0.45, -45);
  ctx.quadraticCurveTo(-headW * 0.52, -35, -headW * 0.54, -50);
  ctx.closePath();
  ctx.fill();

  ctx.lineWidth = 2.6;
  ctx.strokeStyle = PAL.lineArt;
  ctx.stroke();

  // Hair highlights / shine band
  ctx.fillStyle = PAL.hairHighlight;
  ctx.beginPath();
  ctx.ellipse(headW * 0.12, -118, 38, 8, 0.25, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-headW * 0.22, -112, 28, 6, -0.3, 0, TAU);
  ctx.fill();

  // Subtle ambient/emergency rim light tint if passed
  if (ambientTint) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = ambientTint;
    ctx.beginPath();
    ctx.arc(0, 0, headW * 0.75, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// --- Bust / Half-Body for Talking-Head Documentary Layout ---
export function drawBust(ctx, pose = {}) {
  const {
    x = 960, y = 720, scale = 1,
    gesture = 'neutral', // 'neutral', 'explain_hand', 'point_left', 'point_right', 'chin_touch', 'hold_case'
    talk = 0,
    headPose = {}
  } = pose;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // 1. Shoulders & Blazer Torso
  ctx.fillStyle = PAL.blazer;
  ctx.beginPath();
  ctx.moveTo(-160, 220);
  ctx.quadraticCurveTo(-140, 110, -60, 85);
  ctx.lineTo(60, 85);
  ctx.quadraticCurveTo(140, 110, 160, 220);
  ctx.closePath();
  ctx.fill();

  // 2. Shirt V-Neck & Collar
  ctx.fillStyle = PAL.shirt;
  ctx.beginPath();
  ctx.moveTo(-35, 85);
  ctx.lineTo(0, 155);
  ctx.lineTo(35, 85);
  ctx.closePath();
  ctx.fill();

  // Red accent tie hint (Money Heist red reference)
  ctx.fillStyle = PAL.tieAccent;
  ctx.beginPath();
  ctx.moveTo(-9, 110);
  ctx.lineTo(9, 110);
  ctx.lineTo(14, 195);
  ctx.lineTo(0, 215);
  ctx.lineTo(-14, 195);
  ctx.closePath();
  ctx.fill();

  // 3. Blazer Lapels
  ctx.fillStyle = PAL.blazerLapel;
  ctx.beginPath();
  // Left Lapel
  ctx.moveTo(-60, 85);
  ctx.lineTo(-20, 175);
  ctx.lineTo(-65, 140);
  ctx.closePath();
  ctx.fill();

  // Right Lapel
  ctx.beginPath();
  ctx.moveTo(60, 85);
  ctx.lineTo(20, 175);
  ctx.lineTo(65, 140);
  ctx.closePath();
  ctx.fill();

  // Lapel pin: Small Gold Investigative Magnifier / Badge
  ctx.fillStyle = PAL.glassesFrame;
  ctx.beginPath();
  ctx.arc(-48, 125, 4.5, 0, TAU);
  ctx.fill();

  // 4. Arms & Gestures
  if (gesture === 'explain_hand') {
    // Left hand raised in palm-up explanatory gesture
    drawHand(ctx, -135, 60, { kind: 'open_palm', angle: 0.35, scale: 0.95 });
  } else if (gesture === 'point_right') {
    // Right hand pointing with index finger at evidence/chart
    drawHand(ctx, 160, 45, { kind: 'point', angle: -0.2, scale: 1.0 });
  } else if (gesture === 'chin_touch') {
    // Hand resting near chin (thoughtful investigation mode)
    drawHand(ctx, 42, 38, { kind: 'chin', angle: -1.2, scale: 0.9 });
  } else if (gesture === 'hold_case') {
    // Holding red Royal Mint dossier folder
    drawPropFolder(ctx, -140, 95);
    drawHand(ctx, -125, 105, { kind: 'grip', angle: 0, scale: 0.95 });
  }

  // 5. Head
  drawHead(ctx, { x: 0, y: 0, scale: 1.0, talk, ...headPose });

  ctx.restore();
}

// --- Detailed Hands (5 Fingers, Vector Joint Structure) ---
export function drawHand(ctx, x, y, {
  kind = 'open_palm', // 'open_palm', 'point', 'chin', 'grip', 'fist'
  angle = 0,
  scale = 1
} = {}) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  ctx.fillStyle = PAL.skin;
  ctx.strokeStyle = PAL.hairDark;
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (kind === 'point') {
    // Index finger extended forward, others curled
    ctx.beginPath();
    // Index finger
    ctx.rect(0, -7, 44, 12);
    // Curled fingers
    ctx.roundRect(-8, 5, 26, 22, 6);
    // Palm base
    ctx.roundRect(-24, -10, 24, 32, 8);
    // Thumb
    ctx.rect(-6, -18, 18, 11);
    ctx.fill();
    ctx.stroke();

    // Finger lines
    ctx.beginPath();
    ctx.moveTo(14, 5); ctx.lineTo(14, 25);
    ctx.stroke();
  } else if (kind === 'chin') {
    // Thoughtful chin hold (thumb and index forming a cradle)
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, TAU);
    ctx.roundRect(-12, -26, 14, 30, 6);
    ctx.roundRect(4, -18, 22, 12, 5);
    ctx.fill();
    ctx.stroke();
  } else if (kind === 'grip') {
    // Gripping prop / dossier
    ctx.beginPath();
    ctx.roundRect(-16, -16, 32, 32, 8);
    ctx.roundRect(10, -12, 14, 24, 6);
    ctx.fill();
    ctx.stroke();
  } else {
    // Open palm facing audience
    ctx.beginPath();
    // Palm
    ctx.roundRect(-20, -16, 38, 36, 10);
    // 4 fingers spread gently
    [-12, -4, 4, 12].forEach((fx, i) => {
      ctx.roundRect(fx - 4, -42 - (i === 1 ? 5 : i === 2 ? 3 : 0), 9, 30, 4);
    });
    // Thumb sticking out
    ctx.roundRect(-34, -4, 18, 10, 4);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

// --- Props for Investigative Scenarios ---
function drawPropFolder(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.15);

  // Red dossier folder (Money Heist case file)
  ctx.fillStyle = '#A31515';
  ctx.fillRect(-35, -45, 70, 90);

  ctx.lineWidth = 1.8;
  ctx.strokeStyle = '#600B0B';
  ctx.strokeRect(-35, -45, 70, 90);

  // White label strip
  ctx.fillStyle = '#F4EDE2';
  ctx.fillRect(-28, -32, 56, 24);

  // Stamp: "CONFIDENTIAL / TOP SECRET"
  ctx.fillStyle = '#801010';
  ctx.font = 'bold 7px monospace';
  ctx.fillText('FNMT - MADRID', -24, -20);
  ctx.fillText('PLAN EL PROFESOR', -24, -12);

  ctx.restore();
}

// --- Full Body Rendering for Situational Zack D. 2D Scenes ---
export function drawFullBody(ctx, pose = {}) {
  const {
    x = 960, y = 800, scale = 1,
    action = 'investigate_standing', // 'stand', 'investigate_standing', 'walk', 'crouch_examine'
    walkCycle = 0,
    headPose = {},
    shadow = true
  } = pose;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // 1. Dynamic Contact Shadow on Floor
  if (shadow) {
    ctx.save();
    ctx.fillStyle = 'rgba(10, 12, 16, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 85, 18, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  // 2. Legs & Feet
  ctx.fillStyle = PAL.trousers;
  ctx.strokeStyle = PAL.trousersShadow;
  ctx.lineWidth = 3;

  if (action === 'crouch_examine') {
    // Crouched down looking at vault door track / escape tunnel
    ctx.beginPath();
    ctx.roundRect(-45, -120, 36, 120, 12);
    ctx.roundRect(10, -100, 38, 100, 12);
    ctx.fill();
    ctx.stroke();

    // Shoes
    ctx.fillStyle = PAL.shoes;
    ctx.fillRect(-55, -10, 50, 18);
    ctx.fillRect(8, -10, 50, 18);
  } else {
    // Standing legs (subtle smart posture)
    ctx.beginPath();
    // Left leg
    ctx.roundRect(-42, -280, 34, 270, 8);
    // Right leg
    ctx.roundRect(8, -280, 34, 270, 8);
    ctx.fill();
    ctx.stroke();

    // Trouser crease
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.moveTo(-25, -260); ctx.lineTo(-25, -20);
    ctx.moveTo(25, -260); ctx.lineTo(25, -20);
    ctx.stroke();

    // Smart modern sneakers
    ctx.fillStyle = PAL.shoes;
    ctx.strokeStyle = PAL.shoesTrim;
    ctx.lineWidth = 2.2;

    // Left Shoe
    ctx.beginPath();
    ctx.roundRect(-52, -16, 48, 22, 6);
    ctx.fill(); ctx.stroke();
    // Right Shoe
    ctx.beginPath();
    ctx.roundRect(6, -16, 50, 22, 6);
    ctx.fill(); ctx.stroke();
  }

  // 3. Torso & Blazer Jacket
  ctx.save();
  ctx.translate(0, -360);

  ctx.fillStyle = PAL.blazer;
  ctx.beginPath();
  ctx.roundRect(-65, -80, 130, 175, 12);
  ctx.fill();

  // Shirt & Tie
  ctx.fillStyle = PAL.shirt;
  ctx.beginPath();
  ctx.moveTo(-22, -80); ctx.lineTo(0, -15); ctx.lineTo(22, -80);
  ctx.fill();

  ctx.fillStyle = PAL.tieAccent;
  ctx.beginPath();
  ctx.moveTo(-7, -50); ctx.lineTo(7, -50); ctx.lineTo(10, 15); ctx.lineTo(0, 25); ctx.lineTo(-10, 15);
  ctx.fill();

  // Belt
  ctx.fillStyle = '#111';
  ctx.fillRect(-60, 88, 120, 10);
  ctx.fillStyle = PAL.glassesFrame;
  ctx.fillRect(-12, 86, 24, 14);

  // Blazer buttons & seams
  ctx.strokeStyle = PAL.blazerShadow;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(0, -15); ctx.lineTo(0, 88);
  ctx.stroke();

  // 4. Arms
  if (action === 'investigate_standing') {
    // Left hand holding torch/flashlight or dossier, Right hand pointing
    drawHand(ctx, -75, 20, { kind: 'grip', angle: 0.2, scale: 0.85 });
    drawHand(ctx, 95, -20, { kind: 'point', angle: -0.4, scale: 0.85 });
  }

  // 5. Head
  drawHead(ctx, { x: 0, y: -140, scale: 0.95, ...headPose });

  ctx.restore();
  ctx.restore();
}
