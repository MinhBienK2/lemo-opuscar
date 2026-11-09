VERDICT: REJECT
ROUND: 1/6
FLAGS_DETECTED: [NOFACTS]
CỜ BỔ SUNG (ngoài bốn cờ chuẩn): [CONSISTENCY, STRATEGY, STYLE]

> **Lưu ý về phạm vi kiểm tra.** Thư mục làm việc có `lines.json`, `FACTS.md`, `STRATEGY.md`, `TASK.md`,
> `SCRIPT-AUDIT.txt` — **không có bảng Ý → Hình**. Vì vậy tiêu chí "khớp 1:1 với dàn ý" **không kiểm
> chứng được trực tiếp**; tôi đã đối chiếu lời thoại với `FACTS.md` (mục 1–12, mục "Suy luận của tập phim",
> mục "Giá trị không được nói") và với `STRATEGY.md`. Phần "khớp 1:1" cần Đạo diễn đối chiếu với bảng ý → Hình.
>
> **Kiểm tra cơ học đã chạy:** không có ký tự số trong bất kỳ câu thoại nào (các chữ số chỉ nằm ở trường
> `id` và `gap` của `lines.json`, không được đọc lên); câu dài nhất ~15 từ, không câu nào vượt 30 từ; không có
> câu nào chứa "Các bạn có biết không", "Thật bất ngờ là", "Hãy cùng xem nhé". Ba cờ `DIGIT` và `LONG` **không bị bắt**.

## ĐÁNH GIÁ TỪNG CÂU

### Chương mở — trải nghiệm thật (c1–c6)

- [#1 / c1]: Điện thoại nằm sấp trên bàn cạnh giường, dây cắm thẳng vào ổ.
  - Đánh giá: OK
  - Lý do: Mở bằng trải nghiệm thật, không dùng thuật ngữ, không có tuyên bố nào cần nguồn.
- [#2 / c2]: Cái đồng hồ sạc trên màn hình cứ nhích lên từng chút một.
  - Đánh giá: OK
  - Lý do: Hình kể trước, lời theo sau. Không nêu con số.
- [#3 / c3]: Và cái máy này, mình vừa cầm lên.
  - Đánh giá: OK
  - Lý do: Giọng "mình" đúng chất người bạn tò mò. Dấu phẩy là cấu trúc chủ đề – vị ngữ, nghe được.
- [#4 / c4]: Ấm. Rõ ràng là nóng ở mặt lưng.
  - Đánh giá: OK
  - Lý do: Trải nghiệm thật, chưa tuyên bố nguyên nhân.
- [#5 / c5]: Vì sao điện thoại nóng lúc sạc?
  - Đánh giá: OK
  - Lý do: Câu hỏi trung tâm, đặt đúng chỗ.
- [#6 / c6]: Mình sẽ lần theo dòng điện, từ ổ cắm vào tận trong máy.
  - Đánh giá: OK
  - Lý do: Lời hứa hành trình, không hứa bí mận, không dạy.

### Quy luật chung (c7–c12)

- [#7 / c7]: Nhìn kỹ thì có một quy luật rất đơn giản.
  - Đánh giá: OK
  - Lý do: Mở mốc 1 (định luật Joule). Không đưa công thức lên hình, đúng `Cách nói` của mục 1.
- [#8 / c8]: Điện chạy vào nhiều hơn điện nạp được vào pin.
  - Đánh giá: OK
  - Lý do: Bám "Suy luận của tập phim" + mục 4 (bộ sạc thật có hiệu suất dưới 100 %, một phần điện vào thành nhiệt). Không nói tỉ lệ phần trăm — đúng lệnh cấm ở mục "Giá trị không được nói".
- [#9 / c9]: Phần điện không kịp nạp thì không biến mất đâu.
  - Đánh giá: OK
  - Lý do: Mục 1 (điện không mất, chuyển thành nhiệt).
- [#10 / c10]: Nó thành nhiệt.
  - Đánh giá: OK
  - Lý do: Kết của mốc 1. (Ghi chú: câu này bị lặp nguyên văn ở #93 — xem mục "Sửa" bên dưới.)
- [#11 / c11]: Hạt màu xanh này là dòng điện. Hạt đỏ tách ra, là nhiệt.
  - Đánh giá: OK
  - Lý do: Ẩn dụ vật lý có tải trọng (đúng tiêu chí 3 của STRATEGY), không phải ví von trang trí.
- [#12 / c12]: Vậy cứ đi theo dòng hạt xanh, xem nhiệt sinh ra ở đâu.
  - Đánh giá: OK
  - Lý do: Câu dẫn hành trình, đóng vai trò "bảng ý" cho cả chương.

### Củ sạc (c13–c24)

- [#13 / c13]: Ổ cắm này cấp điện, chạy qua dây nguồn vào củ sạc.
  - Đánh giá: OK
  - Lý do: Mở đường đi của dòng điện, đúng thứ tự vật lý.
- [#14 / c14]: Trên nhãn in ở vỏ ghi sáu mươi oát.
  - Đánh giá: OK
  - Lý do: Khớp `Cách nói` của mục 3 ("trên nhãn củ sạc ghi sáu mươi oát"). Viết bằng chữ, không viết "60W". Không nói "mọi củ sạc đều sáu mươi oát" — đúng giới hạn mục 3.
- [#15 / c15]: Nhiệm vụ của nó rất đơn giản.
  - Đánh giá: OK
  - Lý do: Nối mạch.
- [#16 / c16]: Đổi điện xoay chiều ở ổ thành điện một chiều.
  - Đánh giá: OK
  - Lý do: Đúng vai trò của một bộ sạc.
- [#17 / c17]: Mà việc đổi ấy, không bao giờ trọn vẹn.
  - Đánh giá: OK
  - Lý do: Nguyên văn `Cách nói` của mục 4.
- [#18 / c18]: Một phần điện bị thất thoát ngay trong lúc đi qua đó.
  - Đánh giá: OK
  - Lý do: Mục 4. Không nói con số hiệu suất (đúng lệnh cấm 93 %).
- [#19 / c19]: Đây là cuộn biến áp.
  - Đánh giá: **CẦN SỬA**
  - Lý do: **NOFACTS.** `FACTS.md` không có "cuộn biến áp" ở bất kỳ mục nào (đã kiểm tra: từ "biến áp"/"transformer" không xuất hiện trong file). Mục 4 chỉ cho phép nói rằng **một bộ sạc thật có hiệu suất dưới 100 %, nên một phần điện vào thành nhiệt ngay trong củ sạc** — chứ không định danh một linh kiện cụ thể là nơi xảy ra tổn hao. Câu này tự thêm một cơ chế không có nguồn, vi phạm luật của STRATEGY ("không tuyên bố… cái nào thiếu nguồn trong FACTS.md").
  - Đề xuất VIẾT LẠI: "Chỗ đổi điện ấy, nằm ngay trong củ sạc."
- [#20 / c20]: Chỗ dòng phải đi vòng qua nó, nó cọ vào dây.
  - Đánh giá: **CẦN SỬA**
  - Lý do: **NOFACTS + diễn đạt vật lý sai.** "Dòng phải đi vòng qua nó" mô tả sai nguyên lý biến áp (dòng chạy trong cuộn dây, điện áp sinh ra bằng cảm ứng từ từ thông), "nó cọ vào dây" là ẩn dụ dòng xoáy chưa có nguồn nào trong `FACTS.md` chống đỡ.
  - Đề xuất VIẾT LẠI: "Dòng điện đi qua đó, và một phần bị cản lại."
- [#21 / c21]: Cọ thì sinh nhiệt.
  - Đánh giá: **CẦN SỬA**
  - Lý do: **NOFACTS.** Kết của mệnh đề cơ chế không có nguồn (#20). Nếu bỏ "cọ", câu này sẽ trùng ý với #9–#10, nên cần viết lại theo hướng tổn hao → nhiệt.
  - Đề xuất VIẾT LẠI: "Hao hụt thành nhiệt."
- [#22 / c22]: Những hạt cam này, là phần điện bị thất thoát ở đây.
  - Đánh giá: **CẦN SỬA**
  - Lý do: **NOFACTS (phụ thuộc #19–#21)** + **STYLE.** Dấu phẩy cắt ngang chủ ngữ–vị ngữ, để lại "…, là" (đọc lên nghe như vấp). Hạt cam chỉ có nghĩa nếu cơ chế ở #19–#21 được sửa.
  - Đề xuất VIẾT LẠI: "Những hạt cam này là phần điện bị thất thoát ở đây."
- [#23 / c23]: Nó nóng lên ở vỏ củ sạc, và đó là chuyện bình thường.
  - Đánh giá: OK
  - Lý do: Đúng "Suy luận của tập phim" (nhiệt ở củ sạc tỏa ra ở chính vỏ củ sạc, không đi qua dây vào trong máy).
- [#24 / c24]: Nhưng một việc ấy thôi. Điện thoại thì phải làm nhiều hơn.
  - Đánh giá: OK
  - Lý do: Câu nối, không độn.

### Vào trong máy: mạch hạ điện áp (c25–c36)

- [#25 / c25]: Đây là điện thoại, bị cưa ngang.
  - Đánh giá: OK
  - Lý do: Chuyển nơi chốn, đúng cấu trúc "mỗi tầng một nơi" của STRATEGY.
- [#26 / c26]: Cổng USB-C nối vào bo mạch.
  - Đánh giá: OK
  - Lý do: Mục 3.
- [#27 / c27]: Bo mạch nối tới túi pin.
  - Đánh giá: OK
  - Lý do: Mô tả đường đi của dòng điện.
- [#28 / c28]: Cổng đưa vào hai mươi volt. Pin chỉ nhận được khoảng bốn volt.
  - Đánh giá: OK
  - Lý do: Khớp `Cách nói` của mục 3 ("cổng đưa vào hai mươi volt") và mục 2 ("pin chỉ nhận được khoảng bốn volt"). Không nói "4,2 V", không nói điện áp danh định, không nói "100 W", không nói "1,5 A" — đúng danh sách cấm.
- [#29 / c29]: Nên giữa đường, phải có một mạch hạ điện áp.
  - Đánh giá: OK
  - Lý do: Mục 3 nói thẳng "đó là lý do trong máy phải có mạch hạ điện áp".
- [#30 / c30]: Mạch đó là một con chip, một con tụ, và một cuộn cảm dây đồng.
  - Đánh giá: OK (có ghi chú)
  - Lý do: Cuộn cảm có nguồn (mục 5 và phần "Suy luận": "trong cùng một cuộn cảm"). Chip và tụ là chi tiết hình ảnh của mạch hạ điện áp, không kèm tuyên bố định lượng — chấp nhận được với điều kiện Đạo diễn đối chiếu bảng ý → Hình. *Ghi chú:* khác với cuộn biến áp ở #19–#21, danh sách linh kiện này không gán thêm một cơ chế sinh nhiệt mới.
- [#31 / c31]: Dòng chạy qua nó. Mà dây đồng thì có điện trở.
  - Đánh giá: OK
  - Lý do: Mục 1 (chỗ dòng bị cản bởi điện trở thì nóng).
- [#32 / c32]: Chỗ nào dòng điện bị cản, chỗ đó nóng.
  - Đánh giá: OK
  - Lý do: Nguyên văn `Cách nói` của mục 1.
- [#33 / c33]: Nhìn: hạt xanh chuyển sang cam ngay ở cuộn cảm.
  - Đánh giá: OK
  - Lý do: Ẩn dụ hạt, hình kể trước lời theo sau.
- [#34 / c34]: Đây là nơi sinh nhiệt thứ hai.
  - Đánh giá: OK
  - Lý do: Đếm chỗ nhiệt theo thứ tự, khớp "Suy luận" (mạch hạ điện áp → túi pin → chip).
- [#35 / c35]: Còn một phần dòng thì rơi xuống nạp vào pin.
  - Đánh giá: OK
  - Lý do: Mục 4 (điện đi qua nhiều tầng chuyển đổi rồi mới vào tế bào pin).
- [#36 / c36]: Phần này được giữ lại trong pin. Không mất.
  - Đánh giá: OK
  - Lý do: Câu ngắn, kết mạch.

### Máy đang chạy (c37–c41)

- [#37 / c37]: Nhưng máy không chỉ sạc. Máy đang chạy.
  - Đánh giá: OK
  - Lý do: Mở tầng thứ hai của cơ chế.
- [#38 / c38]: Màn hình sáng, tin nhắn, thông báo, game.
  - Đánh giá: OK
  - Lý do: Liệt kê tải việc, không dùng logo hay hình của người khác.
- [#39 / c39]: Tất cả chạy trên một con chip. Và con chip đó cũng nóng.
  - Đánh giá: OK
  - Lý do: Mục 1 + mục 4 (công suất tiêu thụ đi cùng nhiệt).
- [#40 / c40]: Đây là dòng thứ hai, chạy từ pin lên chip.
  - Đánh giá: OK
  - Lý do: Nhất quán với #36 và #39.
- [#41 / c41]: Vậy lúc vừa sạc vừa dùng, máy có hai chỗ sinh nhiệt cùng lúc.
  - Đánh giá: OK (có ghi chú)
  - Lý do: Nguyên văn `Cách nói` của mục 4. *Ghi chú Đạo diễn:* cụm "hai chỗ" ở đây và ở #90 đếm hai chỗ (mạch + chip), còn #52–#61 mới thêm túi pin thành ba chỗ. Người xem tinh ý có thể thắc mắc vì túi pin cũng nóng lúc sạc. Không bắt buộc phải sửa (FACTS.md chính là người viết câu này), nhưng xem lại #90.

### Sạc nhanh (c42–c51)

- [#42 / c42]: Còn một điều nữa: sạc nhanh.
  - Đánh giá: OK
  - Lý do: Mở tầng mới, không độn.
- [#43 / c43]: Sạc nhanh thì dòng điện lớn hơn nhiều.
  - Đánh giá: OK
  - Lý do: Nguyên văn `Cách nói` của mục 5. Không nói "năm lần", "bốn lần" — đúng giới hạn mục 5.
- [#44 / c44]: Máy vẫn nạp qua cùng một cuộn cảm đó.
  - Đánh giá: OK
  - Lý do: Phần "Suy luận" (cùng một cuộn cảm).
- [#45 / c45]: Trong cuộn cảm, nhiệt sinh ra theo bình phương dòng điện.
  - Đánh giá: OK
  - Lý do: Mục 1 (công suất nhiệt = điện trở × bình phương dòng điện). Không đưa công thức lên hình, không nói tỉ lệ phần trăm.
- [#46 / c46]: Nên dòng to hơn một chút, hạt đỏ nhiều hơn hẳn.
  - Đánh giá: **CẦN SỬA**
  - Lý do: **CONSISTENCY.** Vài câu trước (#43) đã nói dòng "lớn hơn **nhiều**", câu này lại nói dòng to hơn "**một chút**" — hai câu cạnh nhau nghe như tự mâu thuẫn. `Cách nói` của mục 5 cũng là "dòng điện to hơn". Giữ nguyên ý "hơn hẳn" của hạt đỏ.
  - Đề xuất VIẾT LẠI: "Nên dòng to hơn, mà hạt đỏ thì nhiều hơn hẳn."
- [#47 / c47]: Có máy có cảm biến nhiệt đặt trong pin.
  - Đánh giá: OK
  - Lý do: Mục 6. Câu này **có chèn "Có máy có"**, nghĩa là không nói "mọi điện thoại đều có" — đúng lệnh của mục 6 ("không nói mọi máy đều có"). Dạng lường hơn `Cách nói` gốc, vẫn hợp lệ và an toàn hơn.
- [#48 / c48]: Cảm biến đó đo nhiệt độ của pin.
  - Đánh giá: OK
  - Lý do: Mục 6 (NTC / cảm biến nhiệt trong bộ pin).
- [#49 / c49]: Quanh bốn mươi lăm độ, tế bào pin không nên sạc nữa.
  - Đánh giá: OK
  - Lý do: Khớp `Cách nói` của mục 7. Viết bằng chữ. Không nói "máy sẽ tự tắt", không nói "nguy hiểm".
- [#50 / c50]: Vạch đỏ đó là mốc của tế bào pin, không phải nhiệt độ mặt lưng.
  - Đánh giá: OK
  - Lý do: Đúng phần "Phạm vi" của mục 7 (45 °C là mốc của tế bào, không phải nhiệt độ bề mặt). Câu này cũng chặn đúng giá trị bị cấm "50 °C".
- [#51 / c51]: Nóng quá thì máy tự giảm dòng sạc.
  - Đánh giá: OK
  - Lý do: Mục 6. Không nói ngưỡng nhiệt độ cụ thể mà máy dùng — đúng giới hạn mục 7.

### Túi pin (c52–c60)

- [#52 / c52]: Ngoài hai chỗ ấy, còn một chỗ nữa: chính là túi pin.
  - Đánh giá: OK
  - Lý do: Khớp "Suy luận" (ba chỗ sinh nhiệt trong máy).
- [#53 / c53]: Cả cái túi là nhiều lớp mỏng xếp chồng.
  - Đánh giá: OK
  - Lý do: Mục 12, đúng `Cách nói`.
- [#54 / c54]: Đồng, graphite, lớp cách điện, rồi nhôm.
  - Đánh giá: OK
  - Lý do: Mục 12 (đồng/graphite/lớp cách điện/nhôm). Không xếp hạng nhiệt giữa các lớp — đúng giới hạn mục 12.
- [#55 / c55]: Mỏng như tờ giấy, và dính sát vào nhau.
  - Đánh giá: OK
  - Lý do: Hình ảnh đúng cấu trúc tế bào.
- [#56 / c56]: Trong lúc nạp, dòng điện bị điện trở bên trong tế bào cản lại.
  - Đánh giá: OK
  - Lý do: Nguyên văn `Cách nói` của mục 12.
- [#57 / c57]: Cản lại thì sinh nhiệt, ngay ở trong pin.
  - Đánh giá: OK
  - Lý do: Mục 12 (nhiệt ohmic và nhiệt phản ứng bên trong tế bào).
- [#58 / c58]: Nhiệt ấy không thoát ra ngoài được.
  - Đánh giá: OK
  - Lý do: Mục 2 ("nhiệt sinh ra trong pin, không thoát ra ngoài được").
- [#59 / c59]: Nó lan đều trong túi pin, làm cả cục pin ấm lên.
  - Đánh giá: OK
  - Lý do: Mục 2 (điện trở bên trong tế bào làm pin ấm lên). Không nói tỉ lệ nhiệt giữa các lớp.
- [#60 / c60]: Giờ gom lại: mạch sạc, cục pin, và con chip.
  - Đánh giá: OK
  - Lý do: Khớp "Suy luận" (ba chỗ sinh nhiệt).

### Nhiệt thoát ra (c61–c70)

- [#61 / c61]: Cả ba cùng đổ nhiệt vào một chỗ.
  - Đánh giá: OK
  - Lý do: Đúng "Suy luận" (cả ba nằm trong vỏ máy).
- [#62 / c62]: Đó là vỏ máy.
  - Đánh giá: OK
  - Lý do: Câu chốt, đúng hình.
- [#63 / c63]: Vỏ máy là tản nhiệt của cả cái máy.
  - Đánh giá: OK
  - Lý do: Mục 8.
- [#64 / c64]: Nó nóng lên, rồi tỏa ra không khí.
  - Đánh giá: OK
  - Lý do: Nguyên văn `Cách nói` của mục 8. Không nói "nhanh gấp mấy lần", không đưa hệ số truyền nhiệt lên hình.
- [#65 / c65]: Nên lưng máy nóng.
  - Đánh giá: OK
  - Lý do: Khớp "Suy luận" (nhiệt đi ra là đi qua lưng máy).
- [#66 / c66]: Tay người là một miếng tản nhiệt lớn hơn không khí nhiều.
  - Đánh giá: OK
  - Lý do: Nguyên văn `Cách nói` của mục 9. Đây là suy luận của tập phim (mục 9 tự ghi rõ), và lời thoại không có con số nào đi kèm — đúng giới hạn "không nói mấy lần".
- [#67 / c67]: Cầm lên là thấy nóng ngay.
  - Đánh giá: OK
  - Lý do: `Cách nói` của mục 9.
- [#68 / c68]: Còn cái ốp case thì giống một chiếc áo khoác giữ nhiệt.
  - Đánh giá: OK
  - Lý do: Ẩn dụ **có tải trọng** — chính là hình vật cho cơ chế "lớp chặn nhiệt" của mục 10, không phải vívon trang trí.
- [#69 / c69]: Nó giữ nhiệt lại quanh máy, không cho nhiệt thoát ra.
  - Đánh giá: OK
  - Lý do: Nguyên văn `Cách nói` của mục 10.
- [#70 / c70]: Nên máy có case sẽ nóng hơn máy không case.
  - Đánh giá: OK
  - Lý do: Nguyên văn `Cách nói` của mục 10. Không nói chênh lệch bao nhiêu độ, không nói case tự sinh nhiệt — đúng giới hạn mục 10.

### Thí nghiệm ốp case (c71–c76)

- [#71 / c71]: Mình thử: hai chiếc máy giống nhau, cùng sạc, cùng một chỗ.
  - Đánh giá: OK
  - Lý do: Đúng phần "Suy luận" (hai máy giống nhau, khác nhau ở đường thoát nhiệt).
- [#72 / c72]: Cái này có case, cái kia không.
  - Đánh giá: OK
  - Lý do: Một câu, hai hình.
- [#73 / c73]: Nhiệt kế đặt trên lưng mỗi cái.
  - Đánh giá: OK
  - Lý do: Thiết bị đo có trong khung.
- [#74 / c74]: Cột nhiệt kế này dốc lên nhanh hơn.
  - Đánh giá: OK
  - Lý do: Đọc hình, không đưa số.
- [#75 / c75]: Cái kia dốc lên chậm hơn.
  - Đánh giá: OK
  - Lý do: Đọc hình, không đưa số.
- [#76 / c76]: Cái này là đo được, không phải đoán.
  - Đánh giá: OK
  - Lý do: Mục 10 ghi rõ "Câu 'đo được' trong phim là thí nghiệm dàn dựng trong khung" — lời thoại không gán con số cho bài báo. Đúng giới hạn.

### Quay lại và kết luận (c77–c95)

- [#77 / c77]: Mình quay lại cái bàn cạnh giường.
  - Đánh giá: OK
  - Lý do: Khép vòng, quay lại khung mở đầu.
- [#78 / c78]: Cái máy vẫn cắm sạc, màn hình vẫn sáng, và nó vẫn nóng.
  - Đánh giá: OK
  - Lý do: Hình kể trước lời theo sau.
- [#79 / c79]: Vậy cái nóng lúc sạc là bình thường.
  - Đánh giá: OK
  - Lý do: Mục 11.
- [#80 / c80]: Đó là máy đang làm việc, không phải máy đang hỏng.
  - Đánh giá: OK
  - Lý do: Mục 11; không chẩn đoán lỗi phần cứng.
- [#81 / c81]: Có một loại nóng khác, loại này mới đáng lo.
  - Đánh giá: OK
  - Lý do: Mục 11 ("có một loại nóng khác"). "Đáng lo" là cảnh báo nhẹ, không phải dọa, vẫn trong giọng kể.
- [#82 / c82]: Nóng khi không cắm sạc.
  - Đánh giá: OK
  - Lý do: `Cách nói` của mục 11.
- [#83 / c83]: Hoặc nóng lệch một chỗ, ở một góc lưng máy.
  - Đánh giá: OK
  - Lý do: Mục 11.
- [#84 / c84]: Lúc đó thì mình không tự đoán được nguyên nhân.
  - Đánh giá: OK
  - Lý do: Tuân thủ luật "không chẩn đoán" của STRATEGY và `Cách nói` của mục 11.
- [#85 / c85]: Còn với cái nóng lúc sạc, mình làm được mấy việc.
  - Đánh giá: OK
  - Lý do: Mở phần việc làm được — đúng tiêu chí 4 của bộ lọc đề tài ("một việc làm ngay").
- [#86 / c86]: Sạc lâu thì bỏ ốp case ra.
  - Đánh giá: OK
  - Lý do: Hành động rút ra từ cơ chế ốp case (mục 10). "Lâu" không phải con số, không vi phạm danh sách cấm.
- [#87 / c87]: Dùng củ sạc đúng chuẩn của máy.
  - Đánh giá: OK
  - Lý do: Hành động hợp lý; không nói chuẩn cụ thể nào (không vi phạm lệnh cấm "100 W" và không nói mọi củ sạc đều sáu mươi oát).
- [#88 / c88]: Sạc chậm thì dòng vào máy ít hơn.
  - Đánh giá: OK
  - Lý do: Mục 5.
- [#89 / c89]: Đừng vừa sạc vừa chơi game.
  - Đánh giá: OK
  - Lý do: Khuyến nghị hành động, không chẩn đoán.
- [#90 / c90]: Vì lúc đó máy có hai chỗ sinh nhiệt cùng lúc.
  - Đánh giá: OK (có ghi chú)
  - Lý do: Nguyên văn `Cách nói` của mục 4. *Ghi chú Đạo diễn:* cùng cụm với #41 nhưng lặp lại ở chỗ kết luận; xem lại nếu muốn tránh cảm giác "đếm lại" sau khi phim đã nói có ba chỗ sinh nhiệt trong máy (#60–#61). Có thể dùng: "Vì lúc đó máy vừa sạc vừa chạy, nhiệt dồn vào cùng một chỗ."
- [#91 / c91]: Và nếu máy nóng bất thường, rút sạc ra, mang đi kiểm tra.
  - Đánh giá: OK
  - Lý do: `Cách nói` của mục 11. Không nói "hỏng pin", "lỗi phần cứng", "chết máy".
- [#92 / c92]: Một phần điện không nạp được thì phải đi đâu.
  - Đánh giá: **CẦN SỬA**
  - Lý do: **STRATEGY (độn).** Câu này dựng lại đúng ý đã nói ở #9–#10 ("Phần điện không kịp nạp… / Nó thành nhiệt") và #18. STRATEGY: "mỗi ý một lần; không kéo dài bằng nhắc lại". Ở cuối tập, đoạn này dài thêm nhưng không thêm thông tin nào.
  - Đề xuất VIẾT LẠI: **Phương án A (khuyến nghị): bỏ hẳn #92 và #93**, mở thẳng bằng "Máy không hỏng." — đoạn kết còn mạnh hơn. **Phương án B (giữ hai câu, đổi thành hỏi–đáp để không lặp):** #92 → "Cái nóng ấy, từ đâu mà ra?" / #93 → "Từ phần điện không nạp được vào pin."
- [#93 / c93]: Nó thành nhiệt. Và nhiệt thì tỏa ra.
  - Đánh giá: **CẦN SỬA**
  - Lý do: **STRATEGY (lặp) + STYLE.** "Nó thành nhiệt." là **nguyên văn #10**; "nhiệt thì tỏa ra" đã nói ở #64 ("rồi tỏa ra không khí"). Hai mệnh đề đều là lặp, không thêm ý.
  - Đề xuất VIẾT LẠI: xem #92 (Phương án A: cắt; Phương án B: "Từ phần điện không nạp được vào pin.").
- [#94 / c94]: Máy không hỏng.
  - Đánh giá: OK
  - Lý do: Đúng tinh thần mục 11 và luật "không chẩn đoán".
- [#95 / c95]: Nó đang làm việc.
  - Đánh giá: OK
  - Lý do: Câu chốt, trả lời trọn câu hỏi.

## TỔNG KẾT HÀNH ĐỘNG

- **Số câu cần sửa: 7 câu** — #19 (c19), #20 (c20), #21 (c21), #22 (c22), #46 (c73), #92 (c92), #93 (c93).

### Nhóm 1 — Cờ NOFACTS: cơ chế không có nguồn trong `FACTS.md` (4 câu: #19, #20, #21, #22)

Đây là vấn đề nghiêm trọng nhất của tập. `FACTS.md` mục 4 chỉ cho phép nói rằng "một bộ sạc thật có hiệu suất dưới 100 %, nên một phần điện vào thành nhiệt ngay trong củ sạc", và `Cách nói` cố định là câu #17 ("việc đổi ấy không bao giờ trọn vẹn"). Lời thoại hiện tại đã đi xa hơn: nó **định danh một linh kiện** ("cuộn biến áp") và **gán một cơ chế** ("dòng phải đi vòng qua nó, nó cọ vào dây" → "cọ thì sinh nhiệt"). "Cuộn biến áp" không xuất hiện ở bất kỳ mục nào trong `FACTS.md`; cơ chế dòng xoáy/cọ xát cũng vậy. Việc này vi phạm đồng thời tiêu chí 5 của bản thảm định và luật của STRATEGY ("không tuyên bố… cái nào thiếu nguồn trong FACTS.md").
Ngoài ra "dòng phải đi vòng qua nó" mô tả sai nguyên lý biến áp, và "nó cọ vào dây" là ẩn dụ dòng xoáy không có nguồn chống đỡ.

**Đề xuất gộp bốn câu thành bốn câu mới, bám sát mục 4:**

> #19: "Chỗ đổi điện ấy, nằm ngay trong củ sạc."
> #20: "Dòng điện đi qua đó, và một phần bị cản lại."
> #21: "Hao hụt thành nhiệt."
> #22: "Những hạt cam này là phần điện bị thất thoát ở đây."

**Lưu ý cho Đạo diễn:** nếu bảng ý → Hình đã dựng cảnh cuộn biến áp, thì phải sửa **cả hình** chứ không chỉ sửa lời — không được để lời kể một cơ chế không có nguồn. Hoặc giữ hình, nhưng đổi lời thành mức trung tính ("một phần điện bị thất thoát trong củ sạc" — đúng mục 4).

### Nhóm 2 — Cờ CONSISTENCY (1 câu: #46)

"Sạc nhanh thì dòng điện lớn hơn nhiều" (#43) rồi đến "dòng to hơn một chút" (#46) là hai câu cạnh nhau tự mâu thuẫn về mức tăng của dòng điện, trong khi `Cách nói` của mục 5 là "dòng điện to hơn". Sửa #46 thành: **"Nên dòng to hơn, mà hạt đỏ thì nhiều hơn hẳn."**

### Nhóm 3 — Cờ STRATEGY (2 câu: #92, #93)

Hai câu kết chỉ dựng lại ý đã nói ở #9–#10 và #64, với "Nó thành nhiệt." lặp nguyên văn #10. Theo STRATEGY ("mỗi ý một lần; không kéo dài bằng nhắc lại"), cắt #92–#93 và mở thẳng bằng "Máy không hỏng." / "Nó đang làm việc." — hoặc đổi thành cặp hỏi–đáp đã nêu ở trên.

### Những điểm ĐÃ ĐẠT (không cần sửa)

- **Không có chữ số** trong toàn bộ lời thoại: sáu mươi oát, hai mươi volt, bốn volt, bốn mươi lăm độ đều viết bằng chữ. Không vi phạm bất kỳ giá trị nào trong danh sách cấm (90 %, 93 %, 50 °C, 3 giờ, 1,5 A, 100 W) — kể cả các giá trị bị cấm chỉ xuất hiện dưới dạng nói tránh ("một phần điện", "không nói phần trăm nào").
- **Độ dài câu**: câu dài nhất ~15 từ, không câu nào vượt 30 từ, không câu ghép nhiều mệnh đề phụ. Nhịp kể ngắn, đúng nhịp video.
- **Văn phong**: không có từ đệm sáo rỗng nào trong danh sách cấm; giọng kể giữ đúng vai "mình" của người bạn tò mò, không giảng bài, không dọa, không hứa bí mận; không chẩn đoán, không kê thuốc, không khuyên đầu tư.
- **Mật độ con số**: 4 con số trên màn hình trên một tập ~7–8 phút — thấp hơn nhiều so với giới hạn "hai con số mỗi phút" của STRATEGY.
- **Chuỗi nhân quả** đóng kín: ổ cắm → dây → củ sạc → cổng USB-C → mạch hạ điện áp → túi pin → chip → vỏ máy → tay người, và trả lời trọn câu hỏi "vì sao nóng lúc sạc".

### Yêu cầu Đạo diễn

Duyệt sửa **7 câu** nêu trên (ưu tiên nhóm 1 — cờ NOFACTS), hoặc phản biện lý do chuyên môn cho từng câu. Riêng nhóm 1, nếu phản biện rằng cơ chế "cuộn biến áp / dòng xoáy" được chấp nhận, thì cần bổ sung mốc có nguồn sơ cấp vào `FACTS.md` trước — vì hiện tại `FACTS.md` **không có mốc nào** đứng sau câu thoại này.

Ngoài ra, hai việc cần người khác xử lý, không thuộc phạm vi chấm lời thoại:
1. **Đối chiếu bảng ý → Hình** — bảng này không có trong thư mục làm việc nên tiêu chí "khớp 1:1 với dàn ý" chưa được kiểm chứng. Nếu bảng ý → Hình có cảnh cuộn biến áp thì hình và lời phải sửa cùng lúc (xem Nhóm 1).
2. **`ROUND`** — không có `review.sh` trong thư mục nên số vòng phải do người chạy điền; tôi không tự điền.

---
Người chấm: claude -p (model mặc định của claude) · review.sh --script · 2026-11-09 08:57
