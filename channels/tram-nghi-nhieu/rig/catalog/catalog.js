// Trang danh mục: mỗi giây t là một trang, vẽ mọi vật của rig ở mọi trạng thái, có tên, để agent nhìn trước khi chọn.
import { PROPS, prop } from '../props.js';
import { extra, LOOKS } from '../extras.js';
import { assetIndex, loadAssets, asset } from '../assets.js';
import { W, H } from '../cel.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
const show = new URLSearchParams(location.search).get('show') || 'props';
const COLS = 3, ROWS = 2, CW = W / COLS, CH = (H - 60) / ROWS;
let pages = [];

function label(s, x, y, px = 26, w = 800, col = '#FAF8F5') { g.font = `${w} ${px}px "Be Vietnam Pro"`; g.fillStyle = col; g.textAlign = 'center'; g.fillText(s, x, y); }

async function setup() {
  if (show === 'props') {
    const ids = Object.keys(PROPS);
    for (let i = 0; i < ids.length; i += COLS * ROWS) pages.push(ids.slice(i, i + COLS * ROWS));
  } else if (show === 'people') {
    const L = Object.keys(LOOKS); for (let i = 0; i < L.length; i += 6) pages.push({ kind: 'look', items: L.slice(i, i + 6) });
    const ARMS = ['point', 'hold', 'wave', 'hip', 'up', 'chin', 'cross', 'reach', 'open', 'recoil', 'head', 'cover', 'ear', 'drink', 'shrug',
      'hug', 'hold2', 'knit', 'type', 'write', 'stir', 'clap', 'fan', 'wipe', 'shiver'];
    for (let i = 0; i < ARMS.length; i += 10) pages.push({ kind: 'arm', items: ARMS.slice(i, i + 10) });
    pages.push({ kind: 'face', items: ['neutral', 'happy', 'surprised', 'worried', 'thinking', 'annoyed', 'sad', 'sly', 'pain', 'shocked', 'sleepy'] });
    pages.push({ kind: 'body', items: [['sit', { sit: true }], ['walk', { walk: .6 }], ['lean +1', { lean: 1 }], ['lean −1', { lean: -1 }], ['sweat', { sweat: 1, E: 'worried', armR: 'wipe' }], ['nằm (rot −π/2)', { rot: -Math.PI / 2, E: 'sleepy' }]] });
  } else if (show === 'assets') {
    const idx = await assetIndex(); await loadAssets(idx.map(e => e.id));
    for (let i = 0; i < idx.length; i += 32) pages.push({ kind: 'asset', items: idx.slice(i, i + 32) });
  } else if (window.CATALOG_EXTRA) pages = await window.CATALOG_EXTRA(show, g);
  window.DUR = pages.length;
}
function drawProps(ids, T) {
  ids.forEach((id, i) => {
    const D = PROPS[id], cx = (i % COLS) * CW, cy = 60 + Math.floor(i / COLS) * CH;
    g.fillStyle = '#323747'; g.fillRect(cx + 8, cy + 8, CW - 16, CH - 16);
    const st = Object.keys(D.states || { normal: {} }), [w, h] = D.size, n = st.length;
    const s = Math.min((CW - 60) / (w * n * 1.15), (CH - 130) / h, 6);
    g.fillStyle = '#3C4254'; g.fillRect(cx + 8, cy + CH - 70, CW - 16, 4);
    st.forEach((name, j) => {
      const x = cx + CW / 2 + (j - (n - 1) / 2) * w * s * 1.15, y = cy + CH - 70;
      prop(g, id, { x, y, s, state: name, t: T * 3 + j });
      if (n > 1) label(name, x, cy + CH - 40, 20, 700, '#B8BFCC');
    });
    label(`${id} · ${D.name}`, cx + CW / 2, cy + 44, 26);
  });
}
function drawPeople(pg, T) {
  const n = pg.items.length, cols = pg.kind === 'look' ? 6 : pg.kind === 'face' ? 6 : pg.kind === 'body' ? 6 : 5, rows = Math.ceil(n / cols);
  const cw = W / cols, ch = (H - 60) / rows;
  pg.items.forEach((it, i) => {
    const cx = (i % cols) * cw, cy = 60 + Math.floor(i / cols) * ch, gy = cy + ch - 60;
    g.fillStyle = '#323747'; g.fillRect(cx + 6, cy + 6, cw - 12, ch - 12);
    let o = { x: cx + cw / 2, y: gy, t: T * 2 + i, look: 'office', E: 'neutral' }, name = it;
    if (pg.kind === 'look') { o.look = it; o.s = Math.min((ch - 200) / 700, (cw - 30) / 340); o.armR = 'wave'; o.E = 'happy'; }
    if (pg.kind === 'arm') { o.s = Math.min((ch - 120) / 700, (cw - 30) / 380); o.armR = it; o.look = 'shopper'; if (it === 'point' || it === 'reach') o.at = [cx + cw - 30, cy + 120];
      if (['knit', 'type', 'write', 'stir', 'clap', 'hug', 'hold2', 'shiver'].includes(it)) o.armL = it; }
    if (pg.kind === 'face') { o.s = (ch - 40) / 320; o.y = cy + ch * .5 + 470 * o.s; o.E = it; o.look = 'participant'; }
    if (pg.kind === 'body') { [name] = it; Object.assign(o, it[1]); o.s = .62; if (o.sit) o.y = gy - 170; if (o.rot) { o.s = .45; o.y = gy - 40; o.x = cx + cw - 20; } }
    g.save(); g.beginPath(); g.rect(cx + 6, cy + 6, cw - 12, ch - 12); g.clip(); extra(g, o); g.restore();
    label(pg.kind === 'arm' ? `armR: '${name}'` : pg.kind === 'face' ? `E: '${name}'` : pg.kind === 'look' ? `look: '${name}'` : name, cx + cw / 2, cy + ch - 22, 22, 700, '#FAF8F5');
  });
}
function drawAssets(pg) {
  const cols = 8, cw = W / cols, ch = (H - 60) / 4;
  pg.items.forEach((e, i) => {
    const cx = (i % cols) * cw, cy = 60 + Math.floor(i / cols) * ch;
    g.fillStyle = '#323747'; g.fillRect(cx + 5, cy + 5, cw - 10, ch - 10);
    asset(g, e.id, { x: cx + cw / 2, y: cy + ch - 62, h: ch - 110 });
    label(e.id, cx + cw / 2, cy + ch - 26, e.id.length > 20 ? 15 : 18, 700, '#FAF8F5');
  });
}
window.render = T => {
  const p = Math.min(pages.length - 1, Math.floor(T));
  g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = '#2A2E3A'; g.fillRect(0, 0, W, H);
  label(`Trạm Nghĩ Nhiều · rig/${show} · trang ${p + 1}/${pages.length}`, W / 2, 40, 24, 700, '#8A93A8');
  if (show === 'props') drawProps(pages[p], T); else if (show === 'people') drawPeople(pages[p], T); else if (show === 'assets') drawAssets(pages[p]); else if (window.CATALOG_DRAW) window.CATALOG_DRAW(show, pages[p], T, g);
};
window.TEXTS = () => []; window.EV = [];
await Promise.all(['800 26px', '700 22px', '700 20px', '700 24px', '700 18px', '700 15px'].map(f => document.fonts.load(`${f} "Be Vietnam Pro"`))); await setup(); window.READY = true;
