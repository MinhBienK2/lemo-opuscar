# Trạm Nghĩ Nhiều

Kênh tiếng Việt giải thích các câu hỏi "tại sao" của đời thường bằng diorama 3D toon. Không có nhân vật đại diện; một giọng kể.

**Làm một tập: theo [`.agents/skills/tram-nghi-nhieu/SKILL.md`](../../.agents/skills/tram-nghi-nhieu/SKILL.md).** Đó là quy trình duy nhất của kênh, kể cả khi nào dừng và khi nào bàn giao. Nó thay cho bước 1–6 của `AGENTS.md`.

| | |
|---|---|
| Nội dung, chọn đề tài, độ dài | [`STRATEGY.md`](STRATEGY.md) |
| Hình (bất biến) | [`STYLE.md`](STYLE.md), khung tham chiếu `demo/stills/` |
| Rig 3D (API) | [`rig/README.md`](rig/README.md) |
| Ba người chấm: dàn ý, lời, hình | [`OUTLINE-CRITIC.md`](OUTLINE-CRITIC.md), [`SCRIPT-CRITIC.md`](SCRIPT-CRITIC.md), [`CRITIC.md`](CRITIC.md) |
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
├── voice/            # tts_vi.py (--jobs N; chỉ chạy khi lời đã PASS), asr_vi.py, process.py
├── mk_timeline.py    # lines.json + words.json → src/timeline.js của tập
├── beatsheet.mjs     # mỗi câu một khung lúc đang nói, kèm chữ và cờ DARK SAME RUN NUM
├── propcheck.mjs     # mỗi vật của src/props.js đứng riêng, ba phía (+ propcheck/: trang của nó)
├── review.sh         # một phiên model mới chấm: --outline, --script, --props, cảnh, chương, cả phim, --video
├── gate.py           # con dấu PASS; tts_vi.py, mix.py và core/render/video.mjs hỏi nó trước khi chạy
├── mix.py            # nhạc, ambience, foley, lùi dB, master
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
- Ổ đĩa gần đầy: xoá still thử và `out/` cũ khi xong.

## Đăng YouTube

`out/<tên>.mp4` (1920×1080, 24 fps, H.264 + AAC, −14 LUFS) và `<tên>.transcript.srt` (không đặt trùng tên phim, kẻo trình phát vẽ đè lên phụ đề đã khắc). Đăng **private**, xem lại trên điện thoại, rồi mới public. Thumbnail lấy từ `out/poster.jpg`, thêm 4–6 chữ Be Vietnam Pro 900.
