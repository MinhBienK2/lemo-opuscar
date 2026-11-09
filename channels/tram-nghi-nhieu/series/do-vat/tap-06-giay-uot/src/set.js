// set.js — ba nơi chốn của tập 06.
//
//   N1  bếp buổi sáng   : hai tờ giấy trên quầy — một tờ bị tay ướt chạm và rách,
//                         một tờ tay khô chạm vẫn nguyên; bát nước và khăn lau.
//   N2  trong tờ giấy  : mạng sợi cellulose, các nhóm hydroxyl mọc hai bên, mối liên
//                         kết hydrogen, nước lấn vào, sợi phồng, sợi trượt và nứt lan.
//   N3  bàn đo ban đêm  : bộ kẹp giấy, dải giấy thử, lực kế, đồng hồ độ ẩm, bát nước,
//                         mẻ giấy khăn giấy, túi giấy, tờ giấy đã qua nước rồi sấy.
//
// Mỗi bộ trả về { group, focus, cams, key, update } và đặt sẵn vật của tập vào chỗ của nó,
// để film.js chỉ lo chuyển động và máy quay.
import * as THREE from 'three';
import { toon, mesh, rbox, canvasTex, PAL, clamp, lerp, ss, mulberry, fxLayer, glowMat, surface } from '../../../../rig/kit.js';
import { keyLight, ambience, pool } from '../../../../rig/lights.js';
import { kitchen, desk } from '../../../../rig/sets.js';
import { flow } from '../../../../rig/fx.js';
import {
  paperSheet, waterBowl, dishTowel, fibre, bond, waterMolecule,
  paperClamp, gaugeStand, dynamometer, hygrometer, paperStrip, tissueStack, paperBag, crack, cutCorner,
  ruler, paperEdge,
} from './props.js';

// Tia sáng hình nón mà rig dựng sẵn (beam) chạy ngang qua mặt quầy: máy quay ở
// trong tia sáng thì tia thành một vệt kem phủ lên cả khung. Tắt đúng tia sáng:
// tia có uniform uCol, còn trời (mặt phẳng gradient) có uA + uB nên phải để trời lại.
function noShaft(scene) {
  scene.traverse(o => {
    const u = o.material && o.material.uniforms;
    if (o.isMesh && u && u.uCol && u.uA) o.visible = false;
  });
}

// ── N1: bếp ──────────────────────────────────────────────────────────────
export function buildKitchen(scene) {
  const S = kitchen(scene, { time: 'morning' });
  noShaft(scene);
  const F = S.focus;                                   // (-.7, 0, .8)

  // Tờ thứ nhất: tờ bị tay ướt chạm và rách. Nó nằm **trái** chỗ sáng của quầy,
  // mép rách chạy dọc nên tay ướt đè xuống là nứt ngay dưới ngón tay.
  // (Vị trí đo được: vệt sáng của cửa sổ rơi xuống quầy ở x ≈ -1.05…1.3, và có
  // một sọc bóng của song cửa ở x ≈ -0.65 — hai tờ giấy phải nằm ngoài sọc bóng
  // đó, nếu không tờ ướt sẽ nằm trong bóng và người xem không thấy vệt nước.)
  const sheetWet = paperSheet({ w: .21, h: .28, tear: true, seed: 5 });
  sheetWet.position.set(F.x - .20, 0, F.z + .02);
  sheetWet.rotation.y = .17;
  scene.add(sheetWet);

  // Tờ thứ hai: tờ khô, tay khô chạm vẫn nguyên. Nó nằm **phải**, cách tờ kia
  // một gang tay, để cùng một khung hình so sánh được hai tờ.
  const sheetDry = paperSheet({ w: .21, h: .28, seed: 3 });
  sheetDry.position.set(F.x + .20, 0, F.z + .05);
  sheetDry.rotation.y = -.11;
  scene.add(sheetDry);

  // Bát nước và khăn lau: tay ướt lấy nước ở đây rồi đi sang tờ giấy — nước
  // phải **có mặt** trong cảnh, không lạ xuất hiện trên tay.
  const bowl = waterBowl({ R: .10 });
  bowl.position.set(F.x - .52, 0, F.z + .12);
  scene.add(bowl);
  const towel = dishTowel({ w: .16, drop: .07, color: PAL.red });
  towel.position.set(bowl.position.x - .045, bowl.H + .004, bowl.position.z + .03);
  towel.rotation.y = .5;
  scene.add(towel);

  // Vệt sáng nhẹ từ phía máy quay: mặt trước của hai tờ giấy không được chìm
  // trong bóng của thành quầy.
  pool(scene, {
    from: new THREE.Vector3(F.x + .06, .95, F.z + 1.15),
    to: new THREE.Vector3(F.x + .06, .01, F.z),
    color: '#ffe6c4', intensity: .42, angle: .52,
  });

  return {
    ...S,
    props: { sheetWet, sheetDry, bowl, towel },
    // chỗ tay ướt đặt xuống (trên tờ ướt) và chỗ tay khô (trên tờ khô)
    wetHand: new THREE.Vector3(F.x - .20, 0, F.z + .02),
    dryHand: new THREE.Vector3(F.x + .20, 0, F.z + .05),
  };
}

// ── N2: trong tờ giấy ────────────────────────────────────────────────────
// Bên trong tờ giấy: một mạng sợi cellulose. Mọi thứ ở đây to như bên trong vật,
// và sợi nằm **thẳng trong mặt phẳng XY** (ngang với màn hình) để người xem thấy
// mặt dẹt của sợi chứ không thấy một sợi chỉ từ cạnh.
export function buildInside(scene) {
  scene.background = canvasTex(64, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#3d3070'); gr.addColorStop(1, '#221a3d');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  scene.fog = new THREE.Fog('#2a2350', 3.4, 8.0);   // sợi nền phải còn thấy, không chìm thành vệt đen
  const key = keyLight(scene, { from: new THREE.Vector3(.45, 1.7, 1.5), to: new THREE.Vector3(0, 0, 0), color: '#ffe9c8', intensity: 3.3, size: 1.8 });
  const amb = ambience(scene, { sky: '#6f67b2', ground: '#3b3059', fill: 1.0, rim: '#b79bff', rimI: 1.15, rimFrom: [-2, 1.6, -1.6] });

  // khối giấy ở sau: mặt cắt của tờ giấy, tối và mờ, để sợi có chỗ đứng
  const blk = mesh(rbox(6.4, 4.2, .5, .06), toon('#443470'), [0, 0, -1.30]);
  scene.add(blk);
  const rnd = mulberry(11);
  for (let i = 0; i < 22; i++) {
    const x = (rnd() - .5) * 5.8, y = (rnd() - .5) * 3.6;
    scene.add(mesh(new THREE.CircleGeometry(.08 + rnd() * .18, 12), toon(rnd() > .5 ? '#54418a' : '#3a2c63'), [x, y, -1.03], { cast: false }));
  }

  // ── mạng sợi ở đằng sau: nền của "bên trong tờ giấy" ──
  const field = [];
  for (let i = 0; i < 20; i++) {
    const x = (rnd() - .5) * 1.30, y = (rnd() - .5) * .95;
    const ang = (rnd() - .5) * 1.6, len = .26 + rnd() * .26;
    const f = fibre({ len, wid: .017, color: '#a98d5e', seed: i * 7 + 3, groups: 6 });
    f.rotation.set(-Math.PI / 2, 0, ang);
    f.position.set(x, y, -.85 + rnd() * .40);
    // Sợi nền là nền: nó **không đổ bóng**. Sợi mảnh tự đổ bóng lên chính nó thì
    // cả sợi thành một vệt đen, đọc ra như sợi cháy, không phải sợi giấy.
    f.traverse(o => { if (o.isMesh) o.castShadow = false; });
    scene.add(f);
    field.push({ x, y, ang, len, f });
  }

  // ── ba sợi tiền cảnh: đôi chạm nhau, và một sợi cắt chéo ──
  const hero = [];
  const mkHero = (x, y, z, ang, len, wid, seed) => {
    const f = fibre({ len, wid, color: '#f0d79b', seed, groups: 9 });
    f.rotation.set(-Math.PI / 2, 0, ang);
    f.position.set(x, y, z);
    f.userData.x0 = x; f.userData.y0 = y;
    scene.add(f);
    hero.push({ x, y, ang, len, f });
    return f;
  };
  const fA = mkHero(0, -.02, .12, .05, .62, .030, 5);      // sợi nằm ngang
  const fB = mkHero(.01, .00, .138, Math.PI / 2 - .10, .52, .028, 11);   // sợi đứng
  const fC = mkHero(-.13, .01, .152, .58, .46, .024, 17);  // sợi cắt chéo

  // Chỗ hai sợi chạm nhau: giao của hai đường thẳng. Móc sáng được đặt **đúng**
  // chỗ giao, không đặt bừa — "liên kết hydrogen" là ở chỗ sợi chạm sợi.
  function cross(a, b) {
    const d1x = Math.cos(a.ang), d1y = Math.sin(a.ang);
    const d2x = Math.cos(b.ang), d2y = Math.sin(b.ang);
    const den = d1x * d2y - d1y * d2x;
    if (Math.abs(den) < 1e-3) return null;
    const rx = b.x - a.x, ry = b.y - a.y;
    const t = (rx * d2y - ry * d2x) / den;
    const u = (rx * d1y - ry * d1x) / den;
    if (Math.abs(t) > a.len / 2 || Math.abs(u) > b.len / 2) return null;
    return { x: a.x + d1x * t, y: a.y + d1y * t, z: (a.f.position.z + b.f.position.z) / 2 };
  }
  const bonds = [];
  const addBond = (p, r = .0075) => {
    const b = bond({ r });
    b.position.set(p.x, p.y, p.z + .022);
    scene.add(b);
    bonds.push(b);
    return b;
  };
  // móc nhỏ ở các chỗ chạm của mạng sau
  let made = 0;
  for (let i = 0; i < field.length && made < 7; i++) {
    for (let j = i + 1; j < field.length && made < 7; j++) {
      const p = cross(field[i], field[j]);
      if (p && Math.abs(p.x) < .7 && Math.abs(p.y) < .5) { addBond(p, .0040); made++; }
    }
  }
  // móc lớn ở chỗ các sợi tiền cảnh chạm nhau
  const heroBonds = [];
  const [hA, hB, hC] = hero;
  const pAB = cross(hA, hB), pAC = cross(hA, hC), pBC = cross(hB, hC);
  for (const p of [pAB, pAC, pBC]) if (p) heroBonds.push(addBond(p, .0062));

  // ── nước: các phân tử bay vào và chen vào đúng chỗ các nhóm hydroxyl ──
  const molecules = [];
  const targets = bonds.slice(0, 8);
  // Hai phân tử đầu **dính vào nhau** bằng một móc **xanh lam** (dòng 14): nước
  // cũng tạo ra liên kết hydrogen, nhưng là liên kết **với nước**, nên nó phải
  // khác màu với móc vàng giữa hai sợi, và nó không đổi màu.
  const waterHook = bond({ r: .0050, color: '#5aa9ff' });
  waterHook.position.set(-.045, .030, .175);
  waterHook.visible = false;
  scene.add(waterHook);
  const waterPair = [
    new THREE.Vector3(-.075, .016, .175),
    new THREE.Vector3(-.014, .044, .175),
  ];
  for (let i = 0; i < 8; i++) {
    const m = waterMolecule({ R: .0115 });
    const tg = i < 2 ? waterPair[i].clone()
      : (targets[i] ? targets[i].position.clone() : new THREE.Vector3((i - 4) * .12, (i % 3 - 1) * .1, .15));
    const from = new THREE.Vector3(-1.05 - i * .06, tg.y + .04, tg.z);
    m.position.copy(from);
    m.userData.from = from;
    m.visible = false;
    scene.add(m);
    molecules.push({ m, tg });
  }

  // ── vệt nứt: khe tối giữa hai sợi đã trượt ra, lan dọc theo sợi ──
  const cr = crack({ len: .34, w: .045, seed: 9 });
  cr.rotation.z = -Math.PI / 2;                     // nứt lan ngang, theo sợi
  if (pAB) cr.position.set(pAB.x, pAB.y, pAB.z + .03);
  cr.scale.y = 0;
  scene.add(cr);

  // ── mặt cắt của tờ giấy: lúc máy lui ra, mép cắt phủ dần vào khung ──
  // Nó đứng **bên phải** khung rồi quét sang trái: người xem thấy mép cắt
  // thẳng của tờ giấy, ở đó các đầu sợi chìa ra xếp chồng, phủ dần lên mạng
  // sợi — máy quay đang lui ra khỏi tờ giấy.
  const edge = paperEdge({ w: 3.0, h: 1.2, seed: 6 });
  edge.position.set(3.40, .42, .45);
  // Nó không đổ bóng: một mặt phẳng to che luôn làm mạng sợi tối đi.
  edge.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  scene.add(edge);

  return {
    focus: new THREE.Vector3(0, 0, .14), key, amb,
    props: { field, hero, fA, fB, fC, bonds, heroBonds, molecules, waterHook, crack: cr, edge },
  };
}

// ── N3: bàn đo ban đêm ───────────────────────────────────────────────────
// Bộ đo kéo: một đầu dải giấy kẹp trong kẹp, dải giấy treo xuống, đầu kia buộc
// vào **vòng treo trên** của lực kế. Tay nắm lực kế và kéo **xuống**: dải giấy
// căng dần, kim chạy theo, và dải giấy đứt ở lực đó. Lực kế treo ở đầu dải
// (đúng như lực kế thật), nên nó tự đứng yên được khi chưa ai kéo.
export function buildDesk(scene) {
  const S = desk(scene, { time: 'night' });
  const F = S.focus;                                   // (.05, 0, .85)

  // giá đo: đế nặng và cột đứng, vạt ngang ở trên để treo kẹp giấy
  const stand = gaugeStand({ H: .55, color: '#4a5064' });
  stand.position.set(F.x - .40, 0, F.z + .10);
  stand.rotation.y = Math.PI / 2;                     // vạt ngang chìa về +x
  scene.add(stand);

  // bộ kẹp giấy: hai bản hàm ngập vào nhau, kẹp đầu trên của dải giấy
  const clamp = paperClamp({});
  clamp.position.set(F.x - .255, .50, F.z + .10);
  clamp.rotation.z = Math.PI / 2;                     // kẹp một dải giấy đứng
  scene.add(clamp);

  // dải giấy thử: một dải dài mỏng treo thẳng từ kẹp xuống, **mặt giấy
  // quay về phía máy quay** (nếu không, người xem chỉ thấy một sợi mảnh)
  const strip = paperStrip({ len: .20, wid: .030, seed: 7 });
  strip.rotation.set(0, Math.PI / 2, Math.PI / 2);   // dải đứng, mặt về phía máy
  strip.position.set(F.x - .255, .39, F.z + .10);
  scene.add(strip);

  // lực kế: treo ở đầu dưới dải giấy, mặt thang quay về phía máy quay
  const gauge = dynamometer({ R: .055 });
  gauge.position.set(F.x - .255, .235, F.z + .10);
  scene.add(gauge);

  // đồng hồ độ ẩm: đứng cạnh trên mặt bàn, **ở trước** mẻ giấy đã sấy (nếu đứng
  // sau, thẻ "50 %" trỏ vào nó lại dính vào tờ giấy), mặt thang quay về máy quay
  const hygro = hygrometer({ R: .042 });
  hygro.position.set(F.x + .04, .048, F.z + .30);
  scene.add(hygro);

  // thước kẻ vạch: đứng cạnh dải giấy thử, hơi sau và hơi lệch trái. Nó
  // đứng đúng chỗ lực kế rơi xuống, nên **độ giãn** của dải giấy có chỗ để đo:
  // đầu dải giấy đi qua từng vạch một.
  const scale = ruler({ len: .42, wid: .028 });
  scale.position.set(F.x - .300, .21, F.z + .02);
  scale.rotation.set(0, .18, .06);
  scene.add(scale);

  // bát nước: tay rót nước từ đây xuống dải giấy ở lúc giấy ướt hẳn
  const bowl = waterBowl({ R: .095 });
  bowl.position.set(F.x - .07, 0, F.z + .17);
  scene.add(bowl);
  const towel = dishTowel({ w: .15, drop: .06, color: PAL.red });
  towel.position.set(bowl.position.x - .04, bowl.H + .004, bowl.position.z + .03);
  towel.rotation.y = .5;
  scene.add(towel);
  // dòng nước rót từ miệng bát xuống dải giấy: nước phải đi từ một vật thật
  const pour = flow(new THREE.Vector3(F.x - .11, .29, F.z + .17), new THREE.Vector3(F.x - .255, .33, F.z + .10),
    { color: '#a8e9ff', size: .006, n: 70, rate: .9, opacity: .45 });
  pour.visible = false;
  scene.add(pour);

  // mẻ giấy khăn giấy và túi giấy bao bị: hai vật **của ngành** — loại giấy có
  // nhựa. Dấu hiệu nhìn thấy được là các móc nối hồng ở mép cắt của giấy khăn.
  const tissue = tissueStack({ n: 5, w: .13, d: .10 });
  tissue.position.set(F.x + .46, 0, F.z - .06);
  tissue.rotation.y = .2;
  scene.add(tissue);
  const bag = paperBag({ w: .14, h: .18, d: .055 });
  bag.position.set(F.x + .62, 0, F.z + .02);
  bag.rotation.y = -.20;
  scene.add(bag);

  // góc giấy khăn giấy bị cắt: ở mép cắt lộ ra các móc nối màu hồng — mối nối
  // bằng nhựa, nước không phá được
  const corner = cutCorner({ w: .090, h: .090, seed: 3 });
  corner.position.set(F.x + .40, .001, F.z - .14);
  corner.rotation.set(-Math.PI / 2, 0, .5);
  scene.add(corner);

  // tờ giấy đã qua nước rồi sấy: nhăn dày, vệt ẩm còn hằn — cạnh một tờ
  // giấy khô khó phẳng, để so sánh thấy
  const dried = paperSheet({ w: .21, h: .28, seed: 9, wrinkle: 2.4 });
  dried.position.set(F.x + .30, 0, F.z - .28);
  dried.rotation.y = -.2;
  dried.setWet(.45);
  scene.add(dried);
  const fresh = paperSheet({ w: .21, h: .28, seed: 13 });
  fresh.position.set(F.x + .52, 0, F.z - .30);
  fresh.rotation.y = .14;
  scene.add(fresh);

  // Vệt sáng phụ ở góc túi giấy: túi nằm ngoài vùng đèn bàn, mà không có vệt
  // sáng này thì nó đọc như một khối tối, không phải giấy.
  pool(scene, {
    from: new THREE.Vector3(F.x + .58, .82, F.z + .30),
    to: new THREE.Vector3(F.x + .62, .06, F.z + .02),
    color: '#ffe6c4', intensity: 1.7, angle: .42,
  });

  // Vệt sáng phụ ở bộ kẹp: đèn bàn của rig hắt vào giữa bàn, còn bộ đo nằm bên
  // trái; không có vệt này thì mặt thang đồng hồ là nền tối và người xem không
  // đọc được số.
  pool(scene, {
    from: new THREE.Vector3(F.x - .30, .82, F.z + .52),
    to: new THREE.Vector3(F.x - .255, .26, F.z + .10),
    color: '#ffe6c4', intensity: 2.2, angle: .48,
  });

  return {
    ...S,
    props: { stand, clamp, strip, gauge, hygro, scale, bowl, towel, pour, tissue, corner, bag, dried, fresh },
    // chỗ tay nắm lực kế (kéo xuống) và chỗ bát nước được nâng lên rót
    grip: new THREE.Vector3(F.x - .255, .235, F.z + .10),
    bowlHome: new THREE.Vector3(F.x - .07, 0, F.z + .17),
    dip: new THREE.Vector3(F.x - .255, .33, F.z + .10),
  };
}

// ── trợ giá: bàn tay ướt có giọt nước ───────────────────────────────────
// Nước phải **có mặt**: một tay ướt mang theo giọt nước, thì người xem thấy
// ngay nước là thứ lạ đến với tờ giấy, không phải tay.
export function droplets(hand, n = 7, seed = 5) {
  const r = mulberry(seed);
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const s = .0035 + r() * .0035;
    const d = mesh(new THREE.SphereGeometry(s, 10, 8), toon('#a8d8ea', { transparent: true, opacity: .92 }),
      [(r() - .5) * .07, .004 + r() * .01, -.04 + r() * .12]);
    d.scale.y = 1.25;
    g.add(d);
  }
  hand.add(g);
  g.position.set(.12, .01, .02);
  return g;
}
