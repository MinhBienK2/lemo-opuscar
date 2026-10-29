import fs from 'fs';
const T = JSON.parse(fs.readFileSync('timing.json', 'utf8'));
const pad = (n, w = 2) => String(n).padStart(w, '0');
const ts = s => { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return `${pad(h)}:${pad(m)}:${pad(Math.floor(x))},${pad(Math.round((x % 1) * 1000), 3)}`; };
function wrap(text, max = 44) {
  const w = text.split(' '), out = []; let cur = '';
  for (const k of w) { const t = cur ? cur + ' ' + k : k; if (t.length > max && cur) { out.push(cur); cur = k; } else cur = t; }
  if (cur) out.push(cur);
  if (out.length <= 2) return out.join('\n');
  const mid = Math.ceil(out.length / 2);
  return [out.slice(0, mid).join(' '), out.slice(mid).join(' ')].join('\n');
}
let srt = '';
T.SUBS.forEach((c, i) => { srt += `${i + 1}\n${ts(c.t0)} --> ${ts(c.t1)}\n${wrap(c.text)}\n\n`; });
fs.writeFileSync('mot-vong-lon-muoi-bon-nam.srt', srt);
console.log('srt cues', T.SUBS.length);
