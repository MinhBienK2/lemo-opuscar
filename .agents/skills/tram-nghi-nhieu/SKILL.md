---
name: tram-nghi-nhieu
description: Đạo diễn và dựng một tập của kênh Trạm Nghĩ Nhiều — câu hỏi "tại sao" đời thường, trả lời bằng diorama 3D toon (three.js) có ánh sáng thật, viền mực vẽ tay, máy quay đi vào bên trong vật, mọi vật dựng đúng là nó, chỉ thứ vô hình mới thành hình minh hoạ; một giọng kể tiếng Việt. Dùng khi làm bất kỳ tập nào của kênh.
version: 14.0.0
---

# Một tập Trạm Nghĩ Nhiều

Quy trình này thay cho bước 1–6 của `AGENTS.md` / `DIRECTOR.md` khi làm một tập của kênh. Đọc trước:

- `channels/tram-nghi-nhieu/STRATEGY.md`: đề tài, độ dài, giọng kể, luật nội dung.
- `STYLE.md`: luật hình. Luật quan trọng nhất là **thật, nhìn là biết**.
- `rig/README.md`: API của rig.
- `demo/stills/*.jpg`: mở ra xem để biết mức tay nghề (ánh sáng, chất liệu, chiều sâu). Đây không phải nội dung để chép.
- `CRITIC.md`: người chấm sẽ soi đúng những điều trong file này. Tự soi trước theo các nhóm A–G của nó.

Mục tiêu: người xem tắt tiếng vẫn đoán đúng chuyện gì đang xảy ra, và mỗi khung đủ đẹp để làm thumbnail.

Mọi lệnh dưới đây chạy từ gốc thư viện. Trên máy này, mọi lệnh dựng hình (`still.mjs`, `beatsheet.mjs`, `review.sh`, `build.sh`) cần `LEMO_ANGLE=vulkan` ở đầu lệnh.

## 0. Brief: hỏi một lần

Chỉ hỏi khi yêu cầu chưa có chủ đề, hoặc chủ đề quá rộng để ra một câu hỏi "vì sao" cụ thể. Khi đó hỏi một lần, trong một tin nhắn: câu hỏi của tập, và có dữ kiện, tên, hình nào bắt buộc không. Rồi làm tiếp, không hỏi thêm.

**Đừng hỏi người dùng muốn dài bao nhiêu.** Họ không biết câu trả lời cần bao nhiêu kiến thức; bạn biết, sau khi nghiên cứu. Độ dài đi ra từ dàn ý (`STRATEGY.md`, "Độ dài"). Chỉ khi chính người dùng đã nêu một độ dài hay một nền tảng (Shorts…) thì theo đó, thu hẹp câu hỏi cho vừa, và nói với họ nếu câu hỏi cần dài hơn để trả lời đúng.

## 1. Dàn ý, rồi chấm dàn ý

1. `sh core/render/new_episode.sh tram-nghi-nhieu series/<cột>/<tập> "Câu hỏi?"`. Lệnh này tạo `TREATMENT.md` theo mẫu của kênh (`templates/TREATMENT.tmpl.md`).
2. `research/FACTS.md`: nghiên cứu cho tới khi viết được trọn chuỗi nguyên nhân, từ hiện tượng người xem gặp tới cơ chế cuối cùng; mỗi con số kèm nguồn. Ghi tốc độ đọc của giọng kể (chữ mỗi phút) để ước độ dài.
3. `TREATMENT.md`: điền mọi mục của mẫu. Phần chính là **bảng ý → hình**, và luật lập bảng nằm ngay trong mẫu. Lập bảng trước, rồi mới ghi độ dài: số dòng × thời gian mỗi ý cần. Hai luật hay bị quên:
   - mỗi ý chỉ có một dòng;
   - khái niệm phải có hình trước hoặc ngay khi được dùng.
4. `sh channels/tram-nghi-nhieu/review.sh <tập> --outline`. Người chấm dùng `OUTLINE-CRITIC.md` để bắt ý lặp, khái niệm dùng trước khi có hình, ý không dựng được, thiếu mắt xích, và độ dài bị độn hay bị ép. FAIL thì sửa dàn ý theo các dòng `SỬA:` rồi chạy lại.

Chưa có dàn ý PASS thì không chấm được lời.

## 2. Lời, rồi chấm lời, rồi giọng

1. `voice/lines.json`: viết **từ** bảng ý → hình. Mỗi câu thuộc một dòng của bảng, số viết thành chữ. Muốn thêm hay bớt câu thì sửa bảng trước.
2. `sh channels/tram-nghi-nhieu/review.sh <tập> --script` (tập có chương thì thêm `--chapter n`, xem §5). Người chấm dùng `SCRIPT-CRITIC.md`.
   - FAIL thì sửa theo các dòng `VIẾT LẠI:`. Chép đúng câu người chấm đưa, trừ khi câu đó sai dữ kiện: lần chấm sau sẽ giữ những câu đã OK và câu chép nguyên văn.
   - Lỗi lặp ý thì sửa bằng cách bỏ câu đó, không phải viết lại thành một câu lặp khác chữ. Nếu cùng một lỗi cấu trúc còn sau hai lượt, quay lại sửa dàn ý.
3. Giọng: `$LIB/.venv/bin/python channels/tram-nghi-nhieu/voice/tts_vi.py <tập>/voice/lines.json <tập>/voice/ [--jobs 6]`, rồi `asr_vi.py`, `process.py`, `mk_timeline.py` (lệnh có trong `build.sh` của tập). `tts_vi.py` từ chối chạy khi lời chưa PASS.

## 3. Dựng hình: làm như phim mẫu đã làm

Thứ tự này là lý do phim mẫu đẹp. Đừng đảo.

1. **Trang.** `index.html` của scaffold đã có importmap của three. Viết `src/film.js` gồm `film()` và `loadVoice(build)` (giờ của từng câu, phụ đề, sự kiện giọng), rồi đặt `window.render/DUR/EV/TEXTS/READY`.
2. **Vật trước cảnh.** Mọi vật có thật sẽ lên hình nằm trong `src/props.js`: `export const PROPS = { 'tên như lời gọi, kèm trạng thái': () => THREE.Object3D }`. Vật nào lời kể gọi tên hay thẻ chữ chỉ vào đều phải có ở đây, kể cả bộ phận bên trong máy. Ruột máy dùng `rig/parts.js` (lò xo, chip, bảng mạch, pin, bánh răng…), không dùng khối trụ hay hộp. Chạy `review.sh <tập> --props`: một phiên không biết tên sẽ gọi tên từng vật. Vật bị gọi sai là vật thay thế: sửa theo `SỬA:` rồi chạy lại cho tới PASS. Vật thêm sau cũng phải chạy lại bước này. Vật tốt mà dùng lại được thì đưa vào `rig/props.js`.
3. **Bối cảnh của khung hero 1, chưa có chuyển động.** Bối cảnh là nơi lời nói tới, không phải nơi có sẵn.
   - Nơi đó là `kitchen`, `desk` hay `bathroom` của `rig/sets.js` (xem `demo/stills/set_*.jpg`): bắt đầu từ bộ đó, đặt vật chính ở `S.focus`, lấy góc máy từ `S.cams`, chọn `time` khớp lời.
   - Nơi khác thì tự dựng, và phải có đủ những thứ sau:
     - tường có lỗ (`wallWithHole`) để đèn chính in bóng;
     - `canvasTex` có seed cho mỗi bề mặt lớn;
     - đồ mềm nặn bằng `cushionGeo` hay `surface`;
     - đồ đạc đủ dày;
     - một vật sống: rèm lay, lá lay, LED thở hay hơi nước.
4. **Vòng still.** Chạy `node core/render/still.mjs <tập> <t…> --out <scratch>`, rồi **mở ảnh ra xem**. Mỗi vòng ghi vào `LOOK.md`: thấy gì, vì sao, sửa gì. Mỗi khung hero ít nhất 3 vòng trước khi làm chuyển động. Chẩn đoán bằng cờ, đừng đoán:
   - bóng lạ: `?lightcam=1`, `?nocast=<tag>`;
   - cháy trắng: giảm đèn điểm, chỉ `glowMat` k > 1 được loé;
   - vật đọc sai hình: đổi trục máy trước khi đổi vật.
5. **Cơ chế** (khung hero 2), dựng thành vật thể có tham số (`speedTable`, `sparks`, `squiggle`, `flow()`, `rig/cutaway.js`):
   - **Vật bị cắt là chính vật nguyên.** Dựng nguyên trong `src/props.js`, qua `--props`, rồi cắt bằng `section(vật, { normal, at })`. Cảnh mở: vật nguyên trước, rồi cùng góc máy chuyển sang bản cắt. Không dựng tay một "bản cắt" riêng.
   - Bên trong vật: `tissue()` của `rig/inside.js` theo tiết diện của chính vật, vật nguyên đặt cạnh trong cùng bối cảnh (như `demo/stills/cutaway_*.jpg`). Không đưa máy vào một khoảng không chỉ có hạt.
   - Thứ vô hình: dùng `flow()`, thành một vật liền, đủ to, mọc từ vật nguồn, **chạm** vật nhận, và gây thay đổi thấy được ngay. Không dùng `glowDots`, không vòng tròn đồng tâm, mũi tên hay công thức.
   - Phải có một sự kiện nhân quả lớn trên màn hình (tác động → thay đổi trong 1–2 s). Tắt nhãn đi mà vẫn hiểu thì mới đạt.
6. **Chuyển động và máy quay.**
   - Keyframe bằng `keys()`, đặt mốc theo **chữ** bằng `V.w(id, 'từ')`: vật hiện đúng lúc được nói, cơ chế không chạy trước lời về nguyên nhân của nó.
   - Có lấy đà, vượt đà (`back`) và chuyển động phụ.
   - Máy chỉ đi khi có lý do. Chuyển cảnh bằng `flash` màu cảnh sau hoặc đi xuyên vật.
7. **Chữ.**
   - `label()` cho thuật ngữ, tối đa một thẻ một lúc, mũi thẻ chạm đúng vật.
   - Từ khoá của câu trả lời có thẻ ngay lần đầu được nói, chữ giống hệt trong lời. Mỗi sự thật chỉ một thẻ.
   - `subtitle()` cho phụ đề. Khai báo tất cả trong `TEXTS`.
8. **Vòng beat.** Chạy `node channels/tram-nghi-nhieu/beatsheet.mjs <tập> --out <scratch> [--lines a-b]`, rồi **mở từng tờ**. Với mỗi câu, hỏi: không nghe thì khung có cho thấy điều câu nói không?
   - Sửa hết các cờ máy:
     - `DARK`: đưa đèn chính hay `pool` vào vật chính;
     - `SAME`: câu chưa có hình riêng; máy trôi hay hạt bay không tính;
     - `NUM`: thêm đồng hồ, lịch hay thẻ số;
     - `RUN`: sang nơi khác, cắt vào trong, so hai bên, hay lùi ra khung rộng.
   - Bạn không bác được cờ. Chỉ người chấm bác được (`CỜ SAI`), khi nhìn ảnh thấy cờ sai.
9. **Tiếng.** `window.EV` gồm sự kiện giọng (`V.ev`), nhạc, ambience, và foley ở đúng chỗ có vật làm ra tiếng (định dạng ở `rig/README.md` § voice.js).

Muốn thêm một bộ phận dùng lại được (bối cảnh, đạo cụ, hiệu ứng) thì đưa vào `channels/tram-nghi-nhieu/rig/` và ghi một dòng vào `rig/README.md`. Không sửa `render.js` cho riêng một tập.

## 4. Chấm hình: một phiên khác chấm, theo từng cảnh

Điểm tự chấm không đáng tin: người làm biết mình định vẽ gì, nên nhìn ra điều đó cả khi nó không có trên hình. `review.sh` mở một phiên model mới:

- Mặc định là `omp -p` với model mặc định của omp, nên đó có thể là một model khác bạn. Chọn khác bằng `LEMO_CRITIC_CLI=omp|claude` và `LEMO_CRITIC_MODEL`.
- Phiên này chạy trong một thư mục ngoài repo, chỉ có khung hình, lời và `FACTS.md`, và chấm theo `CRITIC.md`.
- Tên người chấm được ký dưới mỗi bản chấm.

```
review.sh <tập> --lines 4-7          # một cảnh vừa dựng (3–4 câu)
review.sh <tập>                      # cả phim, trước khi render (tập không chia chương)
review.sh <tập> --chapter n          # một chương, trước khi render (tập dài, §5)
review.sh <tập> --video [--chapter n]  # sau khi render: bốn khung mỗi câu từ mp4
```

1. Dựng xong một cảnh thì chấm cảnh đó trước khi dựng cảnh sau. FAIL thì sửa đúng các câu FAIL theo dòng `SỬA:` rồi chạy lại. Không cãi người chấm.
2. Đủ cảnh thì chấm cả phim (hay từng chương). PASS cần OVERALL ≥ 9 và không câu nào FAIL. Chỉ khi đó mới làm tiếng và render 24 fps. Render là việc chậm nhất, chỉ làm một lần.
3. Render xong, chạy `--video` một lần để bắt chuyển động không diễn ra và lỗi chỉ có ở bản render.
4. **Cổng máy.** Các lần PASS ghi con dấu vào `review/*.pass`: dàn ý, lời, vật, hình (cả phim hay từng chương). Mỗi con dấu là mã băm của thứ được chấm và của bản chấm.
   - `tts_vi.py` cần dàn ý và lời. `mix.py` và `core/render/video.mjs` cần tất cả.
   - Sửa gì sau khi PASS thì phải chấm lại.
   - Không viết tay con dấu hay bản chấm, không gọi `gate.py stamp`, không sửa các file `*REVIEW*.md`. Làm vậy là gian lận, và tập đó coi như chưa chấm.

## 5. Tập dài: chia chương

- Khi dàn ý ra cỡ tám phút trở lên, chia chương trong `TREATMENT.md` (mục Chương): mỗi chương là một tầng của câu trả lời, ở một nơi chính. Số chương theo số tầng, không theo một con số định trước.
- Ghi chương vào `src/chapters.js`: `{ id: 'ch1', lines: ['c1', 'c19'], files: ['set_desk.js'], build }`. Các chương phải phủ mọi câu, liên tục.
  - Chương sở hữu `src/<id>.js` và các file trong `files`.
  - File không thuộc chương nào là file chung. Sửa file chung thì phải chấm lại mọi chương.
- Lời: chấm từng chương, `review.sh <tập> --script --chapter n`. Người chấm vẫn đọc cả lời để bắt ý lặp giữa các chương.
- Giọng: `tts_vi.py … --jobs 6`.
- Hình: dựng và chấm xong chương này rồi mới sang chương sau, `review.sh <tập> --chapter n`. Cổng mở khi mọi chương PASS.
- Có thể giao từng chương cho một subagent, mỗi subagent làm trọn một chương (props, cảnh, chấm). Không có file giữ chỗ: file nào trong `src/` còn chữ `placeholder` hay `giữ chỗ` thì không chấm được và không render được.
- Render tập dài mất nhiều giờ: chạy nền và làm việc khác trong lúc chờ (`DIRECTOR.md`). Không thăm dò bằng `sleep`.

## 6. Khi nào dừng, và bàn giao

Mỗi vòng chấm có số lượt, và `review.sh` tự dừng khi hết:

| Vòng chấm | Số lượt |
|---|---|
| Dàn ý | 4 |
| Lời (cả bài, hay mỗi chương) | 6 |
| Cảnh | 3 |
| Chương hay cả phim | 5 |

Luật dừng duy nhất:

- **Còn lượt mà FAIL:** sửa theo bản chấm rồi chấm lại. Không dừng, không bàn giao, không hỏi người dùng.
- **Một cảnh hết lượt:** ghi vào `LOOK.md` câu nào còn FAIL và vì sao, rồi sang cảnh sau. Lần chấm chương hay cả phim sẽ bắt lại cảnh đó.
- **Dàn ý, lời, chương hay cả phim hết lượt:** dừng. Báo người dùng điểm và các lỗi còn lại, và hỏi hướng đi: thu hẹp câu hỏi, bỏ bớt một tầng, hay chấp nhận. Không gọi đó là phim đạt.

Bàn giao khi mọi con dấu còn đúng và `sh core/render/review.sh <tập>` exit 0. Báo người dùng:

- đường dẫn phim;
- 3 khung hero;
- tờ beat;
- `review/REVIEW.md` cuối cùng, nguyên văn;
- các điểm yếu còn lại, nói thật.

Quy tắc vận hành: sửa file bằng công cụ sửa file, không dùng heredoc của shell (`CODING_STANDARDS.md` R1). Xoá still thử và `out/` cũ khi xong, vì ổ đĩa gần đầy.
