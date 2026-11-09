// Bốn chương của tập 04 — mỗi chương một tầng của câu trả lời và một nơi chính.
//
// Vì sao có file này: một tập dài có nhiều chương thì mỗi chương được chấm riêng, và cổng chỉ
// mở khi *mọi* chương PASS. Tập này 48 câu, bốn chương.
//
// Điều kiện đã chốt ở vòng chấm dàn ý số 2: giữ đúng bốn chương này, đừng thêm dòng làm lệch
// ranh giới chương. Chương 2 đóng ở bếp (dòng 27) nên nơi của nó ghi "trong dây, đóng ở bếp".
// Tên chương không có dấu "/" vì tên này đi vào tên tệp của các bản chấm.
//
// `files` là các tệp mã mà chương này sở hữu: chấm hình chương nào thì đọc những tệp đó cộng
// với mọi tệp chung (tệp không thuộc chương nào thì mọi chương đều đọc). Ở đây cả bốn chương
// đều nằm trong cùng một bộ mã (bảng ý → hình và dàn ý bố cục đều ở film.js), nên phần lớn tệp
// là tệp chung.
export const CHAPTERS = [
  { id: 'ch1', lines: ['c1', 'c8'], files: ['film.js', 'props.js'] },
  { id: 'ch2', lines: ['c9', 'c27'], files: ['film.js', 'props.js'] },
  { id: 'ch3', lines: ['c28', 'c41'], files: ['film.js', 'props.js'] },
  { id: 'ch4', lines: ['c42', 'c48'], files: ['film.js', 'props.js'] },
];
