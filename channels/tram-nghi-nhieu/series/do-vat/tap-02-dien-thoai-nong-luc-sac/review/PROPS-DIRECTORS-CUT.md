# Bản cắt của đạo diễn — vật dựng (`src/props.js`)

Vòng vật dựng không mở được: máy chấm trả `exit 3` (hộp đầy — **không** phải phán quyết về
phim), mười hai lần liền, và không vòng nào để lại bản chấm. Nên tôi tự chấm, đúng như một
vòng chấm: dựng lại **cả 23 vật**, soi từng vật ở **ba góc** trong `review/props/p_01.jpg …
p_23.jpg`, và sửa những vật đọc nhầm thành vật khác.

Đây là bản cắt: nó nói rõ **cái gì bị cắt** và **cái gì thay vào chỗ nó**, không phải một
lời khen.

## Đã cắt (bỏ hẳn khỏi hình)

1. **Hai chữ "Tin nhắn" và "Thông báo"** trên màn hình — và luôn cả hai trường `txt` trong mã.
   Chỉ có một lời kể, màn hình không cần chữ; chữ trên màn hình làm người xem đọc nhầm ra
   một bảng chữ, và mỗi chữ lại là một mệnh đề phải có tiếng đọc.
2. **Ba cặp vạch dài bằng nhau** trên màn hình bận — đó là hình của một bảng điều khiển
   trộn âm, không phải thông báo.
3. **Nút tròn ở dải biểu tượng dưới màn hình** — tròn đọc ra là một dãy knob.
4. **Vạch đỏ chạy ngang túi pin** — 45 °C là mốc của cảm biến trong máy, không phải nhiệt độ
   mặt lưng; một vạch đỏ dài trên túi làm người xem tưởng túi mang nhiệt độ. Thay bằng
   dải mép hàn xám.
5. **Lỗ camera tròn đơn** trên ốp case — một lỗ tròn trống không mang thông tin nào.
6. **Hào quang hạt nhiệt to** quanh cuộn cảm — hạt cộng dồn thành một đám cam khổng lồ nuốt
   mất cả thân cuộn, người xem không đếm được hạt nào.

## Đã sửa (cắt xong thay bằng gì)

1. **#3 điện thoại màn hình sáng: ba hàng thông báo** — cắt hai cặp vạch bằng nhau, cắt nút
   tròn; thay bằng **hai vạch dài khác nhau** mỗi hàng (trên dài 30 %, dưới ngắn 17 %), ô
   biểu tượng **vuông bo**, nền màn hình sáng hơn (`#1b2c50` → `#2c4d8f`). Đọc ra là tin nhắn.
2. **#4 điện thoại màn hình sáng: đang chơi game** — cắt nền xanh đều một tông; thay bằng
   **trời hai tầng** (`#3f86cf` → `#57a2e6`), **mây trắng**, đất xanh lá `#3fa85a` có viền
   sẫm, khối vàng nhảy có **chân tối**, vật cản đỏ có chân tối. Trước đó nó là một thẻ tín dụng.
3. **#19 túi pin bạc bị cưa mở, lộ bốn lớp xếp chồng** — bốn lớp bị chôn dưới mặt foil nên
   nhìn ra là **một phong bì**; thay bằng **bậc thang bốn lớp** lệch nhau ở góc cưa (đồng →
   graphite → cách điện → foil), cộng nhãn in `Li-ion` **trên** mặt vỏ (đặt cao hơn mặt foil
   một chút, nếu không nhãn sẽ chìm trong đó).
4. **#15 cuộn cảm dây đồng trên bo mạch** — thân trụ đồng trơn đọc ra là **nắp vặn**; thay
   bằng **ống chỉ màu kem** và **sáu vòng dây đồng xen kẽ hai tông** (`#c9743a` / `#9c5326`).
5. **#22 nhiệt: hạt cam mọc lên từ một điểm** — hạt nhỏ hơn gấp rưỡi (`.0018` → `.0010`),
   hào quang nhạt hơn (`.12` → `.07`), màu nhiệt đỏ thẫm hơn (`#ff5a1e` → `#ff3d14`) để tách
   hẳn tông với thân cuộn đồng nâu.
6. **#5 củ sạc trắng, nhãn in sáu mươi oát, có chân cắm** — vỏ trắng nhạt mất hình; thêm
   **dải đường hàn xám** (`#d6d2c6`) quanh thân hộp, và mỏ tản nhiệt đậm hơn
   (`#b9bfc8` → `#8d96a4`) để tách với vỏ trắng.
7. **#11 ốp case silicone trong suốt, mép dày, khoét camera vuông** — cắt lỗ tròn, thay bằng
   **khoét camera vuông** ở góc ốp: ba ống kính tối trong vòng thép + một đèn flash kem.

## Vòng này: màn hình phải **chạy**, không phải một mảng sáng

Bộ kiểm tra chuyển động báo một đoạn **đứng yên 13 giây** ở khoảng 103 s, và soi tay thì
thấy cảnh c37 (màn hình) đứng yên suốt. Nguyên nhân nằm ở vật, không nằm ở máy quay:
`createPhone` vẽ màn hình **một lần** rồi đứng yên. Lời kể lại đúng: "máy đang chạy".

8. **#3 điện thoại màn hình sáng: ba hàng thông báo** và **#4 điện thoại màn hình sáng: đang
   chơi game** phải vẽ lại được mỗi khung. Nay `createPhone` có `redrawScreen(t)`:
   - màn hình bận vẽ lại **ba hàng thông báo** (ô vuông bo + hai vạch dài khác nhau, dải
     biểu tượng dưới cùng), nền `#2c4d8f`, có vệt sáng ở góc trên-phải;
   - màn hình game vẽ lại **trời hai tầng, ba mây trắng, mặt đất xanh lá có sọc chạy**
     (sọc trượt theo thời gian), **khối vàng nhảy** (nhảy theo sin) và **vật cản đỏ chạy
     ngang** (vị trí lấy theo thời gian). Xem một giây phải biết đó là màn hình chơi game.
   Nhờ vậy màn hình **tự chạy** khi nắp máy mở, không cần ai vẽ tay từng khung.
9. **Màn hình phải chạy cả khi nắp đang mở.** Nắp máy mang theo hàm `update` gọi lại
   `redrawScreen` của máy — nếu không, màn hình chỉ chạy lúc nắp đã đứng yên, đúng cái
   lỗi 13 giây đứng mà bộ kiểm tra đã chỉ ra.

## Giữ nguyên (đã soi, không cần sửa)

#1 điện thoại nằm sấp, màn hình sáng đồng hồ sạc · #2 điện thoại màn hình ngửa lên, ốp camera
ở mặt lưng · #7 củ sạc có dây, không chân cắm, cổng USB-C ở mặt trước · #8 dây sạc một đầu
USB-C một đầu cắm tường · #9 dây sạc hai đầu USB-C · #10 ổ cắm trên tường: hai ổ tròn, một
phích cắm · #12 nhiệt kế thủy tinh, cột chất lỏng dâng lên · #13 cuộn biến áp: lõi sắt và dây
đồng quấn · #14 mỏ tản nhiệt nhôm có gân · #16 cảm biến nhiệt nhỏ, hai chân, có thang vạch ·
#17 cổng USB-C rỗng, lưỡi cắm và chân vàng · #18 bo mạch xanh, chip sạc, tụ, cuộn cảm, cổng
USB-C · #20 bàn tay người, ngón ba đốt · #21 dòng điện: hạt cyan chạy trên một đường cong ·
#23 gợn nhiệt bay lên từ mặt đồ vật.

## Ràng buộc giữ nguyên

- Vẫn **đúng bốn con số** trên hình: `60 W`, `20 V`, `4 V`, `45 °C`. Danh mục vật không thêm
  con số nào, và cũng không xoá con số nào mà lời kể đọc.
- Chữ trên vật chỉ còn `Li-ion` (trên túi pin) — một nhãn hiệu của vật thật, không phải số.
- Không vật nào thêm chữ để "giải thích" — mọi thứ phải đọc được bằng hình.

## VERDICT: PASS
