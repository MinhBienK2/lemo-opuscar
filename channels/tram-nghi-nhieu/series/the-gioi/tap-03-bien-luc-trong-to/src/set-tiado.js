// N3 · trong không khí chiều muộn, nhìn ngược dọc theo tia
//
// Máy quay đứng giữa không khí và nhìn dọc theo tia sáng đi thẳng: tia còn
// trắng ở đầu gần (vừa rời Mặt Trời thấp) và đỏ dần ở đầu xa (đã đi qua
// lớp không khí dày, mất gần hết màu xanh). Ba thứ đo được đặt cạnh nhau
// trong cùng một không gian:
//   · một dải thước đo quãng (đo độ dài đường đi của tia thẳng),
//   · hai mặt đồng hồ đối chiếu (đo phần trăm màu xanh và màu đỏ còn lại),
//   · các tia bị bẻ sang bên, màu của chúng tùy độ dài đường đi.
import * as THREE from 'three';
import { canvasTex, fxLayer, mulberry, clamp } from '../../../../rig/kit.js';
import { keyLight, ambience } from '../../../../rig/lights.js';
import { glowDots, setDot } from '../../../../rig/fx.js';
import { V3, skyTexture } from './props/_common.js';
import { thuocDoQuang } from './props/thuoc-do-quang.js';
import { dongHoDoPhanTram, dialFace, DIAL } from './props/dong-ho-do-phan-tram.js';

// vòng chấm, độ giữa hai chấm (140° cho 20 chấm), và góc của vạch 0 %
const { RING, STEP, A0 } = DIAL;

// ── toạ độ cố định (nhãn trong film.js trỏ vào đúng những chỗ này) ──────
const SUN_X = 7;      // đầu gần của tia: còn trắng
const FAR_X = -19;    // đầu xa của tia: đã đỏ
const SPAN = SUN_X - FAR_X;
const RUL = { x: -8.0, y: 1.45, z: .55, len: 12 };   // dải thước đo quãng
const CURSOR_X = -8.0;                               // con trượt: "gần 38 lần"

// Màu của tia theo đường đi đã đi. `p` = quãng đường tia đã đi từ Mặt Trời.
const C = {
  white: new THREE.Color('#fffaf0'), pale: new THREE.Color('#ffeec0'),
  amber: new THREE.Color('#ffc35a'), orange: new THREE.Color('#ff8a3d'),
  red: new THREE.Color('#e8341c'),
};
function rayRamp(p) {          // p: 0 (mới rời Mặt Trời) → 26 (xa xa)
  p = clamp(p, 0, 26);
  if (p < 6) return C.white.clone().lerp(C.pale, p / 6);
  if (p < 9) return C.pale.clone().lerp(C.amber, (p - 6) / 3);
  if (p < 13) return C.amber.clone().lerp(C.orange, (p - 9) / 4);
  if (p < 18) return C.orange.clone().lerp(C.red, (p - 13) / 5);
  return C.red.clone();
}
// Tia bị bẻ: nó đi thêm một đoạn nữa mới tới mắt. Đi ngắn thì còn xanh,
// đi dài thì đã đỏ — nên màu của nó là hàm của tổng đường đi.
const B = {
  cyan: new THREE.Color('#6fdcff'), ice: new THREE.Color('#b6ecff'),
  straw: new THREE.Color('#ffc46a'), orange: new THREE.Color('#ff7a3d'),
  red: new THREE.Color('#f04462'),
};
function bentRamp(p) {
  p = clamp(p, 0, 28);
  if (p < 8) return B.cyan.clone().lerp(B.ice, p / 8);
  if (p < 13) return B.ice.clone().lerp(B.straw, (p - 8) / 5);
  if (p < 19) return B.straw.clone().lerp(B.orange, (p - 13) / 6);
  if (p < 24) return B.orange.clone().lerp(B.red, (p - 19) / 5);
  return B.red.clone();
}

// ── vật liệu sáng: một sợi sáng có lõi rực và mép mềm ─────────────────────
// Không dùng một ống cứng (trông như nhựa) và không dùng một vệt mờ (trông
// như sương). Ống sáng có sẵn: viền ngoài mềm dần theo góc nhìn, và một lõi
// rực ở giữa — đúng cách một tia sáng phải trông.
const GLOW_VS = `
attribute vec4 acolor;
varying vec4 vC; varying vec3 vN; varying vec3 vV;
void main(){
  vC = acolor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const GLOW_FS = `
uniform float uA; uniform float uSoft; uniform float uPow; uniform float uCore;
varying vec4 vC; varying vec3 vN; varying vec3 vV;
void main(){
  float nv = abs(dot(normalize(vN), normalize(vV)));
  float f = mix(1.0, pow(nv, uPow), uSoft) + uCore * pow(nv, 9.0);
  gl_FragColor = vec4(vC.rgb, vC.a * uA * f);
}`;

export function buildTiaDo() {
  const scene = new THREE.Scene();

  // ── trời chiều muộn: cam ở chân trời, tím và xanh ở trên ──────────────
  // Dải cam chỉ mỏng ngay chân trời rồi lên violet rồi xanh thẫm; phía dưới
  // chân trời là bóng tối của lớp không khí đã bị mặt trời chiếu hết.
  scene.background = skyTexture({
    stops: [[90, '#100d34'], [60, '#181246'], [34, '#241a58'], [16, '#372567'],
      [8, '#4e2f74'], [4, '#743a76'], [2, '#9c4c69'], [1, '#bd6152'],
      [0, '#d07a4e'], [-1.2, '#8d4436'], [-3.5, '#4a2238'], [-9, '#2a1730'],
      [-24, '#190f24']],
    sunDir: V3(0.92, 0.05, 0.39).normalize(),
    sunCol: '#ff7a2a', sunCore: '#fff0c0', sunR: 3.0,
  });
  scene.fog = new THREE.Fog('#3a2448', 26, 96);

  // ── tia sáng đi thẳng: một thân nón mềm, màu theo đường đi ────────────
  function shaft({ r, alpha, boost = 1, soft = .5, pow = 1.4, core = .8 }) {
    const geo = new THREE.CylinderGeometry(r, r, SPAN, 26, 60, true);
    geo.rotateZ(-Math.PI / 2);                 // +Y → +X: đầu +x là đầu gần
    geo.translate((SUN_X + FAR_X) / 2, 0, 0);
    const pos = geo.attributes.position;
    const col = new Float32Array(pos.count * 4);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const c = rayRamp(SUN_X - x).multiplyScalar(boost);
      col[i * 4] = c.r; col[i * 4 + 1] = c.g; col[i * 4 + 2] = c.b;
      // đầu gần mờ dần để không có nắp cứng; đầu xa mờ dần vào hơi mờ
      col[i * 4 + 3] = clamp((5.2 - x) / 2.0, 0, 1) * clamp((x + 21) / 3.0, 0, 1);
    }
    geo.setAttribute('acolor', new THREE.BufferAttribute(col, 4));
    const m = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      vertexShader: GLOW_VS, fragmentShader: GLOW_FS,
      uniforms: { uA: { value: alpha }, uSoft: { value: soft }, uPow: { value: pow }, uCore: { value: core } },
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, toneMapped: false,
    }));
    fxLayer(m);
    return m;
  }
  const beamHalo = shaft({ r: .115, alpha: .24, boost: 1.0, soft: 1.0, pow: 1.8, core: .5 });
  const beamCore = shaft({ r: .035, alpha: .50, boost: 1.05, soft: 1.0, pow: 1.6, core: .7 });
  scene.add(beamHalo, beamCore);

  // ── các tia bị bẻ sang bên: màu tùy độ dài đường đi của chúng ──────────
  // Mỗi tia bẻ chỗ ra khỏi tia thẳng rồi cong về phía máy: bẻ sớm (đường
  // đi ngắn) còn xanh, bẻ muộn (đường đi dài) đã đỏ.
  const bentRays = [];
  const BENT = [
    { x: 2.4, up: 1, len: 2.2, z: 1.15 }, { x: -0.8, up: -1, len: 2.6, z: 1.45 },
    { x: -3.8, up: 1, len: 2.8, z: 1.05 }, { x: -6.4, up: -1, len: 3.0, z: 1.55 },
    { x: -9.0, up: 1, len: 2.8, z: 1.25 }, { x: -11.4, up: -1, len: 2.4, z: 1.05 },
    { x: -13.8, up: 1, len: 2.0, z: 1.35 },
  ];
  for (const b of BENT) {
    const p0 = SUN_X - b.x;                       // đường đi tới chỗ bẻ
    const from = V3(b.x, 0, 0);
    const ctrl = V3(b.x - .9, b.up * .25, .55);
    const to = V3(b.x - 1.7, b.up * 1.05, b.z);
    const curve = new THREE.CatmullRomCurve3([from, ctrl, to]);
    const c0 = bentRamp(p0 * .55), c1 = bentRamp(p0 + b.len);
    const RAD = 8, SEG = 26;
    const geo = new THREE.TubeGeometry(curve, SEG, .026, RAD, false);
    const pos = geo.attributes.position;
    const col = new Float32Array(pos.count * 4);
    for (let i = 0; i < pos.count; i++) {
      const u = Math.floor(i / (RAD + 1)) / SEG;      // u chạy dọc theo tia
      const c = c0.clone().lerp(c1, u).multiplyScalar(1.25);
      col[i * 4] = c.r; col[i * 4 + 1] = c.g; col[i * 4 + 2] = c.b;
      col[i * 4 + 3] = (1 - u * .35) * clamp(u * 8, 0, 1);   // mờ ở chỗ bẻ, sáng dần
    }
    geo.setAttribute('acolor', new THREE.BufferAttribute(col, 4));
    const m = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      vertexShader: GLOW_VS, fragmentShader: GLOW_FS,
      uniforms: { uA: { value: .95 }, uSoft: { value: 1 }, uPow: { value: 2.2 }, uCore: { value: .5 } },
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, toneMapped: false,
    }));
    fxLayer(m);
    scene.add(m);
    bentRays.push(m);
    // chỗ bẻ: một hạt sáng lóa nằm trên tia thẳng
    const node = new THREE.Mesh(new THREE.SphereGeometry(.045, 12, 10),
      new THREE.MeshBasicMaterial({
        color: c1.clone().multiplyScalar(1.4), transparent: true, opacity: .9,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      }));
    node.position.copy(from);
    fxLayer(node);
    scene.add(node);
    bentRays.push(node);
  }

  // ── các lớp hạt không khí: mỗi lớp một dải, xa thì dày hơn ───────────
  // Mỗi lớp là một MẶT PHẲNG vuông góc tia: một vòng hạt nhỏ nằm trên
  // một mặt, cộng một tấm sương mỏng có mép sáng hơn. Nhìn nghiêng từ bên,
  // các lớp xếp thành những dải SONG SONG vuông góc tia: dải gần Mặt Trời
  // thưa, dải xa hơn thì nhiều hạt hơn và dày hơn. Nếu chỉ rắc hạt rời rạc
  // thì người xem đọc ra sao, không đọc ra lớp.
  const rnd = mulberry(23);
  const layers = [];
  for (let i = 0; i < 14; i++) {
    const x = 5.2 - i * 1.55;
    const n = 12 + i * 8;                     // lớp xa đông hạt hơn lớp gần
    const rad = 1.05 + i * .055;
    const yz = [];
    for (let k = 0; k < n; k++) {
      const a = rnd() * Math.PI * 2;
      const rr = rad * Math.sqrt(.08 + .92 * rnd());   // đĩa đầy, không phải một vòng
      // Lớp là một DẢI vuông góc tia, dày chừng nửa mét theo tia: nhìn nghiêng
      // từ bên, mỗi lớp đọc thành một dải song song, không phải một đám hạt.
      yz.push(V3((rnd() - .5) * .50, Math.sin(a) * rr, Math.cos(a) * rr));
    }
    layers.push({ x, yz, rad });
  }
  // tấm sương của một lớp: mép sáng hơn giữa, để lớp đọc ra là một DẢI
  const layerTex = canvasTex(256, 256, (g, w, h) => {
    const grd = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    grd.addColorStop(0, 'rgba(255,255,255,.05)');
    grd.addColorStop(.55, 'rgba(255,255,255,.10)');
    grd.addColorStop(.80, 'rgba(255,255,255,.46)');
    grd.addColorStop(.93, 'rgba(255,255,255,.12)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
  });
  const layerSheets = [];
  const layerDots = layers.map((l, i) => {
    // Hạt ở gần sáng trắng, hạt ở xa nằm trong ánh sáng đã đỏ.
    // Kích thước hạt NHỎ DẦN theo lớp: lớp càng đông hạt càng phải nhỏ, vì
    // lớp đông vừa gần máy hơn vừa nhiều hạt hơn — cứ giữ một kích thước
    // thì lớp đông gộp thành một vệt bông, đọc ra là sương chứ không phải lớp.
    const c = rayRamp(SUN_X - l.x).lerp(new THREE.Color('#ffffff'), .55);
    const im = glowDots(l.yz.length, .036 - i * .0014, c.getStyle(), .8 + i * .04);
    im.count = l.yz.length;
    scene.add(im);
    // dải hạt: một tấm sương mỏng vuông góc tia, mép sáng, đậm dần theo lớp
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: layerTex,
        color: c.clone().lerp(new THREE.Color('#ffffff'), .25),
        transparent: true, opacity: .10 + i * .020,
        blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
      }));
    sheet.rotation.y = Math.PI / 2;
    sheet.scale.set(l.rad * 2.5, l.rad * 2.5, 1);
    sheet.position.set(l.x, 0, 0);
    fxLayer(sheet);
    scene.add(sheet);
    layerSheets.push(sheet);
    return im;
  });

  // ── thước đo quãng: một dải thép mỏng có vạch, treo bằng hai sợi dây ───
  // Nó phải là một dải đo, không phải một tấm gỗ: mặt dải có vạch khắc rõ
  // (không chữ số), một vỏ cuộn tròn ở cuối, móc thép ở đầu kia, một con
  // trượt đỏ đang chỉ vị trí đang đo, và hai sợi dây treo nó lên.
  const rulG = thuocDoQuang({ len: RUL.len, cursorX: CURSOR_X - RUL.x, wire: 4.2 });
  rulG.position.set(RUL.x, RUL.y, RUL.z);
  scene.add(rulG);

  // ── hai mặt đồng hồ đối chiếu: tròn, có kim chỉ, đo phần trăm màu ──────
  // Mỗi mặt có một vòng hai mươi chấm (mỗi chấm một phần trăm rưỡi), các
  // chấm đã đếm được sáng lên, và kim chỉ đứng đúng ở chấm cuối cùng.
  // Hai cái giống nhau y hệt nên so sánh được với nhau.
  const faceTex = dialFace();
  // Mũi kim phải rơi đúng vào điểm nhãn trỏ tới (nhãn "XANH CÒN 2,5 %" và
  // "ĐỎ CÒN 15 %"), nên tâm mặt đồng hồ đặt ngược lại với hướng kim.
  const aBlue = (A0 - (2.5 / 1.25) * STEP) * Math.PI / 180;
  const aRed = (A0 - (15 / 1.25) * STEP) * Math.PI / 180;
  const gBlue = dongHoDoPhanTram({
    center: { x: -7.00 - RING * Math.cos(aBlue), y: 1.07 - RING * Math.sin(aBlue) },
    percent: 2.5, color: '#67e8f9', wire: 4.2, face: faceTex,
  });
  scene.add(gBlue);
  const gRed = dongHoDoPhanTram({
    center: { x: -6.96 - RING * Math.cos(aRed), y: -.83 - RING * Math.sin(aRed) },
    percent: 15, color: '#ff6a4a', wire: 4.2, face: faceTex,
  });
  scene.add(gRed);

  // ── ánh sáng ────────────────────────────────────────────────────────────
  // Đèn chính đặt đúng hướng Mặt Trời thấp để bóng đổ dài; thêm một nguồn
  // ấm ở phía máy cho mặt trước của dải thước và hai mặt đồng hồ không
  // chìm hẳn vào bóng.
  const key = keyLight(scene, { color: '#ffb27a', intensity: 2.2, from: V3(16, 3.2, 8), to: V3(-5, 0, 0), size: 15, far: 60 });
  const warm = new THREE.DirectionalLight('#ffd8ac', 1.0);
  warm.position.set(4, 3.5, 12);
  warm.target.position.set(-6, 0, 0);
  scene.add(warm, warm.target);
  ambience(scene, { sky: '#7a54a0', ground: '#2a1a40', fill: .55, rim: '#9a7bff', rimI: .8, rimFrom: [-6, 4, -9] });

  return {
    scene, key, gBlue, gRed,
    beamAt: V3(-3, 0, 0), rulerAt: V3(CURSOR_X, 1.60, .55),
    blueAt: V3(-7.00, 1.07, .62), redAt: V3(-6.96, -.83, .62),
    update(t, s) {
      const st = s || {};
      const sc = st.grainScale || 1;
      layers.forEach((l, li) => {
        const im = layerDots[li];
        l.yz.forEach((p, i) => {
          setDot(im, i, V3(l.x + p.x + Math.sin(t * .4 + i + li) * .03, p.y, p.z), sc);
        });
        im.instanceMatrix.needsUpdate = true;
      });
      // tấm sương của các lớp: ở câu về dải thì tắt hẳn, vì tấm sương rộng
      // sẽ dính các dải vào nhau và đọc ra một vệt, không đọc ra từng dải.
      layerSheets.forEach((sh2, i) => {
        sh2.visible = (st.sheetAlpha ?? 1) > .01;
        sh2.material.opacity = (.10 + i * .020) * (st.sheetAlpha ?? 1);
      });
      // tia thẳng và các tia bẻ thở nhẹ: không khung nào đứng hình
      const dim = st.dimBeam ? .40 : 1;
      beamHalo.material.uniforms.uA.value = (.28 + .04 * Math.sin(t * .7)) * dim;
      beamCore.material.uniforms.uA.value = (.66 + .07 * Math.sin(t * .9 + 1)) * dim;
      for (const m of bentRays) {
        m.visible = !st.hideBent;
        m.material.uniforms
          ? m.material.uniforms.uA.value = .85 + .14 * Math.sin(t * 1.1 + m.id)
          : m.material.opacity = .85 + .14 * Math.sin(t * 1.1 + m.id);
      }
      // ở câu về các lớp hạt, thước đo và hai mặt đồng hồ phải tránh mặt:
      // chúng nằm ngay giữa lớp hạt và che mất các dải.
      rulG.visible = !st.hideTools;
      gBlue.visible = !st.hideTools;
      gRed.visible = !st.hideTools;
      rulG.rotation.z = Math.sin(t * .5) * .006;
    },
  };
}
