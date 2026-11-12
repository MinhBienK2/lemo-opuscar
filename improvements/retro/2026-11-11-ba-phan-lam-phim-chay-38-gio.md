# Retro — ba phiên làm phim chạy song song 38 giờ, không tập nào đóng được (2026-11-11)

Bản ghi này đọc lại ba phiên Claude Code đang chạy suốt 38 giờ trên ba tập của kênh Trạm Nghĩ Nhiều,
đối chiếu từng khẳng định với mã nguồn công cụ. Nó **không sửa gì** trong ba tập: mọi việc dựng hình và
chấm đang chạy, nên bản ghi chỉ là tài liệu, để cải thiện sau khi ba tập này xong.

Mã phát hiện của bản ghi này là **M1…M27** (M = "mười", bản ghi thứ mười). Mỗi phát hiện đã có trong một bản
ghi cũ thì đây là **cập nhật** của phát hiện đó, không phải số mới — bản ghi cũ đã được ghi thêm.

**Năm phát hiện đã được dựng thành guard trong khi bản ghi này còn nằm trên bàn** (12-11 02:21, do một phiên
đọc bản ghi này rồi viết vào `channels/tram-nghi-nhieu/tools/`): **M1** (trần số vòng cho mỗi bước),
**M13** (`scope()` hỏi digest của mã nguồn trước dấu vân tay 48×27), **M14** (`episode.py` đếm phiên của
chặng từ `out/sessions.jsonl` nên ngân sách sống qua việc runner khởi chạy lại), **M15** (một mục đã MỞ thì
giữ nguyên MỞ), **M17** (chặng bàn giao hỏi cả ba câu: có phim, cổng đóng, phim khớp mã nguồn). Các dòng
"Guard" tương ứng trong bản ghi này và trong `improvements/README.md` ghi rõ chỗ dựng và phần còn thiếu.

**Bản ghi này trùng chủ đề với [`2026-11-12-ba-phien-lam-phim-45-gio.md`](2026-11-12-ba-phien-lam-phim-45-gio.md),
viết bởi một phiên khác trong cùng đêm, và đó là điểm hay: hai người đo độc lập, ra cùng kết luận.** Bảng
đối chiếu:

| Bản ghi này | Bản ghi kia | Nội dung |
|---|---|---|
| M1 | P6 | không có trần số vòng cho một bước |
| M3 | P2, P2b | chấm lại mục đã chấm; một bước **đã đóng** vẫn bị mở lại |
| M5 | P1 | cái chặn dò trạng thái không bắt được kiểu chờ thật |
| M11 | P8 | cái chặn tải máy bị gỡ, và nó đã giết một vòng 42′ |
| M13 | P3 | giữ phán quyết của mã chưa ai nhìn |
| M14 | P5 | trần số phiên đặt lại mỗi lần khởi chạy lại runner |
| M15 | P7 | phán quyết "MỞ" bị xoá |
| M17 | P4 | `episode.py` tưởng chặng bàn giao xong chỉ vì có một tệp `.mp4` |
| — | **P9** | người chấm **đổi model giữa chừng một bước** |
| — | **P10–P13** | bốn phát hiện không có mã tương đương ở bản ghi này |

Chỉ có ở bản ghi này: **M2** (không phiên nào dùng `episode.py` làm người lái trọn tập), **M4** (mỗi vòng picture
trả tiền lại tờ nhịp), **M6** (luật có trong ngữ cảnh mà không ai dùng), **M7** (người đạo diễn tự mở ảnh), **M9**
(giá của việc chờ), **M10** (công cụ đổi giữa lúc tập đang bay), **M12** (rác trong thư mục tập), **M16**
(một subagent chết làm phiên mẹo ngồi yên 82′), **M18** (danh sách tha giọng đọc hết hiệu lực), **M19**
("COULD NOT RUN" vẫn tính FAIL), **M20** (nhãn ngắn hơn thời gian đọc), **M21** (ghép phim hỏng thì mất bản dựng),
**M22** (đĩa đầy và `/tmp` ăn 18 GB), **M23** (bài đo chuyển động đếm tọa pha, không đếm hành trình của máy),
**M24** (ba lỗ hổng trong guard vừa dựng), **M25** (phim đã bàn giao biến mất khỏi thư mục tập), **M26**
(một mô hình *hỏi* nhiều hơn là *chờ*).

**Mốc thời gian trong bản ghi này là giờ máy (+07).** Transcript ghi UTC; `git log` ghi giờ địa phương.
Ba phiên mở lúc **10/11 02:01–02:21** giờ máy = 09/11 19:01–19:21 UTC. **Cả ba vẫn còn chạy** khi bản ghi này
được viết (17:46, `etime` 1-15:45 / 1-15:26 / 1-15:25), và transcript của chúng vẫn lớn lên.

---

## Số tổng

| | co-the/tap-01 | do-vat/tap-02 | the-gioi/tap-01 |
|---|---|---|---|
| Phiên | `da4612a6` | `cd168267` | `f50b467e` |
| Mở lúc (giờ máy) | 10/11 02:20 | 10/11 02:01 | 10/11 02:21 |
| Còn chạy lúc ghi (17:46) | 39 h 26′ | 39 h 45′ | 39 h 25′ |
| Transcript (17:46) | 751 MB | 117 MB | 340 MB |
| Bash / Read / Edit / Write | 3 863 / 1 085 / 1 019 / 117 | 894 / 234 / 241 / 9 | 2 511 / 626 / 457 / 45 |
| **Subagent "người SỬA" (luật v17)** | **0** | **0** | 19 |
| `episode.py` chạy thật | **0** | 2 (1 bị hệ điều hành giết) | 0 (chỉ `--dry-run`) |
| **Cách chờ thật**: `Monitor` / lệnh có `sleep` / `TaskStop` | 5 / 78 / 15 | 12 / 36 / 7 | 9 / 77 / 28 |
| Lần đọc ảnh (đếm theo `Read` có đường dẫn ảnh) | ~700 | ~100 | ~390 |
| Kết quả tool > 200 KB | 656 | 93 | 257 |
| Vòng chấm props / picture | 8 / 5 | **12** / 2 | 5 / 3 |
| Sửa mã `.js` trong 2 ngày | props 26 lần (+1 807/−84) | props 23 lần (+3 486/−578) | props 0 |
| Phim | có mp4 (10/11 08:49) | có mp4 (10/11 13:13) | **chưa có** |

Cổng lúc **17:31** (số liệu dưới đây là của lúc đó, và nó đã đổi trong lúc bản ghi này được viết):

| Bước | co-the/tap-01 | do-vat/tap-02 | the-gioi/tap-01 |
|---|---|---|---|
| `props` | XONG — 14 ĐẠT, 1 MỞ (`may-ghi-giac-ngu`) | **CHƯA XONG** — 4 ĐẠT, 2 MỞ (`nhiet-ke`, `noi-cat-ngang`), **6 chưa chấm hay đã đổi** | XONG — 8 ĐẠT, 1 MỞ (`nhom-tia`) |
| `picture` | CHƯA XONG — 48 ĐẠT, 4 phải sửa (c17, c19, c37, c39) | CHƯA XONG — 48 ĐẠT, 0 phải sửa, nhưng **mã phim đã đổi** sau vòng chấm cuối | CHƯA XONG — 45 ĐẠT, 6 phải sửa (c14, c16, c17, c24, c25, c28) + 1 chưa chấm |
| `final` | chưa có báo cáo | chưa có báo cáo | chưa có báo cáo |
| Bố cục | đúng | **có thứ nằm sai chỗ** (`channels/` lồng) | đúng |

Ba tập đều đi qua `outline`, `script`, `look` và đều **XONG**. Tức là ba tập đã ở đúng chỗ phải ở — và chỗ
đó không có đường ra.

Cả ba cộng: **763 lần sửa mã**, +82 295 / −62 632 dòng, trong 38 giờ.

Chi phí đã ghi trong sổ (`do-vat/out/sessions.jsonl`): **1 459 USD**, 47,2 triệu token ngữ cảnh vào (tổng
input + cache đọc + cache tạo — `episode.py:100` ghi cả ba), 322 lượt → **146 631 token ngữ cảnh mỗi lượt**.
Ba phiên đang chạy không nằm trong sổ đó (xem M2).

Máy lúc ghi: **swap gần hết** (7 691/7 813 MB đã dùng), RAM trống dao động mạnh giữa 1,9 và 4,7 GB (nên
con số "662 MB trống" chỉ đúng ở một thời điểm), tải 5,07 trên 12 lõi, **bốn** phiên người chấm `claude -p`
đang chạy cùng lúc. Trong chính transcript `cd168267` (09/11 21:17 UTC) có một job bị hệ điều hành dừng:
*"stopped because the system is running low on memory"*.

**Cái kiểm chứng độc lập bắt được một thứ không phải phát hiện.** Nó báo "phim của tập không được commit" —
đúng là `.gitignore` chặn `**/*.mp4`. Nhưng `docs/layout.md:130` nói rõ: *"the episodes keep their finished
movie out of the repository (the mp4 is too big for GitHub) and their source in it"*. Đó là **hợp đồng**, không
phải lỗi. Ghi ra ở đây để người sau không sửa nhầm.

---

## Ba phiên: nó làm gì và nó kẹt ở đâu

### `da4612a6` — co-the/tap-01-ngu-trua-day-me: viết lại một vật vô tận

Vật `may-ghi-giac-ngu` (máy ghi giấc ngủ) sai 2/3 lần ở tiêu chí `dung-vat`: người chấm nói ảnh ra một **bộ đồ
học** chứ không phải máy ghi giấc ngủ (tờ giấy đọc thành thước tam giác, cây bút là bút chì kỹ thuật, khối
kem không có màn hình). Phiên đã `Write` lại cả tệp rồi sáu lần `Edit`, rồi ở vòng **dựng `propcheck` →
cắt ảnh bằng ffmpeg → nhìn → sửa**. Trong ba giờ cuối nó đọc **761 ảnh**; 328,8 MB trong 680,8 MB transcript
là ảnh base64. Mỗi lần sửa vật này làm đổi khung của mọi câu có nó → mở lại bước `picture`.

Cổng lúc ghi: `props` còn 1 mục phải sửa, `picture` còn 4 câu (c17 1/3, c19 2/3, c37 1/3, c39 2/3).

### `cd168267` — do-vat/tap-02-noi-com-dien: một vòng chấm đóng bị đi làng mất trắng

Đây là phiên duy nhất **có** chạy `episode.py` thật: 09/11 19:06 UTC nó khởi chạy runner làm nền cho tập này.
Nhưng nó **dò tệp log của runner** (`until grep -q "chặng 2 " "$OUT"`) thay vì đợi harness báo, và **10/11
04:17 giờ máy runner bị hệ điều hành dừng** vì máy hết bộ nhớ. Từ đó phiên tự làm lấy phần việc còn lại,
và chạy lại `episode.py --from 3` một lần (10/11 07:59 giờ máy).

Vòng chấm props vòng 11 **đóng lúc 11/11 11:38** — lúc đó cả 10 vật trong state đều `PASS` (nhưng vòng đó
chỉ chấm lại **một** vật, `gao`; chín vật kia mang phán quyết từ vòng 1–10, và năm vật đã từng FAIL). Rồi:

- **14:11–15:07**: bốn tệp vật bị sửa (`tui-gao`, `bat-dong-nuoc`, `cau-do-dien-tro`, `nuoc`). Vì
  `gate.py:70-73` lấy digest mã nguồn của từng vật, một tệp bị sửa là vòng chấm của vật đó mất hiệu lực.
- **16:54**: vòng 12 chấm lại **6 mục** (vì cả 10 digest đã khác state vòng 11).
- **17:06–17:18**: sáu tệp vật bị sửa lần nữa (`nhiet-ke`, `noi-cat-ngang`, `noi-cu-cat-ngang`,
  `noi-com-doi-dau`, `noi-com-dien`, `gao`) cộng một tệp helper mới `_flowbox.js` lúc 17:12 — mà **5 vật
  import tệp helper đó**, nên digest của 5 vật đổi theo.

Lúc 17:31 cổng báo đúng **sáu** mục đó là "chưa chấm hay đã đổi" — vòng 13 đang chờ. **Vòng lặp tự nuôi:
mỗi vòng chấm đóng lại là một lúc đánh bóng mới, và mỗi lượt đánh bóng xóa đúng vòng chấm vừa đóng.**

Từ 15:07 đến 16:54 phiên **không sửa gì**. Giờ đó là vòng lặp: tạo job nền `sleep 280` → `TaskStop` ngay
→ `sleep 290` → `TaskStop`. 32 lệnh chờ, 0 sửa. Tập này **đã có phim** (10/11 13:13).

### `f50b467e` — the-gioi/tap-01-cau-vong: chờ tờ nhịp, chưa có phim

Chưa có `.mp4`. Đường đi của nó là: dựng tờ nhịp (52 câu) → chấm picture. Tờ nhịp đang được dựng lại lúc
17:13 hôm nay vì mã đã đổi. Đo từ mtime các `b_*.jpg`: **~69 giây một câu** ⇒ một lượt tờ nhịp ~1 giờ.
Ba giờ cuối gần như chỉ có polling (`until grep -qE …`, `ps -o etime=`, `nvidia-smi`) và đọc lại `review.py`.

Phiên này là phiên **duy nhất làm theo v17**: 19 subagent "người SỬA" sinh ra từ `fixbrief.py`, 39 lần gọi
`fixbrief.py`. Nó cũng là phiên duy nhất **không chạy** `episode.py` thật — bốn lần gọi đều là `--dry-run`,
tức là nó đọc runner rồi tự làm các chặng.

---

## Vì sao nó lặp

1. **Trần vòng chấm bị gỡ** — commit `897e909` (09/11 22:25) xóa hẳn "ngân sách vòng" và `tools/hook_load.py`;
   `review.py` hôm nay chỉ còn `TRIES = 3` ở tầng từng mục (dòng 40), không có trần cho cả bước. do-vat đã ở
   vòng props 12.
2. **Không ai chặn việc đánh bóng sau khi vòng chấm đã đóng** — đây là M3.
3. **Mỗi vòng `picture` trả tiền lại cả tờ nhịp** — `review.py:409-423` chỉ dùng lại tờ nhịp khi `beats.json`
   mới hơn **mọi** tệp trong `gate.picture_files(ep)`; sửa một vật là mất toàn bộ tờ nhịp.
4. **Phiên tương tác không có trần** — không phiên nào nào chạy `episode.py` làm người lái tập; `TRIES = 2` của
   `episode.py` không bao giờ có tác dụng, và kể cả khi có thì nó **đặt lại mỗi lần khởi chạy lại** (M14).
5. **Tiêu chí CHẶN của bước 6 không có thước** — `nhan` đòi mọi nhãn nằm trọn, chỉ đúng tâm vật, không đè
   nhau, chỉ một cách đọc; cách sửa mà chính người chấm đưa ra cho c19 là đẩy nhãn về phía mép khung.
6. **Chờ bằng cách dò, và cái dò ấy không bị chặn** — `tools/hook_poll.py` chỉ bắt lệnh vừa hỏi giờ vừa
   kiểm tra tệp, lần thứ ba trở đi; các phiên dò bằng hình dạng khác nên không lần nào chạm ngưỡng.
7. **Công cụ dùng chung đổi giữa lúc ba tập đang bay** — `SKILL.md:82` nói "Công cụ đứng yên suốt một tập".

---

## Phát hiện

### M1 — critical — Bản làm lại v17 đã gỡ chính trần chặn của vòng lặp

**Bằng chứng.** Commit `897e909` (09/11 22:25, *"refactor(kênh): chấm theo từng mục với RUBRIC thay cho điểm số
và vòng 5 hiệp"*) xóa: `tools/hook_load.py`, `channels/tram-nghi-nhieu/tools/test_review_attempts.py`,
`set_round.py`, `props_report_check.py`, `check_label_section.py`, `check_film_claims.py`,
`check_progress.py`, `check_reports.py`, `check_prompts.py`, `recover_review.py`, và 46 bài học viết cho cơ
chế cũ. Chính thông điệp commit ghi: *"Bỏ tem .pass, bản cắt của đạo diễn, chia chương, **ngân sách vòng**"*
và *"**gỡ hook_load**"*. Hôm nay `review.py` còn đúng một trần: `TRIES = 3` ở tầng từng mục (`review.py:40`),
`verdict = 'OPEN' if tries >= TRIES` (`review.py:199`); không có trần số vòng cho bước, không có bộ đếm số
lần mở vòng. Kết quả: `do-vat` đã ở **vòng props 12** (mở lúc 16:54), `co-the` vòng props 8, `the-gioi`
vòng picture 3.

**Ảnh hưởng.** Vòng chấm mất đường thoát ở tầng bước. Van thoát còn lại (3 lần sai → MỞ) tính **cho từng
mục**, nên mỗi vòng người chấm tìm được một mục mới thì bước lại mở; và bất kỳ sửa đổi mã nào cũng làm mục
cũ quay lại vòng chấm. Đây là N144 đã từng có guard ("đếm mọi lần mở, từ chối lần thứ chín") — guard đó bị
gỡ cùng với cơ chế cũ, và không có gì thay thế.

**Guard (đã dựng 12-11 02:41, nhưng có một lỗ hổng — xem M24).**
`channels/tram-nghi-nhieu/tools/review.py:45` có
`MAX_ROUNDS = {'outline': 4, 'script': 6, 'look': 8, 'props': 8, 'picture': 8, 'final': 1}` (ghi đè được bằng
`LEMO_MAX_ROUNDS`); khối chạm trần ở `review.py:264-281`: dòng 266 tăng `st['round']`, 268 so vượt trần,
272 ghim `st['round'] = cap`, 273–277 ép mục còn lại thành `verdict='OPEN', fails=max(fails, TRIES)`, 280 đặt
`todo = []` — và `review.py` **tự thoát với mã 0**, in *"XONG (đã chạm trần N vòng)"*. Số vòng nằm trong
state nên trần sống qua cả những lần khởi chạy lại.

Nhưng ở nhánh chạm trần, `rec` của mục bị ép MỞ **không** được cập nhật `src`/`key` (dòng 272–277 chỉ set
`verdict/fails/round`) — mà `gate.tally()` (`gate.py:122-133`) so `rec.get('src')` với digest **hiện tại** ở
bước `props`/`picture`. Nên mục bị ép MỞ có `src` cũ ≠ digest hiện tại → bị đếm là *"chưa chấm hay đã đổi"* →
**bước `props` không đóng được** (đo thật trên một tập tạm: `gate.why_open(props)` trả về *"0 mục phải sửa, 1
mục chưa chấm hay đã đổi"*). Bước `picture` đóng được vì cổng so `src` của nó là hash lời kể.

Còn thiếu: bộ đếm **lần mở vòng** (`review/.attempts-<bước>`) để một vòng chết không bị tính là một vòng, và
việc dựng lại `tools/test_review_attempts.py`. Và một chi tiết: `MAX_ROUNDS['final'] = 1` là **vô hiệu** —
bước `final` đi đường riêng (`review.py:595`, hàm `final()`), không đi qua `run()`, nên nó chỉ có một vòng theo
đúng nghĩa của nó.

*Đã kiểm chứng lúc dùng:* vòng `picture` của `co-the` chạm trần 8 vòng lúc 12-11 02:20 — in ra
*"review picture: XONG (đã chạm trần 8 vòng — mục chưa ĐẠT nằm ở MỞ)"*, và `c19` chuyển sang MỞ. Bước hình
đóng được sau 9 vòng chấm thay vì mãi.

### M2 — critical — Không phiên nào dùng `episode.py` làm người lái **trọn tập**, nên trần của nó không bao giờ có tác dụng

**Bằng chứng.** `ps` cho ba tiến trình `claude --dangerously-skip-permissions` **không có cờ `-p`** (tức là
phiên tương tác), `etime` lần lượt `1-14:47:04`, `1-14:27:54`, `1-14:26:40`. `episode.py:18-21` ghi lý do:
*"one long session re-reads its whole context on every turn, and its context only grows"*; `episode.py:32`
đặt `TRIES = 2` mỗi chặng và dừng nếu chặng kẹt.

**Cần nói chính xác:** `cd168267` **có** chạy `episode.py` — một lần nền lúc 19:06 UTC ngày 09/11 và một lần
`--from 3` lúc 07:59 UTC ngày 10/11. Điều không có là **`episode.py` làm người lái trọn tập**: runner bị hệ
điều hành giết lúc 04:17 ngày 10/11, và từ đó phiên tự làm phần việc còn lại trong chính nó. Không id phiên
nào trong ba phiên nằm trong `do-vat/out/sessions.jsonl` — sổ chỉ ghi các chặng headless.

Đếm lệnh thật trong từng transcript:

| | `da4612a6` | `cd168267` | `f50b467e` |
|---|---|---|---|
| `episode.py` chạy thật | **0** | 2 (lần đầu nền, lần sau `--from 3`) | **0** (4 lần gọi đều `--dry-run`) |
| Subagent "người SỬA" | 0 | 0 | 19 |
| Sửa trực tiếp bằng `Edit` | 1 025 | 241 | 457 |

`da4612a6` không gọi `episode.py` lần nào: nó tự chạy `review.sh` khoảng 98 lần và tự sửa 1 025 lần.
`cd168267` khởi chạy runner nền lúc 02:06 giờ máy, nhưng **runner đó bị hệ điều hành giết lúc 04:17** vì
máy hết bộ nhớ, và từ đó phiên tự làm phần việc còn lại. `f50b467e` chạy `--dry-run` bốn lần để xem
runner làm gì — rồi tự làm các chặng.

**Ảnh hưởng.** 146 631 token ngữ cảnh mỗi lượt (47,2 M / 322 lượt) và 1 459 USD cho một tập. Ba phiên
này không được ghi vào sổ chi phí, nên giám sát cũng không thấy chúng đang tốn.

**Guard.** `tools/supervise.sh` có một quy tắc mới: một phiên đã mở quá N giờ trên một tập mà
`out/sessions.jsonl` của tập đó không có chặng nào tương ứng → báo và nêu đúng lệnh
`python3 channels/tram-nghi-nhieu/tools/episode.py <tập> --from <chặng>`. Đây là **người canh**, không phải
chặn; phần "bàn giao" là việc người quyết định → *no guard possible — recorded only* (xem "Không thể có
guard" bên dưới).

### M3 — critical — Đánh bóng vật **sau** khi vòng chấm đã đóng xóa vòng chấm đó

**Bằng chứng.** `gate.py:70-73` (`props_keys`) lấy `props_catalog.digest` của tệp vật; `gate.py:126-129` so
`rec.get('src')` (digest lúc vòng chấm chạy) với digest hiện tại, và bất khớp ⇒ mục "chưa chấm hay đã đổi".
Digest của một vật là sha256 của **tệp vật cộng các tệp helper `_` mà nó import** (`props_catalog.py:186-208`)
— nên tạo một helper dùng chung (`_flowbox.js`, 17:12) làm đổi digest của cả năm vật import nó.

Số liệu ở `do-vat`, hai lần liên tiếp:

- Vòng 11 đóng lúc **11:38** (state: cả 10 vật `PASS`; vòng đó chỉ chấm lại 1 mục, `gao`; 5 vật đã từng
  FAIL trước đó). **14:11–15:07**: bốn tệp vật bị sửa → digest của chúng khác state → vòng 12 (16:54) phải
  chấm lại 6 mục.
- Vòng 12 đóng lúc **16:54**; **24 phút sau** (17:06–17:18) sáu tệp vật bị sửa lần nữa cộng helper mới
  `_flowbox.js`; lúc 17:31 cổng báo đúng **sáu** mục đó là "chưa chấm hay đã đổi" — vòng 13 đang chờ.

Đây là vòng lặp tự nuôi: mỗi vòng chấm đóng lại là một lúc đánh bóng mới, và mỗi lượt đánh bóng xóa đúng
vòng chấm vừa đóng. `co-the` cũng vậy: `may-ghi-giac-ngu` sai 2/3, phiên `Write` lại cả tệp lúc 16:48 — và
giờ nó đã MỞ (sai 3 lần), tức là bước `props` của tập đó đóng được chỉ vì mục đó **hết lượt**, không phải vì
nó đúng.

**Ảnh hưởng.** Một lượt đánh bóng kéo theo một vòng chấm khoảng một giờ bị bỏ; và vì mọi vật xuất hiện trong
khung, nó còn làm mất hiệu lực cả tờ nhịp (M4) và mở lại các câu `picture` có vật đó.

**Hậu quả nặng nhất: nó chặn cả việc dựng phim.** Cổng render (`core/render/video.mjs:17-20`) hỏi
`gate.py check <tập> --for render` **trước** khi dựng, và `gate.py:126-129` thấy vật đã đổi là `props`
mở lại → **từ chối dựng**. Tức là một tập có phim đẹp trên đĩa vẫn không dựng lại được, vì một vật được
sửa sau vòng chấm cuối. Đã xảy ra ít nhất ba lần trong ngày 11-11: `the-gioi/tap-01` sửa `non-tia.js` lúc
20:38, một phút sau khi báo cáo vòng hình 5 viết ra (20:37) → `props` mở lại, và `review.py:502-506` **từ
chối** mở vòng `picture` kế tiếp; `do-vat/tap-02` sửa `noi-cat-ngang.js` lúc 20:14 và phải chạy thêm một
vòng props vòng 14. May mắn cổng hỏi trước khi dựng nên tổn thất chỉ là vài giây, không phải 11 phút
dựng hình.

**Guard.** (1) `channels/tram-nghi-nhieu/tools/gate.py status` in, cho mỗi bước đang mở, **tệp nào đổi sau
vòng chấm gần nhất, đổi lúc mấy giờ, và hậu quả**: "mở lại cả bước; tờ nhịp phải dựng lại (~1 giờ); cổng
render sẽ từ chối dựng phim". (2) `review.py` từ chối mở vòng (mã 2, không phải phán quyết về phim) khi
vòng trước **đã đóng** mà mã nguồn đã đổi kể từ đó, trừ khi có `--force` — lúc đó mở vòng là một quyết
định có chủ ý, không phải một tai nạn. (3) Vì một helper dùng chung đổi digest của mọi vật import nó,
`gate.py status` nói rõ **vì sao** mục đó mất hiệu lực: "helper `_flowbox.js` đổi" chứ không chỉ "đã đổi".

### M4 — high — Mỗi vòng `picture` trả tiền lại toàn bộ tờ nhịp

**Bằng chứng.** `review.py:409-423` (`beats`): tờ nhịp chỉ dùng lại khi `beats.json` mới hơn **mọi** tệp
trong `gate.picture_files(ep)` (`gate.py:76` — toàn bộ `src/` + `index.html`) và `voice/lines.json` +
`voice/proc/dur.json`; nếu không thì dựng lại từ đầu (`review.py:422`). Còn `if not any(b.get('skipped'))`
(`review.py:418`) — một câu bị bỏ sót thì không bao giờ dùng lại được. Đo tốc độ từ mtime các `b_*.jpg`:
**~69 giây một câu** (the-gioi: b_015 16:45:45 → b_018 16:49:12), 52 câu ⇒ **~1 giờ một lượt**. Tờ nhịp của
`the-gioi` vừa được dựng lại lúc **17:13** hôm nay.

**Ảnh hưởng.** Sửa một vật ⇒ vòng `picture` kế tiếp phải dựng lại 52 khung trước khi người chấm nhìn
được một khung. Với `co-the` (5 vòng picture) và `the-gioi` (3 vòng), đó là vài giờ dựng hình thuần.

**Guard.** `review.py` dựng tờ nhịp **theo câu**: `beatsheet.mjs` đã có `--lines a-b` (`beatsheet.mjs:33,40`),
nên một câu đổi thì chỉ dựng lại câu đó và giữ các ảnh còn lại; `beats()` chỉ dựng lại tập câu mà mã đã đổi.
Kèm: `beats.json` ghi digest mã của từng câu, để biết câu nào cũ.

### M5 — high — Cái chặn "dò trạng thái" không bắt được các phiên này, và bản ghi của nó nói khác với nó

**Bằng chứng.** `tools/hook_poll.py:71` chỉ xét lệnh **vừa hỏi giờ (`date`) vừa kiểm tra tệp
(`ls|stat|wc|du`)**, và chặn từ lần thứ ba **cùng một hình dạng** trong 2 giờ (`LIMIT = 3`, `WINDOW = 7200`,
dòng 32-33). Nhưng selftest của chính nó (dòng 146) khẳng định vòng lặp chờ **được đi qua**:
`('until [ -f /tmp/x ]; do sleep 15; done', 0, 0)`. Thử lại bằng `decide()` với đúng những lệnh ba phiên
đang dùng: `until [ -f … ]; do sleep 20; done` → 0; `until grep -qE …; do sleep 20; done` → 0;
`for i in $(seq 1 60); do … sleep 30; done` → 0; `sleep 280; echo waited` → 0; chỉ `date +%H:%M:%S; ls -la …`
mới ra 2. Sổ `/tmp/lemo-polls.json` xác nhận: **mọi** hình dạng lệnh dò của ba phiên đều đếm **1** — không
lần nào chạm ngưỡng, vì phiên dưới áp lực **đổi câu lệnh mỗi lần** và khoá của bộ đếm là *toàn bộ câu lệnh*
(`shape_of`, dòng 60-62).

Lưu ý mâu thuẫn với bản ghi cũ: dòng **N137** trong `improvements/README.md` viết *"Guard:
`tools/hook_poll.py` blocks a shell loop that waits (`while`/`until`/`for` plus a shell `sleep`)"* — công cụ
**không** chặn điều đó, và selftest của nó nói rõ là cho qua. (Sau đó dòng này đã được sửa; xem phần Guard.)

**Ảnh hưởng.** Cách chờ thật của ba phiên là **ba công cụ khác nhau cùng lúc**: công cụ `Monitor` (5 / 12 / 9
lần), lệnh Bash có `sleep` (78 / 36 / 77 lần) và `TaskStop` (15 / 7 / 28 lần). Trong `cd168267` có **sáu** job
nền `sleep` (240, 200, 280, 290, 270, 285 giây), mỗi cái bị `TaskStop` sau 4–8 giây — chỉ đổi số giây, không
sửa gì. Mỗi lượt chờ lại đọc trọn một ngữ cảnh 117–751 MB. Đây là bệnh đã ghi ở N127 (câu lệnh đổi mỗi lần nên
bộ đếm không thấy) và ở N117 (đọc lại tệp log của job nền) — nay nó tái diễn ở hình dạng thứ ba, và ở cả ba
cơ chế.

**Guard (đã dựng 12-11 02:41, commit `9963342`).** `tools/hook_poll.py` nay có `poll_kind()` phân loại theo
**kiểu chờ** — `wait:loop`, `wait:sleep`, `wait:proc`, `wait:date+check` — thay vì so cả câu lệnh; selftest của
nó dùng **đúng những lệnh thật** của ba phiên này (22/22 xanh). Và một hook thứ hai cho công cụ `Monitor`
(vòng `Monitor` có lệnh `while true` là **vòng dò đứng trong phiên**) thì **chưa có** — `.claude/settings.json`
chưa có matcher `Monitor`.

### M6 — critical — Ba phiên **đã có** v17 trong ngữ cảnh từ giây đầu tiên — và không phiên nào làm theo

**Bằng chứng.** Skill v17 được commit lúc **10/11 01:40:06 giờ máy** = **09/11 18:40 UTC** (`c213a37`,
*"người sửa tách khỏi người chấm, mỗi chặng một phiên, chuẩn chấm theo người xem"*). Ba phiên mở lúc
**19:01:08 / 19:20:19 / 19:21:32 UTC** — tức **21 / 40 / 41 phút sau** khi v17 đã có. Transcript ghi UTC còn
`git log` ghi giờ địa phương: đó là chỗ dễ đọc sai.

Cả ba phiên đều **nạp** v17 ngay lúc mở, đọc được trong chính transcript:

| | `cd168267` | `da4612a6` | `f50b467e` |
|---|---|---|---|
| Cách nạp | `Read SKILL.md` lúc 19:02:15 | `Read SKILL.md` lúc 19:21:42 | tool `Skill` lúc 19:21:53 (6 102 ký tự) |
| `version:` trong nội dung nạp | **17.0.0** | **17.0.0** | (nội dung skill, không có frontmatter) |
| "Một chặng một phiên" (`SKILL.md:88`) | 4 | 28 | 91 |
| "Công cụ đứng yên suốt một tập" (`:82`) | 2 | 16 | 75 |
| "Ngữ cảnh của bạn nhỏ thì phim rẻ" (`:77`) | 2 | 13 | 80 |
| "Sửa sau vòng chấm" (`:46`) | 10 | 28 | 112 |

Vậy mà: **hai phiên không sinh một subagent "người SỬA" nào**; **hai phiên không chạy `episode.py` thật lần
nào**; `da4612a6` tự sửa 1 025 lần bằng `Edit` và tự gọi `review.sh` khoảng 98 lần. Luật "một chặng một
phiên" và luật "người sửa là subagent" **có trong ngữ cảnh của cả ba phiên suốt 38 giờ**, và không được
dùng đến một lần nào ở hai phiên.

**Ảnh hưởng.** Đây không phải "phiên chạy theo quy tắc cũ" — đây là **luật có trong tay mà không ai nhìn thấy
nó bị bỏ**. Cơ chế đúng cho việc đó đã có sẵn trong thư viện: `tools/supervise.sh` đọc log công cụ của
chính phiên đang chạy (N1, N108), nhưng nó **đếm luật bị phá**, không đếm **luật đã có mà không dùng**.

**Guard.** `tools/rules.py` (đã có) thêm hai quy tắc đo được, và giám sát báo chúng mỗi 15 phút:
- *"phiên có đọc skill của kênh trong ngữ cảnh, đã chạy `fixbrief.py` N lần, và đã tự sửa M lần bằng
  `Edit` — luật 'người sửa là subagent' đang bị bỏ qua"*;
- *"phiên đang ở chặng `6` mà `episode.py` chưa chạy lần nào trong 6 giờ — luật 'một chặng một phiên' đang
  bị bỏ qua"*.

Cả hai đo được từ log công cụ, không cần ai đọc lại transcript.

### M7 — high — Hai phiên tự sửa vật, nên ảnh nằm trong ngữ cảnh của người đạo diễn

**Bằng chứng.** `SKILL.md:46` ("Sửa sau vòng chấm") quy định người chấm chỉ chấm, **người sửa là một subagent
khác**, người đạo diễn chỉ đọc một dòng chữ mỗi mục. `da4612a6` và `cd168267` dùng công cụ `Agent`
**0 lần**; `f50b467e` dùng **19 lần**. Hệ quả đo được: `da4612a6` đọc **761 ảnh**, 328,8 MB trong 680,8 MB
transcript là ảnh base64.

*Đính chính:* câu "`hook_stale_read.py` chỉ canh tệp **chữ** lớn, không canh ảnh" là **sai** — từ commit
`e4d6d60` (09/11) nó đã có nhánh `is_image` và chặn lần mở thứ ba của cùng một ảnh. Nên 761 lần đọc ảnh và
368 MB base64 là **đúng**, và cơ chế canh ảnh đã có sẵn; điều còn thiếu là một **hạn mức ngân sách ảnh** cho
một phiên, chứ không phải một cái chặn đọc lại.

**Ảnh hưởng.** Mỗi ảnh mở ra được trả tiền lại ở mọi lượt sau (146 k token/lượt). Đây là T3 của bản ghi
10/11, lần này không có cơ chế nào chặn.

**Guard.** `tools/hook_image_budget.py` (PreToolUse trên `Read`): đếm ảnh đã mở theo phiên; quá ngưỡng thì
chặn và nói cách đúng (`core/render/sheet.py` dán tờ, `tools/frames_at.py` cắt từ chính phim, và bản giao
việc của `fixbrief.py`). Người chấm headless chạy ở thư mục tạm **ngoài** kho, nên hook này chỉ trúng
đúng phiên đạo diễn — chỗ cần canh.

### M8 — high — Tiêu chí CHẶN của bước 6 không có thước đo, nên diorama 3D không bao giờ thoát

**Bằng chứng.** `.agents/skills/tram-nghi-nhieu/step6-assembly/RUBRIC.md`, dòng `nhan` (CHẶN): *"Mỗi nhãn có
nằm trọn trong khung, chỉ vào tâm đúng vật nó gọi tên, không đè lên nhãn khác, và chỉ có một cách đọc
không?"*; dòng `nguyen-ven` (CHẶN): hình nguyên vẹn. Bản ghi `co-the/review/PICTURE.md` cho thấy đúng cái
bẫy: c19 — nhãn "BA MƯƠI PHÚT" **cắt qua số "30"**, và lời sửa mà người chấm đưa ra là *"dời cả bong bóng
lên trên–phải"* — tức là đẩy về mép khung để né số "40"; c39 — mũi tên nhãn CAFFEINE dừng trúng nguyên tử
của phân tử **bên trái**, trong khi phân tử caffeine thật nằm bên phải và bị hộp nhãn che.

**Ảnh hưởng.** Đây là T1 của bản ghi 10/11 — "chuẩn của người chấm cao hơn chuẩn của người dùng". V17 đã
dựng `BAR` trong `review.py` ("CHẶN là LỖI khi bạn chỉ ra được một chỗ cụ thể làm người xem đó không thấy,
đọc sai, hay hiểu sai"; viết ở `review.py:129-131`) — nhưng **câu hỏi** trong rubric vẫn tuyệt đối, nên
người chấm vẫn có chỗ đứng khi nói "nhãn cắt qua một chữ số". Vòng chấm vì thế không hội tụ, và đội hình
được chấm bằng ba bộ luật khác nhau trong ba tập.

**Guard.** `.agents/skills/tram-nghi-nhieu/step6-assembly/RUBRIC.md`: câu `nhan` mang thước — *"rõ ở cỡ
điện thoại thì CHẶN; lệch milimét thì GÓP Ý"*; và `review.py` có **trần số vòng cho cả bước** (M1) làm
lưới an toàn cuối.

### M9 — medium — Cái giá của việc chờ là toàn bộ ngữ cảnh

**Bằng chứng.** `do-vat/out/sessions.jsonl`: 47,2 M token ngữ cảnh vào (tổng input + cache đọc + cache tạo —
`episode.py:100` ghi cả ba) / 322 lượt = **146 631 token mỗi lượt**; 1 459 USD; 34,0 giờ tổng thời gian phiên.
Riêng một chặng (`leg 3`) chạy **38 327 giây (10 giờ 38′)** với **1 lượt** và **574,65 USD**
(`"error": true`, `tokens_in: 0` — sổ không ghi được token của nó, chỉ ghi được tiền, tức **39 % tiền của cả
tập nằm trên một dòng sổ không đọc được**); transcript của chặng đó là **339 MB** (09/11 21:18 → 10/11
07:57 UTC). Chặng `leg 3` phải chạy lại lúc 20:47 (7 lượt, 69,52 USD) vì lần đầu không có phán quyết. Ba
transcript của các phiên đang chạy: 680,8 + 322,5 + 105,2 MB.

**Ảnh hưởng.** Số tiền và thời gian đều đi vào chỗ không sinh ra phim. Ba tập này còn lại: `co-the` đã có
phim, `do-vat` đã có phim, **`the-gioi` chưa có phim** sau 38 giờ.

**Guard.** M1 (trần vòng) + M2 (một chặng một phiên) + M5 (không dò bằng vòng lặp) cùng giữ giá này
dưới tầm kiểm soát; `episode.py` ghi từng chặng vào `out/sessions.jsonl` để nó nhìn thấy được — và phải ghi
**cả token** khi chặng chết, vì một chặng 10 giờ 38′ với `tokens_in: 0` là một dòng sổ mà không ai đọc được.

### M10 — medium — Công cụ dùng chung lại đổi giữa lúc ba tập đang bay

**Bằng chứng.** `SKILL.md:87`: *"**Công cụ đứng yên suốt một tập.** `core/`, `rig/` và
`channels/tram-nghi-nhieu/tools/` giữ nguyên khi đang làm tập"*.

*Đính chính mốc thời gian:* tôi đã ghi sai. Commit `897e909` có mốc **09/11 22:25 giờ máy = 15:25 UTC**, tức
**~3,6 giờ _trước_** khi ba phiên mở (19:01–19:21 UTC) — không phải "3 giờ sau" như tôi viết. Nghĩa là bản
làm lại v17 **có mặt trước** khi các phiên mở (đúng như M6 ghi: cả ba đều nạp v17 trong giây đầu tiên). Các
commit **thật sự** sửa công cụ khi ba tập đang bay là `6e6c7c9`, `c684380`, `7e6ebd3` (09/11 19:10–19:13 UTC)
và `b01ca31`. Ba tập vì thế bị chấm bằng nhiều bộ luật khác nhau trong lúc bay.

**Ảnh hưởng.** Mọi đo đạc trước đó trở nên cũ, và người đọc bản ghi không biết tập nào được chấm theo bộ
nào.

**Guard.** Bản ghi 10/11 (T4) ghi rõ "recorded only: no check" — nhưng việc này **có** thể kiểm được: một
check `tools/check_tools_frozen.py` hỏi "có tập nào đang mở không" (đọc `gate.py status` cho mọi tập của
kênh) và, nếu có, **fail** khi `channels/tram-nghi-nhieu/tools/`, `channels/tram-nghi-nhieu/rig/` hoặc
`.agents/skills/tram-nghi-nhieu/` đổi trong khoảng thời gian tập đó còn mở. Chạy trong CI và trước commit.

### M11 — medium — Cái chặn tải máy bị gỡ cùng lúc với trần vòng, và máy đang thiếu bộ nhớ

**Bằng chứng.** `tools/hook_load.py` **không còn tồn tại** — nó bị xóa trong `897e909` (xem M1), và
`.claude/settings.json` hôm nay chỉ cài bốn hook: `hook_bg_log.py`, `hook_shell_write.py`, `hook_poll.py`,
`hook_stale_read.py`. Máy lúc ghi: 662 MB RAM trống, swap 7 691/7 813 MB đã dùng, tải trung bình
5,07/4,59/3,55 trên 12 lõi, **bốn** phiên người chấm `claude -p` đang chạy cùng lúc. Trong chính transcript
`cd168267` (09/11 21:17) có một job bị hệ điều hành dừng: *"stopped because the system is running low on
memory"*.

**Ảnh hưởng.** Một phiên chấm bị giết giữa lúc để lại vòng không có báo cáo — người đọc tưởng là phim sai.
Đây là N122 đã có guard ("gỡ hook_load" là hành động có chủ ý, nhưng không kèm guard thay thế).

Cơ chế đó đã giết **hai** việc trong đúng một ngày: runner của `do-vat` lúc 21:17 ngày 09-11 (nó đã dừng
"vì hệ thống hết bộ nhớ"), và **runner `episode.py` của `co-the` lúc 00:2x ngày 12-11** — lần này nó giết
cả phiên `claude -p` con, nên tập mất trắng một vòng chấm hình đã chạy 42 phút và phải chạy lại từ đầu.
Đúng thứ tự ưu tiên khi máy thiếu bộ nhớ là ngược lại với điều người ta tưởng: **phải dừng việc nặng
trước, không phải việc nhẹ** — và máy không biết việc nào nặng, nên chỉ còn một cái chặn tải máy.

**Guard (đã dựng 12-11 02:41–02:43).** `tools/hook_load.py` được viết lại (209 dòng) và **đã wiring vào
`.claude/settings.json`** (dòng 21) — chặn việc mở việc nặng khi máy quá tải và **nêu đích danh job đang
chạy** để phiên biết phải xếp hàng thay vì đoán. Ngưỡng trong mã: `LOAD_MAX = CORES×1,5` (dòng 29–30),
`MEM_MIN_MB = 1200` (dòng 31 — **không phải 1 GiB**), `SWAP_MAX = 80` (dòng 32).

Hai điều cần nói rõ vì bản ghi này đã ghi sai:

- **Ngưỡng swap thực tế trên máy này là 96 %, không phải 80 %.** `.claude/settings.json:21` (thay đổi **chưa
  commit**) đặt `env LEMO_SWAP_MAX=96`. Đó là lý do lúc 02:44 nó vẫn cho tôi chạy khi swap 87 %.
- **Nó cố ý KHÔNG chặn `review.sh` và `episode.py`** — tức là người lái vẫn chạy được (chúng tự xếp hàng qua
  `core/render/slot.mjs`); chỉ việc dựng nặng và `claude -p` (người chấm) bị chặn.

*Đã kiểm chứng lúc dùng:* lúc 02:44 nó chặn lệnh dựng của tôi với thông điệp *"Máy đang quá tải: swap
đã dùng 87 %"* và nêu đúng `beatsheet.mjs` của `the-gioi` đang chạy. Còn thiếu: `review.py` hỏi cùng câu đó
ngay trước khi mở người chấm và trả mã 2 thay vì để nhân hạt giết nó (M19); và `episode.py` **tự khởi chạy
lại chặng** khi phiên của nó bị giết (nó đã có `TRIES = 2` cho chặng, nhưng chỉ trong một lần chạy của runner —
xem M14) và ghi lại việc bị giết vào `out/sessions.jsonl` để không mất dấu vết.

### M12 — low — Rác trong thư mục tập, và cổng bố cục báo nhưng không chặn

**Bằng chứng.** `do-vat/tap-02-noi-com-dien/channels/tram-nghi-nhieu/series/do-vat/` — một thư mục `channels/`
lồng sai chỗ trong thư mục tập (lệnh chạy bằng đường dẫn tương đối từ sai thư mục). Cổng bố cục **có** báo:
`gate.py status` in *"bố cục: có thứ nằm sai chỗ"* — nhưng `review.py:508` ghi rõ *"never blocks: the round
goes on"*, nên nó được báo rồi bị bỏ qua. `out/scratch` phình **347 MB** (do-vat) và **1,2 GB** (the-gioi).

**Ảnh hưởng.** Nhỏ, nhưng nó là dấu hiệu của việc lệch chỗ mà cổng đã biết và không chặn — và cái
"không chặn" ấy là **tính chất**, không phải sự lỡ: `review.py:579` ghi rõ *"never blocks: the round goes on"*,
và `gate.py status` chỉ in ra. Nghĩa là **một phim có thể được bàn giao mang theo vi phạm bố cục, và cổng vẫn
xanh** — không có gì nhắc. (Đã kiểm: tới 12-11 21:xx, cả tám tập của kênh chỉ đúng **một** tập có `src/sets/`
— một thư mục con nữa của `src/`, nơi hợp đồng bố cục (`layout.py:15-16`) không cho phép; nó là **sót**, và kịch
bản dồn phẳng đã có sẵn trong tập đó.)

**Guard (đã dựng 12-11, commit `d6eb4b6`).** `core/render/review.sh` — cổng bàn giao — có thêm một bước
`layout` chạy công cụ của **chính kênh** (`$BCH/tools/layout.py`): kênh viết hợp đồng bố cục xuống, thư viện
chỉ hỏi kênh; kênh nào không có `tools/layout.py` thì bước này không có. **Các vòng chấm giữa vẫn chỉ in ra**
(`review.py`: *"never blocks: the round goes on"*) — một tệp lạ giữa chừng không được đóng băng cả tập; chặn là ở
**cổng bàn giao**, nơi nó quyết định phim có đi hay không. Kiểm chứng trên cả tám tập của kênh: bảy tập sạch,
một tập đỏ vì `src/sets/` — tức là nay **có gì nhắc**.

Kèm theo đó: mọi thư mục tạm trong thư mục tập dẫn về `out/scratch/` (nơi `tools/frames_at.py` và
`core/render/sheet.py` đã ghi tệp thử sẵn).

### M13 — critical — Cổng báo ĐẠT cho ba vật mà **chưa ai chấm** — một ĐẠT im lặng

**Bằng chứng.** `review.py:209-212` (`run`): sau khi tách mục, với mỗi mục bị coi là *"không đổi và đã đóng"*
(`kept`), nó **ghi đè `src` bằng digest HIỆN TẠI** của mã nguồn:

```python
for it in kept:   # unchanged and closed: refresh what the gate checks (a source edit that changed no pixel)
    for k in ('key', 'src', 'name'):
        if k in it: st['items'][it['id']][k] = it[k]
```

Nhưng "không đổi" ở đây **không phải** so digest — `scope()` (`review.py:160-172`) so `key` và **dấu vân
tay của ảnh đã dựng** qua `fp_close` (`review.py:104-111`): ảnh thu nhỏ **48×27 mức xám**, dung sai rộng
(mỗi điểm lệch tối đa 32/255, trung bình ≤ 3). Một vật đã sửa mã (hình học, vật liệu, cấu hình) mà ảnh
ba góc nhìn gần như không đổi thì bị coi là "không đổi" — và `src` của nó được đổi sang digest mới.

Hệ quả trong `do-vat/tap-02-noi-com-dien`, đo trực tiếp:

| Vật | Vòng chấm gần nhất | Số dòng đã sửa sau vòng 11 | `src` trong state == digest hiện tại? |
|---|---|---|---|
| `bat-dong-nuoc` | **3** | **+94 / −6** | **có** |
| `nuoc` | **2** | **+157 / −12** | **có** |
| `tui-gao` | **3** | **+47 / −4** | **có** |

Vòng 12 chấm 6 mục khác; ba vật này **không hề được chấm lại**, nhưng cổng (`gate.py:126-129`) so digest
thấy khớp nên báo chúng là đã chấm — trên mã **chưa từng có ai nhìn**. `bat-dong-nuoc` và `nuoc` là hai vật
mà vòng 12 **đã định chấm lại** và cũng không thấy; `tui-gao` là vật mà vòng 11 chấm (sai 4 lần, cuối cùng
thành MỞ).

**Ảnh hưởng.** Đây là lỗ hổng của chính cổng chấm, không phải của người làm: **một phán quyết ĐẠT có thể
trỏ vào mã chưa từng được ai đánh giá**, và cổng nói "xong". Bước `props` có thể đóng, `gate.py check --for
render` có thể cho qua, và phim dựng ra từ mã đó không ai bảo chứng.

**Guard (đã dựng, 12-11 02:41 — đã commit).** `review.py:168-199` (`scope()`) hỏi **digest của mã nguồn**
trước, dấu vân tay 48×27 chỉ để sau: dòng 186 tính `same` từ `key` + `fp_close`, rồi dòng 187–188 ép
`same = False` nếu digest đổi — *"mã đã đi thì đây là mục khác, không phải mục đã được chấm"*. Vế thứ hai của
guard cũng có: `review.py:256-263` không ghi đè `src` của mục bị giữ khi digest đã đổi, nên cổng đếm mục đó là
*"chưa chấm hay đã đổi"* chứ không báo ĐẠT cho mã chưa ai nhìn.

Còn thiếu: `fp_close` (`review.py:112-117`) vẫn là blur 48×27 xám, max diff 32/255, mean ≤ 3 — nên **một vật
đổi hình học bên trong ảnh thu vẫn bị coi là không đổi**; cần so ở 256×144, và so cả vùng viền mực. Và
`gate.py status` (`gate.py:207-234`) chỉ in số đếm, danh sách MỞ và `stale_reasons` — **không** in vòng chấm
gần nhất của từng vật, nên người đọc vẫn không thấy ngay một vật mà lần chấm gần nhất cách mã hiện tại cả một
ngày.

### M14 — medium — Trần "mỗi chặng tối đa 2 phiên" của `episode.py` **đặt lại mỗi lần khởi chạy lại**

**Bằng chứng.** `episode.py:32` đặt `TRIES = 2`; `episode.py:121-134`: `tries = {}` nằm **bên trong
`main()`**, và vòng `while True` tăng `tries[leg[0]]` cho chặng đó. Nghĩa là trần đó chỉ có hiệu lực
**trong một lần chạy** của runner: khởi chạy lại runner (sau khi nó bị giết, hoặc với `--from`) thì bộ đếm
về 0 và chặng kẹt lại được hai phiên nữa.

Đúng như vậy đã xảy ra: runner của `cd168267` bị hệ điều hành giết lúc 04:17 giờ máy ngày 10/11 (máy
hết bộ nhớ), và phiên đó khởi chạy lại `episode.py --from 3` lúc 07:59 — bộ đếm về 0.

**Ảnh hưởng.** "Chặng kẹt thì dừng và nói chặng nào kẹt" — câu hứa trong docstring — không giữ được qua
một lần khởi chạy lại, và việc khởi chạy lại runner là điều xảy ra đúng khi nó hỏng.

**Guard (đã dựng, 12-11 02:21).** `episode.py` có `used_tries(ep)`: đọc số phiên mỗi chặng đã dùng từ
`<tập>/out/sessions.jsonl` của chính tập — nên ngân sách "mỗi chặng tối đa TRIES phiên" sống qua việc
runner bị giết và khởi chạy lại. Đây là cùng một lỗi với N144: **một trần chỉ sống trong RAM của tiến trình
thì không phải trần**.

### M15 — medium — Phán quyết "MỞ" (sai ba lần) **bị xoá** nếu vật đó sau đó vượt qua

**Bằng chứng.** `review.py:196-199`: `tries = old.get('fails', 0) + (1 if failed else 0)`;
`verdict = 'PASS' if not failed else ('OPEN' if tries >= TRIES else 'FAIL')`. Bộ đếm `fails` là **đơn điệu**
(nó không bao giờ bị xoá), nhưng `verdict` thì có: một mục đã OPEN, khi được chấm lại và lần này **ĐẠT**, đổi
thành `PASS` — và `summary()` (`review.py:247-250`) xếp MỞ từ `verdict`, nên dấu vết "sai ba lần" **biến
mất khỏi báo cáo**.

Đúng như vậy ở `do-vat`: `gao` có `fails: 4` (sai bốn lần) nhưng `verdict: PASS` ở vòng 11; `nhiet-ke` và
`noi-cat-ngang` thì vẫn `OPEN` với `fails: 3`. Cùng một quy tắc, hai kết cục khác nhau, và người đọc báo cáo
không biết vì sao.

**Ảnh hưởng.** Luật "sai ba lần thì thành MỞ và nằm trong báo cáo cho người dùng" — điều mà `SKILL.md:60`
hứa — là luật **có thể bị xoá bởi chính vòng chấm sau**, và người dùng không bao giờ thấy mục đó. Ba tập này
đều có mục MỞ; `co-the` đóng `props` được vì `may-ghi-giac-ngu` MỞ, nhưng nếu nó vượt qua ở vòng sau thì báo
cáo cuối sẽ không còn dòng đó.

**Guard (đã dựng, 12-11 02:41 — đã commit).** `review.py:228-229`, ngay trong `judge()`:
`if old.get('verdict') == 'OPEN': verdict = 'OPEN'` — một vòng sau đạt ĐẠT không xoá dấu vết "sai ba lần"
(như N144 đã nói "mục sai ba lần thành OPEN: bước đóng và đi tiếp, mục đó nằm trong báo cáo"). Sổ `fails`
vẫn đếm lên (`review.py:223`), và mục MỞ không chặn cổng (`gate.CLOSED = ('PASS','OPEN')`, `gate.py:32`).

Một điều cần nói đúng: **`summary()` không in số lần sai cho mục MỞ** (`review.py:333-336` chỉ in tên và các
lỗi còn lại); con số "lần sai N/3" chỉ hiện ở nhánh **PHẢI SỬA** (`review.py:330`). Nên "số lần sai" có
trong state, nhưng người đọc báo cáo không thấy nó ở mục MỞ — và đó cũng là lý do luật "sai ba lần thì nằm
trong báo cáo cho người dùng" chưa trọn vẹn.

### M20 — medium — Một nhãn ngắn hơn thời gian đọc chỉ một phần mười giây thì đỏ cổng, và phim không nói gì

**Bằng chứng.** Cổng bàn giao của `co-the` (12-11 02:0x) FAIL ở đúng bước `readcheck`:

```
BAD cong30   at 48.64s   10 chars  need 2.17s  got 2.00s  "BA MƯỚI PHÚT"
BAD caphe    at 100.88s   8 chars  need 2.03s  got 2.00s  "CAFFEINE"
```

*Đính chính nguồn:* hai dòng `BAD` này lấy từ **một lần chạy `readcheck.mjs` thủ công** lúc 19:13 UTC ngày
11-11, **không** phải từ cổng bàn giao (lần cổng FAIL lúc 02:00 UTC 11-11 là ở `nuat`, `minhthay`, `adeno`,
`caphe`). Phần đo và cơ chế thì đúng: `core/render/readcheck.mjs` đo thời gian đọc bằng
`số ký tự ÷ 15 + 1,5 s` (`readcheck.mjs:121`), và **cỡ chữ không vào công thức**.

Thiếu **0,17 s** và **0,03 s**. Không có gì trong hình báo điều đó — thẻ vẫn hiện, vẫn đọc được bằng mắt; chỉ
bài đo hộp chữ mới biết. Và cách sửa là **một số trong bảng thẻ**: `hold` của thẻ (`rig/render.js:209-213`,
`t1 = hết câu + hold`), rồi dựng lại và chạy lại cổng — 11 phút dựng + 15 phút cổng cho một số.

Đây đúng là lớp lỗi đã làm `do-vat` mất **một vòng dựng 11 phút** tối 11-11 (bốn thẻ thiếu 0,01–0,25 s),
và lần này lại đến với `co-the`.

**Guard.** `core/render/readcheck.mjs` đã nêu tên thẻ và thiếu bao nhiêu — nhưng nó chạy **sau khi phim đã
dựng**. `check_labels.py` (chạy ở bước hình, trước khi dựng) có thể kiểm **cùng luật đó**: cửa sổ của thẻ trừ
0,35 s pop-in và 0,2 s pop-out phải đủ thời gian đọc của số chữ và cỡ chữ. Sửa phim lúc đó rẻ hơn nhiều: một
lượt sửa mã + một vòng chấm hình, thay vì một lượt sửa mã + một vòng chấm hình + **một lần dựng lại toàn bộ phim**.

### M24 — critical — Ba guard vừa dựng có ba lỗ hổng, và cái nghiêm trọng nhất là **vân tay mã nguồn không thấy `src/props/`**

**Bằng chứng.** Kiểm chứng lúc 05:0x ngày 12-11, sau khi các guard của M1, M13, M15, M17 được dựng:

**(a) Vân tay mã nguồn không đệ quy — nó không thấy phần lớn mã của phim.**
`core/render/sourcewatch.mjs:22-25` đọc `src/` bằng `fs.readdirSync(src)` và chỉ lấy tệp ở **cấp trên cùng**
khớp `\.(js|mjs|css|html)$`. Tập `co-the` có **17 tệp trong `src/props/`** — và trong snapshot 19 mục của nó
**không có mục nào chứa `props/`**:

```
index.html · voice/lines.json · src/film.js · src/props.js · src/set.js · src/timeline.js · rig/*.js …
có mục nào trong src/props/ không? False
```

Nghĩa là bước `freshness` của cổng bàn giao — câu *"the movie was built from the code that is on disk now"* —
**nói dối** mỗi khi một vật được sửa. Với kênh này, mỗi vật là một tệp riêng trong `src/props/`, tức phần
lớn mã vẽ của phim nằm ngoài vân tay.

**(b) Chặng bàn giao so nhầm thứ cần so.** `episode.py:56-60` chạy `sourcecheck.mjs <tập>
out/source-fingerprint.json`, mà `sourcecheck` so snapshot với `fingerprintOf(dir)` — **mã hiện tại**, chứ không
phải phim. `core/render/video.mjs:35-37` ghi đè snapshot ở **đầu mỗi lần dựng**, nên một lần dựng bị bỏ dở
cũng ghi đè nó. Đo trên `co-the`: phim bàn giao **01:51**, `src/film.js` **02:14**, snapshot **02:22** →
`sourcecheck` in *"the movie was built from the code that is on disk now"* (mã 0) và `episode.done(ep,
'deliver')` trả **True** — dù phim cũ hơn mã 23 phút.

**(c) Chạm trần thì bước `props` không đóng.** Ở nhánh chạm trần (`review.py:272-277`) `rec` của mục bị ép
MỞ **không** được cập nhật `src`/`key`; mà `gate.tally()` (`gate.py:122-133`) so `rec.get('src')` với digest
**hiện tại** ở bước `props` → mục đó bị đếm là *"chưa chấm hay đã đổi"* → `gate.why_open()` trả lý do →
**bước không đóng**. Đo thật trên một tập tạm: sau khi chạm trần, `gate.why_open(props)` = *"0 mục phải
sửa, 1 mục chưa chấm hay đã đổi"*, `gate.tally` = `{'chưa chấm': ['ly']}` — **không phải** `{'OPEN': [...]}`. Bước
`picture` đóng được vì cổng so `src` của nó là hash lời kể, ít đổi hơn.

**Ảnh hưởng.** Cả ba lỗ hổng nằm ở đúng chỗ mà người ta tin: "phim khớp mã nguồn", "chặng bàn giao đã
xong", "bước props đã đóng". Chúng không sai một cách hiển nhiên — chúng **nói xanh khi chưa xanh**, và đó
tệ hơn là đỏ.

**Guard.** (a) `sourcewatch.mjs` phải đệ quy `src/` (và `rig/`), và `fingerprintOf` phải ghi **đường dẫn
tương đối** của từng tệp để `changed()` thấy cả tệp mới lẫn tệp bị xoá. (b) `video.mjs` phải ghi vân tay
**cạnh chính phim đã bàn giao** (`<tên>.fingerprint.json` cạnh `.mp4`), và `episode.py` phải so vân tay **đó**
chứ không phải vân tay của lần dựng gần nhất. (c) Ở nhánh chạm trần, `rec` của mục bị ép MỞ phải được ghi
`src`/`key` hiện tại **và** `verdict='OPEN'` — như vậy cổng đếm nó là MỞ (đã chấm, không chặn) chứ không phải
"chưa chấm". Mỗi cái cần một ca selftest: đổi một tệp trong `src/props/` thì phải báo phim cũ; xoá một tệp
thì phải báo; chạm trần thì bước phải đóng.

### M25 — high — Phim đã bàn giao và đã qua cổng **biến mất khỏi thư mục tập**, không ai ghi dấu vết

**Bằng chứng.** Tập `do-vat/tap-02` bàn giao lúc 22:10 ngày 11-11, cổng bàn giao **PASS lúc 22:14**. Đến
~12:00 ngày 12-11 kiểm lại thì **tệp `.mp4` không còn trong thư mục tập** — trong khi bản build của chính nó
vẫn nằm ở `out/` (22:10, 368 916 091 byte).

Dấu vết còn lại trong thư mục tập: `out/` chạm lúc **02:35** ngày 12-11, `build.sh` chạm lúc **02:37**, và
`review/.lock-final` tồn tại — nghĩa là **có thứ gì đó chạy trên tập này lúc 02:35–02:37**, sau khi tập đã
bàn giao (22:14) và sau khi phiên đã dừng. Không công cụ nào trong thư viện cố ý xoá phim của một tập:
`core/render/review.sh:25` chỉ xoá thư mục tạm của nó, `core/render/video.mjs:56` chỉ xoá thư mục đoạn và
tệp khoá, `core/render/new_episode.sh:317` chỉ xoá bản trung gian. **Chưa tìm ra thủ phạm.**

Hệ quả: bản đã qua cổng (368 856 824 byte) **không còn**, và bản trong `out/` (368 916 091 byte) **không
giống byte nào** với bản đã qua cổng — nên phải chạy lại cổng bàn giao từ đầu để có một lời "PASS" đúng
với tệp đang nằm trong thư mục tập. *Đã làm:* chép lại bản trong `out/` vào thư mục tập (12:03) và chạy lại
`core/render/review.sh` → **PASS** (motion: action 93 %, big 88 %, đoạn đứng yên dài nhất 3 s; 3604/3604 khung;
−14,0 LUFS; không có đoạn đen). Nên tập này **đã bàn giao thật** — nhưng chỉ sau khi chạy lại cổng từ đầu.

**Guard.** (1) Cổng bàn giao phải **ghi lại checksum của tệp phim nó vừa phán quyết**, và `gate.py status`
phải in checksum đó — để "phim đã bị đổi sau khi cổng xanh" là một sự kiện nhìn thấy được, chứ không phải
một tệp biến mất lúc ba giờ sáng. (2) `build.sh` khi chép phim vào thư mục tập nên chép kèm một tệp
`<tên>.sha1`, để tệp đó luôn đi cùng phim. (3) Bất cứ thứ gì chạy trên một tập đã bàn giao (kể cả một lần
`review.sh final`) nên để lại dấu vết trong `out/` — vì lần này dấu vết duy nhất là `.lock-final` và mốc
thời gian của hai tệp.

### M26 — medium — Một mô hình làm việc **hỏi** nhiều hơn là **chờ**, và cái chặn dò trạng thái không bắt được vì nó đếm theo hình dạng câu lệnh

**Bằng chứng.** Đo trên bốn phiên `2tocom/MiniMax-M3.1-Flash` đang chạy cùng lúc (đọc dòng một của
transcript, không nạp cả tệp):

| phiên | lượt có công cụ | đọc lại cùng một tệp | lệnh dò trạng thái | ghi lại |
|---|---|---|---|---|
| A | 98 | 18/28 lần đọc (64 %) | 11/69 lệnh shell (16 %) | `set.js` đọc 13× |
| B | 222 | Bash 144 · Read 66 | `cd <tập>` 11×, `ls` 7× + `ls -la` 5× | cùng một ảnh hero đọc 3–4× |
| C | 437 | 31/91 lần đọc (34 %) | 43/215 lệnh shell (**20 %**) | `khongkhi.js` sửa **65 lần**, `film.js` sửa 41× |
| D (cũ hơn) | 3 865 | Bash 2 579 · Edit 472 | — | `cat` **chính transcript của nó** 28×; `set.js` đọc 44×; `film.js` sửa 123× |

Bốn dấu hiệu lặp, theo thứ tự đo được:

1. **Sửa cùng một tệp hàng chục lần** (65× `khongkhi.js`, 41× `film.js`) — mỗi lượt trả lại toàn bộ ngữ cảnh.
2. **Đọc lại cùng một tệp**: 34–64 % số lần đọc là đọc lại, và tệp bị đọc lại nhiều nhất là **tệp vừa sửa**.
3. **Dò trạng thái chiếm 16–20 % lệnh shell** — `ls`, `ls -la`, `cd` lặp ở đầu mỗi lệnh, `gate.py status`.
4. **Đọc lại chính transcript của mình** (28× ở phiên D).

**Điểm khác biệt quan trọng với M5.** M5 là **chờ** (`sleep`, `until`, `Monitor`) — cái đó `hook_poll.py` bắt được sau khi
khoá đếm được cải thiện. Cái này là **hỏi**: `ls`, `ls -la`, `cat log`, `gate.py status`, `python3 -c "…"` —
liên tục đổi hình dạng, nên mỗi lần là một hình dạng mới và khoá đếm theo hình dạng **không bao giờ chạm ngưỡng**.

**Ảnh hưởng.** Đây là phần lớn cái giá của các phiên này: 16–20 % lệnh shell và hơn một phần ba số lần
đọc là việc làm lại, mỗi lượt lại trả tiền toàn bộ ngữ cảnh. Nó không biểu hiện như "chờ" nên không ai thấy
nó là một vòng dò.

**Guard.** `tools/hook_poll.py` nên đếm lệnh dò trạng thái **theo lớp**, không theo hình dạng: `ls`/`ls -la`,
`ps`, `cat` một tệp log, `gate.py status`, `python3 -c` đọc trạng thái — và chặn lần thứ N (N ≈ 15–20) bằng
thông điệp *"bạn đã hỏi trạng thái N lần, câu trả lời không đổi; hãy làm việc hoặc chờ"*. Ngưỡng phải cao
và thông điệp phải nói rõ đây là **hỏi trạng thái**, không phải đọc tệp — nếu không nó chặn nhầm việc thật.
Bên cạnh đó: `tools/hook_stale_read.py` (chặn lần đọc thứ ba của một tệp không đổi) đang không bắt được
34–64 % lượt đọc lại — cần xem lại ngưỡng 8 KB và cách nó tính "tệp không đổi".

### M27 — low — Một tệp bàn giao mới phải được **hợp đồng bố cục biết tới**, nếu không chính guard bố cục sẽ báo đỏ cho mọi tập dùng nó

**Bằng chứng.** Ngày 12-11, khi chạy `review.sh <co-the> final`, cổng bố cục in:

```
review: bố cục: tram-nghi-nhieu-series-co-the-tap-01-ngu-trua-day-me.fingerprint.json — tệp ngoài bố cục (CHANNEL.md, "Một tập")
```

Tệp vân tay mã nguồn cạnh phim là **một tệp bàn giao mới** (xem M24), và `channels/tram-nghi-nhieu/tools/layout.py:13`
liệt kê tệp được phép ở thư mục tập là `'events.json', 'poster.jpg', 'mk_timeline.py', '*.mp4',
'*.transcript.srt'` — không có `*.fingerprint.json`. Nên **mọi tập dùng bản `build.sh` mới sẽ báo bố cục sai**,
và `gate.py status` in *"bố cục: có thứ nằm sai chỗ"* cho tất cả chúng.

**Ảnh hưởng.** Tiếng ồn trên mọi tập, và — tệ hơn — nó làm một guard có thật trông như guard hỏng.

**Guard (đã dựng 12-11, commit `51ebe04`).** (1) `layout.py` biết `*.fingerprint.json` **và có một mẫu
selftest** cho nó — không có mẫu thì một đổi danh sách sau này lại làm đỏ mọi tập. (2) `docs/layout.md` và
`CHANNEL.md` (hợp đồng bố cục được viết ở đây) nói tới tệp mới, kèm **vì sao** nó nằm cạnh phim và vì sao ảnh
chụp của lần dựng nằm trong `out/`. (3) Quy tắc chung: **một tệp bàn giao mới không chỉ cần được viết đúng chỗ,
nó còn phải được hợp đồng bố cục biết tới** — nếu không thì chính cái guard kiểm tra bố cục sẽ báo đỏ cho mọi
tập dùng nó. Và theo M12, hợp đồng bố cục nay **chặn được** ở cổng bàn giao, nên một tập có vi phạm sẽ **không
đi** — và sẽ có gì nhắc.

### M28 — medium — Một tệp import không tồn tại là **digest băm thiếu mà không báo** — cổng tưởng mã không đổi

**Bằng chứng.** `props_catalog._closure()` đi qua các tệp helper `_` mà một vật import, và bỏ qua tệp không
tồn tại **âm thầm**: `if not os.path.isfile(p): continue`. Nên nếu một vật còn import `./sets/…` sau khi thư mục
đó đã được dờn đi, digest của vật đó **vẫn ra một chuỗi** — chuỗi băm thiếu — và `scope()` tưởng mã **không
đổi**, nên vật đó giữ phán quyết của mã cũ. Đây là cùng họ với M13, nhưng qua một lỗ hổng khác: không phải
ảnh thu quá mờ, mà là **mã không được băm hết**.

Cách nó lộ ra trong thực tế: khi một tập dờn `src/sets/` cho thẳng, các tệp shim `src/set-*.js` (một dòng
`export * from './sets/…'`) trở thành thân tệp thật — và nếu còn tệp nào import `./sets/…`, phim sẽ hỏng lúc
dựng.

**Guard (đã dựng 12-11, commit `d84a961`).** `props_catalog.problems()` nay báo **mỗi** tệp vật import
`./…` mà tệp đó không có, kèm câu nói rõ hậu quả (*"digest của vật sẽ băm thiếu mà không báo"*). Selftest 24 ca,
có ca riêng cho đúng trường hợp này. Đo trên năm tập đã có vật (`co-the/tap-01` 15 vật, `the-gioi/tap-01` 9,
`the-gioi/tap-02` 9, `do-vat/tap-02` 10, `do-vat/tap-01` 26) — **không tập nào dính**, nên cái chặn mới không
tạo tiếng ồn.

### M23 — medium — Bài đo chuyển động đếm **tọa pha**, không đếm hành trình của máy

**Bằng chứng.** `tools/check_motion.py:44-52` (`still_diff`): một điểm ảnh chỉ được tính là "có hành động"
khi nó đổi **cả hai** phép so — so với `bb`, khung **đã dịch ngược lại** chuyển động của camera
(`exp(-2j·pi·(FY·dy + FX·dx))`, tức "thế giới dưới camera"), và so với `b`, khung nguyên bản (tức "cái gì
ghim vào màn hình": nhãn, nền, viền). Nghĩa là thứ được đếm là **tọa pha**: vật gần và vật xa phải lệch
nhau.

Đo được trên tập `the-gioi/tap-01` ngày 12-11, bằng đúng hàm của cổng:

| Cách làm | c37 | c39 | c41 |
|---|---|---|---|
| đẩy thẳng vào vật (14 %) | ~1,6 %/giây | — | — |
| đẩy 14 % **+ trượt ngang 7 %** | ~5,8 %/giây | ~2,9 % | ~14,5 % |

Ngưỡng là 2 %. Một cú đẩy thẳng vào vật là **thu phóng**: cả cảnh cùng phình ra, ở độ phân giải 48×27
của bài đo chỉ còn ~1,6 % khung đổi — dưới ngưỡng. Thêm trượt ngang thì gần/xa tách ra, phần dư lại sống.
Sau đó "cửa sổ có hành động lớn" của tập đó nhảy **40 % → 48 %** (ngưỡng 45 %) và đoạn đứng yên rút từ
75 s xuống 33 s.

**Ảnh hưởng.** Một tập toàn cảnh có máy đẩy vào vật — đúng cái "chữ ký của kênh" — sẽ bị cổng nói là
đứng yên, và người làm sẽ đi sửa những thứ không sai.

**Guard.** Quy tắc này thuộc về **người làm**, không phải về máy: *máy phải trượt ngang để có tọa pha; đẩy
thẳng vào vật thì máy đi nhưng khung đứng yên*. Nó nên nằm trong `step6-assembly/GUIDE.md` cùng với phép
đo (`check_motion.py`), kèm cái giá phải trả: `camshare` — "share of frames where the whole picture shifts" —
phải **≤ 30 %** (`check_motion.py:14, 111`), nên trượt ngang phải canh chứ không trượt cả tập.

### M22 — low — Một nửa các lần kẹt của đêm qua là do đĩa đầy và `/tmp` nuôi rác

**Bằng chứng.** Lúc dựng lại `co-the` (12-11 02:24): đĩa `/` còn **7,9 GB** trên 159 GB — **95 % đầy**;
`/tmp` ăn **18 GB** trong đó có `da-check` 2,1 G, `area10` 2,1 G, `motionprobe` 880 M, `studiocopy` 694 M,
`a7repo` 685 M, `av1` 673 M, `pt2` 648 M, `insight-test` 648 M, `prod2` 623 M, `prod` 614 M. Cùng lúc đó có
hai tập dựng, mỗi tập một bản trung gian 1,1 GB cộng một bản copy crf-20 219 MB.

**Ảnh hưởng.** Không phải nguyên nhân trực tiếp của lần ghép hỏng (M21), nhưng nó là cái đệm không còn, và
nó khiến mọi lần dựng trở nên mong manh hơn.

**Guard.** Thư viện giữ mọi thứ thử trong `out/scratch/` của tập (đã có quy tắc), và `tools/` có
`check_disk.py` báo **chỗ trống trên đĩa** và **mười thư mục nặng nhất còn trong /tmp** trước khi một build
bắt đầu, để một đĩa đầy được gọi tên trước khi nó làm mất một lần dựng.

### M21 — high — Ghép phim hỏng thì xoá luôn bản dựng, và bản build vẫn báo thành công

**Bằng chứng.** Lúc dựng lại `co-the` (12-11 02:24 → 02:31):

```
done …/out/video.mp4 3672 frames 380s
mux.sh: offloading heavy x264 encode to remote VPS (muse)
mux.sh: the picture travels as a crf-20 copy (219 MB instead of 1059 MB) — the final encode is crf 19, so the film does not change
Connection to 127.0.0.1 closed by remote host.
lost connection
mux.sh: remote encode on muse failed; encoding locally
[in#0 @ 0x29bae740] Error opening input file …/out/video.mp4.
Error opening input files: No such file or directory
mux.sh: ffmpeg failed while writing '…/out/tram-nghi-nhieu-series-co-the-…'
```

Sáu phút dựng hình (3 672 khung) biến mất, và **không có phim nào được tạo ra**. Hai nguyên nhân chồng lên:

1. **Bản dựng cục bộ (fallback) mở `$V`** — chính file trung gian đó — và file đó **đã không còn**. Ai xoá
   nó? **Không phải `build.sh`**: dòng `rm -f "$OUT/video.mp4"` nằm **sau** `mux.sh`, và `build.sh:9` có
   `set -e` nên build **dừng ngay tại chỗ ghép** (log ghi `rc=1`, không phải 0) — và dòng xoá **chưa tồn tại**
   lúc sự cố ( nó được thêm vào lúc 19:37 UTC, *sau* sự cố). Bản trung gian thật ra bị xoá bởi
   `rm -rf …/out/video.mp4` của **một phiên khác** lúc 19:33 UTC ngày 11-11.
2. Và lần này **cổng báo thành công**: job nền thoát mã 0, trong khi thư mục tập không có phim mới (phim cũ
   lúc 01:51 vẫn nằm đó). Máy lúc đó đĩa 95 % đầy (7,9 GB trống), `/tmp` ăn 18 GB.

**Ảnh hưởng.** Một lần ghép hỏng mất trắng toàn bộ thời gian dựng, và không có gì báo rằng phim chưa có.
Nguyên nhân gốc không phải một dòng `rm` trong `build.sh` mà là **việc một phiên khác dọn bản trung gian của
một tập đang chạy** — cùng loại với M25.

**Guard.** (1) `build.sh` **chỉ** xoá bản trung gian khi phim đã tồn tại và khác 0 byte
(`[ -s "$OUT/$NAME.mp4" ] && rm -f "$OUT/video.mp4"`); (2) một lần ghép hỏng phải **dừng build với mã khác 0**
— "không có phim" không phải "đã dựng xong", và mã 0 phải là câu trả lời duy nhất cho "build xong"; (3) bản
dựng cục bộ của `mux.sh` nên mã hoá từ **bản copy** nó vừa làm (`$SMALL`) chứ không phải từ bản gốc, và khi
bản gốc đã mất thì phải nói *"dựng lại"* chứ không chết nửa chừng; (4) build phải kiểm chỗ trống trên đĩa
trước khi dựng một bản trung gian 1,1 GB.

### M19 — high — Một bước nói "KHÔNG phải phán quyết về phim" thì cổng vẫn tính nó là FAIL

**Bằng chứng.** `core/render/review.sh:36-53`, hàm `run()`:

```bash
if [ "$RC" -eq 2 ]; then echo "    COULD NOT RUN (exit 2) — not a verdict about the film"
elif [ "$RC" -eq 124 ]; then echo "    COULD NOT RUN (no answer in ${STEP_TIMEOUT}s) — not a verdict about the film"
else echo "    FAILED"; fi
echo "    ($(( $(date +%s) - T0 ))s)"
FAIL=$((FAIL + 1))
```

Dòng `FAIL=$((FAIL + 1))` nằm **ngoài** cả ba nhánh — nên một bước "không chạy được" (mã 2: máy chết giữa
chừng, tệp bị sửa lúc nó đang chạy) vẫn **cộng vào bộ đếm thất bại**, và cổng in ra
`review: FAIL … (1 step(s) failed)`.

Hậu quả: N25 đã nói đúng phần thông điệp — một bước treo phải được báo *"COULD NOT RUN — not a verdict
about the film"* thay vì *"FAILED"* — nhưng **cổng vẫn đỏ**, và người đọc thấy hai câu trái nhau: "đây không phải
phán quyết về phim" và "cổng FAIL". Người đọc tự nhiên đi tìm lỗi trong phim, mà phim thì không có lỗi nào.

(Đây **không** phải nguyên nhân của lần FAIL của `co-the` ngày 12-11 — lần đó là `readcheck` thật: hai thẻ
ngắn hơn thời gian đọc. Nhưng lỗi trong mã là thật và sẽ gặp lại mỗi khi một bước chết trên máy yếu.)

**Guard.** `run()` phải phân biệt: **"không chạy được" thì không tính FAIL** — nó in `COULD NOT RUN` và để
cổng báo *"bước X chưa chạy được, phim chưa bị phán quyết"*, tách riêng khỏi bước thật sự FAIL. Tốt hơn
nữa: một bước "không chạy được" phải **không để phim được gọi là xong** và phải nói rõ bước đó cần chạy
lại, chứ không được tính vào cùng một danh sách với lỗi thật.

### M18 — high — Danh sách "dòng lời đã được tha" hết hiệu lực âm thầm khi giọng đọc được thu lại

**Bằng chứng.** Cổng bàn giao tha cho những câu mà Whisper nghe sai thanh điệu tiếng Việt, bằng cách đọc
`voice/asr-cleared.txt` (`core/render/review.sh:169-190`): nó lấy ra **mã câu** trong tệp đó, và chỉ tha câu nào
có tên trong danh sách. Ở `co-the/tap-01`:

- `voice/asr-cleared.txt` viết lúc **10/11 17:22**, tha 7 câu: c7, c18, c21, c23, c37, c38, c50.
- **Toàn bộ tệp giọng được thu lại lúc 10/11 17:47** — 25 phút *sau* danh sách đó.
- Cổng chạy lại ASR trên **âm thanh mới**, nên những câu sai khác đi; danh sách cũ không khớp nữa, và
  cổng FAIL ở đúng bước `voice` — với lời dẫn hoàn toàn đúng.

**Ảnh hưởng.** Một cơ chế tha lỗi được viết ra để cứu phim lại **hết hiệu lực theo thời gian một cách
vô hình**: không có dấu hiệu nào nói "danh sách này cũ hơn âm thanh", và người đọc cổng thấy phim FAIL ở
bước giọng đọc nên đi tìm lỗi trong phim — mà phim thì không có lỗi nào.

**Guard.** `asr-cleared.txt` phải **bị ràng buộc với âm thanh mà nó tha**: mỗi dòng ghi thêm dấu vân tay của
tệp wav (`c50 — <sha1 ngắn của c50.wav> — lý do`), và `review.sh` chỉ tha câu **khi dấu vân tay khớp**. Dòng
nào lệch thì cổng phải nói *"âm thanh đã đổi, xem lại dòng này"* chứ không phải im lặng tha hoặc im lặng
đỏ. Ngoài ra `asr_vi.py` nên ghi dấu vân tay của wav vào `words.json` để danh sách tha và file âm đi cùng
nhau.

### M17 — critical — `episode.py` tưởng chặng bàn giao xong chỉ vì **có một tệp `.mp4` trong thư mục tập**

**Bằng chứng.** `episode.py:50-51`:

```python
if step == 'deliver':
    return bool(glob.glob(os.path.join(ep, '*.mp4')))
```

Chặng 7 ("dựng phim và cổng bàn giao") được coi là xong **chỉ cần thư mục tập có một tệp `.mp4`** — không
hỏi phim có mới hơn mã không, không hỏi cổng bàn giao có xanh không. Đúng lúc xảy ra (12-11 01:05):
runner `episode.py --from 6` của `co-the` in ra *"mọi chặng đã xong; phim: …"* và **thoát mã 0**, trong khi
phim trên đĩa là bản **11-11 08:49** còn `src/film.js` là bản **12-11 00:29**. Chính phiên chặng 6 đã viết
trong bàn giao: *"file mp4 trong thư mục tập cũ hơn `src/film.js` → phải dựng lại"* — và runner không đọc
lời bàn giao đó.

Hậu quả: **một tập có phim cũ được khai là xong, và người đọc `episode.py` tin điều đó.** Đây cũng là lý do
một phiên tương tác bỏ lỡ bước dựng: cổng nói "xong" thì ai cũng dừng.

**Guard (đã dựng 12-11 02:41 — nhưng câu thứ ba KHÔNG ràng buộc phim đã bàn giao, xem M24).**
`episode.py:47-63` `done(ep, 'deliver')` giờ hỏi: (1) có `.mp4` (dòng 54), (2) `gate.why_open(ep, 'picture')` là
None (dòng 55), (3) `core/render/sourcecheck.mjs <tập> <tập>/out/source-fingerprint.json` thoát mã 0 (dòng
56–60, và phải có tệp snapshot, dòng 57).

Nhưng câu 3 so **snapshot của lần dựng gần nhất** với mã hiện tại — **không** so với phim đã bàn giao. Mà
`core/render/video.mjs:35-37` ghi đè snapshot ở **đầu mỗi lần dựng**, nên một lần dựng bị bỏ dở cũng ghi đè
nó. Đo thật trên tập `co-the` lúc 05:0x:

| | mốc |
|---|---|
| phim đã bàn giao | 01:51 |
| `src/film.js` | 02:14 |
| `out/source-fingerprint.json` (bị lần dựng sau ghi đè) | 02:22 |

`sourcecheck.mjs` in *"the movie was built from the code that is on disk now"* (mã 0) và
`episode.done(ep, 'deliver')` trả **True** — dù phim bàn giao **cũ hơn mã 23 phút**. Đúng cái ca bản ghi muốn
chặn vẫn lọt.

Còn thiếu: mệnh lệnh *"mọi chặng đã xong"* phải nói **chặng nào** vừa xong bằng ba câu đó, chứ không chỉ dựa
vào việc có tệp `.mp4`. Và câu 3 phải ràng buộc **phim đã bàn giao** (xem M24).

### M16 — medium — Một subagent chết giữa chừng làm phiên mẹo chờ, và người canh im đúng lúc đó

**Bằng chứng.** Trong ngày 11-11 có **hai** subagent chết vì lỗi API giữa chừng:

- `the-gioi/tap-01`: subagent sửa c48 chết sau 28 bản thử dựng; phiên mẹo **ngồi yên 82 phút** mới
  nhận ra, rồi tự chốt bằng tay (và làm đúng: hai vòm cầu vồng cùng bán kính D=16 nên mép chồng cắt
  thành một đường thẳng; vẽ vòm thứ hai nhỏ hơn D=13 thì đọc ra hai vòng riêng).
- `co-the/tap-01`: subagent sửa ba lỗi chết, và **cả phiên mẹo biến mất** lúc 22:55 — để lại
  **+257/−100 dòng chưa từng qua vòng chấm nào** trong `src/film.js` (một hệ thống camera mới có tham số
  `đẩy máy`, các neo nhãn mới). Tập này mất trắng 50 phút chờ rồi mất cả phiên.

Và đây là mảnh ghép quan trọng: `tools/supervise.sh:257-262` đặt `QUIET_MIN=45` — khi phiên im lặng 45
phút thì **giám sát ngừng gọi mô hình** ("một lời gọi mô hình mỗi mười lăm phút trên một phim không ai
làm việc là một chi phí không có gì để đọc"). **Đúng khoảnh khắc đáng giá nhất — phiên đứng yên chờ một
subagent sẽ không bao giờ quay lại — là khoảnh khắc người canh im lặng.**

**Ảnh hưởng.** Một subagent chết tốn một giờ im lặng, và trong một trường hợp cả phiên mẹo đi theo
nó. Không có gì báo "subagent của bạn đã chết" — phiên chỉ đơn giản là không quay lại nữa.

**Guard.** (1) `tools/supervise.sh`: một phiên im lặng **không được** làm im mô hình khi phiên đó còn
một subagent chưa trả kết quả — transcript có `Agent` tool_use mà không có kết quả tương ứng thì báo
*"phiên đang chờ một subagent đã chết"* và nêu tên subagent. (2) Người sửa là subagent thì bản giao việc
phải nằm **trong một tệp** để phiên mẹo đọc lại được thay vì chờ. *Đính chính:* `fixbrief.py` **không** ghi
bản giao việc ra tệp — nó in ra stdout (`sys.stdout.write`); tệp duy nhất nó ghi là
`out/scratch/fix/<mã>/only.json`. Nên điều kiện của guard này là: `fixbrief.py` **phải** ghi bản giao việc
ra một tệp (để phiên mẹo và giám sát đọc lại được), và giám sát báo một phiên mà subagent của nó đã chốt
nhưng tệp bàn giao vẫn chưa đổi. (3) **Chạy tập
qua `episode.py`**: nó có `TRIES = 2` mỗi chặng, nên một phiên chết sẽ được chạy lại — đó chính là thứ
đã cứu `co-the` sau khi tôi khởi chạy lại bằng `episode.py --from 6`.

## Kết cục — ba tập đã bàn giao

Cả ba tập mà đêm 11-11 kẹt đã qua cổng bàn giao, và cả ba phim đều khớp mã (không tệp nguồn nào mới hơn
phim):

| Tập | Phim | Cổng bàn giao |
|---|---|---|
| `do-vat/tap-02-noi-com-dien` | 2:30 · 1920×1080 · 368 MB · 12/11 12:03 | **PASS** |
| `the-gioi/tap-01-cau-vong` | 3:49 · 1920×1080 · 461 MB · 12/11 12:20 | **PASS** |
| `co-the/tap-01-ngu-trua-day-me` | 2:32 · 1920×1080 · 346 MB · 12/11 12:34 | **PASS** |

Những gì phải sửa để đi từ "có phim" tới "phim qua cổng":

- `do-vat`: bốn thẻ ngắn hơn thời gian đọc (thiếu 0,01–0,25 s) → kéo dài `hold`; rồi cổng bắt hai thẻ chồng
  nhau → rút ngắn chữ thay vì kéo dài cửa sổ (M20: công thức thời gian đọc là `số ký tự ÷ 15 + 1,5 s`,
  **cỡ chữ không quan trọng**).
- `the-gioi`: 75 giây đứng yên → máy đếm **tọa pha**, không đếm hành trình của máy, nên phải trượt ngang chứ
  không đẩy thẳng vào vật (M23).
- `co-the`: bốn thẻ ngắn → hai thẻ sửa được ngay; `check_shots` chặn vòng chấm **trước khi tốn một vòng người
  chấm** (đúng tinh thần M20: sửa phim rẻ hơn sửa phim sau khi đã dựng).

Và hai việc đã tự bộc ra trong lúc chốt, không phải do ai đoán:

- **Phim đã bàn giao biến mất khỏi thư mục tập** (M25) — do dọn `out/` lấy chỗ cho đĩa. Đã khôi phục và
  chạy lại cổng từ đầu.
- **Bộ đếm trần vòng chạm trần thì bước `props` không đóng** (M24c) — vì mục bị ép MỞ giữ `src` cũ. Đã sửa.

**Còn để ngỏ:** `episode.py` có `LEMO_TRIES` — ngân sách phiên của một chặng phải là **đòn xoay** chứ không phải
hằng số, vì chặng hình của các tập này cần 8–10 vòng.

---

## Không thể có guard — chỉ ghi lại

1. **Bàn giao một chặng cho `episode.py`** — cơ chế nào cũng không biết một phiên tương tác *định* bàn giao hay
   không. Có thể chỉ ra (M2), không thể chặn. Người quyết định: xem `SKILL.md:88` và `episode.py`.
2. **"Đánh bóng thêm" có đáng không** — câu hỏi của người làm, không phải của máy. Máy chỉ có thể nói giá
   (M3) và đòi quyết định có chủ ý (`--force`).
3. **Một nhãn có cần tuyệt đối trọn trong khung không** — chỉ con mắt người quyết; máy đo được vị trí, không
   đo được "người xem có hiểu nhầm không".

---

## Đề xuất thứ tự làm

1. **M13** — sửa lỗ hổng ĐẠT im lặng của cổng trước mọi thứ khác: nó là lỗi làm **hỏng phim** chứ không
   chỉ làm chậm. Tệp: `channels/tram-nghi-nhieu/tools/review.py` (`:209-212`, `:160-172`, `:104-111`),
   `channels/tram-nghi-nhieu/tools/gate.py` (`status` in vòng chấm gần nhất của từng vật).
2. **M13 + M15** — sửa hai lỗ hổng của chính cổng trước mọi thứ khác: chúng là lỗi làm **hỏng phim** và
   làm **mất dấu vết**, chứ không chỉ làm chậm. Tệp: `channels/tram-nghi-nhieu/tools/review.py`
   (`:209-212`, `:160-172`, `:104-111`, `:196-199`, `:247-250`), `channels/tram-nghi-nhieu/tools/gate.py`.
3. **M1 + M11 + M14** — dựng lại trần vòng, cái chặn tải máy, và làm trần của `episode.py` sống lâu hơn một
   lần chạy. Tệp: `channels/tram-nghi-nhieu/tools/review.py`, `tools/hook_load.py`,
   `channels/tram-nghi-nhieu/tools/episode.py`, `.claude/settings.json`.
4. **M3** — cho cổng in ra giá của việc đánh bóng, và cho `review.py` đòi `--force` khi mở lại một bước đã
   đóng. Tệp: `channels/tram-nghi-nhieu/tools/gate.py`, `channels/tram-nghi-nhieu/tools/review.py`.
5. **M6 + M2** — giám sát đo được *khoảng cách giữa luật và hành vi*: đã đọc skill nhưng không sinh người
   sửa; đang ở chặng 6 mà chưa chạy `episode.py`. Tệp: `tools/rules.py`, `tools/supervise.sh`.
6. **M5** — sửa khoá đếm của `hook_poll.py` để nó bắt được vòng lặp chờ, và thêm câu lệnh thật của ba phiên
   này vào selftest. Tệp: `tools/hook_poll.py`.
7. **M8** — đặt thước cho `nhan` trong rubric bước 6. Tệp:
   `.agents/skills/tram-nghi-nhieu/step6-assembly/RUBRIC.md`.
8. **M4** — dựng tờ nhịp theo câu thay vì dựng lại cả tờ. Tệp:
   `channels/tram-nghi-nhieu/tools/review.py`, `channels/tram-nghi-nhieu/tools/beatsheet.mjs`.
9. **M7** — hook ngân sách ảnh. Tệp: `tools/hook_image_budget.py`, `.claude/settings.json`.
10. **M10** — check công cụ đứng yên. Tệp: `tools/check_tools_frozen.py`, CI.
11. **M9, M12** — dọn `out/scratch`, xóa thư mục `channels/` lồng trong tập do-vat, và cho bố cục chặn ở
    bước bàn giao. Tệp: `channels/tram-nghi-nhieu/tools/layout.py`.

---

## Việc cần làm sau khi ba tập này xong

- **Không sửa công cụ kênh khi ba tập đang bay** (M10) — các sửa đổi ở trên chỉ làm **sau** khi cả ba tập
  đã đóng bước `picture` và dựng xong, để ba tập không bị chấm bằng ba bộ luật.
- Chạy lại `gate.py status` cho cả ba tập, rồi chạy `review.sh <tập> final` một lần cho mỗi tập, và ghi
  các mục MỞ vào báo cáo cuối.
- Chạy `episode.py` cho tập kế tiếp (the-gioi/tap-02-vi-sao-troi-den-ban-dem) và so `out/sessions.jsonl`
  với bảng "Số tổng" ở trên — đó là phép đo xem các guard ở M1–M9 có đủ không.
- Dọn `out/scratch/` của ba tập (347 MB + 1,2 GB) và xóa `channels/tram-nghi-nhieu/series/do-vat/` lồng
  trong thư mục tập do-vat.
- **`improvements/lessons.md` chưa thêm dòng cho M1–M15, và đó là đúng.** Mỗi dòng của `lessons.md` mang
  một guard *đang có*; các guard ở đây mới chỉ là đề xuất. Khi nào M1, M3, M5, M7, M8, M10, M11, M13, M15 được
  dựng xong và có selftest, thêm mỗi dòng một — không thêm trước, để không sinh ra dòng dạy một luật mà
  không có gì giữ.
- **Chạy lại ba tập qua `episode.py` sau khi M13 và M1 xong.** M13 nghĩa là bước `props` của do-vat hiện
  đang ĐẠT cho ba vật mà chưa ai chấm; sau khi sửa cổng, phải chấm lại đúng ba vật đó (`--again
  bat-dong-nuoc,nuoc,tui-gao`) trước khi tập được coi là xong.
