// Ba nơi chốn của tập:
//   N1 · Bếp buổi sáng — bàn gỗ dưới cửa sổ có nắng, nồi cơm điện, đồng hồ treo tường.
//   N2 · Dưới đáy nồi — cái nồi cơm bị cưa ngang đứng trên bàn: vỏ, nồi trong, mâm nhiệt,
//        lò xo nhấn đầu dò nhiệt, hai dây chạy xuống bo mạch, nước và gạo trong nồi.
//   N3 · Nồi cơm đời đầu — thân sành cưa ngang, bên trong là thanh lưỡng kim và hai tiếp điểm.
import * as THREE from 'three';
import { PAL, toon, glowMat, canvasTex, TEX, rbox, mesh, fxLayer, mulberry, clamp, lerp, ss, seg, keys, surface } from '../../../../rig/kit.js';
import { keyLight, ambience, wallWithHole, beam, pool } from '../../../../rig/lights.js';
import { plant } from '../../../../rig/sets.js';
import { buildHand, flow } from '../../../../rig/fx.js';
import { noiComDien } from './props/noi-com-dien.js';
import { noiComDoiDau } from './props/noi-com-doi-dau.js';
import { noiCatNgang } from './props/noi-cat-ngang.js';
import { noiCuCatNgang } from './props/noi-cu-cat-ngang.js';
import { nhietKe } from './props/nhiet-ke.js';
import { cauDoDienTro } from './props/cau-do-dien-tro.js';
import { gachGao, gachGaoCat, lopGao } from './props/gao.js';
import { tuiGao } from './props/tui-gao.js';
import { batDongNuoc } from './props/bat-dong-nuoc.js';
import { nuocNoi } from './props/nuoc.js';

export const WIN = { x0: -1.62, x1: -0.34, y0: .78, y1: 1.98 };

// ── N1 · bếp buổi sáng ───────────────────────────────────────────────────
export function buildBep() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1b1a33');
  scene.fog = new THREE.Fog('#241f3d', 6, 13);

  // tường gạch có lỗ cửa sổ
  const tileTex = (() => {
    const t = canvasTex(512, 512, (c, w, h) => {
      const r = mulberry(17);
      c.fillStyle = '#8f88b4'; c.fillRect(0, 0, w, h);
      const s = w / 8;
      for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
        const k = r();
        // Ô gạch chỉ dao động trong họ màu của tường: một ô màu nâu/tan riêng lẻ
        // sẽ đọc ra như một mảng vét bám dán trên tường, không phải gạch.
        c.fillStyle = k > .93 ? '#a79ad6' : `rgb(${188 + r() * 14},${180 + r() * 12},${196 + r() * 12})`;
        c.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
        c.fillStyle = 'rgba(255,255,255,.10)'; c.fillRect(i * s + 5, j * s + 5, s * .35, 3);
      }
    });
    return t;
  })();
  tileTex.repeat.set(4, 2.2);
  wallWithHole(scene, toon('#ffffff', { map: tileTex }), { ...WIN, left: -9, right: 9, top: 3.2 });

  // khung cửa sổ, trời sáng, mặt trời thấp
  const fr = toon('#efe2c8');
  const cx = (WIN.x0 + WIN.x1) / 2, cy = (WIN.y0 + WIN.y1) / 2, ww = WIN.x1 - WIN.x0, wh = WIN.y1 - WIN.y0;
  scene.add(mesh(rbox(ww + .12, .09, .20, .02), fr, [cx, WIN.y1 + .03, -.02]));
  scene.add(mesh(rbox(ww + .12, .09, .20, .02), fr, [cx, WIN.y0 - .03, -.02]));
  scene.add(mesh(rbox(.09, wh + .12, .20, .02), fr, [WIN.x0 - .03, cy, -.02]));
  scene.add(mesh(rbox(.09, wh + .12, .20, .02), fr, [WIN.x1 + .03, cy, -.02]));
  scene.add(mesh(rbox(.05, wh, .09, .015), fr, [cx, cy, -.02]));
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), new THREE.ShaderMaterial({
    uniforms: { uA: { value: new THREE.Color('#ffd9a8') }, uB: { value: new THREE.Color('#8fa2dd') } }, fog: false,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec2 vUv; uniform vec3 uA, uB;
      void main(){ gl_FragColor = vec4(mix(uA, uB, smoothstep(.10,.90,vUv.y)), 1.); }`,
  }));
  sky.position.set(cx - .5, 2.0, -2.4); scene.add(sky);
  const sun = mesh(new THREE.CircleGeometry(.20, 32), glowMat('#ffe6b8', 1.8), [cx - 1.1, WIN.y0 + .40, -2.2], { cast: false });
  fxLayer(sun); scene.add(sun);

  // ── bàn gỗ ──
  const wood = toon('#ffffff', { map: TEX.wood() }); wood.map.repeat.set(3, 1);
  scene.add(mesh(rbox(4.60, .08, 1.30, .02), wood, [0, -.04, .65]));
  scene.add(mesh(rbox(4.60, .10, .05, .015), toon('#6b3d22'), [0, -.10, 1.28]));
  scene.add(mesh(new THREE.BoxGeometry(4.60, .84, .05), toon('#3b3f6e'), [0, -.52, 1.33]));
  for (let x = -2.1; x < 2.2; x += .70) {
    scene.add(mesh(rbox(.64, .70, .04, .02), toon('#4a4f85'), [x, -.52, 1.36]));
    scene.add(mesh(rbox(.20, .025, .04, .01), toon('#c9973a'), [x, -.24, 1.39]));
  }

  // kệ treo bên phải, có lọ và bình. Mép kệ không được trống trơn: đầu kệ
  // trống sẽ thành một mảng gỗ phẳng dán ngay dưới đồng hồ, đọc như vết bẩn.
  scene.add(mesh(rbox(.80, .05, .26, .01), wood, [1.24, 1.16, .13]));
  ['#f04462', '#f7bd27', '#67e8f9', '#9a5be5'].forEach((c, i) => {
    scene.add(mesh(new THREE.CylinderGeometry(.052, .052, .15 + (i % 2) * .05, 16), toon(c), [1.00 + i * .17, 1.26 + (i % 2) * .025, .13]));
    scene.add(mesh(new THREE.CylinderGeometry(.055, .055, .03, 16), toon(PAL.cream), [1.00 + i * .17, 1.35 + (i % 2) * .05, .13]));
  });

  // ── đồng hồ treo tường ──
  // Đồng hồ treo cách tường chỉ vài centimet: bóng của nó phải là một vầng
  // mảnh ôm sát viền đồng hồ. Đèn đặt sai bên thì bóng tách ra thành một vệt
  // tối lơ lửng, đọc ra như một vết bẩn trên tường.
  const clock = new THREE.Group(); clock.position.set(1.80, 1.58, .03);
  clock.add(mesh(new THREE.CylinderGeometry(.115, .115, .035, 36), toon(PAL.cream), [0, 0, .015], { rot: [Math.PI / 2, 0, 0] }));
  clock.add(mesh(new THREE.TorusGeometry(.115, .016, 8, 36), toon(PAL.red), [0, 0, .032]));
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    clock.add(mesh(rbox(.010, .026, .008, .003), toon(PAL.navy), [Math.sin(a) * .092, Math.cos(a) * .092, .034], { rot: [0, 0, -a] }));
  }
  const hh = new THREE.Group(), mh = new THREE.Group(); hh.position.z = mh.position.z = .036; clock.add(hh, mh);
  hh.add(mesh(rbox(.014, .058, .006, .003), toon(PAL.navy), [0, .024, 0]));
  // kim phút màu đỏ: hai kim cùng màu navy đè lên nhau sẽ đọc thành một vệt
  // dày, không ra hai kim đồng hồ.
  mh.add(mesh(rbox(.009, .082, .006, .003), toon(PAL.red), [0, .036, .006]));
  // trục kim: một nắp nhỏ ở chính giữa, để hai kim không bị cắt cụt
  clock.add(mesh(new THREE.CylinderGeometry(.008, .008, .010, 16), toon(PAL.navy), [0, 0, .038], { rot: [Math.PI / 2, 0, 0] }));
  clock.tick = (hours) => { mh.rotation.z = -hours * Math.PI * 2; hh.rotation.z = -hours / 12 * Math.PI * 2; };
  clock.tick(8);
  scene.add(clock);

  const pl = plant('#d9774a', 31); pl.position.set(2.00, 0, .60); pl.scale.setScalar(1.4); scene.add(pl);

  // ── ánh sáng: nắng sáng chiếu qua lỗ cửa sổ xuống vệt bàn ──
  const focus = new THREE.Vector3(-1.02, .05, .78);
  const dir = new THREE.Vector3(cx, cy, -.1).sub(focus).normalize();
  const key = keyLight(scene, { from: focus.clone().addScaledVector(dir, 8), to: focus, color: '#ffdfae', intensity: 2.6, size: 2.6, far: 16 });
  // đèn chính có thể ngắm vào một chỗ khác (câu về đồng hồ trên tường): hướng sáng
  // giữ nguyên, chỉ dời tâm đèn để bóng đổ rơi đúng chỗ đang kể
  const keyOffset = key.position.clone().sub(key.target.position);
  const aimKey = pos => { key.target.position.copy(pos); key.position.copy(pos).add(keyOffset); };
  const amb = ambience(scene, { sky: '#6d7cc0', ground: '#3a2a44', fill: .48, rim: '#a07cff', rimI: .65, rimFrom: [3, 2.4, 3] });
  const shaft = beam(scene, key, { ...WIN, length: 2.3, alpha: .07, color: '#ffd9a0' });
  // vệt sáng riêng: luôn đặt vào điểm đang kể
  const spot = pool(scene, { from: new THREE.Vector3(-.2, 1.5, 1.7), to: focus, intensity: 1.6, angle: .55 });
  // vệt sáng thứ hai: khu thí nghiệm, hai nồi cưa bên phải bàn
  const spotExp = pool(scene, { from: new THREE.Vector3(.95, 1.7, 1.9), to: new THREE.Vector3(.93, .12, .82), intensity: 0, angle: .55 });

  // ── vật trên bàn ──
  const cooker = noiComDien(); cooker.position.set(-1.05, 0, .78); cooker.rotation.y = .28; scene.add(cooker);
  // ổ cắm trên tường: dây điện của nồi phải cắm vào một chỗ, không nằm vắt
  // trên mặt bàn. Ổ cắm nằm đúng ở điểm đầu dây của nồi chạm tường.
  scene.add(mesh(rbox(.090, .124, .016, .006), toon('#efe9dc'), [-1.01, .30, -.006]));
  scene.add(mesh(rbox(.048, .058, .006, .003), toon('#cdc6b6'), [-1.01, .30, .006]));
  for (const s of [-1, 1]) scene.add(mesh(rbox(.009, .022, .005, .002), toon('#3a3f4c'), [-1.01 + s * .014, .30, .010]));
  // lớp cơm trong nồi (lộ ra khi nắp mở ở câu cuối)
  const rice = lopGao({ R: .165, y: .095, h: .135, n: 700, seed: 11, gs: 1.05 });
  cooker.add(rice);
  // đèn trong nồi: bật lên khi nắp mở, để cơm thấy trắng thay vì tối như mực
  const inner = new THREE.SpotLight('#fff2d6', 0, .85, .62, .9, 1);
  inner.position.set(0, .58, .03);
  inner.target.position.set(0, .12, 0);
  cooker.add(inner); cooker.add(inner.target);
  const old = noiComDoiDau(); old.position.set(-.34, 0, .95); old.rotation.y = -.22; old.visible = false; scene.add(old);

  // thí nghiệm: hai nồi cưa ngang, một nhiều nước một ít nước
  const expA = noiCatNgang({ shell: '#e7e2d6' }); expA.position.set(.62, 0, .82); expA.visible = false; scene.add(expA);
  const expB = noiCatNgang({ shell: '#e7e2d6' }); expB.position.set(1.24, 0, .82); expB.visible = false; scene.add(expB);
  // nước trong hai nồi thí nghiệm
  const wA = nuocNoi({ R: .138, r0: .132, bottom: .060, level: .130 }); wA.position.set(.62, 0, .82); wA.visible = false; scene.add(wA);
  const wB = nuocNoi({ R: .138, r0: .132, bottom: .060, level: .100 }); wB.position.set(1.24, 0, .82); wB.visible = false; scene.add(wB);
  const tA = nhietKe({ scale: .52, length: .230 }); tA.position.set(.62 - .055, .078, .82 + .008); tA.visible = false; scene.add(tA);
  const tB = nhietKe({ scale: .52, length: .230 }); tB.position.set(1.24 - .055, .078, .82 + .008); tB.visible = false; scene.add(tB);

  // bát đong nước và túi gạo cạnh nồi (lời khuyên cuối tập)
  const bowl = batDongNuoc(); bowl.position.set(-.30, 0, .44); bowl.visible = false; scene.add(bowl);
  const bag = tuiGao(); bag.position.set(-.66, 0, .40); bag.rotation.y = .25; bag.visible = false; scene.add(bag);

  // bàn tay người: một khung xoay để đặt bàn tay, bát rót nước và dòng nước
  const handRig = new THREE.Group(); scene.add(handRig);
  const hand = buildHand({ size: .80 }); handRig.add(hand);
  // Bàn tay mở nắp: bám vào núm cầm nên đi theo vòng bản lề khi nắp mở.
  // Nhưng khi nắp đã mở 66 độ thì núm nằm ở mặt sau, che khuất; người thật
  // mở nắp cầm vành nắp. Tay đặt trong khung của nắp: cẳng tay đi lên trên,
  // ngón tay buông xuống bên ngoài vành nắp — đúng như LOOK yêu cầu.
  const handLid = new THREE.Group(); cooker.knob.add(handLid);
  const handLidF = buildHand({ size: .80 }); handLid.add(handLidF);
  handLid.position.set(0, .044, .200);
  handLid.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(
    new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(-1, 0, 0)));
  handLid.visible = false;
  handLidF.pose(.35, .25);
  // bát đong nước nằm trong lòng bàn tay, miệng bát nghiêng xuống dưới để rót
  const pourCup = batDongNuoc({ R: .056, H: .070, marks: false });
  pourCup.position.set(.20, -.085, .02); pourCup.rotation.set(0, 0, -1.13);
  pourCup.visible = false; hand.add(pourCup);
  // dòng nước rơi từ miệng bát xuống mặt nước trong nồi: một vệt nước có bề dày,
  // loe dần, chứ không phải một chuỗi hạt tròn trông như dây điện
  const streamMat = toon('#d8f4ff', { transparent: true, opacity: .46, depthWrite: false, emissive: new THREE.Color('#8fd6ea') });
  const streamMesh = mesh(new THREE.CylinderGeometry(.011, .0045, 1, 18, 1, true), streamMat, [0, 0, 0], { cast: false });
  streamMesh.renderOrder = 6; streamMesh.visible = false; scene.add(streamMesh);
  // bắt nước vỡ ở chỗ dòng nước chạm mặt nước: một vòng sóng tròn lan ra rồi tan,
  // không phải một hàng hạt tròn đứng thành chuỗi
  const splash = new THREE.Group();
  const ringMat = toon('#dff2ff', { transparent: true, opacity: 0, depthWrite: false, emissive: new THREE.Color('#2f5f74') });
  const ring = mesh(new THREE.TorusGeometry(.018, .0022, 6, 28), ringMat, [0, 0, 0], { cast: false });
  ring.rotation.x = -Math.PI / 2;
  ring.renderOrder = 6;
  splash.add(ring);
  splash.visible = false;
  scene.add(splash);
  splash.update = (t, k) => {
    const a = (t * 1.7) % 1;
    ring.scale.setScalar(.5 + a * 2.4);
    ringMat.opacity = .55 * k * (1 - a);
  };
  const setStream = (from, to) => {
    const dir = to.clone().sub(from), len = Math.max(.001, dir.length());
    streamMesh.position.copy(from).add(to).multiplyScalar(.5);
    streamMesh.scale.set(1, len, 1);
    streamMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
    splash.position.copy(to);
  };

  const S = {
    scene, key, amb, spot, focus, cooker, old, clock, bowl, bag, hand, handRig, handLid, handLidF, pourCup, streamMesh, splash, setStream, rice, plant: pl,
    expA, expB, wA, wB, tA, tB,
    aimKey,
    setHour: h => clock.tick(h),
    update: (t, o = {}) => {
      pl.rotation.y = .03 * Math.sin(t * 1.2);
      key.intensity = (o.dim ?? 1) * 2.6;
      amb.hemi.intensity = (o.dim ?? 1) * .48;
      shaft.material.uniforms.uA.value = .07 * (o.dim ?? 1);
      spot.intensity = 1.6 * (o.focus ?? 1);
      spotExp.intensity = 1.5 * (o.exp ?? 0);
      inner.intensity = .075 * (o.open ?? 0);
      // hai nồi thí nghiệm phải được cập nhật mỗi khung: nếu không, lớp bọt sôi
      // giữ nguyên ma trận cũ và 34 hạt bọt to bằng cả nồi, thành một quả bóng
      // trắng che mất cả khung hình.
      wA.update(t); wB.update(t);
      splash.update(t, splash.visible ? 1 : 0);
    },
  };
  return S;
}

// ── phòng tối có bàn: nơi đứng của những vật bị cưa ──────────────────────
function buildRoom(scene, seed = 3) {
  const r = mulberry(seed);
  // sàn ván
  const floorTex = TEX.wood(); floorTex.repeat.set(3, 3);
  scene.add(mesh(new THREE.PlaneGeometry(14, 14), toon('#ffffff', { map: floorTex }), [0, -.42, 1.2], { rot: [-Math.PI / 2, 0, 0], cast: false }));
  // tường sau
  const wallTex = canvasTex(512, 512, (c, w, h) => {
    c.fillStyle = '#6b6392'; c.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 64) { c.fillStyle = 'rgba(255,240,216,.08)'; c.fillRect(x, 0, 22, h); }
    for (let k = 0; k < 5000; k++) { c.fillStyle = `rgba(30,25,60,${r() * .10})`; c.fillRect(r() * w, r() * h, 2, 2); }
  });
  wallTex.repeat.set(4, 2.4);
  scene.add(mesh(new THREE.BoxGeometry(9, 4.4, .10), toon('#ffffff', { map: wallTex }), [0, 1.78, -1.05]));
  // bàn
  const wood = toon('#ffffff', { map: TEX.wood() }); wood.map.repeat.set(1.6, 1);
  scene.add(mesh(rbox(1.90, .07, 1.05, .02), wood, [0, -.035, 0]));
  scene.add(mesh(rbox(1.90, .09, .04, .012), toon('#6b3d22'), [0, -.095, .51]));
  for (const x of [-.80, .80]) scene.add(mesh(rbox(.07, .34, .07, .015), wood, [x, -.25, .40]));
  // đồ ở xa: một chai, để có lớp sâu thứ ba
  const jar = new THREE.Group(); jar.position.set(1.20, 0, -.42);
  jar.add(mesh(new THREE.CylinderGeometry(.075, .075, .24, 20), toon('#3f7f8a'), [0, .12, 0]));
  jar.add(mesh(new THREE.CylinderGeometry(.055, .055, .04, 20), toon('#c9973a'), [0, .26, 0]));
  scene.add(jar);
  return { jar };
}

// ── N2 · nồi cơm bị cưa ngang ────────────────────────────────────────────
export function buildCatNgang() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#141229');
  scene.fog = new THREE.Fog('#1b1730', 3.2, 8);
  buildRoom(scene, 3);

  const dev = noiCatNgang(); dev.position.set(0, 0, 0); scene.add(dev);

  // nước và gạo trong nồi: đáy nồi → lớp nước → lớp gạo. Nước nằm sát đáy (đó là
  // chỗ đầu dò nhiệt chạm vào), lớp gạo nằm trên lớp nước.
  // Lớp gạo chỉ giữ nửa sau, đúng như mặt cắt của nồi, để nhìn xuống đáy nồi không bị che.
  const water = nuocNoi({ R: .138, r0: .132, bottom: .060, level: .118 });
  scene.add(water);
  const rice = lopGao({ R: .132, y: .118, h: .087, n: 900, seed: 7, half: true, gs: .85 });
  scene.add(rice);
  // lớp cơm khi nước đã cạn: thấp hơn, để trên thành nồi lộ ra vệt nước ở đúng
  // mực nước cũ. Lớp gạo đầy sẽ che mất vệt nước đó.
  const riceDry = lopGao({ R: .132, y: .060, h: .054, n: 420, seed: 7, half: true, gs: .85 });
  riceDry.visible = false;
  scene.add(riceDry);
  // vệt nước còn lại trên thành nồi, đúng ở mực nước cũ: câu "nó biết nước đã cạn".
  // Vệt là một dải ẩm dính trên thành: mép mờ dần, không phải một dải nâu sắc nét
  // như một mảng băng dán. Vân của tấm vệt chạy theo vòng: u là chiều dài dọc
  // theo vành nồi (hai đầu phải mờ dần), v là chiều quanh ống (hai mép mỏng).
  const wetTex = canvasTex(256, 64, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1);
      const edge = Math.min(1, Math.min(u, 1 - u) / .18);
      const a = Math.pow(edge, .65);
      for (let y = 0; y < h; y++) {
        const v = y / (h - 1);
        const b = Math.pow(Math.sin(Math.PI * v), .6);
        c.fillStyle = `rgba(125,107,74,${(.95 * a * b).toFixed(3)})`;
        c.fillRect(x, y, 1, 1);
      }
    }
  });
  const vethnuoc = mesh(new THREE.TorusGeometry(.1340, .0072, 10, 64, Math.PI),
    toon('#ffffff', { map: wetTex, transparent: true, depthWrite: false }), [0, .118, 0], { rot: [-Math.PI / 2, 0, 0] });
  // vệt ẩm không có viền mực: một dải nâu sắc nét trên thành trông như băng dán
  fxLayer(vethnuoc);
  vethnuoc.visible = false;
  scene.add(vethnuoc);
  // một hạt gạo bị cưa đôi, phóng to, đứng ở mặt cắt của lớp gạo ngay trên mực nước.
  // Chỉ hai câu cận hạt mới có mặt trong khung; ở những câu khác nó là một mảng trắng
  // lơ lửng không lý do.
  const grain = gachGaoCat({ scale: .85, grains: 40 }); grain.position.set(-.050, .1245, .004); grain.rotation.set(-.20, 0, .18);
  grain.visible = false;
  scene.add(grain);

  // nhiệt kế cắm trong lớp nước, đặt ngay trước mặt cắt để người xem đọc được
  // thang chia và cột thủy ngữ, chứ không mờ nhạt sau lớp nước. Đầu bọt nằm ngay
  // trên mặt đáy nồi (y = 60 mm), vạch một trăm độ ở y = 174 mm.
  const thermo = nhietKe({ scale: .62, length: .230 });
  thermo.position.set(.082, .081, .008);
  scene.add(thermo);

  // làn nhiệt: từ mâm nhiệt lên xuyên qua lớp nước rồi vào lớp gạo
  const heat = flow(new THREE.Vector3(.085, .045, .010),
    new THREE.Vector3(.085, .195, .012), { color: '#ff9a3c', size: .0034, lift: .02, n: 70, rate: .34, opacity: .34 });
  scene.add(heat);
  // dải sáng tín hiệu chạy dọc theo sợi dây, từ viên cầu xuống con chip.
  // Dải sáng phải bám đúng sợi dây: quỹ đạo nó cong lên cao thì thành một
  // đám sáng lơ lửng trên dây, người xem không thấy nó chạy trên dây. Hai đầu
  // của dải sáng lấy đúng từ hai đầu sợi dây trong `props/noi-cat-ngang.js`.
  const signal = flow(new THREE.Vector3(-.004, .052, -.004), new THREE.Vector3(-.088, .036, -.024),
    { color: '#8ef0ff', size: .0016, lift: .0006, n: 52, rate: .40, opacity: .78 });
  scene.add(signal);

  // nước bị hút vào hạt gạo: nước chạy vào hạt là thứ vô hình, nên nó thành
  // một dòng hạt nước chạy từ mặt nước lên hạt gạo (chỉ hiện ở câu c22)
  const absorb = flow(new THREE.Vector3(-.026, .113, .010), new THREE.Vector3(-.049, .1235, .006),
    { color: '#a8e6ff', size: .0014, lift: .001, n: 26, rate: .55, opacity: .85 });
  absorb.visible = false;
  scene.add(absorb);

  // cầu đo điện trở (chỉ lên hình ở một câu)
  const meter = cauDoDienTro(); meter.position.set(.34, .10, .28); meter.rotation.set(-.35, -.55, .12); meter.visible = false;
  scene.add(meter);

  // hơi nước bốc lên từ miệng nồi
  const steam = flow(new THREE.Vector3(0, .250, 0), new THREE.Vector3(0, .62, .02),
    { color: '#dff2ff', size: .010, lift: .08, n: 40, rate: .26, opacity: .20 });
  scene.add(steam);

  // ── ánh sáng: một vệt sáng ấm từ phía máy, viền tím phía sau ──
  const key = keyLight(scene, { from: new THREE.Vector3(1.5, 1.5, 1.4), to: new THREE.Vector3(0, .12, 0), color: '#ffd8a8', intensity: .55, size: 2.2, far: 12 });
  const amb = ambience(scene, { sky: '#5a6aa8', ground: '#2a1f38', fill: .40, rim: '#9a7bff', rimI: .85, rimFrom: [-2, 1.6, -2] });
  const spot = pool(scene, { from: new THREE.Vector3(.80, 1.15, 1.35), to: new THREE.Vector3(0, .10, 0), intensity: 1.5, angle: .50 });
  // đèn trong nồi: vỏ nồi chắn hết đèn ngoài, nên mặt cưa của lớp nước và lớp
  // gạo chỉ có ánh sáng môi trường — đọc ra là hai mảng màu phẳng, không bóng,
  // không khối, tức là một bức tranh. Đèn này soi vào mặt cưa từ phía máy quay,
  // và các nửa hạt gạo in bóng xuống mặt cưa.
  // Đèn phải xiên, không đánh thẳng vào mặt cưa: đèn thẳng làm mặt cưa sáng
  // đều, hạt gạo in bóng xuống không đủ rõ, và cả khung đọc ra như một bức
  // tranh 2D. Đèn từ trên-trái-phía máy quay nên hạt có bóng đổ sang phải.
  const inner = pool(scene, { from: new THREE.Vector3(-.28, .42, .42), to: new THREE.Vector3(-.02, .13, .00),
    color: '#ffeccf', intensity: .75, angle: .78, penumbra: .85 });
  // đèn nhỏ hắt vào bo mạch: khe dưới đáy nồi có mâm nhiệt che, không có đèn nào
  // soi xuống được, con chip sẽ thành một mảng đen
  const chipLight = new THREE.SpotLight('#ffe6c2', 0, .50, .60, .95, 1.5);
  chipLight.position.set(.020, .055, .095);
  chipLight.target.position.set(-.045, .030, -.045);
  scene.add(chipLight); scene.add(chipLight.target);

  const S = {
    scene, key, amb, spot, dev, water, rice, riceDry, grain, thermo, heat, signal, steam, meter, chipLight, vethnuoc, inner, absorb,
    focus: new THREE.Vector3(0, .12, 0),
    update: (t, o = {}) => {
      key.intensity = (o.dim ?? 1) * .55;
      amb.hemi.intensity = (o.dim ?? 1) * .40;
      spot.intensity = (o.dim ?? 1) * 1.5 * (o.focus ?? 1);
      inner.intensity = (o.dim ?? 1) * .75;
      water.update(t);
    },
  };
  return S;
}

// ── N3 · nồi cơm đời đầu bị cưa ngang ───────────────────────────────────
export function buildNoiCu() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#151227');
  scene.fog = new THREE.Fog('#1c1630', 3.2, 8);
  buildRoom(scene, 8);

  const old = noiCuCatNgang(); old.position.set(0, 0, 0); scene.add(old);

  const key = keyLight(scene, { from: new THREE.Vector3(1.4, 1.4, 1.3), to: new THREE.Vector3(0, .12, 0), color: '#ffd8a8', intensity: .5, size: 2.2, far: 12 });
  const amb = ambience(scene, { sky: '#5a6aa8', ground: '#2a1f38', fill: .38, rim: '#9a7bff', rimI: .80, rimFrom: [-2, 1.6, -2] });
  const spot = pool(scene, { from: new THREE.Vector3(.70, 1.00, 1.25), to: new THREE.Vector3(.02, .10, -.04), intensity: 1.4, angle: .46 });

  const S = {
    scene, key, amb, spot, old,
    focus: new THREE.Vector3(.02, .10, -.04),
    update: (t, o = {}) => {
      key.intensity = (o.dim ?? 1) * .5;
      amb.hemi.intensity = (o.dim ?? 1) * .38;
      spot.intensity = (o.dim ?? 1) * 1.4 * (o.focus ?? 1);
    },
  };
  return S;
}
