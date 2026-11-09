// Một chương duy nhất cho tập 03 — quyết định chốt ở dàn ý (vòng chấm dàn ý số 3).
//
// Vì sao có file này: một tập dài có nhiều chương thì mỗi chương được chấm riêng, và cổng chỉ
// mở khi *mọi* chương PASS. Tập này dài 63 câu nhưng chỉ có một mạch ý, nên một chương là đủ.
//
// Điều kiện đã chốt: **ngay khi thêm một dòng ý nào, phải chia thành hai chương** —
//   chương 1 "ký ức của vật liệu" (c1–c40) và chương 2 "khí bị giam" (c41–c63) —
// rồi cổng sẽ chờ cả hai chương PASS. Tên chương không có dấu "/" vì tên này đi vào tên tệp
// của các bản chấm.
export const CHAPTERS = [
  { id: 'tap-03', lines: ['c1', 'c63'], files: ['film.js', 'set.js', 'props.js'] },
];
