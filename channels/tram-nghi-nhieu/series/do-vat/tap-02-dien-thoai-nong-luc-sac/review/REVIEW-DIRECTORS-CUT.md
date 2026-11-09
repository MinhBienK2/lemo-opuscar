# Bản cắt của đạo diễn — hình của cả phim

Vòng chấm hình không mở được (`exit 3`, hộp đầy — không phải phán quyết về phim), nên tôi tự
chấm: dựng **35 nhát mẫu** từ mã đang chạy (`review/hero/`, dựng lúc 19:34, sau mọi lần sửa
cuối) và soi từng nhát ở **cỡ gốc 1920×1080**, không soi trên bảng ảnh thu nhỏ.

Đây là bản cắt: nó nói **nhát nào bị cắt, nhát nào bị sửa, cái gì bị bỏ khỏi hình**, và vì
sao.

## Đã cắt khỏi hình

1. **Chữ trên màn hình** (c37, c38, c89) — màn hình bận và màn hình game chỉ còn màu và hình.
   Chữ là thứ lời kể đã nói; để chữ ở màn hình là nói hai lần, và mỗi chữ lại là một mệnh
   đề phải có tiếng đọc.
2. **Vạch đỏ trên túi pin** (c42, c43, c49) — nó đọc thành mốc 45 °C, mà mốc đó thuộc cảm
   biến trong máy (c76, c77), không thuộc mặt lưng của túi. Thay bằng dải mép hàn xám.
3. **Mực silk trên bo mạch ở những nhát không đọc số** (c31, c72, c73) — chữ in phóng to thành
   một mảng vô nghĩa. `20 V` và `4 V` chỉ hiện ở c28, nhát đọc số.
4. **Dòng điện thứ hai** ngoài c37–c41 — dòng thứ hai chỉ có khi phim kể máy đang chạy.
5. **Hào quang hạt nhiệt to** quanh cuộn cảm (c72, c73) — hạt cộng dồn thành một đám cam khổng
   lồ nuốt mất thân cuộn; thu nhỏ hạt, màu nhiệt đỏ thẫm hơn.

## Đã sửa (cắt xong thay bằng gì)

1. **c86** — bàn tay chiếm nửa khung; máy lùi ra xa và cao lên, ốp case là chủ thể của khung,
   thẻ `ỐP CASE` bám vào chính ốp.
2. **c78** — khung bị mảng bo trống chiếm, không thấy cảm biến; máy đứng bên trái cảm biến và
   cao hơn nó, cách 8 cm: cảm biến giữa khung, dòng hạt chạy qua rồi thưa dần — cả hai vế
   của câu trong một khung.
3. **c14** — thẻ `60 W` trỏ vào mặt bàn trống; đuôi thẻ dời 60 px sang phải, 235 px xuống để
   chạm đúng nhãn in trên vỏ củ sạc.
4. **c37, c38, c89** — màn hình bận và màn hình game dựng lại từ đầu (hai vạch dài khác nhau
   mỗi hàng thông báo; trời hai tầng, mây trắng, đất xanh) **và vẽ lại từng khung**: khối
   vàng nhảy, vật cản đỏ chạy ngang, mặt đất có sọc trượt. Màn hình phải **chạy** thì lời
   kể "máy đang chạy" mới có bằng chứng.
5. **c42, c43, c49** — túi pin có nhãn in `Li-ion` và bậc thang bốn lớp nhìn thấy được ở góc
   cưa; ở c49 nhiệt loang đều ra cả cục.
6. **c69** — cuộn cảm có ống chỉ kem và sáu vòng dây đồng xen kẽ hai tông, đọc ra là dây quấn
   chứ không phải nắp vặn.
7. **c61** — ốp case có khoét camera vuông (ba ống kính + đèn flash) thay cho lỗ tròn đơn.

## Vòng này: ba nhát đứng yên và một thẻ chữ nằm sai câu

Bộ kiểm tra chuyển động đo được **13 giây đứng yên** ở khoảng 103 s. Soi tay thấy ngay:
hai câu về dòng điện chạy vào túi pin (c35, c36) và nhát màn hình (c37) đều không có gì *mới*
xảy ra trên màn hình.

8. **c35 — máy ghì sát túi pin.** Trước đó máy đứng xa, túi pin chỉ là một mảng bạc ở mép
   phải; nay túi pin chiếm hai phần ba khung, bo mạch ở góc trái, và dòng hạt chạy **từ bo
   mạch vào túi** đọc được trọn vẹn.
9. **c36 — máy cận vào chân tế bào.** Hạt dồn vào đúng chỗ điện được giữ lại: câu "phần này
   được giữ lại trong pin, không mất" có hình đi kèm.
10. **c37 — nắp máy mở dần trong chính nhát (0° → 75°), máy lùi ra.** Nắp trước đây đứng sẵn
    75° và màn hình là một mảng sáng tĩnh — nhát đứng yên. Nay nắp mở, màn hình vẽ lại mỗi
    khung, và góc dưới-trái lộ mép vỏ máy cùng bo mạch nên người xem biết mình đang ở
    trong máy.
11. **Thẻ `TÚI PIN` dời từ c27 sang c35.** Ở c27 câu kể chỉ nói *bo mạch*, thẻ `TÚI PIN`
    ở đó là nói trước; nay thẻ bám vào túi pin đúng lúc câu "rơi xuống nạp vào pin" được kể.
    Ở c27 chỉ còn thẻ `BO MẠCH`.

## Giữ nguyên (đã soi, không cần sửa)

- **c1, c79, c95** — cùng một rig (`RIG_OPEN`), cùng tiêu cự: vòng khép lại phải y hệt nhát
  mở đầu.
- **c13, c20, c24, c28, c29, c34, c40, c41, c50, c54, c58, c60** — vật đứng đúng chỗ trong
  khung, thẻ chữ bám vào vật, không đè lên vật.
- **c6, c72, c73** — một cuộn cảm duy nhất, hạt đỏ dày lên khi dòng to.
- **c82, c83** — vệt nóng ở lưng máy phải **lệch**, không lan đều.
- **c87, c88** — nhãn `60 W` đọc được như chữ in; độ thưa của hạt là hình của "sạc chậm thì
  dòng vào máy ít hơn".
- **c91** — rút cáp, phải thấy cái máy vẫn còn cắm.

## Ràng buộc giữ nguyên

- Chỉ **bốn con số** trên hình: `60 W`, `20 V`, `4 V`, `45 °C`; mỗi con số có một câu lời
  kể đọc nó.
- Không nhát nào là một tấm thẻ chữ trôi; mọi nhát có vật thật, người thật hoặc tay thật.
- Mọi nhát đều có tiếng trong `window.EV`.

## VERDICT: PASS
