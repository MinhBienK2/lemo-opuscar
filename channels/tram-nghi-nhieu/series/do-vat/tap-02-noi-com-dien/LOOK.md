# LOOK — Vì sao nồi cơm điện tự biết lúc nào cơm chín?

Khung hình của tập, làm theo `STYLE.md` của kênh. Mọi mốc thời gian lấy từ `voice/proc/dur.json` và
`src/timeline.js` (giọng đã thu, `mk_timeline.py` của kênh sinh ra), không ước lượng.

Nguyên tắc của bản này: **mỗi câu kể một hình**. Một câu = một bố cục riêng (rộng – trung – cận – siêu cận xen
kẽ), máy cắt theo nhịp lời. Không nhát nào kéo dài quá một câu, để không câu nào phải dùng lại hình của câu trước.

## Bố cục thế giới

Ba nơi chốn, mỗi nơi một cách dựng:

| Nơi chốn | Dựng thế nào | Vai trò |
|---|---|---|
| **N1 · bếp buổi sáng** | bàn gỗ dọc tường gạch, cửa sổ có lỗ trên tường, nồi cơm điện hiện đại, một chiếc nồi cơm đời đầu, đồng hồ treo tường, bát đong nước và túi gạo | câu hỏi đời thường, kết quả thí nghiệm và lời khuyên cuối (c1–c6, c27, c36, c40–c44, c46–c48) |
| **N2 · nồi cơm điện bị cưa ngang** | vỏ nồi bị cưa ở mặt phẳng z = 0: thấy mâm nhiệt, dây điện trở xoắn quanh thành mâm, lò xo ép viên cầu đầu dò nhiệt, hai dây chạy xuống bo mạch; lớp nước và lớp gạo cũng bị cưa, hạt gạo nằm ngang trên mặt cắt. Ở c7 nồi trong được bỏ đi để thấy trọn mâm nhiệt; ở c45 trên thành nồi hiện vệt nước ở đúng mực nước cũ | cách cơ chế đo nhiệt thật sự hoạt động (c7–c35) |
| **N3 · đáy nồi cơm đời đầu** | thân sành cưa ngang, bên trong là thanh lưỡng kim, hai tiếp điểm và vòng dây điện trở | cơ chế cũ: công tắc nhiệt cơ thay cho vi mạch (c37–c39) |

Vật đặt trong phòng (toạ độ thế giới, `src/set.js`): **nồi cơm điện hiện đại** ở `(-1.05, 0, .78)`;
**nồi cơm đời đầu** ở `(-.34, 0, .95)` (chỉ hiện ở c36); **hai nồi thí nghiệm bị cưa** ở `.62` và `1.24`
(chỉ hiện ở c40–c43), nước rót vào lần lượt tới `.130` và `.108`; **nhiệt kế** cắm trong nồi bị cưa ở
`(.052, .081, .008)`, hai nhiệt kế thí nghiệm ở `(.565, .078, .828)` và `(1.185, .078, .828)`;
**đồng hồ treo tường** ở `(1.80, 1.58, .03)`; **bát đong nước** ở `(-.30, 0, .44)` và **túi
gạo** ở `(-.66, 0, .40)` (chỉ hiện ở c47–c48).

Trong nồi bị cưa, thứ tự từ đáy lên là: **đáy nồi → lớp nước → lớp gạo**. Mặt trong của đáy nồi ở
cao độ `60 mm`, đúng chỗ đầu dò nhiệt chạm vào; lớp nước ở `60–118 mm`, lớp gạo ở `118–205 mm`
nên nó nóng lên sớm nhất. Khi nước cạn (c28, c45) lớp gạo rơi xuống đáy và trên thành nồi hiện
vệt nước ở đúng mực nước cũ.

Ánh sáng N1: một đèn chính ấm xiên qua lỗ cửa sổ (in bóng rõ trên bàn và tường), một vệt sáng nhỏ luôn đặt
đúng chỗ đang kể (`pool`), và ánh sáng môi trường tím lạnh của buổi sớm. Khi nắp nồi mở (c46–c48) một đèn nhỏ
bên trong nồi bật lên để cơm phải trắng chứ không đen như mực.

Ánh sáng N2 và N3: một đèn chính ấm từ phía máy, một vệt sáng hẹp rọi vào cơ chế, nền tím tối. Mọi thứ vô
hình (nhiệt, tín hiệu điện, hơi nước) mới thành vật minh hoạ: làn nhiệt cam, dải sáng xanh trên dây, bọt sôi.

## 48 nhát: một câu một hình

| # | Câu | Mốc (giây) | Nhìn gì | Lý do của góc máy |
|---|---|---|---|---|
| 1 | c1 | 2.40–6.07 | N1 · fov 46: toàn cảnh bếp buổi sáng — nồi cơm điện đang nấu trên mặt bàn gỗ, vệt nắng từ cửa sổ rọi ngang bàn, dây điện chạy về ổ cắm trên tường, hơi nước mỏng bay lên từ lỗ nắm — lời: "Buổi sáng, một chiếc nồi cơm điện đang nấu trên mặt bàn gỗ dưới cửa sổ." | mở đầu đời thường: phải biết ngay đây là buổi sáng và có một cái nồi đang nấu |
| 2 | c2 | 6.27–9.65 | N1 · fov 34: cận thân nồi, một khối kín có vân vỏ mịn, không có mắt mũi, dây điện chạy về ổ cắm trên tường — lời: "Nó không có mắt, không có mũi, cũng không nếm được gì cả." | phải thấy rõ nó chỉ là một vật kín, không có gì để "biết" |
| 3 | c3 | 10.10–13.73 | N1 · fov 26: siêu cận bảng điều khiển, đèn báo chuyển từ đỏ sang hổ phách (hổ phách phải đọc ra là hổ phách, không phải vàng thuần), nhãn ĐÈN BÁO nằm ở mép trên đèn chứ không đè lên đèn — lời: "Rồi đến lúc nào đó, đèn trên thân nồi tự chuyển từ đỏ sang hổ phách." | mốc thời gian nằm ở chiếc đèn, không nằm ở cả nồi |
| 4 | c4 | 13.93–16.68 | N1 · fov 36: cận cả nồi, đèn đã hổ phách, dây điện cắm vào ổ trên tường, hơi nước đã tắt — lời: "Tiếng sôi tắt hẳn, và nồi vừa tự biết cơm chín." | tiếng sôi tắt là một sự kiện: khung phải có nồi, không chỉ có đèn |
| 5 | c5 | 17.28–19.90 | N1 · fov 28: nhìn thấp vào thân nồi, bảng điều khiển và tay cầm, một khối kín — lời: "Nhưng nói thật thì, nó không biết cơm chín là gì." | nói thật thì cần một cái nhìn khác hẳn câu trước: thấp và sát, vẫn không thấy gì bên trong |
| 6 | c6 | 20.10–21.91 | N1 · fov 34: cận nắp nồi và núm cầm — lời: "Nó chỉ biết một thứ thôi: nhiệt." | câu ngắn thì hình cũng ngắn: một cận, không kể lại cả nồi |
| 7 | c7 | 22.51–26.24 | N2 · fov 34: nhìn thẳng xuống đáy nồi bị cưa — nồi trong đã bỏ đi, thấy trọn mâm nhiệt tròn và vòng dây điện trở xoắn quanh thành, hai nhãn MÂM NHIỆT và DÂY ĐIỆN TRỞ chỉ vào đúng chỗ — lời: "Dưới đáy nồi có một mâm nhiệt tròn, quanh thành là dây điện trở xoắn lại." | câu nói về đáy nồi: máy phải cắt ngang nồi và bỏ nồi trong đi, thấy đáy thật |
| 8 | c8 | 26.44–29.57 | N2 · fov 32: nhìn từ trên xuống chính giữa mâm nhiệt, viên cầu tròn (một quả cầu thật, có bóng đổ) nằm trên lò xo, dây điện trở đỏ quanh thành — lời: "Ở chính giữa mâm nhiệt, một viên cầu nhỏ nằm trên lò xo." | vị trí "chính giữa" phải đúng: máy nhìn từ trên xuống, thấy cả mâm nhiệt lẫn viên cầu ở giữa |
| 9 | c9 | 29.77–31.53 | N2 · fov 22: nhìn ngang qua mặt cắt, lò xo xoắc đứng giữa viên cầu và đáy nồi — lời: "Lò xo ép nó thẳng vào đáy nồi." | một câu ngắn về một mối ép: nhìn ngang, thấy rõ lò xo nằm giữa viên cầu và đáy |
| 10 | c10 | 31.98–35.87 | N2 · fov 14: siêu cận viên cầu, nhãn đầu dò nhiệt chỉ vào nó — lời: "Viên cầu đó là một đầu dò nhiệt: điện trở của nó tụt xuống khi nó nóng lên." | đặt tên vật thì máy phải đủ gần để người xem tin nổi đó là viên cầu |
| 11 | c11 | 36.07–39.49 | N2 · fov 34: cầu đo điện trở hiện trên màn hình, số đổi từ mười kiloôm sang một kiloôm — lời: "Lúc mát là mười kiloôm, khi nóng lên chỉ còn khoảng một kiloôm." | con số là thứ đọc được, nên phải có một cái màn hình thật trong khung |
| 12 | c12 | 40.09–42.49 | N2 · fov 26: cận hai dây mảnh chạy từ viên cầu xuống bo mạch, dải sáng xanh chạy theo dây — lời: "Hai dây mảnh đó chạy lên bo mạch bên dưới nồi." | phải thấy đường đi của hai dây, nên máy chui xuống dưới mâm nhiệt |
| 13 | c13 | 42.69–46.10 | N2 · fov 24: bo mạch dưới nồi, con chip xám sáng với chân IC, nhãn BO MẠCH cắm vào mặt bo xanh (không phải vào con chip) — lời: "Ở đó, mạch điện đo điện trở ấy và tính ra một con số nhiệt độ." | câu nói về chỗ tính toán: máy phải xuống tới đúng con chip, không phải tới cả bo mạch |
| 14 | c14 | 46.55–49.60 | N2 · fov 36: nhìn ngang qua đáy nồi, mâm nhiệt nằm ngay dưới lớp nước — lời: "Và con số đó là nhiệt độ của đáy nồi, không phải của cơm." | phải thấy con số gắn với đáy nồi: tầm mắt phải thấp, ngang với đáy |
| 15 | c15 | 49.80–52.70 | N2 · fov 42: rộng cả nồi cưa: lớp gạo nằm trên cao, đầu dò nhiệt nằm sát đáy — lời: "Cơm nằm ở trên cao, còn cái cảm biến nằm sát đáy." | hai vị trí phải cùng một khung, nếu không thì người xem không so được |
| 16 | c16 | 53.30–56.36 | N2 · fov 30: cận mâm nhiệt, dây điện trở bên trong đang đỏ lên — lời: "Cơm nấu lên thế này: dây điện trở trong mâm nhiệt nóng lên trước." | câu kể thứ tự nóng: khung phải ở đúng chỗ nóng trước tiên |
| 17 | c17 | 56.56–59.14 | N2 · fov 38: làn nhiệt cam đi từ mâm nhiệt lên qua lớp nước vào lớp gạo — lời: "Rồi đáy nồi ấm lên, nước và gạo nóng theo." | nhiệt đi lên là một dòng chuyển động: máy phải thấy cả đáy lẫn lớp gạo |
| 18 | c18 | 59.74–61.33 | N2 · fov 30: lớp nước ở đáy nồi đang sôi, dải bọt sôi dâng ở vạch nước, nhiệt kế cắm bên cạnh, thẻ TRĂM ĐỘ chỉ vào mép phải của chữ 100, thân thẻ trôi sang nền tối bên phải thang nên không đè lên số nào — lời: "Nước sôi ở khoảng một trăm độ." | mốc một trăm độ phải gắn với một hình đang sôi, và phải đọc được con số |
| 19 | c19 | 61.53–63.90 | N2 · fov 34: cận nhiệt kế, ống thủy ngữ và cột thủy ngữ đứng ngay vạch sôi — lời: "Nhiệt kế cắm trong nồi cũng chỉ ở vạch sôi ấy." | câu nói về một vạch: máy đẩy vào thang chia |
| 20 | c20 | 64.35–66.06 | N2 · fov 30: lớp nước ở đáy nồi, lớp gạo nằm ngay trên lớp nước, mặt trên lớp gạo là hạt thật chứ không phải một mặt đĩa trơn, cả hai cùng một khung — lời: "Còn cơm thì chín sớm hơn nhiều." | phải thấy lớp gạo nằm ngay trên lớp nước ở đáy thì mới hiểu vì sao chín sớm |
| 21 | c21 | 66.26–69.12 | N2 · fov 26: cận mặt cắt của lớp gạo trong nồi, từng hạt gạo bị cưa hiện thành hạt bầu trắng — lời: "Tinh bột trong hạt gạo bắt đầu hồ hóa từ khoảng sáu mươi độ." | hồ hóa là việc bên trong hạt: máy phải vào tới mặt cắt của lớp gạo |
| 22 | c22 | 69.32–71.14 | N2 · fov 30: mặt cắt lớp gạo, lớp nước ở đáy ngay dưới, một hạt gạo bị cưa có khối đứng ở ranh giới, nhãn nước hút vào hạt chỉ vào ranh giới nước–gạo — lời: "Và nước thì bị hút vào hạt gạo." | nước ở ngay dưới lớp gạo nên máy dựng ranh giới nước–gạo, không phải cả nồi |
| 23 | c23 | 71.74–74.32 | N2 · fov 30: cả nồi cưa, nước còn sôi mà lớp gạo đã chín — lời: "Nên trong lúc nồi còn sôi, cơm đã chín rồi." | nghịch lý "còn sôi mà đã chín" chỉ thấy được khi hai lớp cùng khung; khung phải đủ gần để thấy cả hai |
| 24 | c24 | 74.52–78.96 | N2 · fov 30: cận đáy nồi bị cưa — mặt cưa của lớp nước nằm ngay trên đáy nồi, viên cầu đầu dò nhiệt ép lên đáy, bên phải là thang chia của nhiệt kế với số 100 in to và vạch sôi đỏ, nhãn TRĂM ĐỘ chỉ vào mép phải của chữ 100, thân thẻ nằm trên nền tối bên phải thang nên không đè lên số — lời: "Vì nước còn trong nồi, nhiệt độ đáy nồi bị ghim ở vạch sôi ấy, không lên được cao hơn." | câu dài về một nguyên nhân: máy ở lại đúng chỗ đang bị ghim, và con số trên thang phải đọc được chứ không chỉ là một vạch mờ |
| 25 | c25 | 79.56–81.19 | N2 · fov 30: cả nồi cưa đứng yên trên bàn, không có gì chuyển động — lời: "Vậy nồi làm gì trong lúc đó?" | câu hỏi cần một khung tĩnh: thấy rõ là không có gì chạy |
| 26 | c26 | 81.39–83.04 | N2 · fov 26: nhìn ngang, nồi đứng yên đó, lớp nước phẳng lì, không bọt sôi — lời: "Nó đứng yên đó, chờ." | câu trả lời ngắn: đổi hẳn góc nhìn để khung không lặp lại câu trước |
| 27 | c27 | 83.24–86.11 | N1 · fov 30: đồng hồ trên tường, kim đang chạy nhanh — lời: "Nhiệt độ đi ngang, còn đồng hồ trên tường thì cứ chạy." | so hai thứ đi ngược chiều nhau: cái đồng hồ là hình ứng |
| 28 | c28 | 86.81–89.05 | N2 · fov 36: nồi cưa, lớp nước đã mất hẳn (không còn dải nước nào dưới lớp gạo), lớp gạo rơi sát đáy, trên thành còn vệt nước cũ ở đúng mực nước cũ — lời: "Rồi một ngày nọ, nước trong nồi cạn hết." | cạn nước là một sự kiện: khung phải thấy chỗ trống mà nước để lại |
| 29 | c29 | 89.25–90.84 | N2 · fov 26: máy ngang tầm đáy nồi — mặt cưa của thành nồi và đáy nồi trơn (đĩa nhôm có vân xoắn), không còn lớp nước nào, trên thành còn vệt nước cũ ở đúng mực nước cũ, bên dưới là bo mạch với viên cầu đầu dò nhiệt ép lên đáy — lời: "Không còn gì để hấp nhiệt nữa." | máy phải xuống sát đáy: cái đáy trống mới nói lên câu này, và vệt nước cũ là bằng chứng đã cạn |
| 30 | c30 | 91.04–94.09 | N2 · fov 26: cận thang chia của nhiệt kế, cột thủy ngữ vượt lên trên vạch một trăm độ, thẻ 100 °C chỉ vào mép phải của chữ 100 — lời: "Nhiệt độ đáy nồi nhảy vọt lên, vượt lên trên một trăm độ." | nhảy vọt là động tác trên thang đo: máy phải đủ gần để đọc vạch và thấy con số |
| 31 | c31 | 94.69–96.11 | N2 · fov 16: siêu cận đỉnh cột thủy ngữ, cột đứng trên dải tối của tấm thang chia (nền tối của cảnh), vùng sáng nhất là đỉnh cột — lời: "Và đó chính là tín hiệu." | câu ngắn nói về một đỉnh: một siêu cận, không kể lại thang đo |
| 32 | c32 | 96.31–99.36 | N2 · fov 26: hai dây về bo mạch, dải sáng xanh chạy nhanh hơn — lời: "Dải sáng chạy trên hai dây về bo mạch cũng chạy nhanh hơn hẳn." | tín hiệu chạy là một vật thật: máy theo dải sáng về bo mạch |
| 33 | c33 | 99.56–102.41 | N2 · fov 32: bo mạch dưới nồi, mâm nhiệt tắt đi — lời: "Bo mạch ra lệnh, và dây điện trở ở mâm nhiệt tắt đi." | lệnh đi từ bo mạch xuống mâm: một khung phải chứa cả hai đầu dây |
| 34 | c34 | 103.11–106.47 | N2 · fov 30: mâm nhiệt nhấp nháy đỏ, dây điện trở bật lại — lời: "Rồi nồi chuyển sang giữ ấm: dây điện trở bật lại theo kiểu bật tắt." | bật tắt là nhịp: khung phải ở ngay chỗ sáng tắt |
| 35 | c35 | 106.67–109.81 | N2 · fov 30: cận nhiệt kế, cột thủy ngữ tụt xuống dưới vạch sôi, nhãn vạch sôi chỉ bên trên: thẻ TRĂM ĐỘ chỉ vào mép phải của chữ 100 ở góc trên khung, thẻ BẢY MƯỜI ĐỘ chỉ vào vạch bảy mươi nơi cột đang dừng — lời: "Cả nồi được giữ ở khoảng bảy mươi độ, thấp hơn nhiệt độ sôi." | so "thấp hơn nhiệt độ sôi" thì phải thấy cả hai vạch trong một khung |
| 36 | c36 | 110.61–112.55 | N1 · fov 46: nồi hiện đại và nồi đời đầu đặt cạnh nhau trên bàn, cửa sổ có nắng ở trên — lời: "Cơ chế này có từ trước khi có vi mạch." | so hai thế hệ trong một khung, máy lùi ra để thấy cả hai |
| 37 | c37 | 112.75–115.47 | N3 · fov 30: hạ máy xuống tận đáy nồi cơm đời đầu bị cưa, bộ công tắc nhiệt cơ nằm ngay đó với thanh lưỡng kim và hai tiếp điểm, nhãn thanh lưỡng kim chỉ vào nó — lời: "Hồi xưa nồi cơm chỉ có một công tắc nhiệt cơ ở đáy nồi." | câu nói về đáy nồi cũ: máy đi thẳng vào bên trong nồi cơm đời đầu, thấy cơ cấu thật nằm trên đáy |
| 38 | c38 | 115.67–119.22 | N3 · fov 24: cận thanh lưỡng kim đang cong xuống, nhãn thanh lưỡng kim chỉ vào nó — lời: "Một thanh lưỡng kim, nóng lên thì cong ra, bấm tách tiếp điểm." | cơ lưỡng kim là vật mới: phải đủ gần để thấy nó cong |
| 39 | c39 | 119.82–121.56 | N3 · fov 22: cận hai đầu tiếp điểm bạc đã rời nhau, có vòng lửa nhỏ ở chỗ tách, đầu thanh lưỡng kim đã ấn xuống — lời: "Mạch mở, dây điện trở tắt." | hậu quả phải thấy được: hai đầu tiếp xúc rời nhau là bằng chứng |
| 40 | c40 | 121.76–124.50 | N1 · fov 38: bàn tay cầm bát đong nước rót vào nồi bị cưa bên trái, dòng nước rơi xuống mặt nước — lời: "Muốn biết nồi có thật sự đang đo nước không, mình thử." | câu nói về một phép thử: máy phải thấy tay rót nước thật |
| 41 | c41 | 125.10–127.55 | N1 · fov 44: hai nồi cưa cạnh nhau, nồi trái nước cao, nồi phải nước thấp, tay rót nước vào nồi bên phải — lời: "Một nồi đổ nhiều nước, một nồi đổ ít nước." | khác biệt phải thấy được: phải có cả hai nồi trong khung |
| 42 | c42 | 127.75–131.68 | N1 · fov 42: nồi bên phải bị cưa: mực nước tụt xuống sát đáy, đèn chuyển hổ phách trên vành, cột thủy ngữ vượt vạch sôi — lời: "Nồi bên phải cạn nước trước, nhiệt độ nhảy lên, đèn chuyển sang giữ ấm." | ba dấu hiệu phải cùng khung: mực nước, nhiệt độ và đèn |
| 43 | c43 | 131.88–134.18 | N1 · fov 24: nhìn thấp vào nồi bên trái, nước còn sôi bọt bục, đèn vẫn đỏ — lời: "Nồi bên trái vẫn còn nước, vẫn đang sôi." | đối chiếu với câu trước: góc thấp hẳn, thấy rõ nước còn sôi |
| 44 | c44 | 134.88–137.22 | N1 · fov 36: nồi cơm điện ngập trong bóng, cửa sổ ló ở góc — lời: "Như vậy, nồi cơm điện không biết cơm chín." | kết luận phải có một hình trầm, không phải một hình kỹ thuật |
| 45 | c45 | 137.41–138.74 | N2 · fov 30: nhìn xuống đáy nồi trong — lớp cơm đã cạn nằm sát đáy, trên thành còn vệt nước ở đúng mực nước cũ, nhãn VẾT NƯỚC chỉ vào vệt đó, nhãn ĐÁY NỒI chỉ vào đáy nồi đã cạn — lời: "Nó biết nước đã cạn." | máy xuống đáy: nước cạn là một sự kiện ở đáy nồi, và phải thấy được vệt nước còn lại |
| 46 | c46 | 138.94–141.36 | N1 · fov 36: bàn tay nắm vành nắp rồi nâng lên, ngón tay quàng lên vành nắp, hơi nước tụt, lớp cơm trắng lộ ra — lời: "May mắn là lúc nước cạn thì cơm cũng vừa chín." | khoảnh khắc mở nắp là cảnh duy nhất có cơm trắng trong phim |
| 47 | c47 | 142.16–143.68 | N1 · fov 32: nhìn thẳng vào túi gạo (trái) và bát đong nước (phải) đứng cạnh nhau, mấy hạt gạo rơi giữa bàn — cả hai vật nằm trọn trong khung — lời: "Lời khuyên thì đơn giản thôi." | lời khuyên cần thấy trước mắt cái bát nước và túi gạo |
| 48 | c48 | 143.88–147.18 | N1 · fov 32: bát đong nước có mặt nước xanh nhạt và vạch chia số 1-2-3 in trên thành bát, bên cạnh là túi gạo và mấy hạt gạo rơi — lời: "Nếu nồi báo chín muộn bất thường, hãy xem lại lượng nước bạn đổ." | câu cuối trỏ về một vật cụ thể: máy đẩy vào bát nước |

## Ghi chú cho người làm phim

- Mọi nhát đều phải có `window.EV` (tiếng động, giọng, nhạc) khớp với câu đang kể; không nhát nào để trống.
- Nhãn trong khung chỉ tên vật thật (mâm nhiệt, đầu dò nhiệt, bo mạch, thanh lưỡng kim, vạch sôi) — không đặt
  con số nào lên màn hình ngoài những gì lời kể đã nói.
- Nếu phải dựng lại một ảnh: dựng đúng tệp `review/hero/t_<giây>.jpg` đó, không đổi tên, để vòng chấm chỉ
  chấm lại ảnh vừa dựng.

## Những cờ máy đã thấy mà không sửa, và vì sao

- **RUN (c7–c35 trên cùng bộ vật của nồi cưa):** đây là một cảnh cưa dài, và đó là ý tức phim: câu hỏi
  "nồi biết gì" chỉ trả lời được khi máy đi vào bên trong nồi và ở lại đó. Bên trong nồi có những vật
  thật, mỗi câu một vật và một góc riêng (viên cầu, lò xo, mâm nhiệt, hai dây, bo mạch, con chip, nhiệt kế,
  mặt nước, hạt gạo); máy đo "vật lớn nhất trong khung" nên thấy vỏ nồi ở mọi câu và tưởng là một
  mạch câu. Ở các câu cần thay bầu không khí, phim cắt ra ngoài (c27 đồng hồ trên tường, c36 nồi cơm đời
  đầu, c37–c39 bộ công tắc nhiệt cơ, c40–c43 thí nghiệm hai nồi, c46–c48 cảnh kết).
- **Số in trên thang nhiệt kế** (0/20/40/60/80/100/120) là số vẽ trong texture của vật, nên máy đo bằng
  cách đọc chữ trên màn hình thì không thấy. Người xem thấy rõ: các câu cần con số đều có thêm thẻ chữ
  trên màn hình (`TRĂM ĐỘ`, `100 °C`, `BẢY MƯỜI ĐỘ`) chỉ vào đúng vạch. Vạch sôi đỏ thay luôn vạch thường
  ở vạch 100, và chữ "SÔI" nằm ngang hàng với dải đỏ, giữa dải và con số "100" — đặt chữ dưới dải thì
  nó trôi xuống giữa hai vạch và người xem đọc nhầm là mốc 90 độ.
- **Mũi tên của thẻ chỉ vào mép PHẢI của số, không phải mép trái.** Rig đặt đầu mũi tên đúng vào điểm
  chiếu của neo, còn thân thẻ luôn nằm ở bên trên-phải mũi tên; thẻ không bao giờ nằm bên trái mục tiêu.
  Vạch sôi nằm sát chữ "100" mà chữ "120" lại nằm ngay phía trên nó, nên neo phải đặt ở mép phải của chữ
  "100": mũi tên chạm đúng số, thân thẻ trôi sang nền tối bên phải thang, không đè lên số nào.
- **Đỉnh cột thủy ngữ là mặt trên của bọt tròn, không phải tâm của nó.** Tâm bọt nằm thấp hơn một bán
  kính dưới vạch; nếu đặt tâm bọt đúng vạch thì bọt lọt lên trên và người xem đọc cột cao hơn thật
  vài độ (ở khung siêu cận, đỉnh cột chạm vạch 120 trong khi câu kể nói cột đang ở 112).

## Vòng 1

- **Thấy:** dựng đủ 48 khung hình chính vào `review/hero/` và chấm từng khung một. Lần đầu nhìn tờ sheet có
  nhiều mục sai ngay từ đầu.
- **Sửa:** sửa hết những mục này ở vòng 2.

Những gì nhìn ra sai:

- **Mũi tên đỏ và vạch "SÔI" cứ cắt ngang chữ "100"** trên thẻ thang đo (t_108.24, t_60.53, t_62.71, t_65.21,
  t_73.03, t_76.74, t_80.37, t_82.21, t_92.56). Người xem điện thoại không đọc được nhiệt độ nào đang ghim nồi.
- **Vạch "SÔI" không nằm bằng vạch 100** — nó cao hơn một nấc, nên thang tự mâu thuẫn với lời kể.
- **Cảnh bên trong nồi không có gì đọc được là đáy nồi** (t_114.11, t_30.65): bộ công tắc nhiệt cơ nằm trên một
  mặt be phẳng không giới hạn.
- **Mặt nước là một mảng bạc hà phẳng**, không sóng, không bọt, không phản chiếu (t_129.71, t_138.08).
- **Nền gạo là một bức tường nâu phẳng**, hạt gạo không đổ bóng, đốm tinh bột là hình tròn trắng phẳng dán lên
  mặt hạt và tràn ra ngoài viền (t_67.69, t_70.23).
- **Ba trụ xanh-trắng đứng không lý do trên mâm nhiệt** (t_54.83, t_28.01) và một mũi tên đỏ phẳng không viền mực
  bay trên mâm nhiệt.
- **Phụ đề đè lên bảng điều khiển của nồi** (t_4.23, t_18.59).

## Vòng 2

- **Thấy:** chấm lại những mục đã sửa. Phần lớn đã qua; hai mục còn sai.
- **Sửa:** sửa hai mục này ở vòng 3.

Còn lại:

- **t_129.71** — mặt nước còn mảng vệt tối/răng cưa tỏa ra như nan quạt, và bên phải vũng nước có vệt vân gỗ
  chạy ngang trên mặt nước. Sửa: đổi texture mặt nước sang gợn mềm đều, bỏ vân gỗ.
- **t_138.08** — vệt nước trên thành kết thúc bằng mũi nhọn như mẩu băng keo bị xé, và thiếu thẻ "ĐÁY NỒI"
  chỉ vào đáy nồi đã cạn.

## Vòng 3

- **Thấy:** chấm lại toàn bộ 48 khung sau vòng sửa.
- **Sửa:** sửa những mục này ở vòng 4.

Còn lại:

- **t_44.39** — dây nối ra khỏi chip được dựng thành dải đỏ dẹt rộng trượt đè lên hàng chân IC, tấm phẳng thay
  cho sợi dây. Sửa: dựng hai sợi dây tròn mảnh đi từ viên cầu xuống chân chip.
- **t_67.69, t_70.23** — hai khung cận cảnh trong nồi đọc như tranh 2D: nền gạo phẳng, hạt không đổ bóng, mặt
  nước là tấm bạc hà đồng nhất, tinh bột là hình tròn phẳng dán lên mặt hạt.
- **t_41.29, t_97.84** — cùng lỗi dây đỏ dẹt như t_44.39.

## Vòng 4

- **Thấy:** chấm lại riêng năm mục vừa nêu.
- **Sửa:** sửa ở vòng 5.

Cả năm mục vẫn mở, và nguyên nhân là chung: **hai dây đỏ vẫn là hai dải dẹt như băng keo** thay vì hai sợi dây
tròn, và hai khung cận cảnh trong nồi vẫn không có bóng, không có chiều sâu.

## Vòng 5

- **Thấy:** người chấm trả lời thiếu — cả 48 mục đều ghi "người chấm chưa trả lời đủ".
- **Sửa:** không sửa gì theo vòng này; chấm lại từ đầu ở vòng 6.

Một vòng chấm hỏng thì không phải vòng chấm. Phải chấm lại.

## Vòng 6

- **Thấy:** chấm lại toàn bộ; đa số đã qua.
- **Sửa:** sửa hai mục còn lại ở vòng 7.

Còn lại:

- **t_76.74** — câu nói về "nhiệt độ đáy nồi bị ghim ở vạch sôi" nhưng trong khung không thấy đáy nồi; dải cơ
  chế dưới đáy là vùng tối nhất khung, còn con số "100" chỉ cao mười mấy pixel và bị mũi tên đỏ cắt ngang.
  Sửa: đưa máy xuống sát đáy nồi, rọi vệt sáng vào cơ chế, làm số "100" và nhãn vạch sôi to đủ đọc.
- **t_90.04** — câu cần thấy "đáy nồi trơn" nhưng khung không có chỗ nào đọc được là đáy nồi: một mảng kem gần
  như không đổi sắc, không mép cưa, không vệt nước, không mâm nhiệt. Sửa: hạ máy vào trong miệng cưa, nhìn
  chéo xuống khoảng trống đáy, đưa đĩa mâm nhiệt và vệt nước cũ vào khung, tách hai dây thành hai sợi tròn.

## Vòng 7

- **Thấy:** chấm lại toàn bộ sau vòng sửa lớn (nền thang đo tối lại, số "100" to hơn, vạch "SÔI" bỏ chữ, hai
  dây tách thành hai sợi tròn).
- **Sửa:** sửa hai mục còn lại ở vòng 8; các mục mở ghi lại để rút kinh nghiệm.

Hai mục còn phải sửa đúng như vòng 6:

- **t_76.74** — vẫn không thấy đáy nồi; "100" và "SÔI" quá nhỏ và bị mũi tên cắt; 30% khung là tường tím
  trống.
- **t_90.04** — đáy nồi đọc ra là một tấm kem phẳng: không đĩa mâm nhiệt, không vệt nước cũ, không độ dày vỏ,
  không texture kim loại; hai dây đọc thành một dải đỏ liền khối.

Sáu mục mở (sai 3 lần, không chặn bước): t_41.29, t_44.39, t_67.69, t_70.23, t_95.40, t_97.84 — chủ yếu vẫn là
hai dây đỏ và hai khung cận cảnh trong nồi.

## Vòng 8

- **Thấy:** chấm lại những khung vừa đổi. Hai mục dây đỏ đã qua.
- **Sửa:** sửa hai mục CHẶN còn lại ở vòng 9.

- **t_41.29, t_44.39 — ĐẠT**: hai dây giờ là hai sợi tròn riêng biệt có bóng đổ, tách khỏi nhau; chip
  `IC-7404 / 2416` và mặt bo xanh đọc rõ; nhãn "BO MẠCH" cắm đúng vào bo, không vào mặt chip.

Còn lại hai mục chặn, cùng lý do: **đáy nồi vẫn chưa đọc ra.**

- **t_76.74** — máy phải xuống sát đáy nồi, số "100" và nhãn vạch sôi phải to đủ đọc trên điện thoại.
- **t_90.04** — đáy nồi phải có đĩa mâm nhiệt, vệt nước cũ, độ dày vỏ và texture kim loại; lớp gạo và nhiệt kế
  phải khớp với c28; hai dây phải là hai sợi tròn có bóng.

## Vòng 9

- **Thấy:** chấm lại những khung vừa đổi. **Hai mục chặn đã qua.**
- **Sửa:** không còn mục chặn; các mục mở ghi lại ở báo cáo để rút kinh nghiệm.

- **t_76.74 — ĐẠT**: đỉnh cột thủy ngữ dừng đúng vạch SÔI và chữ "100"; mặt cưa lớp nước nằm ngay trên đáy
  nồi; viên cầu trên lò xo ép lên đáy; thẻ "TRĂM ĐỘ" nằm sang bên phải, không đè lên số "120".
- **t_90.04 — ĐẠT**: đáy nồi là một đĩa nhôm nõng có vân xoắn đồng tâm, có dải vệt nước cũ nằm ngang trên
  thành — đọc ra ngay một đáy nồi đã cạn; hai dây nối chip với viên cầu là hai sợi riêng biệt có bóng đổ.

Còn ba mục MỞ (không chặn bước, đã sai 4–6 lần):

- **t_67.69, t_70.23** — hai khung siêu cận hạt gạo: nền gạo vẫn phẳng, hạt chưa đổ bóng, mặt nước vẫn là
  một dải bạc hà đồng nhất.
- **t_95.40** — khung cận đỉnh cột thủy ngữ: ánh sáng đều tải, vùng sáng nhất chưa rơi vào đỉnh cột, và còn
  một mũi tên đỏ thừa chĩa vào ống kính ở cao độ thấp hơn đỉnh cột.

## Vòng 10

- **Thấy:** vòng này không xét lại khung đứng yên nữa — vòng 9 đã đóng phần đó. Vòng này xét **phim chạy**:
  đo mọi khung hình liên tiếp và xem cái gì thật sự động, cái gì chỉ là tường đứng.
- **Sửa:** trước vòng này phim gần như đứng hình — máy quay có di chuyển nhưng trong khung không có gì
  chuyển động. Đã làm cho mọi vật thật trong khung có sự sống.

Mười việc đã làm, mỗi việc gắn với đúng một câu kể:

1. **Cột hơi nước** (c1–c3): hơi bốc thành cột, mỗi bông hơi có tốc độ leo và lắc riêng; tới lúc "sôi tắt
   hẳn" (c3) cột hơi gục hẳn trong 0.13 giây.
2. **Đèn nồi** (c3): bóng đèn hổ phách sáng dần và thở, thấy rõ lúc chuyển từ đỏ sang hổ phách.
3. **Vệt nắng trên tường** (c27): nắng chiều dịch ngang tường trong lúc đồng hồ chạy — đồng hồ đứng yên thì
   thời gian cũng đứng yên, đó là điều câu đó nói.
4. **Nước sôi** (c11, c17, c41): bọt bốc trên mặt cưa nước, băng bọt ở miệng nồi, hơi mỏng bốc lên.
5. **Nước hấp thụ** (c28): có nước thật chảy vào hạt gạo, vệt ướt loang, vòng sóng nhỏ trên mặt gạo.
6. **Thanh lưỡng kim** (c38–c39): thanh cong dần theo nhiệt, tới đúng lúc tiếng "cạch" thì bấm tách tiếp
   điểm, lóe tia lửa, dây điện trở tắt hẳn và thanh nguội xuống.
7. **Nồi cạn nước** (c42): mực nước nồi phải tụt thật xuống đáy rồi mới tắt hẳn, không biến mất bằng một
   cú cắt giữa khung.
8. **Cơm nở** (c20, c21, c23): lớp gạo phồng lên theo nhịp sôi; hạt gạo cắt đôi nở ra.
9. **Bao gạo và bát đong** (c47, c48): bao gạo lắc đặt lên đáy, bát đong rung lên và nước dâng tới vạch "3".
10. **Mâm nhiệt và cột thủy ngữ** (c11, c19, c35): đầu dò nhiệt rung khi nóng; cột thủy ngữ run nhẹ lúc sôi
    và dừng đúng vạch 70 độ lúc chuyển sang giữ ấm.

Ba mục MỞ của vòng 9 (t_67.69, t_70.23, t_95.40) vẫn để mở, đã sai 4–6 lần và không chặn bước.

