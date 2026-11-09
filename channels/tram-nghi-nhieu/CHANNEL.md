# Trạm Nghĩ Nhiều

Kênh tiếng Việt giải thích các câu hỏi "tại sao" của đời thường bằng diorama 3D toon. Không có nhân vật đại diện; một giọng kể.

**Làm một tập: theo [`.agents/skills/tram-nghi-nhieu/SKILL.md`](../../.agents/skills/tram-nghi-nhieu/SKILL.md).** Đó là quy trình duy nhất của kênh, kể cả khi nào dừng và khi nào bàn giao. Nó thay cho bước 1–6 của `AGENTS.md`.

| | |
|---|---|
| Nội dung, chọn đề tài, độ dài | [`STRATEGY.md`](STRATEGY.md) |
| Hình (bất biến) | [`STYLE.md`](STYLE.md), khung tham chiếu `demo/stills/` |
| Rig 3D (API) | [`rig/README.md`](rig/README.md) |
| Câu hỏi của người chấm ở từng bước | `.agents/skills/tram-nghi-nhieu/step*/RUBRIC.md` |
| Lệnh của công cụ, và khi công cụ từ chối | [`tools/README.md`](tools/README.md) |
| Demo 18 s và cái học được từ nó | [`DEMO.md`](DEMO.md) |

## Thư mục

```
channels/tram-nghi-nhieu/
├── rig/              # code 3D dùng chung (API: rig/README.md)
│   ├── render.js     #   khung hình: siêu mẫu, viền mực, bloom, chữ
│   ├── kit.js        #   vật liệu toon, texture canvas, hình học
│   ├── lights.js     #   đèn chính, ambience, tường có lỗ, vệt sáng, pool
│   ├── fx.js         #   thứ vô hình: flow, sparks, squiggle, hạt
│   ├── sets.js       #   bối cảnh dựng sẵn: kitchen, desk, bathroom
│   ├── props.js      #   đạo cụ đổi trạng thái
│   ├── parts.js      #   linh kiện cho ruột máy móc
│   ├── section.js    #   cưa một vật nguyên bằng một mặt phẳng
│   ├── inside.js     #   bên trong một vật (tissue)
│   ├── cutaway.js    #   mặt cắt bình, ống
│   ├── brain.js      #   bên trong đầu: mô, neuron, synapse, mạch máu
│   └── voice.js      #   giờ của từng chữ, sự kiện giọng
├── templates/        # TREATMENT.tmpl.md (mẫu dàn ý của kênh), NEXT.txt: new_episode.sh dùng
├── demo/             # phim mẫu 18 s, cutaway/ 8 s, stills/ (khung tham chiếu)
├── tools/            # các công cụ & script kiểm soát tự động của kênh
│   ├── README.md    #   chạy gì, và làm gì khi công cụ từ chối — đọc cái này trước khi đọc mã
│   ├── review.sh     #   chấm theo từng mục: outline, script, look, props, picture, final (review.py)
│   ├── gate.py       #   cổng: giọng và dựng phim chỉ chạy khi các bước chấm đã xong
│   ├── props_catalog.py # danh mục vật của tập (src/props/<mã>.js), sinh src/props.js
│   ├── mix.py        #   nhạc, ambience, foley, master -14 LUFS
│   ├── beatsheet.mjs #   kiểm tra nhịp điệu khung hình & cờ máy
│   ├── propcheck.mjs #   xuất ảnh 3 phía kiểm tra linh kiện 3D
│   └── mk_timeline.py#   tính timeline từ giọng đọc
├── fonts/            # Be Vietnam Pro, Patrick Hand (OFL)
└── series/<cột>/<tập>/
```

Một tập chỉ giữ phần riêng của nó (`TREATMENT.md`, `research/FACTS.md`, `voice/`, `src/`, `index.html`, `build.sh`, `review/`) và gọi code kênh bằng đường dẫn tương đối, không sao chép:

```js
import { film, label, subtitle, toScreen } from '../../../../rig/render.js';   // từ series/<cột>/<tập>/src/
```
Tạo tập: `sh core/render/new_episode.sh tram-nghi-nhieu series/do-vat/tap-01-ten "Câu hỏi?"` (từ gốc thư viện). `series/_hand` và `series/_rigtest` là bài thử của rig, không phải tập.

## Nguyên tắc: Làm trọn vẹn, không chia nhỏ đề tài

Khi đề tài đòi hỏi đào sâu hoặc người dùng yêu cầu video dài (15–20 phút), phải thực hiện **hoàn chỉnh toàn bộ video trong một tập duy nhất**:
- Tuyệt đối không tự ý chia nhỏ thành nhiều video ngắn, không cắt bớt mắt xích nhân quả.
- Toàn bộ chuỗi 150–200 câu thoại, các bối cảnh diorama 3D, phần tiếng, nhạc và chuyển cảnh phải được dựng và render hoàn thiện thành một file `.mp4` duy nhất.
- Khi phim dài, quy trình sản xuất (TTS song song, render đa luồng, kiểm tra toàn phim) phải gánh trọn vẹn độ dài đó từ đầu đến cuối mà không được dừng lại giữa chừng.
## Máy này

- WebGL headless chỉ chạy với `LEMO_ANGLE=vulkan` trước mọi lệnh `still.mjs`, `video.mjs`, `beatsheet.mjs`, `review.sh`, `build.sh`.
- Whisper: `HF_HOME` phải trỏ tới thư mục cục bộ có `faster-whisper-small` (`build.sh` tự dùng `~/hf-cache` nếu có; mặc định `~/.cache/huggingface` là liên kết tới ổ chưa mount).
- **Whisper nghe sai dấu thanh tiếng Việt.** Model là model tiếng Anh trước: `rìa → trì`, `vải → vậy`, `cân → cưng`, `úp → út`, `giọt → dọc`. Cổng giọng của thư viện (`core/render/review.sh`) coi mỗi dòng khác là lỗi, nên một tập đọc đúng vẫn đỏ vì máy nghe sai. Dòng đó được gỡ bằng **lời xác nhận viết ra**, không bằng cách sửa kịch bản cho máy: ghi vào `voice/asr-cleared.txt`, mỗi dòng một mã lời kể và lý do — `c12 — rìa/trì: mô hình nghe sai dấu thanh, âm thanh đúng.` Dòng nào chưa có lời xác nhận thì cổng vẫn đỏ. (`asr` trong `voice/lines.json` dành cho số và từ nước ngoài, không dùng để bịt lỗi nghe của máy — R8 trong `CODING_STANDARDS.md`.)
- Ổ đĩa gần đầy: xoá still thử và `out/` cũ khi xong.
- **Bài kiểm tra đọc hình (`readcheck`, `scenecheck`) phải chạy trên một tập đã đứng yên.** Chúng so vân tay của `index.html` / `src/*.js` / `voice/lines.json` lúc mở trang và lúc đọc xong: file nào đổi trong lúc chạy thì kết quả bị bỏ và bài kiểm tra in *"the film's source changed while the check was reading it … Run it again on a settled file"* rồi thoát mã 2. Trang chết giữa chừng cũng ra *"COULD NOT RUN"*, không phải một phán quyết về phim. Vậy nên: dựng xong một đợt sửa, để nó đứng yên, rồi mới chấm — đừng chạy kiểm tra trong kúc một agent khác đang sửa cùng thư mục.
- **Dựng hình xếp hàng.** Mọi lệnh mở trình duyệt chờ một chỗ dựng hình còn trống của cả máy (`core/render/slot.mjs`, mặc định hai chỗ cho GPU 6 GB). Máy `muse` không có GPU và gần hết RAM, nên dựng hình chạy ở máy này; `muse` chỉ dùng cho ffmpeg.
- **Luật của kênh do máy giữ, không chỉ trên giấy.** `scene_rules.json` nói giới hạn của kênh (hiện: tối đa hai con số mỗi phút, `STRATEGY.md`), và `core/render/review.sh` truyền nó cho `scenecheck`. Mặc định của thư viện là 2 con số mỗi 20 giây — lỏng hơn luật của kênh ba lần, nên cột giới hạn trong `scene_rules.json` mới là thứ được giữ.

## Đăng YouTube

`out/<tên>.mp4` (1920×1080, 24 fps, H.264 + AAC, −14 LUFS) và `<tên>.transcript.srt` (không đặt trùng tên phim, kẻo trình phát vẽ đè lên phụ đề đã khắc). Đăng **private**, xem lại trên điện thoại, rồi mới public. Thumbnail lấy từ `out/poster.jpg`, thêm 4–6 chữ Be Vietnam Pro 900.
