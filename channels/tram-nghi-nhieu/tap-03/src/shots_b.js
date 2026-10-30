// Bảng cảnh phần viết sau — chương 4, 5, 6 của tập 03 (sinh bởi src/mk_shots_b.py).
// Mỗi cảnh: { n (tên), at (câu neo), beat (loại hình), ...tham số, ev (sự kiện âm thanh) }.
// Sự kiện âm thanh có thời điểm **tương đối** so với đầu cảnh; film.js cộng thêm thời điểm của cảnh.
import { PAL } from '../../rig/character.js';

export const SHOTS_B = [
  { n: 'ch4p1', at: 'c4_17', off: -.2, beat: 'talk', line: 'c4_17',
    keys: [[0, 'flat'], ['w', 6, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 552, title: 'Ý CHÍ Ở ĐÚNG CHỖ', sub: 'cuối chuỗi, không phải đầu',
      lines: [{ t: 'lời nhắc "tập trung đi"', at: 'c4_18', k: 10, col: PAL.red.f }, { t: 'chỉ là một tiếng ồn', at: 'c4_18', k: 17, col: PAL.cyan.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch4p2', at: 'c4_19', off: 0.5, beat: 'talk', line: 'c4_19',
    keys: [[0, 'determined'], ['w', 6, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 552, title: 'LÀM CHO VIỆC NÓ ĐÁNG', sub: 'rút về một việc nhỏ, có phản hồi rõ',
      lines: [{ t: 'một việc nhỏ, có phản hồi rõ ràng', at: 'c4_19', k: 3, col: PAL.hoodie.f }, { t: 'ba dòng thì não chịu làm', at: 'c4_20', k: 10, col: PAL.cyan.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch4p3', at: 'c4_21', off: -.2, beat: 'talk', line: 'c4_21',
    keys: [[0, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 552, title: 'PHẦN THƯỞNG Ở TRƯỚC MẶT', sub: 'thì phần thưởng ở xa không còn là lý do để trốn',
      lines: [{ t: 'phần thưởng ở ngay trước mặt', at: 'c4_21', k: 3, col: PAL.cyan.f }, { t: 'hứng thú thường đến sau khi bắt đầu', at: 'c4_22', k: 5, col: PAL.hoodie.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch4p4', at: 'c4_23', off: 0.5, beat: 'talk', line: 'c4_23',
    keys: [[0, 'determined'], ['w', 8, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 552, title: 'CHỜ MÃI MỘT LẦN HỨNG THÚ', sub: 'thì chờ mãi',
      lines: [{ t: 'Hứng thú đến sau khi bắt đầu', at: 'c4_23', k: 5, col: PAL.cyan.f }, { t: 'bắt đầu bằng thứ nhỏ nhất', at: 'c4_24', k: 9, col: PAL.hoodie.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch4p5', at: 'c4_25', off: -.2, beat: 'talk', line: 'c4_25',
    keys: [[0, 'flat'], ['w', 6, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 552, title: 'KHI CHÁN', sub: 'bộ não đi tìm phần thưởng',
      lines: [{ t: 'nó chọn việc khó', at: 'c4_25', k: 11, col: PAL.green.f }, { t: 'không phải tín hiệu để nghỉ', at: 'c4_26', k: 12, col: PAL.red.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch4p6', at: 'c4_27', off: -.2, beat: 'compare', line: 'c4_27',
    leftHead: 'CÓ NHỮNG NGÀY',
    left: 'Tập trung được\\nrất lâu',
    rightHead: 'BA ĐIỀU KIỆN',
    right: 'Việc rõ\\nĐủ khó\\nPhản hồi ngay',
    pip: true, pipE: 'talk',
    ev: () => [[0, 'pop'], [0.6, 'ting']] },

  { n: 'ch4p7', at: 'c4_29', off: -.2, beat: 'talk', line: 'c4_29',
    keys: [[0, 'determined'], ['w', 6, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 552, title: 'MỘT VIỆC ĐÁNG TẬP TRUNG HƠN', sub: 'chứ không phải tập trung mạnh hơn',
      lines: [{ t: 'một việc đáng tập trung hơn', at: 'c4_29', k: 11, col: PAL.hoodie.f }, { t: 'viết ra, chia nhỏ, đặt mốc', at: 'c4_30', k: 12, col: PAL.cyan.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch5q1', at: 'c5_17', off: 1.4, beat: 'talk', line: 'c5_17',
    keys: [[0, 'skeptical'], ['w', 8, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 618, title: 'BẢY MẨU?', sub: 'con số có thật, nhưng nó cũng cũ',
      lines: [{ t: 'bảy thông tin cùng lúc', at: 'c5_17', k: 12, col: PAL.muted }, { t: 'bốn khối, không phải bảy', at: 'c5_18', k: 25, col: PAL.cyan.f  }, { t: 'cách bộ não sắp xếp để không bị tràn', at: 'c5_19', k: 13, col: PAL.green.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch5q2', at: 'c5_20', off: 1.2, beat: 'talk', line: 'c5_20',
    keys: [[0, 'flat'], ['w', 10, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 618, title: 'SAU MƯỜI LĂM PHÚT', sub: 'đầu tắt dần? không có bằng chứng',
      lines: [{ t: 'không có bằng chứng nào đúng như vậy', at: 'c5_20', k: 24, col: PAL.red.f }, { t: 'giữ được khoảng bốn mươi đến bốn mươi sáu phần trăm', at: 'c5_21', k: 12, col: PAL.cyan.f }, { t: 'hãy tin vào việc bạn đang làm', at: 'c5_22', k: 14, col: PAL.green.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch5q3', at: 'c5_23', off: -.2, beat: 'head', line: 'c5_23',
    thoughts: ['quên thời gian', 'thời gian', 'không phải thứ họ đang tính'],
    label: 'trong lúc đó, thời gian không phải thứ họ đang tính',
    ev: () => [[0, 'pop'], [0.6, 'ting']] },

  { n: 'ch5q4', at: 'c5_25', off: .3, beat: 'flow', line: 'c5_25',
    title: 'DÒNG CHẢY CẦN MỘT CÁI NEO',
    items: [{ n: '1', t: 'một việc', col: PAL.hoodie.f }, { n: '2', t: 'một chỗ', col: PAL.cyan.f }, { n: '3', t: 'một giờ', col: PAL.green.f }],
    pip: true, pipE: 'talk',
    ev: () => [[0, 'pop'], [0.6, 'ting']] },

  { n: 'ch6p1', at: 'c6_14', off: -.2, beat: 'talk', line: 'c6_14',
    keys: [[0, 'determined'], ['w', 10, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 552, title: 'SỢ TRỄ TIN NHẮN', sub: 'cái giá của việc trễ một tin nhắn',
      lines: [{ t: 'có khi nhỏ hơn khoảng hai mươi lăm phút', at: 'c6_14', k: 24, col: PAL.cyan.f }, { t: 'không có tin nhắn nào khẩn cấp', at: 'c6_15', k: 14, col: PAL.green.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch6p2', at: 'c6_16', off: -.2, beat: 'talk', line: 'c6_16',
    keys: [[0, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 486, title: 'ĐỪNG CHỈ BẬT IM LẶNG', sub: 'tắt hẳn từng ứng dụng một',
      lines: [{ t: 'vẫn để bạn thấy có gì mới', at: 'c6_16', k: 11, col: PAL.red.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch6p3', at: 'c6_17', off: -.2, beat: 'talk', line: 'c6_17',
    keys: [[0, 'determined']],
    card: { x: 560, y: 470, w: 860, h: 486, title: 'MỘT CÂU, NGẮN', sub: 'đủ để làm theo mà không phải nghĩ',
      lines: [{ t: 'viết quy tắc ra giấy, để trước mặt', at: 'c6_17', k: 0, col: PAL.hoodie.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch6p4', at: 'c6_18', off: -.2, beat: 'talk', line: 'c6_18',
    keys: [[0, 'tired'], ['w', 8, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 552, title: 'LÚC KHÓ NHẤT', sub: 'và cũng là lúc ta hay lao vào sớm nhất',
      lines: [{ t: 'Lau một cái cốc', at: 'c6_18', k: 15, col: PAL.cyan.f }, { t: 'Đi một vòng', at: 'c6_18', k: 19, col: PAL.cyan.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch6p5', at: 'c6_19', off: -.2, beat: 'talk', line: 'c6_19',
    keys: [[0, 'smile'], ['w', 6, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 486, title: 'DẤU HIỆU, KHÔNG PHẢI LỖI', sub: 'cảm giác khó chịu kia',
      lines: [{ t: 'là dấu hiệu, không phải lỗi', at: 'c6_19', k: 7, col: PAL.green.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch6p6', at: 'c6_20', off: -.2, beat: 'talk', line: 'c6_20',
    keys: [[0, 'determined']],
    card: { x: 560, y: 470, w: 860, h: 552, title: 'BỘ NÃO CẦN BIẾT MÌNH ĐANG TIẾN', sub: 'phản hồi tức thì',
      lines: [{ t: 'một dấu tick, một dòng gạch', at: 'c6_20', k: 6, col: PAL.hoodie.f }, { t: 'một đồng hồ đếm', at: 'c6_20', k: 6, col: PAL.cyan.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch6p7', at: 'c6_21', off: 1.2, beat: 'talk', line: 'c6_21',
    keys: [[0, 'flat'], ['w', 8, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 618, title: 'GIẤC NGỦ', sub: 'tổng hợp bảy mươi nghiên cứu',
      lines: [{ t: 'mất ngủ làm suy giảm khả năng giữ chú ý', at: 'c6_22', k: 10, col: PAL.red.f }, { t: 'đó là hiệu ứng mạnh, không nhỏ', at: 'c6_22', k: 21, col: PAL.hoodie.f }, { t: 'ngủ đủ là biện pháp, không phải phần thưởng', at: 'c6_23', k: 10, col: PAL.green.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch6p8', at: 'c6_24', off: 1.2, beat: 'talk', line: 'c6_24',
    keys: [[0, 'determined'], ['w', 8, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 486, title: 'BỎ BỚT', sub: 'đừng cố làm nhanh hơn',
      lines: [{ t: 'hãy bỏ bớt, và làm từng thứ một', at: 'c6_24', k: 17, col: PAL.hoodie.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch6p9', at: 'c6_25', off: 0.8, beat: 'talk', line: 'c6_25',
    keys: [[0, 'smile'], ['w', 8, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 552, title: 'MỤC TIÊU', sub: 'không phải là không bao giờ đi lang thang',
      lines: [{ t: 'biết mình đã tiêu bao nhiêu', at: 'c6_25', k: 15, col: PAL.cyan.f }, { t: 'hôm nay tiêu ít hơn hôm qua', at: 'c6_25', k: 22, col: PAL.green.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

];