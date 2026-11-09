# Bước 6: Lắp ghép Cảnh, Diễn hoạt & Nhịp điệu (Assembly, Animation & Beatsheet)

## Mục tiêu
Lắp ráp các linh kiện (từ `src/props.js`) vào bối cảnh hoàn chỉnh (`src/film.js`, `src/ch*.js`), thiết lập camera di chuyển, keyframes diễn hoạt khớp với từng từ của giọng đọc, và kiểm tra nhịp điệu toàn phim.

## Quy chuẩn kỹ thuật
- **Timeline đồng bộ:** Khớp từng chuyển động theo từ ngữ thông qua `V.w(line_id, 'từ_khoá')`.
- **Diễn hoạt vật thể (Props Acting):** Tận dụng `channels/tram-nghi-nhieu/rig/motion.js` để vật thể luôn chuyển động sống động:
  - Dùng `sway()` cho vải, dây, rèm đung đưa theo gió.
  - Dùng `breathe()` cho vật thể nhấp nhô nhịp thở vi mô (tránh khung hình chết).
  - Dùng `motor()` cho quạt, bánh xe xoay có quán tính tăng/giảm tốc.
  - Dùng `actionAt()` gắn trực tiếp vào mốc từ ngữ (`V.w(id, 'từ')`) để đồ vật phản ứng tức thì (co lại, biến mất, nảy lên).
  - Dùng `particleStream()` tạo dòng hạt bay biểu diễn gió, hơi nước, nhiệt, điện cực nhẹ GPU.
- **Cấm camera rỗng (No aimless camera pan):** Tuyệt đối không chống chế cờ `SAME` bằng cách chỉ nhích nhẹ camera trên một bối cảnh chết. Camera chỉ chuyển động khi bám theo hành động của đồ vật hoặc cơ chế vật lý.
- **Cơ chế nhân quả:** Khi có lực tác động $\rightarrow$ vật thể phải biến đổi thấy được trong 1-2 giây.
- **Mốc nhịp (`markBeats`):** mỗi câu lời kể gắn một mốc vào `window.EV` — một lệnh cho cả tập:
  `markBeats(ev, V, (id, t) => [x, y])`, trong đó `(id, t)` **đặt máy ở đúng góc của câu đó** rồi trả về
  điểm của nhịp **trên khung 1920×1080** (`toScreen(point, camera)` cho một điểm trong không gian: điểm
  thẻ thuật ngữ nếu câu có thẻ, không thì là điểm máy đang nhìn). Nhờ đó `tools/check_motion.py` đo được
  câu hỏi mà đếm pixel không trả lời được: **nhịp này có làm thay đổi phần khung của nó không** (cổng đòi
  ≥ 75 % nhịp đổi). Không có mốc thì cổng chỉ đo được "có gì đó động", không đo được "câu này đứng yên".
- **Dòng chảy vô hình:** Dùng `flow()` hoặc `particleStream()` to bản, có điểm xuất phát rõ ràng và điểm tiếp xúc thực tế (không dùng mũi tên vẽ lơ lửng).
- **Thẻ thuật ngữ (`label`):** Tối đa 1 thẻ xuất hiện cùng lúc, mũi tên chỉ đúng điểm tiếp xúc. Một thẻ gọi tên một vật thì **neo vào chính vật đó** (`at: t => vị trí của vật`), không phải một toạ độ cố định trong không gian: vật chuyển động và máy quay đổi góc là thẻ trỏ sang vật khác, và người xem đọc ngược thành nghĩa sai.
- **Cửa sổ thẻ (`cardWindow`):** thẻ hiện từ lúc máy cắt sang nhát của câu và tắt khi câu hết; câu ngắn thì thẻ không đủ lâu để đọc trọn. Lấy cửa sổ bằng `cardWindow(C, V)` của `rig/render.js` (`for (const C of CARDS) Object.assign(C, cardWindow(C, V));`), và kéo dài nó bằng `hold` (giữ lâu hơn) hoặc `lead` (hiện sớm hơn), tính theo giây — chỉ khi vật thẻ bám vào vẫn còn trong khung.
## Quy trình thực hiện
1. Dựng bối cảnh phòng (Set): Đặt các props vào đúng tọa độ, gắn camera, thiết lập đèn chính in bóng qua lỗ tường (`wallWithHole`).
2. Viết keyframes diễn hoạt với `keys()` và easing tự nhiên (có lấy đà và vung đà).
3. Chạy công cụ kiểm tra nhịp điệu khung hình (Beatsheet):
   `LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/tools/beatsheet.mjs <tập> --out <tập>/out/beats`
   Dựng vào đúng đường dẫn đó: bước chấm sẽ **dùng lại** tờ sheet này nếu không có mã nào đổi sau lần dựng, thay vì dựng lại sáu mươi khung.
   Rồi đọc những lỗi máy đã thấy sẵn, **trước khi** mở một vòng chấm:
   `python3 channels/tram-nghi-nhieu/tools/check_shots.py <tập>/out/beats` — nó liệt kê câu có cờ
   SAME/RUN/NUM/DARK và câu có khung gần như trống, kèm đề xuất sửa. Câu mà máy **không nhìn thấy vật
   nào** in thành một mục riêng: đó không phải lỗi, hãy tự nhìn, và **đừng đưa máy sát chỉ để đẩy
   con số lên**. Một vòng chấm tốn ~40 phút và
   người chấm chỉ mở được khoảng 25/60 khung, nên lỗi máy thấy sẵn thì đừng để người chấm là
   người phát hiện ra.
4. **Vòng lặp Thẩm định Diễn hoạt & Khung cảnh (Max 5 rounds):**
   - Nạp `step6-assembly/PROMPT_CRITIC.md` triệu hồi Subagent Scene Critic.
   - Quét và triệt tiêu 4 cờ lỗi hệ thống:
     - `DARK`: Vùng diễn hoạt bị thiếu sáng $\rightarrow$ Thêm đèn điểm hoặc `pool`.
     - `SAME`: 2 câu thoại liên tiếp có hình ảnh giống hệt nhau $\rightarrow$ Cắt máy, đổi góc hoặc thay đổi trạng thái vật.
     - `NUM`: Câu nói có con số nhưng hình không có đồng hồ/thước đo $\rightarrow$ Bổ sung hiển thị trực quan.
     - `RUN`: Cảnh kéo dài quá lâu không có biến chuyển máy quay.
   - Chọn đường chấm theo độ dài tập: tập ngắn (≤ 30 câu) thì chấm cả phim — `sh channels/tram-nghi-nhieu/tools/review.sh <tập>`; tập dài thì **chia chương trước** (`src/chapters.js`: mỗi chương `{ id: 'ch1', lines: ['c1', 'c10'], files: [...] }`, các chương phủ hết các câu, đúng thứ tự), rồi chấm từng chương — `review.sh <tập> --chapter <id>`. Mỗi chương có 5 lượt riêng và cổng mở khi **mọi chương** PASS; cổng không mở bằng một vòng chấm cả phim của tập dài. `--lines a-b` (3 lượt mỗi cảnh) dùng để soi lại đúng một cảnh vừa sửa.
   - **Hết lượt thì không chấm lần thứ sáu.** Ba lối ra, rẻ nhất trước: `--lines a-b` cho đúng câu đã sửa → chia chương rồi chấm từng chương → **đạo diễn cắt** (tệp trong `review/`, kết thúc bằng `VERDICT: PASS`, nêu rõ cái gì đã cắt, **viết sau lần sửa code cuối** vì cổng so mốc và từ chối bản cắt cũ). Tên tệp bản cắt của từng bước: `channels/tram-nghi-nhieu/tools/README.md`.
   - **Đạo diễn tiếp nhận:** Điều chỉnh timing, camera track, ánh sáng.
   - Lặp lại tối đa 5 hiệp cho tới khi `VERDICT: PASS`.
