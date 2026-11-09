// Vì sao phơi quần áo cần gió? — đạo cụ của tập (mỗi vật một hàm, tên vật trùng tên trong TREATMENT.md).
// Mọi vật dựng đúng là nó: có bộ phận đặc trưng để nhận ra trong một giây. Vật nào đổi trạng thái
// (ướt → khô, kim cân, giọt nước) thì có hàm set…() nhận 0..1.
import * as THREE from 'three';
import { PAL, toon, glowMat, TEX, rbox, mesh, fxLayer, cushionGeo, surface, mulberry, clamp, lerp, seg, ss, eo, canvasTex } from '../../../../rig/kit.js';

// ── vật liệu dùng chung ────────────────────────────────────────────────
export const M = {
  wood: toon('#ffffff', { map: TEX.wood() }),
  woodDark: toon('#6b3d22'),
  woodPale: toon('#d8b98a'),
  rope: toon('#d9c08a'),
  cream: toon(PAL.cream),
  navy: toon(PAL.navy),
  ink: toon(PAL.ink),
  red: toon(PAL.red),
  cyan: toon(PAL.cyan),
  mustard: toon(PAL.mustard),
  orange: toon(PAL.orange),
  purple: toon(PAL.purple),
  white: toon('#f4efe4'),
  grey: toon('#b9bcc8'),
  metal: toon('#cfd4e2'),
  metalDark: toon('#5c6274'),
  glass: toon('#cdeef6', { transparent: true, opacity: .32, depthWrite: false }),
  plastic: toon('#6fb6d8'),
  towel: toon('#ffffff', { map: TEX.sheet(), side: THREE.DoubleSide }),
};

// ── dây phơi, cọc, kẹp ────────────────────────────────────────────────
// dây thừng chùng giữa hai cọc gỗ
export function dryingLine({ len = 3.2, sag = .22, y = 1.55, hang = false } = {}) {
  const g = new THREE.Group();
  const rope = new THREE.Group(); g.add(rope);
  const curve = gA_ropeCurve(len, sag, y);
  const ropeMat = toon('#ffffff', { map: gA_ropeTex() });
  rope.add(gA_ropeGroup(curve, { r: .0098, twist: .0022, pitch: .05, mat: ropeMat }));
  // hai cọc gỗ đơn giản: một thân + một vạch ngang nhỏ ở chân (không có chân chữ X)
  for (const sx of [-1, 1]) {
    const st = new THREE.Group(); st.position.set(sx * len / 2, 0, 0); g.add(st);
    st.add(mesh(new THREE.CylinderGeometry(.024, .030, y, 12), M.woodDark, [0, y / 2, 0]));
    st.add(mesh(new THREE.CylinderGeometry(.032, .032, .030, 12), M.woodPale, [0, y + .015, 0]));
    // dây buộc quanh đầu cọc
    st.add(mesh(new THREE.TorusGeometry(.028, .0055, 6, 14), ropeMat, [0, y - .034, 0], { rot: [Math.PI / 2, 0, 0] }));
    // chân: một vạch ngang nhỏ, đơn giản
    st.add(mesh(new THREE.CylinderGeometry(.014, .014, .18, 10), M.woodDark, [0, .046, 0], { rot: [0, 0, Math.PI / 2] }));
  }
  // chiều cao của dây tại một chỗ: quần áo treo theo đúng dây, không bay trong không trung
  const yAt = (x) => y - sag * (1 - Math.min(1, (2 * x / len) ** 2));
  // quần áo treo trên dây: đọc ngay là "dây phơi", không phải dây thép
  if (hang) {
    const items = [
      { make: () => gA_plainShirt({ color: '#f2f0e6', w: .56, h: .70 }).group, x: -len * .27, ry: .16 },
      { make: () => trousers({ color: '#4a5a86' }).group, x: len * .02, ry: -.10 },
      { make: () => gA_plainShirt({ color: '#9fd8e8', w: .50, h: .62 }).group, x: len * .28, ry: .20 },
    ];
    for (const it of items) {
      const o = it.make();
      o.position.set(it.x, yAt(it.x) - .006, 0);
      o.rotation.y = it.ry;
      rope.add(o);
      const c = clothesClip({});
      c.group.position.set(it.x + .02, yAt(it.x + .02), 0);
      c.group.rotation.y = it.ry;
      rope.add(c.group);
    }
  }
  // đung đưa: dịch nhẹ cả sợi dây, hai đầu vẫn ở cọc
  return { group: g, rope, curve, len, y, yAt, setSway: (a) => { rope.position.y = a * .012; rope.position.x = a * .008; } };
}

// ── kẹp quần áo bằng gỗ ───────────────────────────────────────────────
// hai hàm gỗ mở chữ V ở trên, lòng kẹp có vạch răng cưa, lò xo thép ở giữa
export function clothesClip({ color = '#e8e2d4' } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Group(); g.add(body);
  const Y0 = -.024, Y1 = .0268;             // đáy bản lề → đầu hàm trên
  const ZO = .0135;                          // hai hàm đứng trước mặt phẳng dây phơi
  // vân gỗ: gỗ sáng, không sơn, không dải trắng, không vòng kim loại
  const woodTex = gA_woodTex();
  const mat = toon('#ffffff', { map: woodTex });
  const brass = toon('#cb8c46');
  const brassDark = toon('#8d5b28');
  // hình một hàm gỗ: mép trong là mặt nghiến, đầu hơi nhọn, mép ngoài thẳng
  const jawPts = [
    [.0006, Y0], [.0009, -.012], [.0014, -.002], [.0030, .010], [.0052, .020],
    [.0062, Y1], [.0148, Y1], [.0140, .020], [.0122, .010], [.0102, -.002],
    [.0106, -.012], [.0098, Y0],
  ];
  const mkJaw = (sign) => {
    const pts = jawPts.map(([x, y]) => [x * sign, y]);
    if (sign < 0) pts.reverse();
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
    s.closePath();
    return s;
  };
  for (const sign of [-1, 1]) {
    const geo = new THREE.ExtrudeGeometry(mkJaw(sign), { depth: .0050, bevelEnabled: false, curveSegments: 4 });
    geo.translate(0, 0, -0.0025);
    // UV theo khung hình của hàm để vân gỗ chạy dọc
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + .011) / .022, (p.getY(i) - Y0) / (Y1 - Y0));
    uv.needsUpdate = true;
    const m = new THREE.Mesh(geo, mat);
    m.position.z = ZO;
    m.castShadow = true; m.receiveShadow = true;
    body.add(m);
  }
  // bản lề: một trụ gỗ nhỏ, hai hàm quanh nó
  const hinge = mesh(new THREE.CylinderGeometry(.0042, .0042, .0090, 10), mat, [0, -.0175, ZO], { rot: [Math.PI / 2, 0, 0] });
  body.add(hinge);
  // lò xo dây xoắn ốc thật quanh bản lề: vài vòng THÉP nhỏ xếp sát nhau, nằm trước bản lề
  // (lò xo to, xoắn ra ngoài hàm, đọc ra là một đĩa có rãnh đồng tâm như móc khóa)
  const hp = [];
  for (let i = 0; i <= 130; i++) {
    const t = i / 130, a = t * Math.PI * 2 * 4.2;
    const rr = .0023 + t * .0019;
    hp.push(new THREE.Vector3(Math.cos(a) * rr, -.0175 + Math.sin(a) * rr, ZO + .0014 + t * .0030));
  }
  const coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hp), 180, .0009, 6, false), toon('#c6ccd6'));
  coil.castShadow = true; body.add(coil);
  // hai đầu dây xoắn nằm trên hàm
  body.add(mesh(new THREE.CylinderGeometry(.0010, .0010, .0044, 6), toon('#8f96a3'), [.0050, -.0140, ZO + .0044], { rot: [0, 0, .8] }));
  body.add(mesh(new THREE.CylinderGeometry(.0010, .0010, .0042, 6), toon('#8f96a3'), [-.0046, -.0132, ZO + .0052], { rot: [0, 0, -.9] }));
  // sống răng cưa ở mặt trong: các gờ ngang chặn vải
  const innerX = (y) => y <= -.012 ? (.0006 + (y + .024) * .0250)
    : y < -.002 ? (.0009 + (y + .012) * .0500)
      : y < .010 ? (.0014 + (y + .002) * .1333)
        : y < .020 ? (.0030 + (y - .010) * .2200)
          : (.0052 + (y - .020) * .1176);
  for (const sign of [-1, 1]) {
    for (let i = 0; i < 5; i++) {
      const y = .001 + i * .0046;
      const r = mesh(rbox(.0011, .0011, .0040, .0004), mat, [sign * (innerX(y) - .0005), y, ZO]);
      r.castShadow = false; body.add(r);
    }
  }
  return { group: g, body };
}

// ── vải: hình áo, nếp, texture ────────────────────────────────────────
// hình áo phông: cổ, vai, tay áo, thân — mép áo cong nhẹ, tay áo xoè sang hai bên
function shirtShape(w = .62, h = .78) {
  const s = new THREE.Shape();
  const nk = w * .125;            // bán kính lỗ cổ
  const nd = w * .080;            // độ sâu lỗ cổ
  const sh = w * .325;            // bề ngang vai
  const ch = w * .395;            // bề ngang thân
  const hem = w * .420;           // bề ngang mép áo
  const tp = w * .545;            // góc ngoài mép tay áo
  const cf = w * .470;            // góc trong mép tay áo
  const drop = h * .165;          // tay áo rũ xuống
  const drop2 = h * .240;         // mép tay áo (lỗ tay áo)
  const arm = h * .300;           // nách
  s.moveTo(-nk, 0);
  s.quadraticCurveTo(-(nk + sh) * .5, -h * .008, -sh, -h * .022);       // vai
  s.quadraticCurveTo(-(sh + tp) * .5, -h * .055, -tp, -drop);           // mép tay áo ngoài
  s.quadraticCurveTo(-tp * .995, -(drop + drop2) * .5, -tp * .960, -drop2); // lỗ tay áo
  s.quadraticCurveTo(-(cf + ch) * .5, -(drop2 + arm) * .5, -ch, -arm);  // gấu tay áo về nách
  s.quadraticCurveTo(-ch * 1.02, -arm - (h - arm) * .55, -hem, -h);     // hông
  s.quadraticCurveTo(0, -h * 1.035, hem, -h);                          // mép áo cong nhẹ
  s.quadraticCurveTo(ch * 1.02, -arm - (h - arm) * .55, ch, -arm);
  s.quadraticCurveTo((cf + ch) * .5, -(drop2 + arm) * .5, cf, -drop2);
  s.quadraticCurveTo(tp * .955, -(drop + drop2) * .5, tp, -drop);
  s.quadraticCurveTo((sh + tp) * .5, -h * .055, sh, -h * .022);
  s.quadraticCurveTo((nk + sh) * .5, -h * .008, nk, 0);
  s.quadraticCurveTo(0, -nd * 2, -nk, 0);                              // cổ tròn
  return s;
}
// đường cổ áo: vòng cong để viền cổ bám sát lỗ cổ
function neckPath(w, dip = -.052, n = 9) {
  const nk = w * .125, pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = -nk + 2 * nk * u;
    pts.push(new THREE.Vector3(x, dip * (1 - Math.pow(x / nk, 2)), .003));
  }
  return new THREE.CatmullRomCurve3(pts);
}

neckPath.ribbed = (curve, r, ribs = 15, seg = 60) => {
  const g = new THREE.TubeGeometry(curve, seg, r, 8, false);
  const p = g.attributes.position, R = 9;
  for (let i = 0; i < p.count; i++) {
    const u = Math.floor(i / R) / seg;
    const c = curve.getPointAt(u);
    const k = 1 + .22 * Math.sin(u * ribs * Math.PI * 2);
    p.setXYZ(i, c.x + (p.getX(i) - c.x) * k, c.y + (p.getY(i) - c.y) * k, c.z + (p.getZ(i) - c.z) * k);
  }
  g.computeVertexNormals();
  return g;
};
// độ sâu nếp vải tại một điểm (toạ độ trong mặt phẳng của chiếc áo)
export const clothZ = (x, y, fold = .030) =>
  (Math.sin(x * 22) * .55 + Math.sin(y * 8 + 1.3) * .45 + Math.sin(x * 9 + y * 4.5) * .5) * fold * (1 + Math.abs(x) * 1.6);
// nếp vải của áo đang treo: nếp dọc, sâu dần về mép, mặt vải phồng nhẹ ở giữa
const hangFold = (x, y, w, h, k = 1) => {
  const t = clamp(-y / h);                       // 0 ở vai, 1 ở mép áo
  const u = clamp(Math.abs(x) / (w * .5));       // 0 giữa, 1 ở mép
  const amp = (.006 + .013 * t) * k;
  const fold = (Math.sin(x * 26 + y * 1.7) * .52
    + Math.sin(x * 14.5 - 1.1) * .30
    + Math.sin(y * 4.6 + .7) * .20
    + Math.sin(x * 43 + y * 5.2) * .12) * amp;
  const bulge = -.050 * w * u * u * (.55 + .45 * t);   // hai mép lùi vào: mặt áo cong, không phẳng như bìa
  return fold + bulge;
};
// vỏ áo: một lớp vải mỏng có mép dày, uốn theo nếp — không có mặt trong, không đọc ra hộp carton
function clothGeo(shape, w = .62, h = .78, fold = 1, thick = .014) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false, curveSegments: 14 });
  g.translate(0, 0, -thick / 2);
  // chia mảnh mặt vải: mặt phẳng ban đầu chỉ có vài chục đỉnh, không chia thì nếp không hiện
  let pos = g.attributes.position.array;
  for (let it = 0; it < 4; it++) {
    const n = pos.length / 3, out = new Float32Array(n * 12);
    let o = 0;
    const tri = (A, B, C) => {
      out[o++] = A[0]; out[o++] = A[1]; out[o++] = A[2];
      out[o++] = B[0]; out[o++] = B[1]; out[o++] = B[2];
      out[o++] = C[0]; out[o++] = C[1]; out[o++] = C[2];
    };
    for (let t = 0; t < n; t += 3) {
      const A = [pos[t * 3], pos[t * 3 + 1], pos[t * 3 + 2]];
      const B = [pos[t * 3 + 3], pos[t * 3 + 4], pos[t * 3 + 5]];
      const C = [pos[t * 3 + 6], pos[t * 3 + 7], pos[t * 3 + 8]];
      const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2];
      const N = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2, (B[2] + C[2]) / 2];
      const P = [(C[0] + A[0]) / 2, (C[1] + A[1]) / 2, (C[2] + A[2]) / 2];
      tri(A, M, P); tri(M, B, N); tri(P, N, C); tri(M, N, P);
    }
    pos = out;
  }
  // gộp đỉnh trùng nhau để mặt vải liền mạch, mép vải bo tròn
  const map = new Map(), vx = [], vy = [], vz = [];
  const idx = new Uint32Array(pos.length / 3);
  for (let i = 0; i < pos.length / 3; i++) {
    const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
    const key = Math.round(x * 1e4) + '_' + Math.round(y * 1e4) + '_' + Math.round(z * 1e4);
    let j = map.get(key);
    if (j === undefined) { j = vx.length; map.set(key, j); vx.push(x); vy.push(y); vz.push(z); }
    idx[i] = j;
  }
  const geo = new THREE.BufferGeometry();
  const P = new Float32Array(vx.length * 3);
  for (let i = 0; i < vx.length; i++) {
    P[i * 3] = vx[i]; P[i * 3 + 1] = vy[i];
    P[i * 3 + 2] = vz[i] + hangFold(vx[i], vy[i], w, h, fold);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(P, 3));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  // UV theo toạ độ vải (mét) để texture dệt giữ đúng tỉ lệ trên mặt và ở mép
  const uv = new Float32Array(vx.length * 2);
  for (let i = 0; i < vx.length; i++) { uv[i * 2] = vx[i]; uv[i * 2 + 1] = vy[i]; }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  // chỗ khâu của khối vải có vài tam giác bẹp, đỉnh ở đó có normal dài bằng 0.
  // shader normalize() ra NaN -> mảng normal có NaN -> pass viền mực sinh NaN -> bloom lan NaN ra cả khung hình (áo thành mảng đen).
  // đặt lại normal dựng đứng cho các đỉnh đó.
  {
    const n = geo.attributes.normal, v = new THREE.Vector3();
    let bad = 0;
    for (let i = 0; i < n.count; i++) {
      v.fromBufferAttribute(n, i);
      if (!(v.lengthSq() > 1e-12)) { n.setXYZ(i, 0, 0, 1); bad++; }
    }
    if (bad) n.needsUpdate = true;
  }
  return geo;
}
// chuẩn hoá UV theo khung hình của tấm vải (để vẽ sọc/nét lên đúng chỗ)
function normUV(geo, x0, x1, y0, y1) {
  const p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    uv.setXY(i, (x - x0) / (x1 - x0), (y - y0) / (y1 - y0));
  }
  uv.needsUpdate = true;
  return geo;
}
// một mảng vải phẳng (mảng ẩm, vệt nước) uốn theo nếp của chiếc áo để nó bám sát, không bay lơ lửng
function clothPatch(w, h, ox, oy, base, w0 = .62, h0 = .78, fold = 1) {
  const g = new THREE.PlaneGeometry(w, h, 20, 22);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    p.setZ(i, hangFold(x + ox, y + oy, w0, h0, fold) + base);
  }
  g.computeVertexNormals();
  return g;
}
// vải dệt: nền bông + mắt dệt + nếp vải, để cận cảnh thấy đúng là vải chứ không phải giấy
const fabricTex = (base = '#efe9db', line = 'rgba(126,112,90,.30)') => canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = base; c.fillRect(0, 0, w, h);
  // sắc màu không đều của vải: các mảng mờ lớn, không phải sọc đều như bìa carton
  const r0 = mulberry(77);
  for (let i = 0; i < 20; i++) {
    const x = r0() * w, bw = 40 + r0() * 140;
    const g = c.createLinearGradient(x, 0, x + bw, 0);
    const k = .015 + r0() * .045;
    g.addColorStop(0, 'rgba(116,104,88,0)');
    g.addColorStop(.5, `rgba(116,104,88,${k})`);
    g.addColorStop(1, 'rgba(116,104,88,0)');
    c.fillStyle = g; c.fillRect(x, 0, bw, h);
  }
  // mắt dệt kim: hàng chữ V nằm ngang — thấy rõ ở cận cảnh
  c.lineCap = 'round';
  for (let y = 0; y < h; y += 7) {
    for (let x = 0; x < w; x += 7) {
      c.strokeStyle = line; c.globalAlpha = .32; c.lineWidth = 1.3;
      c.beginPath(); c.moveTo(x, y + 3.5); c.quadraticCurveTo(x + 3.5, y - 1.2, x + 7, y + 3.5); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.globalAlpha = .5; c.lineWidth = .9;
      c.beginPath(); c.moveTo(x, y + 4.8); c.quadraticCurveTo(x + 3.5, y + .2, x + 7, y + 4.8); c.stroke();
    }
  }
  c.globalAlpha = 1;
  // vài nếp ngang
  c.strokeStyle = 'rgba(120,112,98,.09)'; c.lineWidth = 2;
  for (let y = 40; y < h; y += 96) { c.beginPath(); c.moveTo(0, y + Math.sin(y) * 4); c.lineTo(w, y + Math.cos(y) * 4); c.stroke(); }
  const r = mulberry(41);
  for (let k = 0; k < 6000; k++) { c.fillStyle = `rgba(70,66,90,${r() * .06})`; c.fillRect(r() * w, r() * h, 2, 2); }
});

fabricTex.fold = () => {
  const t = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#808080'; c.fillRect(0, 0, w, h);
    const r = mulberry(19);
    for (let i = 0; i < 20; i++) {
      const x = r() * w, bw = 5 + r() * 20;
      const g = c.createLinearGradient(x - bw, 0, x + bw, 0);
      g.addColorStop(0, '#808080');
      g.addColorStop(.5, r() > .5 ? '#d4d4d4' : '#4a4a4a');
      g.addColorStop(1, '#808080');
      c.fillStyle = g; c.fillRect(x - bw, 0, bw * 2, h);
    }
    for (let k = 0; k < 2600; k++) { const v = 96 + ((r() * 70) | 0); c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(r() * w, r() * h, 2, 2); }
  });
  t.colorSpace = THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2.4, 2.8);
  return t;
};

fabricTex.rib = () => {
  const t = canvasTex(64, 64, (c, w, h) => {
    c.fillStyle = '#808080'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 8; i++) {
      const g = c.createLinearGradient(i * 8, 0, i * 8 + 8, 0);
      g.addColorStop(0, '#3c3c3c'); g.addColorStop(.5, '#d0d0d0'); g.addColorStop(1, '#3c3c3c');
      c.fillStyle = g; c.fillRect(i * 8, 0, 8, h);
    }
  });
  t.colorSpace = THREE.NoColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1);
  return t;
};
// mảng ẩm: mép loang không đều, không phải hình tròn hay giọt lá
const blotTex = () => canvasTex(256, 256, (c, w, h) => {
  c.clearRect(0, 0, w, h);
  const r = mulberry(12);
  // mép trên méo mó
  const edge = (u) => h * (.30 + .10 * Math.sin(u * 7.3) + .05 * Math.sin(u * 17.1 + 1.1) + .03 * Math.sin(u * 31.7));
  c.beginPath();
  c.moveTo(0, h);
  for (let i = 0; i <= 48; i++) { const u = i / 48; c.lineTo(u * w, edge(u)); }
  c.lineTo(w, h); c.closePath();
  const g = c.createLinearGradient(0, h * .26, 0, h);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(.16, 'rgba(255,255,255,.50)');
  g.addColorStop(.46, 'rgba(255,255,255,.78)');
  g.addColorStop(1, 'rgba(255,255,255,.58)');
  c.fillStyle = g; c.fill();
  // loang nhỏ trong vùng ẩm
  for (let i = 0; i < 40; i++) {
    const u = r(), y = edge(u) + r() * (h - edge(u));
    c.globalAlpha = .10 + r() * .16;
    c.fillStyle = '#ffffff';
    c.beginPath(); c.ellipse(u * w, y, 10 + r() * 34, 6 + r() * 16, r() * 3, 0, 7); c.fill();
  }
  c.globalAlpha = 1;
  // làm mềm cả bốn mép: mảng ẩm phải loang, không được thành tấm kính phẳng
  c.globalCompositeOperation = 'destination-in';
  const gg = c.createRadialGradient(w / 2, h * .62, w * .10, w / 2, h * .60, w * .60);
  gg.addColorStop(0, 'rgba(0,0,0,1)');
  gg.addColorStop(.60, 'rgba(0,0,0,.94)');
  gg.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = gg; c.fillRect(0, 0, w, h);
  c.globalCompositeOperation = 'source-over';
});
// một giọt nước: tròn ở trên, nhọn ở dưới, có điểm sáng trên mặt
function teardrop(r, mat, { tail = .8, h = 1.0, hiMat = null, hiR = .22 } = {}) {
  const gr = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), mat);
  body.scale.set(1, .92, 1); body.castShadow = true; gr.add(body);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(r * .58, r * tail * 1.6, 16), mat);
  tip.position.y = -r * .82; tip.rotation.z = Math.PI; tip.castShadow = true; gr.add(tip);
  const hi = new THREE.Mesh(new THREE.SphereGeometry(r * hiR, 12, 10), hiMat || glowMat('#ffffff', .7));
  hi.position.set(-r * .30, r * .28, r * .70); hi.scale.set(1, .75, .40); gr.add(hi);
  return { group: gr, body, tip, hi };
}

// ── áo phông (ướt → khô) ──────────────────────────────────────────────
export function tShirt({ color = '#f2f0e6', wetColor = '#b3bac9', w = .62, h = .78, drops = false } = {}) {
  const g = new THREE.Group();
  const dryC = new THREE.Color(color);
  // vải ướt: cùng sắc vải nhưng tối hơn và hơi bóng — bớt bão hòa để không bao giờ ra tím, không ra xanh lam
  const wc = new THREE.Color(wetColor), wh = {};
  wc.getHSL(wh);
  const dampC = new THREE.Color().setHSL(wh.h, Math.min(wh.s, .09), wh.l);   // xỉn, gần như không màu
  const mixC = dryC.clone().lerp(dampC, .34).lerp(dryC, .15);               // pha nhẹ khoảng 1/3, giữ sắc kem
  const lum = (c) => c.r * .299 + c.g * .587 + c.b * .114;
  const wetMul = mixC.clone();
  // vải ướt phải TỐI HƠN NHIỀU: hiên nắng sớm làm mặt áo chói lên, nếu chỉ sẫm 1/3
  // thì sau bậc "soft shoulder" của bộ màu, vùng ướt và vùng khô ra cùng một sắc —
  // người xem không thấy chỗ nào ướt. Sẫm còn ~2/3 mới đọc ra mảng ẩm.
  if (lum(wetMul) > 1e-3) wetMul.multiplyScalar(lum(dryC) * .34 / lum(wetMul));
  // sắc bạc nhạt của vải ướt: hơi lạnh, nhưng không bao giờ ra tím hay xanh lam đậm
  wetMul.r *= .965; wetMul.g *= .995; wetMul.b *= 1.085;
  const tex = fabricTex();
  tex.repeat.set(2.2, 2.6); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const mat = toon('#ffffff', { side: THREE.DoubleSide, map: tex, bumpMap: fabricTex.fold(), bumpScale: .05, vertexColors: true });
  const shape = shirtShape(w, h);
  const geo = clothGeo(shape, w, h, 1, .014);
  const p = geo.attributes.position;
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(p.count * 3).fill(1), 3));
  // đường ẩm: chạy ngang, méo mó — biên mềm, không phải mảng màu loang
  const wetEdge = (x) => -h * .30 + .020 * Math.sin(x * 7.5) + .012 * Math.sin(x * 13.7 + 1.1) + .006 * Math.sin(x * 23 + .4);
  const wetAt = (x, y) => clamp((wetEdge(x) - y) / .022);
  // dải tối mờ ngay dưới đường ẩm: đọc ra là đường triều nước trên vải
  const tideAt = (x, y) => { const d = (wetEdge(x) - y - .026) / .042; return Math.exp(-d * d) * clamp((wetEdge(x) - y) / .012); };
  // ánh bóng ướt: lớp nước mỏng bắt sáng ngay dưới dải tối
  const sheenAt = (x, y) => { const d = (wetEdge(x) - y - .075) / .030; return Math.exp(-d * d); };
  // vài chỗ sáng loáng trên vùng ẩm
  const glint = (x, y) => {
    let s = 0;
    for (const [gx, gy, r] of [[-.12, -.42, .062], [.08, -.54, .050], [.00, -.34, .042]]) {
      const dx = (x - gx * w) / r, dy = (y - gy * h) / r;
      s = Math.max(s, Math.exp(-(dx * dx + dy * dy)));
    }
    return s;
  };
  const body = mesh(geo, mat, [0, 0, 0]);
  const cloth = new THREE.Group(); cloth.add(body); g.add(cloth);
  // cổ áo: viền gân tròn bám sát lỗ cổ, nối liền vai
  const nk = w * .125, nd = w * .080;
  const cmat = toon('#ffffff', { map: fabricTex(), bumpMap: fabricTex.rib(), bumpScale: .5 });
  cmat.map.repeat.set(4, 1); cmat.map.wrapS = cmat.map.wrapT = THREE.RepeatWrapping;
  const collar = mesh(neckPath.ribbed(neckPath(w, -nd, 18), .0105), cmat, [0, 0, 0]);
  g.add(collar);
  // trong lỗ cổ có bóng tối (không phải lỗ hổng xuyên ra nền)
  g.add(mesh(new THREE.SphereGeometry(1, 16, 12).scale(nk * .84, .011, .024), toon('#4a4034'), [0, -nd * .55, -.020], { cast: false, recv: false }));
  // gấu áo: gờ vải gấp hai lớp ở mép dưới
  const hemPts = shape.getPoints(140).filter(pt => pt.y < -h * .955)
    .map(pt => new THREE.Vector3(pt.x, pt.y, .009 + hangFold(pt.x, pt.y, w, h, 1)));
  if (hemPts.length > 3) cloth.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hemPts), hemPts.length, .0032, 6, false), cmat, [0, 0, 0]));
  // vài giọt nước nhỏ tròn bám trên vải, bắt sáng — đọc ra là giọt nước, không phải chấm xanh.
  // Giọt đặt ở LỚP FX (không viền mực): nếu có viền mực, ba hạt ở mép áo sẽ đọc thành ba hạt tối.
  const waterMat = toon('#8fdcf6', { transparent: true, opacity: .90, depthWrite: false });   // thân giọt: bắt sáng, lạnh
  const waterHiMat = toon('#ffffff', { transparent: true, opacity: .97, depthWrite: false });  // điểm sáng trên mặt giọt
  const beads = [];
  for (const [bx, by, br] of [[-.13, -.36, .0140], [.06, -.42, .0155], [.15, -.34, .0105], [-.02, -.55, .0115]]) {
    const x = bx * w, y = by * h;
    const z = .013 + hangFold(x, y, w, h, 1);
    const bg = new THREE.Group();
    const b0 = new THREE.Mesh(new THREE.SphereGeometry(br, 18, 14), waterMat);
    b0.scale.set(1, 1, .46); b0.position.set(x, y, z + br * .22); b0.castShadow = true; bg.add(b0);
    const h0 = new THREE.Mesh(new THREE.SphereGeometry(br * .36, 12, 10), waterHiMat);
    h0.position.set(x - br * .34, y + br * .40, z + br * .60); h0.scale.set(1, .70, .40); bg.add(h0);
    fxLayer(bg);
    cloth.add(bg); beads.push(bg);
  }
  // vài giọt nước nhỏ bám ở mép dưới
  const hemDrops = [];
  for (const u of (drops ? [-.10, 0, .10] : [])) {
    const dx = u * w, t = clamp((dx / (w * .352) + 1) / 2);
    const y = -h * (1 + .07 * t * (1 - t));
    const td = teardrop(.0105, waterMat, { tail: 1.35, hiMat: waterHiMat, hiR: .34 });
    td.group.position.set(dx, y + .003, .013 + hangFold(dx, y, w, h, 1));
    td.group.rotation.z = (dx > 0 ? 1 : -1) * .16;
    fxLayer(td.group);
    cloth.add(td.group); hemDrops.push(td.group);
  }
  let wetK = 1;
  const setWet = (k) => {
    wetK = clamp(k);
    // cả áo giữ sắc kem: không bao giờ nhuộm tím hay xanh lam
    mat.color.copy(dryC).lerp(dampC, .10 * wetK);
    cmat.color.copy(dryC).lerp(dampC, .12 * wetK);
    const c = geo.attributes.color;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const m = wetAt(x, y) * wetK;
      const tide = tideAt(x, y) * wetK;
      const sh = (sheenAt(x, y) * .12 + glint(x, y) * .10) * wetK;
      const pool = 1 - .10 * clamp((wetEdge(x) - y) / (h * .55)) * wetK;      // nước dồn nhẹ xuống mép
      // vải ướt: cùng sắc, tối hơn ~1/3, hơi bóng
      let r = lerp(1, wetMul.r, m), gg = lerp(1, wetMul.g, m), b = lerp(1, wetMul.b, m);
      // đường ẩm: dải tối mờ chạy ngang
      const dk = 1 - .24 * tide;
      r *= dk; gg *= dk; b *= dk;
      // ánh bóng ướt: loáng nhẹ, hơi lạnh nhưng không tím
      r += sh * .90; gg += sh * .95; b += sh;
      c.setXYZ(i, r * pool, gg * pool, b * pool);
    }
    c.needsUpdate = true;
    cloth.scale.y = lerp(1, .975, wetK);          // vải ướt nặng, xuống thấp hơn
    for (const d of hemDrops) { d.visible = wetK > .25; d.scale.setScalar(clamp((wetK - .2) / .8) || .001); }
    for (const b of beads) { const s = clamp((wetK - .35) / .65) || .001; b.visible = wetK > .35; b.scale.setScalar(s); }
  };
  setWet(1);
  return { group: g, body, collar, drops: hemDrops, setWet, get wet() { return wetK; } };
}

// áo úp: áo phông ướt úp mép dưới lên (nửa dưới gập lên nửa trên), mặt ướt nằm ra ngoài.
// Đọc ra là MỘT CÁI ÁO ĐÃ GẤP — vẫn thấy cổ, vai, tay áo, nhưng thân áo bị úp lên,
// và mảng ẩm của nửa dưới nằm nằm ngang trên mặt gấp.
export function foldedShirt({ color = '#f2f0e6', wetColor = '#aab2c4', w = .62, h = .72 } = {}) {
  const g = new THREE.Group();
  const dryC = new THREE.Color(color);
  const wc = new THREE.Color(wetColor);
  // MÀU VẢI THẬT của tấm áo là nền texture (kem). Vùng ẩm phải CÙNG HỌ MÀU với áo:
  // vải ướt chỉ TỐI hơn và BÓNG hơn, không phải một mảng xám lạnh khác màu.
  // Dùng màu riêng cho vùng ẩm sẽ đọc thành "váy hai màu", không còn là một cái áo.
  const fabricC = new THREE.Color('#efe9db');
  const dampC = fabricC.clone().lerp(wc, .16);                 // chỉ ngả lạnh nhẹ
  const wetMul = dampC.clone().multiplyScalar(.40);             // sẫm hơn ~2,5 lần, cùng sắc
  const tex = fabricTex();
  tex.repeat.set(2.2, 2.6); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const mat = toon('#ffffff', { side: THREE.DoubleSide, map: tex, bumpMap: fabricTex.fold(), bumpScale: .05, vertexColors: true });
  const shape = shirtShape(w, h);
  const geo = clothGeo(shape, w, h, 1, .014);
  const p = geo.attributes.position;
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(p.count * 3).fill(1), 3));
  const foldY = -h * .70;                                   // đường gấp: nửa dưới úp lên nửa trên
  // ranh giới ẩm: mép loang theo nếp vải — không phải đường ngang thẳng cứng
  const wetEdge = (x) => foldY + .034 * Math.sin(x * 5.3 + .7)
    + .018 * Math.sin(x * 11.9 + 2.1) + .010 * Math.sin(x * 23.7 - .8);
  const wetAt = (x, y) => clamp((wetEdge(x) - y) / .030);
  // vệt nước chảy dọc trong vùng ẩm
  const runAt = (x, y) => {
    let s = 0;
    for (const sx of [-.19, .01, .20]) {
      const dx = (x - sx * w) / .026;
      s = Math.max(s, Math.exp(-dx * dx * 1.2));
    }
    return s * clamp((wetEdge(x) - y) / .05);
  };
  // loang ẩm không đều: vải ướt không phải một mảng phẳng
  const blotAt = (x, y) => clamp(.5
    + .30 * Math.sin(x * 27.3 + y * 13.1)
    + .18 * Math.sin(x * 51.7 - y * 31.3)
    + .12 * Math.sin(x * 9.1 + y * 6.7));
  // ánh ướt loáng: hai dải sáng dọc trên mặt vải ướt
  const glossAt = (x, y) => {
    let s = 0;
    for (const sx of [-.10, .13]) {
      const dx = (x - sx * w) / .034;
      s = Math.max(s, Math.exp(-dx * dx * 1.1));
    }
    return s * clamp((wetEdge(x) - y) / .06);
  };
  const c = geo.attributes.color;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const m = wetAt(x, y), run = runAt(x, y), bl = blotAt(x, y), gl = glossAt(x, y);
    let r = lerp(1, wetMul.r, m), gg = lerp(1, wetMul.g, m), b = lerp(1, wetMul.b, m);
    // loang: vùng ẩm không đều màu
    const mo = 1 - .16 * (1 - bl);
    r *= mo; gg *= mo; b *= mo;
    // vệt nước chảy: sẫm hơn
    r *= 1 - .16 * run; gg *= 1 - .16 * run; b *= 1 - .14 * run;
    // nước dồn ở nếp gấp
    const dp = foldY - y;
    const pool = 1 - .13 * Math.exp(-(dp / .045) * (dp / .045));
    r *= pool; gg *= pool; b *= pool;
    // bóng mềm dưới cuộn mép gấu (mép áo gập lên nằm trên, đổ bóng xuống dải gấp)
    const sd = (dp - .215) / .030;
    const sh2 = Math.exp(-sd * sd) * (y < foldY ? 1 : 0);
    r *= 1 - .12 * sh2; gg *= 1 - .12 * sh2; b *= 1 - .11 * sh2;
    // loáng ướt
    r += gl * .13; gg += gl * .14; b += gl * .16;
    c.setXYZ(i, r, gg, b);
  }
  c.needsUpdate = true;
  // ── GẤP: nửa dưới úp lên nửa trên, quanh đường ngang ở 60 % chiều dài áo ──
  // (quay 180° quanh đường gấp: y' = 2y0 − y, z' = 2z(nét gấp) − z — vải lật mặt)
  const y0 = -h * .70;
  const zLine = x => hangFold(x, y0, w, h, 1);
  // nếp gấp mềm: trong một dải hẹp quanh đường gấp, vải chuyển dần từ thẳng sang lật
  // (nếu gấp cứng, mặt vải bị rách ở đường gấp và viền mực thành răng cưa)
  // NẾP GẤP THẬT: vải uốn quanh một nửa trụ đường kính 2r rồi nằm úp lên mặt áo.
  // (gấp cứng — lật thẳng tấm vải — làm mép nếp thành đường răng cưa, vải mềm phải có bán kính)
  const r = .018;
  const foldPt = (x, y, z) => {
    const d = y0 - y;                                  // d > 0: vải nằm dưới nếp gấp
    if (d <= 0) return [x, y, z];
    const zl = zLine(x);
    if (d <= Math.PI * r) {                            // đang uốn quanh nếp
      const th = d / r;
      return [x, y0 - r * Math.sin(th), zl + r - r * Math.cos(th) + (z - zl)];
    }
    const s = d - Math.PI * r;                         // đã nằm úp trên mặt áo
    return [x, y0 + s, zl + 2 * r + (z - zl)];
  };
  for (let i = 0; i < p.count; i++) {
    const [x, y, z] = foldPt(p.getX(i), p.getY(i), p.getZ(i));
    p.setXYZ(i, x, y, z);
  }
  p.needsUpdate = true; geo.computeVertexNormals();
  const body = mesh(geo, mat, [0, 0, 0]);
  g.add(body);
  // cổ áo + lỗ cổ tối: nằm ở nửa trên, KHÔNG bị úp phủ → vẫn đọc ra là áo
  const nk = w * .125, nd = w * .080;
  const cmat = toon('#ffffff', { map: fabricTex(), bumpMap: fabricTex.rib(), bumpScale: .5 });
  cmat.map.repeat.set(4, 1); cmat.map.wrapS = cmat.map.wrapT = THREE.RepeatWrapping;
  // VIỀN CỔ TRÒN LIỀN: gân nổi bằng texture, KHÔNG xâu hạt rời (đọc thành chuỗi hạt trai)
  g.add(mesh(new THREE.TubeGeometry(neckPath(w, -nd, 18), 64, .0120, 12, false), cmat, [0, 0, 0]));
  g.add(mesh(new THREE.SphereGeometry(1, 16, 12).scale(nk * .84, .011, .024), toon('#4a4034'), [0, -nd * .55, -.020], { cast: false, recv: false }));
  // chỉ may: đường vai, viền cổ tay — dấu hiệu "đây là áo phông may", không phải mảnh vải
  const threadMat = toon('#b3a88f');
  const sh2 = w * .325, tp2 = w * .545, dr1 = h * .165, dr2 = h * .240;
  for (const sgn of [-1, 1]) {
    // đường may vai: chỉ thêu chạy từ cổ ra vai
    const sp = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8, u = 1 - t;
      const x = sgn * (u * u * nk + 2 * u * t * (nk + sh2) * .5 + t * t * sh2);
      const y = -(2 * u * t * h * .008 + t * t * h * .022);
      sp.push(new THREE.Vector3(x, y, .0085 + hangFold(x, y, w, h, 1)));
    }
    const shm = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sp), 16, .0016, 5, false), threadMat, [0, 0, 0]);
    shm.castShadow = false; g.add(shm);
    // ống tay ngắn: mép cổ tay dày (viền) + đường may ngay trong
    const cp = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, u = 1 - t;
      const x = sgn * (u * u * tp2 + 2 * u * t * tp2 * .995 + t * t * tp2 * .960);
      const y = -(u * u * dr1 + 2 * u * t * (dr1 + dr2) * .5 + t * t * dr2);
      cp.push(new THREE.Vector3(x, y, .0085 + hangFold(x, y, w, h, 1)));
    }
    g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cp), 20, .0042, 7, false), cmat, [0, 0, 0]));
    const stp = cp.map(pt => new THREE.Vector3(pt.x - sgn * .0075, pt.y + .0035, pt.z - .0015));
    const st = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stp), 20, .0013, 5, false), threadMat, [0, 0, 0]);
    st.castShadow = false; g.add(st);
  }
  // túi ngực nhỏ: mảnh vải dán lên ngực, có đường may miệng túi
  {
    const px = -w * .155, py = -h * .215;
    const ptex = fabricTex('#e6dfce');
    ptex.repeat.set(2, 2); ptex.wrapS = ptex.wrapT = THREE.RepeatWrapping;
    g.add(mesh(clothPatch(.070, .055, px, py, .0092, w, h, 1), toon('#ffffff', { side: THREE.DoubleSide, map: ptex }), [px, py, 0]));
    const mp = [];
    for (let i = 0; i <= 6; i++) {
      const x = px - .035 + .070 * (i / 6), y = py + .0275;
      mp.push(new THREE.Vector3(x, y, .0108 + hangFold(x, y, w, h, 1)));
    }
    const st = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mp), 12, .0014, 5, false), threadMat, [0, 0, 0]);
    st.castShadow = false; g.add(st);
  }
  // MÉP GẤP: cuộn nếp TRÒN MỜM ở mép trên dải gấp + đường may mép áo thấy rõ trong dải
  {
    const hp = shape.getPoints(160).filter(pt => pt.y < -h * .955)
      .map(pt => {
        const z = .009 + hangFold(pt.x, pt.y, w, h, 1);
        const [x, y, zz] = foldPt(pt.x, pt.y, z);
        return new THREE.Vector3(x, y, zz);
      });
    if (hp.length > 3) {
      g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hp), hp.length, .0072, 10, false), cmat, [0, 0, 0]));
      // đường may mép áo: chỉ thêu nằm trong dải gấp, ngay dưới cuộn mép
      const sp = hp.map(pt => new THREE.Vector3(pt.x, pt.y - .013, pt.z + .0015));
      const st = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sp), hp.length, .0014, 5, false), threadMat, [0, 0, 0]);
      st.castShadow = false; g.add(st);
    }
  }
  // GIỌT NƯỚC: hạt TRÒN BÓNG, có điểm sáng trắng — không phải chấm xanh dẹt (đọc thành nút áo)
  const waterMat = toon('#a8e8fa', { transparent: true, opacity: .94, depthWrite: false });
  const waterHiMat = toon('#ffffff', { transparent: true, opacity: .98, depthWrite: false });
  for (const [bx, by, br] of [[-.16, -.79, .0130], [.05, -.86, .0140], [.17, -.82, .0105]]) {
    const x = bx * w, y = by * h;
    const z = .013 + hangFold(x, y, w, h, 1);
    const [fx, fy, fz] = foldPt(x, y, z);
    const fz2 = fz + .006;                    // giọt nằm TRÊN mặt vải đã úp
    const bg = new THREE.Group();
    const b0 = new THREE.Mesh(new THREE.SphereGeometry(br, 20, 14), waterMat);
    b0.scale.set(1, 1, .88); b0.position.set(fx, fy, fz2 + br * .42); bg.add(b0);
    const h0 = new THREE.Mesh(new THREE.SphereGeometry(br * .34, 12, 10), waterHiMat);
    h0.position.set(fx - br * .30, fy + br * .32, fz2 + br * .92); h0.scale.set(1, .78, .55); bg.add(h0);
    fxLayer(bg);
    g.add(bg);
  }
  return { group: g, body };
}

// áo phơi một mặt: MỘT chiếc áo, ranh giới ẩm/khô là đường cong loang, không đều
export function halfShirt({ w = .62, h = .78 } = {}) {
  const g = new THREE.Group();
  const tex = fabricTex();
  tex.repeat.set(2.2, 2.6); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const mat = toon('#ffffff', { side: THREE.DoubleSide, map: tex, bumpMap: fabricTex.fold(), bumpScale: .05, vertexColors: true });
  const shape = shirtShape(w, h);
  const geo = clothGeo(shape, w, h, 1, .014);
  const p = geo.attributes.position;
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(p.count * 3).fill(1), 3));
  // ranh giới ẩm: uốn lượn theo nếp vải, KHÔNG phải đường thẳng ngang
  const edge = (x) => -h * .42
    + .048 * Math.sin(x * 6.1 + .4)
    + .026 * Math.sin(x * 11.3 + 1.7)
    + .013 * Math.sin(x * 22.1 + 2.4)
    + .008 * Math.sin(x * 3.1 - .9);
  // mép ẩm nhấp nhô: nhiễu theo nếp vải để biên loang, mềm (không phải đường cắt thẳng)
  const edgeAt = (x, y) => edge(x) + .011 * Math.sin(x * 43 + y * 19) + .006 * Math.sin(x * 79 - y * 31);
  // vệt nước chảy xuống mép dưới: hai cột hẹp chạy từ biên ẩm xuống gấu
  const streak = (x, y) => {
    let s = 0;
    for (const sx of [-.11, .13]) {
      const dx = (x - sx * w) / .013;
      const dy = (y - edge(x)) / (h * .55);
      if (dy < 0 || dy > 1.15) continue;
      const fade = 1 - clamp((dy - .85) / .30);
      s = Math.max(s, Math.exp(-dx * dx * 1.6) * fade);
    }
    return s;
  };
  // mảng ẩm nhỏ lan lên nửa trên: vải ướt thấm ngược lên
  const creep = (x, y) => {
    const dx = (x - .01 * w) / (.085 * w), dy = (y + h * .385) / (.055 * h);
    return Math.exp(-(dx * dx + dy * dy) * 1.1);
  };
  // bóng ướt loáng: dải sáng mảnh ngay dưới biên ẩm
  const glint = (x, y) => {
    const d = (edgeAt(x, y) - y - .035) / .045;
    return Math.exp(-d * d);
  };
  const c = geo.attributes.color;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const line = edgeAt(x, y);
    const wet = clamp(Math.max(clamp((line - y) / .055), creep(x, y)));   // biên mềm, loang
    const st = streak(x, y) * clamp((line - y) / .10);                    // vệt nước chảy
    const gl = glint(x, y) * wet;
    // vải ướt: xanh xám đậm, TỐI hơn hẳn nửa khô
    let r = lerp(1, .20, wet), gg = lerp(1, .23, wet), b = lerp(1, .28, wet);
    r *= 1 - .20 * st; gg *= 1 - .20 * st; b *= 1 - .14 * st;              // vệt chảy đậm hơn
    const pool = 1 - .10 * clamp((line - y) / (h * .55)) * wet;
    r = (r + gl * .16) * pool; gg = (gg + gl * .17) * pool; b = (b + gl * .21) * pool;
    c.setXYZ(i, r, gg, b);
  }
  c.needsUpdate = true;
  const body = mesh(geo, mat, [0, 0, 0]);
  g.add(body);
  // cổ áo: viền gân tròn bám sát lỗ cổ, nối liền vai
  const nk = w * .125, nd = w * .080;
  const cmat = toon('#ffffff', { map: fabricTex(), bumpMap: fabricTex.rib(), bumpScale: .5 });
  cmat.map.repeat.set(4, 1); cmat.map.wrapS = cmat.map.wrapT = THREE.RepeatWrapping;
  g.add(mesh(neckPath.ribbed(neckPath(w, -nd, 18), .0105), cmat, [0, 0, 0]));
  // trong lỗ cổ có bóng tối (không phải lỗ hổng xuyên ra nền)
  g.add(mesh(new THREE.SphereGeometry(1, 16, 12).scale(nk * .84, .011, .024), toon('#4a4034'), [0, -nd * .55, -.020], { cast: false, recv: false }));
  // gấu áo: gờ vải gấp hai lớp ở mép dưới
  const hemPts = shape.getPoints(140).filter(pt => pt.y < -h * .955)
    .map(pt => new THREE.Vector3(pt.x, pt.y, .009 + hangFold(pt.x, pt.y, w, h, 1)));
  if (hemPts.length > 3) g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hemPts), hemPts.length, .0032, 6, false), cmat, [0, 0, 0]));
  // GIỌT NƯỚC: hạt TRÒN, bóng, có điểm sáng trắng, nằm dọc đường biên ẩm.
  // Đặt ở lớp FX (không viền mực): có viền mực thì đọc thành hàng nút áo.
  const waterMat = toon('#9fe0f2', { transparent: true, opacity: .92, depthWrite: false });
  const waterHiMat = toon('#ffffff', { transparent: true, opacity: .98, depthWrite: false });
  const bead = (dx, dy, br) => {
    const bg = new THREE.Group();
    const b0 = new THREE.Mesh(new THREE.SphereGeometry(br, 20, 14), waterMat);
    b0.scale.set(1, 1, .55);
    b0.position.set(dx, dy, .013 + hangFold(dx, dy, w, h, 1) + br * .22);
    bg.add(b0);
    // điểm sáng trắng trên mặt giọt: đọc ra là giọt nước bóng, không phải chấm màu
    const hi = new THREE.Mesh(new THREE.SphereGeometry(br * .38, 12, 10), waterHiMat);
    hi.scale.set(1, .70, .40);
    hi.position.set(dx - br * .32, dy + br * .40, .013 + hangFold(dx, dy, w, h, 1) + br * .58);
    bg.add(hi);
    fxLayer(bg);
    g.add(bg);
    return bg;
  };
  // các giọt bám dọc đường biên ẩm, lệch nhau (không thành hàng thẳng như nút áo)
  for (const [ux, uy, br] of [[-.17, .004, .0105], [-.06, -.008, .0130], [.05, .006, .0115], [.155, -.006, .0090], [.215, .008, .0075]]) {
    const dx = ux * w;
    bead(dx, edgeAt(dx, edge(dx)) + uy, br);
  }
  // hai giọt to hơn nằm trong vùng ẩm, dưới biên
  bead(-.10 * w, edge(-.10 * w) - h * .16, .0140);
  bead(.12 * w, edge(.12 * w) - h * .10, .0115);
  // một giọt đang rơi ở mép dưới (đầu nhọn quay lên)
  {
    const dm = toon('#9fe0f2', { transparent: true, opacity: .92, depthWrite: false });
    const fall = teardrop(.012, dm, { tail: .8, hiMat: waterHiMat });
    fall.group.position.set(.05, -h - .045, .014);
    fall.group.rotation.z = Math.PI;
    fxLayer(fall.group);
    g.add(fall.group);
  }
  // KẸP GỖ treo áo lên dây phơi: nhắc bối cảnh "đang phơi", không phải mảnh vải lơ lửng
  {
    const clip = clothesClip({});
    // bám vào mép vai (điểm trên cao nhất của vải ở bên phải) để kẹp bám đúng chỗ
    const sp = shape.getPoints(220);
    let topY = -h, topX = w * .22;
    for (const pt of sp) if (pt.x > w * .10 && pt.x < w * .30 && pt.y > topY) { topY = pt.y; topX = pt.x; }
    clip.group.position.set(topX, topY + .006, .006);
    clip.group.rotation.z = .18;
    g.add(clip.group);
  }
  return { group: g, body };
}

// áo phơi rộng: hai mặt phơi ra, nằm ngửa — hình đối chiếu với cái áo úp
export function spreadShirt({ color = '#f2f0e6', w = .78, h = .74 } = {}) {
  const g = new THREE.Group();
  const outC = new THREE.Color(color);
  const inC = new THREE.Color(color).lerp(new THREE.Color('#87837a'), .62);      // lớp trong tối hơn
  const tex = fabricTex();
  tex.repeat.set(2.4, 2.4); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const outMat = toon('#ffffff', { side: THREE.DoubleSide, map: tex, bumpMap: fabricTex.fold(), bumpScale: .05 });
  const inTex = fabricTex('#ded8c8');
  inTex.repeat.set(2.4, 2.4); inTex.wrapS = inTex.wrapT = THREE.RepeatWrapping;
  const inMat = toon('#ffffff', { side: THREE.DoubleSide, map: inTex, bumpMap: fabricTex.fold(), bumpScale: .05 });
  outMat.color.copy(outC);
  inMat.color.copy(inC);
  // hình áo trải rộng: nửa trái là MẶT NGOÀI, nửa phải là MẶT TRONG (áo bị gập ngược)
  const nk = w * .115, nd = w * .072, sh = w * .200, ch = w * .270, tp = w * .600, hem = w * .300;
  const drop = h * .100, drop2 = h * .255, arm = h * .335;
  // lấy điểm trên một đoạn cung bậc hai
  const qPts = (p0, c, p1, n) => {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      out.push(new THREE.Vector2(u * u * p0.x + 2 * u * t * c.x + t * t * p1.x, u * u * p0.y + 2 * u * t * c.y + t * t * p1.y));
    }
    return out;
  };
  const neckPts = qPts(new THREE.Vector2(0, -nd), new THREE.Vector2(-nk * .5, -nd * .75), new THREE.Vector2(-nk, 0), 12);
  const hemPts2 = qPts(new THREE.Vector2(-hem, -h), new THREE.Vector2(-hem * .5, -h * 1.030), new THREE.Vector2(0, -h * 1.015), 12);
  // nửa trái của áo: mép cổ, vai, tay áo trải ngang, hông, gấu, rồi đường may giữa
  const half = new THREE.Shape();
  half.moveTo(-nk, 0);
  half.quadraticCurveTo(-(nk + sh) * .5, -h * .012, -sh, -h * .030);              // vai
  half.quadraticCurveTo(-(sh + tp) * .5, -h * .042, -tp, -drop);                  // mép trên tay áo, trải ngang
  half.quadraticCurveTo(-tp * .990, -(drop + drop2) * .5, -tp * .968, -drop2);    // mép tay áo (lỗ tay áo)
  half.quadraticCurveTo(-tp * .945, -(drop2 + h * .075), -ch * 1.02, -arm);       // gấu tay áo về nách
  half.quadraticCurveTo(-ch * 1.01, -arm - (h - arm) * .45, -hem, -h);            // hông xuống mép
  half.quadraticCurveTo(-hem * .5, -h * 1.030, 0, -h * 1.015);                    // mép áo
  half.lineTo(0, -nd);                                                            // đường may giữa lên tới cổ
  half.quadraticCurveTo(-nk * .5, -nd * .75, -nk, 0);                            // miệng cổ
  // ── nửa NGOÀI (trái): mặt trước của áo, sáng màu ──
  const outGeo = clothGeo(half, w, h, .85, .013);
  {
    // tay áo ngoài xoay ngược: mặt ngoài của tay áo vẫn quay về máy
    const pa = outGeo.attributes.position;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), t = clamp((Math.abs(x) - ch * 1.05) / (tp - ch * 1.05));
      pa.setZ(i, pa.getZ(i) - .050 * t * t);
    }
    pa.needsUpdate = true; outGeo.computeVertexNormals();
  }
  const body = mesh(outGeo, outMat, [0, 0, 0]);
  // nửa NGOÀI nằm trong một nhóm riêng: sau này cả nhóm được dịch lên để mặt vải nằm SÁT mặt phẳng đặt
  const outer = new THREE.Group();
  g.add(outer);
  outer.add(body);
  // cổ áo: viền gân tròn bám sát lỗ cổ, nối liền vai
  const cmat = toon('#ffffff', { map: fabricTex(), bumpMap: fabricTex.rib(), bumpScale: .5 });
  cmat.map.repeat.set(4, 1); cmat.map.wrapS = cmat.map.wrapT = THREE.RepeatWrapping;
  outer.add(mesh(neckPath.ribbed(new THREE.CatmullRomCurve3(neckPts.map(pt => new THREE.Vector3(pt.x, pt.y, .009 + hangFold(pt.x, pt.y, w, h, .85)))), .0105), cmat, [0, 0, 0]));
  // trong lỗ cổ có bóng tối
  outer.add(mesh(new THREE.SphereGeometry(1, 16, 12).scale(nk * .34, nd * .22, .014), toon('#a1957f'), [-nk * .5, -nd * .78, -.020 + hangFold(-nk * .5, -nd * .78, w, h, .85)], { cast: false, recv: false }));
  // gấu áo: gờ vải gấp hai lớp ở mép dưới
  {
    const hp = hemPts2.map(pt => new THREE.Vector3(pt.x, pt.y, .008 + hangFold(pt.x, pt.y, w, h, .85)));
    outer.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hp), hp.length, .0030, 6, false), cmat, [0, 0, 0]));
  }
  // đường may giữa áo
  {
    const sp = [];
    for (let i = 0; i <= 8; i++) {
      const y = -nd - i * (h - nd) / 8;
      sp.push(new THREE.Vector3(-.0022, y, .008 + hangFold(0, y, w, h, .85)));
    }
    const sm = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sp), 14, .0018, 5, false), cmat, [0, 0, 0]);
    sm.castShadow = false; outer.add(sm);
  }
  // đặt nửa NGOÀI xuống: điểm thấp nhất của mặt vải chạm đúng mặt phẳng z = 0
  outGeo.computeBoundingBox();
  outer.position.z = -outGeo.boundingBox.min.z;
  // ── nửa TRONG (phải): cùng một nửa áo nhưng gập ngược, lộ mặt trong ──
  const inside = new THREE.Group();
  inside.scale.x = -1;                        // gập ngược: mặt trong hướng về máy
  inside.rotation.z = .032;
  g.add(inside);
  const inGeo = clothGeo(half, w, h, .55, .012);
  {
    // tay áo trong xoay ngược chiều: lộ mặt trong của tay áo
    const pa = inGeo.attributes.position;
    for (let i = 0; i < pa.count; i++) {
      const x = pa.getX(i), t = clamp((Math.abs(x) - ch * 1.05) / (tp - ch * 1.05));
      pa.setZ(i, pa.getZ(i) + .085 * t * t);
    }
    pa.needsUpdate = true; inGeo.computeVertexNormals();
  }
  const inBody = mesh(inGeo, inMat, [0, 0, 0]);
  inside.add(inBody);
  // cổ áo nhìn từ trong: viền gân tối hơn, ở phía sau mặt vải
  const cimat = toon('#aaa392', { map: fabricTex(), bumpMap: fabricTex.rib(), bumpScale: .5 });
  cimat.map.repeat.set(4, 1); cimat.map.wrapS = cimat.map.wrapT = THREE.RepeatWrapping;
  inside.add(mesh(neckPath.ribbed(new THREE.CatmullRomCurve3(neckPts.map(pt => new THREE.Vector3(pt.x, pt.y, -.009))), .0098), cimat, [0, 0, 0]));
  // miệng cổ mở: thấy vào trong áo, một khoảng tối
  inside.add(mesh(new THREE.SphereGeometry(1, 16, 12).scale(nk * .40, nd * .26, .016), toon('#332b22'), [-nk * .5, -nd * .78, .028], { cast: false, recv: false }));
  // gấu áo phía trong: gờ vải ở mặt sau
  {
    const hp = hemPts2.map(pt => new THREE.Vector3(pt.x, pt.y, -.008 + hangFold(pt.x, pt.y, w, h, .55)));
    inside.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hp), hp.length, .0028, 6, false), cimat, [0, 0, 0]));
  }
  // đặt nửa TRONG xuống: điểm thấp nhất của nó cũng chạm mặt phẳng z = 0 → hai nửa nằm cùng mặt sàn
  inGeo.computeBoundingBox();
  inside.position.set(0, .003, -inGeo.boundingBox.min.z);
  // ── KHÔNG có dây: cái áo này nằm ngửa trên sàn gạch hiên, cả hai mặt phơi ra (đối chiếu với cái áo úp) ──
  return {
    group: g, body,
    setWet: (k) => {
      const t = clamp(k);
      outMat.color.copy(outC).lerp(new THREE.Color('#8a8478'), .55 * t);
      inMat.color.copy(inC).lerp(new THREE.Color('#55524a'), .55 * t);
      cmat.color.set('#ffffff').lerp(new THREE.Color('#8a8478'), .55 * t);
      cimat.color.set('#aaa392').lerp(new THREE.Color('#5f5b52'), .55 * t);
    },
  };
}

// giọt nước rơi từ mép khăn
export function hemDrop() {
  const g = new THREE.Group();
  const R = .0075;                                 // bán kính giọt — giọt NHỎ, còn dính mép khăn

  // ── góc khăn: một mảnh khăn xù THẬT ở góc trên, gấp lại, có sọc viền và mép dệt dày ──
  const CLOTH_BASE = .030, CW = .052, CH = .040;
  const cloth = new THREE.Group();
  cloth.position.set(-.010, CLOTH_BASE, 0);
  cloth.rotation.z = .07;
  g.add(cloth);
  const geo = new THREE.PlaneGeometry(CW, CH, 18, 14);
  {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const t = (y + CH / 2) / CH;                       // 0 ở mép dưới, 1 ở trên
      const fold = Math.max(0, (t - .70) / .30);         // mép trên gấp ngược lại sau
      p.setX(i, x * (1 + .16 * t) + Math.sin(t * 6.4) * .0022);   // vải xõa dần lên trên
      p.setZ(i, Math.sin(x * 26 + .8) * .0026 * (1 - t) + Math.cos(x * 10.5) * .0052 * t - fold * fold * .016);
      p.setY(i, y + (1 - t) * Math.sin(x * 18 + .4) * .0022 + t * t * Math.sin(x * 6.4 + 1.1) * .0052);
    }
    geo.computeVertexNormals();
  }
  // vải nhạt, mờ: để giọt nước là thứ đọc ra trước
  const cmat = toon('#e7dcbc', { side: THREE.DoubleSide, map: gE_hemClothTex() });
  const cmesh = mesh(geo, cmat, [0, CH / 2, 0]);
  cmesh.castShadow = true; cloth.add(cmesh);
  // mép khăn dệt dày: một cuộn vải tròn dọc theo mép dưới, có đường chỉ may ngay trên
  {
    const rp = [];
    for (let i = 0; i <= 12; i++) {
      const x = (i / 12 - .5) * CW * .96;
      rp.push(new THREE.Vector3(x, .0012 + Math.sin(x * 18 + .4) * .0018, .0013 + Math.sin(x * 10.5) * .0010));
    }
    const roll = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rp), 24, .0022, 8, false), toon('#e7dcbc'));
    roll.castShadow = false; cloth.add(roll);
    const sp = rp.map(p => new THREE.Vector3(p.x, p.y + .0028, p.z + .0017));
    const st = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sp), 24, .0007, 5, false), toon('#c3b492'));
    st.castShadow = false; cloth.add(st);
  }
  {
    const sm = mesh(new THREE.PlaneGeometry(CW * .96, .0030, 12, 1), toon('#b4633a', { side: THREE.DoubleSide }), [0, .0030, .0024]);
    sm.castShadow = false; cloth.add(sm);
  }
  // vệt nước chảy dọc mặt khăn: một dải bóng ướt, dẹt, loe dần xuống mép
  {
    const run = mesh(new THREE.SphereGeometry(1, 12, 10), toon('#cdeefb', { transparent: true, opacity: .55, depthWrite: false }), [.001, .0105, .0026]);
    run.scale.set(.0028, .0092, .0013); run.castShadow = false; cloth.add(run);
  }
  // hạt nước đọng ở mép vải, chảy xuống thành sợi mảnh nối tới giọt
  const bead = new THREE.Group();
  cloth.add(bead);
  {
    const bm = toon('#a9e6f6', { transparent: true, opacity: .62, depthWrite: false });
    for (const [bx, by, br] of [[-.006, .012, .0030], [.004, .017, .0024], [-.001, .022, .0020]]) {
      const b = mesh(new THREE.SphereGeometry(br, 10, 8), bm, [bx, by, .0030], { cast: false });
      bead.add(b);
      const h = mesh(new THREE.SphereGeometry(br * .30, 8, 6), glowMat('#ffffff', .80), [bx - br * .30, by + br * .30, .0030 + br * .55], { cast: false });
      h.renderOrder = 6; bead.add(h);
    }
  }
  // ── giọt nước đang rơi: chủ thể — thân dài, trong suốt, có đuôi cong lệch ──
  const dropG = new THREE.Group();
  dropG.position.set(0, .013, 0);
  g.add(dropG);
  // thân giọt: đáy tròn, bụng phình thấp, cổ nhọn dần — dáng giọt lệch
  const prof = [];
  for (let i = 0; i <= 12; i++) {
    const a = (i / 12) * Math.PI / 2;
    prof.push(new THREE.Vector2(Math.sin(a) * R, (1 - Math.cos(a)) * R - 1.15 * R));
  }
  prof.push(new THREE.Vector2(R * 1.02, .06 * R));
  prof.push(new THREE.Vector2(R * .93, .44 * R));
  prof.push(new THREE.Vector2(R * .79, .82 * R));
  prof.push(new THREE.Vector2(R * .60, 1.14 * R));
  prof.push(new THREE.Vector2(R * .38, 1.38 * R));
  prof.push(new THREE.Vector2(R * .20, 1.62 * R));
  prof.push(new THREE.Vector2(R * .10, 1.80 * R));
  prof.push(new THREE.Vector2(R * .04, 1.92 * R));
  const skin = toon('#9fe2f5', { transparent: true, opacity: .40, depthWrite: false, side: THREE.DoubleSide });
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 30), skin);
  body.castShadow = false; body.renderOrder = 4; dropG.add(body);
  // vỏ giọt trong suốt đều màu: KHÔNG có lõi đặc ở đáy, không có mặt nước ngang, không có meniscus
  // đuôi giọt: sợi nước cong lệch sang bên, nhọn dần
  {
    const tpts = [
      new THREE.Vector3(0, 1.40 * R, 0),
      new THREE.Vector3(.14 * R, 1.80 * R, .10 * R),
      new THREE.Vector3(.30 * R, 2.10 * R, .18 * R),
      new THREE.Vector3(.44 * R, 2.45 * R, .24 * R),
    ];
    const curve = new THREE.CatmullRomCurve3(tpts);
    const N = 24, RS = 8;
    const tp = [], ti = [], tuv = [];
    const frames = curve.computeFrenetFrames(N, false);
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const c = curve.getPoint(u);
      const rad = .16 * R * Math.pow(1 - u, 1.5) + .05 * R;
      for (let j = 0; j <= RS; j++) {
        const a = j / RS * Math.PI * 2;
        const v = c.clone().addScaledVector(frames.normals[i], Math.cos(a) * rad).addScaledVector(frames.binormals[i], Math.sin(a) * rad);
        tp.push(v.x, v.y, v.z); tuv.push(j / RS, u);
      }
    }
    for (let i = 0; i < N; i++) for (let j = 0; j < RS; j++) {
      const a = i * (RS + 1) + j, b = a + 1, c = a + RS + 1, d = c + 1;
      ti.push(a, c, b, b, c, d);
    }
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.Float32BufferAttribute(tp, 3));
    tg.setAttribute('uv', new THREE.Float32BufferAttribute(tuv, 2));
    tg.setIndex(ti); tg.computeVertexNormals();
    const tail = new THREE.Mesh(tg, toon('#9fe2f5', { transparent: true, opacity: .52, depthWrite: false, side: THREE.DoubleSide }));
    tail.castShadow = false; tail.renderOrder = 4; dropG.add(tail);
  }
  // điểm sáng bắt sáng trên vỏ giọt: MỘT điểm tròn duy nhất
  {
    const hi = new THREE.Mesh(new THREE.SphereGeometry(R * .30, 12, 10), glowMat('#ffffff', .92));
    hi.position.set(-R * .34, R * .46, R * .64); hi.scale.set(1, .70, .42);
    hi.renderOrder = 6; hi.castShadow = false; dropG.add(hi);
  }

  let restY = null;
  return {
    group: g, drop: body,
    setSize: (k) => {
      const s = lerp(1.25, .5, clamp(k));
      dropG.scale.set(s, s * 1.08, s);          // hơi kéo dài theo chiều rơi
      // góc khăn đứng yên ở mép vải, chỉ giọt rơi xuống
      if (restY === null) restY = g.position.y;
      cloth.position.y = CLOTH_BASE + (restY - g.position.y);
    },
  };
}

// quần: hai ống ngắn + cạp quần + khe nách
export function trousers({ color = '#4a5a86', wetColor = '#2c3550' } = {}) {
  const g = new THREE.Group();
  const dry = new THREE.Color(color), wet = new THREE.Color(wetColor);
  const mat = toon('#ffffff', { side: THREE.DoubleSide, map: fabricTex() });
  mat.map.repeat.set(2.4, 2.4); mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
  const bandMat = toon('#ffffff', { side: THREE.DoubleSide, map: fabricTex() });
  bandMat.map.repeat.set(2.4, 2.4); bandMat.map.wrapS = bandMat.map.wrapT = THREE.RepeatWrapping;
  const thread = toon('#93a0bd');
  const innerMat = toon('#26304a', { side: THREE.DoubleSide });      // mặt vải bên trong mép eo quần
  const capMat = toon('#55628c', { side: THREE.DoubleSide });        // miếng vải đóng miệng eo (nhìn từ trên xuống)
  const cuffMat = toon('#ffffff', { side: THREE.DoubleSide, map: fabricTex() });  // mép gấu ống: vải xắn
  cuffMat.map.repeat.set(2.4, 2.4); cuffMat.map.wrapS = cuffMat.map.wrapT = THREE.RepeatWrapping;
  const leather = toon('#6d4a2c');                                  // dây lưng da
  const leatherDark = toon('#4b3120');
  // ── hông + cạp: MỘT khối liền mềm, dựng bằng các lát cắt nối nhau; eo MỞ, không có mặt nắp ──
  const HW = .172, HD = .138, HH = .176, TOPY = .0150;
  // bề rộng theo chiều cao: eo hơi thắt, hông bung nhẹ, cạp thu lại
  const fw = (u) => u < .18 ? lerp(.80, .94, ss(u / .18))
    : u < .44 ? lerp(.94, 1.00, ss((u - .18) / .26))
      : lerp(1.00, .56, ss((u - .44) / .56));
  const fd = (u) => u < .18 ? lerp(.84, .95, ss(u / .18))
    : u < .50 ? lerp(.95, 1.00, ss((u - .18) / .32))
      : lerp(1.00, .84, ss((u - .50) / .50));
  const bulge = (u) => Math.sin(Math.PI * Math.min(u / .55, 1));
  const lev = [0, .05, .11, .17, .23, .30, .37, .45, .54, .64, .76, .89, 1];
  const N = 44;
  // một lát cắt ngang: hình bầu dục bo, mông lùi ra sau, khe nách nâng lên, mép vải hơi nhăn
  const ring = (u) => {
    const w = HW * fw(u), d = HD * fd(u), out = [];
    for (let j = 0; j < N; j++) {
      const a = j / N * Math.PI * 2, cs = Math.cos(a), sn = Math.sin(a);
      const k = 1 + .026 * Math.sin(a * 3 + .7) + .016 * Math.sin(a * 5 - 1.2) + .010 * Math.sin(a * 9 + 2.1);
      const x = w * k * Math.sign(cs) * Math.pow(Math.abs(cs), .82);
      let z = d * k * Math.sign(sn) * Math.pow(Math.abs(sn), .82);
      if (z < 0) z *= (1 + .18 * bulge(u));
      const xn = clamp(Math.abs(x) / (w * k));
      // eo sâu xuống nhẹ ở hai bên: cạp quần không phẳng như một mặt nắp
      const y = TOPY - u * HH + .072 * Math.max(0, (u - .46) / .54) * Math.pow(Math.max(0, 1 - xn * xn), 1.3)
        - .009 * Math.pow(Math.abs(xn), 2) * Math.max(0, 1 - u / .30);
      out.push([x, y, z]);
    }
    return out;
  };
  const rings = lev.map(ring);
  const levelIdx = (u) => { let b = 0; for (let i = 0; i < lev.length; i++) if (Math.abs(lev[i] - u) < Math.abs(lev[b] - u)) b = i; return b; };
  const nearest = (rg, x, front) => { let bj = 0, bd = 1e9; for (let j = 0; j < N; j++) { const p = rg[j]; if (front && p[2] < 0) continue; const d = Math.abs(p[0] - x); if (d < bd) { bd = d; bj = j; } } return bj; };
  // điểm trên vành quần gần một điểm (x,z) cho trước: dùng để đặt khuy, lỗ thắt, túi
  const nearestXZ = (rg, tx, tz) => { let bj = 0, bd = 1e9; for (let j = 0; j < N; j++) { const p = rg[j]; const d = Math.hypot(p[0] - tx, p[2] - tz); if (d < bd) { bd = d; bj = j; } } return rg[bj]; };
  // dải vải quanh eo giữa hai mức, phóng ra ngoài một chút (dải thắt lưng, dây lưng)
  const bandStrip = (u0, u1, k, material) => {
    const i0 = levelIdx(u0), i1 = levelIdx(u1);
    const p = [], uv = [], ix = [];
    for (let i = i0; i <= i1; i++) {
      const rg = rings[i];
      for (let j = 0; j < N; j++) {
        const q = rg[j];
        p.push(q[0] * k, q[1], q[2] * k);
        uv.push(j / N * 1.30, (TOPY - q[1]) * 1.6);
      }
    }
    for (let i = 0; i < (i1 - i0); i++) for (let j = 0; j < N; j++) {
      const a0 = i * N + j, a1 = i * N + ((j + 1) % N), b0 = (i + 1) * N + j, b1 = (i + 1) * N + ((j + 1) % N);
      ix.push(a0, b1, b0, a0, a1, b1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(ix); geo.computeVertexNormals();
    return mesh(geo, material, [0, 0, 0]);
  };
  // ── vải hông ──
  {
    const pos = [], uvs = [], idx = [];
    for (let i = 0; i < rings.length; i++) {
      const r = rings[i];
      for (let j = 0; j < N; j++) {
        const p = r[j];
        pos.push(p[0], p[1], p[2]);
        uvs.push(j / N * 1.30, (TOPY - p[1]) * 1.6);
      }
    }
    for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < N; j++) {
      const a0 = i * N + j, a1 = i * N + ((j + 1) % N), b0 = (i + 1) * N + j, b1 = (i + 1) * N + ((j + 1) % N);
      idx.push(a0, b1, b0, a0, a1, b1);
    }
    // đáy khối hông: chụp lại bằng một nón (khuất giữa hai ống quần)
    const last = rings[rings.length - 1];
    let ay = 0; for (const p of last) ay += p[1]; ay /= N;
    const cen = pos.length / 3;
    pos.push(0, ay, 0); uvs.push(.65, (TOPY - ay) * 1.6);
    for (let j = 0; j < N; j++) idx.push(cen, (rings.length - 1) * N + j, (rings.length - 1) * N + ((j + 1) % N));
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx); geo.computeVertexNormals();
    g.add(mesh(geo, mat, [0, 0, 0]));
  }
  // ── dải thắt lưng: một dải vải ôm sát hông, không nhô ra như nắp ──
  {
    const i0 = levelIdx(.015), i1 = levelIdx(.16);
    const bp = [], bu = [], bi = [];
    for (let i = i0; i <= i1; i++) {
      const rg = rings[i];
      for (let j = 0; j < N; j++) {
        const p = rg[j];
        bp.push(p[0] * 1.007, p[1], p[2] * 1.007);
        bu.push(j / N * 1.30, (TOPY - p[1]) * 1.6);
      }
    }
    for (let i = 0; i < (i1 - i0); i++) for (let j = 0; j < N; j++) {
      const a0 = i * N + j, a1 = i * N + ((j + 1) % N), b0 = (i + 1) * N + j, b1 = (i + 1) * N + ((j + 1) % N);
      bi.push(a0, b1, b0, a0, a1, b1);
    }
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.Float32BufferAttribute(bp, 3));
    bg.setAttribute('uv', new THREE.Float32BufferAttribute(bu, 2));
    bg.setIndex(bi); bg.computeVertexNormals();
    g.add(mesh(bg, bandMat, [0, 0, 0]));
  }
  // ── miệng eo: mép vải mềm cuộn xuống, bên trong là vải — nhìn từ trên thấy lỗ eo, không phải nắp ──
  {
    const outer = rings[0];
    // mép vải dày 1cm, cuộn mềm
    const inner = outer.map(p => {
      const a = Math.atan2(p[2], p[0]);
      const k = .94 + .035 * Math.sin(a * 3 + .4);
      return [p[0] * k, p[1] - .006, p[2] * k];
    });
    // vành eo: cuộn mềm, méo theo nếp
    const ap = [], au = [], ai = [];
    for (let j = 0; j < N; j++) {
      const o = outer[j], n = inner[j];
      ap.push(o[0], o[1], o[2]); au.push(j / N * 1.30, 0);
      ap.push((o[0] + n[0]) * .5, (o[1] + n[1]) * .5 + .005, (o[2] + n[2]) * .5); au.push(j / N * 1.30, .045);
      ap.push(n[0], n[1], n[2]); au.push(j / N * 1.30, .09);
    }
    for (let j = 0; j < N; j++) for (let e = 0; e < 2; e++) {
      const a0 = j * 3 + e, a1 = j * 3 + e + 1, b0 = ((j + 1) % N) * 3 + e, b1 = ((j + 1) % N) * 3 + e + 1;
      ai.push(a0, b1, b0, a0, a1, b1);
    }
    const ag = new THREE.BufferGeometry();
    ag.setAttribute('position', new THREE.Float32BufferAttribute(ap, 3));
    ag.setAttribute('uv', new THREE.Float32BufferAttribute(au, 2));
    ag.setIndex(ai); ag.computeVertexNormals();
    g.add(mesh(ag, bandMat, [0, 0, 0]));
    // thành vải trong mép eo: một quầng hẹp, cho mép vải có độ dày
    const dp = [], du = [], di = [];
    for (let j = 0; j < N; j++) {
      const n = inner[j];
      dp.push(n[0], n[1], n[2]); du.push(j / N * 1.30, 0);
      dp.push(n[0], TOPY - .011, n[2]); du.push(j / N * 1.30, .03);
    }
    for (let j = 0; j < N; j++) {
      const a0 = j * 2, a1 = j * 2 + 1, b0 = ((j + 1) % N) * 2, b1 = ((j + 1) % N) * 2 + 1;
      di.push(a0, b1, b0, a0, a1, b1);
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3));
    dg.setAttribute('uv', new THREE.Float32BufferAttribute(du, 2));
    dg.setIndex(di); dg.computeVertexNormals();
    g.add(mesh(dg, innerMat, [0, 0, 0], { cast: false }));
    // miếng vải PHẲNG đóng miệng eo: nhìn từ trên xuống thấy vải, KHÔNG thấy một lỗ đen như miệng nồi
    const sh = new THREE.Shape();
    for (let j = 0; j < N; j++) {
      const n = inner[j];
      if (j === 0) sh.moveTo(n[0], -(n[2])); else sh.lineTo(n[0], -(n[2]));
    }
    sh.closePath();
    g.add(mesh(new THREE.ShapeGeometry(sh), capMat, [0, TOPY - .0105, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }));
  }
  // ── cạp thắt lưng: đường may ôm sát hông ──
  const bandU = .175;
  const bandRg = rings[levelIdx(bandU)];
  {
    const pts = bandRg.map(p => new THREE.Vector3(p[0] * .995, p[1] + .001, p[2] * .995));
    const st = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), N, .0024, 5, true), thread, [0, 0, 0]);
    st.castShadow = false; g.add(st);
  }
  // ── dây lưng da: một dải quanh eo, có mép dày và đường chỉ may ──
  const beltU = .085;
  const beltRg = rings[levelIdx(beltU)];
  {
    g.add(bandStrip(beltU - .048, beltU + .048, 1.020, leather));
    for (const du of [-.048, .048]) {                       // mép dây lưng: hai sợi da cuộn
      const rg2 = rings[levelIdx(beltU + du)];
      const pts = rg2.map(p => new THREE.Vector3(p[0] * 1.024, p[1], p[2] * 1.024));
      const st = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), N, .0028, 6, true), leatherDark, [0, 0, 0]);
      st.castShadow = false; g.add(st);
    }
    for (const [du, dy] of [[-.048, .0024], [.048, -.0024]]) {   // đường chỉ may dọc theo dây lưng
      const rg2 = rings[levelIdx(beltU + du)];
      const pts = rg2.map(p => new THREE.Vector3(p[0] * 1.026, p[1] + dy, p[2] * 1.026));
      const st = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), N, .0012, 5, true), thread, [0, 0, 0]);
      st.castShadow = false; g.add(st);
    }
  }
  // khuy kim loại ở giữa trước, trên dây lưng
  {
    const j = nearest(beltRg, 0, true), p = beltRg[j];
    const nl = Math.hypot(p[0], p[2]) || 1;
    const nx = p[0] / nl, nz = p[2] / nl;
    const bx = p[0] + nx * .005, by = p[1], bz = p[2] + nz * .005;
    const frame = mesh(rbox(.032, .024, .006, .003), M.metal, [bx, by, bz]);
    frame.rotation.y = Math.atan2(nx, nz); g.add(frame);
    const hole = mesh(rbox(.021, .014, .008, .002), M.metalDark, [bx + nx * .002, by, bz + nz * .002]);
    hole.rotation.y = Math.atan2(nx, nz); hole.castShadow = false; g.add(hole);
    // lưỡi khuy
    const prong = mesh(new THREE.CylinderGeometry(.0016, .0016, .030, 8), M.metal, [bx + nx * .006, by, bz + nz * .006], { rot: [0, 0, Math.PI / 2] });
    prong.rotation.y = Math.atan2(nx, nz); prong.castShadow = false; g.add(prong);
    // vòng giữ dây lưng ngay bên cạnh khuy (lệch theo phương tiếp tuyến)
    const tx = nz, tz = -nx;
    const keeper = mesh(rbox(.010, .020, .008, .002), leatherDark, [bx + tx * .026, by, bz + tz * .026]);
    keeper.rotation.y = Math.atan2(nx, nz); g.add(keeper);
  }
  // năm lỗ thắt lưng, đều quanh eo
  {
    const w0 = HW * fw(beltU), d0 = HD * fd(beltU);
    for (const a of [.78, -.78, 1.86, -1.86, Math.PI]) {
      const p = nearestXZ(beltRg, Math.sin(a) * w0, Math.cos(a) * d0);
      const nl = Math.hypot(p[0], p[2]) || 1;
      const nx = p[0] / nl, nz = p[2] / nl;
      const loop = mesh(rbox(.012, .036, .006, .002), leather, [p[0] + nx * .004, p[1] - .002, p[2] + nz * .004]);
      loop.rotation.y = Math.atan2(nx, nz); g.add(loop);
    }
  }
  // khuy quần ở cạp, ngay dưới dây lưng
  {
    const rg = rings[levelIdx(.13)], j = nearest(rg, 0, true), p = rg[j];
    g.add(mesh(new THREE.CylinderGeometry(.0085, .0085, .0040, 12), M.metal, [0, p[1], p[2] + .002], { rot: [Math.PI / 2, 0, 0] }));
    g.add(mesh(new THREE.CylinderGeometry(.0028, .0028, .0055, 8), M.metalDark, [0, p[1], p[2] + .0035], { rot: [Math.PI / 2, 0, 0] }));
  }
  // ── nẽ quần (fly): đường may giữa mặt trước, từ dưới khuy xuống cạp ──
  {
    const front = [];
    for (let i = 0; i <= 9; i++) {
      const u = .135 + i * (.50 - .135) / 9;
      const rg = rings[levelIdx(u)], j = nearest(rg, 0, true), p = rg[j];
      const nl = Math.hypot(p[0], p[2]) || 1;
      front.push(new THREE.Vector3(p[0] * .22, p[1], p[2] + .0028 * (p[2] / nl)));
    }
    const fm = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(front), 20, .0026, 5, false), thread, [0, 0, 0]);
    fm.castShadow = false; g.add(fm);
    // vải nẽ phủ lên: một dải hẹp lệch sang một bên, thấp hơn đường may
    const fp = [], fu = [], fi = [];
    for (let i = 0; i <= 9; i++) {
      const u = .135 + i * (.50 - .135) / 9;
      const rg = rings[levelIdx(u)], j = nearest(rg, 0, true), p = rg[j];
      const nl = Math.hypot(p[0], p[2]) || 1;
      const bx = p[0] * .22;
      fp.push(bx - .012, p[1], p[2] + .0016 * (p[2] / nl)); fu.push(0, i / 9);
      fp.push(bx + .002, p[1], p[2] + .0034 * (p[2] / nl)); fu.push(1, i / 9);
    }
    for (let i = 0; i < 9; i++) {
      const a0 = i * 2, a1 = i * 2 + 1, b0 = (i + 1) * 2, b1 = (i + 1) * 2 + 1;
      fi.push(a0, b1, b0, a0, a1, b1);
    }
    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3));
    fg.setAttribute('uv', new THREE.Float32BufferAttribute(fu, 2));
    fg.setIndex(fi); fg.computeVertexNormals();
    g.add(mesh(fg, capMat, [0, 0, 0], { cast: false }));
    // đường may giữa sau: bám theo mặt vải
    const back = [];
    for (let i = 0; i < 8; i++) {
      const u = .18 + i * .060;
      const rg = rings[levelIdx(u)], j = nearest(rg, 0, false), p = rg[j];
      const nl = Math.hypot(p[0], p[2]) || 1;
      back.push(new THREE.Vector3(0, p[1], p[2] - .0028 * (p[2] / nl)));
    }
    const bm = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(back), 14, .0024, 5, false), thread, [0, 0, 0]);
    bm.castShadow = false; g.add(bm);
  }
  // ── hai túi chéo ở hông: đường may chéo + miệng túi ──
  {
    for (const sx of [-1, 1]) {
      const pts = [];
      for (let i = 0; i <= 6; i++) {
        const t = i / 6;
        const u = .16 + t * .21;
        const x = sx * lerp(.100, .030, ss(t));
        const rg = rings[levelIdx(u)], j = nearest(rg, x, true), p = rg[j];
        const nl = Math.hypot(p[0], p[2]) || 1;
        pts.push(new THREE.Vector3(p[0] * .95, p[1], p[2] + .0026 * (p[2] / nl)));
      }
      const st = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 18, .0026, 5, false), thread, [0, 0, 0]);
      st.castShadow = false; g.add(st);
      // miệng túi: một khe hẹp tối ở đầu trên của đường chéo
      const mp = pts.slice(0, 3).map(p => p.clone().addScaledVector(new THREE.Vector3(0, 0, 1), .0006));
      const mo = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mp), 10, .0028, 5, false), toon('#232b45'), [0, 0, 0]);
      mo.castShadow = false; g.add(mo);
    }
  }
  // ── hai nếp gấp mềm ở mặt trước hông: vải không phải một khối trơn ──
  {
    for (const cx of [-.052, .052]) {
      const pts = [];
      for (let i = 0; i <= 6; i++) {
        const u = .22 + i * .105;
        const rg = rings[levelIdx(u)], j = nearest(rg, cx, true), p = rg[j];
        const nl = Math.hypot(p[0], p[2]) || 1;
        pts.push(new THREE.Vector3(p[0] * .96, p[1], p[2] + .0022 * (p[2] / nl)));
      }
      const cr = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 18, .0022, 5, false), thread, [0, 0, 0]);
      cr.castShadow = false; g.add(cr);
    }
  }
  // ── hai ống quần: THẲNG và SONG SONG (không xoè như chân tripod), mép gấu là viền xắn có đường may ──
  const legs = [];
  for (const sx of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(sx * .078, -.080, 0);
    leg.rotation.z = sx * .06;                      // ống thẳng, hai ống song song
    leg.rotation.x = sx * .03;
    const LH = .380;
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(.072, .064, LH, 18, 1, false), mat);
    tube.position.y = -LH / 2;                     // đầu ống chui vào khối hông
    tube.castShadow = true; tube.receiveShadow = true; leg.add(tube);
    // đường may giữa mặt trước ống: một nét dọc từ cạp xuống gấu
    {
      const pts = [];
      for (let t = 0; t <= 5; t++) {
        const yy = -.030 - t * .058;
        const rr = .072 + (.064 - .072) * (-yy / LH);
        pts.push(new THREE.Vector3(0, yy, rr - .0014));
      }
      const f = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, .0024, 5, false), thread, [0, 0, 0]);
      f.castShadow = false; leg.add(f);
    }
    // nếp gấp vải mềm chạy dọc ống: vài đường gấp ở mặt trước ống
    for (const cx of [-.030, .030, .052]) {
      const pts = [];
      for (let t = 0; t <= 4; t++) {
        const yy = -.045 - t * .050;
        const rr = .072 + (.064 - .072) * (-yy / LH);
        pts.push(new THREE.Vector3(cx * (1 + t * .10), yy, rr - .0012));
      }
      const f = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, .0022, 5, false), mat, [0, 0, 0]);
      f.castShadow = false; leg.add(f);
    }
    // mép gấu: vải xắn gấp lên — KHÔNG phải một đai bạc
    const cuff = mesh(new THREE.CylinderGeometry(.0672, .0652, .034, 18, 1, true), cuffMat, [0, -LH + .020, 0]);
    cuff.castShadow = false; leg.add(cuff);
    // hai đường chỉ may ở mép gấu
    for (const yy of [-LH + .0045, -LH + .0365]) {
      const rr = .0656 + (yy + LH) * .006;
      const st = mesh(new THREE.TorusGeometry(rr, .0016, 5, 20), thread, [0, yy, 0], { rot: [Math.PI / 2, 0, 0] });
      st.castShadow = false; leg.add(st);
    }
    // mép vải dưới cùng: một viền mỏng đóng đáy ống
    const bot = mesh(new THREE.TorusGeometry(.0648, .0026, 5, 20), cuffMat, [0, -LH + .001, 0], { rot: [Math.PI / 2, 0, 0] });
    bot.castShadow = false; leg.add(bot);
    g.add(leg); legs.push(leg);
  }
  // ── nẽ giữa hai ống (crotch seam): từ cạp chạy xuống khe giữa hai ống ──
  {
    for (const sx of [-1, 1]) {
      const pts = [
        new THREE.Vector3(0, -.100, .004),
        new THREE.Vector3(sx * .010, -.170, .002),
        new THREE.Vector3(sx * .018, -.260, 0),
        new THREE.Vector3(sx * .030, -.360, 0),
        new THREE.Vector3(sx * .034, -.455, 0),
      ];
      const st = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, .0024, 5, false), thread, [0, 0, 0]);
      st.castShadow = false; g.add(st);
    }
  }
  let wetK = 1;
  const setWet = (k) => {
    wetK = clamp(k); mat.color.copy(dry).lerp(wet, wetK);
    bandMat.color.copy(dry).lerp(wet, wetK * 1.10).lerp(new THREE.Color('#ffffff'), .05);
    cuffMat.color.copy(dry).lerp(wet, wetK * 1.10).lerp(new THREE.Color('#ffffff'), .11);
    capMat.color.copy(dry).lerp(wet, wetK * 1.10).lerp(new THREE.Color('#ffffff'), .14);
    for (const l of legs) l.scale.x = lerp(1, .93, wetK);
  };
  setWet(1);
  return { group: g, setWet };
}

// áo thun mỏng: mỏng hơn, mép xẻ, dễ ẩm
export function thinTee({ color = '#9fd8e8' } = {}) {
  const g = new THREE.Group();
  const w = .52, h = .62;
  const tex = fabricTex('#f4f8fa');
  tex.repeat.set(2.8, 3.0); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  const mat = toon(color, { side: THREE.DoubleSide, transparent: true, opacity: .95, map: tex, bumpMap: fabricTex.fold(), bumpScale: .05 });
  const shape = shirtShape(w, h);
  const body = mesh(clothGeo(shape, w, h, .55, .009), mat);
  g.add(body);
  // cổ áo: viền gân tròn có gân sóng, bám sát lỗ cổ
  const nk = w * .125, nd = w * .080;
  const cmat = toon(color, { map: fabricTex(), bumpMap: fabricTex.rib(), bumpScale: .55 });
  cmat.map.repeat.set(4, 1); cmat.map.wrapS = cmat.map.wrapT = THREE.RepeatWrapping;
  g.add(mesh(neckPath.ribbed(neckPath(w, -nd, 18), .0092), cmat, [0, 0, 0]));
  // trong lỗ cổ có bóng tối
  g.add(mesh(new THREE.SphereGeometry(1, 16, 12).scale(nk * .84, .010, .022), toon('#4a4034'), [0, -nd * .55, -.018], { cast: false, recv: false }));
  // mép áo: viền sáng mảnh + xù vải nhỏ ở chỗ mép xẻ
  const hemPts = shape.getPoints(140).filter(pt => pt.y < -h * .955)
    .map(pt => new THREE.Vector3(pt.x, pt.y, .007 + hangFold(pt.x, pt.y, w, h, .55)));
  if (hemPts.length > 3) g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hemPts), hemPts.length, .0026, 6, false), toon('#d8f2fa'), [0, 0, 0]));
  const r = mulberry(63);
  for (let i = 0; i < 22; i++) {
    const x = (r() - .5) * .26, y = -h + .020 + (r() - .5) * .008;
    const f = mesh(new THREE.CylinderGeometry(.0007, .0007, .009, 4), toon('#cfeaf5'), [x, y, .007], { rot: [r() * .5, 0, r() * .5] });
    f.castShadow = false; g.add(f);
  }
  return { group: g, body, setWet: (k) => { mat.color.set(color).lerp(new THREE.Color('#5d8fa6'), clamp(k)); } };
}

// khăn tắm: tấm chữ nhật dày, vân xù terry, mép rua mềm ở một cạnh ngắn
export function towel({ color = '#f2c14e', wetColor = '#c08f2c' } = {}) {
  const g = new THREE.Group();
  const t = new THREE.Group(); t.position.z = .018; g.add(t);   // khăn đứng trước dây phơi
  const W = .40, H = .46;                       // rộng × dài thân khăn
  // vân xù terry: các núm vòng nhỏ dày đặc, không phải lưới sợi
  const terry = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
    const r = mulberry(31);
    for (let y = 0; y < h; y += 10) {
      const off = (y / 10) % 2 ? 5 : 0;
      for (let x = 0; x < w; x += 10) {
        const px = x + off + r() * 2.2, py = y + r() * 2.2;
        const rad = 3.6 + r() * 2.0;
        const g2 = c.createRadialGradient(px - rad * .35, py - rad * .4, rad * .1, px, py, rad);
        g2.addColorStop(0, 'rgba(255,255,255,1)');
        g2.addColorStop(.52, 'rgba(236,230,214,.88)');
        g2.addColorStop(1, 'rgba(184,174,150,.45)');
        c.fillStyle = g2; c.beginPath(); c.arc(px, py, rad, 0, 7); c.fill();
      }
    }
  });
  const mat = toon(color, { side: THREE.DoubleSide, map: terry });
  mat.map.repeat.set(2.2, 2.6); mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
  const backBase = new THREE.Color(color).lerp(new THREE.Color('#ffffff'), .26);
  const matBack = toon(backBase, { side: THREE.DoubleSide, map: terry });
  const flapMat = toon(new THREE.Color(color).lerp(new THREE.Color('#ffffff'), .46), { side: THREE.DoubleSide, map: terry });
  flapMat.map.repeat.set(2.2, 2.6); flapMat.map.wrapS = flapMat.map.wrapT = THREE.RepeatWrapping;
  matBack.map.repeat.set(2.2, 2.6); matBack.map.wrapS = matBack.map.wrapT = THREE.RepeatWrapping;
  // nếp vải: độ nhăn theo chiều dọc + phồng giữa + một nếp gấp chéo
  const zw = (x, d) =>
    .0075 * Math.sin(x * 13.5 + .4) * (.35 + .65 * d)
    + .0050 * Math.sin(d * 9 - x * 4.5)
    + .011 * Math.sin(d * Math.PI) * (.55 + .45 * Math.cos(x * 7.5))
    + .007 * Math.exp(-Math.pow((x - .055 + d * .085) / .045, 2));
  // thanh ngang: khăn gấp qua thanh, hai đầu thanh lộ ra ngoài mép khăn
  const bar = mesh(new THREE.CylinderGeometry(.0072, .0072, W + .11, 12), toon('#ffffff', { map: gA_woodTex() }), [0, 0, 0], { rot: [0, 0, Math.PI / 2] });
  t.add(bar);
  // cuộn vải bọc lấy thanh: nếp gấp ở đỉnh
  const roll = mesh(new THREE.CylinderGeometry(.0100, .0100, W + .006, 14), mat, [0, .0012, .0010], { rot: [0, 0, Math.PI / 2] });
  t.add(roll);
  // thân khăn phía trước: lưới mềm, góc bo tròn, mép dưới gợn sóng
  const geo = new THREE.PlaneGeometry(1, 1, 28, 32);
  {
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i) + .5, v = p.getY(i) + .5;      // v = 1 ở mép trên
      const d = 1 - v;                                    // 0 ở mép trên, 1 ở mép dưới
      const rx = 1 - .12 * Math.pow(Math.abs(2 * v - 1), 8);
      const ry = 1 - .10 * Math.pow(Math.abs(2 * u - 1), 8);
      const x = (u - .5) * W * rx;
      let y = -d * H * ry;
      y += Math.sin(x * 11.5) * .006 * Math.pow(d, 2.2);  // mép dưới gợn nhẹ
      p.setXYZ(i, x, y, zw(x, d));
    }
    geo.computeVertexNormals();
  }
  const front = new THREE.Mesh(geo, mat);
  front.position.z = .011;
  front.castShadow = true; front.receiveShadow = true;
  t.add(front);
  // mép sau: phần vải gấp qua thanh, thấy ở góc ngang và góc trên xuống
  const backGeo = new THREE.PlaneGeometry(1, 1, 16, 8);
  {
    const p = backGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i) + .5, v = p.getY(i) + .5;
      const d = 1 - v;
      const x = (u - .5) * W * .94 * (1 - .10 * Math.pow(Math.abs(2 * v - 1), 8));
      const y = -d * .135;
      p.setXYZ(i, x, y, zw(x, d) * .45 - .010);
    }
    backGeo.computeVertexNormals();
  }
  const back = new THREE.Mesh(backGeo, matBack);
  back.castShadow = true; t.add(back);
  // dải sồn dệt ở mép trên: hai đường viền dệt chạy sát mép
  const bandTex = canvasTex(256, 64, (c, w, h) => {
    c.fillStyle = '#f6e0a2'; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(122,80,24,.80)'; c.lineWidth = 4.5;
    c.beginPath(); c.moveTo(0, h * .30); c.lineTo(w, h * .30); c.moveTo(0, h * .70); c.lineTo(w, h * .70); c.stroke();
    c.strokeStyle = 'rgba(96,60,18,.70)'; c.lineWidth = 2.4;
    for (let x = 0; x < w; x += 9) { c.beginPath(); c.moveTo(x, h * .30 - 4); c.lineTo(x + 4, h * .30 + 4); c.stroke(); }
    const r = mulberry(91);
    for (let k = 0; k < 900; k++) { c.fillStyle = `rgba(150,120,70,${r() * .10})`; c.fillRect(r() * w, r() * h, 2, 2); }
  });
  const bandMat = toon('#ffffff', { side: THREE.DoubleSide, map: bandTex });
  {
    const bg = new THREE.PlaneGeometry(1, 1, 24, 3);
    const p = bg.attributes.position;
    const d0 = .022, d1 = .070;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i) + .5, vv = p.getY(i) + .5;
      const d = d0 + (d1 - d0) * vv;
      const rx = 1 - .12 * Math.pow(Math.abs(2 * (1 - d) - 1), 8);
      const ry = 1 - .10 * Math.pow(Math.abs(2 * u - 1), 8);
      const x = (u - .5) * W * rx;
      const y = -d * H * ry;
      p.setXYZ(i, x, y, zw(x, d) + .0035);
    }
    bg.computeVertexNormals();
    const band = new THREE.Mesh(bg, bandMat);
    band.position.z = .011;
    t.add(band);
  }
  // một góc gấp đôi: góc dưới bên phải gập vào, lộ mặt sau của khăn
  {
    const A = new THREE.Vector2(.076, -.414), B = new THREE.Vector2(.176, -.314), Pp = new THREE.Vector2(.176, -.414);
    const d = new THREE.Vector2(.7071, .7071);
    const v = Pp.clone().sub(A);
    const proj = v.dot(d);
    const P2 = A.clone().add(d.clone().multiplyScalar(2 * proj)).sub(v);
    const N = 12, pos = [], uv = [];
    const lift = (q) => {
      const dd = Math.min(1, Math.max(0, -q.y / H));
      const dist = Math.abs((q.x - A.x) * .7071 - (q.y - A.y) * .7071);
      const t = Math.min(1, dist / .0707);
      return new THREE.Vector3(q.x, q.y, zw(q.x, dd) + .010 + .026 * t);
    };
    for (let k = 0; k < N; k++) {
      const a0 = A.clone().lerp(B, k / N), a1 = A.clone().lerp(B, (k + 1) / N);
      const tri = [lift(P2), lift(a0), lift(a1)];
      for (const t of tri) { pos.push(t.x, t.y, t.z); uv.push(.5 + t.x / W, .5 + t.y / H); }
    }
    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    fg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    fg.computeVertexNormals();
    const flap = new THREE.Mesh(fg, flapMat);
    flap.castShadow = true; t.add(flap);
  }
  // mép rua: tua sáng mềm ở mép dưới, rủ xuống tự do
  const fringe = new THREE.Group(); t.add(fringe);
  const fringeMat = toon('#f8e9c2');
  const r = mulberry(57);
  for (let i = 0; i < 26; i++) {
    const x = -W * .42 + i * (W * .84) / 25;
    const len = .030 + r() * .020;
    const bend = (r() - .5) * .5;
    const u = x / W + .5;
    const ry = 1 - .10 * Math.pow(Math.abs(2 * u - 1), 8);
    const y0 = -H * ry + Math.sin(x * 11.5) * .006;
    const p0 = new THREE.Vector3(x, y0 + .004, .011);
    const p1 = new THREE.Vector3(x + bend * .012, y0 - len * .5, .012 + (r() - .5) * .006);
    const p2 = new THREE.Vector3(x + bend * .028, y0 - len, .013 + (r() - .5) * .012);
    const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([p0, p1, p2]), 8, .0055, 6, false), fringeMat);
    t.castShadow = false; fringe.add(t);
  }
  // loang ướt ở mép: giọt nước bám vào chỗ vải ướt nhất, không treo lơ lửng giữa không trung
  const hemBlot = mesh(new THREE.PlaneGeometry(.17, .15), new THREE.MeshBasicMaterial({
    color: new THREE.Color('#4a5a7a'), map: TEX.radial(), transparent: true, opacity: .0, depthWrite: false,
  }), [0, -H * .80, .032], { cast: false, recv: false });
  hemBlot.visible = false; t.add(hemBlot);
  let wetK = 1;
  const setWet = (k) => {
    wetK = clamp(k);
    mat.color.copy(new THREE.Color(color)).lerp(new THREE.Color(wetColor), wetK);
    matBack.color.copy(backBase).lerp(new THREE.Color(wetColor).lerp(new THREE.Color('#141018'), .12), wetK * .8);
    hemBlot.visible = wetK > .05;
    hemBlot.material.opacity = .46 * wetK;
  };
  setWet(1);
  return { group: g, body: front, fringe, hemBlot, setWet, get wet() { return wetK; } };
}

// đàn áo phơi chồng trên dây thứ hai
export function shirtPile({ n = 3, yAt: yAtExt = null } = {}) {
  const g = new THREE.Group();
  const shirts = [], clips = [];
  // dây phơi nằm ngang qua đỉnh đàn áo: thấy rõ ở cả ba góc nhìn
  const LEN = 1.45, SAG = .085;
  const curve = gA_ropeCurve(LEN, SAG, 0);
  const ropeMat = toon('#ffffff', { map: gA_ropeTex() });
  const ropeG = gA_ropeGroup(curve, { r: .0098, twist: .0022, pitch: .05, mat: ropeMat });
  g.add(ropeG);
  const yAt = (x) => yAtExt ? yAtExt(x) : -SAG * (1 - Math.min(1, (2 * x / LEN) ** 2));
  const COLORS = ['#f2f0e6', '#b9d8ef', '#e8b7c8'];
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * .26;
    const z = (i - (n - 1) / 2) * .024;
    // áo cổ tròn, không có mảng kính, xếp chồng lên nhau dọc theo dây
    const s = gA_plainShirt({ color: COLORS[i % 3], w: .58, h: .72 });
    s.group.position.set(x, yAt(x) - .012, z);
    s.group.rotation.y = (i - 1) * .22;
    s.group.rotation.z = (i - 1) * .05;
    g.add(s.group);
    shirts.push(s);
    // kẹp gỗ mắc vào dây
    const c = clothesClip({});
    c.group.position.set(x + .05, yAt(x + .05), z + .004);
    c.group.rotation.y = (i - 1) * .22;
    g.add(c.group);
    clips.push({ g: c.group, y: yAt(x + .05), i });
  }
  // dây, áo và kẹp đung đưa cùng nhau: kẹp không được đứng yên khi vải đang đung đưa
  const setSway = (t, amp) => {
    const dy = Math.sin(t * 1.4) * .012 * amp;
    ropeG.position.y = dy;
    shirts.forEach((s, i) => { s.group.rotation.z = (i - 1) * .05 + Math.sin(t * 1.4 + i) * .03 * amp; });
    clips.forEach(c => {
      c.g.rotation.z = Math.sin(t * 1.4 + c.i) * .03 * amp;
      c.g.position.y = c.y + dy;
    });
  };
  return { group: g, shirts, clips, rope: ropeG, setSway };
}

// ── bồn chậu + nước ────────────────────────────────────────────────────
export function basin() {
  const g = new THREE.Group();
  const R = .215, H = .150, OVAL = .90;        // chậu sâu ~1/3 đường kính: là CHẬU, không phải đĩa
  const matBody = toon('#e9eef0', { map: gC_plasticTex() });
  // thân chậu: quét ngoài → lên vành cuộn → quét vào trong, thành dày thấy ngay ở miệng
  const prof = [
    new THREE.Vector2(0, .010), new THREE.Vector2(.0805, .010), new THREE.Vector2(.1153, .0177),
    new THREE.Vector2(.1574, .0512), new THREE.Vector2(.1912, .0979), new THREE.Vector2(.2086, .1289),
    new THREE.Vector2(R, H - .008), new THREE.Vector2(R + .004, H), new THREE.Vector2(R - .020, H),
    new THREE.Vector2(.1885, .1275), new THREE.Vector2(.1574, .0872), new THREE.Vector2(.1244, .0470),
    new THREE.Vector2(.1025, .0256), new THREE.Vector2(.0787, .0230), new THREE.Vector2(0, .0230),
  ];
  const bowl = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), matBody);
  bowl.scale.set(OVAL, 1, OVAL);
  bowl.castShadow = true; bowl.receiveShadow = true; g.add(bowl);
  // viền miệng: cuộn tròn dày, cùng chất liệu nhựa — không phải quai dây
  const rimGeo = new THREE.TorusGeometry(R - .010, .0155, 10, 48);
  rimGeo.scale(OVAL, OVAL, 1); rimGeo.rotateX(-Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, matBody);
  rim.position.y = H - .004; rim.castShadow = true; rim.receiveShadow = true; g.add(rim);
  // hai quai cầm liền thành: một bản đề chụp vào thành, một nắm tròn ngang, to và rõ
  for (const sx of [-1, 1]) {
    const web = mesh(rbox(.030, .066, .052, .011), matBody, [sx * .190, .120, 0]);
    g.add(web);
    const grip = mesh(rbox(.092, .034, .042, .013), matBody, [sx * .232, .120, 0]);
    g.add(grip);
    // hở tay cầm: một khoảng hở nhỏ dưới nắm, đọc ra là chậu có quai
    const hole = mesh(rbox(.058, .020, .030, .006), toon('#5d92ad'), [sx * .228, .101, 0]);
    hole.castShadow = false; g.add(hole);
  }

  // ── nước trong chậu: mặt nước PHẲNG, lặng, xanh nước nhạt ──
  const RW = .166, WY = .118;
  // mực nước nằm ở cao độ này: thành trong của chậu ở đó rộng .190
  const wtex = canvasTex(512, 512, (c, cw, ch) => {
    const cx = cw / 2, cy = ch / 2;
    // nền xanh nước nhạt, hơi trong; sâu ở giữa, nhạt ở mép
    const gg = c.createRadialGradient(cx, cy, cw * .02, cx, cy, cw * .52);
    gg.addColorStop(0, '#2b7fa0');
    gg.addColorStop(.42, '#3f96b8');
    gg.addColorStop(.78, '#63b3ce');
    gg.addColorStop(1, '#93d3e4');
    c.fillStyle = gg; c.fillRect(0, 0, cw, ch);
    // gợn nhẹ, đều, tương phản thấp: mặt nước lặng chứ không lấp lánh
    c.lineCap = 'round';
    for (let i = 1; i <= 10; i++) {
      const rad = cw * (.036 * i + .01);
      c.strokeStyle = `rgba(255,255,255,${.085 - i * .004})`; c.lineWidth = 1.5;
      c.beginPath(); c.arc(cx, cy, rad, 0, 7); c.stroke();
      c.strokeStyle = `rgba(64,140,168,${.075 - i * .004})`; c.lineWidth = 1.3;
      c.beginPath(); c.arc(cx, cy, rad + 2.2, 0, 7); c.stroke();
    }
    // vài vệt sáng mềm lan rộng (phản chiếu trời), không có đốm lấp lánh
    const r = mulberry(517);
    for (let i = 0; i < 26; i++) {
      const x = r() * cw, y = r() * ch, a = -0.5 + r() * 0.5;
      const L = cw * (.10 + r() * .26), T = 4 + r() * 9;
      c.save(); c.translate(x, y); c.rotate(a);
      const lg = c.createLinearGradient(-L / 2, 0, L / 2, 0);
      lg.addColorStop(0, 'rgba(255,255,255,0)');
      lg.addColorStop(.5, `rgba(255,255,255,${.10 + r() * .12})`);
      lg.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = lg; c.fillRect(-L / 2, -T / 2, L, T); c.restore();
    }
    // hạt rác rất nhỏ, mờ
    for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(255,255,255,${r() * .12})`; c.fillRect(r() * cw, r() * ch, 2, 2); }
  });
  const wg = new THREE.RingGeometry(.0010, RW, 84, 18);
  {
    const p = wg.attributes.position, uv = wg.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const r = Math.hypot(x, y);
      // gợn rất nhỏ lan từ giữa ra mép: mặt nước vẫn phẳng lặng
      const z = Math.sin(r * 42) * .0013 * Math.exp(-r * 2.6) + Math.sin(x * 26 + y * 7) * .0005;
      p.setZ(i, z);
      uv.setXY(i, .5 + x / (2 * RW), .5 + y / (2 * RW));
    }
    wg.computeVertexNormals();
  }
  wg.scale(OVAL, OVAL, 1); wg.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(wg, toon('#ffffff', { map: wtex, transparent: true, opacity: .84, side: THREE.DoubleSide }));
  water.position.y = WY; water.receiveShadow = true; g.add(water);
  // vòng mực nước: đường ẩm trên thành trong của chậu, ngay tại mặt nước
  {
    const wg2 = new THREE.TorusGeometry(.1675, .0034, 8, 72);
    wg2.scale(OVAL, OVAL, 1); wg2.rotateX(-Math.PI / 2);
    const line = new THREE.Mesh(wg2, toon('#4e93ab'));
    line.position.y = WY; line.castShadow = false; line.receiveShadow = true; g.add(line);
    // mép nước sáng mảnh ngay trên mực: lớp căng bề mặt
    const wg3 = new THREE.TorusGeometry(.1653, .0013, 6, 72);
    wg3.scale(OVAL, OVAL, 1); wg3.rotateX(-Math.PI / 2);
    const surf = new THREE.Mesh(wg3, toon('#e2f6fc'));
    surf.position.y = WY + .0004; surf.castShadow = false; g.add(surf);
  }
  return { group: g, bowl, water };
}

// ── quạt bàn: lưới, cánh quạt, chân đế ───────────────────────────────
export function deskFan() {
  const g = new THREE.Group();
  let speed = 0, angle = 0;
  const head = new THREE.Group(); head.position.set(0, .42, 0); g.add(head);
  const mWire = toon('#e3e8f2');        // nan lưới sáng: lồng đọc ra ngay
  const mWireDim = toon('#c2c9da');     // nan mảnh hơn ở vành trong
  const mBlade = toon('#fdf3de');       // cánh quạt kem
  const mCase = toon('#4a5270');        // vỏ motor sau
  const mCaseDark = toon('#2f3650');
  const mSteel = toon('#b6bed0');

  // ── lồng nan phía trước: nan dày, sáng; giữa nan thấy rõ cánh quạt ──
  head.add(mesh(new THREE.TorusGeometry(.166, .0092, 6, 40), mWire, [0, 0, .050]));       // vành ngoài
  head.add(mesh(new THREE.TorusGeometry(.116, .0052, 5, 32), mWireDim, [0, 0, .048]));   // vành trong
  head.add(mesh(new THREE.TorusGeometry(.046, .0058, 5, 24), mWireDim, [0, 0, .046]));   // vành quanh nắp trục
  for (let i = 0; i < 8; i++) {                                                          // nan nan (dày, sáng)
    const a = i / 8 * Math.PI * 2 + .22;
    const sp = mesh(new THREE.BoxGeometry(.011, .122, .0065), mWire, [Math.cos(a) * .105, Math.sin(a) * .105, .047], { rot: [0, 0, a] });
    sp.castShadow = false; head.add(sp);
  }
  // nắp trục ở tâm: tròn, sáng, không vết đỏ
  head.add(mesh(new THREE.CylinderGeometry(.026, .026, .070, 18), mSteel, [0, 0, .012], { rot: [Math.PI / 2, 0, 0] }));
  head.add(mesh(new THREE.SphereGeometry(.026, 14, 10), mSteel, [0, 0, .050]));

  // ── ba cánh quạt kem, to, đủ thấy rõ qua lưới ──────────────────────
  const blades = new THREE.Group(); head.add(blades);
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(.026, -.022);
  bladeShape.quadraticCurveTo(.078, -.052, .136, -.040);
  bladeShape.quadraticCurveTo(.148, -.012, .134, .020);
  bladeShape.quadraticCurveTo(.080, .038, .028, .020);
  bladeShape.closePath();
  const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, { depth: .007, bevelEnabled: false, curveSegments: 10 });
  bladeGeo.translate(0, 0, -.0035);
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Group(); b.rotation.z = i / 3 * Math.PI * 2 + .28; blades.add(b);
    // nghiêng cánh về phía trước để cả cánh nằm trước vỏ motor, không bị vỏ nuốt mất
    const blade = mesh(bladeGeo, mBlade, [0, 0, -.020], { rot: [0, -.28, .42] });
    blade.castShadow = false; b.add(blade);
    const rib = mesh(rbox(.092, .010, .011, .003), toon('#e9dcb6'), [.086, .010, .006], { rot: [0, 0, 0] });
    rib.castShadow = false; blade.add(rib);
  }

  // ── vệt quét của cánh quạt ──────────────────────────────────────────
  // Một khung hình đứng không bao giờ cho thấy cánh đang quay: cánh luôn sắc
  // nét, nên người xem tắt tiếng đọc thành "quạt đang tắt". Vì vậy khi quạt
  // chạy phải có MỘT vệt quét: một đĩa mờ đứng giữa cánh và lưới, cộng vài
  // cung mờ là dấu vết của cánh. Tắt quạt thì vệt quét biến mất.
  const blurTex = canvasTex(256, 256, (c, w, h) => {
    c.clearRect(0, 0, w, h);
    const g0 = c.createRadialGradient(w / 2, h / 2, w * .05, w / 2, h / 2, w * .49);
    g0.addColorStop(0, 'rgba(255,247,226,.10)');
    g0.addColorStop(.42, 'rgba(255,244,220,.34)');
    g0.addColorStop(.86, 'rgba(255,240,206,.22)');
    g0.addColorStop(1, 'rgba(255,240,206,0)');
    c.fillStyle = g0; c.fillRect(0, 0, w, h);
    c.lineCap = 'round';
    for (let i = 0; i < 3; i++) {           // dấu vết của từng cánh khi quay
      c.strokeStyle = `rgba(255,251,236,${.34 - i * .07})`;
      c.lineWidth = 16 - i * 4;
      c.beginPath();
      c.arc(w / 2, h / 2, w * (.26 + i * .07), i * 2.09, i * 2.09 + 1.75);
      c.stroke();
    }
  });
  const blurMat = new THREE.MeshBasicMaterial({
    map: blurTex, transparent: true, opacity: 0, depthWrite: false,
    side: THREE.DoubleSide, toneMapped: false,
  });
  const blurDisc = new THREE.Mesh(new THREE.CircleGeometry(.152, 40), blurMat);
  blurDisc.position.set(0, 0, .014);        // sau lưới (.050), trước cánh (-.020)
  blurDisc.castShadow = false; blurDisc.receiveShadow = false;
  head.add(blurDisc);

  // ── vỏ motor sau: trụ tròn + khe tản nhiệt; nan không xuyên vào đây ──
  head.add(mesh(new THREE.CylinderGeometry(.160, .160, .086, 26), mCase, [0, 0, -.075], { rot: [Math.PI / 2, 0, 0] }));
  head.add(mesh(new THREE.CylinderGeometry(.160, .118, .046, 26), mCase, [0, 0, -.141], { rot: [Math.PI / 2, 0, 0] }));
  head.add(mesh(new THREE.TorusGeometry(.160, .0062, 5, 34), mCaseDark, [0, 0, -.033]));
  for (let i = 0; i < 10; i++) {                       // khe tản nhiệt quanh vỏ motor
    const a = i / 10 * Math.PI * 2 + .12;
    const v = mesh(rbox(.014, .046, .030, .004), mCaseDark, [Math.cos(a) * .158, Math.sin(a) * .158, -.078], { rot: [0, 0, a + Math.PI / 2] });
    v.castShadow = false; head.add(v);
  }

  // ── cọc: đứng sau vỏ motor, không cắt ngang lồng nan ───────────────
  g.add(mesh(new THREE.CylinderGeometry(.0165, .018, .284, 12), toon('#3f4763'), [0, .162, -.052]));
  g.add(mesh(new THREE.CylinderGeometry(.026, .026, .014, 12), toon('#2f3650'), [0, .028, -.052]));
  // ── chân đế: mỏng, sáng, gọn so với thân đầu quạt ─────────────────
  g.add(mesh(new THREE.CylinderGeometry(.100, .104, .008, 26), toon('#3f4763'), [0, .004, -.010]));
  g.add(mesh(new THREE.CylinderGeometry(.090, .096, .015, 26), toon('#e2dac6'), [0, .015, -.010]));
  // nút xoay tốc độ ở chân đế (không đặt ở tâm lồng quạt)
  g.add(mesh(new THREE.CylinderGeometry(.011, .011, .013, 14), toon('#e0453f'), [.050, .029, .028]));
  return {
    group: g, head, blades, blurDisc,
    // tốc độ > 0 thì vệt quét hiện ra: độ đậm theo tốc độ, để "quạt đang chạy"
    // đọc được ngay ở một khung hình đứng
    setSpeed: (k) => { speed = clamp(k); blurMat.opacity = speed > .04 ? Math.min(.92, speed * .46) : 0; },
    spin: (t) => { angle += speed * .34; blades.rotation.z = angle; },
    setAim: (a) => { head.rotation.y = a; },
  };
}

// ── bàn thấp đặt quạt ─────────────────────────────────────────────────
export function sideTable() {
  const g = new THREE.Group();
  g.add(mesh(rbox(.52, .04, .40, .01), M.wood, [0, .72, 0]));
  g.add(mesh(rbox(.46, .025, .34, .008), M.woodDark, [0, .30, 0]));
  for (const [x, z] of [[-.22, -.16], [.22, -.16], [-.22, .16], [.22, .16]])
    g.add(mesh(new THREE.CylinderGeometry(.022, .026, .72, 8), M.woodDark, [x, .36, z]));
  return { group: g };
}

// ── túi nylon buộc cọc / treo trong phòng ─────────────────────────────
export function nylonBag({ color = '#9db2c0', w = .19, h = .25 } = {}) {
  const g = new THREE.Group();
  const RMAX = w * .50, BOT_Y = -.230, TIE_Y = -.006;   // đáy túi ở BOT_Y, chỗ buộc ở TIE_Y
  const CINCH_R = w * .090, TIE_H = .050;                // TIE_H = búi vải dồn lên trên chỗ buộc
  const BELLY_R = RMAX * 1.08;                          // bụng phình
  // nylon: bề mặt satin bóng, nếp gấp sắc cạnh, xuyên sáng ở chỗ mỏng
  const mat = toon(color, {
    side: THREE.DoubleSide, transparent: true, opacity: .93,
    map: gC_nylonTex(), flatShading: true, emissive: new THREE.Color('#4fb6d6'), emissiveIntensity: .12,
  });
  mat.map.repeat.set(1.5, 1.3); mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
  // túi treo từ móc: miệng túi ở y = 0, thân túi xuống dưới
  const body = new THREE.Group(); g.add(body);
  // các nếp gấp: đường sống gấp chạy dọc, lệch vị trí, mép sắc
  const CREASES = [];
  { const r = mulberry(915);
    for (let i = 0; i < 6; i++) CREASES.push({ a: r() * Math.PI * 2, s: (r() - .5) * .45, w: .26 + r() * .16, amp: .016 + r() * .014 }); }
  // bán kính theo chiều cao: đáy tròn → bụng phình → xoáy thắt nhỏ ở chỗ buộc
  const prof = (v) => {
    if (v < .14) { const t = v / .14; return RMAX * .90 * Math.sqrt(1 - (1 - t) * (1 - t)); }
    if (v < .30) { const t = (v - .14) / .16; return RMAX * .90 + (BELLY_R - RMAX * .90) * Math.sin(t * Math.PI / 2); }
    const t = (v - .30) / .70, s = t * t * (1.6 - .6 * t);
    return BELLY_R + (CINCH_R - BELLY_R) * s;
  };
  const NU = 40, NV = 22;
  const bg = gC_ringGrid(NU, NV, (u, v, i, j) => {
    const a = u * Math.PI * 2;
    // nhăn bề mặt: nhiễu mượt hai tần số
    const nz = (gC_vnoise(i * .55, j * .55, 3) - .5) + (gC_vnoise(i * 1.4, j * 1.4, 9) - .5) * .40;
    let r = prof(v) * (1 + nz * .082);
    // gom nếp ở vai: túi bị xoáy lên từ bụng, nếp chạy dọc, mép sắc
    const gather = Math.max(0, (v - .30) / .70);
    r *= 1 + gather * (.055 * Math.cos(a * 5 + .9) + .032 * Math.cos(a * 9 - 1.6));
    // nếp gấp: đường sống gấp hẹp, lệch theo chiều cao
    for (const cr of CREASES) {
      let d = a - (cr.a + cr.s * (v - .5) * 2);
      d = Math.atan2(Math.sin(d), Math.cos(d));
      const t = 1 - Math.min(1, Math.abs(d) / cr.w);
      if (t > 0) r += cr.amp * t * t * (.35 + .65 * Math.min(1, v * 1.5)) * Math.max(.22, prof(v) / BELLY_R);
    }
    const cx = .010 * Math.sin(v * 2.4), cz = .008 * Math.sin(v * 1.9 + 1);
    return [Math.cos(a) * r + cx, BOT_Y + v * (TIE_Y - BOT_Y), Math.sin(a) * r + cz];
  });
  const bag = new THREE.Mesh(bg, mat);
  bag.castShadow = true; bag.receiveShadow = true; body.add(bag);
  // cổ túi: vải bị xếp nhăn và thắt lại — nón xuống tới chỗ buộc, rồi phồng lên phía trên
  const neckGeo = gC_ringGrid(32, 8, (u, v) => {
    const a = u * Math.PI * 2;
    const ph = a * 7 / (Math.PI * 2), saw = ph - Math.floor(ph);
    const r = CINCH_R * (1 + .34 * Math.sin(Math.PI * Math.min(1, v * .92))) * (1 - .52 * v * v);
    // nếp dọc chạy quanh búi vải, mạnh nhất ở giữa
    const pleat = 1 + .52 * (saw - .5) * 2 * Math.sin(Math.PI * Math.min(1, v));
    return [Math.cos(a) * r * pleat, TIE_Y + v * TIE_H, Math.sin(a) * r * pleat];
  });
  const neck = new THREE.Mesh(neckGeo, mat);
  neck.castShadow = true; neck.receiveShadow = true; body.add(neck);
  // lớp bóng satin: các dải sáng cộng thêm trên bề mặt — nylon bóng, không phải vải mờ
  const sheen = new THREE.Mesh(bg.clone(), new THREE.MeshBasicMaterial({
    map: gC_satinSheenTex(), transparent: true, opacity: .62,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  }));
  sheen.scale.setScalar(1.004);
  sheen.castShadow = false; sheen.receiveShadow = false; body.add(sheen);
  // dây buộc: dây nylon mảnh dẹt quanh chỗ thắt, hai vòng ép chặt
  const cordMat = toon('#f0f7fb', { transparent: true, opacity: .97 });
  const CORD_Y = TIE_Y + .004;
  for (const [turn, dy, rr] of [[0, .002, 1.00], [1, -.010, .97]]) {
    const pts = [];
    for (let i = 0; i < 36; i++) {
      const a = i / 36 * Math.PI * 2 + turn * .20;
      const r = CINCH_R * 1.10 * rr;
      pts.push(new THREE.Vector3(Math.cos(a) * r, CORD_Y + dy + Math.sin(a * 2) * .0012, Math.sin(a) * r));
    }
    const rib = new THREE.Mesh(gC_sweepRibbon(pts, .0085, .0019, true), cordMat);
    rib.castShadow = true; body.add(rib);
  }
  // nút buộc: một búi dây dẹt ở chỗ thắt, không có hạt cứng lọt vào túi
  {
    const knotPts = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14, a = Math.PI * 2 * t;
      knotPts.push(new THREE.Vector3(Math.cos(a) * .012 + CINCH_R * .55, CORD_Y + Math.sin(a) * .010, CINCH_R * .55 + Math.sin(a) * .004));
    }
    const knot = new THREE.Mesh(gC_sweepRibbon(knotPts, .0072, .0016), cordMat);
    knot.castShadow = true; body.add(knot);
  }
  // hai đuôi dây buộc lủng lẳng, mỏng dẹt
  for (const [sx, dz] of [[-.010, .004], [.009, .002]]) {
    const pts = [];
    for (let i = 0; i <= 7; i++) {
      const t = i / 7;
      pts.push(new THREE.Vector3(sx * (1 + t * 1.4) + Math.sin(t * 4.2) * .005,
        CORD_Y - t * .090, CINCH_R * .55 + dz * (1 + t * 2.6) + Math.cos(t * 3.4) * .004));
    }
    const tail = new THREE.Mesh(gC_sweepRibbon(pts, .0072, .0016), cordMat);
    tail.castShadow = false; body.add(tail);
  }
  // quai treo: một vòng dây nylon mảnh ở trên chỗ buộc
  {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20, a = Math.PI * (1 - t);
      pts.push(new THREE.Vector3(Math.cos(a) * .021 + CINCH_R * .55, CORD_Y + .004 + Math.sin(a) * .072, CINCH_R * .55 + Math.sin(a) * .004));
    }
    const loop = new THREE.Mesh(gC_sweepRibbon(pts, .0062, .0015), cordMat);
    loop.castShadow = false; body.add(loop);
  }
  // lớp vỏ trong suốt: nylon mỏng xuyên sáng ở nếp, viền sáng mảnh
  const rim = new THREE.Mesh(bg.clone(), new THREE.MeshBasicMaterial({
    color: new THREE.Color('#dff6ff'), transparent: true, opacity: .12,
    side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  rim.scale.setScalar(1.02);
  rim.castShadow = false; rim.receiveShadow = false; body.add(rim);
  const swing = (t, k = 1) => { body.rotation.z = Math.sin(t * 2.1) * .28 * k; body.rotation.x = Math.sin(t * 1.3 + 1) * .12 * k; };
  return { group: g, bag: body, swing };
}

// ── cân nhà bếp: mặt đồng hồ kim ở chính giữa thân, mặt cân ở trên ───
export function kitchenScale() {
  const g = new THREE.Group();
  // set.js nghiêng cân 0.52 rad; nhóm này bù ngược lại để cân luôn đứng thẳng
  const up = new THREE.Group(); g.add(up);
  const syncTilt = () => { up.rotation.x = -g.rotation.x; };
  syncTilt();
  const W = .27, H = .20, D = .21, FOOT = .016;
  const mBody = toon('#ffffff', { map: gD_paintTex('#e6ddcd', 7) });
  const mLid = toon('#ffffff', { map: gD_paintTex('#d6ccb9', 13) });
  // chân: cân có đế, không bị lơ lửng
  for (const [x, z] of [[-.100, -.070], [.100, -.070], [-.100, .070], [.100, .070]])
    up.add(mesh(new THREE.CylinderGeometry(.014, .016, FOOT, 10), M.metalDark, [x, FOOT / 2, z]));
  // thân hộp
  up.add(mesh(rbox(W, H, D, .022), mBody, [0, FOOT + H / 2, 0]));
  // nắp trên: mặt phẳng có viền
  up.add(mesh(rbox(W - .012, .012, D - .012, .005), mLid, [0, FOOT + H + .006, 0]));
  // đĩa cân: tấm inox nằm phẳng, mép nổi quanh, không lơ lửng trên trụ
  up.add(mesh(rbox(.238, .010, .178, .005), M.metalDark, [0, FOOT + H + .013, 0]));
  up.add(mesh(rbox(.216, .009, .156, .004), M.metal, [0, FOOT + H + .019, 0]));
  // mặt đồng hồ: tròn, đặt thẳng hàng chính giữa thân, đọc được số 0–400 g
  const dialTex = canvasTex(640, 640, (c, cw, ch) => {
    const cx = cw / 2, cy = ch / 2;
    c.fillStyle = '#f8f4e9'; c.fillRect(0, 0, cw, ch);
    // vòng ngoài
    c.strokeStyle = '#2b3352'; c.lineWidth = 10;
    c.beginPath(); c.arc(cx, cy, 300, 0, 7); c.stroke();
    const ang = (i) => 3.927 - 4.712 * (i / 20);      // 0 g ở góc dưới trái, 400 g ở góc dưới phải
    for (let i = 0; i <= 20; i++) {
      const a = ang(i), big = i % 4 === 0;
      c.strokeStyle = '#2b3352'; c.lineWidth = big ? 15 : 8;
      const r0 = big ? 252 : 268;
      c.beginPath();
      c.moveTo(cx + Math.cos(a) * r0, cy - Math.sin(a) * r0);
      c.lineTo(cx + Math.cos(a) * 296, cy - Math.sin(a) * 296);
      c.stroke();
    }
    // KHÔNG in số trên mặt cân: phim không nói con số gam nào (FACTS.md), và một
    // mặt cân in "400" khiến người xem đọc nhầm thành số đo của câu kể. Cân đo
    // bằng vạch và kim — thấy hai kim lệch nhau là đủ để kể.
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = 'bold 44px sans-serif'; c.fillStyle = '#8d93a4';
    c.fillText('CÂN', cx, cy + 224);
    // vạch đỏ ở mức tối đa
    c.strokeStyle = '#d1443c'; c.lineWidth = 16;
    const am = 3.927 - 4.712;
    c.beginPath();
    c.moveTo(cx + Math.cos(am) * 244, cy - Math.sin(am) * 244);
    c.lineTo(cx + Math.cos(am) * 298, cy - Math.sin(am) * 298);
    c.stroke();
  });
  const face = new THREE.Mesh(new THREE.CircleGeometry(.084, 48), new THREE.MeshBasicMaterial({ map: dialTex, toneMapped: false }));
  face.position.set(0, FOOT + H / 2, D / 2 + .003); up.add(face);
  // viền đồng hồ + mặt kính
  up.add(mesh(new THREE.TorusGeometry(.089, .008, 6, 36), M.metalDark, [0, FOOT + H / 2, D / 2 + .006]));
  const glass = new THREE.Mesh(new THREE.CircleGeometry(.082, 36), toon('#eaf6ff', { transparent: true, opacity: .16, depthWrite: false }));
  glass.position.set(0, FOOT + H / 2, D / 2 + .012); up.add(glass);
  // kim đỏ: trục ở chính giữa, quay trong mặt phẳng đồng hồ
  const needle = new THREE.Mesh(new THREE.BoxGeometry(.008, .090, .004), toon(PAL.red));
  needle.geometry.translate(0, .036, 0);
  needle.position.set(0, FOOT + H / 2, D / 2 + .009); up.add(needle);
  needle.rotation.z = 2.356 - .375 * 4.712;        // kim ban đầu chỉ 150 g, không che số
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .010, 12), toon(PAL.red));
  hub.rotation.x = Math.PI / 2; hub.position.set(0, FOOT + H / 2, D / 2 + .013); up.add(hub);
  // nút chỉnh ở góc, không ở giữa mặt đồng hồ
  up.add(mesh(new THREE.CylinderGeometry(.014, .016, .012, 12), toon('#d8d2c4'), [.106, FOOT + .030, D / 2 - .008], { rot: [Math.PI / 2, 0, 0] }));
  let reading = 0;
  return {
    group: g, needle,
    // kim phải chỉ đúng vạch: 0 g ở góc dưới trái, 200 g ở đỉnh, 400 g ở góc dưới phải
    // kim nằm trong mặt phẳng XY của mặt đồng hồ, nên phải xoay quanh trục Z
    setReading: (k) => { reading = clamp(k); needle.rotation.z = 2.356 - reading * 4.712; syncTilt(); },
  };
}

// ── nhiệt kế treo tường: thủy ngữ trong ống, vạch, cột hồng khoáng ──
export function thermometer() {
  const g = new THREE.Group();
  // thân đặt trong khung thật: khung có lỗ treo xuyên, mặt trắng nằm lõm bên trong
  const FW = .105, FH = .35, FD = .018, WW = .072, WH = .272, WY = -.004;
  const frameTex = gD_paintTex('#59688a', 11);
  frameTex.repeat.set(1 / FW, 1 / FH); frameTex.offset.set(.5, .5);   // vân sơn tràn đúng thân khung
  const frame = mesh(gD_thermFrameGeo(FW, FH, .012, .034, .028, .0075, WW, WH, WY, FD), toon('#ffffff', { map: frameTex }), [0, 0, -FD / 2]);
  g.add(frame);
  // mặt giấy trắng lõm trong khung
  g.add(mesh(rbox(WW + .008, WH + .008, .006, .004), toon('#f6f2e6'), [0, WY, -.002]));
  // thang đo: 10 độ ở y = −.10, 50 độ ở y = +.06 (40 độ trên .16 m → .004 m/độ)
  const Y10 = -.10, Y50 = .06;
  const PPM = 4000, WTOP = WY + WH / 2;         // mép trên của cửa sổ
  const TX = .0215;                              // ống thuỷ ngữ nằm bên phải
  const faceTex = canvasTex(Math.round(WW * PPM), Math.round(WH * PPM), (c, w, h) => {
    c.fillStyle = '#f7f3e7'; c.fillRect(0, 0, w, h);
    const px = (x) => (x + WW / 2) * PPM, py = (y) => (WTOP - y) * PPM;
    // vạch sát bên trái ống thuỷ tinh: lớn mỗi 10 độ, nhỏ mỗi 2 độ
    c.strokeStyle = '#252d50';
    for (let d = 10; d <= 50; d += 2) {
      const y = Y10 + (d - 10) * .004, big = d % 10 === 0;
      c.lineWidth = big ? 7 : 4;
      c.beginPath();
      c.moveTo(px(.0105), py(y));
      c.lineTo(px(big ? -.0075 : .0005), py(y));
      c.stroke();
    }
    // số thang đậm rõ, ngay cạnh vạch
    c.fillStyle = '#1d2444'; c.font = 'bold 62px sans-serif'; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (const [lab, y] of [['50', .06], ['40', .02], ['30', -.02], ['20', -.06], ['10', -.10]])
      c.fillText(lab, px(-.011), py(y));
    c.font = 'bold 58px sans-serif'; c.textAlign = 'left';
    c.fillText('°C', px(-.032), py(.112));
  });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(WW, WH), new THREE.MeshBasicMaterial({ map: faceTex, toneMapped: false }));
  face.position.set(0, WY, .002); face.castShadow = false; g.add(face);
  // MAX / MIN in thẳng trên khung, không trôi lơ lửng ngoài vật
  const maxLab = gD_textPlane('MAX', .036, .014, PAL.red, 62);
  maxLab.position.set(0, .152, FD / 2 + .0006); g.add(maxLab);
  const minLab = gD_textPlane('MIN', .036, .014, PAL.cyan, 62);
  minLab.position.set(0, -.157, FD / 2 + .0006); g.add(minLab);
  // ống thuỷ ngữ: có bóng kính để đọc ra là ống, không phải thanh trắng
  g.add(mesh(new THREE.CylinderGeometry(.0095, .0095, .200, 12), M.glass, [TX, -.012, .004]));
  g.add(mesh(new THREE.TorusGeometry(.0100, .0022, 5, 16), toon('#9fb0c8'), [TX, .088, .004], { rot: [Math.PI / 2, 0, 0] }));
  const hl = mesh(rbox(.0035, .150, .003, .001), toon('#ffffff', { transparent: true, opacity: .75, depthWrite: false }), [TX - .0045, -.020, .0135], { cast: false, recv: false });
  g.add(hl);
  // bóng thủy ngữ ở đáy ống
  g.add(mesh(new THREE.SphereGeometry(.0115, 12, 9), toon(PAL.red), [TX, -.114, .004]));
  const col = mesh(new THREE.CylinderGeometry(.0055, .0055, .10, 10), toon(PAL.red), [TX, -.065, .004]);
  g.add(col);
  // cột thuỷ ngữ phải đọc đúng: k = 0 → 10 °C, k = 1 → 50 °C (đỉnh cột nằm đúng vạch)
  const setTemp = (k) => {
    const top = Y10 + 40 * clamp(k) * (Y50 - Y10) / 40;   // đỉnh cột
    const H = Math.max(.006, top + .115);                 // đáy cột ở bóng đèn
    col.scale.y = H / .10;
    col.position.y = -.115 + H / 2;
  };
  setTemp(.5);                                           // ban đầu ở 30 °C
  // ── cột "ma" ──: thanh đỏ mờ đứng cạnh nhiệt kế, đỉnh ở đúng mức nhiệt
  // độ cần so sánh. Nhiệt kế trong cảnh chỉ đọc hai mươi lăm độ (FACTS.md),
  // nên ba mươi độ cần một phương tiện so sánh riêng, không phải đổi số trên
  // chính thiết bị đang treo trong phòng.
  const ghost = mesh(new THREE.CylinderGeometry(.0075, .0075, 1, 12),
    toon(PAL.red, { transparent: true, opacity: .40, depthWrite: false }),
    [.066, 0, .004], { cast: false, recv: false, parent: g });
  const setGhost = (k) => {
    if (k === undefined || k === null) { ghost.visible = false; return; }
    ghost.visible = true;
    const top = Y10 + 40 * clamp(k) * (Y50 - Y10) / 40;
    const base = WY - WH / 2;                        // đáy cửa sổ
    const H = Math.max(.012, top - base);
    ghost.scale.y = H;
    ghost.position.y = base + H / 2;
  };
  setGhost(null);
  return { group: g, setTemp, setGhost };
}

// ── ẩm kế treo tường: mặt đồng hồ, kim, vạch phần trăm ──────────────
export function hygrometer() {
  const g = new THREE.Group();
  // vỏ có chiều sâu thật: đáy + thành + viền trước dày, mặt kính lõm vào trong
  const mCase = toon('#ffffff', { map: gD_paintTex('#3f4a6b', 17) });
  const mRim = toon('#ffffff', { map: gD_paintTex('#2b3352', 19) });
  g.add(mesh(new THREE.CylinderGeometry(.118, .118, .048, 30), mCase, [0, 0, -.032], { rot: [Math.PI / 2, 0, 0] }));   // đáy vỏ
  g.add(mesh(new THREE.RingGeometry(.088, .118, 36), mRim, [0, 0, -.006]));                                       // mặt trước của vỏ, rỗng giữa
  g.add(mesh(new THREE.TorusGeometry(.1035, .0155, 7, 34), mRim, [0, 0, .014]));                                  // viền trước dày
  // tai treo ở đầu trên, lỗ khoét xuyên thật
  g.add(mesh(gD_lugGeo(.038, .044, .009, .010, .026, .007), mCase, [0, .130, -.004]));
  const faceTex = canvasTex(512, 512, (c, w, h) => {
    const cx = w / 2, cy = h / 2;
    c.fillStyle = '#f7f3e6'; c.fillRect(0, 0, w, h);
    // vân giấy nhẹ cho mặt đồng hồ, không phải mảng trắng trơn
    const r = mulberry(23);
    for (let i = 0; i < 900; i++) {
      c.fillStyle = `rgba(120,112,92,${.03 + r() * .05})`;
      const a = r() * 7, rr = r() * 250;
      c.beginPath(); c.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, .6 + r() * 1.6, 0, 7); c.fill();
    }
    const ang = (i) => 1.22 * Math.PI - 1.44 * Math.PI * (i / 10);   // 0% dưới trái, 100% dưới phải
    c.strokeStyle = '#252d50'; c.fillStyle = '#252d50';
    for (let i = 0; i <= 10; i++) {
      const a = ang(i), big = i % 2 === 0;
      c.lineWidth = big ? 14 : 8;
      const r0 = big ? 196 : 220;
      c.beginPath();
      c.moveTo(cx + Math.cos(a) * r0, cy - Math.sin(a) * r0);
      c.lineTo(cx + Math.cos(a) * 246, cy - Math.sin(a) * 246);
      c.stroke();
      if (big) {
        // số phần trăm đẩy ra xa thêm: không chồng lên số của vòng g/kg bên trong
        c.font = 'bold 54px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(String(i * 10), cx + Math.cos(a) * 170, cy - Math.sin(a) * 170);
      }
    }
    // ký hiệu % đặt dưới trục, không đè lên số nào
    c.font = 'bold 60px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = '#252d50';
    c.fillText('%', cx, cy + 52);
    // chữ HUMIDITY ở đáy mặt đồng hồ, to và đọc được
    c.font = 'bold 40px sans-serif'; c.fillStyle = '#5c6478';
    c.fillText('HUMIDITY', cx, cy + 208);
    // ── vòng phụ "gam hơi nước trên mỗi kilogam không khí khô" ──────────
    // Thang % một mình không nói được "20 g/kg": người xem tắt tiếng không có
    // chỗ nào để đặt con số đó. Vì vậy trên cùng mặt đồng hồ phải có một vòng
    // phụ ghi gam/kg, chạy cùng một góc với thang %.
    const gkAng = (v) => 1.22 * Math.PI - 1.44 * Math.PI * (v / 20);   // 0 → 20 g/kg
    c.strokeStyle = '#3f7d72'; c.lineWidth = 6;
    c.beginPath();
    c.arc(cx, cy, 138, gkAng(20), gkAng(0), false);
    c.stroke();
    c.font = 'bold 30px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let v = 0; v <= 20; v += 2.5) {
      const a = gkAng(v), big = (v % 5 === 0);
      c.strokeStyle = '#2f6a60'; c.lineWidth = big ? 8 : 5;
      c.beginPath();
      c.moveTo(cx + Math.cos(a) * 138, cy - Math.sin(a) * 138);
      c.lineTo(cx + Math.cos(a) * (big ? 112 : 122), cy - Math.sin(a) * (big ? 112 : 122));
      c.stroke();
      if (big) {
        c.fillStyle = '#2f6a60';
        c.fillText(String(v), cx + Math.cos(a) * 95, cy - Math.sin(a) * 95);
      }
    }
    // nhãn g/kg đứng ở KHE HỞ dưới mặt đồng hồ: cả vòng % và vòng g/kg đều
    // quét qua đỉnh, nên đáy mặt đồng hồ không có số nào — đặt ở đây thì
    // không chữ nào của đồng hồ bị đè lên nhau.
    c.fillStyle = '#2f6a60'; c.font = 'bold 30px sans-serif';
    c.fillText('g/kg', cx, cy + 122);
    // vạch đỏ ở mức tối đa: "đó là trần của nó"
    const am = ang(10);
    c.strokeStyle = '#d1443c'; c.lineWidth = 15;
    c.beginPath();
    c.moveTo(cx + Math.cos(am) * 202, cy - Math.sin(am) * 202);
    c.lineTo(cx + Math.cos(am) * 248, cy - Math.sin(am) * 248);
    c.stroke();
  });
  const face = new THREE.Mesh(new THREE.CircleGeometry(.096, 40), new THREE.MeshBasicMaterial({ map: faceTex, toneMapped: false }));
  face.position.set(0, 0, .002); g.add(face);
  // mặt kính có phản chiếu, nằm lõm dưới viền
  const glass = new THREE.Mesh(new THREE.CircleGeometry(.090, 36), toon('#eaf6ff', { transparent: true, opacity: .18, depthWrite: false }));
  glass.position.set(0, 0, .008); g.add(glass);
  // kim: thân đỏ dài, đầu kim đen, trục ở chính giữa
  const needle = new THREE.Mesh(new THREE.BoxGeometry(.0075, .074, .0035), toon(PAL.red));
  needle.geometry.translate(0, .027, 0);
  needle.position.set(0, 0, .0045); g.add(needle);
  const tip = mesh(new THREE.ConeGeometry(.0105, .026, 4), toon('#1e2438'), [0, .072, -.0005]);
  tip.rotation.y = Math.PI / 4;
  needle.add(tip);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .008, 14), toon(PAL.red));
  hub.rotation.x = Math.PI / 2; hub.position.set(0, 0, .0075); g.add(hub);
  // kim phải chỉ đúng vạch: 0% ở góc dưới trái, 50% ở đỉnh, 100% ở góc dưới phải
  // kim chỉ +Y khi rotation.z = 0; vạch vẽ ở góc a → kim phải xoay a − π/2
  const setRH = (k) => { needle.rotation.z = Math.PI * .72 - clamp(k) * Math.PI * 1.44; };
  setRH(.5);                                            // ban đầu 50 %
  return { group: g, needle, setRH };
}

// ── ghế gỗ ────────────────────────────────────────────────────────────
export function chair() {
  const g = new THREE.Group();
  const SW = .42, SD = .40, ST = .038, TOP = .445;      // mặt ghế 0.42 × 0.40, đỉnh mặt ở 0.445
  const LX = .163, LZ = .150;                            // chân trục tại x, z
  const legMat = M.woodDark, pegMat = M.woodPale;
  // ── chân: thon dần, hơi ngoái ra, đầu chân có nút chặn ──────────────
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const B = new THREE.Vector3(sx * (LX + .016), 0, sz * (LZ + .016));
    const Tp = new THREE.Vector3(sx * LX, TOP - ST, sz * LZ);
    g.add(gC_rod(B, Tp, .030, .024, legMat, 10));
    g.add(mesh(new THREE.CylinderGeometry(.030, .026, .014, 10), legMat, [B.x, .007, B.z]));
  }
  // ── mặt ghế: tấm ván dày + lớp vân gỗ đối xứng trên mặt ────────────
  const seat = mesh(rbox(SW, ST, SD, .012), M.wood, [0, TOP - ST / 2, 0]);
  g.add(seat);
  // lớp vân gỗ nằm riêng trên mặt, UV phẳng nên vân đối xứng đúng quanh trục giữa
  const face = mesh(new THREE.PlaneGeometry(SW - .016, SD - .016),
    toon('#ffffff', { map: gC_seatWoodTex() }), [0, TOP + .0006, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  g.add(face);
  // nối khớp: mỗi chân có một mảng tenon lộ trên mặt, đóng ốc gỗ
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    g.add(mesh(rbox(.034, .010, .034, .004), toon('#a9702f'), [sx * LX, TOP - .002, sz * LZ]));
    const peg = mesh(new THREE.CylinderGeometry(.0068, .0068, .012, 10), pegMat, [sx * LX, TOP + .002, sz * LZ]);
    g.add(peg);
    // ốc thột qua thành đà ngang: đầu ốc lộ ra ngoài thân chân
    g.add(mesh(new THREE.CylinderGeometry(.0055, .0055, .058, 8), pegMat,
      [sx * LX, .392, sz * LZ], { rot: [0, 0, Math.PI / 2] }));
  }
  // ── khung dưới mặt: đà ngang hai bên + đà trước ─────────────────────
  for (const sx of [-1, 1]) g.add(mesh(rbox(.020, .046, .300, .006), legMat, [sx * LX, .384, 0]));
  g.add(mesh(rbox(.326, .046, .020, .006), legMat, [0, .384, LZ]));
  // ── thanh giằng chéo giữa chân: một đường chéo ở mặt trước, một ở mặt sau ──
  g.add(gC_rod(new THREE.Vector3(-LX, .050, LZ), new THREE.Vector3(LX, .362, LZ), .014, .012, legMat, 8));
  g.add(gC_rod(new THREE.Vector3(LX, .050, -LZ), new THREE.Vector3(-LX, .362, -LZ), .014, .012, legMat, 8));
  // ── lưng ghế: hai cột nghiêng nhẹ + xà trên + hai nan ngang ─────────
  const POST_TOP = .900;
  for (const sx of [-1, 1]) {
    const top = new THREE.Vector3(sx * LX, POST_TOP, -.192);
    const bot = new THREE.Vector3(sx * LX, .392, -.146);
    g.add(gC_rod(bot, top, .023, .019, legMat, 10));
  }
  // xà trên: một khối bo tròn nối hai cột lưng
  g.add(mesh(rbox(.352, .054, .028, .012), M.wood, [0, .868, -.190]));
  // hai nan ngang giữa lưng
  for (const y of [.640, .752]) {
    const t = (y - .392) / (POST_TOP - .392);
    g.add(mesh(rbox(.300, .046, .022, .008), M.wood, [0, y, -.146 - .046 * t]));
    // ốc lộ ra ở chỗ nan gặp cột lưng
    for (const sx of [-1, 1]) g.add(mesh(new THREE.CylinderGeometry(.0050, .0050, .052, 8), pegMat,
      [sx * LX, y, -.146 - .046 * t], { rot: [0, 0, Math.PI / 2] }));
  }
  return { group: g };
}

// ── bàn gỗ + hai mặt kính + vách ngăn ────────────────────────────────
// hai tấm kính ĐỨNG trên mặt bàn, mỗi tấm giữ một giọt nước; vách kính ở giữa chặn gió
export function labTable() {
  const g = new THREE.Group();
  const TOP = .72, TH = .05, SURF = TOP + TH / 2;        // SURF = mặt trên của bàn
  g.add(mesh(rbox(1.5, TH, .7, .012), M.wood, [0, TOP, 0]));
  for (const [x, z] of [[-.66, -.28], [.66, -.28], [-.66, .28], [.66, .28]])
    g.add(mesh(new THREE.CylinderGeometry(.03, .034, .72, 8), M.woodDark, [x, .36, z]));
  const glassMat = toon('#eaf9ff', { transparent: true, opacity: .10, depthWrite: false, side: THREE.DoubleSide });
  const frameMat = toon('#e3e7ef');                      // khung kim loại mảnh, màu bạc
  const clipMat = toon('#9fa8ba');
  const plates = [];
  const drops = [];
  const tags = [];
  for (const sx of [-1, 1]) {
    const p = new THREE.Group(); p.position.set(sx * .34, 0, 0); g.add(p);
    const PW = .30, PH = .34;
    // đế kim loại mỏng + hai kẹp nhỏ giữ kính đứng thẳng (không chân kê gỗ)
    p.add(mesh(rbox(.13, .008, .095, .002), frameMat, [0, SURF + .004, 0]));
    for (const cz of [-.032, .032]) {
      p.add(mesh(rbox(.024, .044, .014, .003), clipMat, [0, SURF + .027, cz]));
      p.add(mesh(new THREE.CylinderGeometry(.0035, .0035, .020, 8), frameMat, [0, SURF + .050, cz], { rot: [Math.PI / 2, 0, 0] }));
    }
    // mặt kính: trong suốt, nhìn xuyên thấy vân gỗ của mặt bàn
    const cy = SURF + .008 + PH / 2;
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(PW, PH), glassMat);
    pane.position.set(0, cy, 0); p.add(pane);
    // khung mảnh bốn thanh
    for (const [bx, by, bw, bh] of [[0, PH / 2, PW + .008, .005], [0, -PH / 2, PW + .008, .005],
                                    [-PW / 2 - .002, 0, .005, PH], [PW / 2 + .002, 0, .005, PH]])
      p.add(mesh(rbox(bw, bh, .010, .0015), frameMat, [bx, cy + by, 0]));
    // khía sáng: một vệt trắng mảnh trên mặt kính
    p.add(mesh(rbox(.009, .20, .002, .0008), toon('#ffffff', { transparent: true, opacity: .30, depthWrite: false }),
      [-.072, cy + .012, .008], { rot: [0, 0, .10], cast: false, recv: false }));
    // giọt nước bám trên mặt kính: thân giọt được dựng cao để vẫn tròn khi set.js nén theo trục y
    const dmat = toon('#7ed2ea', { transparent: true, opacity: .86 });
    const td = teardrop(.026, dmat, { tail: .55 });
    td.body.scale.set(1, 1.45, 1);
    td.tip.scale.set(1, 1.45, 1);
    td.tip.position.y = -.026 * .78 * 1.45;
    td.hi.position.set(-.008, .011, .016);
    td.group.position.set(0, cy + .030, .020);
    p.add(td.group);
    // vệt nước nhỏ dưới giọt (không bị co theo giọt)
    const smear = mesh(new THREE.CircleGeometry(.026, 20), toon('#cdeff9', { transparent: true, opacity: .22, depthWrite: false }), [0, cy - .020, .010], { cast: false, recv: false });
    smear.scale.set(1, .55, 1);
    p.add(smear);
    // ── vòng tròn NÉT ĐỨT in sẵn trên kính: kích thước giọt lúc ĐẦU ──────
    // Đây là thước đo thật của câu "tốc độ bay hơi rơi còn một nửa": giọt nằm
    // trong vòng tròn, và mỗi giọt nhỏ đi một phần — người xem tắt tiếng
    // thấy ngay giọt nào co nhanh hơn, không cần đọc số.
    const ghostMat = toon('#e0664f', { transparent: true, opacity: .85, depthWrite: false });
    for (let i = 0; i < 14; i++) {
      const a0 = i / 14 * Math.PI * 2, a1 = a0 + (Math.PI * 2 / 14) * .55;
      const gg = mesh(new THREE.TorusGeometry(.030, .0016, 4, 8, a1 - a0), ghostMat,
        [0, cy + .030, .019], { rot: [0, 0, a0], cast: false, recv: false });
      p.add(gg);
    }
    plates.push(p);
    drops.push(td.group);
    // nhãn có in trên mặt bàn: nửa nào có gió, nửa nào không — người xem đọc
    // được ngay mà không cần ai giải thích
    {
      const tag = (txt, bg) => canvasTex(512, 128, (c, w, h) => {
        c.fillStyle = bg; c.fillRect(0, 0, w, h);
        c.strokeStyle = '#2b3352'; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12);
        c.fillStyle = '#1d2444'; c.font = 'bold 54px sans-serif';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(txt, w / 2, h / 2 + 2);
      });
      // nhãn ĐỨNG sau mỗi mặt kính (không phải nằm ngang trên mặt bàn: nằm ngang
      // thì máy nhìn gần mặt nước không đọc được chữ), nửa nào có gió, nửa nào
      // không — người xem đọc được ngay mà không cần ai giải thích
      const lab = mesh(new THREE.PlaneGeometry(.34, .085), toon('#ffffff', { map: tag(sx < 0 ? 'KHÔNG CÓ GIÓ' : 'CÓ GIÓ', sx < 0 ? '#f3e2cf' : '#dcefe2') }),
        [0, SURF + .052, -.17], { rot: [-.16, 0, 0], cast: false, recv: false });
      p.add(lab);
      tags.push(lab);
    }
  }
  // ── vách ngăn: tấm kính rộng trải hết chiều sâu bàn ──
  const DIVH = .46, DIVD = .68;
  const divider = new THREE.Mesh(new THREE.PlaneGeometry(DIVD, DIVH), glassMat);
  divider.rotation.y = Math.PI / 2;
  divider.position.set(0, SURF + .012 + DIVH / 2, 0);
  g.add(divider);
  // rãnh gắn ở đáy (U-track kim loại) + hai bản lề ở hai đầu: đọc ra là vách ngăn
  g.add(mesh(rbox(.036, .022, DIVD, .004), clipMat, [0, SURF + .011, 0]));
  for (const sz of [-DIVD / 2 + .022, DIVD / 2 - .022]) {
    g.add(mesh(new THREE.CylinderGeometry(.008, .008, .10, 10), frameMat, [0, SURF + .062, sz]));
    g.add(mesh(rbox(.022, .026, .036, .004), clipMat, [0, SURF + .013, sz]));
  }
  return { group: g, plates, divider, drops, tags };
}

const FIB_N = 13;

const FIB_HALF = (FIB_N - 1) / 2;

const FIB_SIZE = .338;

const FIB_PITCH = FIB_SIZE / FIB_N;

const FIB_ANCHOR = new THREE.Vector3(.040, .078, .012);

const FIB_F = FIB_ANCHOR.clone().normalize();

const FIB_G = new THREE.Vector3(-FIB_F.y, FIB_F.x, 0).normalize();

const FIB_R_REG = FIB_PITCH * .31;

const FIB_AMP = FIB_R_REG * 1.35;

const FIB_BA = (FIB_HALF - 1.5) * FIB_PITCH;

const FIB_BC = FIB_BA - FIB_ANCHOR.dot(FIB_F);

const FIB_O = FIB_F.clone().multiplyScalar(-FIB_BC);

const fibDrape = (a, b) => {
  const ea = Math.tanh(a / .075), eb = (b - FIB_BA) / .20;
  return .010 * ea * ea * eb * eb + .003 * Math.sin(7.0 * (b - FIB_BA)) * Math.cos(5.0 * a);
};

const fibPhase = (a, b) => Math.PI * ((a + FIB_HALF * FIB_PITCH) / FIB_PITCH + (b + FIB_HALF * FIB_PITCH) / FIB_PITCH);

const fibPoint = (a, b, z) => new THREE.Vector3(
  FIB_O.x + FIB_G.x * a + FIB_F.x * b,
  FIB_O.y + FIB_G.y * a + FIB_F.y * b,
  FIB_O.z + FIB_G.z * a + FIB_F.z * b + fibDrape(a, b) + z);

function fibThreadPts(idx) {
  const a = (idx - FIB_HALF) * FIB_PITCH, pts = [];
  for (let k = 0; k <= 132; k++) {
    const b = (k / 132 - .5) * FIB_SIZE;
    pts.push(fibPoint(a, b, FIB_AMP * Math.cos(fibPhase(a, b))));
  }
  return pts;
}

// ── sợi vải: hai sợi lớn tạo thành chữ V ở tiền cảnh ─────────────────
// hai sợi lớn chạy chéo nhau, gặp nhau ở đỉnh V ngay trước ống kính
const V_LEFT = new THREE.CatmullRomCurve3(fibThreadPts(FIB_HALF - 1));
const V_RIGHT = new THREE.CatmullRomCurve3(fibThreadPts(FIB_HALF));
// dải mỏng bám sát mép một sợi, có viền sáng
function edgeFilm(curve, n, width, zOff, inward, zFn = null) {
  const pos = [], uv = [], idx = [];
  const p = new THREE.Vector3(), tg = new THREE.Vector3();
  const rimPts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    curve.getPointAt(u, p); curve.getTangentAt(u, tg);
    const inw = inward(p, tg);
    const z0 = zFn ? zFn(p, u) : p.z + zOff;
    // ba cột: mép sợi · giữa khe (mặt nước lõm nhẹ) · mép khe bên kia
    for (const [s, dz] of [[0, 0], [.5, -.0014], [1, 0]]) {
      const d = width * s;
      pos.push(p.x + inw.x * d, p.y + inw.y * d, z0 + dz);
      uv.push(u, s);
    }
    rimPts.push(new THREE.Vector3(p.x + inw.x * width, p.y + inw.y * width, z0 + .0016));
    if (i < n) {
      const a = i * 3;
      idx.push(a, a + 1, a + 3, a + 1, a + 4, a + 3, a + 1, a + 2, a + 4, a + 2, a + 5, a + 4);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return { geo: g, rim: new THREE.CatmullRomCurve3(rimPts) };
}

export function wovenFibres() {
  const g = new THREE.Group();
  // ── khung vải: F = hướng sợi dọc, G = hướng ngang, O = góc neo ──
  const F = FIB_F, G = FIB_G, O = FIB_O;
  const PITCH = .026, RAD = .0134, AMP = RAD * .62;   // sợi tròn; ở điểm giao hai sợi ép vào nhau
  const A_R = 0, A_L = -.052;                       // hai sợi lớn; khe nước nằm giữa chúng
  const CH_A = (A_R + A_L) / 2, CH_W = Math.abs(A_R - A_L) - 2 * RAD;
  const B0 = -.030, B1 = .100, DIP = .014;          // mép vải theo F, độ sâu của khe nước
  const P = (a, b, z) => new THREE.Vector3(
    O.x + G.x * a + F.x * b,
    O.y + G.y * a + F.y * b,
    O.z + G.z * a + F.z * b + fibDrape(a, b) + z);
  const baseZ = (a, b) => O.z + G.z * a + F.z * b + fibDrape(a, b);
  const bOf = (p) => (p.x - O.x) * F.x + (p.y - O.y) * F.y + (p.z - O.z) * F.z;

  // ── khung ổn định dọc sợi (điểm trên đường tâm + pháp tuyến) ──
  const framesOf = (curve, steps, t0 = 0, t1 = 1) => {
    const fr = [];
    const p = new THREE.Vector3(), t = new THREE.Vector3();
    let n = null, len = 0, prev = null;
    for (let i = 0; i <= steps; i++) {
      const s = t0 + (t1 - t0) * (i / steps);
      curve.getPointAt(s, p); curve.getTangentAt(s, t);
      if (!n) {
        n = new THREE.Vector3(0, 0, 1).cross(t);
        if (n.lengthSq() < 1e-8) n = new THREE.Vector3(1, 0, 0).cross(t);
        n.normalize();
      } else {
        n = n.clone().addScaledVector(t, -n.dot(t));
        if (n.lengthSq() < 1e-8) n = new THREE.Vector3(0, 0, 1).cross(t);
        n.normalize();
      }
      const b = new THREE.Vector3().crossVectors(t, n).normalize();
      if (prev) len += p.distanceTo(prev);
      prev = p.clone();
      fr.push({ p: p.clone(), n: n.clone(), b, l: len });
    }
    return fr;
  };
  // ── ống tròn, hai đầu bo tròn kín (không lộ ruột rỗng, không như nan tre) ──
  const tubeGeo = (fr, r, opt = {}) => {
    const { radial = 12, tip = .035, flat = 1 } = opt;
    const steps = fr.length - 1;
    const surf = (i, j) => {
      const f = fr[i], th = (j / radial) * Math.PI * 2;
      const s = i / steps;
      const e = Math.min(s, 1 - s) / tip;
      const cap = e >= 1 ? 1 : Math.sqrt(Math.max(0, 1 - (1 - e) * (1 - e)));
      // sợi mềm: gợn nhẹ, không gợn đều như cuộn giấy
      const rad = r * cap * (1 + .03 * Math.sin(f.l * 11 + 1.3) + .015 * Math.sin(f.l * 26));
      const cx = Math.cos(th), sy = Math.sin(th);
      // sợi dệt là DẢI MỎNG nằm ngang (b dọc trục sợi), không phải ống tròn: ống tròn đọc ra là lọ thuỷ tinh
      return new THREE.Vector3(
        f.p.x + (f.n.x * cx + f.b.x * sy * flat) * rad,
        f.p.y + (f.n.y * cx + f.b.y * sy * flat) * rad,
        f.p.z + (f.n.z * cx + f.b.z * sy * flat) * rad);
    };
    const pos = [], uvs = [], idx = [];
    for (let i = 0; i <= steps; i++) for (let j = 0; j <= radial; j++) {
      const v = surf(i, j % radial);
      pos.push(v.x, v.y, v.z);
      uvs.push(i / steps * (fr[steps].l || 1) * 55, j / radial);
    }
    for (let i = 0; i < steps; i++) for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = a + radial + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  };
  // ── xơ mềm: vài sợi con mảnh lệch ra từ sợi chính ──
  // xơ tách làm hai bộ: xơ trên HAI sợi lớn (luôn thấy) và xơ trên các sợi nền
  // (ẩn đi ở cận cảnh khe nước, để khung chỉ còn hai sợi và khoảng nước giữa chúng)
  const fuzzPos = [], fuzzIdx = [];
  const fuzzPosH = [], fuzzIdxH = [];
  const addFuzz = (base, dir, len, w0, P0 = fuzzPos, I0 = fuzzIdx) => {
    const s0 = P0.length / 3, st = 4;
    const side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 0, 1));
    if (side.lengthSq() < 1e-8) side.set(1, 0, 0);
    side.normalize();
    for (let k = 0; k <= st; k++) {
      const t = k / st;
      const c = base.clone().addScaledVector(dir, len * t).addScaledVector(side, Math.sin(t * 2.4) * len * .22);
      const sw = w0 * (1 - t * .7);
      P0.push(c.x - side.x * sw, c.y - side.y * sw, c.z - side.z * sw,
        c.x + side.x * sw, c.y + side.y * sw, c.z + side.z * sw);
    }
    for (let k = 0; k < st; k++) { const a = s0 + k * 2; I0.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  };
  const fuzzMesh = (mat, P0 = fuzzPos, I0 = fuzzIdx) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(P0, 3));
    geo.setIndex(I0); geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = false; m.receiveShadow = false;
    return m;
  };

  // ── màu sợi: bông/linen sáng, không vàng nâu ──
  // bảng chuyển sáng dịu 4 bậc: sợi mềm, không sắc cứng như ống kim loại
  const gradSoft = (() => {
    const d = new Uint8Array([148, 140, 126, 255, 190, 180, 162, 255, 224, 216, 200, 255, 252, 249, 240, 255]);
    const t = new THREE.DataTexture(d, 4, 1, THREE.RGBAFormat);
    t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
    return t;
  })();
  // vân vải: CHỈ xơ dọc thân sợi — không vân gạch chéo kiểu giấy cuộn,
  // không vòng đồng tâm ở đầu sợi (hai thứ đó làm sợi đọc ra là ống trụ rỗng)
  const fibreTex = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
    const r = mulberry(77);
    // mờ mảng màu: sợi bông không trắng tuyệt đối
    for (let i = 0; i < 70; i++) {
      const x = r() * w, y = r() * h, rr = 10 + r() * 30;
      const gr = c.createRadialGradient(x, y, 0, x, y, rr);
      gr.addColorStop(0, `rgba(192,178,152,${.05 + r() * .07})`);
      gr.addColorStop(1, 'rgba(192,178,152,0)');
      c.fillStyle = gr; c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill();
    }
    // xơ mềm nằm dọc thân sợi (u = dọc sợi, v = quanh sợi)
    for (let i = 0; i < 1500; i++) {
      const y = r() * h, x = r() * w, L = 5 + r() * 26;
      c.strokeStyle = r() > .40 ? `rgba(255,255,255,${.35 + r() * .45})` : `rgba(168,156,132,${.05 + r() * .10})`;
      c.lineWidth = .5 + r() * 1.1;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + L, y + (r() - .5) * 3.2); c.stroke();
    }
  });
  const matWarp = toon('#ece0c6', { map: fibreTex, grad: gradSoft });
  const matWeft = toon('#dccfb0', { map: fibreTex, grad: gradSoft });
  const matHero = toon('#f2e7d2', { map: fibreTex, grad: gradSoft });
  const matFuzz = toon('#f4ecdd', { side: THREE.DoubleSide, grad: gradSoft });

  // ── nếp dệt: sợi dọc luồn qua sợi ngang, thay phiên trên dưới, vuông vắn ──
  const warpZ = (k, b) => AMP * Math.cos(Math.PI * (k + (b - B0) / PITCH));
  const dipW = a => Math.exp(-Math.pow((a - CH_A) / .021, 2));
  const weftZ = (j, a) => -AMP * Math.cos(Math.PI * (j + (a - A_R) / PITCH)) * (1 - .82 * dipW(a)) - DIP * dipW(a);
  const curveFrom = (fn, from, to, n) => {
    const pts = [];
    for (let i = 0; i <= n; i++) { const u = from + (to - from) * (i / n); pts.push(fn(u)); }
    return new THREE.CatmullRomCurve3(pts);
  };

  const warps = [                       // k = số thứ tự trong lưới (ô trống ở k = -1 là khe nước)
    { k: -3, a: -.078 }, { k: -2, a: A_L, hero: true }, { k: 0, a: A_R, hero: true },
    { k: 1, a: .026 },
  ];
  const wefts = [];
  for (let j = 0; j < 6; j++) wefts.push({ j, b: B0 + j * PITCH });

  const heroR = { cur: null }, heroL = { cur: null };
  for (const w of warps) {
    const c = curveFrom(b => P(w.a, b, warpZ(w.k, b)), B0 - PITCH, B1 + PITCH, 150);
    w.c = c;
    const rr = w.hero ? RAD : RAD * .90;
    const m = new THREE.Mesh(tubeGeo(framesOf(c, 150), rr, { radial: 12, flat: .70 }), w.hero ? matHero : matWarp);
    m.castShadow = true; m.receiveShadow = true;
    m.userData.role = w.hero ? 'hero' : 'aux';      // hai sợi lớn tách riêng khỏi lưới nền
    g.add(m);
    if (w.k === 0) heroR.cur = c;
    if (w.k === -2) heroL.cur = c;
  }
  for (const w of wefts) {
    const c = curveFrom(a => P(a, w.b, weftZ(w.j, a)), -.096, .096, 130);
    w.c = c;
    const rr = RAD * .84;
    const m = new THREE.Mesh(tubeGeo(framesOf(c, 130), rr, { radial: 12, flat: .70 }), matWeft);
    m.castShadow = true; m.receiveShadow = true;
    m.userData.role = 'aux';
    g.add(m);
  }

  // ── xơ mềm lệch ra từ hai sợi lớn ──
  {
    const r2 = mulberry(41);
    for (const c of [heroR.cur, heroL.cur]) {
      for (let i = 0; i < 44; i++) {
        const u = .02 + r2() * .96;
        const p = c.getPointAt(u), tg = c.getTangentAt(u);
        const a = r2() * Math.PI * 2;
        const out = new THREE.Vector3(Math.cos(a), Math.sin(a), (r2() - .5) * .5).normalize();
        const dir = out.multiplyScalar(.85).add(tg.clone().multiplyScalar(.35)).normalize();
        addFuzz(p.clone().addScaledVector(dir, RAD * .92), dir, .0034 + r2() * .0058, .00030, fuzzPosH, fuzzIdxH);
      }
    }
    // xơ mềm trên tất cả các sợi: sợi thô, mềm, không phải nan trơn
    for (const c of [...warps.map(w => w.c), ...wefts.map(w => w.c)]) {
      for (let i = 0; i < 30; i++) {
        const u = .02 + r2() * .96;
        const p = c.getPointAt(u), tg = c.getTangentAt(u);
        const a = r2() * Math.PI * 2;
        const out = new THREE.Vector3(Math.cos(a), Math.sin(a), (r2() - .5) * .5).normalize();
        const dir = out.multiplyScalar(.94).add(tg.clone().multiplyScalar(.22)).normalize();
        addFuzz(p.clone().addScaledVector(dir, RAD * .90), dir, .0028 + r2() * .0044, .00026);
      }
    }
    // vài sợi con lệch ở mép vải
    for (let i = 0; i < 24; i++) {
      const w = wefts[(r2() * wefts.length) | 0];
      const a = r2() > .5 ? .090 + r2() * .006 : -.090 - r2() * .006;
      const p = P(a, w.b, weftZ(w.j, a));
      const dir = new THREE.Vector3((r2() - .5) * .6, r2() > .5 ? 1 : -1, (r2() - .5) * .6).normalize();
      addFuzz(p, dir, .0028 + r2() * .0040, .00024);
    }
    const fmH = fuzzMesh(matFuzz, fuzzPosH, fuzzIdxH);
    fmH.userData.role = 'hero';
    g.add(fmH);
    const fmA = fuzzMesh(matFuzz);
    fmA.userData.role = 'aux';
    g.add(fmA);
  }

  // ── nước nằm trong khe giữa hai sợi: màng mỏng, mép cong, viền sáng ──
  const filmG = new THREE.Group(); filmG.name = 'nuoc-o-ke';
  const filmTex = canvasTex(64, 64, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, w, 0);
    gr.addColorStop(0, 'rgba(198,242,252,.70)');
    gr.addColorStop(.45, 'rgba(226,250,255,.34)');
    gr.addColorStop(1, 'rgba(198,242,252,0)');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
  });
  const filmMat = new THREE.MeshBasicMaterial({
    map: filmTex, color: new THREE.Color('#dcf7ff'), transparent: true, opacity: .72, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
  });
  const inwG = (p, tg) => new THREE.Vector3(-tg.y, tg.x, 0).normalize();
  const inwR = (p, tg) => inwG(p, tg).negate();
  const inwL = (p, tg) => inwG(p, tg);
  // mặt nước trong khe: CAO, ngay dưới đỉnh hai sợi — nước mao quản bám hai mép
  // và nối thành một dải ướt, đọc được từ máy nhìn chếch xuống
  const zFlatR = (p) => baseZ(A_R, bOf(p)) - DIP * .30;
  const zFlatL = (p) => baseZ(A_L, bOf(p)) - DIP * .30;
  const fl = edgeFilm(heroR.cur, 44, CH_W / 2, .0026, inwR, p => zFlatR(p));
  const fr = edgeFilm(heroL.cur, 44, CH_W / 2, .0026, inwL, p => zFlatL(p));
  const film = new THREE.Mesh(fl.geo, filmMat);
  film.castShadow = false; film.receiveShadow = false; fxLayer(film); filmG.add(film);
  const film2 = new THREE.Mesh(fr.geo, filmMat);
  film2.castShadow = false; film2.receiveShadow = false; fxLayer(film2); filmG.add(film2);
  // ── cầu nước: dải nước nối liền hai mép sợi, meniscus lõm nhẹ ở giữa ──
  const bridgeTex = canvasTex(64, 64, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, w, 0);
    gr.addColorStop(0, 'rgba(214,246,255,.92)');
    gr.addColorStop(.18, 'rgba(198,240,252,.52)');
    gr.addColorStop(.5, 'rgba(232,252,255,.30)');
    gr.addColorStop(.82, 'rgba(198,240,252,.52)');
    gr.addColorStop(1, 'rgba(214,246,255,.92)');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
  });
  const bridgeMat = new THREE.MeshBasicMaterial({
    map: bridgeTex, color: new THREE.Color('#e8faff'), transparent: true, opacity: .80, depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
  });
  {
    const N = 60, pos = [], uv = [], idx = [];
    for (let i = 0; i <= N; i++) {
      const b = B0 + (B1 - B0) * (i / N);
      for (const [a, dz] of [[A_R + .0100, -DIP * .30 + .0014], [CH_A, -DIP * .30 - .0024], [A_L - .0100, -DIP * .30 + .0014]]) {
        const q = P(a, b, 0);
        pos.push(q.x, q.y, baseZ(a, b) + dz);
        uv.push(i / N * 6, a === CH_A ? .5 : (a === A_R ? 0 : 1));
      }
    }
    for (let i = 0; i < N; i++) for (let j = 0; j < 2; j++) {
      const a = i * 3 + j, b = a + 3;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx); geo.computeVertexNormals();
    const bridge = new THREE.Mesh(geo, bridgeMat);
    bridge.castShadow = false; bridge.receiveShadow = false; fxLayer(bridge); filmG.add(bridge);
  }
  const rimMat = glowMat('#a8e6f7', .95);
  for (const c of [fl.rim, fr.rim]) {
    const rim = new THREE.Mesh(new THREE.TubeGeometry(c, 44, .00055, 5, false), rimMat);
    rim.castShadow = false; filmG.add(rim);
  }
  // giọt nước đọng trong khe, treo thẳng xuống (trọng lực)
  const dropBase = P(CH_A, .048, -DIP * .30);
  const hangDrop = new THREE.Mesh(new THREE.LatheGeometry(dropProfile(.0034), 18), toon('#a6e4f4', { transparent: true, opacity: .80 }));
  hangDrop.position.copy(dropBase);
  hangDrop.position.y -= .0062;                   // treo xuống dưới mặt nước
  hangDrop.castShadow = false; filmG.add(hangDrop);
  const hangHi = mesh(new THREE.SphereGeometry(.0007, 10, 8), glowMat('#ffffff', .85),
    [hangDrop.position.x - .0011, hangDrop.position.y - .0016, hangDrop.position.z + .0026], { cast: false, recv: false });
  filmG.add(hangHi);
  // giọt nhỏ nằm trên mép sợi
  const beads = [];
  const bp = new THREE.Vector3(), bt = new THREE.Vector3();
  for (const u of [.10, .22, .34]) {
    heroR.cur.getPointAt(u, bp); heroR.cur.getTangentAt(u, bt);
    const inw = inwR(bp, bt).multiplyScalar(RAD * .9);
    const b = mesh(new THREE.SphereGeometry(.0020, 12, 9), toon('#d8f6ff', { transparent: true, opacity: .62 }),
      [bp.x + inw.x, bp.y + inw.y, bp.z + .0030], { cast: false });
    b.scale.set(1, .70, .60); filmG.add(b); beads.push(b);
  }

  // ── vệt nước bám trong xơ ở rìa sợi: vật riêng ──
  const fuzzG = new THREE.Group(); fuzzG.name = 'vet-trong-xo';
  const anchor = new THREE.Vector3(.040, .078, .010);
  let bu = 0, bd = 1e9;
  for (let i = 0; i <= 80; i++) {
    const u = i / 80, q = heroR.cur.getPointAt(u);
    const d = q.distanceTo(anchor);
    if (d < bd) { bd = d; bu = u; }
  }
  const q = heroR.cur.getPointAt(bu), tg = heroR.cur.getTangentAt(bu);
  const ang = Math.atan2(tg.y, tg.x);
  const inw = inwR(q, tg).multiplyScalar(RAD * 1.04);   // vệt nằm TRÊN mặt sợi, không chuim vào trong
  const off = q.clone().add(inw).sub(anchor);
  // vệt nước: một VỆT dài, mềm, chạy dọc theo sợi — không phải một quầng tròn
  const streakTex = canvasTex(64, 256, (c, w, h) => {
    c.save();
    c.translate(w / 2, h / 2);
    c.scale(.30, 1);                                   // vệt dẹp theo chiều ngang, dài theo sợi
    const g2 = c.createRadialGradient(0, 0, 0, 0, 0, h / 2);
    g2.addColorStop(0, 'rgba(255,255,255,.95)');
    g2.addColorStop(.38, 'rgba(255,255,255,.42)');
    g2.addColorStop(.75, 'rgba(255,255,255,.12)');
    g2.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g2;
    c.fillRect(-h / 2, -h / 2, h, h);
    c.restore();
  });
  const streak = mesh(new THREE.PlaneGeometry(.0250, .0700), new THREE.MeshBasicMaterial({
    color: new THREE.Color('#2f6cb4'), map: streakTex, transparent: true, opacity: .88, depthWrite: false,
  }), [off.x, off.y, off.z + .0035], { cast: false, recv: false });
  streak.rotation.z = ang; fxLayer(streak); fuzzG.add(streak);
  const wet2 = mesh(new THREE.PlaneGeometry(.0060, .0230), new THREE.MeshBasicMaterial({
    color: new THREE.Color('#cdeeff'), map: streakTex, transparent: true, opacity: .55, depthWrite: false,
  }), [off.x, off.y, off.z + .0050], { cast: false, recv: false });
  wet2.rotation.z = ang; fxLayer(wet2); fuzzG.add(wet2);
  // cụm xơ thật sự quanh vệt: vài sợi lông tỏa ra, để vệt nước nằm TRONG xơ
  // chứ không phải một vệt thẳng trên một mặt phẳng trơn
  for (let i = 0; i < 6; i++) {
    const a = ang + (i - 2.5) * .26 + Math.sin(i * 2.3) * .08;
    const len = .010 + (i % 3) * .005;
    const fz = mesh(new THREE.PlaneGeometry(.0011, len), new THREE.MeshBasicMaterial({
      color: new THREE.Color('#eaf1ff'), transparent: true, opacity: .20, depthWrite: false,
    }), [off.x + Math.cos(a) * len * .55, off.y + Math.sin(a) * len * .55, off.z + .0026], { rot: [0, 0, a - Math.PI / 2], cast: false, recv: false });
    fxLayer(fz); fuzzG.add(fz);
  }
  return { group: g, filmG, fuzzG, film, beads, streak };
}
// hình giọt: tròn ở dưới, thắt lên trên, có mặt meniscus lõm ở đỉnh
function dropProfile(R) {
  const p = [];
  // hình giọt: rộng 2R, cao 1.66R — cao hơn rộng, thắt dần về cổ ở trên
  const pts = [[0, 0], [.40, .06], [.70, .21], [.90, .42], [1, .62], [1, .83], [.95, 1.04],
               [.84, 1.24], [.68, 1.43], [.52, 1.61], [.38, 1.77], [.27, 1.90], [.18, 2.02], [.12, 2.11], [0, 2.16]];
  for (const [x, y] of pts) p.push(new THREE.Vector2(x * R, y * R));
  return p;
}

// ── tấm vải đan: sợi dọc (warp) luồn qua sợi ngang (weft), thay phiên trên dưới ──
export function wovenCloth({ n = 44, size = .34, r = null } = {}) {
  const g = new THREE.Group();
  const N = Math.max(12, Math.min(n | 0, 48));          // số sợi mỗi chiều
  const PITCH = size / N;
  // sợi tròn mềm, ép sát nhau: không hở mắt, bề mặt là vải chứ không phải lưới
  const rWarp = r ?? PITCH * .52, rWeft = r ?? PITCH * .46;
  const A = (rWarp + rWeft) / 2;                        // sợi dọc nổi lên trên sợi ngang tại điểm giao
  const half = (N - 1) / 2;
  const a0 = -half * PITCH, b0 = -half * PITCH;

  // ── khung ổn định dọc sợi ──
  const framesOf = (curve, steps) => {
    const fr = [];
    const p = new THREE.Vector3(), t = new THREE.Vector3();
    let n = null, len = 0, prev = null;
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      curve.getPointAt(s, p); curve.getTangentAt(s, t);
      if (!n) {
        n = new THREE.Vector3(0, 0, 1).cross(t);
        if (n.lengthSq() < 1e-8) n = new THREE.Vector3(1, 0, 0).cross(t);
        n.normalize();
      } else {
        n = n.clone().addScaledVector(t, -n.dot(t));
        if (n.lengthSq() < 1e-8) n = new THREE.Vector3(0, 0, 1).cross(t);
        n.normalize();
      }
      const b = new THREE.Vector3().crossVectors(t, n).normalize();
      if (prev) len += p.distanceTo(prev);
      prev = p.clone();
      fr.push({ p: p.clone(), n: n.clone(), b, l: len });
    }
    return fr;
  };
  // ── ống tròn, hai đầu bo tròn kín ──
  const tubeGeo = (fr, r, opt = {}) => {
    const { radial = 10, tip = .04 } = opt;
    const steps = fr.length - 1;
    const surf = (i, j) => {
      const f = fr[i], th = (j / radial) * Math.PI * 2;
      const s = i / steps;
      const e = Math.min(s, 1 - s) / tip;
      const cap = e >= 1 ? 1 : Math.sqrt(Math.max(0, 1 - (1 - e) * (1 - e)));
      // sợi mềm: gợn nhẹ, không gợn đều như cuộn giấy
      const rad = r * cap * (1 + .03 * Math.sin(f.l * 11 + 1.3) + .015 * Math.sin(f.l * 26));
      const cx = Math.cos(th), sy = Math.sin(th);
      return new THREE.Vector3(
        f.p.x + (f.n.x * cx + f.b.x * sy) * rad,
        f.p.y + (f.n.y * cx + f.b.y * sy) * rad,
        f.p.z + (f.n.z * cx + f.b.z * sy) * rad);
    };
    const pos = [], uvs = [], idx = [];
    for (let i = 0; i <= steps; i++) for (let j = 0; j <= radial; j++) {
      const v = surf(i, j % radial);
      pos.push(v.x, v.y, v.z);
      uvs.push(i / steps * (fr[steps].l || 1) * 60, j / radial);
    }
    for (let i = 0; i < steps; i++) for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = a + radial + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  };
  // ── xơ mềm ở mép vải ──
  const fuzzPos = [], fuzzIdx = [];
  const addFuzz = (base, dir, len, w0) => {
    const s0 = fuzzPos.length / 3, st = 4;
    const side = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 0, 1));
    if (side.lengthSq() < 1e-8) side.set(1, 0, 0);
    side.normalize();
    for (let k = 0; k <= st; k++) {
      const t = k / st;
      const c = base.clone().addScaledVector(dir, len * t).addScaledVector(side, Math.sin(t * 2.4) * len * .22);
      const sw = w0 * (1 - t * .7);
      fuzzPos.push(c.x - side.x * sw, c.y - side.y * sw, c.z - side.z * sw,
        c.x + side.x * sw, c.y + side.y * sw, c.z + side.z * sw);
    }
    for (let k = 0; k < st; k++) { const a = s0 + k * 2; fuzzIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  };

  // ── màu sợi: bông/linen sáng ──
  // bảng chuyển sáng dịu 4 bậc: vải mềm, không sắc như kim loại
  const gradSoft = (() => {
    const d = new Uint8Array([148, 140, 126, 255, 190, 180, 162, 255, 224, 216, 200, 255, 252, 249, 240, 255]);
    const t = new THREE.DataTexture(d, 4, 1, THREE.RGBAFormat);
    t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
    return t;
  })();
  // vân vải: chỉ xơ dọc thân sợi — bỏ hẳn vân gạch chéo (nó làm vải đọc ra như lưới thép)
  const tex = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
    const r = mulberry(91);
    // mờ mảng màu: sợi bông không trắng tuyệt đối
    for (let i = 0; i < 70; i++) {
      const x = r() * w, y = r() * h, rr = 10 + r() * 30;
      const gr = c.createRadialGradient(x, y, 0, x, y, rr);
      gr.addColorStop(0, `rgba(190,178,154,${.05 + r() * .07})`);
      gr.addColorStop(1, 'rgba(190,178,154,0)');
      c.fillStyle = gr; c.beginPath(); c.arc(x, y, rr, 0, 7); c.fill();
    }
    // xơ mềm nằm dọc thân sợi
    for (let i = 0; i < 1500; i++) {
      const y = r() * h, x = r() * w, L = 5 + r() * 26;
      c.strokeStyle = r() > .42 ? `rgba(255,255,255,${.35 + r() * .45})` : `rgba(162,152,130,${.05 + r() * .10})`;
      c.lineWidth = .5 + r() * 1.1;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + L, y + (r() - .5) * 3.2); c.stroke();
    }
  });
  const matWarp = toon('#ece0c6', { map: tex, grad: gradSoft });
  const matWeft = toon('#dcd0b2', { map: tex, grad: gradSoft });

  // ── tấm vải có một nếp gấp: mặt vải không phẳng như tấm bảng ──
  const drape = (a, b) => .022 * Math.tanh((a - size * .13) / (size * .070))
    + .009 * Math.sin(b * 7.4 + 1.1) * Math.cos(a * 5.1)
    + .004 * Math.sin(a * 9.3 + .6) * Math.sin(b * 6.1 + 2.2);
  const P = (a, b, z) => new THREE.Vector3(a, b, drape(a, b) + z);
  const warpZ = (k, b) => A * Math.cos(Math.PI * (k + (b - b0) / PITCH));
  const weftZ = (j, a) => -A * Math.cos(Math.PI * (j + (a - a0) / PITCH));
  const curveFrom = (fn, from, to, n) => {
    const pts = [];
    for (let i = 0; i <= n; i++) { const u = from + (to - from) * (i / n); pts.push(fn(u)); }
    return new THREE.CatmullRomCurve3(pts);
  };

  // sợi dọc (warp): chạy dọc, luồn qua sợi ngang, hai đầu dừng ngay mép vải
  const warpCurves = [], weftCurves = [];
  for (let k = 0; k < N; k++) {
    const a = a0 + k * PITCH;
    const c = curveFrom(b => P(a, b, warpZ(k, b)), b0 - PITCH * .5, -b0 + PITCH * .5, 130);
    warpCurves.push(c);
    const m = new THREE.Mesh(tubeGeo(framesOf(c, 150), rWarp, { radial: 10, flat: .72 }), matWarp);
    m.castShadow = true; m.receiveShadow = true; g.add(m);
  }
  // sợi ngang (weft): luồn ngược pha, nằm dưới sợi dọc ở điểm giao
  for (let j = 0; j < N; j++) {
    const b = b0 + j * PITCH;
    const c = curveFrom(a => P(a, b, weftZ(j, a)), a0 - PITCH * .5, -a0 + PITCH * .5, 130);
    weftCurves.push(c);
    const m = new THREE.Mesh(tubeGeo(framesOf(c, 130), rWeft, { radial: 10, flat: .72 }), matWeft);
    m.castShadow = true; m.receiveShadow = true; g.add(m);
  }

  // ── cạnh dệt (selvedge): mép vải dày hơn một chút, liền mảnh, không mắt vòng nhô ra ──
  {
    const e = size / 2, rSel = PITCH * .70;
    const selMat = toon('#efe6d0', { map: tex, grad: gradSoft });
    const cord = (fn, from, to, n) => {
      const pts = [];
      for (let i = 0; i <= n; i++) { const u = from + (to - from) * (i / n); pts.push(fn(u)); }
      const c = new THREE.CatmullRomCurve3(pts);
      const m = new THREE.Mesh(tubeGeo(framesOf(c, 60), rSel, { radial: 10, tip: .06 }), selMat);
      m.castShadow = true; m.receiveShadow = true; g.add(m);
    };
    const o = PITCH * .5;
    cord(b => P(e, b, 0), -e - o, e + o, 44);
    cord(b => P(-e, b, 0), -e - o, e + o, 44);
    cord(a => P(a, e, 0), -e - o, e + o, 44);
    cord(a => P(a, -e, 0), -e - o, e + o, 44);
  }

  // ── xơ tua: mặt vải mềm, không phải lưới thép mắt xích ──
  {
    const r2 = mulberry(303);
    // xơ nổi lên mặt vải
    for (const c of [...warpCurves, ...weftCurves]) {
      for (let i = 0; i < 3; i++) {
        const u = .05 + r2() * .90;
        const p = c.getPointAt(u), tg = c.getTangentAt(u);
        const a = r2() * Math.PI * 2;
        const out = new THREE.Vector3(Math.cos(a), Math.sin(a), (r2() - .5) * .5).normalize();
        const dir = out.multiplyScalar(.9).add(tg.clone().multiplyScalar(.2)).normalize();
        addFuzz(p.clone().addScaledVector(dir, PITCH * .50), dir, .0014 + r2() * .0024, .00011);
      }
    }
    // xơ ở mép: sợi con lệch ra, đầu sợi tơi
    for (let i = 0; i < 48; i++) {
      const vert = r2() > .5;
      const e = (r2() > .5 ? 1 : -1) * (size / 2 + r2() * .010);
      const u = (r2() - .5) * size;
      const p = vert ? P(e, u, warpZ(Math.round((e - a0) / PITCH), u)) : P(u, e, weftZ(Math.round((e - b0) / PITCH), u));
      const dir = vert
        ? new THREE.Vector3((r2() - .5) * .5, e > 0 ? 1 : -1, (r2() - .5) * .5).normalize()
        : new THREE.Vector3(e > 0 ? 1 : -1, (r2() - .5) * .5, (r2() - .5) * .5).normalize();
      addFuzz(p, dir, .0022 + r2() * .0034, .00014);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(fuzzPos, 3));
    geo.setIndex(fuzzIdx); geo.computeVertexNormals();
    const fm = new THREE.Mesh(geo, toon('#f7f0e2', { side: THREE.DoubleSide, grad: gradSoft }));
    fm.castShadow = false; fm.receiveShadow = false;
    g.add(fm);
  }
  return { group: g };
}

// ── giọt nước đọng trên sợi ────────────────────────────────────────────
export function dropOnThread() {
  const g = new THREE.Group();
  const R = .0009;                                  // bán kính sợi: chỉ bông/len, mảnh như sợi thật
  const LEN = .042;

  // ── khung ổn định dọc sợi ──
  const framesOf = (curve, steps) => {
    const fr = [];
    const p = new THREE.Vector3(), t = new THREE.Vector3();
    let n = null, len = 0, prev = null;
    for (let i = 0; i <= steps; i++) {
      const s = i / steps;
      curve.getPointAt(s, p); curve.getTangentAt(s, t);
      if (!n) {
        n = new THREE.Vector3(0, 0, 1).cross(t);
        if (n.lengthSq() < 1e-8) n = new THREE.Vector3(1, 0, 0).cross(t);
        n.normalize();
      } else {
        n = n.clone().addScaledVector(t, -n.dot(t));
        if (n.lengthSq() < 1e-8) n = new THREE.Vector3(0, 0, 1).cross(t);
        n.normalize();
      }
      const b = new THREE.Vector3().crossVectors(t, n).normalize();
      if (prev) len += p.distanceTo(prev);
      prev = p.clone();
      fr.push({ p: p.clone(), n: n.clone(), b, l: len });
    }
    return fr;
  };
  // ── ống tròn, hai đầu bo tròn (không nhọn như gai) ──
  const tubeGeo = (fr, r, opt = {}) => {
    const { radial = 12, tip = .05, flat = 1 } = opt;
    const steps = fr.length - 1;
    const surf = (i, j) => {
      const f = fr[i], th = (j / radial) * Math.PI * 2;
      const s = i / steps;
      const e = Math.min(s, 1 - s) / tip;
      const cap = e >= 1 ? 1 : Math.sqrt(Math.max(0, 1 - (1 - e) * (1 - e)));
      const rad = r * cap;
      const cx = Math.cos(th), sy = Math.sin(th);
      // sợi là một DẢI MỎNG nằm ngang, không phải que tròn: que tròn đọc ra là que đo có vạch số
      return new THREE.Vector3(
        f.p.x + (f.n.x * cx + f.b.x * sy * flat) * rad,
        f.p.y + (f.n.y * cx + f.b.y * sy * flat) * rad,
        f.p.z + (f.n.z * cx + f.b.z * sy * flat) * rad);
    };
    const pos = [], uvs = [], idx = [];
    for (let i = 0; i <= steps; i++) for (let j = 0; j <= radial; j++) {
      const v = surf(i, j % radial);
      pos.push(v.x, v.y, v.z);
      uvs.push(i / steps * (fr[steps].l || 1) * 90, j / radial);
    }
    for (let i = 0; i < steps; i++) for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = a + radial + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  };
  // ── sợi thật: một sợi tròn mảnh (chỉ bông/len), võng tự nhiên ──
  // bảng chuyển sáng dịu 4 bậc: sợi mềm, không sắc
  const gradSoft = (() => {
    const d = new Uint8Array([148, 140, 126, 255, 190, 180, 162, 255, 224, 216, 200, 255, 252, 249, 240, 255]);
    const t = new THREE.DataTexture(d, 4, 1, THREE.RGBAFormat);
    t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
    return t;
  })();
  // đường sợi: đoạn dưới giọt bị ướt nên trĩu xuống
  const pts = [];
  for (let k = 0; k <= 30; k++) {
    const t = k / 30;
    const wetT = Math.max(0, (t - .46) / .54);
    pts.push(new THREE.Vector3(
      (t - .5) * LEN,
      (t - .5) * .022 - .0035 * Math.sin(t * Math.PI) - .0070 * Math.pow(wetT, 1.7),
      Math.sin(t * Math.PI * 1.1) * .0032));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  const threadTex = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
    const r = mulberry(57);
    for (let i = 0; i < 1100; i++) {                      // xơ mịn trên thân sợi
      const y = r() * h, x = r() * w, L = 3 + r() * 14;
      c.strokeStyle = r() > .45 ? `rgba(255,255,255,${.45 + r() * .45})` : `rgba(150,140,120,${.05 + r() * .10})`;
      c.lineWidth = .5 + r() * .9;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + L, y + (r() - .5) * 2); c.stroke();
    }
  });
  const threadMat = toon('#f2e6cc', { map: threadTex, grad: gradSoft });
  const threadWetMat = toon('#c9b892', { map: threadTex, grad: gradSoft });   // đoạn dưới giọt bị ướt: tối hơn
  // hai nửa sợi: nửa trên khô, nửa dưới ướt
  // hai nửa sợi lấy từ CÙNG một đường cong (cùng tham số hoá) — cắt riêng hai đường cong làm sợi
  // gãy khúc ở chỗ tiếp nối, và sợi gãy đọc ra là que đo
  const dry = new THREE.Mesh(tubeGeo(framesOf(curve, 90, 0, .48), R, { radial: 10, tip: .03, flat: .52 }), threadMat);
  dry.castShadow = true; dry.receiveShadow = true; g.add(dry);
  const wet = new THREE.Mesh(tubeGeo(framesOf(curve, 90, .48, 1), R, { radial: 10, tip: .03, flat: .52 }), threadWetMat);
  wet.castShadow = true; wet.receiveShadow = true; g.add(wet);

  // vài sợi xơ mềm lệch ra từ sợi chính
  {
    const r2 = mulberry(71);
    const fPos = [], fIdx = [];
    for (let i = 0; i < 22; i++) {
      const t = .06 + r2() * .88, p = curve.getPointAt(t), tg = curve.getTangentAt(t);
      const a = r2() * Math.PI * 2;
      const out = new THREE.Vector3(Math.cos(a), Math.sin(a), (r2() - .5) * .5).normalize()
        .multiplyScalar(.7).add(tg.clone().multiplyScalar(.6)).normalize();
      const base = p.clone().addScaledVector(out, R * .95);
      const side = new THREE.Vector3().crossVectors(out, new THREE.Vector3(0, 0, 1));
      if (side.lengthSq() < 1e-8) side.set(1, 0, 0);
      side.normalize();
      const s0 = fPos.length / 3, st = 3, len = .0004 + r2() * .0007, w0 = .000045;
      for (let k = 0; k <= st; k++) {
        const u = k / st;
        const c = base.clone().addScaledVector(out, len * u);
        const sw = w0 * (1 - u * .7);
        fPos.push(c.x - side.x * sw, c.y - side.y * sw, c.z - side.z * sw,
          c.x + side.x * sw, c.y + side.y * sw, c.z + side.z * sw);
      }
      for (let k = 0; k < st; k++) { const a2 = s0 + k * 2; fIdx.push(a2, a2 + 1, a2 + 2, a2 + 1, a2 + 3, a2 + 2); }
    }
    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.Float32BufferAttribute(fPos, 3));
    fg.setIndex(fIdx); fg.computeVertexNormals();
    const fm = new THREE.Mesh(fg, toon('#eee3ca', { side: THREE.DoubleSide, grad: gradSoft }));
    fm.castShadow = false; g.add(fm);
  }

  // ── giọt nước nằm ĐÈ LÊN sợi: bầu dạt giọt, sợi nhìn xuyên qua được ──
  const mid = curve.getPointAt(.5);
  const up = new THREE.Vector3(0, 1, 0);
  const dg = new THREE.Group();
  const DR = .0042;                                       // bán kính lớn nhất của giọt
  // đáy giọt ăn vào sợi: sợi đi xuyên qua thân giọt, không treo lủng lẳng bên dưới
  dg.position.copy(mid.clone().addScaledVector(up, DR * .30));
  // hình giọt dạt: bụng tròn, đáy bẹp, đỉnh nhọn nhẹ
  const prof = [[0, 0], [.52, .03], [.84, .16], [.97, .40], [1, .66], [.95, .92],
  [.80, 1.14], [.56, 1.32], [.28, 1.44], [.10, 1.50], [0, 1.52]];
  const lathe = [];
  for (const [x, y] of prof) lathe.push(new THREE.Vector2(x * DR, y * DR));
  const body = new THREE.Mesh(new THREE.LatheGeometry(lathe, 22),
    toon('#93ddf6', { transparent: true, opacity: .58, depthWrite: false }));
  body.castShadow = false; body.receiveShadow = false;
  body.renderOrder = 2;
  dg.add(body);
  // lõi đậm hơn ở giữa: giọt có thân, vẫn thấy sợi xuyên qua
  const core2 = new THREE.Mesh(new THREE.SphereGeometry(DR * .62, 16, 12),
    toon('#5cc3e6', { transparent: true, opacity: .30, depthWrite: false }));
  core2.position.set(0, DR * .45, 0); core2.scale.set(1, .95, 1);
  core2.renderOrder = 1;
  dg.add(core2);
  // điểm sáng trắng bắt trên mặt giọt
  const spec = new THREE.Mesh(new THREE.SphereGeometry(DR * .30, 12, 9), glowMat('#ffffff', 1.15));
  spec.position.set(-DR * .34, DR * .78, DR * .42); spec.scale.set(1, .8, .55);
  dg.add(spec);
  const spec2 = new THREE.Mesh(new THREE.SphereGeometry(DR * .12, 8, 6), glowMat('#e6f9ff', .9));
  spec2.position.set(DR * .34, DR * .30, DR * .38);
  dg.add(spec2);
  g.add(dg);

  return {
    group: g, drop: body,
    setSize: (k) => {
      const s = lerp(1.15, .55, clamp(k));
      dg.scale.setScalar(s);
    },
  };
}

// ── mặt nước (cận) + phân tử ─────────────────────────────────────────
// Mặt nước là một mặt phẳng có gợn sóng. Phân tử là hạt cát nhỏ nằm sát mặt,
// chỉ một phân tử tách ra bay lên — đọc được bằng mắt.
export function waterSurface({ w = 1.6, d = 1.0 } = {}) {
  const g = new THREE.Group();
  const W = w * 2.0, D = d * 2.0;                 // MỘT mặt nước lớn, trải ngang
  const AMP = [.0125, .0046, .0020];              // ba sóng chạy CÙNG một hướng
  const KS = [11.0, 24.0, 46.0];
  const WS = [1.5, 2.4, 3.6];
  const ASUM = AMP[0] + AMP[1] + AMP[2];
  // bờ cong ở phía -x: đường bờ vòng ra, bờ đất/cát nằm bên ngoài
  const shoreX = (z) => -0.40 * W + 0.14 * W * Math.cos((z / D) * Math.PI);

  // ── texture mặt nước: xanh nước nông, chân trời sương mù, phản chiếu bờ ──
  const wtex = canvasTex(1024, 512, (c, cw, ch) => {
    c.clearRect(0, 0, cw, ch);
    const gr = c.createLinearGradient(0, 0, 0, ch);
    gr.addColorStop(0, '#b6ccd6');       // xa: sương mù, đường chân trời
    gr.addColorStop(.13, '#8fbecf');
    gr.addColorStop(.45, '#68a8c1');
    gr.addColorStop(1, '#4a8fb4');       // gần: sâu hơn
    c.fillStyle = gr; c.fillRect(0, 0, cw, ch);
    // phản chiếu của bờ: dải tối mềm chạy song song đường bờ, ngay ngoài mép cát
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    for (const [wd, al] of [[.075, .08], [.040, .13], [.018, .19]]) {
      c.beginPath();
      for (let i = 0; i <= 90; i++) {
        const z = -D / 2 + (i / 90) * D;
        const px = (shoreX(z) + .012 + W / 2) / W * cw;
        const py = ((D / 2 - z) / D) * ch;
        i ? c.lineTo(px, py) : c.moveTo(px, py);
      }
      c.strokeStyle = `rgba(22,74,102,${al})`;
      c.lineWidth = wd / W * cw * 2;
      c.stroke();
    }
    c.restore();
    // bờ foam: một mép trắng bám theo đường bờ — dấu hiệu rõ nhất của MẶT NƯỚC
    // (không có nó, mặt nước đọc ra là một chùm sợi xanh)
    c.save(); c.lineCap = 'round';
    for (const [wd, al] of [[.020, .55], [.011, .80]]) {
      c.beginPath();
      for (let i = 0; i <= 90; i++) {
        const z = -D / 2 + (i / 90) * D;
        const px = (shoreX(z) + .004 + W / 2) / W * cw;
        const py = ((D / 2 - z) / D) * ch;
        i ? c.lineTo(px, py) : c.moveTo(px, py);
      }
      c.strokeStyle = `rgba(244,252,255,${al})`;
      c.lineWidth = wd / W * cw * 2;
      c.stroke();
    }
    c.restore();
    // gợn sóng: các ĐƯỜNG NGANG song song, xen kẽ vệt sáng và vệt tối, chạy suốt chiều ngang
    const r = mulberry(701);
    const NB = 26;
    for (let i = 0; i < NB; i++) {
      const y = (i + .5) / NB * ch;
      const hgt = ch / NB * (.40 + (i % 3 === 0 ? .14 : 0));
      const light = i % 2 === 0;
      const gg = c.createLinearGradient(0, y - hgt, 0, y + hgt);
      if (light) {
        gg.addColorStop(0, 'rgba(255,255,255,0)');
        gg.addColorStop(.5, 'rgba(255,255,255,.13)');
        gg.addColorStop(1, 'rgba(255,255,255,0)');
      } else {
        gg.addColorStop(0, 'rgba(16,62,92,0)');
        gg.addColorStop(.5, 'rgba(16,62,92,.10)');
        gg.addColorStop(1, 'rgba(16,62,92,0)');
      }
      c.fillStyle = gg; c.fillRect(0, y - hgt, cw, hgt * 2);
      c.strokeStyle = light ? 'rgba(255,255,255,.07)' : 'rgba(10,50,78,.07)';
      c.lineWidth = 1.5 + (i % 3);
      c.beginPath(); c.moveTo(0, y); c.lineTo(cw, y); c.stroke();
    }
    // vài điểm lấp lánh lệch pha trên mặt nước
    for (let i = 0; i < 110; i++) {
      const x = r() * cw, y = r() * ch, rad = 1.4 + r() * 3.2;
      const sg = c.createRadialGradient(x, y, 0, x, y, rad);
      sg.addColorStop(0, `rgba(255,255,255,${.28 + r() * .46})`);
      sg.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = sg; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
    }
    // vài mảng nước đục/sáng lệch, phá đều, để mặt nước không phẳng lì
    for (let i = 0; i < 22; i++) {
      const x = r() * cw, y = r() * ch, rad = cw * (.04 + r() * .12);
      const pg = c.createRadialGradient(x, y, 1, x, y, rad);
      pg.addColorStop(0, r() > .5 ? 'rgba(226,244,250,.16)' : 'rgba(36,96,126,.14)');
      pg.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = pg; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
    }
    // mép xa tan dần: đường chân trời mờ trong sương, không cắt thẳng
    c.globalCompositeOperation = 'destination-out';
    const fade = c.createLinearGradient(0, ch, 0, ch * .80);
    fade.addColorStop(0, 'rgba(0,0,0,1)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = fade; c.fillRect(0, ch * .80, cw, ch * .20);
    const hz = c.createLinearGradient(0, 0, 0, ch * .055);
    hz.addColorStop(0, 'rgba(0,0,0,1)');
    hz.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = hz; c.fillRect(0, 0, cw, ch * .055);
    c.globalCompositeOperation = 'source-over';
  });

  // ── mặt nước: một mặt phẳng duy nhất, gợn chạy cùng hướng ──
  const geo = new THREE.PlaneGeometry(W, D, 156, 92);
  const pos = geo.attributes.position;
  const base = pos.array.slice();
  const col = new Float32Array(pos.count * 3).fill(1);
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const height = (x, y, t) =>
    AMP[0] * Math.sin(KS[0] * y + WS[0] * t + x * .08 + Math.sin(x * 1.25) * .85)
    + AMP[1] * Math.sin(KS[1] * y + WS[1] * t + x * .22 + Math.sin(x * .8 + 1.1) * .55)
    + AMP[2] * Math.sin(KS[2] * y + WS[2] * t + x * .55 + Math.sin(x * 2.1 + 2.3) * .40);
  // alpha map: mép mặt nước mờ dần — KHÔNG có đường cắt thẳng cứng
  const edgeTex = (() => {
    const S = 256, cv = document.createElement('canvas'); cv.width = S; cv.height = S;
    const c = cv.getContext('2d');
    const img = c.createImageData(S, S), d = img.data;
    const hw = .48, hh = .48, rad = .14, soft = .15;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const px = (x + .5) / S - .5, py = (y + .5) / S - .5;
      const qx = Math.abs(px) - (hw - rad), qy = Math.abs(py) - (hh - rad);
      const dist = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - rad;
      const a = clamp(1 - (dist + soft) / soft, 0, 1);
      const i = (y * S + x) * 4;
      d[i] = 0; d[i + 1] = Math.round(a * 255); d[i + 2] = 0; d[i + 3] = 255;
    }
    c.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(cv);
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  })();
  const mat = toon('#ffffff', {
    map: wtex, vertexColors: true, side: THREE.DoubleSide, alphaMap: edgeTex,
    transparent: true, opacity: .96, depthWrite: false,
  });
  const water = new THREE.Mesh(geo, mat);
  water.rotation.x = -Math.PI / 2;
  water.renderOrder = 1;
  fxLayer(water);                                // mặt nước ở lớp fx: không có cạnh cắt thẳng
  water.receiveShadow = true;                    // bóng bờ đổ trên mặt nước
  g.add(water);
  // vài điểm lấp lánh lệch pha: nước đuối, điểm sáng chạy theo gợn sóng
  const glints = [];
  {
    const rg = mulberry(613);
    for (let i = 0; i < 18; i++) {
      const gm = mesh(new THREE.SphereGeometry(.010, 8, 6), glowMat('#ffffff', .85), [0, 0, 0], { cast: false, recv: false });
      gm.scale.set(1, .22, 1);
      gm.renderOrder = 5;
      fxLayer(gm); g.add(gm);
      glints.push({ m: gm, x: (rg() - .5) * W * .82, z: (rg() - .5) * D * .82, ph: rg() * 9, sp: .5 + rg() * 1.4 });
    }
  }
  const wave = (t) => {
    const p = geo.attributes.position, c = geo.attributes.color;
    for (let i = 0; i < p.count; i++) {
      const x = base[i * 3], y = base[i * 3 + 1];
      const h = height(x, y, t);
      p.setZ(i, h + ASUM);                        // mặt nước luôn nổi nhẹ trên sàn
      // đỉnh sóng bắt sáng thành vệt sáng chạy song song
      const hn = clamp(h / ASUM * 1.7);
      const k = Math.pow(clamp((hn - .22) / .78), 1.7);
      c.setXYZ(i, lerp(.78, 1.32, k), lerp(.92, 1.34, k), lerp(.99, 1.31, k));
    }
    p.needsUpdate = true; c.needsUpdate = true;
    geo.computeVertexNormals();
  };
  wave(0);

  // các phân tử cố định ở mép nước (khai báo ngoài khối bờ để set.js đổi màu được)
  const fixedMols = [];

  // ── bờ: dải đất/cát cong, mép nước ướt, sườn bờ lên rồi tụt xuống ──
  {
    const sandTex = canvasTex(512, 512, (c, cw, ch) => {
      c.fillStyle = '#9c8a68'; c.fillRect(0, 0, cw, ch);
      const r = mulberry(733);
      for (let i = 0; i < 26; i++) {
        const x = r() * cw, y = r() * ch, rad = 30 + r() * 150;
        const gg = c.createRadialGradient(x, y, 1, x, y, rad);
        gg.addColorStop(0, r() > .5 ? 'rgba(118,100,72,.14)' : 'rgba(198,184,150,.10)');
        gg.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = gg; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
      }
      for (let i = 0; i < 17000; i++) {
        const v = 92 + ((r() * 74) | 0);
        c.fillStyle = `rgba(${v},${v - 20},${v - 48},${r() * .24})`;
        c.fillRect(r() * cw, r() * ch, 2, 2);
      }
    });
    const sandMat = toon('#ffffff', { map: sandTex, vertexColors: true, side: THREE.DoubleSide });
    const outerX = -W / 2;
    const NZ = 110, NU = 16, BW = .21;               // bờ HẸP: một dải cát ướt, không phải mảng tam giác kem
    const bp = [], bu = [], bi = [], bc = [];
    const YU = [-.075, -.052, -.026, -.004, .014, .034, .052, .066, .076, .082, .086];
    for (let j = 0; j <= NZ; j++) {
      const z = -D / 2 + (j / NZ) * D;
      const sx = shoreX(z);
      for (let i = 0; i <= NU; i++) {
        const u = i / NU;
        let x, y;
        if (u <= .30) {                                   // chân bờ chìm dưới nước
          const f = u / .30;
          x = sx - BW * u;
          y = .012 - u * .020 + Math.pow(u, 3) * .046;
        } else {                                          // sườn bờ lên phía trong
          const f = (u - .30) / .70;
          x = sx - BW * u;
          const fi = f * (YU.length - 1), ii = Math.min(YU.length - 2, Math.floor(fi));
          y = .012 - u * .020 + Math.pow(u, 3) * .046;
        }
        const n = gC_vnoise(x * 2.4 + 11, z * 2.4, 17) - .5;
        const n2 = gC_vnoise(x * 7.1, z * 7.1 + 5, 29) - .5;
        const up = clamp((u - .18) / .45);
        y += n * .012 * up + n2 * .004 * up;
        x += n2 * .010 * up;
        bp.push(x, y, z);
        bu.push(x * 5.5, z * 5.5);
        const wet = clamp(1 - u);
        const k = 1 - .30 * wet + n * .08;
        bc.push(k, k * .97, k * .92);
      }
    }
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NU; i++) {
      const a = j * (NU + 1) + i, b = a + 1, c = a + NU + 1, d = c + 1;
      bi.push(a, b, c, b, d, c);
    }
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.Float32BufferAttribute(bp, 3));
    bg.setAttribute('uv', new THREE.Float32BufferAttribute(bu, 2));
    bg.setAttribute('color', new THREE.Float32BufferAttribute(bc, 3));
    bg.setIndex(bi); bg.computeVertexNormals();
    const bank = new THREE.Mesh(bg, sandMat);
    bank.castShadow = false; bank.receiveShadow = true;   // KHÔNG đổ bóng cứng xuống nền
    g.add(bank);
    // bọt khí nhỏ tụ ở mép: những chấm tròn nhỏ, KHÔNG phải đá tròn to
    const bubMat = toon('#eefaff', { transparent: true, opacity: .70, depthWrite: false });
    for (let i = 0; i < 26; i++) {
      const rb = mulberry(97);
      const dz = (rb() - .5) * D * .92;
      const br = .006 + rb() * .011;
      const b = mesh(new THREE.SphereGeometry(br, 8, 6), bubMat, [shoreX(dz) + .02 + rb() * .10, ASUM + .002, dz], { cast: false, recv: false });
      b.scale.set(1, .8, 1);
      b.renderOrder = 3;
      fxLayer(b); g.add(b);
    }
    // BA PHÂN TỬ CỐ ĐỊNH ở mép nước: nhát siêu cận phải nhìn thấy đúng vật mà thẻ "1 PHÂN TỬ" chỉ vào.
    // Hình của phân tử nước: một ô xi (đỏ) + hai nguyên tử hiđro (trắng) xếp chữ V.
    // Kích thước CỐ Ý to hơn thật: đây là hình minh hoạ, phân tử phải đọc được
    // trong một khung cận cảnh, không phải một chấm nhỏ trên mảng nước trống.
    const molO = toon('#d9503f', { transparent: true, opacity: .95, depthWrite: false });
    const molH = toon('#f6feff', { transparent: true, opacity: .96, depthWrite: false });
    const waterMol = (mr) => {
      const c = new THREE.Group();
      const o = mesh(new THREE.SphereGeometry(mr, 16, 12), molO, [0, 0, 0], { cast: false, recv: false });
      c.add(o);
      const a = 52.25 * Math.PI / 180, d = mr * 1.42;
      for (const s of [1, -1]) {
        c.add(mesh(new THREE.SphereGeometry(mr * .44, 12, 8), molH,
          [d * Math.cos(a), d * Math.sin(a) * s, 0], { cast: false, recv: false }));
      }
      return c;
    };
    const fixedMolsLocal = [];
    for (const [mx, my, mz, mr] of [[-.985, .042, .020, .0300], [-1.045, .030, -.052, .0198], [-.930, .034, .078, .0172]]) {
      const m = waterMol(mr);
      m.position.set(mx, my, mz);
      m.renderOrder = 3;
      fxLayer(m); g.add(m);
      fixedMolsLocal.push({ m, o: m.children[0] });
    }
    for (const q of fixedMolsLocal) fixedMols.push(q);
    // vệt bọt trắng: dải bọt mỏng chạy song song mép nước, xen kẽ vệt sáng và vệt tối
    {
      const foamTex = canvasTex(512, 128, (c, cw, ch) => {
        c.clearRect(0, 0, cw, ch);
        const r = mulberry(451);
        for (let i = 0; i < 220; i++) {
          const x = r() * cw, y = ch * .5 + (r() - .5) * ch * .75, rad = 3 + r() * 13;
          const fg = c.createRadialGradient(x, y, 0, x, y, rad);
          fg.addColorStop(0, `rgba(255,255,255,${.45 + r() * .45})`);
          fg.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = fg; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
        }
      });
      const foamMat = toon('#ffffff', { map: foamTex, transparent: true, opacity: .82, depthWrite: false, side: THREE.DoubleSide });
      const fp = [], fu = [], fi = [];
      const FN = 120;
      for (let j = 0; j <= FN; j++) {
        const z = -D / 2 + (j / FN) * D;
        const sx = shoreX(z);
        for (let i = 0; i <= 1; i++) {
          fp.push(sx + .045 - i * .085, ASUM + .0035, z);
          fu.push(j / FN, i);
        }
      }
      for (let j = 0; j < FN; j++) {
        const a = j * 2, b = a + 1, c = (j + 1) * 2, d = c + 1;
        fi.push(a, b, c, b, d, c);
      }
      const fg2 = new THREE.BufferGeometry();
      fg2.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3));
      fg2.setAttribute('uv', new THREE.Float32BufferAttribute(fu, 2));
      fg2.setIndex(fi); fg2.computeVertexNormals();
      const foam = new THREE.Mesh(fg2, foamMat);
      foam.renderOrder = 2; foam.castShadow = false; foam.receiveShadow = false;
      fxLayer(foam);
      g.add(foam);
    }
  }

  // ── phân tử nước: hạt nhỏ trong lớp nước, một hạt bứt ra ngoài ──
  // Hình của phân tử: một ô xi (đỏ) + hai nguyên tử hiđro (trắng) xếp chữ V.
  const molO2 = toon('#d9503f', { transparent: true, opacity: .90, depthWrite: false });
  const molH2 = toon('#eefbff', { transparent: true, opacity: .92, depthWrite: false });
  const cluster = (s = 1) => {
    const c = new THREE.Group();
    c.add(mesh(new THREE.SphereGeometry(.019 * s, 10, 8), molO2, [0, 0, 0], { cast: false }));
    c.add(mesh(new THREE.SphereGeometry(.010 * s, 8, 6), molH2, [.016 * s, .011 * s, .005], { cast: false }));
    c.add(mesh(new THREE.SphereGeometry(.010 * s, 8, 6), molH2, [-.014 * s, -.008 * s, .008], { cast: false }));
    return c;
  };
  const molecules = [];
  const r = mulberry(17);
  for (let i = 0; i < 20; i++) {
    const c = cluster(.13);
    c.position.set((r() - .5) * w * .8, ASUM - .010 - r() * .040, (r() - .5) * d * .8);
    fxLayer(c); c.renderOrder = 3;
    g.add(c);
    molecules.push({ m: c, x: c.position.x, y: c.position.y, z: c.position.z, ph: r() * 9, sp: .6 + r() * 1.6 });
  }
  const surf = [];
  const FIX = [[-.060, .020], [-.075, -.050], [.095, -.040], [-.020, .080]];
  // các phân tử NẰM trên mặt nước: phải to đủ để đọc được trong khung cận,
  // và vài cái phải NẰM KHÔNG TRÊN MẶT (đang nhảy lên) — không có phân tử
  // nào ở trạng thái bay thì câu "các phân tử cứ nhảy lung tung" không có hình.
  for (let i = 0; i < 12; i++) {
    const c = cluster(.40);
    const f = FIX[i];
    c.position.set(f ? f[0] : (r() - .5) * w * .7, ASUM + .002, f ? f[1] : (r() - .5) * d * .7);
    fxLayer(c); c.renderOrder = 3;
    g.add(c);
    // vệt mờ dọc: dấu vết của phân tử khi nó nhảy lên khỏi mặt nước
    const trail = mesh(new THREE.SphereGeometry(.010, 10, 8), toon('#cfeeff', { transparent: true, opacity: .38, depthWrite: false }),
      [0, 0, 0], { cast: false, recv: false });
    trail.scale.set(.55, 2.2, .55); trail.visible = false; trail.renderOrder = 2;
    fxLayer(trail); g.add(trail);
    surf.push({ m: c, trail, x: c.position.x, z: c.position.z, ph: r() * 9, sp: .8 + r() * 1.2, hop: i % 3 === 0 });
  }
  const esc = [];
  {
    const c = cluster(.40);
    c.position.set(0, ASUM + .004, .01);
    fxLayer(c); c.renderOrder = 4; g.add(c);
    esc.push({ m: c, x: 0, z: .01, ph: 0, t0: 0 });
  }
  // các nhịt bay lên: 48.6–51.6 (nhát c16) và 51.7–54.0 (nhát c17)
  const FLIGHTS = [[48.6, 51.6], [51.7, 54.0]];
  return {
    group: g, water, molecules, surf, esc, glints, fixedMols,
    // phần nước còn lại MÁT ĐI: ô xi của các phân tử ở mép nước chuyển từ
    // đỏ ấm sang xanh lạnh — đó là mã hình cho chữ "mát đi".
    setCool: (k) => {
      const c = new THREE.Color('#d9503f').lerp(new THREE.Color('#5fa8e8'), clamp(k));
      for (const q of fixedMols) q.o.material.color.copy(c);
      for (const q of surf) q.m.children[0].material.color.copy(c);
    },
    update: (t) => {
      wave(t);
      for (const q of glints) {
        const k = .5 + .5 * Math.sin(t * q.sp + q.ph);
        q.m.position.set(q.x, ASUM + .010 + k * .008, q.z);
        q.m.scale.set(.5 + k * 1.1, .22, .5 + k * 1.1);
        q.m.visible = k > .22;
      }
      for (const q of molecules) {
        q.m.position.set(q.x + Math.sin(t * q.sp + q.ph) * .022, q.y + Math.cos(t * q.sp * .8 + q.ph) * .014, q.z + Math.sin(t * q.sp * .6 + q.ph * 1.3) * .022);
      }
      // nằm yên sát mặt; vài hạt nhảy nhẹ — hạt đang nhảy thì có vệt mờ dọc
      for (const q of surf) {
        const k = ((t * q.sp * .35 + q.ph) % 1);
        const h = q.hop ? Math.max(0, Math.sin(k * Math.PI)) * .026 : 0;
        q.m.position.set(q.x + Math.sin(t * q.sp + q.ph) * .006, ASUM + .002 + h, q.z + Math.cos(t * q.sp * .7 + q.ph) * .006);
        if (q.trail) {
          q.trail.visible = h > .004;
          q.trail.position.set(q.m.position.x, q.m.position.y - .016, q.m.position.z);
          q.trail.material.opacity = .10 + .30 * (h / .026);
        }
      }
      // một phân tử bứt ra ngoài rồi rơi xuống
      let fl = null;
      for (const f of FLIGHTS) if (t >= f[0] && t < f[1]) { fl = f; break; }
      for (const e of esc) {
        if (!fl) { e.m.visible = false; continue; }
        const k = (t - fl[0]) / (fl[1] - fl[0]);
        e.m.visible = true;
        e.m.position.set(e.x + Math.sin(t * .9) * .012 * k, ASUM + .004 + .058 * Math.sin(Math.PI * k), e.z + Math.cos(t * .7) * .010 * k);
      }
    },
  };
}

// ── bàn phơi gỗ: mặt phẳng có nan, đặt quần áo trải ra để so sánh ────
// Hai câu cuối (#49, #60) cần hai cái áo nằm cạnh nhau để đối chiếu.
// Trước đây chúng nằm trên sàn gạch — lệch với mọi cảnh khác trong phim
// (mọi cảnh còn lại đều treo trên dây). Bàn phơi là một đạo cụ đứng riêng:
// khung hình có mặt bàn gỗ, không phải nền gạch trơn.
export function dryBench({ w = 2.30, d = .82, h = .42 } = {}) {
  const g = new THREE.Group();
  const woodMat = toon('#ffffff', { map: TEX.wood() });
  // mặt bàn: năm nan gỗ, kẽ hở giữa các nan
  const NS = 5, SW = w / NS;
  for (let i = 0; i < NS; i++) {
    const x = -w / 2 + SW / 2 + i * SW;
    g.add(mesh(rbox(SW - .018, .028, d, .006), woodMat, [x, h, 0]));
  }
  // đà dọc hai bên + đà giữa
  g.add(mesh(rbox(w, .05, .05, .008), M.woodDark, [0, h - .04, -d / 2 + .05]));
  g.add(mesh(rbox(w, .05, .05, .008), M.woodDark, [0, h - .04, d / 2 - .05]));
  g.add(mesh(rbox(w, .05, .05, .008), M.woodDark, [0, h - .04, 0]));
  // bốn chân
  for (const [x, z] of [[-w / 2 + .12, -d / 2 + .10], [w / 2 - .12, -d / 2 + .10],
                        [-w / 2 + .12, d / 2 - .10], [w / 2 - .12, d / 2 - .10]])
    g.add(mesh(new THREE.CylinderGeometry(.030, .036, h - .04, 8), M.woodDark, [x, (h - .04) / 2, z]));
  // chân ngang giữa, cho bàn thấy vững
  for (const z of [-d / 2 + .10, d / 2 - .10])
    g.add(mesh(new THREE.CylinderGeometry(.020, .020, w - .30, 6), M.woodDark, [0, .13, z], { rot: [0, 0, Math.PI / 2] }));
  return { group: g };
}

// ── bàn tay người ─────────────────────────────────────────────────────
// Bàn tay thật: cổ tay, lòng bàn tay, 5 ngón có móng và đốt, cử chỉ chỉ rõ.
// Không có ống tay áo dài che mất bàn tay.
// Mặt lưng bàn tay: các khung {x, yc, ry, rz} của thân bàn tay.
// set.js dùng bảng này để đặt giọt mồ hôi nằm đúng trên da.
export const HAND_BACK = [
  { x: -.045, yc: -.003, ry: .013, rz: .026 },
  { x: -.015, yc: -.002, ry: .014, rz: .030 },
  { x: .015, yc: .000, ry: .015, rz: .036 },
  { x: .045, yc: .002, ry: .016, rz: .041 },
  { x: .070, yc: .003, ry: .016, rz: .044 },
  { x: .090, yc: .003, ry: .015, rz: .045 },
  { x: .104, yc: .002, ry: .012, rz: .043 },
  { x: .112, yc: .001, ry: .008, rz: .035 },
  { x: .117, yc: .000, ry: .004, rz: .017 },
];

export function hand({ skin = '#f0c39a', size = 1 } = {}) {
  // da có texture (lỗ chân da, vệt ửng) — da nhẵn như nhựa là dấu của búp bê
  const skinTex = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
    const r = mulberry(311);
    for (let i = 0; i < 2400; i++) {                      // lỗ chân da
      const x = r() * w, y = r() * h, rad = .5 + r() * .9;
      c.fillStyle = `rgba(196,150,120,${.035 + r() * .085})`;
      c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
    }
    for (let i = 0; i < 28; i++) {                        // da hơi ửng
      const x = r() * w, y = r() * h, rad = 10 + r() * 26;
      const g2 = c.createRadialGradient(x, y, 0, x, y, rad);
      g2.addColorStop(0, 'rgba(228,166,138,.14)');
      g2.addColorStop(1, 'rgba(228,166,138,0)');
      c.fillStyle = g2; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
    }
  });
  skinTex.wrapS = skinTex.wrapT = THREE.RepeatWrapping;
  skinTex.repeat.set(2.4, 2.4);
  // da: bảng chuyển sáng MỀM — bóng toon mặc định (0.22) biến cẳng tay thành một cán gỗ nâu
  const gradSkin = (() => {
    const d = new Uint8Array([176, 176, 172, 255, 206, 202, 196, 255, 228, 224, 218, 255, 250, 248, 244, 255]);
    const t = new THREE.DataTexture(d, 4, 1, THREE.RGBAFormat);
    t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
    return t;
  })();
  const S = toon(skin, { map: skinTex, grad: gradSkin });
  const SV = toon('#ffffff', { map: skinTex, vertexColors: true, grad: gradSkin });   // da nhiều tông: đầu ngón đỏ, kẽ ngón tối
  const N = toon('#f8d6c6', { map: skinTex, grad: gradSkin });                        // móng tay: nhạt hơn, bo tròn
  const K = toon(new THREE.Color(skin).multiplyScalar(.80), { grad: gradSkin });     // nếp da: tối hơn, KHÔNG phải vòng đen
  // bốn tông da: gốc / đỏ hơn ở đầu ngón và mu bàn tay / hồng ở lòng bàn tay / tối ở kẽ ngón
  const C_BASE = new THREE.Color(skin);
  const C_TIP = new THREE.Color(skin).lerp(new THREE.Color('#d8794f'), .55);
  const C_PALM = new THREE.Color(skin).lerp(new THREE.Color('#e8a98f'), .42);
  const C_WEB = new THREE.Color(skin).lerp(new THREE.Color('#a05c39'), .46);
  const g = new THREE.Group();

  // một hình trụ lathe theo trục X: đầu núm tròn, thân thon dần
  const latheX = (pts, sign = -1) => {
    const geo = new THREE.LatheGeometry(pts, 14);
    geo.rotateZ(sign * Math.PI / 2);
    geo.computeVertexNormals();
    return geo;
  };
  // một đốt ngón: bụi khớp ở gốc, thân thon, đầu núm tròn — KHÔNG có khớp cầu, KHÔNG có vòng đen
  const phalanx = (r, L) => {
    const rb = Math.min(r * .62, L * .36), rt = Math.min(r * .80, L * .46);
    const pts = [];
    for (let i = 0; i <= 4; i++) {
      const a = -Math.PI / 2 + (i / 4) * (Math.PI / 2);
      pts.push(new THREE.Vector2(Math.max(rb * Math.cos(a), .0001), rb + rb * Math.sin(a)));
    }
    const shaft = L - rb - rt;
    pts.push(new THREE.Vector2(r * .95, rb + shaft * .22));
    pts.push(new THREE.Vector2(r, rb + shaft * .58));
    pts.push(new THREE.Vector2(r * .94, rb + shaft * .86));
    pts.push(new THREE.Vector2(r * .86, L - rt));
    for (let i = 1; i <= 5; i++) {
      const a = (i / 5) * (Math.PI / 2);
      pts.push(new THREE.Vector2(Math.max(rt * Math.cos(a), .0001), L - rt + rt * Math.sin(a)));
    }
    return latheX(pts, -1);
  };
  // tô màu một hình theo vị trí đỉnh: da nhiều tông, thay vì một màu be phẳng
  const paint = (geo, fn) => {
    const p = geo.attributes.position;
    const c = new Float32Array(p.count * 3);
    const col = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      fn(p.getX(i), p.getY(i), p.getZ(i), col);
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(c, 3));
    return geo;
  };
  // màu da mu bàn tay: đầu ngón đỏ hơn, kẽ ngón tối hơn, lòng bàn tay hồng
  const bodyColor = (x, y, z, out) => {
    out.copy(C_BASE);
    if (y >= 0) out.lerp(C_TIP, .16); else out.lerp(C_PALM, .30);
    out.lerp(C_TIP, clamp((x - .055) / .060) * .55);
    if (x > .085) {
      let m = 1e9;
      for (const gz of [-.0230, -.0005, .0220, -.0430, .0430]) m = Math.min(m, Math.abs(z - gz));
      out.lerp(C_WEB, clamp(1 - m / .007) * .50 * clamp((x - .085) / .020));
    }
  };
  // màu da của một đốt ngón: đầu ngón đỏ hơn, mặt lòng hồng hơn
  const fingerColor = (x, y, z, out, L) => {
    out.copy(C_BASE);
    if (y >= 0) out.lerp(C_TIP, .18); else out.lerp(C_PALM, .34);
    out.lerp(C_TIP, clamp((x - L * .55) / (L * .45)) * .60);
  };
  // màu da cẳng tay: ấm hơn, không đỏ như đầu ngón
  const armColor = (x, y, z, out) => {
    // cẳng tay sáng hơn bàn tay: bóng toon + ánh sáng mặt đất (nâu) làm cẳng tay tối thành màu gỗ
    out.copy(C_BASE).multiplyScalar(1.45);
    out.lerp(new THREE.Color(1, 1, 1), .10);
    if (y >= 0) out.lerp(C_TIP, .10); else out.lerp(C_PALM, .22);
  };
  // nếp da: một vòng cong mảnh bọc mặt lòng bàn tay của một đốt ngón
  const creaseArc = (parent, x, r, material) => {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const a = -.85 + (i / 12) * 1.70;
      pts.push(new THREE.Vector3(x, -r * Math.cos(a), r * Math.sin(a)));
    }
    const m = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 14, r * .085, 5, false), material, [0, 0, 0], { parent });
    m.castShadow = false;
    return m;
  };
  // quét một hình elip dọc trục X theo các khung {x, yc, ry, rz}, có nắp hai đầu
  const sweep = (rings, n = 24, cf = null) => {
    const pos = [], idx = [];
    for (const R of rings)
      for (let j = 0; j < n; j++) {
        const a = (j / n) * Math.PI * 2;
        pos.push(R.x, R.yc + Math.cos(a) * R.ry, Math.sin(a) * R.rz);
      }
    for (let i = 0; i < rings.length - 1; i++)
      for (let j = 0; j < n; j++) {
        const j2 = (j + 1) % n;
        const a = i * n + j, b = i * n + j2, c = (i + 1) * n + j2, d = (i + 1) * n + j;
        idx.push(a, b, c, a, c, d);
      }
    for (const [R, k] of [[rings[0], -1], [rings[rings.length - 1], 1]]) {
      const base = pos.length / 3;
      pos.push(R.x + k * .001, R.yc, 0);
      const row = (k < 0 ? 0 : rings.length - 1) * n;
      for (let j = 0; j < n; j++) {
        const j2 = (j + 1) % n;
        if (k < 0) idx.push(base, row + j2, row + j);
        else idx.push(base, row + j, row + j2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    if (cf) paint(geo, cf);
    return geo;
  };

  // thân bàn tay: bắt đầu bằng một vòm tròn nhỏ để nối liền cẳng tay, không có mặt nắp
  const bodyRings = [{ x: -.052, yc: -.003, ry: .0050, rz: .0100 }, ...HAND_BACK];
  g.add(mesh(sweep(bodyRings, 24, bodyColor), SV, [0, 0, 0]));
  // nếp cổ tay: hai vòng cong mảnh ở mặt lòng bàn tay — cổ tay không bị thắt thành khớp nối máy
  {
    const backAt = (x) => {
      let i = 0;
      while (i < HAND_BACK.length - 2 && x > HAND_BACK[i + 1].x) i++;
      const a = HAND_BACK[i], b = HAND_BACK[i + 1];
      const t = clamp((x - a.x) / (b.x - a.x));
      return { yc: lerp(a.yc, b.yc, t), ry: lerp(a.ry, b.ry, t), rz: lerp(a.rz, b.rz, t) };
    };
    for (const [cx, sc] of [[-.022, .92], [-.008, .78]]) {
      const b = backAt(cx);
      const pts = [];
      for (let i = 0; i <= 12; i++) {
        const a = -.80 + (i / 12) * 1.60;
        pts.push(new THREE.Vector3(cx, b.yc - b.ry * Math.cos(a) * sc, b.rz * Math.sin(a) * sc));
      }
      const m = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, .0009, 5, false), K, [0, 0, 0]);
      m.castShadow = false; g.add(m);
    }
  }

  // cẳng tay: nối liền cổ tay, cùng màu da, không có ống tay áo
  {
    // cẳng tay vuốt từ TRONG mu bàn tay ra khuỷu: thon dần, đầu khuỷu bo tròn
    // (KHÔNG phải ống trụ cắt phẳng như ống nhựa, KHÔNG có khớp cầu ở cổ tay)
    const armRings = [
      { x: -.042, yc: -.003, ry: .0126, rz: .0258 },
      { x: -.058, yc: -.003, ry: .0132, rz: .0257 },
      { x: -.080, yc: -.002, ry: .0152, rz: .0259 },
      { x: -.106, yc: -.001, ry: .0176, rz: .0263 },
      { x: -.132, yc: .000, ry: .0198, rz: .0268 },
      { x: -.156, yc: .001, ry: .0214, rz: .0272 },
      { x: -.176, yc: .002, ry: .0212, rz: .0268 },
      { x: -.190, yc: .002, ry: .0188, rz: .0244 },
      { x: -.200, yc: .002, ry: .0128, rz: .0170 },
      { x: -.205, yc: .002, ry: .0064, rz: .0090 },
      { x: -.207, yc: .002, ry: .0016, rz: .0024 },
    ];
    g.add(mesh(sweep(armRings, 20, armColor), SV, [0, 0, 0]));
    // tay áo vải cuộn lên: cẳng tay không phải một CÁN GỖ (người xem đọc cẳng tay trần là bàn chân mannequin)
    {
      const sleeveMat = toon('#8d98a9', { grad: gradSkin });
      const sleeveRings = [
        { x: -.170, yc: .002, ry: .0170, rz: .0224 },
        { x: -.162, yc: .002, ry: .0200, rz: .0256 },
        { x: -.152, yc: .002, ry: .0232, rz: .0286 },
        { x: -.156, yc: .001, ry: .0234, rz: .0290 },
        { x: -.132, yc: .000, ry: .0218, rz: .0286 },
        { x: -.112, yc: -.001, ry: .0198, rz: .0274 },
        { x: -.098, yc: -.002, ry: .0182, rz: .0266 },
        { x: -.090, yc: -.002, ry: .0172, rz: .0260 },
      ];
      g.add(mesh(sweep(sleeveRings, 18), sleeveMat, [0, 0, 0]));
      // mép cuộn: một vòng vải dày ở cổ tay áo
      const cuff = mesh(new THREE.TorusGeometry(.0180, .0034, 8, 22), toon('#7f8a9b'), [-.090, -.002, 0]);
      cuff.rotation.y = Math.PI / 2; cuff.scale.set(1, 1, 1.42);
      g.add(cuff);
    }
  }

  // các ngón: 4 ngón dài + 1 ngón cái, mỗi ngón có nếp khớp và móng tay
  const fingers = [];
  const zs = [-.034, -.012, .011, .033];              // út, áp út, giữa, trỏ
  const Ls = [[.033, .021, .017], [.044, .028, .022], [.050, .031, .024], [.043, .027, .021]];
  const rs = [.0098, .0105, .0112, .0105];
  const rootX = [.100, .103, .101, .106];              // hàng khớp ngón hơi cong
  zs.forEach((z, i) => {
    const joints = []; let parent = g, r = rs[i];
    const root = new THREE.Group(); root.position.set(rootX[i], .001, z); g.add(root); parent = root;
    Ls[i].forEach((L, k) => {
      const j = k ? new THREE.Group() : root;
      if (k) { j.position.set(Ls[i][k - 1], 0, 0); parent.add(j); }
      const rr = r;
      mesh(paint(phalanx(rr, L), (px, py, pz, out) => fingerColor(px, py, pz, out, L)), SV, [0, 0, 0], { parent: j });
      if (k > 0) {
        // bụi khớp: một cục nhỏ MẬT trên mu ngón — không phải khớp cầu nổi giữa hai đoạn trụ
        const kb = mesh(new THREE.SphereGeometry(1, 12, 9), SV, [-.001, rr * .48, 0], { parent: j });
        kb.scale.set(rr * .58, rr * .44, rr * .92); kb.castShadow = false;
        paint(kb.geometry, (px, py, pz, out) => out.copy(C_TIP).lerp(C_BASE, .40));
        // nếp da ở đốt: một vòng cong mảnh ở mặt lòng bàn tay
        creaseArc(j, rr * 1.5, rr * .93, K);
      }
      if (k === 2) {
        // móng tay: bo tròn, nhạt hơn da, nằm trên mu đầu ngón
        const nail = new THREE.SphereGeometry(1, 16, 12, 0, Math.PI * 2, 0, Math.PI * .62);
        nail.scale(L * .42, rr * .36, rr * .74);
        const nm = mesh(nail, N, [L * .58, rr * .52, 0], { parent: j });
        nm.rotation.x = -.18;
        // viền trắng nhỏ ở đầu móng: trông như móng, không phải hạt nhựa dán
        const tip = new THREE.SphereGeometry(1, 12, 8, 0, Math.PI * 2, 0, Math.PI * .5);
        tip.scale(L * .26, rr * .13, rr * .36);
        const tm = mesh(tip, toon('#fdf1e6'), [L * .78, rr * .53, 0], { parent: j });
        tm.rotation.x = -.18; tm.castShadow = false;
      }
      joints.push(j); parent = j; r *= .90;
    });
    fingers.push(joints);
  });

  // ngón cái: từ gốc lòng bàn tay, chĩa sang bên
  const th = new THREE.Group(); th.position.set(.016, -.004, .038); g.add(th);
  mesh(paint(phalanx(.0150, .034), (px, py, pz, out) => fingerColor(px, py, pz, out, .034)), SV, [0, 0, 0], { parent: th });
  const t2 = new THREE.Group(); t2.position.set(.034, 0, 0); th.add(t2);
  mesh(paint(phalanx(.0128, .023), (px, py, pz, out) => fingerColor(px, py, pz, out, .023)), SV, [0, 0, 0], { parent: t2 });
  const t3 = new THREE.Group(); t3.position.set(.023, 0, 0); t2.add(t3);
  {
    mesh(paint(phalanx(.0108, .019), (px, py, pz, out) => fingerColor(px, py, pz, out, .019)), SV, [0, 0, 0], { parent: t3 });
    // móng ngón cái: bo tròn, nhạt hơn da
    const nail = new THREE.SphereGeometry(1, 16, 12, 0, Math.PI * 2, 0, Math.PI * .62);
    nail.scale(.0094, .0032, .0070);
    const nm = mesh(nail, N, [.0110, .0056, 0], { parent: t3 });
    nm.rotation.x = -.18;
    // nếp đốt ngón cái
    creaseArc(th, .024, .0140, K);
    creaseArc(t2, .019, .0118, K);
  }
  g.scale.setScalar(size);
  // pose: curl 0..1 = co các ngón, spread 0..1 = xòe các ngón
  g.pose = (curl, spread = 0) => {
    fingers.forEach(([a, b, c], i) => {
      a.rotation.set(0, (i - 1.5) * .12 * spread, -curl * 1.0); b.rotation.z = -curl * 1.3; c.rotation.z = -curl * .9;
    });
    th.rotation.set(-.2 + curl * .6, -.8 + curl * .45, .05 - curl * .35); t2.rotation.z = -.05 - curl * .5; t3.rotation.z = -.05 - curl * .5;
  };
  // mặc định: bàn tay mở, ngón hơi cong — đọc ra là bàn tay người
  fingers.forEach(([a, b, c], i) => {
    const k = i === 3 ? .08 : .13;
    a.rotation.set(0, (i - 1.5) * .30, -k); b.rotation.z = -k * 1.2; c.rotation.z = -k * .9;
  });
  th.rotation.set(-.30, -.50, .10); t2.rotation.z = -.50; t3.rotation.z = -.42;
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { group: g, pose: g.pose };
}

export { glowMat, fxLayer, PAL };

// ── danh mục đạo cụ: propcheck dựng từng vật một, ba góc nhìn ────────
const gE_hemClothTex = () => canvasTex(256, 256, (c, w, h) => {
  // khăn trắng/cream: màu cam đậm làm mảnh vải đọc ra là một tấm ván gỗ
  c.fillStyle = '#ece3cf'; c.fillRect(0, 0, w, h);
  const r = mulberry(96);
  // nền xù terry: các núm vòng nhỏ
  for (let y = 0; y < h; y += 6) {
    const off = (y / 6) % 2 ? 3 : 0;
    for (let x = 0; x < w; x += 6) {
      const px = x + off + r() * 1.4, py = y + r() * 1.4, rad = 2.2 + r() * 1.3;
      const g2 = c.createRadialGradient(px - rad * .3, py - rad * .35, rad * .1, px, py, rad);
      g2.addColorStop(0, 'rgba(255,255,255,.60)');
      g2.addColorStop(.55, 'rgba(206,192,160,.30)');
      g2.addColorStop(1, 'rgba(178,162,128,.22)');
      c.fillStyle = g2; c.beginPath(); c.arc(px, py, rad, 0, 7); c.fill();
    }
  }
  // mép ướt sẫm: vệt ẩm ở đáy tấm vải (canvas đáy = v = 0 = mép khăn), mép trên méo mó
  const edge = (u) => h - (26 + 8 * Math.sin(u * 9.1) + 5 * Math.sin(u * 21.3 + 1.2));
  c.save();
  c.beginPath();
  c.moveTo(0, h);
  for (let i = 0; i <= 40; i++) { const u = i / 40; c.lineTo(u * w, edge(u)); }
  c.lineTo(w, h); c.closePath();
  const wet = c.createLinearGradient(0, h, 0, h * .55);
  wet.addColorStop(0, 'rgba(84,74,50,.72)');
  wet.addColorStop(.45, 'rgba(140,126,96,.30)');
  wet.addColorStop(1, 'rgba(170,158,128,0)');
  c.fillStyle = wet; c.fill();
  c.restore();
  // vài vệt ướt loang trên vải
  for (let i = 0; i < 26; i++) {
    c.globalAlpha = .08 + r() * .14;
    c.fillStyle = '#6a5f46';
    c.beginPath(); c.ellipse(r() * w, h * .62 + r() * h * .34, 8 + r() * 26, 4 + r() * 10, r() * 3, 0, 7); c.fill();
  }
  c.globalAlpha = 1;
});
function gE_fallingDrop(R, mat) {
  const gr = new THREE.Group();
  const p = [];
  for (let i = 0; i <= 8; i++) {                       // đáy tròn
    const a = (i / 8) * Math.PI / 2;
    p.push(new THREE.Vector2(Math.sin(a) * R, (1 - Math.cos(a)) * R - 1.1 * R));
  }
  for (let i = 1; i <= 10; i++) {                      // thân nhọn dần lên trên
    const t = i / 10;
    p.push(new THREE.Vector2(Math.pow(Math.cos(t * Math.PI / 2), .85) * R * .96, R + t * 1.20 * R - 1.1 * R));
  }
  const body = new THREE.Mesh(new THREE.LatheGeometry(p, 20), mat);
  body.castShadow = true; gr.add(body);
  // lõi khúc xạ: một lõi nhạt hơn bên trong thân giọt
  const core = new THREE.Mesh(new THREE.SphereGeometry(R * .46, 12, 10), toon('#eafcff', { transparent: true, opacity: .30, depthWrite: false }));
  core.position.y = R * .10; core.scale.set(1, 1.25, 1); gr.add(core);
  // điểm sáng trắng
  const hi = new THREE.Mesh(new THREE.SphereGeometry(R * .30, 10, 8), glowMat('#ffffff', 1.45));
  hi.position.set(-R * .32, R * .24, R * .58); hi.scale.set(1, .70, .50); gr.add(hi);
  const hi2 = new THREE.Mesh(new THREE.SphereGeometry(R * .13, 8, 6), glowMat('#e6fbff', 1.0));
  hi2.position.set(R * .38, -R * .10, R * .54); gr.add(hi2);
  return { group: gr, body };
}
const gE_threadTex = () => canvasTex(128, 256, (c, w, h) => {
  c.fillStyle = '#f6f1e5'; c.fillRect(0, 0, w, h);
  const r = mulberry(97);
  // xơ bông: sợi nhỏ nằm chéo, dày đặc — đọc là bông xoắn
  for (let i = 0; i < 1400; i++) {
    const y = r() * h, x = r() * w, L = 10 + r() * 26;
    c.strokeStyle = r() > .5 ? `rgba(255,255,255,${.28 + r() * .40})` : `rgba(158,144,112,${.12 + r() * .26})`;
    c.lineWidth = .7 + r() * 1.2;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + L * .45, y + L); c.stroke();
  }
  // vài sợi lông tơ dài hơn
  for (let i = 0; i < 40; i++) {
    const y = r() * h, x = r() * w, L = 30 + r() * 60;
    c.strokeStyle = `rgba(255,255,255,${.12 + r() * .22})`;
    c.lineWidth = .8;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + L * .2, y + L * .5, x + L * .45, y + L); c.stroke();
  }
});

const gA_ropeTex = () => canvasTex(128, 256, (c, w, h) => {
  c.fillStyle = '#f7efdb'; c.fillRect(0, 0, w, h);
  const r = mulberry(77);
  for (let i = -h; i < w + h; i += 9) {
    c.strokeStyle = `rgba(166,140,98,${.12 + r() * .14})`; c.lineWidth = 2.4;
    c.beginPath(); c.moveTo(i, 0); c.lineTo(i + h * .5, h); c.stroke();
    c.strokeStyle = 'rgba(255,253,244,.62)'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(i + 3.4, 0); c.lineTo(i + 3.4 + h * .5, h); c.stroke();
  }
  for (let k = 0; k < 2600; k++) { c.fillStyle = `rgba(126,104,70,${r() * .09})`; c.fillRect(r() * w, r() * h, 2, 2); }
});
const gA_woodTex = () => canvasTex(128, 256, (c, w, h) => {
  c.fillStyle = '#e7c99f'; c.fillRect(0, 0, w, h);
  const r = mulberry(19);
  for (let i = 0; i < 46; i++) {
    c.strokeStyle = `rgba(146,100,54,${.07 + r() * .18})`; c.lineWidth = 1 + r() * 2.2;
    const x = r() * w; c.beginPath(); c.moveTo(x, 0);
    c.bezierCurveTo(x + 6, h * .3, x - 6, h * .7, x + 3, h); c.stroke();
  }
  c.fillStyle = 'rgba(90,60,30,.05)';
  for (let i = 0; i < 260; i++) c.fillRect(r() * w, r() * h, 2, 2);
});
function gA_ropeCurve(len, sag, y) {
  const pts = [];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40, x = -len / 2 + len * u;
    const t = Math.min(1, (2 * x / len) ** 2);
    pts.push(new THREE.Vector3(x, y - sag * (1 - t), 0));
  }
  return new THREE.CatmullRomCurve3(pts);
}
function gA_ropeGroup(curve, { r = .0098, twist = .0022, pitch = .05, mat } = {}) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.TubeGeometry(curve, 110, r, 8, false), mat);
  core.castShadow = true; core.receiveShadow = true; g.add(core);
  const turns = Math.max(2, curve.getLength() / pitch);
  const N = Math.min(760, Math.round(turns * 9));
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N, p = curve.getPointAt(u), t = curve.getTangentAt(u);
    const n = new THREE.Vector3().crossVectors(t, new THREE.Vector3(0, 0, 1));
    if (n.lengthSq() < 1e-8) n.set(1, 0, 0); else n.normalize();
    const b = new THREE.Vector3().crossVectors(t, n).normalize();
    const a = u * turns * Math.PI * 2;
    pts.push(p.clone()
      .add(n.multiplyScalar(Math.cos(a) * r * .86))
      .add(b.multiplyScalar(Math.sin(a) * r * .86)));
  }
  const tw = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N, twist, 5, false), mat);
  tw.castShadow = false; tw.receiveShadow = false; g.add(tw);
  return g;
}
function gA_plainShirt({ color = '#f2f0e6', w = .58, h = .72 } = {}) {
  const g = new THREE.Group();
  const mat = toon('#ffffff', { side: THREE.DoubleSide, map: fabricTex() });
  mat.map.repeat.set(2.2, 2.6); mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
  mat.color.set(color);
  const body = mesh(clothGeo(shirtShape(w, h), w, h, 1.5), mat, [0, 0, 0]);
  g.add(body);
  // cổ tròn: một đường viền mảnh cùng tông vải, không phải cổ polo
  const trim = toon(new THREE.Color(color).lerp(new THREE.Color('#6d6252'), .24));
  g.add(mesh(new THREE.TubeGeometry(neckPath(w, -.048, 10), 22, .0040, 6, false), trim, [0, 0, .008]));
  return { group: g, body, mat };
}

const gC_plasticTex = () => canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
  const r = mulberry(311);
  // vân khuôn rất nhạt: bề mặt nhựa múi, không có ánh kim loại
  for (let i = 0; i < 80; i++) {
    const x = r() * w;
    c.strokeStyle = `rgba(150,178,192,${.025 + r() * .045})`;
    c.lineWidth = 3 + r() * 12;
    c.beginPath(); c.moveTo(x, -10);
    c.bezierCurveTo(x + (r() - .5) * 26, h * .35, x + (r() - .5) * 26, h * .72, x + (r() - .5) * 16, h + 10);
    c.stroke();
  }
  // hạt nhám rất nhỏ
  for (let i = 0; i < 11000; i++) { c.fillStyle = `rgba(120,142,156,${r() * .06})`; c.fillRect(r() * w, r() * h, 2, 2); }
  // vài vết xước mờ trên nhựa cũ
  for (let i = 0; i < 16; i++) {
    c.strokeStyle = `rgba(255,255,255,${.10 + r() * .22})`; c.lineWidth = 1 + r() * 2;
    const x = r() * w, y = r() * h, a = r() * Math.PI;
    c.beginPath(); c.moveTo(x, y);
    c.lineTo(x + Math.cos(a) * (18 + r() * 40), y + Math.sin(a) * (18 + r() * 40)); c.stroke();
  }
});

const gC_waterTex = () => canvasTex(256, 256, (c, w, h) => {
  const cx = w / 2, cy = h / 2;
  const g = c.createRadialGradient(cx, cy, w * .04, cx, cy, w * .52);
  g.addColorStop(0, '#3f9cc4');
  g.addColorStop(.45, '#5ab6d8');
  g.addColorStop(.82, '#8fdff0');
  g.addColorStop(1, '#c2eefb');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  const r = mulberry(77);
  // gợn: những vệt sáng ngắn, nghiêng ngẫu nhiên, không khép kín thành vòng
  for (let i = 0; i < 90; i++) {
    const x = r() * w, y = r() * h, a = r() * Math.PI, L = 6 + r() * 26;
    c.strokeStyle = `rgba(255,255,255,${.12 + r() * .34})`; c.lineWidth = .8 + r() * 2.0;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); c.stroke();
  }
  for (let i = 0; i < 60; i++) {
    const x = r() * w, y = r() * h, a = r() * Math.PI, L = 5 + r() * 20;
    c.strokeStyle = `rgba(22,96,136,${.10 + r() * .22})`; c.lineWidth = .8 + r() * 1.6;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); c.stroke();
  }
  for (let i = 0; i < 340; i++) { c.fillStyle = `rgba(255,255,255,${r() * .32})`; c.fillRect(r() * w, r() * h, 2, 2); }
});

function gC_ringGrid(nu, nv, f) {
  const pos = [], uvs = [], idx = [];
  for (let j = 0; j <= nv; j++) {
    const v = j / nv;
    for (let i = 0; i <= nu; i++) {
      const u = i / nu, p = f(u, v, i, j);
      pos.push(p[0], p[1], p[2]); uvs.push(u, v);
    }
  }
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

function gC_sweepRibbon(pts, w, t, closed = false) {
  const n = pts.length, pos = [], idx = [], uvs = [];
  const frames = [];
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const prev = pts[(i - 1 + n) % n], next = pts[(i + 1) % n];
    const tan = new THREE.Vector3().subVectors(next, prev);
    if (tan.lengthSq() < 1e-12) tan.set(0, 1, 0);
    tan.normalize();
    const up = Math.abs(tan.y) > .92 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const side = new THREE.Vector3().crossVectors(tan, up).normalize();
    const nrm = new THREE.Vector3().crossVectors(side, tan).normalize();
    frames.push({ p, nrm, side });
  }
  for (const f of frames) {
    const hw = w / 2, ht = t / 2;
    for (const [sn, st] of [[1, 1], [1, -1], [-1, -1], [-1, 1]]) {
      pos.push(f.p.x + f.nrm.x * hw * sn + f.side.x * ht * st,
        f.p.y + f.nrm.y * hw * sn + f.side.y * ht * st,
        f.p.z + f.nrm.z * hw * sn + f.side.z * ht * st);
    }
    uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
  }
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const a = i * 4, b = ((i + 1) % n) * 4;
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4;
      idx.push(a + k, b + k, a + k2, a + k2, b + k, b + k2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

const gC_hash2 = (i, j, s = 0) => {
  const v = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453;
  return v - Math.floor(v);
};

function gC_vnoise(x, y, s = 0) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = gC_hash2(xi, yi, s), b = gC_hash2(xi + 1, yi, s);
  const c = gC_hash2(xi, yi + 1, s), d = gC_hash2(xi + 1, yi + 1, s);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

const gC_nylonTex = () => canvasTex(512, 512, (c, cw, ch) => {
  c.fillStyle = '#ffffff'; c.fillRect(0, 0, cw, ch);
  const r = mulberry(67);
  // nếp xếp: các cặp cạnh sáng/tối cứng, mép rõ, phân bố ngẫu nhiên
  for (let k = 0; k < 20; k++) {
    const x0 = r() * cw, wob = 5 + r() * 16, skew = (r() - .5) * .5;
    const y0 = r() * ch * .5, y1 = ch * (.5 + r() * .6);
    for (const side of [-1, 1]) {
      c.beginPath();
      c.moveTo(x0 + side * 1.5, y0);
      for (let y = y0; y <= y1; y += 22) {
        c.lineTo(x0 + side * (1.5 + Math.sin(y * .012 + k) * wob) + (y * skew) * .12, y);
      }
      c.strokeStyle = side > 0 ? `rgba(255,255,255,${.85 + r() * .15})` : `rgba(96,112,136,${.34 + r() * .34})`;
      c.lineWidth = side > 0 ? 1.2 + r() * 2.4 : 2.0 + r() * 3.4;
      c.stroke();
    }
  }
  // vệt bóng satin: dải sáng dọc, cứng mép — nylon bóng
  for (let i = 0; i < 13; i++) {
    const x = r() * cw, bw = 4 + r() * 15;
    const g2 = c.createLinearGradient(x - bw, 0, x + bw, 0);
    g2.addColorStop(0, 'rgba(255,255,255,0)');
    g2.addColorStop(.40, 'rgba(255,255,255,.92)');
    g2.addColorStop(.60, 'rgba(255,255,255,.72)');
    g2.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g2; c.fillRect(x - bw, 0, bw * 2, ch);
  }
  // nhăn nhỏ rải rác
  for (let i = 0; i < 460; i++) {
    const x = r() * cw, y = r() * ch, a = r() * Math.PI, L = 8 + r() * 42;
    c.strokeStyle = `rgba(${r() > .55 ? '255,255,255' : '104,118,142'},${.16 + r() * .38})`;
    c.lineWidth = .7 + r() * 1.4;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); c.stroke();
  }
  for (let i = 0; i < 2200; i++) { c.fillStyle = `rgba(150,162,182,${r() * .05})`; c.fillRect(r() * cw, r() * ch, 2, 2); }
});

const gC_satinSheenTex = () => canvasTex(512, 512, (c, cw, ch) => {
  c.fillStyle = '#000000'; c.fillRect(0, 0, cw, ch);
  const r = mulberry(149);
  for (let i = 0; i < 14; i++) {
    const x = r() * cw, bw = 3 + r() * 11;
    const g2 = c.createLinearGradient(x - bw, 0, x + bw, 0);
    g2.addColorStop(0, 'rgba(0,0,0,0)');
    g2.addColorStop(.45, `rgba(255,255,255,${.55 + r() * .45})`);
    g2.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g2; c.fillRect(x - bw, 0, bw * 2, ch);
  }
});

const gC_seatWoodTex = () => canvasTex(512, 512, (c, w, h) => {
  c.fillStyle = '#bd7740'; c.fillRect(0, 0, w, h);
  const r = mulberry(303);
  for (let i = 0; i < 44; i++) {
    const y0 = r() * h;
    const dark = r() > .45;
    c.strokeStyle = dark ? `rgba(88,49,20,${.16 + r() * .30})` : `rgba(228,180,124,${.12 + r() * .22})`;
    c.lineWidth = .8 + r() * 2.6;
    const A = 3 + r() * 7, B = 2 + r() * 4, ph = r() * 6;
    // nửa trái: lưu các điểm để lật đối xứng sang nửa phải
    const pts = [];
    for (let x = 0; x <= w / 2; x += 12) {
      const yy = y0 + Math.sin(x * .018 + ph) * A + Math.sin(x * .005 + ph * 2) * B;
      pts.push([x, yy]);
    }
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (const [x, y] of pts) c.lineTo(x, y);
    c.stroke();
    c.beginPath(); c.moveTo(w - pts[0][0], pts[0][1]);
    for (const [x, y] of pts) c.lineTo(w - x, y);
    c.stroke();
  }
  // hai mắt gỗ đối xứng
  for (const kx of [w * .22, w * .78]) {
    for (let j = 5; j > 0; j--) {
      c.strokeStyle = 'rgba(78,42,16,.34)'; c.lineWidth = 1.6;
      c.beginPath(); c.ellipse(kx, h * .34, j * 6, j * 2.6, 0, 0, 7); c.stroke();
    }
  }
  for (let i = 0; i < 2600; i++) { c.fillStyle = `rgba(70,38,14,${r() * .07})`; c.fillRect(r() * w, r() * h, 2, 2); }
});

function gC_rod(a, b, r0, r1, mat, seg = 8) {
  const dir = new THREE.Vector3().subVectors(b, a), len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, len, seg), mat);
  m.position.copy(a).addScaledVector(dir, .5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  m.castShadow = true; m.receiveShadow = true;
  return m;
}

function gD_roundRect(w, h, r, path, ox = 0, oy = 0) {
  const x = -w / 2 + ox, y = -h / 2 + oy;
  const s = path ? new THREE.Path() : new THREE.Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  s.closePath();
  return s;
}

function gD_frameGeo(w, h, d, iw, ih, r, ir) {
  const shape = gD_roundRect(w, h, r);
  shape.holes.push(gD_roundRect(iw, ih, ir, true));
  return new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false, curveSegments: 6 });
}

function gD_lugGeo(w, h, r, holeR, d, holeDy = 0) {
  const shape = gD_roundRect(w, h, r);
  const hole = new THREE.Path();
  hole.absarc(0, holeDy, holeR, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  return new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false, curveSegments: 8 });
}

function gF_fibreTex(seed = 77) {
  return canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#f8f2e2'; c.fillRect(0, 0, w, h);
    const rr = mulberry(seed);
    for (let i = 0; i < 900; i++) {              // sợi xơ nằm chồng trên thân sợi
      const y = rr() * h, x = rr() * w, L = 5 + rr() * 22;
      c.strokeStyle = rr() > .5 ? `rgba(255,255,255,${.32 + rr() * .46})` : `rgba(146,131,101,${.14 + rr() * .32})`;
      c.lineWidth = .7 + rr() * 1.3;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + L, y + (rr() - .5) * 2.5); c.stroke();
    }
    for (let i = 0; i < 54; i++) {               // nét xoắn: vệt chạy chéo dọc sợi
      const x = rr() * w, y = rr() * h, L = 22 + rr() * 60;
      c.strokeStyle = `rgba(255,255,255,${.10 + rr() * .16})`; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + L * .24, y + L); c.stroke();
    }
    for (let i = 0; i < 26; i++) {
      const x = rr() * w, y = rr() * h, L = 22 + rr() * 50;
      c.strokeStyle = `rgba(136,120,92,${.10 + rr() * .16})`; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + L * .24, y + L); c.stroke();
    }
  });
}

function gF_weavePanel({
  O = new THREE.Vector3(), F = new THREE.Vector3(0, 1, 0), G = new THREE.Vector3(1, 0, 0),
  n = 31, size = .34, r = null, amp = null, drape = null, chan = null, minPitch = 0, fray = 0,
  matWarp, matWeft, skip = [], seed = 11, radial = 7, wobble = .10,
}) {
  const g = new THREE.Group();
  const rnd = mulberry(seed);
  // sợi không được dày quá: nếu dày, viền mực ăn hết khe sợi, mặt vải thành lưới tối
  let pitch = Math.max(size / n, minPitch);
  n = Math.max(3, Math.round(size / pitch));
  pitch = size / n;
  const rad = r ?? pitch * .30;
  const A = amp ?? rad * 1.45;
  const half = (n - 1) / 2;
  const a0 = -half * pitch, b0 = -half * pitch;
  const P = (a, b, z) => new THREE.Vector3(
    O.x + G.x * a + F.x * b,
    O.y + G.y * a + F.y * b,
    O.z + G.z * a + F.z * b + (drape ? drape(a, b) : 0) + z);
  const phase = (a, b) => Math.PI * ((a - a0) / pitch + (b - b0) / pitch);
  const steps = Math.max(32, Math.round(size / pitch) * 4);
  // sợi dọc: chạy dọc F, mỗi khe ngang thì nhấp lên rồi chìm xuống
  for (let i = 0; i < n; i++) {
    if (skip.includes(i)) continue;
    const a = (i - half) * pitch + (rnd() - .5) * pitch * wobble;
    const rr = rad * (.86 + rnd() * .28);
    const pts = [];
    for (let k = 0; k <= steps; k++) {
      const b = (k / steps - .5) * size;
      pts.push(P(a, b, A * Math.cos(phase(a, b))));
    }
    const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), steps, rr, radial, false), matWarp);
    t.castShadow = true; t.receiveShadow = true; g.add(t);
  }
  // sợi ngang: chạy ngang G, luồn ngược pha với sợi dọc; ở khe trống thì tụt xuống
  for (let j = 0; j < n; j++) {
    const b = (j - half) * pitch + (rnd() - .5) * pitch * wobble;
    const rr = rad * (.86 + rnd() * .28);
    const pts = [];
    for (let k = 0; k <= steps; k++) {
      const a = (k / steps - .5) * size;
      let z = -A * Math.cos(phase(a, b));
      if (chan) {                       // khe không có sợi dọc: sợi ngang tụt xuống khe
        const u = (a - (chan.at ?? 0)) / (chan.w ?? pitch);
        const dip = Math.exp(-u * u) * (chan.k ?? 1);
        z = z * (1 - dip) + (chan.z ?? -A * 1.2) * dip;
      }
      pts.push(P(a, b, z));
    }
    const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), steps, rr, radial, false), matWeft);
    t.castShadow = true; t.receiveShadow = true; g.add(t);
  }
  // mép vải không cắt thẳng: vài sợi tơi lệch ra ngoài ở đầu sợi dọc
  for (let i = 0; i < fray; i++) {
    const idx = Math.floor(rnd() * n);
    const a = (idx - half) * pitch + (rnd() - .5) * pitch * .6;
    const sgn = rnd() > .5 ? 1 : -1;
    const b0 = sgn * (size * .5 - .002);
    const len = .005 + rnd() * .011, wob = (rnd() - .5) * .014;
    const pts = [];
    for (let k = 0; k <= 5; k++) {
      const l = k / 5;
      pts.push(P(a + wob * l * l, b0 + sgn * l * len, A * Math.cos(phase(a, b0)) - l * .009));
    }
    const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, rad * .52, 5, false), matWarp);
    t.castShadow = true; t.receiveShadow = true; g.add(t);
  }
  return { group: g, pitch, a0, b0, phase, P, amp: A, rad };
}

function gD_thermFrameGeo(w, h, r, tabW, tabH, holeR, winW, winH, winY, d) {
  const s = new THREE.Shape();
  const x = w / 2, y = h / 2;
  s.moveTo(-x + r, -y);
  s.lineTo(x - r, -y);
  s.quadraticCurveTo(x, -y, x, -y + r);
  s.lineTo(x, y);
  s.lineTo(tabW / 2, y);
  s.lineTo(tabW / 2, y + tabH - holeR);
  s.quadraticCurveTo(tabW / 2, y + tabH, 0, y + tabH);
  s.quadraticCurveTo(-tabW / 2, y + tabH, -tabW / 2, y + tabH - holeR);
  s.lineTo(-tabW / 2, y);
  s.lineTo(-x, y);
  s.lineTo(-x, -y + r);
  s.quadraticCurveTo(-x, -y, -x + r, -y);
  s.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, y + tabH * .5, holeR, 0, Math.PI * 2, true);
  s.holes.push(hole);
  s.holes.push(gD_roundRect(winW, winH, .008, true, 0, winY));
  return new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 8 });
}
function gD_paintTex(base, seed) {
  return canvasTex(256, 256, (c, w, h) => {
    const r = mulberry(seed);
    c.fillStyle = base; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 1500; i++) {
      c.fillStyle = r() > .5 ? `rgba(255,255,255,${.02 + r() * .05})` : `rgba(0,0,0,${.02 + r() * .05})`;
      c.beginPath(); c.arc(r() * w, r() * h, .5 + r() * 1.7, 0, 7); c.fill();
    }
    for (let i = 0; i < 40; i++) {                 // vệt quét sơn
      c.fillStyle = `rgba(255,255,255,${.015 + r() * .03})`;
      c.save(); c.translate(r() * w, r() * h); c.rotate(r() * 3.14);
      c.fillRect(-40 - r() * 40, -2, 80 + r() * 80, 4 + r() * 3); c.restore();
    }
  });
}
function gD_textPlane(text, w, h, color, font = 64) {
  const tex = canvasTex(256, 96, (c, cw, ch) => {
    c.clearRect(0, 0, cw, ch);
    c.fillStyle = color; c.font = `bold ${font}px sans-serif`;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(text, cw / 2, ch / 2);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }));
  m.castShadow = false; m.receiveShadow = false;
  return m;
}

export const PROPS = {
  'dây phơi thừng chùng với hai cọc gỗ': () => dryingLine({ len: 1.6, sag: .12, y: 1.2, hang: true }).group,
  'kẹp quần áo bằng gỗ': () => clothesClip().group,
  'áo phông còn ướt (màu sẫm)': () => tShirt({ wetColor: '#7c8296' }).group,
  'áo phông đã khô (màu sáng)': () => { const s = tShirt({ wetColor: '#7c8296' }); s.setWet(0); return s.group; },
  'quần đùi hai ống': () => trousers().group,
  'áo thun mỏng': () => thinTee().group,
  'khăn tắm có mép tua': () => { const t = towel(); t.setWet(0); return t.group; },
  'đàn áo phơi chồng trên dây': () => shirtPile({ n: 3 }).group,
  'bồn chậu nhựa có nước': () => basin().group,
  'quạt bàn có lưới': () => deskFan().group,
  'túi nylon buộc dây': () => { const b = nylonBag(); b.group.position.y = .2; return b.group; },
  'cân nhà bếp có mặt đồng hồ kim': () => kitchenScale().group,
  'nhiệt kế treo tường': () => thermometer().group,
  'ẩm kế treo tường có kim': () => hygrometer().group,
  'ghế gỗ': () => chair().group,
  'bàn gỗ với hai mặt kính và vách ngăn': () => labTable().group,
  'sợi vải đan cận': () => wovenFibres().group,
  'tấm vải dệt: sợi dọc luồn qua sợi ngang': () => wovenCloth({ n: 30, size: .34 }).group,
  'giọt nước đọng trên sợi': () => dropOnThread().group,
  'mặt nước cận có gợn sóng': () => waterSurface().group,
  'áo phơi một mặt: nửa khô nửa ẩm': () => halfShirt().group,
  'áo phơi rộng: cả hai mặt phơi ra': () => spreadShirt().group,
  'áo úp: mép dưới úp lên, mảng ẩm nằm trên mặt gấp': () => foldedShirt().group,
  'giọt nước rơi từ mép khăn': () => hemDrop().group,
  'bàn phơi gỗ có nan, trải quần áo ra để so sánh': () => dryBench().group,
  'bàn tay người': () => hand().group,
};
