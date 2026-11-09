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
   `LEMO_ANGLE=vulkan node core/render/still.mjs <tập> <t…> --out <tập>/review/hero`
   **Đặt ảnh vào `<tập>/review/hero/`**: vòng chấm của bước này chấm đúng các ảnh trong đó.
4. Ghi nhật ký phân tích vào `LOOK.md`: mỗi nhát trích đúng câu lời kể của nó (`check_storyboard.py` so với
   `voice/lines.json`).
5. **Chấm:** `sh channels/tram-nghi-nhieu/tools/review.sh <tập> look`. Người chấm so từng ảnh trong `review/hero/`
   với khung mẫu của kênh (`demo/stills/`) theo `step3-storyboard/RUBRIC.md`. `hero/` rỗng thì vòng không chạy.
   Dựng lại một ảnh thì chỉ ảnh đó được chấm lại.
6. **Sửa:** `fixbrief.py <tập> look` in bản giao việc cho người sửa (SKILL, "Sửa sau vòng chấm"). Người sửa chép ảnh
   mới đè lên ảnh cũ trong `review/hero/`, rồi bạn chạy lại bước 5.
