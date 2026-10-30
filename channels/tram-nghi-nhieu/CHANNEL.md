# Trạm Nghĩ Nhiều — kênh và quy trình sản xuất

Kênh tâm lý học bằng hoạt hình 2D tối giản. Mỗi tập là **một câu hỏi đời thường**, được trả lời bằng dữ kiện có nguồn, và kết thúc bằng **một hành động cụ thể** người xem làm được ngay.

Kênh nằm ở `channels/tram-nghi-nhieu/`. Nó giữ **danh tính** (tên, nhân vật, bộ nhận diện, ngôn ngữ hình ảnh) và **code dùng chung** (rig, mix, fonts, voice). Mỗi tập là một thư mục riêng `channels/tram-nghi-nhieu/<tập>/` và chỉ giữ phần **của riêng nó**: treatment, research, tên phim, bảng cảnh và giọng đọc. Không có bản sao nào của code kênh nằm trong một tập.

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

Mỗi tập là một thư mục riêng: `channels/tram-nghi-nhieu/tap-01/`, `tap-02/`, `tap-03/`. **Không nhân bản thư mục tập nào** — tạo tập mới bằng scaffold, nó gắn code chung của kênh bằng đường dẫn tương đối chứ không copy:

```sh
sh core/render/new_episode.sh tram-nghi-nhieu tap-04 "Tiêu đề tập mới"
```

Trong thư mục tập, `$CHANNEL` là thư mục kênh (`channels/tram-nghi-nhieu`) và `$LIB` là thư mục gốc của thư viện:

1. **Chủ đề + nguồn** → `research/FACTS.md` (của tập): mọi con số kèm trích dẫn (DOI/link), và đánh dấu rõ điều gì **không** được nói quá.
2. **Kịch bản** → `voice/lines.json` (của tập): 16–20 câu, mỗi câu một ý, viết số thành chữ ("bốn mươi bảy phần trăm") cho giọng đọc đúng; giữ `rate`/`pitch` cho giọng nhân vật.
3. **Giọng đọc** — script nằm ở kênh (`$CHANNEL/voice/`), đường dẫn của tập là đối số; chạy từ thư mục tập:
   ```sh
   $LIB/.venv/bin/python "$CHANNEL/voice/tts_vi.py" voice/lines.json voice/          # edge-tts, có tự thử lại khi câu bị "không có âm"
   HF_HOME=<một thư mục cục bộ có mô hình> $LIB/.venv/bin/python "$CHANNEL/voice/asr_vi.py" voice/lines.json voice/ --model small   # kiểm tra lời + mốc thời gian từng từ
   $LIB/.venv/bin/python "$CHANNEL/voice/process.py" voice/                          # 48 kHz + điều khiển miệng (lips.json)
   ```
   `HF_HOME` phải trỏ tới một thư mục **cục bộ có mô hình** `faster-whisper-small`. Mặc định `~/.cache/huggingface` trên
   máy này là một liên kết tới một ổ đĩa chưa mount, nên whisper sẽ không tải được — đừng dùng `~/.cache/hf`.
   Đọc kỹ các dòng `DIFF`: Whisper hay nghe sai dấu tiếng Việt, đó không phải lúc nào cũng là lỗi giọng đọc — nếu câu nghe
   sai **vì cách viết** (ví dụ "hai mươi giờ ba mươi" bị nghe thành "20h30") thì thêm trường `"asr"` vào câu đó trong
   `lines.json` ghi đúng cách Whisper nghe, thay vì sửa kịch bản.
4. **Timeline** → `src/timeline.js` (của tập): `SEQ` (thứ tự câu + khoảng lặng), `SUBS` (mảnh phụ đề, chia theo từ đầu tiên của mảnh).
5. **Hình ảnh** → `src/film.js` (của tập): danh sách cảnh, máy quay, hiệu ứng, sự kiện âm thanh. Tập **vẽ bằng rig của kênh**, import bằng đường dẫn tương đối (renderer phục vụ gốc thư viện):
   ```js
   import { figure, expr, blendE, PAL, roi } from '../../rig/character.js';
   import { cel, path, poly, ellP, line, taper, mix, rgba, canvas, W, H, TAU, rect } from '../../rig/cel.js';
   import { ground, panel, hilite, stamp, pip, bubble, subtitle, tag, text } from '../../rig/broll.js';
   import * as S from '../../rig/sets.js';
   import { clamp } from '/core/lib.js';          // thư viện
   ```
   Font của kênh: `<link rel="stylesheet" href="../fonts/fonts.css">` trong `index.html` của tập.
6. **Dựng** → `sh build.sh` (của tập): `events.mjs` → `mix.py` (của kênh, chạy với `FILM=<thư mục tập>`) → `video.mjs` → `srt.py` → `mux.sh` (−14 LUFS) → poster.
7. **Cổng kiểm tra** → `sh $LIB/core/render/review.sh <thư mục tập>`: drawcheck, readcheck, whisper từng câu, khung hình review + contact sheet, độ lớn tiếng, khung đen. **Nó phải exit 0** trước khi tập được coi là xong (tập 02 gọi nó ngay trong `build.sh` và để build fail theo kết quả).
8. **Kiểm tra bằng mắt**: xem 6–10 khung hình giữa mỗi cảnh; đọc phụ đề; xem lại `.srt` xem có câu nào rỗng (`t1 == t0`); đo mức giọng nói so với nền (`mix.py --stats`).
   Cổng ở bước 7 không thấy được: một nhãn nói sai trạng thái, một câu quay cận cảnh bị cắt, một chữ bị panel cắt cụt. Ba luật về nội dung nằm ở `DIRECTOR.md` §11 — đọc trước khi kể.

## 3b. Phụ đề và file transcript

Phụ đề được **khắc thẳng vào hình** (đó là một phần của phong cách kênh). File `*.transcript.srt` cạnh phim là
**transcript để nạp lên nền tảng**, và nó **không** được đặt tên giống phim — nếu tên giống, VLC sẽ tự nạp và vẽ
đè lên phụ đề đã có trong hình, trông như transcript bị đè hai lần. Khi build, `build.sh` xuất
`$NAME.transcript.srt` và copy ra thư mục tập.

## 4. Cấu trúc thư mục

Kênh giữ những gì mọi tập dùng chung; tập giữ những gì chỉ nó có:

```
channels/tram-nghi-nhieu/
├── CHANNEL.md          # file này: bản đồ của kênh (danh tính, quy trình, luật)
├── STYLE.md            # ngôn ngữ hình ảnh của kênh
├── DEMO.md             # tập đầu tiên của kênh đã làm gì
├── rig/                # code vẽ dùng chung
│   ├── cel.js          # công cụ cel (bố cục, nét, ribbon, IK)
│   ├── character.js    # Kẻ Nghĩ Nhiều + Rối: đầu, tóc, hoodie, biểu cảm, tay, chân
│   ├── sets.js         # bàn làm việc ban đêm, sofa, phố bình minh, feed, người
│   └── broll.js        # nền tối, panel, highlight, con dấu, pop-in, bong bóng, phụ đề
├── mix.py              # âm thanh dùng chung: nhạc + ambience + foley + lùi dB + nén
├── fonts/              # Be Vietnam Pro + Patrick Hand (OFL) + fonts.css
├── voice/              # tts_vi.py, asr_vi.py, process.py (dùng chung)
├── tap-01/             # tập 1
├── tap-02/             # tập 2
└── tap-03/             # tập 3
```

```
channels/tram-nghi-nhieu/tap-01/
├── TREATMENT.md        # 3 cấu trúc, bảng cảnh, bảng nhạc, bảng âm thanh
├── CREDITS
├── film.json           # sự thật của phim: title, movie, runtime
├── research/FACTS.md   # nguồn của mọi con số
├── index.html          # trang của phim (hợp đồng trang: render/DUR/EV/TEXTS)
├── build.sh            # dựng: events → mix → video → srt → mux → poster → review
├── src/                # chỉ phần riêng của tập: timeline.js, film.js, shots…
├── voice/              # lines.json + wav + words.json + lips.json (phát ra của tập)
├── events.json         # sự kiện âm thanh (sinh ra khi dựng)
├── out/                # kết quả dựng (không commit)
└── *.mp4, poster.jpg, *.transcript.srt
```

**Luật của cách chia**: một tập **không** chứa bản sao của `rig/`, `mix.py`, `fonts/` hay `voice/` — chúng ở kênh, và tập gọi bằng đường dẫn tương đối (`../../rig/cel.js`, `../fonts/fonts.css`, `$CHANNEL/mix.py`, `$CHANNEL/voice/tts_vi.py`). `mix.py` của kênh đọc thư mục phim từ `$FILM`, nên tập gọi nó với `FILM=$HERE`:

```sh
FILM="$HERE" "$LIB/.venv/bin/python" "$CHANNEL/mix.py"
```

Một bản sao của code chung trong một tập là một **lỗi**, không phải một cách làm tiện: hai bản sẽ lệch nhau.

## 4b. Tập dài (hai mươi phút) — khác tập ngắn ở đâu

Tập 03 (`channels/tram-nghi-nhieu/tap-03/`) dài khoảng **20 phút**, nên nó không thể viết như tập ngắn:

| Việc | Tập ngắn (01–02) | Tập dài (03) |
|---|---|---|
| Bảng thời gian | gõ tay trong `src/timeline.js` | **sinh** từ `voice/lines.json` bằng `mk_timeline.py` — thêm một câu là timeline tự đi theo |
| Cảnh | mỗi câu một hình vẽ riêng | một **thư viện beat** trong `src/film.js` (14 kiểu hình: `talk`, `stat`, `bars`, `compare`, `phone`, `strip`, `check`, `flow`, `money`, `head`, `myth`, `roi`, `chapter`, `end`) + bảng cảnh `src/shots.js` (+ `shots_a.js`, `shots_b.js`) chỉ nói **beat nào, chữ nào** |
| Chữ trên thẻ | gõ tay | `src/fix_cards.py` sửa, `src/check_shots.py` kiểm: chỉ số từ phải có trong câu, mọi câu phải có cảnh |
| Kịch bản | ~16–20 câu | **175 câu**; thêm câu bằng cách chèn vào `lines.json`, không sửa tay `timeline.js` |

`src/BEATS.md` mô tả beat và luật của bảng cảnh — đọc nó trước khi viết cảnh mới.

Ba luật của tập dài:
1. **Sự kiện âm thanh trong một cảnh có thời điểm tương đối** so với đầu cảnh; `film.js` cộng thêm thời điểm của cảnh. Nếu đẩy thẳng vào danh sách sự kiện, toàn bộ nhạc dồn vào giây đầu.
2. **Chữ phải vừa khung nó nằm trong**: tiêu đề trên thẻ tự thu nhỏ, dòng dài tự xuống dòng (`fitPx`, `wrap` trong `film.js`).
3. **Mảnh phụ đề không quá 58 ký tự** — mảnh dài hơn sẽ thành ba dòng, mà phụ đề chỉ được có hai dòng.

## 5. Đăng tải lên YouTube

Video: `out/tram-nghi-nhieu-tap-01.mp4` trong thư mục tập (1920×1080, 24 fps, H.264 + AAC, −14 LUFS), phụ đề `.srt` (đẩy cả `.srt` lên để YouTube dịch).

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
