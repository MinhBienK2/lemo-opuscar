// Chapter 5 — Buổi chiều muộn ở bàn làm việc: ngủ trưa bao lâu, ngủ lúc nào, và cách cà phê rồi nằm xuống.
import * as THREE from 'three';
import { PAL, toon, glowMat, rbox, mesh, fxLayer, clamp, lerp, seg, ss, eo } from '../../../../rig/kit.js';
import { brainChunk } from '../../../../rig/brain.js';
import { napDesk } from './set_desk.js';
import { phone, bodyClock, clockRing } from './props.js';
import { makeShots } from './shots.js';

export function build(scene, V) {
  const D = napDesk(scene, { time: 'day', hour: 17, minute: 30 });
  const S = D.S;
  const F = S.focus;
  const T = id => (V.L[id] ? V.L[id].t0 : 0);
  const W = (id, w) => V.w(id, w);

  // the phone with the alarm chooser, next to the cushion
  const ph = phone();
  ph.position.set(F.x + .18, .002, F.z + .42);
  ph.rotation.y = -.5;
  scene.add(ph);
  ph.alarm();

  // a small model of the brain on the desk: the slow wave of deep sleep, running while the clock counts
  const model = brainChunk({ w: .62, d: .46, h: .3, seed: 7, cut: true, folds: 3, amp: .03 });
  model.position.set(F.x - .7, .06, F.z - .3);
  model.rotation.y = .25;
  scene.add(model);

  // a small clock with a slow hand: it counts the twenty minutes of a nap
  const timer = bodyClock({ r: .1 });
  timer.position.set(F.x - .95, .17, F.z - .3);
  timer.rotation.x = -.5;
  scene.add(timer);

  // the ring of the day: twenty-four marks, and the afternoon painted dark
  const ring = clockRing({ R: .26, marks: 24, hours: 24 });
  ring.position.set(F.x + .68, .16, F.z + .17);
  scene.add(ring);
  // the afternoon arc, from one o'clock to five
  const arc = mesh(new THREE.TorusGeometry(.26, .05, 10, 28, 1.05), toon('#f04462'), [0, 0, 0], { rot: [0, 0, -2.88], cast: false });
  ring.add(arc);
  const arc2 = mesh(new THREE.TorusGeometry(.26, .03, 8, 20, .35), toon('#f7bd27'), [0, 0, 0], { rot: [0, 0, -2.88 - 1.05], cast: false });
  ring.add(arc2);

  const shots = makeShots(V, [
    { id: 'phone_alarm', line: 'c147', cam: [.5, .32, 1.3, .23, .02, 1.27] },
    { id: 'model_brain', line: 'c148', cam: [-.22, .32, .78, -.6, .1, .5] },
    { id: 'model_wave', line: 'c149', cam: [-.45, .28, .66, -.6, .09, .5] },
    { id: 'timer', line: 'c150', cam: [-.55, .3, .68, -.85, .15, .5] },
    { id: 'cushion_evening', line: 'c151', cam: [.05, .38, 1.25, -.25, .08, .89] },
    { id: 'model_deep', line: 'c152', cam: [-.62, .24, .72, -.6, .09, .5] },
    { id: 'model_dark', line: 'c153', cam: [-.35, .2, .62, -.6, .08, .5] },
    { id: 'night_clock', line: 'c154', cam: [.9, 1.25, 2.4, .3, .9, .1] },
    { id: 'desk_wide2', line: 'c155', cam: [-1.25, 1.15, 3.3, .05, .4, .6] },
    { id: 'ring_wide', line: 'c156', cam: [1.15, .34, 1.55, .73, .17, 1.02] },
    { id: 'ring_close', line: 'c157', cam: [.82, .18, 1.42, .73, .16, 1.02] },
    { id: 'ring_afternoon', line: 'c158', cam: [.95, .12, 1.28, .73, .16, 1.02] },
    { id: 'ring_morning', line: 'c159', cam: [.62, .16, 1.22, .73, .16, 1.02] },
    { id: 'desk_side', line: 'c160', cam: [1.45, .9, 2.2, .2, .3, .8] },
    { id: 'ring_late', line: 'c161', cam: [.7, .1, 1.25, .73, .14, 1.02] },
    { id: 'ring_three', line: 'c162', cam: [.9, .2, 1.18, .73, .16, 1.02] },
    { id: 'ring_mark', line: 'c163', cam: [.8, .1, 1.1, .73, .14, 1.02] },
    { id: 'ring_night', line: 'c164', cam: [.6, .18, 1.28, .73, .16, 1.02] },
    { id: 'cup_evening', line: 'c165', cam: [1.0, .34, 1.5, .47, .12, 1.23] },
    { id: 'cup_steam', line: 'c166', cam: [.72, .42, 1.15, .47, .1, 1.23] },
    { id: 'door_caffeine', line: 'c167', cam: [.34, .12, .5, .1, -.14, -.25] },
    { id: 'waiting', line: 'c168', cam: [1.2, .9, 2.3, .2, .3, .8] },
    { id: 'hand_wait', line: 'c169', cam: [.55, .38, 1.4, .2, .2, .9] },
    { id: 'cup_drink', line: 'c170', cam: [.68, .36, 1.1, .47, .12, 1.23] },
    { id: 'clock_thirty', line: 'c171', cam: [1.05, .3, 1.2, .8, .16, .68] },
    { id: 'cup_full', line: 'c172', cam: [.82, .44, 1.05, .47, .12, 1.23] },
    { id: 'desk_wide3', line: 'c173', cam: [-1.1, 1.05, 3.2, .1, .4, .7] },
    { id: 'cup_late', line: 'c174', cam: [.9, .3, 1.35, .47, .1, 1.23] },
    { id: 'lamp_evening', line: 'c175', cam: [-1.3, 1.0, 2.2, -1.2, 1.0, .2] },
    { id: 'model_pressure', line: 'c176', cam: [-.4, .28, .74, -.6, .1, .5] },
    { id: 'night_short', line: 'c177', cam: [.75, 1.2, 2.5, .3, .85, .1] },
    { id: 'cushion_fold', line: 'c178', cam: [-.05, .4, 1.3, -.25, .08, .89] },
    { id: 'ring_afternoon2', line: 'c179', cam: [.92, .12, 1.26, .73, .16, 1.02] },
    { id: 'model_wake', line: 'c180', cam: [-.52, .24, .68, -.6, .09, .5] },
    { id: 'desk_calm', line: 'c181', cam: [1.5, 1.1, 3.2, .0, .35, .55] },
    { id: 'cushion_tidy', line: 'c182', cam: [.1, .35, 1.2, -.25, .08, .89] },
    { id: 'chair_empty', line: 'c183', cam: [-.6, .8, 2.1, -1.0, .6, 1.95] },
    { id: 'desk_wide4', line: 'c184', cam: [-1.3, 1.2, 3.4, .0, .45, .6] },
    { id: 'final_desk', line: 'c185', cam: [1.6, 1.25, 3.7, -.05, .4, .55] },
  ]);

  // the clock in the evening, the twenty-minute timer, the needle of the day
  const tWave = T('c148'), tTimer = T('c149'), tTimerEnd = T('c151');
  const tThree = W('c162', 'ba'), tCup = T('c165'), tCoffee = W('c171', 'ba'), tEnd = T('c183');

  const update = t => {
    // the slow wave of deep sleep on the model
    model.wave(t, .6 + .8 * ss(seg(t, tWave, tTimer + 2)));
    // the timer counts twenty minutes and stops
    const p = ss(seg(t, tTimer, tTimerEnd));
    timer.setSlow(p);
    // the needle of the day: it moves to the afternoon mark and then to the night
    ring.setHour(lerp(13.5, 15, ss(seg(t, tThree, tThree + 3))) + 9 * ss(seg(t, tEnd - 2, tEnd + 1)));
    // the coffee steams while it is drunk, then goes quiet
    const steam = (1 - ss(seg(t, tCoffee, tCoffee + 6))) * (t > tCup - 4 ? 1 : .2);
    D.update(t, { wake: 0, reach: ss(seg(t, tCup + 4, tCup + 8)) * .8, steam, hands: 1 });
    S.update(t, { light: 1 - .25 * ss(seg(t, tEnd - 3, tEnd + 1)) });
  };

  const labels = t => {
    const out = [];
    const a0 = T('c150'), a1 = T('c152');
    if (t >= a0 && t <= a1) out.push({ text: 'HAI MƯƠI PHÚT', anchor: new THREE.Vector3(F.x - .7, .26, F.z - .3), t0: a0, t1: a1, dx: -120, dy: -140 });
    const b0 = T('c162'), b1 = T('c164');
    if (t >= b0 && t <= b1) out.push({ text: 'TRƯỚC BA GIỜ CHIỀU', anchor: new THREE.Vector3(F.x + .68, .18, F.z + .17), t0: b0, t1: b1, dx: 200, dy: -140 });
    return out;
  };

  return {
    key: S.key,
    update,
    cam: t => shots.at(t),
    labels,
    events: () => shots.events(),
    flashColor: () => new THREE.Color(PAL.mustard),
    ref: 2.2,
  };
}
