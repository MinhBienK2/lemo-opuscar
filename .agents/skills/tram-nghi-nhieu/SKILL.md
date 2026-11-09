---
name: tram-nghi-nhieu
description: Đạo diễn và dựng một tập của kênh Trạm Nghĩ Nhiều — câu hỏi "tại sao" đời thường, trả lời bằng diorama 3D toon (three.js) có ánh sáng thật, viền mực vẽ tay, máy quay đi vào bên trong vật, mọi vật dựng đúng là nó, chỉ thứ vô hình mới thành hình minh hoạ; một giọng kể tiếng Việt. Dùng khi làm bất kỳ tập nào của kênh.
version: 14.2.0
---

# Một tập Trạm Nghĩ Nhiều: Quy trình Đạo diễn & Phản biện Độc lập Phân tầng

Quy trình này thay cho bước 1–6 của `AGENTS.md` / `DIRECTOR.md` khi làm một tập của kênh.

## Nguyên tắc Vận hành Cốt lõi
1. **Không nạp dồn toàn bộ ban đầu (Lazy Loading Skills):**
   - Đạo diễn làm đến bước nào thì **chỉ mở đúng tài liệu `GUIDE.md` và `PROMPT_CRITIC.md` của bước đó**.
   - Tuyệt đối không đọc trước hay ôm đồm tài liệu của các bước sau.
2. **Cơ chế Đạo diễn & Subagent Reviewer Độc lập:**
   - Ở mỗi bước, sau khi Đạo diễn hoàn thành bản thảo/code, **bắt buộc dùng file `PROMPT_CRITIC.md` của bước đó** để kích hoạt một Subagent thẩm định độc lập khách quan.
3. **Vòng lặp Phản biện Tối đa 5 Hiệp (Max 5 Rounds Debate Loop):**
   - **Subagent Thẩm định:** Xuất báo cáo theo định dạng chuẩn (`PASS` / `REJECT`), kèm danh sách lỗi cụ thể.
   - **Đạo diễn Tiếp nhận & Phản biện (Bắt buộc):** Đạo diễn phân tích:
     - Điểm nào Subagent chỉ ra ĐÚNG: Đạo diễn tiếp thu và sửa trực tiếp vào sản phẩm.
     - Điểm nào Subagent hiểu sai về mặt kỹ thuật Three.js / giới hạn WebGL / mâu thuẫn với `STYLE.md`: Đạo diễn viết luận điểm phản biện rõ ràng để bảo vệ tính khả thi.
   - **Hiệu chỉnh & Đánh giá lại:** Lặp lại tối đa 5 hiệp cho tới khi đạt `PASS` (hoặc sau vòng 5 Đạo diễn dùng quyền tối hậu Director's Cut để chốt phương án an toàn nhất và chuyển bước).

4. **Nhìn nhiều khung hình bằng sheet, không bằng từng ảnh.**
   - Một tập có 60 nhát. Đọc 60 ảnh một-lẻ là hơn 250 MB ảnh và hàng trăm nghìn token, và con mắt không so sánh được hai khung cạnh nhau.
   - Dựng sheet rồi nhìn sheet:
     `python3 core/render/sheet.py <scratch>/sheet.jpg <scratch>/t_*.jpg --cols 4`
     (`node core/render/still.mjs <tập> <mốc1> <mốc2> …` dựng được nhiều khung trong một lệnh.)
   - Chỉ mở ảnh riêng khi sheet đã chỉ ra khung nào cần soi kỹ.
   - Đừng tự viết montage bằng `ffmpeg`: `core/render/sheet.py` xếp khung, đặt tên từng khung và không vỡ khi
     một khung thiếu. Một montage tự viết là cùng một việc làm lại, tệ hơn.

5. **Sửa file bằng công cụ sửa file.**
   - Dùng `edit` / `write`. Khi đoạn thay quá dài để khớp chính xác, dùng
     `python3 tools/replace.py <file> <đoạn cũ> <đoạn mới>`: nó đếm số lần khớp, không khớp đúng một lần
     thì không ghi gì cả, và nó ghi nguyên tệp mới đè lên tệp cũ — tệp cũ không bao giờ bị nửa vời.
   - Một tệp lớn cần **nhiều** sửa nhỏ (LOOK.md, `src/film.js`): đặt các sửa vào một tệp JSON
     (`[{"old": "...", "new": "..."}]`) rồi chạy `python3 tools/replace.py <file> --batch <edits.json>`.
     Mọi sửa phải khớp đúng số lần nêu trong nó, nếu không thì **không sửa gì cả**. Đừng tự viết script
     python để sửa tệp của tập: script tự viết là đúng cái R1 cấm, và nó không để lại dấu vết đã sửa gì.
   - Một lệnh cho mọi sửa, không cần tệp JSON trên đĩa: `python3 tools/replace.py --batch - <<'JSON'`
     với danh sách `[{"file": "src/film.js", "old": "...", "new": "..."}, {"file": "src/props.js", ...}]`.
     Mỗi sửa tự nêu tệp của nó, công cụ kiểm tra **mọi** tệp trước khi ghi tệp nào, và mọi tệp đều được
     ghi nguyên tệp mới đè lên tệp cũ. Đây là cách sửa nhiều tệp trong một lần, an toàn bằng công cụ —
     không phải viết một chương trình python riêng để làm thay.
   - Heredoc của shell (`cat >> file <<EOF`) đã làm hỏng chữ tiếng Việt trong một tài liệu của phiên trước:
     shell ghi UTF-8 hỏng, không ai thấy ngay, và phải sửa lại bằng một lần ghi shell nữa.

6. **Chờ việc xong, đừng dò file.**
   - Một việc dài (dựng khung, chấm hình, render) thì chạy nền; harness báo khi nó xong, đọc output của nó một lần.
   - `until [ -f file ]; do sleep 15; done` là một vòng dò: nó ăn hết lượt của bạn và không quyết định gì.
   - Cùng một lệnh lặp năm lần trở lên, dù nó đang nhìn cái gì, là một vòng dò.

7. **Một vòng chấm, một người chấm.**
   - `review.sh` là công cụ của cả kênh: nó đọc mẫu, đánh số vòng, ký tên người chấm và đóng tem. Đừng tự làm lại
     bất kỳ phần nào của nó — kể cả khi nó chạy lâu và bạn muốn xem kết quả sớm.
   - Người chấm **chỉ in câu trả lời khi đã xong**. Suốt thời gian nó nghĩ, file output của nó gần như rỗng —
     đó là bình thường, không phải nó chết. Đừng mở file output đó để "kiểm tra xem còn sống không": đó là một
     vòng dò, và nó khiến bạn mở người chấm thứ hai.
   - Hai dòng cảnh báo của CLI (`connectors are disabled`, `unrecognized_model`) là **cảnh báo, không phải
     lỗi**: mô hình vẫn chạy và vẫn trả lời. Đừng đổi `LEMO_CRITIC_MODEL` để làm chúng im đi.
   - Vòng chấm kéo dài hàng chục phút: chạy nó ở chế độ nền và để harness báo khi nó xong, rồi đọc bản chấm nó
     ghi vào `review/`.
   - Một tập, một vòng chấm cho mỗi phần. `review.sh` giữ chốt: nếu nó nói còn một vòng đang chạy trên tập
     này, hãy chờ — mở vòng thứ hai là hai bản chấm đè lên nhau, hai vòng bị tính, và ngân sách bị tiêu hai lần.

8. **Hết lượt thì chốt bằng bản cắt của đạo diễn, đúng hình dạng.**
   - Một bước có ngân sách vòng (xem `channels/tram-nghi-nhieu/tools/README.md`) sẽ nói bằng chữ khi hết
     lượt. Khi đó **đừng mở vòng thứ sáu**: ba lối ra là `--lines a-b` cho đúng câu vừa sửa, chia chương rồi
     chấm từng chương, hoặc **bản cắt của đạo diễn**.
   - Bản cắt là một tệp trong `review/` (`PROPS-DIRECTORS-CUT.md`, `STORYBOARD-DIRECTORS-CUT.md`,
     `ASSET-AUDIT-DIRECTORS-CUT.md`, `REVIEW-DIRECTORS-CUT.md`), nêu rõ cái gì đã cắt, và **kết thúc bằng
     dòng `VERDICT: PASS`** — không có dòng đó thì cổng không đọc được và vòng chấm mất.
   - Bản cắt phải **viết sau lần sửa code cuối cùng**: cổng so mốc và từ chối một bản cắt cũ, vì bản cắt
     viết trước lần sửa đó không nói gì về code hiện tại.

Mọi lệnh dưới đây chạy từ gốc thư viện. Trên máy này, mọi lệnh dựng hình (`still.mjs`, `beatsheet.mjs`, `review.sh`, `build.sh`) cần `LEMO_ANGLE=vulkan` ở đầu lệnh.

**Công cụ của kênh: đọc `channels/tram-nghi-nhieu/tools/README.md` (ở gốc thư viện) trước khi đọc mã nguồn của chúng.** Nó có lệnh của từng công cụ, thứ tự các bước, ngân sách vòng chấm, hợp đồng của đạo diễn cắt, và bảng "khi công cụ từ chối thì làm gì". Một phiên đã đọc `review.sh` 85 lần và mất 350 nghìn token ngữ cảnh chỉ để biết những thứ đó.

**Tập đang dở.** Một tập mất hơn một ngày, nên phiên mở tập thường không phải phiên làm xong tập. Khi thư mục
tập đã có, hỏi cổng trước khi làm bất cứ việc gì:
`python3 channels/tram-nghi-nhieu/tools/gate.py status <tập>` in ra từng tem (còn hiệu lực, hết hiệu lực,
chưa có), phán quyết của vòng chấm gần nhất, và phim đã có hay chưa.

Trước khi dựng, đọc `improvements/lessons.md` ở gốc thư viện — mỗi dòng là một lỗi một phiên đã mắc, và cách chặn nó. Skill này không biết những lỗi đó; file đó thì biết.

---

## Sơ đồ 7 Bước và Ánh xạ Prompt trong Skill

| Bước | Tên Giai Đoạn | Hướng dẫn Đạo diễn | Prompt Subagent Review |
|---|---|---|---|
| **Bước 1** | Dàn ý khoa học & Nghiên cứu | `step1-outline/GUIDE.md` | `step1-outline/PROMPT_CRITIC.md` |
| **Bước 2** | Kịch bản lời thoại & Timing | `step2-script/GUIDE.md` | `step2-script/PROMPT_CRITIC.md` |
| **Bước 3** | Storyboard & Khung hình Hero | `step3-storyboard/GUIDE.md` | `step3-storyboard/PROMPT_CRITIC.md` |
| **Bước 4** | Bóc tách Linh kiện 3D chi tiết | `step4-component-breakdown/GUIDE.md` | `step4-component-breakdown/PROMPT_CRITIC.md` |
| **Bước 5** | Code Linh kiện 3D Độc lập | `step5-props-code/GUIDE.md` | `step5-props-code/PROMPT_CRITIC.md` |
| **Bước 6** | Lắp ghép Cảnh & Diễn hoạt | `step6-assembly/GUIDE.md` | `step6-assembly/PROMPT_CRITIC.md` |
| **Bước 7** | Âm thanh & Nghiệm thu Bàn giao | `step7-delivery/GUIDE.md` | `step7-delivery/PROMPT_CRITIC.md` |

---

## Hướng dẫn Chi tiết Thực thi theo từng Bước

### Bước 1: Dàn ý khoa học & Nghiên cứu (Treatment & Facts)
- **Đạo diễn thực hiện:** Đọc `step1-outline/GUIDE.md`. Viết `research/FACTS.md` và `TREATMENT.md` (lập bảng Ý → Hình).
- **File nghiên cứu phải được viết, không phải copy khuôn:** cổng dàn ý chạy `tools/check_research.py` **trước khi tốn một vòng
  chấm** — file còn dòng mẫu, chưa có mốc nào, hoặc chưa có nguồn nào thì dừng ngay. Mỗi mốc cần một **nguồn sơ cấp**
  (sách chuyên ngành, bài báo bình duyệt, đặc tả, datasheet, sổ tay cơ quan chuẩn); **Wikipedia là dẫn chiếu, không phải
  nguồn**: một mốc mà nguồn duy nhất là Wikipedia thì cổng dừng.
- **Review độc lập:** chạy `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --outline`. Công cụ nạp mẫu `step1-outline/PROMPT_CRITIC.md`, đánh số vòng, ký tên người chấm và đóng tem `review/OUTLINE.pass`. **Không** gọi subagent trần: báo cáo của nó không ai đọc, không ai đếm vòng.
- **Vòng lặp:** Đạo diễn sửa lỗi lặp ý / thiếu mắt xích hoặc phản biện. Đạt `PASS` mới sang Bước 2.

### Bước 2: Kịch bản lời thoại (Script & Lines)
- **Đạo diễn thực hiện:** Đọc `step2-script/GUIDE.md`. Viết `voice/lines.json` khớp 1:1 với dàn ý, số viết thành chữ.
- **Lời kể không được nói câu mà `FACTS.md` cấm:** file nghiên cứu có những câu kiểu *"không nói 'chỗ nóng nhất
  trong máy'"* — đó là những xếp hạng mà nguồn không đứng sau. Cổng lời kể chạy `tools/check_voice_facts.py`:
  nó đọc các cụm bị cấm và so với lời kể (sau khi bình thường hoá, nên *"chỗ nóng nhất trong cả cái máy"*
  khớp với *"chỗ nóng nhất trong máy"*). Viết `FACTS.md` thì viết rõ cái phim **không** được nói — rồi đừng nói.
- **Dàn ý phải khớp với lời kể:** `TREATMENT.md` là cái cổng dàn ý chấm. Sửa lời kể mà để nguyên dàn ý cũ
  thì cổng trả tập về vì một tài liệu lỗi thời trong khi phim đã đúng.
- **Sửa lời kể xong thì sửa cả hai bản dàn ý.** `TREATMENT.md` *và* `LOOK.md` đều trích lời kể. Sửa lời
  kể mà không sửa chúng thì hai tài liệu đó mô tả một phim không còn tồn tại — và chúng trông vẫn
  đúng, nên không ai tự thấy.
- **Review độc lập:** chạy `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --script` (nạp mẫu `step2-script/PROMPT_CRITIC.md`, bắt lỗi cờ `DIGIT`, `LONG`, `NOFACTS`, đóng tem `review/SCRIPT.pass`).
- **Vòng lặp:** Đạo diễn hiệu chỉnh câu văn hoặc phản biện từ ngữ chuyên môn. Sau khi `PASS`, chạy `tts_vi.py` sinh `src/timeline.js`.

### Bước 3: Storyboard & Khung hình Hero (Visual Framing & Camera)
- **Đạo diễn thực hiện:** Đọc `step3-storyboard/GUIDE.md`. Xác định góc máy, vùng nhìn frustum, ánh sáng qua tường có lỗ `wallWithHole`. Xuất still tham chiếu và ghi `LOOK.md`.
- **Review độc lập:** chạy `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --storyboard` (nạp mẫu `step3-storyboard/PROMPT_CRITIC.md`, thẩm định độ tương phản và góc đặt ống kính, đóng tem `review/STORYBOARD.pass`).
- **Nhãn nằm đúng câu:** mỗi nhãn trong `src/film.js` gắn với câu lời kể gọi tên nó. `review.sh --storyboard` kiểm
  bằng máy (`tools/check_labels.py`) và dừng trước khi tốn một vòng chấm nếu có nhãn lệch câu.
- **Dàn ý hình phải khớp lời kể:** `LOOK.md` trích nguyên văn từng câu lời kể trong dấu nháy. Khi lời kể
  được viết lại, dàn ý phải theo. Cổng dàn ý chạy `tools/check_storyboard.py`: nó bắt một trích dẫn mà
  **không câu nào trong `voice/lines.json` nói** (dàn ý mô tả phim cũ), một trích dẫn dán nhầm dòng, và
  một trích dẫn chứa cụm mà `FACTS.md` cấm. Nhắc trước câu kế tiếp thì được phép — đó là cách viết dàn
  ý hợp lệ, không phải lỗi.
- **Mỗi câu một nhát, đúng thứ tự của lời:** `tools/check_shots.py` kiểm tra rằng mỗi câu lời kể có đúng một
  nhát hình, mỗi nhát gọi đúng câu, và các nhát không lùi về sau. Một câu không có hình nghĩa là người xem
  nhìn một khung đứng yên trong lúc người kể vẫn nói.
- **Vòng lặp:** Điều chỉnh góc máy, tiêu cự cho tới khi `PASS`.

### Bước 4: Bóc tách Linh kiện 3D chi tiết (3D Component Breakdown & Spec)
*(Bắt buộc nằm sau Storyboard để bám sát góc nhìn camera thực tế)*
- **Đạo diễn thực hiện:** Đọc `step4-component-breakdown/GUIDE.md`. Viết tài liệu đặc tả `COMPONENTS_SPEC.md` bóc tách từng chi tiết nhỏ: Đạo cụ (Props), Ruột máy (Internal parts), Bối cảnh (Sets), Đèn & FX.
- **Review độc lập:** chạy `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --assets`. Cổng này đọc `COMPONENTS_SPEC.md`, `LOOK.md`, `voice/lines.json` và `src/*.js`, rồi đóng tem `ASSET.pass` khi bản đặc tả khớp mã. **Không** dùng subagent trần: báo cáo của nó rơi vào một tệp không ai đọc, không ai đếm vòng, không ai ký — năm vòng soi tài liệu của tập 01 đã thành 24 kB mà không ai mở.
- **Vòng lặp:** Bổ sung dứt điểm mọi linh kiện thiếu trước khi code. Hết 5 vòng thì chốt bằng `review/ASSET-AUDIT-DIRECTORS-CUT.md` (kết thúc bằng `VERDICT: PASS`, nêu rõ mục nào đã cắt) **và viết lại sau lần sửa code cuối** — bản cắt cũ không nói gì về code hiện tại.

### Bước 5: Code Linh kiện 3D Độc lập (Modular 3D Coding)
- **Đạo diễn/Coder thực hiện:** Đọc `step5-props-code/GUIDE.md`. Lập trình từng linh kiện độc lập vào `src/props.js` (hoặc module tương ứng). Chạy `propcheck.mjs`.
- **Review độc lập:** chạy `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --props` — công cụ dựng ảnh ba góc nhìn của từng vật, gọi một người gọi tên mù (blind test) trước khi chấm theo nhóm A/B, rồi đóng tem `review/PROPS.pass`.
- **Vòng lặp:** Đạo diễn tinh chỉnh hình khối, vật liệu toon, viền mực cho tới khi `PASS`.

### Bước 6: Lắp ghép Cảnh, Diễn hoạt & Nhịp điệu (Assembly, Animation & Beatsheet)
- **Đạo diễn thực hiện:** Đọc `step6-assembly/GUIDE.md`. Ghép linh kiện vào `src/film.js`, viết keyframes diễn hoạt theo từ `V.w()`. Chạy kiểm tra `beatsheet.mjs`.
- **Review độc lập:** chạy `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --chapter <id>` (phim dài), `… --lines a-b` (một cảnh vừa sửa), hoặc `… <tập>` cho cả phim. Công cụ nạp mẫu `step6-assembly/PROMPT_CRITIC.md` và triệt tiêu các cờ `DARK`, `SAME`, `NUM`, `RUN`.
- **Nhãn nằm đúng câu:** cổng chấm hình cũng chạy `tools/check_labels.py` — một nhãn lệch câu phải sửa trước khi dựng.
- **Mốc nhịp cho từng câu:** mỗi câu lời kể gắn một mốc vào `window.EV` (`markBeats(ev, V, (id, t) => [x, y])`), điểm
  trên khung 1920×1080. Nhờ đó cổng đo được câu hỏi mà đếm pixel không trả lời được: **nhịp này có làm thay đổi phần
  khung của nó không** (cổng đòi ≥ 75 % nhịp đổi). Không có mốc thì cổng chỉ đo "có gì đó động", không đo "câu này
  đứng yên".
- **Vật thể phải tự diễn:** camera trượt để giữ khung sống không cứu được phim — cổng đo cả phần khung camera trượt
  (≤ 30 %) và phần khung vật thể đổi (≥ 55 %). `rig/motion.js` có `sway()`, `breathe()`, `motor()`; bước 6 phải gọi
  hàm cập nhật của chúng mỗi khung hình.
- **Vòng này sửa được gì so với vòng trước:** sau mỗi vòng chấm hình, cổng in bảng đối chiếu (`tools/check_progress.py`): câu nào đã qua, câu nào **còn mở**, câu nào mới phát hiện, và điểm đi đâu. Sửa đúng những câu còn mở; đừng làm lại những câu đã qua. Nếu hai vòng liên tiếp không tiến, đó là lúc viết đạo diễn cắt.
- **Vòng chấm hình tốn ảnh, và cổng đo điều đó:** người chấm đọc **tờ sheet** trước (một tờ đáng giá bằng khoảng
  một ảnh riêng), mở ảnh riêng chỉ cho câu có cờ máy, câu fill dưới 15 %, hoặc câu nó nghi ngờ, và **mỗi ảnh một
  lần**. Sau mỗi vòng, cổng in ra số ảnh vòng đó đã mở — đó là khoản lớn nhất của vòng chấm.
- **Vòng lặp:** Đạo diễn sửa lỗi diễn hoạt/ánh sáng cho tới khi `PASS`.

### Bước 7: Âm thanh, Mux & Nghiệm thu Tổng thể (Audio, Mux & Delivery)
- **Đạo diễn thực hiện:** Đọc `step7-delivery/GUIDE.md`. Đăng ký `window.EV` (foley, ambience), chạy `mix.py`, render headless và mux `build.sh`.
- **Review độc lập:** chạy `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --final` — công cụ nạp mẫu `step7-delivery/PROMPT_CRITIC.md`, đưa cho người chấm những điều máy đo được về phim (độ dài, âm lượng, chỗ im lặng, sự kiện) bên cạnh các tờ trích từ phim đã dựng, rồi đóng tem `review/FINAL.pass`.

## Hướng dẫn Vận hành & Cổng Thẩm định (Verification & Gatekeeper)

1. **Cổng máy tự động (`gate.py`):** Các lần thẩm định PASS tự động đóng dấu vào `review/*.pass` (dàn ý, lời, vật, hình). 
   - `tts_vi.py` yêu cầu tem PASS của Dàn ý và Lời.
   - `mix.py` và `core/render/video.mjs` yêu cầu đầy đủ tất cả tem PASS.
   - Bất kỳ thay đổi nào sau khi PASS đều phải chạy thẩm định lại. Tuyệt đối không can thiệp thủ công vào file tem hoặc tự sửa điểm review.
2. **Nguyên tắc Phản biện & Tiếp nhận của Đạo diễn:**
   - Subagent đưa ra nhận xét khách quan dựa trên rubric.
   - Đạo diễn có trách nhiệm kiểm tra: điểm nào Subagent nói đúng thì sửa ngay; điểm nào Subagent đòi hỏi vượt khung kỹ thuật (vd: đòi poly-count quá cao gây crash Vulkan/WebGL, đòi texture phi thực tế) thì Đạo diễn lập luận phản biện rõ ràng để bảo vệ tính khả thi.
   - Cả hai bên đối thoại và hiệu chỉnh tối đa **5 vòng lặp** cho mỗi bước.
3. **Tập dài chia chương:**
   - Khi dàn ý dài (trên 8 phút) **hoặc nhiều câu (trên 30 câu)**, chia chương trong `TREATMENT.md` và `src/chapters.js`. Mỗi chương là một tầng cơ chế độc lập. Số câu là mốc quan trọng hơn thời lượng: một vòng chấm cả phim soi được khoảng 25 khung và tốn ~40 phút, nên phim 60 câu không thể hội tụ trong 5 vòng cả phim — mỗi chương có 5 lượt riêng và cổng mở khi mọi chương PASS.
   - Thực hiện trọn vẹn từng chương: bóc tách linh kiện $\rightarrow$ code `props.js` $\rightarrow$ review hình ảnh từng chương qua `review.sh <tập> --chapter n` trước khi sang chương tiếp theo.
4. **Bàn giao:**
   - Chỉ bàn giao khi mọi con dấu máy đã hợp lệ (`review/*.pass`) và `sh core/render/review.sh <tập>` thoát mã 0.
   - Một bài báo "COULD NOT RUN" (mã 2) **không phải phán quyết** — đó là bài kiểm tra không chạy được: đọc lý do,
     sửa nguyên nhân, chạy lại. Chỉ "FAILED" mới là lỗi thật của phim.
   - **Thời lượng đo, không gõ tay:** `build.sh` đo bằng `ffprobe` rồi ghi vào `film.json`; cổng so manifest với
     phim thật, nên con số gõ tay là một lời nói dối có dấu thời gian.
   - Báo cáo rõ ràng: đường dẫn phim `.mp4`, các khung hero hình ảnh, tờ beat và bản tổng kết review nguyên văn.
   - Dọn dẹp các ảnh still thử nghiệm và thư mục tạm để tiết kiệm dung lượng đĩa cứng.
5. **Đạo diễn cắt viết sau lần sửa code cuối.** `review/…-DIRECTORS-CUT.md` là lối ra khỏi trần vòng chấm, nhưng nó
   phải nói về code hiện tại: cổng không dùng một bản cắt cũ hơn code nó chấm. Sửa code xong rồi viết bản cắt.
