// Timeline: every time in the film comes from the real line durations (voice/proc/dur.json) and word times (voice/words.json).
// SEQ = [line id, gap before it]. Gaps ≥ 0.65 s so each subtitle can hold for its line + 0.6 s without overlapping the next;
// the two long gaps (before "but" and before "blood") are the film's silences.
export const SEQ = [
  ['hook1', .5], ['hook2', .8], ['intro', 1.25], ['prof', .9], ['train', .8], ['names', .8], ['rules', .8],
  ['enter', 1.4], ['goal', .8], ['trick', .75], ['police', .75], ['print', .9], ['decoy', .85], ['tunnel', .7],
  ['but', 1.9], ['love1', .8], ['love2', .75], ['blood', 2.6], ['dead', .95], ['escape', 1.3], ['haul', .7],
  ['half', 1.3], ['palawan', .95], ['next', 1.0],
];
export const TAIL = 3.6;   // the end card holds after the last line

// subtitle chunks: a long line splits at a whisper word index (the chunk shows from that word)
export const SUBS = {
  hook1: ['Có một vụ cướp mà bọn cướp không lấy tiền của ai cả.'],
  hook2: ['Bởi vì tiền… là do chính họ tự in ra.'],
  intro: ['Chào bạn, mình là Nhi.', [5, 'Hôm nay: Phi vụ triệu đô, phần 1 và 2, gói gọn trong 2 phút.']],
  prof: ['Kẻ đứng sau là một người đàn ông được gọi là Giáo sư.'],
  train: ['Ông tuyển 8 tay tội phạm, huấn luyện họ suốt 5 tháng trong một trang trại bỏ hoang ở Toledo.'],
  names: ['Mỗi người lấy tên một thành phố: Tokyo, Berlin, Nairobi, Rio, Denver, Moscow, Helsinki và Oslo.'],
  rules: ['Và bốn luật: không tên thật, không hỏi chuyện riêng,', [10, 'không yêu đương… và không đổ một giọt máu.']],
  enter: ['Sáng thứ Sáu, họ đột nhập Xưởng in tiền Hoàng gia Tây Ban Nha', [12, 'và khóa cửa cùng 67 con tin.']],
  goal: ['Mục tiêu: in 2,4 tỷ euro, toàn tờ 50, trong 11 ngày.'],
  trick: ['Mẹo đầu tiên: bắt mọi con tin mặc đồ đỏ giống hệt bọn cướp.'],
  police: ['Cảnh sát nhìn vào, không biết ai là ai, nên không dám xông vào.'],
  print: ['Trong khi đó, máy in chạy suốt ngày đêm.'],
  decoy: ['Còn lối thoát? Con tin bị bắt đào một đường hầm…', [11, 'nhưng đó chỉ là đường hầm giả.']],
  tunnel: ['Đường hầm thật nối thẳng từ một hầm kho ra nhà kho của Giáo sư.'],
  but: ['Nhưng kế hoạch hoàn hảo đến đâu, con người vẫn không hoàn hảo.'],
  love1: ['Luật bị phá gần như ngay lập tức: Tokyo và Rio yêu nhau.'],
  love2: ['Còn Giáo sư lại phải lòng chính nữ thanh tra đang truy lùng mình:', [13, 'Raquel Murillo.']],
  blood: ['Và luật cuối cùng, không đổ máu, cũng vỡ.'],
  dead: ['Oslo, Moscow, và Berlin, anh trai của Giáo sư,', [10, 'không bao giờ ra khỏi đó.']],
  escape: ['Sau 128 giờ, những người còn lại thoát ra qua đường hầm…'],
  haul: ['mang theo 984 triệu euro.'],
  half: ['Chưa tới một nửa mục tiêu.', [6, 'Nhưng đủ để cả thế giới nhớ bộ đồ đỏ.']],
  palawan: ['Một năm sau, Raquel tìm lại Giáo sư', [9, 'trên một bờ biển ở Palawan, Philippines.']],
  next: ['Và phi vụ tiếp theo… họ không in tiền nữa.'],
};

export function build(dur, words, lips) {
  const L = {}; let t = 0;
  for (const [id, gap] of SEQ) { t += gap; L[id] = { id, t0: t, t1: t + dur[id] }; t += dur[id]; }
  const end = t + TAIL;
  // absolute time of word k of a line (whisper times, clamped into the line)
  const w = (id, k) => { const ws = words[id], x = ws[Math.min(k, ws.length - 1)]; return L[id].t0 + Math.max(0, Math.min(dur[id], x.t0)); };
  // subtitle cues: chunk i shows from its word to the next chunk; the last holds to the line end + 0.6 s (≥ 1.8 s), never into the next line
  const cues = [], ids = SEQ.map(s => s[0]);
  ids.forEach((id, n) => {
    const parts = SUBS[id].map((p, i) => typeof p === 'string' ? { text: p, t0: L[id].t0 } : { text: p[1], t0: w(id, p[0]) });
    const nextT = n + 1 < ids.length ? L[ids[n + 1]].t0 - .04 : end;
    parts.forEach((p, i) => {
      const t1 = i + 1 < parts.length ? parts[i + 1].t0 : Math.min(nextT, Math.max(L[id].t1 + .6, p.t0 + 1.8));
      cues.push({ id, text: p.text, t0: +p.t0.toFixed(3), t1: +t1.toFixed(3) });
    });
  });
  // the mouth: voice drive at 12 fps (every other 1/24 s value, held), closed between lines
  const talk = t => {
    for (const id of ids) {
      const l = L[id];
      if (t >= l.t0 && t < l.t1) { const lp = lips[id], i = Math.min(lp.o.length - 1, Math.floor((t - l.t0) * 12) * 2); return { o: lp.o[i], b: lp.b[i] }; }
    }
    return { o: 0, b: .5 };
  };
  return { L, end, w, cues, talk };
}
