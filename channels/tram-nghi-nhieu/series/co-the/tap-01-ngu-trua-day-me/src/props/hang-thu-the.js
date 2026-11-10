// Bức màng của tế bào phía bên kia, và trên đó một hàng thụ thể.
// Mỗi thụ thể là một protein có túi: một ống xuyên qua lớp protein, quay
// miệng ống về phía khe. Phân tử adenosine bám vào miệng ống đó; cà phê chen
// vào đúng chỗ, nên adenosine không còn chỗ bám nữa.
//
// Mặt trước của màng quay về +z (ra khe). Các thụ thể xếp dọc theo trục x,
// nên từ trong khe nhìn ra, chúng thành một hàng cửa đối diện.
import * as THREE from 'three';
import { toon, rbox, mesh, canvasTex, surface } from '../../../../../rig/kit.js';
import { mangTeBao } from './mang-te-bao.js';
import { inkRim } from './_ink-rim.js';

// Màng tế bào: một mảnh mờ, có sợi và lỗ chân tay, để khối tím không phải
// một mặt phẳng trơn. Màu sáng hơn nền để đường viền đọc ra.
const memTexture = () => canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#3a3070'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * w, y = Math.random() * h, r = 6 + Math.random() * 26;
    g.fillStyle = `rgba(${120 + Math.random() * 60 | 0},${100 + Math.random() * 50 | 0},${190 + Math.random() * 50 | 0},${.05 + Math.random() * .10})`;
    g.beginPath(); g.ellipse(x, y, r, r * (.5 + Math.random() * .6), Math.random() * 3, 0, 6.3); g.fill();
  }
  // sợi màng: những đường cong mảnh chạy chéo qua
  g.strokeStyle = 'rgba(210,200,255,.16)'; g.lineWidth = 2; g.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
    g.beginPath();
    let x = Math.random() * w, y = Math.random() * h;
    g.moveTo(x, y);
    for (let k = 0; k < 5; k++) { x += (Math.random() - .4) * 70; y += (Math.random() - .5) * 70; g.lineTo(x, y); }
    g.stroke();
  }
  // lỗ chân tay: những vòng tròn sẫm, như lỗ trên màng tế bào
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * w, y = Math.random() * h, r = 4 + Math.random() * 9;
    g.fillStyle = 'rgba(28,20,62,.45)';
    g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill();
    g.strokeStyle = 'rgba(200,190,255,.18)'; g.lineWidth = 2;
    g.beginPath(); g.arc(x, y, r, 0, 6.3); g.stroke();
  }
});

// Một khối lumpy — protein hay màng đều phải có hình khối lổm lõm, không
// phải hộp có nắp hay viên thuốc đặt trên chân.
const lump = (rx, ry, rz, seed, amp = .18, lumps = 3) => surface(30, 22, (u, v) => {
  const phi = u * Math.PI * 2, theta = (1 - v) * Math.PI;
  const st = Math.sin(theta), ct = Math.cos(theta);
  const n = 1 + amp * Math.sin(phi * lumps + seed) + amp * .55 * Math.cos(ct * lumps * 2 + seed * 1.7);
  return [st * Math.cos(phi) * rx * n, ct * ry * n, st * Math.sin(phi) * rz * n];
});

// Một cái "chén" lumpy: miệng chén quay về phía khe, trong chén tối. Đây là
// hình một protein có túi — nhìn thấy rõ chỗ phân tử sẽ nằm.
const bowl = (rad, depth, seed, amp = .15) => surface(36, 22, (u, v) => {
  const phi = u * Math.PI * 2, theta = (1 - v) * Math.PI * .5;
  const st = Math.sin(theta), ct = Math.cos(theta);
  const n = 1 + amp * Math.sin(phi * 3 + seed) + amp * .55 * Math.cos(phi * 5 - seed);
  return [st * Math.cos(phi) * rad * n, st * Math.sin(phi) * rad * n, -ct * depth * n];
});

// Một thụ thể: một protein có túi, miệng túi quay về phía khe. Phân tử
// adenosine nằm trong miệng túi đó; cà phê chen vào đúng chỗ.
export function thuThe({ size = .44, color = '#f0b93c', rimColor = '#a8702f', seed = 1 } = {}) {
  const g = new THREE.Group();
  const m = inkRim(toon(color));
  const dark = toon('#3b2f6b');          // trong túi phải tối hơn miệng túi, nhưng
                                          // không đen tuyệt đối: đen tuyệt đối đọc
                                          // như một lỗ hình học chứ không phải hõm
  const r = size * .64;                  // bán kính miệng túi
  // vỏ ngoài: miệng quay về +z, thân chìm vào màng
  g.add(mesh(bowl(r, r * .62, seed), m, [0, 0, 0]));
  // lòng túi: một mảng tối nằm sâu trong miệng túi, để người xem thấy đó
  // là hõm chứ không phải chỗ trống thấy màng
  g.add(mesh(lump(r * .74, r * .74, r * .07, seed + 5, .12), dark, [0, 0, -r * .16]));
  // vành miệng túi: một vòng dày lệch nhẹ, nét mực bám vào đó nên miệng
  // túi có đường viền rõ, không tan vào nền
  const rim = mesh(new THREE.TorusGeometry(r * .95, r * .085, 8, 26), inkRim(toon(rimColor), { power: 1.6, amount: 1.1, max: .7 }), [0, 0, -r * .04]);
  rim.rotation.z = seed * .7;
  rim.scale.set(1, 1, 1);
  g.add(rim);
  // miệng khía: chỗ phân tử sẽ nằm, hơi lùi vào trong túi
  g.notch = new THREE.Vector3(0, 0, r * .30);
  return g;
}

// Cả hàng: màng đứng + khối tế bào phía sau + các thụ thể trên màng.
export function hangThuThe({ n = 5, spacing = .44, size = .38 } = {}) {
  const g = new THREE.Group();
  const W = n * spacing + 2.6;
  const H = 4.2;
  const memMat = toon('#ffffff', { map: memTexture(), side: THREE.DoubleSide });
  // khối tế bào phía sau màng: to và méo méo, có vân sợi — không phải một
  // hộp sẫm có cạnh thẳng, vì hộp sẫm đọc như một mảng đen phẳng
  const backTex = memTexture(); backTex.repeat.set(4, 3);
  const backMat = toon('#ffffff', { map: backTex, side: THREE.DoubleSide });
  g.add(mangTeBao({
    w: W + 3.4, h: H + 3.4, cell: .55, depth: .075, nu: 120, nv: 96, axis: 'z', mat: backMat,
    base: (u, v, d, px, py) => {
      const bulge = .26 * Math.sin(u * 4.3 + .6) * Math.cos(v * 3.1)
        + .14 * Math.sin(v * 7.7 + u * 2.3) + .09 * Math.cos(u * 11.1);
      return [px, py, -1.5 + bulge + d];
    },
  }).translateY(-.25));
  // lớp màng trước: một mặt cong lượn sóng, biên méo — không phải một tấm
  // bảng đứng thẳng. Nằm sau các thụ thể, màng là nền, không phải chủ thể.
  g.add(mangTeBao({
    w: W, h: H, cell: .34, depth: .050, nu: 130, nv: 100, axis: 'z', mat: memMat,
    base: (u, v, d, px, py) => {
      const ex = 1 + .11 * Math.sin(v * 5.3);
      const ey = 1 + .09 * Math.sin(u * 4.7 + 1.2);
      const bulge = .09 * Math.sin(u * 5.1 + .4) * Math.cos(v * 3.7)
        + .05 * Math.sin(u * 12.3 + v * 6.1) + .04 * Math.sin(v * 9.4 - u * 3.2);
      return [px * ex, py * ey - .06, -.22 + bulge + d];
    },
  }));

  // các thụ thể mọc lên từ màng, xếp theo chiều ngang — cỡ khác nhau, màu
  // khác nhau và nghiêng nghiêng. Năm cái túi giống hệt nhau đứng thành hàng
  // đọc ra là một dãy vòng treo, không phải một hàng thụ thể thật.
  const doors = [];
  const rnd = (i, s) => Math.abs((Math.sin(i * 12.9898 + s * 78.233) * 43758.5453) % 1);
  // bốn sắc độ khác nhau: một cái vàng, một cái cam sẫm, một cái nhạt, một
  // cái cam. Cùng một sắc thì bao túi đứng cạnh nhau thành một khối đồng màu.
  const COLORS = [
    { c: '#f0b93c', rim: '#a8702f' },   // vàng
    { c: '#e0763c', rim: '#96491f' },   // cam sẫm
    { c: '#e6d089', rim: '#a08a44' },   // nhạt
    { c: '#e8a04a', rim: '#9c5a28' },   // cam
  ];
  for (let i = 0; i < n; i++) {
    const j = (k) => rnd(i, k);
    const sz = size * (.76 + .48 * j(1));
    const x = (i - (n - 1) / 2) * spacing + (j(2) - .5) * .06;
    const y = .12 + (j(3) - .5) * .14;
    const tilt = (j(4) - .5) * .26;
    // màng phồng lên quanh chân thụ thể: protein mọc ra từ màng, không
    // đặt trên màng
    const bulge = mesh(lump(sz * .46, sz * .42, sz * .14, i * 3 + 5, .20), memMat, [x, y - .02, -.10]);
    bulge.rotation.z = tilt * .6;
    g.add(bulge);
    const col = COLORS[i % COLORS.length];
    const d = thuThe({ size: sz, color: col.c, rimColor: col.rim, seed: i * 5 + 1 });
    d.position.set(x, y, .02);
    d.rotation.z = tilt;
    d.rotation.y = (j(5) - .5) * .24;
    g.add(d);
    doors.push({ d, notch: d.notch.clone() });
  }
  g.doors = doors;
  return g;
}

export const PROP = { name: 'hàng thụ thể', view: () => hangThuThe() };
