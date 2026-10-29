import { chromium } from 'playwright-core'; import { serve } from './serve.mjs';
import { EXE } from '../../core/render/browser.mjs';
const { server, port } = await serve(process.cwd());
const sets = {
  gl: ['--use-angle=gl','--enable-gpu','--ignore-gpu-blocklist'],
  vulkan: ['--use-angle=vulkan','--enable-gpu','--ignore-gpu-blocklist'],
  egl: ['--use-gl=egl','--enable-gpu','--ignore-gpu-blocklist'],
  gpu: ['--enable-gpu','--ignore-gpu-blocklist','--enable-unsafe-swiftshader'],
};
for (const [name, args] of Object.entries(sets)) {
  try {
    const b = await chromium.launch({ executablePath: EXE, args });
    const p = await b.newPage({ viewport: { width: 640, height: 360 } });
    await p.goto(`http://127.0.0.1:${port}/index.html`);
    await p.waitForFunction(() => window.READY, null, { timeout: 120000 });
    const info = await p.evaluate(() => { const gl = document.querySelector('#stage canvas').getContext('webgl2'); const e = gl.getExtension('WEBGL_debug_renderer_info'); return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : '?'; });
    console.log(name, '|', info);
    await b.close();
  } catch (e) { console.log(name, 'FAIL', String(e).split('\n')[0].slice(0,120)); }
}
server.close();
