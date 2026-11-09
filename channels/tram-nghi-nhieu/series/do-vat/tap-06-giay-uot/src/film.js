// film.js — trang phim của tập 06: 43 nhát, một câu lời kể một nhát hình.
//
// Ba nơi chốn: N1 bếp buổi sáng · N2 trong tờ giấy · N3 bàn đo ban đêm.
// Lời kể đi một chiều: N1 (hiện tượng: tay ướt làm rách giấy, tay khô thì không)
// → N2 (cơ chế: sợi cellulose, nhóm hydroxyl, liên kết hydrogen, nước lấn vào,
// sợi trượt ra và nứt lan) → N3 (phép đo: lực kế, đồng hồ độ ẩm, giấy ướt,
// giấy có nhựa, giấy đã sấy) → N1 (quay lại: tay khô trên tờ khô, cạnh tờ đã rách).
//
// Quy tắc số: chỉ tám thẻ chữ được lên hình — 50 % (c27), 90 % (c29), 3–10 % (c34),
// 15 % (c35), 1/2 (c40) — cùng ba thẻ tên vật: sợi cellulose (c9), nhóm hydroxyl
// (c10), liên kết hydrogen (c11). Mỗi thẻ có câu lời đọc nó.
//
// Chia để dễ soi: bảng nhát ở `src/shots.js`, phần diễn (vật thể và bàn tay) ở
// `src/acts.js`, bộ dựng cảnh ở `src/set.js`, danh mục vật ở `src/props.js`.
import * as THREE from 'three';
import { film, label, subtitle, toScreen, cardWindow } from '../../../../rig/render.js';
import { keys, ss, clamp } from '../../../../rig/kit.js';
import { build } from './timeline.js';
import { loadVoice } from '../../../../rig/voice.js';
import { buildKitchen, buildInside, buildDesk } from './set.js';
import { makeActs } from './acts.js';
import { SHOTS } from './shots.js';

const V = await loadVoice(build);
const F = film({ fov: 36 }), camera = F.camera;

// ── ba nơi chốn ─────────────────────────────────────────────────────────
const SC = { N1: new THREE.Scene(), N2: new THREE.Scene(), N3: new THREE.Scene() };
const N1 = buildKitchen(SC.N1);
const N2 = buildInside(SC.N2);
const N3 = buildDesk(SC.N3);
const setOf = { N1, N2, N3 };

// ── phần diễn: vật thể và bàn tay ───────────────────────────────────────
const acts = makeActs(V, { N1, N2, N3 }, SC);

// ── thời gian ───────────────────────────────────────────────────────────
const T = id => V.L[id].t0, E = id => V.L[id].t1;
const DUR = id => Math.max(.001, E(id) - T(id));
const prog = (id, t) => clamp((t - T(id)) / DUR(id));
const orderOf = id => SHOTS.findIndex(s => s.ids.includes(id));

// ── các vật, đọc từ bộ dựng cảnh ───────────────────────────────────────
const K = N1.props, I = N2.props, D = N3.props;

// ── thẻ chữ: chỉ tám, và mỗi thẻ có câu lời đọc nó ────────────────────
// Mũi tên của thẻ chỉ vào đúng vật đang được nói tới. Số trong lời kể viết
// bằng chữ ("năm mươi phần trăm"), số trên thẻ viết bằng số ("50 %").
const CARDS = [
  { id: 'soi-cellulose', text: 'sợi cellulose', lines: ['c9'], anchor: 'sợi cellulose tròn màu vàng nhạt, có nhóm hydroxyl trắng dính hai bên', size: 26, at: () => [I.fA.position.x + .14, I.fA.position.y, I.fA.position.z] },
  { id: 'nhom-hydroxyl', text: 'nhóm hydroxyl', lines: ['c10'], anchor: 'sợi cellulose tròn màu vàng nhạt, có nhóm hydroxyl trắng dính hai bên', size: 26, at: () => [I.fA.position.x - .04, I.fA.position.y + .022, I.fA.position.z] },
  { id: 'lien-ket-hydrogen', text: 'liên kết hydrogen', lines: ['c11'], anchor: 'liên kết hydrogen: móc vàng nối hai sợi giấy, hai đầu cắm vào hai cụm trắng', size: 26, at: () => (I.heroBonds[0] ? [I.heroBonds[0].position.x, I.heroBonds[0].position.y, I.heroBonds[0].position.z] : [0, 0, .16]) },
  { id: 'do-am-50', text: '50 %', lines: ['c27'], anchor: 'đồng hồ độ ẩm mặt thang tròn, kim xanh và chân đứng', size: 30, at: () => [D.hygro.position.x + .016, D.hygro.position.y + .016, D.hygro.position.z] },
  { id: 'do-am-90', text: '90 %', lines: ['c29'], anchor: 'đồng hồ độ ẩm mặt thang tròn, kim xanh và chân đứng', size: 30, at: () => [D.hygro.position.x + .016, D.hygro.position.y + .016, D.hygro.position.z] },
  { id: 'bet-uot', text: '3–10 %', lines: ['c34'], anchor: 'dải giấy dài mỏng bị ướt, sẫm màu và nhăn', size: 30, at: () => [D.strip.position.x + .016, D.strip.position.y + .052, D.strip.position.z] },
  // Thẻ '15 %' nói về **dải giấy ướt**, nên mũi tên phải chỉ vào dải giấy, không
  // phải vào mặt thang lực kế ngay dưới nó. Móc neo ở nửa trên của dải.
  { id: 'nguong-15', text: '15 %', lines: ['c35'], anchor: 'dải giấy dài mỏng bị ướt, sẫm màu và nhăn', size: 30, at: () => [D.strip.position.x + .016, D.strip.position.y + .052, D.strip.position.z] },
  { id: 'sau-khi-say', text: '1/2', lines: ['c40'], anchor: 'tờ giấy nhăn dày sau khi ướt rồi sấy, còn vệt ẩm hằn trên mặt', size: 30, at: () => [D.dried.position.x, D.dried.position.y + .012, D.dried.position.z] },
];
// Cửa sổ của mỗi thẻ lấy bằng `cardWindow` của rig: thẻ hiện từ **hết câu trước** câu
// của nó, để người xem kịp đọc trước khi lời kể tới.
for (const C of CARDS) {
  const w = cardWindow(C, V);
  C.windows = [[w.t0, w.t1]];
  C.ids = C.lines;
}

// ── sự kiện của phim ────────────────────────────────────────────────────
const EV = [...V.ev];
const ev = (type, t, extra = {}) => EV.push({ type, t: +t.toFixed(3), ...extra });

// không khí: bếp ban sáng, bên trong tờ giấy thì trầm, bàn đo thì đêm
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
for (const [id, cue] of [['c1', 'A'], ['c9', 'B'], ['c24', 'C'], ['c40', 'D'], ['c43', 'E']])
  ev('music', T(id), { cue });
ev('music', V.end - 2.2, { cue: 'end' });

// foley: chỉ khi vật thể thật sự kêu
const FOLEY = [
  ['c1', .15, 'pour', .20],                       // nước từ tay ướt xuống giấy
  ['c2', .35, 'paper_tear', .26],                 // giấy rách dưới ngón tay
  ['c2', .70, 'paper_slide', .16],
  ['c3', .30, 'hand_tap', .18],                   // tay khô đặt lên giấy
  ['c4', .20, 'paper_slide', .14],
  ['c5', .30, 'paper_tear', .28],                 // tay kéo mép giấy ướt
  ['c7', .55, 'whoosh_soft', .22],                // máy đẩy về phía mặt giấy
  ['c8', .40, 'whoosh_soft', .26],                // máy đi xuyên qua mặt giấy
  ['c13', .10, 'whoosh_soft', .20],               // nước bay vào mạng sợi
  ['c14', .30, 'blip_up', .16],                   // móc đổi màu
  ['c16', .35, 'blip_down', .18],                 // móc cũ tắt đi
  ['c17', .25, 'whoosh_soft', .18],               // sợi phồng ra
  ['c18', .30, 'whoosh_soft', .20],               // hai sợi trượt
  ['c19', .40, 'paper_crumple', .22],             // tay kéo hai sợi
  ['c20', .30, 'paper_tear', .24],                // vệt nứt lan
  ['c21', .45, 'paper_tear', .26],                // sợi bị kéo tuột khỏi mạng
  ['c23', .20, 'whoosh_soft', .24],               // máy lui ra
  ['c24', .25, 'cup_set', .18],                   // bàn đo: vật đặt xuống
  ['c25', .30, 'metal_tap', .18],                 // dải giấy vào kẹp
  ['c26', .35, 'blip_up', .20],                   // kim lực kế dâng lên
  ['c26', .90, 'paper_tear', .16],
  ['c28', .30, 'blip_up', .18],                   // kim độ ẩm chạy lên
  ['c29', .35, 'blip_down', .20],                 // kim lực kế tụt xuống
  ['c31', .30, 'paper_slide', .18],               // dải giấy giãn dài
  ['c33', .20, 'pour', .24],                      // rót nước xuống dải giấy
  ['c33', .75, 'paper_slide', .16],
  ['c34', .35, 'paper_tear', .30],                // dải giấy ướt rách
  ['c34', .55, 'blip_up', .22],                   // kim lực kế vọt lên rồi dừng
  ['c38', .25, 'paper_slide', .18],               // mẻ khăn giấy và túi giấy
  ['c37', .55, 'reveal_soft', .16],               // góc giấy khăn bị cắt, lộ móc nối
  ['c41', .35, 'paper_crumple', .26],             // tay ấn giấy đã sấy, giấy rạn
  ['c42', .25, 'hand_tap', .18],                  // tay khô đặt lên giấy khô
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

  acts.applyState(id, t);

  const set = setOf[sh.s];
  if (set.update) set.update(t, { light: sh.s === 'N3' ? .85 : sh.s === 'N1' ? .82 : 1 });
  // Ma trận thế giới của cảnh phải được tính **trước** khi rig đo khung:
  // rig đo bằng tia ngay trong lúc dựng, mà bộ dựng cập nhật ma trận sau đó.
  SC[sh.s].updateMatrixWorld(true);

  const dist = camera.position.distanceTo(new THREE.Vector3(sh.look[0], sh.look[1], sh.look[2]));
  F.frame(SC[sh.s], {
    t,
    // Viền mực phải **đậm như bản mẫu của kênh**: sàn 2,9 px cho mọi cảnh,
    // kể cả cảnh cận trong tờ giấy. Viền mảnh 2 px ở cảnh cận làm mọi vật trông
    // như sticker dán, không phải vật dựng trong khung.
    thick: clamp(1.95 + dist * .7, 2.9, 3.8),
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
window.SCENES = SC; window.CAM = camera; window.THREE_NS = THREE; window.RND = F.renderer;   // để soi cảnh khi dựng thử
window.P1 = N1; window.P2 = N2; window.P3 = N3;
await document.fonts.load('900 54px "Be Vietnam Pro"');
window.render(0);
window.READY = true;
