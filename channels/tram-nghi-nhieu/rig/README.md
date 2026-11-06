# rig — API

three.js 0.170 qua importmap. `index.html` của tập cần:

```html
<link rel="stylesheet" href="../../../fonts/fonts.css">
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
<div id="stage"></div>
```

Mẫu dùng đầy đủ: `demo/main.js`, `demo/room.js`, `demo/macro.js`. Bắt đầu một tập từ `sets.js` (bên dưới), đừng từ một cái bàn trống.

## render.js

| | |
|---|---|
| `film({fov, near, far})` | → `{ renderer, camera, ov, frame, texts }`. Tạo một lần. |
| `frame(scene, {t, thick, ref, flash, fade, vig, overlay, key})` | Render một khung. `thick` 3–3.6 px; `ref` là khoảng cách nét chuẩn (toàn cảnh ≈ 2.5, cận ≈ .3); `flash` là `THREE.Color` cộng thêm khi chuyển cảnh; `overlay(g, t)` vẽ chữ 2D và trả về các hộp cho `window.TEXTS`; `key` là đèn chính, dùng cho `?lightcam`. |
| `label(g, text, x, y, t, t0, t1, {id})` | Thẻ thuật ngữ, có nảy vào và thu ra. Trả về hộp, hoặc null khi đang nảy. |
| `subtitle(g, text)` | Phụ đề khắc ở dải dưới (y ≥ 880). |
| `toScreen(vec3, camera)` | → `[x, y]` pixel. |
| `W`, `H`, `Q` | 1920, 1080, tham số URL. |

Hợp đồng trang: `window.TEXTS = t => { window.render(t); return F.texts(); }`.

Thứ tự vẽ: lớp đặc (layer 0) → nét mực → lớp fx (`fxLayer`, layer 1: khí, kính, quầng sáng) phủ lên sau, có so độ sâu với lớp đặc. Nhờ vậy cạnh nằm sau một làn khí chỉ hiện mờ qua làn khí, không thành một đường đen in trên nó. Vật nào trong suốt hay mềm (khói, hơi, kính) thì đưa vào `fxLayer`, đừng để ở layer 0.

## lights.js

| | |
|---|---|
| `keyLight(scene, {from, to, color, intensity, size})` | Đèn chính có hướng, shadow 4096. |
| `ambience(scene, {...})` | Hemi navy/tím mận và đèn viền tím. |
| `wallWithHole(scene, mat, {x0, x1, y0, y1})` | Tường ở z = 0 có lỗ, để đèn chính in hình lỗ vào phòng. |
| `beam(scene, light, {x0, x1, y0, y1})` | Vệt sáng cộng từ lỗ theo hướng đèn. |
| `pool(scene, {from, to, intensity, angle})` | Vùng sáng của một ngọn đèn (đèn bàn, đèn pin): spot viền mềm, có bóng. Dùng cho tiêu điểm khi đèn chính không chiếu tới, ví dụ mặt cắt. |
| `shadowFlags(scene)` | Bật cờ `?nocast=tag,tag` và `?cast=tag` (đặt `userData.tag` cho vật). |

## kit.js

- `PAL`; easing `clamp lerp seg ss eio eo ei back`; `keys([[t, [..]], …], ease)` cho keyframe (máy quay: `[x, y, z, lookX, lookY, lookZ]`); `mulberry(seed)`, `hash`, `vnoise`.
- `toon(color, {map, emissive, side…})`, `glowMat(color, k)` (HDR > 1 mới bloom).
- `canvasTex(w, h, draw, repeat)` để vẽ texture riêng; `TEX.floor/wood/wall/sheet/pillow/blanket/rug/screen/radial()` có sẵn.
- `rbox(w, h, d, r)`, `mesh(geo, mat, pos, {rot, cast, recv, parent})`, `fxLayer(obj)` (vật phát sáng: không vào lượt mực, không đổ bóng), `cushionGeo(L, T, D, lift)` (gối, túi, nệm), `surface(nu, nv, (u,v) => [x,y,z])` (vải rủ, địa hình).

## inside.js — vào bên trong vật mà không rời căn phòng

`tissue({ skin, skinTo, cell, cellTo, gates })`: một khối cắt dở đặt trên bàn của bối cảnh (ở `S.focus`), có lớp vỏ với các cửa mở được (thụ thể, lỗ, cổng) và mặt cắt xếp tế bào; mỗi tế bào đổi màu, phồng lên, và các hạt bên trong nhỏ dần (tinh bột → đường, nước → đá, thứ gì bị dùng hết). Mặt cắt có đèn riêng nên luôn sáng. Xem `demo/stills/inside.jpg` và `demo/sets/main.js` (`?inside=1`).
```js
const T = tissue({ skinTo: '#f7c62f' }); T.group.position.copy(S.focus); scene.add(T.group); T.group.updateMatrixWorld(true);
const G = flow(nguồn, T.gatePos(2), { size: .025 });            // khí đi vào đúng một cửa
// trong render(t):  k = T.cam(S.focus) → máy;  T.setGate(2, (t - tVào) / .5);
//   T.setCells(T.spread(xCửa, yTrên, t, tVào, .18));  T.setSkin((t - tVàng) / 2)
```
**Cắt theo tiết diện của chính vật đó**, không cắt thành hộp: `tissue({ section: 5, rad: .1, d: .16, gates: 3 })` là một khoanh chuối (ngũ giác bo góc), `section: 32` là khoanh tròn (táo, cà rốt, cuống, ống), `section: 6` là bút chì. Vỏ, tế bào, cửa và các hàm đều giữ nguyên. Đặt vật nguyên vẹn ngay cạnh khoanh trong cùng khung, để người xem thấy khoanh được cắt ra từ chính nó (`demo/stills/inside_banana.jpg`, `?inside=banana`). Một khối hộp chỉ dùng khi vật thật cũng là khối hộp (bánh mì, cục pin).

**Điểm yếu đã biết**: `tissue()` đứng riêng vẫn bị người xem không biết tên gọi là "khối vuông", kể cả khi đặt cạnh quả chuối. Chỉ dùng nó sau một khung đã cho thấy chính vật bị cắt, và chạy `review.sh --props` với cả hai.

**Thứ tự vào trong**: trước hết là chính vật thật bị cắt (người xem thấy vỏ, hình dáng và mặt cắt thật của nó: `banana({ cut })` bên dưới; vật khác thì cắt bằng `vessel()` hay dựng mặt cắt thật của nó), rồi mới tới tầng tế bào (`tissue`). `tissue` là cảnh cận đã phóng to: khung trước nó phải cho thấy nó nằm ở đâu trong vật thật. Chạy `review.sh --props` cho cả hai: người xem không biết tên phải gọi ra được vật.

Dùng nó cho mọi câu "bên trong": thấy được vỏ, mặt cắt và căn phòng phía sau trong cùng một khung. Mỗi câu một bước khác nhau (cửa mở → tế bào đầu tiên đổi → lan ra → vỏ đổi màu), không giữ một khung cho nhiều câu.

## fx.js

- **`flow(from, to, { color, size, lift })`**: tác nhân vô hình (khí, mùi, nhiệt, tín hiệu) thành một làn nhìn thấy ngay, đi theo đường cong từ vật nguồn và đổ vào vật nhận (xem `demo/stills/flow.jpg`). Dùng nó thay cho vài chấm sáng: chấm sáng đọc như ánh phản chiếu, không đọc như khí.
  ```js
  const G = flow(apple.position.clone().add(new THREE.Vector3(0, .1, 0)), bananaTop, {});  scene.add(G);
  // trong render(t): go keyframe theo chữ, 0 → 1 khi lời nói "bay sang"; tới 1 thì vật nhận bắt đầu đổi (banana.spots, màu)
  G.update(t, go);   G.head() // đầu làn, cho thẻ chữ hoặc máy đi theo;   G.amount(.3) // làn mỏng, "rất ít"
  ```
  Để vật nguồn, làn khí và vật nhận **cùng trong một khung** khi lời nói về đường đi của nó. Lời nói khí "không màu", "vô hình" thì làm làn mỏng và trong: `{ opacity: .2 }` và `G.amount(.5)`, để không đọc thành hơi nước. Mỗi búp khí tự mờ dần ra mép nên các búp hoà thành một làn liền; khi máy đứng gần, giảm `size` để làn không che kín khung.
- `glowDots(n, r, color, k)`, `halos(n, color, k, TEX.radial())`, `sparks(n, color, k)` là InstancedMesh; đặt bằng `setDot`, `setHalo(…, cam.quaternion)`, `setStreak(…, vel, len, w)`; nhớ đặt `.count` và `instanceMatrix.needsUpdate`.
- `squiggle(color, color2)`: gợn nhiệt; uniform `uHead uLen uCeil uAmp uFreq uPhase uWidth uAlpha`; vượt `uCeil` thì gập xuống.
- `speedTable(length, V)`: → `{total, sAt(age), tAt(s)}`; vật chạy trên đường với tốc độ theo vị trí (đám đông qua cửa hẹp, xe dồn ở nút cổ chai).
- `buildHand({skin, sleeve, size})`: bàn tay người cỡ thật so với trái cây của rig (dài ≈ .55), ngón ba đốt có khớp và móng, cổ tay áo; ngón dọc +x, lòng bàn tay hướng −y, cổ tay ở gốc. `hand.pose(curl, spread)`.
- `heatColor(h)`: cyan → cam → đỏ.

## sets.js — bối cảnh dựng sẵn

Một nơi chốn đã có tường, cửa sổ in bóng, đèn chiếu đúng chỗ, đồ đạc và vật sống. Ảnh: `demo/stills/set_*.jpg`; trang thử: `demo/sets/` (`?set=kitchen|desk|bathroom&time=…`, t 0 wide · 1 medium · 2 close · 3 low · 4 trời tối).

```js
import { kitchen } from '../../../rig/sets.js';
const S = kitchen(scene, { time: 'morning' });       // desk(scene, …), bathroom(scene, …)
hero.position.copy(S.focus);                          // mặt làm việc ở y = 0; vùng sáng nằm ở S.focus
const cam = keys([[0, S.cams.wide], [V.w('n2', 'táo'), S.cams.medium], [V.w('n3', 'khí'), S.cams.close]]);
// mỗi khung: S.update(t, { light: 1 }); F.frame(scene, { t, key: S.key, … })
```
- `time`: `morning | day | evening | night`: màu trời, màu đèn chính, mặt trời hay mặt trăng trong cửa sổ. Chọn theo lời.
- Trả về `{ key, amb, focus, cams: {wide, medium, close, low}, clear, update(t, {light}), window }`; `desk` có thêm `lamp` (đèn bàn, chỉnh `S.lamp.intensity`), `bathroom` có `lamp`, `basin`, `tap`, `tapMouth`, `kitchen` có `clock` (`S.clock.tick(t, giờ)`: quay nhanh để nói "vài ngày trôi qua").
- `S.cams.*` là `[x, y, z, nhìnX, nhìnY, nhìnZ]` dùng thẳng trong `keys()`; nhích lại cho hợp vật của mình. Đồ đạc chừa trống bán kính `S.clear` quanh `focus`.
- Đồ lẻ dùng riêng được: `clock() plant() kettle() mug() books() towel()`, `paintTex(màu)`, `tileTex(màu)`.

## props.js — đạo cụ đổi trạng thái

Để câu nói về một thay đổi có hình của chính thay đổi đó.
- `banana(opts)` → mesh có `ripen(base, t)`: vỏ xanh → vàng → lốm đốm nâu theo `base` (0, 1, 1.5); thêm `m.spots.push({ p, t0, speed, max })` để vỏ chín lan ra từ một điểm (chỗ khí chạm vào).
- `banana({ cut: .72 })`: quả chuối bị cắt ngang ở 72% chiều dài (cắt ngắn hơn thì khúc còn lại tròn như quả bầu), có mặt cắt thật (ruột kem, vòng dưới vỏ, lõi ba thuỳ có hạt li ti); `m.section = { center, normal, R }` để đặt máy hay cho khí chạm vào mặt cắt.
- `bunch({ n })` → `{ group, fruits, crown }`: một nải. `apple({ R, color: 'red' | 'green' })`: có `.R`, đặt ở `y = R * .92`. `bowl({ R })`, `plate({ R })`.

## cutaway.js — bên trong một vật

Máy đứng **ngoài** vật và nhìn vào chỗ bị cắt, vật lớn như một món đồ trên bàn. Đừng đưa máy vào trong vật để thấy hạt trôi trong khoảng không. Mẫu: `demo/cutaway/main.js`, ảnh `demo/stills/cutaway_*.jpg`.

- `vessel(profile, {thick, cut, shell, face, fill, liquid})` → `{group, rIn(y), rOut(y), mouth, bottom, level, cut}`: một vật tiện tròn (chai, cốc, lon, bóng đèn, ống) bị khoét một nêm `cut` rad về phía +z, có mặt cắt, chất lỏng trong và vệt bóng thuỷ tinh. Xoay `group` để nêm hướng về máy. `PROFILES.bottle/glass/can/bulb` là hình mẫu.
- `preset('bottle' | 'can' | 'bulb' | 'glass', { scale, fill, liquid, cut })`: vật thật bổ đôi, có chất liệu và bộ phận nhận ra được (chai thuỷ tinh có nắp; lon nhôm có nhãn, nắp lõm, khoen; bóng đèn kính trong có đuôi xoáy, trụ kính, dây đỡ, dây tóc `V.parts.filament`; cốc thuỷ tinh). Dùng nó thay `vessel()` trần, vì `vessel()` một màu xanh bị người xem gọi là ống nhựa hay chiếc lá.
- `dissolved(V, {amount: t => 0..1})`: chất đang tan, những chấm nhỏ trong chất lỏng.
- `fizz(V, {rate: t => 0..1})`: bọt sinh ra trên thành, bám lại và lớn lên, rồi bứt ra, nổi lên và vỡ ở mặt chất lỏng.
- `foam(V, {height: t => h})`: cột bọt leo lên cổ; quá miệng thì phồng thành vòm rồi tràn xuống mặt ngoài.
- Tất cả có `update(t)` và tính từ `t`, nên tua đến đâu cũng đúng. Nối các tham số với nguyên nhân: nắp bật thì `rate` tăng, `amount` giảm, `height` dâng.
- Ánh sáng: mặt cắt phải quay về phía đèn. Chiếu tiêu điểm bằng `pool` từ phía máy, chếch lên cao 30–60°. `keyLight` qua cửa sổ chỉ để tạo dáng cho căn phòng. Kiểm bằng `?lightcam=1`: từ đèn phải nhìn thấy mặt cắt.

## voice.js

`loadVoice(build)` với `build` từ `src/timeline.js` của tập → `{ L, w, end, ev, sub }`: `L[id].t0/t1` là lúc câu bắt đầu/kết thúc, `w(id, 'từ')` là lúc một từ được nói (để đặt nhịp hình đúng chữ), `end` là độ dài phim, `ev` là các sự kiện giọng cho `window.EV`, `sub(t)` là phụ đề lúc `t`.

```js
window.DUR = V.end;
window.EV = [...V.ev, { type: 'music', cue: 'A', t: 0 }, { type: 'amb', kind: 'night', t: 0, t1: 6 }, { type: 'whoosh', t: 8.0 }];
```
Tên foley hợp lệ: khoá của `FX` trong `mix.py` và `core/audio/foley.py`.

## Cờ chẩn đoán (thêm vào URL qua `still.mjs --q`)

`?ss=1` (render nhanh) · `?nobloom` · `?noink` · `?noshadow` · `?nokey` · `?lightcam` · `?nocast=tag` · `?cast=tag`.
Ví dụ: `node core/render/still.mjs <tập> 2 --q lightcam=1 --out /tmp/x`.
