// The timeline: every time in the film comes from the real line durations (voice/proc/dur.json) and word times (voice/words.json).
// SEQ = [line id, gap before it]. The gaps give the subtitles room to hold (line + 0.6 s) without overlapping the next line.
export const SEQ = [
  ['hook', .45], ['hook2', .75], ['intro', 1.15], ['f1', .85], ['f2', .8], ['drift', .7],
  ['bored', .85], ['scroll1', .9], ['scroll2', .8], ['myth', .95], ['truth', .9], ['rest', .8],
  ['nature', .9], ['screen', .8], ['feedwork', .8], ['roi', .95], ['close', .85], ['next', 1.05],
];
export const TAIL = 3.8;   // the end card holds after the last line

// Subtitle chunks. A chunk is [text] (from the start of the line) or [text, firstWordOfTheChunk]:
// the chunk appears when that word is spoken, so the subtitle follows the voice instead of jumping.
export const SUBS = {
  hook: ['Có những ngày không làm việc gì cả, mà vẫn mệt như vừa đi xa bốn mươi ki lô mét.'],
  hook2: ['Vấn đề không phải là bạn thiếu việc.', ['Vấn', 'Vấn đề là đầu bạn không ngừng nghĩ.']],
  intro: ['Mình là Kẻ Nghĩ Nhiều.', ['Hôm', 'Hôm nay: tại sao càng rảnh, ta càng thấy mệt?']],
  f1: ['Người ta dành gần bốn mươi bảy phần trăm thời gian thức', ['để', 'để nghĩ về chuyện không liên quan gì tới việc đang làm.']],
  f2: ['Và điều lạ nhất là:', ['những', 'những lúc đầu lang thang thế đó, ta càng ít vui, kể cả khi đang làm thứ mình thích.']],
  drift: ['Người ta trôi đi cả khi đang nói chuyện với nhau.'],
  bored: ['Cái cảm giác ấy có tên là chán:', ['mệt', 'mệt và bồn chồn, vì chẳng thấy gì thú vị.']],
  scroll1: ['Nên khi rảnh, não bạn tự đi tìm việc:', ['mở', 'mở điện thoại, lướt mấy trang mạng xã hội, rồi nghĩ lại chuyện đã qua.']],
  scroll2: ['Mà mỗi trang mạng lại đẩy thêm một đống thứ vào đầu.', ['Rảnh', 'Rảnh thế, mà đầu lại đông.']],
  myth: ['Nghe quen chứ? Rảnh thì nghỉ, sao lại mệt?', ['Câu', 'Câu trả lời quen thuộc nhất là: hết pin ý chí.']],
  truth: ['Nhưng hai mươi ba phòng thí nghiệm đã lặp lại thí nghiệm cạn kiệt ý chí,', ['và', 'và không tìm thấy hiệu ứng nào đáng kể.']],
  rest: ['Vậy nên mệt khi rảnh, có lẽ không phải vì hết pin,', ['mà', 'mà vì đầu bạn chưa từng được nghỉ.']],
  nature: ['Nghỉ thật, theo nhà tâm lý học Stephen Kaplan,', ['là', 'là đưa đầu về chỗ nhẹ nhàng, không cần hướng chú ý, như đi dạo ngoài trời.']],
  screen: ['Còn màn hình thì không phải là nghỉ.', ['Nó', 'Nó vẫn giữ chú ý của bạn bận rộn, chỉ là bận với thứ vô nghĩa.']],
  feedwork: ['Lướt mạng xã hội không phải là nghỉ.', ['Đó', 'Đó là một công việc không lương.']],
  roi: ['Đó là lý do Rối luôn cảnh báo:', ['nghỉ', 'nghỉ mà không có kế hoạch, cũng là một việc, và nó tốn pin.']],
  close: ['Càng rảnh, bạn càng cần nghỉ thật, chứ không phải nghỉ giả.'],
  next: ['Lần sau khi rảnh, thử đi bộ mười phút mà không mang điện thoại.', ['Mình', 'Mình là Kẻ Nghĩ Nhiều. Hẹn gặp lại ở trạm tiếp theo.']],
};

// strip the diacritics and the punctuation, so a word can be found in the ASR output however Whisper wrote it
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w]/g, '');
// the index of a word in the ASR output, searched from `from` on; -1 when it is not there
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
  // the absolute time of a word: by index (w(id, k)) or by the word's text (w(id, 'để'))
  const w = (id, k) => {
    const ws = words[id] || [], i = typeof k === 'string' ? wordIndex(ws, k) : Math.min(k, Math.max(0, ws.length - 1));
    const x = ws[i] || { t0: 0 };
    return L[id].t0 + Math.max(0, Math.min(dur[id], x.t0));
  };
  // the subtitle cues: each chunk shows from its word to the next chunk; the last holds to the line end + 0.6 s (at least 1.8 s)
  const cues = [], ids = SEQ.map(s => s[0]);
  ids.forEach((id, n) => {
    const ws = words[id] || [];
    const parts = SUBS[id].map(p => typeof p === 'string' ? { text: p, key: null } : { text: p[1], key: p[1].split(' ')[0] });
    // where each chunk starts inside the line: the word itself, or — when the ASR did not hear it — its share of the text
    const total = parts.reduce((a, p) => a + p.text.length, 0);
    let acc = 0, prev = 0;
    parts.forEach((p, i) => {
      const share = acc / total; acc += p.text.length;
      let idx = -1;
      if (i > 0 && p.key) idx = wordIndex(ws, p.key, prev + 1);
      if (idx < 0 && i > 0) idx = Math.max(prev + 1, Math.round(share * Math.max(0, ws.length - 1)));
      if (i === 0) idx = 0;
      p.idx = Math.min(idx, Math.max(0, ws.length - 1));
      p.t0 = L[id].t0 + Math.max(0, Math.min(dur[id], (ws[p.idx] || { t0: 0 }).t0));
      prev = p.idx;
    });
    const nextT = n + 1 < ids.length ? L[ids[n + 1]].t0 - .04 : end;
    parts.forEach((p, i) => {
      let t1 = i + 1 < parts.length ? parts[i + 1].t0 : Math.min(nextT, Math.max(L[id].t1 + .6, p.t0 + 1.8));
      if (t1 <= p.t0 + .25) t1 = Math.min(nextT, p.t0 + .6);   // never a cue with no length
      cues.push({ id, text: p.text, t0: +p.t0.toFixed(3), t1: +t1.toFixed(3) });
    });
  });
  // the mouth: the voice drives it at 12 fps (every other 1/24 s value, held), closed between the lines
  const talk = t => {
    for (const id of ids) {
      const l = L[id];
      if (t >= l.t0 && t < l.t1) { const lp = lips[id], i = Math.min(lp.o.length - 1, Math.floor((t - l.t0) * 12) * 2); return { o: lp.o[i], b: lp.b[i] }; }
    }
    return { o: 0, b: .5 };
  };
  return { L, end, w, cues, talk };
}
