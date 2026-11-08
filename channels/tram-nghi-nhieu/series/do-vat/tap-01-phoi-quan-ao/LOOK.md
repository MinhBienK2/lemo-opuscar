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

## 60 nhát: một câu một hình

| # | Câu | Mốc (giây) | Nhìn gì | Lý do của góc máy |
|---|---|---|---|---|
| 1 | c1 | 2.40–6.07 | hiên: áo ướt trên dây, bồn chậu trọn khung ngay dưới, máy không nghiêng | mở đầu đời thường, giọng kể như người vừa đi ngang sân |
| 2 | c2 | 6.27–9.42 | cận **nửa dưới tấm áo ướt** trên dây phơi (fov 34, máy ở `(−.95, 1.06, 1.78)`, điểm nhìn `(−1.25, .78, .85)`): **vệt ẩm loang** trên vải, **mép vải cong**, **ba giọt bám mép**, sàn gạch và cọc phơi bên cạnh — trước đây siêu cận vải chỉ lấp đầy khung bằng một mảng vải phẳng, không đọc ra là nước còn nằm trên vải | "nó còn ở trên vải" — máy đi tới chỗ nước còn nằm trong vải, không nhìn lại cả căn hiên |
| 3 | c3 | 9.87–13.90 | phòng kín: quạt bàn | "mình làm thí nghiệm nhỏ" — dựng đạo cụ trước khi kể |
| 4 | c4 | 14.10–17.10 | hai cái áo trọn vẹn trong khung, cổ và vai cạnh nhau, cân ngoài khung | "hai cái áo giống nhau treo cạnh nhau" phải thấy được cả hai cùng khung |
| 5 | c5 | 17.30–20.47 | góc tối của phòng (máy lùi ra góc, fov 46): **quạt ở tiền cảnh trái, bị cắt mép khung** (một lớp chiều sâu), áo A trong luồng gió ở giữa, áo B ở góc xa trong vũng sáng nhỏ | "một cái ở góc xa, không có gió" — hạ sáng cả phòng, chỉ một vũng sáng nhỏ ở góc xa; quạt phải **thấy được** chứ không chỉ có vệt hạt khí |
| 6 | c6 | 20.67–24.20 | đẩy thẳng vào miệng quạt (fov 30, máy đặt **trên trục luồng gió**, nhìn từ trước-phải): miệng quạt trọn khung, luồng gió đi ra bên phải | máy đi theo lời "chỗ nào có quạt thì mới có gió": đầu quạt là chỗ gió bắt nguồn, và **quạt phải có trong khung** |
| 7 | c7 | 24.40–27.39 | hai áo: một nhạt dần, một vẫn sẫm | "cái trước quạt đang nhạt màu dần" — hai áo trong một khung để thấy chênh lệch |
| 8 | c8 | 27.84–29.03 | N2: cận sợi vải, giọt nước ở chính giữa | "nước không tự mất đi" — vào trong sợi trước, thấy nước vẫn còn |
| 9 | c9 | 29.23–31.72 | N2: giọt nước đọng trên sợi, có điểm sáng | "nó phải đổi thành thứ khác" — giọt là thứ phải đổi, nên giọt là chủ thể |
| 10 | c10 | 32.17–35.14 | N2: sát tấm vải đan, cấu trúc luồn–lướn chiếm trọn khung | "mình thấy các sợi vải đan qua nhau" — máy vào sát tấm đan để thấy sợi dọc luồn qua sợi ngang |
| 11 | c11 | 35.34–38.53 | N2: mảng nước mỏng nằm trong khe giữa hai sợi | "nước nằm ở khe giữa các sợi" — đẩy vào đúng khe, sợi làm khung |
| 12 | c12 | 38.73–40.86 | N2: rìa sợi, vệt nước loang trong xơ | "ở rìa sợi, nó thành vệt trong xơ" — cận mép sợi, vệt nước là chủ thể |
| 13 | c13 | 41.31–43.77 | N3: mặt nước là **một dải sáng nằm ngang**, thân nước tối ở dưới, phân tử bám đúng dải đó | "nước phải đổi thành hơi nước" — mặt nước phải thấy được như một mặt phẳng, không phải một mảng xanh nghiêng |
| 14 | c14 | 43.97–45.96 | N3: chân trời thấp, mặt nước là một vệt sáng dưới không khí tối | "mình sẽ đi xem điều đó xảy ra thế nào" — nhát chuyển cảnh, hạ camera xuống tầm mặt nước |
| 15 | c15 | 46.41–48.81 | N3: ba mươi độ trên mặt, phân tử nhảy lên rồi rơi xuống | "các phân tử cứ nhảy lung tung" — vừa thấy các phân tử vừa thấy mặt chúng nhảy trên |
| 16 | c16 | 49.01–51.34 | N3: cận cụm phân tử ở mặt nước, thẻ `1 PHÂN TỬ` chỉ vào phần đang tách ra | "chỉ một phần nhỏ đủ năng lượng" — cận để thấy phần lớn vẫn nằm yên, chỉ một rời đi |
| 17 | c17 | 51.79–54.04 | N3: một phân tử bay lên, mang theo vệt sáng | "phân tử bay lên mang theo năng lượng của nó" — máy đi theo phân tử đang bay |
| 18 | c18 | 54.24–55.75 | N3: ngang mặt nước, màu nước chuyển xanh sâu | "phần nước còn lại thì mát đi" — mặt nước tối đi và nguội hẳn màu |
| 19 | c19 | 56.20–59.41 | tấm áo ướt trong phòng | "nước lấy nhiệt từ chính cái vải" — chủ thể là tấm áo, không phải cả phòng |
| 20 | c20 | 59.61–61.52 | bàn tay chạm vào tấm áo ướt rồi rút lại | "chạm vào nó, mình thấy lạnh ngay" — chạm là động tác, phải thấy tay |
| 21 | c21 | 61.72–65.12 | áo trong luồng gió, hơi nước bốc lên từ mặt vải | "mỗi gram nước lấy hơn hai kilojoule nhiệt" — hơi nước bốc từ chính tấm áo |
| 22 | c22 | 65.57–68.81 | màng ẩm nhìn chính diện trên mặt áo A, viền sáng, phía trên còn không khí | "nước chỉ bay hơi đều hơn khi không khí ngay trên vải còn trống" — lớp hơi là thứ che đường đi |
| 23 | c23 | 69.01–71.01 | mép vải ở dưới khung, phía trên là không khí trống có hạt hơi nước | "chỗ trống đó, hơi nước mới đi được" — mép vải làm mốc, không khí làm chủ thể |
| 24 | c24 | 71.21–74.60 | cận cổ áo **từ bên phải** (fov 30, máy ở `(.78, 1.30, −2.62)`, điểm nhìn `(.44, 1.38, −3.24)`): vành cổ, lỗ cổ tối, hai vai, **lớp hơi ẩm bám sát mặt vải** (độ đục .34, viền sáng .55) đọc ra như một màng kính mờ quanh cổ, dây phơi và kẹp ở trên, đồng hồ đỏ, cân và cửa sổ kín phía sau cho chiều sâu (trước đây fov 16 chỉ lấy một mảng vải phẳng, không đọc ra cổ áo) | "mỏng như một tấm kính mờ" — cổ áo là mốc để đọc độ mỏng của lớp hơi |
| 25 | c25 | 75.05–77.84 | máy **thấp hơn mép áo và ngẩng lên** (fov 42, máy ở `y = .50`, điểm nhìn `y = .95`): trong khung có **cả mép dưới tấm áo (ở đáy khung), ba giọt bám theo mép (giọt có điểm sáng trắng, đọc ra là nước chứ không phải hạt tối), lớp hơi ẩm bám sát mặt áo (ở trên)**; phía sau là **tường phòng tối** cùng hai mặt kính bàn thí nghiệm ở góc phải — **không thấy cửa sổ kín** (áo A che hết tầng sau) | "lớp đó bám sát vải, nhanh chóng bị bão hoà" — giọt bám theo mép, không trôi lơ lửng |
| 26 | c26 | 78.04–80.03 | nhìn chếch lên từ dưới (fov 36, máy ở `(.62, .62, −2.76)`, điểm nhìn `(.44, 1.05, −3.26)`): vai áo, **kẹp gỗ móc áo trên dây**, **lớp hơi ẩm bám sát vải** (độ đục .30, viền .48) đọc ra như màng kính mờ ôm lấy vải, **hạt hơi nước bay lên chậm** (`vapRise` bật ở c26) | "từ đó, nước bay hơi chậm lại" — máy ở dưới tấm áo, nhìn lên lớp hơi phủ kín chỗ có vải |
| 27 | c27 | 80.48–84.27 | nhìn ngược lại: gió từ miệng quạt bay sang | "gió thổi tới, lớp ẩm bị quét đi" — quay ngược để thấy gió đến từ đâu |
| 28 | c28 | 84.47–86.44 | nhìn dọc theo mép tay áo, hạt khí trượt qua bề mặt vải | "gió làm đường đi của hơi nước ngắn lại" — đường đi ngắn thì thấy được như một đường thẳng |
| 29 | c29 | 86.89–87.92 | áo B nằm ngoài luồng gió: gió đi trượt qua mặt vải mà **nửa dưới áo vẫn sắc navy sẫm, có đường triều nước và bốn giọt bám**; **không có vệt hạt hơi nước nào trong khung** (vệt hơi nước bị gió chở đi chỉ bật ở c30–c31) | "gió không sấy nước" — quay sang cái áo ngoài luồng gió, thấy gió đi qua mà vải không khô |
| 30 | c30 | 88.12–89.33 | siêu cận hạt hơi nước đã rời mặt áo, cỡ hạt không đều, có vệt mềm | "gió chở hơi nước đi" — hạt hơi nước đã rời vải thì bay theo gió, không bám nữa |
| 31 | c31 | 89.78–92.19 | máy lùi sang phải rồi lùi xa (fov 56, máy ở `(0.85, 1.34, −2.05)`, điểm nhìn `(0.05, 1.15, −3.60)`): **quạt bàn ở trái, quay mặt thẳng về phía máy** nên đọc rõ lưới và cánh chứ không phải vỏ động cơ; **áo A trọn khung ở giữa**, vệt hạt khí chạy từ miệng quạt qua mép áo sang phải, thẻ `HƠI NƯỚC BỊ CHỞ ĐI` ở mép phải; lớp hơi ẩm trên áo mỏng đi (`opacity .10`) và bị đẩy xuống gió (`+0.14 x`) cho đúng câu "lớp ẩm bị quét xa hơn" | "gió mạnh hơn, lớp ẩm bị quét xa hơn" — đầu quạt là nơi lực gió bắt đầu; quạt phải **có mặt** trong khung |
| 32 | c32 | 92.39–93.83 | khung rộng phòng kín nhìn từ cửa: hai áo trên thanh, cửa sổ kín ở hậu cảnh | "nên nước bốc hơi nhanh hơn" — kết luận của cả chặng, cần nhìn được cả phòng |
| 33 | c33 | 94.28–98.01 | toàn cảnh góc kệ: hai cái cân, hai áo nhỏ treo trên thanh ngay trên kệ, **quạt nhỏ ở cuối kệ bên phải** thổi ngang sang trái | "hai cái cân, một áo trước quạt, một ở góc xa" — nhìn cả góc phòng để thấy quạt, vệt gió và áo nào nằm trong gió |
| 34 | c34 | 98.21–99.46 | cận hai mặt cân: hai kim chỉ lệch nhau (288 g và 88 g) | "hai cái kim lệch nhau" — số phải đọc được trên mặt đồng hồ |
| 35 | c35 | 99.91–101.53 | góc ba phần tư của bàn thí nghiệm: hai mặt kính trên bệ gỗ, mỗi mặt một giọt nước, vách ngăn dựng đứng ở giữa, quạt nhỏ ở mép phải thổi hạt khí sang mặt kính bên phải | "Một thí nghiệm đơn giản trên bàn" — phải thấy trọn bộ dụng cụ trước khi vào từng bên |
| 36 | c36 | 101.73–104.53 | ngang tầm mặt kính, ba góc: hai mặt kính mỗi mặt một giọt, vách ngăn dựng ở giữa, quạt nhỏ trọn khung bên phải, vệt hạt khí đi từ miệng quạt | "hai giọt nước, một bên có gió, một bên không" — phải thấy cả hai giọt lẫn vách ngăn ở giữa |
| 37 | c37 | 104.73–107.16 | giọt sau vách ngăn có meniscus và điểm sáng, mép vách ở tiền cảnh bên trái | "không có gió thì tốc độ bay hơi rơi còn một nửa" — giọt là thứ bị đo, vách cho biết nó nằm bên nào |
| 38 | c38 | 107.61–109.70 | nhiệt kế và ẩm kế chiếm khoảng một phần ba khung, đàn áo ở góc phải | "ba thứ quyết định tốc độ" — hai đồ đo phải đọc được, đàn áo cho biết chúng đo cho cái gì |
| 39 | c39 | 109.90–112.48 | cận mặt nhiệt kế, vạch 10–50 | "nhiệt độ, độ ẩm, và diện tích phơi" — đọc được vạch trên mặt đồng hồ |
| 40 | c40 | 112.68–115.11 | đàn áo ba cái chồng trên dây thứ hai, thẻ `3 ÁO` chỉ vào đàn | "ba cái áo phơi chồng lên nhau" — đếm được đúng ba cái |
| 41 | c41 | 115.56–118.74 | mặt ẩm kế trọn mặt đồng hồ (0–100, vạch đỏ ở 100), thẻ `20 g/kg` đứng bên phải chỉ vào đồ đo | "chứa được tối đa khoảng hai mươi gam hơi nước" — con số phải nằm trên chính đồ đo |
| 42 | c42 | 118.94–120.95 | ẩm kế đầy khung, kim ở vạch | "tính trên mỗi kilogam không khí khô" — đơn vị đi cùng con số |
| 43 | c43 | 121.15–122.37 | siêu cận vạch đỏ ở cuối thang của ẩm kế | "đó là trần của nó" — vạch đỏ vẽ ngay trên mặt đồng hồ |
| 44 | c44 | 122.82–125.22 | cột thuỷ ngữ dâng lên vạch 30 | "nhiệt độ cao hơn thì sức chứa ấy càng cao hơn" — cột là thứ đo |
| 45 | c45 | 125.42–128.08 | nhiệt kế và ẩm kế cùng khung | "ba mươi độ thì hơi nước lan xa hơn" — hai đồ đo cùng lúc |
| 46 | c46 | 128.53–133.13 | siêu cận kim ẩm kế ở chín mươi phần trăm | "không khí ẩm chín mươi phần trăm" — vạch đỏ ở 100 % là trần |
| 47 | c47 | 133.33–136.15 | lớp hơi mờ đục quanh áo ướt ngoài hiên, hạt hơi nước lơ lửng trong nắng | "lớp hơi quanh áo mờ đục" — ngoài hiên cũng có lớp hơi, nhưng mỏng hơn |
| 48 | c48 | 136.60–140.50 | cả cái áo phơi một mặt trên dây thứ hai: nửa trên đã khô, nửa dưới còn ẩm với đường biên méo mó, có giọt bám | "chồng áo lên nhau, hay phơi một mặt" — vệt ẩm chạy ngang thân |
| 49 | c49 | 140.71–143.03 | nhìn xuống sàn hiên (fov 46, máy ở `(0.20, 1.74, 2.58)` nhìn `(0.20, 0.02, 1.31)`): **hai cái áo nằm cạnh nhau** — bên trái **áo phơi rộng** trải phẳng, nửa ngoài nửa trong thông (cổ áo, hai vai, đường may giữa đọc rõ), bên phải **áo úp** (áo phông úp mép dưới lên: cổ và vai còn lộ, mảng ẩm xanh xám nằm ngang trên mặt gấp, ba giọt nước bám); vệt nắng rơi **giữa** hai cái nên không vải nào bị cháy sáng | "cái áo úp giữ ẩm lâu hơn cái phơi rộng" — hai cái trong một khung để so |
| 50 | c50 | 143.48–146.82 | toàn cảnh hiên: máy **nâng lên trên thanh lan can** (`y = 1.32`, `z = 3.20`, fov 52) để lan can **không còn che** quần dày và áo thun mỏng — thanh lan can rơi dưới mép khung, **không thấy lan can trong ảnh** (khung c58 mới thấy lan can ở góc trái); quần dày (navy) ở giữa, áo thun mỏng (xanh nhạt) bên phải, hai thẻ `QUẦN DÀY` / `ÁO MỎNG` chỉ đúng vào vật | "quần áo dày giữ nhiều nước hơn" — một mảnh dày, một mảnh mỏng, phải thấy cùng lúc |
| 51 | c51 | 147.02–148.93 | mép khăn: giọt bám trên mép vải rồi mới rơi | "nước tụ ở mép khăn rồi rơi thành giọt" — máy bám theo mép khăn, không để giọt lơ lửng giữa tua |
| 52 | c52 | 149.38–152.86 | góc xa phòng: lớp hơi quay lại bám quanh áo còn ướt, quạt đã tắt | "không khí trong phòng không đi đâu cả" — chỉ đúng khi hình cho thấy không có luồng gió nào |
| 53 | c53 | 153.06–155.20 | khung rộng phòng kín, quạt tắt | "đó là lý do phơi trong nhà lâu khô hơn" — phòng kín là nhân vật của cảnh |
| 54 | c54 | 155.65–158.51 | **mặt quạt ở tiền cảnh trái, luồng gió chạy qua bàn tay** đưa vào giữa luồng (mu bàn tay ngửa ra cho máy, tay xoay nghiêng `Ry(π/2)` nên nằm ngang qua luồng gió, không chồng lên ống kính), tay ở `x = −.55` (đúng chiều gió) | "vì sao quạt thổi tay lại thấy mát" — tay là đồ đo, quạt là nguồn gió; cả hai phải cùng khung |
| 55 | c55 | 158.71–160.78 | cận mu bàn tay (fov 30, máy ở trước-trên bàn tay): bàn tay **xoay `Ry(π)` để mặt mu ngửa lên cho máy** (nếu không, lớp mồ hôi nằm khuất dưới lòng bàn tay và không giọt nào đọc được); năm ngón + ngón cái đọc rõ, mười giọt mồ hôi nhỏ (r 6–8 mm) bám **trên mặt mu** bàn tay, có điểm sáng trên mặt giọt, hạt gió xanh quét ngang qua — **không có quạt trong khung**, chỉ có luồng gió | "hơi nước bám trên da bị gió cuốn đi" — lời chỉ vào "bám trên da" thì phải thấy da và giọt mồ hôi |
| 56 | c56 | 161.23–163.57 | dây phơi, áo đã nhạt màu | "quần áo khô không phải vì gió sấy nó" — phải thấy áo đã khô trước khi nói vì sao |
| 57 | c57 | 163.77–165.44 | áo trên dây đã khô: màu nhạt, mảng ẩm đã tan, kẹp gỗ ở vai | "quần áo khô vì nước phải đi được" — hình còn lại của mảng ẩm |
| 58 | c58 | 165.64–167.49 | khung rộng hiên, gió có chỗ để đi | "gió chỉ làm cho nước có chỗ để đi" — khoảng trống là nhân vật |
| 59 | c59 | 167.94–170.59 | túi nylon vẫy trên hiên, có khoảng trống xung quanh, nền là tường sáng | "hãy treo ở nơi thoáng gió" — vật nhẹ bị gió đẩy là hình của chỗ thoáng |
| 60 | c60 | 170.79–173.43 | nhìn gần thẳng xuống (fov 30, máy ở `(−0.50, 1.86, 2.24)` nhìn `(−0.50, 0.02, 1.72)`): **áo phơi rộng trải trên sàn hiên**, nửa ngoài sáng và nửa trong tối, cổ áo ở trên — cả hai mặt phơi ra; cái áo úp không lọt vào khung | "phơi cả hai mặt, và không chồng quần áo lên nhau" — kết bằng hình đúng lời |

## Ba khung hình hero

- **Hero 1 — đời thường** (c1, `t ≈ 4.5`): hiên phơi, áo ướt xám có mảng ẩm loang trên dây, bồn chậu ngay dưới, nắng sớm hắt qua sàn gạch. Điểm nhìn là mảng ẩm trên áo.
- **Hero 2 — cơ chế** (c11, `t ≈ 37`): hai sợi lớn ở tiền cảnh tạo chữ V, màng nước mỏng trong suốt bám sát mép hai sợi có viền sáng, một giọt nước đang treo với mặt meniscus, một sợi chéo mờ ở nền sau. Điểm nhìn là khe nước, không phải một thanh kính ngang.
- **Hero 3 — "à ra thế"** (c36, `t ≈ 103`): máy hạ xuống tầm mặt kính, ba góc nhìn ngang; hai mặt kính mỗi mặt một giọt, vách ngăn dựng thành tấm dày có viền ở giữa, quạt nhỏ trọn khung bên phải, vệt hạt khí đi từ miệng quạt sang mặt kính có gió (giọt nhỏ nhanh); mặt kính sau vách không có gió (giọt nhỏ chậm).

## Kiểm tra theo `STYLE.md`

- **Động cơ**: mọi khung qua `rig/render.js` (siêu mẫu 2×, viền mực, bloom ngưỡng 1, grade mực–giấy), không ACES.
- **Chất liệu**: gạch, giấy dán tường, gỗ, vải, kim loại đều có texture canvas có seed; vải dựng bằng `ExtrudeGeometry` nên có dày và cạnh sắn, không phải mảnh bìa; vải áo có texture dệt (lưới sợi) riêng, không dùng chung texture giấy.
- **Sáng tối**: vùng sáng nhất luôn ở điểm nhìn — đèn tập trung (`focus`) đặt theo điểm nhìn của từng nhát, cường độ riêng cho từng câu (bảng `FOCUS` trong `src/film.js`); các nhát cần góc tối hạ sáng cả phòng (bảng `DIM`).
- **Chiều sâu**: mọi nhát có ≥ 3 lớp (vật cắt mép khung ở tiền cảnh, hành động ở trung cảnh, cửa sổ/đồng hồ/tường ở hậu cảnh).
- **Cơ chế vô hình thành vật thể**: lớp hơi ẩm là mảng alpha bám mặt áo có viền sáng, luồng gió là hạt khí tròn có quán tính, hạt hơi nước là hạt bốc lên, phân tử nước là cụm quả cầu — không mũi tên, không sơ đồ.
- **Máy quay**: đi xuyên không gian khi lời dẫn (vào phòng ở c3, vào trong sợi ở c8, vào mặt nước ở c13, chạm áo ở c20), đứng yên khi cần nhìn (cân, nhiệt kế, ẩm kế).
- **Người**: chỉ có bàn tay, không có nhân vật cố định.
- **Chữ**: phụ đề (`subtitle()`) và **thẻ thuật ngữ** (`label()` — thẻ kem viền mực, chữ đỏ Be Vietnam Pro 900) như `STYLE.md` cho phép. Tập này dùng **29 thẻ**: **10 thẻ số/đếm** đặt trên đúng đồ đo (`2 ÁO`, `1 PHÂN TỬ`, `2 kJ`, `288 g`, `88 g`, `HAI GIỌT NƯỚC`, `3 ÁO`, `20 g/kg`, `30 °C`, `90 %`) và **19 thẻ thuật ngữ** đánh dấu vật đang kể (`QUẦN ÁO ƯỚT`, `QUẠT`, `CHỖ NÀO CÓ QUẠT`, `KHE GIỮA SỢI`, `HƠI NƯỚC`, `LỚP HƠI ẨM`, `BAO HÒA`, `BỊ QUÉT ĐI`, `HƠI NƯỚC BỊ CHỞ ĐI`, `NHIỆT ĐỘ`, `PHƠI MỘT MẶT`, `ÁO ÚP`, `QUẦN DÀY`, `ÁO MỎNG`, `QUAY LẠI BÁM ÁO`, `MỒ HÔI`, `NƯỚC PHẢI ĐI ĐƯỢC`, `CHỖ THOÁNG GIÓ`, `CẢ HAI MẶT`). Không công thức, không gạch đầu dòng, không câu văn trên thẻ; mỗi thẻ bật trong một đoạn lời và **đuôi thẻ chỉ đúng vào vật nó đánh dấu**.

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

- **Một câu không được mang hình của câu trước** → mỗi câu đổi một bố cục thật khác nhau, không còn hai câu liền nhau cùng một mặt sàn và cùng một tấm áo: c26 nhìn chếch lên từ dưới, c27 quay ngược về phía quạt, c28 dọc theo mép tấm áo, c29 sang áo ngoài luồng gió, c30 siêu cận hạt hơi nước, c31 quạt ngay trước máy, c32 rộng cả phòng từ cửa, c33 toàn cảnh góc kệ, c35 quạt nhỏ ở cuối bàn, c36 nhìn từ trên xuống bàn thí nghiệm, c38 lùi ra xa khỏi tường, c40 nhìn ngang đàn áo, c49 nhìn xuống hai cái áo nằm cạnh nhau trên sàn.
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
- **Cờ `NUM`** → số không vẽ được thẳng vào texture 3D, nên mỗi câu có nhắc số đều có một thẻ `label()` (thẻ kem viền mực, chữ đỏ) đặt cạnh đúng đồ đo: `288 g` và `88 g` ở hai cái cân, `20 g/kg` ở ẩm kế, `30 °C` ở nhiệt kế, `90 %` ở kim ẩm kế, `2 ÁO` ở cặp áo trong phòng, `3 ÁO` ở đàn áo chồng, `1 PHÂN TỬ` ở cụm phân tử. Đây là `label()` mà `STYLE.md` cho phép, không phải thẻ chữ trôi.
- **Mảng ẩm trên áo không hiện ra** → mảng ẩm và vệt nước nằm đúng mặt phẳng với mặt áo nên chồng mặt, run nhấp nháy; nâng chúng ra phía trước mặt vải một chút.
- **Hai áo trên kệ không lọt vào khung** → trước đây đặt toạ độ kiểu thế giới cho một vật đã là con của kệ, nên chúng rơi ra sau tường; nay đặt theo toạ độ trong kệ.
- **Cái áo úp, quần, khăn, túi nylon, bồn chậu, kẹp gỗ, mặt cân** → dựng lại theo đúng cấu tạo thật sau khi bài soi mù của bước vật (`review/PROPS-REVIEW.md`); vòng 5 thêm đạo cụ `foldedShirt()` cho cái áo úp.

## Vòng 5 (phản biện storyboard vòng 4 — mười một câu mất vật chính)

Máy đo nhịp chỉ so bố cục sáng và histogram màu, nên một họ sáu khung "vải kem chiếm gần hết khung" vẫn qua. Vòng này soi từng câu bằng mắt và sửa hai tầng: **vật thể** (đạo cụ) và **góc máy**.

- **Mỗi câu phải có vật chính riêng** → mười một câu bị thiếu vật được trả lại vật: c22 lớp ẩm nhìn chính diện, c23 mép vải với không khí phía trên, c24 cổ áo, c25 mép dưới có giọt bám, c28 mép tay áo, c37 giọt sau vách có mép vách ở tiền cảnh, c38 hai đồ đo chiếm một phần ba khung, c47 lớp hơi mờ quanh áo ướt ngoài hiên, c50 quần dày và áo thun mỏng cùng khung, c55 mồ hôi bám trên da, c59 túi nylon vẫy giữa khoảng trống.
- **Sáu khung "vải kem" không được giống nhau** → mỗi khung một vật khác nhau: cổ áo, mép tay áo, mép dưới, lớp hơi ở mép, màng nước nhìn chính diện, lớp hơi ngoài hiên.
- **Hero 3 bỏ góc từ trên xuống** → máy hạ xuống tầm mặt kính, fov 36, ba góc nhìn ngang: vách ngăn dựng thành tấm dày có viền ở giữa, quạt nhỏ trọn khung bên phải, vệt hạt khí đi từ miệng quạt sang mặt kính có gió.
- **Hero 1 thẳng tay, thấy trọn bồn chậu** → bỏ độ nghiêng máy, hạ điểm nhìn xuống để bồn chậu và áo ướt cùng nằm trong khung.
- **Cặp c8 ↔ c10 phải khác nhau** → c8 cận sợi vải (fov 26), c10 lùi xa thấy cả cấu trúc đan (fov 52).
- **Đàn áo phải nằm cạnh đồ đo** → đàn áo trên dây thứ hai dời về `x = −0.95` (từ `x = +0.28`), đủ gần hai đồ đo trên tường để c38 có cả ba trong khung.
- **Thẻ số không được đè lên đồ đo** → `20 g/kg` chuyển sang trái mặt ẩm kế, `30 °C` nâng lên cao không che vạch `50`, `288 g` và `88 g` tách hẳn nhau (mỗi thẻ một khoảng trống riêng ở c33 và c34), thẻ `1 PHÂN TỬ` neo vào đúng cụm phân tử đang tách ra ở c16.
- **Số đọc phải đúng** → nhiệt kế đứng đúng vạch 30 ở c44–c45, kim ẩm kế chỉ đúng 90 % ở c46, mặt cân có số **0–400 g** đọc được (đúng thang của hai thẻ `288 g` và `88 g`), mặt ẩm kế bỏ ô số in sẵn (đã có thẻ `20 g/kg`).
- **Đồ đo không được che mất vật** → c4 lùi ra cho hai cái áo trọn khung, cân ra khỏi khung; c38 máy lùi xa để cả nhiệt kế lẫn ẩm kế cùng đàn áo lọt vào khung.
- **c35 lấy lại góc nhìn của bàn thí nghiệm** → máy trước đây nằm ngay trong mặt kính vách ngăn (khung chỉ còn một tấm kính tím chiếm hết bề mặt). Đưa máy ra trước bàn (fov 40, `z = −5.40`) cho thấy trọn: hai mặt kính, hai giọt nước, vách ngăn, quạt và luồng hạt khí; phòng cuối bàn cũng bớt hạ sáng (DIM 0.70 → 0.95).
- **Hai khung đồ đo và một khung áo lấy lại chủ thể** → c41 lùi ra (fov 26) cho trọn mặt ẩm kế, thẻ `20 g/kg` chuyển sang phải mặt đồng hồ (trước đó nằm ngoài khung, người xem không thấy số); c48 lùi xa (fov 40) cho trọn cái áo phơi một mặt, đường biên ẩm/khô chạy ngang thân đọc được; c55 lùi ra (fov 24) để năm ngón tay và ngón cái đọc rõ, đồng thời giọt mồ hôi trên da được đặt lại **trên mặt mu** với bán kính **6–8 mm** (vòng 4: bán kính 2.6–3.6 mm và đặt lệch làm chúng chìm trong da hoặc lơ lửng ngoài da nên c55 không thấy giọt nào) và có điểm sáng trên mặt giọt.
 → c24 mở fov 24 để lộ cả vành cổ, lỗ cổ tối và hai vai (trước đó chỉ thấy một mảng xám không đọc ra là áo); c25 đổi từ nhìn xuống sàn sang nhìn lên từ dưới mép áo, để vải chiếm hai phần ba khung và ba giọt bám theo mép; c55 lùi ra (fov 24) để năm ngón tay và ngón cái đọc rõ, đồng thời giọt mồ hôi trên da nhỏ lại (r 7–11 mm → 3–5 mm) và nhiều mặt hơn, vì ở cự ly cận chúng thành quả cầu trắng vỡ nét.

## Vòng 5b (dựng lại hai khung bị máy đo nhịp báo trùng hình)

Máy đo nhịp vẫn báo `SAME` ở hai cặp: **c10 ↔ c11** (hai khung đều là "sợi màu kem trên nền tím") và **c49 ↔ c50** (hai khung hiên đều kem ấm). Không sửa được bằng góc máy, phải sửa bằng **vật thể**:

- **c10 có vật riêng: một tấm vải đan thật** → thêm đạo cụ `wovenCloth()`: **44 sợi dọc × 44 sợi ngang**, đường kính sợi ≈ 4.2 mm (bán kính 2.1 mm), có **lớp vải nền mờ** phía sau để khe hở không thấy thẳng ra nền, mỗi lần cắt thì đổi trên–dưới (sợi ngang uốn lên–xuống theo cos), sợi không đều tăm tắp (lệch nhẹ, dày mỏng khác nhau), có vân xơ tua. Đặt lệch sang phải–sau trong bối cảnh N2; máy c10 vào sát (fov 34, `z = 0.22`) để **tấm đan chiếm trọn khung** (tấm đan chỉ hiện ở c10, các nhát khác của bối cảnh trong sợi không để lọt tấm đan vào khung) → c10 giờ là "cấu trúc đan", c11 là "khe nước giữa hai sợi", hai hình khác nhau thật (đo: `dl = 0.110`, `dh = 0.287`).
- **c50 thấy trọn hiên** → máy nâng lên (`y = 1.32`, `z = 3.20`, fov 52) để lấy trọn cả dây phơi: quần dày (navy, đậm) ở giữa khung đối chiếu với áo thun mỏng (xanh nhạt) bên phải và khăn vàng. **Hệ quả đã ghi trong bảng nhát: thanh lan can rơi dưới mép khung nên c50 không còn lan can ở tiền cảnh** (khung có lan can là c58).

## Vòng 5c (sửa theo báo cáo soi tài liệu vòng 2 — góc kệ cân)

Báo cáo `review/ASSET-AUDIT-REPORT.md` (vòng 2) chỉ ra ba lỗi **làm hình đọc sai**, không phải lỗi tài liệu:

- **Quạt nhỏ trên kệ nằm ngoài bối cảnh** → nó được đặt ở toạ độ cũ `x ≈ −2.92` *cộng thêm* toạ độ kệ, nên rơi ra sau tường (`z ≈ −11`); lời thoại c33 nói "một áo trước quạt" mà trong khung **không có quạt nào**. Nay quạt đứng ở cuối kệ bên phải (`x ≈ −1.10`, `y = 0.745`), quay ngang sang trái, và vệt hạt khí chạy `x = −1.12 → −1.74`: chạm cái áo ở cân phải (88 g) rồi tắt trước cái áo ở cân trái (288 g) — đúng câu chuyện "một áo trước quạt, một ở góc xa".
- **Hai áo nhỏ treo trên móc lơ lửng** → trước đó treo ở `z ≈ −6.16`, cách tường (`z = −6.7`) nửa không trung, không bám vào kệ cũng không bám vào tường. Nay có **thanh treo thật ngay trên kệ** (`y ≈ 1.54`, hai móc ngắn) và mỗi áo treo đúng trên một cái cân.
- **Vệt gió trong phòng đi xuyên qua áo B** → vệt gió chạy tới `x = 1.65`, tức quá cái áo B ở `x = 1.25`, trái với lời c29 ("gió đi trượt qua mặt vải"). Nay vệt gió dừng ở `x ≈ 1.05`, trước áo B.

## Số trên hình (cho cờ NUM của máy đo nhịp)

Máy đo nhịp không đọc được số vẽ thẳng vào texture 3D. Ở tập này, mọi câu có nhắc số đều có số hiện ra trên chính cái đồ đo trong khung:

| Câu | Số trong lời | Số hiện trên hình | Cờ NUM |
|---|---|---|---|
| c4 | "hai cái áo giống nhau" | thẻ `2 ÁO` đặt giữa hai cái áo trong phòng | hết cờ — số hiện trong khung |
| c16 | "một phần nhỏ" | thẻ `1 PHÂN TỬ` đặt cạnh cụm phân tử ở mặt nước | hết cờ — số hiện trong khung |
| c33 | "hai cái cân… một áo trước quạt, một ở góc xa" | thẻ `288 g` và `88 g` ở hai cái cân (đúng số kim chỉ) | hết cờ — số hiện trong khung |
| c34 | "hai cái kim lệch nhau" | hai mặt cân, kim trái chỉ 288 g, kim phải chỉ 88 g | hết cờ — số hiện trong khung |
| c40 | "ba cái áo phơi chồng lên nhau" | thẻ `3 ÁO` đặt trên đàn áo chồng | hết cờ — số hiện trong khung |
| c41 | "khoảng hai mươi gam hơi nước" | thẻ `20 g/kg` cạnh ẩm kế | hết cờ — số hiện trong khung |
| c45 | "ba mươi độ" | thẻ `30 °C` cạnh nhiệt kế, cột thuỷ ngữ đứng đúng vạch 30 | hết cờ — số hiện trong khung |
| c46 | "không khí ẩm chín mươi phần trăm" | thẻ `90 %` ở kim ẩm kế, vạch đỏ vẽ ở 100 % là trần của nó | hết cờ — số hiện trong khung |
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
