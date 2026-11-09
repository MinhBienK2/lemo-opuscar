# MAP — tập 01 · phơi quần áo

Bản đồ để đọc nhanh, không phải tài liệu: sửa gì thì mở đúng chỗ.
Dòng tính theo `wc -l` lúc viết; dòng lệch một chút sau khi sửa là bình thường.

## src/film.js (561 dòng) — bộ dàn cảnh

| Dòng | Cái gì |
|---|---|
| 8–15 | nạp giọng (`V`), dựng bốn bối cảnh: `BAL` (hiên + phòng kín), `FAB` (trong sợi), `WAT` (mặt nước) |
| 32–160 | `SHOTS` — 60 máy quay, mỗi câu một nhát: `sh(set, id, fov, mắt, điểm nhìn, lệch)` |
| 162–168 | `N2VIS` — câu nào ở trong sợi thì thấy phần nào của sợi |
| 171–179 | `MARK` — mốc thời gian của từng nhát (bắt đầu ở câu đầu, kết thúc ở câu cuối) |
| 181–234 | `CARDS` — 41 thẻ: chữ trên thẻ, vật thẻ bám vào (`at`), câu nào thẻ hiện |
| 236–248 | `FOCUS` (độ sáng đèn theo câu), `DIM` (nhát nào phải tối) |
| 250–265 | `shotAt(t)` — tìm nhát và vị trí máy tại thời điểm `t` |
| 267–308 | `EV` — sự kiện âm thanh: giọng, không khí, nhạc, foley |
| 310–328 | **mốc nhịp**: mỗi câu một điểm trên khung (`markBeat`) |
| 331–546 | `window.render(t)` — dựng khung: máy, đèn, trạng thái vật thể theo câu |
| 548–557 | `window.DIAG(t)` — chẩn đoán: nhát nào, máy ở đâu, câu nào lúc nào |

## src/set.js (1200 dòng) — bối cảnh

| Dòng | Cái gì |
|---|---|
| 27 | `buildBalcony()` — hiên phơi **và** căn phòng kín (một căn, phòng sau bức tường kính) |
| 368–383 | bàn thí nghiệm `lab`, hai giọt nước trên hai mặt kính, vách ngăn có mặt kính mờ (câu 35–37) |
| 385–415 | kệ gỗ: hai cái cân `scale1`/`scale2`, quạt nhỏ `fanC`, dải gió `shelfWind`, đồng hồ `wallClock` (câu 33–34) |
| 450–505 | cột hơi nước `vapColSpk`, dải ẩm bão hoà `hemBand`, lớp ẩm bị gió quét `wetLayer`, hạt khí lối mở `doorSpk` |
| 506–540 | bàn tay `hand` và giọt mồ hôi bám trên mu bàn tay `sweatBeads` |
| 542–592 | vệt gió trong phòng `windSpk` và gió nhẹ ngoài hiên `breeze` |
| 678–1094 | `update(t, opt)` — **mọi vật thể tự diễn** theo `opt` của câu đang kể |

## src/props.js (4514 dòng) — đạo cụ, mỗi cái một hàm

`dryingLine` 32 · `clothesClip` 74 · `tShirt` 400 · `foldedShirt` 514 · `halfShirt` 693 ·
`spreadShirt` 811 · `hemDrop` 933 · `trousers` 1070 · `thinTee` 1450 · `towel` 1480 ·
`shirtPile` 1645 · `basin` 1687 · `deskFan` 1786 · `sideTable` 1889 · `nylonBag` 1899 ·
`kitchenScale` 2018 · `thermometer` 2093 · `hygrometer` 2172 · `chair` 2272 · `labTable` 2328 ·
`wovenFibres` 2499 · `dropOnThread` 3057 · `waterSurface` 3233 · `dryBench` 3639 · `hand` 3679

## Ngoài tập này (dùng chung, không sửa)

`rig/render.js` — `film()`, `label()`, `subtitle()`, `toScreen()`, `markBeat()`
`rig/kit.js` — vật liệu toon, `mesh()`, `TEX`, `clamp/lerp/ss`
`rig/motion.js` — `sway()`, `breathe()`, `motor()`, `particleStream()`
`rig/fx.js` — `glowDots()`, `setDot()`, `setStreak()`, `flow()`
