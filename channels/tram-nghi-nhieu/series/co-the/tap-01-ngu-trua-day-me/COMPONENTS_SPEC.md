# COMPONENTS_SPEC — Vì sao ngủ trưa dậy lại mệt?

Bóc tách linh kiện 3D của tập, đối chiếu với `voice/lines.json` (52 câu) và `LOOK.md` (52 nhát). Mọi vật có thật
đều nằm ở `src/props/<mã>.js` (mỗi vật một tệp, `src/props.js` là file sinh tự động); bối cảnh và ánh sáng nằm ở
`src/set.js`; chuyển động theo thời gian nằm ở `src/film.js`.

Quy ước: **LOD** = cự ly máy thấy vật (`C` cận cảnh / `M` trung cảnh / `B` hậu cảnh). **Trạng thái** = `Tĩnh` /
`Động` (có gắn với câu nào trong `voice/lines.json`).

Ba nơi chốn: **N1** phòng ngủ buổi chiều (c1–c7, c9, c14–c26, c41–c44, c47–c48, c50, c52) · **N2** khối mô não trên
bàn tối (c8, c10–c13, c27, c45–c46, c51) · **N3** khe giữa hai tế bào (c28–c40, c49).

---

## Nhóm 1 — Props (đạo cụ, đồ đo, vật thật)

| Tên | Xuất hiện ở | LOD | Trạng thái | Hàm trong `src/props/` |
|---|---|---|---|---|
| **Chiếc giường nghỉ trưa** — khung gỗ, nệm, chăn, gối; nằm ở `(-2.30, 0, 1.60)` | c1, c4, c22, c50, c52 | B/M | Tĩnh | `giuongBuoiTrua({seed:11})` — `giuong-buoi-trua.js` |
| **Đồng hồ báo thức** — vỏ đỏ hai chuông, mặt trắng, kim, chân — đặt ở góc bàn gần giường (toạ độ cục bộ của bàn `(-.80, .50, -.50)`, xoay `.34`); khi reo có **hai vòng cung màu vàng bám đúng đỉnh mỗi chuông**, nở ra như sóng âm | c2, c6, c9, c21 + thấy trong mọi khung rộng của N1 | C/M/B | Động: kim chạy theo giờ (`setHour`), chuông rung ở c2 và c9 (`ring`) | `dongHoBaoThuc({color:PAL.red})` — `dong-ho-bao-thuc.js` |
| **Máy ghi giấc ngủ** — hộp máy, mặt giấy chạy ra, trục thời gian, đồng hồ nhỏ — đặt ở cuối bàn (`(.70, .50, -.43)`) | c5, c7, c18, c47 | C/M | Động: giấy luôn dài đủ 45 phút, đồ thị vẽ tới phút hiện tại (`setMinute(m)`), đồng hồ trên máy chạy theo giờ (`tick`) | `mayGhiGiacNgu()` — `may-ghi-giac-ngu.js` |
| **Bảng đo phản xạ** (bảng sau) — bảng gỗ nghiêng, lưới 16 đèn tròn, đồng hồ kim, nút đỏ, đèn xanh báo cảm nhận | c15–c20, c23, c24, c48 | C/M | Động: đèn lần lượt tắt/sáng theo phản xạ (`setLamps`), kim chùy/tụt (`setNeedle`), đèn xanh (`setGreen`) | `bangDoPhanXa({cols:4,rows:4})` — `bang-do-phan-xa.js` |
| **Bảng đo phản xạ thứ hai** (bảng trước) — bảng của người **không** uống cà phê: cùng một đạo cụ, đặt ở `(-.15, .50, -.35)` | c41 (đọc ở c41: kim vẫn tụt), và hiện trong khung rộng | C/M | Động: `measure2(.85, .95, 0)` ở c41 — kim đi thẳng, đèn vẫn tắt; các câu khác không bật | `bangDoPhanXa()` — dựng lần thứ hai trong `set.js` |
| **Tách cà phê** (tách trước) — có đĩa, mặt cà phê nâu, thân sứ | c3 (cầm lên rồi hạ xuống), c25, c41, c50 + mọi khung rộng | C/M/B | Tĩnh vị trí; cà phê trong tách không đổi | `tachCaPhe({color:'#e8dcc4', drink:'#4a2a12'})` — `tach-ca-phe.js` |
| **Tách cà phê thứ hai** (tách sau) — sứ màu xám nhạt, **rỗng** (không có cà phê): cà phê là thứ phân biệt hai người trong câu so sánh, nên tách không có cà phê mới đọc ra là "người không uống cà phê" | c41, c50 + mọi khung rộng | M/B | Tĩnh | `tachCaPhe({color:'#cfd6e6', drink:'#e6ecf5'})` — dựng lần thứ hai trong `set.js` |
| **Đồng hồ 24 giờ treo tường** — mặt tròn lớn, kim đỏ, chữ "BUỔI CHIỀU" in trên mặt | c42, c43 | C | Động: kim chạy theo giờ trong ngày (`setHour`) | `dongHo24Gio()` — `dong-ho-24-gio.js` |
| **Khối mô não** — quả trứng dẹt đáy, hẹp ở trán; vỏ có nếp cuộn lồi lên và rãnh tô sẵn tối trên da (cùng một hàm quyết định cả hình lẫn màu: chỗ nào nếp nhô lên thì chỗ đó là rãnh), rãnh giữa chia hai bán cầu, có tiểu não và thân não; hai bản **cùng hình** (cùng seed 3) để đọc ra là hai bản của cùng một não: bản trái `(-.80, -.29, 0)` và bản phải `(.80, -.29, 0)`, cùng xoay `ROT = 0.15` | c8, c10–c13, c27, c45–c46, c51 | C/M | Động: nếp thở theo sóng chậm (`wave(t,k)`, biên độ theo độ sâu giấc), tín hiệu bò trên nếp (`pulse`) | `khoiMoNao({w:1.34,d:1.02,h:.58,seed})` — `khoi-mo-nao.js` |
| **Tế bào thần kinh** — thân có nhân, chùm nhánh, **thân sợi mảnh có vân sợi** với các đoạn myelin tách rời có khe hở (bầu mỡ nằm rải rác trên sợi, không một ống liền), củ ở cuối; đặt ở `(-2.34, .26, -.66)`, sợi trục chạy tới củ tế bào | c28, c29, c31, c34, c35, c36, c38 | M/B | Tĩnh; tín hiệu chạy dọc sợi trục là đốm sáng (`axon`) | `teBaoThanKinh({size:3})` — `te-bao-than-kinh.js` (gọi `neuron()` của `rig/brain.js`, rồi dựng lại sợi trục mảnh + bầu myelin) |
| **Củ tế bào** — đầu sợi trục: khối nhăn nheo (nhiều đợt sóng chồng nhau) có mặt phẳng quay về khe, túi chứa chất nhỏ nằm dưới màng khắp củ, ba ti thể đỏ có gân, vài lúm trống nơi vừa thả phân tử, hai vành sáng ở mép | c28, c29, c30, c31, c34, c37, c38, c40, c49 | C/M | Động: túi chứa chất xoay nhẹ (nhịp thở của củ) | `bauTauTien({r:.30})` — `bau-tau-tien.js` |
| **Màng tế bào** — bề mặt chia thành các tế bào hình đa giác méo theo lưới nhiễu, giữa chúng là rãnh hẹp; dùng cho bức màng bên trái khe, cho lớp màng trước và khối tế bào sau ở hàng thụ thể, và cho sàn của khe | c28–c40, c49 | M/B | Tĩnh | `mangTeBao({w,h,cell,depth,nu,nv,axis,base})` — `mang-te-bao.js` |
| **Hàng thụ thể** — lớp màng trước có nếp và lớp tế bào sau lùi xa, trên đó **5 thụ thể có túi** (vỏ lumpy, miệng túi quay về khe, vành miệng sáng, lòng túi tối; vỏ túi và vành miệng có viền mực fresnel để tách khỏi nền tím); đặt ở `(0, 0, 1.90)`, mặt quay về khe (−z) | c29, c32, c33, c34, c38, c39, c40, c49 | C | Tĩnh; khía của thụ thể giữa hàng là chỗ phân tử ngồi vào | `hangThuThe({n:5,spacing:.46,size:.32})` + `thuThe({size,color})` — `hang-thu-the.js` |
| **Phân tử adenosine** (một cái, đứng chờ và bám vào khía) — mô hình bi–que: purin + amin + ribose + hydroxyl | c30, c32, c33, c37, c38, c39, c40, c49 | C | Động: bay từ chỗ đứng chờ `(.05,.12,.95)` vào khía (`docking(t,k)`), bị caffeine đẩy ra (`pushed`) | `phamTuAdenosine()` + `ADENO_SCALE = .034` — `pham-tu-adenosine.js` |
| **Phân tử caffeine** — mô hình bi–que: purin + ba metyl + hai oxy | c37, c39, c40, c49 | C | Động: xuất hiện ở `(-.30,.30,.95)`, bay vào khía, ngồi chặn adenosine | `phanTuCaffeine()` + `CAFE_SCALE = .034` — `phan-tu-caffeine.js` |
| **Bàn tay người** — không có nhân vật, chỉ có tay; dùng `buildHand()` của `rig/fx.js` | c2 (với ra chặn chuông), c3 (cầm tách cà phê), c24 (bấm nút đỏ), c50 (đặt tay xuống bàn), c51 (tay tắt chuông) | C | Động: `pose(curl, spread)` đổi độ cong các ngón theo câu | `buildHand({size:1.15})` — trong `set.js` |
| **Cây ở góc phòng** — chậu gốm có vành miệng, mặt đất sẫm trong miệng chậu, chín cọng mọc ra từ đất và lá ở đầu cọng (không có lá nào lơ lửng) | hậu cảnh của các khung rộng N1 | B | Tĩnh | `cayGocPhong({pot:'#d9774a', seed:31})` — `cay-goc-phong.js` |
| **Rèm buổi chiều** — một mảnh vải héo bên phải cửa sổ, vân sọc tím | c1, c4, c22, c50, c52 + hậu cảnh | B | Động: đung đưa rất nhẹ | `surface()` + texture vải — `set.js` |

---

## Nhóm 2 — Internal parts (ruột & cơ chế vi mô)

| Tên | Xuất hiện ở | LOD | Trạng thái | Cách dựng |
|---|---|---|---|---|
| **Mô hình phân tử dùng chung** — hạt là bi theo màu nguyên tố (C kem, N xanh, O đỏ), liên kết là que; cùng một cách dựng cho phân tử đứng riêng và cho đám phân tử (`InstancedMesh`) để cái bám vào khía và cái lơ lửng trông giống hệt nhau | c28–c40, c49 | C | Tĩnh (hình), động khi bay | `moleculeParts()` / `moleculeCloud()` — `src/props/_molecule.js` |
| **Đám phân tử adenosine trong khe** — 40 bản sao, mỗi bản một chỗ và một độ lớn riêng, trôi nhẹ | c28, c29, c31, c34, c38 | M | Động: mật độ theo `crowd(t,k)` — số phân tử hiện ra = `round(k·40)` (nhát cận một phân tử thì đám trống) | `damPhanTuAdenosine(40)` — `pham-tu-adenosine.js` |
| **Khía của thụ thể** — khe hở giữa hai môi của thụ thể giữa hàng, là chỗ phân tử ngồi vào; toạ độ thế giới tính bằng `localToWorld` sau khi cập nhật ma trận thế giới | c33, c39, c40, c49 | C | Tĩnh (điểm neo của phân tử) | `hangThuThe().doors[2].d.notch` — `hang-thu-the.js` |
| **Nếp cuộn của mô não** — TỔNG của năm sóng thẳng nghiêng theo năm hướng (`gyri(px,pz)`): tổng của chúng tạo ra một hình gấp khúc quanh co như nếp não, mà độ dốc của tổng thì bị chặn trên, nên không chỗ nào nếp nhỏ lại thành răng cưa ở góc nhìn nghiêng (bản trước xoáy một trường pha rồi lấy đường đồng mức: uốn khúc đẹp hơn, nhưng ở chỗ trường bị bẻ gấp thì đường đồng mức dồn cục thành nếp nhỏ hơn cả mắt lưới, và mép não thành dải răng cưa); cộng một sóng trương phình chạy chậm; biên độ nếp nhỏ dần khi bề mặt quay ngang và ở hai đỉnh não; đáy cắt phẳng để đặt xuống bàn | c8, c10–c13, c27, c45–c46, c51 | C/M | Động: `wave(t,k)` tính lại đỉnh và chuẩn hoá mặt mỗi khung hình | `khoiMoNao()` — `khoi-mo-nao.js` |
| **Điểm trên mặt nếp** — hàm tra vị trí mặt trên của khối mô theo toạ độ cục bộ, để đốm tín hiệu bám đúng vào nếp chứ không bay lơ lửng | c10, c11, c45, c46, c51 | C | Tĩnh (hàm) | `chunk.surf(x,z,t,k)` — `khoi-mo-nao.js` |
| **Mặt giấy chạy của máy ghi giấc ngủ** — giấy dài đủ 45 phút, in sẵn các vạch phút (0/10/20/30/40), đồ thị giai đoạn ngủ vẽ tới đúng phút hiện tại, phút hiện tại in đỏ có vạch đỏ đứt | c5, c7, c18, c47 | C | Động: `setMinute(m)` vẽ lại đường đồ thị và chỉ đồng hồ | `mayGhiGiacNgu().setMinute(m)` — `may-ghi-giac-ngu.js` |
| **Lưới đèn của bảng đo** — 16 đèn tròn, mỗi đèn một lần đo; đèn sáng = người đo còn phản xạ | c15–c20, c23, c24, c48 | C | Động: `setLamps(lamps)` tắt dần theo câu | `bangDoPhanXa().lamps` — `bang-do-phan-xa.js` |
| **Kim đồng hồ bảng đo** — hai kim: kim đỏ chỉ phản xạ, kim xanh chỉ cảm nhận | c16–c20, c26, c48 | C | Động: `setNeedle(needle)` | `bangDoPhanXa().needle` — `bang-do-phan-xa.js` |
| **Đèn xanh báo cảm nhận** | c23, c48 | C | Động: `setGreen(green)` | `bangDoPhanXa().green` — `bang-do-phan-xa.js` |
| **Nút đỏ trên bảng đo** | c24 | C | Tĩnh (bàn tay bấm lên) | `bangDoPhanXa().button` — `bang-do-phan-xa.js` |

---

## Nhóm 3 — Set & Environment (bối cảnh)

| Tên | Xuất hiện ở | LOD | Trạng thái | Cách dựng |
|---|---|---|---|---|
| **N1 · phòng ngủ buổi chiều** — sàn ván, tường có lỗ cửa sổ (`wallWithHole`), khung cổng, trời chiều, mặt trời thấp, rèm, cây, thảm | c1–c7, c9, c14–c26, c41–c44, c47–c48, c50, c52 | B/M | Động: rèm đung đưa, lá cây đuối nhẹ | `buildPhongNgu()` — `set.js` |
| **N1 · bàn đầu giường** — mặt gỗ `2.10 × 1.40` ở `(-0.15, 0, 1.05)`, bốn chân, một thanh chắn; **mọi đồ đo đặt theo toạ độ cục bộ của bàn** | như N1 | M/B | Tĩnh | `set.js` |
| **N2 · không gian của não** — bàn tối, hai khối mô não, một vệt sáng riêng cho bản bên trái | c8, c10–c13, c27, c45–c46, c51 | M/B | Động: vệt sáng bật dần ở c13 | `buildKhongMao()` + `brainSpace()` — `set.js` / `rig/brain.js` |
| **N3 · khe giữa hai tế bào** — sàn có đáy để khe có chiều sâu, tế bào thần kinh, củ tế bào, bức màng với hàng thụ thể, đám phân tử | c28–c40, c49 | M/B | Động: khe "thở" theo phân tử bay tới | `buildKhe()` — `set.js` |

---

## Nhóm 4 — FX & Lighting (đèn & hiệu ứng sống)

| Tên | Xuất hiện ở | LOD | Trạng thái | Cách dựng |
|---|---|---|---|---|
| **Đèn chính N1** — nắng chiều xiên qua lỗ cửa sổ, có bóng | mọi khung N1 | — | Động: cường độ theo `dim` của câu | `keyLight({from:(4.2,2.6,-3.4), color:'#ffc48c', intensity:3.3})` |
| **Vệt sáng cửa sổ** — hình quệt sáng trong không khí | mọi khung N1 | — | Động: độ đục theo `dim` | `beam(scene, key, {...WIN, length:2.6, alpha:.07})` |
| **Đèn tập trung N1** — vệt sáng riêng trên bàn, đặt theo điểm máy đang nhìn nên vùng sáng nhất của khung luôn là thứ đang kể | mọi khung N1 | — | Động: đích đèn bám theo `look` của nhát | `pool(scene, {...})` + `PHG.spot.target` trong `film.js` |
| **Mặt trời** — đĩa sáng thấp ngoài cửa sổ | c1, c4, c22, c50, c52 | B | Tĩnh | `glowMat('#ffd9a0',1.6)` trên lớp `fxLayer` |
| **Hai khối mô não: vệt sáng riêng cho bản trái** | c13 (bản trái sáng lên, bản phải vẫn tối) | M | Động: `leftLit(k)` bật dần | `pool()` trong `buildKhongMao()` |
| **Đèn N3** — đèn chính lạnh + vệt sáng chiếu xuống khe | mọi khung N3 | — | Động: theo `dim` / `focus` | `keyLight` + `pool` trong `buildKhe()` |
| **Đốm tín hiệu trên nếp não** — 14 đốm sáng bò ngang qua mặt nếp, bò chậm lúc não chưa kịp chạy lại rồi chạy đều | c10, c11, c45, c46, c51 | C | Động: `pulse(t,k)`, k = 0…1 là não đã chạy được tới đâu | `glowDots(14,.0125,'#ffe0a0',1.6)` + `setDot()` |
| **Đốm tín hiệu trên sợi trục** — 10 đốm sáng chạy dọc sợi trục, còn yếu (lý thuyết chưa chắc) | c35, c36, c49 | C/M | Động: `axon(t,k)` | `glowDots(10,.028,'#9be7ff',2.2)` + `setDot()` |
| **Phân tử bay trong khe** — mỗi phân tử có màu nguyên tố riêng (kem, xanh, đỏ) và que liên kết xám | c28–c40, c49 | C | Động: bay và ngồi vào khía | `moleculeCloud()` — `_molecule.js` |
| **Đường viền mực vẽ tay** — mọi vật trong khung được viền mực, đậm hơn ở N3 (khoảng trống không trừu tượng) | mọi khung | — | Tĩnh | `F.frame(scene, {thick, ref})` của `rig/render.js` |
| **Viền mực của khối mô não** — vỏ não mềm không có cạnh sắc nên pass viền mực ở mức màn hình không bắt được nó. Đã thử một vỏ ngoài dựng sẵn (cùng hình, nhô ra, chỉ vẽ mặt trong) và nó hỏng: mép vỏ nhô ra thành một dải răng cưa ở góc nhìn nghiêng. Nay viền được tô trong chính vật liệu não, theo GÓC NHÌN (fresnel): càng vuông góc với mắt càng tối, nên dải tối bám đúng đường viền thật, mềm, không thành răng cưa | c8, c10–c13, c27, c45–c46, c51 | C/M | Tĩnh (một nét fresnel trong shader của vật liệu) | `inkRim(skin)` — `_ink-rim.js` |
