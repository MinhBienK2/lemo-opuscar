# LOOK — Vì sao điện thoại nóng lúc sạc?

Khung hình của tập, làm theo `STYLE.md` của kênh. Bản dựng hình thật là `src/film.js`; bảng
này là **ý của từng nhát**: mỗi câu kể một hình, một bố cục riêng, máy cắt theo nhịp lời.

Nguyên tắc: **không nhát nào là một tấm thẻ chữ**. Mọi câu đều có một vật thật đang làm việc
trong khung; chữ chỉ là thẻ bám vào vật đó.

## Bố cục thế giới

Một căn phòng tối về đêm, có **bàn gỗ cạnh giường** (N1) và bốn nơi chốn bên trong vật.
Mặt bàn ở `y = 0`, tường sau lưng ở `z ≈ −0.62`. Đèn bàn ấm ở góc phải của bàn, đổ một vệt
sáng vàng ấm lên mặt bàn — vệt sáng này là **nguồn sáng dẫn** của toàn bộ N1, không phải đèn trần.

| Nơi chốn | Toạ độ chính | Vai trò |
|---|---|---|
| **N1 · bàn cạnh giường** | mặt bàn `y = 0`, tường `z = −0.62`, ổ cắm `x ≈ −0.78` | mở đầu (c1–c13), thí nghiệm hai máy (c61–c66), quay lại bàn (c67–c68), kết và lời khuyên (c79–c91, c94–c95) |
| **N2 · trong củ sạc** | củ sạc đã cưa, nền tối, một vệt sáng từ đèn bàn | nơi điện bị thất thoát lần thứ nhất (c14–c23) |
| **N3 · trong điện thoại** | khung máy đã cưa, bo mạch giữa, túi pin một bên | nơi điện bị thất thoát lần thứ hai (c24–c41), sạc nhanh và cảm biến nhiệt (c69–c78) |
| **N4 · trong túi pin** | mặt cắt túi pin phóng to, các lớp xếp sát | chỗ nhiệt sinh ra bên trong tế bào (c42–c49) |
| **N5 · vỏ máy và bàn tay** | lưng máy, ốp case, bàn tay | ba nguồn nhiệt gom về vỏ, rồi tay và ốp case (c50–c60) |

**Tính liên tục không gian:** N3 là **chính cái máy** ở N1, bị cưa ngang; N4 là **chính túi
pin** trong N3, phóng to; N5 là **chính vỏ máy** ở N3, nhìn từ phía ngoài. Hành trình đi **một
chiều**: N1 → N2 → N3 → N4 → N5 → N1 — ngoại lệ duy nhất là c50: câu "giờ gom lại" quay
lại N3 đúng một nhát, để thấy đủ ba nguồn nhiệt trong một khung, rồi N5 tiếp tục. Không có nơi chốn nào là
một mảng trống: mỗi nơi có vật chính chiếm giữa khung, một nguồn sáng dẫn, và một khoảng
trống sạch ở góc trên-trái để đặt thẻ chú thích.

**Ánh sáng:** mỗi nơi một đèn chính (`keyLight`) + `ambience`; ở N2/N3/N4 có thêm một vệt sáng
hẹp (`beam`) dẫn vào đúng cơ chế đang được nói. Không khung nào tối mờ mịt.

## 93 nhát: một câu một hình

| # | câu | nhìn gì | lý do của góc máy | nhãn |
|---|---|---|---|---|
| 1 | c1 | trung ngang mặt bàn: điện thoại úp sấp chiếm khoảng 45% bề ngang, dùng rig chung `RIG_OPEN` (tiêu cự 26°), dây sạc cắm vào cổng máy, hạt dòng điện chạy dọc dây rồi rời khỏi khung | người xem phải thấy ngay **vật chính**, và thấy dòng điện đang chạy trong dây — đó là mũi dây của cả câu hỏi | ĐIỆN THOẠI | 
| 2 | c2 | bàn tay lật máy lên, màn hình lộ ra, vòng đồng hồ sạc đầy dần (không có số) | "mình vừa cầm lên" chưa xảy ra, nên phải có một động tác nhỏ trước nó: lật máy, và màn hình là thứ mới lộ ra | ĐỒNG HỒ SẠC | 
| 3 | c3 | bàn tay cầm máy lên, mặt lưng quay về phía máy quay | cầm lên là hành động — máy phải rời mặt bàn, và lưng máy là thứ quay về ta |  |  
| 4 | c4 | siêu cận mặt lưng máy, máy chếch ~25° với mặt lưng (không phẳng từ trên xuống), lưng chiếm ~84% bề ngang; ống camera, viền và nút nguồn phải đọc ra; vệt ấm gradient lan từ cổng sạc, hạt nhiệt bám trên bề mặt lưng | "nóng ở mặt lưng" — khung phải đọc ra là **lưng máy** (có ống camera, có mép, có vệt ấm), và góc chếch ~25° để thấy máy là vật có bề dày chứ không phải bản vẽ kỹ thuật; nhiệt phải **bám trên lưng**, không rơi lơ lửng trên bàn | MẶT LƯNG | 
| 5 | c5 | trung rộng: máy đặt lại xuống bàn, dây vẫn cắm, hướng về phía ổ cắm | câu hỏi cần một khung **yên**, đứng yên, để khán giả đặt câu hỏi vào |  |  
| 6 | c6 | cận ngang tầm mặt bàn: củ sạc ở góc trên-trái, dòng hạt cyan chạy chéo xuống cổng máy ở góc dưới-phải, máy chiếm ~25% bề ngang | "lần theo dòng điện" — đường hạt phải là **đường chéo dẫn mắt** từ trên-trái; máy **lùi về phía ổ cắm** theo nhịp câu, dòng hạt là người dẫn đường, không phải cái máy |  |  
| 7 | c7 | trung: củ sạc và cổng máy cạnh nhau trên bàn, nền tối dịu phía sau | "một quy luật rất đơn giản" — hai vật phải **đứng cạnh nhau** để thấy **đường đi** |  |  
| 8 | c8 | cận cổng máy: dòng hạt vào nhiều, chỉ một phần nhỏ đi tiếp vào ruột, phần còn lại đổi màu | "điện chạy vào nhiều hơn điện nạp được" — số hạt phải **tách** ngay tại cổng, đó là hình của câu này |  |  
| 9 | c9 | siêu cận tại cổng: hạt tách ra, thành màu đỏ | "không biến mất đâu" — hạt đỏ là bằng chứng, phải thấy nó **tách ra** |  |  
| 10 | c10 | siêu cận: hạt đỏ bay lên khỏi cổng | "nó thành nhiệt" — nhiệt phải là một thứ **bay lên**, không phải một màu |  |  
| 11 | c11 | siêu cận: hạt xanh đi tiếp và hạt đỏ đi lên, cạnh nhau | hai loại hạt phải **cùng khung** để người xem tự đối chiếu | DÒNG ĐIỆN · NHIỆT | 
| 12 | c12 | cận: máy quay đi theo dòng hạt xanh, tiến vào cổng, mặt cắt máy mở ra | "cứ đi theo dòng" — máy đi **theo hạt**, và đây là nhát chuyển cảnh sang N3 |  |  
| 13 | c13 | cận nghiêng từ trên xuống: ổ cắm trên tường ở nửa trên, dây nguồn chạy thẳng xuống giữa khung, củ sạc ở nửa dưới, hạt chạy dọc dây | đường dây là hình của "ổ cắm này cấp điện" — phích, dây và củ sạc phải **cùng một khung**, nên máy **lùi theo dây** về phía củ sạc, không đứng yên; tường chỉ còn 1/3 khung | Ổ CẮM · DÂY NGUỒN | 
| 14 | c14 | siêu cận nhãn in trên vỏ củ sạc: chữ ép thẳng vào mặt trên của vỏ, đọc từ trên xuống ở ~55°, nhãn chiếm ≥55% bề ngang | "sáu mươi oát" — con số phải **đọc được** trên vật thật, không nổi chữ trên nền; máy nhìn thẳng vào mặt nhãn (fov 20, cách nhãn 0.178 m) để chữ không bị méo, và vệt sáng phải không cháy trắng làm chữ mất | 60 W | 
| 15 | c15 | trung: củ sạc đứng một mình trên sàn sân, một vệt sáng từ đèn bàn | "nhiệm vụ của nó rất đơn giản" — vật phải **đứng một mình** và **sáng**; máy phải vào gần đủ, không phải một mảng nhỏ trong bóng | CỦ SẠC | 
| 16 | c16 | cận trong củ sạc: dòng hạt lượn sóng ở đầu vào | "đổi điện xoay chiều" — hạt **lượn sóng** là hình của xoay chiều | XOAY CHIỀU | 
| 17 | c17 | cận: cùng dòng hạt nay chạy thẳng trong ruột củ sạc, nhưng có hạt rơi ra | "không bao giờ trọn vẹn" — cùng một khung, hạt thẳng hóa, và **một phần rơi ra**; máy phải vào gần để thấy hạt rơi, không phải một chấm nhỏ |  |  
| 18 | c18 | cận: hạt rơi ra biến thành hạt cam ngay trong ruột củ sạc | "một phần điện bị thất thoát ngay trong lúc đi qua đó" — thất thoát phải xảy ra **ngay trong hình** |  |  
| 19 | c19 | cận trung: cả củ sạc đã cưa, lõi sắt và dây đồng nằm ở giữa, hạt chạy qua | "chỗ đổi điện ấy, nằm ngay trong củ sạc" — phải thấy vật **nằm trong củ sạc**, chứ không đứng riêng ra, và phải thấy **rõ** nó | CHỖ ĐỔI ĐIỆN | 
| 20 | c20 | siêu cận: cuộn dây đồng giữa ruột củ sạc, dòng hạt xanh chạy tới rồi đi tiếp, hạt cam bám **đúng trên cuộn dây** rồi mới bốc lên | "một phần bị cản lại" — chỗ tách hạt phải **đúng chỗ**, ngay trên cuộn dây; máy ở ngang tầm cuộn dây (macro 100mm, cách cuộn 0.132 m) để cuộn dây chiếm ≥45% bề ngang và hạt cam không che mất nó |  |  
| 21 | c21 | siêu cận: chỗ hạt tách ra bừng lên màu cam | "hao hụt thành nhiệt" — nhiệt phải **bừng ra tại đúng chỗ** |  |  
| 22 | c22 | cận trung: cả củ sạc, hạt cam bay lên từ cuộn dây | "những hạt cam này, là phần điện bị thất thoát ở đây" — câu gọi tên hạt, thẻ bám vào hạt; máy phải vào gần đủ hạt cam thấy rõ | ĐIỆN BỊ THẤT THOÁT | 
| 23 | c23 | trung: củ sạc, mỏ tản nhiệt ấm dần, gợn nhiệt bốc lên ngay trên vỏ củ sạc | "nó nóng lên ở vỏ củ sạc, và đó là chuyện bình thường" — hình phải cho thấy **cả cái củ sạc ấm lên**, và nhiệt **ở lại trong vỏ củ sạc** | VỎ CỦ SẠC | 
| 24 | c24 | cận: miệng cổng USB-C ở giữa khung, dòng hạt xanh từ ngoài đi vào cổng, ruột máy mở ra phía sau | "điện thoại thì phải làm nhiều hơn" — chuyển tầng bằng cách đi **qua cổng**: máy quay cách cổng 60mm, cổng chiếm 1/6 bề ngang, không còn nửa trên trống tím |  |  
| 25 | c25 | trung rộng: điện thoại bị cưa ngang — khung máy, màn hình, bo mạch, túi pin | "đây là điện thoại, bị cưa ngang" — phải nhận ra **cùng một cái máy** ở N1, nên khung phải đủ rộng để thấy cả dáng máy |  |  
| 26 | c26 | trung: cổng USB-C ở mép trái, bo mạch chạy từ đó vào trong | "cổng USB-C nối vào bo mạch" — câu nói về **quan hệ** của hai vật, nên hai vật phải cùng khung | CỔNG USB-C | 
| 27 | c27 | trung: bo mạch chạy dọc tới túi pin nằm giữa máy | "bo mạch nối tới túi pin" — lại là quan hệ hai vật, một đường hạt nối chúng | BO MẠCH | 
| 28 | c28 | trung rộng: cả bo mạch — cổng USB-C ở mép trái, mực silk `20 V` cạnh cổng và `4 V` ở mép phải | "hai mươi volt… khoảng bốn volt" — hai con số phải **đứng cạnh nhau** thì người xem tự hiểu; túi pin dời sang nửa xa để không che vệt mực, thẻ `20 V` lệch lên-trái 96 px nên vệt mực in lộ ra | 20 V · 4 V | 
| 29 | c29 | trung: con chip hạ điện áp nằm đúng giữa khung, bo mạch và dòng hạt xanh chạy qua nó | "giữa đường, phải có một mạch hạ điện áp" — máy phải thấy **chỗ giữa** đó: khung 81mm, chip 16mm chiếm 1/5 bề ngang, mũi tên thẻ châm đúng thân chip | MẠCH HẠ ĐIỆN ÁP | 
| 30 | c30 | cận: con chip sạc và con tụ nằm cạnh cuộn cảm dây đồng | "một con chip, một con tụ, và một cuộn cảm dây đồng" — ba vật được gọi tên, phải thấy **đủ cả ba** | CON TỤ · CUỘN CẢM | 
| 31 | c31 | siêu cận: dòng hạt chạy trên cuộn dây đồng | "dây đồng thì có điện trở" — hạt chạy **trên dây** để ta thấy dòng đi qua chỗ có điện trở | ĐIỆN TRỞ | 
| 32 | c32 | cận: chỗ dòng bị cản thì hạt tụ lại và ấm lên | "chỗ nào dòng điện bị cản, chỗ đó nóng" — đây là quy luật, nên hình phải **tái lập** nó ở một chỗ khác |  |  
| 33 | c33 | cận: hạt chuyển từ xanh sang cam ngay tại cuộn cảm | "hạt xanh chuyển sang cam ngay ở cuộn cảm" — mốc chuyển màu phải **đúng chỗ** |  |  
| 34 | c34 | trung: cả mạch sạc, hạt đỏ đậm bám quanh cuộn cảm, hơi nóng bay lên | "nơi sinh nhiệt thứ hai" — cần một khung rộng để ta **đếm** được: một, rồi hai; trong khung N3 chỉ còn MỘT cuộn cảm để đếm | NƠI SINH NHIỆT THỨ HAI | 
| 35 | c35 | trung cận: bo mạch ở góc trái, túi pin chiếm hai phần ba khung, dòng hạt chạy từ bo mạch vào túi pin | "còn một phần dòng thì rơi xuống nạp vào pin" — phải thấy trọn **đường đi** của dòng từ bo mạch vào túi pin, và thẻ `TÚI PIN` bám vào chính túi | TÚI PIN | 
| 36 | c36 | cận: mặt túi pin chiếm gần hết khung, dòng hạt dồn vào chân tế bào ở góc xa của túi | "phần này được giữ lại trong pin, không mất" — hạt phải **dồn vào đúng chỗ điện được giữ lại**, người xem thấy dòng không mà mà **ở lại trong túi** |  |  
| 37 | c37 | trung: nắp máy **mở dần** trong chính nhát này (0° → 75°), nắp dựng ở mép phải chiếm hơn nửa khung; góc dưới-trái lộ mép vỏ máy và bo mạch | "máy không chỉ sạc, máy đang chạy" — màn hình phải **sáng và chạy**, là bằng chứng; nắp mở 75° ngay trong nhát, tiêu cự 34°, màn hình chiếm phần lớn khung và viền máy lộ ở góc dưới-trái |  |  
| 38 | c38 | cận: màn hình với các biểu tượng nhấp nháy (ba hàng thông báo — tin nhắn, thông báo, ứng dụng — đúng ba từ lời kể cất ra; không logo, không con số) | "màn hình sáng, tin nhắn, thông báo, game" — màn hình phải **chạy**, không phải một mảng sáng | MÀN HÌNH | 
| 39 | c39 | cận: con chip xử lý, nắp chip ấm dần | "con chip đó cũng nóng" — thứ hai trong máy phải **ấm lên** như thứ nhất | CHIP | 
| 40 | c40 | trung: túi pin (mảng bạc có chữ Li-ion) nằm một bên bo, con chip đen ở giữa bo, dòng hạt xanh nối liền từ mặt túi pin lên đỉnh chip, vòng cung của dòng thứ hai ở giữa khung | "đây là dòng thứ hai, chạy từ pin lên chip" — dòng thứ hai phải **thấy rõ là khác đường**, và phải thấy nó **rời khỏi túi pin** chứ không mọc lên từ mép bo; thẻ bám vào giữa vòng cung | DÒNG THỨ HAI | 
| 41 | c41 | trung rộng, nhìn xuống 42°: cả khay máy nằm giữa khung, cột nhiệt cam bốc lên ở cuộn cảm (mạch sạc) và cột nhiệt nhỏ ở con chip — hai vùng nóng tách bạch | "máy có hai chỗ sinh nhiệt cùng lúc" — phải thấy **cả hai** trong một khung, và phải thấy **rõ**; thẻ bám vào chính cuộn cảm đang đỏ, không bám vào khoảng không | HAI CHỖ SINH NHIỆT | 
| 42 | c69 | cận trung: cuộn cảm nổi lên giữa khung, ruột máy làm nền phía sau | "còn một điều nữa: sạc nhanh" — nhát chuyển đề tài, phải **rời khung cũ**; máy quay cách cuộn cảm 80mm, cuộn chiếm 1/6 bề ngang thay vì 1/21 |  |  
| 43 | c70 | cận: dòng hạt trên bo dày hơn hẳn | "sạc nhanh thì dòng điện lớn hơn nhiều" — **mật độ hạt** là hình của câu này |  |  
| 44 | c71 | cận: cùng một cuộn cảm, dòng hạt chạy qua | "máy vẫn nạp qua cùng một cuộn cảm đó" — phải thấy **cùng một vật**, không phải một cuộn cảm khác |  |  
| 45 | c72 | cận: nhìn cuộn cảm từ phía bên kia, hạt đỏ mọc lên nhiều hơn, khung 43mm | "nhiệt sinh ra theo bình phương dòng điện" — hạt đỏ phải **dày lên**, không chỉ đổi màu; thân cuộn đồng nâu tối, hạt nhiệt đỏ thẫm có hào quang để tách tông |  |  
| 46 | c73 | cận, nhìn nghiêng 22° từ bên, cách 44 mm: cùng một cuộn cảm, hạt xanh nhiều hơn và hạt đỏ nhiều hơn hẳn | "dòng to hơn, mà hạt đỏ thì nhiều hơn hẳn" — hai vế phải thấy **cùng lúc**; không còn nhìn thẳng từ trên xuống như bản vẽ kỹ thuật |  |  
| 47 | c74 | cận: cảm biến nhiệt nhỏ có thang vạch, nằm cạnh túi pin | "có máy có cảm biến nhiệt đặt trong pin" — vật được gọi tên phải **thấy rõ** | CẢM BIẾN NHIỆT | 
| 48 | c75 | siêu cận: mặt cảm biến, đầu dò nhiệt áp sát tế bào pin | "cảm biến đó đo nhiệt độ của pin" — phải thấy nó **chạm pin** |  |  
| 49 | c76 | cận: thang vạch của cảm biến, vạch đỏ `45 °C` | "quanh bốn mươi lăm độ, tế bào pin không nên sạc nữa" — con số phải **đọc được** trên chính cảm biến trong máy | 45 °C | 
| 50 | c77 | siêu cận: vạch đỏ trên cảm biến, ngay cạnh thang vạch của nó | "vạch đỏ đó là mốc của tế bào pin, không phải nhiệt độ mặt lưng" — phải phân biệt **mốc của pin** với nhiệt độ ngoài vỏ: thẻ bám vào đúng vạch đỏ | MỐC CỦA TẾ BÀO PIN | 
| 51 | c78 | macro 26°, máy đứng **bên trái cảm biến và cao hơn nó**, cách 8 cm, nhìn chếch xuống dọc theo dòng hạt: cảm biến nhiệt ở giữa khung, dòng hạt xanh chạy qua nó rồi thưa dần ở đoạn cuối | "nóng quá thì máy tự giảm dòng sạc" — phải thấy **cả hai** trong một khung; thẻ bám vào đúng đoạn dòng hạt đang thưa, không bám vào bo trống | TỰ GIẢM DÒNG SẠC | 
| 52 | c42 | trung: túi pin bị cưa mở một góc, **vỏ bạc là mặt lớn nhất** trong khung, góc cưa lộ bậc thang bốn lớp xếp sát | "ngoài hai chỗ ấy, còn một chỗ nữa: chính là túi pin" — máy **rời đi**, bỏ cái vừa nói, và vật được gọi tên phải trọn khung: túi pin nhỏ lại còn 18 × 27 cm, máy đứng 35° bên phải, cao 30°, cách 55 cm, tiêu cự 32° (ngang) nên túi pin chiếm 59 % bề ngang và không bị cắt mép |  |  
| 53 | c43 | trung rộng, nhìn từ phía bên kia: cả cái túi pin trong khung, **vỏ bạc nằm ở 1/3 dưới**, góc cưa mở quay sang phía ta | "cả cái túi là nhiều lớp mỏng xếp chồng" — vật phải **trọn khung** trước khi ta mở nó ra; máy lùi ra 62 cm và ngẩng điểm nhìn lên 7 cm nên túi pin rơi xuống 1/3 dưới, nửa trên khung trống, vỏ bạc chiếm 53 % bề ngang |  |  
| 54 | c44 | trung: bốn lớp mỏng xếp sát ở góc cưa — đồng, graphite, lớp cách điện, nhôm | câu gọi tên từng lớp, nên **mỗi lớp một thẻ** bám vào đúng lớp | ĐỒNG · GRAPHITE · CÁCH ĐIỆN · NHÔM | 
| 55 | c45 | cận: hai mép lớp ép sát vào nhau, mỏng như tờ giấy | "mỏng như tờ giấy, và dính sát vào nhau" — phải thấy **hai mép lớp áp vào nhau** |  |  
| 56 | c46 | cận: mặt cắt bốn lớp xếp sát, dòng hạt xanh **cắt ngang ranh giới** lớp cách điện và lớp graphite, hạt nhiệt bùng lên ngay tại ranh giới đó | "dòng điện bị điện trở bên trong tế bào cản lại" — hạt phải **bò ngang** qua lớp, đúng hướng; chỗ bị cản phải là **ranh giới giữa hai lớp**, nên máy đứng chếch đúng theo mặt cắt, cách 18 cm, tiêu cự 26°, đủ xa để thấy trọn bốn lớp; lớp cách 13 mm nhau nên đường ranh giới hiện rõ ngang khung; thẻ bám vào ranh giới lệch sang phải, không đè lên cụm hạt | ĐIỆN TRỞ TRONG PIN | 
| 57 | c47 | cận rộng hơn: cả bốn lớp xếp sát trong khung, cụm hạt nhiệt nằm **đúng trên ranh giới lớp**, nền là vỏ bạc gấp bên trong túi pin | "cản lại thì sinh nhiệt, ngay ở trong pin" — nhiệt phải **bừng ra bên trong túi pin**; máy lùi ra 19 cm để thấy **ranh giới lớp chạy ngang qua cụm hạt**, và nền phải là vỏ bạc trong túi chứ không phải một mặt tường xám; thẻ bám vào cụm hạt, nằm ở nửa trên | NHIỆT BÊN TRONG PIN | 
| 58 | c48 | cận: nhiệt dồn vào trong, không ra khỏi vỏ | "nhiệt ấy không thoát ra ngoài được" — hạt đỏ phải **dồn vào trong**, bị chặn |  |  
| 59 | c49 | trung: cả túi pin trọn khung, **vỏ bạc ấm đều cả cục**, không còn một mảng hạt dồn ở một góc | "nó lan đều trong túi pin, làm cả cục pin ấm lên" — nhiệt phải **loang đều** ra cả cục, nên cả vỏ bạc đổi màu ấm đều thay vì dồn hạt ở một góc; máy đứng 20° bên phải, cao 26°, cách 60 cm, tiêu cự 30° |  |  
| 60 | c50 | trung rộng: bo mạch nằm bên trái, túi pin bạc nằm bên phải, cuộn cảm ở góc dưới-trái, dòng hạt xanh nối từ cổng sang túi pin, hạt nhiệt cam bay lên | "giờ gom lại: mạch sạc, cục pin, và con chip" — ba thứ phải **cùng khung** để ta gom được | MẠCH SẠC | 
| 61 | c51 | cận: ba luồng nhiệt hội tụ về một điểm | "cả ba cùng đổ nhiệt vào một chỗ" — ba luồng phải **chạy vào cùng một điểm** |  |  
| 62 | c52 | cận: điểm hội tụ là vỏ máy | "đó là vỏ máy" — thẻ bám vào đúng chỗ hội tụ | VỎ MÁY | 
| 63 | c53 | trung: cả vỏ máy như một tấm tản nhiệt | "vỏ máy là tản nhiệt của cả cái máy" — phải thấy **cả vỏ**, không một góc |  |  
| 64 | c54 | cận: gợn nhiệt bốc lên không khí; thẻ KHÔNG KHÍ bám vào khoảng không khí ở đỉnh luồng gợn, đuôi thẽ chạm đúng luồng hơi đang tan | "nó nóng lên, rồi tỏa ra không khí" — gợn nhiệt phải **rời khỏi vỏ**, và thẻ phải chỉ vào **khoảng không khí** mà nó gọi tên, không chỉ vào mặt vỏ máy | KHÔNG KHÍ | 
| 65 | c55 | siêu cận: mặt lưng máy nóng lên | "nên lưng máy nóng" — vệt ấm phải nằm **đúng mặt lưng** |  |  
| 66 | c56 | trung: bàn tay đưa tới lưng máy, lơ lửng phía trên | "tay người là một miếng tản nhiệt lớn hơn không khí nhiều" — tay phải **tiến vào khung** trước khi chạm |  |  
| 67 | c57 | cận: bàn tay chạm lưng máy, vệt nóng lan theo da tay | "cầm lên là thấy nóng ngay" — phải thấy **vệt nóng chạy vào tay** |  |  
| 68 | c58 | cận: ốp case trong suốt úp lên máy, mép dày và sáng hơn để đọc ra là ốp; hơi nhiệt bốc lên đúng ở mép case; thẻ ỐP CASE bám vào mép case | "cái ốp case thì giống một chiếc áo khoác giữ nhiệt" — case phải **hạ xuống úp lên** trong hình, nhìn **từ trên xuống** để thấy nó kín lưng máy, và nơi nhiệt bị chặn (mép case) phải là nơi thẻ chỉ vào | ỐP CASE | 
| 69 | c59 | cận: luồng nhiệt bị chặn ở vỏ case, ngoản lại | "nó giữ nhiệt lại quanh máy, không cho nhiệt thoát ra" — gợn nhiệt phải **dội ngược lại**, đọc ra là bị chặn |  |  
| 70 | c60 | trung rộng: hai chiếc máy trên sàn N5 — máy có ốp case bên trái, máy không ốp bên phải, cách nhau 1.8 cm, cả hai trọn trong khung (chiếm 84% bề ngang) | "nên máy có case sẽ nóng hơn máy không case" — phải có **hai máy** trong khung để so, và phải thấy **cả vỏ case** trên máy bên trái thì câu so sánh mới có hình |  |  
| 71 | c61 | trung rộng: hai chiếc máy giống nhau trên bàn, cùng cắm sạc, hai bộ sạc cùng cắm vào ổ; máy quay đứng giữa hai máy, cao 28 cm, cách 51 cm, tiêu cự 38°, trọn cả hai máy lẫn cả hai đường dây | "mình thử: hai chiếc máy giống nhau, cùng sạc, cùng một chỗ" — hai máy phải **đứng cạnh nhau**, cùng một điều kiện, và phải thấy **cả hai** đường dây về ổ chứ không chỉ một máy |  |  
| 72 | c62 | trung: máy bên phải có case, máy bên trái không | "cái này có case, cái kia không" — mỗi máy một thẻ, **đúng máy** | CÓ CASE · KHÔNG CASE | 
| 73 | c63 | trung: hai máy nằm cạnh nhau trên bàn, trên lưng mỗi máy một nhiệt kế dựng lên | "nhiệt kế đặt trên lưng mỗi cái" — hai nhiệt kế phải **đặt xuống** trong hình, và phải thấy **cả hai máy** cùng khung | NHIỆT KẾ | 
| 74 | c64 | cận: cột nhiệt kế bên phải dốc lên nhanh hơn | "cột nhiệt kế này dốc lên nhanh hơn" — phải thấy **hai cột chạy**, một nhanh một chậm |  |  
| 75 | c65 | cận: cột nhiệt kế bên trái dốc lên chậm hơn | "cái kia dốc lên chậm hơn" — phải thấy **cột thứ hai**, không chỉ cột thứ nhất |  |  
| 76 | c66 | trung: hai nhiệt kế cạnh nhau, cột chênh nhau rõ | "cái này là đo được, không phải đoán" — khung phải cho thấy **chênh lệch**, không một cột |  |  
| 77 | c67 | đúng rig của nhát 1: máy nằm sấp ở nửa trái, dây cắm chạy ra khung, vệt sáng ấm bên phải | "mình quay lại cái bàn cạnh giường" — khung phải **giống hệt** nhát 1 (cùng rig `RIG_OPEN`, tiêu cự 26°), để ta thấy mình quay về |  |  
| 78 | c68 | cận: điện thoại vẫn cắm sạc, màn hình vẫn sáng, vỏ ấm | "cái máy vẫn cắm sạc, màn hình vẫn sáng, và nó vẫn nóng" — ba điều kiện phải **cùng khung** |  |  
| 79 | c79 | đúng rig của nhát 1: cái bàn cạnh giường ban đêm, máy vẫn cắm sạc, vỏ ấm, bình thản | "vậy cái nóng lúc sạc là bình thường" — khung phải **y hệt** nhát mở đầu (cùng rig `RIG_OPEN`, tiêu cự 26°), để vòng khép lại |  |  
| 80 | c80 | cận: cả cái máy trong khung, bình thản | "đó là máy đang làm việc, không phải máy đang hỏng" — máy phải **bình thản**, không có gì động |  |  
| 81 | c81 | cận: một cái máy khác nằm cạnh, màn hình tắt, không cắm sạc | "có một loại nóng khác, loại này mới đáng lo" — phải là **một cái máy khác**, màn hình **tắt** (không còn vòng đồng hồ sạc) để không lẫn với máy đang sạc |  |  
| 82 | c82 | trung: bàn tay lật máy thứ hai úp xuống rồi rút tay ra khỏi khung; máy chiếm ~51% bề ngang, trọn trong khung; lưng máy có vệt ấm ở một góc | "nóng khi không cắm sạc" — cái máy không có dây là bằng chứng; tay phải **rút ra khỏi khung** để lưng máy lộ ra, và lưng phải **có dấu ấm** thì câu "nóng" mới có hình |  | 
| 83 | c83 | siêu cận: một góc lưng máy nóng lệch, vệt hồng lệch sang một bên; thẻ CHỖ NÓNG dời lên-trái 30px cho khỏi đè vệt sáng, đuôi thẻ vẫn nằm trên vệt | "hoặc nóng lệch một chỗ, ở một góc lưng máy" — vệt phải **lệch**, không lan đều; giữ nguyên góc macro, đây là khung mẫu cho cả phim | CHỖ NÓNG | 
| 84 | c84 | trung: bàn tay dừng lại trên máy | "lúc đó thì mình không tự đoán được nguyên nhân" — hình phải **dừng**, không giải thích |  |  
| 85 | c85 | trung rộng: bàn cạnh giường, tay chuẩn bị làm việc | "còn với cái nóng lúc sạc, mình làm được mấy việc" — khung rộng để các việc sau có chỗ |  |  
| 86 | c86 | trung: tay tháo ốp case ra khỏi lưng máy và đặt ở 1/3 dưới-trái rồi rút tay sang phải; máy quay **lùi ra xa và cao lên** (thêm 3 cm ra xa, thêm 8 cm cao) nên bàn tay không còn chiếm nửa khung, ốp là chủ thể của khung; thẻ ỐP CASE bám vào chính ốp, không vào bàn tay | "sạc lâu thì bỏ ốp case ra" — case phải **rời khỏi máy** trong hình và phải **thấy nó nằm riêng**; đuôi thẻ phải chạm ốp, không chạm tay | ỐP CASE | 
| 87 | c87 | cận: củ sạc cắm vào máy, nhãn in trên vỏ hiện rõ (chữ ép vào vỏ, dòng hạt đi qua bên chứ không đè lên nhãn) | "dùng củ sạc đúng chuẩn của máy" — nhãn in trên vỏ củ sạc là bằng chứng, nên chữ phải đọc được như chữ in chứ không như miếng dán | CỦ SẠC | 
| 88 | c88 | trung: cả đường điện từ củ sạc tới cổng máy chạy chéo qua khung, hạt cyan **thưa hẳn**, quanh cổng máy không còn hạt đỏ | "sạc chậm thì dòng vào máy ít hơn" — **mật độ hạt** thưa đi (và nhiệt ở cổng máy tắt) là hình của câu; thẻ `SẠC CHẬM` bám đúng vào chỗ hạt thưa | SẠC CHẬM | 
| 89 | c89 | cận: máy đang chơi game (màn hình sáng, hình nhấp nháy) vẫn cắm sạc | "đừng vừa sạc vừa chơi game" — phải thấy **cả hai** cùng lúc | 60 W | 
| 90 | c90 | cận: máy lật úp, lưng máy ngửa lên, hai vùng nóng hiện lên qua vỏ (một ở mạch sạc gần cổng, một ở con chip giữa máy) | "vì lúc đó máy có hai chỗ sinh nhiệt cùng lúc" — phải thấy **hai chỗ** trong một khung |  |  
| 91 | c91 | cận: bàn tay nắm đầu cáp ở mép trái máy và kéo ra; máy quay đứng bên kia cổng nên tay không che miệng cổng USB-C, dây chạy từ cổng máy lên ra khung | "nếu máy nóng bất thường, rút sạc ra, mang đi kiểm tra" — phải thấy **cáp rút ra**: đầu cắm trượt khỏi cổng, tay phải để lộ miệng cổng; thẻ `CỔNG USB-C` bám đúng vào miệng cổng | CỔNG USB-C | 
| 92 | c94 | đúng rig của nhát 1: cái bàn cạnh giường ban đêm, máy vẫn ấm, bình thản | "máy không hỏng" — khung phải **y hệt** nhát 1 (cùng rig `RIG_OPEN`, tiêu cự 26°), để câu chốt có trọng lượng |  |  
| 93 | c95 | đúng rig của nhát 1: cái bàn cạnh giường ban đêm, máy nằm ngửa màn hình sáng, đầu cáp đã rút nằm cạnh | "nó đang làm việc" — khung **y hệt** nhát 1 (cùng rig `RIG_OPEN`), để vòng khép lại |  |  

## Vòng 1 (bảng nhát đầu tiên: 34 nhát theo nhịp ý)

- **Thấy:** dàn ý có 26 dòng ý và 34 nhát theo nhịp ý, nhưng lời kể dài **95 câu**. Một nhát
  gánh cả một đoạn lời sẽ khiến người xem phải nhìn một bố cục quá bốn giây, và câu nào cũng
  phải dùng lại hình của câu trước — đúng cái lỗi mà tập 01 bị chấm.
- **Sửa:** tách thành **một câu một hình** (bảng nhát trong `src/MAP.md` là bảng nháp, `LOOK.md` là bản
  chính). Mỗi nhát một bố cục riêng, rộng – trung – cận – siêu cận xen kẽ, và **mỗi câu có
  một vật thật đang làm việc trong khung**.

## Vòng 2 (rà bốn quy tắc của phim trên bảng nhát)

- **Thấy:** (1) câu c2 nói "từng phần trăm" trong khi phim không được vẽ con số nào ngoài bốn mốc
  đã khai → đổi thành "từng chút một", và màn hình chỉ có một **vòng đồng hồ sạc không số**;
  (2) câu c86 "nhiệt không đến từ dòng điện, mà đến từ chỗ khác" là một **chẩn đoán**, mà
  `STRATEGY.md` cấm → đổi thành "lúc đó thì mình không tự đoán được nguyên nhân", và câu
  "mang đi kiểm tra"; (3) "củ sạc" bị gọi tên mười lần trong lời kể → bớt còn ba;
  (4) nhãn `CÓ CASE` / `KHÔNG CASE` chỉ hiện ở câu có case, `60 W` hiện ở câu đọc nhãn củ sạc,
  `20 V` và `4 V` cùng ở một câu, `45 °C` ở câu nói về mốc của tế bào pin.
- **Sửa:** sửa lời (`voice/lines.json`) và bảng nhát cho khớp; `research/FACTS.md` được viết lại
  theo chuẩn của kênh — **nguồn sơ cấp trước, Wikipedia chỉ là dẫn chiếu**, và không mốc nào
  đứng trên Wikipedia một mình.

## Vòng 3 (vòng chấm lời kể số 1: cơ chế không có nguồn)

- **Thấy:** câu c19–c22 gọi tên "cuộn biến áp" và kể cơ chế "dòng điện đi vòng qua nó, nó cọ
  vào dây" — cơ chế ấy **không có mốc nào trong `FACTS.md`**, và cách nói ấy cũng không đúng
  nguyên lý biến áp. Thêm nữa, câu c73 ("dòng to hơn một chút") đứng ngay sau câu "dòng điện
  lớn hơn nhiều" thì hai câu tự mâu thuẫn; và hai câu cuối c92–c93 dựng lại đúng ý đã nói ở
  c9–c10 và c54, theo `STRATEGY.md` thì một ý chỉ nói một lần.
- **Sửa:** (1) c19–c22 viết lại theo đúng mức mà `FACTS.md` cho phép — "chỗ đổi điện ấy nằm
  ngay trong củ sạc", "một phần bị cản lại", "hao hụt thành nhiệt", "là phần điện bị thất thoát
  ở đây"; hình cũng đổi theo: c19 giờ là khung **cả củ sạc đã cưa** để thấy cuộn dây nằm
  *trong* củ sạc, chứ không phải một vật trôi lơ lửng; (2) c73 đổi thành "dòng to hơn, mà
  hạt đỏ thì nhiều hơn hẳn"; (3) bỏ hẳn c92–c93, mở thẳng bằng "Máy không hỏng." và "Nó đang
  làm việc."; (4) `45 °C` chuyển từ nhiệt kế ngoài vỏ (cũng là chỗ đặt sai: đó là nhiệt độ
  mặt lưng) sang **cảm biến nhiệt bên trong máy**, đúng như `FACTS.md` mục 6 và 7; (5) thẻ
  `CHỖ NÓNG NHẤT` bỏ đi — phim không nói chỗ nào là chỗ nóng nhất, vì không có mốc nào đo được.

## Vòng 4 (máy đo trước khi chấm: sáu khung tối mờ, và phim thiếu chữ)

- **Thấy:** máy đo báo sáu nhát **tối mờ** (c15, c17, c19, c22, c23, c41): vùng giữa khung có
  p90 dưới 0,32 — củ sạc đứng quá xa, trong một khoảng tối đen. Và `scenecheck` báo chỉ **10 %**
  khung hình có chữ: phim kể bằng hình nhưng không **gọi tên** vật, nên người xem nhìn xong
  không biết mình vừa nhìn cái gì.
- **Sửa:** (1) sáng nền cảnh N2 (trong củ sạc) và N3 (trong máy), kéo máy quay vào gần ở sáu
  nhát đó — cự ly quanh vật giảm khoảng 35 %, đèn chính và vệt sáng mạnh lên; (2) thêm **37
  thẻ** gọi tên vật, mỗi thẻ bám vào vật và hiện đúng câu lời kể gọi tên nó; (3) xoá một nhát
  trùng id `c77` — nhát chết khiến cảnh cận cảm biến không bao giờ lên hình — và thêm thẻ
  `MỐC CỦA TẾ BÀO PIN` cho câu nói về vạch đỏ.

## Vòng 5 (rà lại bộ thẻ: thẻ phải là thuật ngữ, không phải câu lời)

- **Thấy:** đợt rà đối kháng bằng hai lăng kính (một đọc chỗ bám, một đọc màn diễn) ra hai
  lỗi thật: thẻ `DÂY NGUỒN` bám vào **dây USB** thay vì dây nguồn từ ổ xuống củ sạc, và
  mười thẻ trong bộ **đọc lại câu lời kể** như một tiêu đề phụ (`NÓNG KHI KHÔNG CẮM SẠC`,
  `VỪA SẠC VỪA CHƠI GAME`, `RÚT SẠC RA`…) — chữ trên hình của kênh chỉ được là **thuật
  ngữ**, không phải câu lời hiện lên rồi biến mất.
- **Sửa:** (1) `src/set.js` trả thêm điểm neo `cordNear` — điểm giữa đoạn dây nguồn ngay
  dưới phích cắm, đúng chỗ nhát cận c13 nhìn thấy — và thẻ `DÂY NGUỒN` bám vào đó;
  (2) bỏ hai thẻ lặp lại câu (`NÓNG KHI KHÔNG CẮM SẠC` ở c82, `VỪA SẠC VỪA CHƠI GAME`
  ở c89) và viết lại bốn thẻ còn lại thành thuật ngữ: `CHỖ NÓNG` (c83, bám vào vệt nóng
  lệch ở góc lưng máy), `ỐP CASE` (c86, bám vào cái ốp vừa được tháo), `CỦ SẠC` (c87),
  `CỔNG USB-C` (c91, bám vào cổng vừa rút dây ra). Còn **49 thẻ**, **42 nhát có thẻ**.


## Vòng 6 (điểm neo của thẻ phải là chỗ thật; và dòng điện thứ hai phải có hình)

- **Thấy:** ba lỗi cùng một gốc. (1) **Hạt bay không có khung bao ở chỗ nó đang ở**:
  dòng điện và hạt nhiệt là `InstancedMesh`, nên điểm neo đọc từ vật đó rơi về gốc cảnh —
  thẻ `ĐIỆN TRỞ TRONG PIN` bám vào khoảng trống, và nhát c46 chỉ còn một mảng be trơn.
  (2) **Mực silk `20 V` in trên bo mạch** phóng to thành một mảng chữ vô nghĩa ở các nhát
  máy lọt sát bo (c31, c72, c73). (3) Những nhát nhìn bo mạch (c28, c29, c40) đứng sai góc:
  thẻ `MẠCH HẠ ĐIỆN ÁP` bị kẹp sát mép khung, và `DÒNG THỨ HAI` trỏ vào một mảng bo trống.
- **Sửa:** (1) bộ dựng cảnh nói điểm neo (`anchors.plume` ở N2/N5, `anchors.stream` ở N3,
  `anchors.graphite` ở N4) và phim đọc từ đó — thẻ bám vào **đúng chỗ hạt đang ở**;
  (2) mực silk chỉ hiện ở đúng nhát đọc số đó (c28), các nhát khác không có chữ in để lấp;
  (3) mở rộng c28 để cổng USB-C và hai mực silk cùng trong khung, đổi góc c29 và c40,
  siết lại c42/c43/c49 để túi pin nằm trọn trong khung, và **vẽ dòng điện thứ hai** — một
  dòng hạt riêng nối từ túi pin lên chip (chỉ hiện ở c37–c41, lúc phim kể máy đang chạy),
  để câu "đây là dòng thứ hai" có đúng một hình để chỉ vào.

## Vòng 7 (dựng lại toàn bộ N3: cảm biến phải thật sự có mặt trong khung)

Ba lỗi thật, tìm ra khi mở từng khung ở kích thước gốc:

1. **Cảm biến nhiệt chưa bao giờ có mặt trong khung.** `createThermalSensor` có `update(t) { g.position.y = ... : 0 }`, mà `updatersOf()` trong `src/film.js` quét mọi vật có `.update` và gọi nó **mỗi khung** — nên chiều cao của cảm biến bị ghi đè về 0, rơi xuống dưới mặt túi pin (mặt ở `CELL_TOP = 0.0013`). Sửa: `update` chỉ **cộng** vào chiều cao đã có (`userData.baseY`).
2. **Hạt dòng điện dính thành một ống liền khối.** Bán kính hạt = `len/n × 0.62`, nhân thêm hệ số phình 1.4–1.9, nên đường kính hạt gấp khoảng hai lần bước giữa hai hạt. Hạt cũng được đặt theo **tham số** của đường cong chứ không theo cung độ, nên ở đoạn cong ngắn (sát cảm biến) chúng dồn thành một vệt liền. Sửa: hệ số 0.62 → 0.34, và `getPoint` → `getPointAt` (đi theo cung độ).
3. **"Thưa dần" không thưa thật.** `setTail` giữ hạt theo *chỉ số* (`i/n`), nên đoạn cuối vẫn là một dải hạt sát nhau, chỉ bị xoá mất một đoạn. Sửa: ở đoạn cuối chỉ giữ **mỗi k hạt một**, nên khoảng cách hạt giãn ra và đọc ra là dòng bị cắt.

Hai nhát phải sửa theo: **c78** (macro cảm biến + dòng thưa dần) trước đây quay ở 96 mm và nhìn vào neo của túi pin nên không thấy cảm biến; **c77** thẻ `MỐC CỦA TẾ BÀO PIN` lệch 130 px nên đuôi thẻ trượt khỏi vạch đỏ.

Bố cục N3 đo lại từ đầu theo toạ độ tuyệt đối (không theo tỉ lệ): `FLOOR = -0.0018` (đáy máy đã cưa), `BOARD_TOP = -0.0002` (mặt bo mạch), `CELL_TOP = 0.0013` (mặt túi pin). Cụm camera cuộn cảm được đẩy ra khỏi thân máy **khi đo**, vì nó làm khung đo phình thêm 6 mm và mọi vị trí đặt theo tỉ lệ sai lệch theo.

## Vòng 8 (đạo cụ đọc sai thành thứ khác — đọc cả 23 prop và 35 khung hình ở cỡ gốc)

Vòng này không sửa bố cục, chỉ sửa **vật thể**: mỗi đạo cụ bị đọc nhầm thành một thứ khác
trong khung hình thật. Tám lỗi, tám cách sửa, mỗi lỗi đều nhìn thấy được ở cỡ gốc
(chia nhỏ trên một bảng ảnh thì sai, phải mở đúng khung):

1. **Màn hình bận đọc ra là bảng điều khiển trộn âm.** Cả ba hàng thông báo đều là hai vạch
   dài **bằng nhau** → mắt đọc thành ba cặp fader. Sửa: mỗi hàng có **hai vạch dài khác nhau**
   (trên dài 30 %, dưới ngắn 17 %), biểu tượng ứng dụng đổi từ tròn sang **vuông bo**, dải
   biểu tượng dưới cùng cũng là ô vuông bo (nút tròn đọc ra là dãy knob). Màn hình **không có
   chữ nào** — trường `txt` cũ đã xoá hẳn khỏi mã.
2. **Màn hình game đọc ra là thẻ tín dụng.** Nền xanh đều + một khối vàng = một tấm thẻ. Sửa:
   trời xanh **hai tầng** (`#3f86cf` → `#57a2e6`), **mây trắng**, mặt đất xanh lá `#3fa85a` với
   viền sẫm, khối vàng có **chân tối** để nhảy, vật cản đỏ có chân tối.
3. **Túi pin bị cưa đọc ra là phong bì.** Một khối bạc không có gì bên trong. Sửa: in nhãn
   `Li-ion` lên vỏ (nhãn nằm **trên** mặt foil, không chìm trong nó) và dựng lại bốn lớp
   thành **bậc thang** nhìn thấy được ở góc cưa (đồng → graphite → cách điện → foil), mỗi lớp
   lệch nhau một chút.
4. **Cuộn cảm đọc ra là nắp vặn.** Thân trụ đồng + hào quang nóng chồng lên = một nút xoáy.
   Sửa: thêm **ống chỉ màu kem** và **sáu vòng dây đồng xen kẽ hai tông** (`#c9743a` /
   `#9c5326`) để nhìn ra là dây quấn quanh lõi.
5. **Hào quang hạt nhiệt nuốt cả thân cuộn.** Hạt to quá, cộng dồn thành một đám cam khổng lồ,
   không đếm được hạt nào. Sửa: hạt nhỏ (`.0018 → .0010`) và nhạt hơn (`.12 → .07`); màu nhiệt
   chuyển từ `#ff5a1e` sang **`#ff3d14`** để tách hẳn tông với thân cuộn đồng nâu.
6. **Củ sạc trắng nhạt, mất hình.** Sửa: thêm một **dải đường hàn xám** (`#d6d2c6`) quanh
   thân hộp, mỏ tản nhiệt đậm hơn (`#b9bfc8 → #8d96a4`).
7. **Vạch đỏ trên túi pin đọc ra là mốc 45 °C.** Đó là mốc của cảm biến trong máy, không phải
   nhiệt độ mặt lưng — một vạch đỏ dài trên túi làm người xem tưởng túi mang nhiệt độ. Sửa:
   đổi thành **dải mép hàn xám** (`#9aa2ad`).
8. **Lỗ camera của ốp là một lỗ tròn vô nghĩa.** Sửa: khoét **camera vuông** ở góc ốp —
   ba ống kính tối trong vòng thép + một đèn flash kem.

Ba nhát phải đổi máy quay theo những lỗi trên:

- **c86**: bàn tay chiếm nửa khung → máy **lùi ra xa và cao lên** (thêm 3 cm ra xa, thêm 8 cm cao).
- **c78**: khung bị một mảng bo trống chiếm → máy đứng **bên trái cảm biến, cao hơn**, cách 8 cm.
- **c14**: thẻ `60 W` trỏ vào mặt bàn trống → dời đuôi thẻ **60 px sang phải, 235 px xuống**
  để chạm đúng nhãn in trên vỏ củ sạc.

## Vòng 9 (hai nhát của dòng điện thứ nhất, và màn hình phải chạy)

Bộ kiểm tra chuyển động đo được một đoạn **đứng yên 13 giây** ở khoảng 103 s: đúng hai câu
mà dòng điện chạy vào túi pin rồi nằm lại trong đó. Hai nhát đó không có gì *mới* xảy ra
nên hình đứng. Ba sửa:

1. **c35 — máy ghì sát túi pin.** Trước đó máy đứng xa, cả bo mạch lẫn túi pin nằm trong
   khung, nên hạt chỉ là một đường chấm bi nhỏ ở mép phải. Nay máy quay sát túi pin
   (`ORB(BAT, …, 2.40)`): bo mạch ở góc trái, túi pin chiếm hai phần ba khung, đường dòng
   hạt chạy **từ bo mạch vào túi** đọc được trọn vẹn.
2. **Thẻ `TÚI PIN` dời từ c27 sang c35.** Thẻ phải nằm ở câu **nói tên** vật mà nó gọi
   ("túi pin"), và câu đó là c35; ở c27 câu kể chỉ nói *bo mạch*, nên thẻ `TÚI PIN` ở đó
   là nói trước. Ở c27 chỉ còn thẻ `BO MẠCH`.
3. **c36 — máy cận vào chân tế bào** (`ORB(BAT, …, 1.55)`): dòng hạt dồn vào đúng chỗ
   điện được giữ lại, đọc ra là "nằm lại trong pin" chứ không phải "chạy qua".

Và một sửa ở c37–c38, do cùng một lý do: **màn hình phải chạy**. Trước đó nắp máy đứng
sẵn 75° và màn hình là một mảng sáng tĩnh — nhát này đứng yên, và người xem không tin lời
kể "máy đang chạy". Nay nắp **mở dần trong chính nhát** (0° → 75° trong 1,4 s) và màn
hình vẽ lại từng khung (màn hình bận, rồi màn hình game có khối vàng nhảy và vật cản đỏ
chạy ngang). Màn hình chạy là bằng chứng, đúng như lời kể. Máy của c37 cũng **lùi ra**
(`2.05 → 2.45`): trước đó màn hình chiếm trọn khung, không thấy gì của máy; nay nắp dựng
ở mép phải và góc dưới-trái lộ mép vỏ máy cùng bo mạch — người xem biết mình đang ở
trong máy.

## Khoảng trống cho chữ

Mọi thẻ nằm ở **nửa trên** khung (trên dải phụ đề), và luôn bám vào vật bằng đuôi thẻ ở góc
dưới-trái. Không thẻ nào đè lên vật chính: vật chính luôn ở giữa hoặc dưới thẻ.

**Chỉ bốn con số được phép lên hình:** `60 W` (nhãn in trên vỏ củ sạc, và thẻ ở câu đọc nó),
`20 V` (mực silk cạnh cổng), `4 V` (mực silk cạnh túi pin), `45 °C` (vạch đỏ trên **cảm biến
nhiệt trong máy**). Mỗi con số đều có một câu lời đọc nó.
