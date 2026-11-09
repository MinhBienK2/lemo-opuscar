# COMPONENTS_SPEC — tập 06 · tờ giấy ướt

Bóc tách toàn bộ linh kiện 3D của tập, theo bốn nhóm bắt buộc. Mỗi linh kiện là **một hàm
khởi tạo riêng** trong `src/props.js` hoặc `src/set.js`; tên trong bảng này là tên hàm thật,
để đối chiếu với mã.

Cự ly: **Cận** = máy phải thấy rõ chi tiết · **Vừa** = thấy hình dạng và chuyển động ·
**Nền** = chỉ gợi không gian, không cần chi tiết.

---

## Nhóm 1 — Props (đạo cụ tương tác)

| Tên linh kiện | Vai trò & xuất hiện ở shot | Cự ly | Trạng thái động | Hàm dựng |
|---|---|---|---|---|
| `paperSheet` | Tờ giấy ướt (c1–c5), tờ giấy khô (c3, c42, c43), tờ đã sấy (c39–c41) | Cận | `setWet` (vệt ẩm loang, giấy tối) · `setWrinkle` (nếp nhăn **nặn ra**, dựng lại mặt cong từ uv) · `setTear` (mở mép rách gấp khúc) | `paperSheet({w,h,tear,seed,wrinkle})` — `src/props.js:51` |
| `waterBowl` | Bát nước ở bếp (c4) và bàn đo (c33) | Vừa | Tĩnh; mặt nước phẳng, viền đỏ | `waterBowl({R})` — `src/props.js:147` |
| `dishTowel` | Khăn lau vắt trên miệng bát (c4, c33) | Vừa | Tĩnh | `dishTowel({w,drop,color})` — `src/props.js:172` |
| `paperClamp` | Kẹp đầu trên của dải giấy thử (c25) | Vừa | Tĩnh | `paperClamp({})` — `src/props.js:250` |
| `gaugeStand` | Giá đo, vạt ngang chìa tới kẹp (c24, c25) | Vừa | Tĩnh | `gaugeStand({H,color})` — `src/props.js:259` |
| `dynamometer` | Đồng hồ đo lực treo ở đầu dải giấy (c25–c34) | Cận | `setLoad(k)` — kim chạy theo lực; `position.y` hạ/xoay theo tải | `dynamometer({R})` — `src/props.js:296` |
| `hygrometer` | Đồng hồ độ ẩm trên bàn (c27–c31) | Cận | `setRH(k)` — kim chạy lên theo độ ẩm | `hygrometer({R})` — `src/props.js:315` |
| `paperStrip` | Dải giấy thử treo thẳng, **mặt giấy quay về phía máy** (c25–c36) | Cận | `setWet(k)` (giấy sẫm, nhăn lên) · `setBreak(k)` (đoạn dưới gãy, quay về một bên) · `scale.x` giãn dài, `position.y` hạ theo độ giãn | `paperStrip({len,wid,seed})` — `src/props.js:336` |
| `cutCorner` | Góc giấy khăn bị cắt vát, lộ móc nối nhựa màu hồng (c36–c38) | Cận | Tĩnh; các móc hồng **to và sáng**, xếp **ở mép cắt**, và **không** đổi màu khi nước tới | `cutCorner({w,h,seed})` — `src/props.js:382` |
| `tissueStack` | Mẻ giấy khăn giấy (c38, c39) | Vừa | Tĩnh | `tissueStack({n,w,d,color})` — `src/props.js:405` |
| `paperBag` | Túi giấy **bao bì dạng phẳng của ngành**: mép gấp kép, **không quai xách** (c36–c39) | Vừa | Tĩnh | `paperBag({w,h,d,color})` — `src/props.js:422` |
| `ruler` | Thước gỗ kẻ vạch đứng dựng cạnh dải giấy thử, để đo độ giãn (c25, c30) | Vừa | Tĩnh | `ruler({len,wid})` — `src/props.js:448` |
| `paperEdge` | Mặt cắt của tờ giấy: mép cắt thẳng với các đầu sợi chìa ra, quét ngang và **phủ kín** khung khi máy lui ra khỏi ruột tờ giấy (c23) | Cận | `position.x` quét từ phải sang trái theo câu 23 | `paperEdge({w,h,seed})` — `src/props.js:469` |
| Bàn tay | Tay ướt (c1–c2), tay kéo mép (c5), tay khô (c3, c4, c42), tay kéo hai sợi (c19), tay kéo lực kế (c26, c31, c34), tay rót nước (c33), tay ấn giấy đã sấy (c41) | Cận | `pose(curl, spread)`; vị trí và góc đặt theo câu | `buildHand({size})` của rig — `src/acts.js:33–40` |

## Nhóm 2 — Internal parts (ruột và cơ chế vi mô)

Cả nhóm này chỉ tồn tại **bên trong tờ giấy** (N2) và trên dải giấy thử (N3).

| Tên linh kiện | Vai trò & xuất hiện ở shot | Cự ly | Trạng thái động | Hàm dựng |
|---|---|---|---|---|
| `fibre` | Sợi cellulose: ba sợi tiền cảnh (c9–c22) và mạng sợi nền | Cận (tiền cảnh) · Nền | `setSwell(k)` — sợi phồng to ra, nhóm hydroxyl dãi xa nhau | `fibre({len,wid,color,seed,groups})` — `src/props.js:189` |
| `bond` | Mối liên kết hydrogen ở chỗ hai sợi chạm nhau (c11, c14, c16) | Cận | `setWet(k)` — móc đổi từ vàng sang xanh khi nước chiếm chỗ bám | `bond({r,color})` — `src/props.js:217` |
| `bond` (móc **xanh lam**) | Móc giữ **hai phân tử nước** với nhau (c14, c15) — màu khác móc vàng, và **không** đổi màu khi nước tới | Cận | Chỉ hiện ở câu 14–15; `visible` bật/tắt theo câu | `bond({r:.0050, color:'#5aa9ff'})` — `src/set.js` (`waterHook`) |
| `waterMolecule` | Phân tử nước bay vào và chen vào chỗ các nhóm hydroxyl (c13, c15) | Cận | Vị trí nội suy từ điểm xuất phát tới đúng chỗ móc nối | `waterMolecule({R,color})` — `src/props.js:237` |
| `crack` | Vệt nứt lan giữa hai sợi đã trượt ra (c20, c21) | Cận | `scale.y` mở dần theo `crackK` | `crack({len,w,seed})` — `src/props.js:131` |
| `flow` (dòng nước rót) | Nước từ miệng bát xuống dải giấy thử (c33) | Vừa | `update(t, amt)` — dòng chảy chỉ tồn tại khi tay rót | `flow(from, to, {size,n,rate})` của rig — `src/set.js` (dòng nước từ bát xuống dải giấy) |
| Nhóm hydroxyl (hạt trắng trên sợi) | Chỗ gắn nguyên tử hydro, mọc **hai bên** sợi (c10, c17) | Cận | Theo `setSwell` của sợi | là các hạt trong `fibre()` — `src/props.js:194–202` |

## Nhóm 3 — Set & Environment (bối cảnh)

| Tên linh kiện | Vai trò & xuất hiện ở shot | Cự ly | Trạng thái động | Hàm dựng |
|---|---|---|---|---|
| `buildKitchen` | **N1** quầy bếp buổi sáng: quầy gỗ, tường gạch, cửa sổ có song, hai tờ giấy, bát nước, khăn (c1–c8, c42, c43) | Vừa | Tĩnh; riêng hai tờ giấy và tay thì diễn | `buildKitchen(scene)` — `src/set.js:33` (dùng `kitchen()` của rig) |
| `buildInside` | **N2** bên trong tờ giấy: khối giấy phía sau, mạng sợi nền, ba sợi tiền cảnh, móc nối, phân tử nước, vệt nứt (c9–c23) | Cận | Móc đổi màu, sợi trượt, vệt nứt lan | `buildInside(scene)` — `src/set.js:87` |
| `buildDesk` | **N3** bàn làm việc ban đêm: bàn gỗ, tường xanh, đèn bàn, bộ kẹp, giá, lực kế, đồng hồ độ ẩm, bát nước, mẻ khăn, túi giấy bao bì, góc giấy khăn bị cắt, tờ đã sấy (c24–c41) | Vừa | Kim đồng hồ chạy, dải giấy giãn và đứt, giấy nhăn | `buildDesk(scene)` — `src/set.js:225` (dùng `desk()` của rig) |
| `droplets` | Giọt nước bám trên mu bàn tay ướt (c1–c2) | Cận | Tĩnh | `droplets(hand, n, seed)` — `src/set.js:341` |

## Nhóm 4 — FX & Lighting (đèn và hiệu ứng)

| Tên linh kiện | Vai trò & xuất hiện ở shot | Cự ly | Trạng thái động | Hàm dựng |
|---|---|---|---|---|
| Đèn chính qua cửa sổ | N1: vệt nắng rơi trên quầy; N2: sợi sáng và bóng sợi; N3: ánh sáng lạnh của đêm | Vừa | Độ sáng đổi theo `update(t, {light})` | `keyLight()` của rig — gọi trong `buildKitchen`/`buildInside`; `desk()` của rig cho N3 |
| Vệt sáng phụ ở quầy | N1: mặt trước của hai tờ không chìm trong bóng của thành quầy | Vừa | Tĩnh | `pool()` — `src/set.js` (vệt sáng phụ) |
| Đèn bàn của bàn đo | N3: nguồn sáng chính của cả bàn đo | Vừa | Tĩnh | `desk()` của rig (đèn bàn có sẵn) |
| Ánh sáng môi trường | Cả ba nơi: đều cần nền tối nhưng không để chìm hẳn | Nền | `update()` của rig đổi theo `light` | `ambience()` của rig |
| Thẻ chữ (nhãn) | Tám thẻ: xem bảng nhãn trong `LOOK.md` | Cận | Bật/tắt theo câu, bám vào vật | `const CARDS = [...]` — `src/film.js:49`, vẽ bằng `label()` của rig |
| Vệt nứt lan, sợi trượt, móc đổi màu, dòng nước | Cơ chế của N2 và N3 (xem Nhóm 2) | Cận | Theo keyframe trong `src/acts.js` | `applyState(id, t)` — `src/acts.js:85` |

## Bảng nhát và bảng đặc tả phải khớp

Mỗi nhát trong `src/shots.js` gọi đúng một câu của `voice/lines.json` (43 nhát, 43 câu), và
mỗi câu có đúng một nhát ✓. Mỗi dòng trong `LOOK.md` có câu của nó trích nguyên văn ✓
(`tools/check_storyboard.py` kiểm điều này).
