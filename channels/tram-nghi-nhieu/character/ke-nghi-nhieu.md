# Kẻ Nghĩ Nhiều — người dẫn của kênh

Người dẫn duy nhất của Trạm Nghĩ Nhiều, và là giọng kể duy nhất của mọi tập. Kẻ Nghĩ Nhiều hay nghĩ quá nhiều về những thứ ai cũng gặp mà ít ai hỏi tới cùng. Họ nói như một người bạn tò mò, không giảng bài: "mình cứ thắc mắc…", "hóa ra…". Cách hiểu phổ biến do chính người dẫn nói ra ("mình từng nghĩ…"), rồi câu chuyện lật lại.

Nhân vật của cả kênh nằm trong `character/`, mỗi người một hồ sơ như file này. Code vẽ nằm ở `../rig/`, vì mọi tập import nó từ đó.

## Hình dáng

Màu lấy từ `PAL` trong `rig/character.js`. Code là nguồn đúng; ảnh và chữ ở đây mô tả nó.

| Phần | Mô tả | Màu |
|---|---|---|
| Đầu | hình vuông bo tròn (squircle), màu kem | `PAL.skin` `#fff0d8` |
| Tóc | xanh than, vài lọn lệch | `PAL.hair` `#202746` |
| Sợi tóc đèn | một sợi tóc dựng lên, đầu là bóng đèn; đó là **đồng hồ cảm xúc**: dựng khi hào hứng, rũ khi buồn, nằm ngang khi mệt, sáng khi có ý tưởng | `PAL.bulb` `#ffd34f` |
| Áo | hoodie vàng, rộng, tay áo dài che tay; ngực trái có **biểu tượng pin**: pin cạn dần theo nhịp tập | `PAL.hoodie` `#f7bd27` |
| Quần | xanh đậm | `PAL.pants` `#252d50` |
| Nét viền | dày khoảng 3,4 px trên màn hình ở mọi cỡ | `PAL.ink` `#171a2b` |

`ke-nghi-nhieu-sheet.jpg` là bảng đặc tả cũ: nó còn vẽ Rối, nhân vật đã bỏ khỏi kênh. Khi vẽ lại bảng, chỉ vẽ Kẻ Nghĩ Nhiều.

## Biểu cảm

`EXPR` trong `rig/character.js`: `neutral`, `talk`, `smile`, `happy`, `excited`, `surprised`, `shocked`, `thinking`, `skeptical`, `smug`, `worried`, `sad`, `tired`, `annoyed`, `embarrassed`, `determined`, `deadpan`, `flat`, `spin`. Thêm một biểu cảm thì thêm vào `EXPR`, không vẽ mặt riêng trong tập.

Đổi biểu cảm thì mặt chuyển dần: `faceKeys` trong `rig/keys.js`, hoặc `blendE`.

## Bốn cách xuất hiện

| Cách | Khi nào | Vẽ bằng |
|---|---|---|
| ở nhà | mở phim, nối các hồi, gọi tên điều vừa thấy; góc làm việc ấm áp: bàn, đèn, giá sách, bảng ghim | `figure(g, { E, talk, legs: { mode: 'sit' }, … })` trong set nhà của tập |
| trong cảnh | người dẫn bước vào thế giới câu chuyện, có thể mặc đồ hợp cảnh | `figure(g, { legs: { mode: 'walk', ph }, … })` |
| vòng tròn ở góc | bình luận ngắn trên hình câu chuyện, không chiếm khung | `hostPip(g, T, sh, { corner, E, talk })` trong `rig/host.js` |
| cận mặt | một cú phản ứng: một câu đùa, một cái nhăn mặt, một "khoan đã…" | `reactClose(g, T, { E, talk })` trong `rig/host.js` |

Phần lớn phim là thế giới câu chuyện. Người dẫn không có mặt trong mọi shot.

## Giọng

edge-tts `vi-VN-NamMinhNeural`, `rate +5%`, `pitch -8Hz` (mặc định trong `voice/tts_vi.py`). Một giọng cho cả phim, và tập không đổi `voice`, `rate` hay `pitch`. Người trong câu chuyện diễn bằng hành động, không nói thoại.
