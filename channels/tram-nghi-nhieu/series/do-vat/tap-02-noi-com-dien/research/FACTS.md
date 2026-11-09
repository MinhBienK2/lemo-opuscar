# Facts — Vì sao nồi cơm điện tự biết lúc nào cơm chín?

Mọi con số phim đưa lên màn hình đều có nguồn ở đây. Giọng kể đọc chúng; hình đặt chúng vào vật.
Không có gì lên màn hình mà file này không viết ra.

**Quy tắc của file này:** mỗi con số trên màn hình có nguồn ở đây, và một giá trị mà file này cấm thì **không được nói** trong phim.
Wikipedia không được dùng làm nguồn ở đây: mỗi mắt xích của câu trả lời phải đứng sau một nguồn sơ cấp — bài bình duyệt, sách chuyên ngành, datasheet của hãng, tiêu chuẩn, bằng sáng chế, hay tài liệu kỹ thuật của nhà sản xuất.

## 1. Đầu dò nhiệt là một cầu điện trở mà điện trở tụt xuống khi nó nóng lên

> "As the temperature increases, increasing numbers of electrons gain sufficient thermal energy to reach the higher energy states, thereby creating larger numbers of mobile holes and electrons, in the valence band and the conduction band, respectively. … The combination of the effects gives an overall resistance-temperature behaviour that is well approximated by R(T) = R₀ exp(Eg / 2kT), where R₀ is a constant. Usually Equation (2) is rewritten in the form R(T) = R(T₀)exp[β(1/T − 1/T₀)], where T₀ is some convenient reference temperature, often 298.15 K (25 °C). The parameter β is a characteristic of the thermistor material with typical values in the range 2000 K to 6000 K."

White, D. R.; Hill, K.; del Campo, D.; Garcia Izquierdo, C. (2014), *Guide on Secondary Thermometry: Thermistor Thermometry*, Consultative Committee for Thermometry, Bureau International des Poids et Mesures (BIPM), 19 tr. DOI/URL: https://www.bipm.org/documents/20126/41773843/Guide-SecTh-Thermistor-Thermometry.pdf

- **Dùng trong phim:** điện trở của đầu dò nhiệt **tụt xuống** khi nồi nóng lên. Đây là điều làm cho nó đo được nhiệt độ.
- **Phạm vi:** đây là cơ chế vật lý của nhiệt điện trở bán dẫn, không phải của một cái nồi cơm cụ thể; bản hướng dẫn nói về nhiệt điện trở nói chung, dùng để đo nhiệt độ.
- **Cách nói:** "điện trở của nó tụt xuống khi nó nóng lên" — không nói "điện trở của mọi linh kiện đều tụt", và không đưa công thức lên màn hình.

## 2. Một đầu dò nhiệt điển hình: mười kiloôm ở hai mươi lăm độ, tụt xuống gần một kiloôm ở một trăm độ

> "Resistance (25℃) 10kΩ / Resistance Value Tolerance (at 25℃) ±1% / B-Constant (25/50℃) 3380K / B-Constant (25/50℃) Tolerance ±1% / B-Constant(25/80℃) (Reference Value) 3428K / B-Constant(25/85℃) (Reference Value) 3434K / B-Constant(25/100℃) (Reference Value) 3455K / Operating Temperature Range -40℃ to 125℃"

Murata Manufacturing Co., Ltd. (2023), *Product Search Data Sheet — NCP18XH103F03RB, NTC Chip Thermistor*, số tài liệu của hãng. DOI/URL: https://media.distrelec.com/Web/Downloads/_t/ds/Murata_NCP18XH103F03RB_eng_tds.pdf

- **Dùng trong phim:** điện trở danh định **mười kiloôm ở hai mươi lăm độ** (sai số ±1 %). Con số "khoảng một kiloôm ở một trăm độ" là **phép tính của chính tập phim** từ đúng datasheet này: R(100) = 10 000·exp[3434·(1/373,15 − 1/298,15)] ≈ 987 Ω, tức quanh một kiloôm.
- **Phạm vi:** đây là linh kiện chip dán (SMD) của một hãng, không phải đầu dò gắn trong nồi cơm; nó cho điện trở và hệ số B của linh kiện đó. Hệ số B phải luôn nói kèm cặp nhiệt độ, vì cùng một linh kiện có B khác nhau ở các cặp khác nhau.
- **Cách nói:** "lúc mát là mười kiloôm, khi nóng lên chỉ còn khoảng một kiloôm" — và nói rõ đây là phép tính từ datasheet, không phải số đo của một chiếc nồi. **Hai mươi lăm độ** và **một trăm độ** là điều kiện để tính, không lên màn hình: màn hình cầu đo chỉ hiện điện trở.

## 3. Cảm biến nằm ở chính giữa mâm nhiệt, ép sát mặt dưới nồi

> "The heat sensor mechanism 6 is formed at the center of the bottom of the inner frame 2 … Between the projecting member 2b and support member 2c, a coil spring 8 and a heat transfer cap 9 urged thereby against the bottom of the pan 4 are provided. … Inside the end portion of the heat transfer cap 9, a thermistor 10 is molded in a heat conductive molding member 11. … The temperature of the pan is taken out by a heat-sensitive element such as a thermistor in the form of an electric signal which is used to control the rice cooking and warming operations with the electric circuit."

Matsumoto, Y.; Aoshima, T.; Matsuo, K. (1984), *Rice cooker-warmer*, US Patent 4,455,480, Tokyo Shibaura Electric Co., Ltd. (nộp 04/03/1982, ưu tiên JP 56-34743 ngày 10/03/1981, cấp 19/06/1984). DOI/URL: https://patents.google.com/patent/US4455480A/en

> "The center thermostat senses when the bottom of the rice cooker pan reach 134°C ± 6°C. And it's action turns off the cooking cycle, and starts the warming cycle. … Normally when the pan is inserted properly into the rice cooker, the pan will depress the center thermostat. The center thermostat outer spring will be compressed. … Keep warm temperature More than or equal to 80 °C (After 1 Hr. keep warm)"

Panasonic Home Appliance (Thailand) Co., Ltd. (2007), *Service Manual: Automatic Rice Cooker SR-G06G/G10SG/G18SG*, Order No. PHAT070801S3, tr. 1, 5–6, 9.

- **Dùng trong phim:** hình cảnh một lò xo ở chính giữa mâm nhiệt ép một đầu dò nhỏ áp sát vào mặt dưới nồi; trọng lượng của nồi ấn xuống làm đầu dò áp vào đáy. Không có con số nào trong cảnh này.
- **Phạm vi:** bằng sáng chế nói **cách nó được chế tạo**; tài liệu kỹ thuật của Panasonic nói **nhiệt độ làm việc của bộ cảm biến giữa** và việc nó chuyển từ vòng nấu sang vòng giữ ấm. Con số 134 °C ± 6 °C là thông số của **bộ cảm biến cơ kiểu nam châm** mà tài liệu này mô tả, không phải ngưỡng chung của mọi nồi cơm.
- **Cách nói:** "một đầu dò nhỏ ở chính giữa mâm nhiệt, ép sát vào đáy nồi" — không nói "nồi cơm đo nhiệt độ của cơm", và không đưa 134 °C lên màn hình.

## 4. Hai thế hệ: công tắc nhiệt cơ ở đáy nồi, rồi mới đến nhiệt điện trở và vi xử lý

> "More particularly, a conventional thermostat or bi-metal thermostat mounted on the bottom of the pot will operate in the first step and will thus be unable to automatically control the second step, while a timer utilizing a clock mechanism and the like will not operate satisfactorily because the instant at which the electric heater should be deenergized must be varied depending upon the quantity of rice to be cooked."

Komatsu, T. (1965), *Plug-type automatic temperature control device for electrically powered rice cookers*, US Patent 3,177,319, Tokyo Shibaura Electric Co., Ltd. (ưu tiên Nhật 22/02/1961). DOI/URL: https://patents.google.com/patent/US3177319A/en

> "The conventional electrical rice cooker has two bimetalic relays or one magnetic and one bimetalic relay. They are respectively used for switching off a large current for boiling rice and water, and for switching on a small current for keeping the cooked rice warm at an appropriate temperature."

Sano, Y.; Yamazaki, K.; Sasaki, H.; Hayakawa, S. (1970), *Automatic electric rice cooker*, US Patent 3,551,644, Matsushita Electric Industrial Co., Ltd. (nộp 28/05/1968, cấp 29/12/1969). DOI/URL: https://patents.google.com/patent/US3551644A/en

> "Conventional electric rice cookers have a lever for a power switch, which turns on the automatic temperature switch located under the inner pot. … The heaters are connected with bimetal thermal switches with operating temperatures different from each other. … When the temperature of the inner pot rises abruptly after boiling rice, exhausting all of the water, another bimetal thermal switch is activated so as to change the connection of the heaters …"

Ma, C.-H. (1990), *The control device of an electric rice cooker*, GB Patent 2,229,831 (ưu tiên 01/04/1989). DOI/URL: https://patents.google.com/patent/GB2229831A/en

> "一定電力で通電し，水がなくなったことを鍋底の温度センサ一体型スイッチが検知し，通電を機械スイッチにより，遮断する。 … 鍋底やふた内部に設けた半導体温度センサからの情報を基にマイコンが通電量を制御する。"

Bộ phận Năng lượng Tài nguyên và Nhiên liệu, Bộ Kinh tế Công nghiệp Nhật Bản (2005), *最終取りまとめ 電気炊飯器判断基準小委員会* (báo cáo cuối của hội đồng tiêu chuẩn tiết kiệm năng lượng nồi cơm điện), tháng 6/2005. DOI/URL: https://www.enecho.meti.go.jp/category/saving_and_new/saving/enterprise/equipment/council/pdf/050613cooker.pdf

- **Dùng trong phim:** hình một chiếc nồi cơm đời đầu với một thanh lưỡng kim ở đáy nồi và một cần bấm; rồi hình nồi cơm hiện đại với bo mạch. Không có con số nào trong cảnh này.
- **Phạm vi:** các văn bản nói **cơ cấu công tắc** (cơ chế lưỡng kim, rơ-le từ tính, công tắc nhiệt dưới nồi trong), và cách bộ vi mạch dùng cảm biến bán dẫn ở đáy nồi và trong nắp để điều khiển công suất. Không văn bản nào dùng thẳng câu "không có điện tử", nên phim nói về **cơ chế**, không nói về việc "không có gì".
- **Cách nói:** "hồi xưa nồi cơm chỉ có một công tắc nhiệt cơ ở đáy nồi; bây giờ là một đầu dò nhiệt và một vi mạch" — không nói "nguyên thuỷ", không nói "hoàn toàn cơ".

## 5. Còn nước lỏng trong nồi thì nhiệt độ đáy nồi đi ngang ở khoảng một trăm độ

> "Normal boiling point | Temperature T_b = 373.124 K | Pressure p_b = 0.101 325 MPa"

Wagner, W. & Pruß, A. (2002), "The IAPWS Formulation 1995 for the Thermodynamic Properties of Ordinary Water Substance for General and Scientific Use", *Journal of Physical and Chemical Reference Data* **31**(2), 387–535. DOI: 10.1063/1.1461829

> "However, in a phase transition, heat transfer does not cause any temperature change. … The temperature again remains constant during this phase change while the water absorbs 2256 kJ/kg of heat and turns into steam."

Ling, S. J.; Moebs, W. & Sanny, J. (2016), *University Physics Volume 2*, §1.5 "Phase Changes", OpenStax, Rice University (CC BY 4.0). DOI/URL: https://openstax.org/books/university-physics-volume-2/pages/1-5-phase-changes

> "During the rapid heating stage, the temperature at the four sampling points increased sharply and reached boiling (100°C) with different heating rates. … During the high-temperature maintenance stage, the rice temperature at four different positions (CU, PU, CL, and PL) in the pot was maintained at 100°C until the end of cooking."

Kong, J.; Tao, J.; Fu, S.; Wen, Y.; Zhao, S.; Zhang, B. (2022), "Corner coil heating mode improves the matrix uniformity of cooked rice in an induction heating cooker", *Frontiers in Nutrition* **9**, 1038708. DOI: 10.3389/fnut.2022.1038708

> "The temperature of the inner pot bottom is measured 1 to 4 degrees lower than the temperature of the water in the inner pot."

Dayou Winia Co., Ltd. (2017), *Cooking method for electric rice cooker*, WO Patent Application WO/2017/104900 A1. DOI/URL: https://patents.google.com/patent/WO2017104900A1/en

- **Dùng trong phim:** nhiệt kế trong nồi chỉ **một trăm độ** và đứng yên ở đó suốt buổi nấu. Con số này là điểm sôi của nước ở áp suất khí quyển, và đồng thời là mức nhiệt độ đo được trong nồi khi còn nước.
- **Phạm vi:** mức "đi ngang ở một trăm độ" là mức **đo được** trong nồi (mục Kong và mục Xu ở mục 7); phép tính điểm sôi là của chuẩn nước IAPWS-95. Riêng đáy nồi đo được **thấp hơn nước trong nồi khoảng một đến bốn độ**, nên nhiệt độ đáy nồi chỉ vượt lên trên một trăm độ khi nước đã cạn.
- **Cách nói:** "nước sôi ở khoảng một trăm độ, và chừng nào còn nước lỏng trong nồi thì nhiệt độ đáy nồi không lên được cao hơn" — không nói "mọi lúc nồi đều đúng một trăm độ", và không kèm con số nhiệt ẩn hoá hơi.

## 6. Cơm chín ở nhiệt độ thấp hơn hẳn nhiệt độ sôi: tinh bột gạo hồ hóa trong một dải quanh sáu mươi độ

> "These two starches displayed gelatinization transitions in the temperature ranges 58.9–72.4 °C (rice) and 64.3–77.2 °C (maize) over a wide range of water contents. … When an aqueous suspension of starch granules is heated above a certain temperature, the granules undergo an irreversible order-disorder transition known as gelatinization."

Wang, S.; Chen, C.; Xiang, F.; Zhang, X.; Wang, S. & Copeland, L. (2018), "New insights into gelatinization mechanisms of cereal endosperm starches", *Scientific Reports* **8**, 3011. DOI: 10.1038/s41598-018-21451-5

> "The To, Tp and Tc of native rice starch were 61.50 °C, 68.83 °C, and 75.57 °C, respectively, in agreement with the range of gelatinization temperature for various rice starches. … When heated in water, starch granules absorb water and swell. As water penetrates their amorphous regions, the crystalline structure is disrupted, causing the loss of birefringence—a clear indicator of gelatinization"

Teng, B.; Zhang, C. & Wang, H. (2025), "Impact of Partial Gelatinization on Structure, Physicochemical and Enzymatic Digestion Properties of Rice Starch Used for Rice Noodle-Making", *Polymers* **17**(22), 3003. DOI: 10.3390/polym17223003

> "During cooking, starch granules lose their crystalline structure, absorb water, and swell, while amylose exudes from the granules."

Xu, H.; Wei, G.; Chen, B.; Li, J.; Wang, L.-H.; Zeng, X.-A. & Sastry, S. K. (2026), "Application of Pulsed Ohmic Heating for Rapid Cooking of Indica Rice: Quality Enhancement and Mechanistic Insights", *Foods* **15**(15), 2742. DOI: 10.3390/foods15152742

- **Dùng trong phim:** hình hạt gạo trong nước trắng dần và nước quanh hạt đục lên thành hồ; con số **sáu mươi độ** đi trên một nhãn nhỏ dán ở một hạt gạo cưa đôi ("HỒ HÓA 60 °C"), **không** đi trên một nhiệt kế cắm trong lớp gạo — trong nồi đang sôi, lớp gạo không ở sáu mươi độ, và nhiệt kế trong nồi là của lớp nước. Giọng kể nói rõ đó là một **dải**, không phải một ngưỡng.
- **Phạm vi:** các phép đo trên tinh bột gạo tách riêng bằng nhiệt lượng (DSC), không phải trong nồi cơm; các giá trị phụ thuộc tỉ lệ nước với tinh bột. 68,83 °C là **nhiệt độ đỉnh** của một phép đo, không phải nhiệt độ bắt đầu.
- **Cách nói:** "tinh bột trong hạt gạo bắt đầu hồ hóa từ khoảng sáu mươi độ" và "hồ hóa xong vào khoảng bảy mươi hai độ" — không nói một con số duy nhất cho việc hồ hóa.

## 7. Cơm chín là lúc hạt gạo đã hồ hóa xong: hạt trong suốt, không còn lõi trắng

> "The starch granules in the nonsoaked rice were gelatinized at the same time as the grains became translucent during cooking. … The japonica rices were gelatinized fully in less than 20 min when the amount of water added for cooking was adequate."

He, G. & Suzuki, H. (1987), "The relationship between translucency of rice grain and gelatinization of starch in the grain during cooking", *Journal of Nutritional Science and Vitaminology* **33**(4), 263–273. DOI: 10.3177/jnsv.33.263

> "After 20 min of cooking in a rice cooker (CK-20), some white cores remained in the rice grains, indicating that certain areas had not yet fully gelatinized; however, after 25 min of cooking (CK-25), the rice grains became completely transparent, with no white or opaque spots, indicating that the rice had fully gelatinized. … Rice prepared using the “Quick Cook” mode of a commercially available rice cooker (Model MB-WFS4037, Midea, Foshan, China) (170 g rice plus 150 mL water, steamed for 25 min) was used as the conventional cooking control group (CK-25)."

Xu, H.; Wei, G.; Chen, B.; Li, J.; Wang, L.-H.; Zeng, X.-A. & Sastry, S. K. (2026), "Application of Pulsed Ohmic Heating for Rapid Cooking of Indica Rice: Quality Enhancement and Mechanistic Insights", *Foods* **15**(15), 2742. DOI: 10.3390/foods15152742

- **Dùng trong phim:** hình hạt gạo trong nồi — lúc đầu còn lõi trắng ở giữa, sau đó hạt trong suốt hẳn. Không có con số nào lên màn hình.
- **Phạm vi:** hai mươi lăm phút là thời gian của **một** vòng nấu trong **một** nồi cơm cụ thể (Midea MB-WFS4037, chế độ Quick Cook, 170 g gạo + 150 mL nước), không phải thời gian chung của mọi nồi cơm; hai mươi phút là thời gian hồ hóa của gạo japonica trong phương pháp nấu thừa nước, không phải của nồi cơm.
- **Cách nói:** "hạt gạo trở nên trong suốt đúng lúc tinh bột trong hạt hồ hóa xong" — không nói "cơm chín sau hai mươi lăm phút".

## 8. Khi nước cạn thì nhiệt độ đáy nồi tăng vọt lên trên một trăm độ

> "At the bottom of pot of the rice cooker, the temperature is kept near the water-boiling temperature as long as water in a liquid condition is left. As soon as all the water is lost by boiling, the temperature at the bottom of the pot begins to rise. … The temperature in the pot is kept at about 100° C. as shown in stage 18 of FIG. 7 by heat exchange due to an ascending air-flow from ventilating under a normal atmospheric pressure as long as water in a liquid state remains. When the water has boiled away or been absorbed by the rice, the temperature in the pot rises rapidly, as shown in stage 19 of FIG. 7."

Sano, Y.; Yamazaki, K.; Sasaki, H. & Hayakawa, S. (1970), *Automatic electric rice cooker*, US Patent 3,551,644, Matsushita Electric Industrial Co., Ltd. DOI/URL: https://patents.google.com/patent/US3551644A/en

> "The bottom temperature P of kettle 6 is kept about 100° C. while the water in kettle 6 remains — but suddenly rises higher than 100° C. when the water in kettle 6 is absorbed by rice or evaporated to the so-called dried up condition. … Thermo-sensor 18 includes a permanent magnet and a magnetic member which rapidly decreases its magnetic permeability at a predetermined temperature, for example 130° C."

Miwa, Y. (1982), *Electric rice cooker*, US Patent 4,315,138, Tokyo Shibaura Denki Kabushiki Kaisha (cấp 09/02/1982). DOI/URL: https://patents.google.com/patent/US4315138A/en

> "When the temperature of the inner pot rises abruptly after boiling rice, exhausting all of the water, another bimetal thermal switch is activated so as to change the connection of the heaters …"

Ma, C.-H. (1990), *The control device of an electric rice cooker*, GB Patent 2,229,831. DOI/URL: https://patents.google.com/patent/GB2229831A/en

- **Dùng trong phim:** cột thủy ngữ của nhiệt kế vượt lên trên vạch một trăm độ khi mặt nước đã cạn. Giọng kể nói **trên một trăm độ**, không đưa một con số đỉnh lên màn hình.
- **Phạm vi:** đây là **mô tả của chính thiết bị** trong bằng sáng chế, không phải một định luật đo được của khoa học thực phẩm. Chưa có bài bình duyệt nào đo được nhánh nhảy lên sau khi hết nước: hai bài có đường cong đo thật (mục Kong và mục Xu ở mục 5) đều dừng ở mức ngang quanh một trăm độ.
- **Cách nói:** "nước cạn thì nhiệt độ đáy nồi nhảy lên trên một trăm độ" và luôn ghi rõ đây là điều **mô tả trong bằng sáng chế của thiết bị**.

## 9. Máy nhận biết lúc nấu xong bằng độ dốc của đường cong, không bằng số phút

> "When water in the kettle 18 is boiled upon heating of the heater 20, the kettle temperature reaches the temperature Ts, and its temperature gradient becomes flat temporarily. When the kettle temperature is abruptly increased from time t1, the processing unit 60 detects this change in kettle temperature."

Oota, H.; Aoshima, T.; Yamamori, K. & Narita, R. (1983), *Electric rice cooker*, US Patent 4,421,974, Tokyo Shibaura Denki Kabushiki Kaisha (cấp 20/12/1983). DOI/URL: https://patents.google.com/patent/US4421974A/en

> "that is, when the temperature gradient or rise becomes steep at time t3 (FIG. 3) when no water is left at the bottom of the kettle 18, the comparator 126 supplies a logic level “1” signal … A cooking amount measuring circuit for detecting the actual amount of kettle contents every time a cooking operation is performed, and a control circuit for controlling the operation of the heater by determining the proper time at which the heater should be turned OFF in accordance with actually measured data obtained during the cooking operation which is being performed"

Oota, H.; Aoshima, T.; Narita, R. & Yamamori, K. (1984), *Electric rice cooker*, US Patent 4,431,906, Tokyo Shibaura Electric Co., Ltd. DOI/URL: https://patents.google.com/patent/US4431906A/en

- **Dùng trong phim:** dải sáng chạy trên hai dây từ đầu dò nhiệt **chạy nhanh hơn** đúng lúc nhiệt độ đáy nồi nhảy lên — đó là thứ mạch điện thật sự nhìn vào. Không có con số nào lên màn hình.
- **Phạm vi:** đây là **cách máy nhận biết theo bằng sáng chế**, không phải một định luật khoa học đo được; và việc máy đo "lượng gạo trong nồi" để biết mình đang nấu bao nhiêu là đặc điểm của một mẫu cụ thể.
- **Cách nói:** "máy không đếm phút; nó nhìn độ dốc của đường cong nhiệt độ" — không nói "mọi nồi cơm đều vậy".

## 10. Nhiệt độ giữ ấm là một thông số đo được, và nó nằm quanh bảy mươi độ

> "5.9 保温性能 … 5.9.1 保温温度 … (2) ジャー兼用電気がまは，8.9.2(1)，電子ジャーは8.9.2(2)によって保温試験を行ったとき，米飯の各測定箇所の温度が67〜78℃であり，著しい焦げの進行，異臭及び著しい褐変がないこと。 … 5.9.2 保温温度むら … 各測定値の最高と最低の平均値と各測定値との差は1.5℃以内でなければならない。"

Hiệp hội Tiêu chuẩn Nhật Bản (2007), *JIS C 9212 電気がま及び電子ジャー* (nồi cơm điện và bình giữ ấm điện tử), điều 5.9, 5.9.1 và 5.9.2. DOI/URL: https://kikakurui.com/c9/C9212-2007-01.html

> "5.6 Power Consumption for Warm-keeping Test Method … Measure water temperature values at the 4th hour, the 4.5th hour and the 5th hour; three specific time hours respectively. Take the average of these three temperature readings as the warm-keeping temperature. During the test, the warm-keeping temperature must be between 60 ℃ to 80 ℃. … ambient temperature : 23℃± 2℃ and without influence of air flow and heat radiation in the test venue"

Cục Dịch vụ và Điện lực, Chính phủ Hồng Kông (2026), *The Hong Kong Voluntary Energy Efficiency Labelling Scheme for Electric Rice Cookers*, mục 5.3 và 5.6. DOI/URL: https://www.emsd.gov.hk/filemanager/en/content_358/VEELS_Rice%20Cookers%202026_01_eng%20(clean).pdf

> "This document applies to household and similar electrical rice cookers. … Temperature retention during keep-warm state … The resolution of the instrument used to measure temperature shall be 0,1 °C. … Ambient temperature is maintained at 23 °C ± 2 °C for temperature-sensitive cooking and warming performance test."

Ủy ban Kỹ thuật điện Quốc tế (2024), *IEC 63399:2024 Household and similar electrical rice cookers — Methods for measuring the performance*, ấn phẩm 1.0 (2024-10), ISBN 978-2-8322-9796-4. DOI/URL: https://webstore.iec.ch/publication/75344

> "※ Its factory setting is "74℃" and you can set it as needed. … 취사 Cooking 煮饭 Nấu 890W (3.87A) … 보온 Keeping Warm 保温 Hâm nóng 107W (0.47A) … Cooking time 35~53 min"

Cuckoo (bản hướng dẫn tiếng Việt của nồi cơm điện tử CR-0810F, mục AC220V 50Hz dành cho Việt Nam). DOI/URL: https://cdn.tgdd.vn/Products/PDF/3/233686/HDSD/Huong-Dan-Su-Dung-(Tieng-Viet-Trang-3).pdf

- **Dùng trong phim:** nhiệt kế trong nồi lúc giữ ấm chỉ **khoảng bảy mươi độ**. Giọng kể có thể nói thêm rằng nồi cơm dùng ở Việt Nam giữ ấm ở 74 °C theo mặc định của hãng, nhưng đó là **thông số của thiết bị**, không phải quy luật.
- **Phạm vi:** dải 67–78 °C của JIS C 9212 áp cho nồi cơm dạng jar và bình giữ ấm điện tử, đo ở ba điểm bên trong nồi; một nồi cơm có cơ chế giữ ấm kiểu thường theo cùng tiêu chuẩn phải giữ nước cơm trên 80 °C. Chương trình của Hồng Kông đo nhiệt độ **nước** trong nồi trong một phép thử năm giờ ở 23 °C ± 2 °C.
- **Cách nói:** "nồi giữ ấm ở khoảng bảy mươi độ" — không nói "mọi nồi cơm giữ ấm đều ở đúng một nhiệt độ", và không nói "chín mươi độ" trừ khi nói rõ đó là nhiệt độ nước cơm của một loại nồi khác.

## 11. Giữ ấm không phải giữ nhiệt cho vừa phải: nóng quá thì khô, nguội quá thì hỏng

> "70℃程度 乾燥し堅くなる 黄ばむ … 60℃以下 雑菌の繁殖による腐敗"

Bộ phận Năng lượng Tài nguyên và Nhiên liệu, Bộ Kinh tế Công nghiệp Nhật Bản (2005), *最終取りまとめ 電気炊飯器判断基準小委員会*, tháng 6/2005. DOI/URL: https://www.enecho.meti.go.jp/category/saving_and_new/saving/enterprise/equipment/council/pdf/050613cooker.pdf

> "電気ジャー炊飯器の保温温度は、内なべ中のご飯の内部で 67～78℃とされていますが（注 1）、当該品では、保温中に内なべ中央部のご飯の表面で継続的にこの範囲内の温度に保たれていました。しかし、65℃前後の温度では、腐敗臭の原因となる好熱性細菌が増殖しうることが知られており … いずれも 24 時間保温時点のご飯からは多数の好熱性細菌が検出されました。"

Trung tâm Quốc gia về Sinh hoạt Người tiêu dùng, Nhật Bản (2018), *相談解決のためのテストから No.122 電気ジャー炊飯器での保温によりご飯から腐敗臭が発生*, ngày 14/06/2018, mục 2 (kết quả thử nghiệm). DOI/URL: https://www.kokusen.go.jp/pdf/n-20180614_3.pdf

- **Dùng trong phim:** đây là mảng **không lên màn hình** trong tập này; nó được giữ ở đây để bước viết lời không nói quá tay, và để chặn lời khuyên sai.
- **Phạm vi:** kết quả đo của một cơ quan nhà nước trên một sản phẩm cụ thể; con số 65 °C là nhiệt độ mà vi khuẩn nhiệt chịu được có thể nhân lên, theo ghi chú của cơ quan này.
- **Cách nói:** nếu sau này cần nhắc, nói "giữ ấm quá cao thì cơm khô và cứng, quá thấp thì vi khuẩn sinh sôi" — không nói một con số mà không ghi rõ nguồn của nó.

## Suy luận của tập phim / The film's own inferences (not research findings)

- **Nồi cơm điện không đo cơm; nó đo nước.** Từ mục 5, mục 8 và mục 9: cảm biến ở đáy nồi đọc **nhiệt độ đáy nồi**; nhiệt độ ấy bị ghim ở quanh một trăm độ chừng nào còn nước lỏng; khi nước cạn thì nhiệt độ ấy nhảy lên. Cơm chín là một hệ quả (mục 6, mục 7), không phải thứ được đo. Đây là câu trả lời của tập phim cho câu hỏi của tập.
- **Đổ nhiều nước hơn thì nồi phải chờ lâu hơn rồi mới báo chín.** Từ mục 5 và mục 8: càng nhiều nước lỏng trong nồi thì nền nhiệt độ kéo dài càng lâu, và cú nhảy lên xảy ra càng muộn. Đây là suy luận của tập phim từ cơ chế đã nêu; không có nguồn nào đo riêng điều này, và tập phim không đưa ra một con số phút nào cho nó.
- **Cùng một cơ chế, nên cũng có một đường cạn nữa.** Từ mục 9: nếu máy nhìn độ dốc của đường cong nhiệt độ thì một nồi đổ nhiều nước hơn sẽ cho một đường cong khác — và đó là lý do các nồi hiện đại lưu cả đường cong theo lượng gạo.
- **Các vị trí khác nhau trong nồi có nhiệt độ khác nhau.** Từ mục 5: trong một nồi đo thật, hai vị trí phía trên tụt về 95 °C trong khi các vị trí khác giữ 100 °C; nên "cơm chín" ở đáy và ở mặt không phải lúc nào cũng cùng lúc.

## Giá trị không được nói / Values this film must not show

- **không được nói "hồ hóa ở sáu mươi tám độ"** — 68,83 °C là nhiệt độ **đỉnh** trong một phép đo DSC trên tinh bột tách riêng, không phải ngưỡng hồ hóa; phải nói một dải (mục 6).
- **không được nói "cơm chín ở trăm lăm độ"** — không có phép đo nào công bố nhiệt độ lúc cơm chín; chỉ được nói nhiệt độ đáy nồi vượt lên trên một trăm độ (mục 8).
- **không được nói "nồi đo độ chín của cơm"** — nồi đo nhiệt độ đáy nồi, không đo tinh bột (mục 3, mục 9).
- **không được nói "logic mờ để biết cơm chín"** — bằng sáng chế dùng logic mờ để **điều khiển công suất** và so đường cong với đường cong lý tưởng; điểm kết thúc nấu vẫn là một ngưỡng, và không có nguồn nào nói logic mờ quyết định lúc cơm chín.
- **không được nói "nồi cơm đời đầu không có điện tử"** — các văn bản nói về **cơ cấu công tắc** (cơ chế lưỡng kim, công tắc nhiệt dưới nồi trong), chứ không dùng thẳng câu đó; hãy nói "dùng công tắc nhiệt cơ ở đáy nồi" (mục 4).
- **không được nói "mọi nồi cơm nấu cơm trắng trong bốn mươi phút"** — con số phút là thông số "xấp xỉ" của một hãng, phụ thuộc điện áp, nhiệt độ phòng, loại và lượng gạo (mục 10).
- **không được nói "giữ ấm ở chín mươi độ"** — con số đó là nhiệt độ **nước cơm** của một dạng nồi khác; dải đo được ở trong cơm là 67–78 °C (mục 10, mục 11).
- **Mọi thời gian nấu cụ thể** ("hai mươi lăm phút") — không có nguồn nào cho một thời gian nấu chung; hai mươi lăm phút là thông số của một vòng nấu trong một nồi cụ thể (mục 7).

## Nguồn / Sources

- Cục Dịch vụ và Điện lực, Chính phủ Hồng Kông (2026). The Hong Kong Voluntary Energy Efficiency Labelling Scheme for Electric Rice Cookers, mục 5.3 và 5.6. https://www.emsd.gov.hk/filemanager/en/content_358/VEELS_Rice%20Cookers%202026_01_eng%20(clean).pdf
- Cuckoo (không năm). Hướng dẫn sử dụng nồi cơm điện tử CR-0810F, bản tiếng Việt. https://cdn.tgdd.vn/Products/PDF/3/233686/HDSD/Huong-Dan-Su-Dung-(Tieng-Viet-Trang-3).pdf
- Dayou Winia Co., Ltd. (2017). Cooking method for electric rice cooker. WO Patent Application WO/2017/104900 A1. https://patents.google.com/patent/WO2017104900A1/en
- He, G. & Suzuki, H. (1987). The relationship between translucency of rice grain and gelatinization of starch in the grain during cooking. Journal of Nutritional Science and Vitaminology 33(4), 263–273. DOI: 10.3177/jnsv.33.263
- Hiệp hội Tiêu chuẩn Nhật Bản (2007). JIS C 9212 電気がま及び電子ジャー, điều 5.9, 5.9.1 và 5.9.2. https://kikakurui.com/c9/C9212-2007-01.html
- Komatsu, T. (1965). Plug-type automatic temperature control device for electrically powered rice cookers. US Patent 3,177,319, Tokyo Shibaura Electric Co., Ltd. https://patents.google.com/patent/US3177319A/en
- Kong, J.; Tao, J.; Fu, S.; Wen, Y.; Zhao, S.; Zhang, B. (2022). Corner coil heating mode improves the matrix uniformity of cooked rice in an induction heating cooker. Frontiers in Nutrition 9, 1038708. DOI: 10.3389/fnut.2022.1038708
- Ling, S. J.; Moebs, W. & Sanny, J. (2016). University Physics Volume 2, §1.5 Phase Changes. OpenStax, Rice University. https://openstax.org/books/university-physics-volume-2/pages/1-5-phase-changes
- Ma, C.-H. (1990). The control device of an electric rice cooker. GB Patent 2,229,831. https://patents.google.com/patent/GB2229831A/en
- Matsumoto, Y.; Aoshima, T. & Matsuo, K. (1984). Rice cooker-warmer. US Patent 4,455,480, Tokyo Shibaura Electric Co., Ltd. https://patents.google.com/patent/US4455480A/en
- Miwa, Y. (1982). Electric rice cooker. US Patent 4,315,138, Tokyo Shibaura Denki Kabushiki Kaisha. https://patents.google.com/patent/US4315138A/en
- Murata Manufacturing Co., Ltd. (2023). Product Search Data Sheet — NCP18XH103F03RB, NTC Chip Thermistor. https://media.distrelec.com/Web/Downloads/_t/ds/Murata_NCP18XH103F03RB_eng_tds.pdf
- Oota, H.; Aoshima, T.; Yamamori, K. & Narita, R. (1983). Electric rice cooker. US Patent 4,421,974, Tokyo Shibaura Denki Kabushiki Kaisha. https://patents.google.com/patent/US4421974A/en
- Oota, H.; Aoshima, T.; Narita, R. & Yamamori, K. (1984). Electric rice cooker. US Patent 4,431,906, Tokyo Shibaura Electric Co., Ltd. https://patents.google.com/patent/US4431906A/en
- Panasonic Home Appliance (Thailand) Co., Ltd. (2007). Service Manual: Automatic Rice Cooker SR-G06G/G10SG/G18SG, Order No. PHAT070801S3.
- Sano, Y.; Yamazaki, K.; Sasaki, H. & Hayakawa, S. (1970). Automatic electric rice cooker. US Patent 3,551,644, Matsushita Electric Industrial Co., Ltd. https://patents.google.com/patent/US3551644A/en
- Teng, B.; Zhang, C. & Wang, H. (2025). Impact of Partial Gelatinization on Structure, Physicochemical and Enzymatic Digestion Properties of Rice Starch Used for Rice Noodle-Making. Polymers 17(22), 3003. DOI: 10.3390/polym17223003
- Trung tâm Quốc gia về Sinh hoạt Người tiêu dùng, Nhật Bản (2018). 相談解決のためのテストから No.122 電気ジャー炊飯器での保温によりご飯から腐敗臭が発生, 14/06/2018. https://www.kokusen.go.jp/pdf/n-20180614_3.pdf
- Ủy ban Kỹ thuật điện Quốc tế (2024). IEC 63399:2024 Household and similar electrical rice cookers — Methods for measuring the performance. ISBN 978-2-8322-9796-4. https://webstore.iec.ch/publication/75344
- Wagner, W. & Pruß, A. (2002). The IAPWS Formulation 1995 for the Thermodynamic Properties of Ordinary Water Substance for General and Scientific Use. Journal of Physical and Chemical Reference Data 31(2), 387–535. DOI: 10.1063/1.1461829
- Wang, S.; Chen, C.; Xiang, F.; Zhang, X.; Wang, S. & Copeland, L. (2018). New insights into gelatinization mechanisms of cereal endosperm starches. Scientific Reports 8, 3011. DOI: 10.1038/s41598-018-21451-5
- White, D. R.; Hill, K.; del Campo, D. & Garcia Izquierdo, C. (2014). Guide on Secondary Thermometry: Thermistor Thermometry. BIPM, Consultative Committee for Thermometry. https://www.bipm.org/documents/20126/41773843/Guide-SecTh-Thermistor-Thermometry.pdf
- Xu, H.; Wei, G.; Chen, B.; Li, J.; Wang, L.-H.; Zeng, X.-A. & Sastry, S. K. (2026). Application of Pulsed Ohmic Heating for Rapid Cooking of Indica Rice: Quality Enhancement and Mechanistic Insights. Foods 15(15), 2742. DOI: 10.3390/foods15152742
- Bộ phận Năng lượng Tài nguyên và Nhiên liệu, Bộ Kinh tế Công nghiệp Nhật Bản (2005). 最終取りまとめ 電気炊飯器判断基準小委員会. https://www.enecho.meti.go.jp/category/saving_and_new/saving/enterprise/equipment/council/pdf/050613cooker.pdf
