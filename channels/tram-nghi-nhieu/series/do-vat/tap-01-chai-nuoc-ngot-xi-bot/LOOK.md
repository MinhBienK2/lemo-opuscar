# LOOK — Quá trình hoàn thiện hình ảnh (Look Development)

Tập: `series/do-vat/tap-01-chai-nuoc-ngot-xi-bot` — "Vì sao mở chai nước ngọt lại xì bọt?"
Chuẩn tham chiếu: `channels/tram-nghi-nhieu/STYLE.md` và `channels/tram-nghi-nhieu/demo/stills/cutaway_*.jpg`.

## Vòng 1

- Stills: `t = 4s` (lập cảnh), `t = 23s` (mở nắp & xì khí), `t = 43s` (trào bọt).
- Thấy:
  1. Ở khung `t = 43s`, bọt trào bị cháy sáng (blown out / over-bloom) do bọt chọn màu trắng thuần `#f8feff` phản xạ đèn điểm quá mạnh vượt ngưỡng HDR 1.0, làm mất hết chi tiết khối của từng hạt bọt và xoá nhoà thân chai. Chiều cao bọt (height = 1.45) quá cao phủ kín cả chai.
  2. Ở khung `t = 23s`, bàn tay đồ chơi đưa vào ngang từ mép trái nằm đè lên miệng chai, làm che khuất nắp chai và che vệt xì khí `sparks`.
  3. Camera ở cảnh mở nắp quá cận (extreme close-up), mất đi bối cảnh bàn (ly đá, sách, đồ khui) vi phạm nguyên tắc giữ vật thể trong bối cảnh có sàn và đèn xung quanh.
- Sửa:
  1. Đổi màu bọt sang tông kem tự nhiên `#eadccc` (theo đúng chuẩn `cutaway.js`), hạ đỉnh dâng bọt xuống 1.15 để tạo vòm bọt đẹp như `demo/stills/cutaway_7.jpg`, ngắt đèn tiêu điểm `warm` sau khi mở nắp 1.5s để tránh cháy sáng.
  2. Bỏ bàn tay chắn ngang để nắp chai xoay và bay tự do lên góc trên bên phải như `demo/stills/cutaway_3.jpg`, khoe trọn vệt khí `sparks` xì phụt từ miệng chai.
  3. Lùi camera về khoảng cách trung cảnh (z ≈ 4.8–5.2) để giữ trọn vẹn 3 lớp sâu: tiền cảnh đồ khui, trung cảnh chai nước cắt lát trên đế lót và ly đá, hậu cảnh cửa sổ in bóng trăng.

## Vòng 2

- Stills: `t = 4s`, `t = 23s`, `t = 43s`.
- Thấy:
  1. Khung `t = 43s` đã khắc phục hoàn toàn hiện tượng cháy sáng: từng quả bọt kem `#eadccc` nổi rõ viền mực vẽ tay, cột bọt sủi tăm cuồn cuộn ở giữa đọc rất sinh động và đúng chuẩn diorama.
  2. Khung `t = 23s` nắp chai xoay bay lên góc trên bên phải thanh thoát, luồng khí trắng xanh `sparks` phụt lên rõ ràng, thẻ nhãn `1 atm` nằm ở vị trí thông thoáng.
  3. Khung `t = 4s` ánh trăng qua khung cửa sổ in bóng nan cửa và bóng lá lay lên mặt bàn gỗ rất thơ và tĩnh lặng.
  4. Thẻ nhãn `TÂM TẠO MẦM` ở một vài khung bị trôi sang mép phải vượt màn hình.
- Sửa:
  1. Chuyển điểm neo của thẻ `TÂM TẠO MẦM` sang tọa độ chất lỏng `P_LIQ` và điều chỉnh offset `dx: 180, dy: -40` để thẻ nằm chắc chắn ở vùng an toàn của màn hình.
  2. Khóa dải hiển thị của tất cả các thẻ nhãn trên trục Y luôn nằm trong khoảng 120–750 px để không bao giờ vi phạm dải phụ đề dưới (y ≥ 880).

## Vòng 3

- Stills: `t = 4s`, `t = 23s`, `t = 43s`.
- Thấy:
  1. Giám khảo độc lập phát hiện ở Khung 1 (`t = 4s`), phụ đề bị nhảy sang phông Serif mặc định do canvas nạp chữ trước khi `document.fonts.ready`.
  2. Ở Khung 2 (`t = 23s`), hiệu ứng `flash` toàn màn hình kéo dài 0.2s làm bức ảnh bị màng sương mờ đục (wash-out), giảm tương phản bóng đổ trên bàn.
  3. Thẻ nhãn `1 atm` bị trễ 0.4s so với cú bật nắp tại 22.8s.
- Sửa:
  1. Nạp tường minh `800 46px "Be Vietnam Pro"` và đợi `await document.fonts.ready;` trước khi dựng khung đầu tiên. Phụ đề ở Khung 1 lập tức hiển thị chuẩn Be Vietnam Pro sắc nét.
  2. Rút ngắn thời gian `flash` xuống đúng 0.1s tập trung quanh `T_OPEN = 22.8s` để giải phóng tương phản diorama ngay tức thì tại `t = 23.0s`.
  3. Đẩy mốc `t0` của thẻ `1 atm` về đúng thời điểm mở nắp `t0: 22.8s`.

## Thẩm định độc lập

Giám khảo nghệ thuật độc lập (subagent `research`) đã đối chiếu 3 khung hero với `STYLE.md` và `demo/stills/cutaway_*.jpg`.

Bảng điểm chi tiết:
- Khung 1 (Lập cảnh bàn đêm, t=4s): **4.55 / 5.0** (Điểm nhìn: 4.5, Sáng tối: 4.8, Chiều sâu: 4.8, Chất liệu: 4.7, Chuyển động: 4.2, Cơ chế: 4.3)
- Khung 2 (Mở nắp & xì khí, t=23s): **4.32 / 5.0** (Điểm nhìn: 4.6, Sáng tối: 4.0, Chiều sâu: 4.2, Chất liệu: 4.3, Chuyển động: 4.8, Cơ chế: 4.0)
- Khung 3 (Trào bọt & cơ chế, t=43s): **4.93 / 5.0** (Điểm nhìn: 5.0, Sáng tối: 4.9, Chiều sâu: 4.9, Chất liệu: 4.9, Chuyển động: 4.9, Cơ chế: 5.0)

**Điểm trung bình toàn tập:** **4.60 / 5.0** (Tất cả tiêu chí đều ≥ 4.0, không có tiêu chí nào dưới ngưỡng yêu cầu).
