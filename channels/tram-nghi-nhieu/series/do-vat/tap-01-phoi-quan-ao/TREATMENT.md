# TREATMENT — Vì sao phơi quần áo cần gió?

Kênh / channel: **tram-nghi-nhieu** · Tập / episode: `series/do-vat/tap-01-phoi-quan-ao` · Phim / movie: `tram-nghi-nhieu-series-do-vat-tap-01-phoi-quan-ao.mp4`

## Độ dài

- **25 dòng ý (24 dòng của câu trả lời + 1 dòng lời khuyên) · 60 câu lời trong `voice/lines.json` (60 dòng, mỗi dòng đúng một câu, 4–20 từ) · 635 từ, giọng đã thu dài **2 giây 33** (153,2 s đo từ `voice/proc/dur.json`), cộng 20,2 giây nghỉ giữa các câu ≈ 2 giây 53 lời kể** (giọng `vi-VN-NamMinhNeural`, rate +5%, pitch −8 Hz; giọng đọc nhanh hơn nhiều so với ước lượng 160 từ/phút ban đầu).
- **Phim dài 2:56 theo shot list**: 26 nhát, mỗi nhát 2–11 giây. Nhát dài nhất là nhát thí nghiệm trong phòng kín (10,6 giây, ba câu, 36 từ); nhát ngắn nhất là nhát “gió không sấy nước / gió chở hơi nước đi” (2,4 giây, hai câu cắt ngắn, 8 từ). Mọi mốc thời gian trong shot list lấy từ giọng đã thu, không ước lượng.
- **Vì sao không ngắn hơn:** câu hỏi có ba tầng cơ chế nối nhau — nước phải bay hơi (mất năng lượng), hơi nước phải có chỗ trống để thoát (lớp khí ẩm), và gió phải chở lớp ẩm đi. Bỏ tầng nào là mất một mắt xích: bỏ "mất năng lượng" thì thành "gió làm khô", bỏ "lớp khí ẩm" thì gió thành vô duyên.
- **Vì sao không dài hơn:** những gì đã cố ý để ngoài — công thức tra cứu (Magnus, Penman–Monteith, Sherwood), phân tử theo Maxwell–Boltzmann, cơ chế mùi ẩm mốc, và mọi biến thể phơi (nắng/shade, máy sấy). Phim chỉ giữ những gì người xem cần để hiểu vì sao gió là cần thiết.
- Người dùng không nêu độ dài; độ dài ra từ số tầng của câu trả lời.

## Câu hỏi, tách ra

- **Câu hỏi:** Vì sao phơi quần áo cần gió?
- **Chủ thể:** nước trên quần áo đang ướt · **Thay đổi:** rời khỏi vải và đi vào không khí (thành hơi nước) · **So với:** cùng cái áo ướt đó treo ở chỗ không có gió · **Vì:** không khí ngay sát vải nhanh chóng bị bão hoà hơi nước; gió làm thay lớp ẩm đó bằng không khí khô.
- **Câu trả lời một câu:** Quần áo khô đi vì nước trên vải phải hoá hơi thành hơi nước, và nước hoá hơi đều hơn khi lớp không khí đã ẩm ngay sát vải được gió cuốn đi — gió không sấy nước, gió chở hơi nước đi.

## Mở và kết

- **Khung mở:** hiên nhà buổi sáng, dây phơi kéo ngang khung, một chiếc áo phông còn ướt nhỏ nước xuống bồn chậu dưới đất, gió làm vải bay nhẹ. Người xem thấy ngay việc quen thuộc trong ba giây.
- **Kết:** quay lại hiện tượng ở hiên — quần áo trên dây đã khô, vải vẫn bay trong gió, cạnh đó **trên sàn** còn để một cái áo úp còn ẩm. Lời khuyên được nói thành lời ở dòng 25 (`c59`, `c60`) và cũng nằm ngay trong hình (cái áo úp còn ẩm). Góc nhìn mới: gió không làm nước biến mất, gió làm cho nước có chỗ để đi.

## Nơi chốn

| Nơi | Lớp của câu trả lời | Bộ có sẵn / tự dựng | Máy vào và ra thế nào |
|---|---|---|---|
| **N1 · Hiên phơi** | hiện tượng đời thường + các điều kiện quyết định tốc độ (nhiệt độ, độ ẩm, diện tích phơi) + lời khuyên | tự dựng (`src/set.js`): sàn gạch, lan can, tường, dây phơi, bồn chậu, nhiệt kế, ẩm kế, ghế, túi nylon buộc cọc | máy ở ngoài, quay ngang dây phơi; cuối tập quay lại đây |
| **N2 · Trong sợi vải** | nước nằm ở đâu và muốn rời vải thì phải đổi thành gì | tự dựng: các sợi đan, mảng nước trong khe, giọt nước trên sợi | máy đẩy thẳng vào tấm áo (đi xuyên không gian), ra bằng cách lùi ra |
| **N3 · Mặt nước** | vì sao nước bay hơi, và vì sao vải nguội | tự dựng: mặt nước, các phân tử rung, vài phân tử thoát ra | máy ở sát mặt nước, ngang mặt, rồi lùi ra |
| **N4 · Căn phòng kín** (tấm áo treo, quạt bàn, bàn thí nghiệm) | vì sao gió là cần thiết + các thí nghiệm đối chứng | tự dựng: phòng nhỏ, cửa đóng có ô kính, cửa sổ kín, bàn thí nghiệm, bàn thấp đặt quạt, ghế, quạt bàn, hai cái cân, hai mặt kính + vách ngăn | máy đẩy qua cửa từ N1 vào phòng, ra bằng cách lùi lại |

## Vật lên hình

> Mọi vật có thật sẽ lên hình, mỗi vật kèm các bộ phận làm nó nhận ra trong một giây. Tên ở cột đầu là tên trong `src/props.js`.

| Vật (và trạng thái) | Bộ phận đặc trưng | Từ rig hay tự dựng |
|---|---|---|
| Dây phơi (dây thừng chùng) + hai cọc | dây thừng xoắn, cọc gỗ có nắp | tự dựng |
| Kẹp quần áo (hai chiếc) | hai cánh gỗ, lò xo, khe kẹp | tự dựng |
| Áo phông (ướt → khô) | cổ áo, hai tay áo, mép vải, màu sẫm khi ướt | tự dựng |
| Quần (ướt → khô) | hai ống quần, cạp quần | tự dựng |
| Áo thun mỏng (ướt) | mỏng hơn áo phông, mép xẻ, dễ ẩm | tự dựng |
| Khăn tắm (ướt) | vân sợi, mép frê, dày hơn áo | tự dựng |
| Đàn áo phơi chồng | ba chiếc áo chồng lên nhau trên một dây thứ hai | tự dựng |
| Bồn chậu nhựa + nước | thành mỏng, vành, mặt nước | tự dựng |
| Quạt bàn (quay, có lưới), đặt trên bàn thấp | lưới, cánh quạt, chân đế, đầu quạt ngang tầm lớp hơi ẩm | tự dựng |
| Bàn thấp đặt quạt (trong phòng) | mặt bàn, chân, kệ giữa bàn | tự dựng |
| Túi nylon (buộc cọc ở hiên, treo trong phòng) | mỏng, gấp, gió đẩy; trong phòng nó nghiêng theo luồng gió của quạt | tự dựng |
| Cân nhà bếp × hai (kim lệch khác nhau) | mặt cân có đồng hồ kim, nút, chân, móc treo áo | tự dựng |
| Đồng hồ treo tường | mặt số, kim giây, quả lắc | `rig/sets.js` → `clock()` |
| Nhiệt kế treo tường | thủy ngữ trong ống, vạch, cột hồng khoáng | tự dựng |
| Ẩm kế treo tường | mặt đồng hồ, kim, cửa sổ nhỏ | tự dựng |
| Ghế gỗ hiên | mặt ngồi, bốn chân, dựa lưng | tự dựng |
| Bàn gỗ trong phòng + hai mặt kính + vách ngăn | mặt bàn, chân, mặt kính, giọt nước đặt trên kính, tấm ngăn giữa hai mặt | tự dựng |
| Sợi vải đan (cận) | sợi ngang – sợi dọc, xoắn, mép tua | tự dựng |
| Giọt nước trên sợi | mặt nước, hình giọt, đục | tự dựng |
| Mặt nước (cận) | mặt phẳng gợn sóng, bờ chật | tự dựng |
| Bàn tay người (tay chạm vải, tay trước quạt) | rãn tay, ba đốt có khớp và móng, cổ tay áo, mồ hôi bám trên da | `rig/fx.js` → `buildHand()` |

## Thứ vô hình

> Chỉ khí, nhiệt, tín hiệu, dòng điện, lực. Mỗi thứ: mọc từ vật nào, chạy tới vật nào, bị chặn ở đâu, gây ra thay đổi gì nhìn thấy được. **Không dùng gợn nhiệt (nghĩa là khói nóng) để nói một vật đang mất nhiệt** — vật mất nhiệt thì đổi sang màu lạnh, hạt hơi nước bám trên nó bay lên rồi tan.

- **Phân tử nước** (mọc ở mặt nước N3, chạy vào N4): các hạt cyan nhảy lung tung trong lớp nước; vài hạt ở mặt có vận tốc cao hơn bứt ra ngoài rồi bay lên. Dùng `flow()` từ mặt nước lên không khí + `glowDots` cho phần nhảy trong nước.
- **Năng lượng mà phân tử mang đi** (mọc ở phân tử thoát ra N3): mỗi phân tử thoát ra sáng hơn (màu ấm) và để lại một vệt nhỏ ở mặt nước; mặt nước chuyển từ ấm sang lạnh, vải và da chuyển tông lạnh (xanh lạnh), hạt hơi nước bám trên bề mặt bốc lên rồi tan dần.
- **Lớp khí ẩm** (mọc ở bề mặt vải N4, chạy ra không khí): một mảng hơi mỏng màu cyan bám sát tấm áo, **đặc dần lên** khi hơi nước dồn vào (dòng 10 — cơ chế bão hoà), **mờ đục** khi không khí bên ngoài ẩm (dòng 19 — độ ẩm cao), **mỏng đi từ trái sang phải** khi có gió quét qua.
- **Luồng gió** (mọc ở quạt, chạy ngang qua N4): các vệt sáng chạy ngang khung hình, túi nylon nghiêng theo; lớp khí ẩm bị cuốn đi cùng các hạt hơi nước trong đó.

## 3 khung hero

1. **Cơ chế (N3):** cận mặt nước trên sợi vải, nhìn ngang. Một nửa khung là lớp nước trong (các phân tử rung, mờ), nửa kia là không khí (tối, có vài hạt hơi nước bay lên). Ánh sáng ấm từ hiên rọi vào mép nước, viền tím ở phía sau. Điểm nhìn là vài phân tử bứt ra khỏi mặt nước.
2. **À ra thế (N4):** nhìn ngang từ bên cạnh một tấm áo đang treo trong phòng. Lớp khí ẩm màu cyan bám sát mặt trước của áo như một tấm kính mờ; một luồng gió vào từ bên trái quét lớp đó đi, kéo theo các hạt hơi nước bay sang phải. Áo ở giữa khung, nền là phòng tối.
3. **Đời thường (N1):** dây phơi kéo ngang khung, trên đó áo phông, quần, khăn; quạt bàn ở góc phải, bồn chậu dưới gàm dây, túi nylon bay. Nắng sớm in song chắn lan can lên sàn. Gió làm vải phất phơ.

## Bảng ý → hình

> Mỗi ý là **một hay nhiều câu lời**; 60 câu trong `voice/lines.json` (60 dòng, mỗi dòng đúng một câu, 4–20 từ) đúng là câu sẽ đọc, theo đúng thứ tự.

| # | Ý | Trên màn hình thấy gì | Vật nào làm gì | Nơi |
|---|---|---|---|---|
| 1 | Quần áo ướt treo trên dây, nước vẫn còn đó, chưa đi đâu cả. Nó còn ở trên vải, và sẽ phải rời đi bằng một cách khác. | Hiên buổi sáng: dây phơi, một áo phông ướt (màu sẫm hơn) kẹp bằng hai chiếc kẹp gỗ, nhỏ nước xuống bồn chậu; gió làm vải bay nhẹ | áo phông ướt, bồn chậu, nước nhỏ xuống | N1 |
| 2 | Vì sao phơi quần áo cần gió? Mình làm thí nghiệm nhỏ. Trong một căn phòng kín, hai cái áo giống nhau treo cạnh nhau. Một cái trước quạt, một cái ở góc xa, không có gió. Không khí trong phòng đứng yên, nên chỗ nào có quạt thì mới có gió. Cái trước quạt đang nhạt màu dần, còn cái kia vẫn sẫm. | Phòng kín: hai áo giống nhau trên hai dây; một cái trước quạt (vải nhạt màu, túi nylon bên cạnh đang nghiêng), một cái ở góc xa (vải sẫm, túi nylon đứng yên) | hai áo phông, quạt bàn, túi nylon | N4 |
| 3 | Nước không tự mất đi. Muốn rời khỏi vải, nó phải đổi thành thứ khác. | Máy đẩy vào tấm áo trong phòng: giọt nước tròn trên bề mặt vải, bên dưới vải có vệt ẩm | giọt nước trên sợi vải | N4 → N2 |
| 4 | Đi sâu vào cái áo, mình thấy các sợi vải đan qua nhau. Nước nằm ở khe giữa các sợi, và còn bám trong chính sợi. Ở rìa sợi, nó thành vệt trong xơ. | Cận: hai sợi vải đan qua nhau, khe giữa chúng đầy nước, mặt nước cong meniscus; ở rìa sợi, nước bám thành vệt trong xơ | sợi vải đan, mảng nước trong khe | N2 |
| 5 | Muốn rời khỏi vải, nước phải đổi thành hơi nước. Mình sẽ đi xem điều đó xảy ra thế nào. | Cận hơn: giọt nước ở khe sợi, một hạt hơi nước tách ra khỏi bề mặt giọt và bay lên | giọt nước, hạt hơi nước | N2 → N3 |
| 6 | Ở mặt nước, các phân tử cứ nhảy lung tung. Chỉ một phần nhỏ đủ năng lượng để bứt ra ngoài. | Mặt nước nhìn ngang: các phân tử rung tới lui trong lớp nước; ở mặt trên, vài phân tử nhanh hơn bứt lên, phần còn lại bị hút lại | mặt nước, phân tử | N3 |
| 7 | Phân tử bay lên mang theo năng lượng của nó. Phần nước còn lại thì mát đi. | Phân tử thoát ra sáng hơn (ấm), bay lên vào chỗ tối; mặt nước bên dưới chuyển sang màu lạnh | phân tử thoát ra, mặt nước | N3 |
| 8 | Nước lấy nhiệt từ chính cái vải, nên vải ướt thành vải lạnh. Chạm vào nó, mình thấy lạnh ngay. Mỗi gram nước bay hơi lấy hơn hai kilojoule nhiệt từ chính cái vải. | Quay lại tấm áo trong phòng: màu vải từ sẫm chuyển sang tông lạnh, những hạt hơi nước bám trên vải bốc lên rồi tan; bàn tay chạm vào rồi rút lại (không có gợn nhiệt) | áo phông, hạt hơi nước, bàn tay | N3 → N4 |
| 9 | Nhưng nước chỉ bay hơi đều hơn khi không khí ngay trên vải còn trống. Chỗ trống đó, hơi nước mới đi được. Lớp hơi ẩm ấy bám sát mặt áo, mỏng như một tấm kính mờ. | Nhìn ngang tấm áo: một lớp hơi mỏng màu cyan bám sát mặt trước của vải | lớp khí ẩm | N4 |
| 10 | Lớp đó bám sát vải, nhanh chóng bị bão hoà. Từ đó, nước bay hơi chậm lại. | Lớp ẩm **đặc dần lên**, đầy hạt hơi nước đọng lại; máy ngả xuống giọt nước trên mặt kính cạnh đó, số hạt bốc ra thưa dần | lớp khí ẩm, giọt nước trên mặt kính | N4 |
| 11 | Gió thổi tới, lớp ẩm bị quét đi, và khí khô thay vào chỗ. Gió làm đường đi của hơi nước ngắn lại. | Luồng gió từ trái sang phải quét qua tấm áo; lớp ẩm mỏng đi từ trái sang phải; các hạt hơi nước bị cuốn đi cùng | luồng gió, lớp khí ẩm | N4 |
| 12 | Gió không sấy nước. Gió chở hơi nước đi. | Các hạt hơi nước từ mặt áo đi vào luồng gió và bay xa sang phải, kéo dài thành vệt; không khí mới tới vẫn khô | hạt hơi nước, luồng gió | N4 |
| 13 | Gió mạnh hơn, lớp ẩm bị quét xa hơn. Nên nước bốc hơi nhanh hơn. | Góc nhìn rộng hơn: quạt quay nhanh hơn, luồng gió dài hơn, vệt hơi nước bay xa hơn; túi nylon bên cạnh nghiêng hơn | quạt bàn, túi nylon, vệt hơi nước | N4 |
| 14 | Đo được: hai cái cân, một áo trước quạt, một ở góc xa. Hai cái kim lệch nhau. | Trên bàn trong phòng: hai cái cân nhà bếp cạnh nhau, mỗi cái một móc treo một cái áo; sau lưng là đồng hồ treo tường (không đọc con số phút nào); kim áo trước quạt đã gần vạch, kim áo góc xa còn ở xa vạch | hai cân nhà bếp, hai áo | N4 |
| 15 | Một thí nghiệm đơn giản trên bàn. Hai giọt nước, một bên có gió, một bên không. Không có gió thì tốc độ bay hơi rơi còn một nửa. | Hai mặt kính trên bàn, ở giữa một vách chắn; bên phải có luồng gió quét qua — sau cùng một khoảng thời gian, giọt bên phải nhỏ đi gấp đôi, giọt bên trái vẫn nhỏ đi nhưng chậm hơn hẳn | hai mặt kính, vách chắn, hai giọt nước | N4 |
| 16 | Còn lại, ba thứ quyết định tốc độ. Nhiệt độ, độ ẩm, và diện tích phơi. Ba cái áo phơi chồng lên nhau trên dây thứ hai. | Ba vật lần lượt lên hình ở hiên: nhiệt kế, ẩm kế, và một đàn áo phơi chồng lên nhau trên dây thứ hai | nhiệt kế, ẩm kế, đàn áo | N1 |
| 17 | Không khí ở nhiệt độ này chứa được tối đa khoảng hai mươi gam hơi nước. Tính trên mỗi kilogam không khí khô. Đó là trần của nó. | Nhiệt kế chỉ hai mươi lăm độ; không khí quanh áo trong vắt, hạt hơi nước lan được xa | nhiệt kế, hạt hơi nước | N1 |
| 18 | Nhiệt độ cao hơn thì sức chứa ấy càng cao hơn. Ba mươi độ thì hơi nước lan xa hơn, đặc hơn. | Nhiệt kế chỉ ba mươi độ; hạt hơi nước quanh áo lan xa hơn, đặc hơn | nhiệt kế, hạt hơi nước | N1 |
| 19 | Cùng một luồng gió, không khí ẩm chín mươi phần trăm làm nước bay hơi chậm hơn khoảng năm lần. Lớp hơi quanh áo mờ đục, hạt hơi nước lơ lửng. | Ẩm kế chỉ chín mươi phần trăm; lớp khí ẩm quanh áo **mờ đục**, hạt hơi nước lơ lửng không bay xa được | ẩm kế, lớp khí ẩm mờ | N1 |
| 20 | Chồng áo lên nhau, hay phơi một mặt, thì diện tích để bốc hơi bị thu hẹp. Cái áo úp giữ ẩm lâu hơn cái phơi rộng. | Máy quay chậm quanh một cái áo phơi rộng, rồi đi vòng sang một cái áo gấp đôi úp bên cạnh; mảng ẩm trên cái úp đậm hơn | áo phông phơi rộng, áo úp, mảng ẩm | N1 |
| 21 | Quần áo dày giữ nhiều nước hơn, và cũng giữ lâu hơn áo mỏng. Nước tụ ở mép khăn rồi rơi thành giọt. | Cận mép khăn tắm dày: nước tụ rồi rơi thành giọt; cạnh đó áo thun mỏng không có giọt nào, mảng ẩm chỉ loang nhẹ | khăn tắm, áo thun | N1 |
| 22 | Không khí trong phòng không đi đâu cả, nó quay lại bám quanh cái áo. Đó là lý do phơi trong nhà lâu khô hơn. | Từ hiên nhìn qua cửa vào phòng kín: một cái áo treo bên trong, lớp khí ẩm quanh nó dày đặc, không có luồng gió nào quét qua | áo phông trong phòng, lớp khí ẩm | N1 → N4 |
| 23 | Cùng cơ chế đó giải thích vì sao quạt thổi tay lại thấy mát. Hơi nước bám trên da bị gió cuốn đi. | Bàn tay trước quạt: hạt hơi nước bám trên da bị gió cuốn đi, da chuyển tông lạnh, hơi nước cuốn theo luồng gió (không gợn nhiệt) | bàn tay, quạt, hạt hơi nước | N4 |
| 24 | Vậy quần áo khô không phải vì gió sấy nó. Quần áo khô vì nước phải đi được. Gió chỉ làm cho nước có chỗ để đi. | Quay lại hiên: dây phơi, áo quần khăn đã khô, gió vẫn thổi, túi nylon vẫn bay; cạnh đó **trên sàn** còn để một cái áo úp còn ẩm | dây phơi, quần áo khô, túi nylon, áo úp còn ẩm | N1 |
| 25 | Muốn áo khô nhanh, hãy treo ở nơi thoáng gió. Phơi cả hai mặt, và không chồng quần áo lên nhau. | Hiên: dây phơi đã khô, quạt bàn ở góc, **trên sàn** cạnh đó còn để một cái áo úp còn ẩm | áo úp còn ẩm, dây phơi | N1 |

## Chương

> Tập ngắn dưới tám phút, không chia chương.

## Shot list

> Gom từ bảng ý → hình khi dựng: thời điểm · cảnh · máy làm gì · vì sao. Máy chỉ đi khi có lý do.

| Thời điểm | Cảnh | Máy | Vì sao |
|---|---|---|---|
| 0:00–0:09.4 | hiên, dây phơi, áo ướt nhỏ nước | quét ngang dây phơi rồi đứng yên | người xem thấy ngay việc quen thuộc trong ba giây |
| 0:09.9–0:20.5 | phòng kín: đẩy qua cửa vào phòng, thấy hai áo và quạt | đẩy qua cửa vào phòng rồi dừng lại | phải thấy phòng là kín, nên gió trong phòng chỉ có một nguồn là quạt |
| 0:20.7–0:27.4 | cùng phòng: luồng gió từ quạt quét ngang sang một áo | lùi nhẹ để thấy cả quạt lẫn hai áo | so sánh phải thấy cả hai bên trong một khung |
| 0:27.8–0:31.7 | giọt nước trên vải | đẩy thẳng vào tấm áo | đi vào bên trong vật |
| 0:32.2–0:40.9 | sợi vải đan, nước trong khe và bám trong sợi | đẩy chậm, cận | chỉ ra nước nằm ở đâu |
| 0:41.3–0:46.0 | giọt nước, hạt hơi nước tách ra | cận hơn nữa, chậm | khái niệm “hơi nước” có hình trước khi được gọi tên |
| 0:46.4–0:51.3 | mặt nước, phân tử rung, vài phân tử bứt ra | ngang mặt nước, đứng yên | máy phải nằm ngang để thấy phân tử bứt ra khỏi mặt |
| 0:51.8–0:55.8 | phân tử bay lên, mặt nước nguội | trôi theo phân tử thoát ra rồi lùi lại | năng lượng đi kèm hạt nên phải thấy hạt mang nó đi |
| 0:56.2–1:05.1 | áo nguội, tay chạm rồi rút | nhìn xuống tấm áo | quay lại vật thật để thấy hậu quả |
| 1:05.6–1:14.6 | lớp khí ẩm bám vải | lùi ra, nhìn ngang | khái niệm “lớp khí ẩm” có hình ngay khi được gọi tên |
| 1:15.0–1:20.0 | lớp ẩm đặc lên | tiến vào lớp ẩm rồi ngả xuống giọt nước trên mặt kính | bão hoà phải thấy được bằng mật độ hạt |
| 1:20.5–1:26.4 | gió quét lớp ẩm đi | lùi ra, quét ngang cùng hướng gió | máy đi theo gió để thấy lớp ẩm bị cuốn |
| 1:26.9–1:29.3 | hạt hơi nước đi vào luồng gió | trôi cùng vệt hơi nước | câu “gió chở hơi nước đi” cần hình theo vệt |
| 1:29.8–1:33.8 | quạt quay nhanh, vệt bay xa | lùi ra rộng | gió mạnh hơn phải thấy được khác |
| 1:34.3–1:39.5 | hai cân nhà bếp, hai áo, đồng hồ treo tường sau lưng | nhìn xuống bàn, hai cái cân trong khung | số đo phải có vật mang |
| 1:39.9–1:47.2 | hai giọt nước trên hai mặt kính có vách ngăn | ngang hai mặt kính, giữ yên | so sánh tốc độ nhìn bằng mắt, không cần đồng hồ |
| 1:47.6–1:55.1 | nhiệt kế, ẩm kế, đàn áo chồng trên dây thứ hai | lần lượt tới gần từng vật | ba điều kiện, ba vật, ba cách dựng |
| 1:55.6–2:01.0 | nhiệt kế chỉ hai mươi lăm độ, hơi nước lan xa | cận nhiệt kế rồi kéo ra | nhiệt độ có vật mang |
| 2:02.8–2:08.1 | nhiệt kế chỉ ba mươi độ, hơi nước đặc hơn | cận nhiệt kế rồi quay sang hạt hơi nước | cùng vật, khác trạng thái |
| 2:08.5–2:16.1 | ẩm kế chỉ chín mươi phần trăm, lớp ẩm mờ đục | cận ẩm kế rồi quay sang lớp ẩm | độ ẩm có vật mang, hình khác hình dòng 10 |
| 2:16.6–2:23.0 | áo phơi rộng, máy đi vòng sang áo úp | quay chậm quanh áo rồi đi vòng | đổi cách dựng so với hai cặp “cạnh nhau” trước đó |
| 2:23.5–2:28.9 | mép khăn tắm rơi giọt, áo thun không có giọt | cận mép khăn rồi sang áo thun | độ dày vải thấy bằng giọt nước |
| 2:29.4–2:35.2 | nhìn qua cửa vào phòng kín, áo treo, lớp ẩm dày | lùi ra hiên rồi dừng ở khung cửa | cùng cơ chế, nơi khác, hình mới |
| 2:35.6–2:40.8 | tay trước quạt | cận bàn tay, luồng gió quét qua | cùng cơ chế áp lên cơ thể |
| 2:41.2–2:47.5 | hiên, quần áo đã khô, vải vẫn bay | lùi ra, quét ngang dây phơi | quay lại hiện tượng với góc nhìn mới |
| 2:47.9–2:53.4 | hiên, áo úp còn ẩm trên sàn cạnh dây phơi | dừng ở cái áo úp rồi kéo ra rộng | lời khuyên vừa được nói thành lời, vừa nằm ngay trong hình |
