// Hạt bụi mờ: một CỤM CẦU NHỎ có khối, quấn trong một quầng sáng mềm.
//
// Hạt bụi to hơn hạt không khí rất nhiều, và chính cái cỡ chênh lệch đó là
// thứ người xem phải đọc ra được trong khung: nên ảnh vật đứng cạnh mấy hạt
// không khí nhỏ xíu, sáng hơn.
//
// Hạt bụi là thứ vô hình, nên nó được dựng thành hình minh hoạ: vài cầu nhỏ
// xếp lệch nhau thành một cụm — nhìn từ trên xuống cũng thấy các cầu chồng
// lên nhau, có mặt sáng và mặt tối, chứ không phải một tấm phẳng — và quanh
// cụm là một quầng sáng mềm có vân sương, quầng này luôn quay mặt về máy để
// hạt vẫn mờ như hạt bụi mà không thành một mảnh lưỡi liềm dẹt.
import * as THREE from 'three';
import { canvasTex, toon, mesh, fxLayer, mulberry } from '../../../../../rig/kit.js';
import { glowDots, setDot } from '../../../../../rig/fx.js';

// Một hạt bụi: mờ, méo, không phải hình tròn trơn. Vẽ bằng canvas có seed
// để mỗi lần dựng vẫn ra đúng hạt cũ.
export function moteTex() {
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

// Cụm cầu của hạt bụi: [x, y, z, r] — toạ độ và bán kính theo cỡ của cụm.
// Các cầu không trùng tâm và lệch nhau, nên từ mọi góc nhìn (kể cả từ trên
// xuống) cụm vẫn là một khối có mặt sáng và mặt tối.
const CLUMP = [
  [0, 0, 0, .20],
  [.13, .07, -.07, .145],
  [-.12, .06, .08, .125],
  [.05, -.12, .09, .105],
  [-.08, -.10, -.10, .095],
  [.16, -.07, .08, .075],
  [-.16, -.03, -.04, .065],
  [.02, .13, .05, .060],
  [-.02, -.16, .02, .055],
];

// Gradient map riêng cho hạt bụi: gradient mặc định của rig quá dẹt (mặt
// tối chỉ còn 78% mặt sáng), nên cầu bụi thành một quả trắng trơn, không
// đọc ra khối. Ở đây vùng tối thật tối, nên mặt sáng và mặt tối tách ra.
const DUST_GRAD = (() => {
  const steps = [.04, .06, .22, 1.0];
  const d = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => { const c = Math.round(v * 255); d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = c; d[i * 4 + 3] = 255; });
  const t = new THREE.DataTexture(d, steps.length, 1, THREE.RGBAFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
  return t;
})();

// Alpha map của quầng sáng: sáng ở vành, mờ dần vào trong và ra ngoài.
// Nhờ vậy lõi sáng của tấm phẳng không đè lên cụm cầu (giữ được mặt sáng,
// mặt tối), và quầng không có mép cứng ở rìa bản vẽ — vân sương bị cắt cụt
// ở mép canvas, nếu không che thì quầng thành một mảng trắng có cạnh thẳng.
function veilRingTex() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), w = 128;
  const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
  gr.addColorStop(0, 'rgb(0,0,0)');
  gr.addColorStop(.30, 'rgb(0,0,0)');
  gr.addColorStop(.55, 'rgb(255,255,255)');
  gr.addColorStop(.85, 'rgb(90,90,90)');
  gr.addColorStop(1, 'rgb(0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, w, w);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  t.minFilter = t.magFilter = THREE.LinearFilter;
  t.needsUpdate = true;
  return t;
}

export function hatBuiMo(opts = {}) {
  const {
    at = { x: .15, y: 3.00, z: .10 }, size = .062, tex = null,
    cross = false, tiny = 0, tinyAt = null,
  } = opts;
  const g = new THREE.Group(); g.name = 'hạt bụi mờ';
  const T = tex || moteTex();

  // ── thân của hạt bụi: cụm cầu nhỏ, có khối thật ───────────────────────
  // Vật liệu toon sáng nhạt và ấm, phát sáng nhẹ: hạt vẫn "mờ", nhưng có
  // mặt sáng/mặt tối nên đọc ra là một vật có thể tay chạm vào, không phải
  // một đốm sáng dán lên nền.
  const clMat = toon('#f6dfbc', { grad: DUST_GRAD, emissive: new THREE.Color('#ffe6c6').multiplyScalar(.14) });
  const cl = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 12), clMat, CLUMP.length);
  {
    const rnd = mulberry(23);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    CLUMP.forEach(([x, y, z, r], i) => {
      // hạt bụi méo, không phải quả cầu tròn trơn
      const sy = .80 + rnd() * .40, sz = .80 + rnd() * .40;
      cl.setMatrixAt(i, m.compose(p.set(x, y, z), q, s.set(r, r * sy, r * sz)));
    });
    cl.instanceMatrix.needsUpdate = true;
  }
  cl.frustumCulled = false;
  const clG = new THREE.Group();
  clG.add(cl);
  fxLayer(clG);
  clG.position.set(at.x, at.y, at.z);
  clG.scale.setScalar(size);
  g.add(clG);

  // ── quầng sáng mềm quanh cụm: một tấm phẳng có vân sương ─────────────
  // Tấm này LUÔN quay mặt về máy, nên hạt không bao giờ biến thành một mảnh
  // lưỡi liềm trắng dẹt khi nhìn từ trên xuống, cũng không biến mất khi
  // nhìn ngang tầm mắt.
  const puffMats = [];
  const RING = veilRingTex();
  const mkMat = (op) => {
    const m = new THREE.MeshBasicMaterial({
      map: T, alphaMap: RING, color: new THREE.Color('#ffe3b8').multiplyScalar(.22),
      transparent: true, opacity: op, depthWrite: false,
      blending: THREE.AdditiveBlending, toneMapped: false,
    });
    puffMats.push(m); return m;
  };
  const puffMat = mkMat(1);
  const veilMat = cross ? mkMat(.35) : null;

  const puffG = new THREE.Group();
  const _pq = new THREE.Quaternion(), _cq = new THREE.Quaternion();
  const quad = (mat, scl) => {
    const q = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    q.scale.set(scl, scl, 1);
    // billboard: mặt tấm luôn hướng về máy, ở mọi góc
    q.onBeforeRender = (r, sc2, cam) => {
      q.parent.getWorldQuaternion(_pq);
      cam.getWorldQuaternion(_cq);
      _cq.premultiply(_pq.invert());
      q.quaternion.copy(_cq);
      q.updateMatrixWorld(true);
    };
    fxLayer(q); puffG.add(q); return q;
  };
  const puff = quad(puffMat, 1);
  if (cross) { quad(veilMat, 1.15); quad(veilMat, .8); }
  puffG.scale.set(size, size, 1);
  puffG.position.set(at.x, at.y, at.z);
  g.add(puffG);

  // lõi sáng của hạt bụi: một chấm nhỏ, để hạt trông như bắt được nắng
  const core = mesh(new THREE.SphereGeometry(.0013, 10, 8), new THREE.MeshBasicMaterial({
    color: new THREE.Color('#fff2d2').multiplyScalar(1.5), toneMapped: false,
    transparent: true, depthWrite: false, depthTest: false,
  }), [at.x, at.y, at.z], { cast: false, recv: false });
  fxLayer(core);
  g.add(core);

  // Vài hạt không khí nhỏ xíu đứng cạnh hạt bụi: cỡ chênh lệch giữa một hạt
  // bụi mờ to và một hạt không khí nhỏ phải đọc ra ngay trong ảnh.
  let air = null;
  const airP = [];
  if (tiny > 0) {
    // bán kính theo cỡ của hạt bụi: trong phim là .0022 như cũ, trong ảnh vật
    // thì lớn tương ứng để hai cỡ đọc ra được
    air = glowDots(tiny, size * .035, '#fff4de', 1.9);
    air.count = tiny;
    // `tinyAt` là chỗ đứng tuyệt đối (trong phim); không có thì mấy hạt này
    // đứng lỏng quanh hạt bụi, để ảnh vật đọc được cả hai cỡ.
    const off = [[.165, .035, -.018], [.205, -.012, .012], [.128, .058, .022],
      [.192, .062, -.030], [.140, -.008, -.034]];
    for (let i = 0; i < tiny; i++) {
      const o = off[i % off.length];
      airP.push(tinyAt
        ? new THREE.Vector3(tinyAt[0], tinyAt[1], tinyAt[2])
        : new THREE.Vector3(at.x + o[0], at.y + o[1], at.z + o[2]));
    }
    for (let i = 0; i < tiny; i++) setDot(air, i, airP[i], 1);
    air.instanceMatrix.needsUpdate = true;
    g.add(air);
  }

  g.userData.update = (t, st = {}) => {
    const up = !!st.up;
    const close = !!st.close;
    // ở cận (fov hẹp) hạt là chủ thể nên sáng hơn cả dải; ở khung rộng nó
    // chỉ là một phần nhỏ của dải nên phải dịu lại.
    const k = close ? 1.05 : .52;
    for (const m of puffMats) m.color.set('#ffe3b8').multiplyScalar(k);
    clMat.emissive.set('#ffe6c6').multiplyScalar(up ? .18 : (close ? .16 : .12));
    core.material.color.set('#fff2d2').multiplyScalar(up ? .95 : (close ? 1.5 : .88));
    const gs = st.scale != null ? st.scale : size;
    puffG.scale.set(gs, gs, 1);
    clG.scale.setScalar(gs);
    if (st.pos) {
      puffG.position.set(st.pos.x, st.pos.y, st.pos.z);
      clG.position.set(st.pos.x, st.pos.y, st.pos.z);
      core.position.set(st.pos.x, st.pos.y, st.pos.z);
    }
    if (st.q) puffG.quaternion.copy(st.q);
    core.scale.setScalar(up ? 1.7 : 1);
    if (air) {
      if (st.tiny !== undefined) air.count = st.tiny;
      // hạt không khí nhỏ đi theo cỡ hạt bụi lúc này, để hai cỡ luôn so được
      const s = gs / size;
      for (let i = 0; i < air.count; i++) setDot(air, i, airP[i], s);
      if (air.count > 0 && tinyAt) {
        setDot(air, 0, new THREE.Vector3(tinyAt[0], tinyAt[1], tinyAt[2]), s);
      }
      air.instanceMatrix.needsUpdate = true;
    }
  };
  g.userData.parts = { puffG, puff, core, air, clG, cl };
  return g;
}

// Ảnh vật: một hạt bụi mờ to, bên cạnh mấy hạt không khí nhỏ xíu.
export const PROP = {
  name: 'hạt bụi mờ',
  view: () => hatBuiMo({ at: { x: 0, y: 0, z: 0 }, size: .30, cross: true, tiny: 5 }),
};
