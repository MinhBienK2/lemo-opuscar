# Trạm Nghĩ Nhiều — hình

Đồ chơi 3D toon trong một diorama có ánh sáng thật, viền mực vẽ tay, in trên giấy. Ấm và có chất liệu, không lạnh kiểu render sản phẩm. Khung tham chiếu: `demo/stills/`.

## Bất biến

- **Động cơ**: three.js 0.170, mọi khung đi qua `rig/render.js` (siêu mẫu 2×, viền mực post-process, bloom ngưỡng 1, grade mực–giấy). Không dùng `OutlineEffect`, không tone mapping ACES.
- **Chất liệu**: `MeshToonMaterial` với gradient 4 bậc (`toon()`). Mỗi bề mặt lớn có texture vẽ bằng canvas có seed (gỗ, vải, giấy dán tường, kim loại, nhựa có nhãn…). Không khối trơn một màu ở trung và tiền cảnh.
- **Bảng màu** (`rig/kit.js:PAL`): kem `#fff0d8`, vàng nghệ `#f7bd27`, navy `#252d50`, tím `#9a5be5`, đỏ `#f04462`, cyan `#67e8f9`, cam `#ff8a3d`, mực `#171a2b`. Nền thường ở tông navy–tím trung tối; màu bão hoà dành cho điểm nhấn.
- **Ánh sáng**: một đèn chính có hướng, đổ bóng, đi qua một khe có hình (cửa sổ, rèm, lá, song sắt, khe cửa) để bóng tự kể nơi chốn; fill hemi navy; viền tím; fog. Một nguồn ấm duy nhất ở điểm nhìn.
- **Sáng tối**: vùng sáng nhất khung là điểm nhìn. Không mảng trắng cháy ngoài vật tự phát sáng. Không mảng bão hoà lớn chiếm nửa khung.
- **Chiều sâu**: ≥ 3 lớp có che lấp (tiền cảnh đồ vật cắt mép khung, trung cảnh hành động, hậu cảnh có nguồn sáng hoặc cửa sổ).
- **Cơ chế vô hình thành vật thể có vật lý**: dòng hạt, đám đông qua cửa hẹp, tia lửa có trọng lực, gợn nhiệt bị trần chặn. Có tham số và có nhân quả, không phải sơ đồ, vòng tròn đồng tâm hay mũi tên.
- **Máy quay** đi xuyên không gian khi câu chuyện đi (theo dây, chui vào vật, lùi ra), giữ yên khi cần nhìn. Chuyển cảnh bằng loé sáng màu của cảnh sau hoặc bằng đi xuyên.
- **Chuyển động**: có lấy đà và vượt đà (`back()`), chuyển động phụ (rèm, lá, bụi trong vệt sáng, LED thở). Không khung nào đứng hình hoàn toàn.
- **Chữ trên hình**: chỉ thuật ngữ (`label()`, Be Vietnam Pro 900, thẻ kem viền mực, chữ đỏ) và phụ đề (`subtitle()`). Không công thức, không gạch đầu dòng.
- **Người**: không có nhân vật cố định. Khi cần người, dùng bàn tay hoặc thân người đồ chơi (`buildHand()`), diễn bằng hành động.
- **Tiếng**: một giọng kể tiếng Việt; nhạc nền ấm, nhẹ; foley chỉ ở chỗ có vật làm ra tiếng.
