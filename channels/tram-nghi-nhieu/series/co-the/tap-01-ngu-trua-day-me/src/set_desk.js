// The desk of this episode: the rig's study desk, dressed for an afternoon nap and for the evening after it.
// Everything that changes state on the table (the hand, the steam, the clock hands) is driven from update(t).
import * as THREE from 'three';
import { PAL, toon, glowMat, rbox, mesh, fxLayer, cushionGeo, clamp, lerp, seg, ss, eo, back } from '../../../../rig/kit.js';
import { desk, clock, mug } from '../../../../rig/sets.js';
import { keyLight, pool } from '../../../../rig/lights.js';
import { napCushion, coffeeCup, toyPerson } from './props.js';

// A chair pushed back from the desk: the nap happened here, and the jacket is still over the back.
function chair() {
  const g = new THREE.Group();
  const wood = toon('#6b3d22');
  g.add(mesh(rbox(.5, .06, .48, .02), toon('#9a5be5'), [0, .46, 0]));
  for (const [x, z] of [[-.2, -.18], [.2, -.18], [-.2, .18], [.2, .18]]) g.add(mesh(rbox(.05, .46, .05, .015), wood, [x, .23, z]));
  const j = mesh(cushionGeo(.42, .16, .2, .02), toon('#f04462'), [0, .52, -.22], { rot: [-.12, 0, 0] });
  g.add(j);
  return g;
}

// The nap desk. `time` picks the light of the rig set: 'day' for the afternoon, 'evening' for the last chapter.
// `hour` is the hour the wall clock shows — the time of the day is a thing in the frame, not a caption.
export function napDesk(scene, { time = 'day', hour = 13, minute = 30 } = {}) {
  const S = desk(scene, { time });
  const F = S.focus;

  // the folded jacket somebody used as a pillow, with the dent of a head still in it
  const cush = napCushion({ color: '#9a5be5', L: .44, D: .34 });
  cush.position.set(F.x - .78, .06, F.z + .62);
  cush.rotation.y = .3;
  scene.add(cush);

  // the chair, pushed back
  const ch = chair();
  ch.position.set(F.x - 1.05, 0, F.z + 1.1);
  ch.rotation.y = .55;
  scene.add(ch);

  // the glass of water beside the desk
  const glass = mug('#e8f2f6', '#cfe6ee');
  glass.position.set(F.x - .34, 0, F.z + .78);
  scene.add(glass);

  // the clock on the wall: it is the thing that says what time it is
  const ck = clock();
  ck.position.set(.25, 1.55, .03);
  ck.scale.setScalar(1.05);
  scene.add(ck);
  S.lamp.intensity = 6.2;
  S.amb.hemi.intensity = 1.15;
  const ckLight = pool(scene, { from: new THREE.Vector3(.25, 1.8, 1.5), to: new THREE.Vector3(.25, 1.55, .05), intensity: 2.4, angle: .5 });

  // the person: a toy body that leans on the desk with its head on its arms, and sits up when it wakes
  const person = toyPerson({ shirt: '#d0603f' });
  person.position.set(F.x - .92, .30, F.z + 1.02);
  person.rotation.y = Math.PI + .5;
  scene.add(person);

  // the coffee appears only in the last chapter
  const cup = coffeeCup({});
  cup.position.set(F.x + .78, .0, F.z - .08);
  cup.visible = false;
  scene.add(cup);

  const update = (t, { wake = 0, reach = 0, steam = 0, hands = 1 } = {}) => {
    ck.tick(t, hour + minute / 60);
    const w = clamp(wake), r = clamp(reach);
    // asleep: leaning on the desk, head on the arms, eyes closed; awake: sits up, eyes half open
    const lean = lerp(1.18, .42, w), headDown = lerp(.55, .04, w);
    person.set(lean, headDown, r * .9, w * .8);
    // the shoulders breathe
    person.userData.torso.position.y = .13 + Math.sin(t * 1.15) * .006 * (1 - .5 * w);
    // the reaching arm turns towards the glass
    person.userData.armR.rotation.y = -r * .55;
    person.userData.armR.rotation.x = -r * .18;
    cup.visible = steam > .01;
    if (cup.visible) cup.updateSteam(t, steam);
  };

  return { S, cushion: cush, chair: ch, glass, cup, person, clock: ck, clockLight: ckLight, update };
}
