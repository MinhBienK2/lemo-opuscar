# SỬA ĐẠO CỤ — Bước 5 (Code linh kiện) — sau bài soi props vòng 4

Bài soi vòng 4 (`review/PROPS-REVIEW-4.md`) chấm **FAIL**: 15 vật khớp, **10 vật hỏng** — mọi vật hỏng đều là vật mà người xem mù gọi ra một vật khác hẳn (nồi tripod thay cho quần, lưới thép thay cho vải dệt, dây chuyền thay cho giọt nước trên sợi, váy thay cho cái áo úp, bình nước thay cho giọt rơi…) hoặc đọc không ra (`KHÔNG RÕ`). Không có vật nào hỏng vì "xấu" — tất cả hỏng vì **hình dáng và bộ phận đặc trưng chưa đủ để đọc đúng trong một giây**.

Luật của kênh: vật có thật phải dựng đúng là nó. Không sửa được bằng tài liệu — sửa bằng hình.

| # | Vật | Người xem mù gọi | Nguyên nhân | Cách sửa trong mã |
|---|---|---|---|---|
| 5 | `trousers()` — quần đùi hai ống | nồi lửa tripod | eo mở to như miệng nồi, hai ống xoè như chân tripod | eo kín (nắp + thành trong), thắt lưng da có ghim + khoá kim loại + 5 lỗ thắt, ống quần thẳng (`rotation.z ±.30 → ±.06`), ống dài `.340 → .380`, hai ống cách nhau `±.078`, ống quay có đường chỉ may, đường may giữa |
| 17 | `wovenFibres()` — sợi vải đan cận | ống giấy cuộn xếp lưới | sợi là ống trụ rỗng, đầu mở có vòng đồng tâm, mặt có vân gạch chéo | bỏ vân gạch chéo, hai đầu sợi bo tròn kín (không lộ ruột), gợn dọc nhẹ, chuyển sắc 4 bậc dịu, xơ tua dày hơn (44/30/24 sợi con) |
| 18 | `wovenCloth()` — tấm vải dệt | lưới thép mắt xích | mắt vòng xếp so le, màu bạc kim loại, mép có viền răng cưa | 20 → 48 sợi mỗi chiều, sợi ép sát nhau (không hở mắt), bỏ hát chéo, sắc kem-xám, sợi dừng ở mép + 4 sợi selvedge, có nếp nhăn, xơ trên toàn tấm |
| 19 | `dropOnThread()` — giọt nước đọng trên sợi | dây chuyền mặc dây | dải ruy băng + vòng móc bạc, giọt treo lủng lẻng dưới | ruy băng → sợi tròn mảnh thật (r `.0009`), có xơ, hai đầu cắt tròn; giọt nằm **đè lên sợi** (bầu dẹt, trong suốt, điểm sáng trắng, lõi xanh nhạt), bỏ vòng móc, đoạn sợi dưới giọt ướt hơn |
| 20 | `waterSurface()` — mặt nước cận | KHÔNG RÕ | tấm xanh dẹp, mép cắt thẳng, mảng cát lốm đốm, bóng cứng | 44 dòng gợn sóng sáng–tối xen kẽ, ~110 lấp lánh lệch pha, alpha mềm (không cắt cứng mép), bờ cát ẩm hẹp 21 cm thay cho mảng cát lốm đốm, 26 bọt khí + dải bọt, 18 lấp lánh chuyển động, bỏ bóng cứng |
| 21 | `halfShirt()` — áo phơi một mặt | áo chuyển tím có hàng nút | nửa ẩm SÁNG hơn nửa khô, ranh giới thẳng, chấm xanh phẳng | ranh giới ẩm méo mó (`edgeAt`), hai vệt nước chảy xuống mép, ẩm lan lên nửa khô, nửa ẩm sẫm hơn |
| 22 | `spreadShirt()` — áo phơi rộng | áo bị xẻ dọc làm đôi | hai mặt cùng màu, tách bằng khe hở thẳng xuyên nền | mặt ngoài và mặt trong khác sắc, khe là **nếp lõm** chứ không phải đường cắt thẳng xuyên nền, cổ gân, tay áo có cổ tay |
| 23 | `foldedShirt()` — áo úp | váy hai màu, cổ hạt trai | nửa gấp là dải chữ nhật xám than, cạnh trên thẳng, cổ là hạt rời | vùng ẩm **cùng họ màu với vải** (chỉ sẫm ~2,5 lần), mép gấp có cuộn tròn, **cổ gân liền một mảnh** + đường may vai + cổ tay áo + túi ngực có đường may miệng túi, ba giọt nước bóng có điểm sáng trên lớp FX |
| 24 | `hemDrop()` — giọt nước rơi từ mép khăn | bình thuỷ tinh có nút vải | giọt to, có mặt nước ngang kiểu bình, chạm đất, có bóng | giọt nhỏ (r `.0075`), thân đều bán trong suốt xanh nhạt, **một** điểm sáng tròn, đuôi mảnh, không bóng đổ, treo cách mặt đất ~3 mm; mép khăn có nếp cuộn dệt dày, sọc viền, núm xù terry |
| 25 | `hand()` — bàn tay người | mannequin gỗ | khớp cầu nổi, cẳng tay bị cắt phẳng, một màu be, không móng tay | cẳng tay là khối thon dần (không cắt phẳng, không khớp cầu), nắp đốt ngón dẹt, nếp lòng bàn tay, **5 móng tay** (nhạt, đầu trắng), da nhiều tông (đầu ngón đỏ, kẽ ngón tối, lòng bàn tay hồng), hai nếp cổ tay |

## Ghi chú cho người đọc bản chấm

Một số vật trong bảng trên **không thể gọi đúng khi đứng một mình** (một giọt nước rơi, một bàn tay, một mặt nước cận): người xem không có bối cảnh để đoán. Nhiệm vụ của vòng này là làm cho **hình dáng của chúng đủ đặc trưng** để cái tên gần đúng nhất cũng là cái tên đúng, chứ không phải để làm chúng thành một vật khác.

## Ảnh kiểm

Vòng 5 chạy lại `propcheck.mjs` (26 vật × 3 góc) — ảnh lưu ở `review/props/`.
