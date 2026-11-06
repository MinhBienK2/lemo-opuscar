---
name: tram-nghi-nhieu
description: Đạo diễn và dựng một tập của kênh Trạm Nghĩ Nhiều — câu hỏi "tại sao" đời thường, trả lời bằng diorama 3D toon (three.js) có ánh sáng thật, viền mực vẽ tay, máy quay đi vào bên trong vật, mọi vật dựng đúng là nó, chỉ thứ vô hình mới thành hình minh hoạ; một giọng kể tiếng Việt. Dùng khi làm bất kỳ tập nào của kênh.
version: 13.4.0
---

# Một tập Trạm Nghĩ Nhiều

Đọc trước: `channels/tram-nghi-nhieu/STRATEGY.md` (nội dung), `STYLE.md` (hình), `rig/README.md` (API), và mở `demo/stills/*.jpg` để thấy chuẩn hình. Đọc `demo/` khi cần học một kỹ thuật cụ thể.

Mục tiêu: người xem tắt tiếng vẫn đoán đúng chuyện gì đang xảy ra, và mỗi khung đủ đẹp để chụp làm thumbnail.

## 1. Câu chuyện

1. Scaffold: `sh core/render/new_episode.sh tram-nghi-nhieu series/<cột>/<tập> "Câu hỏi?"`.
2. `research/FACTS.md`: chuỗi nguyên nhân, mỗi con số kèm nguồn.
3. `TREATMENT.md`, một trang:
   - câu hỏi, rồi **tách nó ra**: vật nào thay đổi (chủ thể), thay đổi thế nào, so với cái gì, vì cái gì. Ví dụ "Vì sao X để cạnh Y lại Z?" thì chủ thể là X, nguyên nhân nằm ở Y. Câu trả lời một câu phải lấy đúng chủ thể đó làm chủ ngữ. Đọc lại FACTS xem nguyên nhân có đúng chiều không (cái gì tác động lên cái gì);
   - câu mở đầu và khung đầu tiên cho thấy **chính điều câu hỏi nói**, ở nơi người xem gặp nó (nải chuối trên bàn bếp, chứ không phải một nhà máy). Chuyện lạ hay con số lớn để sau, khi người xem đã hiểu cơ chế;
   - **thật, nhìn là biết**: thứ có thật (vật, máy, bộ phận, nơi chốn, bên trong một vật) dựng đúng là nó, đủ hình dáng, bộ phận đặc trưng, tỉ lệ và chất liệu để người xem nhận ra trong một giây, kể cả vật họ chưa thấy bao giờ (trực thăng ra trực thăng có cánh quạt, đuôi, càng; con chip ra đế, chân, lõi, các lớp mạch). Không bao giờ thay một vật có thật bằng hộp, khối, biểu tượng. Liệt kê ở đây mọi vật sẽ lên hình, mỗi vật kèm những bộ phận làm nó nhận ra được;
   - **hình cho thứ vô hình**, và chỉ cho thứ vô hình (khí, nhiệt, tín hiệu, dòng điện, lực): vật gì chạy, bị chặn ở đâu, đổi trạng thái ra sao (electron chen qua chỗ hẹp, bắn tia lửa). Hình đó mọc ra từ vật thật và chạm vào vật thật;
   - **các nơi chốn** (2–4 với tập dài, 1–2 với Shorts) và đường máy đi giữa chúng (đi theo dây, chui vào vật, lùi ra);
   - **3 khung hero**: khung lập cảnh, khung cơ chế, khung "à ra thế". Tả mỗi khung: điểm nhìn, nguồn sáng, ba lớp sâu, màu nhấn;
   - **bảng ý → hình**: mỗi ý của câu trả lời một dòng, gồm ý đó, trên màn hình thấy gì, và vật nào làm gì để người xem thấy ý đó. Che cột ý đi, chỉ đọc cột hình vẫn phải ra câu chuyện. Ý nào không có hình thì bỏ ý, hoặc nghĩ ra hình cho nó. Khi lập bảng:
     - ý có **động từ biến đổi** (chín, phai, thở ra, lan, giục, nóng lên) phải có hình của chính quá trình đó trong khung: trước → sau ngay trước mắt, hoặc dòng đi từ đúng vật nguồn sang đúng vật nhận. Một khung chỉ cho thấy kết quả là chưa đủ. Tác nhân vô hình (khí, nhiệt, tín hiệu) dựng bằng `flow()` của `rig/fx.js`, không bằng chấm sáng (`glowDots` đọc như ánh phản chiếu). Nó phải là một **vật liền, đủ to để nhìn thấy ngay** (dải khói, dòng hạt dày lấp đầy khe giữa hai vật), không phải vài chấm. Nó phải **chạm tới** vật nhận, và chỗ chạm gây ra thay đổi thấy được ngay trong cùng cảnh (cửa mở, vỏ đổi màu);
     - câu có **con số** (bốn ngày, một phần mười triệu) thì con số đó có hình trong khung lúc câu được nói: mặt đồng hồ, lịch lật, thước, một chấm giữa một khoảng không lớn. Số chỉ có trong tiếng là thiếu hình;
     - câu nói về **hai bên so sánh** ("bên kia… đứng một mình") thì khung rộng có cả hai bên, tách bạch, mỗi bên một chỗ sáng;
     - câu nhắc **nơi chốn** nào (kho, nhà máy, trong quả) thì khung của câu đó ở đúng nơi đó. Không dùng lại cảnh bếp cho câu nói về cái kho;
     - câu hỏi có **so sánh** (nhanh hơn, khác, hơn) thì vật đối chứng phải ở trong khung, hoặc quay lại nó ít nhất mỗi 3 câu, để người xem tự thấy chỗ khác nhau;
     - mỗi dòng một **cách dựng** khác dòng trước (góc máy, cỡ cảnh hoặc vật chính). Không quá 2 câu liền nhau cùng một cách dựng;
     - có quay lại thời điểm trước (tua ngược, "lần nữa") thì phải có dấu hiệu nhìn thấy được: đồng hồ quay ngược, ánh sáng đổi, lật trang;
   - shot list gom từ bảng đó: thời điểm · cảnh · máy làm gì · vì sao.
4. Lời: `voice/lines.json`, viết **từ** bảng ý → hình. Mỗi câu thuộc một dòng của bảng, số viết thành chữ. Muốn thêm hay bớt câu thì sửa bảng và hình trước.
5. **Chấm lời trước khi làm giọng**: `sh channels/tram-nghi-nhieu/review.sh <tập> --script`. Một phiên model mới chỉ đọc `lines.json`, `FACTS.md` và `STRATEGY.md`, chấm theo `SCRIPT-CRITIC.md`: dữ kiện và thuật ngữ đúng, mỗi câu dựng được bằng vật thật, nhân quả không thiếu mắt xích, mở và kết, tiếng Việt nói. Kết quả ở `<tập>/review/SCRIPT-REVIEW.md`, exit 0 là PASS. FAIL thì sửa `lines.json` (và `FACTS.md`, bảng ý → hình nếu lỗi nằm ở đó) theo các dòng `VIẾT LẠI:`, rồi chạy lại; tối đa 3 lượt, còn FAIL thì ghi lý do vào `LOOK.md`. Chỉ khi PASS mới làm giọng và dựng cảnh.
6. Giọng: `voice/tts_vi.py` → `asr_vi.py` → `process.py` → `mk_timeline.py` (lệnh trong `build.sh` của tập).

## 2. Dựng hình: làm như phim mẫu đã làm

Thứ tự này là lý do phim mẫu đẹp. Đừng đảo.

1. **Trang trước, nội dung sau.** `index.html` của scaffold: thêm importmap của three (`rig/README.md`); `film()` vẽ vào `canvas#c` có sẵn. `src/film.js`: `film()`, `loadVoice(build)` (giờ của từng câu, phụ đề, sự kiện giọng), rồi đặt `window.render/DUR/EV/TEXTS/READY`.
2. **Dựng bối cảnh của khung hero 1 trước tiên**, chưa làm chuyển động. **Bối cảnh là nơi lời nói tới**, không phải nơi có sẵn. Nếu nơi đó là một trong các bối cảnh của `rig/sets.js` (`kitchen`, `desk`, `bathroom`; xem `demo/stills/set_*.jpg`) thì bắt đầu từ nó: đã có tường, cửa sổ, đèn chiếu đúng chỗ, đồ đạc và vật sống. Nơi khác (xưởng, bầu trời, nhà máy, trong máy) thì tự dựng, đừng bê căn bếp vào. Ảnh trong `demo/stills/` là mức tay nghề cần đạt (ánh sáng, chất liệu, chiều sâu), không phải nội dung để chép. Đặt vật chính ở `S.focus`, lấy góc máy từ `S.cams`, chọn `time` khớp với lời ("buổi sáng" thì `morning`, không để trăng). Đạo cụ đổi trạng thái có sẵn trong `rig/props.js`. Chỉ tự dựng nơi chốn khi không bộ nào hợp, và khi đó phải đạt các điều dưới đây:
   - tường có lỗ (`wallWithHole`) hoặc vật chắn có hình để đèn chính in bóng kể nơi chốn; `beam` và bụi nếu có vệt sáng;
   - mỗi bề mặt lớn một texture canvas có seed (`canvasTex`); đồ mềm nặn bằng `cushionGeo` hoặc `surface`, không để là hộp;
   - đồ đạc đủ dày để nơi đó có người sống: đồ nhỏ trên bàn, tranh, cây, thứ gì đó ngoài cửa sổ;
   - một vật sống: rèm lay, lá lay đổ bóng, LED thở, hơi nước.
3. **Vật trước cảnh**: mọi vật có thật sẽ lên hình (của rig hay tự dựng) nằm trong `src/props.js` của tập: `export const PROPS = { 'tên vật như lời gọi, kèm trạng thái': () => THREE.Object3D }`, và `film.js` lấy vật từ đó. Trước khi dựng cảnh đầu tiên, chạy `LEMO_ANGLE=vulkan sh channels/tram-nghi-nhieu/review.sh <tập> --props`: mỗi vật đứng riêng, nhìn từ ba phía; một phiên không biết tên gọi tên nó, phiên thứ hai so với tên bạn định. Vật bị gọi sai hay "không rõ" là vật thay thế: sửa theo dòng `SỬA:` (thêm bộ phận đặc trưng, đúng tỉ lệ, đúng chất liệu), xem lại ảnh ở `review/props/`, chạy lại tới khi PASS. Vật thêm sau cũng phải qua bước này. Vật dựng tốt mà dùng lại được thì đưa vào `rig/props.js`.
4. **Vòng still**: `LEMO_ANGLE=vulkan node core/render/still.mjs <tập> <t…> --out <scratch>`, rồi **mở ảnh ra xem**. Mỗi vòng ghi vào `LOOK.md`: thấy gì, vì sao, sửa gì. Chẩn đoán bằng cờ, đừng đoán:
   - mảng sáng mất hoặc bóng lạ → `?lightcam=1` nhìn từ đèn, `?nocast=<tag>` tắt từng vật đổ bóng (phim mẫu tìm ra chăn DoubleSide tự đổ bóng lên chính nó theo cách này);
   - cháy trắng → giảm cường độ đèn điểm (decay 2), chỉ vật `glowMat` k > 1 mới được loé;
   - vật đọc sai hình → đổi trục máy trước khi đổi vật.
   Ít nhất 3 vòng cho mỗi khung hero, trước khi làm chuyển động.
5. **Cơ chế** (khung hero 2): dựng thành vật thể có tham số (`speedTable`, `sparks`, `squiggle`, hạt trên `CatmullRomCurve3`, `rig/cutaway.js`).
   - Bên trong một vật: dùng `tissue()` của `rig/inside.js`, cắt theo tiết diện của chính vật (`section: 5` chuối, `section: 32` vật tròn), vật nguyên đặt cạnh khoanh trong cùng khung (vỏ có cửa mở được, mặt cắt có tế bào đổi trạng thái, đặt ngay trên bàn của bối cảnh, có đèn riêng), hoặc mặt cắt của `rig/cutaway.js` cho bình, ống. Máy đứng ngoài nhìn vào. Vật vẫn nằm trong bối cảnh có sàn, đèn và đồ xung quanh, như `demo/stills/cutaway_*.jpg`. Không đưa máy vào trong để quay một khoảng không chỉ có hạt.
   - Trước khi thêm chữ, khung phải có **một sự kiện nhân quả lớn trên màn hình**: một tác động (nắp bật, dòng điện vào) gây ra một thay đổi thấy được ngay trong vòng 1–2 giây (bọt trào, tia lửa, đổi màu). Tắt nhãn đi mà vẫn hiểu thì mới đạt.
   - Không vòng tròn đồng tâm, không mũi tên, không công thức.
6. **Chuyển động và máy quay**: keyframe bằng `keys()`. Đặt mốc theo **chữ** trong lời bằng `V.w(id, 'từ')`, không theo số giây. Vật được nhắc phải hiện lên đúng lúc từ đó được nói, và cơ chế không được chạy trước khi lời nói tới nguyên nhân của nó. Lấy đà, vượt đà (`back`), chuyển động phụ. Chuyển cảnh bằng `flash` màu cảnh sau, hoặc máy đi xuyên vật.
7. **Chữ**: `label()` cho thuật ngữ (tối đa một thẻ một lúc), mũi thẻ chỉ vào đúng vật được nhắc. Từ khoá của câu trả lời (tên của nguyên nhân) có thẻ ngay lần đầu được nói, chữ trên thẻ giống hệt chữ trong lời. Mỗi sự thật chỉ một thẻ: không để cùng một con số hay một tên hiện hai chỗ trong một khung. `subtitle()` cho phụ đề. Khai báo trong `TEXTS`.
8. **Vòng beat**: chạy `LEMO_ANGLE=vulkan node channels/tram-nghi-nhieu/beatsheet.mjs <tập> --out <scratch>`. Lệnh này ra mỗi câu một khung, chụp lúc câu đang được nói, có in câu bên dưới. **Mở từng tờ ra xem.** Với mỗi câu, hỏi: nếu không nghe, khung này có cho thấy điều câu nói không?
   - vật được nhắc có trong khung, ở chỗ sáng nhất và đậm màu nhất (nền tối và dịu hơn nó), chiếm đủ chỗ (không nằm ở mép khung, không bị cắt), và đang làm việc câu nói;
   - thẻ chữ nằm trong khung, chỉ đúng vật;
   - con số trên hình trùng với con số trong lời;
   - nhiều câu liền nhau trên cùng một khung đứng yên là dấu hiệu thiếu hình.
   Lệnh cũng tự đo từng khung và in nhãn đỏ: `DARK` (vật chính nằm trong bóng: đưa đèn chính hoặc `pool` vào nó) và `SAME` (gần y hệt khung câu trước: câu này chưa có hình riêng; máy trôi nhẹ hay hạt bay không làm thành hình mới) và `NUM` (câu nói một con số mà trên màn hình không có số nào lúc đó: thêm đồng hồ, lịch, thẻ số) và `RUN` (câu thứ tư liền nhau vẫn quay cùng những vật ấy, đo bằng các tia bắn qua khung: phim đã ngừng cho thấy điều mới; cho câu đó hình riêng: một nơi khác, cắt vào bên trong, so sánh hai bên, một khung rộng cho biết đang ở đâu, một vật mới; một bố cục giữ tối đa ba câu). Sửa hết các nhãn. Chỉ giữ `SAME` khi cố ý, và ghi lý do vào `LOOK.md`.
   Ghi vào `LOOK.md` những câu lệch, vì sao lệch, đã sửa gì. Khi cảnh hết cờ, gọi người chấm cho cảnh đó (§3) rồi mới sang cảnh sau.
9. **Tiếng**: `window.EV` = sự kiện giọng (`V.ev`) + nhạc + ambience + foley ở đúng chỗ có vật làm ra tiếng (định dạng: `rig/README.md` § voice.js).
10. Dựng (chỉ sau khi `review.sh` cả phim PASS, §3): `LEMO_ANGLE=vulkan sh build.sh`; cổng: `LEMO_ANGLE=vulkan sh core/render/review.sh <tập>` phải exit 0.

Muốn thêm một bộ phận dùng lại được (bối cảnh, đạo cụ, hiệu ứng) thì đưa vào `channels/tram-nghi-nhieu/rig/` và ghi một dòng vào `rig/README.md`. Không sửa `render.js` cho riêng một tập.

## 3. Chấm hình: một phiên khác chấm, theo từng cảnh

Điểm tự chấm không đáng tin: người làm biết mình định vẽ gì nên nhìn ra điều đó cả khi nó không có trên hình. Việc chấm do `review.sh` làm: nó mở **một phiên mới** của model (mặc định chính model của bạn, qua `omp -p`; đặt `LEMO_CRITIC_MODEL` hay `LEMO_CRITIC` để chọn khác), trong một thư mục ngoài repo chỉ có khung hình, lời và `FACTS.md`. Người chấm không thấy code và ghi chú của bạn, chấm theo `channels/tram-nghi-nhieu/CRITIC.md`, và ghi cách sửa từng câu bằng hình cụ thể.

```
LEMO_ANGLE=vulkan sh channels/tram-nghi-nhieu/review.sh <tập> --lines 4-7     # một cảnh vừa dựng
LEMO_ANGLE=vulkan sh channels/tram-nghi-nhieu/review.sh <tập>                 # cả phim, trước khi render
LEMO_ANGLE=vulkan sh channels/tram-nghi-nhieu/review.sh <tập> --video         # sau khi render: thêm bốn khung mỗi câu từ mp4
```
Kết quả ở `<tập>/review/REVIEW.md` (lịch sử: `REVIEW-<n>.md`); exit 0 là PASS. Câu nào còn cờ máy (`DARK SAME RUN NUM`) thì FAIL dù người chấm cho qua.

Vòng làm việc, không bỏ bước:
1. Chia lời thành cảnh 3–4 câu. Dựng xong một cảnh (hình, chữ, mốc theo chữ) thì chạy `review.sh --lines a-b` cho cảnh đó **trước khi** dựng cảnh sau.
2. FAIL: sửa đúng các câu FAIL theo dòng `SỬA:` của nó, rồi chạy lại. Không cãi người chấm, không sửa cờ hay dữ liệu kiểm để qua cổng. Sau 3 lượt một cảnh vẫn FAIL thì ghi vào `LOOK.md` câu nào, vì sao, rồi sang cảnh sau.
3. Đủ cảnh: chạy `review.sh` cho cả phim. Chỉ khi PASS (OVERALL ≥ 9) mới dựng tiếng và render 24 fps. Render toàn phim là việc chậm nhất: làm một lần, sau khi hình đã đạt.
4. Render xong: `review.sh --video` một lần, để bắt chuyển động không diễn ra, khung đen, lỗi chỉ có ở bản render.
5. **Cổng máy**: lần PASS của `--script` và của `review.sh` cả phim (không `--lines`, không `--video`) ghi con dấu vào `review/SCRIPT.pass`, `review/PICTURE.pass`: mã băm của lời và của `src/*.js`, `index.html` lúc được chấm. `build.sh` (qua `mix.py`) dừng nếu thiếu con dấu hay code đã đổi sau lần PASS. Sửa gì sau khi PASS thì chấm lại cả phim rồi mới dựng. Không viết tay con dấu, không sửa REVIEW.md.
6. Ghi điểm từng lượt vào `LOOK.md`. Bàn giao kèm `review/REVIEW.md` cuối cùng, nguyên văn.

## 4. Bàn giao

Báo người dùng: đường dẫn phim, 3 khung hero, tờ beat, kết quả chấm độc lập, và các điểm yếu còn lại, nói thật.
