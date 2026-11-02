# Vì sao phim do agent làm "như PowerPoint", và cần gì để phim có hồn

*Nghiên cứu ngày 2026-11-02. Phạm vi: phim 2D có người kể; hình phải diễn ra đúng bối cảnh, hành động, sự vật và hiện tượng mà lời đang nói tới. Kênh dùng để đo: Trạm Nghĩ Nhiều.*

Nguồn dữ liệu:
- **Nội bộ**: contact sheet 30 khung hình của `films/host-toon-test` và các tập 05, 06, 07 (ảnh trong thư mục này), cùng mã `src/film.js`, `voice/lines.json`, `STYLE.md`, `STRATEGY.md` và skill `.agents/skills/tram-nghi-nhieu/SKILL.md`.
- **Bên ngoài**: workflow `deep-research` của Claude (5 hướng tìm, 22 nguồn đọc, 25 nhận định được 3 agent kiểm chéo, giữ 23, bác 2; kết quả thô trong `deep-research.json`), cộng các nguồn gốc mình tự đọc để lấp phần workflow không kịp kiểm. Báo cáo Gemini trước đó đã bị loại vì có số liệu bịa.

---

## 1. Kết luận ngắn

Phim mẫu "wow" không phải vì vẽ đẹp hơn hay code giỏi hơn. Nó hơn vì **mỗi câu lời là một sự việc có người làm, ở một nơi cụ thể**, nên đạo diễn chỉ việc quay sự việc đó. Các tập của kênh thì **mỗi câu lời là một nhận định hoặc một con số**. Gặp câu như vậy, đạo diễn giỏi đến đâu cũng chỉ còn cách vẽ một tấm thẻ.

Vì vậy bệnh PowerPoint bắt nguồn từ **kịch bản và thứ tự quy trình**, rồi mới đến hình. Các luật "cấm slide" trong skill không chữa được, vì skill cấm slide nhưng chính khung storyboard của nó lại đòi slide ("Cơ chế = Mode B, 85–90% màn hình cho đồ họa").

Chữa bằng cách đổi thứ tự: **sự việc trước, lời sau**. Đi kèm là một vài phép đo máy chấm được, để agent không tự tuyên bố là "đã đạt".

---

## 2. Đo đạc: phim mẫu và các tập kênh khác nhau ở đâu

| Đo trên 30 khung hình đều nhau | host-toon-test (132 s) | Tập 07 (191 s) | Tập 06 (185 s) |
|---|---|---|---|
| Câu lời "quay được" (có người · làm gì · ở đâu) | ~24/24 câu | ~6/38 câu | ~10/36 câu |
| Khung có bối cảnh và người hành động | ~17/30 | ~5/30 | ~8/30 |
| Khung chỉ có thẻ/biểu đồ, không có nơi chốn | ~6/30 (20%) | ~20/30 (67%) | ~17/30 (57%) |
| Số nơi chốn khác nhau | ~13 | ~3 | ~5 |
| Bảng màu, ánh sáng | đổi theo nơi chốn (ngày, đêm xanh, đất nâu, hoàng hôn) | cùng một nền than tối | cùng một nền than tối |
| Con số trên màn hình | ~9, mỗi số gắn với một vật đếm được | ~20 số và năm, phần lớn là cột hoặc % | ~15 |

*Số đếm bằng mắt trên contact sheet nên chỉ gần đúng. Nhưng khoảng cách quá lớn để là ngẫu nhiên.*

### Phim mẫu làm đúng gì (để bóc tách, không phải để bắt chước)

1. **Câu lời là sự việc**: "Ông tuyển 8 tay tội phạm, huấn luyện 5 tháng ở trang trại bỏ hoang." Câu này quay được ngay: tấm bản đồ, trang trại, 8 người hiện lên, tờ lịch lật đến 5 tháng.
2. **Có một dàn nhân vật diễn trong thế giới**: nhóm 8 người đồ đỏ đi, lẻn vào, khuân vàng. Người dẫn Nhi **bước vào câu chuyện**, mặc đồ cướp và nâng thỏi vàng, chứ không chỉ đứng ngoài chỉ trỏ.
3. **Mỗi nhịp là một nơi chốn, có ánh sáng riêng**: xưởng in, nhà kho đêm, mặt tiền xưởng tiền, ống ngắm ban đêm, mặt cắt lòng đất, quán cà phê, bờ biển. Ngoài ra có một "nhà" để quay về là phòng đọc của Nhi.
4. **Con số là vật**: 67 con tin là bộ đếm cạnh cửa vừa khóa. "Mặc đồ đỏ giống bọn cướp" là 67 hình người đổi màu từng cột. 41% là thanh tiền đầy một phần.
5. **Có một đạo cụ xuyên suốt và đổi trạng thái**: tấm thẻ "4 luật" được viết ra, rồi bị phá từng luật (dấu PHÁ LUẬT, rồi vết nứt trên nền tối). Người xem theo dõi trạng thái của nó như theo dõi một nhân vật.
6. **Diễn xuất khớp từng chữ**: chữ "tự in" đi kèm ánh kính lóe, 4 luật đi kèm đếm ngón 1–2–3–4, nhún vai khi nói cảnh sát, cảnh phản ứng đỏ mặt khi kể chuyện tình.
7. **Có đường cong cảm xúc**: lặng trước chữ "Nhưng", chuông nện cho mỗi người chết, nhạc đổi theo hồi (cue B→G), bờ biển là chỗ thở ra.

Phim mẫu cũng có thẻ, khoảng 20% khung hình. Nhưng thẻ là **đạo cụ ghim trong phòng của nhân vật**, và luôn được xen giữa các cảnh thế giới. Thẻ không phải là sân khấu chính.

### Vì sao các tập kênh ra slide: nguyên nhân nằm sẵn trong tài liệu

| Nơi | Câu chữ | Hệ quả |
|---|---|---|
| `STRATEGY.md` | "Chiều sâu cơ chế", "lật ngược niềm tin bằng dữ kiện", uy tín học thuật | Kịch bản thành bài tổng quan nghiên cứu: năm, tên tác giả, số người tham gia, % |
| `STYLE.md` | "nền tối, chữ rõ", một màu nền `#12131A`, bảng màu panel/bảng | Mọi cảnh cùng một ánh sáng nên cảnh nào trông cũng như cảnh nào |
| `SKILL.md` Mode B | "85–90% màn hình dành cho đồ họa, nhân vật trong vòng tròn nhỏ" | Phần giữa phim, thường chiếm 50–60% thời lượng, được **lệnh** làm thành slide |
| `SKILL.md` §2 | Khung storyboard: "Cơ chế = Mode B, Swiss/Mind Lab, foley pop/ting/marker" | Agent điền đúng khung, nên ra đúng slide |
| Quy trình | FACTS → `lines.json` → storyboard → code | Hình được nghĩ **sau** khi lời đã chốt. Đạo diễn chỉ còn minh họa những câu không được viết để quay |
| Checklist | "Có cảnh nào thành slide không?" (tự trả lời có/không) | Agent tự chấm mình đạt, vì không có gì đo |

Tập 05 (căn phòng ngập khói) là tập gần đúng nhất, vì nó dựng lại thí nghiệm như một câu chuyện có nhân vật Tuấn. Nó vẫn hụt vì một khung rộng bị dùng lại khoảng 8 lần, nhân vật quá nhỏ, nền phẳng tối, và kết thúc bằng thẻ %. Điều này cho thấy **ý tưởng đúng thôi chưa đủ, còn cần ngữ pháp cảnh**.

---

## 3. Bên ngoài nói gì (chỉ những gì đã kiểm)

Mỗi mục ghi mức kiểm: **[3-0]** là 3 agent kiểm chéo đều xác nhận trên nguồn gốc; **[tự kiểm]** là mình đọc nguồn gốc hoặc abstract; **[thứ cấp]** là chỉ thấy qua trang trích dẫn lại.

### 3.1 Studio làm thế nào: hình được quyết định ở khâu kịch bản, không phải khâu vẽ

- **Phil Edwards (cựu Vox)** viết kịch bản **hai cột**: lời bên trái, hình dự kiến bên phải, tốt nhất là một ảnh thật. Ông dựng gần thành storyboard bằng clip tạm, càng rẻ càng tốt. **[3-0]**
- **Vox, Estelle Caswell**: biên tập viên kịch bản bắt cô chịu trách nhiệm rằng câu chuyện phải có hình, *"the whole point of video is that you're talking about the thing onscreen"*. **[tự kiểm]**
- **Kurzgesagt**: kịch bản → phác thảo, nơi họ cân nhắc *"the best visual metaphors and ideas for each scene"* → minh họa → **thu giọng** → animation. *"His voiceover provides the timing for the animation team"*: giọng có trước, nhịp hình đi theo giọng. **[3-0]** Mỗi video khoảng 1.200 giờ và viết kịch bản là khâu nghẽn **[tự kiểm]**. Số "khoảng 200 panel mỗi video" chỉ có trong transcript và trang tổng hợp **[thứ cấp]**.
- **TED-Ed**: tác giả và biên kịch sửa kịch bản qua lại khoảng một năm. Sau đó họa sĩ (Avi Ofer) **tự chọn hình** và vẽ storyboard, rồi thu giọng, giọng được duyệt mới animate. **[tự kiểm, qua blog tác giả Kate Messner]**
- **3Blue1Brown**: mỗi cảnh là một class Python riêng, render riêng, rồi dựng lại trong Final Cut. Có cơ chế chạy lại đúng một đoạn từ trạng thái đầu đoạn. **[3-0]**

**Rút ra cho agent:** ở studio, người viết và người vẽ là hai người thương lượng với nhau. Câu nào không có hình thì bị trả về, như ở Vox. Agent làm một mình thì không có ai trả về, nên phải tự bắt buộc **cột hình nằm ngay trong kịch bản** (cách của Edwards), và câu không có hình thì không qua. Kênh đã làm đúng thứ tự "giọng trước, hình theo `words.json`", giống Kurzgesagt. Vậy khâu thiếu nằm ở **trước** lời, không phải sau.

### 3.2 Bằng chứng học tập

- **Chữ lặp lời làm hại**: thêm chữ trên màn hình tóm tắt hoặc chép lại lời thuyết minh của một animation làm người học nhớ và vận dụng **kém hơn** so với không có chữ (Mayer, Heiser & Lonn 2001, 4 thí nghiệm). **[thứ cấp: abstract qua trang trích]** Meta-analysis của Adesope & Nesbit (2012) cho kết quả phức tạp hơn: nghe + đọc không thua chỉ đọc. Vì vậy nên hiểu luật này là "đừng để chữ chép lời cạnh tranh với **hình động**", không phải "cấm mọi chữ". **[thứ cấp]**
- **Hình khớp đúng lúc, đúng chỗ với lời giúp học tốt hơn**: Ginns (2006), meta-analysis 50 nghiên cứu về liền kề không gian và thời gian, cho hiệu ứng lớn, mạnh nhất với nội dung phức tạp (d ≈ 0,85 theo trích dẫn). **[thứ cấp, con số cần đối chiếu bản gốc]**
- **Nhân vật biết chỉ trỏ thì có ích, nhân vật chỉ đứng thì không**: meta-analysis của Li, Kuang, Leng, Mayer & Wang (2024, *Educ. Psychol. Rev.*) cho thấy người dạy trên màn hình **có cử chỉ** cải thiện ghi nhớ (g = 0,28) và vận dụng (g = 0,31). Hiệu ứng mạnh hơn khi cử chỉ là **chỉ vào đúng thứ đang nói** (deictic) hoặc cử chỉ ẩn dụ. **[tự kiểm, qua abstract]**
- **Chi tiết hấp dẫn nhưng lạc đề làm hại**: chúng làm giảm khả năng nhớ (ηp² ≈ 0,07), vì người học tưởng chúng quan trọng và tốn thời gian vào đó (Kienitz, Krebs & Eitel 2023). **[3-0]** Cảnh "có hồn" phải là cảnh của **chính câu chuyện**, không phải trò vui gắn thêm vào.
- **Câu chuyện và con số làm hai việc khác nhau**: bằng chứng thống kê tác động mạnh hơn lên niềm tin và thái độ, câu chuyện tác động mạnh hơn lên **ý định hành động** (Zebregs và cộng sự 2015, meta-analysis). **[tự kiểm, qua abstract]**
- **Video có nêu ngộ nhận hoặc đối thoại học tốt hơn video trình bày thẳng**: hai bản "nêu rồi bác ngộ nhận" và "sinh viên đoán sai trò chuyện với gia sư" cho d ≈ 0,79 và 0,83 so với bản trình bày. Bản "thêm thông tin thú vị" thì không giúp gì (Muller, Bewes, Sharma & Reimann 2008). **[thứ cấp, trang gốc của Wiley chặn truy cập]**
- **Vẽ tay giữ người xem tốt hơn slide**: phân tích 6,9 triệu phiên xem trên edX cho thấy video vẽ tay kiểu Khan và video ngắn giữ người xem tốt hơn. Sản xuất đắt tiền không nhất thiết giúp (Guo, Kim & Rubin 2014). **[tự kiểm]**
- **Tò mò sinh ra từ khoảng trống kiến thức mà người xem nhận ra**: tò mò là một dạng thiếu thốn do nhận thức tạo ra (Loewenstein 1994). Các bài viết sau ghi rằng tò mò mạnh nhất khi người ta đã đoán được gần đúng mà chưa chắc. **[abstract tự kiểm; phần "đoán gần đúng" là thứ cấp]**

### 3.3 Nghề dựng phim

- **Rule of Six của Murch**, thứ tự ưu tiên khi cắt: cảm xúc, câu chuyện, nhịp, hướng mắt, mặt phẳng 2D, không gian 3D. Cảm xúc chiếm 51%, nặng hơn năm tiêu chí còn lại cộng lại, và là thứ phải *"preserve at all costs"*. **[thứ cấp, nofilmschool]** Tỷ lệ của năm tiêu chí còn lại mình chưa đối chiếu với sách gốc.
- Diễn xuất cho hoạt hình (Ed Hooks), synchresis (Chion), 12 nguyên lý (Thomas & Johnston): là kiến thức nghề kinh điển, nhưng **không có nhận định nào được kiểm trong lần này**. Dùng làm nguyên tắc nghề, không trích làm số liệu.

### 3.4 Agent làm video: hỏng ở đâu, cái gì giúp được

- **Kiểu hỏng lặp lại trong 4 bài báo độc lập (2025–2026)**: chữ và hình chồng lấn hoặc che nhau; mạch chuyển động đứt; code hiếm khi chạy được lần đầu; và **lời thuyết minh thừa, tả lại đúng cái đang có trên màn hình**. Với PhysicsSolutionAgent, lỗi thừa lời này đứng đầu (36 lần, gấp đôi lỗi hình). Nhiều lỗi chỉ lộ ra sau khi render, nhìn code không thấy. **[3-0; cả 4 đều tự đánh giá trên benchmark của chính họ]**
- **Tách vai giúp nhiều**: Planner viết kế hoạch và lời, Coder viết code, đọc lỗi và sửa tối đa 5 lần. TheoremExplainAgent nói không có agent thì không làm nổi video quá khoảng 20 s, có agent thì làm được video trên 5 phút (câu này không kèm bảng đo). Ở Code2Video, điểm TeachQuiz tăng từ khoảng 37–40 (sinh code thẳng) lên 80–86. **[3-0]** Số "40% improvement" trong abstract của Code2Video không truy ra được cách tính, và một bảng ablation từng được trích đã **bị bác 0-3**.
- **Lên bố cục trước khi code tốt hơn chấm ảnh sau khi render**: OmniManim cho một agent dự đoán khung bao của từng keyframe trước khi code. Bỏ agent này đi thì điểm không chồng lấn rơi từ 0,76 xuống 0,49. Ngược lại, để VLM chấm 3 ảnh tĩnh mỗi cảnh rồi sửa một lượt chỉ cải thiện chút ít, và **ảnh tĩnh không thấy được độ khớp giữa hình và tiếng**. **[3-0, preprint]**
- **Phê bình có cấu trúc giữa các vai**: FilmAgent cho đạo diễn, biên kịch, diễn viên và quay phim tranh luận rồi phán xử. Điểm người chấm đạt 3,98, so với 3,04 khi một agent làm hết và 2,63 với chuỗi suy luận (CoT). Đánh giá nhỏ, trong bối cảnh 3D. **[3-0]**
- **Verbalized Sampling**: bắt mô hình đưa ra nhiều phương án, mỗi phương án kèm xác suất, thay vì một đáp án. Trong viết sáng tạo, độ đa dạng tăng 1,6–2,1 lần mà không giảm độ đúng. **Chưa ai thử cho storyboard.** **[3-0, preprint]** Nhận định chung "RLHF làm agent đạo diễn hội tụ về ý quen" **bị bác 0-3** ở dạng phát biểu đó. Nói đúng hơn: đây là giả thuyết hợp lý, chưa được chứng minh cho video.

### 3.5 Những gì chưa trả lời được

- Không có bằng chứng **đo được** về retention của hook, của "nhưng/vì vậy", hay về tần suất đổi hình tối ưu cho video 3–10 phút. Những điều đó hiện chỉ là kinh nghiệm của người làm nội dung.
- Không có nguồn gốc kiểm được cho TED-Ed animator notes, The School of Life, Sprouts hay Oversimplified về tần suất đổi hình mỗi câu.
- Mọi kết quả về agent là tự đánh giá, chạy trên Manim/Python, không phải canvas/JS.

---

## 4. Phương pháp: cái gì làm một phim có hồn (áp dụng cho mọi agent và mọi kênh)

Đây là **phương pháp, không phải phong cách**. Nó không nói phải vẽ gì. Nó nói phải *nghĩ theo thứ tự nào* và *đo bằng gì*.

### 4.1 Bảy nguyên tắc

1. **Sự việc trước, lời sau.** Viết bảng nhịp (beat), mỗi nhịp là *ai · làm gì · ở đâu · vật gì đổi trạng thái*, **trước** khi viết `lines.json`. Lời được viết để thuyết minh cho sự việc. Câu nào không có sự việc thì sửa câu, không vẽ thẻ để gánh nó. Lời và hình **bổ sung** cho nhau: lời nói cái hình không nói được (vì sao, nghĩa là gì), hình cho thấy cái lời không cần tả.
2. **Mỗi tập có một người trải qua hiệu ứng.** Một nhân vật có mong muốn, ở một nơi cụ thể, vấp phải đúng hiệu ứng tâm lý đó. Thí nghiệm được **dựng lại thành cảnh có người** (như tập 05), không đọc lên như trích dẫn. Người dẫn được bước vào cảnh.
3. **Con số phải là vật.** Mỗi tập chỉ vài con số thật cần, khoảng 1 số mỗi 20–30 s. Số nào cũng được đổi thành thứ đếm hoặc nhìn được trong cảnh. Ví dụ "44% → 66%" thành hàng người xếp ở quầy, cứ 3 người thì 2 người cầm ly lớn. Năm, tên tác giả và cỡ mẫu để trong `FACTS.md` và mô tả video, không đọc lên trừ khi chúng là một phần câu chuyện.
4. **Mỗi nhịp một nơi chốn, mỗi nơi chốn một ánh sáng.** Lập "kinh thánh bối cảnh" cho tập: một nơi chốn "nhà" để quay về, cộng các nơi chốn của câu chuyện, khoảng một nơi mới mỗi 15–20 s. Phong cách kênh giữ cố định nhân vật, nét, chữ và âm thanh. **Không cố định nền và ánh sáng.**
5. **Một đạo cụ xuyên suốt, đổi trạng thái.** Chọn một vật mà trạng thái của nó *là* luận điểm của tập (thẻ 4 luật, ly trà sữa cỡ vừa, tờ đính chính trong ngăn kéo). Nó xuất hiện ở đầu, bị biến đổi ở giữa, và được giải quyết ở cuối.
6. **Diễn xuất khóa vào chữ.** Mỗi câu có ít nhất một nhịp diễn (biểu cảm, cử chỉ, ánh nhìn) neo vào một từ trong `words.json`. Câu bẻ ngoặt phải có cảnh phản ứng. Nhân vật **chỉ vào đúng thứ đang được nói tới**, vì cử chỉ chỉ trỏ có bằng chứng (Li và cộng sự 2024), còn đứng nói thì không. Rối là người hỏi vặn và đoán sai (dạng đối thoại của Muller), không phải hình trang trí trong vòng tròn.
7. **Đường cong, không đường thẳng.** Có ít nhất một khoảng lặng thật trước cú lật, nhạc đổi theo hồi, và một chỗ thở ra trước khi kết. Nhịp nối giữa các cảnh là "Nhưng" hoặc "Vì vậy", không phải "Và rồi".

### 4.2 Quy trình (đổi thứ tự của pipeline hiện tại)

```
0. FACTS.md (nghiên cứu như cũ)
1. SPINE: một câu "<Nhân vật> muốn <X> ở <nơi>, nhưng <hiệu ứng> khiến <Y>, vì vậy <Z>".
2. BEATS (beats.json / bảng trong TREATMENT): mỗi nhịp = nơi · ai · hành động · vật đổi trạng thái · cảm xúc · nối "nhưng/vì vậy".
   → Phép thử TẮT TIẾNG: chỉ đọc cột hình, người khác có kể lại được câu chuyện không?
3. TÌM HÌNH CHO NHỊP KHÓ: với 3–5 nhịp trừu tượng nhất, liệt kê 4 phương án kèm "độ phổ biến" ước lượng;
   loại phương án quen nhất (thẻ, biểu đồ, icon), chọn phương án cụ thể nhất mà vẫn đúng sự thật.
4. LINES: viết lời theo nhịp. Câu nào không gắn vào sự việc nào thì xóa hoặc sửa.
5. KINH THÁNH TẬP: danh sách nơi chốn (+ ánh sáng), dàn nhân vật, đạo cụ xuyên suốt và các trạng thái của nó.
6. BỐ CỤC TRƯỚC CODE: với mỗi cảnh, ghi khung bao (x,y,w,h) của nhân vật, đạo cụ chính và vùng chữ ở keyframe
   (OmniManim: bước này giảm chồng lấn rõ rệt). Rồi render 4–6 still bằng code thật và tự xem. Chấm ảnh tĩnh chỉ để
   bắt lỗi bố cục: nó không thấy được độ khớp hình và tiếng.
7. ANIMATE → render → cổng đo §4.3 trên contact sheet → kiểm bằng mắt.
```

Bước 2 chính là kịch bản hai cột của Edwards, được làm thành điều kiện bắt buộc. Bước 3 là Verbalized Sampling áp vào hình; cách dùng này chưa ai kiểm chứng, nên phải đo bằng §4.3. Giọng vẫn có trước animation như Kurzgesagt, và kênh đã làm đúng điều này.

Khác biệt cốt lõi với `SKILL.md` hiện tại: bước 2 và 3 **có trước** lời. Nhờ vậy storyboard trở thành *nguồn* của kịch bản, thay vì là tranh minh họa cho kịch bản.

### 4.3 Đo được, thay cho tự khai

Các ngưỡng dưới đây là **đề xuất của mình**, lấy phim mẫu làm mốc. Chạy thử vài tập rồi chỉnh.

| Cổng | Cách đo | Ngưỡng đề xuất |
|---|---|---|
| Câu quay được | Bảng nhịp: % câu có đủ ai, hành động, nơi | ≥ 80% |
| Khung thẻ/biểu đồ | 30 khung đều nhau: khung mà chữ hoặc đồ họa chiếm phần lớn màn hình và không có nơi chốn. Đo được tự động từ `window.TEXTS(t)`, vì trang đã đăng ký mọi hộp chữ | ≤ 25% |
| Nơi chốn | Đếm nơi chốn khác nhau trong bảng nhịp hoặc `SHOTS` | ≥ 1 mỗi 20 s |
| Con số đọc lên | Đếm số và năm trong `lines.json` | ≤ 1 mỗi 20 s |
| Diễn xuất | Mỗi câu có một khóa biểu cảm hoặc cử chỉ gắn vào từ | 100% câu có nhân vật trong khung |
| Khớp hình–tiếng | Mỗi nhịp khai một từ khóa trong `words.json` và một sự kiện trong `window.EV`; đo độ lệch thời gian giữa chúng. Ảnh tĩnh không đo được điều này, nhưng log thì đo được | lệch ≤ 0,3 s |
| Lời không tả lại hình | Với mỗi nhịp: câu lời có chỉ đọc lại cái màn hình đã cho thấy không (lỗi số 1 trong các bài báo agent) | 0 nhịp |
| Phép thử tắt tiếng | Một agent khác chỉ xem contact sheet rồi kể lại câu chuyện | Kể đúng mạch chính |

Các cổng khung thẻ, con số và khớp hình–tiếng máy đo được hoàn toàn. Có thể thêm vào `core/render/filmcheck.mjs` hoặc `review.sh`, vì hạ tầng đăng ký chữ (`REG`, `TEXTS`) đã có sẵn.

---

## 5. Thử phương pháp trên một tập có sẵn: tập 06 "Hiệu ứng chim mồi"

Tập hiện tại dùng khoảng 60% thời lượng cho cột %, tường 38 thẻ và đồ thị. Theo phương pháp, cấu trúc sẽ thành:

- **Spine**: Kẻ Nghĩ Nhiều chỉ định mua ly nhỏ 35k ở quầy trà sữa lúc nửa đêm. Nhưng ly vừa 65k đứng cạnh ly lớn 60k (vừa đắt hơn lại ít hơn) khiến ly lớn trông như món hời. Vì vậy cậu trả gần gấp đôi. Nhưng khi cậu là khách quen, mẹo này mất tác dụng.
- **Đạo cụ xuyên suốt**: ly cỡ vừa, "con chim mồi". Nó đứng đó, không ai mua, cuối cùng bị gạch khỏi bảng giá.
- **Nơi chốn**: quầy trà sữa (nhà); phòng thí nghiệm năm 1982 dựng lại như một cửa hàng xe, người tham gia cầm phiếu chọn; kệ rượu siêu thị (3,6 triệu giao dịch được thể hiện bằng dòng người đẩy xe, hiệu ứng ~1% là một xe duy nhất rẽ sang); trang đặt vé máy bay trên màn hình điện thoại trong tay nhân vật.
- **Con số là vật**: "44% → 66%" là hàng 9 khách, rồi hàng 9 khách khác có thêm ly mồi, lần lượt từng người cầm ly lớn. "19 thí nghiệm dùng sản phẩm thật, không cái nào ra hiệu ứng" là chồng 19 phiếu bị Rối đóng dấu từng tờ (giữ một đạo cụ thay cho tường 38 thẻ).
- **Đối thoại**: Rối đoán sai ("người bán lừa bạn đấy!"), Kẻ Nghĩ Nhiều cùng người xem kiểm chứng. Cú lật nằm ở chỗ mẹo này yếu hơn người ta tưởng.

Đây là ví dụ để đối chiếu, chưa phải treatment.

---

## 6. Việc nên làm tiếp (theo thứ tự đòn bẩy)

1. **Viết lại `.agents/skills/tram-nghi-nhieu/SKILL.md`** theo §4. Ngắn hơn, nói phương pháp trước. Bỏ khung "Cơ chế = Mode B 85–90%". Thêm bước Spine → Beats → Tìm hình trước Lines.
2. **Sửa `STYLE.md`**: nền và ánh sáng do nơi chốn quyết định. Giữ cố định nhân vật, nét, chữ và âm thanh.
3. **Sửa `STRATEGY.md`**: giữ độ chắc của khoa học, nhưng đổi "lật bằng dữ kiện" thành "lật bằng một cảnh". Con số có ngân sách.
4. **Thêm cổng đo** (khung thẻ, mật độ con số, số nơi chốn) vào `review.sh`. Đây là cách duy nhất để *mọi* agent, kể cả model yếu, không tự khai là đạt.
5. **Chạy thử**: làm lại một tập (đề xuất tập 06 hoặc 07) theo quy trình mới, rồi so contact sheet với bản cũ và với host-toon-test.

---

## Nguồn

Studio:
- Phil Edwards, kịch bản hai cột (transcript): https://rosetta.to/u/digspaghetti/how-phil-edwards-handles-creative-compromise
- Kurzgesagt, quy trình: https://kurzgesagt.org/youtube/ · 1.200 giờ: https://rosetta.to/u/kurzgesagt/how-to-make-a-kurzgesagt-video-in-1200-hours
- Vox, Estelle Caswell: https://www.filmindependent.org/blog/explainer-an-interview-with-vox-pop-video-essayist-estelle-caswell/
- TED-Ed, Kate Messner: https://katemessner.com/the-making-of-a-ted-ed-video/
- 3Blue1Brown, Manim demo (transcript): https://rosetta.to/u/3blue1brown/how-i-animate-3blue1brown-a-manim-demo-with-ben-sparks

Học tập:
- Mayer, Heiser & Lonn (2001): https://www.csus.edu/indiv/e/eppersonm/hist107/documents/mayer,%20heiser,%20&%20lonn%20(2001).pdf
- Ginns (2006), doi:10.1016/j.learninstruc.2006.10.001
- Li, Kuang, Leng, Mayer & Wang (2024), doi:10.1007/s10648-024-09910-0
- Kienitz, Krebs & Eitel (2023): https://link.springer.com/content/pdf/10.1007/s11251-023-09632-w.pdf
- Zebregs và cộng sự (2015): https://pubmed.ncbi.nlm.nih.gov/24836931/
- Muller và cộng sự (2008): https://perticles.blogspot.com/2008/01/muller-sharma-reimann-jcal-2008.html
- Loewenstein (1994): https://stafforini.com/works/loewenstein-1994-psychology-curiosity-review/
- Guo, Kim & Rubin (2014): https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf

Dựng phim:
- Murch, Rule of Six: https://nofilmschool.com/2016/11/6-rules-good-cutting-according-oscar-winning-editor-walter-murch

Agent:
- Code2Video: https://arxiv.org/abs/2510.01174
- TheoremExplainAgent: https://arxiv.org/abs/2502.19400
- PhysicsSolutionAgent: https://arxiv.org/pdf/2601.13453
- OmniManim: https://huggingface.co/papers/2605.15585
- FilmAgent: https://arxiv.org/pdf/2501.12909v1
- Verbalized Sampling: https://arxiv.org/abs/2510.01171
