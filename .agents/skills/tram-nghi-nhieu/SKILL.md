---
name: tram-nghi-nhieu
description: Chuyên môn đạo diễn và sản xuất phim hoạt hình 2D tâm lý học giải phẫu nhận thức cho kênh Trạm Nghĩ Nhiều. Ứng dụng tinh hoa từ films/host-toon-test với ngữ pháp 4 khung hình (A, B, C, D), kỹ thuật kể đến đâu hình hóa đến đó (Micro-Beat Visual Mapping), thế giới quan thay đổi theo chủ đề (Topic Worldbuilding), và engine đa phong cách (Dossier, Mid-century, Swiss, Mind Lab). Dùng khi sáng tạo video mới cho kênh Trạm Nghĩ Nhiều hoặc bất kỳ video giải thích tâm lý học/khoa học nhận thức nào.
version: 2.0.0
---

# Kỹ năng Đạo diễn Điện ảnh Kênh "Trạm Nghĩ Nhiều"
*(The Overthinker Station — Cinematic 2D Explainer Directing Skill)*

Tài liệu này chuẩn hóa toàn bộ tư duy đạo diễn, kỹ thuật hình hóa và quy trình sản xuất video cho kênh **Trạm Nghĩ Nhiều**, chắt lọc từ những yếu tố tạo nên sự cuốn hút vượt trội của tác phẩm mẫu `films/host-toon-test` (*Phi vụ triệu đô trong 2 phút*).

Mục tiêu tối thượng: **Mỗi video là một hành trình thị giác lôi cuốn, kể đến đâu người xem hình dung và hiểu ngay đến đó, không rập khuôn một phong cách cố định, và triệt tiêu vĩnh viễn cảm giác "bài giảng PowerPoint vẽ bằng code thô".**

---

## 1. Bốn Trụ Cột Đạo Diễn Cuốn Hút (Từ bài học `host-toon-test`)

### Trụ cột 1: Ngữ pháp 4 Khung hình (The 4-Framing Rule)
> **Nguyên tắc vàng**: *"Người dẫn chuyện chỉ xuất hiện khi thật sự cần giải thích. Tối thiểu 50% thời lượng phim phải là không gian câu chuyện (B-roll) hoặc nhân vật bước hẳn vào hiện trường!"*

Cấm để Kẻ Nghĩ Nhiều đứng một chỗ ở góc màn hình từ đầu tới cuối phim. Mỗi phân cảnh (Scene Block) bắt buộc phải thuộc về một trong 4 chế độ:

1. **Chế độ A · Bàn nghiên cứu (Study / Reflection Desk)**:
   - Dùng ở: 10–15 giây mở đầu (đặt câu hỏi nhức nhối) và 15 giây kết thúc (lời đọng lại).
   - Bố cục: Bán thân nhân vật bên bàn gỗ, đèn bàn vàng, tách trà bốc khói, nhìn thẳng vào ống kính tâm sự với người xem.
2. **Chế độ B · Vòng tròn Pop-in (PiP Corner Circle)**:
   - Dùng khi: Giải thích một cơ chế khoa học, bản đồ tư duy, hoặc bảng số liệu phức tạp.
   - Bố cục: Toàn bộ 90% màn hình dành cho diễn biến đồ họa (B-roll chuyển động). Nhân vật Kẻ Nghĩ Nhiều hoặc Rối chỉ nhảy vào một **vòng tròn nhỏ ở góc màn hình (`pip`)** trong 2–4 giây với biểu cảm liếc nhìn/nhún vai, nói 1 câu đắt giá rồi biến mất.
3. **Chế độ C · Bước vào hiện trường (In the Scene — Yếu tố cuốn hút nhất!)**:
   - Dùng khi: Tái hiện tình huống, thí nghiệm, hoặc câu chuyện cụ thể.
   - Bố cục: Nhân vật toàn thân **bước thẳng vào không gian của chủ đề**, tương tác trực tiếp với đồ vật trong bối cảnh:
     - Nói về kiệt quệ công sở $\to$ Nhân vật ngồi trong văn phòng công ty lúc nửa đêm, ôm đống giấy tờ.
     - Nói về bão tuyết $\to$ Nhân vật mặc áo khoác lông dày, ngồi trong xe hơi phủ đầy tuyết trắng run rẩy.
     - Nói về bẫy mua sắm $\to$ Nhân vật đẩy xe hàng trong siêu thị ngập tràn biển giảm giá đỏ chót.
     - Nói về sự trì hoãn $\to$ Nhân vật nằm lăn lộn trên giường, ôm điện thoại phát sáng trong bóng tối.
4. **Chế độ D · Cắt cận cảnh giật sét (Reaction Close-up Punch)**:
   - Dùng khi: Có một bước ngoặt logic (plot twist), một sự thật vô lý, hoặc cú đấm nhận thức.
   - Bố cục: Cắt thẳng (Hard Cut) vào cận cảnh khuôn mặt nhân vật kèm tia tập trung (`focusLines`), âm thanh nảy giật nhịp (`ting`, `pop`, hoặc một nhịp lặng cắt nhạc đột ngột).

---

### Trụ cột 2: "Kể đến đâu, hình hóa đến đó" (Micro-Beat Visual Mapping)
> **Quy tắc diệt trừ thẻ chữ**: Hoạt hình 2D là **nghệ thuật của sự vật, hành vi và biến đổi vật lý**. Cấm tuyệt đối việc vẽ một tấm thẻ chữ nhật rồi nhét nguyên câu thoại vào giữa!

Mọi câu thoại trong kịch bản phải được chia nhỏ theo từng cụm từ (dựa trên `words.json`), và **cứ mỗi khi phát âm đến một danh từ/động từ/trạng thái quan trọng, màn hình lập tức phản hồi bằng một hiện tượng vật lý**:

* Khi nói: *"Thước đo tự tăng lên"* $\to$ Vẽ thanh xà nhảy cao tự động bị một cánh tay cơ khí kéo vọt lên 2 mét ngay khi nhân vật vừa nhảy qua 1 mét.
* Khi nói: *"Mỗi giờ trôi qua"* $\to$ Kim đồng hồ cơ quay tít mù, các tờ lịch trên tường bay vèo vèo theo gió.
* Khi nói: *"Cố chấp đổ thêm tiền"* $\to$ Chiếc phễu khổng lồ đang nuốt chửng hàng xấp tiền đô la rơi xuống hố sâu không đáy.
* Khi nói: *"Cắt lỗ cảm xúc"* $\to$ Chiếc kéo ánh sáng cắt phăng sợi xích sắt, tia lửa bắn tung tóe (`particleSparks`), mỏ neo rơi tõm xuống đáy.
* Khi nói: *"Tâm lý đám đông"* $\to$ Vòng tròn spotlight chiếu vào nhân vật, xung quanh là đám đông vô cảm đang cúi mặt bấm điện thoại.

---

### Trụ cột 3: Thế giới quan riêng cho từng chủ đề (Topic-Driven Worldbuilding)
Mỗi tập phim Trạm Nghĩ Nhiều nói về một chủ đề khác nhau, do đó **không được tái sử dụng một bối cảnh nhàm chán cho mọi tập**:

* **Chủ đề Quyết định & Tài chính / Công việc**: Dựng bối cảnh văn phòng làm việc với máy tính, máy in hóa đơn, biểu đồ tăng trưởng, cốc cà phê cạn đáy.
* **Chủ đề Thói quen ban đêm & Màn hình số**: Dựng bối cảnh phòng ngủ ánh trăng, ánh sáng xanh le lói từ màn hình điện thoại rọi vào mặt, đồng hồ số báo 3:15 sáng.
* **Chủ đề Áp lực xã hội & Kẻ giả mạo**: Dựng bối cảnh sân khấu kịch với rèm đỏ, đèn chiếu chói lòa, những chiếc mặt nạ giấy treo lơ lửng.
* **Chủ đề Khoa học thần kinh & Trí nhớ**: Dựng không gian "Phòng giải phẫu tâm trí" (Mind Laboratory) với các bình thủy tinh nơ-ron phát sáng, kính lúp phóng đại, sợi chỉ đỏ kết nối chứng cứ.

---

### Trụ cột 4: Đạo diễn Đa Phong cách theo từng cảnh (Adaptive Multi-Style Engine)
Tận dụng linh hoạt thư viện `rig/styles.js`:

```javascript
import {
  applyPaperTexture, renderGrainFx, drawHalftoneField, drawDossierHeader,
  drawStampSlam, drawEvidenceTag, drawSunburst, drawSparkle, drawSwissMetric,
  setupSceneStyle
} from '../../../../rig/styles.js';
```

* **Phân cảnh Bóc trần / Hồ sơ chứng cứ**: Áp dụng phong cách **Dossier** (`drawHalftoneField`, `drawDossierHeader`, `drawStampSlam`, `drawEvidenceTag`). Biến cảnh phim thành một hồ sơ điều tra tâm lý tối mật với hạt trame Ben-Day in báo, dấu mộc vỡ mực và kẹp ghim giấy kraft.
* **Phân cảnh Cảm xúc đời thường / Nhận thức bừng sáng**: Áp dụng phong cách **Mid-century** (`drawSunburst`, `drawSparkle`, lò xo nảy `spring`, `squash`). Tia sáng tỏa cánh quạt thập niên 50 đem lại năng lượng tích cực, ấm áp.
* **Phân cảnh Cơ chế não bộ & Số liệu khoa học**: Áp dụng phong cách **Swiss** (`drawSwissMetric`, lưới đồ họa Thụy Sĩ). Tương phản cao, con số kích thước khổng lồ, thanh đo vi lượng chính xác.
* **Hậu kỳ xúc giác thống nhất**: Ở cuối hàm `window.render(t)`, luôn gọi:
  ```javascript
  applyPaperTexture(G, 0.20, true);  // Phủ lớp vân giấy dập nổi và nếp gấp
  renderGrainFx(G, T, 220);          // Hạt bụi phim nhựa hữu cơ khử sạch cảm giác vẽ phẳng
  ```

---

## 2. Bảng Storyboard Mẫu 2 Cột Chuẩn Mực (Two-Column Storyboard Format)

Khi viết `TREATMENT.md` hoặc thiết kế kịch bản, AI Agent **bắt buộc phải lập bảng phân cảnh 2 cột bám sát từng vế câu**:

| Thời gian & Lời thoại | Chế độ khung hình & Bối cảnh | Hành động nhân vật & Đạo cụ vật lý ("Kể đến đâu hình đến đó") | Phong cách & Foley |
|---|---|---|---|
| **0:00 - 0:08 (c1)**<br>*"Có bao giờ bạn nhận ra thứ đang vắt kiệt mình không phải khó khăn mới..."* | **Mode A (Bàn nghiên cứu)**<br>Phòng đêm, đèn bàn vàng rọi góc bàn. | Kẻ Nghĩ Nhiều ngồi gục đầu mệt mỏi. Bên chân là một chiếc vali da cũ nát chất đầy đá tảng, có sợi xích sắt quấn chặt vào cổ chân. | Style: `mindlab`<br>Foley: `pendulum_tick`, `heavy_sigh` |
| **0:08 - 0:18 (c2)**<br>*"Mà là chiếc vali quá khứ 1.000 ngày bạn không nỡ buông tay."* | **Mode C (Bước vào hiện trường)**<br>Mặt bàn gỗ phóng to, góc nhìn cận cảnh. | Lật mở cuốn sổ tay sờn rách, highlight vàng quét chữ `1.000 NGÀY`. Một con dấu đỏ khổng lồ dập mạnh xuống: `MẮC KẸT 3 NĂM`. | Style: `dossier`<br>Foley: `paper_turn`, `stamp_slam` |
| **0:40 - 0:55 (c4)**<br>*"Thí nghiệm 1985: Người ta thà chịu bão tuyết lái xe đến rạp chỉ vì tiếc tấm vé 100 đô..."* | **Mode B (Pop-in góc)**<br>Toàn màn hình là con đường phủ đầy tuyết trắng, chiếc xe trượt bánh. | Kẻ Nghĩ Nhiều xuất hiện trong vòng tròn nhỏ ở góc phải nhún vai (`pip`). Giữa màn hình: 2 tấm vé kịch (100$ và 50$) dán băng keo rung lắc trước gió bão. | Style: `dossier`<br>Foley: `wind_howl`, `car_skid` |
| **1:40 - 1:55 (c8)**<br>*"Hạch hạnh nhân trong não xử lý nỗi đau mất mát lớn gấp 2,5 lần..."* | **Mode B (Pop-in góc)**<br>Lưới đồ họa Thụy Sĩ tối giản, nền đen sâu thẳm. | Mô hình não bộ vector phát sáng: Hạch hạnh nhân nhấp nháy đỏ rực. Thước đo Swiss Metric vọt lên con số khổng lồ `2.5x LẦN`. | Style: `swiss`<br>Foley: `heartbeat_pulse`, `ting` |
| **3:40 - 3:55 (c15)**<br>*"Chỉ khi can đảm buông tay, bạn mới nhận ra tương lai bắt đầu từ điểm 0."* | **Mode C (Hiện trường giải phóng)**<br>Tia sáng Sunburst bừng nở rực rỡ, gió sớm thổi tung rèm cửa. | Kẻ Nghĩ Nhiều dùng chiếc kéo ánh sáng cắt đứt xích mỏ neo, Rối hóa thành chiếc chìa khóa vàng, bóng đèn filament trên đầu bừng sáng rực rỡ, nở nụ cười tự do. | Style: `midcentury`<br>Foley: `chain_snip`, `bell_zen`, `whoosh` |

---

## 3. Quy Trình Sản Xuất Tự Động Hóa 6 Bước (Autonomous Production Flow)

Khi AI Agent nhận lệnh sản xuất video cho Trạm Nghĩ Nhiều (dù chạy đơn lẻ hay qua `tools/orchestrate_series.py`), bắt buộc tuân thủ 6 bước khép kín:

```
[Bước 1: Góc nhìn & FACTS.md]
        │
        ▼
[Bước 2: Kịch bản đàm thoại lines.json (~2.3 từ/giây, không đánh số)]
        │
        ▼
[Bước 3: Lập bảng Storyboard 2 cột (Phân định 4 chế độ A, B, C, D)]
        │
        ▼
[Bước 4: Chạy chuỗi âm thanh (TTS NamMinh + Whisper ASR + Process 48kHz)]
        │
        ▼
[Bước 5: Lập trình Canvas (timeline.js + film.js áp dụng rig/styles.js)]
        │
        ▼
[Bước 6: Dựng Full HD & Kiểm định cổng review.sh PASS 100%]
```

1. **Bước 1 — FACTS.md**: Tìm đúng bài báo khoa học gốc (DOI), trích xuất con số cốt lõi và giới hạn của nghiên cứu.
2. **Bước 2 — lines.json**: Viết lời thoại tự sự thủ thỉ của một người bạn tri thức lúc nửa đêm, phiên âm số thành chữ (*"một trăm đô la"*, *"hai phẩy năm lần"*).
3. **Bước 3 — Storyboard 2 cột**: Bắt buộc phân bổ ít nhất 3 bối cảnh khác nhau, tối thiểu 2 phân cảnh chế độ C (bước vào hiện trường) và 2 phân cảnh chế độ B (pop-in circle).
4. **Bước 4 — Âm thanh**: Chạy `tts_vi.py` $\to$ `asr_vi.py` $\to$ `process.py` để sinh ra `words.json` và `lips.json`.
5. **Bước 5 — Lập trình Canvas**:
   - Sử dụng `rig/styles.js` để tạo nền, trame dots, con dấu, sunburst, metric.
   - Gắn sự kiện `window.EV` (nhạc theo chương A, B, C, D, E, F và foley bám sát động tác).
   - Cuối hàm render: Gọi `applyPaperTexture(G)` và `renderGrainFx(G, T)`.
6. **Bước 6 — Build & Review**:
   - Chạy `sh build.sh` để sinh video mp4 (-14.0 LUFS, true peak $\le -1.0\text{ dBFS}$) và poster.
   - Chạy `sh core/render/review.sh` — toàn bộ các cổng filmcheck, drawcheck, claims, facts, citations, readcheck, stills, sheet, loudness, black frames phải hiển thị **PASS 100%**.

---

## 4. Tiêu Chuẩn Thẩm Định Của Đạo Diễn (Self-Check Checklist Trước Khi Bàn Giao)

Trước khi coi video là hoàn thành, AI Agent phải tự trả lời 5 câu hỏi gắt gao sau:

- [ ] **Nhân vật có đứng yên một chỗ như tượng không?** (Nếu nhân vật chỉ đứng ở góc suốt từ đầu đến cuối: FAILED $\to$ Phải đưa vào vòng tròn pop-in hoặc cho bước vào bối cảnh câu chuyện).
- [ ] **Có phân cảnh nào bị biến thành slide PowerPoint không?** (Nếu có khung chữ nhật nhét nguyên câu thoại vào: FAILED $\to$ Phải chuyển thành đồ vật hữu hình hoặc ẩn dụ vật lý).
- [ ] **Hình ảnh có bám sát lời đọc từng giây không?** (Khi giọng đọc nhắc đến danh từ/động từ chính, màn hình có phản hồi thị giác ngay lập tức không?).
- [ ] **Video có bị phẳng lì kỹ thuật số không?** (Đã kích hoạt lớp texture giấy `applyPaperTexture` và bụi phim `renderGrainFx` chưa?).
- [ ] **Cổng `review.sh` có đạt PASS 100% không?** (Âm lượng -14 LUFS, không có khung hình đen quá 0.5s, không có chữ chạy quá nhanh).
