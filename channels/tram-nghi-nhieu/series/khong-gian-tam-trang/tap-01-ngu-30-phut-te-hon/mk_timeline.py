"""Sinh src/timeline.js từ voice/lines.json cho Tập 01 (Tại sao ngủ 30 phút lại tệ hơn không ngủ?).

Mỗi câu thoại là một dòng trong voice/lines.json. Dòng này viết ra:
  - SEQ: thứ tự các dòng và khoảng lặng trước mỗi dòng (nhịp quay của phim)
  - SUBS: các mảnh phụ đề của từng dòng, cắt theo câu, mỗi mảnh bắt đầu ở từ đang nói
Độ dài thật của mỗi dòng lấy từ voice/proc/dur.json, mốc thời gian của từng từ lấy từ
voice/words.json — không có mốc thời gian nào được gõ tay.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
LINES = json.load(open(os.path.join(HERE, 'voice', 'lines.json'), encoding='utf-8'))

# Khoảng lặng trước mỗi câu: lớn ở đầu chương, nhỏ ở các câu nối tiếp.
CHAPTER_GAP = {
    'hook1': 2.4, 'intro': 1.3, 'lab1': 1.3, 'roi2': 1.3, 'mech1': 1.3,
    'self1': 1.3, 'roi3': 1.3, 'roi4': 1.3, 'act1': 1.3,
}
DEFAULT_GAP = 0.26
TAIL = 3.0
MAX_CHUNK = 52      # ký tự — phụ đề tối đa hai dòng
MIN_CHUNK = 14      # mảnh vụn dưới ngưỡng này phải gộp vào mảnh trước

# Từ nào là từ đếm. Một cụm số ("một nghìn hai trăm ba") không được cắt làm đôi:
# cắt giữa cụm thì mảnh phụ đề đọc lên thành vế vô nghĩa ("một nghìn" | "hai trăm ba").
NUM_WORDS = {
    'không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'chín',
    'mười', 'mười', 'lăm', 'mươi', 'trăm', 'nghìn', 'ngàn', 'chục', 'linh', 'lẻ', 'phần',
    'triệu', 'tỷ', 'tỉ',
}

# Câu nào mở đầu một chương (nhận khoảng lặng lớn).
CHAPTER_FIRST = set(CHAPTER_GAP)


def is_num(tok):
    return tok.lower().strip(',.;:!?—"') in NUM_WORDS


def split_chunks(text, max_len=MAX_CHUNK):
    """Cắt một câu thành các mảnh phụ đề: theo từ, không quá max_len ký tự,
    không cắt làm đôi một cụm số, ưu tiên cắt sau dấu câu, và không để lại mảnh vụn."""
    words = text.split()
    chunks, cur = [], []
    for i, w in enumerate(words):
        trial = ' '.join(cur + [w])
        if cur and len(trial) > max_len:
            # tìm chỗ cắt hợp lệ gần nhất: không cắt giữa hai từ đếm, và thích cắt sau dấu câu
            cut = None
            for j in range(len(cur), 0, -1):
                if j < len(cur) and is_num(cur[j - 1]) and is_num(words[i]):
                    continue
                if len(' '.join(cur[:j])) < MIN_CHUNK:
                    break
                cut = j
                break
            if cut is None:
                cut = len(cur)
            else:
                punct = [j for j in range(1, len(cur) + 1)
                         if cur[j - 1].endswith((',', '.', ';', ':', '!', '?'))
                         and not (j < len(cur) and is_num(cur[j - 1]) and is_num(words[i]))
                         and len(' '.join(cur[:j])) >= MIN_CHUNK]
                if punct:
                    cut = punct[-1]
            chunks.append(' '.join(cur[:cut]))
            cur = cur[cut:] + [w]
        else:
            cur.append(w)
    if cur:
        chunks.append(' '.join(cur))
    # gộp mảnh vụn vào mảnh trước
    merged = []
    for c in chunks:
        if merged and len(c) < MIN_CHUNK and len(merged[-1]) + 1 + len(c) <= MAX_CHUNK + 8:
            merged[-1] = merged[-1] + ' ' + c
        else:
            merged.append(c)
    return merged


def chunk_key(chunk):
    """Từ khóa để neo mảnh phụ đề vào lúc đang nói: từ đầu tiên của mảnh."""
    return chunk.split()[0].strip(',.;:!?—"')


ENGINE = r'''// Bộ máy của timeline: đọc độ dài thật của từng câu (dur.json), mốc thời gian từng từ
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
'''


def main():
    seq, subs = [], []
    for L in LINES:
        lid = L['id']
        gap = CHAPTER_GAP.get(lid, DEFAULT_GAP) if lid in CHAPTER_FIRST else DEFAULT_GAP
        seq.append("  ['%s', %s]," % (lid, gap))
    parts_by_line = {}
    for L in LINES:
        parts_by_line[L['id']] = ["'%s'" % c.replace("'", "\\'") for c in split_chunks(L['text'])]
    subs_lines = ["export const SUBS = {"]
    for lid, parts in parts_by_line.items():
        subs_lines.append("  %s: [" % lid)
        for p in parts:
            subs_lines.append("    %s," % p)
        subs_lines.append("  ],")
    subs_lines.append("};")

    out = [
        "// timeline.js — sinh tự động từ voice/lines.json và mk_timeline.py (Tập 01: Tại sao ngủ 30 phút lại tệ hơn không ngủ?)",
        "// Mọi mốc thời gian đến từ voice/proc/dur.json và voice/words.json — không gõ tay.",
        "export const TAIL = %s;\n" % TAIL,
        "export const SEQ = [",
        "\n".join(seq),
        "];\n",
        "\n".join(subs_lines),
        "\n",
        ENGINE,
    ]
    target = os.path.join(HERE, 'src', 'timeline.js')
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))
    print('timeline.js written: %d lines, %d sub chunks' % (len(LINES), sum(len(v) for v in parts_by_line.values())))


if __name__ == '__main__':
    main()
