# ASSET-AUDIT-REPORT — Vì sao phơi quần áo cần gió?

Soi chéo: `voice/lines.json` (60 câu c1…c60) · `LOOK.md` (60 nhát) · `COMPONENTS_SPEC.md`,
đối chiếu với **mã đã đổi sau vòng 2**: `src/props.js` (bảng `export const PROPS = {…}`, 25 mục),
`src/set.js` (N1 hiên / N4 phòng / N2 trong sợi / N3 mặt nước) · `src/film.js` (60 nhát, cờ bật/tắt).

Vòng này soi **sau khi đạo cụ đã dựng lại**, nên trọng tâm là: *mọi hàng trong Spec có truy ra được một
đối tượng thật trong mã không, và mọi vật trong mã/LOOK có hàng trong Spec không* — sai số đo, sai tên
hàm, sai c_id, khai vật không tồn tại, hoặc cơ chế động được ghi mà code không chạy.

**Quy tắc đếm**: mỗi *hàng* của `COMPONENTS_SPEC.md` sai = 1 điểm; mỗi linh kiện có trong mã/LOOK mà
không có hàng = 1 điểm. Phân rã: **3 bỏ sót + 13 sai mô tả/số đo + 19 sai c_id = 35**.

VERDICT: REJECT
ROUND: 3/5
MISSING_ASSETS_COUNT: 35

> Phân rã: **3** linh kiện bị bỏ sót hẳn (có trong mã hoặc trong `LOOK.md` mà không có hàng trong Spec)
> + **32** hàng sai (13 sai mô tả/số đo, 19 sai c_id).

---

## DANH SÁCH LINH KIỆN BỊ THIẾU HOẶC MÔ TẢ SƠ SÀI

### [BỎ SÓT] 1. Ba giọt nước bám theo mép áo A (`hemBeads`)

- Xuất hiện ở **c25, c26** — `LOOK.md` nhát 25: *"vải chiếm hai phần ba khung, **ba giọt bám theo mép**"*;
  nhát 26: *"mép tấm áo ướt, lớp hơi bám sát quanh thân"*. Code: `src/set.js:237–243` dựng `hemBeads`
  (3 quả cầu `SphereGeometry` r 4.8–5.8 mm), bật ở `src/film.js:283` (`BAL.hemBeads.visible = id === 'c25' || id === 'c26'`).
  **Spec không có hàng nào cho vật này** — cả Nhóm 1 lẫn Nhóm 2.
- Yêu cầu bổ sung: một hàng Nhóm 2 — *ba giọt nước bám mép áo A*, LOD C, Động (bám theo mép vải,
  không rơi), cách dựng `hemBeads` trong `set.js`.
- **Lưu ý kỹ thuật nghiêm trọng**: `hemBeads` được `scene.add()` ở gốc toạ độ (`src/set.js:243`), nên ba
  giọt nằm ở toạ độ thế giới `x ≈ −0.13…0.14, y ≈ −0.35, z ≈ 0` — tức **dưới sàn gạch** và cách áo A
  (`0.42, 1.42, −3.30`) gần 3 m. Chúng không bao giờ dính mép áo. Phải là con của `shirtA.group` với
  toạ độ cục bộ sát mép dưới (`y ≈ −h + .02`), nếu không thì nhát c25–c26 không có giọt nào đọc được.

### [BỎ SÓT] 2. Áo phông đã khô (màu sáng) — biến thể trong bảng `PROPS`

- `src/props.js:1631` có mục `'áo phông đã khô (màu sáng)': () => { const s = tShirt({ wetColor: '#7c8296' }); s.setWet(0); return s.group; }`.
  Bảng "Phản biện với báo cáo vòng 2" của chính Spec (mục 13) ghi rõ *"thêm hàng cho biến thể áo phông đã khô (màu sáng)"* —
  **nhưng bảng Nhóm 1 không có hàng này**. Sửa tài liệu chưa được áp dụng.
- Yêu cầu bổ sung: hàng Nhóm 1 cho biến thể áo khô (`setWet(0)`), LOD B/C, xuất hiện ở **c56–c58**
  (những nhát "áo đã nhạt màu"), màu sáng `#f2f0e6`.

### [BỎ SÓT] 3. Thẻ số `label()` (11 thẻ đo)

- `src/film.js:131–143` khai 11 thẻ: `288 g`, `288 g`, `88 g`, `88 g`, `20 g/kg`, `30 °C`, `90 %`,
  `2 ÁO`, `3 ÁO`, `1 PHÂN TỬ`, `2 kJ`. `LOOK.md` ("Số trên hình") yêu cầu 8 thẻ này để tắt cờ `NUM`
  của máy đo nhịp, nhưng **Spec không có hàng nào cho lớp thẻ**. Đặc biệt thẻ **`2 kJ` (c21)** không
  có trong bảng "Số trên hình" của `LOOK.md` lẫn trong Spec.
- Yêu cầu bổ sung: hàng Nhóm 4 — *thẻ số dán cạnh đồ đo* (thẻ kem, viền mực, chữ đỏ Be Vietnam Pro 900),
  Động (bật theo mốc câu), danh sách 11 thẻ và câu của mỗi thẻ.

---

### [SAI MÔ TẢ] 4. Tấm vải dệt `wovenCloth()` — ba số đo sai

- Spec Nhóm 1 ghi: *"**44 sợi dọc × 44 sợi ngang**, bán kính sợi `0.0021` … sợi ngang uốn lên–xuống theo cos nên
  **đổi trên–dưới ở mỗi lần cắt** (`A = r·1.30·cos(π·ph)`) … sợi không đều tăm tắp (lệch nhẹ, **bán kính `0.82–1.22 r`**) … `wovenCloth({n:44, size:.34, r:.0021})`"*.
- Code: `src/props.js:1349` → `const A = rad * 1.05 * Math.cos(Math.PI * ph);` — hệ số là **1.05, không phải 1.30**,
  và nhân với `rad` (bán kính rung của riêng sợi đó), không phải `r`.
  `src/props.js:1331` → `const rad = r * (.74 + rr() * .56);` ⇒ bán kính thực là **0.74–1.30 r**, không phải 0.82–1.22 r.
  `src/set.js:461` → `P.wovenCloth({ n: 44, size: .34 })` — **không truyền `r`**; giá trị `.0021` chỉ đúng vì
  đó là mặc định của chữ ký `src/props.js:1297`.
- Yêu cầu sửa: ghi `A = rad·1.05·cos(π·ph)`, bán kính `0.74–1.30 r`, và gọi đúng `wovenCloth({n:44, size:.34})`
  (mặc định `r = .0021`). Các chi tiết còn lại của hàng này (`repeat(2,22)`, lớp vải nền mờ, vị trí
  `(.205,−.010,−.085)`, xoay `z .07`, fov 34 ở c10) đã **khớp** code.

### [SAI MÔ TẢ] 5. Bàn thí nghiệm — "hai mặt kính **nằm ngang**" nhưng code dựng kính **đứng**

- Spec Nhóm 1: *"**Bàn gỗ với hai mặt kính nằm ngang trên đế gỗ**, một vách ngăn dựng đứng ở giữa, hai thanh giữ"*.
- Code: `src/props.js:1082` (comment) *"hai tấm kính **ĐỨNG** trên mặt bàn"*; `src/props.js:1097` tạo
  `PlaneGeometry(.272,.332)` đặt ở `y = 1.000` **không xoay** ⇒ tấm kính nằm **thẳng đứng**, khung bốn
  thanh quanh nó (`src/props.js:1099–1100`), giọt nước bám trên mặt đứng đó (`src/props.js:1112`).
- Yêu cầu sửa: ghi *"hai tấm kính **đứng** trên đế gỗ"*. Đây là chi tiết quyết định: nhát c36/c37
  (`fov 36` / `fov 30`) chỉ đọc được mặt kính ngang khi nó đứng; nếu vẽ là một mặt phẳng nằm ngang
  thì cả cặp giọt và vách ngăn sập lại.

### [SAI MÔ TẢ] 6. `BAL.mistBal` — độ đục và c_id sai

- Spec Nhóm 2: *"**Lớp hơi mờ đục quanh áo ướt ở hiên** (không khí ẩm 90 %) | c46–c47 | Động: độ đục **cố định .42**"*.
- Code: `src/film.js:270` → `BAL.mistBal.visible = id === 'c47';` ⇒ **chỉ hiện ở c47**, không phải c46.
  `src/film.js:279` → `BAL.mistBal.material.opacity = id === 'c47' ? .32 : .22;` ⇒ độ đục ở c47 là **.32, không phải .42**.
- Yêu cầu sửa: độ đục `.32` ở c47, bỏ c46.

### [SAI MÔ TẢ] 7. `BAL.mistFar` — độ đục `.50` sai

- Spec Nhóm 2: *"**Lớp hơi bám quanh áo còn ướt ở góc phòng** | c52–c53 | Động: độ đục **.50**"*.
- Code: `src/film.js:276` → `BAL.mistFar.material.opacity = .22;` ⇒ **.22**.
- Yêu cầu sửa: `.22`.

### [KHAI KHÔNG CÓ THẬT] 8. Mồ hôi trên mu bàn tay — "mảng alpha" không tồn tại; bán kính sai

- Spec Nhóm 2: *"**Mồ hôi bám trên mu bàn tay** (mảng alpha + **mười giọt nhỏ** bán kính **3–5 mm**, con của bàn tay)"*.
- Code `src/set.js:219–226`: chỉ có **mười giọt** cầu (đúng 10) và một đối tượng cờ `const sweat = { visible: false }`
  — **không có mảng alpha nào**; comment tại `src/set.js:217` ghi rõ *"không phải mảng xám dán"*.
  Bán kính thật: `.0036 .0030 .0034 .0028 .0030 .0036 .0028 .0026 .0026 .0026` ⇒ **2.6–3.6 mm**,
  không phải 3–5 mm (`LOOK.md` vòng 5 cũng ghi "r 7–11 mm → 3–5 mm", cũng lệch với code).
- Yêu cầu sửa: bỏ "mảng alpha", ghi bán kính 2.6–3.6 mm; hoặc dựng thật một lớp mồ hôi mỏng (mảng alpha
  bám theo `hand`) nếu muốn giữ mô tả.

### [SAI MÔ TẢ] 9. Giọt nước nhỏ trong khe — "5 giọt … thêm trong `set.js`" nhưng code có **4 giọt trong `props.js`**

- Spec Nhóm 2: *"dải mảng trong suốt trong `wovenFibres()` + **5 giọt nước nhỏ** nằm đúng khe (**thêm trong `set.js`**)"*.
- Code `src/props.js:1257–1261`: mảng `beads` có **4** giọt `[[.028,.030],[.052,.070],[.072,.100],[.014,.020]]`,
  và chúng nằm **trong `props.js`** (thêm vào `filmG`), không phải trong `set.js`.
- Yêu cầu sửa: "4 giọt nhỏ, trong `wovenFibres()`".

### [SAI MÔ TẢ] 10. Cái áo úp trên lưng ghế — kích thước sai

- Spec Nhóm 1: *"**Cái áo úp** trên lưng ghế (còn ẩm) | `tShirt({w:.58,h:.70})` + `setWet(1)`"*.
- Code `src/set.js:149`: `P.tShirt({ color: '#f2f0e6', wetColor: '#aab2c4', w: .62, h: .72 })` ⇒ **`w .62, h .72`**.
- Yêu cầu sửa: `tShirt({w:.62,h:.72})`.

### [SAI MÔ TẢ] 11. Hai áo nhỏ treo trên cân — kích thước sai

- Spec Nhóm 1: *"Hai áo nhỏ treo trên **thanh treo ngay trên kệ** … `tShirt({w:.40,h:.48})` ×2"*.
- Code `src/set.js:205` và `src/set.js:207`: `P.tShirt({ color: '#e8eef2', wetColor: '#8a93a6', w: .30, h: .40 })`
  rồi `scale.setScalar(.9)` ⇒ **`w .30, h .40`**, hiện ra `.27 × .36` — không phải `.40 × .48`.
- Yêu cầu sửa: `tShirt({w:.30,h:.40})` ×2 (scaled .9).

### [SAI MÔ TẢ / KHAI KHÔNG CÓ THẬT] 12. Thanh treo áo trong phòng kín — mất vai trò, và "2 móc treo" không tồn tại

- Spec Nhóm 3: *"**Thanh treo áo trong phòng kín** (thanh thép ngang `y = 1.50, z = −3.38`, **2 chân đỡ, 2 móc treo**) |
  c4–c7 … (**đây là chỗ 'hai áo treo cạnh nhau' thật sự**)"*.
- Code: `src/set.js:173` (thanh ngang tại `x = .42, y = 1.50, z = −3.38`) + `src/set.js:174` (2 chân đỡ)
  + `src/set.js:175` (**một** móc duy nhất tại `x = .42`) ⇒ **chỉ 1 móc, không phải 2**.
  Thanh này chỉ giữ **áo A**. Áo B đã dời ra góc xa (`src/set.js:171`, `2.30, 1.42, −5.05`) với **thanh riêng**
  ở `x = 2.42` (`src/set.js:177–179`). "Hai áo treo cạnh nhau" nay là **hai áo nhỏ trên kệ**
  (`x = −1.95` và `−1.65`), tức `src/set.js:202–208`.
- Yêu cầu sửa: bỏ "2 móc treo" (còn 1), bỏ vai trò "hai áo treo cạnh nhau", và sửa c_id (xem bảng bên dưới).

### [SAI MÔ TẢ] 13. Quạt nhỏ trên bàn thí nghiệm — ghi "Động: quay nhanh hơn" nhưng **cánh không bao giờ quay**

- Spec Nhóm 1: *"**quạt nhỏ trên bàn thí nghiệm** … Động: **quay nhanh hơn**"*.
- Code: `src/props.js:764–765` — `setSpeed: (k) => { speed = clamp(k); }`, `spin: (t) => { angle += speed * .34; … }`,
  `speed` khởi tạo bằng `0` (`src/props.js:708`). Trong `src/set.js:316` có `fanB.spin(t * 1.7)` nhưng
  **`fanB.setSpeed(...)` không bao giờ được gọi** (chỉ `fan.setSpeed(2.2 * fanOn)` ở `src/set.js:318`).
  ⇒ `speed = 0` ⇒ `blades.rotation.z` không đổi: **cánh quạt đứng yên suốt tập**.
- Yêu cầu: hoặc gọi `fanB.setSpeed(...)` trong `BAL.update`, hoặc bỏ chữ "quay" khỏi hàng Spec.
  (Áp dụng y hệt cho `fanC` — mục 14.)

### [SAI MÔ TẢ] 14. Quạt nhỏ trên kệ — cũng không quay

- Spec Nhóm 1: *"**quạt nhỏ trên kệ gỗ** … Động: **quay** (`spin`, `setSpeed`)"*.
- Code: `src/set.js:197` dựng `fanC` và `src/set.js:316` gọi `fanC.spin(t * 1.6)`, nhưng
  **`fanC.setSpeed` không được gọi ở đâu cả** ⇒ cánh đứng yên. Ở c33 (toàn cảnh góc kệ, `fov 52`) đây là
  nhát mang cả cơ chế "một áo trước quạt", nên cánh đứng yên là chi tiết đọc được.
- Yêu cầu: gọi `fanC.setSpeed(...)` (kèm `setAim(-Math.PI/2)` đã có sẵn, hướng sang trái là đúng) hoặc sửa Spec.

### [THIẾU CHI TIẾT — LOD] 15 & 16. Hai vật quay cận cảnh chưa được ghi yêu cầu texture

- **`dropOnThread()`** (`src/props.js:1360`) dùng ở **c9, fov 12** — cận cảnh cực hẳn. Sợi của nó dựng
  bằng `toon('#eae2cd')` trơn (`src/props.js:1383`), xơ tua là hình học nhỏ chứ không phải texture.
  Spec **không ghi** yêu cầu texture canvas cho vật này (khác với `thinTee`/`deskFan`/`hand` đã được ghi ở vòng 2).
- **`hemDrop()`** (`src/props.js:481`) dùng ở **c51, fov 30** — mép khăn là tiền cảnh siêu cận. Giọt dựng
  bằng `teardrop()` vật liệu `toon('#8fdcf0')` trơn (`src/props.js:483`), tua rua của khăn cũng là
  `MeshBasicMaterial` phẳng (`src/props.js:608`). Spec không ghi yêu cầu texture.
- Yêu cầu: thêm yêu cầu "texture canvas có seed" cho hai hàng này (hoặc nói rõ là đã cố ý để trơn vì
  vật thể trong suốt, nhưng phải ghi vào Spec để kiểm chứng được).

---

## SAI c_id — cột "Xuất hiện ở" của 19 hàng không khớp khung hình thật

Cách kiểm: vị trí máy + điểm nhìn lấy từ `src/film.js` (bảng `SHOTS`), vị trí vật lấy từ `src/set.js`;
góc lệch tính trong mặt phẳng ngang so với nửa góc ngang của frustum (khung 16:9). Vật ở N4 mà nhát
là N1 bị bức tường `z = −1.05` che nên không tính là "xuất hiện".

| # | Hàng trong Spec | Ghi hiện tại | Thực tế trong `film.js`/`set.js` |
|---|---|---|---|
| 17 | Quạt bàn có lưới | c5–c7, c24, c52–c55 | **Chỉ c3 và c27.** Ở c5 lệch 45.3° (khung ±39.7°), c6 lệch 147.6° (quạt ở *sau* máy), c7 75.1°, c24 66.0° (fov 16), c31 61.3°, c32 48.3°, c53 53.5°, c54 33.6° (khung ±32.9°), c55 81.5°. Chỉ c3 (1.5°) và c27 (11.4°) nhìn thấy quạt. |
| 18 | Quạt nhỏ trên bàn thí nghiệm | c35–c37 | **Bỏ c37** — camera nhìn giọt sau vách (`x = 1.42`), quạt lệch 94.0°. |
| 19 | Quạt nhỏ trên kệ gỗ | c33–c34 | **Bỏ c34** — camera fov 18 nhìn hai mặt cân, quạt lệch 30.3° (khung ±15.7°). |
| 20 | Túi nylon trong phòng (`bag2`) | c31, c54 | **Không nhát nào.** `bag2` ở `(−2.30, −2.55)`; ở c31 lệch 101.7°, ở c54 lệch 53.6° (khung ±32.9°). Vật được dựng và đung đưa (`src/set.js:181`, `src/set.js:324`) nhưng **không bao giờ vào khung**. |
| 21 | Áo A | c4–c7, c19–c32 | **Bỏ c4** — nhát c4 nhìn vào kệ cân (`x = −1.80, z = −5.58`), chỉ có hai áo nhỏ. |
| 22 | Áo B | c4–c5, c7, c29, c52–c53 | **Bỏ c4** (như trên). |
| 23 | Đàn áo phơi chồng | c38, c39, c40, c48, c59–c60 | **Bỏ c39, c48, c60** — c39 chỉ có nhiệt kế (fov 15), c48 nhìn áo phơi một mặt ở `x = 1.00`, c60 nhìn ghế ở `x = −1.85`. Đúng: c38, c40 (và c59 ở mép khung). |
| 24 | Áo phơi một mặt (`halfShirt`) | c48, c60 | **Bỏ c60** — camera nhìn ghế; `halfShirt` ở `x = 1.00, z = −0.72` không vào khung. (Có thể thêm c59.) |
| 25 | Ẩm kế treo tường | c38–c43, c46–c47 | **Bỏ c39** — nhát c39 là cận nhiệt kế, ẩm kế lệch 55.8° (khung ±13.2°). |
| 26 | Nhiệt kế treo tường | c38–c40, c44–c45 | **Bỏ c40** — nhát c40 nhìn đàn áo ở `x = −0.95`, nhiệt kế ở `x = −2.25` lệch ngoài khung. |
| 27 | Khăn tắm có mép tua | c22, c50–c51 | **Bỏ c22** (đây là nhát trong **phòng kín**, khăn ở hiên `z = .85`), **thêm c1, c56, c58**. |
| 28 | Bức tường giữa hiên và phòng có lỗ cửa | c2, c17–c20 | **Sửa thành c2, c19, c20, c32.** c17–c18 là hai nhát N3 (mặt nước) — không có bức tường. *(Chính bảng "Phản biện" mục 11 của Spec đã ghi c2/c19/c20/c32 — bảng Nhóm 3 chưa được sửa theo.)* |
| 29 | Cánh cửa kính (`doorLeaf`) | c2, c25–c26 | **Bỏ c25–c26** — camera ở `z = −2.70/−2.52` nhìn về áo A ở `z = −3.26`, cửa ở `z = −1.08` **sau lưng máy**. Thực tế cửa thấy ở **c2, c48, c50, c56, c59**. |
| 30 | Nhóm 4 — "Hạt hơi nước bay lên (glow dots)" | c13–c14, c47 | **Sửa thành c8–c12.** c13–c14 là N3 (mặt nước); hạt bốc lên của N2 nằm ở `buildFabric()` (`src/set.js:471`) và chạy suốt c8–c12. *(Mâu thuẫn với hàng Nhóm 2 và với bảng "Phản biện" mục 7 của chính Spec.)* |
| 31 | Hai áo nhỏ treo trên thanh ngay trên kệ | c33–c34 | **Thêm c4** — nhát c4 *chính là* hai áo nhỏ này (camera `x = −1.80, z = −5.58`, mỗi áo lệch 12.4°), và thẻ `2 ÁO` neo đúng vào giữa chúng (`src/film.js:139`). |
| 32 | Dây phơi thứ nhất | c1, c56–c58 | **Thêm c50** — `LOOK.md` vòng 5b: nhát c50 *"lấy trọn cả dây phơi"*. |
| 33 | Áo phông còn ướt (màu sẫm) | c1–c2 | **Thêm c47, c56, c57, c58** (ở c47 nó là chủ thể: lệch 0.6°). |
| 34 | Quần đùi hai ống | c1, c50 | **Thêm c56, c57, c58**. |
| 35 | Áo thun mỏng | c1, c50 | **Thêm c56, c58**. |

---

## RỦI RO LẮP GHÉP KỸ THUẬT

- **Ba giọt bám mép áo A nằm dưới sàn, không dính mép áo** — `src/set.js:243` `scene.add(hemBeads)` đặt chúng
  ở toạ độ thế giới `y ≈ −0.35` (dưới mặt sàn gạch `y = 0`) cách áo A gần 3 m. Nhát c25–c26 (`fov 16` và
  `fov 30`) không có giọt nào đọc được ⇒ lời *"lớp hơi bám sát vải, nhanh chóng bị bão hoà"* mất vật chứng minh.
  Phải gắn `hemBeads` thành con của `shirtA.group` và đặt toạ độ cục bộ sát mép dưới.
- **Hai quạt nhỏ không quay** — `fanB` và `fanC` không bao giờ gọi `setSpeed` (`src/set.js:316` chỉ có
  `spin`), nên `speed = 0` và `blades.rotation.z` đứng yên (`src/props.js:764–765`). Nhát c33–c34 và
  c35–c36 là nơi quạt nhỏ là nhân vật chính: cánh đứng yên sẽ phá câu chuyện "gió chỉ có ở chỗ có quạt".
- **Quạt bàn không xuất hiện ở ba nhát cốt lõi của lời** — c6 (*"chỗ nào có quạt thì mới có gió"*),
  c31 (*"gió mạnh hơn, lớp ẩm bị quét xa hơn"*) và c54–c55 (*"vì sao quạt thổi tay lại thấy mát"*) đều
  không chứa quạt trong khung (lệch 147.6° / 61.3° / 33.6° so với khung ±20.7° / ±38.4° / ±32.9°).
  Cơ chế "gió = quạt" và "quạt thổi tay mát" hiện chỉ còn bằng hạt khí, không còn bằng vật thể.
- **Mảng hơi ẩm là mặt phẳng phẳng trước mặt áo có nếp** — `mist` là `PlaneGeometry(.52,.44)` đặt cứng ở
  `z = áo A + .04 = −3.26` (`src/set.js:259`, `src/set.js:321`), trong khi mặt vải là `ExtrudeGeometry` có nếp
  `hangFold` biên độ tới ~.04 về phía máy (`src/props.js:186–191`). Ở c22 (`fov 26`) và c24 (`fov 16`) mảng
  có thể cắt ngang nếp hoặc lọt ra trước mặt áo. `mistFar` (`src/set.js:265`) cũng là mặt phẳng phẳng
  cách mặt áo B 5 cm. Rủi ro này đã được ghi ở vòng 2 và **vẫn còn nguyên**.
- **Kẹp và dây trong đàn áo không đi theo vải** — `src/set.js:313` chỉ xoay `pile.shirts`, còn dây phơi
  (`src/props.js:642`) và ba kẹp (`src/props.js:650–654`) nằm trong `pile.group` và **đứng yên**: khi vải
  rung, kẹp trượt khỏi vai. Nhát c40 (`fov 34`, ngắm ngang đàn áo, có thẻ `3 ÁO`) đọc được chi tiết này.
- **Hai áo nhỏ lệch 9 cm so với móc và so với cân** — móc treo ở kệ-local `x = ±.24`
  (`src/set.js:203`), cân ở `±.24` (`src/set.js:193–194`), còn áo ở `±.15` (`src/set.js:206`, `:208`).
  Spec ghi *"mỗi áo treo đúng trên một cái cân"* — thực tế áo lệch 9 cm về phía trong, không treo trên móc.
- **Dây phơi đung đưa nhưng quần áo không theo** — `line.setSway()` dịch cả sợi dây
  (`src/props.js:81`), còn áo/quần/khăn/áo thun và kẹp đặt cố định (`src/set.js:122–135`). Ở c56–c58
  (khung rộng của dây) sai lệch 12 mm là đọc được khi vải đung đưa.
- **Chưa có mặt cắt thật ở N2/N3** — `rig/section.js` vẫn không được import ở `src/`. Quyết định của
  Spec ("dựng theo cách khác") **lần này đã có cơ sở trong hình**: `wovenCloth()` là một tấm vải dệt thật
  (44×44 sợi luồn–lướn) và `buildWater()` có bờ chật thật (`src/set.js:509`). Nhưng N2 và N3 vẫn là hai
  thế giới rời nhau: nhát c12 (rìa sợi) → c13 (mặt nước) không có dấu hiệu liên tục nào ngoài giọt nước.
- **N2/N3 còn mắc lưới viền mực ở cự ly siêu cận** — c9 (`fov 12`) và c16 (`fov 18`) có các sợi và quả cầu
  rất nhỏ; nếu chưa có quy tắc giảm viền mực theo cự ly thì sợi dệt và hạt hơi nước sẽ thành que đen.
- **Vật liệu cận cảnh còn trơn** — `thinTee` (`src/props.js:552`), vỏ/lưới `deskFan` (`src/props.js:711–739`)
  và da `hand` (`src/props.js:1543`) đều **không có `map`** nào, dù Spec đã ghi yêu cầu texture canvas cho
  ba vật này. Yêu cầu trong Spec đúng, nhưng code chưa thực hiện — đây là nợ của đợt dựng, không phải lỗi Spec;
  nếu render lại ở c20/c24/c30/c55 thì chất liệu sẽ trơn đúng như lo.

---

## KẾT LUẬN YÊU CẦU ĐẠO DIỄN

- **Spec vẫn chưa đủ chặt để chuyển sang Bước 5.** Cần xử lý **35** mục:
  - **3 linh kiện bị bỏ sót hẳn**: ① ba giọt bám mép áo A (`hemBeads`, c25–c26) — và phải sửa luôn toạ độ của
    nó trong `set.js`; ② biến thể "áo phông đã khô (màu sáng)" trong `PROPS`; ③ lớp thẻ số `label()`
    (11 thẻ, trong đó `2 kJ` chưa có mặt trong `LOOK.md`).
  - **13 hàng sai mô tả/số đo**: ④ công thức uốn sợi `A = rad·1.05` + bán kính `0.74–1.30 r` + lời gọi
    `wovenCloth({n:44,size:.34})`; ⑤ "hai mặt kính **nằm ngang**" phải sửa thành **đứng**; ⑥ `mistBal`
    độ đục `.32` và chỉ ở c47; ⑦ `mistFar` độ đục `.22`; ⑧ mồ hôi **không có "mảng alpha"**, bán kính
    2.6–3.6 mm; ⑨ giọt trong khe là **4** và nằm ở `props.js`; ⑩ áo úp `w .62 h .72`; ⑪ hai áo nhỏ `w .30 h .40`;
    ⑫ thanh treo áo chỉ có **1 móc** và không còn là "hai áo treo cạnh nhau"; ⑬⑭ `fanB`/`fanC` **không quay**;
    ⑮⑯ `dropOnThread` (c9, fov 12) và `hemDrop` (c51, fov 30) chưa có yêu cầu texture.
  - **19 hàng sai c_id** — bảng ở trên, trong đó nặng nhất là **quạt bàn chỉ xuất hiện ở c3 và c27**
    (spec ghi c5–c7, c24, c52–c55) và **túi nylon trong phòng không xuất hiện ở nhát nào**.
- **Ba việc sửa trong code, không sửa được bằng tài liệu** (theo thứ tự ưu tiên):
  1. **Gắn `hemBeads` vào mép áo A** (con của `shirtA.group`) — hiện chúng nằm dưới sàn; c25–c26 đang trống vật.
  2. **Gọi `setSpeed` cho `fanB` và `fanC`** — hiện hai quạt nhỏ đứng yên ở c33–c37.
  3. **Đưa quạt vào khung c6, c31, c54–c55** (hoặc dời máy, hoặc dời quạt) — ba nhát này đang kể chuyện
     "quạt tạo gió" mà trong khung không có quạt.
- **Bốn lỗi còn sót từ vòng 2, chưa đóng**: mảng hơi phẳng trước nếp vải (mục 5 vòng 2 — vẫn còn);
  kẹp trong đàn áo trượt khỏi vai (vẫn còn); mặt cắt N2/N3 (đã có cơ sở hơn nhờ `wovenCloth` + bờ chật, nhưng
  liên tục không gian vẫn chưa có); và texture cho `thinTee`/`deskFan`/`hand` (Spec đã ghi, code chưa làm).
- **Ưu tiên đọc lại trước khi render**: các mục 17, 20, 21, 22 (c_id) và mục 13, 14 (cánh quạt) là những lỗi
  làm **hình đọc sai**, không phải lỗi tài liệu — chúng phải sửa được trong `film.js`/`set.js` trước khi
  Spec được coi là hợp lệ.
