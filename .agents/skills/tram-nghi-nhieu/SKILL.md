---
name: tram-nghi-nhieu
description: Phương pháp đạo diễn một tập phim hoạt hình 2D có lời dẫn cho kênh Trạm Nghĩ Nhiều — đạo diễn theo DIRECTOR.md (phim mẫu, ba cấu trúc, shot list có "vì sao", cue map) rồi dựng từ storyboard dữ liệu (board.json); câu chuyện có người của nó, chiếu toàn khung; người dẫn đóng khung ở nhà, bình luận từ góc hình hoặc cận mặt; mỗi ý mới một shot; chữ là thuật ngữ và tên; tiếng ở chỗ đáng nghe. Dùng khi làm bất kỳ tập nào của kênh.
version: 7.0.0
---

# Đạo diễn một tập Trạm Nghĩ Nhiều

Người xem **vừa nghe vừa nhìn mà hiểu ngay đang nói tới cái gì**, và xem hết không mệt. Thước đo là `films/host-toon-test` (đo trong `docs/research/2026-11-03-chu-tieng-dung/REPORT.md`):

- 24 shot trong 132 s, gần như mỗi ý một shot;
- người dẫn ở trong khung khoảng 1/3 thời lượng; còn lại là thế giới câu chuyện, có lúc người dẫn bình luận từ một vòng tròn ở góc hoặc một cú cận mặt;
- chữ trên hình toàn là **tên**: người, nơi, thời điểm, con số của vật, và một tờ tài liệu đổi trạng thái;
- 26 khoảnh khắc có tiếng mỗi phút; 1/5 thời gian chỉ có giọng và tiếng phòng.

Phim đó được làm bằng quy trình của **`DIRECTOR.md`**, và tập nào của kênh cũng đi đúng quy trình ấy. Skill này thêm phần riêng của kênh.

- **Cố định** (`channels/tram-nghi-nhieu/STYLE.md`): Kẻ Nghĩ Nhiều (người dẫn duy nhất, một giọng kể), nét, chữ, giọng, nhạc, phụ đề.
- **Tự do**: nơi chốn, ánh sáng, người trong câu chuyện, đạo cụ, đồ họa.

---

## 1. Quy trình

Mỗi bước xong khi điều kiện ở cuối bước đúng. Ghi tiến độ vào `NOTES.md` của tập sau mỗi bước: đã xong gì, đang ở đâu, quyết định nào đã chốt. Ngữ cảnh có thể bị nén giữa chừng, và `NOTES.md` là chỗ để làm tiếp.

0. **Thư mục.**
   - Tạo bằng `sh core/render/new_episode.sh tram-nghi-nhieu series/<cột>/<tập> "<Tiêu đề>"`.
   - Chạy `df -h .`; whisper `small` cần khoảng 0,5 GB.
1. **FACTS** → `research/FACTS.md`.
   - Mọi tuyên bố kèm nguồn: tác giả, **năm**, tạp chí, DOI hoặc link.
   - Điều không được nói quá.
   - Cơ chế, viết trong một câu.
   - Đơn vị gốc (xu, đô) ghi rõ; ví dụ đã Việt hóa thì ghi là đã Việt hóa.
2. **TREATMENT** → `TREATMENT.md`, theo `DIRECTOR.md` §2–§7, mỗi phần một heading:
   - `## Phim mẫu` — 1–2 tác phẩm *ngoài kênh* đặt chuẩn cho *chủ đề này* (kênh giải thích như Zack D. Films, OverSimplified, Kurzgesagt, TED-Ed, hoặc một phim, một quảng cáo). Mỗi tác phẩm có một dòng `Học:` (bố cục, nhịp, ngữ pháp máy, cách người dẫn bình luận) và một dòng `Không lấy:` (nhân vật, thiết kế, câu đùa, shot cụ thể).
   - `## Ba cấu trúc` — ba spine "<ai> muốn <X> ở <nơi>, nhưng <hiệu ứng> khiến <Y>, vì vậy <Z>", mỗi spine một gạch đầu dòng, rồi `Chọn: … vì …`.
   - `## Logline` — một câu, rồi mở → lật → kết. Nói rõ:
     - người của câu chuyện là ai;
     - nhà của người dẫn xuất hiện ở đâu;
     - nhịp "à" nằm ở đâu;
     - cách hiểu phổ biến nào sẽ bị lật lại.
   - `## Beat sheet` — theo từng giây. Với 3–5 nhịp khó, viết 4 phương án hình rồi loại phương án quen nhất.
   - `## Cue map` — nhạc đổi ở đâu, hai khoảng lặng ở đâu, hai chỗ tiếng làm chuyển cảnh (J-cut hoặc L-cut).
   - `## Âm thanh` — mỗi hồi: nền, mô-típ, tiếng nhấn.
   - `## Chấm lời` — ghi ở bước 5.

   Shot list, với cột *vì sao*, chính là `board.json` (bước 4).
3. **LINES** → `voice/lines.json`.
   - Khoảng 2,3 từ mỗi giây, viết từ beat sheet.
   - Viết như kể cho bạn nghe: câu ngắn, một ý một câu, số viết thành chữ.
   - Cả phim một giọng: mọi câu do Kẻ Nghĩ Nhiều kể, cùng một giọng, không đổi `pitch`/`rate`. Người trong câu chuyện diễn bằng hành động, không nói thoại.
4. **BOARD** → `board.json` (mục 3). Xong khi `python3 tools/check_board.py <tập>` PASS.
5. **CHẤM LỜI** bằng một agent *khác* (subagent hoặc task, nếu được thì model khác). Chỉ đưa cho nó `FACTS.md`, `lines.json` và `board.json`. Nó chấm:
   - (a) câu nào sai hoặc nói quá so với FACTS, nhất là năm, tên tác giả, đơn vị tiền, con số;
   - (b) cơ chế được giải thích đúng chưa, người chưa biết có hiểu không;
   - (c) câu đọc lên có tự nhiên không: từ lạc nghĩa, câu lặp ý, tên gọi không nhất quán;
   - (d) nhịp "à" có cho thấy cái mẹo không.

   Sửa hết, rồi ghi lỗi và cách sửa vào `## Chấm lời`.
6. **GIỌNG**: TTS → ASR → process (`CHANNEL.md` §3). Xong khi `check_board` PASS lại với `words.json` thật.
7. **LOOK** → `src/sets.js` của tập.
   - Mỗi vòng render 4–6 still bằng code thật (`node core/render/still.mjs <tập> <t…>`): nơi chốn, người của câu chuyện, một shot cận, thẻ thuật ngữ, một khung pip hoặc react.
   - Ghép chúng bằng `core/render/sheet.py` rồi xem tấm ghép, không mở từng ảnh 1920 px. Tìm lỗi cụ thể: tay đọc như ống, đạo cụ trôi khỏi tay, chữ chạm phụ đề, nơi chốn trống.
   - Ghi vào `LOOK.md` từng vòng (`## Vòng 1`…): still nào, `Thấy:`, `Sửa:`.

   Xong khi đã có ít nhất hai vòng và vòng cuối không còn lỗi.
8. **ANIMATE** → `src/film.js`, dựng từ board (mục 4).
9. **DỰNG + CỔNG**: `sh build.sh`, rồi `sh core/render/review.sh <tập>` phải exit 0. Cổng gồm treatment, board, scenecheck, readcheck, voice…
10. **XEM + NGHE.** Mở contact sheet và nghe lại cả phim, hỏi:
    - mỗi chữ có phải tên hay thuật ngữ không;
    - người dẫn có nhường khung cho câu chuyện không;
    - mỗi nơi chốn có ít nhất hai cỡ cảnh không;
    - mỗi tiếng có một vật trên hình làm ra nó không;
    - có lúc chỉ còn giọng và tiếng phòng không;
    - vật nào được nhắc tới cũng có trong cảnh không.

    Sửa board hoặc code, dựng lại.

---

## 2. Nguyên tắc

1. **Sự việc trước, lời sau.** Mỗi nhịp là *ai · làm gì · với vật gì · vật đổi ra sao*. Câu nào không gắn vào sự việc thì sửa câu.
2. **Câu chuyện có người của nó.** Một nhân vật của câu chuyện (không phải người dẫn) có mong muốn, ở một nơi cụ thể, và vấp phải hiệu ứng: chị Lan lắp kệ, cậu sinh viên trong phòng thí nghiệm. Thí nghiệm được dựng thành cảnh có người thật làm việc thật: lắp, gấp, trả tiền, viết giá.
3. **Người dẫn có bốn cách ở trên hình** (`host` của mỗi shot):

   | `host` | Là gì | Dùng khi |
   |---|---|---|
   | `desk` | ở nhà, góc riêng của Kẻ Nghĩ Nhiều | mở phim, nối giữa các hồi, gọi tên khái niệm, kết |
   | `scene` | bước vào thế giới câu chuyện, đổi trang phục hoặc cầm đạo cụ | một lần, như một nhịp có chủ đích |
   | `pip` | vòng tròn ở góc, đè lên câu chuyện đang chiếu (`hostPip`) | một lời bình, một cái liếc, trong khi câu chuyện vẫn chạy |
   | `react` | cắt vào cận mặt một nhịp rồi cắt ra (`reactClose`) | câu đùa, cái nhăn mặt, "khoan đã…" |
   | `none` | câu chuyện chiếu toàn khung, giọng người dẫn kể đè lên | phần lớn thế giới câu chuyện; cảnh trang nghiêm |

   `desk` cộng `scene` chiếm 15–45 % thời lượng; mỗi tập có ít nhất một `pip` hoặc `react`.
4. **Mỗi ý mới một shot**, dài 3–8 s, cắt theo hành động.
   - Nơi chốn mới mở bằng shot rộng, có biển nơi chốn hoặc thời điểm.
   - Trong một nơi, đổi cỡ: rộng → trung → **cận vật đang được nói tới**. Muốn người xem nhìn vào cái gì thì cho máy tới gần cái đó; cận cảnh làm việc của một cái nhãn.
5. **Máy chuyển động có lý do** (`cam` của mỗi shot, `BD.camera`):

   | `cam` | Lý do |
   |---|---|
   | `hold` | đọc số, đọc tài liệu |
   | `push` | đẩy chậm 2–4 % vào một ý, một khuôn mặt sắp hiểu ra |
   | `pull` | lùi ra để lộ quy mô ("và không chỉ mình chị") |
   | `track` | đi theo người đang đi, đồ vật đang trượt |
   | `pan` | lia dọc một dãy (kệ hàng, bản đồ, dòng thời gian) |

   Một tập dùng ít nhất ba kiểu, mỗi kiểu ghi rõ lý do trong `why`. Chuyển cảnh:
   - `cut` trong cùng nơi;
   - `iris` khi bước vào một nơi;
   - `prop` (bóng người, cánh cửa, trang sách che máy);
   - `light` (tắt đèn bàn, bật spotlight);
   - `whip` khi nhảy nơi chốn lớn hoặc nhảy mốc thời gian.
6. **Khoảnh khắc "à".** Ít nhất một nhịp (`"flags": ["aha"]`) cho người xem tự nhìn thấy cái mẹo: hai vật giống hệt mang hai giá khác nhau, một lựa chọn bị lộ là vô lý. Lời chỉ gọi tên điều người xem vừa thấy.
7. **Chọn hình theo loại thông tin**:

   | Thông tin là… | Hình đúng |
   |---|---|
   | một trải nghiệm, một quyết định | cảnh có người ở nơi chốn thật, cận vào tay hoặc mặt lúc quyết định |
   | so sánh độ lớn | hai vật đặt cạnh nhau có số trên vật, hoặc biểu đồ cột mọc đúng lúc nói (`chart: bars`) |
   | tỉ lệ | đám đông, một số người được tô sáng (`chart: people`) |
   | quy trình, nguyên nhân → kết quả | chuỗi hành động qua nhiều shot |
   | khái niệm | thẻ thuật ngữ ở nhà người dẫn, rồi một ẩn dụ vật lý: thước đo tự nâng lên khi vừa nhảy qua; chiếc cúp bị trùm khăn; 20 tấm bằng khen phủ bụi và một mẩu giấy cháy dưới đèn pin |
   | danh sách | các vật hiện lần lượt trong cảnh, mỗi vật đúng lúc được gọi tên |

8. **Chữ có bảy loại** (mỗi nhãn khai `kind`):

   | `kind` | Là gì | Ví dụ |
   |---|---|---|
   | `term` | khái niệm mới + một dòng định nghĩa (`def` ≤ 10 chữ). 1–4 thẻ một tập, ở lại lâu, gọi lại được | HIỆU ỨNG IKEA — quý thứ mình làm ra hơn giá trị thật |
   | `name` | tên người, vai, vật, chỉ vào vật (`to`) hoặc nằm trên vật (`on: true`) | "Nhóm tự lắp", "Giáo sư Norton" |
   | `place` / `time` | biển nơi chốn, dấu thời điểm | "ĐẠI HỌC HARVARD · 2011", "3 TIẾNG SAU" |
   | `number` | con số của một vật (giá trên phiếu) | "78¢" |
   | `doc` | tài liệu xuyên suốt của câu chuyện, đổi trạng thái | tờ hướng dẫn lắp, bảng giá bị gạch |
   | `stamp` | dấu kết luận ở cú lật, một lần mỗi cảnh | GẤP ĐÔI |

   - Nhãn là danh từ: tên của thứ đang ở trên hình.
   - Nhãn ở lại tới hết shot; cắt shot là khung sạch.
   - Trung bình một chữ mới mỗi 6 s hoặc thưa hơn.
9. **Tiếng có ba lớp, và phần lớn thời gian chỉ có lớp đầu.**
   - **Nền** theo nơi chốn (`amb`: `cafe`, `office`, `lab`, `street`, `night_city`, `hum`…), luôn có và nhỏ.
   - **Mô-típ**: 1–2 tiếng của vật xuyên suốt câu chuyện (tua vít lắp kệ, máy tính tiền), lặp lại mỗi lần vật đó làm việc của nó.
   - **Nhấn**: chuyển nơi chốn, cú lật, nhịp "à", thẻ thuật ngữ, biểu đồ, câu đùa.

   Nhãn tên, nơi, thời điểm hiện lên trong im lặng. Tiếng cơ thể (thở, gõ tay, sột soạt vải) thuộc về shot cận. Ngân sách: khoảng 25 khoảnh khắc mỗi phút, một phần tư số cửa sổ 3 s không có tiếng hiệu ứng, một khoảng lặng thật (`silence`) trước cú lật.
10. **Đường cong.**
    - Nhạc đổi theo hồi.
    - Lặng trước cú lật.
    - Có một chỗ thở ra trước khi kết.
    - Nối các nhịp bằng "nhưng / vì vậy".
    - Cái kết vọng lại cảnh mở: cùng đạo cụ, nhưng đã đổi trạng thái.
11. **Cách hiểu phổ biến, rồi lật lại.** Người dẫn tự nói cách hiểu mà ai cũng tin ("mình từng nghĩ…", "ai cũng bảo…"), và cảnh sau cho thấy điều thật sự xảy ra. Một cú `react` của người dẫn hợp với nhịp đó.

### Kỹ thuật của khung hình

Ba đồng hồ chuyển động:
1. **Thở và không khí**: nhân vật thở, mắt liếc, `ambientMotes`, đèn dao động nhẹ.
2. **Nhịp của câu**: ở mỗi từ quan trọng của câu, hình phản hồi bằng diễn xuất hoặc đạo cụ. Đó là các nhịp của board.
3. **Biến hình**: trong một cảnh, vật đổi dạng mượt từ A sang B theo dòng ý.

Chữ và nét:
- Số liệu ≥ 72 px, đậm 900; tiêu đề phụ ≥ 44 px; chú thích ≥ 28 px.
- Nét sơ đồ và mũi tên ≥ 5 px.
- Nội dung có chủ đích phủ 50–70 % khung.
- Chữ viết dần hiện bằng `revealText` (`rig/broll.js`), để ký tự hiện đúng lúc được đọc.

Con số và kết luận:
- Con số hiện khi thanh đo đã tới giá trị đó.
- Kết luận hiện khi giọng đọc tới nó.
- Gạch đỏ vẽ dưới lớp chữ.
- Kết luận tương quan dùng từ mức độ ("thường", "dễ hơn"), đúng như FACTS.

Phụ đề:
- Mỗi lúc vẽ một mảnh phụ đề, mảnh đang tích cực nhất.
- Mảnh trước kết thúc trước mảnh sau ít nhất 0,04 s.
- Mỗi mảnh ≤ 58 ký tự.

Lớp phủ: `applyPaperTexture` và `renderGrainFx` (`rig/styles.js`) phủ lên mọi khung.

---

## 3. board.json — storyboard là dữ liệu

```json
{
  "ink": "#1D202A",
  "palette": { "term": { "color": "#F2A541", "name": "khái niệm" } },
  "scenes": [
    { "id": "nha_lan", "place": "phòng khách nhỏ của chị Lan, sàn gỗ, đèn trần vàng",
      "light": "đèn vàng ấm từ trên, ngoài cửa sổ trời tối",
      "cast": ["extra:lan"], "lines": ["h1", "h2", "h3"],
      "in": { "tr": "iris", "sfx": "iris_open" }, "amb": "night_city", "music": "A",
      "shots": [
        { "id": "lan_wide", "size": "wide", "host": "none", "cam": "push", "focus": [960, 640],
          "subject": "chị Lan ngồi giữa đống ván gỗ", "why": "thiết lập nơi chốn và quy mô của việc lắp" },
        { "id": "lan_tay", "at": "h1@tua", "size": "insert", "host": "none", "cam": "hold",
          "subject": "bàn tay vặn tua vít vào ván", "why": "công sức là thứ hiệu ứng đo, nên cho thấy bàn tay" },
        { "id": "ke_xong", "at": "h2@cái", "size": "medium", "host": "pip", "cam": "pan", "move": [-120, 0],
          "subject": "cái kệ nghiêng đứng cạnh chị Lan", "why": "lia dọc cái kệ để thấy nó lệch; người dẫn liếc từ góc" },
        { "id": "lan_mat", "at": "h3@nếu", "size": "close", "host": "none", "cam": "push",
          "subject": "mặt chị Lan lắc đầu, ôm kệ", "why": "quyết định không bán nằm trên khuôn mặt" } ],
      "beats": [
        { "id": "b_gio", "at": "h1@chín", "who": "extra:lan", "do": "chị Lan cầm tờ hướng dẫn lên xem",
          "label": { "kind": "time", "text": "21:00", "xy": [1700, 90] } },
        { "id": "b_vit", "at": "h1@tua+0.2", "who": "extra:lan", "do": "tay chị vặn tua vít vào lỗ ván",
          "sfx": { "type": "plastic_click", "cause": "tua vít ăn vào gỗ" } },
        { "id": "b_dung", "at": "h2@đứng", "who": "extra:lan", "do": "chị Lan buông tay, cái kệ tự đứng",
          "change": "kệ nghiêng nhẹ sang trái", "sfx": { "type": "wood_set", "cause": "chân kệ chạm sàn" } },
        { "id": "b_om", "at": "h3@không", "who": "extra:lan", "do": "chị Lan lắc đầu, vòng tay ôm kệ" } ] },

    { "id": "nha_host", "place": "góc đọc sách của Kẻ Nghĩ Nhiều, kệ sách và đèn bàn",
      "light": "đèn bàn vàng bên phải, nền tối ấm",
      "cast": ["host"], "lines": ["k1", "k2", "k3"], "amb": "hum", "music": "B",
      "silence": { "at": "k1@start-0.6", "d": 0.8 },
      "shots": [
        { "id": "host_wide", "size": "wide", "host": "desk", "cam": "hold",
          "subject": "Kẻ Nghĩ Nhiều bên bàn, cầm ảnh cái kệ", "why": "về nhà để gọi tên điều vừa thấy" },
        { "id": "host_react", "at": "k3@start", "size": "close", "host": "react", "cam": "hold",
          "subject": "mặt Kẻ Nghĩ Nhiều nhăn lại, nghi ngờ", "why": "cách hiểu quen thuộc nghe xuôi tai, khuôn mặt báo nó sắp bị lật" } ],
      "beats": [
        { "id": "b_ten", "at": "k1@hiệu", "who": "host", "do": "Kẻ Nghĩ Nhiều ghim tấm thẻ lên bảng", "flags": ["aha"],
          "label": { "kind": "term", "text": "Hiệu ứng IKEA", "def": "quý thứ mình làm ra hơn giá trị thật", "xy": [80, 90] },
          "sfx": { "type": "paper_slide", "cause": "thẻ giấy ghim lên bảng" } },
        { "id": "b_chi", "at": "k2@giá", "who": "host", "do": "Kẻ Nghĩ Nhiều chỉ tay vào chữ giá trị" },
        { "id": "b_nhan", "at": "k3@thương", "who": "host", "do": "Kẻ Nghĩ Nhiều nheo một mắt, nhếch môi" },
        { "id": "b_lac", "at": "k3@end", "who": "host", "do": "Kẻ Nghĩ Nhiều lắc đầu chậm rãi" } ] }
  ]
}
```

Phần lớn nhịp chỉ có `who` và `do`: diễn xuất, không chữ, không tiếng. Luật (check_board kiểm hết):

**Lời và neo**
- Các `lines` của các cảnh nối lại đúng bằng `lines.json`, theo thứ tự.
- `at` viết là `"<line>@<từ>"`, `"…@<từ>+0.2"`, `"…@<từ>#2"`, `"…@start"` hoặc `"…@end"`; từ phải có trong câu.
- Shot đầu của cảnh mở cùng cảnh.

**Shot**
- `size` là `wide`, `medium`, `close` hoặc `insert`.
- `host` là `desk`, `scene`, `pip`, `react` hoặc `none`.
- `cam` là `hold`, `push`, `pull`, `track` hoặc `pan`; thêm `focus` hoặc `move` khi cần, và `amount` cho push/pull.
- `subject` và `why`, mỗi cái ≥ 3 chữ.
- Mỗi shot ≤ 12 s, trung bình ≤ 8 s.
- Cảnh mới mở bằng `wide`, trừ khi có `"same_place": true`.
- ≥ 20 % shot là close hoặc insert.
- `desk` cộng `scene` chiếm 15–45 % thời lượng; có ≥ 1 `pip` hoặc `react`; có ≥ 3 kiểu `cam`.

**Chữ**
- Mỗi nhãn có `kind`.
- `term` có `def` ≤ 10 chữ; mỗi tập 1–4 thẻ `term`.
- `name` có `to` hoặc `on`.
- Nhãn mang từ của riêng nó, không lặp hai từ liền nhau của câu đang đọc (trừ term và name).
- ≤ 5 chữ, không có dấu hỏi.
- Nằm trên vạch phụ đề (y ≤ 860).
- ≤ 1 `stamp` mỗi cảnh.

**Tiếng**
- Tên tiếng có trong `core/audio/foley.py` hoặc trong FX của `mix.py`, và có `cause`.
- Tiếng đồ họa (`label_in`, `bar_grow`…) chỉ đi với term, doc, stamp hoặc biểu đồ.
- Tiếng cơ thể chỉ trong shot cận.
- ≤ 3 tiếng trong một giây; ≤ 25 khoảnh khắc mỗi phút; ≥ 25 % cửa sổ 3 s yên.
- Ít nhất một `silence`.

**Kênh** (`board_rules.json`): ≥ 1 nhịp `flags: ["aha"]`; một giọng cho cả phim (không câu nào đổi `voice`, `pitch`, `rate`).

---

## 4. Dựng phim từ board

```js
import { loadBoard } from '../../../../rig/board.js';
import { hostPip, reactClose } from '../../../../rig/host.js';
import { extra, crowd } from '../../../../rig/extras.js';
// trong setup(), sau khi có TL (timeline) và words:
const BD = await loadBoard('board.json', TL.L, words);
EV.push(...BD.events());              // tiếng của board + dấu {type:'shot'} ở mỗi lần cắt
// trong render(T):
const sh = BD.shot(T);                // {id, size, host, cam, subject, scene, t0, t1}
if (sh.host === 'react') reactClose(g, T, { at: sh.t0, E: 'skeptical', talk: talkAt(T) });
else {
  g.save(); BD.camera(g, T);          // push / pull / track / pan của shot, êm ở hai đầu
  SHOTS[sh.id](g, T, sh);             // mỗi shot một hàm vẽ khung của nó: nơi chốn + cỡ cảnh + người + đạo cụ
  g.restore();
  if (sh.host === 'pip') hostPip(g, T, sh, { corner: 'br', E: 'smug', talk: talkAt(T) });
}
BD.signals(g, T);                     // thẻ thuật ngữ, nhãn, biển, con dấu, biểu đồ của shot này; tự đăng ký TEXTS
```

- **Nơi chốn**: một nơi vẽ một lần trong `src/sets.js`. Các shot của nó là các khung khác nhau của cùng nơi đó: `g.translate/scale` vào vùng của vật, hoặc một hàm vẽ cận riêng cho vật.
- **Shot cận vẽ trọn chủ thể của nó**: cả khuôn mặt, cả bàn tay với vật đang cầm, đặt giữa khung. Phóng to shot rộng thì sẽ được một thân người mất đầu hoặc một nửa khuôn mặt ở mép hình.
- **Hình khớp với board**: người dẫn chỉ được vẽ trong shot có `host` khác `none`. `figure`, `hostPip` và `reactClose` tự ghi vào `window.SEEN`, và `scenecheck` so từng khung với board.
- **Nhịp**: chuyển động neo vào thời điểm của chính nó. `BD.u('b_vit', T, .5)` chạy 0 → 1 trong 0,5 s kể từ từ "tua".
- **check_board** kiểm rằng `film.js` gọi tên mọi cảnh, ≥ 85 % shot và ≥ 70 % nhịp có người diễn.

---

## 5. Rig của kênh

| File | Có gì |
|---|---|
| `rig/character.js` | `figure` (Kẻ Nghĩ Nhiều: `E`, `armL`/`armR`, `legs`, `talk`, `blink`, `battery`, `s`, `crop`), `expr`/`EXPR`, `PAL` |
| `rig/host.js` | `hostPip(g, T, sh, {corner, r, E, talk})` (vòng tròn ở góc, bật vào lúc cắt), `reactClose(g, T, {E, talk, at})` (cận mặt toàn khung) |
| `rig/extras.js` | `extra(g, {x, y, s, look, E, gaze, turn, armL, armR, at, talk, blink, sit, t})`: người của câu chuyện, có mặt và hai tay (`down point hold wave hip up chin cross reach open`); trả về vị trí tay để gắn đạo cụ. `LOOKS`: shopper, researcher, participant, seller, elder, student, office, doctor. `crowd(g, {n, cols, box, hot, dim})` |
| `rig/board.js` | `loadBoard`, `BD.t/u/scene/shot/camera/signals/events` (mục 4); vẽ `term` (thẻ), `stamp` (dấu), `name/place/time/number/doc` (nhãn), biểu đồ |
| `rig/hands.js` | `GEST`: tư thế tay của Kẻ Nghĩ Nhiều |
| `rig/motion.js` | `spring`, `anticipate`, `squash`, `wiggle`, `particlePuff`, `irisTransition`, `occlusionWipe` |
| `rig/broll.js` | `text` (đăng ký vào `TEXTS`), `revealText`, `stamp`, `bubble`, `focusLines`, `subtitle`, `tag`, `irisWipe`, `ambientMotes` |
| `rig/sets.js` | vài bối cảnh mẫu (`roomBack`, `roomFront`, `sofa`, `street`, …), `person` |
| `rig/cel.js`, `rig/styles.js` | hình học cel; giấy và hạt phim (`applyPaperTexture`, `renderGrainFx`) |
| `core/audio/foley.py` | 78 tiếng theo chất liệu và cử chỉ + 10 nền không khí (`.venv/bin/python core/audio/foley.py` liệt kê) |

Mỗi tập viết `src/sets.js` cho các nơi chốn của nó và các đạo cụ có trạng thái, và import rig của kênh bằng đường dẫn tương đối.

---

## 6. Quy mô theo thời lượng

| Thời lượng | Số câu trong `lines.json` | Nơi chốn | Shot |
|---|---|---|---|
| Shorts 60–90 s | 16–22 | 2–4 | 12–20 |
| 3–5 phút | 35–50 | 6–10 | 30–55 |
| 8–10 phút | 80–110 | 12–16 | 70–110 |
| 15–20 phút | 150–200 | 20–30 | 130–200 |

Thời lượng đến từ lượng kiến thức. Không có thời lượng thì mặc định 3–5 phút. Tập dài sinh `src/timeline.js` bằng `mk_timeline.py` (`CHANNEL.md` §4b).

---

## 7. Bàn giao

- `review.sh` exit 0, kèm `.mp4`, `poster.jpg` và `.transcript.srt`.
- `TREATMENT.md` có đủ các phần, trong đó có `## Chấm lời`.
- `LOOK.md` có các vòng soi hình; `NOTES.md` ghi tiến độ.
- Phim kết bằng một hành động nhỏ người xem làm được ngay, **được diễn ra trong cảnh**.
