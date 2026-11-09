# MAP — tập 02 · điện thoại nóng lúc sạc

Bản đồ để đọc nhanh, không phải tài liệu: sửa gì thì mở đúng chỗ.
Dòng tính theo `wc -l` lúc viết; kiểm bằng `python3 tools/check_map.py <tập>`.

## src/props.js (1152 dòng) — vật dựng, mỗi vật một hàm

| Dòng | Cái gì |
|---|---|
| 17 | `M` — bảng màu của tập |
| 33–48 | `label`, `plane`, `warmInto` — nhãn dán lên vật, mặt phẳng có nhãn, đổi vật liệu sang ấm dần |
| 56–67 | `bboxHelper`, `whiteColors` — hộp bao ẩn để máy quay đặt đúng khung, màu trắng cho `instanceColor` |
| 75 | `createPhone` — điện thoại 0.150 × 0.070 × 0.0085 m, màn hình sạc, mặt lưng ấm |
| 294 | `createCharger` — củ sạc trắng có dải đường hàn xám, nhãn in `60 W`, mỏ tản nhiệt có gân |
| 367 | `createCable` — dây sạc uốn, một đầu USB-C, một đầu cắm tường (đung đưa) |
| 443 | `createWallSocket` — ổ cắm trên tường |
| 471 | `createCase` — ốp case silicone trong suốt, khoét camera vuông, úp sang bên khi không dùng |
| 525 | `createThermometer` — nhiệt kế thuỷ tinh, cột chất lỏng dâng theo `setLevel` |
| 574 | `createCurrentStream` — dòng điện = hạt cyan trên đường cong, `setLoss` |
| 647 | `createHeatPlume` — nhiệt = hạt cam mọc tại một điểm rồi bay lên (hào quang nhỏ, hạt đỏ thẫm) |
| 690 | `createHeatSquiggle` — vệt gợn nhiệt mọc lên từ điểm gốc |
| 770 | `createTransformer` — cuộn biến áp lõi chữ E + dây đồng; rung bằng nhóm con `run` (không gán `position` của group) |
| 793 | `createHeatSink` — mỏ tản nhiệt nhôm có gân, `setWarm` |
| 806 | `createInductor` — cuộn cảm: ống chỉ kem + sáu vòng đồng xen kẽ hai tông, hạt dòng điện (cyan) + hạt nhiệt (đỏ), `setCurrent` |
| 882 | `createThermalSensor` — cảm biến nhiệt, thang vạch, `setHot`, `setMark(45)` |
| 924 | `createUSBCPort` — miệng cổng USB-C hình quả dục hở về +z, lưỡi cắm, 24 chân vàng |
| 956 | `createBoard` — bo mạch 0.090 × 0.050 m, `setSilk` in hai mực `20 V` và `4 V` |
| 1021 | `createBatteryCut` — túi pin bạc cưa mở góc, nhãn in `Li-ion`, bốn lớp thành bậc thang |
| 1102 | `createHand` — bàn tay, `pose(curl, spread)` |
| 1115 | `PROPS` — danh mục vật cho propcheck (23 vật) |

## src/set.js (1140 dòng) — năm nơi chốn

| Dòng | Cái gì |
|---|---|
| 31–48 | `frameOf`, `axesOf`, `measureLocal` — đo vật (khung, trục, kích thước) |
| 81–110 | `layFlat`, `putOn`, `shrinkToFit`, `markHollow` — đặt vật nằm sấp, đặt lên bàn, thu nhỏ |
| 116–135 | `pos3`, `barBox`, `repaint` — toạ độ trong khung vật, vẽ lại nhãn trên canvas |
| 143–177 | `cleanChip`, `cleanPouch` — xoá chữ/số in sẵn của rig trên chip và trên túi pin |
| 192–227 | `handle`, `labelPlate`, `faceAxis` — tay cầm củ sạc, bảng nhãn, hướng mặt |
| 229–273 | `lightShaft`, `dustMotes` — ánh sáng dẫn dắt, bụi trong nền |
| 275–481 | `darkBackdrop`, `stage`, `nightBackground`, `buildNightstand` — nền tối, mặt bàn, trời đêm; **N1 · bàn cạnh giường** |
| 482–512 | `layCable`, `worldPoint`, `worldOf` — uốn dây, đổi toạ độ trong vật ra toạ độ thế giới |
| 514 | `buildChargerIn` — **N2 · trong củ sạc**: cuộn biến áp, mỏ tản nhiệt, chip, dòng, nhiệt |
| 691 | `buildPhoneIn` — **N3 · trong điện thoại**: bo mạch, cổng, cuộn cảm, cảm biến, túi pin, dòng thứ hai |
| 920 | `findParts` — tìm bộ phận theo đặc trưng (màu, vị trí) |
| 935 | `buildCellIn` — **N4 · trong túi pin**: mặt cắt, các lớp xếp chồng |
| 1043 | `buildShell` — **N5 · vỏ máy và bàn tay**: lưng máy, ốp case, tay, gợn nhiệt |

### Điểm neo do bộ dựng cảnh nói ra (`anchors`)

Bộ dựng cảnh trả về `anchors` — toạ độ thế giới của những chỗ mà thẻ chữ bám vào. Cần vì
hạt dòng điện và hạt nhiệt là `InstancedMesh`: khung bao của chúng nằm ở gốc chứ không nằm ở
chỗ hạt đang bay, nên điểm neo phải do người dựng biết chứ không đoán.

- `plume` ở `buildChargerIn` (dòng 661) → thẻ `ĐIỆN BỊ THẤT THOÁT`
- `origin` ở `buildChargerIn` (dòng 658) → gốc củ sạc (không phải tâm hộp bao, tâm lệch)
- `label`, `labelRight` ở `buildNightstand` (dòng 462, 465) → mép phải của nhãn in `60 W`
  trên củ sạc thật ở N1 (thẻ `60 W` và hai nhát c14, c87 nhìn vào đây)
- `cellTail` ở `buildPhoneIn` (dòng 904) → thẻ `TỰ GIẢM DÒNG SẠC`
- `stream2`, `plume`, `inductor` ở `buildPhoneIn` (dòng 882–905) → thẻ `DÒNG THỨ HAI`,
  `HAI CHỖ SINH NHIỆT`, `MẠCH SẠC`
- `cross`, `crossEdge`, `heat` ở `buildCellIn` (dòng 1025–1029) → thẻ `ĐIỆN TRỞ TRONG PIN`
  (bám vào `crossEdge`, lệch sang phải 12 mm khỏi cụm hạt) và `NHIỆT BÊN TRONG PIN`
- `pouch` ở `buildCellIn` (dòng 1030) → các nhát c42, c43, c49 nhìn vào túi pin
- `caseRim` ở `buildShell` → thẻ `ỐP CASE`
- `plume` ở `buildShell` (dòng 1130) → thẻ `KHÔNG KHÍ`

## src/film.js (1388 dòng) — trang phim

| Dòng | Cái gì |
|---|---|
| 24–25 | `SC`, `N1`…`N5` — dựng năm cảnh |
| 33 | `sceneOf` — lấy cảnh + nguồn sáng của nó |
| 44 | `P` — mọi vật tự dựng |
| 51–69 | `wp`, `bb`, `frameOf`, `ctr`, `P3` — đo vị trí thật của vật trong cảnh |
| 71–98 | `PH`, `CH`, `SO`, `PORT`, `MID2` — toạ độ thật ở N1, đọc từ bộ dựng chứ không gõ tay |
| 102–112 | `put`, `POWER`, `OWN`, `own` — vật tự dựng và đường sức mạnh của nó |
| 119 | `MY` — dòng điện, nhiệt, gợn nhiệt của riêng tập này |
| 169–185 | `pivot`, `PIV` — trục quay của máy |
| 189–203 | `screenUp`, `BASE_UP` — màn hình nằm ở mặt nào |
| 210–241 | `sh`, `ORB`, `AT`, `MID`, `ORBP`, `ORB2`, `MAC` — máy quay; `ORBP` quanh một **điểm neo** với cự ly cho trước (dùng cho hạt bay) |
| 468–485 | `CASE_HOME`, `caseDrop`, `RIG_OPEN` — chỗ ốp case rơi ở c86, và **rig chung** của nhát mở đầu với các nhát khép vòng (c1, c67, c79, c94, c95) |
| 300–399 | `HEAT3`, `PATCH`, `HOT2` — vệt nóng ở góc lưng, vùng cháy |
| 462 | `sensorTarget` — điểm nhắm của các nhát soi cảm biến: giữa tâm tấm bo và vạch đỏ |
| 488 | `SHOTS` — bảng 93 nhát: cảnh, câu, fov, vị trí máy, lý do máy đứng ở đó |
| 670–672 | `MARK`, `shotAt` — tra nhát của giây `t` |
| 687–758 | `avgColor`, `layerScore`, `layerPoints`, `LAYERS` — đo màu từng lớp túi pin |
| 781–828 | `shellLabel`, `toward`, `sensorMarkPos`, `ANCH`, `silkPos` — điểm neo thẻ chữ, vị trí mực silk trên bo mạch |
| 852 | `CARDS` — thẻ thuật ngữ: nhãn trên màn hình, mỗi thẻ gắn với câu đọc nó |
| 929–981 | `T`, `E`, `warmPhone`, `curBig`, `phoneRot`, `liftCurve`, `phone2Rot` — trạng thái theo thời gian: nhiệt độ, mức nhiệt kế, dòng, ốp case |
| 994–1016 | `EV`, `ev`, `FOLEY` — âm thanh: giọng kể, không khí, nhạc, foley |
| 1060 | `applyState` — trạng thái vật theo câu (mực silk chỉ hiện ở c28; dòng thứ hai chỉ ở c37–c41) |
| 1188–1261 | `applyHand`, `applyPhone`, `applyPhone2`, `applyCase` — bàn tay, máy, máy thứ hai, ốp case theo câu |
| 1292–1301 | `UPD`, `updatersOf`, `updateScene` — **gọi `update` của mọi vật mỗi khung** |
| 1313–1316 | `window.DUR`, `window.EV`, `window.render` — dựng khung hình tại giây `t` |
| 1373–1384 | `window.DIAG`, `window.TEXTS` — chẩn đoán, chữ trên màn hình |

## Hợp đồng giữa props.js, set.js và film.js (trước ở src/API.md)

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

### `src/props.js` — các vật

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

### `src/set.js` — năm nơi chốn

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

### `src/film.js` — trang phim

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

#### Ba hợp đồng lắp ghép phim phải giữ

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

## Bảng nhát — Vì sao điện thoại nóng lúc sạc? (trước ở src/SHOTS.md)

Một câu = một nhát. Bảng này là bộ xương của `src/film.js` và của `LOOK.md`.
Toạ độ máy quay sẽ chốt khi đọc được vị trí thật của vật trong `src/set.js`.

**Nơi chốn:** N1 bàn cạnh giường · N2 trong củ sạc · N3 trong điện thoại · N4 trong túi pin ·
N5 vỏ máy và bàn tay.

**Nhãn trên hình** (chỉ chữ, không số trừ bốn số được phép): `DÒNG ĐIỆN`, `NHIỆT`,
`ĐIỆN BỊ THẤT THOÁT`, `NƠI SINH NHIỆT THỨ HAI`, `ĐỒNG`, `GRAPHITE`, `CÁCH ĐIỆN`, `NHÔM`,
`CÓ CASE`, `KHÔNG CASE`, và bốn số `60 W`, `20 V`, `4 V`, `45 °C`.

| câu | nơi | cự ly | trong khung | động |
|---|---|---|---|---|
| c1 | N1 | toàn cảnh | góc bàn cạnh giường: mặt bàn gỗ, tường tối, đèn bàn ấm ở góc phải, ổ cắm trên tường, **điện thoại nằm sấp** giữa bàn, dây chạy từ ổ xuống củ sạc rồi vào cổng máy | đồng hồ sạc trên máy sáng lên; đèn bàn lay nhẹ |
| c2 | N1 | cận | bàn tay lật máy lên: màn hình lộ ra, **vòng đồng hồ sạc** đang đầy dần (không có số) | bàn tay lật máy; vòng đồng hồ chạy |
| c3 | N1 | trung | bàn tay cầm máy lên, **mặt lưng** quay về phía máy quay, màn hình vẫn sáng | tay nâng máy, máy hơi lắc |
| c4 | N1 | siêu cận | mặt lưng máy trong lòng bàn tay, vệt màu ấm lan dần | gợn nhiệt nhẹ trên lưng máy |
| c5 | N1 | trung rộng | máy đặt lại xuống bàn, dây vẫn cắm, hướng về phía ổ cắm | máy nằm yên, đèn bàn ấm |
| c6 | N1 | trung rộng | **dòng hạt cyan** chạy từ ổ cắm → củ sạc → cổng máy: một đường hạt liên tục | hạt chạy |
| c7 | N1 | trung | củ sạc và cổng máy cạnh nhau trên bàn, nền tối dịu phía sau | hạt chạy qua cổng |
| c8 | N1 | cận | cổng máy: **dòng hạt vào nhiều, chỉ một phần nhỏ đi tiếp** vào ruột; phần còn lại đổi màu | hạt vào cổng, nhánh đi tiếp mảnh lại |
| c9 | N1 | siêu cận | ngay tại cổng, hạt **tách ra thành màu đỏ** | hạt tách màu, bay lên |
| c10 | N1 | siêu cận | hạt đỏ bay lên khỏi cổng, lơ lửng trong không khí | hạt đỏ bay và tỏa |
| c11 | N1 | siêu cận | hai loại hạt cạnh nhau: hạt xanh đi tiếp, hạt đỏ đi lên | nhãn `DÒNG ĐIỆN` (hạt xanh) · `NHIỆT` (hạt đỏ) |
| c12 | N1→N3 | cận | máy quay đi theo dòng hạt xanh, tiến vào cổng, mặt cắt máy mở ra | hạt dẫn đường vào trong |
| c13 | N1 | cận | ổ cắm trên tường → phích → dây nguồn → củ sạc: đường hạt chạy dọc dây | hạt chạy theo dây, dây đung đưa |
| c14 | N2 | siêu cận | **nhãn in trên vỏ củ sạc**: `60 W` | nhãn in nằm nguyên, hơi ấm |
| c15 | N2 | trung rộng | củ sạc đứng một mình trên nền tối, một vệt sáng từ đèn bàn | hơi ấm, đèn nhấp nháy nhẹ |
| c16 | N2 | cận | bên trong củ sạc: dòng hạt **lượn sóng** ở đầu vào | hạt lượn sóng |
| c17 | N2 | trung | cùng dòng hạt, nay **chạy thẳng**, nhưng có hạt rơi ra | hạt rơi ra ở chỗ chuyển đổi |
| c18 | N2 | cận | hạt rơi ra biến thành **hạt cam** ngay trong ruột củ sạc | hạt cam mọc ra |
| c19 | N2 | trung | **cả củ sạc đã cưa**: lõi sắt và dây đồng nằm ở giữa, hạt chạy qua | cuộn dây rung rất nhẹ |
| c20 | N2 | siêu cận | dòng hạt chạy qua cuộn dây, **một phần tách ra** và đổi màu | hạt tách màu ngay tại cuộn dây |
| c21 | N2 | siêu cận | chỗ hạt tách ra **bừng lên màu cam** | hạt cam bùng ra |
| c22 | N2 | trung rộng | cả củ sạc: hạt cam bay lên từ cuộn dây | nhãn `ĐIỆN BỊ THẤT THOÁT` chỉ vào hạt cam |
| c23 | N2 | trung | củ sạc, **mỏ tản nhiệt ấm dần** (màu ấm lan lên gân), gợn nhiệt bốc lên ngay trên vỏ | mỏ tản nhiệt nóng dần, gợn nhiệt bốc lên |
| c24 | N2→N3 | cận | dây cắm vào cổng máy, ruột máy mở ra | hạt đi vào máy |
| c25 | N3 | trung rộng | **điện thoại bị cưa ngang**: khung máy, màn hình, bo mạch, túi pin — nhìn thấy đây là cái máy ở N1 | máy đứng yên, hơi ấm |
| c26 | N3 | trung | **cổng USB-C** ở mép trái, bo mạch chạy từ đó vào trong | hạt chui vào cổng |
| c27 | N3 | trung | bo mạch chạy dọc tới **túi pin** nằm giữa máy | hạt chạy trên bo |
| c28 | N3 | siêu cận | hai mực silk trên bo: `20 V` cạnh cổng, `4 V` cạnh túi pin | mực silk đứng yên |
| c29 | N3 | trung | giữa cổng và túi pin có **mạch hạ điện áp** | hạt chạy qua mạch |
| c30 | N3 | cận | **con chip sạc và con tụ** nằm cạnh cuộn cảm dây đồng | hạt chạy qua cuộn dây |
| c31 | N3 | siêu cận | dòng hạt **chạy trên cuộn dây đồng** | hạt trượt trên dây |
| c32 | N3 | cận | chỗ dòng bị cản: hạt **tụ lại** và ấm lên | hạt tụ lại, vệt cam loang |
| c33 | N3 | cận | hạt chuyển từ xanh sang cam **ngay tại cuộn cảm** | hạt đổi màu tại cuộn cảm |
| c34 | N3 | trung | cả mạch sạc, vệt cam ở cuộn cảm | nhãn `NƠI SINH NHIỆT THỨ HAI`; vệt cam lan |
| c35 | N3 | cận | phần hạt còn lại **rơi xuống** túi pin | hạt rơi xuống |
| c36 | N3 | siêu cận | hạt **nằm lại** trong túi pin, sáng dịu bên trong | hạt lắng xuống, nằm lại |
| c37 | N3 | trung | phía trên là **màn hình sáng** | màn hình sáng |
| c38 | N3 | cận | màn hình với các biểu tượng nhấp nháy (không chữ, không logo) | biểu tượng nhấp nháy |
| c39 | N3 | cận | **con chip xử lý**, nắp chip ấm dần | nắp chip ấm lên |
| c40 | N3 | cận | **dòng thứ hai** chạy từ túi pin lên chip | hạt chạy ngược lên chip |
| c41 | N3 | trung rộng | cả ruột máy, **hai vùng nóng** cùng lúc | hai vùng nóng cùng sáng |
| c69 | N3 | trung rộng | cả ruột máy, **cuộn cảm** nổi lên giữa khung | cuộn cảm rung nhẹ |
| c70 | N3 | cận | dòng hạt trên bo **dày hơn hẳn** | hạt chạy dày |
| c71 | N3 | cận | **cùng một cuộn cảm**, dòng hạt chạy qua | hạt chạy qua cuộn cảm |
| c72 | N3 | siêu cận | trong cuộn cảm, **hạt đỏ mọc lên** nhiều hơn | hạt đỏ mọc dày |
| c73 | N3 | siêu cận | cùng một cuộn cảm: hạt xanh nhiều hơn, **hạt đỏ nhiều hơn hẳn** | hạt đỏ dày thêm |
| c74 | N3 | cận | **cảm biến nhiệt** nhỏ có thang vạch, nằm cạnh túi pin | cảm biến nhấp nháy nhẹ |
| c75 | N3 | siêu cận | mặt cảm biến, **đầu dò nhiệt áp sát tế bào pin** | vạch trên thang dịch chút |
| c76 | N3 | cận | thang vạch của cảm biến, vạch đỏ `45 °C` | vạch đỏ sáng lên |
| c77 | N3 | cận | dòng hạt đi qua cảm biến rồi **thưa dần** | hạt thưa dần |
| c78 | N3 | siêu cận | cảm biến **nóng đỏ**, hạt chạy qua thưa dần | hạt loãng ra, chạy chậm |
| c42 | N4 | trung | **túi pin bị cưa mở** một góc, vỏ bạc nằm trọn trong khung | lớp trên cùng hé ra thêm một chút |
| c43 | N4 | trung rộng | cả cái túi pin, vỏ bạc với góc cưa mở | vỏ hơi phồng |
| c44 | N4 | trung | **bốn lớp mỏng** xếp sát ở góc cưa: đồng, graphite, lớp cách điện, nhôm | lớp graphite nhấc lên |
| c45 | N4 | cận | hai mép lớp **ép sát** vào nhau, mỏng như tờ giấy | hai lớp ép vào nhau |
| c46 | N4 | siêu cận | hạt dòng điện **bò ngang** qua các lớp, xuyên lớp graphite | hạt bò ngang |
| c47 | N4 | cận | ở chỗ hạt chen chúc, dòng lách qua chất cản | vệt cam loang ra |
| c48 | N4 | cận | nhiệt **dồn vào trong**, không ra khỏi vỏ | hạt đỏ dồn vào giữa |
| c49 | N4 | trung rộng | cả túi pin ấm lên, vùng nhiệt **loang đều** ra cả cục | vùng ấm loang ra |
| c50 | N5 | trung rộng | **ba nguồn nhiệt** cùng khung: mạch sạc, túi pin, con chip | ba luồng nhiệt chạy về một điểm |
| c51 | N5 | cận | ba luồng nhiệt **hội tụ** về một điểm | ba luồng chạy vào cùng một điểm |
| c52 | N5 | cận | điểm hội tụ là **vỏ máy** | vệt nóng lan trên vỏ |
| c53 | N5 | trung | cả vỏ máy như một tấm tản nhiệt | vỏ ấm dần |
| c54 | N5 | cận | **gợn nhiệt** bốc lên không khí | gợn nhiệt bay lên |
| c55 | N5 | cận | **mặt lưng máy** nóng lên | vệt ấm lan trên lưng |
| c56 | N5 | trung | bàn tay đưa tới lưng máy, lơ lửng phía trên | tay tiến vào khung |
| c57 | N5 | cận | bàn tay **chạm lưng máy**, vệt nóng lan theo da tay | vệt nóng chạy vào tay |
| c58 | N5 | cận | **ốp case** trong suốt úp lên máy, mép dày hơn | case hạ xuống úp lên máy |
| c59 | N5 | cận | luồng nhiệt **bị chặn** ở vỏ case, ngoản lại | gợn nhiệt dội ngược lại |
| c60 | N5 | trung rộng | máy có case **nóng hơn** máy bên cạnh | vệt nóng trên máy có case đậm hơn |
| c61 | N1 | trung rộng | **hai chiếc máy giống nhau** trên bàn, cùng cắm sạc, cùng một chỗ | hai máy cùng sáng màn hình |
| c62 | N1 | trung | máy bên phải có case, máy bên trái không | case nằm yên |
| c63 | N1 | cận | **nhiệt kế** đặt trên lưng mỗi cái máy | hai nhiệt kế đặt xuống |
| c64 | N1 | cận | cột nhiệt kế **bên phải dốc lên nhanh hơn** | cột chất lỏng dâng lên |
| c65 | N1 | cận | cột nhiệt kế **bên trái dốc lên chậm hơn** | cột bên trái dâng chậm |
| c66 | N1 | trung | hai nhiệt kế cạnh nhau, **cột chênh nhau rõ** | hai cột đứng cạnh nhau |
| c67 | N1 | toàn cảnh | quay lại cái bàn cạnh giường, y hệt nhát mở đầu | đèn bàn ấm, dây đung đưa |
| c68 | N1 | cận | điện thoại **vẫn cắm sạc**, màn hình vẫn sáng, vỏ ấm | màn hình sáng, vỏ ấm |
| c79 | N1 | toàn cảnh | cái bàn cạnh giường, máy vẫn cắm sạc, vẫn ấm, bình thản | đồng hồ sạc nhích |
| c80 | N1 | cận | cả cái máy trong khung, bình thản | máy bình thản, không có gì động |
| c81 | N1 | cận | **một cái máy khác** nằm cạnh, không cắm sạc | cái máy thứ hai nằm yên |
| c82 | N1 | trung | cái máy không sạc, **mặt lưng vẫn ấm** | lật úp máy, lưng quay ra |
| c83 | N1 | siêu cận | **một góc lưng máy** nóng lệch, vệt hồng lệch sang một bên | vệt hồng lệch |
| c84 | N1 | trung | bàn tay **dừng lại** trên máy | tay dừng, không làm gì |
| c85 | N1 | trung rộng | bàn cạnh giường, tay chuẩn bị làm việc | tay bước vào khung |
| c86 | N1 | trung | tay **tháo ốp case** ra, đặt sang bên | case rời ra, nằm sang bên |
| c87 | N1 | cận | củ sạc **đúng chuẩn** cắm vào máy, nhãn in trên vỏ hiện rõ | củ sạc cắm vào |
| c88 | N1 | trung | cả đường điện, **hạt chạy thưa hơn** | hạt chạy thưa |
| c89 | N1 | cận | máy đang **chơi game** (màn hình sáng, hình nhấp nháy) vẫn cắm sạc | hình nhấp nháy trên màn hình; thẻ `60 W` trên vỏ củ sạc |
| c90 | N1 | cận | **hai vùng nóng** trong ruột máy hiện lên qua vỏ | hai vệt nóng sáng lên |
| c91 | N1 | cận | tay **rút cáp ra** khỏi máy | cáp rút, đồng hồ sạc dừng |
| c94 | N1 | toàn cảnh | quay lại bàn cạnh giường, máy vẫn cắm sạc, vẫn ấm, bình thản | đồng hồ sạc nhích, hơi sương tĩnh |
| c95 | N1 | toàn cảnh | quay lại bàn cạnh giường, đèn bàn ấm, dây vẫn cắm | đèn bàn lay nhẹ |
