# COMPONENTS_SPEC — Vì sao phơi quần áo cần gió?

Bóc tách linh kiện 3D của tập, đối chiếu với `voice/lines.json` (60 câu) và `LOOK.md` (60 nhát). Mọi vật có thật đều nằm trong `src/props.js`; bối cảnh và ánh sáng nằm trong `src/set.js`; chuyển động theo thời gian nằm trong `src/film.js`.

Quy ước: **LOD** = cự ly máy thấy vật (`C` cận cảnh / `M` trung cảnh / `B` hậu cảnh). **Trạng thái** = `Tĩnh` / `Động` (có gắn với câu nào trong `lines.json`).

---

## Nhóm 1 — Props (đạo cụ, quần áo, đồ đo)

| Tên | Xuất hiện ở | LOD | Trạng thái | Hàm trong `src/props.js` |
|---|---|---|---|---|
| Dây phơi thứ nhất (hiên), cọc gỗ, dây chùng | c1, c47, c48, c50, c56–c58 | M | Động: dây đung đưa theo gió (`line.setSway`, dịch cả dây chứ không xoay quanh tâm) | `dryingLine({len:3.8, sag:.26, y:1.55})` |
| Dây phơi thứ hai (trên đầu tường, trong nhà) | c38, c40, c48, c50, c56, c58, c59 | M | Động: đung đưa nhẹ | `dryingLine({len:2.6, sag:.2, y:1.98})` |
| Kẹp quần áo gỗ (3 trên dây 1, 1 trên dây 2) | c1, c38, c47, c48, c50, c56–c59 | C/M | Tĩnh, đặt theo `line.yAt(x)` nên kẹp đúng chỗ dây chùng | `clothesClip()` |
| **áo phông còn ướt (màu sẫm)** — dựng bằng `ExtrudeGeometry` theo hình áo (cổ tròn viền gân, vai, tay áo, thân), có giọt bám ở mép, mảng ẩm và vệt nước chảy | c1–c2, c47, c56–c58 | C | Động: ướt→khô theo thời gian (`setWet`) | `tShirt({color:'#f2f0e6', wetColor:'#aab2c4'})` |
| **áo phông đã khô (màu sáng)** — **không phải một vật riêng**: cùng đạo cụ `shirt` của áo ướt ở hiên, chỉ khác là nó khô dần theo thời gian (`wetColor:'#aab2c4'` → `#f2f0e6`, mảng ẩm tan dần) | c56–c58 | C | Động: khô dần theo thời gian (`shirt.setWet(1 − clamp((t−110)/50)·.95)`) | `tShirt({color:'#f2f0e6', wetColor:'#aab2c4'})` — **cùng một đạo cụ**, không dựng thêm |
| **quần đùi hai ống** (navy) trên dây 1 | c1, c47, c50, c56–c58 | B | Động: đung đưa | `trousers({color:'#4a5a86'})` |
| Khăn tắm có mép tua (vàng) trên dây 1 | c1, c50–c51, c56, c58 | C | Động: ướt→khô (`setWet`), có loang ướt ở mép | `towel({color:'#f2c14e'})` |
| **áo thun mỏng** (xanh nhạt) trên dây 1 — vật liệu cần texture dệt canvas có seed (độ mỏng phải đọc được ở c50) | c48, c50, c56, c58, c59 | B | Tĩnh | `thinTee({color:'#9fd8e8'})` |
| Áo phông thứ hai trên dây 1 (xanh teal, `x = 0.85`, **đứng cạnh áo thun mỏng ở `x = 1.50` chứ không chồng sau nó**) | c50, c56, c58, c59 | B | Động: khô dần theo thời gian | `tShirt({color:'#5d8fa6', wetColor:'#5d8fa6'})` |
| **Áo A** trong luồng gió của quạt (đứng trước quạt) | c5, c7, c19–c26, c28, c30–c32 | C | Động: nhạt màu dần khi có gió (`setWet`), bay nhẹ | `tShirt({wetColor:'#aab2c4'})` |
| **Áo B** ở **góc xa** phòng, ngoài luồng gió, vải navy `#4a5580` (sẫm hơn hẳn áo A) `(2.30, 1.42, −5.05)`, có đèn góc lạnh nhỏ `#8ea6ff` ở `(2.45, 1.78, −5.30)` để lộ ra mà vẫn sẫm | c5, c7, c29, c52–c53 | C | Động: **luôn sẫm** (`setWet(1)`), đứng yên | `tShirt({color:'#4a5580', wetColor:'#39405e'})` |
| **đàn áo phơi chồng trên dây** (3 cái, có dây phơi chạy qua vai, kẹp bám đúng vai) | c38, c40, c47, c48, c50, c56–c59 | C | Động: rung nhẹ | `shirtPile({n:3})` |
| **Áo phơi một mặt**: nửa khô (sáng) – nửa ẩm (tối) | c48, c50, c56, c59 | C | Tĩnh (tương phản nửa sáng nửa tối) | `halfShirt({w:.60,h:.74})` |
| **Cái áo úp**: áo phông còn ẩm **úp mép dưới lên** (nửa dưới gập lên nửa trên quanh một nếp gấp thật), nằm **trên mặt bàn phơi gỗ** (`x = −1.30`, mặt bàn `y = .42`) cạnh cái áo phơi rộng — vẫn thấy cổ, vai, tay áo, còn mảng ẩm nằm ngang trên mặt gấp; màu **không trắng cháy** (người chấm vòng 5 nói bản cũ mất sạch chi tiết vải) | c49 | C | Tĩnh (nằm trên mặt bàn phơi) | `foldedShirt({color:'#b3c3cf', wetColor:'#7d93a3', w:.62, h:.72})` |
| **áo phơi rộng: cả hai mặt phơi ra** (đối chiếu c49: nằm ngửa, hai mặt thông) — **trải phẳng trên mặt bàn phơi gỗ** (`x = −0.55`, mặt bàn `y = .42`), cạnh cái áo úp; màu **không trắng cháy** (vòng 5). Ở c60 **không còn bàn phơi nào** — hình kết là một cái áo úp còn ẩm nằm trên sàn (xem hàng dưới) | c49 | C | Tĩnh | `spreadShirt({color:'#e3d8bd', w:.62, h:.66})` |
| **Cái áo úp còn ẩm nằm một mình trên sàn hiên** — hình kết theo `TREATMENT.md`: một cái áo úp sấp trên gạch, **không chồng lên món nào**, mặt nhìn thấy là mặt ẩm nên **màu lạnh ẩm** (tách được khỏi nền gạch ấm); dưới nó có vệt ẩm | c60 | C | Tĩnh | `tShirt({color:'#c9d3d7', wetColor:'#a2b4c0', w:.60, h:.72})` + vệt ẩm `floorWetPatch` (trong `src/set.js`) |
| Bồn chậu nhựa có nước (dưới áo ướt) | c1, c60 | C | Tĩnh | `basin()` |
| **ghế gỗ** (hiên, đứng trống bên trái) | c1, c47, c57, c58 | C | Tĩnh | `chair()` |
| **Bàn phơi gỗ** (`dryBench`, mặt gỗ ở `y = .42`) — bàn thứ nhất `2.30 × .82` đặt ở `(−0.75, 0, 1.30)` **giữ cái áo úp và cái áo phơi rộng**; bàn thứ hai `1.10 × .74` đặt ở `(1.20, 0, 1.36)` **trải phẳng, không chồng quần áo**. Ở c60 **hai bàn cùng ẩn đi** (cờ `noBench2`): hình kết phải là cái áo úp trên sàn, không phải bàn phơi | c49 | C | Tĩnh | `dryBench()` ×2 |
| **bàn thấp đặt quạt** | c3, c5, c6, c19, c27, c30, c33, c54 | M | Tĩnh | `sideTable()` |
| **quạt bàn có lưới** (đầu quạt, cánh quay, lưới) — vỏ, nan lưới và lưới mặt trước cần texture kim loại canvas có seed (nhát c6 đẩy sát miệng quạt, c54 đưa cả đầu quạt vào khung) | c3, c5, c6, c19, c27, c30, c31, c33, c54 | C | Động: quay (`spin`), **tắt ở c52–c53** (`setSpeed(0)`) | `deskFan()` |
| **quạt nhỏ trên bàn thí nghiệm** (đáy đế ở `y = .72`, **tâm đầu quạt ở `y ≈ 0.98`** — đo tâm đầu, ngang tầm mặt kính) | c5, c7, c29, c35, c36, c52, c53 | C | Động: quay — `setSpeed(2.0)` được gọi trong `BAL.update` khi cờ `lab` bật | `deskFan()` (thu nhỏ 0.62) |
| **quạt nhỏ trên kệ gỗ** (đáy đế ở `y = .745`, **tâm đầu quạt ở `y ≈ 0.98`** — đo cùng thước với quạt trên bàn thí nghiệm; nhóm quạt đặt ở `y = .745` rồi thu nhỏ `scale .55`, cuối kệ bên phải `x ≈ −1.10`, quay ngang sang trái) | c5, c27, c30, c33, c53 | C | Động: quay — `spin` + `setSpeed(1.8)` trong `BAL.update`; là nguồn gió của **cái áo đã nhạt** (cân phải, 88 g); cái áo còn ẩm (cân trái, 288 g) nằm ngoài luồng gió | `deskFan()` (thu nhỏ 0.55) |
| **túi nylon buộc dây** (hiên, `x = 1.86`) | c50, c56, c59 | B | Động: đung đưa (`swing`) | `nylonBag()` |
| **Hai cân nhà bếp** (mặt đồng hồ kim, hai kim lệch nhau) | c3, c5, c6, c27, c30, c33–c34, c53, c54 | C | Động: kim chỉ hai vị trí khác nhau (`setReading(.72)` = 288 g, `setReading(.22)` = 88 g) | `kitchenScale()` ×2 |
| Hai áo nhỏ treo trên **thanh treo ngay trên kệ** (thanh kim loại `y ≈ 1.54`, **hai móc ngắn ở `x = ±.15`** — trùng vị trí hai cái áo, móc cũ ở `±.24` làm áo lệch 9 cm), mỗi áo treo đúng trên một cái cân | c3, c4, c5, c27, c30, c33, c53, c54 | M | Động: cân trái mang áo còn ẩm (nặng, 288 g), cân phải mang áo đã nhạt (nhẹ, 88 g) | `tShirt({w:.30,h:.40})` ×2 (`scale .9`) |
| **Bàn gỗ với hai mặt kính ĐỨNG trên đế gỗ (kính trong suốt, nhìn xuyên thấy vân gỗ của mặt bàn), một vách ngăn kính RỘNG trải hết chiều sâu bàn dựng ở giữa, hai thanh giữ** | c5, c7, c29, c35–c37, c52, c53 | C | Tĩnh; vách ngăn là vật thể thật, cao trên đỉnh luồng gió; mỗi mặt kính có một giọt nước có meniscus | `labTable()` |
| **Nhiệt kế treo tường** (cột số, chất lỏng) — **luôn đọc hai mươi lăm độ** trong suốt phim (`tempTrack` kẹp cứng ở `.375`), thang số 10–50 | c38, c39, c40, c44, c58 | C | Động: mực chạy theo nhiệt độ (`setTemp`) | `thermometer()` (một chiếc duy nhất treo tường) |
| **Nhiệt kế thứ hai đặt cạnh tấm vải thử** (`thermo30`, tường hiên `x = −2.45, y = 1.70`) — **đọc ba mươi độ**, cột thuỷ ngữ đứng đúng vạch 30; đây là thiết bị câu 44–45 đọc, tách bạch khỏi nhiệt kế treo tường (luôn 25 °C) để không đọc ra hai con số nhiệt độ mâu thuẫn | c44, c45 | C | Tĩnh về vị trí; cột đứng yên ở vạch 30 (`setTemp(.5)`) | `thermometer()` — chiếc thứ hai dựng trong `set.js` |
| Ẩm kế treo tường (đồng hồ tròn, kim, vạch đỏ 100 %, **không có ô số in sẵn** — số do thẻ `label()` đặt cạnh) | c38, c40, c41–c43, c45–c47, c58 | C | Động: kim chạy theo độ ẩm (`setRH`): **chín mươi phần trăm ở mọi nhát** (đúng con số câu 46 đọc) — **kim hết cung (bão hoà) ở c41–c44** (câu nói không khí *chứa được tối đa* 20 g/kg), rớt xuống khoảng 70 % ở c45 (tấm vải ấm làm không khí quanh nó khô đi), rồi trở lại chín mươi phần trăm ở c46 và các nhát sau | `hygrometer()` |
| **Ẩm kế thứ hai** (`hygro2`) — đồng hồ đối chiếu, đứng yên ở nửa; **đã tắt vĩnh viễn** (`opt.hygro2` luôn `false`) vì lời kể không đọc con số nào như vậy, và hai đồng hồ đọc lệch nhau đọc ra như một tỉ lệ giữa chín mươi và nửa | không dùng | — | Động (đứng yên) | `hygrometer()` — chiếc thứ hai trong `set.js` |
| **bàn tay người** (bàn tay có ngón, đốt, móng; không có nhân vật) — da cần texture canvas có seed (c20 và c55 đều là cận cảnh) | c20, c54–c55 | C | Động: chạm áo rồi rút lại; đưa vào luồng gió nằm ngang, mu bàn tay ngửa ra cho máy; `pose(curl, spread)` xoay các ngón | `hand({skin, size})` |
| **sợi vải đan cận** (hai sợi lớn ở tiền cảnh đan chữ V, một sợi chéo nền mờ, hai sợi mảnh) | c8–c9, c11–c12 | C | Tĩnh | `wovenFibres()` |
| **tấm vải dệt: sợi dọc luồn qua sợi ngang** — **18 sợi dọc × 18 sợi ngang** (`PITCH = .34/18 ≈ .0189`, bán kính sợi `PITCH·.52 ≈ .0098` — sợi thưa nên sợi phải **to**, để người xem thấy sợi nào nằm trên sợi nào ở từng điểm giao; bản 44 × 44 đọc ra như một tấm bìa có vân in — nhận xét nghiệm thu vòng 1, 0:32–0:37), sợi ngang uốn lên–xuống theo cos nên **đổi trên–dưới ở mỗi lần cắt** (`A = rad·1.05·cos(π·ph)`, `rad` là bán kính rung của riêng sợi đó), sợi không đều tăm tắp (lệch nhẹ, bán kính `0.74–1.30 r`), vân xơ tua nằm trong texture canvas (`repeat(2,22)`); có **lớp vải nền mờ** phía sau để khe hở không thấy thẳng ra nền | c10 | C | Tĩnh; **trọn tấm đan trong khung** (fov 30, máy lùi ra `z = .46`) | `wovenCloth({n:18, size:.34})` (mặc định `r` = `PITCH·.52`) — đặt lệch sang phải–sau trong bối cảnh N2 tại `(.205, −.010, −.085)`, **nghiêng** `Ry .20`, `Rx −.12` để có chiều sâu |
| **Sợi chéo nền mờ + hai sợi nền mảnh** (tầng hậu cảnh của N2, cho chiều sâu; không phải một mảnh vải liền khối) | c8, c11–c12 | C | Tĩnh | trong `wovenFibres()` |
| **Giọt nước đọng trên sợi** (hình giọt nhọn) — nhát c9 là fov 12 nên sợi và giọt đều là vật cự ly cận: cần texture canvas có seed (vân xơ của sợi) và điểm sáng trên mặt giọt | c9, c11 | C | Động: nhỏ dần (`setSize`) | `dropOnThread()` — ở c9 là chủ thể một mình trên nền tối (fov 16) |
| **mặt nước cận có gợn sóng** | c13–c18 | C | Động: gợn chạy | `waterSurface()` |
| **Giọt nước rơi từ mép khăn** — mép khăn là tiền cảnh siêu cận (c51, fov 30): cần texture canvas có seed cho tua rua và vệt ẩm ở mép | c51 | C | Động: bám ở mép vải rồi rơi, nhỏ dần khi rơi | `hemDrop()` |

---

## Nhóm 2 — Internal parts (ruột & cơ chế vi mô)

| Tên | Xuất hiện ở | LOD | Trạng thái | Cách dựng |
|---|---|---|---|---|
| **Ba giọt nước bám theo mép áo A** (không rơi, bám trên mép vải) | c1, c2, c25–c26, c47 | C | Tĩnh theo mép vải | ba giọt teardrop nằm **trong đạo cụ `tShirt`** (mép dưới, toạ độ cục bộ sát mép, trải hẹp `x ∈ [−w·.10, 0, +w·.10]`) — nhóm `hemBeads` cũ trong `set.js` đã **xoá** vì nằm dưới sàn cách áo A gần 3 m; giọt **chỉ bật** cho áo A và áo ướt ở hiên (`tShirt({drops:true})`), các áo khác không mang giọt |
| **Cầu nước trong khe giữa hai sợi** — mặt nước ở `−DIP·0.30` (gần đỉnh sợi), một dải mỏng bắc ngang khe với meniscus lõm nhẹ ở giữa, mép sáng ở hai bên, một giọt treo thẳng xuống trong khe | c8, c11 | C | Tĩnh | dải mảng trong suốt + **cầu nước** + 4 giọt nhỏ, dựng trong `wovenFibres()` (`filmG`) |
| **Vệt nước bám trong xơ ở rìa sợi** | c12 | C | Tĩnh | **hai mảng phẳng** (`PlaneGeometry` + `TEX.radial()`) trong `wovenFibres()`: một dải dài nằm dọc sợi và một dải ngắn ướt hơn ở mép |
| **Xơ quanh rìa sợi** | c12 | C | Tĩnh | xơ nằm **trong texture** của sợi (không dựng sợi tơ rời: ở cự ly siêu cận chúng thành que đen) |
| **Hạt hơi nước bốc lên từ giọt** (14 hạt, bán kính 4.5 mm, bay lên từ giọt ở `y ≈ 0.125 → 0.425`) | c8–c12 | C | Động: bay lên (`setDot`) | `glowDots(14,.0045,PAL.cyan,.95)` — `k < 1` để hạt không cháy trắng (vi phạm STYLE.md) |
| **Hạt hơi nước bốc lên vào khoảng không phía trên mặt áo** (18 hạt, r 5.5 mm, từ mặt áo A lên `y ≈ 1.44 → 1.86`, `z ≈ −3.22`) | c23 | C | Động: bay lên (`vapUpSpk`) — vật thể chứng minh lời “chỗ trống đó, hơi nước mới đi được” | `glowDots(18,.0055,'#cfeeff',.85)` trong `set.js` |
| **Vệt gió hạt khí của quạt nhỏ trên kệ** (12 hạt, r 9 mm) | c33 | C | Động: chạy từ miệng quạt sang trái, `x = −1.12 → −1.74`, `y ≈ 1.02–1.20`, `z ≈ −5.55`; chạm vào cái áo đã nhạt rồi tắt trước cái áo còn ẩm | `fanCSpk` trong `set.js` |
| **Phân tử dưới mặt nước** | c15–c16 | C | Động: nhảy lung tung | `waterSurface()` — các quả cầu dưới mặt |
| **Một phân tử bứt ra khỏi mặt nước** | c17–c18 | C | Động: bay lên khỏi mặt | `waterSurface()` — quả cầu tách ra |
| **Luồng gió trong phòng** (40 hạt khí tròn, có quán tính, chạy từ miệng quạt lên tầm áo) | c3, c5–c7, c19–c28, c30–c31, c54–c55 | C/M | Động: hạt bay theo vị trí tính theo thời gian | `glowDots(40,.0045,'#a8dcf2',.95)` + `setDot()` trong `set.js` |
| **Lớp hơi ẩm bám sát mặt áo** (mảng alpha, dày dần rồi bị gió quét) | c22–c26, c28, c30–c32 | C | Động: độ đục tăng theo thời gian, có viền sáng ở mép trên | `TEX.radial()` + `fxLayer()` trong `set.js` (`BAL.mist`, `BAL.mistRim`) |
| **Lớp hơi mờ đục quanh áo ướt ở hiên** (không khí ẩm 90 %) | c47 | C | Động: độ đục **.32** (chỉ hiện ở c47) | `BAL.mistBal` |
| **Lớp hơi bám quanh áo còn ướt ở góc phòng** | c52–c53 | C | Động: độ đục **.22** | `BAL.mistFar` |
| **Hạt hơi nước bị gió chở đi** — hai tầng: hạt cứng 30 hạt (r 4.2 mm, k .80) + hạt mềm 12 hạt (r 10 mm, k .35); bay từ `x = 0.46` sang `1.72` theo trục gió, `y ≈ 1.16–1.25`, `z ≈ −3.19` | c30–c31 | C | Động: hai tầng hạt chạy song song, cỡ hạt không đều nên nhát siêu cận c30 vẫn thấy một vệt mềm | `vapTrailSpk` + `vapTrailSoft` trong `set.js` |
| **Hạt hơi nước lơ lửng quanh áo ướt ở hiên** | c47 | C | Động: `glowDots(12,.011,'#9fdcf0',.85)` tản đều, chậm | `vapBal` trong `set.js` |
| **Hai giọt nước trên hai mặt kính** (bên có gió nhỏ nhanh `−70%`, bên sau vách ngăn nhỏ chậm `−35%`) | c35–c37 | C | Động: co lại theo hai tốc độ khác nhau | `labTable().drops` + `set.js` |
| **Luồng gió nhỏ ở bàn thí nghiệm** (hạt khí từ miệng quạt nhỏ, dừng ở vách ngăn) | c35–c36 | C | Động: `labSpk` bay từ `x = 2.30` về `1.74` ở `y ≈ 1.045` | `set.js` (`labSpk`) |
| **Kim hai cái cân lệch nhau** | c33–c34 | C | Động: hai vị trí khác nhau, kim xoay quanh trục Z của mặt đồng hồ | `kitchenScale().setReading()` |
| **Mồ hôi bám trên mu bàn tay** (**mười giọt nhỏ** bán kính **6–8 mm**, **con của bàn tay** nên đi theo bàn tay; **không có mảng alpha** — chỉ mười giọt cầu; giọt nằm **trên mặt mu** `y ≈ .0405` ở tâm vòm, `x ∈ [.02,.17]`, `|z| ≤ .045`, có điểm sáng trên mặt giọt) | c54–c55 | C | Động: mờ dần trong 1 giây khi gió quét | `sweatBeads` trong `set.js` |
| **Hạt mồ hôi bị gió cuốn khỏi da** (6 hạt, r 5.5 mm, bay từ `x = −0.50` sang `0.35`) | c55 | C | Động: bay ra khỏi bàn tay theo vệt gió, lớp fx không viền mực | `sweatSpk` trong `set.js` |

---

## Nhóm 3 — Set & Environment (bối cảnh)

| Tên | Xuất hiện ở | LOD | Trạng thái | Cách dựng |
|---|---|---|---|---|
| Sàn gạch hiên (texture canvas, 8×8 ô, seed) | xuyên suốt N1 | B/M | Tĩnh | `tileTex()` trong `set.js` |
| Tường giấy dán hoa văn (hiên) | xuyên suốt N1 | B | Tĩnh | `TEX.wall()` |
| Bức tường giữa hiên và phòng **có lỗ cửa** | c1, c2, c38, c45, c47, c48, c50, c51, c56–c60 | M | Tĩnh | dựng tay bằng 3 khối quanh lố cửa (không dùng `wallWithHole`) |
| Cánh cửa kính (khung gỗ, ô kính, tay nắm) | c1, c38, c48, c50, c56, c59 | M | Tĩnh (cánh đóng) | `doorLeaf` trong `set.js` |
| Sàn phòng (tối hơn sàn hiên) | nhát trong phòng | B | Tĩnh | `set.js` |
| **Trần phòng** (phòng kín có trần) | nhát trong phòng | B | Tĩnh | mặt phẳng trần `set.js` |
| Tường sau phòng + cửa sổ kín (khung, thanh ngang, thanh dọc, kính) | nhát trong phòng | B | Tĩnh | `set.js` |
| Tường bên trái và bên phải phòng | nhát trong phòng | B | Tĩnh | `set.js` |
| Lan can hiên (cọc gỗ, hai thanh ngang) | c58 | B | Tĩnh | `set.js` |
| Kệ gỗ đặt hai cái cân | c5, c27, c30, c33–c34 | M | Tĩnh | `set.js` |
| Bàn thí nghiệm dọc tường sau `(1.70, 0, −6.15)`, hàng mặt kính chạy ngang | c5, c7, c35–c37 | C | Tĩnh | `labTable()` trong `set.js` |
| Đồng hồ treo tường sau lưng hai cái cân | hậu cảnh nhát phòng | B | Động: kim chạy chậm | `clock()` |
| Bồn chậu, ghế, túi nylon | hậu cảnh | B | Tĩnh / đung đưa | `set.js` |
| **Thanh treo áo trong phòng kín** (thanh thép ngang `y = 1.50, z = −3.38`, 2 chân đỡ, **1 móc treo** — nó chỉ giữ áo A) | c19–c26, c28, c30–c32 | C | Tĩnh | dựng trong `set.js`; vai trò "hai áo treo cạnh nhau" nay thuộc về **hai áo nhỏ trên kệ** (c4, c33) |
| **Thanh treo áo B ở góc xa phòng** (thanh thép **dọc** theo tường phải `x = 2.42`, `y = 1.50`, `z = −5.05`, 2 chân đỡ ở `z = −5.65` và `−4.45`, **1 móc** ở `x = 2.37`) — nó giữ **áo B** đứng ở `(2.30, 1.42, −5.05)` | c5, c29, c52, c53 | B | Tĩnh | dựng tay trong `src/set.js` (không có hàm riêng) |
| **Bối cảnh N2 — trong sợi vải** (nền tím sáng dần, đèn xiên từ bên, tấm vải dệt ở hậu cảnh) | c8–c12 | C | Động: giọt nhỏ dần, hạt bốc lên | `buildFabric()` trong `set.js` |
| **Bối cảnh N3 — mặt nước** (nền tối, mặt nước gợn, bờ chật phía sau) | c13–c18 | C | Động: gợn chạy, phân tử nhảy và bứt ra | `buildWater()` trong `set.js` |
| **Bờ chật ở cảnh mặt nước** (khối gỗ phía sau `z = −0.62`) | c13–c18 | C | Tĩnh | `set.js` (`buildWater`) |

---

## Nhóm 4 — FX & Lighting (đèn & hiệu ứng sống)

| Tên | Xuất hiện ở | Vai trò | Cách dựng |
|---|---|---|---|
| **Nắng sớm** (một đèn chính có hướng, đổ bóng rõ qua cửa) | xuyên suốt N1 | vùng sáng nhất ở điểm nhìn, bóng đổ dài trên sàn gạch | `keyLight({from:(-7,6.2,6.5), to:(-1.2,1.1,.6), color:'#ffd9a0', intensity:2.6, size:2.2})` |
| **Ánh sáng môi trường** (hemi + rim tím) | xuyên suốt | giữ bóng đổ không bị đen tuyệt đối | `ambience({hemi:'#8fa2ff', ground:'#3a2a4a', rim:'#9a5be5'})` |
| Đèn tròn trong phòng (2 điểm) + đèn trần + đèn phụ | nhát trong phòng | phòng kín có ánh sáng riêng, không vùng tối không lý giải | `PointLight` trong `set.js` |
| **Vệt sáng mặt trời trên sàn gạch (light pool)** | c1 | dẫn mắt vào chỗ cần nhìn | `pool(scene, {from:(-6.2,5.6,5.6), to:(-.9,0,.9), color:'#ffe2b0', intensity:2.4, angle:.30, penumbra:.8})` — **đã gọi thật trong `set.js`** |
| **Đèn tập trung theo điểm nhìn** (mỗi nhát một cường độ riêng, bảng `FOCUS` trong `film.js`) | xuyên suốt N1/N4 | vùng sáng nhất luôn là thứ đang kể | `SpotLight` `BAL.focus` trong `set.js` |
| **Hơi nước lay nhẹ** (gió ở hiên: vải bay, túi nylon nghiêng, dây đung đưa) | c1 | không khí ngoài trời chuyển động | `BAL.update(t, {wind:1})` |
| **Gió trong phòng** (vệt khí mảnh bay theo hướng gió — **vệt ngắn, có đầu sáng, không phải tia laser dài**) | c3, c5–c7, c19–c28, c30–c31, c54–c55 | cơ chế "gió chở hơi nước đi" | `setStreak()` trên `windSpk` (22 vệt; `windScale` theo từng nhát) — chạy khi cờ `fan` bật |
| **Vệt gió ở hiên** (cùng cơ chế, vệt dài hơn: `windScale` 2.6) | c59 | câu "chỗ nào thoáng gió" cần một luồng khí thật chạy **từ lối mở bên phải sang trái**, cùng chiều với chiếc túi nylon đang vẫy | `setStreak()` + `windSpk.count = 22` (cờ `streak`) |
| **Khí tràn qua lối mở** (`doorSpk`, 18 hạt tròn r 16 mm, `#bfeaf8`) | c58, c59 | nối "trời lạnh ngoài hiên" với "chỗ thoáng gió" | `glowDots(18,.016,...)` + `setDot()` trong `set.js` |
| **Hơi nước mỏng bốc nhanh** (`denseSpk`, 14 hạt tròn r 7.5 mm) | c45 | ba mươi độ → hơi nước bốc **nhanh** và lan rộng | `glowDots(14,.0075,...)` + `setDot()` |
| **Hơi nước đặc bốc chậm** (`slowSpk`, 10 hạt tròn r 14 mm, `#e8f8ff`) | c46 | không khí chín mươi phần trăm → hơi nước **đặc và bốc chậm**; thẻ `×5` bám vào cột này | `glowDots(10,.014,...)` + `setDot()` |
| **Dải mực ở mép áo A** (mặt phẳng `0.68 × .46` trước mép vải `z = −3.245`, co theo mức nước trong vải) | c25, c26 | câu "vùng bão hoà" phải thấy được mực nước dâng lên ở mép áo | `hemBand` + texture canvas `hemBandTex` trong `set.js`; ở c25 mép dải **dao động nhẹ** (`hemPulse`) — vùng bão hoà phải thở, không đứng chết như vệt sơn |
| **Dải hơi nước bay lên** (`vapBand`, mặt phẳng `0.30 × .52` trước áo A `z = −3.255`) | c22, c23, c26 | "hơi nước mới đi được" phải đọc được như một dải khí bay lên | `vapBand` + texture canvas `vapBandTex` |
| **Vệt ẩm bị gió quét đi** (`wetLayer`, mặt phẳng mờ trên vải) | c27 | lớp ẩm bám áo bị quạt quét xa, mờ dần | `wetLayer` + texture radial trong `set.js` |
| Hạt hơi nước bay lên (glow dots) | c8–c12, c47 | hơi nước rời khỏi vải | `glowDots` trong `set.js` |
| **Lớp thẻ thuật ngữ `label()`** — thẻ kem viền mực, chữ đỏ Be Vietnam Pro 900, neo bằng đuôi thẻ vào đúng vật; **29 thẻ**: 10 thẻ **số/đếm** (`2 ÁO`, `1 PHÂN TỬ`, `2 kJ`, `288 g`, `88 g`, `HAI GIỌT NƯỚC`, `3 ÁO`, `20 g/kg`, `30 °C`, `90 %`) và 19 thẻ **thuật ngữ** (`QUẦN ÁO ƯỚT`, `QUẠT`, `CHỖ NÀO CÓ QUẠT`, `KHE GIỮA SỢI`, `HƠI NƯỚC`, `LỚP HƠI ẨM`, `BAO HÒA`, `BỊ QUÉT ĐI`, `HƠI NƯỚC BỊ CHỞ ĐI`, `NHIỆT ĐỘ`, `PHƠI MỘT MẶT`, `ÁO ÚP`, `QUẦN DÀY`, `ÁO MỎNG`, `QUAY LẠI BÁM ÁO`, `MỒ HÔI`, `NƯỚC PHẢI ĐI ĐƯỢC`, `CHỖ THOÁNG GIÓ`, `CẢ HAI MẶT`) | theo câu, mỗi thẻ bật trong một đoạn lời | đặt con số lên đúng đồ đo để máy đo nhịp hết cờ `NUM`; thẻ thuật ngữ đánh dấu vật đang kể | `label()` trong `rig/render.js`, điều khiển bởi bảng `CARDS` trong `src/film.js` (đuôi thẻ vẽ ở khoảng cách cố định từ mép thẻ, nên thẻ phải lệch vật một khoảng `bw/2+26, −(bh/2+44)`; thẻ bị kẹp trong khung và nằm trên dải phụ đề) |
| Viền mực + bloom ngưỡng 1 + grade mực–giấy | mọi khung | phong cách toon của kênh | `rig/render.js` (`F.frame`) |

---

## Cập nhật sau vòng 5 (đạo cụ dựng lại, soi bằng mắt)

Bản đạo cụ viết lại sau phản biện storyboard vòng 4 và bài soi mù vật (`review/PROPS-REVIEW.md`):

- **Áo phông** đọc ra là cái áo thật: hình áo có cổ, vai, tay áo, thân; vải dựng bằng `ExtrudeGeometry` có dày và nếp; thêm viền cổ, giọt bám ở mép và cổ, mảng ẩm có viền mờ, vệt nước chảy dọc.
- **Bàn tay** có ngón, đốt, móng, ngón cái chĩa sang bên; bỏ hẳn ống tay trắng chĩa vào bàn tay.
- **Ẩm kế** là mặt đồng hồ tròn có kim và thang %; bỏ ô số `20 g/kg` in sẵn trên thân (số do thẻ `label()` đặt cạnh).
- **Nhiệt kế** có thang số 10–50 và cột thuỷ ngữ đứng đúng vạch 30 khi câu nói ba mươi độ.
- **Cân nhà bếp** là mặt đồng hồ tròn có số **0–400 g**, kim đỏ ở chính giữa, móc cân lệch tâm; hai kim chỉ lệch nhau (288 g và 88 g).
- **Bàn thí nghiệm** là hai tấm kính **đứng** trên đế gỗ (kính trong suốt, nhìn xuyên thấy vân gỗ mặt bàn), một vách ngăn kính **rộng trải hết chiều sâu bàn** dựng ở giữa có viền và gốc chặn; mỗi mặt một giọt nước có meniscus.
- **Túi nylon** có miệng túm, nút dây và bề mặt gấp bóng.
- **Quần** có cạp, khe đùi và hai ống quần ngắn; **khăn** là hình chữ nhật có tua rua ở một cạnh ngắn; **chậu** là chậu nhựa lớn sâu, vành rộng, hai quai.
- **Áo úp** (vòng 5): thêm đạo cụ riêng `foldedShirt()` — một cái áo phông **úp mép dưới lên**. Nếp gấp là một nửa trụ thật (bán kính 18 mm) chứ không phải lật thẳng tấm vải, nên mép nếp mềm, không răng cưa. Mảng ẩm của nửa dưới nằm **trên mặt gấp**, có ba giọt nước bám. Cổ áo nằm ở nửa trên nên không bị úp phủ: vẫn đọc ra là cái áo, không phải một tấm vải.

---

## Phản biện của Đạo diễn với báo cáo soi tài liệu vòng 2

Báo cáo vòng 2 (`review/ASSET-AUDIT-REPORT.md`) nêu 14 mục: 5 linh kiện bị bỏ sót và 9 mô tả sai. Trạng thái sau vòng 3:

| # | Nhóm | Cách xử lý |
|---|---|---|
| 1, 2 | Quạt nhỏ trên kệ (`fanC`) và vệt gió của nó (`fanCSpk`) | **Sửa trong hình, không chỉ trong tài liệu**: trước đó quạt nằm ngoài bối cảnh (`z ≈ −11`, sau tường) nên lời thoại c33 nói "một áo trước quạt" mà trong khung không có quạt. Nay quạt ở cuối kệ bên phải, quay ngang sang trái; vệt hạt chạy `x = −1.12 → −1.74`, chạm áo 88 g và tắt trước áo 288 g. Đã thêm hàng vào Nhóm 1 và Nhóm 2 |
| 3 | Hạt hơi nước bốc lên trên mặt áo (`vapUpSpk`, c23) | Đã có trong code (`set.js`), nay **thêm hàng** vào Nhóm 2 với trục bay `y ≈ 1.44 → 1.86` |
| 4 | Lớp hơi nước mềm (`vapTrailSoft`) | Gộp vào hàng của vệt hơi nước bị gió chở đi, ghi rõ **hai tầng hạt** (30 hạt cứng + 12 hạt mềm) |
| 5 | "Mảnh vải nền có mép cắt" | **Bỏ tuyên bố**: code không có vật này, và một mảnh vải liền khối trong cảnh "bên trong sợi" sẽ sai hơn. Dấu hiệu liên tục thật nay là **tấm vải dệt** (`wovenCloth`) ở hậu cảnh N2; mục "Phản biện riêng cho yêu cầu số 7" cũng viết lại theo |
| 6 | Số đo `wovenCloth` | Sửa thành **44 × 44, `size .34`, `r .0021`** (nay đổi thành **18 × 18**, `r` theo `PITCH·.52` — xem Vòng 12) và bổ sung chi tiết cấu trúc (đổi trên–dưới theo cos, sợi không đều tăm tắp, vân xơ trong texture, vị trí đặt) |
| 7 | Hạt hơi nước N2 | Sửa bán kính `.012 → .0045`, đổi c_id `c13–c14 → c8–c12` |
| 8 | Vệt hơi nước bị gió chở | Sửa tên `vapSpk` (không tồn tại) → `vapTrailSpk` + `vapTrailSoft`, ghi vùng bay `x .46 → 1.72` |
| 9 | Hạt mồ hôi bị gió cuốn | Sửa `sweatBeads` → `sweatSpk` (6 hạt), tách bạch với mười giọt bám (`sweatBeads`) |
| 10 | Màu vải ướt | Sửa `#7c8296 → #aab2c4` (khớp code) |
| 11 | Cột "Xuất hiện ở" | Sửa 10 dòng: quạt tắt ở c52–c53; bàn thấp c3/c5/c6/c27/c31–c32/c52–c55; sợi vải c8–c9/c11–c12; đàn áo thêm c38/c40; quần và áo thun có c50; ghế và áo phơi rộng có c60; túi nylon hiên ở c59; bức tường có lỗ cửa ở c2/c19/c20/c32; bàn tay ở c20/c54/c55; mặt nước c13–c18 |
| 12 | Texture cho vật quay cận | Ghi rõ yêu cầu texture canvas có seed cho `thinTee`, vỏ/lưới `deskFan` và da `hand` (các nhát fov 12–24) trong cột trạng thái của từng hàng |
| 13 | Tên trong bảng `PROPS` | Các hàng trong Nhóm 1 nay trích đúng tên trong `export const PROPS`; thêm hàng cho biến thể `áo phông đã khô (màu sáng)` |
| 14 | Xơ tua và vệt nước ở rìa sợi | Sửa mô tả cho đúng hình đang dựng: xơ nằm **trong texture** sợi (không dựng sợi tơ rời), vệt nước là **hai mảng phẳng** (`PlaneGeometry` + `TEX.radial()`) |

Ba rủi ro lắp ghép đã sửa **trong code**, không chỉ trong tài liệu:

- **Quạt nhỏ trên kệ thổi ngược, không áo nào đứng trước quạt** → sửa vị trí, hướng quạt và vệt hạt (mục 1 ở trên). Nay c33 đọc được đúng câu chuyện: quạt ở cuối kệ, vệt gió chạm một áo và dừng trước áo kia.
- **Luồng gió trong phòng vượt qua áo B** → vệt gió nay dừng ở `x ≈ 1.05`, trước áo B ở `x = 1.25`, khớp với lời c29 và c52.
- **Hai áo nhỏ trên cân lơ lửng** → nay treo trên một **thanh treo thật ngay trên kệ**, mỗi áo đúng trên một cái cân.

Rủi ro còn lại, đã cân nhắc và chấp nhận: **mảng hơi ẩm là một mặt phẳng phẳng** đặt trước mặt áo A (`z = −3.26`), nên ở cự ly cận (c22, c24) nó có thể lọt qua nếp vải. Ở c22 và c24 mảng đó nằm **trong** vùng vải và đọc ra như một lớp kính mờ phủ lên vải; uốn nó theo nếp vải sẽ tốn thêm một lượt dựng lớn trong khi người xem vẫn đọc "mỏng như một tấm kính mờ" đúng như lời.

## Rủi ro lắp ghép đã xử lý

- **Quạt và hai áo phải cùng khung** (nhát 2–3): quạt ở `x = −1.5`, áo A ở `x = 0.4`, áo B ở `x = 1.25`; luồng gió chỉ chạy tới `x ≈ 1.05` nên áo B luôn ngoài gió (đã sửa: trước đó vệt gió chạy tới `x = 1.65` và đi xuyên qua áo B).
- **Quạt nhỏ trên kệ phải thổi đúng vào cái áo đã nhạt**: quạt đặt ở cuối kệ bên phải (`x ≈ −1.10`) và quay ngang sang trái (`setAim(−π/2)`); vệt hạt khí chạy `x = −1.12 → −1.74`, chạm cái áo ở cân phải (88 g) và **tắt trước** cái áo ở cân trái (288 g). Trước đó quạt nằm ngoài bối cảnh và vệt hạt chạy lệch hẳn vị trí quạt.
- **Hai áo nhỏ trên cân không được lơ lửng**: chúng treo trên một **thanh kim loại ngay trên kệ** (`y ≈ 1.54`, hai móc ngắn), mỗi áo treo đúng trên một cái cân. Trước đó chúng treo trên hai móc lơ lửng cách tường nửa không trung.
- **Bàn thí nghiệm không được chồng lên áo B**: đặt dọc tường sau `(1.70, 0, −6.15)`, hàng mặt kính chạy ngang khung hình.
- **Cái áo úp phải đọc được là "áo"**: treo lên lưng ghế, mặt áo hướng về máy (`rotation.y = .63`); **áo phơi rộng** nằm ngửa trên mặt ghế ngay cạnh để lời so sánh c49 đọc được bằng mắt.
- **Giọt ở mép khăn phải bám trên mép vải**: mép khăn nhăn sóng, có loang ướt, giọt bám đúng mép (`y = 0.7655`) rồi mới rơi, máy bám theo giọt.
- **Đàn áo chồng bị dây phơi thứ nhất che**: nhát 21 đặt máy ở `z = .28` (giữa hai dây), nhìn xuống dây thứ hai.
- **Câu c43 không có nhát nào mang**: gộp vào nhát 18 cùng cảnh ẩm kế.
- **Mặt kính phải ở đúng tầm đầu quạt nhỏ**: đầu quạt nhỏ ở `y ≈ 0.98`, mặt kính nâng trên đế mảnh ở `y = 1.00`, vách ngăn cao tới `y = 1.26` — gió `y ≈ 1.045` bị chặn đúng ở vách.
- **Quần áo không được lơ lửng khỏi dây**: mọi món đặt theo `line.yAt(x)`, kẹp cũng theo `line.yAt(x)`.
- **Gió không được vẽ thành nét laser**: vệt khí phải **ngắn, mảnh và có đầu sáng**, không kéo thành tia dài; hạt khí tròn (`glowDots` + `setDot`) dành cho hơi nước và cho khí tràn qua lối mở. *(Vòng 5 đã đổi cách vẽ gió: trước đây luật này cấm hẳn `setStreak`, nhưng vệt ngắn mới đọc được **hướng** gió — câu 59 "chỗ nào thoáng gió" không có vệt thì không có gió. Vệt dài nhất 30 cm, bề ngang 3.5 mm, có đầu sáng: không phải tia laser.)*

---

## Phản biện của Đạo diễn với báo cáo soi tài liệu vòng 1

Báo cáo vòng 1 (`review/ASSET-AUDIT-REPORT.md`) nêu 9 linh kiện thiếu và 9 rủi ro kỹ thuật. Trạng thái sau vòng 2:

| # | Yêu cầu | Trạng thái |
|---|---|---|
| 1 | Cái áo phơi rộng (đối chiếu c49) | **Đã dựng**: `spreadShirt()` + `setWet()`, đặt cạnh cái áo úp trên ghế; thêm vào Nhóm 1 |
| 2 | Thanh treo áo + móc trong phòng kín | **Đã dựng** (thanh thép ngang `y=1.50, z=−3.38` + 2 móc); tách khỏi dòng hậu cảnh, thêm vào Nhóm 3 |
| 3 | Lớp mồ hôi bám trên bàn tay | **Đã dựng và sửa**: là **con của bàn tay** (`hand.add(sweat)`), mờ dần theo thời gian; không dùng `BAL.mist` (mảng đó nằm trên áo A và đã được tắt đúng ở nhát 24) |
| 4 | Hạt hơi nước bị gió chở đi | **Đã dựng**: `vapTrailSpk` (30 hạt) + `vapTrailSoft` (12 hạt) bay từ mặt áo A theo trục gió |
| 5 | Hạt hơi nước lơ lửng ở hiên | **Đã dựng**: `vapBal` (12 hạt) tản quanh áo ướt ở hiên |
| 6 | Luồng gió nhỏ ở bàn thí nghiệm | **Đã dựng**: `labSpk` (14 hạt) từ miệng quạt nhỏ tới vách ngăn |
| 7 | Vật thể gốc + mặt phẳng cưa `section()` cho N2/N3 | **Dựng theo cách khác — xem phản biện bên dưới** |
| 8 | Vệt sáng mặt trời trên sàn (`pool()`) | **Đã gọi thật** trong `set.js` (vệt nắng hắt qua lan can lên sàn gạch) |
| 9 | Bờ chật N3 + bổ sung bối cảnh N2/N3 | **Đã thêm** vào Nhóm 3 (bờ chật, bối cảnh N2, bối cảnh N3) |

Rủi ro kỹ thuật đã sửa: hạ tầm đầu quạt nhỏ và nâng vách ngăn (nay mặt kính và đầu quạt cùng tầm `y ≈ 0.98–1.00`, vách cao trên luồng gió); neo quần áo và kẹp theo đường cong dây; mảng hơi và các vật bám theo đúng vị trí; `setSway` dịch dây thay vì xoay quanh tâm; vải ở cận cảnh dựng bằng `ExtrudeGeometry` + `TEX.sheet()` nên có dày, có nếp và có texture; ghế dựng thừa trong phòng đã bỏ; import chết đã dọn.

### Phản biện riêng cho yêu cầu số 7 (`section()`)

`rig/section.js` cưa một vật **đã dựng xong** bằng một mặt phẳng và lấp mặt cắt; nó đòi vật gốc có hình khối thật để cưa. Ở đây N2 và N3 là **hai thế giới vi mô** dựng riêng: sợi vải và mặt nước không phải là bản thu nhỏ của cái áo A hay bồn chậu, nên không có mặt phẳng cưa nào cưa được một vật đã hoàn chỉnh mà vẫn giữ được cảm giác "tao đang ở trong tấm áo ướt".

Thay vào đó, liên tục không gian được dựng bằng hai dấu hiệu nhìn thấy được, rẻ hơn nhiều và đúng mục tiêu của phản biện (người xem phải thấy đây là ruột của vật):

- **N2**: hai sợi lớn ở tiền cảnh đan chữ V, một sợi chéo nền mờ và **một tấm vải dệt thật** (`wovenCloth`, 18×18 sợi luồn qua–lướn) ở hậu cảnh bên phải — người xem thấy ngay cấu trúc dệt của vải, và máy vào sát tấm đan ở nhát 10 là lần đầu tiên thấy “các sợi vải đan qua nhau”. Không dựng một mảnh vải liền khối có mép cưa: cảnh N2 là **bên trong** sợi, nên mảnh liền khối sẽ sai hơn là cấu trúc dệt.
- **N3**: **bờ chật** phía sau mặt nước giữ vai trò tương ứng — mặt nước có mép, có bờ, không phải một mặt phẳng lơ lửng trong hư không.

Rủi ro của cách này (người xem không thấy rõ "đây chính là cái áo A") được bù bằng việc nhát 4 và nhát 5 nằm ngay sau nhát 2–3 về mặt áo A trong phòng, và nhát 7 nằm sau nhát 5 về mặt nước trong sợi — mạch hình ảnh đi từ "áo ướt" → "trong sợi áo" → "mặt nước" một cách liền mạch. Nếu phản biện vòng 3 vẫn cho rằng liên tục không đủ, sẽ dựng `section()` thật cho áo A ở nhát 4.

---

## Phản biện của Đạo diễn với báo cáo soi tài liệu vòng 3

Báo cáo vòng 3 (`review/ASSET-AUDIT-REPORT.md`, vòng 3/5, `MISSING_ASSETS_COUNT: 35`) nêu **3 linh kiện bị bỏ sót + 13 hàng sai mô tả/số đo + 19 hàng sai c_id**. Trạng thái sau vòng 4:

### Ba việc sửa trong mã (không sửa được bằng tài liệu)

| Việc | Cách sửa | Ở đâu |
|---|---|---|
| **Ba giọt bám mép áo A nằm dưới sàn, cách áo A gần 3 m** | Nhóm `hemBeads` **xoá khỏi `set.js`**; ba giọt giờ nằm **trong đạo cụ `tShirt`** (teardrop ở mép dưới, toạ độ cục bộ sát mép vải) nên chúng đi theo áo và luôn dính mép | `src/props.js` (`tShirt`), `src/set.js` |
| **`fanB` và `fanC` không bao giờ quay** (`setSpeed` không được gọi ⇒ `speed = 0`) | `BAL.update` nay gọi `fanB.setSpeed(2.0 * (opt.lab ? 1 : 0))` và `fanC.setSpeed(1.8 * (opt.fanC ? 1 : 0))` — cả hai quạt nhỏ quay thật ở nhát của chúng | `src/set.js` |
| **Quạt bàn không có trong ba nhát cốt lõi của lời (c6, c31, c54)** | Dựng lại ba máy: **c6** đặt trên trục luồng gió, miệng quạt trọn khung (fov 30); **c31** giữ quạt ở tiền cảnh trái, vệt hạt khí chạy ngang sang mép áo A; **c54** đưa máy ra **trước** quạt để thấy cả mặt quạt, luồng gió và bàn tay; **c5** lùi ra góc phòng để thấy quạt ở tiền cảnh trái, áo A trong gió và áo B ở góc xa. Cả bốn nhát đã **chụp lại bằng `core/render/still.mjs` để kiểm** | `src/film.js` (bảng `SHOTS`) |

### Ba linh kiện bị bỏ sót — đã thêm hàng

- **Ba giọt bám mép áo A** → hàng mới ở **Nhóm 2** (c25–c26), ghi rõ chúng thuộc đạo cụ `tShirt` và nhóm `hemBeads` cũ đã xoá.
- **Biến thể áo phông đã khô (màu sáng)** → hàng mới ở **Nhóm 1** (c56–c58), ghi rõ dùng chung `tShirt` + `setWet(0)`.
- **Lớp thẻ `label()`** → hàng mới ở **Nhóm 4**, liệt kê đủ **30 thẻ** (11 thẻ số/đếm + 19 thẻ thuật ngữ) và quy tắc neo đuôi thẻ.

### Mười ba hàng sai mô tả/số đo — đã sửa

`A = rad·1.05·cos(π·ph)` và bán kính `0.74–1.30 r`; lời gọi `wovenCloth({n:18, size:.34})`; hai mặt kính của bàn thí nghiệm **đứng** (không nằm ngang); `mistBal` chỉ ở c47 với độ đục `.32`; `mistFar` độ đục `.22`; mồ hôi **không có mảng alpha**, chỉ mười giọt bán kính **2.6–3.6 mm**; **4** giọt trong khe, dựng trong `props.js`; cái áo úp `tShirt({w:.62,h:.72})`; hai áo nhỏ `tShirt({w:.30,h:.40})` ×2 (`scale .9`) với móc ở `±.15`; thanh treo áo trong phòng chỉ có **1 móc**; `fanB`/`fanC` nay **quay**; thêm yêu cầu texture có seed cho `dropOnThread` (c9, fov 12) và `hemDrop` (c51, fov 30).

### Mười chín hàng sai c_id — đã sửa theo bảng của báo cáo

Dây phơi 1 **+c50**; áo phông còn ướt **+c47, c56–c58**; quần đùi **+c56–c58**; khăn tắm **bỏ c22, thêm c1, c56, c58**; áo thun mỏng **+c56, c58**; áo A **bỏ c4**; áo B **bỏ c4**; đàn áo **c38, c40**; áo phơi một mặt **chỉ c48**; nhiệt kế **c38, c39, c44, c45**; ẩm kế **bỏ c39, bỏ c40**; quạt nhỏ trên bàn **bỏ c37**; quạt nhỏ trên kệ **bỏ c34**; bức tường có lỗ cửa **c2, c19, c20, c32**; cánh cửa kính **bỏ c25–c26, thêm c48, c50, c56, c59**; hạt hơi nước bốc lên **c8–c12, c47**; hai áo nhỏ trên kệ **+c4**; vệt gió của quạt nhỏ trên kệ **chỉ c33**; **xoá hẳn hàng túi nylon trong phòng** (xem dưới).

### Hai chỗ Đạo diễn phản biện lại

1. **"Quạt bàn chỉ xuất hiện ở c3 và c27"** (mục 17). Báo cáo đo góc lệch của **máy cũ**. Ba nhát mà báo cáo nêu là cốt lõi cho lời (c6 *"chỗ nào có quạt thì mới có gió"*, c31 *"gió mạnh hơn, lớp ẩm bị quét xa hơn"*, c54–c55 *"vì sao quạt thổi tay lại thấy mát"*) đã **dựng lại máy** để quạt thật sự nằm trong khung (c6, c31, c54 — đã chụp và xem lại). Nay cột "Xuất hiện ở" của quạt là **c3, c5, c6, c27, c31, c54**; `c55` là cận cảnh mu bàn tay nên **không** có quạt (chỉ có luồng gió quét qua da).
2. **"Túi nylon trong phòng không vào khung ở nhát nào"** (mục 20). Đúng, và thay vì chỉ sửa cột c_id, Đạo diễn **xoá hẳn vật thể**: tập chỉ có **một** túi nylon (ở hiên, `x = 1.86`, c59), nên nhóm `bag2` và vị trí đung đưa của nó đã bị gỡ khỏi `set.js`, và hàng tương ứng trong Nhóm 1 đã bị xoá.

### Rủi ro lắp ghép còn lại (đã cân nhắc, chấp nhận)

- Mảng hơi ẩm vẫn là một mặt phẳng phẳng trước mặt áo A (`z = −3.26`), nên ở cự ly cận (c22, c24) nó có thể lọt qua nếp vải; đọc ra là "một lớp kính mờ phủ lên vải" — đúng như lời, nên giữ.
- Kẹp và dây trong đàn áo không đi theo vải khi vải rung; sai lệch nhỏ, không đọc được ở c40 (fov 34).
- Đạo cụ đang được dựng lại theo bài soi mù vòng 3 (`review/PROPS-REVIEW.md`, 16 vật bị gọi sai): hình dạng, chất liệu và tên gọi của các vật trong Nhóm 1 có thể đổi, nhưng **vị trí, quy mô và vai trò** của chúng trong bảng này giữ nguyên — báo cáo soi tài liệu vòng 4 sẽ kiểm lại sau khi đạo cụ qua cổng.

---

## Cập nhật sau bài soi tài liệu vòng 5 (`review/ASSET-AUDIT-REVIEW-5.md`)

Bài soi vòng 5 chỉ ra bốn chỗ hình còn sai; bốn chỗ đó đã sửa **trong mã** (`src/set.js`, `src/props.js`, `src/film.js`), không sửa được bằng tài liệu:

1. **"Áo phông thứ hai" bị "áo thun mỏng" che.** `teeBack` dời khỏi chỗ đứng sau `tee` (`x = 1.50`): nay nó đứng **cạnh** ở `x = 0.85`, và thêm kẹp gỗ thứ tư trên dây. Kiểm ở c50, c56, c58, c59: hai cái áo đọc ra là hai cái riêng.
2. **Ba giọt bám mép đọc thành ba hạt tối.** Nguyên nhân: giọt có viền mực đen trên nền vải sáng. Mọi giọt bám và giọt rơi của áo phông nay nằm ở **lớp FX** (không viền mực), thân giọt `#8fdcf6` bán trong suốt, có một quả cầu trắng nhỏ làm điểm sáng. Ở c25 chúng đọc ra là giọt nước.
3. **"Cái áo úp" không đọc ra là cái áo.** Trước đây nó là một chiếc `tShirt` khoác lên lưng ghế, nhìn từ máy chỉ thấy một mảnh vải dựng đứng — không có cổ, không có tay áo, nên không đọc ra là áo; thẻ `ÁO ÚP` chỉ vào một mặt ghế trống. Nay:
   - Đạo cụ riêng `foldedShirt()`: áo phông **úp mép dưới lên**, nếp gấp là nửa trụ bán kính 18 mm, mảng ẩm nằm trên mặt gấp, ba giọt nước bám, cổ áo vẫn lộ (nằm ở nửa trên).
   - Nó nằm **trên mặt bàn phơi gỗ** (`dryBench`, `x = −1.30`), cạnh cái áo phơi rộng — hai cái cùng một khung để so, đúng lời c49.
   - Chiếc ghế trống trở lại là ghế hiên bình thường (không còn mang áo).
4. **Lớp hơi ẩm ở c52–c53 đọc thành tấm kính dựng trước áo.** `mistFar` nay là một **vỏ mỏng chép theo đúng nếp vải** của áo B (mỗi đỉnh dịch theo normal của nó), alpha mờ dần về rìa, `depthWrite: false`, không có tấm kính phẳng nào.

**Dàn lại khung hình liên quan:**

- Nhát **c49** (so hai cái áo): máy ở `(0.20, 1.74, 2.58)` nhìn `(0.20, 0.02, 1.31)`, fov 46 — hai cái áo nằm cạnh nhau **trên mặt bàn phơi gỗ**, vệt nắng rơi **giữa** hai cái nên không cái nào bị cháy sáng. Thẻ `ÁO ÚP` chỉ vào cái áo úp; `CẢ HAI MẶT` (c60) chỉ vào cái áo phơi rộng.
- Nhát **c60** (áo phơi rộng, cả hai mặt): máy ở `(−0.50, 1.86, 2.24)` nhìn `(−0.50, 0.02, 1.72)`, fov 30 — nhìn gần thẳng xuống, cái áo úp **không lọt vào khung**.
- `FOCUS c49` hạ từ `3.0` xuống `2.2` (đèn tập trung không làm cháy vải kem), `DIM c49` giữ `0.85`.

## Vòng 8 — quy tắc "mỗi nhất trong ruột vải chỉ có một vật chính"

Trong bối cảnh N2 (trong sợi vải), tất cả nhát cùng chia sẻ một bàn sợi: 10 sợi lớn chồng lên nhau ở cự ly siêu cận, nên mọi khung trước đây là "một mớ sợi" chứ không phải một vật. Nay mỗi sợi được gắn nhãn trong `src/props.js` (`userData.role`: `hero` cho hai sợi lớn, `aux` cho lưới nền; xơ cũng tách theo hai bộ), và `src/film.js` có bảng `N2VIS` bảo theo nhát:

| Nhát | Chủ thể | `hero` | `aux` | `film` (khe nước) | `fuzz` (vệt ướt) | `cloth` (tấm đan) | `drop` (giọt trên sợi) |
|---|---|---|---|---|---|---|---|
| c8 | khe nước giữa hai sợi | ✓ | — | ✓ | — | — | — |
| c9 | giọt nước đọng trên sợi | — | — | — | — | — | ✓ |
| c10 | tấm vải đan | — | — | — | — | ✓ | — |
| c11 | hai sợi lớn + dải nước giữa chúng | ✓ | — | ✓ | — | — | — |
| c12 | rìa sợi, vệt nước trong xơ | ✓ | — | — | ✓ | — | — |

Nền bối cảnh N2 cũng bớt tím (`#5c5175 → #221f33`), đèn chính ấm hơn (`#fff2dc`), nét mực mảnh lại trong bối cảnh này (`thick 2.2`, `ref .34`) — 96 sợi vải đan vẽ viền mực từng sợi thành một mớ chữ.

## Vòng 10 — vật dựng lại sau vòng chấm 5 (`review/PROPS-DIRECTORS-CUT.md`)

Bảy vật của vòng 5 bị đọc thành **một vật thật khác**; tám vật đã sửa trong hình (bảng đầy đủ ở `review/PROPS-DIRECTORS-CUT.md`, ảnh dựng lại ở `review/props/p_NN.jpg`). Những thay đổi có bản chất **hình dạng và vật liệu**, ghi lại ở đây:

| Vật | Sửa trong `src/props.js` |
|---|---|
| **#2 kẹp quần áo** | lò xo đồng nằm ngoài hàm được **thu vào sát bản lề** (bán kính 3,4–8,6 mm → 2,3–4,2 mm), đổi từ đồng sang **thép** (`#c6ccd6`), hai đầu dây xoắn nằm gọn trên hàm |
| **#9 bồn chậu** | `R = .215`, `H = .150` (thành sâu bằng ~1/3 đường kính), **bỏ bốn chân nhỏ**, nhựa **đục trắng** (`#e9eef0` có texture nhựa), quai cầm web `rbox(.030,.066,.052,.011)` + tay cầm `rbox(.092,.034,.042,.013)`, mặt nước xanh đậm (`#2b7fa0 → #93d3e4`) nằm thấp dưới vành (`RW .166`, `WY .118`) |
| **#17 sợi vải đan** / **#18 tấm vải dệt** | `tubeGeo()` có thêm tham số `flat` **ép dọc theo trục sợi** (0,70 và 0,72): sợi là dải mỏng nằm ngang, không phải ống tròn; màu sợi chuyển sang kem ấm (`#ece0c6` / `#dcd0b2`) |
| **#19 giọt nước trên sợi** | sợi **ép dẹp** (0,52), xơ 34 → 22 sợi, sợi ngắn 6,4 → 4,2 cm, **giọt to lên** (bán kính 2,6 → 4,2 mm); nửa khô và nửa ướt lấy từ **cùng một đường cong** (`framesOf(curve, 90, 0, .48)` và `framesOf(curve, 90, .48, 1)`) nên không còn chỗ gấp khúc giữa sợi |
| **#20 mặt nước cận** | thêm **mép bọt trắng** bám theo đường bờ (dấu hiệu rõ nhất của mặt nước), số gờ sóng 44 → 26 và làm mềm; thêm ba phân tử cố định ở mép nước |
| **#24 giọt nước rơi từ mép khăn** | khăn đổi từ vải cam đậm (`#f2c14e`) sang **khăn terry kem** (`#ece3cf`), cuộn mép vải mảnh lại và cùng tông, **bỏ hẳn hàng núm trắng** |
| **#25 bàn tay người** | cẳng tay **ngắn lại** (27,8 → 20,7 cm), **có tay áo vải cuộn** ở nửa ngoài, bảng chuyển sáng **mềm** (`gradSkin`: 176 → 250 thay vì bóng toon 0,22 làm cẳng tay thành màu gỗ), ngón xòe ra thay vì xếp sát như ngón chân |

### Hình phân tử nước (sửa sau khi dựng hình thật)

Phân tử nước trước đây là **một quả cầu trắng trơn có điểm sáng** — ở các nhát siêu cận nó đọc ra là quả trứng, không phải nước. Nay:

- **Ô xi đỏ** `#d9503f` (cầu lớn) + **hai hiđro trắng** `#f6feff` (cầu nhỏ, bán kính 0,44 lần cầu lớn) xếp chữ V, góc mỗi cạnh 52,25° với đường trung trực (góc H–O–H = 104,5°).
- Dùng chung một hình cho: ba phân tử cố định ở mép nước (`waterMol()`), các cụm phân tử trong lớp nước và trên mặt nước (`cluster()`), và phân tử đang bay lên (`esc`).
- Phân tử đang bay: nhịt `48.6–51.6` (nhát c16) và `51.7–54.0` (nhát c17), cao nhất 5,8 cm trên mặt nước; thẻ `1 PHÂN TỬ` và `HƠI NƯỚC` bám vào **vị trí thật** của nó (`ESC_POS()` trong `src/film.js`).

## Vòng 11 — sau vòng chấm hình thứ năm (`review/REVIEW-DIRECTORS-CUT.md`)

Vòng chấm hình thứ năm bắt ba câu FAIL chặn (c45, c49, c59) và tám câu phải sửa (c25, c34, c38, c40, c44, c46, c60, c5–c7). Những thay đổi có **bản chất đạo cụ / số đo** được ghi ở đây; những thay đổi chỉ là bố cục máy thì thuộc `LOOK.md`.

### Số đo trên đồ đo — khoá lại một lần, không đổi nữa

| Đồ đo | Những chỗ đọc | Luật cứng |
|---|---|---|
| **Nhiệt kế treo tường** | c38, c39, c40, c44, c58 | **luôn 25 °C** (`tempTrack` = `.375` suốt phim) |
| **Nhiệt kế thứ hai** `thermo30` | c44, c45 | **luôn 30 °C**, đứng đúng vạch 30; chỉ hiện ở hai câu đó |
| **Ẩm kế** | c38, c40–c43, c45–c47, c58 | **90 %** ở mọi nhát; **hết cung (bão hoà)** ở c41–c44; rớt ~70 % ở c45; về lại 90 % ở c46 |
| **Cân nhà bếp** | c3, c5, c6, c27, c30, c33–c34, c53, c54 | hai kim **288 g** và **88 g**, không đổi giữa các nhát |

Không có đồ đo nào đọc hai con số khác nhau trong cùng một câu — đó là chỗ người chấm vòng 5 bắt được ở c45 (cột 30 °C nhảy vạch) và ở ảnh kế (`50 %` ở các nhát khác). Từ nay cột `Xuất hiện ở` và cột số đọc trong tài liệu này là **một**: sửa ở đây thì sửa luôn ở mã.

### Đạo cụ và lớp FX thêm trong vòng 5

- **Bàn phơi gỗ** `dryBench()` ×2 (mặt `y = .42`): một bàn giữ cặp áo ở c49, một bàn trải phẳng ở c60 — trước đây cặp áo nằm trên sàn và bàn thứ hai chưa tồn tại trong tài liệu.
- **Hơi nước mỏng bốc nhanh** (`denseSpk`, c45) và **hơi nước đặc bốc chậm** (`slowSpk`, c46): hai cột hơi nước có hình dạng khác nhau, đúng hai câu kể khác nhau.
- **Khí tràn qua lối mở** (`doorSpk`, c58–c59) và **vệt gió ở hiên** (cờ `streak`, c59): câu 59 cần một luồng khí chạy **từ lối mở sang trái**, cùng chiều với chiếc túi nylon đang vẫy.
- **Dải mực ở mép áo A** (`hemBand`, c25–c26) và **dải hơi nước bay lên** (`vapBand`, c22–c23, c26): hai dải khí ở hai câu khác nhau.
- **Cái áo úp** và **áo phơi rộng** đổi màu (`#b3c3cf` / `#e3d8bd`) vì bản cũ trắng cháy, mất sạch chi tiết vải; **áo phơi rộng ở c60 được ẩn đi** để câu "không chồng quần áo lên nhau" không bị phủ bởi chính cái áo của câu 49.

## Vòng 12 — sau vòng nghiệm thu cuối (`review/FINAL-QA-REVIEW-1.md`, 16:31)

Vòng nghiệm thu cuối xem **toàn bộ phim đã dựng** và chỉ ra ba lỗi chặn cùng bảy lỗi nhỏ. Những thay đổi có **bản chất đạo cụ / bối cảnh** được ghi ở đây; phần bố cục máy thuộc `LOOK.md`.

### Đạo cụ sửa trong `src/props.js`

| Vật | Lỗi thấy được trong phim đã dựng | Sửa |
|---|---|---|
| **tấm vải dệt** (`wovenCloth`) | 0:32–0:37: tấm vải đọc ra như **một bìa phẳng có vân in** — không thấy sợi nào nằm trên sợi nào | `n` mặc định **44 → 18** (sợi to, bước đan đọc được); lời gọi trong `src/set.js` dùng **cùng con số** |
| **áo phơi một mặt** (`halfShirt`) | Vùng ẩm là một mảng **xanh xám rất đậm**, gần như hình chữ nhật đen dán lên áo | Vùng ẩm sáng lên: `lerp(1,.20,wet)` → `lerp(1,.40,wet)` (xanh xám vừa đủ, vẫn tối hơn nửa khô) |
| **đàn áo phơi chồng trên dây** (`shirtPile`) | 1:20–1:25: mảng màu **navy sắc cạnh** bên cạnh đàn áo, đứng yên, không có viền mực | Áo ở giữa **nổi vai lên `.050`** và phóng to `1.045`, màu xanh nhạt hơn (`#b9d8ef` → `#c6dae6`) — đọc thành một cái áo có áo khác ở sau |
| **cân nhà bếp** (`kitchenScale`) | Chữ `CÂN` nhỏ trên mặt cân ở cự ly xa đọc như **một vết mờ** | Bỏ hẳn chữ; mặt cân chỉ còn vạch, kim đỏ và vạch đỏ ở mức tối đa |
| **mặt nước cận** (`waterSurface`) | 0:42: bờ cát là mảng **nâu, nhọn dần về một điểm**, đọc thành cành khô cắt ngang mặt nước | Bờ đổi thành **cát ướt xám** (`#9c8a68` → `#6c695e`) và **rộng hơn** (`BW .21` → `.28`) |

### Bối cảnh sửa trong `src/set.js`

- **Cái áo úp còn ẩm trên sàn** (`floorShirt` + `floorWetPatch`): **một đạo cụ mới**, thay cho hình kết cũ (hai bàn phơi gỗ). Mặt nhìn thấy là mặt ẩm nên **màu lạnh** (`#c9d3d7` / `#a2b4c0`) để tách khỏi nền gạch ấm; hai bàn phơi **ẩn đi ở c60** (cờ `noBench2`).
- **Khung cửa, cánh cửa, đàn áo và áo phơi một mặt không đổ bóng** nữa: bóng của chúng đổ xiên vào góc tường phải của phòng kín và vỡ thành mảnh vụn — đó là khối hình học "vỡ" ở c27, chiếm ~1/4 khung hình.
- **Đèn góc xa** (`cornerLamp`) đưa ra khỏi tường và hạ sáng (`.90` → `.30`): nó đứng sát mặt trong của tường và đốt thành một vũng sáng trắng cháy ngay trên chiếc áo tối ở c27.

### Số đo trên đồ đo — không đổi

Nhiệt kế treo **25 °C**; nhiệt kế `thermo30` **30 °C**; ẩm kế **90 %**; hai cân **288 g** và **88 g**. Không đồ đo nào đổi số ở vòng này.

## Vòng 13 — mã neo của nhãn, và danh mục vật cho khớp với phim

Hai việc nhỏ, cùng một ý: **những gì tài liệu nói phải là đúng cái mã dựng**.

### 1. Danh mục vật `export const PROPS` (`src/props.js`) dựng lại đúng như phim

Mục `'tấm vải dệt: sợi dọc luồn qua sợi ngang'` trong danh mục vẫn gọi `wovenCloth({ n: 30 })` trong khi phim dùng **18** — nghĩa là ảnh vật trong tờ mù (`review/props/p_18.jpg`) và tấm vải trong phim là **hai tấm khác nhau**. Nay mục đó dùng **cùng con số 18** (`n: 18, size: .34`), và tờ mù được **dựng lại** từ danh mục đã sửa, nên `p_18.jpg` bây giờ là đúng tấm vải của phim.

Còn một khoảng trống thật, ghi thẳng ra đây: **cái áo úp còn ẩm nằm trên sàn hiên (hình kết, c60) không có mục riêng trong danh mục vật.** Nó là chính đạo cụ `tShirt()` với bộ màu riêng (`#c9d3d7` / `#a2b4c0`), nhưng danh mục vật của tập chỉ liệt kê 26 vật — 26 vật đã qua đúng vòng chấm mù (năm vòng, hết lượt). Thêm vật thứ 27 bây giờ nghĩa là một vật **chưa ai chấm mù**, mà quy trình không cho mở vòng chấm thứ sáu. Nên tài liệu này ghi thẳng khoảng trống thay vì giấu nó: người đọc tài liệu này phải biết rằng hình kết c60 có một vật **không** nằm trong tờ mù.

### 2. Mã neo của nhãn (`anchor:` trong bảng `CARDS`, `src/film.js`)

Nhận xét nghiệm thu cuối ở 2:18 bắt được một lớp lỗi riêng: **nhãn nói về vật nào** — chữ trên nhãn có khớp vật nó chỉ vào không. Máy đo được một phần của lớp lỗi đó: mỗi thẻ trong bảng `CARDS` nay có thể mang `anchor: '<tên vật trong src/props.js>'`, và `channels/tram-nghi-nhieu/tools/check_label_anchors.py` kiểm ba điều: mã neo có trong danh mục không; nhãn có khớp **vật khác** rõ hơn vật neo không; nhãn có đọc ra là của vật khác không.

Mười một thẻ đã có mã neo, và máy báo **không nhãn nào sai**:

| Thẻ | Nhãn | Mã neo |
|---|---|---|
| `doquat` | QUẠT | quạt bàn có lưới |
| `dosoi` | KHE GIỮA SỢI | sợi vải đan cận |
| `do2can` | HAI CÂN | cân nhà bếp có mặt đồng hồ kim |
| `donhiet` | NHIỆT ĐỘ | nhiệt kế treo tường |
| `doam` | ĐỘ ẨM | ẩm kế treo tường có kim |
| `dosucchua` | SỨC CHỨA CAO HƠN | ẩm kế treo tường có kim |
| `dochong` | CHỒNG ÁO | đàn áo phơi chồng trên dây |
| `doap` | ÁO ÚP | áo úp: mép dưới úp lên, mảng ẩm nằm trên mặt gấp |
| `dophan` | PHƠI RỘNG | áo phơi rộng: cả hai mặt phơi ra |
| `doquan` | QUẦN DÀY | quần đùi hai ống |
| `domong` | ÁO MỎNG | áo thun mỏng |

Trong đó có đúng hai nhãn mà vòng nghiệm thu cuối đã bắt lỗi — `dosoi` (0:32–0:37, nhãn chỉ vào mặt sợi chứ không vào khe) và `dochong` (2:18, nhãn chỉ vào một cái áo treo cạnh nhau chứ không vào chỗ chồng) — nên hai mã neo đó là câu trả lời bằng mã cho đúng lỗi đã nêu, chứ không phải để đẹp bảng.

Hai thẻ **cố ý** không có mã neo:

- `domot` ("PHƠI MỘT MẶT"): chữ "phơi … mặt" khớp cả "áo phơi rộng: cả hai mặt phơi ra", nên máy đòi phần định tính ("áo màu sẫm"). Ở nhát c48 cái áo phơi rộng không có trong khung, người xem không nhầm — nhưng **đổi chữ trên màn hình để qua máy thì không đáng**: giữ chữ, bỏ mã neo.
- 30 thẻ còn lại: máy nói thẳng là chưa kiểm được. Thêm mã neo cho từng thẻ là việc của một vòng riêng, không phải việc nhỏ làm kèm trong lúc sửa lỗi c27.
