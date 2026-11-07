# Retro — Tái cấu trúc Skill 7 bước & Điều phối 3 Worker song song (2026-11-08)

Phiên làm việc này giải quyết hai yêu cầu lớn:
1. Chuẩn hóa và chuyển đổi toàn bộ quy trình, prompt review của kênh `tram-nghi-nhieu` thành kiến trúc 7 bước độc lập trong `.agents/skills/tram-nghi-nhieu/` và gom các script thực thi vào `channels/tram-nghi-nhieu/tools/`.
2. Đóng vai trò Đạo diễn tổng giám sát, điều phối song song 3 worker subagent OMP (`WorkerMicrowave`, `WorkerPencilLead`, `WorkerThermos`) sản xuất thử nghiệm 3 tập phim thuộc cột `series/do-vat/`, ứng dụng tính toán FFMPEG từ xa trên `muse`/`muse2` và trực tiếp nghiệm thu đạt chuẩn $\ge 9/10$.

---

## Bối cảnh và Thống kê phiên

- **Tổng thời gian phiên:** ~1 giờ 25 phút.
- **Worker chạy nền (Task Subagents):** 3 worker chạy đồng thời:
  - `WorkerMicrowave` (tap-03-lo-vi-song): ~54 phút, 193 req, $3.03.
  - `WorkerPencilLead` (tap-02-ruot-but-chi): ~62 phút, 211 req, $3.92.
  - `WorkerThermos` (tap-04-binh-giu-nhiet): ~72 phút, 195 req, $2.90.
- **Tập phim nghiệm thu thành phẩm:** `channels/tram-nghi-nhieu/series/do-vat/tap-03-lo-vi-song/` (Video 1080p 24fps 42,4s, phụ đề SRT, ảnh bìa poster).

---

## Những điểm thành công (What went well)

1. **Kiến trúc Skill 7 bước rõ ràng:** Tách rời hoàn toàn giữa vai trò Đạo diễn (`GUIDE.md`) và Hội đồng thẩm định độc lập (`PROMPT_CRITIC.md`), chấm dứt tình trạng rải rác các file `CRITIC.md`, `OUTLINE-CRITIC.md`, `SCRIPT-CRITIC.md` ở gốc kênh.
2. **Cơ chế tranh luận 5 vòng (Debate Loop) phát huy hiệu quả:** Cả 3 worker đều trải qua từ 2 đến 3 vòng phản biện ở bước Dàn ý (Step 1) và Kịch bản (Step 2), tự động sửa các lỗi lặp ý, câu thoại chứa số hay mốc thời gian không nguồn trước khi được cấp tem `OUTLINE.pass` và `SCRIPT.pass`.
3. **Phát hiện và ngăn chặn sớm lỗi hiển thị tiền cảnh:** Trong quá trình tự thẩm định tập lò vi sóng, phát hiện mô hình mạng tinh thể lập phương của cảnh 7 bị kéo dài sang cảnh 8 đè lên bàn tay chạm đĩa, đã kịp thời sửa code `lattice.visible` và re-render video sạch trước khi xuất xưởng.

---

## Các vấn đề phát hiện trong phiên (Findings & Root Causes)

### F1 — high — Di chuyển file vào thư mục con `tools/` làm lệch đường dẫn tương đối
- **Bằng chứng:** Sau khi `mv` `beatsheet.mjs` và `propcheck.mjs` vào `channels/tram-nghi-nhieu/tools/`, đường dẫn `../../core/render/page.mjs` và font `fonts/BeVietnamPro-Bold.ttf` bị thiếu một cấp `../`, dẫn đến lỗi khi chạy trực tiếp từ `tools/`. Các worker chạy nền đã tự động sửa trực tiếp trên file nhưng chưa được push lên git.
- **Hệ quả:** Nếu worker khác hoặc CI chạy từ thư mục khác sẽ gặp lỗi `Cannot find module`.
- **Khắc phục (Guard now):** Đã cập nhật chính quy các import `../../../core/render/page.mjs` và `../fonts/` trong `channels/tram-nghi-nhieu/tools/beatsheet.mjs` và `propcheck.mjs`, commit `0e8ae60`.

### F2 — medium — SCP file video thô 350MB qua mạng LAN chậm hơn render/mux tại chỗ
- **Bằng chứng:** Lệnh điều phối chuyển mux FFMPEG sang remote host `muse` thông qua `scp out/video.mp4 out/mix.wav muse:/tmp/...` bị quá hạn 300 giây (timeout) do kích thước video thô không nén rất lớn (~352 MB).
- **Hệ quả:** Lệnh chờ bị treo đến timeout và buộc phải fallback về local execution.
- **Khắc phục (Guard now):** Với các tác vụ FFMPEG nhẹ như mux/audio copy, chỉ offload khi file đầu vào đã nén hoặc dung lượng nhỏ (< 50 MB); với file raw frames pipe hoặc video lớn, ưu tiên xử lý trực tiếp trên local SSD hoặc dùng streaming pipe qua ssh `cat video.mp4 | ssh host ffmpeg -i - ...` thay vì scp toàn bộ file.

### F3 — medium — Quy ước đặt tên trường trong sự kiện âm thanh `events.json`
- **Bằng chứng:** Trong `tap-02-ruot-but-chi`, worker đặt tên trường foley là `{"type": "foley", "sound": "pencil_write"}` hoặc các âm thanh tùy ý như `flake_crack`, `eraser_rub`. `mix.py` của kênh chỉ hỗ trợ danh mục chuẩn trong `core/audio/foley.py` và yêu cầu format `{type: <tên_âm_thanh>}`.
- **Hệ quả:** `mix.py` dừng và báo lỗi `EV types with no sound`.
- **Khắc phục (Guard now):** Đã bổ sung danh mục chuẩn foley (`pen_scribble`, `paper_slide`, `card_flip`, `plastic_click`) vào hướng dẫn `step7-delivery/GUIDE.md` để các worker sau không dùng tên âm thanh tự chế.

### F4 — low — Thuộc tính vật liệu `roughness` trong `MeshToonMaterial`
- **Bằng chứng:** Trong console log xuất hiện cảnh báo `THREE.Material: 'roughness' is not a property of THREE.MeshToonMaterial`. Three.js Toon shader không sử dụng PBR roughness/metalness mà dùng `gradientMap`.
- **Hệ quả:** Không gây crash nhưng tạo rác log cảnh báo trong quá trình render still/video.
- **Khắc phục (Guard now):** Ghi nhận vào tài liệu hướng dẫn tạo vật liệu Toon của kênh (`STYLE.md`), chỉ định nghĩa `color` và `gradientMap`.
