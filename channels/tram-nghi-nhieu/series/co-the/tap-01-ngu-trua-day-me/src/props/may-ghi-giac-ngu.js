// Máy ghi giấc ngủ: một hộp kem có khe giấy, một cuộn giấy chạy ra, và một cánh bút
// ghi đường bậc của các giai đoạn ngủ lên mặt giấy. Mặt giấy có sẵn thang thời
// gian in, một cổng gạch đậm ở mốc ba mươi phút, và hai đường đo phản xạ.
//
// Trục thời gian chạy DỌC theo dải giấy: phút 0 ở đầu xa, phút 45 ở đầu gần
// cây bút. Dải giấy luôn dài hết 45 phút — đổi phút thì ĐỒ THỊ VẼ LẠI, và
// các con số phút được in lại, nên nhìn là biết đang ở phút nào.
import * as THREE from 'three';
import { PAL, toon, canvasTex, rbox, mesh, clamp, lerp } from '../../../../../rig/kit.js';

// ── mặt giấy: đồ thị vẽ bằng canvas, không phải ảnh chụp ───────────────
// Trục ngang là thời gian (từ phút 0 tới phút 45); trên là đường bậc của các
// giai đoạn ngủ, dưới là hai đường đo phản xạ. Đồ thị chỉ vẽ tới phút đang
// đo, nên nhìn mặt giấy là nhìn thấy "đã đo được tới đâu".
export const SPAN = 45;

// nền giấy: hạt giấy, lưới mỗi năm phút, thang số phút — vẽ một lần rồi dùng lại
function veNen(g, w, h) {
  g.fillStyle = '#f5f0e2'; g.fillRect(0, 0, w, h);
  for (let k = 0; k < 9000; k++) {                // hạt giấy
    g.fillStyle = `rgba(120,105,80,${Math.random() * .05})`;
    g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
  for (let min = 0; min <= SPAN; min += 5) {      // lưới mờ: mỗi năm phút một vạch
    g.strokeStyle = min % 10 === 0 ? 'rgba(120,105,80,.35)' : 'rgba(120,105,80,.14)';
    g.lineWidth = min % 10 === 0 ? 3 : 2;
    g.beginPath(); g.moveTo(min / SPAN * w, 0); g.lineTo(min / SPAN * w, h); g.stroke();
  }
  g.fillStyle = '#2c3152'; g.font = '700 44px "Be Vietnam Pro"'; g.textAlign = 'left';
  g.fillText('GIAI ĐOẠN NGỦ', 24, 56);
  g.font = '700 34px "Be Vietnam Pro"'; g.fillStyle = 'rgba(44,49,82,.75)';
  g.fillText('TRƯỚC KHI NGỦ', 24, h * .80 - 16);
}

// số phút in dọc theo mép giấy: to, rõ, và số phút đang đo thì in đỏ
function veSoPhut(g, w, h, minute) {
  const X = min => min / SPAN * w;
  g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  const marks = new Set([0, 10, 20, 30, 40, Math.round(minute)]);
  for (const m of marks) {
    if (m < 0 || m > SPAN) continue;
    const now = m === Math.round(minute);
    g.fillStyle = now ? '#c0263f' : '#2c3152';
    g.font = `${now ? '900' : '700'} ${now ? 108 : 92}px "Be Vietnam Pro"`;
    g.fillText(String(m), X(m), h - 26);
    // vạch đậm dưới mỗi mốc, để số bám vào một vạch chứ không trôi
    g.fillRect(X(m) - (now ? 8 : 5), h - 20, now ? 16 : 10, 22);
  }
}

// đường bậc các giai đoạn ngủ và hai đường đo phản xạ, vẽ tới phút `minute`
function veDuong(g, w, h, minute) {
  const X = min => min / SPAN * w;
  const top = h * .10, mid = h * .27, bot = h * .44;
  // cổng gạch đậm ở mốc ba mươi phút: chạy dọc cả mặt giấy
  if (minute >= 30) {
    g.save();
    g.beginPath(); g.rect(X(30), 0, 46, h); g.clip();
    g.fillStyle = 'rgba(200,40,70,.20)'; g.fillRect(X(30), 0, 46, h);
    g.strokeStyle = 'rgba(200,40,70,.75)'; g.lineWidth = 4;
    for (let x = X(30) - h; x < X(30) + 46; x += 16) {
      g.beginPath(); g.moveTo(x, h); g.lineTo(x + h, 0); g.stroke();
    }
    g.restore();
    g.strokeStyle = 'rgba(200,40,70,.9)'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(X(30), 0); g.lineTo(X(30), h); g.stroke();
  }
  const steps = [[0, top], [2, mid], [8, bot], [23, bot], [27, mid], [30, mid],
    [34, mid], [45, top]];
  g.strokeStyle = '#2c3152'; g.lineWidth = 7; g.lineJoin = 'round';
  g.beginPath();
  steps.forEach(([min, y], i) => {
    if (min > minute) return;
    const x = X(min);
    i ? g.lineTo(x, y) : g.moveTo(x, y);
  });
  g.stroke();
  // phần ngủ sóng chậm được tô đậm: mười lăm phút, và nó NHỎ DẦN về cuối —
  // sóng chậm mạnh nhất ở đầu giấc ngủ rồi giảm dần.
  const g2 = Math.min(minute, 23);
  if (g2 > 8) {
    const grd = g.createLinearGradient(X(8), 0, X(23), 0);
    grd.addColorStop(0, 'rgba(90,60,150,.66)'); grd.addColorStop(1, 'rgba(90,60,150,.16)');
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(X(8), bot);
    g.lineTo(X(8), bot - h * .30);
    g.quadraticCurveTo(X(16), bot - h * .19, X(23), bot - h * .07);
    g.lineTo(X(Math.min(g2, 23)), bot);
    g.closePath(); g.fill();
    g.strokeStyle = '#2c3152'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(X(8), bot); g.lineTo(X(g2), bot); g.stroke();
  }
  // hai đường đo phản xạ (dưới): trước khi ngủ thì phản xạ còn nguyên, sau
  // khi ngủ thì phản xạ tụt hẳn xuống.
  const b0 = h * .80, b1 = h * .93;
  g.strokeStyle = '#2c3152'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(X(0), b0); g.lineTo(X(minute), b0); g.stroke();
  g.strokeStyle = '#c0263f'; g.lineWidth = 7;
  g.beginPath();
  g.moveTo(X(0), b0);
  for (let min = 0; min <= minute; min += 1) {
    const d = min <= 30 ? 0 : Math.min(1, (min - 30) / 15);
    const y = b0 + d * d * (b1 - b0) * 1.05;
    g.lineTo(X(min), y);
  }
  g.stroke();
  // vạch đỏ ở phút đang đo: đường đồ thị dừng đúng chỗ này
  g.strokeStyle = '#c0263f'; g.lineWidth = 5; g.setLineDash([16, 12]);
  g.beginPath(); g.moveTo(X(minute), 0); g.lineTo(X(minute), h); g.stroke();
  g.setLineDash([]);
  if (minute >= 30) {
    g.fillStyle = '#c0263f'; g.font = '700 40px "Be Vietnam Pro"'; g.textAlign = 'left';
    g.fillText('SAU KHI NGỦ', X(31), b1 - 12);
  }
}

// một mặt giấy có thể vẽ lại: nền giấy giữ riêng, đồ thị vẽ đè lên
export function giayDo() {
  const W = 2048, H = 853;
  const bg = document.createElement('canvas'); bg.width = W; bg.height = H;
  veNen(bg.getContext('2d'), W, H);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  veDuong(g, W, H, 45);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  t.userData = { bg, g, W, H, minute: 45 };
  return t;
}

export function mayGhiGiacNgu() {
  const g = new THREE.Group();
  const cream = toon('#f2e7cf'), metal = toon('#b9bfd6'), dark = toon('#3b4266'), red = toon(PAL.red);

  // ── thân máy: hộp kem, mặt trước nghiêng ──
  const body = mesh(rbox(0.56, 0.30, 0.40, 0.03), cream, [0, 0.15, 0]);
  g.add(body);
  // mặt trước: có nhãn in sẵn, để người xem biết đây là máy ghi giấc ngủ
  const faceTex = canvasTex(512, 256, (c, w, h) => {
    c.fillStyle = '#3b4266'; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(255,255,255,.06)';
    for (let y = 0; y < h; y += 24) c.fillRect(0, y, w, 3);
    c.fillStyle = '#f4ecd8'; c.font = '700 40px "Be Vietnam Pro"';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('GHI GIẤC NGỦ', w * .68, h * .70);
  });
  const face = mesh(rbox(0.50, 0.20, 0.03, 0.02), toon('#ffffff', { map: faceTex }), [0, 0.16, 0.205], { rot: [-0.32, 0, 0] });
  g.add(face);
  // đồng hồ đếm phút: mặt số in sẵn 0…45 phút, có kim đỏ chỉ phút đang đo.
  // Trước đây chỗ này là một mặt đồng hồ không số: người xem không biết ba
  // mươi phút nằm ở đâu, và thẻ "ba mươi phút" chỉ vào một mặt trống.
  const dialTex = canvasTex(512, 512, (c, w, h) => {
    const cx = w / 2, cy = h / 2, R = w * .46;
    c.clearRect(0, 0, w, h);
    c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fillStyle = '#f6efdd'; c.fill();
    c.strokeStyle = '#2c3152'; c.lineWidth = 12;
    c.beginPath(); c.arc(cx, cy, R * .95, 0, 7); c.stroke();
    c.textAlign = 'center'; c.textBaseline = 'middle';
    // mốc lớn (0, 10, 20, 30, 40) có số; mốc lẻ chỉ có vạch — in số mười phút
    // một cái thì các con số dính vào nhau và đọc như "403530"
    for (let m = 0; m <= 45; m += 5) {
      const a = -Math.PI / 2 + (m / 45) * (Math.PI * 5 / 4);
      const dx = Math.cos(a), dy = Math.sin(a);
      if (m % 10 === 0) {
        const rr = R * .68;
        c.fillStyle = m === 30 ? '#c0263f' : '#2c3152';
        c.font = `${m === 30 ? '900' : '700'} ${m === 30 ? 62 : 46}px "Be Vietnam Pro"`;
        c.fillText(String(m), cx + dx * rr, cy - dy * rr);
      } else {
        const r0 = R * .80, r1 = R * .90;
        c.strokeStyle = 'rgba(44,49,82,.55)'; c.lineWidth = 6;
        c.beginPath();
        c.moveTo(cx + dx * r0, cy - dy * r0);
        c.lineTo(cx + dx * r1, cy - dy * r1);
        c.stroke();
      }
    }
    // vạch đỏ ở mốc ba mươi phút
    const a30 = -Math.PI / 2 + (30 / 45) * (Math.PI * 5 / 4);
    c.strokeStyle = '#c0263f'; c.lineWidth = 14; c.lineCap = 'round';
    c.beginPath();
    c.moveTo(cx + Math.cos(a30) * R * .80, cy - Math.sin(a30) * R * .80);
    c.lineTo(cx + Math.cos(a30) * R * .95, cy - Math.sin(a30) * R * .95);
    c.stroke();
    // mặt số này đo PHÚT, nên ghi rõ đơn vị ngay trên mặt số
    c.fillStyle = '#2c3152'; c.font = '700 40px "Be Vietnam Pro"';
    c.fillText('PHÚT', cx, cy + R * .42);
  });
  const dial = new THREE.Group();
  dial.position.set(-.145, .185, .225); dial.rotation.x = -0.32;
  g.add(dial);
  dial.add(mesh(new THREE.CircleGeometry(.085, 40), toon('#ffffff', { map: dialTex }), [0, 0, 0]));
  const needle = new THREE.Group(); needle.position.z = .008; dial.add(needle);
  needle.add(mesh(rbox(.008, .062, .006, .002), toon('#c0263f'), [0, .028, 0]));
  needle.add(mesh(new THREE.CylinderGeometry(.010, .010, .008, 12), toon('#2c3152'), [0, 0, .002], { rot: [Math.PI / 2, 0, 0] }));
  // kim chỉ phút: 0 ở trên, quay theo chiều kim đồng hồ
  const setMinute = (m = 0) => {
    const a = -Math.PI / 2 + (clamp(m, 0, 45) / 45) * (Math.PI * 5 / 4);
    needle.rotation.z = a - Math.PI / 2;
    veDo(m);
  };
  // hai nút vặn
  for (const x of [0.06, 0.16]) {
    const k = mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.03, 16), metal, [x, 0.19, 0.215], { rot: [-0.32 + Math.PI / 2, 0, 0] });
    g.add(k);
  }
  // khe giấy ở chỗ thấp mặt trước
  g.add(mesh(rbox(0.46, 0.035, 0.05, 0.008), dark, [0, 0.035, 0.20]));

  // ── cuộn giấy ở trong khe, và mặt giấy chạy ra ──
  const roll = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.42, 20), toon('#e8dfc8'), [0, 0.055, 0.13], { rot: [0, 0, Math.PI / 2] });
  g.add(roll);
  const W = 0.40, LMAX = 0.60;
  const geo = stripGeo(W, LMAX);
  const tex = giayDo();
  const paper = mesh(geo, toon('#cfc6ae', { map: tex, side: THREE.DoubleSide }), [0, 0.012, 0.21]);
  g.add(paper);

  // ── cánh bút: một cột, một thanh ngang, đầu bút chạm mặt giấy ──
  // Cánh bút chạy theo phút đang đo: nó là thứ viết đồ thị lên giấy. Nó đứng
  // ở mép trái của dải giấy, không che các con số phút in ở mép phải.
  const pen = new THREE.Group(); pen.position.set(-.235, 0.012, 0.235); g.add(pen);
  pen.add(mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.20, 10), metal, [0, 0.10, 0]));
  pen.add(mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.16, 8), metal, [0.075, 0.185, 0], { rot: [0, 0, Math.PI / 2] }));
  pen.add(mesh(new THREE.ConeGeometry(0.016, 0.05, 10), red, [0.15, 0.160, 0], { rot: [0, 0, Math.PI] }));

  // ── cổng ba mươi phút: một chốt đỏ đứng ở vạch ba mươi phút ──
  const gate = mesh(rbox(0.03, 0.06, 0.05, 0.006), red, [-.15, 0.045, 0.21 + LMAX * (1 - 30 / 45)]);
  g.add(gate);

  // ── vẽ lại đồ thị tới phút đang đo ──
  // Nền giấy giữ riêng (hạt giấy, lưới, thang phút), đồ thị vẽ đè lên nền:
  // đổi phút thì chỉ vẽ lại mấy nét, không vẽ lại cả tờ giấy.
  let chartMinute = 45;
  const veDo = (m) => {
    const mm = Math.round(clamp(m, 0, 45));
    if (mm === chartMinute) return;
    chartMinute = mm;
    const { bg, g: cg, W: bw, H: bh } = tex.userData;
    cg.clearRect(0, 0, bw, bh);
    cg.drawImage(bg, 0, 0);
    veDuong(cg, bw, bh, mm);
    veSoPhut(cg, bw, bh, mm);
    tex.needsUpdate = true;
    pen.position.z = 0.21 + LMAX * (1 - mm / 45);
  };
  setMinute(30);

  // vị trí số "30" trên mặt đồng hồ đếm phút (toạ độ cục bộ của mặt số)
  const a30 = -Math.PI / 2 + (30 / 45) * (Math.PI * 5 / 4);
  g.mark30 = new THREE.Vector3(Math.cos(a30) * .056, Math.sin(a30) * .056, .004);
  g.paper = paper; g.gate = gate; g.dial = dial; g.setMinute = setMinute; g.clockFace = dial;
  return g;
}

// một dải giấy phẳng nằm ngang: uv.x = 1 ở đầu gần cây bút (phút hiện tại),
// uv.x = 0 ở đầu xa (phút 0). Mặt trên của dải hướng lên (+y) và máy quay
// luôn đứng bên phải (+x) nên uv.y phải đảo: v = 1 ở cạnh x = -w/2 (xa máy
// quay, tức là phía trên khung hình), nếu không chữ trên giấy bị lộn ngược.
function stripGeo(w, L) {
  const g = new THREE.BufferGeometry();
  const v = [-w / 2, 0, 0, w / 2, 0, 0, w / 2, 0, L, -w / 2, 0, L];
  const uv = [1, 1, 1, 0, 0, 0, 0, 1];
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex([0, 2, 1, 0, 3, 2]);
  g.computeVertexNormals();
  return g;
}

export const PROP = { name: 'máy ghi giấc ngủ', view: () => mayGhiGiacNgu() };
