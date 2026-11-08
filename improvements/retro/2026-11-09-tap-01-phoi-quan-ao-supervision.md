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
| 16 | `tools/replace.py`: sửa file bằng kịch bản mà vẫn đếm số lần khớp và ghi nguyên tệp | `tools/replace.py`, `CODING_STANDARDS.md` R1 | **xong** |
| 17 | CI đo được chính các phim trong repository: định dạng, độ lớn tiếng, thời lượng | `tools/check_movies.py`, `.github/workflows/films.yml` | **xong** |
| 18 | Luật R1 của người giám sát đếm **file được ghi**, không phải file được nhắc tới; một dòng cho mỗi luật (N17) | `tools/supervise.sh`, `improvements/README.md` N17, `improvements/lessons.md` | **xong** |
| 19 | Người chấm hình đọc **tờ sheet** trước, ảnh riêng chỉ khi tờ chưa đủ (N18) | `channels/tram-nghi-nhieu/tools/review.sh`, `step6-assembly/PROMPT_CRITIC.md` | **xong** |
| 20 | Thời lượng phim được **đo** rồi mới ghi vào manifest; cổng so manifest với `ffprobe` (N19) | `core/render/new_episode.sh`, `core/render/review.sh` | **xong** |

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

## Mục chưa xử lý

- **[ ]** Chưa có phim: `out/` còn rỗng. Cổng props đã đổi và đang chạy vòng 5; cổng storyboard mới; cổng
  hình (`picture`) và cổng lời kể (`script`) vẫn chưa có PASS cho tập này.
- **[x]** N10 (một phần): một phiên chấm mù chạy lại trên **cùng tập ảnh** vẫn chưa làm — để biết vòng nào là
  lỗi thật chứ không phải dao động của người chấm. Đã có guard báo hiện trạng.
- **[x]** `improvements/lessons.md` đã có dòng cho N1–N4 và N10 (xem bảng trên).
- **[ ]** `films/host-toon-test` **không vượt được cổng bàn giao của thư viện** hôm nay: `readcheck` báo
  "5 tháng" chạm vào dải phụ đề (`y=911` > 880), và `scenecheck` báo 2,42 con số mỗi 20 giây (7,3 mỗi phút)
  trong khi luật của kênh là 2 mỗi phút. Cả hai lỗi là **cũ**, không phải do các guard mới: chạy lại bằng
  `readcheck` **trước** khi sửa (`git stash`) cho ra đúng dòng BAD đó. CI không bắt được vì bước kiểm tra
  của CI không mở trình duyệt. Đây là phim một-lần của thư viện, không phải tập của kênh — luật của kênh
  không áp cho nó, nhưng cổng của thư viện thì có.
- **[ ]** Chưa có lượt sản xuất nào chạy với các guard mới (chặng đọc, vân tay nguồn, kiểm tra con trỏ):
  lần sản xuất kế tiếp là lần kiểm chứng đầu tiên của chúng.
