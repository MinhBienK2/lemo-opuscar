# Bước 7: Âm thanh, Mux & Nghiệm thu Bàn giao (Audio, Mux & Delivery)

## Mục tiêu
Hoàn thiện toàn bộ hệ thống âm thanh (tiếng động foley, nhạc nền, tiếng thở phòng), kiểm tra toàn diện chất lượng toàn phim, vượt qua các cổng kiểm duyệt số (`gate.py`) và xuất bản file `.mp4` chuẩn phát sóng.

## Tiêu chuẩn kỹ thuật
- **Sự kiện âm thanh `window.EV` (Bắt buộc theo chuẩn `core/audio/foley.py` và `mix.py`):**
  - Cú pháp chuẩn: `{ type: "<tên_chuẩn>", t: <giây>, v: <âm_lượng_0.0_đến_1.0> }`.
  - KHÔNG dùng cú pháp lạ `{ type: "foley", sound: "..." }`.
  - Danh mục tên foley hợp lệ được hỗ trợ:
    - Giấy / Sách: `paper_slide`, `paper_flip`, `page_turn`, `paper_tear`, `card_set`, `card_flip`.
    - Bút / Viết / Vẽ: `pen_scribble`, `pen_tick`, `pen_circle`, `pen_cap`, `chalk_tap`.
    - Vật thể / Va chạm / Đặt để: `wood_set`, `wood_knock`, `cup_set`, `glass_set`, `plastic_set`, `plastic_click`.
    - Âm thanh cơ khí / Nút bấm: `switch`, `light_on`, `light_off`, `button`, `door_close`, `door_knock`.
    - Hiệu ứng / Rót / Khí: `pour`, `whoosh_soft`, `blip_up`, `blip_down`, `reveal_soft`.
- **Chuẩn âm lượng:** Master đạt đúng **−14 LUFS**, có tính năng tự động dìm nhạc (ducking) khi giọng nói xuất hiện.
- **Chiến lược xử lý FFMPEG & Remote compute:**
  - Với render khung hình nặng: tận dụng `tools/remote_compute.sh` hoặc worker chạy song song.
  - Với bước mux âm thanh & video (~350MB raw): thực hiện stream mux cục bộ trên SSD để tránh nghẽn băng thông mạng LAN khi SCP file thô qua SSH.
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
