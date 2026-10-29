import { chromium } from 'playwright-core'; import { serve } from './serve.mjs';
import { EXE } from '../../core/render/browser.mjs';
const { server, port } = await serve(process.cwd());
const b = await chromium.launch({ executablePath: EXE, args: ['--use-angle=vulkan','--enable-gpu','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(`http://127.0.0.1:${port}/index.html`);
await p.waitForFunction(() => window.READY, null, { timeout: 180000 });
const info = await p.evaluate(() => { const gl = document.querySelector('#stage canvas').getContext('webgl2'); const e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : '?'; });
console.log('GL', info);
for (const t of [50, 50.04, 50.08, 50.12, 50.16]) {
  const t0 = Date.now(); await p.evaluate(x => window.render(x), t); await p.screenshot({ type: 'jpeg', quality: 95 }); console.log(t, Date.now() - t0, 'ms');
}
await b.close(); server.close();
