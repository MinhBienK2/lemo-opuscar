VERDICT: REJECTED
ROUND: 1/3
OVERALL_SCORE: 8/10

## ĐÁNH GIÁ CHẤT LƯỢNG SẢN PHẨM
- Âm thanh & Lồng tiếng: Đạt chuẩn
- Hình ảnh & Hiệu ứng Three.js: Còn lỗi render
- Giá trị truyền tải khoa học: Rõ ràng, dễ hiểu

---

## 1. ÂM THANH & POLISH (chỉ xét qua những con số máy đo được)

**Mức độ lớn.** `FILM-FACTS.md`: trung bình −16.4 dB, đỉnh −3.8 dB. Đỉnh còn ~3.8 dB dự phòng ⇒ **không có chặn (clipping)**, mức trung bình −16.4 dB là mức thoải mái trên loa điện thoại. Hệ số đỉnh (crest) 12.6 dB là của một bản trộn dày, không phải của một bản trộn có khoảng trống. Nhạc nền không lấn át giọng: lớp voice gần như liên tục (60 câu, khoảng trống lớn nhất giữa hai câu ≈ 3.4 s) nằm trên một nền ambience + nhạc không bao giờ ngắt; không có dấu hiệu đo được nào của hiện tượng giọng bị chôn (không chặn, không có khoảng lặng kỹ lưỡng).

**Chỗ im lặng.** Không có đoạn nào im lặng quá 4 s. Tôi đối chiếu `events.json`: 8 đoạn ambience (0–9.6, 9.6–27.6, 27.6–40, 40–56.1, 56.1–107.5, 107.5–149.3, 149.3–161.1, 161.1–173.6) và 8 cue nhạc (A–G + `end`) phủ **liên tục toàn bộ 176.4 s**, không hở một khoảng nào. ⇒ **Không có cảnh nào bị im lặng vô lý.**

**Foley.** Lưu ý số liệu: `FILM-FACTS.md` ghi "foley 83", nhưng 83 = 60 `mark` (dấu nhịp thuyết minh) + **23 sự kiện tiếng động thật**. Tôi đã đối chiếu cả 23 sự kiện với hành động nhìn thấy trên màn hình, và **mọi hành động va chạm đều có tiếng**:

| t (s) | hiệu tượng | hành động nhìn thấy |
|---|---|---|
| 3.2 | cloth_rustle | áo ướt trên dây, vải bay |
| 9.55 / 9.9 | switch / whoosh | mở cửa, máy đẩy vào phòng kín |
| 29.8 | blip_down | giọt nước trên vải |
| 35.6 / 44.7 | blip_up | hạt hơi nước tách khỏi giọt |
| 56.5 / 57.6 | cloth_rustle / impact_soft | tay chạm vải rồi rút |
| 65.7 / 70.5 | whoosh_soft / whoosh | lớp hơi ẩm bám lên, rồi đặc lên |
| 86.9 / 89.9 / 99.9 | whoosh_soft / whoosh_hard / whoosh_soft | gió quét lớp ẩm, gió mạnh hơn, gió thổi một bên giọt nước |
| 107.7 / 128.6 | blip_up | máy tới gần từng đồ đo trên tường |
| 136.7 / 140.5 / 161.3 / 167.9 | cloth_rustle | đàn áo chồng, áo úp, áo đã khô, hiên cuối |
| 148.4 | impact_soft | giọt nước rơi từ mép khăn |
| 149.3 | switch | nhìn qua cửa vào phòng kín |
| 155.6 / 155.8 | switch / whoosh | bật quạt, luồng gió thổi qua bàn tay |

**Kết luận âm thanh: đạt chuẩn.** Không cần cân bằng lại dB.

---

## 2. HÌNH ẢNH & ĐỘ MƯỢT RENDER

Tôi đã đo **toàn bộ 4234 khung** của file mp4 (H.264 High / yuv420p / 1920×1080 / 24 fps / 176.42 s / 16.9 Mbps, giải mã không lỗi), không chỉ 35 khung trong `frames/`.

- **Không có khung đen:** YMIN thấp nhất toàn phim = 17 (0–255). Không có khung nào mất hình.
- **Không có nhấp nháy ánh sáng:** YDIF trung bình trong các nhát = 1.28, p99 = 11.6. Mọi khác biệt lớn đều trùng khớp một **điểm cắt cảnh** hoặc một cú máy quét nhanh, không có chu kỳ sáng/tối lặp. Không nhấp nháy.
- **Không có khung cháy trắng toàn cục:** YAVG cao nhất = 151.5. Sáu đoạn có YMAX ≥ 250 (tổng 18.3 s) là vùng nắng trời/áo trắng — đúng ngôn ngữ toon, không làm cháy khung.
- **Không có khung bạc màu (đây là điều tôi săn nhiều nhất):** SATAVG dao động 3.4–31.6, không bao giờ mất màu; các khung có độ tương phản thấp nhất đều thuộc cảnh mặt nước N3 — chúng **tối**, không phải trắng nhạt đều. Tôi đã đo tay các vùng: áo ướt ở 0:07 sáng 220 luma trên nền tường 153–168, với dải tối 87 luma bên trái và nền sàn 124 luma — vật chính tách được khỏi nền.
- **Viền mực (ink outline):** sắc, đều, có trên mọi vật (áo, quạt, bàn, ghế, gạch, đồng hồ, cân, mặt kính). Ổn định.
- **Phụ đề:** đối chiếu với `lines.json` bằng so khớp từng từ: **635/635 từ, đúng thứ tự, không thiếu không thêm**; đồng bộ với `.srt` đến từng khung.

### ❌ LỖI RENDER KỸ THUẬT — nhát c27 (khoảng 1:20.5 – 1:25)

Đây là lý do tôi không xuất bản lần này.

Ở nhát `c27` ("gió quét lớp ẩm đi"), **góc dưới–bên phải khung hình bị chiếm bởi một khối hình màu xanh navy đậm**: các mặt phẳng cứng sắc cạnh chồng lên nhau, một lỗ hình tam giác xuyên thủng, một sừng nhọn mảnh như kim chạy chéo ra ngoài khung, và một mảnh vụn nằm dẹp trên sàn. Khối này:

- **đứng yên** suốt ~4 s (đã dò từ 78.5 s đến 85.5 s: hình dáng y hệt nhau ở 80.5 / 81.5 / 82.5 / 83.0 / 84.0 / 84.4 s), nên không phải vật đang bay hay đang đung đưa;
- **không có viền mực**, trong khi mọi vật khác trong phim đều có;
- **không được chiếu sáng** như tường hay sàn đứng cạnh;
- **không khớp với bất kỳ vật nào** mà `TREATMENT.md` đặt trong căn phòng kín (quạt bàn, bàn thấp, hai áo, bàn thí nghiệm, hai cân, ghế, đồng hồ, hai mặt kính + vách ngăn, túi nylon) — tôi đã đối chiếu tọa độ từng vật trong `src/set.js` với vị trí máy của nhát này;
- hiện ra **ngay ở kích thước thật 1920×1080** (đã cắt từ chính mp4, không phải từ ô nhỏ trong tờ), nên đây không phải ảo giác của thu nhỏ.

Người xem ở 1:21–1:25 sẽ thấy một mảng vụn hình học vô nghĩa chiếm ~1/4 khung hình, ngay trong nhát có nhiệm vụ cho thấy gió quét lớp hơi ẩm đi. Đây là **"vỡ hình"** — lỗi render kỹ thuật, không phải lựa chọn ngôn ngữ.

Cùng nhát đó còn có **một quầng sáng cháy trắng** (lõi 255 thuần, ~0.36 % diện tích khung, có hào quang) ngay trên dây phơi, phía trên chiếc áo tối; nó không che vật chính nhưng kéo mắt người xem ra khỏi chỗ cần nhìn.

### Các lỗi nhỏ khác (không chặn, nhưng nên sửa luôn)

1. **0:22** — nhãn "KHÔNG CÓ GIÓ" bị cắt bởi mép trên khung; trong nhát so sánh hai cái áo, chỉ cái "TRƯỚC QUẠT" còn nhãn (thông tin đã được nói lúc 0:17 nên người xem vẫn hiểu).
2. **1:58** — số "hai mươi" (20 g/kg) bị cắt làm đôi qua hai câu phụ đề liền nhau: câu 54 kết bằng "…tối đa khoảng **hai**", câu 55 (0.94 s) là "**mươi** gam hơi nước." Trong một khung hình đứng, người xem thấy "mươi gam hơi nước" — vừa cụt vừa đối lập với nhãn "20 g/kg" đang in trên màn hình. Nên giữ "hai mươi" trong một câu.
3. **0:32–0:37** — cận cảnh sợi vải đọc ra như một tấm bìa phẳng có vân in, không thấy sợi đan qua nhau; nhãn "KHE GIỮA SỢI" chỉ vào mặt sợi chứ không vào khe, và khe giữa hai sợi hiện là một dải xám phẳng, không có mặt nước. Lời kể nói nước nằm ở khe, hình chưa nói được điều đó.
4. **0:12 / 0:27 / 0:68** — bố cục hơi rỗng: một mảng tường phẳng chiếm 45 % khung (0:12), một vùng tối trống 35 % khung (0:27), và 60 % khung là trần trơn (0:68).
5. **2:18** — nhãn "CHỒNG LÊN NHAU" chỉ vào một cái áo đang treo cạnh chiếc khác trên cùng dây, chưa thật sự "chồng lên nhau".
6. **2:53** — hình kết theo `TREATMENT.md` phải là **một cái áo úp còn ẩm trên sàn**, nhưng dựng lại thành **hai cái bàn gỗ với bốn món quần áo trải trên đó**. Sự đối lập "chồng" vs "phơi rộng" vẫn đọc được, nhưng hình không còn là hình mà lời khuyên nói.
7. **0:42** — sợi vải cắt ngang mặt nước có màu nâu và dạng như cành khô, không giống sợi bông (màu kem như ở 0:32).

*(Ghi chú cho vòng sau: các "vệt răng cưa" ở ranh giới ướt–khô trên áo, "mặt kính xanh có mép cứng" ở 0:63, và "lớp hơi ẩm biến mất" ở 1:18 đã được kiểm lại ở kích thước thật và ở số đo: chúng là gradient mềm có răng nhỏ, là viền mực của áo, và là bố cục nhìn lên khe không khí đúng như `LOOK.md` yêu cầu — **không phải lỗi**.)*

---

## 3. TÍNH CHÍNH XÁC KHOA HỌC & THÔNG ĐIỆP

**Câu hỏi mở:** "Vì sao phơi quần áo cần gió?" (0:09).

**Câu trả lời có trọn vẹn không?** Có. Ba tầng nối nhau đều có hình và đều khớp `FACTS.md`:
1. *Nước phải hoá hơi, và bay hơi lấy nhiệt của vải* → nhiệt kế 25 °C, cột hơi nước, mặt nước, nhãn "HƠN 2 KJ / 1 G" (0:42–1:03).
2. *Hơi nước cần chỗ trống để đi* → lớp hơi ẩm bám vải, dải bão hoà xanh (1:16), rồi bị gió quét (1:21).
3. *Gió chở lớp ẩm đi* → quạt, vệt gió, thẻ "BỊ QUẾT ĐI", "Gió chở hơi nước đi" (1:27–1:33).

**Kết:** c56–c58 trả lời thẳng câu hỏi ("Quần áo khô vì nước phải đi được / Gió chỉ làm cho nước có chỗ để đi"), rồi c59–c60 đưa lời khuyên. Hình mở (hiên buổi sáng, áo ướt nhỏ nước) và hình kết (hiên, quần áo đã khô) khớp nhau.

**Mọi con số trên màn hình đều đúng nguồn, tôi đã kiểm từng cái ở kích thước thật:**
- Nhiệt kế 25 °C (1:55–2:01) và 30 °C (2:03–2:08) — khớp `FACTS.md` §1–§3.
- Ẩm kế: vòng trong là **thang g/kg**, vòng ngoài là % — nhãn "20 g/kg" chỉ đúng mức tối đa ở 25 °C (`FACTS.md` §2 + suy luận của tập phim), và "90 %" ở 2:09 khớp c46. Thẻ "× 5" ở 2:08 khớp "chậm hơn khoảng năm lần".
- "HƠN 2 KJ / 1 G" khớp nhiệt ẩn 2,44 kJ/g; nhãn "GÓC XA"/"HAI CÂN" và "NƯỚC PHẢI ĐI ĐƯỢC" đọc rõ ở 1:38 và 2:43.
- **Không có giá trị nào trong danh sách "không được nói" xuất hiện**: không có thời gian khô cụ thể, không có "hai phần ba / ba phần tư", không có nhiệt độ nguội của vải, không có "gió gấp đôi thì quần áo khô gấp đôi" (c31 chỉ nói "lớp ẩm bị quét xa hơn / nước bốc hơi nhanh hơn" — đúng phép nói mà `FACTS.md` cho phép), và không có "không khí ẩm 90 % thì không khô được".
- C37 ("không có gió thì tốc độ bay hơi rơi còn một nửa") và c46 ("cùng một luồng gió…") dùng **đúng câu chữ** mà `FACTS.md` §4 và §3 cho phép, kèm điều kiện "cùng một luồng gió".

**Giá trị truyền tải: rõ ràng, dễ hiểu.** Người xem không cần biết trước gì cả; hai thí nghiệm (hai cái cân lệch kim, hai giọt nước một bên có gió) và một đối lập rất trực quan (áo trước quạt nhạt dần, áo góc xa vẫn sẫm) làm cho câu trả lời tự nói lên.

---

## 4. CỔNG MÁY (`gate.py`)

Đã chạy `gate.py need` trên tập `series/do-vat/tap-01-phoi-quan-ao`:

| Tem | Trạng thái |
|---|---|
| outline | PASS — còn hiệu lực |
| script | PASS — còn hiệu lực |
| props | PASS — còn hiệu lực |
| storyboard | PASS — còn hiệu lực |
| assets | PASS — còn hiệu lực |
| picture | PASS — còn hiệu lực |
| **final** | **chưa có PASS** — đúng như mong đợi: chính bản báo cáo này là thứ đóng tem đó |

`gate.py need … picture` → exit 0 (cả sáu tem trên còn hiệu lực, đủ điều kiện render). `gate.py need … final` → exit 1, lý do "chưa có PASS".

**Hai lưu ý cho vòng sau:**
- `OUTLINE.pass` in cảnh báo "chấm một dàn ý khác với hiện tại (đã sửa sau lần PASS)" — `TREATMENT.md` trên đĩa đã được sửa sau khi tem dàn ý đóng. Cổng cố ý không mở lại tem này (dàn ý là bản kế hoạch, không phải phim), nhưng bản chấm không nói về dàn ý đang dùng.
- Tem `final` gắn vào chính file mp4 (theo kích thước + hash của file), nên chỉ đóng được sau khi phim được dựng lại và **không đổi** so với file đã dựng.

---

## KẾT LUẬN CUỐI CÙNG

**Không xuất bản vòng này.**

Lý do: một lỗi render kỹ thuật thật, chứ không phải lỗi thẩm mỹ — nhát `c27` (1:20.5–1:25) có khối hình học vỡ (mặt phẳng sắc cạnh, lỗ tam giác, sừng kim nhọn, mảnh vụn trên sàn) chiếm ~1/4 khung hình, đứng yên, không có viền mực, không khớp vật nào trong bối cảnh. Cùng nhát còn một quầng sáng cháy trắng. Điều kiện xuất bản của bước nghiệm thu là "≥ 9/10 **và không có lỗi render kỹ thuật**" — điều kiện thứ hai không thỏa, dù điều kiện thứ nhất gần thỏa.

Ngoài ra còn 7 lỗi nhỏ đã liệt kê ở mục 2 (nhãn bị cắt ở 0:22; số "hai mươi" bị cắt đôi trong phụ đề ở 1:58; cận sợi vải chưa đọc ra sợi đan ở 0:32–0:37; ba bố cục rỗng; nhãn "CHỒNG LÊN NHAU" chưa đúng nghĩa; hình kết dựng trên bàn thay vì trên sàn; sợi vải ở 0:42 có màu như cành khô).

**Phần đã đạt và cần giữ nguyên:** toàn bộ hình ảnh còn lại sạch — không khung đen, không nhấp nháy, không khung cháy trắng, không khung bạc màu; viền mực sắc và đều; phụ đề đủ 635/635 từ và đồng bộ; âm lượng ở mức nghe tốt trên loa điện thoại, không chặn, không có cảnh im lặng, và **mọi hành động va chạm trên màn hình đều có tiếng**; toàn bộ khoa học đúng nguồn và không vi phạm danh sách giá trị cấm; câu hỏi mở được trả lời trọn vẹn.

**Việc cần làm để qua vòng sau (theo thứ tự ưu tiên):**
1. Dựng lại nhát `c27` (`src/film.js`, `sh('N4','c27', …)`) — hoặc dời máy, hoặc dựng lại vật ở góc phải — để khối hình vỡ không còn lọt vào khung; kiểm lại ở 1:20–1:26.
2. Hạ độ chói của quầng sáng trên dây phơi ở cùng nhát.
3. Giữ "hai mươi" trong một câu phụ đề (1:58) và chỉnh nhãn "KHÔNG CÓ GIÓ" cho nằm trong khung ở 0:22.
4. Các lỗi nhỏ còn lại trong mục 2 nếu còn thời gian dựng.

Sau khi dựng lại, chạy lại `review.sh <tập> --final`: tem `final` sẽ đóng khi bản báo cáo này (đã sửa) nói `VERDICT: ACCEPTED_FOR_PUBLISH`.

---
Người chấm: claude -p (model mặc định của claude) · review.sh --final · 2026-11-09 16:31
