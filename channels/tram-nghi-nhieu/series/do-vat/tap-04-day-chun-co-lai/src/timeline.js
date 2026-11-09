// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c1', 2.4],
  ['c2', 0.45],
  ['c3', 0.2],
  ['c4', 0.45],
  ['c5', 0.2],
  ['c6', 0.45],
  ['c7', 0.2],
  ['c8', 0.45],
  ['c9', 2.4],
  ['c10', 0.2],
  ['c11', 0.45],
  ['c12', 0.2],
  ['c13', 0.45],
  ['c14', 0.2],
  ['c15', 0.45],
  ['c16', 0.2],
  ['c17', 0.45],
  ['c18', 0.2],
  ['c19', 0.45],
  ['c20', 0.2],
  ['c21', 0.45],
  ['c22', 0.2],
  ['c23', 0.45],
  ['c24', 0.2],
  ['c25', 0.45],
  ['c26', 0.2],
  ['c27', 0.45],
  ['c28', 2.4],
  ['c29', 0.2],
  ['c30', 0.45],
  ['c31', 0.2],
  ['c32', 0.45],
  ['c33', 0.2],
  ['c34', 0.45],
  ['c35', 0.2],
  ['c36', 0.45],
  ['c37', 0.2],
  ['c38', 0.45],
  ['c39', 0.45],
  ['c40', 0.2],
  ['c41', 0.45],
  ['c42', 2.4],
  ['c43', 0.2],
  ['c44', 0.45],
  ['c45', 0.2],
  ['c46', 0.45],
  ['c47', 0.2],
  ['c48', 0.45],
];

export const SUBS = {
  c1: [
    'Một sợi dây chun quấn quanh nắp một hũ thủy tinh',
    'trên mặt bếp.',
  ],
  c2: [
    'Bây giờ mình thổi hơi nóng vào nó.',
  ],
  c3: [
    'Nhìn kỹ thì thấy dây đang siết chặt vào nắp hũ hơn trước.',
  ],
  c4: [
    'Cùng một sợi thép mỏng,',
    'hơi nóng phả vào thì nó dãn ra.',
  ],
  c5: [
    'Còn một vòng dây chùng chưa kéo gì,',
    'nóng lên thì nó dài ra.',
  ],
  c6: [
    'Vậy cao su không phải lúc nào cũng co khi nóng.',
  ],
  c7: [
    'Vì sao lại như vậy?',
  ],
  c8: [
    'Câu trả lời nằm ở bên trong sợi dây.',
  ],
  c9: [
    'Bên trong dây chun không có lò xo nào cả.',
  ],
  c10: [
    'Ở trong là một mạng chuỗi polymer,',
    'mỗi chuỗi là một dãy mắt xích dài.',
  ],
  c11: [
    'Các chuỗi quấn vào nhau thành một mạng,',
    'có móc nối chúng không cho trượt.',
  ],
  c12: [
    'Ở trạng thái tự nhiên,',
    'mỗi chuỗi cuộn tròn một cách ngẫu nhiên.',
  ],
  c13: [
    'Một sợi chuỗi cuộn như vậy có rất nhiều cách cuộn khác nhau.',
  ],
  c14: [
    'Cùng số mắt xích,',
    'nhưng xếp khác đi thì là một cách khác.',
  ],
  c15: [
    'Tổng số những cách sắp xếp đó,',
    'người ta gọi là entropy.',
  ],
  c16: [
    'Entropy càng nhiều, mọi thứ càng dễ xáo trộn.',
  ],
  c17: [
    'Và chuỗi luôn ham quay về chỗ nào có nhiều cách cuộn hơn.',
  ],
  c18: [
    'Bây giờ mình kéo dây ra.',
  ],
  c19: [
    'Các chuỗi bị kéo thẳng,',
    'những đoạn cuộn biến mất hết.',
  ],
  c20: [
    'Những cách cuộn đó không còn nữa, entropy tụt xuống.',
  ],
  c21: [
    'Đó là lý do dây tự co lại,',
    'không phải vì móc nối giữ chuỗi,',
    'mà vì chuỗi ham quay về chỗ có nhiều cách cuộn hơn.',
  ],
  c22: [
    'Sức co ấy không cố định, nó đổi theo nhiệt độ.',
  ],
  c23: [
    'Và mấu chốt là lực co đó tỉ lệ với nhiệt độ tuyệt đối.',
  ],
  c24: [
    'Nóng hơn thì lực co của mạng chuỗi lớn hơn ở cùng',
    'một độ giãn.',
  ],
  c25: [
    'Ở cùng một mức kéo, dây nóng co chặt hơn dây mát.',
  ],
  c26: [
    'Nếu dây đang giữ một vật nặng,',
    'nóng lên thì nó phải ngắn lại.',
  ],
  c27: [
    'Đó là lý do dây chun co lại khi hơi nóng.',
  ],
  c28: [
    'Để kiểm chứng, mình làm phép đo.',
  ],
  c29: [
    'Một sợi dây chun, một vật nặng treo ở một đầu,',
    'một thước để đo chiều dài.',
  ],
  c30: [
    'Ở hai mươi độ, dây đứng ở vị trí này.',
  ],
  c31: [
    'Lần này mình làm có đo: thổi hơi nóng vào dây.',
  ],
  c32: [
    'Nhiệt kế lên sáu mươi độ.',
  ],
  c33: [
    'Và dây đã ngắn lại, vật nặng được nâng lên.',
  ],
  c34: [
    'Không phải dây bị co vì nguội đi,',
    'nó đang nóng hơn trước.',
  ],
  c35: [
    'Mình đo lực co ở cùng một độ giãn,',
    'lúc mát và lúc nóng.',
  ],
  c36: [
    'Lực co mạnh lên khoảng mười bốn phần trăm.',
  ],
  c37: [
    'Đường lực–giãn của cao su cũng chẳng giống thép.',
  ],
  c38: [
    'Kéo dây chun ra xa thêm,',
    'lực co không tăng đều như thép, mà vọt lên ở cuối.',
  ],
  c39: [
    'Ngược chiều với lúc nãy,',
    'kéo dây chun thật nhanh thì dây nóng lên.',
  ],
  c40: [
    'Người ta đo được hiệu ứng này từ thế kỷ mười tám.',
  ],
  c41: [
    'Cao su giữ nhiệt kém lắm,',
    'nên chỉ một ít nhiệt sinh ra khi kéo cũng đủ làm dây',
    'nóng lên mấy độ.',
  ],
  c42: [
    'Quay lại cái nắp hũ lúc nãy, một nắp ấm,',
    'một nắp vừa lấy ra từ tủ lạnh.',
  ],
  c43: [
    'Trên nắp ấm, dây siết hơn;',
    'quanh nắp lạnh thì lỏng hơn.',
  ],
  c44: [
    'Cái co lại này không phải mẹo vặt của cao su.',
  ],
  c45: [
    'Đó là hệ quả tất yếu của vật liệu mà sức co đến từ',
    'sự hỗn loạn của vô số chuỗi.',
  ],
  c46: [
    'Chỉ khi dây đang bị kéo căng thì nóng lên mới co lại.',
  ],
  c47: [
    'Nên khi bạn muốn một sợi dây siết chặt,',
    'hãy hâm nó nóng trước, rồi quấn lên nắp hũ.',
  ],
  c48: [
    'Dây ăn sâu vào nắp,',
    'luồng khí nóng vẫn bốc lên từ máy sấy tóc.',
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
