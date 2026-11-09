# DIRECTOR'S CUT — Bước 4 (Bóc tách linh kiện) — vòng 5/5 (làm mới sau vòng chấm hình thứ năm)

Báo cáo soi tài liệu vòng 5 (`review/ASSET-AUDIT-REVIEW-5.md`) kết luận **REJECT** với `MISSING_ASSETS_COUNT = 0`: **không còn linh kiện nào bị bỏ sót**, còn lại là 15 hàng sai cột "Xuất hiện ở", 1 hàng mô tả sơ sài, **3 việc sửa được bằng hình** và 3 điểm `LOOK.md` không khớp khung. Đủ 5 hiệp — theo luật của kênh, Đạo diễn dùng quyền tối hậu để chốt.

Bản cắt này viết lại sau vòng chấm **hình thứ thứ năm**, khi tài liệu đã trôi khỏi mã: có **một thiết bị đo thứ hai** (nhiệt kế ba mươi độ), ẩm kế đọc con số khác, có **hai bàn phơi gỗ** và **năm lớp FX mới** mà tài liệu chưa biết. Phần lịch sử của vòng 5 giữ nguyên ở dưới; phần làm mới nằm ở mục 5.

## 1. Những gì báo cáo vòng 5 đòi, và Đạo diễn đã làm

| # | Báo cáo vòng 5 đòi | Cách sửa | Kiểm bằng ảnh thật |
|---|---|---|---|
| 1 | 15 hàng sai cột "Xuất hiện ở" (8 hàng ghi thừa c_id, 7 hàng thiếu c_id) | Sửa ngay trong `COMPONENTS_SPEC.md`: bỏ c31 (áo B, thanh treo áo B), c50 (lan can → **đổi thành c58**), c47 (bồn chậu), c50 (ghế, áo úp, áo phơi rộng), c42 + c51 (đàn áo), c38 (dây phơi 1), c2 + c45 (cánh cửa), c6 + c27 + c29 (thanh treo áo A), c4 + c29 + c34–c37 (luồng gió), c29 (vệt hơi nước bị gió chở đi), c37 (gió ở bàn thí nghiệm); thêm c50 + c56 (túi nylon), c5 + c27 + c30 + c53 + c54 (hai cân, hai áo nhỏ), c5 + c27 + c30 + c33–c34 (quạt nhỏ trên kệ, kệ gỗ), c5 + c7 (quạt nhỏ trên bàn thí nghiệm + bàn thí nghiệm), c40 + c58 (nhiệt kế, ẩm kế), c1 + c2 + c47 (ba giọt bám mép) | Đọc lại từng hàng; các nhát có camera dựng lại đã soi lại bằng ảnh chụp |
| 2 | 1 hàng mô tả sơ sài: "áo phông thứ hai" bị "áo thun mỏng" che | **Dời vật, không sửa bằng tài liệu**: `teeBack` từ `x = 1.47` (sau `thinTee` 5 cm) sang `x = 0.85`, có kẹp gỗ thứ tư trên dây | c50, c56, c58, c59: hai cái áo đọc ra là **hai chiếc riêng** (áo teal đậm đứng cạnh áo thun xanh nhạt) |
| 3 | Ba giọt bám mép đọc thành ba hạt tối ở c25 | **Sửa trong đạo cụ**: mọi giọt bám và giọt rơi của `tShirt` nay nằm ở **lớp FX** (không có viền mực đen), thân giọt `#8fdcf6` bán trong suốt, thêm một quả cầu trắng nhỏ làm điểm sáng (`hiMat`, `hiR`) | c25: ba giọt ở mép áo đọc ra là **giọt nước có meniscus và điểm sáng**, không phải hạt tối; c1, c2, c47 cũng đọc được |
| 4 | Cân lại tầm "đầu quạt" cho hai hàng quạt nhỏ | Thống nhất một thước: cả hai hàng ghi **tâm đầu quạt `y ≈ 0.98`** (đáy đế ghi riêng `y = .72` / `y = .745`) | — |
| 5 | LOOK c50: *"lan can ở tiền cảnh tạo chiều sâu"* | Sửa `LOOK.md`: máy đã nâng lên `y = 1.32`, `z = 3.20` nên **thanh lan can rơi dưới mép khung, c50 không có lan can**; khung có lan can là c58 | Chụp lại c50 |
| 6 | LOOK c29: *"mảng ẩm vẫn còn"* | **Phản biện một nửa, sửa một nửa** (xem mục 2 bên dưới) | Chụp lại c29 |
| 7 | LOOK c25: *"phía sau là cửa sổ kín"* | Sửa `LOOK.md`: sau áo A là **tường phòng tối** và hai mặt kính bàn thí nghiệm ở góc phải; **không thấy cửa sổ kín** | Chụp lại c25 |

## 2. Phản biện của Đạo diễn

**Về c29 — báo cáo đọc sai khung.** Báo cáo nói *"c29 không có lớp ẩm nào đọc được (áo B chỉ còn sắc navy sẫm)"*. Đạo diễn chụp lại c29 (`t = 87`): **nửa dưới áo B sắc navy sẫm hơn hẳn nửa trên, ranh giới là một đường triều méo mó, và có bốn giọt nước bám** — mảng ẩm **có** đọc được. Điều báo cáo nói đúng là *không có vệt hạt hơi nước bị gió chở đi* ở c29 (mã chỉ bật `vap` ở c30–c31). Vì vậy câu LOOK được viết lại cho đúng cả hai: mảng ẩm còn, vệt hơi nước thì không.

**Về "áo úp phải đọc ra là cái áo" — sửa được, nhưng phải sửa bằng hình và bằng bối cảnh.** Không sửa bằng tài liệu: đạo cụ cũ (`tShirt` khoác lên lưng ghế) nhìn từ máy chỉ là một mảng vải dựng đứng, không cổ, không tay áo; thẻ `ÁO ÚP` chỉ vào một mặt ghế trống. Đạo diễn chọn cách sửa **mạnh nhất nhưng vẫn đúng lời**: dựng đạo cụ riêng `foldedShirt()` — áo phông **úp mép dưới lên** (nếp gấp là một nửa trụ bán kính 18 mm, không phải lật thẳng tấm vải, nếp mềm thì mép nếp không bị răng cưa); cổ áo nằm ở nửa trên nên **không bị úp phủ**; mảng ẩm của nửa dưới nằm **trên mặt gấp**; có ba giọt nước bám. Cả hai cái áo chuyển xuống **mặt bàn phơi gỗ, nằm cạnh nhau** — đúng lời c49 ("hai cái trong một khung để so"), và chiếc ghế trở lại là ghế hiên bình thường.

## 3. Kiểm lại bằng ảnh sau khi sửa

| Nhát | Lệnh | Kết quả |
|---|---|---|
| c25 | `still.mjs … 76` | mép áo + ba giọt bám có điểm sáng + lớp hơi ẩm; sau lưng là tường tối, không có cửa sổ kín |
| c29 | `still.mjs … 87` | áo B: nửa dưới sắc sẫm có đường triều + bốn giọt bám; không có vệt hơi nước |
| c49 | `still.mjs … 142` | hai cái áo nằm cạnh nhau trên mặt bàn phơi gỗ: áo phơi rộng (trải phẳng, nửa ngoài nửa trong) và áo úp (cổ, vai, tay áo còn lộ; mảng ẩm xanh xám trên mặt gấp; ba giọt nước) |
| c50 | `still.mjs … 145` | quần dày + áo thun mỏng đọc được cùng lúc; không có lan can trong khung |
| c56/c58/c59 | `still.mjs … 164 / 166 / 169` | áo teal và áo thun mỏng là hai chiếc riêng |
| c60 | `still.mjs … 172` | bàn phơi thứ hai trải phẳng, không chồng quần áo; cái áo úp không lọt vào khung |

## 4. Những gì vòng chấm hình thứ năm đã đụng vào đạo cụ (rà lại tài liệu)

| Mã | Nội dung | Sửa ở đâu |
|---|---|---|
| c44, c45 | Ba mươi độ giờ thuộc **một thiết bị khác**: nhiệt kế treo tường **luôn đọc 25 °C**; câu 44–45 đọc nhiệt kế thứ hai `thermo30` đặt cạnh tấm vải thử, cột đứng đúng vạch 30 | `COMPONENTS_SPEC.md` — tách thành hai hàng; `src/set.js` (`thermo30`, `tempTrack`) |
| c45, c46 | Ẩm kế **luôn đọc chín mươi phần trăm** (đúng lời c46), **hết cung** ở c41–c44, rớt ~70 % ở c45 | `COMPONENTS_SPEC.md` — sửa cột "Động"; ẩm kế thứ hai (`hygro2`) ghi rõ là **đã bỏ** |
| c45 | Hơi nước **mỏng, bốc nhanh** (`denseSpk`) — khác hẳn hơi nước **đặc, bốc chậm** ở c46 (`slowSpk`) | `COMPONENTS_SPEC.md` — hai hàng FX mới |
| c49, c60 | Hai **bàn phơi gỗ** `dryBench()` ×2 (mặt `y = .42`): một bàn giữ cặp áo, một bàn trải phẳng cho câu "không chồng quần áo lên nhau"; màu hai cái áo đổi (`#b3c3cf`, `#e3d8bd`) vì bản cũ **trắng cháy** | `COMPONENTS_SPEC.md` — hàng đạo cụ mới + sửa cột "Xuất hiện ở" của áo úp / áo phơi rộng |
| c59 | Cần **luồng khí thật** chạy từ lối mở sang trái: thêm vệt gió ở hiên (`streak`) bên cạnh khí tràn qua lối mở (`doorSpk`) | `COMPONENTS_SPEC.md` — hai hàng FX mới |
| c25, c26, c22, c23, c27 | **Dải mực ở mép áo A** (`hemBand`), **dải hơi nước bay lên** (`vapBand`), **vệt ẩm bị gió quét đi** (`wetLayer`) | `COMPONENTS_SPEC.md` — ba hàng FX mới |
| toàn phim | **Luật vẽ gió** đổi: vệt khí phải ngắn, mảnh, có đầu sáng — không phải tia laser; hạt tròn dành cho hơi nước và khí qua lối mở | `COMPONENTS_SPEC.md` — mục "Rủi ro lắp ghép đã xử lý", ghi rõ lý do đổi |

**Số đo trên đồ đo — khoá lại một lần, không đổi nữa:** nhiệt kế treo 25 °C; nhiệt kế `thermo30` 30 °C (chỉ c44–c45); ẩm kế 90 % (bão hoà ở c41–c44, ~70 % ở c45); hai cân 288 g và 88 g. Không đồ đo nào đọc hai con số khác nhau trong cùng một câu.

## 5. Chốt

- Linh kiện: **đủ** (`MISSING_ASSETS_COUNT = 0`, không còn rủi ro lắp ghép mới).
- Bản đặc tả: `COMPONENTS_SPEC.md` đã cập nhật cả bốn nhóm, có mục *"Cập nhật sau bài soi tài liệu vòng 5"* và mục *"Vòng 11 — sau vòng chấm hình thứ năm"* ghi lại đúng những gì đã sửa trong mã.
- `LOOK.md`: ba chỗ sai đã sửa, c49 và c60 viết lại theo khung mới, thêm mục *"Vòng 7 (dàn lại cặp đối chiếu ở c49–c60)"*.
- Vì đã hết 5 hiệp, **Bước 4 chốt ở đây** bằng Director's Cut này; các điểm còn lại của vòng 5 đã được xử lý trong mã và kiểm bằng ảnh thật, nên sang Bước 5 (dựng đạo cụ) và Bước 6 (lắp ghép, nhịp điệu).

SCOPE: bản cắt này đóng **Bước 4 (bóc tách linh kiện)** cho tập `tap-01-phoi-quan-ao`, bao gồm vòng soi tài liệu 5 hiệp và lần làm mới sau vòng chấm hình thứ năm. Nó được viết **sau lần sửa mã và tài liệu cuối cùng** (`COMPONENTS_SPEC.md`), nên cổng đọc được phán quyết và đóng được tem `ASSET.pass`.

## Vòng 6 — bàn phơi và bồn chậu ở câu 1

Sau khi đọc tờ nhịp, Đạo diễn dựng lại **khung mở đầu (câu 1)** và phát hiện một lỗi lắp ghép thật: **bàn phơi gỗ (bàn thứ nhất, `dryBench` 2.30 × .82 ở `(−0.75, 0, 1.30)`) đứng ngay trước bồn chậu** (`(−1.25, 0, 0.85)`), và bồn chậu nằm sát mép bàn — nên **không có góc nhìn nào từ phía trước thấy được bồn**. Trong khi tài liệu ghi bồn chậu xuất hiện ở c1, và câu mở đầu lại nói *"nước vẫn còn đó"*.

Cách sửa (không đụng đạo cụ, chỉ đổi bố cục và cờ hiện):

- **Bàn phơi thứ nhất ẩn đi ở câu 1** (cờ `noBench`) — bàn phơi là đạo cụ của câu 49 (giữ cặp áo) và bàn thứ hai là của câu 60; ở câu 1 nó không có lý do đứng ở đó.
- **Cặp áo của câu 49 ẩn đi ở câu 1** (cờ `noCmp`) — chúng chưa tới giờ xuất hiện, và chúng đứng ngay trước ống kính.
- Nhờ đó **bồn chậu có nước lộ ra ở đáy khung mở đầu** — đúng như hàng "Bồn chậu nhựa có nước (dưới áo ướt) | c1, c60" trong tài liệu. Cột "Xuất hiện ở" của **hai bàn phơi** vẫn là `c49, c60` (đúng như mã), và cặp áo vẫn là `c49`.

Kiểm bằng ảnh thật: `still.mjs … 4.6` → câu 1 thấy nửa áo ẩm, giọt bám, và **nước đứng trong bồn ngay dưới mép áo**. Không có linh kiện nào mới, không có linh kiện nào bị bỏ.

## Vòng 7 — sau lần sửa thẻ: không linh kiện nào đổi

Lần sửa cuối đụng vào **một tệp mã duy nhất**: `src/film.js` — năm thẻ thuật ngữ được giữ lâu hơn / hiện sớm hơn, và hai thẻ dời chỗ. `src/props.js` **không đụng một dòng** (đã kiểm bằng `git diff`), nên:

- **Không có linh kiện nào mới**, không có linh kiện nào bị bỏ: danh mục `COMPONENTS_SPEC.md` và mã vẫn khớp (`check_props_used.py`: 26 vật, đủ).
- Cột "Xuất hiện ở" không đổi ở bất kỳ linh kiện nào.
- Số đo trên đồ đo vẫn khoá như đã chốt: nhiệt kế treo 25 °C; `thermo30` 30 °C; ẩm kế 90 %; hai cân 288 g và 88 g.

## Vòng 8 — sau lần dời hai mũi tên: không linh kiện nào đổi

Lần sửa này cũng đụng vào **một tệp mã duy nhất**: `src/film.js` — hai thẻ (`2 ÁO`, `TRƯỚC QUẠT`) dời mũi tên từ khe trống vào vải. `src/props.js` và `src/set.js` **không đụng một dòng** (kiểm bằng `git diff`), nên:

- **Không có linh kiện nào mới**, không có linh kiện nào bị bỏ: danh mục `COMPONENTS_SPEC.md` và mã vẫn khớp (`check_props_used.py`: 26 vật, đủ).
- Cột "Xuất hiện ở" không đổi ở bất kỳ linh kiện nào.
- Số đo trên đồ đo vẫn khoá như đã chốt.

## Vòng 9 — sau lần sửa mũi tên ở c17: không linh kiện nào đổi

Lần sửa này cũng đụng vào **một tệp mã duy nhất**: `src/film.js` — thẻ `PHÂN TỬ BAY LÊN` (c17) bỏ khoá `dx` để mũi tên chạm đúng vào phân tử. `src/props.js` và `src/set.js` **không đụng một dòng** (kiểm bằng `git diff`), nên:

- **Không có linh kiện nào mới**, không có linh kiện nào bị bỏ: danh mục `COMPONENTS_SPEC.md` và mã vẫn khớp (`check_props_used.py`: 26 vật, đủ).
- Cột "Xuất hiện ở" không đổi ở bất kỳ linh kiện nào.
- Số đo trên đồ đo vẫn khoá như đã chốt.

## Vòng 10 — sau lần đổi sang `cardWindow()` của rig: không linh kiện nào đổi

Lần sửa cuối cùng (14:39) đụng vào **một tệp mã duy nhất**: `src/film.js` — khối tính cửa sổ thẻ chuyển sang
hàm `cardWindow()` của rig (`rig/render.js:209-213`). Đây là **thay đổi hình thức, không phải thay đổi hình**:
tôi đã đối chiếu hai công thức dòng bằng dòng và chúng tính ra **cùng một cửa sổ** cho từng thẻ, nên không
khung hình nào của phim đổi (đây cũng là lý do phim không cần dựng lại). `src/props.js` và `src/set.js`
không đụng một dòng.

- **Không có linh kiện nào mới**, không có linh kiện nào bị bỏ: danh mục `COMPONENTS_SPEC.md` và mã vẫn khớp
  (`check_props_used.py`: 26 vật, đủ).
- Cột "Xuất hiện ở" không đổi ở bất kỳ linh kiện nào.
- Số đo trên đồ đo vẫn khoá như đã chốt: nhiệt kế treo 25 °C; `thermo30` 30 °C; ẩm kế 90 %; hai cân 288 g và 88 g.
- Lợi ích phụ cho các tập sau: cửa sổ thẻ giờ tính bằng **một hàm chung của rig**, nên đổi công thức không
  phải sửa ở từng tập — và một tập dùng rig cũ sẽ không âm thầm tính khác tập dùng rig mới.

## VERDICT: PASS
