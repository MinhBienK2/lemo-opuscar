# Bước 5: Code Linh kiện 3D Độc lập (Modular 3D Coding)

## Mục tiêu
Dựa trên `COMPONENTS_SPEC.md` đã được duyệt ở Bước 4, lập trình toàn bộ các linh kiện, đạo cụ vào `src/props.js` (hoặc các file module thành phần) dưới dạng các hàm độc lập.

## Quy chuẩn kỹ thuật Three.js của kênh
- **Vật thật dựng đúng là nó:** Không dùng các khối hình học nguyên sinh trơn tuột (cấm cylinder hoặc box trơ trọi để biểu diễn đồ vật phức tạp).
- **Vật liệu Toon:** Dùng `MeshToonMaterial` của Three.js với `color`, `gradientMap`, `toonMat`, hoặc `canvasTex` có hạt ngẫu nhiên (`seed`). **LƯU Ý:** `MeshToonMaterial` không phải PBR shader, KHÔNG khai báo `roughness` hoặc `metalness` để tránh cảnh báo rác log.
- **Ruột máy móc:** Tận dụng `channels/tram-nghi-nhieu/rig/parts.js` (lò xo, chip, bánh răng, cuộn cảm, pin).
- **Vật phải biết cử động:** một vật đứng yên là một vật chết, và phim sẽ chỉ còn camera trượt qua những
  đạo cụ đứng chết. Mỗi vật trong `src/props.js` phải có phần cập nhật theo thời gian: vải đung đưa theo
  gió, quạt xoay, giọt nước co lại, kim đồng hồ chạy, hạt hơi bay, nước chảy. `channels/tram-nghi-nhieu/rig/motion.js`
  có sẵn `sway()`, `breathe()`, `spinUp()`… để dùng, hoặc tự viết bằng `Math.sin` như `demo/room.js` làm.
  Bước 6 phải gọi hàm cập nhật này mỗi khung hình; vật nào không được gọi thì vật đó đứng yên trong phim.
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
2. **Ghi `src/MAP.md`**: một bảng ngắn "tên hàm → dòng" cho `props.js`, `set.js`, `film.js`. Tệp mã của tập
   này lớn hơn hai trăm kB; một lần đọc lại nó để tìm một chỗ sửa là mất hàng chục nghìn dòng ngữ cảnh, và
   tập sau sẽ phải trả giấy đó nhiều lần. Có bản đồ thì tìm chỗ sửa là một lệnh `grep`.
3. Kiểm tra trực quan bằng công cụ propcheck chuyên biệt của kênh:
   `LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/tools/propcheck.mjs <tập>`
   (Công cụ này xuất ra ảnh xoay 3 phía của từng vật thể đứng riêng lẻ).
4. **Vòng lặp Thẩm định Linh kiện 3D (Max 5 rounds):**
   - Nạp `step5-props-code/PROMPT_CRITIC.md` triệu hồi Subagent 3D Code Critic.
   - Thử nghiệm nhận diện gián tiếp (Blind recognition test): Subagent nhìn ảnh render của vật thể (không nhìn tên file) xem có nhận diện đúng đồ vật không. Nếu nhận diện sai $\rightarrow$ Dựng chưa tới, phải sửa hình khối.
   - **Đạo diễn tiếp nhận:** Tinh chỉnh tỷ lệ, thêm rãnh, viền, độ bo góc (`cushionGeo`), chỉnh màu vật liệu.
   - Lặp lại tối đa 5 hiệp cho tới khi `VERDICT: PASS`.
