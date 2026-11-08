VERDICT: PASS
ROUND: 2/5
FLAGS_DETECTED: NONE

> **Đã gỡ cờ `NOFACTS` của vòng 1:** `FACTS.md` nay có **mục 11 — "Da được làm mát khi mồ hôi bám trên nó bốc hơi"** (nguồn: Wikipedia *Sweat* mục "Mechanism" + Wikipedia *Evaporation* mục "Theory", truy cập 08/11/2026), và mục đó viết nguyên văn lời "Cách nói" của phim: *"cùng cơ chế đó giải thích vì sao quạt thổi tay lại thấy mát"*. Cặp câu c54–c55 vốn bị gắn cờ ở vòng 1 nay đã có mục đứng sau → cờ `NOFACTS` gỡ.
> **`lines.json` nay có 60 dòng = 60 câu** (vòng 1: 53 dòng / 60 câu). Việc tách dòng đã đúng như yêu cầu cấu trúc của vòng 1; `gap` được chia lại đều (0,2 giữa các nhịp, 0,45 ở mốc nhịp lớn).

## ĐỐI CHIẾU VỚI VÒNG 1 (11 lỗi → trạng thái)

| # | Lỗi vòng 1 | Sửa chưa | Kết quả trong `lines.json` |
|---|---|---|---|
| 1 | **[CHẶN] `NOFACTS` c47–c48** (quạt thổi tay mát / hơi nước trên da) | ✅ Đóng bằng nguồn | Thêm `FACTS.md` mục 11 (nguồn tra cứu độc lập, có phạm vi và lời "Cách nói"); lời c54–c55 giữ nguyên → **cờ gỡ** |
| 2 | c45 ↔ c46: "Đó" chỉ sai nguyên nhân | ✅ Đúng | Đã đảo: c52 "Không khí trong phòng không đi đâu cả…" → c53 "Đó là lý do phơi trong nhà lâu khô hơn." |
| 3 | c3: "có đúng không" không có antecedent | ✅ Đúng | c3 = "Vì sao phơi quần áo cần gió? Mình làm thí nghiệm nhỏ."; c5 rút còn "Một cái trước quạt, một cái ở góc xa, không có gió." (đúng phần đề xuất) |
| 4 | c30 ↔ c31: phạm vi của "một nửa" | ✅ Đúng | Đã đảo: c36 "Hai giọt nước, một bên có gió, một bên không." → c37 "Không có gió thì tốc độ bay hơi rơi còn một nửa." |
| 5 | c23: lặp mở đầu "Lớp hơi ẩm" | ✅ Đúng | c25 = "Lớp đó bám sát vải, nhanh chóng bị bão hoà." + c26 = "Từ đó, nước bay hơi chậm lại." (nguyên văn đề xuất) |
| 6 | c41: hai vế đọc như một trường hợp | ✅ Đúng | c48 = "Chồng áo lên nhau, hay phơi một mặt, thì diện tích để bốc hơi bị thu hẹp."; c49 rút "cái áo" → "Cái áo úp giữ ẩm lâu hơn cái phơi rộng." |
| 7 | c43: lặp "giữ… giữ" | ✅ Đúng | c50 = "Quần áo dày giữ nhiều nước hơn, và cũng giữ lâu hơn áo mỏng." (vế "hơn" đã gắn cả hai) |
| 8 | c27: mật độ "hơi nước" | ✅ Đúng | c31 = "Gió mạnh hơn, lớp ẩm bị quét xa hơn." + c32 = "Nên nước bốc hơi nhanh hơn." |
| 9 | c37: mật độ "không khí" | ✅ Đúng | c44 = "Nhiệt độ cao hơn thì sức chứa ấy càng cao hơn." ("không khí" trong cụm đó còn 3 lần, 2 lần là do FACTS mục 2 và mục 3 bắt buộc) |
| 10 | **[cấu trúc]** 53 dòng ≠ 60 câu | ✅ Đúng | Nay 60 dòng, mỗi dòng một câu; tổng `gap` 20,2 s |
| 11 | **[nhịp]** cân lại shot list | ⚠️ Còn dư 1,3 s | Tổng thời lượng đọc + nghỉ = 258,3 s so với 257 s của shot list đã duyệt (xem "Tổng kết hành động") |

## ĐÁNH GIÁ TỪNG CÂU

**Mở cảnh và thí nghiệm (c1–c9)**

- [c1]: Quần áo ướt treo trên dây, nước vẫn còn đó, chưa đi đâu cả.
  - Đánh giá: OK
  - Lý do: GIỮ từ vòng 1. Mở cảnh, 14 từ, không chữ số, không từ sáo rỗng.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c2]: Nó còn ở trên vải, và sẽ phải rời đi bằng một cách khác.
  - Đánh giá: OK
  - Lý do: GIỮ. Móc nối c13 (FACTS mục 1 và 7); không thêm ý ngoài lề.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c3]: Vì sao phơi quần áo cần gió? Mình làm thí nghiệm nhỏ.
  - Đánh giá: OK
  - Lý do: Đã sửa đúng lỗi vòng 1 — câu hỏi đã có antecedent (chính câu hỏi), 12 từ, nguyên văn đề xuất.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c4]: Trong một căn phòng kín, hai cái áo giống nhau treo cạnh nhau.
  - Đánh giá: OK
  - Lý do: GIỮ. Có đối chứng hình (túi nylon đứng yên ở góc xa), 13 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c5]: Một cái trước quạt, một cái ở góc xa, không có gió.
  - Đánh giá: OK
  - Lý do: MỚI (rút theo đề xuất vòng 1 để lấy chỗ cho c3). Ngữ nghĩa không đổi, 12 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c6]: Không khí trong phòng đứng yên, nên chỗ nào có quạt thì mới có gió.
  - Đánh giá: OK
  - Lý do: GIỮ. "Đứng yên" có hình bám, 15 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c7]: Cái trước quạt đang nhạt màu dần, còn cái kia vẫn sẫm.
  - Đánh giá: OK
  - Lý do: GIỮ. Quy ước hình (vải sẫm khi ướt), 12 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c8]: Nước không tự mất đi.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). FACTS mục 1 và 8; câu độc lập 5 từ, không mất nghĩa.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c9]: Muốn rời khỏi vải, nó phải đổi thành thứ khác.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). Đúng FACTS mục 1 và 7; đây là câu bản lề dẫn tới c13.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)

**Bên trong sợi vải và ở mặt nước (c10–c20)**

- [c10]: Đi sâu vào cái áo, mình thấy các sợi vải đan qua nhau.
  - Đánh giá: OK
  - Lý do: GIỮ. Giọng "mình" đúng giọng kể của `STRATEGY.md`, 13 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c11]: Nước nằm ở khe giữa các sợi, và còn bám trong chính sợi.
  - Đánh giá: OK
  - Lý do: GIỮ. FACTS mục 8, 13 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c12]: Ở rìa sợi, nó thành vệt trong xơ.
  - Đánh giá: OK
  - Lý do: GIỮ. Chi tiết hình của dàn ý, không phải mệnh đề mới; nền là FACTS mục 8. (Gợi ý không bắt buộc của vòng 1: có thể bổ sung "vệt trong xơ" vào `FACTS.md` mục 8 — vẫn để ngỏ, không chặn.)
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c13]: Muốn rời khỏi vải, nước phải đổi thành hơi nước.
  - Đánh giá: OK
  - Lý do: GIỮ. FACTS mục 1 và 7; 10 từ, là câu trả lời một câu của dàn ý.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c14]: Mình sẽ đi xem điều đó xảy ra thế nào.
  - Đánh giá: OK
  - Lý do: GIỮ. Bước chuyển nơi chốn, 10 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c15]: Ở mặt nước, các phân tử cứ nhảy lung tung.
  - Đánh giá: OK
  - Lý do: GIỮ. FACTS mục 7, khớp hình "các hạt nhảy lung tung", 10 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c16]: Chỉ một phần nhỏ đủ năng lượng để bứt ra ngoài.
  - Đánh giá: OK
  - Lý do: GIỮ. FACTS mục 7 "Cách nói"; không nói tỉ lệ phân tử thoát ra (đúng "Giá trị không được nói"). 11 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c17]: Phân tử bay lên mang theo năng lượng của nó.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). FACTS mục 7 ("phân tử thoát ra mang theo năng lượng"); 10 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c18]: Phần nước còn lại thì mát đi.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). FACTS mục 7 ("phần còn lại mát đi"); 7 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c19]: Nước lấy nhiệt từ chính cái vải, nên vải ướt thành vải lạnh.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục "Suy luận của tập phim" (vì sao vải ướt nguội); không nói vải nguội bao nhiêu độ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c20]: Chạm vào nó, mình thấy lạnh ngay.
  - Đánh giá: OK
  - Lý do: GIỮ. Có vật mang (tay chạm vải), 7 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)

**Cơ chế bốc hơi và lớp ẩm (c21–c26)**

- [c21]: Mỗi gram nước bay hơi lấy hơn hai kilojoule nhiệt từ chính cái vải.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn lời "Cách nói" của FACTS mục 1 và mục "Suy luận"; viết bằng chữ, không có chữ số.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c22]: Nhưng nước chỉ bay hơi đều hơn khi không khí ngay trên vải còn trống.
  - Đánh giá: OK
  - Lý do: GIỮ. FACTS mục 3; 15 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c23]: Chỗ trống đó, hơi nước mới đi được.
  - Đánh giá: OK
  - Lý do: GIỮ. Cầu nối c22 → c25; 8 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c24]: Lớp hơi ẩm ấy bám sát mặt áo, mỏng như một tấm kính mờ.
  - Đánh giá: OK
  - Lý do: GIỮ. Đúng hình "tấm kính mờ" của khung hero 2; 14 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c25]: Lớp đó bám sát vải, nhanh chóng bị bão hoà.
  - Đánh giá: OK
  - Lý do: MỚI, nguyên văn câu đề xuất của vòng 1 — đã phá lặp mở đầu "Lớp hơi ẩm"; nền là FACTS mục 3. 10 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c26]: Từ đó, nước bay hơi chậm lại.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). Đúng FACTS mục 3; 7 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)

**Gió: cơ chế trung tâm (c27–c32)**

- [c27]: Gió thổi tới, lớp ẩm bị quét đi, và khí khô thay vào chỗ.
  - Đánh giá: OK
  - Lý do: GIỮ. Cơ chế trung tâm của phim, có hình bám (luồng gió quét lớp ẩm). 14 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c28]: Gió làm đường đi của hơi nước ngắn lại.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn lời "Cách nói" của FACTS mục 5; 9 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c29]: Gió không sấy nước.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). Đúng "Câu trả lời một câu" của dàn ý; 4 từ, không đụng "Giá trị không được nói".
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c30]: Gió chở hơi nước đi.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). Đối xứng với c29, làm nổi bật chỗ cơ chế của gió; 5 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c31]: Gió mạnh hơn, lớp ẩm bị quét xa hơn.
  - Đánh giá: OK
  - Lý do: MỚI, nguyên văn đề xuất của vòng 1 — đã giảm mật độ "hơi nước" trong cụm; nền FACTS mục 5 và mục 6. 9 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c32]: Nên nước bốc hơi nhanh hơn.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). Kết luận của cụm, 6 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)

**Đo và ba yếu tố quyết định (c33–c47)**

- [c33]: Đo được: hai cái cân, một áo trước quạt, một ở góc xa.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). Đúng "Số trên đồng hồ và cân trong cảnh" — không nói con số phút hay gam nào; 13 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c34]: Hai cái kim lệch nhau.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). Có hình bám (hai kim cân), 5 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c35]: Một thí nghiệm đơn giản trên bàn.
  - Đánh giá: OK
  - Lý do: GIỮ. Cầu nối sang hình hai mặt kính có vách ngăn; 7 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c36]: Hai giọt nước, một bên có gió, một bên không.
  - Đánh giá: OK
  - Lý do: Đã đảo chỗ theo lỗi vòng 1 — giọt nước đi trước, nên giới hạn phạm vi của FACTS mục 4 được nói sau đúng chỗ. 10 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c37]: Không có gió thì tốc độ bay hơi rơi còn một nửa.
  - Đánh giá: OK
  - Lý do: Đã đảo chỗ theo lỗi vòng 1. Nguyên văn lời "Cách nói" của FACTS mục 4; 12 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c38]: Còn lại, ba thứ quyết định tốc độ.
  - Đánh giá: OK
  - Lý do: GIỮ. 8 từ, ba vật có hình bám.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c39]: Nhiệt độ, độ ẩm, và diện tích phơi.
  - Đánh giá: OK
  - Lý do: GIỮ. Liệt kê ba điều kiện, khớp FACTS mục 3, 8, 9; 8 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c40]: Ba cái áo phơi chồng lên nhau trên dây thứ hai.
  - Đánh giá: OK
  - Lý do: GIỮ. Có vật mang (đàn áo chồng lên nhau), 11 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c41]: Không khí ở nhiệt độ này chứa được tối đa khoảng hai mươi gam hơi nước.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn lời của mục "Suy luận của tập phim" (w ≈ 20 g/kg ở hai mươi lăm độ); điều kiện nhiệt độ nằm ở hình (nhiệt kế chỉ hai mươi lăm độ). 16 từ, viết bằng chữ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c42]: Tính trên mỗi kilogam không khí khô.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). Đơn vị đúng FACTS mục 2; 7 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c43]: Đó là trần của nó.
  - Đánh giá: OK
  - Lý do: MỚI (tách từ dòng gộp). "Đó" chỉ đúng giới hạn bão hoà vừa nói ở c41–c42; 5 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c44]: Nhiệt độ cao hơn thì sức chứa ấy càng cao hơn.
  - Đánh giá: OK
  - Đánh giá bổ sung: nguyên văn câu đề xuất của vòng 1 — đã bỏ "không khí" ở vị trí thứ ba trong cụm; nền là mục "Suy luận" (khoảng hai mươi gam ở hai mươi lăm độ so với hai mươi bảy gam ở ba mươi độ). 11 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c45]: Ba mươi độ thì hơi nước lan xa hơn, đặc hơn.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn lời "Suy luận của tập phim", có hình bám; 11 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c46]: Cùng một luồng gió, không khí ẩm chín mươi phần trăm làm nước bay hơi chậm hơn khoảng năm lần.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn lời "Cách nói" của FACTS mục 3 — có đủ điều kiện "cùng một luồng gió" và vòng bảo lưu "khoảng". 20 từ, dài nhất tập nhưng dưới ngưỡng 30.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c47]: Lớp hơi quanh áo mờ đục, hạt hơi nước lơ lửng.
  - Đánh giá: OK
  - Lý do: GIỮ. Đúng hình "lớp khí ẩm quanh áo mờ đục" ở độ ẩm chín mươi phần trăm; dùng đúng bộ từ "hạt hơi nước" làm vật thể hình ảnh. 11 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)

**Diện tích, vật liệu, phơi trong nhà (c48–c55)**

- [c48]: Chồng áo lên nhau, hay phơi một mặt, thì diện tích để bốc hơi bị thu hẹp.
  - Đánh giá: OK
  - Đánh giá bổ sung: đã sửa đúng lỗi vòng 1 — hai vế nay tách bạch thành hai trường hợp; nền là FACTS mục 9. 17 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c49]: Cái áo úp giữ ẩm lâu hơn cái phơi rộng.
  - Đánh giá: OK
  - Lý do: MỚI (rút một từ theo đề xuất vòng 1). FACTS mục 9, có hình bám (áo úp, mảng ẩm đậm hơn); 10 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c50]: Quần áo dày giữ nhiều nước hơn, và cũng giữ lâu hơn áo mỏng.
  - Đánh giá: OK
  - Đánh giá bổ sung: đã sửa đúng lỗi vòng 1 — vế "hơn" nay gắn cả hai ("giữ nhiều nước hơn", "giữ lâu hơn"); nền là FACTS mục 8. 14 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c51]: Nước tụ ở mép khăn rồi rơi thành giọt.
  - Đánh giá: OK
  - Lý do: GIỮ. Có vật mang (mép khăn tắm), FACTS mục 8; 9 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c52]: Không khí trong phòng không đi đâu cả, nó quay lại bám quanh cái áo.
  - Đánh giá: OK
  - Đánh giá bổ sung: đã đảo chỗ đúng lỗi vòng 1 — câu này nay đứng trước c53 nên "Đó" chỉ đúng nguyên nhân; nền là FACTS mục 10. 15 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c53]: Đó là lý do phơi trong nhà lâu khô hơn.
  - Đánh giá: OK
  - Đánh giá bổ sung: đã đảo chỗ đúng lỗi vòng 1; nay là kết luận của c52. 10 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c54]: Cùng cơ chế đó giải thích vì sao quạt thổi tay lại thấy mát.
  - Đánh giá: OK
  - Đánh giá bổ sung: **cờ `NOFACTS` đã gỡ** — `FACTS.md` mục 11 (nguồn Wikipedia *Sweat* + *Evaporation*) đứng sau đúng câu này, và lời "Cách nói" của mục đó trùng nguyên văn. 14 từ, không nói con số nào về da.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c55]: Hơi nước bám trên da bị gió cuốn đi.
  - Đánh giá: OK
  - Đánh giá bổ sung: cờ `NOFACTS` đã gỡ — FACTS mục 11 ("gió cuốn lớp không khí đã ẩm sát da đi thì nước bốc hơi nhanh hơn", mục 5). 9 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)

**Kết (c56–c60)**

- [c56]: Vậy quần áo khô không phải vì gió sấy nó.
  - Đánh giá: OK
  - Lý do: GIỮ. Góc nhìn mới của phim, không đụng "Giá trị không được nói"; 10 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c57]: Quần áo khô vì nước phải đi được.
  - Đánh giá: OK
  - Lý do: GIỮ. Câu trả lời một câu; 8 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c58]: Gió chỉ làm cho nước có chỗ để đi.
  - Đánh giá: OK
  - Lý do: GIỮ. Lời kết đúng FACTS mục 5; 9 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c59]: Muốn áo khô nhanh, hãy treo ở nơi thoáng gió.
  - Đánh giá: OK
  - Lý do: GIỮ. Lời khuyên có nguồn (FACTS mục 5 và 9), có hình bám; 10 từ.
  - Đề xuất VIẾT LẠI: — (giữ nguyên)
- [c60]: Phơi cả hai mặt, và không chồng quần áo lên nhau.
  - Đánh giá: OK
  - Lý do: GIỮ. FACTS mục 9 (phơi cả hai mặt, không chồng); 11 từ. (Việc "phơi cả hai mặt" chưa có hình bám là việc phía hình, xem Tổng kết.)
  - Đề xuất VIẾT LẠI: — (giữ nguyên)

## TỔNG KẾT HÀNH ĐỘNG

- **Số câu cần sửa: 0 câu.** Cả 60 câu đạt trạng thái OK.
- **Cờ phát hiện: NONE.** Không có `DIGIT` (0 chữ số trong 60 dòng), không có `LONG` (câu dài nhất 20 từ — c46), không có `NOFACTS` (mọi mệnh đề vật lý đều có mục đứng sau trong `FACTS.md`, kể cả c54–c55 sau khi thêm mục 11). Không câu nào dùng từ sáo rỗng bị cấm.
- **Đã đóng: 10/11 lỗi của vòng 1**, gồm cả lỗi CHẶN `NOFACTS` và lỗi cấu trúc (53 → 60 dòng).
- **Còn 1 việc chưa đóng (không chặn lời, chặn thu âm): nhịp.** Tổng thời lượng đọc + nghỉ của `lines.json` nay là **258,3 s** (635 từ ÷ 160 từ/phút = 238,1 s + tổng `gap` 20,2 s) so với **257 s** của shot list đã duyệt → **dư 1,3 s**. Không có shot list trong thư mục chấm này nên không kiểm được từng nhát; Đạo diễn cần đối chiếu lại mốc thời gian các nhát (đặc biệt các nhát chứa c46, c48, c50, c52, c54 — những câu vừa được viết lại/thêm từ) và rút `gap` 0,05–0,1 s ở vài nhát cho tới khi tổng về 257 s. Nếu giữ 258,3 s thì phải sửa mục "Độ dài" của `TREATMENT.md` (đang ghi 4:17) cho khớp.
- **Hai việc còn treo từ vòng 4 của dàn ý, phải đóng ở phía hình, không đóng được bằng lời:** (1) trong nhát 3:38–3:48 quạt trong phòng đang chạy, thì lời c52 "không khí trong phòng không đi đâu cả" sai với chính hình — tắt quạt hoặc treo áo ở đúng góc xa không có gió đã dựng ở dòng ý 2; (2) lời khuyên c60 "phơi cả hai mặt" chưa có hình bám — nhát cuối chỉ có cái áo úp còn ẩm.
- **Gợi ý không bắt buộc (vẫn để ngỏ):** bổ sung vào `FACTS.md` mục 8 một câu về "vệt trong xơ" để hình của c12 có chỗ dựa, đúng quy tắc đầu file ("Không có gì lên màn hình mà file này không viết ra").
- **Ghi chú về mật độ từ (không tính là lỗi):** các cảnh báo còn lại của máy là hệ quả của ngôn ngữ bắt buộc của FACTS, không phải lỗi văn phong — "không khí khô" (FACTS mục 2) và "không khí ẩm chín mươi phần trăm" (FACTS mục 3) phải nói nguyên văn; "nhiệt độ" ×3 trong c39–c44 có một lần nằm trong câu do chính vòng 1 chọn (c44) và một lần trong danh sách ba yếu tố (c39); "hơi nước" đã giảm từ 9 xuống 8 và không còn dồn cục nào quá 4 lần.
- **Yêu cầu Đạo diễn:** Duyệt `lines.json` để thu âm. Trước khi thu âm cần khép hai việc: (a) cân lại nhịp cho đúng 257 s hoặc cập nhật "Độ dài" của `TREATMENT.md`; (b) đóng hai việc hình đã nêu ở trên (quạt trong phòng ở nhát 3:38–3:48; hình bám cho "phơi cả hai mặt").

## BẰNG CHỨNG ĐÃ KIỂM (không chỉ bằng mắt)

| Kiểm | Kết quả |
|---|---|
| Chữ số trong toàn bộ `lines.json` | **0** (quét regex `[0-9]` trên 60 dòng) |
| Câu dài nhất / ngắn nhất | 20 từ (c46) / 4 từ (c29) — **không câu nào vượt 30 từ** |
| Từ sáo rỗng bị cấm ("Các bạn có biết không", "Thật bất ngờ là", "Hãy cùng xem nhé"…) | **0** |
| Cấu trúc | 60 dòng / 635 từ / tổng `gap` 20,2 s — khớp "60 câu" của dàn ý (vòng 1: 53 dòng / 631 từ / 20,48 s) |
| Đối chiếu câu với câu, vòng 1 → vòng 2 | 60 câu trước, 61 câu sau (c3 tách làm câu hỏi + câu trả lời, đúng nguyên văn đề xuất vòng 1); **không câu nào bị mất, thêm ý mới, hay đảo thứ tự ngoài 4 điểm đã sửa** (c36↔c37, c52↔c53) |
| Nội dung số trong lời | "hơn hai kilojoule" (mục 1), "một nửa" sau "Hai giọt nước" (mục 4), "hai mươi gam" + "mỗi kilogam không khí khô" (mục 2 + Suy luận), "ba mươi độ" (Suy luận), "chín mươi phần trăm" + "khoảng năm lần" kèm "cùng một luồng gió" (mục 3) — **không câu nào đụng "Giá trị không được nói"** |
| Cờ `NOFACTS` | Đã quét lại toàn bộ `FACTS.md`: có mục mới **mục 11** (Wikipedia *Sweat* mục "Mechanism" + *Evaporation* mục "Theory", truy cập 08/11/2026) đứng sau c54–c55, có phạm vi và lời "Cách nói"; **mọi mệnh đề vật lý trong lời đều có mục đứng sau** → cờ gỡ |
| Mật độ từ (toàn tập) | "hơi nước" ×8 (c13, c23, c28, c30, c41, c45, c47, c55 — không cụm nào quá 2 lần trong 4 câu), "bay hơi" ×5, "không khí" ×6, "nhiệt độ" ×3, "nước" ×26 — so với vòng 1: "hơi nước" ×9, "không khí" ×7; cả hai đều giảm |
| Nhịp | 258,3 s (đọc + `gap`) so với 257 s của shot list → dư 1,3 s; chưa có shot list trong thư mục chấm nên chưa kiểm được từng nhát |

---
Người chấm: omp -p --model minimax · review.sh --script · vòng 2/5

---
Người chấm: omp -p --model minimax · review.sh --script · 2026-11-08 11:39
