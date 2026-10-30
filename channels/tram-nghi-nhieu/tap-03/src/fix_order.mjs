// Sửa bảng cảnh: mỗi chữ trên thẻ phải được nói khi cảnh đó còn trên màn hình, và phải đủ lâu để đọc.
//   node src/fix_order.mjs   > /tmp/patch.json    # in ra phần sửa
//   python src/apply_patch.py /tmp/patch.json     # đặt vào bảng cảnh
//
// Một chữ trên thẻ thuộc về lúc nó được nói. Nếu câu đó nói ra ngoài cảnh của nó, chữ đó
// chuyển sang cảnh kế tiếp. Và mỗi chữ phải đủ lâu trên màn hình: nếu không, cảnh kế tiếp
// được dời ra. Hai việc đó ảnh hưởng lẫn nhau, nên script chạy vài vòng cho tới khi ổn định.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
// the episode folder, from this file's own location: the script travels with the episode
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { build } = await import(pathToFileURL(path.join(ROOT, 'src/timeline.js')).href);
const { buildShots } = await import(pathToFileURL(path.join(ROOT, 'src/shots.js')).href);
const dur = JSON.parse(fs.readFileSync(ROOT + '/voice/dur.json'));
const words = JSON.parse(fs.readFileSync(ROOT + '/voice/words.json'));
const lips = JSON.parse(fs.readFileSync(ROOT + '/voice/lips.json'));
const T = build(dur, words, lips);
const shots = buildShots({ L: T.L, w: T.w });

const need = t => Math.max(1.5, [...t].filter(c => !/\s/.test(c)).length / 15 + 1.5) + .9;   // with a margin: the check measures in steps
const startOf = s => T.L[s.at].t0 + (s.off ?? -.3);
const MAXPUSH = 6;

// the phrases of every shot, before the repairs
const phrases = shots.map(s => (s.card && s.card.lines || []).map(l => ({ ...l })));


// every text a shot puts on screen, with the moment it appears
function textsOf(s, s0) {
  const out = [];
  const t0 = T.L[s.line || s.at].t0;
  const put = (t, text) => { if (text) out.push({ t: Math.max(t, s0), need: need(text) }); };
  if (s.card) {
    put(s0, s.card.title); put(s0, s.card.sub);
    for (const l of s.card.lines || []) put(T.w(l.at, l.k ?? 0), l.t);
  }
  if (s.beat === 'phone') (s.notifs || []).forEach((n, i) => put(t0 + .4 + i * 1.1, n.t));
  if (s.beat === 'strip') (s.blocks || []).forEach((b, i) => { if (b.label) put(t0 + i * .5, b.label); });
  if (s.beat === 'head') (s.thoughts || []).forEach((th, i) => put(s0 + i * 1.1, th));
  if (s.beat === 'check') (s.items || []).forEach((it, i) => { put(t0 + i * .8, it.t); put(t0 + i * .8, it.s); });
  if (s.beat === 'stat') { put(s0, s.label); put(s0, s.note); put(s0, s.unit); }
  if (s.beat === 'bars') (s.items || []).forEach(it => { put(s0, it.label); put(s0, it.sub); });
  if (s.beat === 'compare') { put(s0, s.leftHead); put(s0, s.rightHead); put(s0, (s.left || '').split('\n')[0]); }
  if (s.beat === 'myth') { put(s0, s.head); put(s0, s.claim); put(s0, s.quote); put(s0, s.source); }
  if (s.beat === 'flow') (s.items || []).forEach(it => { put(s0, it.t); put(s0, it.s); });
  if (s.beat === 'money') { put(s0, s.label); put(s0, s.total); }
  if (s.beat === 'chapter') { put(s0, s.title); put(s0, s.sub); }
  return out;
}

let off = shots.map(s => s.off ?? -.3);
for (let round = 0; round < 6; round++) {
  const start = i => T.L[shots[i].at].t0 + off[i];
  const end = i => (i + 1 < shots.length ? start(i + 1) : T.end);
  // every phrase belongs to the shot that is on screen when it is said
  const home = phrases.map((ps, i) => ps.map(l => {
    const n = (words[l.at] || []).length;
    const kk = Math.min(Math.max(0, l.k ?? 0), Math.max(0, n - 1));
    const t = T.w(l.at, kk);
    for (let j = 0; j < shots.length; j++) if (t >= start(j) - .1 && t < end(j)) return { l, k: kk, shot: j };
    return { l, k: kk, shot: -1 };
  }));
  // a shot's phrases must live long enough: the next shot is pushed out
  let changed = false;
  for (let i = 0; i < shots.length - 1; i++) {
    let deficit = 0;
    for (const h of home[i]) {
      if (h.shot !== i) continue;
      const appear = T.w(h.l.at, h.k);
      deficit = Math.max(deficit, appear + need(h.l.t) - end(i));
    }
    for (const t of textsOf(shots[i], start(i))) deficit = Math.max(deficit, t.t + t.need - end(i));
    if (deficit > 0.05) {
      const push = Math.min(MAXPUSH, Math.ceil(deficit * 10) / 10);
      off[i + 1] = Math.round((off[i + 1] + push) * 10) / 10;
      changed = true;
    }
  }
  if (!changed) break;
}

// the last round gives the final homes
const start = i => T.L[shots[i].at].t0 + off[i];
const end = i => (i + 1 < shots.length ? start(i + 1) : T.end);
const patch = {}, pushes = {};
for (let i = 0; i < shots.length; i++) {
  const s = shots[i];
  const spec = { drop: [], reanchor: {}, add: [] };
  for (const l of phrases[i]) {
    const n = (words[l.at] || []).length;
    const kk = Math.min(Math.max(0, l.k ?? 0), Math.max(0, n - 1));
    const t = T.w(l.at, kk);
    let home = -1;
    for (let j = 0; j < shots.length; j++) if (t >= start(j) - .1 && t < end(j)) { home = j; break; }
    if (home < 0) { spec.drop.push(phrases[i].indexOf(l)); continue; }
    if (home === i) {
      if (kk !== (l.k ?? 0)) spec.reanchor[phrases[i].indexOf(l)] = { at: l.at, k: kk };
    } else {
      spec.drop.push(phrases[i].indexOf(l));
      const name = shots[home].n;
      patch[name] = patch[name] || { drop: [], reanchor: {}, add: [] };
      patch[name].add.push({ t: l.t, at: l.at, k: kk, col: l.col || 'PAL.hoodie.f' });
    }
  }
  if (spec.drop.length || Object.keys(spec.reanchor).length) patch[s.n] = { ...(patch[s.n] || { drop: [], reanchor: {}, add: [] }), ...spec, add: [] };
}
for (let i = 0; i < shots.length; i++) {
  const cur = shots[i].off ?? -.3;
  if (Math.abs(off[i] - cur) > 0.05) pushes[shots[i].n] = off[i];
}
console.log(JSON.stringify({ patch, pushes }, null, 1));
