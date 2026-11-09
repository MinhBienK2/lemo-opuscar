// props.js — vật riêng của tập 05: viên đá có muối và viên đá đối chứng, khay inox,
// hộp muối, túi muối, hộp đá, chiếc búa, que nhiệt kế, ly thuỷ tinh, que khuấy,
// bể đá muối, bình thuỷ tinh, bát muối, túi zip có sữa, bát toàn đá,
// và thế giới vi mô trên mặt đá.
//
// Vài dựa trên hình dạng thật:
//  · đá là một khối có cạnh đã nhuềm tròn, trong có vết nứt và bọt khí;
//  · que nhiệt kế có một vạch ở mốc không độ, và cột thủy nghiện nằm DƯỚI vạch đó
//    khi nhiệt độ thấp hơn không độ — đó là thứ phim cần đọc được;
//  · bình thuỷ tinh có miệng, vạch chia, và lớp băng mọc từ thành vào;
//  · bể đá muối là một tô inox rộng đầy đá vỡ trộn muối, và ba bình đo đứng trong đó.
// Mọi vật đều là hàm thuần của t, nên dựng lại được bất cứ lúc nào.
import * as THREE from 'three';
import { toon, mesh, rbox, canvasTex, PAL, clamp, lerp, ss, mulberry, fxLayer, glowMat } from '../../../../rig/kit.js';

// Texture băng: nền trắng xanh nhạt **đều một màu** + vài vết nứt mảnh.
// Nền chuyển sắc sẽ lộ thành một mảng chữ nhật trên mặt đá, vì mặt cong
// của hộp có cạnh nhuềm lấy mẫu ở phần viền texture.
function iceTex(seed = 7) {
  return canvasTex(256, 256, (g, w, h) => {
    const r = mulberry(seed);
    g.fillStyle = '#e7f3fc'; g.fillRect(0, 0, w, h);
    // Vết nứt rải khắp texture: không lộ ranh giới nào.
    g.strokeStyle = 'rgba(120,170,205,.55)'; g.lineWidth = 2;
    for (let k = 0; k < 14; k++) {
      let x = r() * w, y = r() * h;
      g.beginPath(); g.moveTo(x, y);
      for (let s = 0; s < 5; s++) { x += (r() - .5) * 60; y += (r() - .5) * 60; g.lineTo(x, y); }
      g.stroke();
    }
  });
}

// Chất liệu băng: có texture vết nứt, kẹp ở biền (hộp có cạnh nhuềm chiếu
// UV theo mặt, phần cạnh cong lấy mẫu ra ngoài [0,1]).
const ICE_MAT = () => {
  const t = iceTex();
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.needsUpdate = true;
  return toon('#ffffff', { map: t });
};

// texture: mặt tinh thể — lưới phân tử
function latticeTex(seed = 11) {
  return canvasTex(512, 512, (g, w, h) => {
    const r = mulberry(seed);
    g.fillStyle = '#9fd4ef'; g.fillRect(0, 0, w, h);
    const gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * .7);
    gr.addColorStop(0, 'rgba(235,250,255,.85)'); gr.addColorStop(1, 'rgba(60,140,190,.35)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 4;
    for (let y = 0; y < h; y += 32) {
      g.beginPath();
      for (let x = 0; x <= w; x += 16) {
        const yy = y + Math.sin(x * .05 + y) * 5 + (r() - .5) * 2;
        x ? g.lineTo(x, yy) : g.moveTo(x, yy);
      }
      g.stroke();
    }
    g.strokeStyle = 'rgba(255,255,255,.4)'; g.lineWidth = 2;
    for (let x = 0; x < w; x += 30) {
      g.beginPath();
      for (let y = 0; y <= h; y += 16) {
        const xx = x + Math.cos(y * .06 + x) * 5;
        y ? g.lineTo(xx, y) : g.moveTo(xx, y);
      }
      g.stroke();
    }
  });
}

// texture: mặt inox xước
function steelTex() {
  return canvasTex(256, 256, (g, w, h) => {
    const r = mulberry(23);
    g.fillStyle = '#b7c1cc'; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 260; k++) {
      g.strokeStyle = `rgba(${90 + r() * 90},${100 + r() * 90},${115 + r() * 90},${.1 + r() * .2})`;
      g.lineWidth = .6 + r() * 1.4;
      const y = r() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (r() - .5) * 4); g.stroke();
    }
  });
}

// texture: muối — hạt trắng nhỏ trên nền hơi xám
function saltTex() {
  return canvasTex(256, 256, (g, w, h) => {
    const r = mulberry(31);
    g.fillStyle = '#e9edf2'; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 2600; k++) {
      g.fillStyle = `rgba(255,255,255,${.4 + r() * .6})`;
      g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
    }
    for (let k = 0; k < 300; k++) {
      g.fillStyle = `rgba(150,165,185,${.2 + r() * .3})`;
      g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
    }
  });
}

const STEEL = () => toon('#ffffff', { map: steelTex() });

// ── viên đá ─────────────────────────────────────────────────────────────
// Một viên đá: khối có cạnh nhuềm tròn, màu băng, và một lớp nước bám ở đáy.
// melt(k): k = 0 là viên mới, k = 1 là còn một nắm nhỏ — nó nhỏ đi và thấp xuống.
export function iceCube({ s = .15, seed = 7, shadow = false } = {}) {
  const g = new THREE.Group();
  // bóng tiếp xúc của viên đá trên mặt khay: không có nó, viên đá trôi
  const sh = shadow ? softShadow({ R: s * .78 }) : null;
  if (sh) g.add(sh);
  // Cạnh nhuềm: bo vừa, không bo sát. Bo quá to thì khối đá trông như
  // viên sáp; quá nhỏ thì mặt phẳng giữa khối in ra một mảng lớn.
  const m = mesh(rbox(s, s, s, s * .18, 4), ICE_MAT(), [0, s / 2, 0]);
  // Xoay **nhẹ** quanh trục đứng (±14°), để khối đá không đứng thẳng như
  // một hộp sơn mà vẫn nhìn ra là một khối có mặt trước rõ. Xoay nhiều
  // (như 120°) thì khối đá chỉ còn lộ một góc, và khung c5 đọc ra là một
  // tấm bảng trắng chứ không phải viên đá.
  m.rotation.set(.04, ((seed % 7) * .08) - .24, .03);
  g.add(m);
  // lớp nước bám quanh đáy viên đá
  const film = mesh(new THREE.CylinderGeometry(s * .58, s * .62, s * .12, 22), toon('#d7f0ff'), [0, s * .04, 0]);
  g.add(film);
  g.userData.cube = m;
  g.setMelt = k => {
    const kk = clamp(k);
    const sc = 1 - .62 * kk;
    m.scale.set(sc, sc, sc);
    m.position.y = s * sc * .5;
    film.scale.setScalar(1 + .35 * kk);
    film.material.opacity = 1;
  };
  g.setMelt(0);
  return g;
}

// ── vũng nước ───────────────────────────────────────────────────────────
// Vũng nước muối đọng quanh chân đá: một MÀNG mỏng, không phải một đĩa.
// Màng nước dựng bằng một mặt phẳng cong dần về mặt khay ở rìa: chỗ biên
// không có cạnh sắc để mực vẽ thành vòng đen. Đĩa trắng đục có viền đen là
// thứ khiến vũng nước đọc ra là cái đĩa lót (vòng chấm hình ảnh 2).
export function puddle({ R = .16, h = .0035 } = {}) {
  const g = new THREE.Group();
  const m = mesh(waterFilm(R, h), toon('#ffffff', { map: puddleTex(), transparent: true, opacity: .92, depthWrite: false }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0] });
  g.add(m);
  g.userData.water = m;
  g.setLevel = k => {
    const kk = clamp(k);
    const sc = .35 + .65 * kk;
    m.scale.set(sc, sc, 1);
    m.material.opacity = .55 + .37 * kk;
  };
  g.setLevel(0);
  return g;
}

// mặt nước cong dần về 0 ở rìa — không cạnh, không viền mực
function waterFilm(R, h) {
  const geo = new THREE.PlaneGeometry(R * 2, R * 2, 40, 40);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i);
    const r = Math.min(1, Math.hypot(x, y) / R);
    p.setZ(i, h * (1 - r * r) * (1 - r * r));
  }
  geo.computeVertexNormals();
  return geo;
}

// texture màng nước: nền trong, một vòng loé ở rìa, biên tan dần
function puddleTex(seed = 5) {
  return canvasTex(256, 256, (g, w, h) => {
    const r = mulberry(seed);
    g.clearRect(0, 0, w, h);
    const c = w / 2;
    const gr = g.createRadialGradient(c, c, 0, c, c, w * .5);
    gr.addColorStop(0, 'rgba(140,195,228,.42)');
    gr.addColorStop(.55, 'rgba(120,180,220,.34)');
    gr.addColorStop(.84, 'rgba(228,246,255,.78)');
    gr.addColorStop(.94, 'rgba(240,252,255,.45)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    // vài vệt loé nhỏ trên mặt nước
    g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 2;
    for (let k = 0; k < 7; k++) {
      const a = r() * 6.28, rad = w * (.18 + r() * .26);
      g.beginPath();
      g.arc(c, c, rad, a, a + .6 + r() * .9);
      g.stroke();
    }
  });
}

// bóng của một vật trên mặt khay: mảng tối mờ dần, không có cạnh
export function softShadow({ R = .08, h = .0012 } = {}) {
  const g = new THREE.Group();
  const m = mesh(waterFilm(R, h), toon('#ffffff', {
    map: canvasTex(128, 128, (gg, w, h2) => {
      const gr = gg.createRadialGradient(w / 2, h2 / 2, 0, w / 2, h2 / 2, w * .5);
      gr.addColorStop(0, 'rgba(30,60,90,.55)');
      gr.addColorStop(.6, 'rgba(40,80,115,.30)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      gg.fillStyle = gr; gg.fillRect(0, 0, w, h2);
    }), transparent: true, opacity: .8, depthWrite: false,
  }), [0, 0, 0], { rot: [-Math.PI / 2, 0, 0] });
  g.add(m);
  return g;
}

// ── khay inox ───────────────────────────────────────────────────────────
// Khay inox sâu: đáy + bốn thành thấp. Muối nước đọng trong đáy khay.
export function steelTray({ w = .78, d = .52, h = .055 } = {}) {
  const g = new THREE.Group();
  const M = STEEL();
  g.add(mesh(rbox(w, .012, d, .006), M, [0, .006, 0]));
  g.add(mesh(rbox(w, h, .014, .006), M, [0, h / 2, -d / 2 + .007]));
  g.add(mesh(rbox(w, h, .014, .006), M, [0, h / 2, d / 2 - .007]));
  g.add(mesh(rbox(.014, h, d - .028, .006), M, [-w / 2 + .007, h / 2, 0]));
  g.add(mesh(rbox(.014, h, d - .028, .006), M, [w / 2 - .007, h / 2, 0]));
  return g;
}

// ── hộp muối / bát muối ────────────────────────────────────────────────
// Một hộp muối nhạt, dạng tô nông, có đống muối trắng trong đó.
// use(k): k = 0 là đầy, k = 1 là đã cạn (đáy hộp lộ ra).
export function saltTin({ w = .17, d = .17, h = .07, seed = 5 } = {}) {
  const g = new THREE.Group();
  const M = toon('#dfe4ee');
  g.add(mesh(rbox(w, .012, d, .005), M, [0, .006, 0]));
  g.add(mesh(rbox(w, h, .012, .005), M, [0, h / 2, -d / 2 + .006]));
  g.add(mesh(rbox(w, h, .012, .005), M, [0, h / 2, d / 2 - .006]));
  g.add(mesh(rbox(.012, h, d - .024, .005), M, [-w / 2 + .006, h / 2, 0]));
  g.add(mesh(rbox(.012, h, d - .024, .005), M, [w / 2 - .006, h / 2, 0]));
  const salt = mesh(rbox(w - .04, .03, d - .04, .012), toon('#ffffff', { map: saltTex() }), [0, .028, 0]);
  g.add(salt);
  g.userData.salt = salt;
  g.setUsed = k => {
    const kk = clamp(k);
    salt.scale.set(1, 1 - .95 * kk, 1);
    salt.position.y = .012 + .015 * (1 - kk);
  };
  g.setUsed(0);
  return g;
}

// ── túi muối ────────────────────────────────────────────────────────────
// Túi muối mềm: một gối nhỏ **xõe xuống**, có nếp dọc, miệng kẹp lại, có nhãn.
// Nó phải khác hẳn hộp muối (tứ giác, cứng): nếu cả hai đọc như nhau thì
// người xem không biết cái nào là "hộp" và cái nào là "túi" (vòng chấm 2).
export function saltBag({ w = .16, h = .2, d = .07, color = '#e6ecf5' } = {}) {
  const g = new THREE.Group();
  const body = mesh(new THREE.SphereGeometry(1, 40, 24), toon(color, { map: saltTex() }), [0, h / 2, 0]);
  body.scale.set(w / 2, h / 2, d / 2);
  g.add(body);
  // túi xõe: đáy túi bẹp xuống, không phải quả cầu tròn
  const heel = mesh(new THREE.SphereGeometry(1, 24, 16), toon(color, { map: saltTex() }), [0, h * .12, 0]);
  heel.scale.set(w * .46, h * .16, d * .46);
  g.add(heel);
  // các nếp dọc: túi mềm có nếp, hộp carton thì không
  for (let i = -1; i <= 1; i++) {
    const f = mesh(rbox(.008, h * .8, d * .5, .003), toon('#d3dbe8', { map: saltTex() }),
      [i * w * .26, h * .48, d * .16], { rot: [0, 0, i * .10] });
    g.add(f);
  }
  // miệng túi kẹp lại: một thanh dẹt có gân
  const mouth = mesh(rbox(w * .78, .022, d * .46, .008), toon('#c6d2e2'), [0, h * .93, 0]);
  g.add(mouth);
  const crimp = mesh(rbox(w * .72, .008, .01, .003), toon('#aebdd0'), [0, h * .97, 0]);
  g.add(crimp);
  // nhãn
  const lab = mesh(rbox(w * .5, h * .28, .004, .004), toon(PAL.mustard), [0, h * .42, d / 2 + .002]);
  g.add(lab);
  return g;
}

// ── tô muối ─────────────────────────────────────────────────────────────
// Tô nông **tròn**, đựng một đống muối trắng lấp khoảng hai phần ba mặt tô.
// Hộp muối ở bếp là hộp vuông; ở bàn thí nghiệm thì phải là một tô — nếu cả
// hai đều là hộp vuông thì người xem đọc nhầm (vòng chấm hình ảnh 2).
export function saltDish({ R = .085, h = .038, seed = 9 } = {}) {
  const g = new THREE.Group();
  // tô sứ: hơi tự sáng, vì lòng tô là chỗ tối nhất của cảnh bàn thí nghiệm
  // và một tô tối đọc ra là một hố đen, không phải tô muối (vòng chấm hình
  // ảnh 2 ở c19).
  const M = toon('#e9edf4', { emissive: '#6d7c96', emissiveIntensity: .16 });
  g.add(mesh(new THREE.CylinderGeometry(R, R * .74, h, 34, 1, true), M, [0, h / 2, 0]));
  g.add(mesh(new THREE.CylinderGeometry(R * .74, R * .74, .008, 34), M, [0, .004, 0]));
  g.add(mesh(new THREE.TorusGeometry(R, .006, 8, 34), M, [0, h, 0], { rot: [Math.PI / 2, 0, 0] }));
  // đống muối: một **núi muối** tròn, không phải một tấm hình vuông. Tấm
  // vuông phẳng trong cái tô tròn đọc ra là hộp carton (vòng chấm hình ảnh 2
  // ở c19: "tô đọc ra là hộp carton").
  const rs = mulberry(seed);
  // Muối trong tô phải **có hạt**, không phải một núi kem mịn. Vì vậy:
  //   · chất liệu bớt tự sáng (tự sáng mạnh làm mất vân của texture hạt),
  //   · núi muối thấp hơn,
  //   · hạt nằm **trên mặt núi**, tính theo đường tròn, không trôi lơ lửng.
  const saltMat = toon('#ffffff', { map: saltTex(), emissive: '#7d97b8', emissiveIntensity: .16 });
  // **nửa quả cầu**, không phải quả cầu: núi muối phải nằm trên đáy tô,
  // không thòm xuống dưới đáy tô (quả cầu nguyên lọt ra ngoài mép dưới).
  const core = mesh(new THREE.SphereGeometry(R * .62, 22, 12, 0, Math.PI * 2, 0, Math.PI / 2), saltMat, [0, .006, 0]);
  core.scale.set(1, .40, 1);
  g.add(core);
  const grains = [];
  const domeR = R * .62, domeH = R * .62 * .40;
  for (let i = 0; i < 110; i++) {
    const a = rs() * 6.28, rad = Math.sqrt(rs()) * domeR;
    const s = .006 + rs() * .005;
    // y trên mặt núi: ở tâm cao nhất, ở rìa xuống sát đáy tô
    const y = .006 + domeH * Math.sqrt(Math.max(0, 1 - (rad / domeR) ** 2)) + s * .3;
    const m = mesh(rbox(s, s * .8, s, s * .16, 1), saltMat, [Math.cos(a) * rad, y, Math.sin(a) * rad]);
    m.rotation.set((rs() - .5) * .6, rs() * 3, (rs() - .5) * .6);
    g.add(m);
    grains.push({ m, s });
  }
  g.userData.grains = grains;
  g.userData.core = core;
  g.setUsed = k => {
    const kk = clamp(k);
    const sy = Math.max(.02, .32 * (1 - kk));
    core.scale.set(Math.max(.02, 1 - .5 * kk), sy, Math.max(.02, 1 - .5 * kk));
    core.position.y = .006 * (1 - .5 * kk);
    for (const gr of grains) {
      // hạt phải **còn thấy được** khi muối tan: hạt bé đi chút, nhưng
      // không biến thành mấy chấm đen dưới viền mực (vòng chấm hình ảnh 2 ở
      // c19: đống muối đọc ra là một mảng trắng trơn)
      const sc = Math.max(.4, 1 - kk * .7);
      gr.m.scale.setScalar(sc);
      // và hạt nằm **trên mặt núi đang xẹp xuống**, không rơi xuống đáy tô
      const rad = Math.hypot(gr.m.position.x, gr.m.position.z);
      const y = core.position.y + R * .62 * sy * Math.sqrt(Math.max(0, 1 - (rad / (R * .62)) ** 2)) + gr.s * .3 * sc;
      gr.m.position.y = y;
    }
  };
  g.setUsed(0);
  return g;
}

// ── hộp đá ──────────────────────────────────────────────────────────────
// Hộp xốp giữ đá: một thùng nhựa mở, bên trong là đá vỡ.
// Đây là nguồn của viên đá trong khung mở — viên đá vốn ở dưới không độ.
export function iceBox({ w = .3, h = .19, d = .22, seed = 13 } = {}) {
  const g = new THREE.Group();
  const M = toon('#e8eef7');
  g.add(mesh(rbox(w, .012, d, .005), M, [0, .006, 0]));
  g.add(mesh(rbox(w, h, .014, .006), M, [0, h / 2, -d / 2 + .007]));
  g.add(mesh(rbox(.014, h, d - .028, .006), M, [-w / 2 + .007, h / 2, 0]));
  g.add(mesh(rbox(.014, h, d - .028, .006), M, [w / 2 - .007, h / 2, 0]));
  g.add(mesh(rbox(w, h, .014, .006), M, [0, h / 2, d / 2 - .007], { cast: false }));
  const r = mulberry(seed);
  for (let i = 0; i < 26; i++) {
    const s = .02 + r() * .022;
    const c = mesh(rbox(s, s * .8, s, s * .25, 2), ICE_MAT(),
      [(r() - .5) * (w - .07), .02 + r() * .05, (r() - .5) * (d - .07)]);
    c.rotation.set(r() * 3, r() * 3, r() * 3);
    g.add(c);
  }
  return g;
}

// ── chiếc búa ───────────────────────────────────────────────────────────
// Búa sắt: cán gỗ và đầu búa. Không ai cầm, nó nằm yên từ khung mở.
export function hammer({ len = .3 } = {}) {
  const g = new THREE.Group();
  const handle = mesh(new THREE.CylinderGeometry(.016, .021, len, 14), toon('#8a5a34'), [0, 0, 0], { rot: [0, 0, Math.PI / 2] });
  g.add(handle);
  const head = mesh(rbox(.075, .055, .055, .012), STEEL(), [len / 2 + .022, .006, 0]);
  g.add(head);
  const face = mesh(rbox(.012, .056, .056, .006), toon('#e6ebf2'), [len / 2 + .058, .006, 0]);
  g.add(face);
  // vết muối bám trên cạnh búa
  const stain = mesh(rbox(.05, .012, .056, .006), toon('#ffffff', { map: saltTex() }), [len / 2 + .018, .02, 0]);
  g.add(stain);
  g.position.y = .028;
  return g;
}

// ── que nhiệt kế ────────────────────────────────────────────────────────
// Que thủy tinh, cột thủy nghiện đỏ, bầu nhọn, và một vạch ở mốc không độ.
// setTemp(c): nhiệt độ theo °C — cột đỏ nằm DƯỚI vạch không độ khi c < 0.
//
// Thang: mỗi que có **thang riêng**, vì hai que của phim đo hai thứ khác nhau.
//   · que trong vũng nước ở bếp: thang thô (6 mm mỗi độ) — cột phải tụt đủ
//     xa để người xem thấy "nước quanh đá nguội đi".
//   · que trong bình ở bàn thí nghiệm: thang mịn (3,1 mm mỗi độ) và vạch
//     không độ ở 66 % que — để mốc −21 °C dừng **trên miệng bình**, chứ không
//     chui xuống trong bình mà không ai đọc được (vòng chấm 1 đã bắt lỗi này).
export function thermo({ h = .3, zero = .55, perDeg = null } = {}) {
  const g = new THREE.Group();
  // ống thủy tinh: cột đỏ nằm bên trong, phải nhìn xuyên qua mới thấy
  const glass = toon('#dce8f2', { transparent: true, opacity: .38, depthWrite: false });
  const bulb = mesh(new THREE.SphereGeometry(.018, 18, 12), toon('#f2f6fb'), [0, .014, 0]);
  g.add(bulb);
  g.add(mesh(new THREE.CylinderGeometry(.006, .006, h, 14), glass, [0, h / 2 + .01, 0]));
  // cột thủy nghiện: phải **đọc được** trong khung. Trước đây nó là một
  // que mảnh 3,2 mm và màu đỏ nhạt — trên nền đá trắng nó chìm hẳn, và câu
  // "hai mươi mốt độ" không có hình nào xác nhận (vòng chấm hình ảnh 2 ở c21).
  // Nay que đặc gần gấp đôi, đỏ đậm và có chút tự sáng.
  const col = mesh(new THREE.CylinderGeometry(.005, .005, 1, 12),
    toon('#e8264a', { emissive: '#8e0f28', emissiveIntensity: .45 }), [0, 0, 0]);
  g.add(col);
  // vạch mốc không độ
  const zy = h * zero;
  const tick = mesh(rbox(.022, .003, .006, .001), toon(PAL.navy), [0, zy, 0]);
  g.add(tick);
  // thang của que: mét cho mỗi độ, và vị trí đầu cột đỏ ở một nhiệt độ
  const pd = perDeg ?? h * .0183;
  g.userData.col = col;
  g.userData.zeroY = zy;
  g.userData.perDeg = pd;
  g.columnY = c => clamp(zy + c * pd, .02, h * .96);
  // một vạch mốc riêng trên thang: đánh dấu một nhiệt độ mà cả phim nhắc tới
  // (vòng chấm hình ảnh 2: ở c21 không có vạch nào để so, nên "-21 °C" không
  // được hình nào xác nhận).
  g.addMark = (y, color = PAL.mustard) => {
    const m = mesh(rbox(.028, .004, .006, .001), toon(color), [0, y, 0]);
    g.add(m);
    return m;
  };
  g.setTemp = c => {
    const y = g.columnY(c);
    col.scale.y = Math.max(.02, y - .012);
    col.position.y = .012 + col.scale.y / 2;
  };
  g.setTemp(0);
  return g;
}

// ── ly thuỷ tinh (bếp) ──────────────────────────────────────────────────
// Ly uống nước: thành kính, nước trong, và mặt nước.
//
// Nước **phải trong**: cảnh hai ly ở bếp so sánh hai ly bằng cách nhìn mặt
// nước và cột đỏ bên trong. Ly nước muối đục như nhựa làm mất cả cột đỏ
// thứ hai, và câu "muối tan không làm đá nóng lên" mất bằng chứng
// (vòng chấm hình ảnh 2).
export function tumbler({ h = .16, r = .045 } = {}) {
  const g = new THREE.Group();
  // ly thuỷ tinh: phải **nhìn xuyên qua** được, vì cảnh ở bếp so sánh hai ly
  // bằng cách nhìn mặt nước và cột đỏ bên trong
  const glass = toon('#d6e8f4', { transparent: true, opacity: .26, depthWrite: false });
  const wall = mesh(new THREE.CylinderGeometry(r, r * .92, h, 26, 1, true), glass, [0, h / 2, 0]);
  g.add(wall);
  g.add(mesh(new THREE.CylinderGeometry(r, r * .92, .01, 26), toon('#c6dcea'), [0, .005, 0]));
  // vành miệng: một vòng dày, đọc được là "miệng ly" chứ không phải trụ kính
  g.add(mesh(new THREE.TorusGeometry(r, .005, 8, 26), toon('#dceefb', { transparent: true, opacity: .9, depthWrite: false }), [0, h, 0], { rot: [Math.PI / 2, 0, 0] }));
  const water = mesh(new THREE.CylinderGeometry(r * .95, r * .88, h * .6, 26), toon('#c3e2f5', { transparent: true, opacity: .42, depthWrite: false }), [0, h * .3, 0]);
  g.add(water);
  // mặt nước: một đĩa sáng, đó là thứ người xem so giữa hai ly
  const top = mesh(new THREE.CircleGeometry(r * .93, 26), toon('#e8f6ff', { transparent: true, opacity: .55, depthWrite: false }), [0, h * .6, 0], { rot: [-Math.PI / 2, 0, 0] });
  g.add(top);
  g.userData.water = water;
  g.setFill = k => {
    const kk = clamp(k);
    water.scale.y = Math.max(.05, kk);
    water.position.y = h * .3 * kk;
    top.position.y = h * .6 * kk;
    top.scale.setScalar(Math.max(.05, kk));
  };
  g.setFill(1);
  return g;
}

// ── que khuấy ───────────────────────────────────────────────────────────
export function stirRod({ len = .26 } = {}) {
  const g = new THREE.Group();
  g.add(mesh(new THREE.CylinderGeometry(.005, .005, len, 10), toon('#e2eef7'), [0, len / 2, 0]));
  g.add(mesh(new THREE.SphereGeometry(.007, 10, 8), toon('#e2eef7'), [0, len, 0]));
  return g;
}

// ── bình thuỷ tinh ──────────────────────────────────────────────────────
// Bình có miệng, vạch chia, nước bên trong, và lớp băng mọc từ thành vào.
// freeze(k): k = 0 là nước trong, k = 1 là bình đầy băng trong suốt.
export function beaker({ h = .2, r = .05, liquid = '#cfe9f7' } = {}) {
  const g = new THREE.Group();
  // thành bình trong suốt: que nhiệt kế cắm trong bình phải đọc được qua thành
  const glass = toon('#d8e8f4', { transparent: true, opacity: .28, depthWrite: false });
  g.add(mesh(new THREE.CylinderGeometry(r, r * .95, h, 28, 1, true), glass, [0, h / 2, 0]));
  g.add(mesh(new THREE.CylinderGeometry(r * .95, r * .92, .008, 28), toon('#c3d8e8'), [0, .004, 0]));
  // miệng bình: một vòng dày hơn, đủ rõ để đọc được **vành miệng** khi bình
  // đứng giữa đống đá vỡ trắng (vòng chấm hình ảnh 2: miệng bình không đọc được)
  g.add(mesh(new THREE.TorusGeometry(r, .006, 8, 28), toon('#9fbdd4', { transparent: true, opacity: .9, depthWrite: false }), [0, h, 0], { rot: [Math.PI / 2, 0, 0] }));
  // vạch chia
  for (let i = 1; i <= 3; i++) {
    g.add(mesh(rbox(.018, .0035, .003, .001), toon('#ffffff'), [0, h * i / 4, r * .93]));
  }
  // nước trong bình: trong suốt, để cột thủy nghiện của que nhiệt kế đọc được qua nó
  const liq = mesh(new THREE.CylinderGeometry(r * .93, r * .9, h * .72, 28), toon(liquid, { transparent: true, opacity: .55, depthWrite: false }), [0, h * .36, 0]);
  g.add(liq);
  // lớp băng bám thành. Nó phải **trắng** chứ không tím: đèn bàn thí nghiệm
  // xanh, một lớp băng chỉ hơi phát sáng mới đọc ra là "đông cứng" (vòng
  // chấm hình ảnh 2: bình nước sạch đọc ra là khối tím-xanh đục).
  const frost = mesh(new THREE.CylinderGeometry(r * .99, r * .99, h * .72, 28, 1, true),
    toon('#f4fcff', { transparent: true, opacity: .72, emissive: '#7fb4dd', emissiveIntensity: .45, depthWrite: false }), [0, h * .36, 0]);
  frost.scale.y = .001;
  g.add(frost);
  g.userData.frost = frost;
  g.userData.liquid = liq;
  g.setFreeze = k => {
    const kk = clamp(k);
    frost.scale.y = Math.max(.001, kk);
    frost.position.y = h * .36 * kk;
    frost.material.opacity = 1;
    liq.scale.y = 1 - .25 * kk;
    liq.position.y = h * .36 * (1 - .12 * kk);
  };
  g.setFreeze(0);
  return g;
}

// ── bể đá muối ──────────────────────────────────────────────────────────
// Tô inox rộng, đầy đá vỡ trộn muối. Đây là vật làm lạnh cho các bình đo.
export function iceBath({ R = .26, h = .11, seed = 17 } = {}) {
  const g = new THREE.Group();
  const M = STEEL();
  g.add(mesh(new THREE.CylinderGeometry(R, R * .93, h, 34, 1, true), M, [0, h / 2, 0]));
  g.add(mesh(new THREE.CylinderGeometry(R * .93, R * .93, .01, 34), M, [0, .005, 0]));
  g.add(mesh(new THREE.TorusGeometry(R, .007, 8, 34), M, [0, h, 0], { rot: [Math.PI / 2, 0, 0] }));
  // đá vỡ. Đá nằm **thấp** trong tô: nếu đá cao bằng miệng bình thì miệng bình
  // chìm trong đống trắng và "nhìn qua miệng bình" không còn gì để nhìn
  // (vòng chấm hình ảnh 2).
  const r = mulberry(seed);
  const iceMat = ICE_MAT();
  for (let i = 0; i < 60; i++) {
    const a = r() * Math.PI * 2, rad = Math.sqrt(r()) * R * .82;
    const s = .022 + r() * .026;
    const c = mesh(rbox(s, s * .75, s * .9, s * .22, 2), iceMat,
      [Math.cos(a) * rad, h * .50 + r() * .018, Math.sin(a) * rad]);
    c.rotation.set(r() * 3, r() * 3, r() * 3);
    g.add(c);
  }
  // muối trộn trên đá
  const saltMat = toon('#ffffff', { map: saltTex() });
  for (let i = 0; i < 90; i++) {
    const a = r() * Math.PI * 2, rad = Math.sqrt(r()) * R * .85;
    g.add(mesh(rbox(.008, .006, .008, .002), saltMat,
      [Math.cos(a) * rad, h * .56 + r() * .012, Math.sin(a) * rad]));
  }
  return g;
}

// ── bát toàn đá ─────────────────────────────────────────────────────────
// Bát sành lớn đầy đá vỡ: nơi ta làm kem tuyết.
export function bowlOfIce({ R = .17, h = .09, seed = 29 } = {}) {
  const g = new THREE.Group();
  const M = toon('#e6e2d8');
  g.add(mesh(new THREE.CylinderGeometry(R, R * .72, h, 30, 1, true), M, [0, h / 2, 0]));
  g.add(mesh(new THREE.CylinderGeometry(R * .72, R * .72, .01, 30), M, [0, .005, 0]));
  g.add(mesh(new THREE.TorusGeometry(R, .008, 8, 30), M, [0, h, 0], { rot: [Math.PI / 2, 0, 0] }));
  const r = mulberry(seed);
  const iceMat = ICE_MAT();
  for (let i = 0; i < 44; i++) {
    const a = r() * Math.PI * 2, rad = Math.sqrt(r()) * R * .74;
    const s = .018 + r() * .02;
    const c = mesh(rbox(s, s * .8, s, s * .2, 2), iceMat,
      [Math.cos(a) * rad, h * .62 + r() * .03, Math.sin(a) * rad]);
    c.rotation.set(r() * 3, r() * 3, r() * 3);
    g.add(c);
  }
  // muối trộn vào đá quanh túi
  const saltMat = toon('#ffffff', { map: saltTex() });
  for (let i = 0; i < 70; i++) {
    const a = r() * Math.PI * 2, rad = R * (.5 + r() * .45);
    g.add(mesh(rbox(.007, .006, .007, .002), saltMat,
      [Math.cos(a) * rad, h * .66 + r() * .02, Math.sin(a) * rad]));
  }
  return g;
}

// ── túi zip có sữa ──────────────────────────────────────────────────────
// Túi zip trong suốt, bên trong là sữa đặc; khóa zip ở miệng túi.
//
// Ba thứ phải **đọc được** trong nhát c24: dải kéo khóa ở miệng, màu sữa
// đặc bên trong, và vỏ sương mọc dần. Túi trước đây là một tấm phẳng tím-xanh
// không có gì cả (vòng chấm hình ảnh 2).
export function zipBag({ w = .15, h = .2, d = .05 } = {}) {
  const g = new THREE.Group();
  // sữa đặc: một **khối** có mặt trên phẳng, đứng ở nửa dưới túi. Nó phải
  // là một khối sữa có thể đổ, không phải một quả bóng hay một tấm bìa
  // carton dán vào khung (vòng chấm hình ảnh 2 ở c24: "sữa đọc ra là một
  // quả bóng", "túi đọc ra là hộp carton").
  const milk = mesh(rbox(w * .62, h * .40, d * .58, .022),
    toon('#fffaf0', { emissive: '#6b6a5e', emissiveIntensity: .14 }), [0, h * .21, 0]);
  g.add(milk);
  // mặt sữa phẳng ở trên: một miếng trắng mỏng hơn, đọc ra là mặt chất lỏng
  const milkTop = mesh(rbox(w * .58, .006, d * .52, .01),
    toon('#fffdf6', { emissive: '#8a8a7c', emissiveIntensity: .2 }), [0, h * .41, 0]);
  g.add(milkTop);
  // lớp nylon: trong, không ghi đè chiều sâu, để sữa không bị nuốt
  const bag = mesh(rbox(w, h, d, d * .35), toon('#eef7ff', { transparent: true, opacity: .38, depthWrite: false }), [0, h / 2, 0]);
  g.add(bag);
  // dải kéo khóa: một thanh ngang miệng túi, có răng cưa
  const zip = mesh(rbox(w * .96, .018, .018, .006), toon('#8fa6bd'), [0, h * .97, 0]);
  g.add(zip);
  for (let i = 0; i < 9; i++) {
    g.add(mesh(rbox(.011, .009, .022, .002), toon('#6f869e'), [-w * .42 + i * w * .105, h * .985, 0]));
  }
  // hai mép túi gấp lên ở miệng
  g.add(mesh(rbox(w * .92, .022, .006, .003), toon('#dbe8f4', { transparent: true, opacity: .8, depthWrite: false }), [0, h * .90, d * .46]));
  g.add(mesh(rbox(w * .92, .022, .006, .003), toon('#dbe8f4', { transparent: true, opacity: .8, depthWrite: false }), [0, h * .90, -d * .46]));
  // nhãn trên túi: một mảng trắng có sọc xanh ở nửa trên túi. Đây là thứ
  // biến một cái túi trong suốt thành **túi sữa** (vòng chấm hình ảnh 2 ở
  // c24: "túi đọc ra là hộp carton").
  g.add(mesh(rbox(w * .58, h * .17, .004, .004), toon('#fbfdff'), [0, h * .62, d * .47]));
  g.add(mesh(rbox(w * .58, h * .032, .005, .003), toon('#4f8fd6'), [0, h * .545, d * .48]));
  // vỏ sương: mọc từ đáy lên, **ở mặt trước của túi** — nơi máy quay
  // nhìn thấy. Vỏ sương ẩn sau khối sữa thì người xem không thấy gì đông
  // (vòng chấm hình ảnh 2 ở c24: trong túi không có vỏ sương nào).
  const frost = new THREE.Group();
  const frostMat = toon('#f2fbff', { transparent: true, opacity: .92, depthWrite: false, emissive: '#7fa8cc', emissiveIntensity: .22 });
  const cr = mulberry(37);
  const crystals = [];
  for (let i = 0; i < 44; i++) {
    const a = cr() * 6.28, rad = cr() * w * .34;
    const s = w * (.06 + cr() * .055);
    // tinh thể, không phải bong bóng: một mảnh nhỏ có cạnh
    // đá bùng **từ đáy lên**: càng xuống đáy càng nhiều tinh thể
    const c = mesh(rbox(s, s * .8, s * .9, s * .18, 1), frostMat,
      [Math.cos(a) * rad, h * .07 + Math.pow(cr(), 1.9) * h * .30, d * .30 + (cr() - .5) * d * .18]);
    c.rotation.set((cr() - .5) * .8, cr() * 3, (cr() - .5) * .8);
    frost.add(c);
    crystals.push({ c, s, th: cr() * .5 });
  }
  frost.visible = false;
  g.add(frost);
  g.userData.milk = milk;
  g.userData.frost = frost;
  g.setFrozen = k => {
    const kk = clamp(k);
    milk.material.color.setStyle(kk > .5 ? '#f4f0e4' : '#fffaf0');
    milkTop.material.color.setStyle(kk > .5 ? '#efeade' : '#fffdf6');
    frost.visible = kk > .02;
    // mỗi tinh thể sương có ngày "sinh" riêng: đá bùng lên dần, không bật
    // ra cả túi một lúc
    for (const it of crystals) {
      const u = clamp((kk - it.th) / Math.max(.05, 1 - it.th));
      it.c.scale.setScalar(Math.max(.001, u));
      it.c.visible = u > .02;
    }
  };
  g.setFrozen(0);
  return g;
}

// ── mặt đá ở cấp nano ───────────────────────────────────────────────────
// Mặt phẳng tinh thể: một mặt phẳng có lưới phân tử, và lớp nước trên nó.
export function iceFace({ s = .5 } = {}) {
  const g = new THREE.Group();
  const face = mesh(rbox(s, .02, s, .004), toon('#a8cfe6', { map: latticeTex(), emissive: '#8fd0f2', emissiveIntensity: .10 }), [0, 0, 0]);
  g.add(face);
  // lớp nước trên mặt đá: một tấm mỏng, mờ dần đi. Nó phải mỏng đủ để
  // lưới tinh thể bên dưới còn thấy — lớp nước là lớp phủ, không phải tường.
  const layer = mesh(rbox(s * .99, .008, s * .99, .003), toon('#bfe6ff', { transparent: true, opacity: .40 }), [0, .014, 0]);
  g.add(layer);
  g.userData.layer = layer;
  // HAI đại lượng, không một: c14 lớp nước **dày thêm** (phân tử bám vào),
  // c16 lớp nước **mỏng đi** (ion chặn phân tử bám). Một con số không làm
  // được cả hai lúc (vòng chấm 1 đã bắt lỗi này).
  //   thin: 0 = nguyên dày, 1 = mỏng nhất
  //   wet:  0 = trong suốt, 1 = đục (nhiều nước)
  g.setLayer = (thin = 0, wet = 0) => {
    const t = clamp(thin), w = clamp(wet);
    layer.scale.y = Math.max(.05, 1 - .8 * t);
    layer.material.opacity = .10 + .40 * w;
    // lưới tinh thể **sáng dần** khi lớp nước mỏng đi. Không có cái này,
    // "lớp nước trên mặt đá mỏng đi" chỉ là một tấm xanh phẳng (vòng chấm
    // hình ảnh 2 ở c16).
    face.material.emissiveIntensity = .10 + .95 * t;
  };
  g.setLayer(0, .6);
  return g;
}

// ── phân tử nước ───────────────────────────────────────────────────────
// Hạt trắng bay tới mặt đá rồi dính vào. Bay(cycle): hạt đi từ xa tới mặt đá.
export function molecules({ n = 34, s = .5, seed = 41 } = {}) {
  const g = new THREE.Group();
  const r = mulberry(seed);
  const dots = [];
  for (let i = 0; i < n; i++) {
    const d = mesh(new THREE.SphereGeometry(.006, 10, 8), glowMat('#ffffff', 1.1), [0, 0, 0], { cast: false });
    fxLayer(d);
    d.userData = {
      from: new THREE.Vector3((r() - .5) * s * 1.6, .12 + r() * .3, (r() - .5) * s * 1.6),
      to: new THREE.Vector3((r() - .5) * s * .8, .02, (r() - .5) * s * .8),
      t0: r() * 3, sp: .5 + r() * .5,
    };
    g.add(d); dots.push(d);
  }
  g.update = (t, cam = null) => {
    for (const d of dots) {
      const u = d.userData;
      const k = ((t * u.sp + u.t0) % 3) / 3;
      d.position.lerpVectors(u.from, u.to, ss(k));
      d.scale.setScalar(lerp(1.1, .7, k));
      // vùng trống trước ống kính: một chấm sáng lọt vào vài centimet
      // trước máy thành một quả bóng trắng giữa khung (vòng chấm hình ảnh 2
      // ở c16)
      const cl = g.userData.clear;
      if (cl && cam) {
        const dd = d.position.distanceTo(cam.position);
        if (dd < cl.minD) d.scale.setScalar(lerp(1.1, .7, k) * Math.max(0, (dd - cl.minD * .55) / (cl.minD * .45)));
      }
    }
  };
  // đặt vùng trống trước ống kính (bán kính tính từ vị trí máy)
  g.setClear = minD => { g.userData.clear = minD ? { minD } : null; };
  // Xếp hạt **ngay lúc dựng**, không đợi khung hình nào gọi update(): nếu không,
  // tất cả hạt nằm chồng lên nhau ở gốc và vật đọc thành một vệt sáng trắng
  // trong bảng vật dựng — không phải "hạt phân tử bay tới và dính".
  g.update(0);
  return g;
}

// ── ion của muối ────────────────────────────────────────────────────────
// Cầu tím (Na⁺) và cầu xanh (Cl⁻), trôi lơ lổi; ion clorua nằm sâu hơn.
export function ions({ n = 16, s = .5, seed = 53, band = null } = {}) {
  const g = new THREE.Group();
  const r = mulberry(seed);
  const list = [];
  for (let i = 0; i < n; i++) {
    const cl = i % 2 === 0;
    const m = mesh(new THREE.SphereGeometry(.026, 14, 10),
      glowMat(cl ? '#67e8f9' : '#c08bff', .55), [0, 0, 0], { cast: false });
    fxLayer(m);
    // dấu điện tích: một vành nhỏ quanh cầu. Vành phải **nhìn thẳng vào
    // máy quay** và mảnh hơn cầu, nếu không nó đọc thành sợi dây (vòng chấm
    // hình ảnh 2: cầu ion dựng thành vòng mảnh dẹt, trông như sợi dây).
    const ring = mesh(new THREE.TorusGeometry(.030, .0026, 6, 18),
      glowMat(cl ? '#67e8f9' : '#c08bff', .38), [0, 0, 0], { cast: false });
    fxLayer(ring);
    g.add(m); g.add(ring);
    list.push({ m, ring, ph: r() * 6.28, sp: .2 + r() * .3, rad: .12 + r() * s * .5, y: band ? band[0] + r() * band[1] : .04 + r() * .3 });
  }
  g.update = (t, cam = null) => {
    for (const it of list) {
      const a = it.ph + t * it.sp;
      it.m.position.set(Math.cos(a) * it.rad, it.y + Math.sin(t * .5 + it.ph) * .03, Math.sin(a) * it.rad);
      it.ring.position.copy(it.m.position);
      // vành điện tích quay mặt về máy quay: nhìn nghiêng nó là một sợi dây
      if (cam) it.ring.lookAt(cam.position);
      // Vùng trống trước ống kính: một cầu ion chỉ cách máy vài centimet
      // biến thành một quả bóng khổng lồ ở giữa khung, che mất chủ thể
      // (vòng chấm hình ảnh 2 ở c12 và c16). Ion quá gần máy thì **không vẽ**.
      const cl = g.userData.clear;
      let vis = 1;
      if (cl && cam) {
        const d = it.m.position.distanceTo(cam.position);
        if (d < cl.minD) vis = Math.max(0, (d - cl.minD * .55) / (cl.minD * .45));
      }
      it.m.scale.setScalar(vis);
      it.ring.scale.setScalar(vis);
    }
  };
  // đặt vùng trống trước ống kính (bán kính tính từ vị trí máy)
  g.setClear = minD => { g.userData.clear = minD ? { minD } : null; };
  // Rải ion **ngay lúc dựng**: không có lệnh này thì mọi cầu nằm chồng lên
  // nhau ở gốc và vật đọc thành một quả cầu tím duy nhất — mất hẳn "cầu
  // xanh và cầu tím", đúng thứ mà bảng vật dựng phải cho thấy.
  g.update(0);
  return g;
}

// ── hạt muối rơi xuống vũng nước ────────────────────────────────────────
// Hạt muối rơi, chạm mặt nước rồi vỡ ra. dissolve(k): k = 0 là hạt nguyên, k = 1 là tan hết.
// Hạt muối phải **vỡ ra** trước khi mất hẳn: cơ chế "lấy nhiệt" ở c17 cần
// thấy hạt vỡ, chứ không phải một khối xám bốc hơi (vòng chấm hình ảnh 2).
export function saltGrain({ s = .03 } = {}) {
  const g = new THREE.Group();
  // hạt muối dưới nước phải **sáng**: nó ở rất gần mặt nước, nơi ánh sáng
  // yếu, và một khối xám xám thì không đọc ra là tinh thể muối (vòng chấm
  // hình ảnh 2 ở c17: hạt là một khối xám).
  const mat = toon('#ffffff', { map: saltTex(), emissive: '#bfe4f7', emissiveIntensity: .30 });
  const m = mesh(rbox(s, s, s, s * .2, 2), mat, [0, 0, 0]);
  g.add(m);
  const rs = mulberry(71);
  const shards = [];
  for (let i = 0; i < 4; i++) {
    const sh = mesh(rbox(s * .34, s * .30, s * .30, s * .10, 1), mat, [0, 0, 0]);
    g.add(sh);
    shards.push({ sh, dx: (rs() - .5) * 2, dy: (rs() - .5) * 2, dz: (rs() - .5) * 2, r: s * (.38 + rs() * .28) });
  }
  g.userData.grain = m;
  g.setFall = k => {
    const kk = clamp(k);
    m.position.y = lerp(.22, 0, ss(kk));
  };
  g.setDissolve = k => {
    const kk = clamp(k);
    // hạt **nứt** trước: các mảnh vỡ tách ra, rồi mới nhỏ dần và mất hẳn
    const cr = clamp((kk - .05) / .45);
    m.scale.setScalar(Math.max(.001, 1 - kk * .92));
    for (const s2 of shards) {
      const sc = Math.max(.001, 1 - Math.max(0, kk - .35) * 1.7);
      s2.sh.scale.setScalar(sc);
      s2.sh.position.set(s2.dx * s2.r * cr, s2.dy * s2.r * cr - .008 * cr, s2.dz * s2.r * cr);
      s2.sh.rotation.set(cr * 1.2, cr * .9, cr * .7);
    }
  };
  g.setDissolve(0);
  return g;
}

// ── dòng hạt muối rơi ───────────────────────────────────────────────────
// Muối rắc xuống đá phải là **tinh thể nhỏ** rơi thành dòng, không phải hạt
// bi tròn to (vòng chấm hình ảnh 2). Một InstancedMesh nhỏ, mỗi hạt là một
// tinh thể có cạnh.
export function saltFall({ n = 26, from = [0, .24, 0], to = [0, .17, 0], size = .005, spread = .04, seed = 83 } = {}) {
  const g = new THREE.Group();
  const rs = mulberry(seed);
  const geo = rbox(size, size * .9, size, size * .18, 1);
  const im = new THREE.InstancedMesh(geo, toon('#ffffff', { map: saltTex() }), n);
  im.frustumCulled = false;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s3 = new THREE.Vector3();
  const data = [];
  for (let i = 0; i < n; i++) {
    data.push({ ph: rs(), sp: .8 + rs() * .5, dx: (rs() - .5) * spread, dz: (rs() - .5) * spread, rx: rs() * 3, ry: rs() * 3 });
  }
  const A = new THREE.Vector3(...from), B = new THREE.Vector3(...to);
  g.update = (t, go = 1) => {
    const on = go > .5;
    im.visible = on;
    if (!on) return;
    for (let i = 0; i < n; i++) {
      const d = data[i];
      const u = ((t * d.sp + d.ph) % 1);
      v.lerpVectors(A, B, u);
      v.x += d.dx * (1 - u); v.z += d.dz * (1 - u);
      e.set(d.rx + u * 4, d.ry + u * 3, 0);
      q.setFromEuler(e);
      im.setMatrixAt(i, m4.compose(v, q, s3.set(1, 1, 1)));
    }
    im.instanceMatrix.needsUpdate = true;
  };
  g.update(0, 0);
  return g;
}

// ── một phân tử nước ────────────────────────────────────────────────────
// Phân tử nước là ba quả cầu: hai H và một O. Ở cận cảnh, một chấm tròn trắng
// không đọc ra là phân tử (vòng chấm hình ảnh 2).
export function molCluster({ r = .006 } = {}) {
  const g = new THREE.Group();
  const mat = glowMat('#eaf7ff', .7);
  g.add(mesh(new THREE.SphereGeometry(r * 1.35, 12, 10), mat, [0, 0, 0], { cast: false }));
  g.add(mesh(new THREE.SphereGeometry(r * .7, 10, 8), mat, [r * 2.1, r * .7, 0], { cast: false }));
  g.add(mesh(new THREE.SphereGeometry(r * .7, 10, 8), mat, [-r * 2.1, r * .7, 0], { cast: false }));
  fxLayer(g);
  return g;
}

// ── danh mục vật cho vòng chấm vật dựng ────────────────────────────────
// Tên là cách người ta gọi vật, để người chấm đoán xem có nhận ra không.
export const PROPS = {
  'viên đá trong suốt, cạnh đã nhuềm tròn, lớp nước bám ở đáy': () => iceCube({ s: .15, seed: 7 }),
  'viên đá đã tan một nửa, nhỏ hơn và thấp xuống': () => {
    const g = iceCube({ s: .15, seed: 7 }); g.setMelt(.5); return g;
  },
  'vũng nước nhỏ trên mặt bàn, trong và phẳng': () => { const g = puddle({ R: .16 }); g.setLevel(1); return g; },
  'khay inox sâu, bốn thành thấp': () => steelTray({ w: .78, d: .52, h: .055 }),
  'hộp muối nhạt dạng tô nông, trong đó có đống muối trắng': () => saltTin({ w: .17, d: .17, h: .07 }),
  'hộp muối đã cạn, đáy hộp lộ ra': () => { const g = saltTin({ w: .17, d: .17, h: .07 }); g.setUsed(1); return g; },
  'túi muối mềm, miệng kẹp lại, có miếng nhãn': () => saltBag({ w: .16, h: .2, d: .07 }),
  'hộp xốp giữ đá, bên trong đầy đá vỡ': () => iceBox({ w: .3, h: .19, d: .22, seed: 13 }),
  'chiếc búa sắt, cán gỗ, đầu búa có vết muối bám': () => hammer({ len: .3 }),
  'que nhiệt kế thủy tinh, cột thủy nghiện đỏ dưới vạch không độ': () => { const g = thermo({ h: .3 }); g.setTemp(-6.6); return g; },
  'que nhiệt kế thủy tinh, cột thủy nghiện đỏ nằm ngay dưới vạch không độ': () => { const g = thermo({ h: .3 }); g.setTemp(-1.5); return g; },
  'ly thuỷ tinh có nước trong': () => tumbler({ h: .16, r: .045 }),
  'que khuấy thủy tinh dài': () => stirRod({ len: .26 }),
  'bình thuỷ tinh có miệng và vạch chia, nước trong': () => beaker({ h: .2, r: .05 }),
  'bình thuỷ tinh đóng băng từ thành vào, lớp băng mờ dày lên': () => { const g = beaker({ h: .2, r: .05 }); g.setFreeze(.75); return g; },
  'bể đá muối: tô inox rộng đầy đá vỡ trộn muối': () => iceBath({ R: .26, h: .11, seed: 17 }),
  'bát toàn đá vỡ, muối trộn quanh túi': () => bowlOfIce({ R: .17, h: .09, seed: 29 }),
  'túi zip trong suốt, bên trong là sữa đặc, khóa zip ở miệng': () => zipBag({ w: .15, h: .2, d: .05 }),
  'mặt đá ở cấp nano, lưới phân tử xếp hàng': () => iceFace({ s: .5 }),
  'hạt phân tử nước bay tới và dính vào mặt đá': () => molecules({ n: 34, s: .5, seed: 41 }),
  'cầu ion xanh và cầu ion tím lơ lửng trong nước': () => ions({ n: 16, s: .5, seed: 53 }),
  'hạt muối trắng nhỏ, cạnh sắc': () => saltGrain({ s: .03 }),
  'tinh thể muối hai nước trong suốt, dạng lăng trụ và mảnh': () => hydrate({ n: 9, seed: 67 }),
  // ── thêm ở vòng 2, luôn nối vào CUỐI danh mục để số của vật cũ không dịch ──
  'vệt muối trắng nằm trên mặt viên đá, tan dần suốt phim': () => saltPatch({ w: .075, d: .062 }),
  'lớp băng mờ đục trên mặt viên đá đối chứng, mọc thành lưới tinh thể': () => frostPatch({ s: .085 }),
  'dòng nước nhỏ chảy xuống mép viên đá đang tan': () => meltStream({ len: .075 }),
  'vệt muối trong ly nước muối ở bếp, tan dần khi que khuấy quay': () => saltPatch({ w: .03, d: .03 }),
  'túi zip có sữa đã đông cứng, vỏ sương trắng phủ quanh túi': () => { const g = zipBag({ w: .15, h: .2, d: .05 }); g.setFrozen(1); return g; },
  // ── thêm ở vòng 3, luôn nối vào CUỐI danh mục để số của vật cũ không dịch ──
  'tô nông tròn, đựng đống muối trắng lấp khoảng hai phần ba mặt tô': () => saltDish({ R: .085, h: .038, seed: 9 }),
  'dòng hạt muối nhỏ rơi xuống, mỗi hạt là một tinh thể có cạnh': () => saltFall({ n: 26, from: [0, .24, 0], to: [0, .17, 0] }),
  'một phân tử nước: ba quả cầu nhỏ kề nhau': () => molCluster({ r: .006 }),
};

// ── vệt muối trên mặt đá ────────────────────────────────────────────────
// Một vệt muối trắng nằm trên mặt viên đá. setDissolve(k): k = 0 là vệt còn nguyên,
// k = 1 là vệt tan hết, chỉ còn mặt đá ướt.
//
// Vệt muối là **đám hạt rời rạc**, không phải một tấm: một tấm phẳng có cạnh
// thẳng và viền mực đọc ra là "vật liệu khác dán lên đá" (vòng chấm hình ảnh 2).
export function saltPatch({ w = .075, d = .062, n = 46, seed = 23 } = {}) {
  const g = new THREE.Group();
  const rs = mulberry(seed);
  const mat = toon('#ffffff', { map: saltTex(), transparent: true, opacity: 1 });
  const grains = [];
  for (let i = 0; i < n; i++) {
    // hạt phải **to đủ để thấy được màu trắng của muối**: một hạt 3 mm ở xa
    // chỉ còn là một chấm đen bị viền mực ăn hết, đọc ra là bẩn (vòng chấm
    // hình ảnh 2 ở c1: "vệt muối trên đá đọc ra là mấy chấm tối"). Kích
    // thước hạt đi theo kích thước vệt.
    const s = w * (.10 + rs() * .07);
    // hạt nằm thành đống thấp: càng gần giữa vệt càng chồng lên nhau
    const u = (rs() - .5) * 2, v = (rs() - .5) * 2;
    const x = u * w * .46, z = v * d * .46;
    const mound = (1 - Math.min(1, Math.hypot(u, v))) * s * 1.7;
    const m = mesh(rbox(s, s * .78, s, s * .16, 1), mat, [x, s * .39 + mound, z]);
    m.rotation.set((rs() - .5) * .7, rs() * 3, (rs() - .5) * .7);
    g.add(m);
    grains.push({ m, x, z, y: s * .39 + mound });
  }
  g.userData.grains = grains;
  g.setDissolve = k => {
    const kk = clamp(k);
    for (const gr of grains) {
      // hạt nhỏ dần và tản ra rồi mất hẳn — vệt tan chứ không co lại thành tấm
      const sc = Math.max(.001, 1 - kk * (1.25 + (gr.x + .04) * 2.5));
      gr.m.scale.setScalar(sc);
      gr.m.position.x = gr.x * (1 + .4 * kk);
      gr.m.position.z = gr.z * (1 + .4 * kk);
      gr.m.position.y = gr.y * sc;
    }
    mat.opacity = 1 - .82 * kk;
  };
  g.setDissolve(0);
  return g;
}

// ── lớp băng mờ đục trên mặt đá ─────────────────────────────────────────
// Giọt nước trên mặt đá đối chứng đóng băng thành lưới tinh thể mờ.
// setGrow(k): k = 0 là mặt đá trơn, k = 1 là lưới tinh thể đã phủ.
//
// Lớp băng là **những mảnh tinh thể nhỏ mọc lên**, không phải một ô lưới vuông
// có cạnh sắc áp lên đá (vòng chấm hình ảnh 2).
export function frostPatch({ s = .085, n = 30, seed = 19 } = {}) {
  const g = new THREE.Group();
  const rs = mulberry(seed);
  const mat = toon('#e8f7ff', { map: latticeTex(19), transparent: true, opacity: 1 });
  const chips = [];
  for (let i = 0; i < n; i++) {
    const a = rs() * 6.28, rad = Math.sqrt(rs()) * s * .42;
    const c = .006 + rs() * .008;
    const m = mesh(rbox(c, c * .5, c, c * .16, 1), mat,
      [Math.cos(a) * rad, c * .25, Math.sin(a) * rad]);
    m.rotation.set((rs() - .5) * .3, rs() * 3, (rs() - .5) * .3);
    g.add(m);
    chips.push({ m, c });
  }
  g.userData.frost = g;
  g.setGrow = k => {
    const kk = clamp(k);
    for (const ch of chips) {
      const sc = Math.max(.001, kk * (1.25 - .5 * (ch.c / .014)));
      ch.m.scale.setScalar(sc);
      ch.m.position.y = ch.c * .25 * sc;
    }
    mat.opacity = Math.min(1, .25 + .75 * kk);
  };
  g.setGrow(0);
  return g;
}

// ── nước mủng chảy xuống mép đá ─────────────────────────────────────────
// Nước mủng từ mặt đá chảy thành giọt rơi xuống vũng quanh chân đá.
// setFlow(k, t): k = 0 là khô, k = 1 là nước mủng đầy; t là thời điểm để
// giọt rơi.
//
// **Không dán một mảnh phẳng lên mặt đá.** Một mảnh rộng, viền sắc, bám
// mặt đá đọc ra là một tấm bìa dán (vòng chấm hình ảnh 2 ở c5), không phải
// nước. Giọt tròn, xanh, rơi từ trên xuống thì đọc ra là nước ngay.
export function meltStream({ len = .15 } = {}) {
  const g = new THREE.Group();
  const drops = [];
  for (let i = 0; i < 2; i++) {
    const d = mesh(new THREE.SphereGeometry(.007 - i * .0015, 14, 10), toon(i ? '#7fc6ea' : '#9fdcf5'), [0, 0, 0]);
    d.scale.set(1, 1.35, 1);
    g.add(d); drops.push(d);
  }
  g.setFlow = (k, t = 0) => {
    const kk = clamp(k);
    g.visible = kk > .05;
    if (!g.visible) return;
    drops.forEach((d, i) => {
      const p = ((t * .42 + i * .5) % 1 + 1) % 1;
      // rơi nhanh dần; ở cuối hành trình thì giọt tan vào vũng
      const f = p < .88 ? (p / .88) ** 1.8 : 1;
      d.position.set(0, -len * f, 0);
      const gone = p > .9;
      d.scale.set(gone ? 0 : 1, gone ? 0 : 1.35, gone ? 0 : 1);
      d.visible = !gone;
    });
  };
  g.setFlow(0);
  return g;
}

// ── lớp nước phủ trên mặt đá (cỡ nano) ──────────────────────────────────
// Khối nước trong suốt nằm trên mặt tinh thể. setThin(k): k = 0 là lớp nước dày,
// k = 1 là lớp nước mỏng đi — đó là kết quả nhìn thấy được của cơ chế.
export function waterBody({ w = 1.3, h = .22 } = {}) {
  const g = new THREE.Group();
  const m = mesh(rbox(w, h, w, .01), toon('#a9dcff', { transparent: true, opacity: .5 }), [0, h / 2, 0]);
  g.add(m);
  g.userData.body = m;
  g.setThin = k => {
    const kk = clamp(k);
    m.scale.y = Math.max(.04, 1 - .72 * kk);
    m.position.y = h * m.scale.y / 2;
    m.material.opacity = Math.max(.22, .5 - .2 * kk);
  };
  g.setThin(0);
  return g;
}

// ── tinh thể muối hai nước ──────────────────────────────────────────────
// Tinh thể trong suốt dạng lăng trụ và mảnh, mọc ở đáy và thành bình.
export function hydrate({ n = 9, seed = 67 } = {}) {
  const g = new THREE.Group();
  const r = mulberry(seed);
  const crys = [];
  for (let i = 0; i < n; i++) {
    const w = .010 + r() * .008, h = .03 + r() * .05;
    // Tinh thể phải **lăng trụ trong suốt**, không phải khối trắng cháy sáng:
    // độ sáng của nó hạ xuống để đá vỡ phía sau không nuốt mất hình dạng
    // (vòng chấm hình ảnh 2).
    const m = mesh(new THREE.CylinderGeometry(w * .35, w, h, 6), glowMat('#dcefff', .55), [0, 0, 0], { cast: false });
    fxLayer(m);
    m.position.set((r() - .5) * .07, h / 2 + r() * .01, (r() - .5) * .07);
    m.rotation.set((r() - .5) * .5, r() * 3, (r() - .5) * .5);
    g.add(m); crys.push({ m, h });
  }
  g.setGrow = k => {
    const kk = clamp(k);
    for (const c of crys) {
      c.m.scale.set(Math.max(.001, kk), Math.max(.001, kk), Math.max(.001, kk));
      c.m.visible = kk > .05;
    }
  };
  g.setGrow(0);
  return g;
}
