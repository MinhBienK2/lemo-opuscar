// assets.js — ready-made pictures from an open set, drawn in the channel's line language (a dark ink outline, colours
// a little muted), for the things rig/props.js does not draw: a microbe, a brain, a police car, a money bag, a nurse icon.
// The set is Microsoft Fluent Emoji, Flat style (MIT, rig/assets/fluent/LICENSE), vendored in rig/assets/fluent/.
// See what is there in rig/catalog/assets-*.jpg; fetch more with rig/assets/fetch.py (search | add).
//
//   import { loadAssets, asset } from '../../../../rig/assets.js';
//   await loadAssets(['microbe', 'brain', 'police-car']);            // once, before window.READY
//   const A = asset(g, 'microbe', { x: 900, y: 700, h: 220, rot: .1 * Math.sin(T * 3) });
//
// x, y     bottom-centre on screen (where it stands); or centre: true to place its middle at x, y
// h        height on screen in px (default 160); the width follows the picture
// rot      radians around the anchor · flip true mirrors · alpha 0…1
// outline  ink line width on screen in px (default 5; 0 = none) · mute 0…1 desaturates toward the channel's palette (default .12)
// Returns { box: [x0, y0, x1, y1], top: [x, y], mid: [x, y] } in screen space (without rot).
//
// Fluent people are busts (head and shoulders): use them as an icon, a badge, a face in a circle, never as an actor.
// An actor who walks, holds and reacts is rig/extras.js.
const INK = '#1D202A';
const IMG = new Map(), CACHE = new Map();
let INDEX = null;

const url = id => new URL(`./assets/fluent/${id}.svg`, import.meta.url).href;

// the list of what is vendored: [{ id, name, group, keywords }]
export async function assetIndex() {
  if (!INDEX) INDEX = await (await fetch(new URL('./assets/fluent/index.json', import.meta.url).href)).json();
  return INDEX;
}

// load pictures by id ('fluent/<id>' works too); an unknown id throws with the closest names
export async function loadAssets(ids) {
  await Promise.all(ids.map(async raw => {
    const id = raw.replace(/^(asset:)?fluent\//, '');
    if (IMG.has(id)) return;
    const r = await fetch(url(id));
    if (!r.ok) {
      const idx = await assetIndex(), w = id.split('-')[0];
      throw new Error(`asset "${id}" is not in rig/assets/fluent (close: ${idx.filter(e => e.id.includes(w)).map(e => e.id).slice(0, 6).join(', ') || 'none'}; fetch it with rig/assets/fetch.py add "<Name>")`);
    }
    // draw the vector at a large size so a big picture stays sharp
    let svg = await r.text();
    const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1]?.split(/[ ,]+/).map(Number) || [0, 0, 32, 32];
    const k = 1024 / Math.max(vb[2], vb[3]), w = Math.round(vb[2] * k), h = Math.round(vb[3] * k);
    svg = svg.replace(/<svg([^>]*?)\swidth="[^"]*"/, '<svg$1').replace(/<svg([^>]*?)\sheight="[^"]*"/, '<svg$1').replace('<svg', `<svg width="${w}" height="${h}"`);
    const img = new Image(); img.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    await img.decode();
    IMG.set(id, { img, w, h });
  }));
}

// one cached raster per (picture, size bucket, outline, mute): the outline is a dilated silhouette in ink
function raster(id, hPx, lw, mute) {
  const P = IMG.get(id);
  if (!P) throw new Error(`asset "${id}" not loaded: await loadAssets(['${id}']) before READY`);
  const hb = Math.max(16, Math.round(Math.pow(1.12, Math.ceil(Math.log(hPx) / Math.log(1.12)))));
  const key = `${id}|${hb}|${lw}|${mute}`;
  if (CACHE.has(key)) return CACHE.get(key);
  const sc = hb / P.h, w = Math.ceil(P.w * sc), h = hb, pad = Math.ceil(lw * hb / hPx) + 2;
  const c = document.createElement('canvas'); c.width = w + pad * 2; c.height = h + pad * 2;
  const x = c.getContext('2d');
  if (lw > 0) {
    const r = lw * hb / hPx;
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; x.drawImage(P.img, pad + Math.cos(a) * r, pad + Math.sin(a) * r, w, h); }
    x.globalCompositeOperation = 'source-in'; x.fillStyle = INK; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'source-over';
  }
  x.filter = mute ? `saturate(${1 - mute}) brightness(${1 - mute * .15})` : 'none';
  x.drawImage(P.img, pad, pad, w, h); x.filter = 'none';
  const out = { c, pad: pad * hPx / hb, w: w * hPx / hb, h: hPx, k: hPx / hb };
  CACHE.set(key, out);
  return out;
}

export function asset(g, raw, o = {}) {
  const id = raw.replace(/^(asset:)?fluent\//, '');
  const hPx = o.h ?? 160, lw = o.outline ?? 5, mute = o.mute ?? .12;
  const R = raster(id, hPx, lw, mute), w = R.c.width * R.k, h = R.c.height * R.k;
  const x = o.x ?? 960, y = o.y ?? 540, oy = o.centre ? hPx / 2 : hPx;
  g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot); if (o.flip) g.scale(-1, 1);
  if (o.alpha != null) g.globalAlpha *= o.alpha;
  g.drawImage(R.c, -w / 2, -oy - R.pad, w, h);
  g.restore();
  const x0 = x - R.w / 2, y0 = y - oy;
  return { box: [x0, y0, x0 + R.w, y0 + hPx], top: [x, y0], mid: [x, y0 + hPx / 2] };
}

// a face (or any picture) in a circle: the narrator who appears for a moment, a role named by its icon
export function badge(g, raw, o = {}) {
  const r = o.r ?? 90, x = o.x ?? 960, y = o.y ?? 540;
  g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = o.bg || '#FAF8F5'; g.fill();
  g.clip(); asset(g, raw, { x, y: y + r * .95, h: r * 1.75, outline: 0, mute: o.mute });
  g.restore();
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.lineWidth = o.lw ?? 6; g.strokeStyle = o.ring || INK; g.stroke();
  return { mid: [x, y], r };
}
