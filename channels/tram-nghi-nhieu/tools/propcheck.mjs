// Every object an episode puts on screen, alone, from three sides: node channels/tram-nghi-nhieu/propcheck.mjs [<episode>] --out <dir>
// The episode's src/props.js exports PROPS = { 'tên vật như lời gọi': () => THREE.Object3D, … } — either written by hand in one
// file (legacy) or generated from src/props/<id>.js (one prop per file; tools/props_catalog.py --write-index). film.js imports from it.
// Without an episode: the rig's own objects (propcheck/rig.js).
// --only <file.json>: a JSON array of prop NAMES; only those are rendered. p_NN.jpg keeps the index in the PROPS order of the
// episode (NN is the same with or without --only); unknown names are an error (exit 2).
// Writes <out>/p_NN.jpg (three views side by side) and <out>/props.json [{n, name, f}] (rendered ones only). review.sh --props judges them.
import fs from 'fs'; import path from 'path'; import { spawnSync } from 'child_process';
import { openDemo, closeServer } from '../../../core/render/page.mjs';
const args = process.argv.slice(2), take = k => { const i = args.indexOf(k); return i < 0 ? null : args.splice(i, 2)[1]; };
const out = take('--out'), onlyFile = take('--only'), ep = args[0];
if (!out) { console.error('usage: propcheck.mjs [<episode>] --out <dir> [--only <names.json>]'); process.exit(2); }
const only = onlyFile ? JSON.parse(fs.readFileSync(onlyFile, 'utf8')) : null;
if (only && !Array.isArray(only)) { console.error('propcheck: --only wants a JSON array of prop names'); process.exit(2); }
const HERE = path.dirname(new URL(import.meta.url).pathname), LIB = path.resolve(HERE, '../../..');
let q = '';
if (ep) {
  const mod = path.join(path.resolve(ep), 'src/props.js');
  if (!fs.existsSync(mod)) { console.error(`propcheck: ${mod} is missing — put every object of the episode there (export const PROPS = {…})`); process.exit(2); }
  q = 'mod=' + encodeURIComponent('/' + path.relative(LIB, mod));
}
fs.mkdirSync(out, { recursive: true });
const { browser, page } = await openDemo(path.join(HERE, '../propcheck'), { q });
const names = await page.evaluate(() => window.PROPS);
const res = [];
if (only) {
  const unknown = only.filter(n => !names.includes(n));
  if (unknown.length) { console.error(`propcheck: --only names not in PROPS: ${unknown.join(' | ')}`); await browser.close(); closeServer(); process.exit(2); }
}
for (const [k, name] of names.entries()) {
  if (only && !only.includes(name)) continue;
  const views = [];
  for (let v = 0; v < 3; v++) {
    await page.evaluate(x => window.render(x), 3 * k + v);
    const f = path.join(out, `v_${k}_${v}.jpg`); await page.screenshot({ path: f, type: 'jpeg', quality: 85 }); views.push(f);
  }
  const f = path.join(out, `p_${String(k + 1).padStart(2, '0')}.jpg`);
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...views.flatMap(x => ['-i', x]), '-filter_complex',
    '[0:v]scale=800:-1[a];[1:v]scale=800:-1[b];[2:v]scale=800:-1[c];[a][b][c]hstack=3', f]);
  views.forEach(x => fs.unlinkSync(x));
  res.push({ n: k + 1, name, f });
}
await browser.close(); closeServer();
fs.writeFileSync(path.join(out, 'props.json'), JSON.stringify(res, null, 1));
console.log(res.map(r => `#${r.n} ${r.name} → ${r.f}`).join('\n'));
