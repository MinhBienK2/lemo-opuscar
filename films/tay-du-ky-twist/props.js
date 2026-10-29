// Paper props for the film, drawn at PPM px per metre and finished as cut-outs.
import { TAU, mulberry, clamp, lerp } from './lib.js';
import { cv, finishCut, sh, blob, smoothClosed, smoothOpen, crescent, INK, rr } from './paper.js';

export const PPM = 5200;
const LW = 9, LW2 = 5;

export function cut(wm, hm, draw, o = {}) {
  const pad = o.pad ?? 26, w = Math.ceil(wm * PPM) + pad * 2, h = Math.ceil(hm * PPM) + pad * 2;
  const c = cv(w, h), x = c.getContext('2d');
  x.save(); x.translate(pad, pad); draw(x, wm * PPM, hm * PPM); x.restore();
  const f = finishCut(c, o.border ?? 14, { grainA: o.grainA ?? .72, paper: o.paper, edge: o.edge });
  return { c: f, w: w / PPM, h: h / PPM, ax: o.ax ?? .5, ay: o.ay ?? 1 };
}

// ---------- scenery ----------
export function mountain(w, h, col, shade, seed = 1, o = {}) {
  return cut(w, h, (x, W, H) => {
    const R = mulberry(seed), n = o.pts || 9, pts = [];
    for (let i = 0; i <= n; i++) { const u = i / n; pts.push([u * W, H - H * (o.prof ? o.prof(u, R) : (.35 + .55 * Math.sin(u * Math.PI) * (.8 + R() * .2)))]); }
    pts.push([W, H], [0, H]);
    x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts) x.lineTo(p[0], p[1]); x.closePath();
    sh(x, col, LW);
    x.save(); x.clip(); x.fillStyle = shade;
    x.beginPath(); x.moveTo(W, 0); x.lineTo(W, H); x.lineTo(W * .55, H); x.closePath(); x.fill();
    x.restore();
    // ridge line
    x.beginPath(); x.moveTo(0, H); for (const p of pts.slice(0, n + 1)) x.lineTo(p[0], p[1]); x.lineWidth = LW2; x.strokeStyle = shade; x.stroke();
  }, { border: 14 });
}

export function pagoda(h) {
  const w = h * .55;
  return cut(w, h, (x, W, H) => {
    let y = H, ww = W * .92;
    for (let i = 0; i < 5; i++) {
      const bh = H * .13;
      x.beginPath(); x.rect(W / 2 - ww * .34, y - bh, ww * .68, bh); sh(x, '#e8dcc0', LW2 + 1);
      x.beginPath(); x.moveTo(W / 2 - ww * .55, y - bh); x.quadraticCurveTo(W / 2, y - bh - H * .09, W / 2 + ww * .55, y - bh);
      x.quadraticCurveTo(W / 2, y - bh - H * .045, W / 2 - ww * .55, y - bh); sh(x, '#b8322c', LW2 + 1);
      y -= bh + H * .035; ww *= .82;
    }
    x.beginPath(); x.moveTo(W / 2, 0); x.lineTo(W / 2 + 6, H * .09); x.lineTo(W / 2 - 6, H * .09); sh(x, '#c9a24a', 4);
  }, { border: 12 });
}

export function hall(w, h) {
  return cut(w, h, (x, W, H) => {
    // platform
    x.beginPath(); x.rect(W * .04, H * .78, W * .92, H * .2); sh(x, '#d9c9a8', LW2 + 1);
    // columns + wall
    x.beginPath(); x.rect(W * .14, H * .34, W * .72, H * .46); sh(x, '#f0e3c6', LW);
    for (let i = 0; i < 6; i++) { const px = W * (.16 + i * .135); x.beginPath(); x.rect(px, H * .36, W * .035, H * .43); sh(x, '#b8322c', 4); }
    // roof: two sweeping eaves
    const roof = () => {
      x.beginPath(); x.moveTo(W * .02, H * .36);
      x.quadraticCurveTo(W * .18, H * .2, W * .5, H * .12);
      x.quadraticCurveTo(W * .82, H * .2, W * .98, H * .36);
      x.quadraticCurveTo(W * .8, H * .3, W * .5, H * .28);
      x.quadraticCurveTo(W * .2, H * .3, W * .02, H * .36); x.closePath();
    };
    crescent(x, roof, '#7a6a1e', 10, 18, '#c9a24a'); roof(); sh(x, null, LW);
    x.beginPath(); x.moveTo(W * .5, H * .12); x.lineTo(W * .5, H * .04); x.lineWidth = 10; x.strokeStyle = INK; x.stroke();
    // door
    x.beginPath(); x.roundRect(W * .44, H * .5, W * .12, H * .3, 10); sh(x, '#5a3a2a', LW2 + 1);
  }, { border: 14 });
}

export function lotus(r) {
  return cut(r * 2, r * 1.1, (x, W, H) => {
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI * .9 + i / 6 * Math.PI * .8;
      x.save(); x.translate(W / 2, H * .8); x.rotate(a);
      x.beginPath(); x.ellipse(0, -H * .34, W * .07, H * .42, 0, 0, TAU); sh(x, i % 2 ? '#f6b8c8' : '#f9d0da', LW2);
      x.restore();
    }
    x.beginPath(); x.ellipse(W / 2, H * .82, W * .34, H * .12, 0, 0, TAU); sh(x, '#e8b23a', LW2);
  }, { border: 10 });
}

export function cloud(w, seed = 1) {
  return cut(w, w * .45, (x, W, H) => {
    const R = mulberry(seed);
    x.beginPath();
    for (let i = 0; i < 7; i++) { const px = W * (.1 + i * .13), py = H * (.55 + (R() - .5) * .2); x.moveTo(px + W * .09, py); x.arc(px, py, W * .1, 0, TAU); }
    x.moveTo(W * .05, H * .8); x.quadraticCurveTo(W * .5, H * .2, W * .95, H * .8); x.closePath();
    sh(x, '#fffaf0', LW2 + 1);
    x.beginPath(); x.moveTo(W * .08, H * .78); x.quadraticCurveTo(W * .5, H * .55, W * .92, H * .78); x.lineWidth = 4; x.strokeStyle = 'rgba(150,140,130,.35)'; x.stroke();
  }, { border: 12, ay: .6 });
}

export function sunDisc(r) {
  return cut(r * 2, r * 2, (x, W, H) => { x.beginPath(); x.arc(W / 2, H / 2, W * .42, 0, TAU); sh(x, '#ffd766', LW2 + 2); }, { border: 12 });
}

export function roadStrip(w, h = .055) {
  return cut(w, h, (x, W, H) => {
    x.beginPath(); x.roundRect(0, 0, W, H, 20); sh(x, '#e6c98e', LW2 + 1);
    const R = mulberry(4);
    for (let i = 0; i < w * 120; i++) { const px = R() * W, py = H * (.15 + R() * .7), r = 2 + R() * 5; x.beginPath(); x.arc(px, py, r, 0, TAU); x.fillStyle = R() < .5 ? '#c9a877' : '#f2ddb0'; x.fill(); }
    x.setLineDash([26, 30]); x.beginPath(); x.moveTo(10, H / 2); x.lineTo(W - 10, H / 2); x.lineWidth = 5; x.strokeStyle = 'rgba(120,90,50,.45)'; x.stroke(); x.setLineDash([]);
  }, { border: 8, ay: .5 });
}

export function register(w, h, marks = 80, seed = 2) {
  return cut(w, h, (x, W, H) => {
    x.beginPath(); x.roundRect(0, 0, W, H, 10); sh(x, '#f4ead4', LW2 + 1);
    x.beginPath(); x.moveTo(W / 2, 0); x.lineTo(W / 2, H); x.lineWidth = 8; x.strokeStyle = 'rgba(120,100,80,.35)'; x.stroke();
    // ruled columns
    for (let i = 0; i < marks; i++) {
      const col = i % 20, row = Math.floor(i / 20);
      const px = 26 + col * (W - 60) / 20, py = 30 + row * (H - 70) / 4;
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + 10, py + 26); x.lineWidth = 6; x.strokeStyle = 'rgba(60,55,60,.75)'; x.stroke();
      x.beginPath(); x.moveTo(px + 10, py); x.lineTo(px, py + 26); x.stroke();
    }
    // empty slot 81
    x.setLineDash([8, 8]); x.beginPath(); x.roundRect(26 + 20 * (W - 60) / 20 + 2, 30 + 4 * (H - 70) / 4 + 2, 18, 30, 4); x.lineWidth = 4; x.strokeStyle = 'rgba(184,50,44,.7)'; x.stroke(); x.setLineDash([]);
  }, { border: 10 });
}

export function scroll(w, h, blank = false) {
  return cut(w, h, (x, W, H) => {
    x.beginPath(); x.roundRect(W * .06, H * .18, W * .88, H * .64, 6); sh(x, blank ? '#fffdf6' : '#efe3c8', LW2);
    for (const s of [0, 1]) { x.beginPath(); x.roundRect(s ? W * .9 : 0, H * .1, W * .1, H * .8, 6); sh(x, '#b8322c', 5); }
    if (!blank) for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(W * .16, H * (.26 + i * .09)); x.lineTo(W * .8, H * (.26 + i * .09)); x.lineWidth = 4; x.strokeStyle = 'rgba(70,60,50,.5)'; x.stroke(); }
  }, { border: 10, ay: .5 });
}

export function bowl(r) {
  return cut(r * 2, r * 1.15, (x, W, H) => {
    x.beginPath(); x.moveTo(W * .08, H * .25); x.quadraticCurveTo(W * .5, H * .95, W * .92, H * .25); x.closePath(); sh(x, '#e8b23a', LW2 + 1);
    x.beginPath(); x.ellipse(W / 2, H * .25, W * .42, H * .1, 0, 0, TAU); sh(x, '#f6d98a', LW2);
    x.beginPath(); x.ellipse(W / 2, H * .25, W * .3, H * .06, 0, 0, TAU); sh(x, '#c99a2a', 4);
  }, { border: 12 });
}

export function tag(w, h, text = '') {
  return cut(w, h, (x, W, H) => {
    x.beginPath(); x.roundRect(0, 0, W, H, 8); sh(x, '#e0c98a', LW2);
    x.beginPath(); x.arc(W * .1, H / 2, H * .1, 0, TAU); x.fillStyle = '#8a6a3a'; x.fill();
    x.fillStyle = '#2a2030'; x.font = `700 ${H * .42}px Fredoka`; x.textAlign = 'left'; x.textBaseline = 'middle';
    x.fillText(text, W * .2, H * .54);
  }, { border: 10, ay: .5 });
}

export function stamp(r) {
  return cut(r * 2, r * 2, (x, W, H) => {
    x.save(); x.translate(W / 2, H / 2); x.rotate(-.12);
    x.beginPath(); x.arc(0, 0, W * .44, 0, TAU); x.lineWidth = 14; x.strokeStyle = '#b8322c'; x.stroke();
    x.beginPath(); x.arc(0, 0, W * .36, 0, TAU); x.lineWidth = 5; x.stroke();
    x.fillStyle = '#b8322c'; x.font = `800 ${W * .16}px "Be Vietnam Pro"`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('81', 0, 4);
    x.restore();
  }, { border: 10, paper: '#fffdf7' });
}

export function boat(w) {
  return cut(w, w * .38, (x, W, H) => {
    x.beginPath(); x.moveTo(W * .04, H * .55); x.quadraticCurveTo(W * .5, H * .95, W * .96, H * .55);
    x.quadraticCurveTo(W * .5, H * .72, W * .04, H * .55); sh(x, '#8a5a34', LW2 + 1);
    x.beginPath(); x.moveTo(W * .5, H * .55); x.lineTo(W * .5, H * .04); x.lineWidth = 10; x.strokeStyle = INK; x.stroke();
    x.beginPath(); x.moveTo(W * .5, H * .08); x.quadraticCurveTo(W * .72, H * .18, W * .6, H * .5); x.quadraticCurveTo(W * .55, H * .3, W * .5, H * .08); sh(x, '#f4ead4', LW2);
  }, { border: 12, ay: .8 });
}

export function waveStrip(w, h, col = '#7fb8c8', seed = 3) {
  return cut(w, h, (x, W, H) => {
    const R = mulberry(seed);
    x.beginPath(); x.moveTo(0, H);
    for (let i = 0; i <= 12; i++) x.lineTo(W * i / 12, H * (.35 + .3 * Math.sin(i * 1.1 + R())));
    x.lineTo(W, H); x.closePath(); sh(x, col, LW2 + 1);
    x.beginPath(); x.moveTo(0, H * .55); for (let i = 0; i <= 12; i++) x.lineTo(W * i / 12, H * (.5 + .22 * Math.sin(i * 1.3 + R()))); x.lineWidth = 5; x.strokeStyle = 'rgba(255,255,255,.5)'; x.stroke();
  }, { border: 8, ay: .6 });
}

export function turtle(w) {
  return cut(w, w * .62, (x, W, H) => {
    x.beginPath(); x.ellipse(W * .5, H * .55, W * .4, H * .3, 0, 0, TAU); sh(x, '#7a8a5a', LW2 + 1);
    x.beginPath(); x.arc(W * .1, H * .5, W * .09, 0, TAU); sh(x, '#8fa06a', LW2 + 1);
    for (const s of [0, 1]) { x.beginPath(); x.ellipse(W * (.3 + s * .4), H * .86, W * .1, H * .1, 0, 0, TAU); sh(x, '#6a7a4a', 5); }
    // shell pattern
    x.beginPath(); x.ellipse(W * .5, H * .55, W * .26, H * .18, 0, 0, TAU); x.lineWidth = 5; x.strokeStyle = 'rgba(50,60,40,.55)'; x.stroke();
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; x.beginPath(); x.moveTo(W * .5 + Math.cos(a) * W * .26, H * .55 + Math.sin(a) * H * .18); x.lineTo(W * .5 + Math.cos(a) * W * .4, H * .55 + Math.sin(a) * H * .3); x.stroke(); }
  }, { border: 12 });
}

export function shelf(w, h) {
  return cut(w, h, (x, W, H) => {
    x.beginPath(); x.rect(0, H * .12, W, H * .1); sh(x, '#8a5a34', LW2 + 1);
    x.beginPath(); x.rect(0, H * .62, W, H * .1); sh(x, '#8a5a34', LW2 + 1);
    for (const px of [.04, .96]) { x.beginPath(); x.rect(W * px - W * .02, H * .1, W * .04, H * .64); sh(x, '#6b4326', LW2 + 1); }
    // brass label
    x.beginPath(); x.roundRect(W * .38, H * .72, W * .24, H * .1, 6); sh(x, '#e0c98a', 5);
    x.fillStyle = '#3a2a24'; x.font = `700 ${H * .06}px Fredoka`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('KHO DIỄN VIÊN', W * .5, H * .77);
  }, { border: 12 });
}

export function gate(w, h) {
  return cut(w, h, (x, W, H) => {
    for (const px of [.06, .9]) { x.beginPath(); x.rect(W * px, H * .18, W * .05, H * .82); sh(x, '#b8322c', LW2 + 1); }
    const roof = () => { x.beginPath(); x.moveTo(0, H * .2); x.quadraticCurveTo(W * .5, H * .02, W, H * .2); x.quadraticCurveTo(W * .5, H * .12, 0, H * .2); x.closePath(); };
    crescent(x, roof, '#8a6a1e', 8, 14, '#c9a24a'); roof(); sh(x, null, LW);
    x.beginPath(); x.roundRect(W * .34, H * .3, W * .32, H * .2, 6); sh(x, '#2a2030', 5);
    x.fillStyle = '#e0c98a'; x.font = `800 ${H * .12}px "Be Vietnam Pro"`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('LINH SƠN', W * .5, H * .41);
  }, { border: 12 });
}

export function band(r) {
  return cut(r * 2, r * .7, (x, W, H) => {
    x.beginPath(); x.arc(W / 2, H * .6, W * .4, Math.PI * 1.1, Math.PI * 1.9); x.lineWidth = 26; x.strokeStyle = '#e0b456'; x.stroke();
    x.lineWidth = 6; x.strokeStyle = INK; x.stroke();
    for (let i = 0; i < 5; i++) { const a = Math.PI * (1.15 + i * .15); x.beginPath(); x.arc(W / 2 + Math.cos(a) * W * .4, H * .6 + Math.sin(a) * W * .4, 7, 0, TAU); x.fillStyle = '#b8322c'; x.fill(); }
  }, { border: 10 });
}

export function corpse(w) {
  return cut(w, w * .4, (x, W, H) => {
    x.save(); x.translate(W * .5, H * .5); x.rotate(.08);
    x.beginPath(); x.ellipse(0, 0, W * .34, H * .2, 0, 0, TAU); sh(x, '#cfc6b4', LW2 + 1);
    x.beginPath(); x.arc(-W * .32, 0, W * .12, 0, TAU); sh(x, '#d8cfbc', LW2 + 1);
    x.beginPath(); x.moveTo(-W * .36, -H * .04); x.lineTo(-W * .42, H * .02); x.lineWidth = 6; x.strokeStyle = INK; x.stroke();
    x.beginPath(); x.arc(-W * .34, -H * .02, 3, 0, TAU); x.fillStyle = INK; x.fill();
    x.beginPath(); x.arc(-W * .29, -H * .02, 3, 0, TAU); x.fill();
    x.restore();
  }, { border: 10, ay: .5 });
}

export function card(w, h, text, col = '#f4ead4', ink = '#2a2030', size = .34) {
  return cut(w, h, (x, W, H) => {
    x.beginPath(); x.roundRect(0, 0, W, H, 12); sh(x, col, LW2 + 1);
    x.fillStyle = ink; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `800 ${H * size}px "Be Vietnam Pro"`;
    const words = text.split('\n');
    words.forEach((ln, i) => x.fillText(ln, W / 2, H * (.5 + (i - (words.length - 1) / 2) * .42)));
  }, { border: 12 });
}

export function tear(w, h) {
  return cut(w, h, (x, W, H) => {
    const R = mulberry(17);
    x.beginPath(); x.moveTo(0, H);
    for (let i = 0; i <= 16; i++) x.lineTo(W * i / 16, H * .5 + (R() - .5) * H * .5);
    x.lineTo(W, H); x.closePath(); sh(x, '#fffdf7', 5);
  }, { border: 0, grain: false });
}
