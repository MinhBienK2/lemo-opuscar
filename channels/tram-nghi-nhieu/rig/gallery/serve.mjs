// serve.mjs — open the rig gallery.
//
// The gallery is a page of ES modules, and browsers refuse to load ES modules over file://. So the repository
// root has to be served over http, and the page is then at /channels/<channel>/rig/gallery/index.html.
//
//   node channels/tram-nghi-nhieu/rig/gallery/serve.mjs          # serves the root, prints the URL
//   node channels/tram-nghi-nhieu/rig/gallery/serve.mjs --open   # …and opens a browser
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = (() => {
  let d = HERE;
  while (d !== path.dirname(d) && !fs.existsSync(path.join(d, 'core/render/serve.mjs'))) d = path.dirname(d);
  if (!fs.existsSync(path.join(d, 'core/render/serve.mjs'))) {
    console.error('serve: cannot find the library root (no core/render/serve.mjs above this folder)');
    process.exit(2);
  }
  return d;
})();

const { serve } = await import(path.join(ROOT, 'core/render/serve.mjs'));
const { port } = await serve(ROOT);
const url = `http://127.0.0.1:${port}/channels/tram-nghi-nhieu/rig/gallery/index.html`;
console.log('Rig gallery:', url);
console.log('(nhấn Ctrl+C để dừng)');

if (process.argv.includes('--open')) {
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  spawn(cmd, [url], { stdio: 'ignore', detached: true }).unref();
}
