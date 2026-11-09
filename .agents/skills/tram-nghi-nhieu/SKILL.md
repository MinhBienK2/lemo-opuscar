---
name: tram-nghi-nhieu
description: Đạo diễn và dựng một tập của kênh Trạm Nghĩ Nhiều — câu hỏi "tại sao" đời thường, trả lời bằng diorama 3D toon (three.js) có ánh sáng thật, viền mực vẽ tay, máy quay đi vào bên trong vật, mọi vật dựng đúng là nó, chỉ thứ vô hình mới thành hình minh hoạ; một giọng kể tiếng Việt. Dùng khi làm bất kỳ tập nào của kênh.
version: 17.0.0
---

# Một tập Trạm Nghĩ Nhiều

Quy trình này thay cho bước 1–6 của `AGENTS.md` / `DIRECTOR.md` khi làm một tập của kênh. Mọi lệnh chạy từ gốc thư
viện. Lệnh của từng công cụ, và việc cần làm khi một công cụ từ chối: `channels/tram-nghi-nhieu/tools/README.md`.

**Tập đang dở** (thư mục tập đã có): hỏi cổng trước khi làm gì khác —
`python3 channels/tram-nghi-nhieu/tools/gate.py status <tập>` in từng bước: xong hay chưa, mục nào đạt, mục nào phải sửa.

## Các bước

Làm đến bước nào thì chỉ mở `GUIDE.md` của bước đó.

| Bước | Làm gì | Hướng dẫn | Chấm (`review.sh <tập> <bước>`) |
|---|---|---|---|
| 1 | `research/FACTS.md`, `TREATMENT.md` (bảng Ý → Hình) | `step1-outline/GUIDE.md` | `outline` |
| 2 | `voice/lines.json`, rồi giọng đọc và `src/timeline.js` | `step2-script/GUIDE.md` | `script` |
| 3 | góc máy, ánh sáng, khung hình chính trong `review/hero/`, `LOOK.md` | `step3-storyboard/GUIDE.md` | `look` |
| 4 | `COMPONENTS_SPEC.md`: mọi vật, bộ phận, bối cảnh, đèn | `step4-component-breakdown/GUIDE.md` | — (bước 5 đọc nó) |
| 5 | mỗi vật một tệp `src/props/<mã>.js` | `step5-props-code/GUIDE.md` | `props` |
| 6 | `src/film.js`: cảnh, diễn hoạt, nhãn, tờ nhịp | `step6-assembly/GUIDE.md` | `picture` |
| 7 | âm thanh, dựng phim, cổng bàn giao | `step7-delivery/GUIDE.md` | `final` (chỉ báo cáo) |

`sh channels/tram-nghi-nhieu/tools/review.sh <tập> <bước>` chạy ở chế độ nền của harness (`run_in_background`), rồi
đọc kết quả một lần khi harness báo xong.

## Chấm theo từng mục

Mỗi bước có `RUBRIC.md`: một bảng câu hỏi, mỗi câu là **CHẶN** hoặc **GÓP Ý**. Người chấm (một phiên `claude -p` mới)
trả lời từng mục: dàn ý, từng câu lời, từng khung hình chính, từng vật, hình của từng câu. Mỗi câu trả lời phải kèm
điều nó thấy.

- Một mục **ĐẠT** khi mọi câu CHẶN đều ĐẠT. GÓP Ý không bao giờ chặn: đọc, sửa nếu đáng, rồi đi tiếp.
- Một mục **phải sửa** thì `review/<BƯỚC>.md` ghi nó sai ở câu nào, người chấm thấy gì, và cách sửa. Sửa đúng mục đó
  rồi chạy lại bước đó. Chỉ những mục mới hay vừa đổi mới được chấm lại; mục đã ĐẠT giữ nguyên.
- Muốn chấm lại một mục chưa đổi: `--again <mã>,<mã>` (hoặc `--again all`).
- Một mục sai ba lần thì thành **MỞ**: bước đóng và đi tiếp, mục đó nằm trong báo cáo cho người dùng.

Cổng (`gate.py`) đọc các kết quả đó: giọng đọc cần `outline` và `script` xong; dựng phim cần cả năm bước chấm xong.

## Sửa sau vòng chấm

Người chấm chỉ chấm; người sửa là một subagent khác; vòng chấm sau là một người chấm mới. Ba vai tách nhau thì lời
chấm vẫn độc lập: không ai chấm chính bản sửa của mình.

- **`outline`, `script`**: lỗi nằm trong chữ, và `review/<BƯỚC>.md` có sẵn câu viết lại. Bạn tự sửa.
- **`look`, `props`, `picture`**: `python3 channels/tram-nghi-nhieu/tools/fixbrief.py <tập> <bước>` in bản giao việc
  cho các mục phải sửa: người chấm thấy gì, các câu phải ĐẠT, tệp được sửa, lệnh dựng lại để nhìn, mẫu trả lời. Mỗi
  bản là trọn prompt của một subagent sửa (Agent tool):
  - `props`, mỗi vật một tệp: mỗi bản (`=== BRIEF <mã> ===`) một subagent, chạy song song.
  - `look`, `picture`: các mục chung mã của tập, nên một bản (tối đa tám mục) một subagent, chạy lần lượt. Dòng
    `=== CÒN …` cuối bản là lệnh in bản kế tiếp.
- Subagent trả về mỗi mục một dòng chữ. Bạn đọc các dòng đó, còn ảnh để người sửa nhìn:
  - `ĐÃ SỬA` → chạy lại vòng chấm của bước;
  - `NGƯỜI CHẤM SAI` → vòng sau `--again <mã>`, kèm điều người sửa thấy;
  - `CHƯA SỬA ĐƯỢC` vì lỗi ở bước trước (một vật, một câu lời) → sửa ở bước đó.

## Xong (DONE)

Tập **xong** khi có tệp mp4 đầu tiên và `sh core/render/review.sh <tập>` thoát mã 0. Khi đó báo người dùng ngay:
đường dẫn phim, thời lượng, các mục MỞ. Sau đó chạy `review.sh <tập> final` một lần: đó là báo cáo chất lượng cho
tập sau, không mở lại bước nào. Đưa tóm tắt của nó cho người dùng rồi dừng.

`COULD NOT RUN` (mã 2) không phải phán quyết về phim: đọc lý do, sửa nguyên nhân, chạy lại.

## Cách làm việc

- **Dựng hình xếp hàng.** Mọi lệnh mở trình duyệt (`still.mjs`, `beatsheet.mjs`, `propcheck.mjs`, `video.mjs`) chờ một
  chỗ trống của máy (mặc định hai chỗ cho cả máy) và in một dòng khi phải chờ. Cứ để nó chờ.
- **Mọi thứ thử để trong `<tập>/out/scratch/`**: ảnh khung lẻ, tờ sheet, ảnh vật, bản đo rig. Tệp nào cũng có chỗ
  cố định (cây thư mục: `CHANNEL.md`, "Một tập"); `gate.py status` và mỗi vòng chấm in thứ nằm sai chỗ.
- **Ngữ cảnh của bạn nhỏ thì phim rẻ.** Mỗi lượt đọc lại cả ngữ cảnh, nên một ảnh hay một log mở trong phiên của bạn
  được trả tiền lại ở mọi lượt sau. Bạn nhìn hình qua tờ sheet (nhiều khung trong một ảnh):
  `node core/render/still.mjs <tập> <mốc…> --out <tập>/out/scratch` rồi
  `python3 core/render/sheet.py <tập>/out/scratch/sheet.jpg <tập>/out/scratch/t_*.jpg --cols 4`. Ảnh lẻ thì người sửa
  và người chấm mở. Log dài thì grep đúng dòng cần.
- **Công cụ đứng yên suốt một tập.** `core/`, `rig/` và `channels/tram-nghi-nhieu/tools/` giữ nguyên khi đang làm
  tập: sửa chúng giữa chừng làm mọi phép đo trước đó thành cũ. Một công cụ sai thì đi vòng qua nó, và ghi lỗi cùng
  cách đi vòng vào báo cáo cuối cho người dùng.
- **Hai tập cùng lúc.** Khi một tập khác đang chạy, `rig/` và `core/` của kênh là của cả hai: đừng sửa chúng, và
  đừng kỳ vọng bản dựng của mình giữ nguyên giữa chừng. Chỗ trống dựng hình của máy là chung
  (`RENDER_SLOTS`, mặc định 2): hai tập cùng dựng sẽ xếp hàng, đó là bình thường.
- **Một chặng một phiên.** `python3 channels/tram-nghi-nhieu/tools/episode.py <tập> ["Câu hỏi?"]` làm cả tập, mỗi
  chặng (bước 1, 2, 3, 4–5, 6, 7) trong một phiên `claude -p` mới, và ghi chi phí từng phiên vào
  `out/sessions.jsonl`. Phiên được giao một chặng thì làm chặng đó tới khi cổng báo xong, rồi dừng.
- **Sửa tệp bằng công cụ sửa file** (`Edit` / `Write`, hoặc `python3 tools/replace.py --batch -` cho nhiều sửa dài).
- Trên máy này, `still.mjs`, `beatsheet.mjs` và `build.sh` cần `LEMO_ANGLE=vulkan` ở đầu lệnh (`review.sh` tự đặt).
