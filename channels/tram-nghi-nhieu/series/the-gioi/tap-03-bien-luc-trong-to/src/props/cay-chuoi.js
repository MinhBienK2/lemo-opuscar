// Cây chuối ở góc sân thượng: thân có vết lá, chín lá cong xanh, hai lá già
// vàng ốt, và một chùm chuối (một cuộng, hai hàng quả).
import * as THREE from 'three';
import { toon, canvasTex, mesh, mulberry, clamp } from '../../../../../rig/kit.js';

let _trunk, _leaf;

const trunkTex = () => (_trunk ||= canvasTex(128, 512, (g, w, h) => {
  const r = mulberry(77);
  g.fillStyle = '#8d8857'; g.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 38) {
    g.fillStyle = 'rgba(52,50,28,.30)'; g.fillRect(0, y, w, 5);
    g.fillStyle = 'rgba(224,214,150,.13)'; g.fillRect(0, y + 5, w, 7);
    g.fillStyle = 'rgba(52,50,28,.12)'; g.fillRect(0, y + 12, w, 3);
  }
  for (let k = 0; k < 9000; k++) { g.fillStyle = `rgba(58,52,28,${r() * .09})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

const leafTex = () => (_leaf ||= canvasTex(256, 256, (g, w, h) => {
  const r = mulberry(51);
  g.fillStyle = '#4c8a3c'; g.fillRect(0, 0, w, h);
  const grd = g.createLinearGradient(0, 0, 0, h);
  grd.addColorStop(0, 'rgba(255,240,150,.30)'); grd.addColorStop(.5, 'rgba(255,255,255,0)');
  grd.addColorStop(1, 'rgba(20,50,20,.35)');
  g.fillStyle = grd; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(24,58,24,.45)'; g.lineWidth = 4;      // sống lá
  g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  for (let x = 0; x < w; x += 18) {                          // gân lá chạy nghiêng
    g.strokeStyle = `rgba(30,64,30,${.14 + r() * .12})`; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x, h / 2); g.lineTo(x + 26, 0); g.stroke();
    g.beginPath(); g.moveTo(x, h / 2); g.lineTo(x + 26, h); g.stroke();
  }
  for (let k = 0; k < 9000; k++) { g.fillStyle = `rgba(20,44,20,${r() * .08})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

// ── lá chuối: một dải cong, mép nhọn dần, rủ xuống theo trục đứng ───────
function bananaLeaf(len = 1.7, wid = .44, droop = .55, seed = 1) {
  const NU = 16, NV = 5, g = new THREE.PlaneGeometry(len, wid, NU, NV);
  const p = g.attributes.position;
  const rnd = mulberry(seed);
  const halfW = u => (wid * .5) * Math.sin(Math.pow(clamp(u), .70) * Math.PI * .99) * (1 - u * .20);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const u = clamp((x + len / 2) / len);
    const hw = Math.max(.004, halfW(u));
    const v = clamp(y / (wid / 2), -1, 1);
    // lá vươn ra rồi rủ xuống; mép lá cụp xuống (diện chữ V của lá chuối)
    const yy = .32 * u - droop * Math.pow(u, 2.1) - Math.abs(v) * wid * .26 * u - rnd() * .012;
    p.setXYZ(i, x, yy, v * hw);
  }
  g.computeVertexNormals();
  return g;
}

export function cayChuoi(opts = {}) {
  const g = new THREE.Group();
  const TRUNK_H = 2.35;
  const trunk = new THREE.CylinderGeometry(.11, .17, TRUNK_H, 12);
  const tp = trunk.attributes.position;
  for (let i = 0; i < tp.count; i++) { const y = tp.getY(i); tp.setX(i, tp.getX(i) + (1 - (y + TRUNK_H / 2) / TRUNK_H) * .26); }
  trunk.computeVertexNormals();
  g.add(mesh(trunk, toon('#ffffff', { map: trunkTex() }), [0, TRUNK_H / 2, 0]));
  const leafMat = toon('#ffffff', { map: leafTex() });
  leafMat.side = THREE.DoubleSide;
  const TOP = TRUNK_H - .03;
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2 + .35;
    const len = 1.18 + (i % 3) * .16;
    const dir = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const base = new THREE.Vector3(.22, TOP, 0);
    const lg = bananaLeaf(len, .78, .40 + (i % 2) * .22, 100 + i);
    g.add(mesh(lg, leafMat, base.clone().addScaledVector(dir, len / 2).toArray(), { rot: [0, -a, 0] }));
    // cuống lá nối vào thân
    g.add(mesh(new THREE.CylinderGeometry(.022, .03, .30, 6), toon('#6f8a45'),
      base.clone().addScaledVector(dir, .14).toArray(), { rot: [0, 0, Math.PI / 2] }));
  }
  // lá chín: hai lá già, vàng ốt
  for (let i = 0; i < 2; i++) {
    const a = -1.1 - i * 1.9, len = 1.05;
    const dir = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const base = new THREE.Vector3(.18, TOP - .16, 0);
    const ripe = toon('#cfa63f', { map: leafTex(), side: THREE.DoubleSide });
    g.add(mesh(bananaLeaf(len, .62, .66, 300 + i), ripe,
      base.clone().addScaledVector(dir, len / 2).toArray(), { rot: [0, -a, 0] }));
  }
  // chùm chuối: một cuộng, hai hàng quả
  const bunch = new THREE.Group(); bunch.position.set(.32, TOP - .16, .12);
  bunch.add(mesh(new THREE.CylinderGeometry(.035, .035, .30, 8), toon('#7a7a3e'), [0, -.16, 0], { rot: [.35, 0, 0] }));
  for (let i = 0; i < 6; i++) {
    const row = i > 2 ? 1 : 0, k = i % 3;
    const b = mesh(new THREE.CylinderGeometry(.072, .046, .34, 8), toon(i % 2 ? '#e6c651' : '#d2ae3c'),
      [row ? .075 : -.075, -.44 - k * .05 - row * .05, row ? .06 : -.04]);
    b.rotation.z = row ? .13 : -.13; b.rotation.x = .18 + k * .04; bunch.add(b);
  }
  g.add(bunch);
  return g;
}

export const PROP = { name: 'cây chuối có chùm quả', view: () => cayChuoi() };
