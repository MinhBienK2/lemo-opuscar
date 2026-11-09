# COMPONENTS_SPEC — Vì sao điện thoại nóng lúc sạc?

Bóc tách từ `TREATMENT.md` (26 ý, 34 nhát) và `voice/lines.json` (96 câu). Mỗi linh kiện là một hàm
riêng trong `src/props.js` (đạo cụ, ruột máy) hoặc `src/set.js` (bối cảnh). Quy ước chung: một đơn vị
= 1 mét, mặt bàn ở `y = 0`, máy quay luôn nhìn từ `+z`.

Quy ước vật liệu: `toon()` của `rig/kit.js`, texture vẽ bằng `canvasTex` có seed, ánh sáng một đèn
chính có hướng + `pool` ấm của đèn bàn. Vật trong suốt (ốp case, kính) đưa vào `fxLayer()`.

Bản này viết lại sau vòng kiểm tra tài liệu lần 1 (`review/ASSET-AUDIT-REVIEW-1.md`): mọi dòng dưới
đây **khớp với đúng hàm đang chạy** trong `src/props.js` / `src/set.js`. Cột "Hàm" ghi đúng chữ ký
thật — đọc cột đó mà không mở code thì vẫn dựng được.

**Bản đồ nhát theo nơi chốn** (lấy từ bảng `SHOTS` trong `src/film.js`):

| Nơi chốn | Câu |
|---|---|
| N1 · bàn cạnh giường | c1–c14, c61–c68, c79–c95 |
| N2 · trong củ sạc | c15–c23 |
| N3 · trong điện thoại | c24–c41, c50, c69–c78 |
| N4 · trong túi pin | c42–c49 |
| N5 · vỏ máy | c51–c60 |

---

## Nhóm 1 · Props (đạo cụ tương tác)

| Tên component | Vai trò & Shot | Cự ly | Trạng thái động | Hàm (đúng chữ ký thật) |
|---|---|---|---|---|
| **Điện thoại** | N1 (c1–c14, c61–c68, c79–c95), N3 (c24–c41, c50), N5 (c51–c60). Cùng một vật: dựng bằng một hàm, xoay/lật bằng trục quay chứ không dựng ba bản khác nhau. | Close-up ở N1 (cổng, lưng) · Medium ở N1 rộng | `setScreen(on)` · `setCharging(k)` vòng đồng hồ sạc + thanh pin · `setWarm(k)` mặt lưng ấm dần (tô đều, **không** tạo vệt lệch) · `setSilk({port, cell})` mực silk `20 V` / `4 V` (chỉ dùng ở bản cưa) · `setMode(m)` với `m` ∈ `charge` / `busy` / `game` · `plugPoint` điểm cắm dây | `createPhone({ charging = true } = {})` |
| **Màn hình bận (`busy`)** | N3 (c37–c38), N1 (c89 — máy vừa sạc vừa chơi game). | Close-up (nắp máy treo lơ lửng) | `setMode('busy')`: hai hàng thông báo, mỗi hàng một ô vuông bo góc màu + **hai dải màu khác độ dài** (dải trên ngắn, dải dưới dài) để đọc là hai dòng chữ chứ không phải cân bằng sóng; một hàng biểu tượng ứng dụng ô vuông ở dưới cùng. **Không chữ nào trên màn hình** — không logo, không con số, không "Tin nhắn"/"Thông báo". | `setMode('busy')` (trong `createPhone`) |
| **Màn hình game (`game`)** | N3 (c38), N1 (c89). | Close-up | `setMode('game')`: nền trời/đất, một khối vàng nhảy, một vật cản đỏ trôi ngang. Chuyển động chạy mỗi khung hình; **không chữ, không số**. | `setMode('game')` (trong `createPhone`) |
| **Củ sạc (có dây)** | N1 (c14, c61–c68, c79–c95 — hai củ trên bàn, mỗi củ một bộ dây riêng), N2 (c15–c23 — củ bị cưa). Hộp trắng, một cổng USB-C ở mặt trước, mỏ tản nhiệt có gân ở mép phải. Vỏ trắng nhạt mất hình nên có **một dải đường hàn xám** (`#d6d2c6`) quanh thân hộp, và mỏ tản nhiệt màu **xám lạnh** `#8d96a4` để tách với vỏ trắng. | Close-up ở N2 · Medium ở N1 | `setLabel(text)` nhãn in trên nhãn giấy ở mặt trên (mặc định `60 W`) · `setWarm(k)` **chỉ** tô mỏ tản nhiệt · `usbPort` điểm đặt đầu dây | `createCharger({ watts = '60 W', big = false, plug = true } = {})` |
| **Dây sạc** | N1 (c1–c14, c61–c91). Dây võng nhẹ sát bàn, một đầu USB-C cắm vào cổng máy, đầu kia là một đầu USB-C thứ hai cắm vào cổng củ sạc. | Close-up ở N1 | `update(t)` đung đưa nhẹ tự động. Dây **không có** khớp rời: đầu cắm hàn vào đường cong. | `createCable({ len = .55, far = 'wall' } = {})` — `far: 'usb'` = đầu xa cũng là USB-C, `far: 'wall'` = đầu xa là phích cắm tường |
| **Bộ sạc thứ hai (cho cặp thí nghiệm)** | N1 (c61–c68, c79). Một củ sạc thứ hai giống hệt củ thứ nhất + một dây USB-C–USB-C + một dây nguồn từ củ xuống ổ trên tường. Xuất hiện từ c61, biến mất từ c79. | Medium ở N1 | `charger2.group.visible`, `cable2.group.visible`, `cord2.visible` do phim điều khiển; dòng điện của bộ thứ hai là một `createCurrentStream` riêng (`MY.stream2`). | `createCharger({ plug: false })` + `createCable({ far: 'usb' })` + `rigCable` (dây nguồn tới ổ) |
| **Ổ cắm + phích** | N1 (c13). Hộp ổ trên tường, **hai ổ tròn**, mỗi ổ có hai lỗ chân cắm, một phích cắm đang cắm ở ổ bên trái. | Medium | `update(t)` phích rung rất nhẹ | `createWallSocket()` |
| **Ốp case silicone** | N5 (c58–c60 — ốp úp lên lưng máy), N1 (c61–c86 — ốp của máy thứ hai trong cặp thí nghiệm). Trong suốt, mép dày, **khoét camera vuông** ở góc: một cụm camera gồm ba ống kính tối trong vòng thép + một đèn flash kem. (Trước đây là một lỗ tròn đơn — đọc như một lỗ khoét vô nghĩa.) | Close-up ở N5 | `setOn(on)`: `on = true` úp lên máy, `on = false` dời đi **+0,52 m theo x, +0,04 m theo z** và xoay 0,22 rad. **Vị trí nghỉ do phim quản** (xem "Rủi ro" mục 7). | `createCase()` |
| **Nhiệt kế** | N1 (c63–c66 — câu c63 là câu *đặt nhiệt kế lên*, nên hai cột phải hiện từ c63) — hai cái: một đặt trên lưng máy **không** case, một đặt trên lưng máy **có** case. Ống thuỷ tinh, cột chất lỏng đỏ, tấm thang bên cạnh có vạch **không số**. | Close-up | `setLevel(k)` cột chất lỏng dâng lên theo thời gian. `setMark(deg)` **không dùng** trong phim: mốc 45 °C thuộc về cảm biến nhiệt trong máy, không phải nhiệt độ mặt lưng. | `createThermometer({ H = .115 } = {})` |
| **Bàn tay** | N1 (c2–c5 lật và cầm máy, c82 lật máy thứ hai, c86 tháo ốp case, c91 rút cáp), N5 (c59–c60). | Close-up | `pose(curl, spread)` ngón khẽ co / xòe; vị trí tay do phim đặt theo câu | `createHand()` (bọc `buildHand()` của rig) |
| **Túi pin (nguyên vẹn)** | N3 (c26, c35–c36), N4 (c43). Bạc, nhãn chỉ ghi `Li-ion`, hai tab đồng, bảng bảo vệ xanh. | Medium ở N3 · Close-up ở N4 | Không có `setFill`: trạng thái "pin đầy" của phim nằm ở vòng đồng hồ sạc trên màn hình máy. Nhãn của rig in sẵn `3.85V 4500mAh` → **phải xoá** (xem "Rủi ro" mục 8). | rig `battery({ kind: 'pouch' })` + `cleanPouch()` trong `set.js` |
| **Túi pin (mổ)** | N4 (c43–c49). Túi bạc bị cưa mở một góc, lộ các lớp bên trong. Nhãn `Li-ion` in trên vỏ bạc; góc cưa lộ **bậc thang bốn lớp** (đồng → graphite → cách điện → foil) xếp lệch nhau, nhìn thấy rõ là túi nhiều lớp chứ không phải một phong bì. | Macro | Mép lớp hé lệch nhẹ, tấm đồng trên cùng nhấc lên rất nhẹ | `createBatteryCut({ w = .062, d = .090, t = .0045 } = {})` |
| **Các lớp trong túi pin** | N4 (c44–c46). **Năm tấm mỏng xếp sát**, mỗi tấm một màu riêng: đồng ấm `#c4703c` → graphite rất tối `#3a3841` → lớp cách điện trắng ấm `#e8e1cd` → graphite `#3a3841` → nhôm xám `#bcc2cb`. Mỗi tấm có tên riêng để thẻ bám đúng tầng. | Macro | Mép lớp hé lệch nhẹ | `LAYER_DEF` trong `buildCellIn()` (`src/set.js`), trả ra qua `buildCellIn().layers` — **không có** hàm `createBatteryLayers()` |

---

## Nhóm 2 · Internal parts (ruột & cơ chế vi mô)

| Tên component | Vai trò & Shot | Cự ly | Trạng thái động | Hàm (đúng chữ ký thật) |
|---|---|---|---|---|
| **Dòng điện (hạt cyan)** | N1 (c6–c13, c61–c91), N2 (c17–c23), N3 (c25, c31–c35, c40), N4 (c46). Chạy ổ cắm → củ sạc → cổng → mạch → pin. | Macro ở N3/N4 | `update(t, power)` hạt trôi dọc đường cong; `setLoss(index, frac)` — `frac` là **phần còn đi tiếp** tại điểm thứ `index`, phần đã mất đổi sang cam và tan (đó là điện thành nhiệt). Ba chỗ phải **mất hạt**: c8–c12 (ở cổng máy, N1), c17–c18 (trong củ sạc, N2), c46 (trong túi pin, N4). | `createCurrentStream(points, { n = 60, speed = 1, color = '#8fe3ff' } = {})` |
| **Nhiệt (hạt cam/đỏ)** | N1 (c9–c12, c90), N2 (c17–c23 — trước c17 củ sạc chưa nóng, nên chưa có hạt cam nào trong khung), N3 (c32–c34, c41, c50), N4 (c47–c49), N5 (c51–c55). Mọc ở chỗ sinh nhiệt, bay lên. | Close-up | `update(t)` hạt bay lên và tỏa; `setRate(r)` đậm hơn khi nhiệt nhiều. Ở N2 phim bật/tắt bằng `setRate` theo câu: 0 trước c17, 1 từ c17 đến c23 | `createHeatPlume(point, { n = 40, color = '#ff9a3c' } = {})` |
| **Gợn nhiệt** | N2 (c23 — chỉ khi lời kể nói đến vỏ củ sạc), N4 (c48), N5 (c53–c57). Vệt nóng bay lên từ mặt đồ vật. | Close-up | `update(t)` — vệt mọc lên từ điểm gốc, chạy theo thời gian. Không dùng `squiggle()` của rig: đó chỉ là mảnh vẽ nền. | `createHeatSquiggle(points, { color } = {})` |
| **Vệt nóng cục bộ trên lưng máy** | N1 (c83–c84 — máy thứ hai, một vệt lệch ở **một góc** lưng; c90–c91 — máy đang sạc, **hai vùng**: một ở mạch sạc gần cổng, một ở con chip giữa máy). | Close-up | Đĩa cam-đỏ mờ **dán vào máy** (đi trong group của máy / của trục quay của máy) để máy lật úp vẫn dính đúng chỗ. Tách khỏi `setWarm(k)` của máy: `setWarm` tô **đều** cả mặt lưng, không tạo được vệt lệch. | Nội bộ phim: `PATCH` (một đĩa, máy thứ hai) và `HOT2` (hai đĩa, máy đang sạc) trong `src/film.js` |
| **Cuộn biến áp** | N2 (c18–c21). Lõi hình chữ E, dây quấn quanh chân giữa, băng keo. | Macro | `update(t)` rung rất nhẹ | `createTransformer({ r = .0075, h = .013 } = {})` |
| **Mỏ tản nhiệt** | N2 (c21–c22). Tấm nhôm có gân. | Close-up | `setWarm(k)` ấm dần (màu toon) | `createHeatSink({ w = .030, d = .014, fins = 7, t = .0016 } = {})` |
| **Cuộn cảm dây đồng** | N3 (c30, c33). Lõi hình trụ, **ống chỉ màu kem**, **sáu vòng dây đồng xen kẽ hai tông** (đồng sáng `#c9743a` / đồng tối `#9c5326`) — phải nhìn ra là dây quấn quanh lõi, không phải nắp vặn. | Macro | `setCurrent(k)`: k=0.35 → dòng hạt thưa; k=1 → dòng dày, **hạt đỏ bám quanh nhiều hơn hẳn** (hạt đỏ = nhiệt) | `createInductor({ r = .0062, h = .0075 } = {})` |
| **Con tụ** | N3 (c30). Vỏ trụ xanh lam có sọc, nắp nhôm, hai chân. Đứng **giữa con chip sạc và cuộn cảm** để nhát c30 thấy đủ ba vật được lời kể gọi tên (chip · tụ · cuộn cảm). **Không** chữ/số trên vỏ tụ. | Macro | Không (đứng yên) | Có sẵn trong `createBoard()` (vỏ xanh `#2d4f8f`); nếu không tìm thấy, `src/film.js` tự dựng một con (`findCapacitor()` / group `tu-dien`) |
| **Chip sạc** | N3 (c30). Con chip epoxy đen, chân hai bên, chấm chân một. | Macro | Không có `setWarm`: nắp chip của rig in sẵn chữ `IC-7404` / `2416` → **phải xoá** bằng `cleanChip()` (xem "Rủi ro" mục 8) | `createBoard()` (phần chip sạc) |
| **Bo mạch** | N3 (c25–c26, c28–c30). Bảng mạch xanh, đường mạch vàng, chân vàng, **hai mực silk `20 V` và `4 V`**. | Medium | `setSilk({ port, cell })` đặt hai mực silk đó. **Không dùng** `pcb()` của rig: bo của rig 0,3 × 0,2 m (lệch cỡ mười lần) và không có API đặt mực. | `createBoard({ w = .090, d = .050, t = .0016 } = {})` |
| **Cảm biến nhiệt** | N3 (c74–c78). Miếng nhỏ trên bo, hai chân, thang bên cạnh có vạch không số. | Macro | `setHot(k)` đổi màu khi nóng, dòng hạt chậm lại; `setMark(45)` hiện **vạch đỏ 45 °C** — đây là chỗ duy nhất trong phim được vẽ ra con số 45 | `createThermalSensor({ w = .0058, d = .0038, t = .0022 } = {})` |
| **Cổng USB-C** | N3 (c25, c26, c28). Miệng cổng hình chữ nhật bo tròn, lưỡi cắm, chân vàng bên trong. | Macro | Hạt điện chui vào cổng | `createUSBCPort({ w = .0094, h = .0034, d = .0028 } = {})` |
| **Con chip xử lý** | N3 (c37–c41). Chip lớn trên bo. | Macro | Nhấp nháy, nhiệt lan ra. Nắp chip phải sạch chữ (mục 8) | `createBoard()` (chip xử lý) + `cleanChip()` trong `src/set.js` |
| **Mặt cắt điện thoại** | N3 (c24–c41, c69–c78): thân máy đã cưa + **nắp máy** (có màn hình) treo lơ lửng phía trên để thấy màn hình mà không phá mặt cắt. | Close-up | Nắp bật/tắt theo câu (`N3.lid.visible`) | rig `section()` (cắt một lần lúc dựng) |
| **Mặt cắt củ sạc** | N2 (c15–c23). | Close-up | Không | rig `section()` |

---

## Nhóm 3 · Set & Environment

| Tên component | Vai trò & Shot | Hàm |
|---|---|---|
| **N1 · Bàn cạnh giường** | Toàn bộ cảnh mở và kết, và khung thí nghiệm (c61–c68). Bàn gỗ, tường tối ở `z = −0.62`, đèn bàn ấm, ổ cắm trên tường ở `(−0.78, 0.14, −0.60)`. Trên bàn: **một** điện thoại đang sạc ở `(−0.34, 0, 0.06)` + củ sạc có dây ở `(−0.62, 0, −0.34)` + dây nối hai đầu. Từ c61: **cặp thí nghiệm** — máy thứ hai ở `(−0.02, 0, 0.20)` có ốp case úp lên, củ sạc thứ hai ở `(−0.44, 0, −0.52)`, dây riêng, dây nguồn riêng về ổ. | `buildNightstand()` |
| **N2 · Trong củ sạc** | c15–c23. Ruột củ sạc đã cưa: bo của củ sạc, cuộn biến áp, chip, mỏ tản nhiệt, cổng USB-C. Nền tối, một vệt sáng từ đèn bàn. | `buildChargerIn()` |
| **N3 · Trong điện thoại** | c24–c41, c50, c69–c78. Ruột máy đã cưa: khung máy, màn hình (nắp treo lơ lửng), bo mạch, túi pin, cảm biến, chip. | `buildPhoneIn()` |
| **N4 · Trong túi pin** | c42–c49. Mặt cắt túi pin phóng to, năm lớp xếp chồng, dòng điện chạy vào lớp đồng. | `buildCellIn()` |
| **N5 · Vỏ máy** | c51–c60. Lưng máy, ốp case, bàn tay, ba luồng nhiệt dồn về vỏ. | `buildShell()` |

---

## Nhóm 4 · FX & Lighting

| Tên component | Vai trò & Shot | Hàm |
|---|---|---|
| **Đèn chính** | N1: đèn bàn ấm chiếu chéo xuống bàn; N2/N3/N4: một nguồn sáng duy nhất từ phía máy quay, chếch 30–60° lên, để mặt cắt luôn sáng. | rig `keyLight()` + `pool()` |
| **Ambience** | Hemi navy/tím + viền tím cho cả năm nơi. | rig `ambience()` |
| **Tuyệt đối** | Không dùng: hiệu ứng nhiệt dùng hạt + gợn, không dùng hình ảnh nhiệt giả. | — |

---

## Rủi ro lắp ghép đã tính trước

1. **Một điện thoại, ba nơi — nhưng chỉ MỘT cái máy thật.** N1, N3, N5 đều có điện thoại; chúng là
   cùng một vật ở ba trạng thái (nằm sấp / bị cưa / chỉ còn vỏ). Cách làm trong `src/film.js`: bọc máy
   vào một **trục quay** (`pivot()`), rồi xoay cả trục (`PIV.phone.rotation.x`) và nâng cả trục
   (`PIV.phone.position.y`). **Không** dựng ba bộ vị trí cứng, không dựng ba cái máy khác nhau.
   Màn hình là một mặt phẳng nằm ở **mặt trên** của máy, nên mọi khoảnh khắc "màn hình sáng"
   phải tính lại theo hướng lật: máy úp thì đồng hồ sạc nằm sấp xuống bàn. Các điểm lật của máy:
   úp sấp (c1) → ngửa lên (c2) → úp lại để thấy lưng (c3–c4) → ngửa lên (c5) → **úp xuống lần
   nữa ở c90** để thấy hai vùng nóng trên lưng → ngửa lên (c94). Máy thứ hai có trục riêng
   (`PIV.phone2`) vì nó còn mang ốp case.
2. **Túi pin xuất hiện ở N3 và N4.** Cùng một vật; ở N4 là bản bị cưa (`createBatteryCut()`), ở N3 là
   bản nguyên vẹn (rig `battery({ kind: 'pouch' })`) — cùng một vật, hai trạng thái.
3. **Cắt một lần cho mỗi vật.** `section()` cắt một lần khi dựng, không cắt mỗi khung hình.
4. **Kích thước.** Điện thoại dài 0,15 m, rộng 0,07 m, dày 0,0085 m. Củ sạc 0,045 × 0,030 × 0,020 m.
   Túi pin 0,062 × 0,090 m. Bo mạch 0,090 × 0,050 m. Các kích thước này là chuẩn của một chiếc máy
   thật, và máy quay cận phải dùng tiêu cự hẹp để thấy được.
5. **Số trên nhãn.** Chỉ bốn con số được lên hình: `60 W` (nhãn củ sạc), `20 V` và `4 V` (mực silk
   trên bo mạch), `45 °C` (vạch đỏ trên **cảm biến nhiệt trong máy**). Mọi con số vẽ ra đều có câu
   lời kể đọc — xem `research/FACTS.md`. Không vẽ con số nào mà giọng không nói. Nhiệt kế ngoài vỏ
   **không** mang vạch đỏ: 45 là mốc của tế bào pin, không phải nhiệt độ mặt lưng.
6. **Dây cắm đúng cổng.** Đầu USB-C phải cắm đúng `plugPoint` của máy (mép trái, `x = −W/2 − 0.0022`)
   và đầu kia vào `usbPort` của củ sạc (`(0, H·0.48, D/2)` trong khung của củ). Dùng `layCable()` để
   đặt cả hai đầu, đừng đoán tay.
7. **Ốp case — chỉ một quy ước vị trí nghỉ.** `createCase().setOn(false)` tự dời ốp đi **+0,52 m theo
   x, +0,04 m theo z**; phim (`applyCase()`) lại tự dời ốp của máy thứ hai sang **+0,20 m theo x,
   +0,14 m theo z**. **Quy ước của phim là quy ước duy nhất**: trong phim, vị trí nghỉ của ốp do
   `applyCase()` đặt; `setOn(false)` không được gọi cho ốp của máy thứ hai (nếu gọi, ốp có thể rơi
   khỏi bàn hoặc đè lên máy). Ốp ở N5 thì dùng `setOn()` như bình thường.
8. **Xoá chữ và số của rig trước khi lên hình.** Rig in sẵn `IC-7404` / `2416` trên nắp chip và
   `3.85V 4500mAh` trên nhãn túi pin — cả hai đều là số ngoài danh sách bốn số được phép, và điện
   áp danh định là thứ `FACTS.md` cấm nói. Mã đã có `cleanChip()` và `cleanPouch()` trong
   `src/set.js`: **mọi chip và túi pin lấy từ rig đều phải qua hai hàm đó.**
9. **Nhiệt của vỏ củ sạc.** `setWarm(k)` của củ sạc chỉ tô **mỏ tản nhiệt**. Câu c23 ("Nó nóng lên ở
   vỏ củ sạc") đúng vì `buildChargerIn()` quét toàn bộ vật liệu của nhóm cắt, không phải vì gọi
   `charger.setWarm()`.
10. **Vệt nóng phải neo vào máy.** `PATCH` (một vệt lệch ở góc lưng, c83–c84) dán vào group quay
    của máy thứ hai; `HOT2` (hai vùng nóng, c90–c91) dán vào chính group của máy đang sạc. Nếu dựng
    vệt nóng riêng ngoài máy thì vệt sẽ nằm sai khi máy lật úp.
11. **Cặp máy thí nghiệm phải sạc giống nhau.** Hai máy, hai củ, hai dây, mỗi củ một dây nguồn về ổ
    trên tường. Đó là lý do `FACTS.md` nói nhiệt độ hai máy khác nhau là do **đường thoát nhiệt**
    (có case / không case), không phải do công suất sạc khác nhau — nếu một máy không cắm sạc thì
    lời kể "cùng sạc, cùng một chỗ" sai trên hình.
12. **Thẻ chữ bám vào đúng vật, và điểm neo đọc từ bộ dựng cảnh.** Mỗi thẻ trong `CARDS`
    (`src/film.js`) lấy điểm neo từ chính vật (`P3(...)`, `wp(...)`) — không gõ toạ độ tay. Thẻ
    `DÂY NGUỒN` neo vào `N1.cordNear`: điểm giữa đoạn dây nguồn ngay dưới phích cắm, do
    `src/set.js` tính từ chính đường dây (`CORD_PTS`) chứ không đoán. Thẻ trên hình chỉ được là
    **thuật ngữ** (`Ổ CẮM`, `CỦ SẠC`, `MẠCH HẠ ĐIỆN ÁP`…), không phải câu lời kể hiện lên rồi
    biến mất (`VỪA SẠC VỪA CHƠI GAME`).
