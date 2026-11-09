SCORES: A=5 B=4 C=4 D=4 E=5
VERDICT: PASS
ROUND: 4/4

## ĐỐI CHIẾU VỚI LẦN CHẤM TRƯỚC (ROUND 3)

Tôi đã xét lại từng lỗi của lần trước trên bản TREATMENT hiện tại:

- **[NẶNG] Dòng 19 gọi nhầm chai B / chai C so với shot 1:48–1:53 → ĐÃ SỬA, ĐÚNG HƯỚNG.**
  Bảng ý dòng 19 nay viết "chai A đã co và nhăn đứng cạnh **chai B còn thẳng**"; shot 1:48–1:53 viết "chai B còn thẳng (**chai B lúc đó chưa vặn nắp**)"; shot 2:47–3:01 gọi đúng "cận **chai B**"; dòng 25 và 26 cũng dùng đúng "chai A nhăn, chai B méo"; chai C chỉ xuất hiện ở dòng 29 / shot 3:28–3:41, khớp với dòng "Chai nhựa PET mới (chỉ dùng cho lời khuyên)". Không còn chỗ nào gọi sai đối tượng. Đã đóng.
- **[NHẸ] Hai con trỏ "c9" / "c29" trong bảng "Vật lên hình" → ĐÃ SỬA.** Nay ghi "dòng ý 5 (0:28–0:32)", "dòng ý 17 (1:37)" và "dòng ý 26 (3:01)", khớp đúng với bảng ý và shot list.
- **[NHẸ] Mục "Mở và kết" lệch với shot list → ĐÃ SỬA.** Nay ghi rõ "**Khung so sánh (3:01–3:08, dòng ý 26)**" và "**Khung lời khuyên (3:28–3:41, dòng ý 29)**", đúng với hai shot cuối.
- **[NHẸ] Dòng 29 thiếu mắt xích "nước đã nguội rót vào chai C" → ĐÃ SỬA.** Cả bảng ý dòng 29 và shot 3:28–3:41 đều có "tay rót nước đã nguội từ cốc sang chai C, đặt cốc xuống, rồi cầm nắp rời vặn lên miệng chai C", và mục "Mở và kết" nhắc lại yêu cầu này. Người xem không còn thấy "vặn nắp một cái chai rỗng".
- **[NHẸ] Dòng 13 lặp lại hơi nước của dòng 1 → ĐÃ SỬA ĐÚNG HƯỚNG, nhưng sót một vế.** Hình của dòng 13 nay là "hơi nước **thoát ra thành làn mỏng**" và shot 1:15–1:19 đã cập nhật theo ("thoát ra thành làn mỏng, quanh miệng là hào quang ấm"), đúng là dấu hiệu mà dòng 24 cần. **Nhưng cột Ý của dòng 13 vẫn giữ nguyên "Miệng chai thì hơi nước bốc lên thành cột"** — tức là trong cùng một dòng, lời và hình nói hai điều trái nhau. Đây là lỗi NẶNG duy nhất của vòng này, xem bên dưới.
- **[NHẸ] Dòng 24 đọc như ba tấm ảnh tĩnh → ĐÃ SỬA.** Cột hình nay ghi "**Một cú liên tục của máy** … **Không ba tấm ảnh đứng yên**", và shot 2:30–2:47 mô tả đúng chuyển động máy (cận miệng → lùi ra → ngang hai chai → nghiêng theo chai phồng rồi trượt sang chai co).
- **[NHẸ] "Vạch đỏ bảy mươi độ, hai con số in" mơ hồ → ĐÃ SỬA.** Bảng "Vật lên hình" nay ghi "**hai con số khắc ngay trên mặt đồng hồ: 100 và 70**", đúng FACTS §6.
- **[NHẸ] Shot list chạy tới 3:41 trong khi giọng ước tính 3:20 → ĐÃ GHI NHẬN, còn dư ~20 giây.** Cả mục "Độ dài" và header của shot list đều ghi "thời điểm sẽ chốt lại sau khi giọng đã thu đo được" — phần ghi nhận đã đúng, nhưng chênh lệch vẫn còn. Xem lỗi nhẹ ở dòng 29.

Không có lỗi CHẶN nào mới phát sinh. Quyết định chia chương của lần trước đã được ghi đúng vào mục **## Chương** (một chương duy nhất, `src/chapters.js`, `do-vat/tap-03`, kèm điều kiện chia sẵn thành hai chương "ký ức của vật liệu" / "khí bị giam" khi có thêm dòng ý).

## NHẬN XÉT CHI TIẾT

- Lỗi CHẶN (Bắt buộc sửa):
  - *(không có)*

- Lỗi NẶNG:
  - **[Dòng 13] Cột Ý và cột Hình của cùng một dòng nói hai điều khác nhau về cùng một vật.** Ý viết "Miệng chai thì hơi nước bốc lên thành cột", còn hình ghi "hơi nước ở đây **thoát ra thành làn mỏng** (**không phải cột đặc** như lúc vừa rót)". Khâu viết lời sau này sẽ phải chọn: nói "cột" thì hình sai, nói "làn mỏng" thì lời sai — và hình đó lại xuất hiện y hệt ở dòng 24, nên khung hình lặp trong lúc lời thì không. -> Gợi ý sửa: giữ nguyên hình và sửa cột Ý thành "Miệng chai thì hơi nước thoát ra thành làn mỏng — tức là khí thoát ra được" (thẳng, không cần chữ chú thích trên màn hình); hoặc giữ lời "thành cột" thì phải đổi hình thành "cột mỏng" và bỏ ngoặc "(không phải cột đặc…)", đồng thời đổi hình của dòng 24 cho khác. Không để hai cột của một dòng trái nhau.

- Lỗi NHẸ:
  - [Dòng 21–22] Cái chai sắp được vặn nắp chưa bao giờ được gọi tên, trong khi cảnh 2:03–2:10 bỏ đi vào bụng "một chai đang hở nắp" có mặt nước sôi và 2:10–2:23 quay ra thấy tay vặn nắp. Người xem có thể tưởng đó là chai A đã nhăn, và rồi bất ngờ khi dòng 24–26 nói "chai A nhăn, chai B méo". -> Gợi ý sửa: trong hình dòng 21 và 22, gọi tên nó là **chai B (cái chai còn thẳng)** để người xem biết ngay cái chai sắp vặn nắp không phải chai A; như vậy cũng khớp với "cái chai vừa phồng" ở dòng 25 (shot 2:47 đã gọi tên là chai B).
  - [Bảng "Vật lên hình"] Chưa có nhãn A / B / C cho ba cái chai, trong khi bảng ý và shot list đã dùng tên (chai A dòng 18/19/26/28, chai B dòng 19/25/26, chai C dòng 29). Người dựng phải tự suy ra. -> Gợi ý sửa: gắn nhãn vào ba dòng: "thí nghiệm 1 = **chai A** (hở nắp, co và nhăn)", "thí nghiệm 2 = **chai B** (có nắp, trước khi vặn nắp / lúc đang phồng / sau khi nguội thì méo vào)", "chai mới cho lời khuyên = **chai C**".
  - [Bảng "Vật lên hình", nắp chai rời] Chỉ ghi "nằm sấp trên mặt bàn ở cảnh lời khuyên", nhưng nắp rời còn xuất hiện ở dòng 28 (3:18–3:28: "nắp chai nằm sấp cạnh") trước khi được cầm lên vặn vào chai C. -> Gợi ý sửa: ghi rõ "nằm sấp ở dòng 28 và ở khung lời khuyên, rồi được tay cầm lên vặn vào chai C".
  - [Dòng 29 / shot 3:28–3:41] Hình ghi "cận thành chai A nhăn **còn vệt nhiệt loang**". Chai A được rót nước sôi từ 0:57, đến 3:28 là đã mấy phút sau — vệt nhiệt lúc đó đã tắt, và màu cam còn trên thành sẽ khiến người xem tưởng chai vẫn nóng. -> Gợi ý sửa: đổi thành "vệt nhiệt đã mờ, chỉ còn hơi ấm" (giữ nguyên câu chuyện nếp nhăn), hoặc bỏ vệt nhiệt khỏi hình dòng 29.
  - [Dòng 22 và 25, "mũi tên vàng"] Áp suất là thứ vô hình, nên mũi tên là cách hợp lệ để cho thấy nó — nhưng phải bám vào vật thật. -> Gợi ý sửa: ghi rõ trong cột hình rằng mũi tên **là chuyển động của chính thành chai đang phồng** (thành phồng theo hướng mũi tên) và chiếc đồng hồ áp suất không chữ số là vật thật mang áp suất; nếu mũi tên bay lơ lửng trong bụng chai thì đọc thành sơ đồ trừu tượng, dính lỗi nhóm C.
  - [Độ dài] Shot list chạy tới 3:41 còn giọng ước tính 3:20. -> Gợi ý sửa: sau khi sửa dòng 13, nếu vẫn dài thì nơi cắt được an toàn nhất chính là dòng 13 (nó chỉ là dấu hiệu báo trước, dòng 24 đã dùng lại) hoặc rút nhịt 1:37–1:48; tuyệt đối không cắt vào chuỗi "nong → hai hướng → móc xích → nước 100 độ → nhiệt vào nhựa → nhiệt vào móc xích → mốc 70 độ → trượt → co → nếp" và chuỗi khí "hở nắp → vặn nắp → khí bị giam → đẩy ra → phồng → nguội → hút méo".

## Ý LẶP (NẾU CÓ)

- **"Hơi nước":** dòng **1** (nền, bốc lên thành cột), **13** (được đổi thành làn mỏng để đánh dấu "khí thoát ra được"), **24** (hơi nước thoát ra thành làn mỏng, dùng để chốt "không có gì đẩy"), **28** (nền). Vấn đề: sau lần sửa này, dòng 13 và dòng 24 có **cùng một hình** ("hơi nước thoát ra thành làn mỏng"). Đề xuất: giữ hình ở dòng 13 (đánh dấu trước) và ở dòng 24 chỉ dùng góc khác (cận miệng chai hở nắp so với miệng chai kín nắp ở dòng 22) để hình không lặp; hoặc bỏ hẳn dòng 13 nếu cần rút thời gian.
- **"Nếp dọc thân":** dòng **20** (lần đầu, đúng lúc được giải thích, mở đầu bằng "Có lẽ") và dòng **28** (góc mới: chai cầm tay xoay dưới ánh sáng cửa sổ). Hai lần, mỗi lần một việc -> giữ, không cần gộp.
- **"Cái nào thắng là tùy nắp":** dòng **24** (câu chốt) và dòng **28** (câu chốt cuối tập). Hai lần -> chấp nhận được; nếu cần rút, dòng 28 chỉ nên giữ "còn cái nắp thì quyết định".
- **"Chai A đã co và nhăn":** hình xuất hiện ở dòng **1, 17, 18, 19, 24, 26, 28, 29** — nhiều, nhưng mỗi lần một việc khác nhau. Lưu ý: trạng thái của chai A ở các dòng 24/28/29 là **như nhau** (đã co, còn hơi nước) nên không còn tiến trình "trước → sau"; dòng 29 đã chuyển sang chai C cho hành động, đúng hướng.

## KHUYẾN NGHỊ

- **Về chia chương: giữ một chương** — tập dài 3:41, dưới ngưỡng tám phút của `STRATEGY.md`, bảng ý 29 dòng (dưới ngưỡng ~30 câu). Quyết định đã được ghi đúng ở mục "## Chương": một chương duy nhất trong `src/chapters.js` (`do-vat/tap-03`), kèm điều kiện chia sẵn thành chương 1 "ký ức của vật liệu" (dòng 1–20) và chương 2 "khí bị giam" (dòng 21–29), cổng chỉ mở khi cả hai PASS. **Việc này phải được ghi thật vào `src/chapters.js` ở bước sau, không để ở dạng ghi chú trong TREATMENT** — vì 29 dòng ý / 29 shot đã vượt số khung một vòng chấm hình soi được (khoảng 25 khung), nên ngay cả với một chương, người làm phải biết sẵn đường chia.
- **Việc phải sửa trước khi khóa lời (không cần đổi cấu trúc):**
  1. **Sửa dòng 13 cho lời và hình khớp nhau** (lỗi NẶNG duy nhất) — hoặc sửa cột Ý, hoặc đổi hình.
  2. Gọi tên chai B trong hình dòng 21–22, để người xem biết cái chai sắp vặn nắp là chai còn thẳng, không phải chai A đã nhăn.
  3. Gắn nhãn A / B / C vào ba dòng chai trong bảng "Vật lên hình".
  4. Chỉnh vệt nhiệt còn loang trên chai A ở dòng 29 (đã nguội từ lâu).
  5. Ghi nắp chai rời xuất hiện cả ở dòng 28, không chỉ ở khung lời khuyên.
- **Không cắt bất kỳ mắt xích cơ chế nào** khi rút thời gian: chuỗi "nong → hai hướng → móc xích → nước 100 độ → nhiệt vào nhựa → nhiệt vào móc xích → mốc 70 độ → trượt → co → nếp" và chuỗi khí "hở nắp → vặn nắp → khí bị giam → đẩy ra → phồng → nguội → hút méo" là hai mắt xích dài nhất của câu trả lời. Nếu phải rút, cắt dòng 13 (sau khi đã sửa) hoặc rút nhịt 1:37–1:48.
- **Sau khi sửa 5 việc trên, dàn ý đủ đi vào khâu 3D.** Các nguồn trong FACTS đều là nguồn sơ cấp (bằng sáng chế của Coca-Cola, Graham Packaging, Aisapack, Silgan/BP, Owens-Illinois, UPM Raflatac, và NIST Chemistry WebBook); không có mốc nào bị đứng một mình trên Wikipedia, và phim không đưa lên màn hình bất kỳ con số nào ngoài 100 và 70.

---
Người chấm: claude -p (model mặc định của claude) · review.sh --outline · 2026-11-09

---
Người chấm: claude -p (model mặc định của claude) · review.sh --outline · 2026-11-09 10:41
