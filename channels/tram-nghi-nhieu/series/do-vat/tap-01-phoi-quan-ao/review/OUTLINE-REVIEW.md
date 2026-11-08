SCORES: A=5 B=5 C=5 D=4 E=5
VERDICT: PASS
ROUND: 4/5

## NHẬN XÉT CHI TIẾT

Dàn ý đã qua bốn vòng và đây là kết luận của vòng chấm thứ 4. Vấn đề lớn của vòng 3 (mục "Độ dài" tự mâu thuẫn với chính bảng ý) **đã được sửa đúng và sửa triệt để**: bộ số giờ, số câu, số từ và shot list giờ khớp nhau từ đầu đến cuối, và **không nhát nào vượt sứa chứa lời**. Dàn ý đã sẵn sàng cho khâu 3D. Còn đúng **một lỗi NẶNG** (một con số sót trong mục "Độ dài") và sáu góp ý NHẸ, tất cả đều sửa được khi viết `voice/lines.json` và dựng, không đụng tới cấu trúc.

**Đã kiểm lại bằng máy, không bằng mắt:**
- Bảng "Ý → hình": **25 dòng, 60 câu lời, 631 từ** — khớp đúng ba con số mà mục "Độ dài" tự khai (25 dòng / 60 câu / 631 từ).
- Shot list: **26 nhát, liền khum không hở, tổng 257 giây = 4:17**, đúng bằng "phim dài 4:17 theo shot list". Nhát ngắn nhất 4 giây (2:08–2:12, hai câu "Gió không sấy nước / Gió chở hơi nước đi"), nhát dài nhất 15 giây (0:13–0:28 và 1:36–1:51) — đúng như mục "Độ dài" mô tả.
- Khớp 1–1 giữa 25 dòng ý và 26 nhát (dòng 2 chiếm hai nhát: 0:13–0:28 và 0:28–0:39). Không dòng nào lệch.
- **Sức chứa lời theo từng nhát** (160 từ/phút, giọng `vi-VN-NamMinhNeural` rate +5%): **không nhát nào vượt**. Nhát chật nhất là dòng 13 (16 từ/6 giây = 160 từ/phút, vừa đúng sức chứa), rồi dòng 21 và dòng 25 (158), dòng 8 (157), dòng 19 (155). 631 từ ÷ 160 = 236,6 giây lời; 257 − 236,6 ≈ 20 giây nghỉ — **khớp đúng "cộng 20 giây nghỉ giữa các câu"**, và không nhát nào có lời tràn sang nhát sau.
- Mọi con số trên màn hình đều có nguồn trong FACTS và đúng vòng bảo lưu của FACTS: 25 °C / 30 °C (mục 3 + "Suy luận"), 90 % (mục 3, kèm "cùng một luồng gió"), "khoảng năm lần" (đúng lời "Cách nói" của mục 3), "một nửa" (mục 4), "hơn hai kilojoule cho mỗi gram" (mục 1), "khoảng hai mươi gam hơi nước trên mỗi kilogam không khí khô" ("Suy luận"). **Không câu nào đụng "Giá trị không được nói"**: không có "gió gấp đôi thì khô gấp đôi", không thời gian khô cụ thể, không tỉ lệ phân tử thoát ra, không nhiệt độ nguội của vải, không "chín mươi phần trăm thì không khô được", không "không có gió thì không bao giờ khô".
- Không dòng nào dùng chữ trên màn hình, thẻ, sơ đồ mũi tên hay "hình tượng trưng"; mọi động từ biến đổi đều có hình thể hiện quá trình trước → sau.

**Điểm D=4 (không phải 5)** vì mục "Độ dài" còn đúng **một** con số tự mâu thuẫn — chi tiết ở lỗi NẶNG #1. Ba tiêu chí gốc của nhóm D đều đạt: không thiếu mắt xích cơ chế nào (chuỗi ba tầng hoá hơi → cần chỗ trống → gió quét lớp ẩm còn nguyên, cộng hai tầng đo đạc và điều kiện), không độn ý (25 dòng, 25 ý khác nhau), và mỗi nơi chốn đều gắn với một tầng của câu trả lời (bảng N1–N4 có cột "Lớp của câu trả lời" và ghi rõ máy vào/ra thế nào).

## ĐỐI CHIẾU VỚI VÒNG 3 (đã sửa chưa, sửa đúng chưa)

**Lỗi CHẶN lần trước**

1. [Dòng 19] thiếu điều kiện "cùng một luồng gió" → **ĐÃ SỬA ĐÚNG.** Nay là "Cùng một luồng gió, không khí ẩm chín mươi phần trăm làm nước bay hơi chậm hơn **khoảng** năm lần" — đúng lời FACTS mục 3, kể cả vòng bảo lưu "khoảng" mà lần trước còn thiếu.
2. [Dòng 15, cột hình] "bên trái gần như đứng yên" → **ĐÃ SỬA ĐÚNG.** Nay là "giọt bên trái vẫn nhỏ đi nhưng chậm hơn hẳn" (đúng FACTS mục 4: không có gió thì vẫn khô, chậm hơn) và vách chắn giữ luồng quạt khỏi giọt bên trái.
3. [Dòng 17] mất điều kiện nhiệt độ → **ĐÃ SỬA, theo hướng khác, vẫn chấp nhận được.** Điều kiện 25 °C chuyển từ lời sang hình (nhiệt kế chỉ hai mươi lăm độ), lời nói "ở nhiệt độ này". Không đổi ý về điểm này: xem NHẸ #2.

**Lỗi NẶNG lần trước**

4. [Dòng 2 và dòng 15] cảnh đối chứng "không gió" không đáng tin → **ĐÃ SỬA ĐÚNG CẢ HAI.** Dòng 15 đã sửa từ vòng trước. Dòng 2 nay dùng đúng cách (b): đối chứng nằm trong **căn phòng kín**, và hình có chứng cứ "không có gió" — cái áo ở góc xa còn sẫm, **túi nylon đứng yên**, trong khi túi nylon cạnh quạt đang nghiêng. Lời "không khí trong phòng đứng yên" không còn đứng trên một lời không dựng được.
5. [Dòng 14] "kim cân lệch theo hai hướng" → **ĐÃ SỬA ĐÚNG.** Nay là "kim áo trước quạt đã gần vạch, kim áo góc xa còn ở xa vạch" — cả hai kim đều đang chạy, chỉ khác vị trí, đúng FACTS ("hai cái áo đang khác nhau và thời gian đang trôi").
6. [Bảng "Vật lên hình" và bảng "Nơi chốn" thiếu vật/nơi] → **ĐÃ SỬA ĐÚNG.** Đã tra từng dòng: **mọi vật trong bảng vật đều xuất hiện trong cột "Trên màn hình thấy gì"** — kẹp gỗ (dòng 1), đồng hồ treo tường (dòng 14), ghế (24, 25), áo thun (21), khăn tắm (21), đàn áo (16), bàn tay (8, 23), hai mặt kính + vách chắn (15), mặt nước (6, 7), sợi vải (4). Không còn vật khai mà không lên hình.
7. [Dòng 8 và dòng 22] dùng gợn nhiệt cho vật đang mất nhiệt → **ĐÃ SỬA ĐÚNG.** Quy tắc đã thành quy tắc trong "Thứ vô hình"; dòng 8 dùng tông lạnh + hạt hơi nước bốc lên rồi tan, dòng 23 dùng tông lạnh + hạt bị gió cuốn đi. Đã grep toàn file: không còn gợn nhiệt ở đâu.
8. [Mục "Độ dài"] số học tự mâu thuẫn → **ĐÃ SỬA ĐÚNG, VÀ LẦN NÀY SỬA TRIỆT ĐỂ.** Đây là lỗi đã phải đính chính hai vòng; nay nó thật sự đã hết:
   - "25 dòng ý (24 dòng của câu trả lời + 1 dòng lời khuyên)" → **đúng**: bảng có 25 dòng, dòng 25 là lời khuyên.
   - "60 câu lời" → **đúng**: đếm được đúng 60 câu trong bảng.
   - "631 từ ≈ 3:57 lời kể" → **đúng**: 631 từ, 631/160 = 3:56,5.
   - "cộng 20 giây nghỉ giữa các câu ≈ 4:17" → **đúng**: 236,6 + 20 ≈ 257 giây = 4:17, khớp tổng shot list.
   - "Phim dài 4:17 theo shot list: 26 nhát, mỗi nhát 4–15 giây" → **đúng**: 26 nhát, liền khum, 257 giây, min 4 giây / max 15 giây.
   - Chú thích đầu bảng "Ý → hình" nay đã là "một hay nhiều câu lời" → **đúng**, khớp bảng.
   - Chỉ còn **một** số sót, xem NẶNG #1.

**Lỗi NHẸ lần trước**

9. [Dòng 9] "chỉ bay hơi được khi" → **ĐÃ SỬA ĐÚNG** ("Nước chỉ bay hơi đều hơn khi không khí ngay trên vải còn trống").
10. [Dòng 4] "bám bởi sức hút của sợi" → **ĐÃ SỬA ĐÚNG** ("còn bám trong chính sợi", mục 8).
11. [Dòng 10 vs dòng 19] cùng hình "lớp ẩm đặc lại" → **ĐÃ SỬA ĐÚNG**: dòng 10 là lớp **đặc dần** (bão hoà), dòng 19 là lớp **mờ đục** (độ ẩm 90 %) — đúng như "Thứ vô hình" đã ghi, và đã có ghi chú "(hình khác hình dòng 10)" trong shot list.
12. [Dòng 14/19/20] lặp nhịp "hai món cạnh nhau" → **ĐÃ SỬA ĐÚNG**: dòng 20 nay là máy quay chậm quanh áo phơi rộng rồi đi vòng sang áo úp; dòng 21 là khăn/áo thun ở bối cảnh hiên.
13. [Shot cuối] không có lời khuyên → **ĐÃ SỬA ĐÚNG**: dòng 24 và 25 đều có cái áo úp còn ẩm trên ghế.
14. [Bảng vật] bàn tay chưa khai → **ĐÃ SỬA ĐÚNG** (`rig/fx.js` → `buildHand()`).
15. [Dòng 11] chỉ diễn bằng hình, thiếu chữ có nguồn → **ĐÃ SỬA ĐÚNG** ("Gió làm đường đi của hơi nước ngắn lại", mục 5).
16. [Dòng 15] lời/hình lệch nơi → **ĐÃ SỬA ĐÚNG** ("Một thí nghiệm đơn giản trên bàn").
17. [Dòng 16] đàn áo "trên tường hiên" → **ĐÃ SỬA ĐÚNG** ("trên dây thứ hai").
18. [Dòng 17] con số 25 °C trong lời → **ĐÃ SỬA ĐÚNG**: 25 °C chỉ còn trên nhiệt kế trong hình.
19. [Bảng vật] thiếu "ghế" → **ĐÃ SỬA ĐÚNG**.
20. [Dòng 10] lệch nơi chốn ("mặt nước" trong khi cột Nơi ghi N4) → **ĐÃ SỬA ĐÚNG**: nay là "giọt nước trên mặt kính", cả hình lẫn nơi đều ở N4.

### Lỗi CHẶN (Bắt buộc sửa)

- **Không còn lỗi CHẶN.** Ba lỗi CHẶN lần trước đã sửa đúng; dàn ý này không có mắt xích cơ chế nào thiếu nguồn, không con số nào vượt FACTS, không câu nào đụng "Giá trị không được nói", không dòng nào dùng chữ/sơ đồ thay vì vật thật, và không dòng nào lặp ý. Không có gì ở bước này có thể phá hỏng khâu 3D về sau.

### Lỗi NẶNG

1. **[Mục "Độ dài"] còn một con số sót từ bản cũ, đứng ngay cạnh con số đúng.** File ghi: *"60 câu lời trong `voice/lines.json` (**53 dòng lời**, mỗi dòng 7–20 từ)"*. Nhưng:
   - "53 dòng lời" **mâu thuẫn trực tiếp** với "60 câu lời" ngay trong cùng câu, và với chú thích đầu bảng "Ý → hình" ("đó đúng là câu sẽ đọc trong `voice/lines.json`, theo đúng thứ tự và **cùng số câu**"). 60 câu trong bảng ⇒ `lines.json` phải có 60 dòng, mỗi dòng một câu.
   - Con số "53" là **đúng bằng số câu của 22 dòng đầu** (dòng 1–22), tức sót lại từ một bản 22 dòng trước đó — không phải lỗi diễn giải, là lỗi sót.
   - Hệ quả sản xuất: người viết `voice/lines.json` đọc "60 câu" hay "53 dòng" sẽ ra hai file khác nhau (mất 7 câu, ~75 từ, ~28 giây lời).
   -> Gợi ý sửa (một câu, không đụng shot list):
   > **25 dòng ý · 60 câu lời = 60 dòng trong `voice/lines.json` (mỗi dòng một câu, 4–20 từ) · 631 từ ≈ 3:57 lời kể (160 từ/phút) + khoảng 20 giây nghỉ giữa các câu ≈ 4:17 lời kể · phim dài 4:17 theo shot list: 26 nhát, mỗi nhát 4–15 giây.**
   - Kèm theo cùng lần sửa: "mỗi dòng 7–20 từ" → **"4–20 từ"** (xem NHẸ #1). Shot list và bảng "Ý → hình" **không cần đụng**.

### Lỗi NHẸ

1. **[Mục "Độ dài"] "mỗi dòng 7–20 từ" không đúng thực tế: có 6 câu dưới sàn 7 từ.** Đo được: ngắn nhất 4 từ (dòng 12, "Gió không sấy nước."), dài nhất 20 từ (dòng 19, câu "Cùng một luồng gió…"). Dưới 7 từ: dòng 3 (5), dòng 12 (4 và 5), dòng 13 (6), dòng 14 (5), dòng 17 (5). -> Gợi ý sửa: sửa thành "4–20 từ"; các câu rất ngắn ở dòng 12 là **có chủ đích** (nhát 4 giây, hai câu cắt ngắn) nên đừng viết lại cho dài — chỉ sửa con số.
2. **[Dòng 17] Điều kiện 25 °C chỉ nằm ở hình, lời chỉ nói "ở nhiệt độ này".** Con số "hai mươi gam" chỉ đúng ở 25 °C, nên lời tự mang điều kiện sẽ chắc hơn. -> Gợi ý sửa (không bắt buộc): "Không khí ở hai mươi lăm độ chứa được tối đa khoảng hai mươi gam hơi nước." + "Tính trên mỗi kilogam không khí khô."; câu "Đó là trần của nó." (5 từ) có thể bỏ. Lưu ý: nhiệt kế trong hình vẫn nên chỉ hai mươi lăm độ, và "hai mươi lăm độ" là con số đã có trong FACTS nên không vi phạm.
3. **[Dòng 22] Căn phòng kín trong hình có quạt đang chạy, mà lời lại nói "không khí trong phòng không đi đâu cả".** Xem lại dòng 2: không khí trong phòng "đứng yên", chỗ nào có quạt thì mới có gió — nên một chiếc áo treo trong đúng phòng đó sẽ không "đứng yên" nếu quạt đang chạy. -> Gợi ý sửa: trong nhát 3:38–3:48 **tắt quạt**, hoặc treo áo ở đúng góc xa "không có gió" đã dựng ở dòng 2, rồi ghi rõ điều đó trong cột hình (và thêm vào shot list: "quạt tắt" / "góc xa không có gió").
4. **[Dòng 15] Chưa nói hướng gió, nên vách chắn chưa chắc che được giọt bên trái.** Vách chắn ở giữa chỉ che giọt bên trái nếu gió thổi **từ phải sang trái** (quạt đứng bên phải). Dòng 11 lại dựng luồng gió trong phòng chạy từ trái sang phải. -> Gợi ý sửa: ghi rõ trong cột hình dòng 15 ("quạt bàn đặt bên phải, gió thổi từ phải sang trái, quét qua mặt kính bên phải; vách chắn giữ luồng gió khỏi mặt kính bên trái") và khớp với shot list 2:25–2:37.
5. **[Dòng 25] Lời khuyên "phơi cả hai mặt" không có hình bám theo.** Hình cuối chỉ có cái áo úp còn ẩm (bám cho "không chồng quần áo lên nhau") và dây phơi đã khô; không thấy chiếc áo đang phơi một mặt. -> Gợi ý sửa: hoặc thêm vào hình dòng 25 một chiếc áo treo có một mặt còn sẫm (mặt ướt) và mặt kia đã nhạt, hoặc bỏ vế "Phơi cả hai mặt" khỏi lời khuyên.
6. **[Bảng "Vật lên hình"] Quạt bàn xuất hiện ở hai nơi chốn mà không được khai.** Quạt nằm trong bộ của N4 (dòng 2, 13, 23) **và** ở góc phải trên hiên (khung hero 3, dòng 25). Túi nylon đã được khai hai chỗ ("buộc cọc ở hiên, treo trong phòng") nhưng quạt thì không. -> Gợi ý sửa: sửa dòng quạt trong bảng vật thành "Quạt bàn (quay, có lưới) — ở hiên và trong phòng" (hai chiếc giống nhau), hoặc khai rõ một chiếc quạt được mang từ phòng ra hiên ở nhát cuối.

## Ý LẶP (NẾU CÓ)

- **Không có ý lặp.** 25 dòng giữ 25 ý khác nhau; không luận điểm nào lặp 3 lần hay lặp xuyên chương. Bốn dòng có đối chứng "có gió / không gió" (2, 14, 15, 22) vẫn là bốn ý khác nhau về mặt cơ chế và về hình: 2 = quạt đối với góc phòng kín (màu vải), 14 = hai cái cân (đo bằng số vật mang), 15 = hai giọt nước sau vách (tốc độ bằng mắt), 22 = phơi trong nhà (không khí quay lại bám áo). Cặp hình từng bị nhận nhầm đã tách rõ: dòng 10 (lớp đặc dần = bão hoà) vs dòng 19 (lớp mờ đục = độ ẩm 90 %). Dòng 25 lặp lại "không chồng quần áo lên nhau" của dòng 20 là **nhắc lại có chủ đích ở khung kết** (lời khuyên ứng dụng), có vật bám theo (cái áo úp còn ẩm) — không phải lặp ý.

## ĐIỂM MẠNH CẦN GIỮ KHI SỬA

- Câu hỏi tách rõ chủ thể–thay đổi–so sánh–nguyên nhân; câu trả lời một câu đúng chủ ngữ và đúng chiều nhân quả ("gió không sấy nước, gió chở hơi nước đi").
- Chuỗi ba tầng cơ chế không đổi và khớp FACTS: nước phải hoá hơi (mất năng lượng) → hơi nước cần chỗ trống (lớp khí ẩm) → gió chở lớp ẩm đi. Mỗi tầng một nơi chốn riêng (N2, N3, N4) và một hình riêng.
- Khái niệm khoa học luôn có hình trước hoặc ngay khi được gọi tên: "hơi nước" (dòng 5), "lớp khí ẩm" (dòng 9), "bão hoà" (dòng 10), "mặt nước / phân tử" (dòng 6), "độ ẩm / diện tích phơi" (dòng 16, có đủ ba vật trong hình).
- Bảng "Ý → hình" không có dòng nào dùng chữ trên màn hình, sơ đồ mũi tên hay "hình tượng trưng"; mọi động từ biến đổi đều có trước → sau (áo sẫm → nhạt, lớp ẩm dày → mỏng, mặt nước ấm → lạnh, giọt nhỏ đi, kim cân về vạch).
- Quy tắc "vật đang mất nhiệt thì đổi sang màu lạnh, không dùng gợn nhiệt" đã thành quy tắc trong "Thứ vô hình" và dùng đúng ở dòng 8 và dòng 23.
- Shot list liền khum, 26 nhát, máy chỉ đi khi có lý do nêu rõ, **không nhát nào bị lời vượt sức chứa** (chật nhất 160 từ/phút ở dòng 13).
- Kết đúng yêu cầu: quay lại hiện tượng ở hiên với góc nhìn mới ("gió không làm nước biến mất, gió làm cho nước có chỗ để đi"), kèm lời khuyên nằm trong hình (cái áo úp còn ẩm) chứ không nói thành lời.

**Điều kiện PASS (không CHẶN, tối đa 1 lỗi NẶNG, mọi nhóm A–E ≥ 4):** đạt — **không lỗi CHẶN**, **đúng 1 lỗi NẶNG** (một con số sót trong mục "Độ dài", sửa trong một câu), A=5 B=5 C=5 D=4 E=5. Dàn ý đã sẵn sàng cho khâu 3D. Sửa NẶNG #1 và các góp ý NHẸ #1, #3, #4 khi viết `voice/lines.json` và dựng là đủ; NHẸ #2, #5, #6 là tuỳ chọn.

Người chấm: omp -p --model minimax · review.sh --outline · 2026-11-08 (vòng 4/5)

---
Người chấm: omp -p --model minimax · review.sh --outline · 2026-11-08 11:20
