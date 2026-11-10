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

| Mã tệp | Tên vật | Câu kể | Cự ly | Trạng thái động |
|---|---|---|---|---|
| `noi-com-dien.js` | nồi cơm điện | c1–c6, c24–c27, c33–c35 | trung → cận | đèn trên thân đổi đỏ → hổ phách; vỏ bật/tắt |
| `noi-cat-ngang.js` | nồi cơm điện bị cưa ngang | c7–c23, c28–c35 | cận → siêu cận | dây điện trở nóng đỏ, mâm nhiệt đổi màu, dòng hạt |
| `noi-com-doi-dau.js` | nồi cơm đời đầu | c36 | trung | chỉ hiện ở c36 |
| `noi-cu-cat-ngang.js` | nồi cơm đời đầu bị cưa ngang | c37–c39 | cận | thanh lưỡng kim cong, hai tiếp điểm tách |
| `cau-do-dien-tro.js` | máy đo điện trở | c11 | siêu cận | dải sáng chạy trên dây, số đo nhảy |
| `nhiet-ke.js` | nhiệt kế thủy ngữ | c19, c27, c42, c43 | cận | cột thủy ngân đổi chiều cao, vạch số |
| `nuoc.js` | lớp nước trong nồi | c17–c24, c40–c43 | cận | mực nước hạ, sôi lăn tăn, hơi bay |
| `gao.js` | hạt gạo | c20–c23 | siêu cận | hạt hút nước (trưng ra), nở ra |
| `bat-dong-nuoc.js` | bát đong nước | c47 | trung | nước sôi nhẹ |
| `tui-gao.js` | túi gạo | c47 | trung | tĩnh |

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

Nhiệt kế là **một vật đặt trong nồi**, không phải một lớp số nổi trên mặt nước. Phải có: thân nhựa trắng
(thành), **cột thủy ngân đỏ** bên trong, **bóng thủy ngân** ở đáy, và **thang số in trên thân** (vạch 0–120,
vạch 100 đậm hơn, chữ "SÔI"). Thang số phải nằm **trên mặt thân**, không được là một bảng trắng trôi
độc lập cạnh vật. Khi nhiệt độ nhảy lên trên 100 °C, cột thủy ngân phải vượt vạch 100.

### 2.3 Hạt gạo (`gao.js`)

Gạo phải là **hạt có khối** (hình trụ bầu dục ba chiều), không phải các bầu dẹt vẽ trên một mặt phẳng. Ở cận
cảnh (c20–c23), mặt cắt của lớp gạo cho thấy **nửa hạt** thật, có bóng; một hạt riêng lẻ được kéo ra
siêu cận để thấy nước bị hút vào (c22). Lớp gạo phải có bề mặt gồ ghề, không phải một tấm màu phẳng.

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
