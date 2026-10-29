// Download the fonts the film uses (OFL, Google Fonts) with all subsets, so Vietnamese diacritics render.
import fs from 'fs';
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const fams = [
  'family=Be+Vietnam+Pro:wght@400;500;600;700;800;900',
  'family=Fredoka:wght@500;600;700',
  'family=Lilita+One',
];
fs.mkdirSync('fonts', { recursive: true });
let out = '', n = 0;
for (const f of fams) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${f}&display=block`, { headers: { 'User-Agent': UA } })).text();
  let body = css;
  for (const u of [...new Set(css.match(/https:\/\/[^)]+/g) || [])]) {
    const name = `f${n++}.woff2`;
    fs.writeFileSync('fonts/' + name, Buffer.from(await (await fetch(u, { headers: { 'User-Agent': UA } })).arrayBuffer()));
    body = body.split(u).join('fonts/' + name);
  }
  out += body;
}
fs.writeFileSync('fonts.css', out);
console.log('files', n, 'css', out.length);
