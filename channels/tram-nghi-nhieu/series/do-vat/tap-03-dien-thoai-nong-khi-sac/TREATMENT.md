# TREATMENT — Vì sao điện thoại nóng lên khi sạc?

Kênh / channel: **tram-nghi-nhieu** · Tập / episode: `series/do-vat/tap-03-dien-thoai-nong-khi-sac` · Phim / movie: `tram-nghi-nhieu-series-do-vat-tap-03-dien-thoai-nong-khi-sac.mp4`

## Độ dài

- **Năm tầng của câu trả lời · 25 dòng ý (24 dòng của câu trả lời + 1 dòng lời khuyên) · 8 con số** (5 V, 4,2 V, 0,8 W, 96,5 %, 23 J, 103 J, 45 °C, và dải 34–43 °C — dải này tính là hai con số khi người xem nghe).
- **Phim dài khoảng 4 phút 30 giây** (mục tiêu: **không ngắn hơn 4:00**, tốt nhất là 4:30): 25 dòng ý, mỗi dòng 2–3 câu lời, ước lượng 80–90 câu, khoảng 900–1000 từ. Mọi mốc thời gian trong shot list ở dưới là **ước lượng theo dòng ý**; bước 2 thu giọng xong sẽ thay bằng mốc thật lấy từ `voice/proc/dur.json`.
- **Ngân sách con số:** kênh cho tối đa **2 con số mỗi phút** (`scene_rules.json`), nên 8 con số này đòi phim dài ít nhất bốn phút — đó là lý do tập này không rút xuống ba phút. Trong `voice/lines.json` viết số **bằng chữ** ở trường `say` (như tap-02) để bộ đếm tính đúng, và mỗi con số phải là một vật mang nó trên màn hình (tem cục sạc, tem túi pin, mặt đồng hồ, dải màu trên vỏ), không phải một chữ trôi trên nền.
- **Ba chỗ phải nói đúng phạm vi con số** (theo `research/FACTS.md`): (1) **0,8 W là phép tính của tập phim** từ công thức của nhà sản xuất (chênh lệch điện áp × dòng sạc), không phải số đo một chiếc máy cụ thể — dòng ý 8 phải nói rõ điều đó; (2) **50 °C và 40 °C không lên màn hình**: đó là số đo vùng chip khi *chạy app nặng và tắt bộ điều khiển nhiệt*, không phải lúc sạc, nên phim chỉ cho thấy bộ điều khiển nhiệt làm gì mà không đặt con số nào lên máy đang sạc; (3) **34–43 °C là dải thoải mái cho da người**, không phải nhiệt độ đo được lúc sạc — phim hiện nó bằng một dải màu trên vỏ máy, không có nhiệt kế đo.
- **Năm tầng:** (1) hiện tượng — điện thoại ấm khi sạc, và nhiệt ấy từ đâu; (2) điện không chạy thẳng vào pin — qua cục sạc, rồi qua một con chip trong máy, và chỗ chênh lệch điện áp ở đó thành nhiệt; (3) còn một nguồn nhiệt nữa trong máy: chính tế bào pin — dòng điện vượt qua điện trở nội, cộng với nhiệt do phản ứng hoá học kéo theo; (4) vì sao nóng lên — nhiệt sinh ra ở một khối rất nhỏ, còn đường thoát nhiệt chỉ có vỏ máy, nên nó dồn lên và máy phải có bộ điều khiển nhiệt và một chốt dừng sạc; (5) hệ quả — nóng khi sạc là bình thường, nhưng pin để ở nơi nóng thì già nhanh hơn.
- **Vì sao không ngắn hơn:** bỏ tầng nào là mất một mắt xích. Bỏ tầng 2 thì thành "điện vào pin thành nhiệt" — người xem tưởng phần điện mất đi là do chính pin nuốt, trong khi thực ra một phần mất ngay ở bộ chuyển đổi trước khi tới pin. Bỏ tầng 3 thì không có lý do gì để nói "sạc nhanh nóng hơn". Bỏ tầng 4 thì nhiệt dường như chỉ là chuyện của vỏ máy, không thấy được rằng máy phải tự bảo vệ. Bỏ tầng 5 thì mất cái giá của nhiệt.
- **Vì sao không dài hơn:** những gì đã cố ý để ngoài — công thức Joule viết ra, mạch điện tử của một con điện thoại cụ thể, lịch sử các kiểu sạc, tuổi thọ và cách đo dung lượng pin, các ngưỡng nhiệt riêng của từng hãng, và chuyện tản nhiệt chủ động (tấm làm mát, sạc không dây).
- Người dùng không nêu độ dài; độ dài ra từ số tầng của câu trả lời.

## Câu hỏi, tách ra

- **Câu hỏi:** Vì sao điện thoại nóng lên khi sạc?
- **Chủ thể:** nhiệt trong điện thoại lúc đang sạc (vỏ máy và tế bào pin) · **Thay đổi:** nhiệt độ bề mặt máy dâng lên, ấm tay · **So với:** so với lúc không cắm sạc — cùng một cái máy, cùng một cái phòng · **Vì:** điện đi vào máy không bao giờ vào pin hết một cách trọn vẹn; phần chênh lệch ấy, cộng với nhiệt do dòng điện chạy qua điện trở nội của tế bào pin, hoá thành nhiệt ngay bên trong máy, trong khi vỏ máy gần như chỉ có một cách đẩy nhiệt ra ngoài.
- **Câu trả lời một câu:** Điện thoại nóng lên khi sạc vì điện đi vào máy không bao giờ vào pin hết một cách trọn vẹn — phần chênh lệch ở bộ chuyển đổi, cộng với nhiệt do dòng điện chạy qua điện trở nội của tế bào pin, đều hoá thành nhiệt ngay bên trong máy, mà vỏ máy chỉ có một đường để đẩy nhiệt ra.

## Mở và kết

- **Khung mở:** bàn bếp buổi tối, ánh sáng xanh nhạt từ cửa sổ. Điện thoại nằm sấp màn hình lên, cắm vào dây sạc; cạnh đó là cục sạc cắm trong ổ. Một bàn tay cầm điện thoại lên — nó ấm. Quanh vỏ máy bốc lên một vệt hơi mỏng, như hơi nước mà thấy được. Người xem thấy ngay việc quen thuộc: máy nóng khi sạc.
- **Kết:** quay lại đúng cái điện thoại đó, vẫn cắm sạc, giờ là lúc nửa đêm — vỏ máy ấm, màn hình báo đang sạc. Câu trả lời quay lại hiện tượng: máy nóng lên không phải vì nó hỏng, mà vì đó là chỗ điện đang đi vào và có một phần bị thành nhiệt. Góc nhìn mới người xem mang về: nhiệt độ của điện thoại là một cái đồng hồ đo xem điện đang vào bao nhiêu và đang mất bao nhiêu. Việc dùng được ngay: sạc ở chỗ mát, bỏ ốp khi sạc, đừng vừa sạc vừa chơi game nặng.

## Nơi chốn

| Nơi | Lớp của câu trả lời | Bộ có sẵn / tự dựng | Máy vào và ra thế nào |
|---|---|---|---|
| **N1 · Bàn bếp buổi tối** | hiện tượng đời thường (điện thoại ấm khi sạc); tầng 4 (sạc mà vừa chơi game); và lời khuyên cuối | bộ có sẵn `rig/sets.js` → `kitchen(scene, { time: 'night' })`: tường gạch, cửa sổ, mặt bàn gỗ, tủ dưới, kệ treo, đồng hồ treo tường, cây thuốc trên bệ cửa sổ, ấm, cốc, khăn; ổ cắm và dây nguồn thì tự dựng | máy ở ngoài, quay ngang mặt bàn rồi đi theo dây sạc; cuối tập quay lại đây |
| **N2 · Trong cục sạc** (cục sạc bị cưa ngang) | tầng 2, phần đầu: điện lưới biến thành năm vôn một chiều | tự dựng: cục sạc (vỏ nhựa, hai đầu cắm, tem nhãn), cuộn biến áp (lõi sắt + hai cuộn dây), cầu chỉnh lưu điện (bộ chỉnh lưu), tụ điện, đèn LED nhỏ | máy đi theo dây sạc từ điện thoại về cục sạc, rồi đẩy vào trong cục sạc; ra bằng cách đi tiếp theo dây về phía điện thoại |
| **N3 · Trong điện thoại** (điện thoại bị cưa ngang) | tầng 2 phần sau (bộ sạc trong máy): chênh lệch điện áp thành nhiệt; tầng 4 (vỏ là đường thoát nhiệt, bộ điều khiển nhiệt) | tự dựng + `rig/parts.js`: bo mạch, chip bộ sạc, tụ, cuộn cảm, cổng USB-C, túi pin, màn hình, khung máy; `rig/section.js` để cưa | máy đi từ cổng sạc vào trong máy, dừng ở chip bộ sạc, rồi đi xuống túi pin; ra bằng cách lùi ra mặt cắt |
| **N4 · Trong tế bào pin** (túi pin bị cưa ngang) | tầng 3: điện trở nội, nhiệt do phản ứng hoá học, nhiệt theo dòng sạc; và chốt dừng sạc khi pin nóng | tự dựng: túi pin (vỏ nhôm, lớp vỏ nhựa), cuộn các lớp điện cực than–kim loại, lớp tách, dây dẫn, cảm biến nhiệt độ | máy nằm ngang mặt cắt của túi pin, đi dọc theo lớp điện cực, rồi lùi ra |

## Vật lên hình

> Mọi vật có thật sẽ lên hình, mỗi vật kèm các bộ phận làm nó nhận ra trong một giây. Vật cần cắt ra: dựng nguyên rồi cắt bằng `section()`. Ruột máy: linh kiện của `rig/parts.js`. Tên ở cột đầu là tên trong `src/props.js` (bước 5: mỗi vật một tệp `src/props/<mã>.js`).

| Vật (và trạng thái) | Bộ phận đặc trưng | Từ rig hay tự dựng |
|---|---|---|
| Điện thoại (đang sạc, ấm tay) | thân máy, màn hình, khung, mặt lưng, cổng USB-C, loa, nút nguồn | tự dựng (`section()` để cưa) |
| Cục sạc (cắm trong ổ) | vỏ nhựa nhám, hai đầu cắm (đầu cắm ổ + đầu cắm USB-C), tem nhãn in chữ **5 V**, đèn LED nhỏ | tự dựng (`section()` để cưa) |
| Dây sạc (đi theo bàn, có một chỗ bị kẹp) | vỏ cao su, đầu cắm USB-C, chỗ kẹp bị dẹp | `rig/parts.js` → `cable()` |
| Cuộn biến áp trong cục sạc | lõi sắt chữ E, hai cuộn dây quấn, chân nối | tự dựng |
| Cầu chỉnh lưu điện + tụ trong cục sạc | bộ chỉnh lưu bốn chân, tụ hình trụ, tụ dẹp | `rig/parts.js` → `chip()`, `pcb()` |
| Bo mạch điện thoại | bảng mạch xanh, chip, tụ, cuộn cảm, đầu cắm sạc | `rig/parts.js` → `pcb()`, `chip()` |
| Chip bộ sạc (tuyến tính) | vỏ chip nhỏ có đề, mười chân, tấm tản nhiệt bám dưới | tự dựng |
| Cuộn cảm + tụ của bộ sạc xung | cuộn cuộn dây ferrite, hai tụ dẹp, hai MOSFET | tự dựng |
| Túi pin điện thoại | vỏ nhôm dẹt, lớp vỏ nhựa, cặp dây đỏ–đen, tem nhãn **4,2 V** | tự dựng (`section()` để cưa) |
| Lớp điện cực cuộn trong túi pin | lớp than (đen), lớp kim loại (bạc), lớp tách mỏng, dây dẫn | tự dựng |
| Hạt liti (đi vào lớp than khi sạc) | hạt nhỏ màu bạc, chạy vào khe giữa các lớp | `rig/fx.js` → hạt tự dựng |
| Đồng hồ công suất (hiện 0,8 W, dưới mặt số ghi *theo công thức*) | mặt số nhỏ, hai chân cắp vào bo mạch | tự dựng |
| Đồng hồ hiệu suất (hiện 96,5 %) | mặt số nhỏ đặt cạnh cuộn dây, hai que chạm | tự dựng |
| Đồng hồ đo nhiệt của tế bào (hiện 23 J và 103 J) | mặt số, kẹp hai que vào hai đầu tế bào | tự dựng |
| Nhiệt kế nhỏ (một cây cắm trên vùng chip — chỉ có kim, không có số; một cây cắm cạnh tế bào pin — có vạch 45 °C) | que nhỏ, mặt kính, kim nhiệt, vạch đánh dấu | tự dựng |
| Tế bào pin tròn 18650 (một sạc chậm, một sạc nhanh) | vỏ thép, nắp đầu cực, lớp điện cực xếp cuộn bên trong | `rig/parts.js` → `battery()`, tự dựng thêm mặt cắt |
| Đồng hồ sức chứa của tế bào (so sánh hai tế bào) | mặt số, hai que cắm vào hai đầu tế bào | tự dựng |
| Bộ sạc nhỏ cho tế bào (một bộ sạc chậm) | vỏ nhựa, dây ra hai đầu cực, đèn | tự dựng |
| Ốp điện thoại (bỏ ra khỏi máy) | vỏ nhựa mềm, mép trên, camera lỗ tròn | tự dựng |
| Quạt nhỏ (hướng về phía máy) | lưới tròn, chân đế, cánh quạt | tự dựng |
| Nhiệt kế bàn nhỏ (chỉ nhiệt độ phòng, để so với máy) | que nhỏ, mặt kính, kim nhiệt | tự dựng |
| Dải màu nhiệt trên vỏ máy (34–43 °C) | dải màu vẽ ngang mặt lưng, không có nhiệt kế đo | tự dựng |
| Vỏ máy cắt nhỏ (kính, nhựa, kim loại) | lớp kính, lớp nhựa, khung kim loại, lớp keo | tự dựng (`section()`) |
| Bàn tay người (cầm điện thoại lên, cắm sạc) | rãn tay, ba đốt có khớp và móng, cổ tay áo | `rig/fx.js` → `buildHand()` |
| Ổ cắm trên tường + phích cắm | mặt ổ hai lỗ, phích cắm, dây nguồn | `rig/parts.js` → `cable()` |
| Đồng hồ treo tường (lúc đêm khuya) | mặt số, kim giây, quả lắc | `rig/sets.js` → `clock()` |
| Cốc nước, ấm, khăn trên bàn (chi tiết đời thường) | vỏ sứ, quai, nắp | `rig/sets.js` → `mug()`, `kettle()`, `towel()` |

## Thứ vô hình

> Chỉ khí, nhiệt, tín hiệu, dòng điện, lực. Mỗi thứ: mọc từ vật nào, chạy tới vật nào, bị chặn ở đâu, gây ra thay đổi gì nhìn thấy được. Dựng bằng `flow()`, `sparks`, `squiggle`… thành một vật liền, đủ to, không phải vài chấm.

- **Dòng điện** (mọc ở ổ cắm N1, chạy qua cục sạc N2, tới bo mạch N3, rồi vào pin N4): một dòng hạt sáng chạy suốt dây; ở chỗ dây bị kẹp, dòng hạt dày lên và đổi sang cam; trong cục sạc, dòng hạt đi qua cuộn biến áp và trở thành dòng một chiều đứng yên một chiều; trong máy, dòng hạt chạy vào chip bộ sạc rồi rẽ vào túi pin; trong túi pin, dòng hạt chạy ngang qua các lớp điện cực, ở chỗ có điện trở nội thì dày lên và đổi cam.
- **Nhiệt** (mọc ở chỗ chênh lệch điện áp N3, ở lớp điện trở nội N4, và lan ra vỏ máy N3/N1): một làn nhiệt cam mọc ở chỗ chênh lệch, dày lên rồi tràn ra bo mạch; ở tế bào pin, một vùng nóng chạy dọc theo lớp điện trở nội và một vùng nóng nhấp nháy quanh lớp tách; từ túi pin, nhiệt lan ra bo mạch rồi ra vỏ máy; ở N1, một vệt hơi ấm bốc lên từ vỏ máy.
- **Nhiệt đi ra ngoài** (mọc ở mặt lưng và mặt kính N3, chạy ra không khí N1): các tia nhiệt mỏng bốc lên từ mặt lưng, chậm lại và tan trong không khí; khi máy nguội (cuối lúc sạc) các tia này mỏng đi.
- **Hạt liti** (mọc ở lớp than N4): các hạt nhỏ chui vào khe giữa các lớp than khi sạc và chen ra khi phóng điện — dòng hạt chạy hai chiều, và cường độ của nó là dòng sạc.

## 3 khung hero

1. **Cơ chế (N3):** nhìn vào một nửa điện thoại bị cưa ngang, ngang tầm bo mạch. Ta thấy cổng USB-C, con chip bộ sạc nằm giữa cổng và túi pin, và một làn nhiệt cam mọc lên ngay từ chỗ chênh lệch, tràn ra bo mạch. Ánh sáng ấm hắt vào từ phía cổng sạc để mặt cắt bắt sáng; viền tím ở phía sau; ba lớp sâu: chip, túi pin, và bóng tối của khung máy phía sau.
2. **À ra thế (N4):** nhìn ngang vào một túi pin bị cưa ngang. Ta thấy những lớp điện cực xếp chồng như cuộn giấy, dòng điện chạy ngang qua chúng, và một vùng nóng cam dày lên ngay ở lớp có điện trở; quanh lớp tách thì có những vùng nóng nhấp nháy. Ánh sáng ấm rọi xiên từ một bên; màu nhấn là cam của nhiệt và bạc của lớp kim loại.
3. **Đời thường (N1):** bàn bếp buổi tối, điện thoại nằm sấp cắm sạc ở giữa khung, cục sạc cắm trong ổ bên trái, một vệt hơi ấm bốc lên từ vỏ máy, đồng hồ treo tường ở góc phải. Bàn tay đưa vào cầm điện thoại lên.

## Bảng ý → hình

> Mỗi ý của câu trả lời một dòng. Che cột ý, chỉ đọc cột hình vẫn phải ra câu chuyện; ý không có hình thì bỏ ý hay nghĩ ra hình. **Mỗi ý một dòng một lần**: ý đã nói thì không có dòng thứ hai (trừ một lần chốt ở kết). **Khái niệm khoa học phải có hình ảnh xuất hiện TRƯỚC hoặc NGAY KHI được nhắc tới.** Khi lập bảng:
> - ý có động từ biến đổi (chín, lan, nóng lên): hình của chính quá trình, trước → sau trong khung;
> - ý có con số: con số có vật mang nó (đồng hồ, lịch, thước, cân);
> - ý so sánh hai bên: khung rộng có cả hai, tách bạch, mỗi bên một chỗ sáng; vật đối chứng quay lại ít nhất mỗi 3 câu;
> - ý nhắc nơi chốn nào thì khung ở đúng nơi đó;
> - mỗi dòng một cách dựng khác dòng trước (góc, cỡ cảnh, vật chính); không quá 2 câu liền một cách dựng;
> - quay lại thời điểm trước thì có dấu hiệu thấy được (đồng hồ quay ngược, ánh sáng đổi).

| # | Ý | Trên màn hình thấy gì | Vật nào làm gì | Nơi |
|---|---|---|---|---|
| 1 | Buổi tối, trên bàn bếp có một chiếc điện thoại đang cắm sạc. Ai cầm lên cũng thấy nó ấm. | Bàn bếp buổi tối, ánh sáng xanh nhạt từ cửa sổ: điện thoại nằm sấp màn hình lên giữa mặt bàn gỗ, dây sạc chạy về cục sạc cắm trong ổ; một bàn tay đang cầm điện thoại lên; quanh vỏ máy một vệt hơi ấm mỏng bốc lên | điện thoại, cục sạc, dây sạc, bàn tay, vệt hơi ấm | N1 |
| 2 | Nó nóng lên không phải vì có thứ gì cháy ở đó. Và chiếc máy giống y bên cạnh, không cắm sạc, thì mát: vậy nhiệt ấy đến từ đâu? | Hai chiếc điện thoại giống nhau đặt cạnh nhau trên bàn: chiếc đang cắm sạc có vệt hơi ấm bốc lên từ vỏ, chiếc không cắm sạc thì không có gì bốc lên; ánh sáng xanh nhạt dịu xuống một chút | hai điện thoại, vệt hơi ấm, dây sạc | N1 |
| 3 | Nó nóng vì dòng điện đi qua chỗ nào có điện trở thì chỗ đó toả nhiệt. Chỗ dây bị kẹp ở khe cửa sổ là một ví dụ. | Máy đi theo dây sạc về phía ổ cắm; bên trong dây là dòng hạt sáng chạy; ở chỗ dây bị kẹp dẹp, dòng hạt dày lên và đổi sang màu cam, chỗ kẹp nóng lên | dây sạc, dòng hạt sáng, ổ cắm | N1 |
| 4 | Nhưng điện không chạy thẳng vào pin được. Nó phải đi qua cục sạc. | Máy dừng ở cục sạc rồi đẩy vào trong: cục sạc bị cưa ngang, bên trong là cuộn biến áp (lõi sắt chữ E, hai cuộn dây), một bộ chỉnh lưu và tụ điện | cục sạc, cuộn biến áp, bộ chỉnh lưu, tụ | N2 |
| 5 | Cục sạc lấy điện lưới ở một bên, và đưa vào điện thoại một dòng điện một chiều năm vôn ở bên kia. | Cùng cảnh cắt cục sạc; dây từ ổ cắm ở bên trái, dây ra điện thoại ở bên phải với nhãn **5 V**; dòng hạt sáng đi qua cuộn biến áp thì trở thành dòng hạt đứng yên một chiều | cục sạc, cuộn biến áp, dây, nhãn 5 V | N2 |
| 6 | Vào tới điện thoại, điện đi qua cổng, qua một con chip, rồi mới tới túi pin. | Máy đi theo dây sạc tới cổng USB-C rồi chui vào trong máy: bo mạch xanh, con chip bộ sạc giữa cổng và túi pin, dòng hạt sáng chạy vào chip rồi rẽ xuống túi pin | cổng USB-C, bo mạch, chip bộ sạc, túi pin | N2 → N3 |
| 7 | Nhưng pin chỉ nhận tới bốn phẩy hai vôn. Chênh lệch đó phải đi đâu? | Cận con chip: một nhãn **4,2 V** dán trên tem túi pin; giữa hai nhãn **5 V** và **4,2 V**, một khoảng chênh lệch được tô đậm bằng dải hạt sáng dày hơn | chip bộ sạc, tem túi pin, nhãn 4,2 V | N3 |
| 8 | Chênh lệch đó không biến mất: nó thành nhiệt, ngay trong máy. Tính theo công thức của nhà sản xuất thì chênh lệch điện áp nhân dòng sạc ra một con số nhỏ — **0,8 W**; đó là phép tính của tập phim, không phải số đo một chiếc máy cụ thể. | Làn nhiệt cam mọc lên ngay từ khoảng chênh lệch, dày dần rồi tràn ra bo mạch; một đồng hồ công suất cắm vào bo mạch hiện **0,8 W**, dưới mặt số có chữ nhỏ *theo công thức* | làn nhiệt, đồng hồ công suất, chip bộ sạc | N3 |
| 9 | Bộ sạc xung thì ít thất hơn nhiều: một bộ sạc xung như thế này giữ được tới **96,5 %**. | Khung rộng, hai bên tách bạch: bên trái là con chip tuyến tính với làn nhiệt cam dày; bên phải là bộ sạc xung (cuộn cảm, hai tụ) với đồng hồ hiệu suất hiện **96,5 %**; mỗi bên một chỗ sáng riêng | chip tuyến tính, bộ sạc xung, đồng hồ hiệu suất | N3 |
| 10 | Dù tốt đến mấy thì vẫn còn một phần điện hoá thành nhiệt trong máy. Không có cách nào tắt được. | Cùng khung so sánh: ở bên sạc xung, một phần hạt sáng mất đi ở cuộn dây và đổi thành vệt cam; bên tuyến tính, làn nhiệt vẫn dày hơn | hạt sáng, cuộn dây, làn nhiệt | N3 |
| 11 | Nhưng con chip không phải nguồn nhiệt duy nhất trong máy: chính tế bào pin cũng nóng lên khi sạc. | Máy đi xuống bo mạch, tới túi pin, rồi cắt ngang túi pin: ta thấy các lớp điện cực xếp chồng như một cuộn giấy | túi pin, lớp điện cực | N3 → N4 |
| 12 | Trong pin, dòng điện phải đi qua những lớp vật liệu có điện trở. Chỗ đó toả nhiệt. | Cận mặt cắt: dòng hạt sáng chạy ngang qua các lớp; ở lớp có điện trở nội, dòng hạt dày lên và đổi thành cam, một vùng nói nóng lan ra hai bên | lớp điện cực, dòng hạt sáng, vùng nóng | N4 |
| 13 | Còn một nhiệt nữa không đến từ dòng điện: khi pin hút điện, trật tự bên trong nó thay đổi, và sự thay đổi ấy cũng kéo theo nhiệt — có lúc nhiệt bị hút vào, có lúc bị đẩy ra. | Quanh lớp tách giữa hai lớp điện cực, các vùng nóng nhấp nháy, xen kẽ với các vùng mát; hạt liti chui vào khe lớp than | lớp tách, hạt liti, vùng nóng nhấp nháy | N4 |
| 14 | Nhiệt trong pin lớn lên khi dòng sạc lớn lên. Trong một tế bào thật, sạc chậm thì cả lần sạc sinh ra **hai mươi ba** (đơn vị đo nằm trên mặt đồng hồ: **23 J**). | Một tế bào pin riêng trên bàn, cắm vào một bộ sạc chậm; một đồng hồ đo nhiệt cắm vào hai đầu tế bào, mặt số đang tăng và dừng ở **23 J** | tế bào pin, bộ sạc, đồng hồ nhiệt | N4 |
| 15 | Sạc nhanh hơn thì nhiệt sinh ra trong pin nhiều hơn hẳn: tới **một trăm ba** (đồng hồ bên cạnh đứng ở **103 J**). | Bên cạnh tế bào kia, một tế bào thứ hai đang sạc nhanh: dòng hạt sáng chạy dày hơn, vùng nóng cam rộng hơn, đồng hồ nhiệt đứng ở **103 J** | hai tế bào pin, hai đồng hồ nhiệt, dòng hạt sáng | N4 |
| 16 | Và ở cuối lúc sạc, dòng nhỏ dần, nên máy cũng nguội lại. | Cùng hai tế bào: dòng hạt sáng ở tế bào thứ hai thưa dần, vùng nóng co lại, đồng hồ nhiệt chạy chậm lại | hai tế bào pin, dòng hạt sáng, vùng nóng | N4 |
| 17 | Vấn đề lớn nhất không phải là sinh nhiệt, mà là thoát nhiệt: nhiệt sinh ra ở một khối rất nhỏ, còn đường thoát gần như chỉ có một — vỏ máy. | Máy lùi ra khỏi túi pin, nhìn toàn bộ điện thoại bị cưa ngang: túi pin là một khối nhỏ nằm giữa, còn vỏ máy là lớp kính và khung bao quanh | điện thoại, túi pin, vỏ máy | N4 → N3 |
| 18 | Nhiệt phải qua lớp kính, qua lớp nhựa, mới ra được không khí. Chỗ đó chậm hơn nhiều so với tốc độ nó sinh ra. | Cắt nhỏ một góc vỏ máy: lớp kính, lớp nhựa, khung kim loại; luồng nhiệt cam bị nghẽn lại ở từng lớp, mới thoát ra được ở mặt ngoài | lớp kính, lớp nhựa, khung kim loại, luồng nhiệt | N3 |
| 19 | Nên khi vừa sạc vừa chơi game, máy nóng hơn hẳn: hai nguồn nhiệt cùng đổ vào một cái vỏ. | Quay lại bàn bếp: điện thoại vẫn cắm sạc nhưng đang chơi game; một luồng nhiệt cam từ cổng sạc, một luồng nhiệt từ vùng chip giữa máy; cả hai dồn vào vỏ. Chiếc máy bên cạnh chỉ chơi game, không cắm sạc, thì vỏ mát hơn | hai điện thoại, luồng nhiệt cổng sạc, luồng nhiệt chip | N1 |
| 20 | Vì vậy máy có một bộ điều khiển nhiệt: nó đo nhiệt vùng chip và bóp chậm lại công việc của máy khi máy nóng. | Cận vùng chip trên bo mạch, một nhiệt kế chạm vào chip, kim nhiệt dâng lên; sóng xung nhịp của chip bị bóp chậm lại. Không có con số nào trên khung này: đo kiểu này phải chạy app nặng, không phải lúc sạc | vùng chip, nhiệt kế, sóng xung nhịp | N3 |
| 21 | Còn ở chỗ pin thì có một chốt nữa: có những bộ sạc ngừng sạc khi pin vượt khoảng **bốn mươi lăm độ**. | Cận túi pin: một nhiệt kế nhỏ cắm cạnh tế bào vượt lên trên vạch **45 °C**; dòng hạt sáng đi từ chip bộ sạc vào pin bị đứt lại, dồn thành một đám ở chỗ chip | nhiệt kế pin, dòng hạt sáng, chip bộ sạc | N4 |
| 22 | Nên cái điện thoại bạn cầm mỗi ngày chỉ ấm tay, chứ không cháy: nhiệt độ bề mặt mà da người chịu được nằm trong dải **ba mươi bốn tới bốn mươi ba độ**. | Quay lại bàn bếp: trên vỏ máy hiện một dải màu từ xanh sang cam, đánh dấu dải **34–43 °C** — dải nhiệt mà da người chịu được, không phải số đo lúc sạc; bàn tay cầm máy lên | điện thoại, dải màu 34–43 °C, bàn tay | N1 |
| 23 | Nhưng nhiệt độ không vô hại: pin để ở nơi nóng thì già nhanh hơn. | Hai tế bào pin giống nhau đặt cạnh nhau, một ở trên kệ mát, một ở chỗ nóng; mỗi tế bào có một đồng hồ sức chứa cắm vào, đồng hồ bên tế bào ở chỗ nóng tụt xuống thấp hơn đồng hồ bên tế bào ở nơi mát | hai tế bào pin, hai đồng hồ sức chứa | N4 |
| 24 | Vậy nóng khi sạc là bình thường: đó là dấu hiệu cho thấy điện đang đi vào, và một phần đã bị thành nhiệt. | Quay lại điện thoại trên bàn lúc nửa đêm: màn hình sáng với biểu tượng sạc, vệt hơi ấm vẫn bốc lên từ vỏ; cạnh máy là một nhiệt kế bàn nhỏ chỉ nhiệt độ phòng, để thấy máy ấm hơn phòng — cái máy đang tự làm đồng hồ đo; đồng hồ treo tường chỉ khoảng nửa đêm | điện thoại, vệt hơi ấm, nhiệt kế bàn, đồng hồ treo tường | N1 |
| 25 | Lời khuyên: sạc ở chỗ mát, bỏ ốp khi sạc, và đừng vừa sạc vừa chơi game nặng. | Trên bàn: điện thoại cắm sạc không có ốp, ở một góc bàn mát; cạnh đó là chiếc ốp điện thoại bỏ ra, và một cái quạt nhỏ hướng về phía máy | điện thoại, ốp điện thoại, quạt nhỏ, bàn tay | N1 |

## Chương

> Tập ngắn dưới tám phút, không chia chương.

## Shot list

> Gom từ bảng ý → hình khi dựng: thời điểm · cảnh · máy làm gì · vì sao. Máy chỉ đi khi có lý do. **Mọi mốc thời gian dưới đây là ước lượng theo dòng ý** (mỗi dòng 10–12 giây); bước 2 thu giọng xong sẽ thay bằng mốc thật lấy từ `voice/proc/dur.json`, bắt đầu khi câu lời đầu tiên của dòng ý bắt đầu.

| Thời điểm | Cảnh | Máy | Vì sao |
|---|---|---|---|
| 0:00–0:11 | bàn bếp buổi tối, điện thoại cắm sạc, bàn tay cầm lên, vệt hơi ấm bốc lên | quét ngang mặt bàn rồi dừng ở điện thoại | người xem thấy ngay việc quen thuộc, và thấy phía "con người" đối diện phía "cái máy" |
| 0:11–0:22 | hai chiếc máy giống nhau cạnh nhau: chiếc đang sạc có hơi ấm bốc lên, chiếc kia không sạc thì không có gì bốc | ngang hai máy, đứng yên | câu hỏi cần một khoảng lặng để người xem tự hỏi, và phải thấy ngay phía "không sạc" để so |
| 0:22–0:34 | đi theo dây sạc tới ổ cắm, chỗ dây bị kẹp dày hạt và đổi màu cam | trôi theo dây, dừng ở chỗ kẹp | cái ví dụ đầu tiên của luật điện trở phải thấy được bằng mắt |
| 0:34–0:45 | cục sạc bị cưa ngang: biến áp, bộ chỉnh lưu, tụ | đẩy vào cục sạc | đi vào bên trong vật |
| 0:45–0:56 | cùng cảnh cắt, nhãn 5 V ở dây ra, dòng hạt đi qua biến áp rồi đứng yên một chiều | ngang dây ra, đứng yên | con số có vật mang nó (tem cục sạc) |
| 0:56–1:07 | đi theo dây về cổng USB-C, chui vào trong máy: bo mạch, chip, túi pin | trôi theo dây rồi đẩy vào cổng | nối hai nơi bằng một đường đi liền mạch |
| 1:07–1:18 | cận chip, nhãn 4,2 V trên túi pin, khoảng chênh lệch được tô đậm | đẩy cận vào khoảng chênh lệch | chênh lệch là thứ cần thấy trước khi nói về nó |
| 1:18–1:29 | làn nhiệt cam mọc ở chỗ chênh lệch, đồng hồ công suất hiện 0,8 W với chữ *theo công thức* dưới mặt số | đứng yên ở chip, ngả sang đồng hồ | nhiệt và con số phải cùng khung, và con số phải nói rõ là phép tính |
| 1:29–1:40 | khung rộng hai bên: chip tuyến tính (làn nhiệt dày) và bộ sạc xung (đồng hồ 96,5 %) | lùi ra rộng, chia hai vùng sáng | so sánh phải thấy cả hai bên trong một khung |
| 1:40–1:50 | cùng khung, hạt sáng mất đi ở cuộn dây bên sạc xung, đổi thành vệt cam | đẩy nhẹ vào cuộn dây bên phải | phần mất đi phải là một vật thấy được, không phải lời |
| 1:50–2:01 | máy đi xuống bo mạch tới túi pin, cắt ngang túi pin, thấy các lớp điện cực | đi xuống rồi đẩy vào túi pin | nguồn nhiệt thứ hai cũng phải mở ra mới thấy |
| 2:01–2:12 | cận mặt cắt: dòng hạt chạy ngang lớp điện cực, chỗ có điện trở thì dày lên và đổi cam | ngang mặt cắt, trôi dọc theo dòng hạt | máy đi theo dòng điện để chỉ chỗ điện trở nội |
| 2:12–2:23 | quanh lớp tách, các vùng nóng nhấp nháy, hạt liti chui vào lớp than | đẩy cận vào lớp tách | nhiệt thứ hai phải tách bạch với nhiệt thứ nhất |
| 2:23–2:34 | một tế bào pin sạc chậm, đồng hồ nhiệt dừng ở 23 J | lùi ra, đứng yên ở tế bào | con số có vật mang nó |
| 2:34–2:45 | tế bào thứ hai sạc nhanh, dòng hạt dày hơn, đồng hồ 103 J | ngang hai tế bào, đứng yên | so sánh hai bên phải thấy cùng một khung |
| 2:45–2:55 | dòng hạt ở tế bào thứ hai thưa dần, vùng nóng co lại | ngang tế bào thứ hai, đứng yên | sự thay đổi cuối lúc sạc phải thấy được |
| 2:55–3:06 | lùi ra khỏi túi pin, nhìn toàn bộ điện thoại cưa ngang, túi pin là khối nhỏ giữa vỏ | lùi ra rộng rồi ngả nhìn toàn bộ máy | chỉ ra quan hệ giữa khối nhỏ và lớp vỏ bao quanh |
| 3:06–3:17 | cắt nhỏ góc vỏ máy: kính, nhựa, khung; luồng nhiệt bị nghẽn ở từng lớp | đẩy vào góc vỏ máy | đường thoát nhiệt phải thấy là đường bị nghẽn |
| 3:17–3:28 | bàn bếp, điện thoại vừa sạc vừa chơi game, hai luồng nhiệt dồn vào vỏ; chiếc máy bên cạnh chỉ chơi game thì vỏ mát hơn | lùi ra rộng về khung bàn, hai máy cùng khung | hai nguồn nhiệt phải thấy cùng một khung, và phía "chỉ chơi game" để so |
| 3:28–3:39 | cận vùng chip, nhiệt kế có kim dâng lên (không có số), sóng xung nhịp bị bóp chậm | đẩy vào vùng chip | bộ điều khiển nhiệt là một vật thấy được, không phải lời |
| 3:39–3:50 | cận túi pin, nhiệt kế 45 °C, dòng hạt sáng từ chip bị đứt lại | đi từ chip xuống túi pin | chốt dừng sạc phải thấy là dòng điện bị cắt |
| 3:50–4:00 | quay lại bàn bếp, dải màu 34–43 °C hiện trên vỏ máy, bàn tay cầm máy | lùi ra, đứng yên ở vỏ máy | dải nhiệt có vật mang nó, và không có nhiệt kế đo |
| 4:00–4:11 | hai tế bào pin: một ở nơi mát, một ở chỗ nóng, mỗi tế bào một đồng hồ sức chứa, hai kim lệch nhau | ngang hai tế bào | cái giá của nhiệt phải thấy được ở hai bên, và phải có cả hai đồng hồ để so |
| 4:11–4:21 | điện thoại trên bàn lúc nửa đêm, màn hình báo sạc, vệt hơi ấm, nhiệt kế bàn cạnh máy, đồng hồ treo tường | quay lại khung bàn, kéo ra rộng | quay lại hiện tượng, và để vỏ máy ấm đứng cạnh nhiệt kế phòng — máy tự làm đồng hồ |
| 4:21–4:31 | điện thoại không ốp ở góc bàn mát, cạnh đó chiếc ốp bỏ ra | ngả sang chiếc ốp rồi kéo ra rộng | lời khuyên vừa được nói thành lời, vừa nằm ngay trong hình |
