import { chromium } from 'playwright-core'; import { serve } from './serve.mjs';
import { EXE } from '../../core/render/browser.mjs';
const { server, port } = await serve(process.cwd());
const b = await chromium.launch({ executablePath: EXE, args: ['--use-angle=vulkan','--enable-gpu','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(`http://127.0.0.1:${port}/index.html`);
await p.waitForFunction(() => window.READY, null, { timeout: 180000 });
const tests = [
  [12, 'party', [[-.05,0,.17],[.07,0,.19],[.14,.012,.09]]],
  [45, 'hall', [[0,.045,.11],[-.13,.004,.22],[.125,.004,.22],[0,.12,.03]]],
  [120, 'register', [[0,.002,.16],[.06,.002,.2],[-.1,.01,.08]]],
  [320, 'shelf', [[-.15,.02,.07],[.15,.02,.07],[-.06,.02,.2]]],
  [430, 'sutras', [[-.05,.016,.18],[0,.02,.14],[-.1,.02,.12]]],
  [500, 'river', [[-.02,.004,.14],[.1,.004,.22],[-.06,.008,.15]]],
  [570, 'ford', [[-.02,.002,.16],[-.12,.006,.1],[.12,.01,.06]]],
];
for (const [t, name, pts] of tests) {
  const r = await p.evaluate(({ t, pts }) => { window.render(t); return pts.map(q => window.DBG.screen(...q)); }, { t, pts });
  console.log(t, name, r.map(q => q ? q.map(v => Math.round(v)).join(',') : 'off').join(' | '));
}
await b.close(); server.close();
