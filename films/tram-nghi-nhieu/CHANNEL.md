# Trạm Nghĩ Nhiều — kênh và quy trình sản xuất

Kênh tâm lý học bằng hoạt hình 2D tối giản. Mỗi tập là **một câu hỏi đời thường**, được trả lời bằng dữ kiện có nguồn, và kết thúc bằng **một hành động cụ thể** người xem làm được ngay.

## 1. Danh tính kênh

| | |
|---|---|
| Tên | **Trạm Nghĩ Nhiều** |
| Handle | `@Tramnghinhiu` (dự phòng `@Kenghaynghi`) |
| Thể loại | Education / Entertainment |
| Mô tả | *"Giải mã góc khuất tâm lý con người, hành vi ngớ ngẩn của não bộ và những câu hỏi oái oăm trong cuộc sống dưới lăng kính hoạt hình 2D."* |
| Nhân vật | **Kẻ Nghĩ Nhiều** (chủ nhân) + **Rối** (đồng học) |
| Ngôn ngữ | Tiếng Việt |
| Nhịp đăng | 1 tập / tuần (Shorts 60–90 s) + 1 tập dài 3–5 phút / 2 tuần |

**Ảnh đại diện & banner**: nền `#12131A`, đầu vuông-vò tròn `#FAF8F5` của Kẻ Nghĩ Nhiều ở góc phải, sợi tóc sợi đèn sáng, Rối tím ở góc trái, chữ "TRẠM NGHĨ NHIỀU" mù mè `#FFB703`. Cùng bộ nhận diện này dùng cho thumbnail mọi tập.

## 2. Các cột nội dung

1. **Nghịch lý đời thường** — "tại sao càng rảnh ta càng mệt", "tại sao mình càng cố thì càng mệt".
2. **Vết bầm thần kinh** — một cách giải thích quen thuộc, rồi bằng chứng bác bỏ.
3. **Không gian và tâm trạng** — ánh sáng, màn hình, nơi chốn, giấc ngủ.
4. **Hành vi vô thức** — trôi đi trong hội thoại, chân thủ quen, quy tắc xã hội.

Mỗi tập thuộc đúng một cột; đổi cột là đổi bối cảnh (bàn làm việc / sofa ban đêm / phố bình minh).

## 3. Quy trình một tập

Trong thư mục `films/tram-nghi-nhieu/` (nhân bản thư mục này cho tập mới: `films/tram-nghi-nhieu-tap-XX/`):

1. **Chủ đề + nguồn** → `research/FACTS.md`: mọi con số kèm trích dẫn (DOI/link), và đánh dấu rõ điều gì **không** được nói quá.
2. **Kịch bản** → `voice/lines.json`: 16–20 câu, mỗi câu một ý, viết số thành chữ ("bốn mươi bảy phần trăm") cho giọng đọc đúng; giữ `rate`/`pitch` cho giọng nhân vật.
3. **Giọng đọc**:
   ```sh
   $LIB/.venv/bin/python voice/tts_vi.py voice/lines.json voice/          # edge-tts, có tự thử lại khi câu bị "không có âm"
   HF_HOME=~/.cache/hf $LIB/.venv/bin/python voice/asr_vi.py voice/lines.json voice/ --model small   # kiểm tra lời + mốc thời gian từng từ
   $LIB/.venv/bin/python voice/process.py                                   # 48 kHz + điều khiển miệng (lips.json)
   ```
   Đọc kỹ các dòng `DIFF`: Whisper hay nghe sai dấu tiếng Việt, đó không phải lúc nào cũng là lỗi giọng đọc — nhưng nếu một câu nghe sai hẳn thì phải viết lại câu đó rồi làm lại từ bước 3.
4. **Timeline** → `src/timeline.js`: `SEQ` (thứ tự câu + khoảng lặng), `SUBS` (mảnh phụ đề, chia theo từ đầu tiên của mảnh).
5. **Hình ảnh** → `src/film.js`: danh sách cảnh, máy quay, hiệu ứng, sự kiện âm thanh.
6. **Dựng** → `sh build.sh`: `events.mjs` → `mix.py` → `video.mjs` → `srt.py` → `mux.sh` (−14 LUFS) → poster.
7. **Kiểm tra**: xem 6–10 khung hình giữa mỗi cảnh; đọc phụ đề; xem lại `.srt` xem có câu nào rỗng (`t1 == t0`); đo mức giọng nói so với nền (`mix.py --stats`).

## 4. Cấu trúc thư mục

```
films/tram-nghi-nhieu/
├── index.html          # trang của phim (hợp đồng trang: render/DUR/EV/TEXTS)
├── src/cel.js          # công cụ cel (bố cục, nét, ribbon, IK)
├── src/character.js    # Kẻ Nghĩ Nhiều + Rối: đầu, tóc, hoodie, biểu cảm, tay, chân
├── src/broll.js        # nền tối, panel, highlight, con dấu, pop-in, bong bóng, phụ đề
├── src/sets.js         # bàn làm việc ban đêm, sofa, phố bình minh, feed, người
├── src/timeline.js     # thời gian: câu, khoảng lặng, mảnh phụ đề, điều khiển miệng
├── src/film.js         # các cảnh, máy quay, chuyển cảnh
├── mix.py              # nhạc + ambience + foley + lùi dB + nén
├── voice/              # lines.json + wav + words.json + lips.json + 3 script
├── fonts/              # Be Vietnam Pro + Patrick Hand (OFL)
├── research/FACTS.md   # nguồn của mọi con số
├── TREATMENT.md        # 3 cấu trúc, bảng cảnh, bảng nhạc, bảng âm thanh
├── STYLE.md            # ngôn ngữ hình ảnh của kênh
└── out/                # kết quả dựng (không commit)
```

## 5. Đăng tải lên YouTube

Video: `out/tram-nghi-nhieu-tap-01.mp4` (1920×1080, 24 fps, H.264 + AAC, −14 LUFS), phụ đề `.srt` (đẩy cả `.srt` lên để YouTube dịch).

```python
# publish.py — chạy một lần, dùng google-api-python-client + OAuth client secrets
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
yt = build('youtube', 'v3', credentials=creds)
yt.videos().insert(part='snippet,status', body={
  'snippet': {
    'title': 'Tại sao càng rảnh bạn lại càng mệt? 🧠 #shorts',
    'description': ('Đầu bạn chiếm 47% thời gian thức để nghĩ về chuyện không liên quan gì tới việc đang làm. '
                    'Vậy tại sao ngày rảnh lại mệt? Đăng ký để giải mã bản thân mỗi ngày!\n\n'
                    '0:00 Có những ngày không làm việc gì cả\n0:05 Vấn đề là đầu bạn không ngừng nghĩ\n'
                    '0:47 Hiệu ứng gần như bằng 0\n1:02 Nghỉ thật là gì\n\n#TamLyHoc #Nghinhiu #HanhViConNguoi'),
    'tags': ['TamLyHoc', 'Nghinhiu', 'HanhViConNguoi', '2D Animation'],
    'categoryId': '27', 'defaultLanguage': 'vi', 'defaultAudioLanguage': 'vi',
  },
  'status': {'privacyStatus': 'public', 'selfDeclaredMadeForKids': False},
}, media_body=MediaFileUpload('out/tram-nghi-nhieu-tap-01.mp4', chunksize=-1, resumable=True)).execute()
```

Thứ tự việc: dựng → kiểm tra → đăng ở chế độ **private** → xem lại trên TV/điện thoại → đổi sang **public** (hoặc hẹn giờ lên YouTube Studio).

Thumbnail: lấy từ `out/poster.jpg` (khung hình đẹp nhất) và thêm chữ lớn bằng Be Vietnam Pro; nền `#12131A`, nhân vật ở góc phải, 4–6 chữ.

## 6. Quy tắc nội dung

- Không có tuyên bố tâm lý học nào mà không có trong `research/FACTS.md`.
- Nói rõ khi nghiên cứu **không** ủng hộ cách giải thích phổ biến (tập 01 là ví dụ).
- Không dùng hình ảnh, âm thanh, logo hay nhân vật của bất kỳ ai khác.
- Không chẩn đoán, không kêu thuốc, không khuyên người xem thay thế chuyên gia.
- Mỗi tập kết bằng một hành động nhỏ, cụ thể, làm được ngay — đó là chất riêng của kênh.
