// The timeline of "Nghịch lý lựa chọn" — every time in the film comes from the real line durations
// (voice/proc/dur.json) and the real word times (voice/words.json). Nothing is typed by hand.
// SEQ = [line id, the silence before it]. The silence gives the subtitle room to hold (the line
// plus 0.6 s) without overlapping the next line, and it is where the camera is allowed to breathe.
export const SEQ = [
  ['hook', 1.6], ['hook2', .8], ['intro', 1.0], ['myth', .95], ['myth2', .8], ['jam', .85], ['jam2', .7],
  ['jam3', .8], ['meta', .8], ['meta2', .75], ['meta3', .8], ['rep', .85], ['meta4', 2.4], ['turn', .95],
  ['turn2', 2.0], ['ghost', .8], ['ghost2', .7], ['ghost3', .8], ['regret', .85], ['bar', .8], ['bar2', .8],
  ['four', .9], ['f1', .8], ['f2', .75], ['f3', .75], ['f4', .8], ['f5', .8], ['f6', .85], ['model', .9],
  ['model2', .75], ['model3', .8], ['action', .85], ['action2', 1.7], ['action3', 1.0], ['roi', .9],
  ['close', .85], ['close2', .8], ['next', 1.0],
];
export const TAIL = 6.5;   // the end card holds after the last line

// The subtitle chunks. A chunk is [text] (from the start of the line) or [text, firstWordOfTheChunk]:
// the chunk appears when that word is spoken, so the subtitle follows the voice instead of jumping.
export const SUBS = {
  hook: ['Mình đang cầm thực đơn, và mình không chọn được món nào.'],
  hook2: ['Không phải vì chưa biết mình muốn ăn gì.', ['Mà', 'Mà vì món nào trong thực đơn này cũng nghe ngon.']],
  intro: ['Mình là Kẻ Nghĩ Nhiều.', ['Hôm', 'Hôm nay: nghịch lý lựa chọn, tại sao càng nhiều lựa chọn ta lại càng mệt?']],
  myth: ['Cách giải thích quen thuộc nhất: quá nhiều lựa chọn làm', ['não', 'não bạn tê liệp.']],
  myth2: ['Nghe hợp lý quá. Nhưng câu này đã được kiểm tra rồi, và', ['kết', 'kết quả không giống những gì người ta tưởng.']],
  jam: ['Năm hai nghìn, trong một siêu thị, người ta bày hai bàn', ['nếm', 'nếm mứt: sáu vị ở bên trái, hai mươi bốn vị ở bên phải.']],
  jam2: ['Bảy mươi ba người dừng lại bên sáu vị, ba mươi phần trăm', ['trong', 'trong số đó đã mua. Bên kia, một trăm bảy mươi sáu người'],
    ['dừng', 'dừng lại bên hai mươi bốn vị, và chỉ ba phần trăm mua.']],
  jam3: ['Câu chuyện này được kể lại khắp nơi như một bằng chứng:', ['càng', 'càng nhiều lựa chọn, càng ít người chọn.']],
  meta: ['Rồi các nhà khoa học gom năm mươi thí nghiệm, năm nghìn', ['không', 'không trăm ba mươi sáu người, và làm lại phép tính.']],
  meta2: ['Hiệu ứng trung bình: hai phần trăm. Khoảng tin chạm từ âm', ['chín', 'chín phần trăm đến mười hai phần trăm.']],
  meta3: ['Gần như không có gì. Và càng nhiều lựa chọn, hiệu ứng cũng', ['chẳng', 'chẳng khá hơn.']],
  rep: ['Ngay cả thí nghiệm mứt cũng được làm lại ở Đức, với năm', ['trăm', 'trăm linh bốn người, và lần này không còn hiệu ứng nào.']],
  meta4: ['Nghiên cứu càng mới thì càng ít tìm ra hiệu ứng. Có cả', ['chuyện', 'chuyện thiên lệch xuất bản nữa.']],
  turn: ['Nên nghịch lý lựa chọn, đúng như một câu quảng cáo, là sai.'],
  turn2: ['Nhưng cảm giác mệt khi có quá nhiều lựa chọn thì có thật.', ['Chỉ', 'Chỉ là nguyên nhân thì khác.']],
  ghost: ['Thứ làm ta mệt không phải số lựa chọn. Mà là cái giá của', ['việc', 'việc biết mình đã bỏ cái gì.']],
  ghost2: ['Càng nhiều lựa chọn, lựa chọn thứ hai càng hấp dẫn. Nó', ['không', 'không biến mất. Nó đứng ngay cạnh món bạn vừa chọn.']],
  ghost3: ['Rồi đầu ta tự so sánh: con đường nào mình đã không đi.'],
  regret: ['Người ta gọi cảm giác đó là hối tiếc. Nó không biến mất', ['khi', 'khi bạn ăn xong.']],
  bar: ['Và còn một điều ít ai nói tới: tập lựa chọn càng lớn, kỳ', ['vọng', 'vọng của bạn càng cao.']],
  bar2: ['Bạn kỳ vọng sẽ gặp đúng món mình muốn. Rồi món nào bạn', ['chọn', 'chọn, cũng thấy hụt một chút.']],
  four: ['Vậy khi nào lựa chọn mới thực sự làm ta tê liệp? Một phân', ['tích', 'tích tổng hợp mới hơn, năm mươi ba nghiên cứu, bảy nghìn'],
    ['hai', 'hai trăm hai người, trả lời bằng bốn yếu tố.']],
  f1: ['Tập lựa chọn có phức tạp không: nhiều món giống nhau,', ['nhiều', 'nhiều tiêu chí để cân.']],
  f2: ['Nhiệm vụ có khó không: nhiều thuộc tính, ít thời gian, lại', ['phải', 'phải giải trình lý do chọn.']],
  f3: ['Bạn có biết mình muốn gì không. Người chưa rõ ý mình thì', ['nhiều', 'nhiều lựa chọn càng nguy.']],
  f4: ['Và bạn đang đi mua, hay chỉ đi dạo xem.'],
  f5: ['Người đã có tiêu chí rõ ràng thì nhiều lựa chọn lại tốt', ['hơn', 'hơn. Hiệu ứng đảo chiều hẳn.']],
  f6: ['Nên đừng nghĩ ai cũng cần ít lựa chọn. Người cần là người', ['chưa', 'chưa biết mình muốn gì.']],
  model: ['Vậy cái cứu vãn không phải là bớt lựa chọn. Mà là có tiêu', ['chí', 'chí trước khi mở thực đơn.']],
  model2: ['Nhà tâm lý học Herbert Simon gọi đó là satisficing: chọn', ['cái', 'cái đầu tiên đủ tốt, rồi dừng lại.']],
  model3: ['Cách làm thì như lọc nước: loại từng tiêu chí. Món nào', ['trượt', 'trượt một tiêu chí thì bỏ luôn, khỏi cần so với món khác.']],
  action: ['Cụ thể thế này: trước khi mở thực đơn, viết ba tiêu chí', ['quan', 'quan trọng nhất với bạn.']],
  action2: ['Rồi quét một lượt, gạch bỏ món nào không đạt một tiêu chí.'],
  action3: ['Món đầu tiên đạt cả ba tiêu chí: gọi món đó.', ['Đừng', 'Đừng so với món thứ hai.']],
  roi: ['Rối nói: một lựa chọn đủ tốt, đã là một lựa chọn.'],
  close: ['Càng nhiều lựa chọn, ta càng mệt. Nhưng không phải vì có', ['nhiều', 'nhiều lựa chọn.']],
  close2: ['Mà vì ta quên viết ra điều mình muốn,', ['trước', 'trước khi bắt đầu lựa chọn.']],
  next: ['Lần sau bạn mở một thực đơn, một ứng dụng, hay một sàn', ['thương', 'thương mại: viết ba tiêu chí trước đã. Mình là Kẻ Nghĩ'],
    ['Nhiều', 'Nhiều. Hẹn gặp lại ở trạm tiếp theo.']],
};

// strip the diacritics and the punctuation, so a word can be found in the ASR output however Whisper wrote it
export const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w]/g, '');
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
  // the absolute time of a word: by index (w(id, k)) or by the word's text (w(id, 'năm'))
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
  return { L, end, w, cues, talk, words };
}
