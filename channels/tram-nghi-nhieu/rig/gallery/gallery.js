// gallery.js — the reference page of the channel's rig: every visual the rig can draw, drawn by the rig itself.
// Nothing here is a copy: each tile calls the real function from ../<file>.js with a chosen frame, so the page
// tells the truth about what the rig produces. The tile's caption says what it is and what the call looks like.
//
// Every tile is rendered at the full 1920×1080 the rig works in and then scaled down, so what you see is what the
// film gets (some rig functions reset the canvas transform themselves — a downscaled canvas would lie).
//
// Serve the repository root over http (ES modules do not load from file://), then open
//   /channels/tram-nghi-nhieu/rig/gallery/
// `node serve.mjs` next to this file does that and prints the URL.
import {
  cel, path, poly, rect, rrect, ellP, union, line, taper, outlineUnion,
  resample, ribbon, limb, ik, mix, rgba, tone, LWK, W, H, TAU,
} from '../cel.js';
import { PAL, EXPR, blendE, figure, roi, battery, squircle, animeHead } from '../character.js';
import { hand, GEST, blendGest } from '../hands.js';
import { extra, crowd, LOOKS } from '../extras.js';
import { PROPS, prop } from '../props.js';
import { assetIndex, loadAssets, asset, badge } from '../assets.js';
import * as SETS from '../sets.js';
import * as STYLE from '../styles.js';
import { dynamicBar, gatedReveal, strikeBehind } from '../components.js';
import * as MOTION from '../motion.js';
import {
  ground, text, font, panel, hilite, stamp, pip, bubble, focusLines, subtitle, tag, ring,
  batteryBig, irisWipe, ambientMotes, revealText, wrap,
} from '../broll.js';
import { hostPip, reactClose } from '../host.js';
import { span, keys, poseKeys, faceKeys, count, drawOn, enter, travel, walkTo, landing } from '../keys.js';

const BG = '#12131a';
const INK = '#171a2b';

// ——— helpers ———

const lab = (g, s, x, y, o = {}) => text(g, s, x, y, {
  font: font(o.w ?? 700, o.px ?? 26), fill: o.fill ?? '#9aa0bb', align: o.align ?? 'left',
});

/** a bust of the host: the chest point is (cx, cy) */
function bust(g, cx, cy, s, E, o = {}) {
  g.save(); g.translate(cx, cy);
  figure(g, {
    s, E, t: o.t ?? 0, crop: 'bust', talk: o.talk, blink: o.blink ?? 0,
    battery: o.battery, headRoll: o.headRoll, headPitch: o.headPitch,
  });
  g.restore();
}

/** only the head of the host, clipped out of the rig space.
 *  The rig origin is (390, 204): the head with its hair spans x 296…486, y 14…232 in rig units. */
function head(g, cx, cy, s, E, o = {}) {
  const k = s * 1.35;
  g.save();
  g.beginPath();
  g.rect(cx - 94 * k - 14, cy - 190 * k - 14, (94 + 96) * k + 28, (190 + 28) * k + 28);
  g.clip();
  bust(g, cx, cy, s, E, o);
  g.restore();
}

/** the whole host, feet on the ground line: the chest is 426·s px above the feet */
function full(g, cx, feetY, s, o = {}) {
  g.save(); g.translate(cx, feetY - 426 * s);
  figure(g, {
    s, E: o.E ?? 'neutral', t: o.t ?? 0, legs: o.legs,
    armL: o.armL, armR: o.armR, pose: o.pose, blink: o.blink ?? 0, talk: o.talk, battery: o.battery,
  });
  g.restore();
}

// ——— the tiles: one per asset, grouped by the file that draws it ———

const SECTIONS = [];
const section = (file, path, note, tiles) => SECTIONS.push({ file, path, note, tiles });

// —— cel.js: the shape language the whole channel is drawn with ——
section('cel.js', 'rig/cel.js', 'Mọi hình trong kênh đều đi qua cel(): một mảng phẳng, một bóng cứng, một nét đậm.', [
  {
    name: 'cel()', sig: 'cel(g, pts, { f, s, so, h, ho, rim, l, lw })',
    desc: 'Cách vẽ chuẩn của kênh: mảng phẳng + bóng lệch cứng + điểm sáng + viền đậm. Đây là chữ ký hình ảnh của Trạm Nghĩ Nhiều.',
    draw(g) {
      ground(g);
      cel(g, poly([[420, 300], [900, 200], [1300, 470], [960, 830], [430, 700]]),
        { f: '#f7bd27', s: '#d99516', so: [16, 16], h: '#ffd34f', ho: [-14, -14], rim: { c: '#67e8f9', d: [10, -10] }, l: INK, lw: 4 });
      lab(g, 'một mảng phẳng (f)', 420, 250);
      lab(g, 'một bóng cứng lệch (so)', 420, 890, { fill: '#c9a24a' });
      lab(g, 'một điểm sáng (ho) + một viền (l)', 900, 250, { fill: '#8ad7e6' });
    },
  },
  {
    name: 'path() vs poly()', sig: 'path(pts, closed, tension) · poly(pts)',
    desc: 'path() nội suy Catmull-Rom nên bo mềm; poly() giữ góc sắc. Một điểm [x, y, 1] trong pts làm góc đó sắc lại.',
    draw(g) {
      ground(g);
      const blob = [[380, 560], [520, 320], [760, 300], [900, 460], [860, 700], [620, 780], [420, 700]];
      cel(g, path(blob), { f: '#67e8f9', s: '#22b8d6', so: [10, 10], l: INK, lw: 3.4 });
      const polyPts = [[1080, 560], [1120, 330], [1290, 300], [1440, 430], [1420, 680], [1230, 780], [1060, 690]];
      cel(g, poly(polyPts), { f: '#f7bd27', s: '#d99516', so: [10, 10], l: INK, lw: 3.4 });
      const sharp = [[380, 900], [560, 830], [700, 930], [700, 1000], [380, 1000]];
      cel(g, path(sharp), { f: '#9a5be5', s: '#7d3fc4', so: [8, 8], l: INK, lw: 3.4 });
      lab(g, 'path() — bo mềm', 380, 280);
      lab(g, 'poly() — góc sắc', 1080, 280);
      lab(g, 'path() có điểm [x,y,1] → góc sắc', 380, 810);
    },
  },
  {
    name: 'rect · rrect · ellP', sig: 'rect(x0,y0,x1,y1) · rrect(x,y,w,h,r) · ellP(x,y,rx,ry,rot)',
    desc: 'Ba hình cơ bản. rect lấy TỌA ĐỘ GÓC, rrect lấy rộng×cao — lệch nhau một chữ.',
    draw(g) {
      ground(g);
      cel(g, rect(360, 340, 700, 660), { f: '#67e8f9', s: '#22b8d6', so: [12, 12], l: INK, lw: 3.4 });
      cel(g, rrect(820, 340, 340, 320, 40), { f: '#f7bd27', s: '#d99516', so: [12, 12], l: INK, lw: 3.4 });
      cel(g, ellP(1460, 500, 170, 160), { f: '#9a5be5', s: '#7d3fc4', so: [12, 12], l: INK, lw: 3.4 });
      lab(g, 'rect(x0,y0,x1,y1)', 360, 300);
      lab(g, 'rrect(x,y,w,h,r)', 820, 300);
      lab(g, 'ellP(x,y,rx,ry)', 1290, 300);
      lab(g, 'rect 340→700 là 360px rộng; rrect 340×320 là 340px rộng', 360, 760);
    },
  },
  {
    name: 'line() vs taper()', sig: 'line(g, pts, col, lw) · taper(g, pts, col, lw, ends)',
    desc: 'line() đều bề dày; taper() mảnh ở hai đầu, đậm ở giữa — dùng cho tóc, vải, dây.',
    draw(g) {
      ground(g);
      const pts = [[300, 420], [700, 260], [1100, 560], [1600, 380]];
      g.strokeStyle = '#67e8f9'; g.lineWidth = 10; g.lineJoin = 'round'; g.lineCap = 'round';
      line(g, pts, '#67e8f9', 10);
      taper(g, pts.map(([x, y]) => [x, y + 260]), '#f7bd27', 60);
      lab(g, 'line() — đều', 300, 200);
      lab(g, 'taper() — mảnh ở hai đầu', 300, 700);
    },
  },
  {
    name: 'limb() + ik()', sig: 'limb(a, b, ra, rb) · ik(s, t, a, b, bend)',
    desc: 'limb() là chiều hình thon (tay, chân, cành). ik() trả về điểm khuỷu để hai xương nối nhau — xương của mọi nhân vật.',
    draw(g) {
      ground(g);
      const s = [400, 500], t = [820, 700];
      const e = ik(s, t, 300, 300, 1);
      cel(g, limb(s, e, 42, 34), { f: '#f7bd27', s: '#d99516', so: [8, 8], l: INK, lw: 3 });
      cel(g, limb(e, t, 34, 26), { f: '#f7bd27', s: '#d99516', so: [8, 8], l: INK, lw: 3 });
      g.fillStyle = '#67e8f9'; g.beginPath(); g.arc(e[0], e[1], 14, 0, TAU); g.fill();
      lab(g, 'ik() → điểm khuỷu', e[0] + 24, e[1] - 20, { fill: '#67e8f9' });
      cel(g, limb([1080, 400], [1560, 620], 46, 30), { f: '#67e8f9', s: '#22b8d6', so: [8, 8], l: INK, lw: 3 });
      lab(g, 'limb(a, b, ra, rb)', 1080, 340);
    },
  },
  {
    name: 'union() + outlineUnion()', sig: 'union(...ps) · outlineUnion(g, shapes, col, lw)',
    desc: 'Gộp nhiều hình thành một hình, rồi viền ra ngoài một lần — dùng khi một vật thể nhiều mảnh.',
    draw(g) {
      ground(g);
      const a = ellP(820, 520, 180, 200), b = poly([[700, 620], [900, 560], [980, 800], [720, 830]]);
      cel(g, union(a, b), { f: '#9a5be5', s: '#7d3fc4', so: [12, 12], l: INK, lw: 3.4 });
      outlineUnion(g, [ellP(1300, 520, 150, 170), poly([[1200, 620], [1380, 580], [1440, 790], [1220, 810]])], '#67e8f9', 6);
      lab(g, 'union() — gộp rồi tô', 700, 260);
      lab(g, 'outlineUnion() — viền ngoài một lần', 1200, 260);
    },
  },
  {
    name: 'ribbon() + resample()', sig: 'ribbon(spine, width) · resample(pts, n)',
    desc: 'ribbon() biến một đường sống thành dải kín (rộng là hàm của u); resample() làm mượt một đường hở.',
    draw(g) {
      ground(g);
      const spine = [];
      for (let i = 0; i <= 24; i++) {
        const u = i / 24;
        spine.push([300 + u * 1300, 540 + Math.sin(u * 7) * 190]);
      }
      const sp = resample(spine, 24);
      g.strokeStyle = '#4a5170'; g.lineWidth = 3;
      line(g, sp, '#4a5170', 3);
      cel(g, ribbon(spine, u => 18 + Math.sin(u * Math.PI) * 70), { f: '#67e8f9', s: '#22b8d6', so: [8, 8], l: INK, lw: 3 });
      lab(g, 'xương sống (mảnh) → dải kín (đậm)', 300, 260);
      lab(g, 'ribbon(spine, width(u))', 300, 900);
    },
  },
  {
    name: 'tone() · mix() · rgba()', sig: 'tone(f, {s,h,l}) · mix(a,b,t) · rgba(c,a)',
    desc: 'Từ một màu, tạo ra bộ bốn màu (fill / shadow / highlight / line) mà mọi hình của kênh dùng.',
    draw(g) {
      ground(g);
      const t = tone('#67e8f9');
      const cols = [['f', t.f], ['s', t.s], ['h', t.h], ['l', t.l]];
      cols.forEach(([k, c], i) => {
        cel(g, rect(360 + i * 240, 360, 560 + i * 240, 560), { f: c, s: mix(c, '#000', .4), so: [8, 8], l: INK, lw: 3 });
        lab(g, k + '  ' + c, 360 + i * 240, 620, { px: 22 });
      });
      for (let i = 0; i <= 10; i++) {
        g.fillStyle = mix('#67e8f9', '#f7bd27', i / 10);
        g.fillRect(360 + i * 110, 720, 110, 80);
      }
      lab(g, 'mix(a, b, t) — trộn hai màu', 360, 860);
      g.fillStyle = rgba('#67e8f9', .35); g.fillRect(360, 900, 300, 80);
      lab(g, 'rgba(c, a)', 700, 950);
    },
  },
  {
    name: 'LWK.k — đòn dày nét toàn cục', sig: 'LWK = { k: 1 }',
    desc: 'Một nút toàn cục: mọi nét trong rig nhân với k. Đặt LWK.k = 1.6 là toàn bộ phim đậm hơn.',
    draw(g) {
      ground(g);
      LWK.k = 1; cel(g, poly([[400, 340], [800, 280], [900, 700], [450, 720]]), { f: '#67e8f9', s: '#22b8d6', so: [12, 12], l: INK, lw: 4 });
      LWK.k = 1.6; cel(g, poly([[1060, 340], [1460, 280], [1560, 700], [1110, 720]]), { f: '#f7bd27', s: '#d99516', so: [12, 12], l: INK, lw: 4 });
      LWK.k = 1;
      lab(g, 'LWK.k = 1', 400, 780);
      lab(g, 'LWK.k = 1.6', 1060, 780);
    },
  },
]);

// —— character.js: Kẻ Nghĩ Nhiều ——
section('character.js', 'rig/character.js', 'Người dẫn của kênh: một bộ xương vẽ, 19 biểu cảm, và bảng màu.', [
  {
    name: 'PAL — bảng màu', sig: 'PAL = { bg, ink, skin, hair, hoodie, pants, violet, cyan, red, green, … }',
    desc: 'Mọi màu trong phim đến từ đây. Mỗi màu chính là một bộ bốn: f (mảng) · s (bóng) · h (sáng) · l (nét).',
    draw(g) {
      ground(g);
      const keys = ['bg', 'bg2', 'ink', 'cream', 'muted', 'panel', 'panel2', 'yellow', 'bulb', 'mouth', 'blush'];
      const tones = ['skin', 'hair', 'hoodie', 'pants', 'violet', 'cyan', 'red', 'green', 'accent'];
      keys.forEach((k, i) => {
        const c = PAL[k];
        const x = 180 + (i % 6) * 270, y = 300 + Math.floor(i / 6) * 220;
        cel(g, rect(x, y, x + 200, y + 130), { f: c, s: mix(c, '#000', .4), so: [7, 7], l: INK, lw: 2.4 });
        lab(g, k, x, y + 165, { px: 22 });
      });
      tones.forEach((k, i) => {
        const t = PAL[k];
        const x = 180 + i * 190;
        ['f', 's', 'h', 'l'].forEach((p, j) => {
          cel(g, rect(x, 760 + j * 62, x + 150, 810 + j * 62), { f: t[p] ?? '#000', l: INK, lw: 1.6 });
        });
        lab(g, k, x, 1030, { px: 20 });
      });
    },
  },
  {
    name: 'figure() — toàn thân', sig: 'figure(g, { s, E, t, legs, armL, armR, pose, blink, talk, battery })',
    desc: 'Nhân vật vẽ trong không gian rig 800×560, rồi nhân với 1.35·s. Gốc tại ngực: dịch canvas tới ngực là đặt được nhân vật.',
    draw(g) {
      ground(g);
      g.fillStyle = '#1a1e2e'; g.fillRect(0, 900, W, H - 900);
      full(g, 700, 940, 1.25, { E: 'smile', t: 1.2, legs: { mode: 'stand' } });
      full(g, 1300, 940, 1.25, { E: 'thinking', t: 2.4, legs: { mode: 'walk', ph: .3 } });
      lab(g, 'ngực là gốc · feet = ngực + 426·s', 140, 1010, { px: 22 });
    },
  },
  {
    name: "figure() — crop: 'bust'", sig: "figure(g, { crop: 'bust' })",
    desc: "crop: 'bust' bỏ chân, chỉ giữ tới ngực — dùng cho cận cảnh và cho vòng tròn người dẫn.",
    draw(g) {
      ground(g);
      bust(g, 500, 700, 2.2, 'smile', { t: 1.2 });
      bust(g, 1250, 700, 2.2, 'skeptical', { t: 1.2, headRoll: .12 });
      lab(g, "crop: 'bust'", 380, 240);
    },
  },
  {
    name: 'EXPR — 19 biểu cảm', sig: 'EXPR = { neutral, talk, smile, happy, excited, surprised, shocked, thinking, skeptical, smug, worried, sad, tired, annoyed, embarrassed, determined, deadpan, flat, spin }',
    desc: 'Bảng biểu cảm của người dẫn. Lưu ý khi dùng: mw, ms, browY, blush, ahoge, sweat, gloom, sparkles, tired là các trường KHÔNG đổi pixel — chỉ face, open, lookX, lookY, smile, mo, glow có tác dụng.',
    draw(g) {
      ground(g);
      const names = Object.keys(EXPR);
      const cols = 7, cw = W / cols, chh = 340;
      names.forEach((n, i) => {
        const cx = (i % cols) * cw + cw / 2, cy = Math.floor(i / cols) * chh + 210;
        head(g, cx, cy, .58, n, { t: 1.2 });
        lab(g, n, cx, cy + 128, { px: 24, align: 'center', fill: '#c9cee3' });
      });
    },
  },
  {
    name: "figure() — chân", sig: "legs: { mode: 'stand' | 'walk' | 'sit', ph }",
    desc: "Ba chế độ chân. 'walk' cần pha (ph 0…1 = một vòng bước) để chân không trượt trên sàn.",
    draw(g) {
      ground(g);
      g.fillStyle = '#1a1e2e'; g.fillRect(0, 900, W, H - 900);
      full(g, 400, 930, 1.1, { E: 'neutral', legs: { mode: 'stand' } });
      full(g, 960, 930, 1.1, { E: 'neutral', legs: { mode: 'walk', ph: .25 } });
      full(g, 1520, 930, 1.1, { E: 'neutral', legs: { mode: 'sit' } });
      lab(g, 'stand', 330, 1010, { px: 24, align: 'center' });
      lab(g, 'walk', 890, 1010, { px: 24, align: 'center' });
      lab(g, 'sit', 1450, 1010, { px: 24, align: 'center' });
    },
  },
  {
    name: 'figure() — tay', sig: 'armL / armR: { at: [x,y] | swing | gest | prop }',
    desc: 'at là một điểm trong KHÔNG GIAN RIG (không phải toạ độ màn hình): tay chỉ tới đó và xoay nửa góc. swing là góc xoay tuyệt đối; prop vẽ vật trong lòng bàn tay. Tay không bao giờ nhảy, nó di chuyển.',
    draw(g) {
      ground(g);
      full(g, 640, 960, 1.3, { E: 'talk', armR: { at: [620, 190] }, talk: { o: .5 } });
      full(g, 1400, 960, 1.3, {
        E: 'neutral',
        armL: { swing: .9 },
        armR: { swing: -.8, prop: gg => { cel(gg, rect(-16, -46, 16, 4), { f: '#f4ecdd', s: '#c9bfa8', so: [4, 4], l: INK, lw: 2.4 }); } },
      });
      lab(g, 'armR.at = [620, 190] (toạ độ rig)', 440, 200, { px: 24 });
      lab(g, 'swing + prop (vật trong lòng bàn tay)', 1150, 200, { px: 24 });
    },
  },
  {
    name: 'roi() — Rối', sig: 'roi(g, x, y, s, { t })',
    desc: 'Rối, nhân vật phụ đã nghỉ. Vẽ bằng nét đứt tím, trôi nhẹ theo t.',
    draw(g) {
      ground(g);
      roi(g, 700, 560, 2.4, { t: 1.5 });
      roi(g, 1200, 560, 2.4, { t: 3.1 });
      lab(g, 'roi(g, x, y, s, { t })', 560, 220);
    },
  },
  {
    name: 'battery() — pin ngực', sig: 'battery(g, x, y, w, level, t)',
    desc: 'Biểu tượng pin trên ngực: dưới 25% thì đỏ, không thì xanh. x, y là góc trên trái.',
    draw(g) {
      ground(g);
      battery(g, 400, 380, 220, .9, 0);
      battery(g, 760, 380, 220, .35, 0);
      battery(g, 1120, 380, 220, .12, 0);
      lab(g, 'level 0.9', 400, 660, { px: 24 });
      lab(g, 'level 0.35', 760, 660, { px: 24 });
      lab(g, 'level 0.12 — đỏ', 1120, 660, { px: 24 });
    },
  },
  {
    name: 'blendE() — trộn biểu cảm', sig: "blendE('neutral', 'worried', t)",
    desc: 'Trộn hai biểu cảm: các kênh số nội suy, kênh chữ (face) đổi ở giữa. Hàm faceKeys() trong keys.js dùng đúng cách này.',
    draw(g) {
      ground(g);
      [0, .25, .5, .75, 1].forEach((t, i) => {
        head(g, 300 + i * 330, 620, 1.15, blendE('neutral', 'worried', t), { t: 1.2 });
        lab(g, 't = ' + t, 300 + i * 330, 830, { px: 24, align: 'center' });
      });
    },
  },
  {
    name: 'squircle() · animeHead()', sig: 'squircle(x, y, a, b, n, steps) · animeHead(x, y, a, b, yaw)',
    desc: 'squircle() trả về một Path2D bo góc kiểu siêu bầu dục (n = 4.2 là ô vuông bo). animeHead() trả về đường viền đầu trong không gian rig — tham số bị bỏ qua, phải tự đặt transform.',
    draw(g) {
      ground(g);
      cel(g, squircle(600, 520, 220, 180), { f: '#67e8f9', s: '#22b8d6', so: [12, 12], l: INK, lw: 3.4 });
      g.save(); g.translate(1250, 560); g.scale(1.35, 1.35); g.translate(-390, -204);
      cel(g, animeHead(), { f: '#f7bd27', s: '#d99516', so: [12, 12], l: INK, lw: 3.4 });
      g.restore();
      lab(g, 'squircle(x, y, a, b)', 460, 820);
      lab(g, 'animeHead() — đường viền đầu', 1100, 820);
    },
  },
]);

// —— hands.js: bàn tay ——
section('hands.js', 'rig/hands.js', 'Bàn tay vẽ riêng: cổ tay ở (0,0), ngón tay dọc theo +x, ngón cái ở phía −y. Dùng cho tay cầm đồ.', [
  ...Object.keys(GEST).map(name => ({
    name: `hand() — ${name}`, sig: `hand(g, PAL.skin, { gest: '${name}' })`,
    desc: `Cử chỉ "${name}" — view ${GEST[name].view}.`,
    draw(g) {
      ground(g);
      g.save(); g.translate(1020, 560); g.rotate(-Math.PI / 2 + .25); g.scale(5.2, 5.2);
      hand(g, PAL.skin, { gest: name, lw: 2.4 });
      g.restore();
      lab(g, name, 120, 180, { px: 44, fill: '#c9cee3' });
    },
  })),
  {
    name: 'blendGest() — trộn cử chỉ', sig: "blendGest('relaxed', 'point', t)",
    desc: 'Các con số của ngón tay nội suy nên tay chuyển động chứ không giật. Chỉ trộn hai cử chỉ cùng view.',
    draw(g) {
      ground(g);
      [0, .33, .66, 1].forEach((t, i) => {
        g.save(); g.translate(480 + i * 440, 540); g.rotate(-Math.PI / 2 + .25); g.scale(4.4, 4.4);
        hand(g, PAL.skin, { gest: blendGest('relaxed', 'point', t), lw: 2.4 });
        g.restore();
        lab(g, 't = ' + t, 480 + i * 440, 900, { px: 30, align: 'center' });
      });
    },
  },
]);

// —— sets.js: bối cảnh ——
section('sets.js', 'rig/sets.js', 'Bối cảnh và đạo cụ. roomBack và sofa tô tràn khung — vẽ chúng TRƯỚC nhân vật.', [
  {
    name: 'roomBack() — căn phòng ban đêm', sig: 'roomBack(g, t, cam = {x, y})',
    desc: 'Lớp sau: cửa sổ thành phố, kệ sách, đồng hồ tường. cam là độ lệch parallax (cam.x dương → cảnh trượt sang trái).',
    live: true,
    draw(g, T) {
      SETS.roomBack(g, T, { x: 0, y: 0 });
    },
  },
  {
    name: 'roomFront() — bàn làm việc', sig: 'roomFront(g, t, cam, { lamp })',
    desc: 'Lớp trước: mặt bàn, tách cà phê, đèn bàn. Chỉ tắt đèn khi truyền đúng { lamp: false }. Vẽ SAU nhân vật.',
    live: true,
    draw(g, T) {
      SETS.roomBack(g, T, { x: 0, y: 0 });
      full(g, 700, 960, 1.15, { E: 'smile', t: T });
      SETS.roomFront(g, T, { x: 0, y: 0 });
    },
  },
  {
    name: 'roomFront() — không đèn', sig: 'roomFront(g, t, cam, { lamp: false })',
    desc: 'Cùng bàn làm việc nhưng không đèn bàn — bàn sạch, không vật cản.',
    live: true,
    draw(g, T) {
      SETS.roomBack(g, T, { x: 0, y: 0 });
      SETS.roomFront(g, T, { x: 0, y: 0 }, { lamp: false });
    },
  },
  {
    name: 'sofa() — ghế sofa ban đêm', sig: 'sofa(g, t)',
    desc: 'Cảnh sofa: cửa sổ đêm, sàn, đệm ghế. t được nhận vào nhưng không dùng.',
    draw(g) {
      SETS.sofa(g, 0);
    },
  },
  {
    name: 'street() — phố lúc bình minh', sig: 'street(g, t, camx)',
    desc: 'Bầu trời bình minh, mặt trời mọc, cây, chim. camx là SỐ (px), không phải {x,y}. Chừa trống giữa trời và đất nên phải tô nền trước.',
    live: true,
    draw(g, T) {
      g.fillStyle = '#1E2130'; g.fillRect(0, 0, W, H);
      SETS.street(g, T, 200);
    },
  },
  {
    name: 'person() — người vô danh', sig: "person(g, x, y, s, col, { ph })",
    desc: 'Người tối giản, mặt không có chi tiết. Gốc ở BÀN CHÂN, cao ~870px khi s = 1.',
    draw(g) {
      ground(g);
      g.fillStyle = '#1a1e2e'; g.fillRect(0, 900, W, H - 900);
      SETS.person(g, 600, 960, .95, '#3A4260', { ph: .25 });
      SETS.person(g, 1100, 960, .95, '#4F86C6', { ph: .6 });
    },
  },
  {
    name: 'feedColumn() — cột feed', sig: 'feedColumn(g, x, y, w, h, scroll, { n })',
    desc: 'Màn hình dọc cuộn: x, y là TÂM, scroll là độ lệch (px, không âm), n là số mục.',
    draw(g) {
      ground(g);
      SETS.feedColumn(g, 960, 540, 420, 860, 120, { n: 6 });
    },
  },
  {
    name: 'thought() — bong bóng suy nghĩ', sig: 'thought(g, x, y, r, p)',
    desc: 'Bong bóng suy nghĩ, đuôi hướng xuống-trái. p = độ mờ (p = 0 là tắt).',
    draw(g) {
      ground(g);
      SETS.thought(g, 900, 480, 150, 1);
      SETS.thought(g, 1400, 480, 150, .35);
    },
  },
  {
    name: 'hourRow() — dải giờ', sig: 'hourRow(g, x, y, w, h, p, { n, hi })',
    desc: 'Dải khối giờ: p = phần đã thức (khối sáng), hi là TỶ LỆ vị trí đánh dấu (không phải chỉ số).',
    draw(g) {
      ground(g);
      SETS.hourRow(g, 300, 420, 1320, 90, .42, { n: 24, hi: .62 });
      SETS.hourRow(g, 300, 640, 1320, 90, .75, { n: 24, hi: .8 });
      lab(g, 'p = 0.42, hi = 0.62', 300, 380, { px: 24 });
      lab(g, 'p = 0.75, hi = 0.80', 300, 600, { px: 24 });
    },
  },
]);

// —— extras.js: người phụ ——
section('extras.js', 'rig/extras.js', 'Người trong truyện. extra() trả về vị trí đầu và hai bàn tay, để gắn đồ vào tay.', [
  {
    name: `LOOKS — ${Object.keys(LOOKS).length} kiểu người`, sig: `LOOKS = { ${Object.keys(LOOKS).join(', ')} }`,
    desc: 'Da, tóc, áo, quần, phụ kiện (acc: glasses | coat | apron | lanyard | scarf | vest | stetho | badge | tie, một hay nhiều) và mũ (hat: police | nurse | chef | hard | nonla | helmet | cap). Nghề: doctor, nurse, police, teacher, chef, worker, farmer, pupil, shipper, businessman.',
    draw(g) {
      ground(g);
      const names = Object.keys(LOOKS), per = Math.ceil(names.length / 2);
      names.forEach((n, i) => {
        const r = Math.floor(i / per), x = 140 + (i % per) * (1640 / (per - 1)), y = 500 + r * 500;
        extra(g, { x, y, s: .42, look: n, E: 'neutral', t: 1.2 });
        lab(g, n, x, y + 40, { px: 20, align: 'center' });
      });
    },
  },
  {
    name: 'extra() — biểu cảm', sig: "extra(g, { look, E }) — E: neutral|happy|surprised|worried|thinking|annoyed|sad|sly|pain|shocked|sleepy",
    desc: 'Cùng một người, mười một biểu cảm. Ngoài ra có thể truyền { brow, mouth, eyes } (-1…1) để tự chỉnh.',
    draw(g) {
      ground(g);
      const es = ['neutral', 'happy', 'surprised', 'worried', 'thinking', 'annoyed', 'sad', 'sly', 'pain', 'shocked', 'sleepy'];
      es.forEach((E, i) => {
        const x = 130 + i * 166;
        extra(g, { x, y: 960, s: .5, look: 'researcher', E, t: 1.2, talk: E === 'surprised' ? .5 : 0 });
        lab(g, E, x, 1010, { px: 20, align: 'center' });
      });
    },
  },
  {
    name: 'extra() — tay', sig: "armL / armR: down|point|hold|wave|hip|up|chin|cross|reach|open|recoil|head|cover|ear|drink|shrug|hug|hold2|knit|type|write|stir|clap|fan|wipe|shiver",
    desc: 'Tay nghỉ, chỉ, cầm, giật lại vì nóng, ôm đầu, che miệng, áp điện thoại, uống, nhún vai, ôm… Vòng lặp (knit, type, fan, wipe, shiver…) chạy theo t.',
    live: true,
    draw(g, T) {
      ground(g);
      const poses = ['down', 'hold', 'wave', 'up', 'chin', 'open', 'recoil', 'head', 'cover', 'ear', 'drink', 'shrug', 'hug', 'fan', 'wipe', 'shiver'];
      poses.forEach((p, i) => {
        const r = Math.floor(i / 8), x = 150 + (i % 8) * 232, y = 520 + r * 500;
        extra(g, { x, y, s: .42, look: 'office', E: 'neutral', armR: p, armL: ['up', 'hug', 'shiver'].includes(p) ? p : 'down', t: T });
        lab(g, p, x, y + 40, { px: 22, align: 'center' });
      });
    },
  },
  {
    name: 'extra() — dáng', sig: 'extra(g, { sit, walk, lean, sweat, rot })',
    desc: 'Ngồi (y là mặt ghế), đi (walk là pha bước), nghiêng người về/ra xa một vật (lean −1…1, xoay quanh hông), mồ hôi (sweat 0…1), nằm (rot: −π/2, đầu sang trái).',
    live: true,
    draw(g, T) {
      ground(g);
      const L = [['sit', { sit: true, y: 700 }], ['walk', { walk: T * 1.2 }], ['lean: 1', { lean: 1 }], ['lean: −1', { lean: -1 }], ['sweat', { sweat: 1, E: 'worried', armR: 'wipe' }], ['rot: −π/2', { rot: -Math.PI / 2, E: 'sleepy', y: 860, x: 1840 }]];
      L.forEach(([n, o], i) => {
        const x = 170 + i * 290;
        extra(g, { x, y: 900, s: .6, look: 'shopper', E: 'neutral', t: T, ...o });
        lab(g, n, x, 1000, { px: 24, align: 'center' });
      });
    },
  },
  {
    name: 'crowd() — đám đông', sig: 'crowd(g, { n, cols, box, hot, dim, s, E, hotE, hotArm })',
    desc: 'Lưới người; hot là mảng số thứ tự được sáng lên, dim làm phần còn lại xám đi.',
    live: true,
    draw(g, T) {
      ground(g);
      crowd(g, { n: 12, cols: 6, box: [200, 260, 1500, 620], t: T, hot: [4, 9], dim: true });
    },
  },
]);

// —— props.js: vật đời thường, mỗi vật mọi trạng thái ——
section('props.js', 'rig/props.js', 'Vật đời thường theo tỉ lệ thật (M = 306 px một mét, gốc ở giữa đáy). prop() trả về các điểm neo theo toạ độ màn hình. Bảng đầy đủ: rig/catalog/CATALOG.md.',
  Object.entries(PROPS).map(([id, D]) => ({
    name: `${id} — ${D.name}`, sig: `prop(g, '${id}', { x, y, s, state: ${Object.keys(D.states || {}).map(k => `'${k}'`).join(' | ') || "''"}${Object.keys(D.params || {}).map(k => `, ${k}`).join('')} })`,
    desc: `${D.look || ''} Neo: ${D.anchors || '—'}.`,
    live: true,
    draw(g, T) {
      ground(g);
      const st = Object.keys(D.states || { normal: {} }), [w, h] = D.size, n = st.length;
      const s = Math.min(1700 / (w * n * 1.2), 760 / h, 6);
      g.fillStyle = '#1a1e2e'; g.fillRect(0, 900, W, H - 900);
      st.forEach((name, j) => {
        const x = W / 2 + (j - (n - 1) / 2) * w * s * 1.2;
        prop(g, id, { x, y: 900, s, state: name, t: T * 3 + j });
        if (n > 1) lab(g, name, x, 970, { px: 28, align: 'center' });
      });
    },
  })));

// —— assets.js: hình có sẵn (Fluent Emoji Flat, MIT) ——
const AIDX = await assetIndex();
await loadAssets(AIDX.map(e => e.id));
const AGROUPS = {};
for (const e of AIDX) (AGROUPS[e.group || 'Khác'] ||= []).push(e);
section('assets.js', 'rig/assets.js', `${AIDX.length} hình Fluent Emoji Flat (MIT) vẽ với viền mực của kênh. await loadAssets([...]) trước READY, rồi asset(g, id, { x, y, h }). Người trong bộ này chỉ là tượng bán thân: làm biểu tượng, không diễn. Thêm hình: rig/assets/fetch.py add "<Name>".`, [
  ...Object.entries(AGROUPS).map(([gname, es]) => ({
    name: `${gname} — ${es.length} hình`, sig: `asset(g, id, { x, y, h, rot, flip, outline, mute })`,
    desc: es.map(e => e.id).join(', '),
    draw(g) {
      ground(g);
      const cols = Math.min(10, Math.ceil(Math.sqrt(es.length * 1.8))), rows = Math.ceil(es.length / cols);
      const cw = (W - 80) / cols, ch = (H - 80) / rows, hh = Math.min(cw, ch) - 46;
      es.forEach((e, i) => {
        const x = 40 + (i % cols + .5) * cw, y = 40 + Math.floor(i / cols) * ch + hh + 6;
        asset(g, e.id, { x, y, h: hh });
        lab(g, e.id, x, y + 30, { px: Math.min(20, cw / 9), align: 'center' });
      });
    },
  })),
  {
    name: 'badge() — hình trong vòng tròn', sig: 'badge(g, id, { x, y, r, bg, ring })',
    desc: 'Một khuôn mặt hay một biểu tượng nghề trong vòng tròn: người dẫn ló ra một lúc, một vai được gọi tên.',
    draw(g) {
      ground(g);
      ['health-worker', 'police-officer', 'teacher', 'farmer', 'microbe', 'brain'].forEach((id, i) => {
        badge(g, id, { x: 230 + i * 290, y: 520, r: 120 });
        lab(g, id, 230 + i * 290, 700, { px: 24, align: 'center' });
      });
    },
  },
]);

// —— styles.js: lớp phong cách ——
section('styles.js', 'rig/styles.js', 'Các lớp phong cách dùng chung: giấy, hạt, chấm bán, hồ sơ, con dấu, chỉ số Thụy Sĩ.', [
  {
    name: 'applyPaperTexture() — vân giấy', sig: 'applyPaperTexture(g, opacity = 0.22, darkBlend = true)',
    desc: 'Lớp giấy: vết ố, nhiễu, vignette, nếp giữa trang. Cần một nền đục bên dưới, và nó tự trả transform về gốc.',
    draw(g) {
      g.fillStyle = '#1d2333'; g.fillRect(0, 0, W, H);
      STYLE.applyPaperTexture(g, .45, true);
      lab(g, 'applyPaperTexture(g, 0.45, true)', 120, 160, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'renderGrainFx() — bụi và hạt', sig: 'renderGrainFx(g, t, count = 280)',
    desc: 'Hạt sáng (bụi) trong không khí. t tính bằng giây, hạt đổi mỗi 1/12 giây nên rung nhẹ.',
    live: true,
    draw(g, T) {
      g.fillStyle = '#141824'; g.fillRect(0, 0, W, H);
      STYLE.renderGrainFx(g, T, 340);
      lab(g, 'renderGrainFx(g, t, 340)', 120, 160, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'drawHalftoneField() — chấm bán', sig: 'drawHalftoneField(g, { cx, cy, w, h, step, color, angle, densityFn, maxR })',
    desc: 'Lưới chấm bán, mật độ do densityFn quyết định. Dùng cho nền hồ sơ và cho chuyển cảnh.',
    draw(g) {
      g.fillStyle = '#141824'; g.fillRect(0, 0, W, H);
      STYLE.drawHalftoneField(g, {
        cx: 1000, cy: 540, w: 1100, h: 760, color: 'rgba(255,183,3,0.42)',
        densityFn: (x, y) => Math.max(0, 1 - Math.hypot(x, y) / 520),
      });
      lab(g, 'densityFn(x, y) → 0…1', 120, 160, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'drawHalftoneWipe() — chuyển cảnh chấm', sig: 'drawHalftoneWipe(g, p, color)',
    desc: 'Chấm nở rồi tắt dần — một cú chuyển cảnh. Ở p = 0 hoặc p = 1 thì không vẽ gì cả.',
    draw(g) {
      g.fillStyle = '#141824'; g.fillRect(0, 0, W, H);
      STYLE.drawHalftoneWipe(g, .45, '#FFB703');
      lab(g, 'drawHalftoneWipe(g, 0.45)', 120, 160, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'drawDossierHeader() — đầu hồ sơ', sig: "drawDossierHeader(g, title, caseNo, label)",
    desc: 'Tiêu đề hồ sơ: nhãn, số vụ, tiêu đề, gạch đỏ. Sinh ra để đọc trên nền tối.',
    draw(g) {
      g.fillStyle = '#141824'; g.fillRect(0, 0, W, H);
      STYLE.drawDossierHeader(g, 'VÌ SAO TA MẤT NGỦ?', 'NO.2026-CHIPHI-CHIM', 'HỒ SƠ TÂM LÝ');
      lab(g, 'drawDossierHeader(g, title, caseNo, label)', 120, 320, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'drawStampSlam() — con dấu giáng', sig: 'drawStampSlam(g, str, x, y, p, { color, px, rot })',
    desc: 'Con dấu đập xuống: từ lớn nhỏ lại, lệch chữ in ra như tem dập. p = 1 là lúc vừa giáng.',
    draw(g) {
      g.fillStyle = '#141824'; g.fillRect(0, 0, W, H);
      STYLE.drawStampSlam(g, 'ĐÃ XÁC NHẬN', 960, 520, 1, { px: 76 });
      lab(g, "drawStampSlam(g, 'ĐÃ XÁC NHẬN', 960, 520, 1)", 120, 200, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'drawEvidenceTag() — thẻ bằng chứng', sig: 'drawEvidenceTag(g, x, y, tagText, subText, { w, h, rot, pin })',
    desc: 'Thẻ giấy nhạt có dây chun đỏ và đinh ghim. Cần nền tối để đọc.',
    draw(g) {
      g.fillStyle = '#141824'; g.fillRect(0, 0, W, H);
      STYLE.drawEvidenceTag(g, 700, 560, 'NGỦ TRƯA', 'một giấc ngủ ngắn');
      STYLE.drawEvidenceTag(g, 1350, 620, 'MỆT', 'không phải buồn ngủ', { rot: -.12 });
      lab(g, 'drawEvidenceTag(g, x, y, tag, sub)', 120, 200, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'drawSunburst() — tia nắng', sig: 'drawSunburst(g, cx, cy, rot, { rays, r, col1, col2 })',
    desc: 'Tia nắng 50s: các nêm xen kẽ hai màu. Màu mặc định gần như giống nhau — muốn thấy rõ thì truyền hai màu tương phản.',
    draw(g) {
      g.fillStyle = '#101320'; g.fillRect(0, 0, W, H);
      STYLE.drawSunburst(g, 960, 540, .1, { rays: 24, col1: '#f2b53c', col2: '#1a2138' });
      lab(g, 'drawSunburst(g, 960, 540, rot, { rays, col1, col2 })', 120, 160, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'drawSparkle() — tia lấp lánh', sig: 'drawSparkle(g, x, y, size, color, rot)',
    desc: 'Ngôi sao bốn cánh — dùng cho khoảnh khắc "eureka".',
    draw(g) {
      ground(g);
      STYLE.drawSparkle(g, 700, 500, 120, '#f7bd27', 0);
      STYLE.drawSparkle(g, 1100, 420, 60, '#67e8f9', .5);
      STYLE.drawSparkle(g, 1350, 640, 36, '#f7bd27', 1.1);
      lab(g, 'drawSparkle(g, x, y, size, color, rot)', 120, 160);
    },
  },
  {
    name: 'drawSwissMetric() — chỉ số Thụy Sĩ', sig: 'drawSwissMetric(g, x, y, numStr, unitStr, labelStr, p, { color, subColor })',
    desc: 'Con số lớn + đơn vị + nhãn + thước đo tiến độ. Đơn vị đặt cạnh con số theo bề rộng đo được, nên phải tải font trước.',
    draw(g) {
      g.fillStyle = '#0F1117'; g.fillRect(0, 0, W, H);
      STYLE.drawSwissMetric(g, 420, 420, '72', '%', 'SINH LƯỢNG TẬP TRUNG', .72);
      STYLE.drawSwissMetric(g, 420, 800, '4', 'giờ', 'GIỜ NGỦ ĐÊM', .5, { color: '#f7bd27' });
    },
  },
  ...['dossier', 'midcentury', 'swiss', 'mindlab'].map(name => ({
    name: `setupSceneStyle() — ${name}`, sig: `setupSceneStyle(g, t, '${name}')`,
    desc: 'Nền cảnh theo phong cách. ' + ({
      dossier: 'Hồ sơ: nền tối + vệt chấm bán vàng.',
      midcentury: 'Nắng 50s: 24 nêm quay theo t (nền phải tô trước vì nó không tô nền).',
      swiss: 'Lưới Thụy Sĩ trên nền gần đen.',
      mindlab: 'Bàn thí nghiệm: nền tối + quầng đèn vàng (mặc định).',
    })[name],
    live: name === 'midcentury',
    draw(g, T) {
      g.fillStyle = '#101320'; g.fillRect(0, 0, W, H);
      STYLE.setupSceneStyle(g, T, name);
      lab(g, `setupSceneStyle(g, t, '${name}')`, 120, 160, { fill: '#e8e4d8' });
    },
  })),
]);

// —— components.js: thành phần giải thích ——
section('components.js', 'rig/components.js', 'Ba thành phần có đồng hồ riêng, để chữ không bao giờ lệch với hình.', [
  {
    name: 'dynamicBar() — cột động', sig: 'dynamicBar(g, { x, y, w, maxH, val, maxVal, t, t0, dur, label, subLabel })',
    desc: 'Cột mọc lên từ đường chân (y). Nhãn giá trị CHỈ hiện khi cột đã đầy 85% — tránh nhãn bay trên nền trống.',
    draw(g) {
      g.fillStyle = '#20222c'; g.fillRect(0, 0, W, H);
      dynamicBar(g, { x: 420, y: 820, val: 72, maxVal: 100, t: 10, t0: 0, dur: 1, label: '72%', subLabel: 'HIỆU SUẤT', textColor: '#f4f2ee' });
      dynamicBar(g, { x: 900, y: 820, val: 38, maxVal: 100, t: 0.4, t0: 0, dur: 1, subLabel: 'ĐANG LÊN', textColor: '#f4f2ee' });
      dynamicBar(g, { x: 1380, y: 820, val: 95, maxVal: 100, t: 10, t0: 0, dur: 1, subLabel: 'ĐẦY', textColor: '#f4f2ee' });
      lab(g, 'p = 1 (đầy)', 420, 940, { px: 22 });
      lab(g, 'p = 0.4 (nhãn chưa hiện)', 900, 940, { px: 22 });
      lab(g, 'p = 1', 1380, 940, { px: 22 });
    },
  },
  {
    name: 'gatedReveal() — mở khoá chống lộ', sig: 'gatedReveal(g, { t, tGate, dur, anim, renderFn })',
    desc: 'Chỉ vẽ sau tGate — đảm bảo đáp án không hiện sớm. anim: pop (nảy) | fade (mờ) | tên khác thì bạn tự lo chuyển động.',
    draw(g) {
      g.fillStyle = '#20222c'; g.fillRect(0, 0, W, H);
      const box = (gg, s) => {
        gg.save(); gg.scale(s, s);
        cel(gg, rect(-160, -90, 160, 90), { f: '#f7bd27', s: '#d99516', so: [8, 8], l: INK, lw: 3.4 });
        gg.restore();
      };
      lab(g, 'trước tGate', 400, 240, { px: 26, align: 'center' });
      gatedReveal(g, { t: 0.5, tGate: 2, dur: .45, anim: 'pop', renderFn: (gg, s) => { gg.save(); gg.translate(400, 520); box(gg, s); gg.restore(); } });
      lab(g, 'pop', 900, 240, { px: 26, align: 'center' });
      gatedReveal(g, { t: 3, tGate: 2, dur: .45, anim: 'pop', renderFn: (gg, s) => { gg.save(); gg.translate(900, 520); box(gg, s); gg.restore(); } });
      lab(g, 'fade', 1400, 240, { px: 26, align: 'center' });
      gatedReveal(g, { t: 3, tGate: 2, dur: .45, anim: 'fade', renderFn: (gg, s, p) => { gg.save(); gg.translate(1400, 520); gg.globalAlpha = p; box(gg, 1); gg.restore(); } });
    },
  },
  {
    name: 'strikeBehind() — gạch sau chữ', sig: 'strikeBehind(g, { p1, p2, t, t0, dur, color, lw, textFn })',
    desc: 'Vạch gạch đỏ vẽ SAU chữ, nên chữ vẫn đọc được. textFn được gọi sau vạch.',
    draw(g) {
      g.fillStyle = '#20222c'; g.fillRect(0, 0, W, H);
      strikeBehind(g, {
        p1: [560, 520], p2: [1360, 520], t: 10, t0: 0, dur: .5,
        textFn: (gg) => {
          gg.font = font(900, 96); gg.textAlign = 'center'; gg.fillStyle = '#f4f2ee';
          gg.fillText('SAI LẦM', 960, 560);
        },
      });
      lab(g, 'gạch đỏ nằm sau chữ', 960, 300, { px: 26, align: 'center' });
    },
  },
]);

// —— motion.js: chuyển động ——
section('motion.js', 'rig/motion.js', 'Chuyển động: hạt, tia, máy quay, và các đường cong hàm.', [
  {
    name: 'particlePuff() — bụi', sig: 'particlePuff(g, x, y, progress, { count, radius, color, spread, seed })',
    desc: 'Mây bụi nở ra rồi tan. progress là vòng đời, không phải độ mờ.',
    draw(g) {
      ground(g);
      MOTION.particlePuff(g, 900, 540, .45, { count: 9, radius: 48 });
      lab(g, 'particlePuff(g, 900, 540, 0.45)', 120, 160);
    },
  },
  {
    name: 'particleSparks() — tia lửa', sig: 'particleSparks(g, x, y, progress, { count, length, color, lw, rot })',
    desc: 'Tia bắn ra từ tâm, mỗi tia rời đi theo đường thẳng.',
    draw(g) {
      ground(g);
      MOTION.particleSparks(g, 900, 540, .45, { count: 8, length: 90 });
      lab(g, 'particleSparks(g, 900, 540, 0.45)', 120, 160);
    },
  },
  {
    name: 'speedBurst() — vệt tốc độ', sig: 'speedBurst(g, cx, cy, progress, { count, innerRadius, outerRadius, color, lw })',
    desc: 'Vệt tốc độ toả ra, dùng khi cảnh chuyển động mạnh.',
    draw(g) {
      ground(g);
      MOTION.speedBurst(g, 960, 540, .45);
      lab(g, 'speedBurst(g, 960, 540, 0.45)', 120, 160);
    },
  },
  {
    name: 'kineticCamera() — máy quay động', sig: 'kineticCamera(g, t, { target, zoom, ox, oy, drift, shake })',
    desc: 'Đổi transform của canvas quanh một điểm neo. PHẢI bọc trong save/restore, nếu không cả khung hình bị méo.',
    live: true,
    draw(g, T) {
      ground(g);
      g.save();
      MOTION.kineticCamera(g, T, { zoom: 1.35, shake: 14, target: [960, 540] });
      for (let i = 0; i < 8; i++) {
        cel(g, rect(120 + i * 220, 300, 300 + i * 220, 760), { f: i % 2 ? '#232a44' : '#1b2138', l: '#2a3145', lw: 3 });
      }
      bust(g, 900, 520, 1.5, 'excited', { t: T });
      g.restore();
      lab(g, 'kineticCamera(g, t, { zoom, shake })', 120, 160);
    },
  },
  {
    name: 'irisTransition() — màn che tròn', sig: 'irisTransition(g, cx, cy, progress, fill)',
    desc: 'Màn che từ ngoài vào trong, lỗ tròn ở giữa mở dần. Ở progress = 1 thì phủ kín khung.',
    draw(g) {
      g.fillStyle = '#20222c'; g.fillRect(0, 0, W, H);
      bust(g, 960, 620, 1.8, 'smile', { t: 1.2 });
      MOTION.irisTransition(g, 960, 540, .55, '#12131a');
      lab(g, 'irisTransition(g, 960, 540, 0.55)', 120, 160, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'occlusionWipe() — quét màn', sig: "occlusionWipe(g, progress, dir, fill) — dir: leftToRight|rightToLeft|bottomToTop|topToBottom",
    desc: 'Một tấm che quét qua khung hình — dùng để cắt cảnh.',
    draw(g) {
      g.fillStyle = '#20222c'; g.fillRect(0, 0, W, H);
      bust(g, 960, 620, 1.8, 'smile', { t: 1.2 });
      MOTION.occlusionWipe(g, .5, 'leftToRight', '#12131a');
      lab(g, "occlusionWipe(g, 0.5, 'leftToRight')", 120, 160, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'Đường cong hàm', sig: 'spring(t, d, bounces, decay) · elasticOut(t) · anticipate(t, pull) · wiggle(t, freq, amp, seed)',
    desc: 'Bốn đường cong chuyển động của motion.js. spring và elasticOut vọng quá 1 — dùng cho scale, không dùng cho opacity.',
    draw(g) {
      ground(g);
      const curves = [
        ['spring', t => MOTION.spring(t, .6, 2.5, 5)],
        ['elasticOut', t => MOTION.elasticOut(t)],
        ['anticipate', t => MOTION.anticipate(t, .25)],
        ['wiggle', t => MOTION.wiggle(t, 6, 1, 0)],
      ];
      curves.forEach(([name, f], i) => {
        const x0 = 320 + i * 420, y0 = 320, w = 320, h = 420;
        g.strokeStyle = '#3a4260'; g.lineWidth = 2; g.strokeRect(x0, y0, w, h);
        g.strokeStyle = '#4a5170'; g.beginPath(); g.moveTo(x0, y0 + h * .8); g.lineTo(x0 + w, y0 + h * .8); g.stroke();
        g.strokeStyle = '#f7bd27'; g.lineWidth = 4; g.beginPath();
        for (let k = 0; k <= 60; k++) {
          const t = k / 60, v = f(t);
          const px = x0 + t * w, py = y0 + h * .8 - v * h * .55;
          k ? g.lineTo(px, py) : g.moveTo(px, py);
        }
        g.stroke();
        lab(g, name, x0, y0 - 30, { px: 26 });
      });
      lab(g, 'trục ngang = thời gian · vạch ngang = giá trị 1.0', 320, 820);
    },
  },
]);

// —— broll.js: lớp dựng ——
section('broll.js', 'rig/broll.js', 'Lớp dựng dùng chung: chữ, bảng, nhãn, dấu, vòng, phụ đề, chuyển cảnh.', [
  {
    name: 'ground() — nền', sig: 'ground(g, col = PAL.bg)',
    desc: 'Nền tối + lưới 96px + vignette. Luôn gọi đầu tiên, khi transform còn là gốc.',
    draw(g) {
      ground(g);
      lab(g, 'ground(g)', 120, 160);
    },
  },
  {
    name: 'text() · revealText() · wrap()', sig: 'text(g, s, x, y, { font, align, base, fill, stroke, sw })',
    desc: 'Chữ đo bằng font kênh. revealText hiện dần từ trái sang; wrap() ngắt dòng theo bề rộng cho trước.',
    draw(g) {
      ground(g);
      text(g, 'Chữ tiêu đề 800 64px', 200, 260, { font: font(800, 64), fill: '#f4f2ee' });
      text(g, 'chữ thường 500 34px', 200, 340, { font: font(500, 34), fill: '#b9bed4' });
      revealText(g, 'chữ hiện dần từ trái sang phải', 200, 460, .55, { font: font(700, 42), fill: '#67e8f9' });
      g.font = font(500, 34);
      wrap(g, 'Câu này sẽ được ngắn dòng theo bề rộng mà bạn đưa cho wrap, mỗi dòng một hàng.', 700)
        .forEach((ln, i) => text(g, ln, 200, 580 + i * 52, { font: font(500, 34), fill: '#b9bed4' }));
      lab(g, 'wrap(g, s, maxW) → mảng các dòng', 200, 860, { fill: '#67e8f9' });
    },
  },
  {
    name: 'panel() — bảng', sig: 'panel(g, { x, y, w, h, rot, f, l, tape, pin, lift }, inner)',
    desc: 'Bảng có bóng cứng, có thể dán băng keo và ghim đinh. inner() được vẽ bên trong bảng.',
    draw(g) {
      ground(g);
      panel(g, { x: 700, y: 560, w: 700, h: 420, tape: true, pin: true, rot: -.02 }, (gg, w, h) => {
        text(gg, 'NỘI DUNG TRONG BẢNG', -w / 2 + 40, -h / 2 + 90, { font: font(800, 44), fill: '#f4f2ee' });
      });
      panel(g, { x: 1400, y: 600, w: 520, h: 320, f: '#f4ecdd', l: '#1d202a', lift: 1, rot: .03 }, (gg, w, h) => {
        text(gg, 'Bảng sáng', -w / 2 + 30, -h / 2 + 70, { font: font(800, 40), fill: '#1d202a' });
      });
    },
  },
  {
    name: 'hilite() — gạch highlight', sig: 'hilite(g, x, y, w, h, p, col, seed)',
    desc: 'Vệt highlight quét sau một từ, như gạch highlight trên giấy.',
    draw(g) {
      g.fillStyle = '#20222c'; g.fillRect(0, 0, W, H);
      text(g, 'một từ được gạch highlight', 380, 520, { font: font(800, 72), fill: '#f4f2ee' });
      hilite(g, 372, 452, 1160, 92, 1, '#f7bd27');
      lab(g, 'hilite(g, x, y, w, h, 1)', 380, 700, { px: 24 });
    },
  },
  {
    name: 'stamp() — tem cao su', sig: 'stamp(g, s, x, y, { rot, px, col, p })',
    desc: 'Tem cao su mực đen, méo và xé — dùng cho dấu "sai", "đã xác nhận".',
    draw(g) {
      g.fillStyle = '#20222c'; g.fillRect(0, 0, W, H);
      stamp(g, 'SAI', 700, 540, { px: 76, col: '#f04462', rot: -.16 });
      stamp(g, 'ĐÚNG', 1300, 600, { px: 64, col: '#4ade80', rot: .1 });
    },
  },
  {
    name: 'pip() — vòng tròn', sig: 'pip(g, cx, cy, r, p, draw, ring)',
    desc: 'Vòng tròn có viền, nội dung do draw() vẽ bên trong (đã cắt tròn sẵn).',
    draw(g) {
      ground(g);
      pip(g, 700, 540, 220, 1, (gg, r) => {
        gg.fillStyle = '#1a1e2e'; gg.fillRect(-r, -r, 2 * r, 2 * r);
        bust(gg, 0, r * .5, 1.1, 'talk', { t: 1.2 });
      });
      pip(g, 1300, 540, 220, .6, (gg, r) => {
        gg.fillStyle = '#1a1e2e'; gg.fillRect(-r, -r, 2 * r, 2 * r);
        bust(gg, 0, r * .5, 1.1, 'smug', { t: 1.2 });
      });
      lab(g, 'p = 1', 700, 860, { px: 24, align: 'center' });
      lab(g, 'p = 0.6', 1300, 860, { px: 24, align: 'center' });
    },
  },
  {
    name: 'bubble() — bong bóng nói', sig: 'bubble(g, x, y, w, h, inner, { rot, tail })',
    desc: 'Bong bóng nói: x, y là tâm, đuôi ở dưới (tail: left | right).',
    draw(g) {
      ground(g);
      bubble(g, 700, 500, 620, 320, (gg, w, h) => {
        text(gg, 'Đây là lời thoại', -w / 2 + 10, 20, { font: font(700, 44), fill: '#171a2b' });
      });
      bubble(g, 1400, 560, 520, 280, (gg, w, h) => {
        text(gg, 'và đây là bong bóng thứ hai', -w / 2 + 10, 16, { font: font(700, 38), fill: '#171a2b' });
      }, { tail: 'right', rot: -.04 });
    },
  },
  {
    name: 'focusLines() — vệt tốc độ sau cận cảnh', sig: 'focusLines(g, cx, cy, t, col, n, r0)',
    desc: 'Vệt tia toả ra từ tâm, đằng sau một cận mặt.',
    draw(g) {
      ground(g);
      focusLines(g, 960, 460, 1.2, '#2A2F42');
      bust(g, 960, 700, 2.1, 'surprised', { t: 1.2 });
      lab(g, 'focusLines(g, 960, 460, t)', 120, 160);
    },
  },
  {
    name: 'subtitle() — phụ đề khắc vào hình', sig: 'subtitle(g, s, a = 1)',
    desc: 'Phụ đề của kênh được khắc thẳng vào khung hình, tự xuống dòng ở 1400px.',
    draw(g) {
      ground(g);
      subtitle(g, 'Vì sao nằm ngủ trưa dậy lại vẫn mệt? Một câu hỏi mà ai cũng gặp nhưng ít ai hỏi tới cùng.');
      lab(g, 'subtitle(g, s)', 120, 200, { px: 24 });
    },
  },
  {
    name: 'tag() — nhãn dán', sig: 'tag(g, s, x, y, p, { col, px, rot, ink })',
    desc: 'Nhãn dán nghiêng, xuất hiện bằng ease.back (vọng nhẹ).',
    draw(g) {
      ground(g);
      tag(g, 'KHÁI NIỆM', 620, 480, 1, { px: 40 });
      tag(g, 'SỐ LIỆU', 1200, 480, 1, { px: 40, col: PAL.cyan });
      tag(g, 'TÊN', 900, 700, 1, { px: 40, col: PAL.violet });
    },
  },
  {
    name: 'ring() — vòng tiến trình', sig: 'ring(g, cx, cy, r, p, col, lw)',
    desc: 'Vòng tròn tiến trình, vẽ từ 12 giờ theo chiều kim đồng hồ.',
    draw(g) {
      ground(g);
      ring(g, 700, 540, 220, .72);
      ring(g, 1300, 540, 220, .35, PAL.violet);
      lab(g, 'p = 0.72', 700, 860, { px: 24, align: 'center' });
      lab(g, 'p = 0.35', 1300, 860, { px: 24, align: 'center' });
    },
  },
  {
    name: 'batteryBig() — pin lớn', sig: 'batteryBig(g, x, y, w, level, t)',
    desc: 'Pin lớn để trên màn hình; dưới 25% thì nhấp nháy đỏ theo t.',
    live: true,
    draw(g, T) {
      ground(g);
      batteryBig(g, 500, 420, 500, .7, T);
      batteryBig(g, 1100, 420, 500, .12, T);
      lab(g, 'level 0.7', 500, 760, { px: 24 });
      lab(g, 'level 0.12 — nhấp nháy đỏ', 1100, 760, { px: 24 });
    },
  },
  {
    name: 'irisWipe() — chuyển cảnh', sig: 'irisWipe(g, p, cx, cy, col)',
    desc: 'irisWipe mở lỗ tròn từ tâm ra: ở p = 0 khung còn kín, lỗ mở dần theo p.',
    draw(g) {
      g.fillStyle = '#20222c'; g.fillRect(0, 0, W, H);
      bust(g, 960, 620, 1.8, 'smile', { t: 1.2 });
      irisWipe(g, .45, 960, 540, '#12131a');
      lab(g, 'irisWipe(g, 0.45)', 120, 160, { fill: '#e8e4d8' });
    },
  },
  {
    name: 'ambientMotes() — bụi lơ lửng', sig: 'ambientMotes(g, t, count, bounds)',
    desc: 'Bụi sáng trôi trong không khí — dùng cho cảnh đêm.',
    live: true,
    draw(g, T) {
      ground(g);
      ambientMotes(g, T, 26);
      lab(g, 'ambientMotes(g, t, 26)', 120, 160);
    },
  },
]);

// —— host.js: người dẫn bình luận ——
section('host.js', 'rig/host.js', 'Hai cách người dẫn bình luận mà không cướp mạch câu chuyện.', [
  {
    name: 'hostPip() — vòng ở góc', sig: 'hostPip(g, T, sh, { corner, xy, r, E, talk, blink, at, out, bg })',
    desc: 'Vòng tròn ở góc khung hình, hiện khi cắt cảnh vào và tắt khi cắt ra. sh cần t0 và t1.',
    live: true,
    draw(g, T) {
      SETS.roomBack(g, T, { x: 0, y: 0 });
      full(g, 700, 960, 1.15, { E: 'smile', t: T });
      hostPip(g, T, { t0: 0, t1: 99 }, { corner: 'br', E: 'talk', talk: { o: .4 }, r: 190 });
    },
  },
  {
    name: 'reactClose() — cận mặt', sig: 'reactClose(g, T, { E, talk, blink, bg, lines, at, s })',
    desc: 'Cận cảnh người dẫn chiếm trọn khung hình, dùng cho một phản ứng (nhếch mày, "khoan đã"). Nó XÓA cảnh cũ.',
    live: true,
    draw(g, T) {
      reactClose(g, T, { E: 'skeptical', talk: { o: .3 }, s: 2.6 });
      lab(g, 'reactClose(g, T, { E: "skeptical" })', 120, 160);
    },
  },
]);

// —— keys.js: chuyển động theo thời gian ——
section('keys.js', 'rig/keys.js', 'Các hàm biến thời gian thành chuyển động. Đây là ngôn ngữ của MOTION.md.', [
  {
    name: 'span() · keys() · count()', sig: 'span(T, t0, d, e) · keys(T, [[t, v], …], d) · count(T, t0, d, n)',
    desc: 'span chạy 0→1 trong d giây; keys giữ giá trị rồi mới đi tới giá trị kế tiếp; count đếm số lên.',
    draw(g) {
      ground(g);
      const rows = [
        ['span', T => span(T, 1, 2, 'inOut')],
        ['keys', T => keys(T, [[0, 0], [2, 1], [4, .3]], 1)],
        ['count', T => count(T, 1, 2, 12) / 12],
      ];
      rows.forEach(([name, f], r) => {
        const y0 = 320 + r * 220;
        g.strokeStyle = '#3a4260'; g.lineWidth = 2; g.strokeRect(300, y0, 1200, 150);
        g.strokeStyle = '#67e8f9'; g.lineWidth = 5; g.beginPath();
        for (let k = 0; k <= 80; k++) {
          const T = k / 80 * 4, v = f(T);
          const px = 300 + k / 80 * 1200, py = y0 + 150 - v * 120;
          k ? g.lineTo(px, py) : g.moveTo(px, py);
        }
        g.stroke();
        lab(g, name + '  (T: 0 → 4s)', 300, y0 - 20, { px: 26 });
      });
    },
  },
  {
    name: 'poseKeys() · faceKeys()', sig: 'poseKeys(T, [[t, pose]], d) · faceKeys(T, [[t, face]], bl)',
    desc: 'poseKeys để số và điểm di chuyển, từ đổi ở giữa; faceKeys trộn hai biểu cạm trong bl giây.',
    live: true,
    draw(g, T) {
      ground(g);
      const E = faceKeys(T, [[0, 'neutral'], [2, 'worried']], .4);
      head(g, 600, 600, 1.5, E, { t: T });
      const pose = poseKeys(T, [[0, { armR: 'down' }], [1.5, { armR: 'up' }]], .5);
      full(g, 1300, 960, 1.4, { E: 'talk', t: T, armR: { swing: pose.armR === 'up' ? 1.1 : 0 } });
      lab(g, 'faceKeys: neutral → worried', 600, 880, { px: 26, align: 'center' });
      lab(g, 'poseKeys: tay hạ → tay giơ', 1300, 880, { px: 26, align: 'center' });
    },
  },
  {
    name: 'enter() · travel() · walkTo() · landing()', sig: 'enter(T, t0, {from, d, rot, t1}) · travel(T, t0, d, A, B, lift) · walkTo(T, t0, d, x0, x1, stride)',
    desc: 'Bốn kiểu di chuyển: vào từ một hướng, bay theo vòng cung, đi bộ (chân không trượt), và nén lại khi chạm đất.',
    live: true,
    draw(g, T) {
      ground(g);
      const e = enter(T, 0, { from: [-500, 0], d: 1.2, rot: .3, t1: 99 });
      const tr = travel(T, 0, 1.4, [300, 900], [1100, 500], 220);
      const wk = walkTo(T, 0, 2.4, 200, 1700, 170);
      const ld = landing(T, 2.2, .3);
      g.fillStyle = '#1a1e2e'; g.fillRect(0, 940, W, H - 940);
      cel(g, rect(300 + e.x - 90, 500 + e.y - 90, 300 + e.x + 90, 500 + e.y + 90), { f: '#67e8f9', s: '#22b8d6', so: [10, 10], l: INK, lw: 3.4 });
      cel(g, ellP(tr[0], tr[1], 70, 70), { f: '#f7bd27', s: '#d99516', so: [10, 10], l: INK, lw: 3.4 });
      cel(g, rect(wk.x - 50, 830, wk.x + 50, 940), { f: '#9a5be5', s: '#7d3fc4', so: [10, 10], l: INK, lw: 3.4 });
      g.fillStyle = '#4ade80'; g.beginPath(); g.ellipse(960, 400, 70 * ld[0], 70 * ld[1], 0, 0, TAU); g.fill();
      lab(g, 'enter()', 60, 200, { px: 24 });
      lab(g, 'travel()', 320, 200, { px: 24 });
      lab(g, 'walkTo()', 180, 1010, { px: 24 });
      lab(g, 'landing()', 900, 200, { px: 24 });
    },
  },
  {
    name: 'drawOn() — nét tự vẽ', sig: 'drawOn(g, pts, p, col, lw)',
    desc: 'Một nét tự kéo dài theo đường điểm — đường vẽ, vết nứt, mũi tên.',
    live: true,
    draw(g, T) {
      ground(g);
      const p = Math.min(1, Math.max(0, (T % 2) / 1.6));
      drawOn(g, [[300, 800], [600, 500], [900, 700], [1200, 400], [1600, 560]], p, '#f7bd27', 9);
      lab(g, 'drawOn(g, pts, p)', 120, 160);
    },
  },
]);

// —— board.js: bảng cảnh ——
section('board.js', 'rig/board.js', 'Bảng cảnh của tập: board.json → cảnh, nhịp, nhãn, biểu đồ, sự kiện. Cần board.json của một tập nên không dựng ở đây.', [
  {
    name: 'board.js — không dựng ở đây', sig: 'loadBoard(url, L, words) · bindBoard(board, L, words)',
    desc: 'Module này đọc board.json của một tập (cần voice/words.json và timeline) nên không có hình cố định để dựng. Xem board.json của tập 01 trong series/co-the/ để biết nó định nghĩa những gì.',
    draw(g) {
      ground(g);
      const items = [
        'scenes / shots / beats — cảnh, cỡ cảnh, nhịp',
        'BD.t(id) · BD.u(id, T) — thời điểm và tiến độ của một nhịp',
        'BD.camera(g, T) — chuyển động máy (push, pull, track, pan)',
        'BD.signals(g, T) — nhãn, biểu đồ, mũi tên của cảnh',
        'BD.events() — danh sách tiếng động',
      ];
      items.forEach((s, i) => lab(g, '· ' + s, 240, 380 + i * 90, { px: 34, fill: '#c9cee3' }));
    },
  },
]);

// ——— dựng trang ———

const root = document.getElementById('root');
const boot = document.getElementById('boot');
const zoom = document.getElementById('zoom');
const zoomc = document.getElementById('zoomc');
const zg = zoomc.getContext('2d');

// every tile is drawn at the full 1920×1080 the rig works in, then scaled down into the small canvas
const scratch = document.createElement('canvas');
scratch.width = W; scratch.height = H;
const sg = scratch.getContext('2d');
const TILES = [];

await document.fonts.ready;

for (const sec of SECTIONS) {
  const h2 = document.createElement('h2');
  h2.innerHTML = `<code>${sec.file}</code><span class="path">${sec.path}</span>`;
  const note = document.createElement('p');
  note.style.cssText = 'margin:2px 0 0;color:var(--muted);font-size:13.5px;max-width:1100px';
  note.textContent = sec.note;
  const grid = document.createElement('div');
  grid.className = 'grid';
  sec.tiles.forEach(tile => {
    const fig = document.createElement('figure');
    fig.className = 'tile';
    const cv = document.createElement('canvas');
    cv.width = 640; cv.height = 360;
    const cap = document.createElement('figcaption');
    cap.innerHTML = '<b></b><span></span><div class="sig"></div>';
    cap.querySelector('b').textContent = tile.name;
    cap.querySelector('span').textContent = tile.desc;
    cap.querySelector('.sig').textContent = tile.sig;
    fig.append(cv, cap);
    grid.append(fig);
    const rec = { ...tile, canvas: cv, ctx: cv.getContext('2d'), fig };
    TILES.push(rec);
    cv.addEventListener('click', () => openZoom(rec));
  });
  root.append(h2, note, grid);
}

function drawTile(rec, ctx, T) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  try {
    rec.draw(ctx, T);
  } catch (err) {
    console.error(rec.name, err);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#3a1520'; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#f04462'; ctx.font = '600 20px sans-serif';
    ctx.fillText('LỖI: ' + err.message, 16, 34);
  }
}

function paint(rec, T) {
  drawTile(rec, sg, T);
  const g = rec.ctx;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, rec.canvas.width, rec.canvas.height);
  g.drawImage(scratch, 0, 0, rec.canvas.width, rec.canvas.height);
}

let currentT = parseFloat(document.getElementById('t').value);

function repaintLive(T) {
  for (const rec of TILES) if (rec.live) paint(rec, T);
}

function openZoom(rec) {
  drawTile(rec, zg, currentT);
  document.getElementById('zoomt').textContent = rec.name;
  document.getElementById('zoomd').textContent = rec.desc;
  zoom.showModal();
}

const slider = document.getElementById('t');
const tval = document.getElementById('tv');
slider.addEventListener('input', () => {
  currentT = parseFloat(slider.value);
  tval.textContent = currentT.toFixed(2) + 's';
  repaintLive(currentT);
});

const q = document.getElementById('q');
const countEl = document.getElementById('count');
function filter() {
  const s = q.value.trim().toLowerCase();
  let n = 0;
  for (const rec of TILES) {
    const hay = (rec.name + ' ' + rec.sig + ' ' + rec.desc).toLowerCase();
    const hit = !s || hay.includes(s);
    rec.fig.classList.toggle('hidden', !hit);
    if (hit) n++;
  }
  countEl.textContent = `${n} / ${TILES.length} mục`;
}
q.addEventListener('input', filter);

tval.textContent = currentT.toFixed(2) + 's';
for (const rec of TILES) paint(rec, currentT);
filter();
boot.remove();
window.READY = true;
