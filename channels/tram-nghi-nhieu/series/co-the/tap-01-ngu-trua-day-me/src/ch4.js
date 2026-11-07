// Chapter 4 — Hai cái đồng hồ bên trong não: một cái đo một vòng giấc ngủ (chín mươi phút), một cái đo cả ngày
// (đồng hồ sinh học), rồi quay lại bàn làm việc buổi chiều để thấy hai nguyên nhân cộng lại.
// Nơi chốn: một mẩu não trên một chiếc bàn tối, hai cái đồng hồ lơ lửng trước nó; vài câu cắt sang bàn làm việc
// buổi chiều / tối / sáng hôm sau. Hai nơi chốn cùng nằm trong một cảnh, mỗi nơi một vùng sáng riêng.
import * as THREE from 'three';
import { PAL, toon, glowMat, canvasTex, rbox, mesh, fxLayer, clamp, lerp, seg, ss, eo, eio, back, mulberry, keys, TEX } from '../../../../rig/kit.js';
import { flow } from '../../../../rig/fx.js';
import { keyLight, pool } from '../../../../rig/lights.js';
import { brainChunk, brainSkinTex, brainCutTex, neuron, molecules } from '../../../../rig/brain.js';
import { bodyClock, clockRing, phone } from './props.js';
import { napDesk } from './set_desk.js';
import { makeShots } from './shots.js';

export function build(scene, V) {
  const T = id => (V.L[id] ? V.L[id].t0 : 0);
  const W = (id, w) => V.w(id, w);
  const BX = -9.6;                                  // bản não nằm cách xa bàn làm việc, trong cùng một cảnh
  const L = (x, y, z) => new THREE.Vector3(BX + x, y, z);
  const TAU = Math.PI * 2;
  const hash2 = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  // ────────────────────────────────────────────────────────────────────────
  // 1. Bàn làm việc buổi chiều: cái gối áo gấp, đồng hồ treo, ly nước, bàn tay
  // ────────────────────────────────────────────────────────────────────────
  const D = napDesk(scene, { time: 'day', hour: 13, minute: 30 });
  const S = D.S;
  const F = S.focus;

  const ph = phone({});
  ph.position.set(F.x + .19, .006, F.z + .31);
  ph.rotation.y = -.3;
  ph.setTime(13, 30);
  scene.add(ph);

  // ────────────────────────────────────────────────────────────────────────
  // 2. Trong não: bàn tối, mẩu não, hai cái đồng hồ
  // ────────────────────────────────────────────────────────────────────────
  const brainKey = keyLight(scene, { from: L(-1.9, 2.9, 2.1), to: L(0, 0, 0), color: '#ffd9b0', intensity: 1.9, size: 2.9, far: 16 });
  const brainPool = pool(scene, { from: L(.1, 2.3, 1.6), to: L(-.2, -.2, -.5), intensity: 1.7, angle: .55 });

  // bàn của não: một mặt bàn tối có vân, không phải một khối trơn
  const tableTex = canvasTex(512, 512, (g, w, h) => {
    const r = mulberry(17);
    g.fillStyle = '#1c2340'; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 900; k++) {
      g.fillStyle = `rgba(${40 + r() * 40},${50 + r() * 40},${90 + r() * 50},${.05 + r() * .12})`;
      g.beginPath(); g.ellipse(r() * w, r() * h, 20 + r() * 70, 12 + r() * 40, r() * 3, 0, 7); g.fill();
    }
    for (let k = 0; k < 6000; k++) { g.fillStyle = `rgba(8,10,26,${.06 + r() * .18})`; g.fillRect(r() * w, r() * h, 2, 2); }
  });
  scene.add(mesh(rbox(5.8, .18, 5.0, .04), toon('#ffffff', { map: tableTex }), [BX, -.62, .1]));

  // vách xa: một bức tường mô não tối, làm nền cho cả cảnh
  const wallTex = canvasTex(512, 512, (g, w, h) => {
    const r = mulberry(29);
    g.fillStyle = '#241a3c'; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 700; k++) {
      g.fillStyle = `rgba(${60 + r() * 40},${44 + r() * 30},${80 + r() * 50},${.05 + r() * .12})`;
      g.beginPath(); g.ellipse(r() * w, r() * h, 24 + r() * 80, 16 + r() * 50, r() * 3, 0, 7); g.fill();
    }
    for (let k = 0; k < 5000; k++) { g.fillStyle = `rgba(12,8,26,${.05 + r() * .12})`; g.fillRect(r() * w, r() * h, 2, 2); }
  });
  scene.add(mesh(rbox(13, 7, .3, .1), toon('#ffffff', { map: wallTex }), [BX, .8, -5.4]));

  // mẩu não: khối mô có nếp, nằm ở lớp hậu cảnh
  const tissueMat = toon('#413563', { map: brainSkinTex(3) });
  const mass = brainChunk({ w: 3.9, d: 1.4, h: .8, seed: 3, cut: false, folds: 6, amp: .07 });
  mass.position.set(BX - .15, .238, -2.1);
  mass.traverse(o => { if (o.material && o.material.color) o.material.color.set('#413563'); });
  scene.add(mass);
  // đắp kín khoảng hở giữa thân mô và mặt gấp, để khối mô là một khối liền
  scene.add(mesh(rbox(3.84, .5, 1.34, .05), tissueMat, [BX - .15, .49, -2.1]));
  // mặt cắt của khối mô lớn, quay về phía máy
  scene.add(mesh(new THREE.PlaneGeometry(3.88, .77), toon('#4a3b6e', { map: brainCutTex(7) }), [BX - .15, -.136, -1.395], { cast: false }));

  // mảnh cắt của não: nơi vùng sâu chìm xuống và vùng tỉnh nổi lên
  const slab = brainChunk({ w: 1.7, d: .7, h: .8, seed: 7, cut: true, folds: 4, amp: .04 });
  slab.position.set(BX - .45, .238, -1.0);
  slab.traverse(o => { if (o.material && o.material.color) o.material.color.set('#4e4078'); });
  scene.add(slab);
  scene.add(mesh(rbox(1.64, .5, .64, .04), toon('#4e4078', { map: brainSkinTex(7) }), [BX - .45, .49, -1.0]));
  const CUTZ = -1.0 + .35;                         // mặt cắt của mô

  // vùng não chìm xuống giấc ngủ sâu (tối) và vùng não nổi lên (sáng, đốm nhấp nháy nhanh)
  const softTex = TEX.radial();
  const deepMat = new THREE.MeshBasicMaterial({ map: softTex, color: '#120d2e', transparent: true, opacity: .92, depthWrite: false });
  const deepZone = mesh(new THREE.PlaneGeometry(.72, .56), deepMat, [BX + .06, -.14, CUTZ + .012], { cast: false });
  scene.add(deepZone);
  const awakeMat = new THREE.MeshBasicMaterial({ map: softTex, color: '#cbb0ff', transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending });
  const awakeZone = mesh(new THREE.PlaneGeometry(.56, .46), awakeMat, [BX - .84, -.12, CUTZ + .014], { cast: false });
  scene.add(awakeZone);

  // vài nếp não ở mép trước của khối mô, cho cái dáng nó không thành một viên gạch
  const ridgeMat = toon('#413563');
  for (let i = 0; i < 7; i++) {
    const c = mesh(new THREE.CapsuleGeometry(.17, .46, 4, 12), ridgeMat, [BX - 1.6 + i * .52, .5 + (i % 2) * .05, -1.4], { rot: [0, 0, Math.PI / 2] });
    c.rotation.x = .08 * Math.sin(i * 1.7);
  }
  // một mẩu mô ở tiền cảnh, cắt mép khung
  const fg = brainChunk({ w: 1.5, d: .9, h: .55, seed: 11, cut: false, folds: 3, amp: .05 });
  fg.position.set(BX - 2.25, -.53 + .528, 1.95);
  fg.traverse(o => { if (o.material && o.material.color) o.material.color.set('#3b3059'); });
  scene.add(fg);
  fg.add(mesh(rbox(1.46, .2, .86, .05), toon('#3b3059', { map: brainSkinTex(11) }), [0, .1, 0]));
  const sparksM = molecules({ n: 40, color: '#e6d4ff', size: .012, k: 2.4, seed: 4 });
  scene.add(sparksM.mesh);

  // khe sáng lọt vào mô não (lúc mí mắt đã mở mà vùng sâu vẫn tối)
  const slitMat = glowMat('#bfe6ff', 1.4, { transparent: true, opacity: 0 });
  const slit = mesh(new THREE.PlaneGeometry(.07, .9), slitMat, [BX - 1.42, -.18, CUTZ + .05], { rot: [0, .45, .1], cast: false });
  fxLayer(slit);
  scene.add(slit);

  // ── cái đồng hồ thứ nhất: mặt đồng hồ tròn, kim chậm màu xanh ──────────
  // bốn cung trên mặt đồng hồ: cung tối là giấc ngủ sâu, cung sáng là giấc ngủ nông
  function makeDial({ scale = 1.5, pos = [0, 0, 0], rot = [0, 0, 0] } = {}) {
    const g = new THREE.Group();
    const ck = bodyClock({ r: .3 });
    ck.userData.tag = 'clock';
    ck.hands.hh.visible = false;                   // cái đồng hồ này không đo giờ
    ck.hands.mh.visible = false;
    ck.slow.scale.setScalar(1.45);
    g.add(ck);
    // mặt giấy của đồng hồ: có vân, không phải một đĩa trơn
    const faceTex = canvasTex(256, 256, (gg, w, h) => {
      const r = mulberry(31);
      gg.fillStyle = '#f7ecd6'; gg.fillRect(0, 0, w, h);
      for (let k = 0; k < 5000; k++) { gg.fillStyle = `rgba(140,120,90,${r() * .08})`; gg.fillRect(r() * w, r() * h, 2, 2); }
      for (let k = 0; k < 40; k++) { gg.strokeStyle = `rgba(160,140,100,${.04 + r() * .07})`; gg.lineWidth = 1 + r() * 2; gg.beginPath(); gg.arc(r() * w, r() * h, 10 + r() * 60, 0, 7); gg.stroke(); }
    });
    g.add(mesh(new THREE.CircleGeometry(.214, 44), toon('#ffffff', { map: faceTex }), [0, 0, .047], { cast: false }));
    // vạch đánh dấu một phần ba vòng: ba mươi phút chỉ là một phần ba của một vòng ngủ
    const third = mesh(rbox(.014, .085, .012, .003), toon(PAL.mustard), [.147, -.085, .05], { rot: [0, 0, -2.094] });
    g.add(third);
    const arcs = [];
    for (let i = 0; i < 4; i++) {
      const deep = i % 2 === 1;                    // cung tối: giấc ngủ sâu; cung sáng: giấc ngủ nông
      const mat = toon(deep ? '#4c3d88' : '#cbb9e8');
      const a0 = i * Math.PI / 2, a1 = (i + 1) * Math.PI / 2;
      const m = mesh(new THREE.TorusGeometry(.193, .015, 6, 22, a1 - a0), mat, [0, 0, .052]);
      m.rotation.z = Math.PI / 2 - a1;             // cung bắt đầu ở góc giờ, quay theo chiều kim
      g.add(m);
      arcs.push({ m, mat, a0, a1, deep });
    }
    g.position.set(pos[0], pos[1], pos[2]);
    g.rotation.set(rot[0], rot[1], rot[2]);
    g.scale.setScalar(scale);
    g.ck = ck; g.arcs = arcs;
    // frac 0..1: 0 là kim ở vạch 12 giờ, 0.25 là 3 giờ (ngang phải), 0.75 là 9 giờ (ngang trái)
    g.setFrac = f => {
      ck.setSlow(f);
      const a = ((f % 1) + 1) % 1 * TAU;           // góc của kim so với vạch 12 giờ
      for (const arc of arcs) {
        const on = a >= arc.a0 && a < arc.a1;
        arc.mat.color.set(on ? (arc.deep ? '#a78cf0' : '#8fd7e8') : (arc.deep ? '#4c3d88' : '#cbb9e8'));
        arc.mat.emissive.set(on ? (arc.deep ? '#4b2f9a' : '#2a6f88') : '#000000');
      }
    };
    g.setFrac(0);
    return g;
  }

  const dialHome = [-1.5, .35, .3];
  const dialA = makeDial({ scale: 1.5, pos: [BX + dialHome[0], dialHome[1], dialHome[2]], rot: [-.08, .16, 0] });
  scene.add(dialA);
  const dialB = makeDial({ scale: 1.5, pos: [BX + dialHome[0] + .08, dialHome[1] + .03, dialHome[2] - .45], rot: [-.08, .16, 0] });
  scene.add(dialB);
  const dialC = makeDial({ scale: 1.5, pos: [BX + dialHome[0] - .1, dialHome[1] - .04, dialHome[2] - .9], rot: [-.08, .16, 0] });
  scene.add(dialC);
  const dialD = makeDial({ scale: 1.05, pos: [-.16, .28, .07], rot: [-.22, .2, 0] });  // cái đồng hồ trên bàn
  scene.add(dialD);

  // khe trời tối ngay trên mặt đồng hồ: ở đây không có mặt trời, cũng không có đồng hồ treo
  const roof = new THREE.Group();
  roof.position.set(BX - 1.5, .98, .3);
  scene.add(roof);
  const roofMat = toon('#1a1338');
  roof.add(mesh(rbox(.42, .3, .06, .02), roofMat, [-.28, 0, 0]));
  roof.add(mesh(rbox(.42, .3, .06, .02), roofMat, [.28, 0, 0]));
  const roofGlow = mesh(new THREE.PlaneGeometry(.07, .34), glowMat('#bfe6ff', 1.1, { transparent: true, opacity: .8 }), [0, 0, .035], { cast: false });
  fxLayer(roofGlow);
  roof.add(roofGlow);

  // ── cái đồng hồ thứ hai: một vòng đồng quanh một cụm tế bào ────────────
  const RINGP = [1.0, .12, .3];
  const RR = .45;                                  // bán kính vòng đồng
  const ring = clockRing({ R: RR, marks: 24, hours: 24, seed: 5 });
  ring.position.set(BX + RINGP[0], RINGP[1], RINGP[2]);
  ring.rotation.y = .14;                           // vòng đứng thẳng, hơi nghiêng cho có chiều sâu
  scene.add(ring);

  // cụm tế bào thần kinh ở giữa vòng
  const cells = new THREE.Group();
  cells.position.set(BX + RINGP[0], RINGP[1] - .17, RINGP[2] - .17);
  scene.add(cells);
  [[-.16, .03], [.12, .12], [.03, -.17]].forEach((p, i) => {
    const n = neuron({ size: .42, seed: 5 + i * 3, dendrites: 4 });
    n.position.set(p[0], 0, p[1]);
    n.rotation.y = i * 2.1;
    cells.add(n);
  });

  // vạch nhỏ trên vành vòng: những núm nhô ra cho dễ đọc
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * TAU;
    const big = i % 6 === 0;
    ring.add(mesh(rbox(.016, big ? .1 : .06, .014, .003), toon('#e0b45a'), [Math.cos(a) * RR, Math.sin(a) * RR, 0], { rot: [0, 0, a + Math.PI / 2] }));
  }

  // dải buổi chiều trên vòng: một đoạn đồng sáng lên khi kim chỉ tới
  const aftMat = toon('#7a5a2a', { emissive: '#f7bd27', emissiveIntensity: 0 });
  const aftArc = mesh(new THREE.TorusGeometry(RR, .042, 10, 26, Math.PI / 2), aftMat, [0, 0, 0], { rot: [0, 0, Math.PI] });
  ring.add(aftArc);

  // thang đo bậc cạnh vòng: mức buồn ngủ trong ngày
  const ladder = new THREE.Group();
  ladder.position.set(BX + RINGP[0] + .62, RINGP[1] - .42, RINGP[2] - .05);
  scene.add(ladder);
  const stepMats = [];
  for (let i = 0; i < 6; i++) {
    const m = toon('#6b5a9a');
    ladder.add(mesh(rbox(.22, .03, .09, .01), m, [0, .04 + i * .085, 0]));
    stepMats.push(m);
  }
  ladder.add(mesh(rbox(.035, .6, .035, .01), toon('#4a3d70'), [-.13, .26, 0]));
  const beadMat = glowMat('#f7bd27', 1.8);
  const bead = mesh(new THREE.SphereGeometry(.03, 14, 10), beadMat, [0, .5, .015], { cast: false });
  fxLayer(bead);
  ladder.add(bead);

  // người tí hon nằm trên các vạch buổi chiều
  const sleepers = new THREE.Group();
  ring.add(sleepers);
  const sleeperMats = [];
  for (let i = 0; i < 5; i++) {
    const a = (12.6 + i * .95) * Math.PI / 12;     // các vạch quanh chiều chiều
    const g2 = new THREE.Group();
    g2.position.set(Math.cos(a) * RR, Math.sin(a) * RR, .05);
    g2.rotation.z = a + Math.PI / 2;
    const mat = toon('#e8dcc4');
    const skin = toon('#e8b6a0');
    g2.add(mesh(new THREE.CapsuleGeometry(.013, .042, 4, 10), mat, [-.008, 0, 0], { rot: [0, 0, Math.PI / 2] }));
    g2.add(mesh(new THREE.SphereGeometry(.014, 12, 9), skin, [.032, .004, 0]));
    g2.add(mesh(new THREE.CapsuleGeometry(.006, .03, 4, 8), skin, [-.008, .012, 0], { rot: [0, 0, Math.PI / 2] }));
    sleeperMats.push(mat);
    sleepers.add(g2);
  }

  // ── tờ giấy kẻ ô trên một chiếc bàn nhỏ trong não, và cây bút vẽ đường cong ──
  const paperTex = canvasTex(512, 384, (g, w, h) => {
    const r = mulberry(23);
    g.fillStyle = '#f2ecdc'; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 6000; k++) { g.fillStyle = `rgba(120,110,90,${r() * .07})`; g.fillRect(r() * w, r() * h, 2, 2); }
    g.strokeStyle = 'rgba(110,140,180,.3)'; g.lineWidth = 1;
    for (let x = 0; x <= w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y <= h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = 'rgba(80,110,160,.45)'; g.lineWidth = 1.8;
    for (let x = 0; x <= w; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y <= h; y += 128) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  });
  const board = new THREE.Group();
  board.position.set(BX + .15, -.53, 1.35);
  board.rotation.x = -1.12;
  scene.add(board);
  board.add(mesh(rbox(1.1, .7, .035, .012), toon('#6b3d22'), [0, .35, -.02]));
  const paperMat = toon('#cfc4ab', { map: paperTex });
  const paperGeo = new THREE.PlaneGeometry(.98, .6, 20, 12);
  const paper = mesh(paperGeo, paperMat, [0, .35, .01], { cast: false });
  board.add(paper);
  const paperBase = new Float32Array(paperGeo.attributes.position.array);

  // đường cong của một ngày: đi xuống rồi đi lên
  const dayPts = [[-.42, .13], [-.26, .05], [-.1, -.04], [.05, -.11], [.16, -.13], [.28, -.08], [.41, .03]]
    .map(([x, y]) => new THREE.Vector3(x, y + .35, .026));
  const dayCurve = new THREE.CatmullRomCurve3(dayPts);
  const dayGeo = new THREE.TubeGeometry(dayCurve, 64, .009, 6, false);
  board.add(mesh(dayGeo, toon('#c0392b')));
  dayGeo.setDrawRange(0, 0);
  // đoạn buổi chiều được tô đậm
  const aftTubeGeo = new THREE.TubeGeometry(dayCurve, 20, .012, 6, false);
  const aftTube = mesh(aftTubeGeo, toon('#8e2b3c'), [0, 0, .002]);
  board.add(aftTube);
  aftTubeGeo.setDrawRange(0, 0);
  // đường lượn sóng ngắn của một vòng ngủ
  const wavePts = [[-.3, .24], [-.24, .17], [-.21, .08], [-.16, .01], [-.11, -.05], [-.04, -.02], [.02, .06]]
    .map(([x, y]) => new THREE.Vector3(x, y + .35, .026));
  const waveCurve = new THREE.CatmullRomCurve3(wavePts);
  const waveGeo = new THREE.TubeGeometry(waveCurve, 44, .008, 6, false);
  board.add(mesh(waveGeo, toon('#2f7fb8')));
  waveGeo.setDrawRange(0, 0);
  // vòng tròn khoanh chỗ giao
  const markRingMat = toon('#f7bd27', { emissive: '#f7bd27', emissiveIntensity: .3, transparent: true, opacity: 0 });
  const markRing = mesh(new THREE.TorusGeometry(.062, .007, 6, 22), markRingMat, [-.13, .335, .03]);
  markRing.visible = false;
  board.add(markRing);
  // hai quả cân đè xuống chỗ giao
  const weights = [toon('#c9973a'), toon('#8e7bb5')].map((m, i) => {
    const g2 = new THREE.Group();
    g2.add(mesh(new THREE.CylinderGeometry(.038, .048, .045, 16), m, [0, .022, 0]));
    g2.add(mesh(new THREE.SphereGeometry(.019, 12, 9), m, [0, .055, 0]));
    g2.position.set(-.11 + (i ? .07 : -.07), .39, .045);
    g2.visible = false;
    board.add(g2);
    return g2;
  });
  // cây bút
  const pen = new THREE.Group();
  pen.add(mesh(new THREE.CylinderGeometry(.01, .01, .115, 12), toon('#f7bd27'), [0, .055, 0]));
  pen.add(mesh(new THREE.ConeGeometry(.012, .03, 12), toon('#3a3a4a'), [0, -.01, 0], { rot: [Math.PI, 0, 0] }));
  pen.visible = false;
  board.add(pen);

  // ── con phố ngoài cửa sổ nhỏ, và tiếng ồn không lọt qua được mép mô não ──
  const WIN = { x0: -.55, x1: .85, y0: .55, y1: 1.6 };
  const wallMat = toon('#2e2249');
  const winWall = new THREE.Group(); winWall.position.set(BX, 0, -2.75); scene.add(winWall);
  const wp = (x0, x1, y0, y1) => winWall.add(mesh(rbox(x1 - x0, y1 - y0, .12, .02), wallMat, [(x0 + x1) / 2, (y0 + y1) / 2, 0]));
  wp(-4.2, WIN.x0, -2.6, 4.2); wp(WIN.x1, 4.2, -2.6, 4.2);
  wp(WIN.x0, WIN.x1, -2.6, WIN.y0); wp(WIN.x0, WIN.x1, WIN.y1, 4.2);

  const street = new THREE.Group();
  street.position.set(BX, 0, -3.05);
  scene.add(street);
  street.add(mesh(new THREE.PlaneGeometry(9, 4), new THREE.MeshBasicMaterial({ color: '#f0c98a', fog: false }), [0, 1.2, -1.7], { cast: false, recv: false }));
  const sunDisc = mesh(new THREE.CircleGeometry(.2, 28), glowMat('#ffe9a8', .85), [-.45, 1.45, -1.65], { cast: false });
  fxLayer(sunDisc); street.add(sunDisc);
  street.add(mesh(rbox(9, .1, 1.1, .02), toon('#4a4f74'), [0, -.45, -.55]));
  for (let i = 0; i < 9; i++) street.add(mesh(rbox(.22, .01, .06, .004), toon('#e8e2d4'), [-3.6 + i * .9, -.39, -.55], { cast: false }));
  const bldMat = toon('#8a6f9e');
  for (let i = 0; i < 7; i++) {
    const h = .8 + (i % 3) * .5;
    street.add(mesh(rbox(.85, h, .6, .03), bldMat, [-3.4 + i * 1.15, -.4 + h / 2, -1.35], { cast: false }));
  }
  const cars = [];
  ['#f04462', '#67e8f9', '#f7bd27'].forEach((col, i) => {
    const g2 = new THREE.Group();
    g2.add(mesh(rbox(.32, .12, .16, .03), toon(col), [0, -.3, 0], { cast: false }));
    g2.add(mesh(rbox(.16, .09, .14, .03), toon('#2b3358'), [-.02, -.19, 0], { cast: false }));
    street.add(g2);
    cars.push(g2);
  });
  const walkers = [];
  for (let i = 0; i < 4; i++) {
    const g2 = new THREE.Group();
    g2.add(mesh(new THREE.CapsuleGeometry(.022, .05, 4, 8), toon(i % 2 ? '#9a5be5' : '#e8dcc4'), [0, -.3, 0], { cast: false }));
    g2.add(mesh(new THREE.SphereGeometry(.024, 10, 8), toon('#e8b6a0'), [0, -.24, 0], { cast: false }));
    street.add(g2);
    walkers.push(g2);
  }
  // khung cửa sổ
  const frameMat = toon('#efe2c8');
  const winG = new THREE.Group(); winG.position.set(BX, 0, -2.66); scene.add(winG);
  const fw = WIN.x1 - WIN.x0, fh = WIN.y1 - WIN.y0, cxw = (WIN.x0 + WIN.x1) / 2, cyw = (WIN.y0 + WIN.y1) / 2;
  winG.add(mesh(rbox(fw + .09, .06, .1, .015), frameMat, [cxw, WIN.y1 + .02, 0]));
  winG.add(mesh(rbox(fw + .09, .06, .1, .015), frameMat, [cxw, WIN.y0 - .02, 0]));
  winG.add(mesh(rbox(.06, fh + .09, .1, .015), frameMat, [WIN.x0 - .02, cyw, 0]));
  winG.add(mesh(rbox(.06, fh + .09, .1, .015), frameMat, [WIN.x1 + .02, cyw, 0]));
  winG.add(mesh(rbox(.035, fh, .08, .012), frameMat, [cxw, cyw, 0]));
  // sóng âm thanh từ phố lan vào khung cửa rồi tắt ngay ở mép mô não
  const sound = flow(L(cxw, .95, -3.0), L(cxw, .5, CUTZ - .12), { color: '#cfe8ff', size: .05, n: 70, rate: .38, seed: 6, opacity: .3 });
  scene.add(sound);

  // ── dải hai mươi bốn giờ: một vòng ngày và đêm, và một thanh dài ────────
  const bandG = new THREE.Group();
  bandG.position.set(BX - 1.5, -.45, 1.5);
  scene.add(bandG);
  // mỗi ô là nửa tiếng: một vòng là hai mươi bốn tiếng
  const bandTiles = [];
  for (let i = 0; i < 48; i++) {
    const a = i / 48 * TAU;
    const h = i / 2;
    const night = h >= 18 || h < 6;
    const deep = h >= 1 && h < 5;
    const mat = toon(night ? (deep ? '#7a5ab0' : '#4d5384') : '#f0c05a');
    bandG.add(mesh(rbox(.068, .045, .075, .008), mat, [Math.sin(a) * .55, 0, Math.cos(a) * .55], { rot: [0, a, 0] }));
    bandTiles.push({ mat, hour: h, half: i, deep, night });
  }
  // vòng của đêm trước, để so sánh
  const prevG = new THREE.Group();
  prevG.position.set(BX - .15, -.45, 1.5);
  scene.add(prevG);
  const prevTiles = [];
  for (let i = 0; i < 48; i++) {
    const a = i / 48 * TAU;
    const deep = i >= 2 && i < 10;
    const mat = toon(deep ? '#7a5ab0' : '#4d5384');
    prevG.add(mesh(rbox(.068, .045, .075, .008), mat, [Math.sin(a) * .55, 0, Math.cos(a) * .55], { rot: [0, a, 0] }));
    prevTiles.push({ mat, deep });
  }
  // vòng của giấc ngủ trưa, đè lên vòng ban đêm
  const napG = new THREE.Group();
  napG.position.set(BX - 1.5, -.41, 1.5);
  scene.add(napG);
  const napMat = toon('#ff8a3d', { emissive: '#ff8a3d', emissiveIntensity: .5 });
  const napArcG = new THREE.Group();
  napG.add(napArcG);
  napArcG.add(mesh(new THREE.TorusGeometry(.55, .045, 10, 12, .55), napMat, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  const napRing = mesh(new THREE.TorusGeometry(.16, .042, 10, 24), napMat, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] });
  napG.add(napRing);

  // thanh dài đại diện cho một ngày
  const barG = new THREE.Group();
  barG.position.set(BX + .2, -.47, 2.0);
  scene.add(barG);
  const barTiles = [];
  for (let i = 0; i < 48; i++) {
    const night = i >= 36 || i < 12;
    const mat = toon(night ? '#4d5384' : '#f0c05a');
    barG.add(mesh(rbox(.044, .045, .075, .008), mat, [(i - 23.5) * .048, 0, 0]));
    barTiles.push({ mat, night, hour: i / 2 });
  }

  // ── sợi dây nối hai kim, và điểm sáng chỗ hai kim gặp nhau ──────────────
  const threadMat = glowMat('#8fd7e8', 1.6, { transparent: true, opacity: 0 });
  const thread = mesh(new THREE.CylinderGeometry(.007, .007, 1, 8), threadMat, [0, 0, 0], { cast: false });
  fxLayer(thread);
  scene.add(thread);
  const thread2 = mesh(new THREE.CylinderGeometry(.007, .007, 1, 8), threadMat, [0, 0, 0], { cast: false });
  fxLayer(thread2);
  scene.add(thread2);
  const nodeMat = glowMat('#fff3c8', 2.2, { transparent: true, opacity: 0 });
  const node = mesh(new THREE.SphereGeometry(.055, 16, 12), nodeMat, [0, 0, 0], { cast: false });
  fxLayer(node);
  scene.add(node);
  const haloMat = glowMat('#8fd7e8', 1.3, { transparent: true, opacity: 0 });
  const halo = mesh(new THREE.TorusGeometry(.22, .01, 8, 40), haloMat, [0, 0, 0], { cast: false });
  fxLayer(halo);
  scene.add(halo);

  // ────────────────────────────────────────────────────────────────────────
  // 3. Danh sách shot: mỗi câu một shot, mỗi shot một góc khác nhau
  // ────────────────────────────────────────────────────────────────────────
  const rows = [
    { id: 'two_clocks', line: 'c107', zone: 'brain', cam: [.4, .75, 4.0], look: [-.2, .05, -.4] },
    { id: 'dial_full', line: 'c108', zone: 'brain', cam: [-1.0, .5, 2.2], look: [-1.5, .35, .3] },
    { id: 'dial_low', line: 'c109', zone: 'brain', cam: [-2.5, .38, 1.6], look: [-1.5, .35, .3] },
    { id: 'cut_deep', line: 'c110', zone: 'brain', cam: [.15, .32, 1.3], look: [-.45, -.1, -.65] },
    { id: 'clocks_wide', line: 'c111', zone: 'brain', cam: [2.4, .75, 4.1], look: [.05, .1, -.45] },
    { id: 'dial_dark', line: 'c112', zone: 'brain', cam: [-1.05, .32, 1.55], look: [-1.5, .35, .3] },
    { id: 'hand_close', line: 'c113', zone: 'brain', cam: [-1.25, .42, .95], look: [-1.5, .35, .3] },
    { id: 'three_faces', line: 'c114', zone: 'brain', cam: [-1.0, .6, 2.9], look: [-1.5, .35, .3] },
    { id: 'desk_lie', line: 'c115', zone: 'desk', cam: [-1.5, 1.25, 3.0], look: [.05, .25, .9] },
    { id: 'desk_dial', line: 'c116', zone: 'desk', cam: [-.52, .48, 1.15], look: [-.16, .28, .07] },
    { id: 'dial_pair', line: 'c117', zone: 'brain', cam: [-.95, .55, 2.7], look: [-1.0, .35, .3] },
    { id: 'cut_light', line: 'c118', zone: 'brain', cam: [-.85, .3, 1.2], look: [-.5, -.1, -.65] },
    { id: 'ring_strip', line: 'c119', zone: 'brain', cam: [2.0, .45, 1.9], look: [1.6, .12, .3] },
    { id: 'ring_cells', line: 'c120', zone: 'brain', cam: [1.85, .5, 2.35], look: [1.0, .12, .3] },
    { id: 'ring_marks', line: 'c121', zone: 'brain', cam: [1.45, .4, 2.0], look: [1.0, .12, .3] },
    { id: 'ring_scale', line: 'c122', zone: 'brain', cam: [2.5, .5, 2.05], look: [1.35, -.02, .28] },
    { id: 'ring_low', line: 'c123', zone: 'brain', cam: [.25, .5, 2.2], look: [1.0, .05, .3] },
    { id: 'paper_draw', line: 'c124', zone: 'brain', cam: [.6, .1, 1.85], look: [.72, -.16, .3] },
    { id: 'sun_window', line: 'c125', zone: 'brain', cam: [.55, .85, .45], look: [-.1, 1.3, -3.2] },
    { id: 'street_win', line: 'c126', zone: 'brain', cam: [.15, 1.0, .5], look: [.15, .95, -2.9] },
    { id: 'desk_cushion', line: 'c127', zone: 'desk', cam: [.75, .5, 1.85], look: [-.25, .1, .9] },
    { id: 'ring_top', line: 'c128', zone: 'brain', cam: [1.35, .6, 2.15], look: [1.0, .05, .3] },
    { id: 'desk_droop', line: 'c129', zone: 'desk', cam: [-.6, .45, 1.5], look: [-.28, .12, .9] },
    { id: 'both_wide', line: 'c130', zone: 'brain', cam: [-.3, .7, 4.0], look: [-.2, .05, -.3] },
    { id: 'wall_clock', line: 'c131', zone: 'desk', cam: [.55, 1.55, 3.1], look: [.25, .95, .15] },
    { id: 'dial_deep', line: 'c132', zone: 'brain', cam: [-.9, .5, 1.7], look: [-1.5, .35, .3] },
    { id: 'ring_afternoon', line: 'c133', zone: 'brain', cam: [1.85, .45, 2.1], look: [1.0, .02, .3] },
    { id: 'needles_meet', line: 'c134', zone: 'brain', cam: [-.2, .45, 3.2], look: [-.25, .1, -.05] },
    { id: 'two_paths', line: 'c135', zone: 'brain', cam: [.35, .35, 2.9], look: [.15, -.2, .98] },
    { id: 'weights', line: 'c136', zone: 'brain', cam: [-.1, .15, 2.6], look: [.1, -.25, .98] },
    { id: 'cut_still', line: 'c137', zone: 'brain', cam: [-.25, .3, 1.15], look: [-.5, -.1, -.65] },
    { id: 'desk_slump', line: 'c138', zone: 'desk', cam: [.6, .6, 1.9], look: [-.25, .12, .9] },
    { id: 'desk_evening', line: 'c139', zone: 'desk', cam: [-1.4, 1.1, 3.2], look: [.05, .3, .9] },
    { id: 'band_ring', line: 'c140', zone: 'brain', cam: [-1.5, .65, 3.3], look: [-1.5, -.4, 1.5] },
    { id: 'band_three', line: 'c141', zone: 'brain', cam: [-.6, .85, 3.9], look: [-.8, -.4, 1.5] },
    { id: 'band_late', line: 'c142', zone: 'brain', cam: [-2.2, .75, 3.4], look: [-1.5, -.4, 1.5] },
    { id: 'band_thin', line: 'c143', zone: 'brain', cam: [-1.2, 1.1, 3.5], look: [-1.5, -.4, 1.5] },
    { id: 'desk_morning', line: 'c144', zone: 'desk', cam: [.75, 1.05, 2.6], look: [.1, .3, .95] },
    { id: 'day_bar', line: 'c145', zone: 'brain', cam: [.25, .8, 4.8], look: [.2, -.4, 2.0] },
    { id: 'desk_end', line: 'c146', zone: 'desk', cam: [1.3, 1.5, 3.8], look: [.1, .85, .85] },
  ].map(r => ({
    ...r,
    cam: [
      r.cam[0] + (r.zone === 'brain' ? BX : 0), r.cam[1], r.cam[2],
      r.look[0] + (r.zone === 'brain' ? BX : 0), r.look[1], r.look[2],
    ],
  }));

  const shots = makeShots(V, rows);
  const t0 = rows.map(r => (V.L[r.line] ? V.L[r.line].t0 : 0));
  const rowAt = t => { let i = 0; for (let k = 0; k < t0.length; k++) if (t >= t0[k]) i = k; return i; };
  const cam = t => {
    const i = rowAt(t);
    const nx = i + 1 < rows.length ? rows[i + 1] : rows[i];
    const span = Math.max(.5, (i + 1 < rows.length ? t0[i + 1] : t0[i] + 9) - t0[i]);
    const u = ss(clamp((t - t0[i]) / span));
    const a = rows[i].cam, b = (nx.zone === rows[i].zone) ? nx.cam : a;
    const k = (nx.zone === rows[i].zone) ? .08 : 0;
    return a.map((v, j) => lerp(v, b[j], k * u));
  };

  // ────────────────────────────────────────────────────────────────────────
  // 4. Trạng thái: mọi thứ chạy theo lời, không gõ số tay
  // ────────────────────────────────────────────────────────────────────────
  const t121 = T('c107'), t123 = T('c109');
  const CYCLE = Math.max(4, t123 - t121);                       // một vòng của kim chậm trên màn hình

  // kim chậm của mặt đồng hồ trong não: quay đều, hết một vòng thì đúng vạch xuất phát
  const dialFrac = keys([
    [t121, 0], [t123, 1], [T('c91'), 1.36], [T('c94'), 1.52],
    [T('c98'), 3.571], [T('c106'), 3.575], [T('c104'), 3.8],
  ], eio);

  // kim chỏ trên vòng đồng hồ sinh học: quanh một ngày, buổi chiều là đáy
  const ringHour = keys([
    [T('c105'), 6], [T('c107'), 8.4], [T('c108'), 10.6], [T('c109'), 13.7],
    [T('c105'), 13.7], [T('c104'), 14.6],
  ], eio);
  // mức buồn ngủ trong ngày: sáng cao, chiều thấp nhất, tối lại lên
  const levelAt = h => {
    const pts = [[0, .95], [6, .9], [9, .72], [12, .42], [15, .08], [18, .3], [21, .62], [24, .9]];
    for (let i = 0; i < pts.length - 1; i++) {
      if (h >= pts[i][0] && h <= pts[i + 1][0]) {
        const u = (h - pts[i][0]) / (pts[i + 1][0] - pts[i][0]);
        return lerp(pts[i][1], pts[i + 1][1], u * u * (3 - 2 * u));
      }
    }
    return .5;
  };

  // bàn tay trên bàn: nằm, với lấy gối, gục xuống, ngồi dậy, rơi xuống
  const handK = keys([
    [t121, [-.27, .19, .87, 0, .9, 0, .5]],
    [T('c93'), [-.27, .17, .87, 0, .9, 0, .55]],
    [T('c95'), [-.1, .36, .92, 0, .6, -.2, .3]],
    [T('c97'), [-.22, .16, .96, 0, .95, 0, .85]],
    [T('c103'), [-.3, .25, .9, 0, 1.1, -.3, .5]],
    [T('c110'), [-.34, .14, .94, 0, 1.0, 0, .9]],
    [T('c111'), [-.4, .11, .96, 0, 1.0, 0, .85]],
    [T('c102'), [-.34, .22, .92, 0, 1.2, -.35, .45]],
    [T('c104'), [-.3, .17, .9, 0, 1.0, 0, .6]],
  ], eio);

  const deskPhase = t => (t >= T('c111') && t < T('c102')) ? 'evening' : (t >= T('c102') ? 'morning' : 'afternoon');

  // đường cong trên giấy được vẽ dần
  const drawAt = (t, t0d, t1d) => ss(seg(t, t0d, t1d));
  const setTube = (geo, k) => geo.setDrawRange(0, Math.max(0, Math.floor(geo.index.count * clamp(k))));

  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3(), tmpD = new THREE.Vector3(), tmpM = new THREE.Vector3();
  const UP = new THREE.Vector3(0, 1, 0);
  const link = (m, a, b) => {
    tmpD.subVectors(b, a);
    const len = tmpD.length() || 1e-5;
    tmpM.copy(a).add(b).multiplyScalar(.5);
    m.position.copy(tmpM);
    m.quaternion.setFromUnitVectors(UP, tmpD.divideScalar(len));
    m.scale.set(1, len, 1);
  };

  const update = t => {
    const i = rowAt(t);
    const zone = rows[i].zone;
    const inBrain = zone === 'brain';

    // ── ánh sáng: mỗi nơi chốn một vùng sáng riêng ──
    const ph2 = deskPhase(t);
    S.update(t, { light: ph2 === 'evening' ? .16 : 1 });
    S.key.color.set(ph2 === 'morning' ? '#ffe6bc' : ph2 === 'evening' ? '#ffb070' : '#fff4e0');
    S.lamp.intensity = ph2 === 'evening' ? 4.6 : 3.2;
    brainKey.intensity = inBrain ? 1.9 : 0;
    brainPool.intensity = inBrain ? 1.7 : 0;

    // ── bàn làm việc: bàn tay, đồng hồ treo, điện thoại ──
    D.update(t, { wake: .5, reach: .2, hands: 1 });
    // the hand of the toy person on the desk (the person replaces the old floating hand)
    const hk = handK(t);
    D.person.set(.55 + .25 * hk[6], .3 + .2 * hk[6], .35 * hk[6], .35 * hk[6]);
    if (ph2 === 'evening') D.clock.tick(t, 21.2); else if (ph2 === 'morning') D.clock.tick(t, 7.4);

    // ── cái đồng hồ tròn (đồng hồ của một vòng ngủ) ──
    const f = dialFrac(t);
    dialA.visible = inBrain;
    dialA.setFrac(f);
    // ba mặt mờ chồng lên nhau: mỗi người một vòng dài hơn hoặc ngắn hơn
    const ghosts = ss(seg(t, T('c92'), T('c93')));
    const pair = (t >= T('c103') && t < T('c94'));
    dialB.visible = ghosts > .02 || pair;
    dialC.visible = ghosts > .02;
    const setGhost = (d, k) => d.traverse(o => {
      if (!o.material) return;
      if (o.material.userData.base === undefined) o.material.userData.base = o.material.opacity;
      o.material.transparent = k < .98;
      o.material.opacity = o.material.userData.base * k;
      o.material.depthWrite = k > .9;
    });
    if (ghosts > .02) {
      dialB.setFrac(f + .28); dialC.setFrac(f + .71);
      setGhost(dialB, ghosts * .55); setGhost(dialC, ghosts * .4);
      dialB.position.set(BX - 1.42, .38, -.15);
      dialC.position.set(BX - 1.6, .31, -.6);
    }
    if (pair) {
      // một kim bắt đầu từ vạch, một kim bắt đầu từ giữa mặt đồng hồ
      dialB.setFrac(.02); dialA.setFrac(.74);
      setGhost(dialB, 1); setGhost(dialC, 0);
      dialB.position.set(BX - .45, .35, .3);
      dialA.position.set(BX - 1.5, .35, .3);
    } else {
      dialA.position.set(BX + dialHome[0], dialHome[1], dialHome[2]);
    }

    // cái đồng hồ trên bàn
    dialD.visible = t >= T('c93') && t < T('c105');
    if (dialD.visible) dialD.setFrac(keys([[T('c93'), .3], [T('c102'), .333], [T('c103'), .4], [T('c94'), .46]], eio)(t));
    // khe trời tối chỉ hiện ở câu về đồng hồ không biết giờ
    roof.visible = inBrain && t >= T('c112') && t < T('c91');

    // ── cái vòng đồng hồ sinh học quanh cụm tế bào ──
    const hr = ringHour(t);
    ring.setHour(hr);
    ring.visible = inBrain;
    cells.visible = ring.visible;
    ladder.visible = ring.visible && t >= T('c108');
    sleepers.visible = ring.visible && t >= T('c96');
    aftArc.visible = ring.visible && t >= T('c108');
    const level = levelAt(hr);
    const lit = Math.round(level * 5);
    stepMats.forEach((m, k) => m.color.set(k === lit ? '#f7bd27' : '#6b5a9a'));
    bead.position.y = .06 + level * .44;
    beadMat.color.set('#f7bd27').multiplyScalar(1.2 + .5 * level);
    // dải buổi chiều trên vòng sáng dần lên rồi các vạch khác tối đi
    const aftOn = ss(seg(t, T('c105'), T('c105') + 1.2));
    aftMat.emissiveIntensity = aftOn * .55;
    aftMat.color.set(aftOn > .5 ? '#ffd76a' : '#7a5a2a');
    // người tí hon nằm xuống lần lượt trên các vạch buổi chiều
    sleeperMats.forEach((m, k) => {
      const on = ss(seg(t, T('c96') + k * .35, T('c96') + k * .35 + .7));
      m.color.set(on > .5 ? '#f6efe0' : '#7d7492');
    });

    // ── vùng não sâu và vùng não tỉnh ──
    const deep = ss(seg(t, T('c103'), T('c94') + .6)) * (1 - ss(seg(t, T('c103'), T('c109') + .8)));
    deepZone.position.y = -.14 - .05 * deep;
    deepMat.opacity = .45 + .5 * deep;
    awakeMat.opacity = .2 + .45 * (1 - deep);
    mass.wave(t, 1 + .5 * (1 - deep));
    // đốm sáng ở vùng não tỉnh, nhấp nháy nhanh
    for (let k = 0; k < 40; k++) {
      const a = hash2(k) * TAU, r = Math.sqrt(hash2(k + 7)) * .24;
      const on = Math.sin(t * 9 + k * 1.7) > (deep > .5 ? .2 : -.4);
      if (on) sparksM.put(k, BX - .95 + Math.cos(a) * r, -.18 + Math.sin(a) * r * .7, CUTZ + .06);
      else sparksM.put(k, 0, -99, 0);
    }
    // khe sáng lọt vào, vùng sâu sáng lên chậm hơn nhiều
    const slitOn = ss(seg(t, T('c94'), T('c94') + .8)) * (1 - ss(seg(t, T('c109') + 1.2, T('c110'))));
    slitMat.opacity = slitOn * .8;

    // ── tờ giấy kẻ ô và cây bút ──
    const showPaper = t >= T('c107') && t < T('c109');
    board.visible = showPaper;
    if (showPaper) {
      const kDay = drawAt(t, T('c107') + .3, T('c107') + 2.6);
      const kAft = drawAt(t, T('c107') + .3, T('c107') + 2.2);
      const kWave = drawAt(t, T('c107') + 2.4, T('c107') + 3.8);
      setTube(dayGeo, kDay);
      setTube(aftTubeGeo, kAft * .5);
      setTube(waveGeo, kWave);
      // cây bút chạy theo đường cong đang vẽ
      const drawingWave = t >= T('c107') + 2.4;
      const pk = drawingWave ? kWave : kDay;
      const curveNow = drawingWave ? waveCurve : dayCurve;
      const p = curveNow.getPoint(clamp(pk * .995));
      const tan = curveNow.getTangent(clamp(pk * .995));
      pen.visible = pk > .02 && pk < .995;
      pen.position.set(p.x, p.y, p.z + .01);
      pen.rotation.set(0, 0, Math.atan2(-tan.x, tan.y) + Math.PI);
      // khoanh chỗ giao của hai đường
      const circled = ss(seg(t, T('c107') + 3.6, T('c107') + 4.4));
      markRing.visible = circled > .02;
      markRingMat.opacity = circled;
      // hai quả cân đè xuống, tờ giấy cong tại chỗ giao
      const w = ss(seg(t, T('c108'), T('c108') + 1.2));
      weights.forEach((wg, k) => {
        wg.visible = w > .02;
        wg.position.y = .39 + .28 * (1 - ss(seg(t, T('c108') + k * .35, T('c108') + k * .35 + .5)));
      });
      const bend = w * .045;
      const pa = paperGeo.attributes.position;
      for (let v = 0; v < pa.count; v++) {
        const x = paperBase[v * 3], y = paperBase[v * 3 + 1];
        const d = Math.hypot(x + .11, y - .35);
        pa.setZ(v, paperBase[v * 3 + 2] - bend * Math.exp(-d * d * 11));
      }
      pa.needsUpdate = true;
    }

    // ── phố ngoài cửa sổ và tiếng ồn ──
    cars.forEach((c, k) => {
      const x = -3.2 + ((t * (.5 + k * .12) + k * 1.6) % 6.6);
      c.position.set(x, 0, -.55 + (k % 2) * .3);
    });
    walkers.forEach((w2, k) => {
      const x = -2.8 + ((t * (.22 + k * .05) + k * 1.3) % 5.6);
      w2.position.set(x, 0, -.05 + k * .12);
      w2.rotation.y = Math.sin(t * 3 + k) * .1;
    });
    const hear = ss(seg(t, T('c112'), T('c112') + .6)) * (1 - ss(seg(t, T('c112') + 2.4, T('c95'))));
    sound.update(t, hear * .95);
    sound.amount(.45 + .4 * hear);

    // ── dải ngày đêm ──
    const showBand = t >= T('c112') && t < T('c102');
    fg.visible = inBrain && !showBand && !(t >= T('c103'));
    bandG.visible = showBand; prevG.visible = showBand; napG.visible = showBand;
    barG.visible = t >= T('c103') && t < T('c104');
    if (showBand) {
      // cái cắt của giấc ngủ trưa: một đoạn bị khoét khỏi mảng ban đêm
      const slide = ss(seg(t, T('c100'), T('c100') + 1.6));
      const from = Math.round(lerp(40, 44, slide));             // vị trí cái cắt trong đêm
      const to = from + 2;                                     // chừng bốn mươi tám phút
      const thin = ss(seg(t, T('c101'), T('c101') + 1.8));
      bandTiles.forEach(b => {
        const gone = b.half >= from && b.half < to;
        if (b.deep) {
          const keep = (b.half - 2) >= thin * 7;                // đoạn giấc ngủ sâu giữa đêm mỏng đi
          b.mat.color.set(gone ? '#1b1e38' : keep ? '#7a5ab0' : '#2b2444');
          return;
        }
        b.mat.color.set(gone ? '#1b1e38' : b.night ? '#4d5384' : '#f0c05a');
      });
      prevTiles.forEach(p2 => p2.mat.color.set(p2.deep ? '#7a5ab0' : '#4d5384'));
      // vòng của giấc ngủ trưa đè lên vòng ban đêm
      const napSlide = ss(seg(t, T('c99'), T('c100') + .8));
      const napA = lerp(TAU * (21.5 / 24), TAU * (23.5 / 24), napSlide);
      napArcG.rotation.y = napA - Math.PI / 2 + .275;
      napRing.visible = t >= T('c99');
      napRing.position.set(Math.sin(napA) * .55, 0, Math.cos(napA) * .55);
      napMat.color.set('#ff8a3d');
      napMat.emissiveIntensity = .4 + .3 * Math.sin(t * 3);
    }
    if (barG.visible) {
      // buổi chiều và đầu đêm bị làm mờ đi
      const fade = ss(seg(t, T('c103') + .3, T('c103') + 2.2));
      barTiles.forEach(b => {
        if (b.hour >= 13 && b.hour <= 21) b.mat.color.set('#f0c05a').lerp(new THREE.Color('#7c86b8'), fade);
      });
      barTiles.forEach(b => {
        if (b.hour < 13 || b.hour > 21) b.mat.color.set(b.night ? '#4d5384' : '#f0c05a');
      });
    }

    // ── sợi dây nối hai kim, và chỗ hai kim cùng chỉ ──
    const fm = ((f % 1) + 1) % 1;
    const handTip = tmpA.set(
      BX + dialHome[0] + .285 * Math.sin(TAU * fm),
      dialHome[1] + .285 * Math.cos(TAU * fm),
      dialHome[2]);
    const th = Math.PI / 2 - (hr / 24) * TAU;
    const coneTip = tmpB.set(
      BX + RINGP[0] + RR * .82 * Math.cos(th),
      RINGP[1] + RR * .82 * Math.sin(th),
      RINGP[2]);
    const meet = tmpC.set((handTip.x + coneTip.x) / 2, (handTip.y + coneTip.y) / 2, (handTip.z + coneTip.z) / 2);
    const thVis = ss(seg(t, T('c102'), T('c102') + 1.2)) * (1 - ss(seg(t, T('c107'), T('c107') + .4)));
    const thMeet = ss(seg(t, T('c106'), T('c106') + 1.2));
    threadMat.opacity = Math.max(thVis * .8, thMeet * .95);
    thread.visible = threadMat.opacity > .02;
    thread2.visible = thread.visible;
    if (thread.visible) { link(thread, handTip, coneTip); link(thread2, coneTip, meet); }
    // điểm sáng chỗ hai kim gặp nhau
    nodeMat.opacity = thMeet * .95;
    node.visible = nodeMat.opacity > .02;
    node.position.copy(meet);
    node.scale.setScalar(1 + .25 * Math.sin(t * 5));
    haloMat.opacity = thMeet * .75;
    halo.visible = haloMat.opacity > .02;
    halo.position.copy(meet);
    halo.rotation.set(Math.PI / 2, 0, 0);
    halo.scale.setScalar(.6 + .5 * thMeet);
  };

  const labels = t => {
    const out = [];
    const a0 = W('c108', 'CHÍN'), a1 = T('c109');
    if (t >= a0 && t <= a1) out.push({ text: 'CHÍN MƯƠI PHÚT', anchor: L(-1.5, .95, .3), t0: a0, t1: a1, dx: -60, dy: -190 });
    const b0 = W('c106', 'ĐỒNG'), b1 = T('c107');
    if (t >= b0 && t <= b1) out.push({ text: 'ĐỒNG HỒ SINH HỌC', anchor: L(1.3, .3, .3), t0: b0, t1: b1, dx: 60, dy: -210 });
    return out;
  };

  return {
    key: brainKey,
    update,
    cam,
    labels,
    events: () => shots.events(),
    flashColor: () => new THREE.Color(PAL.purple),
    ref: 1.8,
  };
}
