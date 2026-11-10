// Chiếc đĩa rỗng trên bàn đầu giường: bằng chứng cho "không có gì ăn".
// Nó là một vật trong danh mục (PROP), để thẻ "KHÔNG ĂN" có mã neo chỉ đúng vật.
import * as THREE from 'three';
import { toon, mesh } from '../../../../../rig/kit.js';

export function diaRong() {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(.115, .100, .022, 32), toon('#e9e2cf'), [0, .011, 0]));
  g.add(mesh(new THREE.TorusGeometry(.112, .014, 8, 28), toon('#d5cbb0'), [0, .021, 0], { rot: [Math.PI / 2, 0, 0] }));
  return g;
}

export const PROP = { name: 'đĩa rỗng', view: () => diaRong() };
