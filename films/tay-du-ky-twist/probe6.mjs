import { chromium } from 'playwright-core'; import { serve } from './serve.mjs';
import { EXE } from '../../core/render/browser.mjs';
const { server, port } = await serve(process.cwd());
const b = await chromium.launch({ executablePath: EXE, args: ['--use-angle=vulkan','--enable-gpu','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(`http://127.0.0.1:${port}/index.html`);
await p.waitForFunction(() => window.READY, null, { timeout: 180000 });
const q = await p.evaluate(async () => {
  const T = await import('./timing.js');
  const out = [];
  const tests = [
    ['b6', [[-.13,.004,.22],[.125,.004,.22],[0,.045,.11]]],
    ['c5', [[0,.002,.16],[.06,.002,.2]]],
    ['d4', [[-.13,.14,.12],[-.15,.02,.07]]],
    ['d11', [[-.06,.02,.2],[.06,.02,.2]]],
    ['e8', [[-.05,.016,.18],[0,.02,.14]]],
    ['f4', [[-.02,.004,.14],[.1,.004,.22]]],
    ['g3', [[-.12,.006,.1],[.12,.01,.06]]],
  ];
  for (const [id, pts] of tests) {
    const t = T.L[id].t0 + .4;
    window.render(t);
    out.push([id, +t.toFixed(1), pts.map(x => window.DBG.screen(...x)?.map(v => Math.round(v)).join(','))]);
  }
  return out;
});
for (const r of q) console.log(r[0], r[1], r[2].join(' | '));
await b.close(); server.close();
