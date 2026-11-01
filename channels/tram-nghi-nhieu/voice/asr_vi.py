"""Speech-to-text check for the Vietnamese lines: python "$CHANNEL/voice/asr_vi.py" voice/lines.json voice/ [--model small] [--threshold 0.85]
(run from the episode folder; the script lives in the channel and takes the episode's paths as arguments)
$LIB/core/tts/asr_check.py compares non-CJK text word by word in a-z only, which drops every Vietnamese diacritic, so this
compares by character instead: NFC, lowercase, letters and digits only, digits spelled the way the line says them.
Foreign names are respelled for the voice ("Tô-ky-ô") and Whisper may write either form, so the best match among the
line's "asr" (if any), "say" and "text" counts. The small multilingual model is the default; with --model base (less disk)
tones are often misheard (tiền → tình), so read the DIFF lines and judge them rather than trusting the score alone. Writes words.json (word timestamps) for syncing the picture.
"""
import sys, os, json, re, unicodedata, difflib, argparse
import numpy as np, soundfile as sf
from scipy.signal import resample_poly


def norm(s):
    s = unicodedata.normalize('NFC', s).lower()
    return ''.join(c for c in s if unicodedata.category(c)[0] in 'LN')


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('lines'); ap.add_argument('dir')
    ap.add_argument('--model', default='small'); ap.add_argument('--threshold', type=float, default=.85)
    a = ap.parse_args()
    from faster_whisper import WhisperModel
    m = WhisperModel(a.model, device='cpu', compute_type='int8')
    lines = json.load(open(a.lines, encoding='utf-8')); words = {}; bad = 0
    for L in lines:
        y, sr = sf.read(os.path.join(a.dir, L['id'] + '.wav'), dtype='float32')
        if y.ndim > 1: y = y.mean(1)
        if sr != 16000: y = resample_poly(y, 16000, sr).astype(np.float32); sr = 16000   # whisper takes 16 kHz arrays
        pad = np.zeros(int(.6 * sr), np.float32)   # short clips are misheard without some silence around them
        segs, _ = m.transcribe(np.concatenate([pad, y, pad]), beam_size=5, language='vi', word_timestamps=True)
        segs = list(segs); got = ' '.join(s.text.strip() for s in segs)
        words[L['id']] = [{'w': w.word.strip(), 't0': round(w.start - .6, 3), 't1': round(w.end - .6, 3)} for s in segs for w in (s.words or [])]
        # Whisper writes numbers as digits and foreign names in their own spelling, so the subtitle text is a candidate too
        cands = [c for c in (L.get('asr'), L.get('say'), L['text']) if c]
        r, want = max((difflib.SequenceMatcher(None, norm(c), norm(got)).ratio(), c) for c in cands); ok = r >= a.threshold; bad += not ok
        print(('OK  ' if ok else 'DIFF'), f'{r:.2f}', L['id'], '|', want, '→', got)
        if ok and L.get('asr') and want == L['asr'] and norm(L.get('text', '')) != norm(want):
            print('      NOTE: matched via asr override (R8: check that alternate form is numbers/foreign names, not mispronunciations)')
    json.dump(words, open(os.path.join(a.dir, 'words.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    print('mismatches:', bad); sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
