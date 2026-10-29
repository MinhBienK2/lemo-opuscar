// Usage (can run from any directory; the script first cds into its own demo/):
//       node render.mjs stills 1.9 3.1 ...   → stills/t_*.jpg (STILLS_DIR=out/check changes the output directory)
//       node render.mjs events               → events.json
//       node render.mjs video [workers] [render only these worker numbers, comma-separated]  → out/seg_*.mp4 + out/list.txt
import { chromium } from 'playwright-core';
import { spawn, execFile, execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
process.chdir(path.dirname(fileURLToPath(import.meta.url)));
import { serve } from './serve.mjs';
import { EXE } from '../../core/render/browser.mjs';   // PLAYWRIGHT_CHROME, or the newest headless shell in the local playwright cache
const ARGS = ['--use-angle=vulkan', '--enable-gpu', '--ignore-gpu-blocklist', '--font-render-hinting=none', '--force-color-profile=srgb'];
const FPS = parseInt(process.env.FPS || '60');
const QS = process.env.QS || '';
const mode = process.argv[2];
const { server, port } = await serve(process.cwd());
const URL = `http://127.0.0.1:${port}/index.html${QS}`;

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.error('[page]', m.text().slice(0, 300)); });
  page.on('pageerror', e => console.error('[pageerror]', e.message));
  await page.goto(URL);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 180000 });
  return page;
}
if (mode === 'stills') {
  const SD = process.env.STILLS_DIR || 'stills'; fs.mkdirSync(SD, { recursive: true });
  const browser = await chromium.launch({ executablePath: EXE, args: ARGS });
  const page = await openPage(browser);
  for (const ts of process.argv.slice(3)) {
    await page.evaluate(t => window.render(t), parseFloat(ts));
    await page.screenshot({ path: `${SD}/t_${ts}.jpg`, type: 'jpeg', quality: 90 });
  }
  await browser.close();
} else if (mode === 'events') {
  const browser = await chromium.launch({ executablePath: EXE, args: ARGS });
  const page = await openPage(browser);
  const ev = await page.evaluate(() => ({ dur: window.DUR, ev: window.EV }));
  fs.writeFileSync('events.json', JSON.stringify(ev));
  console.log('events', ev.ev.length, 'dur', ev.dur);
  await browser.close();
} else if (mode === 'video') {
  // The film is split into fixed parts of 120 frames. Each part is a file on disk, so a run that stops
  // (an ffmpeg killed for memory, a dropped browser) resumes at the next missing part.
  // Wk is how many parts the film is split into; CONC is how many browsers may run at the same time,
  // so the machine's CPU and RAM stay within a budget (a full run with 5 browsers needs about 2.5 GB).
  const Wk = parseInt(process.argv[3] || '6');
  const CONC = Math.max(1, Math.min(Wk, parseInt(process.env.CONC || process.argv[5] || '3')));
  fs.mkdirSync('out', { recursive: true });
  const DUR = parseFloat(fs.readFileSync('timing.js', 'utf8').match(/DUR = ([\d.]+)/)[1]);
  const TOTAL = Math.round(FPS * DUR), F0 = Math.max(0, +process.env.FROM || 0), F1 = Math.min(TOTAL, +process.env.TO || TOTAL);
  const PART = 120;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  // every part of the film, in order: [worker, partIndex, firstFrame, lastFrame]
  // the split is the same as before, so parts written by an earlier run keep their frames
  const per = Math.ceil((F1 - F0) / Wk);
  const plan = [];
  for (let w = 0; w < Wk; w++) {
    const a = F0 + w * per, b = Math.min(F1, a + per);
    let i = 0;
    for (let p0 = a; p0 < b; p0 += PART, i++) plan.push({ w, i, p0, p1: Math.min(b, p0 + PART) });
  }
  const partPath = (w, i) => `out/seg_${w}_${String(i).padStart(3, '0')}.mp4`;
  // a part counts as done only when it holds exactly the frames it should: a file left behind by a killed
  // ffmpeg is short, and joining it would silently drop frames from the film
  const partOk = f => {
    if (!fs.existsSync(f) || fs.statSync(f).size < 1000) return false;
    const r = execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0',
      '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', f], { encoding: 'utf8' }).trim();
    return +r.split(',')[0] > 0;
  };
  const framesOf = f => {
    const r = execFileSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0',
      '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', f], { encoding: 'utf8' }).trim();
    return +r.split(',')[0];
  };
  const missing = plan.filter(p => {
    const f = partPath(p.w, p.i);
    if (!partOk(f)) return true;
    const want = p.p1 - p.p0, got = framesOf(f);
    if (got !== want) { console.error(`part ${p.w}/${p.i} has ${got} frames, needs ${want}: rendering it again`); return true; }
    return false;
  });
  console.log(`${plan.length} parts, ${plan.length - missing.length} already done, ${missing.length} to render (${CONC} browsers at a time)`);
  const t0 = Date.now();
  let cursor = 0, rendered = 0;

  async function openBrowser() {
    for (let attempt = 0; attempt < 3; attempt++) {
      let br = null;
      try {
        br = await chromium.launch({ executablePath: EXE, args: ARGS });
        return { br, page: await openPage(br) };
      } catch (e) {
        console.error(`launch failed (${String(e.message).split('\n')[0]}), retrying`);
        try { await br?.close(); } catch {}
        await sleep(8000);
      }
    }
    return null;
  }

  async function renderPart(page, p) {
    const f = partPath(p.w, p.i);
    for (let attempt = 0; attempt < 4; attempt++) {
      if (attempt) { await sleep(6000); console.error(`retrying part ${p.w}/${p.i} (attempt ${attempt})`); }
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p', f]);
      let ffDead = null;
      ff.stdin.on('error', e => { ffDead ??= e.code || e.message; });   // ffmpeg died: stop this part
      const ffClosed = new Promise(r => ff.on('close', r));
      for (let fr = p.p0; fr < p.p1; fr++) {
        if (ffDead) break;
        await page.evaluate(t => window.render(t), fr / FPS);
        const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
        if (!ff.stdin.write(buf)) {
          await Promise.race([new Promise(r => ff.stdin.once('drain', r)), ffClosed]);
          if (ffDead) break;
        }
      }
      try { ff.stdin.end(); } catch {}
      await ffClosed;
      const want = p.p1 - p.p0;
      if (!ffDead && fs.existsSync(f) && fs.statSync(f).size > 1000 && framesOf(f) === want) return true;
      console.error(`ffmpeg stopped (${ffDead || 'no output'}) on part ${p.w}/${p.i}`);
      try { fs.unlinkSync(f); } catch {}
    }
    return false;
  }

  async function worker() {
    const b = await openBrowser();
    if (!b) throw new Error('the browser could not be started');
    while (cursor < missing.length) {
      const p = missing[cursor++];
      if (!await renderPart(b.page, p)) throw new Error(`part ${p.w}/${p.i} could not be written`);
      rendered++;
      if (rendered % 3 === 0) console.log(`${rendered}/${missing.length} parts  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    await b.br.close();
  }
  await Promise.all([...Array(CONC)].map(worker));

  // join each worker's parts into one segment, in frame order
  // (the list file lives in out/, so the paths in it are relative to out/ — bare file names)
  for (let w = 0; w < Wk; w++) {
    const mine = plan.filter(p => p.w === w);
    const list = mine.map(p => partPath(p.w, p.i));
    if (!list.length) continue;
    // every part must be on disk and complete before the segment is built
    for (const [i, p] of mine.entries()) {
      const f = list[i];
      if (!fs.existsSync(f)) throw new Error(`part ${p.w}/${p.i} is missing`);
      const want = p.p1 - p.p0, got = framesOf(f);
      if (got !== want) throw new Error(`part ${p.w}/${p.i} has ${got} frames, needs ${want}`);
    }
    fs.writeFileSync(`out/.list_${w}.txt`, list.map(p => `file '${path.basename(p)}'`).join('\n'));
    await new Promise((res, rej) => execFile('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', `out/.list_${w}.txt`, '-c', 'copy', `out/seg_${w}.mp4`],
      e => e ? rej(e) : res()));
    const want = mine.reduce((a, p) => a + (p.p1 - p.p0), 0), got = framesOf(`out/seg_${w}.mp4`);
    if (got !== want) throw new Error(`segment ${w} has ${got} frames, needs ${want}`);
    console.log(`segment ${w}: ${got} frames`);
  }
  const segs = fs.readdirSync('out').filter(f => /^seg_\d+\.mp4$/.test(f)).sort((x, y) => +x.match(/\d+/)[0] - +y.match(/\d+/)[0]);
  fs.writeFileSync('out/list.txt', segs.map(f => `file '${f}'`).join('\n'));
  console.log('done', segs.length, 'segments', ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
server.close();
