// Two pieces of on-screen text that sit on top of each other: the viewer reads neither.
// This is a measured rule, not a judgement call: two boxes overlap when the shared area is at least
// OVERLAP_MIN_FRAC of the smaller box AND at least OVERLAP_MIN_PX pixels. Below the pixel floor the two
// boxes merely touch — touching is not a fault, and a hairline of anti-aliasing is not a fault either.
// The rule lives here, in one place, because two copies of it drift: the picture round and the delivery
// gate must call the same geometry, or the gate contradicts the round that approved the film.
//
// A box is {id, text, x0, y0, x1, y1} in screen pixels — the contract of window.TEXTS(t) in
// core/render/readcheck.mjs.
export const OVERLAP_MIN_FRAC = 0.25;
export const OVERLAP_MIN_PX = 400;

const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);

// The pairs of texts that sit on top of each other: [{a, b, frac, area}] — frac is the shared area as a
// percentage of the smaller box.
export function overlapping(boxes, { minFrac = OVERLAP_MIN_FRAC, minPx = OVERLAP_MIN_PX } = {}) {
  const out = [];
  const list = (boxes || []).filter(b => b && Number.isFinite(+b.x0) && Number.isFinite(+b.x1) &&
                                      Number.isFinite(+b.y0) && Number.isFinite(+b.y1));
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j];
      if (String(a.id) === String(b.id)) continue;          // one piece of text, one box
      const ox = Math.min(num(a.x1), num(b.x1)) - Math.max(num(a.x0), num(b.x0));
      const oy = Math.min(num(a.y1), num(b.y1)) - Math.max(num(a.y0), num(b.y0));
      if (ox <= 0 || oy <= 0) continue;                      // they only touch
      const area = ox * oy;
      if (area < minPx) continue;
      const small = Math.min((num(a.x1) - num(a.x0)) * (num(a.y1) - num(a.y0)),
                              (num(b.x1) - num(b.x0)) * (num(b.y1) - num(b.y0)));
      if (small <= 0) continue;
      const frac = area / small;
      if (frac >= minFrac) out.push({ a, b, frac: Math.round(frac * 100), area: Math.round(area) });
    }
  }
  return out;
}

// One line of report: the two texts, how much of the smaller box they share.
export function describe(pair) {
  const a = pair.a?.text ?? pair.a?.id ?? '?', b = pair.b?.text ?? pair.b?.id ?? '?';
  return `"${String(a).slice(0, 40)}" and "${String(b).slice(0, 40)}" share ${pair.frac}% of the smaller box`;
}

// The rule proves itself: node core/render/overlap.mjs --selftest
export function selftest() {
  const box = (id, x0, y0, x1, y1) => ({ id, text: id, x0, y0, x1, y1 });
  const cases = [
    ['two boxes on top of each other are caught',
     [box('a', 100, 100, 300, 200), box('b', 200, 150, 400, 250)], 1],
    ['two boxes that only touch are not an overlap',
     [box('c', 100, 100, 300, 200), box('d', 300, 100, 500, 200)], 0],
    ['a hairline of overlap is not an overlap',
     [box('e', 100, 100, 300, 200), box('f', 299, 100, 500, 200)], 0],
    ['one text with two boxes is never an overlap',
     [box('g', 100, 100, 300, 200), box('g', 100, 100, 300, 200)], 0],
    ['a corner of a big box is not an overlap',
     [box('h', 0, 0, 1000, 1000), box('i', 850, 850, 1250, 1250)], 0],
    ['a box without coordinates is ignored, not a crash',
     [box('j', 100, 100, 300, 200), { id: 'k', text: 'k' }], 0],
    ['three boxes, one pair on top of the other',
     [box('l', 0, 0, 100, 100), box('m', 50, 50, 150, 150), box('n', 800, 800, 900, 900)], 1],
  ];
  let bad = 0;
  for (const [name, boxes, want] of cases) {
    const got = overlapping(boxes).length;
    const good = got === want;
    if (!good) bad++;
    console.log(`${good ? 'ok  ' : 'FAIL'} ${name}`);
    if (!good) console.log(`       got ${got} pair(s), want ${want}`);
  }
  console.log(bad ? `FAIL: ${bad} case(s)` : 'ok');
  return bad ? 1 : 0;
}

if (process.argv[1] && process.argv[1].endsWith('overlap.mjs') && process.argv.includes('--selftest')) {
  process.exit(selftest());
}
