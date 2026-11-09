# Bước 2: Kịch bản lời thoại & Thời gian (Script & Lines)

## Mục tiêu
Tạo ra `voice/lines.json` từ bảng ý → hình của Bước 1 đã đạt PASS.

## Quy trình thực hiện
1. Viết từng câu thoại vào `voice/lines.json`:
   - Mỗi câu thoại tương ứng trực tiếp với 1 dòng trong bảng Ý → Hình.
   - Số đếm, năm, chỉ số nhiệt độ phải viết bằng CHỮ (ví dụ: "hai mươi mốt độ C", không viết "21°C").
   - **Một số kèm đơn vị đứng trong một câu.** "Hai mươi" là một cụm, đừng chia nó ra: câu 54 kết bằng "…tối đa khoảng **hai**" và câu 55 là "**mươi** gam hơi nước" (tập 01, 1:58) — người xem đọc "mươi gam hơi nước" là cụt, và nó còn chống lại nhãn "20 g/kg" đang in trên màn hình.
   - Nhịp điệu: Câu ngắn gọn, tự nhiên, văn phong nói của người lớn điềm đạm, không giật gân, không câu view kiểu youtube nhảm nhí.
2. **Vòng lặp Thẩm định Lời thoại (Max 5 rounds):**
   - Mở vòng chấm bằng **công cụ của kênh**: `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --script`.
     Công cụ nạp mẫu `step2-script/PROMPT_CRITIC.md`, đánh số vòng, ký tên người chấm và đóng tem
     `review/SCRIPT.pass`. **Không** tự gọi subagent: báo cáo của nó rơi vào một tệp không ai đọc,
     không ai đếm vòng, không ai ký.
   - Nhận báo cáo thẩm định:
     - Bắt lỗi lặp từ ngữ, câu quá dài, từ ngữ sáo rỗng.
     - Kiểm tra cờ máy: `DIGIT` (còn số), `LONG` (câu đọc quá dài), `NOFACTS` (ý không có trong nghiên cứu).
   - **Đạo diễn tiếp nhận (Bắt buộc):**
     - Sửa câu thoại theo góp ý đúng.
     - Phản biện nếu Subagent đòi đổi câu làm sai thuật ngữ khoa học chuyên ngành.
   - Lặp lại tối đa 5 hiệp cho tới khi `VERDICT: PASS`.
3. Khi đã PASS: Chạy công cụ sinh giọng (`tts_vi.py`, `asr_vi.py`, `mk_timeline.py`) để tạo `src/timeline.js`.
