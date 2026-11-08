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

## VERDICT: PASS

SCOPE: bản cắt này đóng **Bước 3 (storyboard)** cho tập `tap-01-phoi-quan-ao` ở vòng 5/5. Những gì được cắt: (1) 17 nhóm lỗi bố cục đã sửa trong mã (khung nhát, thẻ, góc máy, vật che khung) — xem bảng ở trên; (2) 4 nhóm **giữ lại kèm lý do** (không dựng lại `wovenFibres()` cho c11; c27 để fov 46 thay vì 52–56; c22 nhìn thấp vào mép lớp hơi; c8/c9 dùng chung bộ sợi với c10–c12); (3) ba nhóm dàn lại sau vòng 5 nêu ở mục trên (c49/c60 dàn lại cặp đối chiếu trên sàn, c12 lùi máy, c51 rút ngắn độ rơi của giọt). Máy đo nhịp (`beatsheet.mjs`) chạy lại sau khi sửa: không còn cờ nào (`SAME`, `RUN`, `DARK`, `NUM`). Mã và `LOOK.md` khớp nhau.
