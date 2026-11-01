"""Sinh src/timeline.js từ voice/lines.json cho tập 02 Bẫy Chi Phí Chìm.
  python mk_timeline.py            # ghi src/timeline.js
  python mk_timeline.py --print    # chỉ in ra
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LINES = json.load(open(os.path.join(HERE, 'voice/lines.json'), encoding='utf-8'))

# các câu mở đầu chương / hồi: sau chúng hoặc trước chúng là một khoảng lặng dài hơn
CHAPTER_STARTS = {'c1_1', 'c4_1', 'c7_1', 'c10_1', 'c13_1', 'c16_1', 'c17_1', 'c18_1'}
GAP = {
    'c1_1': 0.8,
    'c4_1': 1.4,
    'c7_1': 1.5,
    'c10_1': 1.4,
    'c13_1': 1.6,
    'c16_1': 1.4,
    'c17_1': 1.5,
    'c18_1': 1.4,
    'c18_2': 1.0,
}
TAIL = 5.0

# một mảnh phụ đề: không quá dài, cắt ở dấu câu
MAXCH = 56

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
  for (const [id, gap] of SEQ) { t += gap; L[id] = { id, t0: t, t1: t + (dur[id] || 0) }; t += (dur[id] || 0); }
  const end = t + TAIL;
  // the absolute time of a word: by index (w(id, k)) or by the word's text (w(id, 'để'))
  const w = (id, k) => {
    const ws = (words && words[id]) || [], i = typeof k === 'string' ? wordIndex(ws, k) : Math.min(k, Math.max(0, ws.length - 1));
    const x = ws[i] || { t0: 0 };
    return (L[id] ? L[id].t0 : 0) + Math.max(0, Math.min(dur[id] || 0, x.t0));
  };
  // the subtitle cues: each chunk shows from its word to the next chunk; the last holds to the line end + 0.6 s (at least 1.8 s)
  const cues = [], ids = SEQ.map(s => s[0]);
  ids.forEach((id, n) => {
    const ws = (words && words[id]) || [];
    const parts = (SUBS[id] || []).map(p => typeof p === 'string' ? { text: p, key: null } : { text: p[1], key: p[0] });
    // where each chunk starts inside the line: the word itself, or — when the ASR did not hear it — its share of the text
    const total = parts.reduce((a, p) => a + p.text.length, 0) || 1;
    let acc = 0, prev = 0;
    parts.forEach((p, i) => {
      const share = acc / total; acc += p.text.length;
      let idx = -1;
      if (i > 0 && p.key) idx = wordIndex(ws, p.key, prev + 1);
      if (idx < 0 && i > 0) idx = Math.max(prev + 1, Math.round(share * Math.max(0, ws.length - 1)));
      if (i === 0) idx = 0;
      p.idx = Math.min(idx, Math.max(0, ws.length - 1));
      p.t0 = (L[id] ? L[id].t0 : 0) + Math.max(0, Math.min(dur[id] || 0, (ws[p.idx] || { t0: 0 }).t0));
      prev = p.idx;
    });
    const nextT = n + 1 < ids.length && L[ids[n + 1]] ? L[ids[n + 1]].t0 - .04 : end;
    parts.forEach((p, i) => {
      let t1 = i + 1 < parts.length ? parts[i + 1].t0 : Math.min(nextT, Math.max((L[id] ? L[id].t1 : 0) + .6, p.t0 + 1.8));
      if (t1 <= p.t0 + .25) t1 = Math.min(nextT, p.t0 + .6);   // never a cue with no length
      cues.push({ id, text: p.text, t0: +p.t0.toFixed(3), t1: +t1.toFixed(3) });
    });
  });
  // the mouth: the voice drives it at 12 fps (every other 1/24 s value, held), closed between the lines
  const talk = t => {
    for (const id of ids) {
      const l = L[id];
      if (l && t >= l.t0 && t < l.t1 && lips && lips[id]) {
        const lp = lips[id], i = Math.min(lp.o.length - 1, Math.floor((t - l.t0) * 12) * 2);
        return { o: lp.o[i], b: lp.b[i] };
      }
    }
    return { o: 0, b: .5 };
  };
  return { L, end, w, cues, talk };
}
'''


def split_long(text, maxlen=MAXCH):
    words = text.split()
    out, cur = [], ''
    for w in words:
        cand = (cur + ' ' + w).strip()
        if len(cand) <= maxlen or not cur:
            cur = cand
            continue
        cut = cur.rfind(',')
        if cut > len(cur) * .5:
            out.append(cur[:cut].strip()); cur = cur[cut + 1:].strip() + ' ' + w
        else:
            out.append(cur); cur = w
    if cur:
        out.append(cur)
    return out


def chunks(text):
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
    merged = []
    for c in out:
        if merged and len(c.strip()) < 14:
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
        gap = GAP.get(i, 1.3 if i in CHAPTER_STARTS else 0.65)
        seq.append((i, gap))
        cs = chunks(L['text'])
        entry = [q(cs[0])]
        for c in cs[1:]:
            key = c.split(' ')[0]
            entry.append('[' + q(key) + ', ' + q(c) + ']')
        subs.append((i, ',\n    '.join(entry)))
    seqs = ',\n  '.join('[' + q(i) + ', ' + str(g) + ']' for i, g in seq)
    sub = ',\n  '.join(i + ': [' + e + ']' for i, e in subs)

    js = f'''// SINH BỞI mk_timeline.py — đừng sửa tay: chạy `python mk_timeline.py` sau khi đổi voice/lines.json.
export const SEQ = [
  {seqs},
];
export const TAIL = {TAIL};

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
