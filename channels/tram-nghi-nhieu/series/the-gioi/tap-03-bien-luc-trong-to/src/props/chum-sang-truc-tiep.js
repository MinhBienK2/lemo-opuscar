// Chùm sáng đi thẳng tới mắt: một HÌNH NÓN hội tụ về phía máy quay.
//
// Miệng nón nằm ở z = 0 (cục bộ), thân nón kéo về z = -len: người xem đứng
// phía máy nhìn vào miệng nón thấy một vòng tia toả ra và hội tụ về một điểm
// sâu bên trong — đúng nghĩa "ánh sáng đi thẳng vào mắt ta". Trước đây chùm
// chỉ là HAI sợi mép nằm cùng một mặt phẳng nên nhìn từ trên chỉ thấy một
// thanh dẹt, đọc ra là "dây khóa áo" chứ không phải ánh sáng.
//
// Một bài học từ ảnh vật: sáng CỘNG (additive) trên nền sáng thì thành một
// mảng trắng cháy, không còn cấu trúc gì cả. Vì vậy phần đọc được là THÂN
// TIA: mỗi sợi tia là một giọt hổ phách có viền mềm (pha trộn thường — lệch
// hẳn màu nền) với một lõi trắng mảnh, còn lớp cộng chỉ để thêm ánh sáng
// loãng cho chùm có thể tích. Như vậy ở cả ba góc nhìn đều thấy TỪNG sợi
// tia tách rời, không phải một vệt trắng dẹt.
//
// Bốn lớp, tất cả đều là ÁNH SÁNG nên nằm ở lớp fx (không viền mực: một
// ống toon đặc có mép mực cứng và mặt kem đục đọc ra là que gỗ, không phải
// sáng):
//
//   · TIA LỆCH — mười hai sợi mảnh toả quanh TRỤC, từ miệng nón hội tụ về
//     trục. Nhìn từ trên thấy một VÒNG tia toả ra nên chùm có khối, có mặt
//     sáng/mặt tối, chứ không phải một tấm phẳng.
//   · VỎ MỜ — một nón xuyên suốt, mờ, cho chùm có thể tích; mờ dần về phía
//     đầu hội tụ nên chùm tan vào không khí chứ không kết thúc bằng vách.
//   · LÕI SÁNG (sbBody) — sợi sáng trắng ở trục, bật ở câu nhìn dọc theo
//     chùm; không bật thì chùm còn các tia và vỏ, vẫn đọc ra là chùm sáng.
//   · QUẦNG SÁNG ở miệng nón — một nón loảng toả ra phía người xem, mềm mờ
//     ở rìa.
//
// Không dùng một khối trắng đặc: khối trắng đọc ra là mặt trời, chứ không phải
// một chùm sáng đi thẳng. Cũng không dùng một VÀNH TRÒN cứng ở miệng nón:
// vành tròn mảnh đứng trơ ra giữa khung đọc ra là hình vẽ (bánh xe, quạt),
// không phải ánh sáng.
import * as THREE from 'three';
import { fxLayer, glowMat } from '../../../../../rig/kit.js';

const VS = `
varying vec3 vN; varying vec3 vV; varying vec3 vL;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  vL = position;                       // toạ độ cục bộ: miệng nón ở z = 0
  gl_Position = projectionMatrix * mv;
}`;

// Vỏ/tia: fresnel cho thể tích (mặt sáng ở giữa, mặt tối ở rìa) và độ sáng
// theo chiều dài — tính theo toạ độ cục bộ của hình, không theo đỉnh.
//
// t = 0 ở miệng nón (z = 0), t = 1 ở đầu hội tụ (nguồn sáng). Ánh sáng
// MẠNH ở nguồn và yếu dần khi toả ra: sáng ngược lại thì chùm đọc ra là
// một quạt kéo từ miệng, không phải ánh sáng đi thẳng vào mắt.
//
// blend = 'add'    : cộng ánh sáng (chỉ dùng cho lớp rất mờ).
// blend = 'normal' : pha trộn thường — giữ được màu của tia trên nền sáng.
function surfaceMat({ color, alpha, pow, core = 0, fade = [.35, .95], floor = 0, len = 1, k = 1.6, blend = 'add' }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uCol: { value: new THREE.Color(color) }, uA: { value: alpha },
      uPow: { value: pow }, uCore: { value: core },
      uF0: { value: fade[0] }, uF1: { value: fade[1] }, uFloor: { value: floor },
      uLen: { value: len }, uK: { value: k },
    },
    vertexShader: VS,
    fragmentShader: `
varying vec3 vN; varying vec3 vV; varying vec3 vL;
uniform vec3 uCol; uniform float uA, uPow, uCore, uF0, uF1, uFloor, uLen, uK;
void main(){
  float d = abs(dot(normalize(vN), normalize(vV)));
  float t = clamp(-vL.z / max(uLen, 1e-4), 0.0, 1.0);
  float fade = mix(uFloor, 1.0, smoothstep(uF0, uF1, t));
  float f = pow(d, uPow) + uCore * pow(d, 9.0);
  float a = f * uA * fade;
  gl_FragColor = vec4(uCol * uK, a);
}`,
    transparent: true, depthWrite: false,
    blending: blend === 'normal' ? THREE.NormalBlending : THREE.AdditiveBlending,
    side: blend === 'normal' ? THREE.FrontSide : THREE.DoubleSide,
    toneMapped: false,
  });
}

export function chumSangTrucTiep(opts = {}) {
  const { r = .50, len = 18, tubeR = .042, body = false } = opts;
  const g = new THREE.Group(); g.name = 'chùm sáng đi thẳng tới mắt';
  const rTip = r * .07;                 // bán kính ở đầu hội tụ (nơi nguồn sáng)

  // ── tia lệch: mười hai sợi toả quanh trục, hội tụ về trục ──────────
  // Chúng là bộ phận đặc trưng nhất: nhìn từ trên thấy một vòng tia toả ra
  // (có khối), nhìn ngược thấy chúng kéo về phía máy (đi thẳng vào mắt).
  //
  // Mỗi sợi gồm hai lớp: một vỏ hổ phách PHA TRỘN THƯỜNG (mềm, viền mờ,
  // lệch hẳn màu nền nên đọc được từng sợi) và một lõi trắng mảnh.
  const softMat = surfaceMat({
    color: '#e0a24a', alpha: .20, pow: 1.5, core: 0,
    fade: [.45, 1.0], floor: .52, len, k: 1.0, blend: 'normal',
  });
  const coreMat = surfaceMat({
    color: '#fff4dc', alpha: .30, pow: 1.15, core: .25,
    fade: [.45, 1.0], floor: .46, len, k: 1.0, blend: 'normal',
  });
  const rays = new THREE.Group();
  const N = 12;
  for (let i = 0; i < N; i++) {
    const a0 = i / N * Math.PI * 2;
    const pts = [];
    for (let k = 0; k <= 4; k++) {
      const t = k / 4;
      const a = a0 + .26 * t;                                  // xoắn nhẹ: chùm có chiều sâu
      const rr = (r + (rTip - r) * t) * (1 + .10 * Math.sin(Math.PI * t));
      pts.push(new THREE.Vector3(Math.cos(a) * rr, Math.sin(a) * rr, -len * t));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const soft = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, tubeR * 2.1, 8, false), softMat);
    const core = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, tubeR * .78, 6, false), coreMat);
    fxLayer(soft); fxLayer(core);
    rays.add(soft, core);
  }
  g.add(rays);

  // ── vỏ mờ: một nón xuyên suốt cho chùm có thể tích ────────────────────
  // Miệng rộng ở z = 0, thu dần về z = -len; mờ dần trước khi tới đầu hội tụ.
  const shellGeo = new THREE.CylinderGeometry(r * .96, rTip, len, 48, 1, true);
  shellGeo.rotateX(Math.PI / 2);         // trục của hình trụ nằm theo Z
  shellGeo.translate(0, 0, -len / 2);
  const sbFill = new THREE.Mesh(shellGeo, surfaceMat({
    color: '#ffdca0', alpha: .020, pow: 1.7, core: .03,
    fade: [.20, .85], floor: .30, len, k: 1.0,
  }));
  fxLayer(sbFill);
  g.add(sbFill);

  // ── lõi sáng ở trục: bật ở câu nhìn dọc theo chùm (sbBody) ──────────
  const coreGeo = new THREE.CylinderGeometry(r * .30, rTip * .8, len, 24, 1, true);
  coreGeo.rotateX(Math.PI / 2);
  coreGeo.translate(0, 0, -len / 2);
  const sbBody = new THREE.Mesh(coreGeo, surfaceMat({
    color: '#fffdf4', alpha: .045, pow: .95, core: .80,
    fade: [.45, 1.0], floor: .50, len, k: 1.0,
  }));
  sbBody.visible = !!body;
  fxLayer(sbBody);
  g.add(sbBody);

  // ── quầng sáng ở miệng nón, hướng về phía người xem ─────────────────
  // Nón loảng toả ra phía người xem: miệng ánh sáng mở ra. Dùng nón mềm
  // chứ không dùng vành tròn — vành tròn mảnh cứng đọc ra là hình vẽ.
  const flareH = r * .55;
  const flareGeo = new THREE.CylinderGeometry(r * 1.35, r * 1.02, flareH, 48, 1, true);
  flareGeo.rotateX(Math.PI / 2);
  flareGeo.translate(0, 0, flareH / 2);
  const flare = new THREE.Mesh(flareGeo, surfaceMat({
    color: '#ffcf87', alpha: .10, pow: 1.6, core: 0,
    fade: [2, 3], floor: 1, len, k: 1.0, blend: 'normal',
  }));
  fxLayer(flare);
  g.add(flare);

  // ── đầu hội tụ: một điểm sáng nhỏ, đọc ra là nguồn của chùm ──────────
  const tip = new THREE.Mesh(
    new THREE.SphereGeometry(r * .13, 16, 12),
    glowMat('#fff4d8', 1.2, {
      transparent: true, opacity: .60, blending: THREE.AdditiveBlending, depthWrite: false,
    }),
  );
  tip.position.set(0, 0, -len);
  fxLayer(tip);
  g.add(tip);

  g.userData.parts = { sbFill, sbBody };
  return g;
}

// Ảnh vật: miệng nón ở gần máy, thân nón kéo về sau, có cả lõi sáng bật.
// Miệng nón hẹp hơn chiều dài nên ảnh không bị xoay ngang: người xem thấy
// đúng một chùm hội tụ về phía mình.
export const PROP = {
  name: 'chùm sáng đi thẳng tới mắt',
  view: () => chumSangTrucTiep({ r: .40, len: 1.5, tubeR: .038, body: true }),
};
