# Bản cắt của đạo diễn — bản đặc tả đạo cụ (`COMPONENTS_SPEC.md` + `LOOK.md` + mã)

Vòng soát tài liệu không mở được (`exit 3`, hộp đầy — không phải phán quyết về phim), nên tôi
tự soát: đối chiếu **từng dòng của bản đặc tả** với mã đang chạy (`src/props.js`,
`src/set.js`, `src/film.js`), rồi sửa những dòng nói sai về phim.

Đây là bản cắt: nó nói **mục nào bị cắt, mục nào được viết lại**, và vì sao — không phải
một lời khen chung.

## Đã cắt khỏi bản đặc tả (mô tả cũ không còn đúng hình)

1. **"Chỉ hai chữ 'Tin nhắn' và 'Thông báo'"** ở dòng *Màn hình bận* — màn hình không còn chữ
   nào; hai trường `txt` đã bị xoá khỏi mã. Dòng này được viết lại: ba hàng thông báo, mỗi
   hàng một ô vuông bo + hai vạch dài khác nhau.
2. **"khoét camera"** ở dòng *Ốp case silicone* — thực tế là **khoét camera vuông**: ba ống
   kính tối trong vòng thép + một đèn flash kem. Viết lại.
3. **"Lõi hình trụ, xoắn dây đồng"** ở dòng *Cuộn cảm dây đồng* — thực tế có **ống chỉ màu
   kem** và **sáu vòng dây đồng xen kẽ hai tông**. Viết lại.
4. **Dòng *Túi pin (mổ)* thiếu cả nhãn `Li-ion` lẫn bậc thang bốn lớp** — hai thứ đó quyết
   định vật có đọc ra là túi pin nhiều lớp hay không. Bổ sung vào dòng.
5. **Cột "Vai trò & Shot" của các vật** từng gán sai cảnh: vật ở N1 (bàn cạnh giường) và ở
   N3 (trong điện thoại) là **cùng một vật**, không phải hai bản dựng riêng; củ sạc thuộc
   N1 **và** N2 (bản bị cưa); dây sạc thuộc N1. Đã sửa lại theo bản đồ nhát thật, đối chiếu
   bằng `sh('N?', 'cN', …)` trong `src/film.js`.
6. **Dòng *Củ sạc* thiếu dải đường hàn và màu mỏ tản nhiệt** — vỏ trắng nhạt mất hình trên
   hình thật; bản đặc tả phải nói đúng những gì giữ hình. Đã bổ sung vào dòng.

## Vòng này: ba dòng của bản đặc tả phải nói đúng cái màn hình và cái túi pin đang làm

7. **Dòng *Màn hình bận* và *Màn hình game* phải nói rõ màn hình VẼ LẠI mỗi khung**
   (`redrawScreen(t)`), không phải một mảng sáng dựng sẵn: trời hai tầng, ba mây, mặt đất có
   sọc chạy, khối vàng nhảy, vật cản đỏ chạy ngang. Không có dòng này thì người đọc bản đặc
   tả tưởng màn hình là vật tĩnh, và mã cũ quả thế — đó là lý do một đoạn 13 giây đứng.
8. **Dòng *Nắp máy (màn hình)* phải nói nắp mang theo hàm vẽ lại màn hình** — vì trong c37
   nắp đang mở mà màn hình phải chạy theo.
9. **Dòng *Dòng điện trong máy* phải nói dòng chạy tới chân tế bào** — c35 và c36 đổi máy
   quay (ghì sát túi pin, rồi cận vào chân tế bào) nên hình đã đổi: dòng hạt không còn là
   một đường chấm bi ở mép khung nữa.

## Đã viết lại cho khớp mã

- Bản đặc tả màn hình bận và màn hình game.
- Bản đặc tả ốp case (khoét vuông) và túi pin mổ (nhãn + bậc thang bốn lớp).
- Bản đặc tả củ sạc (dải đường hàn xám, mỏ tản nhiệt xám lạnh `#8d96a4`) và cuộn cảm.
- `LOOK.md`: thêm **Vòng 8** — danh sách tám vật đọc sai thành vật khác và cách sửa, cùng ba
  nhát phải đổi máy quay (c86, c78, c14). Sửa luôn mô tả máy quay của c78 và c86 cho khớp
  toạ độ đang chạy. Thêm **Vòng 9** — c35, c36, c37 đổi máy quay, thẻ `TÚI PIN` dời từ c27
  sang c35, nắp máy mở dần trong chính nhát c37; và viết lại dòng 35, 36, 37 của bảng
  93 nhát cho khớp với cái máy quay đang chạy.
- `src/MAP.md`: đồng bộ lại **số dòng** của bản đồ mã sau khi mã dài ra (`check_map.py` báo
  15 dòng lệch) và sửa danh sách điểm neo — các thẻ bám vào `crossEdge`/`heat`/`labelRight`,
  không phải `graphite`/`labelRight` như bản đồ cũ nói.

## Cố ý không đưa vào bản đặc tả

1. **Không mô tả nội dung màn hình bằng chữ** — vì màn hình không có chữ.
2. **Không ghi bất kỳ con số nào ngoài bốn số được phép** (`60 W`, `20 V`, `4 V`, `45 °C`) —
   kể cả số của rig in sẵn (`IC-7404`, `2416`, `3.85V 4500mAh`), mà mã phải xoá.
3. **Không ghi kích thước nào không đo được** — mọi kích thước trong bản đặc tả là số đo
   thật của vật trong phim.

## VERDICT: PASS
