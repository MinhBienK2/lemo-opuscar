// film.js — trang phim của tập 04: 48 nhát, một câu lời kể một nhát hình.
//
// Ba nơi chốn: N1 bếp buổi sáng · N2 trong sợi dây · N3 bàn đo ban đêm.
// Lời kể đi một chiều: N1 (hiện tượng: dây co, thép dãn, dây chùng nở ra) →
// N2 (cơ chế: chuỗi, cách cuộn, entropy, lực co đổi theo nhiệt độ) →
// N3 (phép đo: nhiệt kế, thước, lực kế, hiệu ứng Joule) →
// N1 (quay lại: điều kiện của câu trả lời, và việc người xem làm được).
//
// Quy tắc số: chỉ ba con số được lên hình — 20 °C (c30), 60 °C (c32), 14 % (c36).
// Mỗi con số đều có câu lời đọc nó, và mỗi con số là một vật trong khung.
import * as THREE from 'three';
import { film, label, subtitle, toScreen } from '../../../../rig/render.js';
import { keys, ss, clamp } from '../../../../rig/kit.js';
import { build } from './timeline.js';
import { loadVoice } from '../../../../rig/voice.js';
import { buildKitchen, buildInside, buildDesk } from './set.js';
import { buildHand } from '../../../../rig/fx.js';

const V = await loadVoice(build);
const F = film({ fov: 36 }), camera = F.camera;

// ── ba nơi chốn ─────────────────────────────────────────────────────────
const SC = { N1: new THREE.Scene(), N2: new THREE.Scene(), N3: new THREE.Scene() };
const N1 = buildKitchen(SC.N1);
const N2 = buildInside(SC.N2);
const N3 = buildDesk(SC.N3);
const setOf = { N1, N2, N3 };

// ── tay ─────────────────────────────────────────────────────────────────
// Bếp: một tay cầm máy sấy tóc, một tay cuốn dây quanh nắp ở lời chốt.
// Trong sợi dây: một tay kéo mạng chuỗi ra.
// Bàn đo: một tay giữ dây ở vạch thước, một tay giữ vật nặng của sợi thép,
// một tay cầm máy sấy tóc.
const handK = buildHand(); SC.N1.add(handK);
const handK2 = buildHand(); SC.N1.add(handK2);
const handI = buildHand({ size: .72 }); SC.N2.add(handI);
const handD = buildHand(); SC.N3.add(handD);
const handD2 = buildHand(); SC.N3.add(handD2);
const handD3 = buildHand(); SC.N3.add(handD3);
const handD4 = buildHand(); SC.N3.add(handD4);

// Bàn tay nắm một vật: ngón tay cuộn quanh vật, cẳng tay đi ra khỏi khung.
//   gripSide: ngón chỉ sang +x, cẳng tay lùi về -x (tay đưa vào từ bên trái)
//   gripDown: ngón chỉ xuống, cẳng tay vươn lên (tay đưa vào từ trên)
function gripSide(hand, x, y, z, curl = .85) {
  hand.position.set(x, y, z);
  hand.rotation.set(0, 0, 0);
  hand.pose(curl, .12);
  hand.visible = true;
}
function gripDown(hand, x, y, z, curl = .85) {
  hand.position.set(x, y, z);
  hand.rotation.set(0, 0, -Math.PI / 2);
  hand.pose(curl, .12);
  hand.visible = true;
}

// ── bảng nhát: 48 nhát, đúng thứ tự câu lời kể ─────────────────────────
// pos/look: vị trí máy và điểm nhìn. d: máy trượt trong nhát (luôn có lý do ở cột Vì sao).
const SHOTS = [
  // ── N1: bếp ──
  // Mọi cận cảnh phải thấy trọn cái hũ (19 cm) hoặc trọn vòng dây quanh nắp,
  // nên máy quay đứng ở cự ly 0,3–0,6 m, không áp vào hũ.
  { ids: ['c1'], s: 'N1', pos: [-.60, .30, 1.22], look: [-.86, .15, .80], fov: 28, d: [.03, .02, -.02] },
  { ids: ['c2'], s: 'N1', pos: [-1.06, .24, 1.12], look: [-1.00, .18, .82], fov: 34, d: [.04, 0, -.03] },
  { ids: ['c3'], s: 'N1', pos: [-.62, .34, 1.10], look: [-.86, .18, .79], fov: 30, d: [-.02, .01, -.02] },
  { ids: ['c4'], s: 'N1', pos: [.36, .13, .96], look: [.26, .01, .82], fov: 22, d: [.02, 0, -.015] },
  { ids: ['c5'], s: 'N1', pos: [-.36, .16, 1.08], look: [-.56, .03, .82], fov: 30, d: [.03, 0, -.02] },
  { ids: ['c6'], s: 'N1', pos: [-.62, .30, 1.30], look: [-.64, .10, .80], fov: 38, d: [.03, 0, -.02] },
  { ids: ['c7'], s: 'N1', pos: [-.70, .16, 1.05], look: [-.84, .18, .79], fov: 26, d: [.02, .01, -.02] },
  { ids: ['c8'], s: 'N1', pos: [-.90, .21, .90], look: [-.85, .20, .78], fov: 30, d: [0, -.01, -.012] },
  // ── N2: trong sợi dây ──
  // Mỗi câu một hình riêng: mạng · một sợi · móc nối vàng · nhóm sợi ·
  // nhóm sợi từ trên xuống · mắt xích cận cảnh · mạng từ trên xuống ·
  // mạng nhìn dọc · sợi đang cuộn ra · tay kéo mạng · mạng bị kéo thẳng ·
  // mắt xích thẳng · tay và mạng thẳng · vệt nhiệt · dải treo · hai cột mát
  // và nóng · hai đoạn dây · quả cân được nâng lên.
  { ids: ['c9'], s: 'N2', pos: [0, .02, 1.05], look: [0, 0, -.25], fov: 27, d: [0, 0, -.03] },
  { ids: ['c10'], s: 'N2', pos: [-.10, .13, .95], look: [-.10, .02, -.10], fov: 30, d: [-.03, -.02, -.03] },
  { ids: ['c11'], s: 'N2', pos: [.30, .10, .14], look: [.16, .027, -.18], fov: 20, d: [-.02, -.02, -.02] },
  { ids: ['c12'], s: 'N2', pos: [-.52, .20, .90], look: [-.90, .10, .52], fov: 26, d: [.02, .01, -.02] },
  { ids: ['c13'], s: 'N2', pos: [-.88, .46, .56], look: [-.88, .10, .52], fov: 24, d: [.03, .01, -.02] },
  { ids: ['c14'], s: 'N2', pos: [-.99, .10, .64], look: [-.92, .10, .52], fov: 18, d: [.02, 0, -.015] },
  { ids: ['c15'], s: 'N2', pos: [.08, .52, .72], look: [0, .02, -.18], fov: 34, d: [-.03, -.02, -.02] },
  { ids: ['c16'], s: 'N2', pos: [-.62, .06, .18], look: [.20, .06, -.18], fov: 26, d: [0, -.01, -.02] },
  { ids: ['c17'], s: 'N2', pos: [-.72, .14, .86], look: [-.92, .10, .52], fov: 24, d: [.02, .01, -.015] },
  { ids: ['c18'], s: 'N2', pos: [1.20, .20, .85], look: [.15, .02, -.05], fov: 30, d: [.03, 0, -.02] },
  { ids: ['c19'], s: 'N2', pos: [.25, .18, .88], look: [.05, .02, -.18], fov: 36, d: [0, 0, -.03] },
  { ids: ['c20'], s: 'N2', pos: [.32, .06, .30], look: [.34, .02, -.16], fov: 18, d: [.02, .01, -.02] },
  { ids: ['c21'], s: 'N2', pos: [.90, .30, .60], look: [.26, .02, -.10], fov: 30, d: [-.02, .01, -.02] },
  { ids: ['c22'], s: 'N2', pos: [.30, .12, .60], look: [0, .00, -.16], fov: 30, d: [0, 0, -.03] },
  { ids: ['c23'], s: 'N2', pos: [0, .60, 1.00], look: [0, .72, .58], fov: 34, d: [0, -.01, -.02] },
  { ids: ['c24'], s: 'N2', pos: [.52, .30, 1.04], look: [.52, .30, .46], fov: 28, d: [-.02, .01, -.03] },
  { ids: ['c25'], s: 'N2', pos: [0, .28, 1.10], look: [0, .14, .52], fov: 36, d: [0, 0, -.03] },
  { ids: ['c26'], s: 'N2', pos: [-.22, .14, .95], look: [0, .12, .52], fov: 30, d: [-.02, .01, -.015] },
  // ── N1: về lại bếp ──
  { ids: ['c27'], s: 'N1', pos: [-.90, .28, 1.10], look: [-.83, .19, .78], fov: 30, d: [-.02, 0, -.02] },
  // ── N3: bàn đo ──
  // Bàn đo: cột đứng cao .41 m, đồng hồ ở .38, dây chun treo xuống .14, quả cân ở .06.
  // Trục bàn: máy sấy tóc ở -.72 · cột dây chun ở -.30 (thước ở -.375) ·
  // · nhiệt kế chính ở -.20 · vòng dây Joule ở .15 · cột sợi thép ở .32.
  { ids: ['c28'], s: 'N3', pos: [-.10, .24, 1.70], look: [-.10, .22, .91], fov: 38, d: [.02, -.02, -.04] },
  { ids: ['c29'], s: 'N3', pos: [-.10, .10, 1.16], look: [-.30, .10, .91], fov: 24, d: [.02, 0, -.03] },
  { ids: ['c30'], s: 'N3', pos: [-.30, .13, 1.12], look: [-.26, .09, .95], fov: 26, d: [-.02, .01, -.03] },
  { ids: ['c31'], s: 'N3', pos: [-.14, .28, 1.26], look: [-.46, .21, .92], fov: 34, d: [.03, 0, -.03] },
  { ids: ['c32'], s: 'N3', pos: [-.20, .15, 1.14], look: [-.20, .15, 1.01], fov: 15, d: [-.01, 0, -.01] },
  { ids: ['c33'], s: 'N3', pos: [-.44, .24, 1.20], look: [-.32, .16, .91], fov: 24, d: [0, .02, -.01] },
  { ids: ['c34'], s: 'N3', pos: [-.58, .26, 1.22], look: [-.38, .20, .92], fov: 26, d: [-.02, 0, -.02] },
  { ids: ['c35'], s: 'N3', pos: [-.05, .30, 1.30], look: [-.30, .26, .92], fov: 26, d: [.01, 0, -.02] },
  { ids: ['c36'], s: 'N3', pos: [-.30, .39, 1.09], look: [-.30, .381, .91], fov: 24, d: [0, 0, -.008] },
  { ids: ['c37'], s: 'N3', pos: [-.10, .34, 1.49], look: [-.10, .30, .91], fov: 30, d: [-.02, 0, -.04] },
  { ids: ['c38'], s: 'N3', pos: [-.30, .44, 1.40], look: [-.30, .34, .91], fov: 26, d: [0, 0, -.02] },
  { ids: ['c39'], s: 'N3', pos: [.39, .12, 1.20], look: [.46, .05, .93], fov: 24, d: [.02, 0, -.02] },
  { ids: ['c40'], s: 'N3', pos: [.49, .07, 1.05], look: [.48, .05, .93], fov: 12, d: [0, 0, -.015] },
  { ids: ['c41'], s: 'N3', pos: [.35, .14, 1.24], look: [.46, .06, .93], fov: 28, d: [.01, 0, -.015] },
  // ── N1: lời chốt ──
  { ids: ['c42'], s: 'N1', pos: [-.71, .32, 1.30], look: [-.71, .17, .78], fov: 34, d: [.02, 0, -.02] },
  { ids: ['c43'], s: 'N1', pos: [-.66, .215, .92], look: [-.61, .206, .79], fov: 18, d: [0, 0, -.015] },
  { ids: ['c44'], s: 'N1', pos: [-1.16, .26, 1.20], look: [-1.00, .16, .82], fov: 32, d: [0, 0, -.01] },
  { ids: ['c45'], s: 'N2', pos: [0, .12, .62], look: [0, .02, -.18], fov: 32, d: [0, 0, -.03] },
  { ids: ['c46'], s: 'N1', pos: [-.60, .34, 1.30], look: [-.83, .20, .79], fov: 30, d: [.01, 0, -.02] },
  { ids: ['c47'], s: 'N1', pos: [-.62, .46, 1.22], look: [-.83, .26, .78], fov: 26, d: [.02, .01, -.02] },
  { ids: ['c48'], s: 'N1', pos: [-.98, .22, 1.16], look: [-.92, .16, .80], fov: 30, d: [0, 0, -.02] },
];

// ── thời gian ───────────────────────────────────────────────────────────
const T = id => V.L[id].t0, E = id => V.L[id].t1;
const DUR = id => Math.max(.001, E(id) - T(id));
const prog = (id, t) => clamp((t - T(id)) / DUR(id));
const orderOf = id => SHOTS.findIndex(s => s.ids.includes(id));
const num = id => parseInt(id.slice(1), 10);

// ── trạng thái: những đại lượng đổi theo thời gian ───────────────────────
// bếp: dây siết dần vào nắp hũ; thép dài ra; dây chùng dài ra
const tight1 = keys([[0, .22], [T('c2'), .22], [E('c2'), .55], [T('c3'), .55], [E('c3'), 1], [1, 1]]);
const wireK = keys([[0, 0], [T('c4'), 0], [E('c4'), 1], [1, 1]]);
const slackK = keys([[0, 0], [T('c5'), 0], [E('c5'), 1], [1, 1]]);
// trong dây: mạng bị kéo thẳng rồi tự cuộn lại
const netPull = keys([[0, 0], [T('c18'), 0], [E('c18'), .35], [T('c19'), .35], [E('c19'), 1], [T('c21'), 1], [E('c21'), 0], [1, 0]]);
const coilK = keys([[0, 1], [T('c18'), 1], [E('c19'), .04], [T('c21'), .04], [E('c21'), .9], [1, .9]]);
// vệt nhiệt quét qua mạng ở c22
// Vệt nhiệt quét qua **phần mạng mà máy quay nhìn thấy** (c22 nhìn vào khoảng
// x = 0.1 … 0.5), nếu quét cả mạng thì giữa câu nó ra khỏi khung và người xem
// không thấy nhiệt vào mạng.
const frontX = keys([[0, -.28], [T('c22'), -.28], [E('c22'), .55], [1, .55]]);
// dải treo: vùng lạnh thõng, vùng nóng thẳng
const sagCold = keys([[0, 0], [T('c23'), 0], [E('c23'), 1], [1, 1]]);
const sagTaut = keys([[0, 0], [T('c23'), 0], [E('c23'), 1], [1, 1]]);
// mạng nóng cuộn lại nhiều hơn mạng mát
const hotCoil = keys([[0, .55], [T('c24'), .55], [E('c24'), .10], [1, .10]]);
// một sợi ở tiền cảnh cuộn ra ở c17 (xem applyState)
const famCoil = keys([[0, 1], [T('c17'), 1], [E('c17'), .12], [1, .12]]);
// hai đoạn dây cùng một mức kéo: đoạn nóng co chặt hơn
const segHot = keys([[0, 0], [T('c25'), 0], [E('c25'), 1], [1, 1]]);
// bàn đo: nhiệt độ lên rồi xuống rồi lên lên (đo lúc mát, đo lúc nóng), độ co của
// dây treo, hai lần đo lực co, và hiệu ứng Joule
const tempK = keys([[0, 0], [T('c31'), 0], [E('c31'), .55], [T('c32'), .55], [E('c32'), 1], [E('c34'), 1], [T('c35'), 1], [E('c35'), 0], [T('c36'), 0], [E('c36'), 1], [1, 1]]);
const deskK = keys([[0, 0], [T('c31'), 0], [E('c32'), .25], [E('c33'), .55], [T('c35'), .55], [T('c35'), 0], [1, 0]]);
const gaugeRead = keys([[0, .30], [T('c36'), .30], [E('c36'), .52], [1, .52]]);
// kéo thêm: dây chun giãn ra, lực của nó vọt lên ở cuối; thép thì lên đều
const extK = keys([[0, 0], [T('c37'), 0], [E('c37'), .35], [E('c38'), 1], [1, 1]]);
const rubberK = keys([[0, .52], [T('c37'), .52], [E('c37'), .62], [T('c38'), .62], [E('c38'), .96], [1, .96]]);
const steelK = keys([[0, .10], [T('c37'), .10], [E('c37'), .30], [T('c38'), .30], [E('c38'), .74], [1, .74]]);
const jouleK = keys([[0, 0], [T('c39'), 0], [E('c39'), .25], [T('c40'), .25], [E('c40'), .42], [T('c41'), .42], [E('c41'), .55], [1, .55]]);

// ── các vật, đọc từ bộ dựng cảnh ───────────────────────────────────────
const K = N1.props, I = N2.props, D = N3.props;
const Kfocus = N1.focus;

// ── trạng thái theo câu ─────────────────────────────────────────────────
// id: câu đang kể; t: thời gian trong câu đó.
function applyState(id, t) {
  const k = num(id);

  // ── bếp ──
  const tk = tight1(t);
  K.band1.setTighten(tk);
  K.band1.position.y = .2055 - .005 * tk;          // dây ăn sâu vào nắp
  K.wire.setLen(1 + .06 * wireK(t));                  // thép dài ra khi nung
  K.wire.position.x = K.pinW.position.x + K.wire.len * (1 + .06 * wireK(t)) / 2;  // đầu ghim đứng yên
  K.slack.setLen(1 + .13 * slackK(t));                // dây chùng dài ra khi nung
  const cold = k >= 42;                                // hũ lấy ra từ tủ lạnh chỉ ở chương bốn
  K.jar2.visible = cold; K.band2.visible = cold; K.groove2.visible = cold;
  // luồng hơi nóng: chỉ khi đang thổi
  const blowing = (k >= 2 && k <= 8) || k >= 46;
  K.flowHot.visible = blowing;
  if (blowing) K.flowHot.update(t, 1);
  // máy sấy tóc chỉ xuất hiện từ câu hai: câu một là hũ với vòng dây, và một
  // chiếc máy chĩa vào ống kính làm mất chủ thể của câu đó.
  K.dry.visible = k >= 2;
  // tay cầm máy sấy tóc: máy đứng yên một chỗ, tay nắm tay cầm, cẳng tay lùi ra ngoài khung
  handK.visible = blowing;
  if (blowing) gripSide(handK, N1.dryGrip.x - .20, N1.dryGrip.y, N1.dryGrip.z, .95);
  // tay cuốn dây quanh nắp ở lời chốt
  handK2.visible = k === 47;
  if (handK2.visible) {
    // ngón tay phải chạm **đúng cái vòng dây** trên nắp (y = .2055), không
    // chuim xuống trong hũ: tay cầm xuống, ngón xuống nữa .32 m.
    gripDown(handK2, -.83, .50, .78, .5);
    handK2.rotation.y = -.35;
  }

  // ── trong sợi dây ──
  const pull = netPull(t), coil = coilK(t);
  for (const c of I.chains) c.setCoil(coil);
  const netScale = 1 + .16 * pull;
  I.net.scale.x = netScale;
  // tay kéo mạng ở c18–c21: tay **nắm đúng đầu mạng** (ngón tay chạm vào
  // hạt cuối cùng của mạng, ở x = .41·netScale) chứ không đứng lơ lửng bên
  // cạnh — khung của c18 và c21 phải giữ được chính cái tay đang kéo.
  // Đầu sợi **thẳng** (xích có nắm thẳng hai đầu) nên hạt cuối nằm đúng chỗ,
  // tay nắm được vào một hạt, không nắm vào một khoảng không.
  handI.visible = k >= 18 && k <= 21;
  if (handI.visible) {
    // bàn tay trong N2 **nhỏ hơn** (0,72) để nó không nuốt cả khung: kích thước
    // bàn tay của rig là 22 cm, quá to so với hạt xích 2 cm trong khung.
    // Tay nắm **đúng hạt ngoài cùng của sợi để nắm** (sợi thò ra khỏi mạng ở
    // x = .48·netScale): ngón tay ở local (.180, −.071) × .72, xoay 180° quanh
    // trục y → đầu ngón ở world (−.130, −.051) so với cổ tay. Không có sợi
    // để nắm thì tay nắm lơ lửng trong khoảng không và nhát này không có gì
    // để kéo.
    handI.position.set(.48 * netScale + .1296, .1186, -.08);
    handI.rotation.set(0, Math.PI, 0);
    handI.pose(1.0, .30);
  }
  // nhóm sợi tiền cảnh: chỉ ở c12–c14 và c16–c17, và ở c17 một sợi **cuộn
  // ra** — "chuỗi luôn ham quay về chỗ nào có nhiều chỗ trống nhất" phải có
  // hành động, không có thì câu đó chỉ là một hình tĩnh.
  // Sợi **đơn** (một dãy mắt xích chạy ngang khung) chỉ ở câu 10: đó là câu
  // nói "mỗi chuỗi là một dãy mắt xích dài", nên sợi phải là chủ thể của
  // khung. Ở câu khác nó chỉ là một hạt to lơ lửng sát ống kính — một vật lạ
  // không ai giải thích được.
  I.strand.visible = k === 10;
  const famOn = (k >= 10 && k <= 14) || (k >= 16 && k <= 17);
  I.fam.visible = famOn;
  if (famOn) {
    for (const c of I.fam.chains) c.setCoil(k === 17 ? famCoil(t) : 1);
  }
  // vệt nhiệt: quét qua mạng ở c22, đứng bên đoạn dây nóng ở c25
  I.front.visible = k === 22 || k === 25;
  if (k === 22) I.front.set(frontX(t), 1);
  if (k === 25) I.front.set(.13, .7);
  // dải treo: chỉ ở c23
  I.sag.visible = k === 23;
  if (I.sag.visible) I.sag.setSag(sagCold(t), sagTaut(t));
  // hai mạng cạnh nhau: mạng nóng cuộn lại nhiều hơn (c24)
  I.pair.visible = k === 24;
  if (I.pair.visible) {
    for (const c of I.cool) c.setCoil(.85);
    for (const c of I.hot) c.setCoil(hotCoil(t));
  }
  // hai đoạn dây cùng một mức kéo: đoạn nóng co chặt hơn (c25–c26)
  I.segA.visible = I.segB.visible = k === 25 || k === 26;
  if (I.segA.visible) {
    I.segA.setPull(0);
    I.segB.setPull(segHot(t));
  }

  // ── bàn đo ──
  const joule = k >= 39 && k <= 41;
  const ext = joule ? 0 : extK(t);
  const dk = joule ? 0 : deskK(t);
  D.th.setTemp(tempK(t));
  // dây treo: nóng lên dưới tải trọng thì co lại, quả cân được nâng theo.
  // Tới c39 dây được tháo khỏi móc, quấn quanh bầu nhiệt kế để đo hiệu ứng Joule.
  const hangK = 1 - .22 * dk;
  const holdK = joule ? 1.10 : (k >= 35 ? 1.10 + .28 * ext : hangK);
  D.band.visible = k < 39;
  D.band.setLen(holdK);
  const bandBot = N3.TOP - N3.BAND * holdK;
  D.wgt.position.y = bandBot - N3.DROP;
  D.wgt.visible = k <= 34;
  // lực kế: lúc mát, lúc nóng, rồi hai đường lực–giãn
  D.gauge.setReading(k >= 37 ? rubberK(t) : (k >= 35 ? gaugeRead(t) : .30));
  D.gauge2.setReading(k >= 37 ? steelK(t) : .10);
  // sợi thép: cứng, kéo cùng một khoảng thì nó chỉ giãn ra chút
  const wireK2 = 1 + .10 * ext;
  D.wire.setLen(wireK2);
  D.wire.position.y = N3.TOP - N3.BAND * wireK2 / 2;
  D.wgt2.position.y = N3.TOP - N3.BAND * wireK2 - N3.DROP;
  D.wgt2.visible = k >= 37 && k <= 38;
  // tay: giữ dây ở một vạch (c35–c36), kéo dây xuống (c37–c38), giật nhanh (c39–c41).
  // Tay đưa vào từ bên trái nên cẳng tay lùi ra ngoài khung, không che đồng hồ.
  // Bàn tay dài .27 m từ cổ tay: mu bàn tay ở +.11, ngón ở +.20…+.27 — nên cổ tay
  // đặt cách vật nó nắm khoảng .20 m.
  handD.visible = k >= 35 && k <= 38;
  if (handD.visible) gripSide(handD, N3.GX - .20, bandBot + .02, N3.Z + .03, .85);
  // tay giữ vật nặng của sợi thép
  handD2.visible = k >= 37 && k <= 38;
  if (handD2.visible) gripSide(handD2, N3.SX - .20, D.wgt2.position.y + .05, N3.Z + .03, .8);
  // tay cầm máy sấy tóc: chỉ khi đang thổi nóng vào dây
  const deskBlow = (k >= 31 && k <= 34) || k === 36;
  D.flowHot.visible = deskBlow;
  if (deskBlow) D.flowHot.update(t, 1);
  // máy sấy tóc chỉ vào khung từ câu 31: câu 28 là toàn cảnh bàn đo, và một
  // chiếc máy tím nằm ở tiền cảnh làm nó thành vật sáng nhất khung — thứ hoàn
  // toàn không liên quan tới câu "mình làm phép đo".
  D.dry.visible = k >= 31;
  handD3.visible = deskBlow;
  if (deskBlow) gripSide(handD3, N3.dryGrip.x, N3.dryGrip.y, N3.dryGrip.z, .85);
  // hiệu ứng Joule: dây quấn quanh bầu nhiệt kế, tay giật đuôi dây, cột thủy ngân dâng lên
  D.th2.visible = joule;
  D.jb.visible = joule;
  handD4.visible = joule;
  if (joule) {
    const amp = .5 + .5 * Math.abs(Math.sin(t * 13));
    D.jb.setYank(amp, t * 13);
    const tip = N3.JX + D.jb.tipX(D.jb.stretch(amp));
    gripSide(handD4, tip - .20, N3.JY - .018, N3.JZ + .02, .9);
    D.th2.setTemp(jouleK(t));
  }
}

// ── thẻ số: chỉ ba, và mỗi thẻ có câu lời đọc nó ──────────────────────
// Mũi tên của thẻ chỉ vào đỉnh cột thủy ngân — đúng cái con số đang đọc.
const CARDS = [
  { id: 'nhiet-do', text: '20 °C', anchor: 'nhiệt kế thủy ngân trong ống kính, có cột và thang số bên hông', at: tt => [D.th.position.x, D.th.position.y + .05 + .121 * tempK(tt), D.th.position.z], lines: ['c30'], ids: ['c30'], size: 30 },
  { id: 'nhiet-do-nong', text: '60 °C', anchor: 'nhiệt kế thủy ngân trong ống kính, có cột và thang số bên hông', at: tt => [D.th.position.x, D.th.position.y + .05 + .121 * tempK(tt), D.th.position.z], lines: ['c32'], ids: ['c32'], size: 30 },
  { id: 'luc-co', text: '14 %', anchor: 'đồng hồ đo lực mặt thang tròn có số, kim đỏ và móc treo dưới', at: () => [N3.GX + .045, .381, N3.Z], lines: ['c36'], ids: ['c36'], size: 30 },
];
for (const C of CARDS) {
  const i = orderOf(C.ids[0]);
  const t0 = i > 0 ? V.L[SHOTS[i - 1].ids[0]].t1 : V.L[C.ids[0]].t0;
  C.windows = [[t0, V.L[C.ids[C.ids.length - 1]].t1]];
}

// ── sự kiện của phim ────────────────────────────────────────────────────
const EV = [...V.ev];
const ev = (type, t, extra = {}) => EV.push({ type, t: +t.toFixed(3), ...extra });

// không khí: bếp ban sáng, bên trong sợi dây thì trầm, bàn đo thì đêm
{
  let i = 0;
  while (i < SHOTS.length) {
    const s = SHOTS[i].s;
    let j = i;
    while (j + 1 < SHOTS.length && SHOTS[j + 1].s === s) j++;
    const kind = s === 'N1' ? 'kitchen' : s === 'N3' ? 'night' : 'low';
    ev('amb', V.L[SHOTS[i].ids[0]].t0, { kind, t1: +V.L[SHOTS[j].ids[0]].t1.toFixed(3) });
    i = j + 1;
  }
}
// nhạc: mỗi chặng bắt đầu ở nhát của nó
for (const [id, cue] of [['c1', 'A'], ['c9', 'B'], ['c28', 'C'], ['c42', 'D'], ['c47', 'E']])
  ev('music', T(id), { cue });
ev('music', V.end - 2.2, { cue: 'end' });

// foley: chỉ khi vật thể thật sự kêu
const FOLEY = [
  ['c1', .10, 'glass_set', .22],
  ['c2', .05, 'whoosh_soft', .26], ['c2', .90, 'whoosh_soft', .22],
  ['c3', .30, 'plastic_set', .22],                       // dây siết vào nắp
  ['c4', .20, 'metal_tap', .18],                         // ghim
  ['c5', .25, 'metal_tap', .16],
  ['c13', .20, 'blip_up', .16],
  ['c16', .30, 'blip_up', .18],
  ['c18', .15, 'cloth_rustle', .22], ['c19', .40, 'whoosh_soft', .24],
  ['c21', .25, 'whoosh_soft', .22],                      // mạng cuộn lại
  ['c22', .30, 'whoosh_soft', .18],
  ['c24', .30, 'blip_up', .16],
  ['c25', .40, 'metal_tap', .18],                        // đoạn dây co, quả cân nâng lên
  ['c28', .15, 'glass_set', .20],
  ['c29', .20, 'metal_tap', .22],                        // quả cân đặt xuống
  ['c31', .05, 'whoosh_soft', .24], ['c31', .90, 'whoosh_soft', .20],
  ['c32', .25, 'blip_up', .20],                         // cột thủy ngân dâng lên
  ['c36', .35, 'blip_up', .22],                         // kim nhảy vạch
  ['c37', .30, 'cloth_rustle', .22], ['c37', 1.10, 'blip_up', .18],
  ['c39', .15, 'cloth_rustle', .20], ['c39', .70, 'blip_up', .18],
  ['c40', .25, 'blip_up', .22],
  ['c41', .20, 'blip_up', .24], ['c41', .80, 'blip_up', .22],
  ['c43', .20, 'plastic_set', .20],
  ['c47', .25, 'cloth_rustle', .24], ['c47', .75, 'plastic_set', .22],
];
for (const [id, dt, kind, v] of FOLEY) ev(kind, T(id) + dt, { v });

// ── dựng khung ──────────────────────────────────────────────────────────
window.DUR = V.end;
window.EV = EV;

function shotAt(t) {
  let i = 0;
  while (i < SHOTS.length - 1 && t >= V.L[SHOTS[i].ids[0]].t1) i++;
  const sh = SHOTS[i], id = sh.ids[0];
  const u = clamp((t - V.L[id].t0) / Math.max(.001, V.L[id].t1 - V.L[id].t0));
  return { i, sh, u, id };
}

window.render = t => {
  const s = shotAt(t), sh = s.sh, id = s.id;
  camera.fov = sh.fov;
  camera.position.set(sh.pos[0] + sh.d[0] * ss(s.u), sh.pos[1] + sh.d[1] * ss(s.u), sh.pos[2] + sh.d[2] * ss(s.u));
  camera.lookAt(sh.look[0], sh.look[1], sh.look[2]);
  camera.updateProjectionMatrix();

  applyState(id, t);

  const set = setOf[sh.s];
  if (set.update) set.update(t, { light: sh.s === 'N3' ? .85 : sh.s === 'N1' ? .82 : 1 });
  // Ma trận thế giới của cảnh phải được tính **trước** khi rig đo khung:
  // rig đo bằng tia ngay trong lúc dựng, mà bộ dựng cập nhật ma trận sau đó.
  // Không có bước này, máy đo một cảnh còn đứng ở vị trí của nhát trước — và
  // báo những vật thật sự ở trong khung là "không có gì".
  SC[sh.s].updateMatrixWorld(true);
  // mạng chuỗi tự rung mỗi khung
  for (const c of I.chains) c.update(t);
  for (const c of I.cool) c.update(t);
  for (const c of I.hot) c.update(t);
  for (const c of I.fam.chains) c.update(t);
  I.strand.update(t);

  const dist = camera.position.distanceTo(new THREE.Vector3(sh.look[0], sh.look[1], sh.look[2]));
  F.frame(SC[sh.s], {
    t,
    thick: clamp(1.95 + dist * .7, 2.0, 3.8),
    ref: dist,
    key: set.key || null,
    fade: Math.min(1, t / .3 + .2, (window.DUR - t) / .4),
    overlay: (g, tt) => {
      const out = [];
      const sub = V.sub(tt);
      if (sub) subtitle(g, sub);
      for (const C of CARDS) {
        const win = C.windows.find(w => tt >= w[0] && tt <= w[1]);
        if (!win) continue;
        const size = C.size ?? 30;
        g.save(); g.font = `900 ${size}px "Be Vietnam Pro"`;
        const bw = g.measureText(C.text).width + size, bh = size * 1.55;
        g.restore();
        const a = typeof C.at === 'function' ? C.at(tt) : C.at;
        const [ax, ay] = toScreen(new THREE.Vector3(a[0], a[1], a[2]), camera);
        let x = ax + bw / 2 + 26;
        let y = ay - bh / 2 - 44;
        x = clamp(x, bw / 2 + 30, 1916 - bw / 2);
        y = clamp(y, bh / 2 + 8, 876 - bh / 2 - 48);
        const b = label(g, C.text, x, y, tt, win[0], win[1], { id: C.id, size });
        if (b) out.push(b);
      }
      return out;
    },
  });
};

// ── mốc nhịp: mỗi câu một điểm trên khung ───────────────────────────────
// Điểm là chỗ thẻ của câu bám vào (nếu câu có thẻ), không thì là điểm máy đang nhìn.
// markBeats nhận một hàm đẩy sự kiện, không phải mảng sự kiện.
F.markBeats(ev, V, (id, t) => {
  const C = CARDS.find(c => c.ids.includes(id));
  if (C) {
    const a = C.at(t);
    return toScreen(new THREE.Vector3(a[0], a[1], a[2]), camera);
  }
  const s = shotAt(t);
  return toScreen(new THREE.Vector3(s.sh.look[0], s.sh.look[1], s.sh.look[2]), camera);
});

// chẩn đoán: nhát đang quay và trạng thái
window.DIAG = t => {
  const s = shotAt(t);
  return {
    shot: s.i + 1, ids: s.sh.ids, u: +s.u.toFixed(3),
    pos: s.sh.pos.map(v => +v.toFixed(3)), look: s.sh.look.map(v => +v.toFixed(3)),
    cards: CARDS.map(c => [c.id, c.ids.join(','), c.windows.map(w => [+w[0].toFixed(2), +w[1].toFixed(2)])]),
  };
};

window.TEXTS = t => { window.render(t); return F.texts(); };
window.__SHOTS = SHOTS;   // TẠM: đo góc máy; xoá trước khi bàn giao
await document.fonts.load('900 54px "Be Vietnam Pro"');
window.render(0);
window.READY = true;
