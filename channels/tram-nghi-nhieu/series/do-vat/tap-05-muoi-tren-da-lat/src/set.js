// set.js — năm cảnh của tập 05.
//
//   K   bếp buổi sáng   : khay inox, viên đá có muối, viên đá đối chứng, hộp đá,
//                         túi muối, hộp muối, chiếc búa, hai ly có que nhiệt kế,
//                         bát toàn đá và túi zip sữa.
//   K2  bếp buổi chiều : đúng cái bếp đó, đúng chỗ đó, ánh sáng đã ngả sang chiều.
//   L   bàn thí nghiệm : bể đá muối, bốn bình thuỷ tinh, ba que nhiệt kế, que khuấy.
//   P   trong vũng nước: mảnh đá nhỏ, các ion lơ lửng, hạt muối rơi, dòng nhiệt.
//   N   mặt đá ở nano : mặt phẳng tinh thể, phân tử nước, vệt muối, lớp nước mỏng.
//
// Mỗi bộ trả về { …set, props, focus, cams, key } và đặt sẵn vật của tập vào
// đúng chỗ của nó, để film.js chỉ lo chuyển động và máy quay.
import * as THREE from 'three';
import { toon, mesh, rbox, canvasTex, PAL, clamp, lerp, ss, mulberry, fxLayer, glowMat } from '../../../../rig/kit.js';
import { keyLight, ambience, pool, beam } from '../../../../rig/lights.js';
import { kitchen, desk } from '../../../../rig/sets.js';
import { buildHand, glowDots, setDot, squiggle } from '../../../../rig/fx.js';
import {
  iceCube, puddle, steelTray, saltTin, saltBag, iceBox, hammer, thermo, tumbler,
  stirRod, beaker, iceBath, bowlOfIce, zipBag, iceFace, molecules, ions, saltGrain,
  saltPatch, frostPatch, meltStream, hydrate, saltDish, saltFall, molCluster,
} from './props.js';

// Tia sáng hình nón mà rig dựng sẵn chạy ngang qua mặt quầy, và mọi cận
// cảnh của tập này đều nằm trong thể tích đó: máy quay ở trong tia sáng,
// nên tia sáng thành một vệt kem phủ lên cả khung. Tắt đúng tia sáng —
// vật đập nền của tập là vật thật trên quầy, không phải vệt sáng.
function noShaft(scene) {
  scene.traverse(o => {
    const u = o.material && o.material.uniforms;
    if (o.isMesh && u && u.uCol && u.uA) o.visible = false;
  });
}

// ── chỗ đứng của vật ở bếp ───────────────────────────────────────────────
// Một bảng cho cả buổi sáng và buổi chiều: không vật nào đổi chỗ giữa
// khung mở và khung cuối. Túi muối là ngoại lệ duy nhất, và nó đổi chỗ
// **có lý do**: tay đặt nó xuống cạnh hộp muối ở cảnh cuối.
export const KL = {
  tray: [-.70, .80],     // khay inox
  salt: [-.88, .74],     // viên đá có muối
  ctrl: [-.54, .74],     // viên đá đối chứng
  puddle: [-.88, .74],   // vũng nước quanh viên đá có muối
  thPud: [-.99, .83],    // que nhiệt kế cắm trong vũng
  tin: [-.16, 1.02],     // hộp muối
  // chiếc búa nằm **trong khay, ngay giữa hai viên đá** — nó phải đứng cạnh
  // viên đá chứ không phải "bên kia mặt bàn" (vòng chấm 1 bắt lỗi này: búa
  // cách viên đá đối chứng 0,595 m, nên cảnh c4 không có viên đá nào trong khung)
  hammer: [-.68, .95],
  glassA: [.14, .78],    // ly nước sạch + que nhiệt kế
  glassB: [.32, .78],    // ly nước muối + que nhiệt kế
  iceBox: [-1.52, .32],  // hộp đá
  bagBack: [-1.16, .22], // túi muối, lúc đầu nằm ở hậu cảnh
  bagFront: [.06, 1.12], // túi muối, cuối phim nằm cạnh hộp muối
  bowl: [-1.46, 1.06],   // bát toàn đá (kem tuyết)
};

// ── K / K2: bếp ──────────────────────────────────────────────────────────
// time: 'morning' cho khung mở, 'evening' cho khung cuối.
// bagAt: 'back' (hậu cảnh) hoặc 'front' (đã đặt xuống cạnh hộp muối).
export function buildKitchen(scene, { time = 'morning', bagAt = 'back' } = {}) {
  const S = kitchen(scene, { time });
  noShaft(scene);
  const F = S.focus;                                   // (-.7, 0, .8)
  // Buổi chiều: key của rig là hổ phách rất bão hoà, quầy bếp ửng đỏ-magenta
  // và tường tím đậm (vòng chấm hình ảnh 2 ở c23). Hạ bão hoà một nửa và nâng
  // fill lên cho tường không bị tím đặc.
  if (time === 'evening') {
    S.key.color.set('#f2c9a2');
    S.amb.hemi.intensity = .74;
    S.amb.rim.intensity = .55;
    // nêm sáng riêng cho túi sữa trong bát đá (c24): không có nó, túi sữa
    // chìm trong bóng tím của buổi chiều, và vùng sáng nhất của khung là
    // vệt nắng trên mặt bàn chứ không phải chủ thể (vòng chấm hình ảnh 3
    // ở c24: "mắt không dẫn vào chủ thể").
    pool(scene, {
      from: new THREE.Vector3(KL.bowl[0] - .12, .92, KL.bowl[1] + .46),
      to: new THREE.Vector3(KL.bowl[0], .10, KL.bowl[1]),
      color: '#ffe9c4', intensity: 2.6, angle: .46,
    });
  }

  // khay inox: đáy ở y = 0, thành cao .055
  const tray = steelTray({ w: .78, d: .52, h: .055 });
  tray.position.set(KL.tray[0], 0, KL.tray[1]);
  scene.add(tray);

  // hai viên đá trong khay: một có muối, một đối chứng
  const iceSalt = iceCube({ s: .15, seed: 7, shadow: true });
  iceSalt.position.set(KL.salt[0], .012, KL.salt[1]);
  scene.add(iceSalt);
  const iceCtrl = iceCube({ s: .15, seed: 21, shadow: true });
  iceCtrl.position.set(KL.ctrl[0], .012, KL.ctrl[1]);
  scene.add(iceCtrl);

  // vũng nước quanh viên đá có muối
  const pud = puddle({ R: .15 });
  pud.position.set(KL.puddle[0], .014, KL.puddle[1]);
  pud.scale.set(1.25, 1, 1);              // vũng loang, không phải hình tròn
  scene.add(pud);

  // vệt muối trên mặt viên đá có muối (tan dần ở c10)
  const patch = saltPatch({ w: .075, d: .062 });
  patch.position.set(KL.salt[0], .164, KL.salt[1]);
  scene.add(patch);
  // lớp băng mờ trên mặt viên đá đối chứng (mọc dần ở c7)
  const frost = frostPatch({ s: .115 });
  frost.position.set(KL.ctrl[0], .164, KL.ctrl[1]);
  scene.add(frost);
  // Giọt nước mủng rơi từ mặt viên đá có muối xuống vũng (c5). Nó là **con
  // của chính khối đá**, nên nó bám đúng mặt trước và xoay theo khối khi
  // khối xoay, và nó nhỏ lại theo khi viên đá tan.
  const stream = meltStream({ len: .15 });
  stream.position.set(.079, .075, 0);           // trong không gian của khối đá
  iceSalt.userData.cube.add(stream);

  // que nhiệt kế trong vũng nước: thang thô, để cú tụt của cột đỏ ở c18
  // nhìn thấy được (6 mm mỗi độ)
  const thPud = thermo({ h: .3, zero: .55, perDeg: .006 });
  thPud.position.set(KL.thPud[0], .016, KL.thPud[1]);
  thPud.rotation.z = -.10;
  scene.add(thPud);

  // hộp muối: nguồn của muối trong khung mở
  const tin = saltTin({ w: .17, d: .17, h: .07, seed: 5 });
  tin.position.set(KL.tin[0], 0, KL.tin[1]);
  tin.rotation.y = .22;
  scene.add(tin);

  // túi muối
  const bag = saltBag({ w: .16, h: .2, d: .07 });
  const bp = bagAt === 'front' ? KL.bagFront : KL.bagBack;
  bag.position.set(bp[0], 0, bp[1]);
  bag.rotation.y = bagAt === 'front' ? -.5 : .3;
  scene.add(bag);

  // hộp đá: viên đá vốn ở dưới không độ
  const box = iceBox({ w: .3, h: .19, d: .22, seed: 13 });
  box.position.set(KL.iceBox[0], 0, KL.iceBox[1]);
  box.rotation.y = .18;
  scene.add(box);

  // chiếc búa: đặt yên từ khung mở, không ai cầm. Đầu búa chĩa về phía
  // viên đá có muối, để "muối phá vỡ đá như búa" là một hình, không một lời.
  const ham = hammer({ len: .3 });
  ham.position.set(KL.hammer[0], .028, KL.hammer[1]);
  ham.rotation.y = 2.6;
  scene.add(ham);

  // bộ đo ở bếp: một ly nước sạch, một ly nước muối, mỗi ly một que nhiệt kế
  const glassA = tumbler({ h: .16, r: .045 });
  glassA.position.set(KL.glassA[0], 0, KL.glassA[1]);
  scene.add(glassA);
  const glassB = tumbler({ h: .16, r: .045 });
  glassB.position.set(KL.glassB[0], 0, KL.glassB[1]);
  scene.add(glassB);
  // que nhiệt kế ngắn hơn (22 cm) để cả ly và cả cột đỏ cùng lọt trong một khung
  const thA = thermo({ h: .3, zero: .55, perDeg: .006 });
  thA.position.set(KL.glassA[0], .012, KL.glassA[1]);
  scene.add(thA);
  const thB = thermo({ h: .3, zero: .55, perDeg: .006 });
  // que nhiệt kế lệch về phía trước 2,2 cm so với que khuấy: hai cái cùng
  // một bình mà đứng chồng lên nhau thì cột đỏ biến mất sau que trắng
  thB.position.set(KL.glassB[0], .012, KL.glassB[1] - .022);
  scene.add(thB);
  // ly nước muối: que khuấy và vệt muối tan trên mặt nước (c6) — không có
  // hai cái này thì nhát c6 chỉ có hai que nhiệt kế và không ai tác động gì
  const rodB = stirRod({ len: .22 });
  rodB.position.set(KL.glassB[0], .02, KL.glassB[1]);
  rodB.rotation.z = -.10;
  scene.add(rodB);
  const saltInB = saltPatch({ w: .03, d: .03 });
  saltInB.position.set(KL.glassB[0], .096, KL.glassB[1]);
  scene.add(saltInB);

  // bát toàn đá và túi zip có sữa: làm kem tuyết ở nhà
  const bowl = bowlOfIce({ R: .17, h: .09, seed: 29 });
  bowl.position.set(KL.bowl[0], 0, KL.bowl[1]);
  scene.add(bowl);
  // Túi sữa **nhỏ hơn bát**: một túi cao hơn miệng bát quá nhiều thì đọc ra
  // là một hộp đứng trong bát, không phải túi sữa nằm trong đá (vòng chấm
  // hình ảnh 2 ở c24: "túi đọc ra là hộp carton").
  const zip = zipBag({ w: .13, h: .14, d: .045 });
  zip.position.set(KL.bowl[0], .045, KL.bowl[1]);
  zip.rotation.y = .3;
  scene.add(zip);

  // tay: bóp muối ở c1, rửa muối ở c3, khuấy vào ly ở c6, đặt túi muối ở c23.
  // Cỡ tay **bằng nửa** bàn tay của rig: bàn tay rig dài 55 cm, còn viên đá
  // của tập này cạnh 15 cm — tay nguyên cỡ che hết viên đá và là "ống trụ
  // xanh" giữa khung (vòng chấm hình ảnh 2).
  const hand = buildHand({ skin: '#e3a983', sleeve: '#56688f', size: .5 });
  scene.add(hand);
  const hand2 = buildHand({ skin: '#e3a983', sleeve: '#7a6aa8', size: .5 });
  scene.add(hand2);

  // hạt muối rơi từ tay xuống viên đá (c1): một dòng **tinh thể nhỏ** đi từ
  // trên xuống, không phải hạt bi tròn to
  const fall = saltFall({
    from: [KL.salt[0], .235, KL.salt[1]], to: [KL.salt[0], .168, KL.salt[1]],
    n: 22, size: .010, spread: .045, seed: 83,
  });
  scene.add(fall);
  // hạt muối rơi xuống mép khay (c3): một dòng hạt thứ hai, ở mép trước của khay
  const fallEdge = saltFall({
    from: [-.66, .27, 1.02], to: [-.66, .17, 1.02],
    n: 16, size: .008, spread: .035, seed: 97,
  });
  scene.add(fallEdge);

  // một nêm sáng nhẹ từ phía máy quay: mặt trước của viên đá không chìm trong bóng
  pool(scene, { from: new THREE.Vector3(F.x - .05, 1.05, F.z + 1.30), to: new THREE.Vector3(F.x - .05, .14, F.z), color: '#ffe6c4', intensity: .5, angle: .55 });
  // nêm sáng **riêng cho hai ly**: c6 so sánh hai ly bằng hai cột đỏ, mà góc
  // bếp đó tối tới mức cột đỏ không đọc được (vòng chấm hình ảnh 2: c6 DARK)
  pool(scene, {
    from: new THREE.Vector3(KL.glassB[0] - .16, .92, KL.glassB[1] + .46),
    to: new THREE.Vector3(KL.glassB[0], .12, KL.glassB[1]), color: '#fff2dc', intensity: 1.5, angle: .5,
  });

  return {
    ...S, props: { tray, iceSalt, iceCtrl, pud, patch, frost, stream, thPud, tin, bag, box, ham, glassA, glassB, thA, thB, rodB, saltInB, bowl, zip, hand, hand2, fall, fallEdge },
    focus: F, saltAt: new THREE.Vector3(KL.salt[0], .16, KL.salt[1]),
  };
}

// ── L: bàn thí nghiệm ───────────────────────────────────────────────────
// Bể đá muối làm lạnh cho các bình đo; đèn bàn trắng lạnh rọi xuống bể.
export function buildLab(scene) {
  const S = desk(scene, { time: 'night' });
  noShaft(scene);
  const F = S.focus;                                   // (.05, 0, .85)

  // bể đá muối
  const bath = iceBath({ R: .32, h: .11, seed: 17 });
  bath.position.set(F.x - .38, 0, F.z);
  scene.add(bath);

  // bốn bình thuỷ tinh đứng trong bể, **thành hàng chéo**:
  //   bình 1 nước sạch (đã có lớp băng mỏng ở mặt) · bình 2 nước muối mười phần trăm
  //   · bình 3 nửa đặc · bình 4 đậm
  // Hàng chéo (mỗi bình lệch cả sang phải và ra sau) để máy quay có thể
  // đi vào **một bình** mà không có ba bình kia chồng lên nhau: bốn bình
  // thẳng hàng nhìn từ một góc là bốn cái cột giống hệt nhau (vòng chấm
  // hình ảnh 2 ở c8).
  // Bình cao 18 cm: miệng bình ở y = 22,5 cm, để đầu cột đỏ ở mốc −21 °C
  // (y = 24,8 cm) nằm **trên miệng bình**, chứ không chui trong bình mà
  // không ai đọc được (vòng chấm 1 đã bắt lỗi này).
  const BX = [-.55, -.43, -.31, -.19];
  const BZ = [.66, .73, .80, .87];
  const bk = BX.map((x, i) => {
    // Bình nước sạch đóng cứng **hoàn toàn** → băng của nó là một khối đặc
    // mà nhìn xuyên miệng bình phải thấy (vòng chấm hình ảnh 3 ở c8: "khối
    // băng chỉ là một khối tròn nhạt ở đáy khung"). Ba bình kia có que nhiệt
    // kế nên băng vẫn là lớp bám mỏng để cột đỏ đọc được qua nó.
    const b = beaker({ h: .18, r: .05, solid: i === 0 });
    b.position.set(x, .045, BZ[i]);
    scene.add(b);
    return b;
  });
  // ba que nhiệt kế: ở bình mười phần trăm, bình nửa đặc và bình đậm.
  // Que nhiệt kế phải đứng cao hơn mặt đá vỡ, nếu không cột thủy nghiện bị
  // đá che mất — cột đỏ là thứ phải đọc được trong khung. Thang mịn
  // (3,1 mm mỗi độ) và vạch không độ ở 66 % que.
  const ths = [1, 2, 3].map(i => {
    const t = thermo({ h: .3, zero: .66, perDeg: .0031 });
    // que ở bình mười phần trăm lệch về trước 2 cm cho khỏi chồng lên que khuấy
    t.position.set(BX[i], .115, BZ[i] + (i === 1 ? -.02 : .012));
    scene.add(t);
    return t;
  });
  // vạch mốc **−21 °C** trên que của bình đậm: đầu cột đỏ dừng đúng vạch
  // này ở c21, nên con số trên thẻ được một vạch trên que xác nhận
  // (vòng chấm hình ảnh 2: không có vạch nào ở gần đầu cột). Vạch nằm
  // **dưới** đầu cột một chút để đầu cột vẫn đọc được.
  ths[2].addMark(ths[2].columnY(-21) - .010, PAL.mustard);

  // tinh thể muối hai nước mọc trên thành bình đậm (c22): mọc cao hơn mặt
  // đá vỡ, để máy quay nhìn thấy được chứ không bị đá che mất.
  const hyd = hydrate({ n: 9, seed: 67 });
  hyd.position.set(BX[3], .155, BZ[3]);
  scene.add(hyd);

  // que khuấy trong bình nước muối mười phần trăm
  const rod = stirRod({ len: .26 });
  rod.position.set(BX[1], .075, BZ[1]);
  rod.rotation.z = -.12;
  scene.add(rod);

  // bát muối: tay đặt xuống ở c19. Nó đứng **trước bể**, ở phía phải bàn,
  // để một khung cỡ cận cảnh lấy được cả tô muối đang tan, dải nhiệt chạy
  // vào, và bể đá với các bình ở phía sau (vòng chấm 1: bát muối cũ nằm quá
  // xa, nên nhát c19 không thấy được cơ chế thứ hai). Ở góc cũ, chân đèn
  // bàn đứng ngay giữa khung và che mất một phần tô.
  //
  // Bát là **tô tròn** có đống muối lấp khoảng hai phần ba mặt tô: hộp
  // carton thẳng cạnh đọc ra là hộp carton, không phải bát muối đang tan
  // (vòng chấm hình ảnh 2).
  const dish = saltDish({ R: .085, h: .038, seed: 9 });
  dish.position.set(-.02, 0, .46);
  scene.add(dish);
  // dòng lượn nhiệt chạy vào đống muối (c19): nhiệt là thứ vô hình, nên ở
  // bàn thí nghiệm nó cũng phải là một vật có vật lý
  const dishHeat = squiggle(PAL.orange, PAL.red);
  dishHeat.position.set(-.02, .045, .46);
  dishHeat.rotation.y = .25;           // mặt dải nhiệt quay về phía máy quay
  dishHeat.scale.setScalar(1);
  // dải nhiệt mặc định của rig nhân màu lên 2,2 lần rồi cộng trong suốt:
  // nó **cháy trắng**. Ở bàn thí nghiệm dải nhiệt phải còn màu cam.
  dishHeat.U.uColor.value.set('#ff9a3c').multiplyScalar(1.15);
  dishHeat.U.uColor2.value.set('#ff4d33').multiplyScalar(1.15);
  scene.add(dishHeat);

  // tay: cầm que khuấy ở c9, đặt bát muối ở c19
  const hand = buildHand({ skin: '#e3a983', sleeve: '#56688f', size: .5 });
  scene.add(hand);
  const hand2 = buildHand({ skin: '#e3a983', sleeve: '#7a6aa8', size: .5 });
  scene.add(hand2);

  // đèn bàn: trắng lạnh, rọi vào bể; bàn tối hơn để bình và que nhiệt kế nổi lên
  S.lamp.color.set('#cfe0ff');
  S.lamp.intensity = 3.6;
  S.lamp.angle = .8;
  S.lamp.position.set(-.25, 1.05, .70);
  S.lamp.target.position.set(F.x - .30, .06, F.z);
  S.key.intensity = 2.2;
  S.amb.hemi.intensity = .6;
  // nêm sáng riêng cho tô muối ở c19: tô nằm lệch trái, xa đèn bàn, không có
  // nêm này nó chìm trong bóng và cả tô lẫn đống muối đều tối (vòng chấm
  // hình ảnh 2 ở c19).
  pool(scene, {
    from: new THREE.Vector3(-.02, .95, .68), to: new THREE.Vector3(-.02, .05, .46),
    color: '#ffe9c8', intensity: 1.3, angle: .45,
  });

  return {
    ...S, props: { bath, beakers: bk, ths, rod, dish, dishHeat, hyd, hand, hand2 },
    focus: F, bathAt: new THREE.Vector3(F.x - .38, .05, F.z),
  };
}

// ── P: trong vũng nước quanh viên đá ─────────────────────────────────────
// Không gian bên trong nước: một khối nước trong, các ion lơ lửng, một mảnh
// đá nhỏ đang rã, và hạt muối rơi xuống.
export function buildPuddle(scene) {
  scene.background = canvasTex(64, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#2c5f86'); gr.addColorStop(.55, '#1d4a72'); gr.addColorStop(1, '#123253');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  scene.fog = new THREE.Fog('#1b4368', .9, 2.6);
  const key = keyLight(scene, { from: new THREE.Vector3(.6, 1.6, 1.2), to: new THREE.Vector3(0, 0, 0), color: '#dff0ff', intensity: 2.0, size: 1.4 });
  const amb = ambience(scene, { sky: '#6fb6e8', ground: '#1d3a5c', fill: .8, rim: '#8fd8ff', rimI: 1.0, rimFrom: [-1.6, 1.2, -1.4] });

  // mặt nước: một vũng rộng, máy quay nằm sát mặt nước nên nước trải tới
  // chân trời — đó là cách "vào bên trong vũng nước" mà không mất phương hướng.
  const water = puddle({ R: 1.2 });
  water.setLevel(1);
  scene.add(water);

  // mặt nước **ở trên đầu**: máy quay nằm dưới mặt nước, nên phần trên khung
  // phải là mặt nước lấp loáng chứ không phải một mảng xanh trống đọc như
  // bầu trời (vòng chấm hình ảnh 2 ở c17). Mặt nước ở y = 14 cm: thấp hơn
  // mặt đá (12 cm) vừa đủ để không cắt qua viên đá, nhưng cao hơn hạt muối
  // và đám ion, nên ở c17 máy quay nhìn thấy cả trần nước lấp loáng.
  const surface = mesh(new THREE.PlaneGeometry(3.2, 3.2), toon('#cfeaff', {
    map: canvasTex(256, 256, (g, w, h) => {
      g.fillStyle = '#0e2c4c'; g.fillRect(0, 0, w, h);
      const r = mulberry(71);
      g.strokeStyle = 'rgba(190,235,255,.55)'; g.lineWidth = 3;
      for (let k = 0; k < 26; k++) {
        const y = r() * h;
        g.beginPath();
        for (let x = 0; x <= w; x += 12) g.lineTo(x, y + Math.sin(x * .05 + k) * 7);
        g.stroke();
      }
    }),
    transparent: true, opacity: .5, depthWrite: false, side: THREE.DoubleSide,
  }), [0, .105, 0], { rot: [Math.PI / 2, 0, 0] });
  scene.add(surface);

  // các ion lơ lửng quanh mảnh đá. Chúng phải **nhỏ và gần**: trước đây đám
  // ion toả ra tới 33 cm nên có cầu lọt vào ống kính, thành những quả
  // cầu khổng lồ che mất chủ thể (vòng chấm hình ảnh 2 ở c12).
  const ion = ions({ n: 18, s: .30, seed: 53, band: [.004, .05] });
  ion.scale.setScalar(.45);
  scene.add(ion);

  // hạt phân tử nước trôi quanh: **phân tử thật** (O đỏ + hai H trắng), có
  // viền mực và sắc độ toon. Một đám chấm trắng trơn đọc ra là "quầng sáng
  // cháy trắng", không phải nước (vòng chấm hình ảnh 3 ở c11 và c12).
  const dots = molecules({ n: 20, s: .24, seed: 41, y0: .012, dy: .07 });
  dots.scale.setScalar(1.3);
  scene.add(dots);

  // vài phân tử nước **có hình dạng** (ba quả cầu): một chấm tròn trắng không
  // đọc ra là phân tử (vòng chấm hình ảnh 2 ở c11)
  const mols = [];
  for (let i = 0; i < 7; i++) {
    const m = molCluster({ r: .006 });
    const a = (i / 7) * 6.28 + .4, rad = .07 + (i % 3) * .07;
    m.position.set(Math.cos(a) * rad, .012 + (i % 4) * .022, Math.sin(a) * rad);
    m.rotation.set(i * .7, i * 1.3, i * .4);
    scene.add(m);
    mols.push(m);
  }

  // mảnh đá nhỏ đang rã trong nước (c12)
  const chip = iceCube({ s: .09, seed: 33 });
  scene.add(chip);
  // vệt nước đục quanh mảnh đá: nơi muối tan, nước bị kéo lên đục — nó tách
  // mảnh đá ra khỏi nền, thay vì để mảnh đá trôi lơ lửng (vòng chấm hình
  // ảnh 2 ở c12: mảnh đá phải chiếm khoảng một phần ba bề ngang khung và
  // có một vệt nước đục quanh nó).
  const murk = mesh(new THREE.CircleGeometry(.062, 28),
    toon('#3f7fa6', { transparent: true, opacity: .55, depthWrite: false }), [.02, .003, .02],
    { rot: [-Math.PI / 2, 0, 0] });
  scene.add(murk);

  // hạt muối rơi xuống, vỡ ra (c17) + dòng nhiệt lượn chạy vào hạt đang tan.
  // Hạt nằm ở **rìa đám ion**, không nằm giữa đám: nếu nó nằm giữa thì
  // một cầu ion nổi ngay trước ống kính và che hết cả hạt muối (vòng chấm 1).
  // Hạt phải **to đủ** để thấy được nó vỡ ra ở cận cảnh.
  const grain = saltGrain({ s: .045 });
  grain.position.set(.20, .012, -.10);
  scene.add(grain);
  const heat = squiggle(PAL.orange, PAL.red);
  heat.position.set(.20, .030, -.10);
  heat.rotation.y = .43;              // mặt dải nhiệt quay về phía máy quay c17
  heat.scale.setScalar(1);
  // màu của rig nhân 2,2 lần rồi cộng trong suốt: dải nhiệt cháy trắng,
  // đọc ra là một tấm sáng chói chứ không phải nhiệt (vòng chấm hình ảnh 2).
  heat.U.uColor.value.set('#ff9a3c').multiplyScalar(1.15);
  heat.U.uColor2.value.set('#ff4d33').multiplyScalar(1.15);
  scene.add(heat);

  return {
    scene, focus: new THREE.Vector3(0, .03, 0), key, amb,
    props: { water, surface, ion, dots, mols, chip, grain, heat },
    cams: {
      wide: [.16, .055, .46, 0, .045, 0],
      medium: [.24, .10, .62, -.02, .035, 0],
      close: [.17, .05, .40, .10, .02, -.05],
    },
  };
}

// ── N: mặt đá ở cấp nano ────────────────────────────────────────────────
// Mặt phẳng tinh thể có lưới phân tử, lớp nước phủ trên mặt, các phân tử
// nước bay tới và dính, và lớp ion nằm sâu dưới bề mặt.
export function buildNano(scene) {
  scene.background = canvasTex(64, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#1a4a72'); gr.addColorStop(1, '#0d2a46');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  scene.fog = new THREE.Fog('#123a5c', 1.1, 3.0);
  const key = keyLight(scene, { from: new THREE.Vector3(-.5, 1.4, 1.4), to: new THREE.Vector3(0, 0, 0), color: '#e8f6ff', intensity: 1.9, size: 1.2 });
  const amb = ambience(scene, { sky: '#7cc6ef', ground: '#12314f', fill: .8, rim: '#9ae4ff', rimI: 1.0, rimFrom: [1.4, 1.0, -1.2] });

  // mặt tinh thể: một mảng đá phẳng, nhìn từ trên xuống.
  // Mảng **vừa** phải: trước đây nó phóng to 1,6 lần nên máy quay nhìn vào
  // một mặt phẳng trống trơn, phân tử và ion chỉ là những chấm nhỏ (vòng
  // chấm 1: khung c13–c16 rộng và trống, không thấy "mặt đá" như chủ thể).
  const face = iceFace({ s: .5 });
  face.scale.setScalar(.62);
  scene.add(face);

  // lớp nước phủ trên mặt đá (mỏng dần ở c16)
  const layer = face.userData.layer;

  // phân tử nước bay tới và dính vào mặt đá.
  // `s` là **độ tản ra**, không phải cỡ hạt: để s=.5 thì đám phân tử nằm
  // trong bán kính 0,9 m và mỗi hạt chỉ 6 mm — ở cận cảnh chỉ thấy mấy chấm
  // trời. Đặt tụ lại quanh mặt đá và phóng to thì phân tử mới là chủ thể.
  const mol = molecules({ n: 30, s: .12, seed: 41 });
  mol.scale.setScalar(2.4);
  // đám phân tử phải **nằm trên mặt đá**: trước đây nó lệch 8 cm sang góc,
  // nên nửa đám rơi ngoài mép mảng đá và chỉ còn mấy quả cầu trôi trên trời.
  mol.position.set(-.03, 0, -.03);
  scene.add(mol);

  // ion của muối nằm ngay tại mặt đá, **chen vào** băng: cành nối xuống
  // mặt đá và bán kính tải ra hẹp, để không có cầu nào lơ lửng giữa
  // trời như một đĩa trơn (vòng chấm hình ảnh 3 ở c15).
  const ion = ions({ n: 16, seed: 71, band: [.010, .030], rmax: .125, stem: true });
  ion.scale.setScalar(.85);
  scene.add(ion);

  // vệt muối tan trên mặt đá — nằm **trong** khung: trước đây nó ở rìa
  // phải và bị mép khung cắt ngang, trông như vật liệu khác dán lên mặt đá
  // (vòng chấm hình ảnh 2 ở c13–c16).
  const patch = saltPatch({ w: .075, d: .062 });
  patch.scale.setScalar(.9);
  patch.position.set(.055, .022, .045);
  scene.add(patch);

  return {
    scene, focus: new THREE.Vector3(0, .02, 0), key, amb,
    props: { face, layer, mol, ion, patch },
    cams: {
      wide: [.20, .20, .44, 0, .03, 0],
      medium: [.22, .24, .50, .01, .04, 0],
      close: [.16, .11, .38, 0, .02, 0],
      deep: [.14, .14, .42, 0, .02, 0],
    },
  };
}
