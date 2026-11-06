// The narration as time: line start/end, the subtitle at t, and the voice events for window.EV.
// Usage in src/film.js:  import { build } from './timeline.js';  const V = await loadVoice(build);
export async function loadVoice(build) {
  const get = u => fetch(u).then(r => (r.ok ? r.json() : {})).catch(() => ({}));
  const [dur, words, lips] = await Promise.all(['voice/proc/dur.json', 'voice/words.json', 'voice/lips.json'].map(get));
  const tl = build(dur, words, lips);
  const ev = Object.values(tl.L).map(l => ({ type: 'voice', id: l.id, t: +l.t0.toFixed(3) }));
  const sub = t => (tl.cues.find(c => t >= c.t0 && t < c.t1) || {}).text || '';
  return { ...tl, ev, sub };   // L[id].t0/t1, w(id, word) → time of a word, end, cues, ev, sub(t)
}
