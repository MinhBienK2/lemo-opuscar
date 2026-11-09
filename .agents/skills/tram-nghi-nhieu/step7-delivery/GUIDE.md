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
2. Chấm hình (cổng riêng của kênh):
   `sh channels/tram-nghi-nhieu/tools/review.sh <tập>`
   (Yêu cầu: `OVERALL ≥ 9` và không có câu nào bị đánh giá FAIL).
   **Chạy lúc code đã đứng yên** — không sửa `src/` trong khi chấm.
3. Biên tập và tổng hợp âm thanh:
   `$LIB/.venv/bin/python channels/tram-nghi-nhieu/tools/mix.py <tập>`
4. Render video headless và mux sản phẩm cuối cùng:
   `sh <tập>/build.sh`
   (Lệnh này tự từ chối nếu thiếu tem — xem phần Tem kiểm duyệt số ở trên. Nó cũng **tự ghi thời lượng đo
   được** vào `film.json`; đừng gõ tay số thời lượng — cổng bàn giao sẽ so manifest với phim và bắt lỗi.)
5. Chấm phim đã dựng:
   `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --video`
5b. **Tự soi phim đã dựng như một người xem.** Cắt một khung giữa mỗi câu lời kể **từ chính file mp4**
   rồi dán lại thành tờ:
   `python3 tools/frames_at.py <tập>/out/<tên_tập>.mp4 <tập>/out/beats/beats.json <scratch>/film.jpg --cols 3`
   (`beats.json` là của tờ sheet đã dựng — nếu tập dựng tờ ở chỗ khác thì lấy đúng tệp đó.)
   Đọc tờ để xem phim nói gì, rồi **mở khung gốc** cho câu nào tờ đã chỉ ra là có vấn đề:
   `python3 tools/frames_at.py <mp4> <beats.json> <scratch>/one.jpg --lines c17 --cols 1 --w 1200`.
   Tờ là **bản đồ, không phải bằng chứng**: ô nhỏ mất tương phản và kích thước, nên một câu có thể trông
   vỡ trong tờ mà ngon trong phim — và ngược lại. **Đừng kết luận về một câu khi chưa mở khung gốc của nó.**
   Câu nào sai thì sửa và dựng lại; đừng sửa `beats.json` để tờ khớp.
6. **Cổng bàn giao của thư viện** — bắt buộc, phải thoát mã 0:
   `sh core/render/review.sh <tập>`
   Cổng này chạy những thứ cổng của kênh không chạy: `filmcheck` (tập là của riêng nó),
   kiểm tra trích dẫn và con số trên màn hình, `readcheck` (chữ đủ lâu để đọc),
   `scenecheck` (hình kể chuyện chứ không đọc chuyện), kiểm tra giọng, ảnh chụp mẫu, và
   độ lớn tiếng (−14 LUFS, đỉnh thật ≤ −1,0 dBFS).
7. Nếu `film.json` của tập đã đổi (tiêu đề, thời lượng), dựng lại bảng phim:
   `python3 tools/gen_films_index.py` — bảng `FILMS.md` do máy sinh, không sửa tay.

## Bàn giao kết quả
- File video: `<tập>/out/<tên_tập>.mp4`
- File phụ đề: `<tập>/out/<tên_tập>.transcript.srt`
- Ảnh đại diện: `poster.jpg` kèm 4-6 chữ tiêu đề.

## Đọc kết quả của một bài kiểm tra

- **`COULD NOT RUN (exit 2)`** — bài kiểm tra **không chạy được**, chưa phải phán quyết về phim.
  Dòng ngay dưới nói lý do. Hai nguyên nhân thường gặp: tập vừa bị sửa trong lúc kiểm tra chạy
  (`readcheck`/`scenecheck` so vân tay của `index.html`, `src/*.js`, `voice/lines.json` trước và sau
  nên kết quả bị bỏ), hoặc trang chết giữa chừng. **Để code đứng yên rồi chạy lại** — đừng đi tìm
  lỗi trong phim khi bài kiểm tra chưa kịp đọc phim.
- **`FAILED`** — phim có lỗi thật; đọc dòng lỗi và sửa.
- **R1–R9** — luật của thư viện trong `CODING_STANDARDS.md`. R9: chờ một agent, đừng chờ một file
  (một lệnh lặp năm lần là một vòng dò); job dài thì chạy nền và để harness báo khi nó xong.
