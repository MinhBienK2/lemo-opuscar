// Máy đo điện trở: một cái đồng hồ đo có màn hình số, một nút xoay chọn vị trí,
// hai que chạm nối vào hai dây của viên cầu. setReading(s) đổi số trên màn hình.
// Tên vật phải đúng với cái người xem thấy: đây là máy đo, còn viên cầu đầu dò
// nhiệt là vật nhỏ trong nồi (xem noi-cat-ngang.js).
import * as THREE from 'three';
import { toon, canvasTex, rbox, mesh, fxLayer, PAL, mulberry } from '../../../../../rig/kit.js';

// Vân vỏ máy đo: một mảng vàng phẳng ở tiền cảnh đọc ra như bìa carton, không
// phải vỏ máy. Vân này là hạt nhựa mịn và một chút tối dần ở đáy.
function meterTex() {
  return canvasTex(256, 256, (g, w, h) => {
    const r = mulberry(53);
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 6000; i++) {
      const x = r() * w, y = r() * h, a = r();
      g.fillStyle = `rgba(120,95,30,${.03 + a * .07})`;
      g.fillRect(x, y, a > .85 ? 2 : 1, 1);
    }
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    grd.addColorStop(1, 'rgba(90,70,20,.12)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });
}

export function cauDoDienTro(opts = {}) {
  const g = new THREE.Group();
  const mtex = meterTex();
  const body = toon(opts.color || '#f0b429', { map: mtex });
  const dark = toon('#33383f');

  // thân máy, hơi nghiêng
  g.add(mesh(rbox(.150, .195, .038, .012), body, [0, 0, 0], { rot: [0, 0, 0] }));
  g.add(mesh(rbox(.156, .201, .010, .014), dark, [0, 0, -.016]));

  // màn hình số: một khung đen, số in trên đó
  const screen = document.createElement('canvas'); screen.width = 256; screen.height = 128;
  const sc = screen.getContext('2d');
  const draw = txt => {
    sc.fillStyle = '#1d2a24'; sc.fillRect(0, 0, 256, 128);
    sc.fillStyle = '#8ef0b4'; sc.font = 'bold 74px monospace'; sc.textAlign = 'center'; sc.textBaseline = 'middle';
    sc.fillText(txt, 128, 68);
  };
  draw('—');
  const stex = new THREE.CanvasTexture(screen); stex.colorSpace = THREE.SRGBColorSpace;
  g.add(mesh(rbox(.112, .058, .006, .006), toon('#ffffff', { map: stex }), [0, .058, .021]));

  // nút xoay chọn vị trí: một đĩa có vạch chỉ
  const dial = new THREE.Group(); dial.position.set(0, -.038, .023);
  dial.add(mesh(new THREE.CylinderGeometry(.030, .030, .012, 24), dark, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  const ptr = mesh(rbox(.006, .020, .006, .002), toon('#fff0d8'), [0, .014, .008]);
  dial.add(ptr);
  g.add(dial);
  // vạch quanh nút xoay
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    g.add(mesh(rbox(.004, .012, .003, .001), dark, [Math.sin(a) * .040, -.038 + Math.cos(a) * .040, .021], { rot: [0, 0, -a] }));
  }

  // hai lỗ cắm que chạm
  for (const s of [-1, 1]) {
    g.add(mesh(new THREE.CylinderGeometry(.008, .008, .012, 12), dark, [s * .035, -.088, .014], { rot: [Math.PI / 2, 0, 0] }));
  }

  // hai que chạm: tay cầm, dây, đầu nhọn.
  // Que chạm phải CẮM vào hai lỗ ở đáy vỏ: tay cầm nằm dưới, đầu kim loại
  // nhọn thò lên đúng lỗ. Que dài quá thì đầu kim vượt lên che núm xoay ở
  // giữa mặt máy, và cả máy đọc ra là hai dải dẹt vắt ngang.
  const probes = [];
  for (const [i, s] of [[0, -1], [1, 1]]) {
    const p = new THREE.Group();
    const bodyP = mesh(new THREE.CylinderGeometry(.010, .013, .080, 14), toon(i ? '#d94f3d' : '#33383f'), [0, -.055, 0]);
    p.add(bodyP);
    // vành nhựa ở chỗ que ra khỏi lỗ cắm
    p.add(mesh(new THREE.CylinderGeometry(.0115, .0115, .014, 14), toon('#25292f'), [0, -.012, 0]));
    // đầu kim nhọn: chỉ nhô lên tới miệng lỗ, không vượt lên núm xoay
    p.add(mesh(new THREE.CylinderGeometry(.0020, .0042, .030, 10), toon('#cfd4da'), [0, .003, 0]));
    p.position.set(s * .035, -.088, .014);
    p.rotation.set(.20, 0, s * .22);
    p.userData.tip = new THREE.Vector3(0, .018, 0);
    g.add(p); probes.push(p);
  }

  g.setReading = txt => { draw(txt); stex.needsUpdate = true; };
  g.setDial = a => { dial.rotation.z = a; };
  g.probes = probes;
  g.setReading('—');
  return g;
}

// Trong ảnh ba phía, màn hình phải có một con số: màn hình trống đọc ra là
// một mảng xanh, và máy đo không có số thì không thấy là máy đo.
export const PROP = {
  name: 'máy đo điện trở',
  view: () => { const g = cauDoDienTro(); g.setReading('1.0 kΩ'); return g; },
};
