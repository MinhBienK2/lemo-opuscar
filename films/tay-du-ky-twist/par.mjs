import { chromium } from 'playwright-core';
import { serve } from './serve.mjs';
import { EXE } from '../../core/render/browser.mjs';
const ARGS = ['--use-angle=vulkan','--enable-gpu','--ignore-gpu-blocklist','--font-render-hinting=none','--force-color-profile=srgb'];
const { server, port } = await serve(process.cwd());
const WK = +process.argv[2] || 6, N = 12;
const t0 = Date.now();
await Promise.all([...Array(WK)].map(async (_, w) => {
  const br = await chromium.launch({ executablePath: EXE, args: ARGS });
  const page = await br.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('[pageerror]', e.message));
  await page.goto(`http://127.0.0.1:${port}/index.html`);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 180000 });
  for (let i=0;i<N;i++) { await page.evaluate(t=>window.render(t), 100+w*7+i*0.5); await page.screenshot({type:'jpeg',quality:95}); }
  await br.close();
}));
const el = (Date.now()-t0)/1000;
console.log(`workers=${WK} frames=${WK*N} wall=${el.toFixed(1)}s  per-frame=${(el/(WK*N)*1000).toFixed(0)}ms  throughput=${(WK*N/el).toFixed(2)} fps`);
server.close();
