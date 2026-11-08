VERDICT: REJECT
ROUND: 4/5
MISSING_ASSETS_COUNT: 5

> Phân rã: **1** linh kiện bị bỏ sót hẳn (không có hàng trong Spec) + **4** linh kiện **có hàng nhưng không có trong khung / không đọc được** ở đúng nhát mà cột "Xuất hiện ở" ghi.
> Ngoài ra: **28 hàng sai cột "Xuất hiện ở"** và **3 hàng sai mô tả/số đo**.

Cách kiểm: đọc lại `voice/lines.json` (60 câu), `LOOK.md` (60 nhát + "Số trên hình" + "Vòng 6"), `COMPONENTS_SPEC.md`; đối chiếu với mã `src/props.js` (bảng `PROPS`), `src/set.js` (toạ độ vật, cờ bật/tắt), `src/film.js` (bảng `SHOTS` = 60 máy, bảng `CARDS` = 29 thẻ); **chụp thật 60 khung** bằng

```sh
cd /home/minhbien/Documents/lemo-opuscar && LEMO_ANGLE=vulkan node core/render/still.mjs \
  channels/tram-nghi-nhieu/series/do-vat/tap-01-phoi-quan-ao <t> --out /tmp/audit4
```

(mốc thời gian lấy từ `voice/dur.json` + `src/timeline.js`). Mọi kết luận "có/không trong khung" dưới đây đã được soi trên ảnh thật, không chỉ trên phép tính góc.

**Phần đã sửa đúng từ vòng 3 (ghi nhận, không tính vào điểm)**: ba giọt bám mép áo A nay nằm đúng trong đạo cụ `tShirt` (`src/props.js:318–326`, toạ độ cục bộ sát mép dưới) ✔; `fanB.setSpeed()` / `fanC.setSpeed()` được gọi thật (`src/set.js:312–313`) ✔; quạt bàn đã vào khung ở c5/c6/c31/c54 ✔; `bag2` đã bị gỡ khỏi `set.js` ✔; `wovenCloth` đúng `A = rad·1.05·cos(π·ph)`, `rad = r·(.74…1.30)`, gọi `wovenCloth({n:44, size:.34})` ✔; hai mặt kính của bàn thí nghiệm **đứng** ✔; `mistBal` = .32 chỉ ở c47, `mistFar` = .22 ✔; mồ hôi **không có mảng alpha** ✔; **4** giọt trong khe nằm trong `props.js` ✔; `tShirt({w:.62,h:.72})` và `tShirt({w:.30,h:.40}) ×2 (scale .9)` ✔; thanh treo áo A còn **1** móc ✔.

---

## DANH SÁCH LINH KIỆN BỊ THIẾU HOẶC MÔ TẢ SƠ SÀI

### [BỎ SÓT] 1. Thanh treo áo B ở góc xa phòng — không có hàng nào trong Spec

- Xuất hiện ở **c5, c29, c31, c52, c53** (góc xa phòng, bên phải). Code `src/set.js:177–179`:
  thanh thép dài 1,30 m tại `(2.42, 1.50, −5.05)` (xoay ngang), **2 chân đỡ** tại `z = −5.65` và `−4.45`, **1 móc** tại `x = 2.37` — đây là thứ giữ **áo B** đứng ở `(2.30, 1.42, −5.05)`.
  Nhóm 3 của Spec chỉ có hàng "**Thanh treo áo trong phòng kín** … nó chỉ giữ áo A"; không hàng nào cho thanh giữ áo B.
- Yêu cầu bổ sung: hàng Nhóm 3 — *thanh treo áo B ở góc xa phòng* (thanh thép ngang `y = 1.50, z = −5.05`, 2 chân đỡ, 1 móc), LOD B/M, Tĩnh, cách dựng: dựng trong `src/set.js` (không có hàm riêng).

### [KHÔNG ĐỌC ĐƯỢC] 2. "Quần đùi hai ống" + "áo thun mỏng" ở **c50** — bị **lan can** che gần hết

- Cột "Xuất hiện ở" của hai hàng này ghi `c50`; `LOOK.md` cũ yêu cầu *"toàn cảnh hiên: quần dày (navy) ở giữa, áo thun mỏng (xanh nhạt) bên phải, lan can ở tiền cảnh"*.
- Khung thật t=145,15: **không đọc được món nào**. Máy c50 đặt ở `(.45, .95, 2.60)` — tức **ngay sau lan can** (`z = 2.50`, thanh trên `y = 0.95`, cao 0,05 m). Ở 9 cm trước ống kính, khung 16:9 chỉ rộng 12,8 cm, nên một mảnh lan can ~13 cm bị phóng to kín **40 % dưới khung** (một dải màu be trơn, không có hoa văn). Quần chỉ còn 1/3 trên, áo thun chỉ còn mép trên; hai thẻ `QUẦN DÀY` và `ÁO MỎNG` **chỉ vào chỗ trống**. Thêm nữa, phần quần còn lại đọc ra là **một mảng nâu sẫm không có hình quần** (không thấy rõ hai ống, không thấy navy), nên câu *"quần áo dày giữ nhiều nước hơn"* không có hai vật đối chiếu được.
- Yêu cầu sửa (bằng hình): nâng máy **trên** thanh lan can — `src/film.js`: `sh('N1','c50', 52, [.45, 1.32, 3.20], [.45, 1.30, .85])` (máy cao hơn `y = 0.95` của lan can ⇒ lan can thành lớp tiền cảnh mỏng thay vì tấm che; quần ở `x = −0.55` lệch 23°, áo thun ở `x = 1.50` lệch 24°, cả hai trong khung ±40,9°). Nếu giữ `z = 3.50` như `LOOK.md` vòng 5b ghi thì **phải** nâng `y` lên ≥ 1.15, nếu không lan can lại ở ngang tầm mắt và che tiếp.

### [KHÔNG ĐỌC ĐƯỢC] 3. "Mồ hôi bám trên mu bàn tay" ở **c54–c55** — mười giọt không hiện

- Hàng Nhóm 2 ghi *"mười giọt nhỏ bán kính **2.6–3.6 mm**, con của bàn tay"*. Số đo đúng với code (`src/set.js:219–224`), nhưng vị trí sai: giọt đặt ở toạ độ cục bộ `y = .042`, trong khi mặt mu bàn tay (`back`, `src/props.js:1556–1566`) chỉ nhô lên tới `y ≈ .040` và chỉ trải `x ∈ [.010,.186]`, `|z| ≤ .055`. ⇒ giọt ở `x = .19… .21` **lơ lửng ngoài da**, giọt ở `|z| = .07` **lơ lửng bên cạnh tay**, phần còn lại **chìm trong da**.
- Ở c55 (`fov 30`, máy cách tay 0,88 m) khung thật **không có giọt mồ hôi nào** — chỉ thấy các hạt khí xanh bay qua. `LOOK.md` c55 đòi rõ *"mười giọt mồ hôi nhỏ bám trên da"* phải đọc được.
- Yêu cầu sửa (bằng hình): bán kính **6–8 mm**, đặt trên mặt `back` (`y ≈ .0405` ở tâm vòm, giảm dần theo bán kính), giới hạn `x ∈ [.02,.17]`, `|z| ≤ .045`, thêm một điểm sáng trên mặt giọt; và đổi `LOOK.md`/Spec bỏ ghi "3–5 mm" (đã bị thu nhỏ quá một lần ở vòng 5 → giờ vô hình).

### [KHÔNG ĐỌC ĐƯỢC] 4. "Lớp hơi ẩm bám sát mặt áo" ở **c25** — mảng hơi nằm ngoài khung

- Hàng Nhóm 2 ghi lớp hơi ẩm xuất hiện `c22–c32`; `src/film.js:293` cũng bật `BAL.mist` ở c25. Nhưng mảng hơi đặt ở `mistG = vị trí áo A + (0, −.18, +.04)` ⇒ mặt phẳng `y ∈ [1.02, 1.46]`, `z = −3.26`, còn máy c25 đặt ở `y = .90` và **nhìn xuống** (điểm nhìn `y = .64`) ⇒ **toàn bộ mảng hơi nằm trên khung, không thấy gì**.
- Khung thật t=76,44: chỉ thấy **một dải mép vải** chạy ngang (dải này là mép dưới tấm áo, ở `y ≈ .65`), bên dưới là **một mảng nâu trơn chiếm ~60 % khung** (không có hoa văn, không có vật thể nào đọc ra được). Thân áo — vốn chiếm `y .65…1.42` — **không lọt khung**; `LOOK.md` c25 đòi *"nhìn từ dưới lên mép dưới tấm áo: **vải chiếm hai phần ba khung**, ba giọt bám theo mép, phía sau là cửa sổ kín"*, nhưng máy c25 lại đặt **cao hơn** mép áo và **nhìn xuống** ⇒ đúng ngược với yêu cầu. Không có lớp hơi, không có cửa sổ kín.
- Yêu cầu sửa (bằng hình): dựng lại máy c25 **thấp hơn mép áo và ngẩng lên**, đủ rộng để lấy cả mép (`.65`) lẫn lớp hơi (`1.02…1.46`): `src/film.js` → `sh('N4','c25', 42, [.52, .50, −2.25], [.42, .95, −3.28], [0, 0, −.02])` (máy lùi ra ~0,45 m và **thấp hơn mép áo** `y = .50 < .65`; khung 42° phủ từ trục `+25,8°` ⇒ mép áo ở `+8°` (dưới), lớp hơi ở `+26…+42°` (trên), thân áo ở giữa). Đồng thời hạ **vệt ẩm và giọt** trên vải xuống sát mép dưới (chúng đang ở `−h·.54 … −h·.82`) để "lớp bám sát, bão hoà" đọc được.

### [THIẾU 1 GIỌT] 5. "Ba giọt nước bám theo mép áo A" ở **c25** — chỉ thấy **2/3**

- Hàng Nhóm 2 ghi ba giọt bám mép, `LOOK.md` c25 ghi *"ba giọt bám theo mép"*. Khung thật t=76,44 chỉ có **hai** giọt; giọt thứ ba (`dx = +w·.17`) nằm ngoài mép khung bên phải. Ba giọt trải trên `x ∈ [−1.35, −1.15]` trong khi máy nhìn vào `x = .40` — lệch tâm quá xa.
- Yêu cầu sửa: rút máy c25 ra và quay đúng mép áo (đồng thời với mục 4), hoặc gom ba giọt vào khoảng hẹp hơn (hiện `−w·.16, +w·.04, +w·.17` → `−w·10, 0, +w·10`) để cả ba cùng lọt khung.

---

## HÀNG SAI CỘT "XUẤT HIỆN Ở" (28 hàng)

| # | Hàng trong `COMPONENTS_SPEC.md` | Ghi hiện tại | Thực tế (đã chụp khung thật) | Sửa |
|---|---|---|---|---|
| 1 | **Dây phơi thứ nhất** | c1, c50, c56–c58 | c1, c38, c47, c48, c50, c56, c57, c58 | thêm **c38, c47, c48** |
| 2 | **Dây phơi thứ hai** | c48–c49, **c59–c60** | c38, c40, c48, c50, c56, c58, c59 — **không có ở c49 và c60** | **bỏ c49, c60**; thêm c38, c40, c50, c56, c58 |
| 3 | **Kẹp quần áo gỗ** | c1, **c60** | c1, c38, c47, c48, c50, c56, c57, c58, c59 — **không có ở c60** | **bỏ c60**; thêm c38, c47, c48, c50, c56, c57, c58, c59 |
| 4 | **Áo phông thứ hai trên dây 1 (xanh teal)** | c1 | c48, c50, c56, c58, c59 — **không có ở c1** (nằm ngoài khung phải, `ndcX ≈ 1.7`) | **bỏ c1**; thêm c48, c50, c56, c58, c59 |
| 5 | **Quần đùi hai ống** | c1, c50, c56–c58 | c1, c47, c50, c56, c57, c58 | thêm **c47** |
| 6 | **Áo thun mỏng** | c1, c50, c56, c58 | c48, c50, c56, c58, c59 — **không có ở c1** | **bỏ c1**; thêm c48, c59 |
| 7 | **Áo A** (trong luồng gió) | c5–**c7**, c19–**c32** | c5, c7, c19–c26, c28, c30–c32 — **không có ở c6** (miệng quạt chiếm trọn khung), **c27** (quay ngược về quạt), **c29** (góc áo B) | **bỏ c6, c27, c29** |
| 8 | **Áo B** (góc xa) | c5, c7, c29, c52–c53 | thêm **c31** (áo B ở mép phải khung) | thêm c31 |
| 9 | **Đàn áo phơi chồng** | c38, c40 | c38, c40, **c42 (chiếm 1/3 khung!)**, c47, c48, c50, c51, c56, c57, c58, c59 | thêm **c42** + các nhát hiên |
| 10 | **Áo phơi một mặt** | c48 | c48, c50, c56, c59 | thêm c50, c56, c59 |
| 11 | **Cái áo úp** (trên lưng ghế) | c49 | c47, c49, c50, c57, **c60** | thêm c47, c50, c57, c60 |
| 12 | **Áo phơi rộng** | c49, c60 | c47, c49, c50, c57, c60 | thêm c47, c50, c57 |
| 13 | **Bồn chậu nhựa có nước** | c1 | c1, c47, **c60** (bồn chậu ở góc phải dưới khung c60) | thêm c47, c60 |
| 14 | **Ghế gỗ** | c1, c49, c60 | c1, c47, c49, c50, c57, c58, c60 | thêm c47, c50, c57, c58 |
| 15 | **Quạt bàn có lưới** | c3, c5, c6, c27, c31, c54 | thêm **c19, c30, c33** (ở c33 quạt ở góc dưới-trái) | thêm c19, c30, c33 |
| 16 | **Quạt nhỏ trên bàn thí nghiệm** | c35–c36 | **c29, c52, c53** (ở c29 và c52 quạt hiện rõ bên trái, đứng trên bàn kính) | thêm c29, c52, c53 |
| 17 | **Bàn thí nghiệm** | c35–c37 | **c29, c52, c53** | thêm c29, c52, c53 |
| 18 | **Bàn thấp đặt quạt** | c3, c5–c6, c27, c31–c32, c52–c55 | thêm **c19, c30, c33**; **không có ở c31, c32, c52, c53, c55** (bàn nằm dưới khung) | sửa lại |
| 19 | **Hai cân nhà bếp** | c33–c34 | thêm **c3, c6** (nền) | thêm c3, c6 |
| 20 | **Hai áo nhỏ trên thanh** | c4, c33 | thêm **c3** (nền, góc trên phải) | thêm c3 |
| 21 | **Giọt nước đọng trên sợi** | c8–c9 | thêm **c11** (giọt treo ở đỉnh chữ V vẫn lọt khung c11) | thêm c11 |
| 22 | **Bức tường giữa hiên và phòng có lỗ cửa** | c2, **c19, c20, c32** | c19, c20, c32 đều là **nhát N4** (máy ở `z ≤ −2.20`, bức tường `z = −1.05` **sau lưng máy**) ⇒ không thấy | **bỏ c19, c20, c32**; ghi đúng là các nhát N1 (c1, c2, c38, c45, c47, c48, c50, c51, c56–c60) |
| 23 | **Cánh cửa kính** | c2, c48, c50, c56, c59 | thêm **c1, c38, c45** | thêm c1, c38, c45 |
| 24 | **Lan can hiên** | **c1, c25** | c1: thanh lan can **dưới mép khung** (không thấy); c25: **nhát N4**, lan can sau bức tường ⇒ **không thấy**. Chỉ hiện ở **c50** — và đó chính là chỗ nó phá hình (mục 2) | **bỏ c1, c25**; ghi `c50` |
| 25 | **Bối cảnh N3 — mặt nước** & **Bờ chật ở cảnh mặt nước** | c15–c18 | c13 và c14 **cũng là N3** (`src/film.js:48–49`) | sửa thành **c13–c18** |
| 26 | **Luồng gió trong phòng** (Nhóm 2) & **Gió trong phòng** (Nhóm 4) | c6–c7, **c12–c14**, c24 | c12–c14 là **N2/N3**, không có luồng gió phòng. Luồng gió chạy ở **mọi** nhát N4 có quạt: c3–c7, c19–c31, c34–c37, c54–c55 (tắt ở c52–c53) | **bỏ c12–c14**; ghi đúng danh sách trên |
| 27 | **Lớp hơi ẩm bám sát mặt áo** | c22–c32 | c22–c26, c28, c30–c32 (c27 quay về quạt, c29 sang áo B ⇒ mảng ở áo A không lọt khung); **c25 không đọc được** (mục 4) | sửa lại + xử lý c25 |
| 28 | **Hơi nước lay nhẹ (gió ở hiên)** & **Vệt sáng mặt trời trên sàn gạch** | c1, **c25–c26** | c25–c26 là **nhát N4** ⇒ hiên (và vệt nắng trên sàn gạch) **sau bức tường** | **bỏ c25, c26**; vệt nắng chỉ ở **c1** (các nhát hiên: c1, c47, c50, c56–c59) |

## HÀNG SAI MÔ TẢ / SỐ ĐO (3 hàng)

| # | Hàng | Sai thế nào | Sửa |
|---|---|---|---|
| 29 | Nhóm 4 — **"Lớp thẻ thuật ngữ `label()`"** | ghi "**30 thẻ**: **11** thẻ số/đếm (…10 tên…) và **19** thẻ thuật ngữ" — danh sách trong chính hàng đó chỉ có **10** thẻ số/đếm, `CARDS` trong `src/film.js:134–162` cũng đúng **29** thẻ | ghi "**29 thẻ: 10 thẻ số/đếm + 19 thẻ thuật ngữ**" (hoặc thêm thẻ thứ 30 nếu còn một cỡ số chưa gắn) |
| 30 | Nhóm 1 — **"áo phông đã khô (màu sáng)"** | ghi `tShirt({wetColor:'#7c8296'})` + `setWet(0)` — nhưng `#7c8296` chỉ nằm trong bảng `PROPS` của `props.js`, **không có trong bối cảnh**. Trong phim, áo ở hiên là `tShirt({color:'#f2f0e6', wetColor:'#aab2c4'})` (`src/set.js:121`) và khô dần bằng `shirt.setWet(1 − clamp((t−110)/50)·.95)` (`src/set.js:330`) | ghi đúng: *cùng một đạo cụ `shirt`, `wetColor:'#aab2c4'`, khô dần theo `setWet` theo thời gian* — không phải một vật riêng |
| 31 | Nhóm 1 — **"quạt nhỏ trên kệ gỗ"** | ghi *"đầu quạt ở `y ≈ 1.0`"* — code đặt `fanC.group.position.y = .745` với `scale .55` ⇒ đầu quạt ở **`y ≈ 0.90`** | sửa số đo thành `y ≈ 0.90` (hoặc nâng quạt lên `.80` cho khớp `y ≈ 1.0` như LOOK) |

*(Ba hàng này cần sửa **cùng** với phần c_id ở trên; không tính vào `MISSING_ASSETS_COUNT`.)*

---

## RỦI RO LẮP GHÉP KỸ THUẬT

- **Lan can hiên đè lên c50** — máy c50 đặt sau thanh lan can (`z = 2.60` vs `z = 2.50`) ở đúng tầm mắt (`y = 0.95` vs `y = 0.95`). Ở 9 cm trước ống kính, 12,8 cm của lan can bị phóng to kín 40 % khung dưới ⇒ **quần, áo thun, khăn đều bị che** và hai thẻ `QUẦN DÀY` / `ÁO MỎNG` trỏ vào chỗ trống. Sửa bằng cách nâng máy lên `y ≈ 1.32` (mục 2), không sửa được bằng cách thêm vật.
- **Mảng hơi ẩm là một mặt phẳng phẳng lớn hơn áo** — `mistFar` là `PlaneGeometry(.76, .92)` trong khi áo B chỉ `.62 × .78`; ở c29 **hai góc của mảng lộ ra ngoài áo**, đọc ra là một tấm kính phẳng treo trong không trung (đã thấy rõ trong khung c29). Sửa: thu mảng về đúng kích thước áo và bo viền bằng alpha mờ dần, hoặc dùng `TEX.radial()` với alpha tắt ở rìa.
- **Đồng hồ treo tường đè lên cặp áo nhỏ ở c3–c4** — đồng hồ `(-2.30, 1.36, −6.62)` nằm ngay sau hai áo nhỏ (`x = −1.95`, `−1.65`; `z = −5.6`), nên ở c3 và c4 vòng đồng hồ đỏ viền đè ngay sau cổ áo, đọc lẫn với chủ thể. Sửa: dời đồng hồ sang `x ≈ −2.60` hoặc hạ xuống `y ≈ 1.15`.
- **Quạt bàn ở c31 chỉ thấy mặt lưng động cơ** — máy c31 ở `(.70→.72, 1.36, −2.08)` nhìn về `(−.05, 1.16, −3.30)`, quạt ở `(−1.5, .74, −3.3)` ⇒ nhìn **từ sau**, khung chỉ có vỏ động cơ đen, **không thấy lưới lưới/cánh**. Lời *"gió mạnh hơn, lớp ẩm bị quét xa hơn"* cần đầu quạt làm chủ thể. Sửa: dời máy c31 sang bên phải/cao hơn để thấy mặt quạt, hoặc xoay đầu quạt về phía máy.
- **Mồ hôi bám trên da vô hình** — xem mục 3; mọi giọt đều nằm trong da hoặc lơ lửng ngoài da, không giọt nào chạm bề mặt.
- **Ba giọt bám mép áo A không nằm trên mép ở c25** — xem mục 5; thêm nữa, `tShirt` là đạo cụ **dùng chung**, nên năm giọt (3 mép + 2 cổ) xuất hiện trên *mọi* áo dùng `tShirt` — áo úp trên ghế, hai áo trên cân, áo teal — dù hàng Spec mô tả chúng là *"ba giọt bám theo mép **áo A**"*. Nếu chỉ muốn áo A thì cần một cờ bật/tắt riêng (`shirtA.drops`), nếu không thì phải ghi rõ trong Spec là giọt thuộc về đạo cụ `tShirt` nên mọi áo đều mang.
- **Kẹp và dây trong đàn áo không đi theo vải** (còn tồn tại từ vòng 3) — `src/set.js:306` chỉ xoay `pile.shirts`, còn dây phơi và ba kẹp nằm trong `pile.group` và đứng yên; c40 đọc được chi tiết này.
- **Dây phơi đung đưa nhưng quần áo không theo** (còn tồn tại) — `line.setSway()` dịch cả sợi dây, còn áo/quần/khăn/kẹp đặt cố định; ở c56–c58 sai lệch vài mm là đọc được.

---

## KẾT LUẬN YÊU CẦU ĐẠO DIỄN

- **Spec vẫn chưa đủ chặt để chuyển sang Bước 5.** Vòng 3 (35 mục) đã sửa đúng phần lớn, nhưng còn lại:
  - **5 linh kiện** ở mục "DANH SÁCH" trên: ① **thanh treo áo B** ở góc xa phòng (chưa có hàng); ② **quần + áo thun ở c50** không đọc được (bị lan can che); ③ **mồ hôi trên da ở c54–c55** không hiện; ④ **lớp hơi ẩm ở c25** nằm ngoài khung; ⑤ **c25 chỉ thấy 2/3 giọt bám mép**.
  - **28 hàng sai cột "Xuất hiện ở"** — trong đó nặng nhất: **"Dây phơi thứ hai"** (ghi có ở c49/c60 nhưng thực tế **không**, và bỏ sót 6 nhát), **"Kẹp quần áo gỗ"** (ghi có ở c60 nhưng **không**), **"Áo A"** (có ở c6/c27/c29 nhưng **không**), **"Bức tường có lỗ cửa"** (c19/c20/c32 đều là nhát N4, bức tường sau lưng máy), **"Lan can hiên"** (ghi c1/c25 nhưng thực tế chỉ ở **c50**), **"Luồng gió trong phòng"** (ghi c12–c14 là N2/N3), **nhóm N3** (ghi c15–c18, thiếu c13–c14).
  - **3 hàng sai mô tả/số đo**: số thẻ `label()` (29 chứ không phải 30; 10 thẻ số chứ không phải 11), hàng "áo phông đã khô" (ghi sai màu và sai quan hệ vật–thời gian), hàng "quạt nhỏ trên kệ" (`y ≈ 0.90` chứ không phải `1.0`).
- **Ba việc sửa được bằng hình, không sửa được bằng tài liệu** (theo thứ tự ưu tiên):
  1. **Dựng lại máy c50** (nâng lên trên lan can) để quần dày và áo mỏng cùng đọc được — nếu không, thẻ `QUẦN DÀY` / `ÁO MỎNG` là hai thẻ trỏ vào chỗ trống.
  2. **Dựng lại máy c25** để lấy trọn mép áo + lớp hơi ẩm + ba giọt bám (đồng thời hạ vệt ẩm xuống sát mép).
  3. **Đặt lại mười giọt mồ hôi** trên mặt mu bàn tay, to hơn và có điểm sáng, để c55 đọc được "mười giọt mồ hôi nhỏ bám trên da".
- **Rủi ro lắp ghép còn tồn tại** (đã nêu ở trên): mảng hơi phẳng lớn hơn áo ở c29; đồng hồ đè lên cặp áo ở c3–c4; quạt bàn chỉ thấy mặt lưng ở c31; kẹp/dây trong đàn áo trượt khỏi vai; dây đung đưa mà quần áo không theo.
- Sau khi sửa **5 linh kiện + 28 c_id + 3 mô tả** và chốt **3 việc sửa trong `src/film.js`/`src/set.js`/`src/props.js`** nêu trên, báo cáo soi tài liệu vòng 5/5 mới có thể xét PASS.
