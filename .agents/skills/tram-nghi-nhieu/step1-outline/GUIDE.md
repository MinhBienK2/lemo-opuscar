# Bước 1: Dàn ý khoa học & Nghiên cứu (Treatment & Facts)

## Mục tiêu
Tạo ra `research/FACTS.md` và `TREATMENT.md` với chuỗi nhân quả hoàn chỉnh từ hiện tượng đời thường đến cơ chế khoa học vi mô.

## Tài liệu quy chuẩn
- Kênh giải thích câu hỏi "Tại sao" bằng diorama 3D toon.
- Không có nhân vật đại diện, chỉ có một giọng kể tiếng Việt.
- Mọi vật có thật dựng đúng là nó, chỉ thứ vô hình mới thành hình minh họa.

## Quy trình thực hiện
1. Tạo tập bằng scaffold nếu chưa có:
   `sh core/render/new_episode.sh tram-nghi-nhieu series/<cột>/<tập> "Câu hỏi?"`
2. Viết `research/FACTS.md`:
   - Chuỗi nguyên nhân - kết quả có nguồn tài liệu rõ ràng.
   - Các số liệu, mốc thời gian, nhiệt độ, kích thước cụ thể.
3. Viết `TREATMENT.md`:
   - Tách câu hỏi: Chủ thể thay đổi là gì? Thay đổi thế nào?
   - Câu trả lời tóm tắt trong đúng 1 câu.
   - Bảng **Ý → Hình**: Mỗi ý một dòng. Nguyên tắc: Khái niệm khoa học phải có hình ảnh xuất hiện TRƯỚC hoặc NGAY KHI được nhắc tới.
4. **Vòng lặp Thẩm định (Max 5 rounds):**
   - Nạp nội dung file `step1-outline/PROMPT_CRITIC.md` để triệu hồi Subagent Thẩm định Dàn ý.
   - Subagent trả về kết quả theo chuẩn `OUTLINE-REVIEW.md`.
   - **Đạo diễn tiếp nhận (Bắt buộc):**
     - Điểm đúng: Sửa đổi trực tiếp vào `TREATMENT.md`.
     - Điểm không đồng tình: Ghi rõ phản biện kỹ thuật/khoa học.
   - Lặp lại tối đa 5 hiệp cho đến khi nhận `VERDICT: PASS`.
