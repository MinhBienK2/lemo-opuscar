// Chiếc giường buổi trưa: đầu giường có nan, nệm, gối bẹp, chăn nhàu lệch một bên.
// Giường nằm dọc theo tường, đầu giường quay về góc phòng.
import * as THREE from 'three';
import { PAL, toon, TEX, rbox, mesh, cushionGeo, surface, mulberry } from '../../../../../rig/kit.js';

export function giuongBuoiTrua({ seed = 11 } = {}) {
  const g = new THREE.Group();
  const r = mulberry(seed);
  const L = 2.35, W = 1.42;                 // dài (z) và rộng (x)
  const H = 0.30;                          // cao chân giường
  const wood = toon('#ffffff', { map: TEX.wood() });
  wood.map.repeat.set(1.6, 1);
  const sheet = toon('#ffffff', { map: TEX.sheet() });
  const pillowTex = toon('#ffffff', { map: TEX.pillow() });
  const blanketTex = toon('#ffffff', { map: TEX.blanket() });
  blanketTex.map.repeat.set(1.4, 1.4);

  // ── khung giường: bốn chân, hai thanh dọc, hai thanh ngang ──
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    g.add(mesh(rbox(0.10, H, 0.10, 0.02), wood, [sx * (W / 2 - 0.06), H / 2, sz * (L / 2 - 0.08)]));
  }
  for (const sx of [-1, 1]) g.add(mesh(rbox(0.07, 0.11, L, 0.02), wood, [sx * (W / 2 - 0.05), H + 0.02, 0]));
  for (const sz of [-1, 1]) g.add(mesh(rbox(W, 0.09, 0.07, 0.02), wood, [0, H + 0.02, sz * (L / 2 - 0.05)]));

  // ── đầu giường: một tấm nan, năm song dọc ──
  const hb = new THREE.Group(); hb.position.set(0, H + 0.06, -L / 2 + 0.02); g.add(hb);
  hb.add(mesh(rbox(W + 0.10, 0.13, 0.09, 0.03), wood, [0, 0.60, 0]));
  hb.add(mesh(rbox(W + 0.10, 0.09, 0.09, 0.03), wood, [0, 0.02, 0]));
  for (const sx of [-1, 1]) hb.add(mesh(rbox(0.08, 0.62, 0.08, 0.02), wood, [sx * (W / 2 + 0.01), 0.32, 0]));
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * (W / 5.4);
    hb.add(mesh(rbox(0.075, 0.50, 0.045, 0.015), wood, [x, 0.32, 0]));
  }

  // ── nệm ──
  const mat = mesh(cushionGeo(W - 0.06, 0.24, L - 0.08, 0), sheet, [0, H + 0.14, 0]);
  g.add(mat);
  // nẹp nệm ở đầu giường
  g.add(mesh(rbox(W - 0.06, 0.20, 0.06, 0.02), sheet, [0, H + 0.14, -L / 2 + 0.07]));

  // ── gối: bẹp một bên, như gối đã nằm ──
  const pil = mesh(cushionGeo(W * 0.68, 0.20, 0.52, 0.05), pillowTex, [0.06, H + 0.26, -L / 2 + 0.42]);
  pil.rotation.set(0.03, -0.07, 0.04);
  g.add(pil);

  // ── chăn: một mảnh vải rủ trên nệm, mép trên gấp lộ mặt trong ──
  const z0 = -L / 2 + 0.72, z1 = L / 2 - 0.02;
  const blanket = mesh(surface(26, 34, (u, v) => {
    const z = z0 + (z1 - z0) * v;
    // mép trên: vải gấp lại ở đầu, lộ mặt dưới (màu sáng hơn)
    const fold = Math.max(0, 1 - v * 7);
    const wrinkle = Math.sin(u * 9 + v * 4) * 0.018 * (0.25 + v);
    const side = Math.max(0, Math.abs(u - 0.5) - 0.42) / 0.08;
    const drop = Math.min(1, side) * 0.16;
    const x = (u - 0.5) * (W + 0.10);
    const y = H + 0.24 - drop + wrinkle - fold * 0.055;
    return [x, y, z + fold * 0.02];
  }), blanketTex, [0, 0, 0], { rot: [0, 0, 0] });
  blanket.material.side = THREE.DoubleSide;
  g.add(blanket);

  // mép chăn gấp ở đầu: một dải vải sáng nằm trên mặt chăn
  const turned = mesh(surface(26, 6, (u, v) => {
    const z = z0 + 0.02 + v * 0.30;
    const wrinkle = Math.sin(u * 11) * 0.012;
    return [(u - 0.5) * (W + 0.10), H + 0.245 + wrinkle - v * 0.045, z];
  }), sheet, [0, 0, 0]);
  turned.material.side = THREE.DoubleSide;
  g.add(turned);

  g.L = L; g.W = W; g.H = H;
  g.pillow = pil; g.blanket = blanket;
  return g;
}

export const PROP = { name: 'chiếc giường nghỉ trưa', view: () => giuongBuoiTrua() };
