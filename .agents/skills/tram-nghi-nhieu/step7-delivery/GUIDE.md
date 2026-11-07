# Bước 7: Âm thanh, Mux & Nghiệm thu Bàn giao (Audio, Mux & Delivery)

## Mục tiêu
Hoàn thiện toàn bộ hệ thống âm thanh (tiếng động foley, nhạc nền, tiếng thở phòng), kiểm tra toàn diện chất lượng toàn phim, vượt qua các cổng kiểm duyệt số (`gate.py`) và xuất bản file `.mp4` chuẩn phát sóng.

## Tiêu chuẩn kỹ thuật
- **Sự kiện âm thanh `window.EV`:** Đăng ký chính xác thời điểm va chạm, ma sát, lật trang, tiếng đóng ngắt điện.
- **Chuẩn âm lượng:** Master đạt đúng **−14 LUFS**, có tính năng tự động dìm nhạc (ducking) khi giọng nói xuất hiện.
- **Tem kiểm duyệt số (`gate.py`):**
  - Cần đầy đủ con dấu PASS: Dàn ý, Lời thoại, Props linh kiện, và Toàn cảnh.
  - Video render từ chối xuất bản nếu thiếu bất kỳ con dấu nào.

## Quy trình thực hiện
1. Điền đầy đủ sự kiện âm thanh vào mảng `window.EV` trong code tập phim.
2. Chạy thẩm định toàn diện:
   `sh channels/tram-nghi-nhieu/tools/review.sh <tập>`
   (Yêu cầu: `OVERALL ≥ 9` và không có câu nào bị đánh giá FAIL).
3. Biên tập và tổng hợp âm thanh:
   `$LIB/.venv/bin/python channels/tram-nghi-nhieu/tools/mix.py <tập>`
4. Render video headless và mux sản phẩm cuối cùng:
   `sh <tập>/build.sh`
5. Chạy kiểm tra video thành phẩm sau khi render:
   `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --video`
6. Bàn giao kết quả:
   - File video: `<tập>/out/<tên_tập>.mp4`
   - File phụ đề: `<tập>/out/<tên_tập>.transcript.srt`
   - Ảnh đại diện: `poster.jpg` kèm 4-6 chữ tiêu đề.
