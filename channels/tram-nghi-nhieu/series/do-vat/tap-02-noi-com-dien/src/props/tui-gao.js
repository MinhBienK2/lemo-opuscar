// Túi gạo: một túi giấy in nhãn, mép gập lại, vài hạt gạo rơi lệch bên cạnh.
import * as THREE from 'three';
import { toon, canvasTex, rbox, mesh, mulberry } from '../../../../../rig/kit.js';
import { gachGao } from './gao.js';

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
  g.add(mesh(rbox(.190, .250, .105, .010), bagMat, [0, .125, 0], { rot: [0, 0, -.03] }));
  // mép túi gập lại
  g.add(mesh(rbox(.190, .030, .098, .008), toon('#dccfae'), [0, .262, 0], { rot: [0, 0, -.03] }));
  g.add(mesh(rbox(.176, .018, .020, .006), toon('#c9bb98'), [0, .276, 0], { rot: [0, 0, -.03] }));

  // Vài hạt gạo rơi lệch bên cạnh. Hạt phải ĐỦ TO: ở cỡ này hạt thật bị viền
  // mực nuốt hết, đọc ra là mấy vệt xanh đậm trên bàn chứ không phải hạt gạo.
  const r = mulberry(11);
  for (let i = 0; i < 5; i++) {
    const gr = gachGao({ scale: 3.0 });
    gr.position.set(.10 + r() * .10, .010, .02 + (r() - .5) * .10);
    gr.rotation.set(r() * 6, r() * 6, r() * 6);
    g.add(gr);
  }
  g.scale.setScalar(s);
  return g;
}

export const PROP = { name: 'túi gạo', view: () => tuiGao() };
