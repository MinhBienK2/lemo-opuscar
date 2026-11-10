// Tách cà phê: thân gốm, quai, mặt cà phê, và cái đĩa lót.
//
// `empty: true` dựng một tách KHÔNG có cà phê: nhìn xuống thấy đáy tách,
// không có mặt nước nào. Cần vì trong câu so sánh "người uống cà phê" và
// "người không uống cà phê", hai tách phải nhìn ra khác nhau ngay.
import * as THREE from 'three';
import { PAL, toon, rbox, mesh } from '../../../../../rig/kit.js';

export function tachCaPhe({ color = '#e8dcc4', drink = '#4a2a12', saucer = true, empty = false, foam = '#a9763f' } = {}) {
  const g = new THREE.Group();
  const body = toon(color);
  // thân tách: hơi thắt eo, miệng hơi loe
  const prof = [[0, 0], [.062, 0], [.070, .012], [.074, .05], [.078, .10], [.076, .145],
    [.070, .162], [.066, .166], [.062, .160], [.066, .145], [.070, .10], [.066, .05], [.060, .014], [0, .012]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  g.add(mesh(new THREE.LatheGeometry(prof, 28), body, [0, 0, 0]));
  // quai
  g.add(mesh(new THREE.TorusGeometry(.042, .012, 10, 22, Math.PI * 1.25), body, [.080, .085, 0], { rot: [0, Math.PI / 2, -0.35] }));
  if (empty) {
    // tách rỗng: đáy tách thấp hơn miệng, và không có váng nào ở miệng
    g.add(mesh(new THREE.CircleGeometry(.058, 28), toon('#e9e3d6'), [0, .052, 0], { rot: [-Math.PI / 2, 0, 0] }));
  } else {
    // mặt cà phê
    g.add(mesh(new THREE.CircleGeometry(.064, 28), toon(drink), [0, .150, 0], { rot: [-Math.PI / 2, 0, 0] }));
    // váng kem nhạt trên mặt
    g.add(mesh(new THREE.CircleGeometry(.040, 24), toon(foam), [.012, .152, .006], { rot: [-Math.PI / 2, 0, 0] }));
  }
  if (saucer) {
    const sp = [[0, 0], [.085, 0], [.105, .008], [.118, .026], [.118, .034], [.104, .022], [.082, .014], [0, .012]]
      .map(([x, y]) => new THREE.Vector2(x, y));
    g.add(mesh(new THREE.LatheGeometry(sp, 30), toon('#f2ece0'), [0, -.012, 0]));
  }
  return g;
}

export const PROP = { name: 'tách cà phê', view: () => tachCaPhe() };
