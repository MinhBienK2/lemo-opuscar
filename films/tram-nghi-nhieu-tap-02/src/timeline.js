// The timeline: every time in the film comes from the real line durations (voice/proc/dur.json) and word times (voice/words.json).
// SEQ = [line id, gap before it]. The gaps give the subtitles room to hold (line + 0.6 s) without overlapping the next line.
export const SEQ = [
  ['hook', .45], ['hook2', .75], ['intro', 1.15], ['f1', .85], ['f2', .7], ['self', .75],
  ['emo', .85], ['myth', .8], ['method', .9], ['plan', .8], ['counter', .85], ['punch', .75],
  ['roi', .85], ['close', .8], ['next', 1.0],
];
export const TAIL = 3.8;   // the end card holds after the last line

// Subtitle chunks. A chunk is [text] (from the start of the line) or [text, firstWordOfTheChunk]:
// the chunk appears when that word is spoken, so the subtitle follows the voice instead of jumping.
export const SUBS = {
  hook: ['Còn mười lăm phút nữa là hết hạn bài báo cáo.', ['Mình', 'Mình sẽ làm.'], ['Còn', 'Còn... năm phút nữa.']],
  hook2: ['Ta trì hoãn không phải vì lười.', ['Ta', 'Ta trì hoãn vì đầu muốn'], ['hết', 'hết cái cảm giác khó chịu này, ngay lập tức.']],
  intro: ['Mình là Kẻ Nghĩ Nhiều.', ['Hôm', 'Hôm nay: tại sao ta hay trì hoãn?']],
  f1: ['Trong gần bảy trăm mối tương quan được tổng hợp,', ['yếu', 'yếu tố dự đoán trì hoãn mạnh nhất'], ['không', 'không phải tính cách, mà là độ khó chịu của chính việc đó.']],
  f2: ['Tính cách thì chỉ liên quan yếu.', ['Còn', 'Còn hạn càng xa, ta càng dễ trì hoãn.']],
  self: ['Yếu tố thứ ba là tin vào khả năng của chính mình.', ['Không', 'Không tin, thì không dám bắt đầu.']],
  emo: ['Còn một lý do nữa, thuộc về não:', ['làm', 'làm xong thì hết khó chịu,'], ['còn', 'còn phần thưởng thì nằm ở tương lai xa — mà tương lai xa luôn bị chiết khấu.']],
  myth: ['Nên lười chỉ là lời gọi của người ngoài, không phải nguyên nhân.', ['Tự', 'Tự trách mình cũng chẳng giúp được gì.']],
  method: ['Có một cách được kiểm chứng rất mạnh:', ['kế', 'kế hoạch viết ở dạng nếu, thì.'], ['Trong', 'Trong chín mươi bốn nghiên cứu,'], ['cách', 'cách này hiệu quả hơn hẳn so với chỉ đặt mục tiêu.']],
  plan: ['Nếu lúc hai mươi giờ ba mươi mình ngồi xuống bàn,', ['thì', 'thì mình sẽ viết ba dòng tiêu đề'], ['trong', 'trong năm phút, và không mở mạng.']],
  counter: ['Có một loại trì hoãn lại tốt:', ['khi', 'khi bạn đang ủng cấ một ý tưởng.'], ['Đầu', 'Đầu cần thời gian lang thang, thì ý tưởng mới ra.']],
  punch: ['Trì hoãn không phải là lỗi.', ['Nó', 'Nó là một dấu hiệu: việc này đang làm mình khó chịu.']],
  roi: ['Đó là lý do Rối luôn hỏi:', ['cái', 'cái gì đang khó chịu? Rồi viết ba dòng.']],
  close: ['Lần sau khi bạn trì hoãn, đừng tự trách.', ['Hỏi', 'Hỏi cái gì đang khó chịu —'], ['rồi', 'rồi làm ba dòng.']],
  next: ['Mình là Kẻ Nghĩ Nhiều. Hẹn gặp lại ở trạm tiếp theo.'],
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
