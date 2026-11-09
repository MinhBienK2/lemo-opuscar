// Vì sao điện thoại nóng lúc sạc? — trang phim: 95 nhát, một câu một hình.
//
// Mỗi nhát bám vào câu nó mang (V.L[id].t0 → V.L[id].t1) nên nhịp quay đúng với lời kể.
// Năm nơi chốn: N1 bàn cạnh giường · N2 trong củ sạc · N3 trong điện thoại ·
// N4 trong túi pin · N5 vỏ máy và bàn tay.
//
// Lời kể đi một chiều: N1 (hiện tượng) → N2 (trong củ sạc) → N3 (trong máy:
// mạch sạc, rồi sạc nhanh và cảm biến nhiệt) → N4 (trong túi pin) →
// N5 (vỏ máy, bàn tay, ốp case) → N1 (thí nghiệm hai máy, rồi khép lại).
//
// Quy tắc số: chỉ bốn con số được lên hình — 60 W (c14, c89), 20 V (c28),
// 4 V (c28), 45 °C (c76). Mỗi con số đều có câu lời đọc nó.
import * as THREE from 'three';
import { film, label, subtitle, toScreen } from '../../../../rig/render.js';
import { keys, ss, lerp, clamp, toon, mesh, canvasTex, fxLayer } from '../../../../rig/kit.js';
import { build } from './timeline.js';
import { loadVoice } from '../../../../rig/voice.js';
import { buildNightstand, buildChargerIn, buildPhoneIn, buildCellIn, buildShell } from './set.js';

const V = await loadVoice(build);
const F = film({ fov: 38 }), camera = F.camera;

// ── năm nơi chốn ─────────────────────────────────────────────────────────
const SC = { N1: new THREE.Scene(), N2: new THREE.Scene(), N3: new THREE.Scene(), N4: new THREE.Scene(), N5: new THREE.Scene() };
const N1 = buildNightstand(SC.N1);
const N2 = buildChargerIn(SC.N2);
const N3 = buildPhoneIn(SC.N3);
const N4 = buildCellIn(SC.N4);
const N5 = buildShell(SC.N5);
const setOf = { N1, N2, N3, N4, N5 };

// Bộ dựng cảnh có thể tự dựng cảnh của nó; lấy scene thật bằng cách đi lên cha.
function sceneOf(set, key) {
  let o = set && set.group;
  while (o && !o.isScene) o = o.parent;
  if (o) return o;
  if (set && set.group) SC[key].add(set.group);   // bộ dựng cảnh không tự đặt mình vào scene
  return SC[key];
}

// ── vật của riêng tập phim (hợp đồng API.md) ─────────────────────────────
// Dòng hạt ở N1, vệt nhiệt ở cổng máy, bàn tay, hai nhiệt kế thử nghiệm,
// ba luồng nhiệt dồn vào vỏ máy ở N5.
let P = {};
try { P = await import('./props.js'); } catch (e) { console.warn('tap-02: không đọc được src/props.js', e); }
const {
  createCurrentStream, createHeatPlume, createHeatSquiggle, createHand, createThermometer,
} = P;

// ── toạ độ thật của vật ở N1 (đọc từ bộ dựng cảnh, không gõ tay) ────────
const wp = (o, out = new THREE.Vector3()) => { o.updateWorldMatrix(true, false); return out.setFromMatrixPosition(o.matrixWorld); };
const bb = o => {
  const b = new THREE.Box3();
  o.updateWorldMatrix(true, true);
  o.traverse(c => {
    if (!c.visible || !c.geometry) return;
    if (!c.geometry.boundingBox) c.geometry.computeBoundingBox();
    b.union(c.geometry.boundingBox.clone().applyMatrix4(c.matrixWorld));
  });
  return b;
};
const frameOf = o => {
  const b = bb(o);
  if (b.isEmpty()) return { c: wp(o).clone(), r: .02 };
  return { c: b.getCenter(new THREE.Vector3()), r: Math.max(b.getSize(new THREE.Vector3()).length() * .5, .012) };
};
const ctr = o => frameOf(o).c;
const rad = o => frameOf(o).r;
const P3 = (o, fb = [0, 0, 0]) => (o ? ctr(o).toArray() : fb);

const PH = P3(N1.phone, [-.10, 0, .06]);      // điện thoại đang sạc
const CH = P3(N1.charger, [-.62, .015, -.34]); // củ sạc
const SO = P3(N1.socket, [-.78, .14, -.60]);  // ổ cắm trên tường
const P2 = P3(N1.phone2, [.02, 0, .26]);      // máy thứ hai (có case)
const LP = P3(N1.lamp, [.92, 0, -.30]);       // đèn bàn

// cổng máy: đọc thẳng từ vật, không gõ tay
const plugOf = (o, key = 'plugPoint') => {
  const p = o && o.props && o.props[key];
  if (!p) return null;
  o.group.updateWorldMatrix(true, false);
  return o.group.localToWorld(p.clone());
};
const PORT_V = plugOf(N1.phone) || new THREE.Vector3(PH[0] - .07, PH[1] + .006, PH[2]);
const PORT = PORT_V.toArray();
const PORT2_V = plugOf(N1.phone2) || new THREE.Vector3(P2[0] - .07, P2[1] + .006, P2[2]);
const PORT2 = PORT2_V.toArray();
// cổng USB-C của một củ sạc
const chgPort = o => {
  const p = o && o.props && o.props.usbPort;
  if (!p) return null;
  o.group.updateWorldMatrix(true, false);
  return o.group.localToWorld(p.clone());
};
const CHG1_P = chgPort(N1.charger);
const CHG2_P = chgPort(N1.charger2);
// giữa hai cái máy thí nghiệm
const MID2 = [(PH[0] + P2[0]) / 2, .01, (PH[2] + P2[2]) / 2];

// ── các vật của tập phim tự dựng ─────────────────────────────────────────
// Đặt vật vào bộ dựng cảnh (bộ dựng cảnh có thể tự dựng scene của nó).
const put = (set, obj, key) => {
  const host = (set && set.group) ? set.group : sceneOf(set, key);
  host.add(obj);
  return obj;
};
const POWER = new Map();   // vật có update(t, power) → đường sức mạnh của nó

// Vật của tập phim tự cập nhật: props trả về { group, update }, mà group
// không mang hàm update, nên ta gọi tay và đánh dấu để không bị gọi hai lần.
const OWN = [];
const own = o => {
  if (!o) return o;
  OWN.push(o);
  if (o.group) o.group.userData.ownUpdate = true;
  return o;
};

let MY = { stream: null, stream2: null, plume: null, hand: null, th1: null, th2: null };

if (createCurrentStream) {
  const pts = [
    new THREE.Vector3(SO[0], SO[1] - .02, SO[2] + .05),
    new THREE.Vector3(SO[0] + .03, SO[1] - .12, SO[2] + .07),
    new THREE.Vector3((SO[0] + CH[0]) / 2, .045, (SO[2] + CH[2]) / 2 + .07),
    // điểm gác của dòng hạt trên củ sạc: nâng lên 3 cm và lệch sang góc
    // trước-trái để dòng hạt đi QUANH nhãn in, không đè lên chữ "60 W"
    new THREE.Vector3(CH[0] - .020, CH[1] + .030, CH[2] + .020),
    new THREE.Vector3((CH[0] + PORT[0]) / 2, .007, (CH[2] + PORT[2]) / 2),
    new THREE.Vector3(PORT[0], PORT[1], PORT[2]),
  ];
  MY.stream = own(createCurrentStream(pts, { n: 70, speed: 1, color: '#8fe3ff', size: .0016 }));
  put(N1, MY.stream.group, 'N1');
  // dòng điện ở N1: cắm sạc thì chạy, sạc chậm (c88) thì hạt thưa, rút sạc (c91) thì tắt
  POWER.set(MY.stream, (t, id) => {
    if (id === 'c91' && t > V.L['c91'].t1 - .4) return 0;
    return 1;   // c88: hạt phải THƯA (setDensity), không nhỏ xuống
  });
}
if (createHeatPlume) {
  MY.plume = own(createHeatPlume(new THREE.Vector3(PORT[0] + .004, PORT[1] + .004, PORT[2]), { n: 40, color: '#ff9a3c' }));
  put(N1, MY.plume.group, 'N1');
}
// dòng điện tới máy thứ hai: ổ → củ sạc thứ hai → dây → cổng máy
if (createCurrentStream && CHG2_P) {
  const C2 = CHG2_P;
  MY.stream2 = own(createCurrentStream([
    new THREE.Vector3(-.7645, .138, -.592),
    new THREE.Vector3(C2.x, C2.y + .010, C2.z - .004),
    new THREE.Vector3((C2.x + PORT2[0]) / 2, .028, (C2.z + PORT2[2]) / 2),
    new THREE.Vector3(PORT2[0], PORT2[1], PORT2[2]),
  ], { n: 46, speed: 1, color: '#8fe3ff' }));
  put(N1, MY.stream2.group, 'N1');
  POWER.set(MY.stream2, t => (t >= T('c61') && t < T('c79')) ? 1 : 0);
}
if (createHand) {
  MY.hand = own(createHand());
  put(N1, MY.hand.group, 'N1');
}
if (createThermometer) {
  MY.th1 = own(createThermometer());  // trên lưng máy KHÔNG có case
  MY.th2 = own(createThermometer());  // trên lưng máy CÓ case
  put(N1, MY.th1.group, 'N1'); put(N1, MY.th2.group, 'N1');
  MY.th1.group.position.set(PH[0], PH[1] + .0045, PH[2]);   // đặt thẳng lên lưng máy
  MY.th2.group.position.set(P2[0], P2[1] + .016, P2[2]);     // trên lưng máy CÓ case
}

// ── trục quay của máy: bọc vật để xoay quanh giữa nó ────────────────────
function pivot(obj) {
  if (!obj || !obj.parent) return null;
  const p = wp(obj).clone(), c = frameOf(obj).c.clone();
  const w = new THREE.Group();
  obj.parent.add(w);
  w.add(obj);
  w.position.copy(c);
  obj.position.copy(p).sub(c);
  w.userData.c = c;              // tâm quay, giữ nguyên để máy không trôi
  return w;
}
const PIV = {
  // chỉ máy đang sạc được xoay: máy thứ hai có ốp case, bộ dựng cảnh đã đặt
  // ốp case đúng chỗ, đừng đụng vào nó
  phone: (N1.phone && N1.phone.group) ? pivot(N1.phone.group) : null,
  // máy thứ hai (không cắm sạc) được lật úp để thấy lưng máy ở câu c83
  phone2: (N1.phone2 && N1.phone2.group) ? pivot(N1.phone2.group) : null,
};

// ── màn hình nằm ở mặt nào: nhìn bằng vật sáng mạnh nhất trong máy ────────
function screenUp(phone) {
  if (!phone || !phone.group) return true;
  const base = wp(phone.group).y;
  let top = -Infinity, found = false;
  phone.group.traverse(o => {
    if (!o.isMesh || !o.material) return;
    const m = o.material;
    if (!(m.isMeshBasicMaterial || m.emissive)) return;
    const c = bb(o).getCenter(new THREE.Vector3());
    if (c.y > top) top = c.y;
    found = true;
  });
  return !found ? true : top >= base;
}
const BASE_UP = screenUp(N1.phone);       // máy được dựng với màn hình ở mặt trên?
const R_DOWN = BASE_UP ? Math.PI : 0;     // màn hình úp xuống bàn
const R_UP = BASE_UP ? 0 : Math.PI;       // màn hình ngửa lên

// ── 93 nhát: mỗi câu một hình ────────────────────────────────────────────
// sh(nơi, câu, tiêu cự, vị trí máy, điểm nhìn, đẩy máy trong nhát)
// p và l là mảng toạ độ, hoặc hàm trả về mảng (dùng cho các nơi chốn bên trong máy).
const sh = (s, id, fov, p, l, d = [0, 0, 0]) => ({ s, ids: [id], fov, p, l, d });

// quanh một vật: hướng dir, cự ly = bán kính của vật × k
const ORB = (o, dir, k = 2.4) => () => {
  if (!o) return [0, 0, .3];
  const f = frameOf(o), d = new THREE.Vector3(dir[0], dir[1], dir[2]).normalize().multiplyScalar(f.r * k);
  return [f.c.x + d.x, f.c.y + d.y, f.c.z + d.z];
};
const AT = o => () => { if (!o) return [0, 0, 0]; const c = ctr(o); return [c.x, c.y, c.z]; };
const MID = (a, b) => () => {
  if (!a || !b) return [0, 0, 0];
  const ca = ctr(a), cb = ctr(b);
  return [(ca.x + cb.x) / 2, (ca.y + cb.y) / 2, (ca.z + cb.z) / 2];
};
// quanh một điểm neo (đọc từ bộ dựng cảnh): cự ly cho trước, không theo bán kính vật
const ORBP = (pt, dir, dist = .1) => () => {
  const p = typeof pt === 'function' ? pt() : pt;
  const d = new THREE.Vector3(dir[0], dir[1], dir[2]).normalize().multiplyScalar(dist);
  return [p[0] + d.x, p[1] + d.y, p[2] + d.z];
};
// quanh giữa hai vật: tâm là điểm giữa chúng, cự ly theo bán kính của vật lớn hơn
const ORB2 = (a, b, dir, k = 2.4) => () => {
  if (!a || !b) return [0, 0, .3];
  const c = ctr(a).clone().add(ctr(b)).multiplyScalar(.5);
  const r = Math.max(frameOf(a).r, frameOf(b).r);
  const d = new THREE.Vector3(dir[0], dir[1], dir[2]).normalize().multiplyScalar(r * k);
  return [c.x + d.x, c.y + d.y, c.z + d.z];
};

// quanh một vật nhỏ: cự ly TÚT để được (ORB tính theo bán kính, mà linh kiện
// nhỏ thì bán kính nhỏ quá, máy quay lọt vào trong vật)
const MAC = (o, dir, dist = .05) => () => {
  if (!o) return [0, 0, .3];
  const c = ctr(o).clone();
  const d = new THREE.Vector3(dir[0], dir[1], dir[2]).normalize().multiplyScalar(dist);
  return [c.x + d.x, c.y + d.y, c.z + d.z];
};
const CHG2 = N2.charger, TRF = N2.transformer, SNK = N2.heatSink;
const STR2 = N2.stream, PLM2 = N2.plume;
const BRD = N3.board, PRT = N3.port, IND = N3.inductor, SNS = N3.sensor, BAT = N3.battery, CHP3 = N3.chip, STR3 = N3.stream;
const PH3 = N3.phone, LID3 = N3.lid;
const LAY = N4.layers, STR4 = N4.stream, PLM4 = N4.plume, PCH4 = N4.pouch;
const BCK = N5.back, CAS5 = N5.case, HND5 = N5.hand, PLM5 = N5.plume, SQG5 = N5.squiggle;

// ── con tụ trên bo mạch, cạnh cuộn cảm (c30) ────────────────────────────
// Bo mạch của tập có sẵn những con tụ (vỏ xanh có sọc); nếu không tìm thấy
// thì tự dựng một con đặt cạnh cuộn cảm, để câu "một con tụ" có hình.
function findCapacitor() {
  const root = BRD && BRD.group ? BRD.group : BRD;
  if (!root || !root.traverse) return null;
  const ind = IND ? ctr(IND) : new THREE.Vector3();
  let best = null, bestD = Infinity;
  root.traverse(o => {
    if (!o.isMesh || !o.material || !o.material.color) return;
    const c = o.material.color;
    const named = /capacitor|condens|\btu\b/i.test(`${o.name || ''} ${o.userData?.part || ''}`);
    const blue = c.b > c.r * 1.2 && c.b > .12;      // vỏ tụ: xanh lam
    if (!named && !blue) return;
    const p = ctr(o);
    const d = p.distanceTo(ind);
    if (d < bestD) { bestD = d; best = p; }
  });
  return best;
}
let CAP_PT = findCapacitor();
if (!CAP_PT && IND) {
  const g = new THREE.Group();
  g.name = 'tu-dien';
  g.add(mesh(new THREE.CylinderGeometry(.0030, .0030, .0085, 16), toon('#2d4f8f'), [0, .0043, 0]));
  g.add(mesh(new THREE.CylinderGeometry(.0031, .0031, .0085, 16, 1, true, 0, .7), toon('#cfd8e6'), [0, .0043, 0]));
  g.add(mesh(new THREE.CylinderGeometry(.0028, .0028, .0008, 16), toon('#c4cad3'), [0, .0089, 0]));
  const brd = BRD && BRD.group ? BRD.group : null;
  let q = new THREE.Quaternion();
  if (brd) { brd.updateWorldMatrix(true, false); brd.matrixWorld.decompose(new THREE.Vector3(), q, new THREE.Vector3()); }
  const ind = ctr(IND);
  const off = new THREE.Vector3(.011, .003, .006).applyQuaternion(q);
  g.position.copy(ind.clone().add(off));
  g.quaternion.copy(q);
  put(N3, g, 'N3');
  CAP_PT = g.position.clone();
}
// nhìn vào giữa cuộn cảm và con tụ: một câu, một hình có cả hai
const IND_CAP = CAP_PT ? () => {
  const a = ctr(IND), b = CAP_PT;
  return [(a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2];
} : AT(IND);

// ── ba nguồn nhiệt TRONG máy dồn vào vỏ máy (c50–c52) ───────────────────
// Mạch sạc, cục pin và con chip. Nhiệt của củ sạc không có mặt ở đây:
// nó đã thoát ra ở vỏ củ sạc (c23), không chảy vào máy.
const HEAT3 = [];
if (createHeatPlume || createHeatSquiggle) {
  const b = BCK ? bb(BCK) : new THREE.Box3();
  const c = b.isEmpty() ? new THREE.Vector3() : b.getCenter(new THREE.Vector3());
  const top = b.isEmpty() ? 0 : b.max.y;
  const SRC = [
    [c.x - .045, c.z + .012],   // mạch sạc
    [c.x, c.z - .012],          // cục pin
    [c.x + .045, c.z + .008],   // con chip
  ];
  for (const [sx, sz] of SRC) {
    if (createHeatPlume) {
      const p = own(createHeatPlume(new THREE.Vector3(sx, top - .002, sz), { n: 11, color: '#ff8a3c' }));
      put(N5, p.group, 'N5');
      HEAT3.push(p);
    }
  }
}

// ── hai vùng nóng còn lại trong máy: con chip và cục pin (c41, c50) ──────
// Nhiệt là thứ vô hình nên vẽ bằng hạt; chỉ hiện ở đúng nhát kể về chúng.
const CHIPHEAT = createHeatPlume ? own(createHeatPlume(new THREE.Vector3(), { n: 12, color: '#ff8a3c', height: .026 })) : null;
const CELLHEAT = createHeatPlume ? own(createHeatPlume(new THREE.Vector3(), { n: 10, color: '#ff8a3c', height: .022 })) : null;
if (CHIPHEAT) { const p = P3(CHP3); CHIPHEAT.group.position.set(p[0], p[1] + .004, p[2]); put(N3, CHIPHEAT.group, 'N3'); }
// Hơi nóng từ cái máy thứ hai (không cắm sạc): máy nóng ở một góc lưng (c83),
// và hơi nóng đó phải thấy được (c81–c84) — nếu không thì cảnh đứng yên.
const HOT2P = createHeatPlume ? own(createHeatPlume(new THREE.Vector3(), { n: 26, color: '#ff8a3c', size: .0022 })) : null;
if (HOT2P) { HOT2P.group.position.set(P2[0], P2[1] + .008, P2[2]); put(N1, HOT2P.group, 'N1'); }
if (CELLHEAT) { const p = P3(BAT); CELLHEAT.group.position.set(p[0] - .004, p[1] + .004, p[2]); put(N3, CELLHEAT.group, 'N3'); }

// ── vệt nóng lệch ở một góc lưng máy (c83) ─────────────────────────────
// Cái máy thứ hai nằm sấp trên bàn; ta lật nó úp xuống để thấy lưng máy,
// rồi đặt một vệt nóng lệch ở một góc của lưng (không phải trên màn hình).
// Vệt nóng là một quầng sáng mềm, viền mờ dần — không phải một miếng tròn dán.
function hotGlow() {
  return canvasTex(128, 128, x => {
    const gr = x.createRadialGradient(64, 64, 2, 64, 64, 62);
    gr.addColorStop(0, 'rgba(255,168,92,.92)');
    gr.addColorStop(.42, 'rgba(228,88,48,.50)');
    gr.addColorStop(1, 'rgba(228,88,48,0)');
    x.clearRect(0, 0, 128, 128);
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
  });
}
const PATCH = { group: null, pos: [0, 0, 0] };
if (PIV.phone2 && N1.phone2 && N1.phone2.group) {
  const b = bb(N1.phone2.group);
  if (!b.isEmpty()) {
    const c = b.getCenter(new THREE.Vector3());
    // đích: góc của lưng máy sau khi lật (mặt lưng ngửa lên)
    const tgt = new THREE.Vector3(b.max.x - .009, b.max.y + .0008, b.max.z - .009);
    PATCH.pos = [tgt.x, tgt.y, tgt.z];
    // trục quay xoay π quanh X: vị trí trong khung của trục = R(π)·(đích − tâm)
    const L = new THREE.Vector3(tgt.x - c.x, -(tgt.y - c.y), -(tgt.z - c.z));
    const patch = new THREE.Group();
    patch.name = 'vet-nong-lung-may';
    const disc = new THREE.Mesh(
      new THREE.PlaneGeometry(.030, .030),
      new THREE.MeshBasicMaterial({
        map: hotGlow(), transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide,
      })
    );
    disc.rotation.x = Math.PI / 2;      // mặt đĩa nhìn ra +Y của khung trục
    patch.add(disc);
    patch.position.copy(L);
    patch.visible = false;
    PIV.phone2.add(patch);
    PATCH.group = patch;
  }
}

// ── vệt ấm lớn và mờ trên lưng máy thứ hai (c82) ──────────────────────────
// Câu c82 nói cả lưng máy ấm lên, không chỉ một góc: vệt gradient rộng hơn.
const WARM2 = { group: null };
if (PIV.phone2 && N1.phone2 && N1.phone2.group) {
  const b = bb(N1.phone2.group);
  if (!b.isEmpty()) {
    const c = b.getCenter(new THREE.Vector3());
    const tgt = new THREE.Vector3(c.x, b.max.y + .0008, c.z);
    const L = new THREE.Vector3(tgt.x - c.x, -(tgt.y - c.y), -(tgt.z - c.z));
    const g = new THREE.Group();
    g.name = 'vet-am-lung-may';
    const disc = new THREE.Mesh(
      new THREE.PlaneGeometry(.090, .070),
      new THREE.MeshBasicMaterial({
        map: hotGlow(), transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide,
      })
    );
    disc.rotation.x = Math.PI / 2;
    g.add(disc);
    g.position.copy(L);
    g.visible = false;
    PIV.phone2.add(g);
    WARM2.group = g;
  }
}

// ── hai vùng nóng trên lưng máy đang sạc (c90) ────────────────────────────
// Câu c90 nói: lúc đó máy có HAI chỗ sinh nhiệt cùng lúc — một ở mạch sạc (gần
// cổng cắm), một ở con chip giữa máy. Ta dán hai vệt nóng thẳng vào mặt lưng
// của chính cái máy (khung local của nó), nên lật máy úp xuống là thấy.
const HOT2 = { group: null };
if (N1.phone && N1.phone.group) {
  const g = new THREE.Group();
  g.name = 'hai-vung-nong';
  for (const dx of [-.048, .012]) {
    const disc = new THREE.Mesh(
      new THREE.PlaneGeometry(.036, .036),
      new THREE.MeshBasicMaterial({
        map: hotGlow(), transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide,
      })
    );
    disc.rotation.x = Math.PI / 2;      // vệt nằm trong mặt phẳng XZ của máy
    disc.position.set(dx, -.0021, 0);  // sát dưới mặt lưng (tấm lưng ở y −0.0018…−0.0004)
    g.add(disc);
  }
  g.visible = false;
  N1.phone.group.add(g);
  HOT2.group = g;
}

// ── vệt ấm lan từ cổng sạc trên lưng máy (c4) ───────────────────────────
// Câu c4 là câu "nóng ở mặt lưng": khung phải thấy vệt ấm loang ra từ cổng
// sạc và hạt nhiệt bám trên mặt lưng. Vệt dính vào khung local của cái máy
// nên lật máy úp là thấy, không cần dựng thêm vật nào.
const WARMBACK = { group: null };
if (N1.phone && N1.phone.group) {
  const g = new THREE.Group();
  g.name = 'vet-am-tu-cong-sac';
  const disc = new THREE.Mesh(
    new THREE.PlaneGeometry(.054, .042),
    new THREE.MeshBasicMaterial({ map: hotGlow(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide })
  );
  disc.rotation.x = Math.PI / 2;
  disc.position.set(-.062, -.0021, -.002);
  g.add(disc);
  // hạt nhiệt bám trên mặt lưng: cụm hạt nhỏ quanh chỗ nóng nhất, ngay dưới
  // cổng sạc (cổng nằm ở x = −W/2)
  const beads = new THREE.InstancedMesh(
    new THREE.SphereGeometry(.0014, 8, 6),
    new THREE.MeshBasicMaterial({ color: '#ff8a3c', toneMapped: false, transparent: true, opacity: .92, depthWrite: false }),
    24
  );
  beads.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  beads.frustumCulled = false;
  beads.renderOrder = 8;
  fxLayer(beads);
  const m4 = new THREE.Matrix4(), q0 = new THREE.Quaternion(), s3 = new THREE.Vector3(), pv = new THREE.Vector3();
  for (let i = 0; i < 24; i++) {
    const a = i * 2.399, r = .0035 + .010 * ((i % 5) / 5);
    pv.set(-.060 + Math.cos(a) * r * 1.25, -.0026, -.002 + Math.sin(a) * r * .8);
    m4.compose(pv, q0, s3.set(1, 1, 1));
    beads.setMatrixAt(i, m4);
  }
  beads.instanceMatrix.needsUpdate = true;
  g.add(beads);
  g.visible = false;
  N1.phone.group.add(g);
  WARMBACK.group = g;
}

// điểm nhắm của các nhát soi cảm biến: giữa tâm tấm bo và vạch đỏ, để
// cả tấm bo lẫn vạch đều nằm trong khung
const sensorTarget = () => {
  if (!SNS) return [0, 0, 0];
  const c = ctr(SNS), m = sensorMarkPos();
  return [(c.x + m[0]) / 2, (c.y + m[1]) / 2, (c.z + m[2]) / 2];
};

// ── ốp case ở N1: ở câu 86 nó rời khỏi máy thứ hai và nằm sang bên
// Ốp case là CON của trục quay của máy thứ hai: toạ độ của nó phải tính
// trong khung của trục, không phải khung cảnh. Ghi toạ độ cảnh vào đây là
// ốp bay mất khỏi máy (đó là cái khay rỗng lọt vào khung c62).
const CASE_HOME = new THREE.Vector3();
if (PIV.phone2 && N1.case2 && N1.case2.group) {
  const c = PIV.phone2.userData.c;
  CASE_HOME.set(P2[0] - c.x, .0016 - c.y, P2[2] - c.z);
  N1.case2.group.position.copy(CASE_HOME);
  PIV.phone2.add(N1.case2.group);
}
// Chỗ ốp case nằm ở c86: 1/3 dưới-trái, cách máy. Máy quay của c86 dựng
// theo chỗ này, nên ốp là chủ thể của khung chứ không phải cái bàn tay.
const caseDrop = () => [CASE_HOME.x - .17, .004, CASE_HOME.z + .085];

// ── rig chung của nhát mở đầu và các nhát khép vòng ────────────────────
// Nhát 1, c67, c79, c94, c95 phải Y HỆT nhau: vòng phim chỉ khép được khi
// khung cuối trùng khung đầu. Một hằng số cho cả năm, để không thể lệch.
const RIG_OPEN = { fov: 26, p: [PH[0] + .085, .092, PH[2] + .262], l: [PH[0], PH[1] + .010, PH[2]] };

const SHOTS = [
  // ── N1 · bàn cạnh giường: mở đầu đời thường ──
  // Mở đầu: máy nằm úp sấp, dây chạy thẳng về ổ trên tường. Máy quay thấp
  // ngang mặt bàn và máy chiếm gần nửa bề ngang, như lời kể: máy là vật chính.
  sh('N1', 'c1', RIG_OPEN.fov, RIG_OPEN.p, RIG_OPEN.l),
  // đồng hồ sạc trên màn hình: bàn tay lật máy lên. Máy nhấc lên lúc lật, nên
  // máy quay nhìn theo nhịc máy lên để máy không trượt ra khỏi khung.
  sh('N1', 'c2', 32, [PH[0] - .115, .165, PH[2] + .270],
    () => { const p = PHL(); return [p[0], PH[1] + .006 + (p[1] - PH[1]) * .62, p[2]]; }, [0, -.012, -.022]),
  // cầm máy lên: nhìn từ thấp, thấy cạnh máy và bàn
  sh('N1', 'c3', 30, [PH[0] - .17, .13, PH[2] + .23], [PH[0], .07, PH[2] - .02], [0, -.03, -.04]),
  // mặt lưng ngửa về máy quay, máy đang ấm
  sh('N1', 'c4', 26, [PH[0] - .020, PH[1] + .194, PH[2] + .265], [PH[0] - .020, PH[1] + .057, PH[2]]),
  // câu hỏi: bàn, máy, dây nối về ổ
  sh('N1', 'c5', 40, [PH[0] + .24, .25, PH[2] + .32], [(PH[0] + SO[0]) / 2, .05, (PH[2] + SO[2]) / 2]),
  // lần theo dòng điện: cả đường đi từ ổ cắm tới máy
  sh('N1', 'c6', 32, [-.68, .335, .40], [-.46, .02, -.06], [-.04, .025, -.04]),
  // quy luật đơn giản: chỗ dây rẽ vào cổng máy
  sh('N1', 'c7', 34, [(CH[0] + PORT[0]) / 2 + .06, .17, (CH[2] + PORT[2]) / 2 + .40], [(CH[0] + PORT[0]) / 2, .01, (CH[2] + PORT[2]) / 2]),
  sh('N1', 'c8', 26, [PORT[0] - .02, .10, PORT[2] + .17], [PORT[0] + .015, .008, PORT[2]]),
  sh('N1', 'c9', 20, [PORT[0] + .01, .055, PORT[2] + .11], [PORT[0] + .012, .008, PORT[2]]),
  sh('N1', 'c10', 22, [PORT[0] + .03, .07, PORT[2] + .13], [PORT[0] + .012, .024, PORT[2]]),
  sh('N1', 'c11', 26, [PORT[0] + .05, .06, PORT[2] + .155], [PORT[0] + .012, .022, PORT[2]]),
  sh('N1', 'c12', 24, [PORT[0] + .035, .035, PORT[2] + .115], [PORT[0] + .008, .006, PORT[2] - .01], [.004, 0, -.06]),
  // ổ cắm trên tường và dây nguồn chạy xuống củ sạc
  sh('N1', 'c13', 26, [-.20, .45, .30], [-.745, .046, -.49], [.05, -.039, .08]),

  // ── N2 · trong củ sạc: chỗ điện thất thoát lần thứ nhất ──
  // c14: soi thẳng vào nhãn in "60 W" trên vỏ củ sạc THẬT ở N1. Ở N2 (củ sạc
  // đã cưa) thì lõi biến áp nằm ngay trước mặt vỏ, che mất chữ, nên câu này
  // quay ngoài trước, rồi mới vào ruột ở c15.
  sh('N1', 'c14', 20, ORBP(() => ANCH(N1, 'label'), [.26, .90, .34], .105), () => ANCH(N1, 'label')),
  // c15: cả củ sạc đã cưa nằm giữa khung. Nhắm vào lõi biến áp (một vật nhìn
  // thấy được) chứ không nhắm vào tâm hộp bao của củ sạc — hộp bao có chân cắm
  // và ruột nên tâm lệch, vật rơi góc khung.
  sh('N2', 'c15', 34, MAC(TRF, [.70, .50, 1], .184), AT(TRF)),
  sh('N2', 'c16', 28, ORB(STR2, [-.60, .50, 1], 2.2), AT(STR2)),
  sh('N2', 'c17', 30, ORB(STR2, [.50, .80, 1], 1.55), AT(STR2)),
  sh('N2', 'c18', 28, ORB(PLM2, [.40, .40, 1], 2.4), AT(PLM2)),
  // c19: biến áp nằm ngay trong củ sạc — nhìn thẳng vào nó, vỏ cưa vẫn
  // quanh khung. Trước đây máy quay nhắm vào tâm vỏ nên biến áp lệch góc.
  sh('N2', 'c19', 26, MAC(TRF, [.40, .45, 1], .10), AT(TRF)),
  // c20: soi vào CUỘN DÂY ĐỒNG của cuộn biến áp — câu này kể dòng điện bị
  // cản ở cuộn, nên cuộn phải là thứ chiếm khung, không phải vỏ củ sạc.
  sh('N2', 'c20', 26, ORBP(() => ctr(TRF.group).toArray(), [-.90, .55, .55], .095), () => ctr(TRF.group).toArray()),
  sh('N2', 'c21', 22, ORB(PLM2, [.20, .30, 1], 1.6), AT(PLM2)),
  sh('N2', 'c22', 32, ORB(CHG2, [.40, .45, 1], 1.35), AT(CHG2)),
  // nhiệt của củ sạc ở lại trong vỏ củ sạc: không chảy theo dây vào máy
  sh('N2', 'c23', 30, ORB(CHG2, [.55, .35, 1], 1.20), AT(CHG2)),

  // ── N3 · trong điện thoại: chỗ điện thất thoát lần thứ hai ──
  sh('N3', 'c24', 30, MAC(PRT, [-.45, .70, .55], .060), AT(PRT)),
  sh('N3', 'c25', 34, ORB(PH3, [.50, .45, 1], 1.9), AT(PH3)),
  sh('N3', 'c26', 24, MAC(PRT, [-.92, .30, .25], .07), AT(PRT)),
  sh('N3', 'c27', 34, ORB(BAT, [.60, .50, 1], 3.0), AT(BAT)),
  sh('N3', 'c28', 26, ORB(BRD, [.10, .80, 1], 2.7), AT(BRD)),
  sh('N3', 'c29', 30, MAC(CHP3, [-.42, .55, .72], .085), AT(CHP3)),
  // mạch sạc: một con chip, một con tụ, một cuộn cảm dây đồng
  sh('N3', 'c30', 26, ORB(IND, [.30, .40, 1], 2.2), IND_CAP),
  sh('N3', 'c31', 22, ORB(IND, [-.40, .25, 1], 1.6), AT(IND)),
  sh('N3', 'c32', 22, ORB(STR3, [-.30, .30, 1], 2.0), AT(STR3)),
  sh('N3', 'c33', 24, ORB(IND, [.50, .60, 1], 1.9), AT(IND)),
  sh('N3', 'c34', 32, ORB(BRD, [.35, .55, 1], 3.0), AT(BRD)),
  // c35: phần dòng còn lại rơi vào túi pin — phải thấy hạt RƠI vào túi, nên
  // máy ghì sát túi pin chứ không quan cả bo mạch (c27 đã cho cả bo mạch).
  sh('N3', 'c35', 30, ORB(BAT, [.30, .62, 1], 2.40), AT(BAT)),
  // c36: siêu cận bên trong túi pin — hạt nằm lại, sáng dịu.
  sh('N3', 'c36', 24, ORB(BAT, [-.34, .38, 1], 1.55), AT(BAT)),
  // máy không chỉ sạc, máy đang chạy: nắp máy (màn hình) treo lơ lửng
  sh('N3', 'c37', 34, ORB2(LID3, BRD, [-.62, .95, .62], 2.45), MID(LID3, BRD)),
  sh('N3', 'c38', 24, ORB(LID3, [.20, .50, 1], 2.4), AT(LID3)),
  sh('N3', 'c39', 26, MAC(CHP3, [.35, .50, 1], .038), AT(CHP3)),
  sh('N3', 'c40', 35, ORB(BRD, [.55, .70, 1], 2.5), MID(BRD, BAT)),
  sh('N3', 'c41', 36, ORBP(() => MID(IND, CHP3)(), [.40, .95, .95], .158), MID(IND, CHP3)),

  // ── N3 · sạc nhanh và cảm biến nhiệt, ngay trong máy ──
  sh('N3', 'c69', 32, MAC(IND, [-.45, .48, .75], .080), AT(IND)),
  sh('N3', 'c70', 32, ORB(STR3, [-.40, .40, 1], 2.6), AT(STR3)),
  // máy vẫn nạp qua cùng một cuộn cảm đó
  sh('N3', 'c71', 26, ORB(IND, [.35, .55, 1], 2.0), AT(IND)),
  sh('N3', 'c72', 24, MAC(IND, [-.58, .40, .71], .062), AT(IND)),
  sh('N3', 'c73', 20, MAC(IND, [-.60, .38, .70], .044), AT(IND)),
  // cảm biến nhiệt nhỏ trên bo mạch
  sh('N3', 'c74', 32, MAC(SNS, [.35, .55, 1], .050), AT(SNS)),
  sh('N3', 'c75', 28, MAC(SNS, [.30, .45, 1], .032), AT(SNS)),
  // vạch đỏ 45 °C trên thang của cảm biến
  // c76: soi vào cảm biến cho kịp thang vạch và vạch đỏ. Dòng điện (hạt
  // cyan) đã bị tắt ở các nhát này, nếu không hạt to bằng cả tấm bo.
  // Máy quay phải nhìn MẶT tấm bo: đứng lệch sang mép dài thì tấm bo chỉ còn
  // một vạt mỏng, đọc không ra vạch. Nhắm vào điểm giữa tâm tấm bo với vạch
  // đỏ để vạch nằm trong khung chứ không lọt ra mép.
  sh('N3', 'c76', 30, ORBP(() => sensorTarget(), [.28, .55, 1], .024), () => sensorTarget()),
  // vạch đỏ là mốc của tế bào pin, không phải nhiệt độ mặt lưng
  sh('N3', 'c77', 26, MAC(SNS, [.10, .26, 1], .024), AT(SNS)),
  // nóng quá thì máy tự giảm dòng sạc: macro cảm biến nóng, dòng hạt chạy tới
  // rồi thưa dần — khung lấy cả đoạn dòng DÀY lẫn đoạn đã thưa
  sh('N3', 'c78', 26, MAC(SNS, [-.34, .42, 1], .082), AT(SNS)),

  // ── N4 · trong túi pin: điện trở bên trong tế bào ──
  // túi pin trọn khung: máy 35° bên phải, cao 30°, cách túi pin 55 cm
  sh('N4', 'c42', 32, () => { const c = ANCH(N4, 'pouch'); return [c[0] + .273, c[1] + .275, c[2] + .390]; }, () => ANCH(N4, 'pouch')),
  // nhìn từ phía bên kia: máy lùi ra và ngẩng lên, túi pin rơi xuống 1/3 dưới
  sh('N4', 'c43', 30, () => { const c = ANCH(N4, 'pouch'); return [c[0] + .606, c[1] + .212, c[2] + .054]; }, () => { const c = ANCH(N4, 'pouch'); return [c[0], c[1] + .073, c[2]]; }),
  // các lớp: đồng, graphite, cách điện, nhôm
  sh('N4', 'c44', 30, ORB(LAY, [.30, .60, 1], 2.4), AT(LAY)),
  sh('N4', 'c45', 24, ORB(LAY, [.20, .35, 1], 1.7), AT(LAY)),
  // dòng điện bị điện trở bên trong tế bào cản lại
  // mặt cắt: máy thấp, ngang tầm ranh giới lớp, cách 10.5 cm
  sh('N4', 'c46', 26, () => { const c = ANCH(N4, 'cross'); return [c[0] + .0885, c[1] + .039, c[2] + .1487]; }, () => { const c = ANCH(N4, 'cross'); return [c[0] + .0104, c[1], c[2] - .006]; }),
  // cản lại thì sinh nhiệt, ngay ở trong pin
  // lùi ra: thấy cả bốn lớp và cụm hạt nằm ngay trên ranh giới lớp
  sh('N4', 'c47', 30, () => { const c = ANCH(N4, 'cross'); return [c[0] + .049, c[1] + .040, c[2] + .183]; }, () => { const c = ANCH(N4, 'cross'); return [c[0] + .0104, c[1], c[2] - .006]; }),
  // nhiệt ấy không thoát ra ngoài được
  sh('N4', 'c48', 30, () => { const c = ANCH(N4, 'heat'); return [c[0] + .115, c[1] + .088, c[2] + .222]; }, () => ANCH(N4, 'heat')),
  // nó lan đều trong túi pin, làm cả cục pin ấm lên
  // cả túi pin trong khung: máy 20° bên phải, cao 26%, cách 60 cm
  sh('N4', 'c49', 30, () => { const c = ANCH(N4, 'pouch'); return [c[0] + .185, c[1] + .263, c[2] + .508]; }, () => ANCH(N4, 'pouch')),

  // ── N5 · vỏ máy và bàn tay: nhiệt đi đâu ──
  // ba nguồn nhiệt trong máy dồn vào một chỗ
  sh('N3', 'c50', 32, ORB(BRD, [.30, .85, 1], 2.6), MID(BRD, BAT)),
  sh('N5', 'c51', 30, ORB(BCK, [.40, .40, 1], 2.4), AT(BCK)),
  // đó là vỏ máy
  sh('N5', 'c52', 24, ORB(BCK, [.55, .30, 1], 1.8), AT(BCK)),
  sh('N5', 'c53', 36, ORB(BCK, [.30, .35, 1], 2.0), AT(BCK)),
  sh('N5', 'c54', 30, ORB(PLM5, [.30, .40, 1], 2.4), AT(PLM5)),   // giữ nguyên; chỉ đổi neo thẻ
  sh('N5', 'c55', 24, ORB(BCK, [.30, .35, 1], 1.8), AT(BCK)),
  sh('N5', 'c56', 32, ORB2(HND5, BCK, [.40, .40, 1], 2.2), MID(HND5, BCK)),
  sh('N5', 'c57', 28, ORB2(HND5, BCK, [.20, .55, 1], 1.7), MID(HND5, BCK)),
  // ốp case giữ nhiệt
  sh('N5', 'c58', 26, MAC(BCK, [-.20, .80, 1], .24), AT(BCK)),
  sh('N5', 'c59', 30, ORB(CAS5, [.40, .40, 1], 2.0), AT(CAS5)),
  sh('N5', 'c60', 30, [.086, .177, .350], [.086, -.0158, 0]),
  // trong applyState: if (N5.phone2) N5.phone2.group.visible = (id === 'c60');

  // ── N1 · thí nghiệm hai máy ──
  // hai cái máy, hai bộ sạc, cùng một chỗ
  sh('N1', 'c61', 38, [MID2[0] - .07, .285, MID2[2] + .505], [MID2[0], .018, MID2[2]]),
  // cái này có case, cái kia không
  sh('N1', 'c62', 36, [MID2[0] + .02, .22, MID2[2] + .44], [MID2[0], .01, MID2[2]]),
  // hai nhiệt kế đặt trên lưng mỗi cái
  sh('N1', 'c63', 38, [MID2[0], .21, MID2[2] + .46], [MID2[0], .05, MID2[2]]),
  // cột nhiệt kế của máy có case dốc lên nhanh hơn
  sh('N1', 'c64', 30, [P2[0] + .09, .15, P2[2] + .34], [P2[0], .05, P2[2]]),
  // cột của máy không case dốc lên chậm hơn
  sh('N1', 'c65', 30, [PH[0] + .05, .09, PH[2] + .22], [PH[0], .04, PH[2]]),
  // hai cột cạnh nhau: đo được, không phải đoán
  sh('N1', 'c66', 34, [MID2[0] + .02, .19, MID2[2] + .40], [MID2[0], .03, MID2[2]]),
  // quay lại cái bàn cạnh giường
  sh('N1', 'c67', RIG_OPEN.fov, RIG_OPEN.p, RIG_OPEN.l),
  // cái máy vẫn cắm sạc, màn hình vẫn sáng
  sh('N1', 'c68', 32, [PH[0] + .02, .17, PH[2] + .26], [PH[0], .01, PH[2]]),

  // ── N1 · loại nóng khác: nóng lệch một chỗ ở một góc lưng máy ──
  sh('N1', 'c79', RIG_OPEN.fov, RIG_OPEN.p, RIG_OPEN.l),
  sh('N1', 'c80', 32, [PH[0] + .02, .17, PH[2] + .26], [PH[0], .01, PH[2]]),
  // loại nóng khác: cái máy không cắm sạc
  sh('N1', 'c81', 28, [P2[0] + .02, .13, P2[2] + .22], [P2[0], .005, P2[2]]),
  // cái máy không cắm sạc vẫn ấm: ta lật nó úp để thấy lưng
  sh('N1', 'c82', 26, [P2[0] + .079, .192, P2[2] + .302], [P2[0] + .010, .005, P2[2]]),
  // vệt nóng lệch ở một góc lưng máy
  sh('N1', 'c83', 26, [PATCH.pos[0] + .045, PATCH.pos[1] + .055, PATCH.pos[2] + .085], () => PATCH.pos),
  sh('N1', 'c84', 30, [P2[0] + .02, .14, P2[2] + .22], [P2[0], .006, P2[2]]),

  // ── N1 · mấy việc mình làm được ngay hôm nay ──
  sh('N1', 'c85', 34, [PH[0] + .06, .22, PH[2] + .40], [PH[0] - .02, .02, PH[2] - .03]),
  sh('N1', 'c86', 34, () => { const c = caseDrop(); return [c[0] - .105, .285, c[2] + .545]; }, () => { const c = caseDrop(); return [(c[0] + P2[0]) / 2, .012, (c[2] + P2[2]) / 2]; }),
  // củ sạc đúng chuẩn của máy: nhãn in trên vỏ phải đọc được
  sh('N1', 'c87', 26, [CH[0] + .02, .11, CH[2] + .12], () => ANCH(N1, 'label')),
  // sạc chậm thì dòng vào máy ít hơn: cả đường điện, nhưng hạt thưa hơn
  sh('N1', 'c88', 30, [-.36, .34, .52], [-.47, -.01, -.13]),
  // đừng vừa sạc vừa chơi game
  sh('N1', 'c89', 32, [PH[0] + .04, .12, PH[2] + .22], [PH[0] + .01, .008, PH[2]]),
  // vì lúc đó máy có hai chỗ sinh nhiệt cùng lúc
  sh('N1', 'c90', 28, [PH[0] + .03, .14, PH[2] + .28], [PH[0], .006, PH[2]]),
  // rút sạc ra, mang đi kiểm tra
  sh('N1', 'c91', 30, [PORT[0] - .075, .175, PORT[2] + .235], [PORT[0] + .004, .010, PORT[2] + .004]),

  // ── N1 · khép lại: máy không hỏng, nó đang làm việc ──
  // c94 y hệt nhát 1 (cái bàn yên, không có gì hỏng), c95 thì tới gần cái máy
  sh('N1', 'c94', RIG_OPEN.fov, RIG_OPEN.p, RIG_OPEN.l),
  sh('N1', 'c95', RIG_OPEN.fov, RIG_OPEN.p, RIG_OPEN.l),
];

// mốc thời gian của từng nhát: nhát i bắt đầu khi câu đầu bắt đầu, kết thúc khi câu cuối kết thúc
const MARK = SHOTS.map(s => ({ t0: V.L[s.ids[0]].t0, t1: V.L[s.ids[s.ids.length - 1]].t1 }));

function shotAt(t) {
  for (let i = 0; i < SHOTS.length; i++) {
    if (t < MARK[i].t1 || i === SHOTS.length - 1) {
      const s = SHOTS[i];
      const u = clamp((t - MARK[i].t0) / Math.max(.001, MARK[i].t1 - MARK[i].t0));
      const p = typeof s.p === 'function' ? s.p() : s.p;
      const l = typeof s.l === 'function' ? s.l() : s.l;
      return { sh: s, i, u, pos: p, look: l };
    }
  }
}

// ── thẻ thuật ngữ: chỉ những thẻ này, và chỉ ở câu đã ghi ────────────────
// Mỗi thẻ bám vào vật nó gọi tên (toạ độ thế giới), nên đuôi thẻ luôn chỉ
// đúng vào vật chứ không chỉ vào chỗ trống.
const avgColor = o => {
  let r = 0, g = 0, b = 0, n = 0;
  o.traverse(m => {
    if (!m.isMesh || !m.material || !m.material.color) return;
    r += m.material.color.r; g += m.material.color.g; b += m.material.color.b; n++;
  });
  return n ? { r: r / n, g: g / n, b: b / n } : { r: 0, g: 0, b: 0 };
};
// chấm điểm một lớp theo vật liệu: đồng (đỏ ấm), graphite (rất tối),
// cách điện (trắng ấm), nhôm (xám trung tính)
function layerScore(col, name) {
  const { r, g, b } = col;
  if (name === 'dong') return (r > .18 && r > b * 1.3 && g < r * .92) ? 2 : -2;
  if (name === 'graphite') return Math.max(r, g, b) < .26 ? 2 : -2;
  if (name === 'nhom') return (Math.abs(r - g) < .09 && Math.abs(g - b) < .10 && r > .22) ? 2 : -2;
  if (name === 'cach') return (Math.min(r, g, b) > .50 && Math.max(r, g, b) - Math.min(r, g, b) > .04) ? 2 : -2;
  return -2;
}
// bốn lớp của túi pin: mỗi thẻ bám vào đúng lớp của nó
function layerPoints() {
  const names = ['dong', 'graphite', 'cach', 'nhom'];
  const layRoot = LAY && LAY.group ? LAY.group : LAY;
  const kids = [];
  if (layRoot && layRoot.children) {
    for (const ch of layRoot.children) {
      if (!ch.visible) continue;
      // chỉ bốn tấm lớp mới là lớp: hạt điện và hạt nhiệt nằm trong group lớp
      // nhưng không phải lớp, lấy màu của chúng sẽ làm sai thẻ tên lớp
      if (!ch.name.startsWith('lop-')) continue;
      const b = bb(ch);
      if (b.isEmpty()) continue;
      kids.push({ c: b.getCenter(new THREE.Vector3()), col: avgColor(ch) });
    }
  }
  if (kids.length >= 4) {
    // thử mọi cách ghép (bỏ trống một lớp nếu có nhiều hơn bốn), giữ cách ghép
    // có tổng điểm cao nhất: NHÔM phải chỉ đúng lớp nhôm, không chỉ lớp than
    let best = null, bestScore = -1e9;
    const assign = (used, cur) => {
      if (cur.length === 4) {
        let sc = 0; for (const [k, nm] of cur) sc += layerScore(k.col, nm);
        if (sc > bestScore) { bestScore = sc; best = cur.map(([, nm, idx]) => ({ nm, idx })); }
        return;
      }
      for (let j = 0; j < kids.length; j++) {
        if (used.has(j)) continue;
        used.add(j);
        assign(used, cur.concat([[kids[j], names[cur.length], j]]));
        used.delete(j);
      }
    };
    assign(new Set(), []);
    const out = {};
    if (best) for (const b of best) out[b.nm] = kids[b.idx].c.toArray();
    if (Object.keys(out).length === 4) return out;
  }
  // không đoán màu được: bốn điểm dọc theo trục xếp lớp (trục mỏng nhất)
  let b = layRoot ? bb(layRoot) : new THREE.Box3();
  if (b.isEmpty() && N4.group) b = bb(N4.group);
  if (b.isEmpty()) return null;
  const sz = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
  const ax = sz.x <= sz.y && sz.x <= sz.z ? 'x' : (sz.y <= sz.z ? 'y' : 'z');
  const half = (ax === 'x' ? sz.x : ax === 'y' ? sz.y : sz.z) / 2;
  const dir = ax === 'x' ? [1, 0, 0] : ax === 'y' ? [0, 1, 0] : [0, 0, 1];
  const out = {};
  names.forEach((nm, i) => {
    const k = (i - 1.5) * half * .5;   // bốn điểm trong khoảng -half…+half
    out[nm] = [c.x + dir[0] * k, c.y + dir[1] * k, c.z + dir[2] * k];
  });
  return out;
}
const LAYERS = layerPoints();

// Điểm bám của thẻ tên lớp: TRÊN MÉP CẮT của tấm lớp — chỗ màu lớp thật sự
// lộ ra. Tâm của tấm lớp thì nằm trong khoảng trống giữa các lớp, mũi thẻ
// gõ vào đó là gõ vào không khí. Mỗi lớp một chỗ khác nhau theo bề ngang để
// bốn thẻ không chồng lên nhau.
function layerEdge(nm, lx) {
  const c = LAYERS && LAYERS[nm];
  if (!c) return [0, 0, 0];
  // LAY là chính group lớp (không phải handle có .group), nên phải lấy
  // group bằng cách: LAY.group ? LAY.group : LAY — lấy sai thì phép cộng
  // không có tác dụng và cả bốn thẻ rơi vào tấm nhôm.
  const g = LAY ? (LAY.group || LAY) : null;
  if (!g) return c;
  const zAxis = new THREE.Vector3(0, 0, 1).applyQuaternion(g.quaternion);
  const xAxis = new THREE.Vector3(1, 0, 0).applyQuaternion(g.quaternion);
  const p = new THREE.Vector3(c[0], c[1], c[2])
    .addScaledVector(zAxis, .0555)    // ra tới mép cắt phía trước (nửa sâu lớp)
    .addScaledVector(xAxis, lx);
  return p.toArray();
}

// nhãn in trên vỏ củ sạc: chỉ vào mặt vỏ đang quay về máy
const shellLabel = o => {
  if (!o) return [0, 0, 0];
  const f = frameOf(o);
  const d = new THREE.Vector3(camera.position.x - f.c.x, 0, camera.position.z - f.c.z);
  if (d.lengthSq() < 1e-8) d.set(0, 0, 1);
  d.normalize().multiplyScalar(f.r * .55);
  return [f.c.x + d.x, f.c.y, f.c.z + d.z];
};
// mực silk trên bo mạch: 20 V cạnh cổng, 4 V cạnh túi pin
const toward = (from, to, d) => {
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
  const v = b.sub(a);
  if (v.lengthSq() < 1e-8) return from;
  return a.add(v.normalize().multiplyScalar(d)).toArray();
};
// vạch đỏ 45 °C trên cảm biến: đúng chỗ vạch, không phải chỗ bất kỳ
const sensorMarkPos = () => {
  if (!SNS || !SNS.group) return [0, 0, 0];
  const g = SNS.group;
  let red = null;
  g.traverse(o => {
    if (!o.isMesh || !o.material || !o.material.color) return;
    const c = o.material.color;
    if (c.r > .45 && c.r > c.g * 1.5 && c.g < c.b * 1.3) { if (!red) red = o; }
  });
  if (!red) {
    const b = bb(g);
    if (b.isEmpty()) return P3(g, [0, 0, 0]);
    const c = b.getCenter(new THREE.Vector3());
    return [c.x, b.max.y, c.z];
  }
  const p = ctr(red);
  return [p.x, p.y, p.z];
};

// vị trí sống của cái máy đang sạc: nó được cầm lên rồi đặt xuống, nên thẻ
// bám vào nó phải hỏi vị trí lúc này, không phải vị trí lúc dựng cảnh
const PHL = () => (PIV.phone ? wp(PIV.phone).toArray() : PH);

// điểm neo do bộ dựng cảnh nói ra (hạt bay không có khung bao ở chỗ nó đang ở)
const ANCH = (set, name, fb = [0, 0, 0]) => {
  const a = set && set.anchors && set.anchors[name];
  return a ? a.toArray() : fb;
};

// vị trí mực silk in trên bo mạch ('20 V' cạnh cổng, '4 V' cạnh túi pin):
// đọc thẳng từ bộ dựng cảnh, không gõ tay toạ độ
const silkPos = name => {
  if (!BRD || !BRD.group) return null;
  let hit = null;
  BRD.group.traverse(o => { if (!hit && o.name === name) hit = o; });
  return hit ? ctr(hit).toArray() : null;
};

// mép phải của vệt mực in trên bo: thẻ bám vào mép ấy thì mũi tên không đè
// lên chữ đã in (canvas 256px, chữ 86px monospace: nửa chữ '20 V' = 103px)
const silkEdge = (name, frac) => {
  if (!BRD || !BRD.group) return null;
  let hit = null;
  BRD.group.traverse(o => { if (!hit && o.name === name) hit = o; });
  if (!hit) return null;
  hit.updateWorldMatrix(true, false);
  const p = new THREE.Vector3(hit.geometry.parameters.width * frac, 0, 0).applyMatrix4(hit.matrixWorld);
  return p.toArray();
};

// Mỗi thẻ bám vào câu nó gọi tên.
// `lines` là số thứ tự của câu trong voice/lines.json: check_labels.py đọc câu
// theo vị trí trong file, mà lời kể của tập này đã đảo thứ tự (câu c44 đứng ở
// dòng 54, c62 ở dòng 72, c76 ở dòng 49). `ids` là id của câu đó — phim lấy
// thời gian và nhịp đánh dấu theo `ids`.
const CARDS = [
  { id: 'dong-dien', text: 'DÒNG ĐIỆN', at: () => [PORT[0] - .012, PORT[1] + .004, PORT[2]], lines: ['c11'], ids: ['c11'], size: 30 },
  { id: 'nhiet', text: 'NHIỆT', at: () => [PORT[0] + .022, PORT[1] + .046, PORT[2]], lines: ['c11'], ids: ['c11'], size: 30 },
  { id: 'sau-muoi-oat', text: '60 W', at: () => ANCH(N1, 'labelRight'), lines: ['c14'], ids: ['c14'], size: 32, dx: 60, dy: 235 },
  { id: 'dien-that-thoat', text: 'ĐIỆN BỊ THẤT THOÁT', at: () => ANCH(N2, 'plume'), lines: ['c22'], ids: ['c22'], size: 28 },
  { id: 'hai-muoi-von', text: '20 V', at: () => silkEdge('silk-cong', .38) || silkPos('silk-cong') || P3(PRT, [0, 0, 0]), lines: ['c28'], ids: ['c28'], size: 30, dx: -96, dy: -52 },
  { id: 'bon-von', text: '4 V', at: () => silkEdge('silk-pin', .28) || silkPos('silk-pin') || toward(P3(BAT, [0, 0, 0]), P3(BRD, [0, 0, 0]), .03), lines: ['c28'], ids: ['c28'], size: 30 },
  { id: 'noi-sinh-nhiet', text: 'NƠI SINH NHIỆT THỨ HAI', at: () => P3(IND, [0, 0, 0]), lines: ['c34'], ids: ['c34'], size: 26 },
  { id: 'lop-dong', text: 'ĐỒNG', at: () => layerEdge('dong', -.048), lines: ['c54'], ids: ['c44'], size: 26 },
  { id: 'lop-graphite', text: 'GRAPHITE', at: () => layerEdge('graphite', -.016), lines: ['c54'], ids: ['c44'], size: 26 },
  { id: 'lop-cach-dien', text: 'CÁCH ĐIỆN', at: () => layerEdge('cach', .016), lines: ['c54'], ids: ['c44'], size: 26 },
  { id: 'lop-nhom', text: 'NHÔM', at: () => layerEdge('nhom', .048), lines: ['c54'], ids: ['c44'], size: 26 },
  { id: 'co-case', text: 'CÓ CASE', at: () => [P2[0], P2[1] + .012, P2[2]], lines: ['c72'], ids: ['c62'], size: 30, dx: 40 },
  { id: 'khong-case', text: 'KHÔNG CASE', at: () => [PH[0], PH[1] + .012, PH[2]], lines: ['c72'], ids: ['c62'], size: 30, dx: -60 },
  { id: 'bay-lam-do', text: '45 °C', at: () => sensorMarkPos(), lines: ['c49'], ids: ['c76'], size: 30 },
  // ── các thẻ gọi tên vật: mỗi thẻ bám vào câu kể về nó ──────────────────
  { id: 'dien-thoai', text: 'ĐIỆN THOẠI', at: () => PHL(), lines: ['c1'], ids: ['c1'], size: 30, dx: -400, dy: -92 },
  { id: 'dong-ho-sac', text: 'ĐỒNG HỒ SẠC', at: () => [PHL()[0], PHL()[1] + .012, PHL()[2]], lines: ['c2'], ids: ['c2'], size: 26, dx: 150, dy: -44 },
  { id: 'mat-lung', text: 'MẶT LƯNG', at: () => [PHL()[0], PHL()[1] + .008, PHL()[2]], lines: ['c4'], ids: ['c4'], size: 28, dx: 0, dy: 0 },
  { id: 'o-cam', text: 'Ổ CẮM', at: () => SO, lines: ['c13'], ids: ['c13'], size: 28, dx: 120, dy: -40 },
  { id: 'day-nguon', text: 'DÂY NGUỒN', at: () => [-.70, .06, -.560], lines: ['c13'], ids: ['c13'], size: 28, dx: -70, dy: 56 },
  { id: 'cu-sac', text: 'CỦ SẠC', at: () => P3(CHG2), lines: ['c15'], ids: ['c15'], size: 28, dx: -140, dy: -44 },
  { id: 'xoay-chieu', text: 'XOAY CHIỀU', at: () => P3(TRF), lines: ['c16'], ids: ['c16'], size: 28, dx: -150, dy: -50 },
  { id: 'cho-doi-dien', text: 'CHỖ ĐỔI ĐIỆN', at: () => P3(TRF), lines: ['c19'], ids: ['c19'], size: 26 },
  { id: 'vo-cu-sac', text: 'VỎ CỦ SẠC', at: () => P3(CHG2), lines: ['c23'], ids: ['c23'], size: 26, dx: 130, dy: 52 },
  { id: 'cong-usbc', text: 'CỔNG USB-C', at: () => P3(PRT), lines: ['c26'], ids: ['c26'], size: 28, dx: 0, dy: 0 },
  { id: 'bo-mach', text: 'BO MẠCH', at: () => P3(BRD), lines: ['c27'], ids: ['c27'], size: 28, dx: 120, dy: -50 },
  { id: 'mach-ha-dien-ap', text: 'MẠCH HẠ ĐIỆN ÁP', at: () => P3(CHP3), lines: ['c29'], ids: ['c29'], size: 26 },
  { id: 'con-tu', text: 'CON TỤ', at: () => (CAP_PT ? CAP_PT.toArray() : P3(IND)), lines: ['c30'], ids: ['c30'], size: 26 },
  { id: 'cuon-cam', text: 'CUỘN CẢM', at: () => P3(IND), lines: ['c30'], ids: ['c30'], size: 26, dx: 0, dy: 0 },
  { id: 'dien-tro', text: 'ĐIỆN TRỞ', at: () => P3(IND), lines: ['c31'], ids: ['c31'], size: 28, dx: 150, dy: -40 },
  { id: 'tui-pin', text: 'TÚI PIN', at: () => P3(BAT), lines: ['c35'], ids: ['c35'], size: 28, dx: 0, dy: 0 },
  { id: 'man-hinh', text: 'MÀN HÌNH', at: () => P3(LID3), lines: ['c38'], ids: ['c38'], size: 28, dx: 140, dy: -46 },
  { id: 'dong-thu-hai', text: 'DÒNG THỨ HAI', at: () => ANCH(N3, 'stream2'), lines: ['c40'], ids: ['c40'], size: 28, dx: 0, dy: 0 },
  { id: 'hai-cho-sinh-nhiet', text: 'HAI CHỖ SINH NHIỆT', at: () => ANCH(N3, 'plume'), lines: ['c41'], ids: ['c41'], size: 26, dx: 0, dy: 0 },
  { id: 'chip', text: 'CHIP', at: () => P3(CHP3), lines: ['c39'], ids: ['c39'], size: 28, dx: 130, dy: -46 },
  { id: 'cam-bien-nhiet', text: 'CẢM BIẾN NHIỆT', at: () => P3(SNS), lines: ['c47'], ids: ['c74'], size: 26, dx: 0, dy: 0 },
  { id: 'moc-te-bao-pin', text: 'MỐC CỦA TẾ BÀO PIN', at: () => sensorMarkPos(), lines: ['c50'], ids: ['c77'], size: 26, dx: 0, dy: 0 },
  { id: 'tu-giam-dong-sac', text: 'TỰ GIẢM DÒNG SẠC', at: () => ANCH(N3, 'cellTail'), lines: ['c51'], ids: ['c78'], size: 26, dx: 0, dy: 0 },
  { id: 'dien-tro-trong-pin', text: 'ĐIỆN TRỞ TRONG PIN', at: () => ANCH(N4, 'crossEdge'), lines: ['c56'], ids: ['c46'], size: 26, dx: 0, dy: 0 },
  { id: 'nhiet-trong-pin', text: 'NHIỆT BÊN TRONG PIN', at: () => ANCH(N4, 'heat'), lines: ['c57'], ids: ['c47'], size: 26, dx: 0, dy: 0 },
  { id: 'mach-sac', text: 'MẠCH SẠC', at: () => ANCH(N3, 'inductor'), lines: ['c60'], ids: ['c50'], size: 28, dx: 0, dy: 0 },
  { id: 'vo-may', text: 'VỎ MÁY', at: () => P3(BCK), lines: ['c62'], ids: ['c52'], size: 28, dx: -140, dy: -40 },
  { id: 'khong-khi', text: 'KHÔNG KHÍ', at: () => { const p = P3(SQG5); return [p[0], p[1] + .052, p[2]]; }, lines: ['c64'], ids: ['c54'], size: 28, dx: -30, dy: -74 },
  { id: 'op-case', text: 'ỐP CASE', at: () => ANCH(N5, 'caseRim'), lines: ['c68'], ids: ['c58'], size: 28 },
  { id: 'nhiet-ke', text: 'NHIỆT KẾ', at: () => (MY.th1 ? P3(MY.th1.group) : PH), lines: ['c73'], ids: ['c63'], size: 28, dx: 150, dy: -40 },
  { id: 'nong-khong-cam-sac', text: 'NÓNG KHI KHÔNG CẮM SẠC', at: () => P2, lines: ['c82'], ids: ['c82'], size: 26, dx: 130, dy: 40 },
  { id: 'nong-lech-mot-cho', text: 'NÓNG LỆCH MỘT CHỖ', at: () => PATCH.pos, lines: ['c83'], ids: ['c83'], size: 26, dx: 0, dy: 0 },
  { id: 'bo-op-case-ra', text: 'BỎ ỐP CASE RA', at: () => P3(N1.case2), lines: ['c86'], ids: ['c86'], size: 26, dx: 0, dy: 0 },
  { id: 'cu-sac-dung-chuan', text: 'CỦ SẠC ĐÚNG CHUẨN', at: () => CH, lines: ['c87'], ids: ['c87'], size: 26, dx: -150, dy: 34 },
  { id: 'sac-cham', text: 'SẠC CHẬM', at: () => [CH[0] + (PORT[0] - CH[0]) * .8, .007, CH[2] + (PORT[2] - CH[2]) * .8], lines: ['c88'], ids: ['c88'], size: 28, dx: 0, dy: 0 },
  { id: 'vua-sac-choi-game', text: 'VỪA SẠC VỪA CHƠI GAME', at: () => PHL(), lines: ['c89'], ids: ['c89'], size: 26, dx: -160, dy: -40 },
  { id: 'rut-sac-ra', text: 'RÚT SẠC RA', at: () => PORT, lines: ['c91'], ids: ['c91'], size: 26, dx: 0, dy: 0 },
];
// Thẻ hiện từ lúc máy cắt sang nhát của câu (tức từ hết câu trước) đến hết câu
// của nó: luôn đủ lâu để đọc trọn. Thẻ có hai câu ở xa nhau (60 W ở c14 và c89)
// thì có hai cửa sổ riêng, mỗi cửa sổ bám vào vật của câu đó.
// "Câu trước" là câu liền kề trong lời kể, không phải câu có id kề hơn.
const orderOf = id => SHOTS.findIndex(s => s.ids[0] === id);
for (const C of CARDS) {
  const groups = [];
  let cur = [], prev = -2;
  for (const id of C.ids) {
    const idx = orderOf(id);
    if (cur.length && idx !== prev + 1) { groups.push(cur); cur = []; }
    cur.push(id);
    prev = idx;
  }
  if (cur.length) groups.push(cur);
  C.windows = groups.map(g => {
    const i = orderOf(g[0]);
    const t0 = i > 0 ? V.L[SHOTS[i - 1].ids[0]].t1 : V.L[g[0]].t0;
    return [t0, V.L[g[g.length - 1]].t1];
  });
}

// ── trạng thái theo thời gian ────────────────────────────────────────────
const T = id => V.L[id].t0, E = id => V.L[id].t1;
// máy nóng lên dần: ấm ở c4, nóng hẳn khi vỏ máy tản nhiệt (c58), đỏ hẳn ở
// cảm biến 45 °C (c78 — câu này đến trước c58 trong lời kể).
const warmPhone = keys([[0, 0], [T('c4'), .16], [E('c4'), .30], [T('c78'), .55], [E('c78'), .72], [T('c58'), .78], [E('c58'), .95], [1, 1]]);
const warmChg2 = keys([[0, 0], [T('c19'), .12], [T('c23'), .88], [E('c23'), 1], [1, 1]]);
const warmSink = keys([[0, 0], [T('c22'), .25], [E('c23'), 1], [1, 1]]);
const warmChg1 = keys([[0, 0], [T('c23'), .55], [E('c23'), .8], [1, .9]]);
// túi pin ở N4: nhiệt dồn trong túi (c48), rồi lan đều ra cả cục (c49)
const warmPouch = keys([[0, 0], [T('c48'), .25], [E('c48'), .55], [T('c49'), .78], [E('c49'), 1], [1, 1]]);
// sạc nhanh: dòng to hơn từ c70, máy tự giảm dòng khi nóng quá (c77)
const curBig = keys([[0, .35], [T('c70'), .35], [T('c70') + .5, 1], [T('c77'), 1], [T('c77') + .8, .35], [1, .35]]);
// cảm biến nóng lên dần khi máy sạc nhanh
const hotSensor = keys([[0, 0], [T('c75'), 0], [T('c76'), 1], [1, 1]]);
// hai cột nhiệt kế: máy có case dốc lên nhanh hơn
const lvlPlain = keys([[T('c64'), 0], [T('c65'), .12], [E('c65'), .34], [T('c66'), .42], [E('c66'), .46]]);
const lvlCase = keys([[T('c64'), 0], [T('c65'), .30], [E('c65'), .62], [T('c66'), .70], [E('c66'), .76]]);
// máy xoay: úp sấp (c1) → ngửa lên (c2) → úp lại để thấy mặt lưng (c3–c4) →
// ngửa lên (c5) và giữ nguyên sau đó (hai cái máy thí nghiệm giống nhau) →
// úp xuống lần nữa ở c90 để thấy hai vùng nóng trên lưng máy
// Máy nằm sấp màn hình ngửa lên ngay từ đầu phim: như vậy đồng hồ sạc
// trên màn hình hiện ra suốt c1–c2, và cả hai câu đó không phải lật máy
// giữa bàn (lật giữa bàn thì thân máy cào xuống sàn).
// C3–c5: bàn tay cầm máy lên rồi lật úp xem mặt lưng, rồi đặt xuống.
const phoneRot = keys([
  [0, R_DOWN], [T('c2'), R_DOWN], [E('c2'), R_UP],
  [T('c3'), R_UP], [E('c3'), R_DOWN],
  [T('c5'), R_DOWN], [E('c5'), R_UP],
  [T('c89'), R_UP], [T('c90'), R_DOWN], [E('c91'), R_DOWN], [T('c94'), R_UP],
]);
// NÂNG MÁY. Máy lật hai lần: lật lên xem màn hình (c2), rồi cầm lên lật úp
// xem mặt lưng (c3–c5). Mà lật ngay trên bàn thì thân máy quét nửa vòng quanh
// trục thì cào xuống sàn (máy dày 7 cm), nên phải nhấc máy lên trước.
// Đường nâng là hình vòm: lên trước khi lật, xuống sau khi lật xong.
function liftCurve(t) {
  let v = 0;
  // c2: bàn tay lật máy lên xem màn hình — cũng phải nhấc máy lên, vòm lên
  // rồi xuống, đúng lúc lật (nửa vòm) là lúc máy đứng dọc
  if (t > T('c2') && t < E('c2')) {
    const u = (t - T('c2')) / Math.max(.001, E('c2') - T('c2'));
    v = Math.max(v, .042 * Math.sin(Math.PI * u));
  }
  if (t > T('c3') && t < E('c5')) {
    const up = .055 * ss(clamp((t - T('c3')) / .70, 0, 1));
    const dn = .055 * (1 - ss(clamp((t - (E('c5') - .70)) / .70, 0, 1)));
    v = Math.max(v, Math.min(up, dn));
  }
  return v;
}
const phoneLift = liftCurve;
const handLift = liftCurve;
// máy thứ hai (không cắm sạc) được lật úp để thấy lưng máy ở c82–c84
// máy thứ hai lật úp NGAY trong câu c82 (bàn tay làm việc đó), xong nằm úp tới c84
const phone2Rot = keys([[0, 0], [T('c82'), 0], [T('c82') + .5, Math.PI], [E('c84'), Math.PI], [T('c85'), 0]]);

// ── một lần lúc mở: nhãn in, mực silk, vạch đỏ (không dựng lại mỗi khung) ─
if (N1.charger && N1.charger.setLabel) N1.charger.setLabel('60 W');
if (N2.charger && N2.charger.setLabel) N2.charger.setLabel('60 W');
if (N3.board && N3.board.setSilk) N3.board.setSilk({ port: '20 V', cell: '4 V' });
// vạch đỏ 45 °C nằm trên cảm biến nhiệt trong máy, không phải trên nhiệt kế
if (SNS && SNS.setMark) SNS.setMark(45);
if (N3.stream) POWER.set(N3.stream, t => curBig(t));
// trong túi pin, dòng điện bị điện trở cản lại: hạt thưa và chậm, nhiệt ở trong
if (N4.stream) POWER.set(N4.stream, t => (t >= T('c46') && t <= E('c49')) ? .4 : 1);

// ── âm thanh: giọng kể, không khí, nhạc, foley ───────────────────────────
const EV = [...V.ev];
const ev = (type, t, extra = {}) => EV.push({ type, t: +t.toFixed(3), ...extra });

// không khí: bàn cạnh giường thì ban đêm, các nơi chốn bên trong máy thì trầm
{
  let i = 0;
  while (i < SHOTS.length) {
    const s = SHOTS[i].s;
    let j = i;
    while (j + 1 < SHOTS.length && SHOTS[j + 1].s === s) j++;
    ev('amb', MARK[i].t0, { kind: s === 'N1' ? 'night' : 'low', t1: +MARK[j].t1.toFixed(3) });
    i = j + 1;
  }
}

// nhạc: mỗi chặng bắt đầu ở nhát của nó
for (const [id, cue] of [['c1', 'A'], ['c14', 'B'], ['c24', 'C'], ['c43', 'D'], ['c53', 'E'],
  ['c61', 'B'], ['c69', 'E'], ['c79', 'F'], ['c85', 'G']])
  ev('music', T(id), { cue });
ev('music', V.end - 2.5, { cue: 'end' });

// foley: chỉ khi vật thể thật sự kêu
const FOLEY = [
  ['c2', .15, 'hand_tap', .30], ['c2', .80, 'impact_soft', .22],
  ['c3', .05, 'cloth_rustle', .24], ['c5', .25, 'impact_soft', .26],
  ['c8', .25, 'blip_down', .22], ['c10', .15, 'blip_up', .24],
  ['c13', .30, 'plastic_click', .30], ['c16', .10, 'blip_up', .20],
  ['c19', .10, 'blip_up', .22], ['c21', .20, 'blip_up', .24],
  ['c24', .25, 'plastic_click', .30], ['c26', .15, 'plastic_click', .26],
  ['c33', .20, 'blip_up', .24], ['c38', .45, 'notify', .30],
  ['c39', .30, 'blip_up', .22], ['c47', .25, 'whoosh_soft', .24],
  ['c49', .20, 'blip_up', .25], ['c55', .10, 'whoosh_soft', .22],
  ['c60', .30, 'impact_soft', .26], ['c61', .55, 'plastic_set', .30],
  ['c62', .35, 'whoosh_soft', .20], ['c63', .25, 'hand_tap', .24], ['c63', .55, 'plastic_click', .24],
  ['c64', .10, 'blip_up', .20], ['c65', .30, 'blip_up', .20],
  ['c72', .10, 'blip_up', .28],
  ['c74', .15, 'blip_down', .25], ['c76', .25, 'blip_down', .25],
  ['c78', .10, 'timer_tick', .22],
  ['c82', .40, 'impact_soft', .22], ['c83', .35, 'blip_down', .20],
  ['c86', .25, 'hand_tap', .22], ['c86', .55, 'plastic_set', .26],
  ['c87', .35, 'plastic_click', .30],
  ['c89', .45, 'notify', .30], ['c90', .35, 'whoosh_soft', .24],
  ['c91', .55, 'plastic_click', .32],
  ['c95', .10, 'whoosh_soft', .18],
];
for (const [id, dt, kind, v] of FOLEY) ev(kind, T(id) + dt, { v });

// ── mốc nhịp: mỗi câu một điểm trên khung ────────────────────────────────
// Mốc là chỗ thẻ của câu bám vào (nếu câu có thẻ), không thì là điểm máy
// đang nhìn — nhờ vậy máy kiểm tra được câu nào đang kể mà không có hình.
F.markBeats(ev, V, (id, tm) => {
  const s = shotAt(tm);
  camera.fov = s.sh.fov;
  camera.position.set(s.pos[0], s.pos[1], s.pos[2]);
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();
  const C = CARDS.find(c => c.ids.includes(id));
  const at = C ? (typeof C.at === 'function' ? C.at(tm) : C.at) : s.look;
  const [x, y] = toScreen(new THREE.Vector3(at[0], at[1], at[2]), camera);
  return [x, y];
});

// ── trạng thái vật trong nhát ────────────────────────────────────────────
// các thao tác chỉ đổi một lần thì không gọi lại mỗi khung (dựng lại vật thể)
const LAST = {};

function applyState(id, t) {
  // màn hình: úp ở đầu phim, từ câu 2 thì sáng (vòng đồng hồ sạc chạy)
  const screenOn = t >= T('c2');
  if (N1.phone && N1.phone.setScreen && LAST.screen !== screenOn) { LAST.screen = screenOn; N1.phone.setScreen(screenOn); }
  if (N1.phone && N1.phone.setWarm) N1.phone.setWarm(warmPhone(t));
  if (N1.charger && N1.charger.setWarm) N1.charger.setWarm(warmChg1(t));
  if (N2.charger && N2.charger.setWarm) N2.charger.setWarm(warmChg2(t));
  if (N2.heatSink && N2.heatSink.setWarm) N2.heatSink.setWarm(warmSink(t));
  // cuộn cảm: ở đoạn "nơi sinh nhiệt thứ hai" (c31–c34) nó phải nóng rõ;
  // ở đoạn sạc nhanh (c70–c77) dòng to lên, hạt đỏ nhiều hẳn
  const indCur = t => (t >= T('c31') && t <= E('c34')) ? .85 : curBig(t);
  if (N3.inductor && N3.inductor.setCurrent) N3.inductor.setCurrent(indCur(t));
  if (N3.sensor && N3.sensor.setHot) N3.sensor.setHot(hotSensor(t));
  // túi pin ở N4: nhiệt dồn trong (c48) rồi lan đều ra cả cục (c49)
  if (N4.pouch && N4.pouch.setWarm) N4.pouch.setWarm(warmPouch(t));
  // trong túi pin chỉ có dòng điện và hạt nhiệt khi phim kể về điện trở
  const inCell = (id === 'c46' || id === 'c47');
  if (N4.stream) N4.stream.group.visible = inCell;
  // c48 cũng là cùng chỗ đó: nhiệt bị dồn lại vì không thoát ra ngoài được
  if (N4.plume) {
    N4.plume.group.visible = inCell || id === 'c48';
    if (N4.plume.setRate) N4.plume.setRate(id === 'c48' ? 1.8 : 1);
  }
  // nhiệt lan đều trong túi pin (c49): hạt bay ở góc cưa của túi
  if (N4.inPouch) N4.inPouch.group.visible = (id === 'c49');

  // dòng điện ở N1: phần lớn rơi ra ở cổng máy
  const loss = (id === 'c8' || id === 'c9' || id === 'c10' || id === 'c11' || id === 'c12') ? .25 : 1;
  if (MY.stream && MY.stream.setLoss && LAST.loss !== loss) { LAST.loss = loss; MY.stream.setLoss(5, loss); }
  const dens = (id === 'c88') ? .35 : 1;                       // c88: dòng vào máy THƯA hơn
  if (MY.stream && MY.stream.setDensity && LAST.dens !== dens) { LAST.dens = dens; MY.stream.setDensity(dens); }
  const heat = (id === 'c9' || id === 'c10' || id === 'c11' || id === 'c12') ? 1 : (id === 'c88' ? .08 : .25);
  if (MY.plume && MY.plume.setRate && LAST.heat !== heat) { LAST.heat = heat; MY.plume.setRate(heat); }

  // nhiệt kế thí nghiệm: cột bên phải (máy có case) dốc lên nhanh hơn
  const showTh = (id === 'c63' || id === 'c64' || id === 'c65' || id === 'c66');
  if (MY.th1) { MY.th1.group.visible = showTh; if (MY.th1.setLevel) MY.th1.setLevel(lvlPlain(t)); }
  if (MY.th2) { MY.th2.group.visible = showTh; if (MY.th2.setLevel) MY.th2.setLevel(lvlCase(t)); }

  // N2: nhiệt chỉ hiện từ câu "việc đổi ấy không bao giờ trọn vẹn" (c17) —
  // trước đó củ sạc chưa nóng, và gợn nhiệt ở vỏ chỉ hiện ở c23
  const n2heat = (id === 'c17' || id === 'c18' || id === 'c19' || id === 'c20' || id === 'c21' || id === 'c22' || id === 'c23') ? 1 : 0;
  if (PLM2 && PLM2.setRate && LAST.n2heat !== n2heat) { LAST.n2heat = n2heat; PLM2.setRate(n2heat); }
  // hơi nóng ở cuộn cảm N3 chỉ hiện ở đoạn kể nhiệt (c31–c34) và đoạn
  // sạc nhanh (c72–c73). Trước đó hơi nóng bay ở MỌI nhát N3, kể cả lúc
  // chuyển tầng qua cổng (c24) — sai ngữ cảnh.
  const n3heat = (id === 'c31' || id === 'c32' || id === 'c33' || id === 'c34' || id === 'c72' || id === 'c73') ? 1 : 0;
  if (N3.plume && N3.plume.setRate && LAST.n3heat !== n3heat) { LAST.n3heat = n3heat; N3.plume.setRate(n3heat); }
  if (N2.squiggle) N2.squiggle.group.visible = (id === 'c23');
  // tấm nhãn "60 W" ở c20 bị cuộn biến áp che nửa, chỉ còn chữ "V" lơ lửng: chỉ
  // cho hiện ở đúng nhát đọc nhãn (c14), các nhát khác không có nhãn in để lấp
  if (N2.plate) N2.plate.visible = (id === 'c14');

  // mực silk '20 V'/'4 V' trên bo mạch chỉ hiện ở nhát đọc số đó (c28): ở các
  // nhát cận (c31, c72, c73) máy lọt sát bo mạch, mực in phóng to thành một mảng
  // chữ vô nghĩa. Hai số đó đã có thẻ riêng ở c28.
  if (N3.board && N3.board.group) {
    const silkOn = (id === 'c28');
    if (LAST.silk !== silkOn) {
      LAST.silk = silkOn;
      N3.board.group.traverse(o => { if (o.name === 'silk-cong' || o.name === 'silk-pin') o.visible = silkOn; });
    }
  }


  // ốp case: c58 úp lên máy ở N5; ốp của máy thứ hai thì do applyCase lo (rời máy ở c86)
  const case5 = (id === 'c58' || id === 'c59' || id === 'c60');
  if (CAS5 && CAS5.setOn && LAST.case5 !== case5) { LAST.case5 = case5; CAS5.setOn(case5); }
  // nhiệt ở N5 chỉ bốc lên từ mép case khi ốp đang úp (c58–c59), không bốc từ giữa lưng
  if (PLM5 && PLM5.group) PLM5.group.position.set(0, 0, id === 'c58' || id === 'c59' ? .0345 : 0);
  if (SQG5 && SQG5.group) SQG5.group.position.set(0, 0, id === 'c58' || id === 'c59' ? .0369 : 0);
  // quầng nhiệt dưới vỏ case: nhiệt bị giữ lại quanh máy, không thoát ra ngoài
  if (N5.caseGlow) N5.caseGlow.material.opacity = (id === 'c58' || id === 'c59') ? .20 : 0;
  // bàn tay ở N5 chỉ là chủ thể ở c56–c57; ở c58–c60 nó che mép case và làm rối khung
  if (HND5 && HND5.group) HND5.group.visible = (id === 'c56' || id === 'c57');

  // ba luồng nhiệt trong máy chỉ hiện ở đoạn "gom lại" và lúc vỏ máy nóng
  const heat3 = (id === 'c50' || id === 'c51' || id === 'c52' || id === 'c53' || id === 'c54' || id === 'c55');
  for (const h of HEAT3) h.group.visible = heat3;

  // vệt nóng lệch ở một góc lưng máy (c83–c84)
  if (PATCH.group) PATCH.group.visible = (id === 'c82' || id === 'c83' || id === 'c84');
  // thêm một vệt ấm lớn và mờ trên lưng máy thứ hai, chỉ ở c82 (cả lưng ấm, không chỉ một góc)
  if (WARM2.group) WARM2.group.visible = (id === 'c82');   // WARM2: đĩa gradient .09×.07 gắn vào PIV.phone2
  // hơi nóng bốc lên từ cái máy thứ hai (c81–c84)
  if (HOT2P) HOT2P.group.visible = (id === 'c81' || id === 'c82' || id === 'c83' || id === 'c84');

  // c89: máy vừa cắm sạc vừa chơi game — màn hình phải là màn hình game
  if (N1.phone && N1.phone.setMode) {
    const m1 = (id === 'c89') ? 'game' : 'charge';
    if (LAST.mode1 !== m1) { LAST.mode1 = m1; N1.phone.setMode(m1); }
  }
  // c90–c91: hai vùng nóng trên lưng máy đang sạc (máy đã lật úp xuống)
  if (HOT2.group) HOT2.group.visible = (id === 'c90' || id === 'c91');
  // vệt ấm lan từ cổng sạc trên lưng máy: chỉ ở câu c4
  if (WARMBACK.group) WARMBACK.group.visible = (id === 'c4');

  // ── nắp máy: màn hình, chỉ hiện ở câu "máy đang chạy" (c37–c38) ──
  const lidOn = (id === 'c37' || id === 'c38');
  if (N3.lid) {
    N3.lid.visible = lidOn;
    // Nắp máy MỞ DẦN ở c37: trước đó nó bật hiện như một tấm ảnh rồi đứng yên.
    // Nắp là một cái bản lề thật, nên nó phải mở ra từ mặt máy.
    const lidOpen = id === 'c37' ? clamp((t - T('c37')) / 1.4) : (id === 'c38' ? 1 : 0);
    N3.lid.rotation.x = 1.310 * lidOpen;
  }
  // dòng điện thứ hai: từ túi pin lên chip (c37–c41). Nó không đi qua cổng máy,
  // nên chỉ hiện khi phim kể máy đang chạy — trước đó máy chỉ nhận dòng sạc.
  if (N3.stream2) N3.stream2.group.visible = (id === 'c37' || id === 'c38' || id === 'c39' || id === 'c40' || id === 'c41');
  // các nhát soi cảm biến: tắt dòng điện cho khỏi che, hạt cyan to bằng
  // cả tấm bo và đọc chữ "45 °C" không được
  if (N3.stream && N3.stream.group) N3.stream.group.visible = (id !== 'c74' && id !== 'c75' && id !== 'c76' && id !== 'c77');
  // c78: máy tự cắt dòng sạc — đuôi dòng hạt thưa dần thật sự: từ mép túi pin
  // (u = 0.88) trở đi chỉ còn mỗi hạt thứ ba, nên khoảng cách hạt giãn ra
  const tail78 = (id === 'c78') ? .33 : 1;
  if (N3.stream && N3.stream.setTail && LAST.tail78 !== tail78) { LAST.tail78 = tail78; N3.stream.setTail(.93, tail78); }
  // vùng nóng thứ hai (con chip) và cục pin: chỉ hiện ở đúng nhát kể về chúng
  if (CHIPHEAT) CHIPHEAT.group.visible = (id === 'c41' || id === 'c50');
  if (CELLHEAT) CELLHEAT.group.visible = (id === 'c50');

  if (N3.phone && N3.phone.setMode) {
    const mode = id === 'c38' ? 'game' : (id === 'c37' ? 'busy' : 'charge');
    if (LAST.mode !== mode) { LAST.mode = mode; N3.phone.setMode(mode); }
  }

  // ── thí nghiệm hai máy: chiếc máy thứ hai và bộ sạc thứ hai chỉ có ở c61 ──
  // (c79 trở đi máy thứ hai đã rút sạc: đó là máy nóng khi KHÔNG cắm sạc)
  const exp = t >= T('c61');
  const expEnd = t >= T('c79');
  if (N1.phone2) N1.phone2.group.visible = exp;
  if (N1.case2) N1.case2.group.visible = exp;
  if (N1.charger2) N1.charger2.group.visible = exp;
  if (N1.cable2) N1.cable2.group.visible = exp && !expEnd;
  if (N1.cord2) N1.cord2.visible = exp;
  if (MY.stream2) MY.stream2.group.visible = exp && !expEnd;
  // máy thứ hai đã rút sạc từ c79: màn hình tắt hẳn, không còn vòng đồng hồ sạc
  // (câu c82 kể máy nóng lúc KHÔNG cắm sạc — hình phải đúng vậy)
  const p2on = !expEnd;
  if (N1.phone2 && N1.phone2.setScreen && LAST.p2screen !== p2on) { LAST.p2screen = p2on; N1.phone2.setScreen(p2on); }
}

// ── bàn tay ở N1: chỉ xuất hiện khi nó đang làm việc ──────────────────────
function applyHand(id, t) {
  const H = MY.hand;
  if (!H) return;
  const g = H.group;
  const act = ['c2', 'c3', 'c4', 'c5', 'c82', 'c86', 'c91'];
  g.visible = act.includes(id);
  g.scale.setScalar(.66);      // tay dài 0.18 m so với cái máy 0.15 m
  if (!g.visible) return;
  const u = clamp((t - V.L[id].t0) / Math.max(.001, V.L[id].t1 - V.L[id].t0));
  let x = PH[0] + .335, y = .048, z = PH[2], rot = [0, Math.PI, 0], curl = .45, spread = .35;
  if (id === 'c2') {                      // lật máy lên
    const k = u < .55 ? ss(u / .55) : 1 - ss((u - .55) / .45);
    x = lerp(PH[0] + .46, PH[0] + .335, k);
    y = .048 + handLift(t);                  // tay đi theo máy lúc máy nhấc lên
    curl = .5 - .18 * k;
  } else if (id === 'c3' || id === 'c4') {  // cầm máy lên, lưng quay về máy
    x = PH[0] + .335; z = PH[2]; y = .048 + handLift(t);
    curl = .5; spread = .3;
  } else if (id === 'c5') {              // đặt máy lại xuống bàn
    x = PH[0] + .335; y = .048 + handLift(t); curl = .35;
  } else if (id === 'c82') {            // lật cái máy thứ hai úp xuống rồi rút tay ra khỏi khung
    const k = ss(u);
    const back = ss((u - .45) / .55);   // nửa sau nhát thì tay rút ra
    // tay cỡ thật .18 m: đầu ngón chạm lưng máy rồi rút sang phải, ra khỏi khung
    x = lerp(P2[0] + .245, P2[0] + .46, back);
    z = P2[2] + .03; y = .048;
    curl = .45 - .15 * k; spread = .28;
  } else if (id === 'c86') {             // tháo ốp case khỏi máy thứ hai, đặt sang 1/3 dưới-trái
    // Tay đặt ốp xong rút ra: nếu tay nằm lại đúng chỗ ốp vừa đặt thì tay
    // che mất chính cái ốp mà câu này đang gọi tên.
    const k = ss(u);
    const back = ss((u - .62) / .38);
    x = lerp(lerp(P2[0] + .230, P2[0] + .050, k), P2[0] + .225, back);
    z = lerp(P2[2] + .05, P2[2] + .085, k); y = .048 + .01 * k;
    curl = .45 - .2 * k;
  } else if (id === 'c91') {             // rút cáp khỏi cổng máy: tay nắm đầu cáp và kéo ra
    const k = ss(u);
    x = lerp(PORT[0] + .30, PORT[0] + .146, k); z = PORT[2] + .012; y = .034; curl = .42;
  }
  g.position.set(x, y, z);
  g.rotation.set(rot[0], rot[1], rot[2]);
  if (H.pose) H.pose(curl, spread);
}

// ── máy xoay theo trạng thái (lật máy ở câu 2, úp lại để thấy mặt lưng ở câu 3–4)
function applyPhone(t) {
  if (PIV.phone) { PIV.phone.rotation.x = phoneRot(t); PIV.phone.position.y = PIV.phone.userData.c.y + phoneLift(t); }
}

// ── máy thứ hai lật úp để thấy lưng máy (c82–c84)
function applyPhone2(t) {
  if (PIV.phone2) PIV.phone2.rotation.x = phone2Rot(t);
}

// ── c91: đầu cáp rời khỏi cổng máy ───────────────────────────────────────
// Cổng USB-C nằm ở mép -x của máy, nên đầu cắm trượt ra về phía -x; cả sợi
// dây dịch theo (đầu kia ở củ sạc lệch 3 cm — ngoài khung các nhát sau đó).
function applyPlug(t) {
  if (!N1.cable || !N1.cable.group) return;
  const u = (t >= T('c91')) ? clamp((t - T('c91')) / Math.max(.001, E('c91') - T('c91'))) : 0;
  const d = .030 * ss(u);
  N1.cable.group.position.set(PORT[0] - d, PORT[1], PORT[2]);
}

// ── ốp case ở N1: ở câu 86 nó rời khỏi máy thứ hai và nằm sang bên
// ốp case là CON của trục quay của máy thứ hai: nó lật theo máy, không bao giờ
// nằm lọt trong thân máy (đó là vệt z-fighting ở c82–c84)
// Ốp case là CON của trục quay của máy thứ hai: toạ độ của nó phải tính
// trong khung của trục, không phải khung cảnh. Ghi toạ độ cảnh vào đây là
// ốp bay mất khỏi máy (đó là cái khay rỗng lọt vào khung c62).
function applyCase(t) {
  if (!N1.case2 || !N1.case2.group) return;
  const g = N1.case2.group;
  const cy = PIV.phone2 ? PIV.phone2.userData.c.y : 0;
  if (t >= T('c86')) {
    const u = clamp((t - T('c86')) / Math.max(.001, E('c86') - T('c86')));
    const k = ss(u);
    // đặt ốp ở 1/3 dưới-trái, cách máy 1.6 cm, rồi tay rút ra
    g.position.set(lerp(CASE_HOME.x, CASE_HOME.x - .17, k), lerp(CASE_HOME.y, .004 - cy, k), lerp(CASE_HOME.z, CASE_HOME.z + .085, k));
    g.rotation.set(0, .25 * k, 0);
  } else {
    g.position.copy(CASE_HOME);
    g.rotation.set(0, 0, 0);
  }
}

// ── đầu dây bám theo máy ────────────────────────────────────────────────
// Cổng sạc nằm trên máy. Máy được cầm lên (c2, c3–c5) thì cổng đi lên theo,
// đầu cắm phải đi theo nốt; nếu không thì khung c4 sẽ thấy đầu cắm rơi ra
// khỏi máy. Đoạn dây gần máy được vẽ lại theo điểm mới.
const PORT_LOCAL = new THREE.Vector3(-.075, .00442, 0);   // miệng cổng USB-C trên máy
function applyCable(t) {
  const cbl = N1.cable;
  if (!cbl || !cbl.group || !cbl.setNear) return;
  if (!PIV.phone || !N1.phone || !N1.phone.group) return;
  const g = PIV.phone;
  // miệng cổng trong khung thế giới: đi theo trục quay và độ cao của máy
  const off = new THREE.Vector3().copy(N1.phone.group.position).add(PORT_LOCAL);
  off.applyQuaternion(g.quaternion);
  const world = off.add(g.position);
  cbl.setNear(world);
}

// ── cập nhật vật: mỗi vật một lần mỗi khung hình ────────────────────────
const UPD = new Map();
function updatersOf(set) {
  if (!UPD.has(set)) {
    const list = [];
    if (set.group) set.group.traverse(o => { if (typeof o.update === 'function') list.push(o); });
    UPD.set(set, list);
  }
  return UPD.get(set);
}
function updateScene(set, t, id) {
  const done = new Set();
  if (set.group && typeof set.group.update === 'function') { set.group.update(t, { id }); done.add(set.group); }
  for (const o of updatersOf(set)) {
    if (done.has(o)) continue;
    if (o.userData && o.userData.ownUpdate) continue;   // vật của tập phim tự cập nhật
    o.update(t, POWER.has(o) ? POWER.get(o)(t, id) : 1);
    done.add(o);
  }
}

// ── dựng khung ───────────────────────────────────────────────────────────
window.DUR = V.end;
window.EV = EV;

window.render = t => {
  const s = shotAt(t);
  const sh = s.sh, u = s.u, id = sh.ids[0];
  camera.fov = sh.fov;
  camera.position.set(s.pos[0] + sh.d[0] * ss(u), s.pos[1] + sh.d[1] * ss(u), s.pos[2] + sh.d[2] * ss(u));
  camera.lookAt(s.look[0], s.look[1], s.look[2]);
  camera.updateProjectionMatrix();

  applyPhone(t);
  applyPhone2(t);
  applyHand(id, t);
  applyCase(t);
  applyCable(t);
  applyState(id, t);
  const set = setOf[sh.s];
  updateScene(set, t, id);
  // vật của tập phim tự dựng: gọi tay, vì props trả update ở ngoài group
  for (const o of OWN) {
    if (!o.update) continue;
    o.update(t, POWER.has(o) ? POWER.get(o)(t, id) : 1);
  }

  const dist = camera.position.distanceTo(new THREE.Vector3(s.look[0], s.look[1], s.look[2]));
  F.frame(sceneOf(set, sh.s), {
    t,
    thick: clamp(1.95 + dist * .7, 2.0, 3.8),
    ref: dist,
    key: set.key || null,
    fade: Math.min(1, t / .3 + .2, (window.DUR - t) / .4),
    // phụ đề khắc vào hình, và các thẻ thuật ngữ bám vào vật
    overlay: (g, tt) => {
      const out = [];
      const sub = V.sub(tt);
      if (sub) subtitle(g, sub);
      for (const C of CARDS) {
        const win = C.windows.find(w => tt >= w[0] && tt <= w[1]);
        if (!win) continue;
        const size = C.size ?? 40;
        g.save(); g.font = `900 ${size}px "Be Vietnam Pro"`;
        const bw = g.measureText(C.text).width + size, bh = size * 1.55;
        g.restore();
        const a = typeof C.at === 'function' ? C.at(tt) : C.at;
        const [ax, ay] = toScreen(new THREE.Vector3(a[0], a[1], a[2]), camera);
        let x = ax + bw / 2 + 26 + (C.dx || 0);
        let y = ay - bh / 2 - 44 + (C.dy || 0);
        // (giữ nguyên công thức cũ cho các thẻ chưa dùng cardPt)
        x = clamp(x, bw / 2 + 30, 1916 - bw / 2);
        y = clamp(y, bh / 2 + 8, 876 - bh / 2 - 48);
        const b = label(g, C.text, x, y, tt, win[0], win[1], { id: C.id, size });
        if (b) out.push(b);
      }
      return out;
    },
  });
};

// chẩn đoán: nhát đang quay, vị trí máy, và mốc thời gian thật của các câu
window.DIAG = t => {
  const s = shotAt(t);
  return {
    shot: s.i + 1, ids: s.sh.ids, u: +s.u.toFixed(3),
    pos: s.pos.map(v => +v.toFixed(3)), look: s.look.map(v => +v.toFixed(3)),
    L: Object.fromEntries(Object.entries(V.L).slice(0, 4).map(([k, v]) => [k, [+v.t0.toFixed(3), +v.t1.toFixed(3)]])),
    mark: MARK.map(m => [+m.t0.toFixed(2), +m.t1.toFixed(2)]),
    cards: CARDS.map(c => [c.id, c.ids.join(','), c.lines.join(','), c.windows.map(w => [+w[0].toFixed(2), +w[1].toFixed(2)])]),
  };
};

window.TEXTS = t => { window.render(t); return F.texts(); };
await document.fonts.load('900 54px "Be Vietnam Pro"');
window.render(0);
window.READY = true;

