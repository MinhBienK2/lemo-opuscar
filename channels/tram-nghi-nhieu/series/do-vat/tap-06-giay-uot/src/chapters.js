// Ba chương của tập 06 — mỗi chương một tầng của câu trả lời và một nơi chính.
//
// Vì sao có file này: một tập dài có nhiều chương thì mỗi chương được chấm riêng, và cổng chỉ
// mở khi *mọi* chương PASS. Tập này 43 câu, ba chương; ranh giới chương chốt ở dàn ý:
//   ch1 "hai tờ giấy, hai tay" (c1–c8)  — hiện tượng: tay ướt làm rách, tay khô thì không;
//   ch2 "bên trong tờ giấy" (c9–c23)     — cơ chế: sợi, hydroxyl, liên kết hydrogen, nước lấn vào;
//   ch3 "đo thì biết" (c24–c43)          — phép đo: lực kế, độ ẩm, giấy ướt, giấy có nhựa, giấy đã sấy.
// Tên chương không có dấu "/" vì tên này đi vào tên tệp của các bản chấm.
//
// `files` là các tệp mã mà chương này sở hữu: chấm hình chương nào thì đọc những tệp đó cộng
// với mọi tệp chung (tệp không thuộc chương nào thì mọi chương đều đọc).
export const CHAPTERS = [
  { id: 'ch1', lines: ['c1', 'c8'], files: ['film.js', 'shots.js', 'acts.js', 'set.js', 'props.js'] },
  { id: 'ch2', lines: ['c9', 'c23'], files: ['film.js', 'shots.js', 'acts.js', 'set.js', 'props.js'] },
  { id: 'ch3', lines: ['c24', 'c43'], files: ['film.js', 'shots.js', 'acts.js', 'set.js', 'props.js'] },
];
