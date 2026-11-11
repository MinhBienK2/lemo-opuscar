// Hạt gạo khô: thân trụ tròn mập ở giữa, hai đầu khum tròn (không nhọn như
// lá), bụng dẹp có một khe nứt dọc chạy suốt thân, vỏ trấu có sợi mảnh
// chạy dọc và vài vệt nâu nhạt; một hạt bị cưa đôi để thấy tinh bột bên
// trong, và một lớp gạo trong nồi (lớp dày lên và trắng hơn khi chín).
import * as THREE from 'three';
import { toon, mesh, mulberry, clamp, canvasTex, fxLayer } from '../../../../../rig/kit.js';

// Kích thước thật của một hạt gạo khô: dài 7,6 mm, rộng 2,2 mm, dày 2,0 mm.
// Thân dài:rộng 3,5:1, tiết diện gần tròn, một đầu nhọn dần (đầu rễ) và
// một đầu bè (đầu tròn), mặt bụng dẹp có một khe nứt dọc (khe gạo), mặt
// lưng có một nếp lõm chạy dọc.
//
// Người chấm vòng 10 bảo rõ: "thân dài tỉ lệ dài:rộng khoảng 3.5:1, nhọn
// dần ở một đầu (rễ hột) và tròn ở đầu kia, mặt nhẵn bán trong màu kem
// trắng có rãnh dọc giữa lưng; vỏ trấu chỉ là lớp mỏng bọc hai đầu …
// bỏ hẳn dạng lát dẹt". Hạt đối xứng hai đầu đọc ra là một LÁT GỠ DẸT
// (coaster), không phải hạt gạo.
const GRAIN = { L: .0076, W: .00217, H: .00204 };
// Hạt bị cưa đôi trong phim là một hạt phóng to: cùng một hình dáng, to hơn.
const GRAIN_BIG = { L: .0182, W: .00520, H: .00489 };

// ── hình dáng thân hạt ─────────────────────────────────────────────────
// Hạt gạo KHÔNG phải một lá: hai đầu nhọn là dấu hiệu của lá. Hạt gạo là
// một thân mập ở giữa, thu dần về hai đầu, và mỗi đầu khum tròn chứ không
// nhọn. Người chưa từng thấy hạt gạo vẫn phải gọi đúng là "hạt gạo".
// P: độ thu dần. Q: độ tròn của đầu.
//   Q < 0.5 thì đầu nhọn (lá). Q = 0.5 thì đầu tròn như quả cầu. Q > 0.5
//   thì đầu càng nạt, mà vẫn tròn, không có điểm nhọn nào.
// Chọn P = 3.2, Q = 0.62: thân mập ở giữa rồi thu dần đều (hạt là một thon
// fusiform, không phải một ống trụ có hai nắp cầu — nắp cầu thì đọc ra là
// ốc sên).
//
// PROF_TIP_L / PROF_TIP_R: bề rộng còn lại ở hai đầu hạt. Hạt gạo KHÔNG
// có hai đầu giống nhau: một đầu (rễ hột) nhọn dần, một đầu (mũi hạt) bè.
// Nhọn dần ở MỘT đầu là dấu hiệu nhận ra hạt gạo; hạt đối xứng hai đầu
// đọc ra là một lát dẹt (lỗi của vòng 10). Cả hai đầu vẫn bo tròn, không
// có mũi nhọn như lá.
//   PROF_TIP_L = .10: đầu rễ còn 10% bề rộng, thu nhanh về một mặt tròn nhỏ.
//   PROF_TIP_R = .42: đầu mũi còn 42% bề rộng — bè, khum tròn.
const PROF_PL = 2.6;
const PROF_QL = .70;
const PROF_PR = 3.2;
const PROF_QR = .62;
const PROF_TIP_L = .10;
const PROF_TIP_R = .42;
// FLAT: bụng dẹp hơn lưng. Ép theo v² thì mép bụng nối vào hông mượt, không
// gặp — nếu dẹt bằng một hằng số, hông hạt có một nếp sắc chạy suốt thân.
const FLAT = .12;
// khe nứt dọc ở bụng: KHẮC VÀO trong (lõm xuống), không nhô lên như gân lá.
// Hẹp và nông: rộng thì bụng bị lõm hết và đọc ra là một sống nổi ở giữa.
const CRACK = .00016;
// nếp lõm ở sống lưng: cùng kiểu với khe bụng nhưng nông hơn một chút,
// và là dấu hiệu nhận ra hạt gạo khi nhìn từ trên xuống.
const CRACK_BACK = .00012;
// bề rộng khe, tính theo bán kính ngang của tiết diện
const CRACK_W = .32;

// đường viền dọc thân hạt ở toạ độ chuẩn hoá x ∈ [-1,1]: bằng 1 ở giữa hạt,
// bằng PROF_TIP_L ở đầu rễ (x = -1) và PROF_TIP_R ở đầu mũi (x = +1).
// Dùng chung cho thân hạt và cho mặt cắt, nên ranh giới mặt cắt tính được
// trùng với mặt thật.
function prof(x) {
  const ax = Math.min(1, Math.abs(x));
  if (x < 0) return PROF_TIP_L + (1 - PROF_TIP_L)
    * Math.pow(Math.max(0, 1 - Math.pow(ax, PROF_PL)), PROF_QL);
  return PROF_TIP_R + (1 - PROF_TIP_R)
    * Math.pow(Math.max(0, 1 - Math.pow(ax, PROF_PR)), PROF_QR);
}

// Các vị trí vòng dọc theo thân. Vòng lấy theo GÓC ở hai đầu, không lấy theo
// x: nếu chia đều theo x thì các vòng cuối dồn quanh đầu và đầu hạt thành
// một mũi nhọn — đúng cái lỗi của lá. Lấy x = sin(θ) thì các vòng dồn
// sát hai đầu, mà bán kính tiết diện vẫn vừa phải: đầu hạt khum tròn.
// Hai đầu không có vòng nào (bán kính bằng 0): đầu hạt là một đỉnh, khép
// bằng các mảng tam giác nhỏ quanh đỉnh đó.
function grainXs(ns) {
  const xs = [];
  for (let k = 0; k < ns; k++) {
    const x = Math.sin(Math.PI / 2 * k / ns);
    xs.push(x);
    if (x > 0) xs.push(-x);
  }
  xs.sort((p, q) => p - q);
  return xs;
}

// hàm nấc mềm: 0 dưới e0, 1 trên e1
const sstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// ── vỏ trấu ──────────────────────────────────────────────────────────────
// Vỏ trấu không phải một mặt trơn: màu ngà hơi trong, vài sợi mảnh chạy dọc
// theo thân hạt, xen vài mảng sáng và mảng nâu nhạt. Sợi KHÔNG được uốn
// lượn chậm: một sợi cong chậm quanh thân đọc ra là vân gỗ, không phải sợi
// trấu. Trục u của tờ vân là chiều dài hạt, nên sợi vẽ ngang tờ.
let _huskTex = null, _huskMat = null;
function huskTex() {
  if (_huskTex) return _huskTex;
  _huskTex = canvasTex(512, 256, (g, w, h) => {
    const r = mulberry(19);
    // THÂN hạt gạo là MÀU KEM TRẮNG bán trong, không phải nâu vỏ trấu: nền
    // vàng đậm (kiểu hạt mì) thì người xem gọi nhầm là hạt mì, không phải hạt
    // gạo — và mặt sườn của hạt thành một dải XÁM LẠNH (lỗi vòng 10).
    // Nền ấm sáng giữ được tông kem–nâu trấu ở cả mặt trên lẫn mặt sườn.
    g.fillStyle = '#ecdcb0'; g.fillRect(0, 0, w, h);
    // sáng dọc giữa thân (mặt lưng bắt sáng), hai mép tối hơn
    const gl = g.createLinearGradient(0, 0, 0, h);
    gl.addColorStop(0, 'rgba(176,148,96,.32)');
    gl.addColorStop(.5, 'rgba(255,250,232,.22)');
    gl.addColorStop(1, 'rgba(176,148,96,.32)');
    g.fillStyle = gl; g.fillRect(0, 0, w, h);
    // NẾP LÕM Ở SỐNG LƯNG (v = .5 là lưng): một dải tối MỀM chạy dọc, không
    // phải một nét thẳng — nét thẳng đọc ra là chỉ vẽ lên mặt. Thân hạt có
    // nếp lõm thật (hình học), vân ở đây chỉ để cái nếp ấy đọc ra.
    const nhip = g.createLinearGradient(0, h * .5 - 9, 0, h * .5 + 9);
    nhip.addColorStop(0, 'rgba(150,124,80,0)');
    nhip.addColorStop(.5, 'rgba(140,114,70,.42)');
    nhip.addColorStop(1, 'rgba(150,124,80,0)');
    g.fillStyle = nhip; g.fillRect(0, h * .5 - 9, w, 18);
    // VỎ TRẤU: chỉ là một lớp mỏng bọc HAI ĐẦU hạt, nên sợi trấu chỉ vẽ ở
    // hai đầu tờ vân (trục u của tờ là chiều dài hạt) và nhạt dần về giữa.
    // Sợi NGẮN, đứt quãng, dày mỏng không đều, nghiêng nhẹ: sợi dài đều tăm
    // tắp chạy song song là VÂN GỖ, đọc ra là lát gỗ dẹt (lỗi vòng 10).
    const fibres = (x0, x1, fade) => {
      for (let k = 0; k < 300; k++) {
        const y = r() * h;
        const x = x0 + r() * (x1 - x0);
        const len = 8 + r() * 40;
        const tone = 142 + r() * 62 | 0;
        const a = (.12 + r() * .26) * fade(x);
        if (a < .02) continue;
        g.strokeStyle = `rgba(${tone},${tone - 32},${tone - 74},${a})`;
        g.lineWidth = .4 + r() * 1.5;
        g.beginPath();
        g.moveTo(x, y);
        g.quadraticCurveTo(x + len * .5, y + (r() - .5) * 2.4,
          x + len, y + (r() - .5) * 4.2);
        g.stroke();
      }
    };
    fibres(0, w * .34, x => 1 - x / (w * .34));                 // đầu rễ
    fibres(w * .66, w, x => 1 - (w - x) / (w * .34));           // đầu mũi
    // vài gân vỏ dày hơn chạy dọc: sợi trấu xếp lớp, có sợi nổi lên — cũng
    // chỉ ở hai đầu, và ngắn hơn (một gân dài chạy suốt thân là vân gỗ).
    for (let k = 0; k < 22; k++) {
      const y = r() * h;
      const left = r() > .5;
      const x0 = left ? r() * w * .22 : w - r() * w * .22 - 70;
      const len = 40 + r() * 90;
      const grd = g.createLinearGradient(x0, 0, x0 + len, 0);
      grd.addColorStop(0, 'rgba(120,92,50,0)');
      grd.addColorStop(.5, `rgba(120,92,50,${.10 + r() * .10})`);
      grd.addColorStop(1, 'rgba(120,92,50,0)');
      g.fillStyle = grd;
      g.beginPath(); g.ellipse(x0 + len / 2, y, len / 2, 1 + r() * 2.4, 0, 0, 7); g.fill();
    }
    // mảng ngà sáng: vỏ trấu có mảng, không đều một màu
    for (let k = 0; k < 90; k++) {
      g.fillStyle = `rgba(255,250,232,${.03 + r() * .07})`;
      g.beginPath(); g.ellipse(r() * w, r() * h, 8 + r() * 34, 2 + r() * 7, 0, 0, 7); g.fill();
    }
    // vệt nâu nhạt loang DỌC theo vỏ — cũng chỉ ở hai đầu
    for (let k = 0; k < 16; k++) {
      const left = r() > .5;
      const x0 = left ? r() * w * .26 : w - r() * w * .26 - 60;
      const y = r() * h, len = 40 + r() * 90, th = 2 + r() * 5;
      const grd = g.createLinearGradient(x0, 0, x0 + len, 0);
      grd.addColorStop(0, 'rgba(136,98,48,0)');
      grd.addColorStop(.5, `rgba(136,98,48,${.07 + r() * .10})`);
      grd.addColorStop(1, 'rgba(136,98,48,0)');
      g.fillStyle = grd;
      g.beginPath(); g.ellipse(x0 + len / 2, y, len / 2, th, 0, 0, 7); g.fill();
    }
    // lấm tấm tối nhỏ trên vỏ
    for (let k = 0; k < 220; k++) {
      g.fillStyle = `rgba(104,76,34,${.05 + r() * .16})`;
      g.beginPath(); g.ellipse(r() * w, r() * h, .6 + r() * 1.9, .5 + r() * 1.2, 0, 0, 7); g.fill();
    }
  });
  return _huskTex;
}
// Bảng sáng riêng cho hạt gạo.
// Bảng chung của kênh chia 4 bậc đều cả vòng ngoài. Mà ánh sáng chính trong
// xưởng dọi từ trên xuống, nên mặt trên của một hạt chỉ nhận dotNL trong
// khoảng 0,54..0,72 — trọn trong MỘT bậc. Hạt đọc ra là một hình phẳng có
// viền, không phải một khối tròn: đo được 225..244 là toàn bộ mặt hạt.
// Bảng này dồn các bậc vào đúng khoảng sáng ấy: mặt trên của hạt phải có
// ba sắc, và mép hạt phải có sắc tối, để hạt là một khối có sắc.
function ramp(steps) {
  const N = 20;
  const d = new Uint8Array(N * 4);
  for (let k = 0; k < N; k++) {
    const dot = -1 + 2 * (k + .5) / N;        // dotNL ở giữa texel
    let v = steps[steps.length - 1][1];
    for (const [t, val] of steps) if (dot >= t) v = val;
    const c = Math.round(v * 255);
    d.set([c, c, c, 255], k * 4);
  }
  const t = new THREE.DataTexture(d, N, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
  return t;
}
const GRAIN_GRAD = ramp([
  [-1, .12], [.06, .18], [.14, .25], [.22, .33], [.30, .42],
  [.40, .54], [.50, .66], [.60, .80], [.70, .89], [.80, .96], [.90, 1.0],
]);
// Mặt cắt của hạt chủ đạo hướng thẳng về phía máy quay, nên nó không nhận
// được nhiều sáng như mặt trên: dùng một bảng sáng riêng, sáng hơn, để mặt
// cắt vẫn trắng và đọc ra là phần bên trong.
const CUT_GRAD = ramp([
  [-1, .34], [.10, .50], [.30, .64], [.45, .78],
  [.56, .90], [.66, .96], [.80, 1.0],
]);

// Vật liệu của hạt: màu ngà hạ nhẹ (không trắng bệch — trắng bệch thì đỉnh
// cháy trắng, mất đường viền mực) và có vân của vỏ trấu.
function huskMat(color) {
  if (color) return toon(color, { grad: GRAIN_GRAD });
  if (!_huskMat) _huskMat = toon('#ffffff', { map: huskTex(), grad: GRAIN_GRAD });
  return _huskMat;
}

// ── thân hạt gạo ─────────────────────────────────────────────────────────
// Một hạt gạo khô là một vật thể có khối: thân trụ tròn mập, hai đầu khum
// tròn, bụng dẹp có một khe nứt dọc, lưng tròn. Dựng bằng lưới vòng dọc
// theo thân: mỗi vòng là một tiết diện elip gần tròn, thu nhỏ dần về hai
// đầu theo vòng tròn, và bụng được khía một khe nứt dọc.
// `half` dựng nửa hạt bị cưa: mặt cắt ở z = 0 quay về phía máy quay (+z),
// thân hạt quay vào sau.
function grainGeo({ L = GRAIN.L, W = GRAIN.W, H = GRAIN.H, half = false, ns = 18, nr = 26, bulge = 0 } = {}) {
  const pos = [], uvs = [], idx = [];
  let faceStart = 0;                            // mặt cắt bắt đầu từ đâu trong bộ chỉ số
  const j0 = half ? nr / 2 : 0;                 // nửa hạt: chỉ giữ nửa sau (z ≤ 0)
  const MF = half ? 6 : 0;                      // số cột của mặt cắt

  // tiết diện tại một vị trí dọc theo thân
  const ring = x => {
    const f = prof(x), w = W / 2 * f, h = H / 2 * f, pts = [];
    // khe nứt chỉ chạy ở hai sĩnh giữa thân, không chạy tới hai đầu
    const env = 1 - sstep(.55, .88, Math.abs(x));
    for (let j = 0; j <= nr; j++) {
      const a = -Math.PI / 2 + 2 * Math.PI * j / nr;
      const c = Math.cos(a), s = Math.sin(a);
      const u = c, v = s;                        // tiết diện gần tròn
      let y = v * h, z = u * w;
      if (v < 0) {                               // bụng: dẹp hơn lưng
        y *= (1 - FLAT * v * v);
        // khe nứt dọc ở giữa bụng: KHẮC VÀO trong, không nhô lên. Nhân với -v
        // để khe mở ra ở hai bên hông và khép lại ở sống lưng — khe đúng là
        // khe của hạt gạo, một đường nứt ở giữa bụng.
        const cw = Math.exp(-Math.pow(u / CRACK_W, 2)) * (-v) * env;
        y += CRACK * f * cw;
      } else {
        // NẾP LÕM Ở SỐNG LƯNG: hạt gạo có một nếp lõm chạy dọc sống lưng, và
        // đây là dấu hiệu nhận ra hạt gạo khi nhìn TỪ TRÊN XUỐNG (bụng nằm
        // sát bàn, lưng quay lên). Nếp phải LÕM vào, không nổi lên: một gân
        // nổi ở giữa mặt là dấu hiệu của LÁ (lỗi vòng 8).
        const gw = Math.exp(-Math.pow(u / CRACK_W, 2)) * v * env;
        y -= CRACK_BACK * f * gw;
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
  for (const x of grainXs(ns)) {
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
  // hai đầu khum tròn: vòng cuối cùng khép với đỉnh ở hai đầu hạt
  const R0 = rings[0], RN = rings[rings.length - 1];
  for (let j = 0; j < R0.n - 1; j++) idx.push(tipL, R0.base + j, R0.base + j + 1);
  for (let j = 0; j < RN.n - 1; j++) idx.push(RN.base + j + 1, RN.base + j, tipR);

  // mặt cắt (nửa hạt): mặt phẳng z = 0, hơi lồi ở giữa để bắt sáng
  if (half) {
    faceStart = idx.length;
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
  // mặt cắt là một vật liệu riêng: bên trong hạt khác sắc với lớp gạo vốn,
  // để hạt chủ đạo không lẫn vào lớp gạo nền. Vật nào chỉ dùng một vật liệu
  // thì các nhóm này không có tác dụng.
  if (half) {
    geo.addGroup(0, faceStart, 0);
    geo.addGroup(faceStart, idx.length - faceStart, 1);
    // biên thật của mặt cắt: đường trên và đường dưới, lấy từ chính lưới đã
    // dựng. Núm tinh bột phải nằm trong mặt cắt thật, không nằm trong một mặt
    // phẳng tưởng tượng theo công thức.
    geo.userData.faceTop = [{ x: -L / 2, y: 0 },
      ...rings.map(R => ({ x: R.r.pts[j0].x, y: R.r.pts[j0].y })), { x: L / 2, y: 0 }];
    geo.userData.faceBot = [{ x: -L / 2, y: 0 },
      ...rings.map(R => ({ x: R.r.pts[nr].x, y: R.r.pts[nr].y })), { x: L / 2, y: 0 }];
  }
  geo.computeVertexNormals();
  return geo;
}

// ── mặt cắt của nửa hạt ────────────────────────────────────────────────
// Mặt cắt là mặt phẳng z = 0 của nửa hạt, hơi lồi về phía máy quay. Ở mỗi
// toạ độ x nó trải cao từ biên dưới (bụng dẹp, có khe nứt khắc vào) tới
// sống lưng trên cùng. Các hàm dưới đây lấy biên từ chính lưới đã dựng,
// nên mặt cắt tính được trùng với mặt thật: một núm đặt theo đây là nằm
// trên mặt thật, không phải trên một mặt phẳng tưởng tượng.
function edgeY(poly, x) {
  if (x <= poly[0].x) return poly[0].y;
  if (x >= poly[poly.length - 1].x) return poly[poly.length - 1].y;
  for (let i = 0; i < poly.length - 1; i++) {
    if (x <= poly[i + 1].x) {
      const t = (x - poly[i].x) / (poly[i + 1].x - poly[i].x);
      return poly[i].y + (poly[i + 1].y - poly[i].y) * t;
    }
  }
  return poly[poly.length - 1].y;
}
// chiều cao nửa trên của mặt cắt tại toạ độ x
function cutTop(g, x) { return edgeY(g.userData.faceTop, x); }
// biên dưới của mặt cắt: bụng dẹp, có khe nứt khắc vào
function cutBot(g, x) { return edgeY(g.userData.faceBot, x); }
// độ cao của mặt cắt tại (x, y): mặt cắt lồi, nên mỗi núm phải đặt theo
// độ cao riêng; đặt chung một độ cao thì núm ở rìa sẽ lơ lửng.
function faceZ(g, x, y) {
  const bulge = g.userData.bulge;
  const yT = cutTop(g, x), yB = cutBot(g, x);
  const s = Math.max(0, Math.min(1, (y - yB) / Math.max(1e-6, yT - yB)));
  const xn = Math.max(-1, Math.min(1, x / (g.userData.L / 2)));
  return bulge * prof(xn) * Math.sin(Math.PI * s);
}
// pháp tuyến của mặt cắt tại (x, y): mặt cắt cong, núm phải nghiêng theo
// pháp tuyến ở chỗ nó nằm, nếu không núm một bên chìm một bên thò ra
function faceNormal(g, x, y) {
  const e = 1e-4;
  const dx = (faceZ(g, x + e, y) - faceZ(g, x - e, y)) / (2 * e);
  const dy = (faceZ(g, x, y + e) - faceZ(g, x, y - e)) / (2 * e);
  return new THREE.Vector3(-dx, -dy, 1).normalize();
}

// ── vân của mặt cắt hạt chủ đạo ─────────────────────────────────────────
// Mặt cắt là phần bên trong hạt: tinh bột trắng ngà, lấm tấm thành hạt nhỏ,
// sát mép vỏ thì tối hơn vì vỏ che bóng. Tông vân lạnh và đục hơn lớp gạo
// nền (lớp gạo ấm và sáng), để hạt được chọn phải tách ra được.
let _cutTex = null;
function cutFaceTex() {
  if (_cutTex) return _cutTex;
  _cutTex = canvasTex(512, 256, (g, w, h) => {
    const r = mulberry(27);
    // Bên trong hạt gạo: lớp tinh bột TRẮNG, sáng hơn hẳn vỏ trấu. Mặt cắt
    // phải sáng hơn vỏ, thì người xem mới hiểu đây là phần BÊN TRONG, chứ
    // không phải một hạt trắng khác nằm cạnh.
    //
    // Nhưng trắng quá thì mặt cắt trùng tông nền giấy của xưởng quay
    // (243,226,200) và hạt biến mất — người chấm đo được mặt hạt kem là
    // (255,244,211), gần như bằng nền. Nên tinh bột ở đây là TRẮNG NGÀ ẤM,
    // tối hơn nền, và sáng hơn vỏ trấu: vẫn là phần bên trong, nhưng tách
    // được khỏi nền.
    g.fillStyle = '#e6d7b4'; g.fillRect(0, 0, w, h);
    // các mảng tinh bột to nhỏ, không đều
    for (let k = 0; k < 620; k++) {
      g.fillStyle = r() > .5
        ? `rgba(255,250,236,${.05 + r() * .14})`
        : `rgba(150,134,100,${.03 + r() * .08})`;
      g.beginPath(); g.ellipse(r() * w, r() * h, 4 + r() * 26, 3 + r() * 12, r() * 3, 0, 7); g.fill();
    }
    // hạt tinh bột: những chấm nhỏ rải rác trên mặt cắt
    for (let k = 0; k < 1100; k++) {
      g.fillStyle = `rgba(255,252,240,${.08 + r() * .22})`;
      g.beginPath(); g.ellipse(r() * w, r() * h, .9 + r() * 2, .8 + r() * 1.5, 0, 0, 7); g.fill();
    }
    // SỢI VỎ TRẤU Ở HAI MÉP DỌC: hạt bị cưa đôi thì hai mép dọc của mặt cắt
    // là lớp vỏ, phải thấy rõ một dải vàng chạy suốt chiều dài. Không có
    // dải này thì mặt cắt đọc ra là một hạt trắng nằm cạnh, không ai tin là
    // hạt gạo bị cưa.
    const rim = Math.round(h * .085);
    for (const y0 of [0, h - rim]) {
      const grd = g.createLinearGradient(0, y0, 0, y0 + rim);
      grd.addColorStop(0, 'rgba(150,116,62,.95)');
      grd.addColorStop(.55, 'rgba(186,152,92,.75)');
      grd.addColorStop(1, 'rgba(186,152,92,0)');
      g.fillStyle = grd; g.fillRect(0, y0, w, rim);
      // sợi trong lớp vỏ, chạy dọc theo chiều dài hạt
      for (let k = 0; k < 90; k++) {
        const x = r() * w;
        g.strokeStyle = `rgba(120,88,42,${.10 + r() * .22})`;
        g.lineWidth = .6 + r() * 1.2;
        g.beginPath(); g.moveTo(x, y0); g.lineTo(x + (r() - .5) * 20, y0 + rim); g.stroke();
      }
    }
    // đường viền sắc nét ở hai mép: mép vỏ cắt là một cạnh sắc
    g.fillStyle = 'rgba(96,68,30,.55)';
    g.fillRect(0, 0, w, 2); g.fillRect(0, h - 2, w, 2);
  });
  // mặt cắt dùng đúng nửa trên của tờ vân (uv v chạy từ .5 ở sống lưng tới 1
  // ở mép bụng), nên vân phải trải hết tờ
  _cutTex.repeat.set(1, 2); _cutTex.offset.set(0, -1);
  return _cutTex;
}

export function gachGao(opts = {}) {
  const g = new THREE.Group();
  const s = opts.scale || 1;
  // một hạt gạo khô: thân trụ tròn mập, hai đầu khum tròn, bụng có khe nứt
  // dọc, vỏ trấu có sợi chạy dọc
  const grain = mesh(grainGeo(), huskMat(opts.color), [0, 0, 0]);
  grain.scale.setScalar(s);
  grain.castShadow = true;
  grain.receiveShadow = true;
  // roll: lăn quanh trục dài của hạt (bụng lên / bụng xuống); yaw: xoay
  // trong mặt bàn. Hai phép này đặt ở hai cấp khác nhau (lưới con và nhóm),
  // nên không lẫn vào nhau.
  if (opts.roll) grain.rotation.x = opts.roll;
  if (opts.yaw) g.rotation.y = opts.yaw;
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
  geo.userData = { ...geo.userData, L: GRAIN_BIG.L, H: GRAIN_BIG.H, bulge: .0012 };
  // hạt phải đổ bóng xuống mặt gạo: một hạt phẳng dán lên nền không có bóng
  // thì đọc ra là một hình vẽ, không phải một vật trong không gian
  // hai vật liệu: vỏ trấu cho thân hạt, bên trong cho mặt cắt
  const body = new THREE.Mesh(geo, [huskMat(), toon('#ffffff', { map: cutFaceTex(), grad: CUT_GRAD })]);
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);
  // các tinh bột: những núm nhỏ trồi lên trên mặt cắt, màu trắng, to đủ để thấy.
  // Núm phải nằm đúng trên mặt cắt: mặt cắt cong nên độ cao mỗi núm tính theo
  // vị trí của nó, đặt cùng một độ cao thì núm ở rìa sẽ lơ lửng.
  //
  // Và núm phải nằm TRONG mặt cắt. Mặt cắt thu nhỏ dần về hai đầu: ở rìa
  // nó chỉ còn một dải hẹp, nên núm rải tự do sẽ trôi ra ngoài viền hạt và
  // đọc ra như mảng lơ lửng trên nền. Nên mỗi núm phải nằm trọn trong mặt
  // cắt: cả đĩa của núm, kể cả ở hai mép của đĩa, không được chạm ra ngoài.
  const r = mulberry(4);
  const nGr = opts.grains ?? 150;
  // Núm tinh bột là hạt bột nhỏ, KHÔNG phải quả bóng. Bán kính 0,55 mm trên
  // mặt cắt rộng 5,8 mm là những quả trắng to bằng một phần năm bề ngang:
  // cả mặt cắt thành một ổ trứng, đọc ra là sâu hay ốc, không phải hạt gạo.
  // Núm phải nhỏ như hạt bột (0,16 mm) và dẹp, để mặt cắt đọc ra là một mặt
  // bột trắng có lốm đốm chứ không phải một đàn quả.
  const RAD = .00016;                 // bán kính núm
  const LE = .00006;                  // lề: núm không áp sát mép mặt cắt
  const L = GRAIN_BIG.L;
  // khoảng cao cho phép của tâm núm tại toạ độ x: giữa hai mép mặt cắt
  const topEdge = geo.userData.faceTop, botEdge = geo.userData.faceBot;
  const band = x => {
    const yT = edgeY(topEdge, x), yB = edgeY(botEdge, x);
    return [yB, yT];
  };
  // núm có nằm trọn trong mặt cắt không: đĩa của núm phải nằm trong mặt cắt ở
  // mọi cắt ngang qua nó, kể cả ở hai mép của đĩa
  const fits = (x, y) => {
    for (let k = 0; k <= 8; k++) {
      const dx = -RAD + 2 * RAD * k / 8;
      const xx = x + dx;
      if (xx <= -L / 2 || xx >= L / 2) return false;
      const dy = Math.sqrt(Math.max(0, RAD * RAD - dx * dx));
      if (y + dy > edgeY(topEdge, xx) - LE) return false;
      if (y - dy < edgeY(botEdge, xx) + LE) return false;
    }
    return true;
  };
  // rải núm: núm không chồng nhau, chồng thành một vùng trắng thì không đọc
  // ra là tinh bột nữa
  const pts = [];
  const SEP = RAD * 2.4;
  let guard = 0;
  while (pts.length < nGr && guard < nGr * 80) {
    guard++;
    const x = (r() - .5) * (L - 2 * RAD);
    const [B, T] = band(x);
    if (T - B <= 2 * RAD) continue;      // mặt cắt chỗ này quá hẹp, không đủ chỗ
    const y = B + r() * (T - B);
    if (!fits(x, y)) continue;
    let ok = true;
    for (const p of pts) if ((p.x - x) ** 2 + (p.y - y) ** 2 < SEP * SEP) { ok = false; break; }
    if (!ok) continue;
    pts.push({ x, y });
  }
  // chỗ còn thiếu: rải vào chỗ trống nhất, núm sát nhau vẫn đọc ra là tinh bột
  while (pts.length < nGr) {
    let best = null, bestD = -1;
    for (let k = 0; k < 80; k++) {
      const x = (r() - .5) * (L - 2 * RAD);
      const [B, T] = band(x);
      if (T - B <= 2 * RAD) continue;
      const y = B + r() * (T - B);
      if (!fits(x, y)) continue;
      let d = Infinity;
      for (const p of pts) d = Math.min(d, (p.x - x) ** 2 + (p.y - y) ** 2);
      if (d > bestD) { bestD = d; best = { x, y }; }
    }
    if (!best) break;
    pts.push(best);
  }
  const numGeo = new THREE.SphereGeometry(1, 12, 8);
  for (const p of pts) {
    const nrm = faceNormal(geo, p.x, p.y);
    const rr = RAD * (.78 + r() * .22);       // núm to vừa, không đều như máy
    const z = faceZ(geo, p.x, p.y);
    const m = mesh(numGeo, toon('#f8efd8'),
      [p.x + nrm.x * rr * .15, p.y + nrm.y * rr * .15, z + nrm.z * rr * .15], { cast: true });
    // núm là một núm nhỏ nằm trên mặt cắt, không phải một quả cầu đặt trên:
    // dẹp theo pháp tuyến của mặt cắt và chìm một chút vào trong
    m.scale.set(rr, rr, rr * .40);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nrm);
    // núm tinh bột không có viền mực riêng: một núm trắng viền đậm đọc ra là một
    // viên sỏi trắng đặt trên hình, không phải tinh bột trong hạt gạo
    m.layers.set(1);
    g.add(m);
  }
  g.scale.setScalar(s);
  return g;
}

// Hình một hạt gạo trong vân: thân trụ, hai đầu khum tròn (KHÔNG phải lá
// nhọn, không phải hình ellipse).
// Hình một hạt gạo vẽ tay, đúng dáng với thân hạt dựng 3D: thân mập ở giữa,
// thu dần về hai đầu, mỗi đầu hơi cắt chứ không nhọn. Vẽ bằng hình capsule
// (hai đầu tròn trọn, thân đều) thì hạt đọc ra là VIÊN THUỐC, không phải gạo.
function riceShape(g, L, W) {
  const h = L / 2, r = W / 2, N = 18;
  const prof = t => r * (.20 + .80 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * t - 1), 2.6)), .62));
  g.beginPath();
  for (let i = 0; i <= N; i++) {
    const t = i / N, x = -h + t * L, y = -prof(t);
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  for (let i = N; i >= 0; i--) {
    const t = i / N, x = -h + t * L;
    g.lineTo(x, prof(t));
  }
  g.closePath();
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
      riceShape(g, L * 1.04, L * .36); g.fill();
      g.fillStyle = r() > .5 ? '#f7eeda' : '#e6d5ad';          // thân hạt
      riceShape(g, L, L * .32); g.fill();
      g.fillStyle = 'rgba(255,252,240,.40)';                  // sáng trên hạt
      g.beginPath(); g.ellipse(-L * .06, -L * .05, L * .30, L * .07, 0, 0, 7); g.fill();
      g.strokeStyle = 'rgba(98,78,46,.60)'; g.lineWidth = 1.8; g.stroke();
      // rãnh dọc: nét mảnh chạy dọc thân hạt, đúng dấu hiệu của hạt gạo
      g.strokeStyle = 'rgba(120,98,62,.42)'; g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(-L * .40, 0); g.lineTo(L * .40, 0); g.stroke();
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
      riceShape(g, L * 1.05, L * .38); g.fill();
      const grd = g.createLinearGradient(0, -L * .17, 0, L * .17);
      grd.addColorStop(0, '#fff8e6'); grd.addColorStop(.55, r() > .5 ? '#f2e7c8' : '#eadfc0');
      grd.addColorStop(1, '#cdbb93');
      g.fillStyle = grd;
      riceShape(g, L, L * .33); g.fill();
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
    const halfGeo = grainGeo({ ...GRAIN, half: true, ns: 9, nr: 12 });
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
  const geo = grainGeo({ ...GRAIN, ns: 9, nr: 12 });
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

// Danh mục cho thấy ba hạt gạo rơi trên mặt bàn: hai hạt nguyên nằm rời
// nhau, một hạt nằm ngửa bụng để lộ khe nứt dọc, một hạt bị cưa đôi để thấy
// lớp tinh bột bên trong. Cụm phải GỌN: xưởng quay tự lùi xa theo bán kính
// cụm vật, nên cụm rộng thì mỗi hạt chỉ còn vài chục px và đọc ra là mấy vệt
// lá chứ không phải là hạt gạo.
// Vệt bóng tiếp xúc dưới chân hạt. Đèn xưởng dọi từ trên xuống, nên bóng
// đổ thật của một hạt nằm sát bàn bị GIẤU hẳn dưới thân hạt: nhìn từ trên
// xuống chỉ thấy nền trơn, và hạt như dán lên giấy. Người chấm bảo rõ: "cho
// cả ba hạt đổ bóng tiếp xúc sát chân hạt trong cả ba góc máy".
// Vệt này đặt ở lớp fx, nên nó không có viền mực — một vệt tối có viền đen
// đọc ra là một mảnh rơi, không phải bóng.
// Tờ vân nền TRẮNG và vật liệu dùng phép NHÂN (multiply). Tờ có alpha trên lớp
// fx không hiện ra, và KHÔNG được đặt depthWrite:false: ở lớp fx của rig, vật
// liệu không ghi độ sâu thì không hề được vẽ ra (đã thử: vệt bóng biến mất).
let _shadowTex = null;
function contactTex() {
  if (_shadowTex) return _shadowTex;
  _shadowTex = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);        // nền trắng: nhân không đổi
    const grd = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grd.addColorStop(0, 'rgba(58,42,24,.55)');
    grd.addColorStop(.45, 'rgba(58,42,24,.36)');
    grd.addColorStop(.78, 'rgba(58,42,24,.11)');
    grd.addColorStop(1, 'rgba(58,42,24,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });
  return _shadowTex;
}

export const PROP = {
  name: 'hạt gạo',
  view: () => {
    const g = new THREE.Group();
    // đặt một hạt nằm trên mặt bàn: cao độ lấy theo chính hạt đó, để hạt nằm
    // sát mặt bàn chứ không chạm hoặc lơ lửng
    const place = (gr, x, z) => {
      gr.position.set(x, 0, z);
      g.add(gr);
      g.updateMatrixWorld(true);
      const b = new THREE.Box3().setFromObject(gr);
      gr.position.y -= b.min.y;
      // vệt bóng tiếp xúc: một bầu tối mờ trải theo đúng hướng hạt nằm,
      // lệch nhẹ về phía đèn (trước-trái) để hạt có chỗ đứng trên bàn
      const sz = b.getSize(new THREE.Vector3());
      const len = Math.max(sz.x, sz.z), wid = Math.min(sz.x, sz.z);
      const sh = new THREE.Mesh(
        new THREE.PlaneGeometry(len * .92, wid * .92),
        new THREE.MeshBasicMaterial({ map: contactTex(), blending: THREE.MultiplyBlending }));
      sh.rotation.set(-Math.PI / 2, 0, 0);
      sh.rotateZ(-(gr.rotation.y || 0));
      sh.position.set(gr.position.x - len * .02, .0009, gr.position.z - len * .02);
      fxLayer(sh); g.add(sh);
    };
    // Hạt được dựng to: một hạt gạo thật chỉ dài 7,6 mm, mà xưởng quay tự
    // đóng khung theo bán kính vật, nên một hạt nhỏ sẽ chỉ chiếm một vệt trắng
    // mỏng, không đọc ra là hạt. Dựng to không làm hạt nhỏ đi trong khung (máy
    // quay tự lùi xa theo kích thước), mà làm hạt đủ dày để đổ bóng xuống mặt
    // bàn — một hạt không có bóng đọc ra là một hình phẳng có viền.
    const K = 30;
    //
    // VÀ KHÔNG HẠT NÀO ĐƯỢC CHỒNG LÊN HẠT NÀO. Trước đây bốn hạt được xếp
    // lệch nhau để chồng lên nhau một chút, nhưng trục của chúng cắt nhau, nên
    // hai thân hạt xuyên vào nhau: ở góc nhìn từ trên xuống, hai hạt dính
    // thành một khối cong, có nếp gấp ở giữa — đúng cái lỗi "các phần xuyên
    // qua nhau sai chỗ". Nay ba hạt nằm rời nhau, mỗi hạt có vệt bóng riêng
    // chạm mặt bàn.
    //
    // Ba hạt, không phải bốn: xưởng quay tự lùi xa theo bán kính cụm vật, nên
    // thêm một hạt là cụm rộng ra, mỗi hạt nhỏ đi và hạt nào cũng mờ.
    //
    // Hạt 1 — nằm sấp, mặt lưng lên: thấy sợi vỏ trấu chạy dọc thân và hai
    // đầu khum tròn.
    const hero = gachGao({ scale: K, roll: .16, yaw: .34 });
    place(hero, -.030, -.128);
    // Hạt 2 — nằm NGỬA BỤNG LÊN, lệch sang bên phải: thấy khe nứt dọc ở
    // bụng — đặc điểm riêng của hạt gạo, không có ở lá.
    const belly = gachGao({ scale: K, roll: Math.PI - .12, yaw: .96 });
    place(belly, .126, -.022);
    // Hạt 3 — hạt bị cưa đôi, mặt cắt nghiêng về phía máy quay. Đây là dấu
    // hiệu KHÔNG NHẦM LẪN ĐƯỢC của hạt gạo: bên trong một hạt gạo là lớp
    // tinh bột trắng, không có lá nào có. Chỉ nhìn hai hạt nguyên thì một
    // người chưa từng thấy hạt gạo có thể gọi nhầm là lá khô; thấy hạt cưa
    // ra lõi trắng thì không còn cách nào gọi nhầm nữa.
    //
    // Núm tinh bột phải đủ nhiều để mặt cắt đọc ra là MẶT BỘT lốm đốm, chứ
    // không phải một vỏ trắng trơn — một mảng trắng nhẵn trơn đọc ra là hạt
    // đậu trắng, không phải hạt gạo bị cưa.
    const cut = gachGaoCat({ scale: K * .42, grains: 110 });
    cut.rotation.set(-.46, .475, .10);
    place(cut, -.108, .058);
    return g;
  },
};
