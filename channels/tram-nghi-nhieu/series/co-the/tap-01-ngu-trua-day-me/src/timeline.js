// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c1', 0.5],
  ['c2', 0.2],
  ['c3', 0.6],
  ['c4', 0.2],
  ['c5', 0.3],
  ['c6', 0.2],
  ['c7', 0.5],
  ['c8', 0.4],
  ['c9', 0.4],
  ['c10', 0.3],
  ['c11', 0.4],
  ['c12', 0.2],
  ['c13', 0.5],
  ['c14', 0.4],
  ['c15', 0.5],
  ['c16', 0.2],
  ['c17', 0.3],
  ['c18', 0.3],
  ['c19', 0.2],
  ['c20', 0.5],
  ['c21', 0.2],
  ['c22', 0.5],
  ['c23', 0.2],
  ['c24', 0.2],
  ['c25', 0.4],
  ['c26', 0.6],
  ['c27', 0.4],
  ['c28', 0.6],
  ['c29', 0.2],
  ['c30', 0.4],
  ['c31', 0.2],
  ['c32', 0.3],
  ['c33', 0.6],
  ['c34', 0.3],
  ['c35', 0.3],
  ['c36', 0.5],
  ['c37', 0.2],
  ['c38', 0.3],
  ['c39', 0.2],
  ['c40', 0.3],
  ['c41', 0.6],
  ['c42', 0.3],
  ['c43', 0.2],
  ['c44', 0.6],
  ['c45', 0.4],
  ['c46', 0.3],
  ['c47', 0.3],
  ['c48', 0.3],
  ['c49', 0.7],
  ['c50', 0.3],
  ['c51', 0.3],
  ['c52', 0.8],
];

export const SUBS = {
  c1: [
    'Buổi chiều, người ta nằm xuống ngủ một chút.',
  ],
  c2: [
    'Đồng hồ báo thức reo, tay với ra chặn, rồi ngồi dậy.',
  ],
  c3: [
    'Và đầu thì nặng hơn lúc chưa ngủ.',
  ],
  c4: [
    'Nhiều người tưởng ngủ trưa chỉ là nghỉ chút cho mắt.',
  ],
  c5: [
    'Nhưng ba mươi phút nằm ngủ là một giấc ngủ thật.',
  ],
  c6: [
    'Người ta đo được phần bên trong của nó.',
  ],
  c7: [
    'Trong ba mươi phút đó có mười lăm phút ngủ sóng chậm.',
  ],
  c8: [
    'Ngủ sóng chậm dồn lên mạnh ở đầu giấc ngủ, rồi giảm dần.',
  ],
  c9: [
    'Đồng hồ báo thức reo, cắt ngang giấc ngủ.',
  ],
  c10: [
    'Cách kể quen thuộc là: dậy giữa ngủ sâu,',
    'não chưa kịp chạy lại.',
  ],
  c11: [
    'Nghe hợp lý.',
  ],
  c12: [
    'Nhưng khi người ta gom kết quả nhiều nghiên cứu lại,',
    'họ chia làm đôi.',
  ],
  c13: [
    'Có bên thấy mối liên hệ đó, có bên không thấy.',
  ],
  c14: [
    'Nên đừng vội tin chỗ đó.',
    'Có một chỗ không ai tranh cãi.',
  ],
  c15: [
    'Đó là cái đo được.',
  ],
  c16: [
    'Ngay sau khi dậy, phản xạ của người ta tụt rõ rệt.',
  ],
  c17: [
    'Tụt tới mức thấp hơn cả lúc chưa ngủ.',
  ],
  c18: [
    'Và ranh giới nằm ở ba mươi phút.',
  ],
  c19: [
    'Giấc ngủ trưa từ ba mươi phút trở lên thì phản xạ',
    'tụt rõ rệt.',
  ],
  c20: [
    'Dưới ngưỡng đó thì hiệu ứng lờ đờ nhẹ hơn nhiều.',
  ],
  c21: [
    'May mà cơn lờ đờ đó không kéo dài.',
  ],
  c22: [
    'Nó tự qua trong nửa tiếng, có khi còn không có.',
  ],
  c23: [
    'Chỉ có một điều lừa người ta.',
  ],
  c24: [
    'Sau khi ngủ, ai cũng tự đánh giá là mình làm tốt hơn.',
  ],
  c25: [
    'Còn phép đo thì nói ngược lại.',
  ],
  c26: [
    'Nên cảm giác sau một giấc ngủ trưa không phải là bằng chứng.',
  ],
  c27: [
    'Vậy lúc dậy, bên trong não đang có gì?',
  ],
  c28: [
    'Mình đi vào xem.',
  ],
  c29: [
    'Trong não có một thứ tích lại suốt lúc bạn thức.',
  ],
  c30: [
    'Tên của nó là adenosine.',
  ],
  c31: [
    'Người ta gọi nó là áp lực ngủ: bạn thức bao lâu,',
    'nó càng nhiều.',
  ],
  c32: [
    'Nó không bay lơ lửng vô nghĩa.',
  ],
  c33: [
    'Nó bám vào một khía trên thụ thể,',
    'và khía đó báo cho não biết buồn ngủ.',
  ],
  c34: [
    'Lúc bạn dậy, lượng adenosine vừa tích lại được là',
    'nhiều nhất.',
  ],
  c35: [
    'Có lý thuyết rằng chính lượng đó làm não chậm lúc',
    'bạn vừa mở mắt.',
  ],
  c36: [
    'Lý thuyết thôi, chưa ai chắc.',
  ],
  c37: [
    'Còn cà phê thì làm một việc rất khôn.',
  ],
  c38: [
    'Nó không xoá adenosine.',
  ],
  c39: [
    'Nó là chất chặn thụ thể,',
    'nên nó chen vào đúng chỗ adenosine muốn bám.',
  ],
  c40: [
    'Adenosine không còn chỗ bám, thì cơn lờ đờ cũng tan.',
  ],
  c41: [
    'Trong một thí nghiệm,',
    'người được uống cà phê không bị tụt phản xạ lúc dậy.',
  ],
  c42: [
    'Còn một lý do nữa,',
    'và nó giải thích vì sao chuyện này hay xảy ra đúng',
    'buổi chiều.',
  ],
  c43: [
    'Buổi chiều là lúc tỉnh táo tụt sẵn theo nhịp ngày.',
  ],
  c44: [
    'Bạn có ăn hay không ăn thì chỗ đó vẫn xuống.',
  ],
  c45: [
    'Vậy muốn dậy mà không bị lờ đờ thì làm gì?',
  ],
  c46: [
    'Đừng để mình rơi quá sâu.',
  ],
  c47: [
    'Giữ giấc trưa ở mức ngủ nông, khoảng hai mươi phút, là đủ.',
  ],
  c48: [
    'Một thí nghiệm đo được:',
    'giấc ngủ trưa hai mươi phút buổi chiều kết ở giấc ngủ nhẹ.',
  ],
  c49: [
    'Hoặc uống cà phê ngay trước khi nằm,',
    'để cà phê bắt đầu tác dụng đúng lúc bạn mở mắt.',
  ],
  c50: [
    'Bạn không hỏng.',
  ],
  c51: [
    'Bạn chỉ dậy đúng lúc não còn chưa chạy được.',
  ],
  c52: [
    'Và cơn lờ đờ đó cũng tự qua trong nửa tiếng.',
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
