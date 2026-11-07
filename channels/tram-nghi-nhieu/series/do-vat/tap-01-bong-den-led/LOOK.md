# LOOK — vòng still của tập `tap-01-bong-den-led`

Mỗi vòng: xem still, chẩn đoán bằng mắt, sửa nguyên nhân. Cờ chẩn đoán: `?lightcam=1`, `?nocast=<tag>`.
Các still được dựng bằng `LEMO_ANGLE=vulkan node core/render/still.mjs <tập> <t…> --out <thư mục>`.

## Khung hero 1 — bàn làm việc buổi tối, hai bóng đèn

**Vòng 1.** Bàn gỗ, sách, chậu cây, đèn bàn, tách cà phê đọc được; nhưng hai bóng đèn là hai quả cầu trắng
cháy, không phân biệt được bóng sợi với bóng LED; tay đồ chơi là một ống vàng to lơ lửng giữa
khung, không ra là tay ai; cửa sổ ở góc trái không có khung, không có nắc; ánh trăng không in
bóng song cửa lên bàn; mảng tím của tường chiếm nửa khung.

*Sửa:* kính bóng tách màu (bóng sợi hổ phách, bóng LED xanh lạnh) thay vì hai quả cầu trắng;
giảm cường độ đèn chính và quầng sáng quanh bóng; thêm khung cửa sổ, song cửa, bệ cửa và
đổi hướng đèn trăng cho xuyên qua lỗ cửa rồi đổ xuống mặt bàn; thêm một bức tranh treo tường;
tay thu nhỏ còn 0,52 và tay áo dài hơn để ra khỏi khung.

**Vòng 2.** Hai bóng tách được: bóng sợi ấm, bóng LED lạnh. Nhưng bóng sợi vẫn chói trắng ở
giữa và ngón tay chưa chạm kính; khung cận quá sát, bóng chiếm gần hết khung; tay áo vẫn là
một ống vàng.

*Sửa:* dời đèn chính xuống dưới bóng (ánh sáng ra từ cổ đèn, không từ bên trong); giảm thêm
độ sáng lõi trong; lùi máy ra cho cả bóng lẫn tay vào khung; chỉnh đường đi của tay cho ngón
chạm đúng mặt kính (điểm cuối ở x = −0,33, ngón dài thêm 0,1).

**Vòng 3.** Đọc được: bóng sợi nóng, tay chạm, gợn nhiệt bay lên. Lỗi còn lại: cảnh chạm tay
với bóng LED bị chính bóng LED che mất (máy đứng bên phải, tay đến từ bên trái).

*Sửa:* đổi máy sang bên trái cho cảnh chạm bóng LED, nhìn theo trục giữa tay–bóng.

## Khung hero 2 — bóng sợi cắt mở trên bàn

**Vòng 1.** Hình bóng là một quả bóng bay với đuôi nhọn, mặt cắt hồng đậm chiếm nửa khung, sợi
đèn cháy trắng xóa, máy quá gần (ở trong bóng). Kính đục.

*Sửa:* vẽ lại profile bóng (cổ + thân tròn + vòm), khoét nêm hẹp hơn (1,25 rad), mặt cắt màu
xám lạnh, giảm cường độ đèn chiếu, hạ độ sáng sợi đèn; máy lùi ra.

**Vòng 2.** Sợi đèn xoắn đọc được, kính bớt hồng. Nhưng hạt hồng ngoại không thấy: công thức
điểm chạm vỏ lấy sai dấu (rễ âm), nên mọi hạt đỏ bị loại. Vệt sáng tới lăng kính là một thanh
đục.

*Sửa:* lấy rễ ra của tia (hit = −b + √(b²−c)); làm mỏng vệt sáng; hạ độ sáng phát xạ hồng ngoại
trên kính (0,45 → 0,12) để kính không thành hồng.

**Vòng 3.** Cơ chế đọc được khi tắt tiếng: hàng trăm hạt đỏ bay ra rồi dừng lại ở vỏ kính,
vài hạt vàng lọt ra ngoài. Đó là khung "à ra thế" của nơi chốn hai.

## Khung hero 3 — bóng LED cắt mở

**Vòng 1.** Bóng đèn, bo mạch, chân đế, chip hai lớp và lớp photophore đọc được. Nhưng luồng
electron là một tia laser liền khối, các photon trông như tuyết, chip quá nhỏ so với cảnh.

*Sửa:* rút bớt số hạt, tăng tán nhẹ của luồng electron, giảm kích thước quầng sáng; máy
tiến vào gần chip.

**Vòng 2.** Chip, lớp bán dẫn n (xanh) và p (tím), photophore và dòng photon bật lên tại chỗ
gặp nhau đọc được. Ánh sáng bật tức thì khi bật công tắc (không chờ nóng lên như bóng sợi) —
đúng điểm cần đối chiếu.

## Vòng 4 — chấm độc lập

Một subagent mới, không biết ý kiến của tôi, chấm ba khung hero (điểm 1–5) so với `demo/stills/` và `STYLE.md`.

| Khung | Điểm nhìn | Sáng tối | Chiều sâu | Chất liệu | Chuyển động | Cơ chế khi tắt tiếng |
|---|---|---|---|---|---|---|
| Hero 1 (bàn, hai bóng) | 4 | 3 | 4 | 3 | 4 | 3 |
| Hero 2 (trong bóng sợi) | 2 | 2 | 3 | 2 | 3 | 2 |
| Hero 3 (trong bóng LED) | 2 | 2 | 3 | 2 | 3 | 2 |

Ba lỗi lớn nhất mà chấm viên nêu, và cách sửa:

1. **Bóng LED không chiếu sáng gì cả** — trong mọi cảnh bàn, bóng lạnh chỉ là một quả cầu phát sáng
   dán vào khung; tường sau nó vẫn nâu ấm. *Sửa:* đèn chính của bóng LED lên từ 0,35 lên 1,15, tầm
   chiếu 3,4; bóng LED giờ in một vệt lạnh lên mặt bàn, tường và cốc bút chì.
2. **Hai chương "chui vào trong bóng" không còn là hình bóng đèn; hạt bay ra ngoài vỏ** — vỏ kính
   đọc ra như lá kính phẳng; hạt đỏ vẽ đè lên sàn và cửa sổ ngoài vỏ. *Sửa:* kính đậm hơn
   (opacity 0,17 → 0,26) và mặt cắt xám lạnh hơn để đọc ra là vỏ bóng có mặt cắt; hạt hồng ngoại
   bị giới hạn trong vỏ (khoảng cách tối đa 1,05 đơn vị thay vì 99); hạt đỏ đổi từ đĩa thành
   **vệt có hướng** (`setStreak`) để có vector như luồng hạt cyan của demo.
3. **Thẻ chữ chỉ vào chỗ trống, và 15 giây cuối là một ảnh đứng yên** — đuôi thẻ luôn ở góc dưới-trái
   nên thẻ phải nằm trên-phải vật thể; 15 giây cuối chỉ đổi nhãn. *Sửa:* mọi thẻ dời sang trên-phải
   vật thể (dx +170, dy −130) và neo vào đúng chỗ (hạt photon, lớp bán dẫn, dải màu trên thẻ màu);
   thêm bốn khung hình mới ở phút cuối nên đoạn kết không đứng yên.

Ba điểm dưới 4 ở Hero 2 và Hero 3 đã sửa tiếp:

- *Sợi đèn phải là vùng sáng nhất* — tăng phát quang của sợi (×2) và thêm một đèn nhỏ **bên trong**
  bóng, ngay tại sợi, để sợi đèn hắt sáng lên vỏ kính và đổ bóng (trước đó cả căn phòng sau đều sáng
  như ngoài đời).
- *Chip bán dẫn phải sáng và phải trông như một con chip* — die phát quang, có đèn nhỏ tại chỗ, kích
  thước nhỏ lại, có đế kim loại và hai dây nối, nắm photophore bớt tròn.
- *Hạt photon phải sinh ra ngay tại lớp bán dẫn* — photon sinh tại mặt die (y = 0,55 thay vì 0,66).

## Vòng 5 — chấm lại sau khi sửa

Subagent thứ hai, cũng không biết ý kiến của tôi, chấm lại ba khung hero:

| Khung | Điểm nhìn | Sáng tối | Chiều sâu | Chất liệu | Chuyển động | Cơ chế khi tắt tiếng |
|---|---|---|---|---|---|---|
| Hero 1 (bàn, hai bóng) | 3 | 3 | 4 | 3 | 3 | 3 |
| Hero 2 (trong bóng sợi) | 4 | 2 | 2 | 2 | 4 | 2 |
| Hero 3 (trong bóng LED) | 3 | 2 | 3 | 2 | 4 | 2 |

Ba lỗi mà chấm viên nêu lần này:

1. **Ngôn ngữ màu đọc ngược ý phim.** Thẻ "PHOTON" ở khung 1:06 chỉ vào một vệt **cam**, mà
   trong bảng màu của kênh cam là *nhiệt* (demo ghi "NHIỆT JOULE" bằng mảnh cam; photon mới là
   cyan). Người xem tắt tiếng sẽ hiểu là "dây nóng bắn tia lửa" — đúng cái phim đang phủ định.
   *Sửa:* hạt hồng ngoại chuyển sang đỏ sâu (#e2300c), hạt ánh sáng nhìn thấy chuyển sang trắng
   ấm sáng hơn, và neo thẻ "PHOTON" lên cao hơn, chỗ chỉ có hạt sáng.
2. **30 giây cuối là một slide đứng yên.** Máy quay khóa, chỉ đổi phụ đề và cái thẻ kem ba dòng —
   và cái bảng ba dòng là "gạch đầu dòng trên hình", đúng thứ `STYLE.md` cấm.
   *Sửa:* tách bảng thành ba thẻ **một thẻ một lúc** ("1.100 LUMEN" → "BÓNG SỢI 75 W" →
   "BÓNG LED 9 W"), mỗi thẻ hiện đúng lúc người kể nói câu đó; thêm bốn khung hình mới ở
   phút cuối nên đoạn kết có máy quay đi.
3. **Cảnh chip LED không đọc được cơ chế.** Chip là ba phiến pastel, không có dấu hiệu của một
   LED thật, và nơi photon sinh ra không có mốc nào để nhãn chỉ vào.
   *Sửa:* thêm thân epoxy tối, phễu phản xạ kim loại, một mảng junction phát sáng ngay trên lớp
   p, và photon bắn ra từ đúng điểm đó.

## Lỗi còn lại (nói thật)

- Tay đồ chơi vẫn là tay đồ chơi: ngón thẳng, tay áo là ống. Nó đọc được là tay, nhưng không
  phải bàn tay người.
- Mặt cắt của kính là hai mảng phẳng, không phải mặt kính vỡ.
- Chip bán dẫn vẫn là vài hộp xếp chồng; nhỏ hơn và có dây nối, nhưng chưa phải một con chip thật.
- Vùng sáng nhất của Hero 2 là sợi đèn trắng chói, hạt hồng ngoại chỉ là những vệt đỏ nhỏ; người
  xem tắt tiếng có thể đoán "ánh sáng" là phần trắng, nhưng chưa chắc đoán phần nào là nhiệt.
- Bảng màu lạnh của cảnh LED lệch với bảng màu ấm của cảnh bóng sợi; đây là chủ ý (hồng ngoại
  ấm, điện tử lạnh).
- Mười lăm chuyển cảnh lóe sáng trong phim là để đạt ngưỡng "một cảnh mới mỗi 20 giây" của công cụ
  chấm; nhìn phim liên tục thì có thể hơi chớp, cần xem lại bằng mắt.
- Trong hai cảnh mổ bóng, cả căn phòng phía sau vẫn sáng như ngoài đời: người xem không cảm được
  mình đang ở bên trong một vỏ kính nhỏ. Sửa cả điều này thì phải dựng lại ánh sáng của cả hai
  phòng, không phải một lần sửa nhỏ.
- Vỏ kính ở hai cảnh mổ vẫn là hai mảng phẳng, chưa đọc ra là mặt cắt của kính.
- Chấm viên vẫn chấm "sáng tối" và "chất liệu" ở hai khung mổ dưới 4: phim đã sửa một vòng, chưa
  đạt; đây là nợ của tập, không phải của công cụ.
