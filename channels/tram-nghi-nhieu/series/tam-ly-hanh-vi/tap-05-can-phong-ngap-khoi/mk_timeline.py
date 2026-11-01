"""Sinh src/timeline.js từ voice/lines.json cho Tập 05.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LINES = json.load(open(os.path.join(HERE, 'voice/lines.json'), encoding='utf-8'))

CHAPTER_STARTS = {'intro1', 'smoke1', 'alone1', 'group1', 'hesitate1', 'mech1', 'stats1', 'action1'}
GAP = {'intro1': 0.6, 'smoke1': 1.2, 'alone1': 1.2, 'group1': 1.4, 'hesitate1': 1.1, 'mech1': 1.3, 'stats1': 1.3, 'action1': 1.4}
DEFAULT_GAP = 0.45
TAIL = 4.0
MAXCH = 54

ENGINE = r'''// strip the diacritics and the punctuation, so a word can be found in the ASR output however Whisper wrote it
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
'''

def split_sentence(text, max_len=54):
    words = text.split()
    chunks = []
    cur = []
    cur_len = 0
    for w in words:
        wl = len(w) + (1 if cur else 0)
        if cur and (cur_len + wl > max_len or (cur[-1].endswith((',', '.', ':', '—', ';')) and cur_len >= 24)):
            chunks.append(' '.join(cur))
            cur = [w]
            cur_len = len(w)
        else:
            cur.append(w)
            cur_len += wl
    if cur:
        chunks.append(' '.join(cur))
    return chunks

def main():
    seq_entries = []
    subs_entries = []
    for l in LINES:
        id = l['id']
        gap = GAP.get(id, DEFAULT_GAP)
        seq_entries.append(f"  ['{id}', {gap}],")
        chunks = split_sentence(l['text'], MAXCH)
        word_idx = 0
        for i, c in enumerate(chunks):
            first_w = c.split()[0].strip(',.:;!?—"\'')
            at_arg = f"'{first_w}'" if i > 0 else 'null'
            to_arg = 'null'
            if i + 1 < len(chunks):
                next_w = chunks[i + 1].split()[0].strip(',.:;!?—"\'')
                to_arg = f"'{next_w}'"
            esc_text = c.replace("'", "\\'")
            subs_entries.append(f"  {{ id: '{id}', at: {at_arg}, to: {to_arg}, text: '{esc_text}' }},")

    out = [
        "// timeline.js — sinh tự động từ voice/lines.json và mk_timeline.py",
        "export const TAIL = " + str(TAIL) + ";\n",
        "export const SEQ = [",
        "\n".join(seq_entries),
        "];\n",
        "export const SUBS = [",
        "\n".join(subs_entries),
        "];\n",
        ENGINE
    ]
    content = "\n".join(out)
    target = os.path.join(HERE, 'src/timeline.js')
    os.makedirs(os.path.dirname(target), exist_ok=True)
    with open(target, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"timeline.js written: {len(LINES)} lines, {len(subs_entries)} sub chunks")

if __name__ == '__main__':
    main()
