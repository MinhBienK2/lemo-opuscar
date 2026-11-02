// timeline.js — sinh tự động từ voice/lines.json và mk_timeline.py (Tập 07: Tại sao ta luôn tưởng mình đúng?)
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 5.0;

export const SEQ = [
  ['hook1', 2.4],
  ['hook2', 0.26],
  ['hook3', 0.26],
  ['intro', 1.2],
  ['intro2', 0.26],
  ['myth', 1.2],
  ['myth2', 0.26],
  ['myth3', 0.26],
  ['drv1', 1.2],
  ['drv2', 0.26],
  ['drv3', 0.26],
  ['drv4', 0.26],
  ['bias1', 1.2],
  ['bias2', 0.26],
  ['bias3', 0.26],
  ['bias4', 0.26],
  ['bias5', 0.26],
  ['bk1', 1.2],
  ['bk2', 0.26],
  ['bk3', 0.26],
  ['bk4', 0.26],
  ['bk5', 0.26],
  ['turn1', 1.4],
  ['turn2', 0.26],
  ['turn3', 0.26],
  ['turn4', 0.26],
  ['mech1', 1.1],
  ['mech2', 0.26],
  ['mech3', 0.26],
  ['act1', 1.2],
  ['act2', 0.26],
  ['act3', 0.26],
  ['act4', 0.26],
  ['act5', 0.26],
  ['hop1', 1.1],
  ['roi', 1.1],
  ['close', 0.26],
  ['next', 0.26],
];

export const SUBS = {
  hook1: [
    'Hai giờ sáng, mình ngồi ở bàn đọc tin.',
    'Và mình chỉ đọc những tin đồng ý với mình.',
  ],
  hook2: [
    'Mấy mẩu còn lại thì bị mình gạt vào ngăn kéo.',
  ],
  hook3: [
    'Rồi mình ngồi đó,',
    'tự tin rằng mình là người lý trí nhất phòng.',
  ],
  intro: [
    'Mình là Kẻ Nghĩ Nhiều. Hôm nay:',
    'tại sao ta luôn tưởng mình đúng?',
  ],
  intro2: [
    'Câu trả lời không phải là bạn ngu.',
    'Nó nằm ở một chỗ khác.',
  ],
  myth: [
    'Cách giải thích quen thuộc: não bộ tự lọc,',
    'chỉ nhận tin khớp với điều mình đã tin.',
  ],
  myth2: [
    'Tên khoa học của nó là thiên lệch xác nhận:',
    'tìm và diễn giải bằng chứng theo hướng có lợi cho',
    'niềm tin sẵn có.',
  ],
  myth3: [
    'Rối nói: nghe hợp lý.',
    'Nhưng câu này chưa từng được kiểm tra kỹ.',
  ],
  drv1: [
    'Năm 1981, một nhà tâm lý học hỏi tài xế ở Mỹ tự đánh',
    'giá thế nào so với nhau.',
  ],
  drv2: [
    'Chín mươi ba phần trăm nói mình lái xe giỏi hơn tài',
    'xế trung vị.',
  ],
  drv3: [
    'Bản lặp lại năm 2023,',
    'với hơn một nghìn hai trăm ba người,',
    'vẫn ra con số tương tự.',
  ],
  drv4: [
    'Nhưng nghĩa là trung vị có một nửa số người lái xe',
    'giỏi hơn bạn.',
  ],
  bias1: [
    'Vấn đề không chỉ ở chỗ tự đánh giá quá cao.',
  ],
  bias2: [
    'Năm 1979, ba nhà tâm lý học cho hai nhóm người cùng',
    'đọc một bộ dữ kiện giống hệt nhau.',
  ],
  bias3: [
    'Nhóm ủng hộ thấy bằng chứng ủng hộ là mạnh,',
    'và bằng chứng chống lại là yếu.',
  ],
  bias4: [
    'Nhóm phản đối thì ngược lại. Cùng dữ kiện,',
    'hai kết luận ngược nhau.',
  ],
  bias5: [
    'Họ gọi đó là đồng hóa thiên lệch.',
    'Một trăm năm mươi mốt sinh viên,',
    'và không ai chịu đổi ý.',
  ],
  bk1: [
    'Rồi còn một câu chuyện được lặp đi lặp lại trong mọi',
    'hướng dẫn đính chính.',
  ],
  bk2: [
    'Năm 2010, hai nhà nghiên cứu đo được hiệu ứng bật',
    'ngược: người được đính chính lại tin mình hơn trước.',
  ],
  bk3: [
    'Trong bốn thí nghiệm của họ,',
    'chỉ hai thí nghiệm ra hiệu ứng này.',
  ],
  bk4: [
    'Nhóm bảo thủ đồng ý rằng Iraq có vũ khí hủy diệt,',
    'từ ba mươi hai phần trăm lên sáu mươi bốn phần trăm.',
  ],
  bk5: [
    'Nghe rất thuyết phục.',
    'Nhưng chỗ này mới là chỗ đáng sợ.',
  ],
  turn1: [
    'Năm 2019, hai nhà nghiên cứu khác làm năm thí nghiệm mới.',
  ],
  turn2: [
    'Năm mươi hai vấn đề, hơn mười nghìn một trăm người.',
  ],
  turn3: [
    'Không một trường hợp nào bật ngược.',
  ],
  turn4: [
    'Và họ tìm ra lý do: câu hỏi cũ quá phức tạp,',
    'nên người ta đọc câu hỏi, bỏ qua cả phần đính chính.',
  ],
  mech1: [
    'Nói cách khác: phần lớn việc bám niềm tin,',
    'không phải vì ta cố ý, mà vì ta không đọc.',
  ],
  mech2: [
    'Một phân tích tổng hợp năm 2020 của các nghiên cứu',
    'về đính chính:',
    'được sửa tin vẫn hơn là không được sửa tin.',
  ],
  mech3: [
    'Cái bật ngược thì hiếm,',
    'và có thể là do cách người ta đặt câu hỏi.',
  ],
  act1: [
    'Vậy làm gì? Có hai việc, đều làm được ngay.',
  ],
  act2: [
    'Một: xét ngược lại. Năm 1985,',
    'ba nhà nghiên cứu chỉ ra rằng bắt người ta cân nhắc',
    'chiều ngược lại thì cái thiên lệch giảm.',
  ],
  act3: [
    'Hai: viết ra trước điều gì sẽ khiến mình đổi ý.',
    'Đây là điều răn thứ năm của những người dự báo.',
  ],
  act4: [
    'Mỗi lần đọc một tin mình thích, mở sổ ra,',
    'viết một dòng: điều gì sẽ khiến mình đổi ý?',
  ],
  act5: [
    'Rồi đi tìm phần đính chính, và đọc nó.',
  ],
  hop1: [
    'Và biết đâu được.',
    'Nhóm dự báo nổi tiếng có hơn hai mươi nghìn người;',
    'một buổi huấn luyện khoảng một tiếng nâng độ chính',
    'xác lên khoảng mười phần trăm.',
  ],
  roi: [
    'Rối nói: não bạn không ghét bạn. Nó chỉ không đọc.',
  ],
  close: [
    'Tin mình đúng không phải lỗi của bạn.',
    'Nhưng đọc phần đính chính thì là việc của bạn.',
  ],
  next: [
    'Tối nay, mở sổ ra. Mình là Kẻ Nghĩ Nhiều.',
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
