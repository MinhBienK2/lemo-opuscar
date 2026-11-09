# Bước 5: Code Linh kiện 3D Độc lập (Modular 3D Coding)

## Mục tiêu
Dựa trên `COMPONENTS_SPEC.md` của Bước 4, dựng mọi vật, bộ phận và đạo cụ của tập, mỗi vật một tệp.

## Quy chuẩn kỹ thuật Three.js của kênh
- **Vật thật dựng đúng là nó:** dựng đủ bộ phận đặc trưng của vật; một khối trụ hay hộp trơn không đứng thay cho một đồ vật.
- **Vật liệu Toon:** `toon()` của `rig/kit.js` (MeshToonMaterial), hoặc `canvasTex` có hạt ngẫu nhiên (`seed`). MeshToonMaterial
  không phải PBR: không khai báo `roughness` hay `metalness`.
- **Ruột máy móc:** tận dụng `channels/tram-nghi-nhieu/rig/parts.js` (lò xo, chip, bánh răng, cuộn cảm, pin).
- **Vật phải biết cử động:** mỗi vật có phần cập nhật theo thời gian: vải đung đưa theo gió, quạt xoay, giọt nước co
  lại, kim đồng hồ chạy, hạt hơi bay. `rig/motion.js` có sẵn `sway()`, `breathe()`, `spinUp()`…; bước 6 gọi hàm cập
  nhật đó mỗi khung hình.
- **Mỗi vật một tệp** — `src/props/<mã>.js`, mã là chữ thường không dấu (`ao-phong-uot.js`):
  ```javascript
  import * as THREE from 'three';
  import { toon, PAL } from '../../../../../rig/kit.js';
  import { vaiDet } from './_vai.js';            // phần dùng chung của nhiều vật: src/props/_<tên>.js
  export function aoPhongUot(opts = {}) { const g = new THREE.Group(); /* … */ return g; }
  export const PROP = { name: 'áo phông còn ướt', view: () => aoPhongUot() };
  ```
  `PROP.name` là tên vật như lời kể gọi nó, và cũng là mã neo của nhãn ở bước 6. `view` dựng vật đứng một mình cho ảnh
  ba phía. Tệp `_*.js` không có `PROP`; sửa nó là sửa mọi vật dùng nó, nên các vật đó được chấm lại.
- **`src/props.js` do máy sinh** (`export *` từ mọi tệp, và `PROPS = {tên: view}`). Thêm, đổi tên hay xoá một tệp vật
  thì chạy lại `python3 channels/tram-nghi-nhieu/tools/props_catalog.py <tập> --write-index`. `film.js` vẫn
  `import { … } from './props.js'`.

## Quy trình thực hiện
1. Viết từng vật vào tệp của nó, rồi `props_catalog.py <tập> --write-index`.
2. Tự nhìn trước: `LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/tools/propcheck.mjs <tập> --out <tập>/out/scratch/props`
   (ảnh ba phía của từng vật; `--only <tệp.json>` với một mảng tên để chỉ dựng vài vật).
3. **Chấm:** `sh channels/tram-nghi-nhieu/tools/review.sh <tập> props`. Công cụ kiểm danh mục
   (`props_catalog.py --check`), dựng ảnh của những vật mới hay vừa đổi, cho một người gọi tên mù (không biết tên định
   dựng), rồi người chấm chấm từng vật theo `step5-props-code/RUBRIC.md`. Vật phải sửa nằm trong `review/PROPS.md`.
   Vật không đổi không được chấm lại.
4. **Sửa:** `fixbrief.py <tập> props` in một bản giao việc cho mỗi vật phải sửa; mỗi bản một subagent, chạy song song
   (SKILL, "Sửa sau vòng chấm"). Khi các người sửa trả lời xong, chạy lại bước 3.
5. **Người gọi tên mù có thể đọc sai** (một bàn tay bị gọi là "bàn chân"). Câu `dung-vat` vẫn ĐẠT khi ảnh có đủ bộ
   phận đặc trưng của vật; người sửa nhìn ảnh và trả lời `NGƯỜI CHẤM SAI` cho trường hợp đó.
