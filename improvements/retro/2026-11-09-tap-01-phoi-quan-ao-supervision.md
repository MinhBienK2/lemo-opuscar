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

**Guard.** Chưa có. Cần một vòng chấm mù chạy lại trên **cùng tập ảnh** để biết vòng 2 là dao động của người
chấm hay lỗi thật. `review.sh` có thể so hash `src/props.js` giữa hai lượt chấm và in cảnh báo khi vật đổi
trạng thái mà mã không đổi.

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
| 8 | So trạng thái vật giữa hai lượt chấm props (N10) | `tools/review.sh` | chưa làm |

---

## Mục chưa xử lý

- **[ ]** Chưa có phim: `out/` còn rỗng. Cổng props đã đổi và đang chạy vòng 5; cổng storyboard mới; cổng
  hình (`picture`) và cổng lời kể (`script`) vẫn chưa có PASS cho tập này.
- **[ ]** `film.json` của tập còn `"runtime": ""` — `filmcheck` sẽ FAIL cho tới khi điền.
- **[ ]** N10: cần một phiên chấm mù chạy lại trên **cùng tập ảnh**. Chưa làm.
- **[ ]** `improvements/lessons.md` chưa có dòng nào cho N1–N4 và N10.
