// Cây góc phòng: một chậu gốm có đất, mấy cọng rồng ra từ đất, và lá ở đầu
// cọng.
//
// Vì sao dựng riêng thay vì dùng cây sẵn có của rig: ở bản sẵn có, lá nằm
// lơ lửng trên không, cách miệng chậu một khoảng hở, chậu trống trơn không
// có đất, và không có cọng nào nối lá với chậu. Người xem thấy vậy đọc là
// "một cụm lá bay trước một cái chậu", không phải cây.
import * as THREE from 'three';
import { toon, mesh, mulberry } from '../../../../../rig/kit.js';

export function cayGocPhong({ pot = '#d9774a', seed = 31, n = 9 } = {}) {
  const g = new THREE.Group();
  const r = mulberry(seed);

  // ── chậu: thân hình nón cụt + vành miệng ──────────────────────────────
  const clay = toon(pot);
  const clayDark = toon('#a85a35');
  g.add(mesh(new THREE.CylinderGeometry(.105, .078, .19, 20), clay, [0, .095, 0]));
  g.add(mesh(new THREE.CylinderGeometry(.112, .112, .022, 20), clayDark, [0, .185, 0]));
  // đất: một mặt tròn sẫm ngay dưới vành miệng
  g.add(mesh(new THREE.CircleGeometry(.098, 20), toon('#4a3226'), [0, .193, 0], { rot: [-Math.PI / 2, 0, 0] }));

  // ── cọng và lá ─────────────────────────────────────────────────────────
  // mỗi cọng mọc ra từ mặt đất, hơi nghiêng, và lá nằm ở đầu cọng — không
  // có lá nào lơ lửng.
  const stemM = toon('#3f7a35');
  const leafM = [toon('#3f8a3a'), toon('#4f9c46'), toon('#357a32')];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r() * .5;
    const lean = .05 + r() * .07;
    const len = .20 + r() * .13;
    const top = new THREE.Vector3(Math.cos(a) * lean, .19 + len, Math.sin(a) * lean);
    const mid = new THREE.Vector3(Math.cos(a) * lean * .4, .19 + len * .62, Math.sin(a) * lean * .4);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, .17, 0), mid, top,
    ]);
    const stem = mesh(new THREE.TubeGeometry(curve, 10, .0075, 6, false), stemM, [0, 0, 0]);
    g.add(stem);
    // lá: một quả cầu dẹt ở đầu cọng, nghiêng theo hướng cọng
    const leaf = mesh(new THREE.SphereGeometry(.048, 10, 8), leafM[i % 3], [top.x, top.y, top.z]);
    leaf.scale.set(1, .34, .72);
    leaf.rotation.set(r() * .8 - .4, a, .5 + r() * .4);
    g.add(leaf);
  }
  g.name = 'cay-goc-phong';
  return g;
}

export const PROP = { name: 'cây góc phòng', view: () => cayGocPhong() };
