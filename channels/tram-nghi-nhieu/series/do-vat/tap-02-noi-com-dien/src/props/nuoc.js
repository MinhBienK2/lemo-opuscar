// Lớp nước trong nồi: nửa vòng nước phía sau mặt cắt, mặt cắt ở z = 0, mực nước
// hạ được dần (setLevel), kèm bọt bốc lên khi nước sôi (setBoil).
import * as THREE from 'three';
import { toon, mesh, fxLayer, mulberry, clamp, canvasTex } from '../../../../../rig/kit.js';
import { fizz } from '../../../../../rig/cutaway.js';

export function nuocNoi(opts = {}) {
  const R = opts.R || .136;          // bán kính trong của nồi
  const r0 = opts.r0 || R * .72;     // bán kính ở đáy lớp nước
  const bottom = opts.bottom || 0;
  const g = new THREE.Group();

  const bodyMat = toon('#63bcd8', { transparent: true, opacity: .80, depthWrite: false });
  // Mặt cắt của lớp nước có sắc độ: sâu thì tối, nông thì sáng. Một tấm bạc hà
  // đồng nhất đọc ra là một mảng màu dán, không phải một thể chất lỏng.
  const faceTex = canvasTex(64, 256, (c, w, h) => {
    const r = mulberry(17);
    const grd = c.createLinearGradient(0, h, 0, 0);   // v = 0 ở đáy nồi
    grd.addColorStop(0, '#1f6b88');
    grd.addColorStop(.40, '#3f9cbd');
    grd.addColorStop(.82, '#74c0dd');
    grd.addColorStop(1, '#a8dced');
    c.fillStyle = grd; c.fillRect(0, 0, w, h);
    // vài vệt sáng nằm ngang: mặt nước có phản chiếu, không phải một tấm nhựa
    for (let i = 0; i < 30; i++) {
      const y = h - Math.pow(r(), 1.7) * h;
      c.fillStyle = `rgba(232,250,255,${.05 + r() * .10})`;
      c.fillRect(0, y, w, 1.5 + r() * 4);
    }
  });
  const faceMat = toon('#ffffff', { map: faceTex, transparent: true, opacity: .90, side: THREE.DoubleSide });
  const body = new THREE.Mesh(new THREE.BufferGeometry(), bodyMat);
  const face = new THREE.Mesh(new THREE.BufferGeometry(), faceMat);
  body.renderOrder = 3; face.renderOrder = 3;
  g.add(body, face);
  // đường meniscus: một vòng sáng ở mặt nước, nằm đúng nửa sau (nửa đã bị cưa mất)
  const lineGeo = new THREE.TorusGeometry(R, .004, 6, 48, Math.PI);
  lineGeo.rotateZ(Math.PI);            // quay nửa vòng sang phía sau, khớp với mặt cắt
  const line = mesh(lineGeo, toon('#e8faff', { emissive: new THREE.Color('#8fd8ee').multiplyScalar(.5) }), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] });
  g.add(line);
  // mép mặt nước ở mặt cắt: một sáng mảnh chạy ngang theo đường kính. Không có
  // nó thì lớp nước chỉ là một tấm bạc hà với mép trên thẳng tuyệt đối, đọc ra
  // là một mảng bìa dán, không phải mặt nước.
  const surf = mesh(new THREE.CylinderGeometry(.0016, .0016, 1, 8),
    toon('#dff2fb', { emissive: new THREE.Color('#8fd8ee').multiplyScalar(.14) }), [0, 0, .0018], { rot: [0, 0, Math.PI / 2] });
  fxLayer(surf);
  g.add(surf);

  let level = 0;
  const rebuild = y => {
    level = y;
    const pts = [];
    const N = 12;
    for (let i = 0; i <= N; i++) {
      const yy = bottom + (y - bottom) * i / N;
      const rr = r0 + (R - r0) * Math.min(1, (yy - bottom) / Math.max(.001, y - bottom));
      pts.push(new THREE.Vector2(Math.max(.004, rr), yy));
    }
    const outline = [new THREE.Vector2(0, bottom), ...pts, new THREE.Vector2(0, y)];
    body.geometry.dispose();
    body.geometry = new THREE.LatheGeometry(outline, 48, Math.PI / 2, Math.PI);
    // mặt cắt ở z = 0: hình giữa đáy nồi và mặt nước
    const s = new THREE.Shape();
    s.moveTo(-pts[pts.length - 1].x, y);
    for (let i = pts.length - 1; i >= 0; i--) s.lineTo(-pts[i].x, pts[i].y);
    s.lineTo(0, bottom); s.lineTo(pts[0].x, bottom);
    for (let i = 0; i < pts.length; i++) s.lineTo(pts[i].x, pts[i].y);
    s.lineTo(pts[pts.length - 1].x, y);
    face.geometry.dispose();
    face.geometry = new THREE.ShapeGeometry(s);
    // toạ độ vân của mặt cắt: v đo chiều sâu, u đo chiều ngang, để sắc độ đi
    // đúng từ đáy nồi lên mặt nước
    const FP = face.geometry.attributes.position, FUV = face.geometry.attributes.uv;
    for (let i = 0; i < FP.count; i++) {
      FUV.setXY(i, (FP.getX(i) + R) / (2 * R), (FP.getY(i) - bottom) / Math.max(.001, y - bottom));
    }
    FUV.needsUpdate = true;
    // mép mặt nước nơi cắt: một sáng mảnh chạy ngang, đọc ra là mặt chất lỏng
    // ống nằm dọc theo trục y của nó, nên phải kéo dài theo y (trục ống), không
    // phải theo x
    surf.position.set(0, y, .0018);
    surf.scale.set(1, 2 * R, 1);
    line.position.y = y;
    line.scale.setScalar(1);
  };
  rebuild(opts.level ?? bottom + .05);

  // bọt bốc lên ở mặt nước
  let boil = 0;
  const V = { rIn: yy => (r0 + (R - r0) * clamp((yy - bottom) / Math.max(.001, V.level - bottom))) * .90, level: level, bottom, cut: Math.PI };
  const F = fizz(V, { n: 110, sites: 10, seed: 9, rate: () => boil, r0: .0022, rDetach: .007, grow: .009, rise: .55, acc: 1.4 });
  // bọt nằm trên lớp hiệu ứng: không có viền mực, nếu không mỗi bọt lại thành một
  // vòng đen và cả lớp nước trông như đám mây
  F.mesh.layers.set(1);
  g.add(F.mesh);
  // Bong bóng phải có vị trí ngay từ lúc dựng: InstancedMesh mà chưa được đặt
  // ma trận thì mọi hạt nằm ở gốc toạ độ với kích thước 1 — tức là một quả cầu
  // trắng khổng lồ che kín vật. Khung nào không gọi update() (khung dựng riêng để
  // soi vật) sẽ thấy đúng quả cầu đó.
  F.update(0);

  // ── dải bọt sôi ở vạch nước ──
  // Lớp nước nằm ở đáy nồi, lớp gạo nằm trên, nên mặt nước không thấy từ trên
  // xuống; dải bọt sôi dâng dọc theo mép mặt cắt là thứ đọc ra được là nước đang
  // sôi. Không bọt thì mặt nước phẳng lì.
  const foamN = 22;
  const foam = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8),
    toon('#e8f6ff', { emissive: new THREE.Color('#9fd0e4').multiplyScalar(.08) }), foamN);
  foam.frustumCulled = false; foam.castShadow = false;
  foam.layers.set(1);
  g.add(foam);
  const fr = mulberry(5);
  const foams = [];
  for (let i = 0; i < foamN; i++) foams.push({ x: (i / (foamN - 1) - .5) * 2 * R * .94, p: fr(), s: .6 + fr() * .8 });
  const fM = new THREE.Matrix4(), fP = new THREE.Vector3(), fQ = new THREE.Quaternion(), fS = new THREE.Vector3();

  // Dải bọt cũng phải có vị trí ngay từ lúc dựng, lý do như bong bóng ở trên.
  const layoutFoam = t => {
    const k = clamp(boil);
    for (let i = 0; i < foamN; i++) {
      const f = foams[i];
      const w = Math.sin(t * 2.4 + f.p * 6.3) * .5 + .5;
      const rr = (.0011 + .0012 * w) * f.s * (.38 + .62 * k);
      fP.set(f.x, level - .0022 - rr * .3, .0026);
      fS.set(rr * 1.5, rr * .60, rr);
      fM.compose(fP, fQ, fS);
      foam.setMatrixAt(i, fM);
    }
    foam.instanceMatrix.needsUpdate = true;
  };

  g.setBoil = k => { boil = clamp(k); };
  g.setLevel = y => {
    rebuild(y);
    V.level = y;
    F.update(0);
    layoutFoam(0);
  };
  g.update = t => {
    F.update(t);
    layoutFoam(t);
  };
  layoutFoam(0);
  g.faceMat = faceMat; g.bodyMat = bodyMat;
  return g;
}

export const PROP = { name: 'lớp nước trong nồi', view: () => nuocNoi() };
