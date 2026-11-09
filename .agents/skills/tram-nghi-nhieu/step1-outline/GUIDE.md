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
   - **Mỗi mục là một claim, mỗi claim có nguồn tra được** (tác giả + năm + DOI/URL), và **không còn dòng mẫu
     nào** của khuôn: `<Author>`, `<doi or link>`, `<value>`, `<first page>`, `<the sentence of the source,
     quoted>`… là dòng chưa được viết. Cổng dàn ý dừng ở đây:
     `python3 channels/tram-nghi-nhieu/tools/check_research.py <tập>` — file còn dòng mẫu, hoặc chưa có
     mục nào, hoặc chưa có nguồn nào, thì dàn ý chưa được chấm.
   - **Viết mỗi claim ngay khi bạn đã có nguồn của nó** — đừng tìm hết rồi mới viết. Một tập cần **bốn đến
     sáu** claim; tìm mãi không dừng là cách dễ mất cả buổi mà chưa có một dòng nào trong tệp. Và mỗi lần viết
     xong thì `check_research.py` báo gần hơn một chút — còn nếu tìm hết rồi mới viết thì cả buổi tìm không
     để lại dấu vết nào trong tập.
3. Viết `TREATMENT.md`:
   - Tách câu hỏi: Chủ thể thay đổi là gì? Thay đổi thế nào?
   - Câu trả lời tóm tắt trong đúng 1 câu.
   - Bảng **Ý → Hình**: Mỗi ý một dòng. Nguyên tắc: Khái niệm khoa học phải có hình ảnh xuất hiện TRƯỚC hoặc NGAY KHI được nhắc tới.
4. **Chấm:** `sh channels/tram-nghi-nhieu/tools/review.sh <tập> outline`. Công cụ chạy `check_treatment.py` và
   `check_research.py` trước; lỗi của máy thì sửa trước khi có người chấm. Câu hỏi của người chấm:
   `step1-outline/RUBRIC.md`. Dàn ý phải sửa thì `review/OUTLINE.md` nói câu nào sai và vì sao.
