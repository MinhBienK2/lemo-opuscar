// Khối mô não: một quả não đúng nghĩa, không phải một tảng đá.
//
// Cấu trúc:
//  · VỎ NÃO là một quả trứng dẹt đáy, hẹp ở trán, rộng ở sau.
//  · NẾP CUỘN là những dải tròn nổi lên, RÃNH (sulcus) là khe hẹp giữa
//    chúng. Cùng một hàm quyết định cả hình lẫn màu: chỗ nào nếp nhô lên
//    thì chỗ đó cũng là chỗ rãnh tô sẵn tối trên da.
//  · RÃNH GIỮA chạy dọc, sâu và hẹp, chia não thành hai bán cầu.
//  · Rãnh được TÔ SẴN tối trên da não, không chỉ trông bằng bóng: một quả
//    não mà rãnh không tối thì đọc ra là một cục sơn.
//  · TIỂU NÃO: khối nhỏ có lá mảnh, thấp ở phía sau. THÂN NÃO: cột nhỏ ở
//    phía trước dưới.
//
// Nếp cuộn còn là thứ SÓNG: lúc ngủ sóng chậm, nếp phồng lên theo một sóng
// chạy ngang qua não rồi xẹp dần (g.wave(t, k)).
import * as THREE from 'three';
import { toon, mesh, surface, canvasTex, mulberry, clamp, ss } from '../../../../../rig/kit.js';
import { inkRim } from './_ink-rim.js';

// thang màu của riêng khối não: bóng đậm hơn thang chung của kênh, để rãnh
// giữa các nếp có một bóng thật chứ không tan vào màu da não.
const gradNao = (() => {
  const steps = [.16, .44, .74, 1.0];
  const d = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => { const c = Math.round(v * 255); d.set([c, c, c, 255], i * 4); });
  const t = new THREE.DataTexture(d, steps.length, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();

// ── nếp cuộn: tổng của năm sóng thẳng, nghiêng theo năm hướng ─────────
//
// Nếp não là những đường đồng mức uốn khúc, quanh co. Cách dựng vừa đẹp
// vừa chắc: CỘNG vài sóng thẳng nghiêng theo các hướng khác nhau. Tổng
// của chúng tạo ra một hình gấp khúc quanh co — và, đây là điều quan
// trọng, độ dốc của tổng bị CHẶN TRÊN: không chỗ nào nếp nhỏ lại thành
// răng cưa.
//
// Bản trước xoáy một trường pha rồi lấy đường đồng mức. Cách ấy uốn khúc
// đẹp hơn, nhưng ở chỗ trường bị bẻ gấp, đường đồng mức dồn cục lại
// thành những nếp nhỏ hơn cả mắt lưới của lưới hình — mép não ở góc nhìn
// nghiêng thành một dải răng cưa, trông như lỗi render.
const WAVES = [
  { f: [5.20, 1.60], a: 1.00, p: 0.00 },
  { f: [-2.40, 5.00], a: 0.92, p: 1.90 },
  { f: [4.20, -4.60], a: 0.86, p: 3.40 },
  { f: [1.00, 6.20], a: 0.70, p: 5.10 },
  { f: [-5.60, -1.20], a: 0.62, p: 2.60 },
];
const WAVSUM = WAVES.reduce((s, w) => s + w.a, 0);
// -1 ở đáy rãnh, +1 ở đỉnh nếp
const gyri = (px, pz) => {
  let s = 0;
  for (const w of WAVES) s += w.a * Math.sin(2 * Math.PI * (w.f[0] * px + w.f[1] * pz) + w.p);
  return s / WAVSUM;
};

// da não: hồng ấm; rãnh thì tối; có mạch máu mờ chạy dưới
const skinTex = seed => canvasTex(1024, 512, (g, w, h) => {
  g.fillStyle = '#f0b9a2'; g.fillRect(0, 0, w, h);
  const img = g.getImageData(0, 0, w, h), d = img.data;
  const r = mulberry(seed);
  // tô rãnh: mỗi điểm ảnh biết mình nằm ở đâu trên vỏ não, nên biết rãnh
  // nào ở ngay dưới nó
  for (let y = 0; y < h; y++) {
    const th = (1 - (y + .5) / h) * Math.PI, st = Math.sin(th), ct = Math.cos(th);
    for (let x = 0; x < w; x++) {
      const phi = (x + .5) / w * Math.PI * 2;
      const px = st * Math.sin(phi), pz = st * Math.cos(phi);
      const gv = gyri(px, pz);
      let k = clamp((-.10 - gv) / .45);             // càng sâu trong rãnh càng tối
      const fis = clamp(1 - Math.abs(px) / .085);  // rãnh giữa: sẫm hẳn
      k = Math.max(k * .90, fis * .80);
      if (k <= .01) continue;
      const i = (y * w + x) * 4;
      // Rãnh tô ĐẬM: não phải đọc ra là một hình vẽ có nếp, không phải một
      // quả bóng sơn dầu. Tô vừa thì rãnh chỉ là vết bóng mờ, và cả khối
      // não mềm nhũn.
      d[i] = d[i] * (1 - k) + 128 * k;
      d[i + 1] = d[i + 1] * (1 - k) + 66 * k;
      d[i + 2] = d[i + 2] * (1 - k) + 78 * k;
    }
  }
  g.putImageData(img, 0, 0);
  // lấm tối và mạch máu mờ trên da
  for (let i = 0; i < 2200; i++) {
    g.fillStyle = `rgba(${224 + (r() * 26 | 0)},${150 + (r() * 34 | 0)},${132 + (r() * 30 | 0)},${.05 + r() * .10})`;
    g.beginPath(); g.ellipse(r() * w, r() * h, 3 + r() * 9, 2 + r() * 6, r() * 3, 0, 6.3); g.fill();
  }
  g.strokeStyle = 'rgba(168,66,78,.13)'; g.lineWidth = 1.6; g.lineCap = 'round';
  for (let i = 0; i < 34; i++) {
    g.beginPath();
    let x = r() * w, y = r() * h; g.moveTo(x, y);
    for (let k = 0; k < 5; k++) { x += (r() - .5) * 24; y += (r() - .5) * 24; g.lineTo(x, y); }
    g.stroke();
  }
});

export function khoiMoNao({ w = 1.34, d = 1.02, h = .58, seed = 3 } = {}) {
  const g = new THREE.Group();
  const skin = toon('#ffffff', { map: skinTex(seed), side: THREE.DoubleSide, grad: gradNao });
  const Rx = w / 2, Rz = d / 2, Ry = h * .5;

  const AMP = .052;      // biên độ nếp cuộn
  const FIS = .110;      // độ sâu rãnh giữa hai bán cầu

  // ── hình gốc: quả trứng dẹt đáy, hẹp ở trán ─────────────────────────
  const base = (phi, th) => {
    const st = Math.sin(th), ct = Math.cos(th);
    const nx = st * Math.sin(phi), ny = ct, nz = st * Math.cos(phi);
    const front = 1 - .13 * Math.max(0, nz);       // trán hẹp lại
    let y = Ry * ny;
    const lo = -Ry * .80;                          // đáy não bẹt để đặt lên bàn
    y = lo + (y - lo) * ss(clamp((y - lo) / (Ry * .55)));
    return [Rx * nx * front, y, Rz * nz];
  };
  // độ lệch của vỏ: nếp nhô lên, rãnh lõm xuống, rãnh giữa lõm sâu
  const disp = (px, pz, ct, t, k) => {
    const gv = gyri(px, pz);
    const vary = .82 + .26 * Math.sin(3.1 * px + 1.4 * pz + .6);   // nếp to nhỏ khác nhau
    // Nếp nhỏ dần khi bề mặt quay ngang: ở đường viền não, một nếp cao
    // đứng thẳng nhìn nghiêng thành một cái răng nhọn, và cả đường viền
    // thành cái cưa. Não thật có đường viền mềm, lượn.
    const side = .55 + .45 * ss(clamp((ct + .20) / .34));
    // …và ở hai đỉnh não: quanh đỉnh, mọi hướng đều nhau, nên nếp bị nén
    // lại thành vệt nhỏ, cũng vỡ thành răng cưa.
    const pole = ss(clamp((1 - Math.abs(ct)) / .30));
    let h = gv * AMP * vary * (.45 + .55 * k) * side * pole;
    const top = ss(clamp((ct + .30) / .50));
    h -= FIS * Math.exp(-(px * px) / (2 * .085 * .085)) * top;
    // sóng chậm của giấc ngủ sâu: nếp phồng rồi xẹp
    h += (Math.sin(px * 2.6 - t * 1.05) * .5 + Math.sin(pz * 3.3 + t * .68) * .35) * .014 * k;
    return h;
  };
  const point = (phi, th, t, k) => {
    const st = Math.sin(th), ct = Math.cos(th);
    const px = st * Math.sin(phi), pz = st * Math.cos(phi);
    const b = base(phi, th);
    const d = disp(px, pz, ct, t, k);
    return [b[0] + px * d, b[1] + ct * d, b[2] + pz * d];
  };
  const top = mesh(surface(400, 240, (u, v) => point(u * Math.PI * 2, (1 - v) * Math.PI, 0, 1)),
    skin, [0, 0, 0], { recv: true });
  g.add(top);

  // ── viền mực quanh não ────────────────────────────────────────────────
  // Vỏ não mềm không có cạnh sắc, nên pass viền mực ở mức màn hình không
  // bắt được nó: khung chỉ còn một khối màu trơn, lạc giữa phong cách vẽ
  // tay của kênh.
  //
  // Đã thử một VỎ NGOÀI dựng sẵn (cùng hình vỏ não, nhô ra, chỉ vẽ mặt
  // trong) — và nó hỏng: bề mặt não có nếp cuộn, nên đường viền ở góc nhìn
  // nghiêng chạy qua từng đỉnh nếp, và mép vỏ nhô ra thành một dải răng cưa
  // trông như lỗi render. Vỏ dựng sẵn không bám được đường viền thật.
  //
  // Nên viền được tô trong chính vật liệu não, theo GÓC NHÌN (fresnel):
  // càng gần mép não — tức càng vuông góc với mắt — càng tối. Dải tối đó
  // bám đúng đường viền thật của khối não, mềm, và không bao giờ thành
  // răng cưa.
  inkRim(skin);

  // ── tiểu não: khối nhỏ có lá (nếp mảnh nằm ngang), ló ra ở mép sau ────
  // Lá của tiểu não là các nếp RẤT mảnh, nằm sát nhau. Nếu dựng quá sắc,
  // mép của nó ở góc nhìn nghiêng thành một dải răng cưa, đọc ra là lỗi
  // render chứ không phải tiểu não. Vì vậy lá ở đây chỉ gợi ý bằng độ
  // lõm rất nhẹ, còn khối vẫn tròn.
  // tiểu não phải cùng tông với vỏ não: màu cam-đỏ lọt ra ở mép não đọc ra
  // như một lát thịt dính bên hông, tách khỏi mặt não. Cùng tông, khác hình.
  const cbSkin = toon('#fdf3ee', { map: skinTex(seed + 3), side: THREE.DoubleSide, grad: gradNao });
  const cbR = [Rx * .46, Ry * .56, Rz * .44];
  const cb = mesh(surface(56, 38, (u, v) => {
    const phi = u * Math.PI * 2, th = (1 - v) * Math.PI;
    const st = Math.sin(th), ct = Math.cos(th);
    const px = st * Math.sin(phi), py = ct, pz = st * Math.cos(phi);
    const F = 1.15 * py + .28 * Math.sin(1.45 * pz + .6);        // lá nằm ngang
    const r = Math.pow(.5 + .5 * Math.cos(2 * Math.PI * F), 1.6);
    const d = (r - .45) * .011;
    return [cbR[0] * px + px * d, cbR[1] * py + ct * d, cbR[2] * pz + pz * d];
  }), cbSkin, [-Rx * .64, -Ry * .44, -Rz * .38]);
  g.add(cb);

  // ── thân não: cột nhỏ chạy ra phía trước dưới ─────────────────────────
  const stem = mesh(new THREE.CylinderGeometry(.042, .090, .30, 14), cbSkin,
    [0, -Ry * .40, Rz * .66], { rot: [0.75, 0, 0] });
  g.add(stem);

  // ── sóng chậm: nếp phồng lên theo sóng rồi xẹp dần ──────────────────
  const P = top.geometry.attributes.position;
  const UV = top.geometry.attributes.uv;
  g.wave = (t, k = 1) => {
    for (let i = 0; i < P.count; i++) {
      const [x, y, z] = point(UV.getX(i) * Math.PI * 2, (1 - UV.getY(i)) * Math.PI, t, k);
      P.setXYZ(i, x, y, z);
    }
    P.needsUpdate = true;
    top.geometry.computeVertexNormals();
    g.k = k;
  };
  // điểm trên MẶT TRÊN của não, theo toạ độ cục bộ (x, z) — dùng để đặt tín hiệu
  g.surf = (x, z, t, k) => {
    const px = clamp(x / Rx, -1, 1), pz = clamp(z / Rz, -1, 1);
    const r = Math.min(1, Math.hypot(px, pz));
    const ct = Math.sqrt(Math.max(0, 1 - r * r));
    const phi = Math.atan2(px, pz);
    return point(phi, Math.acos(clamp(ct, -1, 1)), t, k);
  };
  g.k = 1;
  g.top = top; g.h = h; g.w = w; g.d = d; g.Rx = Rx; g.Rz = Rz; g.Ry = Ry;
  g.cerebellum = cb; g.stem = stem;
  return g;
}

export const PROP = { name: 'khối mô não', view: () => khoiMoNao() };
