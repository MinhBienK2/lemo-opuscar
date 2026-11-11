// Máy đo điện trở: một cái đồng hồ đo có màn hình số, một nút xoay chọn vị trí,
// hai que chạm nối vào hai dây của viên cầu.
//
// Màn hình phải nói được CẢ HAI con số của câu c11 ("mười kiloôm" rồi "một
// kiloôm") trong cùng một khung: người xem phải thấy số TỤT XUỐNG, chứ không
// phải thấy một số rồi tự đoán. Nên màn hình vẽ hai hàng — hàng trên là số lúc
// mát, hàng dưới là số lúc nóng — kèm một mũi tên hổ phách nối từ hàng trên
// xuống hàng dưới. Số đang đo thì sáng mạnh, số còn lại sáng vừa đủ đọc được.
//
// setReading(txt) vẽ MỘT hàng (dùng cho ảnh ba phía của danh mục vật),
// setReadings(a, b, live) vẽ hai hàng: a trên, b dưới, `live` là giá trị đang
// sáng (chuỗi '10 kΩ' / '1 kΩ', hoặc 0 = hàng trên, 1 = hàng dưới).
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

  // Màn hình số: một khung tối, hai hàng chữ. Hàng trên là số lúc mát, hàng
  // dưới là số lúc nóng, một mũi tên hổ phách nối từ hàng trên xuống hàng
  // dưới để số tụt là thấy ngay, không phải tự đoán.
  //
  // Canvas 320x200 giữ tỉ lệ 1.6 đúng bằng hộp màn hình .1152 x .072 ở dưới;
  // đổi kích thước một bên mà không đổi bên kia thì chữ bị méo.
  const SCR_W = 320, SCR_H = 200;
  const SCR_BG = '#1d2a24', SCR_LIVE = '#8ef0b4', SCR_DIM = '#5fbf8d', SCR_ARROW = '#f7bd27';
  const ROW_PX = 96, ROW_UNIT = 54, ROW_Y = [52, 148], NUM_RIGHT = 130, UNIT_X = 140;
  const screen = document.createElement('canvas'); screen.width = SCR_W; screen.height = SCR_H;
  const sc = screen.getContext('2d');

  // '10 kΩ' → ['10', 'kΩ']: số to, đơn vị nhỏ hơn đứng bên phải
  const splitVal = t => {
    const s = String(t == null ? '' : t).trim(), i = s.lastIndexOf(' ');
    return i > 0 ? [s.slice(0, i), s.slice(i + 1)] : [s, ''];
  };
  // số dài hơn chỗ trống thì co chữ lại, chứ không để nó tràn ra ngoài màn hình
  const fitNum = nums => {
    let np = ROW_PX;
    sc.font = `bold ${np}px monospace`;
    while (np > 24 && nums.some(n => sc.measureText(n).width > NUM_RIGHT - 10)) {
      np -= 4; sc.font = `bold ${np}px monospace`;
    }
    return np;
  };

  // MỘT hàng: số to giữa màn hình. Dùng cho ảnh ba phía của danh mục vật.
  const drawOne = txt => {
    sc.fillStyle = SCR_BG; sc.fillRect(0, 0, SCR_W, SCR_H);
    const [num, unit] = splitVal(txt);
    let np = 112, up = 60;
    sc.font = `bold ${np}px monospace`;
    let nw = sc.measureText(num).width;
    sc.font = `bold ${up}px monospace`;
    let uw = unit ? sc.measureText(unit).width : 0;
    const total = nw + (unit ? 12 + uw : 0);
    if (total > SCR_W - 16) {
      const k = (SCR_W - 16) / total;
      np = Math.max(24, Math.round(np * k)); up = Math.max(18, Math.round(up * k));
      sc.font = `bold ${np}px monospace`; nw = sc.measureText(num).width;
      sc.font = `bold ${up}px monospace`; uw = unit ? sc.measureText(unit).width : 0;
    }
    const x0 = (SCR_W - (nw + (unit ? 12 + uw : 0))) / 2;
    sc.fillStyle = SCR_LIVE; sc.textBaseline = 'middle'; sc.textAlign = 'left';
    sc.font = `bold ${np}px monospace`; sc.fillText(num, x0, SCR_H / 2);
    if (unit) { sc.font = `bold ${up}px monospace`; sc.fillText(unit, x0 + nw + 12, SCR_H / 2); }
  };

  // HAI hàng: hàng trên số lúc mát, hàng dưới số lúc nóng. Số đang đo sáng
  // mạnh, số kia sáng vừa đủ đọc trên nền màn hình tối — hai số cùng hiện,
  // người xem tự thấy con số nào đang chạy.
  const drawTwo = (a, b, live) => {
    sc.fillStyle = SCR_BG; sc.fillRect(0, 0, SCR_W, SCR_H);
    const [na] = splitVal(a), [nb] = splitVal(b);
    // hai hàng dùng chung một cỡ chữ: hàng nào cũng phải to như nhau, không có
    // hàng nào nhỏ hơn hàng nào, nếu không con số tụt sẽ đọc ra như hai việc
    // khác nhau chứ không phải một số đổi số
    const np = fitNum([na, nb]);
    const row = (txt, cy, color) => {
      const [num, unit] = splitVal(txt);
      sc.fillStyle = color; sc.textBaseline = 'middle';
      sc.textAlign = 'right'; sc.font = `bold ${np}px monospace`;
      sc.fillText(num, NUM_RIGHT, cy);
      if (unit) {
        sc.textAlign = 'left'; sc.font = `bold ${ROW_UNIT}px monospace`;
        sc.fillText(unit, UNIT_X, cy);
      }
    };
    row(a, ROW_Y[0], live === 0 ? SCR_LIVE : SCR_DIM);
    row(b, ROW_Y[1], live === 1 ? SCR_LIVE : SCR_DIM);
    // mũi tên hổ phách: số tụt từ hàng trên xuống hàng dưới
    sc.strokeStyle = SCR_ARROW; sc.fillStyle = SCR_ARROW;
    sc.lineWidth = 9; sc.lineCap = 'round';
    sc.beginPath(); sc.moveTo(286, 44); sc.lineTo(286, 126); sc.stroke();
    sc.beginPath(); sc.moveTo(272, 126); sc.lineTo(300, 126); sc.lineTo(286, 156); sc.closePath(); sc.fill();
  };

  const stex = new THREE.CanvasTexture(screen); stex.colorSpace = THREE.SRGBColorSpace;
  // Màn hình có đèn sau (như màn LCD thật) nên số mờ vẫn đọc được khi máy
  // quay đứng xa; không có đèn sau thì hàng số tắt chìm vào nền.
  g.add(mesh(rbox(.1152, .072, .006, .006),
    toon('#ffffff', { map: stex, emissive: '#ffffff', emissiveMap: stex, emissiveIntensity: .25 }),
    [0, .050, .021]));

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

  // Một số: dùng cho ảnh ba phía của danh mục vật, số to giữa màn hình.
  g.setReading = txt => { drawOne(txt); stex.needsUpdate = true; };
  // Hai số: a ở hàng trên, b ở hàng dưới, `live` là giá trị đang sáng
  // ('10 kΩ' hoặc '1 kΩ'; cũng nhận 0 = hàng trên, 1 = hàng dưới).
  g.setReadings = (a, b, live) => {
    const l = (live === 1 || live === b) ? 1 : 0;
    drawTwo(a, b, l);
    stex.needsUpdate = true;
  };
  g.setDial = a => { dial.rotation.z = a; };
  g.probes = probes;
  g.setReading('—');
  return g;
}

// Trong ảnh ba phía, màn hình phải có một con số: màn hình trống đọc ra là
// một mảng xanh, và máy đo không có số thì không thấy là máy đo. Số ở đây là
// số phim kể ("một kiloôm"), không phải số bịa ra.
export const PROP = {
  name: 'máy đo điện trở',
  view: () => { const g = cauDoDienTro(); g.setReading('1 kΩ'); return g; },
};
