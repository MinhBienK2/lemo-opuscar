# MAP — tập 06 · giấy ướt

Bản đồ để đọc nhanh, không phải tài liệu: sửa gì thì mở đúng chỗ.
Dòng tính theo `wc -l` lúc viết; dòng lệch một chút sau khi sửa là bình thường.

## src/film.js (212 dòng) — trang phim

| Dòng | Cái gì |
|---|---|
| 25–26 | nạp giọng (`V`), dựng phim (`film()`), ba cảnh: `N1` bếp · `N2` trong tờ giấy · `N3` bàn đo |
| 30–33 | dựng ba bộ dựng cảnh (`buildKitchen`, `buildInside`, `buildDesk`) |
| 36 | `makeActs(...)` — phần diễn: vật thể và bàn tay |
| 49–59 | `CARDS` — tám thẻ chữ (nhãn) của phim, mỗi thẻ có câu nó hiện và điểm nó bám vào vật |
| 52–87 | **sự kiện âm thanh**: không khí (bếp / trong giấy / đêm) và năm điểm nhạc (A–E) |
| 89–127 | **foley**: mỗi sự kiện gắn với câu nó xảy ra |
| 129–135 | `shotAt(t)` — tìm nhát và vị trí máy tại thời điểm `t` |
| 137–184 | `window.render(t)` — dựng khung: máy, trạng thái vật thể theo câu, thẻ chữ và phụ đề |
| 186–196 | **mốc nhịp**: mỗi câu một điểm trên khung (`markBeats`) |
| 198–206 | `window.DIAG(t)` — chẩn đoán: nhát nào, máy ở đâu, thẻ nào hiện lúc nào |

## src/shots.js (61 dòng) — bảng nhát

| Dòng | Cái gì |
|---|---|
| 7–60 | `SHOTS` — 43 máy quay, mỗi câu một nhát: `ids`, nơi chốn `s`, `pos`/`look`/`fov`, và `d` (máy trượt trong nhát) |

## src/acts.js (240 dòng) — phần diễn

| Dòng | Cái gì |
|---|---|
| 12–24 | `gripSide` / `gripDown` — hai kiểu đặt bàn tay (tay vào từ bên, tay vào từ trên) |
| 27–40 | dựng bảy bàn tay của phim (tay ướt, tay khô, tay kéo mép, tay trong thế giới sợi, tay kéo lực kế, tay rót nước, tay ấn giấy) |
| 52–81 | các **đại lượng** đổi theo thời gian: `wetK`, `wrinkleK`, `tearK`, `moleK`, `bondWet`, `swellK`, `gapK`, `crackK`, `loadK`, `rhK`, `stretchK`, `wetStripK`, `breakK`, `pressK` |
| 85–237 | `applyState(id, t)` — **trạng thái theo câu**: bếp (tay ướt/khô, tờ giấy nhăn và rách), trong tờ giấy (nước bay vào, móc đổi màu, sợi phồng, hai sợi trượt, vệt nứt lan), bàn đo (lực kế, độ ẩm, rót nước, dải giấy đứt, ấn giấy đã sấy) |

## src/set.js (344 dòng) — bối cảnh

| Dòng | Cái gì |
|---|---|
| 25–30 | `noShaft()` — tắt tia sáng hình nón của rig (nó phủ kem lên cả khung) |
| 33–84 | `buildKitchen()` — **N1**: hai tờ giấy trên quầy (ướt ở x = -.90, khô ở x = -.50), bát nước, khăn lau, vệt sáng phụ |
| 87–219 | `buildInside()` — **N2**: khối giấy phía sau, mạng sợi nền, ba sợi tiền cảnh, các móc nối đặt đúng chỗ hai sợi chạm nhau, phân tử nước, móc xanh lam giữ hai phân tử nước, vệt nứt, **mặt cắt của tờ giấy** |
| 225–336 | `buildDesk()` — **N3**: giá đo, kẹp giấy, dải giấy thử (mặt giấy về phía máy), lực kế, đồng hồ độ ẩm, **thước gỗ kẻ vạch** đứng dựng cạnh dải, bát nước, dòng nước rót, mẻ giấy khăn, túi giấy **bao bì dạng phẳng**, góc giấy khăn bị cắt (móc nối hồng), tờ giấy đã sấy và tờ giấy tươi |
| 341–354 | `droplets()` — giọt nước bám trên mu bàn tay ướt |

## src/props.js (570 dòng) — đạo cụ, mỗi cái một hàm

`paperSheet` 51 (tờ giấy: mép cong, vệt ẩm, nếp nhăn **nặn ra**, mép rách gấp khúc) ·
`crack` 131 · `waterBowl` 147 · `dishTowel` 172 · `fibre` 189 (sợi cellulose dẹt + nhóm hydroxyl hai bên) ·
`bond` 217 (mối liên kết hydrogen; móc xanh lam giữ hai phân tử nước là cùng hàm, khác màu) ·
`waterMolecule` 237 · `paperClamp` 250 · `gaugeStand` 259 ·
`dynamometer` 296 (mặt thang + kim + vòng treo trên) · `hygrometer` 315 · `paperStrip` 336 (dải giấy thử, **đứt được**) ·
`cutCorner` 382 (góc giấy khăn bị cắt, lộ móc nối nhựa) · `tissueStack` 405 · `paperBag` 422 (túi bao bì dạng phẳng, mép gấp kép, không quai) ·
`ruler` 448 (thước kẻ vạch) · `paperEdge` 469 (mặt cắt của tờ giấy, mép cắt + đầu sợi chìa ra) ·
`PROPS` 516 (danh mục vật cho propcheck)

## Ngoài tập này (dùng chung, không sửa)

`rig/render.js` — `film()`, `label()`, `subtitle()`, `toScreen()`, `markBeats()`
`rig/kit.js` — vật liệu toon, `mesh()`, `surface()`, `TEX`, `clamp/lerp/ss`
`rig/sets.js` — `kitchen()`, `desk()` (bối cảnh dùng chung)
`rig/lights.js` — `keyLight()`, `ambience()`, `pool()`, `wallWithHole()`
`rig/fx.js` — `buildHand()`, `flow()` (dòng nước), `glowMat()`
`rig/voice.js` — `loadVoice()`
