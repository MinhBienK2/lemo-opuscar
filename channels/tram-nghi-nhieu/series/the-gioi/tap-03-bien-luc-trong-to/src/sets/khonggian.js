// N4 · từ không gian, quanh Trái Đất
//
// Bối cảnh này kể một câu chuyện nhỏ: Mặt Trời vừa lặn, thế giới không tắt
// ngay — còn một dải xanh quanh chân trời, dải xanh của lớp ozon mỏng.
// Mọi thứ ở đây phải đọc được bằng mắt:
//   · Trái Đất là một hình cầu có lục địa, có ranh giới ngày/đêm rõ, mặt đêm
//     có đèn thành phố.
//   · Vùng sáng là một DẢI mỏng chạy vòng quanh chân trời, không phải một vỏ
//     tím phủ cả quả cầu.
//   · Chùm sáng là một THÂN sáng có hình, đi từ phía Mặt Trời tới Trái Đất;
//     tới lớp ozon thì phần đỏ bị nuốt, chỉ màu xanh lọt qua rơi xuống mặt
//     đêm.
import * as THREE from 'three';
import { PAL, toon, canvasTex, TEX, rbox, mesh, fxLayer, mulberry, clamp, lerp } from '../../../../../rig/kit.js';
import { keyLight, ambience } from '../../../../../rig/lights.js';
import { flow, glowDots, halos, setDot, setHalo } from '../../../../../rig/fx.js';
import { V3, skyTexture, beamSlices, waveRibbon, ruler } from './common.js';

// ── bản đồ thế giới: lưới 60×30 ô, mỗi ô 6°×6° ───────────────────────────
// Toạ độ mỗi hình chữ nhật: [kinh độ Tây, kinh độ Đông, vĩ độ Nam, vĩ độ Bắc]
const LAND = [
  [-168, -141, 55, 71],   // Alaska
  [-136, -60, 50, 70],    // Canada
  [-125, -66, 30, 50],    // Hoa Kỳ + nam Canada
  [-120, -58, 70, 83],    // quần đảo Bắc Cực Canada
  [-58, -19, 60, 83],     // Greenland
  [-118, -96, 17, 30],    // Mexico
  [-92, -77, 7, 18],      // Trung Mỹ
  [-81, -34, -55, 12],    // Nam Mỹ
  [-85, -66, 11, 23],     // Caribbean
  [-17, 34, 12, 37],      // Bắc Phi
  [8, 52, -35, 12],       // Nam Phi
  [43, 50, -25, -12],     // Madagascar
  [-10, 40, 36, 58],      // Nam Âu
  [5, 32, 55, 71],        // Scandinavia
  [-8, 2, 50, 59],        // Anh
  [-24, -13, 63, 67],     // Iceland
  [34, 61, 12, 37],       // Trung Đông, Arabia
  [29, 60, 50, 70],       // Nga tây
  [60, 146, 50, 72],      // Siberia
  [68, 90, 8, 30],        // Ấn Độ
  [75, 135, 22, 46],      // Trung Hoa
  [95, 125, 5, 22],       // Đông Nam Á
  [130, 146, 31, 45],     // Nhật
  [95, 141, -10, 5],      // Indonesia
  [130, 150, -10, -2],    // New Guinea
  [113, 153, -39, -11],   // Australia
  [166, 178, -47, -34],   // New Zealand
  [10, 32, 76, 80],       // Svalbard
  [60, 140, 72, 80],      // Siberia Bắc Cực
  [-180, 180, -90, -63],  // Nam Cực
  [-156, -154, 18, 22],   // Hawaii
  [43, 51, -12, -2],      // Madagascar (bổ)
  [-20, 12, 34, 43],      // Bắc Phi (bổ)
];

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const h2 = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
function vnoise2(x, y) {
  const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = h2(i, j), b = h2(i + 1, j), c = h2(i, j + 1), d = h2(i + 1, j + 1);
  const t = a + (b - a) * u;
  return t + ((c + (d - c) * u) - t) * v;
}
// vùng sa mạc: Sahara, Arabia, Australia, Trung Á.
// Mặt nạ MỀM (0..1), không phải hình chữ nhật đặc: cắt thẳng theo khung
// lon/lat thì trên quả cầu thành một mảng cát vuông — đúng thứ người xem
// gọi là "hình chữ nhật". Mép vùng này phải nhạt dần, rồi gợn nữa.
function desertAt(lon, lat) {
  const soft = 6.5;
  const box = (lo0, lo1, la0, la1, k) => {
    const dx = Math.max(lo0 - lon, lon - lo1, 0);
    const dy = Math.max(la0 - lat, lat - la1, 0);
    return clamp(1 - Math.hypot(dx, dy) / soft, 0, 1) * k;
  };
  let v = 0;
  v = Math.max(v, box(-18, 36, 14, 33, 1));
  v = Math.max(v, box(34, 60, 14, 33, 1));
  v = Math.max(v, box(112, 152, -34, -18, 1));
  v = Math.max(v, box(52, 96, 35, 47, .8));
  return v;
}

// Hai tấm bản đồ: ban ngày (lục địa + biển + mây) và ban đêm (đèn thành phố).
function earthMaps() {
  const W = 2048, H = 1024;
  // trường đất: vẽ lưới 60×30 rồi nội suy mượt để bờ biển có hình
  const m = document.createElement('canvas'); m.width = 60; m.height = 30;
  const mg = m.getContext('2d');
  mg.fillStyle = '#000'; mg.fillRect(0, 0, 60, 30); mg.fillStyle = '#fff';
  for (const [lo0, lo1, la0, la1] of LAND) {
    const c0 = clamp(Math.floor((lo0 + 180) / 6), 0, 59), c1 = clamp(Math.ceil((lo1 + 180) / 6), 1, 60);
    const r0 = clamp(Math.floor((90 - la1) / 6), 0, 29), r1 = clamp(Math.ceil((90 - la0) / 6), 1, 30);
    mg.fillRect(c0, r0, Math.max(1, c1 - c0), Math.max(1, r1 - r0));
  }
  // Trường đất: nội suy song tuyến TỰ TÍNH. (Không dùng drawImage phóng lớn:
  // bộ lọc mượt của trình duyệt tạo vân ringing, sinh ra mảng sáng lạ trên
  // biển.) Ô ngoài lề tính bằng cách kẹp về trong.
  const grid = new Float32Array(60 * 30);
  {
    const gd = mg.getImageData(0, 0, 60, 30).data;
    for (let i = 0; i < 60 * 30; i++) grid[i] = gd[i * 4] / 255;
  }
  const fieldAt = (x, y) => {
    const fx = x / W * 60 - .5, fy = y / H * 30 - .5;
    const i = Math.floor(fx), j = Math.floor(fy);
    const tx = fx - i, ty = fy - j;
    const g = (a, b) => grid[clamp(b, 0, 29) * 60 + clamp(a, 0, 59)];
    const a = g(i, j), b = g(i + 1, j), c = g(i, j + 1), d = g(i + 1, j + 1);
    // Nội suy MƯỢT (smoothstep): nội suy tuyến tính trên lưới 60×30 để lại
    // nếp gấp ở từng đường lưới, đọc ra như một ô vuông trên mặt biển.
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    const u = a + (b - a) * sx;
    return u + ((c + (d - c) * sx) - u) * sy;
  };

  const OCEAN = hex('#1b4a86'), SHELF = hex('#2f6ea8'), COAST = hex('#357f52');
  const GREEN = hex('#4a8c52'), GREEN2 = hex('#5b9c56'), JUNGLE = hex('#35743f');
  const DESERT = hex('#d0aa66'), TUNDRA = hex('#8b9174'), ICE = hex('#d7e2ee');

  const land = new Uint8Array(W * H);
  const day = canvasTex(W, H, (g) => {
    const img = g.createImageData(W, H), d = img.data;
    for (let y = 0; y < H; y++) {
      const lat = 90 - (y + .5) / H * 180;
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        const v = fieldAt(x, y);
        // bờ khói gợn sóng: ngẫu nhiên có seed, cắt mềm
        const n = vnoise2(x / 22, y / 22) * .60 + vnoise2(x / 8, y / 8) * .28 + vnoise2(x / 2.6, y / 2.6) * .12;
        // nhiễu chỉ mạnh ở bờ: bờ biển gợn sóng, mà lục địa và biển vẫn gọn
        const edge = Math.exp(-Math.pow((v - .5) * 3.0, 2));
        const s = v + (n - .5) * .95 * edge;
        const lon = -180 + (x + .5) / W * 360;
        // Mép sa mạc phải gợn như vẽ tay: nếu lấy thẳng từ hình chữ nhật
        // (Sahara, Arabia…) thì trên quả cầu nó thành một mảng cát vuông.
        const w1 = vnoise2(x / 46 + 11.3, y / 46 + 5.1) - .5;
        const w2 = vnoise2(x / 17 - 3.7, y / 17 + 8.4) - .5;
        const des = desertAt(lon + w1 * 26, lat + w2 * 18);
        let col;
        if (s > .50) {
          land[i] = 1;
          // ranh giới các vùng phải gợn, không cắt ngang thẳng hàng
          const ice = 71 + (n - .5) * 11, tun = 54 + (n - .5) * 9;
          if (lat > ice || lat < -62 + (n - .5) * 9) col = ICE;
          else if (lat > tun) col = TUNDRA;
          else if (lat < 16) col = (n > .5 ? GREEN2 : JUNGLE);
          else col = (n > .52 ? GREEN2 : GREEN);
          // sa mạc TRỘN MỀM vào màu đất: mép vùng phai dần, có gợn nữa
          const dm = clamp((des - .28) / .46, 0, 1) * (.72 + .28 * n);
          if (dm > .01) col = [col[0] + (DESERT[0] - col[0]) * dm,
            col[1] + (DESERT[1] - col[1]) * dm,
            col[2] + (DESERT[2] - col[2]) * dm];
          // viền bờ hơi sẫm hơn
          if (s < .58) col = COAST;
        } else {
          // Vùng biển nông: lấy theo trường ĐÃ gợn sóng rồi trộn dần sang màu
          // biển sâu. Nếu cắt ở ngưỡng cứng của lưới 60×30 thì bờ biển và
          // mảng cát thành những ô vuông.
          const t = clamp((s - .12) / .18, 0, 1);
          col = [OCEAN[0] + (SHELF[0] - OCEAN[0]) * t,
            OCEAN[1] + (SHELF[1] - OCEAN[1]) * t,
            OCEAN[2] + (SHELF[2] - OCEAN[2]) * t];
        }
        d[i * 4] = col[0]; d[i * 4 + 1] = col[1]; d[i * 4 + 2] = col[2]; d[i * 4 + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    // mây: vài mảng mỏng, không che lục địa
    // Mỗi đám mây là NHIỀU vòng tròn mềm chồng lên nhau, không phải một hình
    // elip. Hình elip có đường viền thẳng, mà gradient của nó chưa tắt hẳn ở
    // hai đầu ngắn → mép thẳng cắt qua gradient → trên quả cầu thành một ô
    // bán trong suốt có cạnh thẳng, đọc ra là vật thể không có thật.
    const r = mulberry(29);
    for (let k = 0; k < 90; k++) {
      const x = r() * W, y = r() * H, s = 26 + r() * 90;
      const puffs = 3 + (r() * 3 | 0);
      for (let j = 0; j < puffs; j++) {
        const px = x + (r() - .5) * s * 1.15, py = y + (r() - .5) * s * .34;
        const rad = s * (.20 + r() * .22);
        const gr = g.createRadialGradient(px, py, 0, px, py, rad);
        gr.addColorStop(0, `rgba(255,255,255,${.10 + r() * .12})`);
        gr.addColorStop(.5, `rgba(255,255,255,${.05 + r() * .06})`);
        gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(px, py, rad, 0, 7); g.fill();
      }
    }
  });

  // đèn thành phố: các chấm sáng nhỏ, tụ lại thành cụm trên đất
  const night = canvasTex(W, H, (g) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    const r = mulberry(83);
    let placed = 0, guard = 0;
    while (placed < 130 && guard++ < 8000) {
      const x = Math.floor(r() * W), y = Math.floor(r() * H);
      if (!land[y * W + x]) continue;
      placed++;
      const hub = 1 + (r() * 3 | 0);
      for (let k = 0; k < hub; k++) {
        const px = x + (r() - .5) * 11, py = y + (r() - .5) * 7;
        const rad = 1.1 + r() * 1.7;
        const gr = g.createRadialGradient(px, py, 0, px, py, rad * 2.6);
        gr.addColorStop(0, 'rgba(255,236,180,.85)');
        gr.addColorStop(.30, 'rgba(255,206,120,.38)');
        gr.addColorStop(1, 'rgba(255,190,90,0)');
        g.fillStyle = gr; g.beginPath(); g.arc(px, py, rad * 2.6, 0, 7); g.fill();
      }
    }
  });
  // vài trăm chấm đèn thật, đặt trên đất để chúng đứng đúng chỗ
  const landPts = [];
  {
    const r = mulberry(211);
    let guard = 0;
    while (landPts.length < 150 && guard++ < 20000) {
      const x = Math.floor(r() * W), y = Math.floor(r() * H);
      if (!land[y * W + x]) continue;
      const U = (x + .5) / W, V = (y + .5) / H;
      const lat = (90 - V * 180) * Math.PI / 180, phi = U * Math.PI * 2;
      const cl = Math.cos(lat);
      landPts.push(V3(-Math.cos(phi) * cl, Math.sin(lat), Math.sin(phi) * cl));
    }
  }
  return { day, night, landPts };
}

// Một THÂN sáng: một dải mềm chạy dọc theo một đường thẳng, luôn quay mặt
// về máy nên thấy được từ mọi góc. Không phải các lát tròn rời rạc — một khối
// sáng liền, sáng ở giữa và mềm dần ở hai mép.
// Tia sáng được vẽ trên cả mặt Trái Đất (không có depth test): đó là cách
// vẽ đường đi của một tia, người xem phải thấy được chỗ tia bị bẻ.
function shaftBody(color) {
  const geo = new THREE.PlaneGeometry(1, 1, 1, 1);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uC: { value: new THREE.Color(color) }, uK: { value: 1 }, uA: { value: 0 },
      uSun: { value: new THREE.Vector3(-1, 0, 0) }, uCam: { value: new THREE.Vector3(0, 0, 6) },
      uDay: { value: 0 },
    },
    vertexShader: `varying vec2 vUv; varying vec3 vW;
      void main(){ vUv = uv; vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz;
        gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `varying vec2 vUv; varying vec3 vW;
      uniform vec3 uC, uSun, uCam; uniform float uK, uA, uDay;
      void main(){
        float w = abs(vUv.y*2.0 - 1.0);                 // 0 ở giữa, 1 ở mép
        // lõi + một vệt halo rộng: chùm sáng phải như sáng trong không khí,
        // không phải một sợi laser vẽ lên hành tinh.
        float a = exp(-2.6*w*w) * .45 + exp(-.85*w*w) * .55;
        // mép phải VỀ 0 ở cả bốn cạnh: còn dư chút alpha ở mép tấm phẳng thì
        // người xem thấy một hình chữ nhật sáng có cạnh cứng — đọc ra là một
        // tấm kính đặt trên mặt hành tinh, không phải luồng sáng.
        a *= (1.0 - smoothstep(.25, 1.0, w));
        a *= smoothstep(0.0, .14, vUv.x) * (1.0 - smoothstep(.86, 1.0, vUv.x));
        // Chùm đỏ không sơn màu lên mặt ngày: nếu tia từ máy tới chỗ này
        // cắt qua phần mặt Trái Đất đang có nắng, thân sáng phải mờ đi hẳn,
        // để lục địa vẫn là lục địa chứ không bị sơn cam lên.
        if (uDay > .5) {
          vec3 rd = normalize(vW - uCam);
          float bb = dot(rd, -uCam), cc = dot(uCam, uCam) - 1.0;
          float disc = bb*bb - cc;
          if (disc > 0.0) {
            float t = bb - sqrt(disc);          // gốc gần: tia cắt mặt cầu ở đâu
            float tf = length(vW - uCam);
            if (t > 0.0) {
              vec3 hit = uCam + rd*t;
              // chỗ dưới chùm sáng đang có nắng: mờ hẳn đi
              float lit = smoothstep(-.02, .26, dot(normalize(hit), uSun));
              // chỗ chùm sáng lọt ra sau mặt cầu: mờ dần theo độ sâu
              float pen = tf > t ? clamp((tf - t) / .30, 0.0, 1.0) : 0.0;
              a *= 1.0 - max(lit, pen);
            }
          }
        }
        gl_FragColor = vec4(uC * uK * a * uA, 1.0); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false,
    side: THREE.DoubleSide,
  });
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = 12; fxLayer(m);
  return m;
}

// Vùng sáng xanh KHÔNG dựng bằng một dải hình học: nó được vẽ thẳng lên
// mặt cầu trong earthMat (mảng xanh mềm), nên không có mép cứng nào. Các
// hạt sáng nhỏ rải quanh vùng sáng cho vệt sáng có hạt, như một luồng sáng
// thật chứ không phải một mảng màu trơn.

// ── N4 · từ không gian, quanh Trái Đất ───────────────────────────────────
export function buildKhongGian() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#04050c');
  scene.fog = new THREE.Fog('#06060f', 26, 90);

  // ── sao: các điểm sáng nhỏ rời nhau, không phải mảng trắng ─────────────
  // Nhiều sao nhưng nhỏ: một góc ống kính hẹp chỉ thấy vài chục điểm.
  const NST = 2600;
  const stars = glowDots(NST, .026, '#dfe8ff', 1.0);
  stars.material.fog = false;
  const rnd = mulberry(41);
  const sp = [];
  for (let i = 0; i < NST; i++) {
    const a = rnd() * Math.PI * 2, b = Math.acos(rnd() * 2 - 1), r = 22 + rnd() * 26;
    sp.push(V3(Math.sin(b) * Math.cos(a) * r, Math.cos(b) * r, Math.sin(b) * Math.sin(a) * r));
  }
  stars.count = NST; scene.add(stars);

  // ── Trái Đất: quả cầu có lục địa, có ngày/đêm, có đèn thành phố ────────
  const maps = earthMaps();
  const SUN = V3(-.8055, .4941, .3271).normalize();      // hướng tới Mặt Trời
  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      uDay: { value: maps.day }, uNight: { value: maps.night },
      uSun: { value: SUN.clone() }, uCam: { value: V3(0, 0, 6) },
      uOzone: { value: .5 }, uLights: { value: 1.0 },
      uBlueK: { value: 0 }, uBlueT: { value: V3(1, 0, 0) },
    },
    vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vW;
      void main(){ vUv = uv; vN = normalize(mat3(modelMatrix)*normal);
        vW = (modelMatrix*vec4(position,1.)).xyz;
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vW;
      uniform sampler2D uDay, uNight; uniform vec3 uSun, uCam, uBlueT;
      uniform float uOzone, uLights, uBlueK;
      // nhiễu mềm ba chiều: vùng sáng phải có HẠT, một mảng màu trơn thì
      // đọc ra là một vệt sơn, không phải ánh sáng nằm trong không khí.
      float h31(vec3 p){ p = fract(p*0.3183099 + vec3(.11,.17,.13)); p *= 17.0;
        return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
      float vn3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f);
        return mix(mix(mix(h31(i), h31(i+vec3(1,0,0)), f.x),
                       mix(h31(i+vec3(0,1,0)), h31(i+vec3(1,1,0)), f.x), f.y),
                   mix(mix(h31(i+vec3(0,0,1)), h31(i+vec3(1,0,1)), f.x),
                       mix(h31(i+vec3(0,1,1)), h31(i+vec3(1,1,1)), f.x), f.y), f.z); }
      void main(){
        vec3 N = normalize(vN);
        vec3 V = normalize(uCam - vW);
        float nl = dot(N, uSun);                       // >0: phía ban ngày
        float day = smoothstep(-.030, .028, nl);       // ranh giới ngày/đêm
        vec3 tex = texture2D(uDay, vUv).rgb;
        vec3 lamp = texture2D(uNight, vUv).rgb;
        // Sáng có bậc như tranh toon, nhưng bậc phải MỜ. Bậc cắt cứng trên
        // mặt đại dương (màu phẳng) đọc ra là đường nối facet của lưới cầu,
        // không phải một bước sáng.
        float d = max(nl, 0.0);
        float b = .46 + .24 * smoothstep(.07, .15, d) + .30 * smoothstep(.28, .40, d);
        vec3 dayCol = tex * (.42 + .72*b) * vec3(1.10,.98,.84);
        // mặt đêm: nền xanh navy, đèn thành phố là các chấm nhỏ
        vec3 nightCol = vec3(.022,.032,.068) + lamp*uLights*(1.0-day);
        // hoàng hôn: một dải cam MỎNG ngay sát ranh giới, ở phía ban ngày.
        // Nó phải mảnh và dịu: rộng và đậm thì đọc ra là một sợi cam vẽ
        // ngang mặt Trái Đất, không phải lúc trời lụm.
        float ss = exp(-pow((nl - .045)/.032, 2.0));
        vec3 sunset = vec3(.38,.14,.04) * ss * (.22 + .55*day);
        // dải xanh tím của ozon: bên kia ranh giới, nơi ánh sáng đã lặn
        float tw = exp(-pow((nl + .055)/.065, 2.0)) * (1.0 - day);
        vec3 twilight = vec3(.30,.24,.92) * tw * uOzone * .28;
        // VÙNG SÁNG XANH rơi xuống mặt đêm: một DẢI MỜ ôm lấy ranh giới
        // ngày/đêm, lệch sang phía mặt đêm — ánh sáng xanh lọt qua lớp mỏng
        // rơi xuống đó. Vẽ thẳng lên mặt cầu nên nó cong theo hành tinh và
        // không có mép cứng nào; dựng bằng một tấm phẳng sáng thì đọc ra là
        // một tấm kính đặt trên hành tinh.
        float cNight = -dot(N, uSun);                  // 0 ở ranh giới, dương vào mặt đêm
        float along = dot(N, uBlueT);                  // dọc theo chân trời
        float pool = exp(-pow((cNight - .22)/.19, 2.0))
                   * (.25 + .75 * exp(-pow(along/.70, 2.0)))
                   * (.62 + .76 * vn3(vW * 6.0));
        vec3 bluePool = vec3(.20,.56,1.0) * pool * uBlueK * .58;
        vec3 col = mix(nightCol, dayCol, day) + sunset + twilight + bluePool;
        // viền xanh mỏng nơi khí quyển nhìn nghiêng
        float fres = pow(1.0 - abs(dot(N,V)), 6.0);
        col += vec3(.20,.44,1.0) * fres * (.22 + .78*day) * .85;
        // NẾT MỰC Ở MÉP HÀNH TINH: quả cầu không có nét viền thì trông như
        // một quả bóng trôi trong nền đen, mất hẳn nét của tranh toon.
        float limb = smoothstep(.88, 1.0, 1.0 - abs(dot(N,V)));
        col = mix(col, vec3(.020,.022,.045), limb * .88);
        gl_FragColor = vec4(col, 1.0); }`,
  });
  // Cầu phải mịn: lưới 72×48 để lại các nẻ mặt thẳng, đọc ra như đường
  // nối facet trên mặt đại dương. Lưới dày hơn thì nét mực ở mỗi nẻ quá
  // mỏng để thấy, và mặt cầu trông trơn.
  const earth = mesh(new THREE.SphereGeometry(1, 128, 80), earthMat, [0, 0, 0], { cast: false, recv: false });
  scene.add(earth);

  // ── đèn thành phố: chấm sáng nhỏ trên mặt đêm ──────────────────────────
  const cityPts = maps.landPts;
  const city = glowDots(cityPts.length, .0072, '#ffd79a', 1.0);
  city.material.fog = false;
  city.count = cityPts.length;
  scene.add(city);

  // ── lớp khí quyển và lớp ozon: hai QUẦNG sáng mềm quanh hành tinh ───
  // Không dùng vỏ cầu fresnel: fresnel sáng đúng ở mép cầu, nên đọc ra là một
  // sợi tròn sáng — vành của một vật khác — chứ không phải một lớp khí quấn
  // quanh. Ở đây dùng một đĩa vuông góc với trục nhìn: sáng dày dần từ
  // trong ra, đỉnh ở ngay ngoài mép hành tinh rồi tắt dần ra ngoài.
  const corona = (color, rIn, rPeak, rOuter, k, extra) => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uC: { value: new THREE.Color(color) }, uK: { value: k },
        uSun: { value: SUN.clone() }, uOzone: { value: .5 },
        uIn: { value: rIn }, uPeak: { value: rPeak }, uOut: { value: rOuter },
      },
      vertexShader: `varying vec2 vP; varying vec3 vW;
        void main(){ vP = position.xy; vec4 w = modelMatrix*vec4(position,1.); vW = w.xyz;
          gl_Position = projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `varying vec2 vP; varying vec3 vW;
        uniform vec3 uC, uSun; uniform float uK, uOzone, uIn, uPeak, uOut;
        void main(){
          float r = length(vP);
          float a = smoothstep(uIn, uPeak, r) * (1.0 - smoothstep(uPeak, uOut, r));
          if (a < .004) discard;
          vec3 dir = normalize(vW);
          float nl = dot(dir, uSun);
          ${extra}
          gl_FragColor = vec4(uC * uK * a, 1.0); }`,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      side: THREE.DoubleSide, fog: false,
    });
    const m = new THREE.Mesh(new THREE.CircleGeometry(rOuter, 96), mat);
    m.frustumCulled = false; m.renderOrder = 9;
    fxLayer(m);
    return m;
  };
  // Lớp khí quyển: xanh, dày, sáng ở phía ban ngày.
  // Quầng sáng phải HẸP: một quầng rộng lan ra khắp khung thì hành tinh
  // trôi trong một vùng sương tím, mất cả nền đêm lẫn ranh giới của lớp khí.
  const atmo = corona('#4a86ff', 1.00, 1.030, 1.17, 1.0,
    'float dayF = smoothstep(-.45,.25,nl); a *= (.14 + .90*dayF);');
  scene.add(atmo);

  // ── lớp ozon: mỏng hơn, cao hơn, tím, và chỉ sáng mạnh ở vùng lặn ────
  // Lớp ozon: tím, mỏng hơn lớp khí quyển, nằm ngoài nó, sáng mạnh hơn ở
  // vùng lặn. Giữ nó mờ: một vòng tím đậm quanh hành tinh sẽ thắng chủ đề
  // của đoạn này, vốn là VÙNG SÁNG.
  const ozone = corona('#8f74e0', 1.025, 1.065, 1.28, 1.0,
    'float tw = exp(-pow((nl + .02)/.26, 2.0)); a *= (.16 + .95*tw*uOzone);');
  scene.add(ozone);

  // KHÔNG vẽ dải ozon ở xích đạo. Lớp ozon là một LỚP quanh cả hành
  // tinh; vẽ thêm một dải tím ở xích đạo thì nó cắt ngang lục địa và đọc
  // ra là một mảnh băng dán trên mặt Trái Đất. Phần "lớp mỏng màu tím"
  // của câu kể do vỏ ozon và vùng sáng đảm nhiệm.

  // ── vùng sáng: một DẢI hẹp chạy vòng quanh chân trời, nằm ngay trên
  //    mặt quả cầu. Nó hẹp dần khi Mặt Trời lặn sâu hơn. ──────────────────
  const bandMat = new THREE.ShaderMaterial({
    uniforms: {
      uC: { value: new THREE.Color('#6f7dff') }, uK: { value: 1 }, uSun: { value: SUN.clone() },
      uW: { value: .20 }, uOzone: { value: .5 }, uOff: { value: 0 },
    },
    vertexShader: `varying vec3 vN;
      void main(){ vN = normalize(mat3(modelMatrix)*normal);
        gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec3 vN; uniform vec3 uC, uSun; uniform float uK, uW, uOzone, uOff;
      void main(){
        float nl = dot(normalize(vN), uSun) - uOff;
        // vùng sáng nằm ở BÊN KIA ranh giới ngày/đêm, nơi Mặt Trời đã lặn.
        // Mép phía ban ngày phải SẮC: một vệt loang không có mép thì mắt
        // không có chỗ bám, và câu kể về vùng sáng mất đi chỗ.
        float a = exp(-pow((nl + uW*.55)/uW, 2.0)) * (1.0 - smoothstep(0.0, uW*.55, nl));
        gl_FragColor = vec4(uC*uK*a*(.35 + .95*uOzone), 1.0); }`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide, fog: false,
  });
  const band = mesh(new THREE.SphereGeometry(1.004, 72, 48), bandMat, [0, 0, 0], { cast: false, recv: false });
  fxLayer(band); scene.add(band);

  // ── chùm sáng: đi từ phía Mặt Trời tới Trái Đất ───────────────────────
  // Thân sáng chạy trên đường tiếp tuyến với Trái Đất, tại điểm cuối của
  // ranh giới ngày/đêm: tia ở đó là ngang với mặt đất nên đi qua một đường
  // khí quyển rất dài.
  const redShaft = shaftBody('#ff5a24');
  redShaft.material.uniforms.uDay.value = 1;
  scene.add(redShaft);

  // Hạt sáng nhỏ rải quanh vùng sáng xanh: vệt sáng phải có HẠT, không
  // phải một mảng màu trơn.
  // Bán kính hạt nằm ở đối số thứ hai của glowDots; setDot nhân thêm một
  // lần nữa, nên phải để hạt to (nếu không, hạt bé hơn một pixel và biến mất).
  const blueGrain = glowDots(90, .030, '#7fd8ff', 1.2);
  blueGrain.material.fog = false;
  scene.add(blueGrain);

  const key = keyLight(scene, { color: '#ffd9a8', intensity: 3.0, from: V3(SUN.x * 12, SUN.y * 12, SUN.z * 12), to: V3(0, 0, 0), size: 2.2, far: 30 });
  ambience(scene, { sky: '#3a4a86', ground: '#101830', fill: .30, rim: '#7fa8ff', rimI: .35, rimFrom: [3, -3, -3] });

  // người quan sát: máy đứng ở đâu thì chân trời ở đó. Một điểm cố định cho
  // cả đoạn, để Mặt Trời lặn đều theo thời gian chứ không nhảy theo máy.
  const OBS = V3(.48, .28, .79).normalize();

  const _f = V3(0, 0, 1), _q = new THREE.Quaternion(), _m4 = new THREE.Matrix4();
  const camQ = new THREE.Quaternion();
  const camPos = V3(0, 0, 6), camRight = V3(1, 0, 0), camFwd = V3(0, 0, -1), camNad = OBS.clone();
  const B0 = V3(0, 1, 0), e1 = SUN.clone();

  function readCamera() {
    const cam = (typeof window !== 'undefined' && window.__cam) || null;
    if (!cam) return;
    cam.updateMatrixWorld();
    const e = cam.matrixWorld.elements;
    camRight.set(e[0], e[1], e[2]).normalize();
    camFwd.set(-e[8], -e[9], -e[10]).normalize();
    camPos.copy(cam.position);
    camNad.copy(cam.position).normalize();
    camQ.copy(cam.quaternion);
  }

  return {
    scene, key, earth, atmo, ozone, band, redShaft, SUN,
    atmoAt: V3(-.70, .52, .44), ozoneAt: V3(-.80, .64, .54),
    update(t, s) {
      const dep = s && s.dep != null ? s.dep : .5;
      const redK = s && s.red != null ? s.red : 1;
      const blueK = s && s.blue != null ? s.blue : .5;

      // sao: các điểm nhỏ, đứng yên, lấp lói nhẹ
      for (let i = 0; i < sp.length; i++) {
        const tw = .85 + .15 * Math.sin(t * 1.7 + i * 2.3);
        setDot(stars, i, sp[i], (.55 + (i % 5) * .17) * tw);
      }
      stars.instanceMatrix.needsUpdate = true;

      // Trái Đất xoay chậm
      earth.rotation.y = t * .015;

      // Mặt Trời lặn: ở độ sâu `dep` (0 → vừa lặn, 1 → lặn sâu 6°)
      const alt = -dep * 6 * Math.PI / 180;
      const h = V3(-.8055, .4941, .3271).normalize();          // hướng ngang tới Mặt Trời
      e1.copy(h).multiplyScalar(Math.cos(alt)).addScaledVector(OBS, Math.sin(alt)).normalize();
      SUN.copy(e1);
      earthMat.uniforms.uSun.value.copy(e1);
      bandMat.uniforms.uSun.value.copy(e1);
      atmo.material.uniforms.uSun.value.copy(e1);
      ozone.material.uniforms.uSun.value.copy(e1);

      // mặt đêm: chấm đèn thành phố chỉ sáng ở bóng tối
      const rot = earth.rotation.y, cr = Math.cos(rot), sr = Math.sin(rot);
      for (let i = 0; i < cityPts.length; i++) {
        const d = cityPts[i];
        const wx = d.x * cr + d.z * sr, wz = -d.x * sr + d.z * cr;
        const lit = wx * e1.x + d.y * e1.y + wz * e1.z;
        const k = lit < -.015 ? (.6 + .4 * Math.sin(t * 2.1 + i)) * (1 - clamp((lit + .30) / .28)) : 0;
        if (k <= .01) { setDot(city, i, V3(0, 0, 0), 0); continue; }
        const p = V3(wx * 1.006, d.y * 1.006, wz * 1.006);
        setDot(city, i, p, k);
      }
      city.instanceMatrix.needsUpdate = true;

      // vùng sáng: dải hẹp quanh chân trời, hẹp dần khi Mặt Trời lặn sâu
      bandMat.uniforms.uW.value = lerp(.042, .016, dep);
      bandMat.uniforms.uK.value = .30 + .18 * (1 - dep);
      bandMat.uniforms.uOzone.value = .35 + .65 * (1 - .55 * dep);
      bandMat.uniforms.uOff.value = Math.sin((s && s.bandRot != null ? s.bandRot : 0)) * .12;

      // ánh sáng: viền khí quyển và lớp ozon
      const oz = .35 + .65 * (1 - .5 * dep);
      atmo.material.uniforms.uOzone.value = oz;
      ozone.material.uniforms.uOzone.value = oz;
      atmo.material.uniforms.uK.value = .85;
      ozone.material.uniforms.uK.value = .55;
      earthMat.uniforms.uOzone.value = oz;

      // ── chùm sáng ──────────────────────────────────────────────────────
      readCamera();
      earthMat.uniforms.uCam.value.copy(camPos);
      // Hai quầng sáng quay mặt về máy: quầng nằm trong mặt phẳng vuông góc
      // với trục nhìn, nên mép trong của nó trùng đúng mép hành tinh.
      _q.setFromUnitVectors(_f, camFwd.clone().negate());
      atmo.quaternion.copy(_q);
      ozone.quaternion.copy(_q);
      // Điểm cuối của ranh giới ngày/đêm gần máy nhất: nơi tia sáng ở ngang
      // với mặt đất, đi qua một đường khí quyển rất dài.
      B0.copy(camNad).addScaledVector(e1, -camNad.dot(e1));
      if (B0.lengthSq() < 1e-6) B0.set(0, 1, 0); else B0.normalize();
      // Chỗ lớp ozon mỏng ăn mất phần đỏ: ngay tại ranh giới ngày/đêm.
      const Z = B0.clone();
      // Tia xanh lọt qua, uốn xuống mặt đêm ngay bên kia ranh giới.
      const P = B0.clone().addScaledVector(e1, -.26).normalize();
      const redFrom = Z.clone().addScaledVector(e1, 2.2);     // phía Mặt Trời

      const place = (m, a, b, r) => {
        const dir = b.clone().sub(a), len = dir.length();
        dir.normalize();
        // Dải sáng luôn quay mặt về máy: trục dài là hướng của tia, trục rộng
        // là phương vuông góc với tia TRONG MẶT PHẲNG MÀN, nên mép tia luôn
        // mềm và rõ, không bao giờ biến thành một sợi mảnh.
        let ws = camFwd.clone().cross(dir);
        if (ws.lengthSq() < 1e-8) ws = camRight.clone().cross(dir);
        if (ws.lengthSq() < 1e-8) ws.set(0, 1, 0); else ws.normalize();
        const nrm = dir.clone().cross(ws).normalize();
        _m4.makeBasis(dir, ws, nrm);
        m.quaternion.setFromRotationMatrix(_m4);
        m.position.copy(a).addScaledVector(dir, len * .5);
        m.scale.set(len, r * 2, 1);
      };
      place(redShaft, redFrom, Z, .075);
      redShaft.material.uniforms.uA.value = redK * .58;
      redShaft.material.uniforms.uSun.value.copy(e1);
      redShaft.material.uniforms.uCam.value.copy(camPos);
      redShaft.visible = redK > .02;

      // Luồng xanh: vùng sáng VẼ THẲNG LÊN MẶT CẦU (trong earthMat), cộng
      // các hạt sáng nhỏ rải quanh vùng sáng cho vệt sáng có hạt.
      // Hai hướng ở chỗ ánh sáng xanh rơi xuống: một cái DỌC theo chân
      // trời, một cái XUYÊN vào mặt đêm. Chúng vuông góc nhau.
      const gSide = P.clone().cross(e1).normalize();     // dọc theo chân trời
      const gDeep = e1.clone().negate();                 // xuyên vào mặt đêm
      earthMat.uniforms.uBlueT.value.copy(gSide);
      earthMat.uniforms.uBlueK.value = blueK * 1.6;
      const gN = 90;
      blueGrain.count = gN;
      for (let i = 0; i < gN; i++) {
        // hạt rải trong một mảng dẹt ôm lấy vùng sáng
        const a = (i * 2.399) % (Math.PI * 2);            // quyền uẫn vàng
        const rr = Math.sqrt((i + .5) / gN) * .30;
        const gp = P.clone()
          .addScaledVector(gSide, Math.cos(a) * rr)
          .addScaledVector(gDeep, Math.sin(a) * rr * .45)
          .normalize().multiplyScalar(1.004);
        setDot(blueGrain, i, gp, (.05 + .09 * ((i * 5) % 7) / 7) * blueK);
      }
      blueGrain.instanceMatrix.needsUpdate = true;

      // Chỗ màu xanh rọi xuống mặt đêm chính là cuối dải cong kia, nằm sát
      // mặt cầu — không cần thêm một tấm sáng phẳng nữa: một tấm phẳng đặt
      // ở đó đọc ra là kính đặt lên hành tinh.
    },
  };
}
