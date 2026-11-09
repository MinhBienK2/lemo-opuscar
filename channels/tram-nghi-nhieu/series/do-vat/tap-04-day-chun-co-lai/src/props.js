// props.js — vật riêng của tập 04: dây chun, dây thép, ghim, quả cân, thước, nhiệt kế,
// đồng hồ đo lực, máy sấy tóc, hũ thủy tinh, và chuỗi polymer của thế giới bên trong sợi dây.
//
// Vài dựa trên hình dạng thật:
//  · dây chun là một dải dẹt có mặt cắt chữ nhật (không phải sợi tròn), nên vòng dây là một
//    vòng băng dẹt; khi siết thì bán kính vòng nhỏ lại, và đó là thay đổi thật của vật;
//  · nhiệt kế là cột thủy ngân trong ống kính, và cột dâng lên thật;
//  · đồng hồ đo lực là một cái thang tròn có kim, và kim chạy trên một cung tròn;
//  · chuỗi polymer là dãy hạt nối: khi kéo căng thì hạt nằm thẳng, khi tự nhiên thì nó cuộn.
// Mọi vật đều là hàm thuần của t, nên dựng lại được bất cứ lúc nào.
import * as THREE from 'three';
import { toon, mesh, rbox, canvasTex, PAL, clamp, lerp, ss, mulberry, hash, fxLayer, glowMat } from '../../../../rig/kit.js';
import { flow } from '../../../../rig/fx.js';

// ── dải mềm: dựng chung cho mọi vật dây ────────────────────────────────
// Mặt cắt của dây chun: hình chữ nhật có góc bo tròn. Mặt cắt vuông nhọn
// đọc ra là thanh nhựa hay que kem; bo tròn thì đọc ra là cao su dẻo.
function roundSection(a, b, rc, S = 16) {
  rc = Math.min(rc, a * .92, b * .92);
  const dx = a - rc, dy = b - rc;
  const out = [];
  const corners = [[dx, dy, 0], [-dx, dy, Math.PI / 2], [-dx, -dy, Math.PI], [dx, -dy, Math.PI * 1.5]];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i < S / 4; i++) {
      const t = a0 + (Math.PI / 2) * (i / (S / 4));
      out.push([cx + rc * Math.cos(t), cy + rc * Math.sin(t)]);
    }
  }
  return out;
}

// Một dải mềm chạy theo một đường cong: bề rộng `wid` theo trục `side`,
// bề dày `thk` theo pháp tuyến của đường cong. `widthAt(u)` cho phép dải
// eo lại ở giữa (dây chun bị kéo thì eo, dây chun chùng thì no).
function ribbonMesh(curve, side, wid, thk, mat, o = {}) {
  const { n = 40, widthAt = null } = o;
  const sec = roundSection(thk / 2, wid / 2, Math.min(thk, wid) * .30, 16);
  const S = sec.length;
  const pos = new Float32Array((n + 1) * S * 3);
  const idx = [];
  for (let i = 0; i < n; i++) {
    const a = i * S, b = (i + 1) * S;
    for (let k = 0; k < S; k++) {
      const k2 = (k + 1) % S;
      idx.push(a + k, b + k, b + k2, a + k, b + k2, a + k2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setIndex(idx);
  const p = new THREE.Vector3(), t = new THREE.Vector3(), s = new THREE.Vector3(), nr = new THREE.Vector3();
  let q = 0;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    curve.getPoint(u, p);
    curve.getTangent(u, t).normalize();
    s.copy(side).addScaledVector(t, -side.dot(t)).normalize();
    nr.crossVectors(t, s).normalize();
    const wd = widthAt ? widthAt(u) : 1;
    for (const [th, wi] of sec) {
      pos[q++] = p.x + nr.x * th + s.x * wi * wd;
      pos[q++] = p.y + nr.y * th + s.y * wi * wd;
      pos[q++] = p.z + nr.z * th + s.z * wi * wd;
    }
  }
  g.attributes.position.needsUpdate = true;
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return mesh(g, mat, [0, 0, 0]);
}

// Một đoạn vòng tròn (cung) có mặt cắt riêng: dùng cho vòng dây chun và
// cho đoạn hai đầu dán chồng lên.
function arcGeometry(nSec, sec) {
  const S = sec.length;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((nSec + 1) * S * 3), 3));
  const idx = [];
  for (let i = 0; i < nSec; i++) {
    const a = i * S, b = (i + 1) * S;
    for (let k = 0; k < S; k++) {
      const k2 = (k + 1) % S;
      idx.push(a + k, b + k, b + k2, a + k, b + k2, a + k2);
    }
  }
  g.setIndex(idx);
  return { g, S, nSec, sec };
}

// Đổ hình học của một cung theo hàm place(i) → {ang, rr}.
function fillArc(A, place) {
  const pos = A.g.attributes.position.array;
  let q = 0;
  for (let i = 0; i <= A.nSec; i++) {
    const { ang, rr } = place(i);
    const c = Math.cos(ang), s = Math.sin(ang);
    for (const [rad, y] of A.sec) {
      pos[q++] = c * (rr + rad); pos[q++] = y; pos[q++] = s * (rr + rad);
    }
  }
  A.g.attributes.position.needsUpdate = true;
  A.g.computeVertexNormals();
  A.g.computeBoundingSphere();
}

// Màu nhân bản: sáng/tối một màu gốc.
function shade(hex, k) {
  const c = new THREE.Color(hex).multiplyScalar(k);
  return '#' + c.getHexString();
}

// Vân kim loại: một vệt sáng chạy dọc thân và đáy tối hơn miệng. Một thân
// nhựa phẳng một màu thì đọc ra là nhựa; có vân sáng như vậy thì đọc ra là
// kim loại đã gọn.
function metalTex(color) {
  return canvasTex(128, 128, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, shade(color, .46));
    g.addColorStop(.12, shade(color, .72));
    g.addColorStop(.25, shade(color, 1.40));
    g.addColorStop(.34, shade(color, 1.02));
    g.addColorStop(.54, shade(color, .70));
    g.addColorStop(.72, shade(color, .56));
    g.addColorStop(.86, shade(color, 1.08));
    g.addColorStop(1, shade(color, .46));
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    const v = c.createLinearGradient(0, h, 0, 0);
    v.addColorStop(0, 'rgba(0,0,0,.42)');
    v.addColorStop(.30, 'rgba(0,0,0,0)');
    v.addColorStop(.85, 'rgba(255,255,255,.22)');
    v.addColorStop(1, 'rgba(255,255,255,.06)');
    c.fillStyle = v; c.fillRect(0, 0, w, h);
  });
}
// ── dây chun ────────────────────────────────────────────────────────────
// Một vòng băng dẹp: vòng tròn có mặt cắt bo tròn, xây bằng tay để mặt
// cắt nhìn ra được.
//
// `w` là **chiều dày theo bán kính**, `h` là **chiều rộng của dây**. Đây là hai
// chiều khác nhau và phải đúng: dây quấn quanh nắp hũ thì dây **đứng** (rộng
// theo chiều cao, mỏng theo bán kính), còn dây nằm trên mặt bàn thì nằm ngang.
//
// Vòng dây chun thật có **hai đầu dán chồng lên** ở một chỗ: vòng không kín
// hoàn toàn mà có một đoạn nổi lên, nối hai đầu. Không có đoạn chồng thì nhìn
// từ trên xuống nó chỉ là một vòng tròn, đọc ra là vòng nhựa chứ không phải
// dây chun.
//
// setTighten(k): k = 0 là vòng lỏng, k = 1 là vòng siết chặt — siết thì vòng
// nhỏ lại và dải hẹp lại (dây bị kéo thì mỏng đi, đó là điều thật).
export function bandRing({ R = .075, w = .014, h = .006, color = '#c2183a', seed = 3, shrink = .22 } = {}) {
  const AJ = .20;                                    // góc của đoạn hai đầu dán chồng
  const base = roundSection(w / 2, h / 2, Math.min(w, h) * .34, 16);
  const main = arcGeometry(96, base.map(p => p.slice()));
  const lap = arcGeometry(14, base.map(p => p.slice()));
  // Cao su **lỏng** và cao su **đã kéo căng** đều phải **đỏ bão hoà**: dây
  // chun là điểm nhấn của cả phim, một dải nhợt hồng là dải không còn đỏ.
  // Dải căng khác dải lỏng ở **hình dạng** (mỏng đi, vòng nhỏ lại, mép nhăn),
  // không phải ở độ đậm của màu.
  const matLoose = toon(color);
  const matTight = toon(shade(color, .82));
  const mm = mesh(main.g, matLoose, [0, 0, 0]);
  const ml = mesh(lap.g, matLoose, [0, 0, 0]);
  const grp = new THREE.Group(); grp.add(mm, ml);
  const build = k => {
    const rr = R * (1 - shrink * k);                 // siết thì vòng nhỏ lại
    // Kéo căng thì dải **mỏng đi một chút** theo bán kính (vật liệu bị kéo
    // giãn), nhưng **đường kính vòng nhỏ lại nhiều hơn** — nên nhìn thì dải
    // hoá **dày hơn hẳn** so với vòng lỏng. Đây là cách duy nhất để thấy
    // "đã siết" trong ảnh: tấm hình tự canh khung nên đường kính ngoài bị
    // chuẩn hoá, còn **mặt cắt** thì không.
    const kx = 1 - .02 * k, ky = 1 - .03 * k;
    const sec = base.map(([rad, y]) => [rad * kx, y * ky]);
    main.sec = sec;
    lap.sec = sec.map(p => p.slice());
    const mat = k > .04 ? matTight : matLoose;
    mm.material = mat; ml.material = mat;
    // mặt dải **hơi nhăn** khi bị kéo: mép vòng không còn tròn xòe mà gấp nếp
    const wr = k * w * .11;
    fillArc(main, i => ({
      ang: (i / main.nSec) * (Math.PI * 2 - AJ),
      rr: rr + wr * Math.sin(i * .32),
    }));
    fillArc(lap, i => ({
      ang: (Math.PI * 2 - AJ) + (i / lap.nSec) * AJ * 1.9,
      rr: rr + w * .34,                              // đoạn chồng nổi lên ngoài vòng
    }));
  };
  let lastK = -1;
  grp.setTighten = k => {
    const c = clamp(k);
    if (Math.abs(c - lastK) < .02) return;   // không dựng lại mỗi khung
    lastK = c; build(c);
  };
  grp.setTighten(0);
  grp.R = R;
  return grp;
}

// Một dải dây chun thẳng nằm ngang (đo ở bàn): dải **mềm** — hơi cong, hai
// đầu hơi quay, và ở một đầu có đoạn hai đầu dán chồng lên. Một thanh thẳng
// cứng, vuông vức, đọc ra là que kem hay thước nhựa, không phải dây chun.
// `pivot`: 'left' giữ đầu trái tại chỗ, 'top' giữ đầu trên tại chỗ — đầu ấy là đầu ghim vào.
export function bandStrip({ len = .5, w = .016, h = .008, color = '#c2183a', pivot = 'center' } = {}) {
  const grp = new THREE.Group();
  const bow = Math.min(.006, h * .9);                 // dải hơi cong về phía trên
  const pts = [];
  for (let i = 0; i <= 10; i++) {
    const u = i / 10, x = (u - .5) * len;
    pts.push(new THREE.Vector3(x, bow * (1 - Math.pow(2 * u - 1, 2)), Math.pow(2 * u - 1, 3) * w * .20));
  }
  const m = ribbonMesh(new THREE.CatmullRomCurve3(pts), new THREE.Vector3(0, 0, 1), w, h, toon(color), { n: 36 });
  grp.add(m);
  // đoạn chồng ở đầu phải: hai đầu dán dính lên nhau, nằm ngay trên dải
  const lp = [];
  for (let i = 0; i <= 8; i++) {
    const u = i / 8;
    lp.push(new THREE.Vector3(len / 2 - len * .21 + u * len * .18,
      h * .5 + h * .40 + bow * .45, w * .06 * (1 - u)));
  }
  const lap = ribbonMesh(new THREE.CatmullRomCurve3(lp), new THREE.Vector3(0, 0, 1), w * .95, h * .8, toon(color), { n: 14 });
  grp.add(lap);
  grp.setLen = k => {
    const s = clamp(k, .2, 3);
    grp.scale.x = s;
    grp.position.x = pivot === 'left' ? len * s / 2 : 0;
  };
  grp.len = len;
  grp.mesh = m;
  return grp;
}

// ── dải treo thẳng đứng (dây chun treo ở đầu trên) ─────────────────────
// Dải dọc theo trục y, gốc ở đỉnh: setLen(k) kéo dài xuống dưới, chiều rộng
// không đổi. (bandStrip là dải nằm ngang, quấn quanh nắp hũ.)
//
// Dải **mềm**: giữa dải eo nhẹ (dây chun bị kéo thì eo), và mép trên **gập vòng
// qua đầu ghim**. Đầu ghim là một đĩa nhỏ dẹt, mũi kim **chĩa xuống** —
// một cây nhọn chĩa lên trên đầu dải thì đọc ra là cây bút chì, không phải
// ghim. Dải cũng có dấu vết xuyên ghim ở chỗ bị ghim.
export function strap({ len = .19, w = .020, t = .009, color = '#c2183a', pinned = true } = {}) {
  const grp = new THREE.Group();
  // thân dải: từ đỉnh xuống dưới, hơi cong về phía trước
  const bp = [];
  for (let i = 0; i <= 12; i++) {
    const u = i / 12;
    bp.push(new THREE.Vector3(0, -len * u, .002 + .006 * Math.sin(Math.PI * u) + .010 * u * u));
  }
  const body = new THREE.Group();
  body.add(ribbonMesh(new THREE.CatmullRomCurve3(bp), new THREE.Vector3(1, 0, 0), w, t, toon(color), {
    n: 40, widthAt: u => 1 - .22 * Math.sin(Math.PI * u),
  }));
  grp.add(body);
  // mép trên gập vòng: đi lên sau đầu ghim, vòng qua đỉnh, rồi xuống trước
  const fp = [
    new THREE.Vector3(0, .000, .002),
    new THREE.Vector3(0, .008, .001),
    new THREE.Vector3(0, .015, .001),
    new THREE.Vector3(0, .0205, .003),
    new THREE.Vector3(0, .0215, .008),
    new THREE.Vector3(0, .0185, .012),
  ];
  grp.add(ribbonMesh(new THREE.CatmullRomCurve3(fp), new THREE.Vector3(1, 0, 0), w * .92, t * .9, toon(color), { n: 22 }));
  if (pinned) {
    // đầu ghim: đĩa nhỏ dẹt ở trên, mũi kim chĩa xuống
    const HX = 0, HY = .013, HZ = .0065;
    grp.add(mesh(new THREE.CylinderGeometry(.0062, .0062, .0026, 18), toon('#b9bfd0'), [HX, HY, HZ], { rot: [Math.PI / 2, 0, 0] }));
    grp.add(mesh(new THREE.CylinderGeometry(.0018, .0018, .013, 10), toon('#b9bfd0'), [HX, HY - .0075, HZ]));
    grp.add(mesh(new THREE.ConeGeometry(.0018, .007, 10), toon('#b9bfd0'), [HX, HY - .0155, HZ], { rot: [Math.PI, 0, 0] }));
    // dấu vết xuyên ghim qua dải
    grp.add(mesh(new THREE.CircleGeometry(.0026, 12), toon('#8e3a48'), [HX, .001, t / 2 + .0004]));
  }
  grp.setLen = k => {
    const s = clamp(k, .2, 3);
    body.scale.y = s;
  };
  grp.len = len;
  grp.mesh = body.children[0];
  return grp;
}

// ── hũ thủy tinh có nắp ─────────────────────────────────────────────────
export function jar({ R = .052, H = .15, lid = true, lidColor = '#e8e2d4' } = {}) {
  const g = new THREE.Group();
  const glass = toon('#cfe6f2', { transparent: true, opacity: .38 });
  // Thân hũ có **vai** và **cổ**: một thân thẳng như cốc nhựa thì không ai gọi
  // là hũ thủy tinh. Cổ nhỏ hơn nắp, nên nắp vặn **nhô ra** quanh cổ.
  const BODY = H * .68, SH = H * .14, NK = H - BODY - SH;
  g.add(mesh(new THREE.CylinderGeometry(R, R * .97, BODY, 28, 1, true), glass, [0, BODY / 2, 0]));
  g.add(mesh(new THREE.CylinderGeometry(R * .80, R, SH, 28, 1, true), glass, [0, BODY + SH / 2, 0]));
  g.add(mesh(new THREE.CylinderGeometry(R * .80, R * .80, NK, 28, 1, true), glass, [0, BODY + SH + NK / 2, 0]));
  g.add(mesh(new THREE.CircleGeometry(R * .97, 28), toon('#d8ecf6', { transparent: true, opacity: .5 }), [0, .004, 0], { rot: [-Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.TorusGeometry(R * .99, .004, 8, 32), toon('#9fc4d4'), [0, .006, 0], { rot: [Math.PI / 2, 0, 0] }));
  // vành miệng hũ: nơi nắp vặn vào
  g.add(mesh(new THREE.TorusGeometry(R * .81, .0035, 8, 28), toon('#9fc4d4'), [0, H - .002, 0], { rot: [Math.PI / 2, 0, 0] }));
  // kính mờ: một vệt sương ở thân dưới, đọc ra là thuỷ tinh chứ không phải nhựa
  g.add(mesh(new THREE.CylinderGeometry(R * 1.006, R * .975, BODY * .38, 28, 1, true), toon('#eef8fd', { transparent: true, opacity: .22 }), [0, BODY * .32, 0]));
  const lg = new THREE.Group(); g.add(lg);
  if (lid) {
    const TOP = H + .016;                                  // mặt trên của nắp
    lg.add(mesh(new THREE.CylinderGeometry(R * 1.02, R * 1.02, .016, 28), toon(lidColor), [0, H + .008, 0]));
    lg.add(mesh(new THREE.TorusGeometry(R * 1.015, .0035, 8, 32), toon('#d6cfbe'), [0, H + .006, 0], { rot: [Math.PI / 2, 0, 0] }));
    // **ren xoắn ốc trên mặt nắp**: một nắp vặn có ren, và mặt nắp là chỗ
    // người xem nhìn thấy đầu tiên. Ren là một **đường xoắn nổi** chạy từ
    // tâm ra mép; một đĩa trơn là đĩa úp lên, không phải nắp.
    const sp = [];
    for (let i = 0; i <= 110; i++) {
      const u = i / 110, a = u * Math.PI * 2 * 1.9;
      const rr = R * (.14 + .80 * u);
      sp.push(new THREE.Vector3(Math.cos(a) * rr, TOP + .0014, Math.sin(a) * rr));
    }
    lg.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sp), 150, .0026, 6, false), toon(shade(lidColor, .88))));
    // **núm nắp** ở tâm: nắp thật có núm để mở
    lg.add(mesh(new THREE.CylinderGeometry(R * .13, R * .15, .004, 20), toon(shade(lidColor, .93)), [0, TOP + .0018, 0]));
  }
  g.lid = lg;
  g.R = R; g.H = H;
  return g;
}

// ── máy sấy tóc ─────────────────────────────────────────────────────────
// Thân hình, vò vò, tay cầm, lưới lọc. Miệng máy (chỗ hơi nóng đi ra) ở +x.
export function hairdryer({ color = '#f04462' } = {}) {
  const g = new THREE.Group();
  const body = mesh(new THREE.CylinderGeometry(.048, .055, .17, 24), toon(color), [0, .05, 0], { rot: [0, 0, Math.PI / 2] });
  g.add(body);
  g.add(mesh(new THREE.CylinderGeometry(.05, .05, .012, 24), toon('#2b2f36'), [.086, .05, 0], { rot: [0, 0, Math.PI / 2] }));
  // lưới lọc ở đuôi: một đĩa tối có **nan thẳng** dày đặc, đọc ra là lưới lọc
  // chứ không phải mấy nan hoa toả như bánh xe.
  g.add(mesh(new THREE.CircleGeometry(.046, 24), toon('#20242e'), [-.092, .05, 0], { rot: [0, -Math.PI / 2, 0] }));
  for (let i = 0; i < 11; i++) {
    g.add(mesh(rbox(.0022, .0022, .086, .001), toon('#8d93a5'), [-.094, .05 + (i - 5) * .0078, 0]));
  }
  g.add(mesh(new THREE.TorusGeometry(.046, .004, 8, 24), toon('#8d93a5'), [-.093, .05, 0], { rot: [0, Math.PI / 2, 0] }));
  // tay cầm: nối liền thân bằng một cái cổ, có công tắc trên tay cầm
  const h = mesh(new THREE.CapsuleGeometry(.019, .105, 4, 14), toon('#3a3f55'), [-.01, -.068, 0]);
  h.rotation.z = .18; g.add(h);
  g.add(mesh(new THREE.CylinderGeometry(.026, .026, .03, 14), toon('#3a3f55'), [.008, -.006, 0], { rot: [0, 0, .18] }));
  // công tắc nguồn (trắng) và nút chỉnh nhiệt (đỏ) — máy sấy tóc có hai nút
  g.add(mesh(rbox(.012, .020, .008, .002), toon('#e8e2d4'), [-.004, -.038, .017], { rot: [0, 0, .18] }));
  g.add(mesh(rbox(.010, .014, .007, .002), toon('#e0465c'), [-.014, -.066, .016], { rot: [0, 0, .18] }));
  // vòng dây treo ở gáy tay cầm: máy sấy tóc treo ở móc, không treo ở dây
  g.add(mesh(new THREE.TorusGeometry(.011, .0026, 6, 18), toon('#3a3f55'), [-.030, -.106, 0], { rot: [0, 0, .18] }));
  // dây điện: một sợi dài chạy ra khỏi đuôi tay cầm, uốn cong
  const cord = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.035, -.125, 0),
    new THREE.Vector3(-.070, -.150, .02),
    new THREE.Vector3(-.110, -.140, -.01),
    new THREE.Vector3(-.140, -.120, .01),
  ]);
  g.add(mesh(new THREE.TubeGeometry(cord, 30, .0045, 6, false), toon('#2b2f36')));
  g.add(mesh(new THREE.CylinderGeometry(.011, .013, .05, 12), toon('#2b2f36'), [-.035, -.115, 0]));
  // miệng máy: vành sáng và **lưới nan thẳng** (nan ngang + nan dọc). Mấy vòng
  // xoắn ốc trơn thì đọc ra là quạt sưởi, không phải máy sấy tóc.
  g.add(mesh(new THREE.TorusGeometry(.048, .004, 8, 24), toon('#e8e2d4'), [.095, .05, 0], { rot: [0, Math.PI / 2, 0] }));
  g.add(mesh(new THREE.CircleGeometry(.046, 24), toon('#20242e'), [.0925, .05, 0], { rot: [0, Math.PI / 2, 0] }));
  for (let i = 0; i < 7; i++) {
    g.add(mesh(rbox(.0022, .0022, .088, .001), toon('#8d93a5'), [.0935, .05 + (i - 3) * .0125, 0]));
  }
  for (let i = 0; i < 3; i++) {
    g.add(mesh(rbox(.0022, .088, .0022, .001), toon('#8d93a5'), [.0945, .05, (i - 1) * .028]));
  }
  const mouth = new THREE.Object3D(); mouth.position.set(.150, .05, 0); g.add(mouth);
  // **nón dẹp**: miệng máy có một vòi dẹt để hướng gió. Miệng tròn trục ngang
  // nhìn thẳng vào ống kính đọc ra là "một cái máy đang nhìn mình", không phải
  // một máy sẽ thổi vào vật.
  g.add(mesh(rbox(.052, .030, .070, .008), toon('#20242e'), [.118, .05, 0]));
  g.add(mesh(rbox(.048, .022, .058, .006), toon('#0f1218'), [.132, .05, 0]));
  // khe thoát gió dọc thân: vài đường hở mảnh trên vỏ
  for (let i = 0; i < 3; i++) {
    g.add(mesh(rbox(.052, .0035, .012, .0012), toon('#8d93a5'), [.02, .05 + .049, -.02 + i * .02]));
  }
  g.mouth = mouth;
  return g;
}

// ── dây thép mỏng (đối chứng) ────────────────────────────────────────────
// Trục của sợi là trục x của nhóm; setLen(k) kéo dài theo trục đó.
//
// Sợi thép là **đặc**: mặt cắt ở đầu phải là một **hình tròn đặc**, không phải
// một vòng rỗng. Một sợi mảnh mà nhìn thấy miệng ống rỗng thì người xem gọi
// là ống hút, không phải thép — nên hai đầu đều được **bịt kín** bằng mặt cắt.
export function steelWire({ len = .34, r = .0035, color = '#aab3c8' } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Group(); g.add(body);      // mọi thứ kéo dài theo trục x
  // Thân: trụ tròn, **hơi cong** như sợi thép thật (cong rất nhẹ ở giữa).
  const geo = new THREE.CylinderGeometry(r, r, len, 16); geo.rotateZ(Math.PI / 2);
  {
    const p = geo.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) {
      const u = p[i] / (len / 2);
      p[i + 1] += .005 * (1 - u * u);                 // võng nhẹ, hai đầu vẫn thẳng hàng
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
  }
  body.add(mesh(geo, toon(color), [0, 0, 0]));
  // Hai đầu: **mặt cắt đặc** — một đĩa tròn khép kín, không khoét rỗng.
  const capR = new THREE.CircleGeometry(r, 16); capR.rotateY(Math.PI / 2);
  body.add(mesh(capR, toon(shade(color, .88)), [len / 2, 0, 0]));
  const capL = new THREE.CircleGeometry(r, 16); capL.rotateY(-Math.PI / 2);
  body.add(mesh(capL, toon(shade(color, .88)), [-len / 2, 0, 0]));
  // Vệt sáng dài dọc thân: một sợi nhỏ hơn nằm nổi trên mặt → đọc ra là kim
  // loại. Vệt sáng **không chạm tới hai đầu**: chạm tới đầu thì cái vòng sáng ở
  // mép cắt đọc ra là miệng ống rỗng.
  const hg = new THREE.CylinderGeometry(r * .24, r * .24, len * .86, 6); hg.rotateZ(Math.PI / 2);
  body.add(mesh(hg, toon('#eef1f8'), [0, r * .58, 0]));
  g.setLen = k => { const s = clamp(k, .2, 3); body.scale.x = s; };
  g.len = len;
  return g;
}

// ── ghim nhỏ (ghim vòng dây chùng xuống mặt bếp) ─────────────────────────
// Ghim có **đầu đĩa nhỏ ở trên**, thân kim mảnh bên dưới và **mũi kim sắc
// chĩa xuống**: đó là cách một ghim dán đứng trên mặt bàn. Ghim có đế tròn
// dày ở dưới và mũi nhọn chĩa lên thì đọc ra là một cọc sắt, không ai gọi là
// ghim.
export function pin({ color = '#b9bfd0', h = .012 } = {}) {
  const g = new THREE.Group();
  // đầu đĩa dẹt ở trên, đường kính lớn hơn thân kim nhiều lần
  g.add(mesh(new THREE.CylinderGeometry(.0062, .0062, .0030, 18), toon(color), [0, h - .0015, 0]));
  // thân kim mảnh
  g.add(mesh(new THREE.CylinderGeometry(.0018, .0018, h - .0035, 10), toon(color), [0, (h - .003) / 2 + .0002, 0]));
  // mũi kim sắc, chĩa xuống
  g.add(mesh(new THREE.ConeGeometry(.0018, .006, 10), toon(color), [0, -.0025, 0], { rot: [Math.PI, 0, 0] }));
  return g;
}

// ── quả cân nhỏ (vật nặng) ───────────────────────────────────────────────
// Quả cân là **một khối liền mạch**: thân trụ đặc, mặt trên phẳng, không có
// nắp rời và không có đường kẻ khe nào — một trụ có nắp úp lên đọc ra là
// bình/lọ kim loại, không phải quả cân. Ba dấu hiệu đọc ra quả cân:
//  · vành **vân sọc (knurl)** gõ xung quanh thân,
//  · mặt trên **phẳng**, có một lỗ nhỏ ở giữa,
//  · một **vòng ren (móc treo)** luồn qua lỗ đó, đứng thẳng trên mặt trên.
export function weight({ R = .022, H = .05, color = '#c9973a' } = {}) {
  const g = new THREE.Group();
  const tex = metalTex(color);
  // Thân: dựng bằng một **khối xoay (lathe)** nên là một miếng liền — không
  // có khe, không có nắp. Mép trên vát nhẹ, chỗ eo ở H*.86 là vai gia công.
  const prof = [
    new THREE.Vector2(0, 0), new THREE.Vector2(R * .95, 0),
    new THREE.Vector2(R, H * .05), new THREE.Vector2(R, H * .74),
    new THREE.Vector2(R * .92, H * .84), new THREE.Vector2(R * .92, H * .96),
    new THREE.Vector2(R * .86, H), new THREE.Vector2(0, H),
  ];
  g.add(mesh(new THREE.LatheGeometry(prof, 30), toon('#ffffff', { map: tex }), [0, 0, 0]));
  // Vân sọc quanh thân: các sọc đứng nhỏ nổi trên bề mặt, như gia công.
  const kn = 18, rib = R * .05;
  for (let i = 0; i < kn; i++) {
    const a = i / kn * Math.PI * 2;
    g.add(mesh(new THREE.BoxGeometry(rib, H * .34, rib * 1.5), toon(shade(color, .80)),
      [Math.cos(a) * R * 1.005, H * .36, Math.sin(a) * R * 1.005], { rot: [0, -a, 0] }));
  }
  // Lỗ ở mặt trên + **vòng ren** luồn qua: một vòng kim loại đứng thẳng, đáy
  // vòng chuim xuống lỗ. Đây là cái treo của một quả cân, không phải quai.
  const eyeR = R * .30, eyeT = R * .075;
  g.add(mesh(new THREE.TorusGeometry(eyeR, eyeT, 8, 22), toon(shade(color, .86)), [0, H + eyeR * .62, 0]));
  g.add(mesh(new THREE.CylinderGeometry(R * .13, R * .15, R * .16, 14), toon(shade(color, .74)), [0, H + R * .05, 0]));
  // miệng lỗ: một vòng tối trên mặt trên, nơi vòng ren đi qua
  g.add(mesh(new THREE.RingGeometry(R * .10, R * .16, 18), toon('#2b2415'), [0, H + .0012, 0], { rot: [-Math.PI / 2, 0, 0] }));
  return g;
}

// ── vòng dây quanh bầu nhiệt kế (hiệu ứng Joule) ────────────────────────
// Một vòng cao su quanh bầu nhiệt kế, một đuôi dây nằm sang trái cho tay nắm.
// Vòng là **dải dẹt** (mặt cắt chữ nhật) như dây chun thật, và nó **nghiêng**:
// đoạn gần máy quay đi qua trước nửa dưới của bầu, đoạn khuất đi sau nửa trên.
// Một vòng nằm ngang quanh bầu thì đọc ra là kính lúp, không phải dây quấn.
// Hai đầu dây dán chồng lên ở một chỗ (đoạn cuối của vòng nằm ngoài vòng).
// setYank(amp, phase): tay giật đuôi dây thì đuôi dây giãn ra rồi co lại;
// tipX(s) là chỗ đầu đuôi dây để tay nắm đúng vào.
export function jouleBand({ R = .030, w = .012, h = .009, tail = .055, color = '#c2183a' } = {}) {
  const g = new THREE.Group();
  const th = 55 * Math.PI / 180;                 // góc nghiêng của mặt phẳng vòng
  const e1 = new THREE.Vector3(1, 0, 0);
  const e2 = new THREE.Vector3(0, -Math.sin(th), Math.cos(th));
  const side = new THREE.Vector3().crossVectors(e1, e2).normalize();
  const pts = [];
  const N = 56;
  for (let i = 0; i <= N; i++) {
    const u = i / N, a = u * Math.PI * 2 * 1.04 + Math.PI / 2;
    const rr = R * (u > .955 ? 1.07 : 1);        // đoạn cuối nằm ngoài: hai đầu dán chồng
    pts.push(new THREE.Vector3()
      .addScaledVector(e1, Math.cos(a) * rr)
      .addScaledVector(e2, Math.sin(a) * rr));
  }
  const hoop = ribbonMesh(new THREE.CatmullRomCurve3(pts), side, w, h, toon(color), { n: 90 });
  g.add(hoop);
  // đuôi dây: tiếp tục từ chỗ hai đầu dán, chạy sang trái, mềm và hơi cong
  const J = pts[pts.length - 1];
  const tg = new THREE.Group(); tg.position.copy(J); g.add(tg);
  const tp = [];
  for (let i = 0; i <= 8; i++) {
    const u = i / 8;
    tp.push(new THREE.Vector3(-tail * u, -tail * .10 * Math.sin(Math.PI * u), -tail * .06 * u));
  }
  const tm = ribbonMesh(new THREE.CatmullRomCurve3(tp), side, w * .92, h * .92, toon(color), { n: 20 });
  tg.add(tm);
  g.R = R; g.tailLen = tail;
  g.setYank = (amp, phase) => {
    const s = 1 + .55 * amp * (.5 + .5 * Math.sin(phase));
    tg.scale.x = s;
  };
  g.stretch = amp => 1 + .55 * amp;
  g.tipX = s => J.x - tail * s;
  return g;
}

// ── thước gỗ ────────────────────────────────────────────────────────────
// `vertical`: bản đứng (mặt có vạch hướng +z, chiều dài theo y) để đọc chiều dài của dây
// đang treo; bản nằm ngang để đo trên mặt bàn.
export function ruler({ len = .9, w = .05, color = '#d9b06a', vertical = false } = {}) {
  // thước đo centimet: len tính bằng mét, vạch mỗi centimet, số mỗi năm centimet
  const marks = (g, W, H, along) => {
    g.fillStyle = color; g.fillRect(0, 0, W, H);
    // vân gỗ: sợi dọc chạy theo chiều dài của thước, phủ **đều suốt thước**.
    // Thước nhựa phẳng một màu thì người xem không gọi nó là thước gỗ.
    const rr = mulberry(31);
    g.save();
    if (along === 'x') {
      for (let i = 0; i < 64; i++) {
        g.fillStyle = 'rgba(120,78,30,' + (.05 + rr() * .10).toFixed(3) + ')';
        const y = rr() * H;
        g.fillRect(0, y, W, 1 + rr() * 3);
      }
    } else {
      for (let i = 0; i < 64; i++) {
        g.fillStyle = 'rgba(120,78,30,' + (.05 + rr() * .10).toFixed(3) + ')';
        const x = rr() * W;
        g.fillRect(x, 0, 1 + rr() * 3, H);
      }
    }
    g.restore();
    // hai mắt gỗ: thước gỗ thật có mắt, và mắt làm vân đọc ra là vân
    g.fillStyle = 'rgba(96,58,18,.30)';
    for (const k of [.30, .72]) {
      const cx = along === 'x' ? W * k : W * .5, cy = along === 'x' ? H * .42 : H * k;
      g.beginPath(); g.ellipse(cx, cy, along === 'x' ? 16 : 9, along === 'x' ? 7 : 16, 0, 0, 6.3); g.fill();
    }
    g.fillStyle = 'rgba(90,50,20,.18)';
    if (along === 'x') g.fillRect(0, 0, W, 6); else g.fillRect(0, 0, 6, H);
    const cm = Math.round(len * 100), N = cm, step = (along === 'x' ? W : H) / N;
    // vạch: mỗi centimet một vạch, nửa centimet một vạch nhỏ hơn
    for (let i = 0; i <= N * 2; i++) {
      const u = i / 2, big = i % 10 === 0, mid = i % 2 === 0;
      const L = big ? 44 : (mid ? 26 : 15);
      g.fillStyle = '#3a2410';
      // bản đứng: số đếm từ dưới lên (0 ở đáy thước) và vạch nằm ở mép phải,
      // về phía quả cân treo cạnh thước.
      if (along === 'x') g.fillRect(u * step, 0, big ? 4 : 2, L);
      else g.fillRect(W - L, (N - u) * step, L, big ? 4 : 2);
    }
    // số **to**: số nhỏ mảnh thì sau một giây không đọc được, và thước không có
    // số đọc được thì chỉ là một thanh có vạch. Số nằm **cách vạch** một khoảng
    // rõ ràng — dính sát mép vạch thì đọc ra là số dính bậy.
    g.font = '800 54px "Be Vietnam Pro"'; g.fillStyle = '#3a2410';
    g.textBaseline = 'middle';
    for (let i = 0; i <= N; i += 5) {
      if (along === 'x') {
        g.textAlign = i === 0 ? 'left' : 'center';
        g.fillText(String(i), i === 0 ? 5 : i * step, 92);
      } else {
        g.textAlign = 'center';
        g.save();
        g.translate(48, Math.max(34, Math.min(H - 34, (N - i) * step)));
        g.rotate(-Math.PI / 2);
        g.fillText(String(i), 0, 0);
        g.restore();
      }
    }
    // hai đầu thước **vát**: mép cắt thẳng trông như thanh nhựa
    g.fillStyle = 'rgba(70,40,12,.22)';
    if (along === 'x') { g.fillRect(0, 0, 5, H); g.fillRect(W - 5, 0, 5, H); }
    else { g.fillRect(0, 0, W, 5); g.fillRect(0, H - 5, W, 5); }
    // lỗ treo ở đầu thước: thước gỗ thật có một lỗ khoét tròn
    g.fillStyle = 'rgba(60,36,12,.55)';
    if (along === 'x') { g.beginPath(); g.arc(W - 22, H * .74, 9, 0, 6.3); g.fill(); }
    else { g.beginPath(); g.arc(W * .5, 24, 9, 0, 6.3); g.fill(); }
  };
  const grp = new THREE.Group();
  if (vertical) {
    const tex = canvasTex(128, 1024, (g, W, H) => marks(g, W, H, 'y'));
    grp.add(mesh(new THREE.PlaneGeometry(w, len), toon('#ffffff', { map: tex }), [0, 0, .005]));
    grp.add(mesh(rbox(w, len, .008, .002), toon('#c9a05c'), [0, 0, 0]));
    // **đế**: thước đứng phải có chỗ dựng, không thì nó lơ lửng giữa không trắng.
    // Đế nhỏ và nông để không cấn vào chân đế của cột đồng hồ đứng cạnh nó.
    grp.add(mesh(rbox(w * 1.35, .012, w * .75, .003), toon('#b98f4e'), [0, -len / 2 + .006, 0]));
  } else {
    const tex = canvasTex(1024, 128, (g, W, H) => marks(g, W, H, 'x'));
    grp.add(mesh(rbox(len, .008, w, .002), toon('#c9a05c'), [0, .002, 0]));
    grp.add(mesh(new THREE.PlaneGeometry(len, w), toon('#ffffff', { map: tex }), [0, .0065, 0], { rot: [-Math.PI / 2, 0, 0] }));
  }
  grp.len = len;
  return grp;
}

// ── nhiệt kế (cột thủy ngân trong ống kính) ────────────────────────────
// setTemp(k): k = 0 → hai mươi độ, k = 1 → sáu mươi độ. Cột thật sự dâng lên.
export function thermometer({ len = .22, color = '#17b8dd' } = {}) {
  const g = new THREE.Group();
  const glass = toon('#dfeef7', { transparent: true, opacity: .34 });
  g.add(mesh(new THREE.CylinderGeometry(.011, .011, len, 16), glass, [0, len / 2, 0]));
  g.add(mesh(new THREE.SphereGeometry(.019, 18, 12), glass, [0, .004, 0]));
  // **bầu thủy ngân**: đỏ, nằm trong bầu kính — không có bầu đỏ thì ống trong
  // suốt trông như một ống thuỷ tinh rỗng, không phải nhiệt kế.
  g.add(mesh(new THREE.SphereGeometry(.011, 14, 10), toon('#e0465c'), [0, .004, 0]));
  // cột thủy ngân: chạy lên **trong** ống, từ bầu lên trên
  const col = mesh(new THREE.CylinderGeometry(.0072, .0072, .1, 12), toon(color), [0, .05, 0]);
  g.add(col);
  // kính mờ: một lớp ngoài mờ, đọc ra là thủy tinh chứ không phải nhựa
  g.add(mesh(new THREE.CylinderGeometry(.0125, .0125, len * .96, 16, 1, true), toon('#eef8fd', { transparent: true, opacity: .20 }), [0, len / 2 + .006, 0]));
  // thang số bên hông: một **dải tối** có vạch trắng và số, **dán sát ống**.
  // Đứng rời xa thì nó thành một tấm bảng treo, không còn là thang của nhiệt kế.
  // Nền tối thì chữ không bị cháy trắng dưới ánh sáng mạnh, và số đọc được sau một giây.
  const scale = canvasTex(160, 1024, (c, W, H) => {
    c.fillStyle = '#1b2233'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#eef3fb';
    c.font = '800 52px "Be Vietnam Pro"'; c.textBaseline = 'middle';
    // số nằm trong khoảng **có lề** ở cả hai đầu: số cuối cùng mà dính sát
    // mép thì bị cắt, và một thang đo mất số cuối thì đọc sai ngay.
    for (let i = 0; i <= 40; i++) {
      const y = H - 26 - (i / 40) * (H - 52), big = i % 10 === 0;
      c.fillRect(W - (big ? 104 : 60), y - (big ? 4 : 3), big ? 104 : 60, big ? 8 : 5);
      if (big) c.fillText(String(i), 12, y);
    }
    // đơn vị: **°C** — không có nó thì cái số chỉ là một con số vô nghĩa.
    c.font = '800 40px "Be Vietnam Pro"';
    c.fillText('°C', W - 52, 34);
  });
  g.add(mesh(new THREE.PlaneGeometry(.024, len - .04), toon('#ffffff', { map: scale }), [.0132, len / 2 + .012, 0]));
  g.add(mesh(new THREE.CylinderGeometry(.026, .026, .01, 18), toon('#3a4a5a'), [0, -.002, 0]));
  g.setTemp = k => {
    const h = .05 + .55 * (len - .06) * clamp(k);
    col.scale.y = h / .1; col.position.y = h / 2;
  };
  g.setTemp(0);
  return g;
}

// ── đồng hồ đo lực (lực kế) ─────────────────────────────────────────────
// Mặt thang tròn có kim; hai cửa sổ nhỏ để thấy lò xo bên trong. setReading(k) xoay kim.
//
// Mặt đồng hồ **không vẽ bằng texture**: một texture trên đĩa tròn bị cháy thành
// trắng dưới ánh sáng mạnh, và một cái đồng hồ mà không đọc được vạch thì không
// phải đồng hồ. Vạch là **hình thật** (những thanh nhỏ), nên đọc được ở mọi
// cường độ sáng. Chỉ huy hiệu đơn vị là texture, và nó có **nền tối** — nền tối
// thì không bị cháy, chữ vẫn còn đọc được.
export function dynamometer({ R = .075, label = '' } = {}) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(R, R, .018, 40), toon('#e6dcc2'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.TorusGeometry(R, .006, 8, 40), toon('#3a3f55'), [0, 0, .004], { rot: [0, 0, 0] }));
  // thang: từ -120° đến +120°, vạch lớn mỗi năm vạch. Góc 0 là kim chỉ lên
  // (12 giờ), nên vị trí vạch trên mặt đồng hồ là (sin a, cos a).
  for (let i = 0; i <= 20; i++) {
    const a = (-120 + i * 12) * Math.PI / 180, big = i % 5 === 0;
    const r0 = R * (big ? .56 : .62), r1 = R * .86;
    g.add(mesh(rbox(big ? .0045 : .003, r1 - r0, .0025, .001), toon('#171a2b'),
      [Math.sin(a) * (r0 + r1) / 2, Math.cos(a) * (r0 + r1) / 2, .011], { rot: [0, 0, -a] }));
  }
  // Huy hiệu đơn vị: nền tối, chữ sáng. Lực kế đo **newton** thì trên mặt
  // chỉ được ghi một đơn vị: ghi thêm "kg" (hay "kgf") bên dưới là **sai đơn
  // vị**, và người xem sẽ đọc thành một cái cân đo cân.
  const badge = canvasTex(160, 120, (c, W, H) => {
    c.fillStyle = '#171a2b'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#ffe9c8'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = '800 58px "Be Vietnam Pro"';
    c.fillText('N', W / 2, H * (label ? .34 : .5));
    if (label) {
      c.font = '800 34px "Be Vietnam Pro"';
      c.fillText(label, W / 2, H * .76);
    }
  });
  g.add(mesh(new THREE.PlaneGeometry(R * .40, R * .30), toon('#ffffff', { map: badge }), [0, -R * .40, .011]));
  // kim
  const nd = new THREE.Group(); nd.position.z = .014; g.add(nd);
  nd.add(mesh(rbox(.004, R * .78, .003, .001), toon('#f04462'), [0, R * .34, 0]));
  nd.add(mesh(new THREE.CylinderGeometry(.008, .008, .008, 12), toon('#171a2b'), [0, 0, .002], { rot: [Math.PI / 2, 0, 0] }));
  // Số của thang lực, in quanh cung: một vòng texture **có nền trong suốt**,
  // nên chỉ con số mới hiện. Không có số thì mặt đồng hồ đọc ra là **la bàn**.
  const dial = canvasTex(512, 512, (c, W, H) => {
    c.clearRect(0, 0, W, H);
    c.fillStyle = '#2b2233';
    c.font = '800 46px "Be Vietnam Pro"';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
      const a = (-120 + i * 48) * Math.PI / 180, rr = W * .275;
      c.fillText(String(i * 10), W / 2 + Math.sin(a) * rr, H / 2 - Math.cos(a) * rr);
    }
  });
  const ring = mesh(new THREE.RingGeometry(R * .40, R * .92, 56, 1),
    toon('#ffffff', { map: dial, transparent: true, depthWrite: false }), [0, 0, .012]);
  g.add(ring);
  // vỏ lực kế: một ống kim loại **phẳng** sau mặt đồng hồ, như lòng so. Mặt
  // đồng hồ trơn đứng trên chân đế thì đọc ra là la bàn đặt trên bàn.
  g.add(mesh(new THREE.CylinderGeometry(R * .90, R * .90, .028, 28), toon('#8d93a5'), [0, 0, -.022], { rot: [Math.PI / 2, 0, 0] }));
  // móc dưới: hình chữ **J** rõ ràng, **to** — một vòng tròn nhỏ ở đáy thì
  // người xem đọc ra là đĩa cân của cân bàn, không ai gọi là lực kế.
  const hook = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -R - .002, 0),
    new THREE.Vector3(0, -R - .028, 0),
    new THREE.Vector3(.007, -R - .048, 0),
    new THREE.Vector3(.021, -R - .043, 0),
    new THREE.Vector3(.020, -R - .025, 0),
  ]);
  g.add(mesh(new THREE.TubeGeometry(hook, 30, .0046, 8, false), toon('#8a6a2a')));
  // **vòng treo trên đỉnh**: lực kế treo được thì trên đỉnh có một vòng móc.
  g.add(mesh(new THREE.TorusGeometry(R * .17, .0055, 8, 20), toon('#8d93a5'), [0, R + R * .12, 0]));
  g.add(mesh(new THREE.CylinderGeometry(R * .13, R * .17, R * .16, 16), toon('#8d93a5'), [0, R * .96, 0]));
  // kim: gốc của kim là hướng lên (12 giờ); vạch ở góc a nằm ở hướng (sin a, cos a),
  // tức lệch 90°−a so với hướng lên — nên kim phải xoay ngược số góc đó.
  g.setReading = k => { nd.rotation.z = (120 - 240 * clamp(k)) * Math.PI / 180; };
  g.setReading(0);
  g.R = R;
  return g;
}

// ── chuỗi polymer ─────────────────────────────────────────────────────────
// Một sợi chuỗi là dãy hạt nối. k = 0: bị kéo thẳng (hạt nằm trên một đường thẳng);
// k = 1: tự nhiên (hạt cuộn thành xoắn ốc). Mỗi sợi có hạt giống riêng nên hình khác nhau.
//
// Hạt **xen kẽ lớn–nhỏ**: hạt nhỏ chính là mắt nối giữa hai hạt lớn, như xích
// hạt thật. Hạt đều tăm tắp thì đọc ra là một chuỗi bi, không phải dây xích.
// `spiral`: 0 = cuộn thành ống quanh trục x; 1 = cuộn thành **xoắn ốc nằm
// phẳng**, bán kính thu dần về tâm, nhìn là một cuộn dây đặt trên mặt bàn.
export function chain({ n = 30, bead = .0125, len = 1.0, turns = 4.5, rad = .055, color = '#f7bd27', seed = 1, spread = 0, spiral = 0 } = {}) {
  // Hạt: quả cầu **kim loại** (có vệt sáng), to nhỏ xen kẽ.
  const im = new THREE.InstancedMesh(new THREE.SphereGeometry(bead, 16, 12), toon('#ffffff', { map: metalTex(color) }), n);
  // hạt nhỏ không đổ bóng: bóng của chúng trên mặt cắt thành một màn nhiễu đen, đọc như vết bẩn
  im.castShadow = false;
  im.receiveShadow = false;
  im.frustumCulled = false;
  // **Móc nối**: giữa hai hạt liền nhau có một vòng khuyên nhỏ. Không có móc
  // nối thì đây chỉ là một chuỗi hạt đeo, không phải dây xích hạt nối.
  const link = new THREE.InstancedMesh(
    new THREE.TorusGeometry(bead * .62, bead * .20, 6, 12),
    toon('#ffffff', { map: metalTex(color) }), Math.max(1, n - 1));
  link.castShadow = false; link.receiveShadow = false; link.frustumCulled = false;
  const grp = new THREE.Group(); grp.add(im, link);
  const rnd = mulberry(seed);
  const phase = rnd() * 6.28, tilt = (rnd() - .5) * 1.2, wob = .4 + rnd() * .8, sz = .8 + rnd() * .5;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const e = new THREE.Euler(tilt, phase * .3, phase * .2);
  const Z = new THREE.Vector3(0, 0, 1), dir = new THREE.Vector3(), qa = new THREE.Quaternion();
  const pos = [];                                   // vị trí hạt, để đặt móc nối
  let coil = 1;
  // setCoil phải **dựng lại** các hạt: đặt coil rồi mới đổi hình thì hình vẫn
  // là cái cũ, và hai trạng thái (cuộn / kéo thẳng) ra cùng một ảnh.
  let lastT = 0;
  grp.setCoil = k => { coil = clamp(k); if (grp.update) grp.update(lastT); };
  grp.update = (t) => {
    lastT = t;
    q.setFromEuler(e);
    pos.length = 0;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      if (spiral > 0) {
        // **xoắn ốc nằm phẳng** trên mặt bàn: bán kính thu dần về tâm, đầu
        // ngoài tự do. Một cuộn quanh trục x thì nhìn từ trên là một đường
        // sóng, không phải một cuộn dây. Cuộn phải có **rãnh giữa các vòng**:
        // vòng nào sát vòng nào thì đọc ra là một đĩa, không phải một cuộn.
        const a = phase + u * turns * Math.PI * 2;
        const rr = rad * (1 - .55 * u);
        const w = .004 * wob;
        p.set(
          Math.cos(a) * rr + Math.sin(t * 1.7 + u * 9 + phase) * w,
          bead * .88 + .0015 * Math.sin(a * 2),
          Math.sin(a) * rr + Math.cos(t * 1.9 + u * 8 + phase) * w,
        );
        const sc = sz * (i % 2 ? .58 : 1) * (1 + .06 * Math.sin(t * 3 + i));
        m4.compose(p, q, s.set(sc, sc, sc));
        im.setMatrixAt(i, m4);
        pos.push([p.x, p.y, p.z, sc]);
        continue;
      }
      // sợi bị **kéo thẳng** thì các hạt phải tách ra: nếu chúng dính liền
      // nhau thì sợi thẳng đọc ra là một thanh trơn, không phải một dây xích
      // đang bị kéo. `spread` là phần giãn ra của khoảng cách giữa các hạt.
      const sx = (u - .5) * len * (1 + spread * (1 - coil));
      const a = phase + u * turns * Math.PI * 2;
      // bán kính cuộn: xoắn ốc nằm phẳng thì thu dần về tâm
      const rr = rad * (1 - .62 * spiral * u * coil);
      const cx = sx, cy = Math.sin(a) * rr, cz = Math.cos(a) * rr;
      // hai đầu sợi **thẳng**: đầu nào bị ghim (hay bị tay nắm) thì phải là một
      // hạt xác định, không phải một đoạn xoắn ốc. Nhịp cuộn nên bằng 0 ở hai
      // đầu rồi mới lên hẳn ở giữa.
      const edge = Math.min(1, Math.min(u, 1 - u) / .16);
      const lx = sx, ly = lerp(0, cy, coil * edge), lz = lerp(0, cz, coil * edge);
      // chuỗi luôn rung nhẹ: nó không đứng yên
      const w = .006 * wob * (1 - .6 * coil);
      p.set(lx + Math.sin(t * 1.7 + u * 9 + phase) * w, ly + Math.sin(t * 2.1 + u * 7 + phase) * w, lz + Math.cos(t * 1.9 + u * 8 + phase) * w);
      // hạt xen kẽ lớn–nhỏ: hạt nhỏ là mắt nối giữa hai hạt lớn
      const sc = sz * (i % 2 ? .56 : 1) * (1 - .12 * coil) * (1 + .06 * Math.sin(t * 3 + i));
      m4.compose(p, q, s.set(sc, sc, sc));
      im.setMatrixAt(i, m4);
      pos.push([p.x, p.y, p.z, sc]);
    }
    im.instanceMatrix.needsUpdate = true;
    // Móc nối: một vòng khuyên nằm **giữa** hai hạt, mặt vòng vuông góc với
    // sợi — đúng cách một mắt xích luồn qua hai hạt.
    for (let i = 1; i < n; i++) {
      const a = pos[i - 1], b = pos[i];
      dir.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      const d = dir.length() || 1;
      dir.multiplyScalar(1 / d);
      p.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
      qa.setFromUnitVectors(Z, dir);
      qa.premultiply(q);
      const sc = (a[3] + b[3]) / 2 * 1.05;
      m4.compose(p, qa, s.set(sc, sc, sc));
      link.setMatrixAt(i - 1, m4);
    }
    link.instanceMatrix.needsUpdate = true;
  };
  grp.im = im; grp.n = n;
  grp.update(0);
  return grp;
}

// ── móc liên kết chéo (móc lưu hoá giữ hai chuỗi) ───────────────────────
// Một **móc nối**: vòng **mở** (hình chữ C, khe hở ở bên) có một thanh ngang
// đan chéo ở khe hở, móc qua hai sợi chuỗi song song chạy xuyên qua lỗ vòng.
// Một vòng kín, đặc, không có chuỗi nào đi qua, đọc ra là nhẫn hay vòng vàng —
// không ai gọi đó là móc nối.
// `through`: hướng của hai sợi chuỗi đi qua — 'z' là hướng sâu khung hình,
// 'x' là hướng chạy ngang (như các sợi trong mạng chuỗi của chương hai).
export function crosslink({ r = .012, color = '#9a5be5', through = 'z' } = {}) {
  const g = new THREE.Group();
  // Màu **vàng kim loại** (màu của mạng polymer trong phim), nhưng tô bằng vân
  // kim loại nên nó đọc ra là **móc thép mạ vàng**, không phải nhựa hổ phách.
  const A0 = Math.PI * .30, SW = Math.PI * 1.40;   // khe hở quay sang phải
  // Thân móc: một vòng **mảnh** (dây thép dẹt), không phải khối dày. Khối dày
  // đọc ra là nam châm móng ngựa.
  const ring = mesh(new THREE.TorusGeometry(r, r * .115, 8, 34, SW), toon('#ffffff', { map: metalTex(color) }), [0, 0, 0], { rot: [0, 0, A0] });
  g.add(ring);
  const ex = Math.cos(A0) * r, ey = Math.sin(A0) * r;              // mép trên
  const fx = Math.cos(A0 + SW) * r, fy = Math.sin(A0 + SW) * r;    // mép dưới
  // **Bản lề**: một trụ nhỏ nối hai mép vòng ở đầu trên — đó là bản lề của móc.
  g.add(mesh(new THREE.CylinderGeometry(r * .14, r * .14, r * .40, 8), toon('#ffffff', { map: metalTex(shade(color, .78)) }), [ex, ey, 0], { rot: [Math.PI / 2, 0, 0] }));
  // **Lưỡi gài**: một thanh cong nằm trong khe hở, từ bản lề xuống mũi, mũi
  // cong khum vào mép dưới. Một thanh thẳng cắt ngang khe thì rời rạc, đọc
  // ra là que đặt vô.
  const gateCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(ex, ey, r * .06),
    new THREE.Vector3((ex + fx) / 2 * 1.02, 0, r * .08),
    new THREE.Vector3(fx * 1.03, fy * 1.05, r * .04),
  ]);
  g.add(mesh(new THREE.TubeGeometry(gateCurve, 18, r * .105, 7, false), toon('#ffffff', { map: metalTex(shade(color, .88)) })));
  // Hai chuỗi hạt, **mỗi chuỗi một vòng khuyên** luồn qua thân móc: một
  // khuyên ở thanh trên, một khuyên ở thanh dưới. Hai chuỗi tách hẳn nhau
  // (trên và dưới) — dính vào nhau thì đọc ra là một chuỗi.
  const beadR = r * .135, sp = r * .46;
  const strand = (yy, khuyenY) => {
    // vòng khuyên: mặt vòng vuông góc với thanh móc nó luồn qua
    g.add(mesh(new THREE.TorusGeometry(r * .19, r * .055, 6, 16), toon('#ffffff', { map: metalTex(shade(color, .70)) }),
      [0, khuyenY, 0], { rot: [0, Math.PI / 2, 0] }));
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue;
      const z = i * sp;
      if (Math.abs(z) < r * .42) continue;           // chỗ khoét trống của khuyên
      g.add(mesh(new THREE.SphereGeometry(beadR, 12, 9), toon('#ffffff', { map: metalTex(color) }),
        [0, yy + (i % 2 ? beadR * .18 : 0), z]));
    }
  };
  strand(r * 1.06, r);         // chuỗi trên: khuyên luồn qua thanh trên
  strand(-r * 1.06, -r);       // chuỗi dưới: khuyên luồn qua thanh dưới
  if (through === 'x') g.rotation.y = Math.PI / 2;   // hai sợi chạy ngang theo trục x
  g.rotation.x = .55;                                // nghiêng: hai sợi thấy rõ từ mặt
  return g;
}

// ── luồng hơi nóng từ máy sấy tóc ────────────────────────────────────────
// Dùng flow() của rig: một vệt khí liên tục từ miệng máy tới vật bị nung.
export function heatFlow(from, to, { color = '#ffb37a', n = 70, rate = .55, opacity = .30, lift = .08, size = .03 } = {}) {
  const f = flow(from, to, { color, n, rate, opacity, lift, size, seed: 7 });
  return f;
}

// ── vệt nhiệt chạy dọc một sợi dây (bên trong sợi dây) ──────────────────
// Một dải sáng mỏng trượt dọc theo trục x của sợi dây: vùng nhiệt đi qua.
export function heatFront({ len = 1.2, w = .5, color = '#ff8a3d' } = {}) {
  const g = new THREE.Group();
  // mặt phẳng **đối diện máy quay**, trượt dọc trục x của sợi dây: vệt nhiệt
  // phải thấy được như một màn sáng quét ngang mạng chuỗi. Mặt phẳng đứng
  // vuông góc trục x thì máy ở phía trước chỉ thấy **mép** của nó — vệt nhiệt
  // biến mất đúng lúc người xem cần thấy nó.
  // mép của vệt phải **mềm**: một hình chữ nhật cứng trong khung đọc ra là
  // một tấm kính màu, không phải hơi nóng. Vì vậy nó có texture mờ dần ở bốn
  // cạnh, và cộng thêm (additive) nên chỗ mờ gần như không để lại dấu.
  const tex = canvasTex(64, 256, (c, cw, ch) => {
    const gr = c.createLinearGradient(0, 0, cw, 0);
    gr.addColorStop(0, 'rgba(255,120,40,0)');
    gr.addColorStop(.42, 'rgba(255,170,90,.55)');
    gr.addColorStop(.5, 'rgba(255,215,150,1)');
    gr.addColorStop(.58, 'rgba(255,170,90,.55)');
    gr.addColorStop(1, 'rgba(255,120,40,0)');
    c.fillStyle = gr; c.fillRect(0, 0, cw, ch);
    c.globalCompositeOperation = 'destination-in';
    const vg = c.createLinearGradient(0, 0, 0, ch);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(.30, 'rgba(0,0,0,1)');
    vg.addColorStop(.72, 'rgba(0,0,0,1)');
    vg.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = vg; c.fillRect(0, 0, cw, ch);
  });
  const m = mesh(new THREE.PlaneGeometry(w, len), new THREE.MeshBasicMaterial({
    map: tex, color: new THREE.Color(color).multiplyScalar(1.6), transparent: true, opacity: .28,
    depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
  }), [0, 0, 0], { rot: [0, 0, 0] });
  m.castShadow = m.receiveShadow = false;
  m.renderOrder = 6;
  fxLayer(m); g.add(m);
  g.plane = m;
  g.set = (x, k) => { m.position.x = x; m.material.opacity = .10 + .34 * clamp(k); };
  return g;
}

// ── danh sách vật cho vòng chấm đạo cụ ─────────────────────────────────
// Mỗi mục là một vật một mình trên nền trơn, nhìn từ ba phía. Tên là cái
// gọi của người xem, không phải tên hàm trong mã.
export const PROPS = {
  'vòng dây chun dẹt, hai đầu dán giao nhau': () => bandRing({ R: .083, w: .014, h: .009, color: '#c2183a' }),
  'vòng dây chun đã siết chặt, vòng nhỏ lại và dày lên': () => {
    const g = bandRing({ R: .083, w: .014, h: .009, color: '#c2183a' });
    g.setTighten(1);
    return g;
  },
  'dải dây chun thẳng nằm ngang, mặt cắt chữ nhật dẹp': () => bandStrip({ len: .32, w: .026, h: .006, color: '#d8566a' }),
  'dải dây chun treo thẳng đứng, đầu trên ghim cố định': () => strap({ len: .16, w: .020, t: .009, color: '#c2183a' }),
  'hũ thủy tinh có nắp vặn, nắp có răng cưa viền': () => jar({ R: .068, H: .19, lidColor: '#e6dfcd' }),
  'máy sấy tóc có tay cầm, lưới lọc ở đuôi và miệng máy': () => hairdryer({ color: '#f04462' }),
  'sợi thép mỏng tròn đặc, một đầu tự do': () => steelWire({ len: .30, r: .004 }),
  'ghim nhỏ có đầu kim nhọn': () => pin({ color: '#b9bfd0' }),
  'quả cân đồng hình trụ có móc treo ở nắp': () => weight({ R: .023, H: .05, color: '#c9973a' }),
  'vòng cao su quấn quanh một bầu tròn, một đuôi dây nằm sang trái': () => {
    const g = jouleBand({ R: .030, tail: .055, color: '#c2183a' });
    // bầu tròn ở giữa: dây quấn quanh một vật, chứ không phải một vòng trống.
    // Bầu **đục**, không loé: một quả cầu bóng như mặt kính thì đọc ra là kính
    // lúp, không phải bầu nhiệt kế.
    g.add(mesh(new THREE.SphereGeometry(.027, 20, 14), toon('#b9c4d2'), [0, 0, 0]));
    return g;
  },
  'thước gỗ nằm ngang, vạch centimet và số mỗi năm centimet': () => ruler({ len: .24, w: .05 }),
  'thước gỗ đứng, số đếm từ đáy lên trên': () => ruler({ len: .42, w: .07, vertical: true }),
  'nhiệt kế thủy ngân trong ống kính, có cột và thang số bên hông': () => thermometer({ len: .28 }),
  'đồng hồ đo lực mặt thang tròn có số, kim đỏ và móc treo dưới': () => dynamometer({ R: .055 }),
  'dây xích hạt nối cuộn thành xoắn ốc': () => chain({ n: 46, bead: .0085, turns: 2.6, rad: .105, color: '#f7bd27', seed: 11, spiral: 1 }),
  'dây xích hạt nối bị kéo thẳng, hạt nằm trên một đường thẳng': () => {
    const g = chain({ n: 30, bead: .012, len: .72, turns: 6, rad: .050, color: '#f7bd27', seed: 11 });
    g.setCoil(0);
    return g;
  },
  'vòng móc nối chéo, nối hai chuỗi với nhau': () => crosslink({ r: .040, color: '#f0c76a', through: 'x' }),
};

