"""Sinh src/timeline.js từ voice/lines.json.

Tập này dài khoảng mười phút, nên bảng SEQ và bảng SUBS được sinh ra từ kịch bản thay vì gõ tay:
thêm một câu vào voice/lines.json là timeline tự đi theo.

  python mk_timeline.py            # ghi src/timeline.js
  python mk_timeline.py --print    # chỉ in ra

SEQ: [id câu, khoảng lặng trước câu đó]. Khoảng lặng dài hơn ở đầu mỗi chương.
SUBS: mỗi câu chia thành các mảnh phụ đề, mảnh sau gắn với từ đầu tiên của nó nên phụ đề
bám theo giọng đọc thay vì nhảy theo nhịp.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LINES = json.load(open(os.path.join(HERE, 'voice/lines.json'), encoding='utf-8'))

# các câu mở đầu chương: sau chúng là một khoảng lặng dài hơn
CHAPTER_STARTS = {'hook', 'intro', 'c1_1', 'c2_1', 'c3_1', 'c4_1', 'c5_1', 'c6_1'}
GAP = {'hook': 0.6, 'intro': 1.5, 'c1_1': 1.7, 'c2_1': 1.5, 'c3_1': 1.5, 'c4_1': 1.5, 'c5_1': 1.5, 'c6_1': 1.8}
TAIL = 4.6

# một mảnh phụ đề: không quá dài, cắt ở dấu câu
MAXCH = 58

ENGINE = r'''// strip the diacritics and the punctuation, so a word can be found in the ASR output however Whisper wrote it
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
  // no two subtitle chunks may overlap, and every chunk holds for at least 0.2 s
  for (let i = 0; i < cues.length; i++) {
    if (i > 0 && cues[i].t0 < cues[i - 1].t1 + .04) cues[i].t0 = +(cues[i - 1].t1 + .04).toFixed(3);
    if (cues[i].t1 <= cues[i].t0 + .2) cues[i].t1 = +(cues[i].t0 + .2).toFixed(3);
  }
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
'''


def split_long(text, maxlen=MAXCH):
    """Cắt một mảnh dài thành các mảnh ngắn hơn. Các mảnh được chia đều nhau theo độ dài,
    không mảnh nào dài hơn maxlen, và không còn mảnh vụn vơ nào ở cuối."""
    words = text.split()
    if len(text) <= maxlen:
        return [text]
    k = -(-len(text) // maxlen)          # số mảnh cần có
    target = len(text) / k               # độ dài mục tiêu của mỗi mảnh
    parts, cur, curLen = [], [], 0
    for w in words:
        add = len(w) + (1 if curLen else 0)
        if cur and (curLen + add > maxlen or curLen >= target):
            parts.append(' '.join(cur)); cur, curLen = [], 0
        cur.append(w); curLen += len(w) + (1 if curLen else 0)
    if cur:
        parts.append(' '.join(cur))
    # một mảnh vẫn dài (một từ rất dài): cắt cứng
    out = []
    for p in parts:
        while len(p) > maxlen:
            cut = p.rfind(' ', 0, maxlen)
            out.append(p[:cut] if cut > 0 else p[:maxlen])
            p = p[cut + 1:].strip() if cut > 0 else p[maxlen:]
        if p:
            out.append(p)
    return out


def chunks(text):
    """Chia một câu thành các mảnh phụ đề, mỗi mảnh một ý, không mảnh nào quá MAXCH ký tự
    (một mảnh dài hơn sẽ thành ba dòng phụ đề, mà phụ đề chỉ được có hai)."""
    parts = re.split(r'(?<=[.!?…])\s+', text)
    out = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        if len(p) <= MAXCH:
            out.append(p)
            continue
        out.extend(split_long(p))
    # a chunk of one or two words is a fragment on screen for a second: it joins the one before it,
    # as long as the joined chunk still fits in two subtitle lines
    merged = []
    for c in out:
        if merged and len(c.strip()) < 14 and len(merged[-1] + ' ' + c.strip()) <= MAXCH:
            merged[-1] = merged[-1] + ' ' + c.strip()
        else:
            merged.append(c)
    return merged or [text]


def q(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def main():
    seq, subs = [], []
    for L in LINES:
        i = L['id']
        gap = GAP.get(i, 1.85 if i in CHAPTER_STARTS else 1.05)
        seq.append((i, gap))
        cs = chunks(L['text'])
        entry = [q(cs[0])]
        for c in cs[1:]:
            # the pair is [từ khóa, câu]: timeline.js đọc phần tử thứ hai làm câu hiện lên
            entry.append('[' + q(c.split(' ')[0]) + ', ' + q(c) + ']')
        subs.append((i, ',\n    '.join(entry)))
    seqs = ',\n  '.join('[' + q(i) + ', ' + str(g) + ']' for i, g in seq)
    sub = ',\n  '.join(i + ': [' + e + ']' for i, e in subs)

    js = f'''// SINH BỞI mk_timeline.py — đừng sửa tay: chạy `python mk_timeline.py` sau khi đổi voice/lines.json.
// Thời gian của phim lấy từ thời lượng thật của giọng đọc (voice/proc/dur.json) và mốc từ (voice/words.json).
// SEQ = [id câu, khoảng lặng trước câu đó]. Khoảng lặng cho phụ đề của câu trước kịp tắt.
export const SEQ = [
  {seqs},
];
export const TAIL = {TAIL};   // thẻ cuối giữ thêm sau câu cuối

// Các mảnh phụ đề: một mảnh là [text] (bắt đầu từ đầu câu) hoặc [text, từ đầu tiên của mảnh]
// — mảnh hiện lên khi từ đó được nói, nên phụ đề bám theo giọng đọc.
export const SUBS = {{
  {sub},
}};

''' + ENGINE
    if '--print' in sys.argv:
        print(js); return
    open(os.path.join(HERE, 'src/timeline.js'), 'w', encoding='utf-8').write(js)
    print('timeline.js written:', len(LINES), 'lines,', len(seq), 'seq entries')


if __name__ == '__main__':
    main()
