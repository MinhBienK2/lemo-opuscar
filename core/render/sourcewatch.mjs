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
