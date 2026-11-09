// set.js — ba nơi chốn của tập 06.
//
//   N1  bếp buổi sáng   : hai tờ giấy trên quầy — một tờ bị tay ướt chạm và rách,
//                         một tờ tay khô chạm vẫn nguyên; bát nước và khăn lau.
//   N2  trong tờ giấy  : mạng sợi cellulose, các nhóm hydroxyl mọc hai bên, mối liên
//                         kết hydrogen, nước lấn vào, sợi phồng, sợi trượt và nứt lan.
//   N3  bàn đo ban đêm  : bộ kẹp giấy, dải giấy thử, lực kế, đồng hồ độ ẩm, bát nước,
//                         mẻ giấy khăn giấy, túi giấy, tờ giấy đã qua nước rồi sấy.
//
// Mỗi bộ trả về { props, focus, key, amb, update } và đặt sẵn vật của tập vào chỗ
// của nó, để film.js chỉ lo chuyển động và máy quay.
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

// Quay một vật theo hai trục đã biết (trục thứ ba suy ra): dùng cho bàn tay trong
// thế giới sợi — ta cần lòng bàn tay nghiêng, không phải quay thẳng về máy.
function quatFromAxes(x, y) {
  const X = new THREE.Vector3(...x).normalize();
  const Y = new THREE.Vector3(...y);
  Y.addScaledVector(X, -Y.dot(X)).normalize();       // trực giao với X
  const Z = new THREE.Vector3().crossVectors(X, Y);
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z));
}

// Vòng treo của lực kế: nó nằm ngay trên vỏ lực kế nên bị dính vào vỏ và không
// đọc ra là một cái vòng. Ta tìm nó, đẩy lên cho tách khỏi vỏ, và xoay nghiêng
// để lỗ vòng nhìn thấy được — dải giấy phải **móc qua** chỗ đó.
function topRing(gauge) {
  let best = null;
  gauge.traverse(o => {
    if (!o.isMesh || !o.geometry) return;
    if (o.geometry.type !== 'TorusGeometry') return;
    if (!best || o.position.y > best.position.y) best = o;
  });
  return best;
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
//
// Cảnh phải có **ba lớp** đọc ra: khối giấy xa (tối, có gợn), mạng sợi giữa, và
// sợi tiền cảnh (to, gần máy). Không có sương mù thì ba lớp dính thành một mảng
// tím phẳng — và một mảng phẳng thì không có viền mực nào.
export function buildInside(scene) {
  scene.background = canvasTex(64, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#3d3070'); gr.addColorStop(1, '#221a3d');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  // Sương mù tách lớp: sợi tiền cảnh (0.85) không mờ, mạng sợi giữa mờ vừa,
  // khối giấy xa (2.6) mờ hẳn — đó là chiều sâu của cảnh.
  scene.fog = new THREE.Fog('#2a2350', 1.00, 3.60);
  // Đèn chính: bóng của nó chỉ với tầm hẹp quanh chỗ hai sợi chạm nhau. Bóng rộng
  // là nơi sinh ra những mảng đen hình dấu hỏi, hình đầu người — chúng không
  // thuộc vật nào trong khung.
  const key = keyLight(scene, {
    from: new THREE.Vector3(.45, 1.7, 1.5), to: new THREE.Vector3(0, 0, 0),
    color: '#ffe9c8', intensity: 1.75, size: .72,
  });
  const amb = ambience(scene, { sky: '#6f67b2', ground: '#3b3059', fill: .72, rim: '#b79bff', rimI: .80, rimFrom: [-2, 1.6, -1.6] });
  // Vùng sáng nhỏ quanh chỗ hai sợi chạm nhau: chỗ có móc nối phải là thứ **sáng
  // nhất** trong khung. Vệt sáng này không đổ bóng — bóng cứng của đèn tụ sinh
  // những mảng đa giác đen trên sợi, đúng thứ người xem không tin.
  const spot = pool(scene, {
    from: new THREE.Vector3(-.06, .56, 1.05), to: new THREE.Vector3(0, 0, .14),
    color: '#fff0d2', intensity: 1.15, angle: .52, penumbra: .95,
  });
  spot.castShadow = false;

  const rnd = mulberry(11);

  // ── lớp 1: khối giấy ở xa ──
  // Mặt cong có gợn, không phải một tấm bảng: gợn là chỗ có **vết mực**, và bóng
  // đổ trên gợn là chỗ có chiều sâu.
  const backTex = canvasTex(512, 512, (g, W, H) => {
    g.fillStyle = '#3a2c66'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 2400; i++) {
      g.fillStyle = `rgba(${20 + rnd() * 40 | 0},${16 + rnd() * 30 | 0},${50 + rnd() * 60 | 0},${.04 + rnd() * .16})`;
      g.fillRect(rnd() * W, rnd() * H, 2 + rnd() * 9, 1 + rnd() * 3);
    }
    for (let i = 0; i < 220; i++) {          // vết bột giấy chạy chéo
      g.strokeStyle = `rgba(${170 + rnd() * 60 | 0},${150 + rnd() * 50 | 0},${200 + rnd() * 40 | 0},${.05 + rnd() * .12})`;
      g.lineWidth = .8 + rnd() * 2.2;
      const x = rnd() * W, y = rnd() * H, a = rnd() * Math.PI, L = 20 + rnd() * 120;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
    }
  });
  const back = mesh(surface(64, 44, (u, v) => {
    const x = (u - .5) * 7.6, y = (v - .5) * 5.4;
    const z = .26 * Math.sin(x * 1.55 + .7) * Math.cos(y * 1.15)
      + .13 * Math.sin(x * 3.1 - y * .85)
      + .075 * Math.sin((x + y) * 6.4)
      + .045 * Math.cos(x * 9.9 + y * 4.3);
    return [x, y, z];
  }), toon('#ffffff', { map: backTex }), [0, 0, -1.65], { cast: false, recv: false });
  scene.add(back);
  // Cụm bột giấy lơ lửng trước khối giấy: là **thể khối** (không phải hình tròn
  // phẳng), nên chúng có nét mực và có bóng của chính mình.
  for (let i = 0; i < 26; i++) {
    const s = .07 + rnd() * .17;
    const m = mesh(new THREE.SphereGeometry(s, 12, 9), toon(rnd() > .5 ? '#4d3b80' : '#33265c'),
      [(rnd() - .5) * 6.2, (rnd() - .5) * 4.4, -1.42 + rnd() * .30], { cast: false, recv: false });
    m.scale.set(1, .62 + rnd() * .5, .55 + rnd() * .35);
    scene.add(m);
  }

  // ── lớp 2: mạng sợi ở đằng sau ──
  // Sợi nền là nền: nó **không đổ bóng và không nhận bóng**. Sợi mảnh tự đổ bóng
  // lên chính nó thì cả sợi thành một vệt đen, đọc ra như sợi cháy.
  const field = [];
  const cNear = new THREE.Color('#b8934f'), cFar = new THREE.Color('#5e462c');
  for (let i = 0; i < 30; i++) {
    const x = (rnd() - .5) * 2.30, y = (rnd() - .5) * 1.70;
    const ang = (rnd() - .5) * 1.9, len = .34 + rnd() * .40;
    const z = -.32 - rnd() * .78;
    const col = cFar.clone().lerp(cNear, clamp((z + 1.10) / .78));
    const f = fibre({ len, wid: .024 + rnd() * .009, color: '#' + col.getHexString(), seed: i * 7 + 3, groups: 5 });
    f.rotation.set(-Math.PI / 2, 0, ang);
    f.position.set(x, y, z);
    f.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
    scene.add(f);
    field.push({ x, y, ang, len, f });
  }

  // ── lớp 3: sợi tiền cảnh ──
  // Sợi phải **to** (người xem phải thấy mặt sợi, không phải một sợi chỉ) và phải
  // **cắt ngang khung** (không phải một sợi ngắn nằm giữa chỗ).
  const hero = [];
  const mkHero = (x, y, z, ang, len, wid, seed) => {
    const f = fibre({ len, wid, color: '#d8b273', seed, groups: 9 });
    f.rotation.set(-Math.PI / 2, 0, ang);
    f.position.set(x, y, z);
    f.userData.x0 = x; f.userData.y0 = y;
    scene.add(f);
    hero.push({ x, y, ang, len, f });
    return f;
  };
  // Hai sợi tiền cảnh **nằm song song**, cách nhau một khe hở nhỏ: nhóm
  // hydroxyl mọc trên mặt trên của sợi dưới và mặt dưới của sợi trên thì **đối
  // diện nhau**, nên móc liên kết hydrogen bắc ngang khe ấy, hai đầu cắm vào
  // hai sợi. Nếu hai sợi cắt chéo thì chúng chồng lên nhau và móc biến mất
  // trong khối sợi — người xem không thấy được móc nào nối sợi nào với sợi nào.
  const fA = mkHero(0, -.030, .120, .05, .72, .052, 5);      // sợi dưới: nằm ngang
  const fB = mkHero(.01, .038, .140, -.045, .64, .048, 11);   // sợi trên: song song, khe hở .068
  const fC = mkHero(-.15, .004, .152, .58, .58, .042, 17);   // sợi cắt chéo, đan qua hai sợi kia

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
  for (let i = 0; i < field.length && made < 9; i++) {
    for (let j = i + 1; j < field.length && made < 9; j++) {
      const p = cross(field[i], field[j]);
      if (p && Math.abs(p.x) < .9 && Math.abs(p.y) < .7) { addBond(p, .0048); made++; }
    }
  }
  // móc lớn ở chỗ các sợi tiền cảnh chạm nhau
  // Móc **vàng** của hai sợi tiền cảnh: nó là một cái kẹp cong bắc ngang khe,
  // hai đầu cắm vào mặt trên của sợi dưới và mặt dưới của sợi trên, bụng móc
  // nhô về phía máy. Xoay nghiêng để **trục của móc đứng thẳng** — nhìn thẳng
  // vào, người xem thấy một cái móc mở về phía mình, không phải một vệt vàng
  // nằm ngang dán trên sợi.
  const heroBonds = [];
  const pAB = { x: .020, y: .004, z: .146 };       // chỗ hai sợi tiền cảnh chạm nhau
  const addHeroBond = (x, r, y = .004) => {
    const b = bond({ r });
    b.rotation.z = Math.PI / 3;                    // trục móc đứng: hai đầu ở trên và dưới
    b.position.set(x, y, .170);
    scene.add(b);
    heroBonds.push(b);
    return b;
  };
  addHeroBond(pAB.x, .0105);

  // Theo dõi lúc nước tới: móc ở chỗ hai sợi chạm nhau chuyển từ vàng sang xanh.
  let wet = 0;
  for (const b of bonds) {
    if (typeof b.setWet !== 'function') continue;
    const orig = b.setWet.bind(b);
    b.setWet = k => { orig(k); wet = clamp(k); };
  }

  // ── nước: các phân tử bay vào và chen vào đúng chỗ các nhóm hydroxyl ──
  const molecules = [];
  // Các phân tử còn lại tới những chỗ **trên chính ba sợi tiền cảnh**, quanh chỗ
  // hai sợi chạm nhau — nơi máy đang nhìn. Nếu chúng tới chỗ xa trong mạng
  // nền thì người xem thấy nước bay vào một nơi vô nghĩa.
  const targets = [];
  for (const h of hero) {
    for (const o of [-.17, .15]) {
      targets.push(new THREE.Vector3(
        h.x + Math.cos(h.ang) * o,
        h.y + Math.sin(h.ang) * o,
        h.f.position.z + .035));
    }
  }
  // Hai phân tử đầu **dính vào nhau** bằng một móc **xanh lam** (dòng 14): nước
  // cũng tạo ra liên kết hydrogen, nhưng là liên kết **với nước**, nên nó phải
  // khác màu với móc vàng giữa hai sợi, và nó không đổi màu.
  const waterHook = bond({ r: .0095, color: '#5aa9ff' });
  waterHook.position.set(.016, .010, .176);
  waterHook.visible = false;
  scene.add(waterHook);
  // Hai phân tử đầu **chen vào đúng chỗ hai sợi tiền cảnh chạm nhau** — chỗ
  // có móc vàng. Nước phải tới đúng nơi móc đang giữ hai sợi, chứ không phải
  // tới một chỗ bất kỳ nào trong mạng: người xem thấy nước phá đúng móc đó.
  const waterPair = [
    new THREE.Vector3(-.014, .006, .176),
    new THREE.Vector3(.046, .014, .176),
  ];
  for (let i = 0; i < 8; i++) {
    const m = waterMolecule({ R: .0068 });
    const tg = i < 2 ? waterPair[i].clone()
      : (targets[i] ? targets[i].clone() : new THREE.Vector3((i - 4) * .12, (i % 3 - 1) * .1, .15));
    const from = new THREE.Vector3(-1.05 - i * .06, tg.y + .04, tg.z);
    m.position.copy(from);
    m.userData.from = from;
    m.visible = false;
    // Phân tử bay thì **không đổ bóng**: bóng của nó quét ngang mạng sợi là một
    // vệt đen không thuộc vật nào.
    m.traverse(o => { if (o.isMesh) o.castShadow = false; });
    scene.add(m);
    molecules.push({ m, tg });
  }

  // ── lớp nước ép giữa hai sợi đang chạm ──
  // Nói "nước nằm giữa hai sợi" mà không có lớp nước nào ở giữa thì lời kể rỗng.
  // Đây là một mảnh mỏng, mềm, bám đúng chỗ tiếp xúc, ở trước hai sợi.
  const filmMat = toon('#cdeeff', {
    transparent: true, opacity: 0, depthWrite: false,
    emissive: new THREE.Color('#2d6f96'), emissiveIntensity: .45,
  });
  const film = mesh(surface(28, 8, (u, v) => {
    const a = u * Math.PI * 2, r = v;
    const rx = .036 * r * (1 + .16 * Math.sin(3 * a)), ry = .013 * r;
    return [Math.cos(a) * rx, Math.sin(a) * ry, .005 * r * r];
  }), filmMat, [0, 0, 0], { cast: false, recv: false });
  if (pAB) film.position.set(pAB.x, pAB.y, pAB.z + .019);
  scene.add(film);

  // ── móc lỏng ở mép khe hở ──
  // Khi hai sợi trượt ra, móc ở chỗ chạm cũ bị kéo theo một sợi: nó phải **lộ
  // ra ở mép**, chứ biến mất thì người xem không thấy sợi đã tách ra.
  const loose = bond({ r: .0060, color: '#e8cf8a' });
  loose.scale.setScalar(.85);
  loose.visible = false;
  if (pAB) loose.position.set(pAB.x, pAB.y - .010, pAB.z + .014);
  scene.add(loose);

  // ── vệt nứt: khe tối giữa hai sợi đã trượt ra, lan dọc theo sợi ──
  const cr = crack({ len: .30, w: .020, seed: 9 });
  cr.rotation.z = -Math.PI / 2;                     // nứt lan ngang, theo sợi
  if (pAB) cr.position.set(pAB.x, pAB.y - .004, pAB.z + .030);
  cr.scale.y = 0;
  scene.add(cr);

  // ── mặt cắt của tờ giấy: lúc máy lui ra, mép cắt phủ dần vào khung ──
  // Nó đứng **bên phải** khung rồi quét sang trái: người xem thấy mép cắt
  // thẳng của tờ giấy, ở đó các đầu sợi chìa ra xếp chồng, phủ dần lên mạng
  // sợi — máy quay đang lui ra khỏi tờ giấy. Thân tờ giấy được đẩy sang phải
  // để **mép cắt nằm ở giữa khung**, nơi các đầu sợi phải đọc ra.
  const edge = new THREE.Group();                    // nhóm ngoài: phần diễn dời nó
  const edgeBody = paperEdge({ w: 3.0, h: 1.2, seed: 6 });
  edgeBody.position.x = 1.30;
  edge.add(edgeBody);
  edge.position.set(3.40, .42, .45);
  // Nó không đổ bóng: một mặt phẳng to che luôn làm mạng sợi tối đi.
  edge.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
  scene.add(edge);

  // Những gì không do set.js dựng (bàn tay của phần diễn) — ta ghi lại để biết
  // đâu là vật của mình và đâu là vật lạ.
  const mine = new Set();
  scene.traverse(o => mine.add(o));

  // Tay trong thế giới sợi phải đọc ra là **bàn tay**, không phải một mảng hồng
  // phẳng. Lòng bàn tay quay thẳng về máy thì ta xoay nó sang góc ba phần tư:
  // ngón chỉ sang phải, lòng bàn tay úp xuống, các ngón cong xuống gặp sợi.
  const HAND_Q = quatFromAxes([.85, -.20, .49], [0, 1, 0]);

  const update = () => {
    // Lớp nước ở chỗ tiếp xúc chỉ hiện khi nước đã tới chỗ đó.
    filmMat.opacity = .55 * wet;
    film.visible = wet > .02;
    // Móc lỏng ở mép khe hở: hai sợi trượt ra xa nhau thì móc cũ bị kéo theo.
    const gap = pAB ? clamp((fA.userData.y0 - fA.position.y) / .022) : 0;
    loose.visible = gap > .12;
    if (loose.visible) {
      loose.position.set(pAB.x + .012 * gap, pAB.y - .028 * gap - .008, pAB.z + .014);
      loose.rotation.z = -.38 * gap;
      loose.scale.setScalar(.88 - .32 * gap);
    }
    // Bàn tay của phần diễn: chỉ sửa khi lòng bàn tay đang quay thẳng về máy.
    // Bàn tay là vật duy nhất trong cảnh này có **hàng chục mảnh nhỏ** (ngón,
    // đốt, móng) — đó là cách ta nhận ra nó mà không đụng vào vật khác.
    for (const c of scene.children) {
      if (mine.has(c) || !c.children || !c.children.length) continue;
      let parts = 0;
      c.traverse(o => { if (o.isMesh) parts++; });
      if (parts < 12) continue;
      const palm = new THREE.Vector3(0, -1, 0).applyQuaternion(c.quaternion);
      if (Math.abs(palm.z) > .70) c.quaternion.copy(HAND_Q);
    }
  };

  return {
    focus: new THREE.Vector3(0, 0, .14), key, amb, update,
    props: { field, hero, fA, fB, fC, bonds, heroBonds, molecules, waterHook, crack: cr, edge, film, loose },
  };
}

// ── N3: bàn đo ban đêm ───────────────────────────────────────────────────
// Bộ đo kéo: một đầu dải giấy kẹp trong kẹp, dải giấy treo xuống, đầu kia buộc
// vào **vòng treo trên** của lực kế. Tay nắm lực kế và kéo **xuống**: dải giấy
// căng dần, kim chạy theo, và dải giấy đứt ở lực đó.
export function buildDesk(scene) {
  const S = desk(scene, { time: 'night' });
  const F = S.focus;                                   // (.05, 0, .85)
  noShaft(scene);                        // cửa sổ không hắt tia sáng lên bàn

  // Đây là **bàn đo ban đêm**: cửa sổ chỉ còn một vệt sáng mờ, đèn bàn là nguồn
  // sáng chính. Rig đặt lại cường độ đèn cửa sổ mỗi khung, nên ta đặt lại sau nó.
  S.key.castShadow = false;              // không có bóng cửa sổ đè lên mặt thang
  const baseUpdate = S.update;
  S.update = (t, o = {}) => {
    baseUpdate(t, o);
    S.key.intensity = .18;               // cửa sổ tắt gần hết
  };

  // Đèn bàn của rig đứng bên trái nên ánh sáng hắt vào giữa bàn, không vào mặt
  // thang. Ta dời **cả đèn** về phía trước bàn, đối diện với các mặt thang:
  // mặt thang quay về máy thì phải **được chiếu từ phía máy**, và bóng của dải
  // giấy phải rơi ra sau chứ không nằm ngang trên mặt thang.
  let lampBody = null;
  scene.traverse(o => {
    if (!lampBody && o.isMesh && o.geometry && o.geometry.type === 'ConeGeometry') lampBody = o.parent.parent;
  });
  if (lampBody) {
    lampBody.position.set(-.95, 0, 1.28);
    scene.updateMatrixWorld(true);
    const shade = lampBody.children.find(c => c.isGroup) || lampBody;
    const bulb = shade.children.find(c => c.isMesh && c.geometry && c.geometry.type === 'SphereGeometry');
    if (bulb) {
      S.lamp.position.copy(bulb.getWorldPosition(new THREE.Vector3()));
      S.lamp.target.position.set(-.15, .25, .92);
      S.lamp.target.updateMatrixWorld();
      S.lamp.angle = .78;                 // vùng sáng phải với tới cả hai mặt thang
      S.lamp.intensity = 1.90;           // đèn bàn không được làm cháy mặt thang
    }
  }

  // Trục bàn đo: kẹp ở trên, dải giấy treo xuống, lực kế ở dưới — tất cả trên
  // một đường thẳng đứng, vì dải giấy phải **móc vào vòng treo của lực kế**.
  const AX = -.175, AZ = .94;
  const strip = paperStrip({ len: .19, wid: .028, seed: 7 });
  strip.rotation.set(0, Math.PI / 2, Math.PI / 2);   // dải đứng, mặt về phía máy
  strip.position.set(AX, .39, AZ);
  scene.add(strip);

  // bộ kẹp giấy: hai bản hàm ngập vào nhau, kẹp đầu trên của dải giấy
  const clamp = paperClamp({});
  clamp.position.set(AX, .50, AZ);
  clamp.rotation.z = Math.PI / 2;                     // kẹp một dải giấy đứng
  scene.add(clamp);

  // giá đo: đế nặng và cột đứng, vạt ngang ở trên để treo kẹp giấy. Cột đứng
  // lùi sang trái cho xa, không cắt ngang mặt thang lực kế.
  const stand = gaugeStand({ H: .55, color: '#4a5064' });
  stand.position.set(AX - .155, 0, AZ);
  stand.rotation.y = Math.PI / 2;                     // vạt ngang chìa về +x
  scene.add(stand);

  // lực kế: treo ở đầu dưới dải giấy, mặt thang **xoay về phía máy quay**
  // (các máy của bàn đo đứng bên phải bộ đo).
  const gauge = dynamometer({ R: .058 });
  gauge.position.set(AX, .235, AZ);
  gauge.rotation.set(-.14, .26, 0);     // nghiêng nhẹ lên, xoay về phía máy
  scene.add(gauge);
  // Vòng treo: đẩy lên cho tách khỏi vỏ lực kế và đặt đúng chỗ móc dải giấy
  // cắm vào — dải giấy phải **treo trên vòng**, không nằm trên vỏ.
  const ring = topRing(gauge);
  if (ring) {
    ring.scale.setScalar(1.25);
    const want = new THREE.Vector3(AX, .316, AZ);
    gauge.updateMatrixWorld(true);
    ring.position.copy(gauge.worldToLocal(want.clone()));
    ring.rotation.set(0, .35, 0);
  }

  // thước kẻ vạch: đứng thẳng, **cao hơn dải giấy**, mặt vạch về phía máy để
  // độ giãn của dải giấy có chỗ để đọc. Không nghiêng: nghiêng thì vạch méo.
  const scale = ruler({ len: .56, wid: .028 });
  scale.position.set(AX + .047, .28, AZ - .04);
  scale.rotation.set(0, 0, 0);
  const inner = scale.children.find(c => c.isGroup);
  if (inner) inner.rotation.set(0, 0, 0);
  scene.add(scale);

  // đồng hồ độ ẩm: đứng cạnh trên mặt bàn, **mặt thang quay về máy quay**, và
  // đặt **gần lực kế** — hai mặt thang phải cùng nằm trong một khung, vì câu 29
  // nói về cả hai cùng lúc (độ ẩm 90 % và lực kéo 6,6 newton).
  const hygro = hygrometer({ R: .042 });
  hygro.position.set(-.012, .060, 1.08);
  hygro.rotation.y = .10;
  scene.add(hygro);

  // bát nước và khăn lau: **không thuộc bộ đo**. Chúng nằm ở góc phải sau
  // xa của bàn, chỗ chúng vẫn đọc ra là bát nước, còn giữa bàn là bộ thiết bị
  // đo. Khăn là **con của bát**, nên khi tay nâng bát thì khăn đi theo.
  const bowl = waterBowl({ R: .095 });
  bowl.position.set(1.05, 0, 1.25);
  scene.add(bowl);
  const towel = dishTowel({ w: .15, drop: .06, color: PAL.red });
  towel.position.set(-.045, bowl.H + .004, .03);
  towel.rotation.y = .5;
  bowl.add(towel);

  // dòng nước rót: bắt đầu ở **miệng bát** và rơi xuống dải giấy. Đường đi
  // được tính lại mỗi khung theo chỗ bát đang nghiêng (xem update bên dưới).
  const dip = new THREE.Vector3(AX, .330, AZ + .012);
  const pour = flow(new THREE.Vector3(AX + .04, .360, AZ + .10), dip,
    { color: '#a8e9ff', size: .007, n: 70, rate: .9, opacity: .45 });
  pour.visible = false;
  scene.add(pour);

  // mẻ giấy khăn và túi giấy bao bị: hai vật **của ngành** — loại giấy có
  // nhựa. Dấu hiệu nhìn thấy được là các móc nối hồng ở mép cắt của giấy khăn.
  // Chúng đứng thành một cụm ở phía trước bên phải, trong vùng sáng.
  const tissue = tissueStack({ n: 6, w: .13, d: .10 });
  tissue.position.set(.56, 0, .82);
  tissue.rotation.y = .2;
  scene.add(tissue);
  // Túi giấy bao bì phải **nằm phẳng** trên bàn: đứng lên nó đọc thành một
  // khối gỗ, và người xem không tin đó là túi giấy.
  const bag = paperBag({ w: .12, h: .15, d: .05 });
  bag.position.set(.68, .004, .90);
  bag.rotation.set(-Math.PI / 2, 0, .55);
  scene.add(bag);

  // góc giấy khăn giấy bị cắt: ở mép cắt lộ ra các móc nối màu hồng — mối nối
  // bằng nhựa, nước không phá được
  const corner = cutCorner({ w: .090, h: .090, seed: 3 });
  corner.position.set(.45, .001, .71);
  corner.rotation.set(-Math.PI / 2, 0, .5);
  scene.add(corner);

  // tờ giấy đã qua nước rồi sấy: nhăn dày, vệt ẩm còn hằn — cạnh một tờ
  // giấy khô khó phẳng, để so sánh thấy
  const dried = paperSheet({ w: .21, h: .28, seed: 9, wrinkle: 2.4 });
  dried.position.set(.35, 0, .57);
  dried.rotation.y = -.2;
  dried.setWet(.45);
  scene.add(dried);
  const fresh = paperSheet({ w: .21, h: .28, seed: 13 });
  fresh.position.set(.52, 0, .55);
  fresh.rotation.y = .14;
  scene.add(fresh);

  // Vệt sáng phụ ở góc túi giấy: túi nằm ngoài vùng đèn bàn, mà không có vệt
  // sáng này thì nó đọc như một khối tối, không phải giấy. Vệt sáng phụ **không
  // đổ bóng** — bóng cứng của nó là những mảng tối phẳng đè lên mặt thang.
  const fillBag = pool(scene, {
    from: new THREE.Vector3(.86, .92, 1.30),
    to: new THREE.Vector3(.66, .05, .88),
    color: '#ffe6c4', intensity: .80, angle: .46,
  });
  fillBag.castShadow = false;

  // Vệt sáng phụ ở bộ kẹp: đèn bàn của rig hắt vào giữa bàn, còn bộ đo nằm bên
  // trái; không có vệt này thì mặt thang đồng hồ là nền tối và người xem không
  // đọc được số.
  const fillClamp = pool(scene, {
    from: new THREE.Vector3(AX - .34, 1.05, AZ + .62),
    to: new THREE.Vector3(AX, .30, AZ),
    color: '#ffe6c4', intensity: .70, angle: .56,
  });
  // Vệt sáng phụ ở đồng hồ độ ẩm: nó đứng cạnh lực kế, cùng một vùng sáng.
  const fillHygro = pool(scene, {
    from: new THREE.Vector3(-.30, .72, 1.52),
    to: new THREE.Vector3(-.012, .09, 1.17),
    color: '#ffe6c4', intensity: .55, angle: .40,
  });
  fillHygro.castShadow = false;
  fillClamp.castShadow = false;

  const update = (t, o = {}) => {
    S.update(t, o);                       // rig dựng khung, rồi ta tắt cửa sổ
    // Dòng nước bám theo miệng bát: bát được nâng lên rồi nghiêng, nước phải
    // chảy **từ miệng bát** xuống dải giấy, không phải từ một chỗ cố định.
    const mouth = new THREE.Vector3(0, bowl.H + .014, 0).applyQuaternion(bowl.quaternion).add(bowl.position);
    const to = dip.clone();
    to.y = Math.min(dip.y, mouth.y - .022);
    pour.curve.v0.copy(mouth);
    pour.curve.v2.copy(to);
    pour.curve.v1.copy(mouth).add(to).multiplyScalar(.5);
    pour.curve.v1.y += Math.max(.02, mouth.distanceTo(to) * .30);
  };

  return {
    ...S,
    update,
    props: { stand, clamp, strip, gauge, hygro, scale, bowl, towel, pour, tissue, corner, bag, dried, fresh },
    // chỗ tay nắm lực kế (kéo xuống) và chỗ bát nước được nâng lên rót
    grip: new THREE.Vector3(AX, .235, AZ),
    bowlHome: new THREE.Vector3(1.05, 0, 1.25),
    dip,
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
