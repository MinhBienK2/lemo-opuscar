VERDICT: REJECT
ROUND: 1/5
SCORES: BỐ_CỤC=3 ÁNH_SÁNG=2 GÓC_MÁY=3

> **LƯU Ý VỀ NGUỒN ĐỀ (đọc trước khi đọc nhận xét):**
> Thư mục `hero/` **trống hoàn toàn** — không có ảnh khung hình nào để soi. Phim cũng
> **không dựng được trong thư mục này**: `film.js` import `../../../../rig/render.js`,
> `./set.js`, `./timeline.js`, `./voice/…` — không tệp nào trong số đó tồn tại, và
> `out.txt` không phải log dựng hình. Vì vậy **không nhát nào đã được chấm bằng mắt**.
>
> Toàn bộ nhận xét dưới đây là **chấm bằng hình học camera**, đọc trực tiếp từ `film.js`:
> vị trí máy, điểm nhìn, tiêu cự, và toạ độ neo của từng thẻ chú thích, chiếu ra
> khung 1920×1080 (fov là **chiều dọc**, khung 16:9; `forward = normalize(look−pos)`,
> `right = normalize(cross(forward,[0,1,0]))`, `up = cross(right,forward)`).
> Vì máy thường nghiêng xuống, **bề rộng khung tại mặt phẳng vật thể khác bề rộng khung
> tại điểm nhìn** — các con số bên dưới đã tính đúng trên mặt phẳng vật thể.
>
> Giả định nền (đã kiểm tra tự nhất quán): chai A `x=−0.92`, chai B `x=−0.65`,
> chai C `x=−0.36`; A và B ở `z=0.86` (cả bốn nhát toàn cảnh c5/c31/c45/c52 đều nhìn
> `z=0.860`); miệng chai `y=0.196`; bán kính thân `0.033`; đường kính mặt đồng hồ
> áp suất `0.06`; nhiệt kế ở `z=0.843`.
>
> Các con số then chốt đã được **kiểm chéo độc lập** bằng một lượt tính tay khác:
> c5 (chai C lọt vào khung), thẻ MÓC XÍCH (neo nằm ngoài khung), và c17/c18.
> Riêng c17/c18 **đã bị bác bỏ** khi kiểm chéo: hai nhát bổ sung nhau, không trùng lặp.

---

## NHẬN XÉT CHI TIẾT THEO CẢNH

### N1 · Bàn bếp — hiện tượng đời thường

- **[Hero 1 · c1 — rót nước sôi vào chai A]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Đây là **khung mở và là hero #3 của tập**, nhưng khung rộng **1,04 m** tính
    tại mặt phẳng miệng chai. Miệng chai chỉ chiếm **122 px = 6,4% bề ngang** — đúng
    trường hợp "vệt nhỏ giữa mảng trống". Bàn tay nắm quai nằm ở **hàng 61** (6% trên
    cùng, suýt bị cắt), thân ấm chiếm cột 238–701, còn **~33% bên phải khung trống**
    trơn bàn. LOOK gọi đây là "cận miệng chai A" — thực tế là **trung cảnh rộng**, và
    vết nhăn đầu tiên trên thành chai không đọc được ở cỡ này.
  - Khuyến nghị quay: Kéo máy vào và siết tiêu cự. Giữ thế rót nghiêng và cột hơi
    nước, nhưng đặt `fov ≈ 24–28` và đưa máy về ~0,42 m (thay vì 0,72 m) để khung rộng
    **~0,45 m**: miệng chai chiếm ~15% bề ngang, cột hơi nước có chỗ đứng, bàn tay
    vào khung ở **hàng ~200** chứ không phải hàng 61.

- **[c2 — siêu cận thành chai A nhăn]**
  - Bố cục: **Đạt**
  - Điểm yếu: Không có lỗi bố cục. Khung rộng **14,5 cm**, cao **8,2 cm**; thân chai
    chiếm 45% bề ngang và tràn theo chiều dọc — đúng cận cảnh cần cho một nếp nhăn.
    (Ánh sáng chưa kiểm được: xem cảnh báo DARK ở khối N2.)
  - Khuyến nghị quay: Giữ nguyên. Khi dựng, đảm bảo nếp nhăn có **vệt sáng viền** để
    tách khỏi nền nhựa trong suốt.

- **[c3 — toàn cảnh góc bàn bếp]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung rộng 2,22 m, góc nghiêng xuống 30°, đúng vai trò "nơi chốn phải có
    mặt". Rủi ro chưa kiểm được: cửa sổ sáng bên trái có nằm trong khung không — ở
    cỡ khung này mọi vật trên bàn đều ~3% bề ngang.
  - Khuyến nghị quay: Giữ nguyên. Khi dựng, xác nhận cửa sổ sáng **bên trái** thực sự
    nằm trong khung; nếu không, dịch máy sang trái 10–15 cm.

- **[c4 — đẩy chậm vào chai A]**
  - Bố cục: **Đạt**
  - Điểm yếu: Đẩy vào từ 0,31 m xuống 0,22 m bề ngang, mục tiêu đúng trên chai A.
    Nhưng khung cao 12–17 cm trong khi chai dài 19,6 cm — **miệng chai nằm ngoài khung**,
    nên người xem không thấy miệng trong câu hỏi "vì sao chai nhớ được hình cũ".
  - Khuyến nghị quay: Nâng điểm nhìn lên `y ≈ 0.115` và đẩy xa thêm một chút
    (`z ≈ 1.28`) để lấy được cả miệng chai trong khung.

- **[c5 — hai chai giống hệt nhau]**
  - Bố cục: **Chưa đạt — lỗi chặn**
  - Điểm yếu: **Sửa của Vòng 1 trong LOOK.md không đúng.** LOOK ghi "c5 chỉ lấy chai
    A và chai B vào khung; chai C đứng ngoài khung". Tính lại trên mặt phẳng bàn
    (khung rộng 0,881 m): **mép phải khung ở cột 1803 (thân chai) / 1896 (miệng)** —
    chai C **lọt vào khung suốt chiều cao**, ăn vào ~54 mm ở chỗ bàn và ~10 mm ở miệng.
    Một vệt chai thứ ba bị cắt cụt ở mép phải còn tệ hơn là không có chai C: người
    xem tắt tiếng sẽ đếm **ba** chai, đúng cái lỗi Vòng 1 nói đã sửa. Thêm nữa, giữa
    A và B có **444 px (23% bề ngang) bàn trống** — "hai chai giống hệt nhau **cạnh
    nhau**" không đọc ra thành một đôi: cả cặp chỉ chiếm 38% bề ngang.
  - Khuyến nghị quay: Dịch cả máy lẫn điểm nhìn sang trái ~6,5 cm (`pos.x = look.x =
    −0.845`), giữ `fov 38`, không xoay: mép phải lùi về −0,404 (chai C ra ngoài
    hoàn toàn), cặp A+B vẫn 38% bề ngang và có khoảng trống trên-trái cho thẻ.
    Nếu muốn cặp đọc ra là "cạnh nhau", phải **kéo A và B sát nhau trên bàn** (giảm
    khoảng cách 0,27 m xuống ~0,10 m) — việc dựng bộ, không phải việc quay.

- **[c6 — máy lệch sang mẩu preform]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung rộng 0,38 m, mẩu preform Ø4 cm chỉ chiếm **~10% bề ngang** —
    vật mà câu này trỏ tới lại là vệt nhỏ trong khung rộng. Và máy đang nhìn thẳng
    vào preform, nên "lệch sang" không thấy được: không có dấu vết của vật thể trước
    để so sánh.
  - Khuyến nghị quay: Giữ preform ở **một phần ba khung**, phần lại để trống cho
    nơi chai A vừa rời đi; `fov 24` và đứng cách ~0,24 m để preform chiếm ~22%
    bề ngang.

- **[c7 — cận mẩu preform]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,25 m, preform chiếm ~16% bề ngang, có khoảng trống phải cho
    phụ đề. Yếu nhẹ: chưa thấy "nhỏ và dày" so với thành chai — cần chai A cùng
    khung mới so được.
  - Khuyến nghị quay: Giữ; thu hẹp thêm một chút (`fov 24`, ~0,22 m) và đưa mép
    chai A vào mép phải khung để có thước đo trong ảnh.

- **[c8 — siêu cận preform cạnh hai ngón tay]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 12,2 cm, preform 33% bề ngang, hai ngón tay làm thước đo ✓.
  - Khuyến nghị quay: Giữ nguyên.

- **[c9 — preform nong thành hình chai]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung rộng 0,244 m nhưng **cao 0,137 m**, trong khi chai vừa nong dài
    19,6 cm — chai phồng lên sẽ **tràn khung theo chiều dọc**, nên "mốc sau" (hình
    chai) không thấy trọn như LOOK đòi ("mốc trước và mốc sau trong cùng nhát"). Thêm
    nữa shot list ghi máy "rồi đi theo tay", nhưng `c9` **không có drift** — chai bị
    tay cầm đi lệch −0,34 m, tức ra khỏi khung hoàn toàn, không ai thấy.
  - Khuyến nghị quay: Nâng `look.y` lên ~0,095 và `fov` xuống ~24 để khung cao ~0,19 m
    vừa đủ chứa chai nong; thêm một `drift` nhẹ đi theo tay về bên trái.

### N2 · Trong thành chai

- **[Hero 2 · c10 — mảng thành nhựa bị kéo căng hai hướng]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Mặt cắt có đường kính 0,54 m, cao 0,18 m; khung lúc này rộng 0,288 m và
    cao 0,162 m → **vật liệu lấp kín khung từ mép này sang mép kia, không còn một
    vùng trống nào**. Thẻ `HAI HƯỚNG` neo ở `[0.020, 0.055, 0.262]` rơi vào
    **(cột 1100, hàng 164)** → hộp thẻ đáp xuống cột 1126–1350, hàng 67–120, tức
    **nằm đè lên chính mảng nhựa đang được gọi tên**. LOOK hứa "Ở N2 là nền tối của
    lớp vật liệu" — chỗ đó không phải nền, đó là vật thể.
  - Khuyến nghị quay: Đưa máy lùi và nghiêng để **một phần nền tối của lớp vật liệu
    lọt vào góc trên-trái** (camera lệch `+x`/`+y`, nhìn chéo xuống mép cắt), rồi đặt
    neo thẻ vào vùng tối đó. Nếu không, phải đổi quy ước: thẻ N2 nằm ở góc trên-phải
    và mọi thẻ N2 phải có nền tối thật.

- **[c11 — máy xoay quanh mép cắt]**
  - Bố cục: **Đạt**
  - Điểm yếu: Góc khác hẳn c10 ✓ (máy lệch +0,24 m so với trục). Nhưng cùng lý do
    "không có vùng trống" như c10.
  - Khuyến nghị quay: Giữ góc; chỉ lại vùng trống cho thẻ.

- **[c12 — nhìn dọc theo trục chai]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Máy đặt thẳng bên trên và nhìn xuống: `look−pos = (0,−0.410,−0.005)` →
    **nghiêng 89,3°**, đúng góc **bản vẽ kỹ thuật** mà tiêu chí cấm. Khung rộng 0,446 m
    tức **82% đường kính mặt cắt** — viền tròn của đĩa nhìn thấy trọn nên hình ra
    một mặt bằng, không phải một vật thể trong không gian. Ý định của nhát ("vòng
    quanh thân là một cung dài khép vòng, còn chiều dọc thân là một đoạn thẳng ngắn")
    thì đúng, nhưng cách thực hiện thì sai ngôn ngữ hình ảnh.
  - Khuyến nghị quay: **Đẩy vào** để đĩa cắt **tràn khung** (`fov 34 → 22` giữ nguyên
    vị trí) — mất viền tròn, cung và đoạn thẳng đọc như hai vết trên một mặt cong chứ
    không phải sơ đồ. Thêm một chút trục lệch (`pos.x ≈ 0.045`) và nghiêng 80° để có
    chiều sâu. Nếu vẫn cần đối chiếu "cung vs đoạn thẳng", hãy làm nó bằng **hai
    nhát liên tiếp** (một nhìn nghiêng cho cung, một nhìn nghiêng 90° cho đoạn) thay
    vì một nhát nhìn từ trên xuống.

- **[c13 — đẩy sâu vào lớp nhựa]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Nhịp đẩy vào rất tốt (khung 11,7 cm), nhưng **thẻ `MÓC XÍCH` không bám
    vào vật nó gọi tên**: neo `[0.090, 0.020, 0.250]` chiếu ra **cột 2963 — ngoài khung
    1043 px về bên phải**. Mã overlay kẹp hộp thẻ vào mép phải: **cột 1737–1916,
    hàng 116–162**, tức **dán vào góc trên-phải**, xa cách móc xích. Người xem tắt
    tiếng thấy một chữ ở góc màn hình mà không thấy móc xích nào.
  - Khuyến nghị quay: **Đổi neo, đừng đổi máy** (xoay máy ~29° để kéo neo vào khung
    sẽ phá luôn cú "đẩy thẳng vào lớp nhựa"). Đặt neo lên một móc xích **thật sự
    nằm trong khung** ở cả c13 và c14 — ứng viên đã kiểm hình học: `[0.020, 0.010,
    0.250]` rơi vào (1286, 388) ở c13 và (912, 388) ở c14, đều nằm trong khung.
    Thêm chốt an toàn trong `film.js` (overlay, dòng ~609): neo ngoài khung thì bỏ
    thẻ, đừng để nó tự kẹp vào góc.

- **[c14 — hai bộ móc xích lộ ra]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Cùng lỗi neo: ở c14, neo chiếu ra **cột 2214 — ngoài khung 294 px**;
    hộp thẻ bị kẹp vào **cột 1737–1916, hàng 58–104**, tức sát mép trên-phải, không
    dính vào hai bộ móc xích vàng. Ngoài ra thẻ **đã lên hình từ c13** (cửa sổ
    `ids:['c13','c14']`), tức **gọi tên vật thể trước khi người xem đã thấy vật thể**
    (LOOK mô tả c13 là cú đẩy vào, móc xích "lộ ra" ở c14).
  - Khuyến nghị quay: Tách thẻ thành hai cửa sổ với hai neo khác nhau, mỗi neo nằm
    trên một bộ móc xích **đang hiện trong khung của nhát đó**; chỉ mở thẻ từ c14
    trở đi. Nếu giữ một thẻ chung, neo phải là một điểm **nằm trong cả hai khung**.

- **[c15 — lớp nhựa trong suốt trống trơn]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung rộng 0,100 m — vật thể chính của nhát là **sự trống**, mà sự
    trống thì không có "vệt" để đo. Người xem tắt tiếng sẽ thấy một mảng nhựa mờ và
    không biết đang có gì; đây đúng là nhát mà tiêu chí dặm "nhát thứ hai là FAIL".
    Câu "nhựa không có trí nhớ" không cần hình trống để hiểu — nó cần **đối chiếu**
    với c14.
  - Khuyến nghị quay: Làm c15 là **nửa sau của cú lùi ra từ c14** — móc xích ở
    khung bên trái, vùng nhựa trống ở khung bên phải, cùng một mặt cắt. Người xem
    thấy "cái này ở đây, cái kia không" trong một ảnh. Nếu giữ nhát riêng, phải thêm
    một dấu hiệu (một vết nướt, một mảy nhựa) để khung không trống.

- **[c16 — móc xích ôm chặt thành chai]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,164 m, móc xích nằm đúng tâm khung; đảo ngược c15 rõ rệt ✓.
    Vẫn thiếu vùng trống cho thẻ.
  - Khuyến nghị quay: Giữ góc; chừa góc trên-trái.

### N1 · Rót lại và mốc nhiệt

- **[c17 — đi thẳng vào miệng chai dọc theo que nhiệt kế]**
  - Bố cục: **Đạt**
  - Điểm yếu: Góc khác hẳn c1 ✓, khung rộng 0,131 m, tâm khung đúng ở miệng chai.
    (Đã kiểm chéo: c17 và c18 **không trùng lặp** — mặt nhiệt kế nằm ngoài đỉnh khung
    c17, miệng chai nằm ngoài đáy khung c18; mỗi nhát mang một thông tin khác.)
  - Khuyến nghị quay: Giữ. Chỉ lưu ý dòng nước sôi (6,5 mm) là **11 px** trong khung
    13 cm — nên để nó **chép qua ống kính ở góc**, đừng đòi nó đọc được là dòng nước.

- **[c18 — cận mặt nhiệt kế, 100 °C]**
  - Bố cục: **Đạt (có lỗi thẻ)**
  - Điểm yếu: Khung rộng 0,111 m × cao 0,062 m, tâm khung đúng ở mặt đồng hồ — đọc
    được số ✓. Nhưng neo thẻ `100 °C` ở `[−0.898, 0.256, 0.872]` chiếu ra
    **(cột 1224, hàng 37)**: hộp thẻ bị kẹp vào **hàng 8–54, sát mép trên khung**,
    tức **lơ lửng cách mặt đồng hồ ~490 px** — thẻ không bám vào con số "100" khắc
    trên đĩa (đĩa ở hàng 540), và ăn mất 5% chiều cao hình.
  - Khuyến nghị quay: Hạ neo xuống `y ≈ 0.242` (vẫn trên mặt đồng hồ nhưng chỉ ~1 cm
    trên tâm) để thẻ nằm ngay cạnh số khắc, và dùng `dy` riêng cho thẻ này để không
    còn dính kẹp mép trên.

- **[c19 — cận miệng chai, hơi nước thành cột]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,183 m, hơi nước + thành chai cùng khung ✓; khác hẳn c22 (0,122 m)
    và c43 (0,346 m) ✓.
  - Khuyến nghị quay: Giữ.

- **[c20 — N3, nhiệt loang từ mặt nước]**
  - Bố cục: **Đạt**
  - Điểm yếu: Máy đi xuống miệng chai, `fov 60` ở 7,5 cm — khung cao 8,7 cm, vệt
    nhiệt cam loang từ mặt nước ✓. Rủi ro: ống kính rất rộng ở cự ly rất gần.
  - Khuyến nghị quay: Hạ `fov` còn ~48 để mép mặt nước không bị méo, vẫn đủ rộng cho
    vệt loang.

- **[c21 — N2, nhiệt ăn vào lớp móc xích]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,156 m, vệt nhiệt vừa chui qua mép cắt ✓ — và ở đây vệt nhiệt
    **đã bật** (`N2.heat.visible = t > T('c20')`), nên nhận được nguồn sáng dẫn.
  - Khuyến nghị quay: Giữ.

- **[c22 — ngoài miệng chai, cột hơi nước mỏng]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,122 m, rõ hơn c19 ✓, và khác hẳn c43 ✓ (yêu cầu của LOOK).
  - Khuyến nghị quay: Giữ.

- **[c23 — cận vạch đỏ 70 °C]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: `fov 14` ở 12,3 cm → khung chỉ **2,3 cm × 4,1 cm**. Ở cỡ này mặt
    đồng hồ chiếm gần hết khung; thẻ `70 °C` neo ở `(1114, 486)` tức **nằm đè lên
    chính mặt đồng hồ**, và con số "70" đã khắc sẵn trên đĩa — thẻ chữ là **thừa và
    che**. Khung cũng không còn chỗ cho phụ đề mà không đè lên chi tiết.
  - Khuyến nghị quay: Nới `fov` ra ~20–22 (khung ~3,4 × 6,0 cm) để thấy cả vạch đỏ,
    con số 70 khắc trên đĩa **và** một chút mặt đồng hồ; đặt thẻ `70 °C` bám vào
    **vạch đỏ** ở mép, không đè lên số.

- **[c24 — cột rơi trên vạch, vệt ấm lan trên thành chai]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,32 m, thấy cả mốc nhiệt lẫn hậu quả trên vật ✓.
  - Khuyến nghị quay: Giữ.

### N2 · Vật liệu trượt, rồi chai co

- **[c25 — móc xích trượt ra khỏi chỗ cũ]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,125 m; có cả vùng trong vệt nhiệt (trượt) và vùng ngoài vệt
    (giữ) trong ảnh ✓. Thiếu vùng trống cho thẻ.
  - Khuyến nghị quay: Giữ.

- **[c26 — lướt dọc theo vệt nhiệt]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,133 m, hai vế của quy tắc đều trong khung ✓.
  - Khuyến nghị quay: Giữ.

- **[c27 — móc xích chùng đi, không ôm nữa]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,097 m — đúng cận cảnh "không còn ôm nữa" ✓.
  - Khuyến nghị quay: Giữ.

- **[c28 — thành chai A ngắn lại, hẹp vào]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,176 m, vật thể ở tâm ✓. Ghi nhẹ: khung này gần như **trùng**
    với c44 (0,175 m, cùng điểm nhìn, cách nhau ~40 giây) — chấp nhận được như một
    tiếng gọi lại, không nên dùng thêm lần nữa.
  - Khuyến nghị quay: Giữ; giữ c44 là bản "co thêm" nhưng đổi góc ~10° cho khác.

- **[c29 — mẩu preform chuẩn cạnh chai A đang co]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,244 m, hai vật tham chiếu cùng khung ✓ — đúng vai trò "hình cũ
    là hình của mẩu nhựa lúc đầu".
  - Khuyến nghị quay: Giữ.

- **[c30 — chai A nhăn nếp, máy lùi ra]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,175 m → lùi ra ~0,32 m; có `drift` +0,14 z ✓. Nhưng cảnh này
    đóng vai "bằng chứng", mà chai vẫn chỉ chiếm ~38% bề ngang.
  - Khuyến nghị quay: Lùi thêm và nới `fov` lên ~40 để thấy **cả cái chai nằm trên
    bàn** với bóng đổ dưới — đó mới là bằng chứng.

- **[c31 — chai A nhăn cạnh chai B còn thẳng]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,72 mở, **chai C nằm ngoài khung hoàn toàn** (mép phải ở −0,591
    ở mặt bàn, −0,627 ở miệng chai; mép trái chai C là −0,393) ✓ — đây là cách làm
    đúng, và **khác hẳn c5**. Ghi nhẹ: hai chai vẫn cách nhau 0,204 m.
  - Khuyến nghị quay: Giữ, và **lấy c31 làm chuẩn để sửa c5** — cùng kiểu hình, nhưng
    máy đứng gần hơn nên chai C mới thật sự ra khỏi khung.

### N2 · Hai hướng co lệch nhau, rồi cái nếp

- **[c32 — hai bộ móc xích lệch rõ độ dài]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,145 m; hai bộ trong khung ✓.
  - Khuyến nghị quay: Giữ.

- **[c33 — bộ quanh thân co mạnh hơn bộ dọc thân]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,115 m, đối chiếu hai bộ ✓.
  - Khuyến nghị quay: Giữ.

- **[c34 — cận nếp chạy dọc thân chai A]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,145 m, có `drift` +0,05 y để lướt dọc theo nếp ✓. Thẻ `NẾP`
    neo ở `(806, 526)` → hộp thẻ cột 831–928, hàng 430–482, **nằm ngay trên thân
    chai cạnh nếp** — đúng ý "thẻ bám vào vật" ✓.
  - Khuyến nghị quay: Giữ. Đảm bảo phụ đề ở dải dưới không đè lên chỗ nếp.

### N1 · Lực ngược lại — khí bị giam

- **[c35 — máy quay sang chai B, miệng còn hở]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,50 m, chai B chiếm 13% bề ngang và 70% chiều cao, hơi nước
    bốc lên ✓ — nhưng **chai B chưa hề có hơi nước cho tới c34** (`steamBPow` bật từ
    `T('c34')`), nên ở c35 nó bật ✓.
  - Khuyến nghị quay: Giữ; siết `fov` còn ~30 để chai B chiếm ~22% bề ngang — đây
    là lần đầu người xem thấy chai B, nó phải nổi bật.

- **[c36 — N3, khoảng không khí trên mặt nước]**
  - Bố cục: **Đạt**
  - Điểm yếu: `fov 58` ở 7,3 cm; mặt nước ở đáy khung, khoảng không khí ở trên ✓.
  - Khuyến nghị quay: Hạ `fov` ~48 để giảm méo.

- **[c37 — bàn tay vặn nắp lên miệng chai B]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung rộng **~21 cm**, tâm ở cổ chai B. Bàn tay được đặt ở
    `x = NECK_B[0] + 0.205 = −0.445`, tức **~9,5 cm ngoài mép phải khung** (mép phải
    ≈ −0,54). Phần chắc chắn: **cổ tay bàn tay nằm ngoài khung**. Phần chưa xác định
    được ở đây: hình học ngón tay (`rig/fx.js` không có trong thư mục) — nếu ngón
    tay không với tới được cổ chai, người xem tắt tiếng sẽ thấy **nắp tự xuất hiện**
    chứ không thấy ai vặn. Thêm nữa thẻ `NẮP KÍN` neo ở `(875, 431)` → hộp thẻ
    cột 901–1061, hàng 341–388, tức **nằm đè lên nắp và cổ chai** — đúng vật nó gọi
    tên, nhưng đè lên đúng hành động đang kể.
  - Khuyến nghị quay: **Kéo máy lùi và sang phải** để lấy cả bàn tay vào khung
    (`pos.x ≈ −0.50`, `z ≈ 1.30`, `fov 34`) — khung rộng ~30 cm, bàn tay chiếm ~35%
    bề ngang, nắp nằm ở 1/3 khung. Đẩy thẻ `NẮP KÍN` xuống dưới hoặc sang trái
    để không đè lên nắp.

- **[c38 — N3, miệng chai bị nắp chặn lại]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Nhìn lên từ trong bụng chai ra miệng, `fov 60` ✓ ý định đúng. Nhưng
    **thẻ `NẮP KÍN` bị gán sai nhát**: LOOK.md gán nhãn này cho **c38** (chính là nhát
    miệng chai bị nắp chặn), còn `film.js` gán cho **c37** (nhát vặn nắp bên ngoài).
    Hệ quả: nhát nơi nắp thật sự chặn lại — thứ mà câu "nắp vặn kín, không khí đó
    không ra được" đang nói — **không có thẻ nào**; còn thẻ lại nằm ở nhát trước.
  - Khuyến nghị quay: Chuyển thẻ `NẮP KÍN` sang **c38** (neo vào mép nắp trong bụng
    chai), và nếu muốn giữ ở c37 thì phải có **hai thẻ**, mỗi thẻ neo vào vật của
    nhát nó.

- **[c39 — N3, mũi tên vàng bung ra đẩy mọi phía]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: `fov 62` ở **5,5 cm** — ống kính cực rộng ở cự ly cực gần. Các mũi
    tên ở rìa khung bị **nong dãn mạnh** so với ở tâm, nên "đẩy mọi phía" đọc
    không đều; và mũi tên ở tâm lại nhỏ.
  - Khuyến nghị quay: Hạ `fov` còn ~42 và lùi ra ~9 cm (khung ~8,5 cm), để các mũi
    tên cùng cỡ trong toàn khung.

- **[c40 — chai B phồng lên từ dưới lên]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,228 m, thân chai 29% bề ngang ✓, đối lập rõ với chai nhăn.
  - Khuyến nghị quay: Giữ.

### N1 · Đồng hồ áp suất, chai hở nắp

- **[c41 — cận đồng hồ áp suất không chữ số]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,193 m, mặt đồng hồ 31% bề ngang ✓; thẻ `ÁP SUẤT` neo ở
    (GG[0], GG[1]+0.030, GG[2]+0.012) → đặt ngay trên vòng tròn mặt đồng hồ, hợp lý.
  - Khuyến nghị quay: Giữ.

- **[c42 — siêu cận kim đồng hồ dâng lên]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 8,2 cm, mặt đồng hồ 73% bề ngang ✓; động từ "kim đang chỉ
    lên" có chỗ để đọc ✓.
  - Khuyến nghị quay: Giữ.

- **[c43 — chai A hở nắp, khung rộng hơn hẳn c22]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung rộng 0,346 m — **gấp 2,8 lần c22** ✓ đúng yêu cầu, và thấy được
    cả miệng lẫn thành đã nhăn ✓. Nhưng thẻ `CHAI HỞ NẮP` neo ở `(948, 264)` →
    hộp thẻ **cột 974–1210, hàng 176–220**, tức **236 px rộng = 12% bề ngang, nằm
    giữa khung ngay trên cổ chai** — không phải ở góc trống đã dành sẵn.
  - Khuyến nghị quay: Chuyển thẻ ra **góc trên-trái** (LOOK đã dành chỗ nền tường tối
    ở đó) bằng `dx`/`dy` riêng; giữ vùng giữa khung trống cho vật thể.

- **[c44 — chai A co lại và nhăn thêm]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,175 m — gần như trùng c28. Chấp nhận (khác 40 giây), nhưng
    chính vì thế c46/c47 mới phải đổi góc rõ.
  - Khuyến nghị quay: Dịch máy ~8 cm sang phải và `fov 30` để phân biệt với c28.

- **[c45 — hai chai cạnh nhau, đồng hồ áp suất ở giữa]**
  - Bố cục: **Đạt**
  - Điểm yếu: Mép phải khung −0,571 (mặt bàn) → chai C ngoài khung ✓; đồng hồ áp
    suất ở tâm ✓.
  - Khuyến nghị quay: Giữ.

- **[c46 — chai B đang phồng, máy nghiêng theo thân chai]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,228 m, chai B ở tâm ✓.
  - Khuyến nghị quay: Giữ.

- **[c47 — chai A đã co và nhăn, miệng còn làn hơi mỏng]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,149 m; gần trùng c34. Chấp nhận, nhưng cần phân biệt rõ
    (nếp **đã hình thành** vs nếp **đang lướt**).
  - Khuyến nghị quay: Hạ `fov` còn ~22 để khung nhỏ hơn c34, và neo vào phần còn
    hơi mỏng ở miệng.

- **[c48 — cận chai B đang phồng]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,213 m, chai B ở tâm ✓ — và là cùng cái chai đã phồng, đúng
    điều kiện để c49 "cái chai vừa phồng kia" có nghĩa.
  - Khuyến nghị quay: Giữ.

### N1 · Để nguội

- **[c49 — N3, mũi tên đảo chiều vào trong]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: `fov 62` ở ~5,5 cm — cùng lỗi méo cực rộng như c39; mũi tên ngược
    hướng ở rìa khung sẽ méo nặng, và đảo chiều là thông tin chính của nhát.
  - Khuyến nghị quay: Hạ `fov` còn ~42, lùi ra ~9 cm (đồng bộ với c39 để c49/c50
    đọc là **cùng một không gian đảo chiều**).

- **[c50 — N3, mũi tên ép thành vào trong]**
  - Bố cục: **Đạt**
  - Điểm yếu: `fov 58` ở 7,6 cm → khung cao ~8,5 cm. Vẫn rộng so với cự ly, nhưng
    phải nhất quán với c49 để hai nhát đọc là **cùng một không gian đảo chiều**.
  - Khuyến nghị quay: Hạ `fov` ~42, lùi ~9 cm (đồng bộ với c49).

- **[c51 — chai B méo vào, kim đồng hồ rơi xuống dưới vạch]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung rộng **0,39 m**. Chai B chiếm **401 px (21%)** — nhưng **mặt
    đồng hồ áp suất chiếm 421 px (22%)**, tức **vật phụ rõ bằng vật chính**, và hai
    vật cách nhau **550 px bàn trống**. Nhát này phải chứng minh "thành bị hút vào,
    méo vào trong" — mà cái méo đó nằm trên một vật chỉ chiếm 21% bề ngang, trong
    khi cái đồng hồ lại dễ đọc hơn. Đây là nhát trả lời của cả phần "khí co lại".
  - Khuyến nghị quay: Siết `fov` còn ~22–24 (khung ~0,22 m) và đưa chai B vào **1/3
    phải**, đồng hồ áp suất **cắt ở mép trái** để kim vẫn thấy nhưng không cạnh
    tranh với vật chính.

### N1 · Chốt

- **[c52 — khung rộng: chai A nhăn, chai B méo, đồng hồ giữa, preform bên cạnh]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung rộng 1,00 m; ba vật trải trên ~49% bề ngang, chai C ở ngoài
    khung (và vô hình trước c60) ✓.
  - Khuyến nghị quay: Giữ.

- **[c53 — đẩy chậm vào chai A]**
  - Bố cục: **Đạt**
  - Điểm yếu: Cùng kiểu với c4 nhưng góc thấp hơn và gần hơn, nằm sau hai cảnh N2 nên
    không đụng ✓ (đã xử lý ở Vòng 1 của LOOK).
  - Khuyến nghị quay: Giữ.

### N2 · Chốt cơ chế

- **[c54 — móc xích bị kéo căng ôm hình chai]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,157 m, móc xích ở tâm ✓.
  - Khuyến nghị quay: Giữ.

- **[c55 — cận vạch đỏ 70 °C]**
  - Bố cục: **Đạt**
  - Điểm yếu: `fov 22` ở ~15,5 cm → khung ~7,7 cm; vạch đỏ đọc được ✓. Khác c23
    (`fov 14`) nên không trùng ✓.
  - Khuyến nghị quay: Giữ; nới lên ~24 để thấy cả vạch lẫn số 70.

- **[c56 — móc xích trượt về đường cong cũ]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,110 m ✓, nhân quả thấy trong một hình ✓.
  - Khuyến nghị quay: Giữ.

### N1 · Đáp lại và lời khuyên

- **[c57 — chai A đã co và nhăn, miệng chỉ còn làn hơi mỏng]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,197 m ✓.
  - Khuyến nghị quay: Giữ.

- **[c58 — bàn tay cầm chai A lên, xoay dưới ánh sáng cửa sổ]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,213 m, chai được nâng +0,055 m và xoay −0,90 rad; nếp dọc thân
    hiện được nhờ xoay ✓. Rủi ro: tay ở `x = A[0] − 0.245` → cần kiểm trong dựng
    rằng tay không ra khỏi mép trái.
  - Khuyến nghị quay: Giữ; nếu tay bị cắt, dịch máy sang phải ~6 cm.

- **[c59 — chai A và chai B, nắp chai rời nằm sấp trên bàn]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung rộng **1,10 m**; hai chai chỉ chiếm **30% bề ngang**, và **cái
    nắp rời** — vật mà câu "còn cái nắp thì quyết định cái nào thắng" chỉ đích danh —
    là một vật Ø3 cm, tức **~2,7% bề ngang**. Người xem tắt tiếng sẽ không biết cái
    nắp có mặt, huống chi là nó quan trọng.
  - Khuyến nghị quay: Siết `fov` còn ~22–24 và đưa **nắp rời lên 1/3 phải**, chai A
    và B ở 1/3 trái. Ba vật, ba vị trí rõ ràng.

- **[c60 — bàn tay dừng giữa chừng, dòng nước sôi ngắn lại]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung rộng **1,10 m**. Sự kiện duy nhất của nhát là **dòng nước ngắn
    lại**, và dòng nước rộng 6,5 mm = **11 px = 0,6% bề ngang**; phần ngắn đi chỉ
    vài chục px. Đây đúng là mẫu "vệt nhỏ giữa mảng trống" mà tiêu chí dặm là
    FAIL. Thêm nữa đây là nhát **lời khuyên** — thứ quyết định cả tập — mà lại rộng
    nhất trong tất cả các nhát N1 (sau c3).
  - Khuyến nghị quay: `fov 46 → 26`, đưa máy về ~0,45 m và đặt tâm khung vào **khe
    giữa vòi và miệng chai** (khoảng x=−0,94, y=0,20). Dòng nước khi đó rộng ~23 px
    và chiều dài dừng lại đọc được.

- **[c61 — cận thành chai A nhăn, không còn vệt nhiệt]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung 0,116 m ✓; vệt nhiệt tắt từ c52 ✓ — đúng luận điểm "chai đã
    nguội mà vẫn nhăn".
  - Khuyến nghị quay: Giữ.

- **[c62 — tay rót nước nóng ra cốc, nhiệt kế cắm trong cốc, cột rơi hạ dần]**
  - Bố cục: **Chưa đạt**
  - Điểm yếu: Khung rộng **0,54 m**. Chiếc cốc Ø7 cm chiếm ~13% bề ngang và **mặt
    đồng hồ nhiệt kế ~7%** — mà sự kiện của nhát là **cột rơi hạ dần**, tức một vạch
    đang đi xuống trên một mặt chiếm 1/14 bề ngang. Người xem tắt tiếng sẽ thấy
    "nước đổ vào cốc" chứ không thấy "nhiệt đang tụt".
  - Khuyến nghị quay: Tách: một nhát **cận mặt nhiệt kế trong cốc** (`fov 22`, cách
    ~0,15 m, khung ~6 cm) để cột rơi chiếm ~40% chiều cao; nhát rót ra cốc giữ
    nguyên nhưng để làm nhịp dẫn.

- **[c63 — rót nước đã nguội từ cốc sang chai C, đặt cốc xuống, vặn nắp]**
  - Bố cục: **Đạt**
  - Điểm yếu: Khung rộng ~0,34 m, và ba vật rơi đúng thứ tự đọc trái→phải: **nắp ở
    cột ~594 → miệng chai C ở cột ~960 → vành cốc ở cột ~1354** ✓. Đúng yêu cầu
    "nước phải thấy nó đi từ cốc sang chai trước khi nắp vặn lên".
    Ghi nhẹ: **cổ tay bàn tay** khi vặn nắp được đặt ở `x = NECK_C[0] + 0.205`,
    tức ngoài mép phải khung — cần kiểm trong dựng rằng ngón tay với tới được cổ
    chai; nếu không, phải kéo máy lùi.
  - Khuyến nghị quay: Giữ góc; nếu bàn tay bị cắt thì lùi máy ~8 cm.

---

## CẢNH BÁO ÁNH SÁNG (`DARK`)

- **Cảnh báo DARK cho c10–c16 (toàn bộ lượt N2 đầu tiên, 0:26–0:45).** LOOK.md nói
  rõ: *"N2 có vệt nhiệt cam là nguồn sáng dẫn, ánh sáng viền tím phía sau"* và *"Không
  khung nào tối mờ mịt"*. Nhưng `film.js` bật vệt nhiệt bằng `N2.heat.visible = t >
  T('c20')` — mà **c20 nằm SAU c10–c16**. Nghĩa là lúc máy giới thiệu vật liệu bị
  kéo căng và giới thiệu **móc xích** (thẻ `MÓC XÍCH` mở ở c13), **không có vệt nhiệt
  cam nào trong khung**; chỉ còn ánh viền tím. Đây là 19 giây, và là lúc người xem
  phải tin vào "móc xích" — vật thể mà thẻ đang gọi tên. **Phải dựng một khung thử
  ở c13 và c14 và soi trước khi chấp nhận.**
- **Ánh sáng N1:** "vệt sáng vàng ấm từ cửa sổ bên trái" và "đèn chính in bóng qua lỗ
  tường" do bộ dựng (`rig/sets.js`, `src/set.js`) quyết định, **không kiểm được ở đây**.
  Riêng c1 và c60 có máy ở góc phải, đối diện nguồn sáng bên trái → cần xác nhận
  mặt đang nhìn của chai vẫn nhận đủ sáng, không phải mặt tối.
- **Cảnh báo chung:** không khung nào nào được soi trực tiếp. Điểm ánh sáng bị
  chấm **2** vì **không thể chứng nhận**, không phải vì đã thấy lỗi.

---

## KHUYẾN NGHỊ ĐẠO DIỄN

- **Điều chỉnh cần thiết (theo thứ tự ưu tiên):**

  1. **c5 — sửa lại, đây là lỗi chặn.** Chai C lọt vào mép phải khung (cột 1803–1920,
     ăn 54 mm ở thân chai), đúng cái lỗi "ba chai" mà Vòng 1 của LOOK tưởng đã
     sửa. Dịch máy + điểm nhìn sang trái 6,5 cm (`pos.x = look.x = −0.845`) và
     **kéo chai A và B sát nhau** (0,27 m → ~0,10 m) để "hai chai giống hệt nhau
     cạnh nhau" thật sự đọc ra là một đôi. Lấy **c31** làm mẫu (nó đã loại được chai
     C sạch sẽ).

  2. **Thẻ `MÓC XÍCH` — đổi neo, không đổi máy.** Neo hiện tại nằm ngoài khung ở cả
     c13 (cột 2963) và c14 (cột 2214), nên thẻ bị kẹp vào góc trên-phải và **không
     bám vào móc xích**. Đặt neo lên móc xích thật trong khung (ứng viên đã kiểm:
     `[0.020, 0.010, 0.250]`), tách thẻ thành hai cửa sổ với hai neo riêng, và
     **chỉ mở từ c14** (nhát móc xích thật sự lộ ra) — không gọi tên vật trước khi
     người xem đã thấy nó.

  3. **Thẻ `NẮP KÍN` — gán nhầm nhát.** LOOK gán cho c38, code gán cho c37. Sửa
     code theo LOOK (thẻ nằm ở nhát miệng chai bị nắp chặn) hoặc tách làm hai thẻ;
     nhưng cả hai cách thì thẻ **không được đè lên nắp** ở c37.

  4. **c60 — siết khung.** Khung 1,10 m làm cho dòng nước ngắn lại (11 px) không
     đọc được. `fov 26`, máy ~0,45 m, tâm vào khe vòi–miệng chai.

  5. **c1 (khung mở) — siết khung.** Khung 1,04 m, miệng chai 6,4% bề ngang, bàn tay
     sát mép trên (hàng 61), 33% bên phải trống. `fov ~26`, máy ~0,42 m.

  6. **c37 — lấy bàn tay vào khung.** Cổ tay bàn tay nằm ~9,5 cm ngoài mép phải khung.
     Kéo máy lùi và sang phải (`pos.x ≈ −0.50`, `z ≈ 1.30`, `fov 34`).

  7. **c51 — ưu tiên vật chính.** Khung 0,39 m làm mặt đồng hồ áp suất (22%) rõ bằng
     chai B (21%). `fov ~23`, chai B ở 1/3 phải, đồng hồ cắt ở mép trái.

  8. **c59 — đưa nắp rời lên 1/3 khung.** Nắp Ø3 cm trong khung 1,10 m là 2,7% bề
     ngang, tức không ai nhìn thấy.

  9. **c12 — bỏ góc nhìn từ trên xuống thẳng.** Máy đang nghiêng 89,3° và khung
     chứa 82% đường kính mặt cắt → đọc như sơ đồ kỹ thuật. `fov 22` (mất viền
     tròn), lệch trục ~5 cm, nghiêng ~80°.

  10. **c15 — đừng để nhát trống trơn.** Sự trống không có "vệt" để đo; nên làm nó
      là nửa sau của cú lùi ra từ c14 (móc xích bên trái, nhựa trống bên phải).

  11. **c23 — nới tiêu cự và bỏ chữ thừa.** `fov 14` → ~21; thẻ `70 °C` đang đè lên
      chính mặt đồng hồ và **trùng** với số "70" đã khắc trên đĩa — bỏ thẻ, chỉ để
      số khắc, hoặc đặt thẻ sang mép.

  12. **Thẻ `100 °C` (c18) — rời khỏi mép trên.** Neo rơi vào hàng 37 nên hộp thẻ bị
      kẹp vào hàng 8–54, lơ lửng ~490 px trên mặt đồng hồ. Hạ neo xuống
      `y ≈ 0.242`.

  13. **Thẻ `CHAI HỞ NẮP` (c43) — đưa ra góc trên-trái.** Hộp thẻ 236 px đang nằm
      giữa khung, đè lên cổ chai; dùng `dx`/`dy` riêng để về khoảng trống đã dành.

  14. **Cảnh báo DARK — dựng thử c13/c14 và soi trước khi chốt.** Vệt nhiệt cam
      (nguồn sáng dẫn của N2) **không bật** cho tới sau c20, nên lượt N2 đầu không có
      nguồn sáng dẫn như LOOK mô tả.

  15. **N3 — bỏ ống kính 58–62° ở cự ly 5–7 cm.** Mũi tên ở rìa khung méo nặng,
      làm hỏng đúng thông tin "đẩy mọi phía" (c39) và "đảo chiều" (c49). Hạ còn
      ~42–48° và lùi ra ~9 cm.

- **Quy ước cần chốt lại:** LOOK hứa thẻ chú thích nằm ở **góc trên-trái**, nhưng
  `film.js` đặt thẻ **luôn ở bên phải và phía trên điểm neo** (`x = ax + bw/2 + 26`,
  `y = ay − bh/2 − 44`). 5/10 thẻ hiện đang rơi vào mép trên hoặc mép phải, và 2 thẻ
  (MÓC XÍCH, 100 °C) không bám vào vật. Nên **chọn một quy ước và viết lại cả hai
  tài liệu**: hoặc đổi mã để đưa thẻ về góc trên-trái, hoặc sửa LOOK để nói thẻ nằm
  bên phải vật — nhưng khi đó phải bảo đảm góc phải luôn sạch, và **mọi neo phải nằm
  trong khung** (thêm một chốt trong mã: neo ngoài khung thì bỏ thẻ, không kẹp vào
  góc).

- **Điều kiện để mở vòng chấm tiếp theo:** nộp **ảnh khung hình** vào `hero/` (ít nhất
  là 3 khung hero + các nhát bị nêu tên: c1, c5, c12, c13, c17, c18, c23, c35, c37,
  c51, c59, c60, c62, c63). Vòng này **không có ảnh nào để soi**, nên toàn bộ nhận
  xét trên là chấm bằng hình học camera; phần ánh sáng và phần "người xem tắt tiếng
  có đoán ra không" **chưa được kiểm chứng** và phải chấm lại trên ảnh.

---
Người chấm: claude -p (model mặc định của claude) · review.sh --storyboard · 2026-11-09 11:28
