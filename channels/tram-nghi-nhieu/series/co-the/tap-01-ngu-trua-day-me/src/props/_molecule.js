// Mô hình phân tử: hạt là bi, liên kết là que.
// Cùng một cách dựng cho cả một phân tử đứng riêng (một vật của phim) và một đám
// phân tử trong khe (InstancedMesh), nên cái bám vào khía thụ thể và cái lơ lửng
// quanh nó trông giống hệt nhau — người xem hiểu là cùng một thứ.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon } from '../../../../../rig/kit.js';

// màu nguyên tố: than đen xanh, nitơ xanh, oxi đỏ — như mô hình mô học
export const EL_COLOR = { C: '#f0e6d2', N: '#67e8f9', O: '#f04462', H: '#fff0d8' };

// ── dữ liệu phân tử ──────────────────────────────────────────────────────
// Một vòng n cạnh, tâm tại (cx,cy), bán kính r.
function ring(cx, cy, r, n, phase = 0) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = phase + i * Math.PI * 2 / n;
    out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return out;
}
const RP = 1 / (2 * Math.sin(Math.PI / 5));      // bán kính ngoại tiếp của ngũ giác cạnh 1
const AP = RP * Math.cos(Math.PI / 5);           // apothem của ngũ giác đó
const D = Math.PI / 180;

// Purine: một vòng sáu cạnh (C4-C5-C6-N1-C2-N3) dính một vòng năm cạnh
// (C5-N7-C8-N9-C4) — xương sống của cả adenosine lẫn caffeine.
function purine() {
  const hex = ring(0, 0, 1, 6);                   // C4 C5 C6 N1 C2 N3
  const A = [
    { el: 'C', p: hex[0] }, { el: 'C', p: hex[1] }, { el: 'C', p: hex[2] },
    { el: 'N', p: hex[3] }, { el: 'C', p: hex[4] }, { el: 'N', p: hex[5] },
  ];
  // vòng năm dính vào cạnh C4–C5, lệch ra ngoài: tâm nằm cách cạnh đó AP về
  // phía ngoài, nên C4 và C5 nằm đúng trên hai đỉnh của ngũ giác.
  const M = [(hex[0][0] + hex[1][0]) / 2, (hex[0][1] + hex[1][1]) / 2];
  const n = [0.866, 0.5];                        // pháp tuyến hướng ra ngoài
  const c = [M[0] + AP * n[0], M[1] + AP * n[1]];
  // góc pha để đỉnh số 1 rơi đúng vào C5 (174°) và đỉnh số 3 rơi đúng vào C4 (246°)
  const pent = ring(c[0], c[1], RP, 5, 102 * D);
  const A5 = { N7: pent[0], C5: pent[1], C4: pent[2], N9: pent[3], C8: pent[4] };
  A.push({ el: 'N', p: A5.N7 }, { el: 'C', p: A5.C8 }, { el: 'N', p: A5.N9 });
  const B = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 6], [6, 7], [7, 8], [8, 0]];
  return { A, B, c, hex };
}

// Adenosine: purine + một nhóm amin ở C6 + một vòng ribose (năm cạnh) ở N9
// + một nhóm hydroxyl ở C2'.
export function adenosineParts() {
  const P = purine();
  const A = P.A.slice(), B = P.B.slice();
  const push = (el, p) => { A.push({ el, p }); return A.length - 1; };
  // nhóm amin trên C6 (hex[2]), hướng ra ngoài tâm vòng
  const c6 = P.hex[2], l6 = Math.hypot(c6[0], c6[1]);
  const nA = push('N', [c6[0] / l6 * 1.95, c6[1] / l6 * 1.95]);
  B.push([2, nA]);
  // ribose: ngũ giác C1'–C2'–C3'–C4'–O4', dính vào N9, nằm ngoài purine
  const cen = [0, 0];
  for (const a of A) { cen[0] += a.p[0]; cen[1] += a.p[1]; }
  cen[0] /= A.length; cen[1] /= A.length;
  const n9 = A[8].p;
  let dx = n9[0] - cen[0], dy = n9[1] - cen[1];
  const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
  const c1 = [n9[0] + dx * 1.0, n9[1] + dy * 1.0];        // C1'
  const rc = [c1[0] + dx * RP, c1[1] + dy * RP];         // tâm vòng ribose
  const rib = ring(rc[0], rc[1], RP, 5, Math.atan2(c1[1] - rc[1], c1[0] - rc[0]));
  const i1 = push('C', rib[0]), i2 = push('C', rib[1]), i3 = push('C', rib[2]),
    i4 = push('C', rib[3]), i0 = push('O', rib[4]);
  B.push([8, i1], [i1, i2], [i2, i3], [i3, i4], [i4, i0], [i0, i1]);
  // hydroxyl trên C2' (rib[1]), hướng ra ngoài tâm ribose
  const c2 = rib[1]; let ox = c2[0] - rc[0], oy = c2[1] - rc[1];
  const ol = Math.hypot(ox, oy) || 1; ox /= ol; oy /= ol;
  const iOH = push('O', [c2[0] + ox * 0.95, c2[1] + oy * 0.95]);
  B.push([i2, iOH]);
  return { atoms: A, bonds: B };
}

// Caffeine: purine + ba nhóm metyl (ở N1, N3, N7) + hai nguyên tử oxy (ở C2, C6)
export function caffeineParts() {
  const P = purine();
  const A = P.A.slice(), B = P.B.slice();
  const push = (el, p) => { A.push({ el, p }); return A.length - 1; };
  const cen = [0, 0];
  for (const a of A) { cen[0] += a.p[0]; cen[1] += a.p[1]; }
  cen[0] /= A.length; cen[1] /= A.length;
  // hướng ra ngoài: với sáu nguyên tử của vòng lớn thì ra từ tâm vòng, với ba
  // nguyên tử của vòng năm thì ra từ tâm vòng năm (tâm purine không ở giữa nó)
  const out = (i) => {
    const p = A[i].p;
    const o = i < 6 ? [0, 0] : P.c;
    let dx = p[0] - o[0], dy = p[1] - o[1];
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  };
  const methyl = (i) => {
    const p = A[i].p, d = out(i);
    const k = push('C', [p[0] + d[0] * 0.95, p[1] + d[1] * 0.95]);
    B.push([i, k]);
  };
  const oxy = (i) => {
    const p = A[i].p, d = out(i);
    const k = push('O', [p[0] + d[0] * 0.95, p[1] + d[1] * 0.95]);
    B.push([i, k]);
  };
  methyl(3);        // N1
  methyl(5);        // N3
  methyl(6);        // N7
  oxy(4);           // C2
  oxy(2);           // C6
  return { atoms: A, bonds: B };
}

// ── dựng hình ────────────────────────────────────────────────────────────
// Một phân tử = các hình cầu (nguyên tử) + các ống trụ (liên kết), gộp thành
// từng hình theo nguyên tố để sau này nhân bản được (InstancedMesh).
export function moleculeParts(atoms, bonds, { rAtom = .17, rBond = .075 } = {}) {
  // tâm của phân tử: đặt mô hình vào tâm hình của nó, không phải tâm của vòng
  // purin — nếu không, phân tử sẽ lệch sang một bên khi ta đặt nó vào khía
  let cx = 0, cy = 0;
  for (const a of atoms) { cx += a.p[0]; cy += a.p[1]; }
  cx /= atoms.length; cy /= atoms.length;
  for (const a of atoms) { a.p[0] -= cx; a.p[1] -= cy; }

  const byEl = {};
  for (const a of atoms) {
    // nguyên tử là quả cầu NHIỀU MẶT, không phải cầu trơn: cầu trơn không có
    // góc để nét mực bám vào, nên phân tử trông như một đám hạt nhẵn nhụi
    const g = new THREE.IcosahedronGeometry(rAtom, 1);
    // các nguyên tử nằm trên trục xy: mô hình phân tử là một hình phẳng,
    // để nguyên tử nào cũng phải có z (bỏ trống là toạ độ NaN và hình không hiện)
    g.translate(a.p[0], a.p[1], a.p[2] ?? 0);
    (byEl[a.el] ??= []).push(g);
  }
  const Bs = [];
  for (const [i, j] of bonds) {
    const p = new THREE.Vector3(atoms[i].p[0], atoms[i].p[1], atoms[i].p[2] ?? 0);
    const q = new THREE.Vector3(atoms[j].p[0], atoms[j].p[1], atoms[j].p[2] ?? 0);
    const d = new THREE.Vector3().subVectors(q, p), L = d.length();
    const g = new THREE.CylinderGeometry(rBond, rBond, L, 6);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
    g.applyMatrix4(new THREE.Matrix4().compose(p.clone().add(q).multiplyScalar(.5), quat, new THREE.Vector3(1, 1, 1)));
    Bs.push(g);
  }
  const atomsGeo = {};
  for (const el in byEl) atomsGeo[el] = mergeGeometries(byEl[el]);
  return { atomsGeo, bondsGeo: mergeGeometries(Bs), n: atoms.length };
}

// Một lưới phân tử: `count` bản sao của cùng một phân tử, đặt được từng cái.
export function moleculeCloud(parts, { count = 1, scale = 1 } = {}) {
  const g = new THREE.Group();
  const meshes = [];
  for (const el in parts.atomsGeo) {
    const im = new THREE.InstancedMesh(parts.atomsGeo[el], toon(EL_COLOR[el]), count);
    im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); im.frustumCulled = false;
    g.add(im); meshes.push(im);
  }
  const bm = new THREE.InstancedMesh(parts.bondsGeo, toon('#7f86ad'), count);
  bm.instanceMatrix.setUsage(THREE.DynamicDrawUsage); bm.frustumCulled = false;
  g.add(bm); meshes.push(bm);
  const M = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  const Z = new THREE.Quaternion();
  g.set = (i, x, y, z, quat = null, sc = scale) => {
    p.set(x, y, z); q.copy(quat || Z); s.set(sc, sc, sc);
    M.compose(p, q, s);
    for (const m of meshes) m.setMatrixAt(i, M);
  };
  g.hide = (i) => {
    M.makeScale(0, 0, 0);
    for (const m of meshes) m.setMatrixAt(i, M);
  };
  g.flush = () => { for (const m of meshes) m.instanceMatrix.needsUpdate = true; };
  return g;
}
