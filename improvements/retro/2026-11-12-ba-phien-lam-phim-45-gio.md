# Retro — ba phiên làm phim 09–11/11: hai ngày cho ba tập, và mười ba giờ chờ trong vòng dò (2026-11-12)

Bản ghi này đọc lại **ba phiên Claude Code** đã làm ba tập của kênh Trạm Nghĩ Nhiều từ 09/11 19:01
UTC đến 11/11 17:59 UTC — hai ngày — và **đo** lại chúng thay vì đọc lại lời kể. Nó bổ sung bản ghi
11/11 (`2026-11-11-ba-phan-lam-phim-chay-38-gio.md`, M1–M17): bản ghi đó đã tìm ra *nguyên nhân* của vòng
lặp, nhưng **không dựng guard nào**; đo ở đây cho thấy còn ba lỗi cơ chế mà bản ghi đó chưa nêu, và
một lỗi đo được thành con số.

Mã phát hiện của bản ghi này là **P1…P9** (P = "phụ", bản ghi thứ mười bốn).

**Các phép đo.** Transcript: `cd168267` (117 MB), `f50b467e` (351 MB), `da4612a6` (741 MB) — đọc bằng
script đếm lượt, không bằng mắt. Số liệu "chờ" là khoảng trống giữa hai lượt liên tiếp; "hoạt động" là
phần thời gian có lượt trong vòng 3 phút.

---

## Số tổng

| | `cd168267` | `f50b467e` | `da4612a6` |
|---|---|---|---|
| Tập | do-vat/tap-02 | the-gioi/tap-01 | co-the/tap-01 |
| Mở → đóng | 09/11 19:01 → 11/11 16:05 | 09/11 19:21 → 11/11 17:59 | 09/11 19:20 → 11/11 15:55 |
| **Tổng thời gian** | **45 h 4′** | **46 h 38′** | **44 h 35′** |
| Trong đó **hoạt động** (lượt trong 3′) | 4 h 54′ (11 %) | 12 h 36′ (27 %) | 19 h 18′ (43 %) |
| **Trong đó CHỜ** | **40 h 10′ (89 %)** | **34 h 2′ (73 %)** | **25 h 17′ (57 %)** |
| Lượt của trợ lý | 2 350 | 6 464 | 9 379 |
| Token ngữ cảnh vào (tổng cả ba) | 20,4 M | 38,4 M | 65,8 M |
| Cache đọc (tổng cả ba) | 373 M | 1 054 M | 1 481 M |
| Vòng chấm (tất cả bước) | 30 | 35 | 32 |
| **Phán quyết chấm LẠI mục đã chấm** | **63 %** | **66 %** | **64 %** |

Ba tập đều đã có phim. Tổng cả ba: **136 giờ** để dựng ba tập, trong đó **99 giờ là chờ**.

---

## P1 — critical — Chín giờ của ba phiên là **chờ trong vòng dò**, và cái chặn dò trạng thái không bắt được nó

**Bằng chứng.** `tools/hook_poll.py` (còn tồn tại) chỉ xét lệnh **vừa hỏi giờ (`date`) vừa kiểm tra
tệp (`ls|stat|wc|du`)**, và chặn từ lần thứ ba của *cùng một câu lệnh* (`shape_of` giữ nguyên cả câu
lệnh, chỉ bỏ số và dấu nháy). Ba phiên chờ bằng ba hình dạng **không** nằm trong mẫu đó:

| Hình dạng chờ | Số lần trong ba phiên | Tổng thời gian ngồi trong đó |
|---|---|---|
| `until [ -f … ]; do pgrep -f … ; sleep 10; done` | 8 | **5,0 h** (`cd168267`) |
| `for i in $(seq 1 230); do … sleep 20; done` | 37 | **2,6 h** (`da4612a6`) |
| `sleep 280; echo waited` (rồi `TaskStop` ngay) | 26 | còn lại |

Vòng dò còn tệ hơn: cả tám vòng `until … pgrep -f "review.py.*tap-02-noi-com-dien"` ấy **tự khớp với
chính nó** — `pgrep -f` thấy vỏ của chính lệnh đang chạy (đúng cái R14 cảnh báo), nên điều kiện
"runner còn sống" không bao giờ sai, và vòng đó chỉ dừng khi hết số lần. Một vòng dài nhất **82,9 phút**.

**Ảnh hưởng.** Mỗi lượt chờ là một lượt của phiên mà không làm ra gì, và nó trả tiền lại **toàn bộ**
ngữ cảnh của phiên — 741 MB ở `da4612a6`, 1,48 tỷ token cache đọc. Chờ 2,6 giờ bằng vòng dò là chờ
bằng cách đắt nhất có thể.

**Guard.** `tools/hook_poll.py`: khoá đếm là **hình dạng trừu tượng**, không phải câu lệnh —
`wait:loop` (`until|while|for` + `sleep`), `wait:sleep` (`sleep N` đứng một mình), `wait:proc`
(`ps`/`pgrep` hỏi tiến trình), `wait:date+check`. Cùng một kiểu chờ thì đếm chung, dù câu chữ khác nhau.
Ngưỡng 3 cho mỗi kiểu. Thêm vào selftest **đúng những câu lệnh thật** của ba phiên này.

---

## P2 — critical — Hai phần ba số phán quyết là **chấm lại mục đã chấm**: 1 584 phán quyết, 614 mục

**Bằng chứng.** Đếm trực tiếp từ `review/<bước>-<vòng>.md` của cả bốn tập:

| Tập | bước | vòng | phán quyết | mục khác nhau | chấm lại |
|---|---|---|---|---|---|
| co-the/tap-01 | look | 6 | 170 | 63 | **107 (63 %)** |
| | props | 10 | 39 | 15 | 24 (62 %) |
| | picture | 8 | 143 | 52 | 91 (64 %) |
| do-vat/tap-02 | look | 8 | 240 | 48 | **192 (80 %)** |
| | props | 13 | 43 | 10 | 33 (77 %) |
| the-gioi/tap-02 | picture | 12 | 171 | 31 | **140 (82 %)** |

Cơ chế (đọc `review.py:160-172`): phạm vi của một vòng là "mục nào **đã đổi**". Mục được coi là đã đổi
khi **dấu vân tay ảnh** của nó đổi — và dấu vân tay đó là **ảnh thu 48×27 mức xám** (`review.py:98-109`).
Một bóng đèn đổi chút, một vật dịch vài pixel, một lần dựng lại khác số thứ tự vẽ: tất cả đều làm
dấu vân tay đổi, nên **cả bước** mở lại và chấm lại gần hết.

Đo trực tiếp bằng chính `scope()` của công cụ, trên bốn tập hiện có: `look` phải chấm lại **28/52**
và **32/52** mục — lý do ghi ra là *"fingerprint changed"* — trong khi `script` và `picture` phải chấm lại
**0** mục.

**Ảnh hưởng.** Đây là tiền lớn nhất của hai ngày: 1 584 lượt người chấm, mỗi lượt mở ảnh cỡ thật.
Theo `do-vat/out/sessions.jsonl`, một chặng dài nhất tốn **574,65 USD** với **1 lượt**.

**Guard.** `review.py`: `scope()` hỏi **digest của mã nguồn** trước, rồi mới hỏi dấu vân tay ảnh.
Digest là chính xác và có sẵn (`props_catalog.digest` đã băm tệp vật **và** các tệp helper nó import),
nên nó đúng tuyệt đối: **mã đã đổi thì chấm lại, bất kể ảnh có trông giống hay không**. Thêm vào
selftest: một vật mã đã đổi thì quay lại người chấm dù ảnh không đổi.

---

## P2b — critical — Một bước **KẾ HOẠCH đã đóng** vẫn bị mở lại, và nó chặn cả bước sau

**Bằng chứng.** `gate.py:14-15` nói rõ: *"Một bước coi là xong khi mọi mục nó có là PASS hoặc MỞ và
không có gì đã chấm mà thay đổi: **outline, look — kế hoạch: đóng rồi thì đóng (sửa sau cũng vậy)**"*.
Nhưng `review.py` quyết phạm vi của một vòng bằng **dấu vân tay ảnh** (`scope()`), nên một vật sửa xong
làm dấu vân tay của nó đổi → vòng sau chấm lại nó → `_main` tính lại `closed` → **bước đã đóng lại mở** →
`review.py:561-564` thấy bước trước chưa xong nên **từ chối mở vòng của bước sau** → vòng lặp quay lại.

Đo trên bốn tập đang có, trước khi sửa, bước `look` phải chấm lại **28, 32, 18 mục** chỉ vì dấu vân
tay ảnh đổi; sau khi sửa: **0**. Vòng `look` của `co-the` đã đi tới **13** vòng vì lý do này.

Đây là M3 của bản ghi 11/11 — *"đánh bóng vật **sau** khi vòng chấm đã đóng xóa vòng chấm đó"* — và
bản ghi đó đã nêu guard (từ chối mở vòng khi vòng trước đã đóng mà mã đã đổi, trừ khi có `--force`).
Guard ấy **chưa được dựng**; nay nó đã có, và trùng đúng với cái `gate.py` đã hứa.

**Guard.** `review.py` `scope()`: một bước kế hoạch đã đóng thì giữ nguyên phán quyết, không mở lại vì
dấu vân tay đổi. Muốn chấm lại thì nói rõ (`--again`).

## P3 — critical — Một vật sửa lại mã có thể giữ phán quyết **của mã chưa ai nhìn**

**Bằng chứng.** `review.py:209-212` (bản cũ) ghi đè `src` bằng digest **hiện tại** cho mọi mục bị coi là
"không đổi":

```python
for it in kept:   # unchanged and closed: refresh what the gate checks
    for k in ('key', 'src', 'name'):
        if k in it: st['items'][it['id']][k] = it[k]
```

Nhưng "không đổi" ở đây được quyết bằng dấu vân tay 48×27 — mà dấu vân tay đó **không nhìn thấy** một
hình học đổi bên trong nó. Vậy nên: mã đổi → ảnh mờ → coi là "không đổi" → **ghi đè `src`** → cổng
(`gate.py:126-129`) thấy digest khớp → báo **"đã chấm"** → phim dựng ra từ mã **chưa từng có ai đánh giá**.

Bản ghi 11/11 đã ghi cái này (M13) và nêu ba cách sửa. **Cách thứ ba** được chọn ở đây: `src` của mục
bị giữ **không ghi đè**, và `scope()` gửi mục đó lại người chấm khi digest đổi — nên `src` và phán quyết
luôn thuộc về **cùng một mã**.

**Ảnh hưởng.** Đây là lỗi làm **hỏng phim**, không chỉ làm chậm: bước `props` có thể đóng, cổng
render cho qua, và phim dựng ra không ai bảo chứng.

**Guard.** `review.py`: `scope()` so digest nguồn **trước** dấu vân tay; `run()` không ghi đè `src` của
mục bị giữ khi digest đã đổi. Selftest: một vật mã đã đổi thì quay lại người chấm dù ảnh không đổi, và
`src` của nó thuộc về mã mới.

---

## P4 — high — `episode.py` tưởng chặng bàn giao xong chỉ vì **có một tệp `.mp4` trong thư mục**

**Bằng chứng.** `episode.py:50-51` (bản cũ):

```python
if step == 'deliver':
    return bool(glob.glob(os.path.join(ep, '*.mp4')))
```

Không hỏi phim có mới hơn mã không, không hỏi cổng bàn giao có xanh không. Đúng lúc xảy ra (12/11 01:05):
runner in *"mọi chặng đã xong; phim: …"* và **thoát mã 0**, trong khi phim trên đĩa là bản **11/11 08:49**
còn `src/film.js` là bản **12/11 00:29**. Chính phiên chặng 6 đã viết trong bàn giao: *"file mp4 trong
thư mục tập cũ hơn `src/film.js` → phải dựng lại"* — và runner không đọc lời bàn giao đó.

**Ảnh hưởng.** Một tập có phim cũ được khai là xong, và người đọc `episode.py` tin điều đó. Đây cũng là
lý do một phiên tương tác bỏ lỡ bước dựng: cổng nói "xong" thì ai cũng dừng.

**Guard.** `episode.py`: chặng `deliver` xong khi **cả ba** đúng — cổng bàn giao xanh, phim **mới hơn mọi
tệp nguồn** (`core/render/sourcecheck.mjs` đã có sẵn phép so này, cùng cái `core/render/review.sh` dùng),
và `sh core/render/review.sh <tập>` **thoát mã 0**.

---

## P5 — high — Trần "mỗi chặng tối đa 2 phiên" **đặt lại mỗi lần khởi chạy lại runner**

**Bằng chứng.** `episode.py:121` (bản cũ): `tries = {}` nằm **bên trong `main()`**. Nghĩa là trần đó chỉ
có hiệu lực **trong một lần chạy** của runner; khởi chạy lại runner — đúng cái xảy ra khi nó bị hệ
điều hành giết (máy hết bộ nhớ, 04:17 ngày 10/11) — thì bộ đếm về 0 và chặng kẹt lại được hai phiên
nữa. Đúng như vậy: runner của `cd168267` bị giết lúc 04:17, và phiên đó khởi chạy lại
`episode.py --from 3` lúc 07:59.

**Ảnh hưởng.** Câu hứa trong docstring — *"chặng kẹt thì dừng và nói chặng nào kẹt"* — không giữ được
qua một lần khởi chạy lại, và việc khởi chạy lại runner là điều xảy ra đúng khi nó hỏng.

**Guard.** `episode.py` đếm số phiên đã dùng của mỗi chặng từ **sổ của chính tập**
(`<tập>/out/sessions.jsonl`, đã có sẵn trường `leg` và `session`): trần rồi là trần của **tập**, không
phải của một lần chạy. Một phiên chết (`error: true`) không tiêu một lượt — nó chưa làm được việc gì.

---

## P6 — high — **Không có trần số vòng** cho một bước chấm: bước `look` đã đi tới vòng 15

**Bằng chứng.** Trong bản ghi 11/11 (M1) đã nêu việc này và nêu guard cần dựng — nhưng guard **chưa có**,
và số đo hôm nay xác nhận nó vẫn hỏng: `look` đi tới **vòng 15** (`the-gioi/tap-02`), `props` tới **vòng 13**
(`do-vat/tap-02`), `picture` tới **vòng 12**. Vòng chấm sau cùng của `picture` ở `the-gioi/tap-02` chấm
**2 mục**, và 140 lượt trước đó đã chấm lại những mục đã chấm.

Cơ chế: `TRIES = 3` tính cho **từng mục** (`review.py:40`), nên một bước chấm đi mãi không có đường ra
— mỗi vòng lại mở ra một vòng mới, và vòng mới thì luôn tìm được mục mới để chấm.

**Ảnh hưởng.** Một bước có 15 vòng nghĩa là 15 lần dựng tờ nhịp và 15 lần gọi người chấm, trong khi
vòng thứ 3 đã cho biết bước đó không hội tụ.

**Guard.** `review.py`: `MAX_ROUNDS` cho **mỗi bước** (`outline 4, script 6, look 8, props 8, picture 8`).
Khi chạm trần, vòng đó **không chạy nữa**: mọi mục còn lại thành **MỞ**, bước đóng lại, và báo cáo nói
rõ vì sao — cùng luật "sai ba lần thì thành MỞ" áp cho cả bước. Số vòng nằm trong state nên trần này
sống qua cả những lần khởi chạy lại. `LEMO_MAX_ROUNDS` để chỉnh.

---

## P7 — medium — Phán quyết **MỞ bị xoá** nếu vòng sau đạt ĐẠT

**Bằng chứng.** `review.py` (bản cũ): `verdict = 'PASS' if not failed else ('OPEN' if tries >= TRIES else 'FAIL')`.
Bộ đếm `fails` là **đơn điệu** (không bao giờ bị xoá) nhưng `verdict` thì có: một mục đã OPEN, khi được
chấm lại và lần này **ĐẠT**, đổi thành PASS — và `summary()` xếp MỞ từ `verdict`, nên dấu vết "sai ba
lần" **biến mất khỏi báo cáo**. Đúng như vậy ở `do-vat`: `gao` có `fails: 4` nhưng `verdict: PASS`.

**Ảnh hưởng.** Luật "sai ba lần thì thành MỞ và nằm trong báo cáo cho người dùng" — điều mà
`SKILL.md` hứa — bị xoá bởi chính vòng chấm sau, và người dùng không bao giờ thấy mục đó.

**Guard.** `review.py`: verdict **không** đổi từ OPEN sang PASS. Số lần sai vẫn đếm lên.

---

## P8 — medium — Cái chặn tải máy bị **gỡ cùng lúc** với trần vòng, và nó đã giết một vòng chấm 42 phút

**Bằng chứng.** `tools/hook_load.py` **không còn tồn tại** — nó bị xoá trong `897e909` (M1/M11 của bản
ghi 11/11). Máy lúc ghi: swap 7 691/7 813 MB đã dùng, và trong chính transcript `cd168267` có một job bị
hệ điều hành dừng: *"stopped because the system is running low on memory"*. Đêm 12/11, `hook_load` giết
cả phiên `claude -p` con của một vòng chấm hình đã chạy **42 phút** — tập mất trắng một vòng chấm và
phải chạy lại từ đầu. Trong `review/` **không còn dấu vết nào** để biết nó đã chạy.

Đo lại hôm nay trên máy đang chạy: swap đã dùng **89 %**, load **12,9** trên 12 lõi, và **hai** việc nặng
đang chạy cùng lúc (một `video.mjs` dựng phim, một `beatsheet.mjs` dựng tờ nhịp).

**Ảnh hưởng.** Thứ tự ưu tiên khi máy hết bộ nhớ là ngược lại với điều người ta tưởng: **phải dừng việc
nặng trước, không phải việc nhẹ** — và máy không biết việc nào nặng.

**Guard.** `tools/hook_load.py` dựng lại: chặn việc **nặng** (dựng hình, tờ nhịp, dựng phim, người chấm)
khi tải > 1,5 × số lõi, `MemAvailable` < 1,2 GB, hoặc swap ≥ 80 %; và **nêu đang có gì chạy** để phiên biết
phải xếp hàng thay vì đoán. Việc nhẹ vẫn chạy — người làm phải đọc được báo cáo và sửa được mã.

---

## P9 — medium — Người chấm **đổi model giữa chừng một bước**: phán quyết của hai người khác nhau nằm chung một state

**Bằng chứng.** Đếm từ header `review/<bước>-<vòng>.md` (dòng *"Người chấm:"*):

| Tập | bước | người chấm theo vòng |
|---|---|---|
| co-the/tap-01 | picture | r1–5 `claude -p` → r6–9 `--model claude-opus-5-5` |
| co-the/tap-01 | props | r1–4 `claude -p` → r5–10 `--model claude-opus-5-5` |
| do-vat/tap-02 | props | r1–11 `--model claude-opus-5-5` → r12–13 `claude -p` |
| the-gioi/tap-01 | script | r1 sonnet → r2 default → r4 sonnet → r5 default |

Tỉ lệ mục "LỖI hoặc MỞ" theo người chấm: `claude -p` (mặc định) **25 %** (907 phán quyết),
opus-5-5 **18 %** (511), sonnet-5-5 **16 %** (166).

**Ảnh hưởng.** Một mục được người A chấm ĐẠT rồi người B chấm LỖI thì vòng sau phải chấm lại, và
người đọc báo cáo không biết tiêu chuẩn nào đã dùng cho mục nào. `SKILL.md` không nói người chấm phải
giữ nguyên.

**Guard.** `review.py` ghi người chấm vào state mỗi vòng, và `gate.py status` in người chấm của vòng gần
nhất; `SKILL.md` nói: **một tập dùng MỘT người chấm suốt tập** — đổi người chấm giữa chừng là một quyết
định có chủ ý, và những mục đã chấm phải chấm lại (`--again all`) để tiêu chuẩn là một.

---

## P10 — high — Một sự cố **hạ tầng** bị quy oan là một chặng hỏng, vì hai bộ đếm trả lời khác nhau

**Bằng chứng.** Cả ba tập dừng ở chặng 3 với cùng một thông điệp: *"chặng 3 (look) chưa xong sau 2
phiên … đây là chỗ cần người quyết"*. Không có chặng nào hỏng: sổ của cả ba tập cho thấy hai hàng
của chặng 3 đều là `error: true`, và transcript cho thấy cả hai chết vì
`API Error: 530 … The host is configured as a Cloudflare Tunnel, but Cloudflare is currently
unable to reach it` — phiên dài nhất đã làm xong phần lớn việc rồi mới chết (do-vat: 3 722 s,
433 lượt, 77,91 USD; co-the: 3 333 s, 469 lượt; the-gioi: 5 127 s, 161,44 USD).

Hai bộ đếm cùng hỏi "chặng này đã dùng mấy lượt" và **không đồng ý**:

| Bộ đếm | Chỗ | Câu hỏi | Câu trả lời |
|---|---|---|---|
| Đọc từ sổ | `episode.py:86` (`1 if not row.get('error')`) | phiên lỗi có dùng lượt không | **không** — chặng 3 = 0 lượt |
| Trong RAM | `episode.py:166` (tăng trước khi chạy, không hoàn lại) | phiên lỗi có dùng lượt không | **có** — chặng 3 = 2 lượt |

Nên trong một lần chạy của runner, hai phiên chết vì 530 đã ăn hết ngân sách của chặng, và runner
dừng với lời quy oan. Ba tập cùng dừng đúng lúc đó (12-11 04:48).

**Guard.** `episode.py` có `budget(ep)` — **một** bộ đếm, đọc lại từ `out/sessions.jsonl` của tập mỗi
vòng; `is_crash()` tách *chết vì hạ tầng* (không có kết quả; có `api_error_status`; nhắc tunnel
hay reset) khỏi *lỗi của chặng* (hết lượt `error_max_turns`, hết tiền `error_max_budget_usd`) —
chết vì hạ tầng không dùng lượt của chặng, lỗi của chặng thì dùng. Hàng cũ (không có trường `crash`)
mà `error=true` thì đọc là crash, nên ba tập đang dở giữ nguyên ngân sách. Quá `MAX_CRASHES` lần thì
runner dừng với thông điệp **nói đúng là cổng inference**, không phải "cần người quyết". Dòng sổ bị
cắt giữa chừng không còn làm mất ngân sách của các dòng sau nó.

## P11 — high — Bàn giao của một chặng nằm trong **stdout của runner**, nên nó chết theo runner

**Bằng chứng.** `episode.py` yêu cầu phiên kết thúc bằng "tóm tắt cho phiên sau, tối đa tám dòng",
nhưng tám dòng đó chỉ được in ra stdout của runner. Runner chết (530, OOM) là mất bàn giao — và
chặng sau là một phiên mới, không có gì để đọc. Việc này đo được ở cả ba tập sau khi chặng 3 chết:

| Tập | Việc còn trên đĩa | Việc chặng sau phải làm lại |
|---|---|---|
| do-vat/tap-03 | `LOOK.md` 148 dòng (80 dòng bảng), `src/film.js` 385 dòng, `src/set.js` 687 dòng, 15 vật, 80 câu giọng đọc | dựng 27 ảnh hero (0/27), chấm lại `look` |
| the-gioi/tap-03 | 37 ảnh hero **cũ hơn code 7 phút**, `review/look.json` 12 mục | dựng lại 37 ảnh, vá 7 dòng bảng lệch, chấm lại |
| co-the/tap-02 | `src/film.js` 413 dòng, `src/set.js` 765 dòng, `LOOK.md` 87 dòng — **chưa được git theo dõi** | dựng 50 ảnh hero (bộ cũ đã lỗi thời) |

Một thứ nữa: `review.py` chỉ so **dấu vân tay ảnh**, không so mã nguồn, nên the-gioi chấm lại 8 mục
FAIL trên 37 ảnh cũ sẽ không bao giờ thoát FAIL — vòng chấm tự nó là một vòng lặp vô tận.

**Guard.** Bàn giao nằm **trong tập**: `out/leg-<n>.md`, và prompt của chặng sau mang theo nó. Ghi chú
tiếp tục (`out/resume-note.md`) cho phiên kế tiếp — ghi chú ghi "leg: N" thì chỉ dùng cho chặng N, nên
một ghi chú cũ không lái sai chặng sau. Lần chạy lại hôm nay, ba tập nhận đúng ghi chú còn dở và bắt
đầu ở "phiên 1/2" thay vì bị quy oan.

## P12 — medium — Ảnh kiểm tra vật **dựng lại ra một vật khác**, vì một bên seed hạt giống còn bên kia thì không

**Bằng chứng.** `src/film.js` seed `Math.random = mulberry(20261112)`; `propcheck/main.js` thì không
seed gì cả. Bốn vật trong mười lăm vật dựng ra hai hình khác nhau giữa hai lần chạy — mỗi lần dựng
lại là một vật khác, nên vòng chấm vật không bao giờ ổn định và mọi lần sửa lại phải chấm từ đầu.

**Guard.** `propcheck/main.js` seed `Math.random` bằng `mulberry` (mặc định 20261112), và
`tools/propcheck.mjs` đọc hạt giống của tập từ `src/film.js` rồi truyền qua `?seed=` — ảnh vật
trùng với phim chứ không chỉ trùng với chính nó. Kiểm chứng: hai lần dựng, 28 ảnh, md5 giống hệt.

---

## Đã làm

| Phát hiện | Guard |
|---|---|
| P1 | `tools/hook_poll.py`: khoá đếm theo **kiểu chờ** (`wait:loop`, `wait:sleep`, `wait:proc`, `wait:date+check`); selftest có đúng câu lệnh thật của ba phiên |
| P2 + P3 | `review.py`: `scope()` hỏi **digest mã nguồn** trước dấu vân tay ảnh; `run()` không ghi đè `src` của mục bị giữ khi mã đã đổi — mã và phán quyết luôn cùng một mã |
| P2b | `review.py` `scope()`: một bước **KẾ HOẠCH đã đóng thì không mở lại** vì dấu vân tay ảnh đổi (trước khi sửa: `look` chấm lại 28–32 mục; sau: 0) |
| P4 | `episode.py`: chặng `deliver` xong khi cổng xanh **và** `sourcecheck.mjs` nói phim là phim của mã hiện tại |
| P5 | `episode.py`: trần số phiên đếm từ `out/sessions.jsonl` của tập — trần của **tập**, không của một lần chạy |
| P6 | `review.py`: `MAX_ROUNDS` mỗi bước; chạm trần thì phần còn lại thành MỞ và bước đóng lại |
| P7 | `review.py`: verdict không đổi từ OPEN sang PASS |
| P8 | `tools/hook_load.py` dựng lại: chặn việc nặng khi máy quá tải, và nêu đang có gì chạy |
| P9 | `review.py` ghi người chấm vào state; `gate.py status` in người chấm gần nhất |
| P10 | `episode.py`: **một** bộ đếm `budget(ep)` đọc từ sổ của tập mỗi vòng; `is_crash()` tách chết-vì-hạ-tầng (không dùng lượt) khỏi lỗi-của-chặng (có dùng lượt); `MAX_CRASHES` và thông điệp nói đúng là cổng inference |
| P11 | `episode.py`: bàn giao của chặng nằm trong tập (`out/leg-<n>.md`) và được đưa vào prompt của chặng sau; ghi chú tiếp tục (`out/resume-note.md`) chỉ dùng cho đúng chặng của nó |
| P12 | `propcheck/main.js` seed `Math.random` bằng `mulberry`; `tools/propcheck.mjs` truyền hạt giống của tập (`?seed=`) đọc từ `src/film.js` |

Tất cả đều có selftest: `review.py --selftest` (31 ca), `episode.py --selftest` (17 ca),
`gate.py --selftest`, `hook_poll.py --selftest` (22 ca), `hook_load.py --selftest` (13 ca).

## Không thể có guard — chỉ ghi lại

1. **Có nên chấm lại không** — câu hỏi của người làm. Máy đo được giá (P2) và đòi quyết định có chủ ý.
2. **Người chấm nào "đúng" hơn** — không có thước đo chung giữa các model (P9).
3. **Một nhãn có cần tuyệt đối trọn trong khung không** — chỉ con mắt người quyết.
