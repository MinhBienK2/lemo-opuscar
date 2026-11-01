// timeline.js — sinh tự động từ voice/lines.json và mk_timeline.py
export const TAIL = 4.0;

export const SEQ = [
  ['intro1', 0.6],
  ['intro2', 0.45],
  ['intro3', 0.45],
  ['intro4', 0.45],
  ['smoke1', 1.2],
  ['smoke2', 0.45],
  ['smoke3', 0.45],
  ['alone1', 1.2],
  ['alone2', 0.45],
  ['alone3', 0.45],
  ['group1', 1.4],
  ['group2', 0.45],
  ['group3', 0.45],
  ['group4', 0.45],
  ['group5', 0.45],
  ['group6', 0.45],
  ['hesitate1', 1.1],
  ['hesitate2', 0.45],
  ['hesitate3', 0.45],
  ['mech1', 1.3],
  ['mech2', 0.45],
  ['mech3', 0.45],
  ['mech4', 0.45],
  ['stats1', 1.3],
  ['stats2', 0.45],
  ['stats3', 0.45],
  ['action1', 1.4],
  ['action2', 0.45],
  ['action3', 0.45],
  ['action4', 0.45],
];

export const SUBS = [
  { id: 'intro1', at: null, to: 'tại', text: 'Tháng Tư năm một nghìn chín trăm sáu mươi tám,' },
  { id: 'intro1', at: 'tại', to: 'phòng', text: 'tại Đại học Columbia, một sinh viên tên Tuấn bước vào' },
  { id: 'intro1', at: 'phòng', to: null, text: 'phòng thí nghiệm.' },
  { id: 'intro2', at: null, to: 'làm', text: 'Người ta đưa cho cậu một tờ phiếu khảo sát và bảo:' },
  { id: 'intro2', at: 'làm', to: 'Nhưng', text: 'làm xong trong mười lăm phút nhé.' },
  { id: 'intro2', at: 'Nhưng', to: null, text: 'Nhưng đó là một lời nói dối.' },
  { id: 'intro3', at: null, to: 'quan', text: 'Hai nhà tâm lý học Bibb Latané và John Darley không hề' },
  { id: 'intro3', at: 'quan', to: null, text: 'quan tâm Tuấn điền gì vào tờ giấy đó.' },
  { id: 'intro4', at: null, to: 'tường', text: 'Thứ họ đang chuẩn bị kích hoạt nằm ngay dưới chân' },
  { id: 'intro4', at: 'tường', to: null, text: 'tường.' },
  { id: 'smoke1', at: null, to: 'một', text: 'Bốn phút trôi qua. Từ chiếc lưới thông gió sắt,' },
  { id: 'smoke1', at: 'một', to: null, text: 'một làn khói trắng bắt đầu xì ra.' },
  { id: 'smoke2', at: null, to: 'Mùi', text: 'Khói không độc, nhưng Tuấn không hề biết điều đó.' },
  { id: 'smoke2', at: 'Mùi', to: 'khói', text: 'Mùi khét lẹt xộc vào mũi,' },
  { id: 'smoke2', at: 'khói', to: null, text: 'khói bò lổm ngổm trên mặt sàn gỗ.' },
  { id: 'smoke3', at: null, to: 'tòa', text: 'Trong đầu cậu chỉ có đúng một ý nghĩ:' },
  { id: 'smoke3', at: 'tòa', to: null, text: 'tòa nhà này đang cháy thật rồi.' },
  { id: 'alone1', at: null, to: 'Tuấn', text: 'Trong lượt thử nghiệm đầu tiên,' },
  { id: 'alone1', at: 'Tuấn', to: null, text: 'Tuấn ngồi một mình trong phòng.' },
  { id: 'alone2', at: null, to: 'đứng', text: 'Cậu ngước mắt lên, buông bút,' },
  { id: 'alone2', at: 'đứng', to: 'báo', text: 'đứng bật dậy và đẩy cửa chạy vội ra ngoài hành lang' },
  { id: 'alone2', at: 'báo', to: null, text: 'báo cho ban quản lý.' },
  { id: 'alone3', at: null, to: 'hành', text: 'Bảy mươi lăm phần trăm người tham gia khi ở một mình' },
  { id: 'alone3', at: 'hành', to: 'họ', text: 'hành động y hệt như Tuấn:' },
  { id: 'alone3', at: 'họ', to: null, text: 'họ chạy ra báo ngay trong vòng chưa đầy hai phút.' },
  { id: 'group1', at: null, to: null, text: 'Nhưng bây giờ, hãy nhìn sang căn phòng thứ hai.' },
  { id: 'group2', at: null, to: 'nhưng', text: 'Cũng là Tuấn, cũng căn phòng đó,' },
  { id: 'group2', at: 'nhưng', to: null, text: 'nhưng ngồi cùng bàn với cậu là hai người lạ khác.' },
  { id: 'group3', at: null, to: 'viên', text: 'Tuấn không biết rằng hai người này thực ra là diễn' },
  { id: 'group3', at: 'viên', to: 'tuyệt', text: 'viên được cài vào, với một nhiệm vụ duy nhất:' },
  { id: 'group3', at: 'tuyệt', to: null, text: 'tuyệt đối làm lơ.' },
  { id: 'group4', at: null, to: 'bóng', text: 'Khói lại bắt đầu xì ra, đặc quánh đến mức che mờ cả' },
  { id: 'group4', at: 'bóng', to: null, text: 'bóng đèn trên trần.' },
  { id: 'group5', at: null, to: 'rồi', text: 'Tuấn ho sặc sụa, dụi mắt,' },
  { id: 'group5', at: 'rồi', to: null, text: 'rồi hoang mang liếc nhìn sang hai người bên cạnh.' },
  { id: 'group6', at: null, to: 'tiếp', text: 'Hai người kia chỉ thản nhiên lật trang giấy,' },
  { id: 'group6', at: 'tiếp', to: 'chủ', text: 'tiếp tục làm bài như thể đang ngồi trong một buổi sáng' },
  { id: 'group6', at: 'chủ', to: null, text: 'chủ nhật bình yên.' },
  { id: 'hesitate1', at: null, to: null, text: 'Và điều kỳ lạ nhất bắt đầu xảy ra.' },
  { id: 'hesitate2', at: null, to: 'rồi', text: 'Tuấn chần chừ. Cậu hơi nhổm người dậy,' },
  { id: 'hesitate2', at: 'rồi', to: null, text: 'rồi lại ngập ngừng ngồi xuống ghế.' },
  { id: 'hesitate3', at: null, to: 'lấy', text: 'Cậu nhìn cửa thoát hiểm,' },
  { id: 'hesitate3', at: 'lấy', to: 'rồi', text: 'lấy tay phẩy làn khói đang bốc lên tận cằm,' },
  { id: 'hesitate3', at: 'rồi', to: null, text: 'rồi lại cúi đầu cắm cúi viết tiếp.' },
  { id: 'mech1', at: null, to: 'hay', text: 'Tâm lý học gọi đây là Hiểu lầm tập thể,' },
  { id: 'mech1', at: 'hay', to: null, text: 'hay Pluralistic Ignorance.' },
  { id: 'mech2', at: null, to: 'não', text: 'Khi đối mặt với một tình huống mơ hồ,' },
  { id: 'mech2', at: 'não', to: 'nhìn', text: 'não bộ chúng ta có phản xạ tự nhiên:' },
  { id: 'mech2', at: 'nhìn', to: null, text: 'nhìn sang người khác để xem họ phản ứng thế nào.' },
  { id: 'mech3', at: null, to: 'ngớ', text: 'Nhưng bi kịch là ai cũng sợ bị coi là kẻ hoảng loạn' },
  { id: 'mech3', at: 'ngớ', to: null, text: 'ngớ ngẩn, nên ai cũng cố giữ khuôn mặt bình thản.' },
  { id: 'mech4', at: null, to: 'của', text: 'Và thế là mọi người cùng nhìn vào sự bình thản giả tạo' },
  { id: 'mech4', at: 'của', to: 'chắc', text: 'của nhau, rồi rút ra kết luận:' },
  { id: 'mech4', at: 'chắc', to: null, text: 'chắc không có gì nguy hiểm đâu.' },
  { id: 'stats1', at: null, to: 'khiến', text: 'Kết quả con số năm một nghìn chín trăm sáu mươi tám' },
  { id: 'stats1', at: 'khiến', to: null, text: 'khiến cả giới khoa học bàng hoàng.' },
  { id: 'stats2', at: null, to: 'chỉ', text: 'Khi có hai người thụ động ngồi cạnh,' },
  { id: 'stats2', at: 'chỉ', to: 'cháy', text: 'chỉ có đúng mười phần trăm người dám đứng dậy đi báo' },
  { id: 'stats2', at: 'cháy', to: null, text: 'cháy.' },
  { id: 'stats3', at: null, to: 'khói', text: 'Chín mươi phần trăm còn lại chọn cách ngồi yên hít' },
  { id: 'stats3', at: 'khói', to: 'cho', text: 'khói suốt sáu phút đồng hồ,' },
  { id: 'stats3', at: 'cho', to: 'nghiệm', text: 'cho đến khi các nhà nghiên cứu phải tự mở cửa dừng thí' },
  { id: 'stats3', at: 'nghiệm', to: null, text: 'nghiệm.' },
  { id: 'action1', at: null, to: 'Ngược', text: 'Đám đông không làm chúng ta an toàn hơn.' },
  { id: 'action1', at: 'Ngược', to: 'từng', text: 'Ngược lại, đám đông thường làm tê liệt trách nhiệm của' },
  { id: 'action1', at: 'từng', to: null, text: 'từng cá nhân.' },
  { id: 'action2', at: null, to: 'thì', text: 'Nếu ai cũng chờ người khác lên tiếng trước,' },
  { id: 'action2', at: 'thì', to: null, text: 'thì sẽ không có ai lên tiếng cả.' },
  { id: 'action3', at: null, to: 'đó', text: 'Lần tới, nếu bạn thấy điều gì đó bất thường hoặc có ai' },
  { id: 'action3', at: 'đó', to: 'làm', text: 'đó cần giúp đỡ, đừng nhìn quanh xem người khác đang' },
  { id: 'action3', at: 'làm', to: null, text: 'làm gì.' },
  { id: 'action4', at: null, to: 'Mình', text: 'Hãy là người đầu tiên đứng dậy.' },
  { id: 'action4', at: 'Mình', to: null, text: 'Mình là Kẻ Nghĩ Nhiều. Hẹn gặp bạn ở tập sau.' },
];

// strip the diacritics and the punctuation, so a word can be found in the ASR output however Whisper wrote it
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
  for (const [id, gap] of SEQ) { t += gap; L[id] = { id, t0: t, t1: t + dur[id] }; t += dur[id]; }
  const end = t + TAIL;
  const w = (id, k) => {
    const ws = words[id] || [], i = typeof k === 'string' ? wordIndex(ws, k) : Math.min(k, Math.max(0, ws.length - 1));
    const hit = ws[i];
    if (hit) return L[id].t0 + Math.max(0, hit.t0);
    return L[id].t0;
  };
  const cues = [];
  for (const s of SUBS) {
    const l = L[s.id];
    if (!l) continue;
    let t0 = l.t0, t1 = l.t1;
    if (s.at !== null) t0 = w(s.id, s.at);
    if (s.to !== null) {
      const nw = w(s.id, s.to);
      if (nw > t0) t1 = nw;
    }
    const safeT0 = Math.max(l.t0, t0);
    const safeT1 = Math.min(l.t1 + 0.4, Math.max(safeT0 + 1.2, t1));
    cues.push({ id: s.id, t0: safeT0, t1: safeT1, text: s.text });
  }
  for (let i = 0; i < cues.length - 1; i++) {
    const cur = cues[i], next = cues[i + 1];
    if (cur.t1 >= next.t0) {
      cur.t1 = Math.max(cur.t0 + 0.8, next.t0 - 0.05);
    }
  }
  const talk = T => {
    for (const [id, l] of Object.entries(L)) {
      if (T >= l.t0 && T < l.t1) {
        const lp = lips[id];
        if (!lp || !lp.length) return Math.sin((T - l.t0) * 14) * 0.35 + 0.35;
        const dt = (l.t1 - l.t0) / lp.length, idx = Math.min(lp.length - 1, Math.floor((T - l.t0) / dt));
        return lp[idx] || 0;
      }
    }
    return 0;
  };
  return { L, SEQ, cues, talk, end, w };
}
