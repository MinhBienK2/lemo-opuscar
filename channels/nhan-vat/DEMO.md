# Nhân Vật — bảng nhân vật (bảng demo của kênh)

Bảng demo của kênh này là **bảng nhân vật** (`demo/index.html`) — một trang web vẽ **Bích** hai lần,
bản 2D bên trái, bản 3D bên phải, cùng một đặc tả `cast/bich.json`, cùng một tư thế ở mỗi giây. Không
lời, không nhạc, không phụ đề, không thẻ cuối.

Demo: *Bích — một đặc tả, hai hình hài* (10 s, vòng lặp) · `demo/index.html` → `demo/test.mp4`

`demo/build.sh` dựng nó: `sh channels/nhan-vat/demo/build.sh` → `test.mp4` (10 s), `test.jpg` (poster),
`styleframe.jpg` (khung đã duyệt). Không có `mix.py`: bảng demo không có tiếng.

## Cấu trúc

Một đặc tả sáu trường, một vòng tư thế mười giây, hai bản dựng cùng đọc đặc tả đó.

Đặc tả `cast/bich.json`:

| Trường | Giá trị | Nghĩa là gì |
|---|---|---|
| `name` | `Bích` | tên nhân vật |
| `palette.skin` | `#F2C9A0` | da |
| `palette.hair` | `#2B2333` | tóc |
| `palette.hoodie` | `#C25E4A` | áo |
| `proportions.head` | `1.0` | đường kính đầu, tính bằng đầu (1.0) |
| `proportions.body` | `2.6` | chiều cao thân dưới đầu: 2,6 đầu → người khoảng 3,5 đầu |
| `proportions.limb` | `1.0` | độ dài tay chân so với thân |
| `hair.style` | `bob` | kiểu tóc |
| `hair.length` | `0.6` | tóc rủ xuống dưới tâm đầu 0,72 đầu |
| `face.eyes` | `round` | kiểu mắt |
| `face.mouth` | `small` | kiểu miệng |

Mọi số còn lại — vị trí mắt, chiều dài tay, bán kính hông, độ rủ của tóc — **không nằm trong đặc tả**:
chúng do `core/cast/cast.mjs` tính từ ba số tỉ lệ trên. Đó là lý do một đặc tả sáu trường vẫn đủ để dựng
hai bản.

## Cảnh

Bảng demo có **một** cảnh: một khung hình đôi, và trong khung đôi đó nhân vật động.

| # | Giây | Cảnh | Máy | Ghi chú |
|---|---|---|---|---|
| 1 | 0,0–10,0 | Bảng nhân vật: 2D \| 3D | Khung cố định, không cắt | Một vòng tư thế 10 giây, lặp vô tận |

Máy không di chuyển: một bảng nhân vật phải **so sánh** được, nên hai khung phải đứng yên.

### Vòng tư thế

`core/cast/cast.mjs` giữ một bảng mốc, mốc cuối lặp lại mốc đầu:

| Giây | `body` | `head` | `armSwing` | `legStance` | `expression` |
|---|---|---|---|---|---|
| 0,0 | 0° | 0° | −0,9 | −0,3 | neutral |
| 1,5 | 14° | 8° | 0,9 | 0,4 | smile |
| 3,0 | −8° | −6° | 0,2 | 0,1 | think |
| 4,5 | 6° | −4° | −0,4 | −0,2 | surprise |
| 6,0 | −14° | 5° | 0,5 | 0,3 | worry |
| 7,5 | 0° | 0° | −0,6 | −0,1 | neutral |
| 10,0 | 0° | 0° | −0,9 | −0,3 | neutral |

Giữa hai mốc, các số nội suy theo smoothstep; **biểu cảm đổi theo giây**, không nội suy. Bản 2D và bản
3D nhận **cùng một đối tượng tư thế** trong cùng một khung hình — đó là lý do hai bản khớp nhau.

Hai giây đã thấy rõ: ở `t=0,5` Bích đứng thẳng, tay sau lưng, mặt bình thường; ở `t=1,5` Bích quay
sang phải 14°, nghiêng đầu 8°, hai tay vung ra trước và cười.

## Bảng màu & đạo cụ

Màu của nhân vật đến từ `palette` trong đặc tả; màu của trang đến từ `STYLE.md`.

| Vai trò | Màu |
|---|---|
| Nền trang | `#12131A` |
| Panel | `#1B1D27`, viền `#2E3448`, bo góc 18 px |
| Chữ tiêu đề | `#FAF8F5` (Lilita One 66 px) |
| Chữ phụ | `#8A90A6` / `#5A6488` (Fredoka 24–28 px) |
| Gạch nhấn | `#F2C14E` |
| Nét | `#1D202A` |

Nhân vật: da `#F2C9A0`, tóc `#2B2333`, hoodie `#C25E4A`, quần `#7A4038` (tự suy ra từ hoodie), giày
`#1D202A`.

## Thẻ cuối

Bảng demo này **không có thẻ cuối**: nó là một trang, vòng lặp vô tận, và người xem dừng lại bao lâu thì
được. Không có nút "theo dõi", không có logo, không có chữ ký.

## Ghi chú dựng

Bảng demo là một trang tuân thủ **hợp đồng trang** của thư viện, nên các công cụ chạy được với nó:

```sh
sh channels/nhan-vat/demo/build.sh                                # test.mp4 + test.jpg + styleframe.jpg
node core/render/still.mjs channels/nhan-vat/demo 0.5 1.5 --out /tmp/castsheet   # ảnh để soi
node core/render/readcheck.mjs channels/nhan-vat/demo                            # chữ trên trang
```

Cấu trúc tệp:

```
channels/nhan-vat/
├── cast/bich.json      # đặc tả
└── demo/
    ├── index.html      # trang bảng nhân vật: import map (three), hai canvas, window.render/DUR/TEXTS
    ├── build.sh        # dựng test.mp4, test.jpg, styleframe.jpg
    ├── CREDITS
    ├── test.mp4        # bản demo: 10 giây, vòng lặp, không có tiếng
    ├── test.jpg
    └── styleframe.jpg
```

Trang tự nó làm ba việc: nạp đặc tả qua `loadSpec('../cast/bich.json')`, dựng hai adapter (`createView` +
`createCharacter` cho cả hai), và mỗi khung hình đẩy **một** `poseAt(t)` vào cả hai.

Trang **phải** có import map cho `three` (như `styles/backrooms/demo/index.html`), nếu không trang chết
ở dòng import của adapter 3D.

## Bẫy của chính bảng demo này

- Trên máy không có GPU, WebGL chạy bằng SwiftShader và **mất WebGL context** với backend mặc định:
  khi đó khung 3D trắng trơn, không phải lỗi của trang. Chạy với `LEMO_ANGLE=swiftshader` (hoặc
  `vulkan`) để có backend sống.
- `readcheck` hỏi trang mọi 0,04 giây: nếu `window.TEXTS(t)` trả về chữ không nằm trọn trong khung, công
  cụ báo lỗi. Nhãn dưới khung phải nằm trong khung.
- Bản 2D vẽ bằng đơn vị "đầu" và lật trục Y: một đường vẽ quên lật sẽ bị lộn ngược. Kiểm tra bằng
  ảnh, không bằng mắt code.
- Cùng một nhân vật ở hai bản dựng chỉ giống nhau **khi chúng đọc cùng một đặc tả**: sửa trực tiếp
  trong một adapter là cách nhanh nhất để làm hỏng cả hai.

## Những tập sắp tới

Kênh chưa có tập. Tập đầu tiên sẽ lấy chính Bích này làm nhân vật và làm cột **"Hai hình hài"**: một
tập dài khoảng 5 phút đi từ một đặc tả sáu trường đến hai bản dựng, kể những chỗ chúng khớp và những
chỗ chúng không khớp, và kết bằng một bản đặc tả mới cho một nhân vật khác.
