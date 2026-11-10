# LOOK — Vì sao ngủ trưa dậy lại mệt?

Khung hình của tập, làm theo `STYLE.md` của kênh. Mọi mốc thời gian lấy từ `voice/proc/dur.json` và
`src/timeline.js` (giọng đã thu, `mk_timeline.py` của kênh sinh ra), không ước lượng.

Nguyên tắc của bản này: **mỗi câu kể một hình**. Một câu = một bố cục riêng (rộng – trung – cận – siêu cận xen
kẽ), máy cắt theo nhịp lời. Không nhát nào kéo dài quá một câu, để không câu nào phải dùng lại hình của câu trước.

## Bố cục thế giới

Ba nơi chốn, mỗi nơi một cách dựng:

| Nơi chốn | Dựng thế nào | Vai trò |
|---|---|---|
| **N1 · phòng ngủ buổi chiều** | một giường, một bàn đầu giường đầy dụng cụ đo, cửa sổ nắng xiên, đồng hồ 24 giờ treo tường | câu hỏi đời thường và những gì đo được (c1–c7, c9, c14–c26, c41–c44, c47–c48, c50, c52) |
| **N2 · khối mô não trên bàn tối** | hai khối mô não **cùng hình** (cùng một hạt giống, `-.95` và `+.95`) để đọc ra là hai bản của cùng một não; nếp cuộn uốn khúc, thở theo sóng chậm; một vệt sáng riêng cho bản bên trái | cách kể quen thuộc và cách kể có căn cứ (c8, c10–c13, c27, c45–c46, c51) |
| **N3 · khe giữa hai tế bào** | một tế bào thần kinh, một hàng thụ thể, khe giữa chúng có đám phân tử trôi vào | thứ vô hình thành vật thật: adenosine và caffeine (c28–c40, c49) |

Vật định vị trong phòng (mọi toạ độ là toạ độ thế giới, `src/set.js`): giường `(-2.30, 0, 1.60)`; bàn đầu giường
`(2.10 × 1.40)` đặt ở `(-0.15, 0, 1.05)`. Mọi đồ trên bàn nằm ở **toạ độ cục bộ của bàn**: **đồng hồ báo thức** ở góc gần giường `(-.80, .50, -.50)`; **máy ghi giấc ngủ** ở cuối bàn `(.70, .50, -.43)`, mặt giấy chạy ra sau về phía tường, trục thời gian chạy dọc theo dải giấy (phút 0 ở đầu xa, phút 45 ở đầu gần cây bút) để đọc được như một cái đồ thị, các số phút in dọc theo mép phải của dải; **hai bảng đo phản xạ** ở giữa bàn — bảng của người uống cà phê `(-.15, .50, .25)` (hàng trước) và bảng của người không uống `(-.15, .50, -.35)` (hàng sau); **hai tách**: tách có cà phê `(.34, .50, .25)` ngay cạnh bảng của người uống, tách **rỗng** `(.76, .50, .46)` ở góc bàn trước — phải thấy rõ tách nào có cà phê, tách nào không, vì câu c41 đang so hai người; một **chiếc đĩa rỗng** `(-.62, .50, .15)` là bằng chứng cho "không có gì ăn"; **đồng hồ 24 giờ** treo tường `(-.28, 1.86, .12)`; **cây góc phòng** ở `(2.75, 0, .40)`.

Ánh sáng N1: một đèn chính ấm xiên qua lỗ cửa sổ (in bóng rõ trên tường và sàn), một vệt sáng nhỏ luôn đặt
đúng chỗ đang kể (`pool`), và ánh sáng môi trường ấm pha tím của buổi chiều. Nhát nào cần xem rõ vật thì đèn
tập trung sáng hơn, nhát toàn cảnh thì để lại.

## 52 nhát: một câu một hình

| # | Câu | Mốc (giây) | Nhìn gì | Lý do của góc máy |
|---|---|---|---|---|
| 1 | c1 | 0.50–2.75 | N1 · fov 52: toàn cảnh phòng buổi chiều: giường đã nằm, bàn đầu giường đầy đồ nghị, cửa sổ nắng xiên — lời: "Buổi chiều, người ta nằm xuống ngủ một chút." | mở đầu đời thường — phải biết ngay đây là buổi chiều và có người vừa ngủ dậy |
| 2 | c2 | 2.95–6.13 | N1 · fov 34: cận đồng hồ báo thức đỏ trên bàn, bàn tay với ra chặn chuông — lời: "Đồng hồ báo thức reo, tay với ra chặn, rồi ngồi dậy." | tay với ra chặn phải thấy được bàn tay, nên máy đứng bên phải nhìn nghiêng qua |
| 3 | c3 | 6.73–8.61 | N1 · fov 32: cận tách cà phê trong tay hạ xuống bàn — lời: "Và đầu thì nặng hơn lúc chưa ngủ." | cái đầu nặng là cảm giác ở tay và ở tách — máy đi theo tay |
| 4 | c4 | 8.80–11.00 | N1 · fov 44: cận cái giường: chăn nhàu, gối lệch — lời: "Nhiều người tưởng ngủ trưa chỉ là nghỉ chút cho mắt." | ngủ một chút phải thấy cái giường đã nằm, không phải một cái giường vuông vắn |
| 5 | c5 | 11.30–13.56 | N1 · fov 36: cận máy ghi giấc ngủ trên bàn, mặt giấy chạy ra — lời: "Nhưng ba mươi phút nằm ngủ là một giấc ngủ thật." | đo được phần bên trong: máy phải là một cái máy có mặt số và hai nút |
| 6 | c6 | 13.76–15.67 | N1 · fov 30: siêu cận mặt máy: đồng hồ nhỏ và hai nút vặn — lời: "Người ta đo được phần bên trong của nó." | người xem phải thấy đây là máy đo, nên đẩy thẳng vào mặt nó |
| 7 | c7 | 16.17–18.68 | N1 · fov 36: nhìn xuống mặt giấy: đường đồ thị, vùng ngủ sóng chậm được tô đậm — lời: "Trong ba mươi phút đó có mười lăm phút ngủ sóng chậm." | mười lăm phút ngủ sóng chậm phải đếm được ngay trên giấy |
| 8 | c8 | 19.08–22.30 | N2 · fov 34: khối mô não trên bàn tối, nếp não phồng lên rồi xẹp dần — lời: "Ngủ sóng chậm dồn lên mạnh ở đầu giấc ngủ, rồi giảm dần." | sóng chậm dồn lên ở đầu rồi giảm: máy phải thấy được hình dạng nếp thay đổi |
| 9 | c9 | 22.70–25.10 | N1 · fov 32: cận đồng hồ báo thức rung trên bàn — lời: "Đồng hồ báo thức reo, cắt ngang giấc ngủ." | chuông cắt ngang giấc ngủ: cùng một vật, nhưng rung |
| 10 | c10 | 25.40–29.13 | N2 · fov 28: dãy đốm sáng bò trên nếp não, bò chậm — lời: "Cách kể quen thuộc là: dậy giữa ngủ sâu, não chưa kịp chạy lại." | não chưa kịp chạy lại thì tín hiệu vẫn bò |
| 11 | c11 | 29.53–30.44 | N2 · fov 22: siêu cận dãy đốm sáng còn đang bò — lời: "Nghe hợp lý." | câu ngắn thì hình cũng ngắn: một cận, không kể lại |
| 12 | c12 | 30.64–34.17 | N2 · fov 34: hai khối mô não cạnh nhau trên bàn tối, cả hai vẻ trong khung — lời: "Nhưng khi người ta gom kết quả nhiều nghiên cứu lại, họ chia làm đôi." | các nghiên cứu chia làm đôi: phải thấy hai bên |
| 13 | c13 | 34.67–37.24 | N2 · fov 36: bản bên trái sáng lên, bản bên phải vẫn tối — lời: "Có bên thấy mối liên hệ đó, có bên không thấy." | có bên thấy, có bên không thấy: đối sáng trong cùng một khung |
| 14 | c14 | 37.64–41.53 | N1 · fov 44: quay lại bàn: thấy cả bảng đo phản xạ — lời: "Nên đừng vội tin chỗ đó. Có một chỗ không ai tranh cãi." | có một chỗ không ai tranh cãi: máy quay lại vật đo |
| 15 | c15 | 42.03–43.19 | N1 · fov 30: đẩy vào bảng đo phản xạ — lời: "Đó là cái đo được." | đó là cái đo được: máy đẩy vào đúng bảng |
| 16 | c16 | 43.39–46.15 | N1 · fov 26: lưới đèn trong bảng tắt dần — lời: "Ngay sau khi dậy, phản xạ của người ta tụt rõ rệt." | phản xạ tụt: đèn tắt dần là cách đo, không phải một câu chữ |
| 17 | c17 | 46.45–48.50 | N1 · fov 24: siêu cận đồng hồ kim chùy xuống — lời: "Tụt tới mức thấp hơn cả lúc chưa ngủ." | tụt tới mức thấp hơn cả lúc chưa ngủ: kim là thứ đọc được |
| 18 | c18 | 48.80–50.50 | N1 · fov 34: cổng gạch đậm ở mốc ba mươi phút trên mặt giấy — lời: "Và ranh giới nằm ở ba mươi phút." | ranh giới ba mươi phút phải là một vạch trên giấy |
| 19 | c19 | 50.70–53.76 | N1 · fov 42: rộng: máy ghi, cổng và cả dải giấy — lời: "Giấc ngủ trưa từ ba mươi phút trở lên thì phản xạ tụt rõ rệt." | cả dòng thời gian phải hiện trong một khung |
| 20 | c20 | 54.26–56.69 | N1 · fov 30: bảng đo với đèn vẫn sáng gần hết — lời: "Dưới ngưỡng đó thì hiệu ứng lờ đờ nhẹ hơn nhiều." | dưới ngưỡng thì hiệu ứng nhẹ hơn: cùng bảng, đèn chưa tắt |
| 21 | c21 | 56.89–58.96 | N1 · fov 32: cận kim đồng hồ báo thức — lời: "May mà cơn lờ đờ đó không kéo dài." | may mà cơn lờ đờ không kéo dài: đồng hồ chạy nửa tiếng |
| 22 | c22 | 59.46–62.17 | N1 · fov 46: cửa sổ sáng hơn, phòng ấm lên — lời: "Nó tự qua trong nửa tiếng, có khi còn không có." | nó tự qua trong nửa tiếng: ánh sáng trong phòng dịch chuyển |
| 23 | c23 | 62.37–63.85 | N1 · fov 24: siêu cận đèn xanh trên bảng đo — lời: "Chỉ có một điều lừa người ta." | chỉ có một điều lừa người ta: đèn xanh là thứ báo cảm nhận |
| 24 | c24 | 64.05–67.07 | N1 · fov 28: bàn tay bấm nút đỏ trên bảng đo — lời: "Sau khi ngủ, ai cũng tự đánh giá là mình làm tốt hơn." | tự đánh giá là mình làm tốt hơn: phải thấy ngón tay bấm nút |
| 25 | c25 | 67.47–69.13 | N1 · fov 26: siêu cận kim vẫn chùy xuống — lời: "Còn phép đo thì nói ngược lại." | phép đo nói ngược lại: cùng cái kim, không đổi hướng |
| 26 | c26 | 69.73–72.48 | N1 · fov 30: đèn xanh sáng và kim chùy cùng một khung — lời: "Nên cảm giác sau một giấc ngủ trưa không phải là bằng chứng." | cảm giác không phải là bằng chứng: hai chiều ngược nhau phải cùng khung |
| 27 | c27 | 72.88–75.10 | N2 · fov 32: máy đẩy vào trong khối mô não — lời: "Vậy lúc dậy, bên trong não đang có gì?" | lúc dậy, bên trong não có gì: máy đi vào |
| 28 | c28 | 75.70–76.72 | N3 · fov 46: khe giữa hai tế bào, có chiều sâu — lời: "Mình đi vào xem." | mình đi vào xem: mở màn bằng một không gian có chiều sâu |
| 29 | c29 | 76.92–79.19 | N3 · fov 38: đám phân tử trong khe — lời: "Trong não có một thứ tích lại suốt lúc bạn thức." | trong não có một thứ tích lại: đám là thứ |
| 30 | c30 | 79.59–81.13 | N3 · fov 26: siêu cận một phân tử adenosine — lời: "Tên của nó là adenosine." | tên của nó: hình phải đủ gần để thấy cấu trúc phân tử |
| 31 | c31 | 81.33–84.98 | N3 · fov 42: đám phân tử đông dần lên — lời: "Người ta gọi nó là áp lực ngủ: bạn thức bao lâu, nó càng nhiều." | thức bao lâu thì nó càng nhiều: đám phải dày lên ngay trong khung |
| 32 | c32 | 85.28–87.00 | N3 · fov 30: một phân tử rời đám, bay về phía thụ thể — lời: "Nó không bay lơ lửng vô nghĩa." | nó không bay lơ lửng vô nghĩa: phải thấy nó đi |
| 33 | c33 | 87.60–91.64 | N3 · fov 32: phân tử bám vào túi của thụ thể, miệng túi mở ra khe — lời: "Nó bám vào một khía trên thụ thể, và khía đó báo cho não biết buồn ngủ." | bám vào một khía: cận vào đúng chỗ bám |
| 34 | c34 | 91.94–95.25 | N3 · fov 46: rộng: khe chật ních phân tử — lời: "Lúc bạn dậy, lượng adenosine vừa tích lại được là nhiều nhất." | lúc dậy lượng tích lại được là nhiều nhất: toàn cảnh khe |
| 35 | c35 | 95.55–98.58 | N3 · fov 32: cận sợi trục có dãy đốm sáng yếu — lời: "Có lý thuyết rằng chính lượng đó làm não chậm lúc bạn vừa mở mắt." | có lý thuyết: dấu hiệu phải yếu, không sáng trưng |
| 36 | c36 | 99.08–100.76 | N3 · fov 24: siêu cận sợi trục — lời: "Lý thuyết thôi, chưa ai chắc." | lý thuyết thôi, chưa ai chắc: hình cũng phải e dè |
| 37 | c37 | 100.96–102.79 | N3 · fov 28: một phân tử mới xuất hiện trong khe — lời: "Còn cà phê thì làm một việc rất khôn." | cà phê làm một việc rất khôn: vật mới phải nổi bật |
| 38 | c38 | 103.09–104.56 | N3 · fov 38: khe vẫn đầy adenosine — lời: "Nó không xoá adenosine." | nó không xoá adenosine: đám vẫn còn nguyên |
| 39 | c39 | 104.76–108.58 | N3 · fov 34: phân tử mới bay thẳng vào túi, adenosine vẫn còn trong túi — lời: "Nó là chất chặn thụ thể, nên nó chen vào đúng chỗ adenosine muốn bám." | nó chen vào đúng chỗ adenosine muốn bám: phải thấy nó chen |
| 40 | c40 | 108.88–111.97 | N3 · fov 34: adenosine bị đẩy ra khỏi túi, trôi ra khe — lời: "Adenosine không còn chỗ bám, thì cơn lờ đờ cũng tan." | adenosine không còn chỗ bám: khía phải trống |
| 41 | c41 | 112.57–116.05 | N1 · fov 46: hai tách, hai bảng đo trên bàn, kim chạy ngược chiều — lời: "Trong một thí nghiệm, người được uống cà phê không bị tụt phản xạ lúc dậy." | một thí nghiệm: hai bảng phải cùng một khung |
| 42 | c42 | 116.35–120.25 | N1 · fov 40: đồng hồ 24 giờ trên tường, dải buổi chiều — lời: "Còn một lý do nữa, và nó giải thích vì sao chuyện này hay xảy ra đúng buổi chiều." | còn một lý do nữa: máy nhìn lên chiếc đồng hồ treo tường |
| 43 | c43 | 120.45–122.82 | N1 · fov 34: cận kim đen của đồng hồ 24 giờ chỉ buổi chiều — lời: "Buổi chiều là lúc tỉnh táo tụt sẵn theo nhịp ngày." | buổi chiều là lúc tỉnh táo tụt: kim là thứ đọc được |
| 44 | c44 | 123.42–125.79 | N1 · fov 34: góc bàn trống, không có gì để ăn — lời: "Bạn có ăn hay không ăn thì chỗ đó vẫn xuống." | ăn hay không thì chỗ đó vẫn xuống: góc trống là bằng chứng |
| 45 | c45 | 126.19–128.53 | N2 · fov 44: khối mô não, nếp chỉ thở nhẹ — lời: "Vậy muốn dậy mà không bị lờ đờ thì làm gì?" | muốn dậy mà không bị lờ đờ thì làm gì: hình phải bình thản |
| 46 | c46 | 128.83–130.24 | N2 · fov 30: cận nếp não không sâu xuống — lời: "Đừng để mình rơi quá sâu." | đừng rơi quá sâu: nếp phẳng, không phồng |
| 47 | c47 | 130.54–133.96 | N1 · fov 34: mặt giấy dừng ở hai mươi phút — lời: "Giữ giấc trưa ở mức ngủ nông, khoảng hai mươi phút, là đủ." | giữ giấc trưa ở mức ngủ nông: dòng đồ thị dừng sớm |
| 48 | c48 | 134.26–138.22 | N1 · fov 28: bảng đo với đèn vẫn sáng gần hết — lời: "Một thí nghiệm đo được: giấc ngủ trưa hai mươi phút buổi chiều kết ở giấc ngủ nhẹ." | hai mươi phút kết ở giấc ngủ nhẹ: cùng bảng, đèn chưa tắt |
| 49 | c49 | 138.92–142.96 | N3 · fov 34: phân tử caffeine nằm chặn trong túi, adenosine đã bị đẩy ra — lời: "Hoặc uống cà phê ngay trước khi nằm, để cà phê bắt đầu tác dụng đúng lúc bạn mở mắt." | uống cà phê ngay trước khi nằm: phân tử mới nằm chặn đúng chỗ |
| 50 | c50 | 143.26–144.22 | N1 · fov 32: bàn tay đặt xuống bàn, tách cà phê bên cạnh — lời: "Bạn không hỏng." | bạn không hỏng: hình phải nhẹ, tay đặt xuống |
| 51 | c51 | 144.52–146.68 | N2 · fov 34: dãy đốm sáng trên nếp não vẫn đang bò — lời: "Bạn chỉ dậy đúng lúc não còn chưa chạy được." | bạn chỉ dậy đúng lúc não còn chưa chạy được: tín hiệu còn bò |
| 52 | c52 | 147.48–149.99 | N1 · fov 50: toàn cảnh buổi chiều sáng hơn — lời: "Và cơn lờ đờ đó cũng tự qua trong nửa tiếng." | cơn lờ đờ tự qua: quay lại đúng toàn cảnh như câu mở đầu |

## Vòng 1

- **Thấy:** dựng đủ 52 khung hình chính vào `review/hero/` và đọc từng tờ sheet, thấy những điều sai dưới đây.
- **Sửa:** sửa hết những mục này ở vòng 2.

Dựng đủ 52 khung hình chính vào `review/hero/` và đọc từng tờ sheet. Những gì nhìn ra sai:

- **N2 (khối mô não) quá tối.** Cả cục não và cả bàn đều chìm trong nền tím sẫm; máy đo đánh dấu `DARK` ở 9 câu.
  Nguyên nhân: bộ đèn của `rig/brain.js` quá yếu cho một đạo cụ diorama thật.
- **Khối mô não đọc ra như vỏ trứng vỡ.** Mặt cắt phẳng hồng nằm ngay trước, còn một lớp vỏ trong mờ
  nghiêng sau; nếp não không có, chỉ thấy đường cong.
- **C12/C13 không tách được hai bên.** Hai khối não nằm cạnh nhau nhưng sáng như nhau, nên câu "có bên thấy,
  có bên không thấy" không có hình nào đỡ.
- **N3 (khe giữa hai tế bào) là một màu tím trống.** Ở c35, c36 máy nằm ngay trong ống sợi trục nên không
  thấy gì; c32 thì phân tử bay ở đúng mặt phẳng máy nên biến mất.
- **Hàng thụ thể đứng riêng là một tấm phẳng trắng**, và củ tế bào quay mặt phẳng về lưng.

## Vòng 2

- **Thấy:** sau vòng 1, những mục sai còn lại là mô não đọc như vỏ trứng vỡ, hai khối não không tách được bên thấy–không thấy, và mấy nhát N3 đứng sai chỗ.
- **Sửa:** dựng lại khối mô não, sáng riêng vùng N2–N3, tách hai bên bằng ánh sáng, và lùi máy ra khỏi vật ở những nhát bị bỏ trong vật.

Sửa những mục trên rồi dựng lại 52 khung:

- **Khối mô não vẽ lại từ đầu** (`src/props/khoi-mo-nao.js`): một khối mô kín, nếp cuộn sinh từ nhiễu giá trị ba
  chiều (`fbm`) thay cho sóng cực, đáy phẳng để đặt lên bàn. Bỏ mặt cắt và tấm đáy. `wave()` giờ đọc đúng
  hoành độ UV như `surface()`, và tính lại normal sau mỗi lần sóng.
- **Sáng N2 và N3 ngay trong tập** (`src/set.js`): đèn chính ấm hơn, ánh sáng môi trường tím xanh, đèn viền
  tím sáng. Không sửa `rig/` — đó là chung của kênh.
- **C13 tách hai bên bằng ánh sáng**: cả cảnh hạ xuống còn 42 % (`DIM.c13`), vệt sáng đọa trên bản bên trái
  giữ nguyên độ sáng của nó, bản bên phải chìm hẳn xuống.
- **Góc máy của các nhát bị bỏ trong vật** (c32, c35, c36, c44) lùi lại và nâng lên, để vật luôn nằm trong
  khung thay vì máy nằm trong vật.
- **Sửa hướng của hai vật**: hàng thụ thể quay mặt có khía về phía khe, củ tế bào quay mặt túi chứa chất về
  phía người xem, và bộ khối tế bào phía sau màng quay lại đúng hướng.

Còn lại để vòng chấm của người khác nhìn: liệu nhịp rộng–trung–cận–siêu cận có đều không, và có nhát nào
máy còn vô lý.

## Vòng 3

- **Thấy:** vòng chấm đầu bảo lỗi ở tám tờ hình: mặt giấy đồ thị lộn ngược, hàng thụ thể như một mảng tím trơn, thẻ "CAFFEINE" thiếu, đồng hồ 24 giờ là một đĩa tím trơn, hai khối não sáng y nhau, chân bàn cắm qua miệng tách, tờ giấy nhỏ ở rìa khung, và tấm bìa navy ở tiền cảnh là một mảng phẳng.
- **Sửa:** sửa từng tờ theo danh sách dưới đây.

Vòng chấm đầu bảo lỗi ở tám tờ hình. Sửa theo từng tờ:

- **Mặt giấy đồ thị bị lộn ngược** (`may-ghi-giac-ngu.js`): dải giấy nằm ngang, mặt có dấu hướng lên,
  mà máy quay luôn đứng bên phải — nên `uv.y` phải đảo, không thì chữ trên giấy hiện ngược. Đổi `uv` thành
  `[1,1, 1,0, 0,0, 0,1]`. Đồng thời: số trục phút to lên (34 px → 58 px), và chữ trên giấy đổi sang thuật
  ngữ đúng ("GIAI ĐOẠN NGỦ", "TRƯỚC KHI NGỦ", "SAU KHI NGỦ") thay cho "CHƯA NGỦ / DẬY LÊN".
- **Hàng thụ thể như một mảng tím trơn** (`hang-thu-the.js`): màng và khối tế bào có texture màng (sợi, lỗ
  chân tay); túi của thụ thể có miệng và đáy tối thật, không phải khe hình chữ nhật.
- **C49 không có thẻ nào nói đây là caffeine** (`src/film.js`): thêm thẻ "CAFFEINE" bám vào phân tử
  đang nằm trong túi.
- **Đồng hồ 24 giờ là một đĩa tím trơn, không đổ bóng** (`set.js`): thêm một đèn ấm riêng cho đồng hồ,
  đẩy đồng hồ ra khỏi tường một chút cho nó đổ bóng, đổi mặt đồng hồ về kem/navy.
- **C12/C13: hai khối não như đá, sáng như nhau**: máy nâng lên nhìn từ trên xuống, đèn vệt sáng bên trái
  mạnh lên (4,2 → 7,0) để một bên thấy rõ và một bên chìm hẳn; khối não có thêm tiểu não và thân não
  để đọc ra là não, mạng lưới gia tăng từ 88×56 lên 104×68 cho bớt mặt phẳng.
- **C50: chân bàn cắm qua miệng tách cà phê** (`set.js`): dời hai tách ra xa khỏi mép bàn, và đổi góc máy
  của c50 để tách là chủ thể.
- **C47: tờ giấy thu nhỏ ở rìa khung**: đưa máy sát tờ giấy (tiêu cự 30) để tờ chiếm gần hết khung.
- **Tấm bìa navy ở tiền cảnh là một mảng phẳng** (`bang-do-phan-xa.js`): mặt đế dưới của bảng đo đổi sang
  gỗ sẫm có vân.

## Vòng 4

- **Thấy:** máy đo báo 12 câu có vấn đề: nếp não đọc ra như vân gỗ, hai bản não sáng y nhau, một câu gần như trống, ba câu giống nhau, hàng thụ thể đọc ra như hàng viên thuốc trên bàn phím, và mặt bảng đo phản xạ là một tấm phẳng.
- **Sửa:** dựng lại nếp não, tách hai bản não bằng ánh sáng, đổi góc máy của các câu giống nhau, và dựng lại hàng thụ thể thành túi protein có miệng thật.

Máy đo báo 12 câu có vấn đề (độ phủ thấp, hai câu gần giống nhau, hai câu tối). Sửa theo từng nhóm:

- **Nếp não đọc ra như vân gỗ** (`khoi-mo-nao.js`): nếp cũ là `sin(sz·20)` — những đường thẳng song song,
  đúng như vân gỗ. Đổi sang nhiễu sần (`ridged`) làm nền, rãnh nằm ở vùng thấp của nhiễu, cộng một lớp
  nếp nhỏ chạy ngang để phá vỡ đều đặn. Da não sáng lên (`#eeb3a6` → `#f7cdbd`), thân não và tiểu não
  rút ngắn lại để không ló ra dưới bàn như một cục sáng lạ.
- **C13 hai bản não sáng y nhau** (`set.js` + `film.js`): thêm `darkRight(k)` — bản bên phải bị làm tối thật
  (màu vật liệu × 0,32) trong lúc câu đang nói về "bên thấy / bên không thấy"; đèn vệt sáng bên trái mạnh
  lên (7,0 → 20,0) và hẹp lại để đúng một bản sáng.
- **C35 gần như trống** (`film.js`): máy lùi ra, đưa cả tế bào thần kinh (thân + sợi trục + củ tế bào)
  vào khung thay vì chỉ một đoạn sợi trục.
- **C29 / C38 / C40 giống nhau** (`film.js`): đổi góc máy — c29 chếch từ dưới bên trái, c38 chếch từ
  sau bên trái, c40 từ bên phải.
- **Hàng thụ thể đọc ra như hàng viên thuốc trên bàn phím** (`hang-thu-the.js`) — đây là lỗi lớn nhất:
  mỗi thụ thể là một hộp có chân, mọc ra từ một tấm màng phẳng. Dựng lại từ đầu:
  - Màng không còn là tấm hộp: một mặt cong lượn sóng có biên méo (`surface`), đằng sau là một khối tế
    bào to và tối.
  - Thụ thể là một **túi protein có miệng quay về phía khe** — một "chén" lumpy (`bowl`) với lòng túi tối
    bên trong; cỡ, nghiêng và màu mỗi cái khác nhau (một cái vàng, một cái cam) để không thành hàng đều
    tăm tắp.
  - Cỡ thụ thể hạ xuống (0,44 → 0,32) cho phân tử adenosine vừa khít miệng túi, và khoảng cách giữa
    các thụ thể 0,52 → 0,46.
  - Thẻ "THỤ THỂ" không chỉ vào phân tử đang nằm trong túi nữa, mà chỉ vào vành miệng của một thụ thể
    trống bên cạnh (`KHE.rim1`).

## Vòng 5

- **Thấy:** vòng chấm bốn bảo lỗi ở chín tờ hình. Nghiêm trọng nhất là khối mô não: mép nó ở góc nhìn
  nghiêng thành một **dải răng cưa** (tia nhỏ chĩa ra, đọc như lỗi render, không phải não); nếp cuộn chạy
  song song như lát thịt ở một bên và xoắn vỏ ốc ở bên kia, nên hai khối không thể là hai bên của cùng
  một não; và khối não bị cắt cụt ở mép khung. Ngoài ra: câu 47 (mặt giấy đồ thị) đặt tờ giấy sát
  rìa phải với 45 % bên trái là mặt bàn trống, thẻ "HAI MƯỜI PHÚT" che mất số 30; câu 49 (thụ thể)
  không có viền mực nào trên vành túi và nửa phải khung trống trơn; và một số câu có nét mực rời rạc.
- **Sửa:** dựng lại nếp cuộn theo cách mới, bỏ vỏ viền dựng sẵn, tô viền mực ngay trong vật liệu,
  kéo hai khối não sát nhau và hạ máy, đặt lại góc máy của câu 47, thêm viền mực cho thụ thể, và dựng
  lại 52 khung hình.

- **Nếp cuộn viết lại từ đầu** (`khoi-mo-nao.js`): bản cũ lấy đường đồng mức của một trường pha bị xoáy.
  Cách ấy uốn khúc đẹp, nhưng ở chỗ trường bị bẻ gấp thì đường đồng mức dồn cục lại thành những nếp
  nhỏ hơn cả mắt lưới của lưới hình — đó là lý do mép não ở góc nhìn nghiêng thành dải răng cưa, và
  vì sao có chỗ nếp chạy song song như lát thịt, có chỗ lại xoắn như vỏ ốc. Nay nếp cuộn là **tổng của
  năm sóng thẳng nghiêng theo năm hướng**: tổng của chúng vẫn uốn khúc quanh co, mà độ dốc của tổng
  thì bị chặn trên, nên không chỗ nào nếp nhỏ lại thành răng cưa. Biên độ cũng nhỏ dần khi bề mặt quay
  ngang và ở hai đỉnh não. Rãnh trên da vẫn tô sẵn tối đúng chỗ rãnh lõm (cùng một hàm `gyri` quyết
  định cả hình lẫn màu), nhưng tô vừa đủ: tô đậm quá thì ở góc nhìn nghiêng mỗi vệt rãnh bị nén lại
  thành một mảnh nhọn.
- **Bỏ vỏ viền dựng sẵn của não**: vỏ ngoài (cùng hình, nhô ra, chỉ vẽ mặt trong) không bám được
  đường viền thật của một bề mặt có nếp — mép vỏ nhô ra thành dải răng cưa. Nay viền mực được tô
  trong chính vật liệu não, theo góc nhìn (`inkRim` trong `src/props/_ink-rim.js`): càng vuông góc với
  mắt càng tối, nên dải tối bám đúng đường viền thật, mềm, và không thành răng cưa. Cùng cách đó dùng
  cho vỏ túi và vành miệng của thụ thể (câu 49), nơi trước đó không có viền mực nào.
- **Hai khối não sát nhau và máy hạ xuống** (`set.js` + `film.js`): hai bản vẫn cùng hình (cùng seed 3)
  để đọc ra là hai bản của cùng một não, nhưng kéo vào `±.80` và hạ máy của câu 12 xuống, nên chúng
  chiếm giữa khung thay vì dồn sát đáy.
- **Câu 47 (mặt giấy đồ thị)** (`film.js`): máy đổi từ cạnh bàn sang nhìn dọc theo dải giấy (fov 30,
  cao hơn, gần hơn). Nay tờ giấy chạy chéo qua khung, các mốc 10–20–30–40 đọc rõ, mốc 20 tô đỏ
  đúng chỗ, và thẻ "HAI MƯỜI PHÚT" chỉ thẳng vào mốc 20 mà không che số 30 nữa.
- **Câu 49 (thụ thể)** (`film.js`): máy dịch sang trái một chút cho dàn thụ thể chiếm giữa khung.

## Vòng 6

- **Thấy:** lỗi còn lại không nằm ở vật nữa mà ở **chữ trên màn hình**. Thẻ "HAI BÊN CỦA NÃO"
  (câu 12) nói một đằng, hình lại là **hai bản não đặt cạnh nhau** (một bản sáng, một bản tối) —
  người xem tưởng thấy hai bên của một não thì đã hiểu sai cả câu. Thẻ "NGỦ NHẸ · HAI MƯỚI PHÚT"
  (câu 48) lại trỏ vào đèn của bảng đo phản xạ, trong khi câu đó nói về **một thí nghiệm**; và thẻ
  "CÀ PHÊ" (câu 37) trỏ vào phân tử caffeine đang bay vào khía, không phải tách cà phê. Thêm hai
  lỗi cơ học: mũi tên thẻ "CAFFEINE" ở câu 37 **chạm vào khoảng trống** giữa các nguyên tử
  (người xem thấy một ngón tay chỉ vào chỗ trơn), và câu 13 cắt cụt khối não sáng ở đáy khung,
  phụ đề chạy ngang qua mép dưới của não.
- **Sửa:** mọi thẻ nay nói đúng cái nó chỉ, và **mọi thẻ đều mang mã neo** (`anchor:`) — tên vật
  trong danh mục — nên máy kiểm được: thẻ nào trỏ nhầm vật, thẻ nào đọc ra mơ hồ, máy báo.

- **Thẻ nói đúng cái nó chỉ** (`film.js`):
  - câu 12: "HAI BÊN CỦA NÃO" → **"HAI BÊN"** (khớp với hai thẻ kế "BÊN THẤY" / "BÊN KHÔNG
    THẤY"; hình là hai bản não, không phải hai bên của một não).
  - câu 8: "NGỦ SÓNG CHẬM" → **"SÓNG CHẬM"** (chữ "ngủ" trùng với vật "máy ghi giấc ngủ").
  - câu 37: "CÀ PHÊ" → **"CAFFEINE"**, neo vào vật "phân tử caffeine" (người xem thấy đúng phân
    tử đang bay vào khía).
  - câu 41: "CÓ CÀ PHÊ" → **"CÀ PHÊ TRONG TÁCH"** (chữ "cà phê" trùng với cả "phân tử cà phê").
  - câu 48: "NGỦ NHẸ · HAI MƯỚI PHÚT" → **"PHẢN XẠ TỐT"** (đèn trên bảng đo đo phản xạ).
  - câu 44: "KHÔNG ĂN" neo vào vật **đĩa rỗng** — vật mới, tách riêng ra để có mã neo thật.
  - câu 42: "BUỔI CHIỀU" neo vào đồng hồ 24 giờ; vật "chiếc giường buổi trưa" đổi tên thành
    **"chiếc giường nghỉ trưa"** để chữ "buổi" không trỏ nhầm sang vật giường.
- **Mũi tên chạm đúng vật** (`film.js`): thẻ "CAFFEINE" ở câu 37 nay bám vào **tâm phân tử**
  (trước nó bám vào điểm nằm lơ lửng .05 cao hơn phân tử, giữa hai nguyên tử). Máy đo bằng tia
  chiếu qua đúng đầu mũi tên: trước đó đầu mũi tên rơi vào khoảng trống, không chạm vật nào.
- **Câu 13 dựng lại khung** (`film.js`): máy lùi ra và cao hơn (fov 32, `[-1.75, 1.15, 2.75]`).
  Nay **cả hai bản não nằm trọn trong khung**, phụ đề rơi xuống mảng bàn trống dưới não (trước nó
  cắt ngang mép dưới khối não sáng), và dải tường tối ở trên không còn nuốt mất nửa khung.

