# Rubric — nghiệm thu phim (báo cáo, không chặn)

Phim đã dựng xong và đã giao cho người dùng. Vòng này viết một báo cáo chất lượng để lần sau làm tốt hơn. Nó không
mở lại bước nào.

Mục chấm: `phim` (cả phim). Thư mục `f/` có một khung cho mỗi câu, cắt từ chính file mp4, tên tệp là mã câu. `lines.json`
có lời của từng câu. `shown.txt` có chữ của từng nhãn đang hiện ở mỗi câu: đó là chuỗi đúng đã vẽ, nên chữ của nhãn
đọc ở đó, không đọc trong ảnh. Mở các khung ở cỡ thật.

| id | loại | câu hỏi |
|---|---|---|
| tra-loi | GÓP Ý | Xem hết các khung theo thứ tự lời kể: phim có trả lời trọn câu hỏi của tập không? |
| hinh | GÓP Ý | Có khung nào đen, vỡ hình, bạc màu, hay có vật chính quá nhỏ để đọc không? Ghi mã câu. |
| nhan | GÓP Ý | Có nhãn nào bị mép cắt, chỉ sai vật, hay đọc nhầm sang vật khác không? Ghi mã câu. |
| nhip | GÓP Ý | Có chuỗi câu nào đứng trên cùng một hình quá lâu không? Ghi mã câu. |
| dep | GÓP Ý | Ba khung đẹp nhất và ba khung yếu nhất là khung nào, và vì sao? |

Mỗi điều đáng nói là một dòng. Một dòng LỖI cho mỗi chỗ cần sửa, ghi mã câu trong phần "thấy gì". Một dòng ĐẠT cho
mỗi câu hỏi không có gì đáng nói.
