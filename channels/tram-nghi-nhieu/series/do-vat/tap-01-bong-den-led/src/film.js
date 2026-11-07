// The film: why an LED bulb lights up without getting hot.
// The picture carries the story; the voice follows it. Every cue is timed from the recorded voice.
import * as THREE from 'three';
import { film, label, subtitle, toScreen } from '../../../../rig/render.js';
import { PAL, keys, seg, ss, clamp } from '../../../../rig/kit.js';
import { loadVoice } from '../../../../rig/voice.js';
import { build } from './timeline.js';
import { buildDesk, INC, LEDP } from './desk.js';
import { buildCutaway } from './cut.js';
import { card } from './overlay.js';

const F = film({ fov: 36 }), camera = F.camera;
const desk = buildDesk();
const cutInc = buildCutaway('inc');
const cutLed = buildCutaway('led');

const V = await loadVoice(build);
const T = id => (V.L[id] ? V.L[id].t0 : 0);

// ── the three movements of the film, placed by the voice ──
const tInc = T('m9') + 1.5;      // the dive into the incandescent bulb
const tLed = T('m25') + 1.1;     // the switch to the LED bulb
const tBack = T('m34') + 0.7;    // back to the desk
const tSwitchInc = T('m12') - 0.25;   // the toggle on the wall
const tSwitchLed = tLed - 0.15;
const touchInc = [T('m4') + 0.6, T('m5') + 0.45];
const touchLed = [T('m6') - 0.15, T('m6') + 0.55];
const END = V.end;

// ── the shots: a list of framings, each one reached in 0.45 s and then held ──
const D1 = [.15, 1.7, 4.6, 0, 1.22, 1.28];       // the desk, both bulbs
const D2 = [.1, 1.45, 3.4, 0, 1.2, 1.28];
const D3 = [-.8, 1.34, 2.5, -.58, 1.2, 1.3];     // the incandescent, the hand comes in
const D4 = [-.7, 1.3, 2.25, -.58, 1.2, 1.32];    // the incandescent, the touch
const D5 = [-.35, 1.4, 3.1, -.3, 1.2, 1.3];      // the hand pulls back
const D6 = [-.3, 1.34, 2.55, .3, 1.2, 1.4];      // the LED, from the left
const D7 = [-.15, 1.3, 2.25, .35, 1.2, 1.42];    // the touch on the LED
const D8 = [.05, 1.38, 2.95, 0, 1.2, 1.28];      // both bulbs
const D9 = [-.45, 1.28, 2.0, -.55, 1.2, 1.3];    // the push towards the incandescent
const D10 = [INC.x, INC.y, INC.z + .22, INC.x, INC.y, INC.z];
const I1 = [1.35, 2.0, 5.6, .1, 1.0, 1.75];      // the cutaway bulb on the table
const I2 = [1.0, 1.7, 4.8, .15, 1.0, 1.75];
const I3 = [.8, 1.4, 3.3, .15, 1.05, 1.75];      // the filament, cold
const I4 = [.85, 1.3, 3.25, .15, 1.05, 1.75];    // the filament, hot
const I5 = [.6, 1.2, 2.7, .15, 1.1, 1.8];      // the photons in flight
const I6 = [.95, 1.5, 4.0, .15, 1.05, 1.75];     // the glass and the red photons
const I7 = [2.05, 1.5, 4.3, 2.05, .12, 2.8];      // the colour card
const I8 = [1.85, 1.15, 3.85, 1.85, .1, 2.78];      // the colour card, closer
const I9 = [1.35, 2.0, 5.6, .1, 1.0, 1.75];
const L1 = [1.2, 1.9, 5.2, .1, 1.0, 1.75];       // the cutaway LED bulb
const L2 = [.95, 1.6, 4.2, .12, .95, 1.75];
const L3 = [.6, 1.25, 3.1, .1, .85, 1.78];      // the board and the stem
const L4 = [.7, 1.1, 2.9, .15, .78, 1.78];     // the chip
const L5 = [.55, 1.0, 2.6, .12, .88, 1.78];      // the photons leaving the chip
const L6 = [.6, .9, 2.3, .15, .6, 1.78];         // the chip and the heatsink
const L7 = [1.2, 1.9, 5.2, .1, 1.0, 1.75];

const deskShots = [
  { t: 0, c: D1, n: 'd1' }, { t: T('m2'), c: D2, n: 'd2' }, { t: T('m4') - .7, c: D3, n: 'd3' }, { t: touchInc[0] + .1, c: D4, n: 'd4' },
  { t: touchInc[1] + .3, c: D5, n: 'd5' }, { t: touchLed[0] - .3, c: D6, n: 'd6' }, { t: touchLed[1] + .4, c: D7, n: 'd7' },
  { t: T('m7'), c: D8, n: 'd8' }, { t: T('m8') + .3, c: D9, n: 'd9' }, { t: tInc - .5, c: D10, n: 'd10' },
  { t: tBack, c: D6, n: 'd11' }, { t: T('m35') + .5, c: D7, n: 'd12' }, { t: T('m38'), c: D8, n: 'd13' }, { t: T('m39') - .4, c: D2, n: 'd14' }, { t: END - 1.2, c: D1, n: 'd15' },
];
const incShots = [
  { t: tInc, c: I1, n: 'i1' }, { t: T('m11'), c: I2, n: 'i2' }, { t: T('m12') - .7, c: I3, n: 'i3' }, { t: T('m13') + .5, c: I4, n: 'i4' },
  { t: T('m16'), c: I5, n: 'i5' }, { t: T('m18'), c: I6, n: 'i6' }, { t: T('m22'), c: I7, n: 'i7' }, { t: T('m23') + .7, c: I8, n: 'i8' }, { t: tLed - .7, c: I9, n: 'i9' },
];
const ledShots = [
  { t: tLed, c: L1, n: 'l1' }, { t: T('m27'), c: L2, n: 'l2' }, { t: T('m28'), c: L3, n: 'l3' }, { t: T('m29') + .3, c: L4, n: 'l4' },
  { t: T('m30') + .5, c: L5, n: 'l5' }, { t: T('m32'), c: L6, n: 'l6' }, { t: tBack - .6, c: L7, n: 'l7' },
];

// every shot is reached in 0.45 s and then held
function buildKeys(list) {
  const K = [];
  for (let i = 0; i < list.length - 1; i++) { K.push([list[i].t, list[i].c]); K.push([list[i].t + .45, list[i + 1].c]); }
  K.push([list[list.length - 1].t, list[list.length - 1].c]);
  return keys(K);
}
const deskKeys = buildKeys(deskShots), incKeys = buildKeys(incShots), ledKeys = buildKeys(ledShots);

function shot(t) {
  if (t < tInc) { const k = deskKeys(t); return { pos: k, fov: 36, thick: 3.5, ref: 1.6 }; }
  if (t < tLed) { const k = incKeys(t); return { pos: k, fov: 36, thick: 3.4, ref: 1.1 }; }
  if (t < tBack) { const k = ledKeys(t); return { pos: k, fov: 36, thick: 3.4, ref: .8 }; }
  const k = deskKeys(t); return { pos: k, fov: 36, thick: 3.5, ref: 1.6 };
}

// ── the terms on screen: one card at a time ──
const A = {
  inc: new THREE.Vector3(INC.x, INC.y, INC.z),
  led: new THREE.Vector3(LEDP.x, LEDP.y, LEDP.z),
  fil: new THREE.Vector3(.15, 1.32, 1.75),
  shell: new THREE.Vector3(.15, 1.12, 1.88),
  out: new THREE.Vector3(.15, 1.52, 2.12),
  chip: new THREE.Vector3(.15, .79, 1.78),
  stream: new THREE.Vector3(-.27, .86, 1.77),
  photon: new THREE.Vector3(.15, .88, 1.75),
  base: new THREE.Vector3(.15, .16, 1.75),
  visBand: new THREE.Vector3(1.59, .09, 2.92),
  irBand: new THREE.Vector3(2.44, .09, 2.70),
};
const CARDS = [
  { text: 'BÓNG SỢI', at: A.inc, t0: .4, t1: T('m2') + .3, dx: 170, dy: -130 },
  { text: 'BÓNG LED', at: A.led, t0: T('m3'), t1: T('m4') - .7, dx: 170, dy: -130 },
  { text: 'NÓNG', at: A.inc, t0: touchInc[0] - .7, t1: touchInc[1] + 1.4, dx: 170, dy: -130 },
  { text: 'MÁT', at: A.led, t0: touchLed[0] - .7, t1: touchLed[1] + 1.2, dx: 170, dy: -130 },
  { text: 'SỢI ĐÈN', at: A.fil, t0: T('m10'), t1: T('m12') - .4, dx: 170, dy: -130 },
  { text: '2.800 K', at: A.fil, t0: T('m13') + .3, t1: T('m15') - .2, dx: 170, dy: -130 },
  { text: 'PHOTON', at: A.out, t0: T('m15'), t1: T('m17') - .3, dx: 170, dy: -130 },
  { text: 'MẮT THẤY ĐƯỢC', at: A.out, t0: T('m17') - .2, t1: T('m18') + .1, dx: 170, dy: -130 },
  { text: 'HỒNG NGOẠI', at: A.shell, t0: T('m18') + .2, t1: T('m19') + 1.2, dx: 170, dy: -130 },
  { text: '90% NHIỆT', at: A.shell, t0: T('m20') - .3, t1: T('m20b') - .3, dx: 170, dy: -130 },
  { text: '10% ÁNH SÁNG', at: A.out, t0: T('m20b') - .2, t1: T('m21') + .5, dx: 170, dy: -130 },
  { text: 'NĂNG LƯỢNG', at: A.shell, t0: T('m21') + .6, t1: T('m22') - .3, dx: 170, dy: -130 },
  { text: '~1,0 µm', at: A.irBand, t0: T('m22') - .2, t1: T('m23') + .3, dx: 170, dy: -130 },
  { text: '0,4–0,8 µm', at: A.visBand, t0: T('m23') + .4, t1: T('m25') - .4, dx: 170, dy: -130 },
  { text: 'PHẦN RÒ RÍ', at: A.shell, t0: T('m24'), t1: T('m25') - .5, dx: 170, dy: -130 },
  { text: 'BÁN DẪN', at: A.chip, t0: T('m27'), t1: T('m29') - .2, dx: 170, dy: -130 },
  { text: 'ELECTRON', at: A.stream, t0: T('m28'), t1: T('m29b') + .3, dx: 170, dy: -130 },
  { text: 'PHOTON', at: A.photon, t0: T('m29b') + .4, t1: T('m31') - .1, dx: 170, dy: -130 },
  { text: 'NHIỆT Ở ĐẾ BÓNG', at: A.base, t0: T('m32') - .2, t1: T('m33') + .3, dx: 170, dy: -130 },
  { text: '25 LẦN BỀN HƠN', at: A.led, t0: T('m33') + .4, t1: T('m34') + .3, dx: 170, dy: -130 },
  { text: 'MÁT', at: A.led, t0: tBack + .3, t1: T('m35') + 1.3, dx: 170, dy: -130 },
  { text: '16 lm/W', at: A.inc, t0: T('m36') - .2, t1: T('m37') - .4, dx: 170, dy: -130 },
  { text: '100 lm/W', at: A.led, t0: T('m37') - .2, t1: T('m38') + .4, dx: 170, dy: -130 },
  { text: 'LUMEN', at: A.led, t0: T('m38') + .5, t1: T('m39') + .4, dx: 170, dy: -130 },
  { text: 'NHIỆT ÍT HƠN', at: A.led, t0: T('m41b'), t1: T('m41b') + 2.6, dx: 170, dy: -130 },
];

function overlay(g, t) {
  const out = [];
  for (const c of CARDS) {
    if (t < c.t0 || t > c.t1) continue;
    const [ax, ay] = toScreen(c.at, camera);
    const half = c.text.length * 27 + 34;          // the card's own half width, so it stays inside the frame
    const x = clamp(ax + c.dx, half + 16, 1904 - half - 16), y = clamp(ay + c.dy, 110, 790);
    const b = label(g, c.text, x, y, t, c.t0, c.t1, { id: c.text, size: 52 });
    if (b) out.push(b);
    break;                                   // one card at a time
  }
  // the closing numbers: one at a time, each while the narrator says it
  const closing = [
    [['1.100 LUMEN'], T('m39') + .2, T('m39') + 3.2],
    [['BÓNG SỢI 75 W'], T('m39') + 3.3, T('m40') + 1.6],
    [['BÓNG LED 9 W'], T('m40') + 1.7, T('m41b') - .3],
  ];
  for (const [lines, t0, t1] of closing) {
    if (t < t0 || t > t1) continue;
    const b = card(g, lines, 960, 300, t, t0, t1);
    if (b) out.push(b);
    break;
  }
  // the subtitle is burned in, but it is not registered as a text block: the .srt holds its timing
  const sub = V.sub(t);
  if (sub) subtitle(g, sub);
  return out;
}

// ── the shots the film declares ──
const SHOT_EVENTS = [...deskShots, ...incShots, ...ledShots]
  .sort((a, b) => a.t - b.t)
  .map(s2 => ({ type: 'shot', t: +s2.t.toFixed(3), shot: s2.n, host: true }));

// ── the events of the film ──
const EV = [
  ...V.ev,
  ...SHOT_EVENTS,
  { type: 'music', cue: 'A', t: 0 },
  { type: 'music', cue: 'B', t: tInc },
  { type: 'music', cue: 'C', t: tLed },
  { type: 'music', cue: 'D', t: tBack },
  { type: 'music', cue: 'end', t: END - 2.2 },
  { type: 'amb', kind: 'room', t: 0, t1: tInc },
  { type: 'amb', kind: 'low', t: tInc, t1: tBack },
  { type: 'amb', kind: 'room', t: tBack, t1: END },
  { type: 'hand_tap', t: touchInc[0] + .3 },
  { type: 'hand_tap', t: touchLed[0] + .3 },
  { type: 'switch', t: tSwitchInc + .25 },
  { type: 'rise', t: tSwitchInc + .7 },
  { type: 'switch', t: tSwitchLed + .1 },
  { type: 'whoosh', t: tInc },
  { type: 'whoosh', t: tLed },
  { type: 'whoosh', t: tBack },
];

window.DUR = END;
window.EV = EV;
window.TEXTS = t => { window.render(t); return F.texts(); };

window.render = t => {
  const sh = shot(t);
  camera.fov = sh.fov; camera.position.set(...sh.pos); camera.lookAt(sh.pos[3], sh.pos[4], sh.pos[5]); camera.updateProjectionMatrix();

  const inDesk = t < tInc || t >= tBack;
  if (inDesk) {
    desk.update(t, camera, { touch1: touchInc, touch2: touchLed, on: 1 });
    F.frame(desk.scene, {
      t, thick: sh.thick, ref: sh.ref, key: desk.key,
      flash: flashColor(t),
      fade: Math.min(1, t / .4, (END - t) / .6),
      overlay,
    });
  } else if (t < tLed) {
    cutInc.lever.rotation.x = .9 * ss(seg(t, tSwitchInc, tSwitchInc + .18));
    const on = t > tSwitchInc + .18 ? 1 : 0;
    const heat = ss(seg(t, tSwitchInc + .18, tSwitchInc + 1.5));
    cutInc.frame(t, camera, { on, heat });
    F.frame(cutInc.scene, {
      t, thick: sh.thick, ref: sh.ref, key: cutInc.moon,
      flash: flashColor(t),
      fade: Math.min(1, t / .4, (END - t) / .6),
      overlay,
    });
  } else {
    cutLed.lever.rotation.x = .9 * ss(seg(t, tSwitchLed, tSwitchLed + .18));
    cutLed.frame(t, camera, { on: t > tSwitchLed + .18 ? 1 : 0, heat: 0 });
    F.frame(cutLed.scene, {
      t, thick: sh.thick, ref: sh.ref, key: cutLed.moon,
      flash: flashColor(t),
      fade: Math.min(1, t / .4, (END - t) / .6),
      overlay,
    });
  }
};

// a transition: a flash in the colour of the scene that comes next
// a transition: a short leak of light in the colour of the scene that comes next
const FLASHES = [
  [T('m4'), PAL.red, .45], [T('m6'), PAL.cyan, .4], [tInc, PAL.orange, .8], [T('m13'), PAL.orange, .5], [T('m16'), PAL.orange, .45], [T('m18'), PAL.red, .5],
  [T('m22'), PAL.purple, .5], [tLed, PAL.cyan, .75], [T('m27'), PAL.cyan, .5], [T('m28'), PAL.cyan, .5],
  [T('m30'), PAL.cyan, .45], [T('m32'), PAL.orange, .5], [tBack, '#ffb36b', .7], [T('m36'), '#ffb36b', .45], [T('m39'), '#ffb36b', .45],
];
function flashColor(t) {
  const c = new THREE.Color(0, 0, 0);
  for (const [at, col, k] of FLASHES) {
    const p = Math.max(0, 1 - Math.abs(t - at) / .22) * k;
    if (p > 0) c.add(new THREE.Color(col).multiplyScalar(p));
  }
  return c;
}

await document.fonts.load('900 54px "Be Vietnam Pro"');
await document.fonts.load('800 46px "Be Vietnam Pro"');
window.render(0);
window.READY = true;
