# Facts — Vì sao điện thoại nóng lên khi sạc?

Mọi con số phim đưa lên màn hình đều có nguồn ở đây. Giọng kể đọc chúng; hình đặt chúng vào vật.
Không có gì lên màn hình mà file này không viết ra.

**Quy tắc của file này:** mỗi con số trên màn hình có nguồn ở đây, và một giá trị mà file này cấm thì **không được nói** trong phim.
Wikipedia không được dùng làm nguồn ở đây: mỗi mắt xích của câu trả lời phải đứng sau một nguồn sơ cấp — bài bình duyệt, sách chuyên ngành, datasheet của hãng, tiêu chuẩn, bằng sáng chế, hay tài liệu kỹ thuật của nhà sản xuất.

## 1. Chỗ nào có điện trở thì chỗ đó sinh nhiệt

> "In an electric circuit, electrical energy is continuously converted into other forms of energy. For example, when a current flows in a conductor, electrical energy is converted into thermal energy within the conductor. The electrical field, supplied by the voltage source, accelerates the free electrons, increasing their kinetic energy for a short time. This increased kinetic energy is converted into thermal energy through collisions with the ions of the lattice structure of the conductor."

> "With a resistor, the voltage drop across the resistor is dissipated as heat. Ohm's law states that the voltage across the resistor is equal to the current times the resistance, V = IR. The power dissipated by the resistor is therefore P = IV = I(IR) = I²R"

Ling, S. J.; Moebs, W.; Sanny, J. (2016), *University Physics Volume 2*, §9.5 "Electrical Energy and Power", OpenStax, Rice University (CC BY 4.0). DOI/URL: https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power

- **Dùng trong phim:** ý nền của cả tập: dòng điện đi qua chỗ nào có điện trở thì chỗ đó toả nhiệt. Không đưa công thức lên màn hình, không đọc công thức.
- **Phạm vi:** đây là luật vật lý nền, không nói về điện thoại. Nó không nói nhiệt sinh ra ở đâu trong máy, cũng không nói bao nhiêu; phần "bao nhiêu" là của các mục dưới.
- **Cách nói:** "dòng điện đi qua chỗ nào có điện trở thì chỗ đó nóng lên" — không nói "mọi dòng điện đều sinh nhiệt như nhau", và không nói "điện thoại nóng vì có dòng điện chạy qua nó" một cách chung chung.

## 2. Cục sạc lấy điện lưới và đưa vào điện thoại một dòng năm vôn

> "Power Input Voltage 100-240 V … Output Voltage (Max, Normal Charge) 5 V … Output Current (Max, Normal Charge) 3 A … Output Voltage (Max, Fast Charge) PDO : 9 V, 15 V, 20 V / PPS : 3.3-21.0 V"

Samsung Electronics Co., Ltd. (2024), *45W Power Adapter Black (EP-T4510)*, trang sản phẩm chính thức của hãng. DOI/URL: https://www.samsung.com/sa_en/mobile-accessories/45w-power-adapter-black-ep-t4510xbeggb/

- **Dùng trong phim:** nhãn **5 V** dán trên cổng sạc và trên tem của cục sạc; hình cắt cục sạc cho thấy nó lấy điện lưới ở một bên và đưa ra năm vôn một chiều ở bên kia. Khi sạc nhanh, cục sạc phải đưa ra điện áp cao hơn (9–20 V).
- **Phạm vi:** đây là thông số in trên **một** cục sạc cụ thể của hãng Samsung, không phải thông số chung của mọi cục sạc. Nó nói điện áp ra và dòng ra, **không** nói gì về hiệu suất.
- **Cách nói:** "cục sạc lấy điện từ ổ cắm rồi đưa vào máy một dòng điện một chiều năm vôn" — không nói "mọi cục sạc đều cho năm vôn", và không nói cục sạc này mất bao nhiêu phần trăm.

## 3. Bộ sạc tuyến tính: phần chênh lệch điện áp thành nhiệt ngay trong máy

> "To maintain that the system power dissipation remains within the limits of the device, the power dissipated by the device can be calculated using the following equation: PDISS = PSYS + PBAT Where: PSYS = (VIN – VSYS) × IIN PBAT = (VSYS – VBAT) × IBAT"

> "The die junction temperature, TJ, can be estimated based on the expected board performance using the following equation: TJ = TA + θJA × PDISS"

Texas Instruments (2023), *BQ25185 — 1-Cell, 1A Standalone Linear Battery Charger With Power Path, Factory Mode, and Battery Tracking VINDPM*, datasheet SLUSF65B (bản sửa đổi 08/2026). DOI/URL: https://www.ti.com/lit/ds/symlink/bq25185.pdf

- **Dùng trong phim:** công thức tổn hao của bộ sạc tuyến tính, và cách nhiệt ấy làm nóng cả con chip: **nhiệt = nhiệt độ môi trường + điện trở nhiệt × công suất tản nhiệt**. Trong bảng thông số của cùng tài liệu: điện trở nhiệt từ chân đến môi trường **68,3 °C/W**, và nhiệt độ điều khiển nhiệt điển hình của chip **100 °C**.
- **Phạm vi:** đây là tài liệu của một chip sạc **tuyến tính** một ô (dùng trong tai nghe, kính thông minh), không phải của điện thoại; công thức nói về bất kỳ bộ sạc tuyến tính nào. Giá trị 68,3 °C/W là của **một** vỏ chip đo theo chuẩn JEDEC, không phải của một con điện thoại.
- **Cách nói:** "bộ sạc tuyến tính giữ nguyên dòng, phần chênh lệch điện áp rơi thành nhiệt ngay trên chip" — không nói "mọi điện thoại dùng bộ sạc tuyến tính", và không đưa 68,3 °C/W lên màn hình.

## 4. Bộ sạc xung giữ được 96,5 phần trăm; phần mất đi cũng là nhiệt

> "Highly efficient — 96.5% efficient: 16V battery at 3A from 20V"

Texas Instruments (2020), *BQ25798 — 1 to 4-Cell, 5A Buck-Boost Battery Charger with Dual-Input Selector, MPPT for Solar Panels and Fast Backup Mode*, datasheet SLUSDV2C (bản sửa đổi 06/2026). DOI/URL: https://www.ti.com/lit/ds/symlink/bq25798.pdf

- **Dùng trong phim:** đồng hồ nhỏ đặt cạnh cuộn dây hiện **96,5 %**; giọng kể nói phần còn lại thành nhiệt trong bộ chuyển đổi đó.
- **Phạm vi:** đây là hiệu suất của **một** chip sạc xung cụ thể của Texas Instruments, tại **một** điểm làm việc (sạc một ô pin 16 V bằng dòng 3 A từ nguồn 20 V). Không phải hiệu suất của mọi bộ sạc xung, và không nói gì về bộ chuyển đổi điện lưới sang điện một chiều nằm trong cục sạc.
- **Cách nói:** "ngay cả một bộ chuyển đổi rất tốt cũng còn phần điện biến thành nhiệt" — không nói "bộ sạc trong điện thoại của bạn mất 3,5 phần trăm", không đọc con số 3,5 phần trăm.

## 5. Pin tự sinh nhiệt khi sạc, và nhiệt ấy lớn lên theo dòng sạc

> "The maximum heat generation rates are 10.61 mW, 22.07 mW, 54.43 mW, and 209.05 mW for these C-rates, respectively." (đo lúc sạc ở 30 °C, theo thứ tự 0,05C, 0,1C, 0,2C, 0,5C)

> "The Ohmic resistance (R1) is almost constant as a function of state of charge and discharge and dominates the irreversible heat generation process"

> "at lower C-rates, reversible heat generation is the predominant source of heat. This is because reversible heat is directly proportional to the entropy changes that occur during the electrochemical reactions … This effect becomes less significant as the C-rate increases. However, as the C-rate increases, the influence of irreversible heat production becomes more significant"

> "higher current rates lead to increased heat generation within the battery cells"

Maher, K.; Boumaiza, A.; Amin, R. (2024), "Understanding the heat generation mechanisms and the interplay between joule heat and entropy effects as a function of state of charge in lithium-ion batteries", *Journal of Power Sources* **623**, 235504. DOI: 10.1016/j.jpowsour.2024.235504 (bản toàn văn mở: https://www.osti.gov/pages/biblio/2474727)

Trong cùng tài liệu, bảng tổng nhiệt sinh ra trong **một lần sạc** của tế bào thật (tế bào tròn 18650 LG, 2,5 Ah, sạc theo kiểu dòng-điện áp tới 4,2 V): **23 J** ở 0,05C, 41 J ở 0,1C, 65 J ở 0,2C, **103 J** ở 0,5C.

- **Dùng trong phim:** hai con số **23 J** và **103 J** trên hai đồng hồ đo nhiệt của hai tế bào: một tế bào sạc chậm, một tế bào sạc nhanh hơn. Giọng kể nói nhiệt trong pin tăng mạnh khi dòng sạc tăng.
- **Phạm vi:** các phép đo này là của **tế bào tròn 18650**, không phải của túi pin trong điện thoại; đo ở 30 °C trên tế bào mới. "Nhiệt tăng theo dòng" là kết luận của tài liệu; còn cơ chế thì có hai phần: phần bất biến do điện trở nội (điện trở ohmic chiếm ưu thế) và phần thuận nghịch do đổi entropy của phản ứng điện hoá, phần thuận nghịch đáng kể ở tản thấp và có thể **hút nhiệt vào** ở một số đoạn.
- **Cách nói:** "trong pin có hai nguồn nhiệt: dòng điện phải vượt qua lớp vật liệu có điện trở, và bản thân phản ứng hoá học cũng kéo theo nhiệt" — không nói "pin nóng vì phản ứng hoá học", không đưa 209,05 mW lên màn hình, và không nói tế bào trong điện thoại sinh ra đúng bằng 23 J hay 103 J.

## 6. Pin nóng quá thì bộ sạc ngừng lại, và máy có bộ điều khiển nhiệt của riêng nó

> "VT3_RISE … Charge is suspended above this … As Percentage to REGN, JEITA_T3=45°C 45.6 46.1 46.6 %" (đối chiếu bảng điện trở nhiệt 103AT, tức ngưỡng nhiệt độ pin tương ứng khoảng 45 °C)

> "VT3_FALL … Charge is re-enabled below this … As Percentage to REGN, JEITA_T3=45°C 44.3 44.8 45.3 %"

Texas Instruments (2020), *BQ25798 — 1 to 4-Cell, 5A Buck-Boost Battery Charger…*, datasheet SLUSDV2C (bản sửa đổi 06/2026), mục "JEITA THERMISTOR COMPARATOR (CHARGE MODE)". DOI/URL: https://www.ti.com/lit/ds/symlink/bq25798.pdf

> "We observe that there is a significant increase in the temperature when we disable thermal throttling. The package temperature reaches 50 °C at the end of the run."

> "As expected, thermal throttling enables lower temperatures and keeps the maximum temperature below 40 °C."

Bhat, G.; Gumussoy, S.; Ogras, Y. (2019), "Power and Thermal Analysis of Commercial Mobile Platforms: Experiments and Case Studies", arXiv:1904.09814. DOI/URL: https://arxiv.org/abs/1904.09814

> "We measure battery temperatures as high as 40.8 °C. Such high battery temperatures further accelerates CPU and skin level heating due to thermal couplings between the battery and the other components"

Sahin, O.; Coskun, A. K. (2016), "Providing Sustainable Performance in Thermally Constrained Mobile Devices", *ACM Workshop on Embedded Systems for Augmented Reality (ESWEEK '16)*, DOI: 10.1145/2993452.2994309. DOI/URL: https://www.bu.edu/peaclab/files/2016/10/ESWEEK16_sahin.pdf

- **Dùng trong phim:** hai thứ cùng một mạch lưới: (1) khi pin nóng quá khoảng **45 °C** thì bộ sạc **ngừng sạc** — dòng hạt sáng vào pin đứt lại; (2) máy có **bộ điều khiển nhiệt** đo vùng chip và bóp chậm lại công việc của máy — phim cho thấy điều đó bằng nhiệt kế có kim và sóng xung nhịp bị bóp chậm, **không đặt 50 °C hay 40 °C lên màn hình**, vì hai số ấy đo lúc chạy app nặng chứ không phải lúc sạc; (3) pin cũng nóng theo, và nhiệt của pin làm nóng cả vỏ máy.
- **Phạm vi:** ngưỡng 45 °C là ngưỡng **JEITA** mà chip sạc trong datasheet này dùng, không phải ngưỡng chung của mọi điện thoại. Các phép đo 50 °C và 40 °C là trên **Nexus 6P** khi chạy app nặng (có nghịch vụ với trò chơi Paper.io), **không phải** khi sạc. Con số 40,8 °C là nhiệt độ **pin** đo được trên Nexus 5 khi chạy app, cũng không phải khi sạc.
- **Cách nói:** "máy có hai lớp chống nóng: một lớp giữ cho con chip không quá nóng, một lớp dừng sạc khi pin quá nóng" — không nói "điện thoại nóng tới 50 °C khi sạc", và không nói "mọi điện thoại dừng sạc ở 45 °C".

## 7. Bề mặt điện thoại người ta cầm nằm trong dải nhiệt độ da chịu được

> "… that are efficient and that maintain user comfort within human comfort levels (e.g., 34 °C-43 °C [11])."

Sahin, O.; Coskun, A. K. (2016), "Providing Sustainable Performance in Thermally Constrained Mobile Devices", *ESWEEK '16*. DOI: 10.1145/2993452.2994309

> "The rate of calendar degradation depends strongly on temperature and state of charge (SOC), with trends varying across cell types and chemistries."

> "This paper presents the capacity fade and resistance growth of various cells that underwent long-term calendar aging across a variety of storage temperatures and SOCs. The data reveal that commonly accepted laws for capacity fade do not apply across all cell types and operating conditions"

Lam, R.; et al. (2024), "A decade of insights: Delving into calendar aging trends and implications", *Joule* **8**(12). DOI: 10.1016/j.joule.2024.11.013. DOI/URL: https://pangea.stanford.edu/ERE/pdf/OnoriPDF/Journals/101.pdf

- **Dùng trong phim:** dải **34–43 °C** hiện trên vỏ máy như một dải màu, để thấy điện thoại ấm chứ không nóng; và ý "pin để ở nơi nóng thì già nhanh hơn", với hình hai tế bào pin: một ở nơi mát, một ở chỗ nóng, đồng hồ sức chứa của tế bào ở chỗ nóng tụt xuống.
- **Phạm vi:** dải 34–43 °C là dải **thoải mái cho da người**, không phải ngưỡng an toàn của điện thoại và không phải nhiệt độ đo được khi sạc. Tập dữ liệu 232 tế bào của tài liệu Joule là **pin để yên** (calendar aging), không phải pin vừa dùng vừa sạc; nó nói tốc độ già phụ thuộc mạnh vào nhiệt độ, không đưa ra một tỉ lệ mất dung lượng cụ thể, và còn nói rõ các quy luật thường dùng **không** đúng trong mọi trường hợp.
- **Cách nói:** "điện thoại ấm chứ không cháy" và "pin để ở nơi nóng thì già nhanh hơn" — không nói "pin mất bao nhiêu phần trăm mỗi năm", không đưa 232 tế bào lên màn hình.

## Suy luận của tập phim / The film's own inferences (not research findings)

- **0,8 W ở bộ sạc tuyến tính** là phép tính của chính tập phim từ công thức trong datasheet của TI: chênh lệch (5 − 4,2) V nhân dòng sạc 1 A. Tập nói rõ đây là phép tính từ công thức, không phải số đo một chiếc máy cụ thể.
- **Nhiệt trong máy phải đi ra qua vỏ**, và vỏ là đường thoát gần như duy nhất; đây là lý do nhiệt dồn lên khi công suất vào tăng. Tài liệu ESWEEK nói về liên kết nhiệt giữa pin và các bộ phận khác, nên tập nói nhiệt của pin làm nóng cả vỏ.
- **Sạc nhanh thì nhiệt trong pin nhiều hơn**: 103 J so với 23 J trong một lần sạc, theo bảng của tài liệu J. Power Sources.
- **Một chiếc điện thoại vừa sạc vừa chơi game nóng hơn**: hai nguồn nhiệt cùng đổ vào một vỏ máy. Tài liệu về bộ điều khiển nhiệt cho thấy vùng chip có thể tới 50 °C khi bộ điều khiển bị tắt — tập dùng điều đó làm **lý do** cần một bộ điều khiển nhiệt, nhưng **không đưa con số lên màn hình**, vì đó là phép đo khi chạy app nặng chứ không phải lúc sạc.

## Giá trị không được nói / Values this film must not show

- **"45 °C là ngưỡng nóng của mọi điện thoại"** — không được nói trong phim: 45 °C là ngưỡng JEITA của **một** chip sạc trong một datasheet; các hãng dùng ngưỡng khác. Được nói: "có những bộ sạc ngừng sạc khi pin vượt khoảng bốn mươi lăm độ".
- **"Điện thoại nóng tới 50 °C khi sạc"** — không được nói: 50 °C là nhiệt độ vùng chip khi chạy app nặng mà **tắt** bộ điều khiển nhiệt, đo trên Nexus 6P. Được nói: "nếu không có bộ điều khiển nhiệt, vùng chip có thể chạm năm mươi độ".
- **"Pin mất phần trăm dung lượng mỗi năm ở bốn mươi độ"** — không được nói: nguồn không đưa ra tỉ lệ cụ thể, và nói rõ các quy luật thường dùng không đúng trong mọi trường hợp. Được nói: "tốc độ già của pin phụ thuộc mạnh vào nhiệt độ".
- **"Cục sạc mất mười phần trăm điện"** — không được nói: không có nguồn sơ cấp cho con số này. Được nói: "ngay cả một bộ chuyển đổi rất tốt cũng còn phần điện biến thành nhiệt".
- **"Pin trong điện thoại sinh ra đúng 23 joule hay 103 joule"** — không được nói: hai con số đó đo trên tế bào tròn 18650, không phải túi pin điện thoại. Được nói: "trong một tế bào thật, sạc nhanh sinh ra nhiệt nhiều gấp bốn lần rưỡi so với sạc chậm".
- **"Điện thoại sạc một giờ là hỏng pin"** — không được nói: không có nguồn nào trong tệp này nói thế.

## Nguồn / Sources

- Ling, S. J.; Moebs, W.; Sanny, J. (2016). *University Physics Volume 2*, §9.5. OpenStax, Rice University. DOI/URL: https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power
- Samsung Electronics Co., Ltd. (2024). *45W Power Adapter Black (EP-T4510)*, trang sản phẩm. DOI/URL: https://www.samsung.com/sa_en/mobile-accessories/45w-power-adapter-black-ep-t4510xbeggb/
- Texas Instruments (2023). *BQ25185 — 1-Cell, 1A Standalone Linear Battery Charger*, datasheet SLUSF65B. DOI/URL: https://www.ti.com/lit/ds/symlink/bq25185.pdf
- Texas Instruments (2020). *BQ25798 — 1 to 4-Cell, 5A Buck-Boost Battery Charger*, datasheet SLUSDV2C. DOI/URL: https://www.ti.com/lit/ds/symlink/bq25798.pdf
- Maher, K.; Boumaiza, A.; Amin, R. (2024). Understanding the heat generation mechanisms and the interplay between joule heat and entropy effects as a function of state of charge in lithium-ion batteries. *Journal of Power Sources* **623**, 235504. DOI: 10.1016/j.jpowsour.2024.235504
- Bhat, G.; Gumussoy, S.; Ogras, Y. (2019). Power and Thermal Analysis of Commercial Mobile Platforms: Experiments and Case Studies. arXiv:1904.09814. DOI/URL: https://arxiv.org/abs/1904.09814
- Sahin, O.; Coskun, A. K. (2016). Providing Sustainable Performance in Thermally Constrained Mobile Devices. *ESWEEK '16*. DOI: 10.1145/2993452.2994309
- Lam, R.; et al. (2024). A decade of insights: Delving into calendar aging trends and implications. *Joule* **8**(12). DOI: 10.1016/j.joule.2024.11.013
