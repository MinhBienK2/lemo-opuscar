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
import { noiComDien, noiComDienCord } from './props/noi-com-dien.js';
import { noiComDoiDau, noiComDoiDauCord } from './props/noi-com-doi-dau.js';
import { noiCatNgang } from './props/noi-cat-ngang.js';
import { noiCuCatNgang } from './props/noi-cu-cat-ngang.js';
import { nhietKe } from './props/nhiet-ke.js';
import { cauDoDienTro } from './props/cau-do-dien-tro.js';
import { gachGao, gachGaoCat, lopGao } from './props/gao.js';
import { tuiGao } from './props/tui-gao.js';
import { batDongNuoc } from './props/bat-dong-nuoc.js';
import { nuocNoi } from './props/nuoc.js';

export const WIN = { x0: -1.62, x1: -0.34, y0: .78, y1: 1.98 };

// Mỗi vật tự lo chuyển động của nó: đặt `updateProp(t)` lên nhóm vật, bộ dựng
// gọi nó mỗi khung hình. Không cần ai biết vật nào đang chạy.
const tickAll = (scene, t) => {
  scene.traverse(o => { if (typeof o.updateProp === 'function') o.updateProp(t); });
};

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

  // ── vệt nắng trượt trên tường ──
  // Câu "đồng hồ trên tường thì cứ chạy": thời gian trôi phải nhìn thấy được,
  // chứ không chỉ là kim đồng hồ quay. Mặt trời dịch chuyển, vệt nắng chạy
  // ngang trên tường, ngay dưới mặt đồng hồ. Đèn nằm sau máy quay, không lọt
  // vào khung; vệt sáng phải trượt DƯỚI đồng hồ, không đè lên mặt đồng hồ,
  // không thì mặt đồng hồ cháy trắng và mất hết hai kim.
  const sunPatch = new THREE.SpotLight('#ffdcae', 0, 5.0, .105, .80, 1.1);
  sunPatch.position.set(1.10, 1.62, 1.45);
  sunPatch.target.position.set(1.10, 1.47, 0);
  scene.add(sunPatch); scene.add(sunPatch.target);

  // ── vật trên bàn ──
  const cooker = noiComDien(); cooker.position.set(-1.05, 0, .78); cooker.rotation.y = .28; scene.add(cooker);
  // Dây điện là phụ kiện của cảnh, không thuộc thân nồi: gắn vào nồi ở đây
  // để nó quay theo nồi, nhưng không kéo theo khung đo vật của bước chấm vật.
  cooker.add(noiComDienCord());
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
  old.add(noiComDoiDauCord());

  // thí nghiệm: hai nồi cưa ngang, một nhiều nước một ít nước
  const expA = noiCatNgang({ shell: '#e7e2d6' }); expA.position.set(.62, 0, .82); expA.visible = false; scene.add(expA);
  const expB = noiCatNgang({ shell: '#e7e2d6' }); expB.position.set(1.24, 0, .82); expB.visible = false; scene.add(expB);
  // nước trong hai nồi thí nghiệm
  const wA = nuocNoi({ R: .138, r0: .132, bottom: .060, level: .130 }); wA.position.set(.62, 0, .82); wA.visible = false; scene.add(wA);
  const wB = nuocNoi({ R: .138, r0: .132, bottom: .060, level: .100 }); wB.position.set(1.24, 0, .82); wB.visible = false; scene.add(wB);
  const tA = nhietKe({ scale: .52, length: .230 }); tA.position.set(.62 - .055, .078, .82 + .008); tA.visible = false; scene.add(tA);
  const tB = nhietKe({ scale: .52, length: .230 }); tB.position.set(1.24 - .055, .078, .82 + .008); tB.visible = false; scene.add(tB);

  // bát đong nước và túi gạo cạnh nồi (lời khuyên cuối tập). Bát xoay để mặt
  // có vạch chia và chữ số hướng về máy quay của câu cuối: câu "hãy xem lại
  // lượng nước bạn đã đổ" chỉ có nghĩa khi người xem thấy được vạch chia.
  const bowl = batDongNuoc(); bowl.position.set(-.30, 0, .44); bowl.rotation.y = -1.05; bowl.visible = false; scene.add(bowl);
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
    // vệt nắng trên tường: k = cường độ (0 = tắt), x = chỗ nó đang ở trên tường
    setSunPatch: (k, x) => {
      sunPatch.intensity = 7.0 * k;
      sunPatch.position.x = x;
      sunPatch.target.position.x = x;
    },
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
      tickAll(scene, t);
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
  // Lớp cơm cố định trong vật chỉ để vật đứng riêng vẫn đọc ra là nồi cơm bị
  // cưa; trong phim, bối cảnh dựng lớp cơm riêng (đội hình sôi, hạt nở, mực
  // nước), nên lớp cố định phải tắt — nồi trống ở câu "không còn gì để hấp
  // nhiệt nữa" phải là nồi trống thật.
  if (dev.riceStatic) dev.riceStatic.visible = false;

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
  const grain = gachGaoCat({ scale: .85, grains: 130 }); grain.position.set(-.050, .1245, .004); grain.rotation.set(-.20, 0, .18);
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
    new THREE.Vector3(.085, .195, .012), { color: '#ff9a3c', size: .006, lift: .02, n: 110, rate: .48, opacity: .55 });
  scene.add(heat);

  // ── dấu vết của câu: bọc lại các hàm mà phim gọi vào vật ──────────────
  // set.js không biết film.js đang kể câu nào, nhưng mỗi câu để lại một dấu
  // vết riêng trên chính vật: nhiệt kế nhảy vượt vạch sôi (c30, c31), dải sáng
  // bật trên dây (c32, c33), dây điện trở bắt đầu bật tắt (c34), nước sôi
  // (c18…c25), nồi cạn (c29). Bọc lại các hàm đó là set biết câu nào đang
  // kể mà không phải sửa film.js.
  let degNow = 100, heatK = .2, coilHidden = false, boilK = 0;
  const _setTemp = thermo.setTemp.bind(thermo);
  thermo.setTemp = d => { degNow = d; _setTemp(d); };
  const _setHeat = dev.setHeat.bind(dev);
  dev.setHeat = k => { heatK = k; _setHeat(k); };
  const _setCoil = dev.setCoil.bind(dev);
  // setCoil(v) = v là "hiện vòng dây điện trở"; ở c12, c13, c32 vòng dây bị
  // ẩn đi (che đúng hai sợi dây mảnh cần kể).
  dev.setCoil = v => { coilHidden = !v; _setCoil(v); };
  const _setBoil = water.setBoil.bind(water);
  water.setBoil = k => { boilK = k; _setBoil(k); };

  // ── vân mềm: đĩa sáng mờ, dùng cho gợn nóng, hơi, dải sáng ──────────
  // Mọi thứ vô hình trong tập này (nhiệt, hơi nước, dòng lăn trong nước,
  // ánh sáng tín hiệu) được vẽ bằng vật thể: một đám sáng có mềm viền. Không
  // có viền mực — chúng không phải vật thật, chỉ là cách vẽ một thứ vô hình.
  const softTex = canvasTex(128, 128, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(.32, 'rgba(255,255,255,.52)');
    g.addColorStop(.70, 'rgba(255,255,255,.13)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  });
  const softSprite = (color, size) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: softTex, color: new THREE.Color(color), transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    s.scale.set(size, size, 1);
    fxLayer(s);
    return s;
  };

  // dải sáng tín hiệu chạy dọc theo sợi dây, từ viên cầu xuống con chip.
  // Dải sáng phải bám đúng sợi dây: quỹ đạo nó cong lên cao thì thành một
  // đám sáng lơ lửng trên dây, người xem không thấy nó chạy trên dây. Nó chạy
  // đúng phần dây ở DƯỚI mâm nhiệt — phần dây đi qua lỗ mâm bị mâm che, có
  // sáng chạy cũng không ai thấy.
  //
  // Nay nó là một sợi sáng LIỀN chạy đúng đường của sợi dây, và một xung sáng
  // chạy dọc trên nó. Trước đây nó là một chuỗi hạt cầu lơ lửng lệch khỏi dây: câu
  // "dải sáng chạy trên hai dây" không có hình đúng để chỉ.
  //
  // Cả HAI dây đều phải có dải sáng: câu kể là "dải sáng chạy trên hai dây về
  // bo mạch", một dây thì người xem không thấy hai dây. Và xung sáng phải đi
  // theo đúng đường cong của sợi dây — không nối thẳng hai đầu bằng một cung
  // võng, vì cung võng đó bay lơ lửng giữa trời, không chạy trên dây.
  // Đường dây ở đây PHẢI Y HỆT đường dây thật trong props/noi-cat-ngang.js:
  // dải sáng bám trên sợi dây, lệch một ly là dải sáng bay lơ lửng. Hai dây
  // nay kết thúc ở chân cắm của con chip (x = -0,0735), nên dải sáng cũng
  // kết thúc ở đó.
  const wirePaths = [
    [[-.005, .0500, -.0030], [-.012, .0485, -.0105], [-.015, .0455, -.0125],
     [-.015, .0395, -.0125], [-.040, .0330, -.0180], [-.056, .0318, -.0212], [-.0735, .0307, -.0242]],
    [[.004, .0500, -.0040], [.006, .0485, -.0145], [.009, .0455, -.0165],
     [.009, .0395, -.0165], [-.030, .0330, -.0215], [-.054, .0315, -.0252], [-.0735, .0305, -.0287]],
  ];
  const wireCurves = wirePaths.map(p => new THREE.CatmullRomCurve3(p.map(v => new THREE.Vector3(...v))));
  const sigBands = wireCurves.map(c => {
    const b = new THREE.Mesh(new THREE.TubeGeometry(c, 48, .0013, 8),
      glowMat('#8ef0ff', 1.5, { transparent: true, opacity: .46, depthWrite: false }));
    fxLayer(b);
    return b;
  });
  const signal = new THREE.Group();
  signal.add(...sigBands);
  // Gói sáng chạy trên dây: một đám sáng to, đủ rõ để người xem thấy nó
  // CHẠY (một chấm sáng nhỏ thì không có nghĩa gì), và mờ dần ở hai đầu để
  // không bật lên giữa chừng. Đám sáng đi từ viên cầu xuống bo mạch: chiều
  // của dải sáng là chiều tín hiệu chạy về bo.
  const packets = [];
  for (const c of wireCurves) {
    for (let i = 0; i < 5; i++) {
      const s = softSprite('#bff4ff', .016);
      signal.add(s);
      packets.push({ s, c, u0: i / 5 });
    }
  }
  signal.update = (t) => {
    for (const P of packets) {
      const u = (t * .58 + P.u0) % 1;         // đi từ viên cầu (u=0) về chip (u=1)
      const k = ss(u / .10) * (1 - ss((u - .90) / .10));
      P.s.position.copy(P.c.getPoint(u));
      const s = .016 * (.55 + .45 * k);
      P.s.scale.set(s, s, 1);
      P.s.material.opacity = .60 * k;
      P.s.visible = k > .02;
    }
    // dải sáng trên dây thở theo nhịp tín hiệu: sáng mạnh lên rồi tụt
    const b = .40 + .22 * (0.5 + 0.5 * Math.sin(t * 3.4));
    for (const bd of sigBands) bd.material.opacity = b;
  };
  scene.add(signal);

  // ── giọt nước bị hút vào hạt gạo (chỉ câu c22) ─────────────────────────
  // Nước chạy vào hạt là thứ vô hình, nên nó phải có hình thì người xem mới
  // đọc ra được. Trước đây nó là một dòng bụp bông mềm (flow): ở khung cận
  // hạt, dòng ấy chỉ là một vệt trắng xoá nằm trên dải mặt nước — không có
  // hình khối nên không có viền mực, lại xoá mất các hạt tinh bột ở đó, nên
  // không đọc ra được nước đang thấm vào hạt.
  //
  // Nay nó là vài giọt nước THẬT: mỗi giọt có thân tròn và đuôi nhọn, dựng bằng
  // mesh trên lớp 0 nên có viền mực và có bóng đổ; giọt mọc ra ở mặt nước rồi
  // bị kéo vào thân hạt. Đuôi nhọn hướng về phía hạt nên chiều đi của giọt là
  // chiều nước đi vào hạt: đọc được một nhịp, không phải một vệt sáng.
  //
  // Giọt nằm SAU mặt cắt của hạt: nếu nó nổi trước mặt cắt thì nó đè lên các
  // hạt tinh bột — đúng lỗi cũ. Ở đây giọt chui vào mép bụng dưới của hạt rồi
  // mất hút sau đó, nên đọc ra là nước bị hút vào hạt, không phải một vệt sáng
  // nằm trên mặt hạt.
  //
  // Điểm cuối không ghim cứng: ở câu c22 hạt được hạ xuống sát mặt nước, nên
  // điểm chui vào hạt phải bám theo vị trí thật của hạt, tính lại mỗi khung.
  const ABS_START = new THREE.Vector3(-.0418, .1182, .0016);   // mặt nước, bên phải hạt
  const ABS_CTRL = new THREE.Vector3();
  const _entry = new THREE.Vector3();
  // điểm chui vào hạt, trong toạ độ cục bộ của hạt: x dọc theo chiều dài hạt,
  // y ở phía bụng dưới, z sau mặt cắt (tức là nằm trong thân hạt)
  //
  // Điểm này dịch sang phải 1 mm so với bụng giữa hạt: ở câu c21 (hạt nằm cao,
  // chưa chạm mặt nước) thẻ "HỒ HÓA 60 °C" và thẻ "NƯỚC HÚT VÀO HẠT" cùng
  // chỉ vào vùng bụng hạt, và nếu hai mũi tên gần nhau thì hai thẻ đè lên
  // nhau — người xem đọc được cái nào cũng không đọc trọn. Dời chỗ nước chui
  // vào sang chỗ khác trên cùng bụng hạt thì hai thẻ tách nhau, mà giọt nước,
  // gợn sóng và bọt vẫn bám đúng chỗ nước chui.
  const ENTRY_LOCAL = new THREE.Vector3(.0060, -.0009, -.0013);
  const bez = (u, out) => {
    const a = 1 - u;
    return out.set(
      a * a * ABS_START.x + 2 * u * a * ABS_CTRL.x + u * u * _entry.x,
      a * a * ABS_START.y + 2 * u * a * ABS_CTRL.y + u * u * _entry.y,
      a * a * ABS_START.z + 2 * u * a * ABS_CTRL.z + u * u * _entry.z);
  };
  // hình giọt: thân tròn ở sau, đuôi nhọn ở trước (đuôi là phần chui vào hạt)
  const dropProfile = [];
  for (let i = 0; i <= 10; i++) {
    const y = -1 + i / 10;
    dropProfile.push(new THREE.Vector2(Math.sqrt(Math.max(0, 1 - y * y)), y));
  }
  for (let i = 1; i <= 12; i++) {
    const u = i / 12;
    dropProfile.push(new THREE.Vector2((1 - u) * (1 - .28 * u), u * 1.25));
  }
  const dropGeo = new THREE.LatheGeometry(dropProfile, 18);
  const dropMat = toon('#6ec6e4', { emissive: '#0e3d52' });
  const absorb = new THREE.Group();
  const NDROP = 3, DROP_R = .0006;          // bán kính giọt ~ 1/13 chiều dài hạt
  const drops = [];
  for (let i = 0; i < NDROP; i++) {
    const d = mesh(dropGeo, dropMat);       // lớp 0: có viền mực, có bóng đổ
    d.castShadow = true; d.receiveShadow = false;
    absorb.add(d); drops.push(d);
  }
  absorb.visible = false;
  // điểm nước đi vào hạt: phim neo nhãn vào đúng chỗ này
  absorb.at = grain.localToWorld(ENTRY_LOCAL.clone());

  // ── gợn sóng và bọt ở vùng nước trong khung ───────────────────────────
  // Nửa dưới khung cận hạt là một mảng xanh ngọc phẳng trơn: không có nét nào
  // thì nó đọc ra là một tấm nhựa, không phải mặt nước. Vài cung mảnh mở ra từ
  // chỗ nước bị hút lan xuống dưới mực nước cho thấy nước đang động quanh điểm
  // nước chui vào hạt; thêm hai nhóm cung lệch sang trái để cả dải nước trong
  // khung có nét, chứ không chỉ một chỗ.
  // Cung nằm ngay trên mặt cắt của lớp nước (z ≈ 0), không bay trước mặt
  // nước: đọc ra là gợn sóng TRONG nước, không phải vòng khói trước mặt cắt.
  // Màu: xanh trung gian, đậm hơn nền nước ở đây (nền đã là xanh ngọc khá
  // sáng, vệt trắng trên đó chỉ là một vệt sáng loang) nhưng không để chạy
  // trắng; độ mờ vừa để nét còn đọc được mà không thành vệt sơn.
  const RIPPLE = [
    { dx: .0000, r: .0009, w: .55 }, { dx: .0000, r: .0017, w: .50 },
    { dx: .0000, r: .0027, w: .42 }, { dx: .0000, r: .0039, w: .30 },
    { dx: -.0130, r: .0012, w: .34 }, { dx: -.0130, r: .0024, w: .24 },
    { dx: -.0240, r: .0011, w: .26 }, { dx: -.0240, r: .0021, w: .18 },
  ];
  const ripples = [];
  for (const rp of RIPPLE) {
    const rg = new THREE.TorusGeometry(rp.r, .00009, 5, 40, Math.PI);
    rg.rotateZ(Math.PI);                    // nửa cung mở xuống dưới, không vượt mực nước
    const m = mesh(rg, toon('#54b3d4', { transparent: true, opacity: 0, depthWrite: false }));
    m.castShadow = false; m.receiveShadow = false;
    fxLayer(m);                            // gợn sóng mảnh: viền mực sẽ thành vệt đen
    m.userData.dx = rp.dx; m.userData.w = rp.w;
    absorb.add(m); ripples.push(m);
  }
  // bọt: vài bong bóng nhỏ dâng lên ở chỗ nước bị hút, ngay dưới mép bụng hạt
  const foams = [];
  for (let i = 0; i < 3; i++) {
    const m = mesh(new THREE.SphereGeometry(1, 10, 8),
      toon('#e8f8ff', { transparent: true, opacity: 0, depthWrite: false }));
    m.castShadow = false; m.receiveShadow = false;
    fxLayer(m);
    absorb.add(m); foams.push(m);
  }

  // ── chuyển động của cả nhóm ───────────────────────────────────────────
  // go: 0 = nước chưa tới đâu, 1 = nước đã chui hết vào hạt.
  const _pa = new THREE.Vector3(), _t1 = new THREE.Vector3(), _t2 = new THREE.Vector3();
  const _up = new THREE.Vector3(0, 1, 0), _qt = new THREE.Quaternion();
  absorb.update = (t, go) => {
    const reach = clamp(go);
    // điểm chui vào hạt bám theo vị trí thật của hạt (ở c22 hạt nằm sát mặt
    // nước, khác hẳn câu c21), nên phải tính lại chứ không ghim cứng
    grain.updateWorldMatrix(true, false);
    grain.localToWorld(_entry.copy(ENTRY_LOCAL));
    absorb.at.copy(_entry);
    // điểm điều khiển: võng nhẹ, giọt bay vênh vênh rồi mới chui vào hạt
    ABS_CTRL.copy(ABS_START).add(_entry).multiplyScalar(.5);
    ABS_CTRL.y += .0009;
    for (let i = 0; i < NDROP; i++) {
      const d = drops[i];
      const u = (t * .40 + i / NDROP) % 1;   // pha khác nhau, chạy lặp
      bez(u, _pa);
      d.position.copy(_pa);
      // hướng giọt: đuôi nhọn chỉ về phía hạt
      _t1.subVectors(ABS_CTRL, ABS_START).multiplyScalar(2 * (1 - u));
      _t2.subVectors(_entry, ABS_CTRL).multiplyScalar(2 * u);
      _t1.add(_t2).normalize();
      _qt.setFromUnitVectors(_up, _t1);
      d.quaternion.copy(_qt);
      // giọt mọc ra ở mặt nước, giữ nguyên cỡ khi tới hạt rồi mới bị thân hạt
      // nuốt mất sau mép bụng dưới
      const k = ss(u / .10) * (1 - ss((u - .92) / .08)) * (u <= reach ? 1 : 0);
      d.scale.setScalar(DROP_R * (.6 + .4 * ss(u / .3)) * k);
      d.visible = k > .02;
    }
    // gợn sóng: mở ra từ chỗ nước bị hút rồi mờ dần, mỗi cung lệch pha
    for (let i = 0; i < ripples.length; i++) {
      const m = ripples[i];
      const p = (t * .30 + i * .37) % 1;
      const s = .78 + .34 * p;              // cung to dần
      m.position.set(_entry.x + m.userData.dx, .1172, .0006);
      m.scale.set(s, s, 1);
      m.material.opacity = m.userData.w * ss(p / .12) * (1 - ss((p - .45) / .55));
      m.visible = m.material.opacity > .015;
    }
    // bọt: nổ lên rồi tan ở chỗ nước rời mặt nước
    for (let i = 0; i < foams.length; i++) {
      const m = foams[i];
      const p = (t * .80 + i / foams.length) % 1;
      const k = Math.sin(Math.PI * p);
      m.position.set(_entry.x - .0016 + (i - 1) * .0011, .1180 + p * .0012, .0016);
      m.scale.setScalar(.00018 * k);
      m.material.opacity = .60 * k;
      m.visible = k > .05;
    }
  };
  absorb.update(0, 1);                      // giọt phải có chỗ ngay từ lúc dựng
  scene.add(absorb);

  // ══ SÔI: dòng lăn trong lớp nước, bong bóng to, bọt ở vạch nước ══════
  // Mặt cắt của lớp nước là một mảng xanh phẳng trơn: đứng yên thì đọc ra
  // là một tấm nhựa dán, không phải nước. Nước sôi thì bên trong nó phải có
  // dòng lăn: các đám nước sáng lên rồi trôi lên, tắt dần. Đây là thứ động
  // nhiều nhất trong khung cận cảnh, và nó nằm đúng chỗ nước thật sự sôi:
  // trong lớp nước, ngay dưới vạch nước.
  const churn = new THREE.Group();
  scene.add(churn);
  const churnCells = [];
  for (let i = 0; i < 16; i++) {
    const s = softSprite('#c8f2ff', .032);
    churn.add(s);
    churnCells.push({
      s, r: .012 + (i % 6) * .0038, x0: (mulberry(i * 13 + 5)() - .5) * .185,
      ph: i * .618, rate: .85 + (i % 4) * .08,
    });
  }
  // ── bong bóng to dâng lên từ đáy nồi rồi vỡ ở mặt nước ───────────────
  // Bong bóng nước sôi phải TO và có viền mực (nó là vật thật, không phải thứ
  // vô hình): đó là cách đọc ra "nước đang sôi" ở một mặt cắt phẳng.
  const bubMat = toon('#eaf8ff', { emissive: new THREE.Color('#2c7fa0'), transparent: true, opacity: .92 });
  const bubbles = [];
  for (let i = 0; i < 9; i++) {
    const b = mesh(new THREE.SphereGeometry(1, 14, 10), bubMat, [0, 0, 0], { parent: churn, cast: false });
    bubbles.push({ b, x: (mulberry(i * 29 + 11)() - .5) * .175, life: i / 9, r: .0042 + (i % 3) * .0026 });
  }
  // ── bọt gom thành đống ở vạch nước ───────────────────────────────────
  // Vạch nước phải lăn: bọt gom lại thành đống rồi tan, đều đặn. Vạch nước
  // đứng thẳng là một đường kẻ, không phải mặt nước sôi.
  const foamMat = toon('#f4fcff', { emissive: new THREE.Color('#3f93b2') });
  const mounds = [];
  for (let i = 0; i < 7; i++) {
    const m = mesh(new THREE.SphereGeometry(1, 12, 8), foamMat, [0, 0, 0], { parent: churn, cast: false });
    mounds.push({ m, x: (i / 6 - .5) * .205, ph: i * .87 });
  }

  // ── gợn nóng quanh đỉnh cột thủy ngữ (c30, c31) ──────────────────────
  // Cột vượt vạch sôi là cột đang nóng hơn nước sôi: nhiệt phải bốc lên từ
  // đỉnh cột. Hai câu này là siêu cận cảnh của tấm thang chia, nên gợn nóng
  // quanh đỉnh cột là thứ chuyển động duy nhất trên màn hình.
  // Đỉnh cột ở 112 độ nằm ở toạ độ này (đã dính vào nhãn ĐỈNH CỘT).
  const HOTX = .0609, HOTY = .1867, HOTZ = .0154;
  const haze = new THREE.Group();
  scene.add(haze);
  const hazes = [];
  for (let i = 0; i < 6; i++) {
    const s = softSprite('#ff9a45', .018);
    haze.add(s);
    hazes.push({ s, ph: i / 6, r: .008 + (i % 3) * .004, rate: .50 + (i % 3) * .07 });
  }

  // ── gợn nóng bốc lên từ đáy nồi (c16, c17, c29, c33, c34) ───────────
  // Đáy nồi lúc này nóng hơn một trăm độ: không khí nóng quanh nó phải bốc
  // lên. Đây là thứ vô hình, nên nó là dòng đám sáng ấm trôi lên — thứ động
  // liên tục, đều đặn, suốt câu.
  const shimmer = new THREE.Group();
  scene.add(shimmer);
  const shims = [];
  for (let i = 0; i < 8; i++) {
    const s = softSprite('#ffcf9a', .07);
    shimmer.add(s);
    shims.push({
      s, x: (mulberry(i * 17 + 3)() - .5) * .12, ph: i / 8,
      r: .038 + (i % 3) * .013, rate: .46 + (i % 3) * .07,
    });
  }

  // ── ánh sáng của dây điện trở hắt vào trong nồi ─────────────────────
  // Dây điện trở đỏ lên thì nó hắt một vệt sáng ấm vào trong nồi: gạo và
  // thành nồi ấm lên. Khi nó tắt, vệt sáng ấm tắt theo. Ở câu "dây điện trở
  // tắt đi" và câu "nồi chuyển sang giữ ấm, bật tắt", đây là thứ động rõ
  // nhất trên màn hình.
  //
  // Đèn đặt hơi ra trước mặt cưa: nếu đặt đúng chỗ mâm nhiệt thì ánh sáng
  // của nó chỉ quét ngang mặt cưa (mặt cưa quay về phía máy quay), mà mặt
  // cưa của lớp gạo là thứ lớn nhất trong khung — đèn phải soi vào nó.
  const elementLight = new THREE.PointLight('#ff7a2a', 0, .26, 2);
  elementLight.position.set(0, .058, .040);
  scene.add(elementLight);

  // đồng hồ của set: khung trước, và hai mốc thời gian của sự kiện
  let lastT = 0, tOff = 0, tCycle = 0, lastCoil = null, lastHeatK = 0;

  // cầu đo điện trở (chỉ lên hình ở một câu)
  const meter = cauDoDienTro(); meter.position.set(.34, .10, .28); meter.rotation.set(-.35, -.55, .12); meter.visible = false;
  scene.add(meter);

  // hơi nước bốc lên từ mặt cơm
  // Hơi nước là thứ vô hình, nên nó phải có hình: một cột hơi mỏng bay lên
  // từ mặt cơm vào khoảng trống dưới nắp nồi. Trước đây cột hơi bắt đầu
  // cao hơn mặt cơm nhiều (nó bay từ trên miệng nồi), nên ở hai câu cận
  // cảnh nó trượt ra ngoài khung và không ai thấy. Nay nó bắt đầu ngay từ
  // mặt cơm, đúng chỗ hơi thật sự sinh ra, và đậm hơn: ở câu "nước sôi ở
  // khoảng một trăm độ" thì cả khoảng trống trong nồi phải động.
  const steam = flow(new THREE.Vector3(0, .214, 0), new THREE.Vector3(0, .58, .02),
    { color: '#dff2ff', size: .013, lift: .09, n: 70, rate: .26, opacity: .26 });
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
      const dt = Math.min(.05, Math.max(1 / 240, t - lastT));
      key.intensity = (o.dim ?? 1) * .55;
      amb.hemi.intensity = (o.dim ?? 1) * .40;
      spot.intensity = (o.dim ?? 1) * 1.5 * (o.focus ?? 1);
      inner.intensity = (o.dim ?? 1) * .75;
      water.update(t);
      tickAll(scene, t);

      // ── câu đang kể, đọc ra từ dấu vết của chính các vật ────────────
      const boiling = boilK > .5;                      // c18…c25: nước sôi
      const hot = degNow > 105;                        // c30, c31: cột vượt vạch
      const wireOn = signal.visible;                   // c32, c33: dải sáng trên dây
      const cooking = heatK > .9;                      // c16…c27: dây điện trở nóng
      const cycling = heatK > .4 && heatK < .9;         // c34: bật tắt giữ ấm
      let mode = 'idle';
      if (boiling) mode = 'boil';
      else if (hot) mode = 'hot';
      else if (wireOn && !coilHidden) mode = 'off';    // c33: dây điện trở tắt đi
      else if (wireOn) mode = 'sig';                   // c32: dải sáng chạy
      else if (cycling) mode = 'cycle';                // c34
      else if (cooking) mode = 'cook';                 // c16…c27
      else if (!water.visible && vethnuoc.visible && !riceDry.visible) mode = 'dry';  // c29: nồi cạn

      // thời điểm hai sự kiện, đọc từ chính các vật:
      // vòng dây điện trở hiện lại đúng lúc dây điện trở tắt đi (c33), và
      // dây điện trở bắt đầu bật tắt thì mâm nhiệt nóng lên (c34).
      if (lastCoil === true && !coilHidden) tOff = t;
      lastCoil = coilHidden;
      if (cycling && lastHeatK <= .4) tCycle = t;
      lastHeatK = heatK;

      // ── SÔI: dòng lăn, bong bóng, bọt ──────────────────────────────
      churn.visible = mode === 'boil';
      if (churn.visible) {
        for (const c of churnCells) {
          const p = (t * c.rate + c.ph) % 1;            // hành trình của một đám
          const s = c.r * (.65 + .55 * Math.sin(Math.PI * p));
          c.s.position.set(c.x0 + Math.sin(t * .8 + c.ph * 7) * .010, .0645 + p * .050, .0035);
          c.s.scale.set(s, s, 1);
          c.s.material.opacity = .13 * Math.sin(Math.PI * p);
        }
        for (const B of bubbles) {
          B.life += dt * .52;
          const p = B.life % 1;
          const rise = ss(p / .82);                     // dâng lên từ đáy nồi
          const pop = p > .82 ? 1 - ss((p - .82) / .18) : 1;   // vỡ ở mặt nước
          const k = ss(p / .06) * pop;
          B.b.position.set(B.x + Math.sin(t * 1.7 + B.life * 5) * .003, .0645 + rise * .050, .0035);
          B.b.scale.setScalar(B.r * (.35 + .65 * rise) * k);
          B.b.visible = k > .02;
        }
        for (const F of mounds) {
          const p = (t * .8 + F.ph) % 1;
          const k = .5 + .5 * Math.sin(Math.PI * p);
          F.m.position.set(F.x + Math.sin(t * .7 + F.ph) * .004, .1172 - .0014 * k, .0035);
          F.m.scale.set(.015 * k, .0048 * k, .007 * k);
        }
      }

      // ── gợn nóng quanh đỉnh cột thủy ngữ ───────────────────────────
      haze.visible = mode === 'hot';
      if (haze.visible) {
        for (const H of hazes) {
          const p = (t * H.rate + H.ph) % 1;
          const k = Math.sin(Math.PI * p);
          H.s.position.set(HOTX + Math.sin(p * 4 + H.ph * 6) * .006, HOTY + p * .028, HOTZ);
          const s = H.r * (.7 + .5 * k);
          H.s.scale.set(s, s, 1);
          H.s.material.opacity = .30 * k;
        }
      }

      // ── gợn nóng bốc lên từ đáy nồi ───────────────────────────────
      shimmer.visible = mode === 'dry' || mode === 'off' || mode === 'cycle' || mode === 'cook';
      if (shimmer.visible) {
        for (const S2 of shims) {
          const p = (t * S2.rate + S2.ph) % 1;
          const k = Math.sin(Math.PI * p);
          // hơi nóng đi từ đáy nồi lên, xuyên qua lớp gạo vào khoảng trống
          // dưới nắp: chỗ cuối cùng ấy tối, nên đám sáng trên nền tối đổi mạnh
          // — đó là chỗ động rõ nhất trong khung.
          S2.s.position.set(S2.x + Math.sin(p * 3.2 + S2.ph * 5) * .012, .055 + p * .245, .006);
          const s = S2.r * (.8 + .5 * k);
          S2.s.scale.set(s, s, 1);
          S2.s.material.opacity = .30 * k;
        }
      }

      // ── dây điện trở: nóng thì hắt sáng, tắt thì tối, giữ ấm thì bật tắt ──
      // Cường độ rất nhỏ: đèn nằm sát mâm nhiệt, cách lớp gạo chưa đầy một
      // gang tay, nên một chút sáng nữa là cả nồi cháy trắng — đó là đèn
      // nhấp nháy, không phải dây điện trở.
      let el = 0;
      if (mode === 'cook') el = .012 + .003 * Math.sin(t * 3.1);
      else if (mode === 'cycle') {
        // giữ ấm: dây điện trở bật tắt theo nhịp công tắc nhiệt
        const ph = (t - tCycle) * 1.35;
        el = .022 * (0.5 + 0.5 * Math.tanh(1.5 * Math.sin(ph * Math.PI * 2)));
      } else if (mode === 'off') {
        // dây điện trở tắt đi: vệt sáng ấm tắt hẳn trong nửa giây
        el = .022 * Math.max(0, 1 - (t - tOff) / .55);
      }
      elementLight.intensity = el;
      // làn nhiệt trong gạo bật tắt theo đúng nhịp của dây điện trở
      const heatMat = heat.children[0] && heat.children[0].material;
      if (heatMat) heatMat.opacity = mode === 'cycle' ? .55 * (.25 + .75 * el / .022) : .55;

      lastT = t;
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
  // Một vệt sáng nhỏ hắt thẳng vào cơ ở đáy nồi: cơ nằm sâu trong khoang
  // tối dưới mâm nhiệt, không có vệt sáng riêng thì hai đầu tiếp xúc chỉ là
  // hai cục tròn nhỏ, người xem không đọc ra là tiếp điểm.
  const cơ = pool(scene, { from: new THREE.Vector3(.14, .30, .34), to: new THREE.Vector3(.01, .028, -.068), intensity: 1.0, angle: .20 });

  const S = {
    scene, key, amb, spot, old,
    focus: new THREE.Vector3(.02, .10, -.04),
    update: (t, o = {}) => {
      key.intensity = (o.dim ?? 1) * .5;
      amb.hemi.intensity = (o.dim ?? 1) * .38;
      spot.intensity = (o.dim ?? 1) * 1.4 * (o.focus ?? 1);
      cơ.intensity = (o.dim ?? 1) * 1.0;
      tickAll(scene, t);
    },
  };
  return S;
}
