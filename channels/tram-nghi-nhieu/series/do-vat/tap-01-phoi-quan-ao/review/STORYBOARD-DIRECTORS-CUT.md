# Đạo diễn cắt — Bước 3 (storyboard), vòng 5/5

`review/STORYBOARD-REVIEW-5.md` là vòng chấm cuối của bước 3 và đã **REJECT** (điểm 3,0/5; điều kiện "không cảnh nào bị che khuất vật chính" không đạt). Theo quy trình, vòng 5 là vòng cuối: những gì đã sửa được thì sửa, phần không sửa được thì **Đạo diễn cắt** ở đây, chốt phương án an toàn nhất và sang bước 4.

Trang này ghi lại: cái gì đã sửa trong mã, cái gì **không** sửa và vì sao.

## Đã sửa trong mã (đợt này)

| Lỗi của vòng 5 | Cách sửa | Ở đâu |
|---|---|---|
| **Hero 2 (c11) hỏng**: hai tấm bìa nghiêng + que xanh cắt ngang | Dải mềm nước không còn dùng hướng cố định trong không gian mà **vuông góc với phương tiếp tuyến của từng sợi** (`inwardOf`), nên mép sáng bám đúng hai mép sợi thay vì cắt ngang; độ đục của màng nước 0,55 → 0,72; máy nhìn **dọc theo khe** (fov 26, `z = 0.115`) | `src/props.js` (`wovenFibres`), `src/film.js` (c11) |
| **c10 đọc thành rổ tre** | Sợi mảnh đi một nửa (bán kính 2,9 mm → 2,1 mm), nhiều hơn (30 → **44 sợi × 44 sợi**), thêm **lớp vải nền mờ** phía sau để khe hở không thấy thẳng ra nền, màu sợi kem lạnh hơn, vân xơ tua đậm hơn, bỏ mipmap + anisotropy 8; **chỉ một tấm đan** trong khung (tấm đan ẩn ở mọi nhát khác của bối cảnh trong sợi) | `src/props.js` (`wovenCloth`), `src/set.js`, `src/film.js` |
| **c54 + c55 bị túi nylon che** | `bag2` dời từ `(−0.5, 1.26, −3.3)` (đúng trục nhìn) sang `(−2.30, 1.30, −2.55)` — góc trái, ngoài cả hai trục nhìn | `src/set.js` |
| **Thẻ `30 °C` chỉ vạch 50** | Neo thẻ về đúng vạch 30 (`y = 1.930`, `x = −2.258`) và tính lại `off = [105, −95]` (đuôi thẻ vẽ ở khoảng cách cố định từ bong bóng, không phải tại neo) — đã cắt khung 1920×1080 để kiểm: đuôi thẻ rơi đúng lên số `30` | `src/film.js` (`LABELS`) |
| **c20 bàn tay không đọc ra là bàn tay** | Máy lùi và vòng sang 3/4 trước-trái (fov 28), ngón tay chĩa vào mặt vải, cổ tay ở tiền cảnh, mép áo còn lại trong khung; giọt mồ hôi bám da đã có sẵn ở đạo cụ | `src/film.js` (c20), `src/set.js` (tư thế tay) |
| **Nhóm "mảng vải phẳng" (c2, c22, c26, c48)** | c2 → cận mảng ẩm trên áo ướt (tương phản vệt ẩm tăng 0,40 → 0,62); c22 → nhìn thấp vào mép lớp hơi, viền sáng của lớp hơi đọc rõ (opacity 0,95); c26 → mép vải + ba giọt bám mép + lớp hơi ôm mép; c48 → fov 40 | `src/film.js`, `src/props.js`, `src/set.js` |
| **c7 hai áo sáng bằng nhau** | Sửa ở **vật thể**: áo B dùng vải navy `#4a5580` đặt ở **góc xa** phòng `(2.30, 1.42, −5.05)`, có đèn góc lạnh nhỏ để lộ ra mà vẫn sẫm; áo A vẫn kem và nằm trong luồng gió | `src/set.js` |
| **c4 hai áo không cạnh nhau** | Hai áo nhỏ trên kệ rộng 27 cm mỗi cái, **khe hở ≈ 3 cm**; máy vào sát (fov 46) nên mỗi áo chiếm ~28 % chiều ngang, cân ra khỏi khung; thẻ `2 ÁO` đặt đúng vào khe giữa hai áo | `src/set.js`, `src/film.js` |
| **c5, c6, c27, c31 thiếu vật nhận gió** | Vệt hạt khí chạy tới mép áo A (`x = 0.70`); c6 đặt máy **trên trục luồng gió** (fov 24); c27 có **quạt ở tiền cảnh** và vệt hạt khí nối từ miệng quạt tới mép áo; c31 giữ quạt tiền cảnh trái + vệt hạt khí chạy ngang sang mép áo | `src/set.js`, `src/film.js` |
| **c13, c15, c16 mặt nước phải là một mặt phẳng** | c13 → mặt nước là **dải sáng nằm ngang** giữa khung, thân nước tối ở dưới; c15 → máy ở đúng tầm mặt nước; c16 → nhìn lên một phân tử đang tách, cụm hạt nằm yên **không còn cháy trắng** (đổi vật liệu cụm, giảm bloom của hạt bốc lên) | `src/film.js`, `src/props.js` |
| **c30 hạt xếp thẳng hàng như dây đèn** | Hạt lệch nhau theo quỹ đạo, kéo vệt, nhỏ hơn và dịu hơn (k 1,7 → 0,80) | `src/set.js` |
| **c41, c42, c46 vệt `shine` che số** | Xoá hẳn vệt phản chiếu của mặt kính ẩm kế; c42 lùi ra để thấy **đồng thời** thẻ `20 g/kg` và mặt ẩm kế; c46 lấy trọn mặt đồng hồ | `src/props.js`, `src/film.js` |
| **c38 đàn áo bị cắt** | Máy dời sang phải, đàn áo trọn ở góc phải, hai đồ đo vẫn đọc được | `src/film.js` |
| **c49 không có "áo úp"** | Dựng thật: cái áo ướt **khoác qua thanh lưng ghế**, mặt vải hướng về máy, mép vải rủ xuống sau; đặt cạnh cái áo phơi rộng trên mặt ghế, cùng một khung | `src/set.js`, `src/film.js` |
| **c58 tối như ban đêm** | Quay dọc dây phơi, khoảng trống giữa các món đồ được nắng sáng; đèn tập trung 1,3 → 1,7 | `src/film.js` |
| **Đồng hồ treo tường bị cắt (lần thứ tư)** | Hạ xuống `y = 1.36` | `src/set.js` |
| **LOOK.md nói khác mã** (5 chỗ) | Sửa hết: 44×44 sợi, c48 fov 40, c35 fov 40 `z = −5.40`, c45 nay **đúng** là "nhiệt kế và ẩm kế cùng khung", c25 nay **đúng** là ba giọt | `LOOK.md` |

## Máy đo nhịp

`review/beatsheet/` chạy lại sau khi sửa: **không còn cờ nào** (`SAME`, `RUN`, `DARK`, `NUM` — trước khi sửa có 20 cờ `SAME` do các nhát cùng chủ thể đứng sát nhau). Bảy tờ nhịp nằm ở `review/beatsheet/sheet_1…5.jpg`.

## Không sửa — và lý do (Đạo diễn cắt)

1. **Dựng lại đạo cụ mới cho Hero 2 (c11)** như lời chấm đề nghị. *Không dựng mới.* Lý do: hai sợi của `wovenFibres()` vốn đã là **ống tròn có vân xơ tua** (không phải "tấm bìa nghiêng" — đó là cách đọc của máy đo trên khung cũ, khi màng nước cắt ngang sợi ở góc vuông). Lỗi thật nằm ở hình học của mép màng, đã sửa tại gốc. Dựng thêm một đạo cụ chỉ để dùng ở một nhát sẽ phải qua thêm một vòng chấm đạo cụ (bài test mù ba mặt), trong khi nhát này đã đọc được "khe nước giữa hai sợi" sau khi sửa.
2. **c27 phải có cả quạt lẫn mép áo ở fov 52–56**. *Làm fov 46, quạt ở tiền cảnh, mép áo ở hậu cảnh.* Lý do: ở fov 52 trở lên, hai vật cách nhau 2 m thì máy phải lùi tới 4 m, lúc đó cả quạt lẫn áo chỉ còn ~10 % khung và **vệt hạt khí biến mất** — mà câu c27 nói "gió thổi tới, lớp ẩm bị quét đi", nên thứ cần thấy là luồng gió, không phải kích thước hai vật.
3. **c22 nhìn chính diện lớp hơi, vải ≤ 55 % khung**. *Nhìn thấp vào mép lớp hơi.* Lý do: nhìn chính diện, lớp hơi là một mảng alpha trong suốt trên vải cùng tông — khung cho ra "một mảng vải kem" chứ không cho ra "một lớp kính mờ bám lên". Nhìn thấp, viền sáng của lớp hơi là chính đường bám với vải, và người xem tắt tiếng vẫn đọc được "trên vải có một lớp mỏng".
4. **c8, c9 dùng chung đạo cụ sợi với c10–c12**. *c8 dùng đúng hai sợi của `wovenFibres()` như c11, c9 dùng giọt trên sợi.* Lý do: yêu cầu "không lọt đạo cụ khác vào khung" đã làm đúng (tấm đan chỉ hiện ở c10). c9 là cận một giọt trên sợi — cùng bộ sợi, đúng như yêu cầu.

## Chốt

Bước 3 coi như **đóng bằng Đạo diễn cắt** này: 17 nhóm lỗi đã sửa trong mã, 4 nhóm giữ lại kèm lý do, mã và `LOOK.md` khớp nhau, máy đo nhịp sạch. Sang bước 4 (bóc tách linh kiện) và bước 5 (code đạo cụ) để đóng dấu đạo cụ, rồi bước 6–7.

---

## Bổ sung sau vòng 5 (những thay đổi còn lại trong phim)

Bản cắt trên đóng bước 3 ở vòng 5/5. Từ đó tới giờ, ba nhóm thay đổi sau đây đã được **dựng lại và soi bằng ảnh thật**; chúng nằm trong phạm vi bản cắt này:

| Nhát | Việc đã làm | Kiểm bằng ảnh |
|---|---|---|
| **c49, c60** (cặp đối chiếu) | Đạo cụ `tShirt` khoác lên lưng ghế bị bỏ: nhìn từ máy nó chỉ là một mảng vải dựng đứng, không cổ, không tay áo. Thay bằng đạo cụ riêng `foldedShirt()` (áo phông úp mép dưới lên, nếp gấp là nửa trụ bán kính 18 mm, mảng ẩm nằm trên mặt gấp, ba giọt bám). **Cả hai cái áo chuyển xuống sàn hiên, nằm cạnh nhau**: áo phơi rộng ở `x = −.45`, áo úp ở `x = .85`, vệt nắng rơi giữa hai cái nên không vải nào bị cháy sáng. Máy c49 ở `(0.20, 1.74, 2.58)` → `(0.20, 0.02, 1.31)`, fov 46; máy c60 ở `(−.50, 1.86, 2.24)` → `(−.50, 0.02, 1.72)`, fov 30 (cái áo úp không lọt vào khung). `FOCUS` c49 hạ `3.0 → 2.2`. Chiếc ghế trở lại là ghế hiên bình thường. | `still.mjs 141.7` và `still.mjs 171.9` |
| **c12** (rìa sợi) | Ở fov 16, khung chỉ chứa một quầng sáng → không đọc ra là "vệt trong xơ". Máy lùi ra (fov 28, `(0.051, 0.071, 0.144)` → `(0.039, 0.059, 0.009)`), và vệt nước trong xơ đổi từ một quầng tròn (`TEX.radial`) thành **vệt dài chạy dọc theo sợi**, mềm hai mép, để nhìn xuyên thấy sợi bên dưới. | `still.mjs 39.6` |
| **c51** (giọt rơi từ mép khăn) | Giọt rơi xa khỏi mép khăn một khoảng 16 cm nên đọc ra là giọt lơ lửng giữa không trung. Rút còn ~4 cm, máy bám theo. | `still.mjs 147.8` |

## Bổ sung sau vòng 5 (đoạn mặt nước — sáu nhát c13–c18)

Máy đo nhịp chạy lại trên bản dựng thật báo **c13–c18 là sáu hình giống nhau**: cùng một mặt nước xanh, cùng một góc máy thấp, không nhát nào có vật chính riêng. Thêm nữa, hai thẻ `1 PHÂN TỬ` và `HƠI NƯỚC` **chỉ vào khoảng không**: thẻ bám vào toạ độ `x ≈ 0` trong khi máy quay lúc đó lại quay về phía bờ ở `x ≈ −0.98`. Toàn bộ đoạn được dựng lại theo đúng vật thật:

| Nhát | Máy | Vật chính |
|---|---|---|
| c13 | fov 34, `p (−.45,.13,.55)` → `l (−.95,.03,.05)` | mép bờ + mép bọt trắng |
| c14 | fov 30, `p (.42,.10,.52)` → `l (−.30,.05,−.25)` | mặt nước trải ra, nắng rọi trên gợn sóng |
| c15 | fov 28, `p (−.035,.070,.175)` → `l (.005,.021,.005)` | các phân tử nhảy trên mặt nước (nhìn từ trên xuống) |
| c16 | fov 22, `p (.115,.078,.245)` → `l (.048,.052,.010)` | **một phân tử đang bay lên**, thẻ `1 PHÂN TỬ` chỉ vào nó |
| c17 | fov 24, `p (.075,.032,.225)` → `l (.048,.058,.008)` | cùng phân tử, nhìn từ thấp, nền là trời, thẻ `HƠI NƯỚC` |
| c18 | fov 30, `p (.20,.085,.46)` → `l (−.85,.02,−.20)` | mặt nước xanh sâu lạnh, bờ ở xa |

- **Hình phân tử nước**: một cầu ô xi **đỏ** + hai cầu hiđro **trắng** xếp chữ V. Trước đây là một quả cầu trắng trơn có điểm sáng — đọc ra là quả trứng, không phải nước.
- **Thẻ bám vào vật thật**: `do1pt` và `dohoi` lấy **vị trí thật của phân tử đang bay** (`ESC_POS()`), đẩy sang phải 86 px để không đè lên vật.
- **Mép bờ bối cảnh N3 hạ xuống** (`y = −.03 → −.058`): trước đây thanh gỗ tối cắt ngang bầu trời thành một dải nâu ở các nhát thấp.
- **c9** (giọt nước bám trên sợi): máy lùi ra (fov 12 → 19) — ở tiêu cự cũ giọt chỉ là một quả cầu xanh không đọc ra là giọt.

## VERDICT: PASS

SCOPE: bản cắt này đóng **Bước 3 (storyboard)** cho tập `tap-01-phoi-quan-ao` ở vòng 5/5. Những gì được cắt: (1) 17 nhóm lỗi bố cục đã sửa trong mã (khung nhát, thẻ, góc máy, vật che khung) — xem bảng ở trên; (2) 4 nhóm **giữ lại kèm lý do** (không dựng lại `wovenFibres()` cho c11; c27 để fov 46 thay vì 52–56; c22 nhìn thấp vào mép lớp hơi; c8/c9 dùng chung bộ sợi với c10–c12); (3) ba nhóm dàn lại sau vòng 5 nêu ở mục trên (c49/c60 dàn lại cặp đối chiếu trên sàn, c12 lùi máy, c51 rút ngắn độ rơi của giọt); (4) **sáu nhát c13–c18 dựng lại theo vật thật** (mỗi nhát một vật chính: mép bọt, gợn sóng, phân tử nhảy, phân tử bay lên ×2, mặt nước mát), phân tử nước có hình đúng (ô xi đỏ + hai hiđro trắng), và hai thẻ `1 PHÂN TỬ` / `HƠI NƯỚC` bám vào vị trí thật của phân tử thay vì chỉ vào khoảng không. Máy đo nhịp (`beatsheet.mjs`) chạy lại sau khi sửa: không còn cờ nào (`SAME`, `RUN`, `DARK`, `NUM`). Mã và `LOOK.md` khớp nhau.

---

## Vòng dựng hình thật — sửa bố cục sau khi soi 60 nhát

Bước 6 dựng xong cả tập, soi từng nhát (60 ảnh, `out/look5/`) thấy các lỗi bố cục sau. Tất cả đã sửa trong mã; `LOOK.md` viết lại đúng như mã.

| Nhát | Lỗi thấy được trong hình | Sửa trong mã |
|---|---|---|
| c4, c5 | Máy đứng **ngoài phòng** nên c4 thấy hiên, c5 thấy một mảng tường trơn — **cặp áo thí nghiệm không có trong khung** | Máy vào **trong phòng**: c4 `(2.00, 1.15, −1.70)` fov 50, c5 `(2.05, 1.28, −1.58)` fov 50 — hai cái áo trọn khung cạnh nhau, quạt nhỏ ở tiền cảnh trái |
| c6 | Nhìn vào **vỏ quạt** chứ không thấy mặt quạt | Máy lên trước-phải, nhìn đúng mặt lưới và cánh quạt: `(1.80, 1.10, −2.25)` fov 30 |
| c7 | Hai cái áo **sáng bằng nhau**, không thấy cái nào nhạt dần | Cái trước quạt nhạt nhanh hơn (`cmpA.setWet` 30 s → 12 s, giảm tới 15 % ẩm), nên tới câu 7 cái trước quạt **nhạt**, cái ở góc xa **vẫn sẫm** |
| c12 | Vệt nước trong xơ **không đọc được** (nằm trong sợi) | Vệt nằm trên mặt sợi, to và đậm hơn (xem `PROPS-DIRECTORS-CUT.md`); máy lùi ra (fov 16 → 22) |
| c14 | Mặt nước chiếm ~45 % khung bằng trời trống | Siết máy sát mặt nước: fov 30 → 26, điểm nhìn hạ xuống `y = .026` |
| c16, c17 | Thẻ `1 PHÂN TỬ` và `HƠI NƯỚC` chỉ vào **chỗ trống**, phân tử đang bay thì bị cắt mép trên | c16: máy lùi và ngẩng lên (`(.120, .100, .215)` → `(.005, .072, .010)`) để **cả cung bay của phân tử nằm trong khung**; c17: nhìn từ thấp, nền là trời tối, thẻ chỉ đúng vào phân tử |
| c18 | Hơi lạnh là **một vệt trắng to** | Thu nhỏ và làm mờ hơi lạnh (0,42 × 0,26 m → 0,24 × 0,15 m, độ đục .55 → .22) |
| c24 | Lớp hơi ẩm là **một vệt tròn nổi lên**, không đọc ra là tấm kính mờ | Texture của lớp hơi đổi từ gradient tròn sang **tấm màn mờ mép mờ dần**; máy lùi ra (fov 18 → 36) để thấy cả vai áo lẫn lớp hơi phủ lên |
| c25 | Không thấy **dải vải đã bão hoà** ở mép áo — khung chỉ là một mảng vải trơn | Dải ẩm đặt đúng **ngay trên mép áo** (`y = .78`), đậm hơn; máy nhìn chéo xuống mép (fov 34), thẻ `BAO HÒA` chỉ vào dải |
| c27 | Nhìn **ngang qua** luồng gió nên không thấy gió | Máy nhìn **dọc theo luồng gió** (`(−.95, 1.14, −2.92)` → `(.42, 1.02, −3.24)`), hạt gió to hơn |
| c32 | Lớp hơi dày lên thành **một quầng xanh** | c32 vào nhánh hơi mỏng (độ đục .07, viền .14) |
| c33 | Quạt nhỏ trên kệ **nằm ngoài khung** | Máy lùi và nâng: fov 40 → 46, điểm nhìn `(−1.80, 1.00, −5.55)` |
| c34 | Hai thẻ `288 g` / `88 g` **đè lên mặt cân** | Máy lùi (fov 18 → 24), hai thẻ **đứng phía trên** mặt cân |
| c38 | Ba thứ quyết định tốc độ **không cùng khung** (chỉ thấy hai đồ đo, đàn áo nằm ngoài khung) | Máy lùi ra hiên nhìn qua lối cửa (fov 46): nhiệt kế + hai ẩm kế ở hậu cảnh trái, đàn áo ở bên phải, thẻ `DIỆN TÍCH PHƠI` chỉ vào đàn |
| c39, c41, c42, c44, c45, c46 | Thẻ số **đè lên mặt đồng hồ** | Mỗi thẻ đẩy sang bên hoặc lên trên bằng `dx`/`dy`; máy lùi ra cho mặt đồng hồ có chỗ trống quanh nó |
| c48, c49, c60 | Cụm áo bị **cắt ở mép khung**; c49/c60 không thấy hai cái áo để so | Máy lùi và canh giữa cặp đối chiếu (c48 fov 46, c49 fov 50, c60 fov 46), thẻ chỉ vào từng cái |
| c52 | Lớp hơi bám áo ở góc xa **mờ quá** | Độ đục lớp hơi 0,22 → 0,46, đọc được là hơi quay lại bám áo |
| c54 | Tay áo vải cuộn thành **lưỡi trắng lớn nhất khung** | Tay áo ngắn lại và tối màu (xem `PROPS-DIRECTORS-CUT.md`); máy nhìn chéo xuống mu bàn tay (fov 34) để thấy mười giọt mồ hôi bám da |
| c59 | Lối mở ra hiên **không có trong khung**, thẻ chỉ vào một cọc | Máy nhìn thẳng vào lối cửa (`(2.05, 1.50, 1.75)` → `(.95, 1.25, −1.00)` fov 42), túi nylon vẫy ở tiền cảnh phải |
| c4, c5, c7, c52 | Thẻ in trên bàn thí nghiệm (`CÓ GIÓ` / `KHÔNG CÓ GIÓ`) **lẫn vào hậu cảnh** của các nhát khác | Bàn thí nghiệm chỉ hiện ở câu 35–37 (`labVis`), nơi nó là chủ thể |

## VERDICT: PASS

SCOPE (lần 2): bản cắt này đóng **Bước 3 (storyboard)** cho tập `tap-01-phoi-quan-ao`, nay bao gồm cả **vòng sửa bố cục sau khi dựng hình thật** (bảng ở trên: 24 nhóm lỗi bố cục — máy ở sai phía, vật chính nằm ngoài khung, thẻ đè lên vật, lớp hơi đọc thành vệt tròn, vật lạ trong hậu cảnh). `LOOK.md` đã viết lại theo đúng mã.


---

## Sửa đợt này — sau bản cắt lần 2, bắt buộc bởi hình thật trong phim (vòng chấm hình)

Hai vòng chấm hình (`review/REVIEW.md`, `review/REVIEW-2.md`) soi toàn phim và bắt được sáu câu **FAIL chặn** cùng một lỗi liên tục. Tất cả đã sửa ở mã, và `LOOK.md` đã viết lại theo đúng mã (mười tám dòng bố cục cũ viết sai; nay `fov`, vị trí máy và điểm nhìn của **cả 60 dòng** được đối chiếu tự động với `src/film.js`).

| Câu | Lỗi của vòng chấm hình | Cách sửa trong mã |
|---|---|---|
| **c30** | Khung là một mảng tường trơn, câu "gió chở hơi nước đi" không có hình nào | Máy nhìn từ bên phải (fov 52): **quạt ở mép trái**, mép vải ướt giữa khung, **vệt hơi nước bị gió chở sang phải**, thẻ `HƠI NƯỚC BỊ CHỞ ĐI` chỉ vào vệt đó |
| **c41** | Mặt ẩm kế chồng chữ, con số 20 không đọc được, thẻ trỏ sai vạch | Mặt ẩm kế có **hai vòng** (% ngoài, g/kg trong), nhãn `g/kg` nằm bên trong, **vạch đỏ ở mức tối đa**; kim chạm vạch 20 của vòng trong, thẻ `20 g/kg` đứng sát vạch đó (xem `PROPS-DIRECTORS-CUT.md`) |
| **c44** | Thẻ "30 °C" trỏ vào tường trống, cột thuỷ ngân đọc 26–27 °C, đồng hồ đo sức chứa không có mặt | **Cột thuỷ ngân dâng lên từ ~26 lên 30 °C trong chính câu**, và **ẩm kế cùng khung** để thấy sức chứa đi theo nhiệt độ |
| **c45** | Hơi nước bốc ra từ đồng hồ đo thay vì từ tấm áo phơi | Kéo **mớ khăn ướt treo trên tường** vào khung, hơi nước bốc lên **từ vải**; thẻ `30 °C` khoá vào vạch 30 |
| **c48** | Hai thẻ trỏ vào vùng không đọc được, cái áo "phơi một mặt" bị cắt cụt | Máy canh giữa **cả hai đàn** (fov 52): thẻ `CHỒNG ÁO` và `PHƠI MỘT MẶT` mỗi thẻ chỉ vào đúng một đàn, hai đàn trọn trong khung |
| **c53** | Chỉ có một cửa sổ kín giữa mảng tường trơn, câu "phơi trong nhà lâu khô hơn" không có hình | Dựng lại cảnh: **áo ướt treo trong nhà** ở bên trái, **cửa sổ đọng hơi** ở bên phải, quạt đứng yên — một khung có cả hai |
| **c60** | Tái dùng nguyên khung c49, thẻ "TÁCH RIÊNG" trỏ vào đúng cái áo đang bị chồng | **Hai bàn phơi tách riêng**, mỗi bàn một cái áo, không món nào chồng lên món nào; áo bên phải có **một góc lật lên, mặt trong tối lộ ra** — thẻ `TÁCH RIÊNG` chỉ vào khoảng trống giữa hai bàn, thẻ `CẢ HAI MẶT` chỉ vào góc đang lật |
| **c54 → c55** | Bàn tay **bị lật gương** giữa hai câu liên tiếp | Cả hai máy dời **cùng một phía** của bàn tay (c54 từ `x = −1.95`, c55 từ `x = −1.60`), cánh tay không đổi bên; c54 có **mặt quạt ở tiền cảnh trái** và luồng gió chạy qua tay |
| **c17** | Cờ `DARK`: 85 % khung là nền trời trống, câu "mang theo năng lượng của nó" không có hình | Máy **thấp, ngước lên** (fov 30): phân tử bay lên ở giữa trên, **hào quang loe dần quanh hạt**, **vệt hơi nước mờ kéo thẳng xuống mặt nước**, nền trời sáng hơn |
| **c9** | Cận một giọt trên que, dễ đọc như cọng cỏ, không gợi "sợi vải" | Nền là **lớp vải đan mờ** (không phải nền xanh trơn), giọt **xanh hơn, đậm hơn** (xem `PROPS-DIRECTORS-CUT.md`) |

Những nhát còn lại trong đoạn c21–c29 cũng được dựng lại cho đúng câu: c22 nhìn thấp vào khoảng không trên vải, c23 **nhìn LÊN** khe giữa vai áo và dây phơi, c24 cận lớp hơi bám, c25 lùi ra cho **dải ẩm bão hoà ở mép áo**, c26 nhìn chếch lên từ bên phải (kẹp gỗ + cột hơi nước bốc lên chậm), c27 **mặt quạt ở tiền cảnh trái** và **lớp ẩm mờ trượt về quạt rồi mất** trong chính câu, c28 dải gió mờ kéo từ quạt sang tấm áo, c29 nhìn ngược lại phía quạt. Đèn tập trung được mở rộng và giảm cường độ (vết trắng chói trên vải), vệt gió mờ đi (không còn đọc ra là ván trắng).

## VERDICT: PASS

SCOPE (lần 3): bản cắt này đóng **Bước 3 (storyboard)** cho tập `tap-01-phoi-quan-ao`, nay bao gồm cả **vòng sửa bố cục sau hai vòng chấm hình**: sáu câu FAIL chặn (c30, c41, c44, c48, c53, c60), lỗi liên tục lật gương bàn tay (c54 → c55), và các câu còn lại trong đoạn c21–c29. `LOOK.md` viết lại theo đúng mã, và máy đối chiếu tự động `fov`/vị trí máy/điểm nhìn của cả 60 dòng với `src/film.js`.

---

## Sửa đợt này — vòng 11 (vòng chấm hình thứ ba)

Vòng chấm hình thứ ba (`review/REVIEW-3.md`, REJECT) soi toàn phim và bắt hai điều: **các câu nằm cạnh nhau trùng bố cục** (máy đo nhịp báo `SAME`), và **vật thể đứng yên** — máy trượt để giữ khung sống thay vì để vật tự diễn. Cả hai đã sửa ở mã, và `LOOK.md` viết lại theo đúng mã.

| Nhóm | Lỗi | Cách sửa trong mã |
|---|---|---|
| **c13–c18** | Sáu câu liên tiếp trên **cùng một bố cục**: c13 và c18 gần như một bức, c14–c15 cũng gần nhau | Sáu câu chia thành **ba bố cục khác hẳn nhau**: c13 cận mép nước; **c15 rộng, nhìn từ bên phải xuống cả mặt nước**; c16 cận một hạt đang bứt ra; **c17 thấp, ngước lên, rộng**; **c18 rộng, góc đối diện**, nhìn cả phần nước còn lại |
| **c33 → c34** | c34 là **phóng to** từ c33 (cùng một vị trí máy, chỉ khác tiêu cự) — máy đo nhịp báo `SAME`; và câu 34 nói "hai cái kim lệch nhau" nhưng không có chữ "hai" trên hình (cờ `NUM`) | c34 **đứng lệch bên phải** (`x = −.98`), nhìn chéo qua hai mặt cân; thẻ `2 CÂN` đổi thành **`HAI CÂN`** (đúng chữ câu 33 nói) và sống suốt cả hai câu |
| **c35** | Cùng bố cục với c34 và c36 | **Nhìn từ trên xuống cả bàn thí nghiệm** (fov 50): thấy trọn hai mặt kính, vách ngăn và quạt |
| **c37** | Cùng bố cục với c36, và giọt nước — thứ câu đó đo — quá nhỏ để đọc | **Siêu cận giọt** (fov 32, máy sát): giọt chiếm gần hết khung, vòng nét đứt làm thước đo, **hơi nước bốc lên thành hạt nhỏ** từ giọt |
| **Vật thể tự diễn** | Ở c33/c34/c50/c56 mọi thứ đứng yên; máy trượt để giữ khung sống | Hai áo nhỏ trên thanh kệ **đung đưa** (áo trước quạt mạnh hơn áo ở góc xa), **kim hai cái cân rung nhẹ**, **dải gió trên kệ** chạy từ quạt sang trái, **gió nhẹ ngoài hiên** trôi qua dây phơi (câu 47–60) |
| **Vệt gió ở kệ** | Vệt chạy ngang *dưới* hai cái áo, không chạm áo nào | Vệt **đi lên**, đúng tầm hai cái áo treo |
| **Mốc nhịp** | Mỗi câu chưa có điểm neo trên khung | `src/film.js` gọi `markBeat(ev, id, t0, d, [x, y])` cho **cả 60 câu**: mốc là chỗ thẻ của câu bám vào, câu không có thẻ thì lấy điểm máy đang nhìn; toạ độ chiếu theo đúng ống kính của nhát đó |

## VERDICT: PASS

SCOPE (lần 4): bản cắt này đóng **Bước 3 (storyboard)** cho tập `tap-01-phoi-quan-ao`, nay bao gồm cả **vòng sửa bố cục theo vòng chấm hình thứ ba**: sáu câu c13–c18 chia thành ba bố cục khác hẳn nhau, c34 không còn là phóng to của c33 và câu 34 có chữ "hai" trên hình (`HAI CÂN`), c35 nhìn từ trên xuống, c37 siêu cận giọt nước có hơi nước bốc lên, và **vật thể tự diễn** ở những nhát trước đó đứng yên. Mỗi câu có một mốc nhịp trên khung. `LOOK.md` viết lại theo đúng mã.

---

## Sửa đợt này — vòng 5 của bước 6 (vòng chấm hình thứ năm)

Vòng chấm hình thứ năm (`review/REVIEW-5.md`, REJECT) soi toàn phim và bắt ba câu **FAIL chặn** (c45, c49, c59) — ở cả ba, hình đang nói ngược lời — cùng một danh sách câu phải sửa và cờ `SAME`/`NUM` còn lại. Toàn bộ phần sửa được đã sửa ở mã; `LOOK.md` viết lại theo đúng mã (mười sáu dòng bố cục và số đọc cũ đã sai).

| Nhát | Lỗi của vòng 5 | Bố cục mới trong mã |
|---|---|---|
| **c25** | Dải ẩm bão hoà là một vệt xanh loang, không đọc ra là một mức; không có gì chuyển động | Dải bão hoà có **vạch mức sáng** ở chỗ ẩm dừng lại, thẻ `BAO HÒA` neo vào **đúng vạch đó**; dải **phồng nhẹ theo thời gian** (thở), không đứng chết như vệt sơn |
| **c34** | Thẻ `TRƯỚC QUẠT` chỉ vào góc đối diện kim; quạt bị cắt khỏi khung nên thẻ mất tham chiếu | **Xoá hẳn thẻ `TRƯỚC QUẠT`** ở c34 (không còn trỏ vào chỗ trống); thẻ `HAI CÂN` neo vào **đúng mặt cân bên trái**, hai kim vẫn lệch nhau |
| **c38** | Ba đạo cụ trong khung rộng chỉ là ba vệt ~30 px; không đọc được gì | Máy **áp sát vào tường** (fov 18, `(−1.10, 1.82, 1.00)` → `(−2.02, 1.94, −.95)`): **nhiệt kế (đọc 25 °C), tấm vải treo, ẩm kế (kim 90 %)** chiếm phần lớn khung, đọc được từng vạch. Vế thứ ba (diện tích phơi) do thẻ `DIỆN TÍCH PHƠI` ở c39 đảm nhiệm |
| **c40** | “Dây thứ hai” không có gì phân biệt — cùng một dàn, cùng một góc | Máy lùi và cao lên (fov 46, `(−.35, 2.02, 2.40)` → `(.72, 1.72, −.35)`): **dây thứ nhất ở tiền cảnh, dây thứ hai (đàn ba áo chồng) ở hậu cảnh** — hai dây thấy rõ là hai dây |
| **c44** | Thẻ `SỨC CHỨA CAO HƠN` đè lên mặt đồng hồ, che kim; thẻ `30 °C` chỉ vào khối đỏ | Khung dựng lại (fov 44) để có **nhiệt kế ba mươi độ (thiết bị riêng), nhiệt kế phòng 25 °C, tấm vải thử và ẩm kế** trong cùng một khung; thẻ `SỨC CHỨA CAO HƠN` chỉ vào **khe giữa kim và vạch đỏ 100 %**, không đè lên mặt đồng hồ |
| **c45** | Giọt rơi **xuống** trong khi lời là “hơi nước lan xa hơn”; thẻ `30 °C` chỉ vào que đỏ; khung gần như trùng c44 | Cận **tấm vải thử + nhiệt kế ba mươi độ** (fov 38), góc khác hẳn c44; **hơi nước mỏng bốc lên và lan ra hai bên từ tấm vải**, không còn giọt rơi; cột thuỷ ngân **đúng vạch 30**, thẻ khoá vào đúng đỉnh cột |
| **c46** | Không có gì bay hơi nên thẻ `×5` không có đối tượng; ngoặc đỏ làm `×5` thành tỉ lệ giữa 90 và 50 | **Bỏ ẩm kế thứ hai và dấu ngoặc đỏ**; cạnh ẩm kế 90 % là **tấm vải thử với cột hơi nước đặc bốc chậm**, thẻ `×5` bám vào cột hơi nước; thêm một vệt gió ngang khung |
| **c49** | Hai thẻ trỏ nhầm vật; cái áo úp cháy trắng, mất chi tiết vải | Thẻ neo vào **chính cái áo của mình** (`upPos()` / `spreadPos()`); cái áo úp **tối màu lại** và đèn hạ (FOCUS 1.45 → 1.2); cái áo phơi rộng đổi màu be để hai cái phân biệt được |
| **c59** | Không có gió, không có vải đung đưa; thẻ chỉ vào đám bụi | **Vệt gió** chạy ngang khung, gió hiên ×1.9 (vải đung đưa, túi nylon vẫy mạnh), góc máy dựng lại (fov 50) khác hẳn c58; thẻ `CHỖ THOÁNG GIÓ` chỉ vào **túi nylon đang vẫy** |
| **c60** | Thẻ `TÁCH RIÊNG` trỏ vào mặt bàn trống; trên cùng bàn có áo chồng áo | **Cái áo úp ở bàn trái vẫn còn** (nó là vế “tách riêng”), cái áo lật cạnh ở bàn phải; thẻ `TÁCH RIÊNG` chỉ vào **khe hở giữa hai bàn** — không món nào chồng lên món nào |

### Số đọc trên đồ đo — đã khoá lại trong cả phim

- **Nhiệt kế treo trong phòng luôn đọc 25 °C** ở mọi nhát.
- **30 °C (c44–c45)** nằm ở **một thiết bị riêng** đặt cạnh tấm vải thử, cột thuỷ ngân đúng vạch 30; thanh đỏ kiểu “cột ma” đã bỏ hẳn.
- **Ẩm kế trong cảnh luôn chỉ chín mươi phần trăm** trước c41 — đúng con số câu 46 đọc; trước đây nó chỉ nửa chừng, một số không câu nào đọc.
- **Mặt cân không in số**: phim không nói gam nào, nên không vẽ số.

## Vòng 6 — khung mở đầu (câu 1) dựng lại sau khi đọc tờ nhịp

Tờ nhịp 60 khung cho thấy câu 1 (`fill 8 %`) và người đọc độc lập nói thẳng: **cái áo không trông ướt**, và câu mở đầu không thấy được nước. Kiểm lại bằng ảnh thật thì đúng: khung cũ (fov 40, mắt `(−1.40, 1.55, 3.20)`, nhìn `(−1.25, .70, .85)`) để **bàn phơi gỗ đứng ngay trước ống kính** — bồn chậu nằm sát mép bàn phơi nên **không có góc nhìn nào từ phía trước thấy được nó**, và cặp áo của câu 49 nằm trên bàn phơi chiếm mất đáy khung.

Sửa:

| | Trước | Nay |
|---|---|---|
| Máy | fov 40, mắt `(−1.40, 1.55, 3.20)`, nhìn `(−1.25, .70, .85)` | **fov 46, mắt `(−1.62, 1.62, 2.75)`, nhìn `(−1.25, .92, .85)`** — lệch trái, gần hơn, ngẩng lên một chút |
| Bàn phơi + cặp áo của câu 49 | có mặt, che bồn chậu | **ẩn đi ở câu 1** (cờ `noBench`, `noCmp`) — chúng là đạo cụ của câu 49 và câu 60, chưa tới giờ xuất hiện |
| Bồn chậu có nước | bị che, không thấy | **thấy rõ ở đáy khung**, ngay dưới mép áo |
| Cái áo ướt | nhỏ, giữa khung, mờ | **chiếm phần lớn khung**: nửa dưới xám ẩm, bốn giọt bám trên vải, ba giọt ở mép, thẻ `QUẦN ÁO ƯỚT` chỉ vào vai |

Đã dựng lại bằng ảnh thật (`still.mjs`, `t = 4.6`) và soi lại: nước đứng trong bồn ngay dưới mép áo, đúng câu "nước vẫn còn đó, chưa đi đâu cả". `LOOK.md` viết lại dòng c1 theo đúng khung này.

## Vòng 7 — năm thẻ thuật ngữ đọc không đủ lâu, và hai thẻ chỉ vào cùng một vật

Bài đọc hình của cổng bàn giao đo được một lỗi **thật** của hình: năm thẻ thuật ngữ **hiện trên màn hình ít giây hơn** thời gian người xem cần để đọc trọn (chữ 26–30 px đọc ~2,2–2,6 s; thẻ chỉ hiện 1,1–1,9 s). Lỗi này không có cờ nào bảo vệ được, và nó thuộc loại **người xem** chịu, không phải loại máy đo.

Sửa (chỉ trong `src/film.js`; **không đụng góc máy**, không đụng đạo cụ):

| Thẻ | Câu | Cách sửa |
|---|---|---|
| `HƠI NƯỚC BỊ CHỞ ĐI` | c30 | giữ lâu hơn 1,5 s (`hold`) — thẻ vẫn chỉ mép áo đang bị gió chở hơi nước đi |
| `GÓC XA` | c34 | **hiện sớm hơn 0,8 s** (`lead`) — thẻ hiện đúng lúc lời kể nói "góc xa", và chỉ vào cái cân ở góc xa |
| `MỖI KG KHÔNG KHÍ KHÔ` | c42 | giữ lâu hơn 0,8 s (`hold`) — thẻ chỉ vào chữ `g/kg` trên mặt ẩm kế |
| `HƠI BỊ CUỐN ĐI` | c55 | giữ lâu hơn 0,4 s (`hold`) — vẫn nằm trong nhát của câu 55 |
| `NƯỚC PHẢI ĐI ĐƯỢC` | c57 | **hiện sớm hơn 1,0 s** (`lead`) — thẻ chỉ vào cái áo ẩm ở hiên, vẫn trong khung |

Hai thẻ phải dời chỗ, vì giữ lâu hơn thì chúng chồng lên nhau:

- `QUÉT XA HƠN` (c31) chuyển từ mép áo sang **mảnh ẩm bị gió quét đi** (`windVeil2`, ở `(1.05, 1.14, −3.00)`) — đúng vật mà câu 31 nói.
- `HAI CÂN` (c33–c34) chuyển từ cái cân ở góc xa sang **cái cân trước quạt** (`scale2`, mặt cân ở `(−1.56, 0.80, −5.45)`) — để hai thẻ của đoạn thí nghiệm chỉ vào **hai cái cân khác nhau**.

Góc máy của cả 60 nhát **không đổi**; mọi thẻ vẫn chỉ vào một vật có trong khung ở đúng thời điểm nó hiện (kiểm bằng ảnh thật: `still.mjs` ở 88,7 / 90,3 / 97,5 / 99,2 / 119,5 / 121,5 / 160,0 / 162,6 / 164,5 s).

## Vòng 8 — hai mũi tên chỉ vào khoảng trống, không phải vào vải

Tờ nhịp mới có công cụ dò mũi tên (`window.LABELPROBE`): nó raycast từ đuôi mũi tên của từng thẻ và hỏi **mũi tên có chạm vật nào không**. Ở tờ dựng trước, ba thẻ của đoạn mở đầu trả lời là **không chạm gì cả** — và soi ảnh thật thì đúng: thẻ nói "cái này" bằng chữ, rồi chỉ vào một khoảng không.

| Thẻ | Câu | Mũi tên cũ | Sửa | Mũi tên mới |
|---|---|---|---|---|
| `2 ÁO` | c4 | `(2.00, 1.34, −2.60)` — **đúng khe giữa hai cái áo** | dời sang cái áo ở góc xa | `(2.30, 1.22, −2.60)` |
| `TRƯỚC QUẠT` | c5–c7 | `(1.46, 1.16, −2.60)` — **lệch mép vải 2 cm** | dời vào giữa thân cái áo trước quạt | `(1.70, 1.16, −2.60)` |

Kiểm bằng ảnh thật (`still.mjs`): `t = 15,0` (c4) — mũi tên `2 ÁO` nằm trên vải cái áo bên phải; `t = 18,5` (c5) — mũi tên `TRƯỚC QUẠT` nằm trên thân cái áo trước quạt, thẻ `QUẠT` vẫn chỉ vào quạt, thẻ `KHÔNG CÓ GIÓ` vẫn chỉ vào cổ áo góc xa; `t = 25,5` (c7) — mũi tên vẫn bám vải khi máy nghiêng xuống, áo trước quạt nhạt màu còn áo góc xa vẫn sậm, đúng câu.

Lần sửa này **chỉ đụng `src/film.js`**: không đổi góc máy, không đổi đạo cụ, không đổi thời lượng câu.

## Vòng 9 — một mũi tên chạm không gì cả (c17)

Tờ nhịp dựng bằng công cụ dò mũi tên (`window.LABELPROBE`) bắt được **một** mũi tên chỉ vào khoảng không: thẻ `PHÂN TỬ BAY LÊN` ở c17. Nguyên nhân không phải chỗ neo — mà là khoá `dx: 86` của thẻ đó dịch **cả đuôi mũi tên** sang phải 86 px, mà ở c17 phân tử đang bay nhỏ hơn bán kính đó, nên mũi tên rơi ra ngoài vật.

Sửa: bỏ khoá `dx` ở thẻ đó — đuôi mũi tên chạm đúng vào ô xi đỏ của phân tử đang bay (kiểm bằng ảnh thật, `still.mjs` ở 53,1 s). Ở c16 cùng khoá `dx` đó **vẫn đúng**, vì phân tử ở c16 to hơn — đó là lý do cờ này phải do máy đo từng câu, không suy ra từ một câu khác.

Không đổi góc máy, không đổi đạo cụ, không đổi thời lượng câu.

## VERDICT: PASS

SCOPE (lần 5): bản cắt này đóng **Bước 3 (storyboard)** cho tập `tap-01-phoi-quan-ao`, nay bao gồm cả **vòng sửa bố cục theo vòng chấm hình thứ năm**: ba câu FAIL chặn (c45, c49, c59), các câu phải sửa (c25, c34, c38, c40, c44, c46, c60) và việc **khoá lại số đọc trên đồ đo**. `LOOK.md` viết lại theo đúng mã.

**Bổ sung vòng 7 (sau khi cổng đo được lỗi đọc thẻ):** năm thẻ thuật ngữ được giữ lâu hơn / hiện sớm hơn, và hai thẻ (`QUÉT XA HƠN`, `HAI CÂN`) dời sang vật khác. Góc máy không đổi. Chi tiết ở mục "Vòng 7" phía trên.

**Bổ sung vòng 8 (sau khi công cụ dò mũi tên báo hai thẻ chỉ vào khoảng không):** `2 ÁO` và `TRƯỚC QUẠT` dời mũi tên vào vải. Góc máy không đổi. Chi tiết ở mục "Vòng 8" phía trên.

**Bổ sung vòng 9 (sau khi công cụ dò mũi tên báo mũi tên ở c17 chạm không gì cả):** thẻ `PHÂN TỬ BAY LÊN` bỏ khoá `dx`, mũi tên chạm đúng vào phân tử. Góc máy không đổi. Chi tiết ở mục "Vòng 9" phía trên.

**Bổ sung vòng 10 (sau lần đổi khối tính cửa sổ thẻ sang `cardWindow()` của rig):** lần sửa mã cuối cùng (14:39) chỉ đổi *cách tính* cửa sổ của thẻ chữ — tôi đã đối chiếu hai công thức dòng bằng dòng (`rig/render.js:209-213` và khối đã xoá) và chúng tính ra **cùng một cửa sổ** cho từng thẻ. **Góc máy không đổi, `LOOK.md` không đổi, không câu nào bị cắt**; đó cũng là lý do phim không cần dựng lại. Bản cắt này được viết lại **sau** lần sửa đó để tem của bước 3 nói về đúng `LOOK.md` và `src/film.js` đang dùng.

**Bổ sung cuối (sau khi soi lại tờ nhịp):** ba câu c5, c6, c7 dựng lại cho đúng câu — ở c5–c7 trong khung chỉ có **đúng hai cái áo của cặp thí nghiệm** (cái áo ướt treo ở góc xa phòng, đạo cụ của câu 53, ẩn đi ở ba câu này), ở c6 **cả hai cái áo trọn trong khung**, ở c7 máy nghiêng xuống để **hai cái áo chiếm gần hết khung**. `LOOK.md` viết lại theo đúng mã.
