// Nhiệt kế thủy ngữ: ống thủy tinh rỗng, bên trong là cột thủy ngân đỏ và bầu
// thủy ngân ở đáy; ống đứng bên trái một tấm thang chia có vạch và số độ.
// setTemp(độ) đưa ĐỈNH cột lên đúng vạch của độ đó.
import * as THREE from 'three';
import { toon, canvasTex, rbox, mesh, fxLayer, glowMat, mulberry } from '../../../../../rig/kit.js';
import { squiggle } from '../../../../../rig/fx.js';
import { fitEffect } from './_flowbox.js';

const TUBE_X = -.034;                 // trục ống kính nằm bên trái tấm thang chia
const TUBE_Z = .012;                  // trục ống đứng trước mặt tấm thang
// Ống nâng lên để đáy bầu trùng với đáy khung tấm thang (-.037): trước đây
// bầu đỏ thấp hơn khung 6,5 mm, nên khi đặt vật xuống sàn thì bầu đỏ là
// chỗ chạm sàn còn tấm bảng thì bay lơ lửng — ở góc nhìn từ trên xuống
// người xem thấy cả vật lơ lửng, không có bóng chạm chân (lỗi CHẶN ở vòng 9).
const TUBE_LIFT = .0065;

const V = (r, y) => new THREE.Vector2(r, y);

// Đĩa sáng mềm: một vệt tròn toả dần từ tâm, dùng cho quầng nóng quanh
// đỉnh cột thủy ngân. Vân của nó phải mềm ở rìa, nếu mép cứng thì nó đọc ra
// là một miếng dán, không phải một vệt sáng.
let _glow = null;
function glowTex() {
  if (_glow) return _glow;
  _glow = canvasTex(128, 128, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(.22, 'rgba(255,255,255,.82)');
    g.addColorStop(.45, 'rgba(255,255,255,.46)');
    g.addColorStop(.72, 'rgba(255,255,255,.15)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  });
  return _glow;
}

// Vệt bóng tiếp xúc: một vệt mềm trải ra trên mặt sàn, dính sát chân vật.
// Vẽ ở lớp fx (sau bước viền mực) nên nó không có viền mực — bóng không
// được có viền, viền làm nó thành một mảnh giấy dán rời.
// Tờ vân nền TRẮNG và vật liệu dùng phép NHÂN (multiply): một tờ có alpha
// trên lớp fx không hiện ra, còn nhân thì làm tối đúng chỗ bóng đậm và
// không đổi gì ở rìa.
let _contact = null;
function contactTex() {
  if (_contact) return _contact;
  _contact = canvasTex(128, 128, (c, w, h) => {
    c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h);        // nền trắng: nhân không đổi
    const grd = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grd.addColorStop(0, 'rgba(52,40,28,.60)');
    grd.addColorStop(.45, 'rgba(52,40,28,.36)');
    grd.addColorStop(.78, 'rgba(52,40,28,.11)');
    grd.addColorStop(1, 'rgba(52,40,28,0)');
    c.fillStyle = grd; c.fillRect(0, 0, w, h);
  });
  return _contact;
}

// Vỏ thủy tinh: MỘT khối liền gồm ống trụ và bầu tròn khum ở đáy. Đường viền
// đi từ đáy bầu lên vỏ ngoài, vòng miệng ống, rồi quay ngược xuống vỏ trong,
// đáy đóng lại. Vì chỉ có một đường viền nên KHÔNG có mặt cắt nào cắt qua
// nhau: bầu đỏ và chân đế xám cũ từng đè lên nhau, thành vết seam sáng chạy
// ngang và một mảnh vỡ lơ lửng bên cạnh ống.
const GLASS = [
  // vỏ ngoài, từ đáy bầu đi lên
  V(0.0000, -.0435), V(0.0055, -.0428), V(0.0098, -.0400), V(0.0125, -.0358),
  V(0.0135, -.0310), V(0.0132, -.0262), V(0.0118, -.0215), V(0.0100, -.0172),
  V(0.0094, -.0128), V(0.0093, -.0085), V(0.0092, -.0030), V(0.0092, .0600),
  V(0.0092, .1400), V(0.0092, .1800), V(0.0091, .1860), V(0.0083, .1920),
  V(0.0067, .1968), V(0.0040, .1998), V(0.0014, .2010), V(0.0000, .2013),
  // vỏ trong (khoang ống), quay ngược từ miệng ống xuống đáy
  V(0.0000, .1985), V(0.0030, .1975), V(0.0052, .1945), V(0.0064, .1900),
  V(0.0071, .1840), V(0.0077, .1780), V(0.0078, .1400), V(0.0078, .0600),
  V(0.0078, -.0030), V(0.0080, -.0080), V(0.0086, -.0120), V(0.0094, -.0160),
  V(0.0103, -.0205), V(0.0108, -.0250), V(0.0109, -.0295), V(0.0103, -.0338),
  V(0.0084, -.0375), V(0.0055, -.0405), V(0.0000, -.0412),
];

// Cột thủy ngân: bầu ở đáy và cột dọc ống là CÙNG một khối dạng xoay, nên
// không có chỗ nào cột cắt qua bầu (chỗ cắt đó đọc ra như vết seam).
// Bán kính cột nhỏ hơn khoang ống, nên thủy tinh vẫn thấy hai bên cột.
function mercuryGeo(top) {
  const p = [
    V(0.0000, -.0402), V(0.0050, -.0388), V(0.0080, -.0358), V(0.0096, -.0318),
    V(0.0098, -.0282), V(0.0089, -.0242), V(0.0076, -.0206), V(0.0064, -.0172),
    V(0.0061, -.0140), V(0.0060, -.0108), V(0.0060, -.0075), V(0.0060, -.0020),
    V(0.0060, top - .0060),
  ];
  // Đỉnh cột là một nắp tròn (meniscus): MẶT TRÊN của nắp mới chạm vạch, tâm
  // nắp thấp hơn nửa bán kính. Đặt tâm nắp đúng vạch thì cột lọt lên trên,
  // người xem đọc cột cao hơn thật vài độ.
  for (let i = 1; i <= 6; i++) {
    const a = i / 6 * Math.PI / 2;
    p.push(V(.0060 * Math.cos(a), top - .0060 + .0060 * Math.sin(a)));
  }
  return new THREE.LatheGeometry(p, 20);
}

export function nhietKe(opts = {}) {
  const g = new THREE.Group();
  const L = (opts.length || .230);       // chiều dài thang chia
  const sc = opts.scale || 1;
  const T0 = -10, T1 = 130;             // hai đầu vạch
  const W = .115;                       // bề rộng tấm thang chia

  // tấm thang chia: vạch và số in lên bằng canvas
  const tex = canvasTex(512, 1024, (c, w, h) => {
    // Tấm thang là một tấm tối có chữ sáng. Một tấm giấy trắng dưới đèn nồi thì
    // thành vùng sáng nhất của khung, mắt người xem đi vào chỗ trống chứ không
    // vào đỉnh cột thủy ngữ; tấm tối để cột đỏ đứng ra, đúng như LOOK c31.
    const grd0 = c.createLinearGradient(0, 0, w, 0);
    grd0.addColorStop(0, '#161c33'); grd0.addColorStop(.36, '#1b2240'); grd0.addColorStop(1, '#2b3455');
    c.fillStyle = grd0; c.fillRect(0, 0, w, h);
    // Dải tối hơn dưới ống kính: cột thủy ngữ phải đọc ra trên nền tối. Nền sáng
    // phía sau nó làm cả khung siêu cận đỉnh cột thủy ngữ cháy trắng, mất nét
    // mực và mất chiều sâu của kênh; người xem không thấy đâu là đỉnh cột.
    const bw = w * .31;
    const grd = c.createLinearGradient(0, 0, bw, 0);
    grd.addColorStop(0, '#0a0d1a'); grd.addColorStop(.78, '#101528'); grd.addColorStop(1, '#1b2240');
    c.fillStyle = grd; c.fillRect(0, 0, bw, h);
    // số độ nằm bên phải, vạch kẻ ra từ số: chữ sáng trên nền tối.
    // Số phải TO: ở khung cận cảnh con số "100" chỉ cao mười mấy pixel thì
    // người xem điện thoại không đọc được nhiệt độ nào đang ghim nồi.
    c.strokeStyle = '#efe4c8'; c.fillStyle = '#efe4c8';
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let d = T0; d <= T1; d += 10) {
      const y = h - (d - T0) / (T1 - T0) * h;
      const big = d % 20 === 0;
      c.lineWidth = big ? 12 : 6;
      // Vạch đậm kết thúc ở w*.44 (trước đây w*.50): khe giữa mép vạch và
      // mép số "100" rộng thêm 30 px, đủ cho một thẻ "SÔI" đọc được.
      c.beginPath(); c.moveTo(w * .30, y); c.lineTo(w * (big ? .44 : .40), y); c.stroke();
      if (big) { c.font = 'bold 96px sans-serif'; c.fillText(String(d), w * .96, y); }
    }
    // "SÔI" đúng quy ước nhãn của kênh: một THẺ KEM bo tròn có viền mực,
    // chữ đỏ đậm. Chữ đỏ trần trên nền tối đọc ra như chữ vẽ thêm lên thang,
    // không phải nhãn của vật.
    //
    // Thẻ đặt DỌC: khe giữa mép vạch và mép số "100" chỉ rộng ~70 px, nên một
    // thẻ nằm ngang ở đó buộc chữ phải nhỏ đến mức cả thẻ đọc ra là một cục
    // đỏ vỡ nát, không đọc ra chữ (vòng 9). Thẻ đứng dọc dùng được cả chiều
    // cao trống của tấm thang: mỗi chữ ~70 px, đủ đọc; thẻ nằm bên phải mép
    // vạch nên không đè lên vạch nào, cũng không đè lên số.
    const y100 = h - (100 - T0) / (T1 - T0) * h;
    c.font = 'bold 96px sans-serif';
    const numL = w * .96 - c.measureText('100').width;   // mép trái của số "100"
    const tickR = w * .44;                              // mép phải của vạch
    const gapL = tickR + 3, gapR = numL - 6;            // khe trống giữa vạch và số
    const cw = Math.max(40, Math.min(96, gapR - gapL)); // bề rộng thẻ
    const fs = Math.round(cw * .72);                   // cỡ chữ trong thẻ
    const ch = Math.round(fs * 3.5);                   // chiều cao thẻ: 3 chữ
    const cx = gapL + cw / 2, cy = y100;
    // thẻ kem: viền mực, chữ đỏ đậm. Viền phải DÀY: kênh có bloom trên
    // nền kem, viền mảnh bị bloom ăn mòn thành một quầng xám, thẻ đọc ra như
    // một cục sáng chứ không phải một thẻ có viền mực.
    c.fillStyle = '#171a2b';
    c.beginPath(); c.roundRect(cx - cw / 2 - 7, cy - ch / 2 - 7, cw + 14, ch + 14, 14); c.fill();
    c.fillStyle = '#fff0d8';
    c.beginPath(); c.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, 10); c.fill();
    c.strokeStyle = '#171a2b'; c.lineWidth = 8; c.stroke();
    // chữ đỏ đậm xếp dọc: vẽ thêm một nét đỏ sẫm rồi đổ màu, để chữ không bị
    // bloom trên nền kem làm nhạt thành hồng. Chữ nằm TRỌN trong thẻ.
    c.font = `900 ${fs}px "Be Vietnam Pro", sans-serif`;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineJoin = 'round'; c.strokeStyle = '#a8203c'; c.lineWidth = 3;
    'SÔI'.split('').forEach((ch2, i) => {
      const y = cy + (i - 1) * (fs * 1.15);
      c.strokeText(ch2, cx, y);
      c.fillStyle = '#f04462';
      c.fillText(ch2, cx, y);
    });
  });
  // Tấm thang: CHỈ mặt trước mang texture (số độ, vạch kẻ), các mặt bên và
  // mặt sau là màu trơn. Một hộp có texture sẽ kéo texture đó ra cả mặt bên, và
  // ở góc nhìn xiên (cận cảnh cột thủy ngữ ở c31) mặt bên biến thành một sọc
  // số bị nén dọc — nhìn như mảnh vụn trôi ở mép khung.
  const side = toon('#171d33');
  // KHÔNG đổ bóng đổ: một tấm bảng đứng thẳng đổ ra một mảng xám viền cứng
  // nằm lệch hẳn ra sau vật, không có viền mực, trông như một mảnh giấy dán
  // rời chứ không phải bóng (lỗi CHẶN `nguyen-ven` ở vòng 9 và 10). Bóng của
  // vật trong phim là bóng mềm dưới chân, không phải mảng xám phẳng.
  const plate = mesh(new THREE.BoxGeometry(W, L, .010),
    [side, side, side, side, toon('#ffffff', { map: tex }), side],
    [0, L / 2 - .03, 0], { cast: false });
  g.add(plate);
  // khung của tấm thang: một tấm nền lớn hơn một chút, màu xám xanh. Không có
  // khung thì tấm thang trắng trên nền sáng thành một mảnh trắng không mép, số
  // độ trên đó như đang lơ lửng, không phải một vật để cầm.
  // Khung có vân xước nhẹ: một mảng màu phẳng không chất liệu đọc ra như
  // miếng bìa dán, không phải một vật thật.
  const frameTex = canvasTex(256, 256, (c, w, h) => {
    const r = mulberry(7);
    c.fillStyle = '#3c4457'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {                 // vết xước dọc, rất nhạt
      c.strokeStyle = r() > .5 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.07)';
      c.lineWidth = 1 + r() * 2;
      const x = r() * w;
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x + (r() - .5) * 8, h); c.stroke();
    }
  });
  g.add(mesh(rbox(W + .014, L + .014, .008, .006), toon('#ffffff', { map: frameTex }),
    [0, L / 2 - .03, -.006], { cast: false }));

  // Bóng tiếp xúc dưới chân vật: một vệt mềm trải ra trên mặt sàn, dính sát
  // đáy khung. Bóng đổ cứng của một tấm bảng đứng thẳng là một mảng xám viền
  // cứng lệch ra sau vật, trông như một mảnh giấy dán rời (lỗi CHẶN ở vòng
  // 9 và 10) — nên tấm thang và khung không đổ bóng đổ nữa, chỉ còn vệt mềm
  // này nối vật với mặt sàn: ở mọi góc máy vật đọc là đang đứng chạm bàn.
  // Vệt phải RỘNG HƠN tấm thang thì mới thấy được ở góc nhìn từ trên xuống.
  // Vệt nằm SÁT sàn: đáy vật ở cao độ -.037, đặt vệt cao hơn thì nó bay
  // lơ lửng và thành một mảng phẳng trôi lơ lửng (đúng lỗi của vòng 9).
  // KHÔNG được đặt depthWrite:false: ở lớp fx của rig, vật liệu không ghi
  // độ sâu thì không hề được vẽ ra (đã thử: vệt bóng biến mất sạch).
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 1.20, .062),
    new THREE.MeshBasicMaterial({ map: contactTex(), blending: THREE.MultiplyBlending }));
  shadow.rotation.set(-Math.PI / 2, 0, 0);
  shadow.position.set(.004, -.0368, .004);
  fxLayer(shadow); g.add(shadow);

  // ── chân đế ───────────────────────────────────────────────────────────
  // Một tấm thang đo đứng một mình trên bàn, không có gì đỡ, thì ở góc nhìn
  // từ trên xuống nó đọc là một tấm bảng bay lơ lửng, và bóng đổ của nó
  // nằm thành một mảng xám viền cứng lơ lửng phía sau như một mảnh giấy
  // dán rời (lỗi CHẶN `nguyen-ven` ở vòng 9). Chân đế là thanh kim loại
  // nằm ngang dưới đáy khung: nó ấn xuống sàn, nối vật với mặt bàn, nối bóng
  // của vật với bóng của chân, và có chất liệu riêng nên không đọc ra là
  // một mảng phẳng dán thêm vào.
  //
  // Chân đế nằm SAU ống kính (z âm) và không sang tới bầu thủy ngân, nên
  // bầu đỏ vẫn là chỗ chạm sàn thấp nhất và vẫn nhìn thấy trọn.
  const footTex = canvasTex(256, 256, (c, w, h) => {
    const r = mulberry(13);
    c.fillStyle = '#2f3648'; c.fillRect(0, 0, w, h);        // thép xám xanh
    for (let i = 0; i < 40; i++) {                            // vệt chải ngang
      c.strokeStyle = `rgba(${r() > .5 ? '255,255,255' : '0,0,0'},${.03 + r() * .05})`;
      c.lineWidth = 1 + r() * 3;
      const y = r() * h;
      c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + (r() - .5) * 6); c.stroke();
    }
    for (let i = 0; i < 60; i++) {                            // lấm tấm gỉ
      c.fillStyle = `rgba(${90 + r() * 40 | 0},${70 + r() * 30 | 0},${50 + r() * 20 | 0},${.06 + r() * .14})`;
      c.beginPath(); c.ellipse(r() * w, r() * h, 1 + r() * 5, 1 + r() * 3, 0, 0, 7); c.fill();
    }
  });
  g.add(mesh(rbox(W * .46, .006, .026, .002),
    toon('#ffffff', { map: footTex }), [0, -.034, -.014]));

  // Ống thủy tinh: một vỏ rỗng, hai nửa tách theo phương ngang.
  // Nửa sau (nửa lưng) đứng ở lớp vật thể: trong hình màu nó trong suốt nên
  // dải tối của tấm thang hắt qua, và người xem thấy cột thủy ngân nằm BÊN
  // TRONG ống chứ không phải sơn dán lên mặt trước. Nửa trước (nửa mặt) đứng
  // ở lớp fx, vẽ sau bước viền mực, nên nó chỉ phủ lên cột một lớp kính mỏng.
  // Bước viền mực vẽ lớp vật thể bằng vật liệu đục, nên trong bước đó nửa sau
  // vẫn là một mặt đứng: đó là chỗ sinh ra đường viền mực quanh cột.
  const glassPts = GLASS.map(p => p.clone());
  const back = new THREE.Mesh(new THREE.LatheGeometry(glassPts, 30, Math.PI / 2, Math.PI),
    toon('#cfe9f4', { transparent: true, opacity: .24, depthWrite: false, side: THREE.DoubleSide }));
  back.position.set(TUBE_X, TUBE_LIFT, TUBE_Z);
  g.add(back);
  const front = new THREE.Mesh(new THREE.LatheGeometry(glassPts, 30, -Math.PI / 2, Math.PI),
    toon('#dcecf7', { transparent: true, opacity: .06, depthWrite: false }));
  front.position.set(TUBE_X, TUBE_LIFT, TUBE_Z);
  fxLayer(front); g.add(front);
  // Vệt sáng trên mặt kính: dấu hiệu cho người xem biết đó là thủy tinh chứ
  // không phải ống nhựa. Vệt phải nằm SÁT mép kính, không đè lên cột: một vệt
  // sáng trắng đè lên cột làm cột nhạt màu đi, đọc như cột sơn hồng.
  for (const [a0, ln, op] of [[.95, .17, .70], [-1.06, .09, .45]]) {
    const sh = new THREE.Mesh(new THREE.LatheGeometry([V(.00935, -.010), V(.00935, .184)], 5, a0, ln),
      glowMat('#ffffff', 1.2, { transparent: true, opacity: op, depthWrite: false }));
    sh.position.set(TUBE_X, TUBE_LIFT, TUBE_Z);
    fxLayer(sh); g.add(sh);
  }

  // Cột thủy ngân: một khối liền gồm bầu ở đáy và cột trong khoang ống. Đúng
  // đỏ của kênh, không phải một sắc hồng nào đó; cột và bầu cùng một màu để
  // người xem đọc đây là MỘT thứ chứ không phải hai mảnh dán lên ống.
  const merc = mesh(mercuryGeo(.02), toon('#f04462', { emissive: new THREE.Color('#3d0b14') }),
    [TUBE_X, TUBE_LIFT, TUBE_Z]);
  g.add(merc);

  // Trạng thái cột: đích do setTemp đặt, cột thật do lò xo dẫn tới.
  // Lò xo phải ĐỦ NHANH và đủ giảm chấn: cột phải tới đích trong nửa giây,
  // vì câu kể đang đợi ở đích đó — ở c35 cột phải kịp tụt về bảy mươi độ
  // (nhãn "BẢY MƯỜI ĐỘ" chỉ vào vạch bảy mươi, cột đứng cao hơn vạch sôi thì
  // câu kể và hình cãi nhau), và ở c30 nó phải BẬT lên qua vạch một trăm như
  // một cái nhảy. Lò xo nhẹ quá (tần số thấp, giảm chấn nhỏ) thì cột bay
  // mãi không đứng yên: nó vọt quá đáy thang rồi lên tới đỉnh thang, đọc ra
  // như cái cột điên chứ không phải nhiệt kế.
  const SPR_W = 13, SPR_Z = .55;          // tần số lò xo và tỉ lệ giảm chấn
  let tgtDeg = 100, curDeg = 100, vel = 0, lastT = 0, hasT = false;
  // vạch của độ d nằm ở cao độ (-0.03 + k·L) tính từ đáy tấm thang; đỉnh cột
  // chạm đúng vạch của độ d. Khối cột được nâng lên TUBE_LIFT, nên hình
  // dựng phải nhấn xuống đúng bằng lượng nâng ấy, đỉnh cột vẫn nằm trên vạch.
  const topOf = deg => {
    const k = Math.max(0, Math.min(1, (deg - T0) / (T1 - T0)));
    return Math.max(.004, -.030 + k * L) - TUBE_LIFT;
  };
  const setTop = deg => {
    const top = topOf(deg);
    if (merc.userData.top === top) return;
    merc.userData.top = top;
    merc.geometry.dispose();
    merc.geometry = mercuryGeo(top);
  };

  g.setTemp = deg => {
    // Chỉ nhớ ĐÍCH. Cột không nhảy tức thì: nó chạy tới chỗ mới bằng một
    // lò xo có vọt quá (xem updateProp), để câu "nhiệt độ nhảy vọt lên" (c30)
    // và "cột tụt xuống" (c35) đều thấy được bằng mắt chứ không phải một
    // cú nhảy giữa hai hình.
    tgtDeg = deg;
  };
  g.setTemp(100);                       // mặc định: cột đứng ở vạch sôi
  g.scale.setScalar(sc);

  // ── quầng nóng và gợn nhiệt quanh đỉnh cột ────────────────────────────
  // Cột vượt vạch sôi là cột đang nóng hơn nước sôi: nhiệt phải bốc lên từ
  // đỉnh cột. Quầng này là vùng sáng nhất của siêu cận c31 (LOOK c31) và là
  // thứ chuyển động rõ nhất của cả ba câu c30–c31: cột thủy ngân mỏng lắm,
  // cột nó chạy lên có mảnh mà không ai thấy nổi.
  const hot = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex(), color: new THREE.Color('#ff8a3c'), blending: THREE.AdditiveBlending,
    transparent: true, opacity: 0, depthWrite: false, depthTest: false, toneMapped: false,
  }));
  hot.scale.set(.026, .026, 1);
  fxLayer(hot); g.add(hot);

  // Gợn nhiệt bốc lên từ đỉnh cột: thứ vô hình thành vật thấy được, đúng
  // ngôn ngữ của kênh (nhiệt thì thành làn, gợn, bọt).
  const heat = squiggle('#ffb060', '#f04462');
  heat.U.uLen.value = .055; heat.U.uWidth.value = .011;
  heat.U.uAmp.value = .0035; heat.U.uFreq.value = 58;
  fitEffect(heat);
  g.add(heat);

  // ── cột thủy ngân chuyển động ─────────────────────────────────────────
  // Lò xo: cột chạy tới đích rồi vọt quá rồi đứng lại. Ở vạch sôi nó rung
  // nhẹ (nước sôi làm nhiệt kế rung); lúc nồi giữ ấm, dây điện trở bật tắt
  // nên nhiệt độ cũng run quanh vạch — cột bật tắt theo nhịp bật tắt đó.
  g.updateProp = t => {
    if (!g.visible) return;
    const dt = hasT ? Math.min(.05, Math.max(1 / 240, t - lastT)) : 1 / 24;
    hasT = true; lastT = t;
    // bước lò xo
    vel += (SPR_W * SPR_W * (tgtDeg - curDeg) - 2 * SPR_Z * SPR_W * vel) * dt;
    curDeg += vel * dt;
    // rung: ở vạch sôi nước sôi làm nhiệt kế rung (biên độ nhỏ, chỉ là một
    // sự lấp lánh ở đỉnh cột); lúc nồi giữ ấm, dây điện trở bật tắt nên
    // nhiệt độ chạy quanh vạch — cột run theo nhịp bật tắt đó.
    let deg = curDeg;
    if (deg > 95) deg += .45 * Math.sin(t * 17.3);
    else if (deg > 58) deg += .90 * Math.sin(t * 4.4);
    setTop(deg);

    const top = topOf(deg);
    // nóng: cột trên vạch sôi. ấm: nồi đang giữ ấm (dây điện trở bật tắt).
    const boil = Math.max(0, Math.min(1, (deg - 96) / 16));
    const warm = Math.max(0, Math.min(1, (deg - 60) / 30));
    // quầng nóng thở: lúc sôi thì phồng-xẹp nhẹ; lúc giữ ấm thì nhấp nháy
    // theo nhịp bật tắt của dây điện trở (sóng vuông mềm).
    const cyc = .5 + .5 * Math.tanh(2.4 * Math.sin(t * 2.9));
    const beat = boil > .05 ? (.62 + .38 * Math.sin(t * 4.1)) : cyc;
    const amt = (boil * .85 + warm * .85) * beat;
    hot.material.opacity = amt * .62;
    // quầng lúc giữ ấm rộng hơn lúc sôi: hơi ấm toả ra chậm và rộng, còn lúc
    // sôi thì nóng gắn quanh đỉnh cột.
    const hs = (.026 + .012 * warm * (1 - boil)) * (1 + .16 * (beat - .5) * 2);
    hot.scale.set(hs, hs, 1);
    hot.position.set(TUBE_X, TUBE_LIFT + top, TUBE_Z + .004);
    hot.visible = amt > .012;

    // gợn nhiệt: chỉ khi cột nóng hơn nước sôi
    heat.visible = boil > .06;
    if (heat.visible) {
      const age = (t * .62) % 1;
      heat.position.set(TUBE_X, TUBE_LIFT + top, TUBE_Z + .002);
      if (typeof window !== 'undefined' && window.__cam) heat.quaternion.copy(window.__cam.quaternion);
      heat.U.uHead.value = .055 * (.12 + .88 * age);
      heat.U.uAlpha.value = boil * Math.sin(age * Math.PI) * .95;
      heat.U.uPhase.value = t * 3.6;
    }
  };
  return g;
}

export const PROP = { name: 'nhiệt kế thủy ngữ', view: () => nhietKe() };
