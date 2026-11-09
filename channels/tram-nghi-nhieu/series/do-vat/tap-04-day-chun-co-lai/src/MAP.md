# MAP — tập 04 "Tại sao dây chun bị kéo căng rồi hơi nóng thì lại co lại?"

Bản đồ của mã nguồn tập này: tên → dòng. Đọc đúng đoạn cần, đừng đọc lại cả tệp.
Các số dòng **đúng với lần sửa sau cùng**; khi sửa code, sửa lại bảng này.

## src/film.js (465 dòng — trang của phim: window.render, window.EV, các nhát)

| Dòng | Cái gì |
|---|---|
| 19–20 | `V` (timeline từ giọng đọc) · `F` (camera của rig) |
| 23 | `SC` — ba nơi chốn: N1 bếp · N2 trong sợi dây · N3 bàn đo |
| 34–40 | bảy bàn tay: `handK` `handK2` (bếp) · `handI` (trong dây) · `handD` `handD2` `handD3` `handD4` (bàn đo) |
| 45–56 | `gripSide()` · `gripDown()` — bàn tay nắm một vật (cổ tay lùi 20 cm vì bàn tay dài 27 cm) |
| 60–124 | `SHOTS` — 48 nhát, một câu một hình; `pos`/`look`/`fov`/`d` (máy trượt trong nhát) |
| 127–132 | `T(id)` `E(id)` `DUR(id)` `prog(id,t)` `orderOf(id)` `num(id)` |
| 135–165 | các đại lượng đổi theo thời gian: `tight1` `wireK` `slackK` `netPull` `coilK` `frontX` `sagCold` `sagTaut` `hotCoil` `segHot` `tempK` `deskK` `gaugeRead` `extK` `rubberK` `steelK` `jouleK` |
| 167–168 | `K` (đạo cụ bếp) · `I` (đạo cụ trong dây) · `D` (đạo cụ bàn đo) |
| 172–303 | `applyState(id, t)` — trạng thái vật theo câu đang nói (bếp 175–198 · trong dây 200–230 · bàn đo 232–301) |
| 311–317 | `CARDS` — ba thẻ số; **mỗi thẻ có `ids`**: chỉ hiện ở câu nó gọi tên; **neo bằng toạ độ thế giới** |
| 323–338 | `EV` — sự kiện của phim: không khí (322–331) · nhạc (333–337) |
| 344–368 | `FOLEY` — 30 sự kiện tiếng, chỉ ở nơi vật thật kêu |
| 375–381 | `shotAt(t)` — nhát nào đang chạy ở thời điểm t |
| 383–438 | `window.render(t)` — dựng khung: máy, trạng thái, thẻ số, phụ đề |
| 441–450 | `F.markBeats(ev, V, …)` — mốc nhịp của từng câu (thẻ số nếu có, nếu không thì điểm máy nhìn) |
| 452–458 | `window.DIAG(t)` — chẩn đoán: nhát đang quay và trạng thái |

## src/props.js (959 dòng — vật dựng: mỗi vật một hàm)

| Dòng | Cái gì |
|---|---|
| 18–148 | phần dùng chung: `roundSection()` (mặt cắt bo tròn) · `ribbonMesh()` (dải theo đường cong) · `arcGeometry()` + `fillArc()` (vòng) · `shade()` · `metalTex()` |
| 150–200 | `bandRing()` — vòng dây chun dẹt, mặt cắt bo tròn, có chỗ hai đầu dán; `setTighten(k)` |
| 201–237 | `bandStrip()` — dải dây nằm ngang, cong nhẹ, có đoạn hai đầu dán; `setLen(k)` |
| 238–279 | `strap()` — dải dây treo dọc, đầu trên gập qua đầu ghim; `setLen(k)` |
| 280–326 | `jar()` — hũ thủy tinh có vai, cổ và nắp vặn ren xoắn ốc, răng cưa viền **nông, sát mép** |
| 327–386 | `hairdryer()` — thân, lưới nan thẳng ở đuôi và miệng, tay cầm, vòng treo; `g.mouth` |
| 387–421 | `steelWire()` — sợi thép tròn, vân sáng không chạm mép cắt; `setLen(k)` |
| 422–439 | `pin()` — ghim nhỏ: đầu đĩa ở trên, mũi kim chĩa xuống |
| 440–476 | `weight()` — quả cân kim loại, móc treo hình chữ J |
| 477–516 | `jouleBand()` — vòng cao su nghiêng quanh bầu nhiệt kế + đuôi dây; `setYank(amp, phase)` · `stretch(amp)` · `tipX(s)` |
| 517–603 | `ruler()` — thước gỗ có vạch centimet (bản nằm; bản đứng có đế) |
| 604–652 | `thermometer()` — bầu đỏ, cột thuỷ ngân, dải thang dán sát ống; `setTemp(k)` |
| 653–729 | `dynamometer()` — mặt thang tròn có kim, móc dưới hình chữ J; `setReading(k)` |
| 730–830 | `chain()` — dây xích hạt nối, hạt xen kẽ lớn–nhỏ; `spiral` = xoắn ốc nằm phẳng; `setCoil(k)` (1 = cuộn, 0 = kéo thẳng) · `update(t)` |
| 831–877 | `crosslink()` — móc liên kết chéo hình chữ C, hai sợi hạt xuyên qua lỗ |
| 878–884 | `heatFlow()` — luồng hơi nóng (dùng `flow()` của rig) |
| 885–924 | `heatFront()` — vệt nhiệt chạy dọc mạng; `set(x, k)` |
| 925–959 | `PROPS` — danh sách vật cho vòng chấm đạo cụ (mỗi vật một mình, ba phía) |

## src/set.js (531 dòng — ba nơi chốn)

| Dòng | Cái gì |
|---|---|
| 23–29 | `noShaft(scene)` — tắt đúng tia sáng hình nón của rig |
| 31–121 | `buildKitchen(scene)` — hũ 1 `jar1` (40–53) · hũ 2 `jar2` (57–65) · máy sấy tóc (69–82) · dây thép + ghim (91–96) · thước (98–100) · hai ghim + vòng dây chùng (104–112) |
| 123–258 | `buildInside(scene)` — mạng chuỗi `chain()` (162–170) · móc chéo `crosslink()` (174–182) · vệt nhiệt `heatFront()` (183–185) · dải treo `sagBand()` (190–192) · nhóm sợi `strandFamily()` (198–206) · sợi đơn (208–212) · hai mạng mát/nóng (217–229) · quả cân `weight()` (231–234) · hai đoạn dây `tensionSegment()` (236–250) |
| 260–292 | `tensionSegment()` — đoạn dây kéo căng giữa hai ghim, một quả cân treo; `setPull(k)` |
| 294–314 | `strandFamily()` — nhóm sợi, mỗi sợi một kiểu cuộn |
| 316–409 | `sagBand()` — dải treo giữa hai ghim ngang nhau: vùng nóng (trái) bị kéo thẳng, vùng lạnh (phải) thõng; `setSag(cold, taut)` |
| 411–531 | `buildDesk(scene)` — hai chân đế có `dynamometer()` (424–435) · dây treo `strap()` + quả cân (439–447) · thước đứng `ruler()` (449–451) · sợi thép + quả cân thép (453–462) · nhiệt kế chính `thermometer()` (464–468) · nhiệt kế nhỏ + vòng dây `jouleBand()` (470–480) · bảng ghi chép trên tường (484–492) · máy sấy tóc + luồng hơi `heatFlow()` (508–513) · ánh sáng (520–528) |

## src/chapters.js (19 dòng — bốn chương của tập)

| Dòng | Cái gì |
|---|---|
| 14–19 | `CHAPTERS` — ch1 (c1–c8) · ch2 (c9–c27) · ch3 (c28–c41) · ch4 (c42–c48), kèm các tệp mã của từng chương |

## src/timeline.js (311 dòng — sinh tự động — đừng sửa tay)

| Dòng | Cái gì |
|---|---|
| 1–2 | dòng đầu ghi rõ tệp này do `mk_timeline.py` của kênh sinh ra — sửa tay thì `build.sh` sẽ không sinh lại |
| 3 | `TAIL` — đuôi sau câu cuối |
| 5–55 | `SEQ` — thứ tự câu và khoảng lặng trước mỗi câu |
| 249–311 | `build(dur, words, lips)` — ghép `voice/proc/dur.json` + `voice/words.json` + `voice/lips.json` thành mốc thời gian, phụ đề và sự kiện |
