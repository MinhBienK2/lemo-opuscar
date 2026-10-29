import { chromium } from 'playwright-core'; import { serve } from './serve.mjs';
import { EXE } from '../../core/render/browser.mjs';
const { server, port } = await serve(process.cwd());
const b = await chromium.launch({ executablePath: EXE, args: ['--use-angle=vulkan','--enable-gpu','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(`http://127.0.0.1:${port}/index.html`);
await p.waitForFunction(() => window.READY, null, { timeout: 180000 });
for (const t of [1, 6, 12, 45, 120, 200, 320, 430, 500, 570, 590]) {
  const r = await p.evaluate(t => {
    window.render(t);
    const pts = [[-.22,0,0],[.22,0,0],[-.22,0,.3],[.22,0,.3],[0,0,.15],[0,.3,0]];
    const box = pts.map(q => window.DBG.screen(...q));
    const c = window.DBG.cam.position.toArray().map(v => +v.toFixed(3));
    return { box, cam: c, dur: window.DUR };
  }, t);
  const xs = r.box.filter(Boolean).map(q => q[0]), ys = r.box.filter(Boolean).map(q => q[1]);
  console.log('t', t, 'page bbox', Math.round(Math.min(...xs)), Math.round(Math.min(...ys)), Math.round(Math.max(...xs)), Math.round(Math.max(...ys)), 'cam', r.cam.join(','));
}
await b.close(); server.close();
