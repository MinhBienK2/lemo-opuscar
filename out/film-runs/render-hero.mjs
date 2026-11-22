// Dựng lại 26 ảnh hero của tập 03, GIỮ TÊN TỆP CŨ (theo mã câu) và dùng mốc thời gian
// đúng của câu đó trong tờ nhịp. `still.mjs` tự đặt tên theo thứ tự (t_<giây>.jpg), nên ta
// dựng từng ảnh vào thư mục riêng rồi đổi tên về mã câu.
//
// Chạy: node out/film-runs/render-hero.mjs <đường dẫn tập>
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, renameSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const LIB = '/home/minhbien/Documents/lemo-opuscar';
const ep = path.resolve(process.argv[2]);
const beats = JSON.parse(readFileSync(path.join(ep, 'review/beatsheet/beats.json'), 'utf8'));
const byId = Object.fromEntries(beats.map(b => [b.id, b]));

const heroes = readdirSync(path.join(ep, 'review/hero')).filter(f => f.endsWith('.jpg')).sort();
const tmp = path.join(ep, 'out/scratch/hero-new');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });

let n = 0;
for (const f of heroes) {
  const num = Number(f.replace(/\D/g, ''));
  const cid = `c${num}`;
  const b = byId[cid];
  if (!b) { console.log('thiếu beat cho', f); continue; }
  try {
    execFileSync('node', ['core/render/still.mjs', ep, String(b.t), '--out', tmp],
      { cwd: LIB, stdio: 'inherit', env: { ...process.env, LEMO_ANGLE: 'vulkan' } });
    const made = path.join(tmp, `t_${b.t}.jpg`);
    if (!existsSync(made)) { console.log('LỖI: không có ảnh cho', f); continue; }
    renameSync(made, path.join(tmp, f));
    console.log(`${f}  <-  ${cid} @ ${b.t}s`);
    n++;
  } catch (e) { console.log('LỖI', f, String(e.message).slice(0, 120)); }
}
console.log(`dựng ${n}/${heroes.length} ảnh hero vào ${tmp}`);
