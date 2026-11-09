VERDICT: REJECT
ROUND: 1/6
FLAGS_DETECTED: NONE

## ĐÁNH GIÁ TỪNG CÂU

- c42: Quay lại cái nắp hũ lúc nãy, một nắp ấm, một nắp vừa lấy ra từ tủ lạnh.
  - Đánh giá: OK
  - Lý do: Có cơ sở trong FACTS (mục 2 và mục 4: ở cùng một độ giãn thì dây nóng co chặt hơn dây mát; dây chưa kéo thì nóng lên nở ra). Không có chữ số, không vượt 30 từ (18 từ), không có từ đệm sáo rỗng. Đệm "Quay lại ... lúc nãy" là cách mở lại đúng kiểu hình kể trước, lời theo sau.
  - Đề xuất VIẾT LẠI: (không cần sửa)

- c43: Dây quanh nắp ấm siết chặt hơn dây quanh nắp lạnh.
  - Đánh giá: CẦN SỬA
  - Lý do: Lặp từ ngay trong một câu: "dây quanh" xuất hiện hai lần liên tiếp, nghe cục và mất nhịp. Cùng cụm "dây quanh" này xuất hiện lần thứ ba ở c48 — đúng vùng mà check_script cảnh báo ("dây quanh" repeats 3 times in lines #43–#48). Cả chương chỉ 106 chữ nhưng "nắp" xuất hiện 7 lần, "siết chặt" 3 lần, cộng dồn lại nghe như một mẩu chữ dán. Nội dung khoa học thì đúng (FACTS mục 2, mục 4), lỗi ở lớp văn phong.
  - Đề xuất VIẾT LẠI: "Trên nắp ấm, dây siết chặt hơn; quanh nắp lạnh thì lỏng hơn."

- c44: Cái co lại này không phải mẹo vặt của cao su.
  - Đánh giá: OK
  - Lý do: Câu lập luận đúng tinh thần chương, giọng điềm tĩnh, không sáo rỗng, 11 từ. Bám được mục 1 của FACTS về việc gọi sức co là lực của sự hỗn loạn, không gán tên tác giả.
  - Đề xuất VIẾT LẠI: (không cần sửa)

- c45: Nó là hệ quả đúng của một vật liệu mà sức co đến từ sự hỗn loạn của vô số chuỗi.
  - Đánh giá: CẦN SỬA
  - Lý do: "hệ quả đúng" là cách diễn đạt vướng và nghe như đang kết luận một đề thi; "hệ quả tất yếu" hay "hệ quả tự nhiên" đúng giọng khoa học khách quan hơn. Nội dung không sai (FACTS mục 1) và là một câu chốt cơ chế nên giữ, chỉ cần chỉnh chữ.
  - Đề xuất VIẾT LẠI: "Đó là hệ quả tất yếu của vật liệu mà sức co đến từ sự hỗn loạn của vô số chuỗi."

- c46: Chỉ khi dây đang bị kéo căng thì nóng lên mới co lại.
  - Đánh giá: OK
  - Lý do: Đúng như FACTS mục 4 yêu cầu: "nhắc lại ở lời chốt rằng chỉ khi dây đang bị kéo căng thì nóng lên mới co lại", và không gộp hai vế vào một câu. Không chữ số, 13 từ, không lặp từ trong câu.
  - Đề xuất VIẾT LẠI: (không cần sửa)

- c47: Nên khi bạn muốn một sợi dây siết chặt, hãy hâm nó nóng trước, rồi quấn lên nắp hũ.
  - Đánh giá: OK
  - Lý do: Đúng mục tiêu "Người xem mang về được gì? Một việc làm ngay" của STRATEGY. Suy ra trực tiếp từ FACTS mục 2 và mục 7 (cao su giữ nhiệt kém nên chỉ một ít nhiệt cũng đủ), không có con số nào thiếu nguồn.
  - Đề xuất VIẾT LẠI: (không cần sửa)

- c48: Dây quanh nắp hũ siết chặt, luồng khí nóng bốc lên quanh dây.
  - Đánh giá: CẦN SỬA
  - Lý do: Lặp ý với c43 (đã nói dây quanh nắp siết chặt rồi), lặp thêm cụm "dây quanh" lần thứ ba trong chương, và "luồng khí nóng bốc lên quanh dây" là cách viết lủng củng — khí bốc lên từ trong hũ chứ không phải "quanh dây". Câu này là câu cuối của tập nên cần một hình ảnh sạch, không phải một lần nhắc lại.
  - Đề xuất VIẾT LẠI: "Dây siết chặt quanh nắp hũ, còn luồng khí nóng từ trong bốc lên."

## TỔNG KẾT HÀNH ĐỘNG
- Số câu cần sửa: 3 câu (c43, c45, c48).
- Ghi chú về cờ: không có cờ DIGIT (toàn bộ câu 42–48 viết số bằng chữ), không có cờ LONG (câu dài nhất là c45, 21 từ), không có cờ NOFACTS (mọi phát biểu về cơ chế đều bám mục 1, 2, 4, 7 của FACTS.md). Lý do REJECT là lỗi văn phong: lặp từ/lặp ý, đúng cảnh báo "dây quanh repeats 3 times in lines #43–#48" của check_script, cộng với mật độ từ "nắp" 7 lần và "siết chặt" 3 lần trong một chương chỉ 106 chữ.
- Yêu cầu Đạo diễn: Duyệt sửa các câu trên hoặc phản biện lý do chuyên môn. Sửa c43 và c48 theo đề xuất là đủ để chương này qua vòng; c45 là chỉnh chữ cho đúng giọng.

---
Người chấm: claude -p (model mặc định của claude) · review.sh --script --chapter ch4 · 2026-11-09 15:57
