# Danh mục rig (sinh tự động: `sh channels/tram-nghi-nhieu/rig/catalog/build.sh`, đừng sửa tay)

Nhìn ảnh trước khi chọn: `props-*.jpg` (vật vẽ bằng code, mọi trạng thái), `people-*.jpg` (người: nghề, tay, mặt, dáng),
`assets-*.jpg` (hình có sẵn từ Fluent Emoji Flat, MIT). Thiếu vật nào thì thêm vào `rig/props.js` (cùng khuôn: look, states,
params, anchors) rồi dựng lại danh mục; thiếu hình nào có trong Fluent thì `python3 rig/assets/fetch.py add "<Name>"`.

## Vật — `prop(g, id, { x, y, s, state, from, k, t, … })` · 29 vật · board: `"draw": "rig:<id>"`

| id | tên | kích thước (cm) | trạng thái | tham số | điểm neo |
|---|---|---|---|---|---|
| `phone` | điện thoại — điện thoại thông minh dáng dọc, thân đen bo góc, viền mỏng, màn hình gần kín mặt trước, cổng sạc ở cạnh đáy; mặt lưng có cụm camera vuông ở góc trên | 8 × 15 | off, on, charging, hot | `face` front \| back \| flat (nằm ngang, nhìn từ bên); `level` mức pin 0–1, hiện ở đầu màn hình; `screen` độ sáng 0–1; `bolt` biểu tượng đang sạc 0–1 | plug (cổng sạc), screen, top |
| `charger` | củ sạc — củ sạc trắng hình khối vuông nhỏ, góc bo tròn, mặt trước có một cổng USB-C đen nằm ngang và một đèn tín hiệu nhỏ | 5 × 7 | cool, on, hot | `led` đèn 0–1 | port (cổng cắm dây), top |
| `socket` | ổ cắm điện trên tường — mặt ổ cắm điện trên tường, tấm nhựa trắng ngà chữ nhật đứng, hai lỗ cắm tròn kiểu Việt Nam xếp ngang; khi có củ sạc thì củ sạc trắng cắm đè lên nửa dưới | 10 × 15 | empty, plugged | `plugged` có củ sạc cắm vào 0/1 | port (cổng của củ sạc), holes |
| `pillow` | gối — gối ngủ trắng ngà, dài gấp ba lần cao, hai đầu phồng tròn, giữa hơi lõm, có đường may viền quanh mép và vài nếp nhăn ở hai đầu | 60 × 17 | flat, pressed, hiding | `press` lõm giữa 0–1 (đầu người đè); `bump` vật gồ lên dưới mép phải 0–1; `col` màu vỏ gối | top, under (chỗ giấu vật ở mép phải) |
| `bed` | giường — giường đôi gỗ nâu nhìn ngang, đầu giường cao bên trái, nệm trắng dày, chăn xanh lam phủ hai phần ba bên phải có nếp gấp, chân giường ngắn | 203 × 92 | made, open | `blanket` chăn phủ bao nhiêu chiều dài 0–1; `wood` màu gỗ; `sheet` màu chăn | mattress (mặt nệm), head (chỗ đặt gối), foot |
| `nightstand` | tủ đầu giường — tủ đầu giường gỗ nâu sáng thấp, mặt trên phẳng có cạnh dày, một ngăn kéo có núm tròn, khoang để đồ hở bên dưới, bốn chân ngắn | 46 × 56 | closed, open | `open` ngăn kéo kéo ra 0–1; `wood` màu gỗ | top (mặt tủ), drawer |
| `table` | bàn — bàn gỗ chữ nhật nhìn chính diện, mặt bàn dày có cạnh sáng hơn, gầm có thanh ngang, hai chân thẳng vuông ở hai đầu | 121 × 76 | normal | `wood` màu gỗ; `w` bề rộng (mặc định 370) | top (giữa mặt bàn), left, right |
| `schooldesk` | bàn học sinh — bàn học sinh hai chỗ kiểu trường Việt Nam, mặt gỗ vàng nâu, khung chân sắt sơn xanh, tấm chắn gỗ phía trước gầm, ngăn để cặp dưới mặt bàn; có thể kèm ghế băng dài phía trước | 121 × 72 | normal, bench | `bench` có ghế băng phía trước 0/1 | top, seat (mặt ghế băng) |
| `chair` | ghế — ghế tựa gỗ nhìn chính diện, lưng tựa cao có hai thanh ngang, mặt ngồi vuông, bốn chân thẳng | 46 × 92 | normal | `wood` màu gỗ | seat, back |
| `wardrobe` | tủ quần áo — tủ quần áo gỗ hai cánh cao gần trần, đỉnh có gờ, hai tay nắm dọc ở giữa, chân đế thấp; mở cánh trái thấy bên trong tối với thanh treo và vài chiếc áo màu | 101 × 193 | closed, open | `open` cánh trái mở 0–1; `wood` màu gỗ | top, inside (giữa khoang) |
| `fridge` | tủ lạnh — tủ lạnh hai ngăn màu trắng kem, ngăn đá nhỏ ở trên, ngăn mát lớn ở dưới, tay nắm dọc màu bạc bên phải; mở cửa thấy đèn vàng bên trong và ba tầng kệ có hộp và chai | 62 × 163 | closed, open | `open` cửa ngăn mát mở 0–1 | top, inside |
| `stove` | bếp ga — bếp ga đôi đặt trên bàn, thân kim loại đen viền bạc, hai kiềng đen ở trên, hai núm vặn tròn ở mặt trước; khi bật có vòng lửa xanh dưới kiềng | 72 × 20 | off, on, low | `flame` cỡ lửa 0–1 | left, right (đỉnh kiềng để đặt nồi) |
| `kettle` | ấm đun nước — ấm đun nước inox tròn bầu, vòi cong ngắn bên phải, quai cầm đen trên đỉnh, nắp tròn có núm; khi sôi hơi nước bốc từ vòi | 26 × 24 | cold, boiling | `steam` hơi bốc 0–1 | spout (đầu vòi), top |
| `cup` | ly / cốc — cốc thủy tinh trong suốt hình trụ hơi loe miệng, thấy mực nước bên trong; khi nóng có hơi bốc lên | 9 × 11 | empty, full, hot | `fill` mực nước 0–1; `liquid` màu nước (mặc định nước lọc); `steam` hơi 0–1 | top, rim |
| `laptop` | máy tính xách tay — máy tính xách tay xám bạc nhìn chính diện, màn hình đứng thẳng viền đen có camera nhỏ, đế bàn phím mỏng phía dưới; màn hình bật thì sáng xanh có vài dòng chữ | 36 × 24 | closed, off, on | `open` mở nắp 0–1; `screen` màn sáng 0–1 | screen, top |
| `lamp` | đèn bàn — đèn bàn kim loại, đế tròn dẹt, cần gập hai khúc, chao đèn hình nón hướng xuống phía trước; khi bật có quầng sáng vàng hình nón dưới chao | 29 × 49 | off, on | `on` đèn bật 0–1; `col` màu chao | bulb, pool (chỗ ánh sáng rơi xuống) |
| `clock` | đồng hồ treo tường — đồng hồ treo tường tròn, viền đen dày, mặt trắng có mười hai vạch giờ, kim giờ ngắn kim phút dài màu đen và kim giây đỏ mảnh | 30 × 30 | normal | `time` giờ dạng số, 23.5 = 23:30; `run` tốc độ quay theo t (giờ mỗi giây phim; 0 = đứng) | center |
| `books` | sách — chồng sách bìa cứng nằm ngang nhiều màu, gáy có một dải màu sáng, các cuốn lệch nhau một chút | 26 × 23 | normal | `n` số cuốn (mặc định 3) | top |
| `backpack` | ba lô — ba lô học sinh vải dày, thân bo tròn, túi trước có khoá kéo, hai quai đeo vai, quai xách nhỏ trên đỉnh | 33 × 46 | normal | `col` màu vải | top, strap |
| `window` | cửa sổ — cửa sổ khung gỗ hai cánh kính, song ngang ở giữa, bậu cửa nhô ra dưới đáy; bên ngoài là trời theo giờ (ngày xanh, chiều cam, đêm có trăng và sao), có thể có mưa chảy trên kính | 101 × 121 | day, dusk, night | `night` đêm 0–1; `dusk` chiều 0–1; `rain` mưa 0–1 | center, sill |
| `door` | cửa ra vào — cửa gỗ một cánh có khung, cánh cửa có hai ô chìm, tay nắm tròn bên phải; mở ra thì cánh hẹp lại và lộ khoảng tối hoặc ánh sáng phía sau | 92 × 203 | closed, open | `open` mở 0–1; `beyond` màu phía sau cửa (mặc định tối) | center, handle |
| `fan` | quạt đứng — quạt đứng gia đình, đế tròn, thân trụ có nút bấm, lồng quạt tròn bằng nan sắt, ba cánh nhựa xanh nhạt quay bên trong | 59 × 124 | off, on | `speed` tốc độ quay 0–1 | center |
| `motorbike` | xe máy — xe tay ga nhìn ngang hướng sang phải, thân nhựa màu đỏ đô bo tròn, yên đen dài, sàn để chân phẳng, ghi đông có gương, đèn pha tròn phía trước, hai bánh nhỏ vành bạc | 190 × 111 | parked, riding | `roll` quãng đường đã chạy (px) — bánh quay theo; `light` đèn pha 0–1; `col` màu thân | seat, handle, rear (chỗ người thứ hai ngồi) |
| `plant` | chậu cây — chậu cây xanh trong nhà, chậu đất nung màu cam hình côn, năm sáu chiếc lá to bầu dục mọc toả lên, lá đung đưa nhẹ | 39 × 62 | normal |  | top |
| `bottle` | chai nước — chai nước nhựa trong suốt, thân trụ có nhãn xanh quấn quanh giữa, cổ thắt, nắp xanh đậm; thấy mực nước bên trong | 8 × 26 | full, half, empty | `fill` mực nước 0–1 | top |
| `tv` | tivi — tivi màn hình phẳng viền đen mỏng đặt trên chân đế hình chữ V ngắn; bật thì màn hình sáng màu, có thể hiện hình bất kỳ | 105 × 72 | off, on | `screen` màn sáng 0–1; `tint` màu chủ đạo của hình | screen (giữa màn), box |
| `thermometer` | nhiệt kế — nhiệt kế thủy tinh đứng, ống mảnh có vạch chia, bầu tròn đỏ ở đáy, cột đỏ dâng lên theo nhiệt độ | 13 × 65 | cold, warm, hot | `level` cột đỏ 0–1 | tip (đỉnh cột đỏ), bulb |
| `box` | thùng carton — thùng carton nâu nhìn chính diện, băng keo dán dọc giữa nắp, nắp gồm hai vạt; mở ra thì hai vạt bật lên hai bên | 65 × 49 | closed, open | `open` nắp mở 0–1 | top, inside |
| `money` | tiền giấy — tờ tiền giấy chung chung màu xanh lá nhạt, viền in đậm hơn, một ô tròn ở giữa và ký hiệu đồng ở hai góc; không giống tờ tiền thật nào | 49 × 23 | normal | `n` số tờ chồng lên nhau (mặc định 1); `col` màu tờ | top |

## Người — `extra(g, { look, E, armL, armR, at, sit, walk, lean, sweat, rot, talk, t })` · 17 kiểu

| look | áo | phụ kiện | mũ |
|---|---|---|---|
| `shopper` | #4F86C6 / #2E3A55 |  |  |
| `researcher` | #F4F1EA / #3B4466 | glasses |  |
| `participant` | #6BAA75 / #2A2F45 |  |  |
| `seller` | #D8574A / #33313B | apron |  |
| `elder` | #8A6E9E / #3A3A44 | glasses |  |
| `student` | #F2A541 / #2D3A5A |  | cap |
| `office` | #5C6B8A / #262B3A | lanyard |  |
| `doctor` | #FFFFFF / #4A5A7A | coat, stetho |  |
| `nurse` | #E6F1F7 / #E6F1F7 | badge | nurse |
| `police` | #6B7A45 / #5A673A | badge | police |
| `teacher` | #F7F4EE / #2E3A55 | glasses |  |
| `chef` | #FAFAF7 / #2A2A30 | apron | chef |
| `worker` | #3F5E8C / #2A3550 | vest | hard |
| `farmer` | #8A6A48 / #3A3A44 |  | nonla |
| `pupil` | #FAFAF7 / #2D3A5A | scarf |  |
| `shipper` | #E07A2E / #2A2F45 |  | helmet |
| `businessman` | #2E3550 / #2E3550 | tie |  |

Tay, nét mặt và dáng: xem chú thích đầu `rig/extras.js` và ảnh `people-*.jpg`.

## Hình có sẵn — `await loadAssets([...]); asset(g, id, { x, y, h, rot })`, `badge(g, id, { x, y, r })` · 159 hình · board: `"draw": "asset:fluent/<id>"`

Người trong bộ này chỉ là tượng bán thân: dùng làm biểu tượng, huy hiệu, mặt trong vòng tròn; người diễn là `extras.js`.

- **Objects**: `adhesive-bandage`, `backpack`, `bar-chart`, `basket`, `bathtub`, `battery`, `bed`, `bell`, `books`, `broom`, `bubbles`, `bucket`, `calendar`, `chair`, `chart-decreasing`, `chart-increasing`, `clipboard`, `coin`, `couch-and-lamp`, `credit-card`, `dna`, `dollar-banknote`, `door`, `electric-plug`, `envelope`, `gear`, `hammer`, `headphone`, `key`, `laptop`, `light-bulb`, `locked`, `low-battery`, `magnet`, `magnifying-glass-tilted-left`, `megaphone`, `mobile-phone`, `money-bag`, `package`, `pencil`, `pill`, `receipt`, `satellite-antenna`, `shopping-bags`, `shopping-cart`, `soap`, `speaker-high-volume`, `stethoscope`, `syringe`, `telephone`, `television`, `test-tube`, `toilet`, `toolbox`, `toothbrush`, `wastebasket`, `window`, `wrench`
- **Travel & Places**: `airplane`, `alarm-clock`, `ambulance`, `automobile`, `bicycle`, `bus`, `cloud`, `droplet`, `factory`, `fire`, `globe-showing-asia-australia`, `high-voltage`, `hospital`, `hot-springs`, `hourglass-done`, `hourglass-not-done`, `house`, `mantelpiece-clock`, `map-of-japan`, `motor-scooter`, `police-car`, `rocket`, `school`, `snowflake`, `stopwatch`, `sun`, `sun-behind-rain-cloud`, `thermometer`, `umbrella-with-rain-drops`
- **People & Body**: `anatomical-heart`, `baby`, `bone`, `brain`, `child`, `construction-worker`, `cook`, `ear`, `eye`, `factory-worker`, `farmer`, `firefighter`, `flexed-biceps`, `health-worker`, `judge`, `lungs`, `mechanic`, `nose`, `office-worker`, `old-man`, `old-woman`, `person`, `person-in-bed`, `person-taking-bath`, `police-officer`, `scientist`, `student`, `teacher`, `tooth`
- **Food & Drink**: `banana`, `bottle-with-popping-cork`, `bread`, `candy`, `cooked-rice`, `cooking`, `cup-with-straw`, `egg`, `fork-and-knife`, `glass-of-milk`, `hamburger`, `hot-beverage`, `ice`, `kitchen-knife`, `lollipop`, `red-apple`, `steaming-bowl`
- **Smileys & Emotion**: `bomb`, `collision`, `dashing-away`, `hundred-points`, `robot`, `speech-balloon`, `sweat-droplets`, `thought-balloon`, `zzz`
- **Animals & Nature**: `cat`, `cockroach`, `deciduous-tree`, `dog`, `fly`, `microbe`, `mosquito`, `potted-plant`, `rat`, `seedling`
- **Symbols**: `check-mark-button`, `cross-mark`, `mobile-phone-off`, `recycling-symbol`, `red-question-mark`, `warning`
- **Activities**: `video-game`

Fluent Emoji © Microsoft Corporation, MIT (`rig/assets/fluent/LICENSE`).
