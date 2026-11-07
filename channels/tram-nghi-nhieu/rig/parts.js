// Real parts for the insides of machines and appliances: each one built with the features that make people name it
// (a spring is a helix of round wire with flat ends, not a cylinder; a chip has legs; a battery has its + nub).
// Every part here passed the blind check of review.sh --props (propcheck/rig.js lists them). Sizes are in scene
// units at the scale of the rig's props (a banana is .42 long); pass `size` to scale a part as a whole.
// Each returns a THREE.Group with handles for what the part does (spring.squeeze, strip.bend, lever.turn, ...).
import * as THREE from 'three';
import { toon, glowMat, canvasTex, mulberry, lerp, clamp } from './kit.js';

const STEEL = '#a9b1bb', DARK = '#3a3d44', BRASS = '#c9993c', COPPER = '#c4703c';
const m = (geo, mat, pos = [0, 0, 0], rot) => { const x = new THREE.Mesh(geo, mat); x.position.set(...pos); if (rot) x.rotation.set(...rot); x.castShadow = x.receiveShadow = true; return x; };

// coil spring standing on +y: round wire, closed and flat ends. S.squeeze(k): 0 = free length, 1 = coils touching.
export function spring({ r = .03, len = .1, turns = 7, wire = .0045, color = STEEL, size = 1 } = {}) {
  const g = new THREE.Group(), mat = toon(color), solid = turns * wire * 2.1;
  const geoAt = L => {
    const pts = [], N = turns * 40;
    for (let i = 0; i <= N; i++) {
      const u = i / N, a = u * turns * Math.PI * 2;
      // closed ends: the first and last turn lie flat (pitch ~ wire), the middle carries the length
      const e = .7 / turns, y = u < e ? u / e * wire * 1.1 : u > 1 - e ? L - (1 - u) / e * wire * 1.1 : lerp(wire * 1.1, L - wire * 1.1, (u - e) / (1 - 2 * e));
      pts.push(new THREE.Vector3(Math.cos(a) * r, y + wire, Math.sin(a) * r));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N * 2, wire, 8, false);
  };
  const coil = m(geoAt(len), mat); g.add(coil);
  g.squeeze = k => { coil.geometry.dispose(); coil.geometry = geoAt(lerp(len, solid, clamp(k))); };
  g.scale.setScalar(size); g.userData.part = 'spring'; return g;
}

// bimetal strip: two metals bonded (brass on top, steel below), along +x from a riveted end. S.bend(k): the free end
// curls toward the steel side as it heats (k 0..1).
export function bimetal({ L = .14, w = .024, t = .006, top = '#d98a2b', bottom = '#8f99a6', size = 1 } = {}) {
  const g = new THREE.Group();
  const mk = (color, y0) => { const geo = new THREE.BoxGeometry(L, t, w, 48, 1, 1); geo.translate(L / 2, y0 + t / 2, 0); geo.userData.base = geo.attributes.position.array.slice(); return m(geo, toon(color)); };
  const A = mk(top, t), B = mk(bottom, 0); g.add(A, B);
  for (const z of [-w * .25, w * .25]) g.add(m(new THREE.CylinderGeometry(t * 1.1, t * 1.1, t * 2.6, 12), toon('#d6dbe0'), [w * .35, t, z]));   // rivets at the fixed end
  g.bend = k => {
    const R = k > 1e-3 ? L / (k * 1.6) : Infinity;
    for (const M of [A, B]) {
      const P = M.geometry.attributes.position, b = M.geometry.userData.base;
      for (let i = 0; i < P.count; i++) {
        const x = b[i * 3], y = b[i * 3 + 1];
        if (!isFinite(R)) { P.setXYZ(i, x, y, b[i * 3 + 2]); continue; }
        const a = x / R, rr = R + y;   // curl downward around a centre at (0, -R)
        P.setXYZ(i, Math.sin(a) * rr, Math.cos(a) * rr - R, b[i * 3 + 2]);
      }
      P.needsUpdate = true; M.geometry.computeVertexNormals();
    }
  };
  g.scale.setScalar(size); g.userData.part = 'bimetal strip'; return g;
}

// stamped steel lever on a pivot pin (the pin along z through the origin), arm along +x. S.turn(a) rotates it.
export function lever({ L = .16, w = .022, t = .006, color = STEEL, size = 1 } = {}) {
  const g = new THREE.Group(), arm = new THREE.Group(); g.add(arm);
  const s = new THREE.Shape(); const r = w / 2, back = L * .18;
  s.moveTo(-back, -r); s.lineTo(L, -r * .8); s.absarc(L, 0, r * .8, -Math.PI / 2, Math.PI / 2, false); s.lineTo(-back, r); s.absarc(-back, 0, r, Math.PI / 2, Math.PI * 1.5, false);
  for (const x of [0, L * .55, L]) { const h = new THREE.Path(); h.absarc(x, 0, x === 0 ? r * .45 : r * .3, 0, Math.PI * 2, true); s.holes.push(h); }
  const geo = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: true, bevelSize: t * .25, bevelThickness: t * .25, bevelSegments: 2, curveSegments: 20 });
  geo.translate(0, 0, -t / 2); arm.add(m(geo, toon(color)));
  const pin = m(new THREE.CylinderGeometry(r * .42, r * .42, t * 5, 16), toon(BRASS), [0, 0, 0], [Math.PI / 2, 0, 0]); g.add(pin);
  for (const z of [-t * 2.2, t * 2.2]) g.add(m(new THREE.CylinderGeometry(r * .7, r * .7, t * .5, 20), toon('#d6dbe0'), [0, 0, z], [Math.PI / 2, 0, 0]));   // washers
  g.turn = a => { arm.rotation.z = a; }; g.arm = arm;
  g.scale.setScalar(size); g.userData.part = 'lever'; return g;
}

// push button in a round bezel, pressing along -y. S.press(k): 0 up, 1 pressed in.
export function button({ r = .022, color = '#d23a3a', bezel = '#7d828b', size = 1 } = {}) {
  const g = new THREE.Group();
  g.add(m(new THREE.TorusGeometry(r * 1.25, r * .28, 12, 36), toon(bezel), [0, 0, 0], [Math.PI / 2, 0, 0]));
  g.add(m(new THREE.CylinderGeometry(r * 1.5, r * 1.6, r * .25, 36), toon(bezel), [0, -r * .12, 0]));
  const cap = new THREE.Group(); g.add(cap);
  const prof = [[0, 0], [r, 0], [r, r * .7], [r * .92, r * .95], [r * .5, r * 1.05], [0, r * 1.06]].map(([x, y]) => new THREE.Vector2(x, y));
  cap.add(m(new THREE.LatheGeometry(prof, 36), toon(color), [0, -r * .2, 0]));
  g.press = k => { cap.position.y = -clamp(k) * r * .6; }; g.cap = cap;
  g.scale.setScalar(size); g.userData.part = 'push button'; return g;
}

// heating plate (the hot plate under a pot, a kettle, an iron): a cast aluminium disc with the coiled element ring
// pressed into its underside, a hole in the middle where a thermostat sits. S.heat(k) makes the element glow.
export function heatingPlate({ R = .12, H = .02, hole = .3, size = 1 } = {}) {
  const g = new THREE.Group(), r0 = R * hole;
  const prof = [[r0, 0], [R, 0], [R, H * .7], [R * .97, H], [r0, H]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(m(new THREE.LatheGeometry([...prof, prof[0]], 64), toon('#b8bcc2')));
  const el = m(new THREE.TorusGeometry(R * .72, H * .32, 12, 72), toon('#5d4a40'), [0, -H * .15, 0], [Math.PI / 2, 0, 0]); g.add(el);
  const glow = new THREE.Mesh(new THREE.TorusGeometry(R * .72, H * .36, 12, 72), glowMat('#ff6a1f', 2, { transparent: true, opacity: 0 }));
  glow.position.y = -H * .15; glow.rotation.x = Math.PI / 2; glow.layers.set(1); g.add(glow);
  for (const s of [-1, 1]) g.add(m(new THREE.BoxGeometry(H * .7, H * 1.4, H * .5), toon(BRASS), [s * R * .72, -H * .7, R * .1]));   // terminals
  g.heat = k => { glow.material.opacity = clamp(k) * .95; el.material.color.set('#5d4a40').lerp(new THREE.Color('#d9541c'), clamp(k)); };
  g.scale.setScalar(size); g.userData.part = 'heating plate'; return g;
}

const poleTex = (a, b, ca, cb) => canvasTex(256, 64, (x, w, h) => {
  x.fillStyle = ca; x.fillRect(0, 0, w / 2, h); x.fillStyle = cb; x.fillRect(w / 2, 0, w / 2, h);
  x.fillStyle = '#fff'; x.font = 'bold 44px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(a, w * .25, h * .54); x.fillText(b, w * .75, h * .54);
});
// magnet: 'horseshoe' (red U with steel pole tips), 'bar' (red N / blue S, letters on it), 'disc' (dark grey ferrite puck)
export function magnet({ kind = 'horseshoe', s = .08, size = 1 } = {}) {
  const g = new THREE.Group();
  if (kind === 'horseshoe') {
    const t = s * .22;
    g.add(m(new THREE.TorusGeometry(s * .5, t / 2, 16, 40, Math.PI), toon('#d23a3a'), [0, s * .6, 0]));
    for (const x of [-1, 1]) {
      g.add(m(new THREE.CylinderGeometry(t / 2, t / 2, s * .45, 20), toon('#d23a3a'), [x * s * .5, s * .375, 0]));
      g.add(m(new THREE.CylinderGeometry(t / 2, t / 2, s * .16, 20), toon('#c9cfd6'), [x * s * .5, s * .08, 0]));
    }
  } else if (kind === 'bar') {
    const tex = poleTex('N', 'S', '#d23a3a', '#3b62b5'), mat = toon('#ffffff', { map: tex });
    g.add(m(new THREE.BoxGeometry(s * 1.6, s * .3, s * .4), [toon('#3b62b5'), toon('#d23a3a'), mat, mat, mat, mat], [0, s * .15, 0]));
  } else {
    g.add(m(new THREE.CylinderGeometry(s * .5, s * .5, s * .22, 40), toon('#4a4d55'), [0, s * .11, 0]));
    g.add(m(new THREE.TorusGeometry(s * .5, s * .015, 6, 40), toon('#6c707a'), [0, s * .22, 0], [Math.PI / 2, 0, 0]));
  }
  g.scale.setScalar(size); g.userData.part = 'magnet'; return g;
}

// screw with a cross head, thread along -y from the head at the origin
export function screw({ len = .05, r = .006, color = STEEL, size = 1 } = {}) {
  const g = new THREE.Group(), mat = toon(color);
  const head = [[0, 0], [r * 2, 0], [r * 2, r * .4], [r * 1.6, r * 1.1], [0, r * 1.2]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(m(new THREE.LatheGeometry(head, 28), mat));
  for (const a of [0, Math.PI / 2]) g.add(m(new THREE.BoxGeometry(r * 2.6, r * .5, r * .45), toon(DARK), [0, r * 1.05, 0], [0, a, 0]));
  g.add(m(new THREE.CylinderGeometry(r * .72, r * .72, len, 16), mat, [0, -len / 2, 0]));
  const pts = []; const turns = len / (r * .7);
  for (let i = 0; i <= turns * 24; i++) { const u = i / (turns * 24), a = u * turns * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r * .78, -u * len * .95, Math.sin(a) * r * .78)); }
  g.add(m(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length, r * .18, 5), mat));
  g.add(m(new THREE.ConeGeometry(r * .72, r * 1.4, 16), mat, [0, -len - r * .7, 0], [Math.PI, 0, 0]));
  g.scale.setScalar(size); g.userData.part = 'screw'; return g;
}

// power cable along a list of points, ending in a plug: 'wall' (two round pins, a moulded body), 'usb' (USB-C), or none
export function cable({ points = [[0, 0, 0], [.15, .02, .05], [.3, 0, 0]], r = .006, color = '#2c2f36', plug = 'wall', size = 1 } = {}) {
  const g = new THREE.Group(), mat = toon(color);
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  g.add(m(new THREE.TubeGeometry(curve, 80, r, 10), mat));
  const end = curve.getPoint(1), dir = curve.getTangent(1).normalize();
  const P = new THREE.Group(); P.position.copy(end); P.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); g.add(P);
  if (plug === 'wall') {
    P.add(m(new THREE.CylinderGeometry(r * 1.6, r * 2.4, r * 4, 16), mat, [0, r * 2, 0]));
    P.add(m(new THREE.BoxGeometry(r * 6, r * 4, r * 4), mat, [0, r * 6, 0]));
    for (const s of [-1, 1]) P.add(m(new THREE.CylinderGeometry(r * .55, r * .55, r * 4, 12), toon('#d8dde3'), [s * r * 1.6, r * 10, 0]));
  } else if (plug === 'usb') {
    P.add(m(new THREE.BoxGeometry(r * 2.6, r * 5, r * 1.6), toon('#e9ecef'), [0, r * 2.5, 0]));
    P.add(m(new THREE.BoxGeometry(r * 1.6, r * 1.6, r * .6), toon('#c9cfd6'), [0, r * 5.8, 0]));
  }
  g.scale.setScalar(size); g.userData.part = 'cable'; return g;
}

// integrated circuit: black epoxy body, metal legs on two sides (or four: quad), a pin-1 dot and printed marking
export function chip({ w = .05, d = .05, h = .008, pins = 8, quad = false, size = 1 } = {}) {
  const g = new THREE.Group();
  const tex = canvasTex(256, 256, (x, W, H) => {
    x.fillStyle = '#1d1f24'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#8d929b'; x.font = 'bold 34px monospace'; x.textAlign = 'center'; x.fillText('IC-7404', W / 2, H * .52); x.font = '24px monospace'; x.fillText('2416', W / 2, H * .68);
    x.beginPath(); x.arc(W * .16, H * .16, 14, 0, Math.PI * 2); x.fillStyle = '#34373e'; x.fill();
  });
  const body = toon('#1d1f24'), top = toon('#ffffff', { map: tex });
  g.add(m(new THREE.BoxGeometry(w, h, d), [body, body, top, body, body, body], [0, h / 2 + h * .4, 0]));
  const leg = toon('#cfd4da'), sides = quad ? [0, 1, 2, 3] : [0, 2];
  for (const s of sides) for (let i = 0; i < pins; i++) {
    const a = s * Math.PI / 2, L = (s % 2 ? w : d) * .8, t = (i + .5) / pins - .5, ext = (s % 2 ? d : w) / 2;
    const p = new THREE.Group(); p.rotation.y = a; g.add(p);
    p.add(m(new THREE.BoxGeometry(h * .6, h * .2, L / pins * .45), leg, [ext + h * .3, h * .6, t * L]));
    p.add(m(new THREE.BoxGeometry(h * .2, h * .6, L / pins * .45), leg, [ext + h * .55, h * .3, t * L]));
  }
  g.scale.setScalar(size); g.userData.part = 'chip'; return g;
}

// printed circuit board: green solder mask, copper traces and pads, a few chips, capacitors and resistors on it
export function pcb({ w = .3, d = .2, t = .006, seed = 9, parts = true, size = 1 } = {}) {
  const g = new THREE.Group(), r = mulberry(seed);
  const tex = canvasTex(1024, Math.round(1024 * d / w), (x, W, H) => {
    x.fillStyle = '#1f6b3e'; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#3f9a5d'; x.lineWidth = 6; x.lineCap = 'round';
    for (let i = 0; i < 70; i++) {
      let px = r() * W, py = r() * H; x.beginPath(); x.moveTo(px, py);
      for (let k = 0; k < 3; k++) { if (r() < .5) px += (r() - .5) * W * .5; else py += (r() - .5) * H * .5; x.lineTo(px, py); }
      x.stroke();
    }
    x.fillStyle = '#d6b25a';
    for (let i = 0; i < 120; i++) { x.beginPath(); x.arc(r() * W, r() * H, 6, 0, Math.PI * 2); x.fill(); }
    x.strokeStyle = '#d6b25a'; x.lineWidth = 3; for (const [a, b] of [[.03, .03], [.97, .03], [.03, .97], [.97, .97]]) { x.beginPath(); x.arc(a * W, b * H, 16, 0, Math.PI * 2); x.stroke(); }
    x.fillStyle = '#e9ecef'; x.font = '22px monospace'; x.fillText('R12  C4  U2', W * .62, H * .93);
  });
  const edge = toon('#2a7a4a');
  g.add(m(new THREE.BoxGeometry(w, t, d), [edge, edge, toon('#ffffff', { map: tex }), edge, edge, edge], [0, t / 2, 0]));
  if (parts) {
    const c1 = chip({ w: w * .18, d: w * .18, h: t * 1.1, pins: 8, quad: true }); c1.position.set(-w * .15, t, -d * .05); g.add(c1);
    const c2 = chip({ w: w * .14, d: w * .08, h: t, pins: 4 }); c2.position.set(w * .2, t, d * .2); g.add(c2);
    for (let i = 0; i < 3; i++) {   // electrolytic capacitors: a can with a stripe and a scored top
      const cap = new THREE.Group(); cap.position.set(w * (.18 + i * .09), t, -d * .22); g.add(cap);
      cap.add(m(new THREE.CylinderGeometry(w * .03, w * .03, w * .1, 20), toon('#2d4f8f'), [0, w * .05, 0]));
      cap.add(m(new THREE.CylinderGeometry(w * .031, w * .031, w * .1, 20, 1, true, 0, .7), toon('#cfd8e6'), [0, w * .05, 0]));
      cap.add(m(new THREE.CylinderGeometry(w * .028, w * .028, w * .004, 20), toon('#c4cad3'), [0, w * .101, 0]));
    }
    for (let i = 0; i < 4; i++) {   // resistors: a beige body with colour bands, legs into the board
      const R = new THREE.Group(); R.position.set(-w * .38 + i * w * .07, t + w * .015, d * .3); g.add(R);
      R.add(m(new THREE.CapsuleGeometry(w * .012, w * .035, 4, 10), toon('#d9c08f'), [0, 0, 0], [0, 0, Math.PI / 2]));
      ['#8a4b2a', '#000000', '#d23a3a'].forEach((c, k) => R.add(m(new THREE.TorusGeometry(w * .0125, w * .003, 6, 16), toon(c), [(k - 1) * w * .011, 0, 0], [0, Math.PI / 2, 0])));
    }
  }
  g.scale.setScalar(size); g.userData.part = 'circuit board'; return g;
}

// battery: 'aa' (cylindrical cell, + nub, label band), 'pouch' (a phone's flat silver lithium pouch with tabs and label)
export function battery({ kind = 'aa', s = .1, color = '#2b2f36', band = '#e2a52a', size = 1 } = {}) {
  const g = new THREE.Group();
  if (kind === 'aa') {
    const r = s * .145;
    g.add(m(new THREE.CylinderGeometry(r, r, s, 32), toon(color), [0, s / 2, 0]));
    g.add(m(new THREE.CylinderGeometry(r * 1.002, r * 1.002, s * .35, 32, 1, true), toon(band), [0, s * .78, 0]));
    g.add(m(new THREE.CylinderGeometry(r * .96, r * .96, s * .02, 32), toon('#c9cfd6'), [0, s * 1.005, 0]));
    g.add(m(new THREE.CylinderGeometry(r * .35, r * .38, s * .06, 20), toon('#c9cfd6'), [0, s * 1.04, 0]));
    g.add(m(new THREE.CylinderGeometry(r * .96, r * .96, s * .01, 32), toon('#c9cfd6'), [0, -s * .002, 0]));
    const tex = canvasTex(256, 64, (x, W, H) => { x.fillStyle = band; x.fillRect(0, 0, W, H); x.fillStyle = '#1d1f24'; x.font = 'bold 40px sans-serif'; x.fillText('+  1.5V', 20, 46); });
    g.add(m(new THREE.CylinderGeometry(r * 1.004, r * 1.004, s * .2, 32, 1, true, 0, Math.PI * .8), toon('#ffffff', { map: tex }), [0, s * .78, 0]));
  } else {
    const w = s * .65, L = s, t = s * .05;
    const tex = canvasTex(512, 768, (x, W, H) => {
      x.fillStyle = '#c9ced6'; x.fillRect(0, 0, W, H); x.fillStyle = '#1d1f24'; x.fillRect(W * .1, H * .12, W * .8, H * .5);
      x.fillStyle = '#e9ecef'; x.font = 'bold 54px sans-serif'; x.fillText('Li-ion', W * .2, H * .3); x.font = '36px sans-serif'; x.fillText('3.85V  4500mAh', W * .14, H * .42);
      x.fillStyle = '#d23a3a'; x.fillRect(W * .1, H * .66, W * .8, H * .05);
    });
    const side = toon('#b9bfc8');
    g.add(m(RoundedBox(w, t, L, t * .45), side, [0, t / 2, 0]));
    g.add(m(new THREE.PlaneGeometry(w * .94, L * .94), toon('#ffffff', { map: tex }), [0, t + .0004, 0], [-Math.PI / 2, 0, 0]));
    for (const x of [-w * .15, w * .15]) g.add(m(new THREE.BoxGeometry(w * .1, t * .2, L * .1), toon(x < 0 ? '#c9cfd6' : COPPER), [x, t * .55, -L / 2 - L * .04]));
    g.add(m(new THREE.BoxGeometry(w * .5, t * .35, L * .07), toon('#1f6b3e'), [0, t * .55, -L / 2 + L * .02]));   // the protection board
  }
  g.scale.setScalar(size); g.userData.part = 'battery'; return g;
}
function RoundedBox(w, h, d, r) {   // a box with rounded vertical edges (enough for a pouch cell)
  const s = new THREE.Shape(), x = w / 2 - r, z = d / 2 - r;
  s.moveTo(-x, -d / 2); s.lineTo(x, -d / 2); s.absarc(x, -z, r, -Math.PI / 2, 0); s.lineTo(w / 2, z); s.absarc(x, z, r, 0, Math.PI / 2);
  s.lineTo(-x, d / 2); s.absarc(-x, z, r, Math.PI / 2, Math.PI); s.lineTo(-w / 2, -z); s.absarc(-x, -z, r, Math.PI, Math.PI * 1.5);
  const geo = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 8 });
  geo.rotateX(Math.PI / 2); geo.translate(0, h / 2, 0); geo.clearGroups(); return geo;
}

// spur gear with a hub and a bore, lying in the xy plane (axis along z). S.spin(a)
export function gear({ R = .06, teeth = 16, t = .012, color = BRASS, size = 1 } = {}) {
  const g = new THREE.Group(), s = new THREE.Shape(), rr = R * .86, N = teeth * 4;
  for (let i = 0; i <= N; i++) {
    const a = i / N * Math.PI * 2, ph = (i % 4), r = ph === 1 || ph === 2 ? R : rr;
    i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const h = new THREE.Path(); h.absarc(0, 0, R * .18, 0, Math.PI * 2, true); s.holes.push(h);
  const geo = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: true, bevelSize: t * .08, bevelThickness: t * .08, bevelSegments: 1 });
  geo.translate(0, 0, -t / 2); const body = m(geo, toon(color)); g.add(body);
  g.add(m(new THREE.TorusGeometry(R * .32, R * .06, 8, 32), toon(color), [0, 0, t * .55]));
  g.spin = a => { body.rotation.z = a; };
  g.scale.setScalar(size); g.userData.part = 'gear'; return g;
}

// a bent spring-steel contact pair, the heart of every switch: a fixed contact and a moving blade with silver tips.
// S.close(k): 0 open (gap), 1 touching. S.spark(k) shows the arc at the gap.
export function contacts({ L = .08, size = 1 } = {}) {
  const g = new THREE.Group(), t = L * .04, w = L * .2;
  g.add(m(new THREE.BoxGeometry(L * .3, L * .4, w * 1.4), toon('#ece8df'), [-L * .1, L * .2, 0]));   // the insulating (ceramic) block
  for (const y of [L * .15, L * .32]) {   // a screw terminal and a wire on each blade: it is electrical
    g.add(m(new THREE.CylinderGeometry(t * 1.6, t * 1.6, t * 1.2, 14), toon(STEEL), [-L * .26, y, 0], [0, 0, Math.PI / 2]));
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(-L * .27, y, 0), new THREE.Vector3(-L * .5, y + L * .02, w * .2), new THREE.Vector3(-L * .8, y - L * .1, w * .5)]);
    g.add(m(new THREE.TubeGeometry(c, 20, t * .8, 8), toon(y < L * .2 ? '#d23a3a' : '#2c2f36')));
  }
  g.add(m(new THREE.BoxGeometry(L, t, w * .6), toon(COPPER), [L * .45, L * .15, 0]));
  const blade = new THREE.Group(); blade.position.set(0, L * .32, 0); g.add(blade);
  blade.add(m(new THREE.BoxGeometry(L, t, w * .6), toon(COPPER), [L * .5, 0, 0]));
  const tipA = m(new THREE.SphereGeometry(t * 1.8, 14, 10), toon('#e6e9ed'), [L * .9, L * .15 + t, 0]); g.add(tipA);
  blade.add(m(new THREE.SphereGeometry(t * 1.8, 14, 10), toon('#e6e9ed'), [L * .9, -t, 0]));
  const arc = new THREE.Mesh(new THREE.SphereGeometry(t * 1.6, 12, 8), glowMat('#bfe6ff', 3, { transparent: true, opacity: 0 }));
  arc.position.set(L * .9, L * .23, 0); arc.layers.set(1); g.add(arc);
  const open = Math.atan2(L * .17 - t * 2.6, L * .9);
  g.close = k => { blade.rotation.z = -open * clamp(k); };
  g.spark = k => { arc.material.opacity = clamp(k); };
  g.close(0);
  g.scale.setScalar(size); g.userData.part = 'switch contacts'; return g;
}
