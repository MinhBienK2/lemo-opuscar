# Nhân Vật · Style — kênh về nhân vật, vẽ hai lần

Một style riêng cho kênh: **một nhân vật, hai hình hài**. Cùng một đặc tả được vẽ bằng canvas 2D và
dựng bằng three.js, cạnh nhau, để người xem tự thấy: **cùng một người, không phải hai người giống nhau**.

## 1. Bản chất

Một tập của kênh này **không kể chuyện về nhân vật — nó dựng nhân vật**. Nhân vật được viết ra thành
một đặc tả ngắn (sáu trường JSON), rồi đặc tả đó được trao cho hai bản dựng. Phần đáng xem của tập là
khoảnh khắc hai bản **chạm nhau**: cùng một tư thế, cùng một biểu cảm, cùng một mái tóc.

Kênh nói về **thiết kế nhân vật** — tỉ lệ, tóc, mặt, màu — và về cách một người trông giống nhau khi
đổi bộ dựng. Nó không kể chuyện của nhân vật, và không dạy vẽ.

**Không phải**: phim hoạt hình 2D bình thường, phim 3D bình thường, tutorial Blender, portfolio nhân
vật, hay mọi thứ chỉ để khoe một bản dựng đẹp.

## 2. Nhân vật

**Bích** — nhân vật đầu tiên của kênh. Đầu tròn, tóc bob `#2B2333` rủ xuống quá cằm, áo hoodie gạch
terracotta `#C25E4A` rộng, tay áo dài, quần tối, giày đen. Da `#F2C9A0`. Tỉ lệ: đầu 1,0; thân 2,6;
chi 1,0 → một người khoảng **ba phần năm đầu** (chibi, tay ngắn, chân ngắn).

Nét viền `#1D202A` dày ~2,8 px trên màn hình, **ở cả hai bản dựng**: bản 2D vẽ nét, bản 3D dựng
mảnh sẫm ở chỗ cần (lông mày, mắt, miệng) và bù bằng một nét sẫm ở đường viền của tóc.

Nhân vật của kênh **luôn là một đặc tả**, không bao giờ là một hình vẽ. Không có nhân vật nào được vẽ
tay vào một tập rồi "chuyển" sang 3D: chuyển như vậy là mất nhân vật.

## 3. Màu

| Vai trò | Màu |
|---|---|
| Nền | `#12131A` (than xanh), panel `#1B1D27`, viền `#2E3448` |
| Chữ chính | `#FAF8F5` |
| Chữ phụ | `#8A90A6`, chữ nhỏ `#5A6488` |
| Nét | `#1D202A` |
| Nhấn (gạch nhấn, số) | `#F2C14E` |

Quy tắc: **màu của nhân vật là màu của nhân vật** — nó đến từ `palette` trong đặc tả và không bao giờ
được phủ bởi màu của bối cảnh. Nền luôn tối và trung tính để hai bản dựng cùng đọc được. Mỗi tấm hình
chỉ có **một** màu nhấn của kênh (`#F2C14E`); màu nhân vật không tính vào.

## 4. Bố cục và camera

- **Hai khung cạnh nhau** là bố cục mặc định: bản 2D bên trái, bản 3D bên phải, cùng kích thước, cùng
  tâm, cùng một giây. Người xem so sánh được ngay.
- Nhân vật chiếm khoảng **¾ chiều cao khung**; chân đứng trên một vạch sáng, bóng đổ dưới chân.
- Bản 3D: camera nhìn **chính diện**, cao bằng nửa người, ống kính 30° — không perspective nghiêng, không
  quay vai, không xoay. Bản 2D: nhân vật đứng thẳng, không nghiêng khung.
- Khi tập cần một cảnh khác: cận mặt (bản 2D và bản 3D cùng cận), hoặc nhân vật quay lưng.

## 5. Hai bản dựng

- **Bản 2D**: cel phẳng — một lớp màu, một nét sẫm, một bóng cứng. Không gradient, không blur.
- **Bản 3D**: cùng bảng màu, ánh sáng mềm: một đèn chính ấm, một đèn phụ lạnh, một đèn viền sau. Không
  bloom, không SSAO, không phim hạt.
- **Cùng tư thế**: một `pose` duy nhất đẩy vào cả hai adapter trong cùng một khung hình. Nếu một bản
  ra dáng khác bản kia, đó là lỗi, không phải phong cách.
- **Cùng biểu cảm**: bảng mặt nằm ở `core/cast/cast.mjs`, không nằm trong adapter — nên hai bản cười
  giống nhau.

## 6. Chữ

- **Lilita One**: tiêu đề kênh ("NHÂN VẬT"), 66 px.
- **Fredoka**: nhãn dưới mỗi khung, dòng phụ, 24–28 px.
- Chữ nhỏ kiểu đường dẫn (`cast sheet · bich.json`) ở góc trên bên phải, màu `#5A6488`.
- Tiếng Việt có dấu đặc phải đúng; nếu font không có dấu thì dùng font hệ thống, không dùng font thiếu
  dấu.
- Mọi chữ trên bảng nhân vật phải nằm trọn trong khung và đủ lâu: `readcheck` kiểm việc này.

## 7. Nhịp chuyển động

- Nhân vật chuyển động trên số 1 (24 fps). Không easing kiểu "vũ trụ"; chuyển động của một người là
  chậm và hơi nặng.
- Tư thế đổi theo một vòng **10 giây**: đứng yên → quay người + cười → suy nghĩ → ngạc nhiên → lo →
  về đứng yên. Biểu cảm đổi theo **giây**, không theo khung hình.
- Nhịp thở nhẹ trên vai luôn chạy, kể cả khi nhân vật đứng yên.
- Bản 2D và bản 3D phải ở **cùng một pha**: cùng một `poseAt(t)`, không phải hai bảng thời gian.

## 8. Âm thanh

Kênh chưa có tập, nên âm thanh chưa có bản dựng. Khi có tập: giọng đọc tiếng Việt (một giọng nữ
trẻ, gần và khô), nhạc lùi −8 dB dưới giọng, foley giấy và bút khi viết đặc tả. Bảng nhân vật **không có
tiếng**: nó là trang, không phải phim.

## 9. Quy trình mỗi tập

1. `TREATMENT.md`: ba cấu trúc, chọn một, bảng cảnh.
2. `research/FACTS.md`: mọi con số kèm nguồn (cột 1 và 2 cần nguồn thật).
3. `cast/<tên>.json`: đặc tả nhân vật — sáu trường, không hơn.
4. `voice/lines.json` → edge-tts → kiểm tra lời.
5. `src/film.js`: dùng adapter 2D và adapter 3D từ `core/cast/`.
6. `sh build.sh`: sự kiện → trộn âm → khuôn hình → phụ đề → dựng (−14 LUFS) → poster.
7. `sh $LIB/core/render/review.sh <thư mục phim>`: phải exit 0.
8. So bản 2D với bản 3D ở cùng một giây, bằng mắt.

## 10. Bẫy

- **Đừng** chép rig vào thư mục tập: rig của kênh này nằm ở `core/cast/`, và một bản chép là một cái tìm.
- **Đừng** để bản 3D "đẹp hơn" bản 2D: bản 3D phải là **cùng một người**, kể cả khi bản 2D vẽ đẹp hơn.
- **Đừng** thêm một trường vào đặc tả mà chỉ một adapter đọc: đặc tả là hợp đồng của hai bản dựng.
- **Đừng** để tư thế chỉ đọc được ở một bản: tư thế là ngữ ngữ chung, không phải phong cách riêng.
- **Đừng** dùng `path()` cho hình chữ nhật trong bản 2D — nó làm mềm góc thành bong bóng.
- **Đừng** quên rằng bản 3D cần `three` được import map trỏ tới; một trang thiếu import map sẽ chết
  ngay ở dòng import.
