# Rubric — hình của từng câu

Mục chấm: từng câu trong danh sách MỤC (mã câu `c12`). Mỗi câu có một khung `b/<mã>.jpg`, chụp lúc người kể đang nói
câu đó. Danh sách MỤC cho kèm lời của câu, chữ của từng nhãn đang hiện (`nhãn:`), và cờ máy đo được. Mở mỗi khung ở cỡ
thật, từng khung một. Khung của câu trước (`b/<mã>-truoc.jpg`, khi có) chỉ để so, không phải để chấm.

**Chữ của nhãn thì đọc ở danh sách `nhãn:`**: đó là chuỗi đúng đã vẽ. Ảnh chỉ cho biết nhãn nằm ở đâu và chỉ vào vật nào.

Cờ máy là gợi ý, không phải phán quyết:
- `DARK`: chủ thể có thể chìm trong tối.
- `SAME` hoặc `RUN`: khung có thể giống câu trước.
- `NUM`: câu nói một con số mà màn hình có thể chưa có số.
- `phủ` dưới 15 %: khung có thể gần như trống.

| id | loại | câu hỏi |
|---|---|---|
| dung-loi | CHẶN | Tắt tiếng, chỉ nhìn khung: vật hay hành động mà câu đang nói có mặt và đọc ra được không? |
| thay-ro | CHẶN | Vật chính có đủ lớn và đủ sáng để đọc không: không chìm trong tối, không là vệt nhỏ giữa mảng trống, không bạc màu lẫn vào nền, không bị một điểm cháy trắng che? |
| nguyen-ven | CHẶN | Hình có nguyên vẹn không: không vật xuyên qua nhau sai chỗ, không mảnh lơ lửng, không máy quay nằm trong vật, không khung đen hay trống? |
| nhan | CHẶN | Mỗi nhãn có nằm trọn trong khung, chỉ vào tâm đúng vật nó gọi tên, không đè lên nhãn khác, và chỉ có một cách đọc không? |
| hinh-moi | GÓP Ý | So với khung câu trước, câu này có hình của riêng nó (vật mới, hành động mới, góc mới) không? |
| so | GÓP Ý | Câu nói một con số thì màn hình có con số hay thước đo đi kèm không? |
| dep | GÓP Ý | Khung có đẹp không: bố cục, màu, chiều sâu, ánh sáng dẫn mắt? |

ĐẠT khi khung cho thấy điều câu hỏi hỏi. LỖI khi bạn chỉ ra được chỗ trong khung làm hỏng nó. Ví dụ: "góc trên trái,
nhãn X bị mép cắt", hay "áo ướt chỉ chiếm một vệt ở giữa mảng tường trống".
