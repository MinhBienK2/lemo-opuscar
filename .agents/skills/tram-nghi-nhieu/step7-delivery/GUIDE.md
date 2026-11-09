# Bước 7: Âm thanh, Dựng phim & Bàn giao (Audio, Build & Delivery)

## Mục tiêu
Hoàn thiện âm thanh (foley, ambience, nhạc nền), dựng tệp `.mp4`, qua cổng bàn giao của thư viện, rồi báo người dùng.

## Âm thanh
- **Sự kiện `window.EV`:** `{ type: "<tên_chuẩn>", t: <giây>, v: <âm_lượng_0.0_đến_1.0> }` — `type` là chính tên foley:
  - Giấy / Sách: `paper_slide`, `paper_flip`, `page_turn`, `paper_tear`, `card_set`, `card_flip`.
  - Bút / Viết / Vẽ: `pen_scribble`, `pen_tick`, `pen_circle`, `pen_cap`, `chalk_tap`.
  - Vật thể / Va chạm / Đặt để: `wood_set`, `wood_knock`, `cup_set`, `glass_set`, `plastic_set`, `plastic_click`.
  - Cơ khí / Nút bấm: `switch`, `light_on`, `light_off`, `button`, `door_close`, `door_knock`.
  - Hiệu ứng / Rót / Khí: `pour`, `whoosh_soft`, `blip_up`, `blip_down`, `reveal_soft`.
- Âm thưa: một tiếng cho một hành động thấy được, không phủ tiếng lên mọi nhát.
- **Master −14 LUFS**, nhạc tự dìm khi có giọng: `mix.py` lo việc này.

## Quy trình thực hiện
1. Điền sự kiện âm thanh vào `window.EV` trong `src/film.js`.
2. Dựng phim: `LEMO_ANGLE=vulkan sh <tập>/build.sh` — trộn âm (`mix.py`), dựng hình (`video.mjs`), ghép, phụ đề,
   poster, và ghi thời lượng đo được vào `film.json`. Cổng (`gate.py`) từ chối dựng khi còn bước chấm chưa xong; lý do
   in ra kèm bước đó. Dựng hình xếp hàng chờ chỗ trống của máy: một dòng `[slot] waiting…` là bình thường.
3. **Cổng bàn giao của thư viện**, phải thoát mã 0: `sh core/render/review.sh <tập>`. Nó chạy `filmcheck`, trích dẫn
   và con số trên màn hình, `readcheck` (chữ đủ lâu để đọc), `scenecheck`, giọng, và độ lớn tiếng (−14 LUFS, đỉnh
   thật ≤ −1,0 dBFS). `FAILED` là lỗi thật: sửa rồi dựng lại. `COULD NOT RUN` (mã 2) là bài kiểm tra không chạy được:
   để code đứng yên rồi chạy lại.
4. **Xong.** Báo người dùng ngay: đường dẫn `out/<tên_tập>.mp4`, thời lượng, phụ đề `out/<tên_tập>.transcript.srt`,
   poster, và các mục MỞ của các bước chấm (`gate.py status <tập>`).
5. **Nghiệm thu (báo cáo):** `sh channels/tram-nghi-nhieu/tools/review.sh <tập> final`. Công cụ cắt một khung cho mỗi
   câu từ chính tệp mp4, và người chấm viết `review/FINAL-QA.md` theo `step7-delivery/RUBRIC.md`. Báo cáo này không
   mở lại bước nào: đưa tóm tắt của nó cho người dùng, rồi dừng. Sửa theo nó chỉ khi người dùng yêu cầu.
6. Nếu `film.json` đã đổi (tiêu đề, thời lượng), dựng lại bảng phim: `python3 tools/gen_films_index.py`.
