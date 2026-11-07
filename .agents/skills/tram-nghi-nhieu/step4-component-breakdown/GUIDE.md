# Bước 4: Bóc tách Linh kiện 3D chi tiết (3D Component Breakdown & Spec)

## Mục tiêu
Dựa trên Storyboard (Bước 3) và Kịch bản (Bước 2), bóc tách toàn bộ các thành phần 3D thành bản đặc tả kỹ thuật `COMPONENTS_SPEC.md`. Không được bỏ sót bất kỳ chi tiết nào dù là nhỏ nhất.

## Nguyên tắc cốt lõi
1. **Dựng đúng góc nhìn camera:** Nhờ có Storyboard, ta biết chính xác vật nào cần độ nét cao (LOD cao) ở tiền cảnh, vật nào chỉ cần khối thô ở hậu cảnh. Không tốn tài nguyên dựng góc khuất camera không nhìn tới.
2. **Module hóa 100%:** Mỗi vật thể, đạo cụ, bối cảnh phải là một hàm khởi tạo riêng biệt (`factory function`).
3. **Phân loại thành 4 nhóm linh kiện bắt buộc:**
   - **Nhóm 1: Props (Đạo cụ tương tác):** Ly nước, cái bàn, bình gas, củ khoai tây, công tắc, v.v. Kèm trạng thái (nguyên vẹn, mở nắp, phát sáng).
   - **Nhóm 2: Internal Parts (Ruột & Cơ chế vi mô):** Lò xo, dây dẫn, van áp suất, hạt phân tử, dòng chảy chất lỏng/khí `flow()`, mặt cắt `section()`.
   - **Nhóm 3: Set & Environment (Bối cảnh phòng):** Bàn làm việc, góc bếp, sàn gạch, tường có lỗ nắng `wallWithHole`, rèm cửa.
   - **Nhóm 4: FX & Lighting (Đèn & Hiệu ứng sống):** Đèn chính `keyLight`, vệt sáng `pool`, hơi nước lay nhẹ, tia lửa `sparks`.

## Quy trình thực hiện
1. Soát từng câu thoại trong `voice/lines.json` và từng shot trong Storyboard: Ghi lại mọi danh từ, hành động tương tác.
2. Viết file `COMPONENTS_SPEC.md` với schema rõ ràng:
   - Tên component
   - Vai trò & Shot xuất hiện
   - Cự ly hiển thị (Close-up hay Background)
   - Trạng thái động (Tĩnh hay có Animation khớp nối)
   - Tên hàm code dự kiến (vd: `createThermosFlask()`)
3. **Vòng lặp Audit Linh kiện (Max 5 rounds):**
   - Nạp `step4-component-breakdown/PROMPT_CRITIC.md` triệu hồi Subagent Asset Auditor.
   - Subagent đối chiếu chéo kịch bản và danh mục component: Bắt lỗi thiếu sót đồ vật, cơ chế chưa có linh kiện biểu diễn.
   - **Đạo diễn tiếp nhận:** Bổ sung ngay các linh kiện còn thiếu.
   - Lặp lại tối đa 5 hiệp cho tới khi `VERDICT: PASS`.
