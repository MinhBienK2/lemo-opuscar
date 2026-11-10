// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c1', 2.4],
  ['c2', 0.2],
  ['c3', 0.45],
  ['c4', 0.2],
  ['c5', 0.6],
  ['c6', 0.2],
  ['c7', 0.6],
  ['c8', 0.2],
  ['c9', 0.2],
  ['c10', 0.45],
  ['c11', 0.2],
  ['c12', 0.6],
  ['c13', 0.2],
  ['c14', 0.45],
  ['c15', 0.2],
  ['c16', 0.6],
  ['c17', 0.2],
  ['c18', 0.6],
  ['c19', 0.2],
  ['c20', 0.45],
  ['c21', 0.2],
  ['c22', 0.2],
  ['c23', 0.6],
  ['c24', 0.2],
  ['c25', 0.6],
  ['c26', 0.2],
  ['c27', 0.2],
  ['c28', 0.7],
  ['c29', 0.2],
  ['c30', 0.2],
  ['c31', 0.6],
  ['c32', 0.2],
  ['c33', 0.2],
  ['c34', 0.7],
  ['c35', 0.2],
  ['c36', 0.8],
  ['c37', 0.2],
  ['c38', 0.2],
  ['c39', 0.6],
  ['c40', 0.2],
  ['c41', 0.6],
  ['c42', 0.2],
  ['c43', 0.2],
  ['c44', 0.7],
  ['c45', 0.2],
  ['c46', 0.2],
  ['c47', 0.8],
  ['c48', 0.2],
];

export const SUBS = {
  c1: [
    'Buổi sáng, một chiếc nồi cơm điện đang nấu trên mặt',
    'bàn gỗ dưới cửa sổ.',
  ],
  c2: [
    'Nó không có mắt, không có mũi,',
    'cũng không nếm được gì cả.',
  ],
  c3: [
    'Rồi đến lúc nào đó,',
    'đèn trên thân nồi tự chuyển từ đỏ sang hổ phách.',
  ],
  c4: [
    'Tiếng sôi tắt hẳn, và nồi vừa tự biết cơm chín.',
  ],
  c5: [
    'Nhưng nói thật thì, nó không biết cơm chín là gì.',
  ],
  c6: [
    'Nó chỉ biết một thứ thôi: nhiệt.',
  ],
  c7: [
    'Dưới đáy nồi có một mâm nhiệt tròn,',
    'quanh thành là dây điện trở xoắn lại.',
  ],
  c8: [
    'Ở chính giữa mâm nhiệt,',
    'một viên cầu nhỏ nằm trên lò xo.',
  ],
  c9: [
    'Lò xo ép nó thẳng vào đáy nồi.',
  ],
  c10: [
    'Viên cầu đó là một đầu dò nhiệt:',
    'điện trở của nó tụt xuống khi nó nóng lên.',
  ],
  c11: [
    'Lúc mát là mười kiloôm,',
    'khi nóng lên chỉ còn khoảng một kiloôm.',
  ],
  c12: [
    'Hai dây mảnh đó chạy lên bo mạch bên dưới nồi.',
  ],
  c13: [
    'Ở đó, mạch điện đo điện trở ấy và tính ra một con số',
    'nhiệt độ.',
  ],
  c14: [
    'Và con số đó là nhiệt độ của đáy nồi,',
    'không phải của cơm.',
  ],
  c15: [
    'Cơm nằm ở trên cao, còn cái cảm biến nằm sát đáy.',
  ],
  c16: [
    'Cơm nấu lên thế này:',
    'dây điện trở trong mâm nhiệt nóng lên trước.',
  ],
  c17: [
    'Rồi đáy nồi ấm lên, nước và gạo nóng theo.',
  ],
  c18: [
    'Nước sôi ở khoảng một trăm độ.',
  ],
  c19: [
    'Nhiệt kế cắm trong nồi cũng chỉ ở vạch sôi ấy.',
  ],
  c20: [
    'Còn cơm thì chín sớm hơn nhiều.',
  ],
  c21: [
    'Tinh bột trong hạt gạo bắt đầu hồ hóa từ khoảng sáu mươi độ.',
  ],
  c22: [
    'Và nước thì bị hút vào hạt gạo.',
  ],
  c23: [
    'Nên trong lúc nồi còn sôi, cơm đã chín rồi.',
  ],
  c24: [
    'Vì nước còn trong nồi,',
    'nhiệt độ đáy nồi bị ghim ở vạch sôi ấy,',
    'không lên được cao hơn.',
  ],
  c25: [
    'Vậy nồi làm gì trong lúc đó?',
  ],
  c26: [
    'Nó đứng yên đó, chờ.',
  ],
  c27: [
    'Nhiệt độ đi ngang,',
    'còn đồng hồ trên tường thì cứ chạy.',
  ],
  c28: [
    'Rồi một ngày nọ, nước trong nồi cạn hết.',
  ],
  c29: [
    'Không còn gì để hấp nhiệt nữa.',
  ],
  c30: [
    'Nhiệt độ đáy nồi nhảy vọt lên,',
    'vượt lên trên một trăm độ.',
  ],
  c31: [
    'Và đó chính là tín hiệu.',
  ],
  c32: [
    'Dải sáng chạy trên hai dây về bo mạch cũng chạy',
    'nhanh hơn hẳn.',
  ],
  c33: [
    'Bo mạch ra lệnh, và dây điện trở ở mâm nhiệt tắt đi.',
  ],
  c34: [
    'Rồi nồi chuyển sang giữ ấm:',
    'dây điện trở bật lại theo kiểu bật tắt.',
  ],
  c35: [
    'Cả nồi được giữ ở khoảng bảy mươi độ,',
    'thấp hơn nhiệt độ sôi.',
  ],
  c36: [
    'Cơ chế này có từ trước khi có vi mạch.',
  ],
  c37: [
    'Hồi xưa nồi cơm chỉ có một công tắc nhiệt cơ ở đáy nồi.',
  ],
  c38: [
    'Một thanh lưỡng kim, nóng lên thì cong ra,',
    'bấm tách tiếp điểm.',
  ],
  c39: [
    'Mạch mở, dây điện trở tắt.',
  ],
  c40: [
    'Muốn biết nồi có thật sự đang đo nước không, mình thử.',
  ],
  c41: [
    'Một nồi đổ nhiều nước, một nồi đổ ít nước.',
  ],
  c42: [
    'Nồi bên phải cạn nước trước, nhiệt độ nhảy lên,',
    'đèn chuyển sang giữ ấm.',
  ],
  c43: [
    'Nồi bên trái vẫn còn nước, vẫn đang sôi.',
  ],
  c44: [
    'Như vậy, nồi cơm điện không biết cơm chín.',
  ],
  c45: [
    'Nó biết nước đã cạn.',
  ],
  c46: [
    'May mắn là lúc nước cạn thì cơm cũng vừa chín.',
  ],
  c47: [
    'Lời khuyên thì đơn giản thôi.',
  ],
  c48: [
    'Nếu nồi báo chín muộn bất thường,',
    'hãy xem lại lượng nước bạn đổ.',
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
