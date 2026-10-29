"""Second opinion on the lines the small model disagreed with: python asr_adjudicate.py voice/lines.json voice/ <id> [<id> …]
Transcribes the given lines with a larger Whisper model (--model medium by default) and prints the small-model
transcript next to it, so a line can be judged: a digit spelling or a near-homophone that only the small model
mangles is a transcription artefact, a wrong word in both models is a fault in the voice line itself.
"""
import sys, os, json, argparse
import numpy as np, soundfile as sf
from scipy.signal import resample_poly


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('lines'); ap.add_argument('dir'); ap.add_argument('ids', nargs='+')
    ap.add_argument('--model', default='medium')
    a = ap.parse_args()
    from faster_whisper import WhisperModel
    m = WhisperModel(a.model, device='cpu', compute_type='int8')
    lines = {L['id']: L for L in json.load(open(a.lines, encoding='utf-8'))}
    cache_path = os.path.join(a.dir, 'asr_cache.json')
    cache = json.load(open(cache_path, encoding='utf-8')) if os.path.exists(cache_path) else {}
    for lid in a.ids:
        L = lines[lid]
        y, sr = sf.read(os.path.join(a.dir, lid + '.wav'), dtype='float32')
        if y.ndim > 1: y = y.mean(1)
        if sr != 16000: y = resample_poly(y, 16000, sr).astype(np.float32); sr = 16000
        pad = np.zeros(int(.6 * sr), np.float32)
        segs, _ = m.transcribe(np.concatenate([pad, y, pad]), beam_size=5, language='vi')
        big = ' '.join(s.text.strip() for s in segs)
        small = cache.get(lid, ['(not cached)'])[0]
        print(f'--- {lid} [{a.model}]')
        print(f'  script : {L["text"]}')
        print(f'  small  : {small}')
        print(f'  {a.model[:4]:4} : {big}')


if __name__ == '__main__':
    main()
