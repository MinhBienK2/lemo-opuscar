// Bối cảnh của tập: N1 hiên phơi + N4 căn phòng kín (cùng một căn, phòng nằm sau bức tường có cửa
// kính — nhìn qua cửa từ hiên vào phòng), N2 trong sợi vải, N3 mặt nước.
import * as THREE from 'three';
import { PAL, toon, glowMat, TEX, rbox, mesh, fxLayer, cushionGeo, surface, mulberry, clamp, lerp, seg, ss, eo, canvasTex } from '../../../../rig/kit.js';
import { keyLight, ambience, pool } from '../../../../rig/lights.js';
import { glowDots, halos, sparks, setDot, setHalo, setStreak, flow } from '../../../../rig/fx.js';
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
  const doorFrame = [
    mesh(rbox(DOORX1 - DOORX0 + .12, .07, .16, .012), frame, [(DOORX0 + DOORX1) / 2, DOORH, WZ]),
    mesh(rbox(.07, DOORH, .16, .012), frame, [DOORX0 - .03, DOORH / 2, WZ]),
    mesh(rbox(.07, DOORH, .16, .012), frame, [DOORX1 + .03, DOORH / 2, WZ]),
  ];
  doorFrame.forEach(m => scene.add(m));
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
  // hơi nước NGƯNG trên kính: câu 53 nói không khí trong phòng không đi đâu cả, nó
  // quay lại bám lại — trên kính kín thì hơi nước có chỗ để bám, và chỗ đó phải
  // đọc được trong khung.
  const paneFogTex = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = 'rgba(0,0,0,0)'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = 6 + Math.random() * 26;
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(226,240,248,.55)'); g.addColorStop(1, 'rgba(226,240,248,0)');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    }
    // vài giọt nước chảy dọc
    c.strokeStyle = 'rgba(232,246,252,.55)'; c.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      const x = Math.random() * w;
      c.beginPath(); c.moveTo(x, Math.random() * h * .4); c.lineTo(x + 3, Math.random() * h * .6 + h * .3); c.stroke();
    }
  });
  const paneFog = new THREE.Mesh(new THREE.PlaneGeometry(.88, .84), new THREE.MeshBasicMaterial({
    map: paneFogTex, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
  paneFog.position.set(WX, WY, -6.545); paneFog.renderOrder = 3;
  scene.add(paneFog);

  // đèn trong phòng: chỉ một đèn bàn nhỏ, phòng tối
  // vệt nắng sớm rọi qua lan can, đọn trên sàn gạch
  pool(scene, { from: new THREE.Vector3(-6.2, 5.6, 5.6), to: new THREE.Vector3(-.9, 0, .9), color: '#ffe2b0', intensity: 2.4, angle: .30, penumbra: .8 });

  const roomLamp = new THREE.PointLight('#ffc987', .55, 3.6, 2); roomLamp.position.set(-1.4, 1.35, -4.3); scene.add(roomLamp);
  const roomAmb = new THREE.PointLight('#7f8fd8', .40, 4.0, 2); roomAmb.position.set(1.0, 1.9, -3.2); scene.add(roomAmb);
  const roomCeil = new THREE.PointLight('#ffe2b4', 1.25, 7.0, 2); roomCeil.position.set(-.1, 2.55, -3.6); scene.add(roomCeil);
  const roomFill = new THREE.PointLight('#cfd8ff', .45, 5.0, 2); roomFill.position.set(-1.9, 1.6, -2.0); scene.add(roomFill);
  // đèn góc xa: nó nằm ở góc tường phải, ngay trên áo tối treo ở thanh treo B.
  // Trước đây nó đứng sát tường (2.45, còn mặt trong của tường ở 2.54) nên đốt thành một
  // vũng sáng trắng cháy trên tường, ngay trên chiếc áo tối — nhận xét nghiệm thu vòng 1.
  // Đẩy ra khỏi tường và hạ sáng: vùng sáng vẫn có để đọc góc phòng, nhưng không còn chói.
  const cornerLamp = new THREE.PointLight('#8ea6ff', .30, 3.2, 2); cornerLamp.position.set(2.02, 2.02, -5.10); scene.add(cornerLamp);
  // đèn trong phòng (kể cả nắng, vì nắng là đèn chiều nên nó rọi vào cả phòng) hạ sáng theo từng nhát:
  // góc xa của phòng phải thật tối, không phải một căn phòng sáng đều
  const roomLights = [roomLamp, roomAmb, roomCeil, roomFill, sun, cornerLamp];
  const roomBase = roomLights.map(l => l.intensity);
  // đèn tập trung: rộng và mềm, để không để lại một vệt trắng chói trên vải
  const focus = new THREE.SpotLight('#ffe0b0', 0, 5.0, .60, .85, 1.2);
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
  const teeBack = P.tShirt({ color: '#d3b791', wetColor: '#b3946d', w: .52, h: .62 });
  teeBack.group.position.set(.85, line.yAt(.85), .85); teeBack.group.rotation.y = -.14; scene.add(teeBack.group);
  // kẹp gỗ: kẹp đúng chỗ dây chùng xuống (kẹp phải đi theo dây khi dây đung đưa)
  const lineClips = [];
  for (const x of [-1.42, 1.50, -.42, .85]) {
    const c = P.clothesClip(); c.group.position.set(x, line.yAt(x), .85); scene.add(c.group);
    lineClips.push({ g: c.group, x, y: line.yAt(x) });
  }
  // dây thứ hai: đàn áo chồng + áo phơi một mặt. Nó nằm ở bên PHẢI, không
  // cắt ngang mặt đồng hồ ẩm (trước đây nó cắt ngang, che chữ HUMIDITY).
  const line2 = P.dryingLine({ len: 2.4, sag: .2, y: 1.98 }); line2.group.position.set(.9, 0, -.62); scene.add(line2.group);
  // BA ÁO CHỒNG THẬT SỰ, treo cùng dây thứ hai: trước đây đàn áo có dây riêng
  // và chỉ hai chiếc lọt vào khung, nên câu "ba cái áo phơi chồng lên nhau" không
  // có hình. Đàn áo không mang dây riêng nữa — nó treo trên dây thứ hai.
  const pile = P.shirtPile({ n: 3, yAt: (lx) => line2.yAt(lx - .45) });
  pile.group.position.set(.45, 0, -.62); pile.rope.visible = false;
  for (const c of pile.clips) c.g.visible = false;
  scene.add(pile.group);
  // áo phơi một mặt: nửa khô, nửa còn ẩm (hình bám cho lời "phơi cả hai mặt")
  const half = P.halfShirt({ w: .60, h: .74 });
  half.group.position.set(1.02, line2.yAt(.12), -.62); half.group.rotation.y = -.12; scene.add(half.group);
  const clip2 = P.clothesClip(); clip2.group.position.set(1.02, line2.yAt(.12), -.62); scene.add(clip2.group);
  // kẹp cho ba áo trong đàn áo, gắn vào dây thứ hai
  const line2Clips = [];
  for (const px of [.19, .45, .71]) {
    const c = P.clothesClip(); c.group.position.set(px, line2.yAt(px - .9), -.62); scene.add(c.group);
    line2Clips.push({ g: c.group, x: px, y: line2.yAt(px - .9) });
  }

  // bồn chậu dưới dây
  const basin = P.basin(); basin.group.position.set(-1.25, 0, .85); scene.add(basin.group);
  // ghế gỗ (đạo cụ của hiên)
  const chair = P.chair(); chair.group.position.set(-2.0, 0, 1.35); chair.group.rotation.y = .5; scene.add(chair.group);
  // ── bàn phơi gỗ: hai câu cuối (#49, #60) cần hai cái áo nằm cạnh nhau ──
  // Trước đây chúng nằm trên sàn gạch: lệch với mọi cảnh khác trong phim (mọi
  // cảnh còn lại đều treo trên dây), và khung thành một mảng gạch trơn. Bàn
  // phơi là một đạo cụ đứng riêng: khung có mặt bàn gỗ và hai cái áo trải ra.
  const bench = P.dryBench({ w: 2.30, d: .82, h: .42 });
  bench.group.position.set(-.75, 0, 1.30); scene.add(bench.group);
  // cái áo phơi rộng: trải phẳng, cả hai mặt phơi ra — đối chiếu với cái áo úp.
  const spread = P.spreadShirt({ color: '#e3d8bd', w: .62, h: .66 });   // không trắng cháy: người chấm vòng 5 nói cái áo này mất sạch chi tiết vải
  // trải phẳng: xoay vải nằm xuống mặt bàn, ép nếp vải (trục đứng của vải) xuống
  // còn 35 % rồi nâng lên cho điểm thấp nhất chạm mặt bàn.
  spread.group.rotation.order = 'ZYX';                    // xoay quanh trục đứng SAU khi trải phẳng
  spread.group.rotation.set(-Math.PI / 2, .38, 0);
  spread.group.scale.set(1, 1, .35);
  spread.group.position.set(0, 0, 0);
  spread.body.name = 'spreadBody';
  spread.group.updateMatrixWorld(true);
  const spreadBox = new THREE.Box3().setFromObject(spread.group);
  spread.group.position.set(-.55, .42 - spreadBox.min.y + .006, 1.30);
  scene.add(spread.group);
  // cái áo úp: áo phông còn ẩm úp mép dưới lên, nằm trên bàn CẠNH cái áo
  // phơi rộng — hai cái cùng một khung để so: một cái trải hết mặt, một cái
  // úp gấp lại.
  const upShirt = P.foldedShirt({ color: '#b3c3cf', wetColor: '#7d93a3', w: .62, h: .72 });   // không trắng cháy: người chấm vòng 5 nói cái áo này mất sạch chi tiết vải
  upShirt.group.rotation.order = 'ZYX';
  upShirt.group.rotation.set(-Math.PI / 2, -.30, 0);
  upShirt.group.scale.set(1, 1, .35);
  upShirt.group.position.set(0, 0, 0);
  upShirt.body.name = 'upBody';
  upShirt.group.updateMatrixWorld(true);
  const upBox = new THREE.Box3().setFromObject(upShirt.group);
  upShirt.group.position.set(-1.30, .42 - upBox.min.y + .006, 1.22);
  scene.add(upShirt.group);
  // vị trí thế giới của hai cái áo trên bàn: thẻ "ÁO ÚP" và "PHƠI RỘNG" bám
  // vào chính cái áo chúng gọi tên, không vào một điểm cố định trong không gian
  // (vòng chấm 5 thấy hai thẻ đó trỏ nhầm sang cái áo của nhau).
  const spreadPos = () => spread.group.getWorldPosition(new THREE.Vector3()).toArray();
  const upPos = () => upShirt.group.getWorldPosition(new THREE.Vector3()).toArray();
  // bàn phơi thứ hai, tách riêng: câu 60 nói "tách riêng, phơi cả hai mặt" thì
  // phải có HAI mặt phơi RIÊNG BIỆT, không lặp lại đúng khung của câu 49.
  const bench2 = P.dryBench({ w: 1.10, d: .74, h: .42 });
  bench2.group.position.set(1.20, 0, 1.36); scene.add(bench2.group);
  const flipShirt = P.foldedShirt({ color: '#dde5ea', wetColor: '#8f9fac', w: .56, h: .64 });
  flipShirt.group.rotation.order = 'ZYX';
  flipShirt.group.rotation.set(-Math.PI / 2, .42, 0);
  flipShirt.group.scale.set(1, 1, .35);
  flipShirt.group.position.set(0, 0, 0);
  flipShirt.body.name = 'flipBody';
  flipShirt.group.updateMatrixWorld(true);
  const flipBox = new THREE.Box3().setFromObject(flipShirt.group);
  flipShirt.group.position.set(1.20, .42 - flipBox.min.y + .006, 1.36);
  scene.add(flipShirt.group);
  // góc áo lật lên: mặt trong lộ ra (màu tối hơn, có vệt ẩm) — câu 60 nói
  // "phơi cả hai mặt", nên phải thấy được cả mặt ngoài lẫn mặt trong.
  const flipCorner = mesh(new THREE.PlaneGeometry(.24, .19), toon('#93a4b0'), [.17, -.26, .028], { rot: [-1.05, 0, .38] });
  flipShirt.group.add(flipCorner);
  const flipWet = mesh(new THREE.PlaneGeometry(.13, .10), toon('#6f8494'), [.19, -.27, .045], { rot: [-1.05, 0, .38] });
  flipShirt.group.add(flipWet);
  // chỗ góc áo lật (mặt trong lộ ra) trong không gian: thẻ "CẢ HAI MẶT" bám vào
  // đúng nó, không bám vào chỗ trống
  const flipCornerPos = new THREE.Vector3();
  flipShirt.group.updateMatrixWorld(true);
  flipCorner.getWorldPosition(flipCornerPos);
  // ── cái áo úp CÒN ẨM TRÊN SÀN: đúng hình kết mà TREATMENT đã hứa
  // ("quay lại hiên … cạnh đó TRÊN SÀN còn để một cái áo úp còn ẩm").
  // Không tái dùng cái áo úp trên bàn của câu 49: nó đã nằm đó, và một cái áo
  // tự bay từ bàn xuống sàn giữa phim là điều không có thật.
  // Trải phẳng (không gấp, không chồng): cả hai mặt đều hứng gió.
  // Màu NGƯỜI ẨM, không phải màu vải khô: nền sàn hiên là gạch ấm, một cái áo
  // kem trên nền ấm thì không tách ra được. Mặt áo úp xuống sàn vẫn ẩm, nên cả
  // mặt nhìn thấy là màu lạnh ẩm — đọc được ngay "còn ẩm".
  const floorShirt = P.tShirt({ color: '#c9d3d7', wetColor: '#a2b4c0', w: .60, h: .72 });
  floorShirt.group.rotation.order = 'ZYX';
  floorShirt.group.rotation.set(-Math.PI / 2, .46, 0);
  floorShirt.group.scale.set(1, 1, .42);
  floorShirt.group.position.set(0, 0, 0);
  floorShirt.group.updateMatrixWorld(true);
  const fsBox = new THREE.Box3().setFromObject(floorShirt.group);
  floorShirt.group.position.set(.30, .010 - fsBox.min.y, 1.50);
  scene.add(floorShirt.group);
  const floorPos = () => floorShirt.group.getWorldPosition(new THREE.Vector3()).toArray();
  // túi nylon buộc ở đầu dây phơi, nơi gió thổi qua
  const bag = P.nylonBag(); bag.group.position.set(1.86, 1.30, .85); scene.add(bag.group);
  scene.add(mesh(new THREE.CylinderGeometry(.004, .004, .12, 6), P.M.rope, [1.86, 1.50, .85]));
  // nhiệt kế + ẩm kế trên tường
  const thermo = P.thermometer(); thermo.group.position.set(-2.25, 1.95, WZ + .08); scene.add(thermo.group);
  const hygro = P.hygrometer(); hygro.group.position.set(-1.72, 1.95, WZ + .08); scene.add(hygro.group);
  // cột "ma" 30 °C đứng cạnh nhiệt kế: nó mảnh và nhạt quá nên người xem không
  // thấy đó là một cột, và thẻ "30 °C" trông như trỏ vào que đỏ MAX. Làm nó
  // đậm và sáng hơn để nó đọc được đúng là một cột thuỷ ngân màu đỏ.
  const ghostCol = thermo.group.children.find(o => o.geometry?.type === 'CylinderGeometry'
    && Math.abs((o.geometry.parameters?.radiusTop ?? 0) - .0075) < 1e-6);
  if (ghostCol) { ghostCol.scale.x = 2.0; ghostCol.scale.z = 2.0; ghostCol.material.opacity = .72; }
  // ẩm kế thứ hai: không khí khô, đặt cạnh để câu 46 có một CÁI SO SÁNH đọc được
  // (chín mươi phần trăm bên trái, nửa bên phải) thay vì một cái kim trơ trại.
  const hygro2 = P.hygrometer(); hygro2.group.position.set(-1.22, 1.95, WZ + .08); scene.add(hygro2.group);
  // ── nhiệt kế thứ hai: đọc BA MƯƠI độ, đặt cạnh tấm vải thử (câu 44–45) ──
  // Nhiệt kế treo trong cảnh luôn đọc hai mươi lăm độ (FACTS.md). Ba mươi độ
  // cần một thiết bị RIÊNG đặt cạnh tấm vải thử: một thanh đỏ mờ đứng cạnh
  // vỏ nhiệt kế (cột "ma" cũ) người xem không đọc ra là một cột thuỷ ngân.
  const thermo30 = P.thermometer();
  thermo30.group.position.set(-2.45, 1.70, WZ + .08);
  thermo30.setTemp(.5);                       // k = 0.5 → đỉnh cột đúng vạch ba mươi độ
  thermo30.group.visible = false;
  scene.add(thermo30.group);
  // đỉnh cột thuỷ ngân của nó trong không gian: thẻ "30 °C" bám vào đúng đỉnh
  const thermo30Top = () => {
    const v = new THREE.Vector3(.0215, -.02, .004);
    thermo30.group.updateMatrixWorld(true);
    return thermo30.group.localToWorld(v).toArray();
  };
  // dấu ngoặc so sánh nối hai ẩm kế: câu 46 nói không khí ẩm làm nước bay hơi
  // chậm hơn khoảng năm lần, nên "×5" phải bám vào MỘT VẬT — dấu ngoặc này.
  const cmpBar = new THREE.Group(); cmpBar.position.set(-1.47, 2.12, WZ + .06); scene.add(cmpBar);
  cmpBar.add(mesh(rbox(.30, .008, .008, .002), toon('#d1443c'), [0, 0, 0], { cast: false, recv: false }));
  for (const sx of [-1, 1]) cmpBar.add(mesh(rbox(.008, .070, .008, .002), toon('#d1443c'), [sx * .15, -.038, 0], { cast: false, recv: false }));
  cmpBar.visible = false;
  // tấm vải thử ướt treo trên tường ngay dưới khe giữa hai đồng hồ: câu 45 nói
  // "ba mươi độ thì hơi nước lan xa hơn, đặc hơn" thì hơi nước phải BỐC LÊN TỪ
  // MỘT TẤM VẢI ƯỚT trong khung, không bay ra từ chính mặt đồng hồ đo.
  const wallCloth = P.towel({ color: '#d6e4ec', wetColor: '#6d90a6' });
  wallCloth.group.scale.setScalar(.40);
  wallCloth.group.position.set(0, 0, 0);
  wallCloth.group.updateMatrixWorld(true);
  const wcBox = new THREE.Box3().setFromObject(wallCloth.group);
  wallCloth.group.position.set(-1.98, 1.72 - wcBox.min.y, -.92);
  scene.add(wallCloth.group);
  scene.add(mesh(new THREE.CylinderGeometry(.006, .006, .07, 6), P.M.metal, [-1.98, 1.76, -.92], { rot: [0, 0, Math.PI / 2] }));
  wallCloth.setWet(1);

  // dây phơi nhỏ ở tường sau, cạnh cửa sổ kín: câu 53 nói "phơi trong nhà" thì
  // trong khung phải thấy một cái áo ướt đang treo trong nhà, không chỉ có cửa sổ.
  const backRack = P.dryingLine({ len: .80, sag: .07, y: 1.66 });
  backRack.group.position.set(-.70, 0, -6.28); scene.add(backRack.group);
  const backShirt = P.tShirt({ color: '#e6ebe7', wetColor: '#93a2ae', drops: true });
  backShirt.group.position.set(-.70, backRack.yAt(0) - .006, -6.28);
  scene.add(backShirt.group);

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
  // ── cặp áo thí nghiệm của câu 4–5–7: một trước quạt, một ngoài tầm gió ──
  // Cặp này RIÊNG, ở góc trước-phải của phòng. Trước đây câu "một cái trước
  // quạt, một cái ở góc xa" phải dùng chung một khung phòng với đàn áo và hai
  // áo trên kệ, nên trong khung có bốn cái áo và không xác định được cái nào
  // là cái nào. Ở đây chỉ có đúng hai cái, cùng kiểu, cùng màu, cùng kích thước.
  const cmpFan = P.deskFan(); cmpFan.group.scale.setScalar(.58);
  cmpFan.group.position.set(1.20, .70, -2.60); cmpFan.setAim(Math.PI / 2); scene.add(cmpFan.group);
  const cmpRail = new THREE.Group(); scene.add(cmpRail);
  cmpRail.add(mesh(new THREE.CylinderGeometry(.012, .012, 1.45, 10), P.M.metal, [1.72, 1.50, -2.60], { rot: [0, 0, Math.PI / 2] }));
  for (const x of [1.05, 2.40]) cmpRail.add(mesh(new THREE.CylinderGeometry(.016, .016, .07, 8), P.M.metalDark, [x, 1.50, -2.60], { rot: [Math.PI / 2, 0, 0] }));
  const cmpA = P.tShirt({ color: '#f2f0e6', wetColor: '#8f98ab', w: .56, h: .72 });
  cmpA.group.position.set(1.72, 1.42, -2.60); scene.add(cmpA.group);
  const cmpB = P.tShirt({ color: '#f2f0e6', wetColor: '#8f98ab', w: .56, h: .72 });
  cmpB.group.position.set(2.30, 1.42, -2.60); scene.add(cmpB.group);
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
    color: '#7fdcf0', transparent: true, opacity: .46, depthWrite: false, side: THREE.DoubleSide, vertexColors: true,
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
  // giọt sau vách không có gió, nhưng vẫn bay hơi: vài hạt hơi nước nhỏ bốc
  // lên từ giọt. Không có hơi nước bốc lên thì câu 37 là một khung đứng yên.
  const dropVap = glowDots(8, .0055, '#cfe9f7', 1.0); scene.add(dropVap);
  const dropVapPos = [];
  for (let i = 0; i < 8; i++) dropVapPos.push(new THREE.Vector3());
  // quạt nhỏ ở cuối bàn, thổi ngang dọc bàn: gió quét mặt kính phải, vách ngăn chặn mặt kính trái
  const fanB = P.deskFan(); fanB.group.scale.setScalar(.62); fanB.group.position.set(2.38, .72, -6.15); fanB.setAim(-Math.PI / 2); scene.add(fanB.group);
  // VÁCH NGĂN giữa hai tấm kính phải đọc được như một bức tường chặn gió: nó
  // kính trong suốt thì người xem tưởng quạt thổi vào CẢ HAI tấm kính, và phép
  // so sánh của câu 35–37 sai. Cho vách một mặt kính mờ riêng.
  lab.divider.material = lab.divider.material.clone();
  lab.divider.material.opacity = .30;
  lab.divider.material.color.set('#dcecf3');
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
  // dải gió của quạt nhỏ trên kệ: màn khí mờ kéo từ miệng quạt sang trái,
  // qua áo trước quạt rồi tắt dần trước áo ở góc xa. Nó phải CHẠY: câu 33–34
  // nói về gió, thì gió phải thấy đi trong khung.
  const shelfWindMat = new THREE.MeshBasicMaterial({
    map: TEX.radial(), color: new THREE.Color('#a8dcf2'), transparent: true,
    opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const shelfWind = new THREE.Mesh(new THREE.PlaneGeometry(.95, .30), shelfWindMat);
  shelfWind.position.set(-1.42, 1.36, -5.44); shelfWind.renderOrder = 5;
  fxLayer(shelfWind); scene.add(shelfWind);
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

  // ── vệt ẩm trên quần dày: câu "quần áo dày giữ nhiều nước hơn" phải có nước
  // NGAY TRÊN CÁI QUẦN ĐƯỢC DÁN NHÃN. Trước đây vật được dán nhãn thì khô, còn
  // nước lại nằm ở một cái áo không mang nhãn — người xem đọc ngược.
  const wetPatchTex = canvasTex(256, 256, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    const g0 = c.createRadialGradient(w / 2, h / 2, w * .06, w / 2, h / 2, w * .47);
    g0.addColorStop(0, 'rgba(74,138,196,.72)');
    g0.addColorStop(.55, 'rgba(96,158,208,.44)');
    g0.addColorStop(1, 'rgba(96,158,208,0)');
    c.fillStyle = g0; c.fillRect(0, 0, w, h);
  });
  const wetPatchMat = new THREE.MeshBasicMaterial({ map: wetPatchTex, transparent: true, opacity: .85, depthWrite: false, side: THREE.DoubleSide });
  const jeansPatch = new THREE.Mesh(new THREE.PlaneGeometry(.17, .30), wetPatchMat);
  jeansPatch.position.set(-.02, -.38, .075); jeansPatch.renderOrder = 4;
  fxLayer(jeansPatch); pants.group.add(jeansPatch);
  // vệt ẩm nhỏ hơn trên áo thun mỏng: nó giữ ít nước hơn
  const teePatch = new THREE.Mesh(new THREE.PlaneGeometry(.10, .16), wetPatchMat.clone());
  teePatch.material.opacity = .40;
  teePatch.position.set(.02, -.16, .055); teePatch.renderOrder = 4;
  fxLayer(teePatch); tee.group.add(teePatch);
  pants.setWet(1);
  // vũng nước rịn ra từ mép cái áo úp trên bàn phơi: úp thì nước không đi đâu,
  // nó tích lại và rịn ra — câu 49 phải thấy được, không chỉ nghe nói.
  const apoPuddle = new THREE.Mesh(new THREE.PlaneGeometry(.40, .30), wetPatchMat.clone());
  apoPuddle.material.opacity = .70;
  apoPuddle.rotation.x = -Math.PI / 2;
  apoPuddle.position.set(-1.30, .4235, 1.22); apoPuddle.renderOrder = 4;
  fxLayer(apoPuddle); scene.add(apoPuddle);
  // vệt ẩm dưới cái áo úp trên sàn (câu 60): nó CÒN ẨM, và phải thấy được
  const floorWetPatch = new THREE.Mesh(new THREE.PlaneGeometry(.62, .48), wetPatchMat.clone());
  floorWetPatch.material.opacity = .62;
  floorWetPatch.rotation.x = -Math.PI / 2;
  floorWetPatch.position.set(.30, .006, 1.56); floorWetPatch.renderOrder = 4;
  fxLayer(floorWetPatch); scene.add(floorWetPatch);

  // ── cột hơi nước bốc lên từ mép trên của tấm áo A ──
  // "Chỗ trống ngay trên vải" và "hơi nước mới đi được" là hai câu cùng một
  // hình: một cột hơi nước bốc lên qua khoảng không phía trên mặt áo. Không có
  // cột này thì hai câu đó không có hình gì cả.
  const vapColSpk = glowDots(18, .0105, '#cfeeff', .95); scene.add(vapColSpk);
  const vapColPos = [];
  for (let i = 0; i < 18; i++) vapColPos.push(new THREE.Vector3());
  // dải ẩm bão hoà ở mép áo: câu 25 nói lớp ẩm "bám sát vải, nhanh chóng bị bão
  // hoà" — dải tối ở mép dưới, ngay phía trên là vùng vải khô để đối chiếu
  // dải ẩm bão hoà: đậm ở mép áo, mờ dần lên trên (nơi vải còn khô)
  const hemTex = () => canvasTex(256, 128, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    for (let y = 0; y < h; y++) {
      const t = y / (h - 1);                       // 0 ở đỉnh dải, 1 ở mép áo
      const a = Math.pow(t, .85) * .88;
      const g = c.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(.20, `rgba(255,255,255,${(a * .88).toFixed(3)})`);
      g.addColorStop(.5, `rgba(255,255,255,${a.toFixed(3)})`);
      g.addColorStop(.80, `rgba(255,255,255,${(a * .88).toFixed(3)})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(0, y, w, 1);
    }
  });
  // DẢI ẨM BÃO HOÀ phải đọc ra là một MỨC trên vải, không phải một vệt xanh
  // loang: nên nó có một vạch sáng rõ ở chỗ ẩm chạm vải khô, và mép dưới của
  // dải luôn bám vào mép vải (đuôi thẻ "BAO HÒA" chỉ vào vạch mức đó).
  const hemBandTex = canvasTex(64, 256, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(31,79,136,0)');        // trên: vải khô
    g.addColorStop(.55, 'rgba(31,79,136,.92)');    // dưới: ẩm bão hoà
    g.addColorStop(1, 'rgba(31,79,136,.92)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#bff0ff'; c.fillRect(0, h * .55 - 3, w, 7);   // vạch mức: chỗ ẩm dừng lại
  });
  const hemBand = mesh(new THREE.PlaneGeometry(.68, .46), new THREE.MeshBasicMaterial({
    map: hemBandTex, color: new THREE.Color('#ffffff'), transparent: true, opacity: 1, depthWrite: false, side: THREE.DoubleSide,
  }), [.42, .78, -3.255], { cast: false, recv: false });
  hemBand.renderOrder = 4; fxLayer(hemBand); scene.add(hemBand);
  // vạch mức bão hoà trong không gian (thẻ "BAO HÒA" bám vào đây)
  const hemTop = () => [.42, .70 + .46 * hemBand.scale.y * .45, -3.245];
  // lớp ẩm bị gió quét đi ở câu 27: một vệt mờ trên vải, trượt về phía quạt rồi tan
  const wetLayer = mesh(new THREE.PlaneGeometry(.52, .30), new THREE.MeshBasicMaterial({
    map: TEX.radial(), color: new THREE.Color('#bfe4f2'), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide,
  }), [.42, .95, -3.255], { cast: false, recv: false });
  wetLayer.renderOrder = 4; fxLayer(wetLayer); scene.add(wetLayer);
  // gió ở lối mở ra hiên: câu 58–59 nói gió cần một lối thông gió
  const doorSpk = glowDots(18, .016, '#bfeaf8', .85); scene.add(doorSpk);   // hạt khí qua lối mở phải thấy được
  const doorPos = [];
  for (let i = 0; i < 14; i++) doorPos.push(new THREE.Vector3());
  // hơi nước MỎNG ở câu 45 (ba mươi độ): bay nhanh, lan rộng
  const denseSpk = glowDots(14, .0075, '#dff4ff', .8); scene.add(denseSpk);
  const densePos = [];
  for (let i = 0; i < 14; i++) densePos.push(new THREE.Vector3());
  // hơi nước ĐẶC ở câu 46 (không khí ẩm chín mươi phần trăm): bốc CHẬM
  const slowSpk = glowDots(10, .014, '#e8f8ff', .85); scene.add(slowSpk);
  const slowPos = [];
  for (let i = 0; i < 10; i++) slowPos.push(new THREE.Vector3());

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
  // vệt gió: mảnh và mờ, như hơi khí đang bay — không phải ván sáng trắng
  const windSpk = sparks(22, '#9fd0ea', .55); scene.add(windSpk);

  // ── hai dòNG khí: nhiệt rời vải, và không khí quay lại bám áo ───────────
  // Câu 21 nói nước bay hơi lấy nhiệt TỪ CHÍNH CÁI VẢI: phải thấy nhiệt rời đi.
  const heatFlow = flow(new THREE.Vector3(.42, 1.04, -3.235), new THREE.Vector3(.42, 1.66, -3.235),
    { color: '#6fb0ff', size: .075, lift: .05, n: 26, rate: .5, seed: 7, opacity: .42 });
  scene.add(heatFlow);
  // Câu 52 nói không khí trong phòng quay lại bám quanh cái áo: một dòng khí
  // đi từ phía phòng trở về tấm áo, không phải giọt nước đọng trên vải.
  const backFlow = flow(new THREE.Vector3(1.45, 1.72, -4.60), new THREE.Vector3(2.20, 1.26, -5.00),
    { color: '#9fdcf0', size: .090, lift: .12, n: 26, rate: .45, seed: 11, opacity: .34 });
  scene.add(backFlow);

  // ── hai vật thể MỚ thay cho các hạt tròn lơ lửng ────────────────────────
  // 1) DẢI HƠI NƯỚC bay lên từ vai áo: một dải mờ có hướng đi, không phải mấy
  //    hạt tròn đứng yên. Câu 23 nói "chỗ trống đó hơi nước mới đi được" thì
  //    trong khung phải thấy hơi nước CÓ ĐƯỜNG ĐI.
  const vapBandTex = canvasTex(128, 256, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    for (let y = 0; y < h; y++) {
      const t = y / (h - 1);                       // 0 ở đỉnh dải, 1 ở đáy
      const a = Math.pow(t, 1.2) * .82;
      const g = c.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, 'rgba(188,230,255,0)');
      g.addColorStop(.5, `rgba(222,243,255,${a.toFixed(3)})`);
      g.addColorStop(1, 'rgba(188,230,255,0)');
      c.fillStyle = g; c.fillRect(0, y, w, 1);
    }
  });
  const vapBandMat = new THREE.MeshBasicMaterial({ map: vapBandTex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const vapBand = new THREE.Mesh(new THREE.PlaneGeometry(.30, .52), vapBandMat);
  vapBand.position.set(.42, 1.66, -3.255); vapBand.renderOrder = 5;
  fxLayer(vapBand); scene.add(vapBand);
  // 2) DẢI GIÓ: màn khí mờ kéo từ miệng quạt sang tấm áo (câu 28) và mảnh ẩm
  //    bị quét xa hơn sau khi gió mạnh lên (câu 31).
  const veilMat = new THREE.MeshBasicMaterial({ map: TEX.radial(), color: new THREE.Color('#a8dcf2'), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const windVeil = new THREE.Mesh(new THREE.PlaneGeometry(1.30, .40), veilMat);
  windVeil.position.set(-.35, 1.10, -3.00); windVeil.renderOrder = 5;
  fxLayer(windVeil); scene.add(windVeil);
  const veilMat2 = veilMat.clone();
  const windVeil2 = new THREE.Mesh(new THREE.PlaneGeometry(.80, .34), veilMat2);
  windVeil2.position.set(1.05, 1.14, -3.00); windVeil2.renderOrder = 5;
  fxLayer(windVeil2); scene.add(windVeil2);
  // gió nhẹ ngoài hiên: dải mờ trôi qua dây phơi (câu 47–60)
  const breezeMat = new THREE.MeshBasicMaterial({
    map: TEX.radial(), color: new THREE.Color('#bfe4f2'), transparent: true,
    opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const breeze = new THREE.Mesh(new THREE.PlaneGeometry(2.10, .50), breezeMat);
  breeze.position.set(0, 1.40, 1.36); breeze.renderOrder = 5;
  fxLayer(breeze); scene.add(breeze);
  const windPos = [], windVel = [];
  for (let i = 0; i < 40; i++) {
    windPos.push(new THREE.Vector3());
    windVel.push(new THREE.Vector3(1, 0, 0));
  }
  // luồng gió của quạt nhỏ ở cặp áo thí nghiệm: từ miệng quạt sang phải,
  // chạm vào cái áo A rồi tắt hẳn trước cái áo B — đó là lý do một cái khô,
  // một cái không.
  const cmpSpk = glowDots(16, .0085, '#cfeaf4', .95); scene.add(cmpSpk);
  const cmpPos = [], cmpVel = [];
  for (let i = 0; i < 16; i++) { cmpPos.push(new THREE.Vector3()); cmpVel.push(new THREE.Vector3(1, 0, 0)); }

  // hơi nước bốc lên từ cái áo úp trên bàn phơi: úp thì hơi nước bị kẹt dưới
  // vải, nơi không khí nào chạm tới — phải THẤY được ở câu 49, không chỉ nghe.
  const vapApoSpk = glowDots(14, .005, '#cfeeff', .8); scene.add(vapApoSpk);
  const vapApoPos = [];
  for (let i = 0; i < 14; i++) vapApoPos.push(new THREE.Vector3());

  // ba giọt nước bám đúng mép áo A nằm sẵn trong đạo cụ tShirt (three teardrops ở mép vải),
  // nên không dựng thêm nhóm giọt riêng ở đây.

  // lớp hơi ẩm: một tấm kính mờ bám sát mặt áo — trong, mềm, nhưng có mép sáng riêng
  // lớp hơi ẩm phải đọc ra là MỘT TẤM KÍNH MỜ phủ lên vải, không phải một vệt
  // tròn nổi lên: vì vậy texture là một tấm màn mờ, mép mờ dần, giữa đục đều.
  const mistTex = canvasTex(256, 256, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    const gx = c.createLinearGradient(0, 0, w, 0);
    gx.addColorStop(0, 'rgba(190,245,255,0)');
    gx.addColorStop(.18, 'rgba(190,245,255,.80)');
    gx.addColorStop(.82, 'rgba(190,245,255,.80)');
    gx.addColorStop(1, 'rgba(190,245,255,0)');
    c.fillStyle = gx; c.fillRect(0, 0, w, h);
    const gy = c.createLinearGradient(0, 0, 0, h);
    gy.addColorStop(0, 'rgba(190,245,255,0)');
    gy.addColorStop(.22, 'rgba(190,245,255,.74)');
    gy.addColorStop(.78, 'rgba(190,245,255,.74)');
    gy.addColorStop(1, 'rgba(190,245,255,0)');
    c.globalCompositeOperation = 'destination-in';
    c.fillStyle = gy; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'source-over';
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
  // lớp hơi mờ phải đứng TRƯỚC cái áo (z lớn hơn): đứng sau thì áo che mất nó
  const mistBal = mesh(new THREE.PlaneGeometry(.86, 1.06), mistMat.clone(), [-1.25, 1.10, .97], { cast: false, recv: false });
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
  const vapBal = glowDots(16, .015, '#9fdcf0', .85); fxLayer(vapBal); scene.add(vapBal);
  const vapBalPos = [];
  for (let i = 0; i < 16; i++) vapBalPos.push(new THREE.Vector3());
  // hạt mồ hôi bị gió cuốn đi khỏi da
  const sweatSpk = glowDots(6, .0055, '#cdeefb', .90); fxLayer(sweatSpk); scene.add(sweatSpk);
  const sweatPos = [], sweatVel = [];
  for (let i = 0; i < 6; i++) { sweatPos.push(new THREE.Vector3()); sweatVel.push(new THREE.Vector3(1, .25, 0)); }

  // ── Sửa lỗi "vỡ hình" ở nhát c27 (vòng nghiệm thu cuối, 16:31) ──
  // Người xem thấy ở góc dưới–bên phải nhát c27 một khối hình màu xanh navy đứng
  // yên: mặt phẳng sắc cạnh chồng lên, một lỗ tam giác, một sừng nhọn chạy chéo
  // ra ngoài khung, một mảnh vụn dẹp trên sàn — chiếm ~1/4 khung.
  //
  // Đó KHÔNG phải vật thể: dựng lại nhát đó với `?noshadow` (tắt đèn đổ bóng)
  // thì khối đó biến mất sạch. Nó là **bóng đổ** của khu cửa hiên đổ vào tường
  // phải của phòng kín — và bóng rơi ở một góc rất xiên, nên bản đồ bóng vỡ
  // thành mảnh vụn và gai. Đo từng vật (tắt bóng của từng đối tượng rồi so số)
  // cho ra: bóng đổ vào chỗ đó là của **khung cửa + cánh cửa** và của **đàn áo +
  // áo phơi một mặt** (hai đồ đang treo ngay trước lối cửa).
  //
  // Sửa: bốn vật đó không đổ bóng. Không mất gì đáng kể — trong những nhát khác
  // bóng của chúng rơi ngoài khung, còn góc tường đó vốn đã là chỗ tối nhất của
  // phòng. Không sửa mã dùng chung: đây là mã của riêng tập này.
  for (const o of [doorLeaf, ...doorFrame, pile.group, half.group]) {
    o.traverse(c => { c.castShadow = false; });
  }

  const S = {
    scene, sun, line, line2, shirt, pants, twl, tee, half, hemDrop, pile, basin, chair, upShirt, bag,
    thermo, hygro, fan, fanB, fanTable, shirtA, shirtB, lab, scale1, scale2, scaleShirt1, scaleShirt2, teeBack,
    wallClock, hand, mist, mistG, mistRim, mistFar, mistBal, doorLeaf, pane, spread, labSpk, vapTrailSpk, vapUpSpk, vapBal, sweat, focus, fanC, cmpBar,
    bench, cmpA, cmpB, cmpFan, jeansPatch, teePatch, hygro2, paneFog, vapApoSpk, apoPuddle, flipCornerPos,
    floorShirt, floorPos, bench2, flipShirt,
    thermo30, thermo30Top, spreadPos, upPos, hemTop,
    vapColSpk, hemBand, doorSpk, denseSpk, vapBand, windVeil, windVeil2, wetLayer,
    update(t, opt = {}) {
      // hạ sáng đèn phòng ở nhát nào cần góc xa thật tối
      const dim = opt.dim ?? 1;
      roomLights.forEach((l, i) => { l.intensity = roomBase[i] * dim; });
      lab.group.visible = opt.labVis ?? true;
      // nhãn đứng "CÓ GIÓ / KHÔNG CÓ GIÓ" trên mặt bàn: ở câu 37 máy nhìn thật
      // sát vào giọt nước, nhãn nằm ngay trước giọt nên che mất nó.
      for (const tg of lab.tags) tg.visible = opt.labTags ?? true;
      cmpBar.visible = opt.cmpBar ?? false;
      // nhiệt kế ba mươi độ chỉ hiện ở câu 44–45; nhiệt kế treo trong cảnh thì
      // ở câu 45 không cần (cận cảnh chỉ nói về thí nghiệm ba mươi độ)
      thermo30.group.visible = opt.t30 ?? false;
      thermo.group.visible = !(opt.t30only ?? false);   // câu 45 là cận cảnh riêng: không cần nhiệt kế treo
      // hai cái áo của câu 49 không ở trong khung câu 60: câu 60 nói "không chồng
      // quần áo lên nhau", mà để lại chúng thì câu 60 có hai áo chồng lên nhau
      // câu 60 nói "không chồng quần áo lên nhau": hai món phải thấy rõ là
      // TÁCH nhau. Cái áo úp (mảng ẩm) vẫn nằm ở bàn bên trái, cái áo lật cạnh ở
      // bàn bên phải; chỉ cái áo phơi rộng của câu 49 là ẩn đi (nó nằm chồng).
      const b49 = opt.bench49 ?? true;
      const noCmp = opt.noCmp ?? false;      // câu 1: cặp áo của câu 49 chưa tới giờ xuất hiện
      // câu 60 là hình kết: hai cái bàn phơi (đạo cụ của câu 49) không được đứng
      // giữa hình kết, và theo TREATMENT thì chỗ của chúng là MỘT cái áo úp còn
      // ẩm nằm trên sàn. Chúng không xuất hiện ở câu 59, nên không gãy liên tục.
      const benchOn = !(opt.noBench2 ?? false);
      spread.group.visible = benchOn && b49 && !noCmp;
      upShirt.group.visible = benchOn && !noCmp;
      bench.group.visible = benchOn && !(opt.noBench ?? false);
      bench2.group.visible = benchOn;
      flipShirt.group.visible = benchOn;
      apoPuddle.visible = true;
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
      pile.group.position.set(.45 + pdx, pdy, -.62);
      half.group.position.set(1.02 + pdx, line2.yAt(.12) + pdy, -.62);
      clip2.group.position.set(1.02 + pdx, line2.yAt(.12) + pdy, -.62);
      for (const c of line2Clips) c.g.position.set(c.x + pdx, c.y + pdy, -.62);
      bag.group.visible = opt.bag ?? true;
      // đạo cụ của câu 53 (áo ướt trong nhà): không xen vào cặp áo thí nghiệm ở câu 5–7
      backShirt.group.visible = !(opt.noBack ?? false);
      bag.swing(t, gust * g);
      pile.setSway(t, gust * g);
      // trong phòng: quạt quay, áo trước quạt bay nhẹ, áo góc xa đứng yên
      fan.spin(t); fanB.spin(t * 1.7); fanC.spin(t * 1.6);
      // hai áo nhỏ trên thanh phải TỰ ĐUNG ĐƯA: áo trước quạt đung đưa mạnh,
      // áo ở góc xa chỉ rung nhẹ — đó là cả câu 33–34, không phải máy quay.
      const fanCOn = opt.fanC ? 1 : 0;
      scaleShirt2.group.rotation.z = Math.sin(t * 1.9 + .4) * .085 * fanCOn;
      scaleShirt2.group.rotation.y = Math.sin(t * 1.1) * .16 * fanCOn;
      scaleShirt1.group.rotation.z = Math.sin(t * 1.9 + 1.2) * .018 * fanCOn;
      scaleShirt1.group.rotation.y = Math.sin(t * .8 + .5) * .04 * fanCOn;
      // dải gió trên kệ chạy từ quạt sang trái: quạt ở x = −1.10, gió sang −x
      shelfWindMat.opacity = fanCOn * (.22 + .06 * Math.sin(t * 1.6));
      shelfWind.position.x = -1.42 + Math.sin(t * .9) * .10;
      shelfWind.scale.x = 1 + .10 * Math.sin(t * 1.3);
      // gió nhẹ ngoài hiên trôi qua dây phơi
      breezeMat.opacity = opt.breeze ? (.16 + .05 * Math.sin(t * .9 + .7)) : 0;
      breeze.position.x = .10 * Math.sin(t * .55);
      breeze.scale.x = 1 + .12 * Math.sin(t * .4);
      const fanOn = opt.fan ?? 1;
      fan.setSpeed(2.2 * fanOn);
      fanB.setSpeed(2.0 * (opt.lab ? 1 : 0));      // quạt ở cuối bàn thí nghiệm
      fanC.setSpeed(1.8 * (opt.fanC ? 1 : 0));     // quạt nhỏ ở cuối kệ
      shirtA.group.rotation.z = Math.sin(t * 2.4) * .05 * fanOn;
      // lớp hơi ẩm bám sát mặt áo A: bám theo áo (vị trí + độ nghiêng) nhưng là vật riêng
      mistG.position.set(shirtA.group.position.x, shirtA.group.position.y - .18, shirtA.group.position.z + .04);
      mistG.rotation.z = shirtA.group.rotation.z;
      // lớp hơi ẩm phải THỞ: đứng yên thì đọc ra là một tấm kính dán, không phải hơi
      mistG.position.x += Math.sin(t * 1.1) * .004;
      mistG.scale.setScalar(1 + Math.sin(t * 1.7) * .012);
      shirtB.group.rotation.z = Math.sin(t * .5) * .004;
      // ── cặp áo thí nghiệm: quạt chạy, áo trước quạt đung đưa và nhạt dần ──
      const cmpOn = opt.cmp ? 1 : 0;
      // cặp áo thí nghiệm chỉ tồn tại ở câu 4–7: ở những nhát khác nó là một
      // cái quạt lạ ở góc phải, và người xem tưởng luồng gió thổi NGƯỢC vào nó
      cmpFan.group.visible = !!opt.cmp;
      cmpRail.visible = !!opt.cmp;
      cmpA.group.visible = !!opt.cmp;
      cmpB.group.visible = !!opt.cmp;
      cmpFan.spin(t * 1.9); cmpFan.setSpeed(2.0 * cmpOn);
      cmpA.group.rotation.z = Math.sin(t * 2.2) * .055 * cmpOn;
      cmpB.group.rotation.z = Math.sin(t * .5) * .004;
      // cái trước quạt nhạt dần (nhanh hơn), cái ngoài tầm gió vẫn sẫm.
      // Vết nhạt chỉ bắt đầu SAU khi câu 5 đã nói xong: ở câu 5 quạt mới
      // bắt đầu thổi, áo phải còn ướt nguyên, thì "đang nhạt màu dần" ở câu 7
      // mới có bằng chứng hình.
      const cmpFade0 = opt.cmpFade0 ?? 20.47;
      cmpA.setWet(1 - clamp((t - cmpFade0) / 6.9) * .72);
      cmpB.setWet(1);
      for (let i = 0; i < 16; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const s = ((t * .46 + sd) % 1);
        cmpPos[i].set(1.30 + s * .46, .94 + sd2 * .24 - s * .10, -2.60 + (sd - .5) * .24);
        setDot(cmpSpk, i, cmpPos[i], .6 + sd2 * .6);
      }
      cmpSpk.count = cmpOn ? 16 : 0;
      cmpSpk.instanceMatrix.needsUpdate = true;
      // hơi nước nhỏ bốc lên từ giọt sau vách (câu 37): chậm, không bị gió cuốn
      if (opt.lab) {
        for (let i = 0; i < 8; i++) {
          const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
          const u = ((t * .12 + sd) % 1);
          // hơi nước BỒNG LƯNG trên mặt giọt (không có gió thì đi đâu không
          // được): một đám thấp, rộng, đứng yên — không phải một cột cao, vì cột
          // cao đọc ngược thành "bay hơi nhiều hơn".
          dropVapPos[i].set(1.36 + (sd - .5) * .11 + Math.sin(u * 3 + i) * .010,
            .988 + u * .07, -6.10 + (sd2 - .5) * .04);
          setDot(dropVap, i, dropVapPos[i], .5 + sd2 * .5);
        }
        dropVap.count = 8;
        dropVap.instanceMatrix.needsUpdate = true;
      } else {
        dropVap.count = 0; dropVap.instanceMatrix.needsUpdate = true;
      }
      // giọt nước ở mép khăn: tụ lại ở mép vải rồi rơi, nho dần khi rơi
      const tHem = opt.hemT ?? 150;
      const grow = clamp((t - (tHem - 1.5)) / 1.5);
      const fall = clamp((t - tHem) / 1.6);
      hemDrop.group.position.set(.25, lerp(.7655, .7270, ss(fall)), .862);
      hemDrop.setSize(1 - (.45 + .55 * grow) * (1 - .5 * ss(fall)));
      // khăn ướt lúc đầu, khô dần theo thời gian
      twl.setWet(clamp(1 - (t - 143) / 20));
      // quần áo khô dần: áo trước quạt nhạt màu từ sớm (có gió), áo góc xa vẫn sẫm, áo ở hiên khô dần
      // áo A ướt: ở câu 25 (lớp hơi ẩm bám sát vải, nhanh chóng bị bão hoà) nó
      // phải còn ướt rõ — vải khô quá sớm thì câu đó không còn hình để kể
      shirtA.setWet(1 - clamp((t - 12) / 24) * .18 - clamp((t - 36) / 120) * .60);
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
      // câu 37: "không có gió thì tốc độ bay hơi rơi còn một nửa" — trong cùng
      // một khoảng thời gian, giọt có gió mất nước GẤP ĐÔI giọt không có gió.
      // Vòng nét đứt in sẵn trên kính là mốc tham chiếu: tới cuối câu, giọt
      // có gió còn ĐÚNG MỘT NỬA vòng (đường kính bằng một nửa vòng), còn giọt
      // sau vách chỉ mất một phần tư — nên nó mất nước chậm hơn một nửa.
      const sA = 1 - .25 * el, sB = 1 - .50 * el;
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
        fanCPos[i].set(-1.12 - s * .68, .98 + s * .36 + sd2 * .10, -5.55 + (sd - .5) * .12);
        setDot(fanCSpk, i, fanCPos[i], .6 + sd2 * .6);
      }
      fanCSpk.count = opt.fanC ? 12 : 0;
      fanCSpk.instanceMatrix.needsUpdate = true;
      // hạt hơi nước lơ lửng quanh áo ướt ngoài hiên
      for (let i = 0; i < 16; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        // câu 47 nằm trong phòng: hạt lơ lửng quanh áo ướt ở góc phòng
        const vbX = opt.vapFar ? 2.30 : -1.25, vbY = opt.vapFar ? 1.14 : .70, vbZ = opt.vapFar ? -5.05 : .80;
        vapBalPos[i].set(vbX + (sd - .5) * (opt.vapFar ? .50 : .56) + Math.sin(t * .7 + i) * .03, vbY + sd * (opt.vapFar ? .48 : .62) + Math.sin(t * .5 + i * 2) * .03, vbZ + (sd2 - .5) * (opt.vapFar ? .30 : .34));
        setDot(vapBal, i, vapBalPos[i], .7 + sd2 * .6);
      }
      vapBal.count = opt.vapBal ? 16 : 0;
      vapBal.instanceMatrix.needsUpdate = true;
      // hơi nước bị kẹt dưới cái áo úp: bốc lên chậm, quanh một chỗ hẹp
      for (let i = 0; i < 14; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const s = ((t * .10 + sd) % 1);
        vapApoPos[i].set(-.62 + (sd - .5) * .30, .44 + s * .30 + sd2 * .04, 1.22 + (sd2 - .5) * .22);
        setDot(vapApoSpk, i, vapApoPos[i], .55 + sd2 * .5);
      }
      vapApoSpk.count = opt.vapApo ? 14 : 0;
      vapApoSpk.instanceMatrix.needsUpdate = true;
      // cột hơi nước bốc lên qua khoảng không phía trên mép áo A
      for (let i = 0; i < 18; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const s = ((t * .30 + sd) % 1);
        vapColPos[i].set(.43 + Math.sin(i * 2.1 + t * .6) * .045, 1.44 + s * .40, -3.24 + Math.cos(i * 1.3) * .035);
        setDot(vapColSpk, i, vapColPos[i], .55 + sd2 * .7);
      }
      vapColSpk.count = opt.vapCol ? 18 : 0;
      vapColSpk.instanceMatrix.needsUpdate = true;
      // dải ẩm bão hoà ở mép áo: dày dần, và ngay phía trên là vùng khô
      hemBand.material.opacity = opt.hemBand ? .96 : 0;
      // vùng bão hoà PHẢI thở: dải phồng nhẹ theo thời gian
      const hemPulse = opt.hemPulse ? (1 + Math.sin(t * .9) * .045) : 1;
      hemBand.scale.set(1, .55 + (opt.hemK ?? 0) * hemPulse * .95, 1);
      hemBand.position.y = .70 + .23 * hemBand.scale.y;   // mép dưới của dải bám vào mép vải
      // câu 27: lớp ẩm trượt về phía quạt và mất dần trong chính câu
      const wl = opt.wetLayer ?? 0;
      wetLayer.visible = wl > 0;
      wetLayer.material.opacity = wl * .40;
      wetLayer.position.x = .42 - (1 - wl) * .58;
      // gió thổi qua lối mở ra hiên: câu 58–59
      for (let i = 0; i < 14; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const s = ((t * .40 + sd) % 1);
        doorPos[i].set(.55 + sd2 * .70, 1.02 + sd * .50, -1.00 + s * 1.50);
        setDot(doorSpk, i, doorPos[i], .5 + sd2 * .7);
      }
      doorSpk.count = opt.doorWind ? 14 : 0;
      doorSpk.instanceMatrix.needsUpdate = true;
      // hơi nước bốc lên TỪ TẤM VẢI THỬ (câu 45): mỏng và nhanh — lan ra
      for (let i = 0; i < 14; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const s = ((t * .34 + sd) % 1);
        densePos[i].set(-1.98 + (sd - .5) * (.18 + s * .30), 1.64 + s * .34, -.90 + (sd2 - .5) * .12);
        setDot(denseSpk, i, densePos[i], .45 + sd2 * .5);
      }
      denseSpk.count = opt.dense ? 14 : 0;
      denseSpk.instanceMatrix.needsUpdate = true;
      // hơi nước BAY CHẬM (câu 46): đặc, bò lên chậm — "chậm hơn khoảng năm lần"
      for (let i = 0; i < 10; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const s = ((t * .07 + sd) % 1);
        slowPos[i].set(-1.98 + (sd - .5) * .26, 1.80 + s * .20, -.90 + (sd2 - .5) * .12);
        setDot(slowSpk, i, slowPos[i], .8 + sd2 * .5);
      }
      slowSpk.count = opt.vapSlow ? 10 : 0;
      slowSpk.instanceMatrix.needsUpdate = true;
      // hơi nước ngưng trên kính cửa sổ: chỉ hiện ở câu "không khí không đi đâu cả"
      paneFog.material.opacity = opt.paneFog ? .85 : 0;
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
        sweatPos[i].set(-1.00 + s * .85 * fly, 1.11 + sd2 * .28 * fly + s * .12 * fly, -3.30 + (sd - .5) * .22);
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
        const x = (opt.windX0 ?? -1.40) + s * (opt.windX1 ?? 2.10);   // luồng gió dừng ngay mép áo A (x = 0.70)
        // luồng gió phải ĐI QUA tầm bàn tay (y ≈ 1.02) chứ không bay trên đầu:
        // dải thấp, hẹp, sát mặt áo A và sát mu bàn tay.
        const y = (opt.windY ?? .96) + s * (opt.windY1 ?? .22) + sd2 * .12;
        // vệt gió bay QUÁ tấm áo (z ≈ −3.30), ở phía TRƯỚC nó: đây là không khí,
        // không phải nước phun lên vải.
        const z = (opt.windZ ?? -3.02) + ((i * .71) % 1 - .5) * .30;
        windPos[i].set(x, y, z);
        windVel[i].set(.6 + .5 * fanOn, 0, 0);
        setStreak(windSpk, i, windPos[i], windVel[i], (.07 + sd2 * .045) * (opt.windScale ?? 1), .0035);
      }
      windSpk.count = (opt.fan || opt.streak) ? 22 : 0;      // câu 59 không có quạt, nhưng vẫn phải có vệt gió
      windSpk.instanceMatrix.needsUpdate = true;
      // nhiệt rời khỏi vải; không khí quay lại bám áo
      heatFlow.update(t, opt.heat ? 1 : 0);
      backFlow.update(t, opt.backAir ? 1 : 0);
      // dải hơi nước: bay lên, mờ dần khi gió tới
      vapBandMat.opacity = opt.vapBand ? .72 : 0;
      vapBand.position.y = 1.66 + Math.sin(t * .9) * .010;
      vapBand.scale.x = .94 + Math.sin(t * 1.4) * .07;
      // dải gió: dải kéo từ quạt sang áo, và mảnh bị quét xa hơn
      veilMat.opacity = opt.windVeil ? .26 : 0;
      windVeil.position.x = -.35 + Math.sin(t * .8) * .04;
      veilMat2.opacity = opt.windVeil2 ? .26 : 0;
      windVeil2.position.x = 1.05 + Math.sin(t * .8 + 1) * .05;
      // đồng hồ: quay chậm
      wallClock.tick(t, 6, 40);
      // nhiệt kế và ẩm kế: cột thuỷ ngân và kim PHẢI CHẠY. Một đồng hồ đứng
      // yên trong một khung hình đọc ra là một hình vẽ, không phải một vật
      // đang chạy — nên cột dâng lên, kim quay tới vạch.
      const ramp = (a, b, t0, t1) => a + (b - a) * clamp((t - t0) / Math.max(.001, t1 - t0));
      // đường chạy của kim: một danh sách mốc [thời điểm, giá trị], nội suy mềm.
      // Dùng để kim ĐỔI HƯỚNG trong phim (lên rồi lùi), không chỉ chạy một chiều.
      const track = (tr) => {
        if (!tr || !tr.length) return undefined;
        if (t <= tr[0][0]) return tr[0][1];
        for (let i = 1; i < tr.length; i++) {
          const [t1, v1] = tr[i], [t0, v0] = tr[i - 1];
          if (t < t1) return v0 + (v1 - v0) * clamp((t - t0) / Math.max(.001, t1 - t0));
        }
        return tr[tr.length - 1][1];
      };
      const tv = track(opt.tempTrack) !== undefined
        ? track(opt.tempTrack)
        : opt.tempFrom !== undefined
          ? ramp(opt.tempFrom, opt.temp, opt.tempT0 ?? 0, opt.tempT1 ?? 1e9)
          : (opt.temp ?? .5);
      thermo.setTemp(tv);
      thermo.setGhost(opt.ghostTemp);
      const rv = track(opt.rhTrack) !== undefined
        ? track(opt.rhTrack)
        : opt.rhFrom !== undefined
          ? ramp(opt.rhFrom, opt.rh, opt.rhT0 ?? 0, opt.rhT1 ?? 1e9)
          : (opt.rh ?? .5);
      hygro.setRH(rv);
      // ẩm kế thứ hai đứng yên ở nửa: đó là mốc đối chiếu cho câu 46.
      // Nó chỉ hiện ở câu 46 — ở các câu khác nó chỉ là một chiếc đồng hồ
      // trùng lặp không nhãn, và làm rối mặt tường đo.
      hygro2.setRH(.5);
      hygro2.group.visible = opt.hygro2 ?? false;
      // kim cân: lúc mới đặt áo lên cân, kim còn đang dừng; rồi nó chạm vạch
      const s0 = opt.scaleT0 ?? 0, s1 = opt.scaleT1 ?? 1e9;
      scale1.setReading(ramp(opt.scale1From ?? .72, .72, s0, s1));
      scale2.setReading(ramp(opt.scale2From ?? .22, .22, s0, s1));
      // kim cân rung nhẹ: đồ đo phải sống chứ không phải một hình chụp
      scale1.needle.rotation.z += Math.sin(t * 2.3) * .012;
      scale2.needle.rotation.z += Math.sin(t * 2.9 + 1) * .012;
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
  // một lớp vải đan mờ ở phía sau: nền phải đọc ra là "trong ruột vải",
  // không phải một mảng xanh trơn trống trơn
  const backWeaveTex = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#1b1830'; c.fillRect(0, 0, w, h);
    // các mảng mờ như vải đan đang ngoài tiêu điểm: chỉ gợi bề mặt, không
    // thành hoạ tiết sọc (sọc đều đọc như giấy bọc tường)
    for (let i = 0; i < 46; i++) {
      const x = (i * 71) % w, y = (i * 137) % h, r = 26 + (i * 13) % 40;
      const g = c.createRadialGradient(x, y, 2, x, y, r);
      g.addColorStop(0, i % 3 ? 'rgba(96,88,132,.30)' : 'rgba(58,54,86,.34)');
      g.addColorStop(1, 'rgba(27,24,48,0)');
      c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
    }
    // vài sợi chỉ thẳng qua, mờ
    c.strokeStyle = 'rgba(120,110,155,.16)'; c.lineWidth = 6;
    for (let i = -h; i < w + h; i += 34) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + h, h); c.stroke(); }
  });
  const backWeave = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.1), new THREE.MeshBasicMaterial({ map: backWeaveTex, transparent: true, opacity: .92, depthWrite: false }));
  backWeave.position.set(0, .05, -.32); scene.add(backWeave);
  const fibres = P.wovenFibres(); scene.add(fibres.group);
  // tấm vải đan thật: lưới sợi dọc–ngang luồn qua nhau, đặt lệch sang phải–sau
  // để c10 (cận cảnh rộng) có một vật riêng khác với c11 (cận cảnh khe sợi)
  //
  // Sợi THƯA (18 sợi mỗi chiều, không phải 44): với 44 sợi, mỗi sợi chỉ còn
  // vài chấm ảnh và lớp viền mực vẽ trên mỗi sợi dính lại thành một mớ nét
  // — tấm vải đọc ra như một bìa có vân in, không thấy sợi đan qua nhau
  // (nhận xét nghiệm thu vòng 1, 0:32–0:37). Với 18 sợi, người xem thấy rõ
  // sợi nào nằm trên sợi nào ở từng điểm giao.
  const cloth = P.wovenCloth({ n: 18, size: .34 });
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
      // giọt nước trên sợi: NẶNG DẦN rồi RƠI, rồi một giọt mới hình thành —
      // một quả cầu tròn đứng yên là hình vẽ, không phải nước.
      const ph = (t % 4.2) / 4.2;
      const fall = ph > .78 ? (ph - .78) / .22 : 0;
      drop.setSize(ph < .78 ? .30 + .70 * (ph / .78) : 1 - .9 * fall);
      drop.group.position.y = .105 - fall * .030;
      // màng nước trong khe giữa hai sợi: mặt nước phải nhấp nhô, không phải một
      // dải kính phẳng
      fibres.filmG.position.y = Math.sin(t * 1.6) * .0018;
      fibres.filmG.scale.y = 1 + Math.sin(t * 2.1) * .05;
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
    gr.addColorStop(0, '#8496bd');
    gr.addColorStop(.40, '#5d6c96');
    gr.addColorStop(1, '#2c3554');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
  });
  scene.fog = new THREE.Fog('#3c4b70', 1.1, 2.9);
  const key = keyLight(scene, { from: new THREE.Vector3(-1.6, 1.3, 2.0), to: new THREE.Vector3(0, 0, 0), color: '#ffd6a4', intensity: 2.4, size: 1.2 });
  ambience(scene, { hemi: '#7f9ade', ground: '#141a2e', rim: '#6f4fd8' });
  const surf = P.waterSurface({ w: 1.5, d: .9 }); scene.add(surf.group);
  // bờ chật phía sau: gỗ tối, không phải một thanh nâu sáng.
  // Mặt trên của thanh bờ chỉ nhô cao hơn mặt nước một chút, nên ở nhát thấp
  // nó là một dải tối mảnh ở đường chân trời — không thành một dải nâu cắt ngang bầu trời.
  const bank = mesh(rbox(3.2, .14, .5, .02), toon('#2e241d'), [.20, -.062, -.66]); scene.add(bank);
  // hơi lạnh bốc lên từ phần nước còn lại: mã hình cho chữ "phần nước còn lại
  // thì mát đi" — không có hơi lạnh và đổi màu, câu đó không có hình.
  const coldTex = canvasTex(256, 256, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    const g0 = c.createRadialGradient(w / 2, h / 2, w * .08, w / 2, h / 2, w * .48);
    g0.addColorStop(0, 'rgba(226,244,255,.80)');
    g0.addColorStop(.55, 'rgba(190,228,252,.42)');
    g0.addColorStop(1, 'rgba(190,228,252,0)');
    c.fillStyle = g0; c.fillRect(0, 0, w, h);
  });
  // quầng sáng và vệt hơi nước theo phân tử đang bay lên (câu 17): "mang theo
  // năng lượng của nó" phải có hình, không chỉ một chấm nhỏ trên nền trời.
  // quầng sáng quanh phân tử bay lên: nhỏ, để thành một halo quanh hạt chứ
  // không thành một đĩa tròn to đè lên cả bầu trời
  // hào quang: một đĩa dẹt có nét sáng loe dần (không phải hình cầu đặc —
  // hình cầu đặc additive ra một đĩa tròn cứng, trông như mảnh giấy dán)
  const escGlow = new THREE.Mesh(new THREE.PlaneGeometry(.075, .075), new THREE.MeshBasicMaterial({
    map: TEX.radial(), color: new THREE.Color('#ffcf96'), transparent: true, opacity: .62,
    depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  }));
  escGlow.renderOrder = 5; fxLayer(escGlow); scene.add(escGlow);
  const escTrail = glowDots(20, .0034, '#cfeeff', .55); fxLayer(escTrail); scene.add(escTrail);
  const escTrailPos = [];
  for (let i = 0; i < 18; i++) escTrailPos.push(new THREE.Vector3());
  const coldMat = new THREE.MeshBasicMaterial({ map: coldTex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const coldMist = new THREE.Mesh(new THREE.PlaneGeometry(.24, .15), coldMat);
  coldMist.position.set(-1.02, .072, .02); coldMist.renderOrder = 5;
  fxLayer(coldMist); scene.add(coldMist);
  return {
    scene, key, surf,
    update(t, opt = {}) {
      surf.update(t);
      // phần nước còn lại mát đi: mặt nước chuyển sang xanh sâu và tối lại
      const cool = opt.coolK ?? 0;
      // nước mát đi: vẫn là MÀU NƯỚC, chỉ lạnh hơn — không được tối đến mức khung thành một mảng đen
      surf.water.material.color.set(cool > .01 ? '#a8cdf0' : '#bff2ff');
      surf.water.material.opacity = cool > .01 ? .86 : .85;
      key.intensity = cool > .01 ? 2.9 : 2.4;
      // ô xi của các phân tử ở mép nước chuyển từ đỏ ấm sang xanh lạnh
      surf.setCool(cool * .9);
      // hơi lạnh bốc lên, mờ dần khi nước đã mát hẳn
      coldMat.opacity = cool * .22;
      coldMist.position.y = .085 + Math.sin(t * 1.2) * .006;
      coldMist.scale.setScalar(1 + Math.sin(t * .9) * .05);
      // quầng sáng + vệt hơi nước bám theo phân tử đang bay lên
      const e0 = surf.esc[0];
      const eon = e0.m.visible;
      const ep = e0.m.position;
      escGlow.visible = eon;
      escGlow.position.set(ep.x, ep.y + .008, ep.z + .008);
      escGlow.scale.setScalar(1 + Math.sin(t * 3.1) * .10);
      for (let i = 0; i < 12; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const s = ((t * .30 + sd) % 1);
        escTrailPos[i].set(ep.x - .012 * (1 - s) + Math.sin(i * 2.3) * .007, ep.y - .080 * (1 - s) + .010, ep.z + Math.cos(i * 1.9) * .007);
        setDot(escTrail, i, escTrailPos[i], .45 + sd2 * .5);
      }
      escTrail.count = eon ? 18 : 0;
      escTrail.instanceMatrix.needsUpdate = true;
    },
  };
}
