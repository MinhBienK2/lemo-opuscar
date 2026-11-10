// Hạt gạo: một hạt trắng dài có nếp nhăn, một hạt bị cưa đôi để thấy tinh bột
// bên trong, và một lớp gạo trong nồi (lớp dày lên và trắng hơn khi chín).
import * as THREE from 'three';
import { toon, mesh, mulberry, clamp, canvasTex } from '../../../../../rig/kit.js';

const RICE = '#f2ead8';

// Vân của một mớ cơm: vẽ sẵn hạt trên texture để mặt trên của lớp gạo trông như
// một mớ hạt dồn kín, chứ không phải một mặt trơn có vài hạt rơi vương trên.
// Hạt vẽ có chút sáng ở trên và bóng ở dưới để mớ cơm có khối, không phải
// một mảng trắng nhạt khi đèn trong nồi rọi vào.
function riceGrainTex(count = 1400, len = 20) {
  return canvasTex(1024, 1024, (g, w, h) => {
    const r = mulberry(23);
    // kẽ giữa các hạt phải đủ tối: mặt trên lớp gạo dưới đèn trong nồi thì
    // trắng bệch, đọc ra là một tấm đĩa trơn chứ không phải một mớ cơm.
    g.fillStyle = '#c3ad80'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < count; i++) {
      const x = r() * w, y = r() * h, a = r() * Math.PI, L = len + r() * len;
      g.save(); g.translate(x, y); g.rotate(a);
      g.fillStyle = 'rgba(112,90,55,.60)';                    // kẽ giữa các hạt
      g.beginPath(); g.ellipse(0, 0, L * .5, L * .22, 0, 0, 7); g.fill();
      g.fillStyle = r() > .5 ? '#f7eeda' : '#e6d5ad';          // thân hạt
      g.beginPath(); g.ellipse(0, 0, L * .5, L * .21, 0, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,252,240,.40)';                  // sáng trên hạt
      g.beginPath(); g.ellipse(-L * .06, -L * .07, L * .30, L * .10, 0, 0, 7); g.fill();
      g.strokeStyle = 'rgba(98,78,46,.60)'; g.lineWidth = 1.8; g.stroke();
      g.restore();
    }
  });
}

// Vân của mặt cắt: các hạt bị cưa, thấy hình bầu dục trắng nằm cạnh nhau.
// Vân vẽ trên một tờ đúng tỉ lệ với mặt cắt (rộng gấp 3 lần cao), nên hạt vẽ ra
// dài đúng bằng hạt gạo thật (~7 mm), không bị kéo giãn: `len` là chiều dài hạt
// tính bằng pixel trên tờ 2048×680 phủ 26,4 cm × 8,7 cm.
// Mỗi hạt có sáng ở trên và bóng ở dưới để đọc ra là hạt có khối, không phải
// một hình ellipse phẳng dán lên mặt.
function riceCutTex(count = 1400, len = 46, hpx = 680) {
  return canvasTex(2048, hpx, (g, w, h) => {
    const r = mulberry(31);
    g.fillStyle = '#b8a479'; g.fillRect(0, 0, w, h);                 // kẽ giữa các hạt
    for (let i = 0; i < count; i++) {
      const x = r() * w, y = r() * h, a = (r() - .5) * 1.1, L = len * (.7 + r() * .6);
      g.save(); g.translate(x, y); g.rotate(a);
      g.fillStyle = 'rgba(84,66,38,.55)';
      g.beginPath(); g.ellipse(1.2, 1.6, L * .5, L * .23, 0, 0, 7); g.fill();
      const grd = g.createLinearGradient(0, -L * .22, 0, L * .22);
      grd.addColorStop(0, '#fff8e6'); grd.addColorStop(.55, r() > .5 ? '#f2e7c8' : '#eadfc0');
      grd.addColorStop(1, '#cdbb93');
      g.fillStyle = grd;
      g.beginPath(); g.ellipse(0, 0, L * .5, L * .22, 0, 0, 7); g.fill();
      g.strokeStyle = 'rgba(104,84,50,.65)'; g.lineWidth = 1.6; g.stroke();
      g.restore();
    }
  });
}

export function gachGao(opts = {}) {
  const g = new THREE.Group();
  const s = opts.scale || 1;
  const grain = mesh(new THREE.SphereGeometry(1, 14, 10), toon(opts.color || RICE), [0, 0, 0]);
  grain.scale.set(.0080 * s, .0034 * s, .0048 * s);
  g.add(grain);
  // nếp nhăn dọc theo hạt: một gờ thấp nằm áp trên mặt hạt. Nếu để nó là một
  // thanh hộp thẳng, hai đầu thang lơ lửng trên mặt hạt và hạt đọc ra là một
  // viên trắng có cây gạt bên trên, không phải một hạt gạo. Gờ này không có viền
  // mực: một vòng mực quanh gờ đọc ra là một vòng trôi lơ lửng trên hạt.
  const crease = mesh(new THREE.SphereGeometry(1, 14, 8), toon('#c9bb98'), [0, 0, 0]);
  crease.scale.set(.0050 * s, .00055 * s, .00075 * s);
  crease.position.set(0, .0029 * s, 0);
  crease.layers.set(1);
  g.add(crease);
  return g;
}

// một hạt bị cưa đôi: mặt cắt trắng, các tinh bột phình ra.
// Hạt được cưa theo chiều dài: mặt cắt là một mặt phẳng ở z = 0, quay về phía máy quay (+z).
// Mặt cắt là một mặt hơi cong, không phải một đĩa phẳng, và các tinh bột là những núm
// nhỏ có khối, nên dưới đèn chính chúng bắt sáng và có bóng: đọc ra là một hạt gạo thật.
export function gachGaoCat(opts = {}) {
  const g = new THREE.Group();
  const s = opts.scale || 1;
  // nửa hạt kín: vòm quay vào sau, mặt cưa ở z = 0 quay về phía máy quay
  const prof = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0)];
  for (let i = 1; i <= 14; i++) {
    const t = i / 14 * Math.PI / 2;
    prof.push(new THREE.Vector2(Math.cos(t), -Math.sin(t)));
  }
  const geo = new THREE.LatheGeometry(prof, 22);
  geo.rotateX(Math.PI / 2);
  const body = new THREE.Mesh(geo, toon('#dbc9a0'));
  body.scale.set(.0090 * s, .0038 * s, .0054 * s);
  // hạt phải đổ bóng xuống mặt gạo: một hạt phẳng dán lên nền không có bóng
  // thì đọc ra là một hình vẽ, không phải một vật trong không gian
  body.castShadow = true;
  g.add(body);
  // mặt cưa hơi lồi: mặt phẳng tuyệt đối thì không bắt sáng, đọc ra là một
  // hình bầu dẹt vẽ tay
  const cap = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), toon('#e6d7b0'));
  cap.scale.set(.0090 * s, .0038 * s, .0016 * s);
  cap.position.z = .0006 * s;
  cap.castShadow = true;
  g.add(cap);
  // các tinh bột: những núm nhỏ trồi lên trên mặt cắt, màu trắng, to đủ để thấy.
  // Núm phải nằm đúng trên mặt cắt: mặt cắt cong nên độ cao mỗi núm tính theo
  // vị trí của nó, đặt cùng một độ cao thì núm ở rìa sẽ lơ lửng.
  const r = mulberry(4);
  const nGr = opts.grains ?? 44;
  const capZ = (x, y) => {
    const u = x / (.0090 * s), v = y / (.0038 * s);
    return .0006 * s + .0016 * s * Math.sqrt(Math.max(0, 1 - u * u - v * v));
  };
  for (let i = 0; i < nGr; i++) {
    const x = (r() - .5) * .0150 * s, y = (r() - .5) * .0050 * s;
    const m = mesh(new THREE.SphereGeometry(.00050 * s, 10, 8), toon('#f4e8ca'),
      [x, y, capZ(x, y) + .0002 * s], { cast: true });
    m.scale.z = .38;
    // núm tinh bột không có viền mực riêng: một núm trắng viền đậm đọc ra là một
    // viên sỏi trắng đặt trên hình, không phải tinh bột trong hạt gạo
    m.layers.set(1);
    g.add(m);
  }
  return g;
}

// một lớp gạo trong nồi: nhiều hạt nằm chồng, co lại dần theo bán kính nồi.
// half: chỉ giữ nửa sau (z <= 0) để lớp gạo không che mặt cắt của nồi.
export function lopGao({ R = .130, y = 0, h = .055, n = 520, seed = 5, cooked = 0, half = false, gs = 1 } = {}) {
  const r = mulberry(seed);
  const g = new THREE.Group();

  // ── khối cơm: trụ có vai bo, đỉnh là một mặt tròn phẳng ──
  const prof = [];
  const N = 7;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    prof.push(new THREE.Vector2(R * (1 - .10 * u), h * .94 * u));
  }
  prof.push(new THREE.Vector2(R * .80, h), new THREE.Vector2(0, h));
  const coreMat = toon('#e6dcc2');
  const coreGeo = half
    ? new THREE.LatheGeometry(prof, 40, Math.PI / 2, Math.PI)
    : new THREE.LatheGeometry(prof, 40);
  const core = mesh(coreGeo, coreMat, [0, 0, 0], { parent: g });

  // mặt trên: một đĩa tròn có vân hạt, nằm trên đỉnh khối cơm
  //
  // Đĩa phải nằm đúng nửa sau (z < 0) như thân nồi bị cưa, và đúng chỗ các hạt
  // rời nằm. CircleGeometry quét góc trong mặt phẳng XY, rồi đĩa được xoay
  // -90° quanh trục X: toạ độ cục bộ y rơi thành toạ độ thế giới -z. Nửa sau
  // (z < 0) là nửa có sin y >= 0, tức góc từ 0 đến PI. Quét từ PI/2 như trước
  // đây thì đĩa nằm ở nửa TRÁI (x < 0) và tràn ra cả phía trước mặt phẳng
  // cưa: đọc ra như một cái đĩa đặt nghiêng lên lớp gạo.
  // Hạt trên mặt trên phải ra đúng cỡ thật (~7 mm): vân lặp quá dày thì hạt bé
  // như một vệt mịn, mặt lớp gạo đọc ra là một tấm đĩa trơn.
  const topTex = riceGrainTex(1400, 20); topTex.repeat.set(1.0, 1.0);
  const topGeo = half
    ? new THREE.CircleGeometry(R * .80, 40, 0, Math.PI)
    : new THREE.CircleGeometry(R * .80, 40);
  // màu vật liệu trắng: để vân hạt trên tấm thể hiện đúng màu đã vẽ, không bị
  // nhân thêm một lớp kem làm mặt trên thành một tấm đĩa trơn
  const top = mesh(topGeo, toon('#ffffff', { map: topTex }), [0, h + .0008, .0008], { parent: g });
  top.rotation.x = -Math.PI / 2;

  // ── mặt cắt của lớp gạo (nửa sau): từng hạt là một vật thể có khối ──
  // Mặt cưa không phải một tấm hình vẽ. Mỗi hạt gạo bị cưa là một nửa hạt
  // thật: một nửa ellipsoid có mặt cưa quay về phía máy quay, nằm sát nhau
  // trên một nền tối và đổ bóng lên nhau. Chính cái bóng giữa các hạt là thứ
  // phân biệt một mớ gạo thật với một bức tranh hạt vẽ trên giấy.
  // tờ vân phải đúng tỉ lệ với lớp gạo này: lớp cơm khô thấp hơn thì tờ vân
  // cũng thấp hơn, nếu không các hạt bị bóp dẹt, đọc ra là một mặt trơn
  const cutTex = riceCutTex(1400, 46, Math.max(140, Math.round(680 * h / .087)));
  cutTex.repeat.set(1, 1);
  if (half) {
    const shp = new THREE.Shape();
    shp.moveTo(prof[0].x, prof[0].y);
    for (const p of prof) shp.lineTo(p.x, p.y);
    for (let i = prof.length - 2; i >= 0; i--) shp.lineTo(-prof[i].x, prof[i].y);
    shp.lineTo(prof[0].x, prof[0].y);
    const cutGeo = new THREE.ShapeGeometry(shp);
    // toạ độ vân: u theo bề ngang, v theo chiều cao, để hạt vẽ ra đúng cỡ thật
    const P2 = cutGeo.attributes.position, UV = cutGeo.attributes.uv;
    for (let i = 0; i < P2.count; i++) {
      UV.setXY(i, (P2.getX(i) + R) / (2 * R), P2.getY(i) / h);
    }
    UV.needsUpdate = true;
    // nền sau các nửa hạt: một mặt tối, chỉ để các nửa hạt đổ bóng xuống
    const back = mesh(cutGeo, toon('#8a7952'), [0, 0, -.0048], { parent: g });
    back.receiveShadow = true;
    // mặt cưa vẽ bằng vân: dùng cho các khung rộng, khi hạt thật quá nhỏ mà
    // viền mực của chúng dính thành một mảng đen
    const cutFace = mesh(cutGeo, toon('#ffffff', { map: cutTex }), [0, 0, -.0012], { parent: g });
    cutFace.receiveShadow = true;

    // các nửa hạt: một nửa hạt kín (vòm + mặt cưa phẳng), vòm quay vào trong
    // lớp gạo, mặt cưa phẳng quay về phía máy quay
    const prof2 = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0)];
    for (let i = 1; i <= 6; i++) {
      const t = i / 6 * Math.PI / 2;
      prof2.push(new THREE.Vector2(Math.cos(t), -Math.sin(t)));
    }
    const halfGeo = new THREE.LatheGeometry(prof2, 10);
    halfGeo.rotateX(Math.PI / 2);       // đáy phẳng quay về phía máy quay, vòm quay vào trong
    const cutMat = toon('#f0e5c8');
    // hạt phải kín kẽ: hạt nằm sát nhau như một mớ cơm, kẽ hở nhiều thì đọc ra
    // là những miếng bánh rời rạc trên một mặt nâu
    const cols = 52, rows = 26;
    const cutIm = new THREE.InstancedMesh(halfGeo, cutMat, cols * rows);
    cutIm.castShadow = true; cutIm.receiveShadow = true; cutIm.frustumCulled = false;
    // nửa hạt phải nằm ở lớp 0: lớp 1 không được vẽ vào bản đồ bóng, hạt ở
    // lớp 1 thì không đổ bóng, mà bóng giữa các hạt mới là thứ cho ta biết đó
    // là một mớ cơm thật chứ không phải một bức tranh hạt vẽ
    g.add(cutIm);
    const cM = new THREE.Matrix4(), cP = new THREE.Vector3(), cQ = new THREE.Quaternion(),
      cS = new THREE.Vector3(), cE = new THREE.Euler();
    let ci = 0;
    for (let j = 0; j < rows; j++) {
      const yy = h * (j + .5) / rows;
      // bề rộng của lớp gạo ở cao độ này, theo đúng đường viền đã dựng
      const u = Math.min(1, yy / (h * .94));
      let w = R * (1 - .10 * u);
      if (yy > h * .94) w = R * (.90 - .10 * (1 - (yy - h * .94) / (h * .06)));
      for (let i = 0; i < cols; i++) {
        const xx = (-w + (i + .5) * (2 * w) / cols) + (r() - .5) * .0016;
        cP.set(xx, yy + (r() - .5) * .0012, .0004 + (r() - .5) * .0008);
        cE.set(0, 0, (r() - .5) * .38);
        cQ.setFromEuler(cE);
        cS.set(.0035 * gs, .0015 * gs, .0026 * gs);
        cM.compose(cP, cQ, cS);
        cutIm.setMatrixAt(ci++, cM);
      }
    }
    cutIm.count = ci;
    cutIm.instanceMatrix.needsUpdate = true;
    // hai kiểu mặt cưa: hạt thật khi máy vào sát, vân vẽ khi máy ở xa
    cutIm.visible = false;
    back.visible = false;
    g.setCutDetail = on => {
      cutIm.visible = !!on;
      back.visible = !!on;
      cutFace.visible = !on;
    };
  }

  // ── các hạt rời nằm trên mặt lớp gạo ──
  // Hạt nhỏ, nằm hơi chìm vào khối cơm và cùng màu với khối: mặt trên đọc ra là một
  // mớ cơm dồn nhẹ, không phải một hàng đá sỏi viền mực đậm.
  // Hạt phải nằm TRÊN mặt đĩa tròn (bán kính .80R), không phải chuim xuống dưới
  // nó: hạt chìm hơn thì bị đĩa che mất, mớ cơm trông như một mặt trơn.
  const geo = new THREE.SphereGeometry(1, 8, 6);
  const mat = toon('#e6dcc2');
  const im = new THREE.InstancedMesh(geo, mat, n);
  // các hạt rời nằm trên lớp hiệu ứng: không có viền mực. Một hạt nhỏ có viền mực
  // riêng sẽ đọc ra thành một mớ nét đen, không phải một mớ cơm.
  // Hạt vẫn đổ bóng: mớ cơm trắng dưới nắng thì cháy trắng, chỉ có bóng của từng
  // hạt mới cho ta biết đó là những hạt gạo chứ không phải một khối bột.
  im.layers.set(1);
  im.castShadow = true;
  im.receiveShadow = false;
  g.add(im);
  const M = new THREE.Matrix4(), P = new THREE.Vector3(), Q = new THREE.Quaternion(), Sc = new THREE.Vector3(), E = new THREE.Euler();
  // chiều cao mặt trên theo bán kính, để hạt nằm đúng trên mặt khối cơm
  const topY = rad => (rad <= R * .80 ? h : h * .94 * Math.min(1, (1 - rad / R) / .10));
  const grains = [];
  for (let i = 0; i < n; i++) {
    const rad = Math.sqrt(r()) * R * .76, a = r() * Math.PI * 2;
    const x = Math.cos(a) * rad, z = Math.sin(a) * rad;
    if (half && z > 0) { i--; continue; }                 // chỉ rải ở nửa sau
    if (half && Math.abs(z) < .010) { i--; continue; }    // chừa mặt cắt cho tấm vân
    grains.push({ x, z, y: topY(rad) + .0012 * gs, rx: (r() - .5) * .9, ry: r() * 6, rz: (r() - .5) * .9, s: .75 + r() * .45 });
  }
  im.count = grains.length;
  const set = k => {
    const c = clamp(k);
    const sw = 1 + .12 * c;
    core.scale.y = sw;
    coreMat.color.set('#e6dcc2').lerp(new THREE.Color('#f7f0dc'), c);
    // lớp gạo tự phát sáng nhẹ: trong bóng của nồi, cơm vẫy phải trắng, nhưng
    // không được sáng tới mức cháy trắng, mất hết vân hạt
    const e = .02 + .05 * c;
    coreMat.emissive.setRGB(e * .82, e * .78, e * .66);
    top.material.emissive.setRGB(e * .82, e * .78, e * .66);
    mat.color.set('#e6dcc2').lerp(new THREE.Color('#f7f0dc'), c);
    mat.emissive.setRGB(e * .6, e * .58, e * .5);
    for (let i = 0; i < grains.length; i++) {
      const gr = grains[i];
      const sc = gr.s * (1 + .18 * c);
      P.set(gr.x, gr.y * sw, gr.z);
      E.set(gr.rx, gr.ry, gr.rz); Q.setFromEuler(E);
      Sc.set(.0058 * sc * gs, .0021 * sc * gs, .0034 * sc * gs);
      M.compose(P, Q, Sc);
      im.setMatrixAt(i, M);
    }
    im.instanceMatrix.needsUpdate = true;
  };
  set(cooked);
  g.setCooked = set;
  g.position.y = y;
  g.grains = im;
  g.top = top;
  return g;
}

export const PROP = { name: 'hạt gạo', view: () => gachGao() };
