// Ba nơi chốn của tập:
//   N1 · Phòng ngủ buổi chiều — nắng xiên qua cửa sổ, giường, bàn đầu giường.
//   N2 · Khối mô não trên bàn tối — không gian của não, một vệt sáng ấm trên mô.
//   N3 · Khe giữa hai tế bào — củ tế bào thần kinh đối diện hàng thụ thể.
import * as THREE from 'three';
import { PAL, toon, glowMat, canvasTex, TEX, rbox, mesh, fxLayer, mulberry, clamp, lerp, ss, seg, keys, surface } from '../../../../rig/kit.js';
import { keyLight, ambience, wallWithHole, beam, pool } from '../../../../rig/lights.js';
import { brainSpace } from '../../../../rig/brain.js';
import { cayGocPhong } from './props/cay-goc-phong.js';
import { buildHand, glowDots, setDot } from '../../../../rig/fx.js';
import { giuongBuoiTrua } from './props/giuong-buoi-trua.js';
import { dongHoBaoThuc } from './props/dong-ho-bao-thuc.js';
import { mayGhiGiacNgu } from './props/may-ghi-giac-ngu.js';
import { bangDoPhanXa } from './props/bang-do-phan-xa.js';
import { tachCaPhe } from './props/tach-ca-phe.js';
import { dongHo24Gio } from './props/dong-ho-24-gio.js';
import { khoiMoNao } from './props/khoi-mo-nao.js';
import { teBaoThanKinh } from './props/te-bao-than-kinh.js';
import { bauTauTien } from './props/bau-tau-tien.js';
import { mangTeBao } from './props/mang-te-bao.js';
import { hangThuThe } from './props/hang-thu-the.js';
import { damPhanTuAdenosine, phamTuAdenosine, ADENO_SCALE } from './props/pham-tu-adenosine.js';
import { phanTuCaffeine, CAFE_SCALE } from './props/phan-tu-caffeine.js';
import { diaRong } from './props/dia-rong.js';

// ── N1 · phòng ngủ buổi chiều ────────────────────────────────────────────
export function buildPhongNgu() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#2a2036');
  scene.fog = new THREE.Fog('#3a2c46', 7, 17);

  const WIN = { x0: 0.55, x1: 2.15, y0: 0.95, y1: 2.30 };
  // sàn ván
  const floorTex = TEX.wood(); floorTex.repeat.set(4, 4);
  scene.add(mesh(new THREE.PlaneGeometry(16, 16), toon('#ffffff', { map: floorTex }), [0, 0, 3], { rot: [-Math.PI / 2, 0, 0], cast: false }));
  // tường có lỗ cửa sổ
  const wallMat = toon('#ffffff', { map: (() => { const t = canvasTex(512, 512, (c, w, h) => { c.fillStyle = '#b9a893'; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 86) for (let x = 0; x < w; x += 86) { c.fillStyle = 'rgba(255,240,216,.10)'; c.fillRect(x + 4, y + 4, 78, 78); c.strokeStyle = 'rgba(90,75,60,.22)'; c.lineWidth = 2; c.strokeRect(x + 4, y + 4, 78, 78); } }); return t; })() });
  wallMat.map.repeat.set(6, 3);
  wallWithHole(scene, wallMat, { ...WIN, left: -9, right: 9, top: 4.4 });

  // khung cửa sổ, trời chiều, mặt trời thấp
  const fr = toon('#efe2c8');
  const cx = (WIN.x0 + WIN.x1) / 2, cy = (WIN.y0 + WIN.y1) / 2, ww = WIN.x1 - WIN.x0, wh = WIN.y1 - WIN.y0;
  scene.add(mesh(rbox(ww + .12, .09, .22, .02), fr, [cx, WIN.y1 + .03, -.03]));
  scene.add(mesh(rbox(ww + .12, .09, .22, .02), fr, [cx, WIN.y0 - .03, -.03]));
  scene.add(mesh(rbox(.09, wh + .12, .22, .02), fr, [WIN.x0 - .03, cy, -.03]));
  scene.add(mesh(rbox(.09, wh + .12, .22, .02), fr, [WIN.x1 + .03, cy, -.03]));
  scene.add(mesh(rbox(.05, wh, .10, .015), fr, [cx, cy, -.03]));
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), new THREE.ShaderMaterial({
    uniforms: { uA: { value: new THREE.Color('#ffb46a') }, uB: { value: new THREE.Color('#7a5aa8') } }, fog: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec2 vUv; uniform vec3 uA, uB;
      void main(){ gl_FragColor = vec4(mix(uA, uB, smoothstep(.15,.85,vUv.y)), 1.); }`,
  }));
  sky.position.set(cx - .6, 2.2, -2.6); scene.add(sky);
  const sun = mesh(new THREE.CircleGeometry(.22, 32), glowMat('#ffd9a0', .85), [cx - 1.0, WIN.y0 + .38, -2.4], { cast: false });
  fxLayer(sun); scene.add(sun);
  // ngoài cửa sổ: gò cây và mây — không có chúng thì cửa sổ chỉ là một mảng
  // cam trơn, không đọc ra là cửa sổ nhìn ra ngoài trời
  for (const [tx, ty, ts] of [[cx - .95, 1.30, .58], [cx - .30, 1.15, .44], [cx + .45, 1.00, .50]]) {
    scene.add(mesh(new THREE.SphereGeometry(ts, 16, 11), toon('#3f6b57'), [tx, ty, -2.30], { cast: false }));
    scene.add(mesh(new THREE.CylinderGeometry(.06, .08, .55, 8), toon('#5a4030'), [tx, ty - ts - .20, -2.30], { cast: false }));
  }
  for (const [mx, my, ms] of [[cx + .55, 2.52, .30], [cx - .70, 2.66, .23]]) {
    const cl = mesh(new THREE.SphereGeometry(ms, 14, 10), toon('#ffe6c4'), [mx, my, -2.45], { cast: false });
    cl.scale.set(1.9, .55, .3);
    scene.add(cl);
    // lớp dưới tối hơn: mây là một khối có bóng, không phải một miếng bánh dẹt
    // dán trên trời. Không có lớp này mây đọc ra là mảng sơn.
    const cl2 = mesh(new THREE.SphereGeometry(ms, 14, 10), toon('#e7b78e'), [mx, my - ms * .30, -2.44], { cast: false });
    cl2.scale.set(1.75, .42, .28);
    scene.add(cl2);
  }

  // Tranh treo tường: khoảng tường giữa đầu giường và đồng hồ trống trơn,
  // nhát mở đầu nhìn vào là một mảng tím lớn không có gì. Một khung tranh
  // nhỏ treo ở độ cao ngang vai người nằm làm khoảng trống có chủ đề.
  const tranh = new THREE.Group(); tranh.position.set(-1.62, 1.74, .03); scene.add(tranh);
  tranh.add(mesh(rbox(.56, .42, .05, .012), toon('#7a4526'), [0, 0, 0]));
  tranh.add(mesh(new THREE.PlaneGeometry(.46, .32), toon('#ffffff', { map: canvasTex(256, 180, (c, w, h) => {
    c.fillStyle = '#f0dcb4'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#e8b06a'; c.beginPath(); c.arc(w * .68, h * .34, 22, 0, 7); c.fill();
    c.fillStyle = '#7d9a7a'; c.beginPath(); c.moveTo(0, h); c.lineTo(w * .34, h * .52); c.lineTo(w * .66, h); c.fill();
    c.fillStyle = '#5d7a68'; c.beginPath(); c.moveTo(w * .34, h); c.lineTo(w * .72, h * .38); c.lineTo(w, h); c.fill();
  }) }), [0, 0, .032]));
  tranh.add(mesh(rbox(.50, .36, .012, .004), toon('#efe2c8'), [0, 0, .021]));

  // rèm buổi chiều: một mảnh vải héo bên phải cửa sổ
  const curtainTex = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#e6d3b6'; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(154,91,229,.22)';
    for (let x = 0; x < w; x += 32) c.fillRect(x, 0, 12, h);
  });
  const curtain = mesh(surface(10, 14, (u, v) => [(u - .5) * .58, WIN.y1 + .06 - v * (WIN.y1 - WIN.y0 + .5), .10 + Math.sin(u * 7) * .04]),
    toon('#ffffff', { map: curtainTex, side: THREE.DoubleSide }), [WIN.x1 + .12, 0, 0]);
  scene.add(curtain);

  // ── ánh sáng: nắng chiều xiên qua lỗ cửa sổ ──
  const focus = new THREE.Vector3(0.05, 0.60, 0.85);
  // Đèn chính: nắng chiều đi qua đúng lỗ cửa sổ rồi đổ xuống giường, nên
  // vệt sáng phải rơi lên gối và chăn chứ không đứng ở góc sàn.
  // Đèn chính: nắng chiều đi qua đúng lỗ cửa sổ rồi đổ xuống gối và chăn.
  // Điểm 'from' được chọn sao cho tia đi qua GIỮA lỗ cửa: vệt sáng vì vậy
  // rơi đúng lên giường, không đứng ở góc sàn như một vệt vô nghĩa.
  const key = keyLight(scene, { from: new THREE.Vector3(7.13, 3.27, -1.36), to: new THREE.Vector3(-2.24, .56, .85), color: '#ffc48c', intensity: 3.3, size: 8.5, far: 26 });
  const amb = ambience(scene, { sky: '#cbc0d4', ground: '#8a6350', fill: .72, rim: '#a07cff', rimI: .38, rimFrom: [-3, 2.4, 3] });
  const shaft = beam(scene, key, { ...WIN, length: 3.2, alpha: .12, color: '#ffc890' });
  // vệt sáng riêng trên bàn đầu giường: vùng sáng nhất khung luôn là thứ đang kể.
  // Đèn này phải ẤM: nắng buổi chiều là nguồn sáng duy nhất của căn phòng, đèn
  // trắng lạnh làm mặt vật trông như đồ điện tử, không phải đồ gỗ buổi chiều.
  const spot = pool(scene, { from: new THREE.Vector3(2.1, 1.7, 1.4), to: focus, intensity: .85, angle: .52 });
  // đèn riêng cho đồng hồ treo tường: nắng từ cửa sổ xiên vào nó, đủ để mặt
  // giấy đọc ra màu kem và để bóng của đồng hồ rơi xuống tường. Không có đèn
  // này thì đồng hồ chỉ là một đĩa tím phẳng dán trên tường.
  const clockLight = pool(scene, { from: new THREE.Vector3(1.75, 2.55, 2.15), to: new THREE.Vector3(-0.28, 1.86, .12), color: '#ffd9a8', intensity: 0, angle: .52 });
  // đèn riêng cho mặt giấy đồ thị: nắng cửa sổ đổ bóng thân máy ngang qua
  // dải giấy, không có đèn này thì đồ thị không đọc được
  const paperLight = pool(scene, { from: new THREE.Vector3(2.05, 2.15, 1.75), to: new THREE.Vector3(.70, .50, 1.05), color: '#ffe8cc', intensity: 0, angle: .58 });
  paperLight.castShadow = false;

  // ── đồ trong phòng ──
  const bed = giuongBuoiTrua(); bed.position.set(-2.30, 0, 1.60); scene.add(bed);
  // bàn đầu giường: một chiếc bàn rộng, đủ chỗ cho mấy cái máy đo
  const woodM = toon('#ffffff', { map: TEX.wood() }); woodM.map.repeat.set(1.4, 1);
  const table = new THREE.Group(); table.position.set(-0.15, 0, 1.05); scene.add(table);
  table.add(mesh(rbox(2.10, .07, 1.40, .02), woodM, [0, .465, 0]));
  table.add(mesh(rbox(2.04, .05, .04, .01), toon('#7a4526'), [0, .40, .68]));
  for (const sx of [-1, 1]) for (const sz of [-1, 1])
    table.add(mesh(rbox(.07, .43, .07, .015), woodM, [sx * .96, .215, sz * .64]));
  table.add(mesh(rbox(1.96, .04, 1.26, .01), toon('#8a5a34'), [0, .12, 0]));

  // Đồ trên bàn nằm trong khung của chính chiếc bàn (bàn đặt ở -0.15, 0, 1.05),
  // nên toạ độ ở đây là toạ độ cục bộ của bàn.
  const clock = dongHoBaoThuc(); clock.position.set(-.80, .50, -.50); clock.rotation.y = .34; table.add(clock);
  // bảng đo: bảng sau là bảng của người uống cà phê, bảng trước là người không uống
  const board = bangDoPhanXa(); board.position.set(-.15, .50, .25); board.rotation.y = -.28; table.add(board);
  const board2 = bangDoPhanXa(); board2.position.set(-.15, .50, -.35); board2.rotation.y = .28; table.add(board2);
  const mug = tachCaPhe(); mug.position.set(.34, .50, .25); mug.rotation.y = -.4; table.add(mug);
  // tách thứ hai (người KHÔNG uống cà phê) phải thấy rõ cạnh bảng đo sau,
  // nếu không khung so sánh hai người chỉ có một tách
  // tách thứ hai (người KHÔNG uống cà phê) phải thấy rõ cạnh bảng đo sau,
  // nếu không khung so sánh hai người chỉ có một tách. Tách này RỖNG — cà phê
  // là thứ phân biệt hai người, nên tách không có cà phê mới đọc ra là
  // "người không uống cà phê".
  const mug2 = tachCaPhe({ color: '#cfd6e6', empty: true }); mug2.position.set(.76, .50, .46); mug2.rotation.y = .5; table.add(mug2);
  // máy ghi giấc ngủ ở cuối bàn: mặt giấy chạy ra, trục thời gian chạy từ trái sang phải
  const rec = mayGhiGiacNgu(); rec.position.set(.70, .50, -.43); rec.rotation.y = .10; table.add(rec);
  // một chiếc đĩa rỗng: bằng chứng cụ thể cho "không có gì ăn", thay vì một
  // mảng gỗ trống mà thẻ "không ăn" chỉ vào. Đĩa đặt ở TRƯỚC bảng đèn đã tắt
  // (bảng trước), không phải dưới bảng đèn còn sáng (bảng sau) — đặt sai chỗ thì
  // người xem ghép "không ăn" với bảng không bị tụt, ngược ý câu nói.
  const plate = diaRong();
  plate.position.set(-.45, .50, .55);
  table.add(plate);

  // đồng hồ 24 giờ trên tường (đặt hẳn ra trước tường để nó đổ được bóng)
  const clock24 = dongHo24Gio(); clock24.position.set(-0.28, 1.86, .12); scene.add(clock24);
  // cây ở góc: chậu có đất, cọng mọc từ đất, lá ở đầu cọng
  const pl = cayGocPhong({ pot: '#d9774a', seed: 31 }); pl.position.set(2.75, 0, .40); pl.scale.setScalar(1.7); scene.add(pl);
  // bàn tay người: với ra chặn chuông, rồi cầm tách cà phê
  const hand = buildHand({ size: 1.15 }); hand.visible = false; scene.add(hand);
  // thảm dưới giường
  const rugTex = TEX.rug(); rugTex.repeat.set(1.6, 1.6);
  scene.add(mesh(new THREE.PlaneGeometry(2.8, 1.7), toon('#ffffff', { map: rugTex }), [-2.30, .004, 3.15], { rot: [-Math.PI / 2, 0, 0], cast: false }));

  // ── trạng thái theo thời gian ──
  const S = {
    scene, key, amb, focus, spot, bed, table, clock, rec, board, board2, clock24, mug, mug2, hand, curtain, plate,
    // đèn riêng của đồng hồ treo tường: k = 0…1 là độ sáng của nó
    clockLit: k => { clockLight.intensity = 2.2 * k; },
    // đèn riêng cho mặt giấy đồ thị: k = 0…1 là độ sáng của nó
    paperLit: k => { paperLight.intensity = 1.4 * k; },
    // giờ hiện trên mặt đồng hồ báo thức và trên đồng hồ 24 giờ
    setHour: h => { clock.tick(0, h); clock24.setHour(h); },
    // tiến độ giấc ngủ trưa: 0…1 — đồ thị trên giấy vẽ tới phút tương ứng
    nap: k => rec.setMinute(Math.round(clamp(k) * 45)),
    // đồng hồ báo thức reo
    ring: (t, k = 1) => clock.ring(t, k),
    // bảng đo phản xạ: đèn tắt dần, kim chùy, đèn xanh sáng lên
    measure: (lamps, needle, green) => { board.setLamps(lamps); board.setNeedle(needle); board.setGreen(green); },
    // bảng thứ hai: người KHÔNG uống cà phê — kim vẫn tụt
    measure2: (lamps, needle, green) => { board2.setLamps(lamps); board2.setNeedle(needle); board2.setGreen(green); },
    update: (t, o = {}) => {
      curtain.rotation.z = .03 * Math.sin(t * .9) + .015 * Math.sin(t * 2.3);
      pl.rotation.y = .03 * Math.sin(t * 1.2);
      key.intensity = (o.dim ?? 1) * 3.4;
      amb.hemi.intensity = (o.dim ?? 1) * .86;
      shaft.material.uniforms.uA.value = .16 * (o.dim ?? 1);
      spot.intensity = .85 * (o.focus ?? 1);
    },
  };
  return S;
}

// ── N2 · khối mô não trên bàn tối ────────────────────────────────────────
export function buildKhongMao() {
  const scene = new THREE.Scene();
  const B = brainSpace(scene, { seed: 3, w: 2.2, d: 1.6 });
  // không gian của não phải đọc được trên điện thoại: bớt tím, thêm sáng ấm
  B.amb.hemi.color.set('#c3b2b6');
  B.amb.hemi.groundColor.set('#5e4038');
  B.amb.rim.color.set('#dcc8f0');
  B.key.color.set('#fff0e2');
  // vùng đổ bóng của đèn chính phải phủ hết cả hai khối não, nếu không não
  // nằm ngoài vùng đó thì nó bị coi là trong bóng và cả khối tối đi
  Object.assign(B.key.shadow.camera, { left: -3.4, right: 3.4, top: 3.4, bottom: -3.4 });
  B.key.shadow.camera.updateProjectionMatrix();
  // bàn của phòng não không phải một tấm navy trơn: đổi thành gỗ ấm, để
  // khối não (hồng) có một nền khác màu, và cả khung không còn một tông
  // tím lạnh.
  const woodTex = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = '#5a3722'; c.fillRect(0, 0, w, h);
    // Vân gỗ phải ĐỦ ĐẬM để đọc ra là gỗ. Trước đây nét vân nhạt quá, cả mặt
    // bàn thành một mảng nâu trơn — người chấm gọi đó là "mảng phẳng không
    // texture gỗ".
    for (let i = 0; i < 460; i++) {
      c.strokeStyle = `rgba(${46 + Math.random() * 48 | 0},${24 + Math.random() * 32 | 0},${11 + Math.random() * 24 | 0},${.16 + Math.random() * .32})`;
      c.lineWidth = 1 + Math.random() * 6;
      const y = Math.random() * h;
      c.beginPath(); c.moveTo(0, y);
      c.bezierCurveTo(w * .3, y + (Math.random() - .5) * 28, w * .7, y + (Math.random() - .5) * 28, w, y + (Math.random() - .5) * 18);
      c.stroke();
    }
    // mắt gỗ
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * w, y = Math.random() * h, rot = Math.random() * 3;
      for (let j = 6; j > 0; j--) {
        c.strokeStyle = `rgba(34,18,9,${.08 + j * .05})`; c.lineWidth = 2;
        c.beginPath(); c.ellipse(x, y, j * 10, j * 4.5, rot, 0, 7); c.stroke();
      }
    }
  });
  // vân lặp lại trên cả mặt bàn: một ảnh 512 trải trên 9×7 m thì vân bị
  // nong ra thành vệt mờ, đọc ra là một mảng phẳng
  woodTex.repeat.set(3, 2.4);
  scene.traverse(o => {
    if (o.isMesh && o.material && o.material.color && o.material.color.getHexString() === '252d50') {
      o.material = toon('#ffffff', { map: woodTex });
      // bàn không kéo dài tới vách sau: rút lại để vách không cắt qua mặt bàn
      o.scale.z = .74;
    }
  });
  // ── vách sau của không gian não ────────────────────────────────────────
  // Nửa trên khung trước đây là một dải navy trống: không có gì đứng sau bàn,
  // nên khối não bị đặt lơ lửng. Vách này là một màng mô có vân, có nếp, và
  // nó nhận bóng đổ — để có một nơi chốn thật thay vì một nền đen.
  const wallTex = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = '#191434'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 1200; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = 8 + Math.random() * 36;
      c.fillStyle = `rgba(${44 + Math.random() * 44 | 0},${34 + Math.random() * 38 | 0},${92 + Math.random() * 56 | 0},${.06 + Math.random() * .13})`;
      c.beginPath(); c.ellipse(x, y, r, r * (.4 + Math.random() * .8), Math.random() * 3, 0, 6.3); c.fill();
    }
    c.strokeStyle = 'rgba(150,124,210,.07)'; c.lineWidth = 3;
    for (let i = 0; i < 34; i++) {
      c.beginPath();
      let x = Math.random() * w, y = Math.random() * h;
      c.moveTo(x, y);
      for (let k = 0; k < 5; k++) { x += (Math.random() - .5) * 110; y += (Math.random() - .5) * 110; c.lineTo(x, y); }
      c.stroke();
    }
  });
  wallTex.repeat.set(4, 3);
  // Vách PHẢI TỐI hơn mặt bàn: nếu vách sáng hơn, đường nối giữa bàn và
  // vách thành một đường ngang sắc, đọc ra là một màn phông.
  const back = mesh(new THREE.PlaneGeometry(24, 9), toon('#ffffff', { map: wallTex }), [0, 1.4, -2.75]);
  back.receiveShadow = true;
  scene.add(back);
  // khối mô xoay một góc nhỏ: trục dài của nó (trục nằp ngang) nằm ngang
  // khung, để các nếp não chạy ngang qua mà không bị hội tụ ở một đầu
  const ROT = 0.15;
  // não đặt lên mặt bàn: đáy não bẹt nằm ngay trên mặt gỗ (y = -0.52)
  const chunk = khoiMoNao({ w: 1.34, d: 1.02, h: .58, seed: 3 }); chunk.position.set(-.80, -.29, 0); chunk.rotation.y = ROT; scene.add(chunk);
  // bản thứ hai: bản "không thấy quan hệ" — có sóng to mà vẫn tối
  const chunk2 = khoiMoNao({ w: 1.34, d: 1.02, h: .58, seed: 3 }); chunk2.position.set(.80, -.29, 0); chunk2.rotation.y = ROT; scene.add(chunk2);
  // một vệt sáng riêng chỉ vào bản bên trái: bên thấy có quan hệ thì sáng lên
  const lit = pool(scene, { from: new THREE.Vector3(-1.50, 1.20, 1.35), to: new THREE.Vector3(-.80, -.14, .05), intensity: .8, angle: .42, penumbra: .90 });
  lit.visible = false;
  // tín hiệu chạy trên nếp não: một dãy đốm sáng chạy dọc theo mặt nếp.
  // Nó bò chậm lúc não chưa kịp "chạy lại", rồi chạy đều.
  const dots = glowDots(14, .015, '#ffcf7a', 1.15); scene.add(dots);
  const S = {
    scene, key: B.key, chunk, chunk2, lit, focus: B.focus, dots, lamp: B.lamp,
    // sóng chậm: biên độ lớn nhất ở đầu rồi nhỏ dần
    wave: (t, k = 1) => { chunk.wave(t, k); chunk2.wave(t, k); },
    // bản bên trái sáng lên, bản bên phải vẫn tối
    leftLit: k => { lit.visible = k > .01; lit.intensity = 1.4 * k; },
    // bản bên phải tắt dần: cùng một vật, nhưng ở bên "không thấy" mối liên
    // hệ thì nó phải tối hẳn, không phải chỉ sáng yếu hơn một chút.
    darkRight: k => {
      const c = 1 - .74 * clamp(k);
      chunk2.traverse(o => {
        if (o.userData.noDim) return;              // nét viền mực giữ nguyên màu
        if (o.material && o.material.color) {
          o.material.color.setRGB(c * .62, c * .66, c * 1.05);
          o.material.needsUpdate = true;
        }
      });
    },
    // tín hiệu trên nếp não: k = 0…1 là não đã chạy được tới đâu
    pulse: (t, k = 0) => {
      dots.visible = k > .01;
      if (!dots.visible) return;
      const spd = .05 + .95 * k;                       // lúc đầu bò, sau đó chạy đều
      const P = new THREE.Vector3();
      const cx = -.80, Rz = chunk.Rz, Rx = chunk.Rx;
      const ca = Math.cos(ROT), sa = Math.sin(ROT);
      for (let i = 0; i < 14; i++) {
        const u = ((t * spd * .35 + i / 14) % 1);
        // đường tín hiệu đi ngang qua mặt nếp, dọc theo trục dài của não:
        // tín hiệu chạy từ mép này sang mép kia, không dồn về một đầu
        const lz = 0, lx = (-.72 + u * 1.44) * Rx;
        // điểm trên mặt nếp, đưa sang toạ độ thế giới theo đúng góc xoay
        const [px, py, pz] = chunk.surf(lx, lz, t, chunk.k);
        // đẩy đốm ra khỏi mặt não theo phương radial, để nó là một hạt tròn
        // nằm trên nếp chứ không phải một vệt lửa cắm vào não
        const len = Math.hypot(px, py, pz) || 1;
        const qx = px + px / len * .012, qy = py + py / len * .012, qz = pz + pz / len * .012;
        P.set(cx + qx * ca + qz * sa, chunk.position.y + qy, -qx * sa + qz * ca);
        setDot(dots, i, P, .6 + .4 * k);
      }
      dots.count = 14; dots.instanceMatrix.needsUpdate = true;
    },
    update: (t, o = {}) => {
      B.key.intensity = 1.75 * (o.dim ?? 1);
      // Đèn phụ quá tay thì mọi mặt đều mềm: dải toon của não tan vào nhau,
      // não đọc ra là hình vẽ màu mà có dải sắc. Bớt đèn phụ, thêm đèn chính.
      B.amb.hemi.intensity = .19 * (o.dim ?? 1);
      B.amb.rim.intensity = .17 * (o.dim ?? 1);
      B.lamp.intensity = .55 * (o.focus ?? 1) * (o.dim ?? 1);
    },
  };
  return S;
}

// ── N3 · khe giữa hai tế bào ─────────────────────────────────────────────
// Một khe thật: bên trái là củ tế bào (đầu sợi trục), bên phải là bức màng của
// tế bào kia với hàng thụ thể. Khe nằm giữa, phân tử trôi trong đó rồi bám
// vào khía của thụ thể. Mọi toạ độ dưới đây là toạ độ thế giới.
export function buildKhe() {
  const scene = new THREE.Scene();
  // nền của khe không được quá tối: nét mực gần như đen, nét mực trên nền đen
  // là nét mực không thấy — vật thể trông như không có viền
  scene.background = new THREE.Color('#1e2450');
  scene.fog = new THREE.Fog('#252c60', 3.6, 9);

  // sàn của không gian: có đáy thì khe mới thành một khoảng trống có chiều sâu
  const floorTex = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = '#332d63'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 1400; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = 3 + Math.random() * 16;
      c.fillStyle = `rgba(${90 + Math.random() * 60 | 0},${70 + Math.random() * 50 | 0},${160 + Math.random() * 60 | 0},${.04 + Math.random() * .10})`;
      c.beginPath(); c.ellipse(x, y, r, r * (.4 + Math.random() * .8), Math.random() * 3, 0, 6.3); c.fill();
    }
    c.strokeStyle = 'rgba(190,175,255,.10)'; c.lineWidth = 2;
    for (let i = 0; i < 30; i++) {
      c.beginPath();
      let x = Math.random() * w, y = Math.random() * h;
      c.moveTo(x, y);
      for (let k = 0; k < 4; k++) { x += (Math.random() - .5) * 90; y += (Math.random() - .5) * 90; c.lineTo(x, y); }
      c.stroke();
    }
  });
  floorTex.repeat.set(3, 3);
  // sàn của khe là một mặt phẳng trơn thì đọc ra là một tấm bìa; đây là
  // mặt trong của tế bào, nên nó cũng có các tế bào lồi lên như màng.
  const floor = mangTeBao({
    w: 9, h: 7, cell: .62, depth: .055, nu: 140, nv: 110, axis: 'z', mat: toon('#ffffff', { map: floorTex }),
    base: (u, v, d, px, py) => [px, d, -py],
  });
  floor.position.set(.4, -.78, 0);
  scene.add(floor);

  // Mặt tế bào bên khe (bức màng của tế bào thần kinh): một bức tường có nếp
  // ở bên trái khe. Không có nó, phần trái khung chỉ là một mảng nền đen —
  // người xem không hiểu mình đang đứng ở đâu.
  const memTex = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = '#4a3f8c'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = 6 + Math.random() * 28;
      c.fillStyle = `rgba(${120 + Math.random() * 60 | 0},${100 + Math.random() * 50 | 0},${200 + Math.random() * 50 | 0},${.05 + Math.random() * .12})`;
      c.beginPath(); c.ellipse(x, y, r, r * (.4 + Math.random() * .8), Math.random() * 3, 0, 6.3); c.fill();
    }
    c.strokeStyle = 'rgba(60,42,120,.35)'; c.lineWidth = 3;
    for (let i = 0; i < 34; i++) {
      c.beginPath();
      let x = Math.random() * w, y = Math.random() * h;
      c.moveTo(x, y);
      for (let k = 0; k < 5; k++) { x += (Math.random() - .4) * 80; y += (Math.random() - .5) * 80; c.lineTo(x, y); }
      c.stroke();
    }
    for (let i = 0; i < 70; i++) {            // lỗ chân tăm
      const x = Math.random() * w, y = Math.random() * h, r = 4 + Math.random() * 10;
      c.fillStyle = 'rgba(30,20,66,.45)';
      c.beginPath(); c.arc(x, y, r, 0, 6.3); c.fill();
      c.strokeStyle = 'rgba(205,195,255,.20)'; c.lineWidth = 2;
      c.beginPath(); c.arc(x, y, r, 0, 6.3); c.stroke();
    }
  });
  memTex.repeat.set(2, 2);
  const memMat = toon('#ffffff', { map: memTex, side: THREE.DoubleSide });
  // bức màng bên trái khe: mặt cong, có nếp, quay về phía khe (+x).
  // Nó chỉ che phần xa của khe (z > 0), không cắt qua sợi trục ở z ≈ 0.
  // Bề mặt chia thành các tế bào hình đa giác, giữa chúng là rãnh — mảng
  // phẳng đọc ra là một tấm bìa đen, không phải màng tế bào.
  const leftWall = mangTeBao({
    w: 4.4, h: 2.6, cell: .40, depth: .055, nu: 120, nv: 92, axis: 'x', mat: memMat,
    base: (u, v, d, px, py) => {
      const z = py + 1.60, y = px;
      const bulge = .16 * Math.sin(u * 5.1 + .3) * Math.cos(v * 3.7)
        + .08 * Math.sin(v * 9.2 + u * 4.4) + .05 * Math.cos(u * 13.7);
      return [bulge + d, y, z];
    },
  });
  leftWall.position.set(-.92, .05, 0);
  scene.add(leftWall);

  // tế bào thần kinh: thân ở bên trái, sợi trục chạy ra và kết thúc bằng củ
  const neuron = teBaoThanKinh({ size: 3 });
  neuron.position.set(-2.34, .26, -.66);
  scene.add(neuron);
  // củ tế bào: mặt phẳng quay về khe, có túi chứa chất
  const bau = bauTauTien({ r: .30 });
  bau.position.set(-.04, .04, -.05);
  scene.add(bau);

  // bức màng phía bên kia, và hàng thụ thể trên đó. Màng quay mặt về khe.
  const rec = hangThuThe({ n: 5, spacing: .46, size: .32 });
  rec.position.set(0, 0, 1.90);
  rec.rotation.y = Math.PI;              // mặt thụ thể quay về phía khe (−z)
  scene.add(rec);

  // đám phân tử adenosine trong khe
  const CLOUD = 40;
  const cloud = damPhanTuAdenosine(CLOUD);
  scene.add(cloud);
  const r = mulberry(4);
  const spots = [];
  for (let i = 0; i < CLOUD; i++) spots.push([-.95 + r() * 1.90, -.42 + r() * .88, .30 + r() * .70, r() * 6.28, .8 + r() * .5]);
  // một phân tử adenosine bám vào khía của thụ thể giữa hàng
  const dock = phamTuAdenosine();
  scene.add(dock);
  // phân tử caffeine, chờ bay vào
  const cafe = phanTuCaffeine();
  cafe.visible = false;
  scene.add(cafe);
  // tín hiệu chạy dọc sợi trục: một dãy đốm sáng bò trên củ tế bào
  const axDots = glowDots(10, .028, '#9be7ff', 2.2); scene.add(axDots);

  const key = keyLight(scene, { from: new THREE.Vector3(-.9, 1.9, 1.9), to: new THREE.Vector3(.75, .05, 0), color: '#e6dcff', intensity: 1.5, size: 2.6, far: 12 });
  const amb = ambience(scene, { sky: '#8490d0', ground: '#4a3a58', fill: .40, rim: '#cbb6ff', rimI: 1.2, rimFrom: [2.2, 1.4, -2.0] });
  const lamp = pool(scene, { from: new THREE.Vector3(0, 1.35, 1.05), to: new THREE.Vector3(0, .05, 1.45), intensity: 2.2, angle: .60 });

  // vị trí khía của thụ thể giữa hàng (index 2)
  scene.updateMatrixWorld(true);
  const door = rec.doors[2];
  const notch = door.d.localToWorld(door.d.notch.clone());
  // vành miệng của một thụ thể bên cạnh (thụ thể trống) — để thẻ thuật ngữ
  // chỉ vào cái túi, chứ không chỉ vào phân tử đang nằm trong túi
  const rim1 = rec.doors[1].d.localToWorld(new THREE.Vector3(0, .15, .02));

  // hai chỗ đứng của phân tử trong khe, trước khi bay vào khía.
  // Cả hai đứng gần màng, để nhát cận có nền tối phía sau chứ không phải củ tế bào.
  const FROM = new THREE.Vector3(.05, .12, .95);      // adenosine đứng chờ
  const CAFE_FROM = new THREE.Vector3(-.30, .30, .95); // caffeine xuất hiện

  const S = {
    scene, key, neuron, rec, bau, cloud, dock, cafe, lamp,
    notch, rim1,
    // vị trí phân tử caffeine và phân tử adenosine bám, để thẻ thuật ngữ bám đúng chỗ
    cafePos: (k = 0) => CAFE_FROM.clone().lerp(notch.clone(), ss(k)),
    dockPos: (k = 0) => FROM.clone().lerp(notch.clone(), ss(k)),
    // vị trí adenosine bị đẩy ra khỏi túi — thẻ thuật ngữ bám vào đây
    pushedPos: (k = 0) => notch.clone().add(new THREE.Vector3(-.24 * k, .10 * k, -.38 * k)),
    // đám phân tử: k = 0…1 là mật độ (người thức càng lâu thì càng nhiều);
    // sc = kích thước — nhát rộng thì phân tử phải to ra, không thành bụi lấm tấm
    crowd: (t, k = 0, sc = 1) => {
      const n = Math.round(k * CLOUD);
      for (let i = 0; i < CLOUD; i++) {
        if (i < n) {
          const [x, y, z, ph, s] = spots[i];
          cloud.set(i, x + Math.sin(t * .8 + ph) * .02, y + Math.sin(t * .6 + ph * 2) * .015, z + Math.cos(t * .7 + ph) * .02, null, ADENO_SCALE * s * sc);
        } else cloud.hide(i);
      }
      cloud.flush();
    },
    // phân tử adenosine bám vào khía (k = 0…1: bay từ chỗ đứng chờ tới và ngồi vào khía)
    docking: (t, k = 0) => {
      const p = FROM.clone().lerp(notch.clone(), ss(k));
      dock.set(0, p.x, p.y, p.z, null, ADENO_SCALE);
      dock.flush();
    },
    // phân tử caffeine bay vào khía và đẩy adenosine ra
    caffeine: (t, k = 0) => {
      cafe.visible = k > .001;
      if (!cafe.visible) return;
      const p = CAFE_FROM.clone().lerp(notch.clone(), ss(k));
      cafe.set(0, p.x, p.y, p.z, null, CAFE_SCALE);
      cafe.flush();
    },
    // adenosine bị đẩy ra khỏi túi, trôi lại vào khe — phải thấy rõ nó
    // nằm ngoài túi, chứ không biến mất sau môi dưới
    pushed: (t, k = 0) => {
      const out = notch.clone().add(new THREE.Vector3(-.24 * k, .10 * k, -.38 * k));
      dock.set(0, out.x, out.y, out.z, null, ADENO_SCALE);
      dock.flush();
    },
    // tín hiệu trên sợi trục: k = 0…1 là củ tế bào truyền tín hiệu mạnh đến đâu
    axon: (t, k = 0) => {
      axDots.visible = k > .01;
      if (!axDots.visible) return;
      const P = new THREE.Vector3();
      const spd = .10 + 1.10 * k;
      for (let i = 0; i < 10; i++) {
        const u = ((t * spd * .30 + i / 10) % 1);
        neuron.curve.getPoint(u, P);
        P.multiplyScalar(3).add(neuron.position);
        P.y += .06;
        setDot(axDots, i, P, .6 + .6 * k);
      }
      axDots.count = 10; axDots.instanceMatrix.needsUpdate = true;
    },
    update: (t, o = {}) => {
      key.intensity = 4.0 * (o.dim ?? 1);
      amb.hemi.intensity = .85 * (o.dim ?? 1);
      lamp.intensity = 2.2 * (o.focus ?? 1);
    },
  };
  return S;
}
