# Trạm Nghĩ Nhiều — kênh và quy trình sản xuất

Kênh giải thích bằng hoạt hình 2D tối giản. Mỗi tập là **một câu hỏi "tại sao" của đời thường**, thuộc bất cứ ngành nào: cơ thể, đầu óc, tiền, đồ vật và công nghệ, thế giới quanh ta, ngày xưa. Câu trả lời là một cơ chế thật có nguồn, được **diễn ra thành cảnh** ở nơi nó xảy ra ngoài đời, và người xem mang về một việc làm được hoặc một cách nhìn mới. Chọn đề tài: [`STRATEGY.md`](STRATEGY.md). Đạo diễn: [`.agents/skills/tram-nghi-nhieu/SKILL.md`](../../.agents/skills/tram-nghi-nhieu/SKILL.md).

Kênh nằm ở `channels/tram-nghi-nhieu/`. Nó giữ **danh tính** (tên, nhân vật, bộ nhận diện, ngôn ngữ hình ảnh) và **code dùng chung** (rig, mix, fonts, voice). Mỗi tập là một thư mục riêng `channels/tram-nghi-nhieu/series/<cột>/<tập>/` và chỉ giữ phần **của riêng nó**: treatment, research, tên phim, bảng cảnh và giọng đọc. Không có bản sao nào của code kênh nằm trong một tập.

## 1. Danh tính kênh

| | |
|---|---|
| Tên | **Trạm Nghĩ Nhiều** |
| Handle | `@Tramnghinhiu` (dự phòng `@Kenghaynghi`) |
| Thể loại | Education / Entertainment |
| Mô tả | *"Những câu hỏi tại sao của đời thường, mà ai cũng gặp nhưng ít ai hỏi tới cùng — trả lời bằng hoạt hình 2D."* |
| Nhân vật | **Kẻ Nghĩ Nhiều**, người dẫn duy nhất: một giọng kể cả phim. Người trong câu chuyện diễn bằng hành động, không nói thoại |
| Ngôn ngữ | Tiếng Việt |
| Nhịp đăng | 1 tập / tuần (Shorts 60–90 s) + 1 tập dài 3–5 phút / 2 tuần |

**Ảnh đại diện & banner**: nền `#12131A`, đầu vuông-vò tròn `#FAF8F5` của Kẻ Nghĩ Nhiều ở góc phải, sợi tóc sợi đèn sáng, chữ "TRẠM NGHĨ NHIỀU" mù mè `#FFB703`. Cùng bộ nhận diện này dùng cho thumbnail mọi tập.

## 2. Các cột nội dung

Các cột và ví dụ câu hỏi: [`STRATEGY.md`](STRATEGY.md) §2. Mỗi tập thuộc một cột, và cột là thư mục trong `series/`. Câu hỏi không vừa cột nào thì mở cột mới.

## 3. Quy trình một tập

Kênh vừa làm lại từ đầu: chưa có tập nào. Tập đầu tiên làm xong sẽ thành demo của kênh (`DEMO.md`).

Tạo tập mới bằng scaffold (mỗi tập bắt đầu từ thư mục trống của nó):
```sh
sh core/render/new_episode.sh tram-nghi-nhieu series/the-gioi/tap-01-mua-ket-xe "Vì sao trời mưa thì kẹt xe hơn?"
```

Trong thư mục tập, `$CHANNEL` là thư mục kênh (`channels/tram-nghi-nhieu`) và `$LIB` là thư mục gốc của thư viện:

1. **Chủ đề + nguồn** → `research/FACTS.md` (của tập): mọi con số kèm trích dẫn (DOI/link), và đánh dấu rõ điều gì **không** được nói quá.
1b. **Treatment trước lời** → `TREATMENT.md`: ba spine, bảng nhịp (ai · làm gì · ở đâu · vật đổi trạng thái), tìm hình cho các nhịp khó, kinh thánh nơi chốn, bố cục. Các phần và thứ tự: [`SKILL.md`](../../.agents/skills/tram-nghi-nhieu/SKILL.md) §1, theo `DIRECTOR.md` §2–§7. Lời được viết **từ** bảng nhịp.
1c. **Board** → `board.json`: storyboard dạng dữ liệu, mỗi nhịp neo vào một từ của lời (`"hook1@sạp"`), chia thành các shot (cỡ cảnh, người dẫn ở đâu, máy chuyển động thế nào, vì sao), có người diễn; chữ chỉ là thuật ngữ, tên, nơi, thời điểm, con số, tài liệu, con dấu; tiếng là ngân sách, không phải chỉ tiêu. `python3 $LIB/tools/check_board.py <thư mục tập>` phải PASS trước khi làm giọng (ước lượng thời gian) và sau khi có `words.json`. Luật riêng của kênh: `board_rules.json` (≥ 1 nhịp `aha`, một giọng cho cả phim, mỗi nhịp có diễn là một chuyển động `move`/`d`/`xy` — [`MOTION.md`](MOTION.md)). Lời và board được một agent khác chấm nội dung trước khi làm giọng (SKILL.md §1 bước 5).
2. **Kịch bản** → `voice/lines.json` (của tập), viết theo bảng nhịp: Viết số thành chữ ("bốn mươi bảy phần trăm") cho giọng đọc đúng; giữ `rate`/`pitch` cho giọng nhân vật. Số câu theo thời lượng: SKILL.md §6.
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
4. **Timeline** → `src/timeline.js` (của tập): `SEQ` (thứ tự câu + khoảng lặng), `SUBS` (mảnh phụ đề). `build.sh` sinh file này từ `voice/lines.json` + `voice/words.json` bằng `$CHANNEL/mk_timeline.py`; khoảng lặng trước một câu là trường `gap` của câu đó (mặc định 0,26 s). Một timeline viết tay (dòng đầu không có "mk_timeline.py của kênh") được giữ nguyên.
5. **Hình ảnh** → `src/film.js` (của tập): danh sách cảnh, máy quay, hiệu ứng, sự kiện âm thanh. Tập **vẽ bằng rig của kênh**, import bằng đường dẫn tương đối (renderer phục vụ gốc thư viện):
   ```js
   import { figure, expr, blendE, PAL } from '../../../../rig/character.js';
   import { cel, path, poly, ellP, line, taper, mix, rgba, canvas, W, H, TAU, rect } from '../../../../rig/cel.js';
   import { ground, panel, hilite, stamp, pip, bubble, subtitle, tag, text } from '../../../../rig/broll.js';
   import * as S from '../../../../rig/sets.js';
   import { loadBoard } from '../../../../rig/board.js';      // board.json → shot, nhịp, chữ, biểu đồ, tiếng (SKILL.md §4)
   import { extra, crowd } from '../../../../rig/extras.js';  // người phụ có mặt, tay, đồ phụ kiện
   import { hostPip, reactClose } from '../../../../rig/host.js'; // người dẫn bình luận: vòng tròn ở góc, cận mặt
   import { clamp } from '/core/lib.js';          // thư viện
   ```
   Font của kênh: `<link rel="stylesheet" href="../../../fonts/fonts.css">` trong `index.html` của tập.
6. **Dựng** → `sh build.sh` (của tập): `events.mjs` → `mix.py` (của kênh, chạy với `FILM=<thư mục tập>`) → `video.mjs` → `srt.py` → `mux.sh` (−14 LUFS) → poster.
7. **Cổng kiểm tra** → `sh $LIB/core/render/review.sh <thư mục tập>`: treatment và LOOK.md (`tools/check_treatment.py`), board (`tools/check_board.py`), chuyển động trên `.mp4` (`tools/check_motion.py`), scenecheck, drawcheck, readcheck, whisper từng câu, khung hình review + contact sheet, độ lớn tiếng, khung đen. **Nó phải exit 0** trước khi tập được coi là xong; `build.sh` của scaffold gọi nó ở cuối.
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
├── cast-sheet.jpg      # bảng đặc tả nhân vật (bản cũ, còn vẽ Rối — Rối đã bỏ khỏi kênh)
├── rig/                # code vẽ dùng chung (character.js, extras.js, keys.js, board.js, host.js, cel.js, hands.js, sets.js, broll.js, styles.js, motion.js)
├── board_rules.json    # luật board riêng của kênh (check_board)
├── MOTION.md           # dựng chuyển động: mỗi nhịp là một move, sổ tay code cho từng kiểu
├── mix.py              # âm thanh dùng chung: nhạc + ambience + foley + lùi dB + nén
├── fonts/              # Be Vietnam Pro + Patrick Hand (OFL) + fonts.css
├── voice/              # tts_vi.py, asr_vi.py, process.py (dùng chung)
├── mk_timeline.py      # voice/lines.json + words.json → src/timeline.js của tập
└── series/<cột>/<tập>/ # các tập (STRATEGY.md §2)
```

```
channels/tram-nghi-nhieu/series/<cột>/<tập>/
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

**Luật của cách chia**: một tập **không** chứa bản sao của `rig/`, `mix.py`, `fonts/` hay `voice/` — chúng ở kênh, và tập gọi bằng đường dẫn tương đối (`../../../../rig/cel.js` từ `src/`, `../../../fonts/fonts.css` từ `index.html`, `$CHANNEL/mix.py`, `$CHANNEL/voice/tts_vi.py`). `mix.py` của kênh đọc thư mục phim từ `$FILM`, nên tập gọi nó với `FILM=$HERE`:

```sh
FILM="$HERE" "$LIB/.venv/bin/python" "$CHANNEL/mix.py"
```

Một bản sao của code chung trong một tập là một **lỗi**, không phải một cách làm tiện: hai bản sẽ lệch nhau.

## 5. Đăng tải lên YouTube

Video: file `.mp4` trong `out/` của tập (1920×1080, 24 fps, H.264 + AAC, −14 LUFS), phụ đề `.srt` (đẩy cả `.srt` lên để YouTube dịch).

```python
# publish.py — chạy một lần, dùng google-api-python-client + OAuth client secrets
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
yt = build('youtube', 'v3', credentials=creds)
yt.videos().insert(part='snippet,status', body={
  'snippet': {
    'title': 'Vì sao trời mưa thì kẹt xe hơn? #shorts',
    'description': ('Một câu trả lời ngắn, rồi các mốc thời gian và nguồn trong FACTS.md của tập.\n\n'
                    '0:00 …\n\n#TramNghiNhieu #TaiSao'),
    'tags': ['TramNghiNhieu', 'TaiSao', '2D Animation'],
    'categoryId': '27', 'defaultLanguage': 'vi', 'defaultAudioLanguage': 'vi',
  },
  'status': {'privacyStatus': 'public', 'selfDeclaredMadeForKids': False},
}, media_body=MediaFileUpload('out/<tên tập>.mp4', chunksize=-1, resumable=True)).execute()
```

Thứ tự việc: dựng → kiểm tra → đăng ở chế độ **private** → xem lại trên TV/điện thoại → đổi sang **public** (hoặc hẹn giờ lên YouTube Studio).

Thumbnail: lấy từ `out/poster.jpg` (khung hình đẹp nhất) và thêm chữ lớn bằng Be Vietnam Pro; nền `#12131A`, nhân vật ở góc phải, 4–6 chữ.

## 6. Quy tắc nội dung

- Không có tuyên bố nào, con số nào mà không có nguồn trong `research/FACTS.md`.
- Nói rõ khi bằng chứng **không** ủng hộ cách hiểu phổ biến, và khi các nguồn còn tranh cãi.
- Không dùng hình ảnh, âm thanh, logo hay nhân vật của bất kỳ ai khác.
- Không chẩn đoán, không kê thuốc, không khuyên đầu tư hay mua bán cụ thể, không khuyên người xem thay thế chuyên gia.
- Mỗi tập kết bằng điều người xem mang về: một việc làm được ngay, hoặc một cách nhìn mới về thứ quen thuộc, được diễn ra trong cảnh.

## 7. Đạo diễn một tập

Cách đạo diễn, các luật của board và rig của kênh ở một nơi: [`SKILL.md`](../../.agents/skills/tram-nghi-nhieu/SKILL.md). Quy trình gốc mà skill đi theo là [`DIRECTOR.md`](../../DIRECTOR.md) §2–§7: phim mẫu, ba cấu trúc, shot list có cột *vì sao*, beat sheet, cue map, bảng âm thanh. Một prompt ngắn ("làm video 3 phút về X cho kênh") là đủ để chạy hết quy trình, từ scaffold tới `review.sh` exit 0, không dừng hỏi ở từng bước.
