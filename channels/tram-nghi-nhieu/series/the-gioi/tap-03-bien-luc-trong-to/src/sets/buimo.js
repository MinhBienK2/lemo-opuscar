// N5 · sát chân trời: dải nhạt và hạt bụi mờ
//
// Bối cảnh này không có vật thể nào đứng: chỉ có không khí, ánh sáng ở
// chân trời và bụi mờ. Nên "vật" ở đây là chính dải trời sáng bạc — dựng
// thành ba vỏ trụ lồng nhau, mỗi vỏ một tầm xa, để dải ấy có chiều sâu
// chứ không phải một bức tường trắng; còn bụi thì là hạt nhỏ lấp lánh,
// không phải quầng sáng to.
import * as THREE from 'three';
import { canvasTex, mesh, fxLayer, mulberry } from '../../../../../rig/kit.js';
import { keyLight, ambience } from '../../../../../rig/lights.js';
import { glowDots, halos, setDot, setHalo } from '../../../../../rig/fx.js';
import { V3 } from './common.js';

// Chân trời: cao độ mà dải bạc nằm ngay trên đó. Tầm mắt máy ở c25/c26 là
// y = 3.00, nên dải ở 3.05 → nhìn ngang là thấy dải, không phải nhìn xuống.
const HOR = 3.05;

// Hạt bụi chính. Ở c25/c27 nó nằm trong dải sáng (nó làm dải nhoè đi). Ở c26
// máy cận chụp riêng nó, và để hạt đọc rõ trên nền trời phẳng thì nó được
// nâng lên cao hơn dải, ở một chỗ trời tối phẳng.
const GRAIN_IN_BAND = [.15, 3.00, .10];
const GRAIN_IN_SKY = [.00, 3.62, .00];
// Năm hạt không khí nhỏ xíu đứng ngay cạnh hạt bụi, để cỡ chênh lệch đọc ra
// ngay trong khung.
const NEAR_BAND = [
  [.282, 2.95, .145], [.06, 3.04, .16], [.24, 3.10, .02], [.05, 2.88, .05], [.36, 3.06, .22],
];
const NEAR_SKY = [
  [.24, 3.66, -.02], [.28, 3.60, -.04], [.22, 3.62, .01], [.30, 3.68, -.03], [.20, 3.58, -.05],
];
// Hạt không khí NHỎ XÍU đứng cạnh hạt bụi chính, sáng hơn: cỡ chênh lệch
// giữa một hạt bụi mờ to và một hạt không khí nhỏ phải đọc ra ngay trong
// khung, chứ không phải tự đi đối chiếu hai vật ở hai chỗ khác nhau.
// Nó đứng NGAY Ở VIỀN hạt bụi (hạt bụi tỏa sáng trong bán kính ~.12), nên
// người xem thấy "một hạt to, một hạt nhỏ" trong cùng một cặm.
const TINY_SKY = [.165, 3.655, -.018];

// Một hạt bụi: mờ, méo, không phải hình tròn trơn. Vẽ bằng canvas có seed
// để mỗi lần dựng vẫn ra đúng hạt cũ.
function moteTex() {
  return canvasTex(128, 128, (g, w, h) => {
    const r = mulberry(7);
    const cx = w / 2, cy = h / 2;
    g.clearRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      const a = r() * Math.PI * 2, d = r() * w * .13;
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
      const rad = w * .24 + r() * w * .16;
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, 'rgba(255,242,214,.28)');
      gr.addColorStop(.45, 'rgba(255,236,200,.12)');
      gr.addColorStop(1, 'rgba(255,230,190,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
    }
  });
}

export function buildBuiMo() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#241a44');
  scene.fog = new THREE.Fog('#2b2450', 14, 64);

  // ── trời xa: một vòm trời gradient — không mép, không sọc, không cứng ──
  // Vòm to bọc quanh máy nên không bao giờ thấy mép tấm nền; dải màu chạy
  // liên tục nên không có đường nét cứng nào cắt ngang khung.
  const dome = new THREE.Mesh(new THREE.SphereGeometry(240, 64, 40), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, toneMapped: false,
    vertexShader: `varying vec3 vP;
      void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec3 vP;
      void main(){
        vec3 n = normalize(vP);
        float up = max(n.y, 0.), dn = max(-n.y, 0.);
        float az = atan(n.z, n.x);
        // trên chân trời: bạc → xanh → xanh đậm
        // sát chân trời: màu BẠC (không phải xanh) — dải nhạt phải gần như trắng
        // như c25 nói; nếu nền ở chân trời còn xanh thì dải thành xanh nhạt.
        vec3 c = mix(vec3(.44,.45,.50), vec3(.085,.135,.38), smoothstep(0., .018, up));
        // ngay trên dải bạc phải là dải XANH của bầu trời ban ngày, rồi mới
        // tối dần; không có dải xanh thì cả trên băng trông như trời tối.
        c = mix(c, vec3(.07,.19,.58), smoothstep(.006, .022, up));
        c = mix(c, vec3(.03,.05,.26), smoothstep(.022, .30, up));
        // dải xanh đậm NGAY TRÊN dải bạc: bầu trời ban ngày ở phía trên
        // chân trời. Không có nó thì cả trên băng là một mảng hồng nhạt của
        // bloom, đọc ra không phải trời.
        c = mix(c, vec3(.05,.17,.62), exp(-pow((up - .014)/.022, 2.)) * .95);
        // dưới chân trời: nửa dưới là không khí đã lọc hết xanh — nền ẤM,
        // không phải xám xanh. Nếu để màu xám xanh ở đáy, dải xanh sẽ nằm
        // DƯỚI dải đỏ, lập ngược thứ tự màu của c23/c24.
        c = mix(c, vec3(.17,.07,.07), smoothstep(0., .012, dn));
        // dưới chân trời: sát chân trời là dải ĐỎ (ánh sáng đã lọc hết xanh),
        // rồi mới tối dần thành tím. Không có dải đỏ thì nửa dưới khung là
        // một mảng tím trống trơn, không còn gì để đối chiếu với dải nhạt.
        // Đỉnh của dải nằm DƯỚI đường chân trời (dn > 0): đỉnh ở dn = 0 thì
        // exp bằng 1 ở CẢ nửa trên, và cả bầu trời thành màu đỏ.
        // PHẢI nhân thêm cổng dn: ở nửa trên dn = 0 đúng bằng 0, nên exp(...)
        // vẫn còn 0.64 và dải đỏ loang lên CẢ bầu trời ban ngày, biến nửa trên
        // thành một mảng hồng phẳng, mất hẳn màu xanh.
        float redBand = exp(-pow((dn - .020)/.030, 2.)) * smoothstep(0., .008, dn);
        c = mix(c, vec3(.46,.10,.05), redBand * .95);
        c = mix(c, vec3(.075,.035,.055), smoothstep(.055, .120, dn));
        c = mix(c, vec3(.020,.010,.020), smoothstep(.14, .40, dn));
        // dải bạc: đỉnh nằm ngay trên chân trời, mờ dần lên trên.
        // Nhân thêm smoothstep theo dấu để dải tắt hẳn dưới chân trời —
        // không thì cả nửa dưới khung sáng lên như một tấm trắng.
        // Tổng của dải phải nằm dưới ngưỡng bloom: dải trải ngang hết khung,
        // nếu nó cháy quá ngưỡng thì bloom sẽ tỏa thành một màn sương phủ
        // kín cả bức tranh.
        c += vec3(.21,.22,.25) * exp(-pow(up/.028, 2.)) * .90 * smoothstep(-.009, 0., n.y);
        // quầng ấm sát chân trời: cũng phải khoá ở nửa dưới, vì dn = 0 ở nửa
        // trên thì exp bằng 1 và nó làm xám cả bầu trời ban ngày.
        c += vec3(.13,.12,.13) * exp(-pow(dn/.011, 2.)) * .40 * smoothstep(0., .006, dn);
        // viền rõ của chân trời: một đường mảnh, không phải mảng trắng
        c += vec3(.11,.105,.095) * pow(max(0., 1. - abs(n.y)/.0028), 2.);
        // sợi mây mảnh trên cao, và lớp mờ dày dần xuống dưới
        float st = sin(up*62. + 2.2*sin(az*3.1)) * sin(az*2.3 + .7);
        c += vec3(.030,.032,.042) * max(st, 0.) * smoothstep(.015,.09,up) * (1. - smoothstep(.12,.38,up));
        float st2 = sin(dn*44. + 1.8*sin(az*2.7));
        c += vec3(.020,.013,.036) * max(st2, 0.) * (1. - smoothstep(0., .22, dn));
        gl_FragColor = vec4(c, 1.);
      }`,
  }));
  dome.position.set(0, HOR, 0);
  dome.frustumCulled = false;
  scene.add(dome);

  // ── dải nhạt: ba vỏ trụ lồng nhau, mỗi vỏ một tầm xa ────────────────
  // Biên dưới của mỗi vỏ nằm ở một cao độ khác nhau, nên nhìn ngang chúng
  // thành ba đường ngang chồng lên nhau: đó là chiều sâu của dải. Vỏ gần
  // thấp và sáng, vỏ xa cao và mờ — như ba lớp không khí nối tiếp.
  const SH = [
    { r: 16, y0: 2.45, h: .55, col: '#ffe4bc', k: .95, op: .100, seed: .3 },
    { r: 40, y0: 2.75, h: 1.45, col: '#f6f0ff', k: .90, op: .105, seed: 1.7 },
    { r: 90, y0: 3.05, h: 3.30, col: '#e4eaff', k: .82, op: .110, seed: 2.9 },
  ];
  for (const S of SH) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(S.r, S.r, S.h, 128, 1, true), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.BackSide, fog: false, toneMapped: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uCol: { value: new THREE.Color(S.col) },
        uK: { value: S.k }, uOp: { value: S.op },
        uCam: { value: new THREE.Vector3() },
        uAim: { value: new THREE.Vector3(0, 0, -1) },
        uSeed: { value: S.seed },
      },
      vertexShader: `varying vec3 vW; varying float vT;
        void main(){ vT = uv.y; vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz;
          gl_Position = projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `uniform vec3 uCol, uCam, uAim; uniform float uK, uOp, uSeed;
        varying vec3 vW; varying float vT;
        void main(){
          vec2 rel = vW.xz - uCam.xz;
          float az = atan(rel.y, rel.x);
          // mép méo tay: biên trên run nhẹ theo góc, không phải đường thẳng
          float wob = .050*sin(az*6. + uSeed) + .028*sin(az*15. - uSeed*2.1) + .014*sin(az*31.);
          float t = clamp(vT + wob, 0., 1.);
          // lớp mờ bật dần ở biên dưới rồi mờ đi ở biên trên: nếu bật thẳng
          // thì chân trời bị cắt ngang thành một bậc thang, trông như lỗi.
          float prof = smoothstep(0., .16, t) * pow(1. - t, 2.2);
          vec3 dir = normalize(vec3(rel.x, 0., rel.y));
          float glow = .40 + .60*pow(max(dot(dir, uAim), 0.), 2.);
          vec3 c = mix(uCol, vec3(.80,.86,1.), smoothstep(0., .5, t));
          gl_FragColor = vec4(c*uK*glow, prof*uOp);
        }`,
    }));
    m.position.set(0, S.y0 + S.h / 2, 0);
    m.renderOrder = 4;
    scene.add(m);
    S.mat = m.material;
  }

  // ── hạt bụi mờ: nhỏ, lấp lánh, lơ lửng trong dải ──────────────────────
  // Bụi túm quanh dải: nhiều hạt nhỏ cùng nằm trong vùng sáng thì dải bị
  // nhoè đi, đúng câu "hạt bụi chỉ làm nhoè màu" của c27. Màu và độ sáng
  // phải NHẠT: hạt bụi đậm và ấm làm cả nửa trên khung thành một mảng hồng
  // phẳng, mất hẳn màu xanh của bầu trời ban ngày.
  const rnd = mulberry(31);
  const tex = moteTex();
  const dust = halos(56, '#ffe6c8', .28, tex);
  const dp = [], ds = [];
  for (let i = 0; i < 56; i++) {
    // Bụi vương lên cao hơn dải một chút: nửa trên khung phải có hạt tiền cảnh,
    // không trống trơn một mảng màu.
    dp.push(V3((rnd() - .5) * 14, 2.92 + rnd() * 1.55, -11 + rnd() * 14));
    ds.push(.030 + rnd() * .055);
  }
  dust.count = 56; scene.add(dust);

  // Hạt bụi chính của tập: đứng đúng chỗ máy cận nhìn (c26), to hơn hạt
  // không khí ngay bên cạnh nhiều lần.
  const mote0 = mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
    map: tex, color: new THREE.Color('#ffe3b8'),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
  }), [.15, 3.00, .10], { cast: false, recv: false });
  mote0.scale.set(.062, .062, 1);
  fxLayer(mote0);
  scene.add(mote0);

  // lõi sáng của hạt bụi: một chấm nhỏ, để hạt trông như bắt được nắng
  const core0 = mesh(new THREE.SphereGeometry(.0013, 10, 8), new THREE.MeshBasicMaterial({
    color: new THREE.Color('#fff2d2').multiplyScalar(1.5), toneMapped: false,
    transparent: true, depthWrite: false,
  }), [.15, 3.00, .10], { cast: false, recv: false });
  fxLayer(core0);
  scene.add(core0);

  // ── hạt không khí: nhỏ xíu, để thấy bụi to hơn hạt bao nhiêu ──────────
  // Sáng vừa đủ (dưới ngưỡng bloom) — nếu để chúng cháy HDR, hàng trăm chấm
  // sẽ hòa thành một màn sương mờ phủ kín khung.
  const motes = glowDots(220, .0035, '#dff0ff', .92);
  const mp = [];
  for (let i = 0; i < 220; i++) mp.push(V3((rnd() - .5) * 9, 2.2 + rnd() * 2.6, -8 + rnd() * 11));
  // một hạt không khí nằm ngay cạnh hạt bụi chính, để so sánh cỡ ngay trong
  // khung; thêm vài hạt nữa quanh đó cho khung cận có chút lấp lánh.
  const near = NEAR_BAND;
  for (let i = 0; i < 5; i++) mp[i] = V3(...near[i]);
  motes.count = 220; scene.add(motes);

  // Hạt không khí nhỏ xíu đứng cạnh hạt bụi ở c26: sáng hơn hẳn mấy hạt kia,
  // nhưng vẫn nhỏ xíu — đọc ra là "một hạt bụi to và một hạt bụi nhỏ", chứ
  // không phải hai đốm sáng bằng nhau.
  const tiny = glowDots(1, .0022, '#fff4de', 1.9);
  tiny.count = 0; scene.add(tiny);

  const key = keyLight(scene, { color: '#ffc890', intensity: 1.6, from: V3(-8, 3.4, 6), to: V3(0, 3.2, 0), size: 9, far: 40 });
  ambience(scene, { sky: '#6a5aa8', ground: '#3a2048', fill: .35, rim: '#9a7bff', rimI: .5, rimFrom: [4, 4, -5] });

  const _dir = new THREE.Vector3();
  const _aim = new THREE.Vector3(0, 0, -1);
  const _camP = new THREE.Vector3();

  return {
    scene, key,
    update(t, s, cam) {
      const q = cam ? cam.quaternion : new THREE.Quaternion();
      const st = s || {};
      const up = !!st.grainUp;

      // Dải sáng ở đúng chỗ máy đang nhìn: chỗ sáng nhất của khung phải là
      // chỗ đang nhìn. Thiếu máy thì để dải sáng thẳng phía trước.
      if (cam) {
        cam.getWorldDirection(_dir);
        _aim.set(_dir.x, 0, _dir.z);
        if (_aim.lengthSq() < 1e-6) _aim.set(0, 0, -1);
        _aim.normalize();
        _camP.setFromMatrixPosition(cam.matrixWorld);
        for (const S of SH) {
          S.mat.uniforms.uCam.value.copy(_camP);
          S.mat.uniforms.uAim.value.copy(_aim);
        }
      }

      for (let i = 0; i < dp.length; i++) {
        const p = dp[i];
        const drift = .16;
        setHalo(dust, i, V3(p.x + Math.sin(t * .3 + i) * drift, p.y + Math.cos(t * .25 + i) * drift, p.z), ds[i], q);
      }
      dust.instanceMatrix.needsUpdate = true;

      const near = up ? NEAR_SKY : NEAR_BAND;
      for (let i = 0; i < mp.length; i++) {
        const p = i < 5 ? near[i] : mp[i];
        const drift = i < 5 ? .01 : .09;       // mấy hạt cạnh hạt bụi chính đứng yên
        setDot(motes, i, V3(p.x + Math.sin(t * .4 + i * .3) * drift, p.y + Math.cos(t * .33 + i) * drift, p.z), 1);
      }
      motes.instanceMatrix.needsUpdate = true;

      // Hạt bụi chính: ở cận (fov hẹp) nó là chủ thể nên sáng hơn cả dải;
      // ở khung rộng nó chỉ là một phần nhỏ của dải nên phải dịu lại, để
      // chỗ sáng nhất của khung vẫn là dải.
      const close = cam ? cam.fov < 24 : false;
      const k = close ? 1.05 : .52;
      mote0.material.color.set('#ffe3b8').multiplyScalar(k);
      core0.material.color.set('#fff2d2').multiplyScalar(up ? .95 : (close ? 1.5 : .88));
      // Ở c26 hạt bụi được nâng lên nền trời phẳng và phóng to để chiếm
      // lớn khung; ở c25/c27 nó nằm lại trong dải.
      const g0 = up ? GRAIN_IN_SKY : GRAIN_IN_BAND;
      const gs = up ? .22 : .062;
      const bx = g0[0] + Math.sin(t * .3) * .015, by = g0[1] + Math.cos(t * .25) * .015, bz = g0[2];
      mote0.scale.set(gs, gs, 1);
      mote0.position.set(bx, by, bz);
      mote0.quaternion.copy(q);
      core0.position.set(bx, by, bz);
      core0.scale.setScalar(up ? 1.7 : 1);
      // hạt không khí nhỏ xíu cạnh hạt bụi: chỉ ở c26, và đứng yên
      tiny.count = up ? 1 : 0;
      if (up) setDot(tiny, 0, V3(TINY_SKY[0], TINY_SKY[1], TINY_SKY[2]), 1);
      tiny.instanceMatrix.needsUpdate = true;
    },
  };
}
