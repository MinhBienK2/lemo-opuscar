// Nhà thang ở góc sân thượng: tường vữa có vệt sơn chân tường, một lỗ cửa
// sổ có kính và bệ cửa, một cửa cổng ở mặt phải (mặt có nắng chiều), mái
// tôn sóng nghiêng nhẹ và ống nước chạy xuống góc nhà.
// Tường trước là một khối khoét lỗ cửa sổ (không chia mảnh): ghép nhiều mảnh
// thì mép mỗi mảnh là một rãnh sáng chạy dọc suốt tường, đứng ngay bên lỗ
// cửa. Cửa sổ có khung gỗ lắp trên mặt tường, kính sáng nằm gọn trong lỗ.
import * as THREE from 'three';
import { PAL, toon, canvasTex, TEX, rbox, mesh, mulberry } from '../../../../../rig/kit.js';

// ── chất liệu vẽ tay (có seed) ────────────────────────────────────────────
let _plaster, _metal, _wallPaint;

// Lỗ cửa sổ và chiều sâu của nhà: bối cảnh cần đúng hai con số này để đặt
// vệt sáng cửa sổ đúng chỗ.
export const HOUSE_WIN = { x: .55, y: 1.62, w: .92, h: .78 };
export const HOUSE_D = 2.20;

const plasterTex = () => (_plaster ||= canvasTex(512, 512, (g, w, h) => {
  const r = mulberry(33);
  g.fillStyle = '#cbb69c'; g.fillRect(0, 0, w, h);
  for (let x = 0; x < w; x += 96) { g.fillStyle = 'rgba(255,240,216,.16)'; g.fillRect(x, 0, 34, h); }
  for (let k = 0; k < 26; k++) {          // vệt nước mưa chảy
    const x = r() * w;
    g.fillStyle = `rgba(88,70,58,${.05 + r() * .09})`;
    g.fillRect(x, 0, 6 + r() * 22, h);
  }
  for (let k = 0; k < 22000; k++) { g.fillStyle = `rgba(70,52,38,${r() * .06})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

// vệt sơn cũ dưới chân tường
const wallPaintTex = (col) => (_wallPaint ||= canvasTex(256, 128, (g, w, h) => {
  const r = mulberry(44);
  g.fillStyle = col; g.fillRect(0, 0, w, h);
  for (let k = 0; k < 6000; k++) { g.fillStyle = `rgba(40,30,20,${r() * .07})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

const metalTex = () => (_metal ||= canvasTex(512, 512, (g, w, h) => {
  const r = mulberry(31);
  for (let x = 0; x < w; x += 32) {                      // sóng tôn
    const grd = g.createLinearGradient(x, 0, x + 32, 0);
    grd.addColorStop(0, '#5f4f45'); grd.addColorStop(.34, '#a89079');
    grd.addColorStop(.62, '#86725f'); grd.addColorStop(1, '#54453d');
    g.fillStyle = grd; g.fillRect(x, 0, 32, h);
  }
  for (let k = 0; k < 1100; k++) { g.fillStyle = `rgba(146,66,32,${r() * .3})`; g.fillRect(r() * w, r() * h, 3 + r() * 16, 2 + r() * 7); }
  for (let k = 0; k < 9000; k++) { g.fillStyle = `rgba(30,20,16,${r() * .07})`; g.fillRect(r() * w, r() * h, 2, 2); }
}));

export function nhaThang(opts = {}) {
  const paint = opts.paint ?? '#c08a4e';
  const glass = opts.glass ?? '#ffe0b0';
  const glassK = opts.glassK ?? .7;
  const g = new THREE.Group();
  const HW = 2.45, HH = 2.85, HD = HOUSE_D;
  const wallMat = toon('#ffffff', { map: plasterTex() });
  const paintMat = toon('#ffffff', { map: wallPaintTex(paint) });
  // tường trước: MỘT khối khoét lỗ cửa sổ, để ánh sáng lọt ra được
  const WIN = HOUSE_WIN;
  const fz = HD / 2;                       // mặt trước (+z)
  const WT = .14;                          // dày tường trước
  const HL = WIN.x - WIN.w / 2, HR = WIN.x + WIN.w / 2;   // mép lỗ cửa sổ
  const HB = WIN.y - WIN.h / 2, HT = WIN.y + WIN.h / 2;
  // Tường KHÔNG chia thành mấy mảnh rồi ghép: mép mỗi mảnh là một rãnh
  // sáng chạy dọc suốt tường, đứng ngay bên lỗ cửa — ở cảnh chéo nó đủ
  // cao để chạm từ xà mái xuống tận bệ cửa và đọc ra như một dải sáng lạ.
  const shape = new THREE.Shape();
  shape.moveTo(-HW / 2, 0); shape.lineTo(HW / 2, 0);
  shape.lineTo(HW / 2, HH); shape.lineTo(-HW / 2, HH); shape.closePath();
  const cut = new THREE.Path();
  cut.moveTo(HL, HB); cut.lineTo(HL, HT); cut.lineTo(HR, HT); cut.lineTo(HR, HB); cut.closePath();
  shape.holes.push(cut);
  const front = new THREE.ExtrudeGeometry(shape, { depth: WT, bevelEnabled: false });
  // mặt tường trải đúng một ô vân vữa, y như các mảng tường khác
  const uvA = front.attributes.uv, posA = front.attributes.position, nrmA = front.attributes.normal;
  for (let i = 0; i < uvA.count; i++)
    if (Math.abs(nrmA.getZ(i)) > .9) uvA.setXY(i, (posA.getX(i) + HW / 2) / HW, posA.getY(i) / HH);
  uvA.needsUpdate = true;
  g.add(mesh(front, wallMat, [0, 0, fz - WT / 2]));
  g.add(mesh(rbox(HW, .55, .14, .02), paintMat, [0, .28, fz]));                    // vệt sơn chân tường
  g.add(mesh(rbox(HW, HH, .14, .02), wallMat, [0, HH / 2, -fz]));                 // tường sau
  g.add(mesh(rbox(.14, HH, HD, .02), wallMat, [-HW / 2, HH / 2, 0]));              // tường trái
  g.add(mesh(rbox(.14, HH, HD, .02), wallMat, [HW / 2, HH / 2, 0]));               // tường phải
  g.add(mesh(rbox(HW, .12, HD, .02), toon('#3a3048'), [0, .06, 0]));               // sàn nhà
  g.add(mesh(rbox(HW - .2, HH - .2, HD - .2, .02), toon('#241f33'), [0, HH / 2, 0])); // trong nhà tối
  // khung cửa sổ + kính sáng
  // Khung gỗ lắp trên mặt tường và lấn .03 vào lỗ cửa, nên mép lỗ không
  // lộ ra; kính nằm sâu .04 trong lỗ và rộng hơn lỗ một chút, nên mép kính
  // luôn nằm trong tường: không dải sáng nào tràn ra ngoài ô sáng.
  const FW = .09, FL = .03, FD = .07;
  const fMat = toon('#5b4a42');
  const fzc = fz + WT / 2 + FD / 2 - .006;          // khung lắp trên tường
  g.add(mesh(rbox(FW + FL, WIN.h + 2 * FW, FD, .01), fMat, [HL + (FL - FW) / 2, WIN.y, fzc]));
  g.add(mesh(rbox(FW + FL, WIN.h + 2 * FW, FD, .01), fMat, [HR + (FW - FL) / 2, WIN.y, fzc]));
  g.add(mesh(rbox(WIN.w - 2 * FL, FW + FL, FD, .01), fMat, [WIN.x, HT + (FW - FL) / 2, fzc]));
  g.add(mesh(rbox(WIN.w - 2 * FL, FW + FL, FD, .01), fMat, [WIN.x, HB - (FW - FL) / 2, fzc]));
  const glassMat = toon(glass, { emissive: new THREE.Color(glass).multiplyScalar(glassK) });
  g.add(mesh(rbox(WIN.w + .06, WIN.h + .06, .04, .01), glassMat,
    [WIN.x, WIN.y, fz + WT / 2 - .06], { cast: false }));
  g.add(mesh(rbox(WIN.w + .30, .09, .26, .02), toon('#6b5a52'), [WIN.x, HB - FW - .04, fz + .04])); // bệ cửa sổ
  // cửa cổng ở mặt phải (mặt có nắng chiều)
  const doorMat = toon('#8a4f3c', { map: TEX.wood() });
  g.add(mesh(rbox(.10, 1.72, .84, .02), doorMat, [HW / 2 + .02, .86, .12]));
  g.add(mesh(new THREE.SphereGeometry(.055, 10, 8), toon(PAL.mustard), [HW / 2 + .10, .88, -.22]));
  g.add(mesh(rbox(.12, .10, 1.02, .02), toon('#5b4a42'), [HW / 2 + .03, 1.78, .12]));
  // mái tôn sóng, nghiêng nhẹ
  const roofMat = toon('#ffffff', { map: metalTex() });
  roofMat.map.repeat.set(4, 2);
  const roof = mesh(rbox(HW + .42, .09, HD + .34, .02), roofMat, [0, HH + .16, 0]);
  roof.rotation.x = -.07; g.add(roof);
  g.add(mesh(rbox(HW + .46, .10, .07, .02), toon('#4d3f38'), [0, HH + .10, (HD + .34) / 2]));
  g.add(mesh(rbox(HW + .46, .10, .07, .02), toon('#4d3f38'), [0, HH + .10, -(HD + .34) / 2]));
  // ống nước chạy xuống góc nhà
  g.add(mesh(new THREE.CylinderGeometry(.045, .045, HH - .2, 10), toon('#6b5a52'), [-HW / 2 - .09, (HH - .2) / 2, -.6]));
  return g;
}

export const PROP = { name: 'nhà thang có cửa sổ và cửa cổng', view: () => nhaThang() };
