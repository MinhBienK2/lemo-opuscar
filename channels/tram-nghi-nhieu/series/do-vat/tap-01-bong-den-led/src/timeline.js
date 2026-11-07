// timeline.js — sinh tự động từ voice/lines.json bằng mk_timeline.py của kênh
// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.
export const TAIL = 3.0;

export const SEQ = [
  ['m1', 2.6],
  ['m2', 0.52],
  ['m3', 0.52],
  ['m3b', 0.55],
  ['m4', 0.67],
  ['m4b', 0.5],
  ['m5', 0.52],
  ['m6', 0.67],
  ['m7', 0.72],
  ['m8', 0.57],
  ['m9', 0.72],
  ['m10', 0.92],
  ['m11', 0.52],
  ['m12', 0.67],
  ['m13', 0.82],
  ['m13b', 0.5],
  ['m14', 0.52],
  ['m15', 0.62],
  ['m16', 0.52],
  ['m16b', 0.5],
  ['m17', 0.57],
  ['m18', 0.57],
  ['m18b', 0.5],
  ['m19', 0.67],
  ['m20', 0.57],
  ['m20b', 0.52],
  ['m21', 0.67],
  ['m22', 0.57],
  ['m22b', 0.5],
  ['m23', 0.62],
  ['m24', 0.72],
  ['m25', 0.82],
  ['m26', 0.57],
  ['m27', 0.57],
  ['m27b', 0.5],
  ['m28', 0.57],
  ['m29', 0.52],
  ['m29b', 0.5],
  ['m30', 0.52],
  ['m31', 0.62],
  ['m32', 0.67],
  ['m33', 0.72],
  ['m33b', 0.5],
  ['m34', 0.77],
  ['m35', 0.67],
  ['m36', 0.57],
  ['m37', 0.57],
  ['m38', 0.72],
  ['m38b', 0.5],
  ['m39', 0.52],
  ['m40', 0.57],
  ['m41', 0.82],
  ['m41b', 0.7],
];

export const SUBS = {
  m1: [
    'Buổi tối, trên bàn này có hai cái bóng đèn treo cạnh nhau.',
  ],
  m2: [
    'Cái bên trái là bóng sợi,',
    'loại bóng đèn cũ mình vẫn thấy ở mấy bà nội.',
  ],
  m3: [
    'Cái bên phải là bóng LED,',
    'loại mình thấy ở khắp mọi nơi bây giờ.',
  ],
  m3b: [
    'Nhìn từ xa thì hai cái bóng đó giống nhau.',
  ],
  m4: [
    'Cả hai đều sáng. Nhưng khi mình đưa tay sờ vào...',
  ],
  m4b: [
    'Mình từng tưởng chúng chỉ khác nhau ở cái vỏ.',
  ],
  m5: [
    '...cái bóng sợi thì nóng ranh, phải rụt tay lại.',
  ],
  m6: [
    'Còn bóng LED thì mát lạnh, sờ hoài cũng không sao.',
  ],
  m7: [
    'Mình cứ thắc mắc: cùng là một cái bóng,',
    'sao một cái nóng, một cái mát?',
  ],
  m8: [
    'Câu trả lời không nằm ở cái vỏ, mà nằm bên trong.',
  ],
  m9: [
    'Để thấy, mình sẽ lao vào trong cái bóng sợi kia.',
  ],
  m10: [
    'Đây là một cái bóng đèn thật, cỡ bàn tay,',
    'được cắt mở ra.',
  ],
  m11: [
    'Ở giữa là một sợi dây mỏng, gọi là sợi đèn.',
  ],
  m12: [
    'Bây giờ mình bật đèn.',
  ],
  m13: [
    'Thấy không, sợi dây chuyển từ đỏ sẫm sang cam rực',
    'trong chưa đầy một giây.',
  ],
  m13b: [
    'Sợi dây nóng đến mức nó tự nó phát ra ánh sáng.',
  ],
  m14: [
    'Nhiệt độ của sợi dây lúc này khoảng hai nghìn tám',
    'trăm độ Kelvin.',
  ],
  m15: [
    'Và đây là điều lạ:',
    'sợi dây đang bắn ra hàng nghìn thứ ánh sáng.',
  ],
  m16: [
    'Mỗi một hạt bay ra khỏi sợi dây là một photon.',
  ],
  m16b: [
    'Chúng bay thẳng ra vỏ kính, và vỏ kính nuốt hết.',
  ],
  m17: [
    'Nhưng mắt ta chỉ thấy được một phần rất nhỏ trong số đó.',
  ],
  m18: [
    'Phần còn lại là hồng ngoại, dài hơn nhiều,',
    'mắt không thấy, nhưng da tay ta thấy.',
  ],
  m18b: [
    'Phần bị nuốt ấy đọng lại thành nhiệt,',
    'quay lại làm bóng nóng.',
  ],
  m19: [
    'Chính cái phần mắt không thấy đó chính là nhiệt.',
  ],
  m20: [
    'Chín mươi phần trăm năng lượng bóng sợi thả ra thành nhiệt.',
  ],
  m20b: [
    'Chỉ mười phần trăm là ánh sáng.',
  ],
  m21: [
    'Nói cách khác: bóng sợi không tạo ra ánh sáng,',
    'nó tạo ra nhiệt, rồi nhiệt mới phát ra ánh sáng.',
  ],
  m22: [
    'Đỉnh của đám hồng ngoại ấy nằm ở khoảng một micrômet.',
  ],
  m22b: [
    'Mắt ta chỉ thấy được đầu dải đó,',
    'phần cuối thì vô hình.',
  ],
  m23: [
    'Trong khi mắt ta chỉ thấy được từ không phẩy bốn đến',
    'không phẩy tám micrômet.',
  ],
  m24: [
    'Ánh sáng của bóng sợi chỉ là phần rò rí của một đám nhiệt.',
  ],
  m25: [
    'Bây giờ mình sang cái bóng LED kia.',
  ],
  m26: [
    'Cùng một cái vỏ,',
    'nhưng bên trong không có sợi dây nào cả.',
  ],
  m27: [
    'Chỉ có một mảnh bán dẫn, nhỏ hơn hạt gạo,',
    'xếp thành hai lớp.',
  ],
  m27b: [
    'Hai lớp ấy tiếp xúc nhau ở một mặt rất mỏng.',
  ],
  m28: [
    'Khi có dòng điện chạy qua,',
    'nó đẩy các electron sang một bên.',
  ],
  m29: [
    'Bên kia, chỗ các electron rơi xuống một mức năng',
    'lượng thấp hơn...',
  ],
  m29b: [
    'Ở chỗ hai lớp chạm nhau,',
    'electron gặp lỗ trống rồi rơi xuống.',
  ],
  m30: [
    '...một photon được sinh ra ngay tại chỗ đó.',
  ],
  m31: [
    'Không một sợi dây nào phải nóng trước,',
    'nên ánh sáng ra ngay tức thì.',
  ],
  m32: [
    'Phần nhiệt thừa chỉ còn rất ít,',
    'phải tản ra ở đế bóng.',
  ],
  m33: [
    'Nên bóng LED mát,',
    'và bền hơn bóng sợi tới hai mươi lăm lần.',
  ],
  m33b: [
    'Tuổi thọ của nó cũng dài hơn nhiều lần.',
  ],
  m34: [
    'Quay lại cái bàn, mình sờ bóng LED lần này.',
  ],
  m35: [
    'Mát. Và tay mình không rụt lại.',
  ],
  m36: [
    'Tính ra mỗi vòng đèn sáng,',
    'bóng sợi cho mười sáu lumen trên một oát.',
  ],
  m37: [
    'Bóng LED trắng cho mười lumên trên một oát, hơn sáu lần.',
  ],
  m38: [
    'Nên khi mua bóng, mình đừng nhìn số oát nữa.',
  ],
  m38b: [
    'Cứ nhìn vào con số lumen in trên vỏ hộp.',
  ],
  m39: [
    'Hãy nhìn số lumen:',
    'một nghìn một trăm lumen thì bóng sợi tốn bảy mươi lăm oát.',
  ],
  m40: [
    'Còn bóng LED chỉ tốn chín oát cho lượng sáng đó.',
  ],
  m41: [
    'Sáng như nhau, tốn điện ít hơn,',
    'và tay không bị nóng.',
  ],
  m41b: [
    'Hoá ra bóng LED không phải là không nóng,',
    'chỉ là nóng ít hơn thôi.',
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
