// The rig's own objects, for propcheck: every entry must be recognised by name from its pictures alone.
import * as THREE from 'three';
import { banana, bunch, apple, plate, bowl } from '../rig/props.js';
import { tissue } from '../rig/inside.js';
import { preset } from '../rig/cutaway.js';
import { buildHand } from '../rig/fx.js';
import { section } from '../rig/section.js';
import { toon } from '../rig/kit.js';
import * as P from '../rig/parts.js';
const ripe = (r) => { const m = banana(); m.ripen(r, 0); return m; };
export const PROPS = {
  'quả chuối xanh': () => ripe(0),
  'quả chuối chín vàng': () => ripe(1),
  'quả chuối chín lốm đốm': () => ripe(1.5),
  'nải chuối': () => { const B = bunch({ n: 5 }); B.fruits.forEach(f => f.ripen(.6, 0)); return B.group; },
  'quả táo đỏ': () => apple(),
  'quả táo xanh': () => apple({ color: 'green' }),
  'quả táo đỏ bổ đôi, thấy ruột': () => section(apple(), { cap: () => toon('#f4e6c4') }).group,
  'cái đĩa': () => plate({ R: .3 }),
  'cái bát': () => bowl({ R: .3 }),
  'bàn tay người': () => buildHand(),
  'quả chuối chín cắt ngang, thấy ruột': () => { const m = banana({ cut: .72 }); m.ripen(1, 0); return m; },
  'khối thịt chuối phóng to cạnh quả chuối, thấy tế bào': () => {   // a macro view is judged with what it was cut from
    const g = new THREE.Group(), T = tissue({ section: 5, rad: .1, d: .16, gates: 3, skin: '#d7cf4a', skinTo: '#f7c62f', faceLight: .9 });
    g.add(T.group); const b = banana({ len: .5, rad: .05 }); b.ripen(1, 0); b.position.set(-.45, 0, -.2); b.rotation.y = .5; g.add(b); return g;
  },
  'chai thuỷ tinh xanh có nắp': () => preset('bottle').group,
  'lon nước ngọt bị cắt hở một mảng, thấy bên trong': () => preset('can').group,
  'bóng đèn sợi đốt (bóng tròn, thuỷ tinh trong)': () => preset('bulb').group,
  'cốc thuỷ tinh có nước': () => preset('glass', { fill: .15, liquid: '#c98a2e' }).group,
  'lò xo xoắn bằng thép': () => P.spring(),
  'nút bấm tròn màu đỏ': () => P.button(),
  'nam châm hình móng ngựa': () => P.magnet(),
  'thanh nam châm': () => P.magnet({ kind: 'bar' }),
  'con ốc vít': () => P.screw(),
  'dây điện có phích cắm': () => P.cable(),
  'con chip điện tử': () => P.chip(),
  'bảng mạch điện tử': () => P.pcb(),
  'viên pin AA': () => P.battery(),
  'viên pin điện thoại': () => P.battery({ kind: 'pouch' }),
  'bánh răng': () => P.gear(),
  'tiếp điểm điện (hai lá đồng nối dây)': () => { const c = P.contacts(); c.close(.4); return c; },
};
