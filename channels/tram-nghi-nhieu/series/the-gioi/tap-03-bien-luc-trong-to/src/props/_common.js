// Phần dùng chung của các vật dựng: dải màu trời, dải sóng, toạ độ.
// Tệp `_` này không có PROP: sửa nó là sửa mọi vật dùng nó, nên những vật
// đó được chấm lại (đúng như bản ghi props_catalog.digest ghi).
//
// Bối cảnh của tập — năm nơi chốn:
//   N1 · Sân thượng nhà, chiều muộn (và lúc xế chiều)
//   N2 · Trong không khí, ban ngày
//   N3 · Trong không khí, chiều muộn, nhìn ngược dọc theo tia
//   N4 · Từ không gian, quanh Trái Đất
//   N5 · Sát chân trời: dải nhạt và hạt bụi mờ
//
// Mọi vật ở đây là vật thật: lan can sắt có nan, thùng nước có nắp và mặt nước,
// cây chuối có lá cong, Trái Đất có lục địa. Thứ vô hình (ánh sáng bị rẽ, độ dài
// đường đi, lớp ozon) mới dựng thành hình minh hoạ: chùm sáng, thước đo, vỏ mỏng.
import * as THREE from 'three';
import { PAL, toon, canvasTex, fxLayer, mulberry, clamp } from '../../../../../rig/kit.js';

export const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

// ── bầu trời: một ảnh toàn cầu vẽ tay ───────────────────────────────────
// Dải màu theo độ cao (e = góc cao), mặt trời đặt đúng góc của nó.
// Vì bản đồ toàn cầu của three lấy u = atan2(z, x), mặt trời được đặt theo
// đúng công thức ấy, không đoán.
export function skyTexture({ stops, sunDir, sunCol, sunCore, sunR = 3.4, rays = 0, stars = 0 }) {
  const W = 3072, H = 1536;
  const t = canvasTex(W, H, (g) => {
    const grd = g.createLinearGradient(0, 0, 0, H);
    // e (độ) → vị trí trên canvas: e=90 ở hàng 0, e=0 ở hàng H/2
    const pos = e => (0.5 - e / 180) * H;
    [...stops].sort((a, b) => b[0] - a[0]).forEach(([e, c]) => grd.addColorStop(clamp(pos(e) / H, 0, 1), c));
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    if (stars > 0) {                       // sao: chỉ ở nửa trên của trời
      const r = mulberry(17);
      for (let i = 0; i < stars; i++) {
        const x = r() * W, y = r() * H * .48;
        const a = .25 + r() * .75, sz = r() < .12 ? 3.2 : 1.8;
        g.fillStyle = `rgba(255,246,225,${a * (1 - y / (H * .48))})`;
        g.beginPath(); g.arc(x, y, sz, 0, 7); g.fill();
      }
    }
    if (sunDir) {
      const x = (Math.atan2(sunDir.z, sunDir.x) / (Math.PI * 2) + .5) * W;
      const y = pos(Math.asin(clamp(sunDir.y, -1, 1)) * 180 / Math.PI);
      const r = sunR * (H / 180);
      // Tia mặt trời: mỗi tia là một tam giác nhọn, dài xen kẽ, mờ dần về đuôi.
      if (rays > 0) {
        g.save();
        g.globalCompositeOperation = 'lighter';
        g.translate(x, y);
        for (let i = 0; i < rays; i++) {
          const a = (i / rays) * Math.PI * 2 + .17;
          const long = i % 2 === 0;
          const len = r * (long ? 3.2 : 2.0);
          const wdt = r * (long ? .58 : .36);
          const gg = g.createRadialGradient(0, 0, r * .5, 0, 0, len);
          gg.addColorStop(0, sunCore + (long ? 'bb' : '77'));
          gg.addColorStop(.28, sunCol + (long ? '55' : '33'));
          gg.addColorStop(1, sunCol + '00');
          g.fillStyle = gg;
          g.save(); g.rotate(a);
          g.beginPath(); g.moveTo(r * .6, -wdt * .12); g.lineTo(len, 0); g.lineTo(r * .6, wdt * .12); g.closePath(); g.fill();
          g.restore();
        }
        // quầng sáng quanh đĩa
        const halo = g.createRadialGradient(0, 0, r * .9, 0, 0, r * 3.1);
        halo.addColorStop(0, sunCol + '44'); halo.addColorStop(1, sunCol + '00');
        g.fillStyle = halo; g.beginPath(); g.arc(0, 0, r * 3.1, 0, 7); g.fill();
        g.restore();
      }
      const gg = g.createRadialGradient(x, y, 0, x, y, r * 4.2);
      gg.addColorStop(0, sunCore); gg.addColorStop(.16, sunCol);
      gg.addColorStop(.38, sunCol + '88'); gg.addColorStop(1, sunCol + '00');
      g.fillStyle = gg; g.beginPath(); g.arc(x, y, r * 4.2, 0, 7); g.fill();
      g.fillStyle = sunCore; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
  });
  t.mapping = THREE.EquirectangularReflectionMapping;
  return t;
}

// Một dải sóng ánh sáng: ống tròn chạy theo đường sin.
export function waveRibbon({ len = .8, amp = .03, waves = 6, thick = .012, color = PAL.cyan }) {
  const pts = [];
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    pts.push(V3((u - .5) * len, Math.sin(u * Math.PI * 2 * waves) * amp, 0));
  }
  const g = new THREE.Group();
  const tube = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, thick, 6, false),
    toon(color, { emissive: new THREE.Color(color).multiplyScalar(.7), transparent: true, opacity: .95 }));
  fxLayer(tube); g.add(tube);
  return g;
}
