// Machine-wide render queue: at most RENDER_SLOTS (default 2) GPU/browser jobs at a time across all processes and clones; the others wait inside the tool (one "[slot] waiting…" line on stderr, then silence) and start when a slot frees. Also holds back one more job while free memory is below RENDER_MIN_FREE% (default 30) and another render is running.
// Every browser entry point takes a slot through openDemo() in page.mjs (video, still, readcheck, scenecheck, beatsheet, propcheck…), once per process; video.mjs's workers live in that one process and share its slot. It can also wrap any command: node core/render/slot.mjs -- <command…>
// Environment variables: RENDER_SLOTS (integer; 0 = no limit, default 2), RENDER_MIN_FREE (0–100), RENDER_SLOT_DIR (lock directory, default <tmp>/lemo-opuscar-render-slots-<uid>, shared by all clones, works with a read-only repo too).
//   RENDER_SLOT_HELD=1 means an outer process already holds a slot: acquire() passes straight through, and slot.mjs -- <cmd> just runs the command (children of slot.mjs get it set).
// One slot = one directory under the lock directory, holding pid (the owner) and beat (a heartbeat the owner touches every 15 seconds).
// If the owner process is gone (EPERM counts as still there), or the heartbeat hasn't moved for over 90 seconds, the slot is stale and can be taken over.
// Every "check state → take over / take a slot" action happens inside a very short mutex (the .mutex directory), so at any moment a slot has only one holder.
import fs from 'fs'; import os from 'os'; import path from 'path'; import { spawn, execFileSync } from 'child_process'; import { fileURLToPath } from 'url';

const DIR = process.env.RENDER_SLOT_DIR || path.join(os.tmpdir(), `lemo-opuscar-render-slots-${process.getuid?.() ?? 'u'}`);
const BEAT_EVERY = 15000, STALE_AFTER = 90000, GRACE = 10000;
const pause = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const warned = new Set();
const warnOnce = m => { if (!warned.has(m)) { warned.add(m); console.error('[slot] ' + m); } };
function envNum(name, def, ok) {
  const v = process.env[name]; if (v == null || v === '') return def;
  const n = Number(v); if (ok(n)) return n;
  warnOnce(`ignoring ${name}="${v}" (using ${def})`); return def;
}
const alive = pid => {
  if (!Number.isInteger(pid) || pid <= 0) return false;   // kill(0) would hit the whole process group; must be blocked
  try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; }   // EPERM = the process exists, it just isn't ours
};
const mtime = p => { try { return fs.statSync(p).mtimeMs; } catch { return 0; } };
const readPid = d => { try { return Number(fs.readFileSync(path.join(d, 'pid'), 'utf8').trim()); } catch { return NaN; } };
const rmrf = p => { try { fs.rmSync(p, { recursive: true, force: true }); } catch {} };

// free memory as a percentage; if it can't be detected, treat it as 100 (no threshold)
export function freePct() {
  try {
    if (process.platform === 'darwin') return +(/free percentage:\s*(\d+)/.exec(execFileSync('memory_pressure', { encoding: 'utf8' }))?.[1] ?? 100);
    if (process.platform === 'linux') {
      const m = fs.readFileSync('/proc/meminfo', 'utf8'), avail = /MemAvailable:\s*(\d+)/.exec(m)?.[1], total = /MemTotal:\s*(\d+)/.exec(m)?.[1];
      if (avail && total) return 100 * avail / total;
    }
    return 100 * os.freemem() / os.totalmem();
  } catch { return 100; }
}

// mutex: mkdir is atomic; the holder only does a few file operations, so more than 10 seconds means it crashed inside and the lock can be cleared
function withMutex(fn) {
  const m = path.join(DIR, '.mutex');
  for (;;) {
    try { fs.mkdirSync(m); break; } catch (e) {
      if (e.code !== 'EEXIST') throw e;
      if (Date.now() - mtime(m) > GRACE) { const t = `${m}.stale-${process.pid}-${Date.now()}`; try { fs.renameSync(m, t); } catch {} rmrf(t); continue; }
      pause(3 + Math.random() * 7);
    }
  }
  try { return fn(); } finally { try { fs.rmdirSync(m); } catch {} }
}

function stale(d) {
  const pid = readPid(d);
  if (!Number.isInteger(pid) || pid <= 0) return Date.now() - mtime(d) > GRACE;   // pid file empty/corrupt: a freshly created one gets 10 seconds, after that it counts as stale
  if (!alive(pid)) return true;
  return Date.now() - (mtime(path.join(d, 'beat')) || mtime(d)) > STALE_AFTER;
}

export function tryTake(slots, free, minFree) {   // exported for tests only
  return withMutex(() => {
    let live = 0; const open = [];
    for (let i = 0; i < slots; i++) {
      const d = path.join(DIR, `slot${i}`);
      if (!fs.existsSync(d)) { open.push(d); continue; }
      if (stale(d)) { const t = `${d}.stale-${process.pid}-${Date.now()}`; try { fs.renameSync(d, t); } catch { live++; continue; } rmrf(t); open.push(d); } else live++;
    }
    if (!open.length) return null;
    if (live > 0 && free < minFree) return null;   // always lets one through when no render is running; the memory threshold only governs "start one more"
    const d = open[0]; fs.mkdirSync(d);
    fs.writeFileSync(path.join(d, 'pid'), String(process.pid)); fs.writeFileSync(path.join(d, 'beat'), '');
    return d;
  });
}

// Default 2 slots (a 6 GB GPU holds two headless Chromium renders); RENDER_SLOTS=0 means no limit. One slot per process: calling it again returns the same release.
let held = null;
export function acquire(opts = {}) { return held ??= acquireSlot(opts); }
export async function withSlot(fn, opts) { await acquire(opts); return fn(); }   // the slot is released at process exit
function holders(slots) {
  const pids = [];
  for (let i = 0; i < slots; i++) { const p = readPid(path.join(DIR, `slot${i}`)); if (Number.isInteger(p) && p > 0) pids.push(p); }
  return pids;
}
async function acquireSlot({ slots, minFree } = {}) {
  if (process.env.RENDER_SLOT_HELD === '1') return () => {};
  slots ??= envNum('RENDER_SLOTS', 2, n => Number.isInteger(n) && n >= 0 && n <= 256);
  if (slots === 0) return () => {};   // opt-out: no limit
  minFree ??= envNum('RENDER_MIN_FREE', 30, n => Number.isFinite(n) && n >= 0 && n <= 100);
  fs.mkdirSync(DIR, { recursive: true });
  let told = false;
  for (;;) {
    const d = tryTake(slots, freePct(), minFree);
    if (d) {
      const timer = setInterval(() => { try { const n = new Date(); fs.utimesSync(path.join(d, 'beat'), n, n); } catch {} }, BEAT_EVERY); timer.unref();
      let done = false;
      const release = () => {
        if (done) return; done = true; clearInterval(timer);
        if (readPid(d) === process.pid) { const t = `${d}.rel-${process.pid}-${Date.now()}`; try { fs.renameSync(d, t); rmrf(t); } catch { rmrf(d); } }   // delete only our own (after a takeover, leave the other owner's alone)
      };
      process.on('exit', release);
      return release;
    }
    if (!told) { told = true; const p = holders(slots); console.error(`[slot] waiting for a render slot (${p.length} in use: pids ${p.join(', ') || '?'})`); }
    await new Promise(r => setTimeout(r, 2000));
  }
}

const real = p => { try { return fs.realpathSync(p); } catch { return p; } };
if (process.argv[1] && real(process.argv[1]) === real(fileURLToPath(import.meta.url))) {
  const i = process.argv.indexOf('--'), cmd = i >= 0 ? process.argv.slice(i + 1) : [];
  if (!cmd.length) { console.error('usage: node core/render/slot.mjs -- <command…>'); process.exit(2); }
  const release = await acquire();
  const child = spawn(cmd[0], cmd.slice(1), { stdio: 'inherit', env: { ...process.env, RENDER_SLOT_HELD: '1' } });
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig));
  child.on('error', e => { console.error(`cannot run ${cmd[0]}: ${e.message}`); release(); process.exit(127); });
  child.on('exit', (code, sig) => { release(); process.exit(code ?? (sig ? 128 + (os.constants.signals[sig] || 1) : 0)); });
}
