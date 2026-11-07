# Retro — tập dài 18 phút về giấc ngủ: tap-01-ngu-trua-day-me (2026-11-07)

Phiên làm việc này dựng tập dài đặc biệt (~17:38) của kênh Trạm Nghĩ Nhiều:
`channels/tram-nghi-nhieu/series/co-the/tap-01-ngu-trua-day-me`
("Vì sao ngủ trưa dậy lại mệt hơn lúc mới ngủ?", 185 câu, 17:38, 615 MB).
Phiên được giám sát độc lập bởi `tools/supervise.sh`, ghi lại trong `improvements/supervision/2026-11-07.md`.

## Bối cảnh và Thống kê phiên

- **Yêu cầu người dùng:** "hãy tạo giúp video để nói sâu sắc về một chủ đề trong kênh trạm nghĩ nhiều. video dài khoảng 20 phút. tận dụng ssh muse cho công việc nặng ffmpeg,...."
- **Thời lượng thực tế:** 17 phút 37 giây (1057.99 s), 185 câu thoại, 5 chương / bối cảnh diorama 3D (phòng ngủ/bàn làm việc, khe synapse thần kinh, đồng hồ sinh học / sóng chậm, cà phê & thụ thể adenosine, chu kỳ ngủ 90 phút).
- **Tổng số tool calls trong phiên:** 381 `bash`, 116 `read`, 47 `edit`, 37 `write`, 18 `todo`, 17 `wait`, 6 `grep`, 3 `task`.
- **Đặc điểm bất thường:** 95 lệnh `sleep` thăm dò (nhiều lệnh ngủ từ 500 đến 900 giây, chiếm hơn 8 giờ đồng hồ), 63 script python heredoc vá đè code trực tiếp từ shell, và 9 lệnh ssh probe không kết nối được tới `muse`.

---

## Diễn biến phiên và Đánh giá của Agent Review

### 1. Quá trình làm kịch bản và tiếng (Script & Voice)
- Agent thực hiện nghiên cứu tài liệu (`research/FACTS.md`) với 19 mục khoa học và định dạng trích dẫn.
- Quá trình duyệt kịch bản trải qua **8 vòng chấm script review** (`review/SCRIPT-REVIEW-1.md` đến `SCRIPT-REVIEW-8.md`).
- **Điểm số cuối của Script Reviewer:** `1=5 2=7 3=6 4=9 5=6 6=7 7=5` → `OVERALL: 6/10` → `VERDICT: FAIL`.
- Các lỗi chính được chỉ ra:
  - Máy quét (`TASK.md`) không thấy cờ số viết bằng chữ hay câu quá dài, nhưng người chấm phát hiện **lặp ý nghiêm trọng**: ý "ngủ trưa lấy bớt giấc ngủ đêm" bị lặp lại 14 lần; ý "cà phê chặn cửa không lấy đi" lặp 4 lần; cụm "ba mươi phút" lặp 12 lần.
  - Giải thích trước khi hình xuất hiện (nhắc đến chu kỳ ngủ ở #13–#17 trong khi đến #107 mới vẽ trên màn hình).
  - Kết thúc lộn xộn (#180–#185 liên tiếp có nhiều câu kết thúc trùng lặp gây bối rối cho người xem).

### 2. Quá trình dựng 3D và chấm hình (Picture Review)
- Kênh chuyển sang dựng diorama 3D toon trên Three.js (`rig/render.js`, `rig/kit.js`, `rig/brain.js`, `rig/sets.js`).
- Agent chạy chấm hình bằng `channels/tram-nghi-nhieu/review.sh` qua 3 vòng:
  - Vòng 1 (`review/REVIEW.md` trên 185 khung beat): **FAIL 3.4/10**.
  - Vòng 2 (`review/REVIEW-1.md` trên 4 khung/câu trích từ mp4): **FAIL 4.0/10**.
  - Vòng 3 (`review/REVIEW-3.md`): `SCORES: 1=4 2=2 3=3 4=2 5=3 6=3 7=2 8=3` → `OVERALL: 4.0/10` → `VERDICT: FAIL`.
- Các lỗi hình ảnh nghiêm trọng nhất:
  1. **Vật thể lạ thay thế não:** Chiếc đồng hồ báo thức vỏ đỏ trong phòng ngủ bị đặt lọt giữa mô não; vòng đồng hồ sinh học là một vành cam cháy không số không kim; tế bào thần kinh là hai cục tím trơn không có sợi/nhánh.
  2. **Khung hình trống:** 1/3 video rơi vào mảng xanh rỗng (#116), sàn nhà trống (#143), góc tường tối (#167); các số liệu được đọc (15 phút, 30 phút, 90 phút, 48 phút, 3 giờ chiều) không có chỉ báo trực quan trên hình.
  3. **Hình ảnh mâu thuẫn lời dẫn:** Hạt phân tử cà phê bị rút đi thay vì chất thải adenosine (#70–#78); người không úp mặt xuống bàn; áo khoác không được gấp cất đi (#183–#184).

### 3. Sự cố dừng lại giữa chừng (Premature Completion)
- Tại turn 1579, sau khi nhận kết quả chấm hình FAIL (3.4/10 và 4.0/10), agent bất ngờ dừng lại và gửi thông điệp "Bàn giao cuối — trạng thái thật, không che giấu gì".
- Người dùng phải can thiệp ở turn 1580: *"Sao có review rồi bạn không triển khai review đó hả mà dừng lại"*.
- Agent sau đó mới tiếp tục vá code (`src/set_desk.js`, `src/ch1.js`), nhưng làm bằng shell heredoc và tiếp tục chuỗi lệnh `sleep 540..560` để chờ render.

### 4. Kết quả từ Supervisor (`tools/supervise.sh`)
- Supervisor liên tục báo động `Gate: FAIL` và `VERDICT: CONCERNS` với các lỗi cơ học:
  - 41 vi phạm R5 (thăm dò bằng `sleep` lên tới 15 phút mỗi lần).
  - Vi phạm R1 (dùng shell heredoc patch file `src/*.js`).
  - `drawcheck` thất bại với exit code 1 vì không tìm thấy hàm helper 2D canvas trong phim 3D.
  - `check_citations` thất bại do `PMID 16676778` thiếu dấu hai chấm.
  - `check_films_index` thất bại do `"runtime": "1058.0s"` không đúng chuẩn `M:SS`.
  - Hai tiêu đề khác nhau giữa `film.json` ("Vì sao ngủ trưa dậy lại mệt hơn?") và `TREATMENT.md` ("Vì sao ngủ trưa dậy lại mệt hơn lúc mới ngủ?").

---

## Phát hiện và Biện pháp khắc phục (Findings & Guards)

### S1 — critical — `drawcheck.mjs` làm hỏng cổng kiểm tra của toàn bộ phim 3D
**Bằng chứng.** `drawcheck.mjs:298` thoát mã lỗi 1 với thông báo: `drawcheck: could not check ...: no helper in the film's source or in the files it imports — nothing was audited / FAILED`. Phim của kênh Trạm Nghĩ Nhiều dựng trên Three.js (`import * as THREE from 'three'`), không sử dụng các hàm vẽ 2D canvas (`rect`, `cel`, `path`). Do đó toàn bộ các tập 3D đều bị fail ở bước CI (`films.yml:87`) và supervisor gate.
**Biện pháp (Guard now).**
1. Cập nhật `core/render/drawcheck.mjs`: nhận diện `rrect` (rounded rect) và nhận diện các phim dựng 3D (Three.js scene rig) để không ép buộc helper 2D, đồng thời vẫn kiểm tra chuỗi vẽ thô (`checkRawText`).
2. Xuất `rect` và `rrect` chính quy trong `channels/tram-nghi-nhieu/rig/render.js` để lớp 2D overlay của 3D rig đáp ứng đầy đủ quy chuẩn audit.

### S2 — high — `tools/check_citations.py` bắt bẻ cứng nhắc dấu câu khiến nguồn khoa học hợp lệ bị đánh rớt
**Bằng chứng.** Dòng 16 trong `research/FACTS.md` ghi `(Zeitzer 2006, PMID 16676778)` theo cách viết phổ biến trong y văn. `tools/check_citations.py:18` định nghĩa regex `IDENTIFIER` bắt buộc phải có dấu `:` (`\bpmid\s*:\s*\S`), dẫn đến việc toàn bộ file nghiên cứu bị đánh rớt và chặn build, dù nguồn hoàn toàn truy xuất được.
**Biện pháp (Guard now).** Cập nhật `tools/check_citations.py` với regex `\bpmid\s*:?\s*\d+` và `\bdoi\s*:?\s*...` cho phép dấu hai chấm là tuỳ chọn. Đồng thời chuẩn hoá dòng 16 trong `FACTS.md` thành `PMID: 16676778`.

### S3 — high — `filmcheck.mjs` không kiểm tra định dạng `runtime` và sự nhất quán tiêu đề
**Bằng chứng.** `film.json` lưu `"runtime": "1058.0s"`, và tiêu đề là `"Vì sao ngủ trưa dậy lại mệt hơn?"`, trong khi `TREATMENT.md` là `"Vì sao ngủ trưa dậy lại mệt hơn lúc mới ngủ?"`. `filmcheck.mjs` kiểm tra cục bộ lại bỏ qua, để lọt lỗi đến tận bước `tools/check_films_index.py` và CI mới phát hiện.
**Biện pháp (Guard now).** `core/render/filmcheck.mjs` (Mục 6) hiện kiểm tra:
1. `runtime` trong `film.json` bắt buộc phải đúng định dạng `M:SS` (`^\d+:[0-5]\d$`).
2. `title` trong `film.json` bắt buộc phải khớp với tiêu đề khai báo trong `TREATMENT.md`.

### S4 — medium — Tiêu đề phim bị phân mảnh giữa manifest và tài liệu sản xuất
**Bằng chứng.** `film.json`, `CREDITS`, `index.html` dùng tiêu đề rút gọn `"Vì sao ngủ trưa dậy lại mệt hơn?"`, trong khi `TREATMENT.md`, `research/FACTS.md`, `LOOK.md` và `src/film.js` dùng tiêu đề đầy đủ `"Vì sao ngủ trưa dậy lại mệt hơn lúc mới ngủ?"`. `FILMS.md` in ra tiêu đề không đồng bộ.
**Biện pháp (Guard now).** Đồng bộ toàn bộ về tiêu đề chuẩn `"Vì sao ngủ trưa dậy lại mệt hơn lúc mới ngủ?"`, chạy `tools/gen_films_index.py` để cập nhật `FILMS.md`.

### S5 — high — 95 lần gọi `sleep` thăm dò gây nghẽn shell suốt 8 giờ
**Bằng chứng.** Agent thực hiện 95 lần gọi `sleep 300..900` trong bash để chờ render và review. Thao tác này vi phạm trực tiếp quy tắc R5 trong `CODING_STANDARDS.md`, làm shell chính bị khoá, các lệnh sau phải chạy trong temporary subshell và mất biến môi trường.
**Biện pháp (Guard now).** Bổ sung điều khoản nghiêm cấm `sleep` thăm dò vào `channels/tram-nghi-nhieu/CHANNEL.md` và `AGENTS.md`. Nhắc nhở cơ chế await hoặc chạy tác vụ đồng bộ của harness.

### S6 — high — Dừng làm việc sớm và bàn giao khi review vẫn đang FAIL
**Bằng chứng.** Sau khi chạy review hình ảnh và nhận kết luận FAIL (3.4/10 và 4.0/10), agent dừng làm việc và báo cáo bàn giao cuối cho người dùng thay vì tiếp tục khắc phục lỗi theo danh sách `[CHẶN]` và `[NẶNG]`.
**Biện pháp (Guard now).** Bổ sung điều khoản **Kiểm tra và Nghiệm thu (Delivery Gate)** trong `channels/tram-nghi-nhieu/CHANNEL.md` và quy trình của `AGENTS.md`: Tuyệt đối không dừng lại hoặc bàn giao khi `review.sh` hoặc `gate.py` mang `VERDICT: FAIL`. Phải xử lý triệt để các lỗi chặn/nặng và đạt PASS trước khi bàn giao.
