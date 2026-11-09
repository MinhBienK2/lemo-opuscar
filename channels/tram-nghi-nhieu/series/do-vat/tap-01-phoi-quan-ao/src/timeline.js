// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c1', 2.4],
  ['c2', 0.2],
  ['c3', 0.45],
  ['c4', 0.2],
  ['c5', 0.2],
  ['c6', 0.2],
  ['c7', 0.2],
  ['c8', 0.45],
  ['c9', 0.2],
  ['c10', 0.45],
  ['c11', 0.2],
  ['c12', 0.2],
  ['c13', 0.45],
  ['c14', 0.2],
  ['c15', 0.45],
  ['c16', 0.2],
  ['c17', 0.45],
  ['c18', 0.2],
  ['c19', 0.45],
  ['c20', 0.2],
  ['c21', 0.2],
  ['c22', 0.45],
  ['c23', 0.2],
  ['c24', 0.2],
  ['c25', 0.45],
  ['c26', 0.2],
  ['c27', 0.45],
  ['c28', 0.2],
  ['c29', 0.45],
  ['c30', 0.2],
  ['c31', 0.45],
  ['c32', 0.2],
  ['c33', 0.45],
  ['c34', 0.2],
  ['c35', 0.45],
  ['c36', 0.2],
  ['c37', 0.2],
  ['c38', 0.45],
  ['c39', 0.2],
  ['c40', 0.2],
  ['c41', 0.45],
  ['c42', 0.2],
  ['c43', 0.2],
  ['c44', 0.45],
  ['c45', 0.2],
  ['c46', 0.45],
  ['c47', 0.2],
  ['c48', 0.45],
  ['c49', 0.2],
  ['c50', 0.45],
  ['c51', 0.2],
  ['c52', 0.45],
  ['c53', 0.2],
  ['c54', 0.45],
  ['c55', 0.2],
  ['c56', 0.45],
  ['c57', 0.2],
  ['c58', 0.2],
  ['c59', 0.45],
  ['c60', 0.2],
];

export const SUBS = {
  c1: [
    'Quần áo ướt treo trên dây, nước vẫn còn đó,',
    'chưa đi đâu cả.',
  ],
  c2: [
    'Nó còn ở trên vải,',
    'và sẽ phải rời đi bằng một cách khác.',
  ],
  c3: [
    'Vì sao phơi quần áo cần gió?',
    'Mình làm thí nghiệm nhỏ.',
  ],
  c4: [
    'Trong một căn phòng kín,',
    'hai cái áo giống nhau treo cạnh nhau.',
  ],
  c5: [
    'Một cái trước quạt, một cái ở góc xa, không có gió.',
  ],
  c6: [
    'Không khí trong phòng đứng yên,',
    'nên chỗ nào có quạt thì mới có gió.',
  ],
  c7: [
    'Cái trước quạt đang nhạt màu dần,',
    'còn cái kia vẫn sẫm.',
  ],
  c8: [
    'Nước không tự mất đi.',
  ],
  c9: [
    'Muốn rời khỏi vải, nó phải đổi thành thứ khác.',
  ],
  c10: [
    'Đi sâu vào cái áo,',
    'mình thấy các sợi vải đan qua nhau.',
  ],
  c11: [
    'Nước nằm ở khe giữa các sợi,',
    'và còn bám trong chính sợi.',
  ],
  c12: [
    'Ở rìa sợi, nó thành vệt trong xơ.',
  ],
  c13: [
    'Muốn rời khỏi vải, nước phải đổi thành hơi nước.',
  ],
  c14: [
    'Mình sẽ đi xem điều đó xảy ra thế nào.',
  ],
  c15: [
    'Ở mặt nước, các phân tử cứ nhảy lung tung.',
  ],
  c16: [
    'Chỉ một phần nhỏ đủ năng lượng để bứt ra ngoài.',
  ],
  c17: [
    'Phân tử bay lên mang theo năng lượng của nó.',
  ],
  c18: [
    'Phần nước còn lại thì mát đi.',
  ],
  c19: [
    'Nước lấy nhiệt từ chính cái vải,',
    'nên vải ướt thành vải lạnh.',
  ],
  c20: [
    'Chạm vào nó, mình thấy lạnh ngay.',
  ],
  c21: [
    'Mỗi gram nước bay hơi lấy hơn hai kilojoule nhiệt từ',
    'chính cái vải.',
  ],
  c22: [
    'Nhưng nước chỉ bay hơi đều hơn khi không khí ngay',
    'trên vải còn trống.',
  ],
  c23: [
    'Chỗ trống đó, hơi nước mới đi được.',
  ],
  c24: [
    'Lớp hơi ẩm ấy bám sát mặt áo,',
    'mỏng như một tấm kính mờ.',
  ],
  c25: [
    'Lớp đó bám sát vải, nhanh chóng bị bão hoà.',
  ],
  c26: [
    'Từ đó, nước bay hơi chậm lại.',
  ],
  c27: [
    'Gió thổi tới, lớp ẩm bị quét đi,',
    'và khí khô thay vào chỗ.',
  ],
  c28: [
    'Gió làm đường đi của hơi nước ngắn lại.',
  ],
  c29: [
    'Gió không sấy nước.',
  ],
  c30: [
    'Gió chở hơi nước đi.',
  ],
  c31: [
    'Gió mạnh hơn, lớp ẩm bị quét xa hơn.',
  ],
  c32: [
    'Nên nước bốc hơi nhanh hơn.',
  ],
  c33: [
    'Đo được: hai cái cân, một áo trước quạt, một ở góc xa.',
  ],
  c34: [
    'Hai cái kim lệch nhau.',
  ],
  c35: [
    'Một thí nghiệm đơn giản trên bàn.',
  ],
  c36: [
    'Hai giọt nước, một bên có gió, một bên không.',
  ],
  c37: [
    'Không có gió thì tốc độ bay hơi rơi còn một nửa.',
  ],
  c38: [
    'Còn lại, ba thứ quyết định tốc độ.',
  ],
  c39: [
    'Nhiệt độ, độ ẩm, và diện tích phơi.',
  ],
  c40: [
    'Ba cái áo phơi chồng lên nhau trên dây thứ hai.',
  ],
  c41: [
    'Không khí ở nhiệt độ này chứa được tối đa khoảng',
    'hai mươi gam hơi nước.',
  ],
  c42: [
    'Tính trên mỗi kilogam không khí khô.',
  ],
  c43: [
    'Đó là trần của nó.',
  ],
  c44: [
    'Nhiệt độ cao hơn thì sức chứa ấy càng cao hơn.',
  ],
  c45: [
    'Ba mươi độ thì hơi nước lan xa hơn, đặc hơn.',
  ],
  c46: [
    'Cùng một luồng gió,',
    'không khí ẩm chín mươi phần trăm làm nước bay hơi',
    'chậm hơn khoảng năm lần.',
  ],
  c47: [
    'Lớp hơi quanh áo mờ đục, hạt hơi nước lơ lửng.',
  ],
  c48: [
    'Chồng áo lên nhau, hay phơi một mặt,',
    'thì diện tích để bốc hơi bị thu hẹp.',
  ],
  c49: [
    'Cái áo úp giữ ẩm lâu hơn cái phơi rộng.',
  ],
  c50: [
    'Quần áo dày giữ nhiều nước hơn,',
    'và cũng giữ lâu hơn áo mỏng.',
  ],
  c51: [
    'Nước tụ ở mép khăn rồi rơi thành giọt.',
  ],
  c52: [
    'Không khí trong phòng không đi đâu cả,',
    'nó quay lại bám quanh cái áo.',
  ],
  c53: [
    'Đó là lý do phơi trong nhà lâu khô hơn.',
  ],
  c54: [
    'Cùng cơ chế đó giải thích vì sao quạt thổi tay lại thấy mát.',
  ],
  c55: [
    'Hơi nước bám trên da bị gió cuốn đi.',
  ],
  c56: [
    'Vậy quần áo khô không phải vì gió sấy nó.',
  ],
  c57: [
    'Quần áo khô vì nước phải đi được.',
  ],
  c58: [
    'Gió chỉ làm cho nước có chỗ để đi.',
  ],
  c59: [
    'Muốn áo khô nhanh, hãy treo ở nơi thoáng gió.',
  ],
  c60: [
    'Phơi cả hai mặt, và không chồng quần áo lên nhau.',
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
