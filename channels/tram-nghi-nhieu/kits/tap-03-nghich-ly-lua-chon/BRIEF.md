# BRIEF — Tập 03: Nghịch lý lựa chọn (bộ kit dùng chung cho nhiều engine)

Tập phim này được sản xuất **cùng một lần** trên nhiều engine khác nhau (Canvas 2D, Remotion,
HyperFrames) để so sánh. Vì vậy **lời thoại, số liệu và cấu trúc là cố định**; chỉ phần diễn
hình (bố cục, camera, chuyển động) là do từng engine tự quyết.

| Mục | Giá trị |
|---|---|
| Chủ đề | Nghịch lý lựa chọn — tại sao càng nhiều lựa chọn ta lại càng mệt |
| Thời lượng mục tiêu | **3:00 – 3:20** (không dài hơn 3:30) |
| Ngôn ngữ | Tiếng Việt |
| Nhân vật | Kẻ Nghĩ Nhiều (Overthinker) + Rối (scribble tím) |
| Bội | `FACTS.md` (nguồn + ranh giới) — mọi con số trên màn hình phải có mặt trong đó |
| Lời thoại | `script.json` — 29 dòng, đã thu sẵn ở `voice/` |
| Thời gian từng dòng | `voice/durations.json` (giây) — cảnh phải khớp với giọng |

---

## 1. Cấu trúc tám nhịp (cứng)

| # | Nhịp | Nội dung | Dòng lời |
|---|---|---|---|
| 1 | Móc | Cầm thực đơn, không chọn được món nào | `hook` `hook2` `intro` |
| 2 | Câu chuyện nổi tiếng | Hai bàn nếm mứt 6 vị và 24 vị | `myth` `myth2` `jam` `jam2` `jam3` |
| 3 | Phản chứng | Tổng hợp 50 thí nghiệm: hiệu ứng trung bình gần bằng không | `meta` `meta23` `rep` |
| 4 | Đảo chiều | "Nghịch lý lựa chọn là sai" — nhưng cảm giác mệt thì có thật | `turn` `turn2` `ghost` `ghost2r` |
| 5 | Cơ chế | Hối tiếc + kỳ vọng cao hơn | `bar2` |
| 6 | Bốn yếu tố | 53 nghiên cứu, 7.202 người, 4 yếu tố điều tiết | `four` `fAB` `f56` |
| 7 | Cách dùng | Tiêu chí trước, satisficing, loại theo tiêu chí | `model` `model2` `model3` `actionAll` |
| 8 | Chốt | Rối nói một câu; Kẻ Nghĩ Nhiều chốt; lời dặn cuối | `roi` `close` `close2` `next` |

Tổng cộng **27 dòng lời**. Mỗi dòng có một file `voice/<id>.mp3` và một mốc thời gian trong
`voice/durations.json` (giây).

Nhịp 3 và 6 là **hai nhịp không được bỏ**: đây là tập phim nói "câu chuyện chưa xong", không đứng
về một phe. Cắt nhịp 3 là biến tập phim thành một bài quảng cáo.

---

## 2. Luật hình ảnh (không có ngoại lệ)

1. **Cấm slide.** Không có màn hình trắng toàn khung, không có tiêu đề đặt trên nền trống, không
   có dãy gạch đầu dòng. Mọi câu thoại phải diễn ra trong một cảnh có nhân vật, đạo cụ và bối cảnh.
2. **Cấm khung chết.** Không có lúc nào nhân vật và đạo cụ đứng yên. Luôn có: thở, chớp mắt, mắt
   liếc, bóng đèn nhấp nháy, bụi bay trong luồng sáng, tay cầm vật.
3. **Ẩn dụ vật lý.** Mỗi khái niệm tâm lý phải thành một đạo cụ cơ khí: hai bàn mứt thật, một
   cái phễu lọc, một cái đồng hồ đếm ngược, một sổ ghi lại "lựa chọn thứ hai".
4. **Cắt cảnh mỗi 3–6 giây.** Đổi cỡ cảnh (cận cảnh mặt / trung cảnh hai người / toàn cảnh phòng)
   hoặc đổi đạo cụ chính của cảnh. Không để một cảnh quá 8 giây mà không đổi.
5. **Người nói phải hiện diện.** Kẻ Nghĩ Nhiều nói những lời của mình; Rối nói lời của mình.
   Câu nào là lời của Rối thì Rối phải xuất hiện.

---

## 3. Luật chữ và phụ đề

- Chữ chính: **Be Vietnam Pro** (Black 900 cho tiêu đề, Bold 800 cho phụ đề).
- Ghi chú tay: **Patrick Hand**.
- Phụ đề: đặt ở chân khung, độ đậm 800, cỡ 38–44px, viền đen 10px, nền tối mờ — đọc được trên
  màn hình điện thoại.
- **Không chồng chữ lên mặt nhân vật.** Phụ đề ở dưới, nhân vật ở trên hoặc giữa khung.
- Con số trên màn hình phải viết bằng chữ (không dùng số La Mã, không dùng ký hiệu lạ).

---

## 4. Luật âm thanh

- Lời thoại: file `voice/<id>.mp3`, đặt đúng nhịp theo `durations.json` — một dòng lời bắt đầu
  đúng lúc nhân vật nói.
- Mỗi dòng lời có một khoảng lặng ~0,6–0,9 giây trước khi dòng sau bắt đầu (dùng để cắt cảnh).
- Nhạc nền: một mảng dài ~3 phút, giữ ở mức thấp dưới giọng (không bắt buộc có, nhưng phim
  không được để trống tiếng).
- Âm lượng đích của bản xem: **-14 LUFS** (đo bằng `ffmpeg -i out.mp4 -af ebur128`).
- Không dùng nhạc có lời.

---

## 5. Điều kiện nghiệm thu

- [ ] Thời lượng trong khoảng 3:00–3:20.
- [ ] Không có khung chết: không frame nào giống hệt frame trước trong quá 0,5 giây.
- [ ] Không có màn hình trắt toàn khung / slide.
- [ ] Mọi con số hiện trên màn hình đều có trong `FACTS.md`.
- [ ] Không nói những gì `FACTS.md` cấm.
- [ ] Giọng đủ rõ, tổng âm lượng -14 LUFS, không clipping.
- [ ] Có phụ đề tiếng Việt đúng chính tả.
- [ ] File xuất: MP4 H.264 + AAC, 1920×1080, 30 fps.

---

## 6. Nguồn tham chiếu (bắt buộc đọc)

- `FACTS.md` — nghiên cứu gốc, số liệu, và ranh giới.
- `script.json` — lời thoại cố định.
- `voice/durations.json` — thời lượng từng dòng (giây).
