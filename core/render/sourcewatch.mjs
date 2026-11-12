// A check that runs on files that change under it measures a film that never existed.
//
// The picture of a film is read from the page, and the page is loaded from files on disk. An agent that
// is still editing the film while a check reads it produces a result about a mixture of two versions:
// the check passes, and the film it graded is not the film that ships; or it fails, and the agent goes
// hunting for a defect that is not there.
//
// So a check takes a fingerprint of the film's sources before it opens the page and compares it when it
// closes: if a file changed while the check ran, the result is void, and the check says so instead of
// reporting a verdict.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SOURCES = ['index.html', 'voice/lines.json'];
const CODE = /\.(js|mjs|css|html)$/;

// Every code file under a directory, recursively.
//
// A shallow scan misses everything below the first level: this channel keeps one file per prop in
// src/props/, so a fingerprint that only reads src/ sees none of the drawing code — and the
// freshness check then says "the movie was built from the code that is on disk now" after every
// prop was rewritten (M24).
function walk(dir) {
  const out = [];
  let names;
  try { names = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return out; }
  for (const d of names.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) {
      for (const rel of walk(p)) out.push(path.join(d.name, rel));
    } else if (CODE.test(d.name)) {
      out.push(d.name);
    }
  }
  return out;
}

// every file of the film the picture is built from: the page, the episode's own code, the words
export function fingerprint(dir) {
  const files = [];
  const add = f => { if (fs.existsSync(f)) files.push(f); };
  for (const rel of SOURCES) add(path.join(dir, rel));
  const src = path.join(dir, 'src');
  if (fs.existsSync(src)) {
    for (const rel of walk(src)) add(path.join(src, rel));
  }
  const out = {};
  for (const f of files) {
    out[path.relative(dir, f)] = crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
  }
  return out;
}

// the files that changed since the fingerprint was taken
export function changed(dir, snapshot) {
  const now = fingerprint(dir), out = [];
  for (const k of Object.keys(now)) if (snapshot[k] !== now[k]) out.push(k);
  for (const k of Object.keys(snapshot)) if (!(k in now)) out.push(`${k} (removed)`);
  return out;
}

// the channel's shared rig is part of the film's code: the episode's own src/ is only half of it.
// A rig file that changes after the frames were rendered makes the film just as stale as a changed
// episode file does — and the episode file is the one everyone thinks of.
export function rigDir(dir) {
  let d = path.dirname(path.resolve(dir));
  while (d && d !== '/') {
    if (fs.existsSync(path.join(d, 'CHANNEL.md'))) return path.join(d, 'rig');
    d = path.dirname(d);
  }
  return '';
}

// the fingerprint of everything the film is built from: the episode's own files and the channel's rig
export function fingerprintOf(dir) {
  const out = fingerprint(dir);
  const rig = rigDir(dir);
  if (rig && fs.existsSync(rig)) {
    for (const rel of walk(rig)) {
      const f = path.join(rig, rel);
      out['rig/' + rel] = crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
    }
  }
  return out;
}

// the film that was delivered: the newest movie in the episode folder; only if the folder holds no
// movie at all, the newest in its out/ (an intermediate of a build in flight is not a delivery)
export function deliveredFilm(dir) {
  let best = '';
  for (const p of listMp4(dir)) {
    if (!best || mtime(p) > mtime(best)) best = p;
  }
  return best;
}

// the fingerprint that belongs to the delivered film: the one written next to it when the film was
// delivered. The build's own snapshot (out/source-fingerprint.json) describes the code a build
// STARTED from — a build that was abandoned after writing it leaves a snapshot that describes a
// film nobody has (M24).
export function filmFingerprint(dir) {
  const film = deliveredFilm(dir);
  if (!film) return '';
  const base = path.basename(film, path.extname(film));
  const side = path.join(dir, base + '.fingerprint.json');
  if (fs.existsSync(side)) return side;
  return '';
}

function listMp4(dir) {
  const root = [];
  for (const sub of ['', 'out']) {
    const d = path.join(dir, sub);
    let names;
    try { names = fs.readdirSync(d); } catch (e) { continue; }
    for (const n of names) {
      const p = path.join(d, n);
      if (!n.endsWith('.mp4')) continue;
      try { if (fs.statSync(p).isFile()) root.push(p); } catch (e) { /* raced away */ }
    }
  }
  // the delivered film lives in the episode folder; out/ holds the intermediates of a build in flight
  const delivered = root.filter(p => path.dirname(p) === path.resolve(dir));
  return delivered.length ? delivered : root;
}

function mtime(p) {
  try { return fs.statSync(p).mtimeMs; } catch (e) { return 0; }
}
