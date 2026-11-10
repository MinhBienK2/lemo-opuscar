// Củ tế bào: đầu của sợi trục, một khối nhăn nheo có mặt phẳng quay về phía
// khe. Trên mặt có những túi nhỏ (bóng chứa chất) và vài lúm trống — chỗ
// vừa thả ra phân tử.
//
// Củ này là một MẢNG MÀNG có nếp, không phải một quả cầu trơn: quả cầu trơn
// không có đường viền mực và không có bóng, đọc ra là một viên bi tím.
//
// Ba dấu hiệu phải đọc được ngay trong một khung: (1) vỏ ngoài nhăn, có
// đường viền mực bám theo nếp; (2) những túi chứa chất tròn lấp lánh nằm
// dưới màng; (3) bên trong có ti thể (mấy que đỏ) và lưới nội bào.
import * as THREE from 'three';
import { toon, mesh, mulberry, canvasTex, surface } from '../../../../../rig/kit.js';

// da củ: tím mận đậm, có sợi và lỗ chân tăm. Nền tối để nếp nhăn và các
// túi chứa chất sáng lên nổi bật.
const memTex = () => canvasTex(512, 512, (g, w, h) => {
  const r = mulberry(9);
  g.fillStyle = '#6b4bc0'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 700; i++) {
    const x = r() * w, y = r() * h, rad = 8 + r() * 30;
    g.fillStyle = `rgba(${150 + r() * 70 | 0},${115 + r() * 55 | 0},${235 + r() * 20 | 0},${.06 + r() * .13})`;
    g.beginPath(); g.ellipse(x, y, rad, rad * (.4 + r() * .7), r() * 3, 0, 6.3); g.fill();
  }
  // sợi màng chạy chéo
  g.strokeStyle = 'rgba(48,30,102,.34)'; g.lineWidth = 3; g.lineCap = 'round';
  for (let i = 0; i < 40; i++) {
    g.beginPath();
    let x = r() * w, y = r() * h;
    g.moveTo(x, y);
    for (let k = 0; k < 5; k++) { x += (r() - .5) * 80; y += (r() - .5) * 80; g.lineTo(x, y); }
    g.stroke();
  }
  // lỗ chân tăm
  for (let i = 0; i < 60; i++) {
    const x = r() * w, y = r() * h, rad = 3 + r() * 7;
    g.fillStyle = 'rgba(48,32,100,.22)';
    g.beginPath(); g.arc(x, y, rad, 0, 6.3); g.fill();
    g.strokeStyle = 'rgba(220,210,255,.16)'; g.lineWidth = 2;
    g.beginPath(); g.arc(x, y, rad, 0, 6.3); g.stroke();
  }
});

// ti thể: que đỏ có gân (crista) chạy ngang
const mitoTex = () => canvasTex(256, 128, (g, w, h) => {
  const r = mulberry(21);
  g.fillStyle = '#d8563f'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(120,32,24,.55)'; g.lineWidth = 5;
  for (let i = 0; i < 16; i++) {
    const x = (i + .5) / 16 * w;
    g.beginPath(); g.moveTo(x, 6); g.lineTo(x + (r() - .5) * 10, h - 6); g.stroke();
  }
  g.fillStyle = 'rgba(255,190,150,.18)';
  for (let i = 0; i < 60; i++) g.fillRect(r() * w, r() * h, 6 + r() * 12, 4 + r() * 8);
});

export function bauTauTien({ r = .30, seed = 4 } = {}) {
  const g = new THREE.Group();
  const rnd = mulberry(seed);
  const skin = toon('#ffffff', { map: memTex() });

  // ── vỏ củ: quả trứng hướng về khe, bề mặt nhăn nheo ────────────────
  const blob = (phi, th) => {
    const st = Math.sin(th), ct = Math.cos(th);
    const nx = st * Math.sin(phi), ny = ct, nz = st * Math.cos(phi);
    // nếp nhăn: nhiều đợt sóng chồng nhau → nét mực bám theo nếp
    const w = 1
      + .115 * Math.sin(3.4 * phi + 2.1 * th + .6)
      + .070 * Math.sin(6.7 * phi - 2.9 * th + 1.4)
      + .050 * Math.cos(4.3 * th + .9)
      + .034 * Math.sin(9.1 * phi + 4.2 * th + 2.2);
    // hơi dẹp, và mặt quay khe (+x) thì lõm nhẹ — một mặt phẳng phát thí
    const flat = 1 - .18 * Math.max(0, nx) ** 3;
    return [nx * r * 1.16 * w * flat, ny * r * .96 * w, nz * r * 1.02 * w];
  };
  const body = mesh(surface(72, 54, (u, v) => blob(u * Math.PI * 2, (1 - v) * Math.PI)), skin, [0, 0, 0]);
  g.add(body);

  // điểm trên vỏ, dùng để đặt túi chứa chất và ti thể bám đúng chỗ
  const onSkin = (phi, th, out = 0) => {
    const p = blob(phi, th);
    const n = new THREE.Vector3(p[0] / (r * 1.16), p[1] / (r * .96), p[2] / (r * 1.02)).normalize();
    return new THREE.Vector3(p[0] + n.x * out, p[1] + n.y * out, p[2] + n.z * out);
  };

  // ── túi chứa chất: những bóng nhỏ nằm dưới màng, khắp củ ─────────────
  const ves = [];
  const vmat = toon('#dcd0ff');
  for (let i = 0; i < 30; i++) {
    // dồn về phía mặt phẳng (+x) — chỗ phóng thí — nhưng vẫn rải khắp củ
    const phi = rnd() * Math.PI * 2;
    const th = Math.acos(1 - 2 * rnd()) * (rnd() < .55 ? .55 : 1);
    const rr = .012 + rnd() * .007;
    const p = onSkin(phi, th, -rr * .55);        // chìm gần hết vào trong
    const v2 = mesh(new THREE.SphereGeometry(rr, 10, 8), vmat, [p.x, p.y, p.z]);
    g.add(v2); ves.push(v2);
  }
  // túi đang kết dính với mặt phẳng: to hơn, sáng hơn, nằm sát +x
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + .4;
    const p = onSkin(a, Math.PI * .5, .002);
    const rr = .016 + rnd() * .005;
    const v2 = mesh(new THREE.SphereGeometry(rr, 12, 9), toon('#efe2c8'), [p.x, p.y, p.z]);
    g.add(v2); ves.push(v2);
  }

  // ── ti thể: hai que đỏ nằm dọc theo vỏ ──────────────────────────────
  const mito = toon('#ffffff', { map: mitoTex() });
  for (let i = 0; i < 3; i++) {
    const phi = 1.1 + i * 2.1, th = Math.PI * .62 + (rnd() - .5) * .5;
    const p = onSkin(phi, th, .012);
    const m = mesh(new THREE.CapsuleGeometry(.026, .12, 4, 10), mito, [p.x, p.y, p.z]);
    m.rotation.set(rnd() * 3, rnd() * 3, phi);
    g.add(m);
  }

  // ── lúm trống: chỗ đã thả ra phân tử, nằm trên mặt phẳng (+x) ────────
  for (let i = 0; i < 5; i++) {
    const a = rnd() * Math.PI * 2, rad = .06 + rnd() * .10;
    const th = Math.acos(Math.max(-1, Math.min(1, 1 - rad / r * .8)));
    const p = onSkin(a, th, .002);
    g.add(mesh(new THREE.TorusGeometry(.016, .005, 6, 12), toon('#5a44a0'),
      [p.x, p.y, p.z], { rot: [0, Math.PI / 2, 0] }));
  }

  // ── vành quanh mặt phẳng: một đường viền nổi, sáng, để củ có viền rõ ─
  const edge = mesh(new THREE.TorusGeometry(r * .80, .014, 8, 30), toon('#c9b6ff'), [r * .52, 0, 0], { rot: [0, Math.PI / 2, 0] });
  g.add(edge);
  // và một vòng sáng thứ hai ở mép sau: tách củ khỏi nền tím của màng
  const back = mesh(new THREE.TorusGeometry(r * .74, .010, 8, 26), toon('#8f78e0'), [-r * .40, 0, 0], { rot: [0, Math.PI / 2, 0] });
  g.add(back);

  g.vesicles = ves;
  // mặt có túi chứa chất quay về +z: đứng riêng cũng nhìn ra mặt đó
  g.rotation.y = -Math.PI / 2;
  return g;
}

export const PROP = { name: 'củ tế bào', view: () => bauTauTien() };
