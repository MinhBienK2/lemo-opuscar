VERDICT: REJECT
ROUND: 5/5
SCORES: BỐ_CỤC=3 ÁNH_SÁNG=3 GÓC_MÁY=3

Điểm trung bình = (3 + 3 + 3) / 3 = **3.0** < 4.0 → **không đạt điều kiện PASS về điểm**.
Điều kiện PASS còn lại ("không cảnh nào bị che khuất vật chính") cũng **không đạt**: c54 và c55 bị **túi nylon trong phòng** đè thẳng lên bàn tay, c4 cắt mất áo phải, c38 cắt mất đàn áo, c41/c42/c46 có **vệt phản chiếu của mặt kính ẩm kế** (`shine` trong `src/props.js:1050`) đọc như một mảnh bìa trắng đè lên vạch 20 và 0, c45 có thẻ `30 °C` **chỉ vào vạch 50 °C**.

Nội dung soi: 5 tờ nhịp (`review/beatsheet/sheet_1…5.jpg`, 60 khung, đúng mốc `voice/proc/dur.json`) + **60 khung chụp lại** bằng `core/render/still.mjs` ở đúng 60 mốc `t` trong `review/beatsheet/beats.json` (4.6, 8.16, 12.29, 15.9, 19.2, 22.78, 26.19, 28.55, 30.72, 33.95, 37.25, 40.01, 42.78, 45.16, 47.85, 50.41, 53.14, 55.15, 58.13, 60.76, 63.76, 67.51, 70.21, 73.24, 76.72, 79.24, 82.75, 85.65, 87.51, 88.85, 91.23, 93.26, 96.52, 98.96, 100.88, 103.41, 106.19, 108.87, 111.45, 114.14, 117.47, 120.15, 121.88, 124.26, 127.02, 131.29, 135.02, 138.94, 142.1, 145.49, 148.17, 151.47, 154.34, 157.36, 159.95, 162.63, 164.77, 166.75, 169.53, 172.37), cùng mã nguồn `src/film.js` (bảng `SHOTS`, `LABELS`, `FOCUS`) và `src/props.js`. Đối chiếu `LOOK.md`, `channels/tram-nghi-nhieu/STYLE.md`, `review/STORYBOARD-REVIEW-4.md`.

Máy đo nhịp: `beats.json` đúng là **không còn cờ nào**. Nhưng cờ đó chỉ so histogram sáng và màu, nên vẫn bỏ sót — lần này tôi tự so bằng mắt và đo thêm: **c10 ↔ c11 đã khác thật** (một bên là tấm đan, một bên là hai tấm nghiêng + que xanh), nhưng **c10 đọc thành rổ tre**, không phải vải; và nhóm "mảng vải kem chiếm gần hết khung" của vòng 4 **vẫn còn nguyên ở c2, c22, c26, c48** (c26 là 100 % khung là vải).

## NHẬN XÉT CHI TIẾT THEO CẢNH

### Ba khung hình hero

- [Hero 1 · c1 · t=4.6 · "Quần áo ướt treo trên dây, nước vẫn còn đó"]:
  - Bố cục: **Đạt**
  - Điểm yếu: máy **không còn roll** (cọc và khung cửa thẳng đứng trong ảnh — vết chéo trước đây là hoa văn tường, không phải nghiêng máy), mảng ẩm trên áo ướt đọc được ở giữa, bồn chậu xanh ở dưới, lan can làm tiền cảnh, ba lớp chiều sâu rõ. Điểm yếu: bồn chậu bị lan can cắt mất nửa, đồng hồ treo tường cắt ở mép trên, và khung có **nhiều món quần áo cùng lúc** nên áo ướt chưa tách hẳn.
  - Khuyến nghị quay: giữ; nâng máy lên ~0.2 m và lùi thêm ~0.4 m để bồn chậu trọn khung dưới mép áo, và dời đồng hồ treo tường xuống khỏi mép trên.

- [Hero 2 · c11 · t=37.25 · "Nước nằm ở khe giữa các sợi"]:
  - Bố cục: **Chưa đạt — Hero hỏng**
  - Điểm yếu: khung là **hai tấm nghiêng màu bìa** tạo chữ V, một **que xanh lạnh** (dải màng nước) cắt ngang hai tấm ở góc vuông, một khối xám nhỏ ở chỗ giao. Người xem tắt tiếng **không đoán được đang xem gì** — que xanh đọc như thanh neon/ống thuỷ tinh, "sợi" đọc như gỗ ép hay bìa carton, và không có tầng hậu cảnh nào để giữ liên tục không gian với c10. Lỗi của vòng 4 (dải thuỷ tinh ngang) đã đổi hình, nhưng **vấn đề gốc chưa được chạm**: người xem vẫn không thấy "khe giữa hai sợi".
  - Khuyến nghị quay: dựng lại hẳn bằng đạo cụ mới, không dùng hai tấm bìa: **hai sợi to, tròn, có xơ tua, chạm nhau ở giữa theo một đường cong**, mảng nước là **vệt alpha mỏng bám đúng hai mép sợi và xuyên sáng**, một giọt treo ở đường sợi có meniscus, và một sợi chéo mờ ở hậu cảnh. Camera nhìn **dọc theo khe** (fov 20–24), không nhìn vào hai mặt phẳng nghiêng. Chỉ khi đọc được "khe nước giữa hai sợi" thì Hero 2 mới đạt.

- [Hero 3 · c36 · t=103.41 · "Hai giọt nước, một bên có gió, một bên không"]:
  - Bố cục: **Đạt — đã sửa triệt để lỗi góc từ trên xuống**
  - Điểm yếu: máy đã hạ xuống tầm mặt kính, nhìn chếch 3/4; **vách ngăn là tấm dày có viền ở giữa, quạt nhỏ trọn khung bên phải, vệt hạt khí đi từ miệng quạt sang mặt kính phải**, và giọt bên có gió nhỏ hơn giọt bên không gió — cơ chế đúng, đọc được. Điểm yếu: tấm kính ngoài cùng bị cắt ở mép trái, vách ngăn vẫn dễ nhầm với một tấm kính thứ ba, và vùng sáng nhất khung là mảng tường nâu ở góc trên-trái chứ không phải giọt nước.
  - Khuyến nghị quay: giữ góc; thu fov thêm ~4° và dời camera sang phải ~0.1 m để tấm kính trái trọn khung, đồng thời hạ sáng vùng tường trên-trái xuống để giọt nước thành vùng sáng nhất.

### 60 nhát, c1 → c60

- [c1 · 2.40–6.07]: **Đạt** — xem Hero 1.
- [c2 · 6.27–9.42]: **Chưa đạt — lùi so với vòng 4.** Khung là **một mảng vải dệt phẳng chiếm 100 %**, không có "mảng ẩm" nào, không có mép áo, không có ghế. Lời "nó còn ở trên vải" cần một vệt ẩm đọc được trên mặt vải. Máy còn quá gần (fov 16, cách mục tiêu ~0.37 m).
  - Khuyến nghị quay: lùi ra (fov 26–30, cách ~0.7 m) để thấy **trọn mảng ẩm loang** trên áo úp, có lưng ghế và gỗ làm tiền cảnh.
- [c3 · 9.87–13.90]: **Đạt (kèm lỗi lặp lại)** — quạt + bàn cân + hai mặt cân đủ để "làm thí nghiệm nhỏ" đọc được, hai mặt cân có số 0–400 rõ. Lỗi lặp lại lần thứ tư: **đồng hồ treo tường bị cắt ở mép trên-phải** (đã báo ở vòng 2, 3, 4).
  - Khuyến nghị quay: hạ đồng hồ xuống ~0.15 m (đặt ở `y ≈ 1.40`) hoặc đưa camera lùi thêm; đừng sửa bằng cách di chuyển đồng hồ sang góc khác — nó phải nằm trong khung rộng này.
- [c4 · 14.10–17.10]: **Chưa đạt.** Đã cải thiển (hai cái cân không còn chiếm giữa khung), nhưng **hai cái áo không cạnh nhau**: cái phải bị đẩy tới mép khung và **bị cắt**, giữa hai áo là cả một cái bàn + thẻ `2 ÁO`. Lời "hai cái áo giống nhau treo cạnh nhau" không đọc được, và mất đúng nghĩa "cạnh nhau".
  - Khuyến nghị quay: đặt hai áo sát nhau (khe ≤ 5 cm) ở giữa khung, mỗi áo chiếm ~30 % chiều ngang, cân ra khỏi khung, thẻ `2 ÁO` đặt vào khoảng trống **giữa** hai áo.
- [c5 · 17.30–20.47]: **Chưa đạt.** Trong khung chỉ thấy **hai áo treo cạnh nhau trên cùng thanh**, quạt ở góc trái; **không có cái áo "ở góc xa"** mà lời nói. Khoảng 40 % khung là tường nâu trống, góc dưới có vệt tối đen không nguồn sáng dẫn dắt.
  - Khuyến nghị quay: rộng fov 52–56 và đặt camera ở góc phòng để **áo trước quạt ở 1/3 gần, áo góc xa ở 1/3 xa**, hai tầng độ sáng khác nhau rõ.
- [c6 · 20.67–24.20]: **Chưa đạt (cải thiển một nửa).** Quạt đã frontal và chiếm tâm khung ✓, nhưng **bàn cân vẫn còn trong khung ở mép phải**, **không có luồng gió nào ra khỏi lồng quạt**, và đồng hồ treo vẫn bị cắt ở mép trên-phải. Lời "chỗ nào có quạt thì mới có gió" không có hình.
  - Khuyến nghị quay: đặt camera **trên trục luồng gió, cách lồng 30–40 cm**, fov 28–32, và cho một vệt hạt khí thật đi ra khỏi lồng quạt; đẩy bàn cân ra khỏi khung.
- [c7 · 24.40–27.39]: **Chưa đạt — lỗi vòng 4 lặp lại nguyên vẹn.** **Hai cái áo vẫn sáng và phẳng nhau**, cửa sổ sáng đè lên cả hai; câu so sánh "cái trước quạt nhạt dần, còn cái kia vẫn sẫm" không đọc được.
  - Khuyến nghị quay: sửa ở **vật thể**, không phải ở góc máy — áo B phải dùng **vải sẫm hẳn (navy/tím) và có mảng ẩm đậm**, áo A vải kem đã nhạt; đèn tập trung vào áo B, hạ sáng cửa sổ.
- [c8 · 27.84–29.03]: **Chưa đạt.** Khung là **hai tấm nghiêng màu bìa trên nền tím**, một que gỗ cắt ngang, hai kim xanh dính que, và một mảnh đan ở mép phải. Người xem tắt tiếng không đoán được gì đang xảy ra.
  - Khuyến nghị quay: bỏ hẳn các tấm bìa/que; dùng **cùng đạo cụ sợi với c10–c12** để có liên tục không gian: sợi to ở tiền cảnh, giọt ở tâm khung, sợi chéo mờ ở hậu cảnh.
- [c9 · 29.23–31.72]: **Chưa đạt.** Khung phủ một lớp hơi mờ, tương phản thấp; "giọt" là một khối sáng tròn lờ nhờ, không phải chủ thể.
  - Khuyến nghị quay: siêu cận (fov 12) một giọt **có meniscus, highlight và bóng đổ** bám trên sợi, nền tối có gradient để giọt nổi hẳn.
- [c10 · 32.17–35.14]: **Chưa đạt — đúng như lo ngại của vòng 4, và nặng hơn.** Cờ `SAME` đã hết (khung này khác hẳn c11), nhưng **đạo cụ `wovenCloth()` đọc thành một tấm rổ tre / chiếu tre, không phải vải dệt**: sợi quá dày (r 2.9 mm trên tấm 34 cm với 30 sợi → đường kính sợi ≈ 50 % bước sợi, quá thô), màu sợi vàng nâu đều tăm tắp, **khe hở thấy thẳng ra nền tím** (không có lớp nền vải), và có **ba tấm đan cạnh nhau** nên đọc thành ba chiếc rổ. Vòng 4 nói "đọc như một tấm rổ/lưới" — vòng 5 giữ nguyên phán quyết đó, chỉ là nó giờ chiếm trọn khung.
  - Khuyến nghị quay: **giảm đường kính sợi xuống ~1.2 mm, tăng số sợi lên 44×44, thêm một lớp vải nền mờ phía sau để khe không thấy hư không, dùng màu sợi kem lạnh hơn và cho sợi xơ tua rõ hơn**; chỉ đặt **một** tấm đan trong khung, bỏ hai tấm còn lại khỏi khung này.
- [c11 · 35.34–38.53]: **Chưa đạt** — xem Hero 2.
- [c12 · 38.73–40.86]: **Đạt** — sợi có xơ, vệt nước bám, đọc được "ở rìa sợi, nó thành vệt trong xơ".
- [c13 · 41.31–43.77]: **Chưa đạt — lỗi vòng 4 lặp lại nguyên vẹn.** Khung là **một mảng xanh nghiêng chạy chéo**, không thấy mặt phẳng mặt nước, không có đường nước–không khí, không có meniscus. Các cụm phân tử lơ lửng trong một thể xanh.
  - Khuyến nghị quay: mặt nước phải là **một dải sáng nằm ngang ở 1/3 trên khung**, có meniscus và vân, phân tử **bám đúng mặt đó**; dưới dải là thân nước tối.
- [c14 · 43.97–45.96]: **Đạt** — nhát chuyển cảnh được phép trống, có vệt sáng mặt nước làm mốc định hướng.
- [c15 · 46.41–48.81]: **Chưa đạt.** Mặt nước vẫn nghiêng chạy chéo; không có tương phản giữa **phân tử đang nhảy** và **phần đang nằm yên**, nên "các phân tử cứ nhảy lung tung" không đọc được.
  - Khuyến nghị quay: hạ camera xuống đúng tầm mặt nước, một nửa cụm nằm yên trên mặt, một nửa đang bật lên, và cho vệt sáng/vệt bóng phân biệt hai trạng thái.
- [c16 · 49.01–51.34]: **Chưa đạt (thẻ đã sửa, hình chưa).** Thẻ `1 PHÂN TỬ` giờ **đã hiện đúng chỗ** ✓ (vòng 4 báo thiếu — đã hết cờ). Nhưng cụm phân tử là **một khối trắng cháy viền** vi phạm `STYLE.md` ("không mảng trắng cháy"), và **mặt nước không có trong khung** — 75 % khung là navy trống.
  - Khuyến nghị quay: hạ bloom và cường độ đèn của nhát này, đưa mặt nước vào 1/3 dưới khung, để **một phân tử rời khỏi cụm** thay vì một cụm trắng đặc.
- [c17 · 51.79–54.04]: **Đạt** — phân tử bay lên có vệt sáng kéo theo, đọc được.
- [c18 · 54.24–55.75]: **Đạt** — mặt nước tối đi, phân tử nguội màu, đọc được "mát đi".
- [c19 · 56.20–59.41]: **Đạt** — tấm áo ướt là chủ thể ở giữa khung, có mảng ẩm.
- [c20 · 59.61–61.52]: **Chưa đạt — lỗi vòng 4 lặp lại nguyên vẹn.** Bàn tay là **bốn ống trụ màu gỗ nằm sát nhau**, đọc như que nướng/sausage; không thấy đốt ngón, không móng, không lòng bàn tay, không mu bàn tay. Cả khung là cận cực của ngón tay.
  - Khuyến nghị quay: lùi ra (fov 30–34) để thấy **cả bàn tay + mép áo**, sửa đạo cụ `hand()` cho có đốt ngón, móng, lòng bàn tay và ngón cái; giọt mồ hôi nhỏ dính da.
- [c21 · 61.72–65.12]: **Đạt** — áo với hơi nước bốc lên, đọc được.
- [c22 · 65.57–68.81]: **Chưa đạt — lỗi vòng 4 lặp lại nguyên vẹn.** Khung là **mảng vải kem phẳng chiếm ~75 %** với vài chấm xanh; **"lớp hơi mỏng nhìn chính diện" không có hình** — không viền sáng, không mảng alpha, không đường bám. Mảng xám cứng cũng vẫn còn.
  - Khuyến nghị quay: lớp hơi phải là **mảng alpha có viền sáng bám đúng mặt áo**, đặt ở mép áo để đường bám đọc được; bỏ mảng xám cứng; thu fov để mặt áo chiếm ≤ 55 %.
- [c23 · 69.01–71.01]: **Chưa đạt.** Khung là **tường nâu trống chiếm 90 %**, với **tám hạt trắng tròn cháy sáng** và **mép vải chỉ là một góc nhỏ ở dưới-phải**. Hạt cháy trắng vi phạm `STYLE.md`; "chỗ trống đó" có mặt trong khung nhưng không có mốc định hướng nào đủ để đọc.
  - Khuyến nghị quay: camera sát mặt áo, **mép vải chiếm 1/3 dưới khung**, hạt hơi nước **mờ và nhỏ, không cháy trắng**, và một đường hơi nước đi ra khỏi mép vải.
- [c24 · 71.21–74.60]: **Chưa đạt (đã cải thiển một nửa).** Cổ áo, lỗ cổ tối và hai vai **đã đọc được** ✓ — đây là phần vòng 5 sửa được. Nhưng "lớp hơi ẩm ấy bám sát mặt áo, mỏng như một tấm kính mờ" **vẫn không có hình**: thứ duy nhất là **một hình tròn cyan đục lơ lửng trong lỗ cổ**, không bám vải, không xuyên sáng, không có viền sáng. Mặt vải vẫn chiếm 2/3 khung.
  - Khuyến nghị quay: thay hình tròn đó bằng **mảng alpha xuyên sáng bám sát mặt vải quanh cổ**, có viền sáng ở đường bám; hạ độ đám sáng trên vải.
- [c25 · 75.05–77.84]: **Đạt — đã sửa.** Nhìn lên từ dưới mép áo, **hai giọt bám đúng mép vải** có meniscus và bóng, đọc được "lớp đó bám sát vải". Điểm yếu: nửa dưới khung là tường nâu trống (nhiều quá), và chỉ thấy **hai giọt** chứ không phải ba như `LOOK.md` ghi.
  - Khuyến nghị quay: giữ góc; nâng máy lên ~0.1 m để vải chiếm ~2/3 khung và lấy đủ ba giọt.
- [c26 · 78.04–80.03]: **Chưa đạt — khung tệ nhất của cả phim.** **100 % khung là một mảng vải dệt phẳng**, không mép, không lớp hơi, không mốc nào. "Từ đó, nước bay hơi chậm lại" không có gì để minh hoạ.
  - Khuyến nghị quay: phải có **một mép vải ở một góc khung** và **lớp hơi alpha viền sáng ôm lấy mép đó**; nếu không dựng được lớp hơi thì đổi nhịp: dùng cận mép áo có giọt bám.
- [c27 · 80.48–84.27]: **Chưa đạt — lỗi vòng 4 lặp lại nguyên vẹn.** Khung là **quạt chiếm trọn khung**, **không có cái áo nào**, và chỉ **một hạt khí** bay lơ lửng dưới cánh quạt. "Gió thổi tới, lớp ẩm bị quét đi" không có hình nào để quét.
  - Khuyến nghị quay: đưa **cả quạt và cả mép áo** vào khung (fov 52–56), hướng gió trái→phải, và cho một **lớp ẩm mờ dần theo hướng gió** bị quét mất.
- [c28 · 84.47–86.44]: **Chưa đạt.** Khung là **mảng vải kem của cổ áo và vai chiếm ~75 %**, chỉ có 2 hạt xanh và một **ống trắng lơ lửng** dưới thanh phơi. "Gió làm đường đi của hơi nước ngắn lại" **không có đường đi nào để đo**.
  - Khuyến nghị quay: quay dọc mép tấm áo theo hướng gió, thấy **một đường hơi nước ngắn, thẳng** cạnh **một đường hơi nước dài, cong** ở phía trên; xoá ống trắng lơ lửng.
- [c29 · 86.89–87.92]: **Chưa đạt — lùi so với vòng 4.** Áo B ở tiền cảnh **chiếm ~55 % khung và bị cắt ở mép phải**, mảng ẩm trên nó **hoàn toàn không thấy**, và hạt khí bay qua là vài chấm cyan tròn trông như bong bóng. "Gió không sấy nước" không đọc được.
  - Khuyến nghị quay: lùi để áo B trọn khung, **đặt mảng ẩm đậm rõ** lên mặt áo B, và thay hạt khí tròn bằng dải hạt nhỏ kéo theo hướng gió.
- [c30 · 88.12–89.33]: **Chưa đạt.** Dải hạt trắng **đều tăm tắp, thẳng hàng** như dây đèn lòng, không phải hơi nước bị gió cuốn; không phải siêu cận.
  - Khuyến nghị quay: sát hơn (fov 18–20), hạt to nhỏ lệch nhau, có vệt kéo dài, nền tối có gradient.
- [c31 · 89.78–92.19]: **Chưa đạt — lùi so với vòng 4.** Quạt **nhỏ, ở giữa khung**, **60 % khung là tường tím trống**, **không có áo nào** để thấy lớp ẩm bị quét; chỉ có túi nylon ở mép phải. Vòng 4 đã có "quạt ở tiền cảnh trái, áo đã vào khung" — vòng 5 làm mất áo.
  - Khuyến nghị quay: đưa quạt về tiền cảnh trái như vòng 4, **đưa mép áo A vào khung**, và cho vệt hạt khí chạy ngang từ miệng quạt sang mép áo.
- [c32 · 92.39–93.83]: **Đạt** — toàn cảnh phòng từ cửa, đủ hai áo, quạt, cửa sổ kín.
- [c33 · 94.28–98.01]: **Đạt — đã sửa.** Thẻ `288 g` và `88 g` **đã tách hẳn nhau**, đọc rõ chữ và số; có quạt, hai cân, hai áo nhỏ treo trên kệ. Lỗi lặp lại: đồng hồ treo tường cắt ở mép trên-phải.
  - Khuyến nghị quay: giữ; hạ đồng hồ treo xuống cho vào khung.
- [c34 · 98.21–99.46]: **Đạt** — hai mặt cân trọn khung, hai kim lệch nhau, thang 0–400 g đọc được.
- [c35 · 99.91–101.53]: **Đạt — đã sửa.** Camera đã ra trước bàn: thấy **hai mặt kính, hai giọt nước, vách ngăn, quạt nhỏ ở cuối bàn**, phòng cuối bàn bớt tối. Điểm yếu: vách ngăn vẫn đọc như một tấm mảnh, và hai mặt kính vẫn hơi tròn.
- [c36 · 101.73–104.53]: **Đạt** — xem Hero 3.
- [c37 · 104.73–107.16]: **Đạt — đã sửa triệt để.** Giọt nay là **hạt tròn có meniscus, highlight và bóng đổ** đặt cạnh **mép vách ở tiền cảnh**, đọc được nó thuộc phía không có gió; cảnh đã sáng lên so với vòng 4.
- [c38 · 107.61–109.70]: **Chưa đạt.** Hai đồ đo giờ đã **đọc được vạch** (nhiệt kế 10–50, ẩm kế 0–100) ✓ — đã hết lỗi "3 % khung" của vòng 4. Nhưng **đàn áo bị cắt ở mép phải khung** (chỉ còn một mảng) nên món thứ ba không có mặt, và **vùng sáng nhất khung là vệt sáng loang trên tường** chứ không phải đồ đo.
  - Khuyến nghị quay: dời camera sang trái và lùi ~0.4 m để **đàn áo trọn ở góc phải**, hạ sáng vệt tường, và tăng sáng hai đồ đo.
- [c39 · 109.90–112.48]: **Đạt — đã sửa.** Mặt nhiệt kế vạch 10–50 rõ, **không còn thẻ `20 g/kg` sót** ✓.
- [c40 · 112.68–115.11]: **Đạt** — quay ngang tầm dây, thẻ `3 ÁO` đọc được, đếm được ba áo chồng. Điểm yếu: tấm áo đỏ ở tiền cảnh chiếm ~35 % khung.
- [c41 · 115.56–118.74]: **Chưa đạt (sửa một nửa).** Thẻ lớn `20 g/kg` đã **không còn đè lên mặt đồng hồ** ✓ và nằm bên phải ✓. Nhưng còn một **vệt phản chiếu hình chữ nhật của mặt kính ẩm kế** (`shine`, `src/props.js:1050`) đè lên vạch 0 và 20 ở bên trái, làm hai số đó **mờ đi như bị giấy che** — đọc ở cự ly này thấy một mảnh bìa trắng đặt trên mặt đồng hồ. Mặt đồng hồ cũng bị cắt ở đáy ("HUMIDITY" mất nửa).
  - Khuyến nghị quay: xoá vệt `shine` (hoặc thu nó thành một vệt mảnh chỉ ở 1/4 mặt kính, không đè lên số), lùi ra ~0.15 m để trọn mặt ẩm kế vào khung.
- [c42 · 118.94–120.95]: **Chưa đạt.** Cận quá: chỉ thấy **số "0", dấu "%" và một góc chữ "HUMI"**, vệt `shine` vẫn đè lên vạch 0; **không có chữ "20 g/kg"** trong khung. Lời "tính trên mỗi kilogam không khí khô" cần đơn vị `g/kg` đọc được.
  - Khuyến nghị quay: lùi ra để thấy **đồng thời** thẻ `20 g/kg` **và** mặt ẩm kế, không thu vào một góc chữ.
- [c43 · 121.15–122.37]: **Đạt (kèm yếu)** — vạch đỏ ở 100 % rõ, đọc được "đó là trần của nó". Điểm yếu: khung chỉ là một góc của mặt đồng hồ, thiếu ngữ cảnh, và trùng bố cục với c41/c42.
  - Khuyến nghị quay: thu fov để lấy **cả nửa mặt đồng hồ** (thấy vạch 80–100 và chữ HUMIDITY) để có ngữ cảnh.
- [c44 · 122.82–125.22]: **Đạt — đã sửa.** **Cột thuỷ ngữ đã đứng đúng vạch 30** ✓, số 40/30 vào khung ✓.
- [c45 · 125.42–128.08]: **Chưa đạt — lỗi số sai, nặng hơn vòng 4.** Cột đứng đúng vạch 30 ✓, nhưng **thẻ `30 °C` lại chỉ vào vạch "50 °C"** — mũi tên của thẻ đặt ngay cạnh chữ 50 °C ở đầu thang. Người xem đọc thẻ là "50 °C" trong khi cột nước nói 30: **hình tự mâu thuẫn**. Thêm nữa, `LOOK.md` mục 60 nhát ghi c45 là "nhiệt kế và ẩm kế cùng khung" nhưng `src/film.js` chỉ có nhiệt kế.
  - Khuyến nghị quay: chuyển điểm neo của thẻ `do30` từ `[-2.25, 1.99, -.95]` xuống đúng vạch 30 — vạch 30 nằm ở local `y = −0.02` và nhiệt kế đặt ở `y = 1.95`, tức **world `y ≈ 1.93`**, và số nằm ở local `x ≈ −0.014` tức **world `x ≈ −2.264`**; giữ `off` nhưng thu về `[150, −150]`. Đồng thời sửa `LOOK.md` cho khớp mã.
- [c46 · 128.53–133.13]: **Chưa đạt (đã sửa một nửa).** **Kim đã chỉ đúng vạch 90** ✓ và vạch đỏ 100 % vào khung ✓, thẻ `90 %` chỉ đúng chỗ. Nhưng khung là **siêu cận một góc mặt đồng hồ**: mất hẳn nửa trái (0–60) và hết chữ HUMIDITY, nên mất ngữ cảnh "trần"; và **vệt `shine` vẫn làm mờ số 20 và 0** ở mép trái.
  - Khuyến nghị quay: lùi ra (fov 20 → 30) để lấy trọn mặt ẩm kế; xử lý vệt `shine` như c41.
- [c47 · 133.33–136.15]: **Đạt — đã sửa.** Lớp hơi mờ đục **quanh áo ướt ngoài hiên** đọc được, hạt hơi nước lơ lửng có mặt, và khung tách hẳn khỏi hai nhát sáng hai bên. Điểm yếu: lớp hơi phủ cả khung nên tương phản thấp và áo hơi nhạt.
  - Khuyến nghị quay: giữ; hạ opacity lớp hơi xuống ~0.32 và thu bớt vùng hơi ở hậu cảnh để mảng ẩm trên áo đọc được.
- [c48 · 136.60–140.50]: **Chưa đạt — hỏng theo hướng ngược lại.** Camera **cận quá**: khung là **một mảng vải chiếm ~80 %** với bóng đổ của một vật khác và hai giọt; **không đọc được đâu là áo phơi một mặt, không có đường biên ẩm/khô**. Ghi chú: `LOOK.md` mục vòng 5 khẳng định "c48 lùi xa (fov 40) cho trọn cái áo phơi một mặt" — **mã nguồn không có fov 40**, `src/film.js` vẫn là `sh('N1','c48',24, …)`, tức máy cách tấm áo ~0.78 m với fov 24 → khung rộng chỉ ~33 cm. Tài liệu và mã đang nói hai điều khác nhau.
  - Khuyến nghị quay: mở fov lên 40 và lùi thêm ~0.5 m (đặt `z ≈ 0.6`) để lấy **trọn tấm áo phơi một mặt** với đường biên ẩm/khô chạy ngang thân áo; sửa `LOOK.md` cho khớp.
- [c49 · 140.71–143.03]: **Chưa đạt.** Cái áo phơi rộng ở tiền cảnh giờ **đã trọn khung** ✓ (vòng 4 báo bị cắt — đã hết), nhưng **"cái áo úp" không có mặt trong khung**: thứ treo trên giá là **một áo móc trên móc, mặt trước quay về máy**, không phải áo úp; còn vật ở góc dưới-trái là **một mảnh vải gấp có kẹp**. Không so được hai thứ.
  - Khuyến nghị quay: dựng thật **áo úp trên lưng ghế** (mặt áo hướng về máy, mép vải úp xuống, mảng ẩm đậm) đặt **cạnh nhau** với áo phơi rộng trong cùng một mặt phẳng, cùng khoảng cách và cùng kích thước.
- [c50 · 143.48–146.82]: **Đạt — đã sửa triệt để.** Toàn cảnh hiên: **quần dày navy ở giữa, áo thun mỏng xanh nhạt bên phải**, khăn vàng, túi nylon, dây phơi, lan can ở tiền cảnh, sàn gạch — đúng một mảnh dày đối chiếu một mảnh mỏng trong cùng khung. Vòng 4 báo "chỉ có quần navy" — đã hết.
  - Khuyến nghị quay: giữ; nâng máy lên ~0.2 m để giảm sàn gạch ở nửa dưới khung, và hơi zoom vào cặp quần–áo thun.
- [c51 · 147.02–148.93]: **Đạt** — giọt bám đúng mép khăn rồi mới rơi, đọc được. Điểm yếu: mép khăn trông hơi như tua/rèm.
- [c52 · 149.38–152.86]: **Đạt** — lớp hơi quanh áo đọc được, quạt đã tắt nên không có luồng gió.
- [c53 · 153.06–155.20]: **Đạt** — toàn cảnh phòng kín, hai áo mỗi áo một vầng hơi, quạt tắt, cửa sổ kín.
- [c54 · 155.65–158.51]: **Chưa đạt — vật chính bị che.** Hạt khí đã **bay từ quạt sang bàn tay** ✓ (ống trụ trắng của vòng 4 đã bỏ ✓), nhưng **bàn tay bị cắt ở mép phải khung** và **đang cầm một túi nylon trắng bên trong phòng** — đọc như người đi chợ, không phải bàn tay ngửa trong luồng gió. Quạt nằm ở mép trái xa, nhìn từ sau, nên không thấy gió phát ra từ lồng.
  - Khuyến nghị quay: **dời túi nylon trong phòng** (`src/set.js:176`, `bag2` ở `(-0.5, 1.26, -3.3)`) ra khỏi đường nhìn của c54/c55, đặt bàn tay ngửa **trọn trong khung** ở 1/3 phải, và đưa quạt về 1/3 trái với một vệt hạt khí rõ nối từ miệng quạt tới mu bàn tay.
- [c55 · 158.71–160.78]: **Chưa đạt — vật chính bị che (vòng 4 lặp lại).** **Túi nylon trong phòng nằm đúng giữa trục nhìn và đè lên bàn tay**, chiếm ~40 % khung; bàn tay chỉ còn mấy ngón và một khối da. **Giọt mồ hôi là các chấm cyan lơ lửng trong không trung**, không dính da; **không có luồng gió nào** trong khung; và một mảng đen ở mép phải không rõ là gì.
  - Khuyến nghị quay: dời `bag2` (xem c54); sửa đạo cụ `hand()` cho có mu bàn tay và bốn ngón rõ (năm ngón + ngón cái theo `LOOK.md`); **mồ hôi phải dính bề mặt da, có chỗ tiếp xúc và mép lệch**, r 3–5 mm; thêm vệt hạt khí xanh quét ngang qua mu bàn tay.
- [c56 · 161.23–163.57]: **Đạt** — hiên sáng, áo trên dây giữ nếp và texture, mảng ẩm đã tan.
- [c57 · 163.77–165.44]: **Đạt** — mảng vải đã khay màu, nắng xiên lên.
- [c58 · 165.64–167.49]: **Chưa đạt.** Khung là **cửa sổ nhìn ra hiên tối như ban đêm** (trong khi bối cảnh là hiên nắng sớm), 2/3 là tường tím tối; **không có khoảng trống nào được chỉ ra** cho "nước có chỗ để đi". Sáng yếu, không có nguồn sáng dẫn dắt rõ.
  - Khuyến nghị quay: quay **dọc theo dây phơi có vải đang bay**, khoảng trống giữa các món đồ được nắng sáng và nổi lên; giữ tông sáng ban ngày.
- [c59 · 167.94–170.59]: **Đạt — đã sửa.** **Túi nylon giờ hiện rõ** ở giữa-phải, treo trên dây, có khoảng trống xung quanh và nền tường hiên sáng ✓ (vòng 4 báo "không có túi nylon" — đã hết). Điểm yếu: túi nhỏ, chung khung với áo thun, và chưa cho thấy nó đang vẫy.
  - Khuyến nghị quay: thu fov và dời camera sát hơn để túi chiếm ~15 % khung, và cho vải túi **vẫy nghiêng rõ** với bóng đổ lệch.
- [c60 · 170.79–173.43]: **Đạt** — áo phơi rộng thật trên ghế, một món khác treo riêng trên giá (không chồng), bồn chậu ở mép. Điểm yếu: tấm áo phơi rộng bị cắt ở góc dưới-trái và 40 % khung là tường tím trống.

## KHUYẾN NGHỊ ĐẠO DIỄN

Điểm trung bình **3.0 < 4.0**; điều kiện "không cảnh nào bị che khuất vật chính" **không đạt**. Vòng 5 sửa được **11 lỗi lớn** (c25, c33, c34, c35, c36, c37, c47, c50, c59, c16-thẻ, c24-cổ áo) và đã **hết cờ `SAME`/`RUN`/`DARK`/`NUM`** của máy đo nhịp — nhưng vẫn còn **32/60 nhát chưa đạt**, và những nhát đó rơi đúng vào các câu **đang giải thích cơ chế** (c8–c13, c22–c31, c48–c49, c54–c55). Người xem tắt tiếng sẽ đoán sai ở những câu đó.

**Chặn phim — phải xử lý trước khi render:**

1. **Hero 2 (c11) hỏng.** Đây là khung "cơ chế" của phim và hiện không đọc được là gì. Dựng lại bằng hai sợi to có xơ, mảng nước alpha bám hai mép sợi, giọt có meniscus, sợi chéo mờ ở hậu cảnh. Không dùng lại các tấm bìa nghiêng và que xanh.
2. **c10 đọc thành rổ tre, không phải vải.** `wovenCloth({ n: 30, size: .34, r: .0029 })` — sợi dày quá nửa bước sợi, khe hở thấy thẳng ra nền. Giảm `r` xuống ~0.0012, tăng `n` lên 44, thêm lớp nền vải mờ phía sau, đặt **một** tấm đan trong khung.
3. **c54 + c55 bị đạo cụ che.** `bag2` (`src/set.js:176`) nằm ngay giữa trục nhìn của c55. Dời túi nylon trong phòng sang vị trí khác (giữ cho c31 nếu cần), rồi dựng lại bàn tay và giọt mồ hôi dính da.
4. **c45 thẻ chỉ sai vạch.** Chuyển neo thẻ `do30` xuống world `y ≈ 1.93` (vạch 30), `x ≈ −2.264`.
5. **c20 bàn tay không đọc ra là bàn tay.** Sửa đạo cụ `hand()` (đốt ngón, móng, mu bàn tay, ngón cái) và lùi camera ra.
6. **Nhóm "mảng vải phẳng" còn 4 nhát: c2, c22, c26, c48.** Mỗi nhát phải có một vật riêng và một đường bám đọc được (mảng ẩm, mép vải, lớp hơi viền sáng, giọt bám), và **không nhát nào được là 100 % khung là vải**.

**Sửa tiếp (theo thứ tự ưu tiên):**

7. **c7 — hai áo sáng bằng nhau.** Sửa ở vật thể: áo B dùng vải sẫm + mảng ẩm đậm, đèn tập trung vào áo B.
8. **c4 — hai áo phải cạnh nhau**, mỗi áo ~30 % chiều ngang, thẻ `2 ÁO` ở khoảng trống giữa hai áo, cân ra khỏi khung.
9. **c5, c6, c27, c31 — cần một vật nhận gió.** Cả bốn câu đều nói về gió/quạt nhưng không có áo nào để gió quét và không có vệt hạt khí ra khỏi lồng quạt. Đưa mép áo A vào khung của c27 và c31; thêm vệt hạt khí thật cho c5–c6.
10. **c13, c15, c16 — mặt nước phải là một mặt phẳng.** Đưa mặt nước thành dải sáng nằm ngang có meniscus, phân tử bám đúng mặt đó; hạ bloom ở c16 (cụm phân tử đang cháy trắng) và c23 (tám hạt trắng cháy sáng — vi phạm `STYLE.md`).
11. **c8, c9 — dùng chung đạo cụ sợi với c10–c12** để giữ liên tục không gian; c9 cần giọt có meniscus + highlight, không phải khối sáng tròn.
12. **c30 — hạt hơi nước phải lệch nhau và có vệt**, không xếp thẳng hàng như dây đèn.
13. **c41, c42, c46 — xoá vệt `shine` của mặt kính ẩm kế** (`src/props.js:1050`): nó đọc như mảnh bìa trắng đè lên số 20 và 0. Lùi c42 và c46 ra để lấy trọn mặt đồng hồ.
14. **c38 — đàn áo phải trọn ở góc phải**, hạ sáng vệt loang trên tường để hai đồ đo là vùng sáng nhất.
15. **c48 — mở fov lên 40 và lùi thêm ~0.5 m**; `LOOK.md` ghi "fov 40" nhưng mã là `fov 24`.
16. **c49 — dựng thật áo úp trên lưng ghế**, đặt cạnh áo phơi rộng trong cùng mặt phẳng.
17. **c58 — sáng lại thành ban ngày và chỉ khoảng trống giữa các món đồ**; c3/c6 — **đồng hồ treo tường cắt ở mép trên-phải (lần thứ tư)**, hạ nó xuống thay vì sửa bằng cách xê dịch sang góc khác.

**Sửa tài liệu để khớp mã (đạo diễn mô tả sai so với `src/film.js`):**

- `LOOK.md` vòng 5b ghi c10 có "19 sợi dọc × 19 sợi ngang" — mã là `n = 30`.
- `LOOK.md` vòng 5 ghi "c48 lùi xa (fov 40)" — mã là `fov 24`.
- `LOOK.md` vòng 5 ghi "c35 … (fov 50, `z = −5.25`)" — mã là `fov 40`, `z = −5.40`.
- `LOOK.md` bảng 60 nhát ghi c45 là "nhiệt kế và ẩm kế cùng khung" — mã chỉ có nhiệt kế.
- `LOOK.md` bảng 60 nhát ghi c25 có "ba giọt" — hình chỉ thấy hai.

**Ghi chú cho bước sau (nếu còn vòng 6):** `beatsheet.mjs` nên so thêm **mặt phẳng thị giác** (cụm vải phẳng chiếm > 60 % khung, cụm hạt tròn trắng cháy, tỉ lệ vùng trống > 55 %) và **kiểm tra vị trí neo của thẻ `label()`** bằng cách đọc thẳng từ `LABELS` trong `src/film.js` — c45 (thẻ chỉ vạch 50 thay vì 30) là lỗi mà cả máy đo nhịp lẫn `LOOK.md` đều bỏ sót.
