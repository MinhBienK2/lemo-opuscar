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
