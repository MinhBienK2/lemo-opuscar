# COMPONENTS_SPEC — Vì sao nồi cơm điện tự biết lúc nào cơm chín?

Đặc tả linh kiện của tập, làm theo `step4-component-breakdown/GUIDE.md`. Bản này do đạo diễn viết, để bước 5
(bóc vật) dựng đúng hình dạng ngay từ đầu, không phải sửa lại vòng nào vòng nấy.

Nguyên tắc (từ `STYLE.md` của kênh): **mọi vật thật phải dựng đúng là nó** — đủ bộ phận đặc trưng để người xem
nhìn ra ngay, đúng tỉ lệ và đúng hình khối. Chỉ thứ vô hình mới được thành hình minh hoạ (dòng hạt, dải sáng,
vòng hơi). Toàn cảnh dựng bằng toon 3D của kênh (`rig/kit.js`, `rig/parts.js`, `rig/lights.js`, `rig/fx.js`),
ánh sáng thật có hướng, viền mực vẽ tay.

Tên vật trong bảng là tên như lời kể gọi nó; mã tệp là `src/props/<mã>.js`. Danh mục do
`python3 channels/tram-nghi-nhieu/tools/props_catalog.py <tập> --write-index` sinh lại sau khi thêm hay
đổi tệp vật.

## 1. Danh mục vật

| Mã tệp | Tên vật | Câu kể | Cự ly | Trạng thái động | Hàm dựng | Bộ phận đặc trưng phải thấy |
|---|---|---|---|---|---|---|
| `noi-com-dien.js` | nồi cơm điện | c1–c6, c24–c27, c33–c35 | trung → cận | đèn trên thân đổi đỏ → hổ phách; vỏ bật/tắt | `noiComDien()` | thân nồi tròn, nắp có núm, đèn báo trên thân, công tắc đỏ-trắng, dây điện có phích, chân đế |
| `noi-cat-ngang.js` | nồi cơm điện bị cưa ngang | c7–c23, c28–c35 | cận → siêu cận | dây điện trở nóng đỏ, mâm nhiệt đổi màu, dòng hạt | `noiCatNgang()` | mâm nhiệt tròn có lõ, dây điện trở xoắn quanh vành, lò xo, viên cầu đầu dò nhiệt, hai dây mảnh, bo mạch, con chip, nồi trong có thành |
| `noi-com-doi-dau.js` | nồi cơm đời đầu | c36 | trung | chỉ hiện ở c36 | `noiComDoiDau()` | thân sành tròn có vạng sơn, nắp có núm, phích cắm, công tắc nhỏ ở thân |
| `noi-cu-cat-ngang.js` | nồi cơm đời đầu bị cưa ngang | c37–c39 | cận | thanh lưỡng kim cong, hai tiếp điểm tách | `noiCuCatNgang()` | thân sành cưa, thanh lưỡng kim hai lớp, lá đồng bản lề, hai tiếp điểm, dây điện trở dưới đáy |
| `cau-do-dien-tro.js` | máy đo điện trở | c11 | siêu cận | dải sáng chạy trên dây, số đo nhảy | `cauDoDienTro()` | vỏ vàng có hạt nhựa, màn hình số, nút xoay có vạch, hai que chạm (đỏ và đen) |
| `nhiet-ke.js` | nhiệt kế thủy ngữ | c19, c27, c42, c43 | cận | cột thủy ngân đổi chiều cao, vạch số | `nhietKe()` | ống kính có khung, cột thủy ngân đỏ, bọt ở đáy, bảng thang chia có vạch và số, chữ "SÔI" ở vạch 100 |
| `nuoc.js` | lớp nước trong nồi | c17–c24, c40–c43 | cận | mực nước hạ, sôi lăn tăn, hơi bay | `nuocNoi()` | mặt nước có gợn, mép meniscus ở mặt cưa, mặt cắt có sắc độ, bong bóng ở đáy |
| `gao.js` | hạt gạo | c20–c23 | siêu cận | hạt hút nước (trưng ra), nở ra | `gachGao()`, `gachGaoCat()`, `lopGao()` | hạt dài có nếp dọc, hạt bị cưa có núm tinh bột, lớp cơm có hạt nằm chồng và mặt cắt hạt thật |
| `bat-dong-nuoc.js` | bát đong nước | c47 | trung | nước sôi nhẹ | `batDongNuoc()` | thành bát trắng có vân, mặt nước có gợn sóng |
| `tui-gao.js` | túi gạo | c47 | trung | tĩnh | `tuiGao()` | túi giấy có nắp gấp, nhãn "GẠO", vài hạt rơi quanh |

Bối cảnh (không phải vật, không vào danh mục): bếp buổi sáng (bàn gỗ, tường gạch, cửa sổ có lỗ, đồng hồ treo
tường), hai nồi thí nghiệm bị cưa trên bàn.

## 2. Điều kiện bắt buộc về hình dạng

Đây là phần quan trọng nhất: những lỗi người chấm đã nêu ở vòng hình (bước 3) đều là lỗi **hình khối**, và
bước 5 là nơi sửa cho đúng. Dựng đúng các mục dưới đây thì các câu c7–c13, c19, c41–c43 đọc ra được ngay.

### 2.1 Nồi cơm điện bị cưa ngang (`noi-cat-ngang.js`)

- **Mâm nhiệt** (c7 "mâm nhiệt tròn"): phải là **đĩa tròn**, đường kính lớn hơn đáy nồi trong một chút, có
  vành nhô lên và lõ ở giữa. Đĩa phẳng nhìn từ trên xuống phải thấy vân xoắn của mâm điện trở. Không được
  là một thanh hay một tấm bằng.
- **Dây điện trở** (c7 "dây điện trở xoắn lại"): **một cuộn xoắn thật quanh thành** — ống tròn tròn đi
  vòng quanh theo hình xoắn ốc, ≥ 6 vòng, có khe hở giữa các vòng, đường kính sợi ≥ 8 mm để ở cận cảnh
  vẫn là một sợi tròn chứ không thành dải. Khi mặt phẳng cưa cắt qua nó, phần bị cắt phải là **mặt cắt tròn**
  (dây bị cưa ngang), không phải một mảng vỏ dẹt.
- **Lò xo ép viên cầu** (c8, c9): phải là **lò xo xoắn** — dùng `spring()` của `rig/parts.js`, với bán kính
  ≥ 14 mm và dây ≥ 3 mm, số vòng ≥ 6, để các vòng lò xo và khe giữa chúng thấy rõ ở siêu cảnh. Lò xo nhỏ
  hơn thế đọc ra như một trụ kem, không phải lò xo.
- **Viên cầu đầu dò nhiệt** (c8, c10): hạt gốm trắng có nắp kim loại, đặt đúng trên đỉnh lò xo, có que ép
  xuống chạm mặt trong đáy nồi (đáy nồi trong nằm ở y = 60 mm).
- **Hai dây mảnh từ viên cầu** (c12, c32): hai sợi **tròn**, đường kính ≥ 5 mm, chạy từ viên cầu xuống bo mạch.
  **Đường dây phải nằm hoàn toàn sau mặt phẳng cưa (z < 0)**: dây nằm trong mặt phẳng cưa sẽ bị `section()`
  cắt dọc theo chiều dài, chỉ còn lại một mảng vỏ, và người xem thấy một **dải đỏ dẹt** thay vì dây
  (đây chính là lỗi đã bị nêu). Dây phải có vỏ bọc ngoài màu xanh lá để tách với bo mạch xanh, và trên
  dây có **dải sáng chạy dọc** (fx `flow`) là hiệu ứng của câu c32.
- **Con chip** (c13): dùng `chip()` của `rig/parts.js` — thân đen, chân bạc hai bên, có chân. Không được
  là một hộp xám trơn. Bo mạch dùng `pcb()` của rig.
- **Nồi trong** (c15): phải có thành nhôm và độ dày thật, không phải một vỏ mỏng.

### 2.2 Nhiệt kế thủy ngữ (`nhiet-ke.js`)

Nhiệt kế là **một vật đặt trong nồi**, không phải một lớp số nổi trên mặt nước. Phải có: **ống thủy
tinh**, **cột thủy ngân đỏ** bên trong khoang ống, **bầu thủy ngân tròn** ở đáy, và **thang số 0–120**
(vạch 100 đậm hơn, chữ "SÔI").

**Cách nó đang dựng (đã qua bảy vòng chấm — đừng làm ngược lại):**

- Ống thủy tinh là **một vỏ rỗng dựng bằng `LatheGeometry`** — vỏ ngoài đi lên từ đáy bầu, vòng miệng
  ống, rồi quay ngược xuống vỏ trong và đáy đóng lại. Vì là **một đường viền liền** nên không có mặt
  cắt nào cắt qua nhau và không có vết seam trên khối đỏ. Đừng dựng ống bằng vài hình trụ chồng nhau:
  đó là lỗi của vòng 7 (bầu đỏ lổm bổm, chân đế xám lọt ra như mảnh vỡ rời).
- **Cột thủy ngân và bầu là CÙNG một khối xoay** (`mercuryGeo()`), cùng đỏ `#f04462` của kênh. Cột có
  **nắp meniscus** ở đỉnh: mặt trên của nắp mới chạm vạch, tâm nắp thấp hơn nửa bán kính.
- Ống có **nửa trước và nửa sau riêng**: nửa sau ở lớp vật thể (dựng đường viền mực quanh cột), nửa
  trước ở lớp fx với opacity rất nhỏ, cộng hai vệt sáng sát mép kính để đọc ra là thủy tinh.
- **"SÔI" là một thẻ kem** (`#fff0d8`) **viền mực** (`#171a2b`) **chữ đỏ đậm** (`#f04462`), nằm ngang
  hàng vạch 100, giữa vạch và số "100", không đè lên số. Chữ đỏ trần trên nền tối đọc ra như chữ vẽ
  thêm lên thang, không phải nhãn của vật.
- **Thang số nằm trên một dải thang tối đứng cạnh ống** (theo LOOK c31), không in lên thân ống.
  Dải tối phía sau ống là chỗ cột thủy ngân đứng ra. **Số "100" in trên dải nằm ở mép phải** (`w*.96`).
  Ba nhãn trong `src/film.js` neo vào đúng chỗ này và **đừng dời tấm thang**: "NHIỆT KẾ" ở
  `[.0609, .1520]` (ngang vạch 100), còn "TRĂM ĐỘ"/"100 °C" ở `[.1148, .1745]` (bên phải dải, ở cao độ
  cột lúc sôi). Dải thang cao `L = .230`, gốc ở `y = -.030`, nên vạch 100 nằm ở `y ≈ .1507`.
- `setTemp(độ)` dựng lại hình cột theo độ; `g.top` và `g.tubeX` là hai neo mà `set.js` dùng.

**Góp ý chưa sửa (không chặn):** cả vật vẫn có thể đọc như một bảng số treo tường có que đo dán
bên. Nếu bước 6 muốn xử lý thì xử ở **cảnh** (cách máy quay vào), không sửa lại hình vật — hình vật
đã qua bảy vòng chấm.


### 2.3 Hạt gạo (`gao.js`)

Gạo phải là **hạt có khối** (hình trụ bầu dục ba chiều), không phải các bầu dẹt vẽ trên một mặt phẳng. Ở cận
cảnh (c20–c23), mặt cắt của lớp gạo cho thấy **nửa hạt** thật, có bóng; một hạt riêng lẻ được kéo ra
siêu cận để thấy nước bị hút vào (c22). Lớp gạo phải có bề mặt gồ ghề, không phải một tấm màu phẳng.

**Điều kiện hình dạng (bổ sung sau vòng 7 — đừng làm ngược lại):**

1. **Hai đầu hạt không nhọn.** Một hạt nhọn hai đầu, có một gân dọc ở giữa mặt và các vệt sọc ngang là
   **lá**, không phải hạt gạo. Hạt phải thu dần đều về hai đầu và mũi **khum tròn** — vòng 9 siết
   thêm: hai đầu **bo tròn rồi cắt vát nhẹ** (không nhọn, không nhụng), thân thì **mập**.
2. **Không có gân nổi chạy dọc ở giữa mặt.** Khe nứt dọc của hạt nằm ở **bụng** và phải **khắc vào**
   (lõm xuống), không nhô lên.
3. **Vân vỏ trấu chạy dọc, đứt thành từng đoạn.** Vân cong chậm quanh thân đọc ra là **vân gỗ**.
4. **Hạt phải nằm sát bàn**, mỗi hạt một vệt bóng riêng chạm mặt bàn. Hạt đứng bằng đầu, không chạm
   bàn, đọc ra là một hình phẳng có viền.
5. **Ảnh ba phía của vật phải có một hạt bị cưa**, lộ lớp tinh bột trắng bên trong. Đây là dấu hiệu
   không nhầm lẫn được của hạt gạo; ba hạt nguyên thì người xem chưa từng thấy hạt gạo vẫn có thể
   gọi nhầm là lá khô.
6. **Tiết diện gần tròn, dày khoảng 1/3 chiều dài** (`W ≈ H`, `H ≈ L/3`). Một hạt dẹt như cái
   **bánh phồng / bánh gạo giòn** là sai dáng; xem `GRAIN` trong `gao.js`.
7. **Bóng tiếp xúc phải dính sát chân hạt** ở cả ba góc máy: dưới mỗi hạt có một vệt bóng mềm
   riêng (lớp fx), không phải bóng chung của cả cụm.
8. **Ba hạt không cắt vào nhau.** Hai hạt vỏ trấu nằm chồng nhau phải có bóng tiếp xúc của hạt trên
   đè lên hạt dưới, nếu không sẽ đọc ra là hai mảnh phẳng cắt vào nhau.


### 2.4 Lớp nước trong nồi (`nuoc.js`)

Mặt nước phải có **gợn sóng** và phản chiếu ánh sáng, không phải một dải xanh phẳng. Khi sôi: bong bóng nổi
ở đáy, hơi bay lên. Mực nước phải hạ được theo lệnh của cảnh (c42 nồi bên phải cạn, c43 nồi bên trái còn
đầy).

### 2.5 Hai nồi thí nghiệm (c40–c43)

Hai nồi phải là **hai vật riêng biệt**, giống nhau về hình dạng, khác nhau ở mực nước; nhiệt kế cắm trong nồi
thứ hai. Nồi bên phải trên màn hình là nồi **có nhiệt kế**; nồi bên trái là nồi đầy nước.

## 3. Ghi chú của đạo diễn cho bước 6 (dựng cảnh)

Hai lỗi này không thuộc vật dựng mà thuộc phim, để bước 6 xử lý:

1. **Câu c42 phải thấy nồi đã cạn.** Lời kể "Nồi bên phải cạn nước trước, nhiệt độ nhảy lên, đèn chuyển
   sang giữ ấm" chỉ đúng khi hình đã cho thấy nước cạn và cột thủy ngân vượt vạch 100. Hình hiện tại chụp
   khung hình ở **đầu** câu, lúc nước vẫn còn gần đầy, và đèn hổ phách chưa sáng. Sửa: mực nước của nồi bên
   phải phải xuống mức cạn **trước khi** câu bắt đầu, cột thủy ngân vượt 100, và đèn trên thân nồi ở
   trạng thái hổ phách — rồi câu c43 đối chiếu lại với nồi bên trái vẫn đang sôi.
2. **Câu c24 (nhiệt độ bị ghim ở vạch sôi)** và c30 (nhảy vọt lên trên 100) phải đọc được bằng chính cái cột
   thủy ngân đó: c24 cột đứng ngang vạch 100, c30 cột vọt lên trên vạch 100.
3. **Câu c45 ("Nó biết nước đã cạn") phải thấy một cái nồi rỗng.** Ở hình hiện tại, lớp cơm vẫn nằm trong
   nồi và đáy nồi bị lớp cơm che, nên người xem không thấy nồi đã cạn — chỉ thấy một vỏ nồi đầy màu nâu.
   Khi c45: **bỏ lớp cơm khỏi mặt cắt**, để lộ đáy nồi trơn khô, chỉ còn **vệt nước** đánh dấu mực nước
   cũ. Cùng một ý đó ở c28–c30: lớp nước phải **rút xuống hẳn** rồi biến mất, và cột thủy ngân vọt lên
   trên vạch 100 — không được để nước còn lơ lửng.

## 4. Ánh sáng và hiệu ứng

- **N1 · bếp buổi sáng**: đèn chính ấm xiên qua lỗ cửa sổ (`wallWithHole`, `keyLight`), in bóng rõ trên bàn
  và tường; một vệt sáng nhỏ (`pool`) đặt đúng chỗ đang kể; ánh sáng môi trường xanh nhạt cho bóng tối.
- **N2 · nồi cơm điện bị cưa**: ánh sáng vào từ phía máy quay (phía +z), đủ để mâm nhiệt, lò xo, viên cầu,
  dây điện trở đều có bóng đổ và đường viền rõ. Cảnh cưa ngang phải **có bóng**, không phải vật thể phẳng
  dán.
- **N3 · đáy nồi cơm đời đầu**: ánh sáng xiên để thanh lưỡng kim và hai tiếp điểm có bóng riêng.
- **Dòng hạt** (`flow`): dùng cho nước sôi, hơi nước, dải sáng trên hai dây. Hạt phải chạy **theo một đường
  dẫn có hình**, không phải hạt rơi rải rác.

## 5. Những việc đã sửa xong (đạo diễn tự làm, đừng làm lại)

Trước khi bước 5 chạy, đạo diễn đã sửa trong mã những lỗi hình khối mà vòng chấm
hình (bước 3) đã nêu. **Bước 5 phải nhìn mã hiện tại trước khi sửa**, đừng ghi đè
những sửa đó:

| Tệp | Đã sửa |
|---|---|
| `src/props/noi-cat-ngang.js` | hai dây nằm **sau mặt phẳng cưa (z < 0)** và đường kính 5 mm → đọc ra là sợi dây tròn, không phải dải đỏ dẹt; lò xo to hơn (r 14 mm, dây 2,4 mm) → thấy từng vòng; viên cầu nhỏ lại để lò xo lộ ra quanh nó; hai dây là hai đoạn thẳng |
| `src/set.js` | dải sáng tín hiệu chạy đúng đường hai dây; thêm **đèn trong nồi** (mặt cưa của nước và gạo có bóng, không phải hai mảng màu phẳng); thêm **dòng hạt nước chạy vào hạt gạo** ở câu c22 |
| `src/props/nhiet-ke.js` | tấm thang số có **khung xám xanh** → thang số là một vật, không phải lớp số lơ lửng |
| `src/props/gao.js` | vân mặt cắt vẽ hạt **đúng cỡ thật 7 mm** (trước vẽ 2–3 mm nên đọc ra là hạt bầu dẹt); tờ vân của lớp cơm khô đúng tỉ lệ theo chiều cao lớp; núm tinh bột trong hạt bị cưa bỏ viền mực (trước đọc ra là sỏi trắng) |
| `src/film.js` | câu c42: nồi bên phải **đã cạn ngay từ đầu câu** và đèn hổ phách sáng; câu c45: **nồi trống**, lộ đáy nồi và vệt nước, bỏ lớp cơm che; nhãn "ĐÁY NỒI" chỉ vào đáy nồi; c21–c22: máy quay nghiêng xuống nhìn mặt cơm thay vì nhìn thẳng vào mặt cưa |

## 6. Danh mục phải khớp

Sau khi dựng xong, chạy `props_catalog.py <tập> --write-index` rồi
`LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/tools/propcheck.mjs <tập> --out <tập>/out/scratch/props`
để tự nhìn trước ảnh ba phía của từng vật, rồi chấm bằng
`sh channels/tram-nghi-nhieu/tools/review.sh <tập> props`.

## 7. Vòng chấm props số 1 (10/11/2026): đã sửa gì

Vòng chấm props đầu tiên trả về 6 ĐẠT, 4 phải sửa. Bốn mục đó đã được sửa trong
mã (mỗi mục một người sửa riêng), đừng sửa ngược lại:

| Tệp | Người chấm thấy | Đã sửa |
|---|---|---|
| `src/props/gao.js` | hạt gạo đọc ra là "khối trắng dẹp", không có rãnh dọc, không có độ dày | hạt dựng bằng lưới vòng kín: thân thuôn 3:1, hai đầu nhọn, bụng có rãnh khía; vỏ trấu có vân và bảng sáng dốc riêng; `gachGaoCat()` và `lopGao()` dựng lại theo cùng hình hạt; `PROP.view` dựng **một nhóm hạt rơi trên mặt bàn** (một hạt ngửa bụng lên để thấy nếp, một hạt tựa nghiêng để thấy bụng cong, hai hạt nhỏ lệch quanh) |
| `src/props/noi-cat-ngang.js` | đọc ra là "hộp kem dạng bát tưới", không có nắp vòm, nồi trong, bảng công tắc, dây điện | dựng lại đúng vỏ nồi cơm điện (thân + nắp vòm + núm + lỗ thoát hơi + tay cầm + bảng công tắc + chân + dây điện có phích) rồi cưa ngang cả vỏ trên **một** mặt phẳng z = 0; mâm nhiệt có vành đứng, dây điện trở xoắn sát vành, mặt trong nồi trong dùng vật liệu tối (không cháy trắng) |
| `src/props/noi-cu-cat-ngang.js` | mặt trong vỏ cháy trắng, cơ lưỡng kim trôi lơ lửng, vỏ khác hẳn vỏ vòm của `noi-com-doi-dau.js` | thân dựng theo vỏ vòm của `noi-com-doi-dau.js` (nắp vòm có núm, vạng sơn ôm thân, nút bấm hông), có lòng vỏ tối, đáy lòng vỏ là mặt đáy thật có bóng đỡ cơ lưỡng kim; thêm mâm nhiệt + nồi trong + dây điện trừ ép dưới mâm |
| `src/props/nuoc.js` | đọc ra là "khay thủy tinh rỗng", không có mặt nước, không có meniscus | dựng lại thành khối nước thật: mặt nước phẳng ngang, mép meniscus cong lên ở chỗ nước chạm thành, thân nước bán trong suốt, mặt cắt z = 0 có sắc độ; thêm đoạn thành nồi nhôm (cờ `pot`) — **phim không bật cờ này** vì trong nồi đã có thành sẵn |
| `src/props/cau-do-dien-tro.js` | hai que đo là dải dẹt mọc ra từ núm xoay, che núm | que đo là tay cầm tròn **cắm vào hai lỗ ở đáy vỏ**, đầu kim chỉ nhô lên tới miệng lỗ; màn hình trong ảnh ba phía hiện số `1.0 kΩ` thay vì gạch ngang |

Những lỗi CHẶN còn lại sau vòng 1: không. Vòng 2 (11/11/2026) trả về **10 ĐẠT,
0 MỞ, 0 phải sửa** — bước 5 (dựng vật) đã xong.

Những điểm người chấm góp ý mà **chưa sửa** (không chặn, để vòng sau hoặc bước 6 xử lý): bát đong nước đọc là bát
thủy tinh trong khi dựng là bát nhựa có vạch (người chấm đoán theo tên mù —
bát có vạch chia và nước là bát đong lượng, đúng như cảnh c47 cần); que đo của máy đo điện trở chưa có dây rủ;
vỏ nồi cơm điện và nồi cơm đời đầu chỉ chiếm ~1/5 khung ảnh ba phía vì dây điện kéo tới ổ cắm làm khung rộng
ra (góc máy của công cụ ba phía là góc cố định, không sửa được từ tệp vật); hạt gạo trong ảnh ba phía còn
tương phản thấp với nền bàn và một hạt đứng riêng chưa có bóng chạm bàn; bóng đỏ ở đáy nhiệt kế còn méo;
túi gạo còn cứng như hộp carton; hạt gạo rơi quanh túi còn là vòng viền rỗng.

Những điều này **không chặn bước 5**, nhưng chúng là những chỗ phim sẽ bị soi ở bước 6 (và ở vòng chấm
hình sau này): bát đong nước và túi gạo lên hình ở c47, nhiệt kế ở c19/c27/c42/c43, hạt gạo ở c20–c23,
máy đo điện trở ở c11, hai nồi cơm ở c1–c6 và c36.

## 8. Vòng chấm props số 7 (11/11/2026) và những gì đã sửa ở vòng 8

Bảy vòng chấm liên tiếp (mỗi vòng chỉ lại những mục đã đổi) đưa bảng vật về
**8 ĐẠT · 0 MỞ · 2 phải sửa**. Hai mục CHẶN còn lại, và cách đã sửa:

| Tệp | Người chấm thấy | Đã sửa ở vòng 8 |
|---|---|---|
| `src/props/gao.js` | **dung-vat**: cả 5 hạt là "những lá/lens nhọn sắc ở cả hai đầu, có một đường gân chạy dọc giữa mặt và các vệt sọc ngang kiểu gỗ" — người xem gọi đúng là *"một đống lá khô rơi"*; **nguyen-ven**: hạt đứng riêng không có bóng chạm bàn, viền mực khép kín cả phía dưới nên trôi lơ lửng | đường viền thân hạt đổi từ siêu-elip nhọn (`PROF=1.7`) sang `prof(x)=(1-\|x\|^2.6)^0.60`: thân thu dần đều, mũi khum tròn, không có điểm nhọn; **bỏ gân nổi giữa bụng**, khe nứt dọc nay **khắc vào** (`CRACK`); vân vỏ trấu viết lại thành **sợi chạy dọc đứt đoạn** (không còn vân gỗ ngang) trên nền ngà vàng để hạt tách khỏi mặt bàn; bảng sáng riêng 5 bậc; `PROP.view` dựng lại: ba hạt **nằm sát bàn** xếp vuông góc với hướng đổ bóng (mỗi hạt một vệt bóng riêng chạm bàn), một hạt ngửa bụng lộ khe nứt, một hạt lăn nghiêng lộ độ dày; **thêm một hạt bị cưa** (mặt cắt lộ lớp tinh bột trắng) — đây là dấu hiệu không nhầm lẫn được của hạt gạo |
| `src/props/nhiet-ke.js` | **nguyen-ven**: bầu đỏ ở đáy là khối lổm bổm có vết seam màu nhạt chạy ngang, tràn đè lên chân đế xám của ống; chân đế xám lọt ra bên phải như một mảnh vỡ rời | bỏ hẳn chân đế xám lệch bên phải và hai thanh khung ống; thân thủy tinh dựng lại thành **một khối liền** bằng `LatheGeometry` (vỏ ngoài đi lên từ đáy bầu → vòng miệng ống → quay ngược xuống vỏ trong → đáy đóng) nên không còn mặt cắt cắt qua nhau, không còn vết seam; cột thủy ngân và bầu là **cùng một khối xoay** (một `LatheGeometry`), cùng đỏ `#f04462`; ống thủy tinh có **nửa trước (lớp fx) và nửa sau (lớp vật thể)** riêng, nên cột là một ống kính **bên trong** khoang ống chứ không phải sơn dán lên mặt phẳng |

Ghi chú cho người đọc mã `gao.js`: trường `faceTop`/`faceBot` trong `geo.userData` là **biên thật của mặt
cắt**, lấy từ chính lưới đã dựng — mọi núm tinh bột phải nằm trong đó. Có một lỗi đã sửa trong lúc
làm: `quadF(A[s], A[s+1], B[s], B + 0, B[s+1])` — `B` là **mảng** chỉ số nên `B + 0` thành chuỗi,
làm mặt cắt vỡ chỉ số và hiện ra thành mảng đen. Đúng phải là `quadF(A[s], A[s+1], B[s], B[s+1])`.

## 9. Vòng chấm props số 9 (11/11/2026) và những gì đã sửa ở vòng 10

Vòng 9 chấm lại hai mục đã đổi (`gao`, `nhiet-ke`) và trả về: **gao ĐẠT** (chỉ còn góp ý
không chặn), **nhiệt kế thỗng** — lỗi CHẶN `nguyen-ven`:

- Ở góc nhìn từ trên xuống, **toàn bộ tấm bảng và bầu đỏ ở đáy lơ lửng**, quanh bầu đỏ không có
  bóng tiếp xúc nào (vùng giấy đồng nhất), và ở góc ngang cũng không có bóng dưới chân tấm bảng.
- Phía sau tấm bảng có **mảng phẳng xám viền cứng, không có viền mực, trôi lơ lửng**, đọc ra như
  một mảnh giấy dán rời.

**Ba điều đã sửa ở vòng 10** (đừng làm ngược lại):

1. **Ống thủy tinh được nâng lên** (`TUBE_LIFT = .0065` trong `nhiet-ke.js`) để **đáy bầu thủy ngân
   trùng với đáy khung** (`-.037`). Trước đó bầu đỏ thấp hơn khung 6,5 mm, nên khi đặt vật xuống
   sàn thì **chỉ bầu đỏ chạm sàn còn tấm bảng thì bay lơ lửng** — đúng lỗi người chấm nêu.
2. **Vệt bóng tiếp xúc phải nằm sát sàn** (cao độ `-.0368`, sàn là đáy vật ở `-.037`), không nằm
   lơ lửng vài milimét. Vệt là một tờ **nền trắng** dùng phép **nhân** (`MultiplyBlending`), không
   có viền mực — bóng không được có viền, viền làm nó thành mảnh giấy dán.
3. **Thêm chân đế kim loại** dưới đáy khung (`rbox(W*.46, .006, .026, .002)`, có vân thép riêng):
   một tấm thang đo đứng một mình không có gì đỡ thì đọc ra là một tấm bảng bay; chân đế ấn xuống
   sàn, nối vật với mặt bàn và có chất liệu riêng nên không đọc ra là một mảng phẳng dán thêm.

Kèm theo, **thẻ "SÔI" được dựng lại**: thẻ nằm **DỌC** (S/Ô/I xếp chồng, chữ ~69 px, thẻ 96×242 px),
vạch đậm kết thúc ở `w*.44` để **khe giữa mép vạch và mép số "100" rộng ra**. Thẻ nằm ngang ở khe cũ
(~70 px) thì cả thẻ đọc ra là một cục đỏ vỡ nát, không đọc ra chữ.

**Hai quy tắc đã học được từ những vòng này — đọc trước khi sửa vật:**

- **Lớp fx của rig không vẽ vật liệu `depthWrite: false`.** Ở `rig/render.js`, lớp fx được vẽ
  *sau* bước viền mực vào `rtInk`; một vật liệu không ghi độ sâu thì **không hề được vẽ ra** (đã
  thử: vệt bóng biến mất sạch). Muốn một vệt bóng mềm trên mặt sàn thì phải dùng vật liệu
  **đục** có texture nền trắng và phép **nhân**.
- **Công cụ `propcheck` ép mọi mesh của vật phải đổ bóng** (`obj.traverse(o => { o.castShadow =
  true })` trong `propcheck/main.js`). Nghĩa là **vật không tự tắt được bóng đổ của mình**: mảng xám
  viền cứng nằm sau nhiệt kế là **bóng đổ của chính tấm bảng** trên sàn xưởng quay, không phải
  một mảnh vật thể lạ. Muốn nó không đọc ra như một mảnh giấy dán thì phải có **mặt thật** để bóng
  rơi vào (chân đế, tấm chắn), chứ không sửa được bằng cách tắt `castShadow` trong tệp vật.

Ghi chú cho bước sau (dựng hình): `gao.js` vẽ lớp cơm bằng `riceGrainTex()` và mặt cắt bằng
`riceCutTex()` (cùng hình hạt `riceShape()`), nên đừng sửa lại hình hạt ở `gachGao()` mà quên
tờ vân — hai nơi phải khớp nhau.

### 9.1 Vòng 10 (11/11/2026): nhiệt kế ĐẠT, hạt gạo thành MỞ

Vòng 10 chấm lại hai mục: **nhiệt kế thủy ngữ ĐẠT** (cả ba tiêu chí CHẶN đều ĐẠT — vật
đã cắm xuống bàn ở cả ba góc máy, có bóng tiếp xúc sát chân, thẻ "SÔI" đọc được ba chữ),
**hạt gạo MỞ** — lỗi CHẶN `dung-vat`:

> Cả ba góc máy, ba vật đọc ra là **ba lát gỗ dẹt bo tròn nằm sàn** (tên mù: "ba đĩa/lát
> gỗ dẹt, coaster gỗ"): thân là elip **lập lòng đối xứng hai đầu**, mặt trên có vân sợi
> **chạy song song đều tăm tắp như vân gỗ mộc**, và chiếc úp lộ một mặt trắng lấm tấm
> như lõi bánh.

**Đã sửa ở vòng 11** (đừng làm ngược lại):

1. **Hạt không còn đối xứng.** `prof()` nay có hai đầu khác nhau: đầu rễ (x = −1) nhọn dần
   còn ~10% bề rộng (`PROF_TIP_L`), đầu mũi (x = +1) bè còn ~42% (`PROF_TIP_R`). Hạt gạo
   không có hai đầu giống nhau; hạt đối xứng đọc ra là một lát dẹt. Cả hai đầu vẫn **bo
   tròn**, không có mũi nhọn như lá (đó là lỗi của vòng 8).
2. **Thân dài:rộng 3,5:1** (`GRAIN = 7,6 × 2,17 × 2,04 mm`), tiết diện vẫn gần tròn.
3. **Nếp lõm ở sống lưng** (`CRACK_BACK`): hạt nằm sấp bụng xuống bàn nên **lưng quay lên** —
   đây là mặt người xem thấy ở góc từ trên xuống, và nếp lõm chạy dọc là dấu hiệu nhận ra hạt
   gạo. Nếp **lõm vào**, không nổi lên (gân nổi ở giữa mặt là dấu hiệu của lá — lỗi vòng 8).
4. **Vân vỏ trấu chỉ ở hai đầu.** Thân hạt là **kem trắng bán trong**; vỏ trấu là một lớp
   mỏng bọc hai đầu, vẽ bằng sợi **ngắn, đứt quãng, dày mỏng không đều, nghiêng nhẹ**.
   Sợi dài đều tăm tắp chạy song song là **vân gỗ**, đọc ra là lát gỗ dẹt.
5. **Bảng sáng của hạt ấm hơn** (`GRAIN_GRAD`): các bậc thấp nâng lên, để mặt sườn giữ
   tông kem–nâu trấu thay vì thành một **dải xám lạnh** dán bên hông hạt (môi trường của
   xưởng quay có ánh sáng môi trường lạnh, nên albedo tối dễ thành xám lạnh).

**Kết quả vòng 11 (11/11/2026): `gao` ĐẠT.** Bảng vật chốt ở **10 ĐẠT · 0 MỞ · 0 phải sửa** —
bước 5 (dựng vật) xong.

Góp ý còn lại của vòng 11 (KHÔNG chặn, để bước dựng hình xử nếu thấy cần): dải xám lạnh ở
mặt sườn hạt vẫn lạch tông; viền mực mép dưới mặt ruột hạt bị cưa đứt thành đoạn; mặt hạt
nhẵn bóng như nhựa, thiếu chất xơ. Lưu ý khi sửa tiếp: **đừng sửa `gao.js` ở bước dựng hình**
— sửa là mã vật đổi, bảng vật phải chấm lại (vòng props) trước khi bước hình coi là xong.

