// Bảng cảnh của tập 03 — "Tại sao ta không tập trung được?".
import { PAL } from '../../../../rig/character.js';
import { SEQ } from './timeline.js';
import { SHOTS_A } from './shots_a.js';
import { SHOTS_B } from './shots_b.js';
// Mỗi cảnh: { n (tên), at (câu neo), beat (loại hình), ...tham số, ev (sự kiện âm thanh) }.
// `at` là câu mà cảnh bắt đầu; cảnh mở trước câu đó khoảng 0,3 giây (off) để hình kịp ngồi xuống.
// Mọi mốc thời gian bên trong một cảnh lấy từ C.w(câu, số thứ tự từ) — tức là đúng lúc giọng đọc tới từ đó.
export function buildShots(C) {
  const { L, w } = C;
  const at = (id, off = -.3) => L[id].t0 + off;
  const am = (id, k) => w(id, k);
  const M = cue => [[0, 'music', { cue }]];

  const BASE = [
    // ——— mở đầu: đầu bạn đi nơi khác ———
    { n: 'cold', at: 'hook', off: -1.2, beat: 'head', line: 'hook',
      thoughts: ['bữa trưa', 'tin nhắn', 'việc khác'],
      label: 'bạn không hề biết mình vừa nghĩ điều đó',
      battery: { x: 300, y: 400, w: 260, from: 1, to: .2, dur: 6 },
      ev: () => [[1.2, 'music', { cue: 'A' }], [1.4, 'tick'], [2.4, 'tick'], [3.4, 'tick'], [4.4, 'tick'], [5.4, 'tick'], [6.4, 'tick']] },

    { n: 'cold2', at: 'hook2', off: 0.1, beat: 'talk', line: 'hook2',
      keys: [[0, 'thinking'], ['w', 6, 'talk']],
      card: { x: 560, y: 470, w: 700, h: 460, title: 'ĐẦU BẠN', sub: 'đang ở đâu lúc này?',
        lines: [{ t: 'tin nhắn', at: 'hook2', k: 4 }, { t: 'một câu hỏi không liên quan', at: 'hook2', k: 15, col: PAL.red.f   }] },
      ev: () => [[0, 'pop'], [0.2, 'marker'], [1.2, 'marker'], [2.2, 'marker']] },

    { n: 'cold3', at: 'hook3', off: 1.1, beat: 'talk', line: 'hook3',
      keys: [[0, 'neutral'], ['w', 4, 'talk']],
      card: { x: 560, y: 470, w: 700, h: 380, title: 'BẠN VẪN TƯỞNG', sub: 'mình đang tập trung',
        lines: [{ t: 'và vẫn hiểu', at: 'hook3', k: 6, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'thesis', at: 'hook4', off: -.2, beat: 'talk', line: 'hook4', tr: 'whip',
      keys: [[0, 'determined'], ['w', 3, 'talk']],
      card: { x: 560, y: 470, w: 760, h: 420, title: 'TẬP 03', sub: 'hai mươi phút',
        lines: [{ t: 'tại sao ta không', at: 'hook4', k: 4 }, { t: 'tập trung được?', at: 'hook4', k: 8, col: PAL.hoodie.f }] },
      ev: () => [[0, 'whoosh'], [0.1, 'pop'], [0.4, 'marker'], [1.4, 'marker']] },

    // ——— giới thiệu ———
    { n: 'intro', at: 'intro', off: -.3, beat: 'talk', line: 'intro',
      keys: [[0, 'happy'], ['w', 4, 'talk']],
      card: { x: 560, y: 470, w: 760, h: 470, title: 'TRẠM NGHĨ NHIỀU', sub: 'kênh tâm lý học bằng hoạt hình',
        lines: [{ t: 'tập ba', at: 'intro', k: 5, col: PAL.hoodie.f }] },
      ev: () => [[0, 'pop'], [0.3, 'music', { cue: 'B' }], [0, 'amb', { kind: 'room', dur: 1260 }]] },

    { n: 'intro2', at: 'intro2', off: 0.0, beat: 'talk', line: 'intro2',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 760, h: 420, title: 'TẬP DÀI', sub: 'một câu hỏi không vừa trong một phút trăm',
        lines: [{ t: 'một câu hỏi về sự tập trung', at: 'intro2', k: 8, col: PAL.cyan.f   }] },
      ev: () => [[0, 'pop']] },

    { n: 'intro3', at: 'intro3', off: -0.1, beat: 'phone', line: 'intro3', dur: 7,
      notifs: [{ t: 'bạn không nghe thấy mình gọi', at: null, dot: PAL.red.f }, { t: 'nhưng bạn vẫn tin là mình tập trung', at: null, col: '#2C3247', dot: PAL.muted }],
      counter: { t: 'tập trung?', sub: 'một câu hỏi cho cả tập', at: 0, col: PAL.hoodie.f },
      ev: () => [[0, 'pop'], [0.6, 'ting']] },

    { n: 'intro4', at: 'intro4', off: -.2, beat: 'talk', line: 'intro4',
      keys: [[0, 'determined'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 760, h: 380, title: 'HÔM NAY', sub: 'mình sẽ nói rõ chỗ nào sai',
        lines: [{ t: 'chỗ nào sai', at: 'intro4', k: 8, col: PAL.red.f }] },
      ev: () => [[0, 'pop']] },

    // ——— chương 1: đầu ta rảnh 47% ———
    { n: 'ch1', at: 'c1_1', off: -.4, beat: 'chapter', line: 'c1_1', tr: 'iris',
      n2: '1', title: 'ĐẦU TA RẢNH RA THẾ NÀO', sub: 'bảy mươi phần trăm số thức',
      ev: () => [[0, 'pop'], [0.2, 'music', { cue: 'C' }]] },

    { n: 'ch1a', at: 'c1_1', off: 4.2, beat: 'talk', line: 'c1_1',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 760, h: 440, title: 'MỘT THÍ NGHIỆM', sub: 'hai nhà tâm lý học, năm 2010',
        lines: [{ t: 'trên điện thoại', at: 'c1_1', k: 25, col: PAL.cyan.f   }, { t: 'suốt mấy tuần liền', at: 'c1_1', k: 27, col: PAL.hoodie.f  }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch1b', at: 'c1_2', off: 2.0, beat: 'phone', line: 'c1_2', dur: 8,
      notifs: [{ t: 'bạn đang nghĩ gì lúc này?', at: null, dot: PAL.cyan.f }, { t: 'một câu duy nhất', at: null, col: '#2C3247', dot: PAL.muted }],
      counter: { t: 'BẠN ĐANG NGHĨ GÌ?', sub: 'điện thoại hỏi, không báo trước', at: 0, col: PAL.cyan.f },
      ev: () => [[0, 'pop'], [0.5, 'ting']] },

    { n: 'ch1c', at: 'c1_3', off: 0.9, beat: 'talk', line: 'c1_3',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 760, h: 420, title: 'CHUÔNG NGẪU NHIÊN', sub: 'chín mươi ba chiếc, không chuông báo trước',
        lines: [{ t: 'đầu bị hỏi bỗng nhiên', at: 'c1_3', k: 8, col: PAL.hoodie.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch1d', at: 'c1_4', off: -.2, beat: 'stat', line: 'c1_4',
      num: '46,9%', unit: 'số lần bị hỏi', label: 'đầu người ta đang nghĩ về chuyện khác', col: PAL.hoodie.f, px: 160,
      pip: true, pipE: 'excited',
      ev: () => [[0, 'pop'], [0.3, 'rise'], [0.8, 'ting']] },

    { n: 'ch1e', at: 'c1_5', off: 1.1, beat: 'talk', line: 'c1_5',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 760, h: 400, title: 'KHÔNG PHẢI', sub: 'bảy mươi phần trăm thời gian ngồi không',
        lines: [{ t: 'những lần bị hỏi', at: 'c1_5', k: 14, col: PAL.cyan.f  }] },
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    { n: 'ch1f', at: 'c1_6', off: 0.5, beat: 'head', line: 'c1_6',
      thoughts: ['làm việc', 'ngồi yên', 'nghĩ linh tinh'],
      label: 'cơ thể có mặt. đầu thì không.',
      ev: () => [[0, 'pop'], [0.4, 'boing']] },

    { n: 'ch1g', at: 'c1_7', off: .5, beat: 'talk', line: 'c1_7',
      keys: [[0, 'surprised'], ['w', 10, 'talk']],
      card: { x: 560, y: 470, w: 760, h: 420, title: 'ĐIỀU LẠ', sub: 'lúc lang thang không phải lúc khó chịu',
        lines: [{ t: 'còn vui hơn lúc đang làm việc', at: 'c1_7', k: 8, col: PAL.green.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch1h', at: 'c1_8', off: 1.3, beat: 'talk', line: 'c1_8',
      keys: [[0, 'flat'], ['w', 12, 'determined']],
      card: { x: 560, y: 470, w: 800, h: 440, title: 'KẾT LUẬN KHÓ CHỊU', sub: 'một bộ não khỏe mạnh',
        lines: [{ t: 'là trạng thái bình thường', at: 'c1_8', k: 12, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop'], [0.5, 'marker'], [1.6, 'marker']] },

    { n: 'ch1i', at: 'c1_9', off: 0.8, beat: 'talk', line: 'c1_9',
      keys: [[0, 'determined']],
      card: { x: 560, y: 470, w: 800, h: 400, title: 'VẤN ĐỀ KHÔNG PHẢI', sub: 'đầu ta hay đi lang thang',
        lines: [{ t: 'đúng lúc không nên đi', at: 'c1_9', k: 19, col: PAL.red.f  }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch1j', at: 'c1_10', off: 0.9, beat: 'talk', line: 'c1_10',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 800, h: 420, title: 'Ý CHÍ', sub: 'là phần cuối của câu chuyện',
        lines: [{ t: 'không phải phần đầu', at: 'c1_10', k: 12, col: PAL.hoodie.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch1k', at: 'c1_11', off: -.2, beat: 'talk', line: 'c1_11',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 800, h: 380, title: 'THỨ TỰ THẬT', sub: 'mình sẽ đi theo thứ tự này',
        lines: [{ t: 'rảnh ra', at: 'c1_11', k: 4 }, { t: 'tốn bao nhiêu', at: 'c1_11', k: 8, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch1l', at: 'c1_12', off: -.2, beat: 'talk', line: 'c1_12',
      keys: [[0, 'smile'], ['w', 6, 'talk']],
      card: { x: 560, y: 470, w: 800, h: 380, title: 'CUỐI TẬP', sub: 'sáu việc cụ thể, làm được ngay',
        lines: [{ t: 'không cần mua gì', at: 'c1_12', k: 10, col: PAL.green.f }] },
      ev: () => [[0, 'pop']] },

    // ——— chương 2: chuyển việc có giá ———
    { n: 'ch2', at: 'c2_1', off: 0.6, beat: 'chapter', line: 'c2_1', tr: 'iris',
      n2: '2', title: 'MỖI LẦN CHUYỂN VIỆC', sub: 'não phải trả tiền để quay lại',
      ev: () => [[0, 'pop'], [0.2, 'music', { cue: 'E' }]] },

    { n: 'ch2a', at: 'c2_2', off: 1.2, beat: 'talk', line: 'c2_2',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 780, h: 440, title: 'NĂM 2005', sub: '24 nhân viên, hơn 700 giờ quan sát',
        lines: [{ t: 'bấm giây bên cạnh', at: 'c2_2', k: 10, col: PAL.cyan.f  }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch2b', at: 'c2_3', off: -.2, beat: 'stat', line: 'c2_3',
      num: '11', unit: 'phút', label: 'một việc liên tục: mười một phút bốn giây', col: PAL.cyan.f, px: 170,
      pip: true, pipE: 'surprised',
      ev: () => [[0, 'pop'], [0.3, 'rise'], [0.9, 'ting']] },

    { n: 'ch2c', at: 'c2_4', off: -.2, beat: 'talk', line: 'c2_4',
      keys: [[0, 'skeptical'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 780, h: 400, title: 'MƯỜI MỘT PHÚT', sub: 'độ dài của một lần tập trung',
        lines: [{ t: 'hơn một nửa số đoạn đó bị ngắt', at: 'c2_4', k: 4, col: PAL.muted   }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch2d', at: 'c2_5', off: 1.1, beat: 'stat', line: 'c2_5',
      num: '25', unit: 'phút', label: 'để quay lại việc bị gián đoạn', col: PAL.red.f, px: 170,
      note: 'thời gian việc cũ nằm chờ',
      pip: true, pipE: 'worried',
      ev: () => [[0, 'pop'], [0.3, 'rise'], [0.9, 'ting']] },

    { n: 'ch2e', at: 'c2_6', off: -.2, beat: 'talk', line: 'c2_6',
      keys: [[0, 'shocked']],
      card: { x: 560, y: 470, w: 700, h: 340, title: 'HƠN HAI MƯỜI PHÚT', sub: 'không phải vài giây như mình tưởng',
        lines: [] },
      ev: () => [[0, 'pop'], [0.2, 'thump']] },

    { n: 'ch2f', at: 'c2_7', off: -.2, beat: 'talk', line: 'c2_7',
      keys: [[0, 'flat'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 800, h: 440, title: 'CẨN TRỌNG', sub: 'quan sát thực địa: 24 người, hơn 700 giờ',
        lines: [{ t: 'không phải luật thiên hạ', at: 'c2_7', k: 5, col: PAL.red.f }, { t: 'nhiều nhóm khác lặp lại', at: 'c2_7', k: 14, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch2g', at: 'c2_8', off: -.2, beat: 'talk', line: 'c2_8',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 800, h: 420, title: 'CHI PHÍ CHUẨN BỊ', sub: 'thời gian não nạp lại công việc',
        lines: [{ t: 'trước khi làm được thật sự', at: 'c2_8', k: 10, col: PAL.hoodie.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch2h', at: 'c2_9', off: -.2, beat: 'bars', line: 'c2_9',
      title: 'QUAY LẠI LUÔN TỐN MỘT KHOẢN', max: 1, top: 340,
      items: [{ label: 'khoảng 1 giây', sub: 'mỗi lần chuyển nhiệm vụ', v: .18, col: PAL.muted }, { label: '11 phút', sub: 'một việc liên tục', v: .55, col: PAL.cyan.f }, { label: '25 phút', sub: 'để quay lại việc cũ', v: 1, col: PAL.red.f }],
      pip: true,
      ev: () => [[0, 'pop'], [0.4, 'rise'], [1.2, 'rise'], [2.0, 'rise'], [2.6, 'ting']] },

    { n: 'ch2i', at: 'c2_10', off: 0.0, beat: 'talk', line: 'c2_10',
      keys: [[0, 'determined'], ['w', 10, 'talk']],
      card: { x: 560, y: 470, w: 820, h: 460, title: 'HAI MƯỜI PHÚT', sub: 'mỗi lần, bằng thứ bạn tưởng là phần thưởng',
        lines: [{ t: 'mở mạng kiểm tra có gì mới', at: 'c2_10', k: 4, col: PAL.red.f }] },
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    { n: 'ch2j', at: 'c2_11', off: -.2, beat: 'compare', line: 'c2_11',
      leftHead: 'SAU KHI CHUYỂN', left: 'Một phần sự chú ý\nvẫn dính ở việc cũ',
      rightHead: 'TÊN HIỆU ỨNG', right: 'Vết chú ý\nattention residue',
      stamp: 'VẾT', stampAt: null, stampX: 600, stampY: 700, stampPx: 76,
      pip: true,
      ev: () => [[0, 'pop'], [1.2, 'stamp']] },

    { n: 'ch2k', at: 'c2_12', off: -.2, beat: 'strip', line: 'c2_12',
      title: 'HAI CÁI ĐẦU, HAI CÁI MÀN HÌNH', blocks: [
        { w: 3, col: PAL.cyan.f, label: 'bảng tính cũ' }, { w: 1, col: '#2C3247' }, { w: 3, col: PAL.hoodie.f, label: 'màn hình mới' }],
      gapLabel: 'vết chú ý', foot: 'bạn nhìn màn hình mới, đầu vẫn ở bảng tính cũ',
      pip: true,
      ev: () => [[0, 'pop'], [0.4, 'rise'], [0.9, 'rise'], [1.4, 'rise']] },

    { n: 'ch2l', at: 'c2_13', off: 0.9, beat: 'talk', line: 'c2_13',
      keys: [[0, 'annoyed'], ['w', 4, 'talk']],
      card: { x: 560, y: 470, w: 780, h: 380, title: 'BẢNG TÍNH CŨ', sub: 'không đợi bạn. cũng không giảm hạn.',
        lines: [] },
      ev: () => [[0, 'pop']] },

    { n: 'ch2m', at: 'c2_14', off: -.2, beat: 'stat', line: 'c2_14',
      num: '2,26', unit: 'mặt việc', label: 'đã đi qua trước khi quay lại việc cũ', col: PAL.hoodie.f, px: 160,
      note: 'nghiên cứu năm 2005',
      pip: true, pipE: 'tired',
      ev: () => [[0, 'pop'], [0.3, 'rise'], [0.9, 'ting']] },

    { n: 'ch2n', at: 'c2_15', off: -.2, beat: 'strip', line: 'c2_15',
      title: 'MỘT NGÀY LÀM VIỆC KHÔNG PHẢI MỘT DÒNG CHẢY', blocks: [
        { w: 1, col: PAL.cyan.f }, { w: 2, col: '#2C3247' }, { w: 1, col: PAL.hoodie.f }, { w: 2, col: '#2C3247' }, { w: 1, col: PAL.cyan.f }, { w: 2, col: '#2C3247' }],
      gapLabel: 'giá', foot: 'một đống những đoạn ngắn cắt vụn, mỗi đoạn có giá riêng',
      pip: true,
      ev: () => [[0, 'pop'], [0.3, 'rise'], [0.7, 'rise'], [1.1, 'rise'], [1.5, 'rise'], [1.9, 'rise'], [2.3, 'rise']] },

    { n: 'ch2o', at: 'c2_16', off: -.2, beat: 'talk', line: 'c2_16',
      keys: [[0, 'thinking']],
      card: { x: 560, y: 470, w: 800, h: 400, title: 'TRÌ HOÃN CŨNG LÀ CHUYỂN VIỆC', sub: 'tập trước của mình',
        lines: [{ t: 'cơ thể còn ngồi đó, đầu đã đi', at: 'c2_16', k: 10, col: PAL.violet.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch2p', at: 'c2_17', off: -.2, beat: 'talk', line: 'c2_17',
      keys: [[0, 'determined'], ['w', 10, 'talk']],
      card: { x: 560, y: 470, w: 820, h: 420, title: 'CƠ THỂ NGỒI YÊN', sub: 'không có nghĩa não đang làm việc',
        lines: [{ t: 'cơ thể ngồi yên', at: 'c2_17', k: 20, col: PAL.cyan.f  }] },
      ev: () => [[0, 'pop']] },

    // ——— chương 3: chiếc điện thoại ———
    { n: 'ch3', at: 'c3_1', off: 0.6, beat: 'chapter', line: 'c3_1', tr: 'iris',
      n2: '3', title: 'CHIẾC ĐIỆN THOẠI', sub: 'đặt cạnh bàn phím',
      ev: () => [[0, 'pop'], [0.2, 'music', { cue: 'D' }]] },

    { n: 'ch3a', at: 'c3_2', off: 1.1, beat: 'phone', line: 'c3_2', dur: 8,
      notifs: [{ t: 'một thí nghiệm rất khó chịu', at: null, dot: PAL.red.f }],
      counter: { t: '2015', sub: 'hai nhóm người tham gia', at: 0, col: PAL.cyan.f },
      ev: () => [[0, 'pop']] },

    { n: 'ch3b', at: 'c3_3', off: -.2, beat: 'talk', line: 'c3_3',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 800, h: 440, title: 'MỘT NHIỆM VỤ', sub: 'đòi hỏi chú ý',
        lines: [{ t: 'điện thoại của họ rung lên', at: 'c3_3', k: 12, col: PAL.red.f   }, { t: 'không hề chạm vào máy', at: 'c3_3', k: 21, col: PAL.cyan.f  }] },
      ev: () => [[0, 'pop'], [0.4, 'marker'], [1.4, 'marker']] },

    { n: 'ch3c', at: 'c3_4', off: 1.5, beat: 'phone', line: 'c3_4', dur: 7,
      notifs: [{ t: 'rung — không ai chạm vào', at: null, dot: PAL.red.f }],
      counter: { t: 'CHỈ TIẾNG RUNG', sub: 'không cần chạm vào máy', at: 0, col: PAL.red.f },
      ev: () => [[0, 'pop'], [0.4, 'pop']] },

    { n: 'ch3d', at: 'c3_5', off: 1.2, beat: 'compare', line: 'c3_5',
      leftHead: 'CÓ TIẾNG RUNG', left: 'Không ai chạm\nvào máy',
      rightHead: 'HIỆU SUẤT', right: 'Giảm rõ rệt',
      pip: true, pipE: 'worried',
      ev: () => [[0, 'pop'], [0.8, 'stamp']] },

    { n: 'ch3e', at: 'c3_6', off: -.2, beat: 'talk', line: 'c3_6',
      keys: [[0, 'flat'], ['w', 6, 'talk']],
      card: { x: 560, y: 470, w: 800, h: 400, title: 'MỨC NHIỄU', sub: 'tương đương với lúc cầm máy lên',
        lines: [] },
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    { n: 'ch3f', at: 'c3_7', off: -.2, beat: 'talk', line: 'c3_7',
      keys: [[0, 'skeptical']],
      card: { x: 560, y: 470, w: 820, h: 440, title: 'NÓI RÕ', sub: 'đừng nói quá',
        lines: [{ t: 'một nhiệm vụ ngắn trong phòng thí nghiệm', at: 'c3_7', k: 5, col: PAL.hoodie.f  }, { t: 'số người tham gia không nhiều', at: 'c3_7', k: 14, col: PAL.cyan.f  }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch3g', at: 'c3_8', off: 1.5, beat: 'talk', line: 'c3_8',
      keys: [[0, 'determined'], ['w', 10, 'talk']],
      card: { x: 560, y: 470, w: 820, h: 420, title: 'NÓ KHÔNG PHÁ HỎNG TRÍ NHỚ', sub: 'một tiếng rung đủ để hỏng việc đang làm',
        lines: [{ t: 'một tiếng rung thôi', at: 'c3_8', k: 10, col: PAL.red.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch3h', at: 'c3_9', off: -.2, beat: 'talk', line: 'c3_9',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 820, h: 440, title: 'NGHIÊN CỨU 2016', sub: 'hai tuần, điện thoại mang theo',
        lines: [{ t: 'mang máy theo suốt hai tuần', at: 'c3_9', k: 14, col: PAL.cyan.f  }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch3i', at: 'c3_10', off: 2.1, beat: 'bars', line: 'c3_10',
      title: 'SỐ LẦN CHUYỂN SANG VIỆC KHÁC', max: 1, top: 340,
      items: [{ label: 'có thông báo', sub: 'bị gián đoạn nhiều hơn', v: 1, col: PAL.red.f, num: 'mất chú ý nhiều hơn' }, { label: 'không thông báo', sub: 'ít gián đoạn hơn', v: .45, col: PAL.green.f }],
      pip: true, pipE: 'excited',
      ev: () => [[0, 'pop'], [0.4, 'rise'], [1.2, 'rise'], [1.8, 'ting']] },

    { n: 'ch3j', at: 'c3_11', off: -.2, beat: 'phone', line: 'c3_11', dur: 8,
      notifs: [{ t: 'một cái răng nhỏ', at: null, dot: PAL.red.f }, { t: 'một cánh cửa mở ra khỏi phòng', at: null, col: '#2C3247', dot: PAL.muted }],
      counter: { t: 'CỬA', sub: 'rồi đóng lại', at: 0, col: PAL.red.f },
      ev: () => [[0, 'pop'], [0.4, 'pop']] },

    { n: 'ch3k', at: 'c3_12', off: -.2, beat: 'talk', line: 'c3_12',
      keys: [[0, 'determined']],
      card: { x: 560, y: 470, w: 820, h: 400, title: 'BẠN KHÔNG CẦN THÔNG BÁO', sub: 'để mở cánh cửa đó',
        lines: [{ t: 'chính người xem đã tự mở', at: 'c3_12', k: 8, col: PAL.hoodie.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch3l', at: 'c3_13', off: -.2, beat: 'talk', line: 'c3_13',
      keys: [[0, 'thinking'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 820, h: 420, title: 'CẦM LÊN KHÔNG ĐỌC GÌ', sub: 'để có một việc gì đó để làm',
        lines: [{ t: 'một việc gì đó để làm', at: 'c3_13', k: 10, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch3m', at: 'c3_14', off: -.2, beat: 'talk', line: 'c3_14',
      keys: [[0, 'flat']],
      card: { x: 560, y: 470, w: 820, h: 400, title: 'MỖI LẦN LẠI DỄ HƠN MỘT CHÚT', sub: 'ta đánh dấu một cái mốc',
        lines: [{ t: 'ta đánh dấu một cái mốc', at: 'c3_14', k: 6, col: PAL.hoodie.f  }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch3n', at: 'c3_15', off: -.2, beat: 'talk', line: 'c3_15',
      keys: [[0, 'determined'], ['w', 6, 'talk']],
      card: { x: 560, y: 470, w: 820, h: 400, title: 'ĐÓ KHÔNG PHẢI LƯỜI', sub: 'thói quen không cần lý do',
        lines: [{ t: 'không cần lý do để tiếp tục', at: 'c3_15', k: 8, col: PAL.red.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch3o', at: 'c3_16', off: -.2, beat: 'talk', line: 'c3_16',
      keys: [[0, 'thinking'], ['w', 12, 'determined']],
      card: { x: 560, y: 470, w: 860, h: 440, title: 'CÂU HỎI ĐÚNG', sub: 'không phải "làm sao để không cầm điện thoại"',
        lines: [{ t: 'mỗi lần cầm lên, ta đang tìm cái gì?', at: 'c3_16', k: 12, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop'], [0.5, 'marker']] },

    // ——— chương 4: não không lười ———
    { n: 'ch4', at: 'c4_1', off: -.4, beat: 'chapter', line: 'c4_1', tr: 'iris',
      n2: '4', title: 'NÃO KHÔNG LƯỜI', sub: 'nó chỉ hỏi việc này còn đáng làm không',
      ev: () => [[0, 'pop'], [0.2, 'music', { cue: 'B' }]] },

    { n: 'ch4a', at: 'c4_1', off: 4.2, beat: 'talk', line: 'c4_1',
      keys: [[0, 'annoyed'], ['w', 10, 'talk']],
      card: { x: 560, y: 470, w: 800, h: 400, title: 'HAY LÀ', sub: 'do ta lười, do ta yếu, do ta thiếu kỷ luật',
        lines: [] },
      ev: () => [[0, 'pop']] },

    { n: 'ch4b', at: 'c4_2', off: 1.1, beat: 'talk', line: 'c4_2',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 820, h: 420, title: 'BỘ NÃO NHƯ MÁY TÍNH', sub: 'có giới hạn',
        lines: [{ t: 'bộ não như một máy tính có giới hạn', at: 'c4_2', k: 18, col: PAL.hoodie.f  }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch4c', at: 'c4_3', off: 1.2, beat: 'compare', line: 'c4_3',
      leftHead: 'CÁCH CŨ', left: 'Bạn có cố gắng\nkhông?',
      rightHead: 'CÁCH MỚI', right: 'Việc này còn\nđáng làm không?',
      stamp: 'HỎI SAI', stampAt: null, stampX: 600, stampY: 700, stampPx: 62,
      pip: true,
      ev: () => [[0, 'pop'], [1.4, 'stamp']] },

    { n: 'ch4d', at: 'c4_4', off: 0.9, beat: 'stat', line: 'c4_4',
      num: 'KHÔNG', unit: 'đáng, trong khoảnh khắc đó', label: 'câu trả lời thường là vậy', col: PAL.red.f, px: 110,
      pip: true, pipE: 'flat',
      ev: () => [[0, 'pop'], [0.3, 'rise']] },

    { n: 'ch4e', at: 'c4_5', off: 0.3, beat: 'talk', line: 'c4_5',
      keys: [[0, 'determined']],
      card: { x: 560, y: 470, w: 820, h: 400, title: 'NÃO KHÔNG GHÉT VIỆC', sub: 'nó chỉ ghét khi giá phải trả không chắc chắn',
        lines: [{ t: 'không chắc chắn', at: 'c4_5', k: 10, col: PAL.red.f }] },
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    { n: 'ch4f', at: 'c4_6', off: -.2, beat: 'talk', line: 'c4_6',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 840, h: 420, title: 'TƯƠNG LAI XA LUÔN BỊ CHIẾT KHẤU', sub: 'một việc xong ngay được trả đủ',
        lines: [{ t: 'xong ngay bây giờ được trả đủ', at: 'c4_6', k: 8, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch4g', at: 'c4_7', off: -.2, beat: 'compare', line: 'c4_7',
      leftHead: 'XONG NGAY', left: 'Cùng một việc\nđược trả đủ',
      rightHead: 'XONG SAU MỘT TIẾNG', right: 'Cùng việc đó\nkhông còn đáng',
      pip: true,
      ev: () => [[0, 'pop']] },

    { n: 'ch4h', at: 'c4_8', off: -.2, beat: 'talk', line: 'c4_8',
      keys: [[0, 'determined'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 840, h: 420, title: 'CẢ VIỆC TỐT CŨNG BỊ TRÌ', sub: 'vì não không thấy lợi ích ở trước mặt',
        lines: [{ t: 'không thấy lợi ích ở ngay trước mặt', at: 'c4_8', k: 10, col: PAL.red.f }] },
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    { n: 'ch4i', at: 'c4_9', off: -.2, beat: 'talk', line: 'c4_9',
      keys: [[0, 'surprised'], ['w', 8, 'determined']],
      card: { x: 560, y: 470, w: 840, h: 400, title: 'NGƯỢC HẲN', sub: 'một điều mọi người nghĩ ngược',
        lines: [{ t: 'khi chán, ta thường chọn việc khó hơn', at: 'c4_9', k: 11, col: PAL.green.f  }] },
      ev: () => [[0, 'pop'], [0.2, 'ting']] },

    { n: 'ch4j', at: 'c4_10', off: 0.7, beat: 'talk', line: 'c4_10',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 840, h: 440, title: 'BẮC KINH, 2023', sub: 'đo xem người ta chọn việc nào',
        lines: [{ t: 'khi rảnh', at: 'c4_10', k: 12 }, { t: 'và khi chán', at: 'c4_10', k: 14, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch4k', at: 'c4_11', off: 0.4, beat: 'bars', line: 'c4_11',
      title: 'NGƯỜI CHÁN CHỌN VIỆC KHÓ HƠN', max: 1, top: 340,
      items: [{ label: 'khi rảnh', sub: 'chọn việc dễ', v: .35, col: PAL.muted }, { label: 'khi chán', sub: 'chọn việc khó', v: 1, col: PAL.green.f, num: 'nhiều hơn ngẫu nhiên' }],
      pip: true, pipE: 'excited',
      ev: () => [[0, 'pop'], [0.4, 'rise'], [1.2, 'rise'], [1.8, 'ting']] },

    { n: 'ch4l', at: 'c4_12', off: -.2, beat: 'talk', line: 'c4_12',
      keys: [[0, 'flat'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 840, h: 400, title: 'CÁI TA GỌI LÀ LƯỜI', sub: 'có khi chỉ là một bộ não đang chán',
        lines: [{ t: 'tìm việc đáng bị làm', at: 'c4_12', k: 10, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch4m', at: 'c4_13', off: -.2, beat: 'talk', line: 'c4_13',
      keys: [[0, 'thinking']],
      card: { x: 560, y: 470, w: 840, h: 400, title: 'TẬP TRUNG YẾU', sub: 'có khi chỉ là việc đang dễ quá',
        lines: [{ t: 'nó không giữ được bạn', at: 'c4_13', k: 10, col: PAL.red.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch4n', at: 'c4_14', off: 0.7, beat: 'compare', line: 'c4_14',
      leftHead: 'MỆT KHI LÀM VIỆC KHÓ', left: 'cảm giác mệt',
      rightHead: 'TRỐNG KHI LÀM VIỆC DỄ', right: 'cảm giác trống',
      pip: true,
      ev: () => [[0, 'pop']] },

    { n: 'ch4o', at: 'c4_15', off: -.2, beat: 'talk', line: 'c4_15',
      keys: [[0, 'determined']],
      card: { x: 560, y: 470, w: 860, h: 420, title: 'NÃO LƯỜI KHI NÀO', sub: 'khi bạn không biết mình sẽ làm gì trong năm phút tới',
        lines: [{ t: 'không biết mình sẽ làm gì', at: 'c4_15', k: 10, col: PAL.red.f }] },
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    { n: 'ch4p', at: 'c4_16', off: -.2, beat: 'stat', line: 'c4_16',
      num: '4', unit: 'khối', label: 'trí nhớ làm việc giữ được khoảng bốn khối', col: PAL.cyan.f, px: 190,
      note: 'không phải mười bảy',
      pip: true, pipE: 'skeptical',
      ev: () => [[0, 'pop'], [0.3, 'rise'], [0.9, 'ting']] },

    // ——— chương 5: bác bỏ vết bầm thần kinh ———
    { n: 'ch5', at: 'c5_1', off: -.4, beat: 'chapter', line: 'c5_1', tr: 'iris',
      n2: '5', title: 'CON SỐ TÁM GIÂY', sub: 'một vết bầm thần kinh',
      ev: () => [[0, 'pop'], [0.2, 'music', { cue: 'F' }]] },

    { n: 'ch5a', at: 'c5_1', off: 4.2, beat: 'talk', line: 'c5_1',
      keys: [[0, 'skeptical'], ['w', 10, 'talk']],
      card: { x: 560, y: 470, w: 840, h: 400, title: 'CHẮC BẠN ĐÃ NGHE', sub: 'một câu nói quen thuộc',
        lines: [] },
      ev: () => [[0, 'pop']] },

    { n: 'ch5b', at: 'c5_2', off: 2.1, beat: 'myth', line: 'c5_2',
      head: 'BÁO CÁO TIẾP THỊ CỦA MICROSOFT CANADA, 2015',
      claim: 'BA CON SỐ TRÊN MỘT TRANG',
      quote: 'mười hai giây (2000), tám giây (2013), chín giây (cá vàng)',
      source: 'nguồn ghi trên slide: Statistic brain — không phải nghiên cứu',
      stamp: 'KHÔNG NGUỒN', stampPx: 54, stampX: 1440, stampY: 760,
      pip: true,
      ev: () => [[0, 'paper'], [1.0, 'stamp']] },

    { n: 'ch5c', at: 'c5_3', off: -.2, beat: 'myth', line: 'c5_3',
      head: 'TRANG SLIDE GỐC',
      claim: 'NGHIÊN CỨU THẬT CỦA BÁO CÁO',
      quote: '2.000 người khảo sát, 112 người đo EEG',
      source: 'không phép đo nào trong đó cho ra "tám giây"',
      stamp: 'NGUỒN', stampPx: 60, stampX: 1440, stampY: 760,
      ev: () => [[0, 'paper']] },

    { n: 'ch5d', at: 'c5_4', off: -.2, beat: 'talk', line: 'c5_4',
      keys: [[0, 'determined']],
      card: { x: 560, y: 470, w: 860, h: 440, title: 'CÁCH MỘT CON SỐ TRỞ THÀNH SỰ THẬT', sub: 'khi nó đi qua đủ nhiều miệng',
        lines: [{ t: 'rút ngắn thành', at: 'c5_4', k: 6, col: PAL.red.f  }, { t: 'lặp lại khắp nơi như một sự thật', at: 'c5_4', k: 18, col: PAL.cyan.f  }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch5e', at: 'c5_5', off: 1.2, beat: 'myth', line: 'c5_5',
      head: 'BẢN GỐC CÒN NÓI',
      claim: 'ĐỪNG NGẮT NGƯỜI TRÌNH BÀY',
      quote: 'nếu bạn cần thuyết trình bốn mươi phút, đừng ngắt người trình bày',
      source: 'nghĩa là tài liệu gốc không nói gì về tám giây',
      stamp: 'ĐÚNG', stampPx: 62, stampX: 1440, stampY: 760, col: PAL.green.f,
      pip: true,
      ev: () => [[0, 'paper'], [1.2, 'stamp']] },

    { n: 'ch5f', at: 'c5_6', off: -.2, beat: 'talk', line: 'c5_6',
      keys: [[0, 'determined'], ['w', 6, 'talk']],
      card: { x: 560, y: 470, w: 860, h: 400, title: 'CÂU ĐÓ', sub: 'do người khác thêm vào',
        lines: [{ t: 'do người khác thêm vào', at: 'c5_6', k: 10, col: PAL.red.f }] },
      ev: () => [[0, 'pop'] ] },

    { n: 'ch5g', at: 'c5_7', off: -.2, beat: 'talk', line: 'c5_7',
      keys: [[0, 'flat'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 860, h: 420, title: 'BÀI HỌC', sub: 'không chỉ về con số tám giây',
        lines: [{ t: 'cách một con số trở thành sự thật', at: 'c5_7', k: 10, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch5h', at: 'c5_8', off: -.2, beat: 'talk', line: 'c5_8',
      keys: [[0, 'talk']],
      card: { x: 560, y: 470, w: 840, h: 400, title: 'DÒNG CHẢY', sub: 'tên của trạng thái tập trung sâu',
        lines: [{ t: 'dòng chảy', at: 'c5_8', k: 21, col: PAL.hoodie.f  }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch5i', at: 'c5_9', off: 1.2, beat: 'flow', line: 'c5_9',
      title: 'BA ĐIỀU KIỆN CỦA DÒNG CHẢY',
      items: [{ n: '1', t: 'rõ ràng', s: 'bạn biết mình đang làm gì', col: PAL.hoodie.f }, { n: '2', t: 'phản hồi ngay', s: 'biết mình đang tiến không', col: PAL.cyan.f }, { n: '3', t: 'vừa sức', s: 'độ khó hợp năng lực', col: PAL.green.f }],
      pip: true, pipE: 'excited',
      ev: () => [[0, 'pop'], [0.4, 'rise'], [1.5, 'rise'], [2.6, 'rise'], [3.4, 'ting']] },

    { n: 'ch5j', at: 'c5_10', off: -.2, beat: 'talk', line: 'c5_10',
      keys: [[0, 'determined'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 860, h: 440, title: 'KHÔNG PHẢI MAY RỦI', sub: 'cả ba đều làm được',
        lines: [{ t: 'một việc rõ ràng', at: 'c5_10', k: 10, col: PAL.hoodie.f }, { t: 'một bước phản hồi tức thì', at: 'c5_10', k: 13, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop'], [0.4, 'marker'], [1.2, 'marker']] },

    { n: 'ch5k', at: 'c5_11', off: -.2, beat: 'compare', line: 'c5_11',
      leftHead: 'LÀM HỎNG DÒNG CHẢY', left: 'Một cái thông báo\nMột tab mới',
      rightHead: 'VÀ MỘT VIỆC', right: 'Khó chịu\nđang để dở',
      pip: true,
      ev: () => [[0, 'pop']] },

    { n: 'ch5l', at: 'c5_12', off: -.2, beat: 'talk', line: 'c5_12',
      keys: [[0, 'tired'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 860, h: 420, title: 'CHÚNG KHÔNG ĐẾN GIỮA LÚC', sub: 'mà đến lúc đầu bạn chưa có việc gì',
        lines: [{ t: 'lúc đầu bạn chưa có việc gì để làm', at: 'c5_12', k: 10, col: PAL.red.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch5m', at: 'c5_13', off: -.2, beat: 'talk', line: 'c5_13',
      keys: [[0, 'skeptical']],
      card: { x: 560, y: 470, w: 840, h: 400, title: 'TA BỊ PHÁ TRẬT TỰ', sub: 'không phải bởi việc khó',
        lines: [{ t: 'bị phá trật tự bởi khoảng trống', at: 'c5_13', k: 9, col: PAL.hoodie.f  }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch5n', at: 'c5_14', off: -.2, beat: 'talk', line: 'c5_14',
      keys: [[0, 'smile'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 860, h: 420, title: 'TIN TỐT', sub: 'khoảng trống thì lấp được',
        lines: [{ t: 'một việc cụ thể, viết ra', at: 'c5_14', k: 8, col: PAL.green.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch5o', at: 'c5_15', off: -.2, beat: 'talk', line: 'c5_15',
      keys: [[0, 'determined']],
      card: { x: 560, y: 470, w: 840, h: 400, title: 'MỘT CHỐT CHẶN', sub: 'để lúc đầu trống, ta có chỗ đổ thứ kia vào',
        lines: [{ t: 'một chốt chặn', at: 'c5_15', k: 0, col: PAL.hoodie.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch5p', at: 'c5_16', off: -.2, beat: 'talk', line: 'c5_16',
      keys: [[0, 'determined'], ['w', 4, 'talk']],
      card: { x: 560, y: 470, w: 800, h: 340, title: 'GIỜ ĐẾN PHẦN', sub: 'ai đó làm được ngay',
        lines: [] },
      ev: () => [[0, 'pop'], [0.2, 'music', { cue: 'D' }]] },

    // ——— chương 6: sáu việc ———
    { n: 'ch6', at: 'c6_1', off: -.4, beat: 'chapter', line: 'c6_1', tr: 'iris',
      n2: '6', title: 'SÁU VIỆC LÀM ĐƯỢC NGAY', sub: 'không phải để hiểu thêm. để làm.',
      ev: () => [[0, 'pop'], [0.2, 'music', { cue: 'G' }]] },

    { n: 'ch6a', at: 'c6_2', off: 0.0, beat: 'check', line: 'c6_2',
      title: 'MỘT VÀ HAI', items: [
        { t: '1. Điện thoại không nằm trên bàn', s: 'chỉ một tiếng rung thôi cũng đủ', at: null },
        { t: '2. Tắt thông báo', s: 'tắt từng ứng dụng một', at: null }],
      pip: true, pipE: 'determined',
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    { n: 'ch6b', at: 'c6_3', off: 1.5, beat: 'phone', line: 'c6_3', dur: 8,
      notifs: [{ t: 'Zalo: 3 tin nhắn mới', at: null, dot: PAL.red.f }, { t: 'Email: 12 tin mới', at: null, col: '#2C3247', dot: PAL.muted }],
      counter: { t: 'TẮT', sub: 'từng ứng dụng một', at: 0, col: PAL.green.f },
      ev: () => [[0, 'pop']] },

    { n: 'ch6c', at: 'c6_4', off: -.2, beat: 'talk', line: 'c6_4',
      keys: [[0, 'determined'], ['w', 6, 'talk']],
      card: { x: 560, y: 470, w: 880, h: 460, title: '3. ĐẶT MỘT QUY TẮC NHỎ', sub: 'trước khi ngồi xuống',
        lines: [{ t: 'nếu tôi thấy mình muốn cầm điện thoại,', at: 'c6_4', k: 8, col: PAL.hoodie.f }, { t: 'tôi sẽ viết câu hỏi đó ra giấy', at: 'c6_4', k: 13, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop'], [0.4, 'marker'], [1.6, 'marker']] },

    { n: 'ch6d', at: 'c6_5', off: -.2, beat: 'stat', line: 'c6_5',
      num: '94', unit: 'lần thử', label: 'kế hoạch "nếu thì" mạnh hơn chỉ đặt mục tiêu', col: PAL.hoodie.f, px: 150,
      pip: true, pipE: 'excited',
      ev: () => [[0, 'pop'], [0.3, 'rise'], [0.9, 'ting']] },

    { n: 'ch6e', at: 'c6_6', off: -.2, beat: 'stat', line: 'c6_6',
      num: '20', unit: 'phút', label: 'chừa ra cho mỗi lần quay lại', col: PAL.cyan.f, px: 170,
      note: 'đợi xong rồi hãy lao vào',
      pip: true, pipE: 'tired',
      ev: () => [[0, 'pop'], [0.3, 'rise'], [0.9, 'ting']] },

    { n: 'ch6f', at: 'c6_7', off: 1.2, beat: 'talk', line: 'c6_7',
      keys: [[0, 'determined'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 860, h: 420, title: '5. LÀM VIỆC KHÓ KHI BẠN CHÁN', sub: 'chứ không phải lúc hứng thú',
        lines: [{ t: 'chán không phải lỗi. nó là tín hiệu', at: 'c6_7', k: 10, col: PAL.green.f }] },
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    { n: 'ch6g', at: 'c6_8', off: 1.1, beat: 'check', line: 'c6_8',
      title: '6. TỰ TẠO PHẢN HỒI', items: [
        { t: 'Viết ba dòng', s: 'đánh dấu xong một mục', at: null },
        { t: 'Đặt đồng hồ đếm', s: 'một bước phản hồi tức thì', at: null }],
      pip: true, pipE: 'smile',
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    { n: 'ch6h', at: 'c6_9', off: -.2, beat: 'talk', line: 'c6_9',
      keys: [[0, 'flat'], ['w', 8, 'talk']],
      card: { x: 560, y: 470, w: 860, h: 420, title: 'NGHE NHIỀU QUÁ TẢI?', sub: 'có thể',
        lines: [{ t: 'sáu việc này không tốn thời gian', at: 'c6_9', k: 6, col: PAL.hoodie.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch6i', at: 'c6_10', off: -.2, beat: 'talk', line: 'c6_10',
      keys: [[0, 'tired'], ['w', 10, 'talk']],
      card: { x: 560, y: 470, w: 860, h: 420, title: 'MÌNH KHÔNG HỨA GÌ', sub: 'não bạn vẫn sẽ đi lang thang',
        lines: [{ t: 'bảy mươi phần trăm là bình thường', at: 'c6_10', k: 8, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch6j', at: 'c6_11', off: -.2, beat: 'money', line: 'c6_11',
      spent: 6, label: 'CHÚ Ý LÀ TIỀN', total: 'mỗi lần nhảy sang việc khác: một khoản bị rút',
      ev: () => [[0, 'pop'], [0.4, 'ting'], [0.9, 'ting'], [1.4, 'ting'], [1.9, 'ting'], [2.4, 'ting'], [2.9, 'ting']] },

    { n: 'ch6k', at: 'c6_12', off: -.2, beat: 'talk', line: 'c6_12',
      keys: [[0, 'thinking'], ['w', 10, 'talk']],
      card: { x: 560, y: 470, w: 860, h: 440, title: 'MỘT CÁCH NHÌN', sub: 'chú ý là ngân sách',
        lines: [{ t: 'bạn đang rút một khoản lớn, âm thầm', at: 'c6_12', k: 10, col: PAL.red.f }] },
      ev: () => [[0, 'pop']] },

    { n: 'ch6l', at: 'c6_13', off: -.2, beat: 'talk', line: 'c6_13',
      keys: [[0, 'smile'], ['w', 4, 'talk']],
      card: { x: 560, y: 470, w: 820, h: 380, title: 'BẠN KHÔNG CẦN GIÀU HƠN', sub: 'bạn chỉ cần biết mình đã tiêu ở đâu',
        lines: [{ t: 'biết mình đã tiêu ở đâu', at: 'c6_13', k: 8, col: PAL.hoodie.f }] },
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    // ——— kết ———
    { n: 'close', at: 'close', off: 1.2, beat: 'talk', line: 'close',
      keys: [[0, 'determined'], ['w', 6, 'talk']],
      card: { x: 560, y: 470, w: 860, h: 400, title: 'ĐỪNG TỰ TRÁCH', sub: 'lần tới khi bạn thấy mình đang lướt mạng',
        lines: [{ t: 'đừng tự trách', at: 'close', k: 14, col: PAL.cyan.f }] },
      ev: () => [[0, 'pop'], [0.4, 'marker'], [1.4, 'music', { cue: 'G' }]] },

    { n: 'close2', at: 'close2', off: 1.4, beat: 'talk', line: 'close2',
      keys: [[0, 'determined'], ['w', 8, 'smile']],
      card: { x: 560, y: 470, w: 860, h: 420, title: 'LÀM TRONG HAI MƯỜI PHÚT', sub: 'cái khó chịu đó',
        lines: [{ t: 'chỉ hai mươi phút thôi', at: 'close2', k: 8, col: PAL.hoodie.f }] },
      ev: () => [[0, 'pop'], [0.4, 'marker']] },

    { n: 'end', at: 'next', off: -.4, beat: 'end', line: 'next',
      ev: () => [[0, 'music', { cue: 'end' }]] },
  ];
  // các cảnh viết sau nằm xen giữa các cảnh cũ, nên bảng được sắp theo thứ tự câu trong SEQ
  const ORDER = new Map(SEQ.map((s, i) => [s[0], i]));
  return [...BASE, ...SHOTS_A, ...SHOTS_B].sort((a, b) => (ORDER.get(a.at) ?? 1e9) - (ORDER.get(b.at) ?? 1e9));
}
