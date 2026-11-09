VERDICT: REJECT
ROUND: 1/5
SCORES: BỐ_CỤC=3 ÁNH_SÁNG=3 GÓC_MÁY=4

## NHẬN XÉT CHI TIẾT THEO CẢNH

- **Hero 1 (c1 — bếp, nắp hũ có dây chun quấn, máy sấy tóc bên trái)**:
  - Bố cục: **Đạt**
  - Điểm yếu: Vòng dây đỏ là vật sáng nhất, nằm gần tâm khung, tách nền tốt — đúng tiêu điểm. Nhưng **miệng máy sấy tóc hướng thẳng vào ống kính** (ba vòng đồng tâm đối diện người xem) nên người xem tắt tiếng đọc là "một cái máy đang nhìn mình", không phải "một cái máy sẽ thổi vào dây"; tay cầm màu navy ở góc trái không có bàn tay nào (c1 không thổi) nên trông như **một cụng lơ lửng**. Nửa phải khung (quầy gỗ + gạch) chìm xuống bóng, vệt nắng trên quầy là nguồn sáng duy nhất và nó **không dẫn mắt tới vật chính**.
  - Khuyến nghị quay: Giữ cận ngang fov 30 nhưng **xoay máy sang phải ~15–20°** và hạ `look.y` xuống ~0.16 để miệng máy chĩa về phía vòng dây, đồng thời dựng máy sấy tóc nằm nghiêng trên quầy (miệng chĩa chéo xuống nắp hũ) thay vì chĩa vào ống kính; nâng key 15 % và dồn vệt sáng về nắp hũ; chừa góc trên-phải làm khoảng trống cho thẻ.

- **Hero 2 (c9 — bên trong sợi dây, mạng chuỗi)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Đo pixel: **chỉ 4,4 % khung là vùng sáng** (hạt chuỗi), 95 % khung là một nền tím phẳng — mạng chuỗi đọc ra là **"mưa hạt rơi trên nền trống"**, không phải "một mạng chuỗi", đúng cái mà chính lý do chọn hero này cần chứng minh. Chuỗi vẽ bằng **hạt rời rạc không có đoạn nối**, nên không có đường nào đọc được là "một sợi". Móc liên kết chéo render ra **màu tím, rất nhỏ** (treatment định là *vàng nghệ*) nên không đọc được. Tiền cảnh là **một cột vàng bị cắt cụt ở đúng giữa đáy khung, có một vòng đen treo trên đầu**, bị phụ đề đè lên → là một vật lạ không ai giải thích được, chứ không phải "khối cao su cắt ở tiền cảng" như treatment viết. Treatment còn hứa *"một sợi chuỗi được kéo thẳng chạy ngang khung"* và *"một vệt sáng hẹp từ trên rọi vào mặt cắt"* — **cả hai đều không có trong khung**.
  - Khuyến nghị quay: Lùi gần hơn và dùng tiêu cự dài hơn để hạt to ra và liền mạch: **fov 26–28, pos [0, .02, 1.05], look [0, 0, −.25]**; dựng thêm **một sợi chuỗi kéo thẳng chạy ngang khung** làm đường dẫn mắt; đổi móc liên kết sang vàng và to gấp 2; đưa mặt cắt cao su vào góc dưới-trái, chừa phụ đề không đè lên; thêm một vệt sáng từ trên rọi xuống để có nguồn sáng dẫn dắt.

- **Hero 3 (c28 — bàn đo ban đêm)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu: **Trên 50 % chiều cao khung là tường navy trống**, máy ở trên cao nhìn xuống (`pos [.35,.60,2.20]`) nên đội dụng đo bị dồn xuống đáy. Bộ đo **vỡ thành ba cụm rời rạc**: chân đế đồng hồ + thước + dây + quả cân ở giữa-trái, nhiệt kế đứng lơ lửng ở giữa-phải (không dính vào vật gì), đồng hồ thứ hai ở mép phải **trống không, không treo gì**. Vật sáng nhất và đậm nhất khung lại là **cái máy sấy tóc hồng tím nằm bên trái** — thứ hoàn toàn không liên quan tới câu "Để kiểm chứng, mình làm phép đo"; nó cùng cây xanh và đèn bàn bị cắt đôi ở mép trên. Người xem tắt tiếng không đọc được "bộ đo" trong một khung như lý do chọn hero này đòi.
  - Khuyến nghị quay: Cận lại và hạ tầm: **fov 28–30, pos [0.0, .44, 1.50], look [−0.05, .22, .91]** để chân đế chính + thước + dây + quả cân chiếm 2/3 khung; đưa máy sấy tóc ra khỏi tiền cảnh (dời sang x ≈ −1.05 sát mép trái, hoặc bỏ hẳn khỏi khung này vì c31 mới đến lúc cần nó); **treo sợi thép lên đồng hồ thứ hai** để nó không trống; hạ đèn bàn xuống để có vệt sáng loe trên mặt bàn và bỏ 1/3 tường trống phía trên.

- **c18 (trong dây, bàn tay kéo mạng chuỗi ra)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Nhát này đứng hay nhờ một hành động, nhưng **bàn tay không nắm được gì**: ngón duỗi thẳng, lòng bàn tay trống, và **không có mắt xích nào chạm tới đầu ngón** — mạng chuỗi nằm tràn sang trái, cách xa vùng tay. Người xem tắt tiếng thấy "một bàn tay vươn vào đám hạt", **không thấy "kéo"**. Thêm nữa, **bóng đen của bàn tay ở góc dưới-phải là một mảng đen sắc nét trông như một vật thể thứ hai** (như một móng vuốt), gây rối mắc đúng chỗ cần đọc hành động.
  - Khuyến nghị quay: Sửa tư thế tay trước khi sửa máy — **nắm chặt (curl ≈ 1.0) quanh đầu mạng**, đặt tay đúng trên hạt cuối ở `x = .75·netScale`, và **nối một sợi mắt xích chạy từ hạt cuối về nắm tay** để có đường liên tục; hạ cường độ key phía sau tay để bóng đen không thành mảng đen; thu máy lại (**fov 34, pos [1.05, .20, .90]**) để bàn tay không nuốt 1/4 khung.

- **c23 (trong dây, dải treo: vùng nóng trái – vùng lạnh phải)**:
  - Bố cục: **Đạt (về ý) / Chưa đạt (về hình)**
  - Điểm yếu: ý bố cục đúng — trái thẳng/căng, phải thõng thành vòng treo, màu cam = nóng, đỏ = lạnh, người xem tắt tiếng đọc được "tỉ lệ". Nhưng **nửa nóng được dựng thành một thanh phẳng màu cam liền khối, không có vết đoạn** như nửa đỏ, nên trông như **một ván gỗ khác vật liệu** chứ không phải "cùng sợi dây, phần này nóng"; **mốc chuyển tiếp có một mảng bán trong suốt màu xám đè lên** (lỗi hình học, đọc như bản kính mờ); dải hạt rơi rác ở 1/3 dưới khung đọc như **rác nền** và phụ đề nằm ngay trên đó; 1/3 trên khung trống.
  - Khuyến nghị quay: **Dựng nửa nóng bằng đúng hình học của nửa lạnh** (giữ vết đoạn, chỉ đổi màu và thêm glow cam) để người xem thấy "cùng một sợi, vùng này nóng"; sửa lớp bán trong suốt ở mốc nối; hạ máy sát dải (**pos [0, .42, 1.00], fov 32**) để dải chiếm giữa khung; đẩy dải hạt ở 1/3 dưới lùi xa / làm mờ đi để thành nền, không thành rác.

## KHUYẾN NGHỊ ĐẠO DIỄN

- **Điều chỉnh cần thiết (theo thứ tự ưu tiên):**
  1. **C18 — sửa tư thế tay và nối mắt xích vào nắm tay.** Đây là lỗi nặng nhất: nhát mang câu "Bây giờ mình kéo dây ra" mà trong khung **không có sợi nào được nắm**. Không sửa được cái này thì câu 18 không có hình.
  2. **Hero 3 (c28) — dựng lại bố cục khung bàn đo.** Bỏ máy sấy tóc hồng ra khỏi tiền cảnh, hạ tầm máy xuống, thu vào chân đế chính, treo dây thép lên đồng hồ thứ hai. Hiện tại **không đọc được "bộ đo" trong một khung** như lý do chọn làm hero.
  3. **Hero 2 (c9) — làm cho mạng chuỗi thành mạng.** Hạt phải to và liền mạch (lùi gần, tiêu cự dài), thêm một sợi kéo thẳng chạy ngang khung, móc liên kết đổi sang vàng và to gấp 2, mặt cắt cao su đưa vào góc dưới-trái, và **thêm vệt sáng từ trên** đúng như treatment đã hứa.
  4. **C23 — dựng lại nửa nóng bằng cùng hình học với nửa lạnh** và dẹp lớp bán trong suốt ở mốc nối; đẩy dải hạt ở 1/3 dưới lùi xa.
  5. **Hero 1 (c1) — xoay miệng máy sấy tóc về phía dây** (không chĩa vào ống kính) và dựng máy nằm nghiêng trên quầy để không chiếm góc trái; dồn vệt nắng về nắp hũ.
- **Cảnh báo `DARK` — cả ba khung trong sợi dây (c9, c18, c23):** trung vị độ sáng chỉ ~54/255, 95 % pixel dưới 69, và **không có nguồn sáng nào trong hoặc quanh khung**; treatment đã hứa *"một vệt sáng hẹp từ trên rọi vào mặt cắt"* nhưng khung hiện tại không có vệt sáng nào. Chưa tới mức không đọc được, nhưng phải có nguồn sáng dẫn dắt trong không gian N2 trước khi đóng vòng.
- **Nguyên tắc chung:** ở cả ba hero, vật chính phải chiếm phần lớn khung và là vùng sáng mạnh nhất. Hiện tại Hero 3 để thắng vị trí sáng nhất cho một vật không liên quan (máy sấy tóc), Hero 2 để 95 % khung là nền trơn, và c18 để hành động chính nằm ngoài tầm tay. Sửa ba chỗ này là đủ để điểm trung bình vượt 4.0.

---
Người chấm: claude -p (model mặc định của claude) · review.sh --storyboard · 2026-11-09 18:08
