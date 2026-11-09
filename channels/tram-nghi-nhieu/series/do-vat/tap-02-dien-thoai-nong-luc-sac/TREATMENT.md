# TREATMENT — Vì sao điện thoại nóng lúc sạc?

Kênh / channel: **tram-nghi-nhieu** · Tập / episode: `series/do-vat/tap-02-dien-thoai-nong-luc-sac` · Phim / movie: `tram-nghi-nhieu-series-do-vat-tap-02-dien-thoai-nong-luc-sac.mp4`

## Độ dài

5 tầng của câu trả lời (nguồn → mạch sạc trong máy → sạc nhanh và ranh giới an toàn → ruột pin → đường thoát nhiệt), 25 dòng ý, 95 câu dự kiến, ước tính **5 phút 50 giây** (độ dài thật đo bằng `ffprobe` khi dựng xong, không gõ tay). Dưới ngưỡng 8 phút nên **không chia chương** — cả phim là một hành trình liên tục đi từ cái bàn cạnh giường vào tận lớp graphite trong túi pin rồi quay lại.

- **Vì sao không ngắn hơn:** bỏ tầng "mạch sạc" thì người xem không hiểu vì sao điện áp hai mươi volt không nạp thẳng vào pin bốn volt, và câu hỏi con "vì sao sạc nhanh nóng hơn" không có chỗ đứng. Bỏ tầng "ruột pin" thì cái nóng của pin không có nguyên nhân vật lý. Bỏ tầng "đường thoát nhiệt" thì phim trả lời "nó nóng vì tốn điện" mà không nói nhiệt đi đâu — và người xem sẽ tưởng ốp case là vô hại.
- **Đã để ngoài:** cấu trúc hóa học của pin (lithium-ion, phân tích XRD, đồ thị phóng điện), mạch lưới sạc không dây, sạc từ bãi đỗ xe và điện thoại chịu nhiệt độ môi trường, và lịch sử phát minh của cổng USB-C. Tập này trả lời **cơ chế cái nóng**, không phải lịch sử và không phải hóa học.

## Câu hỏi, tách ra

- Câu hỏi: Vì sao điện thoại nóng lúc sạc?
- Chủ thể: **điện thoại** (vỏ máy và lưng máy) · Thay đổi: **nhiệt độ vỏ máy lên, tay chạm vào thấy nóng** · So với: **cùng cái máy đó lúc không sạc** (nằm yên thì mát) · Vì: **một phần điện vào không được nạp vào pin, mà chuyển thành nhiệt ở củ sạc và ở mạch trong máy; nhiệt trong máy thì tỏa ra qua vỏ máy**.
- **Câu trả lời một câu** (chủ ngữ là chủ thể): **Điện thoại nóng lúc sạc vì đó là một cái máy đang làm việc: điện từ ổ cắm vào, phần lớn được nạp vào pin, còn phần không nạp được thì thành nhiệt ở củ sạc, ở mạch trong máy và trong túi pin; nhiệt trong máy tỏa ra qua vỏ máy, mà ốp case thì nhốt nó lại.**

## Mở và kết

- Khung mở: **bàn cạnh giường lúc 22 giờ** — một cái điện thoại nằm sấp, cắm dây vào củ sạc cắm trong ổ, màn hình đang lên đồng hồ sạc. Bàn tay vừa chạm vào lưng máy: nóng. Đó là trải nghiệm ai cũng có, không cần thuật ngữ nào.
- Kết: **quay lại đúng cái bàn cạnh giường** — cái máy vẫn cắm sạc, màn hình vẫn sáng, và nó vẫn nóng; cái nóng lúc sạc là **máy đang làm việc**, không phải máy đang hỏng. Trước khi quay lại, người xem đã thấy bốn việc mình làm được ngay: bỏ ốp case khi sạc lâu, dùng củ sạc đúng chuẩn của máy, sạc chậm thì dòng điện vào máy ít hơn, đừng vừa sạc vừa chơi game — và nếu máy nóng **lúc không sạc**, hoặc nóng lệch một chỗ ở lưng máy, thì mình không tự đoán được nguyên nhân, phải mang máy đi kiểm tra.

## Nơi chốn

Mỗi nơi là một tầng của câu trả lời. Đường máy đi **một chiều**: từ cái bàn cạnh giường → vào trong củ sạc → theo dây vào cổng USB-C của máy → mổ ngang cái máy → mổ ngang túi pin → lùi ra vỏ máy và bàn tay → quay về bàn cạnh giường. Không chui vào trong máy lần nữa sau khi đã lùi ra.

| Nơi | Lớp của câu trả lời | Bộ có sẵn / tự dựng | Máy vào và ra thế nào |
|---|---|---|---|
| **N1 · Bàn cạnh giường, buổi tối** | Hiện tượng đời thường: máy nằm sấp, dây cắm ổ, tay chạm thấy nóng. Mở, thí nghiệm và kết phim. | Tự dựng (bàn gỗ, ổ cắm, củ sạc, dây, điện thoại, ốp case, nhiệt kế) | Máy ở trên bàn, nhìn chếch xuống. Vào: lùi sát vào cổng USB-C để đi theo dây. Ra: lùi ra bàn cạnh giường |
| **N2 · Bên trong củ sạc** | Tầng 1 — nguồn: điện từ ổ vào, một phần thành nhiệt ngay trong củ sạc | Tự dựng (vỏ củ sạc, cuộn biến áp, con chip, mỏ tản nhiệt) | Máy đứng ngoài, nhìn vào củ sạc đã bị cưa mở một nêm. Vào: đi theo dòng điện ra khỏi cổng USB |
| **N3 · Bên trong điện thoại** | Tầng 2 — máy: mạch sạc hạ điện áp, tụ, cuộn cảm; mọi thứ máy đang chạy khi bạn vừa sạc vừa dùng; sạc nhanh và cảm biến nhiệt | Tự dựng + rig (`pcb()`, `chip()`, `cable()`, `battery({kind:'pouch'})`) | Máy bị cưa ngang bằng `section()`, nhìn vào ruột từ phía cổng USB-C. Ra: đi xuống túi pin |
| **N4 · Trong ruột túi pin** | Tầng 3 — vi mô: các lớp xếp chồng, và trong lúc sạc, **điện trở bên trong tế bào** cản dòng điện nên sinh nhiệt ngay trong túi pin | Tự dựng (các lớp giấy bạc, lớp graphite, lớp đồng, lớp nhôm) | Máy ở rất gần, ngay trên mặt cắt của túi pin. Ra: lùi ra, nhiệt lan ra vỏ |
| **N5 · Vỏ máy và bàn tay** | Tầng 4 — nhiệt đi đâu: qua lưng máy, qua ốp case, vào tay người | Tự dựng (ốp case silicone, lưng máy, bàn tay từ rig `buildHand()`) | Máy ở mặt lưng, bàn tay tiến vào khung. Ra: quay về bàn cạnh giường |

## Vật lên hình

Mọi vật có thật sẽ lên hình, mỗi vật kèm các bộ phận làm nó nhận ra trong một giây. Vật cần cắt ra: dựng nguyên rồi cắt bằng `section()`. Ruột máy: linh kiện của `rig/parts.js`.

| Vật (và trạng thái) | Bộ phận đặc trưng | Từ rig hay tự dựng |
|---|---|---|
| Điện thoại nằm sấp (màn hình sáng đồng hồ sạc, camera, nút nguồn, cổng USB-C) | camera + nút + cổng | tự dựng |
| Củ sạc (chân cắm, nhãn có chữ **60 W**, cổng USB, mỏ tản nhiệt có gân) | chân cắm + nhãn | tự dựng |
| Dây sạc (đầu USB-C, dây uốn) | đầu cắm | rig `cable()` |
| Ổ cắm + phích cắm | hai lỗ cắm | tự dựng |
| Ốp case silicone trong suốt | mép case dày hơn | tự dựng |
| Túi pin (bạc, tab đồng, bảng bảo vệ — **không chữ số**) | tab đồng + bảng bảo vệ | rig `battery({kind:'pouch'})`, sơn lại |
| Mạch sạc (bảng mạch, con chip sạc, cuộn cảm, tụ) | chip + cuộn cảm + tụ | rig `pcb()`, `chip()` + tự dựng cuộn cảm |
| Cổng USB-C (rỗng, chân tiếp xúc) | miệng cổng + chân | tự dựng |
| Cảm biến nhiệt nhỏ trên bo mạch (miếng nhỏ, hai chân) | miếng cảm biến + chân | tự dựng |
| Lớp trong túi pin (giấy cách điện, graphite, đồng, nhôm) | màu từng lớp | tự dựng |
| Bàn tay người | ngón ba đốt | rig `buildHand()` |
| Nhiệt kế (để đo ở khung thí nghiệm) | cột chất lỏng | tự dựng |

**Con số nào lên hình, và ở vật nào.** Đúng bốn mốc, mỗi mốc là một vật đọc được, và mỗi mốc có
một câu lời kể đọc nó (`research/FACTS.md` là nơi khai các con số này):

| Con số | Ở đâu trên hình | Câu đọc |
|---|---|---|
| **60 W** | nhãn in trên vỏ củ sạc | "Trên nhãn in ở vỏ ghi sáu mươi oát." |
| **20 V** | mực silk trên bo mạch, ngay cạnh cổng USB-C | "Cổng đưa vào hai mươi volt." |
| **4 V** | mực silk trên bo mạch, ngay cạnh túi pin | "Pin chỉ nhận được khoảng bốn volt." |
| **45 °C** | vạch đỏ trên thang của **cảm biến nhiệt trong máy**, không phải nhiệt kế trên lưng | "Quanh bốn mươi lăm độ, tế bào pin không nên sạc nữa." |

Không vẽ thêm con số nào: không phần trăm hiệu suất, không dung lượng pin, không nhiệt độ mặt lưng,
không thời gian sạc. Những thứ đó không có nguồn trong file nghiên cứu nên phim không được nói.

## Thứ vô hình

Chỉ khí, nhiệt, tín hiệu, dòng điện, lực. Mỗi thứ: mọc từ vật nào, chạy tới vật nào, bị chặn ở đâu, gây ra thay đổi gì nhìn thấy được. Dựng bằng `flow()`, `sparks`, `squiggle`… thành một vật liền, đủ to, không phải vài chấm.

- **Dòng điện** (hạt cyan, `flow()`): mọc ở ổ cắm, chạy vào củ sạc, ra cổng USB, theo dây vào cổng USB-C của máy, vào mạch sạc, rồi vào túi pin. Ở mỗi chặng nó **bớt dần** — phần bị rơi chính là phần thành nhiệt.
- **Phần bị thất thoát** (hạt chuyển từ cyan sang cam rồi đỏ, `heatColor()`): ở củ sạc, ở cuộn cảm và con chip sạc, và bên trong tế bào pin. Đây là thứ vô hình duy nhất được vẽ thành vật thể.
- **Nhiệt lan trong vật liệu** (`squiggle()` gợn nhiệt, `flow()` luồng nhiệt): mọc ở chỗ sinh nhiệt, dâng lên và toả ra ở mặt lưng máy; bị ốp case chặn lại thì dồn quanh vỏ.
- **Luồng điện thứ hai** (khi máy đang chạy): từ pin lên mạch, ra màn hình và con chip xử lý, và cũng rơi thành nhiệt ở đó.

## 3 khung hero

1. **Cảnh mở — bàn cạnh giường**: điện thoại nằm sấp, dây chạy ra cổ ổ, đèn bàn vàng ấm hắt một vệt sáng chéo; bàn tay tiến vào, chạm lưng máy. Ba lớp sâu: tay ở tiền cảnh, máy ở trung cảnh, ổ cắm và bóng đèn ở hậu cảnh. Màu nhấn: đỏ của bộ sạc trên màn hình.
2. **Cảnh cơ chế — máy bị cưa**: nhìn vào ruột máy từ phía cổng USB-C; dòng hạt cyan chạy từ cổng sang mạch sạc, ở cuộn cảm thì bắt đầu chuyển sang cam, phần còn lại rơi xuống túi pin. Ba lớp sâu: vỏ máy cắt ở tiền cảnh, mạch ở trung cảnh, màn hình và khung máy ở hậu cảnh. Màu nhấn: cyan của dòng điện và cam của nhiệt.
3. **"À ra thế" — trong túi pin**: cận cảnh mặt cắt của túi pin, các lớp xếp chồng, và bên trong tế bào thì dòng điện bị điện trở cản lại nên sinh nhiệt ngay tại đó. Ba lớp sâu: mép lớp cắt ở tiền cảnh, dòng hạt ở trung cảnh, lớp sau mờ đi ở hậu cảnh. Màu nhấn: đỏ của nhiệt trong tế bào.

## Bảng ý → hình

Mỗi ý của câu trả lời một dòng, mỗi dòng một lần. Thứ tự dòng cũng là thứ tự đi của máy quay: N1 → N2 → N3 (cả sạc nhanh và cảm biến) → N4 → N5 → N1.

| # | Ý | Trên màn hình thấy gì | Vật nào làm gì | Nơi |
|---|---|---|---|---|
| 1 | Hiện tượng quen thuộc: điện thoại nằm sấp trên bàn cạnh giường, dây cắm vào ổ, tay chạm lưng thấy nóng | Bàn gỗ, ổ cắm, củ sạc, dây, cái máy nằm sấp, màn hình sáng đồng hồ sạc, bàn tay chạm vào | Tay chạm vào lưng máy rồi rút lại; màn hình sáng đồng hồ sạc nhấp nháy | N1 |
| 2 | Cái nóng ấy không phải do "sạc quá mạnh", mà do một quy luật: điện vào nhiều hơn điện nạp được | Dòng hạt cyan chạy từ củ sạc vào cổng máy; ngay ở chỗ tiếp xúc, một phần hạt rơi ra thành hạt đỏ tản đi | Dòng hạt chạy vào cổng USB-C; hạt đỏ tách ra và bay tản | N1 |
| 3 | Điện vào từ ổ cắm, chạy qua dây nguồn vào củ sạc | Ổ cắm, phích cắm, dây nguồn, củ sạc; dòng hạt cyan chạy trong dây | Dòng hạt chạy dọc dây nguồn vào củ sạc | N2 |
| 4 | Củ sạc làm một việc duy nhất: đổi điện xoay chiều thành điện một chiều — và đổi kiểu này không bao giờ trọn vẹn | Củ sạc bị cưa mở: cuộn biến áp, con chip, mỏ tản nhiệt; dòng hạt chạy qua cuộn, một phần đổi màu thành cam quanh cuộn | Hạt cam lan ra từ cuộn biến áp; mỏ tản nhiệt ấm lên, gợn nhiệt bốc lên | N2 |
| 5 | Máy phải làm nhiều việc hơn củ sạc: hạ điện áp xuống mức pin chịu được, rồi mới nạp | Bóng cắt ngang từ cổng USB-C dọc theo máy: cổng, mạch, con tụ, cuộn cảm, túi pin | Dòng hạt chạy từ cổng qua con tụ vào cuộn cảm | N3 |
| 6 | Điện áp từ củ sạc cao hơn nhiều so với điện áp của pin, nên phải hạ xuống | Cổng USB-C, mạch sạc, và một cuộn cảm dây đồng trên bo mạch; số điện áp hiện trên hai vật | Dòng hạt chạy vào cuộn cảm; cuộn cảm rung nhẹ | N3 |
| 7 | Dòng điện chạy qua dây đồng và qua con chip, mà dây và chip đều có điện trở — chỗ nào dòng điện bị cản thì chỗ đó nóng | Cận cảnh cuộn cảm và chip; hạt chuyển từ cyan sang cam đúng chỗ dòng điệu bị cản | Hạt cam bám quanh cuộn cảm rồi lan ra bo mạch; cuộn cảm nóng dần, gợn nhiệt bốc lên | N3 |
| 8 | Phần điện còn lại đi vào nạp pin — nơi nó được giữ lại thay vì bị mất | Dòng hạt hồng nhạt rơi từ mạch xuống túi pin; túi pin dần đầy màu | Hạt chìm vào túi pin, mặt túi sáng dần lên | N3 |
| 9 | Nhưng máy không chỉ sạc, máy còn đang chạy: màn hình, tin nhắn, game | Màn hình sáng, một con chip xử lý to trên bo mạch; một dòng hạt riêng chạy từ pin lên chip | Chip xử lý nhấp nháy, dòng hạt thứ hai chạy qua và rơi thành hạt cam quanh chip | N3 |
| 10 | Vậy lúc vừa sạc vừa dùng, máy có hai chỗ sinh nhiệt cùng lúc | Khung rộng của ruột máy: mạch sạc ở một bên đang đỏ, chip xử lý ở bên kia cũng đỏ | Hai vùng nóng cùng lúc lan ra, hơi nhiệt bốc lên từ cả hai | N3 |
| 11 | Sạc nhanh nóng hơn vì dòng điện chạy lớn hơn, và trong một cuộn cảm thì nhiệt sinh ra theo bình phương dòng điện | **Cùng một cuộn cảm**, hai trạng thái: dòng hạt thưa và ít hạt đỏ, rồi dòng hạt dày và hạt đỏ nhiều hẳn | Dòng hạt chạy dày hơn ở trạng thái sau; hạt đỏ bám quanh cuộn cảm nhiều hơn hẳn | N3 |
| 12 | Có máy có cảm biến nhiệt trong pin; nóng quá thì máy tự giảm dòng sạc, và quanh bốn mươi lăm độ là mốc của tế bào pin | Cảm biến nhiệt nhỏ trên bo mạch, thang của nó có một vạch đỏ; dòng hạt chạy chậm lại và thưa ra | Cảm biến nhiệt đổi màu; dòng hạt chậm lại; vạch đỏ được chỉ vào | N3 |
| 13 | Trong máy còn một chỗ nữa sinh nhiệt, ở trong túi pin | Túi pin, cắt một góc; bên trong là nhiều lớp mỏng xếp chồng | Túi pin được mở ra; lớp trong cùng lộ ra | N4 |
| 14 | Trong túi pin có nhiều lớp: đồng, graphite, lớp cách điện, nhôm — mỏng như tờ giấy | Mặt cắt của túi pin: từng lớp một màu, xếp chồng sát nhau | Các lớp lộ ra, mép lớp hơi nhăn | N4 |
| 15 | Trong lúc nạp, dòng điện bị điện trở bên trong tế bào cản lại | Dòng hạt cyan bị cản lại ngay bên trong tế bào, dòng đi chậm lại | Hạt chậm lại ở bên trong tế bào | N4 |
| 16 | Cản lại thì sinh nhiệt, ngay bên trong túi pin | Những chỗ hạt bị cản trong tế bào bừng sáng đỏ; hạt đỏ lan ra hai bên | Hạt tích tụ ở các chỗ bị cản, đỏ dần lên | N4 |
| 17 | Nhiệt sinh ra trong pin không thoát ra ngoài được, nó chỉ lan đều ra trong túi | Cả mặt cắt túi pin ấm dần: lớp nào cũng hơi đỏ, rồi đều | Nhiệt lan ra từ các chỗ nóng tới các lớp xung quanh | N4 |
| 18 | Trong máy có ba chỗ sinh nhiệt — mạch sạc, túi pin, và con chip — và cả ba cùng đổ nhiệt vào một vỏ máy | Lưng máy bị cưa: ba luồng nhiệt từ trong ruột máy dồn vào lưng máy | Ba luồng nhiệt dâng lên và dồn ở lưng máy | N5 |
| 19 | Vỏ máy là tản nhiệt của cả cái máy: nóng lên rồi tỏa ra không khí | Lưng máy ấm, gợn nhiệt bốc lên từ mặt lưng | Gợn nhiệt bốc lên, mờ dần ở trên | N5 |
| 20 | Tay người là một miếng tản nhiệt lớn hơn không khí, nên cầm lên là thấy nóng ngay | Bàn tay đặt lên lưng máy; vệt hơi nóng lan ra từ chỗ tay chạm | Tay áp vào máy, vệt nóng lan theo bàn tay; tay rút đi thì vệt nguội dần | N5 |
| 21 | Ốp case là cái áo khoác giữ nhiệt: nó giữ nhiệt lại quanh máy, không cho thoát ra | Ốp case trong suốt úp lên máy; các luồng nhiệt bị chặn ở lớp vỏ case và dồn lại | Luồng nhiệt chạm vỏ case, ngoản lại; mặt trong case mờ hơi | N5 |
| 22 | Nên cùng một máy, có case và không case, sẽ cho hai kết quả khác nhau | Hai cái điện thoại giống nhau trên bàn, một cái có case một cái không, cùng sạc, nhiệt kế đặt trên lưng mỗi cái | Hai nhiệt kế: một cột dốc lên nhanh, một cột dốc lên chậm | N1 |
| 23 | Vậy cái nóng lúc sạc là bình thường, và là dấu hiệu máy đang chạy | Quay lại bàn cạnh giường: điện thoại vẫn nằm đó, vẫn cắm sạc, màn hình vẫn sáng | Màn hình nhấp nháy đồng hồ sạc; máy hơi rung, đuôi cắm sạc ấm | N1 |
| 24 | Cái nóng bất thường là loại khác: nóng khi không sạc, hoặc nóng lệch một chỗ | Điện thoại nằm sấp mà không cắm sạc, vẫn ấm; một vệt đỏ lệch ở một góc lưng máy | Vệt đỏ lệch nhấp nháy ở một góc lưng, không lan đều | N1 |
| 25 | Việc người xem làm được ngay hôm nay | Trên bàn: ốp case bỏ ra sang một bên, củ sạc đúng chuẩn cắm lại, điện thoại nằm ở chỗ thoáng | Tay đặt ốp case sang bên, cắm lại củ sạc; máy nhấp nháy đồng hồ sạc | N1 |

## Chương

Không chia chương: dàn ý này dưới ngướng tám phút, và cả phim là **một hành trình liên tục** — đi vào củ sạc, đi vào máy, đi vào túi pin, rồi lùi ra vỏ máy và quay về cái bàn cạnh giường. Chia chương ở đây sẽ cắt đứt đúng cái mũi dây của câu hỏi (điện vào → điện nạp → nhiệt → nhiệt đi đâu), nên `src/chapters.js` không có.

## Shot list

Gom từ bảng ý → hình khi dựng: thời điểm · cảnh · máy làm gì · vì sao. Máy chỉ đi khi có lý do.

Đây là **32 nhát theo nhịp ý**: bảng ý → hình có 25 dòng, và mỗi dòng ý được chia thành một hoặc
hai nhát. Thời điểm dưới đây là ước tính từ lời kể; bản dựng hình thật của tập
là `LOOK.md`: **một câu lời kể một hình**, 95 hình, mỗi hình một bố cục riêng, máy cắt theo nhịp lời.

| Thời điểm | Cảnh | Máy | Vì sao |
|---|---|---|---|
| 0:00 | N1 · bàn cạnh giường, điện thoại nằm sấp, dây chạy ra ổ | Toàn cảnh, chếch 30° từ trên xuống, đứng yên | Người xem phải thấy ngay cái cảnh quen: một cái máy cắm sạc cạnh giường |
| 0:09 | N1 · cùng cảnh, bàn tay chạm lưng máy rồi rút lại | Đẩy nhẹ vào chỗ tay chạm | Chỉ có cảm giác tay chạm mới nói được "nóng" bằng hình |
| 0:26 | N1 · dòng hạt cyan từ củ sạc chạy vào cổng máy, một phần rơi ra thành hạt đỏ | Máy đi theo dòng hạt từ củ sạc tới cổng | Đặt quy luật "vào nhiều hơn nạp được" ngay trước khi đi vào bên trong |
| 0:47 | N2 · ổ cắm, phích cắm, dây nguồn, củ sạc | Lùi theo dây nguồn từ ổ cắm về củ sạc | Đường máy đi theo dòng điện, đúng như lời kể |
| 1:09 | N2 · củ sạc bị cưa mở, cuộn biến áp và con chip | Tiến vào nêm cắt, dừng ở cuộn biến áp | Chỗ đầu tiên điện bị thất thoát phải có hình thật |
| 1:17 | N2 · hạt cam lan ra từ cuộn biến áp, gợn nhiệt bốc lên mỏ tản nhiệt | Cận lên, chậm | Nhiệt phải được thấy là một thứ bay ra, không phải một màu |
| 1:31 | N3 · bóng cắt ngang điện thoại từ cổng USB-C | Đi xuyên qua cổng USB-C vào ruột máy | Chuyển tầng: từ củ sạc sang máy |
| 1:36 | N3 · cổng, bo mạch, con tụ, cuộn cảm, túi pin | Lùi dọc bo mạch về phía túi pin | Cho người xem thấy hết bốn vật nằm chung một khung trước khi tách ra |
| 1:39 | N3 · cận cổng và mạch sạc, hai mức điện áp đứng cạnh nhau | Cận, hơi chếch | Hai con số phải đứng cạnh nhau thì người xem mới hiểu vì sao phải hạ điện áp |
| 1:48 | N3 · cận cuộn cảm, hạt chuyển từ cyan sang cam | Cận sát cuộn cảm | Chỗ sinh nhiệt thứ hai phải tách biệt với chỗ thứ nhất |
| 2:08 | N3 · hạt cam lan trên bo mạch, dòng còn lại rơi xuống túi pin | Lùi nhẹ, nhìn theo dòng hạt xuống túi pin | Nối "mất" với "được giữ lại" trong cùng một hình |
| 2:15 | N3 · màn hình sáng, con chip xử lý, dòng hạt thứ hai chạy tới | Quay sang phía chip xử lý | Tầng thứ hai của hiện tượng: máy đang chạy |
| 2:26 | N3 · khung rộng ruột máy: hai vùng nóng cùng lúc | Lùi ra | Người xem phải thấy hai nơi nóng cùng lúc |
| 2:36 | N3 · cùng góc cận của cuộn cảm: lần đầu dòng hạt thưa, lần sau dày hơn và hạt đỏ nhiều hơn | Đứng yên, chỉ đổi trạng thái dòng điện | Sạc nhanh là dòng lớn hơn; so sánh trong **cùng một vật** |
| 2:53 | N3 · cảm biến nhiệt trên bo mạch, thang có vạch đỏ, dòng hạt chậm lại | Cận cảm biến | Máy tự bảo vệ: nóng quá thì giảm dòng; mốc của tế bào pin được chỉ đúng chỗ |
| 3:14 | N4 · túi pin bị cưa mở một góc, lộ các lớp | Tiến vào túi pin | Chỗ sinh nhiệt trong máy phải mở ra để xem |
| 3:17 | N4 · cận mặt cắt, từng lớp một màu | Cận, trượt dọc mặt cắt | Đọc được từng lớp trước khi hiểu điện bị cản ở đâu |
| 3:27 | N4 · dòng hạt bị điện trở bên trong tế bào cản lại | Đi theo dòng hạt | Hình của "điện trở bên trong tế bào" |
| 3:35 | N4 · các chỗ bị cản bừng sáng đỏ, nhiệt lan ra khắp mặt cắt | Cận nhất vào chỗ bị cản, rồi lùi | "À ra thế": cản lại thì sinh nhiệt, và nhiệt không thoát ra ngoài được |
| 3:43 | N5 · lưng máy bị cưa, ba luồng nhiệt dồn ở đây | Đi xuyên ra ngoài vỏ máy | Ba chỗ trong máy cùng đổ nhiệt vào một chỗ |
| 3:55 | N5 · gợn nhiệt bốc lên từ mặt lưng máy | Cận lưng máy | Nhiệt tỏa ra không khí |
| 4:00 | N5 · bàn tay đặt lên lưng máy, vệt nóng lan theo tay | Tiến theo bàn tay | Tay là miếng tản nhiệt lớn hơn không khí |
| 4:07 | N5 · ốp case úp lên máy, luồng nhiệt bị chặn ở vỏ case | Lùi, nhìn vỏ case | Ốp case giữ nhiệt, không phải làm máy nóng thêm |
| 4:20 | N1 · hai máy giống nhau, một có case một không, hai nhiệt kế | Toàn cảnh bàn | Thí nghiệm nhỏ: so sánh được bằng mắt |
| 4:30 | N1 · hai cột nhiệt kế dốc lên, một nhanh một chậm | Cận hai nhiệt kế | Con số đo được thay cho lời khẳng định |
| 4:39 | N1 · bàn cạnh giường, máy vẫn cắm sạc, màn hình vẫn sáng | Lùi ra, trở lại toàn cảnh mở đầu | Quay về hiện tượng, giờ đã hiểu |
| 4:47 | N1 · máy không cắm sạc vẫn ấm, một vệt đỏ lệch ở một góc lưng | Cận vào vệt đỏ | Cái nóng bất thường trông khác, phải thấy được sự khác — và phim không tự đoán nguyên nhân |
| 5:14 | N1 · ốp case bỏ sang một bên; củ sạc đúng chuẩn cắm lại | Toàn cảnh, đứng yên | Hai việc đầu người xem làm được hôm nay, không lời khuyên miệng |
| 5:21 | N1 · đồng hồ sạc nhích chậm trên màn hình; tay đặt máy xuống bàn, không cầm lên chơi game | Cận màn hình, rồi lùi | Sạc chậm thì dòng vào máy ít hơn, và đừng vừa sạc vừa chơi game |
| 5:30 | N1 · tay đưa về phía cái cáp ở cổng máy, dây vẫn cắm | Cận vào cổng | Lời khuyên có điều kiện ("nếu nóng bất thường"), nên hình vẫn giữ máy đang sạc |
| 5:35 | N1 · củ sạc trên bàn, gợn nhiệt bốc lên từ vỏ | Đi theo vệt nhiệt | Khép vòng: phần điện không nạp được thành nhiệt, và nhiệt thì tỏa ra |
| 5:42 | N1 · toàn cảnh: máy vẫn cắm sạc, vẫn ấm, đồng hồ sạc vẫn nhích | Đứng yên, trở lại đúng khung mở đầu | Máy không hỏng, nó đang làm việc |
