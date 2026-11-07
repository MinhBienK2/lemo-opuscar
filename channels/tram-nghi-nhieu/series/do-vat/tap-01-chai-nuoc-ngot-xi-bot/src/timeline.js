// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c1', 0.35],
  ['c2', 0.45],
  ['c3', 0.4],
  ['c4', 0.45],
  ['c5', 0.5],
  ['c6', 0.45],
  ['c7', 0.45],
  ['c8', 0.4],
  ['c9', 0.4],
  ['c10', 0.45],
  ['c11', 0.5],
  ['c12', 0.6],
];

export const SUBS = {
  c1: [
    'Bạn có bao giờ thắc mắc:',
    'chai nước ngọt khi chưa mở thì phẳng lặng như nước lọc...',
  ],
  c2: [
    'Nhưng vừa vặn nắp một cái,',
    'bọt khí ở đâu lại sôi trào lên dữ dội?',
  ],
  c3: [
    'Bí mật nằm ở thứ đang bị giam cầm bên trong.',
  ],
  c4: [
    'Lúc đóng nắp, nhà sản xuất đã nén khí cacbonic ở áp',
    'suất từ hai đến bốn át-mốt-phe.',
  ],
  c5: [
    'Dưới lực ép khổng lồ này,',
    'một lít nước ngọt có thể giấu tới ba đến bốn lít khí',
    'hòa tan.',
  ],
  c6: [
    'Vừa mở nắp, một luồng khí thoát ra,',
    'áp suất trong chai lập tức tụt về một át-mốt-phe.',
  ],
  c7: [
    'Theo định luật Henry, khi áp suất giảm,',
    'nước không thể giữ lượng khí khổng lồ đó được nữa.',
  ],
  c8: [
    'Các phân tử khí không tự nở giữa khoảng không,',
    'mà lao tới những tâm tạo mầm trên thành chai.',
  ],
  c9: [
    'Từ những vết xước siêu nhỏ, bọt khí bung ra,',
    'phình to và cuồn cuộn nổi lên bề mặt.',
  ],
  c10: [
    'Nếu chai từng bị lắc,',
    'hàng triệu vi bọt có sẵn sẽ kích hoạt phản ứng dây',
    'chuyền, đẩy bọt trào ra ngoài.',
  ],
  c11: [
    'Muốn không bị ướt tay,',
    'chỉ cần vặn hé nắp thật chậm để áp suất thoát ra từ từ.',
  ],
  c12: [
    'Giờ thì bạn đã hiểu vì sao bọt lại xì rồi đấy.',
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
