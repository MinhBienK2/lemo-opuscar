---
name: tram-nghi-nhieu
description: Phương pháp đạo diễn một tập phim hoạt hình 2D có lời dẫn cho kênh Trạm Nghĩ Nhiều — người dẫn nói tới cái gì thì hình dựng đúng cảnh, hành động, đồ vật, hiện tượng đó. Sự việc trước, lời sau; một người trải qua hiệu ứng; con số thành vật; mỗi nhịp một nơi chốn và một ánh sáng; đo bằng scenecheck thay cho tự khai. Dùng khi làm bất kỳ tập nào của kênh.
version: 4.0.0
---

# Đạo diễn một tập Trạm Nghĩ Nhiều

Phim của kênh là **phim**, không phải bài thuyết trình có nhân vật đứng cạnh. Người xem tắt tiếng vẫn phải hiểu đại khái chuyện gì đang xảy ra; bật tiếng thì lời nói cho họ cái hình không nói được: *vì sao*, *nghĩa là gì*, *mình nên làm gì*.

Lỗi mà mọi tập cũ mắc phải đều cùng một gốc: **viết lời trước, rồi đi tìm hình minh họa cho lời**. Câu "Năm 1998, nhóm của X thử trên 153 người và thấy 44%..." không có gì để quay, nên agent vẽ một tấm thẻ chữ. Ba mươi câu như thế là ba mươi tấm slide. Kỹ năng này đảo thứ tự: **dựng sự việc trước, viết lời sau**.

Cái cố định của kênh (đọc `channels/tram-nghi-nhieu/STYLE.md`): nhân vật Kẻ Nghĩ Nhiều và Rối, nét, chữ, giọng, nhạc, phụ đề. **Cái không cố định**: nền, ánh sáng, nơi chốn, dàn người phụ, đạo cụ. Những thứ đó do câu chuyện của tập quyết định.

---

## 1. Bảy nguyên tắc

1. **Sự việc trước, lời sau.** Mỗi nhịp (beat) là *ai · làm gì · ở đâu · vật gì đổi trạng thái*. Lời được viết để thuyết minh cho sự việc. Câu nào không gắn vào một sự việc thì sửa câu, không vẽ thẻ để gánh nó. Lời không được tả lại cái màn hình đã cho thấy ("đây là một cái cân") — lời nói cái hình không nói được ("cái cân này đã bị ai đó đặt sẵn một quả cân").
2. **Một người trải qua hiệu ứng.** Mỗi tập có một nhân vật có mong muốn, ở một nơi cụ thể, vấp phải đúng hiệu ứng tâm lý đó. Đó có thể là Kẻ Nghĩ Nhiều, hoặc một người đời thường do tập tự dựng. Thí nghiệm khoa học được **dựng lại thành cảnh có người** (phòng thí nghiệm, người tham gia, nhà nghiên cứu, cái họ được yêu cầu làm), không đọc lên như trích dẫn.
3. **Con số phải là vật.** Chỉ đọc lên những con số câu chuyện cần (cỡ 1 số mỗi 20 s; `scenecheck` cho phép tối đa 2). Con số nào cũng thành thứ đếm hoặc nhìn được trong cảnh: "một phần ba" là ba chiếc ghế, một chiếc trống; "tăng gấp đôi" là chồng hồ sơ cao gấp đôi. Năm, tên tác giả, cỡ mẫu nằm trong `FACTS.md` và mô tả video, chỉ đọc lên khi nó là một phần câu chuyện.
4. **Mỗi nhịp một nơi chốn, mỗi nơi chốn một ánh sáng.** Có một nơi "nhà" để quay về, cộng các nơi của câu chuyện, khoảng **một nơi hoặc một khung mới mỗi 15–20 s**. Mỗi nơi có màu nền và nguồn sáng riêng (đèn đường vàng, ánh màn hình xanh, nắng chiều cam, đèn huỳnh quang trắng lạnh). Không dùng chung một nền tối cho cả tập.
5. **Một đạo cụ xuyên suốt, đổi trạng thái.** Chọn một vật mà trạng thái của nó *chính là* luận điểm của tập: xuất hiện ở đầu, bị biến đổi ở giữa, được giải quyết ở cuối (một tấm vé còn nguyên → bị bẻ cong → được xé; một cái đồng hồ chạy → đứng → chạy ngược).
6. **Diễn xuất khóa vào chữ.** Mỗi câu có ít nhất một nhịp diễn (biểu cảm, cử chỉ, ánh nhìn, đạo cụ phản ứng) neo vào một từ trong `voice/words.json`, kèm một foley trong `window.EV` ở đúng mốc đó. Nhân vật **chỉ tay vào đúng thứ đang được nói tới**. Câu bẻ ngoặt có cảnh phản ứng. **Rối là người hỏi vặn và đoán sai** — nói ra cách hiểu phổ biến để bị cảnh tiếp theo lật lại — không phải hình trang trí ở góc.
7. **Đường cong, không đường thẳng.** Có ít nhất một khoảng lặng thật (nhạc tắt) trước cú lật, nhạc đổi theo hồi, một chỗ thở ra trước khi kết. Nối các nhịp bằng "nhưng" hoặc "vì vậy", không phải "và rồi".

---

## 2. Quy trình (theo đúng thứ tự này)

Tất cả các bước 1–6 nằm trong `TREATMENT.md` của tập, **trước** khi có `voice/lines.json`.

```
0. FACTS       research/FACTS.md — mọi tuyên bố kèm nguồn; ghi rõ điều KHÔNG được nói quá.
1. SPINE       Một câu: "<Nhân vật> muốn <X> ở <nơi>, nhưng <hiệu ứng> khiến <Y>, vì vậy <Z>."
               Viết 3 spine khác nhau (3 nhân vật / 3 nơi khác nhau), chọn 1, ghi vì sao.
2. BEATS       Bảng nhịp, mỗi dòng: nơi · ai · hành động · vật đổi trạng thái · cảm xúc · nối (nhưng/vì vậy).
               Phép thử TẮT TIẾNG: chỉ đọc cột hành động + vật, có kể lại được câu chuyện không? Không → sửa nhịp.
3. TÌM HÌNH    Với 3–5 nhịp trừu tượng nhất (cơ chế, con số, kết luận nghiên cứu): liệt kê 4 phương án hình,
               mỗi phương án kèm "độ phổ biến" ước lượng (bao nhiêu % video khác sẽ vẽ y như thế).
               Loại phương án quen nhất (thẻ chữ, biểu đồ cột, icon, bóng đèn ý tưởng).
               Chọn phương án cụ thể nhất mà vẫn đúng sự thật trong FACTS.md.
4. LINES       Viết lời theo nhịp, ~2,3 từ/giây. Câu nào không gắn vào nhịp nào thì xóa.
               Đánh dấu trong bảng nhịp từ khóa của mỗi câu (từ mà hành động/foley sẽ nổ vào).
5. KINH THÁNH  Danh sách nơi chốn (mỗi nơi: màu nền, nguồn sáng, đồ vật cố định), dàn nhân vật,
   CỦA TẬP     đạo cụ xuyên suốt và các trạng thái của nó, bảng nhạc theo hồi.
6. BỐ CỤC      Với mỗi cảnh: khung bao (x,y,w,h trên 1920×1080) của nhân vật, đạo cụ chính, vùng chữ (nếu có),
               ở keyframe. Dải phụ đề y > 880 để trống. Chữ trên màn hình chỉ khi nó là một vật trong cảnh
               (biển hiệu, nhãn trên hộp, dòng viết trong sổ), không phải một tấm thẻ trôi nổi.
7. GIỌNG       TTS → ASR → process (CHANNEL.md §3).
8. LOOK        Viết src/sets.js của tập, render 4–6 still bằng code thật (core/render/still.mjs), tự xem:
               đúng nơi, đúng ánh sáng, đọc được hành động không cần chữ? Sửa trước khi animate.
9. ANIMATE     src/timeline.js, src/film.js; mọi nhịp diễn neo vào words.json (mục 4).
10. DỰNG + CỔNG sh build.sh → sh core/render/review.sh <tập> phải exit 0, gồm scenecheck (mục 5).
11. XEM        Contact sheet: kể lại câu chuyện chỉ từ ảnh. Không kể được → quay lại bước 2, không phải bước 9.
```

Trong `TREATMENT.md`, giữ cả ba spine, bảng nhịp, bảng tìm hình (đủ 4 phương án và lý do loại), kinh thánh và bảng bố cục. Đó là bằng chứng của việc đạo diễn; một treatment chỉ có bảng cảnh một dòng là chưa đạo diễn.

---

## 3. Dựng thế giới bằng code: rig của kênh rất mỏng, tập tự dựng bối cảnh

Rig của kênh chỉ cho **nhân vật và ngữ pháp**, không cho thế giới:

| File | Có gì |
|---|---|
| `rig/character.js` | `figure` (chỉ Kẻ Nghĩ Nhiều; tùy chọn `E`, `armL`/`armR`, `legs`, `talk`, `blink`, `battery`, `s`, `crop`), `roi`, `expr`/`EXPR`, `battery`, `PAL` |
| `rig/hands.js` | `GEST` — tư thế tay (chỉ, đếm, nhún vai...) |
| `rig/motion.js` | `spring`, `anticipate`, `squash`, `wiggle`, `particles`, `irisTransition` |
| `rig/broll.js` | `text` (đăng ký vào `TEXTS`), `stamp`, `bubble`, `focusLines`, `subtitle`, `tag`, `irisWipe`, `REG` |
| `rig/sets.js` | vài bối cảnh mẫu (`roomBack`, `roomFront`, `sofa`, `street`, `feedColumn`, `thought`, `hourRow`) và `person(g, x, y, s, màu)` — một người phụ đơn giản |
| `rig/components.js` | `dynamicBar`, `gatedReveal`, `strikeBehind`, `compoundClocks` |
| `rig/cel.js`, `rig/styles.js` | nét cel, hình học; giấy và hạt phim (`applyPaperTexture`, `renderGrainFx`) |

Vì vậy **mỗi tập viết `src/sets.js` của riêng nó**: các nơi chốn trong kinh thánh (một quầy, một sân ga, một phòng thí nghiệm, một bếp, một hành lang bệnh viện...), mỗi nơi là một hàm `(g, t, light)` vẽ nền + đồ vật cố định + nguồn sáng, và các đạo cụ có trạng thái (`prop(g, x, y, state, t)`). Đừng dồn cả tập vào `roomBack` chỉ vì nó có sẵn. Import rig bằng đường dẫn tương đối, không copy rig vào tập.

Người phụ: `S.person` với màu riêng, hoặc tập tự vẽ người phụ trong `src/sets.js` cùng ngôn ngữ nét (`cel`, nét `#1D202A`); một đám đông là nhiều người nhỏ có chuyển động lệch pha. Người phụ cũng diễn (quay đầu, cầm đồ, đi qua), không đứng như hình nhân.

---

## 4. Đồng bộ hình–tiếng: ba đồng hồ

1. **Dựng trước (~0,3 s)**: nơi chốn và đạo cụ có mặt trước khi lời nhắc tới, để mắt kịp định vị.
2. **Nổ đúng từ**: hành động, chỉ tay, đạo cụ đổi trạng thái nổ vào `t0` của từ khóa trong `words.json` (mốc của câu cộng mốc của từ). Một cảnh gộp nhiều câu thì mỗi câu dùng mốc riêng `L('câu').t0`, không dùng chung một `t0`. Mỗi hành động có foley trong `window.EV` ở cùng mốc.
3. **Giấu kết luận**: con dấu, cú lật, nhãn kết luận chỉ hiện khi lời nói tới (`gatedReveal` hoặc `if (T >= tGate)`).

Không khung nào đứng im quá ~1,5 s: nhân vật thở, chớp mắt, ánh sáng nơi chốn có chuyển động nhỏ (khói, mưa, người đi qua nền), đạo cụ phản ứng. Máy giữ yên trong một cảnh; chuyển động đến từ người và vật.

---

## 5. Cổng đo (máy đo, không tự khai)

`review.sh` chạy `core/render/scenecheck.mjs` trên mọi tập. Nó đo từ chính trang và file giọng:

| Cổng | Ngưỡng | Ý nghĩa |
|---|---|---|
| cards | ≤ 25 % khung | khung mà chữ đăng ký (`TEXTS`) phủ ≥ 12 % màn hình hoặc ≥ 5 hộp chữ: khung để đọc, không để xem |
| looks | ≥ 1 mỗi 20 s | số "bức hình" khác nhau (đo bằng màu): nơi mới, ánh sáng mới, khung mới |
| numbers | ≤ 2 mỗi 20 s | con số và năm đọc lên trong `lines.json` |
| foley on words | ≥ 60 % | foley trong `EV` nằm cách một từ được nói ≤ 0,3 s |
| lines with an event | ≥ 80 % | câu có ít nhất một foley trong lúc nói |

Đừng lách cổng (bỏ đăng ký chữ khỏi `TEXTS`, đổi màu nền ngẫu nhiên để tăng "looks"): cổng đo triệu chứng; lách nó thì phim vẫn là slide. Sau cổng là **phép thử tắt tiếng** trên contact sheet (bước 11).

---

## 6. Dấu hiệu đang làm slide (dừng lại và quay về bảng nhịp)

- Một nhịp mà cột "hành động" là "hiện số liệu", "giải thích cơ chế", "tổng kết".
- Một cảnh mà nhân vật nằm trong vòng tròn nhỏ ở góc còn phần còn lại là đồ họa.
- Biểu đồ cột/đường, tường thẻ, danh sách gạch đầu dòng. (Một biểu đồ chỉ được phép khi nó là vật trong cảnh — vẽ trên bảng trắng trong phòng họp, in trên tờ báo nhân vật đang cầm — và tối đa một lần mỗi tập.)
- Lời có tên tác giả + năm + cỡ mẫu + phần trăm trong cùng một câu.
- Ba cảnh liền nhau cùng nền, cùng ánh sáng, cùng khung.
- Rối chỉ xuất hiện để nói một câu cảnh báo rồi biến mất.

---

## 7. Bàn giao

- `review.sh` exit 0 (gồm scenecheck), `.mp4` dựng xong, `poster.jpg`, `.srt`.
- `TREATMENT.md` có đủ mục 2 (spine ×3, nhịp, tìm hình, kinh thánh, bố cục).
- Tiêu đề trong `film.json` khớp với lời mở đầu và với `FACTS.md`; không có tuyên bố nào ngoài `FACTS.md`.
- Kết bằng một hành động nhỏ người xem làm được ngay, **được diễn ra trong cảnh** (nhân vật làm việc đó), không phải đọc lên trên một tấm thẻ.
