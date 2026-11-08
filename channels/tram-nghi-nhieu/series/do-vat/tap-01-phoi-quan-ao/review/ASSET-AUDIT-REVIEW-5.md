VERDICT: REJECT
ROUND: 5/5
MISSING_ASSETS_COUNT: 0

> Phân rã: **0** linh kiện bị bỏ sót hẳn (không có hàng trong Spec) + **0** linh kiện có hàng nhưng **không đọc được ở đúng nhát mà lời/LOOK đòi** — cả 5 mục "bị thiếu/không đọc được" của vòng 4 đã được sửa và **đã kiểm lại bằng ảnh thật**.
> Còn lại: **15 hàng sai cột "Xuất hiện ở"** (8 hàng ghi thừa c_id không có trong khung, 7 hàng thiếu c_id có trong khung) + **1 hàng sai quy ước đo** + **3 điểm LOOK mô tả không đúng với khung đã chụp**.

Cách kiểm: đọc lại `voice/lines.json` (60 câu), `LOOK.md` (60 nhát + "Số trên hình" + các vòng sửa), `COMPONENTS_SPEC.md` (244 dòng); đối chiếu với mã `src/props.js` (bảng `PROPS` dòng 2612–2637, `tShirt` dòng 399–467, `deskFan` dòng 1001+, `shirtPile` dòng 890–929), `src/set.js` (toạ độ vật, cờ bật/tắt), `src/film.js` (bảng `SHOTS` = 60 máy, bảng `CARDS` = 29 thẻ); **chụp thật đủ 60 khung** bằng

```sh
cd /home/minhbien/Documents/lemo-opuscar && LEMO_ANGLE=vulkan node core/render/still.mjs \
  channels/tram-nghi-nhieu/series/do-vat/tap-01-phoi-quan-ao <t> --out /tmp/audit5
```

(mốc thời gian lấy từ `voice/proc/dur.json` + `src/timeline.js`: `t = t0(cN) + 0.60 · dur[cN]`; `t0` cộng dồn `gap` của câu trước theo `SEQ`). Mọi kết luận "có/không trong khung" dưới đây đã soi trên ảnh thật; kèm phép chiếu toạ độ thế giới → NDC của từng vật theo đúng `fov`/`p`/`l` của từng nhát (camera ở `u = 0.60`) để chỗ nào khó đọc bằng mắt thì có số.

**Ghi nhận — phần đã sửa đúng từ vòng 3 (không tính vào điểm)**: ba giọt bám mép nằm trong đạo cụ `tShirt` ✔; `fanB.setSpeed()` / `fanC.setSpeed()` được gọi thật ✔; `bag2` đã gỡ ✔; `wovenCloth({n:44, size:.34})` ✔; hai mặt kính của bàn thí nghiệm **đứng** ✔; `mistBal` chỉ ở c47 ✔; mồ hôi không có mảng alpha ✔; **4** giọt trong khe ✔; `tShirt({w:.62,h:.72})` và `tShirt({w:.30,h:.40}) ×2` ✔; thanh treo áo A còn **1** móc ✔.

---

## DANH SÁCH LINH KIỆN BỊ THIẾU HOẶC MÔ TẢ SƠ SÀI

### Không còn linh kiện nào bị thiếu hẳn

Đã quét từng vật thể mà lời kể và `LOOK.md` nhắc tới: dây phơi + cọc + kẹp, áo ướt/áo khô, quần đùi, khăn, áo thun, áo thứ hai, áo A, áo B, đàn áo chồng, áo phơi một mặt, áo úp, áo phơi rộng, bồn chậu, ghế, bàn thấp, quạt bàn, quạt nhỏ trên bàn thí nghiệm, quạt nhỏ trên kệ, túi nylon, hai cân, hai áo nhỏ trên kệ, bàn thí nghiệm + vách ngăn + hai mặt kính, nhiệt kế, ẩm kế, bàn tay, sợi vải, tấm vải dệt, giọt trên sợi, mảng nước trong khe, vệt nước trong xơ, mặt nước + bờ chật, phân tử, hạt hơi nước, lớp hơi ẩm (3 loại), các vệt gió, giọt mép khăn, thanh treo áo A, **thanh treo áo B**, đồng hồ treo tường, lan can, cửa kính, cửa sổ kín, bức tường có lỗ cửa, trần, thẻ `label()` — **tất cả đều đã có hàng trong `COMPONENTS_SPEC.md`**. Không linh kiện nào thiếu.

### Mô tả sơ sài còn lại — 1 hàng

- **Nhóm 1 — "Áo phông thứ hai trên dây 1 (xanh teal)"** (`tShirt({color:'#5d8fa6'})`, `teeBack`).
  - Vấn đề: `teeBack` đặt ở `(1.47, 1.454, .80)` — **5 cm sau và 3 cm trái** `thinTee` `(1.50, 1.4521, .85)`, mà `thinTee` (`w .52, h .62`) **nhỏ hơn** `teeBack` (`w .52, h .78`). ⇒ ở **c48, c50, c56, c58, c59** (đúng năm nhát mà hàng này ghi) món "xanh teal" **không bao giờ đọc được thành một chiếc áo riêng**: nó bị `thinTee` che gần hết, chỉ lò mày ở mép phải. Ở c48 nó ló ở mép dưới khung (vài pixel), ở c50/c56/c58/c59 nó lẩn sau `thinTee`.
  - Yêu cầu: hoặc dời `teeBack` ra xa (`x ≈ 1.86` cạnh túi nylon, quay `y` khác) để nó thành món thứ hai đọc được, hoặc **gộp hàng này vào hàng "áo thun mỏng"** và bỏ cả 5 c_id. Không nên giữ một hàng mà vật không đọc được ở bất kỳ nhát nào.

---

## HÀNG SAI CỘT "XUẤT HIỆN Ở" (15 hàng)

Vòng 4 đã sửa 35 hàng, nhưng phần lớn sửa theo **vị trí máy cũ**. Ba máy đã dựng lại từ đó (`c25`, `c50`, `c31`) làm một loạt c_id cũ thành sai, và các nhát toàn cảnh phòng (`c5`, `c27`, `c30`, `c53`, `c54`) có nhiều vật nền mà cột chưa ghi.

### A. Hàng ghi c_id mà ảnh thật **không có** vật đó trong khung (8 hàng — phải BỎ c_id)

| # | Hàng trong `COMPONENTS_SPEC.md` | Ghi hiện tại | Thực tế (đã chụp khung thật) | Sửa |
|---|---|---|---|---|
| 1 | **Áo B** (góc xa) | c5, c7, c29, **c31**, c52–c53 | Khung c31 (fov 56, máy `(.863, 1.34, −2.07)` nhìn `(.05, 1.15, −3.60)`) **không có áo B**: NDC của áo B là `x = 1.46`, thanh treo áo B là `x = 1.57` ⇒ cả hai nằm ngoài khung. Khung c31 chỉ có quạt bàn (lưới + cánh), áo A, bàn thí nghiệm | **bỏ c31** |
| 2 | **Thanh treo áo B** (Nhóm 3) | c5, c29, **c31**, c52, c53 | Cùng lý do (mục 1) | **bỏ c31** |
| 3 | **Lan can hiên** (Nhóm 3) | **c50** | Ở c50 máy đã nâng lên `y = 1.32`, `z = 3.20` ⇒ **lan can `z = 2.50` nằm sau máy và thanh trên `y = 0.95` rơi dưới mép khung** (NDC `y = −1.06`); khung c50 không có lan can. Ngược lại, khung **c58** thì thấy rõ lan can ở góc trái (NDC `x = −0.73`) | **đổi c50 → c58** |
| 4 | **Bồn chậu nhựa có nước** | c1, **c47**, c60 | Ở c47 máy ở `(−.42, 1.34, 2.26)` nhìn xuống mép áo; chậu nằm ở `y = 0.10` dưới khung (NDC `y = −1.42`). Khung c47 **không có chậu** | **bỏ c47** |
| 5 | **Ghế gỗ** | c1, c47, c49, **c50**, c57, c58, c60 | Ở c50 ghế ở `x = −2.0` (NDC `x = −1.52`) ⇒ ngoài khung trái | **bỏ c50** |
| 6 | **Cái áo úp** (trên lưng ghế) | c47, c49, **c50**, c57, c60 | Cùng lý do (NDC `−1.37`) | **bỏ c50** |
| 7 | **Áo phơi rộng** | c47, c49, **c50**, c57, c60 | Cùng lý do (NDC `−1.45`) | **bỏ c50** |
| 8 | **Đàn áo phơi chồng** | c38, c40, **c42**, c47, c48, c50, **c51**, c56–c59 | Ở **c42** (cận mặt ẩm kế) đàn áo nằm ngoài khung (NDC `2.91, 1.73`); ở **c51** (cận mép khăn) đàn áo nằm 2 m phía sau trên (NDC `x > 1`) | **bỏ c42, c51** |
| 9 | **Dây phơi thứ nhất** (hiên) | c1, **c38**, c47, c48, c50, c56–c58 | Ở c38 máy ở `z = 1.35`, dây 1 ở `z = 0.85` chạy **dưới khung** (NDC `y = −1.94`); khung c38 chỉ có dây thứ hai + dây riêng của đàn áo | **bỏ c38** |
| 10 | **Cánh cửa kính** | c1, **c2**, c38, **c45**, c48, c50, c56, c59 | Ở **c2** (cận mép áo) cánh cửa ở `x = 0.90` hoàn toàn ngoài khung (NDC `x` > 1); ở **c45** (nhiệt kế + ẩm kế) cũng ngoài khung (NDC `x = 2.13`) | **bỏ c2, c45** |
| 11 | **Thanh treo áo trong phòng kín** (Nhóm 3) | c5–c7, c19–c32 | Ở **c6** (đẩy vào miệng quạt), **c27** (quay ngược về quạt) và **c29** (quay sang áo B) máy không có thanh trong khung (NDC `x` > 1) | **bỏ c6, c27, c29** |
| 12 | **Giọt nước đọng trên sợi** | **c8**, c9, c11 | Ở c8 (fov 12, máy `(0.11, 0.06, 0.22)`) giọt ở `(−.02, .105, .15)` nằm ngoài khung (NDC `−4.2, 6.4`); khung c8 chỉ có sợi + màng nước mỏng trong khe | **bỏ c8** |
| 13 | **Luồng gió trong phòng** (Nhóm 2) **và "Gió trong phòng"** (Nhóm 4) | c3–c7, c19–c31, c34–c37, c54–c55 | Luồng gió nằm ở `z = −3.30`; các nhát **c4, c29, c34, c35, c36, c37** đặt máy ở góc kệ cân / bàn thí nghiệm ⇒ luồng gió **sau lưng máy**, không một hạt khí nào trong khung. (Ở c34–c37 là gió riêng của `fanC` / bàn thí nghiệm, đã có hàng riêng) | **bỏ c4, c29, c34–c37** (cả hai hàng) |
| 14 | **Hạt hơi nước bị gió chở đi** (Nhóm 2) | **c29**–c31 | Ở c29 vệt hạt nằm sau lưng máy; mã cũng chỉ bật `vap` ở **c30–c31** (`vap: id === 'c30' \|\| id === 'c31'`). Khung c29 không có vệt hơi nước nào | **bỏ c29** |
| 15 | **Luồng gió nhỏ ở bàn thí nghiệm** (Nhóm 2) | c35–c37 | Ở c37 (siêu cận giọt sau vách) vùng hạt khí `x = 1.74…2.30` nằm ngoài khung (NDC `x = 4.32`) | **bỏ c37** |

### B. Hàng **thiếu** c_id: vật **có** trong khung nhưng cột không ghi (7 hàng — phải THÊM)

| # | Hàng | Ghi hiện tại | Thực tế | Sửa |
|---|---|---|---|---|
| 16 | **Túi nylon buộc dây** | c59 | Túi ở `(1.86, 1.30, .85)`: khung **c50** (NDC `0.69, 0.00`) và khung **c56** (NDC `0.87, 0.53`) đều thấy túi ở mép phải | **thêm c50, c56** |
| 17 | **Hai cân nhà bếp** | c3, c6, c33–c34 | Hai mặt cân đọc được ở **c5** (góc trái), **c27** (giữa-phải), **c30** (giữa-phải), **c53** (trái), **c54** (trái) | **thêm c5, c27, c30, c53, c54** |
| 18 | **Hai áo nhỏ trên thanh** | c3, c4, c33 | Hai áo nhỏ trên kệ đọc được ở **c5**, **c27**, **c30**, **c53**, **c54** | **thêm c5, c27, c30, c53, c54** |
| 19 | **Quạt nhỏ trên kệ gỗ** (`fanC`) | c33 | Quạt nhỏ ở cuối kệ thấy rõ ở **c5** (NDC `−0.57`), **c27** (`0.71`), **c30** (`0.73`), **c53** (`−0.57`) | **thêm c5, c27, c30, c53** |
| 20 | **Kệ gỗ đặt hai cái cân** (Nhóm 3) | c33–c34 | Kệ gỗ thấy ở **c5**, **c27**, **c30**, **c53** | **thêm c5, c27, c30, c53** |
| 21 | **Quạt nhỏ trên bàn thí nghiệm** (`fanB`) | c29, c35, c36, c52, c53 | Quạt nhỏ ở cuối bàn thấy rõ ở **c5** và **c7** (kèm lưới và cánh) | **thêm c5, c7** |
| 22 | **Bàn thí nghiệm dọc tường sau** | c29, c35–c37, c52, c53 | Bàn + hai mặt kính + vách thấy rõ ở **c5** và **c7** | **thêm c5, c7** |

### C. Hai hàng còn thiếu c_id, ghi chung (viết tay)

- **Nhóm 2 — "Ba giọt nước bám theo mép áo A"**: đạo cụ `tShirt({drops:true})` dùng **hai** lần — áo A trong phòng **và áo ướt ở hiên** (`src/set.js:121`). Ba giọt ở mép áo ướt hiên **đọc được rõ ở c1 và c2** (khung c1: ba giọt lam ở mép áo; khung c2: ba giọt lấp lánh rõ ràng), và còn ở c47 (nhỏ hơn). ⇒ cột "Xuất hiện ở" phải ghi **c1, c2, c25, c26, c47** (không chỉ c25–c26), hoặc phải tách thành hai hàng (áo A / áo ướt ở hiên).
- **Nhóm 1 — "Nhiệt kế"** và **"Ẩm kế"**: ở **c40** ẩm kế đọc rõ (NDC `−0.48`), nhiệt kế chỉ ló ở mép trái; ở **c58** cả hai đều đọc rõ (NDC `0.54` và `0.69`) ⇒ **thêm c40, c58**.

---

## HÀNG SAI MÔ TẢ / SỐ ĐO (1 hàng — 2/3 hàng vòng 4 đã sửa đúng)

| # | Hàng | Trạng thái |
|---|---|---|
| 29 | Nhóm 4 — **"Lớp thẻ thuật ngữ `label()`"** | ✅ **Đã sửa đúng**: ghi "**29 thẻ: 10 thẻ số/đếm + 19 thẻ thuật ngữ**", đúng `CARDS` trong `src/film.js:134–162` (29 mục) và đúng danh sách trong chính hàng |
| 30 | Nhóm 1 — **"áo phông đã khô (màu sáng)"** | ✅ **Đã sửa đúng**: ghi rõ là **cùng một đạo cụ** `shirt` (`wetColor:'#aab2c4'`), khô dần theo `shirt.setWet(1 − clamp((t−110)/50)·.95)` — khớp `src/set.js:330` |
| 31 | Nhóm 1 — **"quạt nhỏ trên kệ gỗ"** | ⚠ **Sửa chưa đủ**: con số đã đổi `1.0 → 0.90` (đúng nếu đo **đáy** đầu quạt: `0.745 + (0.42−0.166)·0.55 = 0.885`), nhưng hàng ngay trên — "quạt nhỏ trên bàn thí nghiệm" — lại ghi `y ≈ 0.98` là **tâm** đầu quạt (`0.72 + 0.42·0.62 = 0.98`). Hai hàng **đo bằng hai thước khác nhau**: cả hai quạt nhỏ đều có **tâm đầu quạt ở `y ≈ 0.98`** và **đáy ở `y ≈ 0.88–0.89` |

*(Ba hàng này không tính vào `MISSING_ASSETS_COUNT`.)*

---

## RỦI RO LẮP GHÉP KỸ THUẬT

- **"Áo phông thứ hai" vĩnh viễn bị "áo thun mỏng" che** — `teeBack` `(1.47, 1.454, .80)` nằm 5 cm sau `thinTee` `(1.50, 1.4521, .85)`; hai đạo cụ cùng kích thước ngang `.52` nên áo sau **lộ toàn bộ chiều cao `.78` > `.62`** nhưng lại bị đè theo phương nhìn. Ở c48/c50/c56/c58/c59 món "xanh teal" chỉ là một vệt mảnh mép. Sửa bằng cách **dời vật** (lệch `x` ≥ 0.35 m và xoay `y`), không sửa được bằng tài liệu.
- **Ba giọt bám mép hiện ra như hạt TÚI, không phải giọt nước** — `props.js:436–444` dùng `toon('#7fd2ea', {opacity:.72})` cho giọt; ở c25 khung thật ba giọt ở mép áo đọc ra là **ba hạt tối**, không có meniscus, không có điểm sáng (khác hẳn ba giọt ở c2 của áo ướt hiên, vốn có vệt sáng và đọc rõ là nước). Nguyên nhân: giọt của `tShirt` không có highlight, lại nằm ở mép dưới áo A vốn bị đèn tập trung chiếu lệch. Nên thêm một điểm sáng nhỏ cho `hemDrops` giống `sweatBeads` (`src/set.js:243–245`).
- **Mảng hơi ẩm vẫn là một mặt phẳng phẳng đặt trước mặt áo A** — `mistG` ở `z = −3.26` trong khi mặt áo ở `z = −3.30`; ở c22/c24 mảng cắt qua nếp vải. Ở c22 khung đọc được như một màng mờ ôm vải nên **chấp nhận**, nhưng đây là rủi ro còn tồn tại (đã ghi ở vòng 3).
- **`mistFar` đã thu đúng nhưng còn đọc như một tấm kính dựng đứng ở c52/c53** — mảng `0.60 × 0.76` đứng thẳng trước áo B, nằm vuông góc với mặt vải (áo B xoay `−π/2`). Ở c52 khung, lớp hơi đọc ra là một **vệt sáng dọc** trên ngực áo chứ không phải "lớp bám quanh"; không lỗi về c_id, nhưng hình ảnh "bám quanh cái áo" chưa đúng với lời c52.
- **Ba máy dựng lại làm lệch nhiều c_id cũ** — `c25` (`z = −2.25`), `c50` (`z = 3.20`, `y = 1.32`) và `c31` (`fov 56`) đã đổi hẳn tầm nhìn; mọi hàng trong Spec ghi "xuất hiện ở" phải **soi lại bằng ảnh sau mỗi lần dựng lại máy**, không suy từ vị trí cũ.
- **Dây phơi thứ hai chưa có bản ghi "đi theo vải" ở c40/c48** — `line2.setSway()` dịch cả sợi, `pile`/`half`/`clip2` cũng được dịch theo (`src/set.js:348–353`) ✔ đã sửa; `shirtPile.setSway()` nay dịch cả dây + áo + kẹp (`props.js:919–927`) ✔ đã sửa. Rủi ro này của vòng 3 **đã đóng**.

---

## KẾT LUẬN YÊU CẦU ĐẠO DIỄN

- **Về mặt linh kiện, Spec đã đủ** (`MISSING_ASSETS_COUNT = 0`): không còn vật nào bị bỏ sót, và **cả 5 mục "thiếu / không đọc được" của vòng 4 đã được sửa và kiểm lại bằng ảnh thật** — quần + áo thun đọc được cùng lúc ở c50, mười giọt mồ hôi đọc được trên mu bàn tay ở c54–c55, lớp hơi ẩm + mép áo + **cả ba** giọt bám lọt khung ở c25, quạt bàn quay mặt về phía máy ở c31 (lưới + cánh đọc rõ), `mistFar` thu về đúng kích thước áo B và đồng hồ đã lên cao không còn đè lên cặp áo nhỏ.
- **Nhưng cột "Xuất hiện ở" vẫn chưa đúng, nên Spec chưa phải bản dựng đáng tin.** Phải sửa **15 hàng**:
  1. **Bỏ 8 c_id không có trong khung**: c31 (áo B, thanh treo áo B), c50 (lan can → **đổi thành c58**), c47 (bồn chậu), c50 (ghế gỗ, áo úp, áo phơi rộng), c42 + c51 (đàn áo), c38 (dây phơi 1), c2 + c45 (cánh cửa kính), c6 + c27 + c29 (thanh treo áo A), c8 (giọt trên sợi), c4 + c29 + c34–c37 (luồng gió trong phòng — cả hai hàng), c29 (hạt hơi nước bị gió chở đi), c37 (gió nhỏ ở bàn thí nghiệm).
  2. **Thêm 7 hàng còn thiếu c_id**: túi nylon (c50, c56); hai cân (c5, c27, c30, c53, c54); hai áo nhỏ (c5, c27, c30, c53, c54); quạt nhỏ trên kệ (c5, c27, c30, c53); kệ gỗ (c5, c27, c30, c53); quạt nhỏ trên bàn thí nghiệm + bàn thí nghiệm (c5, c7); nhiệt kế + ẩm kế (c40, c58).
  3. **Ba giọt bám mép** phải ghi cả c1, c2, c47 (cùng đạo cụ `tShirt({drops:true})` ở hiên), không chỉ c25–c26.
- **Ba việc sửa được bằng hình, không sửa được bằng tài liệu** (theo thứ tự ưu tiên):
  1. **Dời "áo phông thứ hai" ra khỏi chỗ bị "áo thun mỏng" che**, hoặc bỏ hàng đó khỏi Spec — hiện nó không đọc được ở nhát nào.
  2. **Cho ba giọt bám mép một điểm sáng** như `sweatBeads` để ở c25 chúng đọc ra là **giọt nước** chứ không phải ba hạt tối.
  3. **Cân lại tầm "đầu quạt"** cho hai hàng quạt nhỏ (tâm `y ≈ 0.98` / đáy `y ≈ 0.88`) để hai hàng nói cùng một thước.
- **Ba chỗ `LOOK.md` mô tả không đúng với khung đã chụp** (không tính vào `MISSING_ASSETS_COUNT`, nhưng nên sửa cho khớp):
  - LOOK c50: *"lan can ở tiền cảnh tạo chiều sâu"* — máy đã nâng lên `y = 1.32`, `z = 3.20` nên **lan can không còn trong khung**.
  - LOOK c29: *"mảng ẩm vẫn còn"* trên áo B — `mistFar` chỉ bật ở c52–c53, **c29 không có lớp ẩm nào đọc được** (áo B chỉ còn sắc navy sẫm).
  - LOOK c25: *"phía sau là cửa sổ kín"* — khung c25 **không thấy cửa sổ kín** (áo A che hết tầng sau).
- Sau khi sửa **15 hàng c_id + 1 hàng mô tả sơ sài + 3 việc trong code** nêu trên, Spec mới đủ chặt để chuyển sang Bước 5.

---

## ĐỐI CHIẾU TỪNG MỤC CỦA VÒNG 4 (5/5)

| # | Mục vòng 4 | Trạng thái vòng 5 |
|---|---|---|
| 1 | Thanh treo áo B ở góc xa phòng — thêm hàng vào Nhóm 3 | ✅ **Đã sửa đúng** (hàng có mặt, đúng toạ độ `x = 2.42, y = 1.50, z = −5.05`, 2 chân đỡ, 1 móc) — ⚠ nhưng cột c_id sai ở **c31** (áo B và thanh đều nằm ngoài khung c31) |
| 2 | Quần dày + áo thun mỏng ở c50 bị lan can che → nâng máy lên `y = 1.32, z = 3.20` | ✅ **Đã sửa đúng** — khung c50 thật: quần navy (thẻ `QUẦN DÀY`) và áo thun xanh nhạt (thẻ `ÁO MỎNG`) cùng đọc được; lan can không còn che. ⚠ Hệ quả: **lan can, ghế, áo úp, áo phơi rộng không còn trong khung c50** → 4 hàng c_id sai (mục 3, 5, 6, 7 ở bảng trên) |
| 3 | Mồ hôi: 10 giọt r 6–8 mm trên mặt mu bàn tay, có điểm sáng; c54–c55 xoay `Ry(π)` | ✅ **Đã sửa đúng** — khung c55 thật thấy mười giọt lam có highlight bám trên mu bàn tay (ngón đọc rõ); c54 cũng thấy. Mã: bán kính `.0060–.0076`, `backY(x,z)` tính đúng theo vòm mu, `hand.rotation.set(0, Math.PI, 0)` ở c55 |
| 4 | Máy c25 dựng lại thấp hơn mép áo và ngẩng lên → lấy mép + lớp hơi + giọt | ✅ **Đã sửa đúng** — khung c25 thật: mép dưới tấm áo ở 1/3 dưới khung, **cả ba** giọt bám theo mép lọt khung, lớp hơi ẩm đọc ra trên ngực áo |
| 5 | Ba giọt bám mép gom vào `x ∈ [−w·.10, 0, +w·.10]` | ✅ **Đã sửa đúng** — `props.js:438` `for (const u of (drops ? [-.10, 0, .10] : []))`, `dx = u * w`; cả ba lọt khung ở c25. ⚠ Hệ quả: đạo cụ dùng chung với áo ướt ở hiên ⇒ phải ghi thêm c1, c2, c47 vào hàng |
| 6 | 35 hàng sửa cột "Xuất hiện ở" + thêm 1 hàng mới | ⚠ **Sửa chưa đủ** — 8 hàng còn ghi c_id không có trong khung, 7 hàng còn thiếu c_id, 2 hàng (ba giọt bám mép; nhiệt kế/ẩm kế) còn thiếu. Chi tiết ở bảng trên |
| 7 | Ba hàng sai mô tả/số đo (29 thẻ; áo phông đã khô; quạt nhỏ trên kệ `y ≈ 0.90`) | ✅ 2/3 đúng tuyệt đối (29 thẻ = 10 + 19; áo phông đã khô là cùng đạo cụ `shirt`) · ⚠ 1/3: `y ≈ 0.90` đúng theo **đáy** đầu quạt nhưng hàng quạt nhỏ trên bàn thí nghiệm lại dùng **tâm** (`0.98`) → phải thống nhất thước đo |
| 8 | Quạt bàn ở c31 quay mặt về phía máy → phải thấy lưới và cánh quạt | ✅ **Đã sửa đúng** — khung c31 thật: lưới nan + ba cánh quạt đọc rõ ở tiền cảnh trái. ⚠ Hệ quả: **áo B và thanh treo áo B rơi ra ngoài khung c31** → 2 hàng c_id sai |
| 9 | `mistFar` thu về 0.60 × 0.76; đồng hồ lên `(-2.30, 1.95, -6.62)`; dây phơi, quần áo, kẹp đi theo nhau | ✅ **Đã sửa đúng** — `mistFar = PlaneGeometry(.60,.76)` với alpha tắt ở rìa, ở c52/c53 bám khít áo B (không còn là tấm kính lơ lửng như vòng 3); đồng hồ đã lên cao, ở c3/c4 không còn đè lên cổ áo nhỏ; `set.js:338–353` dịch đồng thời dây 1 + áo + quần + khăn + áo thun + 3 kẹp + đàn áo + áo một mặt + kẹp 2; `shirtPile.setSway()` dịch cả dây + áo + kẹp trong đàn. Hai rủi ro còn tồn tại từ vòng 3 (kẹp/dây trong đàn; dây đung đưa mà quần áo không theo) **đã đóng** |
