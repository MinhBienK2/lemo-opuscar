// acts.js — những gì vật thể làm theo thời gian, và những bàn tay của phim.
//
// File này tách khỏi film.js để phần "diễn" nằm một chỗ: film.js lo máy quay và
// thẻ chữ, acts.js lo trạng thái của vật và bàn tay. Cùng một bộ mã dựng được
// nhiều lần, và cũng dựng lại được khi cần soi từng nhát mà không cần giọng.
import * as THREE from 'three';
import { keys, clamp, lerp } from '../../../../rig/kit.js';
import { buildHand } from '../../../../rig/fx.js';
import { droplets } from './set.js';

// Tay đưa vào từ bên trái: ngón chỉ sang +x, cẳng tay lùi về -x (ra ngoài khung).
function gripSide(hand, x, y, z, curl = .85, tilt = 0) {
  hand.position.set(x, y, z);
  hand.rotation.set(0, 0, tilt);
  hand.pose(curl, .12);
  hand.visible = true;
}
// Tay đưa vào từ trên: ngón chỉ xuống, cẳng tay vươn lên.
function gripDown(hand, x, y, z, curl = .85) {
  hand.position.set(x, y, z);
  hand.rotation.set(0, 0, -Math.PI / 2);
  hand.pose(curl, .12);
  hand.visible = true;
}

// makeActs(V, sets, SC): dựng bàn tay và trả về hàm trạng thái theo câu.
export function makeActs(V, sets, SC) {
  const { N1, N2, N3 } = sets;
  // Bếp: tay ướt (có giọt nước) đè tờ giấy ướt, tay khô đặt lên tờ giấy khô, và
  // một tay kéo mép tờ giấy ướt.
  // Trong tờ giấy: một tay kéo hai sợi ra xa nhau.
  // Bàn đo: một tay kéo lực kế xuống, một tay rót nước, một tay ấn tờ giấy đã sấy.
  const handWet = buildHand({ size: .45 }); SC.N1.add(handWet);
  droplets(handWet, 8, 5);
  const handDry = buildHand({ size: .45 }); SC.N1.add(handDry);
  const handPullK = buildHand({ size: .45 }); SC.N1.add(handPullK);
  const handI = buildHand({ size: 1.0 }); SC.N2.add(handI);
  droplets(handI, 6, 9);                            // đây là tay ướt: có giọt nước
  const handD = buildHand({ size: .42 }); SC.N3.add(handD);
  const handDip = buildHand({ size: .42 }); SC.N3.add(handDip);
  const handPress = buildHand({ size: .5 }); SC.N3.add(handPress);

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

  // ── trạng thái theo câu ───────────────────────────────────────────────
  // id: câu đang kể; t: thời gian trong câu đó.
  function applyState(id, t) {
    const k = num(id);

    // ── bếp ──
    K.sheetWet.setWet(wetK(t));
    K.sheetWet.setWrinkle(wrinkleK(t));
    K.sheetWet.setTear(tearK(t));
    // tờ giấy khô: không có gì xảy ra với nó, và đó là điều câu ba nói
    K.sheetDry.setWet(0);
    // tay ướt: đè xuống tờ giấy ướt ở câu một, ở lại ở câu hai; ở câu bốn nó đã
    // quay về bát nước — nước phải có mặt trong khung
    handWet.visible = k <= 4;
    if (handWet.visible) {
      if (k <= 2) {
        // Tay ướt quay ngược lại (ngón chỏi về -x) để **ngón tay đè đúng lên
        // mép rách** ở giữa tờ, và để cẳng tay vươn ra khỏi khung bên phải
        // chứ không cắt ngang tờ giấy.
        const press = .050 - .012 * prog('c1', t);
        handWet.position.set(-.78, press, .82);
        handWet.rotation.set(0, Math.PI, .18);
        handWet.pose(.95, .12);
      } else {
        gripSide(handWet, -1.18, .05, .92, .55, -.10);
      }
    }
    // tay khô: đặt lên tờ giấy khó phẳng ở câu ba, còn ở câu bốn; ở lời chốt nó
    // quay lại đúng chỗ đó. Tay này đưa vào **từ phía gần máy** (ngón chỉ ra
    // xa, cẳng tay vươn ra khỏi khung dưới chân hình) để cẳng tay không cắt
    // ngang tờ giấy ướt ở bên kia.
    handDry.visible = (k >= 3 && k <= 4) || k >= 42;
    if (handDry.visible) {
      handDry.position.set(-.42, .05, .85);
      handDry.rotation.set(0, Math.PI, .14);
      handDry.pose(.85, .12);
    }
    // tay kéo mép tờ giấy ướt ở câu năm: giấy ướt kéo nhẹ là rách
    handPullK.visible = k === 5;
    if (handPullK.visible) {
      const pull = prog('c5', t);
      gripDown(handPullK, -.82, .181, .90 + .05 * pull, .8);
      handPullK.rotation.y = .35;
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
      // Tay **ở sau** mạng sợi: ngón vươn tới đúng chỗ hai sợi chạm nhau và
      // kéo chúng ra xa nhau. Tay ở sau thì chỗ chạm, móc nối và khe hở mở
      // ra đều **thấy được** — đó là thứ câu này cần người xem nhìn thấy.
      handI.position.set(-.30 + .10 * prog('c19', t), -.01, .090);
      handI.rotation.set(Math.PI / 2, 0, 0);      // lòng bàn tay quay về phía máy
      handI.pose(.75, .2);
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
    // tay kéo lực kế: nắm ngang thân lực kế, kéo xuống
    handD.visible = k === 26 || k === 33 || k === 34;
    if (handD.visible) {
      // bàn tay nắm **thân lực kế** (đứng bên phải lực kế, ngón chỉ sang trái
      // ôm lấy mặt thang), và nó đi xuống cùng lực kế khi tải kéo tăng.
      handD.position.set(N3.grip.x + .085, drop - .012, N3.grip.z + .040);
      handD.rotation.set(0, Math.PI, 0);
      handD.pose(.85, .12);
    }
    // tay rót nước: cầm bát nước lên và nghiêng qua dải giấy (câu 32 — câu 33
    // thì tay kéo dải giấy ướt, không rót nữa)
    const pouring = k === 32;
    handDip.visible = pouring;
    D.pour.visible = pouring;
    if (pouring) {
      const dip = prog('c33', t);
      // bát nước nâng lên rồi nghiêng; nước chảy qua miệng bát xuống dải giấy
      D.bowl.position.set(
        lerp(N3.bowlHome.x, -.16, dip),
        lerp(N3.bowlHome.y, .30, dip),
        lerp(N3.bowlHome.z, 1.06, dip),
      );
      D.bowl.rotation.z = lerp(0, .85, clamp((dip - .25) / .5));
      D.bowl.rotation.x = lerp(0, .25, clamp((dip - .25) / .5));
      if (D.pour.update) D.pour.update(t, clamp((dip - .2) / .3));
      handDip.position.set(.00, .30, 1.09);
      handDip.rotation.set(0, -.5, .2);
      handDip.pose(.9, .12);
    } else {
      D.bowl.position.copy(N3.bowlHome);
      D.bowl.rotation.set(0, 0, 0);
    }
    // tay ấn tờ giấy đã sấy: giấy nhăn thêm và rạn
    handPress.visible = k === 41;
    if (handPress.visible) {
      const p = prog('c41', t);
      gripSide(handPress, .16, .05 - .012 * p, .57, .8, -.2);
    }
    D.dried.setWrinkle(pressK(t));
    D.dried.setWet(.45 + .12 * (pressK(t) - 2.4));
  }

  return { applyState, hands: { handWet, handDry, handPullK, handI, handD, handDip, handPress } };
}
