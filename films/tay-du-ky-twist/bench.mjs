import { chromium } from 'playwright-core';
import { serve } from './serve.mjs';
import { EXE } from '../../core/render/browser.mjs';
const ARGS = ['--use-angle=vulkan','--enable-gpu','--ignore-gpu-blocklist','--font-render-hinting=none','--force-color-profile=srgb'];
const { server, port } = await serve(process.cwd());
const br = await chromium.launch({ executablePath: EXE, args: ARGS });
const page = await br.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', e => console.error('[pageerror]', e.message));
const t0=Date.now();
await page.goto(`http://127.0.0.1:${port}/index.html`);
await page.waitForFunction(() => window.READY === true, null, { timeout: 180000 });
console.log('load+READY', (Date.now()-t0)/1000, 's');
const gl = await page.evaluate(() => { const c=document.createElement('canvas'); const g=c.getContext('webgl2'); const e=g.getExtension('WEBGL_debug_renderer_info'); return e? g.getParameter(e.UNMASKED_RENDERER_WEBGL):'?'; });
console.log('GL renderer:', gl);
const t1=Date.now();
for (let i=0;i<10;i++) { await page.evaluate(t=>window.render(t), 100+i*0.5); await page.screenshot({type:'jpeg',quality:95}); }
console.log('per-frame', (Date.now()-t1)/10, 'ms');
console.log('DUR', await page.evaluate(()=>window.DUR), 'EV', await page.evaluate(()=>window.EV?.length));
await br.close(); server.close();
