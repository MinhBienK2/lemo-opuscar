# Trạm Nghĩ Nhiều · Style — kênh tâm lý học bằng hoạt hình 2D tối giản

Một style riêng cho kênh: một nhân vật chủ, một đồng học, nền tối, chữ rõ. Mọi tập dùng chung ngôn ngữ hình ảnh này.

## 1. Bản chất

Một người dẫn chuyện giải thích tâm lý học bằng cách **chỉ ra cái giá của một trạng thái thường ngày**, rồi **bác bỏ một cách giải thích quen thuộc** bằng dữ kiện, rồi **đưa ra một hành động cụ thể**.
Kênh nói về hành vi con người, không phải về kỹ thuật: mỗi tập bắt đầu từ một câu hỏi đời thường ("tại sao càng rảnh ta càng mệt?") và kết thúc bằng một việc người xem làm được ngay.

**Không phải**: podcast có hình, slideshow, video tâm lý học giọng AI, meme 3 giây, hay bất cứ thứ gì kể một bí mật "bạn không biết".

## 2. Nhân vật

**Kẻ Nghĩ Nhiều** — đầu hình vuông-vò tròn (squircle) màu kem `#FAF8F5`, mũi xanh rối `#232A44` với vài lọn tóc lệch, một sợi tóc hình **sợi đèn** (filament) với bóng đèn ở đầu sợi tóc — sợi tóc là **đồng hồ cảm xúc**: dựng lên khi hào hứng, rũ xuống khi buồn, nằm ngang khi mệt, sáng lên khi có ý tưởng.
Áo hoodie mù mè `#FFB703` **rộng** (oversized), tay áo dài che tay, có **biểu tượng pin sạp** trên ngực trái — biểu tượng này là thiết bị mở đầu mỗi tập và là "đồng hồ" của nhân vật: pin cạn dần theo nhịp tập, và nạp lại ở tập sau.
Nét viền `#1D202A` luôn dày ~3,4 px trên màn hình, bất kể tỉ lệ.

**Rối** — một bóng sợi tím (`#8B5CF6`), vẽ bằng một đường cuộn dày và một đường mảnh, hai mắt tròn và một cái antenna nhỏ. Rối không giải thích: Rối **cảnh báo** và **đặt tên** cho thứ người xem đang cảm thấy. Rối xuất hiện ở khoảng một phần tư độ dài mỗi tập.

## 3. Màu

| Vai trò | Màu |
|---|---|
| Nền | `#12131A` (than xanh), lưới `#1E2333`, vignette 42 % |
| Panel/bảng | `#232838`, viền `#2E3448` / `#5A6488` |
| Kem (da, chữ chính) | `#FAF8F5` |
| Nét | `#1D202A` |
| Nhấn (hoodie, highlight) | `#FFB703` |
| Tím (Rối, cảnh báo) | `#8B5CF6` |
| Lạnh (dữ liệu, màn hình) | `#67E8F9` |
| Cảnh báo (con dấu, pin) | `#F0525B` |

Quy tắc: **một màu nhấn mỗi cảnh**. Vàng không bao giờ làm nền; tím chỉ thuộc về Rối; đỏ chỉ thuộc về cái đe dọa hoặc cái sai.
Bảng màu thực tế trong code (`rig/character.js:PAL`): da kem `#fff0d8`, áo vàng nghệ `#f7bd27`, quần navy `#252d50`, tím Rối `#9a5be5`, đỏ cảnh báo `#f04462`, xanh dữ liệu `#67e8f9`.

## 3b. Đạo diễn đa phong cách theo từng cảnh (Multi-Style Scene Direction)

Để tránh sự đơn điệu và xóa bỏ cảm giác "vẽ phẳng bằng code thô", mỗi phân cảnh (Scene Block) trong kịch bản được quyền áp dụng một phong cách hình ảnh chuyên biệt mượn từ các style tinh hoa trong thư viện repo (`rig/styles.js`):

1. **`dossier` (Hồ sơ điều tra tâm lý — từ `halftone-dossier`)**:
   - Dành cho các phân cảnh mổ xẻ nghiên cứu, bóc trần ngụy biện, kiểm chứng sự thật.
   - Hiệu ứng: Hạt trame bán sắc Ben-Day (`drawHalftoneField`), tiêu đề hồ sơ lưu trữ (`drawDossierHeader`), con dấu đập nảy mạnh vỡ mực (`drawStampSlam`), thẻ tang vật ghim chỉ đỏ (`drawEvidenceTag`).
2. **`midcentury` (Hoạt hình 50s nảy vui — từ `midcentury-toon`)**:
   - Dành cho các phân cảnh kể tình huống đời thường, cảm xúc nhân vật và sự hài hước.
   - Hiệu ứng: Tia sáng sunburst tỏa góc (`drawSunburst`), ngôi sao lấp lánh nguyên tử (`drawSparkle`), chuyển động lò xo nảy giật nhịp (`spring`, `squash`).
3. **`swiss` (Đồ họa dữ liệu chính xác — từ `swiss-motion`)**:
   - Dành cho các phân cảnh cơ chế khoa học não bộ, các mốc phần trăm và định luật tâm lý.
   - Hiệu ứng: Lưới đồ họa Thụy Sĩ tương phản cao, con số kích thước khổng lồ kèm thước đo vi lượng (`drawSwissMetric`).
4. **`tactile paper & grain` (Xúc giác giấy & phim nhựa)**:
   - Mọi cảnh đều được phủ lớp giấy có nếp gấp và bụi phim (`applyPaperTexture`, `renderGrainFx`), khử hoàn toàn bề mặt trơn nhẵn vô hồn.


## 4. Bố cục và camera

- Nền tối, nhân vật sáng: tương phản là chủ đạo. Không dùng hiệu ứng hào quang, bloom hay lens flare.
- Bố cục: nhân vật chiếm một phần ba khung, phần còn lại cho **một** vật thể (một thẻ, một con số, một cái pin). Không bao giờ hai bảng cùng lúc.
- Máy: push-in chậm (2–4 %) cho ý tưởng; whip pan khi đổi chỗ; cắt cứng vào mặt cho cú đấm; iris wipe khi bước vào bối cảnh; giữ nguyên khung khi cần đọc số.
- Không có camera quay vai. Bố cục luôn chính diện hoặc hơi từ trên xuống.

## 5. Đồ hoạ b-roll

Mọi thứ được vẽ bằng mã, cùng ngôn ngữ nét với nhân vật:
- **Thẻ** (panel): nền tối `#232838`, bo góc 26 px, bóng đen lệch 10 px, có thể dán băng keo vàng hoặc ghim đỏ.
- **Highlight**: một vệt màu mù mè quét sau từ/number quan trọng, chạy đúng nhịp từ đang nói.
- **Con dấu**: khung đỏ `#F0525B`, mực nứt, dùng cho "CHÁN", "CÔNG VIỆC", "GIẢ" — luôn để phủ lên một câu đã nói.
- **Vòng số**: vòng tròn `#67E8F9` kèm dải 24 ô "giờ thức" — cách duy nhất để show một tỉ lệ.
- **Bong bóng suy nghĩ**: hình bầu dục tối `#1E2333` với ba chấm bụi nhỏ.

## 6. Chữ

- **Be Vietnam Pro**: 900 tiêu đề/số, 800 chữ phụ, 700 phụ đề. **Patrick Hand**: nhãn viết tay.
- Phụ đề: kem, viền `#12131A` 11 px, 44 px, tối đa 2 dòng, căn giữa dưới; **không để mặt nhân vật trong dải phụ đề** (dải dưới ~170 px).
- Tiêu đề tập: "TRẠM NGHĨ NHIỀU" mù mè, tập tiếp theo viết tay.
- Tiếng Việt có dấu đặc phải đúng; không dùng font không có dấu.

## 7. Nhịp chuyển động

- Nhân vật chuyển động trên số 1 (24 fps): đầu quay mượt, tay vẽ bằng IK 2 khớp, đi bước có nhịp.
- **Miệng chạy ở 12 fps**, điều khiển bằng chính giọng đọc (RMS → há, trọng tâm phổ → tròn), và **đóng lại khi ngừng nói**.
- Nhịp thở và chớp mắt (2–5 s, đôi khi chớp đôi) luôn chạy, kể cả khi nhân vật im lặng.
- Bật cảnh: thẻ và con dấu vào bằng back-ease (độ vượt ≤ 1,1), ra bằng ease-in 6–8 khung.
- Biểu cảm đổi **trước** giọng vài khung, trộn trong 3–5 khung.

## 8. Âm thanh

- Giọng đọc: một giọng nam trẻ, gần và khô (`vi-VN-NamMinhNeural`, +5 %, −8 Hz). Nhạc lùi −8 dB dưới giọng.
- Nhạc: lo-fi tổng hợp, 84 BPM, A minor; piano đệm, marimba, bass gảy, kick mềm, brush, drone, một lớp vinyl. **Mỗi chương đổi bộ nhạc cụ, không đổi tempo.**
- Foley: pop (bật cảnh), giấy, marker, con dấu, whoosh (whip), ting (ý tưởng), boing (sợi tóc đèn), tiếng pin cạn, tiếng cuộn feed.
- Im lặng là một dụng cụ: cắt nhạc trước một cú đấm.

## 9. Quy trình mỗi tập

1. `TREATMENT.md`: ba cấu trúc, chọn một, bảng cảnh, bảng nhạc, bảng âm thanh.
2. `research/FACTS.md`: mọi con số kèm nguồn, trước khi viết lời.
3. `voice/lines.json` → edge-tts → ASR (kiểm tra lời) → `voice/process.py` (điều khiển miệng).
4. `src/timeline.js`: thứ tự câu, khoảng lặng, mảnh phụ đề theo từ.
5. `src/film.js`: các cảnh, máy, hiệu ứng.
6. `sh build.sh`: sự kiện → trộn âm → khuôn hình → phụ đề → dựng (−14 LUFS) → poster.
7. Kiểm tra: xem thử 6–10 khung hình ở giữa mỗi cảnh; đo giọng nói và tiếng nền; đọc lại phụ đề.

## 10. Bẫy

- Đừng để phụ đề đè lên mặt hoặc lên số liệu đang đọc.
- Đừng dùng `path()` cho hình chữ nhật — nó làm mềm góc thành bong bóng; dùng `rect()`/`poly()`.
- Nhân vật phải được vẽ sau cẳng tay (để tóc và mặt nằm trên) nhưng trước bàn làm việc (để bàn che chân).
- Tọa độ tóc và nón sợi đèn lấy theo trục `hy`; dựng đường tóc quanh gốc sẽ che mặt.
- Pin trên ngực và sợi đèn là hai "đồng hồ" — chỉ một cái được thay đổi mỗi cảnh.
- Không dùng số liệu không có nguồn trong `FACTS.md`.
