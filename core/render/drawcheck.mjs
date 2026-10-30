// Source-level audit of a film's drawing code: node core/render/drawcheck.mjs <film-folder> [<film-folder> ...]
// The calling convention comes from the film's own helper, because `rect` means x0,y0,x1,y1 in some films and x,y,w,h in
//   others: the helper's parameter names decide what a call means. Never hardcode one convention.
// Corner mode (x0,y0,x1,y1): the helper swaps an inverted y, but it mirrors an inverted x silently — that is the bug this
//   tool is for (a codemod once rewrote path() into rect() and left 8 arguments in it).
// Size mode (x,y,w,h): the width and the height must be positive.
// Also: cel() with other than 3 arguments, path() with none.
// Only calls whose arguments are plain numbers are compared; anything else is left alone (no false alarms).
// Comments and string literals are not code: they are blanked before the scan.
// The helper's definition is looked for in the film's own source AND in the files that source imports by a relative
// path: an episode's helpers live in the channel's rig, which the episode imports as '../../rig/cel.js'. When both
// the film and an imported file define a helper, the film's own wins.
// A folder without src/, and a film whose source and imports hold no helper at all, cannot be audited: the check
// says what it could not check and fails. A gate that cannot fail is decoration.
// Exit code: 0 nothing found; 1 problems found (or a folder that could not be checked); 2 usage.
import fs from 'fs'; import path from 'path';
import { REPO_ROOT } from './films.mjs';

const args = process.argv.slice(2);
if (!args.length) { console.error('usage: node core/render/drawcheck.mjs <film-folder> [<film-folder> ...]'); process.exit(2); }

// --- a number written out in the source ------------------------------------
const NUMERIC = /^[0-9+\-*/%().\s]+$/;

function numValue(text) {
  if (!text || !NUMERIC.test(text)) return null;
  const s = text, n = s.length;
  let i = 0;
  const ws = () => { while (i < n && /\s/.test(s[i])) i++; };
  const expr = () => { let v = term(); for (;;) { ws(); if (s[i] === '+') { i++; v += term(); } else if (s[i] === '-') { i++; v -= term(); } else return v; } };
  const term = () => { let v = factor(); for (;;) { ws(); if (s[i] === '*') { i++; v *= factor(); } else if (s[i] === '/') { i++; v /= factor(); } else if (s[i] === '%') { i++; v %= factor(); } else return v; } };
  const factor = () => {
    ws();
    if (s[i] === '+') { i++; return factor(); }
    if (s[i] === '-') { i++; return -factor(); }
    if (s[i] === '(') { i++; const v = expr(); ws(); if (s[i] !== ')') throw new Error('paren'); i++; return v; }
    const m = /^\d*\.?\d+(?:[eE][+-]?\d+)?/.exec(s.slice(i));
    if (!m) throw new Error('number');
    i += m[0].length;
    return parseFloat(m[0]);
  };
  try { const v = expr(); ws(); return i === n && Number.isFinite(v) ? v : null; } catch { return null; }
}

// --- the source, without its comments and strings ----------------------------
// keepStrings: the import specifiers live in strings, so the scan of the imports asks for them back
function mask(src, keepStrings) {
  const out = src.split('');
  const blank = (a, b) => { for (let k = a; k < b; k++) if (out[k] !== '\n') out[k] = ' '; };
  let i = 0, prev = '';
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { const j = src.indexOf('\n', i); const e = j < 0 ? src.length : j; blank(i, e); i = e; prev = 'x'; continue; }
    if (c === '/' && d === '*') { const j = src.indexOf('*/', i + 2); const e = j < 0 ? src.length : j + 2; blank(i, e); i = e; prev = 'x'; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < src.length) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === c) { j++; break; }
        if (c === '`' && src[j] === '\n') break;
        j++;
      }
      if (!keepStrings) blank(i, j);
      i = j; prev = c; continue;
    }
    if (c === '/' && (prev === '' || '(,=:[!&|?{};+-*%~^<>'.includes(prev))) {   // a regex literal, not a division
      let j = i + 1, cls = false;
      while (j < src.length) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === '[') cls = true;
        else if (src[j] === ']') cls = false;
        else if (src[j] === '/' && !cls) { j++; break; }
        else if (src[j] === '\n') break;
        j++;
      }
      blank(i, j); i = j; prev = 'x'; continue;
    }
    if (!/\s/.test(c)) prev = c;
    i++;
  }
  return out.join('');
}

// --- the film's helpers ------------------------------------------------------
function matchParen(src, open) {          // the index of the ')' that closes the '(' at open
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '(') depth++;
    else if (src[i] === ')' && --depth === 0) return i;
  }
  return -1;
}

function splitTop(text) {                 // split on the commas that are not inside brackets
  const parts = []; let depth = 0, cur = '';
  for (const c of text) {
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    if (c === ',' && depth === 0) { parts.push(cur); cur = ''; continue; }
    cur += c;
  }
  parts.push(cur);
  return parts;
}

function topEquals(text) {                // the index of the '=' that is not inside brackets, -1 when there is none
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    else if (c === '=' && depth === 0 && text[i + 1] !== '=' && text[i - 1] !== '=' && text[i - 1] !== '!' && text[i - 1] !== '<' && text[i - 1] !== '>') return i;
  }
  return -1;
}

function parseParams(text) {
  return splitTop(text).map(p => {
    const t = p.trim(), eq = topEquals(t);
    const name = (eq < 0 ? t : t.slice(0, eq)).trim();
    return { name: /^[\w$]+/.exec(name)?.[0] ?? '', optional: eq >= 0 };
  });
}

// a definition is `function rect(...)`, `const rect = (...) =>` or `const rect = function (...)`
const DEF_ASSIGN = /(?:^|[^\w$.])(?:export\s+)?(?:const|let|var)\s+(rect|cel|path)\s*=\s*(?:async\s*)?(?:function\s*)?\(/g;
const CALL = /(?<![\w$.])(rect|cel|path)\s*\(/g;

function findHelpers(files) {
  const helpers = {};
  for (const f of files) {
    const src = f.masked;
    // const rect = (x0, y0, x1, y1) => ...
    DEF_ASSIGN.lastIndex = 0;
    for (let m; (m = DEF_ASSIGN.exec(src));) {
      const open = m.index + m[0].length - 1, close = matchParen(src, open);
      if (close < 0) continue;
      const name = m[1];
      if (helpers[name]) continue;
      helpers[name] = { name, params: parseParams(src.slice(open + 1, close)), file: f.file };
    }
    // function rect(x, y, w, h) { ... }
    CALL.lastIndex = 0;
    for (let m; (m = CALL.exec(src));) {
      const before = src.slice(Math.max(0, m.index - 40), m.index);
      if (!/\bfunction\s*$/.test(before)) continue;
      const open = m.index + m[0].length - 1, close = matchParen(src, open);
      if (close < 0) continue;
      const name = m[1];
      if (helpers[name]) continue;
      helpers[name] = { name, params: parseParams(src.slice(open + 1, close)), file: f.file };
    }
  }
  return helpers;
}

function lineOf(src, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (src[i] === '\n') line++;
  return line;
}

// --- the calls ---------------------------------------------------------------
function callArgs(src, open) {            // the arguments of the call whose '(' is at open
  const close = matchParen(src, open);
  if (close < 0) return null;
  const parts = splitTop(src.slice(open + 1, close)).map(s => s.trim());
  if (parts.length === 1 && parts[0] === '') return [];
  if (parts.length && parts[parts.length - 1] === '') parts.pop();
  return parts;
}

function checkCall(name, args, helper, problems) {
  if (!helper) return;
  const total = helper.params.length, need = helper.params.filter(p => !p.optional).length;
  if (args.length > total) { problems.push(`${name}() called with ${args.length} arguments; the helper takes ${total}`); return; }
  if (args.length < need) { problems.push(`${name}() called with ${args.length} arguments; the helper needs ${need}`); return; }
  if (name !== 'rect') return;
  const p = helper.params;
  const wi = p.findIndex(x => /^(w|wd|ww|width)$/i.test(x.name)), hi = p.findIndex(x => /^(h|ht|hh|height)$/i.test(x.name));
  if (wi >= 0 || hi >= 0) {                                   // size mode: x, y, w, h
    if (wi >= 0) {
      const w = numValue(args[wi]);
      if (w !== null && w <= 0) problems.push(`rect() has a width of ${w}; it must be positive`);
    }
    if (hi >= 0) {
      const h = numValue(args[hi]);
      if (h !== null && h <= 0) problems.push(`rect() has a height of ${h}; it must be positive`);
    }
    return;
  }
  const xs = p.map((x, i) => /x/i.test(x.name) ? i : -1).filter(i => i >= 0);   // corner mode: x0, y0, x1, y1
  if (xs.length < 2) return;
  const x0 = numValue(args[xs[0]]), x1 = numValue(args[xs[1]]);
  if (x0 !== null && x1 !== null && x0 > x1) problems.push(`rect() has inverted x corners (${args[xs[0]]} > ${args[xs[1]]}); the helper mirrors them silently`);
  // an inverted y is fine: the helper swaps it. Only plain numbers can be compared, and then it needs no correction.
}

// --- the films ---------------------------------------------------------------
function jsFiles(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir).sort()) {
    if (name === 'node_modules') continue;
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      for (const sub of fs.readdirSync(p).sort()) if (sub.endsWith('.js')) out.push(path.join(p, sub));
    } else if (name.endsWith('.js')) out.push(p);
  }
  return out;
}

const CEL = { name: 'cel', params: [{ name: 'g' }, { name: 'pts' }, { name: 'o' }] };   // the helper of the library
const PATH = { name: 'path', params: [{ name: 'pts' }] };
const FILLTEXT = /(?<![\w$])fillText\s*\(/g;        // a raw canvas call: the reading check cannot see that string

// --- the files in scope ------------------------------------------------------
// An import specifier: `from './x.js'`, `import './x.js'`, `import('./x.js')`
const SPECIFIER = /\b(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g;

// The files a file imports: the relative ones. An absolute import is the library's, not the film's convention,
// so it is left out of the scan.
function imports(file, raw) {
  const out = [];
  const code = mask(raw, true);        // the comments are blanked, the strings are kept
  SPECIFIER.lastIndex = 0;
  for (let m; (m = SPECIFIER.exec(code));) {
    const spec = m[1];
    if (!spec.startsWith('.')) continue;
    const target = path.resolve(path.dirname(file), spec);
    if (!target.endsWith('.js')) continue;
    if (!fs.existsSync(target)) continue;
    out.push(target);
  }
  return out;
}

// The film's own source, and the files it imports. An episode's helpers live in the channel's rig, which the
// episode imports by a relative path, so the definitions are looked for there too. The film's own source comes
// first: when both the film and an imported file define a helper, the film's own wins.
function scope(own) {
  const seen = new Set(own);
  const imported = [];
  const queue = [...own];
  while (queue.length) {
    const file = queue.shift();
    let raw;
    try { raw = fs.readFileSync(file, 'utf8'); } catch { continue; }
    for (const dep of imports(file, raw)) {
      if (seen.has(dep)) continue;
      seen.add(dep);
      imported.push(dep);
      queue.push(dep);
    }
  }
  return { own, imported };
}

// where a file is, for the message: inside the repository, its path from the root; otherwise, from the film
function where(folder, file) {
  const rel = path.relative(REPO_ROOT, file);
  if (rel && !rel.startsWith('..')) return rel;
  return path.relative(folder, file) || path.basename(file);
}

// In the file that draws the shots, every visible string has to go through text(): only text() registers the box
// the reading check measures. A raw fillText() is a string no check can see.
function checkRawText(files) {
  const shot = files.find(f => /window\.render\s*=/.test(f.masked));
  if (!shot) return [];
  const out = [];
  FILLTEXT.lastIndex = 0;
  for (let m; (m = FILLTEXT.exec(shot.masked));)
    out.push(`${shot.file}:${lineOf(shot.masked, m.index)} raw fillText(): the reading check cannot see this string; draw it with text()`);
  return out;
}

function checkFilm(folder) {
  const srcDir = path.join(folder, 'src');
  let hasSrc = false;
  try { hasSrc = fs.statSync(srcDir).isDirectory(); } catch { hasSrc = false; }
  // a folder without src/ cannot be audited: a gate that cannot check is not a pass, so this is a failure
  if (!hasSrc) { console.log(`drawcheck: could not check ${folder}: no src/ — the drawing code was not audited`); return 1; }
  const read = file => { try { return fs.readFileSync(file, 'utf8'); } catch { return ''; } };
  const { own, imported } = scope(jsFiles(srcDir));
  const ownFiles = own.map(file => ({ file, masked: mask(read(file)) }));
  const importedFiles = imported.map(file => ({ file, masked: mask(read(file)) }));
  const helpers = findHelpers([...ownFiles, ...importedFiles]);
  let n = 0;
  // the strings the reading check cannot see
  for (const reason of checkRawText(ownFiles)) { n++; console.log(reason); }
  if (!helpers.rect) {
    // a film without a rect helper is not audited by the rect rule, but cel() and path() still are: the check
    // keeps going, and says what it could not check, so a silent pass never reads as an audit.
    if (helpers.cel || helpers.path) {
      console.log(`drawcheck: no rect helper in ${folder} — the rect rule does not apply; cel() and path() are checked`);
    } else {
      // no helper at all, in the film or in the files it imports: nothing was audited
      console.log(`drawcheck: could not check ${folder}: no helper in the film's source or in the files it imports — nothing was audited`);
      return 1;
    }
  } else if (!ownFiles.some(f => f.file === helpers.rect.file)) {
    // the helper is in a file the film imports: the channel's rig
    console.log(`drawcheck: the rect helper comes from ${where(folder, helpers.rect.file)} (imported by the film) — the rect rule applies`);
  }
  for (const f of ownFiles) {
    CALL.lastIndex = 0;
    for (let m; (m = CALL.exec(f.masked));) {
      const name = m[1], open = m.index + m[0].length - 1;
      const before = f.masked.slice(Math.max(0, m.index - 40), m.index);
      if (/\bfunction\s*$/.test(before)) continue;            // the helper's own definition
      const args = callArgs(f.masked, open);
      if (!args) continue;
      const problems = [];
      checkCall(name, args, helpers[name] ?? (name === 'cel' ? CEL : name === 'path' ? PATH : null), problems);
      for (const reason of problems) { n++; console.log(`${f.file}:${lineOf(f.masked, m.index)} ${reason}`); }
    }
  }
  console.log(n ? `drawcheck: ${n} problem(s) in ${folder}` : `drawcheck: OK ${folder}`);
  return n;
}

let problems = 0;
for (const folder of args) problems += checkFilm(folder);
process.exit(problems ? 1 : 0);
