# MAP — tập 05 · rắc muối lên đá lạnh

Bản đồ để đọc nhanh, không phải tài liệu: sửa gì thì mở đúng chỗ.
Dòng tính theo `wc -l` lúc viết; kiểm bằng `python3 tools/check_map.py <tập>`.

## src/props.js (983 dòng) — vật dựng, mỗi vật một hàm

| Dòng | Cái gì |
|---|---|
| 18 | `iceTex` — texture băng: vết nứt trong khối đá |
| 39 | `latticeTex` — texture lưới phân tử (mặt đá ở nano và vệt băng mờ) |
| 68 | `steelTex` — texture inox xước |
| 81 | `saltTex` — texture hạt muối trắng trên nền xám |
| 96–97 | `ICE_MAT`, `STEEL` — vật liệu toon dùng chung cho đá và inox |
| 102 | `iceCube` — viên đá; `setMelt(k)` làm nó nhỏ dần và thấp xuống |
| 131 | `puddle` — vũng nước trên mặt bàn; `setLevel(k)` cho nó lan ra |
| 184 | `softShadow` — vệt bóng tiếp xúc dưới viên đá (tránh viên đá trôi) |
| 201 | `steelTray` — khay inox sâu, bốn thành thấp |
| 215 | `saltTin` — hộp muối; `setUsed(k)` làm muối trong hộp cạn dần |
| 239 | `saltBag` — túi muối mềm, có miếng nhãn |
| 269 | `saltDish` — tô muối tròn; `setUsed(k)` làm đống muối trong tô xẹp dần |
| 314 | `iceBox` — hộp xốp giữ đá vỡ |
| 335 | `hammer` — chiếc búa sắt, cán gỗ |
| 360 | `thermo` — que nhiệt kế; `setTemp(c)` đặt đầu cột thủy nghiện đỏ, `addMark(y)` vạch mốc |
| 408 | `tumbler` — ly thuỷ tinh có nước; `setFill(k)` |
| 436 | `stirRod` — que khuấy thủy tinh dài |
| 446 | `beaker` — bình thuỷ tinh có vạch chia; `setFreeze(k)` cho lớp băng mọc từ thành vào |
| 485 | `iceBath` — bể đá muối: tô inox rộng đầy đá vỡ |
| 516 | `bowlOfIce` — bát toàn đá vỡ |
| 548 | `zipBag` — túi zip trong suốt, bên trong sữa đặc; `setFrozen(k)` mọc vỏ sương |
| 614 | `iceFace` — mặt đá ở cấp nano; `setLayer(thin, wet)` cho lớp nước trên mặt mỏng dần |
| 639 | `molecules` — hạt phân tử nước bay tới và dính; `update(t)` |
| 670 | `ions` — cầu ion xanh và tím kèm vành điện tích; `update(t, cam)` |
| 708 | `saltGrain` — hạt muối rơi; `setFall(k)`, `setDissolve(k)` |
| 748 | `saltFall` — dòng hạt muối tinh thể rơi xuống; `update(t, go)` |
| 782 | `molCluster` — một phân tử nước (ba quả cầu) |
| 794 | `PROPS` — danh mục vật cho vòng chấm vật dựng |
| 838 | `saltPatch` — vệt muối trên mặt viên đá, có hạt to trên mặt; `setDissolve(k)` |
| 877 | `frostPatch` — lớp băng mờ mọc trên mặt viên đá đối chứng; `setGrow(k)` |
| 912 | `meltStream` — dòng nước nhỏ chảy xuống mép đá; `setFlow(k)` |
| 942 | `waterBody` — khối nước trong suốt (dựng sẵn, phim không dùng) |
| 959 | `hydrate` — tinh thể muối hai nước mọc trên thành bình; `setGrow(k)` |

## src/set.js (483 dòng) — năm nơi chốn

| Dòng | Cái gì |
|---|---|
| 28 | `noShaft` — tắt tia sáng của rig trong mọi cảnh của tập |
| 39 | `KL` — bảng chỗ đứng của vật ở bếp (khay, đá có muối, đá đối chứng, hộp muối, túi muối, búa…) |
| 61 | `buildKitchen` — cảnh bếp, dùng cho cả buổi sáng (`bagAt: 'back'`) và buổi chiều (`bagAt: 'front'`) |
| 214 | `buildLab` — cảnh bàn thí nghiệm: bể đá muối, bốn bình xếp hàng chéo, ba que nhiệt kế, que khuấy, tô muối |
| 326 | `buildPuddle` — cảnh vũng nước quanh viên đá: mặt nước, ion, hạt phân tử nước, mảnh đá, hạt muối, dòng nhiệt |
| 428 | `buildNano` — cảnh mặt đá ở cấp nano: mặt tinh thể, lớp nước, phân tử nước, ion, vệt muối |

## src/film.js (533 dòng) — trang phim

| Dòng | Cái gì |
|---|---|
| 12 | `loadVoice`, `label`, `subtitle`, `toScreen`, `cardWindow` — nạp từ `rig/render.js` |
| 18–19 | `loadVoice`, `film` — nạp lời kể và dựng khung |
| 22–28 | `SC`, `buildKitchen`, `buildLab`, `buildPuddle`, `buildNano` — dựng năm nơi chốn: K bếp sáng, L bàn thí nghiệm, P vũng nước, N mặt đá nano, K2 bếp chiều |
| 32–46 | `gripSide`, `gripDown`, `gripLeft` — đặt bàn tay vào tư thế; `gripDown` xoay cánh tay rút lên trên khung, `gripLeft` xoay ngón về phía −x |
| 58 | `SHOTS` — bảng 25 nhát: `pos`, `look`, `fov`, `d` (máy trượt trong nhát), `fov2`/`dLook` cho nhát mở rộng rồi đi vào |
| 135–176 | `meltK`, `pudK`, `patchK`, `frostK`, `flowK`, `tinK`, `thK`, `th10`, `thHalf`, `thDense`, `fzPure`, `fz10`, `fzHalf`, `fzDense`, `hydK`, `chipK`, `dishDiss`, `layerThin`, `layerWet`, `patchN` — các đường trạng thái theo thời gian |
| 192 | `applyState` — đặt trạng thái của vật theo câu đang kể và theo nơi đang quay |
| 307 | `grainState` — hạt muối rơi và tan trong vũng nước |
| 353 | `denseColumn` — toạ độ đầu cột đỏ của bình đậm, chỗ thẻ `-21 °C` neo vào |
| 363 | `brineBeaker` — toạ độ bình nước muối mười phần trăm, chỗ thẻ `10 %` neo vào |
| 364 | `pureBeaker` — toạ độ bình nước sạch, chỗ thẻ `nước sạch` neo vào |
| 371 | `CARDS` — ba thẻ chữ: `nước sạch`, `10 %` và `-21 °C`, mỗi thẻ có `lead`/`hold` |
| 392 | `EV` — sự kiện của phim (không khí, nhạc, tiếng vật thể) |
| 414 | `FOLEY` — tiếng vật thể theo câu |
| 443 | `shotAt` — nhát đang quay tại thời điểm `t` |
| 451 | `window.render` — dựng một khung: máy quay, trạng thái vật, thẻ số, phụ đề |
| 507 | `F.markBeats` — mốc nhịp: điểm trên khung cho từng câu |
| 518 | `window.DIAG` — chẩn đoán: nhát đang quay, thẻ số, vị trí máy |
