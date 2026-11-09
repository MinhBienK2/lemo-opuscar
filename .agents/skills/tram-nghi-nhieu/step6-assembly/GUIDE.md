# Bước 6: Lắp ghép Cảnh, Diễn hoạt & Nhịp điệu (Assembly, Animation & Beatsheet)

## Mục tiêu
Lắp các vật (`src/props.js`) vào bối cảnh (`src/film.js`), đặt máy quay, viết diễn hoạt khớp với từng chữ của giọng
đọc, và kiểm nhịp của cả phim.

## Quy chuẩn kỹ thuật
- **Timeline đồng bộ:** khớp chuyển động theo chữ bằng `V.w(line_id, 'từ_khoá')`.
- **Vật thể tự diễn** (`rig/motion.js`): `sway()` cho vải, dây, rèm; `breathe()` cho nhịp thở vi mô; `motor()` cho
  quạt, bánh xe có quán tính; `actionAt()` gắn vào mốc chữ để vật phản ứng tức thì; `particleStream()` cho gió, hơi
  nước, nhiệt.
- **Máy quay đi theo hành động:** máy chỉ chuyển động khi bám theo một vật hay một cơ chế. Một khung giống câu trước
  thì đổi trạng thái vật, cắt sang góc khác, hay đi vào bên trong — không nhích máy trên một cảnh đứng yên.
- **Cơ chế nhân quả:** có lực tác động thì vật biến đổi thấy được trong 1–2 giây.
- **Mở đầu là hiện tượng:** nhát đầu cho thấy vật đang biến đổi ngay trước mắt; nguyên nhân đến sau hiện tượng.
- **Dòng chảy vô hình:** `flow()` hoặc `particleStream()` to bản, có điểm xuất phát và điểm tiếp xúc thật.
- **Bóng đổ:** một khối sẫm không có viền mực giữa khung thường là bóng của một vật ngoài khung. Tìm vật đó bằng
  `node channels/tram-nghi-nhieu/tools/shadow_who.mjs <tập> --at <giây>` (nó tắt lần lượt từng vật và đo), rồi sửa
  vật hay dời đèn.
- **Khung có việc:** mảng tường trơn, vùng tối hay trần trơn không chiếm gần nửa khung; không có điểm cháy trắng kéo
  mắt khỏi chủ thể; cận cảnh phải đọc ra đặc trưng của vật (sợi vải đan qua nhau, không phải tấm bìa có vân in).
- **Mốc nhịp:** `markBeats(ev, V, (id, t) => [x, y])` gắn cho mỗi câu một điểm trên khung 1920×1080 (đặt máy ở góc của
  câu đó, rồi `toScreen(point, camera)`). Nhờ đó `check_motion.py` đo được nhịp nào không làm đổi phần khung của nó.

## Nhãn (`CARDS`)
- Tối đa một nhãn cùng lúc; nhãn nằm trọn trong khung; mũi tên chạm tâm vật mà lời kể đang nói.
- **Neo vào vật:** `at: t => vị trí của vật`, và `anchor: '<PROP.name của vật>'`. `check_label_anchors.py` kiểm mã neo có
  trong danh mục, và chữ của nhãn có thuộc đúng vật đó không. Đổi `PROP.name` thì sửa mọi neo trỏ tới nó.
- **Chữ chỉ có một cách đọc:** nhãn "ÁO PHÔNG" khi trong khung có cả áo ướt lẫn áo khô thì phải nói rõ là áo nào.
- **Giữ nhãn qua câu sau** khi câu sau vẫn nói về cùng vật mà không gọi lại tên nó.
- **Cửa sổ của nhãn:** `for (const C of CARDS) Object.assign(C, cardWindow(C, V));` (`rig/render.js`). Câu ngắn thì kéo
  dài bằng `hold` / `lead` (giây), khi vật vẫn còn trong khung.
- Hai nhãn đè nhau: dời nhãn (`at`) hay bỏ bớt một nhãn trong nhát; giữ nguyên cỡ chữ.

## Quy trình thực hiện
1. Dựng bối cảnh: đặt vật, máy quay, đèn chính in bóng qua lỗ tường (`wallWithHole`).
2. Viết diễn hoạt bằng `keys()`, easing có lấy đà và vung đà.
3. Dựng tờ nhịp: `LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/tools/beatsheet.mjs <tập> --out <tập>/review/beatsheet`
   (một khung cho mỗi câu, kèm cờ máy). Vòng chấm dùng lại tờ này nếu mã chưa đổi từ lúc dựng. Đọc cờ máy trước:
   `python3 channels/tram-nghi-nhieu/tools/check_shots.py <tập>/review/beatsheet`.
4. **Chấm:** `sh channels/tram-nghi-nhieu/tools/review.sh <tập> picture`. Máy kiểm trước: nhãn đúng câu
   (`check_labels.py`), nhãn đúng vật (`check_label_anchors.py`), mỗi câu một nhát (`check_shots.py`), vật trong danh mục
   có lên hình (`check_props_used.py`). Người chấm chấm hình của từng câu theo `step6-assembly/RUBRIC.md`; cờ máy
   (`DARK SAME RUN NUM`, độ phủ) đến tay người chấm như gợi ý. Câu phải sửa nằm trong `review/PICTURE.md`. Sửa rồi chạy
   lại: chỉ những câu mà khung hình đổi mới được chấm lại.
