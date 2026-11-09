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
- **Bóng đổ không được đọc như một lỗ hình:** bóng cứng của một vật đứng ngoài khung mà rơi vào giữa khung sẽ thành một khối sẫm không có viền mực — người xem tưởng phim hỏng (tập 01, c27). Khi dựng xong một nhát, nhìn lại: khối sẫm nào trong khung không khớp với vật nào thì đó là bóng của một vật (hoặc của một mạng hình hỏng) ngoài khung — sửa vật đó, hoặc dời ánh sáng để bóng đổ không rơi vào giữa khung.
- **Tìm bóng của ai thì đo, đừng đoán:** `node channels/tram-nghi-nhieu/tools/shadow_who.mjs <tập> --at <giây>` tìm ô tối nhất do bóng, rồi tắt lần lượt từng vật trong `scene` và đo ô đó — vật nào làm ô sáng lên nhiều nhất là vật đổ bóng (nó in ra số thứ tự, màu và vị trí của vật đó). Vì viền mực là hiệu ứng sau-render nên bóng không có cạnh: đừng dựng từng vật lên rồi so hình dáng, và đừng tự viết cờ tắt bóng vào `src/` của tập — công cụ đó vá rig ngay trong trình duyệt, nên mã của phim không bị dính mã chẩn đoán
- **Mốc nhịp (`markBeats`):** mỗi câu lời kể gắn một mốc vào `window.EV` — một lệnh cho cả tập:
  `markBeats(ev, V, (id, t) => [x, y])`, trong đó `(id, t)` **đặt máy ở đúng góc của câu đó** rồi trả về
  điểm của nhịp **trên khung 1920×1080** (`toScreen(point, camera)` cho một điểm trong không gian: điểm
  thẻ thuật ngữ nếu câu có thẻ, không thì là điểm máy đang nhìn). Nhờ đó `tools/check_motion.py` đo được
  câu hỏi mà đếm pixel không trả lời được: **nhịp này có làm thay đổi phần khung của nó không** (cổng đòi
  ≥ 75 % nhịp đổi). Không có mốc thì cổng chỉ đo được "có gì đó động", không đo được "câu này đứng yên".
- **Dòng chảy vô hình:** Dùng `flow()` hoặc `particleStream()` to bản, có điểm xuất phát rõ ràng và điểm tiếp xúc thực tế (không dùng mũi tên vẽ lơ lửng).
- **Thẻ thuật ngữ (`label`):** Tối đa 1 thẻ xuất hiện cùng lúc, mũi tên chỉ đúng điểm tiếp xúc. Một thẻ gọi tên một vật thì **neo vào chính vật đó** (`at: t => vị trí của vật`), không phải một toạ độ cố định trong không gian: vật chuyển động và máy quay đổi góc là thẻ trỏ sang vật khác, và người xem đọc ngược thành nghĩa sai.
- **Thẻ phải có `anchor` — tên vật nó gắn vào.** Mỗi thẻ trong `CARDS` mang thêm `anchor: '<tên vật trong src/props.js>'` (khóa của danh mục vật **chính là** tên vật), và máy kiểm ba điều: mã neo có thật trong danh mục không, chữ của nhãn có phải của **đúng vật đó** không (nếu chữ nhãn khớp vật khác rõ hơn thì nhãn đang nói về vật khác), và chữ nhãn có đọc ra là của vật khác không (nhãn "ÁO PHÔNG" mà có cả áo ướt lẫn áo khô thì phải có phần định tính: "áo màu sẫm"). Tập 01, 2:18: nhãn "CHỒNG LÊN NHAU" chỉ vào một cái áo đơn, trong khi chữ của nó thuộc về *đàn áo phơi chồng* — đúng lỗi mà máy bắt được sau này.
- **Thẻ bám vật qua nhiều nhát:** nếu hai câu liên tiếp nói về cùng một vật mà câu sau không nhắc lại tên nó, **giữ thẻ gọi tên vật đó ở câu sau** (tối đa 1 thẻ) — người xem khớp bằng mắt, không bằng trí nhớ. Tập 01: cái áo ướt có thẻ "KHÔNG CÓ GIÓ" ở c5 nhưng c6, nơi khác biệt hiện ra rõ nhất, thì không — người xem phải tự nhớ.
- **Thẻ nằm trọn trong khung:** một thẻ bị mép khung cắt là một thẻ không có (tập 01, 0:22: nhãn "KHÔNG CÓ GIÓ" bị mép trên cắt mất). Mũi tên phải chạm **tâm vật** mà lời kể đang nói, không chỉ vào mép một vật tình cờ nằm cạnh (tập 01, 2:18).
- **Cận cảnh phải đọc ra đặc trưng của vật:** cận sợi vải mà đọc như một tấm bìa phẳng có vân in thì mất đúng thứ cần thấy (tập 01, 0:32–0:37: phải đọc ra sợi đan qua nhau). Tự hỏi: tắt tiếng, người xem có nói ra được đặc trưng của vật trong khung này không?
- **Không để một vùng phẳng chiếm gần nửa khung:** mảng tường trơn, vùng tối trống hay trần trơn chiếm sân khung là khung không kể chuyện (tập 01: 45 % tường ở 0:12, 35 % tối ở 0:27, 60 % trần ở 0:68). Dùng đạo cụ, bóng đổ, hay đưa máy sát hơn.
- **Không có điểm cháy trắng:** một quầng sáng lõi bão hoà kéo mắt người xem khỏi chỗ cần nhìn (tập 01, c27).
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
   - **Một tập, một vòng chấm.** Thứ tự của cổng là props → storyboard → assets → picture → final: mỗi vòng sau phán trên kết quả vòng trước. Chạy hai vòng của cùng một tập cùng lúc là hai phán quyết trên hai mã nguồn khác nhau, và chúng tranh nhau máy. Đọc phán quyết **đúng một lần**, sửa theo nó, rồi mới mở vòng kế tiếp.
   - **Đợi khi máy đang quá tải.** Máy của kênh dùng chung với các phiên khác: nhiều tờ nhịp điện và nhiều người chấm cùng lúc làm máy hết swap, một tờ sheet mất hàng chung phút, và vòng chấm chết đúng giờ — mà lỗi nằm ở máy, không ở tập. Lệnh nặng (mở vòng chấm, dựng tờ sheet) sẽ bị chặn kèm danh sách việc đang chạy; lúc đó chờ rồi chạy lại, đừng mở thêm vòng.
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
