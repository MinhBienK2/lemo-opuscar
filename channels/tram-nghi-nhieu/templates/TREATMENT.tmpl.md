> Dàn ý của tập. Viết xong trước khi viết lời và trước khi dựng hình; `review.sh --outline` chấm nó theo
> tiêu chuẩn tại `.agents/skills/tram-nghi-nhieu/step1-outline/PROMPT_CRITIC.md`. Thay mọi chỗ `<viết: …>`. Xoá các dòng hướng dẫn bắt đầu bằng `>` khi xong.

## Độ dài (điền sau khi lập bảng ý → hình)

> Không chọn trước. Câu trả lời có mấy tầng, bảng có bao nhiêu dòng, mỗi dòng cần bao lâu trên màn hình: cộng lại ra
> độ dài. Ghi vì sao không ngắn hơn (bỏ dòng nào thì thiếu mắt xích) và vì sao không dài hơn (cái gì đã cố ý để ngoài).
> Người dùng đã nêu độ dài hay nền tảng thì ghi ở đây, và ghi phần nào của câu hỏi bị thu hẹp cho vừa.

<viết: số tầng · số dòng · số câu dự kiến · tốc độ đọc · ước tính phút · vì sao không ngắn hơn · đã để ngoài cái gì>

## Câu hỏi, tách ra

> Vật nào thay đổi (chủ thể), thay đổi thế nào, so với cái gì, vì cái gì. "Vì sao X để cạnh Y lại Z?": chủ thể là X,
> nguyên nhân nằm ở Y. Đọc lại FACTS xem nguyên nhân có đúng chiều (cái gì tác động lên cái gì).

- Câu hỏi: <viết: câu hỏi>
- Chủ thể: <viết: …> · Thay đổi: <viết: …> · So với: <viết: …> · Vì: <viết: …>
- **Câu trả lời một câu** (chủ ngữ là chủ thể): <viết: …>

## Mở và kết

> Khung đầu cho thấy chính điều câu hỏi nói, ở nơi người xem gặp nó (nải chuối trên bàn bếp, không phải nhà máy).
> Chuyện lạ hay con số lớn để sau, khi người xem đã hiểu cơ chế.

- Khung mở: <viết: …>
- Kết: <viết: câu trả lời quay lại hiện tượng; việc người xem làm được hay cách nhìn mới>

## Nơi chốn

> Mỗi nơi là một tầng của câu trả lời; số nơi theo số tầng. Ghi đường máy đi giữa chúng
> (theo dây, chui vào vật, lùi ra). Nơi nào là bộ có sẵn của `rig/sets.js` (`kitchen`, `desk`, `bathroom`) thì ghi tên bộ.

| Nơi | Lớp của câu trả lời | Bộ có sẵn / tự dựng | Máy vào và ra thế nào |
|---|---|---|---|
| <viết: …> | | | |

## Vật lên hình

> Mọi vật có thật sẽ lên hình, mỗi vật kèm các bộ phận làm nó nhận ra trong một giây (trực thăng: thân, cánh quạt,
> đuôi, càng). Vật cần cắt ra: dựng nguyên rồi cắt bằng `section()`. Ruột máy: linh kiện của `rig/parts.js`.
> Tên ở cột đầu là tên trong `src/props.js`.

| Vật (và trạng thái) | Bộ phận đặc trưng | Từ rig hay tự dựng |
|---|---|---|
| <viết: …> | | |

## Thứ vô hình

> Chỉ khí, nhiệt, tín hiệu, dòng điện, lực. Mỗi thứ: mọc từ vật nào, chạy tới vật nào, bị chặn ở đâu, gây ra thay đổi
> gì nhìn thấy được. Dựng bằng `flow()`, `sparks`, `squiggle`… thành một vật liền, đủ to, không phải vài chấm.

- <viết: …>

## 3 khung hero

> Lập cảnh, cơ chế, "à ra thế". Mỗi khung: điểm nhìn, nguồn sáng, ba lớp sâu, màu nhấn.

1. <viết: …>
2. <viết: …>
3. <viết: …>

## Bảng ý → hình

> Mỗi ý của câu trả lời một dòng. Che cột ý, chỉ đọc cột hình vẫn phải ra câu chuyện; ý không có hình thì bỏ ý hay
> nghĩ ra hình. **Mỗi ý một dòng một lần**: ý đã nói thì không có dòng thứ hai (trừ một lần chốt ở kết).
> **Khái niệm có hình trước hay ngay khi được dùng.** Khi lập bảng:
> - ý có động từ biến đổi (chín, lan, nóng lên): hình của chính quá trình, trước → sau trong khung;
> - ý có con số: con số có vật mang nó (đồng hồ, lịch, thước, cân);
> - ý so sánh hai bên: khung rộng có cả hai, tách bạch, mỗi bên một chỗ sáng; vật đối chứng quay lại ít nhất mỗi 3 câu;
> - ý nhắc nơi chốn nào thì khung ở đúng nơi đó;
> - mỗi dòng một cách dựng khác dòng trước (góc, cỡ cảnh, vật chính); không quá 2 câu liền một cách dựng;
> - quay lại thời điểm trước thì có dấu hiệu thấy được (đồng hồ quay ngược, ánh sáng đổi).

| # | Ý | Trên màn hình thấy gì | Vật nào làm gì | Nơi |
|---|---|---|---|---|
| 1 | <viết: …> | | | |

## Chương

> Khi dàn ý ra cỡ tám phút trở lên. Mỗi chương một tầng mới của câu trả lời và một nơi chính, mở bằng một hình cho biết đang ở đâu.
> Không chương nào kể lại chương trước. Ranh giới chương ghi lại trong `src/chapters.js` (id, câu đầu, câu cuối).

| Chương | Lớp của câu trả lời | Nơi | Các dòng của bảng |
|---|---|---|---|

## Shot list

> Gom từ bảng ý → hình khi dựng: thời điểm · cảnh · máy làm gì · vì sao. Máy chỉ đi khi có lý do.

| Thời điểm | Cảnh | Máy | Vì sao |
|---|---|---|---|
