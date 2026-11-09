# STORYBOARD-REVIEW — Vì sao chai nhựa bị co lại khi rót nước sôi vào?

VERDICT: REJECT
ROUND: 3/5
SCORES: BỐ_CỤC=2 ÁNH_SÁNG=3 GÓC_MÁY=3

> Đã soi 16 khung hình trong `hero/` (1920×1080), mở từng ảnh và soi cả các mảng crop phóng to.
> Những chỗ đã sửa ở vòng trước (LOOK vòng 7–10) không được nêu lại ở đây.
> Điểm trung bình = (2 + 3 + 3) / 3 = **2.67**, dưới ngưỡng 4.0. Ngoài ra **11/16 cảnh có vật chính bị
> che khuất hoặc chôn vùng trống** → không đạt điều kiện PASS.

## NHẬN XÉT CHI TIẾT THEO CẢNH

- **Hero 1 · `t_3.34.jpg` · c1 (N1 — khung mở, rót nước sôi vào chai A)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung mở của phim không đọc ra là "đang rót nước sôi vào chai". Cột nước xanh nhạt
    đứng **thẳng đứng trên miệng chai và kết thúc bằng một cục tròn lơ lửng giữa không, cách
    đầu vòi ấm khoảng 180 px về bên trái** — không có gì nối vào đỉnh cột nước. Ấm chỉ còn là
    một mảng xanh phẳng bị cắt ở góc trên-trái; miệng chai (vật chính) nằm sát mép dưới và chỉ
    chiếm ~1/5 chiều cao. Người xem tắt tiếng sẽ đọc đây là *"một vòi ống cắm cạnh một cái chai
    đang phun ra"* chứ không phải rót nước. Chính là lỗi "tia nước rơi ra không từ vòi" mà Vòng 9
    đã ghi — trên ảnh dựng thật nó **chưa** được sửa.
  - Khuyến nghị quay: Không đổi góc — đổi hình học. Đo lại trên ảnh dựng thật (không tính tay) vị
    trí màn hình của **đầu vòi** và của `POUR_TIP_A`; đặt sao cho chúng trùng nhau đúng một điểm.
    Đồng thời hạ tầm nhìn xuống và siết tiêu cự để miệng chai + đầu vòi + tia nước chiếm
    ~1/3 khung, và **bỏ hẳn thân ấm ra khỏi khung** (nó đang chiếm 1/3 bề ngang và không đọc ra
    là ấm). Đề xuất: `pos ≈ [-0.90, 0.26, 1.10]`, `look ≈ [-0.92, 0.225, A[2]]`, fov 26 → 32.

- **Hero 2 · `t_15.13.jpg` · c5 (hai chai giống hệt nhau)**
  - Bố cục: **Đạt (có điều kiện)**
  - Điểm yếu: Hai chai đứng giữa khung, đủ to, đủ sáng — đọc được "hai chai". Nhưng: (1) **cả hai
    miệng chai đều bốc hơi nước** (cột ở miệng chai phải rõ hơn cột ở miệng chai A) trong khi ở c5 chưa ai
    rót gì — hơi nước ở miệng chai B phải để dành cho c35 (nơi nó mới được gọi tên là "chai B còn
    nóng"), nếu không thì mốc "chai B còn nóng" mất hết ý nghĩa; (2) hai chai **không giống hệt
    nhau**: dải hồng trên thân chai phải có hoa văn khác nhau, và chai phải lệch cỡ ~10% trong
    khung vì lệch phẳng; (3) thân ấm cắt cụt ở mép trái là một mảng xanh vô nghĩa.
  - Khuyến nghị quay: Giữ góc. Tắt hơi nước ở miệng chai B trước c35; dùng **cùng một texture
    nhãn** cho A và B; đặt A và B cùng z để hai cái cùng cỡ; lùi máy thêm 5 cm để thân ấm rời
    hẳn khung. Dải trống bên phải chai B giữ nguyên làm chỗ cho thẻ.

- **Hero 3 · `t_33.41.jpg` · c12 (N2 — hai hướng kéo giãng)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung đọc ra là **một bản vẽ kỹ thuật phẳng**, đúng thứ mà chính code của phim đã
    cảnh báo ("nhìn thẳng đứng thì khung thành một sơ đồ kỹ thuật, mất cảm giác là lớp nhựa
    cong"). Mảng nhựa là một tấm bằng phẳng có góc, nền là một mảng navy trống chiếm ~60% khung;
    không có viền tím, không có vệt nhiệt, không có chiều sâu — người xem tắt tiếng không biết
    đây là thành của một cái chai. Vòng móc xích quanh thân đọc ra như một hình bầu dụ vẽ trên
    giấy, không phải một vòng xích ôm lấy một hình tròn.
  - Khuyến nghị quay: Hạ máy xuống dưới tầm mặt cắt để nhìn **chéo lên** vào mảng nhựa (thấy
    độ cong và chiều sâu), đặt vòng móc xích ở 1/3 dưới khung để nó thành hình cong có bóng đổ,
    và cho một vệt sáng tím viền sau + một vệt nhiệt cam nhỏ ở góc để có nguồn sáng dẫn. Ví dụ:
    `pos [.11, .06, .60]`, `look [.02, .03, .26]`, fov 34 → 38.

- **Hero 4 · `t_36.10.jpg` · c13 (N2 — cú đẩy vào lớp nhựa)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: **Cảnh báo DARK.** ~58% khung là nền navy gần như đen, không có nguồn sáng, không có
    vật; chỉ có một dải nhựa cong sáng ở 1/3 trái với hai mép cắt. Người xem tắt tiếng thấy một
    vệt cong mờ trên nền đen — không đoán được chuyện gì đang xảy ra, dù đây chính là nhát "đẩy
    vào để thấy thứ mắt thường không thấy". Nhát đứng yên mà không có gì để nhìn.
  - Khuyến nghị quay: Cho đèn phụ từ phía máy **rọi lên mặt cắt** để lớp nhựa trở thành một
    mảng cong có chiều sâu, và đưa một phần móc xích chưa gọi tên ló vào rìa khung (1–2 móc
    đầu thôi) để có "gì đó ở đó" mà chưa gọi tên — đúng logic "có hình trước khi có tên" mà
    Vòng 3 đã chốt. Tiêu cự 24 → 20 để lấp đầy khung.

- **Hero 5 · `t_46.38.jpg` · c17 (N1 — tua lại cảnh rót từ góc cao bên phải)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Tia nước **có** ra từ đầu vòi (điểm này đúng), nhưng nó là một thanh xanh `#8fdcff`
    đục, lốn thổn, rộng ~8 mm, đọc như một que sáng cắm vào ấm chứ không phải nước. Quan trọng
    hơn: **bàn tay không tồn tại trong khung** — chỉ có **hai đầu ngón tay với móng ló ra từ sau
    thân ấm**, tách rời, không có cẳng tay, không có bàn tay. Người xem tắt tiếng thấy "hai cái
    móng tay thò ra từ sau một khối xanh" — không ai đang rót. Thân ấm là một mặt phẳng xanh
    phẳng lì chiếm ~53% khung, không quai, không nắp. Vệt nắng cửa sổ ấm chỉ nằm ở nửa phải
    mặt bàn trống, còn tia nước lạnh là thứ sáng nhất — tương phản màu nghịch.
  - Khuyến nghị quay: Đưa **cả bàn tay nắm gốc vòi** vào khung (đây là điều bảng nhát đòi: "bàn
    tay đang nắm vòi"), đẩy máy sang phải và lên cao hơn để thân ấm lùi ra ngoài khung chỉ còn
    đầu vòi ở góc trên-trái; làm tia nước trong hơn (opacity 0.74 → 0.45, size .0034 → .0024,
    màu ấm `#dff3ff`) để không đọc như que sáng. Ví dụ `pos [-0.76, 0.36, 1.02]`,
    `look [-0.90, 0.225, A[2]]`, fov 26 → 30.

- **Hero 6 · `t_48.45.jpg` · c18 (nhiệt kế trong cốc — 100 °C)**
  - Bố cục: **Đạt**
  - Điểm yếu: Mặt đồng hồ to, sáng, số 100 khắc rõ, thẻ `100 °C` neo đúng ở mép phải số 100 và
    nằm trọn trên nền tường — đúng quy ước thẻ. Nhưng: (1) **số "70" và vạch đỏ 70 đã hiện
    rõ ngay dưới số 100**, tức con số 70 lộ ra sớm hơn câu gọi tên nó ở c23, và vạch đỏ 70 nằm
    ngay cạnh thẻ `100 °C` → hai con số đối chọi nhau trong cùng một khung; (2) **mặt nước trong
    cốc là một elip trắng bẹp**, đục như sữa, không gợn sóng, không bọt, không hơi — không đọc ra
    là nước sôi ở 100 °C; (3) dòng phụ đề nằm ở y 930–995 **đè lên vành cốc**, cắt ngang mặt
    nước, vi phạm quy ước "phụ đề ở dải dưới".
  - Khuyến nghị quay: Dựng lại khung chỉ từ số 100 trở xuống (nâng `look.y` 0.168 → 0.186) để "70"
    rơi ra ngoài mép dưới; tô mặt nước bằng xanh nhạt trong suốt, thêm gợn sóng và bọt nhỏ, và
    hạ phụ đề xuống sát mép dưới.

- **Hero 7 · `t_60.13.jpg` · c23 (mốc bảy mươi độ)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Nhát này chỉ có **một sự kiện** — "cột rơi nằm trên vạch đỏ 70" — và sự kiện đó
    **không đọc được**: đỉnh cột rơi bị cắt ở mép trên khung, và thang vạch nằm ở cột khác x
    cách cột rơi ~110 px, nên không có quan hệ hình học nào cho thấy cột đứng trên vạch. Số "70"
    khắc trên đĩa nằm sát mép trên khung. Trong khi đó **chiếc cốc cam là vùng bão hoà màu mạnh
    nhất và chiếm gần một nửa khung** — mắt người xem đi vào chiếc cốc chứ không vào vạch đo.
    Mặt nước trong cốc lại là một mảng trắng đặc, đọc như sữa. Phụ đề đè lên thân cốc.
  - Khuyến nghị quay: Mở khung lên và lùi ra để **đỉnh cột rơi + vạch đỏ 70 + số "70" khắc +
    vành cốc** cùng nằm trong khung, và đặt chúng ở 1/3 trên; hạ bão hoà màu của cốc đi 30%;
    hạ phụ đề xuống dải dưới. Ví dụ `pos [-0.30, 0.19, 1.28]`, `look [-0.28, 0.165, 0.97]`,
    fov 26 → 32.

- **Hero 8 · `t_90.56.jpg` · c35 (chai B còn hở, hơi nước bốc)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: **Vật thể chính bị chôn trong một mảng trống.** Thân chai B bị cắt cụt ở mép dưới,
    chỉ còn cổ + vai + nửa nhãn (~11% diện tích khung), còn ~78% khung là tường gạch trơn không
    có gì — đúng mẫu "vệt nhỏ giữa mảng trống". Tệ hơn: **miệng chai B nhìn như ĐÃ CÓ NẮP** —
    trên cổ là một mặt tròn phẳng màu xám sáng có vành vòng quanh, không có lỗ miệng tối, không
    thấy ren hay thành trong; người xem tắt tiếng đọc ngược hẳn câu kể ("chai B **còn hở**").
    Cột hơi nước — thứ duy nhất chứng minh chai B còn nóng — mờ, xám trên nền gạch tím, bị cắt ở
    mép trên, và quanh miệng không có hào quang ấm. Cả bên trái khung không có mép chai A ló
    vào như code ghi, nên "còn một lực nữa" không có vật mới để bám vào.
  - Khuyến nghị quay: Lùi máy và hạ điểm nhìn để **trọn chai B từ đáy tới miệng** cùng cột hơi
    nước trọn trong khung, và lệch `look.x` sang phải ~2–3 cm để mép chai A lọt vào mép trái
    khung. Sửa miệng chai: phải thấy **lỗ miệng tối + ren trong** để đọc là "hở nắp". Thêm hào
    quang ấm quanh miệng. Ví dụ `pos [-0.64, 0.17, 1.62]`, `look [-0.665, 0.11, B[2]]`, fov 26 → 30.

- **Hero 9 · `t_94.16.jpg` · c37 (bàn tay vặn nắp lên miệng chai B)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: **Hành động chính của nhát không có trong khung.** Bàn tay render thành một khối
    liền trơn nhẵn như đùi xúc xích — không có ngón ôm nắp, không có đốt, không có móng — và đầu
    ngón **chỉ chạm vào cổ chai, dưới nắp**; cái nắp ren teal nằm trọn trên miệng chai, hoàn toàn
    không bị đụng tới. Người xem tắt tiếng không thấy ai vặn nắp. Khối tay/cánh tay chiếm
    >45% chiều ngang, còn nắp + mặt đồng hồ chỉ ~9%. Thêm nữa **mặt đồng hồ áp suất bị xoay lệch
    ~40°** (vì đi theo nắp đang vặn), đọc ra y hệt một chiếc đồng hồ treo nghiêng, không phải một
    đồng hồ vặn trên nắp chai.
  - Khuyến nghị quay: Thu bàn tay về cỡ 2.5–3 lần đường kính nắp, gập 3 ngón **ôm nắp** (đầu
    ngón và móng nhìn thấy ở phía xa của nắp), cổ tay lùi về khuỷu; đưa điểm nhìn vào tâm nắp;
    giữ mặt đồng hồ **thẳng đứng** (bỏ xoay của nắp) và cho một dấu hiệu riêng (vòng ngoài đỏ)
    để không đọc như đồng hồ treo. Ví dụ `pos [-0.60, 0.235, 0.98]`, `look [-0.645, 0.215, 0.89]`,
    fov 34 → 26.

- **Hero 10 · `t_103.81.jpg` · c41 (đồng hồ áp suất)**
  - Bố cục: **Đạt**
  - Điểm yếu: Mặt đồng hồ tròn chiếm trung tâm, thẻ `ÁP SUẤT` neo ở mép phải vật, nằm trọn
    trên nền tường, không đè lên mặt đồng hồ — đúng quy ước. Điểm yếu còn lại: (1) mặt trắng +
    12 vạch đen + kim đỏ **trông y hệt một chiếc đồng hồ treo tường** (bộ bếp còn có `clock()`
    treo tường theo TREATMENT), mà phim lại cố tình không cho nó chữ số; (2) kim đang **chĩa
    ngang đúng vạch 3 giờ**, vạch không được đánh dấu là vạch 0 → đọc như "chỉ 3 giờ" chứ không
    phải "áp suất bằng không"; (3) **c41 và c42 gần như trùng hình** — lệch nhau 3–4 cm và 2° tiêu
    cự — trong khi câu "kim đang chỉ lên" cần một cú máy khác hẳn để thấy kim chạy.
  - Khuyến nghị quay: Giữ khung, nhưng thêm một dấu hiệu riêng cho đồng hồ áp suất (vòng ngoài đỏ
    / một vạch đỏ đặc biệt) và đánh dấu vạch 0. Cho c42 lệch hẳn c41: hạ máy xuống dưới trục
    kim và đẩy lên để thấy kim chạy qua đỉnh — ví dụ `pos [-0.648, 0.215, 0.93]`,
    `look [-0.652, 0.238, 0.895]`, fov 28 → 22.

- **Hero 11 · `t_128.16.jpg` · c51 (chai B bị hút méo — thẻ `HÚT VÀO`)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: **Hiện tượng duy nhất của nhát không đọc được.** Mép phải dải nhãn chỉ có **một
    khúc lõm nhỏ, gấp khúc sắc cạnh như lỗi low-poly** — không phải nhựa bị hút vào. Thêm nữa
    máy nhìn **thẳng chính diện vào trục chai** (`pos.x = look.x = -0.65`), nên một chỗ lõm
    biến dạng theo *chiều sâu* nhìn chính diện là không có gì để thấy. Khung cắt cụt cả vai lẫn
    đáy nên vật thể không còn đọc ra là "một cái chai bị méo" mà là "một mảnh nhựa bị cắt ngang";
    khung này **vẫn là cận cắt cụt**, chưa đạt "lùi ra cho trọn chai B" mà LOOK vòng 8 đã ghi.
    Dải nhãn in rõ hai dòng chữ `NƯỚC / NƯỚC KHOÁNG` chiếm tâm khung — trái với TREATMENT
    ("dải màu không chữ") và lấn át đúng thứ cần nhìn. Nếp nhăn của dải nhãn được vẽ thành một
    mảng xám bán trong suốt có cạnh cứng cắt ngang chữ, trông như lỗi texture.
  - Khuyến nghị quay: Dựng lại biến dạng "hút" thành **một lõm eo đơn, liên tục, sâu ~30 mm** với
    đường viền mượt, và cho camera đi **chép sang trái 20–25°** để lõm lộ ra bằng đường viền chứ
    không phải bằng bóng. Nới fov 30 → 40 và lùi để trọn chai B từ đáy tới vai, đặt eo ở 1/3 trái;
    thẻ `HÚT VÀO` vẫn neo ở mép phải eo. Bỏ chữ khỏi texture dải nhãn.

- **Hero 12 · `t_150.02.jpg` · c59 (hai chai + nắp rời)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Vật mà câu này gọi tên — **cái nắp rời** — nằm ở x≈1440–1560 (chỉ ~6% chiều
    ngang), cách chân chai B tới ~250 px, sát mép phải, không phải "nằm sấp ngay cạnh chai B"
    như LOOK vòng 9 đã ghi. Mắt người xem bị kéo hẳn sang góc trên-trái, nơi có **vòi ấm bị cắt
    cụt không có bàn tay** và một chuỗi hạt nước rời rạc, đứt đoạn ngay trên miệng chai A (lượng
    rót đang đầy nên tia nước phải chạm miệng chai). Nói cách khác: **nhát đang kể "cái nắp
    quyết định cái nào thắng" lại dựng lại đúng cảnh rót mở đầu**. Khung còn có **hai cái nắp**
    mà lời kể không chỉ rõ cái nào, và chai C — chủ sở hữu nắp rời — chưa xuất hiện.
  - Khuyến nghị quay: Đặt ấm về HOME và **tắt dòng nước ngay từ T('c59')** (goA = 0) để c59 là
    cú quay về bàn bằng máy với đúng hai chai + nắp; đặt nắp rời sát chân chai B trong 10–12 cm
    ở 1/3 phải và siết fov 28 → 23 để nắp chiếm ~10% bề ngang; đưa chai C vào khung nếu nắp
    rời là của chai C.

- **Hero 13 · `t_152.62.jpg` · c60 (lời khuyên — tia nước ngắn lại)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Sự kiện của nhát là **"tia nước ngắn lại, không chạm miệng chai"** — và nó **không
    thấy được**: cột nước là một chuỗi hạt **xanh trắng đục** đứng thẳng, đọc như một que nhựa
    dựng đứng chứ không phải nước; **đầu trên của cột cũng không gắn với vòi ấm** nào (giống
    c1), và **đáy cột dừng lơ lửng ~15 cm trên không**, không mọc ra từ miệng chai. Nửa trái khung
    (~45%) là một mảng thân ấm xanh navy phẳng lì không chi tiết, với **bàn tay đặt ngón trải
    phẳng trên mặt thân ấm** — trông như một bàn tay dán lên ấm, không thấy quai ấm, không thấy
    đang rót dừng. Miệng chai (đích của hành động) bị cắt ở mép dưới.
  - Khuyến nghị quay: Cho cột nước mọc **đúng từ miệng chai** và **từ đầu vòi** (đo lại trên ảnh
    dựng thật), làm nó trong hơn và nhỏ hơn để không đọc như que; đưa **quai ấm vào khung** với
    ngón bọc quai (curl 0.35–0.4); dời cả máy lẫn điểm nhìn sang phải để thân ấm chỉ còn 1/4
    khung và miệng chai nằm trọn trong khung. Ví dụ `pos [-0.85, 0.30, 1.02]`,
    `look [-0.905, 0.205, A[2]]`, fov 28 → 24.

- **Hero 14 · `t_158.02.jpg` · c62 (nhiệt kế trong cốc, cột rơi hạ dần)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Đĩa đồng hồ chiếm phần lớn khung nhưng **bị cắt ở mép trên**; **thang vạch nằm ở
    cột trái còn cột rơi lệch sang phải ~90 px, không chạm vạch nào**, nên "cột rơi" trông như
    một thanh đỏ dán lên mặt đĩa chứ không phải một cột thủy nghiệm trong ống mao dẫn — người
    xem không đọc được nhiệt độ. **Cue quan trọng nhất của nhát — "đầu dò nhiệt kế cắm trong cốc"
    — gần như vô hình**: chỉ thấy một cung vành cốc mỏng ở góc phải dưới, không thấy mặt nước,
    không thấy que cắm xuống nước; que bị cắt ngang bằng một mặt phẳng thẳng, trông như dán
    vào cốc. Tiền cảnh bên trái là một chai bị cắt cụt, trên đó nhãn in **chồng hai lớp chữ**.
  - Khuyến nghị quay: Vẽ cột rơi **trong rãnh thang** (cùng dải x, cách mép phải vạch 8–12 px,
    rộng 12–16 px) để đỉnh cột chạm đúng một vạch và luôn đọc được; hạ điểm nhìn 2–3 cm và nới
    fov 26 → 30 để lộ rõ vành cốc + mặt nước + que cắm trong nước; đẩy chai tiền cảnh ra khỏi
    khung; sửa texture nhãn cho khỏi chồng chữ.

- **Hero 15 · `t_161.13.jpg` · c63 nhịt 1 (rót nước đã nguội từ cốc sang chai C)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Nhịt 1 của c63 là "nước đã nguội đi từ cốc sang chai C" và **trong ảnh không có nước
    nào**: dòng `POUR_C_TO_C` chỉ dài 3,8 cm và nằm đúng chỗ thân cốc nghiêng che phủ lên cổ
    chai, nên không một giọt nào thấy. Thêm nữa **trong cốc cũng không có nước** — chiếc cốc vàng
    trông như một khối vàng rỗng, có thể đọc nhầm thành "cầm cái hộp úp lên chai". Cái nắp rời
    (thứ câu này gọi tên) nằm sấp ở góc dưới-trái, chỉ ~5% khung và sát mép. Nhiệt kế đứng
    thẳng trên que mảnh ở giữa khung, trông như **biển báo có chân**. Cốc nghiêng 60° nên đọc
    ra là một khối vàng phẳng có cạnh sắc, không giống cái cốc có miệng và nước.
  - Khuyến nghị quay: Nâng và lệch cốc để **môi cốc cao hơn miệng chai ~7 cm và lệch sang
    phải**, kéo dài dòng nước cho chạm miệng chai; giữ mặt nước trong cốc (xoay theo cốc, không
    tắt opacity khi nghiêng) và tô nước sáng `#e6f7ff` để đọc ra là nước; đặt nắp rời ở 1/3 phải
    gần chai C; đặt nhiệt kế **nằm nghiêng trên mặt bàn** thay vì đứng trên que.

- **Hero 16 · `t_162.60.jpg` · c63 nhịt 2 (vặn nắp lên miệng chai C)**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Nhịt "vặn nắp" đọc được, nhưng **chiếc cốc ở góc phải vẫn hiện một mặt nước trắng
    trơn lấm đầy tới miệng** — tức cốc trông như vẫn đầy nước, trong khi cả tập nói nước đã đi
    sang chai C; người xem tắt tiếng hiểu ngược là "chưa rót gì, giờ vặn nắp vào chai rỗng".
    Bàn tay lại chỉ đặt ngón **chạm vào mép phải của nắp** chứ không nắm, và cánh tay trông
    như một con xúc xắc nối vào khối navy bị cắt ở mép phải, không có vai, không có chỗ bám.
    Nhiệt kế lại xuất hiện ở góc phải như biển báo có chân. Chai C + nắp — vật thể chính — nhỏ
    và dồn sang 1/3 trái, trong khi ~45% bề ngang bên phải và ~50% chiều cao phía trên để trống;
    vùng bên phải chai C ở cao độ thân lại bị cốc và nhiệt kế chiếm, nên không còn chỗ trống
    sạch để neo thẻ.
  - Khuyến nghị quay: Hạ mặt nước trong cốc theo mức thật (sau khi rót xong còn ~25–30% chiều
    cao cốc, hoặc hẳn rỗng); đưa cổ tay xuống và sang trái để bàn tay **nằm ở bên trái nắp**,
    gập ngón ôm nắp, và thấy được một phần cẳng tay chạm bàn; đưa chai C + nắp sang 1/3 phải,
    siết fov 32 → 28 để nắp chiếm ~1/4 khung và mở một khoảng tường sạch bên phải nắp để neo thẻ;
    dời nhiệt kế ra xa tiền cảnh hoặc bỏ khỏi khung.

## KHUYẾN NGHỊ ĐẠO DIỄN

- **Điều chỉnh cần thiết (theo thứ tự ưu tiên):**

  1. **Sửa dòng nước ở c1 và c60 — đây là lỗi nặng nhất và nó xuất hiện ở khung mở.** Ở c1 tia nước
     đứng thẳng trên miệng chai và kết thúc lơ lửng giữa không, không chạm đầu vòi ấm; ở c60
     cột nước không gắn với vòi (đầu trên) và không mọc từ miệng chai (đáy dưới). Phải **đo trên
     ảnh dựng thật** vị trí màn hình của đầu vòi và của `POUR_TIP_A` rồi chỉnh `SPOUT_R` /
     `pourPose` cho trùng khít — không tính tay. Đồng thời giảm opacity và kích thước hạt
     (`opacity .74 → .45`, `size .0034 → .0024`) để nước không đọc như que sáng.
  2. **Sửa bàn tay rig — hiện chưa nhát nào cũng đọc ra là "tay".** c17 chỉ có hai đầu ngón tay
     ló ra sau thân ấm; c37 là một khối trơn nhẵn không nắm nắp (ngón chỉ chạm cổ chai); c60 ngón
     trải phẳng trên mặt thân ấm; c63 nhịt 2 ngón chỉ chạm mép nắp. Cần một rig tay có ngón ôm
     được vật (curl ~0.35–0.4, đầu ngón + móng nhìn thấy) và cổ tay có chỗ bám; ở c17 và c37
     phải **thấy cả bàn tay**, không phải móng tay.
  3. **Đưa vật chính lên đúng một phần ba khung ở 6 nhát đang chôn vật:** c1 (miệng chai),
     c35 (chai B), c51 (eo chai B), c59 (nắp rời), c60 (vùng tia nước dừng), c63 nhịt 1 (nắp +
     dòng nước). Cùng lúc đó thu bớt các vật vô nghĩa đang chiếm chỗ: thân ấm phẳng ở c17/c59/
     c60, mảng nhựa trống ở c13, tường trơn ở c35.
  4. **Sửa miệng chai B ở c35** — hiện nhìn như đã có nắp (mặt tròn phẳng có vành, không lỗ
     miệng tối, không ren). Phải thấy lỗ miệng và ren trong, cộng hào quang ấm, để đọc đúng
     "chai B còn hở nắp và còn nóng".
  5. **Sửa c51** — lõm phải là một biến dạng liên tục, mượt, ~30 mm, nhìn **chép 20–25°** để lộ
     bằng đường viền; lùi để trọn chai B. Đồng thời **bỏ chữ `NƯỚC / NƯỚC KHOÁNG` khỏi texture
     dải nhãn** (TREATMENT quy định "dải màu không chữ"; chữ hiện lấn át tâm khung ở c51 và c62,
     và bị in chồng).
  6. **Sửa mặt nhiệt kế** — vẽ cột rơi **trong rãnh thang** để đọc được nhiệt độ; mở khung để
     đỉnh cột + vạch 70 + số 70 cùng nằm trong khung ở c23; lộ rõ vành cốc + mặt nước + que cắm
     trong nước ở c62; mặt nước tô xanh nhạt trong suốt có gợn sóng và bọt, **không phải elip
     trắng đục như sữa**.
  7. **Sửa khung kết c63** — cốc phải còn ~25–30% nước sau khi rót (không đầy tới miệng);
     nhiệt kế **nằm nghiêng trên bàn** thay vì đứng trên que như biển báo; tay nắm nắp ở bên
     trái nắp; chai C + nắp chiếm ~1/4 khung với một khoảng tường sạch bên phải để neo thẻ.
  8. **Giảm số cột hơi nước trong khung:** ở c17/c35/c60 các cột hơi nước là các khối cầu viền
     cứng, xếp chồng, đọc như sợi dây hay thanh nhựa; làm chúng nhỏ hơn, mềm hơn, bám đúng miệng
     chai và có vệt sáng ấm quanh miệng.
  9. **Phụ đề:** ở c18, c23, c35, c59, c62, c63 dòng phụ đề nằm đè lên vật (vành cốc, thân cốc,
     nhãn chai). Hạ xuống sát mép dưới khung theo quy ước "dải dưới".
  10. **Ánh sáng N1 không đồng đều:** c5/c59/c62/c63 có vệt nắng cửa sổ ấm, nhưng c18/c23/c35/c41
      chỉ có nền gạch men tím phẳng, không nguồn sáng dẫn. Thống nhất lại một nguồn sáng chính cho
      N1, hoặc thêm vệt sáng ấm cho các nhát cận nhiệt kế / đồng hồ.
  11. **c12 trông như bản vẽ kỹ thuật** — hạ camera xuống dưới tầm mặt cắt để thấy độ cong của
      lớp nhựa và cho vòng móc xích một bóng đổ. **c13 tối mịt (DARK)** — thêm đèn phụ từ phía
      máy để lớp nhựa cong thành vật thể có chiều sâu, và ló 1–2 móc xích chưa gọi tên ở rìa
      khung.
  12. **c41 và c42 trùng hình** — tách hai cú máy để "kim đang chỉ lên" thấy được chuyển động.
  13. **c59 đang dựng lại cảnh rót mở đầu trong khi lời kể nói về cái nắp** — đặt ấm về HOME và
      tắt dòng nước từ T('c59'); đưa chai C vào khung để nắp rời có chủ.
  14. **c5: tắt hơi nước ở miệng chai B** (chỉ bật từ c35, đúng lúc câu gọi tên "chai B còn
      nóng"), dùng chung texture nhãn cho hai chai và đặt hai chai cùng z để chúng thật sự
      "giống hệt nhau".

- **Điều kiện để vòng sau xem xét lại:** 9/16 cảnh phải dựng lại từ góc máy (c1, c13, c17, c35,
  c37, c51, c59, c60, c63) và 4/16 cảnh phải sửa vật liệu/nội dung trong khung (c5, c18, c23,
  c62). Trong đó **c1, c35, c51, c59, c60, c63** là những cảnh mà vật thể chính đang bị chôn vùng
  trống — đây là điều kiện FAIL tuyệt đối của tiêu chí 1, phải sửa hết trước khi chấm lại.

---
Người chấm: claude -p (model mặc định của claude) · review.sh --storyboard · 2026-11-09 18:38
