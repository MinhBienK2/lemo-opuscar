VERDICT: REJECT
ROUND: 3/5
SCORES: BỐ_CỤC=2 ÁNH_SÁNG=3 GÓC_MÁY=2

Nội dung soi: 3 khung hero + tờ nhịp 60 khung (`/tmp/bfull7/b_001…b_060.jpg`, mỗi câu một khung lấy đúng mốc trong `voice/proc/dur.json`) + 10 khung chụp lại bằng `core/render/still.mjs` ở các mốc giữa câu (t = 8.0, 70.0, 79.5, 87.0, 88.0, 89.0, 96.5, 114.0, 127.6, 139.0, 141.8) để kiểm tra máy có di chuyển trong câu hay không. Đối chiếu `LOOK.md`, `TREATMENT.md`, `research/FACTS.md`, `voice/lines.json`.

Điểm trung bình = (2 + 3 + 2) / 3 = **2.33** < 4.0. Ngoài ra còn vi phạm điều kiện PASS: **có những câu mà vật chính không có mặt trong khung** (c23, c30, c33, c42, c45, c59) — không phải "che khuất" mà là "không có".

**Điển tích không đạt, nêu thẳng (đã soi ở độ phân giải gốc):**

| Câu | Lời | Khung thật | Vấn đề |
|---|---|---|---|
| c23 | "Chỗ trống đó, hơi nước mới đi được" | `b_023`, `t_70.0` | Khung là **trần nhà và tường trần** của phòng. Không áo, không hơi nước, không khoảng không nào. Máy trong cả câu không đổi. |
| c30 | "Gió chở hơi nước đi" | `b_030`, `t_89.0` | Khung là **góc phòng trống** (cửa sổ, mặt bàn, mép vải). Không hạt hơi nước nào. |
| c33 | "Đo được: hai cái cân, một áo trước quạt, một ở góc xa" | `b_033`, `t_96.5` | Chỉ **một cái cân ở góc dưới phải**, 85 % khung là tường trống; đồng hồ treo tường bị **cắt ở mép trên phải**; không có áo, không có quạt. |
| c45 | "Ba mươi độ thì hơi nước lan xa hơn, đặc hơn" | `b_045`, `t_127.6` | Cột thuỷ ngữ đứng ở **~25 °C**, không phải 30. `LOOK.md` mục "Số trên hình" khẳng định "cột đứng đúng vạch 30" — hình không có vậy. |
| c28 | "Gió làm đường đi của hơi nước ngắn lại" | `b_028` | Khung là **cánh quạt chiếm trọn khung**, một hình hoạ hình toả số cân. Không gió, không vải, không đường đi. |
| c40 | "Ba cái áo phơi chồng lên nhau trên dây thứ hai" | `b_040`, `t_114.0` | **Góc nhìn từ trên xuống thẳng đuột**, ba mảng vải phẳng chồng nhau như bản vẽ kỹ thuật. Không đếm được ba cái. |
| c26 | "Từ đó, nước bay hơi chậm lại" | `b_026`, `t_79.5` | Cũng là **góc từ trần nhìn xuống**, y hệt c40 → trùng hình + vi phạm tiêu chí 2. |
| c48 | "Chồng áo lên nhau, hay phơi một mặt…" | `b_048`, `t_139.0` | Khung **lật ngược 180°** (bàn treo ngược, chân ghế chổng lên). Không đọc được vệt ẩm nửa khô. |
| c49 | "Cái áo úp giữ ẩm lâu hơn cái phơi rộng" | `b_049`, `t_141.8` | Nhìn **từ trên xuống xiên** vào ghế; "áo úp" và "áo phơi rộng" không tách ra được, camera lăn nghiêng. |
| c2 | "Nó còn ở trên vải" | `b_002` | Cả khung là một mảng vải phẳng, mảng ẩm là **tam giác cạnh sắc ở góc dưới phải, bị cắt**. Không có tiêu điểm. |
| c56 | "Vậy quần áo khô không phải vì gió sấy nó" | `b_056` | Áo **cháy trắng** giữa khung, mất hết chi tiết vải. |

**Lỗi trùng hình (vi phạm nguyên tắc "mỗi câu một hình"):** c41 ↔ c46 (cùng siêu cận mặt ẩm kế, cùng vị trí kim), c38 ↔ c45 (cùng bức tường hai đồ đo, một cái nhỏ xíu), c43 ↔ c58 (cùng toàn cảnh hiên, cùng khối trời tối ở mép phải), c8 ↔ c10 (cùng một tấm sợi đan dạng ô vuông bay lơ lửng trên nền tím, có que gỗ cắt ngang), c26 ↔ c40 ↔ c48 ↔ c49 (bốn nhát liên tiếp dùng góc từ trên xuống).

## NHẬN XÉT CHI TIẾT THEO CẢNH

### Ba khung hero

- [Hero 1 · c1 · t=4.5 · "Quần áo ướt treo trên dây, nước vẫn còn đó"]:
  - Bố cục: Đạt
  - Điểm yếu: Vùng sáng nhất là **tường giấy dán bên trái**, cái áo là một mảng xám trung tính nên mắt không dừng lại. **Bồn chậu không có trong khung** dù `LOOK.md` dặn "bồn chậu ngay dưới" — chỉ thấy một mảnh sáng nhỏ ở góc dưới trái. Mảng ẩm trên áo là **vệt xanh-xám có cạnh sắc như mảnh bìa dán**, không đọc ra là ướt; không có vệt nước chảy dọc. Khung nghiêng nhẹ (sàn gạch chạy chéo). Quần navy ở mép phải chiếm ~25 %.
  - Khuyến nghị quay: hạ camera xuống tầm áo, fov 34–36, đưa **bồn chậu vào trọn khung ngay dưới mép áo**; đèn tập trung vào mảng ẩm để nó thành vùng sáng nhất; bo tròn mép vệt ẩm, thêm bóng ướt và vệt nước chảy; bỏ roll; dọn mép phải.

- [Hero 2 · c11 · t=37 · "Nước nằm ở khe giữa các sợi"]:
  - Bố cục: Chưa đạt
  - Điểm yếu: **"Mảng nước mỏng trong khe" đọc thành một dải thuỷ tinh dọc đứng chạy xuyên khung**, không nằm giữa hai sợi — người xem tắt tiếng sẽ tưởng có tấm kính. Các giọt là **bầu dục phẳng đang bay trước mặt**, không bám sợi. Toàn khung chỉ có một lưới phẳng: **mất hoàn toàn liên tục không gian với câu c10** (tiêu chí 3), không có lớp sợi mờ ở hậu cảnh, không có manh mối nào cho biết đây là ruột của cái áo.
  - Khuyến nghị quay: dựng **hai sợi to ở tiền cảnh** làm khung, mảng nước là vệt alpha mỏng **nằm giữa và bám hai mép sợi** (có viền sáng, xuyên sáng), giọt treo đúng đường sợi với meniscus; thêm sợi chéo mờ ở hậu cảnh để có 3 lớp và giữ liên hệ với c10.

- [Hero 3 · c36 · t=103 · "Hai giọt nước, một bên có gió, một bên không"]:
  - Bố cục: Chưa đạt
  - Điểm yếu: **55 % khung là tường nâu trống**; đôi kính và hai giọt dồn ở 1/3 dưới. **Vách ngăn là một thanh xám dọc, đọc như cây cọc** chứ không phải tấm ngăn. **Hai mặt kính trông như hai đĩa nằm ngang**, không phải hai mặt kính đứng. **Quạt bị cắt ở mép phải.** Hạt khí có ở mặt gió nhưng không thành luồng có hướng, nên "một bên có gió" chỉ đọc được nhờ vị trí quạt chứ không nhờ chính hình. Điểm sáng đúng: **giọt ở mặt có gió nhỏ hơn giọt ở mặt không gió** — đúng cơ chế `FACTS.md` §4.
  - Khuyến nghị quay: hạ camera xuống tầm mặt kính, fov 32; **vách ngăn thành tấm có dày, viền, chiếu bóng lên kính**; hai mặt kính đứng vuông, cho phản chiếu; quạt vào trọn khung bên phải; hạt khí thành vệt đi từ miệng quạt qua mặt kính; dùng khoảng trống tường phía trên làm chỗ đặt thẻ chú thích.

### 60 nhát, c1 → c60

- [c1 · 2.40–6.07]: Đạt — xem Hero 1. Thiếu bồn chậu, mảng ẩm viền sắc.
- [c2 · 6.27–9.42]: **Chưa đạt** — khung toàn mảng vải phẳng không sợi rõ; mảng ẩm là tam giác cạnh sắc ở góc dưới phải, **bị cắt khỏi khung**. Không có tiêu điểm, không có chiều sâu. Khuyến nghị: đưa mảng ẩm vào giữa khung, camera lùi/thu góc hơn để thấy sợi và mép áo, thêm lớp sợi mờ ở hậu cảnh.
- [c3 · 9.87–13.90]: Đạt — quạt, bàn cân, đồng hồ đủ để "làm thí nghiệm nhỏ" đọc được; nhưng **đồng hồ treo tường bị cắt ở góc trên phải** (sửa vòng 2 chưa hiệu quả vì khung này rộng). Khuyến nghị: lùi camera thêm, đưa đồng hồ vào trọn khung hoặc dời tường.
- [c4 · 14.10–17.10]: **Chưa đạt** — "hai cái áo giống nhau treo cạnh nhau" không đọc được: hai mảng xám ở tiền cảnh **bị cắt ở mép khung**, còn **hai cái cân (đạo cụ của c33) chiếm giữa khung** và chiếm sự chú ý. Người xem tưởng đang xem cân. Khuyến nghị: đưa cân ra khỏi khung, hai áo vào trọn khung sát nhau (khe ≤ 5 cm), cùng tông, chiếm ~50 % khung.
- [c5 · 17.30–20.47]: Đạt — có vũng sáng nhỏ ở góc xa, chủ thể ở giữa, đọc được "một cái ở góc xa". Nhưng **áo ở góc xa quá nhỏ, không đọc là áo**, và có một vệt sáng trắng loang ở sàn góc phải trông như lỗi ánh sáng. Khuyến nghị: nâng cường độ vũng sáng ở góc xa, dọn vệt sáng trên sàn.
- [c6 · 20.67–24.20]: **Chưa đạt** — LOOK vòng 1 đòi "đẩy thẳng vào miệng quạt", nhưng khung vẫn là **quạt toàn cảnh 3/4 từ bên cạnh, cả đế quạt lẫn bàn cân cùng vào khung**; người xem không thấy luồng gió ra khỏi lồng quạt. 45 % khung là tường trống. Khuyến nghị: fov 28–30, camera nằm **trên trục luồng gió cách lồng 25–35 cm**, nhìn thẳng ra hướng thổi; đẩy bàn cân ra khỏi khung; thêm bóng quạt lên tường.
- [c7 · 24.40–27.39]: **Chưa đạt** — cả hai áo đều **sáng và phẳng như nhau**, nên mệnh đề "cái trước quạt đang nhạt màu dần, cái kia vẫn sẫm" **không đọc được**; đây là câu so sánh mà hình lại làm mất. Nền cửa sổ sáng đè lên hai áo. Khuyến nghị: dùng chính độ tương phản vải (áo A nhạt, áo B sẫm hơn rõ) + hạ sáng cửa sổ, đặt đèn vào áo B.
- [c8 · 27.84–29.03]: **Chưa đạt** — khung là **một tấm sợi đan hình ô vuông nhỏ bay lơ lửng trên nền tím**, có que gỗ cắt ngang; đọc như biểu đồ, không phải "nước còn nằm đó" bên trong áo. Không có giọt, không có mảng ẩm. Khuyến nghị: máy đẩy vào một mảng vải có thật (cổ áo / mép áo) với sợi to ở tiền cảnh, giọt nước và mảng ẩm chiếm tâm khung.
- [c9 · 29.23–31.72]: **Chưa đạt** — **cả khung bị hơi mờ phủ**, tương phản thấp; giọt nước ở mép phải nhỏ và lờ nhờ, chủ thể không đọc được. Khuyến nghị: giảm độ mờ của lớp hơi, tăng tương phản giọt (highlight + nước trong), đưa giọt vào 1/3.
- [c10 · 32.17–35.14]: **Chưa đạt** — **cùng loại hình với c8** (tấm ô vuông bay lơ lửng + que gỗ), không đọc được "các sợi đan qua nhau"; không có chiều sâu, nền tím trống ~50 %. Khuyến nghị: tận dụng cú lùi của vòng 1 nhưng phải có **sợi thật dày, có nếp, có lớp sợi mờ ở hậu cảnh**; khác c8 rõ rệt.
- [c11 · 35.34–38.53]: **Chưa đạt** — xem Hero 2.
- [c12 · 38.73–40.86]: Đạt — sợi có xơ, vệt nước bám, đọc được "ở rìa sợi, nó thành vệt trong xơ". Điểm yếu nhỏ: xơ vẫn cứng, giọt ở góc dưới trái hơi cắt. Khuyến nghị: mềm hoá xơ, đưa vệt nước vào giữa khung.
- [c13 · 41.31–43.77]: **Chưa đạt** — mặt nước là **một mảng xanh nghiêng như tấm kính nghiêng**, không thấy "mặt" nào; cụm phân tử nằm lơ lửng nhưng không có đường mặt nước để bám lên. Khuyến nghị: đặt mặt nước thành dải sáng nằm ngang 1/3 trên có meniscus, phân tử bám đúng mặt đó.
- [c14 · 43.97–45.96]: **Chưa đạt** — khung gần như **trống**: một trời xanh tối và vài hạt. Đây là nhát chuyển cảnh nên có thể trống, nhưng phải có một hướng dẫn (vệt sáng mặt nước, mép chum). Khuyến nghị: giữ mặt nước ở mép dưới làm mốc định hướng.
- [c15 · 46.41–48.81]: **Chưa đạt** — mặt nước lại là một dải nghiêng chạy chéo 1/4 trên; "các phân tử cứ nhảy lung tung" không đọc được vì không có tương phản giữa phân tử đang nhảy và phần đang nằm yên. Khuyến nghị: thêm vệt/vệt sáng ở phân tử đang nhảy, đặt mặt nước ngang.
- [c16 · 49.01–51.34]: **Chưa đạt** — khung gần như **trống**, chỉ vài phân tử ở mép trái và một cụm to bị cắt ở góc trên phải; "chỉ một phần nhỏ đủ năng lượng để bứt ra ngoài" không có chủ thể. Khuyến nghị: đưa một phân tử đang rời mặt vào 1/3 trên, phần còn lại nằm yên dưới, tương phản rõ.
- [c17 · 51.79–54.04]: Đạt — phân tử bay lên đọc được, có vệt sáng kéo theo. Điểm yếu: phân tử vẫn là cụm cầu trắng như tinh thể, nền tối. Khuyến nghị: làm cụm mềm, trong suốt, có highlight.
- [c18 · 54.24–55.75]: Đạt — mặt nước tối đi, phân tử nguội màu, đọc được "mát đi". Điểm yếu: dải nền tối không có nguồn sáng dẫn dắt. Khuyến nghị: giữ một gradient nhạt ở hậu cảnh để không chạm ngưỡng DARK.
- [c19 · 56.20–59.41]: Đạt — áo ướt là chủ thể, chiếm giữa khung, có mảng ẩm. Điểm yếu: chuyển sang "vải lạnh" (tông xanh lạnh) không thấy; hình gần như giống c21. Khuyến nghị: thêm hạt hơi nước bốc lên từ mặt áo để nói "nước lấy nhiệt".
- [c20 · 59.61–61.52]: **Chưa đạt** — bàn tay **chiếm ~70 % khung**, ngón tay như ống dài, không thấy chỗ tiếp xúc với vải (vải chỉ là nền texture); "mình thấy lạnh ngay" không có dấu hiệu (màu da không lạnh đi). Khuyến nghị: lùi để thấy cả tay + mặt áo, ngón tay ép xuống vải có vết lún, đổi tông da sang lạnh.
- [c21 · 61.72–65.12]: Đạt — áo với hơi nước bốc lên, đọc được "hơi nước bám trên mặt áo". Điểm yếu: khung giống c19, hơi nước mờ. Khuyến nghị: dựng hạt hơi nước rõ và thay bố cục so với c19.
- [c22 · 65.57–68.81]: **Chưa đạt** — "lớp hơi mỏng bám mặt áo" **gần như vô hình**; khung bị một mảng tối lớn chiếm giữa, không có vệt sáng viền như `LOOK.md` mô tả. Khuyến nghị: làm lớp hơi thành mảng alpha có viền sáng rõ, đặt ở mép áo để người xem thấy đường bám; giảm mảng tối.
- [c23 · 69.01–71.01]: **Chưa đạt — vật chính vắng mặt.** Khung là **trần nhà**. Xem bảng lỗi ở đầu file. Khuyến nghị: camera phải nằm sát mặt áo, chỉ lên ~5–10 cm, khung gồm mép áo + khoảng không phía trên, hơi nước đi qua đó.
- [c24 · 71.21–74.60]: **Chưa đạt** — siêu cận cổ áo, không có lớp hơi nào đọc được; "mỏng như một tấm kính mờ" không minh hoạ được. Khuyến nghị: mảng hơi có viền sáng bám mặt vải, đặt cạnh cổ áo, có xuyên sáng nhìn thấy sợi bên dưới.
- [c25 · 75.05–77.84]: **Chưa đạt** — lớp hơi chỉ là một mảng xanh nhạt nhỏ ở giữa, "bám sát vải, nhanh chóng bị bão hoà" không đọc được; không có hạt hơi nước đọng lại. Khuyến nghị: lớp hơi phủ kín mặt áo với mật độ hạt dày, có hạt đọng.
- [c26 · 78.04–80.03]: **Chưa đạt — vi phạm tiêu chí 2.** Góc nhìn từ trần xuống thẳng đuột, giống bản vẽ kỹ thuật; trùng hình với c40. Khuyến nghị: bỏ góc từ trần; dùng góc ngang thấp nhìn chéo lên lớp hơi bao quanh mép áo, sàn tối ở hậu cảnh để tạo chiều sâu.
- [c27 · 80.48–84.27]: **Chưa đạt** — quạt nhỏ ở 1/3 trái, **áo ở mép phải bị cắt**, phần giữa khung là tường trống; "gió thổi tới, lớp ẩm bị quét đi" không đọc được. Khuyến nghị: đưa cả quạt và cả mép áo vào trong khung, chọn hướng quét từ trái sang phải, lớp ẩm mờ dần theo hướng gió.
- [c28 · 84.47–86.44]: **Chưa đạt — vật chính vắng mặt.** Khung là **cánh quạt chiếm trọn khung**. Xem bảng lỗi. Khuyến nghị: đứng sau lưng quạt nhưng lùi xa để thấy cả tấm áo được chiếu sáng và đường đi hơi nước rút ngắn thành đường thẳng.
- [c29 · 86.89–87.92]: **Chưa đạt** —áo B (ngoài luồng gió) không ở tâm khung, tâm là tường trống; **áo ở mép trái bị cắt**; luồng gió lại hiện ở bên áo A khiến người xem tưởng ngược. Khuyến nghị: đưa áo B vào chính giữa khung, áo A chỉ chút mép bên trái, mảng ẩm còn nguyên trên áo B.
- [c30 · 88.12–89.33]: **Chưa đạt — vật chính vắng mặt.** Khung là góc phòng trống. Xem bảng lỗi. Khuyến nghị: siêu cận các hạt hơi nước đã rời mặt áo, có vệt kéo dài sang phải, nền tối có gradient.
- [c31 · 89.78–92.19]: Đạt — hạt khí thành đường chạy, túi nylon nghiêng. Điểm yếu: **áo bị cắt ở mép phải**, 40 % khung là tường. Khuyến nghị: lùi ra, đưa áo vào khung, giữ hạt khí làm đường dẫn.
- [c32 · 92.39–93.83]: Đạt — toàn cảnh phòng từ cửa, đủ hai áo, cửa sổ kín, quạt; làm được nhịp kết luận. Điểm yếu: hơi tối và nhỏ, khó đọc. Khuyến nghị: nâng cường độ đèn lên 15–20 %.
- [c33 · 94.28–98.01]: **Chưa đạt — vật chính vắng mặt.** Xem bảng lỗi. Khuyến nghị: lùi và hạ camera để **hai cái cân cùng một bàn vào trọn khung**, mỗi cái một áo nhỏ treo ngay trên, quạt ở hậu cảnh; đồng hồ treo tường không được cắt.
- [c34 · 98.21–99.46]: **Chưa đạt** — mặt cân bên trái **bị cắt nửa ở mép khung**, "hai cái kim lệch nhau" không so được trong một khung. Khuyến nghị: lùi thêm 20 % để hai mặt cân và hai kim cùng vào khung, số 288 g / 88 g đọc được.
- [c35 · 99.91–101.53]: **Chưa đạt** — **vách ngăn thành một tấm xám lớn chặn giữa khung**, bàn thí nghiệm nhỏ ở đáy khung, phòng tối. Người xem không hiểu đang dựng cái gì. Khuyến nghị: quay góc 3/4 từ đầu bàn để thấy **quạt nhỏ → một mặt kính → vách → mặt kính thứ hai** trong một khung, nâng sáng.
- [c36 · 101.73–104.53]: **Chưa đạt** — xem Hero 3.
- [c37 · 104.73–107.16]: **Chưa đạt** — giọt chiếm gần hết khung nhưng **không có bối cảnh nào cho biết nó ở bên nào**; "rơi còn một nửa" không đối chiếu được trong khung này. Khuyến nghị: giữ mép vách ngăn ở tiền cảnh và viền mặt kính để thấy đây là giọt phía không có gió, so với giọt nhỏ hơn ở c36.
- [c38 · 107.61–109.70]: **Chưa đạt** — nhiệt kế và ẩm kế **nhỏ xíu ở góc trên trái**, 70 % khung là tường; "ba thứ quyết định tốc độ" không có chủ thể. Trùng bố cục với c45. Khuyến nghị: đưa hai đồ đo chiếm ~1/3 khung, có dây treo và bóng đổ.
- [c39 · 109.90–112.48]: Đạt — mặt nhiệt kế với vạch 10–50 đọc được, cột hồng khoáng thấy rõ. Điểm yếu: khung chỉ có nhiệt kế trong khi lời liệt kê ba thứ. Khuyến nghị: giữ cận nhiệt kế ở c39 nhưng cất ẩm kế và đàn áo vào c40/c42 để không lặp.
- [c40 · 112.68–115.11]: **Chưa đạt — vi phạm tiêu chí 2 + không đếm được số.** Xem bảng lỗi. Khuyến nghị: quay ngang tầm dây thứ hai, ba áo xếp chồng theo phương ngang với mép vải riêng biệt nhìn thấy được, đủ sáng để đếm đúng ba.
- [c41 · 115.56–118.74]: Đạt — cửa số `20 g/kg` và kim đồ đo đọc được, đúng như bảng "Số trên hình". Điểm yếu: **hình gần như trùng c46** (cùng góc, cùng vị trí kim). Khuyến nghị: đổi góc c46 (nhìn chếch từ dưới lên, hoặc rời khung đồ đo) để không trùng.
- [c42 · 118.94–120.95]: **Chưa đạt** — ẩm kế **nhỏ ở mép phải**, ~80 % khung là tường trống, cửa số bị cắt. Khuyến nghị: cận vào cửa số sao cho chữ `20 g/kg` và đơn vị nằm trọn trong khung, dùng chỗ trống bên trái làm chỗ đặt thẻ chú thích.
- [c43 · 121.15–122.37]: **Chưa đạt** — khung là toàn cảnh hiên nhưng **một khối xanh đen ở mép phải** đọc như vùng chưa dựng (trời đêm), lệch tông với nắng sớm ở c1; "đó là trần của nó" không minh hoạ được. Trùng bố cục với c58. Khuyến nghị: dựng nền trời sáng, đưa tầm mắt lên cao để thấy bầu trời, bỏ khối tối.
- [c44 · 122.82–125.22]: Đạt — cột thuỷ ngữ dâng gần vạch 30, đọc được. Điểm yếu: chưa đúng vạch 30 và "hơi nước lan xa" không có trong khung. Khuyến nghị: giữ cận, đặt cột đúng vạch, thêm hạt hơi nước ở hậu cảnh.
- [c45 · 125.42–128.08]: **Chưa đạt — số trên đồ đo sai lời.** Xem bảng lỗi. Khuyến nghị: cột thuỷ ngữ phải đứng đúng vạch 30 trong suốt câu, và phải thấy hạt hơi nước lan rộng hơn; khung không được để trống 70 % là tường.
- [c46 · 128.53–133.13]: **Chưa đạt** — trùng hình với c41 (cùng mặt ẩm kế, cùng vị trí kim); kim phải chỉ đúng 90 %, vạch đỏ 100 % phải vào khung. Khuyến nghị: đổi góc, đưa vạch đỏ vào khung.
- [c47 · 133.33–136.15]: **Chưa đạt** — áo trên dây hiên, lớp hơi chỉ là một vệt teal mờ nhỏ ở mép phải; "lớp hơi quanh áo mờ đục, hạt hơi nước lơ lửng" không đọc được. Khuyến nghị: lớp hơi bao quanh áo như mảng mờ đục có hạt lơ lửng bên trong, đặt nắng chiếu ngang để hạt lơ lửng bắt sáng.
- [c48 · 136.60–140.50]: **Chưa đạt — khung lật ngược 180°.** Xem bảng lỗi. Khuyến nghị: bỏ roll, quay ngang tầm thân áo để thấy nửa khô – nửa ẩm bằng vệt mảng ẩm chạy ngang.
- [c49 · 140.71–143.03]: **Chưa đạt — góc từ trên xuống xiên, camera lăn.** Xem bảng lỗi. Khuyến nghị: quay ngang tầm lưng ghế, áo úp ở 1/3 và áo phơi rộng ở 2/3, mảng ẩm trên áo úp phải đậm hơn.
- [c50 · 143.48–146.82]: **Chưa đạt** — chỉ thấy **quần navy bị cắt cụt ở mép trên**; không có áo mỏng để so, "dày giữ nhiều nước hơn" không đọc được. Khuyến nghị: đưa quần và áo thun mỏng vào cùng khung, mảng ẩm của quần đậm và rộng hơn.
- [c51 · 147.02–148.93]: Đạt — giọt bám đúng mép khăn rồi rơi, đọc được. Điểm yếu: mép khăn trông như tua/rèm hơn là khăn tắm, và giọt chưa rõ là đang rơi. Khuyến nghị: thêm vài nếp dày của khăn, cho giọt kéo dài khi rơi.
- [c52 · 149.38–152.86]: Đạt — lớp hơi quanh áo là một mảng cyan đọc được, quạt đã tắt nên không có luồng. Điểm yếu: mảng cyan hơi **đặc và phẳng**, bão hòa màu, và áo sau đó bị mờ. Khuyến nghị: hạ độ đậm, thêm hạt bên trong mảng để đọc là lớp khí.
- [c53 · 153.06–155.20]: Đạt — toàn cảnh phòng kín, **hai áo mỗi áo một mảng hơi**, quạt tắt; "phơi trong nhà lâu khô hơn" đọc được. Điểm yếu: mảng hơi hơi giống halo phát sáng. Khuyến nghị: cho mảng bám theo mép áo (có viền sáng) thay vì bọc tròn.
- [c54 · 155.65–158.51]: **Chưa đạt** — có một **ống/cylinder trắng dài chĩa vào bàn tay** trông như một cái ống kim loại đấm vào tay, không phải luồng gió; bàn tay lại đọc như bao tay. Khuyến nghị: bỏ hình trụ, thay bằng các hạt khí cong cong bay tới mu bàn tay; ngón tay chĩa, mu bàn tay ngửa.
- [c55 · 158.71–160.78]: **Chưa đạt** — tay chiếm gần hết khung, **không thấy mồ hôi bám trên da** (chỉ có hạt cyan bay lơ lửng), "hơi nước bám trên da bị gió cuốn đi" không đọc được. Khuyến nghị: lùi để thấy cả bàn tay + luồng gió + mặt áo làm hậu cảnh; thấy rõ các giọt mồ hôi dính da rồi bị gió kéo lệch.
- [c56 · 161.23–163.57]: **Chưa đạt — cháy sáng.** Áo trên dây **cháy trắng** giữa khung, mất texture và mất hình dáng. Khuyến nghị: giảm cường độ đèn ở câu này, giữ áo ở vùng sáng vừa đủ để vẫn thấy nếp vải và mảng ẩm đã tan.
- [c57 · 163.77–165.44]: **Chưa đạt** — cận cổ áo, **vẫn còn một mảng tối lớn** ở giữa dù lời nói "mảng ẩm đã tan"; mốc "khô" không đọc được. Khuyến nghị: soi một mảng vải cụ thể đã khay màu, không nếp gấp, có nắng xiên lên, để sự khác biệt với c24 rõ.
- [c58 · 165.64–167.49]: **Chưa đạt** — trùng bố cục với c43 (cùng toàn cảnh hiên, cùng khối trời tối ở mép phải); "gió chỉ làm cho nước có chỗ để đi" không có khoảng trống nào được chỉ ra. Khuyến nghị: đổi sang góc nhìn dọc theo dây phơi có vải đang bay, khoảng trống giữa các món đồ được sáng và nổi.
- [c59 · 167.94–170.59]: **Chưa đạt — DARK + chủ thể không rõ.** Khung là một mảng trắng lớn trên nền xanh đen (trời tối) với quầng sáng ở góc trên; không đọc ra là túi nylon vẫy, và nền tối đi ngược với nắng sớm. Khuyến nghị: chụp túi nylon trên hiên dưới nắng, thấy rõ nó đang vẫy, nền là tường hiên sáng.
- [c60 · 170.79–173.43]: **Chưa đạt** — trên ghế là một **vật hình nón lá** (mũ có vành) chứ không phải áo phơi rộng; "phơi cả hai mặt" không đọc được, và khung đông vật (thau, áo, túi) chạy nhau. Khuyến nghị: thay vật trên ghế bằng cái áo phơi rộng thật, hai mặt phơi ra, bỏ mũ.

## KHUYẾN NGHỊ ĐẠO DIỄN

Điều kiện PASS không đạt: **6 câu mất vật chính** (c23, c30, c33, c42, c45, c59), thêm c28, c40, c48, c49, c2, c56. Điểm trung bình 2.33 < 4.0. Trước khi qua vòng 4, xử lý theo thứ tự ưu tiên sau:

1. **Dựng lại các nhát mất vật chính** (bắt buộc, chặn): c23 (camera rơi lên trần nhà → hạ xuống sát mép áo), c30 (góc phòng trống → siêu cận hạt hơi nước có vệt), c33 (một cái cân ở góc → hai cái cân + hai áo trong khung), c42 (ẩm kế ở mép → cận cửa số `20 g/kg`), c45 (nhiệt kế nhỏ + cột ở 25 °C → cột đúng vạch 30, cận hơn), c59 (mảng trắng trên nền tối → túi nylon dưới nắng).
2. **Bỏ ba góc máy bị cấm** (tiêu chí 2): c26 và c40 (nhìn từ trên xuống thẳng đuột) và c49 (nhìn từ trên xuống xiên) → đổi sang góc ngang tầm vật; c48 → bỏ roll 180°.
3. **Sửa hai nhát cơ chế đang trống:** c28 (cánh quạt chiếm trọn khung) và c22/c25 (lớp hơi không đọc được) → đưa lớp hơi vào khung dưới dạng mảng alpha có viền sáng bám mặt vải, có hạt đọng.
4. **Sửa số trên đồ đo cho khớp lời:** c45 — cột thuỷ ngữ phải đứng ở vạch 30 (hiện là ~25); c46 — kim phải chỉ 90 % với vạch đỏ 100 % trong khung; c34 — hai mặt cân phải vào trọn khung để "hai kim lệch nhau" đọc được.
5. **Tách các nhát trùng hình:** c41 ↔ c46 (đổi góc một trong hai), c38 ↔ c45, c43 ↔ c58, c8 ↔ c10, c19 ↔ c21.
6. **Chỉnh ánh sáng:** c56 cháy trắng (giảm cường độ), c9 mờ và tương phản thấp, c2 và c42 tường trống chiếm ưu thế, c18 và c30 có vùng tối không có nguồn sáng dẫn dắt. Đồng hồ treo tường vẫn bị cắt ở mép khung ở c3 và c33 — sửa lại vị trí treo.
7. **Sửa lời trong `LOOK.md` (không sửa ở vòng này, ghi nhận để vòng 4):** mục "Số trên hình" khẳng định cột thuỷ ngữ đứng đúng vạch 30 ở c45 — hình không có vậy; và ghi chú vòng 2 nói "giọt sau vách ngăn nhỏ nhanh hơn giọt có gió" là **ngược với `FACTS.md` §4** (không gió thì bay hơi chậm hơn, giọt phải to hơn) — hình hiện đang đúng, chỉ là chữ trong LOOK sai.
8. **Giữ nguyên những gì đã đạt** để không phá: c1 (Hero 1, chỉ cần bồn chậu + mảng ẩm sắc nét hơn), c3, c12, c17, c18, c21, c31, c32, c36 (đúng cơ chế giọt, chỉ cần bố cục), c37, c41, c44, c51, c52, c53, c55 (cần thấy mồ hôi), c57.

**Lưu ý kỹ thuật:** `core/render/still.mjs` chụp ngay sau khi dựng nên ảnh ra đôi khi là khung trước; các khung trên đã được chụp lại tại nhiều mốc trong câu (giữa câu và cuối câu) và kết luận về c23, c30, c33, c45, c40, c48, c49 là **tĩnh trong suốt câu**, không phải lỗi chọn thời điểm chụp.
