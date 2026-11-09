SCORES: A=3 B=4 C=4 D=4 E=4
VERDICT: REJECT
ROUND: 2/4

## NHẬN XÉT CHI TIẾT

- Lỗi CHẶN (Bắt buộc sửa):
  - [Dòng 47]: Lời chốt của phim ("Nên khi bạn muốn một sợi dây siết chặt, **đừng kéo căng nó**, hãy nung nó nóng") nói ngược với chính dòng 46 vừa nói trước đó một nhịp ("Chỉ khi dây đang bị kéo căng thì nóng lên mới co lại") và ngược với FACTS mục 3 + mục 4 (dây chưa kéo thì nóng lên vẫn *nở ra* như vật liệu thường). Người xem nghe câu cuối cùng của phim sẽ ra kết luận "nóng một sợi dây không kéo căng thì nó siết lại" — đúng cách hiểu sai mà FACTS cảnh báo, và nó xoá sạch điều kiện mà dòng 46 vừa sửa xong. Đây là lỗi chiều của lực ở câu được nhớ nhất, không phải lỗi diễn đạt. -> Gợi ý sửa: viết lại dòng 47 thành "Nên khi bạn muốn một sợi dây siết chặt, hãy hâm nó nóng trước, rồi quấn lên nắp hũ" (dây quấn lên nắp là đang bị kéo căng, nên nóng lên nó co chặt hơn — đúng FACTS mục 3). Sửa luôn câu "(muốn siết thì nung nóng)" ở mục **Mở và kết** cho khớp. Hình dòng 47 giữ nguyên (hai tay hâm dây rồi áp lên nắp hũ) nhưng phải cho thấy rõ dây ăn sâu vào nắp hơn sau khi hâm, và shot 2:36/2:40 phải có máy sấy tóc trong khung nếu vẫn giữ vệt khí nóng ở dòng 48.

- Lỗi NẶNG:
  - [Dòng 38]: Cột "Vật nào làm gì" còn sót lại cách nói của đồ thị đã bị xoá: "Hai kim, một chạy cong một chạy thẳng". Kim của đồng hồ đo lực là con trục quay trên một cung tròn — nó không "chạy thẳng" được; và điều dòng 38 cần chứng minh là *tốc độ* tăng của lực ("vọt lên ở cuối"), không phải hình dạng đường cong. Dòng 37 đã nói rõ "kim chạy chậm rồi chạy nhanh" (cao su) và "kim chạy đều" (thép), nên cột này đang mâu thuẫn với chính nó và với vật thật. -> Gợi ý sửa: viết lại thành "Hai kim cùng một thang đo: kim cao su chậm rồi bật lên vạch cuối, kim thép lên đều từng vạch" — vẫn là hai đồng hồ thật cạnh nhau, nhưng thấy được hiện tượng "vọt lên ở cuối" (mũi tên không cần, chỉ cần tốc độ kim).

- Lỗi NHẸ:
  - [Dòng 21]: "không phải vì móc câu" — trong phim không có móc câu nào; vật duy nhất từng xuất hiện là "móc liên kết chéo" ở dòng 11. Câu này lại là câu mang luận điểm "đó là lý do dây tự co lại", nên một từ lạ ở đây làm người xem vướng. -> Gợi ý sửa: "không phải vì móc nối ghìm chuỗi, mà vì chuỗi muốn quay lại chỗ có nhiều cách cuộn hơn" (khớp FACTS mục 1).
  - [Dòng 22 và 23]: Hai dòng này gần như cùng một hình: dòng 22 (vệt nhiệt chạy dọc sợi dây, chỗ nào nóng thì nhăn và ngắn, chỗ chưa nóng thì vẫn thẳng) và dòng 23 (dây treo giữa hai điểm, vùng nóng thẳng, vùng lạnh thõng) đều demo "chỗ nào nóng thì co, chỗ nào lạnh thì không". Lời thì khác nhau ("đổi theo nhiệt độ" vs "tỉ lệ với nhiệt độ tuyệt đối") nên chưa phải lặp ý, nhưng hình thì trùng. -> Gợi ý sửa: cho dòng 22 một hình khác (ví dụ hai đoạn dây cùng một mức kéo, một đoạn đã qua vệt nhiệt, một đoạn chưa) hoặc gộp dòng 22 vào dòng 23. Giữ nguyên dòng 23 (chỗ duy nhất được nói "tỉ lệ với nhiệt độ tuyệt đối") và dòng 25 (chỗ duy nhất nói "ở cùng một mức kéo").
  - [Mục Chương]: Bảng chương ghi ch2 = "Trong dây" nhưng dòng 27 của ch2 (đóng vòng) quay ra bếp. -> Gợi ý sửa: ghi "Trong dây, đóng bằng dòng 27 ở bếp"; đồng thời ghi tên file `src/chapters.js` vào bảng và nhắc ngưỡng mở cổng (mỗi chương 5 lượt, cổng chỉ mở khi cả 4 chương PASS).
  - [Dòng 39]: "Chiều ngược lại thì cũng đúng" — ngược lại của cái gì? Dòng trước (38) nói về đường lực–giãn, nên câu này bị treo. -> Gợi ý sửa: "Ngược chiều với lúc nãy: kéo dây thật nhanh thì dây nóng lên" để người xem biết đang đảo chiều nào (nhiệt → co, thì giờ co → nhiệt).
  - [Dòng 48]: "luồng khí nóng bốc lên quanh dây" — dây ấm không làm khí nóng bốc lên; nếu còn máy sấy tóc thì luồng khí là của máy chứ không phải của dây. -> Gợi ý sửa: cho máy sấy tóc quay lại khung (đây là khung kết, có lý do quay lại) hoặc bỏ vệt khí nóng và chỉ để dây siết chặt quanh nắp hũ.
  - [Mục "Câu trả lời một câu"]: Câu trả lời dùng cụm "không phải lực lò xo" trong khi dòng 9 đã nói "không có lò xo nào cả"; FACTS mục 1 yêu cầu "lò xo" chỉ nói một lần trong cả phim. -> Gợi ý sửa: nếu câu trả lời này được đọc lên, bỏ chữ "lò xo" ("... là lực entropic của các chuỗi polymer"), nếu không thì ghi chú thêm "câu này chỉ là bản tóm, không đọc lên".

- Đối chiếu với lần chấm trước (PREVIOUS.md) — mục nào đã sửa, mục nào còn:
  - Đã sửa đúng: xoá dòng cũ 38 với "đường kim cong trên thang" (nay là dòng 38 so sánh hai kim — nhưng còn sót cụm "một chạy cong một chạy thẳng", xem lỗi NẶNG); sửa hình dòng 9 thành "mặt cắt đầy mạng chuỗi, không có lò xo" (không còn "bên trong rỗng"); gộp ý "không phải lực lò xo" về còn một lần ở dòng 9, dòng 21 chuyển sang ý mới; viết lại dòng 47 cũ (ý lặp "tỉ lệ với nhiệt độ tuyệt đối") — nay chỉ còn ở dòng 23 với hình khác hẳn; thêm dòng 5 "vòng dây chùng nóng lên thì nó dài ra" và nhắc lại điều kiện ở dòng 46 (đủ vế thứ hai, cả hình và lời); sửa dòng 2/30 cho khác lời; bỏ "độ giãn" ở dòng 25, dùng "mức kéo"; sửa "nắp hũ bị dây bóp" thành "dây ăn sâu vào rãnh nắp"; sửa "hơi nóng bốc lên từ dây"; bỏ cụm kilojoule ở dòng 41 (và "hàng nghìn chuỗi" cũng đã mất); thẻ "14 %" không còn chữ "LỰC CO +"; FACTS mục 8 đã có thêm mắt xích "nhiệt sinh ra khi kéo thì đủ làm dây nóng lên mấy độ"; ba bản sao chuỗi ở dòng 13 đã có nhịp rung lệch pha.
  - Còn tồn: bối cảnh chương đã có nhưng phải ghi ra `src/chapters.js` trước vòng chấm hình; nhánh Joule còn 3 dòng (39–41) — chấp nhận được vì đã bỏ con số và mỗi dòng đều có hình tiến trình, nhưng nếu sau vòng này còn dài thì đây là chỗ cắt đầu tiên.

## Ý LẶP (NẾU CÓ)
- Ý "lực co của cao su đổi theo nhiệt độ" xuất hiện ở các dòng [22, 23, 25]: đề xuất giữ cả ba nhưng đổi hình dòng 22 (hiện tại trùng ý hình với dòng 23), vì dòng 23 là chỗ duy nhất được nói "tỉ lệ với nhiệt độ tuyệt đối" và dòng 25 là chỗ duy nhất nói "ở cùng một mức kéo".
- Ý "dây chưa kéo căng thì nóng lên vẫn nở ra" xuất hiện ở các dòng [5, 6, 46]: đề xuất giữ cả ba — dòng 5 là phép thử, dòng 6 là kết luận của phép thử, dòng 46 là điều kiện trong lời chốt; FACTS mục 4 yêu cầu đúng cách chia này ("nói hai vế… rồi nhắc lại ở lời chốt").
- Ý lặp của lần trước ("không phải lực lò xo" ở 8/21/38 và "tỉ lệ với nhiệt độ tuyệt đối" ở 22/24/47) đã được xoá sạch — không còn lặp ý nào chặn được.

## KHUYẾN NGHỊ
- Chia chương đã có (4 chương, 48 câu ≈ 2:45, dưới ngưỡng một tập): ghi ngay ra `src/chapters.js` với `ch1` = dòng 1–8 (Bếp), `ch2` = 9–27 (Trong dây), `ch3` = 28–41 (Bàn đo), `ch4` = 42–48 (Bếp + trong dây). Mỗi chương có 5 lượt riêng; cổng chỉ mở khi cả 4 chương PASS. Bảng ý → hình và shot list hiện khớp 1:1 (48 dòng / 48 shot) — giữ nguyên nguyên tắc này sau khi sửa, và đánh số lại shot list nếu có dòng nào thêm/bớt.
- Sửa xong đúng 2 việc thì vòng này đủ điều kiện PASS: (1) viết lại lời dòng 47 cho đúng chiều (hâm nóng dây *rồi* quấn lên nắp), đồng thời sửa câu "(muốn siết thì nung nóng)" ở mục Mở và kết; (2) viết lại cột "Vật nào làm gì" của dòng 38 thành tốc độ kim (chậm rồi vọt) thay vì "một chạy cong một chạy thẳng". Các lỗi NHẸ ở trên sửa luôn trong lượt này được thì càng tốt, nhưng không chặn.
- Sau khi sửa: vẫn 48 dòng, không cần chia lại chương, không cần đổi mốc thời gian trong shot list.
- Nếu vòng sau vẫn còn dài quá 3 phút sau khi thêm dòng, cắt nhánh Joule (dòng 39–41) xuống còn một dòng trước; tuyệt đối không cắt vế "dây chưa kéo" (dòng 5) và không cắt điều kiện ở dòng 46, vì đó là hai chỗ giữ cho câu trả lời đúng chiều.

---
Người chấm: claude -p (model mặc định của claude) · review.sh --outline · 2026-11-09

---
Người chấm: claude -p (model mặc định của claude) · review.sh --outline · 2026-11-09 13:57
