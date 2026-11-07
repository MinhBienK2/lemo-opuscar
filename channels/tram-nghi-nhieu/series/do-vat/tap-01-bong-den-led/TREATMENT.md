# TREATMENT — Vì sao bóng đèn LED sáng mà không nóng?

Kênh / channel: **Trạm Nghĩ Nhiều** · Tập / episode: `series/do-vat/tap-01-bong-den-led` ·
Phim / movie: `tram-nghi-nhieu-series-do-vat-tap-01-bong-den-led.mp4` · Dạng: tập dài ngang 16:9, 3:12

## 1. Ba cấu trúc ứng viên / Three candidate structures

**A. Hai bóng đèn trên một cái bàn** — Buổi tối, hai bóng đèn treo cạnh nhau trên bàn làm việc: một bóng sợi, một bóng LED. Tay chạm bóng sợi → rút lại. Rồi máy lao vào bóng sợi, thấy sợi đèn 2.800 K bắn ra hàng nghìn hạt hồng ngoại mà mắt không thấy; máy chui sang bóng LED, thấy photon sinh ra ngay ở lớp bán dẫn; quay lại bàn, tay chạm bóng LED — mát. *Mua:* câu hỏi được trả lời bằng chính cái cảm giác "nóng/mát" mà người xem đã từng có. *Mất:* hai lần vào bên trong là hai lần đổi bối cảnh.

**B. Một hành trình theo dòng điện** — Bắt đầu ở ổ cắm, chạy theo dây vào bóng sợi, thấy dòng electron làm sợi nóng đỏ, thấy phần lớn năng lượng thoát ra hồng ngoại, rồi đi tiếp sang bóng LED ở bên cạnh để thấy nó sinh ánh sáng ngay. *Mua:* một dòng chuyển động liên tục, không phải cắt cảnh. *Mất:* khó dựng trong rig hiện có (phải dựng cả một đường dây chạy qua hai bóng), và khó để người xem thấy "nóng/mát" bằng xúc giác.

**C. Ký sổ của một bóng đèn** — Ngăn kéo đồ dùng nhà bếp: mấy quả bóng sợi cũ, một bóng LED mới, hóa đơn điện, và một cái cặp nhiệt đo. Số liệu chiếm chỗ, cơ chế chỉ được kể. *Mua:* rất dễ làm và rất "đời thường". *Mất:* không có cơ chế vật thể để dựng — đúng thứ mà 3D của kênh mạnh. Trả lời sai câu hỏi.

**Chosen: A** — câu hỏi của kênh là câu hỏi cảm giác ("tại sao chạm bóng này nóng mà bóng kia mát"), và A đưa cảm giác đó lên màn hình ngay từ đầu bằng tay đồ chơi. B cũng dựng được nhưng tốn công dựng đường dây và làm loãng cơ chế; C không có cơ chế để dựng nên chỉ dùng làm phần mở đầu lấy cảm giác.

## 2. Logline và cung / Logline and arc

> Bóng sợi không tạo ra ánh sáng — nó tạo ra nhiệt, rồi nhiệt mới phát ra ánh sáng; LED làm ngược lại, biến điện thành ánh sáng ngay ở lớp bán dẫn, nên phần nhiệt thừa rất ít.

- Setup: buổi tối, hai bóng đèn treo trên bàn làm việc; tay chạm bóng sợi và rút lại.
- Turn: máy lao vào bóng sợi — bên trong, sợi đèn nóng đến 2.800 K bắn ra hàng nghìn hạt; đa số là hạt hồng ngoại dài ngoài, mắt không thấy, chỉ vài hạt mới lọt vào dải 0,4–0,8 µm mà mắt thấy được.
- Ending: bên trong bóng LED, electron rơi xuống mức năng lượng thấp hơn và sinh photon ngay tại chỗ; quay lại bàn, tay chạm bóng LED — mát. Hành động cuối: khi mua bóng, nhìn **lumen** chứ không phải **watt** (1.100 lumen: bóng sợi 75 W, bóng LED 9 W).

## 3. So với tập trước / Benchmark — learn, don't learn

| From | Learn | Don't learn |
|---|---|---|
| the channel's previous episode | Chưa có tập nào trong `series/` — đây là tập đầu của cột `do-vat`, nên kênh làm chuẩn | — |
| the channel's `DEMO.md` | Cách làm mặt cắt: vật to như một món đồ trên bàn, máy đứng **ngoài** nhìn vào, `pool` chiếu mặt cắt từ phía máy; nơi chốn có sàn, đèn, đồ xung quanh; `vessel(PROFILES.bulb)` có sẵn để khoét bóng đèn | Các điểm yếu mà DEMO.md tự nêu: shot quá cận nền chỉ là mảng mờ; các lớp là khối trơn; mặt quá sáng; tay là capsule ghép. Bóng đèn của tập này phải có vân, có kính, có chân đế, và tay phải có ngón. |
| the channel's `rig/README.md` | `film()` → `frame()` với `thick`/`ref`/`flash`/`fade`/`overlay`; `label()`/`subtitle()`; `loadVoice(build)`; cờ chẩn đoán `?lightcam`, `?nocast` | Không sửa `rig/` cho riêng tập này; phần dùng lại (bàn cutaway) viết trong `src/` của tập |

## 4. Danh sách cảnh / Shot list

31 cảnh, mỗi cảnh đổi khung hình trong 0,45 s rồi giữ; mốc thời gian lấy từ `src/timeline.js`.

| # | Time | Shot | Framing | Camera move | Why it is shot that way |
|---|---|---|---|---|---|
| 1 | 0:00 | Bàn làm việc buổi tối, hai bóng treo | toàn cảnh | đứng yên rồi đẩy | Lập cảnh: phải thấy **hai** bóng cùng lúc |
| 2 | 0:06 | Cận bóng sợi, sợi đèn xoắn bên trong | cận | tiến | Lần đầu thấy bên trong bóng sợi |
| 3 | 0:16 | Bóng sợi, tay đi vào khung | trung | trượt | Chuẩn bị cho cái chạm |
| 4 | 0:18 | Chạm bóng sợi: bóng đỏ lên, gợn nhiệt bay lên | cận | giữ | Hành động thật làm câu hỏi thành cảm giác |
| 5 | 0:25 | Tay rụt lại | trung | lùi | Nhịp giật: cái nóng đã được thấy |
| 6 | 0:27 | Chạm bóng LED từ bên trái | trung | giữ | Cùng một cái tay, bóng kia vẫn mát |
| 7 | 0:28 | Bóng LED sau cái chạm | cận | giữ | Chốt cảm giác thứ hai |
| 8 | 0:31 | Hai bóng, câu hỏi | toàn cảnh | rút ra | Rút ra để người xem đặt câu hỏi |
| 9 | 0:35 | Đẩy về phía bóng sợi | trung | đẩy nhanh | Chuẩn bị lao vào bên trong |
| 10 | 0:40 | Lao vào vỏ bóng sợi | cận | lao | Chuyển cảnh bằng chính hành động của máy |
| 11 | 0:40 | Bóng sợi cắt mở trên bàn | toàn cảnh | giữ | Lập cảnh của nơi chốn thứ hai |
| 12 | 0:46 | Bóng sợi, sợi đèn lạnh | trung | tiến | Nói rõ vật thể trước khi bật |
| 13 | 0:49 | Công tắc trên tường, sợi đèn | cận | giữ | Nhân quả: công tắc là nguyên nhân |
| 14 | 0:52 | Sợi đèn đỏ sẫm → cam rực | cận | giữ | Sự kiện nhân quả lớn, thấy rõ trong 1–2 giây |
| 15 | 1:06 | Hạt photon bay ra khỏi sợi | cận | giữ | Cơ chế: dòng hạt chạy ra |
| 16 | 1:16 | Hạt đỏ dính vào vỏ kính, hạt vàng lọt ra ngoài | cận | quét | Đây là khung "à ra thế" của nơi chốn hai |
| 17 | 1:38 | Thẻ màu trên bàn, lăng kính | trung | nghiêng xuống | Đưa cái phổ vào một vật thể |
| 18 | 1:46 | Dải mắt thấy và dải hồng ngoại trên thẻ | cận | tiến | Gắn hai con số vào đúng chỗ trên vật |
| 19 | 1:53 | Quay lại bóng sợi, rồi loé cyan | toàn cảnh | lùi | Chuyển sang nơi chốn thứ ba |
| 20 | 1:54 | Bóng LED cắt mở | toàn cảnh | giữ | Lập cảnh của nơi chốn thứ ba |
| 21 | 1:59 | Bo mạch, chân đế, chip | trung | tiến | Dẫn mắt từ vỏ vào trong chip |
| 22 | 2:06 | Luồng electron chạy tới lớp bán dẫn | cận | giữ | Cơ chế: dòng điện đẩy electron qua cửa hẹp |
| 23 | 2:10 | Electron rơi xuống, photon bật ra ngay | cận | giữ | Khoảnh khắc "à ra thế" của nơi chốn ba |
| 24 | 2:24 | Chip vẫn mát, nhiệt ở đế bóng | cận | lùi | Chốt cơ chế: ánh sáng sinh ra ở đúng chỗ |
| 25 | 2:35 | Quay lại bàn, tay chạm bóng LED | trung | giữ | Khép vòng bằng đúng cái tay của cảnh đầu |
| 26 | 2:38 | Tay trên bóng LED | cận | giữ | Lần này mát |
| 27 | 2:49 | Hai bóng, hai thẻ lm/W | toàn cảnh | rút | Trả lời bằng số |
| 28 | 2:54 | Hai bóng, thẻ lumen | trung | đổi khung | Chuẩn bị cho hành động cuối |
| 29 | 2:55 | Thẻ "1.100 LUMEN" | toàn cảnh | giữ | Hành động: mua theo lumen |
| 30 | 3:06 | Hai bóng, "NHIỆT ÍT HƠN" | trung | giữ | Câu kết đúng tinh thần cơ chế |

## 5. Nhịp truyện / Beat sheet

Mốc thời gian lấy từ `src/timeline.js` (sinh từ giọng đã thu), không gõ tay. Phim dài **3:12**.

| Time | Beat | What is on screen | Line id |
|---|---|---|---|
| 0:03 | Mở | Bàn tối, hai bóng đèn treo, trẻ "BÓNG SỢI" | `m1` |
| 0:06 | Giới thiệu | Cận bóng sợi, sợi đèn xoắn bên trong | `m2` `m3` |
| 0:14 | Giống nhau | Hai bóng cạnh nhau, "BÓNG LED" | `m3b` |
| 0:17 | Cảm giác | Tay chạm bóng sợi → đỏ lên, gợn nhiệt bay lên | `m4` `m4b` `m5` |
| 0:27 | Cảm giác (2) | Tay chạm bóng LED → mát, "MÁT" | `m6` |
| 0:31 | Câu hỏi | Hai bóng, hỏi tại sao | `m7` `m8` |
| 0:39 | Vào bên trong | Máy lao vào vỏ bóng sợi, loé cam | `m9` |
| 0:42 | Nơi chốn 2 | Bóng sợi cắt trên bàn, "SỢI ĐÈN" | `m10` `m11` |
| 0:49 | Nhân quả | Công tắc trên tường bật, sợi đèn từ đỏ sẫm lên cam | `m12` `m13` `m13b` |
| 0:59 | Con số | "2.800 K" cạnh sợi đèn | `m14` |
| 1:02 | Cơ chế | Hạt bay ra khỏi sợi, "PHOTON" | `m15` `m16` `m16b` |
| 1:13 | Mắt thấy | Vài hạt vàng lọt ra ngoài, "MẮT THẤY ĐƯỢC" | `m17` |
| 1:16 | Hồng ngoại | Hàng trăm hạt đỏ dính vào kính, "HỒNG NGOẠI" | `m18` `m18b` `m19` |
| 1:27 | Con số | "90% NHIỆT", rồi "10% ÁNH SÁNG" | `m20` `m20b` `m21` |
| 1:38 | À ra thế (1) | Lăng kính và thẻ màu: "~1,0 µm" ở phần hồng ngoại | `m22` `m22b` |
| 1:45 | À ra thế (2) | "0,4–0,8 µm" ở dải màu mắt thấy | `m23` `m24` |
| 1:53 | Chuyển | Loé cyan sang bóng LED | `m25` `m26` |
| 1:59 | Nơi chốn 3 | Bóng LED cắt, "BÁN DẦN" | `m27` `m27b` |
| 2:06 | Cơ chế | "ELECTRON" chạy qua lớp bán dẫn | `m28` |
| 2:10 | Cơ chế | Electron rơi vào lỗ trống, "PHOTON" bật ra ngay | `m29` `m29b` `m30` `m31` |
| 2:24 | Chốt | "NHIỆT Ở ĐẾ BÓNG", chip vẫn mát | `m32` `m33` `m33b` |
| 2:35 | Khép vòng | Quay lại bàn, tay chạm bóng LED — mát | `m34` `m35` |
| 2:41 | Trả lời | "16 lm/W" rồi "100 lm/W" | `m36` `m37` |
| 2:49 | Hành động | "LUMEN", đọc số lumen trên vỏ hộp | `m38` `m38b` |
| 2:54 | Hành động | Thẻ "1.100 LUMEN / BÓNG SỢI 75 W / BÓNG LED 9 W" | `m39` `m40` |
| 3:02 | Kết | "NHIỆT ÍT HƠN" | `m41` `m41b` |

## 6. Bản đồ nhạc / Cue map

Tempo: 84 bpm · Key: A minor · Meter: 4/4 · Nhạc do `mix.py` của kênh dựng (epiano, marimba, bass, brush)

| Section | Bars | Instrumentation | Cut on | Key action on | Subtitle on |
|---|---|---|---|---|---|
| A (0:00–0:39) | 12 | bass pulse + brush, chỉ | tay chạm bóng sợi (0:17) | tay rút lại | từ `m1` |
| B (0:39–1:53) | 34 | drone thấp + epiano thưa, thêm marimba khi sợi đèn sáng (0:51) | sợi đèn đỏ lên | hạt bắn ra (1:02) | từ `m9` |
| C (1:53–2:35) | 26 | đổi màu: celesta + bass, nhịp nhanh hơn | electron nhảy qua lớp bán dẫn (2:06) | photon bật ra (2:10) | từ `m25` |
| D (2:35–3:12) | 18 | theme marimba, mở | hai thẻ lm/W (2:41) | thẻ lumen (2:54) | từ `m34` |

## 7. Bảng âm thanh / Sound design table

| Section | Ambience bed | Main foley | Music state |
|---|---|---|---|
| A | `room` (tiếng nhà buổi tối) | tiếng tay chạm kính (`hand_tap`) | A |
| B | `low` (tiếng máy biến áp, rất nhỏ) | tiếng công tắc (`switch`), tiếng sợi đèn "sinh" khi nóng (`rise`) | B |
| C | `low` | tiếng công tắc (`switch`) | C |
| D | `room` | tiếng tay chạm kính (`hand_tap`) | D |

## 8. Phụ đề và chữ / Subtitle and title design

- Type: Be Vietnam Pro (900 cho thẻ thuật ngữ, 700 cho phụ đề) — `channels/tram-nghi-nhieu/fonts/fonts.css`.
- Phụ đề: `subtitle()`, dải dưới (y ≥ 880), tối đa 2 dòng, mảnh cắt tự động theo `mk_timeline.py` của kênh (≤ 52 ký tự).
- Thẻ thuật ngữ: `label()`, tối đa **một thẻ một lúc**: `NHIỆT JOULE`, `HỒNG NGOẠI`, `MẮT THẤY ĐƯỢC`, `BÁN DẪN`, `16 lm/W`, `100 lm/W`. Thẻ kem viền mực, chữ đỏ.
- Thẻ cuối: `1.100 LUMEN` ở giữa, hai dòng `BÓNG SỢI 75 W` / `BÓNG LED 9 W`.
- Không có công thức, không có gạch đầu dòng trên hình.
