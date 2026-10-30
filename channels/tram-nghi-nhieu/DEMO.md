# Trạm Nghĩ Nhiều — demo của kênh

Một ví dụ trong nhiều. Đừng lấy lại câu chuyện, cung, bảng cảnh, đạo cụ hay nhịp của nó.

Demo: *Tại sao càng rảnh, ta càng thấy mệt?* (1:51) · `tram-nghi-nhieu-tap-01.mp4` · nguồn ở [`tap-01/`](tap-01/)

Một đêm rảnh, đầu không ngừng nghĩ — và ta tưởng mình mệt vì hết pin ý chí, cho tới khi biết đó là cách giải thích sai. Mọi con số trong phim có nguồn ở `tap-01/research/FACTS.md`.

## Cốt truyện & cấu trúc

Ba cấu trúc ứng viên được cân trong `TREATMENT.md`; chọn **C — "cái giá của việc không làm gì"**: một đêm rảnh trống, đầu đầy dần lên, rồi lật ngược để bác bỏ "hết pin ý chí" bằng 23 phòng thí nghiệm.

Cung: setup (pin 3 %, một ngày không làm việc gì) → turn (cách giải thích quen thuộc không đứng vững) → ending (nghỉ thật là "soft fascination", kết bằng một việc cụ thể: đi bộ mười phút không mang điện thoại).

## Bảng cảnh

18 cảnh, giờ lấy từ `events.json` của tập (giây bắt đầu).

| # | Bắt đầu | Hình | Máy | Ghi chú |
|---|---|---|---|---|
| 1 | 0,0 | insert: pin 3 % | push-in rất chậm | Mở bằng vật thể, không bằng lời |
| 2 | 5,4 | medium, bàn làm việc | whip pan vào | Rối đã ở đó |
| 3 | 10,9 | medium + thẻ tên | đứng yên, thẻ trượt vào | Tên kênh và tên tập |
| 4 | 16,4 | wide số liệu | đứng yên | 47 % là trục của tập |
| 5 | 21,8 | close-up phản ứng | cắt cứng | Câu phải rơi vào mặt |
| 6 | 27,9 | wide hai người | lướt nhẹ | Bọt suy nghĩ bay khỏi đầu |
| 7 | 31,0 | medium + thẻ "CHÁN" | push nhẹ | Con dấu đỏ phủ lên câu đã nói |
| 8 | 37,4 | trung cảnh sofa | iris wipe | Bước vào bối cảnh |
| 9 | 44,3 | insert feed | đứng yên, cuộn | Feed đổ vào đầu |
| 10 | 50,4 | medium | whip pan | "Hết pin ý chí" cạn |
| 11 | 58,1 | wide biểu đồ | đứng yên | 23 phòng thí nghiệm, gần bằng 0 |
| 12 | 64,3 | medium bàn | push chậm | Đầu gục xuống |
| 13 | 69,8 | wide phố bình minh | tracking ngang | "Soft fascination" |
| 14 | 77,2 | hai khung so sánh | đứng yên | Màn hình và đi dạo |
| 15 | 84,1 | thẻ + con dấu | đứng yên | Lướt là việc làm không lương |
| 16 | 89,1 | close Rối | đứng yên | Rối cảnh báo |
| 17 | 95,0 | medium bàn | push nhẹ | Câu chốt, giọng nhỏ lại |
| 18 | 99,5 | thẻ kết | thẻ trượt vào | Tập sau + đăng ký |

## Cấu trúc nhạc

84 BPM, A minor, bảy chương, mỗi chương bắt đầu ở nhịp mạnh của riêng nó (cue "music" trong `events.json`): A 0,0 (pulse mở) → B 10,6 → C 16,1 → D 30,8 → E 50,1 → F 69,4 → G 94,8 → hết 107,9.

Mỗi chương đổi bộ nhạc cụ, không đổi tempo: bass + tick → piano đệm, kick, brush, shaker → thêm marimba đôi → piano đệm + celesta → bass trầm + drone lệch nhịp → marimba + pad → piano + marimba. Dưới giọng, nhạc lùi 8 dB; compressor + limiter; master −14 LUFS.

## Màu & đạo cụ

Nền `#12131A`, kem `#FAF8F5`, nét `#1D202A`, nhấn mù mè `#FFB703` (hoodie và highlight), tím `#8B5CF6` (Rối), lạnh `#67E8F9` (dữ liệu), cảnh báo đỏ `#F0525B` (con dấu, pin). Một màu nhấn mỗi cảnh.

Đạo cụ của tập này: cái **pin 3 %** (đồng hồ của Kẻ Nghĩ Nhiều, mở đầu tập), **thẻ giấy** có băng keo vàng, **con dấu** "CHÁN" và "CÔNG VIỆC", **vòng 47 %** kèm dải 24 ô giờ thức, **bong bóng suy nghĩ** bay khỏi đầu, và **màn hình feed** đổ vào đầu lúc nửa tập.

## Thẻ kết

Thẻ "tập sau" trượt vào, có nét viết tay (Patrick Hand) và lời đăng ký. Thẻ này không mang dấu LemoLab: phim của kênh không có credit thư viện.

## Ghi chú dựng

Nguồn của tập nằm ở `tap-01/`: `TREATMENT.md`, `research/FACTS.md`, `voice/lines.json`, `src/timeline.js`, `src/film.js`, `build.sh`. Rig, `mix.py`, `fonts/` và `voice/*.py` **không nằm trong tập** — chúng ở kênh (`../rig/`, `../mix.py`, `../fonts/`, `../voice/`).

Thứ tự dựng: `events.mjs` → `mix.py` (`FILM=<thư mục tập>`) → `video.mjs` → `srt.py` → `mux.sh` → poster → `review.sh`. Cổng kiểm tra phải exit 0 trước khi tập được coi là xong.

Bẫy của chính tập này: không dùng `path()` cho hình chữ nhật (nó làm mềm góc), vẽ nhân vật sau cẳng tay nhưng trước bàn, và không để phụ đề đè lên mặt hay lên số liệu đang đọc.
