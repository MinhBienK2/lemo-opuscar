// Is the movie on disk built from the code that is on disk now?
//
// The mtimes cannot answer this. A file edited *before* the build and again *after* it ends up
// newer than the movie — and the movie still shows the old code. That is the silent shape of a
// stale film: every gate is green, the movie file has the newest timestamp, and the picture is
// from a version of the code that no longer exists.
//
// So the build writes a fingerprint of the code it started from, and this check compares it with
// the code on disk now.
//
//   node core/render/sourcecheck.mjs <episode-dir> <snapshot.json>
//   exit 0 — the snapshot matches the code now
//   exit 1 — the code moved on; the files that differ are listed
//   exit 2 — the check could not run (no snapshot, unreadable file)
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fingerprintOf, filmFingerprint } from './sourcewatch.mjs';
const [dir, snapshotPath] = process.argv.slice(2);

// Which snapshot describes the film on disk. The one written NEXT TO the film wins: the build's own
// snapshot (out/source-fingerprint.json) describes the code a build started from, so a build that was
// abandoned after writing it leaves a snapshot that says "the movie is current" about a film that
// was never made (M24).
function snapshotFor(dir, given) {
  const side = filmFingerprint(dir);
  if (side) return side;
  if (given && fs.existsSync(given)) return given;
  return given || '';
}

// The files that differ between the snapshot and the code now.
//
// A file the snapshot does not cover (an old snapshot, taken before the fingerprint learned to walk
// src/props/) cannot be compared by digest. For those, the file's own mtime against the moment the
// snapshot was taken is the only honest answer: a file touched after the snapshot moved on, a file
// that has not moved since did not.
export function diffFiles(before, now, opts = {}) {
  const { dir = '', at = 0 } = opts;
  const diff = [];
  for (const k of Object.keys(now)) {
    if (k in before) {
      if (before[k] !== now[k]) diff.push(k);
      continue;
    }
    if (!at || !dir) { diff.push(k); continue; }
    const p = path.join(dir, k);
    let m = 0;
    try { m = fs.statSync(p).mtimeMs; } catch (e) { /* gone between the two calls */ }
    if (m > at) diff.push(`${k} (đổi sau lần chụp vân tay; ảnh chụp cũ không phủ tệp này)`);
  }
  for (const k of Object.keys(before)) if (!(k in now)) diff.push(`${k} (removed)`);
  return diff;
}

function snapshotAt(snapshotPath) {
  try { return fs.statSync(snapshotPath).mtimeMs; } catch (e) { return 0; }
}

function selftest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sourcecheck-'));
  try {
    // a channel root with a rig, and an episode below it — the shape the library really has
    fs.writeFileSync(path.join(tmp, 'CHANNEL.md'), '# kênh\n');
    fs.mkdirSync(path.join(tmp, 'rig'));
    fs.writeFileSync(path.join(tmp, 'rig', 'render.js'), 'export const RIG = 1;\n');
    const ep = path.join(tmp, 'ep');
    fs.mkdirSync(ep);
    fs.mkdirSync(path.join(ep, 'src'));
    fs.mkdirSync(path.join(ep, 'voice'));
    fs.writeFileSync(path.join(ep, 'index.html'), '<html></html>\n');
    fs.writeFileSync(path.join(ep, 'voice', 'lines.json'), '[]\n');
    fs.writeFileSync(path.join(ep, 'src', 'film.js'), 'export const FILM = 1;\n');

    const snap = fingerprintOf(ep);
    const has = k => k in snap;
    assert(has('src/film.js'), 'vân tay phải có src/film.js');
    assert(has('rig/render.js'), 'vân tay phải có rig/render.js');
    console.log('ok   vân tay gồm cả mã tập lẫn rig của kênh');

    // nothing changed → the movie is current
    assert(diffFiles(snap, fingerprintOf(ep)).length === 0, 'không đổi gì thì không có khác biệt');
    console.log('ok   mã không đổi → phim là của mã hiện tại');

    // the episode's own file changed → the movie is stale
    fs.writeFileSync(path.join(ep, 'src', 'film.js'), 'export const FILM = 2;\n');
    let d = diffFiles(snap, fingerprintOf(ep));
    assert(d.length === 1 && d[0] === 'src/film.js', JSON.stringify(d));
    console.log('ok   sửa src/film.js → phim bị coi là cũ');

    // the shared rig changed → the movie is stale too (this is the half everyone forgets)
    fs.writeFileSync(path.join(tmp, 'rig', 'render.js'), 'export const RIG = 2;\n');
    d = diffFiles(snap, fingerprintOf(ep));
    assert(d.length === 2 && d.includes('rig/render.js'), JSON.stringify(d));
    console.log('ok   sửa rig/render.js (mã dùng chung) → phim cũng bị coi là cũ');

    // a file removed → also a difference
    fs.unlinkSync(path.join(ep, 'voice', 'lines.json'));
    d = diffFiles(snap, fingerprintOf(ep));
    assert(d.some(x => x.includes('removed')), JSON.stringify(d));
    console.log('ok   xoá một tệp nguồn → phim bị coi là cũ');

    // M24: a file BELOW src/ is part of the code. A channel keeps one file per prop in src/props/,
    // and a fingerprint that only reads the top of src/ sees none of them.
    fs.writeFileSync(path.join(ep, 'voice', 'lines.json'), '[]\n');
    fs.mkdirSync(path.join(ep, 'src', 'props'), { recursive: true });
    fs.writeFileSync(path.join(ep, 'src', 'props', 'bo-sac.js'), 'export const P = 1;\n');
    const snap2 = fingerprintOf(ep);
    assert('src/props/bo-sac.js' in snap2, 'vân tay phải có tệp trong src/props/');
    console.log('ok   vân tay có tệp trong src/props/');
    const snap3 = snap2;
    fs.writeFileSync(path.join(ep, 'src', 'props', 'bo-sac.js'), 'export const P = 2;\n');
    d = diffFiles(snap3, fingerprintOf(ep));
    assert(d.length === 1 && d[0] === 'src/props/bo-sac.js', JSON.stringify(d));
    console.log('ok   sửa một tệp trong src/props/ → phim bị coi là cũ');
    fs.unlinkSync(path.join(ep, 'src', 'props', 'bo-sac.js'));
    d = diffFiles(snap3, fingerprintOf(ep));
    assert(d.some(x => x.includes('removed')), JSON.stringify(d));
    console.log('ok   xoá một tệp trong src/props/ → phim bị coi là cũ');

    // M24: a snapshot that does not cover a file cannot compare it by digest. The file's mtime
    // against the moment the snapshot was taken is the honest answer for those.
    const old = { 'src/film.js': 'x' };
    const now = { 'src/film.js': 'x', 'src/props/a.js': 'y' };
    const at = Date.now();
    fs.writeFileSync(path.join(ep, 'src', 'props', 'a.js'), 'export const A = 1;\n');
    fs.utimesSync(path.join(ep, 'src', 'props', 'a.js'), (at - 60000) / 1000, (at - 60000) / 1000);
    d = diffFiles(old, now, { dir: ep, at });
    assert(d.length === 0, JSON.stringify(d));
    console.log('ok   tệp không có trong ảnh chụp cũ mà chưa bị đụng → không bị coi là cũ');
    fs.utimesSync(path.join(ep, 'src', 'props', 'a.js'), (at + 60000) / 1000, (at + 60000) / 1000);
    d = diffFiles(old, now, { dir: ep, at });
    assert(d.length === 1 && d[0].includes('src/props/a.js'), JSON.stringify(d));
    console.log('ok   tệp không có trong ảnh chụp cũ mà đã đổi sau đó → phim bị coi là cũ');

    // M24: the fingerprint next to the delivered film wins over the build's snapshot.
    fs.mkdirSync(path.join(ep, 'out'), { recursive: true });
    fs.writeFileSync(path.join(ep, 'phim.mp4'), 'x');
    const side = path.join(ep, 'phim.fingerprint.json');
    fs.writeFileSync(side, JSON.stringify(snap2));
    assert(filmFingerprint(ep) === side, 'vân tay cạnh phim là vân tay của phim');
    console.log('ok   vân tay cạnh chính phim được chọn');
    console.log('8 ca đều đúng');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function assert(cond, msg) {
  if (!cond) { console.error('SAI: ' + msg); process.exit(1); }
}

if (process.argv[1] && process.argv[1].endsWith('sourcecheck.mjs') && process.argv.includes('--selftest')) {
  selftest();
} else {
  if (!dir || !snapshotPath) {
    console.error('usage: node sourcecheck.mjs <episode-dir> <snapshot.json>');
    process.exit(2);
  }
  const snap = snapshotFor(dir, snapshotPath);
  if (!snap || !fs.existsSync(snap)) {
    console.error(`cannot read the snapshot ${snap}`);
    process.exit(2);
  }
  let before;
  try {
    before = JSON.parse(fs.readFileSync(snap, 'utf8'));
  } catch (e) {
    console.error(`cannot read the snapshot ${snap}: ${e.message}`);
    process.exit(2);
  }
  const diff = diffFiles(before, fingerprintOf(dir), { dir, at: snapshotAt(snap) });
  if (!diff.length) {
    console.log('the movie was built from the code that is on disk now');
    process.exit(0);
  }
  console.log('the code moved on since the movie was built:');
  for (const f of diff) console.log(`  ${f}`);
  process.exit(1);
}
