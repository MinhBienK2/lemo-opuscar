// Nồi cơm đời đầu: thân sành, nắm có núm, chân cao, nút bấm cơ có cần bấm,
// không có bảng điện tử — chỉ có công tắc nhiệt cơ ở đáy nồi (xem noi-cu-cat-ngang.js).
import * as THREE from 'three';
import { toon, glowMat, rbox, mesh, fxLayer } from '../../../../../rig/kit.js';
import { vessel } from '../../../../../rig/cutaway.js';
import { cable } from '../../../../../rig/parts.js';

const PROFILE_CU = [
  [0, 0], [.150, 0], [.182, .020], [.196, .062], [.198, .120],
  [.188, .180], [.172, .228], [.150, .250], [.140, .256],
];

export function noiComDoiDau(opts = {}) {
  const g = new THREE.Group();
  const glaze = toon(opts.glaze || '#eee4cf');
  const band = toon(opts.band || '#2f6f7e');
  const brass = toon('#c9973a');

  const body = vessel(PROFILE_CU, { thick: .016, cut: 0, shell: glaze, face: toon('#d8cdb6') });
  g.add(body.group);
  g.body = body;

  // vành sơn quanh thân
  g.add(mesh(new THREE.CylinderGeometry(.200, .200, .026, 40), band, [0, .120, 0]));

  // ── nắm: vòm sành có núm ──
  const lid = new THREE.Group(); lid.position.set(0, .256, -.150);
  const lidBody = new THREE.Group(); lidBody.position.set(0, 0, .150);
  lid.add(lidBody);
  const lidProf = [[.150, -.006], [.162, 0], [.160, .020], [.135, .048], [.090, .072], [.045, .086], [0, .090]];
  lidBody.add(mesh(new THREE.LatheGeometry(lidProf.map(p => new THREE.Vector2(p[0], p[1])), 44), glaze));
  lidBody.add(mesh(new THREE.TorusGeometry(.160, .007, 8, 40), band, [0, .002, 0], { rot: [Math.PI / 2, 0, 0] }));
  const knob = new THREE.Group(); knob.position.set(0, .090, 0);
  knob.add(mesh(new THREE.SphereGeometry(.028, 16, 12), glaze, [0, .014, 0]));
  knob.add(mesh(new THREE.CylinderGeometry(.012, .016, .020, 14), brass, [0, -.002, 0]));
  lidBody.add(knob);
  g.add(lid);
  g.lid = lid;

  // ── nút bấm cơ: một cần bấm nhô ra ở mặt trước, trên một bảng nhỏ ──
  const panel = new THREE.Group(); panel.position.set(0, .070, .196);
  panel.add(mesh(rbox(.13, .075, .020, .010), toon('#e2d8c2'), [0, 0, 0]));
  const lever = new THREE.Group(); lever.position.set(0, .004, .012);
  lever.add(mesh(rbox(.052, .020, .046, .008), brass, [0, .008, .020]));
  lever.add(mesh(new THREE.CylinderGeometry(.010, .010, .040, 12), brass, [0, .018, .040], { rot: [Math.PI / 2, 0, 0] }));
  panel.add(lever);
  g.add(panel);
  g.lever = lever;

  // ── chân cao: ba chân sành ──
  for (let i = 0; i < 3; i++) {
    const a = i / 3 * Math.PI * 2 + .5;
    const leg = new THREE.Group(); leg.position.set(Math.cos(a) * .125, .048, Math.sin(a) * .125);
    leg.add(mesh(new THREE.CylinderGeometry(.020, .026, .096, 12), glaze, [0, -.048, 0]));
    leg.add(mesh(new THREE.TorusGeometry(.021, .006, 6, 16), brass, [0, -.088, 0], { rot: [Math.PI / 2, 0, 0] }));
    g.add(leg);
  }

  // ── dây điện ──
  g.add(cable({
    points: [[0, .04, -.19], [-.05, .02, -.28], [-.14, .012, -.31], [-.28, .010, -.26], [-.38, .008, -.18]],
    r: .007, color: '#3a2f26', plug: 'wall',
  }));

  g.setLid = k => { lid.rotation.x = -k * 1.15; };
  g.setLever = k => { lever.rotation.x = -k * .5; lever.position.z = .012 - k * .012; };
  g.setLid(0); g.setLever(0);
  return g;
}

export const PROP = { name: 'nồi cơm đời đầu', view: () => noiComDoiDau() };
