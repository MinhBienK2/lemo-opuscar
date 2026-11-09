# Dàn ý — Vì sao ngủ trưa dậy lại mệt?

Tập 01, cột `co-the` của kênh Trạm Nghĩ Nhiều. Chấm theo `.agents/skills/tram-nghi-nhieu/step1-outline/RUBRIC.md`.

## Độ dài

Ba tầng (hiện tượng → giấc ngủ sóng chậm → phân tử adenosine), bảng ý → hình có 21 dòng, dự kiến 58 câu lời kể, đọc chậm khoảng 2,9 phút.

Không ngắn hơn: bỏ mắt xích nào thì câu hỏi không được trả lời trọn. Bỏ "adenosine là thủ phạm" thì câu trả lời dừng ở "não còn lờ đờ" — người xem hỏi tiếp "tại sao não còn lờ đờ" thì hết. Bỏ "cảm thấy tỉnh nhưng đo thì tệ" thì mất đúng cái lật ngược của tập. Bỏ "buổi chiều là lúc tụt sẵn" thì người xem không hiểu vì sao đúng buổi chiều mà buổi sáng thì không sao.

Đã để ngoài: cơ chế thuốc và mọi bệnh lý về giấc ngủ (mất ngủ, ngủ rối loạn, ngủ quá nhiều); ca trực đêm; tác động của ngủ trưa lên tim mạch và trí nhớ dài hạn; mọi thứ liên quan tới cà phê ngoài đúng cái cơ chế chặn thụ thể.

## Câu hỏi, tách ra

- Câu hỏi: Vì sao ngủ trưa buổi chiều xong, dậy lại thấy mệt hơn lúc chưa ngủ?
- Chủ thể: giấc ngủ trưa buổi chiều, và cái lờ đờ ngay sau khi dậy · Thay đổi: từ "buồn ngủ" sang "lờ đờ hơn lúc chưa ngủ" · So với: so với lúc chưa ngủ, và so với một giấc ngủ trưa chỉ mười phút · Vì: vì dậy đúng lúc não đang ở giấc ngủ sóng chậm, lúc adenosine vừa tích lại trong não.
- **Câu trả lời một câu** (chủ ngữ là chủ thể): Một giấc ngủ trưa ngắn kéo bạn rơi vào giấc ngủ sóng chậm — nơi não chậm và nặng nhất — và lúc bạn mở mắt, adenosine trong não vừa tích lại lại làm não chậm đi, nên bạn dậy lại mệt hơn lúc chưa ngủ.

## Mở và kết

- Khung mở: buổi chiều, phòng ngủ, nắng xiên qua cửa sổ; đồng hồ báo thức trên bàn đầu giường sắp reo, tay người với ra chặn chuông, rồi người ngồi dậy — đầu nặng, cốc cà phê trên tay. Đồng hồ cho biết mới xế chiều.
- Kết: quay lại phòng ngủ, lần này đã sáng hơn; hai lối đi hiện trên màn hình — một chiếc đồng hồ đếm ngược ngắn, một tách cà phê — và câu chốt: bạn không hỏng, bạn chỉ dậy đúng lúc não còn chưa chạy được.

## Nơi chốn

| Nơi | Lớp của câu trả lời | Bộ có sẵn / tự dựng | Máy vào và ra thế nào |
|---|---|---|---|
| N1 · Phòng ngủ buổi chiều | Hiện tượng: buổi chiều ngủ trưa, dậy lại lờ đờ, và đường cong buồn ngủ buổi chiều | Tự dựng: giường, nệm, gối, chăn, bàn đầu giường, đồng hồ báo thức, cửa sổ có rèm, cây, tách cà phê | Mở tập ở đây; cuối tập quay lại đây. Từ đây máy đi thẳng vào đầu người đang nằm |
| N2 · Khối mô não trên bàn tối | Tầng một: giấc ngủ sóng chậm nằm ở đầu mỗi giai đoạn ngủ, và sóng đó to nhất lúc mới vừa nằm xuống | `rig/brain.js`: `brainSpace()`, `brainChunk()` | Máy đi từ phòng ngủ xuyên vào đầu, dừng sát mặt cắt của khối mô não; ra ngoài bằng cách lùi ra khỏi mô não về phòng ngủ |
| N3 · Khe giữa hai tế bào | Tầng hai: phân tử adenosine, hàng thụ thể, và phân tử caffeine chặn cửa | `rig/brain.js`: `neuron()`, `receptors()`, `molecules()` | Máy đi sâu hơn, từ mặt cắt của mô não xuống một khe synapse; cuối tập máy lùi ra, quay về phòng ngủ |

## Vật lên hình

| Vật (và trạng thái) | Bộ phận đặc trưng | Từ rig hay tự dựng |
|---|---|---|
| chiếc giường buổi trưa (chăn nhàu, gối bẹp) | bốn chân, ván giường, nệm, gối, chăn nhàu lệch một bên | tự dựng |
| đồng hồ báo thức (đang reo, chân rung) | vỏ tròn, hai tai, hai chân, mặt số hai kim, hai chuông trên đỉnh | tự dựng |
| khối mô não (thở theo sóng chậm) | nếp nhăn lên xuống, mặt cắt có vỏ và chất trắng, mặt cắt có các đốm nhân tế bào | `rig/brain.js` `brainChunk()` |
| tế bào thần kinh (nhánh, đuôi, củ) | thân bị bóp, nhân, một đuôi dài có đoạn myelin, củ ở cuối đuôi | `rig/brain.js` `neuron()` |
| hàng thụ thể (cửa trên mặt tế bào đối diện) | hàng protein đứng, mỗi cái có một khía hình chữ nhật | `rig/brain.js` `receptors()` |
| đám phân tử adenosine | quả cầu nhỏ phát sáng lơ lửng, xanh lơn | `rig/brain.js` `molecules()` |
| phân tử caffeine (ngồi trong khía) | hai vòng cơ dính nhau, ba nhóm metyl, hai nguyên tử oxy | tự dựng theo công thức |

Bàn tay người, tách cà phê, cây, rèm cửa, bàn đầu giường là bối cảnh của N1, không tách thành vật riêng; bàn tay dựng bằng `rig/fx.js` `buildHand()`.

## Thứ vô hình

- **Sóng chậm của giấc ngủ sâu** — sinh ra từ nếp não, chạy dọc theo mặt cắt của khối mô não; nó phồng to ngay lúc mới nằm xuống rồi nhỏ dần. Dựng bằng `brainChunk().wave(t, k)`.
- **Mức adenosine tích tụ** — sinh ra từ hoạt động của tế bào thần kinh, bay trong khe synapse; nó dày lên khi bạn thức và mỏng đi khi bạn ngủ. Dựng bằng `molecules().fill(box, count)`.
- **Tín hiệu buồn ngủ** — chạy từ phân tử adenosine tới khía của một thụ thể và bám vào đó; tín hiệu chỉ tồn tại khi khía còn trống. Dựng bằng cách cho phân tử dồn vào khía của `receptors().doors[i].notch`.
- **Cà phê chặn cửa** — một phân tử caffeine nằm vừa khít trong khía của thụ thể, khiến phân tử adenosine không còn chỗ bám. Dựng bằng cách đặt phân tử caffeine vào đúng khía.

## 3 khung hero

1. **Buổi chiều trong phòng ngủ.** Điểm nhìn hơi từ trên xuống, sát gối. Nguồn sáng: nắng chiều vàng ấm từ cửa sổ, cộng một vệt sáng nhỏ rơi lên mặt đồng hồ báo thức. Ba lớp sâu: gối và mép chăn ở tiền, đồng hồ báo thức ở giữa, cửa sổ và rèm ở xa. Màu nhấn: đỏ của hai chuông đồng hồ.
2. **Trong não.** Điểm nhìn thấp, sát mặt cắt của khối mô não trên bàn tối. Nguồn sáng: một vệt sáng ấm trên mặt cắt, phần còn lại chìm. Ba lớp sâu: mặt cắt ở tiền, nếp nhăn ở giữa, bàn và bóng ở xa. Màu nhấn: hồng tím của mô não, sóng chậm màu cam.
3. **Khe synapse.** Điểm nhìn nhìn thẳng vào khe giữa củ tế bào thần kinh và hàng thụ thể. Nguồn sáng: ánh sáng tím nhạt từ phía trên, phân tử adenosine tự phát sáng. Ba lớp sâu: củ tế bào thần kinh ở tiền, khe và đám phân tử ở giữa, hàng cửa thụ thể ở xa. Màu nhấn: xanh lơn của adenosine, vàng của caffeine.

## Bảng ý → Hình

| # | Ý | Trên màn hình thấy gì | Vật nào làm gì | Nơi |
|---|---|---|---|---|
| 1 | Buổi chiều ngủ trưa xong, dậy lại thấy nặng đầu hơn lúc chưa ngủ. | Phòng ngủ, nắng chiều xiên qua cửa sổ; đồng hồ báo thức reo, tay người với ra chặn chuông, người ngồi dậy với cốc cà phê trên tay. | Đồng hồ rung chân; chăn phập phồng rồi đứng lại. | N1 |
| 2 | Ba mươi phút ngủ trưa không phải nghỉ chút, mà là một giấc ngủ thật. | Hai thanh ngủ kéo dài nằm ngang trên nền phòng: một thanh ngắn, một thanh dài gấp ba. | Thanh dài ra từng đoạn khi giọng kể đọc số. | N1 (trên nền) |
| 3 | Trong ba mươi phút đó có mười lăm phút ngủ sóng chậm; mười phút thì gần như không có. | Phần cuối của thanh dài đổi sang màu khác và dày lên; thanh ngắn giữ nguyên một màu. | Mảnh màu ngủ sóng chậm trồi lên từ đáy thanh. | N1 (trên nền) |
| 4 | Ngủ sóng chậm không nằm giữa đêm mà nằm ở *đầu* mỗi giai đoạn ngủ. | Máy đi thẳng vào đầu người đang nằm: một khối mô não trên bàn tối, nếp nhăn phồng lên rồi hạ xuống. | Sóng chạy dọc mặt cắt, biên độ lớn nhất ở đầu. | N2 |
| 5 | Nên lúc mới vừa nằm xuống, não đã ở chỗ sâu nhất rồi. | Cùng khối mô não, nhưng góc máy nghiêng lên nhìn nếp nhăn phồng cao. | Biên độ nếp nhăn lớn dần, rồi chững lại. | N2 |
| 6 | Đồng hồ báo thức thường reo đúng lúc não đang sâu nhất. | Quay lại phòng ngủ: đồng hồ báo thức reo trên bàn đầu giường, tay người với ra chặn. | Chuông rung; mặt số của đồng hồ chỉ xế chiều. | N1 |
| 7 | Dậy rồi thì cả người còn chậm: đó là lúc "lờ đờ". | Người ngồi dậy, cốc cà phê trong tay, mọi cử động dứt khoảng giữa chừng rồi mới đến. | Cốc cà phê run nhẹ trên tay rồi đứng yên. | N1 |
| 8 | Lờ đờ thì đo được, không phải tưởng. | Một lưới điểm đo phản xạ trên màn hình: điểm tụt thành một vết lớn ngay sau khi dậy, rồi rải ra. | Các điểm tụt dần theo thời gian. | N1 (trên nền) |
| 9 | Nhưng cảm giác thì lại sai: mình thấy mình đã tỉnh, trong khi đo thì tệ hơn lúc chưa ngủ. | Hai cột cạnh nhau: cột "mình thấy" cao lên, cột "đo được" thấp xuống. | Hai cột dựng lên bằng hai mảnh gỗ, chạy ngược chiều nhau. | N1 (trên nền) |
| 10 | Vậy thì bên trong não đang xảy ra gì lúc dậy? | Máy đi sâu hơn vào mô não, tới một khe hở giữa hai tế bào. | Camera tiến vào khe giữa củ tế bào và hàng thụ thể. | N2 → N3 |
| 11 | Trong não có một thứ tích lại suốt lúc bạn thức: adenosine. | Một đám quả cầu nhỏ xanh lơn lơ lửng trong khe, lúc đầu thưa. | Các quả cầu trôi chậm trong khe. | N3 |
| 12 | Nó bám vào một khía trên thụ thể, và khía đó báo cho não biết buồn ngủ. | Một quả cầu xanh dừng lại đúng trong khía của một cửa; cửa đó sáng lên. | Phân tử dồn vào khía của cửa thứ ba. | N3 |
| 13 | Lúc bạn dậy, lượng adenosine vừa tích lại được nhiều — đây mới là thủ phạm. | Khe chật lại, đám phân tử dày lên, nhiều cửa cùng sáng. | `molecules.fill` với số lượng tăng dần. | N3 |
| 14 | Nó làm não chậm đi đúng lúc não còn phải chuyển từ ngủ sang thức. | Bên khe, các củ tế bào thần kinh sáng lên một cách lười biếng rồi mới nhịp điệp. | Điện phát sáng chạy trên đuôi tế bào, khởi động chậm. | N3 |
| 15 | Cà phê không xoá adenosine — nó chiếm chỗ của adenosine trên cửa thụ thể. | Một phân tử màu vàng (cấu trúc hai vòng, ba nhóm metyl) bay tới và nằm vừa khít trong khía của một cửa. | Phân tử vàng từ từ chui vào khía. | N3 |
| 16 | Nên adenosine tới không còn chỗ bám, và cơn lờ đờ biến mất. | Các phân tử xanh lật quanh phân tử vàng rồi trôi đi; các cửa tắt dần. | Đám phân tử đẩy ra khỏi vùng cửa đang bị chặn. | N3 |
| 17 | Vì sao hay xảy ra vào buổi chiều? Vì buổi chiều là lúc tỉnh táo tụt sẵn theo nhịp ngày. | Quay lại phòng ngủ; trên tường một vạch buồn ngủ vẽ hình chữ V, đi xuống lúc xế chiều rồi đi lên lúc tối. | Vạch sáng trên tường chạy chậm. | N1 |
| 18 | Cái điểm xuống đó có sẵn trong người, không cần ăn gì cả. | Bàn đầu giường trống — không có đồ ăn, không có cốc nước — trong khi vạch buồn ngủ vẫn đi xuống. | Vạch trên tường vẫn đi xuống. | N1 |
| 19 | Muốn dậy mà không bị lờ đờ thì giữ giấc trưa ở mức ngủ nông. | Quay vào não: nếp nhăn chỉ nhấp nhô nhẹ, sóng nhỏ, không phồng to. | Biên độ sóng nhỏ, đều. | N2 |
| 20 | Hoặc uống cà phê: chặn cửa thụ thể thì cơn lờ đờ không có đất để bám. | Quay lại khe synapse: phân tử vàng nằm trong khía, cửa tắt, cục tế bào sáng lên đều. | Điện phát sáng chạy đều trên đuôi tế bào. | N3 |
| 21 | Bạn không hỏng. Bạn chỉ dậy đúng lúc não còn chưa chạy được. | Quay lại phòng ngủ, lần này cửa sổ đã sáng hơn; người đứng dậy, cốc cà phê trên tay, đi ra khỏi khung hình. | Rèm được kéo sang, ánh sáng vào rộng hơn. | N1 |

## Chương

Tập dài dưới ba phút, không chia chương, không có `src/chapters.js`. Ba tầng của câu trả lời được phân biệt bằng ba nơi chốn (N1, N2, N3), không bằng tiêu đề chương.

## Shot list

| Thời điểm | Cảnh | Máy | Vì sao |
|---|---|---|---|
| 0:00 | N1, giường, tay với ra chặn chuông đồng hồ | Đẩy chậm từ cửa sổ về phía bàn đầu giường | Đưa người xem vào đúng nơi câu hỏi xảy ra, trước mọi lý do |
| 0:08 | N1, ngồi dậy với cốc cà phê | Máy lùi nhẹ, giữ người ở giữa khung | Hiện tượng đang xảy ra trước mắt |
| 0:16 | N1, hai thanh ngủ | Máy đứng yên, hai thanh nằm ngang giữa khung | Số cần đếm phải có chỗ đứng, không phải lời |
| 0:24 | N1, phần ngủ sóng chậm đổi màu trên thanh dài | Máy tiến nhẹ vào giữa hai thanh | Người xem phải so sánh được hai thanh |
| 0:32 | N2, khối mô não trên bàn tối | Máy đi từ phòng ngủ xuyên thẳng vào đầu, rồi dừng | Câu hỏi đổi chỗ: từ phòng sang bên trong |
| 0:40 | N2, nếp nhăn phồng lên | Máy nghiêng lên nhìn nếp | Cho thấy "đầu giai đoạn ngủ" là chỗ nào |
| 0:48 | N1, đồng hồ báo thức reo | Cắt cứng, không chuyển động | Cú cắt nối "não sâu nhất" với "đồng hồ reo" |
| 0:56 | N1, cốc cà phê trên tay, cử động dừng giữa chừng | Máy ghép từ cốc lên mặt người | Cơn lờ đờ phải thấy được qua vật, không kể bằng lời |
| 1:04 | N1, lưới điểm đo phản xạ | Máy đứng yên, lưới nằm giữa khung | Đo thì mới gọi được tên cơn lờ đờ |
| 1:12 | N1, hai cột "mình thấy" và "đo được" | Máy lùi nhẹ, hai cột cạnh nhau | Lật ngược: cảm giác không đáng tin |
| 1:20 | N3, khe synapse | Máy đi sâu từ mặt cắt mô não xuống khe | Câu hỏi đổi tầng: từ não sang phân tử |
| 1:28 | N3, đám phân tử xanh trôi trong khe | Máy trôi ngang theo khe, chậm | Nơi chốn phải được đi qua, không phải cắt thẳng vào |
| 1:36 | N3, phân tử dồn vào khía của một cửa | Máy đẩy nhẹ vào cửa thứ ba | Khái niệm "bám vào thụ thể" cần hình ngay lúc được nói |
| 1:44 | N3, khe chật lại, nhiều cửa sáng | Máy lùi ra, khung rộng lại | Số lượng tăng phải thấy bằng khung rộng |
| 1:52 | N3, điện phát sáng chạy chậm trên đuôi tế bào | Máy đi theo chiều đuôi tế bào | Chứng minh bằng một vật đang chạy |
| 2:00 | N3, phân tử caffeine bay tới và nằm trong khía | Máy giữ nguyên, phân tử vàng tự bay vào chỗ | Hành động do vật tự làm, không cần cắt |
| 2:08 | N3, adenosine bị đẩy ra, cửa tắt dần | Máy lùi nhẹ | Thấy hậu quả ngay trong khung |
| 2:16 | N1, vạch buồn ngủ trên tường đi xuống lúc xế chiều | Máy nghiêng lên nhìn vạch trên tường | Đưa nhịp ngày vào cảnh, không vào lời |
| 2:24 | N1, bàn đầu giường trống | Máy trượt ngang bàn | Chứng minh "không cần ăn gì" bằng cái trống |
| 2:32 | N2, nếp nhăn nhấp nhô nhẹ | Máy đứng yên, cùng góc với lúc trước | Đối chiếu trực tiếp với khung sóng to |
| 2:40 | N3, phân tử vàng trong khía, cửa tắt | Máy lùi ra, khung rộng | Lối thứ hai cũng có hình |
| 2:48 | N1, người đứng dậy, cửa sổ sáng hơn, đi ra khỏi khung | Máy lùi ra cửa sổ, theo người đi | Câu chốt cần một hành động, không cần một lời giải thích |
