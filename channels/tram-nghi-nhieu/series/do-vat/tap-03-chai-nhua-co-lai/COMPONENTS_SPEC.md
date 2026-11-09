# COMPONENTS_SPEC — Vì sao chai nhựa bị co lại khi rót nước sôi vào?

Bóc tách linh kiện 3D của tập. Mỗi dòng là **một hàm dựng** trong `src/props.js`, hoặc một
bộ dựng cảnh trong `src/set.js`, kèm vai trò trong phim. Soát lại từng câu trong
`voice/lines.json` và từng nhát trong `LOOK.md`: không một danh từ nào của lời kể mà không có
vật mang nó.

**Quy ước:** một đơn vị = **một mét**. Mặt bàn ở `y = 0`, máy quay luôn nhìn từ phía `+z`.
Mọi vật dựng bằng `toon()` của `rig/kit.js` (viền mực do `rig/render.js` vẽ, không tự vẽ lại).

**Ba nơi chốn:** N1 bàn bếp · N2 trong thành chai (phóng to, cưa ngang) · N3 trong bụng chai.

## Nhóm 1 · Props (đạo cụ tương tác)

| Tên linh kiện | Hàm dựng | Vai trò · nhát xuất hiện | Cự ly | Trạng thái động |
|---|---|---|---|---|
| Chai A · PET không nắp, thân gân, có nhãn | `createBottle({ cap: false, label: true })` | chai thí nghiệm 1: rót nước sôi vào (c1–c2), rót lại (c17–c19), co và nhăn (c28–c34), thí nghiệm "chỉ còn một việc: co lại" (c43–c47) | cận → trung | `setState({shrink, wrinkle})` co và nhăn theo thời gian: co thì thân ngắn đi, đáy ép thành đáy nhăn năm cánh, nhãn nhăn theo thân; `setHot(k)` bật vệt nhiệt trên vai |
| Chai B · PET có nắp xanh, có nhãn | `createBottle({ cap: true, label: true, morph: 1 })` | chai thí nghiệm 2: tay vặn nắp (c37), phồng lên (c39–c40), để nguội thì méo vào (c49–c51) | cận → trung | `setState({bulge, suck})`: phồng thì gân bị kéo căng nên mặt chai mịn, bụng rộng nhất và đáy bị hút nhỏ; hút vào thì eo lõm hẳn hơn cả vai lẫn đáy, một bên méo vào sâu hơn, vành miệng chai méo theo; `setCap(on)` bật nắp khi tay vặn; nắp là vật thật, có ren |
| Chai C · PET mới, không nắp | `createBottle({ cap: false, label: true })` | chai mới cho lời khuyên: nhận nước đã nguội rồi được vặn nắp (c62–c63) | cận | chỉ xuất hiện ở cuối tập; **luôn thẳng**, không co, không nhăn |
| Nắp chai rời có ren dọc | `createCap()` | nắp nằm sấp trên mặt bàn (c59), được tay cầm lên vặn vào miệng chai C (c63) | cận | nằm nghiêng trên bàn, rồi đứng lên và xoay khi vặn |
| Mẩu preform thí nghiệm · dày, cổ ren, chưa nong | `createPreform()` | "thổi từ một mẩu nhựa nhỏ xíu" (c8–c9): nong thành hình chai rồi bàn tay cầm đi | siêu cận | `setInflate(k)` nong dần từ mẩu dày thành thân chai. Mẩu có đáy phẳng, thân vách dày, và **cổ ren nhỏ ở trên có vòng xoắn ốc, miệng mở thấy thành trong** — thiếu mấy thứ này thì nó đọc ra là một cây nến trụ. Màu **xanh nhạt đục** (`setBaseColor('#8ecadd')`): PET thật là nhựa đặc, không trong suốt — nhựa trong suốt trong tia nắng cửa sổ chói thành một mảng trắng, người xem không đọc ra đó là mẩu nhựa |
| Mẩu preform chuẩn · dày, cổ ren, chưa nong | `createPreform()` | thước đo "hình cũ" của vật liệu, đứng cạnh chai A đang co (c29, c52) | trung | **không bao giờ nong** — đó là mốc tham chiếu |
| Nhiệt kế bếp có đầu dò, que cắm trong nước | `createThermometer()` | hai con số của phim: một trăm độ (c18) và bảy mươi độ (c23, c55); **đứng trong cốc nước sôi** suốt tập (đầu dò nhúng trong nước), cuối tập được đặt xuống bàn cạnh cốc (c62) | cận | `setLevel(k)` cột rơi dâng rồi hạ; `setNumbers(on)` bật/tắt hai con số **khắc ngay trên mặt đồng hồ** |
| Đồng hồ áp suất mặt tròn, kim đỏ, không có số | `createGauge({ R: .020 })` — **vặn vào nắp chai B** | áp suất bên trong chai (c41–c42, c51) | cận | `setLevel(k)` kim chạy lên rồi rơi xuống dưới vạch; **không in số nào**; đáy là đai ốc và que ren, **không có chân đế** |
| Bàn tay người, ngón ba đốt | `createHand()` (bàn tay của rig thu lại còn 60 %, vì bàn tay gốc dài 41 cm — quá dài để cầm nắp chai hay quai cốc) | rót nước (c1–c2, c17–c19, c60), hai ngón tay cạnh mẩu preform (c8–c9), vặn nắp (c37, c63), cầm chai A lên xoay (c58) | cận | `pose(curl, spread)`; vị trí theo nhịp câu, tay chỉ xuất hiện khi đang làm việc |
| Cốc có mặt nước (thành mở) | `src/props.js` → `createMug()` | cốc nước sôi **đứng trên bàn từ đầu tập** để nguội (nhiệt kế cắm trong đó), cuối tập được tay cầm lên rót ngược vào chai C (c63) | trung → cận | có mặt nước; cầm lên, nghiêng rót (miệng cốc rơi đúng vào miệng chai C), rồi đặt xuống **phía sau bên trái chai C** (không đi ngang che chai C). Mặt nước khi cốc nghiêng **bám sát miệng cốc** (máy nhìn cốc ở góc ~57°, mặt nước lùi sâu hơn ~3,5 cm là biến mất khỏi khung); khi cốc đứng thì mực nước hạ xuống trong cốc |
| Ấm siêu tốc | `rig/sets.js` → `kettle('#4f86a8')` | rót nước sôi vào chai A (c1, c17), dừng giữa chừng (c60) | trung → toàn cảnh | vòi nghiêng khi rót; **đầu vòi là điểm dòng nước bắt đầu**; đầu vòi cao hơn miệng chai một gang tay để dòng nước thấy được |
| Khăn treo ở cửa bếp | `rig/sets.js` → `towel()` | nền của N1 | hậu cảnh | vải đung đưa nhẹ |

## Nhóm 2 · Internal Parts (ruột & cơ chế vi mô)

| Tên linh kiện | Hàm dựng | Vai trò · nhát xuất hiện | Cự ly | Trạng thái động |
|---|---|---|---|---|
| Móc xích phân tử: một bộ theo vòng quanh thân, một bộ theo chiều dọc | `createChains({ R: .256, N: 40, axialR: .250, … })` | "những móc xích dài, bị kéo căng, ôm lấy hình dạng của chai" (c13–c16), trượt khi nóng (c25–c27), co theo hai hướng (c32–c33), trượt về hình cũ (c54, c56) | siêu cận, phóng to | `setRelax(k)` móc xích chùng về đường cong cũ; `update(t)` rung nhẹ. Bộ dọc thân nằm **trong lớp nhựa** (`axialR`), không ở trục chai |
| Miếng nhựa thành chai cong, cắt ngang, có bề dày | `createWallSlice({ R: .27, th: .0108, h: .18, opacity: .30 })` | mặt cắt thành chai ở N2 (c10–c16, c21, c25–c27, c32–c33, c54, c56) | siêu cận, phóng to | `setStretch(quanh, doc)` vòng quanh thân giãn nhiều hơn chiều dọc, thành mỏng đi; lớp nhựa **trong suốt** để thấy móc xích bên trong |
| Mặt nước gợn sóng trong chai | `createWaterSurface({ R: .0295, y: .012 })` | "nhiệt lấy từ nước" (c20, c36) | trung | `update(t)` gợn sóng, bọt khí nhỏ bốc lên |
| Hơi nước: búp trắng mềm bốc lên | `createSteam({ n: 46, size: .006 })` ở miệng chai A · `createSteam({ n: 26, size: .005 })` ở miệng chai B · `createSteam()` (10 búp to) là bản trong danh mục vật | miệng chai A (c1–c2, c19, c22, c43, c47, c57), miệng chai B (c34–c37, lúc miệng chai B còn hở), bụng chai (c36, c49) | trung → cận | `update(t, power)` và `setSpread(k)`: **power là độ đặc**, **spread là độ rộng của cột** — cột dày lúc rót, **cột mỏng** ở c22, chỉ còn **làn mỏng** ở c43 (dấu hiệu khí thoát ra được). Búp mềm ở mép (alpha loe theo góc nhìn) để đọc ra là hơi nước, không phải bong bóng |
| Mũi tên vàng áp lực | `createArrows({ n: 10, len: .022 })` — đầu là **tam giác dẹp nằm ngang**, có hai vây đuôi | khí nóng đẩy thành ra (c37–c40 ở N1), khí nguội hút vào (c49–c50 ở N3) | trung | `setPower(p, dir)` với `dir` +1 ra ngoài, −1 vào trong; `update(t)` nhịp ra |
| Vệt nhiệt cam trong lớp móc xích | `src/set.js` → `buildInsideWall` → `heat` | "nó chui vào tận lớp móc xích bên trong" (c21–c24) | trung | mảng sáng loang dần theo thời gian; là nguồn sáng dẫn của N2 |
| Vệt nhiệt cam ở mặt nước | `src/set.js` → `buildInsideBottle` → `heat` | "nhiệt lấy từ nước, chạy vào thành nhựa" (c20) | trung | loang lên từ mặt nước rồi mất đi khi nhiệt đã sang tầng N2 |
| Nắp chặn miệng chai (nhìn từ trong bụng chai ra) | `src/set.js` → `buildInsideBottle` → `lid` | "nắp vặn kín, không khí đó không ra được" (c38) | siêu cận | hiện lên từ lúc nắp vặn kín, ở ngay miệng chai |

## Nhóm 3 · Set & Environment (bối cảnh phòng)

| Tên linh kiện | Hàm dựng | Vai trò · nhát xuất hiện | Cự ly | Trạng thái động |
|---|---|---|---|---|
| Bàn bếp (mặt bàn, bếp, tủ, cửa sổ, cây) | `rig/sets.js` → `kitchen(scene, { time: 'morning', props: true })` | nơi chốn N1: mở đầu (c1–c9), rót và mốc nhiệt (c17–c24), chai co (c28–c34), khí bị giam (c35–c51), chốt và lời khuyên (c52–c63) | toàn cảnh → cận | `update(t)` vệt sáng cửa sổ dịch nhẹ, cây đung đưa |
| Đồng hồ treo tường (sau lưng, không đọc phút nào) | `rig/sets.js` → `clock()` | nền của N1 | hậu cảnh | quả lắc nhẹ |
| Trong thành chai (N2) | `src/set.js` → `buildInsideWall(scene)` | nơi chốn N2 | — | nền tối có viền tím; vệt nhiệt cam là nguồn sáng dẫn |
| Trong bụng chai (N3) | `src/set.js` → `buildInsideBottle(scene)` | nơi chốn N3 | — | nền xanh lạnh, vệt sáng từ miệng chai xuống mặt nước |

## Nhóm 4 · FX & Lighting (đèn & hiệu ứng sống)

| Tên linh kiện | Hàm dựng | Vai trò · nhát xuất hiện | Cự ly | Trạng thái động |
|---|---|---|---|---|
| Đèn chính in bóng qua lỗ tường | `rig/lights.js` → `keyLight(scene, {...})` | N1, N2, N3 | — | cố định theo bối cảnh |
| Nền sáng | `rig/lights.js` → `ambience(scene, {...})` | N1, N2, N3 | — | cố định |
| Vệt nhiệt cam (chất vô hình được dựng thành vật) | `glowMat('#ff7a2a', .9 ở mặt nước N3, 1.4 trong lớp móc xích N2)` | nhiệt ở mặt nước (N3) và trong lớp móc xích (N2) | trung | phình to dần theo thời gian |
| Dòng nước sôi (hạt mềm trên đường cong) | `rig/fx.js` → `flow(from, to, {...})` | rót vào chai A (c1, c17), ngắn lại giữa chừng (c60), rót nước đã nguội sang chai C (c63) | cận | `update(t, go)` — `go` = 1 là chảy hết, `go` < 1 là **ngắn lại trước khi chạm miệng chai** |

## Những thứ cố tình KHÔNG có

- **Đồng hồ áp suất không in số nào.** Phim không đọc một con số áp suất nào, nên mặt đồng
  hồ chỉ có vạch vô danh và một kim.
- **Chỉ hai con số trên màn hình: 100 °C và 70 °C**, in trên mặt nhiệt kế. Cả hai đều được
  lời kể đọc. Không con số nào khác được vẽ.
- **Không có thẻ chữ nào đứng một mình trên nền.** Mọi thẻ bám vào một vật đang làm việc.
- **Không có sơ đồ, không có biểu đồ cột, không có mũi tên vẽ lơ lửng.** Mọi thứ vô hình
  (nhiệt, áp suất, trí nhớ của vật liệu) đều được dựng thành vật thật trong khung.

## Rủi ro lắp ghép

- **Cùng một lớp vật liệu ở N2 và N3.** Lớp nhựa ở N2 là mặt cắt của thành chai (hai mặt,
  `DoubleSide`); ở N3 là thành nhìn từ trong (`BackSide`). Nếu không, sẽ thấy mặt vô hình ở
  một trong hai nơi.
- **Trục quay của nắp chai.** Nắp phải quay quanh trục dọc của miệng chai, không quay quanh
  tâm của nó; và tay phải bám theo nắp khi vặn.
- **Ba chai trên bàn phải giữ đúng khoảng cách** để một khung ngang thấy được (c52), nên
  chúng không được dịch chuyển trong phim — trừ chai A, được tay cầm lên ở c58 rồi đặt lại.
- **Vệt nhiệt trên vai chai A** phải nằm ở đúng chỗ nóng (quanh cổ), và phải mờ đi đúng
  lúc vật liệu đã nguội — nếu không, khung c61 mất bằng chứng.
- **Hơi nước ở c22 phải mỏng hơn hẳn lúc rót.** Cùng một vật nhưng hai độ đặc khác nhau là
  hai thông tin khác nhau: cột đặc là "đang rót", làn mỏng là "khí thoát ra được".
