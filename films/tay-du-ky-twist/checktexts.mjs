// Reading-time check for the on-screen text, without rendering a frame per step: node checktexts.mjs
// window.TEXTS(t) is a pure function of t, so the check only needs the page loaded once.
// The rule is core/render/readcheck.mjs's: from the first frame a piece of text is fully in frame, it must stay
// fully in frame, unchanged, for at least (chars ÷ 15) + 1.5 s and never less than 1.8 s.
import { chromium } from 'playwright-core';
import { serve } from './serve.mjs';
import { EXE } from '../../core/render/browser.mjs';

const ARGS = ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--font-render-hinting=none', '--force-color-profile=srgb'];
const STEP = 0.05, LATIN = 15, PAD = 1.5, MIN = 1.8;
const { server, port } = await serve(process.cwd());
const br = await chromium.launch({ executablePath: EXE, args: ARGS });
const page = await br.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('[pageerror]', e.message));
await page.goto(`http://127.0.0.1:${port}/index.html`);
await page.waitForFunction(() => window.READY === true, null, { timeout: 180000 });
const res = await page.evaluate(({ STEP }) => {
  const W = innerWidth, H = innerHeight, seen = {}, partial = {};
  for (let t = 0; t <= window.DUR; t += STEP) {
    const vis = new Set();
    for (const b of window.TEXTS(t) || []) {
      const id = String(b.id), key = id + ' ' + b.text;
      if (!(b.x0 >= 0 && b.y0 >= 0 && b.x1 <= W && b.y1 <= H)) { partial[key] ??= { id, text: b.text, t0: t }; continue; }
      vis.add(key);
      const s = seen[key] ??= { id, text: b.text, t0: t, run: 0, done: false };
      if (!s.done) s.run = Math.min(t + STEP, window.DUR) - s.t0;
    }
    for (const k in seen) if (!vis.has(k)) seen[k].done = true;
  }
  for (const k in partial) if (seen[k]) delete partial[k];
  return { seen: Object.values(seen), partial: Object.values(partial), dur: window.DUR };
}, { STEP });
await br.close(); server.close();

const need = text => {
  let c = 0; for (const ch of text) if (!/\s/.test(ch)) c++;
  return Math.max(MIN, c / LATIN + PAD);
};
let bad = 0;
for (const s of res.seen) {
  const n = need(s.text), ok = s.run >= n - 1e-6; if (!ok) bad++;
  console.log(`${ok ? 'OK ' : 'BAD'} ${s.id.padEnd(16)} at ${s.t0.toFixed(2)}s  need ${n.toFixed(2)}s  got ${s.run.toFixed(2)}s  ${JSON.stringify(s.text.slice(0, 40))}`);
}
for (const s of res.partial) { bad++; console.log(`BAD ${s.id.padEnd(16)} never fully visible  ${JSON.stringify(s.text.slice(0, 40))}`); }
console.log(`\n${res.seen.length} pieces, ${bad} bad, film ${res.dur.toFixed(2)}s`);
process.exit(bad ? 1 : 0);
