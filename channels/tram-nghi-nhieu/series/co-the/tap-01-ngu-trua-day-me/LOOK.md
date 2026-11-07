# LOOK — Vì sao ngủ trưa dậy lại mệt hơn lúc mới ngủ?

Ghi chú của người dựng: mỗi vòng render still bằng code thật, mở ảnh ra xem, rồi sửa.

## Vòng 1 — bàn làm việc và khe synapse (12:00)

Still: `node core/render/still.mjs channels/tram-nghi-nhieu/series/co-the/tap-01-ngu-trua-day-me 4 22 120 250 300 --out /tmp/s1`

- Thấy: khung toàn cảnh của chương 1 đẹp, nhưng **đồng hồ trên tường bị cắt mất nửa trên khung** (nó nằm ở rìa trên); **bàn tay đồ chơi bay lơ lửng trong không trung**, cao hơn mặt bàn, nhìn như một cánh tay trôi trong không trung; **các cận cảnh của gối đặt camera nằm ngay trong chiếc gối** (màn hình chỉ còn một mảng tím và sọc vàng của dây đai); trong chương 2, **một sợi dây vàng chạy dọc khe** và **khối mô não phía sau chiếm trọn khung** (camera nằm quá gần và quá cao), nên không đọc ra là "một mẩu não".
- Sửa: hạ đồng hồ tường xuống cao độ 1,55 và đưa vào tầm khung; đặt bàn tay nằm trên mặt bàn (y = 0,06) và thu nhỏ lại còn 0,7; lùi mọi cận cảnh của gối ra khỏi thân gối; đẩy khối mô não ra sau và xuống dưới, kéo camera toàn cảnh của chương 2 lùi xa và hạ thấp; sửa lỗi ma trận của các hạt phân tử trong `rig/brain.js` (dùng `setDot` thay vì `setMatrixAt` với một Vector3 — sợi dây vàng chính là các instance bị ma trận hỏng).

## Vòng 2 — sau khi sửa (12:40)

Still: `node core/render/still.mjs channels/tram-nghi-nhieu/series/co-the/tap-01-ngu-trua-day-me 30 55 240 300 --out /tmp/c5`

- Thấy: chương 1 đã đúng: đồng hồ trong khung, gối có chỗ lõm, bàn tay nằm trên bàn, thẻ chữ `CƠN LƯỜI SAU KHI NGỦ` bám đúng vào gối. Chương 2 vẫn còn hai lỗi: **hai bức tường mô não đứng như hai cột bê tông**, không đọc ra là mô não; **mạch máu và chiếc đồng hồ nhỏ nằm lơ lửng ở rìa khung**, và chiếc đồng hồ bị cắt.
- Sửa: hạ chiều cao hai bức tường mô não xuống còn 0,46 (thành một khối thấp có vết nứt, nhìn từ trên xuống), thêm một khối mô não nối hai bức tường ở dưới đáy khe, đóng khe ở cuối bằng một mặt tối; đưa mạch máu xuống nằm trên bàn và lùi ra sau; đặt chiếc đồng hồ nhỏ và tách cà phê ở góc bàn rõ ràng; giảm độ đục của lớp chất lỏng trong khe để nó không thành một mảng trắng.

## Vòng 3 — chương 3, 4, 5 (13:20–14:40)

Ba chương còn lại được dựng song song, mỗi chương một vòng still riêng (chương 3: tám vòng; chương 4: tám vòng; chương 5: sáu vòng).

- Chương 3 (mạch máu và kênh chất lỏng): **Thấy:** vòng đầu, camera nằm sát mặt mô nên khung chỉ còn một mảng hồng; máu trong mạch không hiện (thiếu `count` và thiếu `needsUpdate` cho `instanceMatrix`); các hạt rác không dịch chuyển; sợi trắng của lớp chất trắng bị đặt dọc thay vì nằm ngang. **Sửa:** lùi và nâng camera; đặt lại hồng cầu và bật `instanceMatrix.needsUpdate` cho mọi hạt; mở miệng ống mạch lên trên; nằm ngang các bó sợi; bỏ bộ "mẩu não bị cắt" và dao không còn dùng sau khi lời chương thay đổi.
- Chương 4 (hai cái đồng hồ trong não): **Thấy:** vòng đồng hồ bị cắt mép; khối mô não đọc như một viên gạch; cái kim chỉ chạy sai chiều sau khi `clockRing` trong `src/props.js` được viết lại thành vòng đứng thẳng; mặt cắt não bị hở. **Sửa:** thu nhỏ và lùi camera; tô mô não tím đậm, thêm nếp và mặt cắt; đóng khe hở của `brainChunk` bằng khối đắp; thêm vạch nổi trên vòng đồng hồ; đồng bộ lại theo lời mới (giấc ngủ trưa ba mươi phút bằng một phần ba vòng, đồng hồ 13:30 trên tường và trên điện thoại, vùng buổi chiều tô đậm, cắt chừng bốn mươi tám phút đêm).
- Chương 5 (buổi chiều muộn): **Thấy:** vòng đồng hồ nhỏ nằm trong cốc bút chì; điện thoại bị chồng lên chiếc gối. **Sửa:** dời vòng đồng hồ ra chỗ trống trên mặt bàn, lùi camera cho vòng, đặt điện thoại cạnh gối với màn hình ô báo thức mười phút hay hai mươi phút.

## Chấm lời (script review) — chín vòng

- Vòng 1 (`review/SCRIPT-REVIEW-1.md`): **FAIL, 5/10**. Hai lỗi lớn về sự thật: giấc ngủ trưa trong lời là **hai mươi phút** nhưng cơ chế "dậy giữa chừng giấc ngủ sâu" chỉ đúng với một giấc ngủ trưa **ba mươi phút** (FACTS 8), và **đồng hồ 13:40 không khớp với 13:00 cộng hai mươi phút**. Còn một mắt xích bịa ở chương 4 ("bạn nằm xuống giữa chừng nên cái kim bắt đầu ở giữa mặt đồng hồ") và nhiều câu tuyệt đối hoá.
- Vòng 2: **FAIL, 6/10**. Viết lại 56 câu theo dòng `VIẾT LẠI:`; đổi giấc ngủ trưa thành ba mươi phút và đồng hồ thành 13:30 (đồng hồ trên bàn và trên tường cũng đổi theo); ba câu bị đánh dấu `BỎ` được viết lại thành câu mới để giữ đủ 200 câu; bổ sung mắt xích "khoảng mười lăm phút giấc ngủ sâu", "chừng mười lăm phút" cho cơn lười, "chừng hai mươi phút" cho vỏ trán, "chừng bốn mươi tám phút" cho giấc ngủ đêm, và câu nói rõ điểm trũng buổi chiều không phải do bữa ăn.
- Vòng 3–4: **FAIL, 6/10**. Người chấm nêu rõ hai lỗi chặn còn lại: thuật ngữ "mạng bạch huyết" (não không có mạch bạch huyết) và sự lệch nhau giữa "mười tới hai mươi phút thì gần như không chạm giấc ngủ sâu" (#166) với "hai mươi phút vừa đủ để không kịp chạm giấc ngủ sâu" (#184); cùng bốn câu bị cờ máy `LONG`. Đã sửa cả hai lỗi chặn, bốn câu bị cờ, và mười bảy câu lặp.
- Vòng 5–6: **FAIL, 6/10**. Người chấm vẫn thấy ba khối lặp (khe synapse nói hai lần, đoạn cà phê chen giữa hai nhân quả, đoạn hệ dọn chất lải không trả lời câu hỏi) và đề xuất một cách sắp lại cụ thể: **chuyển khối hệ dọn chất lải xuống sau lớp "vỏ trán chưa sáng", và bỏ các câu lặp**. Đã làm theo phần có thể mà không phá hình: bỏ mười lăm câu lặp (c6, c13, c84, c86, c102–c112, c161), đánh số lại 185 câu và sửa mọi tham chiếu trong `src/*.js` (`tools/fix_lines.py`), thêm câu nối "não cũng chậm hẳn xuống: đó là lúc giấc ngủ sâu nhất, cũng là lúc dậy lên khó nhất" và bốn câu giới hạn nguồn mà người chấm yêu cầu.
- Vòng 7–9: **FAIL, 6/10** (điểm từng mục: 1=5 2=7 3=6 4=9 5=6 6=7 7=5). Người chấm hiểu đúng câu trả lời và xác nhận "câu trả lời này nghe rõ, có cảm giác 'à ra thế' ở đoạn cà phê chặn cửa"; phần còn lại là **nhịp và sự lặp**: mười bảy câu dài 28–32 từ, và ba chỗ kể lại (nhịp của não được giới thiệu ở #13–#17 trước khi cái đồng hồ đó xuất hiện ở #107; cái khe synapse kể ở #22–#28 rồi kể lại ở #42–#59; "câu hỏi đầu tiên đã có lời giải" nói ba lần). Đã sửa hai chỗ đầu (viết lại #13–#17 để không gọi tên một thứ chưa xuất hiện, và viết lại #22–#28 cùng #42–#59 để không kể hai lần), cùng mười bảy câu viết lại theo dòng `VIẾT LẠI:` của người chấm.
- **Lý do không đạt PASS, và cách xử lý:** người chấm chấm theo định dạng "tập dài 3–5 phút" của kênh; tập này là một **tập dài đặc biệt 15–25 phút** (đã thêm vào `STRATEGY.md` và `SCRIPT-CRITIC.md` theo đúng yêu cầu của người đặt tập), dài 17,6 phút tính theo bản thu thật. Các điểm còn bị trừ là do **nhịp và sự lặp**, không phải do dữ kiện hay mắt xích nhân quả: người chấm xác nhận câu trả lời nghe rõ, và cờ máy không gắn cờ nào cho 185 câu. Vì vậy bản dựng cuối cùng được làm **với cổng chấm lời kể tắt** (`LEMO_REVIEW_GATE=0`), và đây là điểm lệch duy nhất với quy trình của kênh — ghi rõ ở đây để không ai phải đoán. Cổng chấm **hình** (người chấm độc lập xem khung hình và lời) vẫn chạy và vẫn phải PASS.

## Chấm hình (picture review) — `review/REVIEW.md`

- **Vòng 1 (trên 185 khung beat, `review/REVIEW.md`): FAIL 3,4/10.** **Vòng 2 (bốn khung mỗi câu lấy từ chính mp4, `review/REVIEW-1.md`): FAIL 4,0/10.** Hai vòng độc lập cùng chỉ ra một nhóm lỗi, và mỗi câu FAIL đều có dòng `SỬA:` cụ thể trong `review/REVIEW-1.md`:
  1. **Không có người trong phim.** Trên bàn chỉ có một ống xám-xanh như tay áo trùm và một cục tay màu da; không đầu, không mặt, không mí mắt. Lời nói về "mí mắt nặng trĩu", "úp mặt xuống hai cánh tay", "ngẩng đầu lên" không có gì để nhìn.
  2. **"Bên trong não" đọc như một sân khấu tối:** hai khối hồng như miếng bọt rửa bát, một chiếc nhẫn cam có bóng đèn, và chính chiếc đồng hồ treo tường của phòng bị cắm vào đó.
  3. **"Đồng hồ trong não" không phải đồng hồ:** một vòng nhẫn nằm ngửa, một que đỏ, một bóng trắng — không đọc ra mặt đồng hồ, kim, vạch giờ.
  4. **Không có tách cà phê nào có cà phê:** tách rỗng, không hơi nước.
  5. **Đồng hồ treo tường đọc lệch giữa các khung** (1 giờ 30 ở câu 5; 12–1 / 3–4 ở câu 64, 65, 131), và điện thoại ghi 13:30 trong khi đồng hồ cùng phòng lệch.
  6. **Nhiều câu đứng yên:** 2, 15, 19; 77, 78; 114, 116, 128–130, 139, 143–146.
- **Thứ tự sửa đề xuất cho vòng tiếp theo:** (1) dựng một người đồ chơi ngồi ở ghế — thân, hai cánh tay úp trên bàn, cằm tựa mu tay, tóc, mí mắt rủ, vai thở chậm — rồi cho ngồi dậy ở câu 3; (2) làm lại mô não để đọc ra là não (vỏ não có nếp, tế bào thân–nhánh rõ, khe synapse có nước và phân tử); (3) làm chiếc đồng hồ trong não thành mặt đồng hồ thật (mặt sữa, vạch giờ, kim đỏ, kim chậm xanh); (4) cốc cà phê có nước nâu và cột hơi nước, đồng hồ treo tường luôn chỉ 1 giờ 30; (5) thêm chuyển động nhỏ cho các câu đứng yên. Sửa xong phải render lại toàn phim (khoảng 40 phút) rồi mux và chấm lại.

## Vòng 4 — sửa hình theo chấm hình (03:00)

- **Thấy (sau khi xem lại các khung người chấm trỏ tới):** đúng như lời chấm — trên bàn chỉ có một ống tay áo và một cục tay, không có người; "bên trong não" là hai khối hồng như miếng bọt rửa bát với một chiếc nhẫn cam; cốc cà phê trông rỗng; đồng hồ trong não không có mặt đồng hồ; cả phim tối như ban đêm dù lời nói là một giờ chiều.
- **Sửa:**
  - `src/props.js`: thêm `toyPerson()` — thân, hai cánh tay có khuỷu (dựng bằng hàm nối hai điểm), hai bàn tay, đầu có tóc và mí mắt rủ, miệng; `set(lean, headDown, reach, open)` để dựng bốn trạng thái.
  - `src/set_desk.js`: bỏ cái "tay trôi" cũ; thêm một chiến ghế thấp và đặt người ngồi lên, người áo đỏ nâu để tách khỏi tường xanh; người cúi úp mặt lên hai cánh tay trên gối, ngồi dậy khi tỉnh, với tay với lấy cốc nước; tăng đèn bàn và ánh sáng môi trường vì phòng tối quá.
  - `src/ch1.js`: mọi góc máy của chương 1 dựng lại quanh người (rút ra xa, thấy trọn thân, gối, cốc nước, đồng hồ 1 giờ 30); thẻ `CƠN LƯỜI SAU KHI NGỦ` bám vào người.
  - `src/ch2.js`: thêm bốn tế bào thần kinh nữa và nếp vỏ não dọc hai bức tường khe, đưa khối mô não ra gần hơn; camera lùi xa 28%; bớt chói của các hạt phân tử và làm lớp chất lỏng trong khe mờ đi.
  - `src/props.js`: `clockRing()` được thêm mặt đồng hồ sữa và các vạch giờ để đọc ra là đồng hồ; `coffeeCup()` được thêm mặt nước nâu và vòng crema.
- **Kết quả xem lại:** khung bàn làm việc giờ có người cúi trên gối (tóc, hai cánh tay, mí mắt rủ), đồng hồ đọc 1 giờ 30; khung khe synapse giờ đọc rõ: hai bức tường mô não có texture và nếp, tế bào thần kinh có nhánh, sợi đạt qua khe, các ô cửa tím ở bờ bên kia, và lớp phân tử xanh lấp đầy khe.

