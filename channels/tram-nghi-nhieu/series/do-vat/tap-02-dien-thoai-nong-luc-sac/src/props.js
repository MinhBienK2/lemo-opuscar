// Đạo cụ của tập 02 — "Vì sao điện thoại nóng lúc sạc?"
//
// Mỗi vật một hàm, vật dựng đúng là nó: có bộ phận đặc trưng để nhận ra trong một giây
// (củ sạc có chân cắm và nhãn in, điện thoại có cổng USB-C và màn hình đồng hồ sạc,
// túi pin có các lớp xếp sát, cuộn cảm có dây đồng quấn...). Vật nào có trạng thái
// (nóng dần, dòng chạy, nhiệt bốc lên, cột nhiệt kế dâng) thì có hàm set…() nhận 0..1.
//
// Quy ước: một đơn vị = MỘT MÉT. Mặt bàn ở y = 0. Máy quay luôn nhìn từ phía +z.
// Chỉ bốn con số được lên hình: 60 W (nhãn củ sạc), 20 V và 4 V (mực silk bo mạch),
// 45 °C (vạch đỏ trên cảm biến nhiệt). Không vẽ con số nào khác.
import * as THREE from 'three';
import { PAL, toon, glowMat, canvasTex, rbox, mesh, fxLayer, clamp, lerp, ss, eo, ei, hash, mulberry } from '../../../../rig/kit.js';
import { squiggle, buildHand } from '../../../../rig/fx.js';
import { sway, breathe } from '../../../../rig/motion.js';

// ── vật liệu dùng chung ─────────────────────────────────────────────────────
export const M = {
  white: toon('#f4f1e9'),
  plastic: toon('#e6e2d6'),
  dark: toon('#2b2f38'),
  darkSoft: toon('#3b414e'),
  metal: toon('#c3c9d4'),
  metalDark: toon('#6b7180'),
  copper: toon('#c9743a'),
  graphite: toon('#34383f'),
  separator: toon('#efe7d2'),
  board: toon('#1f6b3e'),
  rubber: toon('#3d4350'),
  glass: toon('#cdeef6', { transparent: true, opacity: .34, depthWrite: false }),
};

// một tấm nhãn có thể vẽ lại: trả về canvas, context và texture
function label(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return { c, x, t };
}

// một tấm phẳng có nhãn, nằm ngang (ngửa lên) tại (x, y, z)
function plane(w, h, tex, x, y, z, rot = [-Math.PI / 2, 0, 0]) {
  const m = mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }), [x, y, z], { rot, cast: false });
  return m;
}

// đoạn nhiệt: màu toon lạnh → ấm
const COLD = new THREE.Color('#3b414e'), WARM = new THREE.Color('#8c4a2c');
function warmInto(mat, k) {
  mat.color.copy(COLD).lerp(WARM, clamp(k));
  if (mat.emissive) mat.emissive.setRGB(.30 * k, .10 * k, .02 * k);
}


// một khung bao vô hình: giúp propcheck và máy quay đo đúng cỡ vật vô hình.
// Nó nằm ở lớp 2 — camera lớp 0/1 không thấy, tia bắn cũng không trúng.
function bboxHelper(g, w, h, d, y = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial());
  m.layers.set(2);
  m.position.y = y;
  g.add(m);
  return m;
}

// Màu từng hạt (instanceColor) của three.js chỉ vào hình khi vật liệu bật `vertexColors`;
// mà `vertexColors` lại đòi hình học phải có thuộc tính màu. Gắn một màu trắng cho nó:
// vColor = 1 × instanceColor, đúng ý.
function whiteColors(geo) {
  const n = geo.attributes.position.count;
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3));
  return geo;
}

// ── điện thoại ──────────────────────────────────────────────────────────────
// 0.150 × 0.070 × 0.0085 m, nằm sấp: màn hình ngửa lên, cổng USB-C ở mép trái.
export function createPhone({ charging = true } = {}) {
  const g = new THREE.Group(); g.name = 'dien-thoai';
  const W = .150, D = .070, T = .0085;

  // bo tròn phải NHỎ HƠN nửa độ dày: rbox() chặn bán kính ở nửa cạnh nhỏ nhất,
  // nên bo .0065 trên thân dày .0085 làm mặt trên và mặt dưới bằng phẳng —
  // hai mặt trùng nhau, và cạnh máy lộ ra những vệt "bưỡng cà" đen (c9, c12).
  g.add(mesh(rbox(W, T, D, .0024), M.dark, [0, T / 2, 0]));

  // mặt lưng: tấm riêng, đổi màu theo nhiệt
  const backMat = toon('#4c5364');
  // mặt lưng là mặt DƯỚI thân máy (màn hình ở local +y): tấm lưng phải nằm NGOÀI thân
  g.add(mesh(rbox(W * .99, .0014, D * .99, .0004), backMat, [0, -.0011, 0]));

  // màn hình: mảng sáng có đồng hồ sạc
  const sc = label(512, 256);
  const screenMat = new THREE.MeshBasicMaterial({ map: sc.t, toneMapped: false });
  const screen = mesh(new THREE.PlaneGeometry(W * .90, D * .80), screenMat, [0, T + .0005, 0], { rot: [-Math.PI / 2, 0, 0], cast: false });
  screen.name = 'man-hinh';
  g.add(screen);

  // camera và đèn flash ở góc lưng
  // cụm camera phải nhô ra khỏi MẶT LƯNG (local -y), không nằm trong thân
  const bump = new THREE.Group(); bump.name = 'cum-camera'; bump.position.set(-W * .30, -.0026, D * .18); g.add(bump);
  bump.add(mesh(rbox(.021, .0022, .021, .005), M.darkSoft, [0, 0, 0]));
  for (const [dx, dz, r] of [[-.0048, -.0048, .0049], [.0048, -.0048, .0049], [-.0048, .0048, .0049]]) {
    bump.add(mesh(new THREE.CylinderGeometry(r, r, .0014, 20), M.metalDark, [dx, -.0009, dz]));
    bump.add(mesh(new THREE.CylinderGeometry(r * .62, r * .62, .0016, 18), toon('#12161f'), [dx, -.0011, dz]));
  }
  bump.add(mesh(new THREE.SphereGeometry(.0018, 10, 8), toon('#ffe9b0'), [.0048, -.0009, .0048]));

  // cổng USB-C ở mép trái + lưỡi cắm kim loại
  g.add(mesh(rbox(.0022, .0038, .0098, .0011), toon('#141821'), [-W / 2 + .0008, T * .52, 0]));
  g.add(mesh(rbox(.0016, .0012, .0062, .0006), M.metal, [-W / 2 + .0004, T * .52, 0]));

  // nút nguồn và hai nút âm lượng ở mép phải
  g.add(mesh(rbox(.0016, .0026, .011, .0008), M.darkSoft, [W / 2 - .0006, T * .55, -.012]));
  g.add(mesh(rbox(.0016, .0026, .0072, .0008), M.darkSoft, [W / 2 - .0006, T * .55, .004]));
  g.add(mesh(rbox(.0016, .0026, .0072, .0008), M.darkSoft, [W / 2 - .0006, T * .55, .013]));

  // khe loa ở mép dưới
  g.add(mesh(rbox(.024, .0016, .0012, .0003), toon('#141821'), [-W / 2 + .022, T * .5, D / 2 - .0007]));

  // mực silk '20 V' và '4 V' — chỉ hiện ở bản cưa ngang
  const silkPort = label(256, 128), silkCell = label(256, 128);
  const p1 = plane(.016, .008, silkPort.t, 0, 0, 0);
  const p2 = plane(.012, .006, silkCell.t, 0, 0, 0);
  p1.visible = false; p2.visible = false;
  g.add(p1, p2);

  function drawOne(lb, txt) {
    const x = lb.x, c = lb.c;
    x.clearRect(0, 0, c.width, c.height);
    x.fillStyle = '#eef2ff'; x.font = 'bold 84px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(txt || '', c.width / 2, c.height / 2);
    lb.t.needsUpdate = true;
  }

  // ── trạng thái ──
  let level = charging ? .12 : 0, on = true, warm = 0, lastLevel = -1;
  // ba kiểu màn hình: đồng hồ sạc, bận (tin nhắn, thông báo), và game
  let mode = 'charge';

  function drawScreen(k) {
    const w = sc.c.width, h = sc.c.height, x = sc.x;
    x.fillStyle = '#0d1320'; x.fillRect(0, 0, w, h);
    const cx = w * .33, cy = h * .52, r = h * .33;
    x.lineCap = 'round';
    x.strokeStyle = 'rgba(110,160,255,.25)'; x.lineWidth = 15;
    x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke();
    x.strokeStyle = '#78dcff'; x.lineWidth = 15;
    x.beginPath(); x.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(k)); x.stroke();
    // tia sét ở giữa vòng
    x.fillStyle = '#ffe08a';
    x.beginPath();
    x.moveTo(cx + 6, cy - r * .52); x.lineTo(cx - r * .30, cy + 4); x.lineTo(cx - 2, cy + 4);
    x.lineTo(cx - 8, cy + r * .52); x.lineTo(cx + r * .30, cy - 6); x.lineTo(cx + 2, cy - 6);
    x.closePath(); x.fill();
    // thanh pin bên phải
    const bx = w * .66, by = h * .34, bw = w * .24, bh = h * .32;
    x.strokeStyle = 'rgba(190,210,255,.75)'; x.lineWidth = 4;
    x.strokeRect(bx, by, bw, bh);
    x.fillStyle = 'rgba(190,210,255,.75)'; x.fillRect(bx + bw + 3, by + bh * .34, 6, bh * .32);
    x.fillStyle = '#7ef0a8'; x.fillRect(bx + 5, by + 5, (bw - 10) * clamp(k * 1.6), bh - 10);
    sc.t.needsUpdate = true;
  }

  // màn hình đang bận: tin nhắn, thông báo, biểu tượng ứng dụng (một dòng nháy)
  function drawBusy(t) {
    const w = sc.c.width, h = sc.c.height, x = sc.x;
    // Màn hình phải SÁNG: nó là bằng chứng cho câu "máy đang chạy".
    x.fillStyle = '#2c4d8f'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#24407a';
    x.beginPath(); x.arc(w * .84, h * .16, h * .30, 0, Math.PI * 2); x.fill();
    // KHÔNG vẽ chữ nào lên màn hình: mỗi hàng là một ô thông báo có biểu
    // tượng vuông bo + hai vạch dài khác nhau. Trường `txt` cũ đã bỏ hẳn —
    // để lại chuỗi "Tin nhắn"/"Thông báo" trong mã là khiến người đọc tưởng
    // màn hình có chữ, trong khi khung hình không có chữ nào.
    const rows = [
      { on: true, c: '#3a72ee' },
      { on: Math.sin(t * 3.1) > -.15, c: '#e0a13a' },
      { on: true, c: '#38b06a' },
    ];
    rows.forEach((r, i) => {
      if (!r.on) return;
      const y = h * (.13 + i * .23), bw = w * .58, bh = h * .18;
      x.fillStyle = 'rgba(10,18,36,.88)';
      x.beginPath();
      x.roundRect ? x.roundRect(w * .05, y, bw, bh, 9) : x.rect(w * .05, y, bw, bh);
      x.fill();
      // ô biểu tượng ứng dụng: vuông bo, không phải tròn (tròn đọc như nút bấm)
      x.fillStyle = r.c;
      x.beginPath();
      x.roundRect ? x.roundRect(w * .085, y + bh * .22, bh * .56, bh * .56, bh * .16) : x.rect(w * .085, y + bh * .22, bh * .56, bh * .56);
      x.fill();
      // hai vạch chữ, dài khác nhau: một vạch dài đều đọc ra là thanh trượt
      // (một bảng điều khiển trộn âm), hai vạch lệch nhau đọc ra là tin nhắn
      x.fillStyle = 'rgba(226,232,246,.72)';
      x.beginPath();
      x.roundRect ? x.roundRect(w * .16, y + bh * .20, w * .30, bh * .24, 4) : x.rect(w * .16, y + bh * .20, w * .30, bh * .24);
      x.fill();
      x.fillStyle = 'rgba(226,232,246,.45)';
      x.beginPath();
      x.roundRect ? x.roundRect(w * .16, y + bh * .56, w * .17, bh * .20, 4) : x.rect(w * .16, y + bh * .56, w * .17, bh * .20);
      x.fill();
    });
    // dải biểu tượng dưới cùng: ô vuông bo (biểu tượng ứng dụng), không phải
    // nút tròn (nút tròn đọc ra là một dãy knob của mixer)
    const cols = ['#3a6ff0', '#e0603a', '#3ac0a0', '#e0c23a', '#8a5ce0'];
    for (let i = 0; i < 5; i++) {
      x.fillStyle = cols[i];
      x.beginPath();
      x.roundRect ? x.roundRect(w * (.16 + i * .17) - h * .05, h * .79, h * .10, h * .10, h * .028) : x.rect(w * (.16 + i * .17) - h * .05, h * .79, h * .10, h * .10);
      x.fill();
    }
    sc.t.needsUpdate = true;
  }

  // màn hình đang chơi game: một hình nhảy qua chướng vật (không có số nào)
  function drawGame(t) {
    const w = sc.c.width, h = sc.c.height, x = sc.x;
    // TRỜI XANH, ĐẤT XANH LÁ, MÂY TRẮNG, MỘT KHỐI VÀNG NHẢY QUA MỘT CHƯỚNG
    // VẬT ĐỎ: xem một giây phải biết đây là màn hình chơi game, chứ không phải
    // một tấm thẻ xanh có ô vàng.
    x.fillStyle = '#3f86cf'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#57a2e6'; x.fillRect(0, 0, w, h * .60);
    x.fillStyle = '#ffffff';
    for (const [cx, cy, cw] of [[w * .12, h * .16, w * .10], [w * .36, h * .09, w * .07], [w * .74, h * .20, w * .09]]) {
      x.beginPath(); x.arc(cx, cy, h * .052, 0, Math.PI * 2); x.fill();
      x.beginPath(); x.arc(cx + cw * .6, cy + h * .012, h * .040, 0, Math.PI * 2); x.fill();
      x.fillRect(cx - h * .02, cy, cw * .8, h * .048);
    }
    x.fillStyle = '#3fa85a'; x.fillRect(0, h * .60, w, h * .40);
    x.fillStyle = '#2e7c42'; x.fillRect(0, h * .60, w, 4);
    // MẶT ĐẤT CUỘN: một màn hình game mà đất đứng yên thì đọc ra là một tấm
    // thẻ có ô vàng. Các dải xanh đậm trôi ngang làm cả màn hình chuyển động.
    const scroll = (t * 320) % 96;
    x.fillStyle = '#38985c';
    for (let sx = -96; sx < w + 96; sx += 96) x.fillRect(sx - scroll, h * .60 + 4, 48, h * .40);
    const k = (Math.sin(t * 4.4) + 1) / 2;
    const px = w * .28, py = h * .60 - h * .24 * k;
    x.fillStyle = '#ffd23f';
    x.fillRect(px - h * .055, py, h * .11, h * .11);
    x.fillStyle = '#c78a12';
    x.fillRect(px - h * .055, py + h * .085, h * .11, h * .025);
    const ox = ((t * 55) % (w + 70)) - 35;
    x.fillStyle = '#e04a2c';
    x.fillRect(ox, h * .50, h * .11, h * .11);
    x.fillStyle = '#a82f18';
    x.fillRect(ox, h * .585, h * .11, h * .025);
    sc.t.needsUpdate = true;
  }

  function drawSilk(portTxt, cellTxt) {
    drawOne(silkPort, portTxt || '');
    drawOne(silkCell, cellTxt || '');
  }

  // Thân máy nằm trong một nhóm CON, để máy rung khi nóng mà không đụng vào
  // vị trí do bộ dựng cảnh và phim đặt (gán position.y sẽ xoá vị trí đó, máy
  // rơi xuống sàn và cụm ốp camera lộ ra dưới mặt bàn).
  const body = new THREE.Group(); body.name = 'than-may';
  for (const c of [...g.children]) body.add(c);
  g.add(body);

  const api = {
    group: g,
    plugPoint: new THREE.Vector3(-W / 2 - .0022, T * .52, 0),
    setScreen(v) { on = !!v; screenMat.color.setScalar(on ? 1 : .06); },
    setCharging(k) { level = clamp(k); drawScreen(level); lastLevel = level; },
    setWarm(k) { warm = clamp(k); warmInto(backMat, warm); },
    setSilk({ port, cell } = {}) {
      drawSilk(port || '', cell || '');
      silkPort.visible = !!port; silkCell.visible = !!cell;
      silkPort.position.set(-W * .12, T + .0008, D * .26);
      silkCell.position.set(W * .10, T + .0008, D * .26);
    },
    // Vẽ lại màn hình theo thời gian. Ở N3 cái máy bị cưa thành hai nửa,
    // nên hàm update của máy không còn chạy nữa — màn hình nằm trong một
    // nhóm riêng và phải được vẽ lại từ bên ngoài, nếu không nó đứng chết
    // một tấm ảnh và cả câu "máy đang chạy" trông như một cái máy tắt.
    redrawScreen(t) {
      if (mode === 'busy') drawBusy(t);
      else if (mode === 'game') drawGame(t);
    },
    // kiểu màn hình: 'charge' (đồng hồ sạc), 'busy' (tin nhắn, thông báo), 'game'
    setMode(m) {
      mode = m || 'charge';
      if (mode === 'busy') drawBusy(0);
      else if (mode === 'game') drawGame(0);
      else drawScreen(level);
      lastLevel = level;
    },
    update(t) {
      // đồng hồ sạc tự nhích lên (chỉ khi đang sạc), và máy hơi rung khi nóng
      api.redrawScreen(t);
      if (mode !== 'busy' && mode !== 'game' && charging && on) {
        level = clamp(level + t * .00035);
        if (Math.abs(level - lastLevel) > .004) { drawScreen(level); lastLevel = level; }
      }
      if (warm > .01) body.position.y = Math.sin(t * 21) * .00012 * warm;
    },
  };
  g.update = api.update;
  api.update(0);
  return api;
}

// ── củ sạc ──────────────────────────────────────────────────────────────────
// Vỏ trắng 0.045 × 0.030 × 0.020 m: hai chân cắm, một cổng USB-C, mỏ tản nhiệt có gân,
// và nhãn in trên mặt trên (mặc định "60 W").
export function createCharger({ watts = '60 W', big = false, plug = true } = {}) {
  const g = new THREE.Group(); g.name = 'cu-sac';
  const W = big ? .058 : .045, H = big ? .038 : .030, D = big ? .026 : .020;

  g.add(mesh(rbox(W, H, D, .005), M.white, [0, H / 2, 0]));
  // đường ghép nắp vỏ: một dải xám nhạt quanh thân. Trên nền sáng một củ sạc
  // trắng trơn chìm mất thành vệt sáng; có đường ghép thì vẫn đọc ra một vật có
  // khối, chứ không phải một mảng trắng.
  g.add(mesh(rbox(W + .0004, .0024, D + .0004, .004), toon('#d6d2c6'), [0, H * .22, 0]));

  // hai chân cắm tròn ở mặt sau (chân cắm vào ổ) — bộ sạc có dây thì không có chân
  if (plug) {
    for (const s of [-1, 1]) {
      g.add(mesh(new THREE.CylinderGeometry(.0022, .0022, .016, 12), M.metal, [s * W * .16, H * .52, -D / 2 - .0068], { rot: [Math.PI / 2, 0, 0] }));
    }
    // khe cắm chân ở mặt sau
    g.add(mesh(rbox(W * .55, H * .55, .0016, .0008), toon('#d9d5cb'), [0, H * .52, -D / 2 - .0004]));
  }

  // cổng USB-C ở mặt trước
  g.add(mesh(rbox(.0092, .0034, .003, .0014), toon('#141821'), [0, H * .48, D / 2 - .0004]));
  g.add(mesh(rbox(.0062, .0011, .0022, .0005), M.metal, [0, H * .48, D / 2 - .0008]));

  // mỏ tản nhiệt có gân, đứng dọc mép phải
  const finMat = toon('#8d96a4');   // xám lạnh: tách được với vỏ trắng
  const sink = new THREE.Group(); sink.position.set(W / 2 + .0032, 0, 0); g.add(sink);
  sink.add(mesh(rbox(.006, H * .55, D * .8, .0012), finMat, [0, H * .5, 0]));
  for (let i = 0; i < 6; i++) {
    sink.add(mesh(rbox(.0032, H * .5, .0016, .0006), finMat, [.0022, H * .5, -D * .36 + i * D * .145]));
  }

  // nhãn in: chữ ÉP vào mặt trên của vỏ (cùng vật liệu toon, sát mặt,
  // nền trùng màu vỏ, không viền) — không phải một mảnh phẳng dán lên vỏ.
  // Vị trí: góc sau-phải của mặt trên (z âm) để nằm trong nửa vỏ còn lại
  // sau khi cưa, và để dòng hạt ở N1 đi qua bên chứ không đè lên chữ.
  const LB_W = W * .52, LB_D = D * .40;
  const LB_X = W * .25, LB_Z = -D * .25;
  const lb = label(1024, 340);
  const lab = mesh(new THREE.PlaneGeometry(LB_W, LB_D), toon('#ffffff', { map: lb.t }),
    [LB_X, H + .0002, LB_Z], { rot: [-Math.PI / 2, 0, 0], cast: false });
  lab.name = 'nhan-in';
  lab.receiveShadow = false;
  g.add(lab);

  function drawLabel(txt) {
    const w = lb.c.width, h = lb.c.height, x = lb.x;
    x.clearRect(0, 0, w, h);
    x.fillStyle = '#f4f1e9'; x.fillRect(0, 0, w, h);      // nền TRÙNG màu vỏ: không thấy mép miếng dán
    x.fillStyle = '#22242c'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 240px "Be Vietnam Pro", sans-serif';
    x.fillText(txt || '', w / 2, h * .54);
    lb.t.needsUpdate = true;
  }
  drawLabel(watts);

  const api = {
    group: g,
    // cổng USB-C ở mặt trước (điểm đặt đầu dây): toạ độ trong khung của củ sạc
    usbPort: new THREE.Vector3(0, H * .48, D / 2),
    // tâm của nhãn in "60 W" trong khung của củ sạc (bộ dựng cảnh và phim
    // đọc điểm này để thẻ bám đúng lên chữ, không gõ tay toạ độ)
    labelPoint: new THREE.Vector3(LB_X, H + .0002, LB_Z),
    setLabel(txt) { drawLabel(txt || ''); },
    setWarm(k) { warmInto(finMat, clamp(k) * .8); },
    update(t) { g.rotation.y = Math.sin(t * .6) * .004; },
  };
  g.update = api.update;
  return api;
}

// ── dây sạc ─────────────────────────────────────────────────────────────────
// Một đầu USB-C (đầu này cắm vào cổng máy), một đầu cắm tường, dây uốn có độ võng.
// update(t) làm dây đung đưa nhẹ — nó tự động, không cần lệnh riêng.
export function createCable({ len = .55, far = 'wall' } = {}) {
  const g = new THREE.Group(); g.name = 'day-sac';
  const inner = new THREE.Group(); g.add(inner);          // phần đung đưa nằm trong inner

  // dây võng nhẹ sát bàn: đầu hai bên nằm ngang, giữa rủ xuống (rủ rõ hơn
  // để đọc ra là dây, không phải một sợi thẳng)
  const pts = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(len * .22, -.0058, .030),
    new THREE.Vector3(len * .46, -.0102, -.024),
    new THREE.Vector3(len * .72, -.0044, .018),
    new THREE.Vector3(len, 0, 0),
  ];
  const curve = new THREE.CatmullRomCurve3(pts);
  const rubber = toon('#2c2f36');
  const tube = mesh(new THREE.TubeGeometry(curve, 72, .0034, 10), rubber);
  inner.add(tube);

  // đầu USB-C: vỏ kim loại + khối nhựa, đặt ở đầu đường cong. Vỏ kim loại
  // dẹt bo tròn (bản dẹt của USB-C) và to đủ để đứng riêng vẫn đọc ra là
  // đầu cắm, không phải một núm nhỏ trên sợi dây.
  const head = new THREE.Group();
  const t0 = curve.getTangent(0).normalize();
  head.position.copy(curve.getPoint(0));
  head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), t0);
  head.add(mesh(rbox(.0132, .0046, .0040, .0014), toon('#c9cfd6'), [0, .0021, 0]));
  head.add(mesh(rbox(.0202, .0086, .0092, .0025), rubber, [0, .0104, 0]));
  head.name = 'dau-usb-c';
  inner.add(head);

  // đầu xa: mặc định là chân cắm tường; cũng có thể là một đầu USB-C thứ hai
  const plug = new THREE.Group();
  const t1 = curve.getTangent(1).normalize();
  plug.position.copy(curve.getPoint(1));
  plug.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), t1);
  if (far === 'usb') {
    // đầu USB-C thứ hai: kim loại cắm vào cổng, khối nhựa nằm ngoài (ngược đầu kia)
    plug.add(mesh(rbox(.0132, .0046, .0040, .0014), toon('#c9cfd6'), [0, -.0021, 0]));
    plug.add(mesh(rbox(.0202, .0086, .0092, .0025), rubber, [0, -.0104, 0]));
    plug.name = 'dau-usb-c';
  } else {
    // đầu cắm tường: khối nhựa + hai chân tròn
    plug.add(mesh(rbox(.020, .0125, .026, .003), M.white, [0, .007, 0]));
    for (const s of [-1, 1]) plug.add(mesh(new THREE.CylinderGeometry(.0021, .0021, .0085, 12), M.metal, [s * .0055, .0175, 0]));
    plug.name = 'dau-cam-tuong';
  }
  inner.add(plug);

  const api = {
    group: g,
    inner,
    // đầu dây bám theo vật: khi máy được cầm lên thì cổng sạc đi theo máy,
    // đoạn dây gần máy phải vẽ lại, nếu không thì đầu cắm rơi ra khỏi máy.
    // p là toạ độ THẾ GIỚI của miệng cổng.
    setNear(worldPoint) {
      const p = inner.worldToLocal(worldPoint.clone());
      if (p.distanceToSquared(pts[0]) < 1e-8) return;
      pts[0].copy(p);
      curve.points[0].copy(p);
      tube.geometry.dispose();
      tube.geometry = new THREE.TubeGeometry(curve, 72, .0034, 10);
      head.position.copy(p);
      const tn = curve.getTangent(0).normalize();
      head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tn);
    },
    update(t) {
      inner.rotation.y = Math.sin(t * .55) * .022;
      inner.rotation.z = Math.sin(t * .83 + 1.1) * .014;
      inner.position.y = Math.sin(t * .7) * .0016;
    },
  };
  g.update = api.update;
  return api;
}

// ── ổ cắm trên tường ───────────────────────────────────────────────────────
export function createWallSocket() {
  const g = new THREE.Group(); g.name = 'o-cam';
  const plate = mesh(rbox(.076, .076, .009, .008), M.white, [0, 0, 0]);
  g.add(plate);
  // hai ổ tròn, mỗi ổ có hai lỗ chân cắm: nhìn ra là ổ cắm điện
  for (const s of [-1, 1]) {
    const face = new THREE.Group();
    face.position.set(s * .0155, .002, .0046);
    g.add(face);
    face.add(mesh(new THREE.CylinderGeometry(.0105, .0105, .0035, 24), toon('#e4e0d3'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
    for (const t of [-1, 1]) {
      face.add(mesh(new THREE.CylinderGeometry(.0029, .0029, .007, 12), toon('#14171d'), [t * .0038, 0, .0016], { rot: [Math.PI / 2, 0, 0] }));
    }
  }
  // một phích cắm đang cắm trong ổ bên trái: thân phích nhỏ hơn đĩa ổ tròn
  // (để vành trắng của ổ vẫn lộ ra quanh phích) và màu xám khác với đĩa
  // trắng, nên đọc ra là "phích cắm vào ổ", không phải một vết mờ trên đĩa.
  const plug = new THREE.Group(); plug.position.set(-.0155, .002, .0070); g.add(plug);
  plug.add(mesh(rbox(.0186, .0186, .0135, .004), toon('#aab3bd'), [0, 0, .0115]));
  plug.add(mesh(rbox(.0196, .0196, .0030, .002), toon('#5c646f'), [0, 0, .0046]));
  for (const s of [-1, 1]) plug.add(mesh(new THREE.CylinderGeometry(.0022, .0022, .010, 12), M.metal, [s * .0038, 0, -.0022], { rot: [Math.PI / 2, 0, 0] }));
  const api = { group: g, update(t) { plug.rotation.z = Math.sin(t * .9) * .006; } };
  g.update = api.update;
  return api;
}

// ── ốp case silicone ───────────────────────────────────────────────────────
// Trong suốt, mép dày hơn, có khoét camera. setOn(false) → úp sang một bên.
export function createCase() {
  const g = new THREE.Group(); g.name = 'ong-case';
  const W = .158, D = .078, H = .0115;
  const shell = toon('#d7f2fb', { transparent: true, opacity: .34, depthWrite: false, side: THREE.DoubleSide });
  const rim = toon('#a9e4f7', { transparent: true, opacity: .95, depthWrite: false });

  // ốp là vỏ RỖNG: một đáy 1.8 mm + bốn thành 1.8 mm, lắp vào quanh máy .150×.070×.0085
  // (ốp sâu hơn máy một chút: .084 so với .070 — khoét camera cần chỗ, nếu sát
  // mép thì lỗ camera cắn mở thành khe, và ốp đọc ra là khay nhựa, không phải ốp)
  g.add(mesh(rbox(W, .0018, D, .006), shell, [0, .0009, 0]));            // đáy ốp
  for (const [w, d, x, z] of [[W, .0028, 0, D / 2 - .0014], [W, .0028, 0, -D / 2 + .0014], [.0028, D, W / 2 - .0014, 0], [.0028, D, -W / 2 + .0014, 0]]) {
    g.add(mesh(rbox(w, H - .0018, d, .0008), rim, [x, H / 2, z]));        // thành ốp
  }
  // khoét camera: đúng chỗ cụm camera của cái máy (x −45 mm, z +19.6 mm).
  // KHOÉT HÌNH CỤM CAMERA: khung vuông bo vòng ba ống kính và một đèn flash.
  // Một lỗ tròn đơn giữa khay đọc ra là "khay có lỗ thoát nước", không phải
  // ốp điện thoại — đó là lý do khoét này có hình cụm camera chứ không có
  // hình tròn.
  const camX = -.045, camZ = .0126, camR = .0168;
  for (const [w, d, x, z] of [[camR * 2, .0034, camX, camZ - camR + .0017], [camR * 2, .0034, camX, camZ + camR - .0017],
                             [.0034, camR * 2, camX - camR + .0017, camZ], [.0034, camR * 2, camX + camR - .0017, camZ]]) {
    g.add(mesh(rbox(w, .0026, d, .0009), rim, [x, .0013, z]));
  }
  for (const [dx, dz] of [[-.0076, -.0076], [.0076, -.0076], [-.0076, .0076]]) {
    g.add(mesh(new THREE.CylinderGeometry(.0048, .0048, .0022, 18), toon('#20242c'), [camX + dx, .0011, camZ + dz]));
    g.add(mesh(new THREE.TorusGeometry(.0048, .0008, 6, 18), toon('#93a3b6'), [camX + dx, .0022, camZ + dz], { rot: [Math.PI / 2, 0, 0] }));
  }
  g.add(mesh(new THREE.CylinderGeometry(.0022, .0022, .0018, 12), toon('#f2e8c4'), [camX + .0076, .0011, camZ + .0076]));
  // lỗ nút ở mép phải
  for (const z of [-.012, .005, .015]) g.add(mesh(rbox(.003, .0032, .008, .0012), rim, [W / 2 - .0012, H * .5, z]));

  const OFF = new THREE.Vector3(.52, 0, .04);
  let home = null;
  const api = {
    group: g,
    setOn(on) {
      if (!home) home = g.position.clone();
      if (on) {
        g.position.copy(home); g.rotation.set(0, 0, 0);
      } else {
        g.position.copy(home).add(OFF);
        g.rotation.set(0, .22, 0);
      }
      g.updateMatrixWorld(true);
    },
    update(t) { g.rotation.z = Math.sin(t * .5) * .006; },
  };
  g.update = api.update;
  return api;
}

// ── nhiệt kế ────────────────────────────────────────────────────────────────
// Ống thuỷ tinh, cột chất lỏng dâng lên theo setLevel(0..1). Thang không có con số:
// mốc 45 °C thuộc về cảm biến nhiệt trong máy, không phải nhiệt độ mặt lưng.
export function createThermometer({ H = .115 } = {}) {
  const g = new THREE.Group(); g.name = 'nhiet-ke';
  const glass = toon('#d8f0f8', { transparent: true, opacity: .58, depthWrite: false });

  g.add(mesh(new THREE.SphereGeometry(.0096, 20, 14), glass, [0, .0096, 0]));
  g.add(mesh(new THREE.CylinderGeometry(.0058, .0058, H, 18, 1, true), glass, [0, H / 2 + .0096, 0]));
  g.add(mesh(new THREE.SphereGeometry(.0058, 16, 12), glass, [0, H + .0096, 0]));
  // cột chất lỏng: gốc ở đáy, cao lên theo setLevel
  const colGeo = new THREE.CylinderGeometry(.0040, .0040, H, 14);
  colGeo.translate(0, H / 2, 0);
  const colMat = toon('#e0563f');
  const col = mesh(colGeo, colMat, [0, .0096, 0]);
  g.add(col);
  // tấm thang bám vào thân ống (không đứng rời như một bảng thang riêng): cổ
  // nối nhỏ nối từ ống sang tấm thang, để cả vật đọc ra là MỘT nhiệt kế.
  const scale = new THREE.Group(); scale.position.set(.0098, 0, 0); g.add(scale);
  scale.add(mesh(rbox(.0058, .010, .0032, .0010), glass, [-.0026, .034, 0]));
  scale.add(mesh(rbox(.0112, H + .012, .0016, .0006), M.white, [0, H / 2 + .0096, 0]));
  for (let i = 0; i <= 10; i++) {
    const long = i % 5 === 0;
    scale.add(mesh(rbox(long ? .0060 : .0032, .0012, .0018, .0004), toon('#3a3f4a'), [long ? -.0024 : -.0014, .012 + i * (H - .004) / 10, .0008]));
  }
  // vạch đỏ: chỉ hiện khi được yêu cầu
  const mark = mesh(rbox(.0092, .0016, .002, .0005), toon('#d23a3a'), [.0, .05, .0012]);
  mark.visible = false;
  scale.add(mark);

  // mặc định cột đã dâng lên một chút: đứng riêng, nhiệt kế phải đọc ra là
  // nhiệt kế có cột chất lỏng, không phải một ống rỗng có cục hồng ở đáy.
  let level = .30;
  const api = {
    group: g,
    setLevel(k) { level = clamp(k); col.scale.y = Math.max(.001, level); },
    setMark(deg) {
      // thang đo chạy từ mười đến năm mươi độ
      const k = (deg - 10) / 40;
      mark.position.y = .012 + clamp(k) * (H - .004);
      mark.visible = true;
    },
    update(t) { g.rotation.z = Math.sin(t * .7) * .008; },
  };
  g.update = api.update;
  api.setLevel(level);
  return api;
}

// ── dòng điện ───────────────────────────────────────────────────────────────// Dòng điện = hạt cyan bay dọc một đường cong. setLoss(i, frac): tại điểm thứ i
// của đường, chỉ còn frac phần dòng đi đi tiếp; phần còn lại đổi sang cam và tan
// (đó là phần điện thành nhiệt).
export function createCurrentStream(points, { n = 60, speed = 1, color = '#8fe3ff', size = 0 } = {}) {
  const g = new THREE.Group(); g.name = 'dong-dien';
  const curve = new THREE.CatmullRomCurve3(points.map(p => p.isVector3 ? p.clone() : new THREE.Vector3(...p)));
  // bán kính hạt bám theo bước giữa hai hạt: hạt phải RỜI nhau để đọc được là
  // "dây hạt" (và để đuôi dòng thưa dần thấy được là hạt thiếu, không phải
  // một ống nhạt màu). Hệ số nhân thêm tính cả lúc hạt phình ra, nên để nhỏ.
  // `size`: một dòng điện nằm trong máy được quay rất gần — hạt cỡ milimét
  // không đổi được mấy pixel nào ở cự ly đó, và cả cảnh đứng chết. Cho phép
  // đặt bán kính hạt riêng cho những dòng ấy.
  const r = size > 0 ? clamp(size, .00035, .0040)
    : clamp(curve.getLength() / Math.max(1, n) * .34, .00035, .0012);
  // vertexColors: three.js chỉ đưa màu của từng hạt (instanceColor) vào hình khi vật liệu bật cờ này
  const mat = new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: .95, depthWrite: false, vertexColors: true });
  const im = new THREE.InstancedMesh(whiteColors(new THREE.SphereGeometry(r, 10, 8)), mat, n);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.frustumCulled = false; im.renderOrder = 8;
  // Hạt là thứ vô hình được vẽ ra: chúng thuộc lớp fx (vẽ sau nét mực), nên không có
  // nét mực lệch bên cạnh dãy hạt như một cái bóng ma.
  fxLayer(im);
  g.add(im);
  bboxHelper(g, .18, .05, .06, .01);

  const cold = new THREE.Color(color), hot = new THREE.Color('#ff8a3d');
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  let lossAt = Math.max(1, points.length - 1), lossKeep = 1;
  // đuôi dòng hạt thưa dần: đoạn cuối chỉ giữ lại `keep` phần hạt (dòng sạc bị cắt)
  let tailAt = 1, tailKeep = 1;
  // mật độ hạt: 1 = dòng đầy; < 1 = dòng thưa dần (khi máy tự giảm dòng sạc)
  let density = 1;

  const api = {
    group: g,
    setDensity(k) { density = clamp(k); },
    setLoss(index, frac) {
      lossAt = clamp(index / Math.max(1, points.length - 1), 0, 1);
      lossKeep = clamp(frac);
    },
    // đuôi dòng hạt thưa dần: từ `from` trở đi chỉ còn `keep` phần hạt (dòng sạc bị cắt)
    setTail(from, keep) { tailAt = clamp(from); tailKeep = clamp(keep); },
    update(t, power = 1) {
      const pw = clamp(power);
      im.visible = pw > .01 && density > .01;
      if (!im.visible) return;
      for (let i = 0; i < n; i++) {
        const u = (t * speed + i / n) % 1;
        // getPointAt: đi theo CUNG ĐỘ dài, nên hạt cách đều nhau trên đường cong.
        // getPoint (theo tham số) dồn hạt vào chỗ các đoạn cong ngắn — ở đoạn cuối
        // sát cảm biến, hạt dính thành một vệt liền khối, không đọc được là hạt.
        curve.getPointAt(u, p);
        // hạt nào nằm trong phần bị thất thoát thì đổi màu và nhỏ dần
        const doomed = u > lossAt && (i / n) > lossKeep;
        const fade = doomed ? clamp(1 - (u - lossAt) * 7) : 1;
        // mật độ hạt: bỏ bớt hạt theo vị trí giả ngẫu nhiên ⇒ dòng THƯA thật, không phải hạt nhỏ
        const on = density >= .999 ? 1 : ((((i * 2654435761) >>> 0) % 1000) < density * 1000 ? 1 : 0);
        // hạt to gần bằng bán kính hình học: ma trận chỉ nhân thêm một hệ số, không nhân lại bán kính
        // đuôi dòng bị cắt: ở đoạn cuối chỉ giữ lại mỗi k hạt một ⇒ đuôi THƯA
        // thật (khoảng cách hạt giãn ra), chứ không phải xoá một đoạn hạt rồi
        // để lại một dải hạt sát nhau — vẫn đọc là một dòng đặc.
        const every = Math.max(1, Math.round(1 / Math.max(.02, tailKeep)));
        const thin = u > tailAt && tailKeep < .999 && (i % every) !== 0;
        const sc = on && !thin ? (1.4 + .5 * Math.sin(i * 2.4 + t * 3)) * fade * pw : 0;
        m4.compose(p, q, s.set(sc, sc, sc));
        im.setMatrixAt(i, m4);
        const c = doomed ? cold.clone().lerp(hot, 1 - fade) : cold;
        im.setColorAt(i, c);
      }
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
    },
  };
  g.update = api.update;
  api.update(0);
  return api;
}

// ── nhiệt ───────────────────────────────────────────────────────────────────
// Nhiệt = hạt cam/đỏ mọc tại một điểm rồi bay lên và tỏa. setRate(r) đổi đậm/nhạt.
export function createHeatPlume(point, { n = 40, color = '#ff9a3c', rise = .085, spread = .028, size = .0012 } = {}) {
  const g = new THREE.Group(); g.name = 'nhiet';
  const P = point.isVector3 ? point.clone() : new THREE.Vector3(...point);
  g.position.copy(P);
  const mat = new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: .9, depthWrite: false, vertexColors: true });
  const im = new THREE.InstancedMesh(whiteColors(new THREE.SphereGeometry(size, 10, 8)), mat, n);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.frustumCulled = false; im.renderOrder = 8;
  fxLayer(im);
  g.add(im);
  bboxHelper(g, .07, .10, .07, .045);

  const c0 = new THREE.Color(color), c1 = new THREE.Color('#d81f3a');
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  let rate = 1;

  const api = {
    group: g,
    setRate(r) { rate = clamp(r); },
    update(t) {
      const rw = clamp(rate);
      for (let i = 0; i < n; i++) {
        const u = (t * .32 + i / n) % 1;
        const h = u * rise;
        const a = i * 2.399 + t * .5;
        const sp = spread * (.30 + u * 1.5);
        p.set(Math.cos(a) * sp, h, Math.sin(a) * sp);
        const sc = (1.15 - u * .75) * rw;
        m4.compose(p, q, s.set(sc, sc, sc));
        im.setMatrixAt(i, m4);
        im.setColorAt(i, c0.clone().lerp(c1, u));
      }
      im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
    },
  };
  g.update = api.update;
  api.update(0);
  return api;
}

// ── gợn nhiệt ───────────────────────────────────────────────────────────────
// Vệt gợn nhiệt (ribbon của rig) dựng lên tại từng điểm của một đường.
export function createHeatSquiggle(points, { color = PAL.orange } = {}) {
  const g = new THREE.Group(); g.name = 'go-nhiet';
  const list = points.map(p => p.isVector3 ? p.clone() : new THREE.Vector3(...p));
  const quigs = [];
  // Mỗi chỗ nóng dựng BA vệt lệch nhau, mỗi vệt một độ dài và một độ mờ
  // khác nhau: một vệt đơn lẻ đọc ra là nét vẽ lạc, ba vệt xếp tầng mới đọc
  // ra là nhiệt bốc lên và nhạt dần ở đỉnh.
  list.forEach((p) => {
  for (let k = 0; k < 3; k++) {
    const s = squiggle(color);
    // Vệt của rig vẽ bằng cách cộng ánh sáng: trên nền sáng (propcheck) nó chỉ thành
    // một vệt trắng trắng. Ở đây vẽ bằng cách pha thường để gợn nhiệt đọc được là
    // màu cam ở mọi nền.
    s.material.blending = THREE.NormalBlending;
    s.U.uColor.value.set(color).multiplyScalar(1.05 - k * .13);
    s.U.uColor2.value.set(color).multiplyScalar(.88 - k * .13);
    s.position.copy(p).add(new THREE.Vector3((k - 1) * .0062, k * .0016, (k % 2 ? .0042 : -.0042)));
    s.U.uAmp.value = .011 + k * .0026;
    s.U.uFreq.value = 116 - k * 14;
    s.U.uWidth.value = .0064 + k * .0014;
    // Vệt được dựng trong vertex shader, còn hình học là một mặt phẳng 1×1: hộp bao của nó
    // khổng lồ nên propcheck đặt máy quay rất xa và vệt biến mất. Đặt lại hộp bao đúng
    // bằng kích thước thật của vệt (0…0,070 m cao, rộng 0,028 m).
    s.geometry.boundingBox = new THREE.Box3(new THREE.Vector3(-.014, 0, 0), new THREE.Vector3(.014, .070, 0));
    s.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, .035, 0), .05);
    g.add(s);
    quigs.push({ s, k });
  }
  // chỗ nóng ở gốc: một cụm hạt nhỏ bám đúng mặt vật, để gợn nhiệt đọc ra là
  // bốc lên TỪ một chỗ, không phải một sợi lơ lửng trong không khí
  const spot = new THREE.InstancedMesh(
    new THREE.SphereGeometry(.0016, 8, 6),
    new THREE.MeshBasicMaterial({ color, toneMapped: false, transparent: true, opacity: .85, depthWrite: false }),
    7
  );
  spot.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  spot.frustumCulled = false;
  spot.renderOrder = 8;
  fxLayer(spot);
  g.add(spot);
  quigs.push({ spot, base: p.clone() });
  });
  bboxHelper(g, .04, .09, .04, .04);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s3 = new THREE.Vector3(), pv = new THREE.Vector3();
  const api = {
    group: g,
    update(t) {
      quigs.forEach((it) => {
        if (it.spot) {
          for (let i = 0; i < 7; i++) {
            const a = i * 2.399 + t * .6;
            const r = .0032 * (i / 7);
            pv.set(it.base.x + Math.cos(a) * r, it.base.y + .0012 + Math.sin(t * 1.4 + i) * .0006, it.base.z + Math.sin(a) * r);
            const sc = .85 + .25 * Math.sin(t * 3 + i);
            m4.compose(pv, q, s3.set(sc, sc, sc));
            it.spot.setMatrixAt(i, m4);
          }
          it.spot.instanceMatrix.needsUpdate = true;
          return;
        }
        const s = it.s, k = it.k;
        const c = (t * .30 + k * .17) % 1;
        // Đầu gợn ở trên, đuôi gợn ở đúng chỗ gốc: vệt mọc lên từ mặt vật.
        // (rig cắt bỏ phần dưới y = 0, nên chiều dài phải bằng đúng độ cao đầu gợn.)
        const head = .032 + c * .022 - k * .004;
        s.U.uLen.value = head;
        s.U.uHead.value = head;
        s.U.uPhase.value = t * 2.4 + k * 1.7;
        // vệt trên cùng nhạt hơn: nhìn từ đỉnh xuống, nhiệt đã loãng
        s.U.uAlpha.value = clamp(1.05 - c * .45 - k * .22);
      });
    },
  };
  g.update = api.update;
  api.update(0);
  return api;
}

// ── cuộn biến áp ────────────────────────────────────────────────────────────
// Lõi sắt từ, dây đồng quấn quanh, băng keo. update(t) rung rất nhẹ.
export function createTransformer({ r = .0075, h = .013 } = {}) {
  const g = new THREE.Group(); g.name = 'bien-ap';
  // Cuộn biến áp RUNG, nhưng rung bằng cách dịch nhóm CON. Gán vào position
  // của chính group thì xoá mất vị trí bộ dựng cảnh đã đặt: cuộn trượt khỏi
  // chỗ, còn hơi nhiệt vẫn mọc đúng chỗ cũ — nhiệt và cuộn lệch nhau.
  const w = new THREE.Group(); w.name = 'run'; g.add(w);
  const iron = toon('#4a505c'), copper = toon('#c9743a'), tape = toon('#e8c35a');
  // lõi hình chữ E: hai yoke trên dưới, ba chân đứng
  w.add(mesh(rbox(r * 2.6, .0032, r * 1.4, .0008), iron, [0, h * .10, 0]));
  w.add(mesh(rbox(r * 2.6, .0032, r * 1.4, .0008), iron, [0, h * .90, 0]));
  for (const x of [-r * 1.05, 0, r * 1.05]) w.add(mesh(rbox(r * .62, h * .82, r * 1.2, .0008), iron, [x, h * .5, 0]));
  // dây đồng quấn quanh chân giữa
  for (let i = 0; i < 10; i++) {
    w.add(mesh(new THREE.TorusGeometry(r * .56, .0011, 6, 18), copper, [0, h * .22 + i * h * .058, 0], { rot: [Math.PI / 2, 0, 0] }));
  }
  // băng keo giữ cuộn dây
  w.add(mesh(new THREE.CylinderGeometry(r * .82, r * .82, h * .26, 20, 1, true), tape, [0, h * .46, 0]));
  const api = { group: g, update(t) { w.position.x = Math.sin(t * 41) * .00012; } };
  g.update = api.update;
  return api;
}

// ── mỏ tản nhiệt ────────────────────────────────────────────────────────────
export function createHeatSink({ w = .030, d = .014, fins = 7, t = .0016 } = {}) {
  const g = new THREE.Group(); g.name = 'mo-tan-nhiet';
  const mat = toon('#b9bfc8');
  g.add(mesh(rbox(w, t, d, .0005), mat, [0, t / 2, 0]));
  for (let i = 0; i < fins; i++) {
    g.add(mesh(rbox(.0016, .0092, d * .92, .0004), mat, [-w / 2 + (i + .5) * w / fins, t + .0046, 0]));
  }
  return { group: g, setWarm(k) { warmInto(mat, clamp(k) * .9); } };
}

// ── cuộn cảm dây đồng ───────────────────────────────────────────────────────
// Cuộn cảm trên bo mạch, có dòng hạt chạy qua và hạt đỏ bám quanh.
// setCurrent(k): k nhỏ → dòng thưa, ít hạt đỏ; k lớn → dòng dày, hạt đỏ nhiều hẳn.
export function createInductor({ r = .0062, h = .0075 } = {}) {
  const g = new THREE.Group(); g.name = 'cuan-cam';
  const core = toon('#2f333c'), copper = toon('#c9743a'), copper2 = toon('#9c5326');
  g.add(mesh(new THREE.CylinderGeometry(r * .55, r * .55, h, 16), core, [0, h / 2, 0]));
  g.add(mesh(rbox(r * 1.45, .0009, r * 1.25, .0003), toon('#34383f'), [0, .00045, 0]));
  // bobbin nhựa kem giữa lõi và dây: đọc ra là dây quấn quanh lõi, không phải
  // một khối trụ như nắp ren
  g.add(mesh(new THREE.CylinderGeometry(r * .62, r * .62, h * .82, 16), toon('#e8dfc8'), [0, h / 2, 0]));
  // sáu vòng dây đồng, xen kẽ hai sắc để thấy từng vòng một
  for (let i = 0; i < 6; i++) {
    const y = .0017 + i * (h - .0034) / 5;
    g.add(mesh(new THREE.TorusGeometry(r * .80, .0013, 7, 20), i % 2 ? copper2 : copper, [0, y, 0], { rot: [Math.PI / 2, 0, 0] }));
  }
  // hạt dòng điện chạy quanh cuộn + hạt đỏ (nhiệt) bám bên ngoài
  const nDot = 14, nHot = 18;
  const mat = new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: .95, depthWrite: false, vertexColors: true });
  const dots = new THREE.InstancedMesh(whiteColors(new THREE.SphereGeometry(.0009, 8, 6)), mat, nDot);
  const hots = new THREE.InstancedMesh(whiteColors(new THREE.SphereGeometry(.0010, 8, 6)), mat.clone(), nHot);
  // hào quang mềm quanh hạt nhiệt: hạt đỏ thẫm phải tách được với thân cuộn
  // Hào quang nhỏ: hào quang to chồng lên nhau thành đám cam khổng lồ, nuốt
  // mất cả thân cuộn — người xem không đếm được hạt nhiệt.
  const halos = new THREE.InstancedMesh(whiteColors(new THREE.SphereGeometry(.0010, 8, 6)),
    new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: .07, depthWrite: false, vertexColors: true, blending: THREE.AdditiveBlending }), nHot);
  halos.instanceMatrix.setUsage(THREE.DynamicDrawUsage); halos.frustumCulled = false; halos.renderOrder = 7;
  fxLayer(halos);
  g.add(halos);
  dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage); hots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  dots.frustumCulled = false; hots.frustumCulled = false;
  dots.renderOrder = 8; hots.renderOrder = 8;
  fxLayer(dots); fxLayer(hots);
  g.add(dots, hots);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  // Hạt nhiệt đỏ thẫm, tách hẳn tông với thân cuộn (#c9743a): cùng tông
  // thì hạt nhiệt chìm vào cuộn, không đếm được đâu là nhiệt.
  const cold = new THREE.Color('#8fe3ff'), hot = new THREE.Color('#ff3d14');
  let cur = .35;

  const api = {
    group: g,
    setCurrent(k) { cur = clamp(k); },
    update(t) {
      for (let i = 0; i < nDot; i++) {
        const u = (t * .55 + i / nDot) % 1;
        const a = u * Math.PI * 2;
        const rad = r * (.9 + .25 * Math.sin(u * 6.2));
        p.set(Math.cos(a) * rad, .002 + Math.sin(u * Math.PI) * h * .8, Math.sin(a) * rad);
        const sc = (.4 + cur);
        m4.compose(p, q, s.set(sc, sc, sc));
        dots.setMatrixAt(i, m4);
        dots.setColorAt(i, cold);
      }
      dots.instanceMatrix.needsUpdate = true;
      if (dots.instanceColor) dots.instanceColor.needsUpdate = true;
      for (let i = 0; i < nHot; i++) {
        const on = (i / nHot) < cur;
        const u = (t * .4 + i / nHot) % 1;
        const a = u * Math.PI * 2 + 1.2;
        const rad = r * 1.18;
        p.set(Math.cos(a) * rad, .001 + Math.sin(u * Math.PI) * h * .5, Math.sin(a) * rad);
        const sc = on ? (.5 + .8 * Math.sin(u * Math.PI)) : 1e-4;
        m4.compose(p, q, s.set(sc, sc, sc));
        hots.setMatrixAt(i, m4);
        hots.setColorAt(i, hot);
      }
      hots.instanceMatrix.needsUpdate = true;
      if (hots.instanceColor) hots.instanceColor.needsUpdate = true;
    },
  };
  g.update = api.update;
  api.update(0);
  return api;
}

// ── cảm biến nhiệt ──────────────────────────────────────────────────────────
// Miếng cảm biến nhỏ trên bo mạch, hai chân, đổi màu khi nóng. Thang của nó có
// một vạch đỏ: đó là mốc của tế bào pin, không phải nhiệt độ mặt lưng.
export function createThermalSensor({ w = .0058, d = .0038, t = .0022 } = {}) {
  const g = new THREE.Group(); g.name = 'cam-bien-nhiet';
  const bodyMat = toon('#3a3f4a');
  // tấm bo nhỏ làm nền, có thang vạch
  g.add(mesh(rbox(.020, .0011, .013, .0004), toon('#1f6b3e'), [0, .00055, 0]));
  for (let i = 0; i <= 8; i++) {
    const long = i % 4 === 0;
    g.add(mesh(rbox(long ? .0034 : .0018, .0004, .0007, .0002), toon('#b9c2cc'), [.0072, .0012, -.0052 + i * .0013], { cast: false }));
  }
  // vạch đỏ (mốc) trên thang
  const mark = mesh(rbox(.0044, .0006, .0018, .0002), toon('#d23a3a'), [.0072, .0014, .0022], { cast: false });
  mark.visible = false;
  g.add(mark);
  // Con số 45 °C do thẻ chữ điểm vào vạch đỏ (thẻ nằm đúng câu kể). Không in
  // thêm số lên tấm bo: in thêm thì chữ nằm nghiêng theo góc bo mạch, đọc
  // không ra, lại thành hai con số cùng nói một chuyện.
  // miếng cảm biến và hai chân
  g.add(mesh(rbox(w, t, d, .0006), bodyMat, [0, .0011 + t / 2, 0]));
  for (const s of [-1, 1]) g.add(mesh(rbox(.0012, .0006, .0016, .0002), M.metal, [s * w * .42, .0011, d * .55]));

  let hot = 0;
  const api = {
    group: g,
    setHot(k) { hot = clamp(k); warmInto(bodyMat, hot * .8); },
    setMark(deg) {
      // thang đo chạy từ mười đến năm mươi độ
      const k = (deg - 10) / 40;
      mark.position.z = -.0044 + clamp(k) * .0088;
      mark.visible = true;
    },
    // rung nhẹ khi nóng: CỘNG vào chiều cao đã có, không ghi đè. Ghi đè sẽ
    // làm cảm biến rơi xuống dưới mặt túi pin và biến mất khỏi khung hình.
    update(t) {
      const base = g.userData.baseY ?? (g.userData.baseY = g.position.y);
      g.position.y = base + (hot > .02 ? Math.sin(t * 17) * .00012 * hot : 0);
    },
  };
  g.update = api.update;
  return api;
}

// ── cổng USB-C ──────────────────────────────────────────────────────────────
export function createUSBCPort({ w = .0094, h = .0034, d = .0028 } = {}) {
  const g = new THREE.Group(); g.name = 'cong-usb-c';
  const shell = toon('#c9cfd6'), gold = toon('#e2b451');
  // Miệng cổng hình quả dục (bo tròn hai đầu) như USB-C thật. Vỏ hộp chữ
  // nhật như trước đọc ra là USB-A, nên vỏ ở đây khoét bằng hình quả dục.
  const stadium = (width, height) => {
    const s = new THREE.Shape(), rr = height / 2, L = Math.max(.0002, width - height);
    s.absarc(L / 2, 0, rr, -Math.PI / 2, Math.PI / 2, false);
    s.absarc(-L / 2, 0, rr, Math.PI / 2, Math.PI * 1.5, false);
    s.closePath();
    return s;
  };
  const outer = stadium(w, h);
  outer.holes.push(new THREE.Path(stadium(w - .0013, h - .0011).getPoints(28).reverse()));
  const shellGeo = new THREE.ExtrudeGeometry(outer, { depth: d, bevelEnabled: false, curveSegments: 12 });
  shellGeo.translate(0, 0, -d);                 // miệng cổng hở về phía +z
  g.add(mesh(shellGeo, shell, [0, 0, 0]));
  // khoang trong tối + lưỡi cắm nằm giữa khe
  g.add(mesh(rbox(w * .78, h * .46, d * .30, .0002), toon('#15181e'), [0, 0, -d * .60]));
  g.add(mesh(rbox(w * .60, .0007, d * .55, .0002), toon('#2b2f38'), [0, 0, 0]));
  // mười hai chân vàng trên, mười hai chân vàng dưới — USB-C có hai hàng
  for (let i = 0; i < 12; i++) {
    const x = -w * .27 + i * (w * .54 / 11);
    g.add(mesh(rbox(.0005, .00025, d * .26, .00006), gold, [x, .00048, -.0001], { cast: false }));
    g.add(mesh(rbox(.0005, .00025, d * .26, .00006), gold, [x, -.00048, -.0001], { cast: false }));
  }
  return { group: g };
}

// ── bo mạch ─────────────────────────────────────────────────────────────────
// Bo mạch 0.090 × 0.050 m: chip sạc, một con tụ, một cuộn cảm, cổng USB-C ở mép,
// và mực silk '20 V' cạnh cổng, '4 V' cạnh túi pin.
export function createBoard({ w = .090, d = .050, t = .0016 } = {}) {
  const g = new THREE.Group(); g.name = 'bo-mach';
  const r = mulberry(21);
  const tex = canvasTex(1024, Math.round(1024 * d / w), (x, W, H) => {
    x.fillStyle = '#1f6b3e'; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#3f9a5d'; x.lineWidth = 7; x.lineCap = 'round';
    for (let i = 0; i < 46; i++) {
      let px = r() * W, py = r() * H; x.beginPath(); x.moveTo(px, py);
      for (let k = 0; k < 3; k++) { if (r() < .5) px += (r() - .5) * W * .5; else py += (r() - .5) * H * .5; x.lineTo(px, py); }
      x.stroke();
    }
    x.fillStyle = '#d6b25a';
    for (let i = 0; i < 90; i++) { x.beginPath(); x.arc(r() * W, r() * H, 7, 0, Math.PI * 2); x.fill(); }
    x.strokeStyle = '#d6b25a'; x.lineWidth = 3;
    for (const [a, b] of [[.04, .04], [.96, .04], [.04, .96], [.96, .96]]) { x.beginPath(); x.arc(a * W, b * H, 17, 0, Math.PI * 2); x.stroke(); }
  });
  g.add(mesh(rbox(w, t, d, .0006), toon('#2a7a4a'), [0, t / 2, 0]));
  g.add(mesh(new THREE.PlaneGeometry(w * .995, d * .995), toon('#ffffff', { map: tex }), [0, t + .0003, 0], { rot: [-Math.PI / 2, 0, 0], cast: false }));

  // chip sạc: thân epoxy đen, chân hai bên, chấm chân một — không chữ số
  const chipG = new THREE.Group(); chipG.position.set(-w * .10, t, -d * .10); g.add(chipG);
  chipG.add(mesh(rbox(.0125, .0022, .0092, .0004), toon('#1d1f24'), [0, .0011, 0]));
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) {
    chipG.add(mesh(rbox(.0016, .0004, .0008, .0002), toon('#cfd4da'), [s * .0072, .0005, -.0034 + i * .00136], { cast: false }));
  }
  chipG.add(mesh(new THREE.CylinderGeometry(.0007, .0007, .0004, 10), toon('#34373e'), [-.004, .0023, -.0028]));
  // một con tụ (thấp, không tràn ra ngoài viền máy)
  const cap = new THREE.Group(); cap.position.set(-w * .26, t, d * .12); g.add(cap);
  cap.add(mesh(new THREE.CylinderGeometry(.0032, .0032, .0026, 16), toon('#2d4f8f'), [0, .0013, 0]));
  cap.add(mesh(new THREE.CylinderGeometry(.0033, .0033, .0026, 16, 1, true, 0, .8), toon('#cfd8e6'), [0, .0013, 0]));
  // cuộn cảm
  const ind = createInductor(); ind.group.position.set(w * .10, t, -d * .04); ind.group.scale.setScalar(.85); g.add(ind.group);
  // cổng USB-C ở mép trái
  const port = createUSBCPort(); port.group.position.set(-w / 2 + .0022, t + .0018, 0); port.group.rotation.y = Math.PI / 2; g.add(port.group);
  // đầu nối túi pin ở mép phải
  g.add(mesh(rbox(.0035, .0022, .0068, .0004), toon('#1f6b3e'), [w / 2 - .0018, t + .0011, 0]));
  for (const s of [-1, 1]) g.add(mesh(rbox(.0012, .0005, .0016, .0002), M.metal, [w / 2 - .0032, t + .0022, s * .0016]));

  // mực silk: '20 V' cạnh cổng, '4 V' cạnh túi pin
  const sk1 = label(256, 128), sk2 = label(256, 128);
  const p1 = plane(.0115, .0058, sk1.t, -w * .34, t + .0006, d * .30);
  const p2 = plane(.0088, .0044, sk2.t, w * .30, t + .0006, d * .30);
  p1.name = 'silk-cong'; p2.name = 'silk-pin';
  g.add(p1, p2);

  function draw(lb, txt) {
    const x = lb.x, c = lb.c;
    x.clearRect(0, 0, c.width, c.height);
    x.fillStyle = '#eef2ff'; x.font = 'bold 86px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(txt || '', c.width / 2, c.height / 2);
    lb.t.needsUpdate = true;
  }
  draw(sk1, ''); draw(sk2, '');

  const api = {
    group: g,
    setSilk({ port: pTxt, cell: cTxt } = {}) { draw(sk1, pTxt || ''); draw(sk2, cTxt || ''); },
    update(t) { ind.update(t); },
  };
  g.update = api.update;
  return api;
}

// ── túi pin bị cưa ──────────────────────────────────────────────────────────
// Túi pin bạc bị cưa mở một góc, lộ các lớp: nhôm, lớp cách điện, graphite, đồng.
export function createBatteryCut({ w = .062, d = .090, t = .0045 } = {}) {
  const g = new THREE.Group(); g.name = 'tui-pin';
  const foil = toon('#bfc6d0');   // bạc xám: tách được với nền sáng của propcheck
  // vỏ bạc lạnh → ấm: cả cục túi đổi màu đều khi túi nóng lên
  const FOIL_COLD = new THREE.Color('#c9ced6');
  const FOIL_WARM = new THREE.Color('#f0a878');

  // hình túi: chữ nhật, góc trên bên phải bị cắt chéo
  const shapeOf = (sw, sd, cut) => {
    const s = new THREE.Shape();
    const x = sw / 2, z = sd / 2;
    s.moveTo(-x, -z);
    s.lineTo(x - cut, -z);
    s.lineTo(x, -z + cut);
    s.lineTo(x, z);
    s.lineTo(-x, z);
    s.closePath();
    return s;
  };
  const sheet = (mat, sw, sd, cut, st, y, ox, oz) => {
    const geo = new THREE.ExtrudeGeometry(shapeOf(sw, sd, cut), { depth: st, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, st, 0);
    const m = mesh(geo, mat, [ox, y, oz]);
    g.add(m);
    return m;
  };

  // VỎ BẠC Ở NGOÀI CÙNG (nó là cái túi), bên trong từ đáy lên: đồng, graphite,
  // lớp cách điện. Các lớp ép sát (không kẽ hở), nhìn ở góc cưa thấy bậc
  // thang bốn màu; mặt người xem thấy là vỏ bạc, không phải miếng đồng.
  // Bốn lớp, mỗi lớp dày 1,1 mm, bậc thang ở góc cưa rõ hơn: xem một giây
  // phải thấy đây là một cục pin bị cưa mở, không phải một phong bì bạc.
  const layers = [
    // Mỗi tấm đặt ở `y` và dày `st`, nhưng ExtrudeGeometry đẩy tấm lên thêm
    // một `st` — nên tầng kế tiếp phải đặt ngay bằng `y + st` của tầng trước,
    // và tầng đáy đặt ở `-st` để đáy túi nằm trên mặt bàn.
    { mat: toon('#c9743a'), sw: w * .78, sd: d * .80, cut: .006, st: .0011, y: -.0011, ox: .0055, oz: .0065 },
    { mat: toon('#34383f'), sw: w * .85, sd: d * .87, cut: .012, st: .0011, y: 0, ox: .0038, oz: .0045 },
    { mat: toon('#efe7d2'), sw: w * .92, sd: d * .94, cut: .018, st: .0011, y: .0011, ox: .0020, oz: .0024 },
    { mat: foil, sw: w, sd: d, cut: .024, st: .0011, y: .0022, ox: 0, oz: 0 },
  ];
  const sheets = layers.map(L => sheet(L.mat, L.sw, L.sd, L.cut, L.st, L.y, L.ox, L.oz));
  const top = sheets[3];

  // nhãn trên vỏ bạc: chữ "Li-ion" — không con số nào trên túi
  const lb = label(512, 256);
  lb.x.fillStyle = '#c9ced6'; lb.x.fillRect(0, 0, 512, 256);
  lb.x.fillStyle = '#22242c'; lb.x.font = 'bold 96px "Be Vietnam Pro", sans-serif';
  lb.x.textAlign = 'center'; lb.x.textBaseline = 'middle';
  lb.x.fillText('Li-ion', 256, 132);
  lb.t.needsUpdate = true;
  // nhãn nằm TRÊN vỏ bạc: đỉnh vỏ ở y = .0044, nhãn phải trên .0044 thì mới
  // không bị vỏ che mất
  g.add(plane(.032, .016, lb.t, -w * .10, .0047, d * .06));

  // tab đồng và bảng bảo vệ ở mép sau, nằm trên vỏ bạc (đỉnh vỏ ở y = .0044)
  g.add(mesh(rbox(.010, .0008, .009, .0002), M.copper, [-w * .22, .0048, -d / 2 - .002]));
  g.add(mesh(rbox(.014, .0009, .008, .0002), toon('#1f6b3e'), [w * .16, .0049, -d / 2 - .0016]));
  // hai lớp trong, lộ ra ở góc cưa: nhìn thấy túi là túi pin bị cưa

  const api = {
    group: g,
    // vỏ bạc ấm dần (c48 rồi c49): cả cục túi đổi màu ấm đều
    setWarm(k) {
      const v = clamp(k);
      foil.color.copy(FOIL_COLD).lerp(FOIL_WARM, v);
      foil.emissive.setRGB(.22 * v, .07 * v, .01 * v);
    },
    update(t) {
      // lớp trên cùng hé ra thêm một chút, như đang bị gỡ (chỉ nâng, không lún
      // xuống lớp dưới)
      // Mép vỏ bạc ở góc cưa hé ra thêm một chút, như đang bị gỡ: 1,2 mm là
      // đủ để thấy góc cưa đang mở ra (0,2 mm thì không đổi được pixel nào).
      top.position.y = layers[3].y + (Math.sin(t * .8) + 1) * .0007;
      top.position.z = layers[3].oz + Math.sin(t * .5) * .0013;
    },
  };
  g.update = api.update;
  return api;
}

// ── bàn tay ─────────────────────────────────────────────────────────────────
export function createHand({ skin = '#e3a883', sleeve = '#56688f', size = 1 } = {}) {
  const h = buildHand({ skin, sleeve, size });
  const g = new THREE.Group(); g.name = 'tay';
  g.add(h);
  const api = {
    group: g,
    pose(curl, spread = 0) { h.pose(clamp(curl), clamp(spread)); },
  };
  return api;
}

// ── danh mục vật cho propcheck ──────────────────────────────────────────────
// Mỗi vật một mình, trên sàn, nhìn từ ba phía: có nhận ra ngay là vật gì không?
export const PROPS = {
  'điện thoại nằm sấp, màn hình sáng đồng hồ sạc': () => createPhone({ charging: true }).group,
  'điện thoại màn hình ngửa lên, ốp camera ở mặt lưng': () => createPhone({ charging: false }).group,
  // tên vật trong danh mục phải nói đúng cái người xem thấy: màn hình này
  // KHÔNG có chữ, chỉ có ba hàng thông báo mỗi hàng một ô vuông + hai vạch
  'điện thoại màn hình sáng: ba hàng thông báo': () => {
    const p = createPhone({ charging: false });
    p.setMode('busy');
    return p.group;
  },
  'điện thoại màn hình sáng: đang chơi game': () => {
    const p = createPhone({ charging: false });
    p.setMode('game');
    return p.group;
  },
  'củ sạc trắng, nhãn in sáu mươi oát, có chân cắm': () => createCharger().group,
  'củ sạc nhanh to hơn, có mỏ tản nhiệt gân': () => createCharger({ big: true }).group,
  'củ sạc có dây, không chân cắm, cổng USB-C ở mặt trước': () => createCharger({ plug: false }).group,
  'dây sạc một đầu USB-C một đầu cắm tường': () => createCable().group,
  'dây sạc hai đầu USB-C': () => createCable({ far: 'usb' }).group,
  'ổ cắm trên tường: hai ổ tròn, một phích cắm': () => createWallSocket().group,
  'ốp case silicone trong suốt, mép dày, khoét camera vuông': () => createCase().group,
  'nhiệt kế thủy tinh, cột chất lỏng dâng lên': () => createThermometer().group,
  'cuộn biến áp: lõi sắt và dây đồng quấn': () => createTransformer().group,
  'mỏ tản nhiệt nhôm có gân': () => createHeatSink().group,
  'cuộn cảm dây đồng trên bo mạch': () => createInductor().group,
  'cảm biến nhiệt nhỏ, hai chân, có thang vạch': () => createThermalSensor().group,
  'cổng USB-C rỗng, lưỡi cắm và chân vàng': () => createUSBCPort().group,
  'bo mạch xanh, chip sạc, tụ, cuộn cảm, cổng USB-C': () => createBoard().group,
  'túi pin bạc bị cưa mở, lộ bốn lớp xếp chồng': () => createBatteryCut().group,
  'bàn tay người, ngón ba đốt': () => createHand().group,
  'dòng điện: hạt cyan chạy trên một đường cong': () => createCurrentStream([
    new THREE.Vector3(-.08, 0, 0), new THREE.Vector3(-.03, .008, .012),
    new THREE.Vector3(.03, .012, -.008), new THREE.Vector3(.08, 0, 0),
  ], { n: 60 }).group,
  'nhiệt: hạt cam mọc lên từ một điểm': () => createHeatPlume(new THREE.Vector3(0, 0, 0)).group,
  'gợn nhiệt bay lên từ mặt đồ vật': () => createHeatSquiggle([new THREE.Vector3(0, 0, 0)]).group,
};


