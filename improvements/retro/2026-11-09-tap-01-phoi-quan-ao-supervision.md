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
