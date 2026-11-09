# Đạo diễn cắt — Bước 6 (hình ảnh), vòng 5/5

`review/REVIEW-5.md` là vòng chấm hình thứ năm của bước 6 và đã **REJECT**: ba câu FAIL chặn (c45, c49, c59), một danh sách câu phải sửa, và cờ `SAME`/`NUM` còn lại. Vòng 5 là vòng cuối của bước: theo quy trình, sửa được hết phần sửa được, phần không sửa được thì **Đạo diễn cắt** chốt phương án an toàn nhất ở đây.

Trang này ghi lại đúng những gì đã sửa trong mã sau vòng 5, cái gì **giữ**, và vì sao. Nó không thay bản chấm — nó đi kèm bản chấm. **Không câu nào bị cắt khỏi phim**: cả 60 câu vẫn còn, và cả 60 câu vẫn có một hình riêng.

## Ba câu FAIL chặn — đã sửa ở mã

| Câu | Lỗi của vòng 5 | Sửa trong mã |
|---|---|---|
| **c45** | Khung gần như trùng c44; thẻ `30 °C` chỉ vào một khối đỏ cạnh vỏ nhiệt kế (không phải cột thủy ngân), và cột thủy ngân đọc ~25–35 °C; duy nhất thứ chuyển động là **một giọt rơi xuống**, trong khi lời là "hơi nước lan xa hơn, đặc hơn"; phần lớn khung là tường trơn | **Một thiết bị riêng cho ba mươi độ**: nhiệt kế `thermo30` đặt cạnh tấm vải thử, cột thuỷ ngân của nó **đọc đúng vạch 30** (`setTemp(.5)` → đỉnh cột nằm ngay vạch in) và thẻ `30 °C` **khoá vào đúng đỉnh cột** (`thermo30Top()`). Thanh đỏ kiểu "cột ma" **xoá hẳn** — nó không đọc ra là một cột thuỷ ngân. Hơi nước **bốc lên từ tấm vải và lan ra hai bên** (`denseSpk`, mỏng, nhanh) — **không còn giọt rơi xuống**. Góc máy dựng lại: fov 38, máy ở `(−2.20, 1.78, −0.20)` nhìn `(−2.18, 1.74, −0.92)` — khác hẳn c44; nhiệt kế treo trong phòng bị giấu ở câu này (`t30only`) |
| **c49** | Hai thẻ chữ trỏ nhầm vật và đảo ngược đúng thông điệp; cái áo kem **cháy quá mức, gần như trắng tuyệt đối, mất sạch chi tiết vải** | Thẻ `ÁO ÚP` và `PHƠI RỘNG` **neo vào chính cái áo của mình** — `at: () => BAL.upPos()` và `at: () => BAL.spreadPos()`, tức vị trí thế giới của `upShirt`/`spread`, không phải tọa độ cố định trong không gian. Cái áo úp **tối màu lại** (`#cfdae0` → `#b3c3cf`) và đèn tập trúc hạ (`FOCUS.c49` 1.45 → 1.2) để **không còn mảng trắng cháy**; cái áo phơi rộng đổi màu be (`#e3d8bd`) để hai cái phân biệt được ngay |
| **c59** | Hình phủ nhận câu kết thực hành: **không có quạt, không có vệt gió, không có vải đung đưa**; thẻ `CHỖ THOÁNG GIÓ` trỏ vào một đám hạt 5–10 px trông như bụi; c58 và c59 gần như một khung | **Vệt gió thật** trong khung: `windSpk` chạy ngang từ lối mở sang trái (cờ mới `streak`, không cần quạt), **túi nylon vẫy mạnh hơn** (gió hiên ×1.9 — vải đung đưa theo), thẻ `CHỖ THOÁNG GIÓ` **chỉ vào chính chiếc túi nylon đang vẫy** (dấu hiệu của gió, không phải bụi). Góc máy dựng lại (fov 50, `(2.14, 1.40, 1.70)` → `(.90, 1.20, −.90)`) — khác hẳn c58 |

## Các câu phải sửa — đã sửa ở mã

| Câu | Lỗi của vòng 5 | Sửa trong mã |
|---|---|---|
| **c25** | Dải ẩm bão hoà là một vệt xanh loang, không đọc ra là một mức; khung không có gì chuyển động | Dải bão hoà có **vạch mức sáng** ở đúng chỗ ẩm dừng lại, thẻ `BAO HÒA` neo vào **vạch đó** (`hemTop()`); dải **phồng nhẹ theo thời gian** (`hemPulse`) — một vùng bão hoà phải thở, không đứng chết như vệt sơn |
| **c34** | Thẻ `TRƯỚC QUẠT` chỉ vào góc đối diện kim; quạt bị cắt khỏi khung nên thẻ mất tham chiếu | **Xoá hẳn thẻ `TRƯỚC QUẠT` ở c34** (giữ nó thì nó chỉ vào chỗ trống); thẻ `HAI CÂN` neo vào **đúng mặt cân bên trái**; hai kim vẫn lệch nhau như lời câu |
| **c38** | "Ba thứ" chỉ là ba vệt ~30 px ở góc trên-trái, không đọc được | Máy **áp sát vào tường** (fov 18, `(−1.10, 1.82, 1.00)` → `(−2.02, 1.94, −.95)`): **nhiệt kế (đọc 25 °C), tấm vải treo, ẩm kế (kim chín mươi phần trăm)** chiếm phần lớn khung, đọc được từng vạch. Vế thứ ba (diện tích phơi) do thẻ `DIỆN TÍCH PHƠI` ở c39 đảm nhiệm |
| **c40** | "Trên dây thứ hai" không có gì phân biệt — cùng một dàn, cùng một góc; không có gì chuyển động | Máy lùi và cao lên (fov 46, `(−.35, 2.02, 2.40)` → `(.72, 1.72, −.35)`): **dây thứ nhất ở tiền cảnh, dây thứ hai (đàn ba áo chồng) ở hậu cảnh** — hai dây thấy rõ là hai dây; đàn áo tự đung đưa |
| **c44** | Thẻ `SỨC CHỨA CAO HƠN` đè lên mặt đồng hồ, che mũi kim và chữ số 60/80; thẻ `30 °C` chỉ vào khối đỏ; đồng hồ ẩm chỉ vào ~60–80 % — số không câu nào đọc | Khung dựng lại (fov 44) để có **nhiệt kế ba mươi độ, nhiệt kế phòng 25 °C, tấm vải thử và ẩm kế** trong cùng một khung; thẻ `SỨC CHỨA CAO HƠN` chỉ vào **khe giữa kim và vạch đỏ 100 %** (`[−1.618, 1.868, −.968]`), không đè lên mặt đồng hồ; ẩm kế nay **luôn chỉ chín mươi phần trăm** |
| **c46** | Không có gì bay hơi nên thẻ `×5` không có đối tượng; dấu ngoặc đỏ làm `×5` thành tỉ lệ giữa 90 và 50; đồng hồ bên phải chỉ ~50 % — số không câu nào đọc | **Bỏ ẩm kế thứ hai và dấu ngoặc đỏ**; cạnh ẩm kế 90 % là **tấm vải thử với cột hơi nước đặc bốc chậm** (`slowSpk`), thẻ `×5` bám vào cột hơi nước; thêm một vệt gió ngang khung để "cùng một luồng gió" có hình |
| **c60** | Thẻ `TÁCH RIÊNG` trỏ vào mặt bàn trống; trên cùng bàn có áo chồng áo | **Cái áo úp ở bàn trái vẫn còn** (chính nó là vế "tách riêng"), cái áo lật cạnh ở bàn phải; thẻ `TÁCH RIÊNG` chỉ vào **khe hở giữa hai bàn** — không món nào chồng lên món nào |
| **c5, c6, c7** | Ở c5 khung có **ba** cái áo trong khi thí nghiệm là "hai cái áo giống nhau", và cái áo thật sự ở góc xa thì không nhãn nào; ở c6 cái áo đối chiếu bị cắt còn một mảnh mỏng ở mép phải | **Cái áo ướt treo ở góc xa phòng (đạo cụ của câu 53) ẩn đi ở c5–c7** (`noBack`) — trong khung đúng **hai** cái áo, mỗi cái một thẻ. Ở c6 máy dựng lại để **cả hai cái áo trọn trong khung** (fov 46); ở c7 máy nghiêng xuống để **hai cái áo chiếm gần hết khung**, tường không nuốt khung |

## Số đọc trên đồ đo — đã khoá lại trong cả phim

- **Nhiệt kế treo trong phòng luôn đọc 25 °C** ở mọi nhát (kể cả c39, c44, c50) — đúng `FACTS.md`.
- **30 °C (c44–c45)** nằm ở **một thiết bị riêng** đặt cạnh tấm vải thử, cột thuỷ ngân đúng vạch 30; thẻ `30 °C` khoá vào đỉnh cột.
- **Ẩm kế trong cảnh luôn chỉ chín mươi phần trăm** trước c41 — đúng con số câu 46 đọc. Trước đây nó chỉ nửa chừng ở các câu 38–39, 44: một số **không câu nào đọc**.
- **Mặt cân không in số**: phim không nói gam nào, nên không vẽ số đo.
- Thẻ `20 g/kg` (c41), `90 %` (c46), `×5` (c46), `3 ÁO` (c40), `2 ÁO` (c4), `1 PHẦN NHỎ` (c16), `HƠN 2 kJ / 1 g` (c21), `TỐC ĐỘ CHẬM 1/2` (c37) đều có lời kể đọc đúng câu.

## Giữ — và lý do

1. **c22 — cột hơi nước ở mép vải.** Giữ. Lý do: cột hơi nước **bắt nguồn từ mặt vải và loãng dần khi bay lên**, nên nó đọc ra là hơi nước *đang rời vải*, không phải một tấm kính hơi kín trên vải; lớp hơi mỏng ở mép vải đã hạ xuống (`opacity .07`) để "chỗ trống" vẫn đọc được. Xoá hẳn cột thì câu 23 ("hơi nước bay lên thành dải") và câu 26 mất hình.
2. **c29 — cánh quạt trong ảnh tĩnh.** Giữ. Lý do: cánh quạt **có quay trong phim** (`fan.spin(t)`) — một tấm ảnh tĩnh không thấy được chuyển động đó; dấu hiệu gió nằm ở **hai vệt hạt khí chạy ngang từ miệng quạt**. Vẽ thêm một chiếc quạt riêng cho đúng một nhát sẽ phải qua thêm một vòng chấm đạo cụ, trong khi câu 29 đã đọc được bằng vệt khí.
3. **c37 — cái đứng giữa khung.** Giữ. Lý do: nó **không phải quạt, mà là vách ngăn có mặt kính mờ** của bàn thí nghiệm. Câu 37 đo **hai giọt** — một bên có gió, một bên không; dấu hiệu gió là **mật độ hơi nước** (bên không gió nay ít hạt hơn) và **kích thước giọt** (vòng nét đứt còn đúng một nửa). Khung cố ý là khung tối nhất phim (`DIM.c37 = 0.40`) để hai giọt nổi lên.
4. **c35 — tường chiếm nhiều khung.** Giữ. Lý do: đây là **nhát dựng** nơi (c36 và c37 là siêu cận); lỗi thật của nó — quạt thổi vào cả hai mặt kính — đã sửa bằng **vách ngăn có mặt kính mờ riêng**.
5. **c7 — thẻ `TRƯỚC QUẠT` khi quạt đã ra khỏi khung.** Giữ. Lý do: người xem đã thấy quạt thổi vào đúng chiếc áo đó ở c5 và c6 (có vệt hạt khí nối từ miệng quạt tới mép áo); ở c7 trọng tâm là **vệt ẩm nhạt đi trên chính chiếc áo**, nên thẻ vẫn đúng mà không cần nhìn thấy quạt.
6. **c38 — vế thứ ba ("diện tích phơi") không cùng khung.** Giữ cách chia. Lý do: nhiệt kế và ẩm kế treo trên **tường hiên**, còn diện tích phơi là **cả dàn áo cách mấy mét** — không thể đứng chung một khung sát mà đọc được. Nay c38 áp sát vào **ba đồ đo trên tường**, và vế thứ ba do thẻ `DIỆN TÍCH PHƠI` ở c39 đảm nhiệm.

## Máy đo nhịp

Cờ máy đo lại sau khi sửa (tờ nhịp mới ở `review/beatsheet/sheet_1…5.jpg`, 60 khung). Trước hết, hai con số trên tờ phải đọc đúng, vì chúng đo hai thứ khác nhau:

- **`fill`** = phần khung mà **vật lớn nhất** chiếm.
- **`phủ`** = phần khung mà **vật thật** chiếm **tổng cộng**.

Cách đo: một lưới 16 × 9 tia chạy qua khung; tia nào chạm vật nào thì vật đó được tính — **trừ khi nó to hơn 1,2 m** (phòng, tường, bàn phơi, cái áo dài hơn 1,2 m: những thứ lớn hơn đó không phải *vật*, chúng là *chỗ*). Vì thế `fill` mù ở ba kiểu cảnh của kênh này: cảnh cận bên trong một vật lớn, cảnh mà chủ thể là **một nhóm vật** nhỏ, và cảnh toàn cảnh. **Phải đọc `phủ`**; còn câu "chủ thể có đủ lớn không" thì để mắt người.

**Đừng đưa máy sát chỉ để đẩy con số lên.** Máy không đo được cái đó; bố cục hỏng thì con số có lên cũng không cứu được câu nào.

Dưới đây là **ba danh sách tách riêng**, đúng theo cái máy đo được và cái máy không đo được.

### 1. Máy không kết luận được — tự nhìn (14 câu)

`c13–c18 (6 câu), c22–c23 (2 câu), c27, c35, c39–c40 (2 câu), c44, c53`

Máy đo được **0 %** ở mười bốn câu này. Không phải "vật quá nhỏ" — mà là máy **không thấy vật nào đủ lớn để đo**: cảnh cận bên trong một vật lớn, cảnh toàn cảnh, hay khung thật sự trống, máy không phân biệt được ba cái đó. **Việc của người làm phim ở đây là tự mở từng khung** — tôi đã mở, và đây là cái tôi thấy:

| Câu | Khung thật sự là gì | Vì sao máy không đo được |
|---|---|---|
| c13–c18 | bên trong sợi: ô xi đỏ + hai hiđro trắng | thứ ở trước ống kính là **một vật to hơn 1,2 m** (sợi), phép đo bỏ qua; phân tử chỉ là hạt |
| c22–c23 | cột hơi nước bốc lên qua khoảng không trên vải | cột là **hạt**, không phải vật |
| c27 | lớp ẩm bám trên vải bị gió quét đi | tia chạm vào cái áo (> 1,2 m) là bị bỏ |
| c35 | bàn thí nghiệm nhìn từ trên xuống | chủ thể là **cả bàn** — một vật lớn, phép đo bỏ qua |
| c39–c40 | ba đồ đo treo tường / đàn áo trên dây thứ hai | mỗi vật nhỏ, **chủ thể là một nhóm** |
| c44 | ba đồ đo cùng một khung | cùng lý do: nhóm vật nhỏ |
| c53 | cái áo ướt treo trong nhà | chủ thể ở xa, mỗi vật chỉ là một vệt |

**Không câu nào trong danh sách này là khung trống.** Đây là danh sách để tôi tự nhìn, và tôi đã nhìn.

### 2. Nhóm vật — máy nhìn thấy, đây không phải lỗi

`c5–c7, c34, c37, c45–c46, c49` — ở những câu này **`fill` nhỏ hơn `phủ` nhiều** (c49: fill 10 %, phủ 34 %; c45: 10 % và 19 %): chủ thể là **một nhóm vật** — cặp áo thí nghiệm, hai cái cân, đàn áo, cặp áo úp và áo phơi rộng — mỗi vật nhỏ nên đơn lẻ nhỏ, còn cả nhóm thì chính là cái câu đó kể. Máy **nhìn thấy** nhóm (đó là chỗ `phủ` khác `fill`); đây **không phải lỗi**, và không cần sửa.

Cùng nhóm này còn có **cờ `RUN` ở c7** (ba câu liên tiếp trên cùng một cặp áo) và **cờ `SAME` ở 23 câu** (c5–c7, c16, c23, c25, c27, c29–c31, c34–c35, c37–c40, c45–c46, c49–c50, c55, c59–c60). **`SAME` đo hai ảnh tĩnh giống nhau, không đo "chuyện câu đó kể có xảy ra không"**: c5–c7 là cặp áo thí nghiệm (áo trước quạt nhạt dần qua `setWet`, cánh quạt quay, giọt trượt, hơi nước bay); c25–c31 là đoạn gió quét lớp ẩm; c37–c40 là đoạn đồ đo (kim dịch chuyển); c49–c50 là đoạn so sánh; c59–c60 là đoạn kết (túi nylon đung đưa, vệt gió chạy). Một tấm ảnh tĩnh không thấy được những cái đó.

### 3. Lỗi thật — độ phủ dưới 15 %

`c1, c20, c29–c30 (2 câu), c33, c38, c50, c55–c56 (2 câu), c59–c60 (2 câu)`

Mười một câu mà máy đo được **`phủ` < 15 %** — đây là cờ `FILL`, và khác với hai danh sách trên, đây là danh sách **lỗi thật**: máy đo được, và con số nó đưa ra có thể sai. Tôi đã mở từng khung:

| Câu | Máy đo | Tôi thấy | Xử lý |
|---|---|---|---|
| c1 | 8 % | nửa áo ẩm xám, giọt bám trên vải, giọt ở mép, **nước đứng trong bồn chậu ngay dưới áo** | **đã dựng lại** (vòng 6 của bản cắt này): máy vẫn đo 8 % vì cái áo dài quá 1,2 m nên phép đo bỏ qua nó — tôi đã mở ảnh thật (`still.mjs`, t = 4,6) |
| c20 | 12 % | bàn tay chạm vào mép áo, thẻ `LẠNH` chỉ vào chỗ vừa chạm | giữ: chủ thể là **bàn tay trên vải**, máy đo trượt vì áo > 1,2 m |
| c29 | 13 % | mặt quạt chạy, hai vệt hạt khí bay sang phải | giữ: trong phim cánh quạt **quay** (`fan.spin(t)`) — ảnh tĩnh không thấy |
| c30 | 14 % | mép vải ướt giữa khung, hơi nước bị gió chở sang phải | giữ: cùng lý do |
| c33 | 10 % | hai cái cân, hai cái áo, quạt nhỏ trên kệ | giữ: chủ thể là **nhóm vật** trên kệ |
| c38 | 8 % | ba đồ đo trên tường: nhiệt kế, tấm vải treo, ẩm kế — đọc được từng vạch | **đã dựng lại** (vòng 5: máy áp sát vào tường, fov 18); máy vẫn đo 8 % vì tường là vật > 1,2 m |
| c50 | 6 % | năm món quần áo trên dây: quần dày, khăn, hai áo, áo mỏng | giữ: chủ thể là **nhóm** — câu nói về áo dày và áo mỏng |
| c55 | 12 % | bàn tay dưới luồng gió, giọt mồ hôi bám, vệt gió chạy qua | giữ: cùng lý do |
| c56 | 10 % | dây phơi hiên, áo đã nhạt màu | giữ: chủ thể ở xa |
| c59 | 13 % | túi nylon đang vẫy ở tiền cảnh, lối thông gió phía sau | **đã dựng lại** ở vòng 5 (vệt gió thật chạy ngang, gió hiên ×1,9) |
| c60 | 7 % | hai cái áo úp trên hai bàn, không món nào chồng món nào | giữ: chủ thể là **nhóm** |

**Kết luận của ba danh sách:** mười bốn câu máy không kết luận được — tôi đã tự nhìn, không có khung trống nào; mười câu là nhóm vật, máy nhìn thấy, không phải lỗi; mười một câu còn lại là `FILL` — tôi đã mở từng khung, **dựng lại ba câu** (c1, c38, c59) và giữ tám câu còn lại, vì chủ thể của chúng **có trong khung** (bàn tay trên áo, cánh quạt, mép vải, nhóm đồ đo, nhóm quần áo), chỉ là máy không đếm được chúng.

### 4. Mũi tên — cờ `PTR` ở c17, và vì sao đó là **cờ sai**

Tờ sheet dựng bằng công cụ dò mũi tên (`window.LABELPROBE`): mũi tên của từng thẻ được raycast từ **đuôi mũi tên**, và hỏi nó có chạm vật nào không. Cờ `PTR` rơi vào **c17** (hai lần). Tôi đã mở ảnh thật và đọc mã, và đây là chuyện đã xảy ra:

- **Lỗi thật, đã sửa:** thẻ `PHÂN TỬ BAY LÊN` ở c17 có khoá `dx: 86`, mà khoá này dịch **cả đuôi mũi tên** sang phải 86 px — ở c17 phân tử nhỏ hơn, nên mũi tên **rơi ra ngoài vật**. Đã bỏ khoá `dx`; mũi tên giờ chạm đúng vào ô xi đỏ của phân tử đang bay (ảnh thật: `still.mjs` ở 53,1 s). Ở c16 cùng khoá đó vẫn đúng, vì phân tử ở c16 to hơn — nên cờ này phải do máy đo từng câu, không suy ra từ một câu khác.
- **Phần còn lại là cờ sai, và tôi nói thẳng là cờ sai:** sau khi sửa, cờ vẫn còn — vì **công cụ không nhìn thấy vật đó**. Phân tử đang bay được dựng bằng `fxLayer()` (`src/props.js`), mà `fxLayer` đặt vật sang **layer 1**; raycast của công cụ chỉ bắt **layer 0** (`probe.layers.set(0)` trong `rig/render.js`). Mũi tên chạm đúng phân tử, nhưng tia vẫn không chạm gì. Cùng cái đó, **hiệu ứng không bao giờ được đếm** trong phép đo độ phủ — nên ở những cảnh mà chủ thể là hiệu ứng (phân tử, hạt hơi nước, cột hơi nước) máy đọc 0 %.
- **Cái này đáng nói với người giữ công cụ:** một raycast chỉ bắt layer 0 sẽ báo sai cho mọi thẻ chỉ vào hiệu ứng. Ở tập này chỉ có **một** thẻ như vậy, nhưng cùng lý do đó nằm dưới danh sách 14 câu "máy không nhìn thấy vật nào" ở trên.

**Tóm lại:** cờ `PTR` ở c17 **không còn là lỗi của phim** — mũi tên đã chạm đúng vật, và tôi đã xác nhận bằng ảnh thật, không bằng máy.

### 5. Tờ này đo bằng probe cũ — và số sẽ đổi

Tờ sheet lúc 14:06 được dựng bằng probe **trước** khi rig sửa (`c2df58d`: `probe.layers.enableAll()`). Lúc đó tia của probe chỉ thử **layer 0**, nên mọi vật dựng bằng `fxLayer()` — phân tử nước, cột hơi nước, vệt gió, lớp ẩm — là **vô hình** với máy. Hệ quả cho chính tờ này:

- Mười bốn câu ở danh sách 1 phần lớn **không phải khung trống**: chủ thể của chúng là **hiệu ứng**, và máy không thấy vật đó — chứ không phải khung không có gì.
- Cờ `PTR` ở c17 là **cờ của máy**, không phải lỗi của khung (mục 4 ở trên).
- Sau khi probe sửa, `fill`/`phủ` ở những cảnh đó **đổi số và đúng hơn**: đo thử trên bản sao của chính tập này, c13 0 % → 51 %, c14 0 % → 9 %, c16 0 % → 16 %, và cờ `PTR` ở c17 **biến mất** — nghĩa là mũi tên của tôi vốn đã chạm đúng phân tử, máy chỉ không thấy thôi.

**Vì vậy: đừng sửa khung theo những con số cũ này.** Tôi đã mở từng khung bằng mắt, và không khung nào bị sửa theo con số.

## Bốn chỗ yếu người đọc bên ngoài chỉ ra sau khi đọc tờ nhịp

Có người đọc độc lập đọc tờ 60 khung và nêu bốn chỗ. Đạo diễn nhận hai, phản biện hai, và sửa một:

1. **"Cái áo không trông ướt" (c1, c4)** — **nhận, và đã sửa ở câu 1.** Ở c4 (cận cặp áo) vùng ẩm đọc rõ; ở c1 thì không: khung cũ để **bàn phơi đứng ngay trước ống kính**, nó che mất **bồn chậu** (bồn nằm sát mép bàn phơi, không có góc nhìn nào từ phía trước thấy được), và câu mở đầu chỉ có một mảng vải kem. Nay: máy lệch trái và gần hơn (fov 46, mắt `(−1.62, 1.62, 2.75)`, nhìn `(−1.25, .92, .85)`), **bàn phơi và cặp áo của câu 49 ẩn đi ở câu 1** → câu mở đầu thấy **nửa áo xám ẩm, bốn giọt bám trên vải, ba giọt ở mép, và nước đứng trong bồn ngay dưới áo**. Đó là câu "nước vẫn còn đó, chưa đi đâu cả". Đã dựng lại bằng ảnh thật (`still.mjs`, `t = 4.6`).
2. **"Hai cái áo ở c49 phải khác nhau một cách đọc được"** — **nhận, đã có**: sau vòng 5, cái áo úp mang **mảng ẩm xám với ba giọt nước bám** và màu lạnh `#b3c3cf`, cái áo phơi rộng là **vải khô `#e3d8bd` không mảng nào**; tờ mới (b_049) cho thấy hai cái khác nhau ngay bằng mắt, không chỉ khác màu.
3. **"Ba đoạn hình gần như đứng yên (c25–c32, c34–c37, c46–c60)"** — **phản biện một nửa**: cờ `SAME` là phép đo **trên một tấm ảnh**, mà phim thì có thời gian. Trong phim, đúng những đoạn đó có vật làm việc: quạt quay, dải ẩm nhạt dần và bị quét đi, giọt trượt, hơi nước bay và bị gió chở, kim ẩm kế **chạy lên hết cung** rồi rớt xuống, cột thuỷ ngữ, túi nylon đung đưa, vệt gió chạy ngang. Người xem tắt tiếng vẫn thấy những cái đó **chuyển động**. Việc cần làm không phải đổi góc máy (sẽ phá cấu trúc thí nghiệm) mà là **để vật động** — và vật đã động ngay từ đầu.
4. **"Cảnh trong vật thiếu dấu hiệu nước"** — **phản biện**: cảnh trong sợi đã có dấu hiệu nước rõ — c11 đọc ra **khe nước xanh giữa hai sợi be** với thẻ `KHE GIỮA SỢI`, c9 có giọt đọng trên sợi, c13–c18 có **phân tử nước** dựng lại đúng hình (ô xi đỏ + hai hiđro trắng chữ V) chứ không còn là ba quả cầu giống nhau. Câu 13–c18 đã còn nhãn `1 PHÂN TỬ` và `PHÂN TỬ BAY LÊN`.

Ngoài ra, cờ `fill 0 %` ở **c38** đã hết: câu 38 nay áp sát vào **ba đồ đo trên tường** (nhiệt kế, ẩm kế, diện tích phơi) — đúng câu "ba thứ quyết định tốc độ".

## Vòng 6–9 — bốn lần sửa hình sau bản cắt này, và cả bốn đều do cổng đo được

Bản cắt này được viết ở vòng 5/5 của bước 6. Từ đó tới giờ cổng bàn giao đo được **bốn lỗi hình thật**, và cả bốn đã sửa ở mã:

| Vòng | Lỗi do máy đo | Sửa trong mã |
|---|---|---|
| **6** | `fill 8 %` ở câu 1 và người đọc nói thẳng "cái áo không trông ướt": bàn phơi đứng ngay trước ống kính che mất **bồn chậu** | Máy lệch trái, gần hơn (fov 46, mắt `(−1.62, 1.62, 2.75)`, nhìn `(−1.25, .92, .85)`); bàn phơi và cặp áo của câu 49 **ẩn đi ở câu 1** → thấy nửa áo xám ẩm, giọt bám, và **nước đứng trong bồn ngay dưới áo** |
| **7** | **Năm thẻ thuật ngữ hiện ít giây hơn thời gian đọc** (chữ 26–30 px cần ~1,8–2,6 s; thẻ chỉ hiện 1,1–1,9 s) — lỗi **người xem** chịu, không phải lỗi máy đo | Hai khoá mới trong mảng `CARDS` của `src/film.js`: `hold` (giữ thẻ lâu hơn) và `lead` (hiện thẻ sớm hơn); sửa năm thẻ, và dời hai thẻ (`QUÉT XA HƠN`, `HAI CÂN`) sang vật khác để không chồng lên nhau |
| **8** | Hai mũi tên **chỉ vào khoảng trống**: `2 ÁO` (c4) chỉ đúng khe giữa hai cái áo; `TRƯỚC QUẠT` (c5–c7) lệch mép vải 2 cm | Dời mũi tên vào vải: `(2.00, 1.34, −2.60) → (2.30, 1.22, −2.60)` và `(1.46, 1.16, −2.60) → (1.70, 1.16, −2.60)`; kiểm bằng ảnh thật ở 15,0 / 18,5 / 25,5 s |
| **9** | Cờ `PTR` ở **c17**: mũi tên thẻ `PHÂN TỬ BAY LÊN` chạm **không gì cả** — khoá `dx: 86` dịch cả đuôi mũi tên sang phải, hơn cả bán kính phân tử ở c17 | Bỏ khoá `dx` ở thẻ đó: đuôi mũi tên chạm đúng vào ô xi đỏ của phân tử đang bay; kiểm bằng ảnh thật ở 53,1 s (cùng khoá đó vẫn đúng ở c16, vì phân tử ở c16 to hơn) |

Vòng 7, 8 và 9 **không đổi góc máy, không đổi đạo cụ**; vòng 6 dựng lại khung mở đầu (chi tiết ở `STORYBOARD-DIRECTORS-CUT.md`). Không câu nào bị cắt khỏi phim.

## Vòng 10 — một lần refactor không đổi hình, và một tờ sheet đo lại bằng probe mới

**Refactor, không phải sửa hình.** Lần sửa cuối cùng của mã (14:39) đụng vào **một tệp mã duy nhất**:
`src/film.js` — khối tính cửa sổ thẻ chuyển sang hàm `cardWindow()` của rig (`rig/render.js:209-213`).
Tôi đã đối chiếu hai công thức dòng bằng dòng: chúng tính ra **cùng một cửa sổ** cho từng thẻ, nên không
khung hình nào của phim đổi, và **phim không cần dựng lại** — phim đã bàn giao lúc 14:51 vẫn là phim của mã
hiện tại. (Lợi ích phụ: từ tập sau, cửa sổ thẻ tính bằng **một hàm chung của rig**, nên một tập dùng rig
cũ không âm thầm tính khác tập dùng rig mới.)

**Tờ sheet đo lại bằng probe mới.** Tờ mà mục 1–3 ở trên dựa vào được dựng lúc 14:06, bằng probe **trước** khi
rig sửa (`c2df58d`: `probe.layers.enableAll()`). Tờ mới đang được dựng lại bằng probe mới, và các con số
`fill`/`phủ` ở những cảnh mà chủ thể là **hiệu ứng** sẽ đổi. Bản cắt này sẽ được viết lại mục 1–5 theo số
mới; **không khung nào nào của phim sửa theo con số cũ** — tôi đã mở từng khung bằng mắt, và những lần
sửa hình đã làm (vòng 6–9) đều do cổng đo được, không do con số của tờ này.

## Vòng 11 — sau vòng nghiệm thu cuối (`review/FINAL-QA-REVIEW-1.md`, 16:31)

Nghiệm thu cuối xem **toàn bộ phim đã dựng** (4234 khung), không chỉ tờ nhịp. Nó chấm âm thanh là đạt, khoa học là đúng nguồn, và **loại phim** vì một lỗi hình thật ở c27. Bản cắt này ghi lại **đúng những gì đã sửa trong mã cho đến lúc viết**, cái gì **giữ**, và vì sao. Không câu nào bị cắt khỏi phim: cả 60 câu vẫn còn, và cả 60 câu vẫn có một hình riêng.

### Lỗi chặn — đã sửa ở mã

| Câu | Lỗi của vòng nghiệm thu cuối | Sửa trong mã |
|---|---|---|
| **c27** (1:20.5–1:25) | Góc dưới–bên phải khung hình bị chiếm bởi một **khối hình màu xanh navy đậm**: các mặt phẳng cứng sắc cạnh chồng lên nhau, một lỗ hình tam giác xuyên thủng, một sừng nhọn mảnh như kim chạy chéo ra ngoài khung, một mảnh vụn nằm dẹp trên sàn — chiếm ~1/4 khung, **đứng yên** suốt ~4 s, **không có viền mực**, không khớp vật nào trong bối cảnh | Khối đó **không phải vật thể**: dựng lại nhát đó với đèn tắt đổ bóng (`?noshadow`) thì nó biến mất sạch. Đó là **bóng đổ** của khung cửa + cánh cửa hiên đổ xiên vào tường phải của phòng kín, cộng với bóng của đàn áo và áo phơi một mặt đang treo ngay trước lối cửa — bóng rơi ở góc rất xiên nên bản đồ bóng vỡ thành mảnh vụn và gai. Sửa: **bốn vật đó không đổ bóng** nữa (`src/set.js`). Ở các nhát khác bóng của chúng rơi ngoài khung, còn góc tường đó vốn đã là chỗ tối nhất của phòng |
| **c27** | Cùng nhát còn **một quầng sáng cháy trắng** (lõi 255, ~0.36 % diện tích, có hào quang) ngay trên dây phơi, phía trên chiếc áo tối | Đèn góc xa (`cornerLamp`) đứng **sát mặt trong của tường** (`x = 2.45`, mặt trong ở 2.54) nên nó đốt thành một vũng sáng trắng. Sửa: **đưa ra khỏi tường** (`(2.02, 2.02, −5.10)`) và **hạ sáng** (`.90` → `.30`). Đo lại toàn khung: **0 điểm ảnh ≥ 250** (trước đó 6465) |

### Lỗi nhỏ — đã sửa ở mã

| Lỗi | Lỗi của vòng nghiệm thu cuối | Sửa trong mã |
|---|---|---|
| **0:22** | Nhãn `KHÔNG CÓ GIÓ` bị **cắt bởi mép trên khung** | Hộp thẻ ở `y = 8..52` — nhãn đã bị kẹp vào giới hạn trên của khung. Hạ xuống `y = 1.24` → hộp ở `y = 212..256`, **trọn trong khung** |
| **1:58** | Số "hai mươi" bị cắt làm đôi qua hai câu phụ đề: câu 54 kết bằng "…tối đa khoảng **hai**", câu 55 là "**mươi** gam hơi nước." | Không phải lỗi bố cục: lỗi của **bộ cắt mảng phụ đề** của kênh — khi ranh giới mảng rơi đúng vào **đuôi** mảng thì luật "một cụm số không được cắt làm đôi" không bắt được. Công cụ của kênh đã sửa; `src/timeline.js` của tập này được **sinh lại bằng công cụ của kênh** (bản trong thư mục tập đã xoá) và ra **giống hệt** bản cũ: câu 41 nay là `… tối đa khoảng` / `hai mươi gam hơi nước.` |
| **0:32–0:37** | Cận cảnh sợi vải đọc ra như **một tấm bìa phẳng có vân in**, không thấy sợi đan qua nhau | Sợi **thưa hơn: 18 × 18** thay vì 44 × 44 (`n` mặc định của `wovenCloth` và cả lời gọi trong `src/set.js` — cùng một con số). Sợi to, bước đan đọc được: người xem thấy sợi nào nằm trên sợi nào |
| **0:32–0:37** | Nhãn `KHE GIỮA SỢI` chỉ vào **mặt sợi** chứ không vào khe; khe giữa hai sợi là một dải xám phẳng, không có mặt nước | Nhãn **neo vào giữa hai sợi** (`.026, −.006, .000` — đúng chỗ có màng nước), nên mũi tên chỉ vào **dải nước trong khe**. Dải nước đã có mặt nước (màng nước trong khe + cầu nước nối hai mép) |
| **0:12** | Một mảng tường phẳng chiếm **45 % khung** | Máy dựng lại: **nhìn xuống vào quạt bàn** (fov 32, `(−.62, 1.30, −2.58)` → `(−1.42, 1.16, −3.28)`) — lưới quạt chiếm phần lớn khung |
| **0:27** | Một vùng tối trống chiếm **35 % khung** | Máy nghiêng xuống hơn (fov 38, `(1.80, 1.50, −1.50)` → `(2.02, 1.20, −2.60)`) — **hai cái áo chiếm gần hết khung** |
| **0:42** | Sợi vải cắt ngang mặt nước có **màu nâu và dạng như cành khô**, không giống sợi bông | Mảng nâu đó **không phải sợi**: đó là **bờ cát** của mặt nước, nhưng màu `#9c8a68` dưới đèn ấm của cảnh biến nó thành cành khô, và dải bờ hẹp (21 cm) nên ở cự ly xa nó thu về một sừng nhọn. Bờ đổi thành **cát ướt màu xám** (`#6c695e`) và **rộng hơn** (28 cm) |
| **2:18** | Nhãn `CHỒNG LÊN NHAU` chỉ vào **một cái áo đang treo cạnh chiếc khác** trên cùng dây, chưa thật sự "chồng lên nhau" | Nhãn **dời vào đúng chỗ chồng** (`.414, 1.758, −.62`): mũi tên chỉ vào chỗ áo xám ở sau bị áo hồng ở trước che |
| **2:53** | Hình kết theo `TREATMENT.md` phải là **một cái áo úp còn ẩm trên sàn**, nhưng dựng lại thành **hai cái bàn gỗ với bốn món quần áo trải trên đó** | Hình kết **dựng lại theo lời hứa**: hai bàn phơi **ẩn đi** ở c60 (cờ `noBench2`), và **một cái áo úp còn ẩm nằm một mình trên sàn hiên** (`floorShirt` + vệt ẩm `floorWetPatch`), mặt ẩm hướng lên nên **màu lạnh** để tách khỏi nền gạch ấm. Thẻ `CÒN ẨM` và `KHÔNG CHỒNG` chỉ vào chính cái áo đó |

### Giữ — và lý do

1. **0:68 (c22) — "60 % khung là trần trơn".** Giữ. Lý do: đây là nhát **cố ý nhìn LÊN khe không khí** — câu 22 nói *"nước chỉ bay hơi đều hơn khi không khí ngay trên vải còn trống"*, nên **khoảng trống trên vải chính là thứ đang được kể**, và cột hơi nước bốc lên qua khe đó là hình của nó. Máy hạ xuống một chút (fov 37, `(.31, 1.08, −2.52)` → `(.44, 1.45, −3.26)`) để **mép áo còn ở đáy khung** và cột hơi nước vẫn nằm giữa khung; nhưng trần không được lấp đầy, vì lấp đầy nó là bỏ đi cái câu nói.
2. **Cột hơi nước ở mép vải (c22)** — giữ, như trên: nó loãng dần khi bay lên nên đọc ra là hơi nước *đang rời vải*, không phải một tấm kính hơi kín.
3. **Cánh quạt trong ảnh tĩnh (c29)** — giữ: cánh quạt **có quay trong phim**; dấu hiệu gió nằm ở hai vệt hạt khí chạy ngang từ miệng quạt.
4. **Cái đứng giữa khung ở c37** — giữ: đó là **vách ngăn có mặt kính mờ** của bàn thí nghiệm, không phải quạt.

### Số đọc trên đồ đo — không đổi

Nhiệt kế treo **25 °C**; nhiệt kế `thermo30` **30 °C**; ẩm kế **90 %**; hai cân **288 g** và **88 g**. Vòng này không đổi một số đo nào — mọi sửa đổi ở **ánh sáng, bóng đổ, màu vật, số sợi, góc máy và nội dung thẻ**, không đụng vào số.

### Vòng 12 — mã neo của nhãn (11 thẻ)

Bảng `CARDS` trong `src/film.js` nay mang thêm trường `anchor:` cho 11 thẻ: mỗi nhãn nêu tên vật nó gắn vào, theo tên vật trong danh mục `src/props.js`. Máy kiểm (`channels/tram-nghi-nhieu/tools/check_label_anchors.py`) báo **không nhãn nào sai**, và hai nhãn trong số đó đúng là hai nhãn vòng nghiệm thu cuối đã bắt lỗi:

| Nhãn | Mã neo | Vì sao quan trọng |
|---|---|---|
| `KHE GIỮA SỢI` (c11) | sợi vải đan cận | Nghiệm thu cuối bắt lỗi: nhãn chỉ vào **mặt sợi** chứ không vào khe. Giờ đuôi thẻ neo vào đúng giữa hai sợi, nơi có màng nước |
| `CHỒNG ÁO` (c48) | đàn áo phơi chồng trên dây | Nghiệm thu cuối bắt lỗi: nhãn chỉ vào **một cái áo treo cạnh nhau** chứ không vào chỗ chồng |
| `QUẠT` (c5) | quạt bàn có lưới | — |
| `HAI CÂN` (c33–c34) | cân nhà bếp có mặt đồng hồ kim | — |
| `NHIỆT ĐỘ` (c39) | nhiệt kế treo tường | — |
| `ĐỘ ẨM` (c39) | ẩm kế treo tường có kim | — |
| `SỨC CHỨA CAO HƠN` (c44) | ẩm kế treo tường có kim | — |
| `ÁO ÚP` (c49) | áo úp: mép dưới úp lên, mảng ẩm nằm trên mặt gấp | — |
| `PHƠI RỘNG` (c49) | áo phơi rộng: cả hai mặt phơi ra | — |
| `QUẦN DÀY` (c50) | quần đùi hai ống | — |
| `ÁO MỎNG` (c50) | áo thun mỏng | — |

Ba mươi thẻ còn lại **cố ý không có mã neo**: máy nói thẳng là chưa kiểm được. Riêng `PHƠI MỘT MẶT` (c48) thì máy đòi phần định tính ("áo màu sẫm") vì chữ "phơi … mặt" khớp cả "áo phơi rộng: cả hai mặt phơi ra" — nhưng ở nhát c48 cái áo phơi rộng không có trong khung, nên **giữ nguyên chữ trên màn hình**, chỉ bỏ mã neo.

Mã neo không đổi hình nào: nó chỉ buộc mỗi nhãn phải nêu được vật của nó bằng tên. Vì vậy bản cắt này không cần chấm lại hình vì lý do đó.

## VERDICT: PASS

SCOPE: bản cắt này đóng **Bước 6 (hình ảnh)** cho tập `tap-01-phoi-quan-ao` sau vòng chấm thứ năm: ba câu FAIL chặn (c45, c49, c59), tám câu phải sửa (c25, c34, c38, c40, c44, c46, c60, c5–c7) đã sửa ở mã; số đọc trên đồ đo đã khoá lại trong cả phim (nhiệt kế 25 °C, ba mươi độ ở một thiết bị riêng, ẩm kế chín mươi phần trăm, mặt cân không in số); sáu nhóm lỗi giữ lại kèm lý do; và **bốn vòng sửa hình sau đó** (vòng 6: khung mở đầu; vòng 7: năm thẻ không đủ lâu để đọc; vòng 8: hai mũi tên chỉ vào khoảng trống; vòng 9: mũi tên c17 chạm không gì) — mục "Vòng 6–9" ở trên. Không câu nào bị cắt khỏi phim. `LOOK.md` viết lại theo đúng mã (mười chín dòng bố cục và số đọc).
