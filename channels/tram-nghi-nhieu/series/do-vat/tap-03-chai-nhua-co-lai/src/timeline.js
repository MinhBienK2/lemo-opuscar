// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c1', 2.4],
  ['c2', 0.2],
  ['c3', 0.45],
  ['c4', 0.9],
  ['c5', 0.2],
  ['c6', 0.45],
  ['c7', 0.2],
  ['c8', 0.2],
  ['c9', 0.3],
  ['c10', 0.3],
  ['c11', 0.2],
  ['c12', 0.3],
  ['c13', 0.45],
  ['c14', 0.3],
  ['c15', 0.3],
  ['c16', 0.6],
  ['c17', 0.3],
  ['c18', 0.45],
  ['c19', 0.2],
  ['c20', 0.2],
  ['c21', 0.2],
  ['c22', 0.3],
  ['c23', 0.5],
  ['c24', 0.3],
  ['c25', 0.2],
  ['c26', 0.3],
  ['c27', 0.2],
  ['c28', 0.25],
  ['c29', 0.4],
  ['c30', 0.4],
  ['c31', 0.7],
  ['c32', 0.3],
  ['c33', 0.2],
  ['c34', 0.3],
  ['c35', 0.4],
  ['c36', 0.2],
  ['c37', 0.25],
  ['c38', 0.25],
  ['c39', 0.25],
  ['c40', 0.45],
  ['c41', 0.3],
  ['c42', 0.4],
  ['c43', 0.25],
  ['c44', 0.4],
  ['c45', 0.5],
  ['c46', 0.2],
  ['c47', 0.35],
  ['c48', 0.4],
  ['c49', 0.2],
  ['c50', 0.2],
  ['c51', 0.5],
  ['c52', 0.6],
  ['c53', 0.8],
  ['c54', 0.2],
  ['c55', 0.2],
  ['c56', 0.4],
  ['c57', 0.3],
  ['c58', 0.4],
  ['c59', 0.5],
  ['c60', 0.3],
  ['c61', 0.3],
  ['c62', 0.2],
  ['c63', 1.2],
];

export const SUBS = {
  c1: [
    'Cái chai này vừa được rót nước sôi vào.',
  ],
  c2: [
    'Nó đang co lại, và thành chai bắt đầu nhăn.',
  ],
  c3: [
    'Mình thấy chuyện này ở bàn bếp,',
    'gần như ngày nào cũng có.',
  ],
  c4: [
    'Vì sao một cái chai nhựa lại nhớ được hình cũ của nó?',
  ],
  c5: [
    'Mình sẽ làm thử với hai chai giống hệt nhau.',
  ],
  c6: [
    'Câu trả lời nằm ở chỗ chai được làm ra thế nào.',
  ],
  c7: [
    'Người ta không cắt ra, mà thổi ra.',
  ],
  c8: [
    'Thổi từ một mẩu nhựa nhỏ xíu.',
  ],
  c9: [
    'Mẩu nhựa đó được bơm khí, nong dần thành hình chai.',
  ],
  c10: [
    'Trong lúc nong, vật liệu bị kéo căng theo hai hướng.',
  ],
  c11: [
    'Một hướng quanh thân chai, một hướng dọc thân chai.',
  ],
  c12: [
    'Hai hướng đó không giãn giống nhau.',
  ],
  c13: [
    'Và trong lớp nhựa đó có một thứ mà mắt thường không thấy.',
  ],
  c14: [
    'Những móc xích dài, bị kéo căng,',
    'ôm lấy hình dạng của chai.',
  ],
  c15: [
    'Nhựa không có trí nhớ.',
  ],
  c16: [
    'Nhưng cái hình bị kéo căng thì có.',
  ],
  c17: [
    'Bây giờ mình rót nước sôi vào.',
  ],
  c18: [
    'Nhiệt kế bếp chỉ một trăm độ.',
  ],
  c19: [
    'Nước sôi nóng hơn cái mức thành chai chịu được.',
  ],
  c20: [
    'Nhiệt lấy từ nước, chạy vào thành nhựa.',
  ],
  c21: [
    'Nó chui vào tận lớp móc xích bên trong.',
  ],
  c22: [
    'Miệng chai thì hơi nước bốc lên thành cột.',
  ],
  c23: [
    'Còn cái mốc để vật liệu mềm là khoảng bảy mươi độ.',
  ],
  c24: [
    'Từ mốc đó, nhựa PET mềm đi.',
  ],
  c25: [
    'Bên trong, vật liệu đang từ từ trượt ra khỏi chỗ cũ.',
  ],
  c26: [
    'Chỗ nào mềm đi, thì chỗ đó trượt.',
  ],
  c27: [
    'Các móc xích bên trong không còn giữ được hình dạng',
    'của chai.',
  ],
  c28: [
    'Thành chai co về hình cũ.',
  ],
  c29: [
    'Hình cũ là hình của mẩu nhựa lúc đầu.',
  ],
  c30: [
    'Đó là lý do chai co lại.',
  ],
  c31: [
    'Nhưng tại sao thành chai nhăn, chứ không co đều?',
  ],
  c32: [
    'Có lẽ vì hai hướng đó co lại không giống nhau.',
  ],
  c33: [
    'Chỗ bị kéo căng nhiều hơn thì co nhiều hơn.',
  ],
  c34: [
    'Co lệch nhau, nên lớp nhựa gấp thành nếp dọc thân.',
  ],
  c35: [
    'Nhưng còn một lực nữa, chạy ngược lại.',
  ],
  c36: [
    'Trong chai có không khí.',
  ],
  c37: [
    'Bàn tay vặn nắp lên miệng chai.',
  ],
  c38: [
    'Nắp vặn kín, không khí đó không ra được.',
  ],
  c39: [
    'Nó nóng lên thì nở ra, đẩy thành chai ra.',
  ],
  c40: [
    'Chai phồng lên, chứ không co.',
  ],
  c41: [
    'Chiếc đồng hồ này chỉ áp suất bên trong chai.',
  ],
  c42: [
    'Kim đang chỉ lên.',
  ],
  c43: [
    'Còn chai hở nắp thì khí thoát ra được.',
  ],
  c44: [
    'Không có gì đẩy, nên nó chỉ còn một việc: co lại.',
  ],
  c45: [
    'Vậy cái nào thắng, là tùy nắp đang đậy hay không.',
  ],
  c46: [
    'Đậy kín lúc còn nóng thì phồng.',
  ],
  c47: [
    'Không đậy thì co.',
  ],
  c48: [
    'Còn một trường hợp nữa, mình thấy khá nhiều.',
  ],
  c49: [
    'Cái chai vừa phồng kia,',
    'để nguội thì khí trong chai co lại.',
  ],
  c50: [
    'Bên trong thành, áp suất thấp hơn bên ngoài.',
  ],
  c51: [
    'Nó bị hút vào, méo vào trong.',
  ],
  c52: [
    'Hai cái chai, ba trạng thái, một cơ chế.',
  ],
  c53: [
    'Vậy nước nóng làm chai co lại vì cái gì?',
  ],
  c54: [
    'Vì thành chai được kéo giãn lúc thổi khuôn.',
  ],
  c55: [
    'Và vì nóng quá mốc bảy mươi độ, nhựa mềm đi.',
  ],
  c56: [
    'Các móc xích trượt về hình cũ, nên chai co.',
  ],
  c57: [
    'Chai không co vì sợ nóng.',
  ],
  c58: [
    'Nó co vì cái hình mới của nó chỉ là hình được kéo căng.',
  ],
  c59: [
    'Còn cái nắp thì quyết định cái nào thắng.',
  ],
  c60: [
    'Vậy nên rót nước sôi vào chai nhựa thường là không nên.',
  ],
  c61: [
    'Chai nhựa thường mềm đi và nhăn trước khi kịp nguội.',
  ],
  c62: [
    'Muốn có nước nóng trong chai thì cứ chờ một chút.',
  ],
  c63: [
    'Nước nguội bớt rồi hãy vặn nắp.',
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
