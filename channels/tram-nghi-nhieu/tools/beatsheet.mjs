// Picture against narration: one frame for every spoken line, taken while the line is being said, with the line printed under it.
// Read it with the sound off in your head: does each frame show what its line says?
//   node channels/tram-nghi-nhieu/beatsheet.mjs <episode> [--at .6] [--out dir] [--q 'k=v']
// <at> is where in the line the frame is taken (0 = first word, 1 = last). Line starts come from window.EV voice events,
// line lengths from voice/proc/dur.json, text from voice/lines.json. Prints the sheet paths (12 lines per sheet).
// Each frame is also measured, and flagged in red on the sheet and in the printout:
//   DARK  — the brightest tenth of the frame's centre is still dim: the subject sits in shadow (raise the key on it, add a pool);
//   SAME  — almost the same picture as the line before: this line has no picture of its own (a new action, object or angle);
//   RUN   — the fourth line in a row on the same things (the props that fill the frame, measured by rays through it):
//           the film has stopped showing anything new. Give the line its own picture: another place, a cutaway inside,
//           a side-by-side comparison, a wide that shows where we are, a new object. Three lines on one set-up is the most.
//   NUM   — the line says a number (four days, 100 ppm) and no on-screen text (window.TEXTS, subtitle excluded) shows a
//           number while it is said: give it a counter, a calendar, a label. A number painted into a 3D texture is not
//           seen by this check: then say so in LOOK.md.
import fs from 'fs'; import path from 'path'; import { spawnSync } from 'child_process';
import { openDemo, closeServer, requireDemo } from '../../../core/render/page.mjs';

const args = process.argv.slice(2);
const take = k => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : null; };
const at = +(take('--at') ?? .6), q = take('--q') || '', linesArg = take('--lines'), dir = args[0];
let minLine = 1, maxLine = Infinity;
if (linesArg) {
  const [a, b] = linesArg.split('-').map(Number);
  if (!isNaN(a)) minLine = a;
  if (!isNaN(b)) maxLine = b;
}
requireDemo(dir);
const out = take('--out') || path.join(dir, 'out', 'beats');
fs.mkdirSync(out, { recursive: true });
const read = f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const lines = read('voice/lines.json'), dur = read('voice/proc/dur.json');

const { browser, page } = await openDemo(dir, { q });
const ev = await page.evaluate(() => (window.EV || []).filter(e => e.type === 'voice'));
const start = Object.fromEntries(ev.map(e => [e.id, e.t]));
const beats = [];
for (const [i, l] of lines.entries()) {
  const lineNum = i + 1;
  if (lineNum < minLine || lineNum > maxLine) { beats.push({ n: lineNum, id: l.id, text: l.text, skipped: true }); continue; }
  if (!(l.id in start)) { beats.push({ n: lineNum, id: l.id, text: l.text, missing: true }); continue; }
  const t0 = start[l.id], d = dur[l.id] ?? 2, t = +(t0 + at * d).toFixed(2);
  // what text is on screen while the line is said (the subtitle band excluded), for the NUM check
  const shown = await page.evaluate(([a, b]) => {
    const o = new Set();
    for (let k = 0; k <= 6; k++) for (const x of (typeof window.TEXTS === 'function' && window.TEXTS(a + (b - a) * k / 6)) || [])
      if (x && x.id !== 'sub' && x.y0 < 870) o.add(x.text);
    return [...o];
  }, [t0, t0 + d]);
  await page.evaluate(x => { window.SHOTPROBE = 1; window.render(x); }, t);
  const shot = await page.evaluate(() => window.SHOT || null);
  const f = path.join(out, `b_${String(i + 1).padStart(3, '0')}.jpg`);
  await page.screenshot({ path: f, type: 'jpeg', quality: 80 });
  beats.push({ n: i + 1, id: l.id, text: l.text, t0, t1: +(t0 + d).toFixed(2), t, f, shown, shot });
}
await browser.close(); closeServer();
fs.writeFileSync(path.join(out, 'beats.json'), JSON.stringify(beats, null, 1));

const font = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../fonts/BeVietnamPro-Bold.ttf');
const py = `
import json, sys, textwrap, re
import numpy as np
# a spoken number: digits, or a number word next to what it counts ("bốn ngày", "ngày thứ mười", "một phần mười triệu");
# a lone "một"/"chín" is an article or "ripe", not a number
NUMW = r'(?:hai|ba|bốn|tư|năm|sáu|bảy|tám|chín|mười|mươi|trăm|nghìn|ngàn|triệu|tỷ|tỉ)'
UNIT = r'(?:ngày|giờ|phút|giây|tuần|tháng|năm|lần|phần|độ|mét|km|lít|gam|kg|người|quả|cái|con|tuổi|%)'
def says_number(s):
    s = s.lower()
    return bool(re.search(r'\\d', s) or re.search(r'\\b' + NUMW + r'\\s+' + UNIT + r'\\b', s)
                or re.search(r'\\bthứ\\s+' + NUMW + r'\\b', s) or re.search(r'\\bmột\\s+(?:phần|trăm|nghìn|ngàn|triệu|tỷ)\\b', s))
from PIL import Image, ImageDraw, ImageFont
out, font = sys.argv[1], sys.argv[2]
B = json.load(open(out + '/beats.json')); F = ImageFont.truetype(font, 22); Fs = ImageFont.truetype(font, 18)
prev = None; run, pool = 0, set()
for b in B:
    b['flags'] = []
    if b.get('missing') or b.get('skipped'): prev = None; run, pool = 0, set(); continue
    im = Image.open(b['f']).convert('RGB')
    a = np.asarray(im.convert('L').resize((192, 108)), dtype=float) / 255
    c = a[16:92, 29:163]
    if np.percentile(c, 90) < .32: b['flags'].append('DARK')
    # same picture = same layout (a 16×9 colour thumbnail, above the subtitle band) and same colours (hue histogram
    # weighted by saturation): a drifting camera or moving particles do not make a new picture
    top = im.crop((0, 0, im.width, int(im.height * .8)))
    lay = np.asarray(top.resize((16, 9), Image.BILINEAR), dtype=float) / 255
    hsv = np.asarray(top.resize((96, 54)).convert('HSV'), dtype=float)
    hh = np.histogram(hsv[..., 0], bins=12, range=(0, 255), weights=hsv[..., 1] / 255)[0]; hh = hh / (hh.sum() + 1e-9)
    if prev is not None:
        dl, dh = np.abs(lay - prev[0]).mean(), .5 * np.abs(hh - prev[1]).sum()
        if dl < .07 or (dh < .25 and dl < .15): b['flags'].append('SAME')
    prev = (lay, hh)
    # RUN: the lines go on showing the same things. A run's pool is every prop seen since it began; a line whose main
    # subject (the prop filling most of the frame) is already in the pool continues the run
    cast = [k for k, _ in ((b.get('shot') or {}).get('cast') or [])]
    if cast and cast[0] in pool: run += 1; pool |= set(cast)
    else: run, pool = 1, set(cast)
    if run >= 4: b['flags'].append('RUN')
    if says_number(b['text']) and not any(re.search(r'\\d|' + NUMW, x.lower()) for x in b.get('shown', [])): b['flags'].append('NUM')
json.dump(B, open(out + '/beats.json', 'w'), indent=1)
for b in B:
    if b['flags']: print(f"#{b['n']} {b['id']}: {' '.join(b['flags'])}  — {b['text'][:70]}")
W, H, TX, C, R = 640, 360, 96, 3, 4
B_draw = [b for b in B if not b.get('skipped')]
for s in range(0, len(B_draw), C * R):
    page = B_draw[s:s + C * R]; S = Image.new('RGB', (C * W, ((len(page) + C - 1) // C) * (H + TX)), (16, 16, 22)); d = ImageDraw.Draw(S)
    for k, b in enumerate(page):
        x, y = (k % C) * W, (k // C) * (H + TX)
        if b.get('missing'): d.text((x + 10, y + 10), f"#{b['n']} {b['id']}: NO VOICE EVENT", fill=(255, 90, 90), font=F)
        else: S.paste(Image.open(b['f']).convert('RGB').resize((W, H)), (x, y))
        d.rectangle([x, y + H, x + W - 2, y + H + TX - 2], fill=(28, 28, 36))
        d.text((x + 8, y + H + 4), f"#{b['n']}  {b['id']}  {b.get('t0', '')}–{b.get('t1', '')} s", fill=(247, 189, 39), font=Fs)
        if b['flags']:
            tag = ' '.join(b['flags']); tw = d.textlength(tag, font=F)
            d.rectangle([x + W - tw - 22, y + 8, x + W - 8, y + 40], fill=(220, 40, 60)); d.text((x + W - tw - 15, y + 10), tag, fill=(255, 255, 255), font=F)
        for j, ln in enumerate(textwrap.wrap(b['text'], 52)[:3]): d.text((x + 8, y + H + 26 + j * 22), ln, fill=(240, 236, 228), font=Fs)
    p = f"{out}/sheet_{s // (C * R) + 1}.jpg"; S.save(p, quality=86); print(p)
`;
const r = spawnSync('python3', ['-c', py, out, font], { encoding: 'utf8' });
process.stdout.write(r.stdout); process.stderr.write(r.stderr);
const miss = beats.filter(b => b.missing).length;
if (miss) console.log(`${miss} line(s) have no voice event in window.EV`);
process.exit(r.status || 0);
