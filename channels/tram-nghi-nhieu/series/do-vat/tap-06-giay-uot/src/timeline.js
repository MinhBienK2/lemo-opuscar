// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['c1', 2.4],
  ['c2', 0.26],
  ['c3', 0.26],
  ['c4', 0.26],
  ['c5', 0.26],
  ['c6', 0.26],
  ['c7', 0.26],
  ['c8', 0.26],
  ['c9', 1.3],
  ['c10', 0.26],
  ['c11', 0.26],
  ['c12', 0.26],
  ['c13', 0.26],
  ['c14', 0.26],
  ['c15', 0.26],
  ['c16', 0.26],
  ['c17', 0.26],
  ['c18', 0.26],
  ['c19', 0.26],
  ['c20', 0.26],
  ['c21', 0.26],
  ['c22', 0.26],
  ['c23', 0.26],
  ['c24', 1.3],
  ['c25', 0.26],
  ['c26', 0.26],
  ['c27', 0.26],
  ['c28', 0.26],
  ['c29', 0.26],
  ['c30', 0.26],
  ['c31', 0.26],
  ['c32', 0.26],
  ['c33', 0.26],
  ['c34', 0.26],
  ['c35', 0.26],
  ['c36', 0.26],
  ['c37', 0.26],
  ['c38', 0.26],
  ['c39', 0.26],
  ['c40', 0.26],
  ['c41', 0.26],
  ['c42', 0.26],
  ['c43', 0.26],
];

export const SUBS = {
  c1: [
    'Mình vừa rửa tay, chạm vào tờ giấy trên quầy bếp,',
    'và nó rách ngay.',
  ],
  c2: [
    'Chỉ một chút nước thôi.',
  ],
  c3: [
    'Tay khô chạm vào tờ giấy bên cạnh thì không sao.',
  ],
  c4: [
    'Vậy tay không phải thủ phạm; nước mới là thủ phạm.',
  ],
  c5: [
    'Và tờ giấy ướt thì còn dễ rách hơn nữa: mềm, nhăn,',
    'kéo nhẹ là đứt.',
  ],
  c6: [
    'Tại sao một chút nước lại làm thay đổi thứ vốn rất',
    'bền như thế?',
  ],
  c7: [
    'Câu trả lời nằm ở bên trong tờ giấy.',
  ],
  c8: [
    'Mình thò máy quay vào tờ giấy xem.',
  ],
  c9: [
    'Ở đó chỉ là những sợi cellulose đan vào nhau.',
  ],
  c10: [
    'Mỗi sợi có những nhóm hydroxyl dính ra hai bên.',
  ],
  c11: [
    'Ở chỗ hai sợi chạm nhau,',
    'các nhóm hydroxyl bám vào nhau bằng liên kết hydrogen.',
  ],
  c12: [
    'Đó là thứ giữ cho tờ giấy chịu được lực kéo.',
  ],
  c13: [
    'Nước tới — và nước cũng tạo ra liên kết hydrogen.',
  ],
  c14: [
    'Nhưng mối liên kết giữa hai sợi thì bị nước phá vỡ.',
  ],
  c15: [
    'Các phân tử nước chen vào đúng chỗ các nhóm hydroxyl',
    'đang đứng gần nhau.',
  ],
  c16: [
    'Nên nước nằm giữa các sợi, như một lớp bôi trơn.',
  ],
  c17: [
    'Sợi cũng phồng lên khi hút nước: to ra và mềm hơn.',
  ],
  c18: [
    'Hai sợi bám lỏng dần,',
    'chỗ chạm mở ra thành một khoảng trống.',
  ],
  c19: [
    'Kéo mạnh thì chúng tuột khỏi mạng,',
    'thay vì giữ chặt như trước.',
  ],
  c20: [
    'Vì thế tờ giấy ướt không đứt ra ở chỗ sợi yếu.',
  ],
  c21: [
    'Nó nức lan ra, và hai bên vệt nứt bị kéo lệch.',
  ],
  c22: [
    'Nước không cắt đứt sợi; nó làm lỏng chỗ bám.',
  ],
  c23: [
    'Vậy mất bao nhiêu? Mình cần đo.',
  ],
  c24: [
    'Mình làm phép đo ở bàn đo, có đồng hồ độ ẩm.',
  ],
  c25: [
    'Một dải giấy được kẹp một đầu,',
    'đầu kia treo vào lực kế.',
  ],
  c26: [
    'Kéo từ từ cho tới khi nó gãy,',
    'và đọc lực ngay lúc đó.',
  ],
  c27: [
    'Ở độ ẩm tương đối năm mươi phần trăm,',
    'mẫu thử chịu được lực kéo khá lớn.',
  ],
  c28: [
    'Nhưng nếu không khí ẩm hơn,',
    'cùng mẫu thử đó sẽ yếu hơn.',
  ],
  c29: [
    'Ở chín mươi phần trăm độ ẩm,',
    'lực kéo tối đa của dải giấy chỉ còn sáu phẩy sáu newton.',
  ],
  c30: [
    'Độ giãn cũng tăng:',
    'giấy dễ bị kéo dài hơn trước khi đứt.',
  ],
  c31: [
    'Vậy độ ẩm cao chỉ là bước đầu của chuyện này.',
  ],
  c32: [
    'Còn khi giấy ướt hẳn, chuyện xảy ra khác hẳn.',
  ],
  c33: [
    'Dải giấy ướt bị kéo: nó rách ngay,',
    'trước khi lực kế kịp đọc.',
  ],
  c34: [
    'Giấy bão hòa nước chỉ còn khoảng ba đến',
    'mười phần trăm độ bền khô.',
  ],
  c35: [
    'Thấp hơn mười lăm phần trăm thì người ta không gọi',
    'là giấy bền ướt.',
  ],
  c36: [
    'Người ta làm ra loại giấy chịu nước bằng cách thêm',
    'nhựa vào lúc ép.',
  ],
  c37: [
    'Một cách giải thích phổ biến:',
    'nhựa tạo ra mối nối mới mà nước không phá được.',
  ],
  c38: [
    'Một số loại khăn giấy và túi giấy trong ngành là',
    'loại như vậy.',
  ],
  c39: [
    'Còn tờ giấy thường đã qua nước rồi sấy thì sao?',
  ],
  c40: [
    'Nó cũng mất độ bền: có mẫu mất tới một nửa.',
  ],
  c41: [
    'Nên sấy khô xong vẫn chưa trở lại.',
  ],
  c42: [
    'Quay lại quầy bếp: tay khô đặt lên tờ giấy,',
    'nó vẫn nguyên vẹn.',
  ],
  c43: [
    'Nó mạnh vì những mối liên kết mà mắt thường không',
    'thấy — chỉ cần một ít nước, chúng mở ra.',
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
