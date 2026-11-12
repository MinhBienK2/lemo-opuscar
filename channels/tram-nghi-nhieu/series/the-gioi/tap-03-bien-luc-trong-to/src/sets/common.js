// Phần dùng chung của các bối cảnh: dải màu trời, chùm sáng, dải sóng, thước đo.
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
import { PAL, toon, glowMat, canvasTex, TEX, rbox, mesh, fxLayer, mulberry, clamp, lerp } from '../../../../../rig/kit.js';
import { keyLight, ambience } from '../../../../../rig/lights.js';

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

// Một chùm sáng: những lát mỏng tròn xếp dọc trục, cộng dồn thành một thân sáng.
export function beamSlices({ n = 22, from, to, r0 = .55, r1 = .9, colorAt, opacity = .13 }) {
  const g = new THREE.Group();
  const A = V3(...from), B = V3(...to), dir = B.clone().sub(A);
  const q = new THREE.Quaternion().setFromUnitVectors(V3(0, 0, 1), dir.clone().normalize());
  const tex = TEX.radial('rgba(255,255,255,1)');
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const r = lerp(r0, r1, u);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2),
      new THREE.MeshBasicMaterial({
        map: tex, color: colorAt(u), transparent: true, opacity,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide,
      }));
    m.position.copy(A).addScaledVector(dir, u);
    m.quaternion.copy(q);
    m.renderOrder = 6; fxLayer(m); g.add(m);
  }
  return g;
}

// Một thân chùm sáng: vỏ trụ trong suốt, mềm ở mép, chạy dọc trục.
// Các lát đĩa của beamSlices chỉ đọc được khi nhìn DỌC theo chùm; nhìn ngang
// thì chúng chồng thành một đường. Thân trụ thì đọc được cả hai chiều: nhìn
// ngang thành một sợi sáng nằm ngang, nhìn dọc thành một ống sáng.
export function beamShaft({ from, to, r0 = .12, r1 = .18, color = '#ffffff', opacity = .16, seg = 20 }) {
  const A = V3(...from), B = V3(...to);
  const dir = B.clone().sub(A), len = dir.length();
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(r1, r0, len, seg, 1, true);
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color), transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, side: THREE.DoubleSide,
  });
  // mép vỏ trụ mờ dần: chỗ nào mặt trụ quay ngang về máy thì sáng thêm
  mat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_maps>',
      '#include <normal_fragment_maps>\n  diffuseColor.a *= 1.5 * pow(smoothstep(0., 1., abs(dot(normalize(normal), normalize(vViewPosition)))), 1.4);');
  };
  mat.customProgramCacheKey = () => 'beam-shaft-soft';
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(A).addScaledVector(dir, .5);
  m.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().normalize());
  m.renderOrder = 6; fxLayer(m); g.add(m);
  return g;
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

// Một thước đo có vạch: thanh dài + các vạch nhô lên.
export function ruler({ len = 20, ticks = 39, mat }) {
  const g = new THREE.Group();
  const rod = new THREE.Mesh(new THREE.BoxGeometry(len, .09, .09), mat);
  rod.castShadow = true; g.add(rod);
  for (let i = 0; i < ticks; i++) {
    const x = -len / 2 + (i + .5) * (len / ticks);
    const big = i % 5 === 0;
    const b = new THREE.Mesh(new THREE.BoxGeometry(.022, big ? .22 : .13, .10), mat);
    b.position.set(x, .11, 0); b.castShadow = true; g.add(b);
  }
  return g;
}

