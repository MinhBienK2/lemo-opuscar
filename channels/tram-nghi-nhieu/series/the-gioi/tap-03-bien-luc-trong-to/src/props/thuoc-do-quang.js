// Thước đo quãng: một dải thép mỏng có vạch, treo bằng hai sợi dây.
//
// Nó phải là một dải đo, không phải một tấm gỗ: mặt dải có vạch khắc rõ
// (không chữ số), một vỏ cuộn tròn ở cuối, móc thép ở đầu kia, một con trượt
// đỏ đang chỉ vị trí đang đo, và hai sợi dây treo nó lên.
import * as THREE from 'three';
import { PAL, toon, canvasTex, rbox, mesh, mulberry } from '../../../../../rig/kit.js';

export function thuocDoQuang(opts = {}) {
  const { len = 12, cursorX = 0, wire = 4.2 } = opts;
  const g = new THREE.Group(); g.name = 'thước đo quãng';

  // vạch khắc trên mặt dải: vẽ bằng canvas cho sắc và sáng
  const steelTex = canvasTex(2048, 96, (g2, w, h) => {
    const r = mulberry(41);
    const grd = g2.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#fdf8ea'); grd.addColorStop(.66, '#f4eddb'); grd.addColorStop(1, '#d5cdb8');
    g2.fillStyle = grd; g2.fillRect(0, 0, w, h);
    for (let k = 0; k < 1400; k++) {   // vân thép
      g2.strokeStyle = `rgba(120,124,140,${.04 + r() * .09})`;
      g2.lineWidth = 1;
      const y = r() * h; g2.beginPath(); g2.moveTo(0, y); g2.lineTo(w, y + (r() - .5) * 3); g2.stroke();
    }
    const n = 39;                          // 39 vạch trên cả dải
    for (let i = 0; i < n; i++) {
      const x = (i + .5) * (w / n);
      const big = i % 5 === 0;
      g2.fillStyle = big ? '#d8364f' : '#252d4a';
      g2.fillRect(x - (big ? 6 : 3), 0, big ? 12 : 6, big ? h * .72 : h * .40);
    }
    g2.fillStyle = 'rgba(40,46,66,.30)'; g2.fillRect(0, h - 6, w, 6);
  });
  const steel = toon('#ffffff', { map: steelTex, emissive: new THREE.Color('#4a4534') });
  const chrome = toon('#9aa2b8', { emissive: new THREE.Color('#2b3048') });
  const redTick = toon(PAL.red);

  // vỏ cuộn: một vòng tròn thép ở đầu dải — dấu hiệu "công cụ đo"
  const reel = new THREE.Group();
  reel.position.set(len / 2 + .48, 0, .02);
  g.add(reel);
  reel.add(mesh(new THREE.CylinderGeometry(.36, .36, .24, 40), chrome, [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  reel.add(mesh(new THREE.TorusGeometry(.36, .05, 12, 40), redTick, [0, 0, .12]));
  reel.add(mesh(new THREE.CylinderGeometry(.10, .10, .30, 24), chrome, [0, 0, .02], { rot: [Math.PI / 2, 0, 0] }));
  reel.add(mesh(new THREE.BoxGeometry(.08, .24, .08), chrome, [.24, .08, .19], { rot: [0, 0, .5] }));
  reel.add(mesh(new THREE.SphereGeometry(.055, 12, 10), redTick, [.32, .18, .19]));

  // dải thép: thân mỏng, mặt có vạch quay về phía máy quay
  g.add(mesh(rbox(len, .22, .028, .008), chrome, [0, 0, 0]));
  g.add(mesh(new THREE.PlaneGeometry(len, .22),
    toon('#ffffff', { map: steelTex, emissive: new THREE.Color('#4a4534') }), [0, 0, .016], { cast: false }));

  // móc cuối dải
  g.add(mesh(new THREE.BoxGeometry(.045, .16, .075), chrome, [-len / 2 - .03, 0, .02]));
  g.add(mesh(new THREE.SphereGeometry(.040, 12, 10), chrome, [-len / 2 - .03, -.08, .02]));

  // con trượt đỏ: chỗ đang đo (nhãn "GẦN 38 LẦN" trỏ vào đỉnh nó)
  g.add(mesh(new THREE.BoxGeometry(.10, .20, .030),
    toon(PAL.red, { emissive: new THREE.Color(PAL.red).multiplyScalar(.4) }), [cursorX, .015, .038]));
  g.add(mesh(new THREE.BoxGeometry(.045, .085, .045),
    toon(PAL.red, { emissive: new THREE.Color(PAL.red).multiplyScalar(.4) }), [cursorX, .155, .028]));

  // hai sợi dây treo hai đầu dải thước lên trời
  if (wire > 0) {
    for (const x of [-len / 2 + .30, len / 2 - .30]) {
      g.add(mesh(new THREE.CylinderGeometry(.011, .011, wire, 6), chrome, [x, .12 + wire / 2, 0], { cast: false }));
      g.add(mesh(new THREE.TorusGeometry(.055, .014, 8, 16), chrome, [x, .12, 0], { rot: [Math.PI / 2, 0, 0], cast: false }));
    }
  }
  g.userData.parts = { reel };
  return g;
}

// Ảnh vật: dải đo treo bằng hai sợi dây, con trượt đỏ đang chỉ chỗ đang đo.
export const PROP = {
  name: 'thước đo quãng',
  view: () => thuocDoQuang({ len: 12, cursorX: 0, wire: 4.2 }),
};
