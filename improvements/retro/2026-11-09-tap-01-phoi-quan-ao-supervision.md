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
