# Bước 3: Storyboard & Khung hình Hero (Visual Framing & Camera)

## Mục tiêu
Xác định bố cục hình ảnh, góc đặt máy quay (camera framing), cự ly máy (wide, medium, close-up, cutaway) và ánh sáng trước khi bắt tay vào dựng 3D.

## Quy chuẩn hình ảnh kênh
- **Diorama 3D Toon:** Cảnh vật như mô hình thu nhỏ đặt trong căn phòng có ánh sáng thật.
- **Ánh sáng:** Đèn chính in bóng rõ nét qua tường có lỗ (`wallWithHole`), có vệt sáng hoặc chùm sáng (`pool`), không để cảnh tối mờ mịt (`DARK`).
- **Góc máy:** Luôn có lý do đạo diễn:
  - Khung Hero 1: Góc nhìn đời thực (đặt trên bàn, trong bếp, trong phòng tắm).
  - Khung Hero 2: Cận cảnh hoặc mặt cắt cơ chế (`cutaway`, `section`).

## Quy trình thực hiện
1. Liệt kê danh sách shot (Shot list) tương ứng với các phân đoạn trong kịch bản.
2. Xác định cự ly camera (Camera Frustum):
   - Camera nhìn thấy những góc nào?
   - Những góc nào bị khuất (để không tốn công dựng 3D ở bước sau)?
3. Xuất các khung hình tham chiếu thử nghiệm:
   `LEMO_ANGLE=vulkan node core/render/still.mjs <tập> <t…> --out <scratch>`
4. Ghi nhật ký phân tích vào `LOOK.md`.
5. **Vòng lặp Thẩm định Storyboard (Max 5 rounds):**
   - Mở vòng chấm bằng **công cụ của kênh**: `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --storyboard`.
     Công cụ nạp mẫu `step3-storyboard/PROMPT_CRITIC.md`, đánh số vòng, ký tên người chấm và đóng tem
     `review/STORYBOARD.pass`. **Không** tự gọi subagent: báo cáo của nó rơi vào một tệp không ai đọc,
     không ai đếm vòng, không ai ký.
   - Subagent soi: Bố cục có rối không, vật chính có nằm ở điểm vàng không, góc máy có che lấp cơ chế không.
   - **Đạo diễn tiếp nhận:** Điều chỉnh góc máy, độ nghiêng (pitch/yaw), tiêu cự camera.
   - Lặp lại tối đa 5 hiệp cho tới khi `VERDICT: PASS`. Hết lượt thì chốt bằng bản cắt của đạo diễn:
     `review/STORYBOARD-DIRECTORS-CUT.md`, kết thúc bằng `VERDICT: PASS`, nêu rõ nhát nào đã cắt, và
     **viết sau lần sửa code cuối** — bản cắt cũ không nói gì về code hiện tại.
