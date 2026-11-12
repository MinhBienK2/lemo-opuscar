// Dòng sáng bị rẽ: một tia đi thẳng tới một mặt kính rồi ĐỔI HƯỚNG.
//
// Ba nhóm, đúng như bối cảnh bật/tắt: `side` (tia tới kính + tia đi tiếp ra
// + hai hạt neo), `toward` (tia bay về phía máy), `all` (mười bốn tia hội tụ
// về một tâm).
//
// Tia là ÁNH SÁNG, không phải vật thể: nó không có viền mực. Ống toon đặc có
// mép mực cứng đọc ra là que nhựa; hai que cắt chéo đọc ra là cối quạt gió.
// Ống tia ở đây nằm ở lớp fx (lớp 1): lõi rực + quầng sáng mờ quanh, tan dần
// ở hai đầu.
//
// HÌNH HỌC PHẢI NÓI CHUYỆN "RẼ": tia thứ nhất đi thẳng tới mặt kính và DỪNG
// ở đó; từ chính điểm đó tia thứ hai phát ra theo hướng lệch rõ (lệch 75°
// trong không gian, 65° trên màn ảnh) và dài hơn tia thứ nhất. Hai tia không
// xuyên qua nhau: tia thứ nhất dừng ở mặt kính, tia thứ hai phát ra từ đúng
// điểm ấy, ở phía trước mặt kính.
//
// Tấm kính là một MẶT, không phải một cây cọc: nó đứng nghiêng, mặt trước
// quay về phía máy, và tia phía trước không bao giờ cắt qua mặt của nó.
import * as THREE from 'three';
import { toon, mesh, rbox, fxLayer, TEX } from '../../../../../rig/kit.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

// ── ống thon dần theo một đường cong ─────────────────────────────────────
// uv.x chạy theo chiều dài ống: 0 ở đầu, 1 ở cuối. Vật liệu tia dùng chính
// cái số này để làm tia tan dần ở hai đầu.
function taperedTube(curve, seg, rad, r0, r1) {
  const frames = curve.computeFrenetFrames(seg, false);
  const pos = [], nor = [], uvs = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg, P = curve.getPointAt(t);
    const N = frames.normals[i], B = frames.binormals[i];
    const r = r0 + (r1 - r0) * t;
    for (let j = 0; j <= rad; j++) {
      const a = j / rad * Math.PI * 2, s = Math.sin(a), c = -Math.cos(a);
      const nx = c * N.x + s * B.x, ny = c * N.y + s * B.y, nz = c * N.z + s * B.z;
      pos.push(P.x + r * nx, P.y + r * ny, P.z + r * nz);
      nor.push(nx, ny, nz);
      uvs.push(t, j / rad);
    }
  }
  for (let i = 1; i <= seg; i++) for (let j = 1; j <= rad; j++) {
    const a = (rad + 1) * (i - 1) + (j - 1), b = (rad + 1) * i + (j - 1),
      c = (rad + 1) * i + j, d = (rad + 1) * (i - 1) + j;
    idx.push(a, b, d, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(idx);
  return g;
}

// ── vật liệu tia ──────────────────────────────────────────────────────────
// Sáng trên (HDR, để nở hoa), trong suốt, cộng dồn: đọc ra là ánh sáng.
const RAY_VS = `
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

const RAY_FS = `
uniform vec3 uCol; uniform float uA, uPow, uCore, uFin, uFout;
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){
  float f = smoothstep(0.0, uFin, vUv.x) * (1.0 - smoothstep(1.0 - uFout, 1.0, vUv.x));
  float nv = abs(dot(normalize(vN), normalize(vV)));
  float a = (pow(nv, uPow) + uCore * pow(nv, 18.0)) * uA * f;
  gl_FragColor = vec4(uCol, a);
}`;

function rayMat(color, k, a, pow, core, fin, fout) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uCol: { value: new THREE.Color(color).multiplyScalar(k) },
      uA: { value: a }, uPow: { value: pow }, uCore: { value: core },
      uFin: { value: Math.max(.002, fin) }, uFout: { value: Math.max(.002, fout) },
    },
    vertexShader: RAY_VS, fragmentShader: RAY_FS,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending, toneMapped: false,
  });
}

// một tia sáng: lõi rực + quầng mờ quanh, KHÔNG viền mực
function lightRay(pts, o = {}) {
  const {
    core = .030, halo = .095, color = '#9fe0ff', k = 2.4, a = .85, ka = .16,
    fin = .22, fout = .22, taper = .5, seg = 44,
  } = o;
  const curve = new THREE.CatmullRomCurve3(pts.map(p => p.clone()));
  const g = new THREE.Group();
  const c = new THREE.Mesh(taperedTube(curve, seg, 10, core, core * taper),
    rayMat(color, k, a, 1.5, .55, fin, fout));
  const h = new THREE.Mesh(taperedTube(curve, seg, 8, halo, halo * taper),
    rayMat(color, k * .55, ka, 1.0, .10, fin * 1.7, fout * 1.7));
  c.renderOrder = 6; h.renderOrder = 5;
  fxLayer(c); fxLayer(h);
  g.add(c, h);
  return g;
}

// một chớp sáng tròn: dùng ở điểm tia chạm mặt kính.
// Nhỏ thôi: chớp to nuốt mất chính hai tia, và nó làm khung hình phình ra.
function flare(at, size, color = '#e8f8ff') {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: TEX.radial('rgba(255,255,255,1)'),
    color: new THREE.Color(color).multiplyScalar(1.1),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  }));
  s.scale.set(size, size, 1);
  s.position.copy(at);
  s.renderOrder = 7;
  fxLayer(s);
  return s;
}

export function dongSangRe(opts = {}) {
  const {
    fan = 0, pos = 1, thick = 1,
  } = opts;
  const g = new THREE.Group(); g.name = 'dòng sáng bị rẽ';
  const P = (x, y, z) => new THREE.Vector3(x * pos, y * pos, z * pos);
  // mọi thứ cùng cỡ với nhau: hạt, tấm kính và tia đều nhỏ theo `pos`
  const R = (r) => r * pos * thick;
  const RS = pos * thick;

  // ── side: tia tới mặt kính, rồi một tia khác đi tiếp ra ────────────────
  // B là điểm bẻ: nằm đúng trên mặt trước của tấm kính. Tia thứ nhất đi tới
  // B và DỪNG ở đó; tia thứ hai phát ra từ B theo hướng lệch rõ.
  const B = P(0, .42, 0);
  // tia thứ nhất: đi gần ngang từ bên trái, hơi chếch về phía sau
  const d1 = V3(.956, -.151, -.252);
  // tia thứ hai: từ điểm bẻ lao xuống trước — lệch 65° trên màn ảnh, 75°
  // trong không gian, và dài hơn tia thứ nhất.
  const d2 = V3(.252, -.856, .453);
  const A = B.clone().addScaledVector(d1, -1.05);   // hạt neo: đầu tia thứ nhất
  const C = B.clone().addScaledVector(d2, 1.35);    // hạt neo: cuối tia thứ hai
  // pháp tuyến của mặt kính: tia tới với góc 56°, tia đi ra với góc 52° —
  // nên tia đi ra luôn nằm ở phía TRƯỚC mặt kính, không cắt qua nó.
  const nrm = V3(-.45, -.45, .77);

  const Bf = B.clone().addScaledVector(nrm, .004);   // bề mặt kính
  const rayIn = lightRay(
    [A, A.clone().lerp(B, .5).add(V3(0, .015, .03)), Bf],
    { core: .030 * RS, halo: .095 * RS, color: '#b7e8ff', k: 2.4, a: .88, ka: .17, fin: .22, fout: .05, taper: .55 });
  const rayOut = lightRay(
    [Bf, B.clone().lerp(C, .5).add(V3(0, .01, .02)), C],
    { core: .030 * RS, halo: .095 * RS, color: '#8fdcff', k: 2.4, a: .88, ka: .17, fin: .05, fout: .28, taper: .55 });

  // hạt trắng rực: tia phải bám vào chúng
  const anchorA = mesh(new THREE.SphereGeometry(R(.068), 16, 12),
    toon('#fffaf0', { emissive: new THREE.Color('#ffe6b8').multiplyScalar(.7) }),
    [A.x, A.y, A.z]);
  const anchorB = mesh(new THREE.SphereGeometry(R(.062), 16, 12),
    toon('#fffaf0', { emissive: new THREE.Color('#ffe6b8').multiplyScalar(.7) }),
    [C.x, C.y, C.z]);

  // tấm kính: một mặt kính nhỏ đứng nghiêng, mặt trước quay về phía máy.
  // Dày thật (khối kính có sợi), để nhìn từ góc nghiêng nó vẫn là một vật
  // có bề dày chứ không phải một mảnh giấy.
  const pw = .55 * pos, ph = .62 * pos, pt = .10 * pos;
  const pane = new THREE.Group();
  pane.add(mesh(rbox(pw, ph, pt, .016, 2),
    toon('#e6f7ff', {
      transparent: true, opacity: .50,
      emissive: new THREE.Color('#7ccfe8').multiplyScalar(.30),
    }), [0, 0, 0]));
  pane.position.copy(B).addScaledVector(nrm, -pt / 2);
  pane.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nrm);

  // chớp sáng ở điểm bẻ: điểm tia chạm kính là điểm sáng nhất
  const hit = flare(Bf, .11 * RS, '#dff6ff');
  const hit2 = flare(Bf, .22 * RS, '#8fdcff');

  const side = new THREE.Group();
  side.add(anchorA, anchorB, rayIn, rayOut, pane, hit, hit2);

  // ── toward: dòng bay về phía ta ────────────────────────────────────────
  // Dòng dừng lại ở z = 1.15, cách máy hơn nửa mét: nếu đi thẳng vào mặt
  // máy thì sợi sáng hóa thành một nêm trắng che kín khung. Nó xuất phát từ
  // dưới mép tấm kính để không lẫn với chỗ bẻ.
  const nC = P(0, .04, .06);
  const anchorC = mesh(new THREE.SphereGeometry(R(.044), 14, 10),
    toon('#f4fcff', { emissive: new THREE.Color('#a8ecff').multiplyScalar(.7) }), [nC.x, nC.y, nC.z]);
  const rayToCam = lightRay([nC, P(.12, .10, .62), P(.34, .18, 1.15)],
    { core: .028 * RS, halo: .105 * RS, color: '#a8ecff', k: 2.5, a: .90, ka: .19, fin: .12, fout: .40, taper: .8 });
  const toward = new THREE.Group();
  toward.add(anchorC, rayToCam);

  // ── all: mười bốn tia hội tụ về một tâm ────────────────────────────────
  // Tâm ở xa và cao, nên sợi không to quá khi đi ngang qua máy. Ở phim tâm
  // đúng chỗ máy ngước lên nhìn; trong ảnh vật, cụm này thu gọn lại sát vật
  // để khung hình đọc được phần chính (tia bị rẽ).
  const all = new THREE.Group();
  const K = pos * pos * pos;
  const C0 = V3(0, 3.20 * K, -7.0 * K);
  for (let i = 0; i < fan; i++) {
    // điểm xuất phát nằm trên một vỏ cầu quanh tâm: có sợi từ phía sau
    // máy, có sợi từ trên, có sợi từ hai bên — thế mới là "mọi hướng".
    const a = i / fan * Math.PI * 2 + .21;
    const u = .30 + (i % 3) * .26;
    const fx = C0.x + Math.cos(a) * 5.6 * u * K;
    const fy = C0.y + Math.sin(a) * 4.2 * u * K;
    const fz = C0.z + (i % 2 ? 1 : -1) * 4.4 * u * K;
    const from = V3(fx, fy, fz);
    const mid = V3((C0.x + fx) / 2, (C0.y + fy) / 2, (C0.z + fz) / 2);
    all.add(lightRay([from, mid, C0],
      { core: .022 * RS, halo: .070 * RS, color: '#8fdcff', k: 1.25, a: .34, ka: .10, fin: .55, fout: .10, taper: .8 }));
  }
  if (fan) all.add(flare(C0, .08 * RS, '#bfeaff'), flare(C0, .17 * RS, '#6fc8ff'));

  g.add(side, toward, all);
  g.userData.parts = { side, toward, all, anchorA, anchorB, anchorC, rayIn, rayOut, rayToCam, pane };
  return g;
}

// Ảnh vật: tia bị rẽ ở mặt kính, hai hạt neo, tia về phía máy, cụm tia hội tụ.
export const PROP = {
  name: 'dòng sáng bị rẽ',
  view: () => dongSangRe({ fan: 8, pos: .45, thick: 1.0 }),
};
