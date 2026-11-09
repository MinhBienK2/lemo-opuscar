// Reading-time self-check: node core/render/readcheck.mjs <demo> [--q 'k=v'] [--step 0.04] [--latin-cps 15] [--cjk-cps 4.5] [--pad 1.5] [--min 1.5] [--band 0] [--size 1920x1080] [--overlap]
// Page contract: window.TEXTS(t) → [{id, text, x0, y0, x1, y1}]: every piece of text visible on screen at t seconds and its screen box (pixels, viewport the same as --size, default 1920×1080).
//   A film whose TEXTS(t) draws the frame itself (window.render(t) before returning the boxes) is read one draw per frame; a film whose TEXTS only reads is read the same way.
//   id identifies "this block of text" (a number or a string); if the text under the same id changes, it counts as a new piece and timing restarts. Don't report the subtitle bar: its hold is set by the .srt.
// --band N: also report every text whose box reaches below y=N — the subtitle band. The subtitles themselves are drawn with a raw
//   fillText() and are not registered, so they never appear in this list; anything else down there lands under the words.
//   text must be the block's [complete text] from the first frame it appears: if a typewriter effect reports "the substring typed so far", every extra character is a new piece and the whole check fails —
//   for typewriter text, always report the full text in TEXTS and leave "which characters are shown yet" to the picture itself.
// Rule (same as DIRECTOR.md §7): from the moment a piece of text first fully enters the frame, the time it stays fully in frame continuously, and still in TEXTS, must be ≥
//   (number of hanzi/kana/hangul ÷ cjk-cps + number of other non-whitespace characters ÷ latin-cps) + pad seconds, and no less than min. Defaults 4.5 chars/s (CJK), 15 chars/s (alphanumeric), pad 1.5, min 1.5.
//   Text that never fully enters the frame (cropped at the edge, a ticker running out of frame) is reported as "never fully visible".
// --overlap: also report two pieces of text that sit on top of each other — the viewer reads neither. The rule and its
//   thresholds live in core/render/overlap.mjs, so the picture round and this gate measure the same thing.
// Exit code: 0 all pass; 1 some fail; 2 the check couldn't run (the page has no window.TEXTS, or the whole film never returned any text) — this does not count as a pass.
import { openDemo, closeServer, requireDemo, takeSize } from './page.mjs';
import { fingerprint, changed } from './sourcewatch.mjs';
import { overlapping, describe } from './overlap.mjs';
const args = process.argv.slice(2), { w: VW, h: VH } = takeSize(args), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const dir = args[0]; requireDemo(dir);
const Q = opt('--q', ''), STEP = +opt('--step', 0.04), LATIN = +opt('--latin-cps', 15), CJK = +opt('--cjk-cps', 4.5), PAD = +opt('--pad', 1.5), MIN = +opt('--min', 1.5);
const OVERLAP = args.includes('--overlap');
if (![STEP, LATIN, CJK, PAD, MIN].every(Number.isFinite) || STEP <= 0 || LATIN <= 0 || CJK <= 0) { console.error('bad option value (step and the cps values must be > 0)'); process.exit(2); }
if (!Number.isFinite(+opt('--band', 0)) || +opt('--band', 0) < 0) { console.error('bad option value (--band must be a y coordinate)'); process.exit(2); }
const snap = fingerprint(dir);
const { browser, page } = await openDemo(dir, { w: VW, h: VH, q: Q });

// The film is read in chunks, not in one long loop.
// One synchronous loop over thousands of frames blocks the page for minutes: the GPU queue grows while
// nothing drains it, and the renderer can die in the middle of the read. A chunk returns to Node, the
// browser catches up, and a crash names the frames it died on instead of leaving a bare stack trace.
const CHUNK = 120;   // frames per round trip
const head = await page.evaluate(({ STEP, OV }) => {
  if (typeof window.TEXTS !== 'function') return { noTexts: true };
  if (!(window.DUR > 0)) return { noDur: true };
  window.__rc = { step: STEP, dur: window.DUR, seen: {}, partial: {}, renders: 0, overlap: !!OV };
  // Some films draw the frame inside TEXTS(t) itself (the channel's rig does: TEXTS calls window.render and then
  // returns the boxes the overlay just wrote). Drawing the frame a second time before asking for the text is the
  // same picture twice — on a 3D film that doubled the check's cost. So count the draws and ask TEXTS first.
  const orig = window.render;
  if (typeof orig === 'function') window.render = function (...a) { window.__rc.renders++; return orig.apply(this, a); };
  const before = window.__rc.renders;
  window.TEXTS(0);
  const selfRender = window.__rc.renders > before;   // TEXTS draws by itself: do not draw again
  window.__rc.renders = 0;
  window.__rc.selfRender = selfRender;
  return { dur: window.DUR, selfRender };
}, { STEP, OV: OVERLAP });
if (head.noTexts || head.noDur) {
  console.error('readcheck: NOT CHECKED — ' + (head.noTexts ? 'the page has no window.TEXTS(t) (see the header of core/render/readcheck.mjs for the contract).'
    : 'window.DUR is not a positive number.') + ' This is not a pass.');
  try { await browser.close(); } catch {}
  closeServer();
  process.exit(2);
}
const readChunk = ({ i0, n }) => {
  const st = window.__rc, W = innerWidth, H = innerHeight;
  const frames = [];
  for (let k = 0; k < n; k++) {
    const t = (i0 + k) * st.step;
    if (!st.selfRender) window.render(t);   // when TEXTS does not draw, the frame must be drawn first
    const vis = new Set();
    const fb = [];
    for (const b of window.TEXTS(t) || []) {
      b.id = String(b.id);   // numeric ids are fine too
      fb.push({ id: b.id, text: b.text, x0: +b.x0, y0: +b.y0, x1: +b.x1, y1: +b.y1 });
      const key = b.id + '\u0000' + b.text;   // text changed under the same id = a new piece
      if (!(b.x0 >= 0 && b.y0 >= 0 && b.x1 <= W && b.y1 <= H)) { st.partial[key] ??= { id: b.id, text: b.text, t0: t, y1: b.y1 }; continue; }
      vis.add(key);
      const s = st.seen[key] ??= { id: b.id, text: b.text, t0: t, run: 0, done: false, y1: b.y1 };
      if (!s.done) s.run = Math.min(t + st.step, st.dur) - s.t0;
    }
    for (const k2 in st.seen) if (!vis.has(k2)) st.seen[k2].done = true;   // only the first continuous on-screen stretch counts
    if (st.overlap) frames.push({ t, boxes: fb });   // the boxes of this frame, for the overlap rule
  }
  return { seen: Object.values(st.seen), partial: Object.values(st.partial), frames };
};
// a page that dies mid-read is not a verdict about the film: the check says it could not run, and why
let res = { seen: [], partial: [], frames: [] };
const total = Math.floor(head.dur / STEP) + 1;
for (let i = 0; i < total; i += CHUNK) {
  const n = Math.min(CHUNK, total - i);
  try {
    const chunk = await page.evaluate(readChunk, { i0: i, n });
    res = { seen: chunk.seen, partial: chunk.partial, frames: (res.frames || []).concat(chunk.frames || []) };
  } catch (e) {
    const msg = String(e.message || e).split('\n')[0];
    const at = `${(i * STEP).toFixed(1)}s of ${head.dur.toFixed(1)}s`;
    if (/Target (page|closed)|browser has been closed|Session closed|Target closed/i.test(msg)) {
      console.error(`readcheck: COULD NOT RUN — the page died while the check was reading it (at ${at}): ${msg}`);
      console.error('  Two usual causes: the film was edited while the check ran, or the browser ran out of memory.');
      console.error('  A check that crashed is not a verdict about the film — run it again on a settled file.');
    } else {
      console.error(`readcheck: COULD NOT RUN — the film's own code threw while the check was reading it (at ${at}): ${msg}`);
      console.error("  That is a defect in the film (or in the rig it draws with), not in the check: the error above is the film's.");
    }
    try { await browser.close(); } catch {}
    closeServer();
    process.exit(2);
  }
}
const moved = changed(dir, snap);
if (moved.length) {
  console.error(`readcheck: COULD NOT RUN — the film's source changed while the check was reading it (${moved.join(', ')}): the result is void. Run it again on a settled file.`);
  try { await browser.close(); } catch {}
  closeServer();
  process.exit(2);
}
console.log(`readcheck: read ${total} frames at ${STEP}s steps (${head.selfRender ? 'the film draws the frame inside TEXTS: one draw per frame' : 'the film does not draw inside TEXTS: one draw per frame here'})`);
await browser.close(); closeServer();

// a piece that was cropped at one moment and whole at another is a piece that was readable: the cropped
// moment is not a second fault
const seenKeys = new Set(res.seen.map(s => s.id + '\u0000' + s.text));
res.partial = res.partial.filter(p => !seenKeys.has(p.id + '\u0000' + p.text));

if (!res.seen.length && !res.partial.length) {
  console.error('readcheck: NOT CHECKED — window.TEXTS(t) never returned any text over the whole film. This is not a pass.');
  process.exit(2);
}
const isCJK = ch => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(ch);
const need = text => { let cjk = 0, other = 0; for (const ch of text) { if (/\s/.test(ch)) continue; isCJK(ch) ? cjk++ : other++; } return Math.max(MIN, cjk / CJK + other / LATIN + PAD); };
let bad = 0;
for (const s of res.seen) {
  const n = need(s.text), ok = s.run >= n - 1e-6; if (!ok) bad++;
  console.log(`${ok ? 'OK ' : 'BAD'} ${s.id.padEnd(18)} at ${s.t0.toFixed(2)}s  ${String([...s.text].filter(c => !/\s/.test(c)).length).padStart(3)} chars  need ${n.toFixed(2)}s  got ${s.run.toFixed(2)}s  ${JSON.stringify(s.text.slice(0, 24))}`);
}
for (const s of res.partial) { bad++; console.log(`BAD ${s.id.padEnd(18)} at ${s.t0.toFixed(2)}s  never fully visible (its box is outside the frame)  ${JSON.stringify(s.text.slice(0, 24))}`); }
// the subtitle band: the words of the film sit at the bottom, and nothing else may be down there
const BAND = +opt('--band', 0);
if (BAND > 0) {
  for (const s of [...res.seen, ...res.partial]) {
    if (s.y1 > BAND) { bad++; console.log(`BAD ${s.id.padEnd(18)} at ${s.t0.toFixed(2)}s  overlaps the subtitle band (its box reaches y=${Math.round(s.y1)}, the band starts at ${BAND})  ${JSON.stringify(s.text.slice(0, 24))}`); }
  }
}
// two pieces of text on top of each other: the viewer reads neither, so the film has to be fixed
if (OVERLAP) {
  const pairs = new Map();
  for (const fr of res.frames || []) {
    for (const p of overlapping(fr.boxes)) {
      const key = String(p.a.id) + '\u0000' + String(p.b.id);
      const old = pairs.get(key);
      if (!old) pairs.set(key, { ...p, t: fr.t });
      else if (p.frac > old.frac) pairs.set(key, { ...p, t: old.t });   // the first moment, the worst share
    }
  }
  for (const p of pairs.values()) {
    bad++;
    console.log(`BAD overlap at ${p.t.toFixed(2)}s  ${describe(p)}`);
  }
}
process.exit(bad ? 1 : 0);
