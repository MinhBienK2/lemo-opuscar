// Dải sóng ánh sáng: sóng ngắn (xanh, rẽ mạnh) và sóng dài (đỏ, rẽ yếu).
//
// Dải là một DẢI PHẲNG mỏng uốn sóng trong một mặt phẳng NGHIÊNG, nên nhìn
// từ cả ba góc — chéo, ngang tầm mắt, từ trên xuống — đều thấy lề sóng. Trước
// đây dải là một ống tròn nằm trong mặt phẳng thẳng đứng: nhìn ngang chỉ
// thấy một thanh thẳng, sóng chỉ hiện khi nhìn từ trên xuống, và ống lại
// dày hơn cả biên độ sóng nên đỉnh sóng gấp vào nhau — đọc ra là thân trụ
// đốt lặp chứ không phải là sóng.
//
// Ba quy tắc của dải này:
//  1. Dải uốn sóng trong mặt phẳng nghiêng: biên độ nhìn thấy được từ mọi
//     góc quanh, nên sóng luôn đếm được bằng mắt.
//  2. Dải là ÁNH SÁNG: nằm ở lớp fx (không viền mực) và thân dải trong suốt,
//     có một lõi sáng chạy dọc đường giữa. Đọc ra là ánh sáng, không phải
//     một thân đặc.
//  3. Sóng BÁM vào quả cầu hạt ở giữa dải: sóng là thứ mà hạt đó ném ra.
//
// Dải xanh uốn chín lần, dải đỏ uốn một lần — đếm được bằng mắt.
import * as THREE from 'three';
import { toon, mesh, glowMat, fxLayer } from '../../../../../rig/kit.js';

// Mặt phẳng uốn sóng nghiêng: sóng đi lên WY và ra sau WZ. Vì nghiêng, cả
// góc ngang tầm mắt (thấy phần WY) lẫn góc nhìn từ trên xuống (thấy phần
// WZ) đều thấy lề sóng.
const WY = .8, WZ = .6;

// Dải phẳng uốn sóng: lát cắt vuông (bề rộng `width` theo phương vuông góc
// mặt phẳng uốn, bề dày `depth` nằm trong mặt phẳng) đi theo đường sóng.
// Bề rộng nằm theo phương vuông góc mặt phẳng nên hai lề dải không giao
// nhau ở đỉnh sóng — dải không gấp, vẫn là một dải.
export function waveStrip({ len = .8, amp = .03, waves = 6, width = .012, depth = .004 }) {
  const N = 260;
  const C = [], T = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const d = Math.sin(u * Math.PI * 2 * waves) * amp;
    C.push(new THREE.Vector3((u - .5) * len, d * WY, d * WZ));
  }
  for (let i = 0; i <= N; i++) {
    const a = C[Math.max(0, i - 1)], b = C[Math.min(N, i + 1)];
    T.push(new THREE.Vector3().subVectors(b, a).normalize());
  }
  const U = new THREE.Vector3(0, -WZ, WY);           // vuông góc mặt phẳng uốn
  const pos = [], nor = [];
  const quad = (p0, p1, p2, p3) => {
    const n = new THREE.Vector3().subVectors(p1, p0).cross(new THREE.Vector3().subVectors(p3, p0)).normalize();
    for (const p of [p0, p1, p2, p0, p2, p3]) { pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z); }
  };
  const ring = i => {
    const V = new THREE.Vector3().crossVectors(U, T[i]).normalize();  // trong mặt phẳng, vuông góc tiếp tuyến
    const uu = U.clone().multiplyScalar(width / 2), vv = V.clone().multiplyScalar(depth / 2);
    return [
      C[i].clone().add(uu).add(vv),
      C[i].clone().sub(uu).add(vv),
      C[i].clone().sub(uu).sub(vv),
      C[i].clone().add(uu).sub(vv),
    ];
  };
  const R = [];
  for (let i = 0; i <= N; i++) R.push(ring(i));
  for (let i = 0; i < N; i++) {
    const a = R[i], b = R[i + 1];
    quad(a[0], b[0], b[1], a[1]);   // mặt trên
    quad(a[2], b[2], b[3], a[3]);   // mặt dưới
    quad(a[1], b[1], b[2], a[2]);   // mép -U
    quad(a[3], b[3], b[0], a[0]);   // mép +U
  }
  quad(R[0][0], R[0][1], R[0][2], R[0][3]);         // đầu dải
  quad(R[N][0], R[N][3], R[N][2], R[N][1]);         // cuối dải
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return g;
}

export function daiSongAnhSang(opts = {}) {
  const {
    waves = 9, amp = .024, len = .62, thick = .014,
    color = '#8fe4ff', dotColor = '#dff4ff', dotGlow = '#7fd8ff', dotK = .6,
    at = { x: 0, y: 0, z: 0 },
  } = opts;
  const g = new THREE.Group(); g.name = 'dải sóng ánh sáng';
  g.position.set(at.x, at.y, at.z);

  // hạt mà sóng bám vào: một quả cầu toon phát sáng nhẹ. Cầu nhỏ hơn trước
  // một chút để dải sóng không bị cầu nuốt mất.
  const dot = mesh(new THREE.SphereGeometry(.044, 16, 12),
    toon(dotColor, { emissive: new THREE.Color(dotGlow).multiplyScalar(dotK) }), [0, 0, 0]);
  g.add(dot);

  const ribbon = new THREE.Group();
  ribbon.name = 'dải sóng';
  // Bề rộng dải nhỏ hơn biên độ sóng: nhìn ngang, lề trên và lề dưới của
  // dải vẽ ra hình sin, nên sóng đếm được bằng mắt.
  const w = amp * .60;
  const d = Math.min(thick * .28, w * .35);

  // Thân dải: mỏng, trong, có mặt trên và mặt dưới → đọc ra là ánh sáng có
  // bề dày, không phải một thân đặc. Màu giữ no, không cháy thành trắng.
  const band = new THREE.Mesh(waveStrip({ len, amp, waves, width: w, depth: d }),
    toon(color, {
      transparent: true, opacity: .58, side: THREE.DoubleSide, depthWrite: false,
      emissive: new THREE.Color(color).multiplyScalar(.12),
    }));
  ribbon.add(band);

  // Lõi sáng: một sợi mảnh chạy dọc đường giữa dải. Sáng vừa phải để còn
  // màu, không trắng bệch.
  const core = new THREE.Mesh(waveStrip({ len, amp, waves, width: d * 1.6, depth: d * 1.6 }),
    glowMat(color, 1.15, { transparent: true, opacity: .95, depthWrite: false, side: THREE.DoubleSide }));
  ribbon.add(core);

  // Quầng mờ: lớp sáng loãng quanh dải, cho dải có quang.
  const halo = new THREE.Mesh(waveStrip({ len, amp, waves, width: w * 2.6, depth: d * .5 }),
    glowMat(color, .75, { transparent: true, opacity: .18, depthWrite: false, side: THREE.DoubleSide }));
  ribbon.add(halo);

  fxLayer(ribbon);
  g.add(ribbon);

  g.userData.parts = { dot, ribbon };
  return g;
}

// Ảnh vật: một dải sóng phóng to (chín lần uốn, như dải xanh của phim),
// quả cầu của hạt nằm giữa dải.
export const PROP = {
  name: 'dải sóng ánh sáng',
  view: () => daiSongAnhSang({ waves: 9, amp: .05, len: .9, thick: .022 }),
};
