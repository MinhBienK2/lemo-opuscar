# LOOK — Tại sao ngủ 30 phút lại tệ hơn không ngủ?

Mỗi vòng: dựng khung hình bằng **đúng mã vẽ của phim** (`node core/render/still.mjs`), xem lại
contact sheet, ghi lại cái mình thấy và cái mình đã sửa trong mã.

## Vòng 1

**Khung hình:** `stills/t_*.jpg` — 29 khung, mỗi 8 giây, từ `t_2` (văn phòng) đến `t_218`
(thẻ tiêu đề cuối phim), dựng bằng `core/render/still.mjs` rồi ghép bằng `core/render/sheet.py`.

**Thấy:**

1. **Cái đồng hồ hẹn giờ không đọc được.** Khung cận điện thoại vẽ chữ `30:00` trong trên
   điện thoại và một chữ `30 phút` to ngang dưới, ngay trên dải phụ đề (y ≈ 924 > 880). Hai chữ
   cũng chỉ đứng được 1,36 s — ngắn hơn thời gian đọc (cần 1,83 s). Người xem không kịp đọc
   con số quyết định cả tập.
2. **Cuối cảnh phòng thí nghiệm là một căn phòng trống.** Câu "đèn bật, và họ phải làm bài ngay
   lập tức" chạy trên khung phòng thí nghiệm không có ai: không có người nằm, không có đèn.
   Cảnh đang kể một việc mà hình không có.
3. **Cảnh bàn đo mở ra bằng một mặt bàn trống.** Ba tờ phiếu tự đánh giá chỉ xuất hiện ở từ
   "Trong thí nghiệm ca đêm đó", nên hai giây đầu cảnh chỉ có một màn hình đen.
4. **Cả tập là một màu.** Tám cảnh liên tiếp đều là nền xanh xám gần đen: đoạn dài nhất giữ
   nguyên một diện mạo hình 141 s. Không có chỗ nào của phim trông khác chỗ nào.
5. **Con dấu đỏ vẽ bằng `fillText` thẳng** — cổng đọc chữ không thấy dòng chữ đó, nên coi như
   không có chữ.

**Sửa:**

1. Điện thoại không còn viết chữ: màn hình đếm ngược bằng **đồng hồ số bảy đoạn** vẽ tay
   (`sevenSeg` trong `src/film.js`), chữ `30 phút` to bị gỡ khỏi khung cận; con số được nói
   bằng **nhãn của board** (`30 phút`, `number`, có đường chỉ vào điện thoại) đặt ở nhịp chuông
   reo — khung đó dài 2,9 s nên nhãn đọc kịp.
2. Thêm một khung riêng cho cuối cảnh phòng thí nghiệm: `phongthi_lab_test` — người tham gia
   nằm trên giường đo, đèn nghiệm bật (lớp sáng trắng phủ khung), vạch điện cực trên đầu.
3. Ba tờ phiếu nằm sẵn trên bàn ngay khi cảnh mở (`tudanhgia_b01` → `forms3: 1`); tờ phiếu úp
   xuống vẫn là nhịp riêng (`self1@ngủ`), nên vẫn thấy cảnh bàn đầy rồi mới thấy nó bị úp.
4. **Tái phân bảng màu theo cảnh**, để mỗi nơi chốn có một diện mạo riêng: văn phòng nắng
   chiều (tường nâu ấm `#7A5A3E`, cửa sổ hổ phách `#D8A94E`, sofa xanh mòng `#2E5A5A`); nhà Kẻ
   (tường xanh mòng `#3E6B5A`, kệ sách nhiều màu); phòng thí nghiệm (tường xanh lạnh `#4A6B8A`);
   bảng ghim (tờ giấy kem trên nền nâu `#241E16`); buồng đo (xanh đen `#0A1420` + vùng tím);
   bàn đo (tường xám lạnh `#8C93A8`); quán cà phê (tường nâu `#8A5A2E`, nắng `#E8B44A`); hồ sơ
   (sepia `#7A3A2A`); bàn tối (xám tím `#3A3A4A`). Sau đổi: **12 diện mạo hình, 1,03 mỗi 20 s**.
5. Con dấu đỏ vẽ bằng `text()` của rig → cổng đọc chữ thấy được và đo được thời gian đọc.

## Vòng 2

**Khung hình:** `stills/t_*.jpg` — 27 khung mới (`t_3` → `t_228`) sau khi áp các sửa đổi vòng 1,
cùng cách dựng và ghép sheet.

**Thấy:**

1. Chín nơi chốn giờ đã tách bạch, nhưng hai chữ trên hình vẫn **không đủ lâu**: tiêu đề
   `TỈNH DẬY KHI NGỦ SÂU` chỉ đứng 2,56 s (cần 3,10 s) vì khung chấm điểm bị cắt sớm, và con
   dấu `KHÔNG AI BIẾT` chỉ đứng 1,76 s (cần 2,23 s) vì cảnh hồ sơ kết thúc ngay sau nó.
2. Sáu tiếng động rơi vào lúc **hình không đổi**: tiếng chuông đồng hồ dừng (đồng hồ đã dừng
   từ trước), tiếng đường cong chạm đáy (đường cong đã hiện từ nhịp trước), tiếng gõ khoảng
   trống, tiếng nhóm chấm thứ hai, tiếng lật phiếu (cảnh mở đã có sẵn ba phiếu) và tiếng trượt
   phiếu. Tiếng mà không có gì động dưới là tiếng rác.
3. Board còn **đẻ nhãn trùng với chữ phim đã vẽ**: `14,7 phút` trong khi khung đã in `14,7`,
   `30 phút` dưới ba cột trong khi khung đã in, `Trạm Nghĩ Nhiều` trong khi thẻ tiêu đề đã có.

**Sửa:**

1. Khung vùng ngủ nông của buồng đo mở muộn hơn (`mech4@lớn`) để tiêu đề đứng đủ 3,6 s; con
   dấu đỏ ở hồ sơ rơi xuống ngay khi khung hồ sơ mở (`cost3@Và`) nên chữ đứng 2,4 s.
2. Sáu tiếng động được dời sang nhịp có hình thật sự thay đổi: tiếng kim đồng hồ chạy rơi vào
   lúc kim **đang chạy**; tiếng đường cong chạm đáy rơi vào lúc đường cong **hiện ra**; tiếng
   nhóm chấm thứ hai rơi vào lúc khung hình **chuyển** sang vùng ngủ nông; tiếng lật giấy rơi
   vào lúc tờ phiếu **úp xuống**; tiếng gõ khoảng trống bị gỡ hẳn. Sau đổi: **85 % tiếng rơi
   đúng lúc có gì động**.
3. Board chỉ giữ lại những nhãn mà phim **không** tự vẽ: tên vật (`sổ tay`, `tách cà phê`,
   `phiếu thí nghiệm`, `phiếu tự đánh giá`, `bảng điểm`), thẻ khái niệm
   (`sleep inertia`, `giấc ngủ sâu`, `cảm giác tỉnh`, `đoạn tệ nhất`) và những con số mà khung
   không in (`3 nhóm`, `10 phút`, `20 phút`, `30 phút`, `6 giờ`, `2 đêm`,
   `4,3 lần/s`). Khung hình tự in phần còn lại — `14,7`, `0,8`,
   `8 trên 10 người`, `10 phút · 20 phút · 30 phút` dưới ba cột, `không phải chuẩn`,
   `KHÔNG AI BIẾT`, `TRẠM NGHĨ NHIỀU` — nên không ai phải đọc hai lần.

## Vòng 3

**Khung hình:** `stills/t_*.jpg` — dựng lại sau khi kênh đổi quy tắc (một người dẫn duy nhất, một giọng
kể; Rối bị bỏ khỏi kênh) và sau khi dựng lại phim, cùng cách dựng và ghép sheet.

**Thấy:**

1. **Hai giọng kể làm phim khó nghe.** Bốn câu "cách hiểu phổ biến" (`roi1`–`roi4`) vốn để dành cho
   Rối, một nhân vật tím bay vào khung; kênh mới bỏ hẳn Rối và yêu cầu **một giọng kể cho cả
   phim**. Với nhân vật thứ hai biến mất, bốn câu đó phải do chính Kẻ Nghĩ Nhiều nói — và hình
   thì phải tự đứng được: một cột cao vẽ tay bên phải tờ giấy là **cái cột của cách hiểu ấy**,
   không phải ai vẽ nó ra.
2. **Cảnh mở cảnh phòng thí nghiệm trống trơn** ở phần cuối: câu "đèn bật, và họ phải làm bài
   ngay lập tức" chạy trên khung không có người nằm.
3. **Năm giây màn đen ở cuối phim.** Thẻ tiêu đề được vẽ *trước* lớp tối nên bị nuốt mất, rồi
   khung hình tắt hẳn — người xem nhìn 5 s màn đen.
4. **Hình đứng yên quá lâu.** Đo histogram màu của từng giây: phim có 21 đoạn hình nhưng chỉ 11
   "diện mạo" — tức là cả tập đọng lại trong mười mấy sắc độ. Những đoạn dài nhất (phòng thí
   nghiệm, buồng đo, bàn hồ sơ, bàn đêm) đều rơi về cùng một sắc tối xanh-đen.

**Sửa:**

1. **Một người dẫn, một giọng.** Bốn câu `roi1`–`roi4` giữ nguyên lời nhưng được kể bởi Kẻ:
   ở `nha_ke` anh tự nói "hai mươi phút là chuẩn" ngay cạnh câu hỏi của mình rồi tự gạch chân
   dòng đó; ở `banhanh` **cột cao màu tím bên phải tờ giấy** là hình của cách hiểu ấy (người dẫn
   tự vẽ, không có ai vẽ hộ); ở `quantcafe` và `chiphi` cách hiểu được nói khi nhân viên quán
   và người lưu trữ đang làm việc trong khung. Một cú `react` (cận mặt Kẻ) ở `nha_ke` đánh dấu
   lúc anh tự bác lời mình. Không còn nhân vật thứ hai, không còn giọng thứ hai.
2. Thêm khung `phongthi_lab_test`: người tham gia nằm trên giường đo, đèn nghiệm bật (lớp sáng
   trắng phủ khung), vạch điện cực trên đầu — câu "làm bài ngay lập tức" có người để xem.
3. Đuôi phim: thẻ tiêu đề vẽ **sau** lớp tối (nó là hình cuối cùng người xem thấy), lớp tối
   chỉ xuống còn 0,22 → 0,42 (không tắt hẳn thành màn đen), và đuôi phim rút từ 5 s xuống 3 s.
4. **Tách mười một diện mạo thành mười hai**: khung cận tờ phiếu thí nghiệm được đẩy thành
   cận thật (tờ giấy chiếm gần hết khung, chữ to lên), các khung cận của bảng ghim được zoom vào
   tờ giấy thật, và vùng giấc ngủ sâu trong buồng đo được tô đậm lên (tím `#8B5CF6` đậm hơn —
   màu của chủ đề theo luật của kênh). Kết quả: **12 diện mạo hình, 1,04 mỗi 20 s**.
