"""Sửa lỗi ASR cho một số câu: python voice/asr_fix.py voice/lines.json voice/ c1_4 c2_3 ...

Bài kiểm tra đầy đủ (voice/asr_vi.py) nghe lại toàn bộ phim, nên chạy lại nó cho tất cả 175 câu là
mất thời gian. Khi chỉ vài câu bị Whisper nghe sai, script này nghe lại đúng những câu đó và
cập nhật voice/words.json, không đụng tới những câu còn lại.

  python voice/asr_fix.py voice/lines.json voice/ --model small c1_4 c2_3
"""
import sys, os, json, difflib, unicodedata
import numpy as np, soundfile as sf
from scipy.signal import resample_poly


def norm(s):
    s = unicodedata.normalize('NFC', s).lower()
    return ''.join(c for c in s if unicodedata.category(c)[0] in 'LN')


def main():
    args = sys.argv[1:]
    model = 'small'
    if '--model' in args:
        i = args.index('--model'); model = args[i + 1]; del args[i:i + 2]
    lines_path, d = args[0], args[1]
    only = set(args[2:])
    from faster_whisper import WhisperModel
    m = WhisperModel(model, device='cpu', compute_type='int8')
    lines = json.load(open(lines_path, encoding='utf-8'))
    words = json.load(open(os.path.join(d, 'words.json'), encoding='utf-8'))
    bad = 0
    for L in lines:
        if only and L['id'] not in only:
            continue
        y, sr = sf.read(os.path.join(d, L['id'] + '.wav'), dtype='float32')
        if y.ndim > 1: y = y.mean(1)
        if sr != 16000: y = resample_poly(y, 16000, sr).astype(np.float32); sr = 16000
        pad = np.zeros(int(.6 * sr), np.float32)
        segs, _ = m.transcribe(np.concatenate([pad, y, pad]), beam_size=5, language='vi', word_timestamps=True)
        segs = list(segs); got = ' '.join(s.text.strip() for s in segs)
        words[L['id']] = [{'w': w.word.strip(), 't0': round(w.start - .6, 3), 't1': round(w.end - .6, 3)} for s in segs for w in (s.words or [])]
        cands = [c for c in (L.get('asr'), L.get('say'), L['text']) if c]
        r, want = max((difflib.SequenceMatcher(None, norm(c), norm(got)).ratio(), c) for c in cands)
        ok = r >= .85; bad += not ok
        print(('OK  ' if ok else 'DIFF'), f'{r:.2f}', L['id'], '|', want, '→', got)
    json.dump(words, open(os.path.join(d, 'words.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print('mismatches:', bad)
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
