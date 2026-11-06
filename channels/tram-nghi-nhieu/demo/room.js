// The bedroom diorama: bed, pillow, nightstand, socket + charger + cable, window with moon, curtain, phone, hand, heat.
import * as THREE from 'three';
import { PAL, toon, glowMat, TEX, rbox, mesh, fxLayer, cushionGeo, surface, mulberry, clamp, lerp, seg, ss, eo, back } from '../rig/kit.js';
import { squiggle, glowDots, halos, setDot, setHalo, buildHand, heatColor } from '../rig/fx.js';
import { keyLight, ambience, wallWithHole, beam, shadowFlags } from '../rig/lights.js';

export const PHONE = new THREE.Vector3(-.84, .632, .62);

export function buildRoom() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#10121c');
  scene.fog = new THREE.Fog('#141a33', 5, 12);

  // ── lights ──
  const WX0 = -2.35, WX1 = -1.05, WY0 = 1.35, WY1 = 2.35;
  const moon = keyLight(scene, { from: new THREE.Vector3(-1.7 - .45 * 7, 1.85 + .75 * 7, -7), to: new THREE.Vector3(-1.7 + .45 * 1.6, 1.85 - .75 * 1.6, 1.6) });
  ambience(scene);
  const screenL = new THREE.PointLight('#ffb36b', .06, 1.4, 2); scene.add(screenL);
  const ledL = new THREE.PointLight(PAL.cyan, .25, .5, 2); ledL.position.set(.14, .84, .14); scene.add(ledL);
  const heatL = new THREE.PointLight(PAL.red, 0, 1.2, 2); scene.add(heatL);

  // ── materials ──
  const M = {
    wall: toon('#d7c4a8', { map: TEX.wall() }),
    floor: toon('#ffffff', { map: TEX.floor() }),
    wood: toon('#ffffff', { map: TEX.wood() }),
    woodDark: toon('#6b3d22'),
    sheet: toon('#ffffff', { map: TEX.sheet() }),
    pillow: toon('#ffffff', { map: TEX.pillow() }),
    blanket: toon('#ffffff', { map: TEX.blanket(), side: THREE.DoubleSide }),
    cushion: toon('#7d4fc0'),
    cream: toon(PAL.cream), navy: toon(PAL.navy), ink: toon(PAL.ink),
    curtain: toon('#8a5bd6', { side: THREE.DoubleSide }),
    frame: toon('#efe2c8'),
    rug: toon('#ffffff', { map: TEX.rug() }),
    lampShade: toon('#f2d9a6'), brass: toon('#c9973a'),
    book1: toon('#f04462'), book2: toon('#2f8fa0'), mug: toon('#f7bd27'),
    leaf: new THREE.MeshBasicMaterial({ color: '#0b0d18' }),
  };
  M.wall.map.repeat.set(3, 3); M.floor.map.repeat.set(1.6, 1.6); M.sheet.map.repeat.set(3, 3); M.blanket.map.repeat.set(2.4, 2.4); M.pillow.map.repeat.set(1, 1);

  // ── room shell ──
  const floor = mesh(new THREE.PlaneGeometry(9, 7), M.floor, [-.6, 0, 2.5], { rot: [-Math.PI / 2, 0, 0], cast: false }); scene.add(floor);
  const rug = mesh(rbox(2.4, .012, 1.6, .005), M.rug, [-.8, .006, 3.0]); scene.add(rug);
  wallWithHole(scene, M.wall, { x0: WX0, x1: WX1, y0: WY0, y1: WY1 });
  const WT = .16;
  { const m = mesh(new THREE.BoxGeometry(WT, 3.4, 7), M.wall, [-3.9, 1.7, 3.5]); m.userData.tag = 'side'; scene.add(m); }
  scene.add(mesh(rbox(7, .1, .03, .01), M.frame, [-.5, .05, .015])); // baseboard
  // window frame + mullions + sill
  const fr = (w, h, x, y, d = .2) => { const m = mesh(rbox(w, h, d, .012), M.frame, [x, y, -.06]); m.userData.tag = 'frame'; scene.add(m); };
  fr(WX1 - WX0 + .1, .07, (WX0 + WX1) / 2, WY1 + .02); fr(WX1 - WX0 + .1, .07, (WX0 + WX1) / 2, WY0 - .02);
  fr(.07, WY1 - WY0 + .1, WX0 - .02, (WY0 + WY1) / 2); fr(.07, WY1 - WY0 + .1, WX1 + .02, (WY0 + WY1) / 2);
  fr(.04, WY1 - WY0, (WX0 + WX1) / 2, (WY0 + WY1) / 2, .08); fr(WX1 - WX0, .04, (WX0 + WX1) / 2, (WY0 + WY1) / 2 + .05, .08);
  scene.add(mesh(rbox(WX1 - WX0 + .3, .05, .2, .015), M.frame, [(WX0 + WX1) / 2, WY0 - .07, .06]));
  // sky + moon + city behind the window
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec2 vUv; uniform float uT;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      void main(){
        vec3 top = vec3(.035,.04,.11), bot = vec3(.16,.09,.3);
        vec3 c = mix(bot, top, smoothstep(.2,.85,vUv.y));
        vec2 g = floor(vUv*vec2(220.,130.)); float s = h(g);
        float tw = .6 + .4*sin(uT*2. + s*40.);
        if (s > .985) c += vec3(.9,.85,.7) * tw * (s-.985)*60. * smoothstep(.35,.6,vUv.y);
        gl_FragColor = vec4(c,1.);
      }`,
  }));
  sky.position.set(-3, 2.2, -2.6); scene.add(sky);
  const moonDisc = new THREE.Mesh(new THREE.CircleGeometry(.32, 48), glowMat('#fff3d6', 2.2)); moonDisc.position.set(-4.5, 1.75, -2.4); scene.add(moonDisc);
  const moonHalo = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ map: TEX.radial(), color: new THREE.Color('#8fa2ff').multiplyScalar(.5), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  moonHalo.position.set(-4.5, 1.75, -2.45); scene.add(moonHalo);
  const city = new THREE.Group(); scene.add(city);
  { const r = mulberry(21); let x = -7; while (x < 0) { const w = .3 + r() * .5, h = .4 + r() * 1.2; city.add(mesh(new THREE.BoxGeometry(w, h, .1), new THREE.MeshBasicMaterial({ color: '#0d1024' }), [x + w / 2, .9 + h / 2, -2.3], { cast: false, recv: false }));
    for (let k = 0; k < 4; k++) if (r() > .4) city.add(mesh(new THREE.PlaneGeometry(.05, .07), glowMat('#ffc46b', 1.2), [x + .08 + r() * (w - .16), .95 + r() * h * .9, -2.24], { cast: false, recv: false }));
    x += w + .05; } }
  // tree branch outside: casts leafy moon-shadows into the room
  const branch = new THREE.Group(); branch.position.set(-2.55, 3.65, -1.0); scene.add(branch); branch.userData.tag = 'branch';
  { const r = mulberry(7), bm = new THREE.MeshBasicMaterial({ color: '#0b0d18' });
    const twig = (p, len, ang, depth) => {
      const g = new THREE.Group(); g.position.copy(p); g.rotation.z = ang; branch.add(g);
      const c = mesh(new THREE.CylinderGeometry(.012 * depth, .02 * depth, len, 6), bm, [0, -len / 2, 0], { parent: g, recv: false });
      for (let k = 0; k < 6; k++) mesh(new THREE.SphereGeometry(.07 + r() * .05, 6, 4), M.leaf, [(r() - .5) * .3, -len * (.3 + r() * .7), (r() - .5) * .2], { parent: g, recv: false }).scale.set(1.4, .55, 1);
      return g;
    };
    const P = new THREE.Vector3();
    twig(P.set(0, 0, 0), 1.6, -.9, 2); twig(P.set(-.5, -.4, 0), 1.0, -.3, 1.4); twig(P.set(-.9, -.7, 0), .9, -1.4, 1.2); twig(P.set(-.3, -.2, .1), .8, .4, 1.1);
  }


  beam(scene, moon, { x0: WX0, x1: WX1, y0: WY0, y1: WY1 });
  // framed picture on the wall, and a plant in the near corner
  const picTex = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 192; const g = c.getContext('2d');
    g.fillStyle = '#f7bd27'; g.fillRect(0, 0, 256, 192); g.fillStyle = '#f04462'; g.beginPath(); g.arc(170, 80, 34, 0, 7); g.fill();
    g.fillStyle = '#252d50'; g.beginPath(); g.moveTo(0, 192); g.lineTo(70, 90); g.lineTo(130, 150); g.lineTo(190, 110); g.lineTo(256, 192); g.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  scene.add(mesh(rbox(.62, .48, .04, .012), M.woodDark, [.62, 1.5, .02]));
  scene.add(mesh(new THREE.PlaneGeometry(.52, .38), toon('#ffffff', { map: picTex }), [.62, 1.5, .042], { cast: false }));
  const plant = new THREE.Group(); plant.position.set(1.75, 0, 1.75); plant.scale.setScalar(1.5); scene.add(plant);
  plant.add(mesh(new THREE.CylinderGeometry(.16, .12, .34, 24), toon('#c75a3a'), [0, .17, 0]));
  plant.add(mesh(new THREE.TorusGeometry(.16, .025, 8, 24), toon('#a8482d'), [0, .34, 0], { rot: [Math.PI / 2, 0, 0] }));
  const leaves = [];
  { const r = mulberry(41), lm = toon('#3d8a5a', { side: THREE.DoubleSide });
    for (let k = 0; k < 9; k++) { const g = new THREE.Group(); g.position.set(0, .33, 0); g.rotation.set(0, k * 2.4 + r(), 0); plant.add(g);
      const lf = new THREE.Mesh(new THREE.SphereGeometry(.13, 12, 8), lm); lf.scale.set(.35, 1.4, .08); lf.position.set(.1, .2 + r() * .15, 0); lf.rotation.z = -.5 - r() * .4; lf.castShadow = true; lf.receiveShadow = true; g.add(lf); leaves.push(g); } }

  // curtain rod + two short curtains
  scene.add(mesh(new THREE.CylinderGeometry(.018, .018, 2.4, 12), M.brass, [(WX0 + WX1) / 2, WY1 + .18, .2], { rot: [0, 0, Math.PI / 2] }));
  const curtains = [];
  for (const [x0, x1, seed] of [[-2.95, -2.3, 1], [-1.1, -.5, 2]]) {
    const geo = new THREE.PlaneGeometry(1, 1, 30, 40);
    const c = mesh(geo, M.curtain, [0, 0, 0]); c.userData = { x0, x1, seed, tag: 'curtain' }; scene.add(c); curtains.push(c);
  }
  const curtainAt = (c, t) => {
    const { x0, x1, seed } = c.userData, p = c.geometry.attributes.position, uv = c.geometry.attributes.uv;
    const gust = .5 + .5 * Math.sin(t * .9 + seed) * Math.sin(t * .37 + 2 * seed);
    for (let i = 0; i < p.count; i++) {
      const u = uv.getX(i), v = uv.getY(i), hang = 1 - v;
      const x = lerp(x0, x1, u) + Math.sin(t * 1.3 + u * 3 + seed) * .025 * hang * hang;
      const y = lerp(WY1 + .16, WY0 - .25, hang);
      const z = .22 + .04 * Math.sin(u * Math.PI * 9 + seed) + hang * hang * (.03 + .09 * gust) * (1 + .3 * Math.sin(u * 5 + t * 1.7));
      p.setXYZ(i, x, y, z);
    }
    p.needsUpdate = true; c.geometry.computeVertexNormals();
  };

  // ── bed ──
  const bed = new THREE.Group(); scene.add(bed);
  const BX = -1.7;
  bed.add(mesh(rbox(2.5, 1.15, .09, .03), M.wood, [BX, .575, .06]));
  bed.add(mesh(rbox(2.2, .46, .07, .03, 4), M.cushion, [BX, .88, .14]));
  for (const x of [-.8, -.25, .3, .85]) bed.add(mesh(new THREE.SphereGeometry(.018, 10, 8), M.brass, [BX + x, .88, .18]));
  bed.add(mesh(rbox(2.48, .22, 2.85, .03), M.wood, [BX, .27, 1.5]));
  for (const [x, z] of [[-1.15, 2.85], [1.15, 2.85]]) bed.add(mesh(rbox(.12, .2, .12, .02), M.woodDark, [BX + x, .08, z]));
  bed.add(mesh(rbox(2.36, .26, 2.75, .07, 4), M.sheet, [BX, .49, 1.48]));
  // blanket: draped surface with folds, hem roll at the top
  const blanketGeo = surface(80, 80, (u, v) => {
    const a = lerp(-1.36, 1.36, u), half = 1.18, ex = Math.max(0, Math.abs(a) - half), sg = Math.sign(a);
    const z = lerp(1.25, 2.95, v);
    const R = .1, ang = Math.min(ex / R, 1) * Math.PI / 2;
    let x = BX + sg * (Math.min(Math.abs(a), half) + R * Math.sin(ang));
    let y = .695 - R * (1 - Math.cos(ang)) - Math.max(0, ex - R);
    const wr = .014 * Math.sin(a * 6 + z * 3) + .02 * Math.sin(z * 7 + a * 2) * ss(1 - Math.abs(a) / 1.3) + .03 * Math.sin(a * 3.1 + 1.2) * Math.sin(z * 2.2);
    if (ex > R) x += sg * .02 * Math.sin(z * 9 + a * 3);
    y += wr * (ex > 0 ? .4 : 1);
    return [x, y, z];
  });
  bed.add(mesh(blanketGeo, M.blanket, [0, 0, 0], { cast: false }));
  const hemGeo = new THREE.CapsuleGeometry(.055, 2.35, 8, 20); { const p = hemGeo.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i), k = 1 + .14 * Math.sin(y * 7.3) * Math.sin(y * 2.1 + 1) + .06 * Math.sin(y * 19); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); } hemGeo.computeVertexNormals(); }
  const hem = mesh(hemGeo, toon('#efe6d6'), [BX, .705, 1.26], { rot: [0, 0, Math.PI / 2] }); hem.scale.set(1, 1, .75); bed.add(hem);

  // pillows
  const pillowR = new THREE.Group(); pillowR.position.set(-1.22, .73, .5); scene.add(pillowR);
  const pillowMesh = mesh(cushionGeo(.86, .24, .54, .1), M.pillow, [0, 0, 0], { parent: pillowR }); pillowR.rotation.set(0, -.06, 0);
  const pillowL = mesh(cushionGeo(.86, .24, .54, 0), M.pillow, [-2.18, .72, .48], { rot: [.04, .08, 0] }); scene.add(pillowL);

  // ── nightstand ──
  const ns = new THREE.Group(); ns.position.set(-.03, 0, .28); scene.add(ns);
  ns.add(mesh(rbox(.72, .05, .5, .015), M.wood, [0, .6, 0]));
  ns.add(mesh(rbox(.64, .48, .42, .01), M.wood, [0, .34, -.01]));
  ns.add(mesh(rbox(.56, .17, .03, .012), M.wood, [0, .47, .21]));
  ns.add(mesh(rbox(.56, .2, .03, .012), M.wood, [0, .24, .21]));
  for (const y of [.47, .24]) ns.add(mesh(new THREE.SphereGeometry(.022, 12, 8), M.brass, [0, y, .235]));
  for (const [x, z] of [[-.28, -.17], [.28, -.17], [-.28, .17], [.28, .17]]) ns.add(mesh(new THREE.CylinderGeometry(.022, .016, .12, 10), M.woodDark, [x, .06, z]));
  // lamp (off)
  const lamp = new THREE.Group(); lamp.position.set(-.2, .625, -.12); ns.add(lamp);
  lamp.add(mesh(new THREE.CylinderGeometry(.07, .085, .03, 24), M.brass, [0, .015, 0]));
  lamp.add(mesh(new THREE.CylinderGeometry(.012, .012, .26, 10), M.brass, [0, .15, 0]));
  lamp.add(mesh(new THREE.CylinderGeometry(.09, .15, .17, 28, 1, true), M.lampShade, [0, .3, 0]));
  // books + mug
  ns.add(mesh(rbox(.24, .04, .17, .006), M.book1, [.08, .645, .15], { rot: [0, .2, 0] }));
  ns.add(mesh(rbox(.22, .035, .16, .006), M.book2, [.09, .683, .15], { rot: [0, -.1, 0] }));
  ns.add(mesh(new THREE.CylinderGeometry(.045, .04, .1, 20), M.mug, [.26, .675, .02]));
  ns.add(mesh(new THREE.TorusGeometry(.03, .009, 8, 16), M.mug, [.31, .68, .02], { rot: [0, 0, 0] }));

  // ── socket + charger ──
  const SOCK = new THREE.Vector3(.14, .86, 0);
  scene.add(mesh(rbox(.14, .14, .02, .01), M.cream, [SOCK.x, SOCK.y, .01]));
  const charger = mesh(rbox(.085, .1, .075, .018), M.cream, [SOCK.x, SOCK.y, .055]); scene.add(charger);
  const led = mesh(new THREE.SphereGeometry(.007, 10, 8), glowMat(PAL.cyan, 4), [SOCK.x + .025, SOCK.y + .03, .094], { cast: false }); scene.add(led);
  // cable
  const cablePts = [
    [.14, .81, .07], [.13, .72, .1], [.08, .655, .15], [-.04, .652, .27], [-.24, .652, .38], [-.37, .62, .47],
    [-.44, .54, .53], [-.5, .6, .58], [-.55, .66, .6], [-.62, .645, .615], [-.655, .638, .62],
  ].map(p => new THREE.Vector3(...p));
  const curve = new THREE.CatmullRomCurve3(cablePts, false, 'catmullrom', .4);
  const cableMat = toon('#f5ead6', { transparent: true, opacity: 1 });
  const cable = mesh(new THREE.TubeGeometry(curve, 240, .011, 12, false), cableMat, [0, 0, 0]); scene.add(cable);
  const plugEnd = mesh(rbox(.05, .02, .032, .006), M.cream, [-.66 + .025, .638, .62]); scene.add(plugEnd);

  // ── phone ──
  const phone = new THREE.Group(); phone.position.copy(PHONE); phone.rotation.y = .04; scene.add(phone);
  const phoneMat = toon(PAL.navy, { emissive: new THREE.Color(0, 0, 0) });
  phone.add(mesh(rbox(.34, .026, .17, .012, 4), phoneMat, [0, 0, 0]));
  const scrTex = TEX.screen(); scrTex.center.set(.5, .5); scrTex.rotation = -Math.PI / 2;
  const scrMat = new THREE.MeshBasicMaterial({ map: scrTex, color: new THREE.Color(.8, .8, .8), toneMapped: false });
  const screen = mesh(new THREE.PlaneGeometry(.31, .145), scrMat, [0, .0135, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }); phone.add(screen);
  phone.add(mesh(new THREE.BoxGeometry(.004, .008, .03), M.ink, [.171, 0, 0]));
  // heat glow under the pillow
  const glowTex = TEX.radial();
  const underGlow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glowTex, color: new THREE.Color(PAL.red), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  underGlow.rotation.x = -Math.PI / 2; underGlow.position.set(PHONE.x - .02, .65, PHONE.z); fxLayer(underGlow); scene.add(underGlow);
  const phoneAura = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glowTex, color: new THREE.Color('#ffb36b'), transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  phoneAura.rotation.x = -Math.PI / 2; phoneAura.position.set(PHONE.x + .05, .64, PHONE.z); phoneAura.scale.set(.7, .45, 1); fxLayer(phoneAura); scene.add(phoneAura);

  // ── electrons along the cable ──
  const NE = 220, eDots = glowDots(NE, .0045, PAL.cyan, 3), eHalo = halos(NE, PAL.cyan, .3, glowTex);
  scene.add(eDots, eHalo);
  // dust motes in the moonbeam
  const ND = 70, motes = halos(ND, '#c8d4ff', .25, glowTex); scene.add(motes);
  const moteR = mulberry(99), moteP = Array.from({ length: ND }, () => [moteR(), moteR(), moteR(), moteR()]);

  // ── heat squiggles ──
  const NS = 9, sq = Array.from({ length: NS }, () => { const s = squiggle(); scene.add(s); return s; });

  // ── hand ──
  const hand = buildHand(); scene.add(hand); hand.visible = false;

  // ── state as functions of t ──
  const trapped = t => ss(seg(t, 13, 16.4)) * (1 - ss(seg(t, 16.65, 17.6)));
  const heatB = t => t < 13 ? .12 + .1 * seg(t, 0, 8) : lerp(.72, 1, seg(t, 13, 16.5)) * (1 - .9 * ss(seg(t, 16.8, 18.4)));
  // pillow pull (anticipation, yank, overshoot)
  const pullT = t => {
    if (t < 16.4) return 0;
    if (t < 16.56) return -.06 * Math.sin(seg(t, 16.4, 16.56) * Math.PI);  // squeeze before the yank
    return back(seg(t, 16.56, 17.25), 1.4);
  };
  const handGrip = new THREE.Vector3(.5, .13, .08); // pillow-local: palm against the pillow's end
  const qBase = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2)), qTilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(.4, 0, -.5)), qG = new THREE.Quaternion().multiplyQuaternions(qTilt, qBase);
  const armDir = new THREE.Vector3(0, 1, 0).applyQuaternion(qTilt);
  const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _hc = new THREE.Color(), _m4 = new THREE.Matrix4();
  const tmpCol = new THREE.Color();

  function update(t, cam) {
    sky.material.uniforms.uT.value = t; moonDisc.lookAt(cam.position); moonHalo.lookAt(cam.position);
    curtains.forEach(c => curtainAt(c, t));
    leaves.forEach((g, i) => { g.rotation.x = .04 * Math.sin(t * 1.1 + i); });
    branch.rotation.z = .03 * Math.sin(t * .8) + .015 * Math.sin(t * 2.1);
    branch.rotation.x = .02 * Math.sin(t * .6 + 1);
    // LED breathing + blink
    const ledK = .35 + .65 * Math.pow(.5 + .5 * Math.sin(t * 2.4), 3);
    led.material.color.set(PAL.cyan).multiplyScalar(.5 + 1.3 * ledK); ledL.intensity = .002 + .008 * ledK;

    // phone heat
    const hb = heatB(t), tr = trapped(t);
    heatColor(hb, _hc);
    phoneMat.emissive.copy(_hc).multiplyScalar(t > 12.9 ? .55 * hb : .04);
    screenL.position.set(PHONE.x + .12, .84, PHONE.z + .06);
    screenL.color.set('#ffb36b'); screenL.intensity = .07 + .006 * Math.sin(t * 1.3);
    phoneAura.material.color.set('#ffb36b').lerp(_hc, t > 12.9 ? .8 : 0).multiplyScalar(.22 + (t > 12.9 ? .3 * hb : 0));
    heatL.position.set(PHONE.x - .05, .7, PHONE.z); heatL.intensity = .05 * tr + (t > 12.9 ? .012 * hb : 0);
    underGlow.material.opacity = .45 * tr; underGlow.scale.set(.75 + .15 * tr, .5 + .1 * tr, 1);

    // pillow
    const k = pullT(t);
    pillowR.position.set(-1.22 - .32 * Math.max(0, k), .73 + .2 * k, .5 + .12 * Math.max(0, k));
    pillowR.rotation.set(.1 * k, -.06 + .2 * k, .36 * k);
    const sq_ = t > 16.35 && t < 16.6 ? .06 * Math.sin(seg(t, 16.35, 16.6) * Math.PI) : 0;
    pillowMesh.scale.set(1 + sq_ * .5, 1 - sq_ - .04 * Math.max(0, Math.sin(seg(t, 16.56, 17.4) * Math.PI)) * -1, 1);
    // breathing pillow wobble after release
    if (t > 17.1) pillowMesh.rotation.z = .05 * Math.sin((t - 17.1) * 9) * Math.exp(-(t - 17.1) * 3);

    // hand: approach (16.0-16.4) → grip → follows the pillow
    hand.visible = t > 15.85;
    if (hand.visible) {
      pillowR.updateMatrixWorld();
      const grip = _v.copy(handGrip).applyMatrix4(pillowMesh.matrixWorld);
      const a = eo(seg(t, 15.85, 16.38));
      const ov = Math.sin(seg(t, 16.2, 16.45) * Math.PI) * .03;
      hand.position.copy(grip).addScaledVector(armDir, (1 - a) * .9 + ov);
      _q.identity().slerp(pillowR.quaternion, .25); hand.quaternion.multiplyQuaternions(_q, qG);
      hand.pose(clamp(seg(t, 16.3, 16.45) * .9 + .1), 1 - a);
    }

    // electrons along the cable (4–8.2)
    const eOn = clamp(seg(t, 3.3, 4.0)) * (1 - seg(t, 8.1, 8.3));
    eDots.count = eHalo.count = eOn > 0 ? NE : 0;
    cableMat.opacity = 1 - .6 * ss(seg(t, 3.6, 4.4)) * (1 - seg(t, 8.0, 8.2));
    cableMat.depthWrite = cableMat.opacity > .99;
    if (eOn > 0) {
      for (let i = 0; i < NE; i++) {
        const sp = .14 + .04 * ((Math.sin(i * 91.7) * 4375.5) % 1 + 1) / 2, u = ((i / NE) + t * sp) % 1;
        curve.getPointAt(u, _v);
        const s = .6 + .4 * Math.sin(i * 3.1 + t * 6);
        setDot(eDots, i, _v, eOn * s); setHalo(eHalo, i, _v, .022 * eOn * s, cam.quaternion);
      }
      eDots.instanceMatrix.needsUpdate = eHalo.instanceMatrix.needsUpdate = true;
    }
    // motes (wide shot only)
    motes.count = t < 4.2 ? ND : 0;
    for (let i = 0; i < motes.count; i++) {
      const [a, b, c, d] = moteP[i];
      _v.set(lerp(-2.4, -.4, a) + .1 * Math.sin(t * .3 + d * 9), lerp(.8, 2.2, b) + ((t * .03 + d) % 1) * .15, lerp(.1, 1.6, c));
      setHalo(motes, i, _v, .02 + .02 * d, cam.quaternion);
    }
    motes.instanceMatrix.needsUpdate = true;

    // heat squiggles (13–18): rise, hit the pillow underside, fold back; after the pull they escape upward
    const freed = seg(t, 16.6, 16.9);
    const ceil = .1 + 2.5 * ss(freed); // above the phone top
    sq.forEach((s, i) => {
      const U = s.U, period = 1.3, ph = i / NS;
      const on = t > 12.9;
      s.visible = on;
      if (!on) return;
      const age = ((t - 12.9) / period + ph) % 1, cyc = Math.floor((t - 12.9) / period + ph);
      const r = mulberry(i * 31 + cyc * 7);
      const ox = (r() - .5) * .26, oz = (r() - .5) * .1;
      s.position.set(PHONE.x + ox, .65, PHONE.z + oz);
      s.quaternion.copy(cam.quaternion);
      const esc = t > 16.6;
      const rise = esc ? .55 : .2;
      U.uHead.value = age * rise * 1.4 + (esc ? (t - 16.6) * .12 : 0);
      U.uLen.value = esc ? .28 : .14; U.uCeil.value = esc ? 99 : Math.min(ceil, .085 + .01 * Math.sin(i));
      U.uAmp.value = .008 + .006 * r(); U.uFreq.value = 70 + 30 * r(); U.uPhase.value = r() * 6 + t * 3;
      U.uWidth.value = .008;
      heatColor(.6 + .4 * hb, tmpCol); U.uColor.value.copy(tmpCol).multiplyScalar(2.2);
      U.uColor2.value.set(PAL.red).multiplyScalar(2.6);
      U.uAlpha.value = (esc ? 1 - ss(seg(t, 17.4, 18)) * .7 : 1) * Math.sin(age * Math.PI) * clamp(hb * 1.3);
    });
  }

  shadowFlags(scene);
  return { scene, update, curve, PHONE, pillowR, phone, cable, SOCK, key: moon };
}
