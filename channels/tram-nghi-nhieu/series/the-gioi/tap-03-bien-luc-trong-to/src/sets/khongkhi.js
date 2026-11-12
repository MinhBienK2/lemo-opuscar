// N2 · trong không khí, ban ngày
import * as THREE from 'three';
import { toon, mesh, fxLayer, mulberry } from '../../../../../rig/kit.js';
import { keyLight, ambience } from '../../../../../rig/lights.js';
import { V3, skyTexture, waveRibbon } from './common.js';

// ── N2 · trong không khí, ban ngày ────────────────────────────────────────
// Trong không khí ban ngày: một chùm sáng trắng của Mặt Trời đi ngang qua
// một lớp hạt nhỏ, hạt sát chùm thì rực lên rồi ném ra dòng sáng sang bên,
// hai màu bị rẽ khác nhau, và một chùm sáng đi thẳng không bị rẽ.
//
// Nguyên tắc hình của cảnh này — cảnh không có vật thể nào đứng im, nên mọi
// thứ phải đọc được bằng HÌNH, không bằng ánh sáng:
//
//  1. Hạt khí là CẦU TOON có viền mực (lớp 0), không phải chấm sáng. Một chấm
//     sáng nhỏ trên nền trời đọc ra là sao; một cầu có mặt và có nét thì đọc
//     ra là "một lớp hạt nhỏ". Hạt ở xa phải to lên theo khoảng cách, nếu không
//     chúng thành sao.
//  2. Chùm sáng là LÕI SÁNG + VỎ SÁNG MỀM, không phải một vệt sương nhòe.
//     Chùm là ánh sáng nên không có viền mực: một ống toon đặc có mép mực
//     cứng và mặt kem đục, đọc ra là que gỗ. Lõi sáng cho hướng, vỏ sáng
//     mềm cho quang; hai đầu chùm mờ dần nên chùm tan vào không khí chứ
//     không kết thúc bằng một mũi nhọn.
//  3. Dòng sáng bị rẽ là SỢI MẢNH có nét mực, không phải bông. Bông trông
//     như mây hay như quả bóng, và người xem sẽ đọc nhầm thành vật thể khác.
//  4. Dòng sáng luôn BÁM vào một hạt vừa rực lên: hạt là quả cầu trắng rực,
//     dòng là sợi mảnh nối từ quả cầu ấy. Tách hai thứ ra thì dòng sáng đọc
//     ra là vật thể trôi trong không trung.
//  5. Chùm đi thẳng là ỐNG RỖNG: hai mép sáng rõ, giữa tối hơn, nhìn ngược
//     thì thấy nó kéo về phía máy.
export function buildKhongKhi() {
  const scene = new THREE.Scene();
  scene.background = skyTexture({
    stops: [[90, '#1c5ab4'], [50, '#2f79c9'], [24, '#5299d8'], [8, '#7fb6e4'],
      [0, '#a9cdec'], [-6, '#c2dcf1'], [-20, '#b0c8dc']],
  });
  scene.fog = new THREE.Fog('#a9c8e4', 18, 48);

  const rnd = mulberry(19);
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(), _pv = new THREE.Vector3();
  const put = (im, i, p, sc) => { _m.compose(_pv.set(p.x, p.y, p.z), _q, _s.set(sc, sc, sc)); im.setMatrixAt(i, _m); };

  // ── hạt khí: cầu nhỏ có viền mực, lơ lửng quanh chùm sáng ──────────────
  // Màu của hạt KHÔNG được tự phát sáng: một chấm sáng trên nền trời đọc ra
  // là sao, và trăm chấm sáng cùng lúc thì bloom dựng thành một màn sương
  // trắng phủ kín cả bức tranh. Hạt lấy màu cố định, không theo đèn — nó là
  // hạt bụi màu trắng, đứng yên trong không khí ban ngày.
  const N_MOL = 260;
  const molGeo = new THREE.SphereGeometry(1, 12, 9);
  const molMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#dfe9f7'), toneMapped: false,
  });
  const mol = new THREE.InstancedMesh(molGeo, molMat, N_MOL);
  mol.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mol.frustumCulled = false;
  scene.add(mol);
  const mp = [], ms = [];
  for (let i = 0; i < N_MOL; i++) {
    const z = -.8 - Math.pow(rnd(), .8) * 9;              // xa dần về phía sau
    const d = 4.6 - z;                                  // khoảng cách tới máy quay
    // Hạt phải nằm TỤM quanh chùm sáng: giãn ra như một quả cầu khí lớn
    // thì trong khung chỉ còn lác đác vài chấm, đọc ra là trời có sao chứ
    // không phải một lớp không khí.
    mp.push(V3((rnd() - .5) * 1.15 * d, (rnd() - .5) * .55 * d, z));
    // hạt ở xa phải to lên, nếu không nó nhỏ xíu và đọc ra là sao trên trời
    ms.push((.020 + rnd() * .028) * Math.pow(d / 5.2, .5));
  }

  // ── vỏ sáng: ống trong suốt quanh một sợi sáng ────────────────────────
  // `edge` = 0 → sáng ở giữa dải, mờ dần ở hai mép (vỏ sáng mềm).
  // `edge` = 1 → sáng ở hai mép, tối ở giữa (ống rỗng).
  function shell(from, to, r0, r1, color, opacity, edge) {
    const A = V3(...from), B = V3(...to);
    const dir = B.clone().sub(A);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uCol: { value: new THREE.Color(color) }, uA: { value: opacity }, uEdge: { value: edge },
      },
      vertexShader: `varying vec3 vN; varying vec3 vV;
        void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.);
          vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vN; varying vec3 vV;
        uniform vec3 uCol; uniform float uA, uEdge;
        void main(){
          float d = abs(dot(normalize(vN), normalize(vV)));
          float a = mix(pow(d, 1.1), pow(1. - d, 1.6), uEdge) * uA;
          gl_FragColor = vec4(uCol * a, a);
        }`,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, dir.length(), 32, 1, true), mat);
    m.position.copy(A).addScaledVector(dir, .5);
    m.quaternion.setFromUnitVectors(V3(0, 1, 0), dir.clone().normalize());
    m.renderOrder = 6; fxLayer(m);
    return m;
  }

  // ── chùm sáng ngang: LÕI SÁNG + VỎ SÁNG MỀM ─────────────────────────
  // Chùm là ÁNH SÁNG, không phải vật thể: nó không có viền mực. Một ống
  // toon đặc có mép mực cứng và một mặt kem đục đọc ra là que gỗ, nên ống
  // đó bị bỏ hẳn. Chùm được dựng y như chùm ở N3: một lõi sáng và một
  // vỏ sáng mềm quanh, cả hai đều ở lớp fx nên không có nét mực.
  // Cả hai đầu chùm mờ dần: chùm tan vào không khí chứ không kết thúc bằng
  // một mũi nhọn.
  const BEAM_A = -16, BEAM_B = 28;         // chùm chạy từ x = −16 đến x = +28
  const GLOW_VS = `
varying vec3 vW; varying vec3 vN; varying vec3 vV;
void main(){
  vW = (modelMatrix * vec4(position, 1.0)).xyz;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
  function beamShaft({ r, color, alpha, pow, core, fadeIn, fadeOut }) {
    const c = new THREE.Color(color);
    // Mọi hằng số nằm thẳng trong mã nguồn shader: chùm là ánh sáng, không
    // phải vật thể, nên nó không cần một vật liệu có tham số để chỉnh.
    // Phần mờ dần tính THEO MẢNH ảnh từ toạ độ thế giới — tính theo đỉnh
    // thì ống chỉ có hai vòng đỉnh, màu mờ nội suy giữa hai vòng ấy thành 0
    // hết và chùm biến mất.
    const fs = `
varying vec3 vW; varying vec3 vN; varying vec3 vV;
void main(){
  float fade = clamp((vW.x - (${BEAM_A.toFixed(1)})) / ${fadeIn.toFixed(1)}, 0.0, 1.0)
             * clamp((${BEAM_B.toFixed(1)} - vW.x) / ${fadeOut.toFixed(1)}, 0.0, 1.0);
  float nv = abs(dot(normalize(vN), normalize(vV)));
  float f = pow(nv, ${pow.toFixed(2)}) + ${core.toFixed(2)} * pow(nv, 9.0);
  gl_FragColor = vec4(${c.r.toFixed(3)}, ${c.g.toFixed(3)}, ${c.b.toFixed(3)},
    fade * ${alpha.toFixed(3)} * f);
}`;
    const geo = new THREE.CylinderGeometry(r, r, BEAM_B - BEAM_A, 24, 1, true);
    geo.rotateZ(Math.PI / 2);                 // trục của ống nằm theo X
    geo.translate((BEAM_A + BEAM_B) / 2, 0, 0);
    const m = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      vertexShader: GLOW_VS, fragmentShader: fs,
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, toneMapped: false,
    }));
    fxLayer(m);
    return m;
  }
  const beamCore = beamShaft({ r: .030, color: '#fffdf4', alpha: .50, pow: 2.4, core: .55, fadeIn: 7, fadeOut: 13 });
  const beamGlow = beamShaft({ r: .135, color: '#ffeec2', alpha: .17, pow: 1.7, core: .12, fadeIn: 9, fadeOut: 17 });
  scene.add(beamCore, beamGlow);

  // ── hạt sát chùm: rực lên — nằm ngay trong lòng chùm ───────────────────
  // Hạt này là vật thể (cầu toon phát sáng), nên người xem thấy "hạt sáng
  // rực lên" chứ không phải "một đốm sáng trôi trong sương". Nhỏ thôi: một
  // hạt to đọc ra là trứng, không phải là hạt.
  const N_HOT = 48;
  const hotGeo = new THREE.SphereGeometry(1, 12, 9);
  const hotMat = toon('#fff8e6', { emissive: new THREE.Color('#ffd98a').multiplyScalar(.9) });
  const hot = new THREE.InstancedMesh(hotGeo, hotMat, N_HOT);
  hot.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  hot.frustumCulled = false;
  scene.add(hot);
  const hp = [], hs = [];
  for (let i = 0; i < N_HOT; i++) {
    // Hạt sát chùm nằm NGAY TRÊN MẶT chùm, không nằm bên trong: nằm trong
    // thì lõi trắng đặc che mất hạt, và câu "hạt sát chùm thì rực lên" không
    // còn gì để nhìn. Mặt chùm là vỏ sáng (bán kính .135), nên hạt bám ở
    // quanh .08 — bám sát chùm chứ không bay lơ lửng xa bên như sao.
    hp.push(V3((rnd() - .5) * 11, (rnd() < .5 ? -1 : 1) * (.075 + rnd() * .030), (rnd() - .5) * .10));
    hs.push(.022 + rnd() * .020);
  }

  // ── dải sóng: sóng ngắn (xanh, rẽ mạnh) và sóng dài (đỏ, rẽ yếu) ─────
  // Hai hạt đứng gần nhau ở giữa khung: cận cảnh phải thấy được CẢ HAI trong
  // một khung, nên khoảng cách giữa chúng nhỏ hơn bề ngang của khung cận.
  // Hai quả cầu này chỉ hiện ở câu nói về dải sóng (c08, c09): ở những câu
  // khác, thứ đọc được là DÒNG sáng, không phải quả cầu — một quả cầu đặc
  // đọc ra là vật thể khác, không phải ánh sáng.
  const pA = V3(-.42, .26, 0), pB = V3(.42, .26, 0);
  const dotA = mesh(new THREE.SphereGeometry(.050, 16, 12),
    toon('#dff4ff', { emissive: new THREE.Color('#7fd8ff').multiplyScalar(.6) }), [pA.x, pA.y, pA.z]);
  const dotB = mesh(new THREE.SphereGeometry(.050, 16, 12),
    toon('#ffe0d4', { emissive: new THREE.Color('#ff8a6a').multiplyScalar(.35) }), [pB.x, pB.y, pB.z]);
  scene.add(dotA, dotB);

  // dải sóng: dải sóng xanh uốn chín lần (đếm được), dải sáng đỏ uốn một
  // lần — "xanh rẽ mạnh hơn đỏ khoảng chín lần" phải đếm được bằng mắt.
  const waveShort = waveRibbon({ len: .62, amp: .024, waves: 9, thick: .014, color: '#8fe4ff' });
  waveShort.position.set(pA.x, pA.y, pA.z); scene.add(waveShort);
  const waveLong = waveRibbon({ len: .62, amp: .045, waves: 1, thick: .014, color: '#ff9a7a' });
  waveLong.position.set(pB.x, pB.y, pB.z); scene.add(waveLong);

  // ── dòng sáng bị rẽ: SỢI MẢNH có nét mực, chạy từ hạt sang bên ───────
  // Sợi nằm trên lớp 0 nên có viền mực: đọc ra là một tia vẽ tay, không phải
  // một cục sáng mềm trông như quả bóng. Sợi phải BÁM đúng hạt vừa sáng.
  function lightRay(pts, radius, color, glow) {
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, radius, 8, false),
      toon(color, { emissive: new THREE.Color(color).multiplyScalar(glow) }));
    const g = new THREE.Group();
    g.add(tube);
    return g;
  }
  // Neo của hai dòng bị rẽ: hai hạt trắng rực nằm sát chùm, mỗi hạt một
  // dòng mảnh chạy chéo sang bên. Hạt trắng — màu của dòng do sợi mang,
  // không phải do quả cầu.
  const nA = V3(-.95, .11, .05), nB = V3(.95, .11, .05);
  const anchorA = mesh(new THREE.SphereGeometry(.068, 14, 10),
    toon('#fffaf0', { emissive: new THREE.Color('#ffe6b8').multiplyScalar(.75) }), [nA.x, nA.y, nA.z]);
  const anchorB = mesh(new THREE.SphereGeometry(.068, 14, 10),
    toon('#fffaf0', { emissive: new THREE.Color('#ffe6b8').multiplyScalar(.75) }), [nB.x, nB.y, nB.z]);
  scene.add(anchorA, anchorB);
  // Dòng rẽ phải bám sát hạt rồi mới đi ra, và nó phải đi ra CHÉO NGANG
  // chứ không vút lên cao: vút lên thì sợi rời khỏi chùm, đọc ra là một vật
  // thể trôi trong trời chứ không phải ánh sáng bị rẽ.
  const rayBlue = lightRay([V3(nA.x, nA.y, nA.z), V3(-1.45, .22, .14), V3(-2.00, .30, .20)], .034, '#8fdcff', .55);
  const rayRed = lightRay([V3(nB.x, nB.y, nB.z), V3(1.45, .22, .14), V3(2.00, .30, .20)], .036, '#ff9a7a', .50);
  scene.add(rayBlue, rayRed);

  // hạt thứ ba, chỉ hiện ở câu có dòng bay về phía ta: nó là chỗ dòng ấy
  // bám vào. Dòng dừng lại ở z = 1.15, cách máy hơn nửa mét: nếu đi thẳng
  // vào mặt máy thì sợi sáng hóa thành một nêm trắng che kín khung.
  const nC = V3(0, .10, .06);
  const anchorC = mesh(new THREE.SphereGeometry(.044, 14, 10),
    toon('#f4fcff', { emissive: new THREE.Color('#a8ecff').multiplyScalar(.85) }), [nC.x, nC.y, nC.z]);
  scene.add(anchorC);
  const rayToCam = lightRay([V3(nC.x, nC.y, nC.z), V3(.10, .17, .62), V3(.34, .26, 1.15)], .022, '#a8ecff', .45);
  scene.add(rayToCam);

  // ── dòng sáng bay về từ mọi hướng (câu ngước lên) ─────────────────────
  // Mười bốn sợi xanh từ mọi phía hội tụ về một tâm: đọc ra là "từ mọi
  // hướng", không phải một đám bông trôi trên trời. Tâm ở xa và cao, nên
  // sợi không to quá khi đi ngang qua máy.
  const rayAll = [];
  const allCenter = V3(0, 3.20, -7.0);
  for (let i = 0; i < 14; i++) {
    // điểm xuất phát nằm trên một vỏ cầu quanh tâm: có sợi từ phía sau
    // máy, có sợi từ trên, có sợi từ hai bên — thế mới là "mọi hướng".
    const a = i / 14 * Math.PI * 2 + .21;
    const u = .30 + (i % 3) * .26;
    const from = V3(
      allCenter.x + Math.cos(a) * 5.6 * u,
      allCenter.y + Math.sin(a) * 4.2 * u,
      allCenter.z + (i % 2 ? 1 : -1) * 4.4 * u);
    const mid = V3((allCenter.x + from.x) / 2, (allCenter.y + from.y) / 2, (allCenter.z + from.z) / 2);
    const g = lightRay([from, mid, allCenter], .075, '#8fdcff', .55);
    scene.add(g); rayAll.push(g);
  }

  // ── chùm đi thẳng: một ỐNG, không phải một cục trắng ──────────────────
  // Ống sáng đi thẳng về phía máy được dựng bằng hai sợi mép (lớp 0, có
  // viền mực) và một vỏ sáng mờ ở giữa: nhìn ngược thì thấy nó là một ống
  // kéo về phía ta — hai mép sáng rõ, giữa ống mờ hơn.
  // Không dùng một khối trắng: khối trắng đọc ra là mặt trời, chứ không
  // phải một chùm sáng đi thẳng. Miệng ống nằm ở z = 0 (cục bộ), thân ống
  // chạy về z âm; mỗi câu đặt lại miệng ống cho đúng tầm xa của nó.
  const SB_R = .50, SB_LEN = 18;
  const straight = new THREE.Group();
  const sbMat = toon('#fff6e2', { emissive: new THREE.Color('#ffe6b4').multiplyScalar(.45) });
  for (const sgn of [-1, 1]) {
    const A = V3(sgn * SB_R, 0, 0);
    const B = V3(sgn * .07, 0, -SB_LEN);
    const curve = new THREE.CatmullRomCurve3([A, A.clone().lerp(B, .5), B]);
    straight.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, .042, 8, false), sbMat));
  }
  // miệng ống: một vòng sáng ở gần máy — đọc ra là "chùm đi thẳng vào mắt ta"
  // vòng miệng ống bỏ hẳn: một vòng tròn sáng đứng trơ ra giữa khung đọc ra
  // là hình vẽ, không phải ánh sáng; hai sợi mép kéo về phía máy mới đúng
  // là "chùm sáng đi thẳng vào mắt ta".
  // vỏ sáng mờ giữa hai mép: giữa ống tối hơn hai mép
  const sbFill = shell([0, 0, 0], [0, 0, -SB_LEN], .35, .02, '#ffeec8', .04, 1);
  straight.add(sbFill);
  // thân sáng của ống: một cột sáng mềm chạy suốt đường đi, chỉ bật ở
  // câu nhìn dọc theo chùm — không bật thì ống chỉ còn hai sợi, đọc ra là
  // hai que que chứ không phải một chùm sáng.
  const sbBody = shell([0, 0, 0], [0, 0, -SB_LEN], .34, .09, '#ffeec8', .40, 0);
  sbBody.visible = false;
  straight.add(sbBody);
  scene.add(straight);

  // Ban ngày: nắng ấm làm chính, trời xanh làm đèn lấp. Không tím: tím là
  // màu của đêm ở các cảnh khác của tập, đặt vào đây thì hạt trắng thành
  // tím và cảnh trông như đêm.
  // Cường độ nắng giữ ở mức vừa: sáng quá thì mặt sáng của mọi vật vượt
  // ngưỡng bloom, và cả khung bị một màn sương trắng phủ.
  const key = keyLight(scene, { color: '#fff2dc', intensity: 1.30, from: V3(-6, 6, 6), to: V3(0, 0, 0), size: 9, far: 40 });
  ambience(scene, { sky: '#bcd8f2', ground: '#93a7b6', fill: .40, rim: '#cfe6ff', rimI: .35, rimFrom: [3, 3, -4] });

  // đặt hạt ngay từ đầu, trước khung hình đầu tiên
  const placeMols = (t, mode) => {
    const few = mode === 'few';
    for (let i = 0; i < mp.length; i++) {
      const p = mp[i];
      // ở câu ngước lên, bỏ hẳn hạt khí: hạt nhỏ lơ lửng trên nền trời
      // đọc ra là chấm sao, đúng thứ mà câu ấy không cần.
      const k = few ? 0 : 1;
      put(mol, i, V3(p.x + Math.sin(t * .35 + i) * .12, p.y + Math.cos(t * .28 + i * .7) * .12, p.z), ms[i] * k);
    }
    mol.instanceMatrix.needsUpdate = true;
    for (let i = 0; i < hp.length; i++) put(hot, i, hp[i], hs[i]);
    hot.instanceMatrix.needsUpdate = true;
  };
  placeMols(0, 'all');

  return {
    scene, key, pA, pB,
    waveShortAt: V3(pA.x, pA.y, pA.z), waveLongAt: V3(pB.x, pB.y, pB.z),
    update(t, s) {
      const m = s || {};
      placeMols(t, m.mols || 'all');
      hotMat.emissive.set('#ffd98a').multiplyScalar(.9 * (m.hot ? 1 : .18));
      hot.visible = m.side !== false && m.hot !== false;
      beamCore.visible = m.side !== false;
      beamGlow.visible = m.side !== false;

      // dải sóng (waves) chỉ ở c08, c09 — cùng lúc với hai quả cầu màu.
      waveShort.visible = !!m.waves; waveLong.visible = !!m.waves;
      dotA.visible = !!m.waves; dotB.visible = !!m.waves;

      // dòng bị rẽ (rays) chỉ ở c06, c07 — cùng lúc với hai hạt neo trắng.
      rayBlue.visible = !!m.rays; rayRed.visible = !!m.rays;
      anchorA.visible = !!m.rays; anchorB.visible = !!m.rays;

      // dòng bay về phía ta (toCam) chỉ ở c06.
      anchorC.visible = !!m.toCam; rayToCam.visible = !!m.toCam;

      // dòng từ mọi hướng (all) chỉ ở c10, c11.
      rayAll.forEach(g => { g.visible = !!m.all; });

      // chùm đi thẳng chỉ hiện ở câu nói về nó: c07 (đứng giữa), c12 (đi
      // thẳng vào mắt ta) và c13 (nhìn dọc theo chùm). Mỗi câu đặt miệng
      // ống ở tầm xa khác nhau.
      straight.visible = !!(m.straight || m.straightCore);
      sbBody.visible = !!m.straightCore;
      if (m.straightZ !== undefined) straight.position.z = m.straightZ;
      if (m.straightScale !== undefined) straight.scale.setScalar(m.straightScale);
    },
  };
}
