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
