// acts.js — những gì vật thể làm theo thời gian, và những bàn tay của phim.
//
// File này tách khỏi film.js để phần "diễn" nằm một chỗ: film.js lo máy quay và
// thẻ chữ, acts.js lo trạng thái của vật và bàn tay. Cùng một bộ mã dựng được
// nhiều lần, và cũng dựng lại được khi cần soi từng nhát mà không cần giọng.
//
// Bàn tay ở đây **đặt bằng toán học, không đoán**: đầu ngón giữa phải nằm đúng
// chỗ nó nắm (vết rách trên tờ giấy, chỗ hai sợi chạm nhau, vành lực kế…), và
// cẳng tay phải lùi ra khỏi khung. Đặt tay "cho có" thì khung chỉ còn một mảng
// hồng phẳng, người xem không đọc ra bàn tay — và tay là thứ đang kể.
import * as THREE from 'three';
import { keys, clamp, lerp, ss } from '../../../../rig/kit.js';
import { buildHand } from '../../../../rig/fx.js';
import { droplets } from './set.js';

// ── hình học bàn tay của rig ────────────────────────────────────────────
// Vị trí đầu ngón giữa tính ra từ hình học thật (rig/fx.js, buildHand): gốc
// ngón [0.2014, 0.004, −0.025], ba đốt dài [0.062, 0.040, 0.030]; mỗi khớp
// gập thêm 1.0 / 1.3 / 0.9 lần `curl` rad.
const FROOT = [.2014, .004, -.025], FSEG = [.062, .040, .030];
function tipLocal(curl) {
  const a = [-curl, -curl * 2.3, -curl * 3.2];
  let x = FROOT[0], y = FROOT[1];
  FSEG.forEach((L, i) => { x += L * Math.cos(a[i]); y += L * Math.sin(a[i]); });
  return new THREE.Vector3(x, y, FROOT[2]);
}

// Đặt bàn tay sao cho **đầu ngón giữa** nằm đúng ở `tip` và ngón chỉ theo
// hướng `dir`.
// `roll` xoay bàn tay quanh trục ngón: lòng bàn tay nghiêng đi, các ngón tách
// ra thành hàng chứ không dồn vào một khối hồng.
// Cẳng tay luôn nằm ngược hướng ngón, nên hướng ngón chính là hướng ta chọn
// để cẳng tay lùi ra khỏi khung.
function placeHand(hand, tip, dir, curl, { size = .5, roll = 0, spread = .25 } = {}) {
  const p = tip.isVector3 ? tip : new THREE.Vector3(...tip);
  const d = new THREE.Vector3(...dir).normalize();
  const hz = Math.hypot(d.x, d.z);
  const beta = Math.atan2(d.y, hz);              // ngón chỉ lên hay xuống
  const psi = Math.atan2(-d.z, d.x);              // ngón chỉ sang hướng nào
  const q = new THREE.Quaternion()
    .setFromAxisAngle(new THREE.Vector3(0, 1, 0), psi)
    .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), beta))
    .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), roll));
  hand.quaternion.copy(q);
  hand.scale.setScalar(size);
  const off = tipLocal(curl).applyQuaternion(q).multiplyScalar(size);
  hand.position.set(p.x - off.x, p.y - off.y, p.z - off.z);
  hand.pose(curl, spread);
  hand.userData.curl = curl;
  hand.visible = true;
  return hand;
}

// Khe rách giữa hai nửa tờ giấy: props.js dịch **cả hai** nửa cùng một hướng,
// nên tờ giấy không hề có vết rách — người xem chỉ thấy mặt giấy phẳng lì.
// Ở đây ta mở khe bằng tay: nửa phải lùi sang phải (phía được kéo), nửa trái
// lùi trái ít hơn. Khe mở **lệch sang phải** để nó lộ ra bên cạnh ngón tay,
// chứ không nằm trọn dưới ngón mà không ai thấy.
function tearGap(sheet, k) {
  const halves = sheet.children.filter(o => o.isMesh && o.material === sheet.mat);
  if (halves.length < 2) return;
  const g = .022 * clamp(k);
  halves[0].position.x = -.30 * g;
  halves[1].position.x = .70 * g;
}

// Tay áo của rig dài 55 cm: trong nhát máy đứng gần, nó là một **ống navy**
// chiếm cả khung và người xem tưởng đang nhìn một ống, không phải một tay.
// Ta cuộn tay áo lại (cẳng tay còn ~20 cm, khớp với cổ tay áo sẵn có): trong
// khung chỉ còn bàn tay và một chút cổ tay, đúng như lời yêu cầu.
function shortSleeve(hand, len = .20) {
  hand.traverse(o => {
    if (!o.isMesh || !o.geometry || o.geometry.type !== 'CylinderGeometry') return;
    const p = o.geometry.parameters;
    if (Math.abs(p.height - .55) > 1e-6 || Math.abs(p.radiusTop - .075) > 1e-6) return;
    o.scale.x = len / .55;                  // cắt tay áo, giữ nguyên độ dày
    o.position.x = -.094 - len / 2;         // mép cắt dán ngay sau cổ tay áo
  });
}

// makeActs(V, sets, SC): dựng bàn tay và trả về hàm trạng thái theo câu.
export function makeActs(V, sets, SC) {
  const { N1, N2, N3 } = sets;
  // Bếp: tay ướt (có giọt nước) đè tờ giấy ướt, tay khô đặt lên tờ giấy khô, và
  // một tay kéo mép tờ giấy ướt.
  // Trong tờ giấy: một tay kéo hai sợi ra xa nhau.
  // Bàn đo: một tay kéo lực kế xuống, một tay rót nước, một tay ấn tờ giấy đã sấy.
  const handWet = buildHand({ size: .5 }); SC.N1.add(handWet);
  droplets(handWet, 8, 5);
  const handDry = buildHand({ size: .5 }); SC.N1.add(handDry);
  const handPullK = buildHand({ size: .5 }); SC.N1.add(handPullK);
  const handI = buildHand({ size: .6 }); SC.N2.add(handI);
  droplets(handI, 6, 9);                            // đây là tay ướt: có giọt nước
  const handD = buildHand({ size: .45 }); SC.N3.add(handD);
  const handDip = buildHand({ size: .5 }); SC.N3.add(handDip);
  const handPress = buildHand({ size: .55 }); SC.N3.add(handPress);
  // Tay áo cuộn lại cho cả bảy tay: cẳng tay không được nằm ngang giữa khung.
  for (const h of [handWet, handDry, handPullK, handI, handD, handDip, handPress]) shortSleeve(h);

  const K = N1.props, I = N2.props, D = N3.props;

  const T = id => V.L[id].t0, E = id => V.L[id].t1;
  const DUR = id => Math.max(.001, E(id) - T(id));
  const prog = (id, t) => clamp((t - T(id)) / DUR(id));
  const num = id => parseInt(id.slice(1), 10);

  // ── trạng thái: những đại lượng đổi theo thời gian ─────────────────────
  // Bếp: tờ giấy ướt thấm nước (vệt loang, giấy tối), giấy nhăn dần, mép rách
  // mở ra — lần nhỏ ở câu hai, lần kéo tay ở câu năm.
  const wetK = keys([[0, 0], [T('c1'), 0], [E('c1'), 1], [1, 1]]);
  const wrinkleK = keys([[0, 0], [T('c1'), 0], [E('c1'), .5], [E('c2'), 1], [1, 1]]);
  // vết rách mở ra **ngay trong câu một** — câu một nói "nó rách ngay", nên
  // người xem phải thấy vết rách lúc câu một đang chạy, không phải câu hai.
  const tearK = keys([[0, 0], [T('c1'), 0], [E('c1'), .30], [E('c2'), .55], [T('c5'), .55], [E('c5'), 1], [1, 1]]);
  // Trong tờ giấy: nước bay vào, móc đổi màu, sợi phồng, sợi trượt ra, nứt lan.
  // Hai phân tử nước đầu **tới nơi trong câu mười ba** (hơn nửa câu), để câu mười
  // bốn thấy chúng đã dính vào nhau bằng móc xanh lam; phần còn lại tới dần
  // trong câu mười lăm.
  const moleK = keys([[0, 0], [T('c13'), 0], [T('c13') + (E('c13') - T('c13')) * .55, .50],
    [E('c13'), .58], [T('c15'), .58], [E('c15'), 1], [1, 1]]);
  // móc vàng của mối liên kết hydrogen **chỉ** đổi màu ở câu mười sáu: câu
  // mười bốn nói mối liên kết bị nước phá vỡ, nhưng hình phải cho thấy móc
  // vàng bên cạnh **còn nguyên** thì câu mười sáu mới có "trước → sau".
  const bondWet = keys([[0, 0], [T('c16'), 0], [E('c16'), 1], [1, 1]]);
  const swellK = keys([[0, 0], [T('c17'), 0], [E('c17'), 1], [1, 1]]);
  const gapK = keys([[0, 0], [T('c18'), 0], [E('c18'), .5], [E('c19'), 1], [E('c21'), 1.7], [1, 1.7]]);
  const crackK = keys([[0, 0], [T('c20'), 0], [E('c20'), .75], [E('c21'), 1], [1, 1]]);
  // Bàn đo: tải kéo, độ ẩm, dải giấy ướt và lúc đứt.
  // Kim lực kế chạy theo số đo. Câu hai mươi sáu: dải giấy khô đứt ở lực .85;
  // câu hai mươi chín: ở độ ẩm cao hơn thì lực đứt chỉ còn .55; câu ba mươi
  // ba: dải giấy **ướt** rách trước khi lực kế kịp đọc, nên kim **tụt về gần
  // vạch không** — không còn con số nào để đọc.
  const loadK = keys([[0, 0], [T('c26'), 0], [E('c26'), .85], [T('c28'), .85], [E('c28'), .85],
    [T('c29'), .85], [E('c29'), .55], [E('c31'), .55], [T('c33'), .55], [E('c33'), .10],
    [T('c34'), .10], [E('c34'), .10], [1, .10]]);
  // độ giãn: dải giấy dài ra khi kéo, và **giữ nguyên** sau đó — đầu dải giấy
  // đi qua từng vạch của cây thước đứng cạnh nó.
  const stretchK = keys([[0, 0], [T('c26'), 0], [E('c26'), 1], [1, 1]]);
  const rhK = keys([[0, 50], [T('c27'), 50], [E('c27'), 50], [T('c28'), 50], [E('c28'), 90],
    [T('c29'), 90], [1, 90]]);
  const wetStripK = keys([[0, 0], [T('c32'), 0], [E('c32'), 1], [1, 1]]);
  // dải giấy thử **rạch** ở câu hai mươi sáu (đọc lực lúc nó vừa gãy), rồi
  // **đứt hẳn** ở câu ba mươi tư khi nó ướt hẳn.
  const breakK = keys([[0, 0], [T('c26'), 0], [E('c26'), .30], [T('c33'), .30], [E('c33'), .42],
    [T('c34'), .42], [E('c34'), 1], [1, 1]]);
  const pressK = keys([[0, 2.4], [T('c41'), 2.4], [E('c41'), 3.3], [1, 3.3]]);
  // Dấu ấn của ngón tay trên tờ giấy đã sấy: nếp hăn **tỏa ra** từ chỗ ngón
  // ấn, và một vòng ẩm nhỏ (dấu ngón) nằm đúng dưới đầu ngón. Không có nó,
  // câu "sấy khô xong vẫn chưa trở lại" không có gì để đọc.
  const pressMarkK = keys([[0, 0], [T('c41'), 0], [E('c41'), 1], [1, 1]]);

  // ── trạng thái theo câu ───────────────────────────────────────────────
  // id: câu đang kể; t: thời gian trong câu đó.
  function applyState(id, t) {
    const k = num(id);

    // ── bếp ──
    // Tờ giấy ướt được nhấc khỏi mặt quầy một chút: nếp nhăn có phần âm, tờ
    // giấy sẽ chui xuống quầy và mặt quầy ló ra thành những lỗ nâu trên giấy.
    K.sheetWet.position.y = .003;
    K.sheetWet.setWet(wetK(t));
    K.sheetWet.setWrinkle(wrinkleK(t) * 1.6);
    K.sheetWet.setTear(tearK(t));
    tearGap(K.sheetWet, tearK(t));
    // tờ giấy khô: không có gì xảy ra với nó, và đó là điều câu ba nói
    K.sheetDry.setWet(0);
    // Vết rách nằm giữa tờ, hơi về phía máy: đó là chỗ ngón tay ấn vào, và
    // chỗ tay kéo ở câu năm.
    const tearX = K.sheetWet.position.x, tearZ = K.sheetWet.position.z;
    // tay ướt: đè xuống tờ giấy ướt ở câu một, ở lại ở câu hai; ở câu bốn nó đã
    // quay về bát nước — nước phải có mặt trong khung
    handWet.visible = k <= 4;
    if (handWet.visible) {
      if (k <= 2) {
        // Ngón tay ấn **đúng lên vết rách**: đầu ngón nằm ở khe, ngón chỉ
        // sang trái (xa khỏi máy) để máy nhìn thấy ngón **từ bên**, không phải
        // một mảng lòng bàn tay úp về mình. Cẳng tay lùi sang phải, ra ngoài
        // mép khung.
        const down = lerp(.030, .013, ss(prog('c1', t)));   // ngón hạ xuống giấy
        placeHand(handWet, [tearX - .009, down, tearZ], [-.95, -.18, -.15], .30,
          { size: .5, roll: .45 });
      } else {
        // Ở bát nước: ngón chụp **xuống mặt nước** trong bát (đó là lý do tay
        // này ướt), cẳng tay vươn lên ra khỏi khung — máy nhìn bát từ trên
        // xuống, nên tay ở trên sẽ không che bát.
        placeHand(handWet, [-1.190, .048, .945], [-.35, -.85, .40], .40,
          { size: .5, roll: .35 });
      }
    }
    // tay khô: đặt lên tờ giấy khô ở câu ba, còn ở câu bốn; ở lời chốt nó
    // quay lại đúng chỗ đó. Tay này chỉ **chạm** giấy — ngón nằm trên mặt
    // tờ, cẳng tay lùi sang phải ra ngoài khung.
    handDry.visible = (k >= 3 && k <= 4) || k >= 42;
    if (handDry.visible) {
      placeHand(handDry, [K.sheetDry.position.x, .013, K.sheetDry.position.z],
        [-.95, -.18, -.15], .28, { size: .5, roll: .45 });
    }
    // tay kéo mép tờ giấy ướt ở câu năm: ngón bấu vào **khe rách** và kéo sang
    // phải, nên khe rách mở ra ngay dưới ngón tay.
    handPullK.visible = k === 5;
    if (handPullK.visible) {
      const pull = ss(prog('c5', t));
      // Đầu ngón bám theo mép khe rách: nửa phải lùi sang phải theo tearK
      // (xem tearGap), nên ngón luôn nằm đúng chỗ giấy đang rách, và càng
      // kéo thì mép giấy càng lùi khỏi ngón.
      placeHand(handPullK, [tearX + .0154 * tearK(t) + .004 * pull, .014, tearZ],
        [-.95, -.18, -.12], .45, { size: .5, roll: .45 });
    }

    // ── trong tờ giấy ──
    // nước bay vào: mỗi phân tử đi từ bên trái tới đúng chỗ móc nối của nó.
    // **Hai phân tử đầu tới nơi trong câu mười ba**, để câu mười bốn thấy chúng
    // đã dính vào nhau bằng móc xanh lam; phần còn lại tới dần trong câu mười lăm.
    const mole = moleK(t);
    for (let i = 0; i < I.molecules.length; i++) {
      const mo = I.molecules[i];
      const on = k >= 13 && k <= 22;
      mo.m.visible = on;
      if (!on) continue;
      const e = i < 2 ? clamp((mole - i * .02) / .50) : clamp((mole - .10 - (i - 2) * .05) / .60);
      const e2 = e * e * (3 - 2 * e);
      mo.m.position.lerpVectors(mo.m.userData.from, mo.tg, e2);
      mo.m.rotation.y = t * 1.4 + i;
      mo.m.rotation.z = Math.sin(t * 2 + i) * .3;
    }
    // móc nối đổi màu khi nước tới: vàng là móc giữ hai sợi, xanh lá là móc
    // ướt. Móc **xanh lam** giữ hai phân tử nước thì không đổi màu.
    const bw = bondWet(t);
    for (const b of I.bonds) b.setWet(bw);
    // móc xanh lam giữ hai phân tử nước: chỉ hiện lúc hai phân tử đã dính
    // nhau (câu mười bốn, mười lăm)
    I.waterHook.visible = k >= 14 && k <= 15;
    // sợi phồng ra khi hút nước
    I.fA.setSwell(swellK(t));
    // hai sợi trượt ra xa nhau: khe hở mở ra ở chỗ chạm
    const gap = gapK(t);
    I.fA.position.y = I.fA.userData.y0 - .022 * gap;
    I.fB.position.x = I.fB.userData.x0 + .012 * gap;
    I.fC.position.y = I.fC.userData.y0 + .014 * gap;
    // móc ở chỗ chạm bị nước làm lỏng: nó tắt dần
    if (I.heroBonds[0]) I.heroBonds[0].scale.setScalar(clamp(1 - gap * .75));
    // vệt nứt lan ra
    I.crack.scale.y = crackK(t);
    I.crack.visible = crackK(t) > .01;
    // tay trong thế giới sợi: kéo hai sợi ra xa nhau ở câu mười chín. Đây là
    // **chính tay ướt ở bếp**, thấy qua kính lúp: nó phải có giọt nước trên
    // mu như tay ướt ở câu một, thì người xem mới biết đây là cùng một vật.
    handI.visible = k === 19;
    if (handI.visible) {
      // Tay ở **bên trái** mạng sợi, ngón chỉ sang phải và bấu vào đúng chỗ hai
      // sợi chạm nhau; lòng bàn tay nghiêng (roll âm) nên máy nhìn thấy tay
      // **từ bên**, các ngón tách ra và cong quanh chỗ chạm — chứ không phải
      // một mảng hồng phẳng. Cẳng tay lùi sang trái, ra ngoài mép khung.
      placeHand(handI, [I.fB.position.x, (I.fA.position.y + I.fB.position.y) / 2, .175],
        [1, 0, 0], .55, { size: .55, roll: -.45 });
    }
    // mặt cắt của tờ giấy quét ngang khung khi máy lui ra: nó che dần mạng sợi
    // và cuối nhát thì **phủ kín** khung, để cảnh kế tiếp mở ra từ mép giấy.
    I.edge.visible = k >= 23;
    if (k >= 23) I.edge.position.x = lerp(3.40, 0, prog('c23', t));

    // ── bàn đo ──
    // tải kéo: kim lực kế chạy theo số đo; **lực kế đứng yên** ở độ cao của
    // dải giấy và chỉ hạ xuống khi dải giấy bị kéo dài — đầu dải giấy đi qua
    // từng vạch của cây thước đứng cạnh nó.
    const load = loadK(t);
    D.gauge.setLoad(clamp(load, 0, 1));
    // độ giãn: dải giấy **dài ra** khi kéo, nhưng **đầu trên vẫn nằm trong
    // kẹp** — nên đầu dưới (và cả lực kế) đi xuống, đúng như thật.
    const stretch = stretchK(t);
    const drop = .235 - .012 * stretch;
    D.gauge.position.y = drop;
    D.strip.scale.x = 1 + .06 * stretch;
    D.strip.position.y = .39 - .006 * stretch;
    // độ ẩm: kim đồng hồ chạy lên khi không khí ẩm hơn
    D.hygro.setRH(rhK(t));
    // dải giấy ướt: rót nước vào rồi kéo, nó nhăn và rách
    D.strip.setWet(wetStripK(t));
    D.strip.setBreak(breakK(t));
    // tay kéo lực kế: ngón bấu vào **vành bên** của thân lực kế, ở phía trước
    // mặt thang, nên mặt thang và kim vẫn đọc được; lòng bàn tay lùi sang
    // phải, ra ngoài mép khung.
    handD.visible = k === 26 || k === 33 || k === 34;
    if (handD.visible) {
      const gm = new THREE.Matrix4().compose(D.gauge.position, D.gauge.quaternion, new THREE.Vector3(1, 1, 1));
      const rim = new THREE.Vector3(.058, 0, .020).applyMatrix4(gm);   // vành bên, phía máy
      placeHand(handD, [rim.x, rim.y, rim.z], [-1, 0, 0], .55,
        { size: .45, roll: .40 });
    }
    // tay rót nước: cầm bát nước lên và nghiêng qua dải giấy (câu 32 — câu 33
    // thì tay kéo dải giấy ướt, không rót nữa)
    const pouring = k === 32;
    handDip.visible = pouring;
    D.pour.visible = pouring;
    if (pouring) {
      // Bát nước nâng lên rồi nghiêng **trong câu ba mươi hai** (câu này kể
      // chuyện giấy ướt hẳn); nước chảy qua miệng bát xuống dải giấy.
      const dip = prog('c32', t);
      // bát nước nâng lên rồi nghiêng; nước chảy qua miệng bát xuống dải giấy
      D.bowl.position.set(
        lerp(N3.bowlHome.x, -.16, dip),
        lerp(N3.bowlHome.y, .30, dip),
        lerp(N3.bowlHome.z, 1.06, dip),
      );
      D.bowl.rotation.z = lerp(0, .85, clamp((dip - .25) / .5));
      D.bowl.rotation.x = lerp(0, .25, clamp((dip - .25) / .5));
      if (D.pour.update) D.pour.update(t, clamp((dip - .2) / .3));
      // Bàn tay nắm vành bát, tính từ chính cái bát đang nghiêng: ngón chỉ vào
      // trong bát, cẳng tay lùi ra góc dưới-trái khung.
      const bq = new THREE.Quaternion().setFromEuler(D.bowl.rotation);
      const bm = new THREE.Matrix4().compose(D.bowl.position, bq, new THREE.Vector3(1, 1, 1));
      const grip = new THREE.Vector3(-.085, 0, 0).applyMatrix4(bm);
      const dir = new THREE.Vector3(1, 0, 0).applyQuaternion(bq);
      placeHand(handDip, [grip.x, grip.y, grip.z], [dir.x, dir.y, dir.z], .45,
        { size: .5, roll: .50 });
    } else {
      D.bowl.position.copy(N3.bowlHome);
      D.bowl.rotation.set(0, 0, 0);
    }
    // tay ấn tờ giấy đã sấy: đầu ngón ấn **đúng giữa tờ** — chỗ nếp hăn tỏa
    // ra và vòng ẩm của ngón — để người xem thấy giấy bị ấn rạn.
    handPress.visible = k === 41;
    if (handPress.visible) {
      const p = prog('c41', t);
      placeHand(handPress, [D.dried.position.x, lerp(.030, .013, ss(p)), D.dried.position.z],
        [-.97, -.16, -.20], .40, { size: .55, roll: .45 });
    }
    D.dried.setWrinkle(pressK(t));
    D.dried.setWet(.45 + .12 * (pressK(t) - 2.4));
    D.dried.setPress(pressMarkK(t));
  }

  return { applyState, hands: { handWet, handDry, handPullK, handI, handD, handDip, handPress } };
}
