// Timeline for Trạm Nghĩ Nhiều — Thức khuya trả thù: Tại sao càng mệt ta càng không muốn ngủ?
// Driven by voice/proc/dur.json and voice/words.json

export const SEQ = [
  ['hook', .45],
  ['know', .75],
  ['intro', 1.05],
  ['term', .8],
  ['daytime', .75],
  ['revenge', .8],
  ['irony', .85],
  ['roi', .8],
  ['action', .85],
  ['close', 1.0],
];
export const TAIL = 3.6;

export const SUBS = {
  hook: ['Một giờ sáng.', ['Mắt', 'Mắt bạn đã cay xè, nhưng ngón tay vẫn không chịu rời màn hình.']],
  know: ['Bạn biết rõ ngày mai bảy giờ phải thức dậy.', ['Nhưng', 'Nhưng kỳ lạ là, càng mệt, bạn lại càng không muốn đi ngủ.']],
  intro: ['Chào bạn, mình là Kẻ Nghĩ Nhiều.', ['Hôm', 'Hôm nay: nghịch lý thức khuya trả thù.']],
  term: ['Cảm giác này trong tâm lý học có một cái tên rất đắt:', ['Bedtime', 'Bedtime Procrastination, hay trì hoãn giờ ngủ.']],
  daytime: ['Nó thường xảy ra khi ban ngày của bạn bị chiếm trọn', ['bởi', 'bởi công việc, học tập và kỳ vọng của người khác.']],
  revenge: ['Cả ngày không có lấy một giờ cho riêng mình,', ['nên', 'nên khi đêm xuống, bạn thức khuya như cách đòi lại tự do.']],
  irony: ['Nhưng trớ trêu thay: người duy nhất gánh hậu quả cuộc trả thù đó,', ['lại', 'lại là chính bạn vào sáng hôm sau.']],
  roi: ['Rối luôn nhắc mình: màn hình không mang lại tự do,', ['nó', 'nó chỉ đánh cắp nốt phần năng lượng còn lại.']],
  action: ['Tối nay, thay vì đòi lại thời gian từ giấc ngủ,', ['hãy', 'hãy tự thưởng cho mình mười lăm phút tự do thật sự trước khi lên giường.']],
  close: ['Đừng để đêm muộn phải trả món nợ của ban ngày.', ['Mình', 'Mình là Kẻ Nghĩ Nhiều. Ngủ ngon nhé.']],
};

const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w]/g, '');

function wordIndex(ws, want, from = 0) {
  const t = norm(want);
  if (!t) return -1;
  for (let i = from; i < ws.length; i++) if (norm(ws[i].w) === t) return i;
  for (let i = from; i < ws.length; i++) { const n = norm(ws[i].w); if (n && (n.startsWith(t) || t.startsWith(n))) return i; }
  return -1;
}

export function build(dur, words, lips) {
  const L = {}; let t = 0;
  for (const [id, gap] of SEQ) { t += gap; L[id] = { id, t0: t, t1: t + (dur[id] || 4.0) }; t += (dur[id] || 4.0); }
  const end = t + TAIL;

  const w = (id, k) => {
    const ws = words[id] || [], i = typeof k === 'string' ? wordIndex(ws, k) : Math.min(k, Math.max(0, ws.length - 1));
    const x = ws[i] || { t0: 0 };
    return L[id].t0 + Math.max(0, Math.min(dur[id] || 4.0, x.t0));
  };

  const cues = [], ids = SEQ.map(s => s[0]);
  ids.forEach((id, n) => {
    const ws = words[id] || [];
    const parts = SUBS[id].map(p => typeof p === 'string' ? { text: p, key: null } : { text: p[1], key: p[1].split(' ')[0] });
    const total = parts.reduce((a, p) => a + p.text.length, 0);
    let acc = 0, prev = 0;
    parts.forEach((p, i) => {
      const share = acc / total; acc += p.text.length;
      let t0 = L[id].t0;
      if (i > 0) {
        const wi = wordIndex(ws, p.key, prev);
        t0 = wi >= 0 ? L[id].t0 + ws[wi].t0 : L[id].t0 + (dur[id] || 4.0) * share;
        prev = Math.max(prev, wi);
      }
      const nextT = i + 1 < parts.length ? L[id].t0 + (dur[id] || 4.0) * (acc / total) : (n + 1 < ids.length ? L[ids[n + 1]].t0 - .04 : end);
      const t1 = Math.min(nextT, Math.max(L[id].t1 + .6, t0 + 1.8));
      cues.push({ id, text: p.text, t0: +t0.toFixed(3), t1: +t1.toFixed(3) });
    });
  });

  const talk = t => {
    for (const id of ids) {
      const l = L[id];
      if (t >= l.t0 && t < l.t1) {
        const lp = lips[id] || { o: [0.3], b: [0.5] };
        const i = Math.min(lp.o.length - 1, Math.floor((t - l.t0) * 12) * 2);
        return { o: lp.o[i], b: lp.b[i] };
      }
    }
    return { o: 0, b: .5 };
  };

  return { L, end, w, cues, talk };
}
