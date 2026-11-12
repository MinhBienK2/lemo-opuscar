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
import { toon, canvasTex, rbox, mesh, mulberry } from '../../../../rig/kit.js';
import { keyLight, ambience, pool } from '../../../../rig/lights.js';
import { V3, skyTexture } from './props/_common.js';
import { lanCanSat } from './props/lan-can-sat.js';
import { nhaThang, HOUSE_WIN, HOUSE_D } from './props/nha-thang.js';
import { thungNuoc, TANK_STAND, TANK_BODY } from './props/thung-nuoc.js';
import { cayChuoi } from './props/cay-chuoi.js';
import { toGiayTrang } from './props/to-giay-trang.js';

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

// ── chất liệu vẽ tay (có seed, dùng lại cho cả ba giờ) ────────────────────
let _brick, _cityMap, _cityEmi;

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
  const rail = lanCanSat({ width: RAIL_W });
  rail.position.set(0, 0, RAIL_Z);
  scene.add(rail);

  // ── nhà thang (góc trái): tường có vết, cửa, cửa sổ, mái tôn sóng ─────
  const house = nhaThang({
    paint: RED ? '#a8563c' : NIGHT ? '#3d4a72' : '#c08a4e',
    glass: H.glass,
    glassK: RED ? .9 : NIGHT ? .55 : .7,
  });
  house.position.set(...HOUSE);
  scene.add(house);

  // ── thùng nước: chân đế, thân, vành miệng, nắp mở, thang leo, mặt nước ─
  const tankP = thungNuoc({ water: H.water, night: NIGHT, red: RED });
  const tank = tankP.group;
  const { water, glint } = tankP;
  const lid = tankP.lid;
  // nắp: đã tháo ra, đặt nằm sát đất cạnh thùng → miệng thùng mở, thấy mặt nước
  scene.add(lid);
  tank.position.set(...TANK);
  scene.add(tank);

  // ── cây chuối: thân có vết lá, lá cong, lá chín, chùm chuối ───────────
  const tree = cayChuoi();
  tree.position.set(...TREE);
  scene.add(tree);

  // ── tờ giấy vắt trên nan lan can ──────────────────────────────────────
  // Tờ giấy KHÔNG lơ lửng trên không: nó được vắt qua thanh tay vịn — một
  // đoạn nằm trên mặt trên của thanh, một đuôi rủ xuống phía trước (chỗ
  // máy nhìn thấy), một đuôi thú ra sau. Nhờ vậy nó chạm vào lan can và bóng
  // của nó đổ lên thanh.
  const paper = toGiayTrang({ color: H.paper });
  paper.position.set(PAPER_X, 0, RAIL_Z);
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
    from: V3(HOUSE[0] + HOUSE_WIN.x, HOUSE_WIN.y, HOUSE[2] + HOUSE_D / 2 + .18),
    to: V3(HOUSE[0] + HOUSE_WIN.x + .35, .35, HOUSE[2] + HOUSE_D / 2 + .02),
    color: H.key, intensity: RED ? 9 : 7, angle: .85, penumbra: .6,
  });

  return {
    scene, key, paper, tank, water, tree, lid, house, glint, winLight,
    paperAt: P3(PAPER_X, PAPER_Y, PAPER_Z),
    tankAt: P3(TANK[0], TANK_STAND + TANK_BODY - .04, TANK[2]),
    wallAt: P3(HOUSE[0], 1.35, HOUSE[2] + HOUSE_D / 2),
    sunAt: S.clone().multiplyScalar(60),
    update(t) { water.rotation.z = t * .12; glint.scale.x = 1 + Math.sin(t * .8) * .06; },
  };
}
