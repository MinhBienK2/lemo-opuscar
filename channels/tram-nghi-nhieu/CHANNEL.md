# Trạm Nghĩ Nhiều

Kênh tiếng Việt giải thích các câu hỏi "tại sao" của đời thường bằng diorama 3D toon. Không có nhân vật đại diện; một giọng kể.

| | |
|---|---|
| Nội dung, chọn đề tài, định dạng | [`STRATEGY.md`](STRATEGY.md) |
| Hình (bất biến) | [`STYLE.md`](STYLE.md), khung tham chiếu `demo/stills/` |
| Đạo diễn và dựng một tập | [`.agents/skills/tram-nghi-nhieu/SKILL.md`](../../.agents/skills/tram-nghi-nhieu/SKILL.md) |
| Rig 3D (API) | [`rig/README.md`](rig/README.md) |
| Demo 18 s và cái học được từ nó | [`DEMO.md`](DEMO.md) |

## Thư mục

```
channels/tram-nghi-nhieu/
├── rig/            # code 3D dùng chung: render.js, kit.js, lights.js, fx.js, cutaway.js
├── demo/           # phim mẫu 18 s, cutaway/ 8 s, stills/ (khung tham chiếu)
├── voice/          # tts_vi.py, asr_vi.py, process.py
├── mk_timeline.py  # lines.json + words.json → src/timeline.js của tập
├── beatsheet.mjs   # mỗi câu một khung lúc đang nói, kèm chữ → out/beats/sheet_*.jpg
├── review.sh       # một phiên model mới chấm: --script chấm lời trước khi làm giọng; không cờ chấm cảnh/cả phim chỉ từ hình và lời → <tập>/review/, exit 0 = PASS
├── CRITIC.md       # thang chấm hình và mẫu báo cáo
├── SCRIPT-CRITIC.md # thang chấm lời kể (dữ kiện, dựng được bằng vật thật, nhân quả, tiếng Việt nói)
├── propcheck.mjs   # mỗi vật trong src/props.js của tập, đứng riêng, ba phía → review.sh --props cho người xem không biết tên gọi tên
├── gate.py         # con dấu PASS của người chấm; mix.py không dựng tập chưa PASS hay đã đổi sau PASS
├── mix.py          # nhạc, ambience, foley, lùi dB, master
├── fonts/          # Be Vietnam Pro, Patrick Hand (OFL)
└── series/<cột>/<tập>/
```

Một tập chỉ giữ phần riêng của nó (`TREATMENT.md`, `research/FACTS.md`, `voice/`, `src/`, `index.html`, `build.sh`) và gọi code kênh bằng đường dẫn tương đối, không sao chép:

```js
import { film, label, subtitle, toScreen } from '../../../../rig/render.js';   // từ series/<cột>/<tập>/src/
```

Tạo tập: `sh core/render/new_episode.sh tram-nghi-nhieu series/do-vat/tap-01-ten "Câu hỏi?"` (từ gốc thư viện).

## Máy này

- WebGL headless chỉ chạy với `LEMO_ANGLE=vulkan` trước mọi lệnh `still.mjs`, `video.mjs`, `review.sh`.
- Ổ đĩa gần đầy: xoá still thử và `out/` cũ khi xong.
- Whisper: `HF_HOME` phải trỏ tới thư mục cục bộ có `faster-whisper-small` (mặc định `~/.cache/huggingface` là liên kết tới ổ chưa mount).

## Đăng YouTube

`out/<tên>.mp4` (1920×1080, 24 fps, H.264 + AAC, −14 LUFS) và `<tên>.transcript.srt` (không đặt trùng tên phim, kẻo trình phát vẽ đè lên phụ đề đã khắc). Đăng **private**, xem lại trên điện thoại, rồi mới public. Thumbnail lấy từ `out/poster.jpg`, thêm 4–6 chữ Be Vietnam Pro 900.
