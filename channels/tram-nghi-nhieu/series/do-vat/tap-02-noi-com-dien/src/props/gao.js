// Hạt gạo: một hạt khô dài có nếp dọc ở bụng, một hạt bị cưa đôi để thấy tinh bột
// bên trong, và một lớp gạo trong nồi (lớp dày lên và trắng hơn khi chín).
import * as THREE from 'three';
import { toon, mesh, mulberry, clamp, canvasTex } from '../../../../../rig/kit.js';

// Kích thước thật của một hạt gạo khô: dài 7,6 mm, rộng 2,4 mm, dày 2,2 mm.
// Thân thuôn 3:1, hai đầu nhọn, mặt bụng dẹt có một nếp dọc (nếp gạo), mặt
// lưng tròn hơn.
const GRAIN = { L: .0076, W: .0024, H: .0022 };
// Hạt bị cưa đôi trong phim là một hạt phóng to: cùng một hình dáng, to hơn.
const GRAIN_BIG = { L: .0182, W: .0058, H: .0053 };

// ── vỏ trấu ──────────────────────────────────────────────────────────────
// Vỏ trấu không phải một mặt trơn: màu ngà hơi trong, vài vân mảnh chạy dọc
// theo thân hạt, xen vài mảng sáng và mảng nâu nhạt. Vân vẽ theo chiều ngang
// của tờ (tức là dọc theo hạt, vì trục u của tờ là chiều dài hạt).
let _huskTex = null, _huskMat = null;
function huskTex() {
  if (_huskTex) return _huskTex;
  _huskTex = canvasTex(512, 256, (g, w, h) => {
    const r = mulberry(19);
    g.fillStyle = '#e2d7bb'; g.fillRect(0, 0, w, h);
    // vân dọc của vỏ trấu
    for (let k = 0; k < 110; k++) {
      const y = r() * h;
      g.strokeStyle = `rgba(${142 + r() * 46 | 0},${122 + r() * 40 | 0},${82 + r() * 34 | 0},${.04 + r() * .12})`;
      g.lineWidth = .6 + r() * 1.8;
      g.beginPath(); g.moveTo(0, y);
      for (let x = 0; x <= w; x += 24) g.lineTo(x, y + Math.sin(x * .017 + k) * 2.2 + (r() - .5) * 1.4);
      g.stroke();
    }
    // mảng ngà sáng và nâu nhạt lốm đốm: vỏ trấu có mảng, không đều một màu
    for (let k = 0; k < 260; k++) {
      g.fillStyle = r() > .5
        ? `rgba(255,250,232,${.03 + r() * .09})`
        : `rgba(${126 + r() * 60 | 0},${108 + r() * 50 | 0},${72 + r() * 40 | 0},${.03 + r() * .08})`;
      g.beginPath(); g.ellipse(r() * w, r() * h, 5 + r() * 30, 2 + r() * 8, r() * 3, 0, 7); g.fill();
    }
  });
  return _huskTex;
}
// Bảng sáng riêng cho hạt. Bảng chung của kênh dốc nhẹ: mặt trên và mặt
// nghiêng của một hạt gần bằng nhau, hạt đọc ra là một hình phẳng có viền.
// Hạt gạo dùng bảng dốc hơn: mặt trên bắt sáng, mặt nghiêng và rãnh nếp rõ.
const GRAIN_GRAD = (() => {
  const steps = [.22, .40, .60, 1.0];
  const d = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => { const c = Math.round(v * 255); d.set([c, c, c, 255], i * 4); });
  const t = new THREE.DataTexture(d, steps.length, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
  return t;
})();

// Vật liệu của hạt: màu ngà hạ nhẹ (không trắng bệch — trắng bệch thì đỉnh
// cháy trắng, mất đường viền mực) và có vân của vỏ trấu.
function huskMat(color) {
  if (color) return toon(color, { grad: GRAIN_GRAD });
  if (!_huskMat) _huskMat = toon('#ffffff', { map: huskTex(), grad: GRAIN_GRAD });
  return _huskMat;
}

// đường viền thân hạt: siêu elip, hai đầu nhọn hơn elip thường
const PROF = 1.7;

// ── thân hạt gạo ─────────────────────────────────────────────────────────
// Một hạt gạo khô là một vật thể có khối: thân thuôn dài, hai đầu nhọn, bụng
// dẹt có một nếp dọc, lưng tròn. Dựng bằng lưới vòng dọc theo thân: mỗi vòng
// là một tiết diện elip, thu nhỏ dần về hai đầu, và bụng bị khía một rãnh dọc.
// `half` dựng nửa hạt bị cưa: mặt cắt ở z = 0 quay về phía máy quay (+z),
// thân hạt quay vào sau.
function grainGeo({ L = GRAIN.L, W = GRAIN.W, H = GRAIN.H, half = false, ns = 34, nr = 26, bulge = 0 } = {}) {
  const pos = [], uvs = [], idx = [];
  // đường viền thân: siêu elip, hai đầu nhọn hơn elip thường
  const prof = x => Math.pow(Math.max(0, 1 - Math.pow(Math.abs(x), PROF)), 1 / PROF);
  const j0 = half ? nr / 2 : 0;                 // nửa hạt: chỉ giữ nửa sau (z ≤ 0)
  const MF = half ? 6 : 0;                      // số cột của mặt cắt

  // tiết diện tại một vị trí dọc theo thân
  const ring = x => {
    const f = prof(x), w = W / 2 * f, h = H / 2 * f, pts = [];
    for (let j = 0; j <= nr; j++) {
      const a = -Math.PI / 2 + 2 * Math.PI * j / nr;
      const c = Math.cos(a), s = Math.sin(a);
      const n = s < 0 ? 2.4 : 2.0;              // bụng dẹt hơn, lưng tròn hơn
      const rr = Math.pow(Math.pow(Math.abs(c), n) + Math.pow(Math.abs(s), n), -1 / n);
      const u = rr * c;
      let v = rr * s;
      if (v < 0) v *= .90;                       // bụng dẹt
      let y = v * h, z = u * w;
      if (v < 0) {                               // nếp gạo: rãnh dọc ở giữa bụng
        const gr = Math.exp(-Math.pow(u / .40, 2)) * Math.min(1, -v / .30);
        y += .00048 * f * gr;
      }
      pts.push({ x: x * L / 2, y, z, u: (x + 1) / 2, v: j / nr });
    }
    return { f, w, h, pts };
  };
  const add = (p, u, v) => { pos.push(p.x, p.y, p.z); uvs.push(u, v); return pos.length / 3 - 1; };
  // quads của thân hạt: mặt nhìn ra ngoài
  const quad = (a, b, c, d) => { idx.push(a, c, b, b, c, d); };
  // quads của mặt cắt: chiều ngược lại, vì mặt cắt quay về phía máy quay
  const quadF = (a, b, c, d) => { idx.push(a, b, c, b, d, c); };

  const tipL = add({ x: -L / 2, y: 0, z: 0 }, 0, 0);
  const tipR = add({ x: L / 2, y: 0, z: 0 }, 1, 0);
  const rings = [];
  for (let i = 1; i <= ns; i++) {
    const x = -1 + 2 * i / (ns + 1);
    const r = ring(x);
    const base = pos.length / 3;
    for (let j = j0; j <= nr; j++) {
      const p = r.pts[j];
      add(p, p.u, p.v);
    }
    rings.push({ base, n: nr - j0 + 1, r, x });
  }
  // thân hạt
  for (let i = 0; i < rings.length - 1; i++) {
    const A = rings[i], B = rings[i + 1];
    for (let j = 0; j < A.n - 1; j++) quad(A.base + j, A.base + j + 1, B.base + j, B.base + j + 1);
  }
  // hai đầu nhọn
  const R0 = rings[0], RN = rings[rings.length - 1];
  for (let j = 0; j < R0.n - 1; j++) idx.push(tipL, R0.base + j, R0.base + j + 1);
  for (let j = 0; j < RN.n - 1; j++) idx.push(RN.base + j + 1, RN.base + j, tipR);

  // mặt cắt (nửa hạt): mặt phẳng z = 0, hơi lồi ở giữa để bắt sáng
  if (half) {
    const face = rings.map(R => {
      const top = R.base, bot = R.base + R.n - 1;
      const yT = R.r.pts[j0].y, yB = R.r.pts[nr].y;
      const col = [top];
      for (let s = 1; s < MF; s++) {
        const f = s / MF;
        const y = yT + (yB - yT) * f;
        const z = bulge * R.r.f * Math.sin(Math.PI * f);
        col.push(add({ x: R.r.pts[j0].x, y, z }, R.r.pts[j0].u, (j0 + (nr - j0) * f) / nr));
      }
      col.push(bot);
      return col;
    });
    for (let i = 0; i < face.length - 1; i++) {
      const A = face[i], B = face[i + 1];
      for (let s = 0; s < MF; s++) quadF(A[s], A[s + 1], B[s], B[s + 1]);
    }
    for (let s = 0; s < MF; s++) idx.push(tipL, face[0][s + 1], face[0][s]);
    for (let s = 0; s < MF; s++) idx.push(face[face.length - 1][s], face[face.length - 1][s + 1], tipR);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

// toạ độ trên mặt cắt của nửa hạt: dùng để đặt các đốm tinh bột
function faceZ(g, x, y) {
  const L = g.userData.L, H = g.userData.H, bulge = g.userData.bulge;
  const xn = Math.max(-1, Math.min(1, x / (L / 2)));
  const f = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(xn), PROF)), 1 / PROF);
  const h = H / 2 * f, yT = h * .90 * 0 + h, yB = -h * .90;
  const s = Math.max(0, Math.min(1, (y - yB) / Math.max(1e-6, yT - yB)));
  return bulge * f * Math.sin(Math.PI * s);
}

export function gachGao(opts = {}) {
  const g = new THREE.Group();
  const s = opts.scale || 1;
  // một hạt gạo khô: thân thuôn, hai đầu nhọn, nếp dọc ở bụng, vỏ trấu có vân
  const grain = mesh(grainGeo(), huskMat(opts.color), [0, 0, 0]);
  grain.scale.setScalar(s);
  grain.castShadow = true;
  grain.receiveShadow = true;
  g.add(grain);
  return g;
}

// một hạt bị cưa đôi: mặt cắt trắng, các tinh bột phình ra.
// Hạt được cưa theo chiều dài: mặt cắt là một mặt phẳng ở z = 0, quay về phía máy quay (+z).
// Mặt cắt là một mặt hơi lồi, không phải một đĩa phẳng, và các tinh bột là những núm
// nhỏ có khối, nên dưới đèn chính chúng bắt sáng và có bóng: đọc ra là một hạt gạo thật.
export function gachGaoCat(opts = {}) {
  const g = new THREE.Group();
  const s = opts.scale || 1;
  const geo = grainGeo({ ...GRAIN_BIG, half: true, bulge: .0012 });
  geo.userData = { L: GRAIN_BIG.L, H: GRAIN_BIG.H, bulge: .0012 };
  // hạt phải đổ bóng xuống mặt gạo: một hạt phẳng dán lên nền không có bóng
  // thì đọc ra là một hình vẽ, không phải một vật trong không gian
  const body = new THREE.Mesh(geo, huskMat());
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);
  // các tinh bột: những núm nhỏ trồi lên trên mặt cắt, màu trắng, to đủ để thấy.
  // Núm phải nằm đúng trên mặt cắt: mặt cắt cong nên độ cao mỗi núm tính theo
  // vị trí của nó, đặt cùng một độ cao thì núm ở rìa sẽ lơ lửng.
  const r = mulberry(4);
  const nGr = opts.grains ?? 44;
  for (let i = 0; i < nGr; i++) {
    const x = (r() - .5) * .0150, y = (r() - .5) * .0042;
    const z = faceZ(geo, x, y);
    const m = mesh(new THREE.SphereGeometry(.00055, 10, 8), toon('#f4e8ca'),
      [x, y, z + .0002], { cast: true });
    m.scale.z = .38;
    // núm tinh bột không có viền mực riêng: một núm trắng viền đậm đọc ra là một
    // viên sỏi trắng đặt trên hình, không phải tinh bột trong hạt gạo
    m.layers.set(1);
    g.add(m);
  }
  g.scale.setScalar(s);
  return g;
}

// Vân của một mớ cơm: vẽ sẵn hạt trên texture để mặt trên của lớp gạo trông như
// một mớ hạt dồn kín, chứ không phải một mặt trơn có vài hạt rơi vương trên.
// Hạt vẽ có chút sáng ở trên và bóng ở dưới để mớ cơm có khối, không phải
// một mảng trắng nhạt khi đèn trong nồi rọi vào.
function riceGrainTex(count = 1400, len = 20) {
  return canvasTex(1024, 1024, (g, w, h) => {
    const r = mulberry(23);
    // kẽ giữa các hạt phải đủ tối: mặt trên lớp gạo dưới đèn trong nồi thì
    // trắng bệch, đọc ra là một tấm đĩa trơn chứ không phải một mớ cơm.
    g.fillStyle = '#c3ad80'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < count; i++) {
      const x = r() * w, y = r() * h, a = r() * Math.PI, L = len + r() * len;
      g.save(); g.translate(x, y); g.rotate(a);
      g.fillStyle = 'rgba(112,90,55,.60)';                    // kẽ giữa các hạt
      g.beginPath(); g.ellipse(0, 0, L * .5, L * .17, 0, 0, 7); g.fill();
      g.fillStyle = r() > .5 ? '#f7eeda' : '#e6d5ad';          // thân hạt
      g.beginPath(); g.ellipse(0, 0, L * .5, L * .16, 0, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,252,240,.40)';                  // sáng trên hạt
      g.beginPath(); g.ellipse(-L * .06, -L * .05, L * .30, L * .08, 0, 0, 7); g.fill();
      g.strokeStyle = 'rgba(98,78,46,.60)'; g.lineWidth = 1.8; g.stroke();
      g.restore();
    }
  });
}

// Vân của mặt cắt: các hạt bị cưa, thấy hình bầu dục trắng nằm cạnh nhau.
// Vân vẽ trên một tờ đúng tỉ lệ với mặt cắt (rộng gấp 3 lần cao), nên hạt vẽ ra
// dài đúng bằng hạt gạo thật (~7 mm), không bị kéo giãn: `len` là chiều dài hạt
// tính bằng pixel trên tờ 2048×680 phủ 26,4 cm × 8,7 cm.
// Mỗi hạt có sáng ở trên và bóng ở dưới để đọc ra là hạt có khối, không phải
// một hình ellipse phẳng dán lên mặt.
function riceCutTex(count = 1400, len = 46, hpx = 680) {
  return canvasTex(2048, hpx, (g, w, h) => {
    const r = mulberry(31);
    g.fillStyle = '#b8a479'; g.fillRect(0, 0, w, h);                 // kẽ giữa các hạt
    for (let i = 0; i < count; i++) {
      const x = r() * w, y = r() * h, a = (r() - .5) * 1.1, L = len * (.7 + r() * .6);
      g.save(); g.translate(x, y); g.rotate(a);
      g.fillStyle = 'rgba(84,66,38,.55)';
      g.beginPath(); g.ellipse(1.2, 1.6, L * .5, L * .17, 0, 0, 7); g.fill();
      const grd = g.createLinearGradient(0, -L * .17, 0, L * .17);
      grd.addColorStop(0, '#fff8e6'); grd.addColorStop(.55, r() > .5 ? '#f2e7c8' : '#eadfc0');
      grd.addColorStop(1, '#cdbb93');
      g.fillStyle = grd;
      g.beginPath(); g.ellipse(0, 0, L * .5, L * .16, 0, 0, 7); g.fill();
      g.strokeStyle = 'rgba(104,84,50,.65)'; g.lineWidth = 1.6; g.stroke();
      g.restore();
    }
  });
}

// một lớp gạo trong nồi: nhiều hạt nằm chồng, co lại dần theo bán kính nồi.
// half: chỉ giữ nửa sau (z <= 0) để lớp gạo không che mặt cắt của nồi.
export function lopGao({ R = .130, y = 0, h = .055, n = 520, seed = 5, cooked = 0, half = false, gs = 1 } = {}) {
  const r = mulberry(seed);
  const g = new THREE.Group();

  // ── khối cơm: trụ có vai bo, đỉnh là một mặt tròn phẳng ──
  const prof = [];
  const N = 7;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    prof.push(new THREE.Vector2(R * (1 - .10 * u), h * .94 * u));
  }
  prof.push(new THREE.Vector2(R * .80, h), new THREE.Vector2(0, h));
  const coreMat = toon('#e6dcc2');
  const coreGeo = half
    ? new THREE.LatheGeometry(prof, 40, Math.PI / 2, Math.PI)
    : new THREE.LatheGeometry(prof, 40);
  const core = mesh(coreGeo, coreMat, [0, 0, 0], { parent: g });

  // mặt trên: một đĩa tròn có vân hạt, nằm trên đỉnh khối cơm
  //
  // Đĩa phải nằm đúng nửa sau (z < 0) như thân nồi bị cưa, và đúng chỗ các hạt
  // rời nằm. CircleGeometry quét góc trong mặt phẳng XY, rồi đĩa được xoay
  // -90° quanh trục X: toạ độ cục bộ y rơi thành toạ độ thế giới -z. Nửa sau
  // (z < 0) là nửa có sin y >= 0, tức góc từ 0 đến PI. Quét từ PI/2 như trước
  // đây thì đĩa nằm ở nửa TRÁI (x < 0) và tràn ra cả phía trước mặt phẳng
  // cưa: đọc ra như một cái đĩa đặt nghiêng lên lớp gạo.
  // Hạt trên mặt trên phải ra đúng cỡ thật (~7 mm): vân lặp quá dày thì hạt bé
  // như một vệt mịn, mặt lớp gạo đọc ra là một tấm đĩa trơn.
  const topTex = riceGrainTex(1400, 20); topTex.repeat.set(1.0, 1.0);
  const topGeo = half
    ? new THREE.CircleGeometry(R * .80, 40, 0, Math.PI)
    : new THREE.CircleGeometry(R * .80, 40);
  // màu vật liệu trắng: để vân hạt trên tấm thể hiện đúng màu đã vẽ, không bị
  // nhân thêm một lớp kem làm mặt trên thành một tấm đĩa trơn
  const top = mesh(topGeo, toon('#ffffff', { map: topTex }), [0, h + .0008, .0008], { parent: g });
  top.rotation.x = -Math.PI / 2;

  // ── mặt cắt của lớp gạo (nửa sau): từng hạt là một vật thể có khối ──
  // Mặt cưa không phải một tấm hình vẽ. Mỗi hạt gạo bị cưa là một nửa hạt
  // thật: một nửa ellipsoid có mặt cưa quay về phía máy quay, nằm sát nhau
  // trên một nền tối và đổ bóng lên nhau. Chính cái bóng giữa các hạt là thứ
  // phân biệt một mớ gạo thật với một bức tranh hạt vẽ trên giấy.
  // tờ vân phải đúng tỉ lệ với lớp gạo này: lớp cơm khô thấp hơn thì tờ vân
  // cũng thấp hơn, nếu không các hạt bị bóp dẹt, đọc ra là một mặt trơn
  const cutTex = riceCutTex(1400, 46, Math.max(140, Math.round(680 * h / .087)));
  cutTex.repeat.set(1, 1);
  if (half) {
    const shp = new THREE.Shape();
    shp.moveTo(prof[0].x, prof[0].y);
    for (const p of prof) shp.lineTo(p.x, p.y);
    for (let i = prof.length - 2; i >= 0; i--) shp.lineTo(-prof[i].x, prof[i].y);
    shp.lineTo(prof[0].x, prof[0].y);
    const cutGeo = new THREE.ShapeGeometry(shp);
    // toạ độ vân: u theo bề ngang, v theo chiều cao, để hạt vẽ ra đúng cỡ thật
    const P2 = cutGeo.attributes.position, UV = cutGeo.attributes.uv;
    for (let i = 0; i < P2.count; i++) {
      UV.setXY(i, (P2.getX(i) + R) / (2 * R), P2.getY(i) / h);
    }
    UV.needsUpdate = true;
    // nền sau các nửa hạt: một mặt tối, chỉ để các nửa hạt đổ bóng xuống
    const back = mesh(cutGeo, toon('#8a7952'), [0, 0, -.0048], { parent: g });
    back.receiveShadow = true;
    // mặt cưa vẽ bằng vân: dùng cho các khung rộng, khi hạt thật quá nhỏ mà
    // viền mực của chúng dính thành một mảng đen
    const cutFace = mesh(cutGeo, toon('#ffffff', { map: cutTex }), [0, 0, -.0012], { parent: g });
    cutFace.receiveShadow = true;

    // các nửa hạt: một nửa hạt kín (thân hạt + mặt cưa phẳng), thân quay vào
    // trong lớp gạo, mặt cưa quay về phía máy quay. Nửa hạt dùng đúng hình
    // dáng của hạt gạo, nên mặt cắt của lớp gạo đọc ra là những hạt gạo thật.
    const halfGeo = grainGeo({ ...GRAIN, half: true, ns: 12, nr: 12 });
    const cutMat = huskMat();
    // hạt phải kín kẽ: hạt nằm sát nhau như một mớ cơm, kẽ hở nhiều thì đọc ra
    // là những miếng bánh rời rạc trên một mặt nâu. Ô lưới phải nhỏ hơn hạt:
    // hạt dài 7,6 mm, nên một ô rộng 6 mm thì các hạt còn lấn vào nhau.
    const cols = 44, rows = 44;
    const cutIm = new THREE.InstancedMesh(halfGeo, cutMat, cols * rows);
    cutIm.castShadow = true; cutIm.receiveShadow = true; cutIm.frustumCulled = false;
    // nửa hạt phải nằm ở lớp 0: lớp 1 không được vẽ vào bản đồ bóng, hạt ở
    // lớp 1 thì không đổ bóng, mà bóng giữa các hạt mới là thứ cho ta biết đó
    // là một mớ cơm thật chứ không phải một bức tranh hạt vẽ
    g.add(cutIm);
    const cM = new THREE.Matrix4(), cP = new THREE.Vector3(), cQ = new THREE.Quaternion(),
      cS = new THREE.Vector3(), cE = new THREE.Euler();
    let ci = 0;
    for (let j = 0; j < rows; j++) {
      const yy = h * (j + .5) / rows;
      // bề rộng của lớp gạo ở cao độ này, theo đúng đường viền đã dựng
      const u = Math.min(1, yy / (h * .94));
      let w = R * (1 - .10 * u);
      if (yy > h * .94) w = R * (.90 - .10 * (1 - (yy - h * .94) / (h * .06)));
      for (let i = 0; i < cols; i++) {
        const xx = (-w + (i + .5) * (2 * w) / cols) + (r() - .5) * .0016;
        cP.set(xx, yy + (r() - .5) * .0012, .0004 + (r() - .5) * .0008);
        cE.set(0, 0, (r() - .5) * .38);
        cQ.setFromEuler(cE);
        cS.setScalar(gs);
        cM.compose(cP, cQ, cS);
        cutIm.setMatrixAt(ci++, cM);
      }
    }
    cutIm.count = ci;
    cutIm.instanceMatrix.needsUpdate = true;
    // hai kiểu mặt cưa: hạt thật khi máy vào sát, vân vẽ khi máy ở xa
    cutIm.visible = false;
    back.visible = false;
    g.setCutDetail = on => {
      cutIm.visible = !!on;
      back.visible = !!on;
      cutFace.visible = !on;
    };
  }

  // ── các hạt rời nằm trên mặt lớp gạo ──
  // Hạt nhỏ, nằm hơi chìm vào khối cơm và cùng màu với khối: mặt trên đọc ra là một
  // mớ cơm dồn nhẹ, không phải một hàng đá sỏi viền mực đậm.
  // Hạt phải nằm TRÊN mặt đĩa tròn (bán kính .80R), không phải chuim xuống dưới
  // nó: hạt chìm hơn thì bị đĩa che mất, mớ cơm trông như một mặt trơn.
  const geo = grainGeo({ ...GRAIN, ns: 12, nr: 12 });
  const mat = toon('#e6dcc2');
  const im = new THREE.InstancedMesh(geo, mat, n);
  // các hạt rời nằm trên lớp hiệu ứng: không có viền mực. Một hạt nhỏ có viền mực
  // riêng sẽ đọc ra thành một mớ nét đen, không phải một mớ cơm.
  // Hạt vẫn đổ bóng: mớ cơm trắng dưới nắng thì cháy trắng, chỉ có bóng của từng
  // hạt mới cho ta biết đó là những hạt gạo chứ không phải một khối bột.
  im.layers.set(1);
  im.castShadow = true;
  im.receiveShadow = false;
  g.add(im);
  const M = new THREE.Matrix4(), P = new THREE.Vector3(), Q = new THREE.Quaternion(), Sc = new THREE.Vector3(), E = new THREE.Euler();
  // chiều cao mặt trên theo bán kính, để hạt nằm đúng trên mặt khối cơm
  const topY = rad => (rad <= R * .80 ? h : h * .94 * Math.min(1, (1 - rad / R) / .10));
  const grains = [];
  for (let i = 0; i < n; i++) {
    const rad = Math.sqrt(r()) * R * .76, a = r() * Math.PI * 2;
    const x = Math.cos(a) * rad, z = Math.sin(a) * rad;
    if (half && z > 0) { i--; continue; }                 // chỉ rải ở nửa sau
    if (half && Math.abs(z) < .010) { i--; continue; }    // chừa mặt cắt cho tấm vân
    grains.push({ x, z, y: topY(rad) + .0012 * gs, rx: (r() - .5) * .9, ry: r() * 6, rz: (r() - .5) * .9, s: .75 + r() * .45 });
  }
  im.count = grains.length;
  const set = k => {
    const c = clamp(k);
    const sw = 1 + .12 * c;
    core.scale.y = sw;
    coreMat.color.set('#e6dcc2').lerp(new THREE.Color('#f7f0dc'), c);
    // lớp gạo tự phát sáng nhẹ: trong bóng của nồi, cơm vẫy phải trắng, nhưng
    // không được sáng tới mức cháy trắng, mất hết vân hạt
    const e = .02 + .05 * c;
    coreMat.emissive.setRGB(e * .82, e * .78, e * .66);
    top.material.emissive.setRGB(e * .82, e * .78, e * .66);
    mat.color.set('#e6dcc2').lerp(new THREE.Color('#f7f0dc'), c);
    mat.emissive.setRGB(e * .6, e * .58, e * .5);
    for (let i = 0; i < grains.length; i++) {
      const gr = grains[i];
      const sc = gr.s * (1 + .18 * c);
      P.set(gr.x, gr.y * sw, gr.z);
      E.set(gr.rx, gr.ry, gr.rz); Q.setFromEuler(E);
      Sc.setScalar(sc * gs);
      M.compose(P, Q, Sc);
      im.setMatrixAt(i, M);
    }
    im.instanceMatrix.needsUpdate = true;
  };
  set(cooked);
  g.setCooked = set;
  g.position.y = y;
  g.grains = im;
  g.top = top;
  return g;
}

// Danh mục cho thấy một nhóm hạt gạo rơi trên mặt bàn: một hạt to ở giữa, vài
// hạt nhỏ lệch quanh nằm nghiêng các hướng khác nhau. Một hạt đơn đứng một
// mình trên nền trơn sẽ chiếm trọn khung và đọc ra như một khối trắng vô danh;
// có vài hạt quanh thì người xem mới biết đó là hạt gạo, và so được tỉ lệ thật.
export const PROP = {
  name: 'hạt gạo',
  view: () => {
    const g = new THREE.Group();
    const r = mulberry(17);
    // đặt một hạt nằm trên mặt bàn: cao độ lấy theo chính hạt đó, để hạt nằm
    // sát mặt bàn chứ không chạm hoặc lơ lửng
    const place = (gr, x, z) => {
      gr.position.set(x, 0, z);
      g.add(gr);
      g.updateMatrixWorld(true);
      const b = new THREE.Box3().setFromObject(gr);
      gr.position.y -= b.min.y;
    };
    // Hạt được dựng to: một hạt gạo thật chỉ dài 7,6 mm, mà xưởng quay tự
    // đóng khung theo bán kính vật, nên một hạt nhỏ sẽ chỉ chiếm một vệt trắng
    // mỏng, không đọc ra là hạt. Dựng to không làm hạt nhỏ đi trong khung (máy
    // quay tự lùi xa theo kích thước), mà làm hạt đủ dày để đổ bóng xuống mặt
    // bàn — một hạt không có bóng đọc ra là một hình phẳng có viền.
    const K = 30;
    // hạt to ở giữa, nằm sấp mặt bụng xuống: hạt gạo khô thường nằm ngửa lưng
    const hero = gachGao({ scale: K });
    hero.rotation.set(.06, .45, .04);
    place(hero, 0, 0);
    // hạt thứ hai dựng nghiêng tựa vào hạt to: hạt đứng nghiêng mới thấy rõ
    // bụng cong, độ dày và nếp gạo ở mặt bụng — hạt nằm phẳng trên bàn thì
    // chỉ thấy một mặt trên, đọc ra là một vỏ trắng dẹt.
    const belly = gachGao({ scale: K * .85 });
    belly.rotation.set(1.05, -.8, .22);
    place(belly, .052, .030);
    // hạt nằm ngửa bụng lên: nếp gạo ở mặt bụng phải thấy được, không thì đặc
    // điểm của hạt gạo chỉ nằm trên giấy
    const flat = gachGao({ scale: K * .78 });
    flat.rotation.set(Math.PI + .08, -.55, .05);
    place(flat, -.118, .075);
    // vài hạt nhỏ lệch quanh, nằm nghiêng các hướng khác nhau
    const spots = [
      [.128, -.092, K * .72, 2.0, .06], [-.092, -.118, K * .66, 1.2, -.05],
    ];
    for (const [x, z, s, yaw, tilt] of spots) {
      const gr = gachGao({ scale: s });
      gr.rotation.set(tilt, yaw, tilt * .8);
      place(gr, x + (r() - .5) * .007, z + (r() - .5) * .007);
    }
    return g;
  },
};
