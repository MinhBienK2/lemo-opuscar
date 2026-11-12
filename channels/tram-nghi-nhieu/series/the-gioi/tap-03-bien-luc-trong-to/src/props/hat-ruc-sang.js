// Hạt rực lên sát chùm sáng: cầu toon PHÁT SÁNG, nằm ngay trên mặt chùm.
//
// Hạt này là vật thể (cầu toon phát sáng), nên người xem thấy "hạt sáng rực
// lên" chứ không phải "một đốm sáng trôi trong sương". Nhỏ thôi: một hạt to
// đọc ra là trứng, không phải là hạt.
//
// Hạt nằm NGAY TRÊN MẶT chùm, không nằm bên trong: nằm trong thì lõi trắng
// đặc che mất hạt, và câu "hạt sát chùm thì rực lên" không còn gì để nhìn.
import * as THREE from 'three';
import { toon, mulberry } from '../../../../../rig/kit.js';

export function hatRucSang(opts = {}) {
  const {
    n = 48, rnd = mulberry(19),
    spanX = 11, yLo = .075, yHi = .105, spanZ = .10,
  } = opts;
  const g = new THREE.Group(); g.name = 'hạt rực lên sát chùm sáng';

  const geo = new THREE.SphereGeometry(1, 12, 9);
  const mat = toon('#fff8e6', { emissive: new THREE.Color('#ffd98a').multiplyScalar(.9) });
  const im = new THREE.InstancedMesh(geo, mat, n);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.frustumCulled = false;
  g.add(im);

  const hp = [], hs = [];
  for (let i = 0; i < n; i++) {
    hp.push(new THREE.Vector3(
      (rnd() - .5) * spanX,
      (rnd() < .5 ? -1 : 1) * (yLo + rnd() * (yHi - yLo)),
      (rnd() - .5) * spanZ));
    hs.push(.022 + rnd() * .020);
  }

  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _pv = new THREE.Vector3();
  const put = (i, p, sc) => { _m.compose(_pv.set(p.x, p.y, p.z), _q, _s.set(sc, sc, sc)); im.setMatrixAt(i, _m); };
  for (let i = 0; i < n; i++) put(i, hp[i], hs[i]);
  im.instanceMatrix.needsUpdate = true;

  // `hot` = 0 thì hạt tắt dần (câu không nói về hạt sáng).
  g.userData.update = (t, hot = 1) => {
    mat.emissive.set('#ffd98a').multiplyScalar(.9 * hot);
  };
  g.userData.parts = { im, mat, hp, hs };
  return g;
}

// Ảnh vật: một đoạn ngắn của mặt chùm, hạt nằm sát nhau thành hai hàng.
export const PROP = {
  name: 'hạt rực lên sát chùm sáng',
  view: () => hatRucSang({ n: 12, spanX: .9, spanZ: .06 }),
};
