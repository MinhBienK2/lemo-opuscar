# Chữ, tiếng và dựng: vì sao tập thử "Hiệu ứng IKEA" tệ hơn, và luật nên đổi thế nào

Ngày 2026-11-03. Thước đo là phim mẫu `films/host-toon-test` (132 s), so với tập thử IKEA (186 s) do omp MiniMax làm theo skill v5.

## 1. Đo được

| | host-toon-test | IKEA (skill v5) |
|---|---|---|
| Số shot | **24 shot / 132 s** (~5,5 s một shot, gần như mỗi câu một shot) | 9 khối cảnh / 186 s (~20 s một khối) |
| Người dẫn trên hình | ~1/3 khung (ở "nhà", giữa các hồi), còn lại là thế giới câu chuyện **không có người dẫn** | gần 100 % khung, đứng một tư thế |
| Chữ trên màn hình | ~45 chữ, **tất cả là tên**: người (TOKYO, RAQUEL · thanh tra), nơi (XƯỞNG IN TIỀN, HẦM KHO, MÁY IN SỐ 3), thời điểm (NGÀY 3, 128 GIỜ SAU), con số của vật (2,4 tỷ €), một tờ "4 LUẬT" đổi trạng thái, dấu kết luận (GIẢ, PHÁ LUẬT) | 49 nhãn, phần lớn là **mẩu của câu đang nói**: "hơi lệch", "biến mất", "vì sao?", "cách giải thích", "có thì mới quý" — hiện lên rồi tắt |
| Khoảnh khắc có tiếng (gộp tiếng cách nhau < 0,6 s) | **26 / phút** | **46 / phút** |
| Cửa sổ 3 s không có tiếng hiệu ứng | **21 %** | **0 %** — cứ ~1 s một tiếng, đều như máy |
| Loại tiếng | theo mô-típ của câu chuyện: tiếng bước của đoàn đồ đỏ, tiếng đồng hồ đếm 11 ngày, giấy/con dấu khi tài liệu hiện | `hand_tap` 34, `sigh_breath` 17, `pen_tick` 22… rải lên mọi nhịp |

## 2. Nguyên nhân nằm trong luật (của tôi viết)

- SKILL v5 bắt **mỗi câu** phải có nhãn / vòng chỉ / biểu đồ, và **không quá 2,5 s không có nhịp** → agent sinh nhãn từ chính câu nói, và một nhịp (kèm tiếng) mỗi 1–2 s.
- SKILL v5 cho mỗi nhãn và biểu đồ một tiếng đồ họa (`label_in`, `bar_grow`) → mỗi nhãn là một tiếng.
- SKILL v5 "nhân vật chính không vắng mặt quá ~30 s" và "bước vào thí nghiệm" → agent hiểu nhân vật chính là người dẫn, nên người dẫn có mặt mọi khung.
- CHANNEL.md §7 (luật cũ): "một phân cảnh 20–50 s", "cấm cứ xong một câu là đổi cảnh" → ngược hẳn phim mẫu (mỗi câu một shot).
- Cổng `scenecheck` "tiếng rơi lúc hình chuyển động" bị ăn gian: một nhãn hiện lên cũng là "chuyển động".

## 3. Bên ngoài nói gì

- **Chữ trên màn hình**: nguyên lý *dư thừa* (redundancy) của Mayer — chữ chép lại lời làm hại khi có hình động; ngoại lệ được nêu rõ là **thuật ngữ then chốt hoặc một câu tóm tắt ngắn hỗ trợ chứ không lặp lời**, ví dụ "schema = khung thông tin" ([U. Toronto OCW, Media design](https://ocw.utoronto.ca/video-strategies/media-design); [Adobe eLearning, 12 principles](https://elearning.adobe.com/2019/12/12-principles-of-multimedia-learning-relevant-to-video-from-richard-e-mayers-work)). Nguyên lý *báo hiệu* (signaling) dùng chữ đậm, mũi tên, màu để chỉ **cái then chốt** — không phải mọi thứ. Nguyên lý *huấn luyện trước* (pre-training): định nghĩa thuật ngữ trước khi đi vào cơ chế.
- **Tiếng**: kiểu "Mickey-mousing" — mỗi động tác một tiếng/nốt khớp đúng — bị coi là sáo và trẻ con từ thập niên 1950; Shamus Culhane: làm cả phim khớp từng nốt "sẽ máy móc và khó chịu" ([Wikipedia](https://en.wikipedia.org/wiki/Mickey_Mousing); [Animation Obsessive](https://animationobsessive.substack.com/p/hearing-what-you-see)). Lời khuyên nghề cho explainer: dùng hiệu ứng để nhấn **điểm then chốt**, "less is more" ([Venture Videos](https://www.venturevideos.com/insights/the-impact-of-sound-design-in-explainer-video-production)); nhóm làm phim phải chọn **những hình nào cần tiếng**, không phải mọi hình ([Lincoln coursework notes](https://aup3003-2324-jacep1.coursework.lincoln.ac.uk/?p=376), thứ cấp).
- **Dựng** (từ báo cáo 2026-11-02): cảm xúc và câu chuyện quyết định chỗ cắt (Murch); người dẫn có ích khi **chỉ vào đúng thứ đang nói** (Li và cs. 2024), còn đứng đó thì không; chi tiết hấp dẫn nhưng lạc đề làm hại (Kienitz và cs. 2023) — một nhãn hay một tiếng không mang thông tin là chi tiết lạc đề.
- Không tìm được số liệu kiểm chứng về tỉ lệ thời lượng người dẫn hay mật độ tiếng tối ưu. Các ngưỡng dưới đây lấy từ phim mẫu, không phải từ nghiên cứu.

## 4. Luật đề xuất

**Chữ — chỉ 5 loại, mỗi nhãn khai loại của nó (`kind`)**
1. `term` — thẻ thuật ngữ khi một khái niệm được giới thiệu lần đầu: tên + một dòng định nghĩa ("HIỆU ỨNG IKEA — quý thứ mình làm ra hơn giá trị thật của nó"). Ở lại ≥ 3 s, có thể gọi lại sau. 1–3 thẻ một tập.
2. `name` — tên người, vai, vật trong cảnh (bảng tên, nhãn dán lên vật), ở lại cùng cảnh.
3. `place` / `time` — biển nơi chốn, dấu thời điểm ("PHÒNG THÍ NGHIỆM · HARVARD 2011", "3 TUẦN SAU").
4. `number` — con số của một vật hoặc cột biểu đồ (không lặp lại số đã có trên cột).
5. `doc` / `stamp` — một tài liệu xuyên suốt đổi trạng thái (tờ "4 luật", phiếu giá bị gạch), một con dấu kết luận ở cú lật (≤ 1 mỗi hồi).

Cấm: nhãn là mẩu của câu đang đọc (động từ, tính từ, câu hỏi); nhãn dán lên mặt nhân vật; nhãn hiện rồi tắt trong vài giây. Ngân sách: trung bình ≤ 1 chữ mới mỗi 6–8 s. Bỏ luật "mỗi câu một tín hiệu".

**Tiếng — ba lớp**
1. **Nền** theo nơi chốn (luôn có, nhỏ).
2. **Mô-típ**: 1–2 tiếng gắn với vật xuyên suốt của câu chuyện (tiếng tua vít khi lắp kệ), lặp lại mỗi lần vật đó làm việc của nó.
3. **Nhấn**: chỉ ở chuyển cảnh, cú lật, nhịp "à", khi thẻ thuật ngữ hay biểu đồ hiện, câu đùa. Không có tiếng cơ thể (thở dài, gõ tay) trừ khi cận cảnh cho thấy.

Ngân sách: ≤ ~25 khoảnh khắc mỗi phút, ≥ 20 % cửa sổ 3 s không có tiếng hiệu ứng, trước cú lật có khoảng lặng thật. Nhãn `name`/`place` không có tiếng.

**Dựng**
- **Mỗi ý mới một shot** (3–8 s), cắt theo hành động; trong một nơi chốn vẫn đổi cỡ cảnh: toàn → trung → **cận vật đang được nói tới** (bàn tay đặt phiếu giá, chiếc hộp lắp dở). Cận cảnh thay cho nhãn: muốn người xem nhìn vào cái gì thì cho máy tới gần cái đó.
- Mỗi nơi chốn mới mở bằng một shot thiết lập có biển nơi chốn/thời điểm.
- **Người dẫn ở "nhà"**: mở phim, nối giữa các hồi, nhịp "à", kết — khoảng 25–40 % thời lượng. Thế giới câu chuyện chiếu toàn khung **không có người dẫn**, giọng người dẫn kể đè lên. Người dẫn được bước vào câu chuyện **một lần**, như một nhịp có chủ đích.
- Nhân vật của câu chuyện (người lắp kệ, người tham gia thí nghiệm) là người diễn chính trong thế giới, có hành động thật (lắp, gấp, trả tiền), không đứng im.
- Bỏ CHANNEL.md §7 "khối cảnh 20–50 s" và luật "cấm đổi cảnh sau mỗi câu".

**Cổng cần sửa**
- `check_board`: bỏ "mỗi câu một tín hiệu" và "≤ 2,5 s một nhịp"; thêm `kind` bắt buộc cho nhãn, từ chối nhãn trùng ≥ 2 từ liên tiếp với câu đang đọc (trừ `term`/`name`), ngân sách chữ và tiếng, ≥ 20 % cửa sổ yên lặng, cấm "Rối nói:" trong lời.
- `scenecheck`: tách tiếng vật khỏi tiếng đồ họa; đo khoảnh khắc tiếng/phút và cửa sổ yên lặng; đo số shot và tỉ lệ khung có người dẫn (`window.EV` khai `shot` và `host: true/false`).
- Chấm lời bằng một model khác, có danh sách: năm của nguồn, đơn vị tiền nhất quán, từ lạc nghĩa.
