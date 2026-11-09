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

// every file of the film the picture is built from: the page, the episode's own code, the words
export function fingerprint(dir) {
  const files = [];
  const add = f => { if (fs.existsSync(f)) files.push(f); };
  for (const rel of SOURCES) add(path.join(dir, rel));
  const src = path.join(dir, 'src');
  if (fs.existsSync(src)) {
    for (const name of fs.readdirSync(src).sort()) {
      if (/\.(js|mjs|css|html)$/.test(name)) add(path.join(src, name));
    }
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
    for (const name of fs.readdirSync(rig).sort()) {
      if (!/\.(js|mjs)$/.test(name)) continue;
      const f = path.join(rig, name);
      out['rig/' + name] = crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
    }
  }
  return out;
}
