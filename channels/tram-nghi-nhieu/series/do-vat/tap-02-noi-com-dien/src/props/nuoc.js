// Lớp nước trong nồi: một khối nước thật nằm trong nồi.
//  - mặt nước phẳng ngang ở mực `level`, mép meniscus cong lên ở chỗ nước
//    chạm thành, gợn sóng chạy trên mặt nước
//  - thân nước bán trong suốt; mặt cắt ở z = 0 có sắc độ đi từ sâu (tối) ra
//    nông (sáng) để đọc ra một thể chất lỏng chứ không phải một tấm bạc hà
//  - mực nước hạ được dần (setLevel), bọt bốc lên khi nước sôi (setBoil)
// Khi bật `opts.pot`, dựng thêm một đoạn thành nồi nhôm đứng quanh phía trên
// và phía sau lớp nước: không có nó, lớp nước đứng một mình đọc ra là một
// khay thủy tinh rỗng đặt trên bàn, chứ không phải nước TRONG nồi.
import * as THREE from 'three';
import { toon, mesh, mulberry, clamp, canvasTex } from '../../../../../rig/kit.js';
import { fizz } from '../../../../../rig/cutaway.js';

export function nuocNoi(opts = {}) {
  const R = opts.R || .136;          // bán kính nước ở chỗ chạm thành nồi
  const r0 = opts.r0 || R * .72;     // bán kính nước ở đáy
  const bottom = opts.bottom || 0;   // cao độ đáy lớp nước
  const withPot = !!opts.pot;        // có dựng thêm đoạn thành nồi nhôm không
  const g = new THREE.Group();

  const MEN_RISE = R * .022;         // meniscus dâng lên ở chỗ nước chạm thành
  const MEN_W = R * .10;             // bề rộng mép meniscus
  const WALL_T = R * .10;            // độ dày thành nồi nhôm
  const POT_UP = R * .17;            // phần thành nồi nhô lên trên mặt nước

  // ── chất liệu ──
  // Mặt cắt của lớp nước có sắc độ: sâu thì tối, nông thì sáng. Một tấm bạc hà
  // đồng nhất đọc ra là một mảng màu dán, không phải một thể chất lỏng.
  const faceTex = canvasTex(64, 256, (c, w, h) => {
    const r = mulberry(17);
    const grd = c.createLinearGradient(0, h, 0, 0);   // v = 0 ở đáy nồi
    grd.addColorStop(0, '#0f4f68');
    grd.addColorStop(.35, '#237fa2');
    grd.addColorStop(.78, '#4fb2d1');
    grd.addColorStop(1, '#9adcee');
    c.fillStyle = grd; c.fillRect(0, 0, w, h);
    // vài vệt sáng nằm ngang: mặt nước có phản chiếu, không phải một tấm nhựa
    for (let i = 0; i < 26; i++) {
      const y = h - Math.pow(r(), 1.6) * h;
      c.fillStyle = `rgba(232,250,255,${.04 + r() * .07})`;
      c.fillRect(0, y, w, 1 + r() * 3);
    }
  });
  const faceMat = toon('#ffffff', { map: faceTex, transparent: true, opacity: .92, side: THREE.DoubleSide });
  // Thân nước bán trong suốt: nhìn xuyên qua lớp nước thấy được thành nồi
  // phía sau, đó là thứ làm cho nó đọc ra là nước chứ không phải nhựa.
  const bodyMat = toon('#6dc3de', { transparent: true, opacity: .50, depthWrite: false });
  // Mặt nước: sáng hơn thân, có gợn sóng đồng tâm và một vệt phản chiếu.
  const surfTex = canvasTex(256, 256, (c, w, h) => {
    const r = mulberry(23);
    c.fillStyle = '#7fc8e1'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {          // gợn sóng: vòng đồng tâm
      const y = r() * h;
      c.fillStyle = `rgba(255,255,255,${.10 + r() * .18})`;
      c.fillRect(0, y, w, 1 + r() * 3);
    }
    c.save(); c.translate(w * .5, h * .5); c.rotate(-.32);   // vệt phản chiếu
    c.fillStyle = 'rgba(255,255,255,.24)';
    c.fillRect(-w, -h * .09, w * 2, h * .18);
    c.restore();
  });
  const surfMat = toon('#ffffff', { map: surfTex, transparent: true, opacity: .90, side: THREE.DoubleSide });

  const body = new THREE.Mesh(new THREE.BufferGeometry(), bodyMat);
  const face = new THREE.Mesh(new THREE.BufferGeometry(), faceMat);
  const surf = new THREE.Mesh(new THREE.BufferGeometry(), surfMat);
  body.renderOrder = 2; surf.renderOrder = 3; face.renderOrder = 4;
  g.add(body, face, surf);

  // mép meniscus: một đường sáng mảnh nằm trên mặt nước, sát chỗ nước chạm
  // thành. Không sáng quá: một vành trắng ở miệng cháy thành vệt mờ làm mất
  // viền mực quanh miệng.
  const beadGeo = new THREE.TorusGeometry(R, .0011, 6, 48, Math.PI);
  beadGeo.rotateZ(Math.PI);          // quay nửa vòng sang phía sau, khớp mặt cắt
  const bead = mesh(beadGeo, toon('#a9dcec'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] });
  g.add(bead);
  // mép mặt nước ở mặt cắt: một sáng mảnh chạy ngang theo đường kính. Không có
  // nó thì lớp nước chỉ là một tấm bạc hà với mép trên thẳng tuyệt đối, đọc ra
  // là một mảng bìa dán, không phải mặt nước.
  const edge = mesh(new THREE.BoxGeometry(1, .0009, .0010), toon('#bfe4f2'), [0, 0, .0009]);
  g.add(edge);
  // gợn sóng nổi trên mặt nước: hai vòng lệch tâm, mảnh và nhạt
  const ripples = [];
  for (const [i, k] of [[0, .42], [1, .70]]) {
    const rg = new THREE.TorusGeometry(R * k, .0011, 6, 40, Math.PI);
    rg.rotateZ(Math.PI);
    const t = mesh(rg, toon('#c6e8f6'), [R * (i ? .04 : -.03), 0, R * (i ? .03 : -.05)],
      { rot: [Math.PI / 2, 0, 0] });
    t.scale.set(1, .92, 1);
    ripples.push(t);
    g.add(t);
  }

  // ── đoạn thành nồi nhôm đứng quanh lớp nước ──
  const pot = new THREE.Group();
  pot.visible = withPot;
  g.add(pot);
  const potMat = toon('#8b929e');       // mặt ngoài thành
  const potFaceMat = toon('#7f8792');   // mặt cắt của thành
  const potBody = new THREE.Mesh(new THREE.BufferGeometry(), potMat);
  const potCutL = new THREE.Mesh(new THREE.BufferGeometry(), potFaceMat);
  const potCutR = new THREE.Mesh(new THREE.BufferGeometry(), potFaceMat);
  pot.add(potBody, potCutL, potCutR);

  let level = 0;
  // cao độ mặt nước tại một điểm trên mặt cắt (meniscus cong lên ở hai mép)
  const surfY = x => {
    const ax = Math.abs(x);
    if (ax <= R - MEN_W) return level;
    const t = clamp((ax - (R - MEN_W)) / MEN_W);
    return level + MEN_RISE * (1 - t) * (1 - t);
  };
  // bán kính lớp nước ở một cao độ (dùng cho bong bóng)
  const rAt = yy => {
    const fil = Math.min(.010, (level + MEN_RISE - bottom) * .30);
    if (yy <= bottom + fil) return r0 + (R - r0) * Math.sin(clamp((yy - bottom) / fil) * Math.PI / 2);
    return R;
  };

  const rebuild = y => {
    level = y;
    const topY = y + MEN_RISE;              // mực nước ở chỗ chạm thành
    // Thành lớp nước: bo tròn ở đáy rồi thẳng lên — đúng hình nồi, nên mặt
    // nước phẳng ngang thật sự.
    const wallPts = [];
    const fil = Math.min(.010, (topY - bottom) * .30);
    const NF = 5;
    for (let i = 0; i <= NF; i++) {
      const t = i / NF;
      wallPts.push(new THREE.Vector2(r0 + (R - r0) * Math.sin(t * Math.PI / 2), bottom + fil * t));
    }
    const NW = 6;
    for (let i = 1; i <= NW; i++) {
      wallPts.push(new THREE.Vector2(R, bottom + fil + (topY - bottom - fil) * i / NW));
    }
    // mép meniscus: cong lên ở chỗ nước chạm thành, rồi mới xuống mặt nước
    const menPts = [];
    const NM = 7;
    for (let i = 0; i <= NM; i++) {
      const t = i / NM;
      menPts.push(new THREE.Vector2(R - MEN_W * t, y + MEN_RISE * (1 - t) * (1 - t)));
    }
    // thân nước: nửa sau, mặt cắt ở z = 0
    body.geometry.dispose();
    body.geometry = new THREE.LatheGeometry([new THREE.Vector2(0, bottom), ...wallPts], 48, Math.PI / 2, Math.PI);
    // mặt nước phẳng + meniscus
    surf.geometry.dispose();
    surf.geometry = new THREE.LatheGeometry([...menPts, new THREE.Vector2(0, y)], 48, Math.PI / 2, Math.PI);
    // mặt cắt ở z = 0: hình giữa đáy nồi và mặt nước
    const s = new THREE.Shape();
    s.moveTo(0, bottom);
    s.lineTo(-wallPts[0].x, bottom);
    for (const p of wallPts) s.lineTo(-p.x, p.y);
    for (const p of menPts) s.lineTo(-p.x, p.y);
    s.lineTo(menPts[menPts.length - 1].x, y);
    for (let i = menPts.length - 1; i >= 0; i--) s.lineTo(menPts[i].x, menPts[i].y);
    for (let i = wallPts.length - 1; i >= 0; i--) s.lineTo(wallPts[i].x, wallPts[i].y);
    s.closePath();
    face.geometry.dispose();
    face.geometry = new THREE.ShapeGeometry(s);
    // toạ độ vân của mặt cắt: v đo chiều sâu, u đo chiều ngang, để sắc độ đi
    // đúng từ đáy nồi lên mặt nước
    const FP = face.geometry.attributes.position, FUV = face.geometry.attributes.uv;
    for (let i = 0; i < FP.count; i++) {
      FUV.setXY(i, (FP.getX(i) + R) / (2 * R), (FP.getY(i) - bottom) / Math.max(.001, topY - bottom));
    }
    FUV.needsUpdate = true;
    // mép meniscus và mép mặt nước ở mặt cắt đi theo mực nước
    const br = R - MEN_W * .30;
    bead.position.y = surfY(br);
    bead.scale.setScalar(br / R);
    edge.position.set(0, y + .0007, .0009);
    edge.scale.set(2 * (R - MEN_W), 1, 1);
    for (const rp of ripples) rp.position.y = y + .0005;
    // ── đoạn thành nồi nhôm: đứng quanh phía trên và phía sau lớp nước ──
    if (withPot) {
      const Ri = R - .0006, Ro = Ri + WALL_T;   // lùi vào trong một chút để che
      const yB = bottom - .0006, yT = topY + POT_UP;   // thành nhô lên trên nước
      const prof = [
        new THREE.Vector2(Ri, yT),
        new THREE.Vector2(Ri, yB),
        new THREE.Vector2(Ro, yB),
        new THREE.Vector2(Ro, yT),
        new THREE.Vector2(Ri, yT),
      ];
      potBody.geometry.dispose();
      potBody.geometry = new THREE.LatheGeometry(prof, 48, Math.PI / 2, Math.PI);
      const cut = (sgn) => {
        const sh = new THREE.Shape();
        sh.moveTo(sgn * Ri, yB); sh.lineTo(sgn * Ro, yB);
        sh.lineTo(sgn * Ro, yT); sh.lineTo(sgn * Ri, yT); sh.closePath();
        return new THREE.ShapeGeometry(sh);
      };
      potCutL.geometry.dispose(); potCutL.geometry = cut(-1);
      potCutR.geometry.dispose(); potCutR.geometry = cut(1);
    }
  };
  rebuild(opts.level ?? bottom + .05);

  // bọt bốc lên ở mặt nước
  let boil = 0;          // cờ sôi của phim
  const V = { rIn: yy => rAt(yy) * .90, level: level, bottom, cut: Math.PI };
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

  // ── cường độ sôi của lớp nước ──
  // Lớp nước sôi khi phim bật cờ sôi. Ngoài ra, lớp nước cuối cùng còn trong
  // nồi gặp một nồi đã nóng thì cũng sôi: nó bốc hơi và mực nước tụt dần.
  // Mực nước tụt chính là tín hiệu của cái phần, nên phần nước cuối phải sôi
  // mạnh chứ không nằm yên — và phần hơi của nó là thứ nhìn thấy được khi
  // nước đã gần hết.
  let boilK = 0;     // cờ sôi đã mượt dần, để bọt không bật lên đột ngột
  let tNow = 0;      // thời điểm của khung đang dựng: mọi thứ tính theo nó
  let fillT = -99;   // lúc nước vừa được rót vào nồi
  const dryAmt = () => {
    const d = level - bottom;
    return clamp((.013 - d) / .008) * clamp(d / .004);
  };
  // Nước đang được rót vào thì nó cuốn lại: bong bóng sủi lên trong cột nước.
  // Đó là thứ đọc ra được là nồi đang được đổ nước, chứ không phải một tấm
  // kính đứng yên.
  const fillK = () => clamp(1 - (tNow - fillT) / .9);
  const churn = () => clamp(boilK + dryAmt() * .85 + fillK() * .45);

  // ── dải bọt sôi ở vạch nước ──
  // Lớp nước nằm ở đáy nồi, lớp gạo nằm trên, nên mặt nước không thấy từ trên
  // xuống; dải bọt sôi dâng dọc theo mép mặt cắt là thứ đọc ra được là nước đang
  // sôi. Không bọt thì mặt nước phẳng lì.
  const foamN = 30;
  const foam = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8),
    toon('#e8f6ff', { emissive: new THREE.Color('#9fd0e4').multiplyScalar(.08) }), foamN);
  foam.frustumCulled = false; foam.castShadow = false;
  foam.layers.set(1);
  g.add(foam);
  const fr = mulberry(5);
  const foams = [];
  for (let i = 0; i < foamN; i++) foams.push({ x: (i / (foamN - 1) - .5) * 2 * (R - MEN_W) * .94, p: fr(), q: fr(), s: .6 + fr() * .8 });
  const fM = new THREE.Matrix4(), fP = new THREE.Vector3(), fQ = new THREE.Quaternion(), fS = new THREE.Vector3();

  // Dải bọt cũng phải có vị trí ngay từ lúc dựng, lý do như bong bóng ở trên.
  const layoutFoam = () => {
    const k = churn();
    for (let i = 0; i < foamN; i++) {
      const f = foams[i];
      // Bọt nhấp nháy nhanh, mỗi bọt một nhịp riêng. Bộ đo chỉ xem mười hai
      // hình mỗi giây: bọt chậm thì đứng yên giữa hai hình, không ai thấy nó
      // sôi.
      const w = (.5 + .5 * Math.sin(tNow * 11 + f.p * 6.3)) * (.55 + .45 * Math.sin(tNow * 4.7 + f.q * 6.3));
      const rr = (.0016 + .0040 * w) * f.s * k;   // nước chưa sôi thì không có bọt
      const x = f.x + Math.sin(tNow * 2.4 + f.p * 5.1) * .004;
      fP.set(x, surfY(f.x) - .0016 - rr * .3, .0026);
      fS.set(rr * 1.7, rr * .70, rr);
      fM.compose(fP, fQ, fS);
      foam.setMatrixAt(i, fM);
    }
    foam.instanceMatrix.needsUpdate = true;
  };

  // ── bong bóng nổi lên trên mặt cắt ──
  // Lớp nước đứng yên đọc ra là một tấm kính xanh, không phải nước. Nước sôi
  // thì mặt cắt của nó phải sôi theo: bong bóng mọc ở đáy, phình ra, nổi lên,
  // vỡ ở mặt nước. Bong bóng nằm ngay trên mặt cắt (z > 0) vì đó là chỗ
  // người xem nhìn thấy nước; đặt sau mặt cắt thì bong bóng bị mặt nước che.
  const bubN = 40;
  const bub = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8),
    toon('#e4f4fd', { emissive: new THREE.Color('#9fd0e4').multiplyScalar(.05) }), bubN);
  bub.frustumCulled = false; bub.castShadow = false; bub.layers.set(1);
  bub.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  g.add(bub);
  const br = mulberry(31);
  const bubs = [];
  for (let i = 0; i < bubN; i++) {
    // Có bong bóng nhỏ liên tục và vài bong bóng to trồi lên: bong bóng to là
    // thứ đọc ra được nước đang sôi mạnh, bong bóng nhỏ cho mặt nước lấm tấm.
    const big = i % 5 === 0;
    bubs.push({
      x: br() * 2 - 1,          // chỗ mọc bong bóng, theo bán kính đáy nồi
      per: .70 + br() * .50,    // thời gian một vòng: phình ra, nổi lên, vỡ
      ph: br(),
      r0: big ? .0060 + .0040 * br() : .0011 + .0026 * br(),
      wob: br() * 6.3,
    });
  }
  const bM = new THREE.Matrix4(), bP = new THREE.Vector3(), bQ = new THREE.Quaternion(), bS = new THREE.Vector3();
  const layoutBub = () => {
    const k = churn();
    const y0 = bottom + .005;
    const yTop = level - .0015;
    const span = Math.max(.003, yTop - y0);
    for (let i = 0; i < bubN; i++) {
      const b = bubs[i];
      const c = (tNow / b.per + b.ph) % 1;
      let y, r;
      if (c < .26) {                        // bám đáy, phình ra
        y = y0; r = b.r0 * .7 * (c / .26);
      } else {
        const q = (c - .26) / .62;          // nổi lên, nhanh dần
        y = y0 + span * q * q;
        r = b.r0 * (.7 + .5 * q);
        if (q > .87) r *= 1 - (q - .87) / .13;   // vỡ tan ở mặt nước
      }
      r *= k;
      const x = b.x * rAt(y0) * .86 + Math.sin(tNow * 7 + b.wob) * .0025;
      bP.set(x, y, .0013);
      bS.set(r, r, r * .85);
      bub.setMatrixAt(i, bM.compose(bP, bQ, bS));
    }
    bub.instanceMatrix.needsUpdate = true;
  };

  // ── hơi lúc nước cạn ──
  // Nước cuối cùng còn trong nồi gặp nồi đã nóng thì bốc thành hơi. Không có
  // cột hơi thì câu "nồi bên phải cạn nước trước" chỉ là một vệt nước nhỏ
  // xíu biến mất — người xem không thấy nồi đang mất nước.
  const stN = 26;
  const steamMat = toon('#f4fcff', {
    emissive: new THREE.Color('#d9f0fa').multiplyScalar(.45),
    transparent: true, opacity: .42, depthWrite: false,
  });
  // mép mềm: cụm hơi nhạt dần ở rìa, chồng lên nhau thành một sợi hơi chứ
  // không thành một đám bi cầu nhựa
  steamMat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_maps>',
      '#include <normal_fragment_maps>\n  diffuseColor.a *= 1.7 * pow(smoothstep(0., 1., abs(dot(normalize(normal), normalize(vViewPosition)))), 1.5);');
  };
  steamMat.customProgramCacheKey = () => 'nuoc-steam';
  const steam = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 12, 8), steamMat, stN);
  steam.frustumCulled = false; steam.castShadow = false; steam.layers.set(1);
  steam.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  g.add(steam);
  const sr = mulberry(77);
  const puffs = [];
  for (let i = 0; i < stN; i++) {
    puffs.push({
      dTrig: .0115 - i * .00037,      // mực nước lúc cụm hơi này bắt đầu bốc
      t0: 0, y0: level, on: false,
      x: (sr() * 2 - 1) * .04,
      z: .004 + sr() * .004,
      rise: .20 + sr() * .20,         // tốc độ bay lên
      r0: .006 + .008 * sr(),         // cụm hơi nhỏ, bay lên thì loãng dần
      life: .50 + sr() * .30,
      sp: sr(),
    });
  }
  const sM = new THREE.Matrix4(), sP = new THREE.Vector3(), sQ = new THREE.Quaternion(), sS = new THREE.Vector3();
  const layoutSteam = () => {
    const d = level - bottom;
    const fade = clamp(d / .0018);       // hơi tắt dần khi nồi đã cạn hẳn
    for (let i = 0; i < stN; i++) {
      const p = puffs[i];
      if (!p.on && d > 0 && d <= p.dTrig) { p.on = true; p.t0 = tNow; p.y0 = level; }
      if (p.on && (d > p.dTrig + .0015 || tNow - p.t0 > p.life)) p.on = false;
      let s = 0;
      const age = p.on ? tNow - p.t0 : 0;
      const u = age / p.life;
      if (p.on && u >= 0 && u < 1) {
        s = p.r0 * (.5 + 1.3 * u);
        if (u < .12) s *= u / .12;          // cụm hơi mọc ra, không bật lên
        if (u > .55) s *= (1 - u) / .45;    // rồi tan đi
        s *= fade;
      }
      sP.set(p.x + Math.sin(age * 3.4 + p.sp * 6.3) * .012, p.y0 + p.rise * age, p.z);
      sS.set(s, s * .88, s);
      steam.setMatrixAt(i, sM.compose(sP, sQ, sS));
    }
    steam.instanceMatrix.needsUpdate = true;
  };

  g.setBoil = k => { boil = clamp(k); };
  g.setLevel = y => {
    if (y > level + 1e-5) fillT = tNow;     // nước đang được rót vào
    rebuild(y);
    V.level = y;
    F.update(0);
    layoutFoam();
    layoutBub();
    layoutSteam();
  };
  let lastT = 0;
  g.update = t => {
    const dt = Math.min(.12, Math.max(0, t - lastT));
    lastT = t;
    tNow = t;
    boilK += (boil - boilK) * Math.min(1, dt * 5);   // bọt không bật lên đột ngột
    F.update(t);
    layoutFoam();
    layoutBub();
    layoutSteam();
  };
  layoutFoam();
  layoutBub();
  layoutSteam();
  g.faceMat = faceMat; g.bodyMat = bodyMat; g.surfMat = surfMat;
  return g;
}

export const PROP = {
  name: 'lớp nước trong nồi',
  // Vật đứng một mình: dựng thêm đoạn thành nồi nhôm, không có nó thì lớp
  // nước đọc ra là một khay thủy tinh rỗng đặt trên bàn.
  view: () => nuocNoi({ R: .138, r0: .132, bottom: .055, level: .115, pot: true }),
};
