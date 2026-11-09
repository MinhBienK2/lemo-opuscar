// props.js — vật riêng của tập 06: tờ giấy (khô / ướt / đã rách), bát nước, khăn lau,
// sợi cellulose, nhóm hydroxyl, mối liên kết hydrogen, phân tử nước, bộ kẹp giấy,
// giá đo, đồng hồ đo lực, dải giấy thử, đồng hồ độ ẩm, mẻ giấy khăn giấy, túi giấy bao bì.
//
// Vài dựa trên hình dạng thật:
//  · tờ giấy là một **mặt cong nhẹ** nằm trên quầy, không phải một hộp mỏng; mép
//    giấy hơi cong lên ở cả bốn góc;
//  · tờ giấy ướt thì **nhăn** và có một vệt ẩm tối màu loang ở giữa, và vệt ẩm đó
//    **loang dần** khi nước thấm vào;
//  · tờ giấy bị rách thì mép rách là một **đường gấp khúc** chạy dọc, không phải
//    một đường thẳng cắt ngang;
//  · sợi cellulose là một **dải dẹt** (sợi giấy bị ép phẳng), và các nhóm hydroxyl
//    mọc ra **hai bên** sợi chứ không nằm dọc sợi;
//  · đồng hồ đo lực và đồng hồ độ ẩm đều là **mặt thang tròn có kim**.
// Mọi vật đều là hàm thuần của t, nên dựng lại được bất cứ lúc nào.
import * as THREE from 'three';
import { toon, mesh, rbox, canvasTex, PAL, clamp, lerp, ss, mulberry, fxLayer, glowMat, surface, TEX } from '../../../../rig/kit.js';

// ── tờ giấy ─────────────────────────────────────────────────────────────

// Vệt ẩm trên giấy: một vảy mềm dạng vệt loang, viền mềm, tối màu hơn nền.
function wetPatchTex(seed = 3) {
  return canvasTex(256, 256, (g, w, h) => {
    const r = mulberry(seed);
    g.clearRect(0, 0, w, h);
    const gr = g.createRadialGradient(w / 2, h / 2, w * .10, w / 2, h / 2, w * .46);
    gr.addColorStop(0, 'rgba(120,138,178,.82)');
    gr.addColorStop(.50, 'rgba(138,152,190,.54)');
    gr.addColorStop(.82, 'rgba(150,162,196,.24)');
    gr.addColorStop(1, 'rgba(160,172,200,0)');
    g.fillStyle = gr;
    g.beginPath(); g.ellipse(w / 2, h / 2, w * .46, h * .40, 0, 0, 7); g.fill();
    // vành giấy ướt sẫm hơn một chút ở rìa vệt
    g.globalAlpha = .16;
    for (let k = 0; k < 34; k++) {
      g.fillStyle = 'rgba(108,126,168,.8)';
      const a = r() * 7, d = w * (.30 + r() * .13);
      g.beginPath(); g.arc(w / 2 + Math.cos(a) * d, h / 2 + Math.sin(a) * d * .85, 2 + r() * 5, 0, 7); g.fill();
    }
  });
}

// Một tờ giấy nằm trên mặt phẳng XZ.
//  · `tear`: tờ chia làm hai nửa, mép rách là đường gấp khúc; `setTear(k)` mở khe.
//  · `setWet(k)`: vệt ẩm loang ra và giấy tối đi.
//  · `setWrinkle(k)`: giấy nhăn dần — nếp nhăn là hình dạng của tờ giấy, nó phải
//    **nặn ra** chứ không phải đổi màu. Nhăn lên rồi mới rách, và người xem phải
//    thấy cái nhăn đó trước khi thấy vết rách.
// Vệt ẩm nằm **trên** mặt giấy và đi theo nếp nhăn (nó là con của nửa tờ giấy),
// nên nó không bao giờ chìm vào giấy và không đè lên nếp.
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
  const patchMat = new THREE.MeshBasicMaterial({ map: wetPatchTex(seed), transparent: true, opacity: 0, depthWrite: false });
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
  g.mat = mat;
  g.setWet = k => {
    const c = clamp(k);
    mat.color.setScalar(1 - .17 * c);
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
  };
  g.setWet(0); g.setTear(0); g.setWrinkle(wrinkle);
  return g;
}

// Vết nứt: một **khe tối** mép gấp khúc, chạy dọc giữa hai sợi giấy đã trượt ra.
// Nứt không cắt sợi — nó là chỗ hai sợi không còn bám vào nhau nữa.
export function crack({ len = .30, w = .040, seed = 4 } = {}) {
  const g = new THREE.Group();
  const geo = surface(3, 30, (u, v) => {
    const jag = .5 + .28 * Math.sin(v * 41 + seed) + .22 * Math.sin(v * 13.7 + seed * 3);
    const ww = w * (.30 + .70 * jag);
    return [(u - .5) * ww, (v - .5) * len, 0];
  });
  g.add(mesh(geo, toon('#2a1c46', { side: THREE.DoubleSide }), [0, 0, 0]));
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
  const water = mesh(new THREE.CircleGeometry(R * .93, 44), toon('#ffffff', { map: wtex }), [0, wy, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  g.add(water);
  g.H = H; g.water = water;
  return g;
}

// Khăn lau vắt trên miệng bát: một mảnh vải gấp, một đầu trong bát, một đầu treo
// ngoài miệng bát. Vải phải **mềm** — một hộp mỏng đọc ra là một mảnh bìa.
export function dishTowel({ w = .17, drop = .16, color = PAL.red } = {}) {
  const tex = canvasTex(256, 256, (c, ww, hh) => {
    c.fillStyle = '#fff0d8'; c.fillRect(0, 0, ww, hh);
    c.fillStyle = color; for (let y = 20; y < hh; y += 70) c.fillRect(0, y, ww, 16);
    c.fillStyle = PAL.navy; for (let y = 44; y < hh; y += 70) c.fillRect(0, y, ww, 5);
  });
  return mesh(surface(12, 20, (u, v) => [
    (u - .5) * w,
    -v * drop + .012 * Math.sin(u * 9 + v * 4),
    .02 * Math.sin(v * 5 + u * 3) + (v > .5 ? (v - .5) * .07 : 0),
  ]), toon('#ffffff', { map: tex, side: THREE.DoubleSide }), [0, 0, 0]);
}

// ── thế giới bên trong tờ giấy ──────────────────────────────────────────

// Một sợi cellulose: một **dải dẹt** uốn nhẹ, các nhóm hydroxyl mọc ra hai bên.
// `setSwell(k)`: sợi phồng to ra (bề ngang), các nhóm hydroxyl dãi ra xa nhau.
export function fibre({ len = .46, wid = .026, color = '#f0d79b', seed = 5, groups = 8 } = {}) {
  const g = new THREE.Group();
  const shape = u => Math.sin(u * 6.2 + seed) * .011 + Math.sin(u * 2.1 + seed) * .006;
  const ribbon = mesh(surface(26, 6, (u, v) => [(u - .5) * len, shape(u), (v - .5) * wid]),
    toon(color, { side: THREE.DoubleSide }), [0, 0, 0]);
  g.add(ribbon);
  const beads = [];
  for (let i = 0; i < groups; i++) {
    const u = (i + .5) / groups;
    for (const s of [-1, 1]) {
      const b = mesh(new THREE.SphereGeometry(.0040, 10, 8), toon('#fdfaf0'),
        [(u - .5) * len, shape(u) + .001, s * (wid / 2 + .0032)]);
      b.userData.z0 = b.position.z;
      g.add(b); beads.push(b);
    }
  }
  g.beads = beads;
  g.setSwell = k => {
    const c = clamp(k);
    ribbon.scale.z = 1 + .55 * c;
    for (const b of beads) b.position.z = b.userData.z0 * (1 + .55 * c);
  };
  g.setSwell(0);
  return g;
}

// Mối liên kết hydrogen: một móc nhỏ sáng nối hai sợi. Khô thì vàng, ướt thì
// chuyển sang xanh — màu là **cái gì đang giữ hai sợi**, nên nó đổi theo.
export function bond({ r = .0095, color = '#f7bd27' } = {}) {
  const g = new THREE.Group();
  // Móc là một **hạt nhỏ sáng**, không phải một quả bóng: người xem phải thấy
  // nó nhỏ bằng nhóm hydroxyl thì mới hiểu đó là mối nối giữa hai sợi.
  const core = mesh(new THREE.SphereGeometry(r, 12, 10), glowMat(color, 1.9), [0, 0, 0]);
  const ring = mesh(new THREE.TorusGeometry(r * 1.5, r * .30, 8, 22), glowMat(color, 1.2, { transparent: true, opacity: .40 }),
    [0, 0, 0], { rot: [Math.PI / 2, 0, 0] });
  fxLayer(ring);
  g.add(core, ring);
  const c0 = new THREE.Color(color), c1 = new THREE.Color('#67e8f9');
  g.setWet = k => {
    const c = clamp(k);
    core.material.color.copy(c0).lerp(c1, c).multiplyScalar(1.9);
    ring.material.color.copy(c0).lerp(c1, c).multiplyScalar(1.2);
  };
  g.setWet(0);
  return g;
}

// Phân tử nước: một nguyên tử oxy (hạt to) và hai nguyên tử hydro (hai hạt nhỏ).
export function waterMolecule({ R = .012, color = '#67e8f9' } = {}) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.SphereGeometry(R, 14, 12), toon(color, { emissive: '#0e3a52', emissiveIntensity: .5 }), [0, 0, 0]));
  for (const a of [-.9, .9]) {
    g.add(mesh(new THREE.SphereGeometry(R * .34, 10, 8), toon('#ffffff'),
      [Math.cos(a) * R * 1.5, Math.sin(a) * R * 1.5, 0]));
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

// Mặt thang tròn — dùng chung cho đồng hồ đo lực và đồng hồ độ ẩm.
// Vạch trên thang là **vạch của dụng cụ**, nên số trên thang được vẽ bằng phép
// tính (không phải chữ viết thẳng), và lời kể đọc con số đang chỉ.
// Thang nằm trên **cung trên** của mặt đồng hồ: góc vẽ trong canvas đi từ
// 1,25π (trên trái) đến 1,75π (trên phải).
function dialFace({ R = .055, ticks = 11, unit = '', color = '#fdf6e6', ink = '#252d50' } = {}) {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = color; g.beginPath(); g.arc(w / 2, h / 2, w * .48, 0, 7); g.fill();
    g.strokeStyle = ink; g.lineWidth = 7; g.beginPath(); g.arc(w / 2, h / 2, w * .465, 0, 7); g.stroke();
    const cx = w / 2, cy = h / 2, Rr = w * .38;
    for (let i = 0; i < ticks; i++) {
      const a = Math.PI * 1.25 + (i / (ticks - 1)) * Math.PI * .5;
      const big = i % 2 === 0;
      g.strokeStyle = ink; g.lineWidth = big ? 9 : 5;
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * Rr, cy + Math.sin(a) * Rr);
      g.lineTo(cx + Math.cos(a) * Rr * (big ? .80 : .86), cy + Math.sin(a) * Rr * (big ? .80 : .86));
      g.stroke();
    }
    // đơn vị đo, đặt dưới tâm mặt đồng hồ
    g.fillStyle = ink; g.textAlign = 'center'; g.font = '700 34px "Be Vietnam Pro", sans-serif';
    g.fillText(String(unit), cx, cy + Rr * .46);
  });
}

// Đồng hồ đo lực: mặt thang tròn, kim đỏ, móc treo dưới, và **vòng treo trên**
// (lực kế thật có cả hai: vòng để treo, móc để tải).
// `setLoad(k)`: kim chạy trên cung tròn, k = 0 là không tải, k = 1 là hết thang.
export function dynamometer({ R = .055, color = '#fdf6e6' } = {}) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(R, R, .022, 40), toon('#39405a'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.CircleGeometry(R, 44), toon('#ffffff', { map: dialFace({ R, color, unit: 'N' }) }), [0, 0, .012]));
  g.add(mesh(new THREE.TorusGeometry(R * 1.03, R * .08, 10, 40), toon('#4a5064'), [0, 0, 0]));
  const needle = new THREE.Group();
  needle.add(mesh(rbox(R * .80, .006, .004, .001), toon(PAL.red), [R * .36, 0, .018]));
  needle.add(mesh(new THREE.CylinderGeometry(.007, .007, .012, 12), toon('#39405a'), [0, 0, .016], { rot: [Math.PI / 2, 0, 0] }));
  g.add(needle);
  g.add(mesh(new THREE.TorusGeometry(.010, .0028, 8, 18), toon('#c9973a'), [0, -R - .016, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.TorusGeometry(.011, .0030, 8, 18), toon('#8b93a8'), [0, R + .014, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.needle = needle;
  g.setLoad = k => { needle.rotation.z = lerp(2.30, .84, clamp(k)); };
  g.setLoad(0);
  return g;
}

// Đồng hồ độ ẩm: mặt thang tròn có kim, đứng trên một chân nhỏ.
// `setRH(rh)`: kim chỉ độ ẩm tương đối (0..100).
export function hygrometer({ R = .042, color = '#fdf6e6' } = {}) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(R, R, .020, 36), toon('#39405a'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  g.add(mesh(new THREE.CircleGeometry(R, 40), toon('#ffffff', { map: dialFace({ R, color, ticks: 9, unit: '%' }) }), [0, 0, .011]));
  g.add(mesh(new THREE.TorusGeometry(R * 1.05, R * .10, 10, 36), toon('#39405a'), [0, 0, 0]));
  const needle = new THREE.Group();
  needle.add(mesh(rbox(R * .72, .005, .004, .001), toon('#2a9db0'), [R * .32, 0, .016]));
  g.add(needle);
  g.add(mesh(new THREE.CylinderGeometry(.030, .034, .014, 18), toon('#4a5064'), [0, -R - .006, 0]));
  g.needle = needle;
  g.setRH = rh => { needle.rotation.z = lerp(2.30, .84, clamp(rh / 100)); };
  g.setRH(50);
  return g;
}

// Dải giấy thử: một dải giấy dài, mỏng, một đầu đã kẹp. `setWet(k)`: giấy sẫm
// màu và nhăn lên — dải giấy ướt **không còn phẳng**, và đó là điều nhìn thấy
// được của nó.
// Dải giấy gồm **hai đoạn** vì nó phải đứt được: `setBreak(k)` là **đoạn dưới**
// (phần buộc vào lực kế) gãy ra, quay quanh **chỗ gãy** — đoạn trên vẫn nằm
// trong kẹp. Nếu đoạn nào đứt thì phải là đoạn dưới: giấy đứt ở chỗ bị kéo.
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

// Góc giấy khăn giấy bị cắt: một mảnh giấy mỏng với một góc cắt vát, ở mép cắt
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
  for (let i = 0; i < 7; i++) {
    const x = (r() - .5) * w * .74, y = h * .30 + (r() - .5) * h * .16;
    const f = mesh(new THREE.CylinderGeometry(.0018, .0018, .022, 6), toon('#e8dcbe'), [x, y, .002], { rot: [0, 0, r() * 3] });
    g.add(f);
    const b = mesh(new THREE.SphereGeometry(.0052, 10, 8), glowMat('#f472b6', 2.2), [x, y, .004]);
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
// Vạch được vẽ trên mặt thước: vạch lớn mỗi centimet, vạch nhỏ mỗi nửa centimet.
export function ruler({ len = .30, wid = .028 } = {}) {
  const g = new THREE.Group();
  const tex = canvasTex(128, 1024, (c, w, h) => {
    c.fillStyle = '#e3c08a'; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(140,95,45,.20)'; c.fillRect(0, 0, w, h * .05);
    c.fillStyle = '#2b2118';
    for (let i = 0; i <= 60; i++) {                 // sáu mươi centimet, mỗi vạch một centimet
      const y = h - (i / 60) * h;
      const big = i % 10 === 0, mid = i % 5 === 0;
      c.fillRect(0, y - (big ? 3 : 1.5), w * (big ? .60 : mid ? .38 : .24), big ? 5 : 3);
    }
  });
  g.add(mesh(rbox(wid, len, .005, .0012), toon('#d8b078'), [0, 0, 0]));
  g.add(mesh(new THREE.PlaneGeometry(wid * .95, len * .99), toon('#ffffff', { map: tex }), [0, 0, .0029]));
  return g;
}

// Mặt cắt của tờ giấy: mép cắt thẳng nằm ở đáy, ở đó thấy **các đầu sợi**
// chìa ra xếp chồng lên nhau — đây là thứ máy quay thấy lúc nó lui ra khỏi
// tờ giấy. Thân tờ giấy quay về phía máy (hơi gợn, cho ánh sáng chạy trên mặt),
// mép cắt ở đường chân.
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
  // thân tờ giấy, hơi gợn để mặt giấy không bằng phẳng như bức tường
  const body = new THREE.PlaneGeometry(w, h, 28, 10);
  const pos = body.attributes.position, amp = w * .022;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    pos.setZ(i, Math.sin(x * 3.1 + seed) * amp * .55 + Math.sin(y * 5.3 + seed * 2) * amp * .30
      + Math.sin((x + y) * 2.2) * amp * .20);
  }
  body.computeVertexNormals();
  g.add(mesh(body, toon('#ffffff', { map: tex }), [0, 0, 0]));
  // vệt tối ngay trên mép cắt: chỗ giấy bị cắt, ánh sáng không lọt vào
  const zw = amp * 1.2;
  g.add(mesh(new THREE.PlaneGeometry(w, h * .045), toon('#9a855e'), [0, -h / 2 + h * .024, zw]));
  // các đầu sợi ở mép cắt: những que nhỏ chìa ra về phía máy quay
  const mat = toon('#fbf3dd'), mat2 = toon('#cbb389');
  const n = Math.round(70 * Math.max(1, w / .55));
  for (let i = 0; i < n; i++) {
    const x = (r() - .5) * w * .99;
    const y = -h / 2 + (r() - .5) * h * .07;
    const L = h * (.014 + r() * .034);
    g.add(mesh(new THREE.CylinderGeometry(.0030 + r() * .0028, .0022 + r() * .0018, L, 6),
      r() < .3 ? mat2 : mat,
      [x, y, zw + L / 2], { rot: [Math.PI / 2 + (r() - .5) * .9, 0, (r() - .5) * 1.0] }));
  }
  return g;
}

// ── danh sách vật cho vòng chấm đạo cụ ─────────────────────────────────
// Mỗi mục là một vật một mình trên nền trơn, nhìn từ ba phía. Tên là cái
// gọi của người xem, không phải tên hàm trong mã.
export const PROPS = {
  'tờ giấy trắng nằm phẳng trên mặt phẳng, mép hơi cong': () => paperSheet({ w: .21, h: .28, seed: 3 }),
  'tờ giấy ướt nhăn lại, có vệt ẩm tối màu ở giữa': () => {
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
  'bát nước có mặt nước phẳng, miệng bát có viền đỏ': () => waterBowl({ R: .10 }),
  'khăn lau vắt trên miệng bát, vải gấp có sọc': () => dishTowel({}),
  'sợi giấy dẹt màu vàng nhạt, có hạt trắng nhỏ dính hai bên': () => fibre({}),
  'một sợi giấy phồng to ra, hạt trắng dãi ra xa': () => {
    const g = fibre({ seed: 9 });
    g.setSwell(1);
    return g;
  },
  'móc sáng nhỏ nối hai sợi giấy, móc màu vàng': () => bond({}),
  'móc sáng nhỏ nối hai sợi giấy, móc màu xanh': () => {
    const g = bond({});
    g.setWet(1);
    return g;
  },
  'phân tử nước: một hạt lớn màu xanh nhạt và hai hạt trắng nhỏ': () => waterMolecule({}),
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
  'góc giấy khăn giấy bị cắt vát, ở mép lộ ra các móc nối màu hồng': () => cutCorner({}),
  'móc sáng nhỏ màu xanh lam nối hai phân tử nước với nhau': () => bond({ r: .0050, color: '#5aa9ff' }),
  'thước gỗ kẻ vạch, đứng cạnh dải giấy thử': () => ruler({}),
  'mặt cắt của tờ giấy, thấy các đầu sợi chìa ra xếp chồng': () => paperEdge({}),
  'túi giấy bao bì dạng phẳng, mép gấp kép, không quai xách': () => paperBag({}),
  'khe nứt tối màu mép gấp khúc, chạy dọc giữa hai sợi giấy': () => crack({}),
};
