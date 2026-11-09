// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c1', 2.2],
  ['c2', 0.3],
  ['c3', 0.45],
  ['c4', 0.3],
  ['c5', 0.3],
  ['c6', 0.4],
  ['c7', 0.4],
  ['c8', 0.35],
  ['c9', 0.45],
  ['c10', 0.4],
  ['c11', 0.4],
  ['c12', 0.4],
  ['c13', 0.6],
  ['c14', 0.35],
  ['c15', 0.4],
  ['c16', 0.35],
  ['c17', 0.4],
  ['c18', 0.35],
  ['c19', 0.5],
  ['c20', 0.35],
  ['c21', 0.45],
  ['c22', 0.4],
  ['c23', 0.4],
  ['c24', 0.45],
  ['c25', 2.4],
];

export const SUBS = {
  c1: [
    'Rắc một nhúm muối lên viên đá này,',
    'và đá bắt đầu tan.',
  ],
  c2: [
    'Viên đá bên cạnh, cùng kích thước và cùng nhiệt độ.',
    'Không rắc muối, nó vẫn còn nguyên.',
  ],
  c3: [
    'Vì sao rắc muối lên đá lạnh thì đá tan nhanh hơn?',
    'Mình làm một thí nghiệm nhỏ.',
  ],
  c4: [
    'Người ta hay nghĩ muối phá vỡ tinh thể đá như búa,',
    'hoặc làm đá nóng lên.',
  ],
  c5: [
    'Nhưng viên đá không vỡ ra mảnh nào,',
    'vẫn là một khối nguyên vẹn mà đang tan.',
  ],
  c6: [
    'Muối tan không làm đá nóng lên.',
  ],
  c7: [
    'Cái thay đổi không phải nhiệt độ của đá,',
    'mà là điểm đóng băng của nước quanh đá.',
  ],
  c8: [
    'Nước sạch thì đông cứng ở không độ.',
  ],
  c9: [
    'Nước muối mười phần trăm thì điểm đông thấp hơn,',
    'khoảng sáu phần sáu độ dưới không.',
  ],
  c10: [
    'Nước quanh viên đá lúc này đã là nước muối:',
    'vệt muối đã tan, mặt nước trong và đều.',
  ],
  c11: [
    'Muối tan ra thành hai ion,',
    'nên trong nước có nhiều hạt hơn,',
    'và điểm đóng băng tụt xuống.',
  ],
  c12: [
    'Chính vì lớp nước đó là nước muối,',
    'nó không đóng băng ở không độ.',
    'Nên viên đá ở dưới không độ vẫn tan được.',
  ],
  c13: [
    'Bây giờ mình ghé sát vào bề mặt viên đá,',
    'chỗ đá thật sự tan ra.',
  ],
  c14: [
    'Một phân tử nước bám vào mặt đá,',
    'làm lớp nước quanh đá dày thêm.',
  ],
  c15: [
    'Nhưng ion clorua của muối đã chen sâu vào mặt đá,',
    'đúng chỗ phân tử nước định bám.',
  ],
  c16: [
    'Nên nhiều phân tử nước khó bám được,',
    'lớp nước trên mặt đá mỏng đi.',
  ],
  c17: [
    'Thêm nữa, khi muối tan ở đó,',
    'nó lấy nhiệt từ chính lớp nước quanh đá.',
  ],
  c18: [
    'Nước quanh đá nguội đi, nên viên đá tan nhanh hơn.',
  ],
  c19: [
    'Vậy là hai cơ chế cộng lại.',
    'Muối hạ điểm đóng băng của nước xuống,',
    'và khi tan thì lấy thêm nhiệt.',
  ],
  c20: [
    'Muối đậm hơn thì điểm đóng băng của nước muối thấp hơn nữa.',
  ],
  c21: [
    'Tới khoảng hai mươi mốt độ dưới không thì nó dừng lại.',
  ],
  c22: [
    'Dưới mốc đó, muối tách ra thành muối hai nước,',
    'và nước muối trở lại mốc đông của nó.',
  ],
  c23: [
    'Quay lại bếp: muối trong hộp đã cạn,',
    'túi muối được đặt xuống, ánh sáng đã ngả sang chiều.',
  ],
  c24: [
    'Và cũng vì thế mà người ta làm kem tuyết ở nhà bằng',
    'đá và muối.',
  ],
  c25: [
    'Muối không đập vỡ đá, cũng không làm đá nóng lên.',
    'Nó chỉ biến lớp nước quanh viên đá thành nước muối.',
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
