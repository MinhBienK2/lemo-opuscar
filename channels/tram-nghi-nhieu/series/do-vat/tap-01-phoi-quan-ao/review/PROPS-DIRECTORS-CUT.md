# Đạo diễn cắt — Bước 5 (vật dựng), bản cắt lần 4

Vòng chấm vật dựng đã dùng hết 5 vòng (`PROPS-REVIEW-1…5.md`), nên phần sửa cuối cùng là việc của Đạo diễn. Bản cắt này ghi lại **đúng những gì đã sửa trong mã cho đến lúc viết**, và những gì được giữ.

Trang này không thay bản chấm: nó đi kèm nó. Mọi ảnh `review/props/p_NN.jpg` được viện dẫn ở đây **dựng lại từ `src/props.js` sau các sửa này**, không phải ảnh cũ của vòng 5.

## Sửa đợt này — bắt buộc bởi hình thật trong phim (vòng 11)

Khi dựng hình thật, bốn đạo cụ hiện ra sai so với lời kể. Cả bốn đều sửa tại gốc trong `src/props.js`:

| Vật | Lỗi thấy được trong hình thật | Sửa trong mã |
|---|---|---|
| **Cân bếp (#12)** — mặt đồng hồ | Mặt cân in số **0–400 g** và chữ `g`, `MAX 400`. Nhưng phim **không nói con số gam nào** (`research/FACTS.md`), nên mỗi con số trên mặt cân là một số không có lời kể: người xem đọc "288" và tưởng đó là kết quả đo, trong khi câu 34 chỉ nói "hai cái kim lệch nhau" | Mặt cân **không in số** nữa: chỉ còn vạch, kim đỏ, vạch đỏ ở mức tối đa, và chữ `CÂN` nhỏ ở khoảng trống dưới. Cân đo bằng vạch và kim — thấy **hai kim lệch nhau** là đủ để kể câu 34. Ảnh: `p_12.jpg` |
| **Ẩm kế treo tường (#14)** — nhãn đơn vị | Chữ `g/kg` nằm ở vị trí cũ ngay trên **số 10 của vòng trong**, đè lên con số | Nhãn `g/kg` **chuyển xuống khoảng trống dưới mặt đồng hồ**; vòng trong (0–20 g/kg) và vòng ngoài (0–100 %) đọc được trọn vẹn, không số nào bị che. Ảnh: `p_14.jpg` |
| **Nhiệt kế treo tường (#13)** — mức 30 °C | Câu 45 nói "ba mươi độ", nhưng nhiệt kế **đang treo trong phòng** không thể đổi số giữa chừng (đổi là nói dối đồ đo); còn sửa thang đo thì phá vỡ việc đo nhiệt độ phòng ở c39 | Thêm một **cột đỏ mờ ("cột ma")** đứng cạnh nhiệt kế, `setGhost(k)` đặt đỉnh cột theo mức cần so sánh. Nhiệt kế trong cảnh **luôn đọc hai mươi lăm độ**; ba mươi độ ở c44–c45 do cột ma trình bày, và thẻ `30 °C` bám vào đỉnh cột. Ảnh: `p_13.jpg` |
| **Bàn thí nghiệm (#16)** — nhãn đứng "CÓ GIÓ" / "KHÔNG CÓ GIÓ" | Ở c37 máy nhìn thật sát vào giọt nước sau vách; nhãn đứng trên mặt bàn nằm ngay trước giọt và **che mất giọt** — mất đúng thứ câu đó cần đọc | `labTable()` trả thêm `tags`; khung hình **tắt riêng nhãn ở c37** (`labTags`), các câu khác giữ nguyên nhãn. Ảnh: `p_16.jpg` |

## Những gì được giữ, và vì sao

1. **Tám vật HỎNG của vòng 5** (#2 kẹp quần áo, #9 bồn chậu, #17 sợi vải đan, #18 tấm vải dệt, #19 giọt trên sợi, #20 mặt nước cận, #24 giọt ở mép khăn, #25 bàn tay) — đã sửa trong các bản cắt trước, giữ nguyên. Không vật nào đứng thay cho một vật thật khác.
2. **Hai sửa của bản cắt lần 2** (tay áo vải cuộn trên cẳng tay; vệt nước trong xơ ở rìa sợi) và **bốn sửa của bản cắt lần 3** (mặt ẩm kế hai vòng; bàn phơi gỗ có nan; giọt trên sợi xanh đậm hơn; khăn/đàn áo phân biệt màu ướt–khô) — giữ nguyên.
3. **#5 quần đùi hai ống** — giữ nguyên hình: người xem gọi đúng là **quần** (nhóm A, đúng loại vật), còn đổi ống quần sẽ phá cặp đối chiếu ướt–khô mà phim dùng ở c22/c49.
4. **Các vật KHỚP còn nét thô** — giữ, vì nét thô ở cự ly xa, trong chuyển động, không đọc được; sửa lúc này không có vòng chấm nào kịp soi.

## VERDICT: PASS

SCOPE (lần 4): bản cắt này đóng **Bước 5 (vật dựng)** cho tập `tap-01-phoi-quan-ao` và nay bao gồm bốn sửa bắt buộc bởi hình thật trong phim: **mặt cân không in số** (chỉ vạch và kim — vì phim không nói con số gam nào), **nhãn `g/kg` của ẩm kế chuyển khỏi số 10** (vòng trong và vòng ngoài đọc được trọn), **cột ma đỏ mờ cạnh nhiệt kế** để ba mươi độ có phương tiện so sánh mà nhiệt kế trong phòng không phải đổi số, và **nhãn đứng trên bàn thí nghiệm tắt riêng ở c37** để không che giọt nước. Các sửa của ba bản cắt trước vẫn giữ nguyên. Vật dựng và phim dùng vật đó là cùng một mã nguồn: `src/props.js`.
