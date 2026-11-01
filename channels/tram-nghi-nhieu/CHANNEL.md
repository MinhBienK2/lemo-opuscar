# Trạm Nghĩ Nhiều — kênh và quy trình sản xuất

Kênh tâm lý học bằng hoạt hình 2D tối giản. Mỗi tập là **một câu hỏi đời thường có sức nặng**, được trả lời bằng dữ kiện khoa học có nguồn, mổ xẻ kiến trúc nhận thức (xem [`STRATEGY.md`](STRATEGY.md)), và kết thúc bằng **một mô hình tư duy / hành động cụ thể** người xem áp dụng được ngay.

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

Mọi series và tập phim được gom gọn vào mục `series/`, bên trong phân chia theo chủ đề cụ thể:
* `series/nghich-ly-doi-thuong/tap-01-cang-ranh-cang-met/` (Cột 1: Nghịch lý đời thường)
* `series/tam-ly-hanh-vi/tap-01-tam-ly-tri-hoan/` (Cột 4: Tâm lý hành vi)
* `series/vet-bam-than-kinh/tap-01-khong-the-tap-trung/` (Cột 2: Chuyên sâu thần kinh / bản dài)

**Không nhân bản thư mục tập nào** — tạo tập mới bằng scaffold:
```sh
sh core/render/new_episode.sh tram-nghi-nhieu series/nghich-ly-doi-thuong/tap-02-cang-co-cang-met "Tiêu đề tập mới"
```

Trong thư mục tập, `$CHANNEL` là thư mục kênh (`channels/tram-nghi-nhieu`) và `$LIB` là thư mục gốc của thư viện:

1. **Chủ đề + nguồn** → `research/FACTS.md` (của tập): mọi con số kèm trích dẫn (DOI/link), và đánh dấu rõ điều gì **không** được nói quá.
2. **Kịch bản** → `voice/lines.json` (của tập): Viết số thành chữ ("bốn mươi bảy phần trăm") cho giọng đọc đúng; giữ `rate`/`pitch` cho giọng nhân vật. **Quy mô kịch bản bắt buộc tính theo thời lượng yêu cầu** (xem mục 4c bên dưới).
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
├── DEMO.md             # demo của kênh
├── cast-sheet.jpg      # bảng đặc tả nhân vật The Overthinker & Rối
├── rig/                # code vẽ dùng chung (character.js, cel.js, hands.js, sets.js, broll.js)
├── mix.py              # âm thanh dùng chung: nhạc + ambience + foley + lùi dB + nén
├── fonts/              # Be Vietnam Pro + Patrick Hand (OFL) + fonts.css
├── voice/              # tts_vi.py, asr_vi.py, process.py (dùng chung)
└── series/             # MỤC SERIES CHÍNH (chứa các chủ đề chuyên biệt)
    ├── nghich-ly-doi-thuong/   # Chủ đề Nghịch lý đời thường (Cột 1)
    │   └── tap-01-cang-ranh-cang-met/
    ├── tam-ly-hanh-vi/         # Chủ đề Tâm lý hành vi & vô thức (Cột 4)
    │   └── tap-01-tam-ly-tri-hoan/
    └── vet-bam-than-kinh/      # Chủ đề Vết bầm thần kinh & Chuyên sâu (Cột 2)
        └── tap-01-khong-the-tap-trung/
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
3. **Mảnh phụ đề không quá 58 ký tự** — mảnh dài hơn sẽ thành ba dòng, mà phụ đề chỉ được có hai dòng; một mảnh vụn dưới 14 ký tự phải gộp vào mảnh trước, không để hiện một từ lơ lửng trên màn hình.
4. **Chiều cao tấm thẻ theo số dòng nó chứa** — đo theo tiêu đề + các mảnh highlight, đừng để một tấm thẻ trống trơn ba phần tư (xem tập 03: tấm thẻ cao cố định 420–520 px trong khi câu chỉ có hai dòng).
5. **Chữ trên thẻ tự thu nhỏ cho vừa khung** — tiêu đề dài phải co lại (`fitPx`) chứ không tràn ra ngoài tấm thẻ.

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

## 7. Quy chuẩn đạo diễn điện ảnh & Chống làm slide (Anti-Slide Directing Rules)

Mọi AI Agent khi nhận đề tài làm video cho kênh BẮT BUỘC phải tuân thủ nghiêm ngặt các điều luật sau (vi phạm sẽ bị `filmcheck` đánh rớt ngay lập tức):

1. **Bối cảnh sống thực tế (Real Staging)**:
   - Tuyệt đối CẤM vẽ các khối hộp chữ nhật trôi nổi và nhét chữ vào giữa như slide PowerPoint.
   - Mọi phân cảnh bắt buộc phải neo vào không gian sống thực của nhân vật Kẻ Nghĩ Nhiều: căn phòng ngủ ban đêm (`S.sofa`, giường ngủ, rèm trăng), bàn làm việc gỗ có đèn bàn vàng (`desk()`), góc ban công hoặc đường phố bình minh.
2. **Khóa Camera tĩnh (Camera holds steady inside a beat)**:
   - Tuyệt đối CẤM hiệu ứng zoom-in, zoom-out, pan lắc vô nghĩa ("phóng to di ảnh").
   - Chuyển động phải đến từ nhân vật (vẫy tay, thở dài, gãi đầu, chớp mắt `blink()`) và đạo cụ (chiếc điện thoại xanh hắt sáng, chiếc đồng hồ rung chuông), KHÔNG đến từ việc rung lắc camera.
   - Chuyển cảnh chỉ dùng: Lia máy nhanh (**Whip pan** có motion blur `smear()`) hoặc Mở vòng tròn bo góc (**Iris wipe**).
3. **Văn phong tâm sự người bạn (Conversational Tone)**:
   - Tuyệt đối CẤM đánh số thứ tự đầu câu ("Một —", "Hai —", "1.", "2.").
   - Lời thoại phải là sự thủ thỉ, tự sự đồng cảm của Kẻ Nghĩ Nhiều lúc nửa đêm.
4. **Bắt buộc mảng sự kiện âm thanh (`window.EV`)**:
   - Tuyệt đối CẤM để `window.EV = []` rỗng (sẽ làm mất toàn bộ tiếng nói).
   - Bắt buộc đăng ký đầy đủ các sự kiện `voice`, nhạc chuyển đoạn (`music: A, B, C, end`) và hiệu ứng foley (`whoosh`, `pop`, `paper`, `marker`, `ting`, `boing`).
5. **Quy tắc xuất hiện chữ an toàn (Text Reveal Invariant)**:
   - Bắt buộc dùng `revealText(g, s, x, y, p, o)` từ `rig/broll.js` cho mọi hiệu ứng chữ viết tay/chữ chạy từ trái sang phải.
   - Tuyệt đối CẤM tự chế hàm cắt chữ (`clip()`) thủ công với các hằng số offset cộng thêm — điều này sẽ làm rò rỉ ký tự đầu (`C`, `2`, `n`) nằm trơ trọi trên màn hình trước khi giọng đọc nhắc tới.

## 8. Quy chuẩn đặc tả cảnh chi tiết 5 trường (The 5-Field Shot Specification)

Khi viết `TREATMENT.md`, AI Agent **bắt buộc phải mô tả từng shot bằng 5 trường định lượng chi tiết**, tuyệt đối cấm tóm tắt sơ sài 1 dòng:

1. **`visualAnchor` (Trọng tâm thị giác & Tỉ lệ phủ màn hình)**:
   - Vật thể hoặc sơ đồ chính là gì? Chiếm tối thiểu bao nhiêu % khung hình?
   - **Quy tắc độ phủ (`Canvas Fill Invariant`)**: Vùng nội dung có chủ đích phải chiếm tối thiểu **50%–70% diện tích màn hình**. Cấm để mặt bàn hoặc khoảng trống đen chiếm > 60% màn hình trong khi hình vẽ bị co cụm ở giữa.
2. **`typography` (Hệ thống chữ & Con số)**:
   - Chỉ số thống kê (Stats): Font size $\ge 72\text{px}$, độ đậm Black 900.
   - Tiêu đề phụ (Headers): Font size $\ge 44\text{px}$, Bold 800.
   - Chú thích phụ (Secondary/Handwriting): Font size $\ge 28\text{px}$ (đảm bảo đọc được trên điện thoại).
   - Dải highlight (`hilite`): Màu nhấn cụ thể (Vàng nghệ `#FFB703`, Cyan `#67E8F9`, Đỏ `#E63946`).
3. **`propsAndStaging` (Đạo cụ & Môi trường thực)**:
   - Đạo cụ tương tác xúc giác: Cốc cà phê bốc khói, thước kẻ, kính lúp, cuốn sổ ghim, bút lông, con dấu đỏ.
   - Nguồn sáng: Luồng sáng đèn bàn vàng hoặc đèn spotlight có quầng sáng mềm.
4. **`characterActing` (Diễn xuất & Vi chuyển động)**:
   - Nhân vật nhìn về đâu, tay làm gì (lật trang, chỉ tay, gãi đầu, cầm bút).
   - Cảm xúc mắt (`blink()`, `headYaw`, `headPitch`) và trạng thái sợi tóc đèn LED (bừng sáng / chập chờn / tắt).
5. **`soundSync` (Đồng bộ âm thanh)**:
   - Mỗi chuyển động nét vẽ hay chữ xuất hiện phải có foley chính xác ở mốc giây (`marker`, `paper`, `stamp`, `pop`, `ting`, `boing`).

## 9. Bộ luật thị giác chống nhạt (Visual Invariants / Impeccable Rules)

1. **Cấm lặp lại góc máy bàn liên tiếp quá 2 cảnh**: Bắt buộc luân chuyển nhịp: *Toàn cảnh phòng / quán $\to$ Cận cảnh bàn $\to$ Trung cảnh đối thoại với Rối $\to$ Sơ đồ trực quan $\to$ Trở lại bàn*.
2. **Độ dày nét vẽ (`Visual Weight / Bolder`)**: Mọi đường nét sơ đồ, khung viền, mũi tên cơ chế phải có `lineWidth >= 5px` (không dùng nét mảnh $1.5\text{px}$ như phác thảo bút chì yếu ớt).
3. **Bất biến không va chạm phụ đề (`Subtitle Collision-Free Invariant`)**:
   - $t_1$ của mảnh phụ đề trước bắt buộc phải $\le t_0 - 0.04\text{s}$ của mảnh phụ đề sau.
   - Khi render, chỉ vẽ mảnh phụ đề tích cực nhất (`TL.cues.findLast(...)`), tuyệt đối không dùng vòng lặp vẽ chồng tất cả các cue trùng thời gian.

## 10. Luật tự động quy đổi thời lượng (Duration-to-Scale Invariant)

Người dùng chỉ cần đưa ra **chủ đề và thời lượng mong muốn** (hoặc không nêu thì mặc định 3–5 phút). AI Agent **tuyệt đối không được hỏi lại về số lượng câu thoại hay kịch bản**, mà BẮT BUỘC phải tự động áp dụng công thức chuẩn của kênh:

| Thời lượng người dùng yêu cầu | Số câu thoại chuẩn trong `lines.json` | Số phân cảnh trong `film.js` | Cơ chế Timeline |
|---|---|---|---|
| **Shorts (60–90 giây)** | **16 – 22 câu** | 8 – 12 cảnh | Gõ tay hoặc sinh timeline |
| **Tiểu luận 3 – 5 phút** | **35 – 50 câu** | 20 – 35 cảnh | Sinh bằng `mk_timeline.py` |
| **Bản dài chuyên sâu 8 – 10 phút** | **80 – 110 câu** | 50 – 70 cảnh (hoặc beat library) | Sinh bằng `mk_timeline.py` |
| **Đặc biệt 15 – 20 phút** | **150 – 200 câu** | Beat library (`BEATS.md`) | Sinh bằng `mk_timeline.py` |

**Luật cấm**: Cấm tuyệt đối việc nhận đề bài 5–10 phút mà chỉ viết kịch bản 15–20 câu rồi kéo dài khoảng lặng chết để câu giờ. Thời lượng phải đến từ lượng kiến thức và chiều sâu phân tích thực tế.

## 11. Luật tự chủ quy trình (Autonomous Pipeline Invariant)

Khi nhận một prompt ngắn gọn từ người dùng (ví dụ: *"Làm video 10 phút về chủ đề X cho kênh Trạm Nghĩ Nhiều"*), AI Agent **bắt buộc phải tự động kích hoạt và chạy xuyên suốt toàn bộ chuỗi sản xuất từ A đến Z** mà không dừng lại xin phép ở từng bước:
1. Tự chạy `new_episode.sh` scaffold thư mục tập.
2. Tự web search tìm paper khoa học gốc (PubMed / ScienceDirect / JCR) và viết `research/FACTS.md` có nguồn số liệu chuẩn xác.
3. Tự viết toàn bộ `voice/lines.json` theo đúng số lượng câu của bảng thời lượng.
4. Tự chạy chuỗi âm thanh: `tts_vi.py` $\to$ `asr_vi.py` (với `HF_HOME=/home/minhbien/hf-cache`) $\to$ `process.py`.
5. Tự viết `TREATMENT.md` tuân thủ đủ 5 trường đặc tả cảnh (`visualAnchor`, `typography`, `propsAndStaging`, `characterActing`, `soundSync`).
6. Tự sinh `src/timeline.js` (đảm bảo không va chạm phụ đề) và viết `src/film.js` vẽ Canvas dày dặn, đậm nét.
7. Tự chạy `build.sh` render video Full HD và chạy `review.sh` đạt PASS 100%.
