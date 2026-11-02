# TREATMENT — Trạm Nghĩ Nhiều — Tập 06 (series Tâm lý hành vi): Hiệu ứng Chim Mồi

Kênh / channel: **tram-nghi-nhieu** · Tập / episode: `series/tam-ly-hanh-vi/tap-06-hieu-ung-chim-moi` · Phim / movie: `tram-nghi-nhieu-series-tam-ly-hanh-vi-tap-06-hieu-ung-chim-moi.mp4`

Thời lượng: **3:05** (mục tiêu 3 phút) · 1920×1080 · 24 fps · tiếng Việt · −14 LUFS, true peak ≤ −1,2 dBTP

Người xem sau khi xem phải hiểu: **hiệu ứng chim mồi có thật, nhưng nó nhỏ hơn nhiều so với lời đồn, và nó không phải là trò lừa — nó là một câu nói của người bán** — và phải làm được một việc cụ thể trước khi tính tiền.

---

## 1. Ba cấu trúc ứng viên / Three candidate structures

**A. Bảng giá trên bàn** — Mở đầu bằng một bảng giá ba mức, đi thẳng vào thí nghiệm 1982, kết bằng "bạn đã bị lừa". Dễ quay, nhưng là một bài giảng có hình: không có người, không có hành động, và kết luận lại đúng cái mọi người vẫn tin.

**B. Quán trà sữa lúc nửa đêm** — Mở đầu ở quầy hàng: ba cỡ ly, ba mức giá, và bàn tay của Kẻ Nghĩ Nhiều đã cầm ly to lên trước khi kịp nghĩ. Rồi quay về bàn làm việc để mổ xẻ. Có người, có hàng, có tiền thật.

**C. Ba cái bảng giá** — Ba tập hợp lựa chọn (ba quầy hàng khác nhau) đứng cạnh nhau như ba chứng cứ; phim đi từ cái bảng giá bạn tin sang cái bảng giá người bán dùng để nói với bạn. Hình ảnh mạnh nhưng dễ thành "bảng trình bày".

**Chosen: B** — Vì tập phim phải bắt đầu bằng một hành động đã xảy ra (tay đã cầm ly to lên rồi), chứ không phải bằng một định nghĩa. Quầy trà sữa lúc nửa đêm là nơi hiệu ứng này thật sự xảy ra với người thật; phần còn lại của phim là hành trình đi tìm câu trả lời, và câu trả lời sẽ làm thay đổi cách ta nhìn chính cái bảng giá ấy. Ý tưởng đầu tiên (C) bị bỏ vì nó kể một lịch sử của các thí nghiệm chứ không kể một câu chuyện có người.

## 2. Logline và cung / Logline and arc

> Một ly trà sữa bị mua đắt hơn gấp rưỡi — và phải mất ba mươi năm các nhà tâm lý học mới biết cái mồi câu đó thật sự mạnh tới đâu, và nó mạnh với ai.

- Setup: Quầy trà sữa lúc nửa đêm. Ba cỡ ly, ba mức giá — cỡ vừa đắt hơn cỡ lớn mà ít hơn. Tay đã cầm ly lớn.
- Turn: Nó **có thật** (1982, +9,2 điểm phần trăm) — nhưng phần lớn hiệu ứng là **suy luận**, không phải bị lừa. Rồi cú lật thật: năm 2014, 38 nghiên cứu lặp lại, và 19 nghiên cứu dùng **hàng thật** thì **không thí nghiệm nào** ra hiệu ứng.
- Ending: Ngoài đời thật hiệu ứng chỉ khoảng 1%, và người mua thường xuyên thì miễn nhiễm. Hành động: **gạch món bị áp đảo khỏi bảng so sánh**, và nhớ giá món mình hay uống.

## 3. So với tập trước / Benchmark — learn, don't learn

| From | Learn | Don't learn |
|---|---|---|
| Tập 05 của series (Căn phòng ngập khói 1968) | cách dựng một phòng thí nghiệm có đạo cụ thật và đưa người thật vào giữa; cách để Rối đóng vai người cảnh báo | **không** dùng lại "phòng thí nghiệm 1968" làm bối cảnh chính — bối cảnh của tập này là **quầy hàng ban đêm** và **bàn làm việc lúc nửa đêm** |
| Tập 03 của series Nghịch lý đời thường | cách kết một tập bằng một hành động cụ thể; cách dùng bảng cork làm bản đồ chứng cứ | **không** lặp lại cách "bảng cork + thẻ ghim" cho toàn bộ phần dữ liệu — ở tập này dữ liệu được vẽ thành **biểu đồ trên giấy** và **thẻ tang vật** |
| `STYLE.md` của kênh | nền tối, nét đậm, một màu nhấn mỗi cảnh, sợi tóc đèn là đồng hồ cảm xúc | không dùng hiệu ứng halo/bloom; không bỏ lớp vân giấy `applyPaperTexture` + hạt phim `renderGrainFx` |

## 4. Danh sách cảnh / Shot list

29 cảnh. Mỗi cảnh ghi 5 trường bắt buộc của kênh: `visualAnchor` · `typography` · `propsAndStaging` · `characterActing` · `soundSync`. Quy tắc chung: **một màu nhấn mỗi cảnh**; không có chữ nào nằm trong dải phụ đề (y > 880); không camera lắc; chuyển cảnh bằng whip pan (có motion blur).

Cột *Dur* là thời lượng thật của cảnh, tính từ `src/timeline.js` (mốc cảnh = mốc câu thoại trừ đi độ trễ mở cảnh 0,25–0,3 s).

| # | Shot | Framing | Angle | Camera move | visualAnchor (≥50% khung) | typography | propsAndStaging | characterActing | soundSync | Dur |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `counter` | insert / cận cảnh | nhìn xuống 45° | push-in chậm 6% | ba ly trà sữa trên quầy, chiếm ~70% khung; ba thẻ giá dán cạnh | "TRÀ SỮA" 76px 900 neon hồng + ba thẻ giá "35.000" / "60.000" / "65.000" 40px 900 | mặt quầy gỗ ẩm, ly nhựa có nắp, ống hút, khăn giấy, đèn neon hồng | không nhân vật; chỉ hơi nước bốc lên | `amb` night; `pop` khi ly rời chỗ | 2,1s |
| 2 | `hand` | cận cảnh tay | chính diện | push-in chậm 5% | bàn tay Kẻ Nghĩ Nhiều chỉ vào ly nhỏ, khung chiếm ~55% | ba thẻ giá 40px 900 + neon "TRÀ SỮA" 76px | quầy, ba ly, ba thẻ giá, kệ chai sữa | tay chìa vào từ trái, ngón tay chỉ về ly 35.000 rồi ngập ngừng | `pop`, `step`, `paper` | 4,0s |
| 3 | `owner` | trung cảnh quầy | chính diện | whip pan vào | quầy + chủ quán đứng sau, ~60% | ba thẻ giá 40px 900 trên quầy | quầy, ly, thẻ giá, menu treo tường | chủ quán đứng im sau quầy; Kẻ Nghĩ Nhiều ở bên phải ngắm hàng ly | `whoosh` vào cảnh, `pop`, `paper` | 5,7s |
| 4 | `grab` | cận cảnh đạo cụ | chính diện | push-in chậm 3% | ly lớn nằm trong tay được nâng lên giữa khung, hai ly còn lại ~55% | thẻ giá "35.000" / "60.000" / "65.000" 40px 900 + mũi tên đỏ từ thẻ 65.000 sang ly lớn | ba ly, ba thẻ giá, mặt quầy gỗ | bàn tay nắm thân ly lớn và nhấc lên khỏi quầy | `step`, `pop`, `marker` (mũi tên) | 7,2s |
| 5 | `title` | trung cảnh bàn làm việc | hơi từ trên | đứng yên | thẻ giấy ghim đỏ rơi xuống bàn, ~60% | "HIỆU ỨNG" / "CHIM MỒI" 80px 900 + "vì sao món tệ lại hấp dẫn hơn?" 36px Patrick Hand (ghi dần) + "TẬP 06" 40px 800 | bàn gỗ, đèn bàn vàng, cốc cà phê, sổ | tay vẫy, sợi tóc đèn sáng lên | `paper`, `pop`, `marker`, nhạc B | 6,4s |
| 6 | `myth` | trung cảnh tường | chính diện | đứng yên | áp phích giấy "NGƯỜI BÁN LỪA BẠN" ~55% | "NGƯỜI BÁN" / "LỪA BẠN" 108px 900 + "cách giải thích quen thuộc nhất" / "mà não bạn thì bị lừa" 42px Patrick Hand + dấu "PHỔ BIẾN" 54px | tường quán, ghim bấm, mép giấy gợn | Rối chỉ vào áp phích | `pop`, `stamp` | 4,3s |
| 7 | `check` | trung cảnh | chính diện | đứng yên | Kẻ Nghĩ Nhiều soi kính lúp vào thẻ "BỊ LỪA", ~55% | "BỊ LỪA" 78px 900 + "chưa ai kiểm tra" 40px Patrick Hand | kính lúp cầm trong tay phải, thẻ giấy ghim, mặt bàn tối | mắt dán qua kính lúp, nghiêng người | `paper`, `tick` | 6,0s |
| 8 | `lab` | toàn cảnh bàn | nhìn xuống 45° | đứng yên | bàn thí nghiệm với ba thẻ lựa chọn, ~70% | "HUBER · PAYNE · PUTO · 1982" 44px 800 + "153 sinh viên · 6 nhóm hàng · 2 thuộc tính" 38px Patrick Hand + nhãn thẻ 38px 800 | bàn gỗ, ba thẻ giấy ô tô, cây bút chì, đèn bàn | tay đặt thẻ thứ ba (Ô TÔ C) xuống giữa bàn | `paper`, `pop` mỗi thẻ, nhạc C | 10,3s |
| 9 | `labnum` | cận cảnh biểu đồ | chính diện | đứng yên | một cột giấy kẻ ô + mảng vàng là phần tăng thêm, ~60% | "+9,2" 130px 900 + "điểm phần trăm" 34px 700 + "món mục tiêu" 38px + "được chọn nhiều hơn khi có mồi câu" 38px Patrick Hand | giấy kẻ ô, thước gỗ, bút chì | tay vẽ nét dọc lên mảng vàng | `paper`, `marker` | 4,3s |
| 10 | `cars` | cận cảnh biểu đồ | chính diện | đứng yên | hai cột 44% và 66%, ~65% | "44%" → "66%" 100px 900 + "không có mồi câu" / "có mồi câu" 34px 700 + "nhóm ô tô" 42px 800 | giấy kẻ ô, bút chì | ngón tay chỉ cột cao | `paper`, `marker` ×2 | 4,5s |
| 11 | `decoy` | trung cảnh | chính diện | đứng yên | thẻ lựa chọn thứ ba "Ô TÔ C" nằm giữa, bị gạch, ~50% | "Ô TÔ C" 40px 800 + "đắt hơn" / "chất lượng thấp" 34px + "2%" 160px 900 + "gần như không ai chọn nó" 40px 800 | thẻ giấy gạch chéo, ghim đỏ | tay gạch ngang qua thẻ | `paper`, `marker` (gạch) | 9,1s |
| 12 | `turn` | trung cảnh | chính diện | đứng yên | áp phích "NGƯỜI BÁN LỪA BẠN" trong focus lines, ~55% | "NGƯỜI BÁN" / "LỪA BẠN" 104px 900 + "chỉ là một cái bẫy marketing" 44px 800 + dấu "BẪY MARKETING" 78px | tường tối, giấy ghim, mép giấy | không nhân vật; hình ảnh tự nói | `pop`, `stamp` | 4,1s |
| 13 | `rat` | trung cảnh | chính diện | đứng yên | giấy kẻ ô vẽ hai đường 19,6 và 13,0, ~62% | "19,6" / "13,0" 84px 900 + "hiệu ứng thật" / "mô hình suy luận" 32px 700 + "hiệu ứng (điểm)" 34px Patrick Hand | giấy kẻ ô, bút chì, Rối trong vòng tròn pip ở góc dưới phải | tay vẽ hai đường song song | `paper`, `marker` ×2, nhạc D | 13,0s |
| 14 | `rat4` | trung cảnh | chính diện | đứng yên | bảng giá ba mức trên bàn, ~60% | "BẢNG GIÁ" 44px 900 + "CỠ NHỎ" / "CỠ LỚN" / "CỠ VỪA" 42px 800 + giá 48px 900 + "món này đáng" 62px 900 + "bảng giá không bán hàng — bảng giá nói" 34px Patrick Hand | bảng giá, bút, đèn bàn | mũi tên đỏ chỉ dòng "CỠ LỚN" | `paper`, `marker` | 4,5s |
| 15 | `mech` | trung cảnh | chính diện | đứng yên | ba ly đặt cạnh nhau với mũi tên nối, ~65% | "não so sánh bằng cách đặt mọi món cạnh nhau" 46px 800 + ba thẻ giá 40px | quầy gỗ, ba ly, ba thẻ giá | Kẻ Nghĩ Nhiều ở góc phải, mắt chạy từ ly này sang ly kia | `pop`, `marker` | 5,2s |
| 16 | `rep` | trung cảnh tường thẻ | chính diện | đứng yên | tường 38 thẻ thí nghiệm, ~70% | "38 thí nghiệm" 66px 900 + "năm 2014 · ba nhà nghiên cứu khác" 34px Patrick Hand | tường gạch, kẹp giấy, sổ tay | Rối ở góc trái; Kẻ Nghĩ Nhiều ngẩng nhìn tường | im lặng 0,6 s trước cảnh, nhạc E | 5,9s |
| 17 | `repzero` | cận cảnh tường thẻ | chính diện | đứng yên | 19 thẻ có 19 vết gạch đỏ, ~65% | "19 thí nghiệm dùng sản phẩm thật" 48px 800 + "nếm · uống · xem ảnh" 36px Patrick Hand + "không thí nghiệm nào ra hiệu ứng" 52px 900 đỏ | tường thẻ, bút đỏ | tay cầm bút đỏ gạch từng thẻ một | `paper`, `marker` ×6 | 6,4s |
| 18 | `wheel` | trung cảnh | chính diện | đứng yên | cột số bên trái và vòng xác suất bên phải, ~65% | "14%" → "28%" 74px 900 + "24% = 26%" 56px 900 + "không đổi" 50px 900 đỏ + "hiệu ứng chỉ sống trong bảng số" 46px 800 | giấy vẽ tay, compass, bút chì | tay vẽ vòng tròn xác suất rồi chỉ hai con số | `paper`, `marker` ×3 | 9,6s |
| 19 | `tv` | cận cảnh đạo cụ | chính diện | đứng yên | một chiếc tivi nhỏ với ảnh chất lượng hình, ~55% | "53%" → "35%" 110px 900 + "ảnh thật: hiệu ứng đảo chiều" 42px 800 đỏ + "chất lượng hình vẽ bằng ảnh, không bằng số" 32px Patrick Hand | tivi cũ, ảnh vẽ cá, giấy kẻ ô | mũi tên đỏ đi xuống bên phải hai con số | `paper`, `marker` | 5,5s |
| 20 | `attempts` | cận cảnh biểu đồ | chính diện | đứng yên | 91 chấm tròn, 11 chấm được tô, ~65% | "91 lần thử" 58px 900 + "11 lần ra hiệu ứng đáng tin" 46px 900 + "thống kê dự báo là gần 30%" 34px Patrick Hand | giấy kẻ ô, chấm sơn | tay tô 11 chấm theo lượt | `paper`, `pop` ×3 | 6,1s |
| 21 | `wild` | toàn cảnh kệ siêu thị | nhìn xuống 45° | whip pan vào | kệ rượu siêu thị, ~70% | "3,6 triệu giao dịch rượu vang" 62px 900 + "755.158 khách hàng" 36px Patrick Hand + "hiệu ứng chỉ khoảng 1%" 66px 900 | kệ siêu thị, chai rượu, thẻ giá | bóng người lướt qua kệ; Kẻ Nghĩ Nhiều ngạc nhiên | `whoosh` vào cảnh, `pop` ×3, nhạc F | 5,8s |
| 22 | `regular` | trung cảnh quầy | chính diện | đứng yên | một khách quen, ly đặt sẵn, ~55% | "người mua thường xuyên" 56px 900 + "hiệu ứng biến mất hẳn" 62px 900 | quầy, ly quen, sổ ghi chỗ | chủ quán đẩy ly, không cần hỏi | `pop`, `step` | 3,1s |
| 23 | `flight` | cận cảnh màn hình | chính diện | đứng yên | màn hình đặt vé máy bay, ~60% | "hơn 140.000 lượt tìm kiếm" 58px 900 + "không ra hiệu ứng nào" 58px 900 đỏ | màn hình vé máy bay, chén cà phê, sổ tay | con trỏ lướt danh sách chuyến bay | `paper`, `step` ×3 | 6,5s |
| 24 | `model` | trung cảnh bàn làm việc | hơi từ trên | đứng yên | bảng giá ba mức trên bàn, món "vừa" được gạch, ~60% | "mồi câu là một câu nói:" 42px 700 + "\"món này đáng\"" 58px 900 + bảng giá 42/48px | bảng giá, bút đỏ, tách trà | tay chỉ món "vừa" rồi gạch ngang | `paper`, `marker`, nhạc G | 6,6s |
| 25 | `action` | trung cảnh | chính diện | đứng yên | bảng giá ba mức trên mặt bàn gỗ, dòng "CỠ VỪA" bị gạch, ~60% | "gạch món bị áp đảo khỏi bảng so sánh" 46px 900 + "tệ hơn ở mọi tiêu chí = không phải đối thủ của món nào" 32px Patrick Hand | bàn gỗ có vân, bảng giá, bút đỏ | tay nắm cây bút đỏ vừa gạch xong dòng "CỠ VỪA" | `paper`, `marker` | 9,7s |
| 26 | `action3` | trung cảnh bàn làm việc | chính diện | đứng yên | sổ ghi nằm trên mặt bàn, ~55% | "cà phê đen đá" 50px Patrick Hand + "35.000đ" 62px 900 + "quen rồi → không bị mồi câu" 40px Patrick Hand | sổ tay đặt trên bàn, đèn bàn, kệ sách | tay viết món mình hay uống; sợi tóc đèn dịch sang smile | `paper`, `marker` ×2 | 6,6s |
| 27 | `roi` | trung cảnh | chính diện | đứng yên | Rối + bong bóng, ~50% | "MỒI CÂU" 62px 900 + "KHÔNG BÁN ĐƯỢC GÌ" 54px 900 (tím Rối) | bong bóng kem, quầy, hai ly, hai thẻ giá | Rối nghiêng đầu, antenna chớp | `pop`, `boing` | 5,8s |
| 28 | `close` | trung cảnh bàn làm việc | chính diện | đứng yên | Kẻ Nghĩ Nhiều cầm ly trà, bảng giá đã gạch, ~55% | đồng hồ "23:58" 66px + bảng giá (dòng "CỠ VỪA" gạch chéo) | bàn, ly trà, bảng giá đặt trên mặt bàn | uống một ngụm, mắt nhìn xuống, vai thả lỏng | `pop`, `ting`, nhạc G | 6,6s |
| 29 | `next` | trung cảnh | chính diện | đứng yên | thẻ cuối ghim đỏ, ~60% | "TRẠM" / "NGHĨ NHIỀU" 76px 900 + "TẬP SAU" 38px Patrick Hand + "Tại sao ta luôn tưởng mình đúng?" 36px 800 + "23:58" 66px | bàn, ghim, băng keo | tay vẫy, sợi tóc đèn sáng | `paper`, nhạc `end` | 10,3s |

Tổng: **29 cảnh**, 2 whip pan (vào `owner` và `wild`), 3 push-in chậm (`counter`, `hand`, `grab`), còn lại đứng yên; 4 góc máy (cận cảnh đạo cụ / trung cảnh chính diện / toàn cảnh nhìn xuống / cận cảnh mặt); 3 hướng chuyển động máy (push-in, whip pan, đứng yên).
## 5. Nhịp truyện / Beat sheet

Mỗi dòng là một cảnh: cột *Time* là lúc cảnh đó mở ra (cảnh mở trước câu thoại của nó), cột *Line id* là câu thoại chạy trong cảnh.

| Time | Beat | What is on screen | Line id |
|---|---|---|---|
| 0:00.0 | Mở: quầy trà sữa lúc nửa đêm, ba ly trên quầy | ba ly + ba thẻ giá, đèn neon hồng | — |
| 0:02.1 | "Mình chỉ muốn một ly nhỏ thôi" | cận cảnh tay chìa ra trước hàng ly | `hook` |
| 0:06.1 | Chủ quán đứng sau quầy, không nói gì (whip pan) | quầy + chủ quán sau, ba thẻ giá | `hook2` |
| 0:11.8 | Ba mức giá 35 / 60 / 65; cỡ vừa đắt hơn cỡ lớn mà ít hơn — tay vẫn cầm ly lớn | ly lớn được nhấc lên, mũi tên từ thẻ 65.000 | `hook3` |
| 0:19.0 | Tập phim: Hiệu ứng Chim Mồi | thẻ giấy ghim đỏ trên bàn làm việc | `intro` |
| 0:25.4 | Cách giải thích quen thuộc: bị lừa | áp phích "NGƯỜI BÁN LỪA BẠN", đóng dấu PHỔ BIẾN | `myth` |
| 0:29.6 | Rối: nghe hợp lý, nhưng chưa ai kiểm tra | Kẻ Nghĩ Nhiều soi kính lúp, Rối bên cạnh | `myth2` |
| 0:35.6 | Năm 1982, ba nhà nghiên cứu làm một thí nghiệm rất gọn | bàn thí nghiệm, hai thẻ lựa chọn rồi thẻ thứ ba | `lab1` |
| 0:45.9 | 153 sinh viên, thêm lựa chọn thứ ba bị áp đảo → +9,2 điểm phần trăm | cột giấy kẻ ô, mảng vàng là phần tăng thêm | `lab3` |
| 0:50.2 | Nhóm ô tô: 44% → 66% | hai cột 44% và 66%, mũi tên đi lên | `lab4` |
| 0:54.7 | Món mồi câu: chỉ khoảng 2% người chọn | thẻ lựa chọn thứ ba bị gạch đỏ | `decoy1` |
| 1:03.8 | Nó không bán được gì; nếu dừng ở đây, đây chỉ là một cái bẫy marketing | áp phích bị đóng dấu BẪY MARKETING | `turn` |
| 1:07.9 | Cách giải thích khác, không cần bạn phải ngu: hiệu ứng thật 19,6 điểm | giấy kẻ ô, hai đường 19,6 và 13,0 | `rat1` |
| 1:20.9 | Mô hình suy luận đoán được 13,0 điểm — hai phần ba; bảng giá tiết lộ món nào đáng | bảng giá ba mức, mũi tên chỉ | `rat4` |
| 1:25.4 | Não so sánh bằng cách đặt mọi món cạnh nhau | ba ly xếp cạnh nhau, mũi tên nối | `mech` |
| 1:30.6 | "Và đây mới là chỗ đáng sợ" — năm 2014, 38 thí nghiệm | focus lines, im lặng 0,6 s, tường 38 thẻ thí nghiệm | `rep1` |
| 1:36.5 | 19 thí nghiệm dùng sản phẩm thật: không cái nào ra hiệu ứng | bút đỏ gạch từng thẻ | `rep3` |
| 1:42.9 | Chỉ khi thuộc tính là số: 14% → 28%; vẽ thành hình: 24% và 26%, không đổi | hai cột số và vòng xác suất vẽ tay | `rep4` |
| 1:52.5 | Tivi: ảnh thật làm món mục tiêu tụt 53% → 35% | chiếc tivi nhỏ, mũi tên xuống | `rep6` |
| 1:58.0 | 91 lần thử: chỉ 11 lần đáng tin, dự báo gần 30% | 91 chấm, 11 chấm tô | `rep7` |
| 2:04.1 | "Ra ngoài đời thật thì sao?" — 3,6 triệu giao dịch rượu: hiệu ứng ~1% | kệ siêu thị, whip pan | `wild1` |
| 2:09.9 | Người mua thường xuyên: hiệu ứng biến mất hẳn | quầy, khách quen | `wild3` |
| 2:13.0 | 140.000 lượt tìm kiếm vé máy bay: không ra hiệu ứng nào | màn hình đặt vé trên bàn | `wild4` |
| 2:19.5 | Mồi câu là một câu nói: "món này đáng" | bảng giá trên bàn, tay chỉ | `model` |
| 2:26.1 | Hành động: gạch món bị áp đảo khỏi bảng so sánh | bút đỏ gạch dòng "CỠ VỪA" | `action1` |
| 2:35.7 | Tệ hơn ở mọi tiêu chí = không phải đối thủ của món nào | bảng giá còn hai mức | `action2` |
| 2:42.4 | Nhớ giá món mình hay uống | sổ ghi: cà phê đen đá 35.000đ | `action3` |
| 2:48.2 | Rối: mồi câu không bán được gì | Rối trên quầy + bong bóng | `roi` |
| 2:54.8 | Bạn không bị lừa — bạn đang tin cái bảng giá nói | Kẻ Nghĩ Nhiều cầm ly, bảng giá đã gạch | `close` |
| 3:05.2 | Hết — thẻ cuối giữ nguyên đến hết phim | — | — |

*(Các mốc trên là mốc thật: bảng thời gian được sinh từ thời lượng thật của giọng đọc trong
`src/timeline.js` (độ dài từ `voice/proc/dur.json`, khoảng lặng từ `mk_timeline.py`).
Tổng thời lượng: **3:05.2**.)*

## 6. Bản đồ nhạc / Cue map

Tempo: **84 BPM** · Key: **A minor** · Meter: 4/4 · Bar = 4 nhịp ≈ 2,86 s
Nhạc của kênh: piano đệm, marimba, bass gảy, kick mềm, brush, drone, vinyl. **Mỗi chương đổi bộ nhạc cụ, không đổi tempo** (theo `STYLE.md`). Mốc cắt nhạc là sự kiện `music` trong `src/film.js` — mỗi chương bắt đầu đúng lúc cảnh của nó mở.

| Section | Bắt đầu | Bars | Instrumentation | Key action on | Subtitle on |
|---|---|---|---|---|---|
| A | 0:00.0 | 8 | bass mờ + tick đồng hồ | ba ly trên quầy | `hook` |
| B | 0:19.0 | 8 | bass + kick + brush, epiano rải | thẻ tiêu đề rơi xuống | `intro` |
| C | 0:35.6 | 8 | thêm marimba, shaker | ba thẻ lựa chọn trên bàn | `lab1` |
| D | 1:07.9 | 8 | piano đệm thưa, nửa nhịp, celesta | hai đường 19,6 và 13,0 | `rat1` |
| E | 1:30.6 | 8 | pulse trầm + tick, marimba hai nốt | tường 38 thẻ thí nghiệm | `rep1` |
| F | 2:04.1 | 12 | pad ấm, marimba chủ đạo | kệ rượu siêu thị | `wild1` |
| G | 2:19.5 | 12 | theme piano + marimba, bass | bảng giá trên bàn, tay chỉ | `model` |
| G (lặp) | 2:48.2 | 4 | theme piano, nhẹ hơn | Kẻ Nghĩ Nhiều cầm ly | `close` |
| end | 3:04.5 | 4 | nốt A minor kéo dài | thẻ cuối | `next` |

Cắt cứng vào nhịp 1 của mỗi chương; cắt mềm (whip pan, có motion blur) ở hai cảnh `owner` và `wild`. Một khoảng **im lặng**: 0,6 s trước cú "Và đây mới là chỗ đáng sợ" — âm thanh đầu tiên sau im lặng là tiếng **marker**.

## 7. Bảng âm thanh / Sound design table

| Section | Ambience bed | Main foley | Music state |
|---|---|---|---|
| A (quầy trà sữa, nửa đêm) | `night` (tiếng xe, tiếng máy pha) | `pop` khi ly rời chỗ, `step`, `paper` | A: bass + tick, rất khẽ |
| B (bàn làm việc) | `room` (ấm) | `paper`, `pop` khi thẻ rơi, `marker` | B: bass + kick + brush |
| C (thí nghiệm 1982) | `room` | `pop` mỗi thẻ, `paper`, `marker` khi vẽ cột | C: thêm marimba, shaker |
| D (giải thích suy luận) | `low` (trầm, căng) | `marker` khi vẽ hai đường, giấy | D: piano thưa, celesta |
| E (cú lật → tường thẻ) | `low` | `stamp` mạnh, im lặng 0,6 s trước đó, `marker` ×6 khi gạch đỏ | E: pulse + tick, hai nốt marimba căng |
| F (ngoài đời thật) | `room` → `scroll` | `pop` khi lấy chai, `step` khi lướt chuyến bay | F: pad ấm, marimba |
| G (bàn làm việc, kết) | `room` | `pop`, `ting`, `paper` | G: theme piano + marimba → nốt A minor kéo dài |

Foley chính: `paper`, `marker`, `pop`, `stamp`, `ting`, `boing`, `whoosh`, `step` — mỗi nét vẽ chữ hay mỗi hành động chính đều có tiếng đúng lúc.

## 8. Phụ đề và chữ / Subtitle and title design

- **Font**: Be Vietnam Pro (900 tiêu đề/số, 800 chữ phụ, 700 phụ đề) + Patrick Hand (nhãn viết tay) — `../../../fonts/fonts.css` của kênh. Không dùng font thiếu dấu tiếng Việt.
- **Phụ đề**: kem `#FAF8F5`, viền `#12131A` 11 px, 44 px, tối đa 2 dòng, căn giữa sát đáy; **không vẽ gì khác trong dải dưới 880 px**. Mảnh phụ đề ngắn hơn 14 ký tự phải gộp vào mảnh trước, và **không cắt làm đôi một cụm số** ("một trăm bốn mươi nghìn" là một mảnh). Mảnh được neo vào lúc từ đầu mảnh đang được nói; khi Whisper viết số thành chữ số, mảnh lùi về tỉ lệ độ dài chữ của câu.
- **Tiêu đề tập**: "HIỆU ỨNG" / "CHIM MỒI" 900 80 px trên thẻ giấy ghim đỏ, câu hỏi tập "vì sao món tệ lại hấp dẫn hơn?" bằng Patrick Hand 36 px bên dưới, "TẬP 06" 800 40 px bên phải.
- **Chữ trên hình**: mọi chữ đi qua `text()` (để cổng đọc được đo); chữ viết tay dùng `revealText()` với `p` chạy theo từ đang nói — không tự cắt chữ.
- **Số liệu**: số ≥ 110 px 900 cho số chính; nhãn ≥ 34 px; màu nhấn **một màu mỗi cảnh** — vàng `#FFB703` cho kênh, cyan `#67E8F9` cho dữ liệu, tím `#8B5CF6` chỉ thuộc về Rối, đỏ `#F0525B` cho cái sai.
