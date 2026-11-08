---
name: tram-nghi-nhieu
description: Đạo diễn và dựng một tập của kênh Trạm Nghĩ Nhiều — câu hỏi "tại sao" đời thường, trả lời bằng diorama 3D toon (three.js) có ánh sáng thật, viền mực vẽ tay, máy quay đi vào bên trong vật, mọi vật dựng đúng là nó, chỉ thứ vô hình mới thành hình minh hoạ; một giọng kể tiếng Việt. Dùng khi làm bất kỳ tập nào của kênh.
version: 14.1.0
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

5. **Sửa file bằng công cụ sửa file.**
   - Dùng `edit` / `write`. Khi đoạn thay quá dài để khớp chính xác, dùng
     `python3 tools/replace.py <file> <đoạn cũ> <đoạn mới>`: nó đếm số lần khớp, không khớp đúng một lần
     thì không ghi gì cả, và nó ghi nguyên tệp mới đè lên tệp cũ — tệp cũ không bao giờ bị nửa vời.
   - Heredoc của shell (`cat >> file <<EOF`) đã làm hỏng chữ tiếng Việt trong một tài liệu của phiên trước:
     shell ghi UTF-8 hỏng, không ai thấy ngay, và phải sửa lại bằng một lần ghi shell nữa.

6. **Chờ việc xong, đừng dò file.**
   - Một việc dài (dựng khung, chấm hình, render) thì chạy nền; harness báo khi nó xong, đọc output của nó một lần.
   - `until [ -f file ]; do sleep 15; done` là một vòng dò: nó ăn hết lượt của bạn và không quyết định gì.
   - Cùng một lệnh lặp năm lần trở lên, dù nó đang nhìn cái gì, là một vòng dò.

Mọi lệnh dưới đây chạy từ gốc thư viện. Trên máy này, mọi lệnh dựng hình (`still.mjs`, `beatsheet.mjs`, `review.sh`, `build.sh`) cần `LEMO_ANGLE=vulkan` ở đầu lệnh.

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
- **Review độc lập:** Lấy prompt từ `step1-outline/PROMPT_CRITIC.md` gọi Subagent thẩm định.
- **Vòng lặp:** Đạo diễn sửa lỗi lặp ý / thiếu mắt xích hoặc phản biện. Đạt `PASS` mới sang Bước 2.

### Bước 2: Kịch bản lời thoại (Script & Lines)
- **Đạo diễn thực hiện:** Đọc `step2-script/GUIDE.md`. Viết `voice/lines.json` khớp 1:1 với dàn ý, số viết thành chữ.
- **Review độc lập:** Dùng prompt `step2-script/PROMPT_CRITIC.md` để bắt lỗi cờ `DIGIT`, `LONG`, `NOFACTS`.
- **Vòng lặp:** Đạo diễn hiệu chỉnh câu văn hoặc phản biện từ ngữ chuyên môn. Sau khi `PASS`, chạy `tts_vi.py` sinh `src/timeline.js`.

### Bước 3: Storyboard & Khung hình Hero (Visual Framing & Camera)
- **Đạo diễn thực hiện:** Đọc `step3-storyboard/GUIDE.md`. Xác định góc máy, vùng nhìn frustum, ánh sáng qua tường có lỗ `wallWithHole`. Xuất still tham chiếu và ghi `LOOK.md`.
- **Review độc lập:** Dùng prompt `step3-storyboard/PROMPT_CRITIC.md` thẩm định độ tương phản, góc đặt ống kính.
- **Vòng lặp:** Điều chỉnh góc máy, tiêu cự cho tới khi `PASS`.

### Bước 4: Bóc tách Linh kiện 3D chi tiết (3D Component Breakdown & Spec)
*(Bắt buộc nằm sau Storyboard để bám sát góc nhìn camera thực tế)*
- **Đạo diễn thực hiện:** Đọc `step4-component-breakdown/GUIDE.md`. Viết tài liệu đặc tả `COMPONENTS_SPEC.md` bóc tách từng chi tiết nhỏ: Đạo cụ (Props), Ruột máy (Internal parts), Bối cảnh (Sets), Đèn & FX.
- **Review độc lập:** Dùng prompt `step4-component-breakdown/PROMPT_CRITIC.md` để Subagent rà soát chéo kịch bản và storyboard: đảm bảo không bỏ sót bất kỳ đồ vật/linh kiện nào.
- **Vòng lặp:** Bổ sung dứt điểm mọi linh kiện thiếu trước khi code.

### Bước 5: Code Linh kiện 3D Độc lập (Modular 3D Coding)
- **Đạo diễn/Coder thực hiện:** Đọc `step5-props-code/GUIDE.md`. Lập trình từng linh kiện độc lập vào `src/props.js` (hoặc module tương ứng). Chạy `propcheck.mjs`.
- **Review độc lập:** Dùng prompt `step5-props-code/PROMPT_CRITIC.md` thực hiện bài kiểm tra nhận diện gián tiếp (Blind test) qua ảnh xoay 3 phía.
- **Vòng lặp:** Đạo diễn tinh chỉnh hình khối, vật liệu toon, viền mực cho tới khi `PASS`.

### Bước 6: Lắp ghép Cảnh, Diễn hoạt & Nhịp điệu (Assembly, Animation & Beatsheet)
- **Đạo diễn thực hiện:** Đọc `step6-assembly/GUIDE.md`. Ghép linh kiện vào `src/film.js`, viết keyframes diễn hoạt theo từ `V.w()`. Chạy kiểm tra `beatsheet.mjs`.
- **Review độc lập:** Dùng prompt `step6-assembly/PROMPT_CRITIC.md` thẩm định nhịp điệu, triệt tiêu các cờ `DARK`, `SAME`, `NUM`, `RUN`.
- **Vòng lặp:** Đạo diễn sửa lỗi diễn hoạt/ánh sáng cho tới khi `PASS`.

### Bước 7: Âm thanh, Mux & Nghiệm thu Tổng thể (Audio, Mux & Delivery)
- **Đạo diễn thực hiện:** Đọc `step7-delivery/GUIDE.md`. Đăng ký `window.EV` (foley, ambience), chạy `mix.py`, render headless và mux `build.sh`.
- **Review độc lập:** Dùng prompt `step7-delivery/PROMPT_CRITIC.md` nghiệm thu toàn diện chất lượng video mp4 cuối cùng.

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
   - Khi dàn ý dài (trên 8 phút), chia chương trong `TREATMENT.md` và `src/chapters.js`. Mỗi chương là một tầng cơ chế độc lập.
   - Thực hiện trọn vẹn từng chương: bóc tách linh kiện $\rightarrow$ code `props.js` $\rightarrow$ review hình ảnh từng chương qua `review.sh <tập> --chapter n` trước khi sang chương tiếp theo.
4. **Bàn giao:**
   - Chỉ bàn giao khi mọi con dấu máy đã hợp lệ (`review/*.pass`) và `sh core/render/review.sh <tập>` thoát mã 0.
   - Báo cáo rõ ràng: đường dẫn phim `.mp4`, các khung hero hình ảnh, tờ beat và bản tổng kết review nguyên văn.
   - Dọn dẹp các ảnh still thử nghiệm và thư mục tạm để tiết kiệm dung lượng đĩa cứng.
