// Timeline for Trạm Nghĩ Nhiều — Tập 03: Hiệu ứng ánh đèn sân khấu.
// Driven by voice/proc/dur.json and voice/words.json: the order of the lines, the gaps between them and the subtitle chunks.

export const SEQ = [
  ['hook', .8],
  ['feel', 1.2],
  ['intro', 1.2],
  ['term', 1.2],
  ['study', 1.2],
  ['guess', 1.2],
  ['real', 1.2],
  ['roi', 1.2],
  ['mech', 1.2],
  ['anchor', 1.2],
  ['nuance', 1.2],
  ['action', 1.6],
];
export const TAIL = 3.6;

// the subtitle chunks: [the word that opens the chunk, the words themselves]. The first word is the key the
// timing uses, so the caption follows the voice instead of drifting away from it.
export const SUBS = {
  hook: [['Hôm', 'Hôm nay mình mặc chiếc áo có hình con rùa kỳ quặc,'], ['bước', 'bước vào quán cà phê quen.']],
  feel: [['Và', 'Và cả quán, dường như xoay lại nhìn mình.']],
  intro: [['Chào', 'Chào bạn, mình là Kẻ Nghĩ Nhiều.'], ['Hôm', 'Hôm nay mình kể một câu chuyện ở quán cà phê đó.']],
  term: [['Cảm', 'Cảm giác quen thuộc này có một cái tên:'], ['hiệu', 'hiệu ứng ánh đèn sân khấu.']],
  study: [['Năm', 'Năm hai nghìn, ở Cornell,'], ['ba', 'ba nhà tâm lý học làm một thí nghiệm rất đơn giản.']],
  guess: [['Người', 'Người mặc áo đoán gần một nửa'], ['số', 'số người trong phòng sẽ để ý tới cái áo.']],
  real: [['Nhưng', 'Nhưng khảo sát thật cho thấy chỉ khoảng'], ['hai', 'hai mươi ba phần trăm'], ['người', 'người nhớ ra được hình trên áo.']],
  roi: [['Rối', 'Rối chỉ vào con số: hai mươi ba phần trăm,'], ['vẫn', 'vẫn có người nhìn bạn, chỉ là ít hơn bạn tưởng nhiều.']],
  mech: [['Sai', 'Sai lệch ấy không phải do bịa.'], ['Người', 'Người ta neo vào cảm giác của chính mình'], ['rồi', 'rồi điều chỉnh, nhưng chưa điều chỉnh đủ.']],
  anchor: [['Trong', 'Trong một thí nghiệm khác, hơn bảy phần mười'], ['số', 'số người được hỏi nói họ đã nghĩ tới'], ['một', 'một con số khác trước đó.']],
  nuance: [['Hiệu', 'Hiệu ứng này to nhất lúc bạn đang bị'], ['người', 'người khác đánh giá.']],
  action: [['Tối', 'Tối nay, trước khi rời quán, hãy nhìn xem'], ['người', 'người bên cạnh thật sự đang nhìn cái gì.'], ['Mình', 'Mình là Kẻ Nghĩ Nhiều.']],
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
    const parts = SUBS[id].map(p => typeof p === 'string' ? { text: p, key: null } : { text: p[1], key: p[0] });
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
  // Enforce strict non-overlapping subtitle invariant
  for (let i = 0; i < cues.length - 1; i++) {
    if (cues[i].t1 > cues[i + 1].t0 - 0.04) {
      cues[i].t1 = Math.max(cues[i].t0 + 0.2, +(cues[i + 1].t0 - 0.04).toFixed(3));
    }
  }

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
