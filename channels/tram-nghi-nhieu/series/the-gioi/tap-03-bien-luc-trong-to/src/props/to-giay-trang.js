// Tờ giấy trắng vắt trên thanh tay vịn: một đoạn nằm trên mặt trên của
// thanh, một đuôi rủ xuống phía trước (chỗ máy nhìn thấy), một đuôi thú ra
// sau. Tờ giấy KHÔNG lơ lửng trên không — nó chạm vào lan can và bóng của
// nó đổ lên thanh.
import * as THREE from 'three';
import { toon, canvasTex, mulberry } from '../../../../../rig/kit.js';
import { V3 } from './_common.js';

let _paper;

const paperTex = () => (_paper ||= canvasTex(512, 512, (g, w, h) => {
  const r = mulberry(8);
  g.fillStyle = '#f2ece0'; g.fillRect(0, 0, w, h);
  for (let k = 0; k < 12000; k++) { g.fillStyle = `rgba(70,70,100,${r() * .05})`; g.fillRect(r() * w, r() * h, 3, 1); }
  g.strokeStyle = 'rgba(120,110,100,.22)'; g.lineWidth = 5;   // nếp gấp
  g.beginPath(); g.moveTo(w * .38, 0); g.lineTo(w * .62, h); g.stroke();
}));

export function toGiayTrang(opts = {}) {
  const g = new THREE.Group();
  // Mặc định là GIẤY TRẮNG: bối cảnh phim đổi màu theo giờ (trắng lúc chiều
  // muộn, cam lúc nắng thấp, xanh nhạt lúc xế chiều) nên nó luôn truyền màu
  // vào; còn vật thì mặc định là một tờ giấy trắng.
  const paperMat = toon(opts.color ?? '#f6f1e4', { map: paperTex(), side: THREE.DoubleSide });
  const PW = .42;                                  // bề ngang tờ giấy
  // đường đi của mặt giấy trong mặt phẳng (z, y), tính từ thanh tay vịn
  const drape = [
    [+0.100, 0.775],   // mép dưới, phía trước
    [+0.110, 0.980],
    [+0.098, 1.150],
    [+0.080, 1.226],   // bắt đầu nếp gấp, nằm trên mặt trên của thanh vịn
    [+0.020, 1.246],
    [-0.055, 1.238],
    [-0.090, 1.190],
    [-0.112, 1.055],   // đuôi sau
  ];
  const drapeCurve = new THREE.CatmullRomCurve3(
    drape.map(p => V3(0, p[1], p[0])), false, 'catmullrom', .4);
  const NP = 44, NX = 8;
  const gPos = [], gUv = [], gIdx = [];
  for (let i = 0; i <= NP; i++) {
    const t = i / NP;
    const p = drapeCurve.getPoint(t);
    const tg = drapeCurve.getTangent(t);
    // pháp tuyến của mặt giấy trong mặt phẳng (z, y)
    const nz = tg.y, ny = -tg.z;
    for (let j = 0; j <= NX; j++) {
      const u = j / NX;
      const x = (u - .5) * PW;
      // mép giấy hơi gợn, và sóng nhẹ dọc theo tờ giấy
      const wob = Math.sin(t * 6.7 + u * 2.6) * .007 + Math.sin(u * Math.PI) * .010;
      gPos.push(x, p.y + ny * wob, p.z + nz * wob);
      gUv.push(u, t);
    }
  }
  for (let i = 0; i < NP; i++) {
    for (let j = 0; j < NX; j++) {
      const a = i * (NX + 1) + j, b = a + 1, c = a + NX + 1, d = c + 1;
      // Chiều quấn: mặt trước của tờ giấy quay về phía máy (+z). Nếu quấn ngược,
      // pass chiều sâu của rig cắt mặt sau → đường viền mực của lan can và thùng
      // nước lọt qua tờ giấy.
      gIdx.push(a, b, c, b, d, c);
    }
  }
  const paperGeo = new THREE.BufferGeometry();
  paperGeo.setAttribute('position', new THREE.Float32BufferAttribute(gPos, 3));
  paperGeo.setAttribute('uv', new THREE.Float32BufferAttribute(gUv, 2));
  paperGeo.setIndex(gIdx);
  paperGeo.computeVertexNormals();
  const paper = new THREE.Mesh(paperGeo, paperMat);
  paper.castShadow = true; paper.receiveShadow = true;
  g.add(paper);
  return g;
}

export const PROP = { name: 'tờ giấy trắng vắt trên lan can', view: () => toGiayTrang() };
