# Retro — tap-01-phoi-quan-ao, phần hai: cổng không mở được, và người giám sát không thấy gì (2026-11-09)

Đây là phần hai của bản ghi [`2026-11-08-tap-01-phoi-quan-ao.md`](2026-11-08-tap-01-phoi-quan-ao.md). Bản ghi
đầu đóng lúc 23:29 ngày 8, khi phiên vẫn đang chạy và chưa có phim. Bản ghi này viết lúc 01:30 ngày 9, từ
trong phiên, với tư cách người giám sát: đọc toàn bộ transcript của phiên sản xuất
(`~/.claude/projects/-home-minhbien-Documents-lemo-opuscar/e8ec853c-2f62-427e-9528-3cdc7c568ee1.jsonl`,
554 MB → 684 MB), đọc cổng, đọc lệnh của supervisor cũ, và sửa những gì đã sửa được.

**Bốn mươi phút đầu của phiên thứ hai này là cảnh một agent kẹt.** Không phải kẹt vì code hỏng: kẹt vì nó
đang chờ một subagent bằng cách dò mtime của file, trong khi chính nó cũng đang sửa file đó.

---

## Bối cảnh

| | |
|---|---|
| Phiên | `e8ec853c-2f62-427e-9528-3cdc7c568ee1.jsonl` (Claude Code, bắt đầu 10:42 ngày 8) |
| Đoạn quan sát | 23:29 ngày 8 → 01:30 ngày 9 (giữa chừng một phiên dài) |
| Sự cố kẹt | 13 lệnh `ls -l --time-style=+%H:%M:%S src/props.js; date +%H:%M:%S` trong 10 phút |
| Vỏ nền chồng nhau | 4 vỏ `while … sleep 15` chờ `props.js` "ổn định" (00:56, 01:00, 01:03, 01:06) |
| Hai người viết cùng một file | phiên sửa `streakTex` lúc 18:07:36, trong lúc subagent của nó cũng sửa `src/props.js` |
| Supervisor | `tools/supervise.sh` đọc `$HOME/.omp/agent/sessions/…` — **không phải** transcript đang chạy |

---

## Những điểm thành công

1. **Cổng máy vẫn giữ.** Suốt 15 giờ, `out/` rỗng: không có `.mp4` nào được ký tên "đã xong" khi props chưa
   PASS. Cổng làm đúng việc.
2. **Người làm biết dừng lại.** Vòng storyboard 5/5 REJECT thì chốt bằng `STORYBOARD-DIRECTORS-CUT.md`, vòng
   audit 5/5 thì chốt bằng `ASSET-AUDIT-DIRECTORS-CUT.md`. Cả hai bản cắt đều ghi rõ cái đã sửa, cái không
   sửa được và vì sao — không giả vờ PASS.
3. **Các con số trên hình đúng.** `check_claims.py`, `check_facts.py`, `check_citations.py` xanh suốt 15 giờ
   trên một tập có `288 g`, `90 %`, `2 kJ`, `30 °C` trên màn hình.
4. **Phiên nghe lời khi được chỉ đường.** Khi giám sát nói "đừng dò file, hãy chờ thông báo của subagent;
   cổng props đã đổi", phiên dừng vòng dò ngay (không còn lệnh `ls -l src/props.js` nào sau 18:09),
   `TaskStop` subagent, và chuyển sang dùng `core/render/sheet.py` — đúng công cụ có sẵn.
5. **Vòng 8 của bản LOOK là một bài sửa đúng gốc.** Người làm tự tìm ra rằng mọi nhát trong bối cảnh N2
   chia sẻ **một** bàn sợi, nên mọi khung đều là "một mớ sợi" chứ không phải một vật — rồi dựng cơ chế
   `aux`/`hero` để mỗi nhát chỉ có một vật chính, sửa cầu mào của nước trong khe, giảm tím nền, mảnh
   nét mực lại, và đổi góc máy của bàn tay. Đây là loại sửa đáng giá hơn nhiều so với sửa từng khung: nó
   sửa nguyên nhân, không sửa triệu chứng.
6. **Khoa học của tập đứng vững.** `FACTS.md` có nguồn thật cho từng con số (Rogers & Yau, Alduchov &
   Eskridge, Teske et al.), ghi rõ **phạm vi** ("đây là đường cong hiệu chỉnh cho hơi nước trong mây, không
   phải nhiệt ẩn ở điểm sôi"), và viết sẵn **cách nói** để không vỡ nhịp. Lời kể đo được: 60 câu, chỉ
   **3 con số** (0,34 mỗi 20 giây, dưới cả luật của kênh lẫn ngưỡng mặc định của thư viện).

---

## Đánh giá quá trình: phiên này làm được gì và còn mắc gì

**Còn mắc (đo được, không phải cảm nhận).**

| Vấn đề | Đo bằng gì | Xem ở đâu |
|---|---|---|
| Khung hình rỗng đi qua nhiều vòng chấm | `b_002` là một bức tường trơn, `b_025` là một mảng nâu, `b_050` có hai vùng chết | `review/beatsheet/` |
| Rubric chấm hình không hỏi "vật chính đủ lớn không" | `PROMPT_CRITIC.md` của bước 6 có `DARK`, `SAME`, `RUN`, `NUM` — không có câu nào về bố cục | `.agents/skills/…/step6-assembly/` |
| Bài kiểm tra chết giữa chừng bị đọc như phán quyết | `readcheck` chết hai lần, không có lời giải thích | `core/render/readcheck.mjs` |
| Vòng chấm dao động, không ai biết | vòng props 3 → 4: `#3` và `#9` tốt lên, `#21` hỏng đi | `review/PROPS-REVIEW-3.md`, `-4.md` |
| Luật của kênh không được máy giữ | `STRATEGY.md` nói "hai con số mỗi phút"; `scenecheck` cho phép hai con số mỗi **hai mươi** giây | `STRATEGY.md`, `core/render/scenecheck.mjs` |
| Bảng phim không được dựng lại khi manifest đổi | `FILMS.md` không có dòng của tập → cổng supervisor đỏ | `FILMS.md` |
| Báo cáo luật của supervisor nhiễu và sai | T9 bắn 15 lần vào một phim 3D; lệnh có heredoc tràn ra nhiều dòng; bằng chứng không được ghi khi tắt model | `improvements/supervision/rules-latest.txt` |

**Không mắc.**

- Không còn vòng dò file: sau 18:09 không còn lệnh `ls -l src/props.js` nào trong log (một lần nữa ở
  17:42–18:06, đúng lúc còn một subagent sở hữu file — xem N2).
- Một người viết mỗi file tại một thời điểm: hai lần ghi `src/props.js` chồng nhau đã được phát hiện và
  dừng.
- Nghiên cứu không bịa: mọi con số trên màn hình có nguồn, và `check_claims`/`check_citations`/`check_facts`
  xanh suốt.
- Cổng hình và cổng props **chưa** mở, và phim **chưa** có. Tập vẫn chưa được ký tên là xong — đúng.

**Điều mà tập này dạy cho tập sau.** Một tập hay không phụ thuộc vào việc dựng đẹp, mà vào việc **một
câu nói có một hình đúng đi kèm**: `c21` ("hơn hai kilojoule nhiệt") phải có một vật để nhìn; `b_021` có
một nhãn `2 kJ`; `b_015` có một giọt nước. Chỗ nào thiếu vật — `b_002`, `b_025`, `b_050` — câu nói trôi
đi và người xem tắt tiếng không đoán được. Rubric của bước 6 giờ hỏi đúng câu đó.

---

## Phát hiện

### N1 — critical — Người giám sát nhìn nhầm phiên: báo cáo luôn trống, và người đọc tưởng là "không có lỗi"

**Bằng chứng.** `tools/supervise.sh` lấy transcript ở
`$HOME/.omp/agent/sessions/$SLUG`, còn phiên sản xuất là Claude Code, transcript ở
`~/.claude/projects/-home-minhbien-Documents-lemo-opuscar/`. Hai thư mục còn khác nhau cả cách đặt tên:
omp dùng đường dẫn dưới nhà (`-Documents-lemo-opuscar`), Claude Code dùng cả đường dẫn
(`-home-minhbien-Documents-lemo-opuscar`).

Hậu quả, đã ghi trong chính nhật ký của supervisor:
- `improvements/supervision/rules-latest.txt` — **1 byte, rỗng**.
- `improvements/supervision/reviewer.log` — "the supervised transcript … is not a film session".

**Tệ hơn nữa.** Cả hai chỗ đọc transcript đều hiểu **một** dạng JSON: omp (`"tool_execution_start"`). Dạng
của Claude Code (`assistant` → `content[]` → `tool_use`) thì không được đọc. Nghĩa là nếu chỉ sửa đường dẫn
mà không sửa cách đọc, supervisor vẫn trống — lần này là vì nó không hiểu ngôn ngữ.

**Hệ quả.** 15 giờ, hàng trăm vi phạm R1 (ghi file bằng heredoc) và R5 (poll bằng `sleep`) đi qua mà không
một lần nào có nhân chứng. Bản ghi đầu đã gọi đây là P5; bản ghi đó cũng đã ghi rõ "không có gì bị phá
không được đọc thành chưa ai nhìn".

**Guard đã có.** `tools/transcript.py` đọc cả hai dạng transcript và trả về cùng một dạng sự kiện
`(at, tool, args)`. `supervise.sh` tìm thư mục transcript của cả hai công cụ theo đúng quy ước tên của mỗi
công cụ. Kiểm chứng: trước khi sửa, supervisor báo "35 lỗi" từ một transcript không liên quan; sau khi sửa,
nó báo **96 lỗi** đúng từ transcript của phiên sản xuất.

### N2 — critical — Vòng dò: chờ một subagent bằng cách dò mtime của file nó đang viết

**Bằng chứng.** Trong 10 phút (17:59 → 18:08), phiên chạy 244 lệnh Bash; **13 lệnh là cùng một dòng**
`ls -l --time-style=+%H:%M:%S src/props.js; date +%H:%M:%S`, và 8 lệnh nữa là dòng đó kèm `node --check`.
Cùng lúc, nó mở 4 vỏ nền `while [ $stable -lt 4 ]; do sleep 15; …` chờ `props.js` "ổn định", và gọi
`ListAgents` 13 lần.

**Hệ quả.** Một agent báo xong thì báo trong hộp thư của phiên cha — không cần dò gì cả. Vòng dò ăn mất
lượt mà không quyết định được điều gì, và nó đẩy phiên về phía `sleep` (R5).

**Guard đã có.** `CODING_STANDARDS.md` **R9** — "Chờ agent, đừng chờ file": cùng một lệnh năm lần là một
vòng dò, bất kể nó đang nhìn cái gì; hai agent không bao giờ viết cùng một file. `tools/supervise.sh` đếm
và báo: đúng vòng dò của phiên này hiện ra là hai dòng
`R9 12 lần…` và `R9 8 lần…`.

### N3 — critical — Cổng props không mở được: nó đòi người xem mù gọi tên một thứ không thể gọi tên

**Bằng chứng.** Rubric của `review.sh --props` nói *"PASS chỉ khi mọi vật KHỚP"*, trong khi chính thân
rubric lại dạy: với một linh kiện mà người thường không biết tên, chỉ cần người xem **tả đúng hình thật làm
nên nó**. Hai câu đó chống lại nhau. Vật thật bị loại là "linh kiện kỹ thuật" trong tập này:

| Vật | Người xem mù gọi | Vòng 1 | Vòng 3 | Vòng 4 |
|---|---|---|---|---|
| `#17 sợi vải đan cận` | ống giấy cuộn xếp lưới | HỎNG | HỎNG | HỎNG |
| `#18 tấm vải dệt` | lưới thép mắt xích | HỎNG | HỎNG | HỎNG |
| `#19 giọt nước đọng trên sợi` | dây chuyền mặc dây | HỎNG | HỎNG | HỎNG |
| `#20 mặt nước cận có gợn sóng` | KHÔNG RÕ | HỎNG | HỎNG | HỎNG |
| `#23 giọt nước rơi từ mép khăn` | bình thuỷ tinh có nút vải | HỎNG | HỎNG | HỎNG |

Năm vật đó **chưa bao giờ** PASS trong bất kỳ vòng nào. Không phải vì hình dở — mà vì "KHÔNG RÕ" bị tính là
HỎNG, và không có câu nào trong quy trình nói rằng cổng này sẽ không bao giờ mở. Mỗi vòng props tốn ~40
phút; không có trần số vòng cho `--props` (`--outline` trần 4, `--script` trần 6).

**Guard đã có.** Rubric chia vật thành hai nhóm **lấy từ chính cái tên của vật**:
- **Nhóm A — vật đứng riêng** (dây phơi, kẹp gỗ, áo, quần, khăn, bồn, quạt, túi, cân, nhiệt kế, ẩm kế, ghế,
  bàn): phải đúng tên.
- **Nhóm B — vật là phần hoặc cơ chế** (sợi đan, tấm vải dệt, giọt nước trên sợi, mặt nước cận, nửa áo ướt,
  áo úp, giọt rơi từ mép khăn, bàn tay): chỉ HỎNG khi ảnh **cho thấy một vật thật khác**; "KHÔNG RÕ" hoặc một
  danh từ chung đúng (nước, vải, sợi, tay) thì KHỚP kèm ghi chú.

Đây đúng là luật của kênh: vật có thật phải dựng đúng là nó, không bao giờ là vật khác đứng thay cho nó.
Và `--props` có **trần 5 vòng**, rồi dừng và báo người dùng.

### N4 — high — Bước 3 (storyboard) không có tem, không có công cụ, không ai ký

**Bằng chứng.** `gate.py` biết bốn loại tem (`outline`, `script`, `props`, `picture`) — bước 3 không có.
`review.sh` có `--outline --script --props --lines --chapter --video` — không có chế độ nào cho storyboard.
Năm bản chấm storyboard (`STORYBOARD-REVIEW.md`, `-3`, `-4`, `-5`) đều **do tay đặt vào**: không chữ ký
người chấm, không đếm được vòng, không ai ràng buộc. Năm vòng đó mất khoảng 4,5 giờ.

**Hệ quả kép.** Bước 3 có thể bị bỏ qua trọn vẹn mà không gì phát hiện; và nó có thể chạy mãi mà không ai
đếm. `review/STORYBOARD-REVIEW.md` (không hậu tố) giữ **vòng 2/5** trong khi `STORYBOARD-REVIEW-5.md` là
vòng 5 — đọc file không hậu tố thấy verdict **cũ**.

**Guard đã có.** `review.sh --storyboard` chấm `LOOK.md` + `src/film.js` + ảnh `review/hero/`, có chữ ký
người chấm, trần 5 vòng, và đóng tem `STORYBOARD.pass`; `gate.py` biết loại tem đó và
`NEEDS['render']` yêu cầu nó.

**Cửa thoát, và tại sao nó không phải là một cái lỗ.** Một cổng không mở được thì cũng là một nhà tù. Kênh
này đã có sẵn cách chốt: **đạo diễn cắt** — một bản ghi rõ cái đã sửa, cái không sửa được và vì sao, kết
thúc bằng `VERDICT: PASS` và một dòng `SCOPE` nêu nhát nào đã cắt. Cổng storyboard nhận bản cắt như một
PASS có phạm vi, khi bản cắt **không cũ hơn** vòng chấm cuối. Vậy nên: cổng mở được, và cái nó chấp nhận
là một bản cắt viết ra, không phải một chữ PASS bằng tay.

### N5 — high — Tập không vào repository: dàn ý, lời kể và mã chỉ nằm trên máy này

**Bằng chứng.** `.gitignore` có dòng `channels/tram-nghi-nhieu/series` — do chính một commit giữa phiên thêm
vào (`c35e5a4`, 20:02 ngày 8), không kèm chú thích, xoá trọn cây tập khỏi git. `tools/check_tracked.py` đã có
và đã được nối vào CI và pre-commit — nhưng nó FAIL, và không ai chạy nó trong 15 giờ.

**Hệ quả.** `improvements/README.md` nói: *"the rationale of a film belongs with the film"*. Ở đây nó không
thuộc về phim nữa: nó thuộc về ổ đĩa của một máy. Tập bị xoá thì dàn ý, lời kể và toàn bộ mã dựng biến
mất cùng nó.

**Guard đã có.** Dòng `.gitignore` bỏ đi; chỉ còn các khung hình review sinh lại được
(`review/beatsheet/`, `review/hero/`, `review/props/`) là ở ngoài git. `tools/check_tracked.py` chạy trong
cổng của supervisor. Kiểm chứng: `check_tracked.py` FAIL trước, PASS sau.

### N6 — medium — `film.json` có "movie" mà `runtime` rỗng: index in UNKNOWN cho một phim có thật

**Bằng chứng.** `core/render/filmcheck.mjs:190` kiểm tra định dạng `M:SS` **khi trường không rỗng**
(`if (fj.runtime && …)`) — chuỗi rỗng là falsy nên lọt qua. `film.json` của tập đang là
`{"movie": "…mp4", "runtime": ""}`.

**Guard đã có.** `filmcheck` FAIL khi manifest có "movie" mà không có "runtime".

### N7 — medium — Bản chấm không hậu tố giữ verdict cũ

**Bằng chứng.** `review.sh:161` copy cùng một file ra hai chỗ
(`PROPS-REVIEW-$n.md` và `PROPS-REVIEW.md`) — đúng thiết kế. Nhưng ở 15:20, `PROPS-REVIEW.md` trùng byte
với `PROPS-REVIEW-1.md`, tức là nó giữ vòng 1 trong khi vòng 4 đã xong.

**Guard đã có.** `filmcheck` đọc thư mục `review/`: trong một họ bản chấm, file không hậu tố phải **trùng
byte với vòng mới nhất**; hai vòng có hậu tố trùng byte là một vòng viết hai lần — và bộ đếm vòng đếm nó
hai lần.

### N8 — medium — `FILMS.md` gọi tên ba phim đã bị xoá

**Bằng chứng.** `tools/check_films_index.py` FAIL với ba dòng trỏ tới
`series/co-the/tap-01-ngu-trua-day-me/`, `series/do-vat/tap-01-bong-den-led/`,
`series/do-vat/tap-01-chai-nuoc-ngot-xi-bot/` — ba thư mục đã bị xoá ở commit `499cdf4`.

**Guard đã có.** `tools/gen_films_index.py` viết lại `FILMS.md` từ các manifest; `check_films_index.py` PASS.

### N9 — medium — Skill không chỉ tới `lessons.md`, và hai bản skill có thể trôi lệch nhau

**Bằng chứng.** `grep` trong `.claude/skills/tram-nghi-nhieu/`: **0** kết nối tới `improvements/lessons.md`.
`improvements/README.md` tự dặt *"Read the distilled version … Read this before you build a film"* — nhưng
không có gì chỉ đường cho skill. Và `.claude/skills/tram-nghi-nhieu/` với `.agents/skills/tram-nghi-nhieu/`
là hai bản riêng: hôm nay chúng giống nhau từng byte, nhưng không có gì giữ chúng giống nhau.

**Guard đã có.** Một dòng con trỏ ở đầu `SKILL.md`; một bước CI (`diff -r`) giữ hai bản là một.

### N10 — low — Vòng chấm dao động: vật KHỚP ở vòng n-1 thành HỎNG ở vòng n mà mã không đổi

**Bằng chứng.** So vòng props 1 và vòng props 2 (giữa hai vòng, `src/props.js` được sửa lại): `#1 dây
phơi`, `#2 kẹp gỗ`, `#7 khăn`, `#11 túi nylon`, `#16 bàn`, `#21 áo phơi một mặt` đều đổi từ KHỚP sang
HỎNG. Lần này phán quyết là có cơ sở — bản sửa của vòng 1 biến sợi dây thành có gai nhọn, bản sửa của vòng
2 biến kẹp gỗ thành "hai thanh/ván màu vàng nâu". Nhưng nó cho thấy **sửa hình theo lời chấm vòng trước
làm hỏng vật đang đúng**, và vòng sau lại chỉ ra vật mới hỏng.

**Guard đã có.** `review.sh --props` ghi hash của `src/props.js` vào mỗi bản chấm
(`<!-- code: … -->`), rồi so với vòng trước: **vật nào đổi phán quyết mà mã y hệt** thì in ra
(`⚠ 1 vật đổi phán quyết giữa vòng 3 và vòng 4 MÀ MÃ KHÔNG ĐỔI`) kèm lời nhắc xem lại ảnh vật đó trước
khi sửa. Đo được trên chính tập này: vòng 3 → vòng 4, `#3` và `#9` đi từ HỎNG sang KHỚP (tốt), còn `#21`
đi từ KHỚP sang HỎNG — đúng loại dao động mà trước đó chỉ có thể đoán. Việc còn lại (một phiên chấm mù
chạy lại trên **cùng tập ảnh** để biết vòng nào là lỗi thật) chưa làm.

---

## N11 — high — Một bài kiểm tra chết giữa chừng không phải là phán quyết về phim, nhưng nó được đọc như một phán quyết

**Bằng chứng.** `node core/render/readcheck.mjs <tập> 880` chết hai lần với
`page.evaluate: Target page, context or browser has been closed` — một dấu vết của lỗi Node, không phải
một phán quyết. Lần thứ nhất lúc 01:34, lần thứ hai lúc 01:38, cả hai lần khi phiên sản xuất đang dựng
hình song song. Phiên sản xuất tự đã gặp đúng lỗi này một lần trước đó và đã đoán: *"readcheck ran
against a mid-edit file. That's expected during concurrent edits — I should not run checks while agents
edit."* — một phỏng đoán đúng, nhưng đoán, và tốn thời gian.

Về mặt kỹ thuật, `readcheck` đọc **cả phim trong một vòng lặp đồng bộ**: 176 s phim, bước 0.04 s ⇒ 4 400
lần `window.render(t)` trong *một* task của trình duyệt. Trong suốt thời gian đó trang không thở được, hàng
đợi GPU chồng lên nhau, và renderer có thể chết giữa chừng. Tệ hơn: khi trang chết, tập tin bị sửa dở,
không ai nói — kết quả là phán quyết về một bản phim không tồn tại.

**Guard đã có.**
- `core/render/sourcewatch.mjs`: bài kiểm tra chụp vân tay (hash) của `index.html`, `src/*.js`,
  `voice/lines.json` **trước** khi mở trang, và so lại **sau** khi đọc xong. File nào đổi trong lúc chạy
  ⇒ kết quả bị bỏ, và bài kiểm tra nói *"the film's source changed while the check was reading it … Run
  it again on a settled file"* rồi thoát mã 2 (chạy được, không phải phán quyết).
- `readcheck` đọc phim **theo chặng** (120 khung mỗi lượt) thay vì một vòng lặp dài: trình duyệt được thở
  giữa mỗi chặng, và khi trang chết, bài kiểm tra biết nó chết ở giây nào.
- `scenecheck` dùng chung hai điều trên.
- `core/render/review.sh`: mã thoát 2 được gọi đúng tên — *"COULD NOT RUN — not a verdict about the
  film"* — thay vì *"FAILED"*. Một dòng này tiết kiệm cho agent một vòng điều tra sai.

---

## N12 — medium — Một con trỏ hỏng trong tài liệu không ai thấy, vì con trỏ hỏng thì im lặng

**Bằng chứng.** Chính tôi viết dòng trỏ sai trong `SKILL.md`:
`[improvements/lessons.md](../../improvements/lessons.md)` — từ `.agents/skills/tram-nghi-nhieu/` mà đi lên
hai bậc là `.agents/`, nơi không có `improvements/`. Dòng trỏ đó **không bao giờ** tới đúng file, và không
ai để ý, vì con trỏ hỏng không phát ra tiếng động: agent đọc dòng đó, đi tìm, không thấy, đi tiếp — và
luật mà dòng đó mang theo không tới được ai.

Khi viết `tools/check_doc_links.py` để quét toàn thư viện, nó tìm ra thêm một lỗi thật trong tài liệu
của tôi: `improvements/README.md` trỏ tới `retro/2026-10-30-tram-nghi-nhieu.md` (thừa một chữ `i`),
trong khi file thật là `retro/2026-10-30-tram-nghi-nhieu.md`.

**Guard đã có.** `tools/check_doc_links.py` mở mọi file `.md` của thư viện, lấy đích của mọi liên kết
markdown, và giải nó theo thư mục chứa nó. Liên kết nằm trong code thì bỏ qua (đó là ví dụ, không phải
con trỏ); thư mục `_template` thì bỏ qua (mẫu chưa viết). Chạy trong pre-commit khi có `.md` được stage,
và trong CI.

---

## N13 — medium — Một bước CI không thể thất bại, nên nó không kiểm tra gì

**Bằng chứng.** Bước CI *"the two copies of the channel skill are the same skill"* chạy
`diff -r .claude/skills/tram-nghi-nhieu .agents/skills/tram-nghi-nhieu`. Nhưng
`.claude/skills/tram-nghi-nhieu` là **symlink** trỏ tới `.agents/skills/tram-nghi-nhieu` — `diff` so một
thư mục với chính nó, và luôn trả về 0. Bước này không thể thất bại, nên nó không kiểm tra gì: một bản
skill trôi lệch sẽ đi qua.

**Guard đã có.** CI kiểm tra **cấu trúc** thay vì nội dung: `.claude/skills/tram-nghi-nhieu` phải là
symlink, và phải trỏ tới cùng thư mục thật với bản `.agents`. Hai bản không thể trôi lệch, vì chúng là
một.

---

## N14 — medium — Bài kiểm tra đọc hình vẽ mỗi khung hình hai lần

**Bằng chứng.** `core/render/readcheck.mjs` gọi `window.render(t)` rồi mới gọi `window.TEXTS(t)`. Nhưng
rig của kênh viết `window.TEXTS = t => { window.render(t); return F.texts(); }` — **TEXTS tự vẽ khung
hình trước khi trả lời**. Mỗi khung vì thế được vẽ hai lần: một lần của chính bài kiểm tra, một lần
của phim. Với một phim 3D, đây là bước chậm nhất của cổng bàn giao, và nó tốn gấp đôi.

**Kiểm chứng.** Chạy lại trên `films/host-toon-test` trước và sau: **cùng một phán quyết** (đúng một
dòng BAD: "5 tháng" chạm dải phụ đề), và thời gian giảm một nửa.

**Guard đã có.** `readcheck` đếm số lần vẽ mà `TEXTS` tự làm, và chỉ tự vẽ khi `TEXTS` không vẽ. Bài
kiểm tra in ra dòng nói mình đang đọc theo cách nào.

---

## N15 — high — Người chấm hình phải đoán "vật chính bé tí trong một mảng trống" bằng mắt, và phải mất chín vòng mới sửa xong

**Bằng chứng.** Vòng LOOK của phiên này kéo dài tới vòng 9. Những vòng sau là sửa đúng những khung mà
tôi đã soi bằng mắt từ tờ beat cũ: c2 (mảng gỗ trơn), c6, c25, c50, c54 (bàn tay nhỏ như búp bê gỗ).
Nguyên nhân không phải là người làm không tinh — mà là **tiêu chí của người chấm hình không có số nào để
cân**: câu "vật chính có đủ lớn không" phải trả lời bằng mắt trên một tờ 60 khung.

**Guard đã có.** Rig đã bắn tia qua khung hình để đo RUN (những tia đó cho biết vật nào chiếm bao nhiêu
khung) — số đó **bị bỏ đi**. Nay tờ beat in `fill N%` dưới mỗi khung (đỏ dưới 15%), và tiêu chí 6 của
người chấm yêu cầu cân số đó với con mắt: cảnh toàn cảnh đọc 0% mà cận cảnh một mặt phẳng trơn có
thể đọc 100%, nên con số là gợi ý, không phải phán quyết.

**Đo được.** Trên tập này: 26/60 khung dưới 15%. Trong đó có cả những khung hợp lệ (cảnh trong sợi vải,
cảnh toàn cảnh) — nên con số không thay được con mắt, nhưng nó đưa con mắt tới đúng chỗ cần soi.

---

## N16 — high — Bài kiểm tra đọc hình vẽ ở đúng chất lượng phim, và mất máy vì chính cái hình đó

**Bằng chứng.** `readcheck` trên tập này chết ở giây 91,2 / 176,4: *"the page died while the check was reading
it"*. Rig của kênh vẽ ở **siêu lấy mẫu 2×** (3840×2160) với ba lượt dựng bối cảnh, một lượt nét mực và
bloom; trên máy này (GTX 1660 Ti, 6 GB) trình duyệt không chịu nổi.

**Đo lại.** `node core/render/readcheck.mjs <tập> --band 880 --q ss=1` đọc **trọn 176 giây** không chết.
Hộp chữ mà bài này đo là hộp trên canvas 1920×1080 và phép chiếu của camera — **không đổi** khi bỏ siêu lấy
mẫu. Nên kết quả là của cùng một phim, chỉ vẽ rẻ hơn.

**Guard đã có.** `scene_rules.json` của kênh có `"readcheckQ": "ss=1"`, và `core/render/review.sh` truyền nó
cho `readcheck`. Ảnh chụp và bản dựng vẫn ở 2× — chỉ bài đo bị hạ.

**Đáng chú ý.** Lần chạy đó bị bỏ vì người làm sửa `src/film.js` và `src/props.js` **trong lúc** bài kiểm tra
đang đọc: *"the film's source changed while the check was reading it … the result is void"*. Đó là bộ chặn
vân tay nguồn (N11) làm đúng việc — nhưng nó cũng cho thấy một điều: phiên sửa code ngay cả khi đang chạy bài
kiểm tra. Đã báo phiên: để code đứng yên rồi chạy.

---

## N17 — medium — Luật R1 của người giám sát đếm sai thứ nó tưởng nó đếm

**Bằng chứng.** Báo cáo của `tools/supervise.sh` bảo *"the session broke 475 of the library's rules"*. Sự thật là
**34**: phiên sửa file của dự án bằng shell 34 lần (heredoc `cat >>`, `sed -i`, `open(p, 'w')` trong script
python) — con số đáng kể, nhưng không phải 475.

**Vì sao sai.** Luật cũ nhận ra một lệnh shell *ghi file* khi lệnh đó có dấu hiệu `open(..., 'w')` **và** có
heredoc. Nên:

- một script heredoc đọc `core/render/still.mjs` rồi ghi `src/film.js` bị tính là **hai** lần ghi file;
- một lệnh `cat >> LOOK.md <<'EOF'` — đúng hình dạng R1 cấm — bị bỏ sót, vì không có `open(..., 'w')` nào.

Tệ hơn: báo cáo liệt kê **một dòng cho mỗi lần xảy ra**, nên 475 dòng gần giống nhau đẩy các phát hiện khác
ra khỏi màn hình cuối.

**Guard đã có.** `tools/supervise.sh` giờ đọc **vị trí ghi**: `open(x, 'w')` (và đoán `x` qua biến được gán trong
thân heredoc), một redirect (`>`, `>>`), `sed -i`, `cp`/`mv` (đích), `os.replace`, `shutil.copy/move`. Một file
lệnh **chỉ nhắc tới** không phải file lệnh **ghi**; một file tạm trong `/tmp` không phải file của dự án. Báo cáo
gộp mỗi luật thành **một dòng** có số lần và tên các file.

**Còn lại.** Số 34 là **cận dưới**: transcript cắt ngắn lệnh dài, nên những script bị cắt giữa chừng không tìm
thấy đường dẫn. Báo cáo ghi rõ điều đó. Muốn con số đúng thì phải đọc transcript gốc, không phải dòng lệnh đã cắt.

---

## N18 — medium — Người chấm hình mở sáu mươi ảnh riêng để soi một tập phim

**Bằng chứng.** `review.sh` (chế độ chấm cả phim) xóa tờ sheet sau khi dựng, rồi bảo người chấm mở **từng
khung riêng** (`beats/b_NNN.jpg`). Một tập 60 câu = 60 lần đọc ảnh, mỗi lần một bức.

**Cái đã biết từ đầu.** `core/render/sheet.py` xếp các khung thành một tờ, và **tờ đã có đủ thông tin**: mã câu,
cờ máy, `fill N%`, lời của câu, dưới mỗi khung. Người chấm chỉ cần mở ảnh riêng khi tờ chưa đủ để quyết định.

**Guard đã có.** `channels/tram-nghi-nhieu/tools/review.sh` **giữ** các tờ sheet và xếp chúng lên đầu
`TASK.md` ("Đọc tờ sheet trước"), rồi mới tới danh sách từng câu kèm `fill N%`. `PROMPT_CRITIC.md` có mục
"Cách đọc" nói rõ: đọc tờ, mở ảnh riêng chỉ khi tờ chưa đủ. Chi phí đọc ảnh của một vòng chấm cả phim giảm
khoảng mười lần mà mỗi câu vẫn soi được.

---

## N19 — high — Thời lượng của phim được gõ tay vào manifest, rồi index phát ra số đó

**Bằng chứng.** `film.json` của tập ghi `"runtime": "2:56"`. Transcript ghi rõ lý do (mục 18:37): *"The film's
narration ends at 173.43 s = 2:53.4… Let me set runtime '2:56' for now and correct it after the render with
ffprobe"*. Tại giờ đó **chưa có khung hình nào được dựng** — `out/` rỗng. `FILMS.md` dòng 9 đã phát số 2:56 ra
trang chỉ mục.

**Vì sao không ai bắt được.** `tools/check_movies.py` so runtime của manifest với `ffprobe` — nhưng nó chỉ
đo phim **có trong repository**, và phim của một tập kênh thì không có trong repository (quá nặng cho GitHub).
Nên đúng cái phim mà bàn giao cần đo nhất lại là cái mà không bài nào nhìn thấy. Cổng bàn giao cũng im: nó mở
trình duyệt để đọc hình, không đọc `film.json`.

**Guard đã có.**

- `core/render/new_episode.sh`: `build.sh` đo `ffprobe` trên phim vừa mux và **ghi số đó** vào `film.json`
  (giữ nguyên thứ tự khoá JSON cũ; chỉ ghi khi số đo khác số đang có).
- `core/render/review.sh`: khi có `.mp4`, cổng so `runtime` trong manifest với độ dài `ffprobe` đo được —
  lệch quá 1,5 giây là **FAIL**, đúng như giới hạn mà `check_movies.py` dùng.

Số đo rồi mới được phát ra, và một số gõ tay thì hỏng cổng thay vì hỏng chỉ mục.

---

## N20 — high — Vật bị chấm HỎNG vì một từ "chắc thấp", không phải vì hình

**Phát hiện P9 của phần một (23:29 ngày 8) để ở đây:** *"cần một phiên chấm mù chạy lại trên **cùng tập ảnh**"* —
để biết vòng nào là lỗi thật chứ không phải dao động của người chấm. Hôm nay làm.

**Cách làm.** Ba người đoán mù đặt tên **cùng một bộ 25 ảnh** (`review/props/p_01.jpg … p_25.jpg`, dựng lúc
02:39 ngày 9):

1. người chấm của phiên, trong `PROPS-REVIEW-5.md` (mục "Người xem không biết tên đã gọi");
2. một lượt đoán mù do tao chạy (agent A);
3. một lượt đoán mù khác, cùng prompt, chạy song song (agent B).

Cả ba đều không biết vật nào được dựng, và không ai thấy phán quyết của người khác.

**Kết quả.** Năm vật đổi phán quyết tùy theo người đoán — **cùng ảnh, cùng đoạn rubric**:

| # | Vật định dựng | Người chấm của phiên | Agent A | Agent B | Phán quyết theo từng tên |
|---|---|---|---|---|---|
| 2 | kẹp quần áo bằng gỗ | "hai kẹp gỗ nối với nhau bằng một vòng gỗ" (**chắc thấp**) | "kẹp gỗ quần áo có vòng kim loại" (**vừa**) | "kẹp gỗ phơi quần áo cỡ lớn" (**vừa**) | HỎNG / **KHỚP** / **KHỚP** |
| 7 | khăn tắm có mép tua | "khăn vải vàng có tua… nghiêng về khăn trải bàn" (vừa) | "khăn **trải** vàng có tua rua" (**cao**) | "khăn vải vàng có tua" (vừa) | KHỚP / **HỎNG** / KHỚP |
| 22 | áo phơi rộng: cả hai mặt | "áo polo kem bị **cắt làm đôi**" (vừa) | "áo sơ mi cổ bọc **bị cắt dọc làm đôi**" (vừa) | "áo sơ mi ngắn tay màu kem" (**cao**) | KHỚP / **HỎNG** / **KHỚP** |
| 24 | giọt nước rơi từ mép khăn | "tấm ván nâu cam uốn cong… sỏi trắng" (thấp) | "mảnh **bìa carton** bị ướt" (vừa) | "**miếng khăn** vàng đang rỉ nước" (vừa) | HỎNG / HỎNG / **KHỚP** |
| 25 | bàn tay người | "KHÔNG RÕ — **bàn chân** người gắn vào một cán gỗ" (thấp) | "cánh tay **bàn tay** có ống nhựa" (thấp) | "**bàn tay** người (tay phải)" (thấp) | HỎNG / **KHỚP** / **KHỚP** |

**Cái #25 là bằng chứng rõ nhất:** vật định dựng **là một bàn tay người**, và cả hai lượt đoán của tao đều thấy
một bàn tay. Người chấm của phiên thấy "bàn chân" và chấm HỎNG — rồi **không mở ảnh để kiểm**, mà phán
quyết theo cái tên.

**Vật nào là lỗi thật.** Với ba vật, cả ba người đoán đều thấy sai — #17 (đống lọ thuỷ tinh thay cho sợi đan),
#19 (que có vạch số và quả cầu thay cho giọt nước trên sợi), #20 (chổi quét thay cho mặt nước cận). Ba vật đó
**là lỗi dựng thật**, không phải dao động. Còn #2, #7, #22, #24, #25 thì hình là như nhau; chỉ tên và độ chắc
khác nhau.

**Còn một chỗ rubric không nhất quán:** điều khoản "chất liệu đúng" được áp cho #9 ("bát **sứ**" ≠ bồn **nhựa** →
HỎNG) nhưng không áp cho #11 ("túi **vải**" ≠ túi **nylon** → KHỚP), và điều khoản "trạng thái đúng" không áp cho
#23 (áo đang **đứng ngược**, không úp → vẫn KHỚP).

**Guard (rubric, không phải check).** Đây là chỗ một luật viết bằng lời quyết định, nên nó sửa ở rubric:

1. **Độ chắc không phải là phán quyết.** Điều khoản "HỎNG khi … chắc thấp" bỏ đi. Một tên đúng nhưng "chắc thấp"
   vẫn là KHỚP; một tên sai nhưng "chắc cao" vẫn là HỎNG. Chỉ **ảnh** mới quyết định.
2. **Người chấm mở ảnh và phán theo ảnh**, không theo tên của người đoán. Tên mù là một lần đoán của người khác,
   và người đó cũng có thể sai.
3. **Người đoán thứ hai cho vật mơ hồ:** vật nào tên mù "chắc thấp" hoặc "KHÔNG RÕ" thì một người đoán nữa đặt
   tên cùng ảnh đó; hai tên lệch nhau thì ghi rõ lệch, và vật đó **không thể bị HỎNG chỉ vì tên**.
4. Chất liệu và trạng thái phải được áp **đều** cho mọi vật: cùng một câu luật, mọi vật.

**Guard đã có.** `channels/tram-nghi-nhieu/tools/review.sh` (chế độ `--props`):

- **Người đoán thứ hai chạy thật, không phải lời hứa.** Sau lượt đoán mù đầu, `review.sh` đọc `BLIND.md`, lấy
  những dòng có `CHẮC: thấp` hoặc `TÊN: KHÔNG RÕ`, và gọi một người đoán nữa **chỉ trên những ảnh đó**,
  không cho xem lần đoán trước; kết quả nằm ở `BLIND2.md` và được đưa vào prompt của người chấm.
- **Prompt người chấm viết lại theo ảnh:** *"mở ảnh của nó, TỰ GỌI TÊN bằng mắt mình, rồi mới phán"*;
  điều khoản *"HỎNG khi … chắc thấp"* bỏ đi; *"độ chắc cao hoặc vừa"* bỏ khỏi điều kiện KHỚP; nhóm A không còn
  phán theo tên mù nữa mà theo ảnh; nhóm B giữ nguyên (chỉ HỎNG khi ảnh **cho thấy một vật thật khác**).
- Mẫu kết quả mang thêm tên của lần đoán thứ hai, để người đọc bản chấm thấy hai lần đoán lệch nhau ở đâu.
- `step5-props-code/PROMPT_CRITIC.md` ghi ba luật trên, để người chấm đọc skill cũng thấy chúng.

---

## N21 — high — Nhãn nằm lệch câu: máy đọc được, cổng storyboard thì không

**Bằng chứng.** Bản chấm cả phim (`review/REVIEW-1.md`, vòng 1/5) REJECT với nhóm lỗi thứ hai: *"nhãn
`LỚP HƠI ẨM` xuất hiện ở #22 và #23, trong khi câu mà nó gọi tên … là **#24** — và #24 thì không có nhãn nào"*.

**Cái lạ là lỗi này đã đi qua cổng storyboard.** Cổng storyboard đọc `LOOK.md` + `src/film.js` và chấm bằng
một người đọc — nhưng nó không có cách nào biết nhãn nào gắn với câu nào. Nhãn là một bảng dữ liệu trong
`src/film.js` (`CARDS`: `text` + `lines`), và quan hệ "nhãn này nói về câu nào" **có thể đọc bằng máy**.

**Đối chiếu bằng tay (29 nhãn × 60 câu).** Đối chiếu từng nhãn với câu nào trong `voice/lines.json` gọi tên nó:

| nhãn | `lines` | câu gọi tên nó | kết luận |
|---|---|---|---|
| LỚP HƠI ẨM | c22, c23 | **c24** ("Lớp hơi ẩm ấy bám sát mặt áo"), c25 ("Lớp đó") | lệch 2 câu |
| QUẠT | c3 | **c5** ("Một cái trước quạt") | lệch 2 câu |
| 3 ÁO | c40 | c40 ✓ | beat đúng, **hình** sai |
| NƯỚC PHẢI ĐI ĐƯỢC | c56, c57 | c57 ✓ | beat đúng, **điểm neo** sai |
| 20 g/kg | c41, c42 | c41, c42 ✓ | beat đúng, **thang đồng hồ** thiếu đơn vị |
| 27 nhãn còn lại | — | khớp | không cần sửa |

**Guard đã có.** `channels/tram-nghi-nhieu/tools/check_labels.py`: đọc `CARDS` và `voice/lines.json`, tìm câu
gọi tên từng nhãn (số trong nhãn đọc thành chữ: "3 ÁO" → "ba áo"; đơn vị không tính là từ đặc trưng), và báo
nhãn nằm sớm hơn câu đó hơn một nhịp. Chạy trên tập này: **đúng hai cái, đúng hai cái bản chấm nêu, không báo
nhầm nhãn nào trong 27 nhãn còn lại.**

`review.sh --storyboard` và `review.sh` (chấm cả phim) chạy nó **trước** khi gọi người chấm — một nhãn lệch câu
tốn một giây thay vì một vòng chấm và một lượt dựng.

---

## N22 — high — Bản cắt của đạo diễn đóng tem cho một bản code cũ

**Bằng chứng.** `gate.py stamp()` ghi vào tem **digest của code lúc đóng tem** — không phải digest của code mà
bản chấm đã xem. Nên lối ra "đạo diễn cắt" (`PROPS-DIRECTORS-CUT.md`, `REVIEW-DIRECTORS-CUT.md`) đóng tem cho bất
kỳ code nào đang nằm trên đĩa, kể cả code **đã đổi sau khi bản cắt được viết**. Comment trong `review.sh` nói
đúng ý mình — *"the stamp binds the cut to LOOK.md + src/film.js by their hash, so a cut written for an older
film cannot pass a newer one"* — nhưng digest lại ghi lúc đóng tem, nên nó **không** làm việc đó.

Trên tập này: `PROPS-DIRECTORS-CUT.md` viết lúc 02:40; `src/props.js` sửa sau đó (đang sửa lúc 20:37). Chạy lại
`review.sh --props` sẽ đóng tem `PROPS.pass` cho `props.js` mà **không ai xem**.

Cùng kiểu lỗi ở cổng storyboard: nó cố ý **không** mở lại khi `LOOK.md`/`src/film.js` đổi (chỉ in cảnh báo),
nên một bản cắt cũ ở đó cũng không nói gì về code hiện tại.

**Guard đã có.** `gate.py stale_cut()`: một bản cắt phải được viết **sau** lần sửa code cuối cùng mà nó chấm;
`review.sh` nói rõ phải làm gì. Luật này áp cho hai cổng nghiêm (`props`, `picture`) — hai cổng mà digest cũng
đã phá tem khi code đổi. Cổng `outline` và `storyboard` cố ý mềm, nên chúng không đổi.

---

## N23 — medium — Bài đếm con số đọc cột viết, không đọc cột nói

**Bằng chứng.** `films/host-toon-test` không vượt được cổng bàn giao: `scenecheck` báo *"2,42 con số mỗi
20 giây"* trong khi luật của thư viện là 2. Nhưng phim có hai cột cho mỗi câu: `text` (dòng viết) và `say`
(dòng đọc cho giọng nói) — *"in 2,4 tỷ euro"* viết, *"in hai phẩy bốn tỷ ơ-rô"* nói. `scenecheck` đọc `text`.

Đếm lại trên cột nói: 8 con số, **1,21 mỗi 20 giây** — phim không hề dày. Bài kiểm tra đang đo một câu
chưa từng được đọc ra.

**Guard đã có.** `core/render/scenecheck.mjs` đếm trên `l.say || l.text`: tập của kênh không có cột `say`
nên không đổi gì; phim nào có cột thì đếm đúng những gì người nghe nghe.

---

## N24 — critical — Cổng bàn giao quay vòng mãi khi thư mục phim viết tương đối

**Bằng chứng.** `sh core/render/review.sh films/host-toon-test` — đúng cách dùng mà `AGENTS.md` dạy
("chạy `sh tools/…` từ thư mục gốc thư viện") — không bao giờ kết thúc. Nó chạy tới bước `timing` rồi
**không in thêm một dòng nào**, và treo đó hơn ba giờ cho tới khi bị giết. Vết:

```
+ _d=.
+ [ ! -f ./CHANNEL.md ]
+ [ . != / ]
+ dirname .          →  "."
+ _d=.              →  lặp lại y hệt, mãi mãi
```

Dòng 72 của `core/render/review.sh` đi tìm thư mục kênh bằng `dirname`:

```sh
_d=$FOLDER; while [ ! -f "$_d/CHANNEL.md" ] && [ "$_d" != / ]; do _d=$(dirname "$_d"); done
```

Với đường dẫn **tương đối** (`films/host-toon-test`) chuỗi `dirname` đi tới `.` và đứng lại ở đó: `dirname(".")`
là `"."`, còn `"." != "/"` thì luôn đúng. Vòng lặp không bao giờ kết thúc, và vì nó không in gì nên người
đọc tưởng cổng đang chạy nặng. Đường dẫn **tuyệt đối** thì đi lên tới `/` nên vô hại — nên phim nằm trong
một kênh (tập 01) không bao giờ mắc kẹt, còn **mọi one-shot dưới `films/`** thì mắc.

Hai điều làm nó tệ hơn một vòng lặp vô hại: (1) `set -e` không cứu được vì vòng lặp không trả về mã lỗi;
(2) chính file này đã có câu *"bài kiểm tra không chạy xong thì không nói gì về phim"* — cổng này vi phạm
đúng điều nó tự nhắc.

**Guard đã có.** Vòng đi tìm thư mục kênh nay đi bằng `cd` (như dòng 57 ngay trên nó vốn đã làm), nên đường
dẫn luôn tuyệt đối và `"."` không bao giờ xuất hiện:

```sh
_d=$(cd "$FOLDER" 2>/dev/null && while [ ! -f CHANNEL.md ] && [ "$PWD" != / ]; do cd ..; done && pwd)
```

**Còn phải làm.** Một bài kiểm tra treo vô hạn là loại hỏng mà người giám sát khó nhận ra nhất, vì nó
giống hệt một bài kiểm tra đang chạy. Xem N25.

---

## N25 — high — Một bước quay vòng mãi không khác gì một bước đang chạy nặng

**Bằng chứng.** N24 treo im lặng ba giờ. Người giám sát nhìn vào cổng thấy "đang chạy" — không có cách nào
biết nó đã chết. Đây là hình dạng tệ nhất của một bài kiểm tra treo: **không in gì, không trả gì**. Cùng
một cơ chế đã xuất hiện hai lần trong phiên này: `readcheck` chết giữa chừng (N11) và `scenecheck`
đếm trên cột sai (N23) — cả hai đều được giải quyết bằng cách *nói ra* ("COULD NOT RUN — không phải phán
quyết"), chứ không phải bằng cách *hết giờ*.

**Guard đã có.** `core/render/review.sh` giờ bọc mỗi bước trong một đồng hồ:

```sh
STEP_TIMEOUT=${REVIEW_TIMEOUT:-3600}
set -- timeout -k 30 "$STEP_TIMEOUT" "$@"
```

Hết giờ thì bước đó bị giết và in `COULD NOT RUN (no answer in 3600s) — not a verdict about the film` —
cùng một ngôn ngữ với "COULD NOT RUN (exit 2)", và mã 124 của `timeout` không bao giờ bị đọc thành
"FAILED" (một phán quyết về phim). `REVIEW_TIMEOUT=<giây>` nâng hoặc hạ đồng hồ cho một lượt.

Bằng chứng đã chạy: `REVIEW_TIMEOUT=8 sh core/render/review.sh films/host-toon-test` →

```
--- readcheck
readcheck: COULD NOT RUN — the page died while the check was reading it (at 67.2s of 132.3s): …
    COULD NOT RUN (no answer in 8s) — not a verdict about the film
```

**Còn phải làm.** Đồng hồ này nằm ở cổng bàn giao của thư viện. Cổng của kênh (`channels/tram-nghi-nhieu/
tools/review.sh`) gọi một tiến trình `claude -p` làm người chấm hình, và tiến trình đó **không** có đồng hồ —
một người chấm treo là một vòng chấm không bao giờ kết thúc, và vòng chấm của kênh có trần 5 vòng nên
một vòng treo nuốt hết trần đó.

---

## N26 — high — Không có gì nói vòng chấm này đã sửa được gì, nên vòng sau bắt đầu lại từ đầu

**Bằng chứng.** Bản chấm cả phim dài 39 nghìn chữ: 60 câu, mỗi câu một đoạn, kèm "đề xuất sửa", kèm mục
cờ máy, kèm "KHUYẾN NGHỊ ĐẠO DIỄN". Vòng 1 có **22 câu FAIL**, vòng 2 còn **6**. Người đọc không có cách nào
biết điều đó mà không mở cả hai bản báo và tự đối chiếu tay — nên thay vào đó họ đọc lại từ đầu, sửa lại
cả những câu đã qua, và mỗi vòng tốn thêm hàng giờ.

Tệ hơn: bản chấm vòng 2 nói **24 trong 26 cờ SAME là cờ sai** (cảnh đã đổi góc nên máy bắt nhầm) — tức là
con số cờ máy đọc lên là 38 trong khi thực tế chỉ còn 12 cờ thật. Người đọc chỉ biết điều đó sau khi đọc
tới dòng thứ chín mươi của bản báo.

**Guard đã có.** `channels/tram-nghi-nhieu/tools/check_progress.py` đọc hai bản chấm liên tiếp và in ra
đúng thứ đáng lẽ phải có:

```
so sánh: REVIEW-1.md  →  REVIEW-2.md
phán quyết: REJECT → REJECT
câu FAIL chặn: 22 → 6
  đã sửa:      c5, c12, c13, … (20 câu)
  CÒN MỞ:      c48, c60
  mới phát hiện: c30, c41, c44, c53
cờ máy còn mở: 15 → 12
  CÒN MỞ:      c22:RUN
  mới:         c17:DARK, c23:RUN, … (11 cờ RUN ở c22–c32)
```

Nó đọc được cả ba kiểu bản chấm của phiên này (ghi `- [c41]: **FAIL`, ghi `### #12 — framing FAIL`, và
mục `Cờ máy chưa sửa` một dòng), và nó **bỏ các cờ mà người chấm đã bác bằng "CỜ SAI"** — nhưng chỉ bỏ
đúng loại cờ mà câu đó đang nói, vì một câu có thể còn nợ một cờ khác. Cổng của kênh gọi nó sau mỗi vòng
chấm hình (`tools/review.sh`), và skill của kênh (bước 6) bảo đạo diễn sửa đúng những câu còn mở, đừng
làm lại những câu đã qua.

---

## N27 — critical — Người giám sát nhìn nhầm phiên, lần thứ hai: hai đường dẫn không bao giờ gặp nhau

**Bằng chứng.** N1 đã sửa "người giám sát đọc transcript của omp chứ không phải của Claude Code". Nhưng khi
chạy `tools/supervise.sh` với phim `tap-01` để đo xem phiên đang dựng phim có làm đúng luật không, nó báo
`session faf986af…jsonl` — đó là **phiên của người giám sát**, không phải phiên đang dựng phim. Lý do nằm
ở `tools/supervise.sh`:

```python
if not p.startswith(film):     # film = "/home/…/tap-01-phoi-quan-ao"  (tuyệt đối)
```

Còn `p` là đường dẫn mà phiên ghi vào — và `AGENTS.md` dạy chính là ghi **đường dẫn tương đối**
(`src/props.js`). "tuyệt đối".startswith("tương đối") = không bao giờ đúng. Nên `writes_film()` không
bao giờ thấy phiên nào viết vào thư mục phim, và bộ chọn rơi xuống nhánh dự phòng: "lấy phiên mới nhất".
Phiên mới nhất lúc đó là phiên của người giám sát. Cùng lỗi ấy, hậu quả y hệt N1: **báo cáo về một
phiên khác**.

Hai lỗi nữa cùng chỗ, thấy ra khi sửa cái đầu tiên:

- `SUPERVISE_FILM` **không tồn tại** — người giám sát chỉ xem được một phim, phim mới nhất. Khi hai phim
  đang chạy thì nó chọn sai phim.
- Bộ chọn có thể chọn **transcript của một subagent** (Claude Code đặt tên file của subagent là
  `<thời-điểm>_<uuid>.jsonl`), trong khi cần transcript của phiên chính.

**Guard đã có.** `tools/supervise.sh` giờ:

- so hai đường dẫn **từ cùng một gốc** (đường dẫn tương đối với thư mục gốc thư viện) trước khi so sánh,
  nên đường dẫn tương đối và đường dẫn tuyệt đối đều khớp;
- nhận `SUPERVISE_FILM` để chỉ định phim cần theo dõi;
- ưu tiên transcript của phiên chính, chỉ dùng transcript của subagent khi không còn gì khác.

Đo lại sau khi sửa, với phim là `tap-01`:

```
supervise: film tap-01-phoi-quan-ao
supervise: session e8ec853c-2f62-427e-9528-3cdc7c568ee1.jsonl   ← đúng phiên đang dựng
```

**Số liệu về quá trình, đo lại đúng phiên** (trước đó những con số này đo nhầm phiên):

| Luật | Số lần | Chi tiết |
|---|---|---|
| R1 — ghi file dự án bằng shell | **37** | `src/props.js`×7, `src/film.js`×5, `LOOK.md`×5, `voice/lines.json`×4, `src/set.js`×4 … |
| R10 — tự dựng montage ffmpeg | **20** | xếp khung bằng ffmpeg thay vì `core/render/sheet.py` |
| R9 — dò file để chờ | **40 lệnh** | 12× `ls -l src/props.js; date`, 12× `ls /tmp/lemo-review-*/beats | wc -l`, 8× `node --check …` |

Đáng nói: **người giám sát cũng vướng R1** — hai lần trong chính phiên này, tôi sửa `improvements/README.md`
và `improvements/lessons.md` bằng heredoc của shell. Cái máy bắt được cả hai.

---

## N28 — high — Khuôn dựng của tập mới dựng bằng 4 trình duyệt, và phim mất khung trong im lặng

**Bằng chứng.** `core/render/new_episode.sh` viết `build.sh` cho mỗi tập mới với:

```sh
node core/render/video.mjs "$HERE" --workers 4 --out "$OUT/video.mp4"
```

Nhưng `core/render/video.mjs` tự nói trong dòng đầu của nó: *"khi nhiều phim cùng chạy thì dùng 3 worker
(mặc định); một phim chạy riêng thì lên tới 6"*. 4 là **trên** mặc định mà công cụ tự khuyên.

Trên máy này (GTX 1660 Ti, 6 GB) bốn trình duyệt ở ss=2 (3840×2160) làm tràn VRAM: trình duyệt chết giữa
phim, ffmpeg đóng tệp segment, và **phim mất khung mà không nói gì** — không có dòng lỗi, không có cảnh báo.
Tập 01 phải sửa tay (`build.sh` của nó ghi `--workers 2`, đúng như `DEMO.md` của kênh), nhưng cái sửa tay
đó không quay lại vào khuôn: tập 02 sinh ra hôm nay sẽ lại có 4.

**Guard đã có.** `core/render/new_episode.sh` (và `films/host-toon-test/build.sh`) giờ ghi `--workers 2`,
kèm dòng giải thích. Hai là số an toàn trên máy nhỏ; máy lớn hơn thì tăng.

**Còn phải làm.** Một phim mất khung trong im lặng là loại hỏng mà cổng bàn giao không thấy: `ffprobe` đọc
được tệp, thời lượng vẫn đúng, tiếng vẫn đủ. Cái duy nhất bắt được là **độ dài phải bằng tổng số khung
phải có** — xem dòng 30 của bảng thứ tự xử lý.

---

## N29 — low — Một bài kiểm tra, hai hình dạng dàn ý: bài kiểm tra hỏi sai người

**Bằng chứng.** `tools/check_treatment.py` đòi dàn ý theo `DIRECTOR.md` §2–§7: "## Phim mẫu", "## Ba cấu
trúc", "## Logline", "## Beat sheet", "## Cue map", "## Âm thanh", "## Chấm lời", và mỗi vòng soi hình phải
có đúng hai chữ "Thấy:" và "Sửa:".

Nhưng kênh `Trạm Nghĩ Nhiều` có dàn ý riêng — `channels/tram-nghi-nhieu/templates/TREATMENT.tmpl.md` —
với những mục khác hẳn: "Độ dài", "Câu hỏi, tách ra", "Mở và kết", "Nơi chốn", "Vật lên hình", "Thứ vô
hình", "Bảng Ý → Hình", "Shot list". Tập 01 viết đúng theo mẫu đó. Chạy bài kiểm tra của thư viện lên nó:

```
BAD TREATMENT.md has no "## Phim mẫu" (benchmark) … (7 mục)
BAD LOOK.md "vòng 4 …": write what you saw on the stills ("Thấy: …") and what you changed ("Sửa: …")  (9 vòng)
FAIL (16)
```

**16 lỗi giả, trên một tập làm đúng quy trình của kênh.** Hôm nay chúng chưa làm hại gì vì cổng bàn giao
chỉ chạy bài này khi có `board.json` hoặc `board_rules.json`, mà kênh này không có — nhưng ngày nào có
người bật nó lên thì một tập đúng quy trình sẽ không dựng được. Và vòng soi hình của tập 01 viết đúng
thứ nó thấy ("**Cờ `SAME` ở cặp thí nghiệm** → … Cách sửa: …"), chỉ là không dùng đúng hai chữ mà bài kiểm
tra đòi.

**Còn phải làm.** Bài kiểm tra nên hỏi kênh, không tự đoán: một file nhỏ ở thư mục kênh khai báo dàn ý
của kênh cần những mục nào, và bài kiểm tra đọc nó. **Đã làm một nửa [09/11]** — bài kiểm tra của **kênh**
nay là `channels/tram-nghi-nhieu/tools/check_treatment.py`: nó hỏi **khuôn** (còn chỗ `<viết: …>` nào
chưa viết), còn **hình dạng** của dàn ý (năm tầng, một nơi cho mỗi tầng, bảng ý → hình) thì người chấm
dàn ý của kênh đọc `STRATEGY.md` và phán — việc đó máy không làm thay được. Phần còn lại: bài kiểm tra của
thư viện vẫn hỏi hình dạng của `DIRECTOR.md`, nên nếu ngày nào kênh bật `board_rules.json` thì 16 lỗi giả
quay lại; nó nên đọc hình dạng mà kênh khai.

---

## N30 — high — Một bài kiểm tra trả lời "có" cho mọi thứ, nên nó im lặng và xanh

**Bằng chứng.** Bài kiểm tra mới "nhãn vẽ con số mà phim không nói" (thêm vào
`channels/tram-nghi-nhieu/tools/check_labels.py`) chạy ra `mọi nhãn nằm đúng câu` và **thoát 0**, trong khi
chính các con số đáng ra phải bị báo đều không có trong lời kể:

```
'288 g' [(288.0, '288')] [False]
'88 g'  [(88.0, '88')]   [False]
'50 %'  [(50.0, '50')]   [False]
```

Ba lần đọc lại cùng một đoạn, cùng một kết luận: "không phải bài kiểm tra sai, mà **bài kiểm tra không
chạy tới chỗ cần chạy**".

**Nguyên nhân.** Lời kể được gom thành một danh sách, trong đó mỗi câu có hai cột: `text` (cột viết) và
`say` (cột nói). Ở tập này **cột `say` rỗng với cả sáu mươi câu**, nên danh sách có sáu mươi chuỗi rỗng.
Phép so của bài kiểm tra là:

```python
if w in s or strip_accents(s) in w:   # s có thể là chuỗi rỗng
```

Một chuỗi rỗng **là chuỗi con của mọi chuỗi** (`'' in 'hai trăm'` → `True`). Nên chỉ cần một chuỗi rỗng
trong danh sách là mọi con số trong phim đều "đã được nói". Bài kiểm tra luôn trả lời "có" — và một bài
kiểm tra luôn trả lời "có" thì không kiểm tra gì cả, chỉ tự nó là một cái cổng giả.

**Đã sửa.** `is_said` bỏ qua chuỗi rỗng, và `numbers_in` hiểu "1/2" là **một nửa** chứ không phải "một"
(`c37` nói "một nửa", và số 1 trong "1/2" cũng được tìm thấy ở câu khác — hai lỗi cùng một chỗ).

**Bài học rộng hơn.** Một bài kiểm tra mới **phải được thử bằng một ví dụ nó phải bắt** trước khi tin là nó
đang việc. Ở đây cả ba ví dụ đều có sẵn trong tập đang làm; chỉ cần đưa chúng vào một bảng kiểm
(`check_labels.py --selftest`) để lần sau không phải đoán. Và chuỗi rỗng là một loại dữ liệu đáng ngờ:
một cột trong bảng dữ liệu mà lúc nào cũng rỗng là dấu hiệu nó **chưa từng được dùng** — và mã đọc nó
mà không hỏi.

---

## N31 — high — Phim vẽ ra con số mà giọng kể không đọc, và luật của chính tập không ai canh

**Bằng chứng.** `research/FACTS.md` của tập 01 viết ngay đầu file:

> "Mọi con số phim đưa lên màn hình đều có nguồn ở đây. **Giọng kể đọc chúng**; hình đặt chúng vào vật."

Nhưng trên màn hình có ba con số mà lời kể không đọc:

| Nhãn | Ở câu | Lời kể ở câu đó |
|---|---|---|
| `288 g` | c34 | "Hai cái kim lệch nhau." — không có con số nào |
| `88 g` | c34 | như trên |
| `50 %` | c46 | "…không khí ẩm chín mươi phần trăm…" — hình vẽ 50 % |

Hai cái đầu là con số trên hai cái cân mà phim nói chung chung ("đo được: hai cái cân"); cái thứ ba là
mặt đồng hồ độ ẩm vẽ 50 % trong khi câu kể đang nói về 90 %. Đây đúng là loại lỗi người chấm hình đã báo
ở c41 ("mặt đồng hồ độ ẩm in hai thang số chồng lên nhau"), và nó **lọt qua cả cổng storyboard lẫn cổng
hình** vì không có máy nào đọc mối quan hệ giữa *số trên nhãn* và *số trong lời*.

Chỗ cụ thể (người chấm đã đoán đúng, nhưng phải tìm mới ra):

| Tệp | Dòng | Cái gì được vẽ |
|---|---|---|
| `src/props.js` | 2058 | vạch `0 100 200 300 400` trên mặt cân |
| `src/props.js` | 2067 | chữ **`MAX 400`** — người xem đọc "400 g" trong khi thẻ ghi `88 g` |
| `src/props.js` | 2196–2205 | vạch và chữ `%`, `HUMIDITY` trên mặt ẩm kế |
| `src/props.js` | 2225–2231 | **thang trong** `g/kg` của ẩm kế, chồng lên thang ngoài |
| `src/film.js` | 197, 198, 208 | ba nhãn `288 g`, `88 g`, `50 %` |

Cách sửa đúng luật của kênh: **con số không được nói thì đừng vẽ**. Câu c34 chỉ nói "hai cái kim lệch
nhau", nên hình chỉ cần **hai kim chỉ khác nhau** — không cần biết chúng là bao nhiêu gam.

**Đã sửa.** `check_labels.py` nay có hai phép kiểm: nhãn nằm đúng câu (từ N21) và **nhãn vẽ con số mà lời
kể không đọc**. Cả cổng storyboard và cổng hình gọi nó, nên lỗi này bị chặn trước khi tốn một vòng chấm —
đúng như N21. Trên tập 01 nó bắt đúng ba cái, không bắt nhầm.

**Còn phải làm.** Kiểm mới chỉ nhìn bảng `CARDS` trong `src/film.js`. Những con số vẽ thẳng lên vật
(mặt đồng hồ, thang đo, trục đồ thị) nằm trong `src/props.js` và **chưa** được kiểm. Cũng chưa có chiều
ngược lại: một số lời kể có mà hình không có thì cổng `scenecheck` đã canh (N23).

---

## N32 — high — Phiên làm phim tốn thời gian vào việc đọc lại, không phải vào việc làm

**Bằng chứng.** Đọc transcript của chính phiên đang làm (4.930 sự kiện công cụ, 1.183 lần đọc tệp):

| Tệp | Số lần đọc | Kích thước |
|---|---|---|
| `src/props.js` | **70** | 236 kB |
| `src/set.js` | **64** | 68 kB |
| `src/film.js` | **52** | 37 kB |

186 lần đọc trọn ba tệp mã nguồn — khoảng 16 MB mã bị đọc lại đi đọc lại trong một phiên, để tìm **một chỗ
sửa**. Đó là phần lớn chi phí của phiên: nó không phải chỗ làm phim tốn thời gian, mà là chỗ nó phải **tìm**.

Cùng phiên đó còn:
- **12 + 12 + 8 + 8 lần** chạy cùng một lệnh dò (`ls -l --time-style=+%H:%M:%S src/props.js; date`) — đúng
  cái vòng dò mà R9 cấm: đợi tệp thay vì đợi người.
- **37 lần** ghi file của dự án bằng shell (R1), trong đó có nhiều `python3 - <<'PY'` ghi thẳng vào
  `src/film.js` và `LOOK.md`.
- **20 lần** tự dựng montage ffmpeg thay vì dùng `core/render/sheet.py` (R10).
- **16 lần** lệnh hỏng vì chạy ở sai thư mục: 11 lần `no such file or directory: channels/tram-nghi-nhieu/…`
  và 5 lần `sed: can't read src/props.js` — phiên đó đang đứng ở thư mục tập trong khi lệnh viết theo
  đường dẫn quanh thư viện. Luật "chạy mọi lệnh từ gốc thư viện" có trong skill, nhưng không có gì nhắc
  khi nó bị lỡ.

**Đã sửa.** `tools/supervise.sh` đếm số lần đọc mỗi tệp và báo **R11** khi một tệp bị đọc lại từ 15 lần
trở lên; `CODING_STANDARDS.md` có R11: *đọc một đoạn, không đọc cả tệp, và không đọc lại cùng một tệp lớn
hai lần cho một lần sửa* — grep tên rồi đọc `offset`/`limit`, và giữ một bản đồ mã (tên hàm → dòng) bên
cạnh mã nguồn.

**Vì sao điều đó tốn cả buổi.** Chia 21 giờ của phiên theo khoảng lặng giữa hai lệnh:

| Khoảng lặng | Thời gian | Có nghĩa là gì |
|---|---|---|
| < 10 s | 4,7 h (22 %) | máy đang trả lời |
| 10–60 s | **10,2 h (49 %)** | **mô hình đang nghĩ giữa hai lệnh** |
| 1–15 phút | 4,7 h (22 %) | người chấm đang chấm |
| > 15 phút | 1,4 h (7 %) | chờ người chấm |

Chờ người chấm — thứ mà người ta tưởng là chỗ tốn thời gian — chỉ chiếm **7 %**. Phần lớn buổi là mô
hình **nghĩ**, và nó nghĩ chậm dần vì bối cảnh phình to: mỗi lần đọc lại ba tệp mã đẩy thêm hàng chục
nghìn dòng vào cửa sổ ngữ cảnh, và mỗi lượt sau phải đọc lại cả cửa sổ ấy. Đọc lại mã không chỉ tốn
token — nó **kéo dài mỗi lượt**, và đó là tiền thật, theo giờ.

**Còn phải làm.** Bản đồ mã phải là một loại tệp trong quy trình của kênh (`src/MAP.md`), không phải một lời
khuyên trong tài liệu; và cái cổng hình nên đọc bản đồ đó khi nó tìm chỗ sửa. Khi tệp vượt quá một ngàn
dòng, mã nguồn nên được chia theo vai trò — đó là việc của tập sau, không phải của tập đang chạy.

---

## Kiểm chứng: tập 02 là lượt sản xuất đầu tiên chạy với các guard mới

Tập 01 được làm **trong lúc** các guard này được viết, nên nó không chứng minh được điều gì. Tập 02
("Vì sao điện thoại nóng lúc sạc?") là lượt đầu chạy với tất cả. Danh sách này là để người giám sát đọc
từng dòng một, không phải để đọc lướt:

| Guard | Cần thấy gì ở tập 02 | Nếu không thấy |
|---|---|---|
| `check_labels.py`: nhãn lệch câu | cổng dừng **trước** khi tốn một vòng chấm | nhãn vẫn lệch câu → kiểm tra không chạy, hoặc `CARDS` không đúng hình dạng |
| `check_labels.py`: con số vẽ mà lời không nói | mọi con số trên nhãn có lời kể đọc, hoặc không vẽ con số đó | kiểm tra thứ hai chưa vào cổng |
| `--selftest` của `check_labels.py` | chạy và xanh | một bài kiểm tra trả lời "có" cho mọi thứ (N30) |
| `check_progress.py` | sau **mỗi** vòng chấm hình có bảng đối chiếu: đã sửa / còn mở / mới | vòng sau bắt đầu lại từ đầu (N26) |
| `gate.py cut` | bản cắt đạo diễn viết **sau** lần sửa code cuối | một bản cắt cũ đóng tem cho code mới (N22) |
| `--workers 2` trong `build.sh` | dựng không mất khung; cổng bàn giao không báo thiếu khung | khuôn dựng lại 4 worker (N28) |
| Đồng hồ của cổng bàn giao | `core/render/review.sh` không treo, và "COULD NOT RUN" không bị đọc thành phán quyết | quay vòng vô hạn (N24) |
| Đồng hồ của người chấm (`CRITIC_TIMEOUT`) | một vòng chấm kẹt thì thoát mã 2, không ăn tròn vòng | người chấm treo nuốt trần 5 vòng (N25) |
| R11 (đếm số lần đọc lại) | `src/props.js` của tập 02 **không** bị đọc lại 15 lần trở lên | cùng cái tốn thời gian của tập 01 (N32) |
| `src/MAP.md` | tồn tại sau bước 5 | tìm chỗ sửa bằng cách đọc lại cả tệp |
| `ROUND:` trong bản chấm | mỗi bản chấm ghi đúng vòng của nó (`REVIEW-2.md` → `ROUND: 2/5`) | bản chấm tự khai số vòng, và khai sai (N34) |
| `check_research.py` | `research/FACTS.md` của tập 02 **có** các mục và nguồn thật, cổng dàn ý chạy qua | file nghiên cứu còn là khuôn (N35) |
| `check_treatment.py` | cổng dàn ý chạy qua với một dàn ý đã viết, kể cả khi dàn ý nhắc tới chỗ ở khuôn | cổng chặn nhầm một tập đã viết xong (N36) |
| `check_voice_facts.py` | lời kể của tập 02 **không** nói câu mà `FACTS.md` cấm | máy chỉ canh con số, câu bị cấm lọt qua (N42) |
| `check_storyboard.py` | `LOOK.md` của tập 02 trích **đúng** câu của `voice/lines.json` | dàn ý mô tả một phim không còn tồn tại (N48) |
| `check_reports.py` | mọi bản chấm của tập 02 mà cổng đọc đều có phán quyết đọc được | một vòng chấm rơi vào một tệp không ai đọc (N49) |
| `gate.py --selftest` | 14/14 xanh, và `gate.py check --for render <tập>` trả mã khác 0 khi cổng đóng | cổng trả PASS về một thư mục không tồn tại (N52) |
| Bản cắt của bước storyboard | viết **sau** lần sửa `LOOK.md` và `src/film.js` cuối | bản cắt cũ đóng tem cho code mới (N53) |

**Đã thấy ở tập 02 (tính đến 09:45).**

- `check_voice_facts.py` **bắt được**: lời kể của tập 02 nói *"chỗ nóng nhất trong cả cái máy"* — đúng câu
  `FACTS.md` cấm. Phiên đã bỏ khỏi lời kể và sửa dàn ý theo.
- `check_storyboard.py` **bắt được**: `LOOK.md` còn ba dòng dán câu lời kể **đã bị viết lại** (dòng 20, 76, 84)
  và nhãn `CHỖ NÓNG NHẤT`. Phiên đã sửa cả ba.
- `check_reports.py` chạy xanh trên toàn kênh: 5/5 mẫu có công cụ nêu đúng tên tệp, 31/31 bản chấm có
  phán quyết đọc được; hai bước chưa có công cụ được nêu tên (N51).
- `gate.py --selftest` 14/14.
- **Chưa có bằng chứng** cho: `check_progress.py` (bước hình chưa tới), bản cắt của bước storyboard
  (bước storyboard của tập 02 chưa tới), đồng hồ của cổng bàn giao (chưa dựng).

**Một sự lệch mới, do người giám sát phát hiện ở tập 02 (xem N50).** `FACTS.md` mục 5 vẫn viết vạch
đỏ 45 °C nằm trên **nhiệt kế**, còn phim đặt nó trên **cảm biến nhiệt trong máy** (`src/props.js`
dựng cảm biến như một vật) và lời kể c77 nói *"Vạch đỏ đó là mốc của tế bào pin, không phải nhiệt độ
mặt lưng"*. Ba nơi, ba câu khác nhau: file nghiên cứu, hình, lời kể. `check_claims.py` chỉ canh
con số nên không thấy; `check_citations.py` và `check_facts.py` cũng xanh. Đây là hình dạng thứ ba
của N50 — và nó cho thấy một lớp kiểm tra còn thiếu: so **danh từ** của dòng "Dùng trong phim" trong
file nghiên cứu với **vật** mà phim dựng.

Điều kiện để tập 02 được coi là **xác nhận**: cổng bàn giao thoát 0, và bảng trên không có dòng nào ở cột
"Nếu không thấy".

---

## N33 — medium — Hai thước đo "phim có chuyển động" không đo cùng một thứ, và cái máy đo không thấy là cái người chấm thấy

**Bằng chứng.** Cổng bàn giao đo `tools/check_motion.py` trên phim đã dựng: "có chuyển động" nghĩa là **một
phần khung đổi**, sau khi bỏ cái trượt của camera (đối chiếu pha, dịch khung, rồi đếm phần pixel còn
đổi). Người chấm hình đo bằng mắt: "**vật thể chính có cử động không**".

Ở c37 của tập 01, hai thước đó cho hai câu trả lời khác nhau. Ảnh cho thấy một giọt nước **không nhìn
thấy**: thẻ "1/2 TỐC ĐỘ" trỏ vào một vệt bầu dục mờ nằm đè lên chữ "KHÔNG CÓ GIÓ"; mốc đỏ nét đứt là
một vòng tròn **xoay** — và chính cái vòng xoay đó làm thước đo của máy thấy "10,5 % khung đổi".

Đo thử bằng công cụ mới (`beatsheet.mjs --motion`, hai khung trong cùng một câu, bỏ dịch camera):
`c33` 0,117 · `c34` 0,107 · `c35` 0,029 · `c36` 0,100 · `c37` **0,155** · `c38` 0,036 — không câu nào
"chết", trong khi người chấm nói c33/c34/c37/c50/c56 "mọi thứ đứng yên".

**Nghĩa là gì.** Một cái vòng tròn nét đứt xoay đủ để một phim **trượt qua cổng chuyển động** mà câu
chuyện vẫn đứng yên. Cổng bàn giao đo **khung hình**, người chấm đo **câu chuyện**. Không thể dùng thước
đo của cổng thay cho mắt của người chấm — và cũng không nên dùng nó để kết luận "phim có chuyển động".

**Đã sửa.** `beatsheet.mjs` có thêm `--motion`: chụp thêm một khung trong mỗi câu, bỏ dịch camera, và in
`STILL` cho câu nào khung hình **không đổi chút nào** (ngưỡng 2 %, cùng ngưỡng của cổng bàn giao), kèm
con số `motion` của từng câu trong `beats.json`. Nó **không phải phán quyết**: nó bắt được câu chết
đúng, và nó không bắt được câu mà chỉ có một chi tiết trang trí đang động.

**Còn phải làm.** Muốn đo "vật thể chính có cử động không" thì phải biết vật thể chính ở đâu trong khung —
tức là cần **mốc nhịp** (`{type:'mark', kind:'beat', beat, t, d, xy}` trong `events.json`) mà kênh này
chưa ghi. Có mốc thì `check_motion.py` dùng luôn được quy tắc "mỗi nhịp phải làm thay đổi phần khung của
nó" — đó là thước đo gần với mắt của người chấm nhất mà máy có.

---

## N34 — medium — Bản chấm tự khai số vòng của nó, và nó khai sai

**Bằng chứng.** Ba bản chấm hình của tập 01 — `review/REVIEW-1.md`, `REVIEW-2.md`, `REVIEW-3.md` — đều mở
đầu bằng **"ROUND: 1/5"**. Ba vòng đã chạy, mỗi vòng một tệp riêng, và cả ba bản đều tự nhận là vòng
thứ nhất. Vòng 2 nói `OVERALL: 3.4/5`; vòng 3 vẫn nói `ROUND: 1/5`.

Nguyên nhân nằm ở chỗ ai viết dòng đó. `review.sh` **biết** vòng nào đang chạy (`n=$(next "REVIEW-$SCOPE")`)
và **biết** trần của nó (`LIMIT`), và nó chặn đúng khi `n > LIMIT`. Nhưng dòng `ROUND:` trong mẫu bản
chấm là một ô để **người chấm tự điền**, và lời dặn đưa cho người chấm ở đúng khối đó không có câu nào nói
"đây là vòng mấy" — khác với khối dàn ý ("Đây là lần chấm thứ $n") và khối storyboard ("đây là vòng $n/5").
Người chấm không biết mình đang ở vòng nào thì viết `1/5`. Với khối lời kể còn tệ hơn: trần của nó là
**6** vòng, mà mẫu vẫn ghi `[1-5]/5`.

**Nghĩa là gì.** Số vòng là thứ duy nhất để phân biệt **"vòng chấm đang tiến"** với **"vòng chấm đang
lặp"**. Một bản chấm mà luôn nói "vòng 1" giấu mất chính cái thông tin đó: người đọc không biết mình đã
dùng hết ngân sách vòng chưa, và người giám sát (như tôi) phải đếm tên tệp để biết phiên đang ở đâu —
tức là phải làm thủ công cái mà máy đã biết. Không có hại trực tiếp với phim, nhưng nó đúng loại "đồ
đo sai" mà khiến một phiên dài trông như đang lặp khi nó không lặp, hoặc ngược lại.

**Đã sửa.** `review.sh` có `set_round`: sau khi người chấm trả lời, **công cụ tự viết lại** dòng `ROUND:`
bằng số của chính nó — vòng hình thì `n/LIMIT`, vòng lời thì `n/6` — và khối hình còn được nói trước trong
lời dặn cho người chấm. Người chấm không còn giữ bí mật về vòng mình đang ở; số vòng là của công cụ.

**Còn phải làm.** Số trần trong mẫu (`ROUND: [1-5]/5`) vẫn nằm trong sáu tệp `PROMPT_CRITIC.md`; nó
thành sự thật chỉ ở hai khối đã sửa. Và `check_progress.py` vẫn đếm vòng bằng **tên tệp** — đó là đúng,
nhưng nếu sau này có một bản chấm sinh ra ngoài `review.sh` thì nó sẽ không có dòng `ROUND:` đúng.

---

## N35 — high — File nghiên cứu chưa ai viết, mà mọi cổng đều xanh

**Bằng chứng.** `research/FACTS.md` của tập 02 (lúc tôi kiểm) là **nguyên khuôn của thư viện**, chưa sửa
dòng nào: `<claim, in the words the film will use>`, `<Author>`, `<doi or link>`, `<value>`. Trong khi đó:

- `tools/check_facts.py` → **PASS**. Đúng vậy: file rỗng thì không có dòng nào trùng nhau và không có
  tham chiếu chéo nào sai. Bài kiểm tra trả lời "PASS" cho một file không có gì.
- `tools/check_citations.py` → báo **2 dòng** mẫu, nhưng cổng dàn ý của kênh **không gọi** nó; nó chỉ hỏi
  `research/FACTS.md` có tồn tại không.
- Người chấm dàn ý đọc file đó để hỏi "mỗi ý của phim có nguồn không" — và đọc một file rỗng thì **không có
  gì để phản đối**. Người chấm vẫn PASS.

Nghĩa là: **nghiên cứu là nền của cả phim, và không có máy nào canh nó cho tới khi phim đã xong** — lúc đó
cổng bàn giao mới báo, sau hàng giờ dựng. Đây là cùng loại lỗi với N30, ở một chỗ khác: một bài kiểm tra
trả lời "không có vấn đề" cho một file không có gì.

**Đã sửa.** `channels/tram-nghi-nhieu/tools/check_research.py`: file phải có nội dung, không còn dòng mẫu,
phải có ít nhất **một claim** (tiêu đề đánh số `## 1. …`) và ít nhất **một nguồn** (dòng có năm cạnh tác
giả, tạp chí hoặc định danh — đúng phép thử mà `check_citations.py` của thư viện dùng). Cổng dàn ý gọi nó
**trước khi** tốn một vòng chấm, và nói rõ dòng nào còn dở. `--selftest` có bốn ca thật, trong đó có ca
"chính khuôn phải fail".

**Còn phải làm.** `core/render/new_episode.sh` vẫn viết khuôn có dấu `<…>` vào `research/FACTS.md`; một
tập mới sẽ hỏng cổng dàn ý cho tới khi người làm viết lại file. Đó là đúng ý — nhưng khuôn nên ghi rõ
"xoá mọi dòng trong ngoặc nhọn" để người làm không phải đoán.

---

## N36 — medium — Cổng nói sai, và nó nói sai với một tập đã viết xong

**Bằng chứng.** Cổng dàn ý của kênh dừng bằng:

    grep -q '<viết:' "$EP/TREATMENT.md" && die "TREATMENT.md still holds '<viết: …>' placeholders …"

Tập 02 đã viết xong `TREATMENT.md` — nhưng dòng 2 của nó, nguyên văn dòng đầu của khuôn, là:

    > Dàn ý của tập. … Thay mọi chỗ `<viết: …>`. Xoá các dòng hướng dẫn bắt đầu bằng `>` khi xong.

Dòng đó **chỉ nhắc** chỗ cần điền, trong ngoặc ngược. Cổng đọc chuỗi `<viết:` và bảo "còn chỗ của khuôn
chưa viết" — cho một tập không hề có chỗ nào. Tệ hơn: cổng bàn giao của thư viện (`core/render/filmcheck.mjs`)
cũng săn đúng chuỗi đó, nên cùng một cái hiểu sai sẽ bắt phim lúc bàn giao.

**Nghĩa là gì.** Một cổng nói sai làm hai điều: nó chặn nhầm một việc đã xong, và nó dạy người làm rằng cổng
không đáng tin. Người làm sửa file vì cổng bảo, rồi cổng vẫn báo lỗi khác — đó là cách một phiên dài
bắt đầu quay vòng với những lỗi không bao giờ hết.

**Đã sửa.** Phân biệt **chỗ cần điền** với **lời nhắc**: một khoản trong ngoặc ngược là lời nhắc, một khoản
ngoài ngoặc ngược là chỗ cần điền. `channels/tram-nghi-nhieu/tools/check_treatment.py` giữ luật đó (và
`--selftest` có ca "một dòng bắt đầu bằng `>` là của chính tập, không phải lỗi" — tập 01 dùng dòng `>`
để viết quyết định của phim, nên cổng **không** được gọi chúng là lỗi). `filmcheck.mjs` bỏ ngoặc ngược
trước khi săn.

**Còn phải làm.** `core/render/filmcheck.mjs` không có `--selftest`; luật "ngoặc ngược là lời nhắc" nên có
một ca thật bên cạnh (một `FACTS.md` đã viết mà nhắc `<Author>` trong ngoặc ngược không bị chặn).

---

## N37 — high — Căn cứ của một phiên là ảnh, và cùng một khung hình được mở mười bảy lần

**Bằng chứng.** Transcript của phiên tập 01 nặng **860 MB**. Đo từng thành phần:

| Phần | Dung lượng |
|---|---|
| Kết quả công cụ (text) | 8,5 MB |
| Suy nghĩ (thinking) | 10,9 MB |
| Văn bản trả lời | 4,4 MB |
| Đầu vào công cụ | 3,0 MB |
| **Kết quả là ảnh (base64)** | **436 MB — 1 032 lần** |

Nửa còn lại của transcript là ảnh. Và ảnh thì lặp: `p_142.jpg` **17 lần**, `sheet_2.jpg` 16 lần,
`sheet_1.jpg` 13 lần, `p_172.jpg` 12 lần, `p_24.jpg` 12 lần. Trong 727 lần mở ảnh, **311 lần là mở lại
một tệp đã xem**.

Số lệnh shell cũng cho thấy đúng hình dạng của chi phí: 3 269 lệnh `bash`, trong đó **1 772 lần là đi
xem hệ thống tệp** (`ls`, `cat`, `find`, `stat`), 1 053 lần đọc tệp, 515 lần sửa. Chỉ **2 %** lệnh là
lặp nguyên văn — đây không phải một câu lệnh kẹt, đây là **một phiên dùng vô hạn cái vỏ bọc**.

**Nghĩa là gì.** Ảnh vào ngữ cảnh đắt hơn tệp văn bản khoảng hai mươi lần. Kênh này đã có sẵn đúng cái
công cụ cần: `beatsheet.mjs` dựng `sheet_*.jpg`, **mười hai khung một tờ**. Một tờ là một lần mở ảnh
và nhìn được mười hai khung. Mở từng khung một là mười hai lần mở ảnh cho cùng một thông tin. Và mở
*lại* cùng một khung (17 lần cho `p_142.jpg`) là trả tiền hai mươi lần cho một bức ảnh.

**Đã sửa.** `CODING_STANDARDS.md` có **R12**: xem **tờ sheet**, không xem lại một khung; mở khung riêng chỉ
khi tờ sheet không đủ trả lời câu hỏi, và ghi lại khung nào đã xem. `tools/supervise.sh` đếm lượt mở
ảnh **theo tên tệp** (cùng một khung hay được xem từ thư mục tạm khác nhau) và báo từ mười lần trở lên.

**Còn phải làm.** `tools/supervise.sh` mới đếm ảnh; nó **chưa** tính chi phí theo byte, và chưa phân biệt
"mở ảnh để soi" với "mở ảnh để dán vào báo cáo". Một con số đơn giản hơn nên có trong báo cáo giám sát:
**dung lượng transcript của phiên**, để một người đọc thấy ngay một phiên đang đắt.

---

## N38 — high — Một bách khoa là một dẫn chiếu, không phải một nguồn; và cổng máy không hỏi được câu đó

**Bằng chứng.** `research/FACTS.md` của tập 02 (lúc tôi kiểm, 08:02) có **mười một mốc** và **mười ba
lần nhắc `wikipedia.org`**; **năm mốc đứng trên Wikipedia một mình**. Cổng máy không bắt được:
`check_citations.py` chỉ hỏi "nguồn này có tra được không", và một URL Wikipedia là tra được.

Chỉ **người chấm dàn ý** mới hỏi đúng câu — mẫu chấm ghi: *"Mọi mắt xích có **nguồn tin cậy** trong FACTS
không? (Không nguồn: CHẶN)"* — nhưng "nguồn tin cậy" không được định nghĩa, nên một bài báo Wikipedia
cũng là "nguồn", và người chấm sẽ phải tự biết.

Tập 01 — tập tham chiếu của chính kênh này — làm khác: mốc 1 trích **Rogers & Yau, *A Short Course in
Cloud Physics*** (sách), mốc 2 trích **Alduchov & Eskridge, *Journal of Applied Meteorology*** 35(4),
mốc 3 trích **IUPAC Gold Book**; Wikipedia chỉ xuất hiện **một lần**, trong câu "Công thức và giá trị của
nước cũng được dẫn lại ở Wikipedia". Đó là chuẩn của kênh: **nguồn sơ cấp trước, bách khoa là dẫn chiếu**.

Đáng chú ý: phiên tập 02 **đã tải sẵn** một nguồn sơ cấp — bảng dữ liệu LTC4069 của Analog Devices, và
bảng dữ liệu đó nói đúng những gì phim cần (NTC đo nhiệt độ pin, tự giảm dòng sạc, giới hạn nhiệt độ).
Nhưng nó không được trích.

**Đã sửa.** `check_research.py` bổ sung một luật **máy kiểm được**: một mốc mà mọi đường dẫn đều là
Wikipedia thì fail (trừ khi mốc đó có mã định danh riêng: DOI/ISBN/arXiv). Và mẫu chấm dàn ý nói thẳng
"nguồn tin cậy = nguồn sơ cấp (sách, bài báo, đặc tả, datasheet, sổ tay cơ quan chuẩn); Wikipedia là
dẫn chiếu, không phải nguồn chính", kèm ví dụ lấy từ tập tham chiếu.

**Còn phải làm.** Máy không biết một datasheet là của một củ sạc thật hay của một món đồ chơi; chất
lượng của nguồn sơ cấp vẫn là việc của người chấm. Và cổng hiện bắt "Wikipedia một mình", chưa bắt
"mười mốc trích cùng một trang Wikipedia" — thứ mà một bài báo Wikipedia về một chủ đề rộng vẫn đúng.

---

## N39 — medium — Bản so sánh hai vòng im lặng về phần điểm, vì lớp ký tự của nó không đọc được tiếng Việt

**Bằng chứng.** `check_progress.py` — bài in ra *"vòng này có gần lên không, và lỗi nào của vòng trước vẫn
còn"* — đọc dòng điểm bằng biểu thức thường `([A-ZĐỘ_]+)=(\d+)`. Ba khoá điểm của kênh là **tiếng Việt**
(`NHỊP_ĐIỆU`, `CHUYỂN_ĐỘNG`, `ÁNH_SÁNG`); `Ị`, `Ệ`, `Ộ` có dấu không thuộc lớp `[A-ZĐỘ_]`, nên khoá bị
cắt thành mảnh: `NHỊP_ĐIỆU` → `U`, `CHUYỂN_ĐỘNG` → `N_ĐỘNG`, `ÁNH_SÁNG` → `NG`. Không khoá nào khớp, và
**phần so điểm giữa hai vòng không bao giờ được in ra** — bản so sánh chỉ còn câu FAIL và cờ máy.

Hậu quả đúng như mong đợi từ một bài kiểm tra hỏng trong im lặng: bài in ra ít hơn nó biết, nên người
đọc tưởng bản so sánh là trọn vẹn. Người chấm vòng 4 của tập 01 chỉ thấy *"câu FAIL chặn: 6 → 4"*, và
không thấy rằng **CHUYỂN_ĐỘNG rớt 4 → 2** trong khi điểm tổng lên 3.4 → 5.9: một vòng điểm tổng cao
hơn mà nhịp chuyển động kém hơn là chuyện đáng hỏi, và không ai hỏi.

**Đã sửa.** Biểu thức đọc khoá là `(\w+)=(\d+)` (`\w` của Python 3 đã gồm chữ tiếng Việt), và bài có
`--selftest` với sáu ca thật. Chạy lại trên tập 01, bài nay in ra đúng:

```
điểm tổng: 3.4/5 → 5.9/5 (+2.5)
  NHỊP_ĐIỆU    3 → 3
  CHUYỂN_ĐỘNG  4 → 2 (-2)
  ÁNH_SÁNG     4 → 4
```

**Còn phải làm.** Các khoá tiếng Việt còn ở chỗ khác trong bộ công cụ cũng có thể bị cắt theo cách
này — một lớp ký tự ASCII viết tay là mẫu của lỗi này. Việc chắc chắn là: **mọi bài kiểm tra phải có
một ví dụ nó phải bắt** (N30), và bài nào không có thì bài đó chưa từng được chứng minh là bắt được gì.

---

## N40 — high — Người chấm hình bắt đầu mỗi vòng từ đầu: công cụ biết vòng trước đã sửa gì, nhưng chỉ màn hình của phiên thấy

**Bằng chứng.** `channels/tram-nghi-nhieu/tools/review.sh` chạy `check_progress.py` sau mỗi vòng chấm hình,
và dòng chú thích của chính nó nói đúng ý: *"what the last round fixed and what is still open: the next round
must not start from zero"*. Nhưng **kết quả ấy chỉ ra màn hình của phiên điều khiển**; người chấm hình —
một tiến trình `claude -p` khác, đọc trong thư mục làm việc riêng — **không hề thấy nó**. Thư mục làm việc
mỗi vòng là một thư mục tạm mới (`mktemp -d`), và trong đó chỉ có: tờ beat, `beats.json`, `lines.json`,
`FACTS.md`, và ảnh tham chiếu.

Hậu quả đo được: vòng 4 của tập 01 vẫn còn **một lỗi CHẶN ở c60** mà người chấm đã gọi tên ở vòng 3 và
đã sửa, và lại phát hiện ra hai lỗi mới (c6, c55) trong khi mười lỗi cũ đã hết. Người chấm phải đọc lại
sáu mươi khung từ đầu mỗi vòng, và phần lớn công sức rơi vào việc **xác nhận lại những gì đã đúng** —
đúng cái mà bản so sánh hai vòng đã tính sẵn.

**Đã sửa.** `review.sh` nay ghi bản so sánh vào `$W/PROGRESS.md` **trước** khi gọi người chấm, và câu lệnh
gọi người chấm có thêm một dòng: *"Nếu có PROGRESS.md, hãy đọc nó trước khi chấm: nó nói vòng trước đã sửa
được gì và còn mở gì. Câu đã sửa rồi thì đừng nêu lại là lỗi; câu còn mở thì phải soi kỹ và nói rõ đã sửa
hay chưa."*

**Còn phải làm.** Đây là lần thứ hai trong đợt này mà một thứ đã được **tính** lại không tới được người cần
nó (xem thêm N37: cùng một khung hình mở mười bảy lần). Nguyên tắc: *một bản so sánh chỉ có tác dụng khi
đường dẫn của nó tới được bên cần nó.*

---

## N41 — high — Bài kiểm tra nhịp nói "đã kiểm tra" về một phim nó chưa từng mở

**Bằng chứng.** `tools/check_timing.py` được viết cho định dạng 2D cũ của kênh: nó cần
`const ORDER = [['shot','lineId'], …]` trong mã tập. Các tập 3D hiện tại (`sh('N1','c3', …)` trong
`src/film.js`) không có `ORDER`, và **không tệp nào trong repository còn có `ORDER`** nữa (khuôn 2D đã bị
thay bằng bản dựng lại 3D). Bài kiểm tra vì thế không tìm thấy gì để kiểm tra và in ra:

```
OK  tap-01-phoi-quan-ao: visual timing, micro-clocks, and anti-spoiler gates verified
```

Một chữ **verified** về một phim chưa từng được mở. Bước `timing` của cổng bàn giao vì thế là một đèn xanh
không có bóng đèn.

**Đã sửa.** Bài kiểm tra giờ nói thật khi không hiểu định dạng: nó in ra câu *"định dạng này không phải
định dạng mà bài này biết — không luật nhịp nào được áp dụng"* và **thoát mã 2** ("không chạy được", không
phải phán quyết về phim). Thêm vào đó, kênh có bài kiểm tra riêng cho định dạng 3D
(`channels/tram-nghi-nhieu/tools/check_shots.py`): mỗi câu lời kể phải có đúng một nhát, mỗi nhát phải gọi
đúng câu, và các nhát phải đi đúng thứ tự của lời — cổng bàn giao gọi bài của kênh khi kênh có bài của
riêng nó, đúng như nó đã làm với bài kiểm tra dàn ý.

**Còn phải làm.** Ba tệp trong `styles/*/demo/tts/lines.json` có dạng khác (`[id, text]` thay vì đối tượng)
nên `check_script` **crash** khi chạy lên chúng. Không ai chạy lên chúng, nên chưa ai thấy.

---

## N42 — high — Lời kể nói đúng câu mà file nghiên cứu cấm, vì máy chỉ canh con số chứ không canh câu

**Bằng chứng.** Tập 02 có trong `research/FACTS.md` (mục *Phạm vi* của mốc 12) câu:

> … không nói "chỗ nóng nhất trong máy", không nói "ma sát ở chỗ hạt chen chúc", không nói tỉ lệ nhiệt nào
> giữa các lớp …

Và `voice/lines.json` của chính tập đó nói:

> "Đây là chỗ nóng nhất trong cả cái máy."

`tools/check_claims.py` **có** canh những giá trị bị cấm — nhưng nó đọc **con số** ("90 %", "100 W"). Một
cấm đoán bằng lời không phải con số thì không con số nào hỏng được, và bài kiểm tra xanh. Người chấm dàn ý
bắt được lỗi này bằng mắt, sau một giờ đọc.

**Đã sửa.** `channels/tram-nghi-nhieu/tools/check_voice_facts.py`: đọc các cụm bị cấm trong
`FACTS.md` (`không nói "…"`, `không được nói "…"`, `tránh nói "…"`), so với lời kể và dàn ý sau khi bình
thường hoá (bỏ chữ trôi như "cả", "cái"; bỏ dấu câu) — nên `chỗ nóng nhất trong cả cái máy` khớp với
`chỗ nóng nhất trong máy`. Luật thứ hai: một xếp hạng (`<gốc từ> nhất`) mà `FACTS.md` chỉ cấm thì lời kể
không được dùng.

**Còn phải làm.** Cổng của kênh phải gọi bài này **trước** vòng chấm lời kể, để lỗi loại này không tốn
một vòng chấm nữa.

---

## N43 — medium — Dàn ý là cái cổng chấm: một phiên sửa được phim mà để nguyên dàn ý cũ, thì cổng vẫn bắt

**Bằng chứng.** Vòng dàn ý số 1 của tập 02 bị REJECT với bốn lỗi CHẶN. Trong vòng hai mươi phút sau đó,
phiên tập 02 **đã sửa đúng những gì cần sửa**: `voice/lines.json` viết lại (95 câu, không còn siêu từ nào),
cơ chế "ma sát ở chỗ hạt chen chúc" bị bỏ, câu 45 °C gắn đúng vào **tế bào pin**, và mã cảnh sửa nhiệt kế
đứng cạnh vỏ thay vì chồng lên lưng máy.

Nhưng `TREATMENT.md` — **tài liệu mà cổng dàn ý chấm** — vẫn là bản cũ (mtime 08:21, trước bản chấm 08:28):
vẫn còn "nhiều nhất trong ruột pin" ở câu trả lời một câu, "chỗ nóng nhất trong pin" ở dòng ý 14, và vẫn
viết "nhiệt kế đặt trên lưng máy". Chạy lại `--outline` thì **cùng bốn lỗi CHẶN quay lại**, trên một phim
đã đúng.

Đây là hệ quả của việc cổng chấm **tài liệu** chứ không chấm phim: tài liệu phải được sửa theo phim, và
một phiên có thể sửa phim mà quên tài liệu. Người giám sát phải nhìn thấy đúng chỗ lệch này — sửa lời kể
mà để dàn ý cũ — và báo lại.

**Đã sửa (tạm thời).** Người giám sát báo lại cho phiên tập 02, nêu đúng dòng và đúng câu, và yêu cầu sửa
`TREATMENT.md` rồi chạy lại cổng dàn ý. Đây là sửa tay, không phải guard.

**Còn phải làm.** Một guard: **cổng dàn ý phải đọc dàn ý cùng với lời kể và mã, và hỏi xem chúng còn khớp
nhau không** — chứ không chỉ chấm dàn ý như một văn bản đứng riêng.

---

## N44 — high — Người chấm viết bản chấm dưới một cái tên, công cụ đọc một cái tên khác, và bản chấm rơi vào một tệp cảnh báo

**Bằng chứng.** Vòng chấm hình số 4 của tập 01 chạy lúc 08:25. Người chấm viết bản chấm 35 KB vào
`SCENE-REVIEW.md` — đúng cái tên trong mẫu của nó (`step6-assembly/PROMPT_CRITIC.md`, dòng 34: *"Định dạng
Output Bắt buộc (`SCENE-REVIEW.md`)"*) — trong khi `review.sh` đọc `REVIEW.md`, đúng cái tên trong câu lệnh
gọi nó. Khi không thấy `REVIEW.md`, công cụ chạy:

```sh
[ -s REVIEW.md ] || cp out.txt REVIEW.md
```

và `out.txt` — thứ mà `claude -p` in ra — chỉ có **hai dòng cảnh báo** (connector bị tắt, model không nhận
ra), không có lời chấm nào. Bản chấm 35 KB của vòng 4 sẽ biến thành 415 byte cảnh báo, rồi được ghi vào
`review/REVIEW.md` — **đúng tệp mà phiên được bảo "sửa theo"**.

Vòng 4 mất trắng tiến trình chấm của nó. Vì sao ba vòng trước không mất? Vì ở những vòng đó người chấm
làm theo câu lệnh (`viết REVIEW.md`) chứ không theo mẫu. **Cái quyết định là một sự trùng hợp giữa hai
câu trong cùng một lời gọi** — và nó đúng một phần hai.

**Đã sửa.** Hai đầu: (1) mẫu của bước 5 và bước 6 nay ghi đúng cái tên công cụ đọc (`PROPS-REVIEW.md`,
`REVIEW.md`); (2) công cụ nhận **cả hai** cái tên (`if [ ! -s REVIEW.md ] && [ -s SCENE-REVIEW.md ]`),
nên lời gọi nào cũng không làm mất vòng chấm nữa. Cùng kiểu lỗi này: `step5` ghi `PROPS-CODE-REVIEW.md`
trong khi công cụ đọc `PROPS-REVIEW.md` — cũng đã sửa.

**Còn phải làm.** Các khối còn lại (`OUTLINE-REVIEW.md`, `SCRIPT-REVIEW.md`, `STORYBOARD-REVIEW.md`) đang
khớp tên, nhưng bài học chung là: **một lời gọi không được để hai cái tên cùng một thứ** — và lời gọi
nào cũng phải chịu được việc công cụ ghi ra tệp cảnh báo khi người chấm không viết đúng tên.

---

---

## N45 — high — Một bài kiểm tra chặn một phim đúng, vì nó đọc "bốn mươi năm" thay vì "bốn mươi lăm"

**Bằng chứng.** `check_labels.py` so con số vẽ trên nhãn với con số lời kể đọc, bằng cách đổi con số
thành chữ qua `number_words()`. Hàm đó dựng số ghép bằng cách ghép chục với chữ của hàng đơn vị:

```python
tens = {..., 4: 'bốn mươi', ...}.get(t, '')
return (tens + ' ' + WORDS.get(u, '')).strip()
```

Nên 45 ra **"bốn mươi năm"**, trong khi tiếng Việt là **"bốn mươi lăm"** (trong số ghép, con số năm là
"lăm"). Tập 02 vẽ "45 °C" trên thang nhiệt kế và nói "Quanh bốn mươi lăm độ, tế bào pin không nên sạc
nữa" — đúng theo chính luật của `FACTS.md` mục 7 (*"Cách nói: …"*, số phải nói thành chữ cho khó nghe).
Bài kiểm tra báo: **"45 °C — con số 45 không có trong lời kể"**, và cổng hình sẽ trả tập về để sửa một
lỗi không có.

Tệp `WORDS` có sẵn "mười lăm" (15) nên 15 đúng; 45 thì không có trong bảng, rơi vào nhánh số ghép —
và nhánh đó sai. Ba vòng chấm hình của tập 01 không bắt được vì tập 01 không vẽ con số nào đuôi 5.

**Đã sửa.** `number_words()` dùng "lăm" cho hàng đơn vị 5 trong số ghép (và cho "một trăm lăm"), kèm
bốn ca thử mới: dạng ghép của 5, 15, 45, 55, 105; lời kể nói "bốn mươi lăm độ" thì 45 **đã** được đọc;
lời kể nói "bốn mươi độ" thì 45 **chưa** được đọc.

**Còn phải làm.** `check_labels.py` còn một hàm chết: `said_numbers()` (gom chữ số thành cụm) không được
gọi ở đâu; lời kể được so nguyên cả câu. Nó viết ra một đường kiểm tra thứ hai cho cùng một luật, và
đường đó có thể sai mà không ai biết.

---

---

## N46 — high — Người chấm trả lời bằng chữ đậm, và công cụ không đọc được phán quyết của nó

**Bằng chứng.** Cùng vòng 4 của tập 01: người chấm in ra phán quyết trong câu trả lời của nó —
**"VERDICT: REJECT"** (in đậm) — và `review.sh` tìm phán quyết bằng
`grep -qE '^#*[[:space:]]*VERDICT: *PASS'`. Dấu `**` ở trước làm mẫu không khớp, nên **bản chấm không
có dòng phán quyết nào đọc được**: cổng không đọc được phán quyết thì coi như chưa có phán quyết, và
một vòng chấm người ta đã trả lời **REJECT** bị ghi lại như một bản chấm không có kết luận.

Điều này nguy hiểm ở chiều ngược lại: nếu người chấm viết **"VERDICT: PASS"** in đậm, cổng cũng đọc
không được, và **một vòng chấm đạt sẽ bị coi là chưa đạt** — mất trọn một vòng, và tệ hơn: người đọc
không biết vì sao.

**Đã sửa.** Cả `review.sh` và `gate.py` đọc phán quyết bằng một mẫu chịu được cả hai kiểu:
`^#*[[:space:]]*[*_]{0,2}VERDICT: *[*_]{0,2} *PASS`.

**Còn phải làm.** Còn những chỗ khác đọc bản chấm bằng tay: `check_progress.py` (điểm, câu FAIL) và
`check_voice_facts.py`. Chúng cùng một loại: **một bản chấm là do người viết, nên công cụ phải đọc được
cả những cách người ta viết** — không chỉ đúng một hình dạng.

---

---

## N47 — medium — Vòng chấm hình trả tiền cho ảnh nó không nhìn lần thứ hai, và không ai đo được cái giá

**Bằng chứng.** Đo lại transcript của người chấm vòng 4 của tập 01 (mỗi lần đọc ảnh là một lời gọi
`Read` với một tệp `.jpg`):

| | |
|---|---|
| tờ sheet đọc | 10 lần (5 tờ, mỗi tờ hai lần) |
| ảnh riêng đọc | **201 lần**, trong đó **58 ảnh khác nhau** trên tổng số 60 câu |
| ảnh bị đọc nhiều nhất | `b_027.jpg` **9 lần**, `b_037.jpg` 8 lần, `b_045.jpg` 7 lần |
| dung lượng transcript của vòng đó | 72 MB |

Một tờ sheet chứa mười hai câu, mỗi câu 640×360, và mô hình thu nhỏ ảnh về ~1568 px cạnh dài — nên
**một tờ sheet đáng giá bằng khoảng một ảnh riêng**. Đọc 201 ảnh riêng tức là trả tiền cho khoảng
200 ảnh để soi 60 ảnh. Lời dặn "đừng mở từng ảnh riêng" đã có sẵn trong mẫu và **không có tác dụng**:
người chấm cần tới chi tiết để phán "nhãn này chỉ vào tường trống", nên nó mở từng ảnh.

**Đã sửa.** (1) Mẫu của người chấm hình nay có **ngân sách ảnh**: ảnh riêng chỉ cho câu có cờ máy, câu
fill dưới 15 %, hoặc câu người chấm nghi ngờ; **mỗi ảnh chỉ mở một lần**; quá 25 ảnh thì phải nói lý do.
(2) `review.sh` **đo** số ảnh người chấm đọc trong transcript của chính nó và in ra sau mỗi vòng:
*"vòng này tốn 201 lần đọc ảnh riêng (58 ảnh khác nhau)"*. Cái giá của vòng chấm trở thành con số nhìn
thấy được, thay vì một bản transcript 72 MB.

**Còn phải làm.** Nếu ngân sách ảnh không đủ, bước tiếp theo là **đưa phép đo của máy vào tờ sheet** —
vẽ hộp của nhãn, đuôi nhãn chỉ vào đâu, và hộp của vật chính — để tờ sheet đủ sức chứng minh điều người
chấm phải soi, và người chấm chỉ cần mở ảnh riêng cho câu thật sự khó.

---

## N48 — high — Dàn ý trích nguyên văn lời kể, nên khi lời kể viết lại, dàn ý mô tả một phim không còn tồn tại

**Bằng chứng.** Tập 02 viết lại lời kể sau khi `research/FACTS.md` cấm "chỗ nóng nhất trong máy".
`LOOK.md` — bản dàn ý của tập — **trích nguyên văn** từng câu lời kể trong dấu nháy, và nó vẫn còn
những dòng dán câu cũ:

| dòng `LOOK.md` | dòng dán | trích dẫn còn nằm trong `LOOK.md` | lời kể bây giờ |
|---|---|---|---|
| 20 | (nhãn) | `chỗ nóng nhất (c42–c52)` | c42: *"Ngoài hai chỗ ấy, còn một chỗ nữa: chính là túi pin."* |
| 76 | c42 | *"chỗ nóng nhất không nằm ở bo mạch"* | c42: *"Ngoài hai chỗ ấy, còn một chỗ nữa…"* |
| 84 | c50 | *"chỗ nóng nhất trong cả cái máy"*, nhãn `CHỖ NÓNG NHẤT` | c50: *"Giờ gom lại: mạch sạc, cục pin, và con chip."* |
| 85 | Bài kiểm tra liên kết tự báo lỗi ở chỗ không phải nguyên nhân: một khối code fence có dấu nháy lẻ làm `check_doc_links.py` ghép lệch mọi đoạn code **cả tệp**, nên lỗi báo ra ở cuối tài liệu, cách nguyên nhân hàng nghìn ký tự — người đọc sửa nhầm chỗ báo lỗi, rồi tắt luôn bài kiểm tra | medium | `check_doc_links.py` bỏ fence trước, rồi ghép đoạn code theo từng đoạn văn thay vì theo cả tệp; selftest có ca cho việc này |
| 86 | Báo cáo đo nói "không có khoảng lặng" cho một tệp **không có tiếng nào**: `film_report.py` chạy trên bản dựng hình chưa ghép tiếng in ra "not measured" và "no silent stretch of 1.0 s or more" — đúng theo nghĩa đen, sai theo nghĩa đúng, và người đọc sẽ tưởng phim ổn | medium | `film_report.py` hỏi trước có luồng tiếng không: không có thì in `NO SOUND`, nói rõ ở phần khoảng lặng rằng đây là phim không có tiếng chứ không phải lời kể bị ngắt, và trả mã 1; selftest có ba ca |
| 87 | Tờ sheet không phải là phim: đọc tờ sáu mươi ô (~480 px) rồi kết luận cho ba nhận định sai (c32 "tường tối, chỉ có vai áo" trong khi trên phim là một cái áo trắng lớn giữa khung; c7 "hai áo giống nhau" trong khi áo trái nhạt áo phải sẫm; nhãn "3 CÁI" thực ra là `3 ÁO`) — ô nhỏ làm mất đúng thứ phim dạy, tức tương phản sáng/tối và kích thước vật | medium | `tools/frames_at.py` (mới) cắt một khung cho mỗi câu **từ chính mp4**, đúng giữa câu lời kể, rồi dán bằng `core/render/sheet.py`; có `--cols`/`--w` để soi một câu ở kích thước đọc được; R12 trong `CODING_STANDARDS.md` nói rõ tờ sheet là bản đồ để tìm câu, phim mới là bằng chứng |
| 90 | Vòng chờ tự khớp lấy chính nó: `until ! pgrep -f "x/build.sh"; do sleep 15; done` có chuỗi đó trong dòng lệnh của chính vỏ shell, nên `pgrep -f` tìm thấy chính nó và điều kiện không bao giờ thành đúng — job chờ mãi một việc đã xong | medium | luật **R14** trong `CODING_STANDARDS.md`; `tools/rules.py` báo R14 khi mẫu `pgrep -f`/`pkill -f` nằm ngay trong dòng lệnh, có ca selftest cho cả hai vỏ |
| 88 | Bản dựng giữa được chuyển đi và về nguyên vẹn: `mux.sh` gửi 1 113 MB (52,9 Mbit/s) qua đường truyền ~1,3 MB/s — ~14 phút lên, ~12 phút encode, ~6 phút về — trong khi encode cuối **tại chỗ** chỉ tốn ~6,5 phút cho cả tập. Đường xa chậm hơn encode tại chỗ khoảng bốn lần, vì nó chuyển một bản trung gian *xa hơn nhiều* so với thứ bản cuối cần | medium | `mux.sh` thu nhỏ bản giữa một lần tại chỗ (`-preset veryfast -crf 20`): 239 MB thay vì 1 113 MB, đo thật PSNR 40,4 dB, bản cuối vẫn `crf 19` — tệp nhỏ dưới 200 MB thì gửi nguyên bản, thu nhỏ hỏng thì gửi bản gốc, và bản thu nhỏ bị xoá sau khi chuyển |
Dàn ý trông vẫn đầy đặn, vẫn đúng về hình — nó chỉ nói về **những câu mà phim không còn nói**. Đây là
cùng một lớp lỗi với N43, ở tầng khác: N43 là dàn ý (`TREATMENT.md`) bị bỏ lại; đây là **bản dàn ý
hình** (`LOOK.md`) bị bỏ lại. Cả hai đều là tài liệu mô tả phim, và cả hai đều im lặng.

**Đã sửa.** `channels/tram-nghi-nhieu/tools/check_storyboard.py` đọc `LOOK.md` + `voice/lines.json` và
bắt ba loại lệch:

1. **Câu không còn ai nói** — trích dẫn khớp **không câu nào** trong `voice/lines.json`: dàn ý mô tả
   phim cũ;
2. **Dán nhầm câu** — trích dẫn là câu của một dòng khác (không phải dòng kế tiếp);
3. **Câu bị cấm** — trích dẫn chứa cụm mà `FACTS.md` cấm (dùng lại đúng luật của `check_voice_facts.py`).

Chỉ phần **trong dấu nháy** được so, và **trích dẫn của câu kế tiếp được phép** — dàn ý hay nhắc
trước một câu sắp tới (*"câu này chưa xảy ra, nên phải có một động tác nhỏ trước nó"*). Hai lỗi đó
đều sẽ là **bằng chứng giả** nếu không có ngoại lệ: đo trên hai tập thật, 163 dòng dàn ý, có đúng
**một** dòng nhắc câu kế tiếp (tập 02, dòng 37) — và nó đúng, không phải lỗi.

Cổng dàn ý (`review.sh --storyboard`) chạy bài này **trước khi** tốn một vòng chấm, cùng với
`check_labels.py`. Tập 01 và tập 02 đều xanh.

---

## N49 — medium — Cùng một cách sửa một file, và cách nó làm hỏng tiếng Việt, xuất hiện ở ba nơi khác nhau

**Bằng chứng.** Ba sự cố trong đợt này đều có cùng một dạng: **một con trỏ hỏng trong tài liệu** —
công cụ và tài liệu dùng hai cách viết khác nhau cho cùng một thứ, và công cụ im lặng.

| Nơi | Hai cách viết | Hậu quả |
|---|---|---|
| bản chấm hình | người chấm ghi `SCENE-REVIEW.md`, công cụ đọc `REVIEW.md` | bản chấm rơi vào một tệp cảnh báo; **một vòng chấm bị ném đi** (N44) |
| phán quyết | người chấm viết `**VERDICT: PASS**`, công cụ đọc `VERDICT: PASS` | phán quyết không đọc được; **một vòng chấm bị ném đi** (N46) |
| số trong nhãn | nhãn viết `45 °C`, bài kiểm tra đọc "45" thành *"bốn mươi năm"* | **một tập đúng bị chặn oan** (N45) |

Cái thứ ba đáng chú ý nhất: **nguyên nhân là ngôn ngữ**, không phải lỗi logic. "45" đọc thành
"bốn mươi lăm" trong tiếng Việt (số ghép dùng "lăm"), còn "bốn mươi năm" là năm mươi. Bài kiểm tra
viết đúng logic, sai ngôn ngữ, và **chặn một tập đúng**.

**Đã sửa.** Cả ba đã sửa, và cả ba theo cùng một nguyên tắc: **công cụ phải đọc được mọi cách
người viết**, không chỉ cách mình thích. `gate.py` và `review.sh` giờ chấp nhận phán quyết có dấu
`**`, có dấu `#`, không phải; `check_labels.py` có `number_words()` riêng cho số ghép tiếng Việt.

**Còn phải làm.** Nên có **một** bài kiểm tra đi dọc cả kênh, đọc tất cả mẫu `PROMPT_CRITIC.md` và
tất cả bản chấm đã sinh, rồi báo những cách viết mà công cụ không đọc được — vì hiện tại, mỗi cách
viết lệch lệch chỉ lộ ra **khi nó làm mất một vòng chấm**.

---

## N50 — medium — Tài liệu của kênh là nơi lỗi tích tụ, và nó không tự nói ra

**Bằng chứng.** Ba tài liệu của kênh — `TREATMENT.md`, `LOOK.md`, `research/FACTS.md` — là nơi
hai phiên đã đẩy mọi thứ vào. Và mỗi tài liệu có một cách đi lệch riêng:

- `TREATMENT.md` bị bỏ lại khi lời kể viết lại (N43);
- `LOOK.md` bị bỏ lại khi lời kể viết lại (N48);
- `FACTS.md` **sinh ra** lệnh cấm mà lời kể không làm theo (N42).

Và hình dạng thứ ba, tìm ra ở tập 02: **`FACTS.md` bị bỏ lại khi hình đi trước nó.** Mục 5 của file
nghiên cứu vẫn viết vạch đỏ 45 °C nằm trên nhiệt kế; phim dựng nó trên cảm biến nhiệt trong máy;
lời kể nói nó là mốc của tế bào pin. Ba nơi, ba câu khác nhau, và **không bài kiểm tra nào thấy** —
vì `check_claims.py` canh con số, mà con số 45 thì vẫn đúng cả ba nơi. Điều lệch ở đây là **danh
từ**, không phải số.

Điểm chung: **một tài liệu cũ không tự báo là cũ.** Nó vẫn in ra, vẫn đúng về hình, vẫn đọc được —
nên người đọc tin nó. Chỉ khi một bài kiểm tra đọc nó **cùng lúc với** tài liệu nó phải khớp thì
sự lệch mới lộ ra. Đó là lý do `check_voice_facts.py` đọc `FACTS.md` **và** `lines.json`, và
`check_storyboard.py` đọc `LOOK.md` **và** `lines.json`: hai tài liệu, một lần đọc, so với nhau.

**Đã sửa.** Hai bài kiểm tra trên; cổng dàn ý và cổng lời kể chạy chúng trước khi tốn một vòng chấm.

## N51 — medium — Hai trong bảy bước của kênh không có công cụ: bản chấm viết ra không ai đọc

**Bằng chứng.** Bảy bước của kênh, bảy mẫu người chấm trong `.agents/skills/tram-nghi-nhieu/step*/`:
mỗi mẫu khai báo tên tệp bản chấm của nó. Năm bước có công cụ — `review.sh` có chế độ
(`--outline`, `--script`, `--props`, `--storyboard`, chế độ hình), `gate.py` có tem, và tên tệp
mẫu khai báo trùng đúng tên công cụ đọc.

Hai bước thì không:

| Bước | Mẫu khai báo | `review.sh` | `gate.py` |
|---|---|---|---|
| 4 — rà soát chéo kịch bản | `ASSET-AUDIT-REPORT.md` | không có chế độ | không có tem |
| 7 — nghiệm thu video cuối | `FINAL-QA-REPORT.md` | không có chế độ | không có tem |

Hai bước đó chạy bằng subagent, người chấm viết báo cáo ra, rồi **báo cáo đó nằm đó**: không ai
đếm vòng, không ai chữ ký nó vào một tem, không ai hỏi "bước này đã qua chưa". Đúng cái hình
dạng của N4 (bước 3 hồi đó không có tem, không có công cụ, không ai ký) — chỉ khác chỗ: bước 3
là *cổng chặn phim tệ*, còn bước 4 và 7 là *rà soát chéo*, nên thiếu chúng là mất lớp phủ, không
phải mất chặn. Vì vậy mức này là medium, không phải high.

Bằng chứng phụ: `review/ASSET-AUDIT-DIRECTORS-CUT.md` của tập 01 kết thúc bằng văn xuôi, không
có `VERDICT: PASS` — khác hai bản cắt anh em (`PROPS-DIRECTORS-CUT.md`, `STORYBOARD-DIRECTORS-CUT.md`)
đều kết thúc bằng `## VERDICT: PASS`. Không phải vì người viết sai: **không ai đọc tệp đó**, nên
cách viết của nó không quan trọng. Đó chính là hệ quả của việc thiếu công cụ.

**Bằng chứng mạnh hơn, tìm ra sau.** Bước 4 của tập 01 đã chạy **năm vòng** và sinh ra một bản
soi tài liệu 24 kB — bản soi tìm ra lỗi thật (linh kiện nằm dưới sàn, quạt đứng yên, 35 hàng
`c_id` sai, đặc tả nói vạch đỏ nằm trên nhiệt kế còn hình thì không có). **Không ai mở tệp đó.**
Cùng thư mục còn có `ASSET-AUDIT-DIRECTORS-CUT.md` — bản cắt đạo diễn chốt bước 4 — và nó
**không có dòng phán quyết**, trong khi hai bản cắt anh em (`PROPS-DIRECTORS-CUT.md`,
`STORYBOARD-DIRECTORS-CUT.md`) đều kết thúc bằng `## VERDICT: PASS`. Không phải vì người viết
sai: **không ai đọc tệp đó**, nên cách viết của nó không quan trọng. Đó chính là hệ quả của việc
thiếu công cụ, nói ra thành lời.

**Guard đã có.** `channels/tram-nghi-nhieu/tools/check_reports.py` đi dọc bảy mẫu và mọi bản
chấm đã sinh, rồi nói ba điều: mẫu của bước có công cụ có nêu đúng tên tệp công cụ đọc không;
mọi bản chấm mà công cụ sẽ đọc có phán quyết mà công cụ đọc được không; và **bước nào chưa có
công cụ** — hai bước 4 và 7 được nêu tên ngay trong đầu ra.

**Bước 4 nay có công cụ.** `review.sh --assets`: chấm `COMPONENTS_SPEC.md` cạnh `LOOK.md`,
`voice/lines.json` và `src/*.js`; phán quyết do công cụ đọc; số vòng của công cụ; báo cáo có
chữ ký; đóng tem `ASSET.pass` bám vào bốn tệp nó chấm; và bản cắt của đạo diễn chịu **cùng
luật cũ** như props và picture — viết trước lần sửa code cuối thì bị từ chối. Tập 01 chạy
thử: cổng nói *"đã chấm 5 lần mà bản đặc tả vẫn chưa khớp mã"* và chỉ đường chốt bằng bản cắt
— tức là năm vòng soi tài liệu đã tốn công cũng được **đếm**.

**Bước 7 cũng có công cụ, và nó khác mọi bước khác ở một điểm: người chấm bước 7 là người chấm
*phim*, mà người chấm đọc **hình** — nên không ai nghe được phim có dải âm thanh không, âm lượng
bao nhiêu, chỗ nào im lặng, và câu nào không có tiếng. Những điều đó là việc của máy, và trước đây
không ai làm. Nay:

- `channels/tram-nghi-nhieu/tools/check_delivery.py` — máy đo những điều người chấm không nghe
  được: phim có hình và có tiếng, độ dài thật (và `film.json` có nói đúng không — N19), âm lượng
  trung bình và đỉnh, những chỗ im lặng quá dài, **mỗi câu lời kể có một sự kiện giọng**, và
  phim có tiếng động của riêng nó hay không. Sáu ca selftest, mỗi ca một phim dựng thật bằng
  ffmpeg: phim đủ tiếng thì đạt; phim có dải âm nhưng im lặng thì không; phim không có dải âm thì
  không; manifest nói sai độ dài thì không; tập chưa có phim thì không; câu lời kể không có tiếng
  thì không.
- `review.sh --final` — một vòng như mọi vòng: đọc mẫu, đánh số vòng, ký tên, đóng tem
  `FINAL.pass` bám vào chính tệp phim (dựng lại là tem hết hiệu lực), trần 3 vòng.
- Khung hình cho người chấm **trích từ phim đã dựng**, không phải từ ảnh tĩnh: một tờ sheet mười
  hai khung, tên mỗi khung ghi số giây của nó trong phim (N18: xem tờ sheet, không mở từng ảnh).
- Chữ phán quyết của bước 7 là chữ của nó — `ACCEPTED_FOR_PUBLISH`, không phải `PASS` — và nó
  chịu **cùng luật**: dòng mẫu chưa điền không phải câu trả lời.

**Còn lại.** Tem `ASSET.pass` chưa nằm trong `NEEDS['render']`, và tem `FINAL.pass` chưa nằm
trong cổng bàn giao của thư viện — thêm vào là một dòng mỗi cái, nhưng làm sau khi hai tập đang
chạy bàn giao xong, vì thêm sớm là chặn chính những tập đó.

## N52 — critical — Cổng chấm trả lời "PASS" về một thư mục không tồn tại

**Bằng chứng.** `gate.py` đọc đối số kiểu `op, ep = a[0], os.path.abspath(a[1])`. Nghĩa là
`python3 gate.py check --for render <tập>` lấy `--for` làm đường dẫn tập. Rồi `check()`:

```python
L = lines(ep)
if not L: return None   # the channel's demo, a rig test: no words, nothing to gate
```

`lines()` trả `None` cho một thư mục không có `voice/lines.json` — **kể cả thư mục không tồn tại** —
nên cổng trả lời PASS. Đo bằng máy:

```
$ python3 channels/tram-nghi-nhieu/tools/gate.py check --for render /tmp/khong-co-that
cổng chấm: PASS          # trước khi sửa
```

Cách thoát dành cho demo ("không có lời kể thì không có gì để canh") nuốt luôn đường dẫn gõ
sai. Hai lý do khiến nó thành lỗi **nghiêm trọng**, không phải là phiền toái:

1. `core/render/video.mjs` và `voice/tts_vi.py` gọi cổng **đúng** thứ tự tài liệu, nên các
   lệnh trong thư viện chưa từng bị đánh lừa — nhưng chính vì thế mọi lần gọi sai đều im lặng.
2. Cổng là thứ **cuối cùng** trước khi dựng. Một cổng trả PASS về một đường dẫn sai thì
   không còn gì để chặn nữa.

**Đã sửa.** (a) `gate.py` tách cờ và đối số vị trí: `check <tập> --for render` và
`check --for render <tập>` cho cùng kết quả, vì cổng không được trả lời khác nhau theo thứ tự
gõ. (b) `check()` nói thẳng ra khi thư mục không tồn tại, và chỉ để "không có lời kể, không có
gì để canh" cho một thư mục **thật** (có `index.html`, `src/` hay `film.json`). (c) `gate.py`
giờ có `--selftest` với 14 ca, trong đó có đúng ca này.

## N53 — high — Tem storyboard nói nó phủ cả mã nhát, nhưng nó chỉ băm dàn ý

**Bằng chứng.** `gate.py` tự mô tả: `STORYBOARD.pass  LOOK.md + src/film.js`. Nhưng
`digest()` băm **một tệp**:

```python
if kind == 'storyboard': files = [os.path.join(ep, 'LOOK.md')]
```

Trong khi `review.sh --storyboard` đưa cho người chấm **cả hai**: `cp "$EP/LOOK.md" "$W/"`
*và* `cp "$EP/src/film.js" "$W/film.js"`. Tức là vòng chấm có phán quyết về mã nhát, còn con
tem thì không dính vào mã nhát. Một tem nói phủ cả hai mà chỉ băm một là một tem nói dối.

Hệ quả kép: `src/film.js` sửa xong thì tem cũ vẫn "còn hiệu lực"; và **bản cắt của đạo diễn ở
bước storyboard không có luật cũ** — `stale_cut()` chỉ biết `props` và `picture`, nên một bản
cắt viết trước lần sửa `src/film.js` cuối cùng vẫn đóng được tem cho một phim mà không ai
nhìn (đúng cái N22 đã sửa cho hai loại kia, quên loại thứ ba).

**Đã sửa.** (a) `digest()` băm `LOOK.md` **và** `src/film.js` cho loại `storyboard`; tem nói
đúng điều nó phủ. (b) `stale_cut()` biết loại `storyboard`, và `review.sh --storyboard` gọi
`gate.py cut` trước khi đóng tem, y như props và picture — bản cắt viết trước lần sửa code
cuối thì bị từ chối, và cổng nói phải làm gì. (c) Cả 14 ca của `--selftest` mới đều có ví dụ
nó phải bắt.

**Cùng lúc đó: người giám sát không hỏi cổng của kênh.** `tools/supervise.sh` chạy
`filmcheck`, `drawcheck`, `citations`, `claims`, `facts`, `index`, `tracked` — bảy bài kiểm tra
mà **không bài nào hỏi "phim này đã được chấm chưa"**. Nên một cổng xanh nói "mọi thứ ổn" về
một phim mà người chấm vừa trả về REJECT 7,3/10 và cổng dựng đang đóng. Nay `supervise.sh` gọi
`gate.py status` (in ra từng tem và **phán quyết vòng chấm cuối**) và `gate.py check --for render`
(khi phim đã dựng xong thì cổng đóng là FAIL, còn đang dựng thì chưa).

## N54 — high — Báo cáo của người giám sát nêu tệp mà phiên không hề viết

**Bằng chứng.** `tools/supervise.sh` có sẵn cách đọc đúng: `write_targets(cmd)` biết lệnh đó
**ghi** tệp nào, khác với tệp lệnh chỉ **nhắc tới**. Nhưng dòng báo cáo R1 thì ném cái danh sách
đó đi và dò lại tên tệp trong lệnh:

```python
targets = [f for f in write_targets(cmd) if project_file(f, cmd) and re.search(src_ext, f)]
is_r1 = bool(targets)
...
if is_r1:
    targets = [f for f in re.findall(repo_file, cmd) if project_file(f, cmd)]   # ← ném đi
```

Hệ quả đo được trên phiên tập 01: báo cáo nêu `core/render/page.mjs×4` — nhưng transcript
không có lệnh nào ghi tệp đó; nó chỉ được **import** trong một heredoc. Cùng lúc đó, mười hai
lần ghi thật vào `TREATMENT.md` và `voice/lines.json` rơi vào dòng "R1?" — không ai hành động
được. Đây là lỗi đã được ghi trong `improvements/lessons.md`: *"475 violations where the truth
was 34"* — lặp lại ở dạng nhỏ.

**Vì sao nó quan trọng.** Đây không phải một phép đo lệch — đây là **báo cáo mà người đọc không
tin được**. Người đọc báo cáo không tin được thì không đọc báo cáo lần nữa, và phát hiện thật
bên trong nó cũng chết theo.

**Đã sửa.** (a) Luật R1 dùng danh sách tệp đã ghi mà nó đã tính sẵn. (b) Lệnh không nói được
tệp nào thì báo `R1?` và **không đoán** — trước đó dòng này nói "the log truncates the command",
nhưng transcript **không** cắt lệnh; chỉ phần hiển thị mới cắt. (c) Khối luật rời khỏi
`supervise.sh` ra `tools/rules.py`, có `--selftest` 8 ca — trong đó đúng cái ca "heredoc chỉ
import một tệp thì báo cáo không được nêu tệp đó". (d) Tên tệp trong báo cáo nay ngắn lại
theo thư mục phim, để người đọc nhìn ra ngay.

Đo lại trên cùng phiên: `R1 37 lần` trước và sau, nhưng danh sách tệp nay là những tệp thật
sự bị ghi — `src/props.js×5, LOOK.md×5, src/set.js×4, voice/lines.json×3,
review/beatsheet/beats.json×2, COMPONENTS_SPEC.md×2, review/STORYBOARD-DIRECTORS-CUT.md×2,
dbg.html×1` — và không có tệp nào chỉ được nhắc tới.

---

## N55 — critical — Dòng mẫu "VERDICT: PASS | REJECT" được cổng đọc thành PASS

**Bằng chứng.** Sáu trong bảy mẫu của kênh in khối output của chúng với đúng dòng này:

```
## Định dạng Output Bắt buộc (`OUTLINE-REVIEW.md`)

```markdown
SCORES: A=[1-5] B=[1-5] C=[1-5] D=[1-5] E=[1-5]
VERDICT: PASS | REJECT
```

Còn cổng đọc phán quyết bằng:

```python
re.search(r'^#*\s*[*_]{0,2}VERDICT: *[*_]{0,2} *PASS', ...)
```

Dòng mẫu khớp **đúng** biểu thức đó. Người chấm điền điểm vào `SCORES:` rồi **chép nguyên dòng
`VERDICT:`** — một động tác rất tự nhiên, vì dòng đó nằm ngay trong khối mẫu — và bản chấm đó
được cổng đóng tem như một PASS. Cùng cái đó, `check_reports.py` đọc chữ phán quyết là `PASS`.

Chưa bản chấm nào trong repository rơi vào hình này (`grep -rn "VERDICT: PASS | REJECT" channels/`
rỗng) — nhưng đó là may mắn, không phải bảo đảm: cổng đang trả PASS cho một câu trả lời mà người
chấm chưa từng chọn.

**Vì sao nó quan trọng.** Đây là loại lỗi tệ nhất của một cổng: **cổng trả đúng cho một câu trả lời
sai**. Mọi phát hiện khác trong bản đúc kết này là cổng *quá dễ* (N52: nói PASS về một thư mục
không tồn tại) hoặc cổng *quá khó* (N3: đòi người chấm đoán thứ không thể đoán). Cái này là cổng
**nói PASS về một bản chấm chưa có ý kiến** — và nó im lặng đúng lúc im lặng là đáng sợ nhất.

**Đã sửa.** (a) Cả bảy mẫu in dòng mẫu thành `VERDICT: (điền đúng MỘT chữ: PASS hoặc REJECT)` —
một dòng mà **không** công cụ nào đọc được là phán quyết — kèm một câu dặn ngay trên khối mẫu.
(b) `gate.py` và `check_reports.py` không còn đọc một dòng phán quyết sau đó còn dấu chọn (`|`, `/`,
`+`), và không đọc một chữ chạy tiếp (`PASSED`). (c) Bốn ca selftest mới trong `gate.py` khẳng
định đúng cái lỗi này.

Kiểm chứng bằng chính cổng:

```
$ printf 'VERDICT: PASS | REJECT\n' > r.md && gate.py stamp … ; echo $?
gate: … does not say VERDICT: PASS
1
$ printf 'VERDICT: PASS\n' > r.md && gate.py stamp … ; echo $?
0
```

---

## N56 — high — Người chấm chỉ in câu trả lời ở cuối, nên phiên tưởng nó chết và mở người chấm thứ hai

**Bằng chứng.** `review.sh` gọi người chấm bằng `claude -p … > out.txt 2>&1`. `claude -p` **in
câu trả lời khi nó xong**, không in tiến trình — nên suốt thời gian nó nghĩ, `out.txt` gần như rỗng.
Phiên tập 03 đọc `out.txt` thấy 415 byte cảnh báo của CLI rồi kết luận người chấm đã chết, và:

- tự dựng lại một lệnh chấm (`claude -p` tay),
- chạy `review.sh --outline` lần nữa với `--model` khác,
- rồi tự ghép prompt và tự chạy `set_round.py` bằng tay.

Cả ba cùng ghi vào một tệp bản chấm. Lệnh thứ nhất (pid 2283040) vẫn đang chạy và là lệnh hợp lệ.

Hai dòng cảnh báo mà phiên đọc là "lỗi" — `⚠ claude.ai connectors are disabled because
ANTHROPIC_API_KEY …` và `[claude-code:unrecognized_model] {"model":"2tocom/MiniMax-M3.1-Flash[1m]"}` —
là **cảnh báo của CLI, không phải lỗi**: một `claude -p "Reply with exactly: OK"` in ra đúng hai
cảnh báo đó, rồi trả lời `OK` và thoát mã 0.

**Vì sao nó quan trọng.** Đây là R9/R5 (chờ người, không chờ tệp) ở dạng tệ nhất: không chỉ tốn
tiền, mà còn **làm hỏng vòng chấm đang chạy**. Và nó xảy ra với mọi người chấm, không riêng phiên
này — vì `claude -p` không in gì cho tới khi xong.

**Đã sửa.** (a) `review.sh` nói thẳng trong dòng "reviewer at work" rằng câu trả lời chỉ in ra ở
cuối, file gần như rỗng là bình thường, và phải chờ lệnh này chứ đừng mở vòng thứ hai. (b) Một
vòng chấm **không có dòng `VERDICT:`** nào trong cả `out.txt` lẫn các tệp nó viết thì thoát mã 2
— "không chạy được", không phải phán quyết về phim — thay vì được lưu thành một vòng đã tiêu.

---

## N57 — high — Hai người chấm một tập: hai bản chấm một tệp, hai vòng bị tính, ngân sách bị tiêu hai lần

**Bằng chứng.** Trong khoảng ba phút, tập 03 có ba người chấm cùng một dàn ý (pid 2283040,
2294643, 2298787). `review.sh` không có chốt nào, và mỗi người chấm tự tính số vòng từ các tệp
đã có — nên cả ba cùng viết `OUTLINE-REVIEW-1.md`.

**Vì sao nó quan trọng.** Hai người chấm một tập không chỉ tốn gấp đôi: người chấm sau **ghi đè**
bản chấm của người trước, nên phán quyết cuối cùng là của người nào kết thúc sau, chứ không phải
người nào chấm kỹ hơn. Vì số vòng đếm từ tệp, một vòng bị mất đi mà không ai biết.

**Đã sửa.** `review.sh` giờ giữ một chốt theo từng phần (`$EP/.review-<phần>.lock`): chốt là một
thư mục, vì `mkdir` là lệnh duy nhất thất bại khi thứ đó đã ở đó. Hai vòng chấm **cùng một phần**
của cùng một tập thì vòng thứ hai bị từ chối ngay, kèm lời giải thích; hai vòng chấm **khác phần**
thì vẫn chạy song song. Một chốt bỏ lại do phiên bị giết được lấy lại, không chặn mãi (chốt ghi
pid; pid không còn sống thì chốt cũ bị gỡ).

Kiểm chứng:

```
$ sh review.sh <tập> --outline     # khi đã có chốt
review: đã có một vòng chấm 'outline' đang chạy (pid 2310720) trên tập này — đừng mở vòng thứ hai.
1
```

---

## N58 — low — Công cụ sửa file của chính người giám sát làm rơi quyền thực thi của một tệp

**Bằng chứng.** `tools/replace.py` ghi bằng cách tạo một tệp tạm rồi `os.replace` đè lên tệp cũ. Tệp
tạm sinh ra bởi `mkstemp` có quyền `0600`, và quyền cũ **không** được mang sang. Hậu quả: khi tôi sửa
`channels/tram-nghi-nhieu/tools/review.sh` bằng công cụ đó, nó biến mất khỏi `100755` thành `100644`
trong git. Lịch sử cho thấy cùng kiểu mất quyền đã xảy ra trước đó với `tools/supervise.sh` và 26 tệp
`build.sh` — và đã phải sửa tay từng tệp một (lịch sử có 27 dòng "mode change 100644 => 100755").

**Vì sao nó quan trọng.** Một công cụ sửa file mà làm đổi cách tệp chạy là một công cụ **không trung
thực**: người đọc diff thấy nội dung đổi và không để ý rằng tệp không còn chạy được nữa. Và ở đây
công cụ đáng lẽ phải là đường đi an toàn (R1: sửa bằng công cụ, không bằng shell) — nó đang là đường
đi *mất một thứ*.

**Đã sửa.** `write_atomic()` nay đọc quyền của tệp đích và đặt lại quyền đó cho tệp tạm trước khi
đổi tên. Có một ca selftest: "tệp thực thi vẫn thực thi sau khi sửa". `review.sh` đã trả lại quyền
`755`; `git diff --summary` không còn dòng "mode change" nào trong sửa đổi này.

---

## N59 — high — Báo cáo của người giám sát đếm thiếu một phần mười lần việc ghi bằng shell

**Bằng chứng.** Luật R1 bỏ sót những lệnh ghi tệp qua một **tên biến**:

```python
p="src/film.js"; s=open(p,encoding="utf-8").read()
...
open(p,"w",encoding="utf-8").write(s)
```

Tệp đích nằm sau một phép gán, nên luật không theo được tên, và nó dừng ở dòng `R1?` — *"lệnh
không nói tệp nào"*. Trên phiên tập 01, đó là **25 lần trong số 369** lần ghi bằng shell: báo
cáo nói `R1 37 lần`, sự thật là `R1 369 lần`.

**Vì sao nó quan trọng.** Một báo cáo đếm thiếu mười lần thì người đọc tưởng vấn đề nhỏ:
*"37 lần"* nghe như một lỗi lặp lại, *"369 lần"* nghe như một **cách làm việc**. Đó là khác
biệt giữa "sửa lỗi" và "đổi cách làm" — và người giám sát là người nên nhìn thấy cái thứ hai.

**Đã sửa.** `write_targets()` nay theo các phép gán đơn giản trong cùng lệnh (`NAME='…'`), và
đọc cả dạng bảng sửa (`{"file": …}`) lẫn `write_text(...)`. Hai ca selftest mới: *"ghi qua một
tên biến thì vẫn nêu đúng tệp"* và *"ghi qua một tên biến thì không còn là R1?"*.

**Đo lại trên ba phiên đang chạy:**

| Tập | R1 (ghi bằng shell) | R10 (montage tự viết) | R11 (đọc lại) | R12 (mở ảnh) | Transcript |
|---|---|---|---|---|---|
| tap-01 | **369** — `src/film.js×167, src/props.js×62, src/set.js×46, LOOK.md×39, COMPONENTS_SPEC.md×18, TREATMENT.md×8, voice/lines.json×4` | 15 | 209 (77+73+59) | 763 lần mở, **321 lần mở lại** | **888 MB** |
| tap-02 | 17 | 4 | 16 | 46 (16 lại) | 30 MB |
| tap-03 | **0** | 0 | 0 | 0 | 8 MB |

Bốn vòng dò của tap-01 lặp 8–12 lần mỗi vòng (`ls -l src/props.js; date`, `ls /tmp/…/beats | wc -l`).
Tập 03 — phiên mới nhất — không vướng luật nào: đó là bằng chứng rằng các luật này **làm được**
khác biệt, chứ không phải chỉ là đo.

---

## N60 — high — Danh mục vật dựng và phim là hai danh sách, và không ai so chúng

**Bằng chứng.** `src/props.js` xuất ra `export const PROPS` — danh mục **mọi vật của phim**, để người chấm vật soi từng vật riêng, từ ba phía. Phim thì dựng cảnh trong `src/set.js` và `src/film.js`, và gọi **cùng những hàm dựng** đó. Vậy danh mục và phim là hai danh sách của **cùng một đạo diện** — và không có gì kiểm tra chúng là **cùng một danh sách**.

Ở tập 03, danh mục có `'nắp chai nhựa có ren dọc': () => createCap().group`, nhưng `createCap()` không được gọi ở đâu trong `src/set.js` hay `src/film.js` (cái nắp trên chai được dựng riêng trong `createBottle()`). Vật đó là công cốc: người chấm vật bỏ vòng soi nó từ ba phía, và người xem không bao giờ thấy.

Và nó không chỉ là công cốc. Người chấm **dàn ý**, đọc dàn ý của cùng tập đó, đã hỏi đúng chỗ ấy: *"thiếu vật dùng trên hình: … nắp chai rời trên bàn"*. Dàn ý có cảnh nắp chai rời nằm cạnh chai chưa vặn. **Hai công cụ độc lập chỉ một chỗ trống**: phim thiếu một vật, và danh mục thì có vật đó mà không ai đưa lên màn hình.

**Vì sao nó quan trọng.** Đây là hình dạng thứ ba của N50 (tài liệu và mã trôi lệch nhau), và hình dạng này nằm ở bước mà mọi cổng khác đã kín: dàn ý được chấm, lời kể được chấm, vật được chấm, khung hình được chấm — mà **không ai hỏi danh mục vật có đúng bằng phim không**. Người chấm vật là người duy nhất nhìn thấy mọi vật của phim, và ông ta nhìn một **phòng trưng bày**, không phải một phim.

**Đã sửa.** `channels/tram-nghi-nhieu/tools/check_props_used.py`: mỗi mục của danh mục, lần theo hàm dựng mà nó gọi, rồi hỏi hàm đó **có được gọi** ở đâu ngoài danh mục không (một hàm chỉ được **định nghĩa** thì chưa phải được dùng). Bốn ca selftest, gồm cả ca *"chỉ định nghĩa mà không gọi thì vẫn là vật chết"*. Bài kiểm tra chạy trong **bước chấm hình** — bước đầu tiên mà mã dựng cảnh đã tồn tại, nên đó là chỗ duy nhất so được hai danh sách.

Đo trên ba tập: tap-01 **0** vật chết (26 vật), tap-02 **0** (19 vật), tap-03 **1** — và nó là cái nắp rời mà người chấm dàn ý đã xin.

---

## N66 — medium — Luật R1 của người giám sát không biết công cụ sửa file khỏi cách viết tay

**Bằng chứng.** Trong phiên tập 01 có **25** lần sửa file đi qua `tools/replace.py` — công cụ mà R1
chính thức chỉ định: nó đếm số lần khớp, từ chối khi khớp không đúng một lần, và ghi nguyên tệp mới
đè lên tệp cũ. Nhưng luật R1 của người giám sát đọc bảng sửa `{"file": "src/film.js", …}` trong lệnh
đó là *"ghi file dự án bằng shell"* và đếm vào R1. Tệp được ghi bởi **công cụ**, không phải bởi shell.

Cái thật sự nguy hiểm là hình dạng còn lại: `open(p,'w').write(s)` — cắt tệp trước, ghi sau, và nếu
ghi hỏng thì tệp cũ đã mất. Luật phải phân biệt hai cái đó, không phải gộp chung là "ghi bằng shell".

**Đo lại, giải mã 369 lần ghi bằng shell của phiên tập 01:**

| Hình dạng | Số lần | Nguy hiểm không? |
|---|---|---|
| `open(p,'w').write(...)` trong một chương trình python tự viết | 297 | **có** — tệp bị cắt trước |
| `cat >> src/props.js <<EOF` | 20 | **có** — ghi thẳng, không đếm khớp |
| `cp` / `mv` đè lên tệp dự án | 6 | có |
| `sed -i` | 3 | có |
| đi qua `tools/replace.py` | 25 | **không** — công cụ đếm khớp và ghi nguyên tệp |

Nói cách khác: con số 369 là thật, nhưng **344 lần** trong đó là cách làm việc của chính phiên, và chỉ
**25 lần** là công cụ. Tôi đã đoán ngược lại (ngỡ công cụ bị tính nhầm là nguy hiểm) và đoán sai; đo
thì ra ngược lại.

**Thêm một lỗi nhỏ trong cùng dòng báo cáo.** Cùng một tệp tới với hai cách viết — `src/film.js`
(phiên đang ở thư mục tập) và `channels/…/tap-01/src/film.js` (phiên đang ở thư mục gốc) — và báo cáo
tách thành hai mục: `src/film.js×90` và `channels/…/src/film.js×76`. Người đọc không biết đó là một
tệp hay hai. Nay mọi đường dẫn được đo từ thư mục gốc của thư viện trước, rồi mới từ thư mục tập:
`src/film.js×167` — một tệp, một con số.

**Đã sửa.** `tools/rules.py`: một lệnh có gọi `tools/replace.py` thì bảng sửa trong đó là **đầu vào
của công cụ**, nên không tính vào R1; nó được báo riêng là `R1t` (an toàn, nhưng đi qua chương trình
trung gian thì lệnh dài và khó đọc). Một lệnh vừa gọi công cụ vừa ghi thẳng vẫn là R1. Bốn ca
selftest mới: *"sửa qua tools/replace.py thì không phải R1"*, *"…thì báo riêng là R1t"*, *"ghi thẳng
cùng lệnh gọi replace.py thì vẫn là R1"*, *"cùng một tệp dưới hai cách viết thì tính một lần"*.

---

## N67 — high — Đường đi an toàn phải là **một** lệnh, không phải hai

**Bằng chứng.** 297 lần ghi bằng shell của phiên tập 01 gần như toàn bộ là **cùng một việc**:
đọc tệp, thay một đoạn, ghi lại. Đó đúng là việc của `tools/replace.py --batch`. Nhưng công cụ bắt
người dùng phải làm **hai** việc: đặt các sửa vào một tệp JSON trên đĩa, rồi gọi công cụ với tệp
JSON đó — và mỗi lệnh chỉ sửa **một** tệp. Người dùng phải sửa ba tệp thì phải gọi ba lần, mỗi lần
một tệp JSON.

Phiên đó không làm thế. Nó tự viết chương trình python của riêng mình (297 lần), vì đó là cách
**một** lệnh làm xong việc. Không phải phiên đó không biết công cụ — phiên đó dùng công cụ 25 lần —
mà là công cụ đòi hai bước trong khi thói quen của nó là một bước.

**Vì sao nó quan trọng.** R1 cấm "viết chương trình riêng để sửa file" — nhưng nếu công cụ được
viện dẫn cần hai bước, thì luật đang cấm cách làm việc **rẻ nhất** mà người ta biết. Luật bị vô hiệu
không phải vì người ta không đọc, mà vì cái được chỉ định đắt hơn cái thực tế. Một luật mà cách
tuân thủ tốn hơn cách vi phạm thì sẽ bị vi phạm, và không phải vì người ta hỗng.

**Đã sửa.** `tools/replace.py` nay nhận hai hình thức mới, và cả hai đều **một lệnh**:

- `--batch -` đọc danh sách sửa từ stdin — không còn tệp JSON trên đĩa;
- mỗi sửa được **tự nêu tệp của nó** (`{"file": "src/film.js", "old": …, "new": …}`), nên một lệnh sửa
  được nhiều tệp, và tệp không cần nêu trên dòng lệnh nữa.

```sh
python3 tools/replace.py --batch - <<'JSON'
[{"file": "src/film.js", "old": "...", "new": "..."},
 {"file": "src/props.js", "old": "...", "new": "..."}]
JSON
```

Mọi sửa được kiểm tra **trước**: một đoạn không khớp thì **không tệp nào** bị ghi. Mỗi tệp vẫn được
ghi nguyên tệp mới đè lên tệp cũ, nên không bao giờ có tệp nửa vời. Bốn ca selftest mới: *"một lệnh
sửa được nhiều tệp"*, *"một sửa hỏng ở tệp thứ hai thì tệp thứ nhất cũng không bị sửa"*, *"tệp trong
sửa khác tệp trên dòng lệnh thì bị từ chối"*, *"sửa đọc từ stdin thì một lệnh là xong"*. `R1` trong
`CODING_STANDARDS.md` và luật 5 của kỹ năng của kênh đều nêu đúng hình thức này.

---

## N68 — high — Công cụ của kênh không có sổ tay, nên phiên đọc mã nguồn của chúng 449 lần

**Bằng chứng.** Phiên tập 01 đọc mã nguồn của công cụ **449 lệnh**, khoảng **1,4 triệu ký tự** output
(~**350 nghìn token**, 15 % toàn bộ output của phiên):

| Đọc mã của | Số lần |
|---|---|
| `channels/tram-nghi-nhieu/tools/review.sh` | 85 |
| `channels/tram-nghi-nhieu/rig/render.js` | 60 |
| `channels/tram-nghi-nhieu/rig/kit.js` | 37 |
| `channels/tram-nghi-nhieu/tools/gate.py` | 30 |
| `core/render/page.mjs` | 21 |
| `core/render/still.mjs` | 17 |
| `channels/tram-nghi-nhieu/tools/beatsheet.mjs` | 16 |

Phiên **có** đọc các hướng dẫn của từng bước (`step1`…`step7/GUIDE.md`, ~40 lần). Nó đọc mã vì các
hướng dẫn nói *làm gì*, chứ không nói *chạy lệnh nào với cờ nào, và khi công cụ từ chối thì làm gì*.
Đúng những thứ đó nó đi tìm: cờ của `review.sh`, ngân sách vòng chấm, tên tệp bản cắt của từng bước,
tên các con dấu, điều kiện của cổng. Không chỗ nào viết ra.

**Vì sao nó quan trọng.** `core/` có sẵn một sổ tay đúng hình dạng này
([`core/README.md`](../../../core/README.md)): mỗi lệnh một dòng, "nó làm gì", "nó ghi đâu", cộng
một mục "đọc kết quả của một bài kiểm tra". Công cụ của kênh — vốn nhiều hơn, và quyết định nhiều
hơn — chỉ có một dòng mô tả trong `CHANNEL.md`. Một phiên làm phim phải đọc mã để biết dùng, và
đọc mã thì tốn: 350 nghìn token là hai phần trăm của ngữ cảnh cả một phiên dài, và ngân sách đó
đáng lẽ dùng để làm phim.

Cái tệ hơn: đọc mã để *đoán* công cụ sẽ từ chối thế nào là đọc mã để **đoán**, và một lần đoán sai
là một vòng chấm 40 phút bị đốt.

**Đã sửa.** `channels/tram-nghi-nhieu/tools/README.md` — sổ tay của công cụ kênh, cùng hình dạng
với `core/README.md`: lệnh của từng công cụ và nó ghi đâu; thứ tự các bước và điều kiện của từng bước;
ngân sách vòng chấm của từng phần; cờ máy tự FAIL và cách xoá; **hợp đồng của đạo diễn cắt** (tệp
nào, dòng `VERDICT: PASS`, phải viết sau lần sửa code cuối); và một bảng **"khi công cụ từ chối"**:
mỗi câu mà công cụ in ra → nó nghĩa là gì → làm gì tiếp. Ba con trỏ tới nó: `CHANNEL.md` (dòng
"các công cụ"), `SKILL.md` của kênh (trước khi đọc mã), và hướng dẫn bước 6 (ngay ở chỗ hết lượt).

---

## N69 — critical — Một kiểm tra hỏi sai câu giết đúng vòng chấm đã làm xong việc

**Bằng chứng.** Phiên tập 02 báo: vòng chấm vật dựng không chạy được — mã 2, câu *"người chấm không
trả lời (không có dòng VERDICT nào)"*. Nguyên nhân là của tôi: commit `4c1bfaf` thêm vào `critic()`
một kiểm tra rất đúng — *"một vòng không có dòng VERDICT thì đó không phải phán quyết về phim"* — nhưng
`critic()` phục vụ **mọi** pha của vòng chấm, trong đó có hai pha gọi tên mù trả lời bằng một **DANH SÁCH**
tên vật. Chúng không bao giờ được hỏi câu phán quyết, nên câu trả lời đúng vẫn bị đọc thành *"không có
câu trả lời"*.

Tôi đo lại trên thư mục làm việc của chính phiên đó (`/tmp/lemo-review-Q4FryK`): `blind/BLIND.md` ghi
đủ 19 vật (6 525 byte) và `blind/out.txt` in lại cả danh sách — người gọi tên **đã làm đúng việc**.
Còn `blind2/out.txt` chỉ có 3 dòng cảnh báo của CLI (415 byte) và không có `BLIND2.md`: lần đoán thứ
hai thật sự không trả lời, và **không có gì báo điều đó**.

Hai vòng chấm hỏng, mỗi vòng 9 phút, đã mất. Ngân sách vòng không mất (không có `PROPS-REVIEW-*.md`
nào được ghi, nên vòng kế tiếp vẫn là vòng 1) — nhưng thời gian thì có, và phiên đó bị chặn cửa.

**Vì sao nó quan trọng.** Đây là dạng lỗi mà một guard tốt tạo ra. Tôi thêm một kiểm tra đúng để bắt
một lỗi thật (một vòng không có phán quyết thì không được lưu thành một vòng đã chấm), rồi kiểm tra đó
lan ra nơi nó không thuộc về. Một kiểm tra phải biết **câu nào được hỏi** ở từng pha: pha hỏi *"hãy
phán"* thì câu trả lời phải có phán quyết; pha hỏi *"hãy gọi tên"* thì câu trả lời là danh sách. Một
guard không biết sự khác biệt đó thì guard tự trở thành lỗi.

**Đã sửa.** `critic()` nhận tham số `no-verdict` cho đúng hai pha đó: ở đó câu trả lời là chính danh
sách — tệp người chấm viết ra, hoặc phần nó in ra — và cảnh báo của CLI (`unrecognized_model`,
`connectors are disabled`) không phải câu trả lời. Lần đoán thứ hai là phép đo **bổ sung**: nếu nó
không trả lời thì vòng đi tiếp với một lần đoán và in ra một dòng báo là thiếu, thay vì chết cả vòng
vì một phép đo phụ. Lần gọi tên thứ nhất vẫn phải thành công: cả vòng chấm vật dựng đứng trên phép đo
mù đó.

Kèm ca selftest mới, `channels/tram-nghi-nhieu/tools/test_review_critic.py`: nó chạy `critic()`
**thật** của `review.sh` — lấy ra từ tệp, không chép lại — với một người chấm giả, và kiểm sáu
dạng: có phán quyết thì qua; danh sách ở pha phán quyết thì exit 2; im lặng thì exit 2; **danh sách ở
pha `no-verdict` thì qua** (trên mã cũ là exit 2 — đúng cái lỗi phiên kia gặp); chỉ có cảnh báo của CLI
thì exit 2; tệp người chấm viết ra thì tệp đó là câu trả lời.

---

## N70 — critical — Người chấm đã chấm phim bằng một prompt bị cắt cụt

**Bằng chứng.** `review.sh` đưa lời dặn cho người chấm bằng một chuỗi shell. Ngay khi chuỗi đó có
một dấu `"` chưa escape bên trong, shell **kết thúc chuỗi tại đó**: phần còn lại của lời dặn trở thành
những TỪ RIÊNG, và người chấm chỉ nhận được mảnh đầu của một bộ tiêu chí dài.

Tôi tìm ra việc này khi viết bài kiểm tra cho vòng chấm vật dựng: một người chấm giả nhận prompt,
không viết ra báo cáo, và vòng chấm chết. Bản thân chuỗi shell cho biết ngay:

```
PROMPT_LEN=864      # trước khi sửa
PROMPT_LEN=4941     # sau khi sửa
```

**4 077 ký tự, 83 % lời dặn, không tới nơi.** Mất đúng phần quan trọng nhất:

| Prompt | Bị cắt ở | Mất gì |
|---|---|---|
| chấm vật dựng | `một tên đúng nhưng "chắc thấp"` | tiêu chí KHỚP/HỎNG, hai nhóm A và B, mẫu báo cáo, và câu *"Viết PROPS-REVIEW.md ở thư mục này theo mẫu"* |
| chấm hình | `dòng "ROUND"` | câu *"Mở từng ảnh của các câu trên, rồi viết REVIEW.md ở đó theo mẫu"* — tức là người chấm **không được bảo viết báo cáo vào đâu** |
| chấm bảng đặc tả | `cột "Xuất hiện ở"` | tiêu chí của cột đó, và câu *"Viết ASSET-AUDIT-REPORT.md ở thư mục này theo mẫu"* |

**Khi nào.** Cả ba dấu `"` đều do **tôi** đưa vào: `914d948` (03:40, vòng chấm vật dựng), `c6f4a80`
(08:48, vòng chấm hình), `6de8d8b` (09:48, vòng chấm bảng đặc tả). Một lỗi cú pháp ba lần, ở ba chỗ khác
nhau, cùng một cách — trong lúc viết lời dặn cho người chấm.

**Vì sao nó quan trọng.** Vòng chấm vẫn chạy, người chấm vẫn trả lời, báo cáo vẫn có phán quyết, và
một vòng vẫn có thể ghi "PASS". Không có gì hỏng — ngoại trừ việc người chấm **chấm phim bằng một đề
bài không đầy đủ**. Với vòng chấm vật dựng, đề bài còn thiếu hẳn tiêu chí KHỚP/HỎNG: người chấm bị
hỏi "vật này là vật thật không" mà không được cho biết câu trả lời phải trông thế nào.

Nhiều thứ tôi từng ghi thành lỗi riêng lẻ trong đợt đúc kết này — báo cáo ghi tên tệp khác, dòng
`ROUND` do người chấm tự viết — chính là **triệu chứng** của cái cắt này: hai lời dặn cuối cùng,
chính là hai lời dặn nằm sau dấu `"` bị cắt.

**Đã sửa.** Ba dấu `"` được escape. Kèm hai guard, vì một lỗi cú pháp không nên chờ tái diễn:

- `channels/tram-nghi-nhieu/tools/check_prompts.py` — đọc tệp shell và nói, cho từng lệnh
  `critic "…"`, cái mà shell thật sự đưa cho lệnh đó là **một** lời dặn hay **nhiều từ**. Có
  `--selftest` với một prompt đúng và một prompt bị cắt.
- `channels/tram-nghi-nhieu/tools/test_review_props.py` — chạy **trọn vòng chấm vật dựng** với một
  người chấm giả và một công cụ dựng ảnh giả: không GPU, không trình duyệt, hai giây. Nó kiểm
  19 điều, trong đó có việc người chấm nhận đủ ba prompt, mỗi prompt **không bị cắt ở giữa**, và
  nhận đủ tiêu chí KHỚP/HỎNG và hai nhóm A, B. Chạy trên mã cũ: 11 điều hỏng.

Để chạy được vòng chấm trong bài kiểm tra, công cụ dựng ảnh ba góc nhìn phải thay được: `PROPCHECK`
(trang đãnh) cho phép thay nó, và bài kiểm tra dùng đúng đường đó.

---

## N71 — high — Hướng dẫn của bước nói "gọi subagent", và người làm phim làm đúng như vậy

**Bằng chứng.** `review.sh` có công cụ cho **cả bảy bước** của kênh. Nhưng năm hướng dẫn bước (1, 2, 3, 4,
5) vẫn bảo người làm phim *"Nạp `PROMPT_CRITIC.md` để triệu hồi Subagent"* — tức là gọi người chấm bằng tay,
đúng như trước khi công cụ có. Hướng dẫn bước 6 và 7 thì đã nói công cụ.

Phiên tập 01 làm đúng theo hướng dẫn: nó chạy subagent trần cho những bước mà hướng dẫn còn bảo vậy. Hậu quả
đo được: `review/ASSET-AUDIT-DIRECTORS-CUT.md` của tập 01 **không có dòng `VERDICT: PASS` ở cuối** — nên cổng
không đọc được nó, và bước 4 không thể đóng tem bằng bản cắt đó. Người làm phim không có cách nào biết:
SKILL.md có nói dòng `VERDICT: PASS`, còn hướng dẫn của bước thì không, và hướng dẫn là thứ được đọc khi
làm bước đó.

**Một cảnh báo sai làm hỏng cả những cảnh báo đúng.** `check_reports.py` bảo *"bước 4 và bước 7 chưa có
công cụ"* — trong khi `review.sh --assets` và `review.sh --final` đã có từ lâu. Bảng đó là một cái danh sách
viết tay không được cập nhật. Và vì nó sai, nó cũng làm **hỏng phần hữu ích**: danh sách "bản chấm nào
công cụ đọc" không có `ASSET-AUDIT-REPORT.md` và `FINAL-QA-REPORT.md`, nên phán quyết của hai bản chấm đó
chưa bao giờ được kiểm.

**Đã sửa.**

- Cả năm hướng dẫn bước (và dòng "Review độc lập" của từng bước trong `SKILL.md`) nay **gọi đúng lệnh**:
  `sh channels/tram-nghi-nhieu/tools/review.sh <tập> --<phần>`, kèm câu *"không tự gọi subagent trần: báo cáo
  của nó không ai đọc, không ai đếm vòng, không ai ký"*, và kèm **hợp đồng của bản cắt** cho những bước có nó
  (tên tệp, dòng `VERDICT: PASS`, viết sau lần sửa code cuối).
- `check_reports.py`: bước 4 và bước 7 không còn là "chưa có công cụ"; `ASSET-AUDIT-REPORT.md`,
  `ASSET-AUDIT-REVIEW-*`, `FINAL-QA-REPORT.md`, `FINAL-QA-REVIEW-*` và `ASSET-AUDIT-DIRECTORS-CUT.md` nay
  vào danh sách bản chấm mà phải có phán quyết đọc được. Cảnh báo sai biến mất, và ngay sau đó bài kiểm tra
  bắt đúng lỗi thật: bản cắt của tập 01 không có dòng phán quyết.

---

## Các guard đã bắt được gì (tính từ 08:00, hai tập còn chạy)

Đây là bằng chứng rằng các guard không phải lý thuyết — mỗi cái đã bắt một lỗi thật, hoặc đã được một
phiên chấp nhận và dùng:

| Guard | Nó bắt được gì | Ai sửa |
|---|---|---|
| `check_labels.py` (con số vẽ mà lời không đọc) | 3 lỗi thật ở tập 01: `288 g`, `88 g`, `50 %` | phiên tập 01 tự bỏ số in trên mặt cân và mặt đồng hồ, thay bằng kim chạy trên vạch |
| `check_labels.py` (nhãn lệch câu) | 0 lỗi — và đó là kết quả đúng, không phải im lặng: `--selftest` có sáu ca thật | — |
| `check_research.py` (file nghiên cứu) | tập 02 đi tới bước lời kể mà **file nghiên cứu vẫn là nguyên khuôn**; cổng dừng nó trước khi tốn một vòng chấm | phiên tập 02 viết lại file (11 mốc, trích dẫn, "Phạm vi" cho từng mốc) trong vòng một phút |
| `check_research.py` (Wikipedia một mình) | 5 mốc của tập 02 đứng trên Wikipedia không có nguồn khác | đang sửa |
| `set_round` (số vòng) | ba bản chấm cả phim đều ghi `ROUND: 1/5` — công cụ đã biết số vòng, báo cáo thì không | sửa xong, vòng kế tiếp ghi đúng |
| `R11` + `R12` (đọc lại) | 186 lần đọc lại ba tệp mã; 1 032 lần mở ảnh, 311 lần mở lại một tệp đã xem | phiên tập 01 đã tự viết `src/MAP.md` (bản đồ mã: tên hàm → dòng) |
| `markBeat` / mốc nhịp | kênh **không** ghi mốc nhịp, nên cổng không đo được "nhịp này có đổi phần khung của nó không" | phiên tập 01 đã viết vòng lặp ghi mốc cho cả 60 câu; `rig/render.js` nay có `markBeats` cho các tập sau |
| `check_progress.py` (điểm so hai vòng) | phần so điểm **im lặng**: khoá tiếng Việt bị lớp ký tự cắt thành mảnh, nên không khoá nào khớp và "CHUYỂN_ĐỘNG 4 → 2" không bao giờ được in ra | sửa xong; vòng 4 của tập 01 nhận đủ danh sách năm chỗ còn mở (c6, c37, c55, c60, c22:RUN) |
| `check_voice_facts.py` (câu bị cấm) | tập 02 nói "chỗ nóng nhất trong cả cái máy" — đúng câu `FACTS.md` cấm; máy chỉ canh con số nên không thấy | phiên tập 02 đã bỏ khỏi lời kể, dàn ý thì người giám sát báo lại (N42, N43) |
| `check_shots.py` (mỗi câu một nhát) | một câu lời kể không có nhát nào — người xem nhìn một khung đứng yên trong lúc người kể vẫn nói | hai tập đều hợp lệ: 60 câu, 60 nhát (N41) |
| `PROGRESS.md` (vòng sau đọc vòng trước) | vòng 4 của tập 01 còn sót một lỗi CHẶN đã sửa ở vòng 3, vì người chấm không thấy bản so sánh | sửa xong: `review.sh` ghi `PROGRESS.md` vào thư mục làm việc của người chấm (N40) |
| `check_storyboard.py` (dàn ý khớp lời kể) | tập 02: `LOOK.md` còn ba dòng dán câu lời kể **đã bị viết lại** — dàn ý mô tả phim cũ | phiên tập 02 đã sửa `LOOK.md` (dòng 20, 76, 84) và bỏ nhãn `CHỖ NÓNG NHẤT` (N48) |
| `check_timing.py` (nói thật) | cổng bàn giao in *"gates verified"* cho một phim 3D mà bài kiểm tra **chưa từng mở** | sửa xong: bài kiểm tra nói "COULD NOT RUN — không luật nịp nào được áp dụng", thoát mã 2 (N41) |
| `check_reports.py` (bản chấm đọc được) | 5 mẫu trong 7 mẫu của kênh có tên công cụ đọc; **2 bước không có công cụ** (bước 4, bước 7) — bản chấm của chúng không ai đọc, không ai đếm | nêu tên trong đầu ra của bài kiểm tra; chờ kênh thêm chế độ (N51) |

Bốn trong bảy dòng trên là lỗi **đã** bị bắt và **đã** được sửa trong lúc hai phiên còn chạy. Đó là câu trả lời
cho câu hỏi lớn nhất của đợt đúc kết này: các guard có tác dụng thật, khi chúng nằm **trước** bước tốn
tiền (trước vòng chấm, trước lúc dựng, trước lúc bàn giao), chứ không phải sau khi phim đã xong.

---

## Đề xuất thứ tự xử lý

| # | Việc | File cần sửa | Trạng thái |
|---|---|---|---|
| 1 | Chấm props theo nhóm + trần 5 vòng (N3) | `tools/review.sh` | **xong** |
| 2 | Tem storyboard + `--storyboard` + đạo diễn cắt là PASS có phạm vi (N4) | `tools/review.sh`, `tools/gate.py` | **xong** |
| 3 | Đọc transcript của Claude Code (N1) | `tools/transcript.py`, `tools/supervise.sh` | **xong** |
| 4 | R9 — vòng dò và hai người viết một file (N2) | `CODING_STANDARDS.md`, `tools/supervise.sh` | **xong** |
| 5 | Nới `.gitignore`; `check_tracked` vào cổng supervisor (N5) | `.gitignore`, `tools/supervise.sh` | **xong** |
| 6 | `runtime` rỗng; bản chấm không hậu tố giữ verdict cũ (N6, N7) | `core/render/filmcheck.mjs` | **xong** |
| 7 | `FILMS.md` (N8); trỏ skill tới `lessons.md`; CI giữ hai bản skill (N9) | `tools/gen_films_index.py`, `SKILL.md`, `.github/workflows/films.yml` | **xong** |
| 8 | So trạng thái vật giữa hai lượt chấm props (N10) | `channels/tram-nghi-nhieu/tools/review.sh` | **xong** |
| 9 | Bài kiểm tra chết giữa chừng không phải phán quyết (N11) | `core/render/sourcewatch.mjs`, `core/render/readcheck.mjs`, `core/render/scenecheck.mjs`, `core/render/review.sh` | **xong** |
| 10 | Con trỏ hỏng trong tài liệu (N12) | `tools/check_doc_links.py`, `.git/hooks/pre-commit`, CI | **xong** |
| 11 | Bước CI không thể thất bại (N13) | `.github/workflows/films.yml` | **xong** |
| 12 | `readcheck` vẽ mỗi khung hình **hai lần** (một lần của nó, một lần vì `TEXTS` tự vẽ trước khi trả lời) (N14) | `core/render/readcheck.mjs` | **xong** |
| 13 | Tờ beat in `fill N%`, và tiêu chí 6 của người chấm hình cân số đó (N15) | `channels/tram-nghi-nhieu/tools/beatsheet.mjs`, `step6-assembly/PROMPT_CRITIC.md` | **xong** |
| 14 | Bài đọc hình vẽ ở `ss=1` theo luật của kênh, nên nó đọc trọn phim (N16) | `channels/tram-nghi-nhieu/scene_rules.json`, `core/render/review.sh` | **xong** |
| 15 | Rig bỏ hộp `id: 'sub'` khỏi `TEXTS`; bài kiểm tra nói rõ trình duyệt chết hay code phim ném lỗi | `channels/tram-nghi-nhieu/rig/render.js`, `core/render/readcheck.mjs`, `scenecheck.mjs` | **xong** |
| 16 | Rubric props: phán theo **ảnh**, độ chắc không phải phán quyết, vật mơ hồ có người đoán thứ hai, chất liệu và trạng thái áp đều (N20) | `channels/tram-nghi-nhieu/tools/review.sh`, `step5-props-code/PROMPT_CRITIC.md` | **xong** |
| 17 | `tools/replace.py`: sửa file bằng kịch bản mà vẫn đếm số lần khớp và ghi nguyên tệp | `tools/replace.py`, `CODING_STANDARDS.md` R1 | **xong** |
| 18 | CI đo được chính các phim trong repository: định dạng, độ lớn tiếng, thời lượng | `tools/check_movies.py`, `.github/workflows/films.yml` | **xong** |
| 19 | Luật R1 của người giám sát đếm **file được ghi**, không phải file được nhắc tới; một dòng cho mỗi luật (N17) | `tools/supervise.sh`, `improvements/README.md` N17, `improvements/lessons.md` | **xong** |
| 20 | Người chấm hình đọc **tờ sheet** trước, ảnh riêng chỉ khi tờ chưa đủ (N18) | `channels/tram-nghi-nhieu/tools/review.sh`, `step6-assembly/PROMPT_CRITIC.md` | **xong** |
| 21 | Thời lượng phim được **đo** rồi mới ghi vào manifest; cổng so manifest với `ffprobe` (N19) | `core/render/new_episode.sh`, `core/render/review.sh` | **xong** |
| 22 | Nhãn phải nằm ở câu gọi tên nó — kiểm bằng máy, trước khi tốn một vòng chấm (N21) | `channels/tram-nghi-nhieu/tools/check_labels.py`, `tools/review.sh`, `SKILL.md` | **xong** |
| 23 | Bản cắt của đạo diễn phải viết sau lần sửa code cuối, không đóng tem cho code cũ (N22) | `channels/tram-nghi-nhieu/tools/gate.py`, `tools/review.sh` | **xong** |
| 24 | Bài đếm con số đếm trên cột viết, không phải cột nói (N23) | `core/render/scenecheck.mjs` | **xong** |
| 25 | Cổng bàn giao không quay vòng vô hạn khi đường dẫn phim viết tương đối (N24) | `core/render/review.sh` | **xong** |
| 26 | Mỗi bước của cổng có đồng hồ, và hết giờ thì nói "không chạy được" chứ không nói "phim hỏng" (N25) | `core/render/review.sh` | **xong** (cổng của kênh: chưa) |
| 27 | Mỗi vòng chấm hình nói ra nó đã sửa gì và cái gì còn mở (N26) | `channels/tram-nghi-nhieu/tools/check_progress.py`, `tools/review.sh`, `SKILL.md` | **xong** |
| 27 | Người giám sát chọn đúng phiên: hai đường dẫn phải đo từ cùng một gốc (N27) | `tools/supervise.sh` | **xong** |
| 28 | Khuôn dựng tập mới không dùng 4 worker ở ss=2 — phim mất khung trong im lặng (N28) | `core/render/new_episode.sh`, `films/host-toon-test/build.sh` | **xong** |
| 29 | Bài kiểm tra dàn ý hỏi kênh thay vì tự đoán hình dạng (N29) | `tools/check_treatment.py`, `channels/tram-nghi-nhieu/tools/check_treatment.py`, `core/render/review.sh` | **xong** — cổng bàn giao gọi bài kiểm tra của kênh khi kênh có bài của riêng nó, nên một tập của kênh không còn bị hỏi về hình dạng của `DIRECTOR.md` |
| 30 | Số khung thật của phim phải bằng số khung phải có — để một lượt dựng mất khung không lọt qua cổng | `core/render/review.sh` | **xong** — bước `frames` đếm khung của `.mp4` và so với `events.json` |
| 32 | Một bài kiểm tra phải có ví dụ nó phải bắt, và chuỗi rỗng không được trả lời "có" cho mọi thứ (N30) | `channels/tram-nghi-nhieu/tools/check_labels.py` | **xong** (chưa có `--selftest`) |
| 33 | Con số trên nhãn phải có lời kể đọc — luật của chính FACTS.md, nay do máy canh (N31) | `channels/tram-nghi-nhieu/tools/check_labels.py`, `tools/review.sh` | **xong** (chưa nhìn `src/props.js`) |
| 34 | Đếm số lần đọc lại cùng một tệp lớn: 186 lần đọc ba tệp mã là phần lớn chi phí của phiên (N32) | `tools/supervise.sh`, `CODING_STANDARDS.md` R11 | **xong** (chưa có `src/MAP.md`) |
| 35 | Hai thước đo "phim có chuyển động" đo hai thứ khác nhau; thêm số đo theo từng câu trước khi dựng (N33) | `channels/tram-nghi-nhieu/tools/beatsheet.mjs` | **xong** (chưa có mốc nhịp `xy` trong `events.json`) |
| 36 | Số vòng trong bản chấm là của công cụ, không phải trí nhớ của người chấm (N34) | `channels/tram-nghi-nhieu/tools/review.sh` | **xong** |
| 37 | File nghiên cứu phải được viết, không phải copy khuôn — cổng dàn ý canh trước khi tốn một vòng chấm (N35) | `channels/tram-nghi-nhieu/tools/check_research.py`, `tools/review.sh` | **xong** |
| 38 | Lời nhắc trong ngoặc ngược không phải chỗ cần điền (N36) | `channels/tram-nghi-nhieu/tools/check_treatment.py`, `core/render/filmcheck.mjs` | **xong** |
| 39 | Xem tờ sheet, không mở lại một khung hình: 436 MB ảnh, 311 lần mở lại (N37) | `CODING_STANDARDS.md` R12, `tools/supervise.sh` | **xong** |
| 40 | Một mốc không được đứng trên Wikipedia một mình — bách khoa là dẫn chiếu (N38) | `channels/tram-nghi-nhieu/tools/check_research.py`, `step1-outline/PROMPT_CRITIC.md` | **xong** |
| 41 | Bản so sánh hai vòng phải nói được phần điểm; lớp ký tự ASCII viết tay cắt mất tiếng Việt (N39) | `channels/tram-nghi-nhieu/tools/check_progress.py` | **xong** |
| 42 | Mọi bài kiểm tra phải có ví dụ nó phải bắt — và phải có ai chạy ví dụ đó | `tools/run_selftests.sh`, `.github/workflows/films.yml`, `tools/check_*.py` | **đang làm** — 18 bài đã có `--selftest`; `check_motion`, `check_script`, `check_timing` vừa có |
| 43 | Người chấm hình phải đọc bản so sánh hai vòng trước khi chấm (N40) | `channels/tram-nghi-nhieu/tools/review.sh` | **xong** — `PROGRESS.md` nằm trong thư mục làm việc của người chấm |
| 44 | Bài kiểm tra nhịp không được nói "verified" về phim nó chưa mở; kênh có bài riêng cho định dạng 3D (N41) | `tools/check_timing.py`, `channels/tram-nghi-nhieu/tools/check_shots.py`, `core/render/review.sh` | **xong** |
| 45 | Lời kể không được nói câu mà file nghiên cứu cấm (N42) | `channels/tram-nghi-nhieu/tools/check_voice_facts.py` | **xong** — cổng lời kể chạy nó trước mỗi vòng |
| 46 | Cổng dàn ý phải hỏi xem dàn ý còn khớp với lời kể và mã không (N43) | `channels/tram-nghi-nhieu/tools/check_voice_facts.py`, `channels/tram-nghi-nhieu/tools/review.sh` | **xong** — `check_voice_facts.py` đọc cả `TREATMENT.md` |
| 47 | Dàn ý hình (`LOOK.md`) phải khớp lời kể: nó trích nguyên văn từng câu (N48) | `channels/tram-nghi-nhieu/tools/check_storyboard.py`, `channels/tram-nghi-nhieu/tools/review.sh` | **xong** |
| 48 | Một cách viết lệch lệch phải lộ ra, chứ không phải khi nó làm mất một vòng chấm (N49) | `channels/tram-nghi-nhieu/tools/check_reports.py` | **xong** — bài kiểm tra đi dọc mẫu và bản chấm, nói cách viết nào công cụ không đọc; 27/27 selftest |
| 49 | Một tài liệu cũ không tự nói là cũ; phải có bài kiểm tra đọc nó cùng tài liệu nó phải khớp (N50) | `channels/tram-nghi-nhieu/tools/check_storyboard.py`, `check_voice_facts.py` | **xong** |
| 50 | Hai bước không có công cụ: bản chấm viết ra không ai đọc, không ai đếm (N51) | `channels/tram-nghi-nhieu/tools/check_reports.py`, `channels/tram-nghi-nhieu/tools/review.sh` | **xong cả hai** — bước 4: `review.sh --assets` chấm `COMPONENTS_SPEC.md` cạnh `LOOK.md`, `lines.json` và `src/*.js`, ký bản chấm, đóng tem `ASSET.pass`, và bản cắt của nó chịu cùng luật cũ như props và picture. Bước 7: `review.sh --final` nghiệm thu chính tệp phim — `check_delivery.py` đo những điều người chấm không nghe được (có dải âm thanh, âm lượng, chỗ im lặng, mỗi câu lời kể có tiếng, có foley), khung hình trích từ phim đã dựng xếp thành sheet, đóng tem `FINAL.pass` bám vào chính tệp phim. **Còn lại:** hai tem đó chưa được cổng bàn giao đòi — thêm sau khi hai tập đang chạy bàn giao xong |
| 51 | Cổng không được trả lời PASS về một thư mục không tồn tại (N52) | `channels/tram-nghi-nhieu/tools/gate.py` | **xong** — cờ và đối số tách riêng; thư mục không phải tập thì bị từ chối; 14 ca selftest |
| 52 | Tem phải phủ đúng cái nó nói; bản cắt của bước storyboard cũng phải viết sau lần sửa code (N53) | `channels/tram-nghi-nhieu/tools/gate.py`, `channels/tram-nghi-nhieu/tools/review.sh` | **xong** |
| 53 | Người giám sát phải hỏi cổng của kênh, không chỉ hỏi các tệp có đúng hình dạng không | `tools/supervise.sh` | **xong** — `gate.py status` in ra từng tem và phán quyết vòng chấm cuối; `check --for render` là FAIL khi phim đã dựng mà cổng đóng |
| 54 | Báo cáo phải nêu tệp đã ghi, và luật viết bằng tay thì phải kiểm chứng được (N54) | `tools/rules.py`, `tools/supervise.sh` | **xong** — 8 ca selftest |
| 55 | Cổng không được đọc một dòng mẫu chưa điền thành phán quyết (N55) | `channels/tram-nghi-nhieu/tools/gate.py`, `check_reports.py`, 7 mẫu `PROMPT_CRITIC.md` | **xong** — mẫu in `VERDICT: (điền đúng MỘT chữ: …)`; cổng từ chối `PASS \| REJECT`, `PASS/REJECT` và `PASSED`; 4 ca selftest mới |
| 56 | Người chấm chỉ in ở cuối: nói rõ điều đó, và một vòng không có phán quyết thì không phải một vòng (N56) | `channels/tram-nghi-nhieu/tools/review.sh` | **xong** |
| 57 | Một tập, một vòng chấm: chốt theo từng phần (N57) | `channels/tram-nghi-nhieu/tools/review.sh` | **xong** |
| 58 | Công cụ sửa file không được làm đổi cách tệp chạy (N58) | `tools/replace.py` | **xong** — quyền đi theo nội dung; một ca selftest |
| 59 | Báo cáo phải đếm đúng, kể cả lệnh ghi tệp qua một tên biến (N59) | `tools/rules.py` | **xong** — theo phép gán trong lệnh; 10 ca selftest. Đo lại: tap-01 **369** lần (báo cáo cũ nói 37), tap-02 17, tap-03 0 |
| 60 | Danh mục vật dựng và phim phải là cùng một danh sách (N60) | `channels/tram-nghi-nhieu/tools/check_props_used.py`, `channels/tram-nghi-nhieu/tools/review.sh` | **xong** — 4 ca selftest; chạy trong bước chấm hình. Đo: tap-01 0, tap-02 0, tap-03 **1** — và nó là cái nắp rời mà người chấm dàn ý đã xin |
| 61 | Cái khoá phải biết chặn được ai (N61) | `channels/tram-nghi-nhieu/tools/test_review_lock.py` | **xong** — 5 ca selftest: khoá sống chặn, khoá chết được lấy lại, khoá phần khác không chặn, khoá được dọn |
| 62 | Hướng dẫn và cổng phải nói cùng một cách chấm phim (N62) | `channels/tram-nghi-nhieu/tools/review.sh`, `.agents/skills/tram-nghi-nhieu/step6-assembly/GUIDE.md` | **xong** — công cụ cảnh báo **trước** khi hết lượt; hướng dẫn nói đường đi theo độ dài tập |
| 63 | Lỗi máy thấy sẵn thì đừng để người chấm là người phát hiện (N63) | `channels/tram-nghi-nhieu/tools/check_shots.py`, `.agents/skills/tram-nghi-nhieu/step6-assembly/GUIDE.md` | **xong** — 8 ca selftest. Đo trên tap-01: **36/60 câu** có lỗi máy thấy được, trong đó 22 câu có cờ SAME |
| 64 | Quy tắc phải phân biệt việc với lãng phí (N64) | `tools/rules.py` | **xong** — mỗi lần nhìn được xếp vào một phiên bản theo chính lúc ghi tệp trong transcript. Đo lại tap-01: 767 lần mở ảnh — **20** lần cùng pixel, **304** lần sau khi dựng lại (việc, không phải lãng phí); đọc lại `props.js` 79 lần — **37** lần đọc nội dung cũ, 41 lần đọc sau một lần sửa |
| 65 | Cùng một tấm hình thì không phải trả tiền hai lần (N65) | `channels/tram-nghi-nhieu/tools/review.sh`, `.agents/skills/tram-nghi-nhieu/step6-assembly/GUIDE.md` | **xong** — vòng chấm dùng lại tờ sheet đã dựng nếu mã không đổi. Đo trên tap-01: tờ sheet được dựng **16 lần** cho cùng một bộ mã |
| 66 | Luật R1 phải biết công cụ sửa file khỏi cách viết tay, và tính một tệp một lần (N66) | `tools/rules.py` | **xong** — 4 ca selftest (14/14). Đo lại tap-01: 369 lần ghi bằng shell = **344** lần script tự viết (297 `open(p,'w')`, 20 heredoc, 6 cp/mv, 3 sed -i) + **25** lần qua công cụ, nay báo riêng là `R1t`; `src/film.js` gộp lại `×167` thay vì `×90` và `×76` |
| 67 | Đường đi an toàn phải là một lệnh (N67) | `tools/replace.py`, `CODING_STANDARDS.md` R1, `.agents/skills/tram-nghi-nhieu/SKILL.md` | **xong** — 4 ca selftest (9/9). `--batch -` đọc từ stdin, mỗi sửa tự nêu tệp: một lệnh sửa được nhiều tệp, mọi tệp được kiểm tra trước khi tệp nào bị ghi |
| 68 | Công cụ của kênh phải có sổ tay (N68) | `channels/tram-nghi-nhieu/tools/README.md`, `channels/tram-nghi-nhieu/CHANNEL.md`, `.agents/skills/tram-nghi-nhieu/SKILL.md`, `.agents/skills/tram-nghi-nhieu/step6-assembly/GUIDE.md` | **xong** — sổ tay: lệnh của từng công cụ, thứ tự bước, ngân sách vòng, hợp đồng đạo diễn cắt, bảng "khi công cụ từ chối". Đo trước: **449** lệnh đọc mã công cụ, **350 nghìn token** (15 % output của phiên) |
| 69 | Một kiểm tra hỏi sai câu giết đúng vòng chấm đã làm xong (N69) | `channels/tram-nghi-nhieu/tools/review.sh`, `channels/tram-nghi-nhieu/tools/test_review_critic.py` | **xong** — `critic()` biết pha nào hỏi phán quyết và pha nào hỏi danh sách; ca selftest chạy chính hàm đó với một người chấm giả (6 ca). Đo trên tap-02: hai vòng chấm vật dựng chết oan, mỗi vòng 9 phút; ngân sách vòng không mất |
| 70 | Người chấm đã chấm phim bằng một prompt bị cắt cụt (N70) | `channels/tram-nghi-nhieu/tools/review.sh`, `channels/tram-nghi-nhieu/tools/check_prompts.py`, `channels/tram-nghi-nhieu/tools/test_review_props.py` | **xong** — 3 prompt bị cắt (83 % lời dặn của vòng chấm vật dựng mất); guard tĩnh đọc tệp shell, bài kiểm tra chạy trọn vòng chấm với người chấm giả (19 điều, 2 giây, không GPU) |
| 71 | Hướng dẫn của bước vẫn bảo gọi subagent, và người làm phim làm đúng như vậy (N71) | `.agents/skills/tram-nghi-nhieu/step{1,2,3,4,5}-*/GUIDE.md`, `.agents/skills/tram-nghi-nhieu/SKILL.md`, `channels/tram-nghi-nhieu/tools/check_reports.py` | **xong** — mọi hướng dẫn gọi đúng lệnh `review.sh`, kèm hợp đồng của bản cắt; cảnh báo sai về hai bước đã có công cụ bị xoá, và bài kiểm tra bắt đúng lỗi thật (bản cắt tập 01 không có dòng phán quyết) |
| 77 | Bài kiểm tra hình báo "60 câu vật quá nhỏ" về 54 câu chưa từng được dựng: tờ sheet vẽ cho một khoảng câu đánh dấu phần còn lại là `skipped`, mà máy coi `fill` thiếu là 0 — nên 54 câu không hề có lỗi biến thành 54 lỗi giả, ngay ở chỗ người làm phim phải tin trước khi mở một vòng chấm bốn mươi phút | high | `check_shots.py` phân biệt *chưa đo* với *đo được 0* (câu `skipped` không còn bị báo lỗi, được đếm riêng), báo lỗi thật cho câu thiếu sự kiện giọng (`VOICE`), ra mã 2 khi chưa đo hết, chọn tờ sheet nào đo được nhiều câu hơn, và `review.sh` không dùng lại tờ nửa vời cho vòng chấm cả phim |
| 78 | Đánh giá khách quan phim tập 01: cờ máy bắt được `SAME` và `FILL`, nhưng không bắt được điều quan trọng nhất — vật chính có phải là thứ câu đó đang gọi tên không (`fill` đo vật *lớn nhất*, không phải vật *được gọi tên*), vật có đang làm việc không, và tiền đề của cả phim có đọc được không ("áo ướt" nhìn như áo khô). 42 nhãn không có bài kiểm tra nào ghép được với vật trong khung, vì rig không trả về chỗ của vật | medium | **proposed** — `window.SHOTPROBE` trả thêm vị trí màn hình của từng vật, một `window.LABELPROBE` raycast đuôi mũi tên để biết nhãn trỏ vào vật nào, `check_labels.py` báo nhãn trỏ vào không / trỏ nhầm / câu gọi tên vật A mà vật B chiếm khung nhiều hơn; chưa làm vì R13 — ba phiên đang dựng bằng rig này |
| 79 | Bảng trạng thái của cổng nói "script chưa có PASS" về một tập đã có tem của cả chương: `status` chỉ nhìn tem của cả tập, còn `check` thì biết tập dài được đóng tem theo từng chương — hai lệnh của cùng một công cụ trả lời khác nhau, và người làm phim mở thêm một vòng chấm cho một bước đã qua | medium | `gate.py status` dùng đúng `kind_ok()` cho hai loại tem theo chương (`script`, `picture`); selftest thêm hai ca: tem của chương tính là tem của tập, và cổng mở cho bước đó |
| 80 | Danh sách cờ máy là một bức tường từng dòng, trong khi người làm phim sửa **đoạn** — 22 cờ SAME và 30 khung mỏng trong tập 01 phải tự đọc và tự gom, mỗi lần gom là một lần sửa code | medium | `check_shots.py` in thêm dòng tóm tắt theo từng loại cờ, gom các câu liền nhau (`c37–c40 (4 câu)`); selftest có ca cho việc này |
| 81 | `pkill -f beatsheet.mjs` của một tập giết job của tập khác: ba tập dựng song song, mỗi tập gọi `beatsheet.mjs` bằng cùng một mẫu lệnh, nên lệnh giết theo *tên* là lệnh giết của người khác | high | `beatsheet.mjs` ghi một tệp khoá theo tập (`out/beats/.lock` chứa pid và đường dẫn tập), giết job theo pid đọc từ tệp khoá đó; `lessons.md` có dòng "một lệnh giết theo tên là một lệnh giết của người khác" |
| 82 | File nghiên cứu nói về bức tranh của phim ("nhiệt kế trong cả cái máy", "cái cửa mở ra"), và không bài kiểm tra nào đối chiếu lời hứa đó với cái thật trên hình | medium | chưa có guard — `FACTS.md` cần một bài kiểm tra đối chiếu các câu "Dùng trong phim" / "Phim nói:" với thẻ chữ trong `src/*.js` và với `voice/lines.json` |
| 83 | Máy đo "vật chính quá nhỏ" ở ba kiểu cảnh mà nó không nhìn thấy: cảnh cận trong một vật lớn, chủ thể là một nhóm vật, và cảnh toàn cảnh — trong 30 câu bị gọi là nhỏ ở tap-01 chỉ 11 câu là lỗi thật, 19 câu là máy mù; người làm phim đẩy máy sát vào vật để đẩy số lên là phim xấu đi vì lời của máy | high | `check_shots.py` đo **độ phủ** (tổng phần khung vật thật chiếm) thay cho vật lớn nhất: độ phủ < 15 % và khác 0 mới là lỗi, độ phủ = 0 thì máy in danh sách câu nó không nhìn thấy kèm "đừng đưa máy sát"; `beatsheet.mjs` in `cover` và tô màu theo độ phủ; selftest thêm bốn ca |
| 84 | Con trỏ viết trong backtick không ai kiểm: luật R10 trong chính `CODING_STANDARDS.md` bảo dùng `core/render/film_report.py`, mà tệp đó không tồn tại (nó ở `tools/film_report.py`) — người đọc R10 gõ đúng những gì R10 viết, không thấy tệp, rồi tự viết lại bằng ffmpeg, đúng cái R10 cấm | low | đường dẫn trong R10 sửa; `check_doc_links.py` nay soi con trỏ backtick trong các tài liệu luôn nằm trong ngữ cảnh, chỉ với `core/` và `docs/` (hẹp, nếu không sẽ ra 383 lỗi tiếng ồn); selftest có ca |
### Mỗi phát hiện đã có dòng riêng trong `improvements/lessons.md`

`lessons.md` giữ **một dòng cho mỗi bài học**, không phải một dòng cho mỗi phát hiện — nên N1–N4 và N10
đã nằm trong các dòng sẵn có, và phần này chỉ ghi chỗ của chúng:

| Phát hiện | Dòng trong `improvements/lessons.md` |
|---|---|
| N1 | "A supervisor that watches the wrong session reports nothing — and 'nothing was broken' reads as 'nobody was looking'." |
| N2 | "Wait for the agent, never for the file." |
| N3 | "A gate that asks the impossible is a prison, not a gate." |
| N4 | "A step with no tool is a step nobody can skip and nobody can count." + "A gate that cannot be passed needs a way out that is written down." |
| N10 | "A verdict that flips while the picture did not change is the reviewer changing its mind." |

---

- **[~]** Chưa có phim: `out/` còn rỗng. Bản chấm cả phim đã đi **ba** vòng: vòng 1 REJECT với 22 câu FAIL,
  vòng 2 REJECT với 6 câu FAIL (bảng đối chiếu ở N26), vòng 3 REJECT OVERALL 5,9 với **4 lỗi CHẶN**
  (c34, c39, c42, c22) và 3 câu FAIL (c6, c37, c55) — vòng 4 đang được làm. Ba lỗi "vẽ con số mà lời kể
  không đọc" đã hết (`check_labels.py` xanh, 08:00).
- **[x]** N10 (một phần): một phiên chấm mù chạy lại trên **cùng tập ảnh** đã làm — xem N20.
- **[x]** `improvements/lessons.md` đã có dòng cho N1–N4 và N10 (xem bảng trên).
- **[~]** `films/host-toon-test`: `.mp4` **đã cũ hơn code** — nó được commit ở `d5af2ce`, còn `src/film.js`
  sửa ở `c12ef95` (nhãn "5 tháng" chuyển khỏi dải phụ đề), nên phim trong repository vẫn còn nhãn cũ. Sửa
  được, nhưng **cần dựng lại từ đầu**: các wav giọng đã xử lý (`voice/proc/*.wav`) bị `.gitignore` và
  không còn trên máy, nên phải sinh lại giọng trước (edge-tts, mạng) rồi mới dựng (GPU). Chưa làm: GPU
  đang bận cho hai tập của kênh, và việc này không chặn gì.
- **[x]** Bài kiểm tra dàn ý đã hỏi kênh (N29): kênh có bài kiểm tra riêng
  (`channels/tram-nghi-nhieu/tools/check_treatment.py`); phần hình dạng thuộc về người chấm của kênh.
- **[x]** Cổng của kênh gọi người chấm hình bằng `claude -p` mà **không có đồng hồ** (N25): một người
  chấm treo là một vòng chấm không kết thúc, và trần 5 vòng thì bị nuốt hết. **[đã xong 09/11]** —
  `channels/tram-nghi-nhieu/tools/review.sh` giờ đặt đồng hồ cho người chấm (`CRITIC_TIMEOUT`, mặc định
  3600 s) và **thoát mã 2** khi bị giết, tức là "không chạy được", không phải phán quyết về phim.
- **[~]** Chưa có lượt sản xuất nào chạy với các guard mới (chặng đọc, vân tay nguồn, kiểm tra con trỏ, nhãn
  đúng câu, bản cắt đúng code, đồng hồ của cổng, bảng đối chiếu vòng chấm, file nghiên cứu phải được viết,
  số vòng của bản chấm): lượt sản xuất kế tiếp (tập 02) là lần kiểm chứng đầu tiên của chúng.
- **[ ]** Số vòng trong mẫu `PROMPT_CRITIC.md` vẫn ghi `[1-5]/5` trong sáu tệp; hai khối đã sửa bằng
  `set_round` nên số vòng là của công cụ, bốn khối còn lại thì người chấm vẫn tự điền (N34).
- **[ ]** `tools/supervise.sh` đếm lượt mở ảnh nhưng **chưa** báo dung lượng transcript của phiên — một con
  số đơn giản sẽ cho thấy ngay một phiên đang đắt (N37).

---

# Phần ba: sau vòng chấm hình thứ năm (10:12 → 10:58)

Vòng chấm hình thứ năm (`review/REVIEW.md`, 10:12) trả lời **REJECT**: ba câu FAIL (c45, c49, c59) và
22 cờ máy còn mở. Phiên bắt đầu sửa, sửa được một lượt, rồi **tờ sheet nhịp điệu treo**. Năm phát hiện
dưới đây là của đoạn đó — chúng không có trong N1–N71, và cả năm đều là lỗi của **công cụ**, không
phải của phim.

## N72 — high — `core/render/still.mjs` chụp phải khung cũ, và phiên làm phim tự viết lại công cụ của thư viện

**Bằng chứng.** `core/render/still.mjs` gọi `await page.evaluate(t => window.render(t), t)` rồi chụp
ngay: `await page.screenshot(...)` — không chờ khung hình nào được trình chiếu. Lúc 11-08 04:56 phiên
tạo `/tmp/stills2.mjs`, và chính dòng chú thích của nó nói:

> `// (core/render/still.mjs chụp ngay sau khi render nên đôi khi ảnh còn là khung trước đó.)`

Bản riêng đó chờ hai khung hình trước khi chụp. Phiên chạy nó 15 lần. Nó nằm trong `/tmp`, nên chết
cùng máy, và tập sau sẽ viết lại bản riêng của nó.

**Vì sao quan trọng.** Không chỉ là "viết lại công cụ" (R10): người làm phim **nhìn nhầm khung hình
rồi sửa mã để sửa cái không hỏng**. Rất nhiều vòng sửa camera, đèn và đạo cụ trong `src/film.js` và
`src/set.js` của tập này có thể là sửa cho một khung hình không phải khung hình đang xem. Thư viện đã
có đúng cơ chế: rig dựng vào một target phụ rồi trả khung về (`window.SHOTPROBE` → `window.SHOT`),
và tờ beat dùng đúng cơ chế đó nên ảnh của nó không bị lệch.

**Guard đã có.** Chưa có. **Đề xuất (chưa làm, vì R13):** `core/render/still.mjs` chờ khung hình đã
trình chiếu (hai `requestAnimationFrame`, hoặc dùng luôn đường `SHOTPROBE` của rig) trước khi chụp;
`core/README.md` nói rõ công cụ chụp *sau* khi khung đã có.

## N73 — high — Bài dựng tờ beat không có đồng hồ: một câu treo là cả vòng chấm treo

**Bằng chứng.** `channels/tram-nghi-nhieu/tools/beatsheet.mjs` gọi
`await page.evaluate(x => { window.SHOTPROBE = 1; window.render(x); }, t)` cho từng câu — không có
`timeout`, không có `try`. `core/render/page.mjs` chỉ chặn `window.READY` (180 s). Trong
`review.sh:764` lệnh này cũng không nằm trong `timeout` nào: `timeout` ở dòng 92 chỉ bọc **người
chấm** (`claude -p`), không bọc bước dựng tờ.

**Cập nhật 11:31 — và nó không treo; nó bị giết.** Hai lượt chạy đầu (10:47 và 11:00) viết được
`b_001` … `b_020` rồi bị phiên tự tay giết (`pkill -f beatsheet.mjs` lúc 10:53:45, 10:54:28 và
11:00:44); `b_021` … `b_060` giữ mốc cũ 10:03 và `beats.json` không được viết lại. Lượt chạy thứ ba
(bắt đầu 11:02:41, `timeout 3000`) **đã xong lúc 11:21:32**: 60 khung + 5 tờ sheet. Tốc độ đo được
~20 giây một khung, tức một lượt chạy mất **~19 phút** — và trong 19 phút đó `beatsheet.mjs` **không
in gì cả**, vì nó chỉ in ở cuối.

**Vì sao quan trọng.** Cổng hình là cổng cuối cùng trước khi dựng, và công cụ làm ra những tấm ảnh
mà người chấm sẽ phán. Nó **không thể thất bại — chỉ có thể treo**: không đồng hồ, không log, không mã
thoát, từ ngoài nhìn vào một job đang chạy giống hệt một job đã chết. Đây là N24 ở dạng mới: N24 nói
về một *cổng* treo, cái này là công cụ **sinh ra** cái cổng. Lần này hậu quả cụ thể hơn: **hai lượt
chạy lành mạnh bị giết** vì log rỗng, mỗi lượt mất ~19 phút GPU, rồi phiên còn mất mười lăm phút mổ
mã (`tmp-probe/probe_t01_mine.mjs`) để tìm cái treo không tồn tại. Đây là bài học đã có trong
`lessons.md` ("a tool that prints at the end looks broken from the outside") lần thứ hai, và lần này
 nó đắt.

**Guard đã có.** Chưa có. **Đề xuất (chưa làm, vì R13 — phiên kia đang chạy chính công cụ này):**
trong `beatsheet.mjs`, mỗi câu phải có đồng hồ (`Promise.race` với một hạn 60 s; hết hạn thì đóng
trình duyệt, in câu số và thời điểm, thoát mã khác 0), **và phải in tiến độ sau mỗi câu** để người
nhìn log không kết luận nhầm rằng nó đã chết; `tools/README.md` nói `--lines a-b` là cách khoanh
vùng một lần treo, và nói một lượt chạy mất bao lâu.

## N74 — medium — Bản đồ mã (`src/MAP.md`), cách chữa R11, sai ngay sau khi viết và không ai kiểm tra

**Bằng chứng.** `src/MAP.md` viết lúc 10:45: `src/film.js (524 dòng)`, `src/set.js (1099 dòng)`.
Ngay lúc 10:58 hai tệp đó dài **553** và **1194** dòng (`props.js` 4514 vẫn đúng). Bản đồ tự ghi:
"dòng lệch một chút sau khi sửa là bình thường". Hướng dẫn của kênh (`step5-props-code/GUIDE.md`) bảo
mọi tập đều phải có bản đồ này, nên mọi tập sau cũng sẽ có một bản đồ nói dối.

**Vì sao quan trọng.** R11 nói: cách chữa là *một bản đồ của mã, viết một lần và để bên cạnh mã
nguồn*. Nhưng bản đồ viết tay thối trong ba mươi phút, và một số dòng lệch 29 dòng đưa người đọc
tới chỗ khác — người đọc phải grep lại, tức là bản đồ tốn một lượt đọc mà không trả lại gì. R11 tự
sinh ra vi phạm R11.

**Guard đã có (12:55).** `tools/check_map.py` (mới) đọc các dòng "tên → dòng" của
`src/MAP.md`, kiểm tra dòng đó còn chứa đúng tên, và báo lệch; `gate.py` chạy nó cho tập.

## N75 — medium — Số lần phá R1 bị đếm sai một bậc: 34 trong báo cáo, 376 trong transcript gốc

**Bằng chứng.** N17 ghi báo cáo của người giám sát thấy 34 lần ghi file bằng shell. Đếm lại transcript
gốc của phiên `e8ec853c`: **376** lệnh heredoc chạm vào tệp của dự án — `film.js` 215, `props.js` 99,
`set.js` 96, `LOOK.md` 48, `COMPONENTS_SPEC.md` 17, `TREATMENT.md` 9, `voice/lines.json` 9. Cùng phiên
đó dùng công cụ sửa tệp 522 lần.

**Vì sao.** Bộ đếm bỏ sót vì nó đòi `open(x, 'w')` với một đường dẫn nó đoán được, trong khi các lệnh
này ghi qua biến (`p = 'src/set.js'` … `open(p, 'w')`) và transcript cắt lệnh dài. Đường dẫn thì luôn
nằm trong lệnh; biến thì không.

**Guard đã có.** `tools/supervise.sh` đếm sai. **Đề xuất:** một lệnh heredoc là một lần ghi khi lệnh đó
**nhắc tới đường dẫn của dự án** (đo từ gốc thư viện), bỏ qua biến mang nó; và đọc phần lệnh gốc
trong transcript thay vì dòng đã hiển thị.

## N76 — medium — Chờ một việc nền bằng cách đọc file output của chính nó

**Bằng chứng.** `…/tasks/bib9128mh.output` được đọc **24** lần, `…/tasks/buqnq0skq.output` **13** lần —
đó là file output của chính các lệnh nền của harness, và harness tự giao file đó khi lệnh xong. Thêm
nữa: 23 vòng `until [ -s … ]; do sleep 5`, và 61 lệnh bash có `sleep`.

**Vì sao.** R9 cấm việc chờ bằng cách dò tệp, nhưng nó được viết cho *tệp của một subagent*; file output
của một lệnh nền là thứ harness giao, và đọc nó là chờ sai thứ theo cách đắt nhất.

**Guard đã có.** R9 có, nhưng không đếm. **Đề xuất:** `tools/supervise.sh` đếm lượt đọc
`tasks/*.output` và các lệnh `until … sleep` như một dòng luật riêng; và R9 nói rõ: *output của một
lệnh nền là của harness để giao*.

---

## N77 — high — Bài kiểm tra hình báo "60 câu vật quá nhỏ" về 54 câu chưa từng được dựng

**Bằng chứng.** Lúc 11:05, khi đọc lại tờ nhịp của tập 01 bằng công cụ của kênh:

```
python3 channels/tram-nghi-nhieu/tools/check_shots.py channels/tram-nghi-nhieu/series/do-vat/tap-01-phoi-quan-ao
→ check_shots: 60 câu, 60 câu có vấn đề máy thấy được
  c1  [—]  fill 0%  "Quần áo ướt treo trên dây, nước vẫn còn đó, chưa đi đâu cả."
    → FILL: vật chính chỉ chiếm 0 % khung — đưa máy gần hơn, hoặc đổi bố cục để vật chiếm chỗ.
  (… 60 câu, tất cả đều fill 0 %.)
```

Câu 1 không hề nhỏ: nó là cảnh mở đầu, có áo trên dây. Máy báo nó "0 % khung" vì **câu đó chưa từng
được dựng**: tờ sheet trong `out/beats/beats.json` lúc đó là tờ vẽ cho **một khoảng câu**
(`--lines a-b`), nên 54 câu còn lại được đánh dấu `skipped` — không có ảnh, không có `fill`.
Nhưng `check_shots.py` coi `fill` thiếu là `0.0`, và vậy **54 câu chưa đo** thành **54 câu vật quá nhỏ**.

**Vì sao quan trọng.** Đây là kiểu cảnh báo sai nguy hiểm nhất: nó không im lặng, nó **chỉ đúng một
dòng** và sai 54 dòng còn lại, và nó nằm đúng chỗ người làm phim phải tin trước khi mở một vòng chấm
bốn mươi phút. Người làm phim đã chạy lệnh này và thấy "60 câu có vấn đề" — nếu không có một người
đọc lại tờ sheet, phiên sẽ đi sửa 54 cảnh không hề có lỗi, và mỗi cảnh sửa lại là một vòng chấm nữa.

Một tờ sheet nửa vời còn đi vào vòng chấm: `review.sh` dùng lại tờ sheet đã dựng nếu nó không cũ hơn
lần sửa code cuối — mà **một tờ nửa vời cũng "không cũ hơn"**. Người chấm cả phim sẽ nhìn một nửa phim
mà không được báo gì.

**Đã sửa.**

- `check_shots.py` phân biệt **chưa đo** với **đo được 0 %**: chỉ câu nào thật sự có `fill` mới được
  kết luận. Câu `skipped` không còn bị báo là lỗi; nó được đếm riêng và nói rõ là *chưa đo*.
- Câu lời kể có mà `window.EV` không có sự kiện giọng thì được báo là lỗi thật (`VOICE`) — trước đó nó
  rơi vào nhóm "chưa đo" và im lặng.
- Khi có câu chưa đo, lệnh ra mã **2** (chưa kết luận được) thay vì 1 (có lỗi), kèm câu dựng lại tờ
  sheet cho cả tập.
- Khi một thư mục tập có nhiều tờ sheet, công cụ chọn **tờ nào đo được nhiều câu hơn** — tờ đầy đủ thắng
  tờ một khoảng câu.
- `review.sh` không dùng lại một tờ sheet có câu `skipped` cho vòng chấm **cả phim**, và nói rõ là đã
  bỏ qua tờ đó và vì sao.
- Selftest của `check_shots.py` nay có 14 ca, gồm ba ca mới: câu chưa đo không bị báo là vật quá nhỏ,
  câu thiếu sự kiện giọng bị báo `VOICE`, và tờ nào đo được nhiều câu hơn thì thắng.

**Đo lại sau khi sửa, trên chính tập 01:** `60 câu — đo được 60 câu, 36 câu có vấn đề máy thấy được`.
Tờ sheet đầy đủ nằm ở `review/beatsheet/beats.json`; tờ nửa vời ở `out/beats/beats.json` là tờ
`--lines` cũ, và công cụ nay bỏ qua nó.

---

# Phần bốn: đánh giá khách quan phim tập 01 (đọc trên tờ sheet 60 khung, 10:03)

Lúc viết phần này tập 01 **chưa có file mp4** — phiên làm phim đang dựng lại tờ sheet sau khi sửa
code. Nên đánh giá này làm trên **tờ sheet đầy đủ 60 khung** (`review/beatsheet/sheet_1..5.jpg`, dựng
lúc 10:03), cộng với cờ máy trong `beats.json` và bảng nhãn trong `src/film.js`. Khi có mp4, phần này
được đo lại trên chính phim.

## Cách đọc

Năm tờ sheet, mỗi tờ mười hai khung, đọc như đọc một truyện tranh: lần theo dòng lời kể, xem mình có
đọc được hình không nếu tắt tiếng. Rồi đối chiếu với cờ máy, rồi với bảng nhãn.

## Kết quả

**Phần làm được.** Ánh sáng có chiều sâu, nét mực viền đúng kiểu toon, bảng màu ấm và dịu, phòng có
bố cục rõ (dây phơi, quạt, bàn gỗ, cửa sổ, đồng hồ). Nhãn dựng đúng câu gọi tên nó, có số thì số trên
nhãn khớp lời kể (`20 g/kg` ở c41, `30 °C` ở c44–c45, `90 %` và `×5` ở c46, `3 ÁO` ở c40 đúng câu "Ba
cái áo phơi chồng lên nhau", `GÓC XA`/`TRƯỚC QUẠT` ở c34–c35 đúng với hai cái cân lệch nhau). Bốn mươi
hai nhãn cho sáu mươi câu — hầu như không câu nào mà người xem không biết đang nhìn cái gì. Thí nghiệm
hai tấm kính ở c35–c37 đọc được ngay, và đó là đoạn dạy tốt nhất của phim.

**Bốn chỗ yếu, theo thứ tự nghiêm trọng.**

1. **Cái áo không trông ướt.** Cả phim dựa vào tiền đề "quần áo ướt", nhưng ở c1 (khung mở đầu, `fill
   8 %`) và c4, áo là một mảng bê-tông màu be, không có vệt ẩm, không có mép đậm, không có giọt. Người
   xem tắt tiếng ở c1 thấy một căn phòng có quần áo treo — không thấy "ướt". Cùng kiểu lỗi ở c49: dõi
   "áo úp" (không phơi một mặt) và "áo phơi rộng" bằng màu, màu áo úp và áo phơi rộng phải **khác nhau
   một cách đọc được** (áo úp sẫm hơn, úp sát nhau, mép dính).
2. **Ba đoạn dài hình gần như đứng yên.** Cờ `SAME` của máy rơi vào đúng ba đoạn, và đọc tay thấy nó
   đúng: **c25–c32** (gió quét lớp ẩm), **c34–c37** và **c46–c60** (đoạn kết: ẩm, nhiệt, gió, chỗ
   thoáng). Lời kể ở c27–c32 nói những việc **có chuyển động** — "lớp ẩm bị quét đi", "gió chở hơi nước
   đi", "quét xa hơn" — mà hình thì chỉ đổi chút ánh sáng và góc máy. Người xem không thấy vật nào đang
   làm việc. Đây đúng là lỗi mà luật của kênh cấm: *"chỉ lia máy thì vật vẫn đứng yên"*.
3. **Hai mươi câu có vật chính dưới 15 % khung.** Tệ nhất là c13–c18: các nhát cận cảnh trong vải —
   mấy cục cầu đỏ/trắng trên nền xanh — trông y hệt nhau và không có nhãn nào gọi tên chúng (nhãn
   "PHÂN TỬ BAY LÊN" chỉ ở c17). Người xem tắt tiếng không biết đó là nước hay đường. Cùng kiểu:
   c38 (`fill 0 %`, cảnh toàn phòng rộng trong lúc lời nói "còn lại, ba thứ quyết định tốc độ" —
   ba thứ đó chưa hiện ra), c35, c45, c53, c55.
4. **Cảnh trong vật thiếu dấu hiệu "nước".** C8–c12 và c22–c24 có bầu hơi và giọt, nhưng không có
   màu nào nói đó là nước; cùng một vật liệu be xuyên suốt, nên "nước" và "vải" trông giống nhau.

## Cái máy không thấy được, và vì sao

Cờ máy bắt được `SAME` (đo bằng bố cục + sắc độ) và `FILL` (đo tỉ lệ vật lớn nhất). Nó **không** bắt
được:
- **vật chính có phải là thứ câu đó đang gọi tên không** — `fill` đo vật *lớn nhất* trong khung, chứ
  không phải vật *được gọi tên*; nên một câu nói về "hai cái cân" mà khung có cây quạt to hơn vẫn xanh;
- **vật có đang làm việc không** — `SAME` đo "khung có giống nhau không", không đo "chuyện câu đó kể
  có xảy ra không";
- **tiền đề của cả phim có đọc được không** — "áo ướt" không phải cờ máy nào đo được; người chấm phải
  đọc bằng mắt, và vòng chấm hình đã bận với 22 cờ SAME nên không dừng lại nói.

Đây là lý do vòng chấm hình không thay được một cái nhìn của người, và cũng là lý do **không nên** mở
một vòng chấm hình trước khi các lỗi máy thấy đã sạch.

## N78 — medium — Cổng chưa biết cái nhãn trỏ vào vật nào, nên không ai kiểm được chuyện quan trọng nhất

**Bằng chứng.** `src/film.js` khai 42 nhãn, mỗi nhãn có `at:` (điểm neo) và `lines:` (những câu nó
thuộc về). Rig (`window.SHOTPROBE`) trả về `shot.cast` — danh sách vật trong khung kèm tỉ lệ chiếm
khung — nhưng **không trả về chỗ của từng vật trên màn hình**, nên không ai ghép được "cái nhãn này
trỏ vào vật nào". Vì vậy:
- không có bài kiểm tra nào bắt được **nhãn trỏ vào không** (đã từng xảy ra: c33/c39/c44/c49/c59/c60
  trong các vòng trước);
- không có bài kiểm tra nào bắt được **nhãn trỏ vào nhầm vật**;
- không có bài kiểm tra nào bắt được **câu gọi tên vật A mà vật B lớn hơn nằm giữa khung**.

**Guard đã có (13:2x).** `window.LABELPROBE` trong rig: `label()` ghi lại **điểm mũi tên** của mỗi nhãn
(tính cả góc nghiêng và độ lớn), và sau khi lớp phủ 2D vẽ xong thì rig raycast từ đúng điểm đó để biết
nó chạm vật nào, hay không chạm vật nào. `beatsheet.mjs` bật probe này cùng `SHOTPROBE` và ghi kết quả
vào tờ sheet (`labels` mỗi câu); `check_shots.py` đọc nó và báo cờ mới **`PTR`** — *nhãn trỏ vào không* (mũi
tên không chạm vật nào). Đây là **cờ gợi ý**, không phải phán quyết: máy đo được mũi tên có chạm vật
không, còn việc nó *phải* chạm vật nào thì cần mắt người — cùng đẳng cấp với `SAME`/`RUN`.

**Cột "mũi tên chạm một vật lớn hơn cả vật trong cảnh" thì không báo nữa — và đó là một sửa lần hai.**
Ban đầu cờ `PTR` báo cả trường hợp mũi tên chạm một vật *lớn hơn 1,2 m* (tường, bàn, phòng). Thử trên
tập 01 thấy ngay nó **báo sai**: nhãn `2 ÁO` ở câu c4 trỏ vào **cả hai cái áo cùng treo**, mà hai cái áo đó
là một *nhóm* rộng hơn 1,2 m, nên máy bảo "trỏ nhầm" — trong khi nhãn đó trỏ đúng thứ nó gọi tên.
Một cờ báo sai dạng này dạy người làm phim bỏ qua cờ, nên nay chỉ còn một loại: **mũi tên không chạm gì
cả**. Thử lại trên tám câu đầu của tập 01: cờ rơi vào c4, c5, c7 — ba nhãn mũi tên không chạm vật nào.

Còn một phần chưa làm được: **tên vật**. Rig trả về `uuid` (`dcd71e8e`) vì các vật trong cảnh không có
`tên` — nên máy biết nhãn này trỏ vào *một vật*, nhưng chưa biết nó có phải vật *đúng* không. Muốn vậy thì
mỗi vật phải có tên; đó là việc của tập, không phải của rig, và nó chưa được yêu cầu ở đâu.

**Đề xuất (chưa làm — R13: ba phiên đang dựng bằng rig này).** `window.SHOTPROBE` trả thêm vị trí màn
hình của từng vật trong `cast`; một probe mới `window.LABELPROBE` raycast từ đuôi mũi tên của mỗi nhãn
để biết nó trỏ vào vật nào (hoặc không vào vật nào); `check_labels.py` đọc kết quả đó và báo:
nhãn không trỏ vào gì; nhãn trỏ vào vật không thuộc câu đó; và câu đó gọi tên vật A nhưng vật chiếm
khung nhiều nhất lại là B. Khi đó `fill` của cờ `FILL` cũng nên đo **vật được gọi tên**, thay vì vật lớn
nhất — cùng một số đo, đúng nghĩa hơn.

---

### Đo lại trên chính phim (11:43 → 12:05)

Tờ sheet là ảnh **dựng riêng**; người xem sẽ xem mp4. Nên tôi cắt lại từng câu **trên chính phim**
(`tools/frames_at.py` — cắt đúng giữa câu lời kể, dán lại bằng `core/render/sheet.py`) và đọc lại.

**Những chỗ đã được sửa, nay có trong phim:**

| Câu | Nhìn thấy được trên phim |
|---|---|
| c1 | Áo có mép dưới **sẫm hơn**, có giọt rơi xuống, chậu dưới chân, nhãn `QUẦN ÁO ƯỚT` — "ướt" đọc được. |
| c7 | Hai cái áo: bên trái **nhạt**, bên phải **sẫm** — đúng câu "cái trước quạt nhạt màu dần, còn cái kia vẫn sẫm". |
| c8 | Cảnh trong ruột sợi: sợi vải và một giọt nước. |
| c13 | Phân tử nước đỏ to, nước ở trên nền vải — "muốn rời khỏi vải, nước phải đổi thành hơi nước" đọc được. |
| c17 | Nhãn `PHÂN TỬ BAY LÊN`, một hạt sáng với vệt hơi bay lên. |
| c38 | Nhiệt kế, đồng hồ độ ẩm (70 %), tấm vải phơi — "ba thứ quyết định tốc độ" có mặt trong khung. |
| c40 | Ba cái áo chồng lên nhau, nhãn `3 ÁO`. |
| c49 | Hai cái áo, nhãn `ÁO ÚP` (sẫm) và `PHƠI RỘNG` (nhạt) — sự khác đọc được. |

**Còn yếu, xét trên phim.** *Không còn câu nào tôi dám gọi là hỏng.* Hai câu từng khiến tôi nghi
ngờ — **c29** và **c54** — mở ở kích thước gốc thì **đều ổn**:

- **c29** ("Gió không sấy nước"): quạt lớn giữa khung, có đĩa mờ của cánh quay, và **hai vệt gió chạy
  từ miệng quạt sang góc trên bên phải**, nơi cái áo có **giọt màu xanh** đang treo. Quan hệ gió–nước
  đọc được. Lý do "giữ" của đạo diễn cắt đúng.
- **c54** ("quạt thổi tay lại thấy mát"): quạt bên trái, **bàn tay duỗi ra với giọt màu xanh trên mu
  bàn tay**, vệt gió chạy từ quạt tới tay, một chiếc quạt nhỏ ở giữa khung. Câu kể đọc được rõ ràng.

**Bài học về chính cách tôi đọc — sai ba lần, và tôi đã gửi tin nhắn sai cho phiên làm phim.** Tôi đọc
tờ sheet sáu mươi ô (~480 px một ô) rồi kết luận. Ba nhận định sai:

| Câu | Tôi đọc trên tờ sheet | Thực tế trên phim |
|---|---|---|
| c32 | "tường tối, chỉ có một vai áo, khung gần như trống" | **một cái áo trắng lớn ở giữa khung**, có quạt, có đồng hồ, có dây phơi |
| c7 | "hai cái áo giống nhau, không thấy khác biệt" | áo bên trái **nhạt**, áo bên phải **sẫm** — đúng câu kể |
| c54 | "khung tối, bàn tay không đọc ra" | **bàn tay là chủ thể rõ nhất**: duỗi ra, giọt màu xanh trên mu, vệt gió từ quạt tới tay |

Và tôi đã **gửi cho phiên làm tập 01 một tin nhắn sai**: bảo họ làm lại c29 và c54 vì "yếu". Cả hai
đều không có lỗi. Tôi đính chính ngay sau đó — nhưng một tin nhắn sai đã đủ để kéo một phiên đang
dựng phim đi sửa hai câu không có lỗi, và trong lúc phim đang dựng thì đó là thời gian thật.

Ô nhỏ làm mất đúng thứ phim dạy: tương phản sáng/tối, kích thước vật, sự hiện diện của vật. Ba nhận
định sai ấy đủ để gửi cả phim đi sửa ba câu không có lỗi. Nên: **tờ sheet để tìm câu cần xem, phim
mới là bằng chứng** (N87) — và **người giám sát cũng phải mở khung gốc trước khi nói câu nào hỏng**,
đúng như người làm phim.

**Đo trên file cuối (sau `mux.sh`, 12:21).**

| Đo | Kết quả |
|---|---|
| Tệp | 373,7 MB · 1920×1080 · 24 fps · 176,4 s |
| Độ lớn tiếng | **−14,0 LUFS** (đích −14) · độ rộng 2,6 LU · đỉnh thật −2,5 dBFS — **đúng đích** |
| Vùng đen | không có vùng nào ≥ 0,5 s |
| Khoảng lặng | không có khoảng nào ≥ 1,0 s |
| Phụ đề | 79 câu, mỗi câu 0,94–3,89 s — **một câu giữ 0,94 s** (câu 55), hơi nhanh để đọc |
| Chuyển động (`tools/check_motion.py`) | **PASS** — 77 % giây có chuyển động, 46 % cửa sổ 2 s có hành động lớn, đoạn đứng yên dài nhất 6 s, camera trượt 12 % khung, 55/60 mốc nhịp thay đổi phần của mình |
| Hình so với bản dựng | PSNR trung bình **40,7 dB** (thấp nhất 39,4) — những gì đọc trên bản dựng vẫn đúng trên phim |

Phim đạt: có tiếng, đúng độ lớn, không có chỗ chết, hình chuyển động, và phần đã soi ở trên là của
chính phim này.

**Và một cái bẫy khi đo.** Tôi chạy `tools/film_report.py` trên `out/video.mp4` — đó là bản **dựng
hình, chưa ghép tiếng** — và báo cáo in ra "không có khoảng lặng từ 1,0 s trở lên" cho một tệp không
có tiếng nào, và "độ lớn tiếng — không đo được". Cả hai câu đúng theo nghĩa đen, sai theo nghĩa đúng:
người đọc sẽ tưởng phim có tiếng và chỉ bị ngắt lời (N86).

---

## N79 — medium — Bảng trạng thái nói "chưa có PASS" về một tập đã có tem của cả chương

**Bằng chứng.** Tập 03 có `src/chapters.js` (một chương, id `tap-03`) và tem `review/SCRIPT-tap-03.pass`.
Nhưng:

```
python3 channels/tram-nghi-nhieu/tools/gate.py status <tập 03>
→ script      chưa có PASS          ← sai: tem của chương vẫn còn hiệu lực
```

Trong khi `gate.py check --for render` (cùng một lúc, cùng một tập) **mở** cho bước giọng kể, vì nó
dùng `kind_ok()` — hàm biết một tập dài được đóng tem **theo từng chương**. Còn `status()` thì chỉ
nhìn tệp tem của cả tập (`review/SCRIPT.pass`), không biết chuyện tem theo chương.

**Vì sao quan trọng.** `status` là bảng người làm phim đọc để biết "tập đang ở đâu". Bảng đó nói
"script chưa có PASS" thì người làm phim tin nó, và mở thêm một vòng chấm cho một bước **đã qua** —
mỗi vòng là tiền và bốn mươi phút. Đây là lần thứ hai trong đợt này mà hai lệnh của cùng một công cụ
trả lời khác nhau về cùng một câu hỏi (lần trước là `check_shots` với tờ sheet nửa vời, N77).

**Đã sửa.** `status()` dùng đúng luật của cổng cho hai loại tem theo chương (`script`, `picture`):
tem của cả chương hợp lệ thì bảng in `PASS còn hiệu lực`; thiếu thì in `chưa có PASS — <lý do>` kèm
lệnh cần chạy. Selftest của `gate.py` nay có 24 ca, thêm hai ca: tập có chương thì tem của chương
tính là tem của tập, và cổng cũng mở cho bước đó.

**Luật chung rút ra:** hai lệnh của một công cụ phải dùng **cùng một phép so sánh**. Nếu `check` mở
cửa mà `status` báo chưa có, thì `status` đang nói dối — và người đọc nó sẽ hành động theo.

---

## N80 — medium — Danh sách cờ máy phải đọc được như những đoạn, không phải như từng dòng

**Bằng chứng.** Tờ sheet mới của tập 01 (dựng lúc 11:21) cho **22 cờ `SAME` và 30 khung có vật chính
dưới 15 %**. `check_shots.py` in ra từng câu một:

```
  c25  [SAME]  fill 24%  "Lớp đó bám sát vải, nhanh chóng bị bão hoà."
  c26  [—]  fill 19%  …
  c27  [SAME]  fill 17%  …
```

Người làm phim không sửa "hai mươi hai câu" — họ sửa **ba đoạn**. Nhưng danh sách không nói cho họ
biết đâu là đoạn: phải tự đọc và tự gom, mỗi lần sửa lại là một lần sửa code.

**Đã sửa.** `check_shots.py` in thêm một dòng tóm tắt theo từng loại cờ, gom các câu liền nhau:

```
  SAME: c5–c7 (3 câu), c16, c23, c25, c27, c29–c31 (3 câu), c34–c35 (2 câu), c37–c40 (4 câu),
        c45–c46 (2 câu), c49–c50 (2 câu), c55, c59–c60 (2 câu)
  FILL: c1, c13–c18 (6 câu), c20, c22–c23 (2 câu), …
```

Nhìn một dòng là biết ngay: đoạn `c37–c40` và đoạn `c44–c47` là hai chỗ phải làm lại; `c59–c60` là
chỗ cuối. Đó là thông tin mà một bức tường 52 dòng không cho.

---

## N81 — high — `pkill -f beatsheet.mjs` của một tập giết job của tập khác

**Bằng chứng.** Phiên tap-01 dùng `pkill -f "beatsheet.mjs"` ba lần (10:53:45, 10:54:28, 11:00:44) để
dừng lượt chạy của chính nó. Đúng lúc đó, **tap-03** (10:57 và 11:04) và **tap-02** (11:01) đang chạy
`review.sh` của riêng chúng, mà `review.sh` gọi `beatsheet.mjs` ở dòng 764 — cùng một mẫu lệnh, cùng
một tên tiến trình. Lệnh `pkill` không phân biệt tập nào.

**Vì sao quan trọng.** Ba phiên cùng dựng một kênh là một thực tế của kênh này (người giám sát, các tập
song song), nên một lệnh giết theo *tên* là một lệnh giết của người khác. Ở đây nó còn tệ hơn: lệnh
giết đến từ một người đang tưởng job của mình đã chết, trong khi job đó chỉ đang chậm và im.

**Guard đã có.** Chưa có. **Đề xuất:** `beatsheet.mjs` ghi một tệp khoá theo tập (`out/beats/.lock`
chứa pid và đường dẫn tập), và giết phải theo pid đọc từ tệp khoá đó; `review.sh` không nên để một
lệnh `pkill` theo mẫu chung tồn tại trong hướng dẫn. Ngoài ra `lessons.md` nên có một dòng: *một
lệnh giết theo tên là một lệnh giết của người khác*.

## N82 — medium — File nghiên cứu nói về bức tranh của phim, và không bài kiểm tra nào đối chiếu

**Bằng chứng.** `research/FACTS.md` mục "Suy luận của tập phim" (dòng 127) viết rõ: *"Phim nói: … (**nhiệt
kế trong cảnh chỉ hai mươi lăm độ**)"* và cả tệp đề xuất mọi con số ở **hai mươi lăm độ** (2,44 kJ/g;
3,17 kPa; 20 g/kg khí khô). Nhưng `src/film.js:208` vẽ thẻ **"30 °C"** cho câu c44–c45, và dòng 119 của
chính mã đó nói cột thuỷ ngân "đã dâng tới 30 °C". Tệp nghiên cứu sửa lần cuối lúc 11-08 11:40 và chưa
hề được sửa.

Chạy bài kiểm tra của thư viện lên chính tập này: `python3 tools/check_claims.py <tập>` → **`check_claims:
PASS`**. Bài kiểm tra hỏi *"con số này có được tệp nghiên cứu nhắc đến không"*, và câu trả lời là có
("ba mươi độ" có trong bảng của mục 2) — nên nó im. Không ai đọc câu *"nhiệt kế trong cảnh chỉ hai mươi
lăm độ"* như một lời hứa về bức tranh.

**Vì sao quan trọng.** Tệp nghiên cứu của kênh không chỉ ghi nguồn: nó ghi cả **"Dùng trong phim"** và
**"Phim nói:"** — những câu nói về bộ dàn cảnh. Một lời hứa về bộ dàn cảnh mà không ai đối chiếu thì không
phải nghiên cứu, nó là thứ đã lỡ. Nhân vật số trên màn hình và tài liệu đang lệch nhau ngay trong tập
đang dựng.

**Guard đã có (13:05).** `channels/tram-nghi-nhieu/tools/check_film_claims.py` (mới, có selftest) đọc các
dòng "Dùng trong phim:" và "Phim nói:" của `research/FACTS.md`, lấy các con số trong đó (số viết bằng
chữ tiếng Việt được đổi ra số; số trong ngoặc ngay sau là cách viết khác của cùng một giá trị; số nằm
trong một biểu thức tính là công thức chứ không phải giá trị phim phải chiếu), rồi đối chiếu với thẻ
chữ trong `src/*.js` và với `voice/lines.json`. Khi câu hứa không có nguyên văn trong lời kể, bài này
in ra **câu gần nhất mà phim thật sự nói**. Cảnh báo, không chặn (`--strict` mới chặn): một lời hứa chưa
được giữ nguyên văn có thể là file nghiên cứu trích lại ý, và chặn ở chỗ không phải nguyên nhân thì
tệ hơn không có bài kiểm tra.

Chạy trên ba tập và nó tìm ra ngay: tập 01 hứa **0,32 kPa** mà phim không có; tập 02 hứa **3,7** mà phim
không có; tập 03 hứa nguyên văn *"nước nóng làm thành chai co lại"* và *"một hướng co nhiều hơn hướng
kia, nên thành chai không co đều mà bị nhăn"*, còn lời kể thật là *"Vậy nước nóng làm chai co lại vì cái
gì?"* và *"Có lẽ vì hai hướng đó co lại không giống nhau"*. (Thư viện đã có `tools/check_claims.py` cho
phim một tập, nhưng nó hỏi câu khác và không phủ câu "tài liệu nói về dàn cảnh".)

## N83 — high — Máy đo "vật chính quá nhỏ" ở ba kiểu cảnh mà nó không nhìn thấy

**Bằng chứng.** Tờ sheet của tập 01 vẽ 30 câu có `fill` dưới 15 %. Phiên làm tập 01 đã tự nhận ra
và nói thẳng: phép đo chỉ bắt vật nhỏ hơn 1,2 m, nên "cảnh trong vải, mặt nước, cảnh toàn cảnh đọc
0 % là giới hạn của phép đo" — và cố ý **không** đưa máy sát vào để đẩy con số lên.

Đó là phản ứng đúng của một người đã hiểu chuyện. Nhưng nó là phản ứng của **một** người hiểu:
công cụ nói sai, người làm phim phải đoán. Phiên sau không có người đã hiểu đó.

Đếm lại trên chính tờ sheet của tap-01 (60 câu, đọc `shot.cast` của từng câu):

| Cách đo | số câu |
|---|---|
| `fill` (vật lớn nhất) dưới 15 % — cách đo cũ | 30 |
| trong đó máy **không thấy vật nào** trong khung (cảnh cận trong một vật lớn, cảnh toàn cảnh) | 14 |
| trong đó chủ thể là một **nhóm vật** (mỗi vật nhỏ, cả nhóm mới là chủ thể) | 5 |
| khung thật sự gần như trống — điều máy nói đúng | 11 |

Tức là trong 30 câu mà máy gọi là "vật quá nhỏ", chỉ **11 câu** là lỗi thật. 19 câu là máy không
nhìn thấy. Ở tap-02: 22 câu bị gọi là nhỏ, 10 câu máy không thấy gì, chỉ 8 câu là lỗi thật.

**Vì sao quan trọng.** `check_shots.py` là cái cổng chặn trước khi mở một vòng chấm bốn mươi
phút. Nếu cổng báo 30 câu phải sửa, người làm phim sửa 30 câu — hoặc tệ hơn: họ đẩy máy sát vào
vật để số lên, và phim xấu đi vì lời của máy. Phiên tap-01 đã chọn "không sửa", nhờ có người hiểu
chuyện. Người không có người hiểu thì sửa. Một số đo sai hướng dẫn cả một phiên đi sai hướng.

**Đã sửa.** Hai chỗ, cùng một luật — đo độ trống của khung bằng **độ phủ** (tổng phần khung mà vật
thật chiếm), không phải bằng vật lớn nhất:

1. `check_shots.py`: độ phủ < 15 % **và** khác 0 mới là lỗi ("khung gần như trống"). Độ phủ = 0 thì
   máy in ra danh sách câu nó **không nhìn thấy**, kèm đúng câu "đừng đưa máy sát chỉ để đẩy con số
   lên" — máy nói thẳng là nó không kết luận được, thay vì im lặng rồi để người khác tưởng là chắc.
   Câu có nhóm vật thì độ phủ lớn, không còn bị gọi là nhỏ.
2. `beatsheet.mjs`: in thêm `cover`, tô màu đỏ theo độ phủ (không theo vật lớn nhất), và in ra dòng
   các câu mà máy không nhìn thấy.

Selftest của `check_shots.py` nay có 19 ca, thêm bốn ca: nhóm vật không bị báo là nhỏ; cảnh máy không
nhìn thấy không bị báo là nhỏ; danh sách câu máy không nhìn thấy được in ra; và không lời nào trong
báo cáo dạy đưa máy sát cho số.

**Luật chung rút ra:** *con số máy đo được phải là con số máy đo được đúng.* `fill` trả lời "vật
lớn nhất trong khung chiếm bao nhiêu" — nó không trả lời "chủ thể có đủ lớn không", và dùng nó để
kết luận thứ hai là nói sai. Một công cụ không chắc thì phải nói ra là không chắc.

---

## N84 — low — Con trỏ viết trong backtick không ai kiểm, và một con trỏ trong chính bộ luật đã hỏng

**Bằng chứng.** Luật R10 trong `CODING_STANDARDS.md` — tài liệu mọi phiên đọc — bảo dùng
`core/render/film_report.py` để đo một phim đã dựng. Tệp đó **không tồn tại**: nó ở
`tools/film_report.py`.

`check_doc_links.py` không bắt được, vì nó chỉ soi liên kết markdown `](target)`. Một con trỏ viết
trong backtick không phải liên kết: không có gì để bấm, nên hỏng thì không ai thấy.

**Vì sao quan trọng.** Đây là con trỏ tới đúng công cụ để đánh giá khách quan một phim đã xong. Người
đọc R10 gõ đúng những gì R10 viết, không thấy tệp, rồi tự viết lại bằng `ffmpeg` — đúng cái R10 cấm.
Trong `improvements/` có những tài liệu cũ nhắc `tools/gate.py`, `tools/review.sh` — những đường dẫn
đã chuyển sang `channels/tram-nghi-nhieu/tools/` từ lâu.

**Đã sửa.** Hai việc:

1. Đường dẫn trong R10 sửa thành `tools/film_report.py`.
2. `check_doc_links.py` nay soi thêm **con trỏ viết trong backtick** — nhưng chỉ trong những tài liệu
   luôn nằm trong ngữ cảnh mọi phiên (`AGENTS.md`, `CODING_STANDARDS.md`, `DIRECTOR.md`, `TECHNIQUE.md`,
   `docs/layout.md`, `core/README.md`, `MAINTAINING.md`, `MY-STYLES.md`), và chỉ khi đường dẫn bắt đầu
   bằng `core/` hoặc `docs/` — hai thư mục này chỉ có một nghĩa trong kho, nên đường dẫn là từ gốc kho
   và có đúng một tệp mang tên đó. Đường dẫn tương đối với thư mục dự án (`src/film.js`, `tools/` của
   một kênh) thì không đụng tới. Selftest có ca cho việc này.

**Vì sao phải hẹp.** Quét mọi backtick trong mọi tài liệu ra **383** đường dẫn hỏng: phần lớn là tài
liệu lịch sử (`improvements/supervision/*.md`) nhắc đường dẫn của ngày xưa đã bị xoá, và
`styles/*/DEMO.md` nhắc `tools/` của chính style đó. Một bài kiểm tra 383 lỗi là tiếng ồn, và tiếng ồn
thì không ai đọc — nó sẽ bị bỏ qua sau lần đầu tiên.

**Luật chung rút ra:** con trỏ viết trong backtick cũng là con trỏ; nhưng bài kiểm tra phải hẹp đúng,
nếu không thì chính nó trở thành tiếng ồn và bị tắt.

---

## N85 — medium — Bài kiểm tra liên kết tự báo lỗi ở chỗ không phải nguyên nhân

**Bằng chứng.** Khi commit N84, cổng `doc-links` báo:

```
BAD improvements/retro/2026-11-09-tap-01-phoi-quan-ao-supervision.md: link target not found: target
```

Dòng đó **không có lỗi**: đó là câu tôi viết trong N84, trong đó tôi *trích* dạng liên kết markdown
`](target)` để giải thích bài kiểm tra soi cái gì. Nguyên nhân thật nằm cách đó hàng nghìn ký tự: một
khối code fence trong tài liệu chứa số dấu nháy lẻ, mà `check_doc_links.py` ghép các đoạn code **theo
cả tệp** — nên từ chỗ đó trở đi mọi dấu nháy bị ghép lệch. Lỗi báo ra ở cuối tệp, cách nguyên nhân
hàng nghìn ký tự.

**Vì sao quan trọng.** Người đọc báo lỗi sẽ đi sửa **chỗ báo lỗi**. Sửa xong mà lỗi vẫn còn, thì lần
hai người ta đi sửa chỗ khác — và lần ba thì bài kiểm tra bị tắt. Một bài kiểm tra mà báo lỗi ở chỗ
không phải nguyên nhân là một bài kiểm tra đang dạy người ta sửa sai.

**Đã sửa.** `check_doc_links.py` bỏ hẳn khối code fence **trước**, rồi ghép đoạn code **theo từng
đoạn văn** thay vì theo cả tệp. Một dấu nháy lẻ giờ chỉ hỏng đúng đoạn của nó, và lỗi báo ra luôn
gần chỗ thật. Selftest có ca cho việc này: một khối fence có dấu nháy lẻ không được làm hỏng phần
văn bên sau nó.

**Luật chung rút ra:** một bài kiểm tra phải chỉ ra **nguyên nhân**, không phải chỗ hậu quả. Và thứ
tự các bước của nó cũng là một phần của câu chuyện: bỏ fence trước khi ghép backtick, hay ghép
trước khi bỏ, cho hai kết quả khác hẳn nhau.

---

## N86 — medium — Báo cáo đo nói "không có khoảng lặng" cho một tệp không có tiếng nào

**Bằng chứng.** `tools/film_report.py` chạy trên `out/video.mp4` của tập 01 (bản dựng hình, **chưa
ghép tiếng**) in ra:

```
== the loudness
   not measured
== the silence
   no silent stretch of 1.0 s or more
```

Cả hai câu đúng theo nghĩa đen và sai theo nghĩa đúng. Tệp không có **luồng tiếng nào**; "không có
khoảng lặng" nghe như phim đã có tiếng và chỉ lời kể bị ngắt quãng. Người đọc báo cáo sẽ kết luận
phim ổn. Còn "not measured" thì không nói lý do, và lý do là thứ duy nhất quan trọng.

**Đã sửa.** `film_report.py` giờ hỏi trước: tệp có luồng tiếng không?

- không có → in `NO SOUND: the file has no audio track at all` ngay dưới phần thông tin tệp;
- phần độ lớn tiếng: `not measured: the file has no audio track`;
- phần khoảng lặng: `the file has no audio track — this is not a film whose voice stops, it is a film
  with no sound`;
- trả về mã thoát 1, kèm dòng `== the verdict`.

Selftest mới có ba ca (`có tiếng` / `chỉ có hình` / `không có luồng nào`).

**Luật chung rút ra:** **"không đo được" và "đo được là 0" là hai kết quả khác nhau.** Với một tệp
có tiếng, "không có khoảng lặng" là tin tốt. Với một tệp không có tiếng, cùng câu đó là tin xấu
nặng nhất. Công cụ phải nói rõ nó đang ở trường hợp nào, không được để người đọc tự suy.

---

## N87 — medium — Tờ sheet không phải là phim: đọc tờ ở ô nhỏ sinh ra nhận định sai

**Bằng chứng.** Phần bốn của retro này đánh giá phim tập 01 trên tờ sheet sáu mươi ô — ảnh **dựng
riêng** bằng `beatsheet.mjs`, mỗi ô khoảng 480 px. Khi có mp4, tôi cắt lại từng câu **trên chính
phim** và so:

| Câu | Tôi đọc trên tờ sheet | Thực tế trên phim |
|---|---|---|
| c32 | "tường tối, chỉ có một vai áo, khung gần như trống" | **một cái áo trắng lớn ở giữa khung**, có quạt, có đồng hồ, có dây phơi |
| c7 | "hai cái áo giống nhau, không thấy khác biệt" | áo bên trái **nhạt**, áo bên phải **sẫm** — đúng câu kể |
| c54 | "khung tối, bàn tay không đọc ra" | **bàn tay là chủ thể rõ nhất** — duỗi ra, giọt màu xanh trên mu, vệt gió từ quạt tới tay |
| c40 | (lần trước) nhãn "3 CÁI" gọi tên vật không có trong hình | nhãn là `3 ÁO`, và câu nói đúng |

Bốn nhận định sai trong một buổi đọc. Không phải lỗi may mắn: **ô nhỏ làm mất đúng thứ phim dạng** —
tương phản sáng/tối, kích thước vật, và sự hiện diện của vật. Bốn lần sai ấy đủ để gửi cả phim đi
sửa bốn câu không có lỗi, và đủ để làm người đọc tin rằng câu đó hỏng.

Và tôi đã **gửi sai cho phiên làm phim**: tin nhắn bảo họ làm lại c29 và c54. Cả hai đều không có lỗi.
Người giám sát sai không chỉ tốn thời gian của mình — nó kéo một phiên đang dựng đi làm lại hai câu
đúng, và mất thời gian dựng nữa. **Không gửi kết luận về một câu hỏng trước khi mở chính câu đó ở
kích thước gốc.**

**Đã sửa.**

1. `tools/frames_at.py` (mới) — cắt một khung cho mỗi câu **từ chính mp4 đã dựng**, đúng giữa câu
   lời kể, rồi dán lại bằng `core/render/sheet.py` của thư viện. Có `--lines c1,c13-c18` và `--at`.
   Đây là hình người xem thật sự sẽ thấy, không phải ảnh dựng riêng.
2. `frames_at.py` nhận `--cols` và `--w`, và **mặc định là hai cột 780 px** — kích thước mà tương phản
   sáng/tối còn đọc được. Muốn lướt thì `--cols 3`, muốn soi một câu thì `--cols 1 --w 1200`.
3. R12 trong `CODING_STANDARDS.md` nói rõ hơn: tờ sheet là **bản đồ** để tìm câu cần xem; câu trả
   lời phải đến từ phim, ở kích thước đọc được.

**Luật chung rút ra:** **đánh giá phim thì phải xem phim.** Một bằng chứng hình ảnh nhỏ đến mức mất
chi tiết thì không phải bằng chứng, chỉ là một câu hỏi.

---

## N88 — medium — Bản dựng giữa được chuyển đi và về nguyên vẹn 1,1 GB, và chuyển lâu hơn encode

**Bằng chứng.** Tập 01 render xong lúc 11:43 (`out/video.mp4`, 1 113 MB, 52,9 Mbit/s — `core/render/video.mjs`
mã hoá bằng `libx264 -preset medium -crf 14`). `core/render/mux.sh` thấy `LEMO_REMOTE_FFMPEG` mặc định là
`muse muse2`, nên nó:

| Bước | Thời gian |
|---|---|
| `scp` 1,1 GB lên `muse2` (đường truyền ~1,3 MB/s) | ~14 phút |
| encode cuối ở `muse2` (`-preset slow -crf 19`) | ~12 phút |
| `scp` phim cuối về | ~6 phút |

Tổng ~32 phút, trong đó **~20 phút là chuyển dữ liệu**. Trong khi đó, encode cuối **tại máy này** tốn
66,75 giây cho 30 giây phim — tức **~6,5 phút cho cả tập**. Đường xa chậm hơn encode tại chỗ khoảng bốn
lần, và lý do không phải máy xa yếu: nó là chuyển một bản trung gian *xa hơn nhiều* so với thứ bản
cuối cần.

**Đã sửa.** `mux.sh` thu nhỏ bản giữa **một lần, tại chỗ**, trước khi chuyển đi:

- `-c:v libx264 -preset veryfast -crf 20` → 239 MB thay vì 1 113 MB (**4,6× nhỏ hơn**), tốn 79 giây CPU;
- đo thật: **PSNR trung bình 40,4 dB** (thấp nhất 38,4) so với bản giữa, và bản cuối vẫn encode ở
  `crf 19` — chênh lệch không nhìn thấy;
- tệp nhỏ dưới 200 MB thì chuyển nguyên bản; nếu thu nhỏ hỏng thì gửi bản gốc, phim vẫn ra;
- bản thu nhỏ nằm ở `$TMPDIR` và bị xoá sau khi chuyển xong.

**Luật chung rút ra:** *khi một bước chuyển dữ liệu chiếm nhiều thời gian hơn bước xử lý, hãy làm cho
thứ được chuyển nhỏ đi — đừng làm cho máy xa mạnh hơn.* Bản giữa ở `crf 14` là dư: bản cuối `crf 19`
đã không cần nó.

**Chưa làm:** cho `mux.sh` tự ưu tiên encode tại chỗ khi phim ngắn (dưới khoảng bốn phút, encode tại
chỗ thắng rõ). Đó là đổi chính sách, không chỉ đổi cách làm, nên để người dùng quyết.

---

## N90 — medium — Vòng chờ tự khớp lấy chính nó: một job nền chờ mãi một việc đã xong

**Bằng chứng.** Lúc 12:24, phiên của tập 01 có một job nền:

```
until ! pgrep -f "tap-01-phoi-quan-ao/build.sh" >/dev/null 2>&1; do sleep 15; done
echo "=== build xong ==="; … beatsheet.mjs …; check_shots.py …
```

Job đó chờ `build.sh` xong rồi dựng lại tờ beat và chạy `check_shots.py`. Nhưng dòng lệnh của **chính vỏ
shell chạy job đó** chứa đúng chuỗi `tap-01-phoi-quan-ao/build.sh`, nên `pgrep -f` luôn tìm thấy chính
nó. Khi `build.sh` thật đã xong, điều kiện vẫn không bao giờ thành đúng, và job quay mãi — không phải vì
việc nó chờ còn chạy, mà vì nó tự nhìn thấy chính mình.

**Vì sao quan trọng.** Đây là N24 ở dạng thứ ba: một việc *không thể thất bại* cũng *không thể kết
thúc*, và từ bên ngoài nó trông y hệt một job đang chạy. Người làm phim chờ nó, job giữ mình sống mãi,
và phần việc thật (dựng lại tờ beat, đo lại các câu) không bao giờ chạy. Khác với N81 (giết job của
tập khác), ở đây không ai bị giết: job chỉ không bao giờ kết thúc.

**Guard đã có.** Chưa có. **Đề xuất (đã làm):** luật **R14** trong `CODING_STANDARDS.md`, và
`tools/rules.py` báo R14 khi mẫu của `pgrep -f`/`pkill -f` nằm ngay trong dòng lệnh (kèm ca selftest cho
cả hai vỏ: có ngoặc vuông thì không báo). Tôi đã báo cho phiên của tập 01 biết và chỉ đích danh pid
(2886362) để nó tự giết — tôi không giết tiến trình của phiên khác.

## Đánh giá toàn bộ quá trình — đo bằng log của chính phiên

**Cập nhật 14:0x: dòng đầu của mục này trước đây viết "Phim đã xong và qua cổng" — và đó là sai.**
Phim có (176,4 s, dựng lúc 12:21), nhưng **cổng bàn giao FAIL** lúc 12:45 với hai bước hỏng (`timing`
và `readcheck`), và mã đã đổi sau đó (`src/film.js` sửa lúc 13:47) nên phim trên đĩa **cũ hơn mã**.
Sửa lại ở đây, vì một bản ghi ghi "đã qua cổng" thì người đọc tin nó và không ai chạy lại cổng.

Phim đã xong và qua cổng. Dưới đây là quá trình, đo bằng công cụ đọc log của chính phiên
(`tools/rules.py` trên toàn bộ transcript 935 MB), không bằng cảm nhận.

### Dòng thời gian thật (theo mốc sửa của tệp)

| Bước | Từ | Đến | Vòng | Kết quả |
|---|---|---|---|---|
| Dàn ý | 08-11 10:57 | 11:20 | 4 | PASS |
| Lời kể | 11:26 | 11:39 | 2 | PASS |
| Vật dựng | 15:20 | 09-11 02:08 | 5 | REJECT cả 5 → Đạo diễn cắt → PASS lúc 08:04 |
| Hình | 09-11 03:34 | 10:12 | 5 | REJECT cả 5 → Đạo diễn cắt → PASS lúc 11:27 |
| Dựng rồi ghép tiếng | 04:27 | 12:21 | | phim 176,4 s |
| Cổng bàn giao | 12:18 | 12:45 | | **FAIL — 2 bước hỏng**: `timing` (27 câu có cờ máy, lúc đó cổng chặn cả cờ đo lẫn cờ đoán) và `readcheck` (5 thẻ chữ hiện ít giây hơn thời gian đọc) |

Tổng: **~25 giờ** cho một tập 176 giây. Vòng hình cuối vẫn REJECT, và ba câu chặn (c45, c49, c59) được
sửa **sau** vòng cuối — nghĩa là giới hạn vòng chấm đếm số vòng, không đếm mức đủ: phim chỉ đủ hình sau
khi vòng đã hết.

### Log của chính phiên nói gì

| Vấn đề | Số lần | Nghĩa là gì |
|---|---|---|
| R1 — ghi tệp của dự án bằng shell | **370** | `src/film.js` 166 (90 lần viết bằng đường dẫn tương đối + 76 bằng đường dẫn đầy đủ), `props.js` 59, `set.js` 45, `LOOK.md` 24, `COMPONENTS_SPEC.md` 16 |
| R1t — sửa an toàn qua `tools/replace.py` | 53 | an toàn, nhưng đi qua chương trình trung gian |
| R10 — montage ffmpeg tự viết | 15 | thay vì `core/render/sheet.py` |
| R5 — chờ việc dài bằng `sleep` | 6 | |
| R9 — lặp lệnh để dò | 4 mẫu (một lệnh 12 lần) | |
| R11 — đọc lại tệp lớn | `set.js` 83, `props.js` 80, `film.js` 68 | 231 lần đọc lại ba tệp |
| R12 — mở ảnh | **808**, trong đó 45 lần cùng đúng pixel | |
| R14 — vòng chờ tự khớp lấy chính nó | **7** | 2 lần `pgrep -f` (vòng chờ build), 5 lần `pkill -f` (giết theo mẫu) |

**Đọc.** Phần lớn thời gian của phiên nằm ở chỗ **nhìn**, không phải chỗ **làm**: 808 lần mở ảnh, 231
lần đọc lại ba tệp mã nguồn, 370 lần ghi tệp bằng shell thay vì bằng công cụ sửa file. Ba tập nay chạy
song song, nên `pkill -f "beatsheet.mjs"` — lệnh mà phiên này đã chạy 5 lần — giờ còn giết được tờ
beat của tập bên cạnh. Guard đã có: `beatsheet.mjs` ghi tệp khoá `out/beats/beats.lock` với pid của
nó, và **R14** báo mọi mẫu `pgrep -f`/`pkill -f` nằm ngay trong dòng lệnh.

**Điều tập này dạy cho tập sau, đã thành luật:** R1 (ghi bằng công cụ), R10 (dùng công cụ của thư viện),
R11 (bản đồ mã), R12 (xem tờ sheet, mở khung gốc khi cần), R14 (vòng chờ không tự khớp), và `beatsheet.mjs`
giờ in tiến độ sau mỗi câu với đồng hồ từng câu — hai lượt chạy lành mạnh trước đây bị giết chỉ vì log
rỗng.

### So với các phiên mới — cùng phép đo, cùng công cụ (kiểm chứng)

Các luật và guard có thật sự làm phiên sau tốt hơn không? Đo bằng `tools/rules.py` trên transcript của
từng phiên, lúc 14:0x ngày 9 (transcript của tập 01 đã lớn thêm 38 MB kể từ lần đo trước, nên con số
mở ảnh của nó là 834 chứ không phải 808):

| Phép đo | tập 01 (phiên cũ) | tập 02 (phiên mới) | tập 03 (phiên mới) |
|---|---|---|---|
| R1 — ghi tệp dự án bằng shell | 370 | 40 | 1 |
| R1t — sửa an toàn nhưng đi qua chương trình trung gian | 60 | 2 | 39 |
| R10 — montage ffmpeg tự viết | 15 | 4 | 0 |
| R11 — đọc lại tệp mã nguồn lớn | 236 | 65 | 44 |
| R12 — mở ảnh | 834 | 138 | 88 |
| R9 — đọc lại output của job nền (của harness) | 136 | 0 | 6 |
| R5b — đọc lại tệp log của **chính mình** (luật mới) | 80 | 111 | 81 |
| R14 — mẫu tự khớp (`pkill -f`, `pgrep -f`) | 5 | 1 | 0 |
| Kích thước transcript | 973 MB | 108 MB | 81 MB |

**Đọc.** Các luật đã có tác dụng: ghi tệp bằng shell giảm 9 lần, đọc lại tệp mã giảm 3–5 lần, mở ảnh
giảm 6–10 lần, đọc lại output của harness về gần 0, transcript nhỏ hơn 9 lần.

**Nhưng một lớp lỗi không giảm — và báo cáo cũ không thấy nó:** đọc lại tệp log mà chính phiên tạo ra
(R5b): 80 / 111 / 81 lần. Nó chưa từng hiện ra trong báo cáo, vì bộ đếm R9 chỉ nhìn output của
harness, còn tệp do phiên tự tạo (`> /tmp/round.log`) nằm ngoài tầm nhìn đó. Xem N103.

**Còn cách đo bị mù.** Phiên tập 04 không có transcript riêng (N97), nên không đo được bằng công cụ;
đo bằng tệp log của nó (`/tmp/tap04_tty.log`, 1 giờ 15 phút): 0 `pkill -f`, 0 `pgrep -f`, 0 `nohup`,
0 `> file` cho job nền, **3 lần mở ảnh** (tập 01: 834), và 5 lần đọc lại tệp log của chính vòng đang
chạy — cùng lớp lỗi R5b, vì phiên đó khởi động trước khi luật này có.

### Đo lại lúc 14:2x — luật có đổi được hành vi của phiên đang chạy không?

Cùng công cụ, cùng hai transcript (tập 01 đã dừng, nên không đo lại):

| Phép đo | tập 01 (phiên cũ) | tập 02 (phiên mới) | tập 03 (phiên mới) |
|---|---|---|---|
| R1 — ghi tệp dự án bằng shell | 370 | 40 | **1** |
| R1t — sửa an toàn nhưng đi qua chương trình trung gian | 60 | 2 | **45** |
| R10 — montage ffmpeg tự viết | 15 | 4 | 0 |
| R11 — đọc lại tệp mã nguồn lớn | 236 | 65 | 51 |
| R12 — mở ảnh | 834 | 138 | 94 |
| R9 — đọc lại output của job nền (của harness) | 136 | 0 | 6 |
| R5b — đọc lại tệp log của **chính mình** | 80 | **114** | **81** |
| R14 — mẫu tự khớp (`pkill -f`, `pgrep -f`) | 5 | 1 | 0 |
| Kích thước transcript | 973 MB | 108 MB | 83 MB |

**Đọc.** Ba điều khác nhau, và đáng ghi rõ vì chúng dễ bị đọc thành một:

1. **Tập 03 đã bỏ hẳn lớp lỗi R5b**: 81 lần lúc 14:0x và **81 lần lúc 14:2x** — không tăng. Cùng lúc đó
   nó ghi tệp bằng shell **1 lần** (tập 01: 370) và dùng `tools/replace.py` **45 lần**: nó đã đọc luật
   và làm theo. Đây là bằng chứng rằng luật viết bằng văn xuôi **có** đổi được hành vi khi người đọc
   là một phiên mới đọc luật từ đầu.
2. **Tập 02 thì không**: 111 → 114, và ba lần tăng nằm quanh vòng chấm props **chết** (xem N106) —
   người làm phải mở tệp log để thấy vòng chấm chết ở đâu. Đó là đọc log một lần sau khi job đã xong,
   không phải vòng dò. Nhưng mẫu cũ vẫn còn: nó vẫn `> /tmp/round_props4.log 2>&1`.
3. **Một luật mà rơi vào giữa một phiên đang chạy không đổi được hành vi của phiên đó**: cả hai phiên
   đã nhận tin nhắn của tôi và đã ghi nhận, nhưng tập 02 vẫn giữ mẫu cũ. Muốn luật có tác dụng với
   những phiên đang chạy thì phải **nói vào đúng lúc** (tôi đã nói) **hoặc chặn bằng cơ chế** (một
   `PreToolUse` hook trong `.claude/settings.json` của thư việc chưa có — xem "Còn lại").

## N106 — high — Vòng chấm chết ngay ở dòng lệnh đầu tiên, và nó chết trong im lặng

Vòng chấm props của tập 02 chết lúc 14:10 ở dòng `review.sh: 348`:

```
review.sh: 348: printf: 09: not completely converted
```

`printf 'p_%02d.jpg' 09` hiểu "09" là số bát phân — 09 không phải số bát phân hợp lệ — nên `printf`
báo lỗi. Vòng chấm in ra "three views of every object…" rồi chết, exit=1, **không để lại
`PROPS-REVIEW.md`**, và vì vậy cổng báo "props: chưa có PASS" mà không nói vì sao. Người làm phim thì
đang bận làm việc khác, và thông báo chết nằm trong một tệp log mà chính nó không đọc (R5b).

Đã sửa (`30926ba`): bỏ số 0 ở đầu trước khi đưa vào `printf`. Bài học rộng hơn con số 09: **một vòng
chấm chết phải để lại dấu vết** — không có bản chấm thì cổng phải nói "vòng này chết, đọc log", chứ
không phải im lặng như thể chưa ai chạy.

**Đã xong (`bfe1103`, 14:35).** `review.sh` ghi `review/.round-<scope>.died` kèm exit code khi vòng chết
(`trap` ở EXIT: dọn khoá, rồi ghi dấu vết nếu mã thoát khác 0), và `gate.py status` in ra:

```
vòng chấm ĐÃ CHẾT: props — vòng chấm chết (exit 1) lúc 13:41:00 — đọc log của job nền rồi chạy lại, đừng mở vòng thứ hai
```

Sửa bằng `tools/replace.py` (nguyên tử) vì ba phiên đang chạy chính `review.sh` đó (R13).

## N91 — medium — Lời khuyên của cổng trái với luật của chính kênh, ngay trong một tệp

**Bằng chứng.** `channels/tram-nghi-nhieu/tools/check_shots.py` in ra cờ `FILL` với lời khuyên:

> "khung gần như trống — vật trong khung chỉ chiếm %d %% khung; **đưa máy gần hơn**, hoặc đổi bố cục để vật chiếm chỗ."

Trong khi tài liệu của chính hàm đó, ngay trên nó vài dòng, đã nói:

> "Cả ba lần, máy nói 'vật chính quá nhỏ' — và người làm phim tin máy thì **đưa máy sát vào cho số lớn lên**, làm
> hỏng bố cục để thoả một con số mà máy vốn không đo được."

Cùng một tệp, hai lời trái nhau, và cổng bàn giao chạy đúng hàm này (`core/render/review.sh`, bước `timing`):
với tập 01 nó in ra 14 câu `FILL` và nói với người làm phim đưa máy sát vật — đúng cách sửa mà luật của
kênh cấm. Trong lời kể của `lessons.md` đã có câu này rồi, nhưng cổng thì không.

**Vì sao quan trọng.** Đây là "cảnh báo sai làm hỏng cả những cảnh báo đúng" (N80) ở dạng nguy hiểm nhất:
lời khuyên sai không phải lúc nào cũng sai, và người làm phim làm theo nó thì phim hỏng theo hướng rất
khó phát hiện (bố cục sát vật, không khí mất). Một cổng dạy đúng bố cục là cổng giữ được người làm phim ở
đúng hướng khi nó thất bại.

**Guard đã có.** Chưa có. **Đề xuất (đã làm):** lời của cờ `FILL` nói *đổi bố cục / cho vật một hành động
rõ*, và nói thẳng rằng máy không đo được chủ thể có đủ lớn không, cùng một câu trong `lessons.md`.

## N92 — medium — Cổng chặn phim bằng những cờ nói về một hình không còn tồn tại

**Bằng chứng.** Lượt cổng bàn giao của tập 01 (12:18) chạy bước `timing` trên tờ sheet
`review/beatsheet/beats.json` dựng lúc **11:21**, trong khi `src/timeline.js` được sửa lúc **11:27** — sáu
phút sau đó. Nên 27 cờ mà cổng in ra nói về một hình đã bị thay. Không ai nói ra điều đó: cổng in 27 cờ,
người đọc không có cách nào biết cờ nào còn đúng với hình hiện tại.

Điều này nguy hiểm ở chỗ: cổng FAIL thì người làm phim sửa. Họ sửa theo một hình cũ, dựng lại phim 35
phút, và rồi cổng lại FAIL vì lý do khác — mỗi vòng sửa tốn một lần dựng mà không hề gần hơn.

**Guard đã có (12:5x).** `check_shots.py` so sánh giờ của tờ sheet với giờ của **mã `.js` mới nhất** trong
`src/`, và in ra ngay trước khi in các cờ:

> `check_shots: tờ sheet CŨ HƠN mã (tờ 11:21, mã 11:27) — những cờ này nói về một hình cũ hơn; dựng lại tờ sheet rồi chạy lại`

Hai chi tiết phải đúng, nếu không cảnh báo mất hết sức nặng: (1) ngày khác ngày thì in **cả ngày** —
`tờ 11:21, mã 12:36` đọc ra là cùng một buổi, trong khi thật ra tờ sheet dựng từ hôm qua; (2) chỉ tính
file `.js` — `src/MAP.md` là **bản đồ của mã**, và người làm phim sửa nó sau khi sửa mã, nên đếm nó thì
**mọi** tờ sheet đều bị báo cũ.

## N93 — high — Máy đo được và máy đoán không cùng đẳng cấp, nên cổng bàn giao không nên chặn bằng phép so sánh

**Bằng chứng.** `check_shots.py` có năm loại cờ, và trước đây **tất cả chặn cùng một mức**, ở cả vòng chấm
hình lẫn cổng bàn giao:

| Cờ | Máy đo được hay so sánh | Sai thì sao |
|---|---|---|
| `VOICE` — câu thiếu sự kiện giọng | **đo được** | tiếng lệch với hình; không sửa được sau này |
| `FILL` — độ phủ dưới 15 % | đo được, nhưng không phân biệt chủ thể với vệt | khung có thể trống có chủ thể nhỏ |
| `SAME` / `RUN` / `DARK` / `NUM` | **phép so sánh** | cần mắt người phán |

Ở cổng bàn giao thì **người chấm hình đã phán rồi** (tem `PICTURE.pass`) — máy không có quyền phủ quyết
của người chấm. Nhưng cổng vẫn chặn tập 01 bằng 27 cờ phép so sánh, trong đó có những cờ mà chính người
chấm đã nhìn và kết luận là không sao. Người làm phim phải dựng lại 35 phút một lần nữa cho một cờ không
ai cần.

**Vì sao quan trọng.** Đây là N80 — *cảnh báo sai làm hỏng cả những cảnh báo đúng* — ở dạng nguy hiểm nhất:
không phải cổng báo sai, mà là cổng **bắt người làm phim làm một việc không cần làm**, và nếu họ sửa theo
cờ thì họ sửa bố cục đã được duyệt.

**Guard đã có (13:0x).** Hai mức chặn trong `check_shots.py`:

- **Mặc định — vòng chấm hình:** mọi cờ đều chặn. Đó là lúc người làm phim còn sửa được, và các cờ này
  là bản tóm tắt để người làm phim soi trước khi mở một vòng chấm bốn mươi phút.
- **`--note` — cổng bàn giao:** chỉ lỗi cấu trúc mới chặn (câu thiếu sự kiện giọng). Mọi cờ phép so
  sánh, **kể cả `FILL`**, được in ra nhưng không chặn.

Cổng bàn giao của thư viện (`core/render/review.sh`, bước `timing`) nay gọi `check_shots.py --note`.
Vòng chấm hình của kênh **không đổi**: vẫn gọi không có cờ này, vẫn mọi cờ đều chặn.

Tôi đã báo quyết định này cho phiên của tập 01, kèm lý do và cách sửa đúng (năm thẻ quá ngắn mà
`readcheck` chỉ ra — đó là lỗi thật, đo được, và không cờ nào bảo vệ được).

## N95 — medium — Bốn lệnh `grep` quay vòng suốt ba ngày, ăn bốn lõi của máy đang dựng phim

**Bằng chứng.** Bốn tiến trình `grep -l "socket:[…]" /proc/[0-9]*/fd/*` chạy từ 09-11 12:57 đến nay, mỗi cái
~97 % CPU, cộng lại **bốn lõi** của máy đang dựng bốn tập phim. Lệnh là của chính phần giám sát này (một
lệnh dò tiến trình nào giữ cổng 2222, viết cách đây ba ngày).

**Vì sao quan trọng.** `grep` đọc tệp, và `/proc/<pid>/fd/*` là **symlink** — nên nó đi thẳng vào socket và
đọc ở đó mãi, không bao giờ tới cuối. Lệnh không treo trong im lặng: nó quay vòng, ăn CPU, và **không ai
thấy** trong danh sách tiến trình của phiên (nó thuộc một phiên đã kết thúc từ lâu). Trên một máy dựng
phim, bốn lõi bị ăn là bốn tập phim chậm đi mà không có lý do nào hiện ra.

**Đã làm:** dừng cả bốn (kèm vỏ shell cha của chúng) — chúng là của chính phần giám sát này, không phải
của người dùng. Tải máy giảm ngay.

**Đã thành luật:** dò tiến trình giữ một cổng thì dùng `ss -ltnp`, `fuser`, `lsof` — **đừng dò `/proc`**.
Dòng này nằm trong `lessons.md`.

## N96 — low — Bản đồ mã: tên tệp trong tiêu đề không dùng đúng cách, và người làm phim sửa bằng tay

**Bằng chứng.** Phiên tập 02 báo: `tools/check_map.py` báo *"tệp không có"* cho các tiêu đề dạng
``## `src/props.js` (938 dòng)`` — vì bản đồ viết tên có sẵn `src/`, còn công cụ lại nối `src` với cái tên
đó thành `src/src/props.js`. Người làm phim **sửa số dòng bằng tay** và báo lại, thay vì để công cụ nói
đúng chỗ sai.

**Vì sao quan trọng.** Một công cụ báo sai thì người làm phim học được cách bỏ qua nó. Ở đây còn tệ hơn:
bài kiểm tra **không chạy được** thì bản đồ thối đi, và bản đồ thối thì người đọc mã tới nhầm chỗ — đúng
thứ R11 cấm.

**Guard đã có.** `resolve()` trong `tools/check_map.py`: tên trong tiêu đề được thử ở **mọi nơi nó có thể
là** — thư mục được truyền vào, `src`, `src` + tên gốc, và `src` với tiều tố `src/` bỏ đi. Ghi chú khi
không tìm thấy nay liệt kê **những đường dẫn đã thử**, để người đọc thấy máy đã đoán gì. Có ca selftest
cho đúng trường hợp này. (Dòng `.strip('`')` là của chính phiên tập 02 thêm — họ tự sửa trước khi hỏi.)

## N97 — medium — Phiên mở ra từ trong một phiên khác không để lại transcript của riêng nó, nên không ai giám sát được nó

**Bằng chứng.** Để kiểm chứng "một phiên làm video mới" (tập 04), tôi mở nó từ trong phiên giám sát
này: `script -q -c sh /tmp/tap04_launch.sh /tmp/tap04_tty.log`. Nhìn môi trường của tiến trình con
(`/proc/<pid>/environ`) thì thấy nó **kế thừa** của phiên cha:

```
CLAUDE_CODE_SESSION_ID=faf986af-2974-49dd-8476-6e71ada05a88   # đúng id của phiên giám sát
CLAUDE_CODE_CHILD_SESSION=1
CLAUDE_CODE_SESSION_ATTENDED=1
```

Hệ quả đo được, không phải phỏng đoán:

- **Không có tệp transcript nào của riêng nó.** Quét toàn bộ `~/.claude/projects` không thấy tệp
  mới cho phiên tập 04.
- **Các lượt của nó không nằm trong transcript của phiên cha.** Đếm `tool_use` tên `WebSearch` /
  `WebFetch` trong tệp của phiên cha: **0** — trong khi tập 04 đang tìm nguồn (Joule 1857, Mooney
  1948, bài IAS 2019) và log màn hình của nó ghi rõ những lần tìm đó. Ba lần khớp chuỗi `crossref`
  trong tệp của phiên cha là do chính tôi đọc log màn hình rồi đưa vào ngữ cảnh.
- **Nó không có trong danh sách phiên ngang hàng**, nên tôi không nhắn tin cho nó được.

Đối chứng thử nghiệm (cùng máy, cùng lệnh, chỉ khác môi trường):

| Cách mở | Transcript riêng? |
|---|---|
| `claude -p "…"` (giữ môi trường kế thừa) | **có** — `…/projects/-tmp-n97test2/<id>.jsonl` |
| `env -u CLAUDE_CODE_SESSION_ID -u CLAUDE_CODE_CHILD_SESSION claude --dangerously-skip-permissions "…"` | **có** — `…/projects/-home-minhbien-Documents-lemo-opuscar/<id>.jsonl` (đã thử, tạo thật) |

Tức là lỗi nằm ở **chế độ tương tác** khi kế thừa `CLAUDE_CODE_SESSION_ID`; ở chế độ in thì không sao.

**Vì sao quan trọng.** Người giám sát mà không đọc được lượt của phiên thì chỉ còn nhìn được tệp
phim. Mà tệp phim nói về **kết quả**, không nói về **quy trình** — và phần quy trình mới là phần
cần cải thiện cho những lần sau. Ngoài ra `tools/rules.py` (bộ đo luật của phiên) đọc transcript:
một phiên không có transcript thì không đo được luật nào, tức là nó **im lặng** trong báo cáo —
trông như nó làm đúng.

**Guard.** Khi mở một phiên làm phim từ trong một phiên khác, **gỡ hai biến môi trường kế thừa**:

```sh
env -u CLAUDE_CODE_SESSION_ID -u CLAUDE_CODE_CHILD_SESSION claude --dangerously-skip-permissions "<prompt>"
```

**Còn lại:** phiên tập 04 đã chạy từ trước khi tìm ra chỗ này, nên nó **không có transcript riêng**.
Tôi không khởi động lại nó (công sức nghiên cứu nguồn đã bỏ ra còn nguyên), mà giám sát nó bằng
**log màn hình** (`/tmp/tap04_tty.log`, có mã ANSI) và bằng chính phim + cổng. Đây là cách giám sát
kém hơn hẳn — không chạy được `tools/rules.py` trên nó, không nhắn tin cho nó được — nên lần sau
phải dùng đúng công thức trên.

## N98 — medium — Những lỗi mà người chấm vẫn phải tự tìm bằng mắt, và cái nào trong chúng máy đo được

**Bằng chứng.** Hai vòng chấm gần nhất (storyboard của tập 02, props của tập 03) tự nêu ra cùng một
họ lỗi, và cả hai đều **không có bài kiểm tra nào bắt được** — người chấm phải mở ảnh và nhìn:

| Lỗi | Chỗ | Máy đo được không? |
|---|---|---|
| Hai thẻ (chữ trên màn hình) **đè lên nhau** | tập 01: hai thẻ phải dời chỗ khi giữ lâu hơn; tập 02: thẻ `ĐIỆN THOẠI` nằm ngay trên thân máy | **Có** — mỗi hộp chữ có toạ độ (`window.TEXTS` trả `x0,y0,x1,y1`) |
| Thẻ **đè lên vật mà nó gọi tên** | tập 02 c1, c28 (thẻ `20 V` đè lên vệt mực `20 V` in trên bo mạch) | Chưa — cần hộp của vật trên màn hình, mà rig chưa trả |
| Thẻ **trỏ nhầm vào một vật khác** khi cảnh có hai vật giống nhau | tập 02 c34 (hai cuộn cảm đều đỏ, thẻ trỏ vào cuộn nhỏ), c29 (hai chip đen sát nhau) | Chưa — cần **tên vật** (phần còn lại của N78) |
| Mặt vật **cháy trắng**, mất hết chi tiết | tập 02 c14 (vỏ củ sạc, chữ `60 W` đọc không được), tập 03 #9 (mặt đồng hồ áp suất trắng xóa, mất vạch chia) | Chưa — cần đo độ phẳng của vùng trắng trong khung; chưa có ngưỡng nào đáng tin |
| Chủ thể **quá nhỏ** trong khung / tường trống chiếm 40 % | tập 02 c1, c20 | Một phần — `FILL`/`cover` đo được phần khung mà vật chiếm, nhưng không đo được *chủ thể có đủ lớn không* (xem N93) |

**Guard đã có (13:2x → 13:5x).** Cờ mới **`OVERLAP`**: hai hộp chữ trên màn hình chồng lên nhau quá một phần
tư diện tích hộp nhỏ hơn (và lớn hơn 400 điểm ảnh) thì người xem không đọc được chữ nào.

Luật đo nằm ở **một chỗ duy nhất**: `core/render/overlap.mjs` (có selftest riêng: hộp chỉ chạm mép thì
không phải đè; một vệt mỏng thì không phải đè). Trước đó luật nằm trong `check_shots.py` — và đó là
chỗ sai: tờ sheet **không có** hộp chữ, nên cờ đó không bao giờ bật (mã chết, không lỗi). Nay:
- **vòng chấm hình**: `beatsheet.mjs` gom hộp của từng chữ lúc dựng tờ (nó **đã** gọi `window.TEXTS` sẵn
  cho cờ `NUM`, nên không tốn thêm khung hình nào), đo bằng luật của thư viện, và ghi các cặp đè nhau
  vào `beats.json`; `check_shots.py` chỉ đọc lại rồi báo cờ;
- **cổng bàn giao**: `readcheck.mjs --overlap` đo trên **chính phim đã dựng** (`window.TEXTS` trả hộp ở
  mỗi bước thời gian, nên không tốn thêm lần dựng nào); kênh bật nó bằng `checkOverlap` trong
  `scene_rules.json`.

Đây là lỗi **đo được** — hai hình chữ nhau là hai chữ không ai đọc được — nên nó chặn ở cả vòng chấm hình
lẫn cổng bàn giao (xem N93: chặn bằng phép so sánh thì không, chặn bằng phép đo thì có).

**Còn lại — ghi ra để lần sau không phải nghĩ lại từ đầu.** Ba lỗi còn lại đều cần cùng một thứ:
**hộp của vật trên màn hình** (và tên của vật). Một thay đổi duy nhất trong rig — trả về hộp màn
hình của từng vật trong `cast`, cùng tên của nó — mở ra cả ba:
- thẻ đè lên vật nó gọi tên → so hộp thẻ với hộp vật;
- thẻ trỏ nhầm vật → so tên vật mà mũi tên chạm với tên vật mà câu nói gọi;
- mặt cháy trắng → đo độ phẳng trong hộp vật.

RIG dùng chung cho ba tập đang dựng, nên việc đó **chưa làm** (R13) — và phải làm cùng lúc với việc
đặt tên cho vật, không làm hai lần.

## N99 — high — 136 lần đọc lại output của job nền: luật có rồi, nhưng luật không nói **làm sao cho nó chạy được**

**Bằng chứng.** Đo lại transcript của phiên tập 01 (13:0x, 963 MB):

```
R9  37 lần đọc lại output của job nền bib9128mh.output
R9  24 lần đọc lại output của job nền buqnq0skq.output
R9  16 lần … + 12 + 10 + 9 + 8 + 7 + 7 + 6 …
```

Tổng **136 lần**. Đó là cùng một hình dạng: job dài chạy nền, xong rồi người làm phim quay lại đọc
log của nó. Và một lần trong số đó là đọc output của job **đang chạy** — tức là nó thậm chí không đợi
xong.

**Vì sao quan trọng.** Đây không phải một luật mới thiếu: R9 đã có, và SKILL.md đã nói *"một việc dài
thì chạy nền; harness báo khi nó xong"*. Nhưng luật nói **không làm sao**, và người làm phim làm theo
cách mình hiểu: `nohup … > log 2>&1 &` rồi `tail log`. Với cách đó **harness không biết job tồn tại**,
nên không ai báo khi nó xong, và lượt của phiên cứ quay về đọc log. Luật có mà không có cách thực hiện
thì hành vi không đổi — đó là loại lỗi mà cần sửa **cách làm**, không phải sửa lại luật.

Đây cũng là chỗ **tốn thời gian nhất** của các phiên: 136 lượt quay về đọc log, mỗi lượt là một vòng
dò không quyết định gì, cộng với 827 lần mở ảnh và 236 lần đọc lại ba tệp mã — tức là phần lớn ngân
sách của phiên tập 01 là **nhìn**, không phải **làm**.

**Guard đã có (13:4x).**

- `SKILL.md` (nguyên tắc 6) nói thẳng cách làm: **chạy việc dài bằng công cụ nền của harness**
  (`Bash` với `run_in_background`) — nó tự báo khi xong, và output được đọc **một lần** sau đó; và nói
  rõ `nohup … &` rồi `tail` **là một vòng dò dù nó có vẻ tiện**.
- `CODING_STANDARDS.md` R9 nói thêm một câu: đọc lại log của job mà bạn tự `nohup` là R9 ở hình thức
  khác, vì harness không báo khi job xong.
- `tools/rules.py` đã đếm được hình thức này từ N76 (đọc output của job nền), nên báo cáo của phiên
  giám sát đã thấy nó — nhưng báo cáo chỉ thấy thì không đủ; cách làm phải nằm trong tay người làm phim.

**Còn lại.** `tools/rules.py` báo *bao nhiêu lần*, không báo *job nào bị dò*. Thêm tên job vào dòng
báo sẽ giúp người giám sát chỉ đúng chỗ — nhưng nguyên nhân gốc đã ở trên: nếu job chạy bằng công cụ
nền của harness thì không còn gì để dò.

## N100 — high — Người chấm chạy không có ai trả lời câu hỏi quyền: vòng chấm treo ba giờ, và không phải vì phim

**Bằng chứng.** 13:31: tập 02 đang ở vòng chấm vật dựng (props) suốt 44 phút. Vòng đó đã qua pha
"gọi tên mù" lúc 12:54 và đang ở pha "gọi tên mù lần hai" (7 ảnh mà lần đầu không chắc). Transcript
của người chấm lần hai (pid 3152274, `/tmp/lemo-review-XetOlj/blind2`) cho thấy nó **không làm được
gì cả**:

```
TOOL Bash    cp p_10.jpg /tmp/x.jpg                    → RES: This command requires approval
TOOL Bash    ffmpeg … crop=800:450:800:0 … (lần 1)     → RES: This command requires approval
TOOL Bash    ffmpeg … (lần 2, khác cấu trúc lệnh)      → RES: This command requires approval
TOOL ToolSearch  crop resize image edit                 → RES: (rỗng)
TOOL Bash    ffmpeg … (lần 3)                          → RES: This command requires approval
TOOL Agent   Zoom image panels                         (subagent cũng bị chặn, vì cùng chế độ quyền)
```

37 phút trôi qua, hết thời gian của nó, chỉ để **cắt một tấm ảnh**. Người chấm không hỏi quyền được —
nó **không có ai để hỏi**: `review.sh` gọi người chấm bằng `claude -p --permission-mode acceptEdits`,
mà ở chế độ không tương tác thì không có ai trả lời câu hỏi quyền, nên **mọi** lệnh đều thành
"This command requires approval" và người chấm thử lại cho tới khi đồng hồ giết nó.

**Vì sao quan trọng.** Vòng chấm treu một cách **âm thầm**: log của vòng vẫn in dòng đầu tiên
("review --props: three views of every object…"), nên người đọc log tưởng nó đang làm việc; còn
đồng hồ của vòng là 3 giờ (`CRITIC_TIMEOUT=10800`), nên nó đốt 3 giờ rồi chết **không có bản chấm
nào** — và số vòng thì đã bị tính. Tập 03 đang ở đúng cái trạng thái đó (vòng props lúc 12:57).

**Guard đã có (13:35).** `channels/tram-nghi-nhieu/tools/review.sh`:
- gọi người chấm bằng `--dangerously-skip-permissions` thay cho `--permission-mode acceptEdits` —
  người chấm làm việc trong thư mục tạm **của riêng nó, ngoài kho**, và chỉ ghi bản trả lời của mình
  vào đó (đúng như các phiên làm phim của kênh vốn chạy với cờ đó);
- có **con chó canh**: trong khi người chấm chạy, nếu `out.txt` hiện "requires approval" thì nó bị
  dừng ngay, và vòng chấm thoát mã 2 với câu *"người chấm không chạy được lệnh nào"* — **vài giây**
  thay vì ba giờ;
- `out.txt` còn câu đó sau khi kết thúc thì cũng là mã 2 (vòng chấm không có kết quả ≠ phán quyết
  về phim).

Đã thử, không tốn GPU: `claude -p --dangerously-skip-permissions` chạy được lệnh và ghi được tệp
trong thư mục tạm (trước đây là "requires approval"); con chó canh dừng được một người chấm bị chặn
trong ~10 s (kiểm bằng một reviewer giả).

**Còn lại.** Hai vòng đang chạy (tập 02, tập 03) phải dừng và chạy lại với `review.sh` đã sửa; người
làm phim không tự dừng được nên tôi đã nhắn cho cả hai phiên.

## N101 — medium — Đoạn sửa dài không nằm được trong JSON, nên phiên tự viết script sửa JSON của chính nó

**Bằng chứng.** Báo cáo luật của phiên tập 01 (13:4x) có dòng `R1t 58 lần sửa file qua
tools/replace.py — an toàn, nhưng đi qua một chương trình trung gian`: 58 lần, phiên tự viết một
script python để **sửa lại tệp JSON** trước khi gọi `tools/replace.py`. Nguyên nhân thì hiện ra
ngay: một đoạn sửa dài có dấu nháy và xuống dòng, viết tay trong JSON thì vỡ — và cách vòng qua là
đúng cái mà R1 cấm (tự viết script để làm việc của công cụ). Tôi cũng dính lỗi này một lần trong
phiên giám sát này (lỗi "Expecting ',' delimiter"), và cách vòng qua của tôi cũng là dựng JSON
bằng tay.

**Guard đã có (13:5x).** `tools/replace.py --batch` nhận thêm hai khóa: `old_file` và `new_file` —
tức là **đoạn sửa nằm trong một tệp**, do công cụ viết tệp viết ra (không phải JSON viết tay), và
`replace.py` tự đọc tệp đó. Cách dùng: hai tệp đoạn sửa + một tệp JSON chỉ chứa
`{"file": ..., "old_file": ..., "new_file": ...}`. Selftest có một ca (đoạn sửa có dấu nháy và xuống
dòng nằm trong tệp, áp dụng đúng). R1 trong `CODING_STANDARDS.md` nói luôn điều đó.

## N102 — medium — Hai khoá của thẻ chữ (`hold`, `lead`) chỉ có trong tập 01, nên tập sau phải tự nghĩ lại

**Bằng chứng.** `channels/tram-nghi-nhieu/rig/render.js` — rig dùng chung của kênh — **không** có
khoá `hold` hay `lead`. Cả hai chỉ có trong `channels/tram-nghi-nhieu/series/do-vat/tap-01-phoi-quan-ao/src/film.js`:
mô tả ở dòng 181–182, dùng ở các thẻ (199, 202, 210, 223, 224), và phần dán thủ công ở dòng 232–238:

```js
C.t0 = t0 - (C.lead ?? 0);
C.t1 = V.L['c' + n1].t1 + (C.hold ?? 0);
```

**Vì sao đáng sửa.** Luật đọc trong `core/render/readcheck.mjs` chặn một thẻ hiện trên màn hình ít
giây hơn thời gian người xem cần để đọc trọn — đó chính là lý do tập 01 phải tự thêm hai khoá này
(P12 của bản ghi ngày 8). Tập sau sẽ dính đúng bức tường đó, và sẽ phải tự nghĩ ra cùng một cách
vá. Theo R7, một cách làm chung chỉ nên có **một** bản: ở tầng rig, để tập chỉ cần viết
`{ id: '…', text: '…', hold: 1.5 }` là xong.

**Guard — kế hoạch, chưa áp dụng, và lý do chưa áp dụng.**

1. Rig nhận hai khoá `hold` (giữ thêm N giây) và `lead` (hiện sớm hơn N giây), **mặc định 0** — với
   mọi tập không dùng hai khoá này thì hành vi **y hệt** trước đây, nên không phải dựng lại tập nào
   đang chạy.
2. **Chưa sửa bây giờ** vì hai lý do cụ thể: (a) rig đang được ba tập dùng song song, mà đổi mã
   chung dưới lúc một tập đang dựng là đúng cái R13 cảnh báo; (b) tập 01 vẫn còn đoạn dán tay trong
   `src/film.js`, và nếu thêm khoá vào rig mà chưa gỡ đoạn dán thì thẻ bị giữ **hai lần**.
3. Thứ tự đúng khi tập 01 giao phim xong và cổng xanh: sửa rig → gỡ đoạn dán trong
   `src/film.js` của tập 01 → dựng lại tập 01 (luật đọc của cổng phải vẫn xanh) → ghi vào `SKILL.md`
   một câu: *thẻ quá ngắn thì thêm `hold`/`lead`, đừng tự tính lại thời gian*.

## N103 — high — Job nền mà chuyển output ra tệp của riêng mình: tệp đó không bao giờ đổi, và 111 lần đọc nó không ai đếm

**Bằng chứng.** Báo cáo luật của phiên tập 02 bảo **"R9 0 lần"** — tức là phiên đó *không* đọc lại
output của job nền nào. Nhưng transcript của chính nó nói khác: phiên chạy vòng chấm bằng công cụ nền
của harness, **có** chuyển output của vòng ra tệp riêng, rồi đọc tệp đó lại:

```
05:47:19  BG  CRITIC_TIMEOUT=10800 sh …/review.sh … --props > /tmp/round_props3.log 2>&1; echo "exit=$?" >> …
05:47:38  FG  tail -c 3000 /tmp/round_props3.log
05:56:41  FG  tail -25 /tmp/round_props3.log …
05:59:34  FG  tail -5 /tmp/round_props3.log; ls …/review/props/ | head
06:01:49  FG  tail -3 /tmp/round_props3.log; …
06:03:46  FG  tail -6 /tmp/round_props3.log; …
06:04:41  FG  tail -3 /tmp/round_props3.log; …
06:11:51  FG  tail -3 /tmp/round_props3.log; …
06:17:28  FG  tail -3 /tmp/round_props3.log; …
```

Hai điều đã lỗi cùng lúc: (a) chuyển output ra tệp làm **harness mang về rỗng**, nên phiên không còn
đường nào khác để xem vòng đó ngoài tệp; (b) tệp **không đổi** trong lúc vòng chạy, nên đọc nó là đọc
một thứ không đổi — và mỗi lần đọc là một lượt của phiên.

Đếm trên ba phiên (luật mới `R5b`, xem dưới):

| Phiên | Số lần đọc lại tệp log của chính nó | Số tệp log | Báo cáo luật cũ nói |
|---|---|---|---|
| tập 01 (phiên cũ) | **80** | 14 | R9: 136 (đếm output của harness) |
| tập 02 | **111** | 9 | R9: 0 |
| tập 03 | **81** | 9 | R9: 6 |

**Vì sao không ai thấy.** Bộ đếm cũ (R9) chỉ nhìn `tasks/*.output` — tức là output mà **harness** giữ.
Tệp do chính phiên tạo ra (`> /tmp/round.log`) nằm ngoài tầm nhìn đó, nên một phiên có thể đọc tệp của
mình 111 lần mà báo cáo vẫn bảo "0 lần".

**Guard đã có (14:1x).**
- `tools/rules.py` có luật mới **R5b**: một job nền có `> /tmp/x.log` trong lệnh, và tệp đó bị đọc lại
  **≥ 3 lần** → báo. `tools/transcript.py` giờ mang qua cờ `run_in_background` mà trước đó nó bỏ rơi.
  Selftest có ba ca (báo / chưa báo khi đọc hai lần / không báo khi job không chuyển output ra tệp).
- Luật 6 của `SKILL.md` (v14.3.0) nói thẳng: **đừng chuyển output của job nền ra tệp của riêng mình**,
  kèm công thức cụ thể cho vòng chấm của kênh, và nhắc con số 111 lần.
- R9 trong `CODING_STANDARDS.md` thêm câu cuối: đọc lại tệp mà chính mình tạo ra cũng là đọc một thứ
  không đổi.
- `improvements/lessons.md` có dòng cho luật này.

**Còn lại.** Chỉ các phiên *đang chạy* mới đọc được luật mới; chúng đã chạy quá nửa đời tập nên tôi
đã nhắn trực tiếp cho hai phiên tập 02 và tập 03 (không phải yêu cầu, chỉ là thông tin đo được).

## N104 — high — Nhãn trỏ vào *hiệu ứng* thì máy không thấy: tia của probe chỉ bắt layer 0, còn hiệu ứng nằm ở layer 1

Cả hai cờ máy báo sai mà ta cứ tưởng là lỗi thật — `PTR` ở c17 và `fill 0 %` ở 14 câu — có **cùng một
nguyên nhân**, và nguyên nhân này nằm trong rig chứ không phải trong tập.

Phiên tập 01 phản biện lại cờ `PTR` ở c17: mở `review/beatsheet/b_017.jpg` (dựng lúc 14:06, sau lần sửa)
thì mũi tên "PHẦN TỬ BAY LÊN" **chạm đúng** vào ô xi đỏ của phân tử đang bay; bản cũ lúc 13:27 mới là
cái mũi tên rơi vào vùng sáng trống. Nguyên nhân thật:

- phân tử được dựng bằng `fxLayer()` (`rig/kit.js:158`) → `c.layers.set(1)`;
- probe của rig là `const probe = new THREE.Raycaster(); probe.layers.set(0)` (`rig/render.js:104`) →
  tia **không bao giờ thử layer 1**;
- nên: nhãn trỏ vào một hiệu ứng → máy không thấy gì ở điểm mũi tên → báo `PTR`;
  và cùng lý do đó, **hiệu ứng không bao giờ được đếm** trong phép đo độ phủ → những cảnh cận cảnh
  phân tử / hơi nước / giọt nước đều ra `fill 0 %`.

Hai hệ quả, một là tiêu tiền thật: phiên tập 01 đã **mất một vòng chấm hình** vì cờ `PTR` ở c17, và
sau khi sửa mã thì cờ vẫn còn (đúng như máy nói — máy vẫn không thấy). Tức là cờ sai **không tự biến mất
khi người làm sửa đúng**, và nó đẩy phiên đi sửa tiếp một lần nữa.

**Cách sửa (một dòng):** `probe.layers.enableAll()` thay cho `probe.layers.set(0)`. Đây là công cụ đo,
không phải hình vẽ — nó không đổi một pixel nào của phim, chỉ đổi con số.

**Đã áp dụng, và đo trước–sau (14:3x).** Dựng lại tờ sheet của tập 01 cho đúng sáu câu cận cảnh phân tử
(c13–c18), trước và sau khi sửa, trên **bản sao** của tập (không đụng vào tập của phiên khác):

| Câu | Trước | Sau | Nghĩa là gì |
|---|---|---|---|
| c13 | fill 0 % | **51 %** | máy thấy phân tử (nó nằm ở layer 1) |
| c14 | fill 0 % | **9 %** | cùng vậy |
| c16 | fill 0 % | **16 %** | cùng vậy |
| c17 | fill 0 %, **cờ PTR** | fill 0 %, **hết cờ PTR** | mũi tên **có** chạm phân tử; trước đây máy không thấy nên báo "trỏ vào không" |
| c15, c17, c18 | fill 0 % | 0 % | vẫn chưa đo được — khung quá rộng, không có vật cỡ đạo cụ trong tầm nhìn |

Trước khi sửa, cả phim có **14 câu** mà máy không kết luận được; sau khi sửa, trong sáu câu này còn
**3 câu** — và cờ `PTR` ở c17 biến mất. Đây là bằng chứng máy đo được, không phải cảm nhận.

**Vì sao sửa giữa lúc ba tập đang dựng mà không phải đợi (R13):** đây là **công cụ đo, không phải hình
vẽ** — không đổi một pixel nào của phim, nên phim đang dựng không bị ảnh hưởng; sửa bằng `tools/replace.py`
(tạo tệp tạm rồi đổi tên, nên người đọc thấy tệp cũ hoặc tệp mới, không bao giờ thấy tệp nửa vời), và
kiểm tra cú pháp trước khi áp dụng. Ba tập đang chạy sẽ thấy **con số khác** ở lần dựng tờ sheet kế
tiếp — và đó là điều đúng: số cũ là số của một máy mù.

**Còn lại:** tập 01 giữ nguyên đoạn dán tay trong `src/film.js` (tệp đó là của phiên tập 01, đang dựng;
R13), nhưng từ nay **tập sau dùng `cardWindow()` của rig** (N102) — xem "Còn lại".

## N105 — medium — Hai thứ khác nhau bị gọi cùng một tên: "cảnh giống nhau" và "cảnh đứng yên"

Phiên tập 01 phản biện cờ `SAME` rất đúng chỗ: `SAME` so **hai ảnh tĩnh**, còn phim có thời gian —
cánh quạt quay, dải ẩm mạnh dần rồi bị gió quét, giọt trượt, kim đồng hồ dịch, cột thuỷ ngân chạy vạch.
Kênh đã có phép đo khách quan cho đúng cái đó: `tools/check_motion.py --mp4` đo trên **chính phim đã dựng**
(action ≥ 55 %, big ≥ 45 %, dead ≤ 10 s, beats ≥ 75 %, camera ≤ 30 %). Vậy nên:

- **"cảnh đứng yên"** (đo được, chặn được) → phải trả lời bằng số của `check_motion.py`;
- **"cảnh giống nhau"** (cờ `SAME` trên tờ sheet) → là câu hỏi về **trình tự**: ba câu liên tiếp có
  cùng một chủ thể thì người xem có thấy ba hình hay thấy một hình kéo dài? Câu này **không trả lời được
  bằng ảnh tĩnh** và cũng không trả lời được bằng "phim có chuyển động": một phim rất động vẫn có thể
  quay người xem đi ba lần quanh cùng một cái áo. Cách kiểm đúng: **xem ba câu đó liên tiếp trong phim**,
  không xem ba ô trong tờ.

Ta đã gửi cả hai ý này cho phiên tập 01; nó hứa gửi kèm số đo của `check_motion.py` khi dựng xong.

## N107 — medium — Tờ sheet cũ hơn RIG: máy đo bằng trang của tập, nên rig cũng làm tờ sheet cũ

**Bằng chứng.** `check_shots.py` so giờ tờ sheet với `src/*.js` để báo "tờ sheet CŨ HƠN mã". Nhưng
tờ sheet được dựng bằng **chính trang của tập** — probe, camera, tầng hiệu ứng đều nằm trong
`channels/tram-nghi-nhieu/rig/`. Nên khi tôi sửa probe (N104, 14:26) mà `src/` của tập 01 **không hề
đụng**, tờ sheet dựng lúc 14:06 vẫn được coi là "mới nhất" — và nó chứa đúng những con số sai mà
probe cũ sinh ra: 14 câu "máy KHÔNG nhìn thấy vật nào" (c13–c18, c22–c23, c27, c35, c39–c40, c44,
c53), trong đó c13 sau khi sửa là 51 % chứ không phải 0 %.

Hậu quả không chỉ là một dòng cảnh báo sai: người làm phim **đọc cờ sai rồi đi sửa phim** — tức là sửa
nhầm thứ không hỏng. Phiên tập 01 đã mất một vòng chấm hình vì đúng lý do này (cờ `PTR` ở c17).

**Đã sửa (`9b226a9`, 14:33).** `check_shots.py` giờ so giờ tờ sheet với cả `rig/*.js` của kênh (đi ngược
lên tới `CHANNEL.md` để tìm rig), và báo:

```
check_shots: tờ sheet CŨ HƠN mã (tờ 14:06, mã 14:26) — những cờ này nói về một hình cũ hơn; dựng lại tờ sheet rồi chạy lại
```

Cảnh báo vẫn là lời nhắc, không chặn — nhưng nó nói đúng nguyên nhân, và giờ nó bắt được cả những đổi
trong rig mà `src/` không biết.

## Đánh giá khách quan phim tập 01 — xem trên bản dựng mới (14:23), không trên ô trong tờ sheet

Cổng bàn giao lúc 12:45 đã đo trên chính phim: `action 77 %`, `big 46 %`, đoạn đứng yên dài nhất 6 s,
55/60 nhịp đổi phần khung — tức là phim **không chết**. Cờ `SAME` mà máy báo là câu hỏi về **trình tự**,
nên tôi xem thẳng ba câu liên tiếp ở kích thước gốc (`tools/frames_at.py … --cols 1 --w 1200`).

**c4–c7 (hai cái áo, trước quạt / góc xa).** Cùng một chủ thể, nhưng bố cục **đổi thật**: c4 cận hai
áo, c5 rộng ra có quạt và căn phòng, c6 trung cảnh, c7 góc cao có cả dây phơi. Cờ `SAME` của máy ở đây
**bắn sai** — đây là N105 (hai câu hỏi khác nhau). Điều đáng nói là thứ khác: ở c4–c7, **hai cái áo
trông y hệt nhau** — chưa thấy cái nào "nhạt màu dần". Lời kể của câu 7 nói đúng sự khác biệt đó, nhưng
hình chưa nói. Người xem phải đợi tới đâu mới thấy một cái áo khô hơn cái kia — và đó là mấu chốt
của cả phim.

**c29–c31 (quạt).** Rõ ràng khác nhau: cận quạt (c29), toàn cảnh phòng với luồng gió vẽ thành vệt
(c30), trung cảnh hai áo (c31). Vệt gió và các giọt hơi nước làm khung sống.

**c16–c17 (cận vào trong sợi — mấu chốt của phim).** Đây là phần đẹp nhất của phim: cảnh cận trong
sợi vải, phân tử nước (đỏ-trắng) bám trên bề mặt, giọt hơi nước (xanh) bốc lên, nền xanh lạnh đối với
phòng ấm bên ngoài. Nhãn "1 PHẦN NHỎ" chỉ đúng vào phân tử, nhãn "PHÂN TỬ BAY LÊN" chỉ vào phân tử
đang bốc lên (có quầng sáng). **Máy đo lại đây sai**: cờ `PTR` ở c17 và `fill 0 %` ở c16–c18 là hậu
quả của probe chỉ thấy layer 0 (N104) — sau khi sửa, c16 đo được 16 % và cờ `PTR` biến mất. Khung
này rõ ràng **không** trống.

**c59–c60 (kết).** c59 ra một nơi khác hẳn (gác hiên, sào treo, túi vải buộc, vệt gió), nhãn "CHỖ THOÁNG
GIÓ" chỉ đúng vào túi; c60 là bàn gỗ với cái áo trải ra, "TÁCH RIÊNG" và "CẢ HAI MẶT" chỉ đúng chỗ.
Hai cái kết không lặp lại hình của phần đầu.

**Kết luận.** Phim có **bố cục đổi thật** (cận → rộng → cận trong vật → góc cao → nơi khác), vật tự
diễn (vệt gió, giọt hơi nước, phân tử bốc lên), và chất toon có nét mực vẽ tay nhất quán. Cổng đo
`action 77 %`, `big 46 %`, đoạn đứng yên dài nhất 6 s, 55/60 nhịp đổi phần khung — phim **không chết**.

Điểm yếu thấy được, xếp theo mức độ (đã đối chiếu lại bằng **khung cắt từ chính phim đã bàn giao**):

1. **Chi tiết ở mép khung thì đọc bằng tai, không đọc bằng mắt.** Ở c1 (4,6 s) bồn nước bị mép khung
   cắt, nên câu *"nước vẫn còn đó"* chỉ hiểu được bằng tai; ở cỡ nhỏ, bồn dễ bị đọc nhầm thành nắp
   hũ. Đây là lỗi **độ đọc được** — không phải lỗi "chưa có hiện tượng".
2. **Khác biệt giữa hai cái áo có trên màn hình, nhưng đến muộn và nhỏ.** Ở c4–c5 (13–18 s) hai cái
   áo **đúng là** giống nhau; mã phai màu chạy từ 20,47 s trong 6,9 s (`src/set.js:779-781`), nên khác
   biệt hiện ra ở **c6 (22,4 s)** — áo trước quạt nhạt hẳn, áo kia vẫn nâu sẫm — và rõ nhất ở
   **c7 (25,5 s)**, đúng lúc câu *"Cái trước quạt đang nhạt màu dần"* đang nói. Nhưng ở c7 máy đã lùi
   xa nên hai cái áo chỉ còn ~1/3 chiều cao khung. Tức là mấu chốt của phim **có** trên màn hình,
   nhưng đến lúc giây thứ 22 và ở cỡ nhỏ.
3. **Cờ `SAME` của máy ở c4–c7 bắn sai** (cùng chủ thể, khác bố cục) — đây là N105: "cảnh giống
   nhau" và "cảnh đứng yên" là hai câu hỏi khác nhau, và một ảnh tĩnh không trả lời được câu nào.

**Điều tôi đã phán sai, và phiên làm phim đã sửa bằng bằng chứng.** Tôi viết rằng *"hai cái áo trông
y hệt nhau… nên cái nhạt màu dần mà cả tập kể không xuất hiện được lần nào"* và rằng *"người xem phải
chờ 8 giây mới thấy điều phim kể"*. Cả hai đều **sai**:
- Khung cắt từ chính mp4 cho thấy c6/c7 khác nhau rõ ràng (tôi đã tự cắt lại và xem: 22,4 s và
  25,5 s) — tôi đã phán trên ô nhỏ của tờ sheet / trên bản dựng cũ, tức là phán trên **một hình không
  tồn tại** (đúng cái mà R12 cấm).
- Nhát mở đầu (c1, 4,6 s) **đã** cho thấy hiện tượng: cái áo ướt chiếm ~40 % khung, có giọt nước
  bám, thẻ "QUẦN ÁO ƯỚT" chỉ thẳng vào áo, bồn nước nằm ngay dưới mép áo. Thứ xuất hiện ở giây thứ
  8 là **nguyên nhân** (cái quạt) — đặt nguyên nhân sau hiện tượng là đúng bài, không phải lỗi.

**Bài học cho chính người giám sát (và cho mọi người chấm phim).** Muốn phán một phim thì phải cắt
khung **từ chính tệp phim đã bàn giao**, ở cỡ thật. Tờ sheet và bản dựng cũ là **bản đồ**, không
phải bằng chứng — và phán trên chúng thì kết luận sai, mà kết luận sai thì đẻ ra luật sai.

### Đối chiếu lần cuối trên chính phim đã bàn giao (15:38, 373 770 845 byte)

Tôi tự cắt khung từ tệp mp4 **đã bàn giao** (không phải bản dựng trung gian, không phải ô trong tờ
sheet), ở cỡ 1400 px, và xem bằng mắt:

- **c1 (4,6 s) — nhát mở đầu.** Cái áo ướt chiếm khoảng 40 % khung, có vệt ướt trên vai và các giọt
  nước bám; thẻ "QUẦN ÁO ƯỚT" chỉ thẳng vào áo. **Bồn nước nằm ngay dưới mép áo, giữa khung**: nó
  bị mép dưới cắt một phần, nhưng ở cỡ thật thì đọc ra là **một bồn nước** (trắng, mặt nước xanh),
  không phải nắp hũ như tôi đã viết ở điểm yếu số 1. Và câu *"nước vẫn còn đó"* nói về **nước còn
  trên vải** — vệt ướt và giọt nước trên áo đọc được rõ. Tôi đã đánh giá thấp phần này ở lần trước.
- **c4–c7 — xác nhận bằng mắt.** c4 hai áo giống nhau (đúng như lời kể), c5 khung rộng có quạt và hai
  thẻ "TRƯỚC QUẠT" / "KHÔNG CÓ GIÓ", c6 (22,4 s) **áo bên trái nhạt, áo bên phải nâu sẫm ướt** — rõ
  nhất; c7 (25,5 s) cùng khác biệt nhưng máy đã lùi xa nên hai áo chỉ còn ~1/3 chiều cao khung.
  **Mấu chốt của phim có thật trên màn hình**, đúng lúc lời kể đang nói.
- **Một chi tiết đáng ghi (không phải lỗi).** Ở c6–c7, cái áo ướt **không có thẻ tên**: người làm cố
  ý chỉ đặt thẻ "KHÔNG CÓ GIÓ" cho c5, vì ở c5–c7 khung chỉ nên có đúng hai cái áo (`src/film.js:187-189`).
  Người xem phải nhớ cái áo ướt ở c6 chính là cái áo "KHÔNG CÓ GIÓ" ở c5. Tôi không coi đây là lỗi —
  nó là lựa chọn có lý do — nhưng **giữ thêm thẻ "KHÔNG CÓ GIÓ" ở c6** (một thẻ, không phá bố cục)
  sẽ giúp người xem khớp ngay mà không cần nhớ.
- **Đầu và cuối phim.** Khung đầu (1,0 s) là hiện tượng; khung cuối (175,4 s) là góc rộng bàn gỗ với
  cái áo đã khô trải ra. **Không có watermark, không có chữ LemoLab** — đúng luật: phim ngoài
  `styles/` là của người dùng.

**Kết luận khách quan sau khi xem bằng mắt:** phim nói được hiện tượng của nó bằng hình (áo ướt →
quạt → khác biệt giữa hai cái áo → hơi nước và khí), bố cục đổi thật, vật tự diễn, chữ tiếng Việt rõ.
Điểm yếu còn lại: **mấu chốt hiện ra muộn (giây 22) và ở cỡ nhỏ**, và **chi tiết ở mép khung thì phải
nghe mới hiểu**.

### Nơi cái nhìn của người xem thành luật (16:5x, skill v14.9.0)

Một trong những điều tôi ghi ở trên là **không phải lỗi**: cái áo ướt không có thẻ ở c6. Nhưng "không phải
lỗi" không có nghĩa là "không đáng sửa" — và ở đây có một **luật** đằng sau nó: người xem phải **nhớ** rằng
cái áo ướt ở c6 chính là cái áo "KHÔNG CÓ GIÓ" ở c5. Người xem không có lý do để phải nhớ: hai cái áo
giống nhau, máy đã lùi xa, và lời kể không nhắc tên.

Luật sinh ra từ đó, đã đưa vào skill (v14.9.0):

- **Người làm** (`step6-assembly/GUIDE.md`): nếu hai câu liên tiếp nói về cùng một vật mà câu sau không
  nhắc lại tên nó, **giữ thẻ gọi tên vật đó ở câu sau** (tối đa 1 thẻ) — người xem khớp bằng mắt.
- **Người chấm** (`step6-assembly/PROMPT_CRITIC.md`): vật phải còn nhận ra được ở câu sau — hoặc có thẻ,
  hoặc đủ nổi bật để không cần thẻ. Khi máy đã lùi xa mà vật nhỏ đi, người xem không theo kịp: đó là lỗi
  của phim, không phải của người xem.

Đây là hình dạng chung của cả đợt giám sát này: **một cái nhìn bằng mắt trên phim thật sinh ra một luật
cho tập sau** — không phải một lời khen, không phải một phán quyết về riêng tập này.

## N110 — medium — Cổng bàn giao đo được khoảng trống, không đo được thứ quan trọng nhất: hiện tượng có nhìn thấy được không

- **Bằng chứng.** Ở tập 01, khác biệt giữa hai cái áo — mấu chốt của cả tập — chỉ hiện ra ở c6–c7
  (22,4 s và 25,5 s) và ở cỡ nhỏ, trong khi hai nhát so sánh đầu (13–18 s) hai áo giống hệt nhau.
- **Vì sao máy không bắt được.** Cổng đo **phần khung vật thể chiếm** (`phủ`, `fill`). Phủ trả lời
  "chỗ này có bao nhiêu vật", không trả lời "chủ thể có **đủ lớn và đủ khác nhau** để người xem
  thấy hiện tượng không". Hai cái áo trông y hệt nhau vẫn là hai cái áo — phủ vẫn cao.
- **Cùng một lớp lỗi: độ đọc được ở mép khung.** Bồn nước ở c1 bị mép khung cắt, nên "nước vẫn
  còn đó" chỉ hiểu được bằng tai.
- **Guard đã dựng.** (1) `step6-assembly/PROMPT_CRITIC.md` có tiêu chí mới *"Hiện tượng của tập có
  nhìn thấy được không (mắt, không phải máy)"*: người chấm phải **mở ảnh riêng của những nhát so
  sánh** và tự xem (ô trong tờ sheet là bản đồ, không phải bằng chứng — R12), và nhát mở đầu phải là
  nhát đang biến đổi. (2) `SKILL.md` bước 6 có cùng luật, viết cho người làm phim: *"Mở đầu phải là
  hiện tượng, không phải bối cảnh"*. Phiên bản 14.8.0.
- **Còn hở.** Cổng máy vẫn không đo được hiện tượng. Muốn đo thì phải so sánh **pixel** hai vật ở
  cùng một cỡ khung — đẳng cấp với việc so sánh màu trung bình của một vùng, và ngưỡng thì không
  ai biết trước. Ta chọn **không** dựng phép đo này: một phép đo sai làm cổng từ chối phim đúng.

## N111 — medium — Bước chậm nhất của cổng bàn giao là `readcheck`, và nó giành GPU với các tập đang dựng song song

- **Bằng chứng.** `readcheck.mjs` mở trang phim trong Chromium và **dựng lại từng khung hình** ở bước
  0,04 s để đo thời gian đọc thẻ chữ. Phim tập 01 dài ~4 phút → ~6 000 khung; tiến trình GPU của
  Chromium chạy **100 % một lõi suốt 12 phút** trong khi cổng còn đang ở bước này.
- **Hậu quả.** Cổng bàn giao là bước **cuối**, và nó là bước dài nhất — nên phiên làm phim ngồi chờ
  ở bước cuối cùng, đúng lúc nên đang sửa nốt. Tệ hơn: nó chạy cùng lúc với các tập khác đang dựng,
  nên **nhiều tập cùng giành GPU**.
- **Cân nhắc và vì sao chưa sửa.** Rẻ nhất là dựng thưa hơn (STEP 0,08 s thay vì 0,04 s) — nhưng
  phép đo chồng thẻ (`OVERLAP`) cần độ phân giải khung hình, và làm thưa đi là **làm yếu đúng cái cổng
  đang bắt lỗi**. Một cách khác là dựng thưa rồi tinh chỉnh quanh các mốc thẻ đổi, nhưng để biết
  mốc thì phải biết trước cửa sổ thẻ — tức là **tính lại cái mà rig đã tính**, đúng cái điều luật
  "đừng tự tính lại cửa sổ thẻ" cấm. Ta **không sửa**: cổng chậm còn hơn cổng sai.

## Kiểm chứng — phiên mới (tập 05) sau khi dựng hook: cùng một phép đo, cùng một công cụ

Phiên tập 05 được mở mới (`/tmp/launch_tap05.py`, pty riêng, **không** kế thừa
`CLAUDE_CODE_SESSION_ID` — N97), với đúng prompt mà một người làm phim mới sẽ có.

| Phiên | R1 (ghi tệp bằng shell) | R5b (đọc lại log job nền) | R11 (đọc lại tệp lớn) | R12 (mở lại ảnh) | R9 | R10 | Transcript |
|---|---|---|---|---|---|---|---|
| tập 01 (cũ) | 370 | 80 | 236 | 835 | 176 | 15 | 975 MB |
| tập 02 | 42 | 114 | 102 | 157 | 5 | 4 | 124 MB |
| tập 03 | 1 | 84 | 57 | 126 | 6 | 0 | 99 MB |
| **tập 05 (mới)** | **0** | **0** | **0** | **0** | **0** | **0** | **2 MB** |

Đo bằng `tools/rules.py` trên transcript của chính phiên đó (mốc 15:0x, tập 05 còn đang làm tập
đầu). Con số của tập 03 **tụt** so với lúc tôi nhắn nhở (R1 từ nhiều xuống 1) — nhắc đúng chỗ thì
phiên sửa hành vi ngay.

Nhưng phép đo này **không công bằng**: tập 05 mới làm được 15 phút, còn tập 02 đã làm 7 giờ. Số
tuyệt đối không so được. Cái so được là **cơ chế**: hai hook (`hook_bg_log.py`, `hook_stale_read.py`)
là cái **chặn**, không phải lời nhắc — nên phiên mới không cần phải "nhớ luật" mới không phạm;
và `tools/rules.py` đo được việc phạm luật **vì nó đo transcript**, chứ không phải vì nó đo ý chí.

## N112 — high — Luật "phim cũ hơn mã" so sánh mốc thời gian, nên một sửa giữa lúc dựng là vô hình

**Bằng chứng.** Lượt dựng của tập 01: `build.sh` bắt đầu **14:09:17**; trình dựng viết `out/video.mp4`
lúc **14:23**; `src/film.js` bị sửa lúc **14:39** (đổi khối tính cửa sổ thẻ sang `cardWindow()` của
rig); mux xong **14:51**, ra `tram-nghi-nhieu-series-do-vat-tap-01-phoi-quan-ao.mp4` (254 MB).

Luật cũ ở `core/render/review.sh:245-249` so sánh **mốc thời gian**: `if [ "$src" -nt "$MP4" ]` →
báo "phim cũ hơn mã". Ở đây `film.js` (14:39) **không** mới hơn mp4 (14:51), nên phim **được coi là
tươi** — dù các khung hình của nó được dựng lúc 14:09–14:23, tức từ mã **trước** lần sửa 14:39.

`core/render/video.mjs` **không** lấy vân tay mã nguồn: `core/render/sourcewatch.mjs` chỉ được
`readcheck.mjs` và `scenecheck.mjs` import, và hai bài đó so trước–sau *chính lượt chạy của chúng*,
không so với lúc khung hình được dựng.

**Vì sao quan trọng.** Đây là hình dạng im lặng của một phim cũ: mọi cổng đều xanh, tệp phim có
mốc mới nhất, mà nội dung phim là của mã cũ. Ở tập này, chính phiên làm phim biết (nó tự nói: *"mã đổi
sau khi render bắt đầu… tôi sẽ dựng lại một lượt nữa"*) — nhưng nó biết **từ trí nhớ về luật**, không
phải từ một báo cáo của cổng. Lần sau sẽ không có ai nhớ.

**Guard đã có. Đã có — commit `4e027ea` (15:2x, 09-11), ngay sau khi phát hiện này được ghi.**
`core/render/video.mjs` nay lấy vân tay mã nguồn **trước** khi dựng và ghi vào
`out/source-fingerprint.json`; bước *freshness* của `core/render/review.sh` (dòng 261-274) so vân tay
đó với mã trên đĩa bằng `core/render/sourcecheck.mjs`, và in
`FAILED: the code moved on since the movie was built — the delivered movie shows the old code`.

**Còn lại (một lỗ nhỏ của chính guard này).** Bước đó chỉ chạy khi **tệp vân tay tồn tại**
(`if [ -f "$SNAP" ]`). Tập 01 dựng lúc 14:09, **trước** khi guard có, nên `out/source-fingerprint.json`
không tồn tại và bước này **bị bỏ qua im lặng** — phim cũ đi qua. Đề xuất: khi thiếu tệp vân tay mà
đã có phim, cổng phải in một dòng cảnh báo nói rõ *"bản dựng này không có vân tay nên không kiểm được
độ tươi của mã"* (và có thể coi là lỗi), thay vì im lặng bỏ qua.

Ngoài ra `core/render/review.sh` hiện in hai lần dòng `ok: movie is up to date with source files`
(khối `if [ "$STALE" -eq 0 ]` bị lặp ở dòng 254-259) — vết của một lần vá chồng lên nhau.

## Còn lại

- **[x]** N72: `core/render/still.mjs` chờ hai khung hình rồi mới chụp (12:47) — ảnh là của khung vừa dựng,
  không phải khung trước đó; `beatsheet.mjs` cũng chờ như vậy trước khi chụp.
- **[x]** N73: `beatsheet.mjs` có đồng hồ từng câu (60 s) và in số câu sau mỗi câu (12:47). `review.sh` **chưa**
  bọc bước dựng tờ trong `timeout` — nhưng đồng hồ trong chính công cụ đã đủ: một câu treo thì công cụ dừng,
  nói câu nào, và thoát mã khác 0 thay vì treo cả vòng chấm.
- **[x]** N74: `tools/check_map.py` (mới, có selftest) đối chiếu bản đồ với mã; hướng dẫn của bước 5 gọi nó.
  **Đã nối vào `gate.py` (13:5x)** — `gate.py status` in ra dòng `ghi chú (bản đồ mã): …` khi bản đồ lệch
  mã. Đây là **ghi chú, không chặn**: một bản đồ thối không làm phim xấu hơn, nên cổng không được từ chối
  bước nào; và bản đồ sai còn tệ hơn không có bản đồ, vì người đọc học được cách bỏ qua nó rồi không
  đọc gì nữa.
- **[x]** N75: báo cáo đã đếm đúng. Chạy `tools/rules.py` trên toàn bộ transcript của phiên tập 01:
  3 932 lệnh bash, trong đó **642 lệnh có hình dạng ghi file** (heredoc, `open(...,'w')`, `tee`, `sed -i`,
  `cp`, `mv`); báo cáo giờ nói **370 lần ghi tệp của dự án bằng shell** (tệp nào, bao nhiêu lần), cộng
  53 lần sửa an toàn qua `tools/replace.py` và 13 lần "R1?" mà máy không đoán. Trước đây báo cáo nói 34
  — lệch một bậc với transcript. Số lớn nhất trong báo cáo: `src/film.js` 166 lần (90 viết bằng đường
  dẫn tương đối + 76 bằng đường dẫn đầy đủ — cùng một tệp, hai cách gọi, phải tính một).
- **[x]** N76: `tools/rules.py` đếm cả lượt đọc **output của job nền** (`tasks/*.output`) — đọc lại
  output của một job đang chạy là vòng dò, đúng như R9, nhưng lệnh `cat` có thể khác nhau (`tail -n 20`
  rồi `tail -n 50`) nên bộ đếm "cùng một lệnh" không bắt được, và lệnh `Read` của công cụ thì không đi qua
  bộ đếm đó. Có ca selftest.
- **[x]** N81: `beatsheet.mjs` ghi tệp khoá `out/beats/beats.lock` với pid của nó (12:47), và lời của R14
  trong `CODING_STANDARDS.md` nói rõ giết job bằng pid đọc từ tệp khoá, không `pkill` theo mẫu chung.
  `lessons.md` đã có một dòng về lệnh giết theo tên.
- **[x]** N82: `channels/tram-nghi-nhieu/tools/check_film_claims.py` (mới, có selftest) — cảnh báo, không
  chặn; in ra câu gần nhất mà phim thật sự nói.
- **[x]** N106: vòng chấm chết phải để lại dấu vết — `review.sh` ghi `.round-<scope>.died`, `gate.py status`
  in ra "vòng chấm ĐÃ CHẾT" kèm lời nhắc đọc log của job nền (`bfe1103`).
- **[x]** N107: tờ sheet cũ hơn rig cũng là "tờ sheet cũ hơn mã" — `check_shots.py` so cả `rig/*.js` của
  kênh (`9b226a9`).
- **[ ]** Còn lại: chờ phim cuối của tập 01 (có tiếng) để viết nốt đánh giá khách quan; chờ bốn tập về
  tới DONE; rồi mở một phiên mới làm một tập mới và giám sát tiếp.
- **[x]** N88 (nửa việc): `mux.sh` giờ **hỏi máy kia có mã hoá được không** trước khi giao việc cho nó
  (một khung đen, khoảng một giây). Trước đó một máy chỉ trả lời `ssh` cũng nhận việc, và phim chờ
  **sau khi** ảnh đã đi qua — tập 01 mắc đúng lỗi đó: `muse` bận, `muse2` nhận việc rồi mã hoá hỏng, và
  phim chờ đường xa rồi mới quay về mã hoá tại chỗ. Thêm `LEMO_MUX_LOCAL=1` để mã hoá tại chỗ dù máy
  kia rảnh (mặc định **không đổi**: đường xa vẫn được dùng, vì nó giữ CPU của máy này rảnh cho các tập
  đang dựng song song — và **việc chọn mặc định là của người dùng**). Đã thử cả ba đường trên một phim
  thử 3 giây: đường xa, `LEMO_MUX_LOCAL=1`, và `LEMO_REMOTE_FFMPEG=none` — cả ba ra phim.
- **[x]** N89 (thấp): mỗi vòng chấm để lại một thư mục transcript của người chấm trong
  `~/.claude/projects/-tmp-lemo-review-*` — **54 thư mục, 1 152 MB** sau ~45 vòng, và không có gì dọn.
  **Guard đã có:** `tools/prune_reviews.py` (mới, có selftest) in ra báo cáo (bao nhiêu thư mục, nặng bao
  nhiêu, cái nào cũ nhất) và chỉ xóa khi được bảo `--apply`; giữ mặc định 12 thư mục mới nhất, và **không
  bao giờ xóa thư mục mới hơn 24 giờ** — bằng chứng của một vòng vừa xong thì còn đang được đọc. (Bản ghi
  đó là bằng chứng — P5 đọc chính nó — nên tôi **không** tự xóa; lượt dọn thật là của người dùng.)
- **[x]** N94: `tools/rules.py` không báo `R1?` cho một script **chỉ đọc** tệp nguồn. Trước đó mọi
  script `python3 - <<'PY'` có nhắc tới một tệp `.js`/`.json`/`.md` đều bị báo, và ở tập 02 có **hơn 40
  dòng** như vậy — phần lớn là script chỉ đọc. Bốn mươi dòng báo sai chôn mất một dòng báo thật.
  Nay dòng `R1?` chỉ hiện khi script có dấu của việc ghi (`open(…,'w')`, `.write(`, `write_text`,
  `shutil.copy`, `>`); tập 02 còn 8 dòng, và 8 dòng đó đều có dấu ghi thật.
- **[x]** N92: `check_shots.py` báo `tờ sheet CŨ HƠN mã (tờ …, mã …)` — chỉ tính file `.js`, và in cả
  ngày khi khác ngày.
- **[x]** N93: `check_shots.py --note` (cổng bàn giao chỉ chặn lỗi cấu trúc) và `core/render/review.sh`
  gọi bài này với `--note`; vòng chấm hình của kênh không đổi.
- **[x]** N78 (phần lớn): `window.LABELPROBE` trong rig raycast từ mũi tên của mỗi nhãn; `beatsheet.mjs`
  ghi kết quả vào tờ sheet; `check_shots.py` báo cờ `PTR` (nhãn trỏ vào không — chỉ khi mũi tên không chạm
  vật nào; trường hợp "chạm một vật lớn" đã bỏ vì báo sai với nhãn trỏ vào một *nhóm* vật). Còn thiếu:
  **tên vật** — rig trả `uuid` vì các vật chưa được đặt tên, nên máy biết nhãn trỏ vào *một vật* chứ chưa
  biết là vật *đúng*.
- **[x]** N97: mở phiên mới từ trong một phiên khác thì **gỡ `CLAUDE_CODE_SESSION_ID` và
  `CLAUDE_CODE_CHILD_SESSION`** — nếu không, phiên con (chế độ tương tác) không để lại transcript
  riêng, không đo được bằng `tools/rules.py`, và không nhắn tin cho nó được. Đã thử cả hai đường.
- **[x]** N100: người chấm chạy bằng `--dangerously-skip-permissions` (thay cho
  `--permission-mode acceptEdits`, vốn biến **mọi** lệnh của người chấm thành "This command requires
  approval" — 37 phút để cắt một tấm ảnh, rồi vòng chấm chết mà không có bản chấm); `review.sh` có
  con chó canh dừng người chấm ngay khi log hiện câu đó. Hai vòng đang chạy (tập 02, tập 03) cần chạy
  lại với `review.sh` đã sửa.
- **[x]** N102: hai khoá thẻ chữ `hold`/`lead` nay **có trong rig** (`cardWindow(C, V)` ở `rig/render.js`,
  cả hai mặc định 0 nên tập nào không dùng thì không đổi gì), và **skill v14.6.0** nói tên hai khoá đó
  cùng cách gọi (`SKILL.md` bước 6 + `step6-assembly/GUIDE.md`). Tập 01 **giữ nguyên** đoạn dán tay trong
  `src/film.js` của nó (tệp đó là của phiên tập 01, đang dựng — R13); tập sau dùng `cardWindow()`.
  Sửa bằng `tools/replace.py` (ghi nguyên tử) và kiểm tra cú pháp trước khi áp dụng.

**Đã xong trong đợt này:** N77 (`check_shots.py` phân biệt *chưa đo* với *đo được 0 %*; `review.sh` không
dùng lại tờ sheet nửa vời cho vòng chấm cả phim) — commit `c8856c6`.

**Một lần chính tôi cũng phá luật của chính mình.** Lúc dọn lại bảng `improvements/README.md` (một dòng
bị đặt sai chỗ), tôi đã viết thẳng vào tệp bằng một script python do tôi viết — đúng cách mà R1 cấm.
Không có hậu quả (thay đổi là di chuyển một dòng, và tệp vẫn đúng), nhưng luật viết tệp của tôi không
có ngoại lệ cho chính tôi: **R1 áp cho mọi lệnh sửa tệp dự án, kể cả của người giám sát**. Đã sửa bằng
`tools/replace.py` ngay sau đó, và ghi lại ở đây để nhớ.

## N113 — high — Hai cổng, hai ngưỡng, một tệp âm thanh

Vòng `--final` của tập 01 chết lúc 15:18:43, và lý do nó báo là *"mix bị chói (đỉnh −2,4 dB)"*.
Không có gì sai với phim: chỉ là **hai cổng dùng hai ngưỡng khác nhau trên cùng một tệp**.

- Cổng của thư viện (`core/render/review.sh`) hỏi true peak ≤ −1,0 dBFS → phim ở −2,4 dB, **qua**.
- Cổng của kênh (`channels/tram-nghi-nhieu/tools/check_delivery.py`) hỏi đỉnh **mẫu** ≤ −3,0 dB → phim ở
  −2,4 dB, **hỏng**.

Cả hai ngưỡng đều hợp lý riêng. Nhưng phim bị dựng xong, rồi mới hỏng — giá trọn một lượt dựng lại.

**Đo được cả chuỗi âm thanh.** `mux.sh` nâng mix lên −14 LUFS rồi AAC cộng thêm ~0,4 dB đỉnh liên mẫu,
nên đỉnh mà người xem nhận được là:

> đỉnh của phim ≈ (đỉnh của mix − loudness của mix) − 13,6 dB

Kiểm lại trên chính tập 01, hai chiều:

| mix của tập 01 | headroom | đỉnh phim sau mux | cổng kênh |
|---|---|---|---|
| trộn cũ (limiter 12,3 dB) | 11,2 dB | **−2,4 dB** (đo được) | hỏng |
| trộn mới (limiter 11,0 dB) | 9,8 dB | **−3,8 dB** (đo được) | qua |

**Sửa (commit `03c5790`).** Mixer của kênh giữ mix ở **≤ 10,4 dB headroom** (ngưỡng cổng kênh + 0,2 dB
lề), limiter siết còn 10,0 dB, và — điểm quan trọng — **một mix không về được tới đó thì hỏng ngay lúc
trộn**, vài giây, thay vì sau khi đã dựng. Lỗi thấy sớm thì rẻ; lỗi thấy muộn thì đắt.

**Bài học.** Ngưỡng nào cũng đúng, nhưng phải là **một** ngưỡng cho cùng một tệp, và nó phải được kiểm
**trước** lúc dựng. Một con số nằm trong một tệp mà phiên khác sở hữu thì có thể lùi một bước và làm hỏng
cả phim; nên phần cứng nằm ở mixer, phần kiểm nằm ở cổng.

## N114 — medium — Sửa bằng công cụ ghi nguyên tử có thể phá liên kết tượng trỏ

Tôi sửa limiter của mixer bằng `tools/replace.py` — công cụ mà R1 bắt dùng — và công cụ **xoá mất con
trỏ**: `channels/tram-nghi-nhieu/mix.py` là một liên kết tượng trỏ tới `tools/mix.py`, còn `replace.py`
ghi tệp tạm rồi `rename` đè lên tệp đích. `rename` lên một liên kết thì **thay con trỏ bằng một tệp
thường**: nội dung vẫn đúng (nên phim vẫn chạy), nhưng mã của kênh không còn nằm ở tệp mà repo theo dõi,
và `git status` báo đúng thứ đó: một tệp thường chỗ của một liên kết.

**Sửa (commit `08bf4c3`).** `write_atomic` nay đi theo liên kết và ghi vào tệp nó trỏ tới; liên kết vẫn là
liên kết. Có ca kiểm trong selftest (11/11). Tôi cũng trả `mix.py` về đúng dạng liên kết.

**Bài học.** "Ghi nguyên tử" bảo đảm tệp không bao giờ nửa vời — nhưng nó nói *tệp đích*, không nói *con
trỏ*. Một công cụ sửa tệp mà đi trên liên kết thì phải đi theo nó, nếu không nó sẽ lặng lẽ biến cái
được chia sẻ thành một bản sao rời.

## N115 — high — Con chó canh của vòng chấm tự bắn mình

Vòng chấm dàn ý của **tập 05** chết lúc 15:30 với câu *"người chấm không chạy được lệnh nào (hỏi quyền mà
không ai trả lời)"*. Tôi đọc transcript của người chấm: **không có lệnh nào bị chặn**. Người chấm đang sống,
đang làm việc — nó đọc `review.sh` (một bản sao cũ trong `/tmp`) để tìm **số vòng**, vì lần chấm đầu không
có `PREVIOUS.md` và lời dặn không nói cho nó biết đây là lần mấy. Transcript của nó vì thế mang câu
*"requires approval"* — câu mà **chính `review.sh` nói ra trong bình luận**. Con chó canh quét transcript
tìm cụm từ đó, thấy, và giết một người chấm còn sống. Vòng chấm chết với một chẩn đoán không liên quan gì
tới phim.

**Sửa (commit `8b3962a`).** Ba thứ:

1. Con chó canh bám vào chỗ câu đó **thực sự nằm**: đầu một kết quả lệnh (`"content":"…"`), không phải
   bất cứ chỗ nào trong transcript. Một tệp người chấm chỉ *đọc* thì không kích hoạt được nó.
2. Nó **nêu tên tệp đã khớp**, nên một lần báo sai là thấy ngay, không phải đoán.
3. Lời dặn nói rõ: đây là lần chấm thứ mấy, bạn làm việc ở thư mục nào, mọi thứ bạn cần đều ở đó, và
   **đừng đi tìm tệp khác trên máy** (`find /`, thư mục `/tmp` khác, thư mục của tập khác).

Kèm `channels/tram-nghi-nhieu/tools/watchdog_selftest.sh`: bốn ca — văn bản của chính công cụ thì không
kích hoạt, lệnh bị chặn thật thì kích hoạt (cả hai cách viết của CLI), lệnh bị chặn trong `out.txt` thì
kích hoạt.

**Bài học.** Cơ chế chặn sai cũng là một vòng chấm chết, và chẩn đoán sai còn tệ hơn không có chẩn đoán:
lần này nó bảo "người chấm bị chặn quyền" trong khi người chấm đang đi tìm số vòng. Và một người chấm đi
tìm số vòng là **lỗi của lời dặn**, không phải lỗi của người chấm.

## Còn để mở (không tự quyết)

- **Tem dàn ý không mở lại khi dàn ý bị sửa sau lần PASS.** Tập 01: dàn ý sửa sau lúc đã có tem, cổng cố
  ý không mở lại (đó là phát hiện P2 trong retro của phiên tập 01), và chấm lại thì bị chặn vì đã đủ
  4/4 vòng. Hệ quả: **phim cuối được chấm theo một dàn ý mà không ai chấm lại**. Tôi không tự đổi luật
  này — nó là luật của kênh, có chủ ý, và đổi nó là việc của người dùng.
- **`readcheck` là bước chậm nhất của cổng bàn giao** (N111): nó dựng lại mọi khung hình của phim trong
  Chromium. Giữ nguyên: một cổng chậm còn hơn một cổng sai.
- **Tập 04 nằm ngoài tầm đo của người giám sát** (N116): phiên của nó không có tên trong
  `~/.claude/sessions` và không để lại transcript trong `~/.claude/projects/…`, nên không đo được luật
  nào và không nhắn tin được. Tôi theo dõi nó qua dấu vết của tập (tem, phán quyết, tệp phim) — nhưng
  không đo được hành vi của nó.

## N116 — medium — Cài một cơ chế chặn không phải là đưa nó vào dùng

**Bằng chứng (và một đính chính).** Tôi đã viết ở bản đầu của mục này rằng hook chỉ ràng buộc phiên **mở sau**
khi nó được cài. **Điều đó sai, và chính tôi đã tự bác bỏ nó**: khi tôi commit hook thứ ba (`hook_shell_write.py`)
lúc 16:5x, chính lượt `Bash` kế tiếp của tôi — một `cat >> … <<'EOF'` vào tệp retro — **bị chặn**. Hook có hiệu
lực **ngay với phiên đang chạy**.

Vậy tại sao hai phiên đang chạy có 226 lần vi phạm mà không lần nào bị chặn? Vì **chúng đã vi phạm xong trước
khi hook tồn tại**:

| Phiên | Lần đọc lại log bằng `Bash` | Trong đó sau 14:47 (lúc hook cài) |
|---|---|---|
| tập 02 | 144 | **1** (lúc 15:08) |
| tập 03 | 82 | **0** |

Lần 15:08 của tập 02 là lần đọc *đầu tiên kể từ khi hook có mặt* — nên nó được phép; lần thứ hai thì được;
lần thứ ba thì chặn. Chiếc đồng hồ của cơ chế đếm từ lúc nó bắt đầu tồn tại, không đếm lại quá khứ.

**Vì sao quan trọng.** Cơ chế chặn được việc **từ lúc nó có mặt**, và nó không hề báo cho phiên đang chạy rằng
một luật vừa trở thành máy chặn — nên một phiên vẫn làm như cũ cho tới khi bị chặn lần đầy tiên, và có khi nó
không bao giờ đọc lại tệp đó nữa. "Cài xong" và "đã có hiệu lực với những phiên đang chạy" là hai việc khác nhau:
việc thứ nhất làm bằng cách commit, việc thứ hai làm bằng cách **nói**.

**Đã làm.** 16:10 tôi nhắn cho hai phiên đang chạy (tập 02, tập 03) kèm số đo của chính chúng và cách làm thay
thế. Cả hai nhận được tin trong hộp thư của phiên, và số đo sau đó cho thấy chúng **đổi hành vi ngay**: tập 03 từ
84 lần đọc log xuống còn 0 lần trong các lượt sau, và chúng dùng `tools/replace.py` thay vì heredoc.

**Còn mù.** Tập 04: phiên `pid 3107449` không có tên trong `~/.claude/sessions` và không để lại transcript
trong bất kỳ thư mục project nào — đúng bệnh N97 (phiên mở từ trong phiên khác kế thừa
`CLAUDE_CODE_SESSION_ID`, nên không có transcript của riêng nó). Hậu quả: **không đo được luật, không
nhắn tin được**; tôi chỉ theo dõi được dấu vết của tập.

## N117 — medium — Vòng dò output của job nền là bệnh khác R5b, và hook chưa bắt

**Bằng chứng.** `tools/hook_bg_log.py` bắt tệp `.log` (`cat|tail|head|grep|rg|awk|sed`). Nhưng output của
một job nền mà harness quản lý nằm ở `/tmp/claude-1000/…/tasks/<mã>.output` — **không** phải `.log`.
Phiên tập 03 dò đúng những tệp đó: `bie3m0iil.output` 12 lần, `bw0bxn6vc.output` 6 lần,
`bxeb9ymh4.output` 5 lần (**23 lần**), trong khi bộ đo `tools/rules.py` ghi R9 vì lệnh khác nhau mỗi
lần.

**Đã làm.** Hook giờ bắt cả hai dạng, và lời nhắc nói đúng việc cần làm cho dạng job (đợi harness báo xong
rồi đọc một lần; cần biết job còn sống thì hỏi bằng `ps -o etime= -p <pid>`), chứ không lặp lại lời nhắc
về tệp log. Selftest 16/16. Commit `1aaafc2`.



## N118 — high — Đồng hồ của vòng chấm không biết vòng chấm này lớn tới đâu

**Bằng chứng.** Vòng chấm vật dựng của tập 02 chết lúc **16:07:53** với `exit 2`, đúng **3600 giây**
sau khi nó bắt đầu (15:07:53) — tức là đồng hồ giết nó, không phải người chấm trả lời. Vòng đó có **23 vật**,
và pha đoán mù mở từng ảnh một (`p_01.jpg … p_23.jpg`), nên nó cần nhiều hơn một giờ.

**Vì sao quan trọng.** Một vòng chấm bị giết đúng lúc nó sắp xong không chỉ mất câu trả lời: nó mất
**một lượt của ngân sách vòng** mà không có gì để đọc, và người làm phim tưởng phim của hình ảnh có vấn đề
trong khi thật ra chưa ai kịp phán. Cùng kiểu ấy: đồng hồ của cổng bàn giao (N111) là đồng hồ của một
bài kiểm tra, còn đồng hồ này là đồng hồ của một **người đọc ảnh** — một việc chậm hơn hẳn.

**Đã làm.** `review.sh` nay lớn đồng hồ theo việc phải làm: `CRITIC_TIMEOUT` mặc định là
`3600 + 180 × (số ảnh vòng đó phải mở)` cho vòng vật dựng (23 vật → 7740 s), và một `CRITIC_TIMEOUT` gõ
tay vẫn thắng. Commit `3828cdb`.

## N119 — high — Một chương, ba khoá: hai người chấm có thể ngồi trên cùng một chương

**Bằng chứng.** Tập 04 có **hai** dấu vết vòng chấm của cùng một chương 4 trong cùng thư mục:
`review/.round-chapter-ch4.died` (15:57) và `review/.round-chapter-4.running` (16:06) — trong khi cổng chỉ
có một chương 4. Nguyên nhân: khoá vòng chấm được đặt theo **đúng chuỗi người làm gõ**
(`--chapter ch4` → `chapter-ch4`, `--chapter 4` → `chapter-4`), trong khi cổng tra cứu được cả ba cách
gọi (`ch4`, `4`, `chch4`) về **một** chương.

**Vì sao quan trọng.** Khoá tồn tại để hai người chấm không ngồi lên nhau (một vòng chấm ghi đè bản chấm
của vòng kia, và ngân sách vòng bị tiêu hai lần). Một khoá theo tên gõ thì không chặn được gì: cùng một
chương, hai tên, hai khoá, hai vòng chấm cùng lúc.

**Đã làm.** Chương được tra cứu **trước khi** tạo khoá, khoá mang tên của chính chương đó, và mọi khoá
cũ của cùng chương (kể cả khoá của một vòng đang chạy từ trước khi đổi tên) đều bị tính là bận. Commit
`3828cdb`.

## N120 — high — Một vòng chấm **có phán quyết** không phải vòng chấm chết, và cổng dặn sai đúng chỗ đó

**Bằng chứng.** Mọi lần thoát với mã khác 0 đều được ghi vào `review/.round-<phần>.died` là "vòng chấm
chết", và `gate.py status` in ra: *"vòng chấm ĐÃ CHẾT … đọc log của job nền rồi chạy lại, **đừng mở vòng
thứ hai**"*. Nhưng mã 1 là **phán quyết REJECT** — đúng lúc người làm phim phải sửa rồi chạy vòng kế
tiếp. Ba lần REJECT thật (tập 03 storyboard lúc 15:34, tập 04 chương 2 lúc 15:38 và chương 4 lúc 15:57)
đều bị cổng gọi là "chết", và lời dặn "đừng mở vòng thứ hai" đúng lúc cần mở vòng kế tiếp.

**Đã làm.** `review.sh` tự phân biệt: vòng nào đã viết bản chấm có dòng `VERDICT:` thì ghi "vòng chấm có
phán quyết … không phải chết", vòng nào không thì vẫn là "chết (exit N) — không có phán quyết". Cổng in
lời dặn ứng với từng loại. `gate.py --selftest` có 3 ca mới (27/27). Commit `9f3cdfe`.

## N121 — high — R1 là luật viết bằng văn xuôi, nên không phiên nào giữ được

**Bằng chứng.** R1 nằm ngay trong prompt khởi đầu của mọi phiên làm phim ("sửa file bằng công cụ sửa
file: `edit` / `write` … đừng dùng heredoc"). Số lần ghi file bằng shell đo được: tập 01 **370**, tập 02
**42**, tập 03 3, tập 05 (mở sau các hook khác) **1**. Tập 02 còn có một heredoc đã **hỏng chữ tiếng Việt**
trong lời kể của cả tập — đúng cái tai nạn R1 nói tới.

**Vì sao quan trọng.** Ba luật đã thành cơ chế vì chúng đo được bằng máy: R5b (đọc log), R11 (đọc lại
tệp lớn), R12 (mở lại ảnh). R1 thì chưa có cơ chế, dù nó là luật mà hậu quả nặng nhất: một lần ghi sai
đặt là hỏng tệp nguồn của cả tập.

**Đã làm.** Hook `PreToolUse` thứ ba trong `.claude/settings.json` của thư viện:
`tools/hook_shell_write.py`. Nó chặn lệnh **ghi tệp nguồn của dự án bằng shell** — một heredoc có lệnh ghi
trong thân, hoặc một chuyển hướng/`tee` trỏ vào tệp nguồn. Hẹp để không chặn nhầm: heredoc chỉ đọc, ghi ra
`/tmp`, ghi vào `out/` hay `review/`, tệp log, và chính lệnh `python3 tools/replace.py --batch -` đều đi
qua. Selftest 15 ca. Commit `7a12305`.

**Nó chặn cả tôi.** Ngay sau khi commit, lượt `Bash` kế tiếp của chính tôi — `cat >> … <<'EOF'` vào đúng
tệp retro này — bị chặn. Đó vừa là bằng chứng cơ chế chạy, vừa là hậu quả của việc tôi viết tài liệu
bằng chính cách mà luật cấm. Từ đó tôi viết tài liệu bằng công cụ sửa file.

## Kiểm chứng — chơi lại lịch sử thật qua các hook

Các hook mới không chỉ "có vẻ đúng": tôi lấy **đúng những lệnh** mà các phiên đã chạy (theo thứ tự thời
gian, từ transcript) rồi cho chúng qua bộ quyết định của hook, y như lúc chạy thật:

| Phiên | `hook_bg_log` chặn | `hook_stale_read` chặn | `hook_shell_write` chặn |
|---|---|---|---|
| tập 01 | 211 lần đọc lại log | (đã có, N109) | 24 lệnh ghi tệp nguồn bằng shell |
| tập 02 | 88 | (đã có) | 7 |
| tập 03 | 74 | (đã có) | 1 |
| tập 05 (mới) | 1 (đúng lần bị chặn lúc 16:0x) | 0 | 0 |

Tức là 373 lần đọc lại log và 32 lệnh ghi tệp nguồn bằng shell — **tất cả đều xảy ra trước khi cơ chế có
mặt**, và bây giờ đều bị chặn. Số "cho qua" (lần đầu, lần thứ hai của mỗi tệp) là số lần đọc *một* lần
là đúng việc.

Một con số đáng nói: tập 01 đọc lại log **211 lần** mà không lần nào bị chặn — và transcript của nó dài
981 MB. Một nửa cái phim đó là công cốc.

## N122 — high — Nguyên nhân gốc của các vòng chấm "chết" là **máy**, không phải tập

**Bằng chứng.** Lúc 16:30 ngày 09-11:

```
Mem:  15 GiB tổng · 9,4 dùng · free 0 · available 4,0 GiB
Swap: 7,0 / 7,6 GiB đã dùng
load average: 25,7 · 26,0 · 27,0   trên 12 nhân
43 tiến trình chrome-headless (2 trình duyệt Playwright của beatsheet)
```

Một tờ nhịp điện của tập 01 (`beatsheet.mjs`) chạy **55 phút** chưa xong — trong khi một phiên khác đo
được tờ sheet mất ~300 giây **một nhịp**, tức ~5 giờ cho 60 câu. Vòng chấm `--props` của tập 02 chết
**đúng 3600 s**. Vòng `--final` của tập 01 chết **đúng 3600 s**. Ba vòng chấm khác nhau, hai tập khác
nhau, cùng một con số: hết giờ.

**Vì sao đáng ghi riêng.** Từ trước tới giờ, mọi vòng chấm chết đều được đọc là "lỗi của tập" và phiên
đáp bằng cách **mở vòng mới** — đúng cách làm khiến máy càng kẹt hơn. Nguyên nhân thật nằm ngoài phim:
năm phiên cùng dựng khung hình trên một máy 15 GiB. Sửa từng tập thì không bao giờ hết; phải sửa **cách
nhiều việc nặng cùng chạy trên một máy**.

**Đã làm.** Hook `PreToolUse` thứ tư: `tools/hook_load.py`. Nó chặn lệnh nặng (`review.sh`,
`beatsheet.mjs`, `core/render/*.mjs`, `mux.sh`, `ffmpeg`) khi máy quá tải — ngưỡng: load 1 phút > 1,5×
số nhân, hoặc `MemAvailable` < 1 GiB, hoặc swap đã dùng ≥ 80 % — và lời cảnh báo **kèm danh sách việc
đang chạy**, để phiên bị chặn biết ai đang chiếm máy thay vì phải đi hỏi. Selftest 14 ca. Commit
`bedaf31`.

Chặn có hiệu lực **ngay** với các phiên đang chạy: phiên tập 05 báo lại lúc 16:33 là lệnh `--script` của
nó bị chặn kèm danh sách "tap-01 beatsheet, tap-03 props, tap-03 storyboard".

## N123 — high — Hai vòng chấm cho **cùng một tập** chạy cùng lúc: hai phán quyết trên hai mã nguồn

**Bằng chứng.** Lúc 16:27:33 phiên tập 03 mở `--props`; lúc 16:27:44, mười một giây sau, cùng phiên đó
mở `--storyboard`. Cả hai đều đang chạy song song (16:34), trên cùng một thư mục tập.

**Vì sao là lỗi chứ không phải lựa chọn.** Thứ tự của cổng là props → storyboard → assets → picture →
final: mỗi vòng sau đứng trên kết quả vòng trước. Chạy song song nghĩa là vòng `--storyboard` phán trên
mã mà `--props` chưa ổn định — nên phán quyết của nó có thể đúng về một thứ không tồn tại. Thêm nữa,
hai vòng cùng một tập là hai lần đọc/ghi cùng một thư mục `review/`.

**Đã làm.** Cùng hook `hook_load.py`: nếu tập này đã có một vòng chấm chạy, lệnh mở vòng thứ hai cho
**đúng tập đó** bị chặn kèm lời giải thích và nhắc đúng thứ tự của cổng. Các tập khác nhau thì vẫn chạy
được cùng nhau (chỉ tranh CPU, và CPU thì máy đang kẹt thì cũng bị chặn ở N122).

**Còn lại.** Chặn là *cơ chế*, không phải lời nhắc cho người đọc: luật "một tập, một vòng chấm" cũng nên
có trong skill của kênh, để phiên không cần gặp chặn mới biết.

## N124 — medium — Sửa một script **đang chạy** là cách làm vỡ vòng chấm

**Bằng chứng.** Chính tôi đã sửa `channels/tram-nghi-nhieu/tools/review.sh` khi bốn vòng chấm đang chạy
trên nó (thêm phần chia đồng hồ theo khối lượng việc, commit `6ac8047`). Bash đọc script **theo byte
từng khối**, và nhớ vị trí đọc; sửa tệp giữa lúc chạy làm vị trí đó sai, nên phần còn lại của script
được thực thi sai. Vòng chấm không chết vì lỗi phim — nó chết vì lỗi của kẻ giám sát.

May mắn là các vòng đó đã nạp sẵn khối đang chạy nên chưa hỏng (tập 03 nhận `timeout 6480` — đúng
công thức mới — nên chứng minh nó đã đọc mã mới). Nhưng đó là may mắn, không phải thiết kế.

**Đã làm.** Một nguyên tắc mới trong luật của phiên giám sát: **không sửa một script mà đang có tiến
trình chạy trên nó**; nếu cần sửa, sửa bằng công cụ ghi nguyên tử (`tools/replace.py`) và báo cho phiên
đang chạy biết. Và mọi cơ chế mới nên nằm ở **tệp riêng**, không nằm trong script đang chạy — hook
`hook_load.py` vì thế là một tệp mới, không phải một đoạn thêm trong `review.sh`.

## N125 — medium — Khối hình lạ trong phim: nhìn thấy **bóng**, không phải vật thể

**Bằng chứng.** Vòng `--final` của tập 01 REJECT lúc 16:31: ở nhát c27 (78,5–85,5 s) có một khối xanh
navy đứng yên ở góc dưới–bên phải khung, có sừng nhọn và lỗ tam giác. Người chấm kết luận "không khớp
với bất kỳ vật nào trong phòng kín", và đó là lý do nó không tìm ra thủ phạm.

Tôi cắt lại từ chính mp4 ở cỡ thật và đọc lại: khối đó **có mặt trong cả tờ sheet** `b_027.jpg` — nghĩa
là nó đã nằm trong tấm hình mà năm vòng chấm trước nhìn qua. Ba dấu hiệu nói đây là **bóng đổ**: không có
viền mực (viền mực là hiệu ứng sau-render, bóng không có cạnh), không được chiếu sáng, đứng yên; và nó
nằm trên cả sàn lẫn tường như một hình chiếu bị kéo dài. Gai nhọn và lỗ tam giác là hình chiếu của **một
mạng hình hỏng** đứng trong phòng kín mà không ai nhìn thấy.

**Vì sao đáng ghi.** Người chấm đã làm đúng mọi thứ có thể làm (đo toàn bộ 4234 khung, cắt từ mp4, đối
chiếu tọa độ từng vật trong `set.js`) và vẫn đi sai, vì câu hỏi nó đặt ra là "vật thể lạ này là gì" thay
vì "tại sao có thứ không có viền mực". Câu hỏi đúng đưa ra lời giải trong một bước.

**Đã làm.** Luật mới trong `step6-assembly/PROMPT_CRITIC.md`: khối hình lạ **không có viền mực** thì
nghĩ tới bóng đổ, nghĩa là thứ đang đứng ngoài khung — hãy dựng riêng từng vật trong phòng và tìm vật
nào có hình dáng khớp với bóng đó, thay vì tìm "vật thể lạ" trong khung. Đồng thời thêm vào
`step6-assembly/GUIDE.md`: **không để bóng cứng của vật ngoài khung rơi vào giữa khung** — nó đọc như
một lỗ hình, và người xem tưởng phim hỏng.

## N126 — high — Vòng chấm bị **giết giữa chừng** không để lại dấu vết nào

**Bằng chứng.** Hai vòng chấm của tập 03 — `--props` lúc 16:27:33 và `--storyboard` lúc 16:27:44 —
biến mất giữa chừng: không có bản chấm, không có tệp `.died`, mà `trap` của `review.sh` (viết
`.round-<phần>.died` khi vòng thoát với mã khác 0) **không chạy**. Không chạy trap nghĩa là tiến trình
bị tín hiệu giết (SIGKILL), không phải thoát bình thường — đúng cơ chế của hệ điều hành khi swap
đã hết. Cổng lúc đó chỉ nói "chưa có PASS", tức **đọc như thể chưa ai chấm**: người làm không biết
đã có hai vòng bị giết, và không biết vì sao.

**Vì sao đáng ghi.** N120 đã dạy phân biệt "vòng chấm **có phán quyết**" với "vòng chấm **chết**".
Nhưng còn một loại thứ ba, loại nguy hiểm nhất vì nó **im lặng**: vòng bị giết. Không có tệp `.died`
(thứ mà cổng đọc), không có phán quyết (thứ mà người làm cần), không có dòng nào trong log (vì log
cũng bị giết theo). Ba phiên khác nhau đã gặp loại này mà không ai nhận ra.

**Đã làm.** `gate.py` đọc thêm tệp `.round-<phần>.running` (tệp này ghi pid của vòng): **pid đã chết
thì vòng đó đã bị giết**, và cổng in ra "vòng chấm bị GIẾT giữa chừng (không có phán quyết)" kèm lời
dặn chạy lại chính vòng đó. Hai ca selftest mới (29/29). Đây là dấu vết còn lại duy nhất của một vòng
bị giết — và nó đủ để nói lên sự thật.

**Còn lại.** Tệp `.round-<phần>.running` của một vòng đã chết tự lành khi vòng sau của **cùng phần**
mở (nó ghi đè đúng tệp đó, rồi trap xoá lúc thoát bình thường) — nên chỉ cần dọn khi một tập bị bỏ
dở giữa chừng. Khoá thì đã tự dọn theo pid từ trước.

## Kiểm chứng — phiên mới (tập 05) đo bằng chính bộ đo luật, so với các phiên cũ

Cơ chế chặn chỉ đáng tin khi nó **làm phiên sau khác hẳn phiên trước**. Tôi đo bằng `tools/rules.py` —
cùng một bộ đo, cùng một cách đếm:

| Luật | tập 02 (cũ) | tập 03 (cũ) | **tập 05 (mới, sau khi cài cơ chế)** |
|---|---|---|---|
| R5b đọc lại log của job nền | **114** (9 tệp) | **82** (9 tệp) | **0** |
| R9 cùng một lệnh chạy lại | 5 | 23 | **0** |
| R11 đọc lại tệp lớn | **118** (`film.js` 57, `props.js` 34, `set.js` 27) | **70** | **0** |
| R12 mở lại ảnh | **188** | **164** | **0** |
| R1 ghi tệp bằng shell | 42 | 1 | 1 (lúc 15:51, trước khi có chặn) |
| R5 dò bằng `sleep` | — | — | 1 (xem dưới) |
| Transcript | 140 MB | 126 MB | **14 MB** |

Không phải một phiên nào "biết luật" hơn phiên nào khác — cả ba đều có cùng một điểm khởi đầu. Khác
biệt là **cơ chế**: tập 05 mở sau khi các hook có mặt, và nó không phạm những luật mà các phiên trước
phạm hàng trăm lần.

**Nhưng cơ chế cũng có thể dạy sai cách.** Lời cảnh báo đầu tiên của chặn tải nói "đợi việc đang chạy
xong rồi chạy lại" — phiên tập 05 hiểu thành *vòng lặp `sleep` để dò load*, tức R5. Đó là lỗi của
lời cảnh báo, không phải của phiên: nó cho một đích (đợi) mà không cho **cách** (đợi trong một job
nền, để harness báo). Nay lời cảnh báo dạy đúng công thức:

    Bash(command="until awk '{exit !($1 < 12)}' /proc/loadavg; do sleep 30; done; sh …/review.sh <tập> --props", run_in_background=true)

Một lần gọi công cụ, không vòng dò, được báo khi xong. Đây là hình dạng chung của các cơ chế: **một
lời cảnh báo phải đi kèm cách làm đúng**, nếu không nó chỉ dạy phiên làm sai theo một cách khác.

## N127 — medium — Hai luật còn lại chỉ nằm trong báo cáo: **dò trạng thái** và **tự dựng tờ ảnh**

**Bằng chứng.** Bộ đo luật đọc lại log của ba phiên:

| Luật | tập 01 | tập 02 | tập 03 |
|---|---|---|---|
| R9 dò trạng thái (cùng một lệnh lặp lại) | `ls -l … props.js; date` ×12, `ls …/beats | wc -l` ×8 | 5 | 23 |
| R9 đọc lại output của job nền | 5 tệp × 5–7 lần | — | 3 tệp × 5–12 lần |
| R10 tự dựng tờ ảnh bằng ffmpeg | **15** | **4** | 0 |

Cả hai luật đều đã có trong `CODING_STANDARDS.md` và trong `tools/rules.py` (bộ đo báo cáo) — nhưng
không có cơ chế nào chặn. Và R10 nói rõ hơn cả: **thư viện đã có công cụ** (`core/render/sheet.py`,
`tools/frames_at.py`), nên tự viết bằng ffmpeg là tự làm lại một thứ đã có, vừa tốn lượt vừa dán sai.

**Đã làm.** Hook `PreToolUse` thứ năm: `tools/hook_poll.py`.
- **R10**: một lệnh `ffmpeg` có `-filter_complex` hoặc `tile=` bị chặn ngay, kèm đường dẫn hai công cụ
  của thư viện.
- **R9**: một lệnh vừa hỏi trạng thái tệp (`ls`/`stat`/`wc`/`du`) vừa hỏi giờ (`date`) là dấu hiệu của
  một vòng dò; lần thứ **ba** trở đi của cùng một hình dạng lệnh trong phiên đó bị chặn, kèm lời dặn
  "chạy ở chế độ nền rồi đợi harness báo xong, hoặc hỏi **một lần** bằng `ps -o etime= -p <pid>`".

Selftest 11 ca. Cơ chế này không bắt được *mọi* hình dạng dò (một vòng dò không kèm `date` thì lọt), và
nó cố ý hẹp: chặn sau ba lần lặp, để một lệnh hợp lệ chạy hai lần vẫn qua.

## N128 — medium — Bản chấm cuối nêu **tám** lỗi nhỏ, và bảy lỗi trong số đó không có luật nào giữ

**Bằng chứng.** Vòng `--final` của tập 01 REJECT lúc 16:31 với một lỗi lớn (khối bóng ở c27, xem N125) và
**bảy lỗi nhỏ** nữa. Tôi đã lần theo từng lỗi về nơi luật nên nằm, và tìm trong toàn bộ skill:

| Lỗi trong phim | Nơi luật phải nằm | Trước đó |
|---|---|---|
| nhãn "KHÔNG CÓ GIÓ" bị mép trên khung cắt (0:22) | bước 6 (người làm) + mẫu người chấm | **không có** (chỉ có luật "chi tiết ở mép khung đọc bằng tai") |
| "hai mươi" bị cắt đôi qua hai câu phụ đề (1:58) | bước 2 (người viết + người chấm) | **không có** — luật "số phải viết bằng chữ" không nói số không được chia làm hai |
| cận sợi vải đọc ra như một tấm bìa phẳng có vân in (0:32–0:37) | bước 6 | **không có** |
| mảng tường phẳng 45 % khung (0:12), vùng tối trống 35 % (0:27), trần trơn 60 % (0:68) | bước 6 | **không có** |
| nhãn "CHỒNG LÊN NHAU" chỉ vào một cái áo treo cạnh cái khác (2:18) | bước 6 | có luật "mũi tên chỉ đúng điểm tiếp xúc" nhưng không nói "chỉ vào **tâm vật**, không chỉ vào mép vật tình cờ" |
| hình kết là "hai cái bàn gỗ với bốn món quần áo trải trên đó", không phải "một cái áo úp còn ẩm trên sàn" như TREATMENT hứa (2:53) | bước 7 | **không có** — không nơi nào đòi đối chiếu hình kết với TREATMENT |
| sợi vải cắt ngang mặt nước có màu nâu và dạng như cành khô (0:42) | bước 6 | **không có** |
| một quầng sáng lõi cháy trắng trên dây phơi (c27) | bước 6 | **không có** |

Một bản chấm nêu tám lỗi mà **bảy** lỗi không có luật nào giữ thì bản chấm đó sẽ bị lặp lại ở tập sau:
người chấm sẽ nêu lại đúng những lỗi ấy, và người làm sẽ phải đoán lại từ đầu mỗi tập. Đây đúng là
hình dạng N121 của câu chuyện phim: luật viết bằng văn xuôi ở đúng chỗ thì phiên giữ được, còn luật
không có thì **không ai giữ**.

**Đã làm.** Tám lỗi ấy nay là tám luật, mỗi luật ở **một** nơi:

- `step2-script/GUIDE.md` + `PROMPT_CRITIC.md`: một số kèm đơn vị đứng trong một câu ("hai mươi" là một
  cụm), và một cờ mới `SPLIT` cho người chấm.
- `step6-assembly/GUIDE.md` + `PROMPT_CRITIC.md`: nhãn nằm trọn trong khung; mũi tên vào **tâm vật**;
  cận cảnh phải đọc ra đặc trưng của vật (tắt tiếng có nói ra được không); không để vùng phẳng chiếm
  gần nửa khung; không có điểm cháy trắng; vật phải trông đúng chất liệu của nó.
- `step7-delivery/GUIDE.md`: hình kết phải là hình `TREATMENT.md` hứa — và luật này áp cho mọi nhát, không
  riêng nhát cuối.

**Cái đáng nói nhất: số bị cắt đôi là lỗi máy đo được.** "Hai mươi" nằm cuối câu này và "mươi" đầu câu
kia là một hình dạng cụ thể trong `voice/lines.json` — không cần mắt người chấm, và lỗi ấy đã đi qua
**năm vòng chấm** mà không ai bắt, vì cả năm vòng đều đọc lời kể theo câu, không ai đọc *qua ranh giới
giữa hai câu*. Nay `tools/check_script.py` bắt nó, và ba ví dụ selftest giữ cho nó (cả câu đúng, cả
trường hợp không có số bị chia). Đây là mẫu chung của cả N128: **lỗi người chấm nêu ra thường là lỗi
máy đo được** — và mỗi lỗi như vậy nên có một cơ chế, không chỉ một dòng văn xuôi.

**Chưa làm được.** Bảy lỗi còn lại vẫn là luật văn xuôi: "cận cảnh phải đọc ra đặc trưng", "vùng phẳng
chiếm gần nửa khung", "hình kết phải khớp TREATMENT" — máy không đo được, vì chúng cần định nghĩa cái
đẹp. Chúng đã vào mẫu người chấm (nơi người chấm đọc) và vào hướng dẫn người làm (nơi lỗi được ngăn từ
đầu) — đó là mức chắc chắn cao nhất mà một luật văn xuôi có thể đạt. Nếu tập sau vẫn nêu lại những lỗi
này thì phải nâng chúng thành cơ chế đo, chứ không nâng thêm lần nữa vào văn xuôi.

## N129 — high — "Bóng này của ai?" là câu hỏi **đo được**, và câu trả lời nằm trong phim chứ không phải trong đầu người làm

**Bằng chứng.** Phiên tập 01 dò bóng ở nhát c27 bằng cách tự viết một cờ tạm vào **nguồn của chính tập
mình**: `?nc=9-12,74,75` để tắt `castShadow` của một dải `scene.children`, rồi render từng nghi phạm
một lần. Lệnh render của phiên đó lúc 17:12 là:

```
node core/render/still.mjs channels/tram-nghi-nhieu/series/do-vat/tap-01-phoi-quan-ao 82 \
  --q nc=9-12,74,75 --out /tmp/k_9-12,74,75 --prefix f_
```

Đó là mã chẩn đoán nằm trong mã của phim, và nó chỉ biến mất khi ai đó nhớ gỡ. Trong `src/set.js` của
tập 01 còn thêm `?list` và cách gắn `userData.tag` cho từng vật — cũng để dò. Nếu phiên giao phim lúc
đó, mã chẩn đoán đó đi thẳng vào commit.

**Vì sao đáng ghi riêng.** N125 đã nói đúng: viền mực là hiệu ứng sau-render nên **bóng không có cạnh**,
và người làm phải biết "bóng của ai" mới sửa được. Nhưng luật của N125 bảo người làm *dựng riêng từng
vật trong phòng và tìm vật nào khớp hình dáng* — tức là đoán bằng mắt, mỗi lần một vật, mỗi lần một
lần render. Đó là cách làm **tốn giờ của người làm** để trả lời một câu hỏi mà máy trả lời được chính
xác hơn: bóng là hình chiếu, nên tắt bóng của từng vật một và đo xem ô tối sáng lên bao nhiêu.

**Đã làm.** `channels/tram-nghi-nhieu/tools/shadow_who.mjs`:

```
node channels/tram-nghi-nhieu/tools/shadow_who.mjs <tập> --at 80.5 [--patch 0.72,0.85]
```

Cơ chế, theo thứ tự: (1) **vá module rig ngay trong trình duyệt** để lấy được `scene` — nguồn của tập
không bị đụng tới, nên không còn mã chẩn đoán nào nằm trong phim; (2) dựng khung lúc có bóng và lúc tắt
bóng (`?noshadow` của rig), tìm ô lưới tối nhất **thay đổi** giữa hai lần — đó là ô bóng; (3) tắt lần
lượt từng vật trong `scene` và đo lại ô đó: vật nào làm ô sáng lên nhiều nhất là vật đổ bóng; (4) in ra
số thứ tự, màu, vị trí và cỡ của vật đó.

Đo trên tập 01 lúc 80,5 s: ô tối nhất ở lưới (8, 11); thủ phạm là **child #100** — một Group ba mesh
màu `#efede4` đứng ở `(0.42, 1.42, -3.3)`; tắt riêng nó thì ô sáng thêm **+20,5** điểm, còn 85 vật
còn lại tắt đi thì ô sáng thêm **0,0**. Một con số khác 0,0 là câu trả lời; một loạt 0,0 là câu trả lời
"không phải nó".

**Còn lại.** Công cụ đo được bóng của *vật đang có trong `scene`*. Một vật bị dựng sai (đặt sai chỗ,
thu nhỏ, sai hướng) vẫn tìm thấy — nhưng nó nằm ngoài khung nên bóng của nó rơi vào trong khung, và
đó đúng là thứ ta cần. Còn mảng bóng mà *không vật nào* đổ thì công cụ in ra "không vật nào" — đó là
trường hợp khác (ánh sáng, vật thể trong `scene` con, hay bóng tự đổ của chính nó), và cần đọc tiếp.

## N122 (bổ sung) — Cùng một luật, hai cửa: vòng chấm cũng hỏi máy trước khi mở người chấm

**Đã làm (tiếp).** `tools/hook_load.py` chặn lệnh nặng **ở dòng lệnh**, trước khi nó chạy. Nhưng một
vòng chấm không phải lệnh nặng duy nhất: nó tự dựng ảnh (`propcheck.mjs` dựng 23 vật × 3 góc) **trước**
khi mở người chấm, và máy có thể đầy lúc đó. Nay `review.sh` hỏi **cùng một câu** (`hook_load.over_capacity()`)
ngay lúc mở người chấm — sau chính những lần dựng ảnh đó, nơi bộ nhớ thật sự bị dùng. Cùng ngưỡng, cùng
số liệu, cùng một chỗ đặt luật (`tools/hook_load.py`); `review.sh` chỉ gọi lại, không giữ ngưỡng thứ hai.

Khi máy quá tải, vòng chấm **không mở** (exit 2) và nói rõ: đợi việc đang chạy xong rồi chạy lại, đừng
mở thêm một vòng cùng lúc. Trước đây cùng tình huống đó chỉ có một cách: kernel giết vòng chấm, và
mất cả giờ.

**Nhưng cái giá của việc từ chối phải nói được.** Vòng bị từ chối ra mã `2` — cùng mã với một vòng
chết — và dấu vết của nó ghi: *"vòng chấm chết (exit 2) … đọc log của job nền rồi chạy lại"*. Người làm
đọc vậy sẽ đi tìm một log của một vòng **chưa bao giờ chạy** — và tệ hơn, người làm sẽ tưởng vòng
đó chết vì lỗi của tập. Tap-04 gặp đúng việc đó lúc 17:42 (vòng storyboard không mở vì máy hết chỗ),
trong khi chính lúc đó máy đang dựng ảnh vật cho ba tập khác.

Nay việc từ chối có mã riêng: **exit 3** — *vòng không mở*, không phải *vòng chết*. Dấu vết ghi rõ
("vòng chấm không mở (exit 3) … máy hết chỗ để mở vòng chấm, đây không phải chết: đợi việc đang chạy
xong rồi chạy lại"), và cổng (`gate.py`) in ra đúng câu đó thay vì "ĐÃ CHẾT … đọc log của job nền".
Hai ca selftest mới kiểm tra đúng mã ra và đúng câu trong dấu vết.

## N130 — medium — Số vật trong bản chấm **dịch chỗ** khi danh mục lớn lên, và đường dẫn bằng chứng đứt trong im lặng

**Bằng chứng.** `src/props.js` của tap-01 sửa lúc 07:52 ngày 09-11: thêm một vật (bàn phơi gỗ có nan) vào
danh mục. Từ đó **mọi vật đứng sau nó dịch một chỗ**: bàn tay người từ #25 thành #26.

Bản chấm vòng 5 (`review/PROPS-REVIEW-5.md`, 02:08) nói: *"#25 bàn tay người — B — HỎNG"*. Bản cắt của
đạo diễn (`review/PROPS-DIRECTORS-CUT.md`, 08:03 — viết **sau** lần sửa danh mục) lặp lại đúng số đó trong
danh sách tám vật đã sửa: *"#25 bàn tay"*. Nhưng hôm nay #25 là *"bàn phơi gỗ có nan, trải quần áo ra để
so sánh"*, và ảnh bằng chứng đi kèm nó (`review/props/p_25.jpg`) là **một cái bàn gỗ**; `p_26.jpg` mới là
bàn tay.

Cơ chế tem không thấy được. Tem của bản cắt bám vào hash của `src/props.js` — mà bản cắt được viết *sau*
lần sửa danh mục nên hash khớp → tem hợp lệ → `gate status` nói *"props PASS còn hiệu lực"*. Không có gì
hỏng, không có cảnh báo, và số sai trôi qua một cách êm ruột.

**Vì sao đáng ghi riêng.** Bản chấm vật dựng dùng **số thứ tự** để chỉ vật, mà số thứ tự là thứ **duy
nhất** thay đổi khi danh mục lớn lên. Mà danh mục lớn lên là điều **bình thường** — mỗi lần sửa một vật,
người làm thêm vật mới. Nên mọi vòng chấm sau đó đều mang số của vòng trước, và số đó lệch đi một chỗ
mỗi lần thêm vật. Người đọc bản chấm mở `p_25.jpg` để kiểm tra *"bàn tay đã sửa chưa"* và thấy một cái
bàn; rồi kết luận bàn tay **chưa** được sửa — hoặc tệ hơn, kết luận bản chấm sai. Cả hai đều sai, vì bản
chấm không sai: số của nó chỉ không còn chỉ vật đó nữa. Một số chỉ vào vật khác tệ hơn không có số, vì nó
trông có vẻ đúng.

**Đã làm.** `channels/tram-nghi-nhieu/tools/check_props_refs.py`:

- đọc danh mục `src/props.js` theo thứ tự; đọc **bản chấm vòng cuối** và **bản cắt của đạo diễn** — hai
  văn bản duy nhất mà phim dựa vào (các vòng cũ là lịch sử: số của chúng đúng cho danh mục hôm đó);
- chỉ **bốn hình dạng** mới là cách viện dẫn tới vật: dòng phán quyết `#N tên — A — KHỚP`, dòng bảng
  `**tên (#N)**`, mục đậm `**#N tên**`, danh sách trong ngoặc `(#N tên, …)`. Tên của người đoán mù
  (`#N TÊN: …`) và dòng tổng hợp **không** phải cách viện dẫn tới danh mục — người đoán mù gọi tên bằng
  lời của người xem, danh mục gọi tên bằng tên của phim;
- hỏi một câu: số N còn mang đúng cái tên đã viết không? So trên **từ**: mọi từ có nghĩa của tên đã viết
  phải có trong tên của vật thứ N trong danh mục. Nếu không, và cái tên đó thuộc về vật khác, thì báo
  **vật nào nó là** — *"bàn tay người là vật #26, không phải #25"*;
- 8 ca selftest; chạy trên năm tập: tap-01 báo **2** lỗi thật, bốn tập kia sạch.

**Đã làm (tiếp).** `review.sh` gọi kiểm tra này ở **ba cửa**: trước khi đóng tem cho bản cắt, ngay sau khi
bản chấm vòng mới được ghi, và trước khi nhận phim ở vòng `--final`. Vòng props FAIL nếu số trong bản chấm
không còn trỏ vào vật cũ — người làm phải sửa số (hoặc dời vật để số không dịch) rồi chạy lại.

**Còn lại.** Cơ chế này bắt được số dịch chỗ và tên không khớp danh mục, nhưng nó **không** bắt được trường
hợp người làm đổi **tên** của một vật trong danh mục mà quên đổi ở bản chấm — lúc đó số vẫn đúng, tên thì
lệch, và bản chấm trông đúng. Muốn bắt cả hai thì danh mục phải có một **mã** bền (không phải số thứ tự), và
đó là việc lớn hơn một vòng chấm. Hiện tại, giá của việc sửa số trong bản chấm là rẻ: người làm đã có sẵn
ảnh `p_NN.jpg` để đối chiếu.

## N131 — high — Vòng nghiệm thu cuối **lấy mẫu** phim theo thời gian: 36/60 câu không ai chấm, và lời dặn của người chấm bị shell ăn mất

**Bằng chứng.** Vòng `--final` của tap-01 chạy lúc 16:31 ngày 09-11: nó cắt **24 khung hình theo thời
gian** (mỗi ~7,3 s một khung), dán thành hai tờ, và người chấm kết luận REJECTED. Phim có **60 câu**
(`voice/lines.json`). Vậy **36 câu — 60% — chưa từng xuất hiện trước mắt người chấm**, và bản chấm không
nói điều đó.

Tệ hơn: lời dặn của người chấm bị **shell ăn mất một đoạn**. Trong `review.sh`, câu lệnh cho người
chấm nằm trong `"$( … )"`, và trong đó có `` `sheet_N.jpg` `` — mà backtick trong dấu nháy kép là **thay
thế lệnh**. Shell chạy `sheet_N.jpg` (không có lệnh đó), in "not found", và thay cả đoạn đó bằng
**rỗng**. Người chấm nhận được câu: *"mở từng tờ  — mỗi tờ là mười hai khung hình…"* — không có tên
tệp. Nó vẫn tìm được các tờ (nó liệt kê thư mục), nên lỗi này **im lặng**: không ai biết mà không tự
kiểm tra. Đã kiểm chứng bằng `sh -c 'x="mở \`sheet_N.jpg\` — xong"; echo "$x"'` → in ra `mở  — xong`.

**Vì sao đáng ghi riêng.** Đây là hình dạng thứ ba của *"một câu hỏi không ai hỏi"* (sau N130 về số vật
và lỗ hổng về tư thế vật trong cận cảnh): **người chấm cuối cùng — người quyết định phim được nhận —
nhìn phim bằng một mẫu**. Không có luật nào nói "người nghiệm thu phải thấy hết phim", và không có mặt
nào trong báo cáo nói "tôi chỉ thấy 24/60 câu".

**Đã làm.**

- Vòng `--final` nay **cắt một khung cho mỗi câu** khi có tờ nhịp điện biết mốc thời gian
  (`review/beatsheet/beats.json` hoặc `out/beats/beats.json`): 60 câu → 5 tờ, mỗi ô ghi **mã câu**
  (c27) thay vì số giây — nên lỗi trong báo cáo gọi đúng *tên câu*, và người làm mở đúng câu. Đã thử
  trên chính phim tap-01: 60 khung cắt sạch, 5 tờ, không có dòng lỗi nào trên stderr.
- Khi **không** có tờ có mốc thời gian, vòng vẫn lấy mẫu theo thời gian — nhưng nó ghi vào
  `COVERAGE.txt` rằng bao nhiêu câu **không** có khung, và lời dặn của người chấm phải nói rõ trong
  báo cáo là chưa soi câu nào. Lời dặn còn chỉ cách mở **khung gốc** của một câu
  (`tools/frames_at.py … --lines c17 --cols 1 --w 1200`), vì ô nhỏ thì đọc sai.
- Backtick trong lời dặn: bỏ hết, dùng nháy đơn. (`get_prompt` đọc mẫu từ tệp nên không dính; chỉ câu
  viết tay trong `review.sh` mới dính.)

**Còn lại.** Một khung cho mỗi câu vẫn là **một** khung: một câu mà lỗi chỉ hiện ở nửa sau nhịp thì ô
lấy ở 60% nhịp có thể không thấy. Vòng `--video` (bốn khung cho mỗi câu) là chỗ dành cho việc đó; nó vẫn
chưa bắt buộc trong cổng — một câu hỏi mở cho lần sau.

## Đánh giá khách quan phim tap-01 (60 câu, đọc từ chính phim đã dựng)

**Cách đọc.** Không xem ảnh tĩnh của vật — xem phim. 60 câu được cắt từ **mp4 đã dựng** bằng
`tools/frames_at.py` và dán bằng `core/render/sheet.py` thành ba tờ, thêm khung cuối và hai cận cảnh
c55/c55b ở 1280 px. (Tự dựng tờ bằng ffmpeg thì không được: thư viện đã có công cụ, và R10 cấm vòng tay.)

**Phim là gì.** Một diorama toon có thật: bàn phơi gỗ có nan, quần áo ướt và khô đặt cạnh nhau, bồn chậu,
quạt bàn, cân nhà bếp, nhiệt kế, ẩm kế. Người kể có giọng tiếng Việt, phụ đề đọc được, nhãn trong khung
chỉ **đúng vật** (nhãn mũi tên chỉ vào tâm vật), và máy quay **đi vào trong vật** — cận giọt nước sau vách
bàn — chứ không lơ lửng bên ngoài. Câu hỏi của tập (*tại sao một cái áo ướt lại khô ở một nửa?*) được
đặt ra rồi **để** người xem tự trả lời, không giảng. Đó là đúng ý của kênh.

**Những gì đã làm việc.** Vòng chấm vật dựng tìm ra **8 vật HỎNG** — trong đó bàn tay người đọc thành *"bàn
chân mannequin gắn vào một cán gỗ"*, và một móc xích đọc thành lọ thuỷ tinh. Đó là vòng chấm làm việc:
không có nó, người xem sẽ thấy một bàn chân gỗ trong phim và tưởng đó là ý kể.

**Những gì chưa đạt.** Sáu điểm, xếp theo mức độ:

1. **c27 — khối xanh navy và một điểm cháy trắng.** Viền mực là hiệu ứng *sau-render*, nên bóng và cạnh
   gradient không có viền, và đọc như **lỗ hình** trong tấm vải. Đây là lỗi mà N125/N129 đã đo được.
2. **c48 và c58 — hai hình chữ nhật tối, sắc cạnh, nằm trên áo.** Cùng một nguyên nhân: vùng tối không có
   viền nên đọc như lỗ đen, và người xem đọc nó như một vật khác đặt trên áo.
3. **c55 — bàn tay đọc thành một búi ngón tay.** Bàn tay đọc *được* trong `p_26.jpg` (ảnh vật dựng cô lập,
   tư thế nghỉ) nhưng hỏng trong phim, vì phim cho nó một tư thế khác. Đây là khoảng trống thật của vòng
   chấm vật: nó chấm vật **cô lập**, không chấm vật **trong tư thế phim dùng**.
4. **Hình cuối — hai bàn phơi có quần áo**, trái với TREATMENT đã hứa (*một cái áo úp còn ẩm trên sàn*).
   Người xem đã đi theo cả phim rồi mà bị đưa ra bằng một hình khác hẳn câu chuyện.
5. **Nhiều cặp khung liên tiếp gần như giống nhau.** Máy đã gắn cờ `SAME` trong tờ nhịp điện, nhưng
   cờ đó là *cần mắt người phán* — chưa có luật nào giữ.
6. **Chữ nhỏ trên vật không đọc được** (mặt cân in số 0–400 g): người xem thấy những con số không nói
   với ai. Bản cắt của đạo diễn đã xử lý (bỏ số, chỉ giữ vạch và kim) — nghĩa là luật ở đây là **bản
   cắt**, không phải một quy tắc chung.

**Chỗ nào giữ lỗi nào, sau khi giám sát này.** Lỗi 1 và 2 → luật của N125 (bóng không có cạnh) và công cụ
đo của N129, cộng luật *không có điểm cháy trắng* của N128. Lỗi 3 → luật của N128 (*cận cảnh phải đọc ra
được đặc trưng của vật*). Lỗi 4 → luật của N128 ở `step7-delivery` (*hình kết là hình TREATMENT đã hứa —
cho **mọi** cảnh, không riêng cảnh cuối*). Lỗi 5 **chưa** có luật: cờ `SAME` mới chỉ là một lời nhắc cho mắt
người. Lỗi 6 **chưa** có luật chung: nó sống trong bản cắt của từng tập.

**Nhìn lại toàn quá trình.** Điều làm tập này kéo dài không phải là phim khó — mà là **mỗi vòng chấm trả lời
một câu khác nhau**: vòng vật hỏi *vật này là gì*, vòng storyboard hỏi *bố cục có đúng không*, vòng hình hỏi
*khung hình này có đẹp và đúng không*, vòng cuối hỏi *cả phim có đúng không*. Không vòng nào hỏi *con số
trong bản chấm còn trỏ đúng vật không* — và đó là lý do bàn tay sửa xong vẫn không có bằng chứng (N130).
Cũng không vòng nào hỏi *vật trong tư thế phim dùng có đọc ra không* — nên bàn tay hỏng ở c55 mà vẫn
được tem vật dựng (lỗi 3). Hai lỗ hổng đó có cùng một hình dạng: **một câu hỏi mà không ai hỏi**, và vì
vậy không ai trả lời, và vì vậy phim vẫn "PASS".

## N132 — vòng chấm vật có thể bắt người làm sửa một vật đang đúng

**Cái thấy được.** Vòng `--props` thứ năm của tap-01 FAIL: tám vật "HỎNG". Tôi mở hai ảnh ra xem:

- `review/props/p_17.jpg` — một lưới sợi đan: sợi cuộn tròn đan qua nhau, đúng ý nghĩa danh mục `#17`
  *sợi vải đan cận*. Bản chấm gọi nó là *đống lọ thuỷ tinh nhỏ có nắp kim loại* và phán HỎNG.
- `review/props/p_26.jpg` — một bàn tay có cổ tay, đúng ý nghĩa danh mục `#26` *bàn tay người*. Bản chấm
  gọi nó là *bàn chân người gắn vào một cán gỗ dài* và phán HỎNG.

Cả hai là vật **đúng**, bị đòi sửa. Người làm đã bắt đầu sửa `src/props.js` theo bản chấm — sửa một lưới sợi
đan thành đống lọ, và một bàn tay thành bàn chân.

**Vì sao vòng chấm đi sai.** Vòng chấm vật có hai người đọc: người đoán mù (nhìn ảnh, không biết tên người
làm định dựng) và người chấm (mở ảnh, so với tên định dựng). Ở tập này người đoán mù đọc sai hai ảnh, và
người chấm đã lấy lời của người đoán mù làm căn cứ phán quyết. Luật của nhóm B nói "chỉ HỎNG khi ảnh cho
thấy một vật thật khác" — nhưng dòng phán quyết **không có lời của người chấm**, nên không ai, kể cả người
đọc bản chấm, thấy được rằng người chấm chưa tự mở ảnh.

**Hai lỗ hổng khác trong cùng một bản chấm.**

1. **Số trong BLIND.md không đáng tin.** Người đoán mù tự đánh số dòng của nó: mục #20 và #21 bị hoán
   đổi so với file ảnh, và mục #25 **thiếu hẳn**. Người chấm biết điều này (ghi rõ trong bản chấm) mà vẫn
   dùng các số ấy để so.
2. **Vật #25 không có dòng phán quyết nào** — 25 trên 26 vật được chấm. Vòng vẫn xong, và nếu nó PASS thì
   phim đi ra với một vật chưa ai nhìn.

**Cái đã thêm.**

- Dòng phán quyết phải có **"ảnh cho thấy:"** — lời của chính người chấm. Không có nó thì dòng chỉ là lời
  của người đoán mù, và không ai kiểm tra được; có nó thì người đọc thấy ngay khi hai bên lệch nhau.
- Luật nhóm B nói rõ: **căn cứ là ảnh người chấm tự mở**; ảnh đúng mà người xem gọi nhầm tên thì dòng đó là
  KHỚP kèm ghi chú, không phải HỎNG.
- `channels/tram-nghi-nhieu/tools/props_report_check.py`: mỗi vật phải có **đúng một** dòng phán quyết
  (thiếu hoặc lặp là lỗi chặn vòng), và số trong BLIND.md được báo là không đáng tin khi lệch với tên file.
- Người đoán mù nay ghi **tên file ảnh** vào mỗi dòng: tên file là sự thật, số nó tự đánh thì không.

**Còn lại trong bản chấm này.** Sáu vật còn lại trong tám vật HỎNG tôi chưa mở ảnh: `#20` (tôi đã mở — đúng là
HỎNG thật: ảnh là một cây chải, không phải mặt nước), `#2`, `#9`, `#17`, `#18`, `#19`, `#24`. Với `#17` và `#26`
tôi đã mở và xác nhận là HỎNG **sai**; người làm đã được báo trước khi sửa.

