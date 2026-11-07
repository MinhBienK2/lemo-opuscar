// Chapter 1 — Buổi chiều ở bàn làm việc: người vừa ngủ trưa dậy, và vẫn mệt.
import * as THREE from 'three';
import { PAL, clamp, lerp, seg, ss, eo, back } from '../../../../rig/kit.js';
import { napDesk } from './set_desk.js';
import { makeShots } from './shots.js';

export function build(scene, V) {
  const D = napDesk(scene, { time: 'day', hour: 13, minute: 30 });
  const S = D.S;
  const F = S.focus;
  const T = id => (V.L[id] ? V.L[id].t0 : 0);
  const W = (id, w) => V.w(id, w);

  // one camera setup per line: the camera cuts, holds, and drifts a little inside the shot
  const shots = makeShots(V, [
    { id: 'desk_wide', line: 'c1', cam: [1.5, 1.57, 5.15, -0.35, 0.5, 1.0] },
    { id: 'nap_cushion', line: 'c2', cam: [-1.6, 0.67, 3.3, -0.95, 0.28, 1.35] },
    { id: 'sit_up', line: 'c3', cam: [-2.15, 0.87, 3.45, -1.0, 0.35, 1.4] },
    { id: 'tired_close', line: 'c4', cam: [-2.0, 0.74, 3.0, -1.0, 0.3, 1.4] },
    { id: 'wall_clock', line: 'c5', cam: [0.0, 1.67, 2.05, 0.25, 1.55, 0.03] },
    { id: 'desk_medium', line: 'c6', cam: [-1.8, 0.92, 3.75, -0.75, 0.25, 1.1] },
    { id: 'desk_wide2', line: 'c7', cam: [-1.75, 1.32, 4.35, -0.3, 0.5, 1.0] },
    { id: 'clock_in_room', line: 'c8', cam: [0.35, 1.47, 3.45, 0.25, 1.2, 0.05] },
    { id: 'wake', line: 'c9', cam: [-1.95, 0.82, 3.2, -1.0, 0.32, 1.4] },
    { id: 'hand_close', line: 'c10', cam: [-1.75, 0.62, 2.8, -0.98, 0.24, 1.4] },
    { id: 'desk_low', line: 'c11', cam: [-1.35, 0.28, 3.15, -0.8, 0.2, 1.2] },
    { id: 'glass_reach', line: 'c12', cam: [-1.4, 0.44, 2.8, -0.4, 0.1, 1.55] },
    { id: 'glass_close', line: 'c13', cam: [-1.1, 0.42, 2.4, -0.34, 0.08, 1.63] },
    { id: 'pillow', line: 'c14', cam: [-1.65, 0.44, 2.75, -0.78, 0.08, 1.47] },
    { id: 'clock_again', line: 'c15', cam: [0.1, 1.57, 2.45, 0.25, 1.45, 0.03] },
    { id: 'window_light', line: 'c16', cam: [-1.85, 1.22, 3.15, -1.45, 1.15, 0.05] },
    { id: 'chair', line: 'c17', cam: [-0.85, 0.97, 3.15, -1.0, 0.6, 1.95] },
    { id: 'jacket_on_chair', line: 'c18', cam: [-0.6, 1.22, 2.95, -1.0, 0.8, 1.95] },
    { id: 'person_sit', line: 'c19', cam: [-1.9, 0.97, 3.35, -1.0, 0.35, 1.45] },
    { id: 'pillow_deep', line: 'c20', cam: [-1.55, 0.42, 2.55, -0.78, 0.07, 1.47] },
    { id: 'into_cushion', line: 'c21', cam: [-1.3, 0.38, 2.3, -0.78, 0.06, 1.47] },
  ]);

  // the hand: it lies on the desk where the arms were, lifts when the sleeper wakes, and reaches for the glass
  const tWake = W('c3', 'tỉnh'), tReach = W('c9', 'cốc');
  const update = t => {
    const wake = ss(seg(t, tWake - .3, tWake + 1.1));
    const reach = ss(seg(t, tReach, tReach + 1.3));
    D.update(t, { wake, reach, hands: 1 });
    S.update(t, { light: 1 });
  };

  const labels = t => {
    const out = [];
    const t0 = T('c9'), t1 = T('c11');
    if (t >= t0 && t <= t1) out.push({ text: 'CƠN LƯỜI SAU KHI NGỦ', anchor: new THREE.Vector3(F.x - .85, .3, F.z + .95), t0, t1, dx: -80, dy: -170 });
    return out;
  };

  return {
    key: S.key,
    update,
    cam: t => shots.at(t),
    labels,
    events: () => shots.events(),
    flashColor: () => new THREE.Color(PAL.purple),
    ref: 2.4,
  };
}
