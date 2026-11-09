# MAP — tập 03 "Vì sao chai nhựa bị co lại khi rót nước sôi vào?"

Bản đồ của mã nguồn tập này: tên → dòng. Đọc đúng đoạn cần, đừng đọc lại cả tệp.
Các số dòng **đúng với lần sửa sau cùng**; khi sửa code, sửa lại bảng này.

## src/film.js (trang của phim: window.render, window.EV, các nhát)

| Dòng | Cái gì |
|---|---|
| 21–22 | `V` (timeline từ giọng đọc) · `F` (camera của rig) |
| 25 | `SC` — ba nơi chốn: N1 bàn bếp · N2 trong thành chai · N3 trong bụng chai |
| 31 | `sceneOf(set, key)` — chọn nơi chốn theo ký hiệu của nhát |
| 41–46 | toạ độ: `A` `B` `C` `PRE` `PRE2` `POT` `CUP` `GG` `CAP`, và `MOUTH_A` `NECK_B` `NECK_C` `RIM_CUP` |
| 50–54 | `TILT` (nghiêng ấm) · `SPOUT` (đầu vòi) · `BAR` (quai cầm) · `rotZ` · `SPOUT_R` `BAR_R` |
| 56 | `pourPose(tx,ty,tz)` — đặt ấm sao cho vòi nằm trên miệng chai |
| 60–61 | `POUR_A` ( rót vào chai A) · `POUR_CUP` ( rót ra cốc) |
| 65–70 | `HANDLE_CUP` · `handleAt(cx,cy,cz,tilt)` — vị trí quai cốc khi cốc nghiêng |
| 72–83 | `tipAt` · `POUR_A_FLOW` · `POUR_CUP_FLOW` · `POUR_C_TO_C` — ba dòng nước |
| 92–254 | `SHOTS` — 63 nhát, một câu một hình; `sh('N1','c9', fov, [pos], [look], [drift])`; `pos`/`look` có thể là hàm `(t,u)` (c9 đi theo tay) |
| 257 | `MARK` — mốc thời gian của mỗi nhát, lấy từ timeline |
| 259 | `shotAt(t)` — nhát nào đang chạy ở thời điểm t |
| 277–308 | `CARDS` — thẻ chữ; **mỗi thẻ có `ids`**: chỉ hiện ở câu nó gọi tên; **neo ở mép phải vật** |
| 310 | `C.windows = [cardWindow(C, V)]` — mốc mở/đóng của từng thẻ (công thức của rig) |
| 313 | `T(id)` / `E(id)` — đầu và cuối một câu |
| 318–333 | `kx` `ky` `kz` `kr` — vị trí và xoay của ấm theo thời gian |
| 335–343 | `goA` `goCup` — dòng nước chảy hết hay ngắn lại |
| 345–363 | `steamPow` `steamSpread` `steamBPow` — độ đặc và độ rộng của cột hơi nước |
| 365–369 | `thLevel` — cột rơi của nhiệt kế |
| 371–390 | `aHot` `aShrink` `aWrinkle` `bBulge` `bSuck` — trạng thái chai A và chai B |
| 392 | `gLevel` — kim đồng hồ áp suất |
| 397–408 | `relax` (móc xích) · `preInflate` `pre2X/Y/Z` (mẩu preform nong rồi được tay đưa đi) |
| 410–427 | `capX` `capY` `capZ` `capRX` `capRY` — nắp rời được tay cầm lên vặn |
| 429–445 | `cupX` `cupY` `cupZ` `cupTilt` `goC` — cốc được cầm lên, nghiêng rót vào chai C |
| 516 | `applyState(id, t)` — trạng thái vật theo câu đang nói (nhiệt kế ở lại trong cốc tới c63) |
| 597 | `applyHand(id, t)` — bàn tay: chỗ đứng, xoay, độ cong ngón |
| 652 | `updateProps(t, id)` — vật động: hơi nước, dòng nước, thẻ chữ, điểm nhịp |

## src/props.js (vật dựng: mỗi vật một hàm)

| Dòng | Cái gì |
|---|---|
| 27 | `makeLathe(profile, seg)` — lathe tự tay (rig không cho đổi hình theo khung) |
| 63 · 70 | `PREFORM` (mẩu dày, cổ ren) · `BOTTLE` (thân chai) — hai đường viền cùng số đỉnh |
| 77 | `mixProfile(k)` — nội suy preform → chai |
| 90–91 | `DENT` (nếp nhăn theo chiều cao) · `WOB` (gợn quanh thân) |
| 93 | `smoothRadii(prof)` |
| 106 | `deformRows(rows, bodyProf, st, smoothR, off, bulgeK)` — bán kính và chiều cao sau biến dạng; `off` là độ lệch của nhãn; `bulgeK` là độ phồng |
| 127 | `writeDeformed(lathe, rowsDef, bodyProf, st)` — đổ vào lưới; thêm đáy nhăn cánh và nếp lõm một bên |
| 160 | `labelTex()` — nhãn có chữ "NƯỚC" |
| 185 | `buildCapMesh(mat)` — nắp có ren dọc, miệng trong lõm |
| 202 | `createBottle({cap,label,morph})` — trạng thái `shrink` `wrinkle` `bulge` `suck` |
| 351 · 358 | `createPreform()` (dùng `setInflate`) · `createCap()` (nắp rời) |
| 370 | `createThermometer({stem,head})` — que dày, thang có 100 và 70 |
| 427 | `createGauge({R})` — đồng hồ áp suất vặn vào nắp, kim đỏ, không số |
| 460 | `createChains({...,span})` — móc xích quanh thân và theo chiều dọc; `mkHook(s)` dựng lưỡi móc nhọn; `span` mở vòng thành đoạn |
| 568 | `createWaterSurface({R,y,rim,neck})` — mặt nước tròn có vân gợn sóng; `rim` là cổ chai quanh mặt nước |
| 633 | `rippleTex()` — vân đồng tâm của mặt nước |
| 651 | `createWallSlice({R,th,h,opacity,waist})` — mặt cắt thành chai có gân dọc và hai mép cắt đủ bề dày |
| 732 | `puffTex()` — vân loang của một búp hơi nước |
| 743 | `createSteam({n,h,r0,r1,size,alpha})` — cột hơi nước: **mảnh quay mặt máy**, không phải quả cầu; `setSpread(k)` thu cột lại |
| 807 | `createArrows({n,len,rad})` — mũi tên áp lực, đầu tam giác dẹp |
| 868 | `createHand({skin,sleeve})` — bàn tay của rig thu còn 60 % |
| 879 | `createMug(color,drink)` — cốc thành mở, mặt nước tên "water", có bọt sôi và hơi |
| 911 | `PROPS` — danh mục vật cho `propcheck` (16 vật) |

## src/set.js (bối cảnh)

| Dòng | Cái gì |
|---|---|
| 18 | `buildKitchen(scene)` — bàn bếp, ba chai, ấm, cốc, nhiệt kế, đồng hồ, preform, hơi nước |
| 140 | `buildInsideWall(scene)` — N2: trong thành chai, nền tối, vệt nhiệt cam, đèn phụ cho lượt N2 đầu |
| 173 | `buildInsideBottle(scene)` — N3: trong bụng chai, nền xanh lạnh |

## src/timeline.js (sinh tự động — không gõ tay)

| Dòng | Cái gì |
|---|---|
| 3 | `TAIL` — đuôi phim |
| 5 | `SEQ` — thứ tự câu và khoảng nghỉ giữa câu |
| 71 | `SUBS` — mảnh phụ đề, mỗi mảnh gắn với một từ khóa |
| 288 | `build(dur, words, lips)` — ra `L` (mốc câu) · `cues` (phụ đề) · `talk` (miệng) · `end` |

## src/chapters.js
`CHAPTERS` — một chương `tap-03` (c1–c63). Thêm dòng ý mới thì phải chia làm hai chương.
