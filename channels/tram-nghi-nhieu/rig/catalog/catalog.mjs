// node channels/tram-nghi-nhieu/rig/catalog/catalog.mjs → writes rig/catalog/CATALOG.md (the text index of the rig's
// props, people and pictures) and prints the page counts of each catalog set, for build.sh.
import fs from 'node:fs';
import { PROPS } from '../props.js';
import { LOOKS } from '../extras.js';

const here = new URL('.', import.meta.url).pathname;
const idx = JSON.parse(fs.readFileSync(new URL('../assets/fluent/index.json', import.meta.url)));
const ARMS = 25, pages = { props: Math.ceil(Object.keys(PROPS).length / 6), people: Math.ceil(Object.keys(LOOKS).length / 6) + Math.ceil(ARMS / 10) + 2, assets: Math.ceil(idx.length / 32) };
const md = [];
md.push('# Danh mục rig (sinh tự động: `sh channels/tram-nghi-nhieu/rig/catalog/build.sh`, đừng sửa tay)', '',
  'Nhìn ảnh trước khi chọn: `props-*.jpg` (vật vẽ bằng code, mọi trạng thái), `people-*.jpg` (người: nghề, tay, mặt, dáng),',
  '`assets-*.jpg` (hình có sẵn từ Fluent Emoji Flat, MIT). Thiếu vật nào thì thêm vào `rig/props.js` (cùng khuôn: look, states,',
  'params, anchors) rồi dựng lại danh mục; thiếu hình nào có trong Fluent thì `python3 rig/assets/fetch.py add "<Name>"`.', '',
  `## Vật — \`prop(g, id, { x, y, s, state, from, k, t, … })\` · ${Object.keys(PROPS).length} vật · board: \`"draw": "rig:<id>"\``, '',
  '| id | tên | kích thước (cm) | trạng thái | tham số | điểm neo |', '|---|---|---|---|---|---|');
const M = 306;
for (const [id, D] of Object.entries(PROPS)) {
  const sz = (D.size || []).map(v => Math.round(v / M * 100)).join(' × ');
  const pr = Object.entries(D.params || {}).map(([k, v]) => `\`${k}\` ${v}`).join('; ');
  const esc = x => String(x).replace(/\|/g, '\\|');
  md.push(`| \`${id}\` | ${D.name} — ${esc(D.look || '')} | ${sz} | ${Object.keys(D.states || {}).join(', ')} | ${esc(pr)} | ${esc(D.anchors || '')} |`);
}
md.push('', `## Người — \`extra(g, { look, E, armL, armR, at, sit, walk, lean, sweat, rot, talk, t })\` · ${Object.keys(LOOKS).length} kiểu`, '',
  '| look | áo | phụ kiện | mũ |', '|---|---|---|---|');
for (const [id, L] of Object.entries(LOOKS)) md.push(`| \`${id}\` | ${L.top} / ${L.bottom} | ${[].concat(L.acc || []).join(', ')} | ${L.hat || (L.hair === 'cap' ? 'cap' : '')} |`);
md.push('', 'Tay, nét mặt và dáng: xem chú thích đầu `rig/extras.js` và ảnh `people-*.jpg`.', '',
  `## Hình có sẵn — \`await loadAssets([...]); asset(g, id, { x, y, h, rot })\`, \`badge(g, id, { x, y, r })\` · ${idx.length} hình · board: \`"draw": "asset:fluent/<id>"\``, '',
  'Người trong bộ này chỉ là tượng bán thân: dùng làm biểu tượng, huy hiệu, mặt trong vòng tròn; người diễn là `extras.js`.', '');
const byG = {};
for (const e of idx) (byG[e.group || 'Khác'] ||= []).push(e);
for (const [gname, es] of Object.entries(byG)) md.push(`- **${gname}**: ${es.map(e => `\`${e.id}\``).join(', ')}`);
md.push('', 'Fluent Emoji © Microsoft Corporation, MIT (`rig/assets/fluent/LICENSE`).', '');
fs.writeFileSync(here + 'CATALOG.md', md.join('\n'));
console.log(Object.entries(pages).map(([k, v]) => `${k}=${v}`).join(' '));
