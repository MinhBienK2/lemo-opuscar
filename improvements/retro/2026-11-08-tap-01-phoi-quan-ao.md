# Retro — tap-01-phoi-quan-ao: vòng lặp không có chặn (2026-11-08)

Phiên làm việc này dựng tập đầu tiên của cột `series/do-vat/` của kênh Trạm Nghĩ Nhiều:
`channels/tram-nghi-nhieu/series/do-vat/tap-01-phoi-quan-ao`
("Vì sao phơi quần áo cần gió?", 60 câu, 153,2 s giọng).

**Phiên chưa sinh ra phim.** Sau 12 giờ 47 phút, `out/` còn rỗng: không `.mp4`, không `.srt`,
không `poster.jpg`. Bốn tem cổng (`review/*.pass`) chỉ có hai (`OUTLINE.pass`, `SCRIPT.pass`);
`PROPS.pass` và `PICTURE.pass` — hai tem mà `gate.py` đòi trước khi render — không có.

Bản ghi này **không** đóng các lỗi. Nó ghi lại những lỗi và cách vá chúng, để xử lý sau.

---

## Bối cảnh và Thống kê phiên

| | |
|---|---|
| Phiên | `~/.claude/projects/-home-minhbien-Documents-lemo-opuscar/e8ec853c-2f62-427e-9528-3cdc7c568ee1.jsonl` |
| Bắt đầu → kết thúc | 10:42 → 23:29 (+07), **12 h 47 phút** |
| Kích thước transcript | 554 MB · 27.088 dòng |
| Lượt assistant | 3.808 |
| Công cụ | `Bash` 1.945 · `Read` 791 (606 lần đọc ảnh) · `Edit` 316 · `Write` 44 · `Agent` 33 (subagent chấm) |
| Compaction | 25 lần ("ran out of context") |
| Lệnh `sleep` thăm dò | 7 |
| Lệnh heredoc ghi file | 307 (207 lệnh trong đó chạm thẳng vào thư mục tập) |
| Script tạm tự chế | 86 file trong `/tmp` (`stills2.mjs`, `merge_props.py`, `mont2.py`, `cand.py`, `flag.py`, `refrender.mjs`…) |
| Thư mục ảnh tạm | 321 MB (35 thư mục: `shots1..11`, `look1..W`, `r4..r9`, `v5`, `v14`, `b16`…) · 346 đường dẫn `/tmp` khác nhau |

### Dòng thời gian các vòng chấm

```
10:57  OUTLINE-REVIEW-1.md          11:26  SCRIPT-REVIEW-1.md
11:09  OUTLINE-REVIEW-2.md          11:39  SCRIPT-REVIEW-2.md      → SCRIPT.pass
11:15  OUTLINE-REVIEW-3.md          13:52  STORYBOARD-REVIEW.md   (round 2/5)  REJECT
11:20  OUTLINE-REVIEW-4.md          14:55  STORYBOARD-REVIEW-3.md (round 3/5)  REJECT
       → OUTLINE.pass               15:20  PROPS-REVIEW-1.md       FAIL (14/24 KHỚP)
                                    16:22  STORYBOARD-REVIEW-4.md (round 4/5)  REJECT
                                    18:35  STORYBOARD-REVIEW-5.md (round 5/5)  REJECT
                                    19:42  STORYBOARD-DIRECTORS-CUT.md  (đóng tay)
                                    20:02  ASSET-AUDIT-REPORT.md  REJECT, 35 lỗi
                                    20:35  PROPS-REVIEW-2.md      FAIL (8/24 KHỚP)
                                    21:08  ASSET-AUDIT-REVIEW-4.md REJECT
                                    22:10  PROPS-REVIEW-3.md      FAIL (14/24 KHỚP)
                                    22:23  ASSET-AUDIT-REVIEW-5.md REJECT (ROUND 5/5)
                                    23:29  vẫn đang chạy, vẫn chưa có phim
```

Ba vòng props và hai vòng audit chạy **song song** với vòng storyboard; mỗi vòng props là
~40 phút (render 48 ảnh 3 phía + 2 subagent critic).

---

## Những điểm thành công

1. **Cổng máy hoạt động đúng.** `gate.py` chặn thật: `out/` rỗng và không có tem props/picture,
   nên không có bản render nào được ký tên "đã xong". Đây là bằng chứng rõ nhất cho
   `improvements/lessons.md`: *"a gate that cannot fail the build is decoration"* — cổng này không trang trí.
2. **`tools/check_claims.py` và `check_facts.py` xanh suốt 12 h** trên một tập có số trên hình
   (`288 g`, `90 %`, `2 kJ`, `30 °C`) — bản chấm số chạy đúng.
3. **Beatsheet sạch cờ.** `review/beatsheet/beats.json`: 60 nhát, **0 cờ** `DARK/SAME/NUM/RUN`.
   Nhịp máy đúng; phần còn lại là hình, không phải nhịp.
4. **Vòng audit cuối đóng được phần "bỏ sót".** `ASSET-AUDIT-REVIEW-5.md`:
   `MISSING_ASSETS_COUNT: 0` — 5 mục bỏ sót của vòng 4 đã sửa và kiểm lại bằng ảnh thật.
5. **Đạo diễn cắt (Director's Cut) là đúng quy trình.** Vòng 5/5 REJECT → chốt bằng
   `STORYBOARD-DIRECTORS-CUT.md` ghi rõ cái đã sửa và cái không sửa được, thay vì giả vờ PASS.

---

## Phát hiện (Findings)

Mỗi mục kết thúc ở **một guard đề xuất** hoặc ở câu **"chưa có guard — để sau"**.
Chưa mục nào được nối vào mã: đây là danh sách việc, không phải việc đã làm.

### P1 — critical — Cổng props không với tới được: PASS đòi cả 24 vật, trong đó có vật không ai gọi tên được

**Bằng chứng.** `channels/tram-nghi-nhieu/tools/review.sh:156` yêu cầu
`VERDICT: PASS | FAIL (PASS chỉ khi mọi vật KHỚP)` trên toàn bộ bảng `PROPS` của
`src/props.js` — 24 vật. Năm vật là **linh kiện vi mô**:
`#17 sợi vải đan cận`, `#18 tấm vải dệt: sợi dọc luồn qua sợi ngang`, `#19 giọt nước đọng trên sợi`,
`#20 mặt nước cận có gợn sóng`, `#23 giọt nước rơi từ mép khăn`.
Người xem bình thường không đoán tên được chúng — và rubric của bản thân `review.sh` đã thừa nhận điều đó
(`Riêng linh kiện kỹ thuật mà người thường không biết tên … KHỚP khi người xem tả đúng hình thật làm nên nó`),
nhưng quy tắc PASS lại phủ định nó: một vật vi mô chỉ cần **KHÔNG RÚ** để FAIL.

Ba vòng đo được (đếm từ `review/PROPS-REVIEW-*.md`):

| Vòng | KHỚP | HỎNG | Tập vật HỎNG |
|---|---|---|---|
| 1 (15:20) | 14 | 10 | 3, 5, 9, 17, 18, 19, 20, 22, 23, 24 |
| 2 (20:35) | 8 | 16 | 1, 2, 3, 4, 7, 8, 9, 11, 16, 17, 18, 19, 20, 21, 22, 23 |
| 3 (22:10) | 14 | 10 | 3, 5, 9, 17, 18, 19, 20, 22, 23, 24 |

Cả ba vòng đều FAIL, và **cả ba vòng đều FAIL vì cùng một lý do**: năm vật vi mô (17, 18, 19, 20, 23)
chưa bao giờ khi nào là KHỚP. Cổng không mở được, và không có chỗ nào trong quy trình nói rằng nó sẽ không mở.

**Hệ quả.** Mỗi vòng props tốn ~40 phút. Không có trần số vòng cho `--props`
(`--outline` có trần 4, `--script` trần 6, `--picture` trần 5 — `review.sh:114,179,268`).
Vòng 4 sẽ tới, rồi vòng 5, rồi mãi.

**Guard đề xuất.** (a) Sửa quy tắc PASS của `review.sh --props` thành **chấm theo nhóm**:
*Nhóm đời thường* (`src/props.js` Nhóm 1: dây phơi, kẹp gỗ, áo, quần, khăn, bồn, quạt, túi, cân, đồng hồ, ghế, bàn)
phải KHỚP; *Nhóm vi mô* (Nhóm 2/4) chỉ cần **đọc ra đúng cơ chế** và **không bị gọi nhầm thành một vật khác**.
(b) Thêm trần vòng cho `--props` (5), với thông điệp *"dừng, báo người dùng phần còn lại"* — cùng câu chữ
mà `--outline`/`--script`/`--picture` đã dùng.

### P2 — critical — Tem outline không bao giờ được đối chiếu lại với dàn ý đã sửa

**Bằng chứng.** `channels/tram-nghi-nhieu/tools/gate.py:153`:

```python
if kind != 'outline' and head[0] != digest(ep, kind, ch): return 'đã đổi sau lần PASS cuối'
```

`digest(ep, 'outline')` được **tính** (`gate.py:113-117`, hash của `TREATMENT.md` + `research/FACTS.md`),
được **ghi** vào `review/OUTLINE.pass` (`gate.py:141`) — và **không bao giờ được so**.
Nhánh `kind == 'outline'` bị loại khỏi điều kiện, nên tem vẫn hợp lệ sau mọi lần sửa dàn ý.

Số liệu của chính tập này: `review/OUTLINE.pass` đóng lúc **11:20**;
`TREATMENT.md` sửa lúc **11:51**; `research/FACTS.md` sửa lúc **11:40**.
Tem báo "đã đổi sau lần PASS cuối" cho mọi loại khác — riêng dàn ý thì không.

**Hệ quả.** `OUTLINE-REVIEW-4.md` duyệt "26 nhát, tổng 257 giây = 4:17" và "631 từ";
`TREATMENT.md:7-8` sau đó ghi "635 từ … 153,2 s … Phim dài 2:56". Bản chấm không còn nói về bản dàn ý đang dùng.

**Guard đề xuất.** Bỏ `kind != 'outline' &&` ở `gate.py:153` — một dòng.
*Nhưng:* `gate.py:16-18` ghi rõ chủ ý bỏ qua dàn ý ("It is not reopened by later edits of the treatment").
Nếu giữ chủ ý đó thì phải **in ra** trong `OUTLINE.pass` rằng tem không bám theo dàn ý, để người đọc biết.

### P3 — critical — Bước 3 (storyboard) không có tem nào trong cổng, và không có công cụ chấm

**Bằng chứng.** `gate.py:34` — `WHAT = {'outline', 'script', 'props', 'picture'}`. Bước 3 không có.
`review.sh` có `--outline`, `--script`, `--props`, `--lines`, `--chapter`, `--video` — **không có chế độ nào cho
storyboard** (grep `channels/tram-nghi-nhieu/tools/` không ra `ASSET-AUDIT` hay `step4`).
Năm bản chấm storyboard (`STORYBOARD-REVIEW.md`, `-3`, `-4`, `-5`, `+ DIRECTORS-CUT.md`) đều **do tay đặt vào**,
không qua `review.sh`, nên không có chữ ký người chấm, không có `critic:`, không được ai ràng buộc.

Hệ quả kép:
- Bước 3 có thể bị **bỏ qua trọn vẹn** mà không gì phát hiện — không có tem nào phải có.
- Bước 6 (chấm hình) dùng rubric **khác** (`step6-assembly/PROMPT_CRITIC.md`, chấm `DARK/SAME/NUM/RUN`
  và điểm bố cục/ánh sáng/góc máy), nên nó không bắt được loại lỗi mà storyboard chấm.
- `review/STORYBOARD-REVIEW.md` (không hậu tố) giữ **round 2/5** trong khi `STORYBOARD-REVIEW-5.md` là round 5 —
  đọc file không hậu tố thấy verdict **cũ**. Đây là điểm P3 cộng với P7.

**Guard đề xuất.** Thêm kind `storyboard` vào `gate.py` (`WHAT`, `digest`, `stamp_path`) và vào `NEEDS['render']`;
thêm chế độ `--storyboard` vào `review.sh` (nhận `LOOK.md` + `src/film.js` + ảnh hero), với
`STORYBOARD-DIRECTORS-CUT.md` được tính là một dạng PASS có phạm vi (ghi rõ nhát nào đã cắt).

### P4 — critical — Không có trần vòng cho `--props`, và bước 4 không có công cụ nào để đếm vòng

**Bằng chứng.** `review.sh:114` (`--outline`, trần 4), `:179` (`--script`, trần 6), `:268` (`--picture`, trần 5)
— `--props` không có. Vòng props đã đi tới 3 (15:20, 20:35, 22:10) trong một ngày, mỗi vòng ~40 phút.

Bước 4 (bóc tách linh kiện) có `GUIDE.md` và `PROMPT_CRITIC.md` trong skill, nhưng **không có script nào**
chạy nó: `ASSET-AUDIT-REPORT.md`, `ASSET-AUDIT-REVIEW-4.md`, `ASSET-AUDIT-REVIEW-5.md` đều do tay đặt vào.
Không có cách đếm vòng, không có trần, không có tem. Phiên này đã chạy tới vòng 5/5 của audit
(vòng 5 vẫn REJECT: 15 hàng sai cột "Xuất hiện ở", 1 hàng sai quy ước đo, 3 điểm LOOK sai).

**Guard đề xuất.** `--props` có trần 5 với thông điệp dừng; một chế độ `--assets` cho bước 4 trong `review.sh`
đếm vòng, chấm `COMPONENTS_SPEC.md` chéo với `voice/lines.json` + `LOOK.md` + `src/`, và đóng tem.

### P5 — high — Giám sát nhìn nhầm phiên: nó đọc thư mục session của omp, phiên thật là Claude Code

**Bằng chứng.** `tools/supervise.sh:32`:
`SESSIONS=${SUPERVISE_SESSIONS:-$HOME/.omp/agent/sessions/$SLUG}`.
Phiên sản xuất là Claude Code, transcript ở
`~/.claude/projects/-home-minhbien-Documents-lemo-opuscar/e8ec853c-*.jsonl`.

Hậu quả đã ghi trong chính nhật ký giám sát:
- `improvements/supervision/rules-latest.txt` — **1 byte** (rỗng): không lần nào thấy phiên vi phạm gì.
- `improvements/supervision/reviewer.log` — "the supervised transcript … is not a film session",
  "the session that wrote the film's treatment, research, `src/` and the channel's `rig/`" không ai thấy.
- Vì vậy **307 lệnh heredoc ghi file** (vi phạm `CODING_STANDARDS.md` R1 — ghi cả `voice/lines.json`,
  `src/props.js`, `src/set.js`, `src/timeline.js`) và **7 lệnh `sleep` thăm dò** (R5) đã đi qua 12 giờ 47 phút
  mà không có nhân chứng.

**Guard đề xuất.** `supervise.sh` quét thêm `~/.claude/projects/*/*.jsonl` với cùng bộ detector
(`tool_execution_start` / `tool_name` + `args.path`), và **in ra** khi phiên được chọn không ghi gì
trong thư mục phim — để "không có gì bị phá" không đọc thành "chưa ai nhìn".

### P6 — high — Tập không vào repository; check đã có nhưng giám sát không chạy

**Bằng chứng.** `.gitignore:146` là một dòng: `channels/tram-nghi-nhieu/series` — xoá trọn cây tập.
`git check-ignore -v` xác nhận mọi file của tập đều bị loại.
`python3 tools/check_tracked.py channels/tram-nghi-nhieu/series/do-vat/tap-01-phoi-quan-ao` → **FAIL**:

```
the treatment of …/tap-01-phoi-quan-ao cannot be committed
a film's treatment is a deliverable (DIRECTOR.md §11); the .gitignore rule that
keeps it tracked does not match this path any more — fix the rule, not the file.
```

`tools/check_tracked.py` đã có và **đã được nối vào CI** (`.github/workflows/films.yml:129`) và pre-commit hook.
Nhưng `tools/supervise.sh:152-160` chạy `filmcheck`, `drawcheck`, `citations`, `claims`, `facts`, `index` —
**không** chạy `check_tracked`. Đỏ suốt 12 h không ai thấy.

**Guard đề xuất.** Thêm `gate_step tracked "$PY" "$LIB/tools/check_tracked.py" "$FILM"` vào `supervise.sh`
(cùng hình dạng với các bước còn lại). Và **nới `.gitignore:146`** để cây tập được theo dõi,
chỉ loại `.mp4`/`.srt`/`poster.jpg`/`out/` — theo đúng câu chữ trong `improvements/README.md`:
*"the rationale of a film belongs with the film"*.

### P7 — medium — Bản chấm không hậu tố giữ verdict cũ, và hai file trùng byte được tính là hai vòng

**Bằng chứng.** `review.sh:161` copy cùng một file ra hai chỗ:
`cp R.md "$EP/review/PROPS-REVIEW-$n.md"; cp R.md "$EP/review/PROPS-REVIEW.md"`.
Tính đến 23:29: `md5sum PROPS-REVIEW*.md` →
`-1` = `1b7339d7…`, `-2` = `f305d769…`, `-3` = `4eb39206…`, và `PROPS-REVIEW.md` = `4eb39206…` (trùng `-3`, đúng thiết kế).
Nhưng ở 15:20, `PROPS-REVIEW.md` và `PROPS-REVIEW-1.md` **trùng byte** (`1b7339d7…`) vì đó là cùng một lượt chấm.
Tệ hơn: `review/STORYBOARD-REVIEW.md` đọc `ROUND: 2/5` trong khi `STORYBOARD-REVIEW-5.md` đọc `ROUND: 5/5` —
file không hậu tố giữ bản **cũ nhất** của chính nó, và bốn bản chấm storyboard có số vòng lộn xộn.

**Guard đề xuất.** `core/render/filmcheck.mjs` báo: hai file review trùng hash (một lượt chấm, không phải hai),
và file không hậu tố phải là bản **mới nhất** — nếu không, nó phải bị xoá thay vì để lại.

### P8 — medium — Chấm hình bằng 606 lần đọc ảnh, không dùng contact sheet có sẵn

**Bằng chứng.** `core/render/sheet.py` tồn tại và `improvements/lessons.md` đã ghi tên nó:
*"Use the tools the library already has: `core/render/still.mjs` and `core/render/sheet.py`,
not a hand-rolled ffmpeg montage."*
Phiên này gọi `sheet.py` **0 lần**, đọc **606** ảnh một-lẻ (mỗi lần ~680 KB ≈ 262 MB),
và tự dựng **86** script tạm để làm việc mà `sheet.py` đã làm được.
`core/render/still.mjs` nhận **nhiều** mốc thời gian trong một lần gọi ("one page, many stills"),
nhưng 42 lệnh chỉ truyền **một** mốc.

**Guard đề xuất.** Một lệnh `review.sh --contact-sheet` in sheet theo nhóm (60 nhát → 5 sheet)
và ghi đường dẫn vào `TASK.md`; agent xem 1 ảnh thay vì 60. Không cần check — đây là đường dẫn.

### P9 — medium — Người chấm đổi ý trên vật không đổi, và lỗi hình mới được sửa thành lỗi hình khác

**Bằng chứng.** So vòng props 1 và vòng props 2 (giữa hai vòng, `src/props.js` được sửa lại):

| Vật | Vòng 1 | Vòng 2 |
|---|---|---|
| #1 dây phơi thừng chùng | KHỚP | HỎNG — *"đoạn hàng rào dây thép gai giữa hai cọc gỗ sơn nâu đỏ"* |
| #2 kẹp quần áo bằng gỗ | KHỚP | HỎNG |
| #7 khăn tắm có mép tua | KHỚP | HỎNG |
| #11 túi nylon buộc dây | KHỚP | HỎNG |
| #16 bàn gỗ với hai mặt kính | KHỚP | HỎNG |
| #21 áo phơi một mặt | KHỚP | HỎNG |

Lần này phán quyết là **có cơ sở**: bản sửa của vòng 1 biến sợi dây thành có gai nhọn
(*"hàng gai nhỏ đen nhô ra hai bên theo nhịp đều đặn (dây thép gai, không phải dây phơi)"*),
và bản sửa của vòng 2 biến kẹp gỗ thành *"hai thanh/ván màu vàng nâu bo tròn hai đầu đứng song song,
buộc bằng dải vải trắng"*. Nhưng nó cho thấy: **sửa hình theo lời chấm vòng trước làm hỏng vật đang
đúng**, và vòng sau lại chỉ ra vật mới hỏng. Chu kỳ này không có điểm dừng.

**Guard đề xuất.** Không có check nào phân biệt được "sửa tốt" với "sửa hỏng" — đây là chỗ một
**vòng chấm mù** (không thấy tên) cần chạy lại trên **cùng tập ảnh** để so: nếu vật KHỚP ở vòng n-1
và HỎNG ở vòng n mà mã không đổi, đó là dao động của người chấm, không phải lỗi mới — và vòng đó không
nên tính. `review.sh` có thể so hash `src/props.js` giữa hai lượt chấm và in cảnh báo khi vật đổi trạng thái
mà mã không đổi.

### P10 — medium — Skill không trỏ tới `lessons.md` và `CODING_STANDARDS.md`

**Bằng chứng.** `grep` trong `.claude/skills/tram-nghi-nhieu/SKILL.md` (và toàn bộ
`.agents/skills/tram-nghi-nhieu/`): **0** kết nối tới `improvements/lessons.md`,
`CODING_STANDARDS.md`, hay `improvements/retro/`.
`improvements/README.md` tự dặt: *"Read the distilled version. `lessons.md` — the reusable rules, one line each,
with the guard that enforces them. Read this before you build a film."* — nhưng không có gì chỉ đường cho skill.

**Guard đề xuất.** Một dòng con trỏ ở đầu `SKILL.md`, không nhét cả file. Cùng đợt: `.agents/skills/tram-nghi-nhieu/`
và `.claude/skills/tram-nghi-nhieu/` **giống hệt từng byte** (`diff -r` → identical), và `review.sh:66-69`
phải dò bốn nơi để tìm `PROMPT_CRITIC.md`. Một bản + symlink.

### P11 — low — Hai lỗi nhỏ đang đỏ, không ai sửa

- `python3 tools/check_films_index.py` → **FAIL (3 problems)**: `FILMS.md` còn ba dòng trỏ tới
  `series/co-the/tap-01-ngu-trua-day-me/`, `series/do-vat/tap-01-bong-den-led/`, `series/do-vat/tap-01-chai-nuoc-ngot-xi-bot/`
  — ba thư mục đã bị xoá ở commit `499cdf42`. Sửa: `python3 tools/gen_films_index.py` (index sinh ra, không viết tay).
- `film.json` của tập đang có `"runtime": ""`, và `core/render/filmcheck.mjs:190` chỉ kiểm tra định dạng
  `M:SS` **khi trường không rỗng** → chỗ trống lọt, index sẽ in `UNKNOWN`.

**Guard đề xuất.** `filmcheck.mjs` phải fail khi manifest có `movie` mà `runtime` rỗng.

---

## Đề xuất thứ tự xử lý

| # | Việc | File cần sửa | Loại |
|---|---|---|---|
| 1 | Chấm props theo nhóm + trần vòng (P1, P4) | `tools/review.sh`, `.agents/skills/tram-nghi-nhieu/step5-props-code/PROMPT_CRITIC.md` | judgement → sửa rubric |
| 2 | Tem storyboard + chế độ `--storyboard` (P3) | `tools/gate.py`, `tools/review.sh` | mechanical → viết check |
| 3 | Đối chiếu digest của outline (P2) | `tools/gate.py:153` | mechanical → 1 dòng |
| 4 | Giám sát đọc transcript Claude Code + chạy `check_tracked` (P5, P6) | `tools/supervise.sh` | mechanical → nối có sẵn |
| 5 | Nới `.gitignore:146` để cây tập được theo dõi (P6) | `.gitignore` | mechanical → 1 dòng |
| 6 | `filmcheck.mjs`: file review trùng hash, file không hậu tố phải là bản mới nhất, `runtime` rỗng (P7, P11) | `core/render/filmcheck.mjs` | mechanical → viết check |
| 7 | `review.sh --contact-sheet` + trỏ skill tới `lessons.md` + gộp hai cây skill (P8, P10) | `tools/review.sh`, `SKILL.md` | đường dẫn |
| 8 | So trạng thái vật giữa hai lượt chấm props (P9) | `tools/review.sh` | judgement → hỗ trợ quyết định |

---

## Mục chưa xử lý

- **[ ]** Phiên vẫn đang chạy (23:29) với hai luồng review mở. Cần **dừng** trước khi vá, nếu không
  hai bên cùng sửa `src/`.
- **[ ]** Chưa có phim: `out/` rỗng, không `.mp4`.
- **[ ]** P1 (nhóm đời thường / nhóm vi mô) là **quyết định của người dùng**: hạ tiêu chuẩn props
  để mở cổng nhanh, hay giữ tiêu chuẩn và sửa hình cho tới khi vật vi mô đọc được.
- **[ ]** P9: cần một phiên chấm mù chạy lại trên **cùng tập ảnh** để biết vòng 2 là dao động
  của người chấm hay lỗi thật. Chưa làm.
- **[ ]** `improvements/lessons.md` và `CODING_STANDARDS.md`: chưa thêm dòng nào cho các phát hiện trên —
  phải đợi guard tồn tại, vì `improvements/README.md` quy định một phát hiện kết thúc ở **một guard**
  hoặc ở câu *"no guard possible — recorded only"*. Ở đây chúng là **guard đề xuất**, chưa là guard.
