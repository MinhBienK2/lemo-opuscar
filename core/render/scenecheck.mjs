// Scene self-check — does the picture stage the story, or is it a slide deck? node core/render/scenecheck.mjs <film> [--step 1] [--band 880] [--json out.json] [--report]
// Measures, never asks the page to declare:
//   cards    — frames where registered text (window.TEXTS, the subtitle band excluded) covers ≥ --card-cover of the screen,
//              or where ≥ --card-boxes text boxes are up at once: the frame is read, not watched
//   looks    — the picture is cut into stretches by its colour histogram (a new place, a new light, a new framing);
//              stretches that look alike are merged, so "looks" counts the different pictures the film shows
//   numbers  — numbers and years spoken in voice/lines.json (digits, or a run of Vietnamese number words)
//   sync     — the foley in window.EV (voice, music, ambience excluded) against word onsets in voice/words.json:
//              share of events within --sync s of a spoken word, and share of lines that get at least one event
// Thresholds (a first calibration on films/host-toon-test — cards 25 %, 1.4 looks per 20 s — against channel episodes at 46–55 % and 0.5–0.9):
//   cards ≤ 25 % of frames · ≥ 1 look per 20 s · ≤ 2 spoken numbers per 20 s · ≥ 60 % of foley within 0.3 s of a word · ≥ 80 % of lines with an event
// Exit code: 0 all pass; 1 some fail; 2 the check couldn't run. --report prints the numbers and always exits 0 (for comparing films).
import fs from 'fs'; import path from 'path';
import { openDemo, closeServer, requireDemo, takeSize } from './page.mjs';
const args = process.argv.slice(2), { w: VW, h: VH } = takeSize(args), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const dir = args[0]; requireDemo(dir);
const STEP = +opt('--step', 1), BAND = +opt('--band', 880), COVER = +opt('--card-cover', 0.12), BOXES = +opt('--card-boxes', 5);
const SYNC = +opt('--sync', 0.3), REPORT = args.includes('--report'), JSON_OUT = opt('--json', '');
const { browser, page } = await openDemo(dir, { w: VW, h: VH });
const res = await page.evaluate(({ STEP, BAND }) => {
  if (!(window.DUR > 0)) return { noDur: true };
  const W = innerWidth, H = innerHeight, cv = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0];
  const sm = document.createElement('canvas'); sm.width = 48; sm.height = 27; const sg = sm.getContext('2d', { willReadFrequently: true });
  const GX = 96, GY = 54, frames = [];
  for (let t = STEP / 2; t < window.DUR; t += STEP) {
    window.render(t);
    // text cover: the union of the text boxes on a coarse grid, the subtitle band left out
    const grid = new Uint8Array(GX * GY); let boxes = 0;
    for (const b of (typeof window.TEXTS === 'function' && window.TEXTS(t)) || []) {
      const y1 = Math.min(b.y1, BAND); if (!(b.x1 > b.x0 && y1 > b.y0)) continue; boxes++;
      for (let gy = Math.max(0, Math.floor(b.y0 / H * GY)); gy < Math.min(GY, Math.ceil(y1 / H * GY)); gy++)
        for (let gx = Math.max(0, Math.floor(b.x0 / W * GX)); gx < Math.min(GX, Math.ceil(b.x1 / W * GX)); gx++) grid[gy * GX + gx] = 1;
    }
    let cover = 0; for (const v of grid) cover += v;
    // the picture: a 4×4×4 colour histogram of a thumbnail, the subtitle band cut off
    const hist = new Array(64).fill(0);
    if (cv) {
      sg.drawImage(cv, 0, 0, cv.width, cv.height * BAND / H, 0, 0, 48, 27);
      const d = sg.getImageData(0, 0, 48, 27).data;
      for (let i = 0; i < d.length; i += 4) hist[(d[i] >> 6) * 16 + (d[i + 1] >> 6) * 4 + (d[i + 2] >> 6)]++;
      const n = d.length / 4; for (let k = 0; k < 64; k++) hist[k] /= n;
    }
    frames.push({ t, cover: cover / (GX * GY * BAND / H), boxes, hist });
  }
  const ev = (window.EV || []).map(e => ({ t: e.t, type: e.type, id: e.id, shot: e.shot }));
  return { dur: window.DUR, frames, ev, hasTexts: typeof window.TEXTS === 'function', hasCanvas: !!cv };
}, { STEP, BAND });
await browser.close(); closeServer();
if (res.noDur) { console.error('scenecheck: NOT CHECKED — window.DUR is not a positive number.'); process.exit(2); }

// cards
const F = res.frames, isCard = f => f.cover >= COVER || f.boxes >= BOXES;
const cards = F.filter(isCard).length / F.length;
// looks: cut where the histogram jumps, then merge stretches whose mean histograms are close
const dist = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0) / 2;   // total variation, 0..1
const CUT = 0.35, SAME = 0.25, segs = [];
for (const f of F) {
  const s = segs.at(-1);
  if (s && dist(s.last, f.hist) < CUT) { s.n++; s.last = f.hist; s.sum = s.sum.map((v, i) => v + f.hist[i]); s.t1 = f.t; }
  else segs.push({ t0: f.t, t1: f.t, n: 1, last: f.hist, sum: f.hist.slice() });
}
const looks = [];
for (const s of segs) {
  const m = s.sum.map(v => v / s.n), L = looks.find(l => dist(l.m, m) < SAME);
  if (L) { L.dur += s.n * STEP; L.segs++; } else looks.push({ m, dur: s.n * STEP, segs: 1, t0: s.t0 });
}
const longest = Math.max(...segs.map(s => s.n * STEP));
// numbers spoken
const lp = path.join(dir, 'voice/lines.json'), wp = path.join(dir, 'voice/words.json');
const lines = fs.existsSync(lp) ? JSON.parse(fs.readFileSync(lp, 'utf8')) : [];
const NUM = new Set('không một hai ba bốn năm sáu bảy tám chín mười mươi trăm nghìn ngàn triệu tỷ tỉ linh lẻ rưỡi mốt tư lăm'.split(' '));
const BIG = new Set('mươi trăm nghìn ngàn triệu tỷ tỉ linh lẻ'.split(' '));
let numbers = 0; const numList = [];
for (const l of lines) {
  const toks = String(l.text || '').toLowerCase().replace(/[^\p{L}\p{N}%]+/gu, ' ').split(' ').filter(Boolean);
  for (let i = 0; i < toks.length;) {
    if (/\d/.test(toks[i])) { numbers++; numList.push(toks[i]); i++; continue; }
    let j = i; while (j < toks.length && NUM.has(toks[j])) j++;
    const run = toks.slice(i, j);
    // a run counts when it is a real figure: a big unit in it, "phần trăm" after it, or a lone digit word that isn't the article "một"/"năm" (year)
    const pct = toks[j] === 'phần' && toks[j + 1] === 'trăm';
    if (run.length && (run.some(w => BIG.has(w)) || pct || run.length >= 2)) { numbers++; numList.push(run.join(' ') + (pct ? ' phần trăm' : '')); }
    i = j > i ? j + (pct ? 2 : 0) : i + 1;
  }
}
// sync: foley events against word onsets
const words = fs.existsSync(wp) ? JSON.parse(fs.readFileSync(wp, 'utf8')) : {};
const vstart = {}; for (const e of res.ev) if (e.type === 'voice' && e.id != null && !(e.id in vstart)) vstart[e.id] = e.t;
const onsets = [], spans = [];
for (const id in vstart) {
  const ws = words[id]; if (!Array.isArray(ws) || !ws.length) continue;
  for (const w of ws) onsets.push(vstart[id] + Math.max(0, w.t0));
  spans.push({ id, t0: vstart[id], t1: vstart[id] + ws.at(-1).t1 });
}
const SKIP = new Set(['voice', 'music', 'amb', 'silence', 'duck']);
const fol = res.ev.filter(e => !SKIP.has(e.type) && Number.isFinite(e.t));
const near = fol.filter(e => onsets.some(o => Math.abs(o - e.t) <= SYNC)).length;
const lit = spans.filter(s => fol.some(e => e.t >= s.t0 - SYNC && e.t <= s.t1 + SYNC)).length;
const shots = new Set(res.ev.map(e => e.shot).filter(Boolean)).size;

const per20 = n => n / res.dur * 20;
const out = {
  film: dir, dur: +res.dur.toFixed(1), frames: F.length,
  cards: +cards.toFixed(3), looks: looks.length, looksPer20s: +per20(looks.length).toFixed(2), cuts: segs.length - 1, longestHold: longest,
  numbers, numbersPer20s: +per20(numbers).toFixed(2), foley: fol.length, foleyOnWord: fol.length ? +(near / fol.length).toFixed(3) : null,
  linesWithEvent: spans.length ? +(lit / spans.length).toFixed(3) : null, shotsDeclared: shots,
};
const checks = [
  ['cards', out.cards <= 0.25, `${(out.cards * 100).toFixed(0)} % of frames are text-led (≤ 25 %)`],
  ['looks', out.looksPer20s >= 1, `${out.looks} different looks, ${out.looksPer20s} per 20 s (≥ 1)`],
  ['numbers', out.numbersPer20s <= 2, `${numbers} numbers spoken, ${out.numbersPer20s} per 20 s (≤ 2; each must be a thing on screen, not a card)`],
  ['foley on words', out.foleyOnWord != null && out.foleyOnWord >= 0.6, `${out.foleyOnWord == null ? 'no foley or no words.json' : (out.foleyOnWord * 100).toFixed(0) + ' %'} of ${fol.length} foley events within ${SYNC} s of a word (≥ 60 %)`],
  ['lines with an event', out.linesWithEvent != null && out.linesWithEvent >= 0.8, `${out.linesWithEvent == null ? 'no words.json' : (out.linesWithEvent * 100).toFixed(0) + ' %'} of ${spans.length} lines get a foley event (≥ 80 %)`],
];
if (!res.hasTexts) console.log('note: the page has no window.TEXTS — the card measure sees no text and is not meaningful');
for (const [k, ok, msg] of checks) console.log(`${ok ? 'OK ' : 'BAD'} ${k.padEnd(20)} ${msg}`);
console.log(`    longest hold on one look ${longest.toFixed(0)} s · ${out.cuts} picture changes · ${shots} shots declared in EV`);
console.log(`    numbers heard: ${numList.slice(0, 30).join(' · ')}${numList.length > 30 ? ' …' : ''}`);
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify({ ...out, numList, checks: checks.map(([k, ok]) => ({ k, ok })) }, null, 1));
process.exit(REPORT ? 0 : checks.every(c => c[1]) ? 0 : 1);
