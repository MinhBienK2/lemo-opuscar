# COMPONENTS_SPEC — Vì sao trời có biến màu?

Bóc tách linh kiện 3D của tập, đối chiếu với `voice/lines.json` (37 câu) và `LOOK.md` (37 nhát). Mọi vật có thật
đều nằm ở `src/props/<mã>.js` (mỗi vật một tệp, `src/props.js` là file sinh tự động); bối cảnh nằm ở
`src/set-*.js`; chuyển động theo thời gian nằm ở `src/film.js`.

Quy ước: **Cự ly** = cự ly máy thấy vật (`C` cận cảnh / `M` trung cảnh / `B` hậu cảnh). **Trạng thái** = `Tĩnh` /
`Động` (có gắn với câu nào trong `voice/lines.json`).

Bảy nơi chốn: **N1D** sân thượng nhà, chiều muộn (c01–c03) · **N2** trong không khí, ban ngày (c04–c13) ·
**N3** trong không khí, chiều muộn, nhìn ngược dọc theo tia (c14–c19) · **N1R** sân thượng, Mặt Trời sát chân
trời (c20–c24) · **N5** sát chân trời (c25–c27) · **N4** từ không gian, quanh Trái Đất (c28–c34) ·
**N6** sân thượng, xế chiều (c35–c37).

---

## Nhóm 1 — Props (vật thật & thứ vô hình đã thành hình)

| Thành phần | `PROP.name` | Vai & shot | Cự ly | Trạng thái động | Hàm dự kiến |
|---|---|---|---|---|---|
| **Lan can sắt có nan** — bệ chân, tay vịn, hai nan ngang, nan dọc, ba trụ có nắp tròn; đường viền mực của nan là thứ đọc ra "lan can", không phải một thanh trơn | lan can sắt có nan | mép sân thượng: đường chân trời của cả tập; tờ giấy nằm trên tay vịn; c20–c24 có lan can thành bóng ở đáy khung | C/M/B | Tĩnh | `lanCanSat({width:11})` — `lan-can-sat.js` |
| **Tờ giấy trắng vắt trên lan can** — một đoạn nằm trên mặt trên thanh tay vịn, một đuôi rủ xuống phía trước, một đuôi thú ra sau; bóng của nó đổ lên thanh (không lơ lửng) | tờ giấy trắng vắt trên lan can | bằng chứng cụ thể của câu chốt: trắng ở c02, xanh nhạt ở c36–c37 | C | Động: màu giấy đổi theo giờ (`H.paper`), gió nhẹ | `toGiayTrang({color})` — `to-giay-trang.js` |
| **Nhà thang có cửa sổ và cửa cổng** — tường vữa có vệt sơn chân tường, lỗ cửa sổ có kính và bệ cửa, cửa cổng ở mặt phải, mái tôn sóng nghiêng, ống nước | nhà thang có cửa sổ và cửa cổng | góc trái sân thượng; mặt tường là một trong ba mặt phẳng nhuốm cam ở c22 | M/B | Tĩnh | `nhaThang({...})` — `nha-thang.js` |
| **Thùng nước có nắp tháo, thang leo và vòi** — thân thùng mở miệng, vành miệng, mặt nước bên trong, nắp đặt cạnh, bản lề, thang leo bám vào thân, vòi có tay nắm đỏ | thùng nước có nắp tháo, thang leo và vòi | góc phải; mặt nước là mặt phẳng thứ ba nhuốm cam ở c22; ở N6 mặt nước là một mảng tối lấp lánh nhẹ, không sáng hơn dải chân trời | M/B | Động: mặt nước xoay nhẹ, lấp lánh chậm | `thungNuoc({water,night,red})` — `thung-nuoc.js` |
| **Cây chuối có chùm quả** — thân có vết lá, chín lá cong xanh, hai lá già vàng ốt, một chùm chuối (một cuộng, hai hàng quả) | cây chuối có chùm quả | góc trái sân thượng; tạo chiều sâu và bóng cho các khung rộng (c01, c21, c35, c37) | M/B | Tĩnh | `cayChuoi()` — `cay-chuoi.js` |
| **Chùm sáng ngang của Mặt Trời** — lõi sáng + vỏ sáng mềm quanh, cả hai đều mờ dần ở hai đầu; là ánh sáng nên không có viền mực | chùm sáng ngang của Mặt Trời | N2: c04–c05, chùm đi ngang qua lớp hạt nhỏ | M/B | Tĩnh (bật/tắt theo `side` của câu) | `chumSangNgang({a:-16,b:28})` — `chum-sang-ngang.js` |
| **Hạt không khí** — 260 cầu nhỏ có mặt và có nét mực (không phải chấm sáng: chấm sáng trên nền trời đọc ra là sao); màu cố định, không tự phát sáng; hạt ở xa to lên theo khoảng cách | hạt không khí | N2: c04–c05; ở c10–c11 bỏ hẳn (hạt nhỏ lơ lửng trên nền trời đọc ra là chấm sao) | M/B | Động: lơ lửng, tắt ở chế độ `'few'` | `hatKhongKhi({rnd})` — `hat-khong-khi.js` |
| **Hạt rực lên sát chùm sáng** — 48 cầu toon phát sáng, nằm NGAY TRÊN mặt chùm (nằm bên trong thì lõi trắng che mất hạt) | hạt rực lên sát chùm sáng | N2: c06, cận hai hạt vừa rực lên | C/M | Động: `update(t, hot)` tắt dần khi câu không nói về hạt sáng | `hatRucSang({rnd})` — `hat-ruc-sang.js` |
| **Dải sóng ánh sáng** — quả cầu là hạt + một dải sóng uốn; bản xanh uốn chín lần, bản đỏ uốn một lần (đếm được bằng mắt) | dải sóng ánh sáng | N2: c08–c09; hai bản đứng cạnh nhau ở `(-.42,.26,0)` và `(.42,.26,0)` | C | Động: bật/tắt theo câu (`waves`) | `daiSongAnhSang({waves,amp,len,thick,color})` — `dai-song-anh-sang.js` |
| **Dòng sáng bị rẽ** — sợi mảnh có nét mực, luôn BÁM vào một hạt trắng vừa rực lên; có cả dòng bay về phía máy và mười bốn dòng từ mọi hướng hội tụ về một tâm | dòng sáng bị rẽ | N2: c06–c07 (hai dòng rẽ + dòng về máy), c10–c11 (mười bốn dòng từ mọi hướng) | C/M/B | Động: bật/tắt theo nhóm (`rays`, `toCam`, `all`) | `dongSangRe({fan:14})` — `dong-sang-re.js` |
| **Chùm sáng đi thẳng tới mắt** — ống rỗng: hai mép sáng có viền mực, giữa ống mờ hơn; không dùng một khối trắng (khối trắng đọc ra là mặt trời) | chùm sáng đi thẳng tới mắt | N2: c07 (đứng giữa), c12 (đi thẳng vào mắt ta), c13 (nhìn dọc theo chùm, bật thân sáng) | C/M | Động: miệng ống đặt lại theo tầm xa của câu (`straightZ`, `straightScale`), thân sáng bật ở c13 | `chumSangTrucTiep({r:.50,len:18,tubeR:.042})` — `chum-sang-truc-tiep.js` |
| **Thước đo quãng** — dải thép mỏng có 39 vạch khắc (không chữ số), một vỏ cuộn tròn ở cuối, móc thép ở đầu kia, một con trượt đỏ đang chỉ vị trí đang đo, hai sợi dây treo | thước đo quãng | N3: c15, con số "gần 38 lần" phải bám vào vật đếm | C | Động: dải lắc rất nhẹ | `thuocDoQuang({len:12,cursorX:0,wire:4.2})` — `thuoc-do-quang.js` |
| **Đồng hồ đo phần trăm** — mặt tròn có vòng hai mươi chấm (mỗi chấm 1,25 %), các chấm đã đếm được sáng lên, kim chỉ đứng đúng ở chấm cuối, một mảng cung màu, dây treo; hai bản giống hệt để đối chiếu | đồng hồ đo phần trăm | N3: c18 (xanh còn 2,5 %), c19 (đỏ còn 15 %) | C | Tĩnh (số đo đổi theo câu) | `dongHoDoPhanTram({center,percent,color,wire,face})` — `dong-ho-do-phan-tram.js` |
| **Trái Đất** — quả cầu có lục địa, ranh giới ngày/đêm rõ, mặt đêm có đèn thành phố, dải hoàng hôn cam mỏng, nét mực ở mép cầu | Trái Đất | N4: c28–c34, hành tinh quay chậm, Mặt Trời lặn dần | B/M | Động: quay (`t*.015`), đèn thành phố chỉ sáng ở bóng tối, vùng sáng hẹp dần theo độ lặn | `traiDat({camZ:6})` — `trai-dat.js` |
| **Hạt bụi mờ** — quầng sáng mềm méo có lõi sáng ở giữa, cạnh nó một hạt không khí nhỏ xíu sáng hơn | hạt bụi mờ | N5: c26 (so cỡ với hạt không khí), c27 (làm nhoè dải nhạt) | C/M | Động: sáng theo fov máy (cận thì sáng hơn cả dải), ở c26 nâng lên nền trời phẳng và phóng to | `hatBuiMo({at,size,tex,tiny,tinyAt})` — `hat-bui-mo.js` |

---

## Nhóm 2 — Bộ phận & cơ chế (ruột của từng vật)

| Thành phần | `PROP.name` | Vai & shot | Cự ly | Trạng thái động | Cách dựng |
|---|---|---|---|---|---|
| **Vạch khắc trên dải thước** — 39 vạch, mỗi vạch thứ năm màu đỏ; không chữ số | thước đo quãng | N3: c15, vạch là thứ đếm được | C | Tĩnh (vẽ trong canvas 2048×96, seed 41) | `steelTex` — `thuoc-do-quang.js` |
| **Vòng hai mươi chấm trên mặt đồng hồ** + mảng cung màu từ 0 % tới kim | đồng hồ đo phần trăm | N3: c18–c19, chấm đã đếm sáng, chấm chưa tắt | C | Tĩnh theo `percent` | `dongHoDoPhanTram()` — `dong-ho-do-phan-tram.js` |
| **Mười bốn lớp hạt không khí ở N3** — mỗi lớp là một MẶT PHẲNG vuông góc tia (vòng hạt trên mặt + một tấm sương mỏng mép sáng hơn); lớp xa đông hạt hơn và hạt phải nhỏ dần, nếu không lớp đông gộp thành một vệt bông | — | N3: c16, "cứ mỗi lớp dày thêm một chút" | M/B | Động: hạt trôi nhẹ, tấm sương tắt ở câu về dải (`sheetAlpha`) | `layers` / `layerDots` / `layerSheets` — `set-tiado.js` |
| **Bảy tia bị bẻ sang bên ở N3** — mỗi tia một ống màu chạy theo tổng đường đi (bẻ sớm còn xanh, bẻ muộn đã đỏ), chỗ bẻ có một hạt sáng lóa | — | N3: c17, màu của chùm phải đổi dọc theo tia | M | Động: thở nhẹ (`uA`), ẩn ở câu về lớp hạt | `bentRays` + `bentRamp()` — `set-tiado.js` |
| **Vùng sáng xanh chỉ kéo dài khi Mặt Trời lặn chưa quá xa** — độ mở của vùng xanh và dải hạt sáng quanh nó co lại theo độ lặn `dep` của Mặt Trời; lặn sâu thì vùng xanh tắt dần | c33, c34 | M/B | Động: theo `dep` | `uBlueK` / `uBlueT` / `blueGrain` — `set-khonggian.js` |
| **Dải sáng xanh vẽ thẳng lên mặt cầu** — một dải mờ ôm lấy ranh giới ngày/đêm lệch sang phía mặt đêm, có nhiễu ba chiều để có hạt; cộng 90 hạt sáng nhỏ rải quanh | Trái Đất | N4: c29, c32–c34 — "màu xanh lọt qua rọi xuống mặt đêm" | M/B | Động: hướng vùng sáng đổi theo hướng Mặt Trời (`uBlueT`, `uBlueK`) | `earthMat` + `blueGrain` — `trai-dat.js` / `set-khonggian.js` |
| **Quầng khí quyển và quầng ozon** — hai đĩa vuông góc với trục nhìn, sáng dày dần từ trong ra, đỉnh ở ngay ngoài mép hành tinh rồi tắt dần; KHÔNG dựng vỏ cầu fresnel (đọc ra là sợi tròn sáng) | — | N4: c30, hai thẻ chỉ vào hai lớp | M | Động: quay mặt về máy mỗi khung, độ sáng theo độ lặn | `corona()` — `set-khonggian.js` |
| **Đèn thành phố trên mặt đêm** — 150 chấm sáng đặt đúng chỗ đất | Trái Đất | N4: c28, c32 | B | Động: chỉ sáng ở phía quay lưng về Mặt Trời, lấp loei nhẹ | `city` / `cityPts` — `trai-dat.js` |
| **Thân chùm sáng cam đỏ ở N4** — một dải mềm chạy trên đường tiếp tuyến với Trái Đất, tới ranh giới ngày/đêm thì DỪNG, không sơn lên mặt đang có nắng | — | N4: c31 | M | Động: quay mặt về máy mỗi khung, độ đục theo `red` | `shaftBody()` — `set-khonggian.js` |
| **Mười bốn dòng sáng từ mọi hướng** — mỗi sợi xanh từ một vỏ cầu quanh tâm hội tụ về một tâm ở xa và cao | dòng sáng bị rẽ | N2: c10–c11, "từ mọi hướng" phải là một đám hội tụ, không phải một đám bông | M/B | Tĩnh (bật/tắt theo `all`) | `fan` — `dong-sang-re.js` |
| **Mảng cung màu và hai mươi chấm sáng** trên mặt đồng hồ | đồng hồ đo phần trăm | N3: c18–c19 | C | Tĩnh | `filled` / vòng chấm — `dong-ho-do-phan-tram.js` |
| **Lõi sáng của hạt bụi + hạt không khí nhỏ xíu đứng cạnh** — một chấm nhỏ ở giữa quầng bụi, một chấm sáng hơn nữa đứng cạnh hạt | hạt bụi mờ | N5: c26, hai cỡ phải so được trong một khung | C | Động: chỉ hiện ở c26 | `core` + `air` — `hat-bui-mo.js` |
| **Năm mươi sáu hạt bụi mờ to rải trong dải** + **hai trăm hai mươi hạt không khí nhỏ xíu** | hạt bụi mờ / hạt không khí | N5: c25, c27 — bụi làm dải nhoè đi nhưng phải NHẠT, đậm và ấm thì cả nửa trên khung thành một mảng hồng phẳng | M/B | Động: trôi nhẹ, bụi quay mặt về máy | `halos(56,…)` + `glowDots(220,…)` — `set-buimo.js` |
| **Bầu trời vẽ tay** — ảnh toàn cầu 3072×1536, dải màu theo độ cao, mặt trời đặt theo đúng công thức toạ độ cầu | — | mọi khung ngoài không gian | — | Tĩnh (đổi theo bối cảnh) | `skyTexture()` — `props/_common.js` |

---

## Nhóm 3 — Set & Environment (bối cảnh)

| Thành phần | Vai & shot | Cự ly | Trạng thái | Cách dựng |
|---|---|---|---|---|
| **N1D · sân thượng nhà, chiều muộn** — sàn gạch, lan can, nhà thang, thùng nước, cây chuối, hai vòng nhà làm đường chân trời; trời xanh phía trên, đỏ ở chân trời | c01–c03 | B/M | Động: giấy đổi màu theo giờ | `buildSanThuong()` — `set-santhuong.js` |
| **N2 · trong không khí, ban ngày** — trời xanh, sương mù xanh nhạt, một lớp hạt khí tụm quanh chùm sáng | c04–c13 | M/B | Động: bật/tắt từng nhóm vật theo câu | `buildKhongKhi()` — `set-khongkhi.js` |
| **N3 · trong không khí, chiều muộn, dọc theo tia** — trời tím ở trên, tia thẳng trắng ở gần và đỏ ở xa, mười bốn lớp hạt vuông góc tia | c14–c19 | M/B | Động: tia thở nhẹ, lớp hạt trôi | `buildTiaDo()` — `set-tiado.js` |
| **N1R · sân thượng, Mặt Trời sát chân trời** — cùng sân thượng nhưng nắng thấp đỏ rực, mọi vật nhuốm cam, bóng đổ dài | c20–c24 | B/M | Động: giấy, mặt nước, mặt tường đổi màu theo nắng | `buildSanThuong()` với chế độ đỏ — `set-santhuong.js` |
| **Phần trời cao vẫn còn xanh khi chân trời đã đỏ** — dải màu của bầu trời ở chế độ đỏ vẫn giữ xanh ở trên (90° `#16306f`, 24° `#2f5fc0`) và chuyển sang cam ở dưới (2,6° `#ff7a33`); trời KHÔNG đổi hết một lúc | c23 | B | Tĩnh (theo chế độ đỏ) | `DUSK_STOPS` — `set-santhuong.js` |
| **N5 · sát chân trời** — vòm trời gradient không mép, ba vỏ trụ lồng nhau làm dải nhạt có chiều sâu, hạt bụi lấp lánh trong dải | c25–c27 | C/M/B | Động: hạt trôi, bụi quay mặt về máy | `buildBuiMo()` — `set-buimo.js` |
| **N4 · từ không gian, quanh Trái Đất** — nền đen, 2600 sao nhỏ rời nhau, Trái Đất, hai quầng khí quyển/ozon, vùng sáng, thân chùm sáng | c28–c34 | B/M | Động: Mặt Trời lặn dần theo `dep` | `buildKhongGian()` — `set-khonggian.js` |
| **N6 · sân thượng, xế chiều** — cùng sân thượng, trời đã chuyển sang dải xanh tím, tờ giấy xanh nhạt, mặt nước là mảng tối lấp lánh nhẹ | c35–c37 | B/M/C | Động: giấy xanh nhạt, bầu trời là chỗ sáng nhất của khung | `buildSanThuong()` với chế độ đêm — `set-santhuong.js` |

---

## Nhóm 4 — FX & Lighting

| Thành phần | Vai & shot | Trạng thái | Cách dựng |
|---|---|---|---|
| **Đèn chính** — mỗi bối cảnh một hướng: nắng chiều xiên (N1), nắng trắng (N2), nắng thấp đỏ (N3), nắng từ phía Mặt Trời (N4), nắng ấm ngang (N5) | mọi khung | Động: cường độ theo câu | `keyLight()` — `rig/lights.js` |
| **Đèn lấp và viền sáng** — trời làm đèn lấp, viền lạnh tách vật khỏi nền | mọi khung | Tĩnh | `ambience()` — `rig/lights.js` |
| **Viền mực vẽ tay** — mọi vật lớp 0 được viền mực; thứ chỉ là ánh sáng (chùm, dòng sáng, dải sóng) nằm ở lớp fx nên KHÔNG có viền | mọi khung | Tĩnh | `film()` của `rig/render.js` + `fxLayer()` |
| **Bloom và hạt phim** | mọi khung | Tĩnh | `rig/render.js` |
| **Thẻ chỉ (nhãn)** — mũi tên luôn chạm vào đúng vật: dải sóng ngắn (c09), thước đo quãng (c15), chấm xanh và chấm đỏ trên hai đồng hồ (c18, c19), hai quầng khí quyển và ozon (c30), vệt sáng chạy vòng (c34) | c09, c15, c18, c19, c30, c34 | Tĩnh | `src/film.js` |

---

## Đặt cây trong scene (toạ độ thế giới)

| Vật | Toạ độ / tham số | Ghi chú |
|---|---|---|
| Lan can sắt | `(0, 0, -3.90)`, rộng 11.0 | mép sân thượng, chạy ngang |
| Tờ giấy trắng | `(0.38, 0, -3.90)` | nằm trên tay vịn, ở tâm khung cận cảnh c36 |
| Nhà thang | `(-3.05, 0, -1.55)` | góc trái; lỗ cửa sổ ở `HOUSE_WIN = {x:.55, y:1.62, w:.92, h:.78}` (toạ độ cục bộ) |
| Thùng nước | `(2.25, 0, -0.85)` | góc phải, bốn chân cao `.36` |
| Cây chuối | `(-1.95, 0, -3.35)` | sát lan can, bên trái |
| Chùm sáng ngang | x từ `-16` đến `+28`, trục nằm theo X | lõi `.030` / vỏ `.135` |
| Hạt rực lên | x trong `(-5.5, +5.5)`, y trong `±(.075…105)`, z trong `±.05` | nằm ngay trên mặt chùm |
| Dải sóng (xanh) | `(-.42, .26, 0)`, 9 lần, biên độ `.024` | quả cầu của hạt ở cùng chỗ |
| Dải sóng (đỏ) | `(.42, .26, 0)`, 1 lần, biên độ `.045` | quả cầu của hạt ở cùng chỗ |
| Hạt neo dòng rẽ | `(-.95, .11, .05)` và `(.95, .11, .05)` | dòng chạy CHÉO sang bên, không vút lên cao |
| Hạt neo dòng về máy | `(0, .10, .06)` | dòng dừng ở `z = 1.15` |
| Tâm mười bốn dòng | `(0, 3.20, -7.0)` | sợi đi trên vỏ cầu quanh tâm |
| Thước đo quãng | `(-8.0, 1.45, .55)`, dài 12 | con trượt đỏ ở `x = -8.0` (tức ngay dưới thẻ "GẦN 38 LẦN") |
| Đồng hồ xanh | tâm `(-7.00, 1.07, .60)`, 2,5 % | mũi kim rơi đúng chấm đang đọc |
| Đồng hồ đỏ | tâm `(-6.96, -.83, .60)`, 15 % | cùng cách đo với đồng hồ xanh |
| Hạt bụi chính | `(.15, 3.00, .10)`; ở c26 nâng lên `(0, 3.62, 0)` | quay mặt về máy mỗi khung |
| Hạt không khí nhỏ cạnh hạt bụi | `(.165, 3.655, -.018)` | chỉ hiện ở c26 |
| Trái Đất | gốc tại `(0, 0, 0)`, bán kính 1 | hướng tới Mặt Trời `(-.8055, .4941, .3271)` |

---

## Không dựng (có lý do)

- **Sao ở N2** — ở câu ngước lên (c10–c11) bỏ hẳn hạt không khí: một chấm sáng nhỏ lơ lửng trên nền trời đọc ra là sao, đúng thứ mà câu ấy không cần.
- **Mặt trời như một khối trắng** — chùm đi thẳng dựng bằng hai mép sáng và một vỏ mờ, không dùng một khối trắng: khối trắng đọc ra là mặt trời, không phải một chùm sáng.
- **Chùm sáng có viền mực** — chùm là ánh sáng nên nó nằm ở lớp fx; một ống toon đặc có mép mực cứng đọc ra là que gỗ.
- **Vỏ cầu fresnel cho lớp khí quyển/ozon** — fresnel sáng đúng ở mép cầu nên đọc ra là một sợi tròn sáng, vành của một vật khác; dùng hai quầng đĩa mờ dần thay thế.
- **Dải ozon ở xích đạo** — lớp ozon là một lớp quanh cả hành tinh; vẽ thêm dải tím ở xích đạo thì nó cắt ngang lục địa và đọc ra là một mảnh băng dán trên mặt Trái Đất.
- **Ô hình chữ nhật cho sa mạc** — vùng sa mạc phải phai mềm vào màu đất, cắt thẳng theo khung lon/lat thì trên quả cầu thành một mảng cát vuông.
- **Bụi đậm và ấm ở N5** — hạt bụi đậm và ấm làm cả nửa trên khung thành một mảng hồng phẳng, mất hẳn màu xanh của bầu trời ban ngày.
