// Túi gạo: một túi giấy in nhãn, mép gập lại, vài hạt gạo rơi lệch bên cạnh.
import * as THREE from 'three';
import { toon, canvasTex, rbox, mesh, mulberry } from '../../../../../rig/kit.js';
import { gachGao } from './gao.js';

// Vật tự biết lúc nào câu của nó bắt đầu: film.js đặt sẵn window.EV, mỗi
// câu kể có một sự kiện 'voice' ghi mốc đầu câu. Nhờ vậy túi gạo tự biết
// lúc nào nó vừa được đặt xuống bàn, không phải gõ tay mốc thời gian vào.
function lineStart(id) {
  const ev = window.EV || [];
  for (const e of ev) if (e.type === 'voice' && e.id === id) return e.t;
  return null;
}

export function tuiGao(opts = {}) {
  const g = new THREE.Group();
  const s = opts.scale || 1;

  const tex = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#e9dcc0'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#2f6f7e'; c.fillRect(0, 24, w, 52);
    c.fillStyle = '#f4efe2'; c.font = 'bold 62px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('GẠO', w / 2, 50);
    c.strokeStyle = 'rgba(60,45,30,.35)'; c.lineWidth = 3; c.strokeRect(10, 100, w - 20, 110);
    c.fillStyle = '#6a5a44'; c.font = '26px sans-serif';
    c.fillText('Hạt Mộc', w / 2, 132); c.fillText('5 kg', w / 2, 168);
    const r = mulberry(3);
    for (let k = 0; k < 1400; k++) { c.fillStyle = `rgba(120,100,70,${r() * .12})`; c.fillRect(r() * w, r() * h, 3, 2); }
  });
  const bagMat = toon('#ffffff', { map: tex });
  // Thân túi nằm trong một bản lề ở mép đáy: túi lắc trên đáy thì nó xoay
  // quanh mép đáy (đúng như một túi giấy đặt xuống bàn rồi lắc), nên không
  // bao giờ có chỗ nào của túi cắm xuống mặt bàn.
  const pivot = new THREE.Group();
  pivot.position.x = .095;
  g.add(pivot);
  const body = new THREE.Group();
  body.position.x = -.095;
  pivot.add(body);
  body.add(mesh(rbox(.190, .250, .105, .010), bagMat, [0, .125, 0], { rot: [0, 0, -.03] }));
  // mép túi gập lại
  body.add(mesh(rbox(.190, .030, .098, .008), toon('#dccfae'), [0, .262, 0], { rot: [0, 0, -.03] }));
  body.add(mesh(rbox(.176, .018, .020, .006), toon('#c9bb98'), [0, .276, 0], { rot: [0, 0, -.03] }));

  // Vài hạt gạo rơi lệch bên cạnh. Hạt phải ĐỦ TO: ở cỡ này hạt thật bị viền
  // mực nuốt hết, đọc ra là mấy vệt xanh đậm trên bàn chứ không phải hạt gạo.
  const r = mulberry(11);
  const spilled = [];
  for (let i = 0; i < 5; i++) {
    const gr = gachGao({ scale: 3.0 });
    const p = { x: .10 + r() * .10, y: .010, z: .02 + (r() - .5) * .10, ph: r() * 6.283 };
    gr.position.set(p.x, p.y, p.z);
    gr.rotation.set(r() * 6, r() * 6, r() * 6);
    g.add(gr);
    spilled.push({ gr, p });
  }

  // ── nhịp của túi gạo ──────────────────────────────────────────────────
  // Túi gạo vừa được đặt xuống bàn: giấy túi mềm, nên nó lắc lư trên đáy
  // rồi đứng yên. Nhịp lắc phải NHANH: hai khung liền nhau phải khác nhau
  // thấy được, nếu chậm thì hình đứng yên và người xem tưởng đây là một
  // tấm bìa dán trên bàn.
  let t0 = null;
  g.updateProp = t => {
    if (t0 == null) {
      t0 = lineStart('c47');
      if (t0 == null) t0 = 142.16;
    }
    const tau = t - t0;
    const w = (tau > 0 && tau < 3.0)
      ? Math.exp(-.85 * tau) * Math.sin(2 * Math.PI * 1.45 * tau) : 0;
    pivot.rotation.z = .10 * w;
    // mấy hạt gạo rơi trên bàn rung theo cái lắc của túi
    for (const { gr, p } of spilled) {
      gr.position.set(p.x + .004 * w * Math.sin(p.ph), p.y, p.z + .003 * w * Math.cos(p.ph));
    }
  };

  g.scale.setScalar(s);
  return g;
}

export const PROP = { name: 'túi gạo', view: () => tuiGao() };
