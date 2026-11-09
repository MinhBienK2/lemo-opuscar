// props.js — vật riêng của tập 06: tờ giấy (khô / ướt / đã rách), bát nước, khăn lau,
// sợi cellulose, nhóm hydroxyl, mối liên kết hydrogen, phân tử nước, bộ kẹp giấy,
// giá đo, đồng hồ đo lực, dải giấy thử, đồng hồ độ ẩm, mẻ giấy khăn giấy, túi giấy bao bì.
//
// Vài dựa trên hình dạng thật:
//  · tờ giấy là một **mặt cong nhẹ** nằm trên quầy, không phải một hộp mỏng; mép
//    giấy hơi cong lên ở cả bốn góc;
//  · tờ giấy ướt thì **nhăn** và có một vệt ẩm **nâu ấm** loang ở giữa, và vệt ẩm đó
//    **loang dần** khi nước thấm vào — vệt ẩm không bao giờ xanh, không tròn trơn;
//  · tờ giấy bị rách thì mép rách là một **đường gấp khúc** chạy dọc, không phải
//    một đường thẳng cắt ngang;
//  · sợi cellulose là một **sợi tròn** (ống có thể tích), hai đầu **nhọn** như đầu sợi
//    bị túm, chứ không phải mép cắt vuông; các nhóm hydroxyl mọc **trên mặt sợi**
//    (hai bên trên/dưới), chìm nửa vào sợi, chứ không trôi lơ lửng;
//  · mối liên kết hydrogen là một **móc cong** thật, hai đầu móc cắm vào hai nhóm
//    hydroxyl; đồng hồ đo lực và đồng hồ độ ẩm đều là **mặt thang tròn có kim**.
// Mọi vật đều là hàm thuần của t, nên dựng lại được bất cứ lúc nào.
import * as THREE from 'three';
import { toon, mesh, rbox, canvasTex, PAL, clamp, lerp, mulberry, fxLayer, glowMat, surface, TEX } from '../../../../rig/kit.js';

// ── trợ giá dựng hình ──────────────────────────────────────────────────

// Một que tròn nối hai điểm: dùng cho đầu sợi, móc thép, sợi con lòa xòe.
function rod(a, b, r, mat, r2 = r * .7) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b);
  const d = new THREE.Vector3().subVectors(B, A);
  const len = Math.max(1e-5, d.length());
  const m = mesh(new THREE.CylinderGeometry(r2, r, len, 7), mat,
    [(A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2]);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  return m;
}

// Vân dọc theo sợi: texture trắng có sợi sáng/sẫm chạy ngang, nhân lên màu sợi.
function grainTex(seed) {
  return canvasTex(256, 32, (c, w, h) => {
    const r = mulberry(seed * 7 + 3);
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 110; i++) {                 // sợi mảnh chạy dọc sợi
      c.strokeStyle = `rgba(150,120,80,${.08 + r() * .20})`;
      c.lineWidth = .6 + r() * 1.4;
      const y = r() * h, x = r() * w;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + 30 + r() * 110, y + (r() - .5) * 2); c.stroke();
    }
    for (let i = 0; i < 30; i++) {                  // mảng sáng bắt ánh đèn
      c.fillStyle = `rgba(255,255,255,${.10 + r() * .30})`;
      c.fillRect(r() * w, r() * h, 20 + r() * 90, 1 + r() * 2);
    }
  });
}

// Ống uốn dọc **local X**: bán kính nhỏ dần ở hai đầu (đầu sợi bị túm, không phải
// mặt cắt vuông), uốn nhẹ trong chiều sâu và cong nhẹ lên trên.
// `write(k)` phồng to bán kính — đó là cái "sợi hút nước rồi to ra".
function tubeGeo(len, r0, { nu = 30, nv = 10, bend = .008, sag = .007, seed = 1, tip = .055 } = {}) {
  const centre = u => [
    (u - .5) * len,
    bend * Math.sin(u * 5.7 + seed) * Math.sin(Math.PI * u),
    sag * Math.sin(Math.PI * u) * (1 + .2 * Math.sin(u * 4.1 + seed * 2)),
  ];
  const rad = u => {
    const e = clamp(Math.min(u, 1 - u) / tip);
    return r0 * (.05 + .95 * Math.pow(e, .5));
  };
  const g = new THREE.BufferGeometry();
  const cnt = (nu + 1) * (nv + 1);
  const pos = new Float32Array(cnt * 3);
  const nor = new Float32Array(cnt * 3);
  const uvs = new Float32Array(cnt * 2);
  const cen = new Float32Array(cnt * 3);
  const dir = new Float32Array(cnt * 3);            // hướng bán kính
  const uu = new Float32Array(cnt);
  const idx = [];
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const a = i * (nv + 1) + j, b = a + nv + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  g.setIndex(idx);
  const T = new THREE.Vector3(), N = new THREE.Vector3(), B = new THREE.Vector3();
  const Z = new THREE.Vector3(0, 0, 1), h = 1e-3;
  for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
    const n = i * (nv + 1) + j, u = i / nu, a = j / nv * Math.PI * 2;
    const c = centre(u);
    const c0 = centre(Math.max(0, u - h)), c1 = centre(Math.min(1, u + h));
    T.set(c1[0] - c0[0], c1[1] - c0[1], c1[2] - c0[2]).normalize();
    N.crossVectors(T, Z).normalize();              // ≈ local Y
    B.crossVectors(N, T).normalize();              // ≈ local Z
    const rx = Math.cos(a) * N.x + Math.sin(a) * B.x;
    const ry = Math.cos(a) * N.y + Math.sin(a) * B.y;
    const rz = Math.cos(a) * N.z + Math.sin(a) * B.z;
    cen[n * 3] = c[0]; cen[n * 3 + 1] = c[1]; cen[n * 3 + 2] = c[2];
    dir[n * 3] = rx; dir[n * 3 + 1] = ry; dir[n * 3 + 2] = rz;
    uu[n] = u;
    uvs[n * 2] = u; uvs[n * 2 + 1] = j / nv;
  }
  const write = scale => {
    for (let n = 0; n < cnt; n++) {
      const r = rad(uu[n]) * scale;
      pos[n * 3] = cen[n * 3] + dir[n * 3] * r;
      pos[n * 3 + 1] = cen[n * 3 + 1] + dir[n * 3 + 1] * r;
      pos[n * 3 + 2] = cen[n * 3 + 2] + dir[n * 3 + 2] * r;
      // pháp tuyến của ống tròn chính là hướng bán kính: đặt thẳng, khỏi có
      // vết seam ở chỗ khép kín
      nor[n * 3] = dir[n * 3]; nor[n * 3 + 1] = dir[n * 3 + 1]; nor[n * 3 + 2] = dir[n * 3 + 2];
    }
    g.attributes.position.needsUpdate = true;
    g.attributes.normal.needsUpdate = true;
  };
  write(1);
  return { geo: g, rad, centre, write };
}

// ── tờ giấy ─────────────────────────────────────────────────────────────

// Vệt ẩm trên giấy: một vệt **nâu ấm** loang, viền mềm và méo, không tròn trơn.
// Vệt ẩm phải đi theo nếp nhăn của tờ giấy, nên nó là **con** của nửa tờ giấy.
function wetPatchTex(seed = 3) {
  return canvasTex(256, 256, (g, w, h) => {
    const r = mulberry(seed);
    g.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    // viền méo: bán kính đổi theo góc, không phải hình tròn
    g.beginPath();
    for (let i = 0; i <= 48; i++) {
      const a = i / 48 * Math.PI * 2;
      const rr = w * (.30 + .085 * Math.sin(3 * a + seed) + .055 * Math.sin(7 * a + seed * 2.3)
        + .035 * Math.sin(11 * a + seed * .7));
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr * .88;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath();
    const gr = g.createRadialGradient(cx, cy, w * .05, cx, cy, w * .42);
    gr.addColorStop(0, 'rgba(118,82,48,.80)');
    gr.addColorStop(.52, 'rgba(132,94,56,.54)');
    gr.addColorStop(.84, 'rgba(146,108,66,.22)');
    gr.addColorStop(1, 'rgba(152,114,72,0)');
    g.fillStyle = gr; g.fill();
    // rìa vệt sẫm hơn, lổm nhổm: viền ẩm không sắc cạnh
    for (let k = 0; k < 60; k++) {
      const a = r() * 7, d = w * (.24 + r() * .12);
      g.fillStyle = `rgba(104,72,42,${.10 + r() * .22})`;
      g.beginPath();
      g.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .88, 2 + r() * 7, 2 + r() * 5, a, 0, 7);
      g.fill();
    }
  });
}

// Một tờ giấy nằm trên mặt phẳng XZ.
//  · `tear`: tờ chia làm hai nửa, mép rách là đường gấp khúc; `setTear(k)` mở khe.
//  · `setWet(k)`: vệt ẩm nâu loang ra và giấy tối đi (vẫn là giấy kem).
//  · `setWrinkle(k)`: giấy nhăn dần — nếp nhăn là hình dạng của tờ giấy, nó phải
//    **nặn ra** chứ không phải đổi màu. Nhăn lên rồi mới rách, và người xem phải
//    thấy cái nhăn đó trước khi thấy vết rách.
//  · `setPress(k)`: ngón tay ấn giữa tờ — nếp hăn **tỏa ra** từ giữa tờ và một
//    vòng ẩm nhỏ (dấu ngón tay).
export function paperSheet({ w = .21, h = .28, tear = false, seed = 3, wrinkle = 0 } = {}) {
  const g = new THREE.Group();
  const mat = toon('#ffffff', { map: TEX.sheet(), side: THREE.DoubleSide });
  // mép giấy cong lên ở cả bốn góc: một tờ giấy nằm trên quầy không phẳng tuyệt đối
  // (v bị đảo để **pháp tuyến của tờ giấy hướng lên**: tờ giấy nằm ngang mà pháp
  // tuyến chỉ xuống thì bóng của chính nó đè lên nó, tờ giấy chết màu)
  const shape = (u, v, W) => {
    const x = (u - .5) * w, z = (.5 - v) * h;
    const edge = Math.pow(Math.abs(u - .5) * 2, 3.4) * .011 + Math.pow(Math.abs(v - .5) * 2, 3.4) * .009;
    const wr = W * (.0016 * Math.sin(u * 16.3 + seed) + .0012 * Math.sin(v * 22.7 + seed * 2)
      + .0009 * Math.sin(u * 39.1 + v * 12.7));
    // nhấc tờ giấy lên khỏi mặt quầy: nếp nhăn có phần âm, tờ giấy sẽ chui xuống
    // quầy và mặt quầy ló ra thành những lỗ nâu trên tờ giấy
    return [x, .0045 + edge + wr, z];
  };
  // đường mép rách: gấp khúc chạy dọc tờ giấy
  const tearAt = v => .5 + .034 * Math.sin(v * 8.3 + seed) + .017 * Math.sin(v * 19.7 + seed * 3);
  const halves = [];
  const patchMat = toon('#ffffff', { map: wetPatchTex(seed), transparent: true, opacity: 0, depthWrite: false });
  // dựng lại một mặt cong từ hàm hình dạng: giấy nhăn thì phải dựng lại mặt cong
  const rebuild = (geo, f, W) => {
    const p = geo.attributes.position, uv = geo.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const [x, y, z] = f(uv.getX(i), uv.getY(i), W);
      p.setXYZ(i, x, y, z);
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
  };
  const addHalf = (f, withPatch = true) => {
    const m = mesh(surface(16, 26, (u, v) => f(u, v, 0)), mat, [0, 0, 0]);
    // vệt ẩm là **con** của nửa tờ giấy: nó đi theo nửa tờ khi mép rách mở ra.
    // Chỉ **một** nửa mang vệt: tờ giấy ướt có một vệt nước, không phải hai.
    if (withPatch) {
      const patch = mesh(surface(10, 16, (u, v) => {
        const p = f(u, v, 0);
        return [p[0], p[1] + .0006, p[2]];
      }), patchMat, [0, 0, 0], { cast: false, recv: false });
      m.add(patch);
    }
    g.add(m);
    halves.push({ m, f, patch: withPatch ? m.children[0] : null });
    return m;
  };
  if (tear) {
    addHalf((u, v, W) => shape(u * tearAt(v), v, W), true);
    addHalf((u, v, W) => shape(tearAt(v) + (1 - tearAt(v)) * u, v, W), false);
  } else {
    addHalf((u, v, W) => shape(u, v, W));
  }
  // vệt ẩm phải nằm trên nếp nhăn: độ cao của nó bám theo độ nhăn
  const patchOf = h => h.patch;
  const patchF = h => (u, v, W) => {
    const p = h.f(u, v, W);
    return [p[0], p[1] + W * .0037 + .0006, p[2]];
  };
  // ── dấu ấn: nếp hăn tỏa ra từ giữa tờ + vòng ẩm của ngón tay ──
  // Nếp hăn là **hình dạng** của tờ giấy, nên nó nằm trên mặt tờ theo đúng nếp:
  // mảnh nếp mang **toạ độ tờ** trong uv, để khi tờ nhăn (setWrinkle) mảnh nếp
  // được dựng lại đúng nhịp với tờ chứ không bị trải phẳng.
  const creaseMat = toon('#9c8a68', { transparent: true, opacity: 0, depthWrite: false });
  const pressMat = toon('#7a5330', { transparent: true, opacity: 0, depthWrite: false });
  const creases = new THREE.Group();
  // lưới có uv = toạ độ tờ: đổi nếp giấy thì mảnh này đi theo
  const sheetGrid = (nu, nv, uvAt) => {
    const geo = new THREE.BufferGeometry();
    const cnt = (nu + 1) * (nv + 1);
    const pos = new Float32Array(cnt * 3);
    const uvs = new Float32Array(cnt * 2);
    const idx = [];
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
      const a = i * (nv + 1) + j, b = a + nv + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(idx);
    const uvA = geo.attributes.uv;
    for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
      const n = i * (nv + 1) + j;
      const [su, sv] = uvAt(i / nu, j / nv);
      uvA.setXY(n, su, sv);
    }
    uvA.needsUpdate = true;
    return geo;
  };
  // vòng ẩm của ngón tay: một vòng nhỏ ở giữa tờ
  const ringGeo = sheetGrid(26, 2, (u, v) => {
    const a = u * Math.PI * 2, rr = lerp(.34, 1, v) * .013;
    return [.5 + Math.cos(a) * rr / w, .5 + Math.sin(a) * rr / h];
  });
  const ring = mesh(ringGeo, pressMat, [0, 0, 0], { cast: false, recv: false });
  // các nếp tỏa ra: mỗi nếp là một dải hẹp chạy từ giữa tờ ra mép
  const strips = [];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI + .35 + (i % 3) * .12;
    const L = .30 + (i % 4) * .06;
    const geo = sheetGrid(9, 1, (u, v) => {
      const d = L * u;
      const cu = .5 + Math.cos(a) * d, cv = .5 + Math.sin(a) * d;
      const wv = .010 * (1 - .85 * u) * (v - .5) * 2;
      return [cu - Math.sin(a) * wv, cv + Math.cos(a) * wv];
    });
    const strip = mesh(geo, creaseMat, [0, 0, 0], { cast: false, recv: false });
    creases.add(strip); strips.push(strip);
  }
  creases.add(ring);
  g.add(creases);
  const creaseF = (u, v, W) => {                      // nếp hăn đi theo nếp giấy
    const p = shape(u, v, W);
    return [p[0], p[1] + .0007, p[2]];
  };
  const ringF = (u, v, W) => {
    const p = shape(u, v, W);
    return [p[0], p[1] + .0009, p[2]];
  };
  g.mat = mat;
  g.setWet = k => {
    const c = clamp(k);
    mat.color.setScalar(1 - .10 * c);                // giấy ướt vẫn là giấy kem
    patchMat.opacity = c;
    for (const h of halves) if (patchOf(h)) patchOf(h).scale.setScalar(.6 + .4 * c);
  };
  g.setTear = k => {
    const c = clamp(k);
    for (const h of halves) { h.m.position.x = .028 * c; h.m.position.y = .006 * c; h.m.rotation.z = -.05 * c; }
  };
  g.setWrinkle = k => {
    const W = Math.max(0, k);
    for (const h of halves) {
      rebuild(h.m.geometry, h.f, W);
      if (patchOf(h)) rebuild(patchOf(h).geometry, patchF(h), W);
    }
    for (const s of strips) rebuild(s.geometry, creaseF, W);
    rebuild(ring.geometry, ringF, W);
  };
  g.setPress = k => {
    const c = clamp(k);
    creaseMat.opacity = .55 * c;
    pressMat.opacity = .62 * c;
    creases.visible = c > .01;
  };
  g.setWet(0); g.setTear(0); g.setWrinkle(wrinkle); g.setPress(0);
  return g;
}

// Vết nứt: **khe tối** giữa hai mép giấy bị rách, có đầu sợi chìa ra ở mỗi mép.
// Nứt không cắt sợi — nó là chỗ hai sợi không còn bám vào nhau nữa.
export function crack({ len = .30, w = .040, seed = 4 } = {}) {
  const g = new THREE.Group();
  const r = mulberry(seed);
  // mép rách: hai môi lệch nhau, mép trên lệch phải, mép dưới lệch trái
  const jag = u => .5 + .30 * Math.sin(u * 31 + seed) + .16 * Math.sin(u * 77 + seed * 3)
    + .10 * Math.sin(u * 11.3 + seed * 5);
  const gTop = u => w * (.12 + .11 * jag(u)) + w * .055;
  const gBot = u => -w * (.12 + .11 * jag(u * 1.17 + 2.1)) - w * .055;
  const lipW = w * 1.25, th = w * .52;
  const paperMat = toon('#e7d8b6', { map: TEX.sheet(), side: THREE.DoubleSide });
  const lipMat = toon('#d9c7a0', { side: THREE.DoubleSide });
  // bên trong khe: tối, nhưng **có sắc độ** (không phải miếng dán đen)
  const innerTex = canvasTex(64, 256, (c, cw, ch) => {
    const q = mulberry(seed + 9);
    const gr = c.createLinearGradient(0, 0, 0, ch);
    gr.addColorStop(0, '#4a3524'); gr.addColorStop(.5, '#2b1e14'); gr.addColorStop(1, '#4a3524');
    c.fillStyle = gr; c.fillRect(0, 0, cw, ch);
    for (let i = 0; i < 220; i++) {
      c.fillStyle = `rgba(${90 + q() * 60 | 0},${60 + q() * 40 | 0},30,${.05 + q() * .16})`;
      c.fillRect(q() * cw, q() * ch, 1 + q() * 3, 1 + q() * 5);
    }
  });
  const innerMat = toon('#ffffff', { map: innerTex, side: THREE.DoubleSide });
  for (const s of [1, -1]) {
    const edge = s > 0 ? gTop : gBot;
    // mặt giấy quanh mép rách
    g.add(mesh(surface(34, 3, (u, v) => {
      const x = edge(u) + s * v * lipW;
      return [x, (u - .5) * len, .002 * Math.sin(u * 13 + s)];
    }), paperMat, [0, 0, 0]));
    // thành của mép rách: mép giấy có **dày**, nên nhìn thấy là một mặt chứ không
    // phải một đường cắt trên mặt phẳng
    g.add(mesh(surface(34, 1, (u, v) => [edge(u), (u - .5) * len, -v * th]), lipMat, [0, 0, 0]));
  }
  // lòng khe: mặt trong tối của vết rách
  g.add(mesh(surface(34, 3, (u, v) => {
    const x = lerp(gBot(u), gTop(u), v);
    return [x, (u - .5) * len, -th - .001];
  }), innerMat, [0, 0, 0]));
  // đầu sợi chìa ra ở mỗi mép: giấy bị rách thì kéo theo cả những đầu sợi
  const fibMat = toon('#d8c093'), fibMat2 = toon('#bda57a');
  for (const s of [1, -1]) {
    const edge = s > 0 ? gTop : gBot;
    for (let i = 0; i < 16; i++) {
      const u = (i + .5) / 16 + (r() - .5) * .04;
      const L = w * (.22 + r() * .38);
      const a = [edge(u) - s * w * .02, (u - .5) * len, -th * (.3 + r() * .5)];
      const b = [a[0] - s * L * (.5 + r() * .6), a[1] + (r() - .5) * L * .8, a[2] + (r() - .5) * L * .5];
      g.add(rod(a, b, w * .028, r() < .4 ? fibMat2 : fibMat));
    }
  }
  return g;
}

// ── bát nước và khăn lau ────────────────────────────────────────────────

// Bát nước: một cái bát sâu có chân đế, trong đó mặt nước phẳng.
// Mặt nước là một đĩa phẳng có gợn nhẹ — nếu dùng hình cầu thì đọc ra là một
// viên bi, không phải nước trong bát.
export function waterBowl({ R = .10, color = '#f4ede0' } = {}) {
  const g = new THREE.Group();
  const H = R * .62, t = R * .06;
  const prof = [[0, .012], [R * .36, .012], [R * .38, 0], [R * .44, 0], [R * .45, .03], [R * .7, H * .25],
    [R * .92, H * .65], [R, H], [R - t * .6, H + t * .3], [R - t, H - t * .2], [R * .87, H * .6],
    [R * .65, H * .22], [R * .38, t + .03], [0, t + .03]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(mesh(new THREE.LatheGeometry(prof, 44), toon(color, { side: THREE.DoubleSide }), [0, 0, 0]));
  g.add(mesh(new THREE.TorusGeometry(R * .985, R * .022, 8, 48), toon(PAL.red), [0, H - R * .06, 0], { rot: [Math.PI / 2, 0, 0] }));
  const wy = H * .74;
  const wtex = canvasTex(256, 256, (c, w, h) => {
    const r = mulberry(21);
    c.fillStyle = '#4f7fb8'; c.fillRect(0, 0, w, h);
    for (let k = 0; k < 26; k++) {
      c.strokeStyle = `rgba(200,230,255,${.05 + r() * .12})`; c.lineWidth = 2 + r() * 4;
      c.beginPath(); c.arc(r() * w, r() * h, 10 + r() * 60, 0, 7); c.stroke();
    }
  });
  // mặt nước nằm **trong** thành bát: bán kính nhỏ hơn thành trong tại độ cao
  // này, và mép nước **meniscus** dâng lên chỗ chạm thành
  const wR = R * .885;
  const water = mesh(new THREE.CircleGeometry(wR, 44), toon('#ffffff', { map: wtex }), [0, wy, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  g.add(water);
  g.add(mesh(new THREE.TorusGeometry(wR, R * .030, 8, 44), toon('#5c93c9'), [0, wy + R * .012, 0], { rot: [Math.PI / 2, 0, 0], cast: false }));
  g.H = H; g.water = water;
  return g;
}

// Khăn lau **vắt trên miệng bát**: một đầu nằm trong bát (chạm mặt nước), một
// đầu treo ngoài miệng bát. Vải phải **mềm** và **gấp đúng chỗ**: chỗ gấp nằm
// trên vành bát, và khăn **bám vào vành suốt chiều rộng**, không đứng một mình
// như một vòng tròn trắng.
// Toạ độ: cảnh đặt khăn lệch khỏi tâm bát, nên chỗ gấp phải lùi về phía ngoài
// (XF) để nằm đúng vành bát; đầu trong đi xa vào trong bát.
const TOWEL_FOLD = -.046;
export function dishTowel({ w = .17, drop = .16, color = PAL.red } = {}) {
  const tex = canvasTex(256, 256, (c, ww, hh) => {
    c.fillStyle = '#fff0d8'; c.fillRect(0, 0, ww, hh);
    c.fillStyle = color; for (let y = 20; y < hh; y += 70) c.fillRect(0, y, ww, 16);
    c.fillStyle = PAL.navy; for (let y = 44; y < hh; y += 70) c.fillRect(0, y, ww, 5);
  });
  const XF = TOWEL_FOLD;
  // đường gấp của khăn trên mặt phẳng (x = hướng qua vành bát, y = độ cao)
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(XF - .004, -drop * .90, 0),
    new THREE.Vector3(XF - .003, -drop * .55, 0),
    new THREE.Vector3(XF - .001, -drop * .22, 0),
    new THREE.Vector3(XF, 0, 0),                       // gấp trên vành bát
    new THREE.Vector3(XF + .004, -drop * .14, 0),
    new THREE.Vector3(XF + .008, -drop * .30, 0),
    new THREE.Vector3(XF + .011, -drop * .40, 0),     // đầu trong, chạm mặt nước
  ], false, 'catmullrom', .4);
  return mesh(surface(20, 12, (u, v) => {
    const p = path.getPoint(u);
    // vải nhăn: mép khăn run nhẹ, không phải một tấm phẳng
    const ripple = .004 * Math.sin(v * 8.5 + u * 5.2) + .0018 * Math.sin(v * 19 + u * 3);
    return [p.x + ripple * .6, p.y + ripple * .4, (v - .5) * w + ripple];
  }), toon('#ffffff', { map: tex, side: THREE.DoubleSide }), [0, 0, 0]);
}

// ── thế giới bên trong tờ giấy ──────────────────────────────────────────

// Một sợi cellulose: một **ống tròn** dọc local X, hai đầu nhọn như đầu sợi bị
// túm, uốn nhẹ; các nhóm hydroxyl mọc **trên mặt sợi** (hai bên trên/dưới).
// `setSwell(k)`: sợi phồng to ra (bề ngang), các nhóm hydroxyl dãi ra xa nhau.
export function fibre({ len = .46, wid = .026, color = '#f0d79b', seed = 5, groups = 8 } = {}) {
  const g = new THREE.Group();
  const r0 = wid / 2;
  const tb = tubeGeo(len, r0, { bend: len * .014, sag: len * .011, seed });
  const mat = toon(color, { map: grainTex(seed) });
  g.add(mesh(tb.geo, mat, [0, 0, 0]));
  // đầu sợi bị túm: vài sợi con lòa xòe — đầu sợi không phải mặt cắt vuông
  const rnd = mulberry(seed * 3 + 1);
  const frayMat = toon(color, { map: grainTex(seed + 2) });
  for (const s of [-1, 1]) {
    for (let i = 0; i < 2; i++) {
      const L = len * (.028 + rnd() * .032);
      const a = [s * (len / 2 - L * .35), (rnd() - .5) * r0 * .5, (rnd() - .5) * r0 * .5];
      const b = [s * (len / 2 + L * .55), a[1] + (rnd() - .5) * r0, a[2] + (rnd() - .5) * r0];
      g.add(rod(a, b, r0 * .10, frayMat, r0 * .05));
    }
  }
  // các nhóm hydroxyl: mỗi nhóm là **một cụm** (oxy + hydro) chìm nửa vào mặt
  // sợi, mọc lên hai bên trên/dưới; không nhóm nào giống hệt nhau
  const beads = [];
  const rO0 = wid * .098;
  const oGeo = new THREE.SphereGeometry(1, 12, 9);        // dùng chung, đổi kích thước
  const hGeo = new THREE.SphereGeometry(1, 10, 8);
  const oMat = toon('#f4ead2');
  const hMat = toon('#fbfbfb', { emissive: '#6a6a78', emissiveIntensity: .12 });
  for (let i = 0; i < groups; i++) {
    const u = clamp((i + .5) / groups + (rnd() - .5) * (.55 / groups), .05, .95);
    for (const s of [-1, 1]) {
      const rO = rO0 * (.84 + rnd() * .32);
      const bead = new THREE.Group();
      const o = mesh(oGeo, oMat, [0, 0, 0]);
      o.scale.setScalar(rO);
      bead.add(o);
      // hydro nhỏ nằm bên cạnh oxy, hơi nhô ra khỏi mặt sợi
      const a = (rnd() - .5) * 1.6;
      const off = [Math.cos(a) * rO * .95, Math.sin(a) * rO * .95, s * rO * .40];
      const h = mesh(hGeo, hMat, off);
      h.scale.setScalar(rO * .44);
      bead.add(h);
      const c = tb.centre(u), r = tb.rad(u);
      bead.position.set(c[0], c[1], c[2] + s * (r - rO * .45));
      bead.userData = { s, rO, u };
      g.add(bead); beads.push(bead);
    }
  }
  g.beads = beads;
  g.setSwell = k => {
    const c = clamp(k);
    tb.write(1 + .55 * c);
    for (const b of beads) {
      const { s, rO, u } = b.userData;
      const cc = tb.centre(u), r = tb.rad(u) * (1 + .55 * c);
      b.position.set(cc[0], cc[1], cc[2] + s * (r - rO * .45));
    }
  };
  g.setSwell(0);
  return g;
}

// Mối liên kết hydrogen: một **móc cong** thật nối hai nhóm hydroxyl. Khô thì
// vàng, ướt thì chuyển sang xanh — màu là **cái gì đang giữ hai sợi**, nên nó đổi
// theo. Hai đầu móc cắm ngược vào sợi, giữa móc có một quầng sáng nhỏ.
export function bond({ r = .0095, color = '#f7bd27' } = {}) {
  const g = new THREE.Group();
  const R = r * 3.4;                       // tầm với của móc: hai đầu chạm hai nhóm
  const d = r * 2.6;                       // hai đầu cắm vào sợi
  const pts = [
    new THREE.Vector3(R * .87, R * .50, -d),
    new THREE.Vector3(R * .55, R * .92, -d * .4),
    new THREE.Vector3(R * .02, R * 1.02, 0),
    new THREE.Vector3(-R * .52, R * .62, 0),
    new THREE.Vector3(-R * .70, -R * .05, 0),
    new THREE.Vector3(-R * .55, -R * .52, -d * .4),
    new THREE.Vector3(-R * .87, -R * .50, -d),
  ];
  const curve = new THREE.CatmullRomCurve3(pts);
  const mat = toon(color, { emissive: new THREE.Color(color).multiplyScalar(.5) });
  g.add(mesh(new THREE.TubeGeometry(curve, 32, r * .50, 9, false), mat, [0, 0, 0]));
  // quầng sáng nhỏ ở giữa móc: một **vệt sáng mềm**, không phải một quả cầu
  // trơn (quả cầu to có vành trông như hành tinh có vành)
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({
    map: TEX.radial(), color: new THREE.Color(color).multiplyScalar(1.25),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  }));
  // Vệt sáng **nhỏ hơn cả móc**: nó làm móc nổi lên, không phải một quả cầu sáng
  // che kín lỗ hở của móc — móc phải đọc ra là **móc**.
  spr.scale.setScalar(r * 1.7);
  spr.position.copy(curve.getPoint(.5));
  fxLayer(spr);
  g.add(spr);
  const c0 = new THREE.Color(color), c1 = new THREE.Color('#67e8f9');
  g.setWet = k => {
    const c = clamp(k);
    mat.color.copy(c0).lerp(c1, c);
    mat.emissive.copy(c0).lerp(c1, c).multiplyScalar(.35);
    spr.material.color.copy(c0).lerp(c1, c).multiplyScalar(1.25);
  };
  g.setWet(0);
  return g;
}

// Phân tử nước: một nguyên tử oxy (hạt to) và hai nguyên tử hydro (hai hạt nhỏ)
// trên hai que ở góc 104,5°. Hai hydro nằm **trên** oxy (mặt phẳng chứa trục
// đứng) nên khi phân tử quay, hydro vẫn thấy, không bao giờ chui sau oxy.
export function waterMolecule({ R = .012, color = '#67e8f9' } = {}) {
  const g = new THREE.Group();
  const d = R * 1.72;                       // bán kính O–H
  const half = (104.5 / 2) * Math.PI / 180;
  g.add(mesh(new THREE.SphereGeometry(R, 18, 14), toon(color, { emissive: '#0e3a52', emissiveIntensity: .5 }), [0, 0, 0]));
  for (const s of [-1, 1]) {
    const hx = s * d * Math.sin(half), hy = d * Math.cos(half);
    const stick = mesh(new THREE.CylinderGeometry(R * .11, R * .15, d, 8), toon('#e6f4ff'), [hx / 2, hy / 2, 0]);
    stick.rotation.z = Math.atan2(-hx, hy);
    g.add(stick);
    g.add(mesh(new THREE.SphereGeometry(R * .38, 12, 10),
      toon('#ffffff', { emissive: '#8f93a8', emissiveIntensity: .35 }), [hx, hy, 0]));
  }
  return g;
}

// ── bộ đo ở bàn đo ──────────────────────────────────────────────────────

// Bộ kẹp giấy: hai bản hàm sắt ngập vào nhau, có tay cấn. Giữ một đầu dải giấy.
export function paperClamp({ color = '#b9bfd0' } = {}) {
  const g = new THREE.Group();
  for (const s of [-1, 1]) g.add(mesh(rbox(.055, .030, .022, .004), toon(color), [0, s * .019, 0]));
  g.add(mesh(new THREE.CylinderGeometry(.008, .008, .075, 12), toon('#8b93a8'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.CylinderGeometry(.020, .020, .010, 16), toon('#c9973a'), [0, 0, .044], { rot: [Math.PI / 2, 0, 0] }));
  return g;
}

// Giá đo: đế nặng, cột đứng, một vạt ngang ở trên để treo đồng hồ.
export function gaugeStand({ H = .40, color = '#4a5064' } = {}) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(.075, .088, .016, 22), toon('#39405a'), [0, .008, 0]));
  g.add(mesh(new THREE.CylinderGeometry(.012, .015, H, 14), toon(color), [0, H / 2, 0]));
  g.add(mesh(rbox(.016, .016, .16, .003), toon(color), [0, H - .012, .075]));
  g.H = H;
  return g;
}

// Góc quét của kim: từ 210° (hết thang, bên trái) quay ngược qua đỉnh xuống
// -30° (bên phải) — 240°, như mặt thang thật.
const DIAL_A0 = 210 * Math.PI / 180, DIAL_A1 = -30 * Math.PI / 180;

// Mặt thang tròn — dùng chung cho đồng hồ đo lực và đồng hồ độ ẩm.
// Vạch trên thang là **vạch của dụng cụ**, nên số trên thang được vẽ bằng phép
// tính (không phải chữ viết thẳng), và lời kể đọc con số đang chỉ.
// Vạch và số chạy **quanh cả mặt thang** (không chỉ nửa phải), và chữ đơn vị
// nằm **trong** mặt thang, không bị cắt.
function dialFace({ R = .055, majors = 7, labels = [], unit = '', color = '#fdf6e6', ink = '#252d50' } = {}) {
  return canvasTex(512, 512, (g, w, h) => {
    const cx = w / 2, cy = h / 2;
    g.fillStyle = color; g.beginPath(); g.arc(cx, cy, w * .48, 0, 7); g.fill();
    g.strokeStyle = ink; g.lineWidth = 7; g.beginPath(); g.arc(cx, cy, w * .465, 0, 7); g.stroke();
    const Rr = w * .375, step = (DIAL_A0 - DIAL_A1) / (majors - 1);
    // vạch nhỏ giữa hai vạch lớn
    for (let i = 0; i < (majors - 1) * 4; i++) {
      const a = DIAL_A0 - (i + .5) * step / 4;
      g.strokeStyle = ink; g.lineWidth = 4;
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * Rr, cy - Math.sin(a) * Rr);
      g.lineTo(cx + Math.cos(a) * Rr * .90, cy - Math.sin(a) * Rr * .90);
      g.stroke();
    }
    // vạch lớn + số ở mọi vạch lớn
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '700 30px "Be Vietnam Pro", sans-serif';
    for (let i = 0; i < majors; i++) {
      const a = DIAL_A0 - i * step;
      const ca = Math.cos(a), sa = Math.sin(a);
      g.strokeStyle = ink; g.lineWidth = 9;
      g.beginPath();
      g.moveTo(cx + ca * Rr, cy - sa * Rr);
      g.lineTo(cx + ca * Rr * .78, cy - sa * Rr * .78);
      g.stroke();
      if (labels[i] !== undefined) {
        g.fillStyle = ink;
        g.fillText(String(labels[i]), cx + ca * Rr * .63, cy - sa * Rr * .63);
      }
    }
    // đơn vị đo, đặt dưới tâm mặt đồng hồ — **trong** mặt thang
    g.fillStyle = ink; g.font = '700 40px "Be Vietnam Pro", sans-serif';
    g.fillText(String(unit), cx, cy + w * .175);
  });
}

// Đồng hồ đo lực: mặt thang tròn, kim đỏ có trục ở tâm, móc treo dưới, và
// **vòng treo trên** (lực kế thật có cả hai: vòng để treo, móc để tải).
// `setLoad(k)`: kim chạy trên cung thang, k = 0 là không tải, k = 1 là hết thang.
export function dynamometer({ R = .055, color = '#fdf6e6' } = {}) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(R, R, .022, 40), toon('#39405a'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.CircleGeometry(R, 44), toon('#ffffff', { map: dialFace({ R, color, majors: 7, labels: [0, 2, 4, 6, 8, 10, 12], unit: 'N' }) }), [0, 0, .012]));
  g.add(mesh(new THREE.TorusGeometry(R * 1.03, R * .08, 10, 40), toon('#4a5064'), [0, 0, 0]));
  const needle = new THREE.Group();
  // kim là một **thanh bắt đầu ở tâm**, có trục (đĩa tối + nắp) ở chính giữa
  needle.add(mesh(rbox(R * .78, .008, .005, .001), toon(PAL.red), [R * .40, 0, .018]));
  needle.add(mesh(new THREE.CylinderGeometry(R * .13, R * .13, .009, 20), toon('#252d50'), [0, 0, .017], { rot: [Math.PI / 2, 0, 0] }));
  needle.add(mesh(new THREE.CylinderGeometry(R * .055, R * .055, .014, 16), toon('#c9973a'), [0, 0, .023], { rot: [Math.PI / 2, 0, 0] }));
  g.add(needle);
  // vòng treo trên: một **vòng thật** để móc dải giấy vào (vòng nằm đứng, song
  // song mặt thang, nên dải giấy luồn qua được)
  const ringY = R + .014;
  g.add(mesh(new THREE.TorusGeometry(R * .19, R * .036, 10, 26), toon('#8b93a8'), [0, ringY, 0]));
  // móc dưới: một móc cong thật, không phải một vòng nằm ngang
  const hookPts = [
    new THREE.Vector3(0, -R - .002, 0),
    new THREE.Vector3(0, -R - .014, 0),
    new THREE.Vector3(R * .11, -R - .020, 0),
    new THREE.Vector3(R * .17, -R - .012, 0),
    new THREE.Vector3(R * .14, -R - .003, 0),
  ];
  g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hookPts), 20, R * .030, 7, false), toon('#c9973a'), [0, 0, 0]));
  g.ringY = ringY;
  g.needle = needle;
  g.setLoad = k => { needle.rotation.z = lerp(DIAL_A0, DIAL_A1, clamp(k)); };
  g.setLoad(0);
  return g;
}

// Đồng hồ độ ẩm: mặt thang tròn có kim, đứng trên một chân nhỏ.
// `setRH(rh)`: kim chỉ độ ẩm tương đối (0..100).
export function hygrometer({ R = .042, color = '#fdf6e6' } = {}) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(R, R, .020, 36), toon('#39405a'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.CircleGeometry(R, 40), toon('#ffffff', { map: dialFace({ R, color, majors: 6, labels: [0, 20, 40, 60, 80, 100], unit: '%' }) }), [0, 0, .011]));
  g.add(mesh(new THREE.TorusGeometry(R * 1.05, R * .10, 10, 36), toon('#39405a'), [0, 0, 0]));
  const needle = new THREE.Group();
  needle.add(mesh(rbox(R * .72, .006, .004, .001), toon('#2a9db0'), [R * .36, 0, .016]));
  needle.add(mesh(new THREE.CylinderGeometry(R * .14, R * .14, .008, 18), toon('#252d50'), [0, 0, .015], { rot: [Math.PI / 2, 0, 0] }));
  needle.add(mesh(new THREE.CylinderGeometry(R * .06, R * .06, .012, 14), toon('#c9973a'), [0, 0, .020], { rot: [Math.PI / 2, 0, 0] }));
  g.add(needle);
  g.add(mesh(new THREE.CylinderGeometry(.030, .034, .014, 18), toon('#4a5064'), [0, -R - .006, 0]));
  g.needle = needle;
  g.setRH = rh => { needle.rotation.z = lerp(DIAL_A0, DIAL_A1, clamp(rh / 100)); };
  g.setRH(50);
  return g;
}

// Dải giấy thử: một dải giấy dài, mỏng, một đầu đã kẹp. `setWet(k)`: giấy sẫm
// màu và nhăn lên — dải giấy ướt **không còn phẳng**, và đó là điều nhìn thấy
// được của nó.
// Dải giấy gồm **hai đoạn** vì nó phải đứt được: `setBreak(k)` là **đoạn dưới**
// (phần buộc vào lực kế) gãy ra, quay quanh **chỗ gãy** — đoạn trên vẫn nằm
// trong kẹp. Nếu đoạn nào đứt thì phải là đoạn dưới: giấy đứt ở chỗ bị kéo.
// Đầu dưới cuộn thành **trục giấy** (không phải đĩa xám) và có **móc thép** móc
// vào vòng treo của lực kế.
export function paperStrip({ len = .26, wid = .030, seed = 7 } = {}) {
  const g = new THREE.Group();
  const mat = toon('#ffffff', { map: TEX.sheet(), side: THREE.DoubleSide });
  const yAt = u => .0016 * Math.sin(u * 13 + seed);
  // chỗ gãy: ở 58 % chiều dài, tính từ đầu dưới
  const BRK = .58;
  // đoạn trên: từ chỗ gãy lên tới kẹp — đứng yên
  const top = new THREE.Group();
  top.add(mesh(surface(12, 5, (u, v) => [
    (BRK + (1 - BRK) * u - .5) * len,
    yAt(BRK + (1 - BRK) * u),
    (v - .5) * wid,
  ]), mat, [0, 0, 0]));
  g.add(top);
  // đoạn dưới: từ chỗ gãy xuống lực kế. Nó **quay quanh chỗ gãy** (gốc của
  // nhóm nằm đúng chỗ gãy), nếu không dải giấy bị hở một khe ngay chỗ chưa gãy.
  const lower = new THREE.Group();
  lower.position.x = (BRK - .5) * len;
  lower.add(mesh(surface(12, 5, (u, v) => [
    (BRK * (1 - u) - .5) * len,
    yAt(BRK * (1 - u)),
    (v - .5) * wid,
  ]), mat, [0, 0, 0]));
  g.add(lower);
  // ── đầu dưới: trục giấy cuộn + móc thép móc vào vòng treo của lực kế ──
  // (bàn đo đặt vòng treo lực kế ở local x ≈ -.086; móc phải vươn tới đó)
  const rollMat = toon('#efe6d2', { map: TEX.sheet() });
  const rollR = wid * .30;
  const rollX = -len / 2 + rollR * .5;
  lower.add(mesh(new THREE.CylinderGeometry(rollR, rollR, wid * .92, 16), rollMat, [rollX, 0, 0],
    { rot: [Math.PI / 2, 0, 0] }));
  for (const s of [-1, 1]) {                        // mép cuộn: hai vòng giấy
    lower.add(mesh(new THREE.TorusGeometry(rollR, rollR * .14, 6, 18), toon('#d9cdb4'),
      [rollX, 0, s * wid * .46], { rot: [0, 0, 0] }));
  }
  const hookMat = toon('#9aa2b4');
  const hook = [
    [rollX, .002, 0], [rollX + .006, .001, 0], [rollX + .011, -.006, 0],
    [rollX + .013, -.002, 0], [rollX + .012, .003, 0],
  ];
  lower.add(rod(hook[0], hook[1], .0026, hookMat));
  lower.add(rod(hook[1], hook[2], .0026, hookMat));
  lower.add(rod(hook[2], hook[3], .0026, hookMat));
  lower.add(rod(hook[3], hook[4], .0022, hookMat));
  g.mat = mat;
  g.setWet = k => {
    const c = clamp(k);
    mat.color.setScalar(1 - .20 * c);
    top.children[0].scale.y = 1 + 2.4 * c;
    lower.children[0].scale.y = 1 + 2.4 * c;
    lower.rotation.z = -.10 * c;                     // giấy ướt ngoằn ngoèo
  };
  g.setBreak = k => {
    const c = clamp(k);
    // đoạn dưới **rời ra**: nó tụt xuống một chút (hở khe ở chỗ gãy) và đảo
    // sang một bên — người xem thấy ngay đó là một vết rách, không phải giấy cong.
    lower.rotation.y = .50 * c;                     // đảo sang bên (trục dọc)
    lower.rotation.z = -.10 * clamp(k / .35);       // cong nhẹ khi ướt
    lower.position.x = (BRK - .5) * len - .012 * c; // tụt xuống, hở khe
  };
  g.setWet(0); g.setBreak(0);
  return g;
}

// Góc giấy khăn giấy bị cắt: một mảng giấy mỏng với một góc cắt vát, ở mép cắt
// lộ ra **các móc nối màu hồng** — mối nối bằng nhựa mà nước không phá được.
export function cutCorner({ w = .085, h = .085, seed = 3 } = {}) {
  const g = new THREE.Group();
  const mat = toon('#fbf7ee', { map: TEX.sheet(), side: THREE.DoubleSide });
  // mép cắt là một đường chéo góc
  g.add(mesh(surface(6, 6, (u, v) => [
    (u - .5) * w,
    (v - .5) * h,
    .0012 * Math.sin(u * 9 + v * 5),
  ]), mat, [0, 0, 0]));
  // các đầu sợi ở **mép cắt**, mỗi sợi một móc nối hồng — móc to và sáng để
  // người xem thấy được: đây là dấu hiệu của giấy có nhựa
  const r = mulberry(seed);
  for (let i = 0; i < 11; i++) {
    // các móc nối nằm **dọc theo mép cắt**, nhỏ và dẹt như giọt nhựa nóng
    // chảy dán vào mép — chứ không phải những quả cầu hồng to như chùm nho.
    const x = (r() - .5) * w * .80, y = h * .34 + (r() - .5) * h * .10;
    const f = mesh(new THREE.CylinderGeometry(.0014, .0014, .020, 6), toon('#e8dcbe'), [x, y, .002], { rot: [0, 0, r() * 3] });
    g.add(f);
    const b = mesh(new THREE.SphereGeometry(.0032, 8, 6), glowMat('#f472b6', 1.1), [x, y, .0035]);
    b.scale.set(1, .62, .55);
    g.add(b);
  }
  return g;
}

// Mẻ giấy khăn giấy: một xấp giấy mềm, mép trên nhô lên và cong.
export function tissueStack({ n = 5, w = .13, d = .10, color = '#fbf7ee' } = {}) {
  const g = new THREE.Group();
  const rnd = mulberry(17);
  for (let i = 0; i < n; i++) {
    g.add(mesh(surface(8, 8, (u, v) => [
      (u - .5) * w * (1 + i * .02),
      i * .004 + .004 * Math.sin(u * 7 + i) + .004 * Math.sin(v * 6),
      (.5 - v) * d,
    ]), toon(color, { side: THREE.DoubleSide }), [(rnd() - .5) * .004, 0, (rnd() - .5) * .004]));
  }
  return g;
}

// Túi giấy **bao bì của ngành**: dạng túi multi-wall phẳng, mép gấp kép,
// **không quai xách**. Túi siêu thị có quai; túi bao bì của ngành thì không —
// và chính dạng này phải lên hình, để người xem không đọc nó thành túi mua
// ở chợ (loại giấy đó không phải loại giấy bền ướt của ngành).
export function paperBag({ w = .14, h = .18, d = .055, color = '#e2c69a' } = {}) {
  const g = new THREE.Group();
  const mat = toon(color, { side: THREE.DoubleSide });
  // thân túi: **giấy mềm** — phồng ở giữa, miệng hẹp hơn đáy, có nếp nhăn
  g.add(mesh(surface(10, 10, (u, v) => {
    const taper = 1 - .12 * v;
    const bulge = Math.sin(v * Math.PI);
    return [
      (u - .5) * w * taper,
      v * h,
      (u - .5) * d * taper * (.6 + .4 * bulge) + (bulge - .5) * d * .30,
    ];
  }), mat, [0, 0, 0]));
  // đáy gấp: mép nằm ngang dưới đáy, nên túi đứng được
  g.add(mesh(rbox(w * .96, .012, d * .90, .003), toon('#c9a877'), [0, .006, 0]));
  // mép trên gấp kép: hai lớp giấy úp lên nhau, rộng hơn miệng túi
  g.add(mesh(rbox(w * 1.04, .015, d * 1.04, .003), toon('#efd6ac'), [0, h - .008, 0]));
  g.add(mesh(rbox(w * 1.04, .013, d * .97, .003), toon('#c9a877'), [0, h - .023, 0]));
  // nếp gấp hông (gusset): một dải giấy sẫm chạy dọc giữa mặt trước
  g.add(mesh(rbox(.007, h * .88, .004, .001), toon('#c9a877'), [0, h * .47, d * .32]));
  return g;
}

// Thước kẻ vạch: một thước gỗ dài đứng cạnh dải giấy thử, để **độ giãn** của
// dải giấy có chỗ để đo (không có thước thì "giãn dài" chỉ là một lời).
// Mặt thước có vạch **và số**; thước **đứng thẳng**, mặt quay về phía máy —
// (cảnh đặt thước hơi nghiêng, nội dung bên trong đứng thẳng lại để người xem
// đọc được số và thước không trông như một tấm nghiêng).
export function ruler({ len = .30, wid = .028 } = {}) {
  const g = new THREE.Group();
  const inner = new THREE.Group();
  inner.rotation.set(0, -.18, -.06);      // đứng thẳng, mặt thước về phía máy
  g.add(inner);
  const tex = canvasTex(256, 1024, (c, w, h) => {
    const r = mulberry(3);
    c.fillStyle = '#e0b878'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) {         // vân gỗ chạy dọc thước
      c.strokeStyle = `rgba(150,100,50,${.07 + r() * .13})`;
      c.lineWidth = 1 + r() * 3;
      const x = r() * w;
      c.beginPath(); c.moveTo(x, 0);
      c.bezierCurveTo(x + (r() - .5) * 10, h * .3, x + (r() - .5) * 10, h * .7, x, h); c.stroke();
    }
    c.fillStyle = '#2b2118';
    for (let i = 0; i <= 400; i++) {       // bốn mươi centimet, vạch mỗi mili
      const y = h - (i / 400) * h;
      const big = i % 10 === 0, mid = i % 5 === 0;
      c.fillRect(0, y - (big ? 3 : mid ? 2 : 1), w * (big ? .58 : mid ? .40 : .26), big ? 6 : mid ? 4 : 2.5);
    }
    // số centimet, in dọc theo thước để đọc được khi thước đứng
    c.fillStyle = '#2b2118'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = '700 42px "Be Vietnam Pro", sans-serif';
    for (let cm = 0; cm <= 40; cm += 5) {
      const y = h - (cm / 40) * h;
      c.save(); c.translate(w * .78, y); c.rotate(-Math.PI / 2); c.fillText(String(cm), 0, 0); c.restore();
    }
  });
  inner.add(mesh(rbox(wid, len, .006, .0015), toon('#d8b078'), [0, 0, 0]));
  inner.add(mesh(new THREE.PlaneGeometry(wid * .95, len * .995), toon('#ffffff', { map: tex }), [0, 0, .0032]));
  return g;
}

// Mặt cắt của tờ giấy: mép cắt thẳng nằm ở **bên trái** (đó là mép máy quay
// thấy lúc nó lui ra khỏi tờ giấy), ở đó thấy **các đầu sợi** chìa ra xếp
// chồng lên nhau. Thân tờ giấy quay về phía máy (hơi gợn, cho ánh sáng chạy
// trên mặt), và nó **có dày** để viền mực bắt được nét.
export function paperEdge({ w = .55, h = .34, seed = 6 } = {}) {
  const g = new THREE.Group();
  const r = mulberry(seed);
  // mặt giấy: màu giấy ấm, lấm tấm mảnh và vài sợi nằm trong bề mặt
  const tex = canvasTex(512, 512, (c, W, H) => {
    c.fillStyle = '#efe4c6'; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) {
      c.fillStyle = `rgba(150,130,95,${.03 + r() * .10})`;
      c.fillRect(r() * W, r() * H, 1 + r() * 2.4, 1 + r() * 1.6);
    }
    for (let i = 0; i < 70; i++) {
      c.strokeStyle = `rgba(186,166,126,${.10 + r() * .18})`;
      c.lineWidth = .8 + r() * 1.2;
      const x = r() * W, y = r() * H, a = r() * Math.PI, L = 18 + r() * 90;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); c.stroke();
    }
  }, [w * 3, h * 3]);
  // thân tờ giấy: một **khối có dày**, mặt trước hơi gợn để không bằng phẳng
  // như bức tường
  const d = .05;
  const amp = w * .020;
  const wave = (x, y) => Math.sin(x * 3.1 + seed) * amp * .40 + Math.sin(y * 5.3 + seed * 2) * amp * .22
    + Math.sin((x + y) * 2.2) * amp * .15;
  const body = new THREE.BoxGeometry(w, h, d, 30, 12, 1);
  const pos = body.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    if (z > 0) pos.setZ(i, z + wave(x, y));
  }
  body.computeVertexNormals();
  g.add(mesh(body, toon('#ffffff', { map: tex }), [0, 0, 0]));
  // mép cắt: mép trái của khối giấy — chỗ bị cắt, ánh sáng không lọt vào
  const cutW = .022;
  const band = new THREE.PlaneGeometry(cutW, h * .99, 1, 20);
  const bp = band.attributes.position;
  for (let i = 0; i < bp.count; i++) {                 // vệt tối đi theo mặt gợn
    const x = bp.getX(i) - w / 2 + cutW / 2, y = bp.getY(i);
    bp.setZ(i, wave(x, y) + .003);
  }
  band.computeVertexNormals();
  g.add(mesh(band, toon('#9a855e'), [-w / 2 + cutW / 2, 0, d / 2]));
  // các đầu sợi ở mép cắt: những que nhỏ chìa ra **về phía trái**, xếp chồng
  const mat = toon('#fbf3dd'), mat2 = toon('#cbb389');
  const n = Math.round(70 * Math.max(1, w / .55));
  for (let i = 0; i < n; i++) {
    const y = (r() - .5) * h * .98;
    const L = h * (.012 + r() * .030);
    const a = [-w / 2 - L * .45, y + (r() - .5) * h * .03, d / 2 + wave(-w / 2, y) * .6];
    const b = [-w / 2 + L * .55, y + (r() - .5) * h * .04, d / 2 + wave(-w / 2, y) * .3];
    g.add(rod(a, b, .0026 + r() * .0022, r() < .3 ? mat2 : mat, .0016 + r() * .0012));
  }
  return g;
}

// ── danh sách vật cho vòng chấm đạo cụ ─────────────────────────────────
// Mỗi mục là một vật một mình trên nền trơn, nhìn từ ba phía. Tên là cái
// gọi của người xem, không phải tên hàm trong mã.
export const PROPS = {
  'tờ giấy trắng nằm phẳng trên mặt phẳng, mép hơi cong': () => paperSheet({ w: .21, h: .28, seed: 3 }),
  'tờ giấy ướt nhăn lại, có vệt ẩm nâu ở giữa': () => {
    const g = paperSheet({ w: .21, h: .28, seed: 3, wrinkle: 1 });
    g.setWet(1);
    return g;
  },
  'tờ giấy bị rách làm hai, mép rách gấp khúc': () => {
    const g = paperSheet({ w: .21, h: .28, tear: true, seed: 5, wrinkle: 1 });
    g.setWet(.8); g.setTear(1);
    return g;
  },
  'tờ giấy nhăn dày sau khi ướt rồi sấy, còn vệt ẩm hằn trên mặt': () => {
    const g = paperSheet({ w: .21, h: .28, seed: 9, wrinkle: 2.4 });
    g.setWet(.45);
    return g;
  },
  'tờ giấy bị ngón tay ấn, nếp hăn tỏa ra từ giữa tờ': () => {
    const g = paperSheet({ w: .21, h: .28, seed: 3 });
    g.setPress(1);
    return g;
  },
  'bát nước có mặt nước phẳng, miệng bát có viền đỏ': () => waterBowl({ R: .10 }),
  'khăn lau vắt trên miệng bát, vải gấp có sọc': () => dishTowel({}),
  'sợi cellulose tròn màu vàng nhạt, có nhóm hydroxyl trắng dính hai bên': () => fibre({}),
  'một sợi giấy phồng to ra, các cụm trắng bám dài ra xa': () => {
    const g = fibre({ seed: 9 });
    g.setSwell(1);
    return g;
  },
  'liên kết hydrogen: móc vàng nối hai sợi giấy, hai đầu cắm vào hai cụm trắng': () => bond({}),
  'móc xanh nối hai sợi giấy, móc ướt đã đổi màu': () => {
    const g = bond({});
    g.setWet(1);
    return g;
  },
  'phân tử nước: hạt oxy lớn màu xanh nhạt và hai hạt hydro trắng nhỏ': () => waterMolecule({}),
  'bộ kẹp giấy bằng thép, hai bản hàm ngập vào nhau': () => paperClamp({}),
  'giá đo bằng thép: đế tròn nặng và một cột đứng': () => gaugeStand({}),
  'đồng hồ đo lực mặt thang tròn, kim đỏ và móc treo dưới': () => dynamometer({ R: .055 }),
  'đồng hồ đo lực mặt thang tròn, kim đỏ chỉ vạch cao': () => {
    const g = dynamometer({ R: .055 });
    g.setLoad(.86);
    return g;
  },
  'đồng hồ độ ẩm mặt thang tròn, kim xanh và chân đứng': () => hygrometer({}),
  'dải giấy dài mỏng nằm thẳng': () => paperStrip({}),
  'dải giấy dài mỏng bị ướt, sẫm màu và nhăn': () => {
    const g = paperStrip({});
    g.setWet(1);
    return g;
  },
  'mẻ giấy khăn giấy trắng xếp chồng, mép trên nhô lên': () => tissueStack({}),
  'góc giấy khăn giấy bị cắt vát, ở mép lộ ra các móc nối màu hồng': () => cutCorner({ w: .085, h: .085, seed: 3 }),
  'móc xanh lam nối hai phân tử nước với nhau': () => bond({ r: .0050, color: '#5aa9ff' }),
  'thước gỗ kẻ vạch có số, đứng cạnh dải giấy thử': () => ruler({}),
  'mặt cắt của tờ giấy, thấy các đầu sợi chìa ra xếp chồng': () => paperEdge({}),
  'túi giấy bao bì dạng phẳng, mép gấp kép, không quai xách': () => paperBag({ w: .14, h: .18, d: .055 }),
  'khe nứt tối giữa hai mép giấy rách, có đầu sợi chìa ra': () => crack({}),
};
