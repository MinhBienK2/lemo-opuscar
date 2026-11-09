# look — vòng 1

Người chấm: claude -p · 2026-11-09 23:11 · 5 mục được chấm

## hero-c1 — FAIL
- chu-the [CHẶN] ĐẠT: Vòng dây hồng quanh miệng nắp chiếm giữa khung (x≈560–1520, y≈150–560), nằm trong vùng sáng của quầy, tách rõ với nắp kem bên trong và với mặt gỗ bao quanh.
- dung-phong-cach [CHẶN] LỖI: Vòng dây – vật nhấn duy nhất của khung – ra màu hồng nhạt, đo được (240,149,148), lệch hẳn khỏi đỏ #f04462 (240,68,98) của STYLE.md và còn nhạt hơn cả mặt bàn gỗ (181,98,64); khung cũng không có neo navy/tím nào, toàn kem–nâu ấm. → SỬA: cho vòng dây đỏ bão hoà của bảng màu (đậm hơn để tách nắp kem), và để một mảng navy/tím trong nền để vật nhấn là chỗ bão hoà nhất khung.
- vat-that [CHẶN] LỖI: Mặt nắp là một đĩa kem trơn hoàn toàn (x≈700–1400, y≈180–420) không ren xoắn, không vân, không cạnh – đúng “tấm phẳng” thay cho một cái nắp thật – và nó là vùng sáng nhất khung; hai đầu của vòng dây (x≈660 và x≈1440) cắt thành răng cưa, có sợi kem của nắp ló ra xuyên qua dải hồng. → SỬA: dựng nắp có ren xoắn ốc/vân nông sát mép; làm khớp hai đầu dây thành mối chồng khép kín, không rách, không ló sợi kem.

## hero-c18 — FAIL
- chu-the [CHẶN] ĐẠT: Bàn tay (da 226,154,114) chiếm giữa-phải khung và là vùng sáng nhất; mạng chuỗi vàng/cam lùi về bên trái, tách rõ trên nền tím.
- dung-phong-cach [CHẶN] LỖI: Cổ tay áo ở mép phải là trắng cháy thuần (253,253,253), sáng hơn cả da tay và có quầng bloom ở mép trên – vùng sáng nhất khung không phải điểm nhìn; và cánh tay áo là một mảng xanh phẳng lớn (95,101,133 → 84,64,99) không texture, không nếp, đúng kiểu “khối trơn một màu ở tiền cảnh”. → SỬA: hạ cổ tay áo xuống kem/xám nhạt thấp hơn độ sáng của da, thêm texture canvas và vài nếp gấp cho cánh tay áo, giữ da là vùng sáng nhất khung.
- vat-that [CHẶN] LỖI: Tay không nắm được sợi nào: sợi trên cùng kết thúc bằng một hạt ở x≈830,y≈345 và cắm thẳng vào mặt sau bàn tay – chỗ không có ngón tay; sợi dưới kết thúc bằng hạt ở x≈770,y≈480 chỉ áp vào mặt ngoài của ngón cái; trong kẽ ngón tay có một hạt cam lẻ không nối với sợi nào. → SỬA: cho một sợi chạy thật vào kẽ ngón tay và kết thúc bằng hạt nằm trong lòng bàn tay; đưa đầu sợi kia ra khỏi mặt sau bàn tay.

## hero-c23 — FAIL
- chu-the [CHẶN] LỖI: Khung không có vật chính đọc được: bên trái là một hình chữ nhật cam phẳng có cạnh phải thẳng đứng tại x=960 và cạnh dưới thẳng ngang, bên phải là một tấm đỏ phẳng cong nhẹ; không dây, không ghim, không có gì treo – người xem không đoán ra đây là dây chun. → SỬA: lùi máy và hạ xuống ngang tầm dải để trọn dải và cả hai ghim vào khung.
- dung-phong-cach [CHẶN] LỖI: Hai mảng lớn cam và đỏ là khối trơn một màu không texture, chiếm hơn 1/3 khung; không có bóng đổ và không có hướng sáng nào trên dải; nền tím là gradient trơn có hai mảng đa giác mờ ở góc trên-phải và giữa-phải trông như lỗi hình học; cả khung chỉ có một lớp, không có lớp che lấp nào. → SỬA: cho dải có mặt cắt bo tròn, texture và một nguồn sáng có hướng; đặt dải qua một mặt nào đó để nhận bóng đổ; thay các mảng đa giác bằng khí quyển mềm.
- vat-that [CHẶN] LỖI: “Dải dây” không phải dây: nửa nóng là một mặt phẳng đứng có cạnh cắt thẳng, nửa lạnh là một tấm phẳng khác; hai nửa không nối liền nhau – cạnh thẳng của nửa cam cắt ngang đường cong của nửa đỏ tại x=960 – và không có ghim nào giữ dải. → SỬA: dựng một dải liên tục (cùng hình học, mặt cắt bo tròn, không khe ở chỗ tiếp giáp), cộng hai ghim có đầu đĩa.

## hero-c28 — FAIL
- chu-the [CHẶN] ĐẠT: Cả bộ đo đọc được trong một khung: hai đồng hồ đo lực tròn có kim và huy hiệu N đứng hai bên, thước gỗ có số 40→5 bên trái, nhiệt kế ở giữa, trên mặt bàn gỗ sáng ấm, tường navy sau lưng.
- dung-phong-cach [CHẶN] ĐẠT: Đúng chất kênh: toon gradient + viền mực đen, đèn bàn ấm hắt bóng chân đế xuống mặt bàn, tường navy (41,50,105), gỗ ấm (216,121,77), dây đỏ (109,34,65), quả cân vàng và bạc.
- vat-that [CHẶN] LỖI: Ở cả hai chân đế, sợi treo quả cân là một mảng phẳng cắt thẳng rồi bỏ lơ lửng: cột trái là hình chữ nhật đỏ (x≈460–510) đáy cắt ngang, dừng cách móc tròn trên quả cân vàng khoảng 50 px, không chạm; cột phải là sợi trắng dẹt (x≈1340) cũng cắt ngang và dừng trên không; cả hai móc chữ J màu ô liu đều mắc trống, không móc gì vào. Thêm nữa, đầu ống máy sấy tóc lọt vào góc trên-trái (x=0–210, y=85–165) là một viên nang xám trơn không lưới, không tay cầm. → SỬA: làm dây treo thật – đi qua móc chữ J của đồng hồ rồi buộc vào móc tròn của quả cân; đưa máy sấy tóc ra khỏi khung hoặc dựng lưới miệng + tay cầm.

## hero-c9 — PASS
- chu-the [CHẶN] ĐẠT: Mạng chuỗi chiếm gần hết khung: các sợi hạt vàng/cam lấp từ mép trái sang mép phải, tương phản mạnh với nền tím trung tối (69,49,84), nằm ở vùng sáng của khung.
- dung-phong-cach [CHẶN] ĐẠT: Đúng diorama toon của kênh: hạt có gradient nhiều bậc, viền mực đen vẽ tay quanh từng hạt, bảng màu đúng (vàng #f7bd27, cam #ff8a3d, tím trung tối), nền tím có vệt sáng mờ chứ không phải tường trơn.
- vat-that [CHẶN] ĐẠT: Sợi xích được dựng thật: hạt to xen hạt nhỏ làm mắt nối, có móc nối dạng vòng hở; không có hộp, tấm phẳng hay chữ đứng thay cho vật thật.
