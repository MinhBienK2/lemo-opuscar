// N4 · từ không gian, quanh Trái Đất
//
// Bối cảnh này kể một câu chuyện nhỏ: Mặt Trời vừa lặn, thế giới không tắt
// ngay — còn một dải xanh quanh chân trời, dải xanh của lớp ozon mỏng.
// Mọi thứ ở đây phải đọc được bằng mắt:
//   · Trái Đất là một hình cầu có lục địa, có ranh giới ngày/đêm rõ, mặt đêm
//     có đèn thành phố.
//   · Vùng sáng là một DẢI mỏng chạy vòng quanh chân trời, không phải một vỏ
//     tím phủ cả quả cầu.
//   · Chùm sáng là một THÂN sáng có hình, đi từ phía Mặt Trời tới Trái Đất;
//     tới lớp ozon thì phần đỏ bị nuốt, chỉ màu xanh lọt qua rơi xuống mặt
//     đêm.
//
// Trái Đất đã tách ra thành vật dựng riêng (`props/trai-dat.js`): bản đồ
// lục địa, bản đồ đèn thành phố, vật liệu ngày/đêm và các đèn thành phố đều
// nằm trong đó. Bộ dựng ở đây chỉ lo phần còn lại của bối cảnh: sao, lớp khí
// quyển, lớp ozon, vùng sáng và thân chùm sáng.
import * as THREE from 'three';
import { mesh, fxLayer, mulberry, clamp, lerp } from '../../../../rig/kit.js';
import { keyLight, ambience } from '../../../../rig/lights.js';
import { glowDots, setDot } from '../../../../rig/fx.js';
import { V3 } from './props/_common.js';
import { traiDat, SUN_DIR } from './props/trai-dat.js';

// Một THÂN sáng: một dải mềm chạy dọc theo một đường thẳng, luôn quay mặt
// về máy nên thấy được từ mọi góc. Không phải các lát tròn rời rạc — một khối
// sáng liền, sáng ở giữa và mềm dần ở hai mép.
// Tia sáng được vẽ trên cả mặt Trái Đất (không có depth test): đó là cách
// vẽ đường đi của một tia, người xem phải thấy được chỗ tia bị bẻ.
function shaftBody(color) {
  const geo = new THREE.PlaneGeometry(1, 1, 1, 1);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uC: { value: new THREE.Color(color) }, uK: { value: 1 }, uA: { value: 0 },
      uSun: { value: new THREE.Vector3(-1, 0, 0) }, uCam: { value: new THREE.Vector3(0, 0, 6) },
      uDay: { value: 0 },
    },
    vertexShader: `varying vec2 vUv; varying vec3 vW;
      void main(){ vUv = uv; vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz;
        gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `varying vec2 vUv; varying vec3 vW;
      uniform vec3 uC, uSun, uCam; uniform float uK, uA, uDay;
      void main(){
        float w = abs(vUv.y*2.0 - 1.0);                 // 0 ở giữa, 1 ở mép
        // lõi + một vệt halo rộng: chùm sáng phải như sáng trong không khí,
        // không phải một sợi laser vẽ lên hành tinh.
        float a = exp(-2.6*w*w) * .45 + exp(-.85*w*w) * .55;
        // mép phải VỀ 0 ở cả bốn cạnh: còn dư chút alpha ở mép tấm phẳng thì
        // người xem thấy một hình chữ nhật sáng có cạnh cứng — đọc ra là một
        // tấm kính đặt trên mặt hành tinh, không phải luồng sáng.
        a *= (1.0 - smoothstep(.25, 1.0, w));
        a *= smoothstep(0.0, .14, vUv.x) * (1.0 - smoothstep(.86, 1.0, vUv.x));
        // Chùm đỏ không sơn màu lên mặt ngày: nếu tia từ máy tới chỗ này
        // cắt qua phần mặt Trái Đất đang có nắng, thân sáng phải mờ đi hẳn,
        // để lục địa vẫn là lục địa chứ không bị sơn cam lên.
        if (uDay > .5) {
          vec3 rd = normalize(vW - uCam);
          float bb = dot(rd, -uCam), cc = dot(uCam, uCam) - 1.0;
          float disc = bb*bb - cc;
          if (disc > 0.0) {
            float t = bb - sqrt(disc);          // gốc gần: tia cắt mặt cầu ở đâu
            float tf = length(vW - uCam);
            if (t > 0.0) {
              vec3 hit = uCam + rd*t;
              // chỗ dưới chùm sáng đang có nắng: mờ hẳn đi
              float lit = smoothstep(-.02, .26, dot(normalize(hit), uSun));
              // chỗ chùm sáng lọt ra sau mặt cầu: mờ dần theo độ sâu
              float pen = tf > t ? clamp((tf - t) / .30, 0.0, 1.0) : 0.0;
              a *= 1.0 - max(lit, pen);
            }
          }
        }
        gl_FragColor = vec4(uC * uK * a * uA, 1.0); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false,
    side: THREE.DoubleSide,
  });
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = 12; fxLayer(m);
  return m;
}

// Vùng sáng xanh KHÔNG dựng bằng một dải hình học: nó được vẽ thẳng lên
// mặt cầu trong earthMat (mảng xanh mềm), nên không có mép cứng nào. Các
// hạt sáng nhỏ rải quanh vùng sáng cho vệt sáng có hạt, như một luồng sáng
// thật chứ không phải một mảng màu trơn.

// ── N4 · từ không gian, quanh Trái Đất ───────────────────────────────────
export function buildKhongGian() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#04050c');
  scene.fog = new THREE.Fog('#06060f', 26, 90);

  // ── sao: các điểm sáng nhỏ rời nhau, không phải mảng trắng ─────────────
  // Nhiều sao nhưng nhỏ: một góc ống kính hẹp chỉ thấy vài chục điểm.
  const NST = 2600;
  const stars = glowDots(NST, .026, '#dfe8ff', 1.0);
  stars.material.fog = false;
  const rnd = mulberry(41);
  const sp = [];
  for (let i = 0; i < NST; i++) {
    const a = rnd() * Math.PI * 2, b = Math.acos(rnd() * 2 - 1), r = 22 + rnd() * 26;
    sp.push(V3(Math.sin(b) * Math.cos(a) * r, Math.cos(b) * r, Math.sin(b) * Math.sin(a) * r));
  }
  stars.count = NST; scene.add(stars);

  // ── Trái Đất: quả cầu có lục địa, có ngày/đêm, có đèn thành phố ────────
  const earthG = traiDat({ camZ: 6 });
  scene.add(earthG);
  const { earth, earthMat, city, cityPts } = earthG.userData.parts;
  const SUN = V3(SUN_DIR[0], SUN_DIR[1], SUN_DIR[2]).normalize();   // hướng tới Mặt Trời

  // ── lớp khí quyển và lớp ozon: hai QUẦNG sáng mềm quanh hành tinh ───
  // Không dùng vỏ cầu fresnel: fresnel sáng đúng ở mép cầu, nên đọc ra là một
  // sợi tròn sáng — vành của một vật khác — chứ không phải một lớp khí quấn
  // quanh. Ở đây dùng một đĩa vuông góc với trục nhìn: sáng dày dần từ
  // trong ra, đỉnh ở ngay ngoài mép hành tinh rồi tắt dần ra ngoài.
  const corona = (color, rIn, rPeak, rOuter, k, extra) => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uC: { value: new THREE.Color(color) }, uK: { value: k },
        uSun: { value: SUN.clone() }, uOzone: { value: .5 },
        uIn: { value: rIn }, uPeak: { value: rPeak }, uOut: { value: rOuter },
      },
      vertexShader: `varying vec2 vP; varying vec3 vW;
        void main(){ vP = position.xy; vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz;
          gl_Position = projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `varying vec2 vP; varying vec3 vW;
        uniform vec3 uC, uSun; uniform float uK, uOzone, uIn, uPeak, uOut;
        void main(){
          float r = length(vP);
          float a = smoothstep(uIn, uPeak, r) * (1.0 - smoothstep(uPeak, uOut, r));
          if (a < .004) discard;
          vec3 dir = normalize(vW);
          float nl = dot(dir, uSun);
          ${extra}
          gl_FragColor = vec4(uC * uK * a, 1.0); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      side: THREE.DoubleSide, fog: false,
    });
    const m = new THREE.Mesh(new THREE.CircleGeometry(rOuter, 96), mat);
    m.frustumCulled = false; m.renderOrder = 9;
    fxLayer(m);
    return m;
  };
  // Lớp khí quyển: xanh, dày, sáng ở phía ban ngày.
  // Quầng sáng phải HẸP: một quầng rộng lan ra khắp khung thì hành tinh
  // trôi trong một vùng sương tím, mất cả nền đêm lẫn ranh giới của lớp khí.
  const atmo = corona('#4a86ff', 1.00, 1.030, 1.17, 1.0,
    'float dayF = smoothstep(-.45,.25,nl); a *= (.14 + .90*dayF);');
  scene.add(atmo);

  // ── lớp ozon: mỏng hơn, cao hơn, tím, và chỉ sáng mạnh ở vùng lặn ────
  // Lớp ozon: tím, mỏng hơn lớp khí quyển, nằm ngoài nó, sáng mạnh hơn ở
  // vùng lặn. Giữ nó mờ: một vòng tím đậm quanh hành tinh sẽ thắng chủ đề
  // của đoạn này, vốn là VÙNG SÁNG.
  const ozone = corona('#8f74e0', 1.025, 1.065, 1.28, 1.0,
    'float tw = exp(-pow((nl + .02)/.26, 2.0)); a *= (.16 + .95*tw*uOzone);');
  scene.add(ozone);

  // KHÔNG vẽ dải ozon ở xích đạo. Lớp ozon là một LỚP quanh cả hành
  // tinh; vẽ thêm một dải tím ở xích đạo thì nó cắt ngang lục địa và đọc
  // ra là một mảnh băng dán trên mặt Trái Đất. Phần "lớp mỏng màu tím"
  // của câu kể do vỏ ozon và vùng sáng đảm nhiệm.

  // ── vùng sáng: một DẢI hẹp chạy vòng quanh chân trời, nằm ngay trên
  //    mặt quả cầu. Nó hẹp dần khi Mặt Trời lặn sâu hơn. ──────────────────
  const bandMat = new THREE.ShaderMaterial({
    uniforms: {
      uC: { value: new THREE.Color('#6f7dff') }, uK: { value: 1 }, uSun: { value: SUN.clone() },
      uW: { value: .20 }, uOzone: { value: .5 }, uOff: { value: 0 },
    },
    vertexShader: `varying vec3 vN;
      void main(){ vN = normalize(mat3(modelMatrix)*normal);
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec3 vN;
      uniform vec3 uC, uSun; uniform float uK, uW, uOzone, uOff;
      void main(){
        float nl = dot(normalize(vN), uSun) - uOff;
        // vùng sáng nằm ở BÊN KIA ranh giới ngày/đêm, nơi Mặt Trời đã lặn.
        // Mép phía ban ngày phải SẮC: một vệt loang không có mép thì mắt
        // không có chỗ bám, và câu kể về vùng sáng mất đi chỗ.
        float a = exp(-pow((nl + uW*.55)/uW, 2.0)) * (1.0 - smoothstep(0.0, uW*.55, nl));
        gl_FragColor = vec4(uC*uK*a*(.35 + .95*uOzone), 1.0); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide, fog: false,
  });
  const band = mesh(new THREE.SphereGeometry(1.004, 72, 48), bandMat, [0, 0, 0], { cast: false, recv: false });
  fxLayer(band); scene.add(band);

  // ── chùm sáng: đi từ phía Mặt Trời tới Trái Đất ───────────────────────
  // Thân sáng chạy trên đường tiếp tuyến với Trái Đất, tại điểm cuối của
  // ranh giới ngày/đêm: tia ở đó là ngang với mặt đất nên đi qua một đường
  // khí quyển rất dài.
  const redShaft = shaftBody('#ff5a24');
  redShaft.material.uniforms.uDay.value = 1;
  scene.add(redShaft);

  // Hạt sáng nhỏ rải quanh vùng sáng xanh: vệt sáng phải có HẠT, không
  // phải một mảng màu trơn.
  // Bán kính hạt nằm ở đối số thứ hai của glowDots; setDot nhân thêm một
  // lần nữa, nên phải để hạt to (nếu không, hạt bé hơn một pixel và biến mất).
  const blueGrain = glowDots(90, .030, '#7fd8ff', 1.2);
  blueGrain.material.fog = false;
  scene.add(blueGrain);

  const key = keyLight(scene, { color: '#ffd9a8', intensity: 3.0, from: V3(SUN.x * 12, SUN.y * 12, SUN.z * 12), to: V3(0, 0, 0), size: 2.2, far: 30 });
  ambience(scene, { sky: '#3a4a86', ground: '#101830', fill: .30, rim: '#7fa8ff', rimI: .35, rimFrom: [3, -3, -3] });

  // người quan sát: máy đứng ở đâu thì chân trời ở đó. Một điểm cố định cho
  // cả đoạn, để Mặt Trời lặn đều theo thời gian chứ không nhảy theo máy.
  const OBS = V3(.48, .28, .79).normalize();

  const _f = V3(0, 0, 1), _q = new THREE.Quaternion(), _m4 = new THREE.Matrix4();
  const camQ = new THREE.Quaternion();
  const camPos = V3(0, 0, 6), camRight = V3(1, 0, 0), camFwd = V3(0, 0, -1), camNad = OBS.clone();
  const B0 = V3(0, 1, 0), e1 = SUN.clone();

  function readCamera() {
    const cam = (typeof window !== 'undefined' && window.__cam) || null;
    if (!cam) return;
    cam.updateMatrixWorld();
    const e = cam.matrixWorld.elements;
    camRight.set(e[0], e[1], e[2]).normalize();
    camFwd.set(-e[8], -e[9], -e[10]).normalize();
    camPos.copy(cam.position);
    camNad.copy(cam.position).normalize();
    camQ.copy(cam.quaternion);
  }

  return {
    scene, key, earth, atmo, ozone, band, redShaft, SUN,
    atmoAt: V3(-.70, .52, .44), ozoneAt: V3(-.80, .64, .54),
    update(t, s) {
      const dep = s && s.dep != null ? s.dep : .5;
      const redK = s && s.red != null ? s.red : 1;
      const blueK = s && s.blue != null ? s.blue : .5;

      // sao: các điểm nhỏ, đứng yên, lấp lói nhẹ
      for (let i = 0; i < sp.length; i++) {
        const tw = .85 + .15 * Math.sin(t * 1.7 + i * 2.3);
        setDot(stars, i, sp[i], (.55 + (i % 5) * .17) * tw);
      }
      stars.instanceMatrix.needsUpdate = true;

      // Trái Đất xoay chậm
      earth.rotation.y = t * .015;

      // Mặt Trời lặn: ở độ sâu `dep` (0 → vừa lặn, 1 → lặn sâu 6°)
      const alt = -dep * 6 * Math.PI / 180;
      const h = V3(SUN_DIR[0], SUN_DIR[1], SUN_DIR[2]).normalize();      // hướng ngang tới Mặt Trời
      e1.copy(h).multiplyScalar(Math.cos(alt)).addScaledVector(OBS, Math.sin(alt)).normalize();
      SUN.copy(e1);
      earthMat.uniforms.uSun.value.copy(e1);
      bandMat.uniforms.uSun.value.copy(e1);
      atmo.material.uniforms.uSun.value.copy(e1);
      ozone.material.uniforms.uSun.value.copy(e1);

      // mặt đêm: chấm đèn thành phố chỉ sáng ở bóng tối
      const rot = earth.rotation.y, cr = Math.cos(rot), sr = Math.sin(rot);
      for (let i = 0; i < cityPts.length; i++) {
        const d = cityPts[i];
        const wx = d.x * cr + d.z * sr, wz = -d.x * sr + d.z * cr;
        const lit = wx * e1.x + d.y * e1.y + wz * e1.z;
        const k = lit < -.015 ? (.6 + .4 * Math.sin(t * 2.1 + i)) * (1 - clamp((lit + .30) / .28)) : 0;
        if (k <= .01) { setDot(city, i, V3(0, 0, 0), 0); continue; }
        const p = V3(wx * 1.006, d.y * 1.006, wz * 1.006);
        setDot(city, i, p, k);
      }
      city.instanceMatrix.needsUpdate = true;

      // vùng sáng: dải hẹp quanh chân trời, hẹp dần khi Mặt Trời lặn sâu
      bandMat.uniforms.uW.value = lerp(.042, .016, dep);
      bandMat.uniforms.uK.value = .30 + .18 * (1 - dep);
      bandMat.uniforms.uOzone.value = .35 + .65 * (1 - .55 * dep);
      bandMat.uniforms.uOff.value = Math.sin((s && s.bandRot != null ? s.bandRot : 0)) * .12;

      // ánh sáng: viền khí quyển và lớp ozon
      const oz = .35 + .65 * (1 - .5 * dep);
      atmo.material.uniforms.uOzone.value = oz;
      ozone.material.uniforms.uOzone.value = oz;
      atmo.material.uniforms.uK.value = .85;
      ozone.material.uniforms.uK.value = .55;
      earthMat.uniforms.uOzone.value = oz;

      // ── chùm sáng ──────────────────────────────────────────────────────
      readCamera();
      earthMat.uniforms.uCam.value.copy(camPos);
      // Hai quầng sáng quay mặt về máy: quầng nằm trong mặt phẳng vuông góc
      // với trục nhìn, nên mép trong của nó trùng đúng mép hành tinh.
      _q.setFromUnitVectors(_f, camFwd.clone().negate());
      atmo.quaternion.copy(_q);
      ozone.quaternion.copy(_q);
      // Điểm cuối của ranh giới ngày/đêm gần máy nhất: nơi tia sáng ở ngang
      // với mặt đất, đi qua một đường khí quyển rất dài.
      B0.copy(camNad).addScaledVector(e1, -camNad.dot(e1));
      if (B0.lengthSq() < 1e-6) B0.set(0, 1, 0); else B0.normalize();
      // Chỗ lớp ozon mỏng ăn mất phần đỏ: ngay tại ranh giới ngày/đêm.
      const Z = B0.clone();
      // Tia xanh lọt qua, uốn xuống mặt đêm ngay bên kia ranh giới.
      const P = B0.clone().addScaledVector(e1, -.26).normalize();
      const redFrom = Z.clone().addScaledVector(e1, 2.2);     // phía Mặt Trời

      const place = (m, a, b, r) => {
        const dir = b.clone().sub(a), len = dir.length();
        dir.normalize();
        // Dải sáng luôn quay mặt về máy: trục dài là hướng của tia, trục rộng
        // là phương vuông góc với tia TRONG MẶT PHẲNG MÀN, nên mép tia luôn
        // mềm và rõ, không bao giờ biến thành một sợi mảnh.
        let ws = camFwd.clone().cross(dir);
        if (ws.lengthSq() < 1e-8) ws = camRight.clone().cross(dir);
        if (ws.lengthSq() < 1e-8) ws.set(0, 1, 0); else ws.normalize();
        const nrm = dir.clone().cross(ws).normalize();
        _m4.makeBasis(dir, ws, nrm);
        m.quaternion.setFromRotationMatrix(_m4);
        m.position.copy(a).addScaledVector(dir, len * .5);
        m.scale.set(len, r * 2, 1);
      };
      place(redShaft, redFrom, Z, .075);
      redShaft.material.uniforms.uA.value = redK * .58;
      redShaft.material.uniforms.uSun.value.copy(e1);
      redShaft.material.uniforms.uCam.value.copy(camPos);
      redShaft.visible = redK > .02;

      // Luồng xanh: vùng sáng VẼ THẲNG LÊN MẶT CẦU (trong earthMat), cộng
      // các hạt sáng nhỏ rải quanh vùng sáng cho vệt sáng có hạt.
      // Hai hướng ở chỗ ánh sáng xanh rơi xuống: một cái DỌC theo chân
      // trời, một cái XUYÊN vào mặt đêm. Chúng vuông góc nhau.
      const gSide = P.clone().cross(e1).normalize();     // dọc theo chân trời
      const gDeep = e1.clone().negate();                 // xuyên vào mặt đêm
      earthMat.uniforms.uBlueT.value.copy(gSide);
      earthMat.uniforms.uBlueK.value = blueK * 1.6;
      const gN = 90;
      blueGrain.count = gN;
      for (let i = 0; i < gN; i++) {
        // hạt rải trong một mảng dẹt ôm lấy vùng sáng
        const a = (i * 2.399) % (Math.PI * 2);            // quyền uẫn vàng
        const rr = Math.sqrt((i + .5) / gN) * .30;
        const gp = P.clone()
          .addScaledVector(gSide, Math.cos(a) * rr)
          .addScaledVector(gDeep, Math.sin(a) * rr * .45)
          .normalize().multiplyScalar(1.004);
        setDot(blueGrain, i, gp, (.05 + .09 * ((i * 5) % 7) / 7) * blueK);
      }
      blueGrain.instanceMatrix.needsUpdate = true;

      // Chỗ màu xanh rọi xuống mặt đêm chính là cuối dải cong kia, nằm sát
      // mặt cầu — không cần thêm một tấm sáng phẳng nữa: một tấm phẳng đặt
      // ở đó đọc ra là kính đặt lên hành tinh.
    },
  };
}
