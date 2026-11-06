// Toon materials, seeded canvas textures, geometry helpers, easing. Everything is a pure function of its inputs.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const PAL = {
  cream: '#fff0d8', mustard: '#f7bd27', navy: '#252d50', purple: '#9a5be5',
  red: '#f04462', cyan: '#67e8f9', ink: '#171a2b', orange: '#ff8a3d',
};

// ── math ────────────────────────────────────────────────────────────────
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ss = t => { t = clamp(t); return t * t * (3 - 2 * t); };
export const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const eo = t => 1 - Math.pow(1 - clamp(t), 3);
export const ei = t => Math.pow(clamp(t), 3);
export const back = (t, s = 1.7) => { t = clamp(t) - 1; return 1 + t * t * ((s + 1) * t + s); };
export function mulberry(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
export const vnoise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u); };

// keyframed value: keys = [[t, value(number|array)], ...], eased per segment with `ease`
export function keys(K, ease = eio) {
  return t => {
    if (t <= K[0][0]) return K[0][1];
    for (let i = 0; i < K.length - 1; i++) {
      const [t0, a] = K[i], [t1, b, e] = K[i + 1];
      if (t <= t1) {
        const u = (e || ease)((t - t0) / (t1 - t0));
        return Array.isArray(a) ? a.map((v, j) => lerp(v, b[j], u)) : lerp(a, b, u);
      }
    }
    return K[K.length - 1][1];
  };
}

// ── toon material ───────────────────────────────────────────────────────
function gradientMap(steps) {
  const d = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => { const c = Math.round(v * 255); d.set([c, c, c, 255], i * 4); });
  const t = new THREE.DataTexture(d, steps.length, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
}
export const GRAD = gradientMap([0.22, 0.5, 0.78, 1.0]);
export const GRAD3 = gradientMap([0.3, 0.68, 1.0]);

export function toon(color, o = {}) {
  const { grad, ...rest } = o;
  return new THREE.MeshToonMaterial({ color, gradientMap: grad || GRAD, ...rest });
}
export function glowMat(color, k = 3, o = {}) {
  const c = new THREE.Color(color).multiplyScalar(k);
  return new THREE.MeshBasicMaterial({ color: c, toneMapped: false, ...o });
}

// ── procedural canvas textures (seeded) ─────────────────────────────────
export function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  if (repeat) t.repeat.set(...repeat);
  return t;
}
export const TEX = {
  floor: () => canvasTex(1024, 1024, (g, w, h) => {
    const r = mulberry(11);
    const tones = ['#8a5634', '#7b4a2c', '#94603a', '#83512f'];
    const pw = w / 6;
    for (let i = 0; i < 6; i++) {
      let y = -r() * 300;
      while (y < h) {
        const len = 260 + r() * 300;
        g.fillStyle = tones[(r() * 4) | 0]; g.fillRect(i * pw, y, pw, len);
        for (let k = 0; k < 14; k++) { // grain
          g.strokeStyle = `rgba(60,30,15,${.08 + r() * .12})`; g.lineWidth = 1 + r() * 2;
          const x = i * pw + r() * pw; g.beginPath(); g.moveTo(x, y);
          g.bezierCurveTo(x + (r() - .5) * 12, y + len * .3, x + (r() - .5) * 12, y + len * .6, x + (r() - .5) * 6, y + len); g.stroke();
        }
        g.fillStyle = 'rgba(23,26,43,.85)'; g.fillRect(i * pw, y, pw, 4);
        y += len;
      }
      g.fillStyle = 'rgba(23,26,43,.85)'; g.fillRect(i * pw, 0, 4, h);
    }
  }),
  wood: () => canvasTex(512, 512, (g, w, h) => {
    const r = mulberry(5); g.fillStyle = '#b06d3c'; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 70; k++) {
      g.strokeStyle = `rgba(${90 + r() * 30},${45 + r() * 15},20,${.15 + r() * .25})`; g.lineWidth = 1 + r() * 3;
      const y = r() * h; g.beginPath(); g.moveTo(0, y);
      for (let x = 0; x <= w; x += 32) g.lineTo(x, y + Math.sin(x * .02 + k) * 6 + (r() - .5) * 3); g.stroke();
    }
    for (let k = 0; k < 3; k++) { // knots
      const x = r() * w, y = r() * h; for (let j = 5; j > 0; j--) { g.strokeStyle = 'rgba(80,40,18,.35)'; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, j * 7, j * 3, 0, 0, 7); g.stroke(); }
    }
  }),
  wall: () => canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#c6b49a'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 64) { g.fillStyle = 'rgba(255,240,216,.22)'; g.fillRect(x, 0, 22, h); }
    const r = mulberry(3);
    for (let y = 32; y < h; y += 128) for (let x = 43; x < w; x += 64) {
      const yy = y + ((x / 64) % 2) * 64; g.fillStyle = 'rgba(154,91,229,.18)';
      g.beginPath(); for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + .3; g.ellipse(x + Math.cos(a) * 6, yy + Math.sin(a) * 6, 6, 3, a, 0, 7); } g.fill();
    }
    for (let k = 0; k < 4000; k++) { g.fillStyle = `rgba(40,30,20,${r() * .05})`; g.fillRect(r() * w, r() * h, 2, 2); }
  }),
  sheet: () => canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#e9e2d6'; g.fillRect(0, 0, w, h);
    const r = mulberry(8);
    for (let k = 0; k < 9000; k++) { g.fillStyle = `rgba(60,60,90,${r() * .06})`; g.fillRect(r() * w, r() * h, 3, 1); }
  }),
  pillow: () => canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#fff0d8'; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 64) { g.fillStyle = 'rgba(103,140,220,.28)'; g.fillRect(0, y, w, 14); g.fillStyle = 'rgba(103,140,220,.12)'; g.fillRect(0, y + 24, w, 5); }
    const r = mulberry(9); for (let k = 0; k < 6000; k++) { g.fillStyle = `rgba(60,50,40,${r() * .05})`; g.fillRect(r() * w, r() * h, 2, 2); }
  }),
  blanket: () => canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#e0a82a'; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 128) { g.fillStyle = 'rgba(160,80,20,.35)'; g.fillRect(x, 0, 40, h); g.fillRect(0, x, w, 40); }
    for (let x = 0; x < w; x += 128) { g.fillStyle = 'rgba(255,240,216,.35)'; g.fillRect(x + 60, 0, 6, h); g.fillRect(0, x + 60, w, 6); }
    const r = mulberry(2); for (let k = 0; k < 12000; k++) { g.fillStyle = `rgba(80,40,10,${r() * .1})`; g.fillRect(r() * w, r() * h, 2, 1); }
  }),
  rug: () => canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#5b3d8f'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#f7bd27'; g.lineWidth = 10; g.strokeRect(30, 30, w - 60, h - 60);
    g.strokeStyle = '#fff0d8'; g.lineWidth = 4; g.strokeRect(52, 52, w - 104, h - 104);
    g.fillStyle = 'rgba(247,189,39,.6)';
    for (let y = 120; y < h - 100; y += 70) for (let x = 120; x < w - 100; x += 70) { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillRect(-9, -9, 18, 18); g.restore(); }
    const r = mulberry(4); for (let k = 0; k < 15000; k++) { g.fillStyle = `rgba(20,10,40,${r() * .15})`; g.fillRect(r() * w, r() * h, 1, 3); }
  }),
  screen: () => canvasTex(256, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffcf7a'); gr.addColorStop(.55, '#ff9a6a'); gr.addColorStop(1, '#9a5be5');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,240,216,.9)'; g.fillRect(60, 90, 136, 44); // clock block
    g.fillStyle = 'rgba(255,240,216,.6)'; g.fillRect(84, 146, 88, 10);
    // charging bolt
    g.fillStyle = '#fff6e6'; g.beginPath(); g.moveTo(140, 280); g.lineTo(100, 350); g.lineTo(128, 350); g.lineTo(112, 410); g.lineTo(158, 330); g.lineTo(130, 330); g.lineTo(148, 280); g.fill();
    g.strokeStyle = 'rgba(255,240,216,.7)'; g.lineWidth = 6; g.beginPath(); g.arc(128, 345, 78, 0, 7); g.stroke();
  }),
  radial: (inner = 'rgba(255,255,255,1)') => canvasTex(256, 256, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, inner); gr.addColorStop(.4, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }),
};

// ── geometry ────────────────────────────────────────────────────────────
export const rbox = (w, h, d, r = .02, s = 3) => new RoundedBoxGeometry(w, h, d, s, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4));
export function mesh(geo, mat, pos = [0, 0, 0], o = {}) {
  const m = new THREE.Mesh(geo, mat); m.position.set(...pos);
  if (o.rot) m.rotation.set(...o.rot);
  m.castShadow = o.cast !== false; m.receiveShadow = o.recv !== false;
  if (o.parent) o.parent.add(m);
  return m;
}
// glow-only things live on layer 1 (skipped by the ink pass' normal render)
export function fxLayer(o) { o.traverse(c => { c.layers.set(1); c.castShadow = false; c.receiveShadow = false; }); return o; }

// soft cushion (pillow, bag, sofa seat): squashed superellipsoid; `lift` raises one side of the underside (resting on something)
export function cushionGeo(L = .9, T = .22, D = .52, lift = 0) {
  const g = new THREE.SphereGeometry(1, 64, 32);
  const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const sx = Math.sign(v.x) * Math.pow(Math.abs(v.x), .38), sz = Math.sign(v.z) * Math.pow(Math.abs(v.z), .38);
    const puff = (1 - .55 * Math.pow(Math.abs(sx), 3)) * (1 - .55 * Math.pow(Math.abs(sz), 3));
    let y = v.y * T * .5 * puff;
    const x = sx * L * .5, z = sz * D * .5;
    // seam wrinkles and corner dents
    y += .006 * Math.sin(x * 40 + z * 13) * (1 - Math.abs(v.y));
    if (v.y < .2 && lift) y += lift * ss((sx - .15) / .7) * (1 - .35 * sz * sz);
    p.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals(); return g;
}

// a grid surface from a function f(u,v) -> [x,y,z], u,v in 0..1
export function surface(nu, nv, f) {
  const g = new THREE.PlaneGeometry(1, 1, nu, nv);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) { const [x, y, z] = f(uv.getX(i), uv.getY(i)); p.setXYZ(i, x, y, z); }
  g.computeVertexNormals(); return g;
}
