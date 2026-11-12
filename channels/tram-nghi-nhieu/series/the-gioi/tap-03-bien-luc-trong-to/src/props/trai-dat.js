// Trái Đất: quả cầu có lục địa, có ranh giới ngày/đêm rõ, mặt đêm có đèn
// thành phố.
//
// Bản đồ được vẽ bằng canvas: trường đất nội suy mượt trên lưới 60×30 ô,
// rồi tô màu theo vĩ độ và nhiễu gợn sóng ở bờ biển. Mọi thứ phải đọc được
// bằng mắt: có lục địa, có biển, có băng ở hai cực, có sa mạc, và mặt đêm
// có những chấm đèn thành phố.
import * as THREE from 'three';
import { canvasTex, mesh, clamp, mulberry } from '../../../../../rig/kit.js';
import { glowDots } from '../../../../../rig/fx.js';

// hướng tới Mặt Trời (lúc Mặt Trời còn trên chân trời)
export const SUN_DIR = [-.8055, .4941, .3271];

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
  return t + ((c - (d - c) * u) - t) * v;
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
export function earthMaps() {
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
    return u + ((c - (d - c) * sx) - u) * sy;
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
        // nhiễu chỉ mạnh ở bờ: bờ biển gợn sóng, màu lục địa và biển vẫn gọn
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
            col[1] + (DESERT[1] - col[1]) * dm, col[2] + (DESERT[2] - col[2]) * dm];
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
      landPts.push(new THREE.Vector3(-Math.cos(phi) * cl, Math.sin(lat), Math.sin(phi) * cl));
    }
  }
  return { day, night, landPts };
}

export function traiDat(opts = {}) {
  const { camZ = 6, ozone = .5, lights = 1.0 } = opts;
  const g = new THREE.Group(); g.name = 'Trái Đất';

  const maps = earthMaps();
  const SUN = new THREE.Vector3(SUN_DIR[0], SUN_DIR[1], SUN_DIR[2]).normalize();
  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      uDay: { value: maps.day }, uNight: { value: maps.night },
      uSun: { value: SUN.clone() }, uCam: { value: new THREE.Vector3(0, 0, camZ) },
      uOzone: { value: ozone }, uLights: { value: lights },
      uBlueK: { value: 0 }, uBlueT: { value: new THREE.Vector3(1, 0, 0) },
    },
    vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vW;
      void main(){ vUv = uv; vN = normalize(mat3(modelMatrix)*normal);
        vW = (modelMatrix * vec4(position,1.)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
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
  g.add(earth);

  // ── đèn thành phố: chấm sáng nhỏ trên mặt đêm ──────────────────────────
  const cityPts = maps.landPts;
  const city = glowDots(cityPts.length, .0072, '#ffd79a', 1.0);
  city.material.fog = false;
  city.count = cityPts.length;
  g.add(city);

  g.userData.parts = { earth, earthMat, city, cityPts, maps };
  return g;
}

export const PROP = { name: 'Trái Đất', view: () => traiDat({ camZ: 4 }) };
