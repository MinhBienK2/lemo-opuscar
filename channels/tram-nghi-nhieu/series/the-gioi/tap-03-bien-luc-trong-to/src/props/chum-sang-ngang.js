// Chùm sáng ngang của Mặt Trời: MỘT BÓ TIA + LÕI SÁNG + VỎ SÁNG MỀM.
//
// Chùm là ÁNH SÁNG, không phải vật thể: nó không có viền mực. Một ống trụ
// đặc (lõi + vỏ) đọc ra là một vệt trắng dẹt nằm sát sàn — người xem gọi
// đó là "chiếc lá lớn", không phải chùm sáng. Một chùm sáng phải là MỘT BÓ
// TIA: nhiều sợi tia mảnh tách rời nhau, mỗi sợi có ranh giới rõ, và cả bó
// hội tụ dần về một hướng nguồn sáng.
//
// Một bài học từ ảnh vật: sáng CỘNG (additive) trên nền sáng thì cháy thành
// một mảng trắng, mất hết cấu trúc. Vì vậy phần đọc được là THÂN TIA: mỗi
// sợi là một giọt hổ phách có viền mềm (pha trộn thường — lệch hẳn màu nền
// nên vẫn thấy từng sợi) với một lõi trắng mảnh; lớp cộng chỉ để thêm
// ánh sáng loãng cho chùm có thể tích.
//
// Ba lớp, từ trong ra:
//   1. LÕI SÁNG: một sợi sáng ở trục chùm — lõi cho hướng.
//   2. CÁC SỢI TIA: mỗi sợi là một giọt sáng mảnh (lõi sáng + mép mờ) chạy
//      dọc theo X. Các sợi lệch nhau theo CẢ Y lẫn Z, nên nhìn TỪ TRÊN xuống
//      vẫn thấy từng sợi tách rời, không dồn thành một mảng phẳng.
//   3. VỎ SÁNG MỀM: một lớp bán trong suốt bao quanh cả bó — cho chùm có
//      khối, có mặt sáng và mặt tối.
//
// Chùm là một NÓN nhẹ: bán kính bó co lại dần về phía đầu +X (hướng nguồn
// sáng). Nón nhẹ, không khít: tia hội tụ thì phải còn khe giữa các tia,
// hội tụ sát thì chùm lại thành một cục trắng.
//
// Phần mờ dần tính theo toạ độ thế giới (vW.x), nên hai đầu chùm tan vào
// không khí chứ không kết thúc bằng một mũi nhọn. `uOff` bù lại toạ độ
// thế giới của gốc chùm, để vùng mờ luôn bám đúng hai đầu a và b.
import * as THREE from 'three';
import { fxLayer, mulberry } from '../../../../../rig/kit.js';

const VS = `
varying vec3 vW; varying vec3 vN; varying vec3 vV; varying vec3 vNW;
void main(){
  vW = (modelMatrix * vec4(position, 1.0)).xyz;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  vNW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * mv;
}`;

// vật liệu sáng: độ sáng = độ dày quang học (chord) × mặt sáng/tối (lambert)
// × độ mờ hai đầu. Không viền mực.
//   blend = 'normal' : thân tia — lệch hẳn màu nền, đọc được từng sợi.
//   blend = 'add'    : lớp cộng rất mờ — thêm ánh sáng loãng cho chùm.
function rayMat({ color, gain, alpha, core = 0, a, b, fadeIn, fadeOut, light, blend = 'normal' }) {
  const c = new THREE.Color(color);
  const L = new THREE.Vector3(...light).normalize();
  return new THREE.ShaderMaterial({
    uniforms: {
      uCol: { value: c }, uGain: { value: gain }, uA: { value: alpha },
      uCore: { value: core }, uL: { value: L },
      uA0: { value: a }, uB0: { value: b }, uFin: { value: fadeIn }, uFout: { value: fadeOut },
      uOff: { value: 0 },
    },
    vertexShader: VS,
    fragmentShader: `
      varying vec3 vW; varying vec3 vN; varying vec3 vV; varying vec3 vNW;
      uniform vec3 uCol, uL;
      uniform float uGain, uA, uCore, uA0, uB0, uFin, uFout, uOff;
      void main(){
        float x = vW.x - uOff;
        float fade = clamp((x - uA0) / uFin, 0.0, 1.0) * clamp((uB0 - x) / uFout, 0.0, 1.0);
        float chord = abs(dot(normalize(vN), normalize(vV)));
        float lam = 0.5 + 0.5 * dot(normalize(vNW), uL);
        float body = pow(chord, 0.85) * (0.35 + 0.65 * lam);
        float f = (body + uCore * pow(chord, 12.0)) * fade;
        gl_FragColor = vec4(uCol * uGain, f * uA);
      }`,
    transparent: true, depthWrite: false, side: THREE.FrontSide,
    blending: blend === 'add' ? THREE.AdditiveBlending : THREE.NormalBlending,
    toneMapped: false,
  });
}

// một ống sáng chạy từ p0 tới p1; bán kính r0 ở p0, r1 ở p1
function tube(p0, p1, r0, r1, mat, seg = 14) {
  const A = new THREE.Vector3(...p0), B = new THREE.Vector3(...p1);
  const dir = B.clone().sub(A);
  const geo = new THREE.CylinderGeometry(r1, r0, dir.length(), seg, 1, true);
  const m = new THREE.Mesh(geo, mat);
  m.position.copy(A).addScaledVector(dir, .5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return m;
}

export function chumSangNgang(opts = {}) {
  const {
    a = -16, b = 28,
    n = 7,                    // số sợi tia
    spreadY = .10, spreadZ = .13,   // bán kính chéo tại đầu xa của bó
    converge = .38,           // bán kính còn lại ở đầu hướng nguồn sáng
    strandR = .009, haloR = .017,
    coreR = .011,
    shellPad = .030,
    fadeInK = .16, fadeOutK = .18,  // độ dài vùng mờ, theo tỉ lệ chiều dài chùm
    light = [.28, .82, .48],
    seed = 11,
  } = opts;

  const len = b - a;
  const fadeIn = len * fadeInK, fadeOut = len * fadeOutK;
  const g = new THREE.Group(); g.name = 'chùm sáng ngang của Mặt Trời';

  const mats = [];
  const mk = o => { const m = rayMat({ a, b, fadeIn, fadeOut, light, ...o }); mats.push(m); return m; };

  // ── 1. lõi sáng ở trục chùm ────────────────────────────────────────────
  // Lõi là một sợi trắng mảnh (đọc được) cộng thêm một lớp cộng rất mờ
  // (để chùm rực lên trên nền trời tối).
  const coreMat = mk({ color: '#fff6e0', gain: 1.0, alpha: .62, core: .30 });
  const coreGlow = mk({ color: '#ffe9bd', gain: .8, alpha: .16, core: .12, blend: 'add' });
  const core = tube([a, 0, 0], [b, 0, 0], coreR, coreR * converge, coreMat, 20);
  const coreG = tube([a, 0, 0], [b, 0, 0], coreR * .55, coreR * .55 * converge, coreGlow, 16);

  // ── 2. bó tia: mỗi sợi một giọt sáng mảnh, lệch nhau theo Y và Z ───────
  // Sợi phải MỎNG so với khoảng cách giữa hai sợi, thì mới còn khe tối
  // giữa chúng: sợi to bằng khoảng cách sẽ dính thành một mảng trắng.
  const rays = new THREE.Group();
  const rnd = mulberry(seed);
  for (let i = 0; i < n; i++) {
    const rho = Math.sqrt((i + .5) / n) * (.88 + .12 * rnd());
    const th = i * 2.39996 + (rnd() - .5) * .30;
    const yA = rho * Math.cos(th) * spreadY, zA = rho * Math.sin(th) * spreadZ;
    const p0 = [a, yA, zA], p1 = [b, yA * converge, zA * converge];
    // mép mờ: vàng nắng, lệch màu nền nên từng sợi vẫn thấy
    const haloMat = mk({ color: '#f0b64f', gain: 1.0, alpha: .55 });
    // lõi sợi: trắng mảnh
    const thinMat = mk({ color: '#fffaef', gain: 1.0, alpha: .88, core: .35 });
    const halo = tube(p0, p1, haloR * converge, haloR, haloMat, 12);
    const thin = tube(p0, p1, strandR * converge, strandR, thinMat, 12);
    rays.add(halo, thin);
  }

  // ── 3. vỏ sáng mềm bao quanh cả bó ────────────────────────────────────
  const shellMat = mk({ color: '#ffe6b4', gain: .45, alpha: .035, blend: 'add' });
  const Renv = Math.max(spreadY, spreadZ) + shellPad;
  const shell = tube([a, 0, 0], [b, 0, 0], Renv, Renv * converge, shellMat, 26);

  const beamCore = new THREE.Group(); beamCore.add(core, coreG, rays);
  const beamGlow = new THREE.Group(); beamGlow.add(shell);
  g.add(beamCore, beamGlow);

  // vùng mờ bám theo toạ độ thế giới: bù toạ độ thế giới của gốc chùm
  const tmp = new THREE.Vector3();
  const sync = () => {
    g.getWorldPosition(tmp);
    for (const m of mats) m.uniforms.uOff.value = tmp.x;
  };
  g.traverse(o => { if (o.isMesh) o.onBeforeRender = sync; });

  g.userData.parts = { beamCore, beamGlow };
  fxLayer(g);
  return g;
}

// Ảnh vật: một đoạn chùm ngắn, bó tia tách rời rõ và lõi sáng ở giữa.
// Bề dày sợi được phóng lên so với lúc dùng trong phim: sợi mảnh quá thì
// dựng ra chỉ là một vạch mờ, đọc không ra là tia.
export const PROP = {
  name: 'chùm sáng ngang của Mặt Trời',
  view: () => chumSangNgang({
    a: -.9, b: .9,
    n: 5,
    spreadY: .16, spreadZ: .20, converge: .34,
    strandR: .020, haloR: .042, coreR: .030, shellPad: .050,
  }),
};
