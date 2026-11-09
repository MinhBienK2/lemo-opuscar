// Bối cảnh của tập 02 — "Vì sao điện thoại nóng lúc sạc?"
//
// Năm nơi chốn của phim, mỗi nơi một diorama riêng:
//   N1 · bàn cạnh giường (buổi tối) — cảnh mở, cảnh thí nghiệm, cảnh kết
//   N2 · trong củ sạc        — ruột củ sạc đã cưa, nền tối, một vệt sáng
//   N3 · trong điện thoại    — chính cái máy ở N1, đã cưa ngang, mở ra
//   N4 · trong túi pin       — mặt cắt túi pin phóng to, các lớp xếp chồng
//   N5 · vỏ máy và bàn tay   — lưng máy, ốp case, bàn tay chạm vào
//
// Quy ước: một đơn vị = MỘT MÉT. Mặt bàn ở y = 0. Máy quay luôn nhìn từ +z.
// Vật thì lấy từ ./props.js (vật được dựng đúng là nó, có bộ phận nhận ra được);
// ở đây chỉ dựng BỐI CẢNH: mặt bàn, tường, đèn bàn, sàn khấu, vệt sáng, bàn tay.
//
// Mỗi nơi có đèn riêng của nó (đèn chính + ambience + vệt sáng của đèn bàn) và
// đèn nằm TRONG group của nơi ấy: bật/tắt group là bật/tắt cả ánh sáng theo.
import * as THREE from 'three';
import { toon, rbox, mesh, canvasTex, TEX, fxLayer, clamp, lerp } from '../../../../rig/kit.js';
import { keyLight, ambience, pool } from '../../../../rig/lights.js';
import { section } from '../../../../rig/section.js';
import { cable as rigCable, chip as rigChip, battery as rigBattery } from '../../../../rig/parts.js';
import {
  createPhone, createCharger, createCable, createWallSocket, createCase,
  createCurrentStream, createHeatPlume, createHeatSquiggle, createTransformer, createHeatSink,
  createInductor, createThermalSensor, createUSBCPort, createBoard, createBatteryCut, createHand,
} from './props.js';

// ── tiện ích ────────────────────────────────────────────────────────────────
const AX = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

// hộp bao của một nhóm, đo trong không gian thế giới
function frameOf(obj) {
  obj.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(obj);
}

// trục dài / trung / mỏng của một vật: điện thoại có thể được props dựng nằm hay đứng,
// ta tự xoay cho nó nằm sấp và màn hình ngửa lên
function axesOf(box) {
  const s = box.getSize(new THREE.Vector3());
  const list = [['x', s.x], ['y', s.y], ['z', s.z]].sort((a, b) => b[1] - a[1]);
  return { long: list[0][0], mid: list[1][0], thin: list[2][0], size: s };
}

// Đo vật trong CHÍNH khung dựng của nó: bỏ phép xoay/đặt của props đi, vì mặt phẳng
// cắt của section() và phép xoay ta tính đều nói trong khung đó.
// Đồng thời dò mặt kính: màn hình là mảng sáng (basic/emissive) lệch về một phía
// của tâm vật; không tìm thấy thì coi như màn hình nằm ở phía + của trục mỏng.
function measureLocal(obj) {
  const q = obj.quaternion.clone(), p = obj.position.clone(), s = obj.scale.clone();
  obj.quaternion.identity(); obj.position.set(0, 0, 0); obj.scale.set(1, 1, 1);
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(obj);
  const ax = axesOf(box);
  const c = box.getCenter(new THREE.Vector3());
  let best = null, area = 0;
  obj.traverse(o => {
    if (!o.isMesh || !o.material) return;
    const m = o.material;
    const bright = m.isMeshBasicMaterial || (m.emissive && (m.emissive.r + m.emissive.g + m.emissive.b) > .12);
    if (!bright) return;
    const bb = new THREE.Box3().setFromObject(o), sz = bb.getSize(new THREE.Vector3());
    const a = Math.max(sz.x * sz.y, sz.y * sz.z, sz.x * sz.z);
    if (a > area) { area = a; best = bb.getCenter(new THREE.Vector3()); }
  });
  const sign = best ? (Math.sign(best.clone().sub(c).dot(AX[ax.thin])) || 1) : 1;
  obj.quaternion.copy(q); obj.position.copy(p); obj.scale.copy(s);
  obj.updateMatrixWorld(true);
  return { box, ax, sign };
}

// phép xoay đưa trục dài nằm ngang X, trục mỏng nằm dọc Y, mặt kính ngửa lên (+Y)
function flatQuat(ax, sign) {
  const eLong = AX[ax.long].clone();
  const eScreen = AX[ax.thin].clone().multiplyScalar(sign);
  const eMid = new THREE.Vector3().crossVectors(eLong, eScreen).normalize();
  const S = new THREE.Matrix4().makeBasis(eLong, eScreen, eMid);
  return new THREE.Quaternion().setFromRotationMatrix(S.clone().transpose());
}

// xoay vật cho nó nằm sấp; screenUp = false thì úp màn hình xuống (lưng máy ngửa lên)
function layFlat(obj, screenUp = true) {
  const m = measureLocal(obj);
  obj.quaternion.copy(flatQuat(m.ax, m.sign * (screenUp ? 1 : -1)));
  obj.updateMatrixWorld(true);
  return obj;
}

// đặt vật nằm xuống mặt bàn: đáy chạm y, tâm nằm ở (x, z)
function putOn(obj, x, z, y = 0) {
  obj.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(obj);
  const c = b.getCenter(new THREE.Vector3());
  obj.position.x += x - c.x;
  obj.position.z += z - c.z;
  obj.position.y += y - b.min.y;
  obj.updateMatrixWorld(true);
  return obj;
}

// chỉ thu nhỏ, không phóng to: linh kiện lạ không được lớn hơn cái vỏ nó nằm trong
function shrinkToFit(obj, maxDim) {
  const b = frameOf(obj), s = b.getSize(new THREE.Vector3());
  const m = Math.max(s.x, s.y, s.z);
  if (m > maxDim) { obj.scale.multiplyScalar(maxDim / m); obj.updateMatrixWorld(true); }
  return obj;
}

// vỏ đặc cắt ra sẽ thành một khối kín; đánh dấu "vỏ" để section() mở nó thành
// khoảng trống có thành — nhìn vào đó thấy ruột, không thấy một mặt cắt phẳng
function markHollow(obj) {
  obj.traverse(o => { if (o.isMesh) o.userData.hollow = true; });
  return obj;
}

// toạ độ theo phần trăm của ba trục: dài (fl), ngang (fm), mỏng (ft)
function pos3(box, ax, fl, fm, ft) {
  const p = new THREE.Vector3();
  const put = (axis, v) => { if (axis === 'x') p.x = v; else if (axis === 'y') p.y = v; else p.z = v; };
  put(ax.long, lerp(box.min[ax.long], box.max[ax.long], fl));
  put(ax.mid, lerp(box.min[ax.mid], box.max[ax.mid], fm));
  put(ax.thin, lerp(box.min[ax.thin], box.max[ax.thin], ft));
  return p;
}

// một thanh hộp đặt theo ba trục của vật: dài theo trục `along`, thấp theo trục mỏng
function barBox(ax, along, len, cross, height) {
  const d = { x: 0, y: 0, z: 0 };
  d[along] = len;
  d[along === ax.long ? ax.mid : ax.long] = cross;
  d[ax.thin] = height;
  return rbox(d.x, d.y, d.z, .001);
}

// vẽ lại một texture đã có: giữ hình dáng vật, bỏ chữ không được phép
function repaint(tex, draw) {
  const g = tex.image.getContext('2d');
  draw(g, tex.image.width, tex.image.height);
  tex.needsUpdate = true;
}

// rig in số trên nắp chip ("IC-7404") và trên mặt túi pin ("3.85V 4500mAh");
// quy tắc của tập chỉ cho bốn con số, nên ta vẽ lại nắp và nhãn
function cleanChip(obj) {
  obj.traverse(o => {
    const mats = Array.isArray(o.material) ? o.material : (o.material ? [o.material] : []);
    for (const m of mats) {
      if (!m.map || !m.map.image) continue;
      repaint(m.map, (g, W, H) => {
        g.fillStyle = '#1d1f24'; g.fillRect(0, 0, W, H);
        g.beginPath(); g.arc(W * .16, H * .16, 14, 0, Math.PI * 2);
        g.fillStyle = '#34373e'; g.fill();
      });
    }
  });
  return obj;
}

function cleanPouch(obj) {
  obj.traverse(o => {
    const mats = Array.isArray(o.material) ? o.material : (o.material ? [o.material] : []);
    for (const m of mats) {
      if (!m.map || !m.map.image) continue;
      repaint(m.map, (g, W, H) => {
        g.fillStyle = '#c9ced6'; g.fillRect(0, 0, W, H);
        g.fillStyle = '#1d1f24'; g.font = 'bold 54px sans-serif';
        g.textAlign = 'left'; g.fillText('Li-ion', W * .2, H * .3);
        // mép hàn của túi: dải xám nhạt chạy ngang mép dưới. KHÔNG vẽ vạch
        // đỏ trên túi — vạch đỏ là mốc 45 °C, mà mốc đó chỉ thuộc cảm biến trong
        // máy; một vạch đỏ dài trên túi làm người xem tưởng túi mang nhiệt độ.
        g.fillStyle = '#9aa2ad'; g.fillRect(0, H * .74, W, H * .26);
      });
    }
  });
  return obj;
}

// phép xoay đưa trục X của vật vào u và trục Y của vật vào v (trục Z suy ra cho đúng tay)
function rotFrom(u, v) {
  const w = new THREE.Vector3().crossVectors(u, v).normalize();
  return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(u, v, w));
}

// phần trăm của một điểm dọc theo một trục
function frac(box, ax, p, which) {
  const axis = ax[which];
  const v = axis === 'x' ? p.x : axis === 'y' ? p.y : p.z;
  const lo = box.min[axis], hi = box.max[axis];
  return hi - lo < 1e-9 ? .5 : clamp((v - lo) / (hi - lo));
}

// handle cho phim: vừa là group (dùng được .position, .rotation) vừa giữ hàm của props
function handle(props) {
  const g = props.group;
  g.group = g;                                     // tự tham chiếu: h.group.* vẫn chạy
  for (const k of Object.keys(props)) {
    if (k === 'group') continue;
    if (typeof props[k] === 'function') g[k] = props[k].bind(props);
  }
  g.props = props;
  return g;
}

// nhãn in trên vỏ: chỉ dùng "60 W" (một trong bốn con số được phép)
function labelPlate(text) {
  const tex = canvasTex(256, 128, () => { });
  const plate = mesh(new THREE.PlaneGeometry(.020, .010), toon('#ffffff', { map: tex }), [0, 0, 0], { cast: false });
  const draw = t => {
    const g = tex.image.getContext('2d');
    g.fillStyle = '#f4f2ea'; g.fillRect(0, 0, 256, 128);
    g.strokeStyle = '#c9c5b8'; g.lineWidth = 6; g.strokeRect(6, 6, 244, 116);
    g.fillStyle = '#20222c'; g.font = 'bold 74px sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(t, 128, 70);
    tex.needsUpdate = true;
  };
  draw(text);
  plate.setLabel = draw;
  return plate;
}

// một mặt phẳng phía trước theo trục đã cho (trục mỏng của vỏ)
function faceAxis(axis) {
  if (axis === 'x') return [0, Math.PI / 2, 0];
  if (axis === 'y') return [-Math.PI / 2, 0, 0];
  return [0, 0, 0];
}

// vệt sáng dẫn mắt tới cơ cấu: một vòng hình nón mờ cộng thêm
function lightShaft(group, from, to, r = .05, color = '#ffe3b0', alpha = .15) {
  const dir = new THREE.Vector3().subVectors(to, from), len = dir.length();
  const geo = new THREE.CylinderGeometry(r * .30, r, len, 24, 1, true);
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color), transparent: true, opacity: alpha,
    depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false,
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(from).addScaledVector(dir, .5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  m.renderOrder = 6;
  fxLayer(m);
  group.add(m);
  return m;
}

// bụi lơ lửng trong vệt sáng: không có bụi thì vệt sáng chỉ là một hình vẽ
function dustMotes(group, n, box, color = '#ffe8c0') {
  const spk = new THREE.InstancedMesh(
    new THREE.SphereGeometry(.0016, 6, 5),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: .55, depthWrite: false, toneMapped: false }),
    n);
  spk.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  spk.frustumCulled = false; spk.renderOrder = 8;
  fxLayer(spk); group.add(spk);
  const pos = [], m4 = new THREE.Matrix4();
  for (let i = 0; i < n; i++) pos.push(new THREE.Vector3());
  return {
    spk, pos,
    update(t) {
      for (let i = 0; i < n; i++) {
        const sd = (i * .618033) % 1, sd2 = (i * .381966) % 1;
        const u = ((t * .05 + sd) % 1);
        pos[i].set(
          lerp(box.min.x, box.max.x, sd),
          lerp(box.min.y, box.max.y, sd2) + u * .02,
          lerp(box.min.z, box.max.z, (sd + .37) % 1));
        m4.compose(pos[i], new THREE.Quaternion(), new THREE.Vector3(.6 + sd2 * .8, .6 + sd2 * .8, .6 + sd2 * .8));
        spk.setMatrixAt(i, m4);
      }
      spk.count = n; spk.instanceMatrix.needsUpdate = true;
    },
  };
}

// nền tối dùng chung cho các nơi cưa ngang: sẫm màu, không đen tuyệt đối
function darkBackdrop(group, w = 3, h = 1.8, z = -.55) {
  const tex = canvasTex(64, 512, (g, w2, h2) => {
    const gr = g.createLinearGradient(0, 0, 0, h2);
    gr.addColorStop(0, '#2c2742'); gr.addColorStop(.55, '#1d1a30'); gr.addColorStop(1, '#121020');
    g.fillStyle = gr; g.fillRect(0, 0, w2, h2);
  });
  const m = mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }), [0, h / 2 - .25, z], { cast: false, recv: false });
  group.add(m);
  return m;
}

// sàn khấu: một mặt bàn tối có cạnh, để vật có chỗ đứng chứ không lơ lửng
function stage(group, w, d, y = -.02, color = '#241f38') {
  group.add(mesh(rbox(w, .04, d, .012), toon(color), [0, y - .02, 0]));
  group.add(mesh(rbox(w + .03, .012, d + .03, .005), toon('#3a3355'), [0, y - .038, 0]));
}

// nền trời tối dùng chung cho cả phim
function nightBackground(scene, top, mid, bot) {
  scene.background = canvasTex(64, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, top); gr.addColorStop(.6, mid); gr.addColorStop(1, bot);
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// N1 · Bàn cạnh giường, buổi tối
// ─────────────────────────────────────────────────────────────────────────────
export function buildNightstand(scene) {
  const group = new THREE.Group();
  group.name = 'n1-ban-can-giuong';
  scene.add(group);

  nightBackground(scene, '#20233d', '#161830', '#0e1020');
  scene.fog = new THREE.Fog('#121426', 2.6, 6.5);

  // ── bàn gỗ: mặt bàn ở y = 0, chân bàn xuống sàn nhà ──
  const M = {
    wood: toon('#ffffff', { map: TEX.wood() }),
    woodDark: toon('#5c3a22'),
    wall: toon('#ffffff', { map: TEX.wall() }),
    cloth: toon('#8fa0c8'),
    metal: toon('#b9becb'),
  };
  M.wood.map.repeat.set(2, 1);
  M.wall.map.repeat.set(3, 2);
  const TOPX = .05, TOPZ = -.13;
  group.add(mesh(rbox(2.0, .035, 1.0, .008), M.wood, [TOPX, -.0175, TOPZ]));            // mặt bàn
  group.add(mesh(rbox(2.0, .045, .03, .008), M.woodDark, [TOPX, -.05, TOPZ + .49]));       // cạnh trước
  for (const dx of [-.90, .90]) for (const dz of [-.44, .44])                              // chân bàn
    group.add(mesh(rbox(.05, .52, .05, .008), M.woodDark, [TOPX + dx, -.30, TOPZ + dz]));
  group.add(mesh(new THREE.PlaneGeometry(6, 6), toon('#2a2438'), [0, -.565, 0], { rot: [-Math.PI / 2, 0, 0], cast: false })); // sàn nhà

  // ── tường sau lưng bàn (tối), có ván chân tường ──
  group.add(mesh(new THREE.PlaneGeometry(4, 2.6), M.wall, [0, .7, -.625], { cast: false }));
  group.add(mesh(rbox(4, .07, .02, .006), toon('#4a4360'), [0, -.50, -.61]));

  // ── ánh sáng: đèn bàn ấm là tiêu điểm, ánh trăng lạnh làm đèn chính ──
  const key = keyLight(scene, { from: new THREE.Vector3(-1.25, 1.45, 1.05), to: new THREE.Vector3(-.10, .04, .04), color: '#a9baff', intensity: 1.15, size: 1.2 });
  const amb = ambience(scene, { sky: '#3c4470', ground: '#1e1830', fill: .40, rim: '#8f6ad8', rimI: .65, rimFrom: [2.4, 1.8, -1.4] });
  const lampLight = pool(scene, { from: new THREE.Vector3(.80, .34, -.26), to: new THREE.Vector3(-.10, .01, .05), color: '#ffcf9a', intensity: 3.1, angle: .58, penumbra: .82 });
  group.add(key, key.target, amb.hemi, amb.rim, lampLight, lampLight.target);   // đèn đi theo group của nơi này

  // ── đèn bàn (ấm) ở (0.92, 0, −0.30) ──
  const lamp = new THREE.Group();
  lamp.name = 'den-ban';
  lamp.position.set(.92, 0, -.30);
  group.add(lamp);
  lamp.add(mesh(new THREE.CylinderGeometry(.055, .062, .022, 24), M.metal, [0, .011, 0]));
  lamp.add(mesh(new THREE.CylinderGeometry(.012, .014, .30, 12), M.metal, [0, .16, 0]));
  lamp.add(mesh(new THREE.CylinderGeometry(.010, .010, .16, 10), M.metal, [-.05, .325, .02], { rot: [0, 0, .95] }));
  const shade = new THREE.Group();
  shade.position.set(-.11, .365, .025); shade.rotation.set(.18, 0, -.62);
  lamp.add(shade);
  shade.add(mesh(new THREE.ConeGeometry(.085, .10, 28, 1, true), toon('#e8dfc8', { side: THREE.DoubleSide }), [0, .02, 0]));
  const bulb = mesh(new THREE.SphereGeometry(.019, 12, 10), toon('#fff2c8', { emissive: '#ffd98a', emissiveIntensity: .9 }), [0, -.02, 0], { cast: false });
  shade.add(bulb);
  fxLayer(bulb);

  // ── khăn gấp: một món đồ trên bàn cho bàn có người dùng ──
  const cloth = new THREE.Group();
  cloth.name = 'khan-gap';
  cloth.position.set(.62, .004, .10); cloth.rotation.y = .3;
  for (let i = 0; i < 3; i++)
    cloth.add(mesh(rbox(.13, .008, .10, .004), M.cloth, [i * .004, i * .009, i * .003], { rot: [0, .04 * i, 0] }));
  group.add(cloth);

  // ── ổ cắm trên tường ở (−0.78, 0.14, −0.60) ──
  const socket = createWallSocket();
  socket.group.position.set(-.78, .14, -.60);
  group.add(socket.group);

  // ── củ sạc 1 ở (−0.62, 0, −0.34): bộ sạc có dây, cổng USB-C quay về máy ──
  const charger = createCharger({ watts: '60 W', plug: false });
  charger.group.rotation.set(0, .57, -.06);
  putOn(charger.group, -.62, -.34, 0);
  group.add(charger.group);

  // ── điện thoại đang sạc ở (−0.34, 0, 0.06): nằm sấp, màn hình ngửa lên ──
  const phone = createPhone({ charging: true });
  layFlat(phone.group, true);
  putOn(phone.group, -.34, .06, 0);
  group.add(phone.group);

  // ── dây nối củ sạc → điện thoại: hai đầu USB-C, mỗi đầu cắm đúng cổng ──
  const port1 = worldPoint(phone.plugPoint, phone.group);
  const chgPort1 = worldPoint(charger.usbPort, charger.group);
  const cable = createCable({ len: port1.distanceTo(chgPort1), far: 'usb' });
  layCable(cable.group, port1, chgPort1);
  group.add(cable.group);

  // ── dây nguồn từ ổ cắm xuống củ sạc: đầu dây mút vào phích cắm trong ổ ──
  const CORD_PTS = [[-.60, .012, -.32], [-.71, .012, -.45], [-.78, .08, -.53], [-.7955, .142, -.556], [-.7955, .142, -.5732]];
  const cord = rigCable({
    points: CORD_PTS,
    r: .0042, color: '#2c2f36', plug: null,
  });
  group.add(cord);
  // điểm neo cho thẻ "DÂY NGUỒN": giữa đoạn dây ngay dưới phích cắm — chỗ
  // nhát cận c13 (ổ cắm + dây) nhìn thấy. Không gõ tay toạ độ ngoài set.
  const cordNear = new THREE.Vector3(...CORD_PTS[2]).lerp(new THREE.Vector3(...CORD_PTS[3]), .5);

  // ── nhiệt kế và ốp case thừa không đứng trên bàn: phim tự dựng nhiệt kế đặt
  //    lên lưng từng cái máy, và ốp case nằm trên máy thứ hai ──

  // ── hai cái máy thí nghiệm: một có case, một không, CÙNG SẠC ──
  // Máy thứ hai ở (−0.02, 0, 0.20), cắm vào củ sạc thứ hai (ở −0.44, 0, −0.52).
  const phone2 = createPhone({ charging: true });
  layFlat(phone2.group, true);
  putOn(phone2.group, -.115, .135, 0);
  group.add(phone2.group);
  const case2 = createCase();
  case2.group.quaternion.copy(phone2.group.quaternion);
  case2.group.position.set(-.115, 0, .135);             // ngay trên máy thí nghiệm
  case2.setOn(true);                                   // ốp úp lên máy
  group.add(case2.group);

  // củ sạc thứ hai: bộ sạc có dây, cổng USB-C quay về máy thứ hai
  const charger2 = createCharger({ watts: '60 W', plug: false });
  charger2.group.rotation.set(0, .56, -.06);
  putOn(charger2.group, -.44, -.52, 0);
  group.add(charger2.group);
  const port2 = worldPoint(phone2.plugPoint, phone2.group);
  const chgPort2 = worldPoint(charger2.usbPort, charger2.group);
  const cable2 = createCable({ len: port2.distanceTo(chgPort2), far: 'usb' });
  layCable(cable2.group, port2, chgPort2);
  group.add(cable2.group);
  // dây nguồn của củ sạc thứ hai: chân cắm vào lỗ thứ hai của ổ
  const cord2 = rigCable({
    points: [[-.46, .012, -.51], [-.58, .012, -.545], [-.70, .06, -.560], [-.7645, .142, -.545], [-.7645, .142, -.5614]],
    r: .0042, color: '#2c2f36', plug: 'wall',
  });
  group.add(cord2);

  // ── bàn tay: phim tự dựng (props của tập), nên ở đây không có tay nào ──

  const motes = dustMotes(group, 14, new THREE.Box3(
    new THREE.Vector3(-.10, .02, -.10), new THREE.Vector3(.80, .30, .10)));

  return {
    group,
    phone: handle(phone),
    charger: handle(charger),
    socket: handle(socket),
    cable: handle(cable),
    phone2: handle(phone2),
    case2: handle(case2),
    charger2: handle(charger2),
    cable2: handle(cable2),
    cord,
    cordNear,
    cord2,
    lamp,
    key,
    // điểm neo để phim đặt cảnh: vị trí thật của từng vật trên bàn
    anchors: {
      phone: worldOf(phone.group),
      charger: worldOf(charger.group),
      socket: worldOf(socket.group),
      cable: worldOf(cable.group),
      phone2: worldOf(phone2.group),
      case2: worldOf(case2.group),
      charger2: worldOf(charger2.group),
      cable2: worldOf(cable2.group),
      lamp: worldOf(lamp),
      // tâm chữ "60 W" in trên vỏ củ sạc 1 (N1) — để nhát c87 và thẻ bám
      // đúng vào chữ, không gõ tay toạ độ ngoài set
      label: charger.group.localToWorld(charger.labelPoint.clone()),
      // mép phải của tấm nhãn: thẻ "60 W" bám vào đây thì thân thẻ không che mất chữ
      labelRight: (() => {
        const lab = charger.group.getObjectByName('nhan-in');
        if (!lab) return charger.group.localToWorld(charger.labelPoint.clone());
        lab.updateWorldMatrix(true, false);
        return lab.localToWorld(new THREE.Vector3(lab.geometry.parameters.width * .30, 0, 0));
      })(),
    },
    update(t) {
      cable.update?.(t);
      cable2.update?.(t);
      motes.update(t);
    },
  };
}

// đặt một sợi dây: đầu USB-C thứ nhất ở A, đầu thứ hai ở B.
// Trục dọc của dây luôn là hướng lên trời, nên dây luôn võng xuống bàn chứ không võng ngang.
function layCable(g, A, B) {
  const x = new THREE.Vector3().subVectors(B, A);
  if (x.lengthSq() < 1e-8) return g;
  x.normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const y = up.clone().addScaledVector(x, -up.dot(x));
  if (y.lengthSq() < 1e-6) y.set(0, 0, 1);
  y.normalize();
  const z = new THREE.Vector3().crossVectors(x, y);
  g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
  g.position.copy(A);
  g.updateMatrixWorld(true);
  return g;
}

// điểm trong không gian thế giới: props trả về điểm (Vector3) hoặc một vật thể
function worldPoint(p, group) {
  if (!p) return null;
  if (p.isObject3D) { p.updateWorldMatrix(true, false); return p.getWorldPosition(new THREE.Vector3()); }
  if (p.isVector3) return group.localToWorld(p.clone());
  return null;
}

// vị trí thế giới của một vật — điểm neo để phim ngắm ống kính
function worldOf(o) {
  o.updateWorldMatrix(true, false);
  return o.getWorldPosition(new THREE.Vector3());
}

// ─────────────────────────────────────────────────────────────────────────────
// N2 · Trong củ sạc
// ─────────────────────────────────────────────────────────────────────────────
export function buildChargerIn(scene) {
  const group = new THREE.Group();
  group.name = 'n2-trong-cu-sac';
  scene.add(group);

  nightBackground(scene, '#3c3566', '#282240', '#1a1628');
  scene.fog = new THREE.Fog('#221d33', 1.4, 4.2);

  darkBackdrop(group, 2.4, 1.5, -.42);
  stage(group, .90, .60, -.03, '#3a3252');

  // đèn chính chếch từ máy quay + một vệt sáng dẫn mắt vào ruột củ sạc
  const key = keyLight(scene, { from: new THREE.Vector3(-.42, .52, .60), to: new THREE.Vector3(0, .03, 0), color: '#ffe7c2', intensity: 2.0, size: .7 });
  const amb = ambience(scene, { sky: '#5a5a96', ground: '#2c2338', fill: 1.05, rim: '#9a7ae8', rimI: 1.0, rimFrom: [1.6, 1.2, -1.2] });
  const face = pool(scene, { from: new THREE.Vector3(.22, .26, .46), to: new THREE.Vector3(0, .03, .01), color: '#ffe0ae', intensity: 2.4, angle: .48, penumbra: .8 });
  group.add(key, key.target, amb.hemi, amb.rim, face, face.target);

  // ── củ sạc: dựng nguyên rồi cưa một nêm phía máy quay ──
  const dia = new THREE.Group();
  dia.name = 'ruot-cu-sac';
  const S = 3;                                     // phóng to: đây là cảnh cận
  dia.scale.setScalar(S);
  group.add(dia);

  const charger = createCharger({ watts: '60 W' });
  markHollow(charger.group);                       // vỏ mở ra thành khoảng trống, thấy ruột
  const cm = measureLocal(charger.group);
  const cb = cm.box, cax = cm.ax;
  // Cưa ở đúng giữa THÂN vỏ (z = 0 trong khung củ sạc), không phải giữa hộp bao:
  // hộp bao có hai chân cắm ở phía sau (z = −.0168) nên giữa hộp bao là
  // −.0034, cắt lệch thì nhãn in trên mặt trên bị cưa mất một nửa.
  const cutAt = 0;
  const cut = section(charger.group, {
    normal: [AX[cax.thin].x, AX[cax.thin].y, AX[cax.thin].z],
    at: cutAt,
  });
  cut.group.name = 'cu-sac-cat';
  dia.add(cut.group);
  // miệng cắt luôn quay về phía máy quay (+z)
  if (cax.thin !== 'z') {
    dia.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(AX[cax.thin], AX.z));
    dia.updateMatrixWorld(true);
  }

  // nhãn "60 W" phải còn đọc được sau khi cưa: nếu nhãn của props đã mất, dán tấm nhãn riêng
  const hasLabel = cut.group.children.some(o => o.isMesh && o.material && o.material.map);
  let plate = null;
  if (!hasLabel) {
    plate = labelPlate('60 W');
    const p = pos3(cb, cax, .5, .5, .5);
    const eps = (cb.max[cax.thin] - cb.min[cax.thin]) * .02;
    if (cax.thin === 'x') p.x += eps; else if (cax.thin === 'y') p.y += eps; else p.z += eps;
    plate.position.copy(p);
    plate.rotation.set(...faceAxis(cax.thin));
    cut.group.add(plate);
  }

  // ── linh kiện nằm trong khoảng trống của vỏ, phía sau miệng cắt ──
  const transformer = createTransformer();
  shrinkToFit(transformer.group, .016);
  transformer.group.position.copy(pos3(cb, cax, .32, .5, .30));
  transformer.group.rotation.set(0, .3, .1);
  cut.group.add(transformer.group);

  const chip = rigChip({ w: .007, d: .006, h: .0022, pins: 6 });
  shrinkToFit(chip, .0075);
  cleanChip(chip);
  chip.position.copy(pos3(cb, cax, .62, .5, .30));
  cut.group.add(chip);

  const heatSink = createHeatSink();
  shrinkToFit(heatSink.group, .016);
  heatSink.group.position.copy(pos3(cb, cax, .48, .5, .16));
  cut.group.add(heatSink.group);

  const port = createUSBCPort();
  shrinkToFit(port.group, .010);
  port.group.position.copy(pos3(cb, cax, .88, .5, .26));
  port.group.quaternion.setFromUnitVectors(AX.z, AX[cax.long]);       // miệng cổng quay ra cuối củ sạc
  cut.group.add(port.group);

  // ── dòng điện: từ chân cắm, qua cuộn biến áp, ra cổng USB-C ──
  const stream = createCurrentStream([
    pos3(cb, cax, .10, .5, .22),
    pos3(cb, cax, .32, .5, .30),
    pos3(cb, cax, .62, .5, .30),
    pos3(cb, cax, .90, .5, .26),
  ], { n: 70, speed: 1, color: '#8fe3ff', size: .0022 });
  cut.group.add(stream.group);

  // ── nhiệt: mọc đúng ở cuộn dây đồng của cuộn biến áp ──
  // Điểm neo: tâm cuộn dây (10 vòng torus ở y = h*.22…h*.22+9*h*.058 trong
  // khung cuộn biến áp), đưa về khung của cut.group.
  transformer.group.updateWorldMatrix(true, false);
  const coilW = transformer.group.localToWorld(new THREE.Vector3(0, .0062, 0));
  cut.group.updateWorldMatrix(true, false);
  const plumeAt = cut.group.worldToLocal(coilW.clone());
  const plume = createHeatPlume(plumeAt, { n: 44, color: '#ff9a3c', size: .0032 });
  plume.group.scale.setScalar(.30);          // bám quanh cuộn dây, không thành đám lớn
  cut.group.add(plume.group);
  const squiggle = createHeatSquiggle([
    pos3(cb, cax, .48, .5, .40),
    pos3(cb, cax, .48, .5, .54),
    pos3(cb, cax, .48, .5, .68),
  ], { color: '#ff9a3c' });
  cut.group.add(squiggle.group);

  const motes = dustMotes(group, 12, new THREE.Box3(
    new THREE.Vector3(-.10, .02, -.04), new THREE.Vector3(.10, .22, .06)));

  // đặt củ sạc lên sàn khấu: đáy chạm mặt sàn
  dia.position.y += -.03 - new THREE.Box3().setFromObject(dia).min.y;

  // màu ấm dần của mỏ tản nhiệt: nắm màu gốc để tô lại cho chắc
  const warmTargets = [];
  cut.group.traverse(o => { if (o.isMesh && o.material && o.material.color) warmTargets.push([o.material, o.material.color.clone()]); });
  const setWarm = k => {
    warmTargets.forEach(([mat, base]) => mat.color.copy(base).lerp(new THREE.Color('#d8561f'), clamp(k) * .75));
    heatSink.setWarm?.(k);
    charger.setWarm?.(k);
  };

  // handle trên chính cái vỏ đã cưa: phim dùng được cả N2.charger.group.* lẫn N2.charger.setWarm()
  const chargerHandle = handle({ group: cut.group });
  for (const k of Object.keys(charger)) if (typeof charger[k] === 'function') chargerHandle[k] = charger[k].bind(charger);
  chargerHandle.setWarm = setWarm;
  chargerHandle.setLabel = txt => { plate?.setLabel(txt); charger.setLabel?.(txt); };

  return {
    group,
    charger: chargerHandle,
    transformer: handle(transformer),
    heatSink: handle(heatSink),
    chip: handle({ group: chip }),
    port: handle(port),
    stream: handle(stream),
    plume: handle(plume),
    squiggle: handle(squiggle),
    plate,                                   // tấm nhãn "60 W" trên mặt cắt (phim ẩn được)
    key,
    anchors: {
      transformer: worldOf(transformer.group),
      // gốc của củ sạc (không phải tâm hộp bao: hộp bao có chân cắm và ruột,
      // tâm hộp bao lệch hẳn sang một bên, máy quay nhắm vào đó thì vật lệch góc)
      origin: worldOf(charger.group),
      heatSink: worldOf(heatSink.group),
      chip: worldOf(chip),
      plume: worldPoint(plumeAt, cut.group),
      // tâm chữ "60 W" trên vỏ: đọc thẳng từ tấm nhãn sau khi cưa,
      // vì nhóm cắt dịch vị trí so với khung gốc của củ sạc
      label: (() => {
        const lab = cut.group.getObjectByName('nhan-in');
        if (!lab) return dia.localToWorld(charger.labelPoint.clone());
        lab.updateWorldMatrix(true, false);
        return lab.localToWorld(new THREE.Vector3(0, 0, 0));
      })(),
      // mép phải của tấm nhãn: thẻ "60 W" bám vào đây thì thân thẻ không che mất chữ
      labelRight: (() => {
        const lab = cut.group.getObjectByName('nhan-in');
        if (!lab) return dia.localToWorld(charger.labelPoint.clone());
        lab.updateWorldMatrix(true, false);
        return lab.localToWorld(new THREE.Vector3(lab.geometry.parameters.width * .30, 0, 0));
      })(),
    },
    update(t, opt = {}) {
      transformer.update?.(t);
      stream.update?.(t, opt.power ?? 1);
      plume.update?.(t);
      squiggle.update?.(t);
      motes.update(t);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// N3 · Trong điện thoại
// ─────────────────────────────────────────────────────────────────────────────
export function buildPhoneIn(scene) {
  const group = new THREE.Group();
  group.name = 'n3-trong-dien-thoai';
  scene.add(group);

  nightBackground(scene, '#332c55', '#211c38', '#151225');
  scene.fog = new THREE.Fog('#1d1932', 1.0, 3.0);

  darkBackdrop(group, 2.0, 1.3, -.36);
  stage(group, .80, .50, -.02, '#2f2848');

  const key = keyLight(scene, { from: new THREE.Vector3(-.26, .40, .46), to: new THREE.Vector3(0, .01, 0), color: '#ffe9c8', intensity: 2.2, size: .5 });
  const amb = ambience(scene, { sky: '#55558c', ground: '#2a2136', fill: 1.05, rim: '#8f72dc', rimI: .9, rimFrom: [1.3, 1.0, -1.0] });
  const face = pool(scene, { from: new THREE.Vector3(.16, .20, .36), to: new THREE.Vector3(0, .01, 0), color: '#ffdcae', intensity: 2.2, angle: .46, penumbra: .8 });
  group.add(key, key.target, amb.hemi, amb.rim, face, face.target);

  // ── chính cái máy ở N1, mổ ngang: khung máy cắt ra, ruột lộ ra ──
  const frame = new THREE.Group();
  frame.name = 'khung-dien-thoai';
  group.add(frame);

  const phone = createPhone({ charging: false });
  markHollow(phone.group);                        // vỏ mở thành lòng, thấy ruột
  // Cụm camera nhô ra khỏi mặt lưng: không tính vào hộp của thân máy, nếu không
  // mọi phép đặt vật theo tỉ lệ (pos3) sẽ lệch hết.
  const bump3 = phone.group.getObjectByName('cum-camera');
  if (bump3) phone.group.remove(bump3);
  const pm = measureLocal(phone.group);
  if (bump3) phone.group.add(bump3);
  const pb = pm.box, pax = pm.ax, pSign = pm.sign;
  const cutAt = (pb.min[pax.thin] + pb.max[pax.thin]) / 2;
  const cut = section(phone.group, {
    normal: [AX[pax.thin].x * pSign, AX[pax.thin].y * pSign, AX[pax.thin].z * pSign],
    at: cutAt,
  });
  cut.group.name = 'dien-thoai-cat';
  frame.add(cut.group);
  // xoay cả khung cho máy nằm sấp, miệng cắt ngửa lên (bỏ nửa có màn hình)
  frame.quaternion.copy(flatQuat(pax, pSign));
  frame.updateMatrixWorld(true);

  // ── nắp máy: nửa trên (có màn hình) cưa ra, treo lơ lửng phía trên thân ──
  // Nắp chỉ hiện ở câu "máy đang chạy" (c37–c38): thấy màn hình sáng mà vẫn
  // thấy bo mạch bên dưới. Nghiêng về phía máy quay để đọc được màn hình.
  const lidCut = section(phone.group, {
    normal: [-AX[pax.thin].x * pSign, -AX[pax.thin].y * pSign, -AX[pax.thin].z * pSign],
    at: -cutAt,
  });
  lidCut.group.name = 'dien-thoai-nap-cat';
  const lid = new THREE.Group();
  lid.name = 'nap-dien-thoai';
  lidCut.group.position.set(0, 0, -.035);   // bản lề ở mép gần máy quay (z = +35mm)
  lid.add(lidCut.group);
  lid.position.set(0, cutAt, .035);
  lid.rotation.x = 1.310;                  // mở 75°: màn hình nghiêng 15° về máy quay,
  //                                          nên bo mạch phía dưới còn lộ ra 1/3 khung
  lid.visible = false;
  // Màn hình của nắp phải CHẠY: máy bị cưa thành hai nửa nên hàm update của
  // máy không còn chạy, mà màn hình thì nằm ở nửa trên. Không vẽ lại nó thì cả
  // câu "máy đang chạy" có một màn hình đứng chết một tấm ảnh.
  lid.update = t => phone.redrawScreen?.(t);
  frame.add(lid);

  // viền khung: bốn thanh mảnh quanh miền, đọc ra là khung máy đã mở
  const rim = toon('#565070');
  const PL = pb.max[pax.long] - pb.min[pax.long], PW = pb.max[pax.mid] - pb.min[pax.mid];
  const rimDefs = [
    [pax.long, PL, .5, .02], [pax.long, PL, .5, .98],
    [pax.mid, PW, .02, .5], [pax.mid, PW, .98, .5],
  ];
  for (const [along, len, l, m] of rimDefs) {
    const bar = mesh(barBox(pax, along, len, .003, .003), rim, [0, 0, 0]);
    bar.position.copy(pos3(pb, pax, l, m, .5));
    cut.group.add(bar);
  }

  // ── bo mạch: đúng kích thước thật, có mực silk 20 V và 4 V ──
  // Số đo của chính cái máy đã cưa (đơn vị mét, trong khung cut):
  //   đáy máy (mặt lưng)          FLOOR  = −0.0018
  //   miệng cắt (viền máy)        cutAt  = +0.0036
  //   mặt trên bo mạch            BOARD_TOP = −0.0002
  const FLOOR = -.0018;
  const BOARD_TOP = FLOOR + .0016;
  const board = createBoard();
  board.group.quaternion.copy(rotFrom(AX[pax.long], AX[pax.thin]));   // bo nằm phẳng trong lòng máy
  board.group.position.set(-.0152, FLOOR, 0);                          // bo nằm sát đáy máy
  cut.group.add(board.group);
  board.setSilk?.({ port: '20 V', cell: '4 V' });

  // các linh kiện trên bo: lấy của bo nếu bo đã có, không thì dựng riêng
  const boardParts = findParts(board.group, { inductor: /cuon|indu|coil/i, battery: /tui-pin|batt/i });

  // Bo của props đã có sẵn MỘT cuộn cảm nữa; N3 dựng cuộn cảm của riêng nó
  // (cuộn này mới nằm trên đường hạt và mới nhận setCurrent). Ẩn bản trùng để
  // khung chỉ có MỘT cuộn cảm — thẻ c34 và c72 không còn trỏ nhầm.
  board.group.children.forEach(o => {
    if (!o.isGroup) return;
    if (Math.abs(o.position.x - .009) < 1e-6 && Math.abs(o.position.z + .002) < 1e-6) o.visible = false;
  });

  const inductor = boardParts.inductor
    ? { group: boardParts.inductor, setCurrent: k => boardParts.inductor.setCurrent?.(k) }
    : createInductor();
  if (!boardParts.inductor) {
    shrinkToFit(inductor.group, .0075);
    // đáy cuộn cảm nằm trên mặt bo (gốc cuộn cao hơn đáy nó 1.2 mm)
    inductor.group.position.set(-.039, BOARD_TOP + .0012, .0155);
    cut.group.add(inductor.group);
  }

  const chip = rigChip({ w: .016, d: .016, h: .0035, pins: 10, quad: true });
  shrinkToFit(chip, .017);
  cleanChip(chip);
  chip.position.set(.006, BOARD_TOP, -.0154);      // con chip hạ điện áp, nằm trên mặt bo
  cut.group.add(chip);

  // ── túi pin: một mảng bạc lớn nằm MỘT BÊN bo, không chồng lên bo ──
  const battery = { group: boardParts.battery || rigBattery({ kind: 'pouch', s: .085 }) };
  if (!boardParts.battery) {
    shrinkToFit(battery.group, .062);                // 62 × 40 × 3.1 mm
    cleanPouch(battery.group);
    battery.group.position.set(.052, FLOOR, 0);      // sát mép phải, đáy túi ngang đáy máy
    battery.group.quaternion.copy(rotFrom(
      AX[pax.long].clone(), AX[pax.thin].clone()));  // 62mm chạy theo chiều sâu của máy
    cut.group.add(battery.group);
  }
  const CELL_TOP = FLOOR + .0031;                   // mặt trên túi pin

  // ── cảm biến nhiệt: áp sát mặt túi pin, không chuiy xuống bo ──
  const sensor = createThermalSensor();
  shrinkToFit(sensor.group, .007);
  sensor.group.position.set(.052, CELL_TOP, -.0105); // trên mặt túi pin
  sensor.group.userData.baseY = CELL_TOP;           // giữ chiều cao khi vật rung
  cut.group.add(sensor.group);

  // cổng USB-C ở đáy máy (miệng quay ra đáy)
  const port = createUSBCPort();
  shrinkToFit(port.group, .010);
  const portPos = new THREE.Vector3(-.0740, (FLOOR + cutAt) / 2 + .0009, 0);
  port.group.position.copy(portPos);
  port.group.quaternion.setFromUnitVectors(AX.z, AX[pax.long].clone().negate());  // miệng cổng quay ra đáy máy
  cut.group.add(port.group);

  // ── dòng điện: vào cổng, chạy trên mặt bo, qua cuộn cảm, lên túi pin ──
  // Dòng hạt phải chạy SÁT mặt bo (y = BOARD_TOP + 0.9 mm), không chuiy xuống
  // dưới bo, và phải thấy rõ là đi từ miệng cổng vào trong.
  const stream = createCurrentStream([
    portPos.clone().add(new THREE.Vector3(-.012, 0, 0)),   // từ ngoài đi vào miệng cổng
    portPos.clone(),
    new THREE.Vector3(-.060, BOARD_TOP + .0009, .004),
    new THREE.Vector3(-.039, BOARD_TOP + .0009, .0155),     // qua cuộn cảm
    new THREE.Vector3(-.012, BOARD_TOP + .0009, .012),
    new THREE.Vector3(.014, BOARD_TOP + .0009, .004),
    new THREE.Vector3(.032, BOARD_TOP + .0009, 0),           // tới đầu nối túi pin ở mép bo
    new THREE.Vector3(.0455, CELL_TOP + .0012, -.0030),      // lên mặt túi pin
    new THREE.Vector3(.0505, CELL_TOP + .0018, -.0090),      // bắt đầu đi ngang qua cảm biến
    new THREE.Vector3(.0552, CELL_TOP + .0018, -.0128),      // đi qua cảm biến
    new THREE.Vector3(.0620, CELL_TOP + .0018, -.0170),      // và đoạn cuối, chỗ dòng bị cắt
  ], { n: 80, speed: 1, color: '#8fe3ff', size: .0022 });
  cut.group.add(stream.group);

  // nhiệt mọc ở đỉnh cuộn cảm — nơi điện bị thất thoát lần thứ hai
  const plume = createHeatPlume(new THREE.Vector3(-.039, BOARD_TOP + .0047, .0155),
    { n: 34, color: '#ff9a3c', rise: .012, spread: .008, size: .0019 });
  cut.group.add(plume.group);

  // ── dòng điện thứ hai: từ mặt túi pin lên đỉnh chip (c40) ──
  // Dòng thứ nhất đi từ cổng máy vào qua cuộn cảm lên túi pin. Khi máy đang
  // chạy, túi pin đẩy một dòng riêng lên chip — dòng này không đi qua cổng.
  const chipTop = new THREE.Vector3(.006, BOARD_TOP + .0041, -.0154);
  const cellFace = new THREE.Vector3(.042, CELL_TOP + .0004, -.006);
  const stream2Mid = cellFace.clone().lerp(chipTop, .5).add(new THREE.Vector3(0, .005, .004));
  const stream2 = createCurrentStream([
    cellFace.clone(),
    stream2Mid.clone(),
    chipTop.clone(),
  ], { n: 44, speed: 1, color: '#8fe3ff' });
  cut.group.add(stream2.group);

  const motes = dustMotes(group, 10, new THREE.Box3(
    new THREE.Vector3(-.09, .01, -.05), new THREE.Vector3(.09, .16, .05)));

  // đặt máy đã mổ lên sàn khấu: đáy chạm mặt sàn
  frame.position.y += -.02 - new THREE.Box3().setFromObject(frame).min.y;

  return {
    group,
    board: handle(board),
    port: handle(port),
    inductor: handle(inductor),
    sensor: handle(sensor),
    battery: handle(battery),
    chip: handle({ group: chip }),
    stream: handle(stream),
    stream2: handle(stream2),
    plume: handle(plume),
    // thân máy đã cưa: đây là "cái điện thoại" của cảnh, không phải cả bộ dựng cảnh
    phone: handle({
      group: cut.group,
      setScreen: phone.setScreen, setCharging: phone.setCharging,
      setWarm: phone.setWarm, setMode: phone.setMode,
      redrawScreen: phone.redrawScreen,
    }),
    // nắp máy (có màn hình), treo lơ lửng
    lid: handle({ group: lid }),
    key,
    anchors: {
      board: worldOf(board.group),
      port: worldOf(port.group),
      inductor: worldOf(inductor.group),
      sensor: worldOf(sensor.group),
      battery: worldOf(battery.group),
      chip: worldOf(chip),
      stream: worldPoint(new THREE.Vector3(-.012, BOARD_TOP + .0009, .012), cut.group),
      stream2: worldPoint(stream2Mid, cut.group),
      cell: worldPoint(new THREE.Vector3(.052, CELL_TOP, -.010), cut.group),
      // chỗ dòng hạt thưa dần khi máy tự giảm dòng sạc (c78): dòng hạt đi
      // ngang qua cảm biến, thẻ "TỰ GIẢM DÒNG SẠC" neo vào đúng chỗ đó
      cellTail: worldPoint(new THREE.Vector3(.0520, CELL_TOP + .0012, -.0111), cut.group),
      plume: worldPoint(new THREE.Vector3(-.039, BOARD_TOP + .0047, .0155), cut.group),
      phone: worldOf(cut.group),
      lid: worldOf(lid),
    },
    update(t, opt = {}) {
      stream.update?.(t, opt.power ?? 1);
      stream2.update?.(t, opt.power ?? 1);
      plume.update?.(t);
      inductor.setCurrent?.(opt.current ?? .35);
      motes.update(t);
    },
  };
}

// tìm một bộ phận bên trong một nhóm theo tên (props đặt tên tiếng Việt không dấu)
function findParts(root, rules) {
  const out = {};
  root.traverse(o => {
    for (const [key, re] of Object.entries(rules)) {
      if (out[key]) continue;
      const label = `${o.name || ''} ${o.userData?.part || ''}`;
      if (re.test(label)) out[key] = o;
    }
  });
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// N4 · Trong túi pin
// ─────────────────────────────────────────────────────────────────────────────
export function buildCellIn(scene) {
  const group = new THREE.Group();
  group.name = 'n4-trong-tui-pin';
  scene.add(group);

  nightBackground(scene, '#262038', '#171325', '#0d0b17');
  scene.fog = new THREE.Fog('#131020', .8, 2.4);

  darkBackdrop(group, 1.8, 1.2, -.34);
  stage(group, .70, .44, -.02, '#1d1830');

  const key = keyLight(scene, { from: new THREE.Vector3(-.22, .34, .40), to: new THREE.Vector3(0, .02, 0), color: '#ffeacb', intensity: 2.5, size: .45 });
  const amb = ambience(scene, { sky: '#454578', ground: '#211a2b', fill: .42, rim: '#8364cc', rimI: .6, rimFrom: [1.1, .9, -.9] });
  const face = pool(scene, { from: new THREE.Vector3(.14, .17, .30), to: new THREE.Vector3(0, .02, 0), color: '#ffdcae', intensity: 2.3, angle: .45, penumbra: .8 });
  group.add(key, key.target, amb.hemi, amb.rim, face, face.target);

  // ── túi pin đã cưa một góc (cùng một vật với túi pin ở N3) ──
  const pouch = createBatteryCut();
  const S = 3.0;                       // túi pin 18.6 × 27 cm — vừa sàn khấu, vừa khung
  const dia = new THREE.Group();
  dia.name = 'mat-cat-tui-pin';
  dia.scale.setScalar(S);
  dia.position.set(.140, .01, -.055);
  dia.rotation.y = -1.28;             // góc cưa quay về phía trước-bên phải
  group.add(dia);
  pouch.group.rotation.set(-.20, 0, .07);
  dia.add(pouch.group);
  dia.position.y += -.02 - new THREE.Box3().setFromObject(dia).min.y;   // túi pin nằm trên sàn khấu

  // ── các lớp xếp chồng: mặt cắt phóng to, mỗi lớp một màu ──
  const layers = new THREE.Group();
  layers.name = 'lop-tui-pin';
  group.add(layers);
  // MẶT CẮT: bốn lớp xếp sát, cạnh cắt quay về máy quay, xoay 30° để nhìn
  // thấy "lớp là lớp"; ranh giới giữa lớp là đường nằm ngang trong khung.
  const LW = .150, LD = .110, LT = .013;
  const LAYER_DEF = [
    ['lop-dong', '#c4703c'], ['lop-graphite', '#3a3841'],
    ['lop-cach-dien', '#e8e1cd'], ['lop-nhom', '#bcc2cb'],
  ];
  LAYER_DEF.forEach(([name, color], i) => {
    const slab = new THREE.Group();
    slab.name = name;
    slab.position.set(0, i * LT, 0);
    slab.add(mesh(rbox(LW, LT * .92, LD, LT * .2), toon(color), [0, 0, 0]));
    layers.add(slab);
  });
  layers.position.set(-.175, .010, .075);
  layers.rotation.y = .52;             // 30°: mặt cắt chếch, không phẳng bóng

  // vỏ bạc phía sau các lớp: khung phải đọc ra "trong túi pin", không phải tường
  group.add(mesh(rbox(.240, .130, .004, .001), toon('#8f97a1'), [-.207, .070, .020], { rot: [0, .52, 0] }));
  group.add(mesh(rbox(.240, .090, .004, .001), toon('#6f7782'), [-.207, .176, .000], { rot: [-.45, .52, 0] }));

  // ── dòng điện nằm TRONG các lớp: đi từ lớp cách điện xuống lớp
  // graphite, cắt ngang đúng ranh giới giữa hai lớp (y = 1.5 × LT), rồi bị cản.
  // Toạ độ dưới đây là toạ độ TRONG group lớp, nên hạt nằm giữa các tấm.
  const stream = createCurrentStream([
    new THREE.Vector3(-.028, .050, .056),
    new THREE.Vector3(-.026, .038, .056),
    new THREE.Vector3(-.022, .028, .056),
    new THREE.Vector3(-.018, .0195, .056),   // điểm xuyên: ranh giới graphite ↔ cách điện
    new THREE.Vector3(-.010, .012, .056),
    new THREE.Vector3(.004, .009, .056),
  ], { n: 70, speed: 1, color: '#8fe3ff', size: .0022 });
  layers.add(stream.group);

  // ── nhiệt bùng lên ngay tại điểm xuyên, bên trong túi pin ──
  const plume = createHeatPlume(new THREE.Vector3(-.018, .0195, .056), { n: 40, color: '#ff7a3c', rise: .020, spread: .007, size: .0019 });
  layers.add(plume.group);
  // khung bao vô hình của luồng nhiệt cao .095 m sẽ phồng khung của mặt cắt:
  // thu nhỏ lại để các thẻ bám lớp ở c44 không bị kéo lùi
  const ph = plume.group.children.find(c => c.isMesh && c.geometry && c.geometry.type === 'BoxGeometry');
  if (ph) ph.scale.setScalar(.05);
  // không vẽ gợn nhiệt phẳng ở N4: trong túi pin, nhiệt là hạt, và hạt phải nằm
  // đúng tại ranh giới lớp (điểm xuyên), không phải một vệt cam dán phẳng

  // NHIỆT BỊ GIỮ LẠI TRONG TÚI PIN (c49): nó không thoát ra ngoài được, và nó
  // lan đều ra cả cục. Vẽ nó bằng hạt bay ở góc cưa — chỗ mở ra — chứ không
  // phải một quầng cam dán lên vỏ bạc.
  pouch.group.updateWorldMatrix(true, false);
  const cutCorner = pouch.group.localToWorld(new THREE.Vector3(.031, .005, -.045));
  const inPouch = createHeatPlume(cutCorner, { n: 46, color: '#ff7a3c', rise: .034, spread: .022, size: .0026 });
  group.add(inPouch.group);

  const motes = dustMotes(group, 10, new THREE.Box3(
    new THREE.Vector3(-.12, .01, -.10), new THREE.Vector3(.18, .20, .06)));

  return {
    group,
    layers,
    pouch: handle(pouch),
    stream: handle(stream),
    plume: handle(plume),
    inPouch: handle(inPouch),
    key,
    anchors: {
      layers: worldOf(layers),
      // điểm dòng điện cắt qua ranh giới lớp graphite ↔ lớp cách điện
      cross: worldPoint(new THREE.Vector3(-.018, .0195, .056), layers),
      // cùng ranh giới đó, lệch sang phải 12 mm: chỗ thẻ bám, khỏi đè lên cụm hạt
      crossEdge: worldPoint(new THREE.Vector3(-.006, .0195, .056), layers),
      // cụm hạt nhiệt
      heat: worldPoint(new THREE.Vector3(-.018, .0195, .056), layers),
      pouch: worldOf(dia),
    },
    update(t, opt = {}) {
      stream.update?.(t, opt.power ?? 1);
      plume.update?.(t);
      motes.update(t);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// N5 · Vỏ máy và bàn tay
// ─────────────────────────────────────────────────────────────────────────────
export function buildShell(scene) {
  const group = new THREE.Group();
  group.name = 'n5-vo-may-va-tay';
  scene.add(group);

  nightBackground(scene, '#282341', '#191628', '#100e1c');
  scene.fog = new THREE.Fog('#141121', .9, 2.8);

  darkBackdrop(group, 2.0, 1.3, -.38);
  stage(group, .70, .46, -.02, '#2c2442');

  const key = keyLight(scene, { from: new THREE.Vector3(-.30, .42, .50), to: new THREE.Vector3(0, .02, 0), color: '#ffeacb', intensity: 3.3, size: .5 });
  const amb = ambience(scene, { sky: '#5a5a95', ground: '#2b2340', fill: .58, rim: '#9a7ae8', rimI: .8, rimFrom: [1.4, 1.0, -1.1] });
  const face = pool(scene, { from: new THREE.Vector3(.18, .22, .40), to: new THREE.Vector3(0, .02, 0), color: '#ffdcae', intensity: 2.9, angle: .46, penumbra: .8 });
  group.add(key, key.target, amb.hemi, amb.rim, face, face.target);

  // ── lưng máy: cùng cái máy ở N1, úp sấp xuống cho lưng ngửa lên ──
  const back = createPhone({ charging: false });
  layFlat(back.group, false);
  putOn(back.group, 0, 0, -.02);                 // úp lên sàn khấu, lưng máy ngửa lên
  group.add(back.group);

  // máy thứ hai (KHÔNG có ốp) đứng cạnh, chỉ hiện ở nhát so sánh c60
  const back2 = createPhone({ charging: false });
  layFlat(back2.group, false);
  putOn(back2.group, .172, 0, -.02);             // cách máy có ốp 17 cm
  group.add(back2.group);

  // ── ốp case: úp lên máy thì chặn nhiệt, gỡ ra thì nhiệt thoát ──
  const caseObj = createCase();
  // Máy ở N5 nằm úp sấp nên lưng ngửa lên. Ốp phải úp NGƯỢC lại một lần nữa:
  // thành ốp phải đứng LÊN trên lưng máy. Không lật thì cả ốp nằm dưới máy,
  // chuim vào sàn khấu, và khung c58–c59 không có gì để nhìn.
  caseObj.group.quaternion.copy(back.group.quaternion)
    .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI));
  caseObj.group.position.copy(back.group.position);
  caseObj.group.position.y += .0018;                    // đáy ốp nằm ngay trên mặt lưng
  caseObj.setOn(true);
  group.add(caseObj.group);

  // ── bàn tay chạm vào lưng máy ──
  const hand = createHand();
  hand.group.rotation.set(0, Math.PI / 2, 0);         // ngón chỉ về phía máy
  hand.group.updateMatrixWorld(true);
  const hb = new THREE.Box3().setFromObject(hand.group);
  hand.group.position.set(0, -.008, .005 - hb.min.z);   // đầu ngón chạm lưng máy
  hand.pose(.30, .28);
  group.add(hand.group);

  // ── nhiệt tỏa ra từ lưng máy ──
  // Mặt lưng máy nằm 1,8 mm cao hơn gốc máy (máy úp sấp): mọi hạt nhiệt
  // phải mọc TỪ mặt lưng, không mọc ra từ trong thân máy.
  const backY = back.group.position.y + .0021;
  const plume = createHeatPlume(new THREE.Vector3(0, backY, 0), { n: 40, color: '#ff9a3c', rise: .010, spread: .010 });
  group.add(plume.group);
  const squiggle = createHeatSquiggle([
    new THREE.Vector3(-.03, backY, .02),
    new THREE.Vector3(0, backY, 0),
    new THREE.Vector3(.03, backY, -.02),
  ], { color: '#ff9a3c' });
  group.add(squiggle.group);

  // quầng nhiệt hắt trên mặt lưng: nhiệt bị vỏ case giữ lại quanh máy, không
  // thoát ra ngoài được — vệt sáng này là hình của cái bị chặn
  const caseGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(.148, .062),
    new THREE.MeshBasicMaterial({ color: '#ff6a2c', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide })
  );
  caseGlow.rotation.x = Math.PI / 2;
  caseGlow.position.set(0, backY - .0002, 0);
  group.add(caseGlow);

  const motes = dustMotes(group, 10, new THREE.Box3(
    new THREE.Vector3(-.10, .01, -.08), new THREE.Vector3(.10, .18, .08)));

  return {
    group,
    back: handle(back),
    case: handle(caseObj),
    hand: handle(hand),
    plume: handle(plume),
    squiggle: handle(squiggle),
    caseGlow,
    key,
    anchors: {
      back: worldOf(back.group),
      hand: worldOf(hand.group),
      plume: worldPoint(new THREE.Vector3(0, backY, 0), group),
      // mép vỏ case: chỗ thẻ "ỐP CASE" bám vào
      caseRim: worldPoint(new THREE.Vector3(-.076, .0092, 0), caseObj.group),
    },
    update(t, opt = {}) {
      plume.update?.(t);
      squiggle.update?.(t);
      motes.update(t);
    },
  };
}
