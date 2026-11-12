// Hạt không khí: những quả cầu nhỏ lơ lửng trong không khí ban ngày.
//
// Hạt KHÔNG được tự phát sáng: một chấm sáng trên nền trời đọc ra là sao, và
// trăm chấm sáng cùng lúc thì bloom dựng thành một màn sương trắng phủ kín
// cả bức tranh. Vật liệu là toon THUẦN — không emissive — nên hạt có mặt sáng
// và mặt tối như mọi quả cầu toon khác của tập: đọc ra là một quả cầu
// nhỏ, chứ không phải một đĩa phẳng tô một màu.
//
// Hạt được dựng bằng InstancedMesh: 260 hạt là 260 lần vẽ nếu dùng từng
// mesh, và cảnh phải chạy mượt. Hạt ở xa phải to lên theo khoảng cách, nếu
// không chúng thành sao.
import * as THREE from 'three';
import { toon, mulberry } from '../../../../../rig/kit.js';

export function hatKhongKhi(opts = {}) {
  const {
    n = 260, rnd = mulberry(19),
    zNear = -.8, zSpan = 9, spreadX = 1.15, spreadY = .55,
    camDist = 4.6, sizeLo = .020, sizeHi = .048,
  } = opts;
  const g = new THREE.Group(); g.name = 'hạt không khí';

  // Mặt cầu đủ tròn để đọc ra là khối cầu, không phải đĩa.
  const geo = new THREE.SphereGeometry(1, 16, 12);
  // Toon thuần, KHÔNG emissive: hạt có mặt sáng / mặt tối, nhưng không tự
  // phát sáng nên không bao giờ thành sao.
  const mat = toon('#cdd8ee');
  const im = new THREE.InstancedMesh(geo, mat, n);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.frustumCulled = false;
  g.add(im);

  const mp = [], ms = [];
  for (let i = 0; i < n; i++) {
    const z = zNear - Math.pow(rnd(), .8) * zSpan;      // xa dần về phía sau
    const d = camDist - z;                             // khoảng cách tới máy quay
    // Hạt phải nằm TỤM quanh chùm sáng: giãn ra như một quả cầu khí lớn
    // thì trong khung chỉ còn lác đác vài chấm, đọc ra là trời có sao chứ
    // không phải một lớp không khí.
    mp.push(new THREE.Vector3((rnd() - .5) * spreadX * d, (rnd() - .5) * spreadY * d, z));
    // hạt ở xa phải to lên, nếu không nó nhỏ xíu và đọc ra là sao trên trời
    ms.push((sizeLo + rnd() * (sizeHi - sizeLo)) * Math.pow(d / 5.2, .5));
  }

  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _pv = new THREE.Vector3();
  const put = (i, p, sc) => { _m.compose(_pv.set(p.x, p.y, p.z), _q, _s.set(sc, sc, sc)); im.setMatrixAt(i, _m); };
  for (let i = 0; i < n; i++) put(i, mp[i], ms[i]);
  im.instanceMatrix.needsUpdate = true;

  // mode = 'few': ở câu ngước lên, bỏ hẳn hạt khí — hạt nhỏ lơ lửng trên nền
  // trời đọc ra là chấm sao, đúng thứ mà câu ấy không cần.
  g.userData.update = (t, mode) => {
    const few = mode === 'few';
    for (let i = 0; i < mp.length; i++) {
      const p = mp[i];
      const k = few ? 0 : 1;
      put(i, new THREE.Vector3(
        p.x + Math.sin(t * .35 + i) * .12,
        p.y + Math.cos(t * .28 + i * .7) * .12, p.z), ms[i] * k);
    }
    im.instanceMatrix.needsUpdate = true;
  };
  g.userData.parts = { im, mp, ms };
  return g;
}

// Ảnh vật: một cụm hạt nhỏ, đóng gói lại để máy nhìn thấy rõ từng hạt.
// Hạt giãn ra theo cả ba trục (không dồn thành một dãy) để từng hạt đọc
// riêng: hai hạt chồng lên nhau thì viền mực của hạt trước cắt ngang mặt
// hạt sau, và người xem tưởng đó là vết rạn, không phải một quả cầu trước
// một quả cầu sau.
export const PROP = {
  name: 'hạt không khí',
  view: () => hatKhongKhi({
    n: 12, zNear: -.25, zSpan: .55, spreadX: .72, spreadY: .34,
    camDist: 4.0, sizeLo: .020, sizeHi: .034,
  }),
};
