// Who casts this shadow? Find the object whose shadow darkens a given patch of a frame.
//
//   node channels/tram-nghi-nhieu/tools/shadow_who.mjs <episode> --at 80.5 [--patch x,y]
//
// Why this tool exists: the ink outline is a post-process, so a shadow has no edge and reads as a hole in
// the picture (N125). The critic's job is to say "this is a shadow"; the maker's job is then to find out
// WHOSE. Until now that meant writing a temporary flag into the episode's own source and rendering one
// candidate at a time — debug code that lives in the film's source until someone remembers to remove it,
// and dozens of renders to answer one question.
//
// How it works, without touching the episode:
//   1. the rig module is patched in flight so the scene is reachable (window.__SCENE) — the episode's own
//      source is left alone, so nothing debug-ish can reach the film;
//   2. the frame is rendered with the shadows on and off, and the darkest patch that changes between the
//      two is the shadow in question;
//   3. every scene child that casts is switched off in turn (castShadow = false) and the patch is measured
//      again: the child whose removal brightens the patch the most is the caster;
//   4. the answer is printed with the child's index, type, position and size, so the maker can move it,
//      shrink it, or take it out of frame.
//
// Every episode gets this without a line of debug code in its own source.
import { openDemo, closeServer } from '../../../core/render/page.mjs';

const args = process.argv.slice(2);
const take = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const dir = args.find(a => !a.startsWith('--') && a !== take('--at') && a !== take('--patch'));
const at = parseFloat(take('--at', '0'));
const patchArg = take('--patch', null);          // "x,y" in 0..1 screen coordinates

if (!dir) { console.error('usage: node shadow_who.mjs <episode> --at <seconds> [--patch x,y]'); process.exit(2); }

// One evaluate does everything: render the frame, wait for it to be presented, read the pixels back.
// Splitting the render and the read into two evaluates loses the frame — the canvas is cleared.
// This has to be a real function, not a string: page.evaluate() evaluates a string as an expression.
const READ = async ([t, x0, y0, x1, y1]) => {
  window.render(t);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const s = document.querySelector('canvas#c') || document.querySelector('canvas');
  const c = document.createElement('canvas'); c.width = s.width; c.height = s.height;
  const g = c.getContext('2d'); g.drawImage(s, 0, 0);
  const lum = (a, b, c2, d2) => {
    const w = Math.max(1, Math.round((c2 - a) * s.width)), h = Math.max(1, Math.round((d2 - b) * s.height));
    const im = g.getImageData(Math.round(a * s.width), Math.round(b * s.height), w, h);
    const q = im.data; let sum = 0, n = 0;
    for (let i = 0; i < q.length; i += 4) { sum += 0.299 * q[i] + 0.587 * q[i + 1] + 0.114 * q[i + 2]; n++; }
    return sum / n;
  };
  const GX = 24, GY = 14, grid = [];
  for (let j = 0; j < GY; j++) { const row = [];
    // the centre pixel, not the average of the cell: a shadow that reads as a shard is a few pixels wide,
    // and averaging a cell with the lit floor around it hides it
    for (let i = 0; i < GX; i++) {
      const X = Math.round((i + .5) / GX * s.width), Y = Math.round((j + .5) / GY * s.height);
      const d = g.getImageData(X, Y, 1, 1).data;
      row.push(0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2]);
    }
    grid.push(row); }
  return { patch: lum(x0, y0, x1, y1), grid, w: s.width, h: s.height };
};

const { browser, page } = await openDemo(dir, { q: 'ss=1', warnings: false });

// the rig module is patched in flight so the scene is reachable from here: no debug code in the episode.
// The content-encoding header has to go with it: the fetched body is already decoded, and a browser that
// is told to gunzip plain text answers with a syntax error instead of the module.
await page.route('**/rig/render.js', async route => {
  const res = await route.fetch();
  const body = (await res.text()).replace(
    'function frame(scene, o = {}) {',
    'function frame(scene, o = {}) { if (!window.__SCENE) window.__SCENE = scene;');
  const headers = { ...res.headers() };
  delete headers['content-encoding'];
  delete headers['content-length'];
  await route.fulfill({ status: res.status(), headers, body });
});
await page.reload({ waitUntil: 'load' });
await page.waitForFunction(() => window.READY === true, null, { timeout: 180000 });

const measure = (x0, y0, x1, y1) => page.evaluate(READ, [at, x0, y0, x1, y1]);
const goto = async q => {
  await page.goto(page.url().replace(/\?.*$/, '') + q);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 180000 });
};

const withShadow = await measure(0, 0, 1, 1);
console.log(`frame ${withShadow.w}x${withShadow.h}, mean of the grid with shadows on: ${(withShadow.grid.flat().reduce((a, b) => a + b, 0) / 336).toFixed(1)}`);

// the same frame with the shadows off: the rig has ?noshadow for the key light
await goto('?noshadow&ss=1');
const noShadow = await measure(0, 0, 1, 1);
console.log(`mean of the grid with the shadows off: ${(noShadow.grid.flat().reduce((a, b) => a + b, 0) / 336).toFixed(1)}`);
await goto('?ss=1');

// the patch: the darkest cell that changes when the shadows go away
let best = null;
for (let j = 0; j < noShadow.grid.length; j++) {
  for (let i = 0; i < noShadow.grid[j].length; i++) {
    const d = noShadow.grid[j][i] - withShadow.grid[j][i];
    if (d > 8 && (!best || d > best.d)) best = { d, i, j };
  }
}
let x0, y0, x1, y1;
if (patchArg) {
  const [a, b] = patchArg.split(',').map(Number);
  x0 = a - .04; x1 = a + .04; y0 = b - .04; y1 = b + .04;
} else if (best) {
  const GX = 24, GY = 14;
  x0 = best.i / GX; x1 = (best.i + 1) / GX; y0 = best.j / GY; y1 = (best.j + 1) / GY;
  console.log(`the darkest shadow patch is at grid (${best.i},${best.j}) — ${best.d.toFixed(1)} points darker with the shadows on`);
} else {
  console.log('no shadow in this frame: nothing casts into the picture here');
  await browser.close(); closeServer(); process.exit(0);
}

const base = (await measure(x0, y0, x1, y1)).patch;
console.log(`patch brightness with shadows on: ${base.toFixed(1)}`);

// the children of the scene, and the caster: the one whose removal brightens the patch
const children = await page.evaluate(() => window.__SCENE.children.map((c, i) => ({
  i, name: c.name || '', type: c.type,
  pos: [c.position.x, c.position.y, c.position.z].map(v => +v.toFixed(2)),
  scale: [c.scale.x, c.scale.y, c.scale.z].map(v => +v.toFixed(2)),
  kids: c.children.length,
  casts: (() => { let n = 0; c.traverse(o => { if (o.isMesh && o.castShadow) n++; }); return n; })(),
  mat: (() => { let col = ''; c.traverse(o => { if (!col && o.isMesh && o.material && o.material.color) col = '#' + o.material.color.getHexString(); }); return col; })(),
})));

const results = [];
for (const c of children) {
  if (!c.casts) continue;
  const v = await page.evaluate(async ([i, t, x0, y0, x1, y1]) => {
    const c = window.__SCENE.children[i];
    const was = [];
    c.traverse(o => { if (o.isMesh) { was.push([o, o.castShadow]); o.castShadow = false; } });
    window.render(t);
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const s = document.querySelector('canvas#c') || document.querySelector('canvas');
    const cv = document.createElement('canvas'); cv.width = s.width; cv.height = s.height;
    const g = cv.getContext('2d'); g.drawImage(s, 0, 0);
    const w = Math.max(1, Math.round((x1 - x0) * s.width)), h = Math.max(1, Math.round((y1 - y0) * s.height));
    const im = g.getImageData(Math.round(x0 * s.width), Math.round(y0 * s.height), w, h);
    const q = im.data; let sum = 0, n = 0;
    for (let k = 0; k < q.length; k += 4) { sum += 0.299 * q[k] + 0.587 * q[k + 1] + 0.114 * q[k + 2]; n++; }
    for (const [o, w2] of was) o.castShadow = w2;
    return sum / n;
  }, [c.i, at, x0, y0, x1, y1]).catch(() => null);
  if (v === null) continue;
  results.push({ ...c, delta: v - base });
}
results.sort((a, b) => b.delta - a.delta);
console.log(`\n${results.length} objects cast a shadow. Removing each one in turn and measuring the patch:`);
for (const r of results.slice(0, 8)) {
  console.log(`  +${r.delta.toFixed(1).padStart(6)}  child #${String(r.i).padStart(3)}  ${r.type.padEnd(14)} ${(r.name || '(no name)').padEnd(18)} ${r.mat.padEnd(8)} at ${r.pos.join(', ')} scale ${r.scale.join(', ')} (${r.kids} kids, ${r.casts} meshes)`);
}
if (results.length) {
  const w = results[0];
  console.log(`\nthe caster is child #${w.i} — ${w.type} "${w.name || '(no name)'}" ${w.mat} at ${w.pos.join(', ')}`);
  console.log('move it out of the light, shrink it, or take it out of frame; the shadow goes with it.');
}
await browser.close(); closeServer();
