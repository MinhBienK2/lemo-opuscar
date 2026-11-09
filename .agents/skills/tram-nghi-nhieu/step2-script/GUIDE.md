# Bước 2: Kịch bản lời thoại & Thời gian (Script & Lines)

## Mục tiêu
Tạo ra `voice/lines.json` từ bảng ý → hình của Bước 1 (đã chấm xong).

## Quy trình thực hiện
1. Viết từng câu thoại vào `voice/lines.json`:
   - Mỗi câu thoại tương ứng trực tiếp với 1 dòng trong bảng Ý → Hình.
   - Số đếm, năm, chỉ số nhiệt độ phải viết bằng CHỮ (ví dụ: "hai mươi mốt độ C", không viết "21°C").
   - **Một số kèm đơn vị đứng trong một câu.** "Hai mươi gam" là một cụm: một câu kết bằng "…khoảng **hai**" và câu sau mở bằng "**mươi** gam" thì người xem nghe cụt, và phụ đề chống lại nhãn "20 g" trên màn hình.
   - Nhịp điệu: Câu ngắn gọn, tự nhiên, văn phong nói của người lớn điềm đạm, không giật gân, không câu view kiểu youtube nhảm nhí.
2. **Chấm:** `sh channels/tram-nghi-nhieu/tools/review.sh <tập> script`. Máy kiểm trước: số viết bằng chữ, cụm mà
   `FACTS.md` cấm (`check_voice_facts.py`). Người chấm chấm từng câu (`step2-script/RUBRIC.md`); câu phải sửa nằm
   trong `review/SCRIPT.md`, kèm câu viết lại. Sửa lời rồi chạy lại: chỉ câu vừa đổi được chấm lại.
   Sửa lời kể thì sửa luôn chỗ `TREATMENT.md` và `LOOK.md` trích câu đó.
3. Khi bước xong: Chạy công cụ sinh giọng (`tts_vi.py`, `asr_vi.py`, `mk_timeline.py`) để tạo `src/timeline.js`.
