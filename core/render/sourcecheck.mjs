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
import { fingerprintOf } from './sourcewatch.mjs';

const [dir, snapshotPath] = process.argv.slice(2);

export function diffFiles(before, now) {
  const diff = [];
  for (const k of Object.keys(now)) if (before[k] !== now[k]) diff.push(k);
  for (const k of Object.keys(before)) if (!(k in now)) diff.push(`${k} (removed)`);
  return diff;
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
    console.log('4 ca đều đúng');
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
  let before;
  try {
    before = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  } catch (e) {
    console.error(`cannot read the snapshot ${snapshotPath}: ${e.message}`);
    process.exit(2);
  }
  const diff = diffFiles(before, fingerprintOf(dir));
  if (!diff.length) {
    console.log('the movie was built from the code that is on disk now');
    process.exit(0);
  }
  console.log('the code moved on since the movie was built:');
  for (const f of diff) console.log(`  ${f}`);
  process.exit(1);
}
