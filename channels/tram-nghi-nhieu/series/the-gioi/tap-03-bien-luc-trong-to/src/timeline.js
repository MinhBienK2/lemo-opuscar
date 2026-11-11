// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c01', 2.4],
  ['c02', 0.55],
  ['c03', 1.0],
  ['c04', 1.0],
  ['c05', 0.55],
  ['c06', 0.65],
  ['c07', 0.85],
  ['c08', 0.55],
  ['c09', 0.75],
  ['c10', 0.85],
  ['c11', 0.55],
  ['c12', 0.95],
  ['c13', 0.7],
  ['c14', 0.8],
  ['c15', 0.85],
  ['c16', 0.6],
  ['c17', 0.9],
  ['c18', 0.75],
  ['c19', 0.7],
  ['c20', 1.0],
  ['c21', 0.6],
  ['c22', 0.65],
  ['c23', 0.95],
  ['c24', 0.6],
  ['c25', 0.9],
  ['c26', 0.65],
  ['c27', 0.6],
  ['c28', 1.1],
  ['c29', 0.7],
  ['c30', 1.0],
  ['c31', 0.7],
  ['c32', 0.7],
  ['c33', 0.9],
  ['c34', 0.75],
  ['c35', 1.15],
  ['c36', 0.7],
  ['c37', 1.0],
];

export const SUBS = {
  c01: [
    'Chiều muộn, trên sân thượng nhà,',
    'Mặt Trời đang lặn sát chân trời.',
  ],
  c02: [
    'Chân trời đỏ rực, phần trời cao còn xanh,',
    'và tờ giấy trắng đặt trên lan can thì nhuốm màu cam.',
  ],
  c03: [
    'Trời đổi màu theo giờ,',
    'hay là chỗ này có sẵn một màu riêng của nó?',
  ],
  c04: [
    'Để biết câu trả lời nằm ở đâu,',
    'mình vào trong không khí mà nhìn.',
  ],
  c05: [
    'Ở đây, một chùm sáng trắng của Mặt Trời đi ngang qua',
    'một lớp hạt nhỏ.',
  ],
  c06: [
    'Mỗi hạt sát chùm sáng rực lên rồi ném ra một dòng',
    'sáng sang bên, và có dòng bay về phía ta.',
  ],
  c07: [
    'Ta thấy màu của những dòng sáng bị rẽ ấy,',
    'chứ không phải màu của chùm sáng đi thẳng.',
  ],
  c08: [
    'Màu nào rẽ mạnh hơn thì ta thấy màu ấy.',
  ],
  c09: [
    'Màu xanh rẽ mạnh hơn màu đỏ khoảng chín lần.',
  ],
  c10: [
    'Nên khi ngước lên,',
    'ta thấy ánh sáng xanh bị rẽ về từ mọi hướng.',
  ],
  c11: [
    'Đó là lý do bầu trời trên cao mang màu xanh.',
  ],
  c12: [
    'Nhưng có một thứ khác với chùm sáng đi thẳng vào mắt ta.',
  ],
  c13: [
    'Chùm ấy không bị rẽ,',
    'và nó phải đi qua không khí trên suốt đường đi của chính nó.',
  ],
  c14: [
    'Mặt Trời càng xuống thấp,',
    'đường đi của chùm sáng thẳng ấy càng dài hơn.',
  ],
  c15: [
    'Ở chân trời, nó dài gấp khoảng ba mươi tám lần đường',
    'đi lúc trưa.',
  ],
  c16: [
    'Cứ mỗi lớp hạt dày thêm một chút là thêm một lần đi',
    'qua không khí.',
  ],
  c17: [
    'Đi qua lớp không khí dày ấy,',
    'chùm sáng mất gần hết màu xanh.',
  ],
  c18: [
    'Trong tia chỉ còn khoảng hai phẩy năm phần trăm màu xanh.',
  ],
  c19: [
    'Còn màu đỏ thì vẫn còn khoảng mười lăm phần trăm.',
  ],
  c20: [
    'Nên Mặt Trời ta nhìn thấy lúc này là màu đỏ.',
  ],
  c21: [
    'Mọi thứ dưới ánh sáng ấy cũng đổi màu theo.',
  ],
  c22: [
    'Tờ giấy trắng trên lan can,',
    'mặt tường và mặt nước trong thùng đều nhuốm cam.',
  ],
  c23: [
    'Nhưng cùng lúc ấy, phần trời cao vẫn còn xanh.',
  ],
  c24: [
    'Vì ánh sáng ở trên cao chỉ đi qua ít không khí.',
  ],
  c25: [
    'Sát chân trời lại còn một dải nhạt, gần như trắng.',
  ],
  c26: [
    'Trong không khí có hạt bụi mờ,',
    'to hơn hạt không khí rất nhiều.',
  ],
  c27: [
    'Hạt bụi không rẽ mạnh, nó chỉ làm nhoè màu,',
    'nên dải ấy nhạt gần như trắng.',
  ],
  c28: [
    'Sau khi Mặt Trời lặn,',
    'trời không tắt ngay mà còn xanh thêm một lúc nữa.',
  ],
  c29: [
    'Nhìn từ không gian,',
    'vùng sáng còn hẹp chạy vòng quanh chân trời Trái Đất.',
  ],
  c30: [
    'Cái xanh ấy là của ozon:',
    'ở trên cao có một lớp rất mỏng,',
    'mỏng hơn lớp không khí.',
  ],
  c31: [
    'Chùm sáng cam đỏ đi qua lớp mỏng ấy thì phần đỏ bị',
    'nuốt, chỉ màu xanh lọt qua.',
  ],
  c32: [
    'Màu xanh lọt qua ấy rọi xuống mặt đêm,',
    'và nó quyết định màu của cả giờ xanh.',
  ],
  c33: [
    'Màu xanh ấy chỉ kéo dài khi Mặt Trời lặn chưa quá xa.',
  ],
  c34: [
    'Từ lúc Mặt Trời vừa lặn cho tới khi lặn sâu sáu độ',
    'dưới chân trời, vùng sáng vẫn còn xanh như thế.',
  ],
  c35: [
    'Màu trời, hóa ra,',
    'là bản ghi của đường đi ánh sáng trong không khí.',
  ],
  c36: [
    'Tờ giấy trắng trên lan can giờ không còn trắng nữa,',
    'mà xanh nhạt.',
  ],
  c37: [
    'Nó lấy đúng màu của thứ sáng đang rọi xuống,',
    'và lúc này thứ sáng ấy là màu xanh của giờ xanh.',
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
