// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c1', 2.4],
  ['c2', 0.3],
  ['c3', 0.3],
  ['c4', 0.7],
  ['c5', 0.9],
  ['c6', 0.9],
  ['c7', 0.3],
  ['c8', 0.3],
  ['c9', 0.3],
  ['c10', 0.9],
  ['c11', 0.4],
  ['c12', 0.9],
  ['c13', 0.3],
  ['c14', 0.5],
  ['c15', 0.3],
  ['c16', 0.3],
  ['c17', 0.4],
  ['c18', 0.5],
  ['c19', 0.6],
  ['c20', 0.3],
  ['c21', 0.7],
  ['c22', 0.4],
  ['c23', 0.5],
  ['c24', 0.9],
  ['c25', 0.3],
  ['c26', 0.3],
  ['c27', 0.5],
  ['c28', 0.8],
  ['c29', 0.5],
  ['c30', 0.4],
  ['c31', 0.5],
  ['c32', 0.6],
  ['c33', 0.4],
  ['c34', 0.7],
  ['c35', 0.4],
  ['c36', 0.6],
  ['c37', 0.7],
  ['c38', 0.4],
  ['c39', 0.5],
  ['c40', 0.5],
  ['c41', 0.9],
  ['c69', 0.5],
  ['c70', 0.4],
  ['c71', 0.4],
  ['c72', 0.6],
  ['c73', 0.8],
  ['c74', 0.5],
  ['c75', 0.5],
  ['c76', 0.9],
  ['c77', 0.7],
  ['c78', 0.4],
  ['c42', 0.8],
  ['c43', 0.3],
  ['c44', 0.6],
  ['c45', 0.5],
  ['c46', 0.5],
  ['c47', 0.5],
  ['c48', 0.4],
  ['c49', 0.7],
  ['c50', 0.3],
  ['c51', 0.4],
  ['c52', 0.8],
  ['c53', 0.3],
  ['c54', 0.6],
  ['c55', 0.7],
  ['c56', 0.4],
  ['c57', 0.6],
  ['c58', 0.4],
  ['c59', 0.5],
  ['c60', 0.9],
  ['c61', 0.4],
  ['c62', 0.4],
  ['c63', 0.6],
  ['c64', 0.6],
  ['c65', 0.4],
  ['c66', 0.9],
  ['c67', 0.5],
  ['c68', 0.6],
  ['c79', 0.6],
  ['c80', 0.7],
  ['c81', 0.5],
  ['c82', 0.5],
  ['c83', 0.5],
  ['c84', 0.7],
  ['c85', 0.5],
  ['c86', 0.4],
  ['c87', 0.4],
  ['c88', 0.4],
  ['c89', 0.5],
  ['c90', 0.6],
  ['c91', 0.8],
  ['c94', 0.4],
  ['c95', 2.2],
];

export const SUBS = {
  c1: [
    'Điện thoại nằm sấp trên bàn cạnh giường,',
    'dây cắm thẳng vào ổ.',
  ],
  c2: [
    'Cái đồng hồ sạc trên màn hình cứ nhích lên từng chút một.',
  ],
  c3: [
    'Và cái máy này, mình vừa cầm lên.',
  ],
  c4: [
    'Ấm. Rõ ràng là nóng ở mặt lưng.',
  ],
  c5: [
    'Vì sao điện thoại nóng lúc sạc?',
  ],
  c6: [
    'Mình sẽ lần theo dòng điện,',
    'từ ổ cắm vào tận trong máy.',
  ],
  c7: [
    'Nhìn kỹ thì có một quy luật rất đơn giản.',
  ],
  c8: [
    'Điện chạy vào nhiều hơn điện nạp được vào pin.',
  ],
  c9: [
    'Phần điện không kịp nạp thì không biến mất đâu.',
  ],
  c10: [
    'Nó thành nhiệt.',
  ],
  c11: [
    'Hạt màu xanh này là dòng điện. Hạt đỏ tách ra, là nhiệt.',
  ],
  c12: [
    'Vậy cứ đi theo dòng hạt xanh,',
    'xem nhiệt sinh ra ở đâu.',
  ],
  c13: [
    'Ổ cắm này cấp điện, chạy qua dây nguồn vào củ sạc.',
  ],
  c14: [
    'Trên nhãn in ở vỏ ghi sáu mươi oát.',
  ],
  c15: [
    'Nhiệm vụ của nó rất đơn giản.',
  ],
  c16: [
    'Đổi điện xoay chiều ở ổ thành điện một chiều.',
  ],
  c17: [
    'Mà việc đổi ấy, không bao giờ trọn vẹn.',
  ],
  c18: [
    'Một phần điện bị thất thoát ngay trong lúc đi qua đó.',
  ],
  c19: [
    'Chỗ đổi điện ấy, nằm ngay trong củ sạc.',
  ],
  c20: [
    'Dòng chạy qua đó, và một phần bị cản lại.',
  ],
  c21: [
    'Hao hụt thành nhiệt.',
  ],
  c22: [
    'Những hạt cam này, là phần điện bị thất thoát ở đây.',
  ],
  c23: [
    'Nó nóng lên ở vỏ củ sạc,',
    'và đó là chuyện bình thường.',
  ],
  c24: [
    'Nhưng một việc ấy thôi.',
    'Điện thoại thì phải làm nhiều hơn.',
  ],
  c25: [
    'Đây là điện thoại, bị cưa ngang.',
  ],
  c26: [
    'Cổng USB-C nối vào bo mạch.',
  ],
  c27: [
    'Bo mạch nối tới túi pin.',
  ],
  c28: [
    'Cổng đưa vào hai mươi volt.',
    'Pin chỉ nhận được khoảng bốn volt.',
  ],
  c29: [
    'Nên giữa đường, phải có một mạch hạ điện áp.',
  ],
  c30: [
    'Mạch đó là một con chip, một con tụ,',
    'và một cuộn cảm dây đồng.',
  ],
  c31: [
    'Dòng chạy qua nó. Mà dây đồng thì có điện trở.',
  ],
  c32: [
    'Chỗ nào dòng điện bị cản, chỗ đó nóng.',
  ],
  c33: [
    'Nhìn: hạt xanh chuyển sang cam ngay ở cuộn cảm.',
  ],
  c34: [
    'Đây là nơi sinh nhiệt thứ hai.',
  ],
  c35: [
    'Còn một phần dòng thì rơi xuống nạp vào pin.',
  ],
  c36: [
    'Phần này được giữ lại trong pin. Không mất.',
  ],
  c37: [
    'Nhưng máy không chỉ sạc. Máy đang chạy.',
  ],
  c38: [
    'Màn hình sáng, tin nhắn, thông báo, game.',
  ],
  c39: [
    'Tất cả chạy trên một con chip.',
    'Và con chip đó cũng nóng.',
  ],
  c40: [
    'Đây là dòng thứ hai, chạy từ pin lên chip.',
  ],
  c41: [
    'Vậy lúc vừa sạc vừa dùng,',
    'máy có hai chỗ sinh nhiệt cùng lúc.',
  ],
  c69: [
    'Còn một điều nữa: sạc nhanh.',
  ],
  c70: [
    'Sạc nhanh thì dòng điện lớn hơn nhiều.',
  ],
  c71: [
    'Máy vẫn nạp qua cùng một cuộn cảm đó.',
  ],
  c72: [
    'Trong cuộn cảm,',
    'nhiệt sinh ra theo bình phương dòng điện.',
  ],
  c73: [
    'Nên dòng to hơn, mà hạt đỏ thì nhiều hơn hẳn.',
  ],
  c74: [
    'Có máy có cảm biến nhiệt đặt trong pin.',
  ],
  c75: [
    'Cảm biến đó đo nhiệt độ của pin.',
  ],
  c76: [
    'Quanh bốn mươi lăm độ, tế bào pin không nên sạc nữa.',
  ],
  c77: [
    'Vạch đỏ đó là mốc của tế bào pin,',
    'không phải nhiệt độ mặt lưng.',
  ],
  c78: [
    'Nóng quá thì máy tự giảm dòng sạc.',
  ],
  c42: [
    'Ngoài hai chỗ ấy, còn một chỗ nữa: chính là túi pin.',
  ],
  c43: [
    'Cả cái túi là nhiều lớp mỏng xếp chồng.',
  ],
  c44: [
    'Đồng, graphite, lớp cách điện, rồi nhôm.',
  ],
  c45: [
    'Mỏng như tờ giấy, và dính sát vào nhau.',
  ],
  c46: [
    'Trong lúc nạp,',
    'dòng điện bị điện trở bên trong tế bào cản lại.',
  ],
  c47: [
    'Cản lại thì sinh nhiệt, ngay ở trong pin.',
  ],
  c48: [
    'Nhiệt ấy không thoát ra ngoài được.',
  ],
  c49: [
    'Nó lan đều trong túi pin, làm cả cục pin ấm lên.',
  ],
  c50: [
    'Giờ gom lại: mạch sạc, cục pin, và con chip.',
  ],
  c51: [
    'Cả ba cùng đổ nhiệt vào một chỗ.',
  ],
  c52: [
    'Đó là vỏ máy.',
  ],
  c53: [
    'Vỏ máy là tản nhiệt của cả cái máy.',
  ],
  c54: [
    'Nó nóng lên, rồi tỏa ra không khí.',
  ],
  c55: [
    'Nên lưng máy nóng.',
  ],
  c56: [
    'Tay người là một miếng tản nhiệt lớn hơn không khí nhiều.',
  ],
  c57: [
    'Cầm lên là thấy nóng ngay.',
  ],
  c58: [
    'Còn cái ốp case thì giống một chiếc áo khoác giữ nhiệt.',
  ],
  c59: [
    'Nó giữ nhiệt lại quanh máy,',
    'không cho nhiệt thoát ra.',
  ],
  c60: [
    'Nên máy có case sẽ nóng hơn máy không case.',
  ],
  c61: [
    'Mình thử: hai chiếc máy giống nhau, cùng sạc, cùng một chỗ.',
  ],
  c62: [
    'Cái này có case, cái kia không.',
  ],
  c63: [
    'Nhiệt kế đặt trên lưng mỗi cái.',
  ],
  c64: [
    'Cột nhiệt kế này dốc lên nhanh hơn.',
  ],
  c65: [
    'Cái kia dốc lên chậm hơn.',
  ],
  c66: [
    'Cái này là đo được, không phải đoán.',
  ],
  c67: [
    'Mình quay lại cái bàn cạnh giường.',
  ],
  c68: [
    'Cái máy vẫn cắm sạc, màn hình vẫn sáng,',
    'và nó vẫn nóng.',
  ],
  c79: [
    'Vậy cái nóng lúc sạc là bình thường.',
  ],
  c80: [
    'Đó là máy đang làm việc, không phải máy đang hỏng.',
  ],
  c81: [
    'Có một loại nóng khác, loại này mới đáng lo.',
  ],
  c82: [
    'Nóng khi không cắm sạc.',
  ],
  c83: [
    'Hoặc nóng lệch một chỗ, ở một góc lưng máy.',
  ],
  c84: [
    'Lúc đó thì mình không tự đoán được nguyên nhân.',
  ],
  c85: [
    'Còn với cái nóng lúc sạc, mình làm được mấy việc.',
  ],
  c86: [
    'Sạc lâu thì bỏ ốp case ra.',
  ],
  c87: [
    'Dùng củ sạc đúng chuẩn của máy.',
  ],
  c88: [
    'Sạc chậm thì dòng vào máy ít hơn.',
  ],
  c89: [
    'Đừng vừa sạc vừa chơi game.',
  ],
  c90: [
    'Vì lúc đó máy có hai chỗ sinh nhiệt cùng lúc.',
  ],
  c91: [
    'Và nếu máy nóng bất thường, rút sạc ra,',
    'mang đi kiểm tra.',
  ],
  c94: [
    'Máy không hỏng.',
  ],
  c95: [
    'Nó đang làm việc.',
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
