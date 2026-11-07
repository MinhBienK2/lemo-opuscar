# Bước 5: Code Linh kiện 3D Độc lập (Modular 3D Coding)

## Mục tiêu
Dựa trên `COMPONENTS_SPEC.md` đã được duyệt ở Bước 4, lập trình toàn bộ các linh kiện, đạo cụ vào `src/props.js` (hoặc các file module thành phần) dưới dạng các hàm độc lập.

## Quy chuẩn kỹ thuật Three.js của kênh
- **Vật thật dựng đúng là nó:** Không dùng các khối hình học nguyên sinh trơn tuột (cấm cylinder hoặc box trơ trọi để biểu diễn đồ vật phức tạp).
- **Vật liệu Toon:** Dùng `toonMat`, `canvasTex` có hạt ngẫu nhiên (`seed`) cho các bề mặt lớn.
- **Ruột máy móc:** Tận dụng `channels/tram-nghi-nhieu/rig/parts.js` (lò xo, chip, bánh răng, cuộn cảm, pin).
- **Cấu trúc xuất khẩu chuẩn:**
  ```javascript
  export const PROPS = {
    'tên_đạo_cụ_kèm_trạng_thái': (opts) => {
      const group = new THREE.Group();
      // logic dựng hình chi tiết
      return group;
    }
  };
  ```

## Quy trình thực hiện
1. Viết code độc lập từng linh kiện vào `src/props.js`.
2. Kiểm tra trực quan bằng công cụ propcheck chuyên biệt của kênh:
   `LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/tools/propcheck.mjs <tập>`
   (Công cụ này xuất ra ảnh xoay 3 phía của từng vật thể đứng riêng lẻ).
3. **Vòng lặp Thẩm định Linh kiện 3D (Max 5 rounds):**
   - Nạp `step5-props-code/PROMPT_CRITIC.md` triệu hồi Subagent 3D Code Critic.
   - Thử nghiệm nhận diện gián tiếp (Blind recognition test): Subagent nhìn ảnh render của vật thể (không nhìn tên file) xem có nhận diện đúng đồ vật không. Nếu nhận diện sai $\rightarrow$ Dựng chưa tới, phải sửa hình khối.
   - **Đạo diễn tiếp nhận:** Tinh chỉnh tỷ lệ, thêm rãnh, viền, độ bo góc (`cushionGeo`), chỉnh màu vật liệu.
   - Lặp lại tối đa 5 hiệp cho tới khi `VERDICT: PASS`.
