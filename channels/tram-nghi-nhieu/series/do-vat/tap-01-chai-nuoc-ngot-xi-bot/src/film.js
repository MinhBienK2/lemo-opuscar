// Episode: Vì sao mở chai nước ngọt lại xì bọt?
// Channel: Trạm Nghĩ Nhiều — 3D diorama cutaway explainer.
import * as THREE from 'three';
import { film, label, subtitle, toScreen } from '../../../../rig/render.js';
import { PAL, keys, seg, ss, eo, back, clamp } from '../../../../rig/kit.js';
import { loadVoice } from '../../../../rig/voice.js';
import { build } from './timeline.js';
import { buildScene } from './scene.js';
import { buildBottle } from './bottle.js';
import { rect, cel, path } from './draw.js';

// Preload typography
await document.fonts.load('900 54px "Be Vietnam Pro"');
await document.fonts.load('800 46px "Be Vietnam Pro"');
await document.fonts.load('700 36px "Be Vietnam Pro"');
await document.fonts.ready;

const F = film({ fov: 34 });
const camera = F.camera;

// Setup scene and physical bottle
const { scene, moon, lamp, branch, dust } = buildScene();
const T_OPEN = 22.8;
const bottle = buildBottle(scene, { tOpen: T_OPEN });

// Voice timeline and cues
const V = await loadVoice(build);
const T = id => (V.L[id] ? V.L[id].t0 : 0);

// Camera setups for the 6 distinct cinematic shots
// Shot 1: Wide establishing shot of the desk at night (0.0 - 8.5s)
const camShot1 = keys([
  [0, [1.7, 2.4, 6.7, -.35, .95, 1.6]],
  [8.5, [1.45, 2.2, 5.8, -.25, 1.0, 1.65]],
]);

// Shot 2: Close macro on bottle cutaway showing trapped dissolved gas (8.5 - 22.0s)
const camShot2 = keys([
  [8.5, [.35, .96, 2.9, .15, .85, 1.75]],
  [15.0, [.32, .92, 2.75, .15, .88, 1.75]],
  [22.0, [.30, .90, 2.6, .15, .90, 1.75]],
]);

// Shot 3: Cap opening burst & depressurization (22.0 - 31.5s)
const camShot3 = keys([
  [22.0, [.32, 1.55, 3.2, .15, 1.45, 1.75]],
  [26.5, [.30, 1.50, 3.1, .15, 1.45, 1.75]],
  [31.5, [.28, 1.45, 3.0, .15, 1.45, 1.75]],
]);

// Shot 4: Macro on nucleation sites and rising bubbles (31.5 - 41.5s)
const camShot4 = keys([
  [31.5, [.45, .80, 2.5, .20, .95, 1.75]],
  [36.5, [.42, .85, 2.45, .18, 1.05, 1.75]],
  [41.5, [.40, .90, 2.40, .16, 1.15, 1.75]],
]);

// Shot 5: High-angle view of foam climbing and erupting over the mouth (41.5 - 47.5s)
const camShot5 = keys([
  [41.5, [.50, 1.85, 3.2, .15, 1.45, 1.75]],
  [44.5, [.48, 1.80, 3.1, .15, 1.45, 1.75]],
  [47.5, [.45, 1.75, 3.0, .15, 1.45, 1.75]],
]);

// Shot 6: Wide desk conclusion with peaceful room (47.5 - END)
const camShot6 = keys([
  [47.5, [1.6, 2.32, 6.3, -.3, 1.0, 1.6]],
  [V.end, [1.68, 2.38, 6.6, -.32, 1.0, 1.6]],
]);

function getCam(t) {
  if (t < 8.5) return camShot1(t);
  if (t < 22.0) return camShot2(t);
  if (t < 31.5) return camShot3(t);
  if (t < 41.5) return camShot4(t);
  if (t < 47.5) return camShot5(t);
  return camShot6(t);
}

// 3D Anchor points for contextual term cards
const P_NECK = new THREE.Vector3(.15, 1.55, 1.75);
const P_LIQ = new THREE.Vector3(.15, .95, 1.75);
const P_MOUTH = new THREE.Vector3(.15, 1.85, 1.75);

// The narrative cards: one at a time, staying visible for sufficient read time
const CARDS = [
  { text: '2 – 4 atm', anchor: P_NECK, t0: 12.2, t1: 15.8, dx: 180, dy: -40 },
  { text: '3 – 4 LẦN', anchor: P_LIQ, t0: 17.2, t1: 20.8, dx: 180, dy: 30 },
  { text: '1 atm', anchor: P_MOUTH, t0: 22.8, t1: 26.6, dx: 180, dy: -80 },
  { text: 'ĐỊNH LUẬT HENRY', anchor: P_MOUTH, t0: 27.2, t1: 31.0, dx: 190, dy: -60 },
  { text: 'TÂM TẠO MẦM', anchor: P_LIQ, t0: 32.2, t1: 36.0, dx: 180, dy: -40 },
  { text: 'TRÀO BỌT', anchor: P_MOUTH, t0: 42.2, t1: 46.0, dx: 180, dy: -70 },
];

window.DUR = V.end;

// Shot definitions and audio-visual events
window.EV = [
  ...V.ev,
  { type: 'music', cue: 'A', t: 0 },
  { type: 'amb', kind: 'night', t: 0, t1: 22 },
  { type: 'shot', shot: 'desk_intro', t: 0 },
  { type: 'shot', shot: 'cutaway_dissolved', t: 8.5 },
  { type: 'tick', t: 12.2 },
  { type: 'shot', shot: 'cap_burst', t: 22.0 },
  { type: 'pop', t: 22.8 },
  { type: 'whoosh', t: 23.0 },
  { type: 'amb', kind: 'room', t: 22, t1: V.end },
  { type: 'music', cue: 'B', t: 22.8 },
  { type: 'shot', shot: 'wall_nucleation', t: 31.5 },
  { type: 'shot', shot: 'foam_eruption', t: 41.5 },
  { type: 'rise', t: 42.2 },
  { type: 'music', cue: 'D', t: 47.0 },
  { type: 'shot', shot: 'table_outro', t: 47.5 },
  { type: 'ting', t: 53.0 },
];

window.TEXTS = t => {
  window.render(t);
  return F.texts();
};

window.render = t => {
  // Update camera position and orientation from active shot
  const k = getCam(t);
  camera.position.set(k[0], k[1], k[2]);
  camera.lookAt(k[3], k[4], k[5]);
  camera.updateProjectionMatrix();

  // Subtle living motions
  branch.rotation.z = .05 * Math.sin(t * .9);

  // Update bottle physics and mechanics
  bottle.update(t);

  // Flash color on cap opening: quick 0.1s pop right at T_OPEN
  const fl = Math.max(0, 1 - Math.abs(t - T_OPEN - .02) / .1);

  // Render 3D scene with ink lines and 2D overlay
  F.frame(scene, {
    t,
    thick: 3.4,
    ref: t < 8.5 || t >= 47.5 ? 4.0 : 1.4,
    key: moon,
    flash: new THREE.Color(PAL.cyan).multiplyScalar(fl * .4),
    fade: Math.min(1, t / .3 + .1),
    overlay: (g, tSec) => {
      // 1. Draw subtitle at bottom band (not registered in TEXTS to keep band clean)
      subtitle(g, V.sub(tSec));

      // 2. Draw active term cards and register their bounding boxes
      const boxes = [];
      for (const c of CARDS) {
        if (tSec >= c.t0 && tSec <= c.t1) {
          const scr = toScreen(c.anchor, camera);
          const px = Math.round(clamp(scr[0] + c.dx, 250, 1650));
          const py = Math.round(clamp(scr[1] + c.dy, 120, 750)); // Keep strictly above y=880
          const b = label(g, c.text, px, py, tSec, c.t0, c.t1, { id: c.text });
          if (b) boxes.push(b);
        }
      }
      return boxes;
    },
  });
};

window.render(0);
window.READY = true;
