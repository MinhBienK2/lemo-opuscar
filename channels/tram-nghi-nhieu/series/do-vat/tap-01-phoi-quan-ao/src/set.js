// Bối cảnh của tập: N1 hiên phơi + N4 căn phòng kín (cùng một căn, phòng nằm sau bức tường có cửa
// kính — nhìn qua cửa từ hiên vào phòng), N2 trong sợi vải, N3 mặt nước.
import * as THREE from 'three';
import { PAL, toon, glowMat, TEX, rbox, mesh, fxLayer, cushionGeo, surface, mulberry, clamp, lerp, seg, ss, eo, canvasTex } from '../../../../rig/kit.js';
import { keyLight, ambience, pool } from '../../../../rig/lights.js';
import { glowDots, halos, sparks, setDot, setHalo, setStreak } from '../../../../rig/fx.js';
import { clock } from '../../../../rig/sets.js';
import * as P from './props.js';

// ── texture sàn gạch ──────────────────────────────────────────────────
const tileTex = () => canvasTex(1024, 1024, (g, w, h) => {
  const r = mulberry(31), n = 8, s = w / n;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const k = (r() * .18) | 0;
    g.fillStyle = ['#cbb69a', '#c2ac90', '#d3c0a4', '#bda88c'][(r() * 4) | 0];
    g.fillRect(x * s + 3, y * s + 3, s - 6, s - 6);
    g.fillStyle = `rgba(90,70,45,${k * .5})`;
    for (let i = 0; i < 40; i++) g.fillRect(x * s + 3 + r() * (s - 6), y * s + 3 + r() * (s - 6), 3, 3);
    g.strokeStyle = 'rgba(90,78,58,.16)'; g.lineWidth = 1.2;
    g.strokeRect(x * s + 3, y * s + 3, s - 6, s - 6);
  }
});

// ─────────────────────────────────────────────────────────────────────
// N1 · Hiên phơi  +  N4 · Căn phòng kín
// ─────────────────────────────────────────────────────────────────────
export function buildBalcony() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#171a2b');
  scene.fog = new THREE.Fog('#2a2440', 9, 20);

  // ── ánh sáng: nắng sớm từ bên trái, tiếp vào qua lan can ──
  const sun = keyLight(scene, { from: new THREE.Vector3(-7, 6.2, 6.5), to: new THREE.Vector3(-1.2, 1.1, .6), color: '#ffd9a0', intensity: 2.6, size: 2.2 });
  ambience(scene, { hemi: '#8fa2ff', ground: '#3a2a4a', rim: '#9a5be5' });

  const M = {
    tile: toon('#ffffff', { map: tileTex() }),
    wall: toon('#ffffff', { map: TEX.wall() }),
    wallRoom: toon('#b9a68c'),
    rail: toon('#d9d2c2'),
    wood: toon('#ffffff', { map: TEX.wood() }),
    dark: toon('#4a3b52'),
  };
  M.tile.map.repeat.set(2, 2); M.wall.map.repeat.set(2.4, 1.6);

  // sàn hiên
  const floor = mesh(new THREE.PlaneGeometry(6, 5.2), M.tile, [0, 0, .8], { rot: [-Math.PI / 2, 0, 0], cast: false });
  scene.add(floor);
  // sàn phòng (thấp hơn một chút, tối hơn)
  const rfloor = mesh(new THREE.PlaneGeometry(5.2, 5.65), toon('#6b5b48'), [0, -.01, -3.875], { rot: [-Math.PI / 2, 0, 0], cast: false });
  scene.add(rfloor);

  // ── bức tường giữa hiên và phòng, có cửa kính ──
  const WZ = -1.05, DOORX0 = .55, DOORX1 = 1.25, DOORH = 2.06;
  { // tường có lỗ cửa: hai mảng trái–phải và một mảng trên
    const wall = (w, h, x, y) => scene.add(mesh(new THREE.BoxGeometry(w, h, .12), M.wall, [x, y, WZ], { cast: false }));
    wall(3.5, 3.2, -1.25, 1.6);                      // trái
    wall(1.6, 3.2, 2.05, 1.6);                       // phải
    wall(DOORX1 - DOORX0, 3.2 - DOORH, (DOORX0 + DOORX1) / 2, DOORH + (3.2 - DOORH) / 2); // trên cửa
  }
  // khung cửa + cánh cửa có ô kính
  const frame = toon('#e8dcc0');
  scene.add(mesh(rbox(DOORX1 - DOORX0 + .12, .07, .16, .012), frame, [(DOORX0 + DOORX1) / 2, DOORH, WZ]));
  scene.add(mesh(rbox(.07, DOORH, .16, .012), frame, [DOORX0 - .03, DOORH / 2, WZ]));
  scene.add(mesh(rbox(.07, DOORH, .16, .012), frame, [DOORX1 + .03, DOORH / 2, WZ]));
  const doorLeaf = new THREE.Group(); doorLeaf.position.set((DOORX0 + DOORX1) / 2, 0, WZ - .03); scene.add(doorLeaf);
  doorLeaf.add(mesh(rbox(DOORX1 - DOORX0 - .02, 1.05, .05, .01), P.M.woodDark, [0, .53, 0]));      // ván dưới
  const pane = mesh(new THREE.PlaneGeometry(DOORX1 - DOORX0 - .08, .78), toon('#dff0f7', { transparent: true, opacity: .15, depthWrite: false }), [0, 1.5, .02], { cast: false });
  doorLeaf.add(pane);
  doorLeaf.add(mesh(rbox(DOORX1 - DOORX0 - .02, .06, .06, .01), P.M.woodDark, [0, 1.11, 0]));        // đố ngang
  doorLeaf.add(mesh(rbox(DOORX1 - DOORX0 - .02, .06, .06, .01), P.M.woodDark, [0, 1.9, 0]));         // đố trên
  doorLeaf.add(mesh(rbox(.05, 1.9, .06, .01), P.M.woodDark, [-(DOORX1 - DOORX0) / 2 + .04, .95, 0]));
  doorLeaf.add(mesh(rbox(.05, 1.9, .06, .01), P.M.woodDark, [(DOORX1 - DOORX0) / 2 - .04, .95, 0]));
  doorLeaf.add(mesh(new THREE.SphereGeometry(.028, 10, 8), P.M.metal, [(DOORX1 - DOORX0) / 2 - .1, 1.0, .05])); // tay nắm

  // ── lan can hiên ──
  const RZ = 2.5;
  scene.add(mesh(rbox(5.6, .05, .05, .012), M.rail, [0, .95, RZ]));
  scene.add(mesh(rbox(5.6, .04, .04, .01), M.rail, [0, .55, RZ]));
  for (let i = 0; i <= 22; i++) scene.add(mesh(new THREE.CylinderGeometry(.016, .016, .9, 6), M.rail, [-2.7 + i * .245, .48, RZ]));
  // góc tường bên trái
  scene.add(mesh(new THREE.BoxGeometry(.12, 3.2, 3.6), M.wall, [-2.85, 1.6, .7], { cast: false }));

  // ── trong phòng: tường sau, tường bên, cửa sổ kín ──
  scene.add(mesh(new THREE.BoxGeometry(5.2, 3.2, .12), M.wallRoom, [0, 1.6, -6.7], { cast: false }));
  scene.add(mesh(new THREE.BoxGeometry(.12, 3.2, 5.65), M.wallRoom, [-2.6, 1.6, -3.875], { cast: false }));
  scene.add(mesh(new THREE.BoxGeometry(.12, 3.2, 5.65), M.wallRoom, [2.6, 1.6, -3.875], { cast: false }));
  // trần phòng: phòng kín, có trần
  scene.add(mesh(new THREE.PlaneGeometry(5.2, 5.65), toon('#c2b09a'), [0, 3.19, -3.875], { rot: [Math.PI / 2, 0, 0], cast: false }));
  // cửa sổ kín (không mở) ở tường sau
  const WX = .2, WY = 1.75;
  scene.add(mesh(rbox(1.0, .06, .1, .01), frame, [WX, WY + .45, -6.64]));
  scene.add(mesh(rbox(1.0, .06, .1, .01), frame, [WX, WY - .45, -6.64]));
  scene.add(mesh(rbox(.06, .96, .1, .01), frame, [WX - .47, WY, -6.64]));
  scene.add(mesh(rbox(.06, .96, .1, .01), frame, [WX + .47, WY, -6.64]));
  scene.add(mesh(new THREE.PlaneGeometry(.88, .84), toon('#6d7f9a'), [WX, WY, -6.6], { cast: false }));
  scene.add(mesh(new THREE.PlaneGeometry(.88, .84), toon('#8fa2bb', { transparent: true, opacity: .5 }), [WX, WY, -6.57], { cast: false }));
  scene.add(mesh(rbox(.92, .045, .05, .01), frame, [WX, WY, -6.55]));      // thanh ngang
  scene.add(mesh(rbox(.045, .88, .05, .01), frame, [WX, WY, -6.55]));      // thanh dọc
  scene.add(mesh(rbox(.98, .05, .16, .012), frame, [WX, WY - .47, -6.58]));

  // đèn trong phòng: chỉ một đèn bàn nhỏ, phòng tối
  // vệt nắng sớm rọi qua lan can, đọn trên sàn gạch
  pool(scene, { from: new THREE.Vector3(-6.2, 5.6, 5.6), to: new THREE.Vector3(-.9, 0, .9), color: '#ffe2b0', intensity: 2.4, angle: .30, penumbra: .8 });

  const roomLamp = new THREE.PointLight('#ffc987', .55, 3.6, 2); roomLamp.position.set(-1.4, 1.35, -4.3); scene.add(roomLamp);
  const roomAmb = new THREE.PointLight('#7f8fd8', .40, 4.0, 2); roomAmb.position.set(1.0, 1.9, -3.2); scene.add(roomAmb);
  const roomCeil = new THREE.PointLight('#ffe2b4', 1.25, 7.0, 2); roomCeil.position.set(-.1, 2.55, -3.6); scene.add(roomCeil);
  const roomFill = new THREE.PointLight('#cfd8ff', .45, 5.0, 2); roomFill.position.set(-1.9, 1.6, -2.0); scene.add(roomFill);
  // đèn trong phòng (kể cả nắng, vì nắng là đèn chiều nên nó rọi vào cả phòng) hạ sáng theo từng nhát:
  // góc xa của phòng phải thật tối, không phải một căn phòng sáng đều
  const roomLights = [roomLamp, roomAmb, roomCeil, roomFill, sun];
  const roomBase = roomLights.map(l => l.intensity);
  // đèn tập trung: mỗi nhát đặt vào đúng điểm nhìn, để vùng sáng nhất luôn là thứ đang kể
  const cornerLamp = new THREE.PointLight('#8ea6ff', .90, 3.2, 2); cornerLamp.position.set(2.45, 1.78, -5.30); scene.add(cornerLamp);
  const focus = new THREE.SpotLight('#ffe0b0', 0, 5.0, .42, .55, 1.2);
  focus.position.set(0, 2.4, 1.2); scene.add(focus); scene.add(focus.target);

  // ── dây phơi và quần áo ở hiên ──
  const line = P.dryingLine({ len: 3.8, sag: .26, y: 1.55 }); line.group.position.set(0, 0, .85); scene.add(line.group);
  const shirt = P.tShirt({ color: '#f2f0e6', wetColor: '#aab2c4', drops: true });
  shirt.group.position.set(-1.25, line.yAt(-1.25), .85); scene.add(shirt.group);
  const pants = P.trousers({ color: '#4a5a86' });
  pants.group.position.set(-.55, line.yAt(-.55), .85); scene.add(pants.group);
  const twl = P.towel({ color: '#f2c14e' });
  twl.group.position.set(.25, line.yAt(.25), .85); scene.add(twl.group);
  const hemDrop = P.hemDrop(); hemDrop.group.position.set(.25, line.yAt(.25) - .52, .87); hemDrop.group.visible = false; scene.add(hemDrop.group);
  const tee = P.thinTee({ color: '#9fd8e8' });
  tee.group.position.set(1.50, line.yAt(1.50), .85); scene.add(tee.group);
  // áo phông thứ hai: đứng CẠNH áo thun mỏng (x = 1.50) chứ không chồng sau nó — cùng dây, cách nửa mét
  const teeBack = P.tShirt({ color: '#5d8fa6', wetColor: '#5d8fa6', w: .52, h: .62 });
  teeBack.group.position.set(.85, line.yAt(.85), .85); teeBack.group.rotation.y = -.14; scene.add(teeBack.group);
  // kẹp gỗ: kẹp đúng chỗ dây chùng xuống (kẹp phải đi theo dây khi dây đung đưa)
  const lineClips = [];
  for (const x of [-1.42, 1.50, -.42, .85]) {
    const c = P.clothesClip(); c.group.position.set(x, line.yAt(x), .85); scene.add(c.group);
    lineClips.push({ g: c.group, x, y: line.yAt(x) });
  }
  // dây thứ hai có đàn áo chồng (cọc trái lùi xa nhiệt kế để không che)
  const line2 = P.dryingLine({ len: 2.6, sag: .2, y: 1.98 }); line2.group.position.set(.3, 0, -.72); scene.add(line2.group);
  const pile = P.shirtPile({ n: 3 }); pile.group.position.set(-.95, line2.yAt(-1.25), -.72); scene.add(pile.group);
  // áo phơi một mặt: nửa khô, nửa còn ẩm (hình bám cho lời "phơi cả hai mặt")
  const half = P.halfShirt({ w: .60, h: .74 });
  half.group.position.set(1.00, line2.yAt(.70), -.72); half.group.rotation.y = -.12; scene.add(half.group);
  const clip2 = P.clothesClip(); clip2.group.position.set(1.00, line2.yAt(.70), -.72); scene.add(clip2.group);

  // bồn chậu dưới dây
  const basin = P.basin(); basin.group.position.set(-1.25, 0, .85); scene.add(basin.group);
  // ghế gỗ (đạo cụ của hiên)
  const chair = P.chair(); chair.group.position.set(-2.0, 0, 1.35); chair.group.rotation.y = .5; scene.add(chair.group);
  // cái áo phơi rộng: trải phẳng trên sàn gạch hiên (nắng và gió đều lấy được), nửa ngoài nửa trong —
  // đối chiếu với cái áo úp nằm ngay cạnh nó. KHÔNG đặt trên mặt ghế: ghế chỉ rộng 42 cm,
  // áo trải rộng sẽ tràn ra ngoài và đè lên đạo cụ khác.
  const spread = P.spreadShirt({ color: '#f2f0e6', w: .62, h: .66 });
  // trải phẳng: xoay vải nằm xuống sàn, ép nếp vải (trục đứng của vải) xuống còn 35 % rồi nâng lên
  // cho điểm thấp nhất chạm sàn — hai nửa áo nằm chung một mặt sàn, đọc ra là áo trải rộng.
  spread.group.rotation.order = 'ZYX';                    // xoay quanh trục đứng SAU khi trải phẳng
  spread.group.rotation.set(-Math.PI / 2, .38, 0);
  spread.group.scale.set(1, 1, .35);
  spread.group.position.set(0, 0, 0);
  spread.body.name = 'spreadBody';
  spread.group.updateMatrixWorld(true);
  const spreadBox = new THREE.Box3().setFromObject(spread.group);
  spread.group.position.set(-.45, -spreadBox.min.y + .006, 1.36);
  scene.add(spread.group);
  // cái áo úp: áo phông còn ẩm úp mép dưới lên, nằm trên sàn CẠNH cái áo phơi rộng —
  // hai cái cùng một khung để so: một cái trải hết mặt, một cái úp gấp lại.
  const upShirt = P.foldedShirt({ color: '#cfdae0', wetColor: '#8fa4b2', w: .62, h: .72 });
  upShirt.group.rotation.order = 'ZYX';
  upShirt.group.rotation.set(-Math.PI / 2, -.30, 0);
  upShirt.group.scale.set(1, 1, .35);
  upShirt.group.position.set(0, 0, 0);
  upShirt.body.name = 'upBody';
  upShirt.group.updateMatrixWorld(true);
  const upBox = new THREE.Box3().setFromObject(upShirt.group);
  upShirt.group.position.set(.85, -upBox.min.y + .006, 1.26);
  scene.add(upShirt.group);
  // túi nylon buộc ở đầu dây phơi, nơi gió thổi qua
  const bag = P.nylonBag(); bag.group.position.set(1.86, 1.30, .85); scene.add(bag.group);
  scene.add(mesh(new THREE.CylinderGeometry(.004, .004, .12, 6), P.M.rope, [1.86, 1.50, .85]));
  // nhiệt kế + ẩm kế trên tường
  const thermo = P.thermometer(); thermo.group.position.set(-2.25, 1.95, WZ + .08); scene.add(thermo.group);
  const hygro = P.hygrometer(); hygro.group.position.set(-1.55, 1.95, WZ + .08); scene.add(hygro.group);

  // ── trong phòng: quạt, hai áo, bàn thí nghiệm, hai cái cân, ghế, đồng hồ ──
  // quạt đặt trên bàn thấp, đầu quạt ngang tầm lớp hơi ẩm trên áo
  const fanTable = P.sideTable(); fanTable.group.position.set(-1.5, 0, -3.3); scene.add(fanTable.group);
  const fan = P.deskFan(); fan.group.position.set(-1.5, .74, -3.3);
  // đầu quạt xoay 25° về phía hiên (về phía máy) để lưới và cánh quạt đọc ra được ở các nhát
  // nhìn chéo (c31), thay vì chỉ thấy vỏ động cơ. Gió vẫn thổi sang áo A ở `x = +.42`.
  fan.setAim(Math.PI / 2 - .44); scene.add(fan.group);
  const shirtA = P.tShirt({ color: '#f2f0e6', wetColor: '#aab2c4', drops: true });   // trong luồng gió của quạt (mang ba giọt bám mép)
  shirtA.group.position.set(.42, 1.42, -3.30); scene.add(shirtA.group);
  // áo B: góc xa của phòng, ngoài luồng gió, vải sẫm để tương phản với áo A đang nhạt dần
  const shirtB = P.tShirt({ color: '#4a5580', wetColor: '#39405e' });
  shirtB.group.position.set(2.30, 1.42, -5.05); shirtB.group.rotation.y = -Math.PI / 2; scene.add(shirtB.group);
  // lớp hơi ẩm bám quanh áo B: vỏ mỏng chép theo đúng nếp vải (đẩy mỗi đỉnh dọc theo normal của nó)
  // và mờ dần về rìa, để đọc ra là lớp hơi ẩm BÁM vải chứ không phải một tấm kính dựng trước áo
  const mistGeo = shirtB.body.geometry.clone();
  {
    const p = mistGeo.attributes.position, n = mistGeo.attributes.normal;
    const col = new Float32Array(p.count * 4);
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(n, i);
      if (v.lengthSq() < 1e-12) v.set(0, 0, 1); else v.normalize();
      p.setXYZ(i, p.getX(i) + v.x * .012, p.getY(i) + v.y * .012, p.getZ(i) + v.z * .012);
      // alpha mờ dần từ ngực ra rìa áo
      const x = p.getX(i), y = p.getY(i);
      const d = Math.hypot(x / .30, (y + .34) / .40);
      col[i * 4] = 1; col[i * 4 + 1] = 1; col[i * 4 + 2] = 1;
      col[i * 4 + 3] = clamp(1.15 - d * .95);
    }
    p.needsUpdate = true;
    mistGeo.setAttribute('color', new THREE.BufferAttribute(col, 4));
    mistGeo.computeVertexNormals();
  }
  const mistFar = new THREE.Mesh(mistGeo, new THREE.MeshBasicMaterial({
    color: '#7fdcf0', transparent: true, opacity: .30, depthWrite: false, side: THREE.DoubleSide, vertexColors: true,
  }));
  mistFar.castShadow = false; mistFar.receiveShadow = false;
  fxLayer(mistFar); shirtB.group.add(mistFar);
  // thanh treo áo A: ngang, phía trước phòng
  scene.add(mesh(new THREE.CylinderGeometry(.012, .012, 1.05, 10), P.M.metal, [.42, 1.50, -3.38], { rot: [0, 0, Math.PI / 2] }));
  for (const x of [.02, .82]) scene.add(mesh(new THREE.CylinderGeometry(.016, .016, .07, 8), P.M.metalDark, [x, 1.50, -3.38], { rot: [Math.PI / 2, 0, 0] }));
  scene.add(mesh(new THREE.CylinderGeometry(.008, .008, .09, 8), P.M.metal, [.42, 1.48, -3.37], { rot: [Math.PI / 2, 0, 0] }));
  // thanh treo áo B: dọc theo tường phải, ở góc xa
  scene.add(mesh(new THREE.CylinderGeometry(.012, .012, 1.30, 10), P.M.metal, [2.42, 1.50, -5.05], { rot: [Math.PI / 2, 0, 0] }));
  for (const z of [-5.65, -4.45]) scene.add(mesh(new THREE.CylinderGeometry(.016, .016, .07, 8), P.M.metalDark, [2.47, 1.50, z], { rot: [0, 0, Math.PI / 2] }));
  scene.add(mesh(new THREE.CylinderGeometry(.008, .008, .10, 8), P.M.metal, [2.37, 1.48, -5.05], { rot: [0, 0, Math.PI / 2] }));
  // (không có túi nylon trong phòng: túi nylon của phim chỉ có một cái, ở hiên, nằm trong luồng gió cổng)
  // bàn thí nghiệm: hai mặt kính, vách ngăn (dọc theo tường sau phòng)
  const lab = P.labTable(); lab.group.position.set(1.70, 0, -6.15); lab.group.rotation.y = 0; scene.add(lab.group);
  // hai giọt nước trên hai mặt kính: giọt to hơn cho dễ thấy
  for (const d of lab.drops) { d.userData.k = 1.15; d.scale.set(1.15, .68, 1.15); }
  // quạt nhỏ ở cuối bàn, thổi ngang dọc bàn: gió quét mặt kính phải, vách ngăn chặn mặt kính trái
  const fanB = P.deskFan(); fanB.group.scale.setScalar(.62); fanB.group.position.set(2.38, .72, -6.15); fanB.setAim(-Math.PI / 2); scene.add(fanB.group);
  // hai cái cân trên kệ gỗ
  const shelf = new THREE.Group(); shelf.position.set(-1.8, 0, -5.6); scene.add(shelf);
  shelf.add(mesh(rbox(1.7, .05, .5, .012), M.wood, [0, .72, 0]));
  for (const [x, z] of [[-.75, -.18], [.75, -.18], [-.75, .18], [.75, .18]]) shelf.add(mesh(new THREE.CylinderGeometry(.026, .03, .72, 8), P.M.woodDark, [x, .36, z]));
  const scale1 = P.kitchenScale(); scale1.group.position.set(-.24, .75, 0); scale1.group.rotation.x = .52; shelf.add(scale1.group);
  const scale2 = P.kitchenScale(); scale2.group.position.set(.24, .75, 0); scale2.group.rotation.x = .52; shelf.add(scale2.group);
  // quạt nhỏ ở cuối kệ (bên phải): thổi ngược sang trái, vào đúng cái áo đã nhạt;
  // cái áo còn ẩm nằm ở góc xa hơn, ngoài luồng gió
  const fanC = P.deskFan(); fanC.group.scale.setScalar(.55); fanC.group.position.set(.70, .745, .05); fanC.setAim(-Math.PI / 2); shelf.add(fanC.group);
  const fanCSpk = glowDots(12, .009, '#9fd4ea', 1.0); scene.add(fanCSpk);
  const fanCPos = [];
  for (let i = 0; i < 12; i++) fanCPos.push(new THREE.Vector3());
  // thanh treo ngay trên kệ: hai cái áo nhỏ móc ngay trên hai cái cân
  shelf.add(mesh(new THREE.CylinderGeometry(.012, .012, 1.70, 10), P.M.metal, [0, 1.54, 0], { rot: [0, 0, Math.PI / 2] }));
  // móc treo ở đúng chỗ hai áo nhỏ (x = ±.15), áo móc thẳng vào thanh
  for (const x of [-.15, .15]) shelf.add(mesh(new THREE.CylinderGeometry(.006, .006, .08, 6), P.M.metalDark, [x, 1.50, 0], { rot: [Math.PI / 2, 0, 0] }));
  // hai áo nhỏ treo trên thanh, ngay trên hai cái cân: đối chiếu "áo còn ẩm" và "áo đã nhạt"
  const scaleShirt1 = P.tShirt({ color: '#e8eef2', wetColor: '#8a93a6', w: .30, h: .40 });
  scaleShirt1.group.position.set(-.15, 1.50, 0); scaleShirt1.group.scale.setScalar(.9); shelf.add(scaleShirt1.group);
  const scaleShirt2 = P.tShirt({ color: '#e8eef2', wetColor: '#8a93a6', w: .30, h: .40 });
  scaleShirt2.group.position.set(.15, 1.50, 0); scaleShirt2.group.scale.setScalar(.9); shelf.add(scaleShirt2.group);
  // đồng hồ treo tường: đưa lên cao cho khỏi đè lên cặp áo nhỏ trên kệ (áo nhỏ ở `y 1.14–1.50`)
  const wallClock = clock(); wallClock.position.set(-2.30, 1.95, -6.62); scene.add(wallClock);

  // ── bàn tay (dùng ở N4) ──
  const handRaw = P.hand({ skin: '#f0c39a', size: 1 });
  const hand = handRaw.group ? handRaw.group : handRaw;
  hand.visible = false; scene.add(hand);
  // mồ hôi bám trên mu bàn tay (đi theo bàn tay), bị gió cuốn đi
  // mồ hôi bám trên mu bàn tay: nhiều giọt nhỏ trong suốt có highlight, không phải mảng xám dán
  // mười giọt nằm TRÊN mặt mu (vòm ellipsoid của `hand`: tâm `.088, .021, 0`, bán kính `.070 × .019 × .042`),
  // bán kính 6–8 mm để c55 (fov 30) đọc được, mỗi giọt có một điểm sáng trên mặt
  const sweatMat = toon('#4fc4ee', { transparent: true, opacity: .88, depthWrite: false });
  const sweatMatHi = toon('#ffffff', { transparent: true, opacity: .95, depthWrite: false });
  const sweatBeads = [];
  // mặt lưng bàn tay: bảng khung HAND_BACK trong props.js. Nội suy để giọt mồ hôi nằm ĐÚNG trên da.
  const backY = (x, z) => {
    const B = P.HAND_BACK;
    let i = 0;
    while (i < B.length - 2 && x > B[i + 1].x) i++;
    const a = B[i], b = B[i + 1];
    const t = clamp((x - a.x) / (b.x - a.x));
    const yc = lerp(a.yc, b.yc, t), ry = lerp(a.ry, b.ry, t), rz = lerp(a.rz, b.rz, t);
    const v = z / rz;
    if (Math.abs(v) >= 1) return null;
    return yc + ry * Math.sqrt(1 - v * v);
  };
  for (const [x, z, r] of [[.028, .010, .0070], [.040, -.012, .0068], [.046, .022, .0062], [.056, .002, .0076],
                          [.062, -.020, .0064], [.070, .016, .0066], [.078, -.006, .0074], [.084, .006, .0068],
                          [.090, -.016, .0062], [.096, .012, .0060]]) {
    const y = backY(x, z);
    if (y === null) continue;
    const b = mesh(new THREE.SphereGeometry(r, 14, 12), sweatMat, [x, y + r * .30, z], { cast: false, recv: false });
    b.scale.set(1, .66, 1); fxLayer(b); hand.add(b); sweatBeads.push(b);
    // điểm sáng nhỏ trên mặt giọt: giọt phải đọc ra là giọt nước, không phải hạt nhám
    const hi = mesh(new THREE.SphereGeometry(r * .28, 8, 6), sweatMatHi, [x - r * .30, y + r * .86, z + r * .18], { cast: false, recv: false });
    hi.scale.set(1, .55, 1); fxLayer(hi); hand.add(hi);
  }
  const sweat = { visible: false };   // cờ bật/tắt lớp mồ hôi bám (chính là các giọt ở trên)

  // ── luồng gió trong phòng: hạt khí có quán tính, không phải nét vẽ đè lên vật ──
  const windSpk = glowDots(40, .0045, '#a8dcf2', .95); scene.add(windSpk);
  const windPos = [], windVel = [];
  for (let i = 0; i < 40; i++) {
    windPos.push(new THREE.Vector3());
    windVel.push(new THREE.Vector3(1, 0, 0));
  }

  // ba giọt nước bám đúng mép áo A nằm sẵn trong đạo cụ tShirt (three teardrops ở mép vải),
  // nên không dựng thêm nhóm giọt riêng ở đây.

  // lớp hơi ẩm: một tấm kính mờ bám sát mặt áo — trong, mềm, nhưng có mép sáng riêng
  const mistTex = canvasTex(256, 256, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    const g0 = c.createRadialGradient(w / 2, h / 2, w * .10, w / 2, h / 2, w * .50);
    g0.addColorStop(0, 'rgba(190,245,255,.85)');
    g0.addColorStop(.62, 'rgba(150,225,245,.55)');
    g0.addColorStop(.88, 'rgba(215,250,255,.75)');
    g0.addColorStop(1, 'rgba(215,250,255,0)');
    c.fillStyle = g0; c.fillRect(0, 0, w, h);
  });
  const mistMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.cyan).multiplyScalar(.5), map: mistTex, transparent: true, opacity: .44, depthWrite: false, side: THREE.DoubleSide });
  // lớp hơi ẩm là một vật riêng đứng sát mặt áo A: đi theo áo (copy vị trí + độ nghiêng) nhưng không phải con của áo
  const mistG = new THREE.Group(); mistG.name = 'lop-hoi-am'; scene.add(mistG);
  mistG.position.set(.42, 1.06, -3.26);
  const mist = mesh(new THREE.PlaneGeometry(.52, .44), mistMat, [0, 0, 0], { cast: false, recv: false });
  fxLayer(mist); mistG.add(mist);
  // viền sáng ở mép trên: lớp hơi ẩm bám sát vải, không phải vết lem
  const rimMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#bff0fb').multiplyScalar(1.6), map: TEX.radial(), transparent: true, opacity: .52, depthWrite: false, side: THREE.DoubleSide });
  const mistRim = mesh(new THREE.PlaneGeometry(.50, .10), rimMat, [0, .22, .004], { cast: false, recv: false });
  fxLayer(mistRim); mistG.add(mistRim);
  const mistBal = mesh(new THREE.PlaneGeometry(.58, .72), mistMat.clone(), [-1.25, 1.02, .78], { cast: false, recv: false });
  fxLayer(mistBal); scene.add(mistBal);

  // luồng gió nhỏ của quạt trên bàn thí nghiệm: hạt khí tới mặt kính có gió, dừng ở vách ngăn
  const labSpk = glowDots(14, .006, '#cfeaf4', .95); scene.add(labSpk);
  const labPos = [], labVel = [];
  for (let i = 0; i < 14; i++) { labPos.push(new THREE.Vector3()); labVel.push(new THREE.Vector3(0, 0, -1)); }
  // hơi nước bị gió chở đi khỏi mặt áo: một vệt hạt mờ, đều nhau, đọc là "nước đi theo gió"
  const vapTrailSpk = glowDots(30, .0042, '#cfeeff', .80); scene.add(vapTrailSpk);
  const vapTrailSoft = glowDots(12, .010, '#bfeaf8', .35); scene.add(vapTrailSoft);
  const vapTrailPos = [], vapTrailSoftPos = [];
  for (let i = 0; i < 30; i++) vapTrailPos.push(new THREE.Vector3());
  for (let i = 0; i < 12; i++) vapTrailSoftPos.push(new THREE.Vector3());
  // hơi nước bốc lên khỏi mặt áo vào khoảng không ở phía trên
  const vapUpSpk = glowDots(18, .0055, '#cfeeff', .85); scene.add(vapUpSpk);
  const vapUpPos = [];
  for (let i = 0; i < 18; i++) vapUpPos.push(new THREE.Vector3());
  // hạt hơi nước lơ lửng quanh áo ướt ngoài hiên
  const vapBal = glowDots(12, .011, '#9fdcf0', .85); fxLayer(vapBal); scene.add(vapBal);
  const vapBalPos = [];
  for (let i = 0; i < 12; i++) vapBalPos.push(new THREE.Vector3());
  // hạt mồ hôi bị gió cuốn đi khỏi da
  const sweatSpk = glowDots(6, .0055, '#cdeefb', .90); fxLayer(sweatSpk); scene.add(sweatSpk);
  const sweatPos = [], sweatVel = [];
  for (let i = 0; i < 6; i++) { sweatPos.push(new THREE.Vector3()); sweatVel.push(new THREE.Vector3(1, .25, 0)); }

  const S = {
    scene, sun, line, line2, shirt, pants, twl, tee, half, hemDrop, pile, basin, chair, upShirt, bag,
    thermo, hygro, fan, fanB, fanTable, shirtA, shirtB, lab, scale1, scale2, scaleShirt1, scaleShirt2, teeBack,
    wallClock, hand, mist, mistG, mistRim, mistFar, mistBal, doorLeaf, pane, spread, labSpk, vapTrailSpk, vapUpSpk, vapBal, sweat, focus, fanC,
    update(t, opt = {}) {
      // hạ sáng đèn phòng ở nhát nào cần góc xa thật tối
      const dim = opt.dim ?? 1;
      roomLights.forEach((l, i) => { l.intensity = roomBase[i] * dim; });
      // gió ở hiên: vải bay, túi nylon nghiêng, dây phơi đung đưa
      const gust = .5 + .5 * Math.sin(t * .8) * Math.sin(t * .31 + 1.2);
      const g = opt.wind ?? 1;
      for (const s of [shirt, twl, tee]) {
        s.group.rotation.z = Math.sin(t * 1.6 + s.group.position.x) * .045 * gust * g;
        s.group.rotation.x = Math.sin(t * 1.1 + 1) * .02 * gust * g;
      }
      pants.group.rotation.z = Math.sin(t * 1.3) * .02 * gust * g;
      // dây đung đưa thì quần áo, khăn và kẹp trên dây đi theo: cùng lệch, không đứng lơ lửng
      const sw = Math.sin(t * .7) * gust * g;
      line.setSway(sw);
      const sdx = sw * .008, sdy = sw * .012;
      shirt.group.position.set(-1.25 + sdx, line.yAt(-1.25) + sdy, .85);
      pants.group.position.set(-.55 + sdx, line.yAt(-.55) + sdy, .85);
      twl.group.position.set(.25 + sdx, line.yAt(.25) + sdy, .85);
      tee.group.position.set(1.50 + sdx, line.yAt(1.50) + sdy, .85);
      teeBack.group.position.set(.85 + sdx, line.yAt(.85) + sdy, .85);
      for (const c of lineClips) c.g.position.set(c.x + sdx, c.y + sdy, .85);
      // dây thứ hai: đàn áo, áo phơi một mặt và kẹp cũng đi theo dây
      const sw2 = Math.sin(t * .9 + 1) * gust * g;
      line2.setSway(sw2);
      const pdx = sw2 * .008, pdy = sw2 * .012;
      pile.group.position.set(-.95 + pdx, line2.yAt(-1.25) + pdy, -.72);
      half.group.position.set(1.00 + pdx, line2.yAt(.70) + pdy, -.72);
      clip2.group.position.set(1.00 + pdx, line2.yAt(.70) + pdy, -.72);
      bag.swing(t, gust * g);
      pile.setSway(t, gust * g);
      // trong phòng: quạt quay, áo trước quạt bay nhẹ, áo góc xa đứng yên
      fan.spin(t); fanB.spin(t * 1.7); fanC.spin(t * 1.6);
      const fanOn = opt.fan ?? 1;
      fan.setSpeed(2.2 * fanOn);
      fanB.setSpeed(2.0 * (opt.lab ? 1 : 0));      // quạt ở cuối bàn thí nghiệm
      fanC.setSpeed(1.8 * (opt.fanC ? 1 : 0));     // quạt nhỏ ở cuối kệ
      shirtA.group.rotation.z = Math.sin(t * 2.4) * .05 * fanOn;
      // lớp hơi ẩm bám sát mặt áo A: bám theo áo (vị trí + độ nghiêng) nhưng là vật riêng
      mistG.position.set(shirtA.group.position.x, shirtA.group.position.y - .18, shirtA.group.position.z + .04);
      mistG.rotation.z = shirtA.group.rotation.z;
      shirtB.group.rotation.z = Math.sin(t * .5) * .004;
      // giọt nước ở mép khăn: tụ lại ở mép vải rồi rơi, nho dần khi rơi
      const tHem = opt.hemT ?? 150;
      const grow = clamp((t - (tHem - 1.5)) / 1.5);
      const fall = clamp((t - tHem) / 1.6);
      hemDrop.group.position.set(.25, lerp(.7655, .7270, ss(fall)), .862);
      hemDrop.setSize(1 - (.45 + .55 * grow) * (1 - .5 * ss(fall)));
      // khăn ướt lúc đầu, khô dần theo thời gian
      twl.setWet(clamp(1 - (t - 143) / 20));
      // quần áo khô dần: áo trước quạt nhạt màu từ sớm (có gió), áo góc xa vẫn sẫm, áo ở hiên khô dần
      shirtA.setWet(1 - clamp((t - 12) / 24) * .40 - clamp((t - 36) / 120) * .45);
      shirtB.setWet(1);
      shirt.setWet(1 - clamp((t - 110) / 50) * .95);
      teeBack.setWet(1 - clamp((t - 95) / 55) * .95);
      // luồng gió nhỏ ở bàn thí nghiệm: chạy từ quạt ở cuối bàn sang trái, dừng ở vách ngăn
      for (let i = 0; i < 14; i++) {
        const sd = (i * .618033) % 1;
        const s = ((t * .55 + sd) % 1);
        labPos[i].set(2.30 - s * .56, 1.045 + sd * .04, -6.15 + (sd - .5) * .20);
        labVel[i].set(-.85, 0, 0);
        setDot(labSpk, i, labPos[i], .7 + sd * .6);
      }
      labSpk.count = opt.lab ? 14 : 0;
      labSpk.instanceMatrix.needsUpdate = true;
      // hai giọt trên mặt kính: giọt có gió nhỏ nhanh, giọt sau vách ngăn nhỏ chậm (còn một nửa)
      const el = opt.lab ? clamp((t - (opt.t0 ?? 100)) / 7) : 0;
      const kA = lab.drops[0].userData.k, kB = lab.drops[1].userData.k;
      const sA = 1 - .35 * el, sB = 1 - .70 * el;
      lab.drops[0].scale.set(kA * sA, .62 * kA * sA, kA * sA);
      lab.drops[1].scale.set(kB * sB, .62 * kB * sB, kB * sB);
      // hơi nước bị gió chở đi khỏi mặt áo: vệt hạt mờ chạy theo hướng gió
      for (let i = 0; i < 30; i++) {
        const s = ((t * .30 + i / 30) % 1);
        const jx = (i % 5) * .013 - .026, jy = (i % 7) * .009 - .027;
        vapTrailPos[i].set(.46 + s * 1.26 + jx, 1.16 + Math.sin(s * 3.1 + t * .8 + i) * .035 + s * .09 + jy, -3.19 + Math.sin(i * 1.7) * .05);
        setDot(vapTrailSpk, i, vapTrailPos[i], .70 + (i % 4) * .16);
      }
      vapTrailSpk.count = opt.vap ? 30 : 0;
      vapTrailSpk.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < 12; i++) {
        const s = ((t * .24 + i / 12) % 1);
        vapTrailSoftPos[i].set(.50 + s * 1.10 + (i % 3) * .02 - .02, 1.14 + Math.sin(s * 2.4 + t * .6 + i) * .03 + s * .08, -3.20 + Math.cos(i * 2.2) * .05);
        setDot(vapTrailSoft, i, vapTrailSoftPos[i], .7 + (i % 3) * .2);
      }
      vapTrailSoft.count = opt.vap ? 12 : 0;
      vapTrailSoft.instanceMatrix.needsUpdate = true;
      // hơi nước bốc lên vào khoảng không ở trên mặt áo
      for (let i = 0; i < 18; i++) {
        const s = ((t * .22 + i / 18) % 1);
        vapUpPos[i].set(.43 + Math.sin(i * 2.1 + t * .7) * .05, 1.44 + s * .42, -3.22 + Math.cos(i * 1.3) * .04);
        setDot(vapUpSpk, i, vapUpPos[i], .75 + (i % 4) * .08);
      }
      vapUpSpk.count = opt.vapRise ? 18 : 0;
      vapUpSpk.instanceMatrix.needsUpdate = true;
      // luồng gió của quạt nhỏ trên kệ: từ miệng quạt sang trái, chạm vào cái áo đã nhạt rồi tắt trước cái áo còn ẩm
      for (let i = 0; i < 12; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const s = ((t * .42 + sd) % 1);
        fanCPos[i].set(-1.12 - s * .62, 1.06 + sd2 * .18 - s * .04, -5.55 + (sd - .5) * .12);
        setDot(fanCSpk, i, fanCPos[i], .6 + sd2 * .6);
      }
      fanCSpk.count = opt.fanC ? 12 : 0;
      fanCSpk.instanceMatrix.needsUpdate = true;
      // hạt hơi nước lơ lửng quanh áo ướt ngoài hiên
      for (let i = 0; i < 12; i++) {
        const sd = (i * .618033) % 1;
        vapBalPos[i].set(-1.25 + (sd - .5) * .46 + Math.sin(t * .7 + i) * .03, .72 + sd * .46 + Math.sin(t * .5 + i * 2) * .03, .80 + (sd - .5) * .30);
        setDot(vapBal, i, vapBalPos[i]);
      }
      vapBal.count = opt.vapBal ? 12 : 0;
      vapBal.instanceMatrix.needsUpdate = true;
      // mồ hôi trên bàn tay: bị gió quét dần
      sweat.visible = !!opt.sweat;
      for (const b of sweatBeads) b.visible = !!opt.sweat;
      const tSw = opt.sweatT ?? 156;
      const fade = 1 - clamp((t - tSw) / 1.0);
      sweatMat.opacity = .78 * fade;
      for (const b of sweatBeads) b.scale.set(1, .62 * (.4 + .6 * fade), 1);
      // hạt mồ hôi bị gió cuốn đi khỏi da
      const fly = clamp((t - tSw) / 1.4);
      for (let i = 0; i < 6; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const s = ((t * .8 + sd) % 1);
        sweatPos[i].set(-.50 + s * .85 * fly, 1.11 + sd2 * .28 * fly + s * .12 * fly, -3.30 + (sd - .5) * .22);
        sweatVel[i].set(.9, .25, 0);
        setDot(sweatSpk, i, sweatPos[i]);
      }
      sweatSpk.count = (opt.sweat && fly > 0) ? 6 : 0;
      sweatSpk.instanceMatrix.needsUpdate = true;
      // vệt gió: hạt khí bay từ đầu quạt sang phải, dày hơn khi quạt quay nhanh
      const wVis = opt.fan ? 1 : 0;
      for (let i = 0; i < 40; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const s = ((t * (.30 + .12 * fanOn) + sd) % 1);
        const x = -1.40 + s * 2.10;          // luồng gió dừng ngay mép áo A (x = 0.70)
        const y = .92 + s * .30 + sd2 * .16;          // luồng gió đi lên từ đầu quạt về tầm áo
        const z = -3.30 + ((i * .71) % 1 - .5) * .42;
        windPos[i].set(x, y, z);
        windVel[i].set(.6 + .5 * fanOn, 0, 0);
        setDot(windSpk, i, windPos[i], .6 + sd2 * .8);
      }
      windSpk.count = wVis ? 40 : 0;
      windSpk.instanceMatrix.needsUpdate = true;
      // đồng hồ: quay chậm
      wallClock.tick(t, 6, 40);
      // nhiệt kế và ẩm kế
      thermo.setTemp(opt.temp ?? .5);
      hygro.setRH(opt.rh ?? .5);
      // kim cân: áo còn ẩm (cân trái, xa quạt) nặng hơn, áo đã nhạt (cân phải, gần quạt) nhẹ hơn
      scale1.setReading(.72); scale2.setReading(.22);
      scaleShirt1.setWet(shirtB.wet); scaleShirt2.setWet(shirtA.wet);
    },
  };
  return S;
}

// ─────────────────────────────────────────────────────────────────────
// N2 · Trong sợi vải (cận)
// ─────────────────────────────────────────────────────────────────────
export function buildFabric() {
  const scene = new THREE.Scene();
  // nền trong ruột vải: tối, NHẠT màu (không tím) — sợi bông màu kem phải nổi lên
  // trên nền, không biến thành bìa carton tím
  scene.background = canvasTex(64, 512, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#2b2740');
    gr.addColorStop(.42, '#221f33');
    gr.addColorStop(1, '#141221');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
  });
  scene.fog = new THREE.Fog('#1b1829', 4, 10);
  // đèn xiên từ bên: sợi đổ bóng lên nhau, đan lưới mới đọc ra
  const key = keyLight(scene, { from: new THREE.Vector3(-1.5, .85, .85), to: new THREE.Vector3(0, 0, 0), color: '#fff2dc', intensity: 3.0, size: .8 });
  ambience(scene, { hemi: '#8e93ad', ground: '#2a2735', rim: '#7f8ad0' });
  const fill = new THREE.PointLight('#aeb6d8', .34, 2.6, 2); fill.position.set(.7, .35, .9); scene.add(fill);
  const fibres = P.wovenFibres(); scene.add(fibres.group);
  // tấm vải đan thật: lưới sợi dọc–ngang luồn qua nhau, đặt lệch sang phải–sau
  // để c10 (cận cảnh rộng) có một vật riêng khác với c11 (cận cảnh khe sợi)
  const cloth = P.wovenCloth({ n: 44, size: .34 });
  cloth.group.position.set(.205, -.010, -.085);
  cloth.group.rotation.set(-.12, .20, .07);        // tấm vải nghiêng, để có chiều sâu chứ không phẳng như một tấm ảnh
  scene.add(cloth.group);
  // nước nằm ở khe giữa các sợi: một vật riêng, đứng ngoài nhóm sợi, để máy nhận ra đây là thứ đang kể
  scene.add(fibres.filmG);
  // vệt nước bám trong xơ ở rìa sợi: cũng là một vật riêng
  fibres.fuzzG.position.set(.040, .078, .010); scene.add(fibres.fuzzG);
  const drop = P.dropOnThread(); drop.group.position.set(-.02, .105, .150); scene.add(drop.group);
  // hạt hơi nước rời khỏi giọt
  const dots = glowDots(14, .0045, PAL.cyan, .95); fxLayer(dots); scene.add(dots);
  const pos = [], vel = [], seed = [];
  const r = mulberry(5);
  for (let i = 0; i < 14; i++) { pos.push(new THREE.Vector3()); vel.push(new THREE.Vector3()); seed.push(r() * 9); }
  return {
    scene, key, fibres, drop, dots, cloth,
    update(t) {
      // giọt nhỏ dần, hạt bốc lên
      const k = clamp((t % 6) / 6);
      drop.setSize(k);
      for (let i = 0; i < 14; i++) {
        const a = (t * .6 + seed[i]) % 1;
        pos[i].set(-.02 + Math.sin(seed[i] + t) * .006, .125 + a * .30, .15 + Math.cos(seed[i] * 2) * .006);
        setDot(dots, i, pos[i]);
      }
      dots.count = 14; dots.instanceMatrix.needsUpdate = true;
    },
  };
}

// ─────────────────────────────────────────────────────────────────────
// N3 · Mặt nước (cận)
// ─────────────────────────────────────────────────────────────────────
export function buildWater() {
  const scene = new THREE.Scene();
  // không khí tối, mặt nước sáng: đường chân trời của nước là vệt sáng giữa khung
  scene.background = canvasTex(64, 512, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#3d4d78');
    gr.addColorStop(.40, '#2a3350');
    gr.addColorStop(1, '#141a30');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
  });
  scene.fog = new THREE.Fog('#22304f', 1.1, 2.9);
  const key = keyLight(scene, { from: new THREE.Vector3(-1.6, 1.3, 2.0), to: new THREE.Vector3(0, 0, 0), color: '#ffd6a4', intensity: 2.4, size: 1.2 });
  ambience(scene, { hemi: '#7f9ade', ground: '#141a2e', rim: '#6f4fd8' });
  const surf = P.waterSurface({ w: 1.5, d: .9 }); scene.add(surf.group);
  // bờ chật phía sau: gỗ tối, không phải một thanh nâu sáng
  const bank = mesh(rbox(1.8, .14, .5, .02), toon('#3a2c22'), [0, -.03, -.66]); scene.add(bank);   // mép bờ nhô lên khỏi mặt nước: nhát chân trời phải đọc ra
  return {
    scene, key, surf,
    update(t, opt = {}) {
      surf.update(t);
      // phần nước còn lại mát đi: mặt nước chuyển sang xanh sâu và tối lại
      const cool = opt.cool ? 1 : 0;
      surf.water.material.color.set(cool ? '#6f9ad6' : '#bff2ff');
      surf.water.material.opacity = cool ? .80 : .85;
      key.intensity = cool ? 1.9 : 2.4;
    },
  };
}
