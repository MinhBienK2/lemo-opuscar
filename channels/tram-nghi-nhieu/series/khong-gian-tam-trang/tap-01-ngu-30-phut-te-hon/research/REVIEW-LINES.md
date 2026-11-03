# Chấm lời — Tập 01 "Ngủ 30 phút tệ hơn không ngủ?"

Nguồn đối chiếu: `research/FACTS.md` (bản trong thư mục tập) và `voice/lines.json` (42 câu).
Không sửa gì trong hai file này; báo cáo chỉ là danh sách lỗi + câu sửa đề xuất.

## Kết luận

Lời hiện tại **không vi phạm danh sách giá trị cấm** của FACTS (không có "45 phút", "90 phút", "200 mg", "90 phần trăm", "1 giờ", "15 phút", "40 giờ") và các con số chính — 10/20/30/35 phút, 14,7 phút, 0,8 phút, 80 phần trăm, 6 giờ, 14 đêm, 2 đêm — đều có nguồn. Tuy nhiên còn **2 lỗi sự thật phải sửa** (địa danh "Adelaide" không có trong FACTS; cách đọc "mười bốn phút bảy" nghe thành 14 phút 42 giây) và **1 lỗi diễn đạt quá mức** ("Dưới ba mươi phút là ngưỡng an toàn" — FACTS §6 cấm đúng kiểu khẳng định này). Vấn đề lớn nhất không nằm ở số mà nằm ở **cơ chế**: kịch bản trộn hai thí nghiệm khác nhau (buổi chiều 24 người vs. ca đêm 31 người) mà không báo, để lại một lỗ hổng logic ("vì sao cột 20 phút trống?") và làm nhịp "à" — cột 20 phút rỗng lúc vừa mở mắt — không đủ sức nặng.

---

## (a) Sai sự thật hoặc nói quá so với FACTS.md

### A1. `lab1` — địa danh "Adelaide" không có trong FACTS, và hai thí nghiệm bị gộp làm một

> **Câu gốc:** "Mình tìm được một phòng thí nghiệm giấc ngủ ở Adelaide, nơi người ta đo chính xác cái cảm giác này."

**Vấn đề:** FACTS không có tên địa danh nào, cũng không nói hai nghiên cứu (Brooks & Lack 2006 buổi chiều và Hilditch 2016 ca đêm) diễn ra ở cùng một phòng hay cùng một nhóm. Câu này khiến người xem tin rằng mọi con số sau đó đều thuộc cùng một phòng thí nghiệm — trong khi `mech2`, `mech3`, `self1`, `self2` lấy từ thí nghiệm ca đêm khác hẳn (31 người, sau một đêm không ngủ, nap kết thúc lúc 04:00 — FACTS §3 "Ranh giới"). Đây là lỗi "nói thêm ngoài tài liệu" và là nguồn gốc của các lỗi B1–B3.

**Sửa:** bỏ địa danh, và để câu sau (self1) tự giới thiệu thí nghiệm thứ hai.

> **Câu mới:** "Mình tìm được một nhóm người đã làm thí nghiệm ngủ trưa có đo đạc, để đo chính xác cái cảm giác này."

### A2. `mech2` — đọc sai số 14,7; người nghe sẽ hiểu là "14 phút 42 giây"

> **Câu gốc:** "Nhóm ngủ ba mươi phút có mười bốn phút bảy ngủ sâu; nhóm ngủ mười phút thì không phẩy tám phút."

**Vấn đề:** FACTS §3 ghi "14,7 phút" đối chiếu "0,8 phút". "Mười bốn phút bảy" khi đọc lên là 14 phút 7 (giây/phần) — và field `asr` của chính câu này ghi lại đúng cái Whisper nghe được: **"14 phút 42 giây"**. Nghĩa là người xem sẽ nghe một con số không tồn tại trong FACTS. Cũng lưu ý `asr` đang viết "chưa đầy 1 phút" (đúng nghĩa) nhưng khác `text` ("không phẩy tám phút"), hai bản phải thống nhất.

**Sửa:** đọc đúng 14,7 và giữ đủ hai chữ số FACTS đã hỗ trợ.

> **Câu mới:** "Nhóm ngủ ba mươi phút có mười bốn phút bảy phần mười ngủ sâu; nhóm ngủ mười phút thì chỉ không phẩy tám phút."

### A3. `close2` — "ngưỡng an toàn" là khẳng định quá mức, FACTS §6 cấm đúng kiểu này

> **Câu gốc:** "Dưới ba mươi phút là ngưỡng an toàn. Nhưng đủ thôi, đừng có cắt ngủ quá nhiều."

**Vấn đề:** FACTS §6 nói thẳng: *"Many industry publications recommend naps of 30 min or less to avoid this side effect. However, the evidence to support this advice is yet to be thoroughly reviewed"* và *"Without this context, such a recommendation is potentially misleading"*, cùng ranh giới: **"không được nói '30 phút là chuẩn vàng'"**. "Ngưỡng an toàn" còn mạnh hơn "chuẩn vàng" — nó biến một khuyến nghị chưa được kiểm chứng thành một tiêu chuẩn có căn cứ. Vế sau ("đủ thôi") cũng mơ hồ (xem C7).

**Sửa:** nói đúng mức độ chắc chắn mà FACTS cho phép, và đưa cảnh báo "chưa được kiểm chứng kỹ" vào.

> **Câu mới:** "Khuyến nghị này đến từ các bài tổng quan, và bằng chứng cho nó chưa được rà soát kỹ. Nhưng vẫn phải ngủ đủ ban đêm, đừng có cắt ngủ."

### A4. `close1` — "Ba mươi phút là hết rồi" mơ hồ, nghe như "ngủ 30 phút là đủ"

> **Câu gốc:** "Ba mươi phút là hết rồi. Mười phút là đủ. Cà phê thì uống trước khi nằm."

**Vấn đề:** Cả tập lập luận "ngủ 30 phút tệ hơn không ngủ"; câu kết "Ba mươi phút là hết rồi" đọc lên rất dễ thành "30 phút ngủ là đủ rồi" — ngược hẳn thông điệp. "Mười phút là đủ" thì FACTS §2 hỗ trợ ("10-minute nap was overall the most effective afternoon nap duration of the nap lengths examined").

**Sửa:** nói rõ đó là **giới hạn** của giấc ngủ trưa, không phải đủ cho cả ngày.

> **Câu mới:** "Ngủ trưa thì giữ trong ba mươi phút là hết, mười phút là đủ; cà phê thì uống trước khi nằm."

### A5. `roi3` — "cà phê sữa đá" và "tỉnh ngay" đúng loại FACTS §4 cấm diễn đạt

> **Câu gốc:** "Vậy thì cứ uống cà phê sữa đá sau khi dậy là tỉnh ngay chứ gì."

**Vấn đề:** FACTS §4 ("Cách diễn đạt") nói rõ: **không** nói "cà phê sữa đá là cách nhanh nhất để tỉnh". Ở đây đó là nhận định sai để người dẫn sẽ bác bỏ, nhưng câu vẫn đưa "sữa đá" + "tỉnh ngay" vào lời đọc, tức là vào tai người xem. Ngoài ra FACTS §4 còn ghi rõ không có con số liều nào được kiểm chứng — câu hiện tại không vi phạm, nhưng đừng bổ sung liều.

**Sửa:** giữ ý "nhầm tưởng" nhưng bỏ chi tiết bị cấm.

> **Câu mới:** "Vậy thì cứ uống cà phê ngay sau khi dậy là tỉnh ngay chứ gì."

### A6. `mech5` — thời lượng sleep inertia phải khớp với ngữ cảnh và với thẻ trên màn hình

> **Câu gốc:** "Vì lúc đó não đang ở giấc ngủ sâu nhất, nên phải chừng nửa tiếng mới hồi lại được"

**Vấn đề:** Câu này nằm ngay sau `mech3`/`mech4` — tức là đang nói về **nap 30 phút ban đêm** (FACTS §3). Với nap 30 phút ban đêm, FACTS cho phép (và ghi rõ câu "gần một giờ" là để dùng cho ca đêm); còn "chừng nửa tiếng" là thời lượng chung của sleep inertia (FACTS §1). Nếu thẻ ở nhịp này hiện "gần một giờ" mà lời đọc là "chừng nửa tiếng" thì màn hình và giọng đọc mâu thuẫn — người xem không biết tin con số nào. Cần chốt một con số cho nhịp này (đề xuất: lấy theo ngữ cảnh ca đêm).

**Sửa (chọn phương án theo ngữ cảnh ca đêm):**

> **Câu mới:** "Vì lúc đó ta còn đang nằm trong giấc ngủ sâu, nên phải gần một giờ mới hồi lại được."

*(Nếu thẻ ở nhịp `mech5` lại hiện "nửa tiếng", thì đổi lời đọc thành "…nên phải chừng nửa tiếng mới hồi lại được." — nhưng khi đó "nửa tiếng" là con số chung của sleep inertia, không phải của riêng ca đêm.)*

### A7. `lab5` — "chỉ tính số lần trả lời sai" lệch với thẻ "4,3" và "4" lần trả lời mỗi giây

> **Câu gốc:** "Không tính cảm giác của họ. Chỉ tính số lần trả lời sai."

**Vấn đề:** FACTS §3 nói thẻ hiện "4,3" và "4" **lần trả lời mỗi giây** (trước nap và 47 phút sau) — tức là đo tốc độ trả lời, không phải "số lần trả lời sai". Vế "Không tính cảm giác của họ" cũng mâu thuẫn với `self1` (mọi nhóm đều tự chấm) — xem B3.

**Sửa:** nói đúng cách đo, và không phủ định việc người ta tự chấm.

> **Câu mới:** "Hiệu năng thì đo bằng đồng hồ: đếm số lần trả lời mỗi giây."

### A8. `self2` — "những mốc đo đầu tiên" nên nói thành "ba mốc đầu tiên"

> **Câu gốc:** "Nhưng đồng hồ đo thì nói ngược lại: ở những mốc đo đầu tiên sau khi dậy, nhóm ngủ ba mươi phút làm sai nhiều hơn cả nhóm không ngủ."

**Vấn đề:** FACTS §3 giới hạn rất rõ: nhóm 30 phút tệ hơn nhóm không ngủ **chỉ ở ba thời điểm 2, 17 và 32 phút** sau khi dậy, không phải ở mọi thời điểm. "Những mốc đo đầu tiên" vô định, dễ bị hiểu là "suốt buổi chiều còn tệ hơn nhóm không ngủ" — tức là nói quá.

**Sửa:**

> **Câu mới:** "Nhưng đồng hồ đo thì nói ngược lại: ở ba mốc đầu tiên sau khi dậy, nhóm ngủ ba mươi phút làm sai nhiều hơn cả nhóm không ngủ."

### A9. `win2` — "đến sau ba mươi lăm phút" không rõ tính từ mốc nào

> **Câu gốc:** "Nhóm ngủ hai mươi phút thì khác. Hiệu quả không tới lúc mới dậy, mà đến sau ba mươi lăm phút."

**Vấn đề:** FACTS §2: *"improvements emerging 35 minutes after napping"* — mốc 35 phút. Câu lời hiện tại không nói 35 phút tính từ lúc bắt đầu ngủ trưa hay tính từ lúc dậy, nên người xem có thể ghép nó thành "sau khi dậy 35 phút thì tỉnh", tức là một con số khác với con số trên thẻ.

**Sửa:** nói rõ lợi ích *xuất hiện* sau 35 phút, để khớp thẻ "35 phút" của FACTS §2.

> **Câu mới:** "Nhóm ngủ hai mươi phút thì lạ: lúc vừa mở mắt, cột của họ vẫn trống — hiệu quả chưa tới một lần nào."

*(Xem thêm D1: câu "35 phút" nên đứng ở `win5`, ngay sau khi hình ảnh cột trống đã hiện ra.)*

### A10. `lab2` — "ngủ về đêm trước chỉ năm tiếng" sai nghĩa

> **Câu gốc:** "Họ mời hai mươi bốn người ngủ về đêm trước chỉ năm tiếng, rồi buổi chiều đưa vào phòng."

**Vấn đề:** Về mặt sự thật thì đúng (FACTS §2: 24 người, đêm trước chỉ ngủ khoảng 5 giờ, thí nghiệm buổi chiều), nhưng "ngủ về đêm trước" đọc lên rất khó hiểu ("ngủ về" = về nhà ngủ). Vấn đề chính là lỗi ngôn ngữ (xem C4), nhưng kể ở đây vì nó cũng là câu đặt nền cho toàn bộ thí nghiệm buổi chiều.

**Sửa:**

> **Câu mới:** "Họ mời hai mươi bốn người; đêm trước chỉ ngủ được khoảng năm tiếng, rồi buổi chiều đưa vào phòng."

---

## (b) Cơ chế có được giải thích đúng không, và người chưa biết có hiểu không

### B1. Lỗ hổng lớn nhất: "vì sao cột 20 phút lại trống?" — không câu nào trả lời

Kịch bản nói rất rõ **hiện tượng** (`win2`: hiệu quả đến sau 35 phút; `win5`: lúc vừa mở mắt chưa được gì) nhưng **không câu nào nói cơ chế**. `mech1` chỉ giải thích vì sao nhóm 30 phút rơi vào giấc ngủ sâu và nhóm 10 phút thì không — nhóm 20 phút bị bỏ qua. Người xem sẽ tự nhủ "vậy 20 phút là bị gì?" và không bao giờ nhận ra đáp án.

FACTS có sẵn cơ chế để điền vào chỗ này (mục 6): *"the observation that sleep inertia is less likely to occur after short naps (≤30 mins) may be due to the typical delay in SWS onset of 30 mins"* — tức là não mất khoảng 30 phút mới đi vào giấc ngủ sâu; nap 20 phút nằm đúng ngay trước mốc đó nên vừa không có lợi ích, vừa chưa sâu đến mức bị tê. Đây là "suy luận của tập" (FACTS, mục Suy luận) nên được nói với chỉ báo "có lẽ/có vẻ".

**Sửa (bổ sung vào `mech1`):**

> **Câu mới:** "Vì sao? Vì nhóm ba mươi phút đủ lâu để rơi vào giấc ngủ sâu, còn nhóm mười phút thì chưa. Có lẽ vì não phải mất khoảng ba mươi phút mới đi vào giấc ngủ sâu — nên nhóm hai mươi phút nằm đúng giữa: lúc mới dậy chưa có lợi ích gì, mà cũng chưa sâu đến mức bị tê."

### B2. Hai thí nghiệm khác nhau bị dùng như một — người xem không theo kịp

Mạch kịch bản hiện tại: `lab2` (24 người, đêm trước 5 tiếng, buổi chiều) → `lab3` (ba nhóm 10/20/30 phút) → `win1–win5` → `mech1–mech5` (14,7 phút, 0,8 phút, 80% — **từ thí nghiệm ca đêm**) → `self1` ("Trong ca đêm… ba nhóm — ngủ mười phút, ngủ ba mươi phút, **và không ngủ**") → `self2` (so với nhóm không ngủ).

Hai chỗ vỡ:
- `lab3` nói "Ba nhóm mình sẽ kể", nhưng `self1` lại kể "ba nhóm" gồm 10 phút / 30 phút / **không ngủ** — vừa đổi danh sách vừa đổi phòng thí nghiệm mà không báo.
- Nhóm "không ngủ" (NO-NAP) chỉ tồn tại trong thí nghiệm ca đêm (FACTS §3); nó xuất hiện như một nhóm thứ tư chui vào từ câu `self1` mà không giải thích.

**Sửa (dùng `self1` để báo rõ lần chuyển thí nghiệm; con số "ba mươi mốt người" và "một đêm không ngủ" có trong FACTS §3, mục Ranh giới):**

> **Câu mới (self1):** "Một thí nghiệm khác, vào ca đêm, với ba mươi mốt người sau một đêm không ngủ: cả ba nhóm — ngủ mười phút, ngủ ba mươi phút, và không ngủ — đều tự chấm là mình làm tốt hơn trước khi ngủ."

Và để `lab3` không bị hiểu là ba nhóm duy nhất:

> **Câu mới (lab3):** "Trước hết, ba nhóm mình sẽ kể: ngủ mười phút, ngủ hai mươi phút, và ngủ ba mươi phút."

### B3. `lab5` và `self1` mâu thuẫn nhau về việc "có tính cảm giác của họ không"

> **Câu gốc (lab5):** "Không tính cảm giác của họ. Chỉ tính số lần trả lời sai."

`lab5` nói không tính cảm giác; `self1` nói mọi nhóm đều tự chấm là làm tốt hơn trước khi ngủ. Hai câu không thể cùng đúng. (Sửa `lab5` theo A7.)

> **Câu mới (lab5):** "Hiệu năng thì đo bằng đồng hồ: đếm số lần trả lời mỗi giây."

### B4. `roi4` hỏi "cứ đừng ngủ trưa" nhưng phim không bao giờ trả lời

> **Câu gốc:** "Thì cứ đừng ngủ trưa, giữ mình tỉnh là hơn chứ gì."

Sau `roi4`, kịch bản nhảy thẳng sang `cost1` về thiếu ngủ tích lũy — người xem không được trả lời trực tiếp câu hỏi của mình, và dễ hiểu nhầm thành "ừ, đừng ngủ trưa". Trong khi FACTS §5 đúng là câu trả lời (ngủ ít còn tệ hơn), phim phải nói ra.

**Sửa (đưa câu trả lời vào đầu `cost1`):**

> **Câu mới:** "Còn một thứ nữa, và nó nặng hơn nhiều: đừng ngủ trưa cũng chưa phải là cách. Thiếu ngủ không ghi đè lên bạn, nó tích lũy."

### B5. "Sleep inertia" được gọi tên nhưng không được giải thích cho người chưa biết

> **Câu gốc (hook2):** "Chuông reo, mình ngồi dậy, mở laptop, và thấy đầu mình nặng hơn lúc vừa nằm xuống. Người ta gọi cảm giác đó là sleep inertia."

FACTS §1 định nghĩa: *"temporary time of sleepiness, disorientation and impaired cognitive performance experienced upon awakening"*, và FACTS §6 còn có một cách giải thích rất dễ hiểu cho người chưa biết: *"cerebral blood flow velocity is lower than pre-sleep levels for up to half an hour after waking"* (máu não chậm trở lại sau nửa tiếng). Kịch bản chỉ nói "đầu nặng" — người xem không biết đó là mờ đầu/lười nhác/loạn, cũng không biết vì sao lại kéo dài được.

**Sửa (bổ sung vào `hook2`, dùng đúng cách diễn đạt "chừng nửa tiếng" mà FACTS cho phép):**

> **Câu mới:** "Chuông reo, mình ngồi dậy, mở laptop, và thấy đầu mình nặng hơn lúc vừa nằm xuống. Người ta gọi cảm giác lười nhác, lơ mơ, đầu không minh đó là sleep inertia, và nó thường kéo dài chừng nửa tiếng."

### B6. `cafe1` diễn đạt "giảm hẳn" mạnh hơn FACTS, và không nói triệu chứng nào được giảm

> **Câu gốc:** "Cà phê thì sao? Nghiên cứu nói: uống cà phê trước giấc ngủ trưa thì các dấu hiệu tê sau khi dậy giảm hẳn."

FACTS §4: *"caffeine has been shown to alleviate the symptoms of sleep inertia following the nap"* — "alleviate" = giảm bớt, không phải "giảm hẳn"; và "các dấu hiệu tê" là cách nói không có trong FACTS, người chưa biết sẽ không hiểu "tê" nghĩa là gì ở đây (tê tay? tê mặt?). Cũng lưu ý FACTS §4: đây là bài tổng quan **trích lại** một nghiên cứu gốc, nên "Nghiên cứu nói:" không sai, nhưng đừng biến thành "đã chứng minh".

**Sửa:**

> **Câu mới:** "Cà phê thì sao? Người ta đã thử uống cà phê trước giấc ngủ trưa, và các triệu chứng mờ đầu, lười nhác sau khi dậy giảm rõ rệt."

### B7. `cafe2` đúng, nhưng nên nói rõ cơ chế đã được FACTS nêu

> **Câu gốc:** "Nhưng uống sau khi đã dậy thì tác dụng đến trễ. Đoạn tệ nhất vừa mở mắt, cà phê không cứu được."

Nội dung đúng (FACTS §4: *"the initial, most severe period of effects are unaffected by caffeine"*). Có thể siết thêm một chút để người xem hiểu vì sao: "tác dụng đến trễ" chứ không phải "không có tác dụng". Câu hiện tại đã đạt, không bắt buộc sửa.

---

## (c) Lời đọc lên có tự nhiên, đúng ngữ pháp tiếng Việt không

### C1. `mech2` — "mười bốn phút bảy" (đã nêu ở A2, nhắc lại vì đây là lỗi đọc số)

> **Câu gốc:** "Nhóm ngủ ba mươi phút có mười bốn phút bảy ngủ sâu; nhóm ngủ mười phút thì không phẩy tám phút."

Đọc lên là "mười bốn phút bảy" → người nghe tưởng 14 phút 7 giây; Whisper ghi lại đúng như vậy. Cần "mười bốn phút bảy phần mười".

### C2. `mech3` — "tỉnh dậy đúng từ giấc ngủ sâu" nghe thành "đúng giữa lúc ngủ sâu nhất"

> **Câu gốc:** "Tám mươi phần trăm người ngủ ba mươi phút tỉnh dậy đúng từ giấc ngủ sâu."

Field `asr` của chính câu này ghi: **"80% người ngủ lâu tỉnh dậy đúng giữa lúc ngủ sâu nhất"** — tức giọng đọc hiện tại bị nghe sai thành một câu khác hẳn nghĩa ("đúng giữa lúc ngủ sâu nhất" ≠ "tỉnh dậy đúng từ giấc ngủ sâu"). Đây là lỗi **cách viết**, đúng loại CHANNEL.md nói phải sửa bằng cách viết lại.

> **Câu mới:** "Tám mươi phần trăm người ngủ ba mươi phút tỉnh dậy đúng lúc đang ngủ sâu."

### C3. `mech5` — "não đang ở giấc ngủ sâu nhất" rối, và câu thiếu dấu chấm

> **Câu gốc:** "Vì lúc đó não đang ở giấc ngủ sâu nhất, nên phải chừng nửa tiếng mới hồi lại được"

Hai vấn đề: (i) "ở giấc ngủ sâu nhất" là cách nói nửa vời — người nằm trong giấc ngủ sâu chứ không "ở giấc ngủ sâu nhất"; (ii) câu không có dấu chấm cuối, lệch với 41 câu còn lại (`self4` cũng thiếu — xem C10).

> **Câu mới:** "Vì lúc đó ta còn đang nằm trong giấc ngủ sâu, nên phải gần một giờ mới hồi lại được." (hoặc giữ "chừng nửa tiếng" theo A6 — tùy thẻ.)

### C4. `lab2` — cúc lệch: "ngủ về đêm trước chỉ năm tiếng"

> **Câu gốc:** "Họ mời hai mươi bốn người ngủ về đêm trước chỉ năm tiếng, rồi buổi chiều đưa vào phòng."

"ngủ về đêm trước" (ngủ về = về nhà ngủ) + "chỉ năm tiếng" dính liền, đọc lên khó cắt chỗ.

> **Câu mới:** "Họ mời hai mươi bốn người; đêm trước chỉ ngủ được khoảng năm tiếng, rồi buổi chiều đưa vào phòng."

### C5. `win5` — "bạn chưa được gì cả" mơ hồ, dễ hiểu thành vô nghĩa

> **Câu gốc:** "Nó nằm giữa. Lúc vừa mở mắt, bạn chưa được gì cả."

"Chưa được gì cả" không rõ là chưa được *lợi ích* hay chưa được *gì khác*; đây đáng lẽ là câu đắt nhất của cả tập (mục d) mà lại là câu mơ hồ nhất.

> **Câu mới:** "Lợi ích của nhóm hai mươi phút chỉ xuất hiện sau ba mươi lăm phút. Nó nằm giữa: lúc vừa mở mắt, chưa được lợi ích gì cả, mà cũng chưa rơi vào giấc ngủ sâu để bị tê."

### C6. `win4` — lặp chữ "con số", câu dài

> **Câu gốc:** "Nói cách khác, con số hai mươi phút không phải là con số chuẩn của một giấc ngủ trưa."

> **Câu mới:** "Nói cách khác, hai mươi phút không phải con số chuẩn của một giấc ngủ trưa."

### C7. `close2` — "Nhưng đủ thôi" mơ hồ

> **Câu gốc:** "Dưới ba mươi phút là ngưỡng an toàn. Nhưng đủ thôi, đừng có cắt ngủ quá nhiều."

"Đủ thôi" đứng một mình, người nghe không biết "đủ" là đủ ngủ hay đủ làm việc. (Câu đã sửa ở A3 cũng xử lý luôn vế này.)

> **Câu mới:** "Khuyến nghị này đến từ các bài tổng quan, và bằng chứng cho nó chưa được rà soát kỹ. Nhưng vẫn phải ngủ đủ ban đêm, đừng có cắt ngủ."

### C8. `cafe1` — "các dấu hiệu tê" không phải cách nói tự nhiên

> **Câu gốc:** "Cà phê thì sao? Nghiên cứu nói: uống cà phê trước giấc ngủ trưa thì các dấu hiệu tê sau khi dậy giảm hẳn."

> **Câu mới:** "Cà phê thì sao? Người ta đã thử uống cà phê trước giấc ngủ trưa, và các triệu chứng mờ đầu, lười nhác sau khi dậy giảm rõ rệt."

### C9. `cafe4` — tham chiếu treo, "đồng hồ đếm ngược trên tường" không có trong lời

> **Câu gốc:** "Và uống cà phê không thay được cái đồng hồ đếm ngược trên tường."

Không có câu nào trước đó nhắc tới cái đồng hồ đếm ngược (chỉ `hook1` có "Đồng hồ hẹn ba mươi phút"), nên câu này trôi ra ngoài, người nghe không biết "cái đồng hồ" nào; và nghĩa "cà phê thay được cái đồng hồ" thì vô nghĩa.

> **Câu mới:** "Và cà phê không thay thế được giấc ngủ."

### C10. `self4` thiếu dấu chấm cuối

> **Câu gốc:** "Cảm giác tỉnh của bạn không phải là bằng chứng." — câu này có dấu chấm; nhưng `mech5` thiếu (C3). Kiểm tra lại toàn file: chỉ `mech5` là câu duy nhất không có dấu kết câu.

### C11. `self1` — câu dài nhất file (153 ký tự), ba mệnh đề chồng lên nhau

> **Câu gốc:** "Chuyện khó chịu nhất nằm ở đây. Trong ca đêm, cả ba nhóm — ngủ mười phút, ngủ ba mươi phút, và không ngủ — đều tự chấm là mình làm tốt hơn trước khi ngủ."

Về độ dài thì chấp nhận được (một câu 150 ký tự vẫn đọc trong một hơi thở), nhưng cụm "— ngủ mười phút, ngủ ba mươi phút, và không ngủ —" đọc lên rất dễ bị lõm. Câu mới ở B2 đã ngắn lại và tách nhóm.

### C12. `close1` — lặp nguyên văn nội dung `act1`/`act2`/`act3`

> **Câu gốc:** "Ba mươi phút là hết rồi. Mười phút là đủ. Cà phê thì uống trước khi nằm."

Ba vế lặp đúng ý `act1` ("dưới ba mươi phút"), `act2` ("mười phút"), `act3` ("cà phê ... trước khi nằm"). Đây là chủ ý chốt, nhưng nên gộp lại thành một câu kết gọn hơn và đồng thời sửa lỗi mơ hồ ở A4.

> **Câu mới:** "Ngủ trưa thì giữ trong ba mươi phút là hết, mười phút là đủ; cà phê thì uống trước khi nằm."

### C13. `cost2` — thiếu từ nối, câu dồn nhiều vế

> **Câu gốc:** "Sáu giờ mỗi đêm trong mười bốn đêm liên tiếp, hiệu năng nhận thức tệ tương đương tới hai đêm không ngủ trắng."

Nội dung đúng (FACTS §5 cho phép "6 giờ", "14 ngày", "tương đương tới 2 đêm không ngủ"). Cần chỗ nối để hai vế không đứng cạnh nhau như hai mảnh rời.

> **Câu mới:** "Sáu giờ mỗi đêm trong mười bốn đêm liên tiếp, hiệu năng nhận thức tệ đến mức tương đương tới hai đêm không ngủ trắng."

### C14. Tên gọi: "Kẻ Nghĩ Nhiều" (`intro`) vs "Trạm Nghĩ Nhiều" (`close3`)

> **Câu gốc (intro):** "Mình là Kẻ Nghĩ Nhiều. Hôm nay: tại sao ngủ ba mươi phút lại tệ hơn không ngủ?" / **Câu gốc (close3):** "Trạm Nghĩ Nhiều, hẹn gặp lại bạn ở kỳ sau."

FACTS §1 xác nhận nhân vật tên "Kẻ" ("đặt cạnh Kẻ khi Kẻ kể cảm giác mờ đầu"), nên có thể là chủ ý tách nhân vật (Kẻ) và kênh (Trạm). Nhưng hai tên gần nhau trong cùng một tập mà không có câu nào giải thích là dễ lẫn. Nên xác nhận một lần rồi thống nhất, hoặc thêm một vế nối ở `close3`.

> **Câu mới (close3):** "Trạm Nghĩ Nhiều — tức là Kẻ Nghĩ Nhiều đây — hẹn gặp lại bạn ở kỳ sau."

*(Hoặc giữ nguyên `close3` nếu bộ dụng cụ đã quy định rõ "Kẻ" là người dẫn của "Trạm"; khi đó bỏ vế "Mình là Kẻ Nghĩ Nhiều" ở `intro`.)*

---

## (d) Nhịp "à" — cột 20 phút trống rỗng lúc vừa mở mắt có hiện ra không?

Cơ chế của "à" theo FACTS §2 + §6: ở thời điểm vừa mở mắt, cột "20 phút" **trống rỗng** — lợi ích chưa tới; nó chỉ xuất hiện sau **35 phút**. Đây là cái mẹo thật của tập: cùng một lúc mở mắt, 10 phút thì đã tỉnh, 30 phút thì đang tệ nhất, 20 phút thì **chưa được gì**.

### D1. Cái mẹo có trong lời, nhưng nằm rải rác và câu đắt nhất lại mơ hồ

Hiện tại: `win2` nói "hiệu quả… đến sau ba mươi lăm phút"; `win4` nói "hai mươi phút không phải con số chuẩn"; `win5` mới nói "Lúc vừa mở mắt, bạn chưa được gì cả". Ba ý của một cú "à" bị tách ra bởi `win3` (nhóm 30 phút), nên người xem nhận ra "à" **sau khi** đã chạy qua hết nhịp 30 phút, và câu mang hình ảnh "cột trống" lại là câu mơ hồ nhất (C5).

**Sửa:** đưa hình ảnh cột trống vào ngay sau `win1`, và để con số 35 phút đứng sau nó, ở `win5`.

> **Câu mới (win2):** "Nhóm ngủ hai mươi phút thì lạ: lúc vừa mở mắt, cột của họ vẫn trống — hiệu quả chưa tới một lần nào."
>
> **Câu mới (win5):** "Lợi ích của nhóm hai mươi phút chỉ xuất hiện sau ba mươi lăm phút. Nó nằm giữa: lúc vừa mở mắt, chưa được lợi ích gì cả, mà cũng chưa rơi vào giấc ngủ sâu để bị tê."

### D2. Cái mẹo thiếu phần "vì sao" — không có lời giải thích thì "à" chỉ là một dữ kiện lạ

Sau D1, người xem vẫn phải tự hỏi vì sao. Lời giải có sẵn trong FACTS §6 (độ trễ ~30 phút của SWS) và được đặt vào `mech1` theo B1. Không có câu này thì nhịp "à" là một con số lạ, không phải một cái hiểu.

### D3. Quá nhiều mốc thời gian cùng lúc làm loãng nhịp "à"

Trong kịch bản hiện tại có **ba** mốc cạnh nhau: 35 phút (`win2`), "chừng nửa tiếng" (`mech5`), và (nếu thêm) "gần một giờ" (FACTS §3). Người xem không biết cái nào áp cho cái nào. Nên chốt rõ phân vai:
- **35 phút** → lợi ích của nhóm 20 phút xuất hiện (thẻ §2).
- **Gần một giờ** → thời lượng sleep inertia của nap 30 phút ban đêm (thẻ §3), dùng ở `mech5` (xem A6).
- **Chừng nửa tiếng** → thời lượng chung của sleep inertia, nói ở `hook2` (xem B5), không lặp lại ở `mech5`.

### D4. Còn một "à" bị bỏ: nhóm 30 phút tệ hơn **cả nhóm không ngủ**

Đây là điểm mạnh nhất của `self2` và nó đúng FACTS §3 — nhưng nó nằm sau `self1`, ở giữa tập, không được đẩy lên thành một nhịp. Không cần sửa câu, chỉ cần giữ nó là điểm nhấn của đoạn đó (và sửa `self1` như B2 để không còn mâu thuẫn "ba nhóm").

---

## Đề xuất sửa

| id | Câu cũ | Câu mới |
|---|---|---|
| hook2 | Chuông reo, mình ngồi dậy, mở laptop, và thấy đầu mình nặng hơn lúc vừa nằm xuống. Người ta gọi cảm giác đó là sleep inertia. | Chuông reo, mình ngồi dậy, mở laptop, và thấy đầu mình nặng hơn lúc vừa nằm xuống. Người ta gọi cảm giác lười nhác, lơ mơ, đầu không minh đó là sleep inertia, và nó thường kéo dài chừng nửa tiếng. |
| lab1 | Mình tìm được một phòng thí nghiệm giấc ngủ ở Adelaide, nơi người ta đo chính xác cái cảm giác này. | Mình tìm được một nhóm người đã làm thí nghiệm ngủ trưa có đo đạc, để đo chính xác cái cảm giác này. |
| lab2 | Họ mời hai mươi bốn người ngủ về đêm trước chỉ năm tiếng, rồi buổi chiều đưa vào phòng. | Họ mời hai mươi bốn người; đêm trước chỉ ngủ được khoảng năm tiếng, rồi buổi chiều đưa vào phòng. |
| lab3 | Ba nhóm mình sẽ kể: ngủ mười phút, ngủ hai mươi phút, và ngủ ba mươi phút. | Trước hết, ba nhóm mình sẽ kể: ngủ mười phút, ngủ hai mươi phút, và ngủ ba mươi phút. |
| lab5 | Không tính cảm giác của họ. Chỉ tính số lần trả lời sai. | Hiệu năng thì đo bằng đồng hồ: đếm số lần trả lời mỗi giây. |
| win2 | Nhóm ngủ hai mươi phút thì khác. Hiệu quả không tới lúc mới dậy, mà đến sau ba mươi lăm phút. | Nhóm ngủ hai mươi phút thì lạ: lúc vừa mở mắt, cột của họ vẫn trống — hiệu quả chưa tới một lần nào. |
| win4 | Nói cách khác, con số hai mươi phút không phải là con số chuẩn của một giấc ngủ trưa. | Nói cách khác, hai mươi phút không phải con số chuẩn của một giấc ngủ trưa. |
| win5 | Nó nằm giữa. Lúc vừa mở mắt, bạn chưa được gì cả. | Lợi ích của nhóm hai mươi phút chỉ xuất hiện sau ba mươi lăm phút. Nó nằm giữa: lúc vừa mở mắt, chưa được lợi ích gì cả, mà cũng chưa rơi vào giấc ngủ sâu để bị tê. |
| mech1 | Vì sao? Vì nhóm ba mươi phút đủ lâu để rơi vào giấc ngủ sâu, còn nhóm mười phút thì chưa. | Vì sao? Vì nhóm ba mươi phút đủ lâu để rơi vào giấc ngủ sâu, còn nhóm mười phút thì chưa. Có lẽ vì não phải mất khoảng ba mươi phút mới đi vào giấc ngủ sâu — nên nhóm hai mươi phút nằm đúng giữa: lúc mới dậy chưa có lợi ích gì, mà cũng chưa sâu đến mức bị tê. |
| mech2 | Nhóm ngủ ba mươi phút có mười bốn phút bảy ngủ sâu; nhóm ngủ mười phút thì không phẩy tám phút. | Nhóm ngủ ba mươi phút có mười bốn phút bảy phần mười ngủ sâu; nhóm ngủ mười phút thì chỉ không phẩy tám phút. |
| mech3 | Tám mươi phần trăm người ngủ ba mươi phút tỉnh dậy đúng từ giấc ngủ sâu. | Tám mươi phần trăm người ngủ ba mươi phút tỉnh dậy đúng lúc đang ngủ sâu. |
| mech5 | Vì lúc đó não đang ở giấc ngủ sâu nhất, nên phải chừng nửa tiếng mới hồi lại được | Vì lúc đó ta còn đang nằm trong giấc ngủ sâu, nên phải gần một giờ mới hồi lại được. |
| self1 | Chuyện khó chịu nhất nằm ở đây. Trong ca đêm, cả ba nhóm — ngủ mười phút, ngủ ba mươi phút, và không ngủ — đều tự chấm là mình làm tốt hơn trước khi ngủ. | Chuyện khó chịu nhất nằm ở đây. Một thí nghiệm khác, vào ca đêm, với ba mươi mốt người sau một đêm không ngủ: cả ba nhóm — ngủ mười phút, ngủ ba mươi phút, và không ngủ — đều tự chấm là mình làm tốt hơn trước khi ngủ. |
| self2 | Nhưng đồng hồ đo thì nói ngược lại: ở những mốc đo đầu tiên sau khi dậy, nhóm ngủ ba mươi phút làm sai nhiều hơn cả nhóm không ngủ. | Nhưng đồng hồ đo thì nói ngược lại: ở ba mốc đầu tiên sau khi dậy, nhóm ngủ ba mươi phút làm sai nhiều hơn cả nhóm không ngủ. |
| roi3 | Vậy thì cứ uống cà phê sữa đá sau khi dậy là tỉnh ngay chứ gì. | Vậy thì cứ uống cà phê ngay sau khi dậy là tỉnh ngay chứ gì. |
| cafe1 | Cà phê thì sao? Nghiên cứu nói: uống cà phê trước giấc ngủ trưa thì các dấu hiệu tê sau khi dậy giảm hẳn. | Cà phê thì sao? Người ta đã thử uống cà phê trước giấc ngủ trưa, và các triệu chứng mờ đầu, lười nhác sau khi dậy giảm rõ rệt. |
| cafe4 | Và uống cà phê không thay được cái đồng hồ đếm ngược trên tường. | Và cà phê không thay thế được giấc ngủ. |
| cost1 | Còn một thứ nữa, và nó nặng hơn nhiều. Thiếu ngủ không ghi đè lên bạn, nó tích lũy. | Còn một thứ nữa, và nó nặng hơn nhiều: đừng ngủ trưa cũng chưa phải là cách. Thiếu ngủ không ghi đè lên bạn, nó tích lũy. |
| cost2 | Sáu giờ mỗi đêm trong mười bốn đêm liên tiếp, hiệu năng nhận thức tệ tương đương tới hai đêm không ngủ trắng. | Sáu giờ mỗi đêm trong mười bốn đêm liên tiếp, hiệu năng nhận thức tệ đến mức tương đương tới hai đêm không ngủ trắng. |
| close1 | Ba mươi phút là hết rồi. Mười phút là đủ. Cà phê thì uống trước khi nằm. | Ngủ trưa thì giữ trong ba mươi phút là hết, mười phút là đủ; cà phê thì uống trước khi nằm. |
| close2 | Dưới ba mươi phút là ngưỡng an toàn. Nhưng đủ thôi, đừng có cắt ngủ quá nhiều. | Khuyến nghị này đến từ các bài tổng quan, và bằng chứng cho nó chưa được rà soát kỹ. Nhưng vẫn phải ngủ đủ ban đêm, đừng có cắt ngủ. |
| close3 | Trạm Nghĩ Nhiều, hẹn gặp lại bạn ở kỳ sau. | Trạm Nghĩ Nhiều — tức là Kẻ Nghĩ Nhiều đây — hẹn gặp lại bạn ở kỳ sau. |

### Ghi chú kỹ thuật cho người làm giọng

- Field `asr` của `mech2` ("14 phút 42 giây", "chưa đầy 1 phút") và `mech3` ("đúng giữa lúc ngủ sâu nhất") là bằng chứng cho thấy lời hiện tại **bị nghe sai khi đọc lên**. Sau khi sửa `text` theo bảng trên, field `asr` cần được cập nhật lại (hoặc xóa) để khớp với lời mới.
- Sau khi sửa, kiểm lại hai mốc thời gian của sleep inertia không bị trùng nhau: "chừng nửa tiếng" (hook2, số chung) và "gần một giờ" (mech5, nap 30 phút ban đêm) — hai con số đều được FACTS cho phép nhưng phải ở đúng ngữ cảnh, và phải khớp với thẻ đang hiện trên màn hình.
