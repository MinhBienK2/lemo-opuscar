import { chromium } from 'playwright-core'; import { serve } from './serve.mjs';
import { EXE } from '../../core/render/browser.mjs';
const { server, port } = await serve(process.cwd());
const b = await chromium.launch({ executablePath: EXE, args: ['--use-angle=vulkan','--enable-gpu','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto(`http://127.0.0.1:${port}/index.html`);
await p.waitForFunction(() => window.READY, null, { timeout: 180000 });
for (const t of [405, 415, 425, 430, 440, 500, 560]) {
  const r = await p.evaluate(t => { window.render(t); const c = window.DBG.cam; const d = c.getWorldDirection(new (c.position.constructor)()); return { pos: c.position.toArray().map(v=>+v.toFixed(3)), dir: d.toArray().map(v=>+v.toFixed(2)), fov: c.fov, scr: window.DBG.screen(0,0.02,0.16) }; }, t);
  console.log(t, JSON.stringify(r));
}
await b.close(); server.close();
