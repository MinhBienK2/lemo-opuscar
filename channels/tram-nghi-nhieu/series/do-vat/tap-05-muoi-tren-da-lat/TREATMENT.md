# Dàn ý — Tại sao rắc muối lên đá lạnh thì đá tan nhanh hơn?

## Độ dài

Năm khối của câu trả lời (hiện tượng và cách hiểu sai → điểm đóng băng → cơ chế quanh viên đá → tổng hợp và cái giới hạn → quay lại hiện tượng), bảng ý → hình có 25 dòng, dự kiến 25 câu lời kể, ước tính khoảng **hai phút hai mươi giây**. Không ngắn hơn được: bỏ mục "đo điểm đóng băng" thì mất con số; bỏ mục "vi mô trên bề mặt đá" thì câu trả lời dừng ở mức "nó làm điểm đóng băng hạ xuống", và người xem hỏi tiếp "sao hạ xuống"; bỏ mục "nhiệt khi tan" thì thiếu mắt xích thứ hai của cơ chế. Không dài hơn được: đã cố ý để ngoài độ tan của muối theo nhiệt độ (tập này không có nguồn cho nó), cũng để ngoài chuyện muối ăn hút ẩm và chuyện đường đá mùa đông.

Đây là **nhánh tập ngắn**: 25 dòng, khoảng 2:20, dưới ngưỡng tám phút mà STRATEGY nêu cho mốc chia chương, nên một chương, không cần `src/chapters.js`.

## Câu hỏi, tách ra

- Câu hỏi: Tại sao rắc muối lên đá lạnh thì đá tan nhanh hơn?
- Chủ thể: viên đá lạnh · Thay đổi: tan nhanh hơn khi được rắc muối · So với: một viên đá khác, cùng kích thước và cùng nhiệt độ, không rắc muối · Vì: muối hạ điểm đóng băng của nước quanh đá xuống dưới 0 °C, và khi tan nó lấy thêm nhiệt từ chính lớp nước đó.
- **Câu trả lời một câu**: Viên đá tan nhanh hơn vì muối hạ điểm đóng băng của nước quanh nó xuống dưới không độ, và khi tan, muối lấy thêm nhiệt từ chính lớp nước quanh đá.
- Dòng 3 của bảng ý → hình là **chính câu hỏi của tập phim**, nói ra trước khi vào thí nghiệm.

## Mở và kết

- Khung mở: khay inox sâu đặt trên mặt bàn bếp cạnh vòi; tay bóp một nhúm muối rắc lên viên đá; hạt muối rơi, đá bắt đầu rỉ nước, vũng nước lan ra. Ngay cạnh đó là **một viên đá khác, cùng kích thước và cùng nhiệt độ, không rắc muối**, vẫn còn nguyên. Ở hậu cảnh: hộp đá (để biết viên đá vốn ở dưới 0 °C), túi muối và chiếc búa đặt yên. Người xem thấy ngay hiện tượng quen thuộc ở nơi quen thuộc, và thấy luôn viên đá đối chứng.
- Kết: quay lại đúng cái khay inox ấy, ánh sáng chiều như khung mở; viên đã rắc muối chỉ còn một vũng nước muối loãng, bên cạnh là chiếc búa đặt yên từ đầu phim. Người xem mang về: muối **không đập vỡ đá** và cũng **không làm đá nóng lên** — nó chỉ biến lớp nước quanh viên đá thành nước muối, và chính nước muối đó làm đá tan nhanh hơn (hai cơ chế đã kể ở dòng 19); đó cũng là lý do người ta làm kem tuyết ở nhà bằng đá và muối.

## Nơi chốn

Có **hai nơi chốn**, đi vào **năm khối**: bếp (dòng 1–7) → bàn thí nghiệm (8–9) → bếp (10–18) → bàn thí nghiệm (19–22) → bếp (23–25). Lớp vi mô nằm ở bếp, quanh đúng viên đá của khung mở (dòng 10–18). **Không vật nào đổi chỗ:** viên đá và viên đá đối chứng nằm trong khay inox ở bếp suốt phim; bộ đo ở bếp (hai ly, hai que nhiệt kế, que khuấy) nằm ở bếp; bộ đo ở bàn thí nghiệm (bể đá muối, **bốn** bình thuỷ tinh, ba que nhiệt kế, que khuấy, bát muối) nằm ở bàn thí nghiệm.

| Nơi | Tầng của câu trả lời | Bộ có sẵn / tự dựng | Máy vào và ra thế nào |
|---|---|---|---|
| Bàn bếp, khay inox (dòng 1–7) | Hiện tượng đời thực: tay rắc muối, đá tan, đá đối chứng không tan; cách hiểu sai phải gỡ bỏ; bộ đo nhiệt ở bếp | Bộ `kitchen` của `rig/sets.js`; khay inox, hai viên đá, búa, hộp đá, túi muối tự dựng | Mở khung ở thấp ngang mặt khay; ra bằng một lần chuyển cảnh bằng loé sáng sang bàn thí nghiệm |
| Bàn thí nghiệm, bể đá muối (dòng 8–9) | Hóa học: điểm đóng băng của nước sạch và của nước muối mười phần trăm | Bộ `desk` của `rig/sets.js`; bể đá muối, bình thuỷ tinh, nhiệt kế, que khuấy tự dựng | Máy ở thấp ngang bàn; ra bằng loé sáng về bếp |
| Bàn bếp, vũng nước quanh viên đá và mặt đá ở cận cảnh nano (dòng 10–18) | Cơ chế vi mô: ion của muối chen vào bề mặt đá và làm phân tử nước khó bám vào; nhiệt lấy từ lớp nước | Tự dựng: mặt phẳng tinh thể, hạt phân tử nước, cầu ion; dùng `fxLayer()` và `flow()` của `rig/fx.js` | Máy hạ xuống sát vũng nước trong khay, rồi chui vào mặt đá; ra bằng loé sáng sang bàn thí nghiệm |
| Bàn thí nghiệm, bể đá muối (dòng 19–22) | Tổng hợp hai cơ chế, rồi cái giới hạn: điểm đóng băng thấp nhất và muối hai nước mọc trong bình đậm | Bộ `desk` của `rig/sets.js`, bể, ba bình, ba que nhiệt kế tự dựng | Máy ở góc cao nhìn xuống miệng bình; ra bằng loé sáng về bếp |
| Bàn bếp, khay inox (dòng 23–25) | Quay lại hiện tượng: kem tuyết ở nhà, và câu chốt | Bộ `kitchen` của `rig/sets.js`; bát toàn đá, túi zip sữa tự dựng | Máy lùi chậm ra xa, khép lại đúng cái mở đầu |

## Vật lên hình

| Vật (và trạng thái) | Bộ phận đặc trưng | Từ rig hay tự dựng |
|---|---|---|
| Khay inox sâu (đặt trên mặt bàn cạnh vòi) | Thành khay, mép khay, lớp nước đọng quanh đá | Tự dựng bằng `rbox()` |
| Viên đá có muối (nguyên → rỉ nước → nhỏ lại → tan hết) | Mặt băng vỡ, cạnh trong mờ, lớp nước bám quanh | Tự dựng bằng `rbox()` + texture băng |
| Viên đá đối chứng (không rắc muối) | Cùng kiểu đá, cùng kích thước, mặt còn tròn, chỉ rỉ ít nước | Tự dựng |
| Hộp đá (hậu cảnh khung mở; để biết viên đá vốn ở dưới 0 °C) | Thành hộp, đá vỡ bên trong | Tự dựng |
| Tay người (rắc muối, rửa muối, khuấy vào ly, đặt túi muối xuống, đặt bát muối xuống cạnh bể) | Bàn tay, ngón tay, cổ tay | `buildHand()` của `rig/fx.js` |
| Hộp muối và túi muối ở bếp (rắc ra, đặt xuống) | Nắp có lỗ, miệng túi, hạt muối | Tự dựng |
| Chiếc búa sắt (đặt trên mặt bàn từ khung mở, không ai cầm) | Đầu búa, cạnh, vết muối bám | Tự dựng |
| **Bộ đo ở bếp**: hai ly thuỷ tinh nhỏ (một nước sạch, một nước muối) và hai que nhiệt kế | Thành ly, mức nước, que thủy tinh, cột đỏ | Tự dựng |
| **Bộ đo ở bàn thí nghiệm**: bể đá muối; bốn bình thuỷ tinh **xếp thành hàng chéo** trong bể (mỗi bình lệch cả sang phải và ra sau, để máy quay đi vào được một bình mà không có bình kia chồng lên) — một bình nước sạch đã có lớp băng mỏng ở mặt (dòng 8), bình nước muối mười phần trăm có thẻ chữ 10 % (dòng 9, cũng chính là bình loãng ở dòng 20), một bình nửa đặc, một bình đậm; ba que nhiệt kế ở bàn thí nghiệm; que khuấy; tô muối tròn | Thành bể, đá vỡ và muối trộn trong bể; thành bình; lớp băng bám mặt bình nước sạch; cột đỏ; vòng khuấy | Tự dựng bằng `rbox()` và `mesh()` |
| Que nhiệt kế (cột đỏ trượt so với vạch không độ; không ghi chữ số trên que) — hai que ở bếp, ba que ở bàn thí nghiệm, và một que cắm trong vũng nước quanh viên đá | Que thủy tinh, cột đỏ, bầu nhọn, một vạch kẻ ở mốc không độ | Tự dựng |
| Mảnh đá nhỏ trong vũng nước (rã dần) | Cạnh mòn, nhỏ dần theo thời gian | Tự dựng |
| Bát toàn đá có muối trộn quanh túi (dòng 24) | Thành bát, đá vỡ, lớp muối trắng, túi zip | Tự dựng |
| Tinh thể muối hai nước mọc trong bình đậm | Tinh thể trong suốt dạng lăng trụ và mảnh, xếp chồng | Tự dựng bằng `mesh()` |
| Thẻ chữ "nước sạch", "10 %" và "-21 °C" | Mảnh giấy dán, chữ in | Thẻ chữ của `rig/render.js` |
| Túi zip có sữa (đông dần trong đá muối) | Túi nhựa trong suốt, sữa đặc bên trong, khóa zip | Tự dựng |
| Mặt đá ở cấp nano | Mặt phẳng tinh thể có lưới phân tử, lớp giao diện | Tự dựng |
| Phân tử nước (hạt trắng bay tới và dính) | Hạt nhỏ, vệt kéo khi bay | `fxLayer()` của `rig/fx.js` |
| Ion Na⁺ (cầu tím) và Cl⁻ (cầu xanh) | Cầu, dấu điện tích, quỹ đạo | Tự dựng bằng `mesh()` |
| **Que khuấy ở bếp** (dòng 6) — cầm bởi tay thòi xuống từ trên khung, khuấy trong ly nước muối | Thân que thuỷ tinh, đầu làm tròn, vòng quay quanh trục | Tự dựng bằng `rbox()` + `mesh()` |
| **Vệt muối trong ly nước muối ở bếp** (dòng 6) — tan dần khi que khuấy quay | Vệt trắng lắng trên nền nước, mép vệt nhòe dần | `saltPatch()` của `src/props.js` |
| **Tô muối tròn + dòng lượn nhiệt ở bàn thí nghiệm** (dòng 19) — tô muối đang tan, đống muối trong tô xẹp dần, dòng lượn nhiệt chạy từ trên vào tô, tay bám vào mép tô | Thành tô tròn, đống muối trắng lấp khoảng hai phần ba mặt tô, vệt lượn uốn lượn | Tô: tự dựng bằng `mesh()`; dòng lượn: `squiggle()` của `rig/fx.js` |
| **Vệt muối tan trên mặt đá ở cấp nano** (dòng 14) — tan dần khi lớp nước mỏng đi | Các hạt muối nhỏ nằm trên mặt phẳng, độ đục giảm dần | `saltPatch()` của `src/props.js` (có hạt to trên mặt) |

## Thứ vô hình

- **Phân tử nước bay tới mặt đá và bị ion chặn**: mọc từ lớp nước quanh đá, bay tới mặt đá, dính vào chỗ trống; ion Cl⁻ nằm sâu dưới mặt đá chặn nhiều hạt trắng ở chỗ đó; hạt bị đẩy ra thành dòng nhỏ chạy ngược. Kết quả nhìn thấy được: lớp nước trên mặt đá mỏng đi.
- **Các ion lơ lửng trong nước quanh đá**: mỗi hạt muối tan ra thành hai ion, trôi lơ lổi giữa các phân tử nước. Kết quả nhìn thấy được: mặt nước quanh đá trong dần, và nhiệt kế cạnh đá đứng **vừa dưới** không độ mà vẫn chưa có băng.
- **Nhiệt chạy ra khi muối tan**: dòng nhiệt (vệt lượn) chạy từ lớp nước quanh đá vào các hạt muối đang tan; chỗ hút nhiệt thì nước tụt nhiệt độ. Kết quả nhìn thấy được: cột đỏ trong nhiệt kế trượt xuống.
- **Nước đóng băng thành lưới tinh thể**: các hạt nước trên mặt viên đá đối chứng (không rắc muối) chuyển từ trạng thái rời rạc sang xếp hàng thành lưới khi nhiệt độ xuống không độ. Kết quả nhìn thấy được: giọt nước trên mặt đá đục dần thành lưới mờ.

## 3 khung hero

1. **Tay rắc muối lên viên đá trong khay inox**: điểm nhìn thấp, ngang mặt khay; nguồn sáng ấm từ cửa sổ chiều bên trái, đổ bóng dài sang phải; ba lớp sâu: mép khay inox cắt ngang khung ở tiền cảnh, viên đá và bàn tay ở trung cảnh, hộp đá, túi muối và chiếc búa đặt yên ở hậu cảnh; màu nhấn là trắng của hạt muối trên nền xanh lạnh của băng.
2. **Mặt đá ở cận cảnh**: điểm nhìn áp sát mặt đá, mặt đá sáng viền từ phía sau như kính; ba lớp sâu: các hạt nước trắng ở tiền cảnh, lưới tinh thể ở trung cảnh, lớp ion xanh và tím ở hậu cảnh; màu nhấn là cyan của ion clorua.
3. **"À ra thế" — bình nước muối đậm trong bể đá muối**: điểm nhìn từ trên xuống qua miệng bình, máy đứng trong bể nên vành thép không cắt ngang khung; nguồn sáng trắng lạnh từ đèn bàn phía trên; ba lớp sâu: mép bình và que nhiệt kế ở tiền cảnh, mặt nước vẫn trong veo ở trung cảnh, bình loãng đã đóng băng mờ ở hậu cảnh; cột đỏ **đã xuống dưới mốc không độ, không nằm sát mốc không độ**, đầu cột dừng ngay trên một vạch màu khắc trên que, và mốc dừng là −21 °C; màu nhấn là đỏ của cột thủy nghiệm.

## Bảng ý → hình

| # | Ý | Trên màn hình thấy gì | Vật nào làm gì | Nơi |
|---|---|---|---|---|
| 1 | Rắc muối lên đá thì đá tan nhanh hơn hẳn | Khay inox trên bàn bếp có hai viên đá cùng kích thước; bàn tay bóp một nhúm muối rắc lên viên đá bên trái; hạt muối rơi xuống đá, đá rỉ nước, vũng lan ra; viên bên phải còn nguyên. Ở hậu cảnh: hộp đá, túi muối, chiếc búa đặt yên | Tay bóp muối, hạt muối rơi, đá bắt đầu rỉ | Bếp, khay inox |
| 2 | Một viên đá khác, cùng kích thước và cùng nhiệt độ, không rắc muối, thì vẫn còn nguyên | Khung cận hai viên đá cạnh nhau trong khay: một đã rỉ nước và nhỏ lại, một còn nguyên; giữa chúng một vệt muối rơi vương | Đá không muối đứng yên, đá có muối thấp dần | Bếp, khay inox |
| 3 | Câu hỏi của tập phim, rồi vào thí nghiệm | Máy lùi ra cho thấy cả khay, cả hai viên đá, cả hộp đá; bàn tay rửa muối, muối rơi rơt xuống mép khay | Tay rửa muối, hạt muối rơi xuống mép khay | Bếp, khay inox |
| 4 | Cách hiểu thường gặp: muối phá vỡ tinh thể đá như búa, hoặc làm đá nóng lên (ý thứ hai được trả lời ở dòng 6) | Chiếc búa sắt đặt trên mặt bàn cạnh viên đá, không ai cầm; cạnh búa có vết muối bám | Búa nằm yên, hạt muối bám trên cạnh búa | Bếp |
| 5 | Nhưng viên đá không vỡ ra mảnh nào, vẫn là một khối nguyên vẹn mà đang tan | Cận mặt đá đang rỉ nước: khối đá vẫn nguyên, không nứt; lớp nước chảy thành dòng nhỏ | Đá rỉ nước, dòng nước chảy xuống mép đá | Bếp, khay inox |
| 6 | Muối tan không làm đá nóng lên | Ở bếp: một ly nước sạch, một ly nước muối, mỗi ly một que nhiệt kế; tay thòi xuống từ trên khung cầm que khuấy trong ly nước muối; vệt muối trong ly tan dần; cột đỏ trong ly nước muối thấp hơn cột đỏ trong ly nước sạch | Tay khuấy quay que, vệt muối tan, cột đỏ trong nhiệt kế nước muối trượt xuống | Bếp, bộ đo của bếp |
| 7 | Cái thay đổi không phải nhiệt độ của đá, mà là điểm đóng băng của nước quanh đá | Giọt nước trên mặt **viên đá đối chứng, không rắc muối** dần đục thành lưới tinh thể mờ | Giọt nước đục dần thành lưới | Bếp, cận |
| 8 | Nước sạch thì đông cứng ở không độ | Ở bàn thí nghiệm: một bể làm lạnh — tô inox rộng, đá vỡ trộn muối; trong bể **bốn** bình thuỷ tinh xếp thành hàng chéo, bình nước sạch đã có một lớp băng mỏng ở mặt và có thẻ chữ "nước sạch" đứng cạnh miệng bình, bình nước muối thì trong veo | Lớp băng mọc trên mặt bình nước sạch | Bàn thí nghiệm, bể đá muối |
| 9 | Nước muối mười phần trăm thì điểm đông thấp hơn, khoảng sáu phần sáu độ dưới không | Bình thuỷ tinh có nước muối mười phần trăm, đặt trong bể đá muối; thẻ chữ 10 % trên thành bình; que khuấy cầm tay và que nhiệt kế cắm trong đó; cột đỏ trượt xuống dưới mốc không độ rồi dừng ở khoảng sáu phần sáu độ dưới không; lớp băng đầu mọc ở thành bình | Tay khuấy quay que, cột nhiệt kế trượt xuống rồi dừng | Bàn thí nghiệm, bể đá muối |
| 10 | Nước quanh viên đá đã là nước muối | Quay lại khay inox ở bếp: vũng nước nhỏ quanh viên đá, vệt muối trắng tan hết, mặt nước trong và đều; một que nhiệt kế cắm cạnh đá, cột đỏ đứng **vừa dưới** không độ mà vẫn chưa đóng băng | Vệt muối tan, mặt nước trong, cột nhiệt kế đứng vừa dưới không độ | Bếp, vũng nước quanh viên đá |
| 11 | Muối tan ra thành hai ion, nên trong nước có nhiều hạt hơn, và điểm đóng băng tụt xuống | Cận cảnh trong vũng nước quanh viên đá: các ion lơ lửng, cầu tím và cầu xanh, trôi lơ lổi giữa các phân tử nước | Ion trôi lơ lổi, va chạm nhẹ | Bếp, vũng nước, macro |
| 12 | Chính vì lớp nước đó là nước muối, nó không đóng băng ở không độ. Nên viên đá ở dưới không độ vẫn tan được | Góc rộng bên trong vũng nước: một mảnh đá nhỏ rã dần trong vũng nước không đóng băng | Mảnh đá nhỏ dần | Bếp, trong vũng nước |
| 13 | Giờ ghé sát vào bề mặt viên đá, chỗ đá thật sự tan ra | Máy chui xuống vũng nước quanh viên đá, tiến sát mặt đá; mặt đá hiện ra dưới nước | Mặt đá sáng lên dưới lớp nước | Bếp, vào trong đá |
| 14 | Một phân tử nước bám vào mặt đá, làm lớp nước quanh đá dày thêm | Cận cảnh mặt đá: hạt trắng bay tới và dính vào mặt phẳng băng | Hạt trắng bay tới, dính vào mặt đá | Mặt đá, macro |
| 15 | Nhưng ion clorua đã chen sâu vào mặt đá, đúng chỗ phân tử nước định bám | Các cầu xanh nằm sâu dưới mặt đá, cầu tím ở sát trên; hạt trắng tới nơi thì bị cầu xanh chặn | Cầu xanh chìm sâu hơn cầu tím, hạt trắng bị đẩy ra | Mặt đá, macro |
| 16 | Nên nhiều phân tử nước khó bám được, lớp nước trên mặt đá mỏng đi | Lớp nước trên mặt đá lúc đầu dày và sáng, sau đó mỏng đi, các vệt nước nhỏ lại | Lớp nước mỏng đi, vệt nước co lại | Mặt đá, macro |
| 17 | Thêm nữa, khi muối tan ở đó, nó lấy nhiệt từ chính lớp nước quanh đá | Hạt muối rơi xuống vũng nước và vỡ ra; dòng nhiệt lượn chạy từ nước vào các hạt đang tan | Hạt muối vỡ, dòng nhiệt bị hút vào | Bếp, vũng nước |
| 18 | Nước quanh đá nguội đi, nên viên đá tan nhanh hơn | Nhiệt kế cắm trong vũng nước: cột đỏ trượt xuống thêm một chút, đứng gần vạch không độ; mặt nước vẫn không đóng băng | Cột nhiệt kế trượt xuống thêm một chút, thấp hơn ở dòng 10 nhưng vẫn còn ngay dưới vạch không độ | Bếp, vũng nước |
| 19 | Vậy là hai cơ chế cộng lại: hạ điểm đóng băng, và lấy thêm nhiệt khi tan | Một khung cận: tô muối tròn đang tan — đống muối trong tô xẹp dần — với dòng lượn nhiệt chạy từ trên vào tô; tay bám vào mép tô | Đống muối xẹp dần, dòng lượn chạy vào tô | Bàn thí nghiệm |
| 20 | Muối đậm hơn thì điểm đóng băng của nước muối thấp hơn nữa | Ba bình trong bể đá muối nhìn thẳng hàng chéo: bình loãng (đúng bình 10 % đã đo ở dòng 9) đóng băng từ thành vào, lớp băng dày dần; bình nửa đặc đóng băng sau; bình đậm vẫn trong veo, chỉ có nhiệt kế tụt sâu hơn. Ba bình phân biệt bằng mức nước khác nhau | Bình loãng đóng băng từ thành vào, bình đậm vẫn trong veo, nhiệt kế tụt sâu hơn | Bàn thí nghiệm, bể đá muối |
| 21 | Tới khoảng hai mươi mốt độ dưới không thì nó dừng lại | Trong bình đậm: que nhiệt kế chỉ xuống dưới mốc không độ rồi dừng ở mốc −21 °C, và **một vạch màu trên que đúng ngay dưới đầu cột**; thẻ chữ "-21 °C" đứng cạnh mép bình; bình vẫn trong veo | Cột đỏ dừng dưới mốc không độ, ngay trên vạch mốc | Bàn thí nghiệm, bể đá muối |
| 22 | Dưới mốc đó, muối tách ra thành muối hai nước, và nước muối trở lại mốc đông của nó | Cận cảnh đáy và thành bình đậm: tinh thể muối hai nước trong suốt dạng lăng trụ và mảnh mọc lên, xếp chồng lên nhau | Các tinh thể muối mọc lên và đầy dần | Bàn thí nghiệm |
| 23 | Quay lại bếp: muối trong hộp đã cạn, túi muối được đặt xuống, ánh sáng đã ngả sang chiều | Quay lại khay inox ở bếp: hộp muối đã cạn, túi muối được đặt xuống cạnh khay, trên mặt bàn còn vệt nước ướt, ánh sáng đã nghiêng sang chiều | Túi muối đặt xuống bàn | Bếp |
| 24 | Và cũng vì thế mà người ta làm kem tuyết ở nhà bằng đá và muối | Trên bàn bếp, một túi zip có sữa đặt trong bát toàn đá, muối trộn vào đá quanh túi; sữa trong túi cứng dần | Đá tan, sữa trong túi đông lại | Bếp |
| 25 | Muối không đập vỡ đá, cũng không làm đá nóng lên. Nó chỉ biến lớp nước quanh viên đá thành nước muối | Quay lại khay inox, ánh sáng chiều như khung mở; trên mặt khay là vũng nước muối loãng, bên cạnh là chiếc búa đặt yên từ đầu phim | Búa đặt yên, vũng nước loãng lan rộng | Bếp, khay inox |

## Chương

Một chương. Dàn ý dài 25 dòng, dưới ngưỡng ba mươi câu, nên không chia chương và không cần `src/chapters.js`. Các khoảng dòng của tầng bám theo đúng khối nơi chốn.

| Chương | Tầng của câu trả lời (theo khối nơi chốn) | Nơi | Các dòng của bảng |
|---|---|---|---|
| 1 | Hiện tượng và cách hiểu sai (1–7) · Điểm đóng băng (8–9) · Cơ chế quanh viên đá (10–18) · Tổng hợp và cái giới hạn (19–22) · Quay lại hiện tượng (23–25) | Bếp (1–7) → Bàn thí nghiệm (8–9) → Bếp (10–18) → Bàn thí nghiệm (19–22) → Bếp (23–25) | 1–25 |

## Shot list

Các thời điểm dưới đây là thời điểm **thật**, đo từ giọng đọc đã dựng (`voice/dur.json` + `src/timeline.js`). Mỗi câu lời kể là **một** nhát quay; máy không cắt mù giữa các nhát.

| Thời điểm | Cảnh | Máy | Vì sao |
|---|---|---|---|
| 0:02 | Bếp, thấp ngang khay inox, tay rắc muối lên viên đá; viên đá đối chứng, chiếc búa và que nhiệt kế cùng trong khung | Máy **đứng yên** (`d = [0,0,0]`), chỉ có tay và hạt muối chuyển động | Người xem phải thấy hiện tượng trong ba giây đầu, không phải nghe kể |
| 0:06 | Bếp, khung cận hai viên đá | Máy trượt **ngang** sang phải 5,5 cm | Đối chứng phải vào khung cùng lúc, không bằng lời |
| 0:12 | Bếp, máy lùi ra cho thấy cả khay | Máy **lùi** | Câu hỏi phải có một khung rộng để người xem định vị được cả bàn |
| 0:17 | Bếp, cận chiếc búa nằm giữa hai viên đá trong khay | Máy **hạ xuống** 1,2 cm về phía búa | Cách hiểu sai phải thấy được thành cái sai, không chỉ được nói — trong khung phải có cả búa lẫn đá |
| 0:21 | Bếp, cận mặt đá đang rỉ nước | Máy áp sát mặt đá rồi trượt dọc theo dòng nước nhỏ | "Không có vỡ nứt" phải là hình, không phải lời |
| 0:25 | Bếp, hai ly và hai que nhiệt kế; tay cầm que khuấy trong ly nước muối | Máy đứng xa đủ để cả hai cột đỏ cùng đọc được | Chứng minh bằng vật đo, không bằng câu nói; phải thấy muối đang tan |
| 0:27 | Bếp, giọt nước trên viên đá đối chứng đông dần | Máy **đi theo giọt nước lên trên** 2,8 cm | Dẫn từ cái thấy được sang cái vô hình |
| 0:31 | Bàn thí nghiệm, toàn cảnh bể đá muối với bốn bình xếp hàng chéo, rồi đi vào bình nước sạch (từ **bên trái** hàng, nên ba bình kia nằm sau bình nước sạch) | Máy **mở rộng rồi đi vào** (34° → 21°) | Chuyển nơi chốn bằng một khung rộng, và bằng chứng phải đọc được ngay trong chính nhát này |
| 0:34 | Bàn thí nghiệm, bình nước muối mười phần trăm trong bể, que khuấy cầm tay (cánh tay chạy ra ngoài khung bên phải) | Máy đứng xa, tay thòi xuống từ trên khung | Nhiệt độ đọc được phải có vật mang nó, và thẻ "10 %" phải đứng cạnh bình nó nói |
| 0:38 | Bếp, vũng nước quanh viên đá, vệt muối tan, que nhiệt kế | Máy quay lại **cùng trục** với khung mở | Lớp nước quanh đá phải thấy rõ là nước muối, và không mất sợi không gian về cái khay |
| 0:43 | Bếp, vũng nước, macro: các ion lơ lửng | Máy **hạ xuống** sát mặt nước rồi trượt ngang | Đi vào bên trong là thế mạnh của kênh, và cần cho cơ chế |
| 0:48 | Bếp, vũng nước, góc rộng: mảnh đá nhỏ dần | Máy **lùi** | Quay lại cỡ nhìn đã biết |
| 0:55 | Mặt đá ở cấp nano: mặt phẳng tinh thể, phân tử nước bay tới | Máy nhìn **xuống** mặt đá, tiến sát | Chuyển từ cỡ bình sang cỡ phân tử phải đi qua một đường thật |
| 0:59 | Mặt đá, cận: hạt nước bay tới và dính, lớp nước đục thêm | Máy áp sát mặt đá | Cho thấy hạt nước bám thế nào trước khi nói ion chặn |
| 1:03 | Mặt đá: cầu ion mọc lên ngay tại mặt đá | Máy **lùi**; khung rộng hơn c14 khoảng 1,8 lần | Cơ chế phải có chiều sâu, không phải sơ đồ |
| 1:08 | Mặt đá, lớp nước mỏng đi | Máy **nâng lên** 1,6 cm nhìn xuống lớp nước | Thấy trước và sau trong cùng một khung |
| 1:11 | Bếp, vũng nước, hạt muối tan và dòng nhiệt | Máy **nằm ngang** ở độ cao mặt nước: hạt muối ở dưới khung, mặt nước lấp loáng ở trên khung, dải nhiệt chạy từ hạt lên mặt nước | Nhiệt là thứ vô hình, phải thành vật thể có vật lý |
| 1:16 | Bếp, nhiệt kế trong vũng nước tụt xuống | Máy **cùng trục với c10**, siết gần hơn | Cột đỏ phải thấp hơn ở c10 nhưng vẫn còn ngay dưới vạch không độ |
| 1:19 | Bàn thí nghiệm, tô muối tròn đang tan với dòng lượn nhiệt, tay bám mép tô | Máy đi vào tô (26°) | Cơ chế thứ hai phải là một vật đang tan, không phải một lời |
| 1:25 | Bàn thí nghiệm, ba bình trong bể đá muối nhìn thẳng hàng chéo | Máy trượt dọc ba bình | Độ đậm phải thấy bằng mắt: ba cột đỏ trong một khung |
| 1:29 | Bàn thí nghiệm, nhìn qua miệng bình đậm xuống cột đỏ dừng ở mốc −21 °C | Máy đứng **trong bể** (trên đống đá) để vành bể không cắt ngang khung | Con số phải có vật mang nó, và cột đỏ phải ở dưới mốc không độ |
| 1:31 | Bàn thí nghiệm, cận cảnh tinh thể muối hai nước ở đáy bình đậm | Máy ghép cận các tinh thể | Cái giới hạn phải thấy được, không chỉ được nói |
| 1:36 | Bếp buổi chiều, quay lại quầy: hộp muối cạn, túi muối được đặt xuống | Máy **lùi**; ánh sáng đổi màu và hướng | Quay lại nơi chốn đã mở, và báo rằng đã lâu rồi |
| 1:42 | Bếp, túi zip có sữa đặt trong bát toàn đá | Máy đi xuống bát đá | Đời thường dùng cái cơ chế này để làm gì; vỏ sương trên túi phải mọc dần |
| 1:47 | Bếp, khay inox ánh sáng chiều, vũng nước muối loãng, chiếc búa đặt yên | Máy **lùi chậm** ra xa | Câu kết phải khép lại đúng cái mở đầu |
