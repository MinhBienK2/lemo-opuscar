// Episode: Vì sao ngủ trưa dậy lại mệt hơn lúc mới ngủ?
// Channel: Trạm Nghĩ Nhiều — 3D diorama explainer, five chapters, five places.
import * as THREE from 'three';
import { film, label, subtitle, toScreen } from '../../../../rig/render.js';
import { PAL, keys, seg, ss, eo, back, clamp } from '../../../../rig/kit.js';
import { loadVoice } from '../../../../rig/voice.js';
import { build } from './timeline.js';
import { CHAPTERS } from './chapters.js';

await document.fonts.load('900 54px "Be Vietnam Pro"');
await document.fonts.load('800 46px "Be Vietnam Pro"');
await document.fonts.load('700 36px "Be Vietnam Pro"');
await document.fonts.ready;

const F = film({ fov: 34 });
const camera = F.camera;

// the voice first: every mark in the picture hangs on a word, never on a number typed by hand
const V = await loadVoice(build);

// every chapter is its own scene, with its own light and its own camera; only the active one is on screen
const built = CHAPTERS.map(c => {
  const scene = new THREE.Scene();
  const api = c.build(scene, V);
  const first = V.L[c.lines[0]], last = V.L[c.lines[1]];
  return { c, scene, api, t0: first ? first.t0 : 0, t1: last ? last.t1 : V.end };
});
for (let i = 0; i < built.length; i++) built[i].t1 = i + 1 < built.length ? built[i + 1].t0 : V.end;

const chapterAt = t => {
  for (let i = built.length - 1; i >= 0; i--) if (t >= built[i].t0) return i;
  return 0;
};

window.DUR = V.end;

// the sounds and the shots of every chapter, in one timeline
const EV = [...V.ev];
for (const b of built) for (const e of (b.api.events ? b.api.events() : [])) EV.push({ ...e, t: b.t0 + (e.dt ?? e.t ?? 0), chapter: b.c.id });

// the score: one section per chapter, and the close
const cueAt = id => (V.L[id] ? V.L[id].t0 : 0);
EV.push({ type: 'music', cue: 'A', t: 0 });
EV.push({ type: 'music', cue: 'B', t: cueAt('c16') });
EV.push({ type: 'music', cue: 'C', t: cueAt('c75') });
EV.push({ type: 'music', cue: 'D', t: cueAt('c107') });
EV.push({ type: 'music', cue: 'F', t: cueAt('c161') });
EV.push({ type: 'music', cue: 'end', t: V.end - 4 });

// the rooms: the office at the desk, the hum inside the head, the office again in the evening
EV.push({ type: 'amb', kind: 'office', t: 0, t1: cueAt('c16') });
EV.push({ type: 'amb', kind: 'lab', t: cueAt('c16'), t1: cueAt('c107') });
EV.push({ type: 'amb', kind: 'office', t: cueAt('c161'), t1: V.end });

// foley, only where something moves: the jacket, the glass, the cleft filling, the wash, the clock
const fx = (type, id, shift = 0) => EV.push({ type, t: Math.max(0, cueAt(id) + shift) });
fx('cloth_rustle', 'c3', .4);
fx('glass_set', 'c13', .3);
fx('blip_up', 'c47', .5);
fx('glass_clink', 'c58', .6);
fx('whoosh', 'c67', .2);
fx('count_tick', 'c96', .2);
fx('cup_set', 'c137', .4);
fx('ting', 'c161', .3);

EV.sort((a, b) => a.t - b.t);
window.EV = EV;

window.TEXTS = t => {
  window.render(t);
  return F.texts();
};

window.render = t => {
  const i = chapterAt(t);
  const b = built[i];
  const api = b.api;
  api.update(t, b.t0);

  const k = api.cam(t, b.t0);
  camera.position.set(k[0], k[1], k[2]);
  camera.lookAt(k[3], k[4], k[5]);
  camera.updateProjectionMatrix();

  // a transition into the next chapter: the colour of the next place flashes over the frame
  let flash = new THREE.Color(0, 0, 0);
  const next = built[i + 1];
  if (next) {
    const d = next.t0 - t;
    if (d < .35) flash = (api.flashColor ? api.flashColor() : new THREE.Color(PAL.cyan)).multiplyScalar((1 - d / .35) * .35);
  }

  F.frame(b.scene, {
    t,
    thick: 3.4,
    ref: api.ref ?? 2.2,
    key: api.key,
    flash,
    fade: Math.min(1, t / .3 + .1),
    overlay: (g, tSec) => {
      subtitle(g, V.sub(tSec));
      const boxes = [];
      for (const c of (api.labels ? api.labels(tSec) : [])) {
        const scr = toScreen(c.anchor, camera);
        const px = Math.round(clamp(scr[0] + (c.dx || 0), 260, 1640));
        const py = Math.round(clamp(scr[1] + (c.dy || 0), 120, 760));
        const box = label(g, c.text, px, py, tSec, c.t0, c.t1, { id: c.id || c.text, size: c.size || 54 });
        if (box) boxes.push(box);
      }
      return boxes;
    },
  });
};

window.render(0);
window.READY = true;
