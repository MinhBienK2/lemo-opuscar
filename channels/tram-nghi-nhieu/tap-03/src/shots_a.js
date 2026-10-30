// Bảng cảnh phần viết sau — chương 1, 2, 3 của tập 03.
// Đây là những dòng kịch bản được thêm vào sau bản nháp đầu tiên; `src/shots.js` đã có các dòng còn lại.
// Mỗi cảnh: { n (tên), at (câu neo), off, beat (loại hình), ...tham số, ev (sự kiện âm thanh) }.
//
// Thứ tự trong mảng là thứ tự đọc (theo `SEQ` của timeline.js). Các dòng mới nằm xen giữa các dòng cũ,
// nên khi ghép vào bảng của `shots.js` phải cắt vào đúng chỗ:
//   ch1m            — sau ch1d, trước ch1e
//   ch1n, ch1o      — sau ch1g, trước ch1h
//   ch1p            — sau ch1h, trước ch1i
//   ch1q, ch1r      — sau ch1i, trước ch1j
//   ch1s            — sau ch1l, trước ch2
//   ch2q            — sau ch2, trước ch2a
//   ch2r, ch2s      — sau ch2d, trước ch2e
//   ch2t, ch2u      — sau ch2h, trước ch2i
//   ch2v, ch2w      — sau ch2l, trước ch2m
//   ch2x            — sau ch2o, trước ch2p
//   ch2y, ch2z      — sau ch2p, trước ch3
//   ch3p, ch3q      — sau ch3, trước ch3a
//   ch3r            — sau ch3b, trước ch3c
//   ch3s            — sau ch3g, trước ch3h
//   ch3t            — sau ch3j, trước ch3k
//   ch3u, ch3v      — sau ch3n, trước ch3o
import { PAL } from '../../rig/character.js';

export const SHOTS_A = [
  // ——— chương 1: đầu ta rảnh ra thế nào (phần viết sau) ———
  { n: 'ch1m', at: 'c1_19', off: -.2, beat: 'talk', line: 'c1_19',
    keys: [[0, 'flat'], ['w', 10, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 520, title: '47% SỐ LẦN BỊ HỎI', sub: 'mỗi ngày của bạn có hai phần',
      lines: [{ t: 'lúc ta đang làm việc thật sự', at: 'c1_19', k: 7, col: PAL.cyan.f },
        { t: 'không chỉ lúc ngồi không', at: 'c1_19', k: 14, col: PAL.red.f },
        { t: 'phần có mặt', at: 'c1_20', k: 9, col: PAL.muted },
        { t: 'phần thật sự ở đó', at: 'c1_20', k: 13, col: PAL.green.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker'], [2.8, 'marker']] },

  { n: 'ch1n', at: 'c1_21', off: -.2, beat: 'bars', line: 'c1_21',
    title: 'ĐẦU ÍT ĐI LANG THANG NHẤT KHI NÀO', max: 1, top: 340,
    items: [{ label: 'làm việc dễ', sub: 'nhiều chỗ để đi', v: 1, col: PAL.red.f, num: 'lang thang nhiều' },
      { label: 'làm việc khó', sub: 'không còn chỗ nào trống', v: .15, col: PAL.green.f, num: 'ít đi' }],
    pip: true, pipE: 'determined',
    ev: () => [[0, 'pop'], [0.4, 'rise'], [1.2, 'rise'], [1.8, 'ting']] },

  { n: 'ch1o', at: 'c1_22', off: -.2, beat: 'talk', line: 'c1_22',
    keys: [[0, 'thinking'], ['w', 9, 'determined']],
    card: { x: 560, y: 470, w: 860, h: 400, title: 'VIỆC DỄ, VIỆC KHÓ', sub: 'đầu rảnh thì đi đâu cũng được',
      lines: [{ t: 'đầu có nhiều chỗ để đi', at: 'c1_22', k: 3, col: PAL.red.f }, { t: 'không còn chỗ nào trống', at: 'c1_22', k: 12, col: PAL.green.f },] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker']] },

  { n: 'ch1p', at: 'c1_23', off: .6, beat: 'talk', line: 'c1_23',
    keys: [[0, 'thinking'], ['w', 13, 'determined']],
    card: { x: 560, y: 470, w: 860, h: 440, title: 'CÂU ĐÚNG HƠN LÀ', sub: '"hôm nay việc của tôi chưa đủ khó"',
      lines: [{ t: 'việc của tôi chưa đủ khó', at: 'c1_23', k: 19, col: PAL.cyan.f },
        { t: 'không nằm ở cách bạn ngồi', at: 'c1_24', k: 8, col: PAL.red.f },
        { t: 'mà ở việc bạn đang làm', at: 'c1_24', k: 14, col: PAL.green.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch1q', at: 'c1_13', off: 1.3, beat: 'talk', line: 'c1_13',
    keys: [[0, 'skeptical'], ['w', 9, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 400, title: 'KHÔNG AI TRẢ LỜI', sub: 'khi bạn hỏi "mình đang tập trung chứ?"',
      lines: [{ t: 'một việc hoàn toàn khác', at: 'c1_13', k: 16, col: PAL.cyan.f },
        { t: 'đầu ta không ngồi yên được', at: 'c1_14', k: 5, col: PAL.red.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker']] },

  { n: 'ch1r', at: 'c1_15', off: -.2, beat: 'talk', line: 'c1_15',
    keys: [[0, 'thinking'], ['w', 16, 'smile']],
    card: { x: 560, y: 470, w: 860, h: 400, title: 'LÚC ĐẦU RẢNH NHẤT', sub: 'không phải lúc ta kém tập trung nhất',
      lines: [{ t: 'là lúc ta tự do nhất', at: 'c1_15', k: 16, col: PAL.green.f },
        { t: 'tự do để đi đâu cũng được', at: 'c1_16', k: 5, col: PAL.red.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker']] },

  { n: 'ch1s', at: 'c1_17', off: 1.3, beat: 'talk', line: 'c1_17',
    keys: [[0, 'talk'], ['w', 12, 'determined']],
    card: { x: 560, y: 470, w: 860, h: 400, title: 'SÁU CHƯƠNG', sub: 'một câu hỏi nhỏ có sáu nhánh',
      lines: [{ t: 'đã trả tiền không ít', at: 'c1_17', k: 16, col: PAL.red.f },
        { t: 'một câu hỏi nhỏ có sáu nhánh', at: 'c1_18', k: 17, col: PAL.cyan.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker']] },

  // ——— chương 2: mỗi lần chuyển việc (phần viết sau) ———
  { n: 'ch2q', at: 'c2_18', off: -.2, beat: 'talk', line: 'c2_18',
    keys: [[0, 'skeptical'], ['w', 10, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 460, title: 'CHI PHÍ CHUYỂN ĐỔI', sub: 'cách người ta đo nó',
      lines: [{ t: 'chi phí chuyển đổi', at: 'c2_18', k: 6, col: PAL.cyan.f },
        { t: 'cắt ngang bằng một việc khác', at: 'c2_19', k: 14, col: PAL.red.f },
        { t: 'mất bao lâu để quay lại', at: 'c2_19', k: 24, col: PAL.hoodie.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch2r', at: 'c2_20', off: 0.7, beat: 'talk', line: 'c2_20',
    keys: [[0, 'flat'], ['w', 5, 'determined']],
    card: { x: 560, y: 470, w: 860, h: 460, title: 'MỘT QUÁ TRÌNH', sub: 'quay lại không phải là bấm công tắc',
      lines: [{ t: 'nó là một quá trình', at: 'c2_20', k: 13, col: PAL.cyan.f },
        { t: 'nó tốn thời gian', at: 'c2_20', k: 19, col: PAL.red.f },
        { t: 'một khoảng trống', at: 'c2_21', k: 14, col: PAL.red.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch2s', at: 'c2_22', off: 0.6, beat: 'strip', line: 'c2_22',
    title: 'MỘT NGÀY CỦA BẠN', blocks: [
      { w: 2, col: PAL.cyan.f, label: 'làm việc' }, { w: 1, col: '#2C3247' }, { w: 2, col: PAL.cyan.f },
      { w: 1, col: '#2C3247' }, { w: 2, col: PAL.hoodie.f, label: 'làm việc' }],
    gapLabel: 'khoảng trống', foot: 'nhiều lần bắt đầu hơn, không phải nhiều việc hơn',
    pip: true,
    ev: () => [[0, 'pop'], [0.4, 'rise'], [0.9, 'rise'], [1.4, 'rise'], [1.9, 'rise'], [2.4, 'rise']] },

  { n: 'ch2t', at: 'c2_23', off: -.2, beat: 'talk', line: 'c2_23',
    keys: [[0, 'flat'], ['w', 12, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 460, title: 'MỖI LẦN CHUYỂN', sub: 'đo xem mỗi lần chuyển tốn bao lâu',
      lines: [{ t: 'chuyển qua chuyển lại', at: 'c2_23', k: 12, col: PAL.cyan.f },
        { t: 'mỗi lần chuyển tốn bao lâu', at: 'c2_23', k: 23, col: PAL.cyan.f },
        { t: 'chậm thêm khoảng một giây', at: 'c2_24', k: 7, col: PAL.red.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch2u', at: 'c2_25', off: -.2, beat: 'myth', line: 'c2_25',
    head: 'CÂU HỎI ĐƯỢC HỎI NHIỀU',
    claim: 'LÀM NHIỀU VIỆC CÙNG LỤC',
    quote: '"làm nhiều việc cùng lúc cho năng suất cao hơn"',
    source: 'một câu tự thuyết phục, không phải kết quả đo',
    stamp: 'SAI', stampPx: 62, stampX: 1440, stampY: 760,
    pip: true,
    ev: () => [[0, 'paper'], [1.0, 'stamp']] },

  { n: 'ch2v', at: 'c2_26', off: -.2, beat: 'talk', line: 'c2_26',
    keys: [[0, 'skeptical'], ['w', 7, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 520, title: 'TỐC ĐỘ KHÔNG LUÔN TỐT', sub: 'một thí nghiệm năm 2005',
      lines: [{ t: 'lúc nào cũng là tốt', at: 'c2_26', k: 12, col: PAL.red.f },
        { t: 'làm xong nhanh hơn', at: 'c2_27', k: 14, col: PAL.cyan.f },
        { t: 'tự chấm là căng thẳng hơn', at: 'c2_27', k: 19, col: PAL.red.f },
        { t: 'áp lực thời gian nặng hơn', at: 'c2_27', k: 29, col: PAL.red.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker'], [2.8, 'marker']] },

  { n: 'ch2w', at: 'c2_28', off: 2.1, beat: 'talk', line: 'c2_28',
    keys: [[0, 'determined']],
    card: { x: 560, y: 470, w: 860, h: 380, title: '"LÀM NHANH HƠN"', sub: 'không phải cách lấy lại sự tập trung',
      lines: [{ t: 'đổi căng thẳng lấy tốc độ', at: 'c2_28', k: 17, col: PAL.red.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker']] },

  { n: 'ch2x', at: 'c2_29', off: -.2, beat: 'compare', line: 'c2_29',
    leftHead: 'TRÌ HOÃN', left: 'Sang một việc\ndễ chịu hơn',
    rightHead: 'CHUYỂN VIỆC', right: 'Cùng một cơ chế\nchỉ khác hướng',
    pip: true,
    ev: () => [[0, 'pop']] },

  { n: 'ch2y', at: 'c2_30', off: -.2, beat: 'money', line: 'c2_30',
    spent: 6, label: 'MỖI LẦN NHẢY SANG, BẠN TRẢ HAI KHOẢN',
    total: 'thời gian quay lại + phần chú ý còn vương ở việc cũ',
    ev: () => [[0, 'pop'], [0.4, 'ting'], [0.9, 'ting'], [1.4, 'ting'], [1.9, 'ting'], [2.4, 'ting'], [2.9, 'ting']] },

  { n: 'ch2z', at: 'c2_31', off: -.2, beat: 'talk', line: 'c2_31',
    keys: [[0, 'flat']],
    card: { x: 560, y: 470, w: 820, h: 340, title: 'MỘT NGÀY DÀI', sub: 'ít việc thật',
      lines: [{ t: 'chứa rất ít việc thật', at: 'c2_31', k: 9, col: PAL.red.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker']] },

  // ——— chương 3: chiếc điện thoại (phần viết sau) ———
  { n: 'ch3p', at: 'c3_17', off: -.2, beat: 'stat', line: 'c3_17',
    num: '47', unit: 'giây', label: 'trung bình trên một màn hình', col: PAL.cyan.f, px: 170,
    note: 'hơn 270 lần chuyển ứng dụng một ngày',
    pip: true, pipE: 'surprised',
    ev: () => [[0, 'pop'], [0.3, 'rise'], [0.9, 'ting']] },

  { n: 'ch3q', at: 'c3_18', off: -.2, beat: 'talk', line: 'c3_18',
    keys: [[0, 'thinking'], ['w', 6, 'determined']],
    card: { x: 560, y: 470, w: 820, h: 400, title: 'CÁI TỐN KÉM', sub: 'không phải cái bạn nhìn',
      lines: [{ t: 'cái tốn kém', at: 'c3_18', k: 7, col: PAL.cyan.f },
        { t: 'mà là cái bạn bỏ dở', at: 'c3_18', k: 15, col: PAL.red.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker']] },

  { n: 'ch3r', at: 'c3_19', off: 0.8, beat: 'talk', line: 'c3_19',
    keys: [[0, 'skeptical'], ['w', 9, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 460, title: 'CÁI GIÁ', sub: 'không phải thời gian nhìn',
      lines: [{ t: 'chỉ nhìn nhanh thôi', at: 'c3_19', k: 7, col: PAL.muted },
        { t: 'không nằm ở thời gian nhìn', at: 'c3_20', k: 4, col: PAL.red.f },
        { t: 'nó nằm ở chỗ quay lại', at: 'c3_20', k: 10, col: PAL.hoodie.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch3s', at: 'c3_21', off: -.2, beat: 'talk', line: 'c3_21',
    keys: [[0, 'annoyed'], ['w', 14, 'talk']],
    card: { x: 560, y: 470, w: 860, h: 460, title: 'THỦ PHẠM THỨ HAI', sub: 'chỉ cần một thứ thú vị hơn',
      lines: [{ t: 'bàn làm việc cũng là thủ phạm', at: 'c3_21', k: 14, col: PAL.red.f },
        { t: 'tay bạn sẽ tự tìm nó', at: 'c3_22', k: 10, col: PAL.cyan.f },
        { t: 'thú vị hơn việc đang làm', at: 'c3_23', k: 16, col: PAL.cyan.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch3t', at: 'c3_24', off: 1.2, beat: 'phone', line: 'c3_24', dur: 8,
    notifs: [{ t: 'người nhắn tin', at: null, dot: PAL.red.f }, { t: 'một ứng dụng', at: null, col: '#2C3247', dot: PAL.muted }],
    counter: { t: 'NGƯỜI', sub: 'nó có mặt người', at: 0, col: PAL.red.f },
    ev: () => [[0, 'pop'], [0.5, 'ting']] },

  { n: 'ch3u', at: 'c3_25', off: -.2, beat: 'talk', line: 'c3_25',
    keys: [[0, 'tired']],
    card: { x: 560, y: 470, w: 860, h: 440, title: 'TỰ MỞ CÁNH CỬA', sub: 'không cần thông báo nào',
      lines: [{ t: 'tự mở', at: 'c3_25', k: 8, col: PAL.red.f },
        { t: 'lướt xuống một chút', at: 'c3_25', k: 10, col: PAL.cyan.f },
        { t: 'lại lướt xuống một chút nữa', at: 'c3_25', k: 15, col: PAL.cyan.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker']] },

  { n: 'ch3v', at: 'c3_26', off: 1.3, beat: 'talk', line: 'c3_26',
    keys: [[0, 'thinking']],
    card: { x: 560, y: 470, w: 860, h: 520, title: 'MỘT THÓI QUEN NỮA', sub: 'lúc chờ thì đầu rảnh nhất',
      lines: [{ t: 'tay không biết để đâu', at: 'c3_26', k: 12, col: PAL.cyan.f },
        { t: 'đầu thì rảnh', at: 'c3_26', k: 18, col: PAL.cyan.f },
        { t: 'lúc đầu rảnh nhất trong ngày', at: 'c3_27', k: 3, col: PAL.hoodie.f },
        { t: 'một việc nhỏ để làm', at: 'c3_28', k: 8, col: PAL.green.f }] },
    ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker'], [2.0, 'marker'], [2.8, 'marker']] },
];
