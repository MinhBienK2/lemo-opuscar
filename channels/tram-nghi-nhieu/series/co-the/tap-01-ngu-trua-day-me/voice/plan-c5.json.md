# Kế hoạch hình — Chương 5 (c161–c200)

Tập: `series/co-the/tap-01-ngu-trua-day-me` — "Vì sao ngủ trưa dậy lại mệt hơn lúc mới ngủ?"

**Nơi chốn chính:** bàn làm việc của chương 1, bây giờ là buổi chiều rồi buổi tối (`rig/sets.js: desk` với `time: 'evening'`, sau đó `'night'`; ánh sáng cửa sổ đổi màu theo giờ).
**Hai đoạn cắt ngắn vào bên trong não** (tái dùng bộ dựng của chương 2 và 3) đúng lúc lời kể dẫn vào đó: c163–c168 (độ sâu của giấc ngủ) và c181/c185–c186 (cà phê tới nơi chặn adenosine). Mọi câu còn lại diễn ra ngay trên bàn.

**Đạo cụ dùng trong chương này**
- `props.js: phone` — điện thoại trên bàn, màn hình hiện giờ và ô báo thức (`setTime`).
- `props.js: napCushion` — gối áo gấp, có chỗ lún của người nằm.
- `props.js: coffeeCup` — tách cà phê, có sợi hơi nước (`updateSteam`).
- `props.js: bodyClock` — đồng hồ nhỏ có kim giây làm được việc gì đó.
- `props.js: clockRing` — vòng đồng hồ đồng, chia 24 vạch, khắc số giờ 1–24.
- `rig/sets.js: clock` — đồng hồ tường, kim chỉ 24 giờ (`ck.tick(t, hours)`).
- `rig/brain.js` — mặt cắt não, khe synapse, mạch máu (`capillary`), `receptors`, `molecules`.
- `rig/fx.js: flow` — dòng hạt chạy trong mạch máu; `buildHand()` — bàn tay đồ chơi.

**Thẻ chữ của chương này:** `HAI MƯỜI PHÚT` (c164) và `TRƯỚC BA GIỜ CHIỀU` (c177). Mỗi thẻ chỉ hiện một lần.

| câu | ý | trên màn hình thấy gì | vật nào làm gì |
|---|---|---|---|
| c161 | Quay lại bàn làm việc, giờ hỏi tiếp: ngủ trưa bao lâu | Toàn cảnh bàn làm việc buổi chiều muộn: cửa sổ đổi sang màu cam, đèn bàn đã bật, đồng hồ tường ở khung giờ chiều, trên bàn là cái gối áo gấp và chiếc điện thoại úp sấp | Đèn bàn (`lamp`) sáng dần; ánh sáng cửa sổ lệch sang màu chiều; kim đồng hồ tường dịch sang giờ chiều |
| c162 | Báo thức ngủ trưa: mười phút hay hai mươi phút | Cận cảnh chiếc điện thoại nằm cạnh gối áo, màn hình mở ô báo thức, hai mốc thời gian nằm chồng lên nhau; ngón tay bấm vào mốc mười phút rồi trượt sang mốc hai mươi phút | Ngón tay (`buildHand`) bấm và kéo trên màn hình điện thoại, hai con số trên màn hình dịch chuyển theo; gối áo bị đẩy nhẹ khi tay chạm qua |
| c163 | Muốn biết đáp án thì phải xem giấc ngủ trôi sâu bao lâu | Cắt vào não: mặt cắt tế bào với một chiếc đồng hồ nhỏ đặt cạnh, phía trong là vùng não sâu còn tối | Chiếc đồng hồ nhỏ trong não bắt đầu chạy, kim phút nhích; vùng sâu chưa sáng |
| c164 | Con số: từ mười đến hai mươi phút là đủ | Cùng cảnh não: kim phút tới vạch hai mươi phút, vùng sâu vẫn tối; thẻ `HAI MƯỜI PHÚT` neo vào vạch đó | Kim phút dừng ở vạch hai mươi phút, thẻ chữ hiện lên rồi mờ đi |
| c165 | Giấc ngủ trưa có chạm giấc ngủ sâu thì kèm cơn lười và đêm ngủ ít đi | Não: kim phút vượt qua vạch ba mươi phút, vùng sâu bắt đầu sáng; trên mặt đồng hồ nhỏ, cung tối đánh dấu ban đêm bị che dần | Vùng não sâu sáng lên dần (ánh sáng lan trong mô); cung tối ban đêm trên mặt đồng hồ bị lấp đi |
| c166 | Giấc ngủ trưa ngắn, mười tới hai mươi phút, thì không có cơn lười | Não: kim phút lùi về vạch hai mươi phút, vùng sâu vẫn tối, vùng tỉnh dậy ở trên sáng lên nhanh | Vùng "tỉnh dậy" sáng nhanh từ trong ra ngoài, không có độ trễ |
| c167 | Vì ba mươi phút là đã chạm vào giấc ngủ sâu | Não: kim phút vượt vạch ba mươi phút lần nữa, vùng sâu sáng hẳn lên, ánh sáng xuống tới tận mạch máu | Vùng sâu sáng đục; dòng chất lải rác trong kênh quanh mạch chuyển động mạnh |
| c168 | Dậy đúng lúc đó thì lờ đờ hơn lúc mới nằm xuống | Bàn: bàn tay đưa ra lấy tách cà phê nhưng run, tách bị đẩy nghiêng, nước tràn ra mặt bàn; đồng hồ tường đã nhích sang giờ sau | Tay cầm tách lệch, nước cà phê tràn thành vệt trên mặt bàn; kim đồng hồ tường quay nhanh rồi dừng |
| c169 | Giấc ngủ trưa dài lấy mất phần giấc ngủ của đêm | Cùng chiếc đồng hồ nhỏ trong não, cung tối ban đêm bị che hẳn một đoạn | Đoạn che trên cung ban đêm lan rộng thêm, vạch của đêm kia mất dần |
| c170 | Câu hỏi kế tiếp: ngủ trưa vào lúc nào | Quay ra bàn: vòng đồng hồ đồng 24 vạch được đặt lên mặt bàn, ánh sáng chiều lướt qua từng vạch | Vòng đồng hồ xoay chậm, các vạch khắc số lần lượt đi qua dưới ánh sáng |
| c171 | Chiếc đồng hồ chia hai mươi bốn giờ | Cận cảnh vòng đồng hồ đồng trên bàn, hai mươi bốn vạch khắc số từ 1 đến 24 nằm quanh vòng | Vòng xoay từ từ, ánh sáng bám theo vạch khắc số để người xem đếm được |
| c172 | Buổi chiều là lúc thấp nhất của nhịp sinh học | Vòng đồng hồ bị uốn cong: đoạn buổi chiều chùng xuống thấp nhất, mảng sơn trên đoạn đó được tô đậm | Đoạn buổi chiều hạ xuống đúng một đoạn, màu sơn trên đoạn đó đậm dần lên |
| c173 | Giấc ngủ trưa buổi chiều là phổ biến nhất | Bàn: gối áo gấp đã có chỗ lún, điện thoại đặt cạnh với giờ báo thức rơi đúng vào đoạn sơn đậm | Chỗ lún trên gối áo hằn rõ dưới ánh sáng; vạch trên vòng đồng hồ ở đúng vị trí báo thức |
| c174 | Buổi sáng còn chưa ở chỗ thấp nhất, nên ít ai ngủ trưa buổi sáng | Vòng đồng hồ: đoạn buổi sáng ở trên cao, sáng và thẳng; đoạn buổi chiều chùng xuống và tô đậm; ngón tay kéo dòng báo thức từ sáng sang chiều | Đoạn buổi sáng giữ nguyên độ cao, đoạn buổi chiều chùng thấp; ngón tay kéo báo thức dọc theo vòng |
| c175 | Giờ ngủ trưa còn quyết định cả đêm hôm đó | Vòng đồng hồ nhìn từ trên xuống, cung ban đêm nằm ở một phía, và bóng của gối áo đổ sang phía đêm | Bóng gối áo lan dần lên cung ban đêm khi đoạn buổi chiều được tô đậm đậm hơn |
| c176 | Ngủ trưa càng muộn trong chiều muộn, đêm càng bị rút ngắn | Cùng vòng đồng hồ: mảng sơn đậm của chiều muộn tràn sang cung ban đêm, phần ban đêm còn lại co lại | Mảng sơn đậm dịch chuyển sang cung đêm; các vạch đêm bị phủ và biến mất dần |
| c177 | Mốc thực dụng: trước ba giờ chiều | Vòng đồng hồ: một chiếc kẹp đồng nhỏ được gắn vào vạch số 15, ngay trước mảng sơn đậm của buổi chiều; thẻ `TRƯỚC BA GIỜ CHIỀU` neo vào kẹp | Kẹp đồng khép vào vạch 15, thẻ chữ hiện lên cạnh kẹp |
| c178 | Đây là ranh giới thực dụng, không phải luật cứng | Cùng vòng đồng hồ: kẹp đồng nằm nguyên trên vạch, còn vòng đồng hồ xoay trượt qua dưới kẹp | Vòng xoay đều dưới kẹp, vạch 15 đi qua rồi vạch 16, vị trí kẹp không đổi theo vòng |
| c179 | Ngủ trưa lúc đó thì đêm ngủ được nhiều hơn | Vòng đồng hồ: mảng sơn đậm bị kéo lùi về trước mốc ba giờ chiều, cung ban đêm nở ra trở lại | Mảng sơn buổi chiều lùi lại, các vạch đêm hiện ra đủ, bóng gối áo rút khỏi cung đêm |
| c180 | Cách nữa: uống cà phê rồi nằm xuống ngay | Bàn: tách cà phê còn bốc hơi, đồng hồ nhỏ cạnh tách, gối áo gấp đã sẵn sàng | Tay rót cà phê vào tách, sợi hơi nước (`updateSteam`) cuộn lên; tay đặt tách xuống cạnh gối |
| c181 | Cà phê không tạo sức, nó chặn cửa buồn ngủ | Cắt vào khe synapse (tái dùng chương 2): phân tử cà phê ngồi chặn trên cửa thụ cản, dòng adenosine dồn tới rồi bị chặn lại | Phân tử adenosine tràn tới cửa, va vào phân tử cà phê rồi dạt ngược ra; phân tử cà phê giữ nguyên chỗ |
| c182 | Cà phê làm việc chậm: phải chờ khoảng ba mươi phút | Bàn: đồng hồ nhỏ cạnh tách cà phê, kim giây bắt đầu chạy từ số không; hơi nước trên tách vẫn bốc | Kim giây đồng hồ nhỏ quay đều; sợi hơi nước xoắn chậm hơn một chút |
| c183 | Uống xong mà ngồi chờ thì chịu buồn ngủ cả lúc dài | Bàn lúc tối dần: bàn tay gõ ngón tay lên mặt bàn, đèn bàn hơi tối đi, kim giây đồng hồ nhỏ vẫn quay | Ngón tay gõ nhanh hơn theo nhịp; ánh sáng đèn bàn giảm dần; kim giây không ngừng |
| c184 | Nằm xuống luôn thì lúc chờ trôi qua trong giấc ngủ | Bàn: gối áo gấp bị đầu người ép lún xuống, tách cà phê đặt ở chỗ khác, hơi nước vẫn bay | Gối áo bị lún dần theo trọng lượng; tay kéo gối áo ra chỗ nằm; đồng hồ nhỏ vẫn đếm |
| c185 | Trong lúc nằm, cà phê đi theo dòng máu lên não | Cắt vào mạch máu trong não: dòng hạt cà phê chạy dọc lòng mạch, phía trước là khe synapse | Dòng hạt (`flow`) chảy theo lòng mạch, dòng chất lải rác bị đẩy sang bên; hạt cà phê đi thẳng về phía khe synapse |
| c186 | Sau khoảng ba mươi phút, phân tử cà phê ngồi chặn cửa | Khe synapse: phân tử cà phê rời dòng máu, bay vào cửa thụ cản và nằm vị trí chặn | Phân tử cà phê rời dòng, chui vào cửa; dòng adenosine phía sau bị chặn và dạt ngược |
| c187 | Mở mắt ra đúng lúc ấy thì không còn buồn ngủ để chịu | Bàn: bàn tay với lấy tách cà phê thẳng, không vấp, nước không tràn; đồng hồ nhỏ đã quay tới vạch ba mươi phút | Tay cầm tách vững, nước không tràn; kim đồng hồ nhỏ dừng ở vạch ba mươi phút |
| c188 | Vì thế phải uống trước rồi mới nằm xuống | Bàn: tách cà phê được đặt xuống trước, rồi gối áo mới được kéo ra; hai việc đó diễn ra đúng thứ tự trong khung | Tay đặt tách xuống, sau đó mới kéo gối áo ra; đồng hồ nhỏ vẫn đang đếm |
| c189 | Uống sau thì cà phê còn đang trên đường | Cắt vào mạch máu: hạt cà phê vẫn còn ở giữa dòng, cửa thụ cản phía khe synapse vẫn trống | Hạt cà phê trôi chậm hơn, chưa tới cửa; cửa thụ cản trống, không có gì chặn |
| c190 | Cà phê và giấc ngủ trưa chỉ là miếng băng dán tạm | Bàn: một miếng băng cá nhân nhỏ được dán lên đúng chỗ lún trên gối áo, mép băng còn hơi nhăn | Tay bóc miếng băng ra, dán lên chỗ lún, miếng băng ép xuống vải theo độ cong của chỗ lún |
| c191 | Giấc ngủ trưa lấy bớt áp lực ngủ (cách giải thích từ cơ chế, không phải từ số liệu) | Não: khe synapse lúc tối, lớp phân tử adenosine đã vơi đi so với buổi sáng; đồng hồ nhỏ chuyển sang giờ tối | Lớp phân tử trong khe rút lại, để trống chỗ trống; kim đồng hồ nhỏ quay sang phía ban đêm |
| c192 | Tối đó ta ngủ ít đi, sáng hôm sau vẫn mệt vì giấc ngủ trưa không bù được phần thiếu ban đêm | Bàn lúc sáng sớm: bàn tay đẩy tách cà phê chậm rãi, vệt cà phê cũ đã khô trên mặt bàn | Tay chậm, tách bị đẩy lệch chỗ; vệt cà phê cũ khô, đục màu hơn |
| c193 | Gốc rễ nằm ở đêm chứ không ở cái gối áo trên bàn | Bàn buổi tối: cái gối áo gấp vẫn còn trên bàn với chỗ lún, đèn bàn hạ xuống, cửa sổ đã tối | Đèn bàn hạ dần, phòng chìm vào màu tối; chỗ lún trên gối áo vẫn còn, chưa ai vuốt lại |
| c194 | Điểm trũng buổi chiều là của nhịp sinh học chứ không của đêm qua | Vòng đồng hồ: đoạn lõm buổi chiều vẫn còn nguyên, và cung ban đêm đã dài đủ | Đoạn buổi chiều giữ nguyên độ cong; các vạch đêm đủ dài, không bị mảng sơn buổi chiều lấn vào |
| c195 | Quay lại câu hỏi lúc đầu: dậy giữa chừng giấc ngủ sâu thì não chưa kịp lên tốc | Quay ngược về đúng khung mở đầu: bàn lúc mười ba giờ bốn mươi phút, đồng hồ tường chỉ đúng giờ đó, bàn tay đưa ra lấy tách cà phê chậm và nặng | Kim đồng hồ tường quay ngược về vị trí mười ba giờ bốn mươi phút (dấu hiệu tua ngược); tay chậm, tách suýt tuột khỏi tay |
| c196 | Đêm qua ngủ đủ thì giấc ngủ trưa chỉ là một khoảng nghỉ ngắn | Bàn buổi chiều: gối áo phẳng, tách cà phê còn đầy, bàn tay cầm bút viết trên tờ giấy để trên bàn | Tay viết đều tay, không dừng lại; cà phê trong tách chưa bị uống; gối áo phẳng, không ai nằm lên |
| c197 | Giấc ngủ trưa cứ ngắn và ngủ sớm, phần thiếu đêm bù lại | Bàn: điện thoại đặt cạnh gối, ô báo thức được kéo về khoảng hai mươi phút; vòng đồng hồ bên cạnh với mảng sơn buổi chiều còn nguyên | Ngón tay kéo báo thức về mốc hai mươi phút; mảng sơn buổi chiều không lan sang cung đêm |
| c198 | Gối áo gấp lại cất đi, đêm thì đi ngủ đúng giờ | Bàn buổi tối: tay gấp chiếc gối áo và đưa vào ngăn kéo, đèn bàn tắt dần, đồng hồ tường ở giờ đi ngủ | Tay gấp gối áo, kéo ngăn kéo đóng lại; đèn bàn (`lamp`) tắt dần; đồng hồ tường nhích sang giờ ngủ |
| c199 | Nếu có ngủ trưa thì cứ ngắn thôi | Vòng đồng hồ cận cảnh: kẹp đồng ở vạch 15, mảng sơn buổi chiều không lấn sang cung đêm, cung đêm còn nguyên | Vòng xoay chậm qua kẹp; mảng sơn buổi chiều không đổi; các vạch đêm đủ và rõ |
| c200 | Kết: ngủ trưa dậy lại mệt vì bị đánh thức giữa chừng giấc ngủ sâu, cách thật sự là ngủ đủ ban đêm | Toàn cảnh bàn buổi tối: phòng tối, chỉ đèn bàn và đồng hồ tường còn sáng, tách cà phê bốc hơi, điện thoại úp xuống; máy quay lùi ra xa | Đèn bàn sáng yếu dần, đồng hồ tường vẫn chạy; sợi hơi nước trên tách cà phê bốc lên; máy quay lùi chậm ra xa |
