# Đánh giá khách quan hai phim của kênh, và những lỗi mà máy không thấy (2026-11-09)

Hai phim đã có bản dựng thật để soi: **tap-01 (phơi quần áo)** — bản dựng lúc 15:38 ngày 9, bản mà vòng QA
cuối lúc 16:31 đã bác; và **tap-02 (điện thoại nóng lúc sạc)** — bản dựng lúc 19:51 ngày 9, lần dựng đầu
tiên trong cả chuỗi. Cả hai được soi bằng công cụ của thư viện (`tools/frames_at.py`: cắt **một khung giữa
mỗi câu** từ chính file mp4 rồi dán thành tờ), không phải bằng tờ ảnh dựng riêng (`review/beatsheet/`).
Lý do: tờ dựng riêng là ảnh *đo được*, còn cái người xem sẽ xem là mp4.

Các lỗi dưới đây là **những gì mắt thấy trên mp4**, không phải những gì log của công cụ in ra.

---

## Bối cảnh

| | tap-01 | tap-02 |
|---|---|---|
| Chủ đề | phơi quần áo — vì sao nhanh hay chậm | điện thoại nóng lúc sạc — vì sao |
| mp4 | `out/video.mp4` 15:38 (1,17 GB) · bản gốc 373 MB | `out/video.mp4` 19:51 (1,07 GB) |
| Câu lời kể | 60 câu | 93 câu |
| Tem | đủ 6 nhưng **vật dựng đổi sau tem** → cổng render đóng | đủ 6, **cổng render mở** |

---

## Những điều đã làm tốt

1. **Không có slide, không có thẻ chữ bay.** Cả hai phim đều dựng bằng cảnh thật: tap-01 là một phòng giặt
   (gạch lát, giàn phơi, quạt, cân, cửa sổ, ghế, đồng hồ treo); tap-02 là một mặt bàn gỗ ban đêm có bóng đèn
   vàng, cổng sạc, ổ cắm, nhiệt kế, hai chiếc điện thoại. Mọi câu lời kể đều có một vật để nhìn.
2. **Máy quay đi vào bên trong vật thật, và bên trong đó được dựng đúng.** tap-01 mở ra sợi vải, tơ nước,
   màng bảo hòa; tap-02 mở ra bo mạch xanh, cuộn cảm đồng, tụi pin xếp lớp. Đây là ý tưởng cốt lõi của kênh
   và nó chạy được.
3. **Cái vô hình thành hình minh hoạ** ở cả hai phim: chấm xanh = dòng điện, chấm cam = nhiệt (tap-02);
   màng bảo hòa và luồng hơi nước (tap-01). Không có cái gì vô hình bị vẽ như một vật thể mờ.
4. **Thí nghiệm được dựng thật, không kể bằng lời.** tap-01: hai cân, hai hộp kín có ghi "KHÔNG CÓ GIÓ" /
   "CÓ GIÓ". tap-02: hai chiếc máy giống nhau, một có case một không, rồi so sánh quang hình nhiệt và
   so sánh "cầm tay / không cầm tay". Người xem tự thấy luận điểm bằng mắt.
5. **Chữ trên màn hình của tap-02 sạch.** 93 câu, hàng chục nhãn burn-in — không một nhãn nào sai chính tả
   tiếng Việt. Đây là bằng chứng rằng lỗi chính tả ở tap-01 **không phải điều không thể tránh**.

---

## F1 — high — Nhãn tiếng Việt sai chính tả, và có cả chuỗi rác, đã đi qua 5 vòng chấm

**BẰNG CHỨNG** (tap-01, bản 15:38, đọc từ mp4): `CHÓNG ÁO` (c48, đúng là *chồng*), `PHỎI MỘT MẶT` (c48) và
`PHỎI RỔNG` (c49, đúng là *phơi*), `NƯỚC PHẢI ƠI ĐƯỢC` (c56–57, đúng là *ôi*), `CHỔ THOÁNG GIÓ` (c59, đúng
là *chỗ*), `CÀ HAI MẶT` (c60, đúng là *cả*), và ba chuỗi rác: `MỘI KG KHÔNG KHÍ KHÔ` (c42),
`SỨC CHỪA CAO HƠN` (c44), `HƠN 2 KJ / 19` (c21).

**ẢNH HƯỞNG.** Đây là lỗi người xem đọc đầu tiên, ở 6 trên 60 câu — 10 % phim có chữ sai. Với một kênh
khoa học, một nhãn sai là bằng chứng rằng con số không được kiểm tra.

**ĐÃ SỬA CHƯA.** Trong `src/film.js` **hiện tại** (sửa lúc 19:14–19:24) các lỗi này đã hết: `CHỒNG` ×3,
`PHƠI` ×3, `MỘI KG` = 0, `SỚC CHỪA` = 0, `HƠN 2 KJ` = 0. Vậy nhưng bản dựng đã bán ra vẫn còn lỗi.

**GUARD MỚI.** [`tools/check_vi_labels.py`](../../tools/check_vi_labels.py) — quét mọi chuỗi chữ burn-in
và chữ lời kể của một tập, đối chiếu với một **bảng nhầm lẫn tiếng Việt** (cặp dạng hầu như luôn sai:
`PHỎI`→`PHƠI`, `CHÓNG`→`CHỒNG`, `ƠI`→`ÔI`, `CHỔ`→`CHỖ`, `CÀ`→`CẢ`, `SƠ MI`→`SƠM I`, `HOẠ`→`HỎA`…). Bảng này
lấy từ chính những lỗi đã thấy; mỗi lần thấy lỗi mới thì thêm vào bảng. Chạy trong `review.sh` (vòng hình)
và trong `core/render/review.sh`.

## F2 — medium — Chuỗi rác lọt vào nhãn: nhãn được **gõ tay** ở nhiều nơi nên trôi dạt

**BẰNG CHỨNG.** `MỘI KG KHÔNG KHÍ KHÔ` (tap-01 c42) là một câu bị cắt cụt; `HƠN 2 KJ / 19` (c21) là một
nhãn bị cắt; `SỨC CHỪA CAO HƠN` (c44) mất chữ cuối. Cả ba đều **là nhãn, không phải lời kể** — lời kể
(`voice/lines.json`) thì đúng, vì nó được một vòng chấm riêng đọc và bị sửa.

**NGUYÊN NHÂN.** Nhãn được gõ lại trong `src/film.js` thay vì **lấy từ một chỗ duy nhất**. Cùng một thông
tin có hai nơi, thì một nơi sẽ trôi.

**GUARD MỚI.** Mọi nhãn burn-in phải nằm trong một hằng số dùng chung của tập
(`src/labels.js`), và `check_labels.py` của kênh **phải đòi mọi chuỗi hiện lên màn hình đến từ đó** —
nhãn gõ thẳng trong `film.js` thì báo. Đây là một thay đổi cấu trúc nhỏ ở tập, đổi lại một lớp lỗi.

## F3 — high — Khung hình chết: vật thể nhỏ lơ lửng trong một nền rỗng, ở cả hai phim

**BẰNG CHỨNG.**

| phim | câu | nhìn thấy |
|---|---|---|
| tap-01 | c2 | gần như chỉ có một bức tường trơn |
| tap-01 | c10 | một mặt dệt xám xịt, không đọc ra là vải |
| tap-01 | c12 | một phiến màu be, đọc như đá chứ không phải mép sợi |
| tap-01 | c23 | một bức tường trống |
| tap-02 | c18 | vật thể bị đẩy sang mép phải, một nửa khung là nền tím trống |
| tap-02 | c22 | "ĐIỆN BỊ THẤT THOÁT" — vật thể nhỏ bằng nắm tay giữa một trường rỗng |
| tap-02 | c25, c34, c35, c36, c70 | điện thoại chiếm ~1/4 khung, phần còn lại là nền rỗng |
| tap-02 | c45, c48 | một tấm xám xịt gần như trơn, không có gì xảy ra |

**ẢNH HƯỞNG.** Trong tap-02 có **13 câu trên 93** mà vật thể nhỏ hoặc hư vô — 14 %. Đây là lý do phim
"cảm giác như đọc một bài giải có hình" ở đoạn giữa, dù bố cục tổng thể rất tốt.

**TẠI SAO MÁY KHÔNG THẤY.** Rubric chấm hình (`PROMPT_CRITIC.md` của bước 6) có `DARK`, `SAME`, `RUN`,
`NUM` — **không có câu nào về bố cục**: vật chính có đủ lớn không, khung có đang chứa cái gì không.

**GUARD MỚI (hai tầng).**
1. `core/render/readcheck.mjs` không phải chỗ; thêm vào `core/render/filmcheck.mjs` (hoặc một
   `tools/deadframe.py` mới) một phép đo **mật độ chi tiết** của từng khung: cắt đúng khung giữa mỗi câu
   (dùng `tools/frames_at.py`), tính mật độ cạnh, và báo những câu thấp hơn ngưỡng so với trung vị của
   chính phim đó. Cả "bức tường trơn" lẫn "vật thể bé trong nền rỗng" đều rơi vào cùng một phép đo này.
2. Thêm một tiêu chí **bố cục** vào lời dặn của vòng chấm hình: "vật chính chiếm bao nhiêu phần khung;
   câu nào khung gần như trống thì nói thẳng".

## F4 — medium — Nhãn chỉ vào chỗ trống, hoặc nằm đè lên đúng vật nó gắn vào

**BẰNG CHỨNG.** tap-02: `NHIỆT` (c11) trỏ vào khoảng không trên bàn; `KHÔNG KHÍ` (c54) trỏ vào không
trung; `CHIP` (c39) nằm **đè lên dòng chấm xanh** mà nó gắn vào; `CẢM BIẾN NHIỆT` (c74) nằm đè lên chữ
`Li-io` in trên vỏ pin; `CƠN TỤ` (c30) sát `CUỘN CẢM`. tap-01: nhãn `MỘI KG…` (c42) nằm đè lên số trên
mặt đồng hồ.

**GUARD MỚI.** `channels/tram-nghi-nhieu/tools/check_label_anchors.py` đã có (người chấm tap-04 viết),
nhưng nó chỉ hỏi "nhãn có mỏ neo không". Cần bổ sung: **mỏ neo phải nằm trong vùng có vật** — tức là
điểm neo phải không trùng màu nền và phải nằm trong hộp của vật mà nhãn gắn vào; và **hộp nhãn không được
chồng lên hộp của vật được gắn** (vùng ghi chữ trên bề mặt vật).

## F5 — medium — Chữ in trên vật bị lật ngược hoặc bị cắt

**BẰNG CHỨNG.** tap-02 c43 và c49: chữ `Li-ion` trên vỏ pin bị **lật ngược** (đọc `uo-ıL`); tap-02 c75:
chữ `Li-io` bị **cắt bởi mép khung**. tap-01: mặt dệt ở c10 không đọc được, mép sợi ở c12 đọc như đá.

**GUARD MỚI.** Nếu một mặt vật được vẽ với tỉ lệ đảo (scale âm) hoặc góc quay lộn, thì **không được vẽ
chữ lên mặt đó** — chữ phải được vẽ ở mặt phía người xem. Đây là một quy tắc một dòng trong
`COMPONENTS_SPEC.md` của kênh + một kiểm tra trong `check_props_refs.py` (mặt có chữ phải có `facing: 'front'`).

## F6 — medium — Bàn tay là một cục; ở vài câu nó **là chủ thể của khung**

**BẰNG CHỨNG.** tap-01 c20, c54, c55 (c54 là góc nhìn thứ nhất: bàn tay đưa vào khung, và bàn tay là thứ
duy nhất trong khung). tap-02 c2, c3, c56, c57, c86, c91 — cùng một bàn tay: một khối trơn, ngón tay
dính liền nhau, không có ngón cái rõ.

**TẠI SAO CHƯA AI SỬA.** Vòng chấm vật dựng soi **ba mặt của mỗi vật trong `src/props.js`** — bàn tay
được vẽ trong `src/film.js`, không có trong `props.js`, nên **không vật thể nào vẽ trong `film.js` được
soi ba mặt**. Một bàn tay sẽ bị chấm là "có bàn tay" trong một khung hình nhỏ, và đó là điều duy nhất mà
một vòng chấm ảnh có thể nói.

**GUARD MỚI.** Danh sách "vật thể có mặt trong khung" phải nằm trong `COMPONENTS_SPEC.md`, và
`propcheck.mjs` phải dựng **ba mặt cho từng vật trong danh sách đó**, kể cả vật vẽ trong `film.js`
(bằng cách cho `film.js` xuất phần vẽ của từng vật). Không có cách nào tự động biết "đây là bàn tay" —
nhưng danh sách do người làm khai báo thì máy kiểm được.

## F7 — low — Số lượng vật thể không nhất quán giữa các cảnh liên tiếp

**BẰNG CHỨNG.** tap-02: c63, c64, c65 chỉ có **một** nhiệt kế, c66 thì có **hai** — nhưng đoạn này nói
rõ là so sánh hai máy. Người xem tự hỏi máy nào chưa được đo.

**GUARD MỚI.** Không có cách nào kiểm tra tự động đáng tin (một vật có thể chủ ý vào ra khung hình). Ghi
vào `lessons.md` dưới dạng **"no guard possible — recorded only"**, kèm một câu trong `LOOK.md` của kênh:
"vật so sánh phải xuất hiện đủ số lượng ở mọi cảnh của phép so sánh".

## F8 — medium — Dải sáng cháy ở đáy khung ở hai cảnh cuối của tap-02

**BẰNG CHỨNG.** c92: một dải trắng chạy hết chiều ngang ở ~8 % khung dưới cùng; c93: một nêm trắng ở
góc dưới trái. Cả hai là **cảnh chốt phim**, ngay trước cảnh cuối.

**GUARD MỚI.** `readcheck.mjs` đo độ sáng theo dải để bắt chữ trên nền sáng — một dải cháy ở mép khung rơi
vào cùng một phép đo. Nếu không, thì ít nhất `filmcheck.mjs` nên báo "khung có vùng cháy > 2 % diện tích ở
bốn góc".

---

## Điều khó chịu nhất, và vì sao nó quan trọng hơn cả danh sách trên

**Vòng chấm hình của tap-01 đã soi 5 lượt, vòng QA cuối đã soi 1 lượt, và không vòng nào nào nhắc "khung
này rỗng" hay "chữ này sai".** Cả hai lỗi đều **nhìn thấy được bằng mắt ở khung hình đơn** — không cần
hiểu ngữ cảnh, không cần biết khoa học. Vậy mà người chấm không thấy. Vì sao?

Vì lời dặn của vòng chấm hình **hỏi sai câu hỏi**. Nó hỏi "cái số trên màn hình có đúng không", "có
trùng lặp không", "có chữ đè chữ không" — và **không hỏi** "khung này có đẹp không", "chữ này có đúng
chính tả không", "vật chính có đủ lớn không". Ba câu hỏi đó chính là câu hỏi của người xem.

Nên cải thiện không nằm ở chỗ "thêm một người chấm nữa" (tập đã mất 5 lượt cho mỗi vòng rồi), mà ở
chỗ: **máy đo được thì để máy đo** (mật độ chi tiết, chính tả nhãn, hộp nhãn chồng vật, chữ lật trên
mặt vật), và **câu hỏi cho người chấm thì sửa đúng chỗ** (thêm bố cục, thêm chính tả, thêm "vật thể
có đủ lớn không"). Mỗi phép đo máy đo được là một vòng chấm bớt đi.

---

## Open items

- Hai phim còn phải soi lại sau khi sửa: tap-01 chưa có bản dựng mới (người làm đang sửa `src/props.js`
  lúc 19:51 và viết `PROPS-DIRECTORS-CUT.md` lúc 19:54); tap-02 thì đã có bản 19:51 nhưng chưa có tiếng
  và chưa qua vòng cuối.
- F3, F4, F5, F8 là những phép đo chưa có; chỗ nào làm được thì làm, chỗ nào không thì ghi rõ
  **"no guard possible — recorded only"** trong `lessons.md`.
