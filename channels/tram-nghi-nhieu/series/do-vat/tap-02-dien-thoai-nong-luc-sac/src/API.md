# API của tập 02 — hợp đồng giữa `props.js`, `set.js` và `film.js`

Tập: `channels/tram-nghi-nhieu/series/do-vat/tap-02-dien-thoai-nong-luc-sac`

**Quy ước:** một đơn vị = **một mét**. Mặt bàn ở `y = 0`. Máy quay luôn nhìn từ phía `+z`
(vật nào ở `z` lớn thì ở gần máy hơn). Vật dựng bằng `toon()` của `rig/kit.js`, có viền mực
(viền mực do `rig/render.js` vẽ, không tự vẽ lại).

**Đường dẫn import (tương đối, không copy rig):**

```js
import * as THREE from 'three';
import { toon, PAL, rbox, mesh, canvasTex, fxLayer, keys, lerp, clamp, seg, ss, back, eio } from '../../../../rig/kit.js';
import { keyLight, ambience, pool, wallWithHole } from '../../../../rig/lights.js';
import { sway, breathe, motor, actionAt, particleStream, createActionRunner } from '../../../../rig/motion.js';
import { flow, squiggle, glowDots, halos, sparks, buildHand, heatColor } from '../../../../rig/fx.js';
import { cable, chip, pcb, battery, spring, contacts, heatingPlate } from '../../../../rig/parts.js';
import { section } from '../../../../rig/section.js';
```

**Quy tắc số trên màn hình:** chỉ được vẽ **60 W** (nhãn củ sạc), **20 V** (mực silk cạnh cổng),
**4 V** (mực silk cạnh túi pin), **45 °C** (vạch đỏ trên **cảm biến nhiệt trong máy**). Không vẽ
con số nào khác.

---

## `src/props.js` — các vật

Mỗi hàm trả về `{ group, ... }`; `group` là một `THREE.Group` (thêm vào scene được ngay).
Tên `group.name` phải là **tiếng Việt không dấu**, ví dụ `dien-thoai`, `cu-sac`, `bo-mach`,
`tui-pin`, `nhiet-ke`, `ong-case`, `tay` — cột `SHOTPROBE` của `rig/render.js` dùng tên này
để biết vật nào chiếm khung, và người chấm hình đọc tên đó.

| Hàm | Trả về | Việc phải làm được |
|---|---|---|
| `createPhone({ charging = true } = {})` | `{ group, setScreen(on), setCharging(k), setWarm(k), setSilk({ port, cell }), setMode(m), plugPoint }` | Điện thoại thật: **0.150 × 0.070 × 0.0085 m**, nằm sấp (màn hình úp) hoặc ngửa tùy vị trí. Màn hình sáng (ánh sáng mềm từ mặt kính), thanh pin + đồng hồ sạc trên màn hình. `setWarm(k)` làm mặt lưng ấm dần (màu toon, tô **đều** cả mặt lưng — vệt nóng lệch là vật riêng, xem mục "Vệt nóng" bên dưới). `setSilk` chỉ dùng cho bản **cưa ngang** (mực silk trên bo mạch). `setMode(m)`: `m` = `'charge'` (đồng hồ sạc) · `'busy'` (hai hàng thông báo có biểu tượng, hàng thứ hai nhấp nháy, hàng biểu tượng ứng dụng; **chỉ hai chữ "Tin nhắn" và "Thông báo"**, đúng hai từ lời kể cất ra — không logo, không số) · `'game'` (nền trời/đất, một khối vàng nhảy, một vật cản đỏ trôi; không chữ, không số). `plugPoint` = điểm cắm dây ở mép trái (`x = −W/2 − 0.0022`). |
| `createCharger({ watts = '60 W', big = false, plug = true } = {})` | `{ group, usbPort, setLabel(text), setWarm(k) }` | Củ sạc: hộp trắng **0.045 × 0.030 × 0.020 m**, một cổng USB-C ở mặt trước, mỏ tản nhiệt có gân ở mép phải. Trên vỏ có **nhãn in** (mặc định `'60 W'`). `plug = true` → có hai chân cắm ở mặt sau (chân cắm thẳng vào ổ); `plug = false` → **không chân**, dây nguồn nối vào ổ (đây là củ sạc dùng ở N1). `big = true` → củ to hơn, chỉ dựng riêng cho propcheck, **không có mặt trong phim**. `setWarm(k)` → chỉ tô **mỏ tản nhiệt**. `usbPort` = điểm đặt đầu dây (`(0, H·0.48, D/2)` trong khung của củ). |
| `createCable({ len = 0.55, far = 'wall' } = {})` | `{ group, update(t) }` | Dây sạc uốn, đầu gần là **USB-C** (cắm vào cổng máy). `far: 'usb'` → đầu xa cũng là USB-C (dây nối máy ↔ củ sạc); `far: 'wall'` → đầu xa là phích cắm tường. `update(t)` làm dây **đung đưa nhẹ** (tự động, không cần lệnh riêng). Dây **không có khớp rời**: đầu cắm hàn vào đường cong. |
| `createWallSocket()` | `{ group }` | Hộp ổ cắm trên tường, hai lỗ, một phích cắm. |
| `createCase()` | `{ group, setOn(bool) }` | Ốp case silicone **trong suốt** (để vào `fxLayer()`), mép dày hơn. `setOn(false)` → úp sang bên: dịch **+0,52 m theo x, +0,04 m theo z** và xoay **0,22 rad** quanh trục y. |
| `createThermometer()` | `{ group, setLevel(k), setMark(deg) }` | Nhiệt kế: ống thuỷ tinh, cột chất lỏng dâng lên theo `setLevel(0..1)`. Thang có **vạch nhưng không có số**; `setMark(deg)` hiện một vạch đỏ (thang chạy từ 10 đến 50 °C) — tập này **không** dùng vạch đó: mốc 45 °C nằm ở cảm biến nhiệt trong máy. |
| `createCurrentStream(points, { n = 60, speed = 1, color = '#8fe3ff' } = {})` | `{ group, update(t, power = 1), setLoss(index, frac) }` | Dòng điện = **hạt cyan bay dọc một đường cong** `points` (mảng `THREE.Vector3`). `setLoss(i, frac)`: `frac` là **phần còn đi tiếp** của dòng tại điểm thứ `i`; phần đã mất đổi sang cam và tan dần. `update(t, power)` chạy mỗi khung hình; `power` đổi mật độ hạt. |
| `createHeatPlume(point, { n = 40, color = '#ff9a3c' } = {})` | `{ group, update(t), setRate(r) }` | Nhiệt = **hạt cam/đỏ mọc tại một điểm rồi bay lên và tỏa**. `setRate(r)` đổi đậm/nhạt. |
| `createHeatSquiggle(points, { color } = {})` | `{ group, update(t) }` | Vệt gợn nhiệt (dùng `squiggle()` của rig) chạy dọc `points`: vệt **mọc lên từ điểm gốc**, cao 38–58 mm, vẽ bằng **pha thường** (đọc được cả trên nền sáng lẫn nền tối). |
| `createTransformer()` | `{ group, update(t) }` | Cuộn biến áp: **lõi hình chữ E** (hai yoke trên dưới, ba chân đứng) + dây đồng quấn quanh chân giữa + băng keo. `update(t)` rung rất nhẹ. |
| `createHeatSink()` | `{ group, setWarm(k) }` | Mỏ tản nhiệt nhôm có gân. |
| `createInductor()` | `{ group, setCurrent(k) }` | Cuộn cảm dây đồng. `setCurrent(k)`: k=0.35 → dòng hạt thưa, ít hạt đỏ; k=1 → dòng hạt dày, **hạt đỏ bám quanh nhiều hơn hẳn**. Hạt đỏ = nhiệt. |
| `createThermalSensor()` | `{ group, setHot(k), setMark(deg) }` | Miếng cảm biến nhiệt nhỏ trên một tấm bo xanh, hai chân; đổi màu khi nóng. Thang bên cạnh có vạch **không số**; `setMark(45)` hiện **vạch đỏ 45 °C** — đây là chỗ duy nhất trong phim được vẽ ra con số 45. |
| `createUSBCPort()` | `{ group }` | Miệng cổng USB-C hình chữ nhật bo tròn, **miệng hở về phía +z**: lõi tối, lưỡi cắm, chân vàng bên trong. |
| `createBoard({ w = .090, d = .050, t = .0016 } = {})` | `{ group, setSilk({ port, cell }) }` | Bo mạch (dựng riêng, không dùng `pcb()` của rig) + chip sạc + **con tụ** (vỏ trụ xanh lam `#2d4f8f` có nắp nhôm, đứng giữa chip sạc và cuộn cảm) + cuộn cảm + cổng USB-C, **bằng kích thước thật**: bo 0.090 × 0.050 m. `setSilk` đặt mực silk `'20 V'` cạnh cổng và `'4 V'` cạnh túi pin. |
| `createBatteryCut({ w = .062, d = .090, t = .0045 } = {})` | `{ group }` | Túi pin bạc bị cưa mở một góc, lộ **các lớp** (đồng / graphite / cách điện / nhôm) xếp sát; các lớp hé lệch nhau nên nhìn từ trên xuống thấy được cả bốn màu. |
| `createHand()` | `{ group, pose(curl, spread) }` | Bàn tay (dùng `buildHand()` của rig). `pose` = ngón khẽ co / xòe. |

**Năm lớp trong túi pin không phải một hàm riêng.** Chúng dựng trong `buildCellIn()` (`src/set.js`):
`LAYER_DEF` liệt kê năm tấm — `lop-dong` `#c4703c`, `lop-graphite` `#3a3841`, `lop-cach-dien`
`#e8e1cd`, `lop-graphite-2` `#3a3841`, `lop-nhom` `#bcc2cb` — và trả ra qua `buildCellIn().layers`.
Tên từng lớp là điều khoản bám cho thẻ `ĐỒNG · GRAPHITE · CÁCH ĐIỆN · NHÔM` ở c44.

**Vệt nóng trên lưng máy không nằm trong `props.js`.** `setWarm(k)` của máy tô **đều** cả mặt lưng,
không tạo được vệt lệch. Hai vệt riêng do phim dựng trong `src/film.js`:

| Vệt | Ở đâu | Bám vào | Khi nào hiện |
|---|---|---|---|
| `PATCH` | một vệt lệch ở **một góc** lưng máy thứ hai | group quay `PIV.phone2` | c83–c84 |
| `HOT2` | **hai vùng**: một ở mạch sạc gần cổng, một ở con chip giữa máy | group của chính máy đang sạc (`N1.phone.group`) | c90–c91 |

Máy đang sạc được lật úp ở c90 (và trả lại ngửa lên ở c94) để lưng máy — nơi có hai vùng nóng —
quay về phía máy quay.

---

## `src/set.js` — năm nơi chốn

| Hàm | Trả về | Nơi chốn |
|---|---|---|
| `buildNightstand(scene)` | `{ group, phone, charger, socket, cable, phone2, case2, charger2, cable2, cord2, lamp, key, anchors }` | **N1 · bàn cạnh giường**: mặt bàn gỗ ở `y = 0`, tường tối ở `z = −0.62`, đèn bàn ấm, ổ cắm trên tường ở `(−0.78, 0.14, −0.60)`. Trên bàn: **một** điện thoại đang sạc ở `(−0.34, 0, 0.06)`, củ sạc có dây ở `(−0.62, 0, −0.34)`, dây nối củ sạc → cổng máy, dây nguồn từ củ sạc → ổ trên tường. Từ c61 xuất hiện thêm **cặp thí nghiệm**: `phone2` ở `(−0.02, 0, 0.20)` (có `case2` úp lên), `charger2` ở `(−0.44, 0, −0.52)`, `cable2` nối máy thứ hai với củ thứ hai, `cord2` nối củ thứ hai về ổ. **Ốp case và nhiệt kế không thuộc bộ dựng cảnh**: ốp của máy thứ hai là `case2` ✓, còn hai nhiệt kế do phim dựng (`MY.th1`, `MY.th2`) và đặt lên lưng hai máy lúc c64. |
| `buildChargerIn(scene)` | `{ group, charger, transformer, heatSink, chip, port, stream, plume, squiggle, plate, key, anchors }` | **N2 · trong củ sạc**: ruột củ sạc đã cưa, nền tối, một vệt sáng từ đèn bàn. `plate` là tấm nhãn `60 W` dán trên mặt cắt — phim ẩn được nó khi cuộn biến áp che nửa nhãn (c20). |
| `buildPhoneIn(scene)` | `{ group, board, port, inductor, sensor, battery, chip, stream, plume, phone, lid, key, anchors }` | **N3 · trong điện thoại**: khung máy đã cưa, bo mạch, túi pin, chip xử lý. `phone` là **thân máy đã cưa** (có `setScreen` / `setCharging` / `setWarm` / `setMode`), `lid` là **nắp máy có màn hình** treo lơ lửng phía trên (bật ở c37–c38). |
| `buildCellIn(scene)` | `{ group, layers, pouch, stream, plume, squiggle, key, anchors }` | **N4 · trong túi pin**: mặt cắt túi pin phóng to, năm lớp xếp chồng. |
| `buildShell(scene)` | `{ group, back, case, hand, plume, squiggle, key, anchors }` | **N5 · vỏ máy**: lưng máy, ốp case, bàn tay. |

**Ánh sáng:** mỗi nơi có **một đèn chính** (`keyLight`) + `ambience(scene, …)` của rig.
Không nơi nào tối mờ mịt: mặt cắt luôn có một vệt sáng dẫn dắt.

---

## `src/film.js` — trang phim

```js
window.READY = true;      // khi mọi thứ đã dựng xong
window.DUR = <số giây>;    // từ timeline
window.render(t);         // vẽ khung ở giây t
window.TEXTS(t);          // các chữ trên màn hình (không kể phụ đề)
window.EV = [];            // sự kiện âm thanh + đánh dấu nhịp
```

Mỗi câu kể = **một nhát**: `film().frame(scene, { t, overlay, ... })`.
Nhãn (`label()` của rig) **phải gắn với câu lời đọc nó** (`c14` đọc "sáu mươi oát" →
nhãn `60 W` chỉ được hiện ở câu `c14`).

### Ba hợp đồng lắp ghép phim phải giữ

1. **Máy xoay bằng trục, không dựng nhiều bản.** `pivot(obj)` bọc máy vào một group tại tâm quay;
   phim xoay `PIV.phone.rotation.x` và nâng `PIV.phone.position.y`. Các điểm lật của máy đang sạc:
   úp sấp (c1) → ngửa lên (c2) → úp lại để thấy lưng (c3–c4) → ngửa lên (c5) → úp xuống lần nữa
   ở **c90** để thấy hai vùng nóng trên lưng → ngửa lên (c94). Máy thứ hai có trục riêng
   (`PIV.phone2`) vì nó còn mang ốp case.
2. **Ốp case: một quy ước vị trí nghỉ.** Trong phim, vị trí nghỉ của ốp do `applyCase()` đặt
   (ốp của máy thứ hai rời máy ở c86 sang `+0,20 m theo x, +0,14 m theo z`). `createCase().setOn(false)`
   tự dời ốp đi `+0,52 m theo x, +0,04 m theo z` — **không** gọi nó cho ốp của máy thứ hai, nếu
   không ốp có thể rơi khỏi bàn.
3. **Xoá chữ/số của rig.** `cleanChip()` và `cleanPouch()` trong `src/set.js` phải được gọi cho
   mọi chip và túi pin lấy từ rig (`IC-7404`, `2416`, `3.85V 4500mAh` là số ngoài danh sách bốn số
   được phép).
