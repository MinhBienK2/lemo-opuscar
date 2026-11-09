---
name: tram-nghi-nhieu
description: Đạo diễn và dựng một tập của kênh Trạm Nghĩ Nhiều — câu hỏi "tại sao" đời thường, trả lời bằng diorama 3D toon (three.js) có ánh sáng thật, viền mực vẽ tay, máy quay đi vào bên trong vật, mọi vật dựng đúng là nó, chỉ thứ vô hình mới thành hình minh hoạ; một giọng kể tiếng Việt. Dùng khi làm bất kỳ tập nào của kênh.
version: 16.0.0
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
- Người chấm có thể sai. Trước khi sửa theo nó, mở ảnh hay đoạn nó nói tới và tự nhìn.

Cổng (`gate.py`) đọc các kết quả đó: giọng đọc cần `outline` và `script` xong; dựng phim cần cả năm bước chấm xong.

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
- **Nhìn nhiều khung bằng tờ sheet**: `node core/render/still.mjs <tập> <mốc…> --out <tập>/out/scratch` rồi
  `python3 core/render/sheet.py <tập>/out/scratch/sheet.jpg <tập>/out/scratch/t_*.jpg --cols 4`. Mở ảnh riêng cho
  khung tờ sheet chỉ ra.
- **Sửa tệp bằng công cụ sửa file** (`Edit` / `Write`, hoặc `python3 tools/replace.py --batch -` cho nhiều sửa dài).
- Trên máy này, `still.mjs`, `beatsheet.mjs` và `build.sh` cần `LEMO_ANGLE=vulkan` ở đầu lệnh (`review.sh` tự đặt).
