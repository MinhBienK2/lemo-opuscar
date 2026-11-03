// Scene self-check — does the picture stage the story, or is it a slide deck? node core/render/scenecheck.mjs <film> [--step 1] [--band 880] [--json out.json] [--report]
// Measures, never asks the page to declare:
//   text-led   frames where registered text (window.TEXTS, the subtitle band excluded) covers ≥ --card-cover of the screen,
//              or ≥ --card-boxes boxes are up at once: the frame is read, not watched (≤ 35 %)
//   words      frames where at least one thing is named on screen (a label, a sign, a number on an object): a picture with
//              no word at all for minutes does not explain itself (≥ 30 %)
//   looks      the picture cut into stretches by its colour histogram (a new place, light, framing), alike stretches merged (≥ 1 per 20 s)
//   numbers    numbers and years spoken in voice/lines.json (≤ 2 per 20 s)
//   sound      every foley event in window.EV against the picture: before (t − 0.2 s) and after (t + 0.25 s) its onset,
//              ≥ 0.4 % of a thumbnail must change — a sound with nothing moving under it is noise (≥ 80 %)
//   sparse     sound moments (sounds closer than 0.6 s merged) ≤ 30 a minute, and ≥ 15 % of the 3 s windows with no sound
//              effect at all: a sound on every gesture is Mickey-mousing, and it tires the ear
//   shots      the mean shot, from the shots declared in window.EV (e.shot) or the picture changes, ≤ 10 s
// Calibration: films/host-toon-test sits at 25 % text-led, 1.4 looks per 20 s, 26 sound moments a minute, 21 % quiet windows,
// 24 shots in 132 s; the channel's older episodes at 46–55 % and 0.5–0.9; the IKEA trial (skill v5) at 46 moments, 0 % quiet.
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
  // what moves when a sound plays: the picture just before against the picture just after (luma, thumbnail, subtitles cut off)
  const thumb = t => { window.render(Math.max(0, Math.min(window.DUR - .01, t))); sg.drawImage(cv, 0, 0, cv.width, cv.height * BAND / H, 0, 0, 48, 27);
    const d = sg.getImageData(0, 0, 48, 27).data, y = new Float32Array(48 * 27); for (let i = 0; i < y.length; i++) y[i] = .3 * d[4 * i] + .59 * d[4 * i + 1] + .11 * d[4 * i + 2]; return y; };
  const SK = new Set(['voice', 'music', 'amb', 'silence', 'duck', 'cut', 'mark', 'shot']);
  if (cv) for (const e of ev) {
    if (SK.has(e.type) || !Number.isFinite(e.t)) continue;
    const a = thumb(e.t - .2), b = thumb(e.t + .25); let m = 0, big = 0;
    for (let i = 0; i < a.length; i++) { const dd = Math.abs(a[i] - b[i]); m += dd; if (dd > 12) big++; }
    e.motion = m / a.length; e.moved = big / a.length;
  }
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
const SKIP = new Set(['voice', 'music', 'amb', 'silence', 'duck', 'cut', 'mark', 'shot']);
const fol = res.ev.filter(e => !SKIP.has(e.type) && Number.isFinite(e.t));
const near = fol.filter(e => onsets.some(o => Math.abs(o - e.t) <= SYNC)).length;
const lit = spans.filter(s => fol.some(e => e.t >= s.t0 - SYNC && e.t <= s.t1 + SYNC)).length;
// a sound with a cause: at least ~0.4 % of the thumbnail changes by more than 12 levels across the sound's onset
const MOVE = +opt('--moved', 0.004);
const caused = fol.filter(e => e.moved != null && e.moved >= MOVE).length, uncaused = fol.filter(e => e.moved != null && e.moved < MOVE);
const withText = F.filter(f => f.boxes > 0).length / F.length;
const shots = new Set(res.ev.map(e => e.shot).filter(Boolean)).size;
// sparse sound: moments (a sound within 0.6 s of the previous one is the same moment) and 3 s windows with none
const fts = fol.map(e => e.t).sort((a, b) => a - b), moments = fts.filter((t, i) => i === 0 || t - fts[i - 1] > .6).length;
const wins = []; for (let a = 0; a + 3 <= res.dur; a += 3) wins.push(fts.some(t => t >= a && t < a + 3));
const quiet = wins.length ? wins.filter(x => !x).length / wins.length : 1;
const meanShot = res.dur / Math.max(1, shots, segs.length);
// the host's share of the film, from the shot marks: desk or scene (true in older boards) is in the frame; pip and react comment
const marks = res.ev.filter(e => e.type === 'shot' && Number.isFinite(e.t)).sort((a, b) => a.t - b.t), hostT = {};
marks.forEach((e, i) => { const m = e.host === true ? 'desk' : e.host || 'none'; hostT[m] = (hostT[m] || 0) + ((marks[i + 1]?.t ?? res.dur) - e.t); });

const per20 = n => n / res.dur * 20;
const out = {
  film: dir, dur: +res.dur.toFixed(1), frames: F.length,
  cards: +cards.toFixed(3), looks: looks.length, looksPer20s: +per20(looks.length).toFixed(2), cuts: segs.length - 1, longestHold: longest,
  numbers, numbersPer20s: +per20(numbers).toFixed(2), foley: fol.length, foleyOnWord: fol.length ? +(near / fol.length).toFixed(3) : null,
  linesWithEvent: spans.length ? +(lit / spans.length).toFixed(3) : null, shotsDeclared: shots,
  soundOnMotion: fol.length ? +(caused / fol.length).toFixed(3) : null, framesWithWords: +withText.toFixed(3),
  momentsPerMin: +(moments / res.dur * 60).toFixed(1), quietWindows: +quiet.toFixed(3), meanShot: +meanShot.toFixed(1),
};
const checks = [
  ['text-led frames', out.cards <= 0.35, `${(out.cards * 100).toFixed(0)} % of frames are mostly text (≤ 35 %: a film, not a deck)`],
  ['frames with words', out.framesWithWords >= 0.3, `${(out.framesWithWords * 100).toFixed(0)} % of frames name something on screen — a label, a sign, a number on a thing (≥ 30 %: a picture that explains itself)`],
  ['looks', out.looksPer20s >= 1, `${out.looks} different looks, ${out.looksPer20s} per 20 s (≥ 1)`],
  ['numbers', out.numbersPer20s <= 2, `${numbers} numbers spoken, ${out.numbersPer20s} per 20 s (≤ 2; each must be a thing or a chart on screen)`],
  ['sound on motion', out.soundOnMotion != null && out.soundOnMotion >= 0.8, `${out.soundOnMotion == null ? 'no foley' : (out.soundOnMotion * 100).toFixed(0) + ' %'} of ${fol.length} sounds land on something that moves (≥ 80 %)` + (uncaused.length ? ` — silent picture under ${uncaused.slice(0, 6).map(e => e.type + '@' + e.t.toFixed(1)).join(', ')}` : '')],
  ['sound moments', out.momentsPerMin <= 30, `${out.momentsPerMin} sound moments a minute (≤ 30: sound marks what matters, not every gesture)`],
  ['quiet windows', out.quietWindows >= 0.15, `${(out.quietWindows * 100).toFixed(0)} % of 3 s windows carry no sound effect (≥ 15 %: the ear needs rests)`],
  ['shots', out.meanShot <= 10, `mean shot ${out.meanShot} s (${Math.max(shots, segs.length)} shots; ≤ 10 s: a new idea, a new shot)`],
];
if (!res.hasTexts) console.log('note: the page has no window.TEXTS — the card measure sees no text and is not meaningful');
for (const [k, ok, msg] of checks) console.log(`${ok ? 'OK ' : 'BAD'} ${k.padEnd(20)} ${msg}`);
console.log(`    ${out.linesWithEvent == null ? '' : (out.linesWithEvent * 100).toFixed(0) + ' % of lines carry a sound · '}${out.foleyOnWord == null ? '' : (out.foleyOnWord * 100).toFixed(0) + ' % of sounds within ' + SYNC + ' s of a word · '}longest hold on one look ${longest.toFixed(0)} s · ${out.cuts} picture changes · ${shots} shots declared in EV`
  + (marks.length ? ` · host ${Object.entries(hostT).map(([m, d]) => m + ' ' + (d / res.dur * 100).toFixed(0) + ' %').join(', ')}` : ''));
console.log(`    numbers heard: ${numList.slice(0, 30).join(' · ')}${numList.length > 30 ? ' …' : ''}`);
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify({ ...out, numList, checks: checks.map(([k, ok]) => ({ k, ok })) }, null, 1));
process.exit(REPORT ? 0 : checks.every(c => c[1]) ? 0 : 1);
