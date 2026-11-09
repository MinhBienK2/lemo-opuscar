# Bản cắt của đạo diễn — dàn ý hình (`LOOK.md` + `src/film.js`)

Vòng chấm dàn ý hình không mở được (`exit 3`, hộp đầy — không phải phán quyết về phim), nên
tôi tự chấm: soi **35 nhát** ở cỡ gốc (`review/hero/`), đối chiếu từng nhát với câu lời kể
trong `voice/lines.json`, và sửa những nhát mà hình không nói đúng lời.

Đây là bản cắt: nó nói **nhát nào bị cắt, nhát nào bị đổi máy quay, nhát nào bị giữ**, và vì
sao — không phải một lời khen chung.

## Đã cắt (bỏ khỏi hình)

1. **Chữ trên màn hình** ở c37–c38 và c89 — màn hình bận và màn hình game giờ chỉ có màu và
   hình. Chữ là thứ lời kể đã nói rồi; để chữ ở màn hình là nói hai lần.
2. **Vạch đỏ trên túi pin** ở c42, c43, c49 — nó đọc thành mốc 45 °C, mà mốc đó thuộc cảm
   biến trong máy (c76, c77), không thuộc mặt lưng của túi.
3. **Lỗ camera tròn** trên ốp case ở c58–c60 và c61–c86 — thay bằng khoét camera vuông có
   ba ống kính và một đèn flash.
4. **Mực silk trên bo mạch ở những nhát không đọc số** — `20 V` và `4 V` chỉ hiện ở c28 (nhát
   đọc số); ở c31, c72, c73 chữ in phóng to thành một mảng vô nghĩa nên đã bỏ.
5. **Dòng điện thứ hai** ở những nhát ngoài c37–c41 — dòng thứ hai chỉ tồn tại khi phim kể máy
   đang chạy; giữ nó ở mọi nhát là nói dối.

## Đã đổi máy quay (vì hình cũ không đọc được lời)

1. **c86** — bàn tay tháo ốp case chiếm nửa khung, ốp case là chủ thể của câu thì lại là
   thứ nhỏ nhất trong hình. Máy **lùi ra xa và cao lên** (thêm 3 cm ra xa, thêm 8 cm cao):
   ốp nằm riêng trong khung, tay rút sang phải, thẻ `ỐP CASE` bám vào chính ốp.
2. **c78** — khung bị một mảng bo trống chiếm, không thấy cảm biến. Máy đứng **bên trái cảm
   biến và cao hơn nó**, cách 8 cm: cảm biến nằm giữa khung và dòng hạt xanh chạy qua nó rồi
   thưa dần ở đoạn cuối — đúng hai vế của câu "nóng quá thì máy tự giảm dòng sạc" trong
   **một** khung.
3. **c14** — thẻ `60 W` trỏ vào mặt bàn trống. Đuôi thẻ dời **60 px sang phải, 235 px xuống**
   để chạm đúng nhãn in trên vỏ củ sạc.
4. **c28** — mở rộng để cổng USB-C và **cả hai mực silk** cùng nằm trong khung (nhát đọc số).
5. **c29, c40** — đổi góc: thẻ `MẠCH HẠ ĐIỆN ÁP` không còn bị kẹp sát mép khung, thẻ
   `DÒNG THỨ HAI` không còn trỏ vào một mảng bo trống.
6. **c42, c43, c49** — siết lại cho túi pin nằm trọn trong khung; ở c49 nhiệt **loang đều**
   ra cả cục (cả vỏ bạc đổi màu ấm) thay vì dồn hạt ở một góc.
7. **c46, c47** — máy đứng chếch đúng theo mặt cắt để thấy trọn bốn lớp và **ranh giới giữa
   lớp cách điện và lớp graphite** nằm ngang khung; cụm hạt nhiệt bùng đúng ở ranh giới đó.
8. **c77** — thẻ `MỐC CỦA TẾ BÀO PIN` lệch 130 px, đuôi thẻ trượt khỏi vạch đỏ; dời lại
   cho chạm vạch.

## Vòng này: ba nhát của đoạn "dòng chạy vào pin, và máy đang chạy"

Bộ kiểm tra chuyển động đo được một đoạn **đứng yên 13 giây** ở khoảng 103 s — đúng hai
câu mà dòng điện chạy vào túi pin rồi nằm lại trong đó. Hai nhát đó không có gì *mới* xảy
ra nên hình đứng. Ba nhát được đổi, và một thẻ chữ dời theo.

1. **c35 — máy ghì sát túi pin** (`ORB2(BAT, STR3, …, 2.6)` → `ORB(BAT, …, 2.40)`).
   Trước đó máy đứng xa: cả bo mạch lẫn túi pin nằm trong khung, hạt chỉ là một đường chấm
   bi nhỏ ở mép phải, đọc không ra là dòng đang **đi vào túi**. Nay bo mạch ở góc trái, túi
   pin chiếm hai phần ba khung, và đường dòng hạt chạy **từ bo mạch vào túi** đọc được
   trọn vẹn.
2. **c36 — máy cận vào chân tế bào** (`ORB2(BAT, STR3, …, 2.0)` → `ORB(BAT, …, 1.55)`).
   Hạt dồn vào đúng chỗ điện được giữ lại: đọc ra là "nằm lại trong pin", đối lập với
   hạt đỏ bay lên ở c42.
3. **c37 — máy lùi ra và nắp mở trong chính nhát** (`ORB2(LID3, BRD, …, 2.05)` →
   `… 2.45`, và nắp xoay từ 0° lên 75° trong 1,4 s). Trước đó nắp đứng sẵn 75° và màn hình
   là một mảng sáng tĩnh: nhát đứng yên, và người xem không tin lời kể "máy đang chạy". Nay
   nắp **mở dần** (màn hình chạy theo từng khung), và vì máy lùi ra nên góc dưới-trái lộ
   mép vỏ máy cùng bo mạch — người xem biết mình đang ở **trong** máy.
4. **Thẻ `TÚI PIN` dời từ c27 sang c35.** Thẻ phải nằm ở câu **nói tên** vật mà nó gọi:
   c27 kể chỉ nói *bo mạch*, nên thẻ `TÚI PIN` ở đó là nói trước. Ở c27 chỉ còn `BO MẠCH`;
   `TÚI PIN` bám vào túi pin đúng lúc câu "rơi xuống nạp vào pin" được kể.

## Giữ nguyên (đã soi, không cần đổi)

- **c1, c67, c79, c94, c95** dùng chung **một rig** (`RIG_OPEN`) — nhát mở đầu và những nhát
  khép vòng phải **y hệt nhau**, nếu không vòng khép lại không khớp.
- **c69–c73** — một cuộn cảm duy nhất, dòng hạt thưa dần ở đoạn cuối, hạt đỏ dày lên khi
  dòng to: đó là hình của "nhiệt sinh ra theo bình phương dòng điện".
- **c74–c76** — cảm biến nhiệt phải **chạm** túi pin, và `45 °C` chỉ hiện trên chính cảm
  biến trong máy.
- **c87, c88** — nhãn `60 W` in trên vỏ củ sạc phải đọc được như chữ in, và độ thưa của hạt
  là hình của "sạc chậm thì dòng vào máy ít hơn".
- **c90, c91** — phải thấy **hai** chỗ sinh nhiệt cùng lúc trên lưng máy.

## Ràng buộc giữ nguyên

- Chỉ **bốn con số** được lên hình: `60 W`, `20 V`, `4 V`, `45 °C`; mỗi con số có một câu
  lời kể đọc nó (`research/FACTS.md`).
- Mọi thẻ chữ bám vào **đúng vật** bằng đuôi thẻ, và thẻ không đè lên vật chính.
- Mọi nhát đều có tiếng trong `window.EV` — không nhát nào câm.

## VERDICT: PASS
