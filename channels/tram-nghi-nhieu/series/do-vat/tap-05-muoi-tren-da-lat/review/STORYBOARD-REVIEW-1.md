VERDICT: REJECT
ROUND: 1/5
SCORES: BỐ_CỤC=2 ÁNH_SÁNG=3 GÓC_MÁY=2

> **Phạm vi lần thẩm định này.** Thư mục `hero/` trong gói thẩm định **trống hoàn toàn (0 tệp)** — không có ảnh khung hình nào để soi. Vì vậy đây là **thẩm định bàn viết**: đối chiếu bảng máy trong `film.js` (25 nhát: `pos` / `look` / `fov` / `d`, cùng `applyState()`, `CARDS`, `window.render`) với `LOOK.md` và `TREATMENT.md`. Mọi phát hiện dưới đây đều là **suy ra từ số liệu trong mã dựng khung**, không phải từ quan sát ảnh. Ba tiêu chí cần mắt (vùng sáng chính, mức chiếm khung thực tế của vật thể, tối/sáng) **chưa thể xác nhận**; điểm chấm ở trên là mức trần của kiểm tra bàn và không thể nâng lên khi chưa có ảnh. `set.js` (kích thước viên đá, vị trí búa/hộp muối), `timeline.js` và `rig/` cũng **không có trong gói**, nên mọi phát hiện phụ thuộc vào chúng đều được ghi rõ mức tin cậy.
>
> **Đơn vị đo dùng xuyên suốt:** `FRAME_H = 2·D·tan(fov/2)` = chiều cao khung tính bằng mét tại vật thể (đại lượng duy nhất đo được từ mã để suy ra "vật thể chiếm bao nhiêu phần khung"); `nửa bề ngang = FRAME_H/2 · tỉ lệ khung` (16:9 hoặc 2.19:1 — kết luận về búa/đá đã kiểm ở **cả hai** tỉ lệ và không đổi).

## NHẬN XÉT CHI TIẾT THEO CẢNH

- **Hero 1 — c1 (tay rắc muối lên viên đá trong khay inox)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu:
    1. **Chưa có ảnh để soi** — không xác minh được vùng sáng chính hay mức chiếm khung thực tế của viên đá.
    2. **Chiếc búa nằm ngoài khung.** Vị trí duy nhất có trong mã cho chiếc búa là điểm nhìn của chính nhát c4: `(-0.02, 0.05, 0.47)`. Chiếu vào trục nhìn của c1: lệch **0.844 m** trong khi nửa bề ngang khung tại độ sâu đó chỉ **0.492 m** (16:9) → **172% nửa bề ngang**; nếu khung là 2.19:1 (như các hằng số clamp `1916×876` trong mã gợi ý) thì nửa bề ngang là 0.605 m và búa vẫn **ngoài khung ở 139%**. LOOK.md dòng 1 và TREATMENT.md dòng 4/25 đều yêu cầu búa xuất hiện ("hậu cảnh có … chiếc búa đặt yên", "đặt cạnh viên đá", "chiếc búa đặt yên từ đầu phim").
    3. **Khoảng trống giữa tay và đá.** Bàn tay chiếu vào **18.7% từ mép trên, đúng giữa khung** (px 960, py 202; điểm nhìn của viên đá ở chính giữa, py 540) → **~31% chiều cao khung là mặt bàn trống** nằm giữa hai vật. Đúng mẫu "hai vệt nhỏ quanh một mảng trống" mà tiêu chí A cấm.
    4. **Máy không đứng yên.** LOOK.md và TREATMENT.md đều viết *"Máy đứng yên, chỉ tay và hạt muối chuyển động"*, nhưng `d = [0.02, 0.01, -0.03]` → máy trôi **3.7 cm** trong nhát.
    5. **Chừa chỗ cho chữ:** bàn tay lấn vào 19% đầu khung ở giữa → mọi thẻ/phụ đề ở dải trên phải dồn hẳn sang góc trái.
  - Khuyến nghị quay: **giữ nguyên cự ly** của bản "Vòng 2" (viên đá đã đúng ~1/4 chiều cao khung — không kéo lại gần, vòng trước đã sửa đúng chỗ đó); sửa bằng **hạ bàn tay xuống sát viên đá** (`y` 0.28 → **0.18–0.20**; bàn tay rơi về ~32% từ mép trên, khoảng trống tay–đá còn ~17% chiều cao khung thay vì 31%), đưa chiếc búa vào trong **0.2 m** quanh khay (set.js) hoặc nghiêng lại `look` của c1, và **cho `d` của c1 = [0,0,0]** để máy đứng yên đúng lời.

- **Hero 2 — c13–c16 (mặt đá ở cấp nano)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu:
    1. **Bậc cự ly bị đảo ở c15.** LOOK.md dòng 15 yêu cầu *"Máy lùi ra một chút để thấy cả lớp bên dưới"*, nhưng `FRAME_H(c14) = 2·0.578·tan18° = 0.376 m` và `FRAME_H(c15) = 2·0.422·tan16° = 0.242 m` → khung c15 **hẹp đi 36%**, tức vật thể **phóng đại hơn c14 tới 1.55 lần**: **đẩy vào chứ không lùi ra**. Cơ chế "cầu ion nằm sâu dưới mặt đá" không có không gian nào để thấy.
    2. **c14 không chặt hơn c13.** `FRAME_H(c13) = 0.353`, `FRAME_H(c14) = 0.376` → c14 **rộng hơn** c13 6.5%, trong khi dàn ý yêu cầu c13 là bước "chui sát mặt đá" và c14 mới là cận cảnh. Bậc "tiến sát → cận cảnh" không hiện ra.
    3. **c16 hạ máy xuống thay vì nâng lên.** `d = [0.01, -0.01, -0.02]` → `d[1] < 0`: máy **hạ** từ y 0.14 xuống 0.13, góc nghiêng xuống đi từ −15.2° thành nông hơn. LOOK.md dòng 16 yêu cầu *"Máy nâng lên nhìn xuống lớp nước"* — hướng ngược hẳn.
    4. **Chuyển cỡ không có dấu hiệu.** Toàn khối nano được đóng khung ở đúng cỡ của các nhát trung cảnh thường (`FRAME_H` 0.24–0.38 m); mốc chuyển từ "cỡ bình" sang "cỡ phân tử" chỉ là **1.55 lần** chiều cao khung — không có gì trên màn hình nói "đã đổi cỡ".
    5. **Lớp nước được dẫn bằng MỘT đại lượng đơn điệu.** `layerK = [[0,0],[T(c13),0],[T(c16),.12],[E1(c16),1],[1,1]]` — cùng một con số phải làm lớp nước **dày thêm** ở c14 (molecules bám) và **mỏng đi** ở c16, nên một trong hai lời hứa bên nhất định bị trái. Hệt nữa, các con số "85 % → 40 %" mà LOOK.md "Vòng 2" mục (c) ghi là đã sửa **không xuất hiện ở đâu trong `film.js`** (mã chỉ có 0, 0.12 và 1).
    6. **Ánh sáng cấp nano đang là sáng nhất toàn phim.** `window.render` đặt `light = 1` cho cả set `N` và `P`, trong khi bếp `.82`, bàn thí nghiệm `.8` → cảnh vi mô **sáng hơn bếp 22%** và hơn bàn thí nghiệm 25%. LOOK.md "Vòng 2" mục (c) nói mặt đá nano **đã được sửa bằng cách hạ ánh sáng**; mã lại đưa đúng cảnh đó lên mức sáng cao nhất. Phải xác nhận việc hạ ánh sáng nằm trong `buildNano` (không có trong gói) — nếu không thì khung đang trắng xóa trở lại. *(Cảnh báo DARK không áp dụng; ngược lại là nguy cơ cháy sáng.)*
  - Khuyến nghị quay: sửa thẳng trong `SHOTS[]` — c13 `pos.z` 0.44 → 0.36, `fov` 38 → 44 để `FRAME_H(c13) ≈ 0.24`; c15 `pos.z` 0.38 → **0.52**, `fov` 32 → 34 để `FRAME_H(c15) ≥ 1.3 × FRAME_H(c14)`; c16 đổi `d[1]` sang **dương** (+0.015) và nâng `look.y`; tách lớp nước thành **hai đại lượng** (độ dày và độ mờ) để c14 dày lên còn c16 mỏng đi được cùng lúc; hạ `light` của set `N` nếu `buildNano` không hạ sẵn.

- **Hero 3 — c21 (bình nước muối đậm trong bể đá muối)**:
  - Bố cục: **Đạt (có điều kiện)**
  - Điểm yếu:
    1. **Góc nghiêng −29.5°, không phải "nhìn từ trên xuống qua miệng bình"** như mô tả hero — và đây là nhát **ít nghiêng nhất** trong ba nhát ở bể (c20 là −46.3°, c22 là −30.7°). Góc kiểu này vẫn hợp lệ (bể đá muối là nơi duy nhất LOOK.md cho phép nhìn từ trên xuống) nhưng không đạt hình ảnh "à ra thế" mà dàn ý hứa.
    2. **Số −21 °C nằm sát đáy thang.** `denseColumn()` cho `y = clamp(t·0.0063 + 0.165, 0.03, 0.288)`: 0 °C ở **0.165 m** (đúng giữa que — đạt yêu cầu "Vòng 2" mục (e)), −21 °C ở **0.0327 m**, còn đáy kẹp 0.03 m tương ứng **−21.4 °C**. Con số dấu hiệu của tập chỉ còn **0.4 °C (2.7 mm ≈ 14 px) dự phòng**, nên "dừng ở mốc −21 °C" gần như không phân biệt được với "cột chạm đáy que".
    3. **Thẻ "−21 °C" đã lên hình từ cuối c20**, và neo thẻ được tính từ vị trí que trong khi khung máy của c21 là hằng số viết tay **không hề gắn với vị trí đó** → nếu `set.js` cắm que thấp hơn y ≈ 0.13 m thì đầu cột −21 °C rơi khỏi khung và thẻ chữ thành **nhãn trôi không có vật mang nó**.
  - Khuyến nghị quay: nới thang (ví dụ `clamp(t·0.0055 + 0.165, 0.02, 0.30)`) để −21 °C có chỗ dưới mốc không độ rõ rệt; nâng máy lên `pos.y` 0.42 → 0.50, `look.y` 0.20 → 0.16 để góc xuống qua miệng bình đậm hơn mà vẫn giữ cột đỏ trong khung; **neo thẻ "−21 °C" theo cùng hệ toạ độ với khung máy** và mở cửa sổ thẻ từ đầu c21.

- **c4 (chiếc búa — "cách hiểu sai")**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu: **không có viên đá nào trong khung.** Điểm nhìn của c4 là `(-0.02, 0.05, 0.47)`, nửa bề ngang khung chỉ 0.158 m (16:9) / 0.194 m (2.19:1); viên đá đối chứng (x = −0.55) lệch **375%** nửa bề ngang, viên đá có muối (x = −0.82) lệch **420%** — cả hai đều ngoài khung dù theo tỉ lệ nào. LOOK.md dòng 4 và TREATMENT.md dòng 4 đều mô tả cảnh này là *"búa đặt cạnh viên đá"*. Chiếc búa cách viên đá đối chứng **0.595 m** — "bên kia mặt bàn", không phải "cạnh". Người xem tắt tiếng sẽ thấy một chiếc búa lạ lùng trên bàn, không thấy mối liên hệ "búa đập vỡ đá" mà lời kể đang nói. *(Độ tin cậy trung bình: vị trí búa suy từ điểm nhìn của chính c4; `set.js` không có trong gói để đối chiếu.)*
  - Khuyến nghị quay: đưa búa lại cách khay **≤ 0.15 m** trong set.js và nghiêng c4 về phía viên đá đối chứng (`look` ≈ `(-0.35, 0.08, 0.70)`, `fov` 30 → 34) để một khung chứa cả búa lẫn viên đá.

- **c8 (toàn cảnh bàn thí nghiệm)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu: `FRAME_H = 0.970 m` → một bình 12 cm chỉ chiếm **12%** chiều cao khung, và **lớp băng mỏng ở mặt bình nước sạch (~3 mm) chỉ chiếm 0.31%** — bằng chứng mà cả nhát này dựng để chứng minh không đọc được. Thêm nữa, c8 nhận **đúng `.8` như mọi nhát bàn thí nghiệm khác**, không có bù sáng riêng cho một khung rộng, trong khi bàn thí nghiệm vốn đã thấp hơn các cảnh vi mô 25%.
  - Khuyến nghị quay: giữ c8 làm toàn cảnh định vị (đúng vai trò "chuyển nơi chốn") nhưng **phải thêm một insert** của mặt bình nước sạch có lớp băng mỏng (`fov` ≤ 20, `FRAME_H` ≤ 0.15 m). Câu hỏi mà LOOK.md để mở ở vòng sau — "c8 có đủ sáng không" — **không phải câu hỏi độ sáng, mà là câu hỏi cỡ máy**.

- **c9 (bình nước muối 10 %)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu:
    1. **Số −6.6 °C không có thời gian ở trên màn hình.** `th10` chạm −6.6 **đúng ở khung cuối cùng của c9** — ở 25/50/75% nhát cột vẫn đọc −1.65 / −3.30 / −4.95. Nhát nào nói "sáu phần sáu độ dưới không" thì không có khoảng thời gian nào để đọc con số đó.
    2. **"Lớp băng đầu mọc ở thành bình" ở c9 không có driver.** `fz10` bằng **0** suốt c8, c9 và c19, chỉ bắt đầu chạy 0 → 0.85 **trong c20**. Lời kể c9 nói có băng mọc ở thành bình, nhưng không có gì mọc.
    3. **Thẻ "10 %" trôi ở dải trên, không đứng cạnh bình.** Neo thẻ là điểm cố định `(-0.40, 0.28, 0.85)` — **0.14 m cao hơn** điểm nhìn của bình (y = 0.14) → ở c9 hộp thẻ rơi vào `y 29..76` (canvas 1916×876 mà mã dùng), tức mép trên cách mép khung **3.3%**, lọt ra ngoài vùng title-safe 5%. *(Điểm tốt: khoảng cách 26 px bên trái neo ⇒ **không đè lên bình hay que nhiệt kế** — đạt yêu cầu của LOOK.md.)*
  - Khuyến nghị quay: cho `th10` về −6.6 **trước khi c9 bắt đầu** (vd. `T('c9')` → −6.6, giữ nguyên tới hết nhát) để con số có thời gian đọc; chạy `fz10` từ đầu c9 thay vì đợi c20; hạ neo thẻ xuống sát thành bình và kéo hộp thẻ xuống khỏi mép trên.

- **c19 (tổng hợp hai cơ chế)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu: `FRAME_H = 1.396 m` — **rộng nhất toàn phim**, gấp 1.44 lần c8. Nhưng dàn ý đòi cùng lúc ba bằng chứng: dòng lượn quanh que khuấy, hạt muối đang tan, và cột đỏ trượt trong các bình. Ở cỡ này bình 12 cm = **9%** chiều cao khung, một dòng lượn dài vài cm = **1–2%**. Và tệ hơn: **không có mã nào trong set `L` tạo ra dòng lượn, dòng chảy, hạt muối tan hay hiệu ứng nhiệt** — `PP.heat` là hiệu ứng của set `P` và không bao giờ bật trong set `L`; que khuấy cũng bị khoá quay ở `k === 9`. Nói cách khác: nhát "hai cơ chế cùng có mặt" hiện chỉ có **cơ chế thứ nhất** (cột đỏ).
  - Khuyến nghị quay: tách c19 thành khung rộng địa lý (bể + bình + tay đặt bát muối) **và** một insert cho dòng lượn + hạt muối đang tan + cột đỏ trượt (`fov` ≤ 24); bật hiệu ứng lượn trong set `L` hoặc dựng riêng cho bề mặt bể.

- **c3 (câu hỏi) và c6 (hai ly thuỷ tinh)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu: **hạt muối không rơi ở cả hai nhát.** `applyState` gọi `q.fall.update(t, k === 1 ? 1 : 0)` — hệ hạt rơi duy nhất ở bếp **chỉ bật trong c1**. LOOK.md dòng 3 đòi "hạt muối rơi xuống mép khay" ở c3, và dòng 6 đòi *"phải thấy muối đang tan chứ không chỉ thấy hai que nhiệt kế"* ở c6 — không có gì rơi, không có gì tan, và TREATMENT.md dòng 6 còn đòi tay **khuấy** ly mà trong nhánh bếp không có dụng cụ khuấy nào. Với người xem tắt tiếng, c6 chỉ còn là hai que nhiệt kế và một bàn tay không tác động gì.
  - Khuyến nghị quay: cho hệ hạt một chế độ theo nhát (rơi xuống mép khay ở c3; rơi + **tan** trong ly nước muối ở c6); thêm que khuấy cho c6. Ở c6, cột đỏ chỉ tụt 2 °C = 12.6 mm = **4.0%** chiều cao khung (`FRAME_H` 0.315 m, theo thang 0.0063 m/độ đã biết ở `denseColumn`) — nên siết c6 vào hai cột thủy nghiệm (`fov` 34 → 24) để chênh lệch đọc được.

- **c10 / c18 (que nhiệt kế trong vũng nước)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu:
    1. **Phần lớn cú tụt của cột đỏ diễn ra ngoài màn hình.** `thK` đi từ −1.0 (đầu c10) → −1.3 (cuối c10) → −2.0 (đầu c17) → −2.4 (cuối c18). Trong chính nhát c18 — nơi que là chủ thể duy nhất — cột chỉ trượt **0.2 °C = 1.26 mm ≈ 16 px trên 1080**; ở c10 là **0.3 °C = 1.89 mm ≈ 6 px**. Cột đỏ ở c18 là **8.6 cm chiều cao khung**, nhưng người xem phải so sánh hai mức lệch **2%** và **8%** chiều cao khung của hai khung có **10.5° yaw** và **7.1° pitch** khác nhau.
    2. **c10 quay ngược hướng so với c1.** LOOK.md dòng 10 nói c10 là khung "lùi ra cho thấy cả viên đá, vũng nước và que nhiệt kế cùng lúc" — nhưng c10 **tiến vào 40%** (khung hẹp đi 1.88 lần so với c1) và **lệch 66.5° về phía azimuth** so với c1. Khung mở và khung "quay lại" nhìn cùng một cái khay từ hai hướng gần như đối diện → mất sợi không gian ở đúng chỗ cần nó nhất.
    3. **c18 vừa chặt nhất phim (8.6 cm) vừa nghiêng nhất ngoài bàn thí nghiệm (−39.4°)**, làm **phẳng đi cột đỏ dọc** — đúng vật thể mà dàn ý bảo người xem so với mốc không độ. Thêm nữa mặt nước chưa đóng băng nằm ở đáy khay (y ≈ 0.01–0.05) chỉ lọt vào khung ở dải mép dưới, quá chủ thể.
  - Khuyến nghị quay: dùng lại **đúng góc và cự ly của c10** cho một insert trước c18; phóng đại độ tụt (ví dụ −1.0 → −4.0 thay vì −1.0 → −2.4); hạ c18 xuống ~−30° để cột đỏ không bị phẳng.

- **c2 (viên đá đối chứng)**:
  - Bố cục: **Đạt (có điều kiện)**
  - Điểm yếu: **"trượt nhẹ sang phải" hoá ra là đổi góc 81.2°.** `look` của c1 và c2 lệch nhau **81.2° azimuth**; trong nhát, chỉ 4% trong `d` là ngang, 94% là tiến vào chủ thể (0.15 cm ngang trên khung rộng 63 cm = 0.24%). Hai viên đá **vẫn cùng lọt khung** (viên có muối 16%, viên đối chứng 27% nửa bề ngang ở 16:9; 13%/22% ở 2.19:1) — nhưng người xem sẽ thấy một cú cắt đổi hướng, không phải một cú trượt, và dễ mất trí nhớ không gian về cái khay.
  - Khuyến nghị quay: giữ `look` của c2 gần trục của c1 hơn (lệch ≤ 30°), và dồn toàn bộ chuyển động vào `d` để đọc ra một cú trượt ngang thật.

- **c24 (kem tuyết ở nhà)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu: hành động nổi bật của nhát — *"sữa trong túi cứng dần"* — **không có đại lượng trạng thái nào** trong `film.js`: không có biến, không có setter, nhánh bếp buổi chiều không đụng tới túi zip sữa. Cảnh sẽ đứng yên trong khi lời kể nói nó đang đông dần.
  - Khuyến nghị quay: thêm một keyframe lá (độ đông của sữa trong túi) chạy trong c24, và đồng bộ với nhịp tan của đá trong bát.

- **Thẻ chữ & phụ đề (toàn phim)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu:
    1. **Thẻ "10 %" đã lên hình từ cuối c8** — khung toàn cảnh rộng nhất của bàn thí nghiệm. Neo thẻ chiếu vào `px 881, py 293`, hộp thẻ rơi vào `y 203..249`, tức **thẻ trôi giữa khung rộng**, nơi bình 10 % chỉ chiếm 12% chiều cao khung. Người xem thấy một con số trôi không biết chỉ cái gì.
    2. **Thẻ "10 %" ở c9 nằm sát mép trên** (3.3% từ mép khung) và **neo 0.14 m cao hơn bình** → không đứng cạnh bình như LOOK.md yêu cầu, mà treo lơ lửng trên dải trên.
    3. **Thẻ "−21 °C" mở từ cuối c20** (khung ba bình) và neo theo vị trí que trong khi khung máy là hằng số viết tay không gắn với que → có thể trỏ vào chỗ trống.
    4. **LOOK.md tự mâu thuẫn về vùng an toàn**: mục "Ngôn ngữ hình ảnh" nói thẻ và phụ đề nằm ở **dải dưới và bên trái**, còn mục "Khoảng trống cần chừa" nói phía **trên khung và góc trái** phải trống cho thẻ và phụ đề. Không thể chừa chỗ cho cả hai. Bàn tay ở c1 (18.7% từ mép trên) và ở c3 (19% từ mép trên, góc phải) đang lấn vào đúng dải mà LOOK.md bảo phải trống.
    5. Mấu số thẻ dùng canvas **1916×876** trong khi khung là 1920×1080 → 204 px dưới cùng không bao giờ dùng được cho thẻ, mọi thẻ bị dồn lên nửa trên khung và dễ chồng lên dải phụ đề.
  - Khuyến nghị quay: mở cửa sổ thẻ "10 %" từ `V.L['c9'].t0`; ghim thẻ "−21 °C" từ đầu c21 và neo theo cùng hệ toạ độ với khung máy; **định nghĩa một vùng an toàn duy nhất** (đề xuất: dải dưới 12% + góc trái 25%) và sửa hai mục của LOOK.md cho khớp; sửa hai hằng số clamp về đúng 1920×1080.

- **Chuyển cỡ & liên tục không gian (c11 → c12 → c13 → c16 → c17)**:
  - Bố cục: **Đạt một phần**
  - Điểm yếu: **trục nhìn được giữ gần như tuyệt đối** (c12 yaw −157.2° → c13 yaw −155.6°, lệch **1.6°**; c16 → c17 lệch 7.2°) — đây là cách cắt tốt, người xem đọc được như một cú đẩy liên tục. Nhưng **cỡ không đổi theo**: mốc chuyển chỉ **1.55 lần** chiều cao khung, và toàn khối nano được đóng khung ở đúng cỡ trung cảnh thường (0.24–0.38 m). Cộng thêm việc `P` và `N` là hai `THREE.Scene` riêng, không có gì hình học nối chúng — nên "đây là ruột của viên đá" phải do trục nhìn gánh, còn cỡ thì không gánh được.
  - Khuyến nghị quay: giữ nguyên phần trục nhìn (đã đúng) và **tăng chênh lệch cỡ**: hạ `FRAME_H(c12)` ~1.8 lần (khung rộng hơn ở cỡ bình) rồi siết c13–c16 xuống dưới 0.20 m, để cảm giác đổi tỉ lệ đến từ kích thước chứ không chỉ từ nội dung.

- **Vật đo ở bàn thí nghiệm (c8, c19, c20)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu:
    1. **Bình nước sạch đóng băng ít nhất, dù phải đóng băng nhiều nhất.** `beakers[0].setFreeze(.28)` được giữ cố định, trong khi bình 10 % đi tới `fz10 = 0.85`. Nước sạch có điểm đông 0 °C, cao hơn mọi dung dịch muối, nên phải đông trước và đông đặc hơn — trên màn hình nó lại là bình **ít băng nhất** trong bể. Nhát nào nói "nước sạch thì đông cứng ở không độ" lại là nhát chứng minh điều trái ngược.
    2. **Ba nhát đóng băng không trễ nhau theo thứ tự.** Cả `fz10` và `fzHalf` đều bắt đầu ở `T(c20)` và kết thúc ở `E1(c20)` → "bình nửa đặc đóng băng sau" và "bình nào đóng băng trước phải thấy được" chỉ hiện ra như **khác biệt về lượng**, không phải **thứ tự trong thời gian**.
    3. **Số bình không khớp giữa hai văn bản.** `film.js` có **bốn** bình đứng cố định trong bể, nên ở c19 bốn bình đều nằm trong bể, mâu thuẫn với LOOK.md dòng 19 ("ba bình thuỷ tinh ở bên kia") và dòng 20 ("Ba bình trong bể đá muối").
  - Khuyến nghị quay: nâng `beakers[0].setFreeze` lên ~0.9 để bình nước sạch đông đặc nhất; **trải `fz10` và `fzHalf` ra trước–trong–sau c20** để thứ tự đóng băng thấy được bằng mắt; thống nhất số bình giữa LOOK.md, TREATMENT.md và `set.js` (giữ bốn bình nhưng đổi lời kể c19 thành "bốn bình", hoặc bỏ bình nào không cần).

- **Ánh sáng (toàn phim)**:
  - Bố cục: **Chưa đạt**
  - Điểm yếu:
    1. **Bếp buổi sáng và bếp buổi chiều chỉ khác nhau đúng một con số.** `light` 0.82 → 0.62 tức **cắt 24.4% (0.40 stop)** trên toàn khung, không có đổi hướng key hay đổi màu nào được biểu diễn trong `film.js`. Cắt đều đọc ra là "tối hơn", không phải "ánh sáng đã ngả sang chiều" như LOOK.md "Vòng 2" mục 6 và TREATMENT.md dòng 23 yêu cầu.
    2. **Hai nơi chốn có nguồn sáng khác nhau lại gần như bằng nhau**: bếp `.82` và bàn thí nghiệm `.8` chỉ chênh **2.5%** — mức chênh này không làm phim phân biệt được "nắng chiều ấm từ cửa sổ" với "đèn bàn trắng lạnh".
    3. **Cảnh vi mô sáng nhất phim** (+22% so với bếp) trong khi chính LOOK.md nói chúng "có đèn riêng của riêng nó" — điều đó đúng, nhưng mức chênh lại ngược với tài liệu.
  - Khuyến nghị quay: để `buildKitchen({time:'evening'})` đổi hướng key và nhiệt màu (phần mã này không thấy được ở `film.js`); nếu chưa có thì bù bằng cách hạ `light` c1–c3 xuống ~0.72 để bù cùng một hướng; tách `light` cho set `N` khỏi set `P`.

- **Bảng khóa trạng thái (`meltK`, `pudK`, `thK`, `th10`, `fz10`…)**:
  - Bố cục: **Chưa đạt (về kỹ thuật)**
  - Điểm yếu: mọi bảng khóa kết thúc bằng một cặp **`[1, giá trị]`** trong khi các cặp còn lại là **giây tuyệt đối** (vd. `meltK` có khóa thật cuối cùng là `[E1('c18'), .45]` ≈ `[97, .45]`) → mảng **không còn thứ tự theo thời gian**. Hiện tại mọi thứ vẫn chạy được vì `keys()` quét theo thứ tự mảng và rơi về giá trị cuối; bất kỳ phiên bản nào sắp xếp khóa lại hoặc nội suy giữa hai khóa sẽ làm hỏng cả phim (ví dụ với t ∈ [1,5], một bảng đã sắp xếp sẽ nội suy độ tan từ 0.45 về 0.04, tức viên đá nhảy về 45% đã tan ngay giây đầu). `rig/kit.js` không có trong gói nên chưa kiểm được.
  - Khuyến nghị quay: đổi khóa cuối mọi bảng thành `[V.end, giá trị]` để bảng luôn tăng dần; đây là sửa một dòng, nhưng nó bảo vệ toàn bộ trạng thái của phim.

## KHUYẾN NGHỊ ĐẠO DIỄN

- **Điều chỉnh cần thiết (theo thứ tự ưu tiên):**

  1. **Nộp lại khung hình để soi.** `hero/` đang trống (0 tệp) nên vòng này không thể xác nhận bố cục, ánh sáng hay mức chiếm khung thực tế; kèm `set.js` và `timeline.js` để kiểm chứng vị trí búa / hộp muối / viên đá và số liệu nhiệt kế. **Không có ảnh thì không có vòng chấm hình ảnh nào là hợp lệ** — đây là lý do chính của REJECT, không phải lý do phụ.
  2. **Sửa hướng trượt của máy (9 nhát).** Cả 25 nhát đều trượt **về phía vật thể** (`dot(d, hướng nhìn) > 0` ở tất cả); chín nhát mà dàn ý gọi là "lùi ra / lùi xa" — **c3, c8, c10, c12, c15, c17, c19, c23, c25** — đang thực hiện một cú tiến vào chậm, và khung **hẹp đi 1.3–5.3%** trong chính nhát đó, nên "cả khay, cả hộp muối, cả bàn" **không thể được mở ra trong nhát**. Đảo dấu thành phần của `d` theo trục nhìn cho chín nhát này.
  3. **Cho máy chuyển động dọc.** Hiện **20/25 nhát có `d_y = 0.000`** và `|d_y|` lớn nhất toàn phim chỉ **1 cm**, trong khi dàn ý hứa máy "hạ xuống" (c11), "đi theo giọt nước lên trên" (c7), "nghiêng nhẹ xuống búa" (c4), "nâng lên" (c16), "nghiêng theo que nhiệt kế" (c18). Không có một cú lên–xuống nào được mã hoá.
  4. **Đảo lại bậc cự ly ở c13–c16** — c15 phải **rộng hơn** c14 (≥ 1.3×), c14 phải **chặt hơn** c13, c16 phải **nâng** máy lên chứ không hạ.
  5. **Cứu c4** — nhét viên đá vào khung có chiếc búa (búa cách khay ≤ 0.15 m, `look` c4 dời về phía đá). Không có viên đá trong khung thì ý "muối đập vỡ đá như búa" không có hình.
  6. **Bật muối rơi/tan đúng nhát** — `q.fall` không được khoá cứng ở `k === 1`; c3 cần hạt rơi xuống mép khay, c6 cần thấy muối tan trong ly nước muối (và cần que khuấy).
  7. **Chia c8, c19, c20 thành "khung rộng định vị" + "insert bằng chứng"** — hiện bằng chứng chiếm 0.2–2% chiều cao khung: lớp băng mỏng ở bình nước sạch (0.31%), dòng lượn và hạt muối đang tan ở c19 (1–2%), các cột đỏ trong bình (9%).
  8. **Hạ bàn tay ở c1** xuống sát viên đá (`y` 0.28 → 0.18–0.20) để tay và đá thành một hành động, xoá ~31% chiều cao khung bàn trống giữa chúng, cho `d` của c1 = [0,0,0] để máy đứng yên, và đưa búa vào khung. *Không kéo cự ly c1 lại gần — bản "Vòng 2" đã chỉnh cử ly này đúng; sửa khoảng trống bằng vị trí bàn tay.*
  9. **Sửa các lời hứa không có driver** — c9 (lớp băng ở thành bình, số −6.6 phải có thời gian đọc), c24 (sữa trong túi đông dần), c14/c16 (tách lớp nước thành hai đại lượng), c19 (hiệu ứng lượn ở set `L`).
  10. **Trả lại các bình về đúng vật lý** — bình nước sạch phải đông nhiều nhất, hai bình muối đông lệch nhau theo thời gian, và thống nhất số bình giữa hai văn bản với `set.js`.
  11. **Chỉnh thang nhiệt kế** để −21 °C có dự phòng dưới mốc không độ, neo thẻ "−21 °C" theo cùng hệ toạ độ với khung máy, và mở cửa sổ thẻ từ đầu c21.
  12. **Sửa thẻ chữ và vùng an toàn** — mở cửa sổ thẻ "10 %" từ đầu c9, hạ neo thẻ xuống sát bình, **định nghĩa một vùng an toàn duy nhất** giữa hai mục của LOOK.md, sửa hằng số clamp về 1920×1080.
  13. **Làm rõ ánh sáng** — tách `light` của set `N` khỏi set `P`, và biểu diễn chuyển sang chiều bằng hướng key + nhiệt màu thay vì chỉ cắt 24% đồng đều.
  14. **Sửa bảng khóa trạng thái** — đổi khóa cuối `[1, giá trị]` thành `[V.end, giá trị]` để mọi bảng tăng dần theo thời gian.

- **Kiểm thử tắt tiếng — 9 nhát không tự mang được lời của mình:** **c2** (viên đá nào được rắc muối), **c3** (muối rơi), **c4** (búa = cách hiểu sai), **c6** (muối đi vào ly), **c11** (hạt muối → hai ion), **c13** (chuyển từ bếp sang cấp nano), **c16** (trước/sau khi lớp nước mỏng đi), **c19** (cơ chế thứ hai), **c24** (sữa đông dần). Ba lỗi trong đó là lỗi mã thiếu driver, một lỗi là tỉ lệ tương phản quá nhỏ (c2), một lỗi là thiếu thiết bị hiển thị (c16). Đây là danh sách việc cần làm trước vòng 2.

- **Những gì đã kiểm và thấy ổn** (để biết phạm vi đã soi): trục nhìn giữ gần như tuyệt đối qua mốc chuyển cỡ **c12 → c13 (lệch 1.6° yaw)** — cách cắt tốt; thang nhiệt kế đặt **0 °C đúng giữa que** nên cột ở −21 °C chắc chắn nằm dưới mốc không độ (đạt yêu cầu "Vòng 2" mục (e)); **thứ tự đóng băng trong `film.js` đúng vật lý** (10 % đóng trước nửa đặc, đậm chưa đóng) — nhưng hai bình lại đóng cùng lúc và bình nước sạch bị giữ ở mức thấp nhất; các đường cong `meltK / pudK / patchK / frostK / tinK` đơn điệu và mỗi thay đổi xảy ra đúng nhát; thang cự ly ở bếp (0.086 → 0.616 m) và ở bàn thí nghiệm (0.145 → 1.396 m) phân bố rõ bốn bậc; **cả hai viên đá cùng lọt khung ở c2**; khoảng cách 26 px giữa neo và hộp thẻ bảo đảm thẻ **không đè lên** bình hay que nhiệt kế; thẻ "−21 °C" **đã trỏ đúng đầu cột đỏ** (đạt "Vòng 2" mục (e)) — nhưng thang không còn chỗ cho con số.

---
Người chấm: claude -p (model mặc định của claude) · review.sh --storyboard · 2026-11-09 19:31
