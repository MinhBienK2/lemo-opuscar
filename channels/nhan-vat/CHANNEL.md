# Nhân Vật — kênh và quy trình sản xuất

Kênh về **nhân vật**: mỗi tập lấy một nhân vật, viết nó ra thành **một đặc tả** (cast spec), rồi cho nó
sống trong **hai hình hài cùng lúc** — một bản vẽ bằng canvas 2D, một bản dựng bằng three.js. Hai bản
phải là **cùng một người**: cùng tỉ lệ, cùng màu, cùng tóc, cùng biểu cảm. Đó là điều kênh này dạy.

**Kênh chưa có tập nào.** Hôm nay kênh giữ đúng một thứ: **bảng nhân vật** (`cast/`) — trang web vẽ
Bích hai lần, 2D bên trái, 3D bên phải. Mọi tập sắp tới sẽ lấy bảng này làm mẫu.

## 1. Danh tính kênh

| | |
|---|---|
| Tên | **Nhân Vật** |
| Handle | `@NhanVat` |
| Thể loại | Education / Entertainment (thiết kế nhân vật) |
| Mô tả | *"Một nhân vật, hai hình hài: cùng một đặc tả, cùng một người — 2D vẽ tay, 3D dựng bằng máy."* |
| Nhân vật | **Bích** (nhân vật đầu tiên của kênh) |
| Ngôn ngữ | Tiếng Việt |
| Nhịp đăng | 1 tập / tuần (90–180 s) + 1 tập dài 5–8 phút / 2 tuần |

**Ảnh đại diện & banner**: nền `#12131A`, hai khung đặc tả cạnh nhau — bên trái là Bích vẽ phẳng (cel),
bên phải là Bích dựng 3D, cùng một tư thế; giữa hai khung là một đường mảnh `#2E3448`. Chữ "NHÂN VẬT"
trắng kem, chữ nhỏ `cast sheet · <tên>.json` xám `#5A6488`.

## 2. Các cột nội dung

1. **Nhân vật có thật** — một người, một nhân vật lịch sử: từ chính tài liệu, có nguồn.
2. **Nhân vật trong truyện** — một người từ văn bản: từ nguyên tác, có trích dẫn.
3. **Nhân vật của kênh** — Bích và những người sau Bích: cách một nhân vật được **thiết kế** (tỉ lệ,
   tóc, mặt, màu).
4. **Hai hình hài** — cùng một đặc tả, hai bản dựng: bản 2D và bản 3D cạnh nhau, và **những chỗ chúng
   không khớp** — phần đáng xem nhất của tập.

Mỗi tập thuộc đúng một cột; đổi cột là đổi bối cảnh (bàn dựng trong 2D / phòng kính trong 3D / trang
đặc tả trên nền tối).

## 3. Quy trình một tập

Trong `channels/nhan-vat/<tập>/`:

1. **Chủ đề + nguồn** → `research/FACTS.md`: mọi con số kèm trích dẫn (DOI/link), và đánh dấu rõ điều
   gì **không** được nói quá.
2. **Đặc tả nhân vật** → `channels/nhan-vat/cast/<tên>.json`: một tệp JSON, đúng sáu trường
   (`name`, `palette`, `proportions`, `hair`, `face`) — xem `core/cast/README.md`. Tệp này là **nguồn
   sự thật duy nhất** về ngoại hình nhân vật: cả bản 2D lẫn bản 3D đọc nó, không ai chép lại nhau.
3. **Kịch bản** → `voice/lines.json`: mỗi câu một ý, viết số thành chữ.
4. **Hình ảnh** → `src/film.js`: dùng **rig dùng chung** của thư viện:
   ```js
   import { createView, createCharacter } from '/core/cast/adapter-2d.mjs';
   import { createView as createView3D, createCharacter as createCharacter3D } from '/core/cast/adapter-3d.mjs';
   ```
   Cùng một `spec`, hai adapter, cùng một `pose` cho mỗi khung hình. Tập không tự viết lại nhân vật.
5. **Dựng** → `sh build.sh`: `events.mjs` → `mix.py` → `video.mjs` → `srt.py` → `mux.sh` (−14 LUFS) →
   poster.
6. **Cổng kiểm tra** → `sh $LIB/core/render/review.sh <thư mục phim>`: drawcheck, readcheck, khung hình
   review, độ lớn tiếng, khung đen. **Nó phải exit 0** trước khi tập được coi là xong.
7. **Kiểm tra bằng mắt**: xem 6–10 khung hình giữa mỗi cảnh; so **bản 2D với bản 3D** ở cùng một giây
   (tư thế có khớp không, biểu cảm có khớp không); đọc phụ đề.

### 3b. Bảng nhân vật (cast sheet)

`channels/nhan-vat/cast/index.html` là trang của kênh: nó **không phải phim**, không có lời, không có
nhạc, không có phụ đề. Nó là một trang tuân thủ hợp đồng trang (`window.READY`, `window.render(t)`,
`window.DUR`, `window.TEXTS(t)`) nên các công cụ của thư viện vẫn chạy được với nó:

```sh
node core/render/still.mjs channels/nhan-vat/cast 0.5 1.5 --out /tmp/castsheet
node core/render/readcheck.mjs channels/nhan-vat/cast
```

Nếu thêm một nhân vật, thêm `cast/<tên>.json` và sửa trang để vẽ thêm một cặp khung.

## 4. Cấu trúc thư mục

```
channels/nhan-vat/
├── CHANNEL.md          # bản đồ kênh: danh tính, quy trình, cấu trúc (tệp này)
├── STYLE.md            # ngôn ngữ hình ảnh của kênh
├── DEMO.md             # bảng nhân vật đã cho thấy điều gì
├── style.json          # kênh là một style: slug, tên, base, dòng giới thiệu
├── cast/
│   ├── bich.json       # đặc tả của Bích
│   └── index.html      # bảng nhân vật: Bích 2D và Bích 3D cạnh nhau
├── rig/                # (dự kiến) phần vẽ riêng của kênh, trên nền rig dùng chung
├── mix.py              # (dự kiến) nhạc + ambience + foley
├── fonts/              # (dự kiến) font của kênh
└── <tập>/              # (chưa có) mỗi tập là một phim của kênh
    ├── TREATMENT.md
    ├── CREDITS
    ├── film.json
    ├── research/FACTS.md
    ├── index.html
    ├── build.sh
    ├── src/
    ├── voice/
    └── out/
```

**Nhân vật không thuộc về tập nào.** Nhân vật thuộc về **kênh**: một nhân vật dùng ở ba tập vẫn là
một tệp `cast/<tên>.json`, và mọi tập đọc tệp đó. Tập chỉ giữ những gì là của riêng nó.

## 5. Rig dùng chung nằm ở đâu

Rig của kênh này **không nằm trong kênh**: nó nằm ở `core/cast/`, vì một nhân vật phải sống được ở cả
hai bản dựng, và một bản dựng không thuộc riêng kênh nào:

| Tệp | Nó là |
|---|---|
| `core/cast/cast.mjs` | đặc tả, **mô hình tư thế**, hình học và bảng mặt dùng chung |
| `core/cast/adapter-2d.mjs` | adapter 2D: vẽ nhân vật lên canvas |
| `core/cast/adapter-3d.mjs` | adapter 3D: dựng nhân vật trong three.js |

Một tập chỉ cần `import` hai adapter đó. **Không chép rig vào tập** — một bản chép là một cái tìm.

## 6. Bẫy

- Đừng sửa ngoại hình nhân vật trong `src/film.js`. Sửa `cast/<tên>.json`: cả hai bản dựng sẽ đổi theo.
- Đừng thêm trường mới vào đặc tả mà không thêm nó vào **cả hai** adapter: đặc tả là hợp đồng của hai
  bản dựng, không phải của một.
- Một tư thế phải đọc được ở cả hai bản: nếu chỉ bản 3D ra dáng, tư thế đó không tồn tại.
- Đừng để bản 2D và bản 3D lệch nhau quá một tư thế: sự khác biệt giữa hai bản dựng là **chủ ý**, sự
  lệch là **lỗi**.
- Bảng nhân vật không có lời: `window.TEXTS(t)` trả về các nhãn trên trang, và chúng phải nằm trong
  khung đúng số giây, nếu không `readcheck` sẽ báo.
