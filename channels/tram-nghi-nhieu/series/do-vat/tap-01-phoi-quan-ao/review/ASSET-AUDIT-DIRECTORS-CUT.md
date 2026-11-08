# DIRECTOR'S CUT — Bước 4 (Bóc tách linh kiện) — vòng 5/5

Báo cáo soi tài liệu vòng 5 (`review/ASSET-AUDIT-REVIEW-5.md`) kết luận **REJECT** với `MISSING_ASSETS_COUNT = 0`: **không còn linh kiện nào bị bỏ sót**, còn lại là 15 hàng sai cột "Xuất hiện ở", 1 hàng mô tả sơ sài, **3 việc sửa được bằng hình** và 3 điểm `LOOK.md` không khớp khung. Đủ 5 hiệp — theo luật của kênh, Đạo diễn dùng quyền tối hậu để chốt.

## 1. Những gì báo cáo đòi, và Đạo diễn đã làm

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

**Về "áo úp phải đọc ra là cái áo" — sửa được, nhưng phải sửa bằng hình và bằng bối cảnh.** Không sửa bằng tài liệu: đạo cụ cũ (`tShirt` khoác lên lưng ghế) nhìn từ máy chỉ là một mảng vải dựng đứng, không cổ, không tay áo; thẻ `ÁO ÚP` chỉ vào một mặt ghế trống. Đạo diễn chọn cách sửa **mạnh nhất nhưng vẫn đúng lời**: dựng đạo cụ riêng `foldedShirt()` — áo phông **úp mép dưới lên** (nếp gấp là một nửa trụ bán kính 18 mm, không phải lật thẳng tấm vải, nếp mềm thì mép nếp không bị răng cưa); cổ áo nằm ở nửa trên nên **không bị úp phủ**; mảng ẩm của nửa dưới nằm **trên mặt gấp**; có ba giọt nước bám. Cả hai cái áo chuyển xuống **sàn hiên, nằm cạnh nhau** — đúng lời c49 ("hai cái trong một khung để so"), và chiếc ghế trở lại là ghế hiên bình thường.

## 3. Kiểm lại bằng ảnh sau khi sửa

| Nhát | Lệnh | Kết quả |
|---|---|---|
| c25 | `still.mjs … 76` | mép áo + ba giọt bám có điểm sáng + lớp hơi ẩm; sau lưng là tường tối, không có cửa sổ kín |
| c29 | `still.mjs … 87` | áo B: nửa dưới sắc sẫm có đường triều + bốn giọt bám; không có vệt hơi nước |
| c49 | `still.mjs … 142` | hai cái áo nằm cạnh nhau trên sàn: áo phơi rộng (trải phẳng, nửa ngoài nửa trong) và áo úp (cổ, vai, tay áo còn lộ; mảng ẩm xanh xám trên mặt gấp; ba giọt nước) |
| c50 | `still.mjs … 145` | quần dày + áo thun mỏng đọc được cùng lúc; không có lan can trong khung |
| c56/c58/c59 | `still.mjs … 164 / 166 / 169` | áo teal và áo thun mỏng là hai chiếc riêng |
| c60 | `still.mjs … 172` | áo phơi rộng trên sàn, hai mặt thông; cái áo úp không lọt vào khung |

## 4. Chốt

- Linh kiện: **đủ** (`MISSING_ASSETS_COUNT = 0`, không còn rủi ro lắp ghép mới).
- Bản đặc tả: `COMPONENTS_SPEC.md` đã cập nhật cả bốn nhóm, có mục *"Cập nhật sau bài soi tài liệu vòng 5"* ghi lại đúng những gì đã sửa trong mã.
- `LOOK.md`: ba chỗ sai đã sửa, c49 và c60 viết lại theo khung mới, thêm mục *"Vòng 7 (dàn lại cặp đối chiếu ở c49–c60)"*.
- Vì đã hết 5 hiệp, **Bước 4 chốt ở đây** bằng Director's Cut này; các điểm còn lại của vòng 5 đã được xử lý trong mã và kiểm bằng ảnh thật, nên sang Bước 5 (dựng đạo cụ) và Bước 6 (lắp ghép, nhịp điệu).
