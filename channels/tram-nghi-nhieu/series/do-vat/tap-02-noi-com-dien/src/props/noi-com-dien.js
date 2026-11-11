// Nồi cơm điện: thân vỏ có độ dày và lòng rỗng, nắp có lỗ thoát hơi và núm cầm,
// tay cầm hai bên, bảng điều khiển ở mặt trước với nút bấm và đèn báo hai màu
// (đỏ khi đang nấu, hổ phách khi chuyển sang giữ ấm), chân đế và dây điện.
import * as THREE from 'three';
import { toon, glowMat, canvasTex, rbox, mesh, fxLayer, mulberry, TEX, clamp, ss } from '../../../../../rig/kit.js';
import { vessel } from '../../../../../rig/cutaway.js';
import { button, cable } from '../../../../../rig/parts.js';
import { flow } from '../../../../../rig/fx.js';
import { fitFlow, fitEffect } from './_flowbox.js';

// thân nồi: hình trụ bọc tròn, vai thuôn, miệng hơi trong
const PROFILE_BODY = [
  [0, 0], [.145, 0], [.185, .012], [.208, .045], [.218, .085],
  [.218, .185], [.210, .222], [.190, .245], [.176, .252],
];

// Vân vỏ nồi: một mảng trắng nhẵn ở tiền cảnh đọc ra như một khối sơn, không
// phải vỏ máy. Vân này là hạt mịn và vàng vân dọc rất nhạt, đủ để bề mặt có
// chiều sâu mà không thành hoa văn.
function shellTex() {
  return canvasTex(512, 512, (g, w, h) => {
    const r = mulberry(41);
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i++) {
      const x = r() * w, y = r() * h, a = r();
      g.fillStyle = `rgba(150,140,120,${.04 + a * .09})`;
      g.fillRect(x, y, a > .82 ? 2 : 1, 1);
    }
    for (let i = 0; i < 70; i++) {                       // vàng vân dọc của khuôn
      const x = r() * w;
      g.fillStyle = `rgba(120,112,96,${.02 + r() * .025})`;
      g.fillRect(x, 0, 1 + r() * 2, h);
    }
  });
}

export function noiComDien(opts = {}) {
  const g = new THREE.Group();
  const shellColor = opts.shell || '#e7e2d6';
  const accent = opts.accent || '#3d4a72';
  const stx = shellTex(); stx.repeat.set(3, 1.5);
  const bodyMat = toon(shellColor, { map: stx });
  const accentMat = toon(accent);

  // ── thân: vỏ có độ dày, lòng rỗng (sau này cưa ngang sẽ thấy ra thành nồi) ──
  const body = vessel(PROFILE_BODY, { thick: .022, cut: 0, shell: bodyMat, face: toon('#cdc6b6') });
  g.add(body.group);
  g.body = body;

  // vành đế dưới (chân nồi)
  g.add(mesh(new THREE.TorusGeometry(.196, .012, 8, 40), accentMat, [0, .012, 0], { rot: [Math.PI / 2, 0, 0] }));

  // ── nắp: nhóm riêng để mở được ──
  const lid = new THREE.Group();
  lid.position.set(0, .252, -.175);          // bản lề ở phía sau
  const lidBody = new THREE.Group(); lidBody.position.set(0, 0, .175);
  lid.add(lidBody);
  // vòng lathe đi từ ngoài vào trong và lên: chiều này cho mặt ngoài quay ra
  const lidProf = [[.176, -.006], [.190, 0], [.184, .008], [.160, .028], [.115, .046], [.055, .058], [0, .062]];
  lidBody.add(mesh(new THREE.LatheGeometry(lidProf.map(p => new THREE.Vector2(p[0], p[1])), 48), bodyMat));
  // mặt trong nắp: một đĩa phẳng, để mở nắp ra thấy mặt dưới chứ không phải mặt sau
  lidBody.add(mesh(new THREE.CylinderGeometry(.172, .168, .008, 44),
    toon('#dcd6c8', { emissive: new THREE.Color('#2e2a22') }), [0, -.006, 0]));
  // vành nắm
  lidBody.add(mesh(new THREE.TorusGeometry(.186, .008, 8, 44), accentMat, [0, .002, 0], { rot: [Math.PI / 2, 0, 0] }));
  // lỗ thoát hơi: một hốc nhỏ trên nắm
  const vent = new THREE.Group(); vent.position.set(.085, .046, .02);
  vent.add(mesh(new THREE.CylinderGeometry(.020, .024, .012, 18), toon('#b9b2a4'), [0, .002, 0]));
  vent.add(mesh(new THREE.CylinderGeometry(.015, .015, .020, 18), toon('#2b2f3a'), [0, -.008, 0]));
  lidBody.add(vent);
  // núm cầm
  const knob = new THREE.Group(); knob.position.set(0, .062, 0);
  knob.add(mesh(new THREE.CylinderGeometry(.030, .036, .022, 20), accentMat, [0, .011, 0]));
  knob.add(mesh(new THREE.SphereGeometry(.030, 16, 12), accentMat, [0, .030, 0]));
  lidBody.add(knob);
  g.add(lid);
  g.lid = lid; g.vent = vent; g.knob = knob;

  // ── bản lề: một trục thép ở phía sau, nắp xoay quanh đúng trục đó ──
  g.add(mesh(new THREE.CylinderGeometry(.009, .009, .075, 14), toon('#8b919c'), [0, .252, -.175], { rot: [0, 0, Math.PI / 2] }));
  g.add(mesh(rbox(.022, .030, .020, .005), toon('#8b919c'), [0, .240, -.175]));
  // tai bản lề trên nắp: nằm ngay tại trục, xoay theo nắp
  lid.add(mesh(rbox(.052, .009, .026, .004), toon('#8b919c'), [0, .004, .002]));

  // ── tay cầm hai bên ──
  for (const s of [-1, 1]) {
    const h = new THREE.Group(); h.position.set(s * .205, .175, 0);
    h.add(mesh(rbox(.052, .062, .10, .018), accentMat, [s * .022, 0, 0]));
    h.add(mesh(rbox(.030, .038, .086, .014), toon('#2f3a5c'), [s * .048, 0, 0]));
    g.add(h);
  }

  // ── bảng điều khiển ở mặt trước ──
  const panel = new THREE.Group(); panel.position.set(0, .105, .212);
  panel.add(mesh(rbox(.20, .095, .022, .012), toon('#f2ece0'), [0, 0, 0]));
  panel.add(mesh(rbox(.20, .095, .006, .012), accentMat, [0, 0, -.010]));
  // đèn báo: một đĩa nhỏ trong vành
  const lamp = new THREE.Group(); lamp.position.set(-.050, .014, .014);
  lamp.add(mesh(new THREE.CylinderGeometry(.021, .021, .008, 20), toon('#3a3f4c'), [0, 0, 0], { rot: [Math.PI / 2, 0, 0] }));
  const bulb = mesh(new THREE.CircleGeometry(.016, 20), glowMat('#ff4a3a', 1.6), [0, 0, .006], { cast: false });
  fxLayer(bulb); lamp.add(bulb);
  // Quầng sáng quanh đèn. Đèn đổi màu là một SỰ KIỆN: nếu chỉ có một chấm
  // nhỏ đổi màu thì người xem đọc ra một ô màu đổi, không đọc ra một cái đèn
  // vừa chuyển trạng thái. Quầng sáng nở ra rồi co lại làm cho lần đổi màu
  // đó thành một việc xảy ra trước mắt.
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: TEX.radial('rgba(255,236,200,1)'), color: 0xff7a4a, transparent: true, opacity: .30,
    blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
  }));
  halo.scale.set(.044, .044, 1); fxLayer(halo); lamp.add(halo);
  panel.add(lamp);
  // nút bấm
  const btn = button({ r: .026, color: '#c8cdd8', bezel: '#6b7280', size: .9 });
  btn.rotation.x = Math.PI / 2; btn.position.set(.050, .010, .016);
  panel.add(btn);
  // nhãn nhỏ dưới đèn
  panel.add(mesh(rbox(.052, .012, .004, .003), toon('#8b8f9c'), [-.050, -.026, .012]));
  g.add(panel);
  g.lamp = bulb; g.btn = btn;

  // ── chân đế ──
  for (const [x, z] of [[-.13, -.13], [.13, -.13], [-.13, .13], [.13, .13]])
    g.add(mesh(new THREE.CylinderGeometry(.026, .022, .018, 12), toon('#2b2f3a'), [x, .009, z]));

  // ── dây điện: chạy ra sau nồi rồi lên tường, cắm vào ổ cắm ──
  // Đầu dây không được nằm vắt ngang trên mặt bàn: nồi đang nấu mà phích
  // cắm rời nằm trên bàn thì cảnh vô lý. Dây phải đi tới ổ cắm trên tường.
  // Nhưng dây KHÔNG thuộc về cái nồi: nó là phụ kiện của cảnh, dựng riêng
  // (noiComDienCord) và cảnh bếp gắn vào nồi. Nếu dây nằm trong nhóm nồi,
  // khung đo vật phải trải tới tận tường và nồi rút lại thành một chấm
  // giữa khung — bước chấm vật không đọc ra là nồi cơm điện.

  // ── hơi nước: một cột hơi nước thật, bay lên từ lỗ nắm ───────────────
  // Hơi nước là thứ vô hình, nên kênh này vẽ nó thành vật: một cột mềm bốc
  // lên từ lỗ nắm, mỗi mảng một nhịp lắc riêng, đổi hình mỗi khung. Cột này
  // là VIỆC xảy ra trước mắt người xem ở những câu đầu: khung hình đứng
  // yên thì câu kể chết, dù lời kể có hay.
  const RISE = .88;    // cột hơi nước cao bao nhiêu
  const LIFE = .80;    // một mảng hơi nước sống bao lâu
  const PN = 52;       // số mảng trong cột

  // mép mảng tan dần: alpha nhạt dần khi mặt mảng nghiêng so với mắt người
  // xem, nên mảng hơi nước không có đường viền cứng
  const steamMat = () => {
    const m = toon('#e2f3ff', {
      emissive: new THREE.Color('#e2f3ff').multiplyScalar(.5),
      transparent: true, opacity: .30, depthWrite: false,
    });
    m.onBeforeCompile = sh => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_maps>',
        '#include <normal_fragment_maps>\n  diffuseColor.a *= 1.7 * pow(smoothstep(0., 1., abs(dot(normalize(normal), normalize(vViewPosition)))), 1.5);');
    };
    m.customProgramCacheKey = () => 'steam-soft';
    return m;
  };

  // Cột hơi nước: PN mảng mềm, mỗi mảng bay lên với tốc độ riêng và lắc
  // ngang theo nhịp riêng. Chỗ mảng nhỏ, chỗ mảng to; mảng nhỏ ở gần lỗ nắm,
  // mảng to ở trên cao — đó là hình một cột hơi nước, không phải một quả
  // bóng trắng đặc dán trên nắm. Cột hơi nước là CON của lỗ nắm: mở nắp thì
  // hơi nước phải đi theo cái lỗ, không đứng lơ lửng trên miệng nồi.
  const plume = new THREE.Group();
  const puffs = [];
  const rnd = mulberry(23);
  for (let i = 0; i < PN; i++) {
    const p = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), steamMat());
    p.userData = {
      ph: i / PN + (rnd() - .5) * .02,
      r0: .037 + rnd() * .045,       // bán kính gốc của mảng
      sw: .066 + rnd() * .140,       // biên độ lắc ngang
      fw: .50 + rnd() * .90,         // tần số lắc
      dx: (rnd() - .5) * .13,        // lệch ngang khi bay lên
      dz: .08 + rnd() * .16,         // cột hơi nước nghiêng về phía người xem
      sp: .95 + rnd() * .10,         // mảng nhanh hơn mảng chậm một chút
    };
    fxLayer(p); plume.add(p); puffs.push(p);
  }
  // Lúc dựng, hơi nước chưa bật: các mảng phải nằm gọn ở lỗ nắm và tắt hẳn,
  // chứ không phải quả cầu trắng bán kính 1 đè lên nồi. Khung đầu tiên của
  // phim gọi updateProp và xếp lại mảng theo cột.
  plume.visible = false;
  for (const p of puffs) { p.position.set(0, 0, 0); p.scale.setScalar(.002); p.material.opacity = 0; }
  vent.add(plume);
  g.plume = plume;

  // ── dòng hơi nước bay lên: chuyển động liên tục của khung mở đầu ──
  // Cột hơi nước trên là một vật đứng yên; khung mở đầu của phim phải có một
  // việc xảy ra trước mắt người xem. Dòng hạt mềm này bay lên từ lỗ nắm,
  // đổi hình mỗi khung — cũng là cách kênh này vẽ thứ vô hình.
  const steamFlow = flow(new THREE.Vector3(0, .012, 0), new THREE.Vector3(.05, .74, .05),
    { color: '#e2f3ff', size: .030, n: 120, rate: 1.05, opacity: .26, seed: 7 });
  fitFlow(steamFlow);
  vent.add(steamFlow);

  // ── trạng thái ──
  // Đèn báo có ba trạng thái: tắt, đỏ khi đang nấu, hổ phách khi chuyển sang
  // giữ ấm. Hổ phách phải ĐỌC RA là hổ phách: nhân màu lên quá mạnh sẽ cắt
  // mất kênh xanh, màu vàng thuần, và câu kể "chuyển từ đỏ sang hổ phách" sẽ
  // không đúng với cái đèn trên màn hình.
  const RED = new THREE.Color('#ff4a3a'), AMBER = new THREE.Color('#ffa42b'), DARK = new THREE.Color('#4a4438');
  const WHITE = new THREE.Color('#ffffff');
  const indColor = RED.clone();
  let indK = 1.8;         // độ sáng của đèn theo trạng thái
  let indState = 'red', indChanged = false;
  g.setIndicator = state => {
    const c = state === 'off' ? DARK : state === 'amber' ? AMBER : RED;
    const k = state === 'off' ? .5 : state === 'amber' ? 1.12 : 1.8;
    indColor.copy(c);
    indK = k;
    bulb.material.opacity = 1;
    if (state !== indState) { indState = state; indChanged = true; }
  };

  // ── hơi nước: film.js yêu cầu mức hơi nước, nồi tự giữ trạng thái ──
  let steamK = 0;        // mức hơi nước film.js yêu cầu
  let cookK = 0;         // mức mạnh nhất lúc nồi đang nấu
  let boilT = -1;        // lúc đèn chuyển sang hổ phách: nồi ngừng sôi
  let seeT = -1;          // lúc khung toàn cảnh mở ra
  const HOLD = .40;       // hơi nước còn bay thêm chừng này rồi mới tắt hẳn
  let collapseT = -1;    // lúc cột hơi nước tắt hẳn
  let flashT = -99;      // lúc đèn báo chớp sáng

  g.setSteam = k => { steamK = k; };
  g.setLid = k => { lid.rotation.x = -k * 1.15; };      // 0 = đậy, 1 = mở
  g.setButton = k => btn.press(k);

  // Khung hình đứng yên thì câu kể chết. Mọi thứ trên nồi tự động động:
  //  · cột hơi nước bốc lên từ lỗ nắm, mỗi mảng lắc một nhịp riêng
  //  · đèn báo chớp sáng đúng lúc đổi màu
  //  · lúc nồi ngừng sôi, cột hơi nước tắt hẳn trong khung đang quay cả nồi
  g.updateProp = t => {
    // ── đèn báo: đổi trạng thái thì chớp sáng một lần ──
    if (indChanged) { indChanged = false; flashT = t; }
    // Nhịp thở của đèn giữ ấm. Nồi đang giữ ấm thì dây điện trở bật tắt
    // (câu c34 kể việc ấy), nên đèn hổ phách không đứng yên: nó thở chậm và
    // đều. Ở câu c5 (cận thân nồi, không còn hơi nước nào bay) đây là thứ
    // duy nhất trên nồi còn chuyển động. Ở câu c3 thì máy đang nhìn thẳng
    // vào đèn để xem nó đổi màu, nên đèn phải đứng yên cho đúng sự kiện.
    let keep = 1;
    if (indState === 'amber') {
      const cam2 = window.__cam;
      if (cam2) {
        const lp = lamp.getWorldPosition(new THREE.Vector3());
        const fw = cam2.getWorldDirection(new THREE.Vector3());
        const toL = lp.sub(cam2.position).normalize();
        if (toL.dot(fw) < .985) keep = .78 + .22 * Math.sin(t * 2.6);   // lệch khỏi tâm khung
      }
    }
    const fa = Math.max(0, t - flashT);
    const fl = Math.exp(-fa * 1.7);        // lần chớp tắt dần trong khoảng 2 s
    const grow = ss(fa / .14);             // quầng sáng nở ra rồi co lại
    const hs = .050 + .150 * grow * fl;
    halo.scale.set(hs, hs, 1);
    halo.material.opacity = (.34 + .30 * fl) * keep;
    // Lõi của một đèn sáng thật thì trắng, không phải đúng màu kính màu. Quầng
    // sáng lúc chớp phải trắng hơn, thì mới đọc ra là đèn vừa bật. Nhưng quầng
    // sáng không được xoá mất cái vành đen quanh đèn: xoá hết thì đèn biến
    // thành một vệt sáng tròn, không còn là một cái đèn.
    halo.material.color.copy(indColor).lerp(WHITE, .35 * fl);
    // Đĩa đèn phồng lên theo lần chớp: một cái đèn vừa chuyển trạng thái thì
    // lõi của nó sáng hơn, không phải chỉ đổi màu.
    bulb.scale.setScalar(1 + .22 * fl);
    // Lõi của đèn sáng thì sáng hơn lúc vừa chuyển trạng thái, và đèn giữ
    // ấm thì thở theo nhịp máy.
    bulb.material.color.copy(indColor).multiplyScalar(indK * (1 + .30 * fl) * keep);

    // ── hơi nước ──
    if (steamK > .01) cookK = Math.max(cookK, steamK);
    if (boilT < 0 && indState === 'amber') boilT = t;

    // Khung đủ gần để thấy trọn cột hơi nước thì câu "tiếng sôi tắt hẳn" phải
    // ĐƯỢC THẤY: cột hơi nước còn sống thêm một nhịp rồi tắt hẳn ngay trong
    // khung đó. Ở khung toàn cảnh thì cột hơi nước chỉ là một sợi nhỏ, tắt ở
    // đó không đọc ra gì.
    let see = false;
    const cam = window.__cam;
    if (cam) {
      vent.updateWorldMatrix(true, false);
      const v = vent.getWorldPosition(new THREE.Vector3());
      const d = cam.position.distanceTo(v);
      see = d > 1.12 && d < 1.66;
      if (see && seeT < 0) seeT = t;
    }
    // Cột hơi nước phải TẮT HẲN đúng lúc lời kể nói "tắt hẳn", tức là sau
    // khi khung toàn cảnh vừa mở ra một nhịp: người xem phải kịp THẤY hơi
    // nước còn bay thì mới đọc được cú tắt đó. Tắt ngay tại giây mở khung
    // thì hơi nước chỉ nháy lên rồi mất, đọc ra như lỗi dựng hình.
    if (collapseT < 0 && boilT >= 0 && see) collapseT = seeT + HOLD;

    let amt = 0, burst = 0;
    if (collapseT >= 0) {
      const a = t - collapseT;
      if (a < .6) {
        amt = cookK * (1 - ss(a / .13));                       // tắt hẳn trong một tám giây
        burst = ss(a / .06) * (1 - ss((a - .06) / .45));        // hơi nước văng ra rồi tan
      } else amt = steamK;
    } else if (boilT >= 0 && see) amt = cookK;                  // hơi nước dưới nắm còn đẩy ra
    else amt = steamK;

    const vis = amt > .012;
    plume.visible = vis;
    steamFlow.visible = vis;
    if (vis) {
      for (let i = 0; i < PN; i++) {
        const d = puffs[i].userData;
        const u = (t * d.sp / LIFE + d.ph) % 1;                 // vị trí của mảng trong cột
        const sway = Math.sin(t * d.fw * 6.2832 + d.ph * 9.1) * d.sw * (.30 + u);
        puffs[i].position.set(
          d.dx * u + sway,
          .012 + u * RISE + burst * .05,
          d.dz * u + Math.cos(t * d.fw * 4.3 + d.ph * 6.7) * .05 * u);
        const r = d.r0 * (.30 + 2.20 * u) * (1 + .22 * Math.sin(t * 2.1 + d.ph * 12.));
        puffs[i].scale.setScalar(r * (1 + burst * 2.1));
        puffs[i].material.opacity = amt * .40 * ss(u / .10) * (1 - ss((u - .70) / .30));
      }
      steamFlow.amount(clamp(amt));
      steamFlow.update(t, 1);
    }
  };

  g.setIndicator('red');
  g.setSteam(0);
  g.setLid(0);
  return g;
}

export const PROP = { name: 'nồi cơm điện', view: () => noiComDien() };

// Dây điện của nồi, dựng riêng khỏi thân nồi: dây chạy tới ổ cắm trên
// tường (toạ độ cục bộ của nồi), nên nếu gộp vào nhóm nồi thì khung đo vật
// bị kéo dài tới tận tường và nồi co lại thành một chấm trong khung chấm vật.
// Cảnh bếp gắn dây này vào nồi (cooker.add(noiComDienCord())).
export function noiComDienCord() {
  return cable({
    points: [[0, .05, -.21], [-.02, .03, -.40], [.06, .10, -.55], [.18, .25, -.62], [.255, .30, -.667], [.255, .30, -.70]],
    r: .008, color: '#2c2f36', plug: 'wall', size: 1,
  });
}
