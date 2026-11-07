// The bottle: cutaway vessel, cap, label, and physical effervescence mechanisms.
import * as THREE from 'three';
import { PAL, toon, glowMat, canvasTex, rbox, mesh, fxLayer, mulberry, clamp, lerp, seg, ss, eo, back } from '../../../../rig/kit.js';
import { vessel, fizz, dissolved, foam, PROFILES } from '../../../../rig/cutaway.js';
import { sparks, setStreak } from '../../../../rig/fx.js';

export function buildBottle(scene, { tOpen = 22.8 } = {}) {
  const CAM0 = new THREE.Vector3(1.6, 1.4, 6.4);
  const B = new THREE.Group();
  B.position.set(.15, 0, 1.75);
  B.scale.setScalar(.8);
  scene.add(B);

  // Orient cutaway wedge toward camera
  B.rotation.y = Math.atan2(CAM0.x - B.position.x, CAM0.z - B.position.z) - .1;

  // Sliced bottle vessel
  const V = vessel(PROFILES.bottle, {
    thick: .045,
    cut: 1.9,
    shell: toon('#2a6b52'),
    face: toon('#d5eedf'),
    fill: 1.62,
    liquid: '#732612',
    liquidAlpha: .65,
  });
  B.add(V.group);
  V.group.userData.tag = 'bottle';

  // Label band on the body
  const labelTex = canvasTex(1024, 256, (g, w, h) => {
    g.fillStyle = '#f04462';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff0d8';
    g.fillRect(0, 28, w, 12);
    g.fillRect(0, h - 40, w, 12);
    // Draw decorative stars and stripes
    for (const x of [w * .25, w * .75]) {
      g.fillStyle = '#f7bd27';
      g.beginPath();
      g.arc(x, h / 2, 42, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#fff0d8';
      g.beginPath();
      g.arc(x, h / 2, 28, 0, Math.PI * 2);
      g.fill();
    }
  });
  const band = [[.385, .55], [.385, 1.0]].map(([r, y]) => new THREE.Vector2(r, y));
  B.add(mesh(
    new THREE.LatheGeometry(band, 128, V.cut / 2 + .02, Math.PI * 2 - V.cut - .04),
    toon('#ffffff', { map: labelTex, side: THREE.DoubleSide })
  ));

  // Cap: ridged, red, sits on mouth then twists and flies off at tOpen
  const cap = new THREE.Group();
  B.add(cap);
  const capMat = toon('#f04462');
  cap.add(mesh(new THREE.CylinderGeometry(.175, .175, .13, 24, 1), capMat, [0, .065, 0]));
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    cap.add(mesh(
      rbox(.025, .12, .03, .01),
      capMat,
      [Math.sin(a) * .178, .065, Math.cos(a) * .178],
      { rot: [0, a, 0] }
    ));
  }

  // Warm light blooming at bottle mouth upon opening
  const warm = new THREE.PointLight(PAL.orange, 0, 3.2, 2);
  warm.position.set(B.position.x + .5, 2.3, B.position.z + 1.2);
  scene.add(warm);

  // ── Physical Effervescence Mechanisms ──
  // 1. Dissolved CO2 molecules: dense cyan specks before opening, depleted as gas escapes
  const ds = dissolved(V, {
    n: 450,
    color: '#67e8f9',
    amount: t => (t < tOpen ? 1.0 : 1.0 - .85 * ss(seg(t, tOpen, tOpen + 6.0))),
  });
  B.add(ds.mesh);

  // 2. Fizz: nucleation on bottle walls and rising bubbles
  const rate = t => {
    if (t < tOpen) return 0;
    const rise = clamp((t - tOpen) / 1.2);
    const hold = 1.0 - .25 * clamp((t - (tOpen + 12.0)) / 15.0);
    return rise * hold;
  };
  const fz = fizz(V, {
    rate,
    sites: 90,
    n: 1400,
    grow: .05,
    rise: 1.05,
    acc: 2.4,
    color: '#eefcff',
  });
  B.add(fz.mesh);

  // 3. Foam: head climbing up the neck, blooming over mouth and flowing down
  const fm = foam(V, {
    n: 520,
    color: '#eadccc',
    height: t => {
      if (t < tOpen + 0.8) return 0;
      return 1.15 * ss(seg(t, tOpen + 0.8, tOpen + 6.5)) * (1.0 - .25 * ss(seg(t, tOpen + 16.0, tOpen + 24.0)));
    },
  });
  B.add(fm.mesh);

  // 4. Gas burst puff at opening
  const puff = sparks(160, '#dff6ff', 1.8);
  B.add(puff);

  const _p = new THREE.Vector3(), _v = new THREE.Vector3();

  function update(t) {
    // Cap animation: twist slightly before opening, then fly off spinning
    const tw = ss(seg(t, tOpen - .7, tOpen));
    const fly = Math.max(0, t - tOpen);
    cap.position.set(
      fly * .9,
      V.mouth + fly * 2.6 - 4.5 * fly * fly + .02 * tw,
      fly * .4
    );
    cap.rotation.set(fly * 5, tw * 1.4, fly * 2);
    cap.visible = cap.position.y > -1;

    // Escaping gas streaks
    let n = 0;
    const r = mulberry(19);
    for (let i = 0; i < 160; i++) {
      const tb = tOpen + r() * .3;
      const a = t - tb;
      const life = .4 + r() * .35;
      const vx = (r() - .5) * 2.4;
      const vy = 1.8 + r() * 2.4;
      const vz = (r() - .5) * 2.4;
      if (a < 0 || a > life) continue;
      _p.set(vx * a * .6, V.mouth + .05 + vy * a, vz * a * .6);
      _v.set(vx, vy, vz);
      setStreak(puff, n++, _p, _v, .14 * (1 - a / life) + .03, .014);
    }
    puff.count = n;
    puff.instanceMatrix.needsUpdate = true;

    // Warm focus light only during opening burst
    warm.intensity = .95 * ss(seg(t, tOpen - .1, tOpen + .3)) * (1 - ss(seg(t, tOpen + .5, tOpen + 1.8)));

    // Update mechanisms
    fz.update(t);
    ds.update(t);
    fm.update(t);
  }

  return {
    group: B,
    vessel: V,
    cap,
    warm,
    update,
  };
}
