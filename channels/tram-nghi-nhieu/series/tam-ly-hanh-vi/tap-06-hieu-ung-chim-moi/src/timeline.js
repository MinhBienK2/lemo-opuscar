// timeline.js — sinh tự động từ voice/lines.json và mk_timeline.py (Tập 06: Hiệu ứng Chim Mồi)
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 5.5;

export const SEQ = [
  ['hook', 2.4],
  ['hook2', 0.26],
  ['hook3', 0.26],
  ['intro', 1.2],
  ['myth', 0.26],
  ['myth2', 0.26],
  ['lab1', 1.2],
  ['lab2', 0.26],
  ['lab3', 0.26],
  ['lab4', 0.26],
  ['decoy1', 0.26],
  ['decoy2', 0.26],
  ['turn', 0.26],
  ['rat1', 1.2],
  ['rat2', 0.26],
  ['rat3', 0.26],
  ['rat4', 0.26],
  ['mech', 0.26],
  ['rep1', 1.4],
  ['rep2', 0.26],
  ['rep3', 0.26],
  ['rep4', 0.26],
  ['rep5', 0.26],
  ['rep6', 0.26],
  ['rep7', 0.26],
  ['wild1', 1.2],
  ['wild2', 0.26],
  ['wild3', 0.26],
  ['wild4', 0.26],
  ['model', 1.2],
  ['action1', 0.26],
  ['action2', 0.26],
  ['action3', 0.26],
  ['roi', 1.1],
  ['close', 0.26],
  ['next', 0.26],
];

export const SUBS = {
  hook: [
    'Mình đứng ở quầy trà sữa lúc nửa đêm,',
    'và mình chỉ muốn một ly nhỏ thôi.',
  ],
  hook2: [
    'Ba ly trên quầy:',
    'ly nhỏ ba mươi lăm nghìn, ly lớn sáu mươi nghìn,',
    'và ly vừa sáu mươi lăm nghìn.',
  ],
  hook3: [
    'Cỡ vừa đắt hơn cỡ lớn mà ít hơn. Vô lý.',
    'Nhưng tay mình vẫn cầm ly lớn.',
  ],
  intro: [
    'Mình là Kẻ Nghĩ Nhiều. Hôm nay:',
    'hiệu ứng chim mồi — tại sao món tệ lại làm món',
    'khác hấp dẫn hơn?',
  ],
  myth: [
    'Cách giải thích quen thuộc: người bán cắm mồi câu,',
    'còn não bạn thì bị lừa.',
  ],
  myth2: [
    'Rối nói: nghe hợp lý đấy.',
    'Nhưng câu này chưa từng được kiểm tra kỹ.',
  ],
  lab1: [
    'Năm một nghìn tám mươi hai, ba nhà nghiên cứu làm',
    'một thí nghiệm rất gọn về lựa chọn.',
  ],
  lab2: [
    'Họ cho một trăm năm mươi ba sinh viên chọn giữa',
    'những lựa chọn giả,',
    'rồi thêm vào một lựa chọn thứ ba bị áp đảo.',
  ],
  lab3: [
    'Kết quả: món mục tiêu được chọn nhiều hơn,',
    'trung bình chín điểm hai phần trăm.',
  ],
  lab4: [
    'Với nhóm ô tô,',
    'nó là bốn mươi bốn phần trăm, lên sáu mươi sáu phần trăm.',
  ],
  decoy1: [
    'Nhưng món mồi câu thì sao?',
    'Chỉ khoảng hai phần trăm người chọn nó.',
  ],
  decoy2: [
    'Nó không bán được gì cả.',
    'Nó chỉ đẩy người ta sang món khác.',
  ],
  turn: [
    'Vậy nếu dừng ở đây,',
    'đây chỉ là một cái bẫy marketing.',
  ],
  rat1: [
    'Nhưng có một cách giải thích khác,',
    'và nó không cần bạn phải ngu.',
  ],
  rat2: [
    'Nghiên cứu năm chín mươi bảy đo được hiệu ứng thật',
    'là mười chín phẩm sáu điểm.',
  ],
  rat3: [
    'Mô hình chỉ dựa vào việc người ta tự suy luận từ',
    'bộ lựa chọn thì đoán được mười ba điểm,',
    'tức khoảng hai phần ba.',
  ],
  rat4: [
    'Nghĩa là: bảng giá tiết lộ món nào đáng,',
    'và người ta dùng chính thông tin đó.',
  ],
  mech: [
    'Còn một điều nữa ít ai nói:',
    'não so sánh bằng cách đặt mọi món cạnh nhau.',
  ],
  rep1: [
    'Và đây mới là chỗ đáng sợ.',
  ],
  rep2: [
    'Năm hai nghìn mười bốn,',
    'ba nhà nghiên cứu khác chạy ba mươi tám thí nghiệm.',
  ],
  rep3: [
    'Mười chín thí nghiệm dùng sản phẩm thật: nếm,',
    'uống, xem ảnh. Không cái nào ra hiệu ứng.',
  ],
  rep4: [
    'Hiệu ứng chỉ hiện ra khi thuộc tính được viết',
    'thành con số: xác suất bằng số thì mười bốn phần',
    'trăm lên hai mươi tám.',
  ],
  rep5: [
    'Vẽ thành vòng xác suất thì hai mươi bốn và hai',
    'mươi sáu, không đổi.',
  ],
  rep6: [
    'Với cái tivi, vẽ chất lượng hình bằng ảnh thật,',
    'món mục tiêu tụt từ năm mươi ba xuống ba mươi lăm.',
  ],
  rep7: [
    'Một nhóm khác thử chín mươi mốt lần:',
    'chỉ mười một lần ra hiệu ứng đáng tin,',
    'dự báo gần ba mươi.',
  ],
  wild1: [
    'Ngoài đời thật thì sao?',
  ],
  wild2: [
    'Trên ba triệu sáu trăm nghìn giao dịch rượu vang ở',
    'Anh, hiệu ứng chỉ khoảng một phần trăm.',
  ],
  wild3: [
    'Và ở người mua thường xuyên,',
    'hiệu ứng biến mất hẳn.',
  ],
  wild4: [
    'Một thử nghiệm trên trang đặt vé máy bay,',
    'hơn một trăm bốn mươi nghìn lượt tìm kiếm,',
    'không tìm ra hiệu ứng nào.',
  ],
  model: [
    'Vậy thì mồi câu là gì? Không phải cái bẫy.',
    'Nó là một câu nói: món này đáng.',
  ],
  action1: [
    'Nên làm gì? Trước khi tính tiền,',
    'hãy gạch món bị áp đảo khỏi bảng so sánh.',
  ],
  action2: [
    'Món nào tệ hơn món kia ở mọi tiêu chí thì không',
    'phải đối thủ của món nào cả.',
  ],
  action3: [
    'Và nếu bạn hay quay lại một quán,',
    'hãy nhớ giá món mình thường uống.',
    'Người quen thì miễn nhiễm.',
  ],
  roi: [
    'Rối nói: mồi câu không bán được gì.',
    'Nó chỉ làm bạn tin mình đang chọn vì lý do.',
  ],
  close: [
    'Hiệu ứng chim mồi không phải là bạn bị lừa.',
    'Nó là cách bảng giá nói với bạn điều gì đó,',
    'và bạn chọn nghe.',
  ],
  next: [
    'Lần sau ở quầy, gạch món ở giữa đi.',
    'Mình là Kẻ Nghĩ Nhiều.',
  ],
};


// Bộ máy của timeline: đọc độ dài thật của từng câu (dur.json), mốc thời gian từng từ
// (words.json) và miệng của nhân vật (lips.json), rồi dựng các mốc thời gian cho phim.
// Không có mốc nào gõ tay: mọi thứ đến từ giọng đọc đã thu.

// Bỏ dấu và bỏ dấu câu, để một từ tìm được trong kết quả ASR dù Whisper viết thế nào.
export const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w]/g, '');

// các từ đếm: một cụm số không được cắt làm đôi, và không dùng làm từ khóa
const NUM = new Set(['khong', 'mot', 'hai', 'ba', 'bon', 'nam', 'sau', 'bay', 'tam', 'chin',
  'muoi', 'lam', 'muoi', 'tram', 'nghin', 'ngan', 'chuc', 'linh', 'le', 'phan', 'trieu', 'ty', 'ti']);

// vị trí một từ trong kết quả ASR, tìm từ `from` trở đi; -1 khi không có
function wordIndex(ws, want, from = 0) {
  const t = norm(want);
  if (!t) return -1;
  for (let i = from; i < ws.length; i++) if (norm(ws[i].w) === t) return i;
  for (let i = from; i < ws.length; i++) { const n = norm(ws[i].w); if (n && (n.startsWith(t) || t.startsWith(n))) return i; }
  return -1;
}

export function build(dur, words, lips) {
  const L = {}; let t = 0;
  for (const [id, gap] of SEQ) { t += gap; L[id] = { id, t0: t, t1: t + dur[id] }; t += dur[id]; }
  const end = t + TAIL;
  const ids = SEQ.map(s => s[0]);

  // thời gian tuyệt đối của một từ trong một câu
  const w = (id, k) => {
    const ws = words[id] || [], i = typeof k === 'string' ? wordIndex(ws, k) : Math.min(k, Math.max(0, ws.length - 1));
    const hit = ws[i];
    if (!hit) return L[id].t0;
    return L[id].t0 + Math.max(0, Math.min(L[id].t1 - L[id].t0, hit.t0));
  };

  // các mảnh phụ đề: mỗi mảnh bắt đầu ở từ đang nói (từ khóa của nó), và kết thúc khi mảnh sau bắt đầu.
  const cues = [];
  ids.forEach((id, n) => {
    const ws = words[id] || [];
    const parts = SUBS[id].map(p => {
      const text = typeof p === 'string' ? p : p[1];
      const toks = text.split(/\s+/);
      // từ khóa: từ đầu tiên của mảnh; nếu từ đó là từ đếm thì lấy từ đầu tiên không phải từ đếm
      // (Whisper viết số thành chữ số, nên từ đếm không tìm thấy trong kết quả ASR)
      let key = toks[0];
      if (NUM.has(norm(key))) { const alt = toks.find(t => !NUM.has(norm(t))); if (alt) key = alt; }
      return { text, key: toks.length ? key : null };
    });
    // vị trí của từng mảnh trong câu: từ khóa, hoặc — khi ASR không nghe thấy từ đó — tỉ lệ với độ dài chữ
    const total = parts.reduce((a, p) => a + p.text.length, 0);
    let acc = 0, cursor = 0;
    parts.forEach((p, i) => {
      const share = acc / total; acc += p.text.length;
      let idx = -1;
      if (i > 0 && p.key) idx = wordIndex(ws, p.key, cursor);
      if (idx < 0 && i > 0) idx = Math.max(cursor, Math.round(share * Math.max(0, ws.length - 1)));
      if (i === 0) idx = 0;
      p.idx = Math.min(idx, Math.max(0, ws.length - 1));
      p.t0 = L[id].t0 + Math.max(0, Math.min(dur[id], (ws[p.idx] || { t0: 0 }).t0));
      // con trỏ dòng tiếp theo bắt đầu sau từ cuối cùng của mảnh này, để từ lặp lại
      // ("ly", "mồi câu"…) không bị neo nhầm về chỗ đã nói trước đó
      const lastTok = p.text.split(/\s+/).pop();
      const li = wordIndex(ws, lastTok, p.idx);
      cursor = (li >= 0 ? li : p.idx) + 1;
    });
    // mảnh cuối của câu giữ đến khi câu sau bắt đầu, và không bao giờ ngắn hơn 1,8 s
    const nextT = n + 1 < ids.length ? L[ids[n + 1]].t0 - .04 : end;
    parts.forEach((p, i) => {
      let t1 = i + 1 < parts.length ? parts[i + 1].t0 : Math.min(nextT, Math.max(L[id].t1 + .6, p.t0 + 1.8));
      if (t1 <= p.t0 + .25) t1 = Math.min(nextT, p.t0 + .6);   // không mảnh nào không có thời lượng
      cues.push({ id, text: p.text, t0: +p.t0.toFixed(3), t1: +t1.toFixed(3) });
    });
  });

  // miệng: giọng đọc điều khiển nó ở 12 fps (mỗi giá trị 1/24 s, giữ một nhịp), đóng giữa các câu
  const talk = T => {
    for (const id of ids) {
      const l = L[id];
      if (T >= l.t0 && T < l.t1) {
        const lp = lips[id];
        if (!lp || !lp.o || !lp.o.length) return { o: 0, b: .5 };
        const i = Math.min(lp.o.length - 1, Math.floor((T - l.t0) * 12) * 2);
        return { o: lp.o[i] || 0, b: (lp.b && lp.b[i]) || .5 };
      }
    }
    return { o: 0, b: .5 };
  };

  return { L, SEQ, SUBS, cues, talk, end, w, words };
}
