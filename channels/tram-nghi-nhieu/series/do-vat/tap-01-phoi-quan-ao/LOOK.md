# LOOK — Vì sao phơi quần áo cần gió?

Khung hình của tập, làm theo `STYLE.md` của kênh. Mọi mốc thời gian lấy từ `voice/proc/dur.json` và `src/timeline.js` (giọng đã thu, `mk_timeline.py` của kênh sinh ra), không ước lượng.

Nguyên tắc của bản này: **mỗi câu kể một hình**. Một câu = một bố cục riêng (rộng – trung – cận – siêu cận xen kẽ), máy cắt theo nhịp lời. Không nhát nào kéo dài quá một câu, để không câu nào phải dùng lại hình của câu trước.

## Bố cục thế giới

Một căn nhà có **hiên phơi** (ngoài trời, nắng sớm, dây phơi) và **một phòng kín** (sau bức tường có cửa kính, không có gió nào lọt vào). Hai không gian chung một bối cảnh, tách bằng bức tường ở `z = −1.05`.

| Nơi chốn | Toạ độ chính | Vai trò |
|---|---|---|
| Hiên phơi (N1) | `z ≈ −1.0 … 2.5`, sàn gạch, tường giấy dán | câu hỏi đời thường (c1–c2), ba thứ quyết định tốc độ (c38–c46), lời khuyên (c47–c51, c56–c60) |
| Phòng kín (N4) | `z = −1.05 … −6.7`, có trần, cửa sổ kín | thí nghiệm so sánh (c3–c7, c19–c37, c52–c55) |
| Trong sợi vải (N2) | cận, các sợi đan, giọt nước | nước nằm ở khe (c8–c12) |
| Mặt nước (N3) | cận, mặt nước và phân tử | hơi nước rời đi (c13–c18) |

Vật định vị trong phòng: quạt bàn trên **bàn thấp** `(−1.5, 0.74, −3.3)` (đầu quạt xoay **25° về phía +z** — `setAim(π/2 − .44)` — để lưới và cánh quạt đọc ra được ở nhát nhìn chéo như c31, thay vì chỉ thấy vỏ động cơ) thổi sang phải, luồng gió đi lên từ đầu quạt (`y ≈ 0.92 → 1.38`) về tầm áo; **áo A** trong luồng gió `(0.42, 1.42, −3.30)`; **áo B** ở **góc xa** phòng, ngoài luồng gió, vải navy `(2.30, 1.42, −5.05)` (quay nghiêng `−π/2`, có một đèn góc lạnh nhỏ ở `(2.45, 1.78, −5.30)` để nó lộ ra mà vẫn sẫm hơn áo A); **hai cái cân** trên kệ `(−1.8, 0.75, −5.6)` với hai áo nhỏ treo **cạnh nhau** trên thanh ngay trên chúng (`x = −1.95` và `−1.65`, khe hở ≈ 3 cm, rộng 27 cm mỗi áo), và **quạt nhỏ** trên kệ `(−1.10, 0.745, −5.55)` thổi vào đúng cái áo đứng trước quạt; **bàn thí nghiệm** dọc tường sau `(1.70, 0, −6.15)` với quạt nhỏ ở cuối bàn `(2.38, 0.72, −6.15)` thổi ngang qua mặt kính phải, vách ngăn ở giữa chặn mặt kính trái; **đồng hồ treo tường** `(−2.30, 1.95, −6.62)` (đưa **lên cao** cho khỏi đè lên cặp áo nhỏ trên kệ, vốn ở `y 1.14–1.50`; trước đó nó nằm đúng tầm áo nên ở c3–c4 vòng đồng hồ đỏ viền đè ngay sau cổ áo).

Trên hiên: dây phơi thứ nhất `(0, 1.55, 0.85)` mang áo ướt `(−1.25)`, quần `(−0.55)`, khăn `(0.25)`, áo thun `(1.50)`; dây thứ hai `(0.3, 1.98, −0.72)` mang đàn áo chồng `(0.28)` và áo phơi một mặt `(1.00)`; nhiệt kế `(−2.25, 1.95, −0.97)` và ẩm kế `(−1.55, 1.95, −0.97)` treo trên bức tường giữa hiên và phòng.

Những món dựng thêm cho các câu mới, đều là **đạo cụ thật trong khung**, không phải chữ:
- **Giày phơi trong nhà** (c53): một **giá phơi đứng trong phòng kín** ở `x ≈ −.7, z ≈ −6.0`, **áo ướt treo trên đó** (vải tối, còn ướt), đối diện là **cửa sổ kín mặt kính đọng hơi** (`x ≈ 2.2, z ≈ −6.3`) — một khung có cả áo ướt lẫn mặt kính đọng, đúng câu "phơi trong nhà lâu khô hơn".
- **Bàn tay** (c20, c54, c55): bàn tay ngửa xòe ngón, đặt ở `x = −1.05` (đúng chiều gió từ quạt ở `x = −1.5`), mười giọt mồ hôi bám trên mu bàn tay; c54 và c55 cùng nhìn **từ một phía** để cánh tay không bị lật gương giữa hai câu.
- **Hai bàn phơi gỗ tách riêng** (c60): hai chiếc bàn đặt cạnh nhau nhưng **có khoảng trống** giữa, mỗi bàn một cái áo, không món nào chồng lên món nào; áo bên phải có **một góc lật lên, mặt trong tối lộ ra** — đó là hình của "phơi cả hai mặt".

## 60 nhát: một câu một hình

| # | Câu | Mốc (giây) | Nhìn gì | Lý do của góc máy |
|---|---|---|---|---|
| 1 | c1 | 2.40–6.07 | hiên: **áo ướt trên dây chiếm phần lớn khung** (fov 46, máy ở `(−1.62, 1.62, 2.75)`, điểm nhìn `(−1.25, .92, .85)` — máy lệch trái): **nửa dưới tấm áo xám ẩm**, **bốn giọt bám trên vải**, **ba giọt bám ở mép**, thẻ `QUẦN ÁO ƯỚT` chỉ vào vai áo; **bồn chậu có nước đứng ngay dưới mép áo** ở đáy khung — **bàn phơi và cặp áo của câu 49 không có mặt ở câu này** (trước đây chúng đứng ngay trước ống kính và che mất bồn, nên câu mở đầu không thấy được nước còn đó); quần jean và khăn ở bên phải | mở đầu đời thường, giọng kể như người vừa đi ngang sân — câu nói "nước vẫn còn đó" phải thấy được ngay: nửa áo ẩm, giọt bám, và nước đứng trong bồn dưới áo |
| 2 | c2 | 6.27–9.42 | cận **nửa dưới tấm áo ướt** trên dây phơi (fov 36, máy ở `(−.95, 1.05, 1.85)`, điểm nhìn `(−1.25, .98, .86)` — **ngước lên** để đường triều nước nằm trong khung): **đường ẩm chạy ngang méo mó** ngăn vải khô (kem) và vải ướt (xám ô-liu sẫm hơn hẳn), **bốn giọt bám** trên vùng ướt, **ba giọt bám mép** ở đáy khung, mép vải cong, sàn gạch và cọc phơi bên cạnh — trước đây khung chỉ lấp đầy bằng một mảng vải phẳng, không đọc ra là nước còn nằm trên vải | "nó còn ở trên vải" — máy đi tới chỗ nước còn nằm trong vải, không nhìn lại cả căn hiên |
| 3 | c3 | 9.87–13.90 | phòng kín: quạt bàn | "mình làm thí nghiệm nhỏ" — dựng đạo cụ trước khi kể |
| 4 | c4 | 14.10–17.10 | **hai cái áo trọn vẹn trong khung, cổ và vai cạnh nhau** (fov 50, máy ở `(2.00, 1.15, −1.70)`, điểm nhìn `(1.98, 1.05, −2.60)` — máy đứng **trong phòng**, cách cặp áo khoảng 0.9 m): quạt nhỏ ở mép trái, thẻ `2 ÁO` chỉ xuống giữa cặp áo; **bàn thí nghiệm ở hậu cảnh đã tắt** (chỉ hiện ở câu 35–37) để không có thẻ CÓ GIÓ lẫn vào khung | "hai cái áo giống nhau treo cạnh nhau" phải thấy được cả hai cùng khung |
| 5 | c5 | 17.30–20.47 | **cặp áo thí nghiệm**: quạt nhỏ ở tiền cảnh trái (thẻ `QUẠT` chỉ vào miệng quạt), áo trước quạt ở giữa, áo ngoài tầm gió ở bên phải với thẻ `KHÔNG CÓ GIÓ` chỉ vào nó (fov 50, máy ở `(2.05, 1.28, −1.58)`, điểm nhìn `(1.85, 1.02, −2.60)`); **trong khung đúng hai cái áo** — cái áo ướt treo ở góc xa phòng (đạo cụ của câu 53) ẩn đi ở ba câu này | "một cái ở góc xa, không có gió" — hai cái áo phải cùng khung với quạt, để người xem tự so sánh cái nào nằm trong tầm gió |
| 6 | c6 | 20.67–24.20 | **quạt nhỏ và chiếc áo trước quạt cùng trong khung** (fov 46, máy ở `(1.78, 1.12, −1.60)`, điểm nhìn `(1.92, 1.06, −2.60)`): **cả hai cái áo trọn trong khung** (áo đối chiếu không bị cắt ở mép phải), thẻ `QUẠT` chỉ vào đầu quạt, thẻ `TRƯỚC QUẠT` chỉ vào mép vải áo ngay trước miệng quạt; cánh quạt quay, áo trước quạt đung đưa | máy đi theo lời "chỗ nào có quạt thì mới có gió": đầu quạt là chỗ gió bắt nguồn, nên **cả quạt lẫn cái áo ngay trước quạt phải có trong khung** |
| 7 | c7 | 24.40–27.39 | hai áo: một nhạt dần, một vẫn sẫm (fov 42, máy ở `(1.80, 1.58, −1.42)`, điểm nhìn `(2.02, 1.26, −2.62)` — máy nghiêng xuống nên **hai cái áo chiếm gần hết khung**, tường không nuốt khung; quạt nhỏ **ra khỏi khung**, chỉ còn hai cái áo và vệt gió; **vệt nhạt trên cái áo trước quạt chỉ bắt đầu sau khi câu 5 đã nói xong**, nên ở đây người xem thấy nó nhạt đi) | "cái trước quạt đang nhạt màu dần" — hai áo trong một khung để thấy chênh lệch |
| 8 | c8 | 27.84–29.03 | N2: cận sợi vải, giọt nước ở chính giữa | "nước không tự mất đi" — vào trong sợi trước, thấy nước vẫn còn |
| 9 | c9 | 29.23–31.72 | N2: **một giọt nước xanh nhạt nằm đè trên sợi**, sợi chạy chéo từ dưới-trái lên trên-phải, **nền là lớp vải đan mờ** (mảng tím-xanh loang ở hậu cảnh, không phải một nền trơn), điểm sáng trắng trên mặt giọt (fov 19, máy ở `(−.02, .104, .212)`, điểm nhìn `(−.02, .1015, .150)`) | "nó phải đổi thành thứ khác" — giọt là thứ phải đổi, nên giọt là chủ thể; nền vải đan để khung nói đúng là "trong ruột vải" |
| 10 | c10 | 32.17–35.14 | N2: **cả tấm vải đan** trên nền tối, tấm nghiêng nên có chiều sâu (fov 30, máy lùi ra `z = 0.46`; lưới sợi nền ẩn đi) | "mình thấy các sợi vải đan qua nhau" — máy lùi để thấy trọn tấm đan, sợi dọc luồn qua sợi ngang |
| 11 | c11 | 35.34–38.53 | N2: **hai sợi lớn chạy chéo khung, giữa chúng là dải nước mỏng** có viền sáng, một giọt treo trong khe (fov 24, máy nhìn chếch xuống khe; chỉ hai sợi lớn, lưới nền ẩn đi) | "nước nằm ở khe giữa các sợi" — đẩy vào đúng khe, hai sợi làm khung |
| 12 | c12 | 38.73–40.86 | N2: rìa sợi, **vệt nước loang trong xơ** (fov 22, máy ở `(.045, .081, .115)`, điểm nhìn `(.0375, .0755, .010)`): một sợi lớn trên nền tối, vệt ướt là **mảng xanh đậm nằm trên mặt sợi** (không chuim vào trong sợi), vài sợi xơ tỏa quanh | "ở rìa sợi, nó thành vệt trong xơ" — cận mép sợi, vệt nước là chủ thể |
| 13 | c13 | 41.31–43.77 | N3: mặt nước là **một dải sáng nằm ngang**, thân nước tối ở dưới, phân tử bám đúng dải đó | "nước phải đổi thành hơi nước" — mặt nước phải thấy được như một mặt phẳng, không phải một mảng xanh nghiêng |
| 14 | c14 | 43.97–45.96 | N3: chân trời thấp, mặt nước là một vệt sáng dưới không khí tối | "mình sẽ đi xem điều đó xảy ra thế nào" — nhát chuyển cảnh, hạ camera xuống tầm mặt nước |
| 15 | c15 | 46.41–48.81 | N3: **rộng, nhìn từ bên phải xuống cả mặt nước** (fov 34, máy ở `(.26, .135, .355)`, điểm nhìn `(−.10, .020, −.05)`): **cả mặt nước** với hàng chục phân tử nhảy lên rồi rơi xuống, không chỉ một góc | "các phân tử cứ nhảy lung tung" — phải thấy **cả mặt nước** bật nhác, chứ không một góc nhỏ |
| 16 | c16 | 49.01–51.34 | N3: mặt nước là một dải sáng ngang dưới, **một phân tử đang bứt lên khỏi mặt nước ở giữa trên cao**, thẻ `1 PHẦN NHỎ` chỉ đúng vào nó (fov 22, máy ở `(.120, .100, .215)`, điểm nhìn `(.005, .072, .010)`) | "chỉ một phần nhỏ đủ năng lượng" — cận để thấy phần lớn vẫn nằm yên, chỉ một rời đi |
| 17 | c17 | 51.79–54.04 | N3: máy **thấp, ngước lên, rộng** (fov 38, máy ở `(.115, .012, .330)`, điểm nhìn `(.000, .105, .000)`): phân tử đang bay lên ở giữa trên, **hào quang vàng loe dần quanh hạt**, **vệt hơi nước mờ (20 hạt) kéo thẳng xuống mặt nước**, mặt nước ở đáy khung, thẻ `PHÂN TỬ BAY LÊN` chỉ vào hạt | "phân tử bay lên mang theo năng lượng của nó" — vệt hơi nước là thứ mang năng lượng đi, phải thấy được |
| 18 | c18 | 54.24–55.75 | N3: **rộng, góc đối diện, nhìn xuống** (fov 30, máy ở `(.42, .185, .395)`, điểm nhìn `(−.35, .010, −.06)`): **cả phần nước còn lại**, màu nước chuyển xanh sâu, hơi lạnh mờ bốc lên | "phần nước còn lại thì mát đi" — mặt nước tối đi và nguội hẳn màu; nhìn **cả mặt nước**, không phải một góc |
| 19 | c19 | 56.20–59.41 | tấm áo ướt trong phòng (fov 46, máy ở `(1.35, 1.46, −2.40)`, điểm nhìn `(.42, 1.08, −3.30)`), thẻ `LẠNH` chỉ vào mép áo lúc vừa bắt đầu | "nước lấy nhiệt từ chính cái vải" — chủ thể là tấm áo, không phải cả phòng |
| 20 | c20 | 59.61–61.52 | bàn tay chạm vào tấm áo ướt rồi rút lại (fov 40, máy ở `(−.55, 1.38, −2.45)`, điểm nhìn `(.30, 1.20, −3.24)` — lùi ra để thấy trọn bàn tay và cả tấm áo, ánh sáng lạnh) | "chạm vào nó, mình thấy lạnh ngay" — chạm là động tác, phải thấy tay |
| 21 | c21 | 61.72–65.12 | áo trong luồng gió: **dòng nhiệt màu cam rời khỏi mặt vải** (`flow` từ `.42, 1.04` lên `1.66`), cột hơi nước bốc lên từ chính tấm áo, thẻ `HƠN 2 kJ / 1 g` cạnh mép áo | "mỗi gram nước lấy hơn hai kilojoule nhiệt" — nhiệt phải thấy ra rời khỏi vải, không chỉ nói bằng thẻ |
| 22 | c22 | 65.57–68.81 | **nhìn LÊN khe không khí ngay trên vai áo A** (fov 36, máy ở `(.30, 1.05, −2.45)`, điểm nhìn `(.43, 1.56, −3.28)`): mép áo còn ở đáy khung, **cột hơi nước bốc lên** qua khe không khí, dây phơi chạy ngang trên cao | "nước chỉ bay hơi đều hơn khi không khí ngay trên vải còn trống" — **đổi trục** để câu này có hình riêng, không đứng chồng lên câu trước |
| 23 | c23 | 69.01–71.01 | nhìn **LÊN** khe không khí giữa vai áo và dây phơi (fov 34, máy ở `(.26, 1.25, −2.85)`, điểm nhìn `(.44, 1.52, −3.26)`): vai áo ở đáy khung, **dải hơi nước mờ bay lên trong khe**, cột hạt hơi nước bốc lên | "chỗ trống đó, hơi nước mới đi được" — chỗ trống phải là chủ thể, hơi nước phải có đường đi |
| 24 | c24 | 71.21–74.60 | cận vai áo (fov 36, máy ở `(.70, 1.50, −2.30)`, điểm nhìn `(.42, 1.15, −3.26)`): vành cổ, hai vai, **lớp hơi ẩm bám sát mặt vải** đọc ra như **một tấm kính mờ phủ lên vải** (mép tấm mờ dần, giữa đục đều — không phải một vệt tròn), thẻ `LỚP HƠI ẨM` chỉ vào lớp hơi, bàn cân ở hậu cảnh | "mỏng như một tấm kính mờ" — cổ áo là mốc để đọc độ mỏng của lớp hơi |
| 25 | c25 | 75.05–77.84 | máy lùi ra (fov 40, máy ở `(.22, 1.20, −1.85)`, điểm nhìn `(.42, 1.02, −3.28)`): **cả tấm áo trong khung**, **dải ẩm bão hoà (xanh tím) ở mép dưới**, phía trên là vải khô; lớp hơi mờ ở đây mỏng đi (`opacity .16`) để dải bão hoà đọc được, thẻ `BAO HÒA` chỉ đúng vào dải | "lớp đó bám sát vải, nhanh chóng bị bão hoà" — dải phải thấy được, không phải một mảng vải trơn |
| 26 | c26 | 78.04–80.03 | nhìn chếch lên từ bên phải (fov 34, máy ở `(.66, .92, −2.52)`, điểm nhìn `(.44, 1.42, −3.26)`): vai áo, **kẹp gỗ móc áo trên dây**, **hơi nước bốc lên chậm** (`vapRise`), lớp hơi ẩm bám mặt vải | "từ đó, nước bay hơi chậm lại" — máy ở dưới tấm áo, nhìn lên lớp hơi phủ kín chỗ có vải |
| 27 | c27 | 80.48–84.27 | **mặt quạt ở tiền cảnh trái** (fov 42, máy ở `(−2.05, 1.12, −2.55)`, điểm nhìn `(.34, 1.00, −3.28)`): vệt gió chạy từ quạt sang áo, **lớp ẩm mờ trượt về phía quạt rồi mất dần** trong chính câu, thẻ `BỊ QUÉT ĐI` chỉ vào chỗ vừa bị quét | "gió thổi tới, lớp ẩm bị quét đi" — phải thấy quạt, thấy gió, và thấy lớp ẩm biến mất |
| 28 | c28 | 84.47–86.44 | nhìn dọc theo mép tay áo (fov 46, máy ở `(.98, 1.24, −2.78)`, điểm nhìn `(.30, 1.16, −3.24)`): **dải gió mờ kéo từ quạt sang tấm áo**, hạt khí trượt qua bề mặt vải | "gió làm đường đi của hơi nước ngắn lại" — đường đi ngắn thì thấy được như một đường thẳng |
| 29 | c29 | 86.89–87.92 | áo B nằm ngoài luồng gió: gió đi trượt qua mặt vải mà **nửa dưới áo vẫn sắc navy sẫm, có đường triều nước và bốn giọt bám**; **không có vệt hạt hơi nước nào trong khung** (vệt hơi nước bị gió chở đi chỉ bật ở c30–c31) | "gió không sấy nước" — quay sang cái áo ngoài luồng gió, thấy gió đi qua mà vải không khô |
| 30 | c30 | 88.12–89.33 | (fov 52, máy ở `(.92, 1.24, −2.05)`, điểm nhìn `(.06, 1.10, −3.28)`): **quạt bàn ở bên trái**, mép vải ướt giữa khung, **hơi nước bị gió chở sang phải** (vệt hạt xanh), thẻ `HƠI NƯỚC BỊ CHỞ ĐI` chỉ vào vệt hơi nước | "gió chở hơi nước đi" — phải thấy cả nguồn gió lẫn thứ bị gió mang đi |
| 31 | c31 | 89.78–92.19 | nhìn chéo từ bên phải phòng sang tấm áo (fov 46, máy ở `(1.20, 1.25, −2.50)`, điểm nhìn `(.20, 1.12, −3.30)`): **quạt bàn ở tiền cảnh trái, mặt quạt quay sang phải**, **vệt gió (vạch ngang) chạy từ miệng quạt qua mép áo**, **áo A ở giữa khung**, **hạt hơi nước bị gió chở sang phải**, thẻ `QUÉT XA HƠN` chỉ vào mép áo đang bị quét | "gió mạnh hơn, lớp ẩm bị quét xa hơn" — quạt phải **có mặt** trong khung, và phải thấy vệt gió đi qua |
| 32 | c32 | 92.39–93.83 | khung rộng phòng kín nhìn từ cửa: hai áo trên thanh, cửa sổ kín ở hậu cảnh | "nên nước bốc hơi nhanh hơn" — kết luận của cả chặng, cần nhìn được cả phòng |
| 33 | c33 | 94.28–98.01 | toàn cảnh góc kệ (fov 54, máy ở `(−1.45, 1.42, −4.15)`, điểm nhìn `(−1.80, 1.12, −5.55)`): **hai cái áo nhỏ treo trên thanh**, hai cái cân dưới chúng, **quạt nhỏ ở cuối kệ bên phải** thổi **lên** sang trái (vệt hạt khí đi lên, đúng tầm hai cái áo), thẻ `HAI CÂN` chỉ vào khoảng giữa hai cân | "hai cái cân, một áo trước quạt, một ở góc xa" — nhìn cả góc phòng để thấy quạt, vệt gió và áo nào nằm trong gió |
| 34 | c34 | 98.21–99.46 | hai mặt cân **nhìn chéo từ bên phải** (fov 32, máy ở `(−.98, 1.12, −4.70)`, điểm nhìn `(−1.82, .82, −5.52)`): **hai kim chỉ lệch nhau**, mặt cân **không in số** (phim không nói con số gam nào), thẻ `HAI CÂN` chỉ vào **đúng mặt cân bên trái**; **không còn thẻ `TRƯỚC QUẠT`/`GÓC XA` ở c34** — quạt không có trong khung cận, giữ thẻ thì nó chỉ vào chỗ trống | "hai cái kim lệch nhau" — chỉ sự lệch của hai kim; **không phải phóng to từ c33**: máy đứng lệch hẳn bên phải, nhìn chéo qua hai mặt cân |
| 35 | c35 | 99.91–101.53 | **từ trên nhìn xuống cả bàn thí nghiệm** (fov 50, máy ở `(1.72, 1.80, −5.30)`, điểm nhìn `(1.70, .88, −6.14)`): hai mặt kính, vách ngăn dựng ở giữa, quạt nhỏ ở mép phải — **trọn bộ dụng cụ trong một khung** | "Một thí nghiệm đơn giản trên bàn" — phải thấy trọn bộ dụng cụ trước khi vào từng bên |
| 36 | c36 | 101.73–104.53 | ngang tầm mặt kính, ba góc: hai mặt kính mỗi mặt một giọt, vách ngăn dựng ở giữa, quạt nhỏ trọn khung bên phải, vệt hạt khí đi từ miệng quạt | "hai giọt nước, một bên có gió, một bên không" — phải thấy cả hai giọt lẫn vách ngăn ở giữa |
| 37 | c37 | 104.73–107.16 | **HAI giọt cùng khung, hai mặt kính, vách ở giữa** (fov 40, máy ở `(1.740, 1.100, −5.32)`, điểm nhìn `(1.700, .960, −6.13)`): giọt **sau vách** (bên trái, không có gió) **to hơn** và hơi nước bốc thẳng lên; giọt **có gió** (bên phải) **nhỏ đi**, hơi nước bị gió chở ngang; **vòng nét đứt in sẵn trên kính** là thước đo — tới cuối câu giọt có gió còn **đúng một nửa vòng**, giọt sau vách còn **ba phần tư**; thẻ `TỐC ĐỘ CHẬM 1/2` chỉ vào giọt **sau vách** | "không có gió thì tốc độ bay hơi rơi còn một nửa" — vòng nét đứt là thước đo: giọt không có gió to hơn, nên nó mất nước chậm hơn một nửa |
| 38 | c38 | 107.61–109.70 | rộng cả hiên nhìn qua lối cửa vào phòng (fov 18, máy ở `(−1.10, 1.82, 1.00)`, điểm nhìn `(−2.02, 1.94, −.95)`): **ba thứ trên tường, đọc được** — nhiệt kế (cột đọc 25 °C), **tấm vải treo**, ẩm kế (kim chín mươi phần trăm); vế thứ ba (diện tích phơi) do thẻ `DIỆN TÍCH PHƠI` ở c39 đảm nhiệm | "ba thứ quyết định tốc độ" — phải thấy được cả ba thứ trong một khung: đo nhiệt, đo ẩm, và diện tích phơi |
| 39 | c39 | 109.90–112.48 | **một khung thấy cả ba thứ** (fov 54, máy ở `(−1.60, 1.80, 1.35)`, điểm nhìn `(−1.00, 1.55, −.75)`): nhiệt kế và ẩm kế treo tường bên trái, đàn áo phơi bên phải; thẻ `NHIỆT ĐỘ` chạm đầu nhiệt kế, thẻ `ĐỘ ẨM` chạm tai ẩm kế, thẻ `DIỆN TÍCH PHƠI` chỉ vào đàn áo | "nhiệt độ, độ ẩm, và diện tích phơi" — ba thứ trong một khung, mỗi thẻ chạm đúng vật nó gọi tên |
| 40 | c40 | 112.68–115.11 | đàn áo ba cái chồng trên **dây thứ hai** (fov 46, máy ở `(−.35, 2.02, 2.40)`, điểm nhìn `(.72, 1.72, −.35)`) — **dây thứ nhất ở tiền cảnh, dây thứ hai ở hậu cảnh**, để thấy rõ đó là hai dây khác nhau; thẻ `3 ÁO` chỉ vào đàn | "ba cái áo phơi chồng lên nhau" — đếm được đúng ba cái |
| 41 | c41 | 115.56–118.74 | mặt ẩm kế trọn mặt đồng hồ (fov 40, máy ở `(−1.50, 1.98, −.35)`, điểm nhìn `(−1.72, 1.95, −.95)`), vạch 0–100, **thẻ `20 g/kg` đẩy sang khe giữa hai đồng hồ** để không che số `20` xanh trên vòng g/kg | "chứa được tối đa khoảng hai mươi gam hơi nước" — con số phải nằm trên chính đồ đo |
| 42 | c42 | 118.94–120.95 | **cận vòng gam/kg** trên mặt ẩm kế (fov 30, máy ở `(−1.60, 1.78, −.70)`, điểm nhìn `(−1.72, 1.905, −.97)`), **kim đang chạy lên tới vạch cuối** trong suốt câu, thẻ `MỖI KG KHÔNG KHÍ KHÔ` bám đúng vào chữ `g/kg` in trên mặt đồng hồ | "tính trên mỗi kilogam không khí khô" — đơn vị đi cùng con số, và câu này có hình riêng |
| 43 | c43 | 121.15–122.37 | trọn mặt ẩm kế, kim chạm vạch đỏ ở cuối thang (fov 28, máy ở `(−1.60, 1.93, −.55)`, điểm nhìn `(−1.74, 1.96, −.95)`); **không thẻ nào đè lên số** trên mặt đồng hồ | "đó là trần của nó" — vạch đỏ vẽ ngay trên mặt đồng hồ |
| 44 | c44 | 122.82–125.22 | bốn thứ trên tường trong một khung (fov 44, máy ở `(−2.15, 1.96, .12)`, điểm nhìn `(−1.90, 1.94, −.95)`): **nhiệt kế ba mươi độ — một thiết bị riêng đặt cạnh tấm vải thử**, **nhiệt kế trong phòng đọc hai mươi lăm độ**, tấm vải thử, và **ẩm kế kim chỉ chín mươi phần trăm**; thẻ `30 °C` khoá vào **đúng đỉnh cột thuỷ ngân**, thẻ `SỨC CHỨA CAO HƠN` chỉ vào **khe giữa kim và vạch đỏ 100 %** (không đè lên mặt đồng hồ) | "nhiệt độ cao hơn thì sức chứa ấy càng cao hơn" — nhiệt kế trong phòng không đổi số; ba mươi độ có phương tiện so sánh riêng |
| 45 | c45 | 125.42–128.08 | cận **tấm vải thử + nhiệt kế ba mươi độ** (fov 38, máy ở `(−2.20, 1.78, −.20)`, điểm nhìn `(−2.18, 1.74, −.92)`): cột thuỷ ngân đúng vạch **30 °C**, thẻ `30 °C` khoá vào đúng đỉnh cột, **hơi nước mỏng bay lên và lan ra hai bên từ tấm vải** (không còn giọt rơi xuống), góc máy khác hẳn c44 | "ba mươi độ thì hơi nước lan xa hơn" — hơi nước phải ra từ vải, không ra từ đồng hồ |
| 46 | c46 | 128.53–133.13 | **một ẩm kế** đọc chín mươi phần trăm (thẻ `90 %` ở đầu kim) bên cạnh **tấm vải thử** (fov 48, máy ở `(−1.72, 1.88, −.38)`, điểm nhìn `(−1.80, 1.82, −.92)`): **hơi nước đặc bốc CHẬM thành cột đụng lên tấm vải**, một vệt gió chạy ngang khung, thẻ `×5` bám vào cột hơi nước; **không còn ẩm kế thứ hai và dấu ngoặc đỏ** (con số của nó không câu nào đọc) | "không khí ẩm chín mươi phần trăm làm nước bay hơi chậm hơn khoảng năm lần" — thẻ phải bám vào một vật, không lơ lửng giữa hai đồng hồ |
| 47 | c47 | 133.33–136.15 | **hiên phơi, cùng bên với c48–c51** (fov 40, máy ở `(−.20, 1.35, 2.30)`, điểm nhìn `(−1.25, 1.05, .82)`): lớp hơi mờ đục **đứng trước** áo ướt, hạt hơi nước lơ lửng trong nắng, thẻ `LỚP HƠI MỜ` chỉ vào lớp hơi | "lớp hơi quanh áo mờ đục" — ngoài hiên cũng có lớp hơi, nhưng mỏng hơn |
| 48 | c48 | 136.60–140.50 | đàn áo chồng và cái áo phơi một mặt trên dây thứ hai (fov 52, máy ở `(.72, 1.62, .40)`, điểm nhìn `(.72, 1.45, −.62)`): hai thẻ `CHỒNG ÁO` và `PHƠI MỘT MẶT` chỉ vào đúng từng đàn, cả hai đàn trọn trong khung | "chồng áo lên nhau, hay phơi một mặt" — phải thấy hai cách phơi khác nhau cùng lúc |
| 49 | c49 | 140.71–143.03 | nhìn xuống **bàn phơi** (fov 50, máy ở `(−.92, 1.30, 2.30)`, điểm nhìn `(−.92, .46, 1.26)`): **hai cái áo nằm cạnh nhau trên mặt bàn gỗ** — bên trái **áo úp** (áo phông úp mép dưới lên: cổ và vai còn lộ, mảng ẩm xanh xám nằm ngang trên mặt gấp, ba giọt nước bám, **màu vải tối lại để không cháy trắng**), bên phải **áo phơi rộng** trải phẳng màu be; thẻ `ÁO ÚP` và `PHƠI RỘNG` **neo vào chính cái áo của mình**, không phải tọa độ cố định | "cái áo úp giữ ẩm lâu hơn cái phơi rộng" — hai cái trong một khung để so |
| 50 | c50 | 143.48–146.82 | toàn cảnh hiên: máy **nâng lên trên thanh lan can** (`y = 1.32`, `z = 2.85`, fov 52 — **khung mở rộng** để lấy trọn cả quần dày lẫn áo thun mỏng) để lan can **không còn che** hai món; quần dày (navy) ở giữa, áo thun mỏng (xanh nhạt) bên phải, hai thẻ `QUẦN DÀY` / `ÁO MỎNG` chỉ đúng vào vật | "quần áo dày giữ nhiều nước hơn" — một mảnh dày, một mảnh mỏng, phải thấy cùng lúc |
| 51 | c51 | 147.02–148.93 | mép khăn: giọt bám trên mép vải rồi mới rơi | "nước tụ ở mép khăn rồi rơi thành giọt" — máy bám theo mép khăn, không để giọt lơ lửng giữa tua |
| 52 | c52 | 149.38–152.86 | góc xa phòng: **lớp hơi quay lại bám quanh áo còn ướt** (mảng sáng xanh bao theo đúng hình áo), **dòng không khí quay về từ phía phòng** (`flow` về mép áo), quạt đã tắt, thẻ `QUAY LẠI BÁM ÁO` chỉ vào lớp hơi | "không khí trong phòng không đi đâu cả" — chỉ đúng khi hình cho thấy không có luồng gió nào |
| 53 | c53 | 153.06–155.20 | khung rộng phòng kín (fov 46, máy ở `(1.05, 1.58, −4.95)`, điểm nhìn `(−.35, 1.45, −6.35)`): **áo ướt treo trong nhà** ở bên trái, **cửa sổ đọng hơi** ở bên phải, quạt đứng yên | "đó là lý do phơi trong nhà lâu khô hơn" — phải thấy áo ướt trong nhà và mặt kính đọng hơi cùng khung |
| 54 | c54 | 155.65–158.51 | **mặt quạt ở tiền cảnh trái, luồng gió chạy qua bàn tay** (fov 36, máy ở `(−1.95, 1.12, −2.70)`, điểm nhìn `(−1.05, 1.02, −3.28)`): ngón tay chĩa về phía quạt, mu bàn tay ngửa ra cho máy, mười giọt mồ hôi bám trên mu bàn tay, tay ở `x = −1.05` đúng chiều gió; **vệt gió chạy đúng tầm bàn tay** (`y ≈ 1.0`, `z = −3.30`, dày gấp 2.6 lần) | "vì sao quạt thổi tay lại thấy mát" — tay là đồ đo, quạt là nguồn gió; cả hai phải cùng khung |
| 55 | c55 | 158.71–160.78 | **nhìn XUỐNG lòng bàn tay** (fov 34, máy ở `(−1.15, 1.40, −2.92)`, điểm nhìn `(−1.03, 1.02, −3.28)`): bàn tay **cùng phía với câu 54**, ngón tay hơi cong (không xòe như chân thú), mười giọt mồ hôi bám trên mặt mu, **vệt gió xanh quét ngang qua đúng tầm da** và hạt mồ hôi bay theo gió ra khỏi da | "hơi nước bám trên da bị gió cuốn đi" — lời chỉ vào "bám trên da" thì phải thấy da, giọt mồ hôi và gió đi qua chúng |
| 56 | c56 | 161.23–163.57 | dây phơi, áo đã nhạt màu | "quần áo khô không phải vì gió sấy nó" — phải thấy áo đã khô trước khi nói vì sao |
| 57 | c57 | 163.77–165.44 | áo trên dây đã khô: màu nhạt, mảng ẩm đã tan, kẹp gỗ ở vai | "quần áo khô vì nước phải đi được" — hình còn lại của mảng ẩm |
| 58 | c58 | 165.64–167.49 | khung rộng hiên, gió có chỗ để đi | "gió chỉ làm cho nước có chỗ để đi" — khoảng trống là nhân vật |
| 59 | c59 | 167.94–170.59 | **lối mở ra hiên** ở hậu cảnh (fov 50, máy ở `(2.14, 1.40, 1.70)`, điểm nhìn `(.90, 1.20, −.90)`): **vệt gió chạy ngang khung** từ lối mở sang trái, **túi nylon vẫy ở tiền cảnh phải**, quần áo đung đưa mạnh hơn, thẻ `CHỖ THOÁNG GIÓ` chỉ vào **túi nylon đang vẫy** (dấu hiệu của gió, không phải một đám bụi) | "hãy treo ở nơi thoáng gió" — lối thông gió là chủ thể, túi vảy là bằng chứng |
| 60 | c60 | 170.79–173.43 | nhìn xuống **hai bàn phơi tách riêng** (fov 48, máy ở `(2.30, 1.16, 2.55)`, điểm nhìn `(.85, .44, 1.36)`): **cả hai bàn và cả hai món** trong khung (áo úp còn nằm ở bàn trái, cái áo lật cạnh ở bàn phải), **khe hở giữa hai bàn** đọc rõ, **không cái nào chồng lên cái nào**; áo bên phải có **góc lật lên, mặt trong tối lộ ra**; thẻ `TÁCH RIÊNG` chỉ vào khe hở giữa hai bàn, thẻ `CẢ HAI MẶT` chỉ vào đúng góc áo đang lật | "phơi cả hai mặt, và không chồng quần áo lên nhau" — kết bằng hình đúng lời |

## Ba khung hình hero

- **Hero 1 — đời thường** (c1, `t ≈ 4.5`): hiên phơi, áo ướt xám có mảng ẩm loang trên dây, bồn chậu ngay dưới, nắng sớm hắt qua sàn gạch. Điểm nhìn là mảng ẩm trên áo.
- **Hero 2 — cơ chế** (c11, `t ≈ 37`): **hai sợi lớn màu kem chạy chéo qua khung**, giữa chúng là **dải nước mỏng** (cầu mao quản nối hai mép sợi, meniscus lõm nhẹ ở giữa) có viền sáng, một giọt nước treo thẳng xuống trong khe. Nền tối, lưới sợi nền **ẩn đi** — chỉ còn hai sợi và khoảng nước giữa chúng. Điểm nhìn là khe nước, không phải một thanh kính ngang.
- **Hero 3 — "à ra thế"** (c36, `t ≈ 103`): máy hạ xuống tầm mặt kính, ba góc nhìn ngang; hai mặt kính mỗi mặt một giọt, vách ngăn dựng thành tấm dày có viền ở giữa, quạt nhỏ trọn khung bên phải, vệt hạt khí đi từ miệng quạt sang mặt kính có gió (giọt nhỏ nhanh); mặt kính sau vách không có gió (giọt nhỏ chậm).

## Kiểm tra theo `STYLE.md`

- **Động cơ**: mọi khung qua `rig/render.js` (siêu mẫu 2×, viền mực, bloom ngưỡng 1, grade mực–giấy), không ACES.
- **Chất liệu**: gạch, giấy dán tường, gỗ, vải, kim loại đều có texture canvas có seed; vải dựng bằng `ExtrudeGeometry` nên có dày và cạnh sắn, không phải mảnh bìa; vải áo có texture dệt (lưới sợi) riêng, không dùng chung texture giấy.
- **Sáng tối**: vùng sáng nhất luôn ở điểm nhìn — đèn tập trung (`focus`) đặt theo điểm nhìn của từng nhát, cường độ riêng cho từng câu (bảng `FOCUS` trong `src/film.js`); các nhát cần góc tối hạ sáng cả phòng (bảng `DIM`).
- **Chiều sâu**: mọi nhát có ≥ 3 lớp (vật cắt mép khung ở tiền cảnh, hành động ở trung cảnh, cửa sổ/đồng hồ/tường ở hậu cảnh).
- **Cơ chế vô hình thành vật thể**: lớp hơi ẩm là mảng alpha bám mặt áo có viền sáng, luồng gió là hạt khí tròn có quán tính, hạt hơi nước là hạt bốc lên, phân tử nước là cụm quả cầu — không mũi tên, không sơ đồ.
- **Máy quay**: đi xuyên không gian khi lời dẫn (vào phòng ở c3, vào trong sợi ở c8, vào mặt nước ở c13, chạm áo ở c20), đứng yên khi cần nhìn (cân, nhiệt kế, ẩm kế).
- **Người**: chỉ có bàn tay, không có nhân vật cố định.
- **Chữ**: phụ đề (`subtitle()`) và **thẻ thuật ngữ** (`label()` — thẻ kem viền mực, chữ đỏ Be Vietnam Pro 900) như `STYLE.md` cho phép. Tập này dùng **41 thẻ**: **11 thẻ số/đếm** đặt trên đúng đồ đo (`2 ÁO`, `1 PHẦN NHỎ`, `2 kJ`, `HAI GIỌT NƯỚC`, `1/2 TỐC ĐỘ`, `2 CÂN`, `3 ÁO`, `20 g/kg`, `30 °C`, `90 %`, `×5`) và **30 thẻ thuật ngữ** đánh dấu vật đang kể (`QUẦN ÁO ƯỚT`, `QUẠT`, `KHÔNG CÓ GIÓ`, `TRƯỚC QUẠT`, `GÓC XA`, `KHÔNG KHÍ KHÔ`, `KHE GIỮA SỢI`, `PHÂN TỬ BAY LÊN`, `LỚP HƠI ẨM`, `BAO HÒA`, `BỊ QUÉT ĐI`, `HƠI NƯỚC BỊ CHỞ ĐI`, `QUÉT XA HƠN`, `DIỆN TÍCH PHƠI`, `NHIỆT ĐỘ`, `ĐỘ ẨM`, `LỚP HƠI MỜ`, `CHỒNG ÁO`, `PHƠI MỘT MẶT`, `ÁO ÚP`, `PHƠI RỘNG`, `QUẦN DÀY`, `ÁO MỎNG`, `QUAY LẠI BÁM ÁO`, `HƠI BỊ CUỐN ĐI`, `NƯỚC PHẢI ĐI ĐƯỢC`, `CHỖ THOÁNG GIÓ`, `TÁCH RIÊNG`, `CẢ HAI MẶT`). Không công thức, không gạch đầu dòng, không câu văn trên thẻ; mỗi thẻ bật trong một đoạn lời và **đuôi thẻ chỉ đúng vào vật nó đánh dấu**.

## Những chỗ đã sửa sau khi soi khung

Vòng 1 (sau phản biện storyboard):

- **Hai áo phải cạnh nhau** (lời c4) → áo B dời về cạnh áo A `(1.25, 1.42, −3.30)`, vẫn nằm ngoài luồng gió; mọi vật bám theo (móc treo, lớp hơi mờ).
- **Luồng gió chỉ ở chỗ có quạt** (lời c6) → nhát c6 quay thẳng vào miệng quạt thay vì quét ngang phòng trống.
- **Giọt nằm ở khe** (lời c11) → thêm giọt nước nhỏ nằm đúng khe giữa các sợi, mảng nước mỏng sáng hơn.
- **Máy quá gần trong sợi** → nhát c10 lùi ra, thấy được cả cấu trúc đan.
- **Đàn áo chồng bị dây phơi thứ nhất che** → máy đứng giữa hai dây, nhìn xuống dây thứ hai.
- **Cái áo úp trên ghế không ra hình** → (vòng 5) thay bằng đạo cụ riêng `foldedShirt()`: áo phông **úp mép dưới lên**, nằm trên sàn cạnh cái áo phơi rộng. Cổ, vai, tay áo còn lộ; mảng ẩm nằm trên mặt gấp; có ba giọt nước bám.
- **Câu c43 không có nhát nào mang** → gộp vào nhóm nhát ẩm kế, riêng c43 là toàn cảnh hiên nhìn ra trời.
- **Bàn thí nghiệm không đọc được** → bàn xoay dọc tường sau, hàng mặt kính chạy ngang khung hình; mặt kính nâng trên đế mảnh, giọt to hơn, quạt nhỏ nằm trong khung.
- **Kim cân không quay được** → kim nằm ngang trên mặt đồng hồ nên phải xoay quanh trục Z của mặt (`needle.rotation.z`), không phải trục Y; nay hai kim chỉ lệch nhau đúng (288 g và 88 g).
- **Áo trên cân bị gán nhầm trạng thái** → cân trái (xa quạt) mang áo còn ẩm (nặng), cân phải (gần quạt) mang áo đã nhạt (nhẹ).
- **Giọt ở mép khăn treo lơ lửng giữa tua** → mép khăn nhăn sóng, có loang ướt, giọt bám đúng mép vải rồi mới rơi; máy bám theo giọt.
- **Gió vẽ thành nét laser** → đổi sang hạt khí tròn, nhỏ, bay theo quán tính.
- **Mặt nước trông như bể chật** → máy nhìn ở tầm mặt nước, thân nước kéo dài ra sau nên không lộ mặt bể; mặt nước có vân sáng riêng.
- **Bàn tay trông như gỗ trong xô** → xoay bàn tay nằm ngang, ngón tay chĩa về phía quạt, mu bàn tay ngửa ra cho máy; mồ hôi bám vào mu bàn tay theo bàn tay.
- **Quần áo cuối phim vẫn ướt** → áo ở hiên và áo sau tay khô dần theo thời gian, nên c56 thấy áo nhạt màu đã khô.

Vòng 2 (soi lại từng khung đã chụp, `review/STORYBOARD-REVIEW.md`):

- **Vùng sáng nhất là bức tường chứ không phải vật đang kể** → đèn tập trung đặt đúng điểm nhìn của từng nhát (`FOCUS`), và các nhát toàn cảnh hạ cường độ xuống.
- **Áo trông khô** → mảng ẩm trên vải đậm hơn và có mép mờ (`blotTex`), màu vải ướt sẫm hơn, thêm vệt nước chảy dọc.
- **Vải trông như bìa carton** → texture dệt riêng (lưới sợi ngang–dọc) cho áo, vải dày hơn và nếp gấy sâu hơn.
- **Mặt nước và vi thể trong sợi bị nhiễu viền mực đen** → bỏ các vòng xoắn quá mỏng trên sợi, thân nước và cụm phân tử dùng quả cầu mềm.
- **Nền chết (tối tuyệt đối) ở N2 và N3** → nền chuyển sắc dần, không còn vùng đen tuyệt đối.
- **Nhiệt kế đọc ra 44 °C** → hiệu chỉnh lại toàn bộ mặt đồng hồ: cột thuỷ ngữ đứng đúng vạch 30 khi câu nói ba mươi độ.
- **Tay không chạm vào vải** → đầu ngón tay chạm hẳn vào mặt áo (đẩy tới `z = −3.20`).
- **Hai giọt trên bàn thí nghiệm giống hệt nhau** → giọt **có gió** nhỏ nhanh hơn, giọt **sau vách ngăn** (không có gió) nhỏ chậm — còn một nửa, đúng `FACTS.md` mục 4. Hình đúng, chính dòng ghi chú này trước đây viết ngược.
- **Đồng hồ treo tường bị cắt ở mép trên khung** → dời sang góc `(−2.30, 1.55, −6.62)`.
- **Cả màn hình là một hình** → tách 26 nhát thành 60 nhát, mỗi câu một bố cục riêng; máy cắt theo nhịp lời.

Vòng 3 (máy đo nhịp `beatsheet.mjs` chấm cờ hình — `SAME` và `RUN`):

- **Một câu không được mang hình của câu trước** → mỗi câu đổi một bố cục thật khác nhau, không còn hai câu liền nhau cùng một mặt sàn và cùng một tấm áo: c26 nhìn chếch lên từ dưới, c27 quay ngược về phía quạt, c28 dọc theo mép tấm áo, c29 sang áo ngoài luồng gió, c30 siêu cận hạt hơi nước, c31 quạt ngay trước máy, c32 rộng cả phòng từ cửa, c33 toàn cảnh góc kệ, c35 quạt nhỏ ở cuối bàn, c36 nhìn từ trên xuống bàn thí nghiệm, c38 áp sát vào ba đồ đo trên tường, c40 nhìn ngang đàn áo, c49 nhìn xuống hai cái áo nằm cạnh nhau trên sàn.
- **Ba câu liền không được đứng trên cùng bộ đạo cụ** → c33, c34, c35, c36, c37 mỗi câu một góc: dọc kệ, cận hai mặt cân, quạt cuối bàn, hai mặt kính, siêu cận giọt.
- **Lớp hơi ẩm phủ kín cả tấm áo** → hạ độ mờ của lớp hơi (mảng, mép sáng và lớp hơi xa), để mặt vải và hơi nước vẫn đọc được.
- **Bàn tay không chạm vào vải** → xoay bàn tay nằm ngang, lòng bàn tay ép vào mặt áo, mu bàn tay quay về máy.
- **Đàn áo chồng không lọt vào khung** → máy hạ xuống ngang đúng đàn áo trên dây thứ hai, đếm được ba cái.
- **Hai giọt trên bàn thí nghiệm giống hệt nhau** → giọt sau vách ngăn nhỏ nhanh hơn giọt có gió, đúng cơ chế.

## Vòng 4 (máy đo nhịp chấm cờ hình — `beatsheet.mjs` chạy lại sau khi đổi góc máy)

Máy đo nhịp chấm bốn loại cờ: `SAME` (câu này mang y hệt câu trước), `RUN` (bốn câu liền đứng trên cùng bộ đạo cụ), `DARK` (khung quá tối), `NUM` (câu nhắc số mà trong khung không có số nào hiện ra). Vòng này xử lý cờ `SAME` và `NUM` — hai cờ còn lại sau vòng 3.

- **Mỗi câu phải có bố cục riêng, không chỉ khác góc** → đo lại từng cặp khung liền nhau bằng chính phép đo của máy (bố cục sáng 16×9 + histogram màu), rồi đổi góc máy cho tới khi hai khung đó khác nhau thật, chứ không chỉ khác chút ít. Kết quả: `beatsheet.mjs` chạy trên 60 câu → **không còn cờ nào**.
- **Cờ `SAME` ở cặp thí nghiệm (c33–c37)** → cả cụm nằm trong một góc phòng tối, mọi thứ cùng tông. Cách sửa: mỗi câu một góc thật khác — c33 toàn cảnh góc kệ (tường tím làm nền), c34 siêu cận hai mặt cân, c35 nhìn ngang dọc mặt bàn (quạt nhỏ ở cuối bàn), c36 nhìn từ trên xuống hai mặt kính, c37 siêu cận giọt sau vách và hạ sáng cả góc (`DIM.c37 = 0.40`) để giọt nổi lên nền tối.
- **Cờ `SAME` ở các cặp còn lại** → c2 dời sang góc ghế gỗ (khung có ghế, gỗ, tường tím thay vì một mảng vải), c11/c12 đảo góc nhìn trong sợi, c26 nhìn lên từ dưới, c31 đặt quạt ngay trước máy, c33 mở rộng, c34 siêu cận, c37 hạ sáng, c40 hạ góc, c54 siêu cận bàn tay, c57 lùi ra để thấy cả cái áo khô.
- **Cờ `NUM`** → số không vẽ được thẳng vào texture 3D, nên mỗi câu có nhắc số đều có một thẻ `label()` (thẻ kem viền mực, chữ đỏ) đặt cạnh đúng đồ đo: `20 g/kg` ở ẩm kế, `30 °C` ở **cột ma đứng cạnh nhiệt kế**, `90 %` ở kim ẩm kế, `2 ÁO` ở cặp áo trong phòng, `3 ÁO` ở đàn áo chồng, `1 PHẦN NHỎ` ở cụm phân tử (thẻ ghi kích thước, không ghi danh từ — danh từ nằm ở thẻ `PHÂN TỬ BAY LÊN` của câu kế). Đây là `label()` mà `STYLE.md` cho phép, không phải thẻ chữ trôi.
- **Mảng ẩm trên áo không hiện ra** → mảng ẩm và vệt nước nằm đúng mặt phẳng với mặt áo nên chồng mặt, run nhấp nháy; nâng chúng ra phía trước mặt vải một chút.
- **Hai áo trên kệ không lọt vào khung** → trước đây đặt toạ độ kiểu thế giới cho một vật đã là con của kệ, nên chúng rơi ra sau tường; nay đặt theo toạ độ trong kệ.
- **Cái áo úp, quần, khăn, túi nylon, bồn chậu, kẹp gỗ, mặt cân** → dựng lại theo đúng cấu tạo thật sau khi bài soi mù của bước vật (`review/PROPS-REVIEW.md`); vòng 5 thêm đạo cụ `foldedShirt()` cho cái áo úp.

## Vòng 5 (phản biện storyboard vòng 4 — mười một câu mất vật chính)

Máy đo nhịp chỉ so bố cục sáng và histogram màu, nên một họ sáu khung "vải kem chiếm gần hết khung" vẫn qua. Vòng này soi từng câu bằng mắt và sửa hai tầng: **vật thể** (đạo cụ) và **góc máy**.

- **Mỗi câu phải có vật chính riêng** → mười một câu bị thiếu vật được trả lại vật: c22 lớp ẩm nhìn chính diện, c23 mép vải với không khí phía trên, c24 cổ áo, c25 mép dưới có giọt bám, c28 mép tay áo, c37 giọt sau vách có mép vách ở tiền cảnh, c38 ba đồ đo trên tường chiếm phần lớn khung, c47 lớp hơi mờ quanh áo ướt ngoài hiên, c50 quần dày và áo thun mỏng cùng khung, c55 mồ hôi bám trên da, c59 túi nylon vẫy giữa khoảng trống.
- **Sáu khung "vải kem" không được giống nhau** → mỗi khung một vật khác nhau: cổ áo, mép tay áo, mép dưới, lớp hơi ở mép, màng nước nhìn chính diện, lớp hơi ngoài hiên.
- **Hero 3 bỏ góc từ trên xuống** → máy hạ xuống tầm mặt kính, fov 36, ba góc nhìn ngang: vách ngăn dựng thành tấm dày có viền ở giữa, quạt nhỏ trọn khung bên phải, vệt hạt khí đi từ miệng quạt sang mặt kính có gió.
- **Hero 1 thẳng tay, thấy trọn bồn chậu** → bỏ độ nghiêng máy, hạ điểm nhìn xuống để bồn chậu và áo ướt cùng nằm trong khung.
- **Cặp c8 ↔ c10 phải khác nhau** → c8 cận khe nước giữa hai sợi (fov 12), c10 lùi xa thấy cả tấm vải đan (fov 30).
- **Đàn áo phải nằm cạnh đồ đo** → c38 bỏ đàn áo khỏi khung: ba thứ được dựng thành **một cụm trên tường** (nhiệt kế – tấm vải – ẩm kế) để đọc được, và vế thứ ba (diện tích phơi) do thẻ `DIỆN TÍCH PHƠI` ở c39 đảm nhiệm.
- **Thẻ số không được đè lên đồ đo** → `20 g/kg` chuyển sang trái mặt ẩm kế, `30 °C` nâng lên cao không che vạch `50`, hai thẻ `TRƯỚC QUẠT` / `GÓC XA` ở c34 tách hẳn nhau (mỗi thẻ một cái cân), thẻ `1 PHẦN NHỎ` neo vào đúng cụm phân tử đang tách ra ở c16 (cụm này có ba phân tử cố định ở mép nước — nên thẻ nói **một phần nhỏ**, không nói *một phân tử*).
- **Số đọc phải đúng** → nhiệt kế trong cảnh **luôn đọc 25 °C**; ba mươi độ ở c44–c45 do **một nhiệt kế riêng** đặt cạnh tấm vải thử trình bày (cột thuỷ ngân đúng vạch 30; cột ma cũ đã bỏ), kim ẩm kế chỉ đúng 90 % ở c46, **mặt cân không in số** (phim không nói con số gam nào nên không vẽ số), mặt ẩm kế bỏ ô số in sẵn (đã có thẻ `20 g/kg`).
- **Đồ đo không được che mất vật** → c4 lùi ra cho hai cái áo trọn khung, cân ra khỏi khung; c38 máy áp sát vào ba đồ đo trên tường để chúng đọc được.
- **c35 lấy lại góc nhìn của bàn thí nghiệm** → máy trước đây nằm ngay trong mặt kính vách ngăn (khung chỉ còn một tấm kính tím chiếm hết bề mặt). Đưa máy ra trước bàn (fov 40, `z = −5.40`) cho thấy trọn: hai mặt kính, hai giọt nước, vách ngăn, quạt và luồng hạt khí; phòng cuối bàn cũng bớt hạ sáng (DIM 0.70 → 0.95).
- **Hai khung đồ đo và một khung áo lấy lại chủ thể** → c41 lùi ra (fov 26) cho trọn mặt ẩm kế, thẻ `20 g/kg` chuyển sang phải mặt đồng hồ (trước đó nằm ngoài khung, người xem không thấy số); c48 lùi xa (fov 40) cho trọn cái áo phơi một mặt, đường biên ẩm/khô chạy ngang thân đọc được; c55 lùi ra (fov 24) để năm ngón tay và ngón cái đọc rõ, đồng thời giọt mồ hôi trên da được đặt lại **trên mặt mu** với bán kính **6–8 mm** (vòng 4: bán kính 2.6–3.6 mm và đặt lệch làm chúng chìm trong da hoặc lơ lửng ngoài da nên c55 không thấy giọt nào) và có điểm sáng trên mặt giọt.
 → c24 mở fov 24 để lộ cả vành cổ, lỗ cổ tối và hai vai (trước đó chỉ thấy một mảng xám không đọc ra là áo); c25 đổi từ nhìn xuống sàn sang nhìn lên từ dưới mép áo, để vải chiếm hai phần ba khung và ba giọt bám theo mép; c55 lùi ra (fov 24) để năm ngón tay và ngón cái đọc rõ, đồng thời giọt mồ hôi trên da nhỏ lại (r 7–11 mm → 3–5 mm) và nhiều mặt hơn, vì ở cự ly cận chúng thành quả cầu trắng vỡ nét.

## Vòng 5b (dựng lại hai khung bị máy đo nhịp báo trùng hình)

Máy đo nhịp vẫn báo `SAME` ở hai cặp: **c10 ↔ c11** (hai khung đều là "sợi màu kem trên nền tím") và **c49 ↔ c50** (hai khung hiên đều kem ấm). Không sửa được bằng góc máy, phải sửa bằng **vật thể**:

- **c10 có vật riêng: một tấm vải đan thật** → thêm đạo cụ `wovenCloth()`: **44 sợi dọc × 44 sợi ngang**, đường kính sợi ≈ 4.2 mm (bán kính 2.1 mm), có **lớp vải nền mờ** phía sau để khe hở không thấy thẳng ra nền, mỗi lần cắt thì đổi trên–dưới (sợi ngang uốn lên–xuống theo cos), sợi không đều tăm tắp (lệch nhẹ, dày mỏng khác nhau), có vân xơ tua. Đặt lệch sang phải–sau trong bối cảnh N2 và **nghiêng** (`Ry 0.20`, `Rx −0.12`) để tấm đan có chiều sâu; máy c10 lùi ra (fov 30, `z = 0.46`) để **trọn tấm đan nằm trong khung** (tấm đan chỉ hiện ở c10, các nhát khác của bối cảnh trong sợi không để lọt tấm đan vào khung) → c10 giờ là "cấu trúc đan", c11 là "khe nước giữa hai sợi", hai hình khác nhau thật (đo: `dl = 0.110`, `dh = 0.287`).
- **c50 thấy trọn hiên** → máy nâng lên (`y = 1.32`, `z = 3.20`, fov 52) để lấy trọn cả dây phơi: quần dày (navy, đậm) ở giữa khung đối chiếu với áo thun mỏng (xanh nhạt) bên phải và khăn vàng. **Hệ quả đã ghi trong bảng nhát: thanh lan can rơi dưới mép khung nên c50 không còn lan can ở tiền cảnh** (khung có lan can là c58).

## Vòng 5c (sửa theo báo cáo soi tài liệu vòng 2 — góc kệ cân)

Báo cáo `review/ASSET-AUDIT-REPORT.md` (vòng 2) chỉ ra ba lỗi **làm hình đọc sai**, không phải lỗi tài liệu:

- **Quạt nhỏ trên kệ nằm ngoài bối cảnh** → nó được đặt ở toạ độ cũ `x ≈ −2.92` *cộng thêm* toạ độ kệ, nên rơi ra sau tường (`z ≈ −11`); lời thoại c33 nói "một áo trước quạt" mà trong khung **không có quạt nào**. Nay quạt đứng ở cuối kệ bên phải (`x ≈ −1.10`, `y = 0.745`), quay ngang sang trái, và vệt hạt khí chạy `x = −1.12 → −1.74`: chạm cái áo ở cân phải (thẻ `TRƯỚC QUẠT`) rồi tắt trước cái áo ở cân trái (thẻ `GÓC XA`) — đúng câu chuyện "một áo trước quạt, một ở góc xa". **Mặt cân không in số**: phim không nói con số gam nào, nên cân chỉ có vạch và kim.
- **Hai áo nhỏ treo trên móc lơ lửng** → trước đó treo ở `z ≈ −6.16`, cách tường (`z = −6.7`) nửa không trung, không bám vào kệ cũng không bám vào tường. Nay có **thanh treo thật ngay trên kệ** (`y ≈ 1.54`, hai móc ngắn) và mỗi áo treo đúng trên một cái cân.
- **Vệt gió trong phòng đi xuyên qua áo B** → vệt gió chạy tới `x = 1.65`, tức quá cái áo B ở `x = 1.25`, trái với lời c29 ("gió đi trượt qua mặt vải"). Nay vệt gió dừng ở `x ≈ 1.05`, trước áo B.

## Số trên hình (cho cờ NUM của máy đo nhịp)

Máy đo nhịp không đọc được số vẽ thẳng vào texture 3D. Ở tập này, mọi câu có nhắc số đều có số hiện ra trên chính cái đồ đo trong khung:

| Câu | Số trong lời | Số hiện trên hình | Cờ NUM |
|---|---|---|---|
| c4 | "hai cái áo giống nhau" | thẻ `2 ÁO` đặt giữa hai cái áo trong phòng | hết cờ — số hiện trong khung |
| c16 | "một phần nhỏ" | thẻ `1 PHÂN TỬ` đặt cạnh cụm phân tử ở mặt nước | hết cờ — số hiện trong khung |
| c33 | "hai cái cân… một áo trước quạt, một ở góc xa" | hai thẻ `TRƯỚC QUẠT` và `GÓC XA` ở hai cái cân (không vẽ số gam nào) | hết cờ — câu này không nói số |
| c34 | "hai cái kim lệch nhau" | hai mặt cân không in số, hai kim chỉ lệch nhau | hết cờ — câu này không nói số |
| c40 | "ba cái áo phơi chồng lên nhau" | thẻ `3 ÁO` đặt trên đàn áo chồng | hết cờ — số hiện trong khung |
| c41 | "khoảng hai mươi gam hơi nước" | thẻ `20 g/kg` cạnh ẩm kế | hết cờ — số hiện trong khung |
| c45 | "ba mươi độ" | thẻ `30 °C` chỉ vào **đỉnh cột thuỷ ngân của một nhiệt kế riêng** (nhiệt kế treo trong phòng vẫn đọc 25 °C) | hết cờ — số hiện trong khung |
| c46 | "không khí ẩm chín mươi phần trăm" | thẻ `90 %` ở kim ẩm kế, vạch đỏ ở 100 % là trần của nó; thẻ `×5` bám vào **cột hơi nước bốc chậm** | hết cờ — số hiện trong khung |
| c21 | "hơn hai kilojoule" | thẻ `2 kJ` đặt cạnh mép áo A trong luồng gió | hết cờ — số hiện trong khung |
| c36 | "hai giọt nước, một bên có gió, một bên không" | thẻ `HAI GIỌT NƯỚC` đặt cạnh hai mặt kính | hết cờ — số hiện trong khung |

(`beatsheet.mjs` không đọc được chữ vẽ trong texture 3D, nên số phải hiện bằng thẻ `label()` — thẻ kem viền mực chữ đỏ, đúng kiểu `STYLE.md` cho phép. Các thẻ này là số đọc trên đồ đo, không phải chữ trôi trên màn hình.)

## Cách dựng lại các khung này

```sh
LEMO_ANGLE=vulkan node core/render/still.mjs channels/tram-nghi-nhieu/series/do-vat/tap-01-phoi-quan-ao 4.5 37 103 --out /tmp/khung
```

(`core/render/still.mjs` chụp ngay sau lệnh vẽ nên đôi khi ảnh ra là khung trước; khi cần độ chính xác thì chụp từng khung, hoặc dùng bản chụp có chờ hai khung hình.)

## Vòng 6 (dựng lại những nhát mất vật chính + lớp thẻ thuật ngữ)

Báo cáo soi tài liệu vòng 3 (`review/ASSET-AUDIT-REPORT.md`) nêu ba nhát kể câu chuyện về quạt mà **trong khung không có quạt**: c6 (*"chỗ nào có quạt thì mới có gió"*), c31 (*"gió mạnh hơn, lớp ẩm bị quét xa hơn"*) và c54 (*"vì sao quạt thổi tay lại thấy mát"*). Ba máy này đã dựng lại:

- **c5** — lùi ra góc phòng (fov 46): quạt ở tiền cảnh trái **bị cắt mép khung** (lớp chiều sâu), áo A trong luồng gió, áo B ở góc xa.
- **c6** — máy đặt **trên trục luồng gió**, nhìn miệng quạt từ trước-phải (fov 30): miệng quạt trọn khung, gió đi ra bên phải.
- **c31** — máy lùi sang phải rồi lùi xa (fov 56, `(0.85, 1.34, −2.05)` → `(0.05, 1.15, −3.60)`): quạt bàn ở **tiền cảnh trái, mặt quạt quay thẳng về phía máy** nên lưới và cánh đọc rõ (đã chụp và xem lại), **áo A trọn khung ở giữa**, vệt hạt khí chạy từ miệng quạt qua mép áo sang phải, lớp hơi ẩm trên áo mỏng đi và bị đẩy xuống gió.
- **c54** — máy đưa ra **trước** quạt: mặt quạt, luồng gió và bàn tay cùng khung; tay dời vào đúng chiều gió (`x = −.55`).
- **c55** — cận mu bàn tay (fov 30): không có quạt trong khung, chỉ có luồng gió quét qua da.

Cùng đợt này, lớp thẻ được thay bằng **một hệ thống thẻ duy nhất** (`CARDS` trong `src/film.js`): mỗi thẻ có **cửa sổ bật** theo câu (bật từ `t1` của câu trước đến `t1` của câu cuối), **đuôi thẻ vẽ ở khoảng cách cố định từ mép thẻ** nên neo vào vật bằng cách lệch thẻ một khoảng `bw/2+26, −(bh/2+44)`, và thẻ **bị kẹp trong khung** cùng nằm trên dải phụ đề. Phụ đề **không** được đăng ký vào danh sách chữ (như tập đã bàn giao) để dải phụ đề không bị tính nhầm. Kết quả kiểm: `readcheck` đạt (29 thẻ trong khung đủ thời gian đọc), `scenecheck` đạt (khung có chữ 60 %).

## Vòng 7 (dàn lại cặp đối chiếu ở c49–c60)

Bài soi tài liệu vòng 5 (`review/ASSET-AUDIT-REVIEW-5.md`) bắt buộc **"cái áo úp phải đọc ra là cái áo"**. Nhưng đạo cụ cũ (`tShirt` khoác lên lưng ghế) nhìn từ máy chỉ là một mảng vải dựng đứng — không cổ, không tay áo — và thẻ `ÁO ÚP` chỉ vào một mặt ghế trống. Nay:

- **Đạo cụ mới** `foldedShirt()`: áo phông **úp mép dưới lên**, nếp gấp là một nửa trụ bán kính 18 mm (gấp cứng sẽ làm mép nếp thành đường răng cưa), mảng ẩm của nửa dưới nằm **trên mặt gấp**, ba giọt nước bám, cổ áo nằm ở nửa trên nên không bị úp phủ.
- **Chỗ đứng**: cả hai cái áo nằm **trên sàn gạch hiên**, cạnh nhau — đúng lời c49 ("hai cái trong một khung để so"). Chiếc ghế trở lại là ghế hiên bình thường.
- **c49**: máy ở `(0.20, 1.74, 2.58)` nhìn `(0.20, 0.02, 1.31)`, fov 46; vệt nắng rơi **giữa** hai cái áo nên không vải nào bị cháy sáng; `FOCUS` hạ `3.0 → 2.2`.
- **c60**: máy ở `(−0.50, 1.86, 2.24)` nhìn `(−0.50, 0.02, 1.72)`, fov 30 — cái áo úp **không lọt vào khung**.

Hai mẹo trong bài soi vòng 5 cũng đã sửa và **soi lại bằng ảnh thật**:

- *"Áo phông thứ hai" bị "áo thun mỏng" che* → `teeBack` dời sang `x = 0.85`, có kẹp gỗ riêng; ở c50/c56/c58/c59 hai cái áo đọc ra là hai cái riêng.
- *Ba giọt bám mép đọc thành ba hạt tối* → mọi giọt bám nay nằm ở **lớp FX** (không viền mực) và có một quả cầu trắng làm điểm sáng; ở c25 chúng đọc ra là giọt nước.
- *Lớp hơi ẩm ở c52–c53 đọc thành tấm kính* → `mistFar` nay là vỏ mỏng chép theo nếp vải áo B, alpha mờ dần về rìa.

## Vòng 8 (bối cảnh trong sợi vải — dựng lại nhát c9–c12)

Bài soi storyboard vòng 5 (`review/STORYBOARD-REVIEW-5.md`) chấm **Hero 2 (c11) hỏng**: khung là *"hai tấm nghiêng màu bìa tạo chữ V, một que xanh lạnh cắt ngang hai tấm ở góc vuông"*, và người xem tắt tiếng **không đoán được đang xem gì**. Nguyên nhân gốc: trong bối cảnh N2, **mọi nhát cùng chia sẻ một bàn sợi** — 10 sợi lớn chồng lên nhau ở cự ly siêu cận, nên mọi khung đều là "một mớ sợi", không phải một vật. Nay:

- **Mỗi nhất trong ruột vải chỉ có MỘT vật chính** (`N2VIS` trong `src/film.js`): lưới sợi nền được gắn nhãn `aux`, hai sợi lớn gắn nhãn `hero`; theo nhát, `aux` ẩn đi và chỉ để lại vật chính.
  - **c8** — khe nước giữa hai sợi (chỉ hai sợi lớn + màng nước).
  - **c9** — sợi mảnh có giọt nước đọng trên đó (đạo cụ `dropOnThread()`, một mình trên nền tối).
  - **c10** — **trọn tấm vải đan** `wovenCloth()` nghiêng (`Ry 0.20`, `Rx −0.12`) trên nền tối; máy lùi ra (fov 30, `z = 0.46`).
  - **c11** — **hai sợi lớn chạy chéo khung, giữa chúng là dải nước** (xem dưới); máy nhìn chếch xuống khe (fov 24, `z = 0.16`).
  - **c12** — một sợi lớn trên nền tối, vệt nước là mảng mờ nhỏ bám trên mặt sợi (fov 24).
- **Nước trong khe giờ là một CẦU MÀO QUẢN** nối liền hai mép sợi: mặt nước nâng lên gần đỉnh sợi (`−DIP·0.30` thay vì `−DIP·0.78`), thêm một dải mỏng bắc ngang khe với meniscus lõm nhẹ ở giữa, mép sáng ở hai bên. Trước đó mặt nước nằm sâu dưới đỉnh sợi nên máy nhìn chếch xuống chỉ thấy một đường sáng mảnh — đọc như que neon.
- **Nền bối cảnh N2 bớt tím**: nền từ `#5c5175 → #221f33`, đèn chính ấm hơn (`#fff2dc`), ánh phụ bớt lệch tím — sợi bông màu kem trước đây bị ánh tím biến thành bìa carton.
- **Nét mực trong bối cảnh N2 mảnh lại** (`thick 3.4 → 2.2`, `ref 0.18 → 0.34`): 96 sợi vải đan vẽ viền mực từng sợi thành một mớ chữ, không còn đọc ra là vải.
- **c55** — máy chuyển từ *nhìn dọc theo ngón tay* (năm ngón dính thành một cục) sang *nhìn chếch từ trên, ngón tay nằm ngang khung* (fov 34, `z = −2.62`); bàn tay xoay `Ry(0.28)`.

## Vòng 9 (áo ướt phải thấy ra là áo ướt; kim đồng hồ khớp lời)

- **Vải ướt phải TỐI HƠN HẲN** — đây là lỗi của cả các nhát c1–c2 trước đây: miếng vải ướt chỉ sẫm hơn ~1/3 (`wetMul` chuẩn hoá theo `lum(dry) × 0.64`), mà hiên nắng sớm làm mặt áo chói lên quá 1.0; bậc "soft shoulder" của bộ màu nén lại, nên vùng ướt và vùng khô ra **cùng một sắc** — khung chỉ còn một mảng vải phẳng, không đọc ra là nước còn nằm trên vải. Nay vải ướt sẫm còn ~2/3 (`lum(dry) × 0.34`) và ngả lạnh nhẹ: **đường triều nước chạy ngang méo mó** đọc được ngay.
- **c2** — máy **ngước lên** (điểm nhìn `y = .98`) để đường triều nằm trong khung, không chỉ thấy một mảng ẩm phẳng.
- **c25** — máy hạ xuống `z = −2.55`, điểm nhìn `y = .72`: mép áo và ba giọt bám nằm giữa khung, không phải dưới mép.
- **c50** — khung siết lại (fov 52 → 44, `z = 2.85`): không còn mảng tối trống trên và mảng sàn trống dưới.
- **c54** — máy **sát bàn tay** (`z = −2.92`, fov 40): bàn tay chiếm giữa khung, quạt lùi sang mép trái; trước đây bàn tay nhỏ, đọc như búp bê gỗ.
- **Kim ẩm kế khớp với lời** — c41–c42 nói không khí *"chứa được tối đa"* 20 g/kg nên kim **chỉ hết cung (bão hoà)**; c46 nói không khí ẩm *chín mươi phần trăm* nên kim chỉ 90. Trước đây cả hai nhát đều để kim ở 90, nên thẻ `20 g/kg` chỉ vào một kim chỉ 90 — người xem không tin con số trên thẻ.

## Vòng 10 (đoạn mặt nước — dựng lại sáu nhát c13–c18 và hai thẻ thuật ngữ)

Máy đo nhịp báo c13–c18 là **sáu hình giống nhau**: cùng một mặt nước xanh, cùng một góc máy thấp, không nhát nào có vật chính riêng. Thêm nữa, hai thẻ `1 PHÂN TỬ` và `HƠI NƯỚC` **chỉ vào chỗ trống** — thẻ bám vào toạ độ `x ≈ 0` trong khi máy quay lúc đó lại quay về phía bờ ở `x ≈ −0.98`, nên đuôi thẻ chỉ vào khoảng không. Nay toàn bộ đoạn được dựng lại theo đúng vật thật:

| Nhát | Lời | Máy | Vật chính trong khung |
|---|---|---|---|
| c13 | "Muốn rời khỏi vải, nước phải đổi thành hơi nước." | fov 34, `p (−.45, .13, .55)` → `l (−.95, .03, .05)` | mép bờ, mép bọt trắng, mặt nước |
| c14 | "Mình sẽ đi xem điều đó xảy ra thế nào." | fov 30, `p (.42, .10, .52)` → `l (−.30, .05, −.25)` | mặt nước trải ra, nắng rọi trên gợn sóng |
| c15 | "Ở mặt nước, các phân tử cứ nhảy lung tung." | fov 28, `p (−.035, .070, .175)` → `l (.005, .021, .005)` | các phân tử nhảy trên mặt nước, nhìn từ trên xuống |
| c16 | "Chỉ một phần nhỏ đủ năng lượng để bứt ra ngoài." | fov 22, `p (.115, .078, .245)` → `l (.048, .052, .010)` | **một phân tử đang bay lên**, thẻ `1 PHÂN TỬ` chỉ vào nó |
| c17 | "Phân tử bay lên mang theo năng lượng của nó." | fov 24, `p (.075, .032, .225)` → `l (.048, .058, .008)` | cùng phân tử, nhìn từ thấp, nền là trời, thẻ `HƠI NƯỚC` |
| c18 | "Phần nước còn lại thì mát đi." | fov 30, `p (.20, .085, .46)` → `l (−.85, .02, −.20)` | mặt nước xanh sâu lạnh, bờ ở xa |

- **Hình phân tử nước**: một cầu ô xi **đỏ** + hai cầu hiđro **trắng** xếp chữ V (góc 104,5°). Trước đây là một quả cầu trắng trơn có điểm sáng — đọc ra là quả trứng, không phải nước. Ba phân tử cố định ở mép nước, các cụm trong lớp nước và phân tử đang bay đều dùng chung hình này.
- **Thẻ bám vào vật thật**: `do1pt` và `dohoi` không còn đặt toạ độ cứng; chúng lấy **vị trí thật của phân tử đang bay** (`ESC_POS()` trong `src/film.js`), nên đuôi thẻ luôn chỉ vào vật. Thẻ được đẩy sang phải thêm 86 px (`dx`) để không đè lên vật.
- **Mép bờ ở bối cảnh N3 hạ xuống** (`y = −.03 → −.058`): trước đây thanh gỗ tối cắt ngang bầu trời thành một dải nâu ở các nhát thấp.
- **c9** (giọt nước bám trên sợi): máy lùi ra (`fov 12 → 19`) — ở tiêu cự cũ giọt nước chỉ là một quả cầu xanh không đọc ra là giọt.

Các sửa về vật dựng (bồn chậu, bàn tay, khăn terry, sợi dệt, giọt trên sợi, mép bọt mặt nước) ghi ở `COMPONENTS_SPEC.md`, mục "Vòng 10".

### Sửa nốt c18 (cờ DARK của máy đo nhịp)

Nhát c18 ("Phần nước còn lại thì mát đi") bị máy đo nhịp gắn cờ **DARK**: vùng sáng nhất của giữa khung chỉ đạt 0,28 (< 0,32). Nguyên nhân: khi làm cảnh mát đi, mã cắt bớt cả đèn lẫn màu nước (`#6f9ad6`, độ đục 0,80, đèn 1,9) — nước mát đi thành **một mảng xanh tối**, mất luôn cả dấu hiệu "đây là mặt nước". Nay nước vẫn lạnh màu nhưng **sáng**: màu `#a8cdf0`, độ đục 0,86, đèn tập trung 2,9 (`FOCUS c18` 1,9 → 2,4).

## Vòng 11 (sáu câu c13–c18 thành ba bố cục; vật thể tự diễn; mốc nhịp cho mỗi câu)

- **Mốc nhịp cho mỗi câu**: `src/film.js` gọi `markBeat(ev, id, t0, d, [x, y])` cho cả 60 câu. Mốc là chỗ thẻ thuật ngữ của câu bám vào; câu không có thẻ thì lấy điểm máy đang nhìn. Toạ độ chiếu theo đúng ống kính của nhát đó (`toScreen`), nên máy biết câu nào đang kể mà không có hình.
- **Sáu câu c13–c18 thành ba bố cục**: c13 (cận mép nước) / c15 (rộng, **cả mặt nước**) / c17 (thấp, ngước lên, rộng) / c18 (rộng, góc đối diện). Trước đây c13 và c18 gần như một bức, c14–c15 cũng gần nhau — máy đo nhịp báo trùng hình.
- **Câu 33–34 không còn là phóng to**: c34 đứng lệch bên phải (`x = −.98`), nhìn chéo qua hai mặt cân; c33 là toàn cảnh góc kệ. Thẻ `2 CÂN` đổi thành `HAI CÂN` (đúng chữ câu 33 nói) và sống suốt cả hai câu.
- **Câu 35 nhìn từ trên xuống**: thấy trọn bàn thí nghiệm — bố cục khác hẳn c34 và c36.
- **Câu 37 siêu cận giọt**: giọt chiếm gần hết khung, vòng nét đứt làm thước đo, **hơi nước bốc lên thành hạt nhỏ** từ giọt (giọt không có gió, nhưng vẫn bay hơi).
- **Vật thể tự diễn**: hai áo nhỏ trên thanh kệ **đung đưa** (áo trước quạt mạnh hơn áo ở góc xa), **kim hai cái cân rung nhẹ**, **dải gió trên kệ** chạy từ quạt sang trái, **gió nhẹ ngoài hiên** trôi qua dây phơi (câu 47–60).
- **Vệt gió ở kệ đi lên**: trước đây vệt chạy ngang *dưới* hai cái áo, không chạm áo nào.

### Khung đã xem (để vòng sau không mở lại)

- `sheet_1.jpg` (vòng 11, dựng 5 nhát 33–37): **c33, c34, c35, c36, c37 — đã sửa cả năm**.
- Những nhát chưa xem riêng trong vòng này: c13–c18, c47–c60. Xem bằng tờ `sheet_*.jpg` của máy đo nhịp, mở riêng khung nào tờ chưa đủ.

## Vòng 12 (vòng chấm hình ảnh vòng 4: ba lỗi chặn và mười lỗi nhỏ)

Ba lỗi chặn của vòng 4 đều là lỗi **hình thật**, không phải lỗi bố cục; mười lỗi nhỏ nữa là lỗi thẻ và lỗi khung. Tất cả đã sửa ở mã, và bảng nhát ở trên viết lại theo đúng mã.

- **c60 — khung toàn tường be trơn, hai thẻ dồn mép phải, một thẻ bị cắt cụt**: máy dựng lại toàn khung `(2.30, 1.16, 2.55)` → `(.85, .44, 1.36)`, fov 48. **Hai bàn phơi, khe hở giữa hai bàn và cái áo úp lật góc** đều trong khung. Thẻ `TÁCH RIÊNG` chỉ vào **khe hở**; thẻ `CẢ HAI MẶT` bám vào **đúng góc áo đang lật** (lấy từ `flipCorner.getWorldPosition()`, không gõ tay).
- **c46 — thẻ "KHÔNG KHÍ KHÔ" chĩa vào kim đọc ~50 %**: thẻ sai **xoá hẳn**. Câu 46 nói "không khí ẩm chín mươi phần trăm", nên **50 % chỉ được đo bằng đồng hồ, không được gọi tên bằng thẻ**. Khung còn lại: hai đồng hồ (một bên `90 %`), dấu ngoặc đỏ, thẻ `×5`.
- **c5 → c6 → c7 — hệ quả trước tác nhân**: vệt nhạt trên cái áo trước quạt **chỉ bắt đầu sau khi câu 5 đã nói xong** (`cmpFade0 = V.L['c5'].t1`). Ở c5 hai áo còn ướt nguyên; đến c7 cái áo trước quạt mới nhạt đi.
- **c25 — dải ẩm bão hoà không đọc được**: máy lùi ra (`(.22, 1.20, −1.85)` → `(.42, 1.02, −3.28)`, fov 40) để **cả tấm áo** trong khung; lớp hơi mỏng đi (`opacity .16`).
- **c31 — không thấy quạt**: máy sang phải (`(1.20, 1.25, −2.50)` → `(.20, 1.12, −3.30)`, fov 46): quạt ở tiền cảnh trái, vệt gió chạy từ miệng quạt qua mép áo. Ngoài ra **cặp áo thí nghiệm của câu 4–7 ẩn đi ở mọi nhát khác** (trước đó là "cái quạt lạ ở góc phải").
- **c35–c37 — quạt thổi vào cả hai mặt kính**: vách ngăn có **mặt kính mờ riêng** (`opacity .30`), luồng gió dừng ngay trước vách. c37 dựng lại: **hai giọt cùng khung**, giọt sau vách to hơn, giọt có gió nhỏ đi — vòng nét đứt là thước đo, giọt có gió còn **đúng một nửa vòng**, giọt sau vách còn **ba phần tư**. Thẻ `TỐC ĐỘ CHẬM 1/2` chỉ vào giọt **sau vách**.
- **c42 — gần như một hình với c41**: cận vòng gam/kg (fov 30) với thẻ riêng `MỔI KG KHÔNG KHÍ KHÔ` **bám vào chữ `g/kg` in trên mặt đồng hồ**.
- **c44–c45 — thẻ `30 °C` chĩa vào que đỏ, ẩm kế đứng yên**: cột "ma" 30 °C **đậm lên** (`scale ×2`, `opacity .72`), **kim ẩm kế rơi** khi nhiệt độ lên tới ba mươi độ (thẻ `SỨC CHỨA CAO HƠN`).
- **c19–c20 — câu "mình thấy lạnh ngay" không có dấu hiệu lạnh**: thẻ `LẠNH` ở c19 và ở bàn tay ở c20.
- **c21 — thẻ `2 kJ` thiếu "/g" và thiếu "hơn"**: thẻ đổi thành `HƠN 2 kJ / 1 g`.
- **c7, c39, c40**: c7 lùi để quạt nhỏ ra khỏi khung; c39 dịch điểm nhìn sang `−1.00` cho ba đồ đo và đàn áo cùng khung; c40 hạ máy xuống `(.10, 1.62, .50)`, fov 36.
- **Tầng kỹ thuật**: `camera.updateMatrixWorld(true)` trước khi chiếu điểm bám (không có bước này, mọi điểm bám rơi sai chỗ và máy đo nhịp đo hộp trên điểm rác); neo của thẻ ưu tiên **điểm tĩnh** (`mark`) khi vật đang bay.
