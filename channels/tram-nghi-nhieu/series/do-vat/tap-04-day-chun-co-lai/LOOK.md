# LOOK — Tại sao dây chun bị kéo căng rồi hơi nóng thì lại co lại?

Khung hình của tập, làm theo `STYLE.md` của kênh: diorama 3D toon, ánh sáng thật, viền mực vẽ tay, một giọng kể tiếng Việt, máy quay đi **vào bên trong vật thật**.

Nguyên tắc của bản này: **mỗi câu kể một hình**. Một câu = một bố cục riêng (rộng – trung – cận – siêu cận xen kẽ), máy cắt theo nhịp lời. Không nhát nào kéo dài quá một câu, để không câu nào phải dùng lại hình của câu trước. Cự ly và tiêu cự ghi trong bảng dưới là của `src/film.js` (`SHOTS`): `fov` là tiêu cự, `pos` là vị trí máy, `look` là điểm nhìn, `d` là máy trượt trong nhát.

Mọi mốc thời gian lấy từ `voice/proc/dur.json` và `src/timeline.js` (giọng đã thu, `mk_timeline.py` của kênh sinh ra), không ước lượng.

## Bố cục thế giới

Ba nơi chốn, mỗi nơi một tầng của câu hỏi: **hiện tượng** (bếp) → **cơ chế** (bên trong sợi dây) → **phép đo** (bàn đo ban đêm) → quay lại bếp để chốt.

| Nơi chốn | Toạ độ chính | Vai trò |
|---|---|---|
| N1 bếp buổi sáng | quầy ở `z ≈ 0.8`, tường gạch ở `z ≈ 0.2` | hiện tượng: dây quấn nắp hũ siết, thép dãn, dây chùng nở (c1–c8), quay lại chốt (c27, c42–c44, c46–c48) |
| N2 bên trong sợi dây | mạng chuỗi quanh gốc, mặt cắt ở `z = −1.45` | cơ chế: chuỗi, cách cuộn, entropy, lực co đổi theo nhiệt (c9–c26, c45) |
| N3 bàn đo ban đêm | mặt bàn `z ≈ 0.91`, đèn bàn từ bên trái | phép đo: nhiệt kế, thước, lực kế, hiệu ứng Joule (c28–c41) |

Vật định vị trong bếp (tọa độ thế giới, `src/set.js` → `buildKitchen`): **hũ ấm** `jar1` ở `x = −0.83`, nắp ở `y = 0.198`, **dây quấn nắp** `band1` là một vòng đỏ quanh miệng nắp (`R = 0.075`, đặt ở `y = 0.2055`, cao hơn mặt nắp nên dây nổi lên trên miệng nắp); **hũ lạnh** `jar2` ở `x = −0.59` (chỉ xuất hiện từ c42 trở đi); **máy sấy tóc** ở `x = −1.20`, miệng máy ở `x = −1.105, y = 0.19`, tay cầm chạm mặt quầy; **sợi thép** ghim ở `x = −0.65` và trượt tới `x = −0.35`; **thước gỗ** nằm **dưới** đầu tự do của sợi thép, ở `x = −0.45`; **vòng dây chùng** móc qua hai ghim ở `x = −0.04` và `x = 0.20`, dải nằm phẳng trên quầy ở `x = −0.08 … +0.24`.

Vật định vị trong bàn đo (`src/set.js` → `buildDesk`): hai **chân đế** ở `x = −0.30` (dây chun) và `x = 0.10` (sợi thép) — hai cột đứng **sát nhau** để một khung hình đọc được cả hai đường lực–giãn, đồng hồ đo lực treo ở `y = 0.381` trên vạt kẹp đưa ra trước cột; **dây chun treo** từ `y = 0.30` xuống, **quả cân** ở dưới; **thước đứng** ở `x = −0.375`, số đếm từ đáy lên; **nhiệt kế chính** ở `x = −0.20` (đo nhiệt của dây lúc thổi hơi nóng); **nhiệt kế nhỏ** ở `x = 0.48` với **vòng dây quanh bầu** (hiệu ứng Joule) — nó đứng sang bên phải, tách khỏi hai cột đo, để khung nào cũng không bị nó chen vào giữa; **máy sấy tóc** ở `x = −0.72`, tay cầm ở `x = −0.92`. Trên tường ngay sau bàn đo có **bảng ghi chép** rộng 1,55 m: không có nó thì nửa trên khung là tường xanh trơn.

Ba con số được lên hình — **20 °C** (c30), **60 °C** (c32), **14 %** (c36) — đều là một vật trong khung, và mỗi vật có câu lời kể đọc nó. Không con số nào khác được vẽ lên hình.

## Ba khung hero

| Khung | Cảnh | Góc máy | Vì sao là khung hero |
|---|---|---|---|
| Hero 1 | bếp: hũ thủy tinh có dây chun quấn nắp | cận ngang **vừa** (fov 28), máy ở `(-0.60, 0.30, 1.22)`, nhìn `(-0.86, 0.15, 0.80)` | người xem phải thấy ngay **vật** mà câu hỏi nói về: một sợi dây quấn quanh nắp một cái hũ, và cái máy sẽ thổi nóng vào nó |
| Hero 2 | bên trong sợi dây: mạng chuỗi, mỗi chuỗi là một dãy mắt xích uốn lượn, móc nối vàng ở giữa | cận, máy ở `(0.06, 0.10, 0.66)`, nhìn `(0, 0.02, −0.18)`, fov 30 | "không có lò xo nào cả" — phải thấy bằng mắt rằng bên trong là **mạng chuỗi**, chứ không phải chỗ rỗng; hạt xích sát nhau đọc ra là **dây xích**, và nền tím có vệt sáng chứ không phải tường trơn |
| Hero 3 | bàn đo ban đêm: hai chân đế đứng cạnh nhau, hai đồng hồ đo lực, dây treo quả cân, thước, nhiệt kế, bảng ghi chép trên tường | rộng, máy **thấp** ở `(-0.10, 0.24, 1.70)`, nhìn `(-0.10, 0.22, 0.91)`, fov 38 | một nơi mới, một tầng mới: **bộ đo** phải đọc được trong một khung, để câu "mình làm phép đo" có đạo cụ trước khi kể; máy thấp để cả bộ đo chiếm **chiều cao** khung, không dồn xuống đáy |

## 48 nhát: một câu một hình

| # | Câu | Mốc (giây) | Nhìn gì | Lý do của góc máy |
|---|---|---|---|---|
| 1 | c1 | 0:02.4–0:05.2 | bếp, cận **nắp hũ có dây chun quấn quanh** (máy ở `(-0.60, 0.30, 1.22)` nhìn `(-0.86, 0.15, 0.80)` fov 28, **lệch trái** để bình đựng đũa ở mép trái không lọt vào khung): "Một sợi dây chun quấn quanh nắp một hũ thủy tinh trên mặt bếp." — dây đỏ quanh miệng nắp, mặt quầy gỗ, gạch tường sau | mở đầu đời thường: câu hỏi nằm ở **một cái hũ trên bếp**, nên máy phải đứng ngang tầm nắp để cái dây quanh nắp đọc ra |
| 2 | c2 | 0:05.7–0:07.5 | bếp, máy sấy tóc ở bên trái, **luồng hơi nóng** (hạt cam) chạy ngang qua dây quấn nắp: "Bây giờ mình thổi hơi nóng vào nó." | "Bây giờ mình thổi" — máy phải thấy **cả nguồn nhiệt lẫn dây** trong một khung, nếu không thì người xem tắt tiếng không biết nhiệt đến từ đâu |
| 3 | c3 | 0:07.7–0:10.4 | bếp, cận **vòng dây quanh nắp hũ**, máy ở `(-0.62, 0.34, 1.10)` nhìn `(-0.86, 0.18, 0.79)` fov 30, **miệng máy sấy tóc ở góc trái**: "Nhìn kỹ thì thấy dây đang siết chặt vào nắp hũ hơn trước." | "siết chặt hơn trước" là một **so sánh**, nên máy phải thấy trọn vòng dây quanh miệng nắp **và** luồng hơi nóng đang phả vào nó; một cận cảnh quá chặt chỉ ra một mảng màu phẳng — máy nâng lên cho dây **đọc thành vòng** chứ không thành một sợi ngang |
| 4 | c4 | 0:10.9–0:14.0 | bếp, **sợi thép mỏng** trải trên thước gỗ ở vế phải quầy, máy ở `(0.36, 0.13, 0.96)` nhìn `(0.26, 0.01, 0.82)` fov 22: đầu tự do nằm trước vạch 20 cm, số thước đọc được: "Cùng một sợi thép mỏng, hơi nóng phả vào thì nó dãn ra." | vật đối chứng phải có mặt riêng, không tranh sự chú ý: máy nhìn xuống thẳng sợi thép và vạch thước để "dãn ra" là một chuyển động đọc được — **đầu tự do phải nằm trong khung**, không cắt ra ngoài mép |
| 5 | c5 | 0:14.2–0:17.4 | bếp, **vòng dây chùng** nằm ngay cạnh hũ, hai đầu móc lỏng qua hai ghim (đầu đĩa ghim nhô lên trên mặt dây), máy ở `(-0.36, 0.16, 1.08)` nhìn `(-0.56, 0.03, 0.82)` fov 30: "Còn một vòng dây chùng chưa kéo gì, nóng lên thì nó dài ra." | vế thứ hai của hiện tượng: dây **chưa kéo** thì nóng lên nở ra — phải thấy cái vòng chùng riêng, không phải cái dây quanh nắp; máy nhìn chếch xuống 20° để dải dây **nằm ngang khung** (đầu đĩa ghim nhìn thấy, dải dài chạy chéo ra khung) chứ không thành một mảng màu phẳng, và đầu trái của dải phải còn chỗ trống bên trái để dây trượt ra khi nóng |
| 6 | c6 | 0:17.9–0:20.3 | bếp, khung vừa ở `(-0.62, 0.30, 1.30)` nhìn `(-0.64, 0.10, 0.80)` fov 38: bên trái **hũ có dây đã siết**, bên phải **vòng dây chùng đã dài ra**, giữa khung là **luồng hơi nóng**: "Vậy cao su không phải lúc nào cũng co khi nóng." | câu này cần **hai thứ cùng một khung** — cái quấn chặt và cái chùng — thì mới ra chuyện "không phải lúc nào cũng"; hai cái phải **đứng cạnh nhau** trên quầy (vòng dây chùng nằm sát mép hũ), nếu chừa xa nhau thì một khung phải chứa cả quầy và không vật nào đủ lớn để đọc |
| 7 | c7 | 0:20.5–0:21.6 | bếp, cận **vòng dây quanh miệng nắp hũ**, máy ở `(-0.70, 0.16, 1.05)` nhìn `(-0.84, 0.18, 0.79)` fov 26: "Vì sao lại như vậy?" | một câu hỏi không cần hình mới, chỉ cần **khoảng lặng**; nhưng khung phải đọc ra **cái dây đã ăn vào nắp**, nên máy cận vào vòng dây chứ không nhìn vào một mặt tròn màu be |
| 8 | c8 | 0:22.1–0:24.0 | bếp, cận **vòng dây quanh nắp**, máy ở `(-0.90, 0.21, 0.90)` nhìn `(-0.85, 0.20, 0.78)` fov 30, khung gần như chỉ còn **cái dây**: "Câu trả lời nằm ở bên trong sợi dây." | nhát chuyển cảnh: câu trả lời nằm bên trong — máy phải **tiến vào trong vật**, và khung phải chỉ còn cái dây |
| 9 | c9 | 0:26.4–0:28.7 | N2, mạng chuỗi trải khắp khung: "Bên trong dây chun không có lò xo nào cả." | "không có lò xo" phải thấy bằng mắt; khung rộng để **không** có lò xo nào lọt vào, và nền tím có mảng mờ chứ không trơn |
| 10 | c10 | 0:28.9–0:32.4 | N2, **một sợi chuỗi ở tiền cảnh** (hạt tách rời, chạy ngang khung) với mạng chuỗi phía sau: "Ở trong là một mạng chuỗi polymer, mỗi chuỗi là một dãy mắt xích dài." | "mỗi chuỗi là một dãy mắt xích dài" cần thấy **một dãy** trước khi nói về cả mạng: sợi tiền cảnh có hạt **tách rời** để đọc ra là xích, còn mạng phía sau cho thấy nó là một phần của mạng |
| 11 | c11 | 0:32.9–0:36.1 | N2, cận **móc liên kết chéo** giữa hai chuỗi: "Các chuỗi quấn vào nhau thành một mạng, có móc nối chúng không cho trượt." | chi tiết làm nhận ra vật liệu: móc nối là thứ **bằng hình**, không kể bằng lời |
| 12 | c12 | 0:36.3–0:39.5 | N2, **nhóm bốn sợi** cuộn lỏng xoắn vụn, mỗi sợi một kiểu: "Ở trạng thái tự nhiên, mỗi chuỗi cuộn tròn một cách ngẫu nhiên." | khái niệm "cuộn tròn" phải **có hình trước khi dùng**, và phải thấy ngay là mỗi sợi khác nhau |
| 13 | c13 | 0:39.9–0:42.7 | N2, nhìn **từ trên xuống** nhóm sợi, mỗi sợi một cách cuộn: "Một sợi chuỗi cuộn như vậy có rất nhiều cách cuộn khác nhau." | "rất nhiều cách" phải đếm được bằng mắt: nhìn từ trên xuống thì cách cuộn của từng sợi tách bạch nhau |
| 14 | c14 | 0:42.9–0:45.7 | N2, cận **mắt xích của một sợi**, cùng số mắt, xếp khác đi: "Cùng số mắt xích, nhưng xếp khác đi thì là một cách khác." | "cùng số mắt xích" cần thấy được — máy vào sát một sợi để đếm được mắt |
| 15 | c15 | 0:46.2–0:49.4 | N2, mạng chuỗi **nhìn từ trên xuống**, hạt hỗn độn: "Tổng số những cách sắp xếp đó, người ta gọi là entropy." | entropy là "dễ xáo trộn", phải có **hình xáo trộn** |
| 16 | c16 | 0:49.6–0:52.3 | N2, **nhìn dọc theo mạng**, các sợi chạy ra xa: "Entropy càng nhiều, mọi thứ càng dễ xáo trộn." | hành vi của chuỗi, không phải mũi tên: chuỗi **tự** tìm chỗ có nhiều cách cuộn hơn |
| 17 | c17 | 0:52.7–0:55.4 | N2, cận **một sợi đang cuộn ra**, các hạt tách dần: "Và chuỗi luôn ham quay về chỗ nào có nhiều cách cuộn hơn." | "nhiều cách cuộn hơn" phải thấy trước khi gọi tên entropy — và sợi phải **cuộn ra** trong chính nhát này, không phải đứng yên |
| 18 | c18 | 0:55.6–0:57.1 | N2, **bàn tay nắm đúng đầu mạng rồi kéo ra**, máy ở `(1.30, 0.26, 0.95)` nhìn `(0.34, 0.02, −0.05)`, fov 30, cả mạng chạy từ mép trái vào nắm tay: "Bây giờ mình kéo dây ra." | chuyển động do **tay**, không do camera: máy đi theo tay để thấy cái kéo; ngón tay **chạm vào hạt cuối cùng của mạng**, không đứng lơ lửng bên cạnh; máy **lùi xa** để cặn tay không nuốt khung và để người xem thấy sợi xích chạy **vào** nắm tay |
| 19 | c19 | 0:57.5–1:00.2 | N2, các chuỗi **bị kéo thẳng**, những đoạn cuộn biến mất hết: "Các chuỗi bị kéo thẳng, những đoạn cuộn biến mất hết." | nhất thiết phải thấy **đoạn cuộn biến mất** — đó là cái nhìn thấy được của "mất entropy" |
| 20 | c20 | 1:00.4–1:03.4 | N2, cận **một sợi đã thẳng**, các hạt nằm thành hàng: "Những cách cuộn đó không còn nữa, entropy tụt xuống." | thấy hậu quả của việc kéo: sợi thẳng không còn chỗ cuộn nào, và các hạt **tách ra** chứ không dính thành một thanh trơn |
| 21 | c21 | 1:03.9–1:09.7 | N2, tay vẫn kéo, chuỗi thẳng: "Đó là lý do dây tự co lại, không phải vì móc nối giữ chuỗi, mà vì chuỗi ham quay về chỗ có nhiều cách cuộn hơn." | câu chốt cơ chế: khung phải giữ **tay đang kéo** để "tự co lại" còn là một lực đang chống lại tay |
| 22 | c22 | 1:09.9–1:12.4 | N2, **vệt nhiệt quét ngang** mạng chuỗi, mép vệt mềm: "Sức co ấy không cố định, nó đổi theo nhiệt độ." | nhiệt phải đi vào mạng như một vệt, để "đổi theo nhiệt độ" có nguyên nhân trong hình |
| 23 | c23 | 1:12.9–1:15.8 | N2, **dải dây treo giữa hai ghim ngang nhau** (máy ở `(0, 0.66, 1.16)` nhìn `(0, 0.63, 0.58)` fov 30 — **vừa đủ gần** để trọn dải và cả hai ghim vào khung mà dải không thành một sợi mảnh leo): vùng nóng (trái) bị kéo thẳng, vùng lạnh (phải) thõng thành một vòng treo: "Và mấu chốt là lực co đó tỉ lệ với nhiệt độ tuyệt đối." | một dải, hai vùng, một máy: "tỉ lệ" là quan hệ giữa hai vùng trong cùng một khung; nhiệt **đi vào từ bên trái** (cùng chiều với vệt nhiệt ở c22) nên vùng nóng **ửng cam và tự sáng dần** trong chính nhát này |
| 24 | c24 | 1:16.0–1:19.1 | N2, **hai mạng cạnh nhau**: mát (xanh) và nóng (cam): "Nóng hơn thì lực co của mạng chuỗi lớn hơn ở cùng một độ giãn." | "ở cùng một độ giãn" cần hai bản **cùng kéo** nhưng co khác nhau, đứng cạnh nhau |
| 25 | c25 | 1:19.5–1:22.3 | N2, **hai đoạn dây cùng một mức kéo**: dải **đỏ** (mát) bên trái, dải **cam** (nóng) bên phải, mỗi đoạn treo một quả cân, quả cân của đoạn nóng **nhích lên**: "Ở cùng một mức kéo, dây nóng co chặt hơn dây mát." | đoạn nóng co lại thì quả cân của nó **nhích lên** — đó là hình của "co chặt hơn"; hai dải **khác màu** và máy **lùi xa** (`0, 0.28, 1.10`, fov 36) để thấy trọn cả hai đoạn, chứ không chỉ hai quả cân |
| 26 | c26 | 1:22.5–1:25.8 | N2, **hai đoạn dây**, máy ở `(-0.22, 0.14, 0.95)` nhìn `(0, 0.12, 0.52)` fov 30: quả cân của đoạn **nóng (cam)** nằm **cao hơn hẳn** quả cân của đoạn **mát (đỏ)**: "Nếu dây đang giữ một vật nặng, nóng lên thì nó phải ngắn lại." | hệ quả nhìn thấy được dưới một tải trọng cố định: hai quả cân phải **cùng một khung** và **khác nhau về độ cao** |
| 27 | c27 | 1:26.3–1:28.5 | bếp, quay lại nắp hũ: "Đó là lý do dây chun co lại khi hơi nóng." | về lại hiện tượng để **khép vòng** trước khi đi vào phép đo |
| 28 | c28 | 1:30.9–1:33.0 | N3, khung rộng **bàn đo ban đêm** (máy ở `(-0.10, 0.24, 1.70)` nhìn `(-0.10, 0.22, 0.91)` fov 38 — **lùi ra** để cả bộ đo, cả hai đồng hồ và cả thước vào khung): hai chân đế đứng cạnh nhau, hai đồng hồ đo lực, dây treo quả cân, thước, nhiệt kế, bảng ghi chép trên tường: "Để kiểm chứng, mình làm phép đo." | một nơi mới, một tầng mới; bộ đo phải **đọc được trong một khung** trước khi kể, nên máy thấp và lùi xa để cả bộ đo đứng giữa khung |
| 29 | c29 | 1:33.2–1:37.2 | N3, **dây treo quả cân cạnh thước**, máy nhìn từ bên phải: "Một sợi dây chun, một vật nặng treo ở một đầu, một thước để đo chiều dài." | giới thiệu bộ đo: ba thứ phải cùng khung để câu sau ("ở hai mươi độ, dây đứng ở vị trí này") có một cái mốc |
| 30 | c30 | 1:37.7–1:40.0 | N3, **thước đứng và nhiệt kế chính** cạnh nhau, thẻ `20 °C` chỉ vào đỉnh cột thủy ngân: "Ở hai mươi độ, dây đứng ở vị trí này." | số đo đầu tiên phải **là một vật trong khung**, không phải chữ trôi; dây phải ở trong khung để có "vị trí này" |
| 31 | c31 | 1:40.2–1:42.7 | N3, máy sấy tóc ở bên trái, **luồng hơi nóng** chạy sang phải vào dây chun, thước ở giữa: "Lần này mình làm có đo: thổi hơi nóng vào dây." | nhiệt phải vào **đúng chỗ cần nó**, nên máy phải thấy cả máy sấy tóc lẫn dây trong một khung |
| 32 | c32 | 1:43.2–1:44.6 | N3, siêu cận **cột thủy ngân**, thẻ `60 °C` chỉ vào đỉnh cột: "Nhiệt kế lên sáu mươi độ." | số đo thứ hai là một **cột thủy ngân dâng lên**, nên máy vào sát cột; chỗ trống bên phải để thẻ có chỗ mà không đè lên gì |
| 33 | c33 | 1:44.8–1:47.3 | N3, **dây ngắn lại, quả cân được nâng lên** trên thước đứng, máy trục lên theo vật nặng: "Và dây đã ngắn lại, vật nặng được nâng lên." | kết quả nhìn thấy được: dây, quả cân và vạch thước phải cùng khung, và máy **đi lên theo vật nặng** để thấy nó nâng lên |
| 34 | c34 | 1:47.8–1:50.7 | N3, máy sấy tóc thổi vào dây, luồng hơi nóng thấy rõ ở bên trái, dây và thước ở bên phải: "Không phải dây bị co vì nguội đi, nó đang nóng hơn trước." | chặn cách hiểu sai: nhiệt phải **còn trong khung** để "đang nóng hơn trước" có chứng cứ |
| 35 | c35 | 1:50.9–1:54.2 | N3, **tay giữ dây ở một vạch**, đồng hồ đo lực ở trên: "Mình đo lực co ở cùng một độ giãn, lúc mát và lúc nóng." | hai lần đo phải thấy rõ là **cùng một độ giãn**: tay giữ dây bất động là cái mốc, đồng hồ là cái đo |
| 36 | c36 | 1:54.6–1:56.6 | N3, cận **đồng hồ đo lực**, kim nhảy lên vạch cao hơn, thẻ `14 %` chỉ vào mặt đồng hồ: "Lực co mạnh lên khoảng mười bốn phần trăm." | con số của phép đo phải nằm trên **đạo cụ đang đo**, không phải trên băng chữ |
| 37 | c37 | 1:56.8–1:59.1 | N3, **hai đồng hồ đo lực cạnh nhau** (cột cao su bên trái, cột thép bên phải), bảng ghi chép phía sau: "Đường lực–giãn của cao su cũng chẳng giống thép." | so sánh phải **tách bạch trong một khung**: hai kim phải cùng một tấm hình, một bên cao su một bên thép |
| 38 | c38 | 1:59.5–2:03.9 | N3, cận **mặt đồng hồ đo lực của cao su**, dây đỏ treo xuống dưới, kim ở vạch cuối: "Kéo dây chun ra xa thêm, lực co không tăng đều như thép, mà vọt lên ở cuối." | "vọt lên ở cuối" là một hình: mặt đồng hồ phải đọc được **vạch** và **kim**, nên máy vào sát mặt đồng hồ nhưng vẫn thấy dây đỏ bên dưới để biết đó là sợi dây đang bị kéo |
| 39 | c39 | 2:04.3–2:07.6 | N3, cận **vòng dây chun quanh bầu nhiệt kế** ở `x = 0.48`, tay giật đuôi dây: "Ngược chiều với lúc nãy, kéo dây chun thật nhanh thì dây nóng lên." | "kéo thật nhanh" là một động tác; máy trục theo tay, và **bầu nhiệt kế phải nằm trong dây** để cái nhiệt sinh ra có nơi để đo |
| 40 | c40 | 2:07.8–2:10.1 | N3, siêu cận **cột thủy ngân của nhiệt kế nhỏ** dâng lên trong vòng dây: "Người ta đo được hiệu ứng này từ thế kỷ mười tám." | bằng chứng đo được: chỉ có **cột thủy ngân** làm chứng |
| 41 | c41 | 2:10.6–2:15.6 | N3, tay vẫn giật, cột thủy ngân dâng thêm: "Cao su giữ nhiệt kém lắm, nên chỉ một ít nhiệt sinh ra khi kéo cũng đủ làm dây nóng lên mấy độ." | kéo dài hơn một nhịp: nhiệt dung nhỏ nên nhiệt lên nhanh — cột dâng **thêm**, không phải đứng yên |
| 42 | c42 | 2:18.0–2:22.2 | bếp, **hai nắp hũ cạnh nhau**: một nắp ấm, một nắp vừa lấy ra từ tủ lạnh: "Quay lại cái nắp hũ lúc nãy, một nắp ấm, một nắp vừa lấy ra từ tủ lạnh." | chuẩn bị cảnh so sánh: hai cái nắp phải **cùng khung** thì câu sau mới có đối chiếu |
| 43 | c43 | 2:22.4–2:25.7 | bếp, cận **vòng dây trên nắp lạnh**, dây nổi cao hơn miệng nắp: "Trên nắp ấm, dây siết hơn; quanh nắp lạnh thì lỏng hơn." | so sánh phải tách bạch: **độ chìm của dây trong rãnh** là cái khác nhau, nên máy phải vào gần miệng nắp |
| 44 | c44 | 2:26.1–2:28.3 | bếp, máy sấy tóc ở bên trái, luồng hơi nóng bay sang hũ: "Cái co lại này không phải mẹo vặt của cao su." | khoảng lặng trước lời chốt, nhưng **nguyên nhân** (hơi nóng) vẫn còn trong khung |
| 45 | c45 | 2:28.5–2:32.7 | N2, quay nhanh vào **mạng chuỗi rung**, chuỗi cuộn và siết: "Đó là hệ quả tất yếu của vật liệu mà sức co đến từ sự hỗn loạn của vô số chuỗi." | về tới nguyên lý lần cuối: nhịp nhanh, đẩy vào, không lặp lại khung của chương hai |
| 46 | c46 | 2:33.1–2:35.8 | bếp, khung rộng: **dây quấn nắp hũ đang siết** ở bên trái, **vòng dây chùng đã dài ra hơn** ở bên phải: "Chỉ khi dây đang bị kéo căng thì nóng lên mới co lại." | điều kiện của câu trả lời cần **cả hai vế** trong một khung: dây đang kéo thì co, dây chùng thì nở |
| 47 | c47 | 2:36.1–2:40.5 | bếp, máy sấy tóc vẫn thổi vào dây quấn nắp hũ, **tay áp dây sát vào rãnh nắp**: "Nên khi bạn muốn một sợi dây siết chặt, hãy hâm nó nóng trước, rồi quấn lên nắp hũ." | một việc làm ngay: phải thấy **đạo cụ đang làm** (máy sấy tóc + tay), không phải nghe lời khuyên trên nền trống |
| 48 | c48 | 2:40.9–2:44.3 | bếp, khung rộng: **dây ăn sâu vào nắp**, luồng khí nóng bốc lên từ máy sấy tóc: "Dây ăn sâu vào nắp, luồng khí nóng vẫn bốc lên từ máy sấy tóc." | hình cuối phải gộp **cái kết quả** (dây ăn sâu) và **cái nguyên nhân** (khí nóng) trong một khung |

## Vòng 1

Nhìn 48 khung ở kích thước đầy đủ (1920×1080) và soi từng khung. Những lỗi vòng này thấy được:

- **Khung cắt mất vật chính.** Ở c33 ("Và dây đã ngắn lại, vật nặng được nâng lên") khung cận quá: vật nặng chiếm khung nhưng **sợi dây nằm ngoài khung trên**, nên cái "ngắn lại" không thấy được. Ở c36 thẻ `14 %` nằm ở góc trên bên phải, mũi tên chỉ vào một chỗ trống.
- **Thẻ chỉ sai chỗ.** Thẻ `14 %` neo vào `D.gauge.position` — mà đó là **vị trí cục bộ** của đồng hồ trong chân đế, không phải toạ độ thế giới; nên mũi tên chỉ ra khỏi đồng hồ.
- **Bàn đo bị bỏ trống.** Ở c32, c35, c39, c40, c41 phần lớn khung là tường tím trống hoặc mặt bàn trống; vật chính chỉ chiếm một góc.
- **Tay quá lớn, che vật.** Ở c35 và c39 bàn tay ở tiền cảnh chiếm gần nửa khung và che mất chỗ bàn tay đang nắm.
- **Máy sấy tóc ở bếp không cầm được.** Tay nắm tay cầm ở `x = −1.38` trong khi tay cầm máy ở `x = −1.35`: ngón tay không chạm tay cầm, bàn tay lơ lửng.
- **Luồng hơi nóng đi dưới dây quanh nắp.** Miệng máy ở `y = 0.185`, luồng đi xuống còn `y = 0.05`, nên hơi nóng lướt **dưới** dây — người xem thấy nhiệt đi qua mà không thấy nhiệt vào dây.
- **Hiệu ứng Joule không có chỗ để xảy ra.** Ở c39–c41 dây chun bị giật trên chân đế, còn nhiệt kế nhỏ đứng cách xa; không cái gì tiếp xúc, nên "kéo nhanh thì dây nóng lên" không có hình.

## Vòng 2

Sửa từng lỗi vòng 1 rồi dựng lại:

- **c33** mở rộng và trục lên theo vật nặng: fov 32, máy ở `(-0.31, 0.17, 1.37)`, nhìn `(-0.335, 0.17, 0.91)` — giờ dây, quả cân và vạch thước cùng khung.
- **Thẻ `14 %`** neo vào mép phải mặt đồng hồ: `[N3.GX + 0.062, 0.381, N3.Z]`, và c36 mở rộng (fov 30, máy ở `(0.10, 0.42, 1.40)`) để thẻ có chỗ trống mà không đè lên mặt đồng hồ.
- **Các khung trống** dùng tiêu cự dài hơn và máy lùi xa: c35 fov 26 ở `z = 1.66`, c39 fov 20 ở `z = 1.93`, c40 fov 20 ở `z = 1.60`, c41 fov 20 ở `z = 2.05`. Tay ở tiền cảnh nhỏ lại, vật chính chiếm phần lớn khung.
- **Tay cầm máy sấy tóc ở bếp**: cổ tay lùi thêm 20 cm (`dryGrip.x − 0.20`), nên ngón tay quấn đúng vào tay cầm.
- **Luồng hơi nóng ở bếp** được nâng lên ngang miệng dây quanh nắp (`y = 0.198`): máy sấy tóc đặt ở `y = 0.14` cho miệng ở `y = 0.19`, luồng đi từ `y = 0.19` xuống `y = 0.13` — hơi nóng đi qua đúng dây.
- **Hiệu ứng Joule được dựng lại thật**: dây chun bây giờ **quấn quanh bầu nhiệt kế nhỏ** ở `x = 0.15` (vòng đỏ + một đuôi dây sang trái), tay nắm đuôi dây và giật qua lại, cột thủy ngân dâng lên. Dây trên chân đế biến mất từ c39 trở đi, vì đó là **cùng một sợi dây** đã tháo ra.
- **c43** mở rộng để thấy **cả hai nắp**: fov 36, máy ở `(-0.71, 0.30, 1.18)` — nắp ấm bên trái (dây lún trong rãnh), nắp lạnh bên phải (dây nổi cao hơn miệng nắp).
- **c47, c48** lùi xa (fov 32 và 34) để máy sấy tóc, luồng hơi nóng, tay và nắp hũ cùng một khung.

## Vòng 3

Vòng này sửa những lỗi mà **máy đo** chỉ ra trên tờ sheet (cờ `SAME`, `FILL`, `DARK`) và những lỗi mắt thấy trên tờ sheet:

- **Hạt xích quá to.** Mạng chuỗi trước đây dùng hạt đường kính 2,6 cm — trong khung cận nó đọc ra là "mưa hạt rơi" chứ không phải một dây xích. Nay hạt nhỏ còn 1,0–1,5 cm và số hạt tăng lên (64 hạt một sợi), mạng đọc ra là **mạng xích** ở cả khung rộng lẫn khung cận.
- **Cùng một hình cho nhiều câu.** Mỗi câu trong chương hai giờ có hình riêng: mạng rộng (c9) · một sợi (c10) · móc nối (c11) · nhóm sợi (c12) · nhóm sợi từ trên xuống (c13) · mắt xích cận (c14) · mạng từ trên xuống (c15) · mạng nhìn dọc (c16) · sợi đang cuộn ra (c17). Máy không còn báo hai câu trùng hình nào liền nhau.
- **Sợi thẳng đọc ra là một thanh trơn.** Khi bị kéo thẳng, các hạt của sợi tiền cảnh **tách ra** (khoảng cách giãn 55 %) — như vậy "những cách cuộn đó không còn nữa" là một hình thấy được, chứ không phải một thanh vàng.
- **Vệt nhiệt không thấy được.** Nó vốn là một mặt phẳng đứng vuông góc trục x, nên máy quay chỉ thấy **mép** của nó. Nay nó quay mặt về phía máy, có texture mờ dần ở bốn cạnh (mép cứng đọc ra là tấm kính màu, không phải hơi nóng), và quét trong **phần mạng mà máy nhìn thấy** — trước đó nó quét ra khỏi khung giữa chừng.
- **Nhóm sợi tiền cảnh chìm vào nền.** Thêm một nêm sáng mềm từ bên trái trong N2; trước đó nhóm sợi nằm ở phía tối của nguồn sáng chính và máy đo báo khung tối.
- **Cận cảnh hũ toàn là mặt tròn màu be.** C3, c8, c43 đổi sang góc **ngang tầm dây**, để người xem thấy vòng dây đứng quanh miệng nắp và độ chìm của nó trong rãnh, thay vì một đĩa be.
- **Bàn đo tối và trống.** Nêm sáng thêm, và các nhát c28, c29, c37, c38 đổi góc để cột, thước và đồng hồ nằm trong **nửa trên** khung — phép đo của máy chỉ quét 80 % trên của khung, nên vật nằm thấp là vật "không có" với máy.

## Vòng 4

Vòng này làm theo giấy chấm **storyboard vòng 1** (REJECT). Ba khung hero được dựng lại, và những lỗi nó chỉ ra ở c18 và c23 đã sửa:

- **Hero 3 (c28) — dựng lại bộ đo.** Trước đó máy đứng cao (`y = 0.60`, fov 40) nên bộ đo dồn xuống đáy, hơn nửa khung là tường trơn, và cái máy sấy tóc hồng ở tiền cảnh là vật sáng nhất khung. Nay: máy **hạ xuống** `(-0.20, 0.30, 1.85)`, fov 30, nhìn `(-0.20, 0.24, 0.91)` — cả bộ đo đứng giữa chiều cao khung; máy sấy tóc **ra khỏi khung**; và **hai chân đế đứng cạnh nhau** (`x = −0.30` và `x = 0.10`) để một khung đọc được cả hai đường lực–giãn.
- **Tường sau bàn đo không còn trơn.** Thêm **bảng ghi chép** (1,55 × 1,05 m) treo ngay sau bàn đo: giấy nhớ có nét chữ vô nghĩa, mấy tờ giấy ghim, mấy mảnh giấy màu. Bảng **rộng hơn 1,2 m** nên máy đo không tính nó là chủ thể — nó làm nền, không làm vật chính của cảnh. Không vẽ đường cong lực–giãn lên bảng: phần đó là câu chuyện của phim, không phải của nền.
- **Hero 2 (c9) — mạng đọc ra là mạng.** Móc liên kết to hơn (`r = 0.040`) và **đổi sang vàng** (`#f0c76a`); vệt sáng từ trên rọi xuống mặt cắt đậm hơn (`alpha 0.075 → 0.13`); máy tiến lại gần (`fov 30`) để hạt xích sát nhau đọc ra là **dây xích** chứ không phải mưa hạt.
- **c18 — tay nắm được.** Bàn tay trong N2 **nhỏ lại** (0,72) và ngón chạm đúng hạt cuối của mạng, nên trong khung thấy rõ một sợi xích chạm vào nắm tay chứ không phải một bàn tay lơ lửng trong đám hạt.
- **c23 — dải treo.** Nửa nóng và nửa lạnh nay cùng **một hình học** (dải nối từng đoạn, chỉ khác màu và ánh sáng), nên người xem đọc ra là "cùng một sợi, vùng này nóng"; mốc nối không còn lớp bán trong suốt.
- **c10 — có hình riêng.** Thêm **một sợi chuỗi đơn** ở tiền cảnh N2: 26 hạt, khoảng cách hạt gần bằng đường kính nên đọc ra là **dãy mắt xích**, không phải một thanh trơn cũng không phải mưa hạt.
- **Bộ đo Joule dời sang bên phải** (`x = 0.48`): nó đứng giữa hai cột đo thì mọi khung cận đều bị nó chen vào; nay nó tách hẳn ra, và các nhát c39–c41 ngắm theo nó.

## Vòng 5

Vòng này làm tiếp theo giấy chấm **storyboard vòng 1**: hai điểm nó nêu mà vòng 4 mới sửa dở.

- **Hero 1 (c1) — khung chỉ còn cái hũ với vòng dây.** Vòng 4 để máy ở fov 30, và khung còn **một vật lạ ở góc trên-trái**: đó là bình đựng đũa của bếp (`#67b8c9`), cắt cụt ở mép khung nên đọc ra là một cụng xanh lơ lửng. Vòng 5 **siết lại** (fov 25) nên vật lạ chỉ còn một sợi mỏng ở góc, còn **vòng dây đỏ quanh nắp** chiếm trọn khung — nhưng khung chỉ còn **mặt nắp**, không đọc ra cái hũ. Vòng 6 **lùi xa và nâng lên** (fov 28, máy ở `-0.52, 0.30, 1.22` nhìn `-0.86, 0.15, 0.80`): cả **cái hũ** và **vòng dây quanh miệng nắp** cùng vào khung, bình đựng đũa chỉ còn một sợi mỏng ở góc trên-trái. Nêm sáng ấm từ phía máy quay (`#ffd9b0`, 1,7) kéo nửa phải khung ra khỏi bóng.
- **c25 — hai đoạn dây đọc ra được.** Trước đó máy quá gần, nên khung chỉ có **hai quả cân vàng khổng lồ** còn **dải dây thì nằm ngoài mép trên**; và hai dải cùng màu đỏ nên không phân biệt được dải nóng với dải mát. Nay: máy **lùi ra** (`0, 0.28, 1.10`, fov 36) để thấy trọn hai đoạn dây, dải **nóng đổi sang cam** (`#ff8a3d`), quả cân **nhỏ lại** và vệt nhiệt **đè lên đúng dải nóng**.
- **c18 — bàn tay thật sự nắm sợi xích.** Vòng 4 đặt ngón tay chạm hạt cuối, nhưng tay **quá to** và **còn cách sợi xích một đoạn**, nên khung đọc ra là một bàn tay vươn qua đám hạt. Nay: tay đặt đúng vào **hạt cuối của sợi thứ tư** (`z = −0.08`, cao độ `0.0225`) — ngón chạm hạt, sợi xích chạy **vào nắm tay**; và máy **lùi ra** (`1.30, 0.26, 0.95`, fov 30) để cặn tay không nuốt khung, sợi xích chạy từ mép trái vào tay đọc được là một sợi đang bị kéo.



## Vòng 6

- **Vòng 6 — mỗi câu phải có hình của riêng nó.** Ba câu của chương một đọc ra **một mảng màu phẳng**: c3 là hai sắc màu (dây + nắp), c7 là **mặt tròn màu be** của đáy nắp nhìn từ dưới lên, c8 là **một dải đỏ** chạy ngang khung. Nay: **c3** lùi ra (fov 32) để thấy trọn vòng dây quanh miệng nắp **và** miệng máy sấy tóc thổi vào; **c7** hạ máy xuống ngang tầm miệng nắp (fov 26) để khung là **cái dây ăn vào nắp**; **c8** siết vào vòng dây (fov 30) để khung gần như chỉ còn cái dây — nhát chuyển cảnh vào trong sợi dây. **c6** lùi xa (fov 38, máy thấp) để **ba** vật — hũ có dây, sợi thép, vòng dây chùng — cùng một khung, đúng như câu "không phải lúc nào cũng". **c26** xoay sang chế độ thấp (`-0.22, 0.14, 0.95`) để **hai quả cân** cùng khung và **khác nhau về độ cao**: quả của đoạn nóng nằm cao hơn. **c28** hạ máy xuống `(-0.20, 0.22, 1.73)` để bộ đo đứng giữa chiều cao khung, hơn nửa khung không còn là tường trơn. Và **sợi đơn** (một dãy mắt xích chạy ngang khung) nay chỉ hiện ở câu 10 — ở câu khác nó là một hạt to lơ lửng sát ống kính, đúng loại vật lạ mà không ai giải thích được.

## Vòng 7

Vòng này làm tiếp theo giấy chấm **storyboard vòng 1**: ba lỗi bố cục mà vòng 6 mới sửa dở, và một lỗi hình mà vòng 6 chưa nhìn ra vì nó nằm ở **vật dựng**, không nằm ở góc máy.

- **c1 — bình đựng đũa không còn lọt vào mép khung.** Vòng 6 lùi xa thì cái bình đựng đũa (`#67b8c9`) ở góc trên-trái lại lọt vào khung, đọc ra là một vật lạ không ai giải thích được. Nay máy **lệch sang trái** (`-0.60, 0.30, 1.22`, nhìn `-0.86, 0.15, 0.80`, fov 28): bình ra khỏi khung, còn **cả cái hũ** và **vòng dây quanh miệng nắp** vẫn trọn trong khung. Máy sấy tóc cũng không còn chĩa vào ống kính nữa — nó nằm ngoài khung c1 (c2 mới là nhát của nó).
- **c23 — dải dây là MỘT sợi, không phải một cái lược.** Vòng 6 dựng dải bằng 56 khối rời có khe hở, và khe hở ấy biến vùng lạnh thõng thành **mấy cái que toả ra như mặt trời** — người xem không đọc ra đó là dây. Nay dải là **hai nửa liền mạch** (mỗi nửa 29 lát cắt nối tiếp, mặt cắt chữ nhật, không khe hở), và hai nửa **chạm nhau đúng chỗ tiếp giáp** nên cả dải là một sợi: vùng nóng (cam) bị kéo thẳng, vùng lạnh (đỏ) thõng thành một vòng treo dưới dây. Máy **lùi xa** (`0, 0.66, 1.40`, nhìn `0, 0.64, 0.58`, fov 30) để trọn dải và **cả hai ghim** vào khung.
- **c28 — cả bộ đo đọc được trong một khung.** Vòng 6 hạ máy xuống nên tường hết, nhưng khung lại **cận quá**: đồng hồ bị cắt ở mép trên, thước và nhiệt kế bị cắt ở mép dưới. Nay máy **lùi ra** (`-0.10, 0.24, 1.70`, nhìn `-0.10, 0.22, 0.91`, fov 38): **hai đồng hồ đo lực** (cột dây chun và cột sợi thép — sợi thép **treo trên đồng hồ thứ hai**), **thước gỗ có số**, **nhiệt kế có thang số**, **dây chun treo quả cân** và **bảng ghi chép** đều trong khung. Máy sấy tóc ở `GX − .42` nằm ngoài mép trái nên không còn cướp mắt.

## Vòng 8

Vòng này làm theo giấy chấm **props vòng 1 và vòng 2**: tám vật bị chấm là **đọc ra một vật thật khác** (vòng cao su thành đĩa nhựa, dải thành que kem, ghim thành cọc sắt, quả cân thành hũ mật, vòng quanh bầu thành kính lúp, xích hạt thành đống quả, móc nối thành nhẫn vàng, dây treo thành cây bút chì). Sửa ở **vật dựng**, không sửa ở lời.

- **Vòng cao su (#1, #2) — mặt cắt bo tròn và chỗ hai đầu dán.** Nay vòng có **mặt cắt bo tròn** (không phải mặt phẳng rộng như đĩa) và một **đoạn hai lớp nổi lên** là chỗ hai đầu dán, nên nhìn từ trên xuống cũng biết đó là dây chun. Vòng **siết** (`setTighten`) nhỏ bán kính 5 %, mặt cắt mỏng đi 10 % theo bán kính và thấp đi 32 % theo chiều cao.
- **Dải dây (#3) và dây treo (#4) — dây mềm, có chỗ dán, ghim có đầu đĩa ở trên.** Dải nằm ngang nay **cong nhẹ** và có **đoạn hai đầu dán chồng** ở một đầu (một thanh thẳng cứng đọc ra là que kem). Dây treo **gập qua đầu ghim** và đầu ghim là **đĩa nhỏ dẹt, mũi chĩa xuống** — trước đây nó là một nón nhọn chĩa lên, đọc ra là cây bút chì.
- **Hũ thủy tinh (#5) — vai, cổ và ren vặn.** Thân hũ nay có **vai** và **cổ** (thân thẳng như cốc nhựa thì không ai gọi là hũ), và nắp có **ren xoắn ốc** chạy quanh thân nắm thay cho vòng răng chốt (răng chốt đứng thành vòng đọc ra là vương miện). Cổ nhỏ hơn nắp nên nắp **nhô ra**, đúng kiểu nắp vặn.
- **Máy sấy tóc (#6) — lưới nan thẳng, lưới hút ở đuôi, vòng treo, nút nhiệt.** Miệng máy có **lưới nan thẳng** (nan ngang + nan dọc) thay cho ba vòng xoắn ốc, đuôi có **lưới nan** thay cho nan hoa, tay cầm dài hơn và có **nút chỉnh nhiệt** riêng, gáy có **vòng dây treo**.
- **Sợi thép (#7) — đầu cắt kín.** Vân sáng dọc sợi **không chạm tới hai đầu**: chạm tới mép cắt thì cái vòng sáng ở đó đọc ra là miệng ống rỗng, và người xem gọi đây là ống hút.
- **Quả cân (#9) — kim loại, móc hình chữ J.** Thân là **kim loại** (vân sáng dọc, đáy tối hơn miệng) thay cho thân nhựa hổ phách có vành đai kiểu hũ, và móc trên nắp là **chữ J** thay cho quai vòng (quai vòng là quai xách của hũ mật).
- **Vòng quanh bầu nhiệt kế (#10) — bầu đục, dây quấn có đuôi.** Bầu là **matte** (bóng loé như kính thì đọc ra là kính lúp), dây là **dải mỏng dẻo** có đoạn hai đầu dán chồng, đuôi mềm cong.
- **Xích hạt (#15, #16) — hạt xen kẽ lớn–nhỏ, xoắn ốc nằm phẳng.** Hạt nhỏ là **mắt nối** giữa hai hạt lớn như xích hạt thật (hạt đều tăm tắp đọc ra là chuỗi bi). Xích cuộn (#15) là **một xoắn ốc nằm phẳng** trên mặt bàn, bán kính thu dần về tâm, đầu ngoài tự do — trước đây nó là một cuộn quanh trục nên nhìn từ trên chỉ là một đường sóng và đọc ra là đống quả.
- **Móc nối (#17) — mắt xích mở, có thanh ngang.** Nay là mắt xích hình **chữ C** (có khe) với một thanh ngang đan chéo như móc nối thật, và **hai sợi hạt xuyên qua lỗ** — một vòng kín đọc ra là nhẫn vàng.
- **Thước gỗ (#11, #12) — số cách vạch, vân đều, có đế.** Thước nằm có vạch centimet và nửa centimet, số to **mỗi 5 cm** nằm cách vạch một khoảng rõ, vân gỗ có mắt và phủ đều, hai đầu vát. Thước đứng có **đế** để đứng vững, số 0 nằm sát đáy.
- **Nhiệt kế (#13) — bầu đỏ, cột xanh, dải số dán sát ống.** Nay có **bầu thủy ngân đỏ** và **cột chất lỏng xanh chạy lên trong ống**; dải thang số **dán sát ống** (đứng rời xa thì nó thành một tấm bảng treo), và ống có lớp **kính mờ**.
- **Lực kế (#14) — móc chữ J, huy hiệu N/kgf, vỏ phẳng.** Móc dưới là **chữ J** rõ ràng (một vòng nhỏ ở đáy đọc ra là đĩa cân của cân bàn), huy hiệu đơn vị in hai thang **`N`** và **`kgf`**, vỏ sau là ống kim loại **phẳng** kiểu lòng so.

## Vòng 9 — dàn lại vế bếp: vòng dây chùng dọn sang cạnh hũ

Câu 6 ("Vậy cao su không phải lúc nào cũng co khi nóng") cần **hai cái dây cao su cùng một khung**: cái quấn nắp hũ (đã siết) và cái vòng chùng (đã dài ra). Trước đây hai vật đứng cách nhau 91 cm, nên một khung phải chứa cả quầy — và trong khung đó **không vật nào đủ lớn để đọc** (máy đo được phần khung mà vật chiếm: 6 %). Sửa ở **bố cục vật**, không sửa ở lời:

- **Vòng dây chùng nằm sát mép hũ** (cách 6 cm), giữa hai cái ghim nhô lên trên mặt dải. Nhờ vậy câu 6 thấy được cả hai vật trong một khung vừa: **hũ ở bên trái, dải dây ở bên phải, luồng hơi nóng ở giữa** (phủ vật 21 % khung, trước là 6 %).
- **Sợi thép và thước dọn sang vế phải quầy**, kèm nhát riêng của nó (c4): đầu tự do của sợi thép nằm ngay trước vạch 20 cm, **trong khung**, để "nó dãn ra" là một chuyển động đọc được.
- **Dải dây chùng nằm trong một nhóm riêng** thay vì đặt thẳng: `setLen(k)` của dải luôn đặt lại trục x của nó về 0 (dải giãn ra quanh giữa), nên đặt thẳng thì vị trí bị ghi đè mỗi khung hình và dải trôi về giữa quầy, lệch khỏi hai ghim.
- **Hai cái ghim của dải chùng nhô lên 8 mm**: đầu đĩa phải thấy trên mặt dải, thì người xem mới đọc ra "hai đầu dây móc qua hai cái ghim".


