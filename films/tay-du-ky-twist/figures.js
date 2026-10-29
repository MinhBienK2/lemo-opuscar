// Flat cut-paper figures for the film: a generic person drawer + the cast of the novel.
import { TAU, mulberry } from './lib.js';
import { cv, finishCut, sh, blob, crescent, INK } from './paper.js';

const LW = 9, LW2 = 5;
export const FW = 900, FH = 1160;

const P = {
  monk:  { robe: '#e8b23a', robeS: '#c08c1e', trim: '#b8322c', skin: '#ffe2bd', skinS: '#f3c393', hair: null },
  monkey:{ robe: '#c0562e', robeS: '#8e3a1e', trim: '#f0c040', skin: '#e8b98a', skinS: '#cf9a63', hair: '#6b4226' },
  pig:   { robe: '#7f8fa6', robeS: '#5f6d82', trim: '#e8d8b0', skin: '#ffc9cf', skinS: '#eda6b0', hair: null },
  sand:  { robe: '#3f6f7a', robeS: '#2b4f58', trim: '#d8c79a', skin: '#c98f5e', skinS: '#a86f45', hair: '#2b2320' },
  guan:  { robe: '#f6f1e4', robeS: '#d9cfb8', trim: '#7fb8c8', skin: '#ffe6c8', skinS: '#f0c8a0', hair: '#241d24' },
  buddha:{ robe: '#d9a02a', robeS: '#a8761a', trim: '#b8322c', skin: '#f3cf6a', skinS: '#d3a83e', hair: '#2a2030' },
  laozi: { robe: '#7d93b8', robeS: '#5b7093', trim: '#efe6d0', skin: '#f0d3ad', skinS: '#d8b184', hair: '#f2efe8' },
  demon: { robe: '#6a3a63', robeS: '#4a2645', trim: '#c9a24a', skin: '#9fbf6a', skinS: '#7d9a4c', hair: '#2b1f2b' },
  official:{ robe:'#8f2f2f', robeS:'#6b2020', trim:'#e0b456', skin:'#f0cf9f', skinS:'#d3ab77', hair:'#241d24' },
  attend:{ robe: '#d97a2a', robeS: '#a8581a', trim: '#f0d090', skin: '#f3d2a8', skinS: '#d6ae80', hair: null },
};

function eyes(x, cx, cy, p, dx = 0) {
  const { eyes: e = 'open', blink = 0, look = [0, 0] } = p;
  for (const s of [-1, 1]) {
    const ex = cx + s * dx;
    if (e === 'happy') { x.beginPath(); x.moveTo(ex - 22, cy + 6); x.quadraticCurveTo(ex, cy - 28, ex + 22, cy + 6); x.lineWidth = 9; x.strokeStyle = INK; x.lineCap = 'round'; x.stroke(); continue; }
    if (e === 'closed' || blink > .85) { x.beginPath(); x.moveTo(ex - 20, cy + 2); x.quadraticCurveTo(ex, cy + 12, ex + 20, cy + 2); x.lineWidth = 8; x.strokeStyle = INK; x.stroke(); continue; }
    const ry = 30 * (e === 'wide' ? 1.25 : 1) * (1 - blink * .92);
    x.beginPath(); x.ellipse(ex + look[0] * 7, cy + look[1] * 8, 15, ry, 0, 0, TAU); x.fillStyle = INK; x.fill();
    if (ry > 12) { x.beginPath(); x.ellipse(ex + look[0] * 7 - 5, cy + look[1] * 8 - ry * .4, 5, 8, 0, 0, TAU); x.fillStyle = '#fff'; x.fill(); }
  }
}
function mouth(x, cx, cy, m = 'smile', w = 1) {
  x.lineCap = 'round'; x.strokeStyle = INK;
  if (m === 'smile') { x.beginPath(); x.moveTo(cx - 26 * w, cy); x.quadraticCurveTo(cx, cy + 22, cx + 26 * w, cy); x.lineWidth = 8; x.stroke(); }
  else if (m === 'open' || m === 'grin') { const h = m === 'grin' ? 26 : 34; x.beginPath(); x.moveTo(cx - 30 * w, cy - 4); x.quadraticCurveTo(cx, cy + h, cx + 30 * w, cy - 4); x.closePath(); sh(x, '#8a2a2a', 6); }
  else if (m === 'o') { x.beginPath(); x.ellipse(cx, cy + 6, 12, 16, 0, 0, TAU); sh(x, '#8a2a2a', 6); }
  else if (m === 'worried') { x.beginPath(); x.moveTo(cx - 24 * w, cy + 6); x.quadraticCurveTo(cx, cy - 4, cx + 24 * w, cy + 6); x.lineWidth = 7; x.stroke(); }
  else if (m === 'flat') { x.beginPath(); x.moveTo(cx - 22 * w, cy + 2); x.lineTo(cx + 22 * w, cy + 2); x.lineWidth = 7; x.stroke(); }
}

// p: {kind, armL, armR, walk, stride, face:'front'|'back', prop, hat, mouth, eyes, blink, look, lean, robe, skin}
export function drawFigure(x, p = {}) {
  const k = p.kind || 'monk', C = { ...P[k], ...(p.pal || {}) };
  x.clearRect(0, 0, FW, FH);
  const W = cv(FW, FH), a = W.getContext('2d');
  const cx = 450, groundY = 1120;
  a.save(); a.translate(cx, groundY); a.rotate(p.lean || 0); a.translate(-cx, -groundY);

  // legs (under the robe)
  const st = (p.walk ? Math.sin(p.walk) : 0) * (p.stride || 0);
  for (const [s, ang] of [[-1, st * .35], [1, -st * .35]]) {
    a.save(); a.translate(cx + s * 46, 940); a.rotate(ang);
    a.beginPath(); a.roundRect(-26, 0, 52, 150, 22); sh(a, C.robeS, LW2 + 1);
    a.beginPath(); a.ellipse(s * 6, 152, 44, 22, 0, 0, TAU); sh(a, '#4a3a30', LW2 + 1);
    a.restore();
  }
  // robe: a bell from shoulders to the ground
  const robe = () => {
    a.beginPath(); a.moveTo(cx - 150, 470);
    a.bezierCurveTo(cx - 210, 640, cx - 265, 880, cx - 285, 1010);
    a.quadraticCurveTo(cx - 150, 1055, cx - 60, 1020);
    a.quadraticCurveTo(cx, 1040, cx + 60, 1020);
    a.quadraticCurveTo(cx + 150, 1055, cx + 285, 1010);
    a.bezierCurveTo(cx + 265, 880, cx + 210, 640, cx + 150, 470);
    a.closePath();
  };
  crescent(a, robe, C.robeS, 34, 0, C.robe); robe(); sh(a, null, LW);
  // sash
  a.beginPath(); a.moveTo(cx - 140, 690); a.quadraticCurveTo(cx, 730, cx + 140, 690);
  a.lineWidth = 26; a.strokeStyle = C.trim; a.stroke(); a.lineWidth = LW2; a.strokeStyle = INK; a.stroke();
  // collar
  a.beginPath(); a.moveTo(cx - 60, 500); a.quadraticCurveTo(cx, 600, cx + 60, 500);
  a.lineWidth = 18; a.strokeStyle = C.trim; a.stroke();

  // arms
  const arm = (side, ang) => {
    a.save(); a.translate(cx + side * 150, 530); a.rotate(-side * (ang ?? .3));
    a.beginPath(); a.roundRect(-32, -10, 64, 230, 30); sh(a, C.robe, LW2 + 1);
    a.beginPath(); a.arc(0, 232, 40, 0, TAU); sh(a, C.skin, LW2 + 1);
    a.restore();
  };
  arm(-1, p.armL ?? .25); arm(1, p.armR ?? .25);

  // head
  const hy = 330, hr = 150;
  const head = () => { a.beginPath(); a.ellipse(cx, hy, hr, hr * .96, 0, 0, TAU); };
  if (p.face === 'back') {
    crescent(a, head, C.skinS, -20, 20, C.skin); head(); sh(a, null, LW + 1);
    // back of the head: hair or a bald crown
    a.beginPath(); a.ellipse(cx, hy - 20, hr * .92, hr * .8, 0, Math.PI, TAU); sh(a, C.hair || C.skin, LW2 + 1);
  } else {
    crescent(a, head, C.skinS, 26, 22, C.skin); head(); sh(a, null, LW + 1);
    // hair / crown
    if (k === 'monkey') {
      a.beginPath(); a.ellipse(cx, hy - 40, hr * .95, hr * .62, 0, Math.PI * 1.02, Math.PI * 1.98); sh(a, C.hair, LW2 + 2);
      a.beginPath(); a.ellipse(cx, hy + 18, hr * .62, hr * .5, 0, 0, TAU); sh(a, '#e8c9a0', LW2);
      // gold band
      a.beginPath(); a.ellipse(cx, hy - 92, hr * .9, 34, 0, 0, TAU); a.lineWidth = 20; a.strokeStyle = '#f0c040'; a.stroke(); a.lineWidth = LW2; a.strokeStyle = INK; a.stroke();
    } else if (k === 'pig') {
      a.beginPath(); a.ellipse(cx, hy - 30, hr * .98, hr * .7, 0, Math.PI, TAU); sh(a, '#e9a9b4', LW2 + 2);
      // ears
      for (const s of [-1, 1]) { a.save(); a.translate(cx + s * 128, hy - 110); a.rotate(s * .5); a.beginPath(); a.ellipse(0, 0, 62, 92, 0, 0, TAU); sh(a, '#e9a9b4', LW2 + 2); a.restore(); }
      a.beginPath(); a.ellipse(cx, hy + 62, 62, 44, 0, 0, TAU); sh(a, '#f7b8c2', LW2 + 2);
      a.beginPath(); a.ellipse(cx - 20, hy + 60, 9, 13, 0, 0, TAU); a.fillStyle = '#b06070'; a.fill();
      a.beginPath(); a.ellipse(cx + 20, hy + 60, 9, 13, 0, 0, TAU); a.fill();
    } else if (k === 'sand') {
      a.beginPath(); a.ellipse(cx, hy - 20, hr * .98, hr * .78, 0, Math.PI, TAU); sh(a, C.hair, LW2 + 2);
      a.beginPath(); a.ellipse(cx, hy + 108, 66, 46, 0, 0, TAU); sh(a, C.hair, LW2 + 2); // beard
    } else if (k === 'guan') {
      a.beginPath(); a.ellipse(cx, hy - 30, hr * 1.02, hr * .82, 0, Math.PI, TAU); sh(a, C.hair, LW2 + 2);
      a.beginPath(); a.ellipse(cx, hy - 150, 66, 46, 0, 0, TAU); sh(a, C.hair, LW2 + 2); // bun
    } else if (k === 'buddha') {
      for (let i = 0; i < 9; i++) { const ax = cx - 110 + (i % 3) * 110, ay = hy - 120 + Math.floor(i / 3) * 44; a.beginPath(); a.arc(ax, ay, 22, 0, TAU); sh(a, C.hair, 4); }
    } else if (k === 'laozi') {
      a.beginPath(); a.ellipse(cx, hy - 40, hr * .98, hr * .7, 0, Math.PI, TAU); sh(a, C.hair, LW2 + 2);
      a.beginPath(); a.ellipse(cx, hy + 120, 74, 70, 0, 0, TAU); sh(a, C.hair, LW2 + 2); // long beard
    } else if (k === 'monk') {
      a.beginPath(); a.ellipse(cx, hy - 10, hr * .96, hr * .9, 0, Math.PI * 1.05, Math.PI * 1.95); a.lineWidth = 6; a.strokeStyle = 'rgba(120,90,70,.35)'; a.stroke();
    } else if (k === 'demon') {
      a.beginPath(); a.ellipse(cx, hy - 40, hr * .98, hr * .7, 0, Math.PI, TAU); sh(a, C.hair, LW2 + 2);
      for (const s of [-1, 1]) { a.beginPath(); a.moveTo(cx + s * 90, hy - 110); a.quadraticCurveTo(cx + s * 160, hy - 250, cx + s * 70, hy - 300); a.quadraticCurveTo(cx + s * 110, hy - 200, cx + s * 40, hy - 120); sh(a, '#e8dcc0', 5); }
    } else if (k === 'official') {
      a.beginPath(); a.roundRect(cx - 150, hy - 190, 300, 70, 10); sh(a, '#2a2030', LW2 + 2); // hat
      a.beginPath(); a.roundRect(cx - 90, hy - 260, 180, 80, 14); sh(a, '#2a2030', LW2 + 2);
    }
    // face
    eyes(a, cx, hy + 10, p, 56);
    if (k === 'pig') { a.beginPath(); a.ellipse(cx, hy + 60, 58, 42, 0, 0, TAU); sh(a, '#f7b8c2', LW2 + 2); }
    else mouth(a, cx, hy + 92, p.mouth || 'smile', .9);
    if (p.cheeks !== false) for (const s of [-1, 1]) { a.beginPath(); a.ellipse(cx + s * 104, hy + 62, 28, 17, 0, 0, TAU); a.fillStyle = 'rgba(240,120,120,.28)'; a.fill(); }
  }

  // props
  const pr = p.prop;
  if (pr === 'staff') {
    a.save(); a.translate(cx + 268, 1060); a.rotate(-.06);
    a.beginPath(); a.roundRect(-14, -980, 28, 980, 12); sh(a, '#c9a24a', 7);
    a.beginPath(); a.roundRect(-20, -1010, 40, 90, 14); sh(a, '#b8322c', 6);
    a.restore();
  } else if (pr === 'rake') {
    a.save(); a.translate(cx + 276, 1050); a.rotate(-.05);
    a.beginPath(); a.roundRect(-12, -860, 24, 860, 10); sh(a, '#8a5a34', 6);
    a.beginPath(); a.roundRect(-70, -900, 140, 46, 12); sh(a, '#6b6b78', 6);
    a.restore();
  } else if (pr === 'spade') {
    a.save(); a.translate(cx + 280, 1060); a.rotate(-.04);
    a.beginPath(); a.roundRect(-11, -900, 22, 900, 9); sh(a, '#8a5a34', 6);
    a.beginPath(); a.ellipse(0, -930, 54, 40, 0, 0, TAU); sh(a, '#b9b2a2', 6);
    a.restore();
  } else if (pr === 'vase') {
    a.beginPath(); a.ellipse(cx + 250, 900, 60, 90, 0, 0, TAU); sh(a, '#d8e8e0', LW2 + 2);
    a.beginPath(); a.moveTo(cx + 250, 820); a.quadraticCurveTo(cx + 290, 720, cx + 330, 700); a.lineWidth = 12; a.strokeStyle = '#6f9a4a'; a.stroke();
  } else if (pr === 'whisk') {
    a.beginPath(); a.moveTo(cx + 250, 980); a.lineTo(cx + 320, 640); a.lineWidth = 14; a.strokeStyle = '#8a6a4a'; a.stroke();
    a.beginPath(); a.moveTo(cx + 320, 640); a.quadraticCurveTo(cx + 360, 560, cx + 330, 520); a.lineWidth = 30; a.strokeStyle = '#efe6d0'; a.stroke();
  } else if (pr === 'fan') {
    a.save(); a.translate(cx + 250, 760); a.rotate(-.4);
    a.beginPath(); a.moveTo(0, 0); a.arc(0, 0, 130, -1.1, .3); a.closePath(); sh(a, '#e8c9a0', 7);
    a.restore();
  }
  a.restore();
  x.drawImage(finishCut(W, p.border ?? 16, { grainA: .7 }), 0, 0);
}

export const drawFigureBack = (x, p) => drawFigure(x, { ...p, face: 'back' });
