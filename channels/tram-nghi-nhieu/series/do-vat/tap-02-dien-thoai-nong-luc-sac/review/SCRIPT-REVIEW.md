VERDICT: PASS
ROUND: 2/6
FLAGS_DETECTED: [NONE]

> **Ghi chú về phạm vi kiểm tra (vòng 2).** Thư mục làm việc vẫn **không có bảng Ý → Hình**, nên tiêu chí
> "khớp 1:1 với dàn ý" chưa kiểm chứng được trực tiếp; tôi đối chiếu lời thoại với `FACTS.md` (mục 1–12,
> mục "Suy luận của tập phim", mục "Giá trị không được nói") và `STRATEGY.md`. Phần "khớp 1:1" cần Đạo diễn
> đối chiếu tay.
>
> **Kiểm tra cơ học đã chạy:** trong 93 câu thoại **không có ký tự số** (chữ số chỉ nằm ở trường `id` và
> `gap` của `lines.json`, không được đọc lên); câu dài nhất ~13 từ, không câu nào vượt 30 từ; không có câu
> nào chứa "Các bạn có biết không", "Thật bất ngờ là", "Hãy cùng xem nhé"; không có giá trị nào trong danh
> sách cấm (90 %, 93 %, 50 °C, 3 giờ, 1,5 A, 100 W). Ba cờ `DIGIT`, `LONG` và `NOFACTS` **không bị bắt**.

## ĐỐI CHIẾU VỚI PREVIOUS.md (7 lỗi lần trước)

| # | Lần trước | Chữ hiện tại | Trạng thái |
|---|---|---|---|
| 19 | NOFACTS ("cuộn biến áp") | "Chỗ đổi điện ấy, nằm ngay trong củ sạc." | **Đã sửa đúng** (nguyên văn câu VIẾT LẠI) |
| 20 | NOFACTS + diễn đạt sai ("dòng xoáy") | "Dòng chạy qua đó, và một phần bị cản lại." | **Đã sửa** (rút gọn từ câu VIẾT LẠI) |
| 21 | NOFACTS ("cọ thì sinh nhiệt") | "Hao hụt thành nhiệt." | **Đã sửa đúng** (nguyên văn câu VIẾT LẠI) |
| 22 | NOFACTS (phụ thuộc 19–21) + STYLE | "Những hạt cam này, là phần điện bị thất thoát ở đây." | **Đã sửa phần chặn**: cơ chế 19–21 giờ bám đúng mục 4, hạt cam đã có nguồn. Dấu phẩy còn lại là nhịp dừng đã dùng xuyên suốt (xem #11) → ghi nhận, không chặn |
| 46 | CONSISTENCY ("dòng to hơn một chút") | "Nên dòng to hơn, mà hạt đỏ thì nhiều hơn hẳn." | **Đã sửa đúng** (nguyên văn câu VIẾT LẠI) |
| 92 (cũ) | STRATEGY (dựng lại ý #9–#10) | **đã cắt** | **Đã sửa** (Phương án A) |
| 93 (cũ) | STRATEGY + STYLE (lặp nguyên văn #10) | **đã cắt** | **Đã sửa** (Phương án A) |

Ngoài ra: **cũ c92–c93 bị cắt**, đoạn kết nay đi thẳng từ "Và nếu máy nóng bất thường, rút sạc ra, mang đi
kiểm tra." → "Máy không hỏng." → "Nó đang làm việc." — đúng Phương án A, không còn lặp ý.

## ĐÁNH GIÁ TỪNG CÂU

### Chương mở — trải nghiệm thật (c1–c6)

- [c1]: Điện thoại nằm sấp trên bàn cạnh giường, dây cắm thẳng vào ổ.
  - Đánh giá: OK
  - Lý do: GIỮ (lần trước OK, chữ không đổi). Mở bằng trải nghiệm thật, không thuật ngữ, không tuyên bố cần nguồn.
- [c2]: Cái đồng hồ sạc trên màn hình cứ nhích lên từng chút một.
  - Đánh giá: OK
  - Lý do: GIỮ. Hình kể trước, lời theo sau; không nêu con số.
- [c3]: Và cái máy này, mình vừa cầm lên.
  - Đánh giá: OK
  - Lý do: GIỮ. Giọng "mình" đúng người bạn tò mò.
- [c4]: Ấm. Rõ ràng là nóng ở mặt lưng.
  - Đánh giá: OK
  - Lý do: GIỮ. Trải nghiệm thật, chưa tuyên bố nguyên nhân.
- [c5]: Vì sao điện thoại nóng lúc sạc?
  - Đánh giá: OK
  - Lý do: GIỮ. Câu hỏi trung tâm, đặt đúng chỗ.
- [c6]: Mình sẽ lần theo dòng điện, từ ổ cắm vào tận trong máy.
  - Đánh giá: OK
  - Lý do: GIỮ. Lời hứa hành trình, không hứa bí mận, không dạy.

### Quy luật chung (c7–c12)

- [c7]: Nhìn kỹ thì có một quy luật rất đơn giản.
  - Đánh giá: OK
  - Lý do: GIỮ. Mở mốc 1 (định luật Joule), không đưa công thức lên hình.
- [c8]: Điện chạy vào nhiều hơn điện nạp được vào pin.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 4 + "Suy luận của tập phim"; không nói tỉ lệ phần trăm — đúng lệnh cấm.
- [c9]: Phần điện không kịp nạp thì không biến mất đâu.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 1.
- [c10]: Nó thành nhiệt.
  - Đánh giá: OK
  - Lý do: GIỮ. Kết của mốc 1; lần trước ghi chú "bị lặp ở #93 cũ" — #93 cũ đã bị cắt nên lặp đã hết.
- [c11]: Hạt màu xanh này là dòng điện. Hạt đỏ tách ra, là nhiệt.
  - Đánh giá: OK
  - Lý do: GIỮ. Ẩn dụ vật lý có tải trọng. Dấu phẩy trước "là nhiệt" là nhịp dừng để dồn chữ "nhiệt" — cùng kiểu nhịp đã dùng ở c17, c19, c29, c49, c60; tôi chấp nhận nhịp này xuyên suốt tập, nên c22 cũng phải được đối xử như nhau.
- [c12]: Vậy cứ đi theo dòng hạt xanh, xem nhiệt sinh ra ở đâu.
  - Đánh giá: OK
  - Lý do: GIỮ. Câu dẫn hành trình, đóng vai "bảng ý" cho cả chương.

### Củ sạc (c13–c24)

- [c13]: Ổ cắm này cấp điện, chạy qua dây nguồn vào củ sạc.
  - Đánh giá: OK
  - Lý do: GIỮ. Đúng thứ tự vật lý.
- [c14]: Trên nhãn in ở vỏ ghi sáu mươi oát.
  - Đánh giá: OK
  - Lý do: GIỮ. Khớp `Cách nói` mục 3; viết bằng chữ; không nói "mọi củ sạc đều sáu mươi oát".
- [c15]: Nhiệm vụ của nó rất đơn giản.
  - Đánh giá: OK
  - Lý do: GIỮ. Nối mạch.
- [c16]: Đổi điện xoay chiều ở ổ thành điện một chiều.
  - Đánh giá: OK
  - Lý do: GIỮ. Đúng vai trò của một bộ sạc.
- [c17]: Mà việc đổi ấy, không bao giờ trọn vẹn.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn `Cách nói` mục 4.
- [c18]: Một phần điện bị thất thoát ngay trong lúc đi qua đó.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 4; không nói con số hiệu suất (đúng lệnh cấm 93 %).
- [c19]: Chỗ đổi điện ấy, nằm ngay trong củ sạc.
  - Đánh giá: OK
  - Lý do: THEO-BẠN — nguyên văn câu VIẾT LẠI lần trước. Cơ chế "cuộn biến áp" đã bị gỡ, câu này chỉ nói đúng điều `FACTS.md` cho phép: chỗ đổi điện nằm trong củ sạc, không định danh linh kiện nào không có nguồn.
- [c20]: Dòng chạy qua đó, và một phần bị cản lại.
  - Đánh giá: OK
  - Lý do: MỚI (rút từ câu VIẾT LẠI "Dòng điện đi qua đó…"). Bám đúng mục 1 ("chỗ nào dòng điện bị cản bởi điện trở thì chỗ đó nóng") + mục 4; không gán cơ chế mới, không cần nguồn nào thêm.
- [c21]: Hao hụt thành nhiệt.
  - Đánh giá: OK
  - Lý do: THEO-BẠN — nguyên văn câu VIẾT LẠI lần trước. Khớp `Cách nói` mục 4 ("một phần điện vào thành nhiệt ngay trong củ sạc").
- [c22]: Những hạt cam này, là phần điện bị thất thoát ở đây.
  - Đánh giá: OK
  - Lý do: CHƯA-SỬA — **đã sửa đúng phần chặn**. Lần trước lỗi nằm ở chỗ câu này dựa trên cơ chế cũ (cuộn biến áp / dòng xoáy) không có nguồn; nay c19–c21 đã bám mục 4 nên "hạt cam = phần điện bị thất thoát thành nhiệt trong củ sạc" có nguồn. Dấu phẩy trước "là" là nhịp dừng nhấn mạnh, cùng kiểu với c11 (lần trước đã OK và chữ không đổi), c17, c19, c29 — theo tính nhất quán, không coi là lỗi chặn. *Ghi chú không chặn cho Đạo diễn:* nếu muốn câu này trắc hơn, bỏ dấu phẩy: "Những hạt cam này là phần điện bị thất thoát ở đây."
- [c23]: Nó nóng lên ở vỏ củ sạc, và đó là chuyện bình thường.
  - Đánh giá: OK
  - Lý do: GIỮ. Đúng "Suy luận của tập phim" (nhiệt ở củ sạc tỏa ra ở chính vỏ củ sạc, không đi qua dây vào trong máy).
- [c24]: Nhưng một việc ấy thôi. Điện thoại thì phải làm nhiều hơn.
  - Đánh giá: OK
  - Lý do: GIỮ. Câu nối, không độn.

### Vào trong máy: mạch hạ điện áp (c25–c36)

- [c25]: Đây là điện thoại, bị cưa ngang.
  - Đánh giá: OK
  - Lý do: GIỮ. Chuyển nơi chốn, đúng cấu trúc "mỗi tầng một nơi".
- [c26]: Cổng USB-C nối vào bo mạch.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 3.
- [c27]: Bo mạch nối tới túi pin.
  - Đánh giá: OK
  - Lý do: GIỮ. Mô tả đường đi của dòng điện.
- [c28]: Cổng đưa vào hai mươi volt. Pin chỉ nhận được khoảng bốn volt.
  - Đánh giá: OK
  - Lý do: GIỮ. Khớp `Cách nói` mục 3 và mục 2. Không nói "4,2 V", "3,7 V", "100 W", "1,5 A" — đúng danh sách cấm.
- [c29]: Nên giữa đường, phải có một mạch hạ điện áp.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 3 nói thẳng "đó là lý do trong máy phải có mạch hạ điện áp".
- [c30]: Mạch đó là một con chip, một con tụ, và một cuộn cảm dây đồng.
  - Đánh giá: OK
  - Lý do: GIỮ. Cuộn cảm có nguồn (mục 5 + "Suy luận"); chip và tụ là chi tiết hình ảnh, không gán thêm cơ chế sinh nhiệt mới. *Ghi chú Đạo diễn (không chặn, đã nêu lần trước):* danh sách linh kiện này cần đối chiếu với bảng Ý → Hình.
- [c31]: Dòng chạy qua nó. Mà dây đồng thì có điện trở.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 1.
- [c32]: Chỗ nào dòng điện bị cản, chỗ đó nóng.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn `Cách nói` mục 1.
- [c33]: Nhìn: hạt xanh chuyển sang cam ngay ở cuộn cảm.
  - Đánh giá: OK
  - Lý do: GIỮ. Ẩn dụ hạt, hình kể trước lời theo sau.
- [c34]: Đây là nơi sinh nhiệt thứ hai.
  - Đánh giá: OK
  - Lý do: GIỮ. Đếm chỗ nhiệt theo thứ tự, khớp "Suy luận" (mạch hạ điện áp → túi pin → chip).
- [c35]: Còn một phần dòng thì rơi xuống nạp vào pin.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 4 (điện đi qua nhiều tầng chuyển đổi rồi mới vào tế bào pin).
- [c36]: Phần này được giữ lại trong pin. Không mất.
  - Đánh giá: OK
  - Lý do: GIỮ. Câu ngắn, kết mạch.

### Máy đang chạy (c37–c41)

- [c37]: Nhưng máy không chỉ sạc. Máy đang chạy.
  - Đánh giá: OK
  - Lý do: GIỮ. Mở tầng thứ hai của cơ chế.
- [c38]: Màn hình sáng, tin nhắn, thông báo, game.
  - Đánh giá: OK
  - Lý do: GIỮ. Liệt kê tải việc, không dùng logo hay hình người khác.
- [c39]: Tất cả chạy trên một con chip. Và con chip đó cũng nóng.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 1 + mục 4 (công suất tiêu thụ đi cùng nhiệt).
- [c40]: Đây là dòng thứ hai, chạy từ pin lên chip.
  - Đánh giá: OK
  - Lý do: GIỮ. Nhất quán với c36 và c39.
- [c41]: Vậy lúc vừa sạc vừa dùng, máy có hai chỗ sinh nhiệt cùng lúc.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn `Cách nói` mục 4. *Ghi chú Đạo diễn (không chặn, đã nêu lần trước, chữ không đổi):* cụm "hai chỗ" ở đây và ở c90 đếm hai chỗ (mạch + chip), còn c50–c51 mới thêm túi pin thành ba chỗ.

### Sạc nhanh (c69–c78)

- [c69]: Còn một điều nữa: sạc nhanh.
  - Đánh giá: OK
  - Lý do: GIỮ. Mở tầng mới, không độn.
- [c70]: Sạc nhanh thì dòng điện lớn hơn nhiều.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn `Cách nói` mục 5. Không nói "năm lần", "bốn lần".
- [c71]: Máy vẫn nạp qua cùng một cuộn cảm đó.
  - Đánh giá: OK
  - Lý do: GIỮ. Phần "Suy luận" (cùng một cuộn cảm).
- [c72]: Trong cuộn cảm, nhiệt sinh ra theo bình phương dòng điện.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 1 (công suất nhiệt = điện trở × bình phương dòng điện). Không đưa công thức lên hình, không nói tỉ lệ phần trăm.
- [c73]: Nên dòng to hơn, mà hạt đỏ thì nhiều hơn hẳn.
  - Đánh giá: OK
  - Lý do: THEO-BẠN — nguyên văn câu VIẾT LẠI lần trước. Cờ CONSISTENCY đã được gỡ: không còn mâu thuẫn "lớn hơn nhiều" (c70) với "to hơn một chút"; "hơn hẳn" của hạt đỏ giữ đúng ý mục 1 + mục 5.
- [c74]: Có máy có cảm biến nhiệt đặt trong pin.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 6. Có "Có máy có" nên không nói "mọi điện thoại đều có" — đúng lệnh mục 6.
- [c75]: Cảm biến đó đo nhiệt độ của pin.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 6 (NTC / cảm biến nhiệt trong bộ pin).
- [c76]: Quanh bốn mươi lăm độ, tế bào pin không nên sạc nữa.
  - Đánh giá: OK
  - Lý do: GIỮ. Khớp `Cách nói` mục 7. Không nói "máy sẽ tự tắt", không nói "nguy hiểm".
- [c77]: Vạch đỏ đó là mốc của tế bào pin, không phải nhiệt độ mặt lưng.
  - Đánh giá: OK
  - Lý do: GIỮ. Đúng "Phạm vi" mục 7; câu này chặn đúng giá trị bị cấm "50 °C".
- [c78]: Nóng quá thì máy tự giảm dòng sạc.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 6. Không nói ngưỡng nhiệt độ cụ thể.

### Túi pin (c42–c49)

- [c42]: Ngoài hai chỗ ấy, còn một chỗ nữa: chính là túi pin.
  - Đánh giá: OK
  - Lý do: GIỮ. Khớp "Suy luận" (ba chỗ sinh nhiệt trong máy).
- [c43]: Cả cái túi là nhiều lớp mỏng xếp chồng.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 12, đúng `Cách nói`.
- [c44]: Đồng, graphite, lớp cách điện, rồi nhôm.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 12. Không xếp hạng nhiệt giữa các lớp.
- [c45]: Mỏng như tờ giấy, và dính sát vào nhau.
  - Đánh giá: OK
  - Lý do: GIỮ. Hình ảnh đúng cấu trúc tế bào.
- [c46]: Trong lúc nạp, dòng điện bị điện trở bên trong tế bào cản lại.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn `Cách nói` mục 12.
- [c47]: Cản lại thì sinh nhiệt, ngay ở trong pin.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 12 (nhiệt ohmic và nhiệt phản ứng bên trong tế bào).
- [c48]: Nhiệt ấy không thoát ra ngoài được.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 2.
- [c49]: Nó lan đều trong túi pin, làm cả cục pin ấm lên.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 2 (điện trở bên trong tế bào làm pin ấm lên).

### Nhiệt thoát ra (c50–c60)

- [c50]: Giờ gom lại: mạch sạc, cục pin, và con chip.
  - Đánh giá: OK
  - Lý do: GIỮ. Khớp "Suy luận" (ba chỗ sinh nhiệt).
- [c51]: Cả ba cùng đổ nhiệt vào một chỗ.
  - Đánh giá: OK
  - Lý do: GIỮ. Đúng "Suy luận" (cả ba nằm trong vỏ máy).
- [c52]: Đó là vỏ máy.
  - Đánh giá: OK
  - Lý do: GIỮ. Câu chốt, đúng hình.
- [c53]: Vỏ máy là tản nhiệt của cả cái máy.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 8.
- [c54]: Nó nóng lên, rồi tỏa ra không khí.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn `Cách nói` mục 8. Không nói "nhanh gấp mấy lần".
- [c55]: Nên lưng máy nóng.
  - Đánh giá: OK
  - Lý do: GIỮ. Khớp "Suy luận" (nhiệt đi ra là đi qua lưng máy).
- [c56]: Tay người là một miếng tản nhiệt lớn hơn không khí nhiều.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn `Cách nói` mục 9; mục 9 tự ghi đây là suy luận của tập phim, và lời thoại không kèm con số nào — đúng giới hạn "không nói mấy lần".
- [c57]: Cầm lên là thấy nóng ngay.
  - Đánh giá: OK
  - Lý do: GIỮ. `Cách nói` mục 9.
- [c58]: Còn cái ốp case thì giống một chiếc áo khoác giữ nhiệt.
  - Đánh giá: OK
  - Lý do: GIỮ. Ẩn dụ có tải trọng — hình vật cho "lớp chặn nhiệt" của mục 10.
- [c59]: Nó giữ nhiệt lại quanh máy, không cho nhiệt thoát ra.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn `Cách nói` mục 10.
- [c60]: Nên máy có case sẽ nóng hơn máy không case.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn `Cách nói` mục 10. Không nói chênh lệch bao nhiêu độ, không nói case tự sinh nhiệt.

### Thí nghiệm ốp case (c61–c66)

- [c61]: Mình thử: hai chiếc máy giống nhau, cùng sạc, cùng một chỗ.
  - Đánh giá: OK
  - Lý do: GIỮ. Đúng phần "Suy luận" (hai máy giống nhau, khác nhau ở đường thoát nhiệt).
- [c62]: Cái này có case, cái kia không.
  - Đánh giá: OK
  - Lý do: GIỮ. Một câu, hai hình.
- [c63]: Nhiệt kế đặt trên lưng mỗi cái.
  - Đánh giá: OK
  - Lý do: GIỮ. Thiết bị đo có trong khung.
- [c64]: Cột nhiệt kế này dốc lên nhanh hơn.
  - Đánh giá: OK
  - Lý do: GIỮ. Đọc hình, không đưa số.
- [c65]: Cái kia dốc lên chậm hơn.
  - Đánh giá: OK
  - Lý do: GIỮ. Đọc hình, không đưa số.
- [c66]: Cái này là đo được, không phải đoán.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 10 ghi rõ "đo được" là thí nghiệm dàn dựng trong khung, không phải số đo của bài báo.

### Quay lại và kết luận (c67–c68, c79–c91, c94, c95)

- [c67]: Mình quay lại cái bàn cạnh giường.
  - Đánh giá: OK
  - Lý do: GIỮ. Khép vòng, quay lại khung mở đầu.
- [c68]: Cái máy vẫn cắm sạc, màn hình vẫn sáng, và nó vẫn nóng.
  - Đánh giá: OK
  - Lý do: GIỮ. Hình kể trước lời theo sau.
- [c79]: Vậy cái nóng lúc sạc là bình thường.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 11.
- [c80]: Đó là máy đang làm việc, không phải máy đang hỏng.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 11; không chẩn đoán lỗi phần cứng.
- [c81]: Có một loại nóng khác, loại này mới đáng lo.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 11; "đáng lo" là cảnh báo nhẹ, không dọa.
- [c82]: Nóng khi không cắm sạc.
  - Đánh giá: OK
  - Lý do: GIỮ. `Cách nói` mục 11.
- [c83]: Hoặc nóng lệch một chỗ, ở một góc lưng máy.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 11.
- [c84]: Lúc đó thì mình không tự đoán được nguyên nhân.
  - Đánh giá: OK
  - Lý do: GIỮ. Tuân thủ luật "không chẩn đoán" của STRATEGY và `Cách nói` mục 11.
- [c85]: Còn với cái nóng lúc sạc, mình làm được mấy việc.
  - Đánh giá: OK
  - Lý do: GIỮ. Mở phần "một việc làm ngay" (tiêu chí 4 của bộ lọc đề tài).
- [c86]: Sạc lâu thì bỏ ốp case ra.
  - Đánh giá: OK
  - Lý do: GIỮ. Hành động rút ra từ cơ chế ốp case (mục 10); "lâu" không phải con số.
- [c87]: Dùng củ sạc đúng chuẩn của máy.
  - Đánh giá: OK
  - Lý do: GIỮ. Không nói chuẩn cụ thể nào, không nói mọi củ sạc đều sáu mươi oát.
- [c88]: Sạc chậm thì dòng vào máy ít hơn.
  - Đánh giá: OK
  - Lý do: GIỮ. Mục 5.
- [c89]: Đừng vừa sạc vừa chơi game.
  - Đánh giá: OK
  - Lý do: GIỮ. Khuyến nghị hành động, không chẩn đoán.
- [c90]: Vì lúc đó máy có hai chỗ sinh nhiệt cùng lúc.
  - Đánh giá: OK
  - Lý do: GIỮ. Nguyên văn `Cách nói` mục 4. *Ghi chú Đạo diễn (không chặn, chữ không đổi):* cùng cụm với c41; nếu muốn tránh cảm giác "đếm lại" sau c50–c51 (ba chỗ sinh nhiệt), có thể dùng: "Vì lúc đó máy vừa sạc vừa chạy, nhiệt dồn vào cùng một chỗ."
- [c91]: Và nếu máy nóng bất thường, rút sạc ra, mang đi kiểm tra.
  - Đánh giá: OK
  - Lý do: GIỮ. `Cách nói` mục 11. Không nói "hỏng pin", "lỗi phần cứng", "chết máy".
- [c94]: Máy không hỏng.
  - Đánh giá: OK
  - Lý do: GIỮ (nội dung cũ c94, giữ nguyên chữ). Đúng tinh thần mục 11 và luật "không chẩn đoán". Câu này giờ mở thẳng đoạn kết sau khi hai câu dựng lại ý đã nói ở c9–c10 và c54 đã bị cắt.
- [c95]: Nó đang làm việc.
  - Đánh giá: OK
  - Lý do: GIỮ (nội dung cũ c95, giữ nguyên chữ). Câu chốt, trả lời trọn câu hỏi.

## TỔNG KẾT HÀNH ĐỘNG

- **Số câu cần sửa: 0 câu.**
- **Yêu cầu Đạo diễn:** Không còn câu nào cần sửa. Bảy lỗi lần trước đã được sửa hết: nhóm NOFACTS (c19–c21) đã bám mục 4, c22 không còn phụ thuộc cơ chế không có nguồn, c73 đã gỡ mâu thuẫn "lớn hơn nhiều" / "to hơn một chút", và c92–c93 cũ đã bị cắt nên đoạn kết không còn lặp ý. Lời thoại đạt: không có chữ số, không câu nào quá 30 từ, không từ đệm sáo rỗng, không tuyên bố nào thiếu nguồn, không chẩn đoán, không vi phạm danh sách giá trị cấm.

### Việc còn lại, nằm ngoài phạm vi chấm lời thoại

1. **Đối chiếu bảng Ý → Hình** — bảng này không có trong thư mục làm việc, nên tiêu chí "khớp 1:1" chưa được kiểm chứng. Ba chỗ cần Đạo diễn xác nhận: (a) cảnh trong củ sạc phải khớp với lời mới ở c19–c21 (đã bỏ hẳn "cuộn biến áp" — nếu hình vẫn còn cuộn biến áp thì phải sửa hình, không được để lời kể một cơ chế không có nguồn); (b) danh sách linh kiện ở c30 (chip, tụ, cuộn cảm) phải có trong bảng hình; (c) mốc "bốn mươi lăm độ" ở c76 phải là vạch đỏ trên nhiệt kế đúng như c77 nói.
2. **Ghi chú không chặn về nhịp dấu phẩy** — nhịp "chủ ngữ, vị ngữ" ở c11, c17, c19, c22, c29, c60 là một lựa chọn văn phong thống nhất của tập, tôi chấp nhận; nếu khi dựng thu âm thấy câu nào vấp thì bỏ dấu phẩy ở câu đó, theo mẫu "Những hạt cam này là phần điện bị thất thoát ở đây."
3. **`ROUND`** — thư mục không có `review.sh`, nên số vòng do người chạy ghi; tôi ghi "2/6" cho khớp với vòng 1/6 của `PREVIOUS.md`.

---
Người chấm: claude -p (model mặc định của claude) · review.sh --script · 2026-11-09 09:08
