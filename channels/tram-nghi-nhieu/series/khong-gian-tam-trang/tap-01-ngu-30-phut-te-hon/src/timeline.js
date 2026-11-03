// timeline.js — sinh tự động từ voice/lines.json và mk_timeline.py (Tập 01: Tại sao ngủ 30 phút lại tệ hơn không ngủ?)
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['hook1', 2.4],
  ['hook2', 0.26],
  ['hook3', 0.26],
  ['intro', 1.3],
  ['hook4', 0.26],
  ['roi1', 0.26],
  ['lab1', 1.3],
  ['lab2', 0.26],
  ['lab3', 0.26],
  ['lab4', 0.26],
  ['lab5', 0.26],
  ['roi2', 1.3],
  ['win1', 0.26],
  ['win2', 0.26],
  ['win3', 0.26],
  ['win4', 0.26],
  ['win5', 0.26],
  ['mech1', 1.3],
  ['mech2', 0.26],
  ['mech3', 0.26],
  ['mech4', 0.26],
  ['mech5', 0.26],
  ['self1', 1.3],
  ['self2', 0.26],
  ['self3', 0.26],
  ['self4', 0.26],
  ['roi3', 1.3],
  ['cafe1', 0.26],
  ['cafe2', 0.26],
  ['cafe3', 0.26],
  ['cafe4', 0.26],
  ['roi4', 1.3],
  ['cost1', 0.26],
  ['cost2', 0.26],
  ['cost3', 0.26],
  ['act1', 1.3],
  ['act2', 0.26],
  ['act3', 0.26],
  ['act4', 0.26],
  ['close1', 0.26],
  ['close2', 0.26],
  ['close3', 0.26],
];

export const SUBS = {
  hook1: [
    'Chiều thứ Sáu, mình ngủ gục ở văn phòng.',
    'Đồng hồ hẹn ba mươi phút.',
  ],
  hook2: [
    'Chuông reo, mình ngồi dậy, mở laptop,',
    'và thấy đầu mình nặng hơn lúc vừa nằm xuống.',
    'Người ta gọi cảm giác lười nhác, lơ mơ,',
    'đầu không minh đó là sleep inertia,',
    'và nó thường kéo dài chừng nửa tiếng.',
  ],
  hook3: [
    'Càng ngủ lâu, càng tệ hả?',
  ],
  intro: [
    'Mình là Kẻ Nghĩ Nhiều. Hôm nay:',
    'tại sao ngủ ba mươi phút lại tệ hơn không ngủ?',
  ],
  hook4: [
    'Mình tìm hiểu xem lời giải thích này có đúng không.',
  ],
  roi1: [
    'Ngủ trưa hai mươi phút là chuẩn rồi.',
    'Ngủ đủ vậy thì chắc chắn tỉnh.',
  ],
  lab1: [
    'Mình tìm được một nhóm người đã làm thí nghiệm ngủ',
    'trưa có đo đạc, để đo chính xác cái cảm giác này.',
  ],
  lab2: [
    'Họ mời hai mươi bốn người;',
    'đêm trước chỉ ngủ được khoảng năm tiếng,',
    'rồi buổi chiều đưa vào phòng.',
  ],
  lab3: [
    'Trước hết, ba nhóm: ngủ mười phút,',
    'ngủ hai mươi phút, và nhóm ngủ ba mươi phút.',
  ],
  lab4: [
    'Rồi đèn bật, và họ phải làm bài ngay lập tức,',
    'không có thời gian để tỉnh.',
  ],
  lab5: [
    'Hiệu năng thì đo bằng đồng hồ:',
    'đếm số lần trả lời sai mỗi giây.',
  ],
  roi2: [
    'Chắc nhóm ngủ lâu nhất thì tỉnh nhất chứ gì.',
    'Ai cũng vậy mà.',
  ],
  win1: [
    'Nhóm ngủ mười phút thì tỉnh ngay,',
    'và cảm nhận được hiệu quả ngay sau khi dậy.',
  ],
  win2: [
    'Nhóm ngủ hai mươi phút thì lạ: lúc vừa mở mắt,',
    'cột của họ vẫn trống — hiệu quả chưa tới một lần nào.',
  ],
  win3: [
    'Còn nhóm ngủ ba mươi phút thì tệ nhất lúc mới dậy,',
    'phải chờ thêm mới hồi lại được.',
  ],
  win4: [
    'Nói cách khác,',
    'con số của nhóm vừa rồi không phải là con số chuẩn',
    'của một giấc ngủ trưa.',
  ],
  win5: [
    'Lợi ích của nhóm ấy chỉ xuất hiện sau ba mươi lăm',
    'phút. Nó nằm giữa: lúc vừa mở mắt,',
    'chưa được lợi ích gì cả,',
    'mà cũng chưa rơi vào giấc ngủ sâu để bị tê.',
  ],
  mech1: [
    'Có một thí nghiệm khác, vào ca đêm,',
    'với ba mươi mốt người sau một đêm không ngủ.',
    'Vì sao nhóm ngủ lâu lại tệ hơn?',
    'Vì nhóm đó đủ lâu để rơi vào giấc ngủ sâu,',
    'còn nhóm ngủ ngắn thì chưa.',
    'Không phải ai đi thẳng vào giấc ngủ sâu được:',
    'chưa vào thì chưa có lợi ích,',
    'mà cũng chưa sâu đến mức bị tê.',
  ],
  mech2: [
    'Nhóm ngủ lâu có mười bốn phút bảy ngủ sâu;',
    'nhóm ngủ ngắn thì chỉ không phẩy tám phút.',
  ],
  mech3: [
    'Tám mươi phần trăm người ngủ lâu tỉnh dậy đúng lúc',
    'đang ngủ sâu.',
  ],
  mech4: [
    'Còn nhóm ngủ ngắn thì phần lớn tỉnh dậy ở giấc ngủ nông.',
  ],
  mech5: [
    'Vì lúc đó ta còn đang nằm trong giấc ngủ sâu,',
    'nên phải chờ não tỉnh dần mới hồi lại được.',
  ],
  self1: [
    'Chuyện khó chịu nhất nằm ở đây.',
    'Trong thí nghiệm ca đêm đó,',
    'các nhóm đều tự chấm là mình làm tốt hơn trước khi ngủ.',
  ],
  self2: [
    'Nhưng đồng hồ đo thì nói ngược lại:',
    'ở những mốc đo đầu tiên sau khi dậy,',
    'nhóm ngủ lâu làm sai nhiều hơn cả nhóm không ngủ.',
  ],
  self3: [
    'Tức là bạn không hề biết mình đang tệ.',
    'Không ai báo cho bạn cả.',
  ],
  self4: [
    'Cảm giác tỉnh của bạn không phải là bằng chứng.',
  ],
  roi3: [
    'Vậy thì cứ uống cà phê ngay sau khi dậy là tỉnh ngay chứ gì.',
  ],
  cafe1: [
    'Cà phê thì sao?',
    'Người ta đã thử uống cà phê trước giấc ngủ trưa,',
    'và các triệu chứng mờ đầu,',
    'lười nhác sau khi dậy giảm rõ rệt.',
  ],
  cafe2: [
    'Nhưng uống sau khi đã dậy thì tác dụng đến trễ.',
    'Đoạn tệ nhất vừa mở mắt, cà phê không cứu được.',
  ],
  cafe3: [
    'Nói cách khác,',
    'muốn cà phê thì uống trước khi nằm xuống,',
    'đừng uống sau khi ngồi dậy.',
  ],
  cafe4: [
    'Và cà phê không thay thế được giấc ngủ.',
  ],
  roi4: [
    'Thì cứ đừng ngủ trưa, giữ mình tỉnh là hơn chứ gì.',
  ],
  cost1: [
    'Còn một thứ nữa nữa, và nó nặng hơn nhiều:',
    'không ngủ trưa cũng chưa phải là cách,',
    'vì thiếu ngủ không ghi đè lên bạn, nó tích lũy.',
  ],
  cost2: [
    'Sáu giờ mừng đêm suốt mười bốn ngày liên tiếp,',
    'hiệu năng nhận thức tệ đến mức tương đương tới hai',
    'đêm không ngủ trắng.',
  ],
  cost3: [
    'Và người trong cuộc phần lớn không nhận ra mình đang mệt.',
  ],
  act1: [
    'Nên làm gì? Giữ giấc ngủ trưa dưới ba mươi phút,',
    'và đừng làm việc nguy hiểm ngay lúc vừa dậy.',
  ],
  act2: [
    'Muốn ngủ trưa thì đặt báo thức mười phút,',
    'thay vì để mình nằm tới khi tự tỉnh.',
  ],
  act3: [
    'Uống cà phê thì uống trước khi nằm,',
    'để nó còn kịp tác dụng lúc bạn vừa dậy.',
  ],
  act4: [
    'Và đừng tin cảm giác của bạn.',
    'Muốn biết mình có ổn không thì phải nhìn kết quả.',
  ],
  close1: [
    'Ngủ trưa thì giữ ngắn thôi;',
    'cà phê thì uống trước khi nằm.',
  ],
  close2: [
    'Khuyến nghị này đến từ các bài tổng quan,',
    'và bằng chứng cho nó chưa được rà soát kỹ.',
    'Nhưng vẫn phải ngủ đủ ban đêm, đừng có cắt ngủ.',
  ],
  close3: [
    'Trạm Nghĩ Nhiều — tức là Kẻ Nghĩ Nhiều đây — hẹn gặp',
    'lại bạn ở kỳ sau.',
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
      let key = toks[0];
      if (NUM.has(norm(key))) { const alt = toks.find(t => !NUM.has(norm(t))); if (alt) key = alt; }
      return { text, key: toks.length ? key : null };
    });
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
      const lastTok = p.text.split(/\s+/).pop();
      const li = wordIndex(ws, lastTok, p.idx);
      cursor = (li >= 0 ? li : p.idx) + 1;
    });
    const nextT = n + 1 < ids.length ? L[ids[n + 1]].t0 - .04 : end;
    parts.forEach((p, i) => {
      let t1 = i + 1 < parts.length ? parts[i + 1].t0 : Math.min(nextT, Math.max(L[id].t1 + .6, p.t0 + 1.8));
      if (t1 <= p.t0 + .25) t1 = Math.min(nextT, p.t0 + .6);
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
