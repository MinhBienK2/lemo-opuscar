# Bước 6: Lắp ghép Cảnh, Diễn hoạt & Nhịp điệu (Assembly, Animation & Beatsheet)

## Mục tiêu
Lắp ráp các linh kiện (từ `src/props.js`) vào bối cảnh hoàn chỉnh (`src/film.js`, `src/ch*.js`), thiết lập camera di chuyển, keyframes diễn hoạt khớp với từng từ của giọng đọc, và kiểm tra nhịp điệu toàn phim.

## Quy chuẩn kỹ thuật
- **Timeline đồng bộ:** Khớp từng chuyển động theo từ ngữ thông qua `V.w(line_id, 'từ_khoá')`.
- **Cơ chế nhân quả:** Khi có lực tác động $\rightarrow$ vật thể phải biến đổi thấy được trong 1-2 giây.
- **Dòng chảy vô hình:** Dùng `flow()` to bản, có điểm xuất phát rõ ràng và điểm tiếp xúc thực tế (không dùng mũi tên vẽ lơ lửng).
- **Thẻ thuật ngữ (`label`):** Tối đa 1 thẻ xuất hiện cùng lúc, mũi tên chỉ đúng điểm tiếp xúc.

## Quy trình thực hiện
1. Dựng bối cảnh phòng (Set): Đặt các props vào đúng tọa độ, gắn camera, thiết lập đèn chính in bóng qua lỗ tường (`wallWithHole`).
2. Viết keyframes diễn hoạt với `keys()` và easing tự nhiên (có lấy đà và vung đà).
3. Chạy công cụ kiểm tra nhịp điệu khung hình (Beatsheet):
   `LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/tools/beatsheet.mjs <tập> --out <scratch>`
4. **Vòng lặp Thẩm định Diễn hoạt & Khung cảnh (Max 5 rounds):**
   - Nạp `step6-assembly/PROMPT_CRITIC.md` triệu hồi Subagent Scene Critic.
   - Quét và triệt tiêu 4 cờ lỗi hệ thống:
     - `DARK`: Vùng diễn hoạt bị thiếu sáng $\rightarrow$ Thêm đèn điểm hoặc `pool`.
     - `SAME`: 2 câu thoại liên tiếp có hình ảnh giống hệt nhau $\rightarrow$ Cắt máy, đổi góc hoặc thay đổi trạng thái vật.
     - `NUM`: Câu nói có con số nhưng hình không có đồng hồ/thước đo $\rightarrow$ Bổ sung hiển thị trực quan.
     - `RUN`: Cảnh kéo dài quá lâu không có biến chuyển máy quay.
   - Chạy review từng phân đoạn: `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --lines a-b`.
   - **Đạo diễn tiếp nhận:** Điều chỉnh timing, camera track, ánh sáng.
   - Lặp lại tối đa 5 hiệp cho tới khi `VERDICT: PASS`.
