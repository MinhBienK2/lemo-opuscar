// props.js — đồ vật dùng chung của kênh: vẽ kỹ một lần, cùng nét với người, có trạng thái và điểm neo.
// Danh mục có ảnh: rig/catalog/ (CATALOG.md + props-*.jpg). Xem ảnh trước khi chọn; thiếu vật thì thêm vào đây,
// không vẽ lại trong src/sets.js của tập.
//
//   import { prop, cable, PROPS, M } from '../../../../rig/props.js';
//   const T0 = prop(g, 'table', { x: 960, y: 900 });                       // chân bàn chạm sàn ở (960, 900)
//   const P  = prop(g, 'phone', { x: T0.top[0], y: T0.top[1], s: 1, state: 'hot', from: 'on', k: BD.p('b_nong', T), t: T });
//   cable(g, P.plug, S.port, { sag: 40 });                                 // dây sạc giữa hai điểm neo
//
// Thang đo: s = 1 là cỡ thật cạnh người của extras.js (1 m = M = 306 px; người cao ~520 px). Cận cảnh thì tăng s,
//   nét vẫn giữ độ dày trên màn hình.
// Gốc toạ độ của mọi vật: chính giữa cạnh đáy, chỗ nó chạm sàn hoặc mặt bàn.
// o: x, y · s · rot · flip · t (thời gian, cho vật sống) · state, from, k (đi từ trạng thái `from` sang `state`, k 0→1)
//    · mọi tham số số của vật (ghi đè trạng thái) · heat 0→1 (quầng nóng + hơi bốc, vật nào cũng có).
// Trả về các điểm neo trên màn hình ({ top: [x, y], … }) và box [x0, y0, x1, y1].
import { cel, path, poly, rect, rrect, ellP, mix, rgba, W, H, TAU } from './cel.js';

export const M = 306;                    // px mỗi mét, ở s = 1
export const INK = '#1D202A';
let LW = 3.4;                            // độ dày nét, theo đơn vị của vật (đặt lại mỗi lần vẽ)
const lerp = (a, b, k) => a + (b - a) * k;
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// —— nét cel: mảng màu phẳng + một dải bóng cứng (ánh sáng từ trên-trái) + viền mực ——
function C(g, p, f, o = {}) {
  const sd = o.sd ?? LW * 2.4;
  return cel(g, p, { f, s: o.s || mix(f, '#1b1430', .26), so: o.flat ? null : [-sd, -sd * .8], h: o.h, ho: o.ho, l: INK, lw: o.lw ?? LW });
}
function L(g, pts, lw = LW, col = INK, closed = false) {
  g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
  const p = new Path2D(); p.moveTo(...pts[0]); for (const q of pts.slice(1)) p.lineTo(...q); if (closed) p.closePath(); g.stroke(p);
}
function dot(g, x, y, r, f) { cel(g, ellP(x, y, r, r), { f, l: INK, lw: LW * .7 }); }
function glow(g, x, y, r, col, a) {
  if (a <= 0) return;
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(col, a)); gr.addColorStop(1, rgba(col, 0));
  g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
}
function steam(g, x, y, h, k, t, col = '#FFFFFF') {   // ba sợi hơi bốc lên, cao h
  if (k <= 0) return;
  for (let i = 0; i < 3; i++) {
    const ph = (t * .6 + i / 3) % 1, a = Math.sin(ph * Math.PI) * k * .7, x0 = x + (i - 1) * h * .18;
    g.strokeStyle = rgba(col, a); g.lineWidth = Math.max(1.5, h * .05); g.lineCap = 'round';
    g.beginPath();
    for (let j = 0; j <= 10; j++) { const u = j / 10, yy = y - ph * h * .4 - u * h * .6, xx = x0 + Math.sin(u * 5 + t * 3 + i) * h * .08; j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
    g.stroke();
  }
}

// —— danh mục ——
// size: [rộng, cao] ở s = 1 · look: mô tả để board chép vào props.<id>.look · states: bộ tham số (số được nội suy)
export const PROPS = {

  phone: {
    name: 'điện thoại', size: [23, 47],
    look: 'điện thoại thông minh dáng dọc, thân đen bo góc, viền mỏng, màn hình gần kín mặt trước, cổng sạc ở cạnh đáy; mặt lưng có cụm camera vuông ở góc trên',
    states: { off: { screen: 0, heat: 0 }, on: { screen: 1, heat: 0 }, charging: { screen: .5, bolt: 1, heat: 0 }, hot: { screen: .7, bolt: 1, heat: 1 } },
    params: { face: 'front | back | flat (nằm ngang, nhìn từ bên)', level: 'mức pin 0–1, hiện ở đầu màn hình', screen: 'độ sáng 0–1', bolt: 'biểu tượng đang sạc 0–1' },
    anchors: 'plug (cổng sạc), screen, top',
    draw(g, o) {
      if (o.face === 'flat') {          // nằm ngang trên mặt phẳng, nhìn ngang: một tấm mỏng
        C(g, rrect(-24, -7, 48, 7, 3), '#23262F', { sd: 1.5 });
        if (o.screen > 0) { g.fillStyle = rgba('#8FE3F7', .9 * o.screen); g.fillRect(-21, -8.5, 42, 2.5); glow(g, 0, -10, 40, '#8FE3F7', .25 * o.screen); }
        return { plug: [24, -3.5], top: [0, -7], screen: [0, -8] };
      }
      C(g, rrect(-11.5, -47, 23, 47, 4.5), '#23262F', { sd: 1.6 });
      if (o.face === 'back') {
        C(g, rrect(-9, -44, 9, 9, 2.5), '#363A46', { sd: 1 }); dot(g, -6.5, -41.5, 1.8, '#11131A'); dot(g, -2.5, -37.5, 1.8, '#11131A');
        return { plug: [0, 0], top: [0, -47], screen: [0, -24] };
      }
      const sc = mix('#141821', '#7FD6F0', o.screen * .55);
      cel(g, rrect(-9.5, -44, 19, 40, 2.5), { f: sc, l: INK, lw: LW * .5 });
      glow(g, 0, -24, 34, '#8FE3F7', .22 * o.screen);
      if (o.screen > .15) {
        g.globalAlpha = o.screen;
        g.fillStyle = '#EAF9FF'; g.fillRect(-7, -40, 9, 1.6);                                   // giờ
        const lv = o.level ?? .6; g.strokeStyle = '#EAF9FF'; g.lineWidth = .8; g.strokeRect(3, -40.6, 5, 2.4);
        g.fillStyle = lv < .2 ? '#F04462' : '#7CF29A'; g.fillRect(3.4, -40.2, 4.2 * lv, 1.6);
        for (let i = 0; i < 3; i++) { g.fillStyle = rgba('#EAF9FF', .55); g.fillRect(-7, -33 + i * 6, 14 - i * 3, 3); }
        g.globalAlpha = 1;
      }
      if (o.bolt > 0) {
        g.globalAlpha = o.bolt; g.fillStyle = '#FFD84D';
        g.fill(poly([[1, -22], [-4, -14], [-.5, -14], [-2, -7], [4, -16], [.5, -16], [2.5, -22]])); g.globalAlpha = 1;
      }
      g.fillStyle = '#0D0F15'; g.fillRect(-2.5, -1.6, 5, 1.2);
      return { plug: [0, 0], screen: [0, -24], top: [0, -47] };
    },
  },

  charger: {
    name: 'củ sạc', size: [16, 20],
    look: 'củ sạc trắng hình khối vuông nhỏ, góc bo tròn, mặt trước có một cổng USB-C đen nằm ngang và một đèn tín hiệu nhỏ',
    states: { cool: { led: 0, heat: 0 }, on: { led: 1, heat: 0 }, hot: { led: 1, heat: 1 } },
    params: { led: 'đèn 0–1' }, anchors: 'port (cổng cắm dây), top',
    draw(g, o) {
      C(g, rrect(-8, -20, 16, 20, 3.5), '#ECE8E0', { sd: 1.4 });
      g.fillStyle = '#1B1E27'; g.fillRect(-3.5, -6, 7, 2.2);
      dot(g, 0, -14, 1.5, o.led > .5 ? '#67E8F9' : '#B8B4AC'); glow(g, 0, -14, 6, '#67E8F9', .6 * o.led);
      return { port: [0, -5], top: [0, -20] };
    },
  },

  socket: {
    name: 'ổ cắm điện trên tường', size: [30, 46],
    look: 'mặt ổ cắm điện trên tường, tấm nhựa trắng ngà chữ nhật đứng, hai lỗ cắm tròn kiểu Việt Nam xếp ngang; khi có củ sạc thì củ sạc trắng cắm đè lên nửa dưới',
    states: { empty: { plugged: 0 }, plugged: { plugged: 1 } },
    params: { plugged: 'có củ sạc cắm vào 0/1' }, anchors: 'port (cổng của củ sạc), holes',
    draw(g, o) {
      C(g, rrect(-15, -46, 30, 46, 4), '#EDE9DF', { sd: 1.6 });
      cel(g, rrect(-11, -42, 22, 22, 3), { f: '#E2DDD1', l: INK, lw: LW * .6 });
      dot(g, -5, -31, 2.4, '#2A2D36'); dot(g, 5, -31, 2.4, '#2A2D36');
      if (o.plugged > .5) {
        C(g, rrect(-9, -27, 18, 24, 3.5), '#F6F3EC', { sd: 1.4 });
        g.fillStyle = '#1B1E27'; g.fillRect(-3.5, -8, 7, 2.2);
        return { port: [0, -7], holes: [0, -31] };
      }
      return { port: [0, -31], holes: [0, -31] };
    },
  },

  pillow: {
    name: 'gối', size: [184, 52],
    look: 'gối ngủ trắng ngà, dài gấp ba lần cao, hai đầu phồng tròn, giữa hơi lõm, có đường may viền quanh mép và vài nếp nhăn ở hai đầu',
    states: { flat: { press: 0, bump: 0 }, pressed: { press: 1, bump: 0 }, hiding: { press: .4, bump: 1 } },
    params: { press: 'lõm giữa 0–1 (đầu người đè)', bump: 'vật gồ lên dưới mép phải 0–1', col: 'màu vỏ gối' }, anchors: 'top, under (chỗ giấu vật ở mép phải)',
    draw(g, o) {
      const p = o.press, b = o.bump, f = o.col || '#EFE7D6';
      const pts = [[-92, -6], [-96, -26], [-84, -48], [-50, -52 + p * 4], [0, -46 + p * 14], [40, -50 + p * 6 - b * 8], [64, -54 - b * 10], [88, -48], [96, -26], [92, -6], [60, 0], [0, 2], [-60, 0]];
      C(g, path(pts), f, { sd: 4 });
      g.setLineDash([4, 5]); L(g, [[-84, -10], [-88, -26], [-78, -42]], LW * .5, mix(f, INK, .45)); L(g, [[84, -10], [88, -26], [78, -42]], LW * .5, mix(f, INK, .45)); g.setLineDash([]);
      for (const k of [-1, 1]) { L(g, [[k * 70, -40], [k * 60, -34]], LW * .6, mix(f, INK, .4)); L(g, [[k * 72, -14], [k * 62, -18]], LW * .6, mix(f, INK, .4)); }
      return { top: [0, -46 + p * 14], under: [56, -6] };
    },
  },

  bed: {
    name: 'giường', size: [620, 280],
    look: 'giường đôi gỗ nâu nhìn ngang, đầu giường cao bên trái, nệm trắng dày, chăn xanh lam phủ hai phần ba bên phải có nếp gấp, chân giường ngắn',
    states: { made: { blanket: 1 }, open: { blanket: .45 } },
    params: { blanket: 'chăn phủ bao nhiêu chiều dài 0–1', wood: 'màu gỗ', sheet: 'màu chăn' }, anchors: 'mattress (mặt nệm), head (chỗ đặt gối), foot',
    draw(g, o) {
      const wd = o.wood || '#9C6A44', sh = o.sheet || '#5D7BB0';
      C(g, rrect(-310, -280, 34, 280, 8), wd, { sd: 6 });                 // đầu giường
      C(g, rect(-300, -40, 300, -100), wd, { sd: 5 });                    // khung
      for (const x of [-290, 280]) C(g, rect(x, 0, x + 12, -42), mix(wd, INK, .2), { sd: 2 });
      C(g, rrect(-280, -160, 572, 64, 14), '#F2EFE8', { sd: 5 });          // nệm
      const bw = 572 * o.blanket, bx = 292 - bw;
      if (bw > 10) {
        C(g, path([[bx, -168], [bx + 30, -172], [292, -168, 1], [300, -96, 1], [bx + 10, -92], [bx - 6, -130]]), sh, { sd: 6 });
        for (let i = 1; i < 4; i++) L(g, [[bx + bw * i / 4, -164], [bx + bw * i / 4 - 14, -120]], LW * .6, mix(sh, INK, .4));
      }
      return { mattress: [0, -160], head: [-170, -160], foot: [230, -160] };
    },
  },

  nightstand: {
    name: 'tủ đầu giường', size: [140, 170],
    look: 'tủ đầu giường gỗ nâu sáng thấp, mặt trên phẳng có cạnh dày, một ngăn kéo có núm tròn, khoang để đồ hở bên dưới, bốn chân ngắn',
    states: { closed: { open: 0 }, open: { open: 1 } },
    params: { open: 'ngăn kéo kéo ra 0–1', wood: 'màu gỗ' }, anchors: 'top (mặt tủ), drawer',
    draw(g, o) {
      const wd = o.wood || '#B98457';
      for (const x of [-62, 52]) C(g, rect(x, 0, x + 10, -14), mix(wd, INK, .25), { sd: 2 });
      C(g, rect(-66, -14, 66, -158), wd, { sd: 6 });
      C(g, rect(-56, -24, 56, -84), mix(wd, INK, .45), { flat: true });   // khoang hở
      const dy = o.open * 16;
      C(g, rect(-56 - dy * .3, -96 + dy * .2, 56 + dy * .3, -146 + dy * .2), mix(wd, '#FFFFFF', .08), { sd: 4 });
      dot(g, 0, -121 + dy * .2, 5, '#E8D3A8');
      C(g, rect(-72, -158, 72, -170), mix(wd, '#FFFFFF', .12), { sd: 2 });
      return { top: [0, -170], drawer: [0, -121] };
    },
  },

  table: {
    name: 'bàn', size: [370, 232],
    look: 'bàn gỗ chữ nhật nhìn chính diện, mặt bàn dày có cạnh sáng hơn, gầm có thanh ngang, hai chân thẳng vuông ở hai đầu',
    states: { normal: {} }, params: { wood: 'màu gỗ', w: 'bề rộng (mặc định 370)' }, anchors: 'top (giữa mặt bàn), left, right',
    draw(g, o) {
      const wd = o.wood || '#A97448', w = (o.w || 370) / 2;
      for (const k of [-1, 1]) C(g, rect(k * (w - 22) - 8, 0, k * (w - 22) + 8, -218), mix(wd, INK, .18), { sd: 3 });
      C(g, rect(-w + 24, -170, w - 24, -186), mix(wd, INK, .25), { sd: 2 });
      C(g, rrect(-w, -232, 2 * w, 16, 4), wd, { sd: 3, h: mix(wd, '#FFFFFF', .25), ho: [0, 5] });
      return { top: [0, -232], left: [-w + 50, -232], right: [w - 50, -232] };
    },
  },

  schooldesk: {
    name: 'bàn học sinh', size: [370, 220],
    look: 'bàn học sinh hai chỗ kiểu trường Việt Nam, mặt gỗ vàng nâu, khung chân sắt sơn xanh, tấm chắn gỗ phía trước gầm, ngăn để cặp dưới mặt bàn; có thể kèm ghế băng dài phía trước',
    states: { normal: { bench: 0 }, bench: { bench: 1 } },
    params: { bench: 'có ghế băng phía trước 0/1' }, anchors: 'top, seat (mặt ghế băng)',
    draw(g, o) {
      const wd = '#C99A5B', fr = '#3F6E73';
      for (const k of [-1, 1]) { C(g, rect(k * 160 - 6, 0, k * 160 + 6, -206), fr, { sd: 2 }); C(g, rect(k * 160 - 22, 0, k * 160 + 22, -8), fr, { sd: 1.5 }); }
      C(g, rect(-150, -120, 150, -196), mix(wd, INK, .3), { sd: 3 });                    // ngăn cặp + tấm chắn
      C(g, rrect(-185, -220, 370, 18, 4), wd, { sd: 3, h: mix(wd, '#FFFFFF', .25), ho: [0, 5] });
      if (o.bench > .5) {
        for (const k of [-1, 1]) C(g, rect(k * 150 - 6, 0, k * 150 + 6, -84), fr, { sd: 2 });
        C(g, rrect(-175, -98, 350, 16, 4), wd, { sd: 3 });
        return { top: [0, -220], seat: [0, -98] };
      }
      return { top: [0, -220], seat: [0, -130] };
    },
  },

  chair: {
    name: 'ghế', size: [140, 280],
    look: 'ghế tựa gỗ nhìn chính diện, lưng tựa cao có hai thanh ngang, mặt ngồi vuông, bốn chân thẳng',
    states: { normal: {} }, params: { wood: 'màu gỗ' }, anchors: 'seat, back',
    draw(g, o) {
      const wd = o.wood || '#8E5E3B';
      for (const k of [-1, 1]) { C(g, rect(k * 58 - 6, 0, k * 58 + 6, -280), wd, { sd: 2.5 }); C(g, rect(k * 46 - 5, 0, k * 46 + 5, -130), mix(wd, INK, .3), { sd: 2 }); }
      for (const y of [-250, -205]) C(g, rect(-58, y, 58, y + 14), wd, { sd: 2 });
      C(g, rrect(-70, -142, 140, 16, 4), mix(wd, '#FFFFFF', .1), { sd: 3 });
      return { seat: [0, -142], back: [0, -230] };
    },
  },

  wardrobe: {
    name: 'tủ quần áo', size: [310, 590],
    look: 'tủ quần áo gỗ hai cánh cao gần trần, đỉnh có gờ, hai tay nắm dọc ở giữa, chân đế thấp; mở cánh trái thấy bên trong tối với thanh treo và vài chiếc áo màu',
    states: { closed: { open: 0 }, open: { open: 1 } },
    params: { open: 'cánh trái mở 0–1', wood: 'màu gỗ' }, anchors: 'top, inside (giữa khoang)',
    draw(g, o) {
      const wd = o.wood || '#8C5C3A';
      C(g, rect(-150, -10, 150, -570), wd, { sd: 8 });
      C(g, rect(-160, -570, 160, -590), mix(wd, '#FFFFFF', .12), { sd: 3 });
      C(g, rect(-140, 0, 140, -14), mix(wd, INK, .3), { sd: 2 });
      const op = cl(o.open);
      if (op > 0) {
        C(g, rect(-140, -20, 0, -560), '#2A2230', { flat: true });
        L(g, [[-134, -520], [-6, -520]], LW * 1.2, '#9AA3B5');
        ['#D8574A', '#4F86C6', '#F2A541'].forEach((c, i) => {
          const x = -116 + i * 40;
          C(g, path([[x, -520], [x - 18, -500], [x - 16, -360, 1], [x + 16, -360, 1], [x + 18, -500]]), c, { sd: 3 });
        });
      }
      const dw = 140 * Math.cos(op * Math.PI * .46);                       // cánh trái thu hẹp khi mở ra phía trước
      C(g, rect(-140, -20, -140 + dw, -560), mix(wd, '#FFFFFF', .06), { sd: 4 });
      C(g, rect(0, -20, 140, -560), mix(wd, '#FFFFFF', .06), { sd: 4 });
      if (op < .9) C(g, rrect(-140 + dw - 16, -330, 6, 70, 3), '#E8D3A8', { sd: 1 });
      C(g, rrect(10, -330, 6, 70, 3), '#E8D3A8', { sd: 1 });
      return { top: [0, -590], inside: [-70, -300] };
    },
  },

  fridge: {
    name: 'tủ lạnh', size: [190, 500],
    look: 'tủ lạnh hai ngăn màu trắng kem, ngăn đá nhỏ ở trên, ngăn mát lớn ở dưới, tay nắm dọc màu bạc bên phải; mở cửa thấy đèn vàng bên trong và ba tầng kệ có hộp và chai',
    states: { closed: { open: 0 }, open: { open: 1 } },
    params: { open: 'cửa ngăn mát mở 0–1' }, anchors: 'top, inside',
    draw(g, o) {
      const f = '#EAE6DD', op = cl(o.open);
      C(g, rrect(-92, -500, 184, 492, 14), f, { sd: 7 });
      for (const k of [-1, 1]) C(g, rect(k * 70 - 8, 0, k * 70 + 8, -10), '#6B7180', { sd: 1 });
      L(g, [[-92, -360], [92, -360]], LW, INK);
      C(g, rrect(64, -470, 8, 70, 4), '#B8BFCC', { sd: 1 });
      if (op > 0) {
        C(g, rrect(-84, -352, 168, 336, 8), '#FFF4D6', { flat: true });
        glow(g, 0, -260, 160, '#FFE7A3', .55 * op);
        for (const y of [-260, -170, -90]) L(g, [[-80, y], [80, y]], LW * .8, '#C9C2B0');
        C(g, rrect(-70, -300, 40, 40, 5), '#7CC4A4'); C(g, rrect(-20, -310, 22, 50, 6), '#D8574A'); C(g, rrect(20, -210, 50, 40, 6), '#F2A541');
        C(g, rrect(-60, -140, 26, 50, 8), '#67B7E8'); C(g, rrect(-20, -130, 60, 40, 6), '#E9C46A');
      }
      const dw = 184 * Math.cos(op * Math.PI * .47);
      C(g, rrect(-92, -356, Math.max(6, dw), 346, 10), f, { sd: 5 });
      if (op < .8) C(g, rrect(-92 + dw - 28, -330, 8, 120, 4), '#B8BFCC', { sd: 1 });
      return { top: [0, -500], inside: [0, -200] };
    },
  },

  stove: {
    name: 'bếp ga', size: [220, 60],
    look: 'bếp ga đôi đặt trên bàn, thân kim loại đen viền bạc, hai kiềng đen ở trên, hai núm vặn tròn ở mặt trước; khi bật có vòng lửa xanh dưới kiềng',
    states: { off: { flame: 0 }, on: { flame: 1 }, low: { flame: .4 } },
    params: { flame: 'cỡ lửa 0–1' }, anchors: 'left, right (đỉnh kiềng để đặt nồi)',
    draw(g, o) {
      C(g, rrect(-110, -38, 220, 38, 6), '#2B2E37', { sd: 3 });
      L(g, [[-108, -38], [108, -38]], LW * 1.4, '#9AA3B5');
      for (const k of [-1, 1]) {
        dot(g, k * 50, -18, 9, '#9AA3B5'); L(g, [[k * 50, -18], [k * 50, -26]], LW, INK);
        if (o.flame > 0) {
          const t = o.t || 0;
          for (let i = 0; i < 7; i++) {
            const x = k * 50 + (i - 3) * 9, h = (8 + 6 * Math.sin(t * 17 + i * 2.1 + k)) * o.flame;
            g.fillStyle = rgba('#5AA9FF', .9); g.beginPath(); g.moveTo(x - 4, -44); g.quadraticCurveTo(x, -44 - h * 2, x + 4, -44); g.fill();
          }
          glow(g, k * 50, -48, 40, '#5AA9FF', .35 * o.flame);
        }
        L(g, [[k * 50 - 34, -46], [k * 50 + 34, -46]], LW * 1.6, '#15171D');
        L(g, [[k * 50 - 30, -40], [k * 50 - 30, -52]], LW * 1.4, '#15171D'); L(g, [[k * 50 + 30, -40], [k * 50 + 30, -52]], LW * 1.4, '#15171D');
      }
      return { left: [-50, -52], right: [50, -52] };
    },
  },

  kettle: {
    name: 'ấm đun nước', size: [80, 74],
    look: 'ấm đun nước inox tròn bầu, vòi cong ngắn bên phải, quai cầm đen trên đỉnh, nắp tròn có núm; khi sôi hơi nước bốc từ vòi',
    states: { cold: { steam: 0 }, boiling: { steam: 1 } },
    params: { steam: 'hơi bốc 0–1' }, anchors: 'spout (đầu vòi), top',
    draw(g, o) {
      C(g, path([[40, -44], [62, -66], [66, -62], [46, -30]]), '#B8BFCC', { sd: 2 });
      C(g, path([[-36, -4], [-40, -34], [-24, -56], [24, -56], [40, -34], [36, -4], [0, 0]]), '#C9CFDA', { sd: 4, h: '#EEF1F6', ho: [5, 4] });
      C(g, rrect(-18, -62, 36, 8, 3), '#9AA3B5', { sd: 1 }); dot(g, 0, -64, 4, '#2B2E37');
      g.strokeStyle = INK; g.lineWidth = LW * 3; g.beginPath(); g.arc(0, -60, 26, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
      g.strokeStyle = '#2B2E37'; g.lineWidth = LW * 1.8; g.stroke();
      steam(g, 64, -66, 80, o.steam, o.t || 0);
      return { spout: [64, -66], top: [0, -74] };
    },
  },

  cup: {
    name: 'ly / cốc', size: [28, 34],
    look: 'cốc thủy tinh trong suốt hình trụ hơi loe miệng, thấy mực nước bên trong; khi nóng có hơi bốc lên',
    states: { empty: { fill: 0, steam: 0 }, full: { fill: .85, steam: 0 }, hot: { fill: .85, steam: 1 } },
    params: { fill: 'mực nước 0–1', liquid: 'màu nước (mặc định nước lọc)', steam: 'hơi 0–1' }, anchors: 'top, rim',
    draw(g, o) {
      const liq = o.liquid || '#9FD8F0', f = cl(o.fill);
      if (f > 0) cel(g, poly([[-12 - f, -2], [-12 - f * 2, -2 - f * 28], [12 + f * 2, -2 - f * 28], [12 + f, -2]]), { f: rgba(liq, .85) });
      cel(g, poly([[-12, 0], [-15, -34], [15, -34], [12, 0]]), { f: rgba('#E8F6FF', .25), l: INK, lw: LW * .8 });
      L(g, [[-10, -28], [-9, -8]], LW * .6, rgba('#FFFFFF', .8));
      steam(g, 0, -36, 40, o.steam, o.t || 0);
      return { top: [0, -34], rim: [0, -34] };
    },
  },

  laptop: {
    name: 'máy tính xách tay', size: [110, 74],
    look: 'máy tính xách tay xám bạc nhìn chính diện, màn hình đứng thẳng viền đen có camera nhỏ, đế bàn phím mỏng phía dưới; màn hình bật thì sáng xanh có vài dòng chữ',
    states: { closed: { open: 0, screen: 0 }, off: { open: 1, screen: 0 }, on: { open: 1, screen: 1 } },
    params: { open: 'mở nắp 0–1', screen: 'màn sáng 0–1' }, anchors: 'screen, top',
    draw(g, o) {
      const op = cl(o.open), hh = 66 * op;
      C(g, rrect(-55, -8, 110, 8, 3), '#B8BFCC', { sd: 1.5 });
      if (hh > 2) {
        C(g, rrect(-50, -8 - hh, 100, hh, 4), '#2B2E37', { sd: 2 });
        const sc = mix('#141821', '#6FB7FF', o.screen * .6);
        if (hh > 10) {
          cel(g, rrect(-45, -4 - hh, 90, hh - 10, 2), { f: sc });
          for (let i = 0; i < 4 && o.screen > .2; i++) { g.fillStyle = rgba('#EAF4FF', .6 * o.screen); g.fillRect(-38, -hh + 6 + i * 11 * op, 60 - i * 10, 4 * op); }
          glow(g, 0, -8 - hh / 2, 90, '#6FB7FF', .18 * o.screen);
        }
      }
      return { screen: [0, -8 - hh / 2], top: [0, -8 - hh] };
    },
  },

  lamp: {
    name: 'đèn bàn', size: [90, 150],
    look: 'đèn bàn kim loại, đế tròn dẹt, cần gập hai khúc, chao đèn hình nón hướng xuống phía trước; khi bật có quầng sáng vàng hình nón dưới chao',
    states: { off: { on: 0 }, on: { on: 1 } },
    params: { on: 'đèn bật 0–1', col: 'màu chao' }, anchors: 'bulb, pool (chỗ ánh sáng rơi xuống)',
    draw(g, o) {
      const c = o.col || '#E0A93B';
      if (o.on > 0) {
        g.fillStyle = rgba('#FFE7A3', .22 * o.on); g.beginPath(); g.moveTo(40, -110); g.lineTo(120, 0); g.lineTo(-20, 0); g.closePath(); g.fill();
        glow(g, 46, -104, 60, '#FFE7A3', .6 * o.on);
      }
      C(g, ellP(-20, -4, 34, 7), mix(c, INK, .25), { sd: 2 });
      L(g, [[-20, -8], [-30, -86], [26, -128]], LW * 2.4, INK); L(g, [[-20, -8], [-30, -86], [26, -128]], LW * 1.2, '#9AA3B5');
      dot(g, -30, -86, 5, '#9AA3B5');
      C(g, poly([[16, -140], [54, -118], [44, -92], [10, -108]]), c, { sd: 3 });
      return { bulb: [44, -104], pool: [50, 0] };
    },
  },

  clock: {
    name: 'đồng hồ treo tường', size: [92, 92],
    look: 'đồng hồ treo tường tròn, viền đen dày, mặt trắng có mười hai vạch giờ, kim giờ ngắn kim phút dài màu đen và kim giây đỏ mảnh',
    states: { normal: {} },
    params: { time: 'giờ dạng số, 23.5 = 23:30', run: 'tốc độ quay theo t (giờ mỗi giây phim; 0 = đứng)' }, anchors: 'center',
    draw(g, o) {
      const cy = -46, hr = (o.time ?? 10.15) + (o.run || 0) * (o.t || 0);
      C(g, ellP(0, cy, 46, 46), '#2B2E37', { sd: 3 }); cel(g, ellP(0, cy, 38, 38), { f: '#FAF8F5', l: INK, lw: LW * .6 });
      for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; L(g, [[Math.sin(a) * 31, cy - Math.cos(a) * 31], [Math.sin(a) * 35, cy - Math.cos(a) * 35]], LW * (i % 3 ? .6 : 1.1)); }
      const ah = (hr % 12) / 12 * TAU, am = (hr % 1) * TAU, as = ((o.t || 0) % 60) / 60 * TAU;
      L(g, [[0, cy], [Math.sin(ah) * 19, cy - Math.cos(ah) * 19]], LW * 1.5);
      L(g, [[0, cy], [Math.sin(am) * 29, cy - Math.cos(am) * 29]], LW);
      L(g, [[0, cy], [Math.sin(as) * 31, cy - Math.cos(as) * 31]], LW * .5, '#F04462');
      dot(g, 0, cy, 3, INK);
      return { center: [0, cy] };
    },
  },

  books: {
    name: 'sách', size: [80, 70],
    look: 'chồng sách bìa cứng nằm ngang nhiều màu, gáy có một dải màu sáng, các cuốn lệch nhau một chút',
    states: { normal: {} }, params: { n: 'số cuốn (mặc định 3)' }, anchors: 'top',
    draw(g, o) {
      const n = o.n || 3, cols = ['#4F86C6', '#D8574A', '#6BAA75', '#F2A541', '#8B5CF6'];
      let y = 0;
      for (let i = 0; i < n; i++) {
        const h = 16 + (i % 2) * 4, w = 76 - (i % 3) * 8, dx = ((i * 37) % 11) - 5;
        C(g, rrect(-w / 2 + dx, y - h, w, h, 3), cols[i % cols.length], { sd: 2 });
        L(g, [[-w / 2 + dx + 8, y - h / 2], [-w / 2 + dx + 20, y - h / 2]], LW * 1.2, '#FAF8F5');
        y -= h;
      }
      return { top: [0, y] };
    },
  },

  backpack: {
    name: 'ba lô', size: [100, 140],
    look: 'ba lô học sinh vải dày, thân bo tròn, túi trước có khoá kéo, hai quai đeo vai, quai xách nhỏ trên đỉnh',
    states: { normal: {} }, params: { col: 'màu vải' }, anchors: 'top, strap',
    draw(g, o) {
      const c = o.col || '#4F86C6';
      g.strokeStyle = INK; g.lineWidth = LW * 2.2; g.beginPath(); g.arc(0, -132, 14, Math.PI, 0); g.stroke();
      C(g, rrect(-50, -130, 100, 130, 30), c, { sd: 6 });
      C(g, rrect(-36, -64, 72, 52, 14), mix(c, '#FFFFFF', .12), { sd: 4 });
      L(g, [[-30, -56], [30, -56]], LW * .8, mix(c, INK, .5)); dot(g, 22, -56, 3, '#E8D3A8');
      return { top: [0, -140], strap: [0, -120] };
    },
  },

  window: {
    name: 'cửa sổ', size: [310, 370],
    look: 'cửa sổ khung gỗ hai cánh kính, song ngang ở giữa, bậu cửa nhô ra dưới đáy; bên ngoài là trời theo giờ (ngày xanh, chiều cam, đêm có trăng và sao), có thể có mưa chảy trên kính',
    states: { day: { night: 0, dusk: 0 }, dusk: { night: 0, dusk: 1 }, night: { night: 1, dusk: 0 } },
    params: { night: 'đêm 0–1', dusk: 'chiều 0–1', rain: 'mưa 0–1' }, anchors: 'center, sill',
    draw(g, o) {
      const sky = mix(mix('#9ED3F2', '#F2A06B', cl(o.dusk)), '#1B2340', cl(o.night));
      cel(g, rect(-140, -360, 140, -30), { f: sky });
      if (o.night > .4) {
        g.globalAlpha = o.night; dot(g, 70, -290, 18, '#F6F1DC');
        for (let i = 0; i < 14; i++) { g.fillStyle = '#F6F1DC'; g.fillRect(-130 + (i * 71) % 260, -350 + (i * 53) % 280, 2.5, 2.5); }
        g.globalAlpha = 1;
      } else if (o.dusk < .5) { g.fillStyle = rgba('#FFFFFF', .8); g.beginPath(); g.ellipse(-60, -280, 40, 14, 0, 0, TAU); g.ellipse(-30, -290, 30, 16, 0, 0, TAU); g.fill(); }
      if (o.rain > 0) {
        const t = o.t || 0; g.strokeStyle = rgba('#DDEBFF', .55 * o.rain); g.lineWidth = 2;
        for (let i = 0; i < 26; i++) { const x = -132 + (i * 47) % 264, y = -350 + ((t * 420 + i * 97) % 320); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 4, y + 18); g.stroke(); }
      }
      const fr = '#7A5233';
      g.fillStyle = fr; g.strokeStyle = INK; g.lineWidth = LW;
      for (const r of [[-155, -370, 310, 16], [-155, -40, 310, 16], [-155, -370, 16, 340], [139, -370, 16, 340], [-8, -370, 16, 340], [-155, -205, 310, 12]]) {
        g.beginPath(); g.rect(...r); g.fill(); g.stroke();
      }
      C(g, rect(-170, -24, 170, 0), mix(fr, '#FFFFFF', .12), { sd: 3 });
      L(g, [[-120, -340], [-90, -260]], LW * .7, rgba('#FFFFFF', .35)); L(g, [[30, -340], [60, -260]], LW * .7, rgba('#FFFFFF', .35));
      return { center: [0, -200], sill: [0, -24] };
    },
  },

  door: {
    name: 'cửa ra vào', size: [280, 620],
    look: 'cửa gỗ một cánh có khung, cánh cửa có hai ô chìm, tay nắm tròn bên phải; mở ra thì cánh hẹp lại và lộ khoảng tối hoặc ánh sáng phía sau',
    states: { closed: { open: 0 }, open: { open: 1 } },
    params: { open: 'mở 0–1', beyond: 'màu phía sau cửa (mặc định tối)' }, anchors: 'center, handle',
    draw(g, o) {
      const wd = '#8C5C3A', op = cl(o.open);
      C(g, rect(-140, 0, 140, -620), mix(wd, INK, .2), { sd: 4 });
      cel(g, rect(-124, 0, 124, -604), { f: o.beyond || '#15131C' });
      if (o.beyond) glow(g, 0, -300, 300, o.beyond, .4 * op);
      const dw = 248 * Math.cos(op * Math.PI * .45), x0 = -124;
      C(g, rect(x0, 0, x0 + dw, -604), wd, { sd: 5 });
      if (dw > 60) {
        for (const y of [-560, -270]) cel(g, rect(x0 + dw * .14, y, x0 + dw * .86, y + 220), { f: mix(wd, INK, .12), l: INK, lw: LW * .7 });
        dot(g, x0 + dw - 26, -300, 8, '#E8D3A8');
      }
      return { center: [0, -300], handle: [x0 + dw - 26, -300] };
    },
  },

  fan: {
    name: 'quạt đứng', size: [180, 380],
    look: 'quạt đứng gia đình, đế tròn, thân trụ có nút bấm, lồng quạt tròn bằng nan sắt, ba cánh nhựa xanh nhạt quay bên trong',
    states: { off: { speed: 0 }, on: { speed: 1 } },
    params: { speed: 'tốc độ quay 0–1' }, anchors: 'center',
    draw(g, o) {
      const cy = -290, t = o.t || 0;
      C(g, ellP(0, -8, 70, 12), '#E6E2D8', { sd: 2 });
      C(g, rect(-8, -10, 8, -230), '#D9D5CA', { sd: 2 }); C(g, rrect(-20, -120, 40, 40, 6), '#E6E2D8', { sd: 2 });
      for (let i = 0; i < 3; i++) dot(g, -10 + i * 10, -100, 3, ['#6BAA75', '#F2A541', '#D8574A'][i]);
      cel(g, ellP(0, cy, 86, 86), { f: rgba('#C8D6E5', .25), l: INK, lw: LW });
      const a0 = t * 18 * (o.speed || 0);
      for (let i = 0; i < 3; i++) {
        const a = a0 + i / 3 * TAU; g.save(); g.translate(0, cy); g.rotate(a);
        C(g, path([[0, 0], [20, -30], [12, -72], [-14, -70], [-12, -20]]), '#9ED3E8', { sd: 3 }); g.restore();
      }
      if (o.speed > .5) { g.fillStyle = rgba('#9ED3E8', .25); g.beginPath(); g.arc(0, cy, 74, 0, TAU); g.fill(); }
      dot(g, 0, cy, 12, '#E6E2D8');
      for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; L(g, [[0, cy], [Math.cos(a) * 86, cy + Math.sin(a) * 86]], LW * .35, rgba(INK, .6)); }
      return { center: [0, cy] };
    },
  },

  motorbike: {
    name: 'xe máy', size: [580, 340],
    look: 'xe tay ga nhìn ngang hướng sang phải, thân nhựa màu đỏ đô bo tròn, yên đen dài, sàn để chân phẳng, ghi đông có gương, đèn pha tròn phía trước, hai bánh nhỏ vành bạc',
    states: { parked: { roll: 0, light: 0 }, riding: { light: 1 } },
    params: { roll: 'quãng đường đã chạy (px) — bánh quay theo', light: 'đèn pha 0–1', col: 'màu thân' }, anchors: 'seat, handle, rear (chỗ người thứ hai ngồi)',
    draw(g, o) {
      const c = o.col || '#B23A48', rot = (o.roll || 0) / 62, R = 62;
      const wheel = x => { C(g, ellP(x, -R, R, R), '#1F2128', { sd: 4 }); cel(g, ellP(x, -R, 34, 34), { f: '#C9CFDA', l: INK, lw: LW });
        for (let i = 0; i < 5; i++) { const a = rot + i / 5 * TAU; L(g, [[x, -R], [x + Math.cos(a) * 30, -R + Math.sin(a) * 30]], LW * .8, '#7A8190'); } dot(g, x, -R, 7, '#7A8190'); };
      wheel(-200); wheel(200);
      L(g, [[200, -R], [176, -300]], LW * 2.6, INK); L(g, [[200, -R], [176, -300]], LW * 1.2, '#9AA3B5');       // phuộc trước
      C(g, path([[150, -98], [176, -128], [228, -128], [252, -98], [236, -104], [200, -116], [166, -104]]), c, { sd: 3 });   // chắn bùn trước
      C(g, rect(-70, -114, 120, -92), '#2B2E37', { sd: 2 });                                                        // sàn để chân
      C(g, path([[-306, -150], [-296, -206], [-250, -232], [-40, -228], [-18, -176], [-36, -112], [-140, -104], [-270, -116]]), c, { sd: 8, h: mix(c, '#FFFFFF', .22), ho: [6, 6] });
      C(g, path([[96, -96], [126, -114], [160, -292, 1], [204, -300], [210, -250], [188, -150], [150, -98]]), c, { sd: 6, h: mix(c, '#FFFFFF', .22), ho: [5, 5] });
      C(g, rrect(-276, -262, 236, 34, 16), '#22242B', { sd: 3 });                                                   // yên
      cel(g, ellP(-302, -186, 7, 12), { f: '#F04462', l: INK, lw: LW * .7 });                                          // đèn hậu
      L(g, [[184, -300], [178, -338]], LW * 2.2); L(g, [[146, -338], [214, -344]], LW * 2.6);                          // ghi đông
      L(g, [[160, -340], [146, -378]], LW); C(g, ellP(142, -384, 14, 9), '#9AA3B5', { sd: 1 });                        // gương
      C(g, ellP(206, -272, 11, 16), '#F6F1DC', { sd: 2 }); glow(g, 232, -272, 120, '#FFE7A3', .5 * (o.light || 0));
      return { seat: [-150, -262], handle: [180, -342], rear: [-236, -262], foot: [30, -114] };
    },
  },

  plant: {
    name: 'chậu cây', size: [120, 190],
    look: 'chậu cây xanh trong nhà, chậu đất nung màu cam hình côn, năm sáu chiếc lá to bầu dục mọc toả lên, lá đung đưa nhẹ',
    states: { normal: {} }, params: {}, anchors: 'top',
    draw(g, o) {
      const t = o.t || 0;
      for (let i = 0; i < 6; i++) {
        const a = -1.2 + i * .48 + Math.sin(t * 1.3 + i) * .05, len = 110 + (i % 3) * 18;
        g.save(); g.translate(0, -66); g.rotate(a);
        C(g, path([[0, 0], [-16, -len * .5], [0, -len], [16, -len * .5]]), i % 2 ? '#4E9A62' : '#5FAE6E', { sd: 3 });
        L(g, [[0, -6], [0, -len * .9]], LW * .5, '#2F6B40'); g.restore();
      }
      C(g, poly([[-46, -70], [46, -70], [36, 0], [-36, 0]]), '#C8693F', { sd: 5 });
      C(g, rect(-52, -70, 52, -84), mix('#C8693F', '#FFFFFF', .1), { sd: 2 });
      return { top: [0, -190] };
    },
  },

  bottle: {
    name: 'chai nước', size: [26, 80],
    look: 'chai nước nhựa trong suốt, thân trụ có nhãn xanh quấn quanh giữa, cổ thắt, nắp xanh đậm; thấy mực nước bên trong',
    states: { full: { fill: .9 }, half: { fill: .5 }, empty: { fill: 0 } },
    params: { fill: 'mực nước 0–1' }, anchors: 'top',
    draw(g, o) {
      const f = cl(o.fill);
      if (f > 0) cel(g, rrect(-11, -2 - 58 * f, 22, 58 * f, 4), { f: rgba('#9FD8F0', .8) });
      cel(g, path([[-13, 0, 1], [-13, -56], [-6, -68], [6, -68], [13, -56], [13, 0, 1]]), { f: rgba('#E8F6FF', .25), l: INK, lw: LW * .8 });
      C(g, rect(-13, -24, 13, -42), '#4F86C6', { sd: 1 });
      C(g, rrect(-7, -80, 14, 12, 2), '#2D5C8A', { sd: 1 });
      return { top: [0, -80] };
    },
  },

  tv: {
    name: 'tivi', size: [320, 220],
    look: 'tivi màn hình phẳng viền đen mỏng đặt trên chân đế hình chữ V ngắn; bật thì màn hình sáng màu, có thể hiện hình bất kỳ',
    states: { off: { screen: 0 }, on: { screen: 1 } },
    params: { screen: 'màn sáng 0–1', tint: 'màu chủ đạo của hình' }, anchors: 'screen (giữa màn), box',
    draw(g, o) {
      L(g, [[-60, 0], [0, -30], [60, 0]], LW * 2.4, '#2B2E37');
      C(g, rrect(-160, -220, 320, 190, 8), '#1B1D24', { sd: 3 });
      const sc = mix('#10131A', o.tint || '#6FB7FF', o.screen * .7);
      cel(g, rect(-150, -212, 150, -40), { f: sc });
      glow(g, 0, -126, 240, o.tint || '#6FB7FF', .15 * o.screen);
      return { screen: [0, -126], box: [-150, -212, 150, -40] };
    },
  },

  thermometer: {
    name: 'nhiệt kế', size: [40, 200],
    look: 'nhiệt kế thủy tinh đứng, ống mảnh có vạch chia, bầu tròn đỏ ở đáy, cột đỏ dâng lên theo nhiệt độ',
    states: { cold: { level: .15 }, warm: { level: .5 }, hot: { level: .9 } },
    params: { level: 'cột đỏ 0–1' }, anchors: 'tip (đỉnh cột đỏ), bulb',
    draw(g, o) {
      const lv = cl(o.level), top = -34 - lv * 150;
      cel(g, rrect(-9, -196, 18, 180, 9), { f: '#F4F7FB', l: INK, lw: LW });
      g.fillStyle = '#F04462'; g.fillRect(-4, top, 8, -20 - top);
      for (let i = 0; i < 8; i++) L(g, [[9, -40 - i * 20], [16, -40 - i * 20]], LW * .6);
      C(g, ellP(0, -18, 18, 18), '#F04462', { sd: 2 });
      return { tip: [0, top], bulb: [0, -18] };
    },
  },

  box: {
    name: 'thùng carton', size: [200, 150],
    look: 'thùng carton nâu nhìn chính diện, băng keo dán dọc giữa nắp, nắp gồm hai vạt; mở ra thì hai vạt bật lên hai bên',
    states: { closed: { open: 0 }, open: { open: 1 } },
    params: { open: 'nắp mở 0–1' }, anchors: 'top, inside',
    draw(g, o) {
      const c = '#C89B6A', op = cl(o.open);
      C(g, rect(-100, 0, 100, -140), c, { sd: 6 });
      if (op > .05) {
        for (const k of [-1, 1]) {
          const a = op * 2.3; g.save(); g.translate(k * -100, -140); g.scale(-k, 1); g.rotate(-a);   // vạt bản lề ở mép, lật ra ngoài
          C(g, rect(0, 0, 96, -10), mix(c, '#FFFFFF', .1), { sd: 2 }); g.restore();
        }
        cel(g, rect(-96, -132, 96, -140), { f: '#3A2A1E' });
      } else {
        C(g, rect(-100, -140, 100, -152), mix(c, '#FFFFFF', .12), { sd: 2 });
        C(g, rect(-12, -152, 12, -100), '#D9C29A', { sd: 1 });
      }
      return { top: [0, -150], inside: [0, -120] };
    },
  },

  money: {
    name: 'tiền giấy', size: [150, 70],
    look: 'tờ tiền giấy chung chung màu xanh lá nhạt, viền in đậm hơn, một ô tròn ở giữa và ký hiệu đồng ở hai góc; không giống tờ tiền thật nào',
    states: { normal: {} }, params: { n: 'số tờ chồng lên nhau (mặc định 1)', col: 'màu tờ' }, anchors: 'top',
    draw(g, o) {
      const n = o.n || 1, c = o.col || '#8CC9A0';
      for (let i = 0; i < n; i++) {
        const dy = -i * 6, dx = ((i * 13) % 9) - 4;
        C(g, rect(-75 + dx, dy, 75 + dx, dy - 70), c, { sd: 2 });
        cel(g, rect(-66 + dx, dy - 8, 66 + dx, dy - 62), { l: mix(c, INK, .45), lw: LW * .6 });
        cel(g, ellP(dx, dy - 35, 18, 18), { f: mix(c, '#FFFFFF', .3), l: mix(c, INK, .45), lw: LW * .6 });
        g.fillStyle = mix(c, INK, .55); g.font = '800 14px "Be Vietnam Pro"'; g.textAlign = 'center';
        g.fillText('₫', -54 + dx, dy - 18); g.fillText('₫', 54 + dx, dy - 46);
      }
      return { top: [0, -70 - (n - 1) * 6] };
    },
  },
};

// —— cách dùng chung ——
function screenW(s) { return 3.4 * Math.min(1.8, Math.max(1, Math.pow(s, .35))); }
function paramsOf(D, o) {
  const st = D.states || {}, to = st[o.state] || {}, from = o.from ? st[o.from] || {} : to, k = o.k ?? 1;
  const P = { ...from, ...to };
  for (const key of Object.keys(P)) {
    const a = from[key] ?? to[key], b = to[key] ?? from[key];
    P[key] = typeof a === 'number' && typeof b === 'number' ? lerp(a, b, cl(k)) : (k < .5 ? a : b);
  }
  return { ...P, ...Object.fromEntries(Object.entries(o).filter(([q]) => !['x', 'y', 's', 'rot', 'flip', 'state', 'from', 'k'].includes(q))) };
}
function heatBack(g, w, h, a, t) {
  glow(g, 0, -h / 2, Math.max(w, h) * (.75 + .25 * Math.sin(t * 3)), '#FF6A3D', .5 * a);
}
function heatFront(g, w, h, a, t) {
  g.save(); g.globalCompositeOperation = 'source-atop'; g.restore();
  const n = 3, top = -h - 6;
  for (let i = 0; i < n; i++) {
    const x = (i - 1) * w * .32, ph = (t * .8 + i * .37) % 1;
    g.strokeStyle = rgba('#FF8A4D', Math.sin(ph * Math.PI) * .85 * a); g.lineWidth = Math.max(2, h * .05); g.lineCap = 'round';
    g.beginPath();
    for (let j = 0; j <= 12; j++) { const u = j / 12, yy = top - ph * h * .25 - u * h * .45, xx = x + Math.sin(u * 7 + t * 4 + i) * w * .06; j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
    g.stroke();
  }
}
export function prop(g, id, o = {}) {
  const D = PROPS[id];
  if (!D) throw new Error(`prop "${id}" is not in rig/props.js — see rig/catalog/CATALOG.md, or add it there`);
  const s = o.s ?? 1, [w, h] = D.size, P = paramsOf(D, o);
  g.save(); g.translate(o.x ?? W / 2, o.y ?? H - 200); if (o.rot) g.rotate(o.rot); g.scale(o.flip ? -s : s, s);
  LW = screenW(s) / s;
  const heat = P.heat || 0;
  if (heat > 0) heatBack(g, w, h, heat, o.t || 0);
  const a = D.draw(g, { ...P, t: o.t || 0 }) || {};
  if (heat > 0) heatFront(g, w, h, heat, o.t || 0);
  const m = g.getTransform(), T = ([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f], out = {};
  for (const [k, v] of Object.entries(a)) out[k] = Array.isArray(v) && v.length === 2 ? T(v) : v;
  const p0 = T([-w / 2, -h]), p1 = T([w / 2, 0]);
  out.box = [Math.min(p0[0], p1[0]), Math.min(p0[1], p1[1]), Math.max(p0[0], p1[0]), Math.max(p0[1], p1[1])];
  g.restore();
  return out;
}

// dây (sạc, điện, dây phơi) giữa hai điểm trên màn hình, võng xuống `sag` px; p 0→1 vẽ dần từ A
export function cable(g, A, B, o = {}) {
  const sag = o.sag ?? 40, col = o.col || '#ECE8E0', lw = o.lw || 5, p = o.p ?? 1;
  const mx = (A[0] + B[0]) / 2, my = Math.max(A[1], B[1]) + sag;
  const pts = []; for (let i = 0; i <= 24 * p; i++) { const u = i / 24, a = 1 - u; pts.push([a * a * A[0] + 2 * a * u * mx + u * u * B[0], a * a * A[1] + 2 * a * u * my + u * u * B[1]]); }
  if (pts.length < 2) return;
  const pth = new Path2D(); pth.moveTo(...pts[0]); for (const q of pts.slice(1)) pth.lineTo(...q);
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.strokeStyle = INK; g.lineWidth = lw + 4; g.stroke(pth);
  g.strokeStyle = col; g.lineWidth = lw; g.stroke(pth);
}
