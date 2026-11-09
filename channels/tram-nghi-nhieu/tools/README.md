# Công cụ của kênh — chạy gì, và làm gì khi nó từ chối

Đọc bảng này thay cho mã nguồn của công cụ. Công cụ dùng chung của thư viện: [`core/README.md`](../../../core/README.md).
Mọi lệnh chạy từ **gốc thư viện**.

## Chấm và cổng

| Lệnh | Nó làm gì |
|---|---|
| `sh channels/tram-nghi-nhieu/tools/review.sh <tập> <bước>` | chấm một bước theo từng mục. `<bước>`: `outline`, `script`, `look`, `props`, `picture`, `final` |
| `… <bước> --again <mã>,<mã>` | chấm lại những mục đó dù chúng chưa đổi (`--again all`: mọi mục) |
| `python3 channels/tram-nghi-nhieu/tools/gate.py status <tập>` | từng bước: xong hay chưa, bao nhiêu mục đạt, mở, phải sửa, chưa chấm |
| `python3 channels/tram-nghi-nhieu/tools/gate.py check <tập> --for voice\|render` | cổng: được làm giọng / được dựng chưa (mã 1 kèm lý do) |
| `python3 channels/tram-nghi-nhieu/tools/layout.py <tập>` | thứ gì nằm sai chỗ so với bố cục của một tập (`CHANNEL.md`), và chỗ đúng của nó; không chặn, không xoá gì. `gate.py status` và mỗi vòng `review.sh` in tóm tắt của nó |

`review.sh` ra mã **0** khi bước đã xong, **1** khi còn mục phải sửa, **2** khi vòng không chạy được (lý do in ra; đó
không phải phán quyết về phim). Nó ghi vào `review/` của tập:

- `review/<bước>.json` — trạng thái từng mục; chỉ `review.py` ghi, `gate.py` đọc.
- `review/<BƯỚC>.md` — bản tóm tắt hiện tại: mục phải sửa (câu nào sai, người chấm thấy gì, cách sửa), mục mở, góp ý.
- `review/<bước>-<vòng>.md` — lời của người chấm ở vòng đó.
- `review/FINAL-QA.md` — báo cáo nghiệm thu (bước `final`, không chặn gì).

Mỗi bước chạy các kiểm tra máy trước người chấm; lỗi máy dừng vòng trước khi tốn một lần gọi người chấm:

| Bước | Máy kiểm trước | Người chấm nhìn |
|---|---|---|
| `outline` | `check_treatment.py`, `check_research.py` | `TREATMENT.md` + `research/FACTS.md` |
| `script` | số viết bằng chữ, `check_voice_facts.py`, `check_script.py` (gợi ý) | từng câu của `voice/lines.json` |
| `look` | `check_storyboard.py` | từng ảnh trong `review/hero/`, so với `demo/stills/` |
| `props` | `COMPONENTS_SPEC.md` có mặt, `props_catalog.py --check`, `check_props_refs.py` | ảnh ba phía của vật mới hay vừa đổi (`propcheck.mjs`), sau một lần gọi tên mù |
| `picture` | `check_labels.py`, `check_label_anchors.py`, `check_shots.py --note`, `check_props_used.py` | khung của từng câu trong tờ nhịp `review/beatsheet/` |
| `final` | — | một khung mỗi câu cắt từ tệp mp4 |

## Sửa và chạy cả tập

| Lệnh | Nó làm gì |
|---|---|
| `python3 channels/tram-nghi-nhieu/tools/fixbrief.py <tập> look\|props\|picture [mã…]` | bản giao việc cho subagent sửa các mục phải sửa: lời người chấm, câu phải ĐẠT, tệp được sửa (kèm `tệp:dòng` của câu trong mã và `LOOK.md`), lệnh dựng lại, mẫu trả lời. Props: một bản mỗi vật (`=== BRIEF <mã> ===`); look/picture: tối đa 8 mục một bản, dòng `=== CÒN …` là bản kế |
| `python3 channels/tram-nghi-nhieu/tools/episode.py <tập> ["Câu hỏi?"]` | làm cả tập, mỗi chặng (1, 2, 3, 4–5, 6, 7) trong một phiên `claude -p` mới; chặng xong theo cổng; mỗi chặng tối đa 2 phiên; chi phí từng phiên vào `out/sessions.jsonl`. `--dry-run` in prompt của chặng kế; `--from <chặng>` |

## Công cụ khác

| Lệnh | Nó làm gì |
|---|---|
| `python3 channels/tram-nghi-nhieu/tools/props_catalog.py <tập>` | danh mục vật: mã, tên, tệp (`--write-index` sinh `src/props.js`; `--check` kiểm danh mục) |
| `node channels/tram-nghi-nhieu/tools/propcheck.mjs <tập> --out <thư mục>` | ảnh ba phía của từng vật (`--only <tệp.json>`: một mảng tên) |
| `node channels/tram-nghi-nhieu/tools/beatsheet.mjs <tập> --out <tập>/review/beatsheet` | tờ nhịp: một khung mỗi câu + cờ máy; vòng `picture` dùng lại nó khi mã chưa đổi |
| `python3 channels/tram-nghi-nhieu/tools/check_shots.py <tập>` | cờ máy của tờ nhịp thành danh sách câu nên soi (mã 2: tờ nhịp chưa đo hết) |
| `python3 channels/tram-nghi-nhieu/tools/check_labels.py <tập>` | nhãn nằm ở câu gọi tên nó; con số trên nhãn có lời kể đọc |
| `python3 channels/tram-nghi-nhieu/tools/check_label_anchors.py <tập>` | nhãn có `anchor`, và chữ nhãn thuộc đúng vật đó |
| `python3 channels/tram-nghi-nhieu/tools/check_props_used.py <tập>` | vật nào trong danh mục chưa hề lên hình |
| `python3 channels/tram-nghi-nhieu/tools/check_delivery.py <tập>` | tập đủ giấy tờ bàn giao chưa |
| `node channels/tram-nghi-nhieu/tools/shadow_who.mjs <tập> --at <giây>` | khối tối giữa khung là bóng của vật nào |
| `.venv/bin/python channels/tram-nghi-nhieu/tools/mix.py <tập>` | nhạc, ambience, foley, master −14 LUFS (cần cổng `render`) |
| `python3 channels/tram-nghi-nhieu/tools/mk_timeline.py <tập>` | timeline từ giọng đọc → `src/timeline.js` |

Mọi lệnh mở trình duyệt chờ một chỗ dựng hình còn trống của máy (`core/render/slot.mjs`, mặc định hai chỗ) và in một
dòng `[slot] waiting…` khi phải chờ. Trên máy này `still.mjs`, `beatsheet.mjs`, `propcheck.mjs` và `build.sh` cần
`LEMO_ANGLE=vulkan` ở đầu lệnh (`review.sh` tự đặt).

## Khi công cụ từ chối

| Công cụ nói | Làm gì |
|---|---|
| `bước trước (<bước>) chưa xong` | Chạy bước đó trước: thứ tự là outline → script → look → props → picture. |
| `một vòng <bước> đang chạy trên tập này` | Chờ vòng đó xong rồi đọc `review/<BƯỚC>.md`. |
| `người chấm không trả lời đủ cho: …` (mã 2) | Không phải phán quyết. Đọc lý do, chạy lại; mục chưa có câu trả lời vẫn chờ chấm. |
| `chưa có COMPONENTS_SPEC.md` | Viết bảng đặc tả của bước 4 rồi chấm `props`. |
| `…/review/hero/ chưa có ảnh` | Dựng khung hình chính vào `review/hero/` (`core/render/still.mjs … --out <tập>/review/hero`). |
| `máy chặn trước khi tốn một vòng chấm: …` | Sửa đúng lỗi máy nêu rồi chạy lại. |
| `cổng chấm: …` (từ `build.sh`, `mix.py`, `tts_vi.py`) | Lý do nêu bước chưa xong; `gate.py status <tập>` cho chi tiết. |
| `COULD NOT RUN (exit 2)` (cổng bàn giao) | Bài kiểm tra không chạy được. Để code đứng yên rồi chạy lại. |

## `fill` và độ phủ

Tờ nhịp in `fill` (vật lớn nhất trong khung) và `phủ` (tổng phần khung vật thật chiếm). Dưới 15 % và khác 0 là khung
có thể gần như trống. Máy không thấy chủ thể ở cảnh cận bên trong một vật lớn, ở chủ thể là một nhóm vật nhỏ, và ở
cảnh toàn: những câu đó đến tay người chấm như gợi ý, không phải lỗi.
