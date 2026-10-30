// Source-level audit of a film's drawing code: node core/render/drawcheck.mjs <film-folder> [<film-folder> ...]
// The calling convention comes from the film's own helper, because `rect` means x0,y0,x1,y1 in some films and x,y,w,h in
//   others: the helper's parameter names decide what a call means. Never hardcode one convention.
// Corner mode (x0,y0,x1,y1): the helper swaps an inverted y, but it mirrors an inverted x silently — that is the bug this
//   tool is for (a codemod once rewrote path() into rect() and left 8 arguments in it).
// Size mode (x,y,w,h): the width and the height must be positive.
// Also: cel() with other than 3 arguments, path() with none.
// Only calls whose arguments are plain numbers are compared; anything else is left alone (no false alarms).
// Comments and string literals are not code: they are blanked before the scan.
// Exit code: 0 nothing found; 1 problems found; 2 usage.
import fs from 'fs'; import path from 'path';

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
function mask(src) {
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
      blank(i, j); i = j; prev = c; continue;
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
      helpers[name] = { name, params: parseParams(src.slice(open + 1, close)) };
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
      helpers[name] = { name, params: parseParams(src.slice(open + 1, close)) };
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

function checkFilm(folder) {
  const srcDir = path.join(folder, 'src');
  if (!fs.existsSync(srcDir)) { console.log(`drawcheck: no src/ in ${folder}; nothing to check`); return 0; }
  const files = jsFiles(srcDir).map(file => {
    const raw = fs.readFileSync(file, 'utf8');
    return { file, masked: mask(raw) };
  });
  const helpers = findHelpers(files);
  if (!helpers.rect) { console.log(`drawcheck: no rect helper in ${folder}; nothing to check`); return 0; }
  let n = 0;
  for (const f of files) {
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
