# LOOK — Vì sao trời có biến màu?

Khung hình của tập, làm theo `STYLE.md` của kênh. Mọi mốc thời gian lấy từ `voice/proc/dur.json` và
`src/timeline.js` (giọng đã thu, `mk_timeline.py` của kênh sinh ra), không ước lượng.

Nguyên tắc của bản này: **mỗi câu kể một hình**. Một câu = một bố cục riêng (rộng – trung – cận – siêu cận xen
kẽ), máy cắt theo nhịp lời. Không nhát nào kéo dài quá một câu, để không câu nào phải dùng lại hình của câu trước.

## Bố cục thế giới

Bảy khung hình, năm nơi chốn (sân thượng nhà dùng ba lúc khác nhau), mỗi nơi một cách dựng:

| Nơi chốn | Dựng thế nào | Vai trò |
|---|---|---|
| **N1D · sân thượng nhà, chiều muộn** | sàn gạch, lan can sắt có nan, nhà thang có cửa ở góc trái, thùng nước có nắp và mặt nước ở góc phải, cây chuối, một tờ giấy trắng đặt trên lan can, hai vòng nhà làm đường chân trời; trời là một ảnh toàn cầu vẽ tay, đĩa Mặt Trời đặt đúng góc của nó | câu hỏi và ba màu đầu tiên (c01–c03) |
| **N2 · trong không khí, ban ngày** | trời xanh ban ngày, 260 hạt khí nhỏ tụm quanh chùm sáng, một chùm sáng trắng đi ngang (một lõi sắc và một vỏ sáng mềm quanh, cả hai mờ dần ở hai đầu — chùm là ánh sáng, không phải vật thể, nên nó không có viền mực), 48 hạt sát chùm rực lên, hai hạt có dải sóng (một dải ngắn xanh uốn chín lần, một dải dài đỏ uốn một lần), hai dòng sáng bị rẽ (xanh bên trái, đỏ bên phải) bám vào hai hạt trắng rực, một dòng bay về phía máy, 14 dòng xanh từ mọi hướng hội tụ về một tâm, một ống sáng rỗng (hai mép sáng, giữa mờ hơn) đi thẳng vào mắt ta | thứ vô hình thành hình: hạt, dòng sáng bị rẽ, dải sóng (c04–c13) |
| **N3 · trong không khí, chiều muộn, dọc theo tia** | một tia đi thẳng, trắng ở gần và đỏ ở xa; 14 lớp hạt dày dần, hạt trong lớp càng đông càng nhỏ lại để lớp đọc ra là lớp hạt chứ không phải một vệt bông; một thước đo quãng có vạch treo bằng hai sợi dây; hai thước đo phần trăm làm bằng hai mươi chấm sáng | thứ vô hình thành vật đo được: độ dài đường đi, phần trăm màu (c14–c19) |
| **N1R · sân thượng nhà, Mặt Trời sát chân trời** | cùng sân thượng, nhưng Mặt Trời ở ngay chân trời và đỏ rực, mọi vật nhuốm cam, bóng đổ dài | kết quả của lý thuyết, nhìn thấy được (c20–c24) |
| **N5 · sát chân trời** | một tấm nền lớn: đỏ ở dưới, dải nhạt gần như trắng ở giữa, xanh ở trên (đúng thứ tự c23/c24 — dải đỏ chỉ nằm DƯỚI đường chân trời); 56 hạt bụi mờ to và 220 hạt không khí nhỏ xíu; một chùm nắng thấp nằm ngang trong dải | lý do dải nhạt tồn tại (c25–c27) |
| **N4 · từ không gian, quanh Trái Đất** | Trái Đất có lục địa và mây, sa mạc trộn mềm vào màu đất nên mép vùng phai dần (không có ô hình chữ nhật), bề mặt có nét mực ở mép cầu; lớp khí quyển và lớp ozon là hai QUẦNG sáng mềm quanh mép hành tinh (quầng xanh ở trong, quầng tím ở ngoài, mờ dần ra), không có dải ozon nào ở xích đạo; một dải hoàng hôn cam mỏng chạy dọc theo ranh giới ngày-đêm; chùm cam đỏ đi vào và DỪNG ở mép hành tinh, không sơn lên mặt đang có nắng; phần xanh lọt qua được vẽ thẳng lên mặt cầu thành một dải sáng mềm ôm lấy ranh giới ngày-đêm ở phía mặt đêm, có hạt sáng nhỏ rải trong đó; mặt đêm chỉ sáng ở phía quay lưng về Mặt Trời | giờ xanh và lớp ozon (c28–c34) |
| **N6 · sân thượng nhà, xế chiều** | cùng sân thượng, trời đã chuyển sang dải xanh tím, tờ giấy giờ xanh nhạt; mặt nước trong thùng là một mảnh tối lấp lánh nhẹ, không sáng hơn dải chân trời (bầu trời mới là chỗ sáng nhất của khung) | câu chốt: cùng một chỗ, màu khác (c35–c37) |

Toạ độ vật trong sân thượng (toạ độ thế giới, `src/sets/santhuong.js`): lan can ở `z = -3.90` (thanh tay vịn ở
`y = 1.16`); **tờ giấy** là một tấm vải phủ qua thanh tay vịn, tâm phần rủ phía trước ở `(0.38, 1.00, -3.80)`;
**nhà thang** ở `(-3.05, 0, -1.55)`, mặt tường nhìn ra ở `z = -0.45`; **thùng nước** ở `(2.25, 0, -0.85)`, mặt
nước ở `y = 0.72`; **cây chuối** ở `(-1.95, 0, -3.35)`. Mặt Trời ở hướng `az = 0.42 rad` lệch sang phải, cao
`4.2°` (chiều muộn) và `1.4°` (lúc sát chân trời); nhà gần hướng Mặt Trời luôn thấp hơn để không che đĩa Mặt
Trời. Ở lúc xế chiều (N6) trời đã sang dải xanh tím và tờ giấy chuyển sang xanh nhạt (`paper: #bcd2f7`).

Trong N3: tia đi từ `x = +7` (trắng) đến `x = -19` (đỏ); 14 lớp hạt ở `x = 5.2 − i·1.55`; **thước đo quãng** ở
`(-8.0, 1.45, 0.55)`, dài 12, 39 vạch, treo bằng hai sợi dây ở hai đầu dải, con trượt đỏ chỉ ở `x = -8.0`;
**mặt đồng hồ xanh** nằm trong mặt phẳng `z = 0.62`, chốt kim ở `(-7.00, 1.07)`, vòng 20 chấm quanh tâm
`(-6.80, 0.93)`, mỗi chấm 1,25 %, kim chỉ ở 2,5 %; **mặt đồng hồ đỏ** cùng cách đo, chốt kim ở
`(-6.96, -0.83)`, vòng chấm quanh tâm `(-7.04, -1.06)`, kim chỉ ở 15 %.

Ánh sáng: mỗi nơi một đèn chính có bóng đổ (sân thượng: đèn chính đặt đúng ở hướng Mặt Trời nên bóng đổ dài
về phía máy; không khí: đèn lạnh từ trên-trái-trước; không gian: đèn chính đặt ở phía Mặt Trời để nửa sáng
nửa tối của Trái Đất đúng như mặt trời thật), cộng một lớp đèn môi trường lấp đầy bóng tối và một đèn phụ
phía máy để mặt trước của vật không chìm hẳn vào bóng khi bị ngược sáng.

## 37 nhát: một câu một hình

| # | Câu | Mốc (giây) | Nhìn gì | Lý do của góc máy | Nhãn |
|---|---|---|---|---|---|
| 1 | c01 | 2.40–5.95 | N1D · fov 44: toàn cảnh sân thượng nhà lúc chiều muộn — Mặt Trời thấp lệch phải, lan can sắt và tờ giấy ở gần, thùng nước giữa, nhà thang và cây chuối bên trái, thành phố xa làm đường chân trời — lời: "Chiều muộn, trên sân thượng nhà, Mặt Trời đang lặn sát chân trời." | mở đầu đời thường — phải biết ngay đây là sân thượng nhà và Mặt Trời đang ở ngay chân trời | |
| 2 | c02 | 6.50–11.49 | N1D · fov 46: máy đứng ngay bên lan can, ngang tầm tờ giấy — tờ giấy trắng vắt qua thanh tay vịn ở góc dưới bên trái và nhuốm cam, chân trời đỏ rực ở giữa, trời cao còn xanh ở trên — lời: "Chân trời đỏ rực, phần trời cao còn xanh, và tờ giấy trắng đặt trên lan can thì nhuốm màu cam." | câu kể ba thứ cùng lúc — máy phải giữ được cả tờ giấy ở góc dưới lẫn dải trời ở nửa trên; tờ giấy phải nằm TRÊN lan can (tiếp xúc, có bóng) chứ không bay lơ lửng | |
| 3 | c03 | 12.49–15.88 | N1D · fov 52: ngướng lên cho trời tràn khung, màu đi từ đỏ ở chân trời lên xanh ở trên cao — lời: "Trời đổi màu theo giờ, hay là chỗ này có sẵn một màu riêng của nó?" | câu hỏi bỏ ngỏ — máy ngẩng lên theo đúng câu hỏi | |
| 4 | c04 | 16.88–20.22 | N2 · fov 42: vào trong không khí — chùm sáng trắng đi ngang qua một lớp hạt nhỏ, trăm hạt lơ lửng quanh chùm — lời: "Để biết câu trả lời nằm ở đâu, mình vào trong không khí mà nhìn." | chuyển nơi — máy rộng để người xem thấy mình đã ở trong không khí, không còn trên sân thượng | |
| 5 | c05 | 20.77–24.40 | N2 · fov 34: chùm sáng trắng đi ngang qua lớp hạt nhỏ, nhìn chéo dọc theo chùm — lời: "Ở đây, một chùm sáng trắng của Mặt Trời đi ngang qua một lớp hạt nhỏ." | chùm sáng phải đọc ra là một sợi trắng đi qua hạt, nên máy đứng lệch trái nhìn chéo | |
| 6 | c06 | 25.05–29.98 | N2 · fov 32: cận hai hạt sát chùm sáng — chúng rực lên, một dòng sáng bị rẽ sang bên, một dòng bay về phía máy — lời: "Mỗi hạt sát chùm sáng rực lên rồi ném ra một dòng sáng sang bên, và có dòng bay về phía ta." | phải thấy được hạt và cái dòng nó ném ra trong cùng một khung | |
| 7 | c07 | 30.83–35.02 | N2 · fov 40: dòng bị rẽ bên trái (xanh) và bên phải (đỏ), chùm đi thẳng ở giữa — lời: "Ta thấy màu của những dòng sáng bị rẽ ấy, chứ không phải màu của chùm sáng đi thẳng." | câu so màu của dòng bị rẽ với màu của chùm đi thẳng — ba thứ phải cùng khung | |
| 8 | c08 | 35.57–37.73 | N2 · fov 28: hai hạt cạnh nhau, mỗi hạt một dải sóng — một dải sóng ngắn màu xanh, một dải sóng dài màu đỏ — lời: "Màu nào rẽ mạnh hơn thì ta thấy màu ấy." | độ rẽ phải đọc được từ hình dạng của hai dải sóng, không phải từ lời | |
| 9 | c09 | 38.48–40.67 | N2 · fov 30: cận hai dải sóng, thẻ chỉ vào dải sóng ngắn — lời: "Màu xanh rẽ mạnh hơn màu đỏ khoảng chín lần." | câu có con số — con số phải bám vào đúng dải sóng mà nó nói đến | `CHÍN LẦN` |
| 10 | c10 | 41.52–45.06 | N2 · fov 48: ngướng lên — dòng sáng xanh bay về từ mọi hướng, quanh một tâm — lời: "Nên khi ngước lên, ta thấy ánh sáng xanh bị rẽ về từ mọi hướng." | lời nói ngước lên thì máy ngước lên thật | |
| 11 | c11 | 45.61–47.96 | N2 · fov 40: rộng và cao, khung lấp đầy màu xanh của các dòng sáng từ mọi hướng — lời: "Đó là lý do bầu trời trên cao mang màu xanh." | kết luận của cả đoạn — hình phải là một mảng xanh | |
| 12 | c12 | 48.91–51.54 | N2 · fov 34: chùm sáng đi thẳng vào mắt ta, một ống sáng không bị rẽ — lời: "Nhưng có một thứ khác với chùm sáng đi thẳng vào mắt ta." | câu "có một thứ khác" — tách riêng chùm đi thẳng ra khỏi các dòng bị rẽ | |
| 13 | c13 | 52.24–56.37 | N2 · fov 34: nhìn dọc theo chùm thẳng — chùm sáng trắng kéo dài xuyên qua không khí, các hạt nằm dọc theo nó — lời: "Chùm ấy không bị rẽ, và nó phải đi qua không khí trên suốt đường đi của chính nó." | "suốt đường đi" — máy phải thấy được chiều dài của chùm, không chỉ một chỗ | |
| 14 | c14 | 57.17–60.77 | N3 · fov 40: trong không khí lúc chiều muộn, quay ngược dọc theo tia — tia trắng ở gần, vàng ở giữa, đỏ ở xa — lời: "Mặt Trời càng xuống thấp, đường đi của chùm sáng thẳng ấy càng dài hơn." | máy nhìn ngược lại phía nơi Mặt Trời thấp hơn, để thấy đường đi của tia dài ra | |
| 15 | c15 | 61.62–64.92 | N3 · fov 32: thước đo quãng có vạch, treo bằng hai sợi dây, thẻ chỉ vào thước — lời: "Ở chân trời, nó dài gấp khoảng ba mươi tám lần đường đi lúc trưa." | con số phải đi kèm vật đếm, không đi kèm một mảng trời | `GẦN 38 LẦN` |
| 16 | c16 | 65.52–68.92 | N3 · fov 32: các lớp hạt dày dần dọc theo tia, lớp gần thưa, lớp xa dày — lời: "Cứ mỗi lớp hạt dày thêm một chút là thêm một lần đi qua không khí." | "mỗi lớp dày thêm" — các lớp phải dày dần theo chiều sâu; hạt trong lớp đông phải nhỏ lại để lớp đọc ra là lớp hạt chứ không phải một vệt bông | |
| 17 | c17 | 69.82–73.24 | N3 · fov 34: chùm sáng đã đổi từ trắng sang vàng rồi đỏ ở đoạn xa — lời: "Đi qua lớp không khí dày ấy, chùm sáng mất gần hết màu xanh." | "mất gần hết màu xanh" — màu của chùm phải thay đổi dọc theo tia trong cùng khung | |
| 18 | c18 | 73.99–76.50 | N3 · fov 24: thước đo phần trăm — hai mươi chấm, chỉ một chấm xanh sáng, thẻ chỉ vào chấm đó — lời: "Trong tia chỉ còn khoảng hai phẩy năm phần trăm màu xanh." | phần trăm phải là thứ đếm được, không phải một con số trôi trên màn hình | `XANH CÒN 2,5 %` |
| 19 | c19 | 77.20–79.61 | N3 · fov 24: thước đo phần trăm phía dưới — ba chấm đỏ sáng, thẻ chỉ vào chấm đó — lời: "Còn màu đỏ thì vẫn còn khoảng mười lăm phần trăm." | cùng một cách đo, đối chiếu ngay với câu trước | `ĐỎ CÒN 15 %` |
| 20 | c20 | 80.61–82.95 | N1R · fov 30: đĩa Mặt Trời đỏ rực giữa khung, quầng sáng cam, lan can thành bóng ở đáy khung — lời: "Nên Mặt Trời ta nhìn thấy lúc này là màu đỏ." | câu kết luận — máy nhìn thẳng vào đĩa Mặt Trời | |
| 21 | c21 | 83.55–85.89 | N1R · fov 40: cả sân thượng nhuốm cam, bóng đổ dài về phía máy — lời: "Mọi thứ dưới ánh sáng ấy cũng đổi màu theo." | "mọi thứ" — phải thấy nhiều vật trong một khung, không chỉ một | |
| 22 | c22 | 86.55–90.29 | N1R · fov 50: tờ giấy trên lan can, mặt tường nhà thang, mặt nước trong thùng — ba mặt phẳng cùng nhuốm cam — lời: "Tờ giấy trắng trên lan can, mặt tường và mặt nước trong thùng đều nhuốm cam." | câu liệt kê ba mặt phẳng — máy phải lùi đủ xa để chứa cả ba trong khung | |
| 23 | c23 | 91.24–93.84 | N1R · fov 50: ngẩng lên — chân trời đỏ ở đáy khung, phần trời cao còn xanh — lời: "Nhưng cùng lúc ấy, phần trời cao vẫn còn xanh." | hai màu phải cùng khung, nếu không thì câu kể không đúng | |
| 24 | c24 | 94.44–96.94 | N1R · fov 52: ngẩng cao hơn nữa, khung gần như chỉ còn trời xanh — lời: "Vì ánh sáng ở trên cao chỉ đi qua ít không khí." | máy ngẩng theo lời giải thích: càng lên cao càng xanh | |
| 25 | c25 | 97.84–100.60 | N5 · fov 30: dải nhạt gần như trắng nằm giữa dải đỏ bên dưới và dải xanh bên trên — lời: "Sát chân trời lại còn một dải nhạt, gần như trắng." | câu giới thiệu dải nhạt — máy nhìn ngang vào đúng dải | |
| 26 | c26 | 101.25–104.48 | N5 · fov 22: cận một hạt bụi mờ to, cạnh nó là một hạt không khí nhỏ xíu — lời: "Trong không khí có hạt bụi mờ, to hơn hạt không khí rất nhiều." | "to hơn ... rất nhiều" — hai hạt phải cùng khung thì người xem mới so được | |
| 27 | c27 | 105.08–109.30 | N5 · fov 34: lùi ra — cả dải nhạt, hạt bụi lơ lửng trong đó làm nhoè màu — lời: "Hạt bụi không rẽ mạnh, nó chỉ làm nhoè màu, nên dải ấy nhạt gần như trắng." | phải thấy dải và hạt cùng lúc, mới hiểu hạt làm nhoè thế nào | |
| 28 | c28 | 110.40–114.06 | N4 · fov 30: Trái Đất từ không gian, vùng sáng còn hẹp chạy vòng chân trời — lời: "Sau khi Mặt Trời lặn, trời không tắt ngay mà còn xanh thêm một lúc nữa." | câu mở đầu đoạn không gian — máy lùi ra để thấy trọn vùng sáng | |
| 29 | c29 | 114.76–118.32 | N4 · fov 26: tiến sát hơn, vệt sáng hẹp lại thành một đường mảnh quanh chân trời — lời: "Nhìn từ không gian, vùng sáng còn hẹp chạy vòng quanh chân trời Trái Đất." | "còn hẹp" — phải đủ gần thì vùng sáng mới thành một đường mảnh | |
| 30 | c30 | 119.32–124.05 | N4 · fov 30: hai lớp quanh Trái Đất — vỏ khí quyển xanh dày ôm sát mặt đất, một dải ozon tím mỏng ở trên cao; hai thẻ chỉ vào hai lớp — lời: "Cái xanh ấy là của ozon: ở trên cao có một lớp rất mỏng, mỏng hơn lớp không khí." | câu gọi tên hai lớp — mỗi thẻ phải chỉ vào đúng lớp của nó | `LỚP KHÍ QUYỂN`, `LỚP OZON` |
| 31 | c31 | 124.75–128.98 | N4 · fov 30: chùm sáng cam đỏ đi vào lớp mỏng ở ranh giới ngày-đêm — lời: "Chùm sáng cam đỏ đi qua lớp mỏng ấy thì phần đỏ bị nuốt, chỉ màu xanh lọt qua." | máy vào sát chỗ chuyển tiếp, nơi chùm sáng đổi màu | |
| 32 | c32 | 129.68–133.64 | N4 · fov 28: phần xanh lọt qua, rọi xuống mặt đêm của Trái Đất — lời: "Màu xanh lọt qua ấy rọi xuống mặt đêm, và nó quyết định màu của cả giờ xanh." | "rọi xuống mặt đêm" — máy nhìn sang phía tối, nơi màu xanh rơi xuống | |
| 33 | c33 | 134.54–137.36 | N4 · fov 30: lùi ra, vùng sáng lùi dần theo vệt sáng — lời: "Màu xanh ấy chỉ kéo dài khi Mặt Trời lặn chưa quá xa." | thấy vùng sáng hẹp lại, chứ không chỉ thấy nó còn | |
| 34 | c34 | 138.11–143.05 | N4 · fov 28: vệt sáng chạy vòng quanh chân trời, thẻ chỉ vào vệt — lời: "Từ lúc Mặt Trời vừa lặn cho tới khi lặn sâu sáu độ dưới chân trời, vùng sáng vẫn còn xanh như thế." | mốc độ phải bám vào vệt sáng, không đứng riêng | `MẶT TRỜI LẶN 0° → 6°` |
| 35 | c35 | 144.20–147.92 | N6 · fov 40: quay lại đúng góc khung mở của c01, nhưng trời đã là màu xế chiều — lời: "Màu trời, hóa ra, là bản ghi của đường đi ánh sáng trong không khí." | câu chốt — lặp lại đúng khung mở để thấy chỗ này không có màu riêng của nó | |
| 36 | c36 | 148.62–151.93 | N6 · fov 30: cận tờ giấy trên lan can, giờ nó xanh nhạt chứ không còn trắng — lời: "Tờ giấy trắng trên lan can giờ không còn trắng nữa, mà xanh nhạt." | bằng chứng cụ thể cho câu trước, phải thấy được chính tờ giấy | |
| 37 | c37 | 152.93–157.56 | N6 · fov 46: đúng góc khung mở của c01/c35 nhưng rộng hơn và ngước thêm — trời xanh tím ở trên, tờ giấy trên lan can cùng một màu — lời: "Nó lấy đúng màu của thứ sáng đang rọi xuống, và lúc này thứ sáng ấy là màu xanh của giờ xanh." | câu chốt — phải thấy CÙNG một nơi chốn như c01/c35 nhưng khác màu; máy đứng đúng chỗ của khung mở, không đổi góc | |

## Nhãn và phụ đề

- **Phụ đề**: đốt từ `voice/words.json` (giọng đã thu), hiện ở dải dưới khung, một mảnh một lúc.
- **Thẻ thuật ngữ**: sáu thẻ, mỗi thẻ chỉ hiện trong đúng câu của nó (mở trước câu 0.25 s, tắt sau câu 0.30 s),
  để khung của câu nào cũng chỉ có nhãn của câu đó — người xem và người chấm hình đọc cùng một bộ.
  Mũi tên của thẻ luôn chạm vào đúng vật mà câu đang kể: dải sóng ngắn (c09), thước đo quãng (c15), chấm xanh
  và chấm đỏ trên hai thước đo phần trăm (c18, c19), hai lớp vỏ khí quyển và ozon (c30), vệt sáng chạy vòng
  (c34).
- **Chỗ trống cho nhãn**: mọi thẻ được dồn về phía trên-phải mũi tên; ở các nhát 30, 34 phần trống là phía
  trên khung, không đè lên vùng đang kể.

## Âm thanh (đặt sẵn cho bước dựng)

- **Nền**: đường phố xa lúc chiều muộn (c01–c03) → tiếng ù trầm của không khí ban ngày (c04–c13) → nền trầm
  hơn lúc chiều muộn trong không khí (c14–c19) → đường phố lúc Mặt Trời sát chân trời (c20–c24) → nền trầm
  ở sát chân trời (c25–c27) → nền trầm ở không gian (c28–c34) → thành phố về đêm (c35–c37).
- **Nhạc**: bảy đoạn, đổi đoạn đúng lúc đổi nơi chốn (A lúc mở đầu, B khi vào không khí, C khi sang chiều
  muộn, D lúc Mặt Trời sát chân trời, E ở sát chân trời, F ở không gian, G lúc xế chiều).
- **Tiếng động**: một tiếng `whoosh_soft` mỗi lần đổi nơi chốn; `line_draw` khi thước đo quãng hiện ra;
  `dot_place` mỗi khi một chấm phần trăm sáng lên; `label_in` nhẹ mỗi khi một thẻ hiện ra.

## Vòng chấm

- **Vòng 4 (đã có phán quyết)**: 33 mục ĐẠT, 4 mục phải sửa — c29, c31, c32, c34, đều ở bối cảnh N4 (không
  gian quanh Trái Đất). Người chấm thấy: một sợi dây tím mỏng đi ngang TRƯỚC mặt Trái Đất; chùm xanh kết
  thúc bằng một hình chữ nhật sáng có bốn cạnh cứng; vùng xanh lọt qua là một tấm hình chữ nhật phẳng, cạnh
  cứng rõ; mặt đại dương lộ đường nối facet thẳng của lưới cầu; mép Trái Đất hoàn toàn không có nét mực;
  vòng tím chiến mạnh, cạnh tranh với chủ đề của đoạn.
- **Đã sửa cho vòng 5**: bỏ hẳn dải ozon ở xích đạo; khí quyển và ozon dựng lại thành hai quầng sáng mềm
  quanh mép hành tinh (xanh ở trong, tím ở ngoài, quầng tím chỉ mạnh quanh vùng hoàng hôn) thay cho vỏ
  fresnel đọc ra như một vành tròn của vật khác; bậc sáng của mặt cầu chuyển từ cắt cứng sang mờ dần (hết
  vệt facet trên mặt đại dương); thêm nét mực ở mép cầu; chùm đỏ dừng ở mép hành tinh (sửa sai số gốc của
  phương trình tia–cầu, tia cứ sơn lên mặt đang có nắng); vùng sáng xanh không còn là tấm phẳng nữa mà được
  vẽ thẳng lên mặt cầu thành một dải mềm ôm lấy ranh giới ngày-đêm, có hạt sáng nhỏ rải trong đó.
- **Ảnh khung hình chính**: `review/hero/c01.jpg … c37.jpg` — dựng lại toàn bộ sau khi sửa N4, tên tệp là
  mã câu.
- **Vòng 5 (đã có phán quyết)**: **37 ĐẠT · 0 MỞ · 0 PHẢI SỬA** — bước `look` đóng. Báo cáo ở
  `review/LOOK.md`, chi tiết theo mục ở `review/look-5.md`; còn ba góp ý không chặn: c28 (cạnh thẳng đứng
  tuyệt đối ở x≈740 trên đại dương, đọc như mép ô mây hình chữ nhật — nên bo tròn ô mây đó), c29 (còn seam
  dọc ở x≈715 trên mặt nước, vùng sáng loang không có mép rõ), c35 (mặt nước trong thùng sáng hơn thân
  thùng và không có lấp lánh — nên làm tối lại). Ba góp ý này để dành cho vòng polish sau bước 6, vì sửa
  bây giờ sẽ mở lại bước `look`.

## Việc còn dở (cho chặng sau)

- **Bố cục**: `gate.py status` báo `src/sets/` nằm ngoài bố cục — hợp đồng (`docs/layout.md`) quy định
  `src/` chỉ chứa các tệp `.js` và thư mục `src/props/`. Script dàn trải đã có sẵn ở `out/scratch/flatten_sets.py`;
  chạy nó ở chặng bước 4–5, rồi sửa các đường dẫn import cho khớp.
- Chưa có `COMPONENTS_SPEC.md` và chưa có `src/props/`: bước 4–5 phải dựng từ đầu.
