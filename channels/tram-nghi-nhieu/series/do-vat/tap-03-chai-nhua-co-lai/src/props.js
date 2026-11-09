// Vật của tập 03 — "Vì sao chai nhựa bị co lại khi rót nước nóng vào?"
//
// Quy ước: một đơn vị = một mét. Chai nước PET 0,5 lít cao 0,20 m.
// Mọi vật ở đây là vật có thật: chai nhựa có gân, nắp có ren, mẩu preform dày,
// nhiệt kế có thang vạch, đồng hồ áp suất có kim.
//
// Không vẽ con số nào lên vật, trừ hai con số của phim: "100" (mực nước sôi)
// và "70" (vạch đỏ mốc mềm) trên thang nhiệt kế. Cả hai đều được lời kể đọc.
//
// Cách dựng chai: một "lathe" tự tay (LatheGeometry của rig không cho đổi hình
// dạng theo từng khung), nên thân chai, vai và cổ nằm trong cùng một mạng
// đỉnh. Muốn chai nong ra (preform → chai) thì nội suy hai đường viền; muốn
// chai co, nhăn, phồng hay bị hút vào thì dịch từng đỉnh theo công thức của
// chính mạng đó.
//
// **Nhãn nằm trong cùng mạng đỉnh với thân chai** (một lathe riêng, cùng
// công thức biến dạng) để nó nhăn cùng thân và không bao giờ rơi rời.
import * as THREE from 'three';
import {
  toon, PAL, rbox, mesh, canvasTex, fxLayer, mulberry, lerp, clamp, seg, ss, eio, back,
} from '../../../../rig/kit.js';
import { buildHand } from '../../../../rig/fx.js';
import { sway, breathe, particleStream } from '../../../../rig/motion.js';

// ── lathe tự tay: một đường viền (r, y) quay quanh trục y ────────────────
// profile: mảng [r, y]; đổi profile thì hình đổi theo, từng đỉnh một.
function makeLathe(profile, seg = 48) {
  const nP = profile.length, nS = seg;
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(nP * (nS + 1) * 3);
  const uv = new Float32Array(nP * (nS + 1) * 2);
  const idx = [];
  for (let i = 0; i < nS; i++) for (let j = 0; j < nP - 1; j++) {
    const a = j * (nS + 1) + i, b = a + 1, c = a + (nS + 1), d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  g.setIndex(idx);
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  const write = prof => {
    for (let j = 0; j < nP; j++) {
      const [r, y] = prof[j];
      for (let i = 0; i <= nS; i++) {
        const a = (j * (nS + 1) + i), ph = i / nS * Math.PI * 2;
        pos[a * 3] = Math.cos(ph) * r; pos[a * 3 + 1] = y; pos[a * 3 + 2] = Math.sin(ph) * r;
        uv[a * 2] = i / nS; uv[a * 2 + 1] = j / (nP - 1);
      }
    }
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
    g.computeBoundingSphere();
  };
  write(profile);
  return { geometry: g, write, nP, nS };
}

// ── hai đường viền: mẩu preform dày, và thân chai được thổi ra ───────────
// Cùng số điểm, để nội suy từ cái này sang cái kia mà không méo.
//
// Preform: ống nhựa dày, đáy phẳng, vai thu nhỏ lên, cổ ren nhỏ ở trên —
// **miệng mở** (dòng cuối không khép r = 0), nên nhìn từ trên xuống thấy
// miệng và thành trong, chứ không phải một cây nến trụ có đầu vòm.
const PREFORM = [
  [0.0000, 0.000], [0.0148, 0.000], [0.0152, 0.003], [0.0155, 0.006], [0.0155, 0.013],
  [0.0155, 0.020], [0.0155, 0.027], [0.0155, 0.034], [0.0155, 0.041], [0.0155, 0.048],
  [0.0155, 0.055], [0.0155, 0.062], [0.0155, 0.069], [0.0155, 0.076], [0.0155, 0.083],
  [0.0155, 0.090], [0.0153, 0.097], [0.0146, 0.104], [0.0136, 0.111], [0.0120, 0.118],
  [0.0098, 0.125], [0.0086, 0.132], [0.0082, 0.140], [0.0080, 0.147], [0.0092, 0.152],
];
const BOTTLE = [
  [0.0000, 0.000], [0.0255, 0.000], [0.0300, 0.005], [0.0318, 0.013], [0.0312, 0.021],
  [0.0300, 0.031], [0.0296, 0.040], [0.0314, 0.045], [0.0294, 0.050], [0.0296, 0.056],
  [0.0314, 0.061], [0.0294, 0.066], [0.0298, 0.073], [0.0316, 0.079], [0.0296, 0.085],
  [0.0300, 0.096], [0.0318, 0.102], [0.0298, 0.108], [0.0302, 0.119], [0.0300, 0.133],
  [0.0294, 0.146], [0.0268, 0.157], [0.0218, 0.167], [0.0162, 0.177], [0.0140, 0.200],
];
const mixProfile = k => BOTTLE.map((b, i) => [lerp(PREFORM[i][0], b[0], k), lerp(PREFORM[i][1], b[1], k)]);

// ── biến dạng của thành chai ────────────────────────────────────────────
// shrink: co về hình cũ (ngắn lại, hẹp vào)
// wrinkle: nếp nhăn (vài chỗ lõm to, không phải gợn sóng đều)
// bulge: khí nóng đẩy ra (phồng, gân bị kéo căng nên mịn đi)
// suck: áp suất âm hút vào (eo lõm ở tầm nhãn)
//
// Mọi công thức chỉ phụ thuộc (y, góc) — không phụ thuộc số thứ tự đỉnh —
// nên **nhãn dính vào thân** và nhăn cùng thân, không bao giờ rơi rời.
// DENT: nếp nhăn theo chiều cao — vài chỗ lõm to xen kẽ nếp phồng.
// WOB: gợn quanh thân. Nó phải **nhỏ**: gợn to làm nhãn bị xé thành mảnh rời,
// và người xem đọc ra "chai có nhãn rách" chứ không phải "chai nhăn".
const DENT = yn => .017 * Math.sin(yn * 4.6 + .3) + .007 * Math.sin(yn * 9.3 + 1.4);
const WOB = (ph, yn) => .0036 * Math.sin(ph * 3 + yn * 3.1) + .0016 * Math.sin(ph * 5 - yn * 2.0);

function smoothRadii(prof) {
  return prof.map((p, i) => {
    const a = prof[Math.max(0, i - 1)][0], b = p[0], c = prof[Math.min(prof.length - 1, i + 1)][0];
    return (a + b * 2 + c) / 4;
  });
}

// hàng đỉnh đã biến dạng: trả về [r, y] cho từng hàng.
//
// off là độ lệch của nhãn so với thân (nhãn nằm ngoài thân, luôn). Nó phải
// cộng **sau** khi quy đổi bán kính, không trộn vào r0: lúc chai phồng, đường
// viền được làm trơn và độ lệch ấy bị pha loãng, thân chui lên nhãn — chai
// phồng lên mà nhãn biến mất.
function deformRows(rows, bodyProf, st, smoothR, off = 0, bulgeK = .42) {
  const y0 = bodyProf[0][1], y1 = bodyProf[bodyProf.length - 1][1];
  const H = Math.max(.001, y1 - y0);
  return rows.map((row, k) => {
    const [r0, y] = row;
    const yn = clamp((y - y0) / H);
    const mid = Math.sin(Math.PI * yn);
    // gân bị kéo căng thì mịn đi: khi phồng, đường viền về phía đường trơn
    const rBase = lerp(smoothR[k], r0, 1 - st.bulge * .95);
    // phồng: bụng rộng nhất, đáy bị hút nhỏ. hút vào: cả thân nhỏ lại.
    const bot = Math.max(0, 1 - yn / .18);
    const rad = 1 - st.shrink * .10
      + st.bulge * (bulgeK * mid - .12 * bot)
      - st.suck * .16 * mid;
    const dent = st.wrinkle * DENT(yn) * Math.pow(mid, .55);
    const dentSuck = st.suck * .002 * Math.exp(-Math.pow((yn - .40) / .17, 2));
    return [rBase * rad + dent - dentSuck + off, y0 + (y - y0) * (1 - st.shrink * .22)];
  });
}

// đổ hàng đỉnh đã biến dạng vào một lathe, cộng thêm gợn quanh thân
function writeDeformed(lathe, rowsDef, bodyProf, st) {
  const { geometry: g, nP, nS } = lathe;
  const pos = g.attributes.position.array;
  const y0 = bodyProf[0][1], y1 = bodyProf[bodyProf.length - 1][1];
  const H = Math.max(.001, y1 - y0);
  for (let j = 0; j < nP; j++) {
    const [rB, y] = rowsDef[j];
    const yn = clamp((y - y0) / H);
    const mid = Math.sin(Math.PI * yn);
    for (let i = 0; i <= nS; i++) {
      const a = (j * (nS + 1) + i) * 3;
      const ph = i / nS * Math.PI * 2;
      // đáy nhăn kiểu cánh (năm thùy): chai co thì đáy bị ép thành đáy nhăn
      const petal = st.wrinkle * .013 * Math.pow(Math.max(0, 1 - yn / .16), 2)
        * (.5 + .5 * Math.cos(ph * 5));
      // hút vào: **một eo lõm đơn, liên tục, sâu ~30 mm**, đường viền mượt
      // (không gấp khúc như một khúc lõm nhỏ). Sâu nhất ở mặt xa, nhẹ hơn ở
      // mặt gần — nhìn là chai méo một bên, không phải chai nhỏ đều.
      const cave = st.suck * .030 * Math.exp(-Math.pow((yn - .40) / .19, 2))
        * (.55 + .45 * (.5 - .5 * Math.cos(ph - 2.2)));
      const r = rB - cave + st.wrinkle * WOB(ph, yn) * Math.pow(mid, .55);
      pos[a] = Math.cos(ph) * r;
      pos[a + 1] = y + petal;
      pos[a + 2] = Math.sin(ph) * r;
    }
  }
  g.attributes.position.needsUpdate = true;
  g.computeVertexNormals();
  g.computeBoundingSphere();
}

// ── nhãn in trên thân chai: nền xanh, sóng trắng, giọt nước — không chữ ──
// Nhãn không có chữ (TREATMENT: "dải màu không chữ"): chữ trên nhãn lấn át
// tâm khung ở những cảnh cận nhãn. Dấu hiệu nhận ra nhãn là **dải màu + sóng
// + giọt nước**, không phải chữ. Không có con số nào trên nhãn (chỉ "100" và
// "70" của phim được phép lên màn hình).
function labelTex() {
  return canvasTex(1024, 256, (g, w, h) => {
    g.fillStyle = '#2f8fa0'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff0d8';
    g.beginPath();
    g.moveTo(0, h * .62);
    for (let x = 0; x <= w; x += 8) g.lineTo(x, h * .62 + Math.sin(x / w * Math.PI * 4) * h * .10);
    g.lineTo(w, h); g.lineTo(0, h); g.closePath(); g.fill();
    // Nhãn **không có chữ**: TREATMENT quy định "dải màu không chữ", và chữ
    // trên nhãn lấn át tâm khung ở c51/c62. Thay chỗ của chữ là **một giọt
    // nước** — vẫn là dấu hiệu của nhãn, nhưng không phải chữ.
    g.save();
    g.translate(w * .25, 0); g.scale(-1, 1);
    g.fillStyle = '#eaf7fb';
    g.beginPath();
    g.moveTo(0, h * .14);
    g.bezierCurveTo(w * .038, h * .32, w * .030, h * .43, 0, h * .46);
    g.bezierCurveTo(-w * .030, h * .43, -w * .038, h * .32, 0, h * .14);
    g.closePath(); g.fill();
    g.restore();
    const r = mulberry(4);
    for (let k = 0; k < 2500; k++) g.fillStyle = `rgba(255,255,255,${r() * .05})`, g.fillRect(r() * w, r() * h, 2, 2);
  });
}

// ── nắp chai: thân cao gần bằng đường kính, có ren dọc, miệng trong lõm ──
function buildCapMesh(mat) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(.0152, .0152, .021, 28), mat, [0, 0, 0]));
  g.add(mesh(new THREE.TorusGeometry(.0152, .0022, 8, 28), mat, [0, -.0105, 0], { rot: [Math.PI / 2, 0, 0] }));
  for (let i = 0; i < 22; i++) {           // ren dọc
    const a = i / 22 * Math.PI * 2;
    g.add(mesh(rbox(.0022, .0180, .0022, .0006), mat, [Math.cos(a) * .0154, 0, Math.sin(a) * .0154], { rot: [0, -a, 0] }));
  }
  g.add(mesh(new THREE.TorusGeometry(.0112, .0018, 8, 24), mat, [0, .0098, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.CylinderGeometry(.0112, .0112, .0016, 24), mat, [0, .0086, 0]));
  g.add(mesh(new THREE.TorusGeometry(.0126, .0009, 6, 24), mat, [0, -.0035, 0], { rot: [Math.PI / 2, 0, 0] }));
  return g;
}

// ── một cái chai PET ─────────────────────────────────────────────────────
// state: { shrink, wrinkle, bulge, suck } — mỗi thứ 0..1.
// update(t) nội suy về trạng thái đích: chai tự chuyển động, không cần lệnh.
export function createBottle({ cap = true, label = true, morph = 1 } = {}) {
  const g = new THREE.Group(); g.name = 'chai-nhua';
  const pet = toon('#cfe9f3', { transparent: true, opacity: .90 });
  const lathe = makeLathe(mixProfile(morph), 48);
  const body = mesh(lathe.geometry, pet, [0, 0, 0]);
  body.name = 'than-chai';          // mẩu preform tìm chính nó qua tên này
  g.add(body);
  const st = { shrink: 0, wrinkle: 0, bulge: 0, suck: 0 };
  const tgt = { shrink: 0, wrinkle: 0, bulge: 0, suck: 0 };
  let prof = mixProfile(morph);
  let smoothR = smoothRadii(prof);
  let capOn = cap;
  // độ phồng: trong phim chai B phồng vừa phải, còn trong ảnh danh mục thì
  // phồng **rõ** — cùng một vật, nhưng ảnh phải nói được nó phồng.
  let bulgeK = .42;

  // đáy chai có năm cánh như chai PET thật (mẩu preform chưa có)
  const feet = new THREE.Group(); g.add(feet);
  feet.visible = morph > .90;          // mẩu preform đáy phẳng, chưa có đáy cánh
  for (let i = 0; i < 5; i++) {
    const a = i / 5 * Math.PI * 2;
    feet.add(mesh(new THREE.SphereGeometry(.006, 10, 8), pet, [Math.cos(a) * .020, .0015, Math.sin(a) * .020], { rot: [0, 0, 0] }));
  }

  // nhãn: một lathe riêng, lấy đúng các hàng đỉnh của thân ở tầm nhãn
  const L0 = 8, L1 = 17;                     // y .050 … .108
  let lab = null, labLathe = null;
  if (label) {
    const lmat = toon('#ffffff', { map: labelTex() });
    labLathe = makeLathe(prof.slice(L0, L1 + 1).map(p => [p[0], p[1]]), 48);
    lab = mesh(labLathe.geometry, lmat, [0, 0, 0]);
    g.add(lab);
  }

  // miệng chai: vòng ren + thành trong, để nhìn từ trên xuống thấy rõ miệng mở
  const neckMat = toon('#dff2f8', { transparent: true, opacity: .85 });
  const neckRings = [
    mesh(new THREE.TorusGeometry(.0148, .0013, 8, 28), neckMat, [0, .1800, 0], { rot: [Math.PI / 2, 0, 0] }),
    mesh(new THREE.TorusGeometry(.0146, .0011, 8, 28), neckMat, [0, .1930, 0], { rot: [Math.PI / 2, 0, 0] }),
  ];
  neckRings.forEach(r => g.add(r));
  // Thành trong của miệng chai phải **tối**: nhìn từ trên xuống, một miệng
  // sáng bằng màu kem đọc ra là một mặt tròn phẳng — tức là "chai đã có nắp".
  // Miệng mở phải là một **lỗ tối** có ren trong, nhìn thấy được từ trên xuống.
  const neckWall = mesh(new THREE.CylinderGeometry(.0132, .0132, .030, 28, 1, true),
    toon('#16323d', { side: THREE.BackSide }), [0, .1850, 0]);
  g.add(neckWall);
  // ren trong của cổ chai: ba vòng nhỏ — miệng chai có ren, không phải một lỗ trơn
  // (toạ độ tương đối so với tâm thành trong ở y .1850: nhóm `threads` được
  // dời theo thành chai khi chai co).
  const threads = new THREE.Group(); g.add(threads);
  for (let i = 0; i < 3; i++) {
    threads.add(mesh(new THREE.TorusGeometry(.0122, .0009, 6, 24), toon('#9fc4ce'),
      [0, .0055 + i * .0045, 0], { rot: [Math.PI / 2, 0, 0] }));
  }

  // Mẩu preform: cổ ren nhỏ ở trên, có vòng xoắn ốc, miệng mở thấy thành dày.
  // Thiếu mấy thứ này thì mẩu preform đọc ra là một cây nến trụ, chứ không
  // phải một mẩu nhựa chờ được thổi thành chai.
  const preTop = new THREE.Group(); g.add(preTop);
  preTop.add(mesh(new THREE.CylinderGeometry(.0072, .0072, .034, 20, 1, true),
    toon('#f6efdf', { side: THREE.BackSide }), [0, .1330, 0]));
  preTop.add(mesh(new THREE.TorusGeometry(.0092, .0018, 8, 24), toon('#dff2f8'), [0, .1520, 0], { rot: [Math.PI / 2, 0, 0] }));
  {
    const pts = [];
    for (let i = 0; i <= 72; i++) {
      const u = i / 72;
      const a = u * Math.PI * 4.2;
      const r = lerp(.0094, .0082, u);
      pts.push(new THREE.Vector3(Math.cos(a) * r, .1300 + u * .0180, Math.sin(a) * r));
    }
    preTop.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 72, .0009, 6, false),
      toon('#dff2f8')));
  }
  preTop.visible = morph < .90;
  neckRings.forEach(r => r.visible = morph > .90);
  neckWall.visible = morph > .90;
  threads.visible = morph > .90;

  // Vệt nhiệt trên thân chai: chai vừa chứa nước sôi thì **nó ấm lên** — thân
  // và nhãn chuyển sang tông ấm. Trước đây vệt nhiệt là một ống sáng trong suốt
  // đeo quanh cổ: nó ra một dải hồng cứng sắc cạnh (đọc như vệt sơn, không
  // phải nhiệt), và tệ hơn, **hai chai cùng một trạng thái lại ra hai màu
  // khác nhau** — nên câu "hai chai giống hệt nhau" không đúng trên hình. Nay
  // vệt nhiệt là chính màu của vật, nó bám theo hình chai và mềm cả hai đầu.
  const baseCol = new THREE.Color('#cfe9f3');   // màu nền thân chai (mẩu preform đổi được)
  const HOT_COL = new THREE.Color('#ff9a52');
  // nắp: có ren, màu xanh
  let capMesh = null;
  if (cap) {
    capMesh = buildCapMesh(toon('#2f8fa0'));
    capMesh.position.set(0, .2105, 0);
    g.add(capMesh);
  }

  const api = {
    group: g,
    setState(s = {}) {
      for (const k of ['shrink', 'wrinkle', 'bulge', 'suck']) tgt[k] = clamp(s[k] ?? 0);
    },
    setMorph(k) {                       // 0 = mẩu preform, 1 = chai đã thổi xong
      morph = clamp(k);
      prof = mixProfile(morph);
      smoothR = smoothRadii(prof);
      lathe.write(prof);
      // nhãn và nắp chỉ có ở cái chai đã thổi xong: mẩu preform không có nhãn
      if (lab) {
        lab.visible = morph > .92;
        labLathe.write(prof.slice(L0, L1 + 1).map(p => [p[0] + .0009, p[1]]));
      }
      if (capMesh) capMesh.visible = morph > .97 && capOn;
      feet.visible = morph > .90;
      preTop.visible = morph < .90;
      neckRings.forEach(r => r.visible = morph > .90);
      neckWall.visible = morph > .90;
      threads.visible = morph > .90;
    },
    setCap(on) { capOn = !!on; if (capMesh) capMesh.visible = capOn && morph > .97; },
    setBulgeK(k) { bulgeK = clamp(k, 0, 1.2); },
    // màu nền của thân chai: mẩu preform có màu riêng (xanh nhạt đục), nên
    // `setHot` phải nối từ màu nền ấy chứ không phải từ màu chai thường
    setBaseColor(c) {
      baseCol.set(c);
      body.material.color.copy(baseCol);
      body.material.transparent = false;
      body.material.opacity = 1;
      body.material.needsUpdate = true;
    },
    // vệt nhiệt trên vai: 0 = mát, 1 = đang nóng
    setHot(k) {
      const c = clamp(k);
      body.material.color.copy(baseCol).lerp(HOT_COL, c * .42);
      if (lab) lab.material.color.setRGB(1, 1, 1).lerp(HOT_COL, c * .42);
    },
    get cap() { return capMesh; },
    get body() { return body; },
    update(t) {
      // trạng thái đích đến dần: vật tự chuyển động theo thời gian
      for (const k of ['shrink', 'wrinkle', 'bulge', 'suck']) {
        st[k] += (tgt[k] - st[k]) * (1 - Math.pow(.001, .016));
      }
      const rows = deformRows(prof, prof, st, smoothR, 0, bulgeK);
      writeDeformed(lathe, rows, prof, st);
      if (lab && lab.visible) {
        const rowsL = prof.slice(L0, L1 + 1).map(p => [p[0], p[1]]);
        const defL = deformRows(rowsL, prof, st, smoothR.slice(L0, L1 + 1), .0013, bulgeK);
        writeDeformed(labLathe, defL, prof, st);
      }
      if (capMesh) {
        capMesh.position.y = .2105 * (1 - st.shrink * .22);
        capMesh.scale.set(1 + st.bulge * .06, 1, 1 + st.bulge * .06);
      }
      // vành miệng chai: co theo chai, và méo đi khi chai bị hút vào.
      // Thành trong của miệng chai cũng phải co theo, không thì nó cắm lên
      // trên nắp như một ống thủy tinh đứng ra.
      const nk = 1 - st.shrink * .10;
      neckRings.forEach((r, i) => {
        r.scale.set(nk * (1 - st.suck * .22), 1, nk * (1 + st.suck * .10));
        r.position.y = (i ? .1930 : .1800) * (1 - st.shrink * .22);
      });
      neckWall.position.y = .1850 * (1 - st.shrink * .22);
      neckWall.scale.set(nk, 1, nk);
      threads.position.y = .1850 * (1 - st.shrink * .22);
      threads.scale.set(nk, 1, nk);
      feet.scale.setScalar(1 - st.shrink * .10);
      feet.visible = morph > .90 && st.wrinkle < .5;   // đáy nhăn nuốt mất đáy cánh
    },
  };
  api.update(0);
  return api;
}

// ── mẩu preform: khối nhựa dày, cổ ren sẵn, chưa nong ────────────────────
export function createPreform() {
  const b = createBottle({ cap: false, label: false, morph: 0 });
  b.group.name = 'mau-preform';
  // Mẩu preform nằm **trong tia nắng** từ cửa sổ. Nhựa nhạt bán trong suốt
  // như chai thường thì ở đó **chói thành một mảng trắng**: người xem không đọc
  // ra đó là một mẩu nhựa nhỏ xíu, chỉ thấy một vệt sáng. Mẩu preform thật là
  // nhựa **đặc** (không trong suốt) và xanh nhạt — nên nó đứng được trong tia
  // nắng mà vẫn đọc ra là một mẩu nhựa. (Sau khi nong thành chai, mảu preform
  // vẫn giữ màu ấy: nó là một chai khác, không phải chai A hay chai B.)
  b.setBaseColor('#8ecadd');
  return { group: b.group, setInflate: k => b.setMorph(k), update: b.update };
}

// ── nắp chai rời (để người xem thấy nó là nắp, không phải một cái đĩa) ────
export function createCap() {
  const g = new THREE.Group(); g.name = 'nap-chai';
  g.add(buildCapMesh(toon('#2f8fa0')));
  return { group: g };
}

// ── nhiệt kế bếp có đầu dò: que cắm trong nước, mặt đồng hồ có thang ────
// "100" ở mực nước sôi, "70" ở vạch đỏ mốc mềm. Lời kể đọc cả hai.
// Đầu dò phải **cắm trong nước**: một nhiệt kế đứng cạnh chai trên bàn thì
// chỉ nhiệt độ phòng, chứ không phải nhiệt độ của nước sôi.
// Que thép phải **dày và có đầu nhọn** (que mảnh như sợi tóc thì không đọc
// ra là nhiệt kế), và mặt đồng hồ phải có vỏ, không phải một mảnh bìa trắng.
export function createThermometer({ stem = .135, head = .058 } = {}) {
  const g = new THREE.Group(); g.name = 'nhiet-ke';
  const face = toon('#f6ead2');
  // que đầu dò: thép dày, đầu nhọn
  const probe = new THREE.CylinderGeometry(.0038, .0044, stem, 14);
  probe.translate(0, stem / 2, 0);
  g.add(mesh(probe, toon('#b9c4d0'), [0, 0, 0]));
  g.add(mesh(new THREE.ConeGeometry(.0044, .011, 14), toon('#98a5b3'), [0, -.0045, 0], { rot: [Math.PI, 0, 0] }));
  // vỏ đồng hồ: một khung đứng quanh mặt, để nó đọc ra là một cái đồng hồ
  const y0 = stem, y1 = stem + head;
  g.add(mesh(rbox(.040, head + .010, .017, .005), toon('#8fa0ae'), [0, y0 + head / 2, -.003]));
  g.add(mesh(rbox(.036, head, .013, .003), face, [0, y0 + head / 2, 0]));
  const SC0 = y0 + .005, SC1 = y1 - .004;          // thang: 0 ở đáy, 100 ở trên
  for (let i = 0; i <= 20; i++) {
    const y = SC0 + (i / 20) * (SC1 - SC0);
    const big = i % 5 === 0;
    g.add(mesh(rbox(big ? .009 : .0055, .0013, .001, .0004), toon(PAL.ink), [-.011, y, .0068]));
  }
  // Cột rơi phải nằm **trong rãnh thang** — cùng dải x với các vạch, lệch
  // sang phải mép vạch một chút — để đỉnh cột **chạm đúng một vạch**. Cột
  // đứng giữa mặt đồng hồ thì không chạm vạch nào, và người xem không đọc
  // được "cột rơi ở mấy độ".
  const col = mesh(rbox(.0026, 1, .001, .0004), toon('#e0324f'), [-.0055, SC0, .0072]);
  g.add(col);
  // hai con số, mỗi số một mảnh riêng đứng đúng chỗ nó trên thang:
  // "100" ở mực nước sôi, "70" ở vạch đỏ (mốc nhựa mềm).
  const numPlane = (txt, cw, ch, w, h) => {
    const t = canvasTex(cw, ch, (g2, c2, h2) => {
      g2.clearRect(0, 0, c2, h2);
      g2.fillStyle = '#171a2b';
      g2.font = `900 ${Math.round(h2 * .74)}px "Be Vietnam Pro"`; g2.textAlign = 'center'; g2.textBaseline = 'middle';
      g2.fillText(txt, c2 / 2, h2 / 2);
    });
    return mesh(new THREE.PlaneGeometry(w, h), toon('#ffffff', { map: t, transparent: true }), [0, 0, .0075]);
  };
  const y70 = SC0 + .70 * (SC1 - SC0);
  const n100 = numPlane('100', 192, 108, .0125, .0070); n100.position.set(.0105, SC1 - .0042, .0075); g.add(n100);
  const n70 = numPlane('70', 128, 108, .0083, .0070); n70.position.set(.0105, y70, .0075); g.add(n70);
  // vạch đỏ: mốc mềm của nhựa PET — nằm ngay trên vạch bảy mươi độ, và
  // **chỉ hiện khi lời kể đã gọi tên mốc 70** (xem setSeventy)
  const red = mesh(rbox(.0105, .0026, .001, .0004), toon('#e0324f'), [-.0120, y70, .0082]);
  g.add(red);
  const api = {
    group: g,
    setLevel(k) {
      const h = (SC1 - SC0) * clamp(k);
      col.scale.y = Math.max(.0001, h);
      col.position.y = SC0 + h / 2;
    },
    setNumbers(on) { n100.visible = !!on; n70.visible = !!on; },
    // Số "70" và vạch đỏ 70 **chỉ hiện khi lời kể đã gọi tên mốc 70** (c23).
    // Trước đó trên mặt đồng hồ chỉ có "100" — mốc nước sôi.
    setSeventy(on) { n70.visible = !!on; red.visible = !!on; },
  };
  api.setLevel(1);
  return api;
}

// ── đồng hồ áp suất: mặt tròn, KIM ĐỎ dày, cổ ren vặn vào nắp/ống ────────
// Không có chân đế (chân đế làm nó đọc thành đồng hồ quả lắc); đáy nó là một
// đai ốc và một que ren, đúng kiểu đồng hồ vặn vào miệng chai.
// Đường kính mặt đồng hồ nhỏ (40 mm): mặt phải **nhỏ hơn nắp chai** một chút
// thì nó đọc ra là đồng hồ vặn vào nắp, chứ không phải một cái đồng hồ bàn đặt
// trên cọc. Cọc ren ngắn, đáy đồng hồ nằm ngay trên đỉnh nắp.
export function createGauge({ R = .020 } = {}) {
  const g = new THREE.Group(); g.name = 'dong-ho-ap-suat';
  const face = toon('#e6dcc2');
  g.add(mesh(new THREE.CylinderGeometry(R, R, .012, 40), face, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  // vành đồng hồ phải **đứng** trong mặt phẳng XY (vuông góc mặt kính),
  // nằm ngang thì nó thành một sọc ngang đè ngang mặt đồng hồ
  g.add(mesh(new THREE.TorusGeometry(R, .0022, 8, 40), toon(PAL.navy), [0, 0, .005]));
  // Vành **đỏ**: đồng hồ áp suất phải có một dấu hiệu riêng, không phải một
  // mặt tròn trắng như mọi thứ tròn khác trong phim.
  g.add(mesh(new THREE.TorusGeometry(R + .0016, .0012, 8, 44), toon('#e0324f'), [0, 0, .0028]));
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI * .75 + i / 10 * Math.PI * 1.5;
    const r0 = R * .64, r1 = R * .90;
    g.add(mesh(rbox(.0013, r1 - r0, .001, .0004), toon(PAL.ink),
      [Math.cos(a) * (r0 + r1) / 2, Math.sin(a) * (r0 + r1) / 2, .0065], { rot: [0, 0, a - Math.PI / 2] }));
  }
  // Vạch **0** đánh dấu riêng (đậm, đỏ): "kim về đáy" phải đọc được là về 0,
  // không phải "kim nằm ở góc nào đó".
  {
    const a0 = -Math.PI * .75;
    g.add(mesh(rbox(.0026, R * .28, .001, .0004), toon('#e0324f'),
      [Math.cos(a0) * R * .76, Math.sin(a0) * R * .76, .0070], { rot: [0, 0, a0 - Math.PI / 2] }));
  }
  const needle = new THREE.Group(); needle.position.z = .008; g.add(needle);
  needle.add(mesh(rbox(.0034, R * .78, .0012, .0006), toon('#e0324f'), [0, R * .30, 0]));
  needle.add(mesh(new THREE.CylinderGeometry(.005, .005, .003, 14), toon(PAL.navy), [0, 0, .001], { rot: [Math.PI / 2, 0, 0] }));
  // đai ốc + que ren ở giữa đáy: đồng hồ vặn vào nắp chai
  g.add(mesh(new THREE.CylinderGeometry(.0105, .0105, .013, 6), toon('#b8c2cc'), [0, -R - .006, 0]));
  g.add(mesh(new THREE.CylinderGeometry(.0062, .0062, .020, 16), toon('#98a4b0'), [0, -R - .022, 0]));
  for (let i = 0; i < 5; i++) {
    g.add(mesh(new THREE.TorusGeometry(.0062, .0008, 6, 16), toon('#98a4b0'), [0, -R - .012 - i * .005, 0], { rot: [Math.PI / 2, 0, 0] }));
  }
  const api = {
    group: g,
    // Kim được phép rơi **dưới vạch thấp nhất** (k âm): đó là hình của áp suất
    // âm trong chai — kim nằm ngoài thang, không phải ở đáy thang.
    setLevel(k) { needle.rotation.z = -Math.PI * .75 + clamp(k, -.10, 1) * Math.PI * 1.5; },
  };
  api.setLevel(0);
  return api;
}

// ── móc xích phân tử: hai bộ, một theo vòng quanh thân, một theo chiều dọc ──
// Mắt xích phải **nối thành chuỗi** (mắt thay phiên đứng nghiêng) và hai bộ
// phải **nằm ở hai chỗ khác nhau**, không chồng lên nhau thành một bông hoa.
export function createChains({ R = .030, N = 14, linkL = .013, axialN = 9, axialStep = .0075, axialL = .014, tube = .0014, axialR = .012, span = Math.PI * 2 } = {}) {
  const g = new THREE.Group(); g.name = 'moc-xich';
  const mat = toon('#f7bd27');
  // Mắt xích phải **dập nổi**: một mắt kim loại có lỗ, dày, chứ không phải một
  // vòng tròn mảnh trông như nét vẽ trên sàn.
  const mkLink = (len, t) => {
    const l = new THREE.Group();
    const geo = new THREE.TorusGeometry(len * .5, t, 10, 22);
    geo.scale(1, .70, 1);                    // mắt xích bầu dục, không phải vòng tròn
    l.add(mesh(geo, mat, [0, 0, 0]));
    return l;
  };
  // **MÓC** — phần làm nên cái tên "móc xích": một đường cong hình chữ J với
  // lưỡi nhọn mở ra ngoài. Không có lưỡi móc thì người xem chỉ thấy một vòng
  // xích vàng, và gọi nó là dây chuyền — sai vật.
  const mkHook = (s = 1) => {
    const h = new THREE.Group();
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -.0035 * s, .0062 * s),
      new THREE.Vector3(0, .0058 * s, .0054 * s),
      new THREE.Vector3(0, .0112 * s, -.0004 * s),
      new THREE.Vector3(0, .0094 * s, -.0064 * s),
      new THREE.Vector3(0, .0040 * s, -.0070 * s),
    ]);
    h.add(mesh(new THREE.TubeGeometry(curve, 30, .0022 * s, 8, false), mat, [0, 0, 0]));
    // lưỡi móc nhọn, nối tiếp đường cong
    const tip = mesh(new THREE.ConeGeometry(.0022 * s, .0062 * s, 10), mat,
      [0, .0016 * s, -.0068 * s]);
    tip.rotation.x = -Math.PI / 2 + .55;
    h.add(tip);
    return h;
  };
  // bộ quanh thân: vòng mắt xích nằm ngang, mỗi mắt có một móc đứng lên,
  // miệng móc hướng ra ngoài theo bán kính.
  const hoop = new THREE.Group(); g.add(hoop);
  // Vòng móc xích có thể **hở** (một đoạn của thành chai). Vòng kín trông
  // như dây chuyền — người xem gọi nó là một món trang sức chứ không phải vật
  // liệu bị kéo căng.
  for (let i = 0; i < N; i++) {
    const a = span >= Math.PI * 2 ? i / N * Math.PI * 2
      : (N > 1 ? (i / (N - 1) - .5) * span : 0);
    const e = new THREE.Group();
    const l = mkLink(linkL, Math.max(tube, .0024 * (linkL / .013)));
    l.rotation.x = -Math.PI / 2;             // mắt nằm ngang
    e.add(l);
    const h = mkHook(linkL / .013);          // móc đứng lên từ mắt xích
    h.position.y = .0016;
    e.add(h);
    e.position.set(Math.cos(a) * R, 0, Math.sin(a) * R);
    e.rotation.y = a + Math.PI;              // miệng móc hướng ra ngoài
    e.userData.a = a; e.userData.dir = 'hoop';
    hoop.add(e);
  }
  // bộ dọc thân: các móc xích chồng lên nhau theo chiều cao, và trên cùng
  // là một móc nằm ngang — nhìn từ trên xuống thấy rõ lưỡi móc.
  // axialR > 0: bộ này nằm trong lớp nhựa (ở N2), chứ không ở trục chai.
  const axial = new THREE.Group(); g.add(axial);
  for (let i = 0; i < axialN; i++) {
    const l = mkLink(axialL, Math.max(tube, .0024 * (axialL / .013)));
    l.position.set(0, -(axialN - 1) * axialStep / 2 + i * axialStep, axialR);
    l.rotation.set(0, Math.PI / 2, 0);       // mắt đứng, trục nằm ngang
    l.userData.dir = 'axial';
    axial.add(l);
  }
  const topHook = mkHook(axialL / .013);
  topHook.rotation.z = -Math.PI / 2;          // nằm ngang: lưỡi móc nhìn thấy từ trên
  topHook.position.set(0, (axialN - 1) * axialStep / 2 + .0016, axialR);
  topHook.userData.dir = 'axial';
  axial.add(topHook);
  const api = {
    group: g,
    // 0 = bị kéo căng, 1 = trượt về hình cũ.
    // Hướng quanh thân bị kéo căng nhiều hơn (mục 1 của FACTS), nên khi nóng
    // nó co mạnh hơn hướng dọc thân — chỗ lệch nhau đó là chỗ sinh nếp.
    setRelax(k) {
      const c = clamp(k);
      hoop.children.forEach(e => {
        const a = e.userData.a, r = R * (1 - c * .24);
        e.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        e.scale.set(1 - c * .34, 1, 1);
        e.rotation.y = a + Math.PI + c * .18 * Math.sin(a * 3);
      });
      axial.children.forEach((l, i) => {
        if (l.userData.dir !== 'axial') return;
        const y = (-(axialN - 1) * axialStep / 2 + i * axialStep) * (1 - c * .08);
        l.position.y = l === topHook ? y + .0016 : y;
        l.scale.set(1 - c * .10, 1, 1);
        l.rotation.x = c * .12 * Math.sin(i * 1.7);
      });
    },
    // Móc xích **lộ ra** ở c13: trước đó người xem chỉ thấy lớp nhựa, chưa
    // thấy được thứ bên trong. `k` = 0 (chưa có) .. 1 (đã lộ ra hết).
    setShow(k) {
      const c = clamp(k);
      g.visible = c > .002;
      g.scale.setScalar(Math.max(.002, c));
    },
    update(t) {                          // móc xích luôn còn chút rung
      hoop.children.forEach((e, i) => {
        e.rotation.y = e.userData.a + Math.PI + Math.sin(t * .7 + i) * .04;
      });
    },
  };
  api.setRelax(0);
  return api;
}

// ── mặt nước sôi trong chai: gợn sóng đồng tâm + bọt khí trong suốt ──────
export function createWaterSurface({ R = .029, y = 0, rim = true, neck = .045 } = {}) {
  const g = new THREE.Group(); g.name = 'mat-nuoc';
  // Mặt nước là **hình tròn**, không phải hình vuông: hình vuông thò ra ngoài
  // thành chai thì đọc ra là một tấm vải xanh trải trên sàn.
  const RW = R * .96;
  const geo = new THREE.RingGeometry(.0005, RW, 48, 10);
  const base = geo.attributes.position.array.slice();
  // Mặt nước phải có **vòng gợn sóng** thấy được: một tấm phẳng màu xanh thì
  // không đọc ra là nước, và bóng bọt phải **bán trong suốt** chứ không phải
  // những viên sỏi trắng nằm trên đó.
  const m = toon('#ffffff', { transparent: true, opacity: .95, side: THREE.DoubleSide, map: rippleTex() });
  const surf = mesh(geo, m, [0, y, 0], { rot: [-Math.PI / 2, 0, 0] });
  g.add(surf);
  // Thành chai quanh mặt nước: nhìn từ trên xuống phải thấy **cổ chai** bao
  // quanh, thì người xem mới biết đây là nước *trong chai*, chứ không phải một
  // tấm vải xanh trải trên sàn. (Trong N3, thành chai của cảnh đã làm việc này.)
  if (rim) {
    // Quanh mặt nước là **cổ chai**: một ống thành cao có ren, rồi mở rộng ra
    // thành vai chai. Nhìn từ trên xuống phải thấy miệng chai, không phải
    // một cái bát nước.
    g.add(mesh(new THREE.CylinderGeometry(R, R * .99, neck, 32, 1, true),
      toon('#dff2f8', { transparent: true, opacity: .40, side: THREE.BackSide }), [0, y + neck / 2, 0]));
    [neck * .80, neck * .91].forEach(h => g.add(mesh(new THREE.TorusGeometry(R * .995, .0016, 8, 40),
      toon('#e8f6fb', { transparent: true, opacity: .75 }), [0, y + h, 0], { rot: [Math.PI / 2, 0, 0] })));
    g.add(mesh(new THREE.CylinderGeometry(R * 1.7, R, .028, 32, 1, true),
      toon('#dff2f8', { transparent: true, opacity: .34, side: THREE.BackSide }), [0, y - .014, 0]));
  }
  const bubbles = new THREE.Group(); g.add(bubbles);
  const r = mulberry(12);
  for (let i = 0; i < 14; i++) {
    const a = r() * Math.PI * 2, d = r() * RW * .8;
    const b = mesh(new THREE.SphereGeometry(.0011 + r() * .0013, 10, 8), toon('#dff6ff', { transparent: true, opacity: .30 }),
      [Math.cos(a) * d, y + .002, Math.sin(a) * d]);
    b.userData.ph = r() * 6.28; b.userData.sp = .25 + r() * .35; b.userData.y0 = y;
    bubbles.add(b);
  }
  const api = {
    group: g,
    update(t) {
      const pos = geo.attributes.position.array;
      for (let i = 0; i < base.length; i += 3) {
        const x = base[i], yy = base[i + 1];
        const rr = Math.sqrt(x * x + yy * yy);
        // gợn sóng đồng tâm lan ra từ tâm, cộng thêm sóng ngang
        pos[i + 2] = base[i + 2]
          + Math.sin(rr * 90 - t * 4.4) * .0030 * Math.min(1, rr / (R * .35))
          + Math.sin(x * 46 + t * 3.6) * .0012
          + Math.cos(yy * 41 - t * 3.0) * .0010;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
      if (m.map) { m.map.offset.x = t * .03; m.map.offset.y = t * .06; }   // vòng gợn sóng trôi
      bubbles.children.forEach(b => {
        const k = (t * b.userData.sp + b.userData.ph) % 1;
        b.position.y = b.userData.y0 + k * .030;
        b.scale.setScalar(.4 + k * .8);
        b.material.opacity = .42 * (1 - k);
      });
    },
  };
  api.update(0);
  return api;
}

// ── vân gợn sóng của mặt nước: các vòng đồng tâm trôi chậm ──────────────
function rippleTex() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#7fd4e8'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,.60)';
    for (let i = 1; i <= 5; i++) {
      g.lineWidth = 7 - i;
      g.beginPath(); g.arc(w / 2, h / 2, i * w / 13, 0, Math.PI * 2); g.stroke();
    }
    g.fillStyle = 'rgba(255,255,255,.22)';
    g.beginPath(); g.arc(w / 2, h / 2, w / 10, 0, Math.PI * 2); g.fill();
  });
}

// ── lớp nhựa thành chai, cắt ngang: miếng cong, thấy cả hai mặt ─────────
// setStretch(quanh, doc): vật liệu bị kéo căng — vòng quanh thân dài ra
// nhiều hơn, chiều dọc thân dài ra ít hơn, và thành mỏng đi.
// Hai mép cắt phải **thấy độ dày** (một khối, không phải một mảnh phẳng), và
// lớp nhựa phải trong suốt như nhựa, không đục như bìa carton.
export function createWallSlice({ R = .030, th = .0012, h = .020, opacity = 1, waist = .10 } = {}) {
  const g = new THREE.Group(); g.name = 'lop-nhua';
  // Màu của **nhựa PET**: trắng trong, không phải xanh thuỷ tinh. Mảnh nhựa
  // thành chai đọc ra là nhựa, còn mảnh kính xanh là một vật khác.
  const m = toon('#dceff3', { side: THREE.DoubleSide, transparent: opacity < 1, opacity });
  // Bán kính mặt cắt tại một góc quanh thân: gân dọc + eo thân chai.
  // `waist` là độ eo (0 = trụ tròn, lớn = bóp eo như thân chai).
  const radiusAt = (th0, v, thick) => R + v * thick
    + Math.cos(th0 * 13) * thick * .90                 // gân dọc đặc trưng thành chai
    + waist * R * (4 * (v - .5) * (v - .5) - 1);       // eo ở giữa chiều cao
  const geo = new THREE.PlaneGeometry(1, 1, 40, 10);
  const pos = geo.attributes.position.array;
  const uvA = geo.attributes.uv.array;
  const write = (span, H, thick) => {
    for (let i = 0; i < pos.length; i += 3) {
      const u = uvA[i * 2 / 3], v = uvA[i * 2 / 3 + 1];
      const th0 = (-span + u * span * 2);          // góc quanh thân
      const r = radiusAt(th0, v, thick);
      pos[i] = Math.sin(th0) * r;
      pos[i + 1] = (v - .5) * H;
      pos[i + 2] = Math.cos(th0) * r;
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
  };
  write(.55, h, th);
  g.add(mesh(geo, m, [0, 0, 0]));
  // Hai **mép cắt**: mỗi mép là một mảnh phẳng có bề dày thật bằng `th`,
  // sáng hơn mặt ngoài. Không có hai mép này thì mảnh nhựa chỉ là một tờ
  // giấy cong — người xem không thấy được độ dày của nhựa.
  const cuts = [];
  for (const s of [-1, 1]) {
    const cgeo = new THREE.PlaneGeometry(1, 1, 1, 10);
    const cp = cgeo.attributes.position.array;
    const cuv = cgeo.attributes.uv.array;
    const e = mesh(cgeo, toon('#f6fdff', { side: THREE.DoubleSide }), [0, 0, 0]);
    e.userData.s = s;
    e.userData.write = (span, H, thick) => {
      const th0 = s * span;
      for (let i = 0; i < cp.length; i += 3) {
        const u = cuv[i * 2 / 3], v = cuv[i * 2 / 3 + 1];
        const r = radiusAt(th0, v, thick);
        cp[i] = (u - .5) * thick + (r - R - thick / 2);   // bề dày theo hướng bán kính
        cp[i + 1] = (v - .5) * H;
        cp[i + 2] = 0;
      }
      cgeo.attributes.position.needsUpdate = true;
      cgeo.computeVertexNormals();
    };
    cuts.push(e);
    g.add(e);
  }
  const place = (span, H, thick) => {
    for (const e of cuts) {
      const th0 = e.userData.s * span;
      e.position.set(Math.sin(th0) * (R + thick / 2), 0, Math.cos(th0) * (R + thick / 2));
      e.rotation.set(0, th0 - Math.PI / 2, 0);   // trục ngang của mép nằm theo bán kính
    }
  };
  const refresh = (span, H, thick) => { write(span, H, thick); place(span, H, thick); cuts.forEach(e => e.userData.write(span, H, thick)); };
  refresh(.55, h, th);
  const api = {
    group: g,
    // quanh: độ giãn theo vòng (0..1) · doc: độ giãn theo chiều dọc (0..1)
    setStretch(quanh = 0, doc = 0) {
      const span = .55 * (1 + quanh * .85);
      const H = h * (1 + doc * .30);
      const thick = th * (1 - clamp(quanh + doc) * .22);
      refresh(span, H, thick);
    },
  };
  return api;
}

// ── hơi nước: búp mềm bốc lên từ miệng chai ────────────────────────────
// Hạt phải **mềm, trong suốt, to dần nhỏ và nhạt dần theo chiều cao**; một
// khối cầu cứng đứng yên thì không phải hơi nước.
// `h` là chiều cao cột, `r0`/`r1` là bán kính ở đáy và ở đỉnh, và
// `setSpread` thu cột lại — để được ba **độ đặt** mà lời kể nói: cột dày
// lúc rót, cột mỏng lúc nguội, và làn mỏng khi chai hở nắp.
// vân loang của một búp hơi nước: trắng đục ở giữa, mờ dần ra mép
function puffTex() {
  return canvasTex(128, 128, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grd.addColorStop(0, 'rgba(255,255,255,.95)');
    grd.addColorStop(.40, 'rgba(255,255,255,.55)');
    grd.addColorStop(.75, 'rgba(255,255,255,.16)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });
}

export function createSteam({ n = 10, h = .075, r0 = .005, r1 = .018, size = .015, alpha = .38 } = {}) {
  const g = new THREE.Group(); g.name = 'hoi-nuoc';
  // Búp hơi nước là **mảnh vân loang quay mặt máy**, không phải quả cầu. Quả
  // cầu luôn có một viền tròn cứng ở mọi góc nhìn, nên cột hơi nước đọc ra là
  // một chuỗi hạt trắng, không phải hơi nước.
  const geo = new THREE.PlaneGeometry(size * 2, size * 2);
  const mat = new THREE.MeshBasicMaterial({
    map: puffTex(), transparent: true, depthWrite: false,
    color: new THREE.Color('#f4fcff'), opacity: alpha, toneMapped: false,
  });
  const im = new THREE.InstancedMesh(geo, mat, n);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.frustumCulled = false; im.renderOrder = 8;
  fxLayer(im); g.add(im);
  // **Góc vàng**: búp thứ i nằm ở một góc khác nhau, nên chúng rải khắp cột
  // chứ không xếp thành một xoắn ốc. Xoắn ốc là lý do cột hơi nước đọc ra là
  // một chuỗi hạt trắng.
  const r = mulberry(7), seeds = [], GA = 2.399963;
  for (let i = 0; i < n; i++) seeds.push({ a: i * GA, sw: r() * 6.28, rr: .25 + .75 * Math.sqrt(r()) });
  const M = new THREE.Matrix4(), P = new THREE.Vector3(), S = new THREE.Vector3();
  const camQ = new THREE.Quaternion();
  let spread = 1, tNow = 0, powNow = 1;
  // Đặt búp: mỗi búp là một mảnh phẳng **quay mặt máy**, nên phải biết hướng
  // máy quay — bốn góc nhìn của phim khác nhau, búp phải quay theo.
  const place = () => {
    for (let i = 0; i < n; i++) {
      const s = seeds[i];
      const k = (tNow * .18 + i / n) % 1;
      // búp nằm ở nhiều bán kính khác nhau (không chỉ trên vỏ cột) để cột
      // đặc, không rỗng
      const rad = (r0 + k * r1) * spread * s.rr;
      const a = s.a + tNow * .22;
      P.set(Math.cos(a) * rad + Math.sin(tNow * 1.4 + s.sw) * .004,
        k * h,
        Math.sin(a) * rad + Math.cos(tNow * 1.1 + s.sw) * .004);
      const sc = (1.15 - k * .45) * (.6 + .4 * powNow);   // to ở đáy, nhỏ dần lên trên
      S.set(sc, sc, sc);
      M.compose(P, camQ, S);
      im.setMatrixAt(i, M);
    }
    im.instanceMatrix.needsUpdate = true;
  };
  im.onBeforeRender = (r, sc2, cam) => { camQ.copy(cam.quaternion); place(); };
  const api = {
    group: g,
    // thu cột lại: 1 là cột đầy, .4 là cột mỏng, .2 là làn mỏng
    setSpread(k) { spread = clamp(k); },
    update(t, power = 1) {
      im.visible = power > .02;
      tNow = t; powNow = power;
      // **Một tốc độ cho tất cả**: mỗi búp một tốc độ thì búp dồn cục, hở lỗ,
      // và cột hơi nước đọc ra là một chuỗi hạt trắng cứng. Dòng nước của rig
      // đã dùng cách này: búp giữ đều nhau, chồng lên nhau thành một làn mềm.
      mat.opacity = alpha * Math.min(1, .35 + .65 * power);
    },
  };
  api.update(0, 1);
  place();   // đặt búp ngay từ đầu: hộp bao của vật phải đúng cột hơi nước
  return api;
}

// ── mũi tên áp lực: vàng, chỉ ra ngoài khi khí nóng đẩy, vào trong khi hút ─
// Mỗi phần tử phải là **mũi tên thật**: thân trụ, đầu nhọn dẹp rõ hình, hai vây
// đuôi; và tất cả cùng hướng.
export function createArrows({ n = 10, len = .022, rad = .020 } = {}) {
  const g = new THREE.Group(); g.name = 'mui-ten';
  const m = toon('#f7bd27');
  // Đầu mũi tên là **một tam giác dẹp nằm ngang**, không phải một nón kèn:
  // hình tam giác dựng trong mặt phẳng XY, đúc dày, rồi xoay nằm ngang — nhìn
  // từ trên xuống là một mũi tên thật, có đuôi vây.
  const hs = new THREE.Shape();
  hs.moveTo(0, -len * .20);
  hs.lineTo(len * .58, 0);
  hs.lineTo(0, len * .20);
  hs.closePath();
  const headGeo = new THREE.ExtrudeGeometry(hs, { depth: .0018, bevelEnabled: false });
  headGeo.translate(0, 0, -.0009);
  headGeo.rotateX(Math.PI / 2);          // rộng theo z, dày theo y
  const arrows = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2;
    const ar = new THREE.Group();
    ar.position.set(Math.cos(a) * rad, (i % 2 ? .012 : -.012), Math.sin(a) * rad);
    ar.rotation.y = -a;                            // mũi chĩa ra ngoài
    const body = mesh(new THREE.CylinderGeometry(.0018, .0018, len, 10), m, [0, 0, 0], { rot: [0, 0, Math.PI / 2] });
    const head = mesh(headGeo, m, [0, 0, 0]);
    const f1 = mesh(rbox(.0080, .0013, .0055, .0004), m, [0, 0, 0]);
    const f2 = mesh(rbox(.0080, .0013, .0055, .0004), m, [0, 0, 0]);
    ar.add(body, head, f1, f2);
    ar.userData = { body, head, f1, f2, len };
    arrows.push(ar);
    g.add(ar);
  }
  const api = {
    group: g,
    setPower(p, dir = 1) {              // p 0..1, dir +1 ra ngoài, -1 vào trong
      // p = 0 thì mũi tên **không có trong khung**: trước c39 trong bụng chai chưa
      // có gì đẩy, và câu c38 nói rõ mũi tên chưa bung ra.
      g.visible = p > .02;
      arrows.forEach((ar, i) => {
        const u = ar.userData;
        const k = clamp(p) * (1 - .12 * (i % 3));
        const L = u.len * (.25 + k * .75) * dir;
        u.body.scale.y = .25 + k * .75;          // trục của trụ là trục y cục bộ
        u.body.position.x = L * .5;
        u.head.position.x = L;
        u.head.rotation.y = dir > 0 ? 0 : Math.PI;
        u.f1.position.set(-dir * u.len * .50, 0, .0042);
        u.f2.position.set(-dir * u.len * .50, 0, -.0042);
        u.f1.rotation.y = dir > 0 ? .45 : -.45;
        u.f2.rotation.y = dir > 0 ? -.45 : .45;
        ar.visible = k > .02;
      });
    },
    update(t) {
      arrows.forEach((ar, i) => { ar.position.y += Math.sin(t * 1.6 + i) * .0004; });
    },
  };
  api.setPower(1, 1);
  return api;
}

// ── bàn tay người ────────────────────────────────────────────────────────
// Bàn tay của rig dài khoảng 41 cm — quá dài để cầm nắp chai hay quai cốc.
// Thu lại còn 60 %: bàn tay 25 cm, ngón vừa với quai cốc và với nắp chai.
// Bàn tay của rig dài 33 cm ở cỡ .6 — to ngang thân chai, và ngón không với
// tới miệng chai. Cỡ .45 là một bàn tay ~25 cm: đúng cỡ tay người.
export function createHand({ skin = '#e3a883', sleeve = '#56688f' } = {}) {
  const h = buildHand({ skin, sleeve, size: .45 });
  const g = new THREE.Group(); g.name = 'tay';
  g.add(h);
  return { group: g, pose(curl, spread = 0) { h.pose(clamp(curl), clamp(spread)); } };
}

// ── cốc: thành mở, mặt nước thấy được từ trên xuống ─────────────────────
// Cốc của rig có nắp kín (hình trụ đặc), nên nhìn từ trên xuống chỉ thấy một
// đĩa vàng: không thấy nước, cũng không thấy que nhiệt kế cắm trong đó. Cốc
// ở đây có thành mở, vành, đáy và mặt nước thật.
export function createMug(color = '#e8b23c', drink = '#bfe4f2') {
  const g = new THREE.Group(); g.name = 'coc';
  const mat = toon(color);
  g.add(mesh(new THREE.CylinderGeometry(.075, .07, .17, 24, 1, true), mat, [0, .085, 0]));
  g.add(mesh(new THREE.TorusGeometry(.075, .0038, 8, 28), mat, [0, .17, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.CylinderGeometry(.07, .07, .005, 24), mat, [0, .0025, 0]));
  g.add(mesh(new THREE.TorusGeometry(.045, .013, 8, 18), mat, [.085, .09, 0]));
  if (drink) {
    // Mặt nước phải **xanh nhạt bán trong suốt, có vân gợn sóng** — không
    // phải một đĩa trắng đục như sữa. Nhóm gồm cả mặt nước lẫn bọt sôi, để
    // khi mực nước hạ xuống thì bọt đi theo mặt nước.
    const water = new THREE.Group(); water.name = 'water';
    const w = mesh(new THREE.CircleGeometry(.066, 24),
      toon(drink, { transparent: true, opacity: .60, map: rippleTex() }), [0, .15, 0], { rot: [-Math.PI / 2, 0, 0] });
    w.name = 'mat-nuoc';
    water.add(w);
    g.add(water);
    // **Nước sôi** thì phải có dấu hiệu của nước sôi: bọt sôi lên ở mép và
    // một làn hơi mỏng bốc lên. Không có hai thứ đó thì cốc chỉ là cốc nước.
    const r = mulberry(21);
    for (let i = 0; i < 7; i++) {
      const a = r() * Math.PI * 2, d = .048 + r() * .014;
      const b = mesh(new THREE.SphereGeometry(.0016 + r() * .0016, 10, 8), toon('#f2fcff', { transparent: true, opacity: .55 }),
        [Math.cos(a) * d, .152 + r() * .004, Math.sin(a) * d]);
      water.add(b);
    }
    const steam = createSteam({ n: 5, h: .075, r0: .002, r1: .008, size: .0130, alpha: .55 });
    steam.group.name = 'hoi-nuoc-coc';
    steam.group.position.set(0, .175, 0);
    g.add(steam.group);
  }
  return g;
}

// ── danh mục vật cho propcheck ────────────────────────────────────────────
// Mỗi vật một mình, trên sàn, nhìn từ ba phía: có nhận ra ngay là vật gì không?
export const PROPS = {
  'chai nhựa PET có nắp xanh và nhãn xanh': () => createBottle({ cap: true, label: true }).group,
  'chai nhựa PET không nắp, thân gân': () => createBottle({ cap: false, label: false }).group,
  'chai nhựa PET đã co lại, thành nhăn nếp': () => {
    const b = createBottle({ cap: true, label: true });
    b.setState({ shrink: 1, wrinkle: 1 });
    for (let i = 0; i < 200; i++) b.update(0);
    return b.group;
  },
  'chai nhựa PET phồng lên, nắp vặn chặt': () => {
    const b = createBottle({ cap: true, label: true });
    b.setBulgeK(.78);
    b.setState({ bulge: 1 });
    for (let i = 0; i < 200; i++) b.update(0);
    return b.group;
  },
  'chai nhựa PET bị hút vào, méo vào trong': () => {
    const b = createBottle({ cap: true, label: true });
    b.setState({ suck: 1, shrink: .35 });
    for (let i = 0; i < 200; i++) b.update(0);
    return b.group;
  },
  'nắp chai nhựa có ren dọc': () => createCap().group,
  'mẩu preform dày, cổ ren, chưa nong': () => createPreform().group,
  'nhiệt kế bếp có đầu dò, que cắm trong nước, mặt đồng hồ có thang': () => createThermometer().group,
  'đồng hồ áp suất mặt tròn, kim đỏ, không có số': () => createGauge().group,
  // Vòng móc xích **hở** (đoạn của thành chai) + một cột móc xích chồng
  // lên nhau: đó là hai hướng kéo giãng của vật liệu. Vòng kín trông như
  // dây chuyền.
  'móc xích phân tử kéo dài thành hai hướng': () => createChains({
    tube: .0024, R: .105, N: 22, linkL: .020, axialN: 8, axialStep: .020,
    axialL: .020, axialR: .045, span: 4.1,
  }).group,
  'mặt nước gợn sóng trong chai': () => createWaterSurface({ neck: .130 }).group,
  'miếng nhựa thành chai cong, cắt ngang, có bề dày': () => createWallSlice({ R: .050, th: .0060, h: .045, opacity: .45, waist: .22 }).group,
  'hơi nước: búp trắng bốc lên': () => createSteam({ n: 12, h: .130, r0: .006, r1: .024, size: .0240, alpha: .45 }).group,
  'mũi tên vàng chỉ ra ngoài': () => createArrows().group,
  'bàn tay người, ngón ba đốt': () => createHand().group,
  'cốc nước sôi, thành mở, có mặt nước': () => createMug(),
};
