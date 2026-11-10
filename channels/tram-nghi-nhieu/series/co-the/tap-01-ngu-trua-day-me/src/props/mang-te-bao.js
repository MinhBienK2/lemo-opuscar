// Màng tế bào: bề mặt chia thành các tế bào hình đa giác, méo theo một lưới
// nhiễu, giữa các tế bào là rãnh hẹp. Đây là cách bề mặt tế bào thật trông:
// một mảng phẳng đơn sắc đọc ra là một tấm bìa, không phải là màng.
//
// Rãnh giữa các tế bào cũng là nơi nét mực bám vào — nên màng này vừa đúng
// vật, vừa cho khung hình có đường viền vẽ tay.
import * as THREE from 'three';
import { toon, mesh, mulberry, canvasTex, surface, clamp } from '../../../../../rig/kit.js';

// hạt mô: dùng chung cho mọi màng tế bào trong tập này
export function mangTeBao({
  w = 3, h = 3, seed = 2, cell = .42, depth = .05,
  nu = 110, nv = 84, axis = 'z', mat = null, base = null,
} = {}) {
  const rnd = mulberry(seed);
  // hạt seed nằm trên lưới, lệch nhau → các tế bào méo như tế bào thật
  const seeds = [];
  const nx = Math.max(2, Math.round(w / cell)), ny = Math.max(2, Math.round(h / cell));
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) {
    seeds.push([
      ((i + .5 + (rnd() - .5) * .85) / (nx + 1)) * w - w / 2,
      ((j + .5 + (rnd() - .5) * .85) / (ny + 1)) * h - h / 2,
    ]);
  }
  // ở mỗi điểm, tìm hai hạt gần nhất: ranh giới giữa hai tế bào nằm trên
  // đường trung trực của chúng → khoảng cách tới ranh giới ≈ (d2 - d1)/2
  const relief = (x, y) => {
    let d1 = 1e9, d2 = 1e9;
    for (const [sx, sy] of seeds) {
      const d = (x - sx) * (x - sx) + (y - sy) * (y - sy);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
    }
    const f = clamp((Math.sqrt(d2) - Math.sqrt(d1)) / (cell * .42));
    return depth * Math.pow(f, .65);          // 0 ở rãnh, 1 ở giữa tế bào
  };
  const geo = surface(nu, nv, (u, v) => {
    const px = (u - .5) * w, py = (v - .5) * h;
    const d = relief(px, py);
    if (base) return base(u, v, d, px, py);
    return axis === 'x' ? [d, py, px] : [px, py, d];
  });
  const m = mesh(geo, mat ?? toon('#ffffff'), [0, 0, 0], { recv: true });
  return m;
}

// da màng: tím lạnh, có sợi và lỗ chân tăm
export const daMang = (seed = 5) => canvasTex(512, 512, (g, w, h) => {
  const r = mulberry(seed);
  g.fillStyle = '#4a3f8c'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 800; i++) {
    const x = r() * w, y = r() * h, rad = 6 + r() * 28;
    g.fillStyle = `rgba(${120 + r() * 60 | 0},${100 + r() * 50 | 0},${200 + r() * 50 | 0},${.05 + r() * .12})`;
    g.beginPath(); g.ellipse(x, y, rad, rad * (.4 + r() * .8), r() * 3, 0, 6.3); g.fill();
  }
  g.strokeStyle = 'rgba(60,42,120,.35)'; g.lineWidth = 3;
  for (let i = 0; i < 34; i++) {
    g.beginPath();
    let x = r() * w, y = r() * h;
    g.moveTo(x, y);
    for (let k = 0; k < 5; k++) { x += (r() - .4) * 80; y += (r() - .5) * 80; g.lineTo(x, y); }
    g.stroke();
  }
  for (let i = 0; i < 70; i++) {            // lỗ chân tăm
    const x = r() * w, y = r() * h, rad = 4 + r() * 10;
    g.fillStyle = 'rgba(30,20,66,.45)';
    g.beginPath(); g.arc(x, y, rad, 0, 6.3); g.fill();
    g.strokeStyle = 'rgba(205,195,255,.20)'; g.lineWidth = 2;
    g.beginPath(); g.arc(x, y, rad, 0, 6.3); g.stroke();
  }
});

export const PROP = { name: 'màng tế bào', view: () => mangTeBao({ w: 2, h: 2, mat: toon('#ffffff', { map: daMang() }) }) };
