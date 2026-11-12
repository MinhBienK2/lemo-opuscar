# Retro — tập 01 phơi quần áo: một tập tốn bao nhiêu, ở bước nào, và vì sao (2026-11-10)

Đo trên transcript của phiên làm tập (`e8ec853c…`, 1,1 GB) và 24 subagent của nó, bằng một script đếm `usage` của
từng lượt (mỗi `message.id` đếm một lần). Người chấm `claude -p` không lưu transcript nên không có trong số này.

## Số tổng

| | |
|---|---|
| Thời gian | 33,5 h (08/11 10:42 → 09/11 20:12), một câu yêu cầu, kết thúc vì người dùng bảo "dừng ngay. lấy video hiện có." |
| Token vào | phiên chính 1,14 tỷ (6 835 lượt, trung bình ~166 000 mỗi lượt) + subagent 0,29 tỷ |
| Token ra | phiên chính 6,1 triệu + subagent 4,2 triệu |
| Compaction | 55 |
| Ảnh đã đọc | 912 ở phiên chính + 731 ở subagent |
| Phim | có mp4 lúc 09/11 14:51; người dùng chấm bản đó 8/10 |

## Theo bước

| Bước | Thời gian | Token vào | Tỉ lệ | Ảnh | Compaction |
|---|---|---|---|---|---|
| 1 dàn ý + nghiên cứu | 39 phút | 26 M | 2 % | 6 | 1 |
| 2 lời + giọng | 39 phút | 25 M | 2 % | 30 | 2 |
| 3 storyboard (4–5 chạy song song) | 7 h 43 | 278 M | 24 % | 320 | 13 |
| 4–5 đặc tả + vật | 2 h 47 | 109 M | 10 % | 109 | 7 |
| 6 lắp phim | 16 h 21 | 564 M | 50 % | 367 | 26 |
| 7 bàn giao (sau khi đã có mp4) | 5 h 40 | 135 M | 12 % | 80 | 6 |

Lệnh Bash của bước 6 (2 380): sửa mã tập 719, dựng khung/sheet 332, thăm dò tiến trình 229, đọc lại mã công cụ 216,
chạy kiểm tra 188. Mã tập bị sửa 412 lần ở bước 3, trước khi storyboard xong (`props.js` bị chạm từ phút thứ hai).

## Nguyên nhân gốc

1. **Chuẩn "xong" cao hơn chuẩn của người dùng**: các vòng không hội tụ (0 lần ĐẠT ở cổng hình), mọi cổng đóng bằng
   bản cắt của đạo diễn.
2. **Bước sau bắt đầu khi bước trước chưa xong**: mỗi lần sửa dàn ý hay LOOK làm việc phía sau phải làm lại.
3. **Ngữ cảnh phình**: một phiên 33 h; token vào ≈ cỡ ngữ cảnh × số lượt; ảnh và log mở trong phiên đạo diễn được trả
   tiền lại ở mọi lượt sau; sau mỗi compaction lại đọc lại công cụ (`review.sh` ~50 lần).
4. **Đạo diễn tự nhìn mọi ảnh** để sửa theo lời người chấm, thay vì giao cho người sửa.
5. **Công cụ đổi giữa tập** (rig, probe, mixer), làm tờ sheet vừa dựng thành cũ.

Phần đã có ở skill v16 trước bản ghi này: chấm theo từng mục, sai 3 lần thành MỞ, xong ở mp4 đầu tiên, nghiệm thu chỉ
báo cáo, bước 4 không có vòng chấm riêng.

## Đã làm (skill v17)

| Nguyên nhân | Guard |
|---|---|
| 1 | `review.py` `BAR`: câu CHẶN là LỖI khi chỉ ra được chỗ làm người xem không thấy, đọc sai, hiểu sai; chỗ làm đẹp hơn là GÓP Ý |
| 2 | rubric dàn ý: `mo-dau` thành CHẶN, thêm `khac-biet` (GÓP Ý) — sửa trên giấy rẻ hơn sửa trên hình |
| 3 | `tools/episode.py`: mỗi chặng (1, 2, 3, 4–5, 6, 7) một phiên `claude -p` mới, chặng xong theo cổng, tối đa 2 phiên mỗi chặng, chi phí từng phiên vào `out/sessions.jsonl`; SKILL "Ngữ cảnh của bạn nhỏ thì phim rẻ" |
| 4 | `tools/fixbrief.py` + SKILL "Sửa sau vòng chấm": người chấm chấm, subagent sửa (props song song, look/picture tối đa 8 mục một người, lần lượt), người chấm mới chấm lại; đạo diễn đọc một dòng chữ mỗi mục |
| 5 | SKILL "Công cụ đứng yên suốt một tập" |

## Chưa kiểm chứng

`fixbrief.py` và `episode.py` qua selftest và chạy thử trên bản sao của một tập thật (`--dry-run`, bản giao việc của
33 khung look), nhưng chưa chạy trọn một tập. Kiểm chứng: tập kế tiếp chạy bằng `episode.py`, rồi so `out/sessions.jsonl`
với bảng "Theo bước" ở trên.

## Cập nhật 2026-11-11: năm nguyên nhân này vẫn đúng, và guard của chúng chưa chạm tới

Bản ghi [`2026-11-11-ba-phan-lam-phim-chay-38-gio.md`](2026-11-11-ba-phan-lam-phim-chay-38-gio.md) đo lại trên
ba phiên đang chạy (mở 09/11 19:02 và 19:21, còn chạy sau 38 giờ). Cả năm nguyên nhân ở trên vẫn đúng, nhưng
tình hình guard đã khác, và theo hướng xấu hơn ở một chỗ:

| Nguyên nhân | Guard hôm nay | Điều đo được |
|---|---|---|
| 1 (chuẩn người chấm cao hơn chuẩn người dùng) | `review.py` `BAR` | `BAR` có rồi, nhưng **câu hỏi** trong `step6-assembly/RUBRIC.md` vẫn tuyệt đối ("mỗi nhãn nằm trọn, chỉ vào tâm vật, không đè nhau, chỉ một cách đọc") → **M8** |
| 2 (bước sau bắt đầu khi bước trước chưa xong) | không có gì mới | `do-vat` sửa cả 10 vật **sau** khi vòng chấm props đã đóng ⇒ vòng đó mất hiệu lực → **M3** |
| 3 (ngữ cảnh phình) | `episode.py` | ba phiên đang chạy **không phải chặng của `episode.py`** (phiên tương tác, không có `-p`), nên `TRIES = 2` không bao giờ có tác dụng: 146 631 token vào mỗi lượt → **M2** |
| 4 (đạo diễn tự nhìn mọi ảnh) | `fixbrief.py` + subagent | hai phiên trong ba dùng `Agent` **0 lần**; `da4612a6` đọc 761 ảnh, 328,8 MB base64 trong transcript 680,8 MB → **M7** |
| 5 (công cụ đổi giữa tập) | `SKILL.md` "Công cụ đứng yên suốt một tập" | đã đổi lần nữa: `897e909` (09/11 22:25) đổi toàn bộ cơ chế chấm **3 giờ sau** khi các phiên mở; và bản làm lại đó xóa luôn trần vòng cùng `tools/hook_load.py` → **M1**, **M10**, **M11** |

Ba điều mà bản ghi này chưa nói, và bản ghi 11-11 nói:

- **Một guard bị gỡ trong lúc làm lại.** `897e909` xóa có chủ ý "ngân sách vòng" và `hook_load`; hôm nay
  `review.py` chỉ còn `TRIES = 3` ở tầng từng mục (`review.py:40`), không có trần cho cả bước. `do-vat` đã ở
  vòng props 12. Đây là N144 đã từng có guard.
- **Luật có trong ngữ cảnh mà không ai nhìn thấy nó bị bỏ.** Skill v17 commit lúc 10/11 01:40 giờ máy =
  09/11 18:40 UTC; ba phiên mở 19:01–19:21 UTC, tức **sau** v17, và cả ba đều nạp nó trong giây đầu tiên
  (`Read SKILL.md` lúc 19:02:15 và 19:21:42, tool `Skill` lúc 19:21:53, đều `version: 17.0.0`). Vậy mà
  hai phiên không sinh một subagent "người SỬA" nào và hai phiên không chạy `episode.py` thật lần nào.
  Đây không phải "phiên chạy theo quy tắc cũ" — đây là **luật có trong tay mà không có ai canh**.
- **Cái chặn "dò trạng thái" không bắt được các lệnh này.** `tools/hook_poll.py` chỉ bắt lệnh vừa hỏi giờ vừa
  kiểm tra tệp, lần thứ ba cùng hình dạng; selftest của nó khẳng định vòng lặp `until … sleep` **được đi qua**.
  Sổ `/tmp/lemo-polls.json`: mọi hình dạng lệnh dò của ba phiên đều đếm **1**.
