// core/cast/cast.mjs — the cast module.
//
// One spec per character, one pose model, one set of numbers. The two adapters
// (adapter-2d.mjs draws on a 2D canvas, adapter-3d.mjs builds in three.js) sit at
// the seam: they read the same spec and the same pose and show the same person.
//
// Nothing about a character lives in an adapter. What lives here:
//   · the spec: what a character is (readSpec / parseSpec / loadSpec)
//   · the geometry: the numbers both adapters draw (metrics)
//   · the colour logic: the palette both adapters fill (palette)
//   · the pose model: the named parameters a character can be posed with
//     (POSE_FIELDS, defaultPose, createPose, mixPose) and the face table both
//     adapters read (EXPRESSIONS, faceOf)
//   · a deterministic pose over time (poseAt), so a page can animate a character
//     without knowing anything about it.
//
// Units: the module measures in "head units" — one unit is the character's head
// diameter (proportions.head). A unit is UNIT_METERS metres long in the world,
// which is what the 3D adapter uses to build a figure of a human size.

export const UNIT_METERS = 0.28;          // one head diameter, in metres

export const HAIR_STYLES = ['bob', 'short'];
export const EYE_STYLES = ['round', 'oval'];
export const MOUTH_STYLES = ['small', 'wide'];

const HEX = /^#[0-9a-fA-F]{6}$/;

// ———————————————————————————————————————————————————————— the spec

// The spec is the character. It is a small, fixed shape; a typo in it must fail
// loudly here rather than draw a wrong character in two renderers at once.
export function readSpec(spec) {
  if (!spec || typeof spec !== 'object') throw new Error('cast spec: must be an object');
  const name = String(spec.name ?? '').trim();
  if (!name) throw new Error('cast spec: "name" is missing');
  const pal = spec.palette ?? {};
  for (const k of ['skin', 'hair', 'hoodie']) {
    const v = pal[k];
    if (typeof v !== 'string' || !HEX.test(v)) throw new Error(`cast spec: palette.${k} must be "#RRGGBB"`);
  }
  const pr = spec.proportions ?? {};
  const pos = (v, where) => {
    if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) throw new Error(`cast spec: proportions.${where} must be a positive number`);
    return v;
  };
  const head = pos(pr.head, 'head'), body = pos(pr.body, 'body'), limb = pos(pr.limb, 'limb');
  const hair = spec.hair ?? {};
  if (!HAIR_STYLES.includes(hair.style)) throw new Error(`cast spec: hair.style must be one of ${HAIR_STYLES.join(', ')}`);
  const length = Number(hair.length);
  if (!Number.isFinite(length) || length < 0 || length > 2) throw new Error('cast spec: hair.length must be a number in [0, 2]');
  const face = spec.face ?? {};
  if (!EYE_STYLES.includes(face.eyes)) throw new Error(`cast spec: face.eyes must be one of ${EYE_STYLES.join(', ')}`);
  if (!MOUTH_STYLES.includes(face.mouth)) throw new Error(`cast spec: face.mouth must be one of ${MOUTH_STYLES.join(', ')}`);
  return {
    name,
    palette: { skin: pal.skin, hair: pal.hair, hoodie: pal.hoodie },
    proportions: { head, body, limb },
    hair: { style: hair.style, length },
    face: { eyes: face.eyes, mouth: face.mouth },
  };
}

export function parseSpec(text) {
  let raw;
  try { raw = JSON.parse(text); } catch (e) { throw new Error(`cast spec: not valid JSON (${e.message})`); }
  return readSpec(raw);
}

// Fetch a spec from the page's own server (the repository root is the root).
export async function loadSpec(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`cast spec: ${url} → HTTP ${r.status}`);
  return readSpec(await r.json());
}

// ———————————————————————————————————————————————————————— colour

export function mixHex(a, b, t) {
  const pa = parseHex(a), pb = parseHex(b);
  const c = i => Math.round(pa[i] + (pb[i] - pa[i]) * t).toString(16).padStart(2, '0');
  return `#${c(0)}${c(1)}${c(2)}`;
}

// k > 0 lightens towards white, k < 0 darkens towards black.
export function shade(hex, k) {
  return k >= 0 ? mixHex(hex, '#ffffff', k) : mixHex(hex, '#000000', -k);
}

function parseHex(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

// The palette of the library's cel look: one ink line, flat fills, a shaded
// step of every colour, and the trousers derived from the hoodie.
export function palette(spec) {
  const s = readSpec(spec), P = s.palette;
  return {
    skin: P.skin, skinShade: shade(P.skin, -0.16), skinLight: shade(P.skin, 0.16),
    hair: P.hair, hairShade: shade(P.hair, -0.24), hairLight: shade(P.hair, 0.18),
    hoodie: P.hoodie, hoodieShade: shade(P.hoodie, -0.26), hoodieLight: shade(P.hoodie, 0.18),
    pants: mixHex(P.hoodie, '#1D202A', 0.66),
    ink: '#1D202A',
    white: '#FAF8F5',
    blush: '#F2A0A0',
  };
}

// ———————————————————————————————————————————————————————— geometry

// The numbers both adapters draw. One head unit = proportions.head.
//
// proportions.head    the head's diameter, in head units (1.0 = the same size)
// proportions.body    the height of the body under the head, in head units:
//                      2.6 gives a figure of about three and a half heads
// proportions.limb    the scale of the arms and legs against that body
export function metrics(spec) {
  const s = readSpec(spec);
  const u = s.proportions.head;                      // head diameter
  const bodyH = s.proportions.body * s.proportions.limb;
  const neck = 0.12 * u;
  const torso = bodyH * 0.38;                        // shoulder → hip
  const leg = bodyH * 0.62;                          // hip → ankle
  const arm = bodyH * 0.38;                          // shoulder → wrist
  const shoulderHalf = 0.62 * u;
  const hipHalf = 0.44 * u;
  const hairDrop = s.hair.length * 1.2 * u;           // how far the hair falls below the head's centre
  const thighR = 0.15 * u, shinR = 0.12 * u;
  const upperR = 0.13 * u, foreR = 0.11 * u;
  const thighLen = Math.max(0.2, leg - 2 * (thighR + shinR)) * 0.52;
  const shinLen = Math.max(0.2, leg - 2 * (thighR + shinR)) * 0.48;
  const upperLen = Math.max(0.2, arm - 2 * (upperR + foreR)) * 0.53;
  const foreLen = Math.max(0.2, arm - 2 * (upperR + foreR)) * 0.47;
  const hipY = leg, shoulderY = leg + torso;
  return {
    u, headD: u, headR: u / 2,
    torso, arm, leg, bodyH, neck, shoulderHalf, hipHalf, hairDrop,
    thighR, shinR, upperR, foreR, thighLen, shinLen, upperLen, foreLen,
    ankleY: 0, kneeY: leg * 0.5, hipY, shoulderY,
    neckY: shoulderY + neck, headCY: shoulderY + neck + u / 2,
    total: u + neck + bodyH,
    eyeR: (s.face.eyes === 'oval' ? 0.105 : 0.115) * u,
    eyeDX: 0.21 * u, eyeDY: 0.04 * u,
    mouthW: (s.face.mouth === 'wide' ? 0.22 : 0.16) * u, mouthDY: -0.26 * u,
    eyeStyle: s.face.eyes, mouthStyle: s.face.mouth, hairStyle: s.hair.style,
  };
}

// ———————————————————————————————————————————————————————— the pose

// A pose is a set of named parameters. Both adapters read exactly these names.
export const POSE_FIELDS = [
  { key: 'body', kind: 'number', min: -35, max: 35, def: 0, unit: 'deg', what: 'how far the body turns (positive = to the right)' },
  { key: 'head', kind: 'number', min: -25, max: 25, def: 0, unit: 'deg', what: 'the head tilt (positive = to the right)' },
  { key: 'armSwing', kind: 'number', min: -1, max: 1, def: 0, unit: '', what: 'the arm swing (-1 = behind, +1 = in front)' },
  { key: 'legStance', kind: 'number', min: -1, max: 1, def: 0, unit: '', what: 'the leg stance (-1 = together, +1 = apart)' },
  { key: 'expression', kind: 'enum', values: ['neutral', 'smile', 'think', 'surprise', 'worry'], def: 'neutral', unit: '', what: 'the face' },
];

export function defaultPose() {
  const p = {};
  for (const f of POSE_FIELDS) p[f.key] = f.def;
  return p;
}

// Fill in the missing parameters, clamp the numbers, refuse an unknown face.
export function createPose(partial) {
  const p = defaultPose(), src = partial ?? {};
  for (const f of POSE_FIELDS) {
    if (src[f.key] === undefined || src[f.key] === null) continue;
    if (f.kind === 'enum') {
      if (!f.values.includes(src[f.key])) throw new Error(`cast pose: expression "${src[f.key]}" is not one of ${f.values.join(', ')}`);
      p[f.key] = src[f.key];
    } else {
      const v = Number(src[f.key]);
      if (!Number.isFinite(v)) throw new Error(`cast pose: ${f.key} must be a number`);
      p[f.key] = Math.min(f.max, Math.max(f.min, v));
    }
  }
  return p;
}

// Two poses, one t between them.
export function mixPose(a, b, t) {
  const A = createPose(a), B = createPose(b), u = Math.min(1, Math.max(0, t));
  const out = {};
  for (const f of POSE_FIELDS) out[f.key] = f.kind === 'enum' ? (u < 0.5 ? A[f.key] : B[f.key]) : A[f.key] + (B[f.key] - A[f.key]) * u;
  return out;
}

// ———————————————————————————————————————————————————————— the face

// The face is a table of numbers, shared: the 2D adapter draws it, the 3D adapter
// builds it. brows are in degrees, lid is 0 (open) … 1 (closed), look is a pupil
// offset, smile is the mouth's curve, mouthOpen its height.
export const EXPRESSIONS = {
  neutral: { browL: 0, browR: 0, browY: 0, lid: 0, lookX: 0, lookY: 0, smile: 0, mouthOpen: 0, blush: 0 },
  smile: { browL: -3, browR: -3, browY: 2, lid: 0.12, lookX: 0, lookY: 0, smile: 0.85, mouthOpen: 0, blush: 0.20 },
  think: { browL: -7, browR: 3, browY: 4, lid: 0.18, lookX: 0.5, lookY: -0.45, smile: -0.10, mouthOpen: 0, blush: 0 },
  surprise: { browL: -9, browR: -9, browY: 7, lid: -0.20, lookX: 0, lookY: 0, smile: 0, mouthOpen: 0.55, blush: 0 },
  worry: { browL: -8, browR: 5, browY: 5, lid: 0.22, lookX: -0.3, lookY: 0.25, smile: -0.45, mouthOpen: 0.05, blush: 0 },
};

export function faceOf(pose) {
  const p = createPose(pose);
  return { ...EXPRESSIONS[p.expression] };
}

// ———————————————————————————————————————————————————————— the pose over time

// The channel's rest pose, keyframed. The last keyframe repeats the first, so
// the loop closes. poseAt() is a pure function of t: the same second always gives
// the same pose, in both adapters.
const REST = [
  { t: 0.0, body: 0, head: 0, armSwing: -0.9, legStance: -0.3, expression: 'neutral' },
  { t: 1.5, body: 14, head: 8, armSwing: 0.9, legStance: 0.4, expression: 'smile' },
  { t: 3.0, body: -8, head: -6, armSwing: 0.2, legStance: 0.1, expression: 'think' },
  { t: 4.5, body: 6, head: -4, armSwing: -0.4, legStance: -0.2, expression: 'surprise' },
  { t: 6.0, body: -14, head: 5, armSwing: 0.5, legStance: 0.3, expression: 'worry' },
  { t: 7.5, body: 0, head: 0, armSwing: -0.6, legStance: -0.1, expression: 'neutral' },
  { t: 10.0, body: 0, head: 0, armSwing: -0.9, legStance: -0.3, expression: 'neutral' },
];

export const REST_LOOP = REST[REST.length - 1].t;

export function poseAt(t, { loop = REST_LOOP } = {}) {
  const T = ((Number(t) % loop) + loop) % loop;
  let i = 0;
  while (i < REST.length - 2 && REST[i + 1].t <= T) i++;
  const a = REST[i], b = REST[i + 1];
  const u = Math.min(1, Math.max(0, (T - a.t) / (b.t - a.t)));
  const s = u * u * (3 - 2 * u);                       // smoothstep between the keys
  const out = {};
  for (const f of POSE_FIELDS) {
    out[f.key] = f.kind === 'enum' ? a[f.key] : a[f.key] + (b[f.key] - a[f.key]) * s;
  }
  return createPose(out);
}
