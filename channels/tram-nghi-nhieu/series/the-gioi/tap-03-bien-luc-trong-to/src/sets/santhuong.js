// N1 · sân thượng nhà (chiều muộn · Mặt Trời sát chân trời · xế chiều)
//
// Sân thượng là nơi trả lời câu hỏi của tập: Mặt Trời sắp lặn thì mọi thứ trên
// sân thượng đổi màu theo. Vì vậy mỗi giờ ở đây là một bảng màu riêng:
//   'dusk'      · chiều muộn  → ánh sáng hổ phách, trời cao còn xanh
//   'hoang-hon' · Mặt Trời sát chân trời → cam đỏ, mọi vật nhuốm cam
//   'xep-chieu' · đã lặn     → giờ xanh, tờ giấy trắng hóa xanh nhạt
//
// Nguyên tắc bố cục: lan can ở mép sân thượng, nhà thang bên trái, thùng nước
// bên phải, cây chuối ở góc trái, tờ giấy vắt trên nan lan can. Phía sau lan can
// là thành phố ở dưới thấp (ta đứng trên cao), rồi chân trời nhiều tầng, rồi
// trời. Đèn chính là Mặt Trời thấp, hắt qua nan lan can nên sàn có vệt nắng
// có hình; cửa sổ nhà thang đổ thêm một vệt ấm lên tường.
import * as THREE from 'three';
import { PAL, toon, canvasTex, TEX, rbox, mesh, fxLayer, mulberry, clamp, lerp } from '../../../../../rig/kit.js';
import { keyLight, ambience, pool } from '../../../../../rig/lights.js';
import { V3, skyTexture } from './common.js';

// ── bố cục (toạ độ thế giới) ─────────────────────────────────────────────
const RAIL_Z = -3.90;        // lan can ở mép sân thượng
const RAIL_W = 11.0;
const ROOF_FRONT = 12.0;     // mép sân thượng phía máy
const HOUSE = [-3.05, 0, -1.55];
const TANK = [2.25, 0, -0.85];
const TREE = [-1.95, 0, -3.35];
const PAPER_X = 0.38;        // tờ giấy nằm ở đúng tâm khung cận cảnh c36
const PAPER_Y = 1.00;        // tâm phần rủ phía trước của tờ giấy
const PAPER_Z = RAIL_Z + .10; // tờ giấy vắt qua thanh tay vịn ở z = RAIL_Z
const TANK_R = .55, TANK_STAND = .36, TANK_BODY = .72;

// ── chất liệu vẽ tay (có seed, dùng lại cho cả ba giờ) ────────────────────
let _brick, _plaster, _metal, _paper, _leaf, _cityMap, _cityEmi, _wallPaint, _trunk;

const brickTex = () => (_brick ||= canvasTex(1024, 1024, (g, w, h) => {
  const r = mulberry(21);
  g.fillStyle = '#584c43'; g.fillRect(0, 0, w, h);          // vữa giữa gạch
  const rows = 9, bh = h / rows, bw = w / 6;
  for (let j = 0; j < rows; j++) {
    const off = (j % 2) * bw / 2;
    for (let i = -1; i < 7; i++) {
      const x = i * bw + off, y = j * bh, t = .84 + r() * .34;
      g.fillStyle = `rgb(${Math.min(255, 176 * t) | 0},${(110 * t) | 0},${(84 * t) | 0})`;
      g.fillRect(x + 2, y + 2, bw - 4, bh - 4);
      g.fillStyle = 'rgba(255,236,206,.30)'; g.fillRect(x + 2, y + 2, bw - 4, 4);   // mũi gạch bắt sáng
      g.fillStyle = 'rgba(24,14,10,.34)'; g.fillRect(x + 2, y + bh - 7, bw - 4, 5); // mũi gạch trong bóng
    }
  }
  for (let k = 0; k < 26000; k++) { g.fillStyle = `rgba(40,28,20,${r() * .07})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

const plasterTex = () => (_plaster ||= canvasTex(512, 512, (g, w, h) => {
  const r = mulberry(33);
  g.fillStyle = '#cbb69c'; g.fillRect(0, 0, w, h);
  for (let x = 0; x < w; x += 96) { g.fillStyle = 'rgba(255,240,216,.16)'; g.fillRect(x, 0, 34, h); }
  for (let k = 0; k < 26; k++) {          // vệt nước mưa chảy
    const x = r() * w;
    g.fillStyle = `rgba(88,70,58,${.05 + r() * .09})`;
    g.fillRect(x, 0, 6 + r() * 22, h);
  }
  for (let k = 0; k < 22000; k++) { g.fillStyle = `rgba(70,52,38,${r() * .06})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

// vệt sơn cũ dưới chân tường (màu đổi theo giờ: lúc chiều vàng, lúc xế chiều xanh)
const wallPaintTex = (col) => (_wallPaint ||= canvasTex(256, 128, (g, w, h) => {
  const r = mulberry(44);
  g.fillStyle = col; g.fillRect(0, 0, w, h);
  for (let k = 0; k < 6000; k++) { g.fillStyle = `rgba(40,30,20,${r() * .07})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

const metalTex = () => (_metal ||= canvasTex(512, 512, (g, w, h) => {
  const r = mulberry(31);
  for (let x = 0; x < w; x += 32) {                      // sóng tôn
    const grd = g.createLinearGradient(x, 0, x + 32, 0);
    grd.addColorStop(0, '#5f4f45'); grd.addColorStop(.34, '#a89079');
    grd.addColorStop(.62, '#86725f'); grd.addColorStop(1, '#54453d');
    g.fillStyle = grd; g.fillRect(x, 0, 32, h);
  }
  for (let k = 0; k < 1100; k++) { g.fillStyle = `rgba(146,66,32,${r() * .3})`; g.fillRect(r() * w, r() * h, 3 + r() * 16, 2 + r() * 7); }
  for (let k = 0; k < 9000; k++) { g.fillStyle = `rgba(30,20,16,${r() * .07})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

const paperTex = () => (_paper ||= canvasTex(512, 512, (g, w, h) => {
  const r = mulberry(8);
  g.fillStyle = '#f2ece0'; g.fillRect(0, 0, w, h);
  for (let k = 0; k < 12000; k++) { g.fillStyle = `rgba(70,70,100,${r() * .05})`; g.fillRect(r() * w, r() * h, 3, 1); }
  g.strokeStyle = 'rgba(120,110,100,.22)'; g.lineWidth = 5;   // nếp gấp
  g.beginPath(); g.moveTo(w * .38, 0); g.lineTo(w * .62, h); g.stroke();
}));

// thân chuối: các vết lá để lại trên thân
const trunkTex = () => (_trunk ||= canvasTex(128, 512, (g, w, h) => {
  const r = mulberry(77);
  g.fillStyle = '#8d8857'; g.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 38) {
    g.fillStyle = 'rgba(52,50,28,.30)'; g.fillRect(0, y, w, 5);
    g.fillStyle = 'rgba(224,214,150,.13)'; g.fillRect(0, y + 5, w, 7);
    g.fillStyle = 'rgba(52,50,28,.12)'; g.fillRect(0, y + 12, w, 3);
  }
  for (let k = 0; k < 9000; k++) { g.fillStyle = `rgba(58,52,28,${r() * .09})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

// lá chuối: có sống giữa, gân lá
const leafTex = () => (_leaf ||= canvasTex(256, 256, (g, w, h) => {
  const r = mulberry(51);
  g.fillStyle = '#4c8a3c'; g.fillRect(0, 0, w, h);
  const grd = g.createLinearGradient(0, 0, 0, h);
  grd.addColorStop(0, 'rgba(255,240,150,.30)'); grd.addColorStop(.5, 'rgba(255,255,255,0)');
  grd.addColorStop(1, 'rgba(20,50,20,.35)');
  g.fillStyle = grd; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(24,58,24,.45)'; g.lineWidth = 4;      // sống lá
  g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  for (let x = 0; x < w; x += 18) {                          // gân lá chạy nghiêng
    g.strokeStyle = `rgba(30,64,30,${.14 + r() * .12})`; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x, h / 2); g.lineTo(x + 26, 0); g.stroke();
    g.beginPath(); g.moveTo(x, h / 2); g.lineTo(x + 26, h); g.stroke();
  }
  for (let k = 0; k < 9000; k++) { g.fillStyle = `rgba(20,44,20,${r() * .08})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

// thành phố: mặt nhà có cửa sổ; ban đêm cửa sổ sáng lên
const cityMapTex = (night) => (_cityMap ||= canvasTex(128, 256, (g, w, h) => {
  const r = mulberry(61);
  g.fillStyle = night ? '#1b1736' : '#6d5c76'; g.fillRect(0, 0, w, h);
  const cols = 5, rows = 13;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const x = i * (w / cols) + 6, y = j * (h / rows) + 4;
    const lit = night && r() < .40;
    g.fillStyle = lit ? '#ffd489' : (night ? '#2a2547' : '#211c33');
    g.fillRect(x, y, w / cols - 12, h / rows - 10);
    g.fillStyle = night ? 'rgba(255,255,255,.10)' : 'rgba(255,240,216,.20)';
    g.fillRect(x - 2, y - 2, w / cols - 8, 3);            // khung cửa sổ bắt sáng
  }
  for (let k = 0; k < 6000; k++) { g.fillStyle = `rgba(20,16,30,${r() * .12})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

const cityEmiTex = () => (_cityEmi ||= canvasTex(128, 256, (g, w, h) => {
  const r = mulberry(61);
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
  const cols = 5, rows = 13;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    if (r() >= .40) continue;
    g.fillStyle = '#ffc46a';
    g.fillRect(i * (w / cols) + 7, j * (h / rows) + 5, w / cols - 14, h / rows - 12);
  }
}));

// ── lá chuối: một dải cong, mép nhọn dần, rủ xuống theo trục đứng ───────
function bananaLeaf(len = 1.7, wid = .44, droop = .55, seed = 1) {
  const NU = 16, NV = 5, g = new THREE.PlaneGeometry(len, wid, NU, NV);
  const p = g.attributes.position;
  const rnd = mulberry(seed);
  const halfW = u => (wid * .5) * Math.sin(Math.pow(clamp(u), .70) * Math.PI * .99) * (1 - u * .20);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const u = clamp((x + len / 2) / len);
    const hw = Math.max(.004, halfW(u));
    const v = clamp(y / (wid / 2), -1, 1);
    // lá vươn ra rồi rủ xuống; mép lá cụp xuống (diện chữ V của lá chuối)
    const yy = .32 * u - droop * Math.pow(u, 2.1) - Math.abs(v) * wid * .26 * u - rnd() * .012;
    p.setXYZ(i, x, yy, v * hw);
  }
  g.computeVertexNormals();
  return g;
}

// ── điểm neo của bối cảnh ────────────────────────────────────────────────
// Một điểm thế giới vừa là Vector3 (đưa thẳng vào lookAt) vừa có chỉ số 0/1/2
// (để dùng như mảng toạ độ). Trang phim gọi camera.lookAt theo cả hai kiểu,
// nên điểm neo phải chịu được cả hai.
const P3 = (x, y, z) => { const v = new THREE.Vector3(x, y, z); v[0] = x; v[1] = y; v[2] = z; return v; };

// ── sân thượng ──────────────────────────────────────────────────────────
export function buildSanThuong(mode = 'dusk') {
  const RED = mode === 'hoang-hon';        // Mặt Trời sát chân trời, đỏ rực
  const NIGHT = mode === 'xep-chieu';       // Mặt Trời đã lặn
  const DUSK = !NIGHT;                     // còn Mặt Trời ở trên chân trời
  const scene = new THREE.Scene();

  // Bảng màu của giờ: mọi đèn trong khung lấy màu ở đây.
  const H = RED
    ? { key: '#ff6a2a', keyI: 3.1, fill: '#ff7a4a', fillI: 1.15, sky: '#9a4a5e', gnd: '#5c2632',
        fog: '#4c2136', rim: '#b07bff', rimI: .85, paper: '#ff8347', water: '#ff8f42', glass: '#ffc98a' }
    : NIGHT
      ? { key: '#8fa8e8', keyI: 1.15, fill: '#7d97e6', fillI: 1.15, sky: '#3a4a92', gnd: '#1b1734',
          fog: '#1b2148', rim: '#9a7bff', rimI: .8, paper: '#bcd2f7', water: '#6fa8e0', glass: '#cfe0ff' }
      : { key: '#ffb066', keyI: 3.2, fill: '#ff9a6a', fillI: 1.10, sky: '#8a72b4', gnd: '#5a3a30',
          fog: '#5c3644', rim: '#9a7bff', rimI: .75, paper: '#ffab63', water: '#ffa653', glass: '#ffe0b0' };

  // Mặt Trời thấp lệch sang phải.
  const az = 0.42;                      // rad, lệch sang phải so với hướng -z
  const el = RED ? 1.4 : 4.2;
  const S = V3(Math.cos(el * Math.PI / 180) * Math.sin(az), Math.sin(el * Math.PI / 180),
    -Math.cos(el * Math.PI / 180) * Math.cos(az)).normalize();

  const DUSK_STOPS = [
    [90, '#16306f'], [24, '#2f5fc0'], [9.5, '#6f9ade'], [6.0, '#a9c8ef'], [4.4, '#ffdcae'],
    [2.6, '#ff7a33'], [0, '#e0492a'], [-2.6, '#7c3348'], [-8, '#3d2440'], [-40, '#241a34'],
  ];
  const TWILIGHT_STOPS = [
    [90, '#070c28'], [30, '#0e1d55'], [12, '#16357e'], [6, '#1d4b96'], [3, '#2a6fa8'],
    [1, '#3f86b8'], [0, '#5d8194'], [-2, '#3c4a68'], [-8, '#20213f'], [-40, '#141330'],
  ];
  scene.background = skyTexture({
    stops: NIGHT ? TWILIGHT_STOPS : DUSK_STOPS,
    // 'xep-chieu' không còn Mặt Trời: không vẽ đĩa mặt trời, chỉ còn dải sáng
    // còn lại trên chân trời.
    sunDir: NIGHT ? null : S,
    // Đĩa Mặt Trời lúc hoàng hôn phải ĐỎ (không phải cam): toàn bộ đĩa một màu.
    sunCol: RED ? '#c2183a' : '#ff7a2a',
    sunCore: RED ? '#f04462' : '#fff0c0',
    sunR: RED ? 3.8 : 3.2,
    rays: NIGHT ? 0 : (RED ? 18 : 14),   // tia mặt trời
    stars: NIGHT ? 320 : 0,
  });
  scene.fog = new THREE.Fog(H.fog, 14, NIGHT ? 52 : 92);

  // ── sàn gạch: có texture và mũi gạch ──────────────────────────────────
  const floorTex = brickTex(); floorTex.repeat.set(9, 8);
  const floorDepth = ROOF_FRONT - RAIL_Z;
  scene.add(mesh(new THREE.PlaneGeometry(19, floorDepth),
    toon('#ffffff', { map: floorTex }), [0, 0, (ROOF_FRONT + RAIL_Z) / 2 + .13],
    { rot: [-Math.PI / 2, 0, 0], cast: false }));

  // ── lan can sắt: nan, tay vịn, bệ chân ────────────────────────────────
  const iron = toon('#3b3f5e');
  const ironLit = toon('#57506e');
  scene.add(mesh(rbox(RAIL_W, .34, .26, .03), toon('#6a5a52', { map: TEX.wall() }), [0, .17, RAIL_Z]));  // bệ chân
  scene.add(mesh(rbox(RAIL_W, .14, .16, .03), toon('#6b5a52'), [0, 1.16, RAIL_Z]));                     // tay vịn
  scene.add(mesh(new THREE.CylinderGeometry(.045, .045, RAIL_W, 12), ironLit, [0, 1.06, RAIL_Z], { rot: [0, 0, Math.PI / 2] }));
  scene.add(mesh(new THREE.CylinderGeometry(.028, .028, RAIL_W, 10), iron, [0, .55, RAIL_Z], { rot: [0, 0, Math.PI / 2] }));
  for (let x = -RAIL_W / 2; x <= RAIL_W / 2 + .01; x += .38) {
    scene.add(mesh(new THREE.CylinderGeometry(.018, .018, .95, 8), iron, [x, .60, RAIL_Z]));
  }
  for (const x of [-RAIL_W / 2, 0, RAIL_W / 2]) {
    scene.add(mesh(new THREE.CylinderGeometry(.05, .05, 1.16, 12), ironLit, [x, .58, RAIL_Z]));
    scene.add(mesh(new THREE.SphereGeometry(.055, 10, 8), ironLit, [x, 1.18, RAIL_Z]));
  }

  // ── nhà thang (góc trái): tường có vết, cửa, cửa sổ, mái tôn sóng ─────
  const house = new THREE.Group(); house.position.set(...HOUSE);
  const HW = 2.45, HH = 2.85, HD = 2.20;
  const wallMat = toon('#ffffff', { map: plasterTex() });
  const paintMat = toon('#ffffff', { map: wallPaintTex(RED ? '#a8563c' : NIGHT ? '#3d4a72' : '#c08a4e') });
  // tường: bốn mảng quanh một lỗ cửa sổ, để ánh sáng lọt ra được
  const WIN = { x: .55, y: 1.62, w: .92, h: .78 };
  const fz = HD / 2;                       // mặt trước (+z)
  const wallPiece = (x0, x1, y0, y1) => house.add(mesh(
    rbox(x1 - x0, y1 - y0, .14, .02), wallMat, [(x0 + x1) / 2, (y0 + y1) / 2, fz]));
  wallPiece(-HW / 2, WIN.x - WIN.w / 2, 0, HH);
  wallPiece(WIN.x + WIN.w / 2, HW / 2, 0, HH);
  wallPiece(WIN.x - WIN.w / 2, WIN.x + WIN.w / 2, 0, WIN.y - WIN.h / 2);
  wallPiece(WIN.x - WIN.w / 2, WIN.x + WIN.w / 2, WIN.y + WIN.h / 2, HH);
  house.add(mesh(rbox(HW, .55, .14, .02), paintMat, [0, .28, fz]));                    // vệt sơn chân tường
  house.add(mesh(rbox(HW, HH, .14, .02), wallMat, [0, HH / 2, -fz]));                 // tường sau
  house.add(mesh(rbox(.14, HH, HD, .02), wallMat, [-HW / 2, HH / 2, 0]));              // tường trái
  house.add(mesh(rbox(.14, HH, HD, .02), wallMat, [HW / 2, HH / 2, 0]));               // tường phải
  house.add(mesh(rbox(HW, .12, HD, .02), toon('#3a3048'), [0, .06, 0]));              // sàn nhà
  house.add(mesh(rbox(HW - .2, HH - .2, HD - .2, .02), toon('#241f33'), [0, HH / 2, 0])); // trong nhà tối
  // khung cửa sổ + kính
  const glass = toon(H.glass, { emissive: new THREE.Color(H.glass).multiplyScalar(RED ? .9 : NIGHT ? .55 : .7), transparent: true, opacity: .82 });
  house.add(mesh(rbox(WIN.w + .14, .07, .12, .01), toon('#5b4a42'), [WIN.x, WIN.y + WIN.h / 2 + .04, fz]));
  house.add(mesh(rbox(WIN.w + .14, .07, .12, .01), toon('#5b4a42'), [WIN.x, WIN.y - WIN.h / 2 - .04, fz]));
  house.add(mesh(rbox(.07, WIN.h + .14, .12, .01), toon('#5b4a42'), [WIN.x - WIN.w / 2 - .04, WIN.y, fz]));
  house.add(mesh(rbox(.07, WIN.h + .14, .12, .01), toon('#5b4a42'), [WIN.x + WIN.w / 2 + .04, WIN.y, fz]));
  house.add(mesh(rbox(WIN.w, WIN.h, .03, .01), glass, [WIN.x, WIN.y, fz - .02], { cast: false }));
  house.add(mesh(rbox(WIN.w + .30, .09, .26, .02), toon('#6b5a52'), [WIN.x, WIN.y - WIN.h / 2 - .09, fz + .04])); // bệ cửa sổ
  // cửa cổng ở mặt phải (mặt có nắng chiều)
  const doorMat = toon('#8a4f3c', { map: TEX.wood() });
  house.add(mesh(rbox(.10, 1.72, .84, .02), doorMat, [HW / 2 + .02, .86, .12]));
  house.add(mesh(new THREE.SphereGeometry(.055, 10, 8), toon(PAL.mustard), [HW / 2 + .10, .88, -.22]));
  house.add(mesh(rbox(.12, .10, 1.02, .02), toon('#5b4a42'), [HW / 2 + .03, 1.78, .12]));
  // mái tôn sóng, nghiêng nhẹ
  const roofMat = toon('#ffffff', { map: metalTex() });
  roofMat.map.repeat.set(4, 2);
  const roof = mesh(rbox(HW + .42, .09, HD + .34, .02), roofMat, [0, HH + .16, 0]);
  roof.rotation.x = -.07; house.add(roof);
  house.add(mesh(rbox(HW + .46, .10, .07, .02), toon('#4d3f38'), [0, HH + .10, (HD + .34) / 2]));
  house.add(mesh(rbox(HW + .46, .10, .07, .02), toon('#4d3f38'), [0, HH + .10, -(HD + .34) / 2]));
  // ống nước chạy xuống góc nhà
  house.add(mesh(new THREE.CylinderGeometry(.045, .045, HH - .2, 10), toon('#6b5a52'), [-HW / 2 - .09, (HH - .2) / 2, -.6]));
  scene.add(house);

  // ── thùng nước: chân đế, thân, vành miệng, nắp mở, thang leo, mặt nước ─
  const tank = new THREE.Group(); tank.position.set(...TANK);
  const plastic = toon('#a9a5a0');                       // nhựa xám trung tính: màu đến từ ánh sáng
  const plasticDark = toon('#6f7a88');
  const STEEL = TANK_STAND, BODY_R = TANK_R, BODY_H = TANK_BODY;
  for (const [dx, dz] of [[-.40, -.40], [.40, -.40], [-.40, .40], [.40, .40]]) {
    tank.add(mesh(new THREE.CylinderGeometry(.045, .045, STEEL, 10), toon('#4a5568'), [dx, STEEL / 2, dz]));
  }
  for (const dz of [-.40, .40]) tank.add(mesh(rbox(.90, .05, .05, .01), toon('#3f4a5c'), [0, .14, dz]));
  for (const dx of [-.40, .40]) tank.add(mesh(rbox(.05, .05, .90, .01), toon('#3f4a5c'), [dx, .14, 0]));
  // thân thùng: không có nắp trên (miệng mở), đáy thùng là một đĩa riêng
  tank.add(mesh(new THREE.CylinderGeometry(BODY_R, BODY_R * .97, BODY_H, 30, 1, true), plastic, [0, STEEL + BODY_H / 2, 0]));
  tank.add(mesh(new THREE.CircleGeometry(BODY_R * .97, 30), plasticDark, [0, STEEL, 0], { rot: [Math.PI / 2, 0, 0], cast: false }));
  tank.add(mesh(new THREE.TorusGeometry(BODY_R + .005, .03, 8, 30), plasticDark, [0, STEEL + BODY_H * .30, 0], { rot: [Math.PI / 2, 0, 0] }));
  tank.add(mesh(new THREE.TorusGeometry(BODY_R + .01, .045, 8, 30), plasticDark, [0, STEEL + BODY_H - .02, 0], { rot: [Math.PI / 2, 0, 0] }));
  // miệng thùng: thành trong (tối) + mặt nước
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(BODY_R - .05, BODY_R - .05, BODY_H - .05, 30, 1, true),
    toon('#3c4450', { side: THREE.BackSide }));
  inner.position.set(0, STEEL + BODY_H / 2, 0); tank.add(inner);
  // Mặt nước ban đêm phải là MẢNH TỐI có lấp lánh nhẹ, không phải một vùng
  // sáng trắng: cảnh cận chân trời (c35/c37) là bầu trời, nên trời phải là
  // chỗ sáng nhất, không phải mặt nước.
  const water = mesh(new THREE.CircleGeometry(BODY_R - .055, 34),
    toon(NIGHT ? '#3f6a9e' : H.water, { emissive: new THREE.Color(H.water).multiplyScalar(RED ? .85 : NIGHT ? .18 : .70) }),
    [0, STEEL + BODY_H - .04, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  tank.add(water);
  // vệt nắng hắt trên mặt nước (Mặt Trời thấp phản chiếu thành một vệt sáng).
  // Ban đêm vệt này phải nhạt và lạnh: nó hứa lấy màu trời chứ không tự sáng.
  const glint = mesh(new THREE.PlaneGeometry(.60, .16),
    toon(NIGHT ? '#b9cdf0' : '#fff0d0',
      { emissive: new THREE.Color(NIGHT ? '#7d9ed8' : '#ffcf8a').multiplyScalar(NIGHT ? .30 : RED ? 1.8 : 1.4),
        transparent: true, opacity: NIGHT ? .45 : .92 }),
    [0, STEEL + BODY_H - .025, -.10], { rot: [-Math.PI / 2, 0, 0], cast: false });
  tank.add(glint);
  // nắp: đã tháo ra, đặt nằm sát đất cạnh thùng → miệng thùng mở, thấy mặt nước
  const lid = new THREE.Group();
  lid.position.set(-(BODY_R + .44), .035, .40);
  lid.rotation.set(Math.PI / 2, 0, .38);
  lid.add(mesh(new THREE.CylinderGeometry(BODY_R + .03, BODY_R + .03, .06, 30), toon('#8e99a6'), [0, .03, 0]));
  lid.add(mesh(new THREE.TorusGeometry(BODY_R + .03, .026, 8, 30), toon('#6f7a88'), [0, .005, 0], { rot: [Math.PI / 2, 0, 0] }));
  lid.add(mesh(new THREE.CylinderGeometry(.055, .055, .07, 10), toon('#6f7a88'), [0, .075, 0]));
  scene.add(lid);
  tank.add(mesh(rbox(.10, .10, .16, .02), toon('#4a5568'), [0, STEEL + BODY_H + .01, -BODY_R]));   // bản lề
  // thang leo bám vào thân thùng
  const lad = new THREE.Group(); lad.position.set(BODY_R + .15, 0, .18); lad.rotation.z = -.10;
  for (const dz of [-.16, .16]) lad.add(mesh(new THREE.CylinderGeometry(.028, .028, STEEL + BODY_H + .16, 8), toon('#5e6875'), [0, (STEEL + BODY_H + .16) / 2, dz]));
  for (let i = 0; i < 5; i++) lad.add(mesh(new THREE.CylinderGeometry(.022, .022, .34, 8), toon('#6f7a88'), [0, .20 + i * .21, 0], { rot: [Math.PI / 2, 0, 0] }));
  tank.add(lad);
  // vòi lấy nước
  tank.add(mesh(new THREE.CylinderGeometry(.035, .035, .28, 8), toon('#5e6875'), [.16, .20, BODY_R + .04], { rot: [Math.PI / 2, 0, 0] }));
  tank.add(mesh(new THREE.CylinderGeometry(.022, .022, .13, 8), toon('#5e6875'), [.16, .13, BODY_R + .16]));
  tank.add(mesh(new THREE.TorusGeometry(.055, .015, 6, 14), toon(PAL.red), [.16, .26, BODY_R + .11], { rot: [Math.PI / 2, 0, 0] }));
  scene.add(tank);

  // ── cây chuối: thân có vết lá, lá cong, lá chín, chùm chuối ───────────
  const tree = new THREE.Group(); tree.position.set(...TREE);
  const TRUNK_H = 2.35;
  const trunk = new THREE.CylinderGeometry(.11, .17, TRUNK_H, 12);
  const tp = trunk.attributes.position;
  for (let i = 0; i < tp.count; i++) { const y = tp.getY(i); tp.setX(i, tp.getX(i) + (1 - (y + TRUNK_H / 2) / TRUNK_H) * .26); }
  trunk.computeVertexNormals();
  tree.add(mesh(trunk, toon('#ffffff', { map: trunkTex() }), [0, TRUNK_H / 2, 0]));
  const leafMat = toon('#ffffff', { map: leafTex() });
  leafMat.side = THREE.DoubleSide;
  const TOP = TRUNK_H - .03;
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2 + .35;
    const len = 1.18 + (i % 3) * .16;
    const dir = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const base = new THREE.Vector3(.22, TOP, 0);
    const lg = bananaLeaf(len, .78, .40 + (i % 2) * .22, 100 + i);
    tree.add(mesh(lg, leafMat, base.clone().addScaledVector(dir, len / 2).toArray(), { rot: [0, -a, 0] }));
    // cuống lá nối vào thân
    tree.add(mesh(new THREE.CylinderGeometry(.022, .03, .30, 6), toon('#6f8a45'),
      base.clone().addScaledVector(dir, .14).toArray(), { rot: [0, 0, Math.PI / 2] }));
  }
  // lá chín: hai lá già, vàng ốt
  for (let i = 0; i < 2; i++) {
    const a = -1.1 - i * 1.9, len = 1.05;
    const dir = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const base = new THREE.Vector3(.18, TOP - .16, 0);
    const ripe = toon('#cfa63f', { map: leafTex(), side: THREE.DoubleSide });
    tree.add(mesh(bananaLeaf(len, .62, .66, 300 + i), ripe,
      base.clone().addScaledVector(dir, len / 2).toArray(), { rot: [0, -a, 0] }));
  }
  // chùm chuối: một cuộng, hai hàng quả
  const bunch = new THREE.Group(); bunch.position.set(.32, TOP - .16, .12);
  bunch.add(mesh(new THREE.CylinderGeometry(.035, .035, .30, 8), toon('#7a7a3e'), [0, -.16, 0], { rot: [.35, 0, 0] }));
  for (let i = 0; i < 6; i++) {
    const row = i > 2 ? 1 : 0, k = i % 3;
    const b = mesh(new THREE.CylinderGeometry(.072, .046, .34, 8), toon(i % 2 ? '#e6c651' : '#d2ae3c'),
      [row ? .075 : -.075, -.44 - k * .05 - row * .05, row ? .06 : -.04]);
    b.rotation.z = row ? .13 : -.13; b.rotation.x = .18 + k * .04; bunch.add(b);
  }
  tree.add(bunch);
  scene.add(tree);

  // ── tờ giấy vắt trên nan lan can ──────────────────────────────────────
  // Tờ giấy KHÔNG lơ lửng trên không: nó được vắt qua thanh tay vịn — một
  // đoạn nằm trên mặt trên của thanh, một đuôi rủ xuống phía trước (chỗ
  // máy nhìn thấy), một đuôi thú ra sau. Nhờ vậy nó chạm vào lan can và bóng
  // của nó đổ lên thanh.
  const paperMat = toon(H.paper, { map: paperTex(), side: THREE.DoubleSide });
  const PW = .42;                                  // bề ngang tờ giấy
  // đường đi của mặt giấy trong mặt phẳng (z, y), tính từ RAIL_Z
  const drape = [
    [+0.100, 0.775],   // mép dưới, phía trước
    [+0.110, 0.980],
    [+0.098, 1.150],
    [+0.080, 1.226],   // bắt đầu nếp gấp, nằm trên mặt trên của thanh vịn
    [+0.020, 1.246],
    [-0.055, 1.238],
    [-0.090, 1.190],
    [-0.112, 1.055],   // đuôi sau
  ];
  const drapeCurve = new THREE.CatmullRomCurve3(
    drape.map(p => V3(0, p[1], RAIL_Z + p[0])), false, 'catmullrom', .4);
  const NP = 44, NX = 8;
  const gPos = [], gUv = [], gIdx = [];
  for (let i = 0; i <= NP; i++) {
    const t = i / NP;
    const p = drapeCurve.getPoint(t);
    const tg = drapeCurve.getTangent(t);
    // pháp tuyến của mặt giấy trong mặt phẳng (z, y)
    const nz = tg.y, ny = -tg.z;
    for (let j = 0; j <= NX; j++) {
      const u = j / NX;
      const x = (u - .5) * PW;
      // mép giấy hơi gợn, và sóng nhẹ dọc theo tờ giấy
      const wob = Math.sin(t * 6.7 + u * 2.6) * .007 + Math.sin(u * Math.PI) * .010;
      gPos.push(PAPER_X + x, p.y + ny * wob, p.z + nz * wob);
      gUv.push(u, t);
    }
  }
  for (let i = 0; i < NP; i++) {
    for (let j = 0; j < NX; j++) {
      const a = i * (NX + 1) + j, b = a + 1, c = a + NX + 1, d = c + 1;
      // Chiều quấn: mặt trước của tờ giấy quay về phía máy (+z). Nếu quấn ngược,
      // pass chiều sâu của rig cắt mặt sau → đường viền mực của lan can và thùng
      // nước lọt qua tờ giấy.
      gIdx.push(a, b, c, b, d, c);
    }
  }
  const paperGeo = new THREE.BufferGeometry();
  paperGeo.setAttribute('position', new THREE.Float32BufferAttribute(gPos, 3));
  paperGeo.setAttribute('uv', new THREE.Float32BufferAttribute(gUv, 2));
  paperGeo.setIndex(gIdx);
  paperGeo.computeVertexNormals();
  const paper = new THREE.Mesh(paperGeo, paperMat);
  paper.castShadow = true; paper.receiveShadow = true;
  scene.add(paper);

  // ── thành phố xa: ba vòng, mái, ăng-ten, thùng nước trên mái, cửa sổ sáng ─
  // Ta đứng trên cao: chân trời thành phố nằm thấp hơn, nhiều tầng.
  const GROUND = -18;
  const cityMat = toon('#ffffff', { map: cityMapTex(NIGHT) });
  const roofMat2 = toon(NIGHT ? '#241d3c' : '#3d2f48');
  const cityFar = toon(NIGHT ? '#3a3358' : '#8a7a94', { map: cityMapTex(NIGHT) });
  if (NIGHT) { cityMat.emissive = new THREE.Color('#ffb257'); cityMat.emissiveMap = cityEmiTex(); cityMat.emissiveIntensity = .9; }
  // Hoàng hôn: mặt nhà quay về phía Mặt Trời là mặt tối, phải có cửa sổ sáng
  // thì nhà mới đọc ra là nhà chứ không phải một khối phẳng.
  else if (RED) {
    cityMat.emissive = new THREE.Color('#ff9a52'); cityMat.emissiveMap = cityEmiTex(); cityMat.emissiveIntensity = .55;
    cityFar.emissive = new THREE.Color('#ff8c46'); cityFar.emissiveMap = cityEmiTex(); cityFar.emissiveIntensity = .30;
  }
  const rnd = mulberry(7);
  // Mặt Trời nằm theo hướng (sin az, −cos az) nhưng nhà lại đặt theo
  // (sin a, cos a) → phía chắn Mặt Trời là a = π − az, không phải a = az.
  const SUN_A = Math.PI - az;
  const nearSun = a => Math.abs(((a - SUN_A + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < .70;
  // Nhà ở hướng Mặt Trời phải thấp: đỉnh nó nằm dưới đĩa Mặt Trời, không cắt đĩa.
  const SUNSIDE_TOP = -3.0;
  const building = (a, r, h, w, d, mat, roof, ant) => {
    const top = GROUND + h;
    const x = Math.sin(a) * r, z = Math.cos(a) * r;
    scene.add(mesh(new THREE.BoxGeometry(w, h, d), mat, [x, GROUND + h / 2, z], { cast: false }));
    scene.add(mesh(rbox(w + .22, .20, d + .22, .04), roof, [x, top + .10, z], { cast: false }));
    if (ant) {
      scene.add(mesh(new THREE.CylinderGeometry(.035, .035, h * .22 + .8, 6), roof, [x, top + .20 + (h * .22 + .8) / 2, z], { cast: false }));
      scene.add(mesh(rbox(.62, .05, .05, .01), roof, [x, top + .20 + h * .22 + .7, z], { cast: false }));
    }
  };
  for (let i = 0; i < 46; i++) {          // vòng xa: xa và cao, thành nhiều tầng
    const a = rnd() * Math.PI * 2, r = 34 + rnd() * 24;
    const low = nearSun(a);
    let h = 14 + rnd() * 11;
    if (low) h = SUNSIDE_TOP - GROUND + (rnd() - .5) * .7;
    building(a, r, h, 3 + rnd() * 4, 3 + rnd() * 4, cityFar, roofMat2, false);
  }
  for (let i = 0; i < 34; i++) {          // vòng giữa: ngay trên chân trời
    const a = rnd() * Math.PI * 2, r = 21 + rnd() * 12;
    const low = nearSun(a);
    let h = 12 + rnd() * 9;
    if (low) h = SUNSIDE_TOP - GROUND + (rnd() - .5) * .7;
    building(a, r, h, 2.4 + rnd() * 3.4, 2.4 + rnd() * 3.4, cityMat, roofMat2, low ? false : rnd() < .45);
  }
  for (let i = 0; i < 24; i++) {          // vòng gần: thấp hơn ta, ta nhìn xuống nó
    const a = rnd() * Math.PI * 2, r = 15 + rnd() * 8;
    const low = nearSun(a);
    let h = 11 + rnd() * 6;
    if (low) h = SUNSIDE_TOP - GROUND + (rnd() - .5) * .7;
    const w = 2 + rnd() * 2.8, d = 2 + rnd() * 2.8;
    const top = GROUND + h;
    const x = Math.sin(a) * r, z = Math.cos(a) * r;
    scene.add(mesh(new THREE.BoxGeometry(w, h, d), cityMat, [x, GROUND + h / 2, z], { cast: false }));
    scene.add(mesh(rbox(w + .22, .20, d + .22, .04), roofMat2, [x, top + .10, z], { cast: false }));
    if (low) continue;                   // phía Mặt Trời: không có tháp, không có ăng-ten
    if (rnd() < .45) {                                  // tháp nhỏ trên mái
      const tw = w * .34, th = 1.6 + rnd() * 2.4;
      scene.add(mesh(new THREE.BoxGeometry(tw, th, tw), cityMat, [x, top + .20 + th / 2, z], { cast: false }));
      scene.add(mesh(rbox(tw + .16, .16, tw + .16, .03), roofMat2, [x, top + .20 + th + .08, z], { cast: false }));
    } else if (rnd() < .5) {                             // thùng nước trên mái
      scene.add(mesh(new THREE.CylinderGeometry(.42, .42, .9, 12), toon(NIGHT ? '#2a2348' : '#6a5570'),
        [x + w * .2, top + .65, z], { cast: false }));
    }
    if (rnd() < .55) {
      scene.add(mesh(new THREE.CylinderGeometry(.035, .035, h * .22 + .8, 6), roofMat2,
        [x, top + .20 + (h * .22 + .8) / 2, z], { cast: false }));
      scene.add(mesh(rbox(.62, .05, .05, .01), roofMat2, [x, top + .20 + h * .22 + .7, z], { cast: false }));
    }
  }

  // ── ánh sáng ───────────────────────────────────────────────────────────
  // Đèn chính: Mặt Trời thấp hắt qua nan lan can → sàn có vệt nắng có hình.
  const keyEl = (RED ? 17 : 20) * Math.PI / 180;
  const K = V3(Math.cos(keyEl) * Math.sin(az), Math.sin(keyEl), -Math.cos(keyEl) * Math.cos(az)).normalize();
  const key = keyLight(scene, {
    color: H.key, intensity: H.keyI,
    from: V3(K.x * 32, K.y * 32 + .8, K.z * 32), to: V3(0, .8, 0), size: 17, far: 100,
  });
  // Trời lấp đầy từ phía máy: màu của nó quyết định mặt nào của vật ta thấy.
  const fill = new THREE.DirectionalLight(H.fill, H.fillI);
  fill.position.set(4, 3.0, 12); scene.add(fill);
  ambience(scene, {
    sky: H.sky, ground: H.gnd, fill: .42, rim: H.rim, rimI: H.rimI, rimFrom: [-6, 5, -7],
  });
  // Cửa sổ nhà thang: một vệt ấm hắt ra tường (vệt sáng có hình cửa).
  const winLight = pool(scene, {
    from: V3(HOUSE[0] + WIN.x, WIN.y, HOUSE[2] + HD / 2 + .18),
    to: V3(HOUSE[0] + WIN.x + .35, .35, HOUSE[2] + HD / 2 + .02),
    color: H.key, intensity: RED ? 9 : 7, angle: .85, penumbra: .6,
  });

  return {
    scene, key, paper, tank, water, tree, lid, house, glint, winLight,
    paperAt: P3(PAPER_X, PAPER_Y, PAPER_Z),
    tankAt: P3(TANK[0], STEEL + BODY_H - .04, TANK[2]),
    wallAt: P3(HOUSE[0], 1.35, HOUSE[2] + HD / 2),
    sunAt: S.clone().multiplyScalar(60),
    update(t) { water.rotation.z = t * .12; glint.scale.x = 1 + Math.sin(t * .8) * .06; },
  };
}
