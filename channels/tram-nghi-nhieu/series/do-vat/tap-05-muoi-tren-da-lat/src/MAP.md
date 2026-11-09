# MAP — tập 05 · rắc muối lên đá lạnh

Bản đồ để đọc nhanh, không phải tài liệu: sửa gì thì mở đúng chỗ.
Dòng tính theo `wc -l` lúc viết; kiểm bằng `python3 tools/check_map.py <tập>`.

## src/props.js (1287 dòng) — vật dựng, mỗi vật một hàm

| Dòng | Cái gì |
|---|---|
| 19 | `iceTex` — texture băng: vết nứt mờ, thẳng và dài trong khối đá |
| 55 | `latticeTex` — texture lưới phân tử (mặt đá ở nano và vệt băng mờ) |
| 104 | `steelTex` — texture inox xước |
| 117 | `saltTex` — texture hạt muối trắng trên nền xám |
| 43 | `ICE_MAT`, `STEEL` — vật liệu toon dùng chung cho đá và inox |
| 137 | `iceCube` — viên đá; `setMelt(k)` làm nó nhỏ dần và thấp xuống |
| 178 | `puddle` — vũng nước trên mặt bàn; `setLevel(k)` cho nó lan ra |
| 200 | `waterFilm` — màng nước mỏng của vũng, vẽ ở lớp fx (không có viền mực) |
| 213 | `puddleTex` — texture nước xanh có vệt sáng |
| 245 | `softShadow` — vệt bóng tiếp xúc dưới viên đá (tránh viên đá trôi) |
| 262 | `steelTray` — khay inox sâu, bốn thành thấp |
| 276 | `saltTin` — hộp muối; `setUsed(k)` làm muối trong hộp cạn dần |
| 300 | `saltBag` — túi muối mềm, có miếng nhãn |
| 330 | `saltDish` — tô muối tròn; `setUsed(k)` làm đống muối trong tô xẹp dần |
| 391 | `iceBox` — hộp xốp giữ đá vỡ |
| 412 | `hammer` — chiếc búa sắt, cán gỗ |
| 437 | `thermo` — que nhiệt kế; `setTemp(c)` đặt đầu cột thủy nghiện đỏ, `addMark(y)` vạch mốc |
| 485 | `tumbler` — ly thuỷ tinh có nước; `setFill(k)` |
| 513 | `stirRod` — que khuấy thủy tinh dài |
| 523 | `beaker` — bình thuỷ tinh có vạch chia; `setFreeze(k)` cho lớp băng mọc từ thành vào |
| 572 | `iceBath` — bể đá muối: tô inox rộng đầy đá vỡ |
| 603 | `bowlOfIce` — bát toàn đá vỡ |
| 635 | `zipBag` — túi zip trong suốt, bên trong sữa đặc; `setFrozen(k)` mọc vỏ sương |
| 730 | `iceFace` — mặt đá ở cấp nano; `setLayer(thin, wet)` cho lớp nước trên mặt mỏng dần |
| 773 | `molecules` — hạt phân tử nước bay tới và dính; `update(t)` |
| 817 | `ions` — cầu ion xanh và tím kèm dấu điện tích; `update(t, cam)` |
| 881 | `saltGrain` — hạt muối rơi; `setFall(k)`, `setDissolve(k)` |
| 921 | `saltFall` — dòng hạt muối tinh thể rơi xuống; `update(t, go)` |
| 955 | `molCluster` — một phân tử nước (O đỏ + hai H trắng, có que) |
| 977 | `PROPS` — danh mục vật cho vòng chấm vật dựng |
| 1021 | `saltPatch` — vệt muối trên mặt viên đá, có hạt to trên mặt; `setDissolve(k)` |
| 1067 | `frostPatch` — lớp băng mờ mọc trên mặt viên đá đối chứng; `setGrow(k)` |
| 1114 | `frostSheet` — mảng băng tròn mép run (geometry) |
| 1129 | `frostTex` — texture sương: nền sữa, lông vũ và tia dài |
| 1179 | `meltStream` — dòng nước nhỏ chảy xuống mép đá; `setFlow(k)` |
| 1216 | `runnelGeo` — dải nước chảy (geometry) |
| 1228 | `dropGeo` — giọt nước hình giọt lệ (geometry) |
| 1246 | `waterBody` — khối nước trong suốt (dựng sẵn, phim không dùng) |
| 1263 | `hydrate` — tinh thể muối hai nước mọc trên thành bình; `setGrow(k)` |

## src/set.js (507 dòng) — năm nơi chốn

| Dòng | Cái gì |
|---|---|
| 28 | `noShaft` — tắt tia sáng của rig trong mọi cảnh của tập  |
| 39 | `KL` — bảng chỗ đứng của vật ở bếp (khay, đá có muối, đá đối chứng, hộp muối, túi muối, búa…)  |
| 61 | `buildKitchen` — cảnh bếp, dùng cho cả buổi sáng (`bagAt: 'back'`) và buổi chiều (`bagAt: 'front'`) |
| 228 | `buildLab` — cảnh bàn thí nghiệm: bể đá muối, bốn bình xếp hàng chéo, ba que nhiệt kế, que khuấy, tô muối  |
| 344 | `buildPuddle` — cảnh vũng nước quanh viên đá: mặt nước, ion, hạt phân tử nước, mảnh đá, hạt muối, dòng nhiệt  |
| 450 | `buildNano` — cảnh mặt đá ở cấp nano: mặt tinh thể, lớp nước, phân tử nước, ion, vệt muối  |

## src/film.js (575 dòng) — trang phim

| Dòng | Cái gì |
|---|---|
| 12 | `loadVoice`, `label`, `subtitle`, `toScreen`, `cardWindow` — nạp từ `rig/render.js` |
| 18–19 | `loadVoice`, `film` — nạp lời kể và dựng khung |
| 22–28 | `SC`, `buildKitchen`, `buildLab`, `buildPuddle`, `buildNano` — dựng năm nơi chốn: K bếp sáng, L bàn thí nghiệm, P vũng nước, N mặt đá nano, K2 bếp chiều |
| 46 | `gripSide`, `gripDown`, `gripLeft` — đặt bàn tay vào tư thế; `gripDown` xoay cánh tay rút lên trên khung, `gripLeft` xoay ngón về phía −x  |
| 58 | `SHOTS` — bảng 25 nhát: `pos`, `look`, `fov`, `d` (máy trượt trong nhát), `fov2`/`dLook` cho nhát mở rộng rồi đi vào  |
| 149 | `meltK`, `pudK`, `patchK`, `frostK`, `flowK`, `tinK`, `thK`, `th10`, `thHalf`, `thDense`, `fzPure`, `fz10`, `fzHalf`, `fzDense`, `hydK`, `chipK`, `dishDiss`, `layerThin`, `layerWet`, `patchN` — các đường trạng thái theo thời gian  |
| 206 | `applyState` — đặt trạng thái của vật theo câu đang kể và theo nơi đang quay  |
| 341 | `grainState` — hạt muối rơi và tan trong vũng nước  |
| 395 | `denseColumn` — toạ độ đầu cột đỏ của bình đậm, chỗ thẻ `-21 °C` neo vào  |
| 405 | `brineBeaker` — toạ độ bình nước muối mười phần trăm, chỗ thẻ `10 %` neo vào  |
| 406 | `pureBeaker` — toạ độ bình nước sạch, chỗ thẻ `nước sạch` neo vào  |
| 413 | `CARDS` — ba thẻ chữ: `nước sạch`, `10 %` và `-21 °C`, mỗi thẻ có `lead`/`hold`  |
| 434 | `EV` — sự kiện của phim (không khí, nhạc, tiếng vật thể)  |
| 456 | `FOLEY` — tiếng vật thể theo câu  |
| 205 | `shotAt` — nhát đang quay tại thời điểm `t`  |
| 493 | `window.render` — dựng một khung: máy quay, trạng thái vật, thẻ số, phụ đề  |
| 549 | `F.markBeats` — mốc nhịp: điểm trên khung cho từng câu  |
| 560 | `window.DIAG` — chẩn đoán: nhát đang quay, thẻ số, vị trí máy  |
