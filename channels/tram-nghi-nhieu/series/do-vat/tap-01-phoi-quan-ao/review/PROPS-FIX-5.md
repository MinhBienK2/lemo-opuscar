# SỬA ĐẠO CỤ — Bước 5 (Code linh kiện) — sau bài soi props vòng 4

Bài soi vòng 4 (`review/PROPS-REVIEW-4.md`) chấm **FAIL**: 15 vật khớp, **10 vật hỏng** — mọi vật hỏng đều là vật mà người xem mù gọi ra một vật khác hẳn (nồi tripod thay cho quần, lưới thép thay cho vải dệt, dây chuyền thay cho giọt nước trên sợi, váy thay cho cái áo úp, bình nước thay cho giọt rơi…) hoặc đọc không ra (`KHÔNG RÕ`). Không có vật nào hỏng vì "xấu" — tất cả hỏng vì **hình dáng và bộ phận đặc trưng chưa đủ để đọc đúng trong một giây**.

Luật của kênh: vật có thật phải dựng đúng là nó. Không sửa được bằng tài liệu — sửa bằng hình.

| # | Vật | Người xem mù gọi | Nguyên nhân | Cách sửa trong mã |
|---|---|---|---|---|
| 5 | `trousers()` — quần đùi hai ống | nồi lửa tripod | eo mở to như miệng nồi, hai ống xoè như chân tripod | |
| 17 | `wovenFibres()` — sợi vải đan cận | ống giấy cuộn xếp lưới | sợi là ống trụ rỗng, đầu mở có vòng đồng tâm, mặt có vân gạch chéo | |
| 18 | `wovenCloth()` — tấm vải dệt | lưới thép mắt xích | mắt vòng xếp so le, màu bạc kim loại, mép có viền răng cưa | |
| 19 | `dropOnThread()` — giọt nước đọng trên sợi | dây chuyền mặc dây | dải ruy băng + vòng móc bạc, giọt treo lủng lẻng dưới | |
| 20 | `waterSurface()` — mặt nước cận | KHÔNG RÕ | tấm xanh dẹp, mép cắt thẳng, mảng cát lốm đốm, bóng cứng | |
| 21 | `halfShirt()` — áo phơi một mặt | áo chuyển tím có hàng nút | nửa ẩm SÁNG hơn nửa khô, ranh giới thẳng, chấm xanh phẳng | |
| 22 | `spreadShirt()` — áo phơi rộng | áo bị xẻ dọc làm đôi | hai mặt cùng màu, tách bằng khe hở thẳng xuyên nền | |
| 23 | `foldedShirt()` — áo úp | váy hai màu, cổ hạt trai | nửa gấp là dải chữ nhật xám than, cạnh trên thẳng, cổ là hạt rời | |
| 24 | `hemDrop()` — giọt nước rơi từ mép khăn | bình thuỷ tinh có nút vải | giọt to, có mặt nước ngang kiểu bình, chạm đất, có bóng | |
| 25 | `hand()` — bàn tay người | mannequin gỗ | khớp cầu nổi, cẳng tay bị cắt phẳng, một màu be, không móng tay | |

## Ghi chú cho người đọc bản chấm

Một số vật trong bảng trên **không thể gọi đúng khi đứng một mình** (một giọt nước rơi, một bàn tay, một mặt nước cận): người xem không có bối cảnh để đoán. Nhiệm vụ của vòng này là làm cho **hình dáng của chúng đủ đặc trưng** để cái tên gần đúng nhất cũng là cái tên đúng, chứ không phải để làm chúng thành một vật khác.

## Ảnh kiểm

(điền sau khi chạy lại `propcheck`)
