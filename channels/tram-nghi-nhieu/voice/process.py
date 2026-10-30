"""Voice post: voice/<id>.wav (24 kHz from tts_vi.py) → voice/proc/<id>.wav (48 kHz, high-pass, a little presence)
+ voice/lips.json: per 1/24 s, openness o (RMS against the line's 95th percentile) and brightness b (spectral centroid),
the mouth drive used by host.js (wide vs round). Technique from $LIB/styles/scifi-toon/demo/voice.py (numpy STFT in place of librosa).
This script lives in the channel; the episode's voice folder is its argument.
Usage: python "$CHANNEL/voice/process.py" voice/   (run from the episode folder)"""
import json, os, sys, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, lfilter, resample_poly
VOICE = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.getcwd(); SR = 48000
os.makedirs(os.path.join(VOICE, 'proc'), exist_ok=True)


def peq(x, f, gain_db, q=1.0):   # peaking EQ (RBJ biquad)
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f / SR; al = np.sin(w) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w), 1 - al * A]; a = [1 + al / A, -2 * np.cos(w), 1 - al / A]
    return lfilter(np.array(b) / a[0], np.array(a) / a[0], x)


lines = json.load(open(os.path.join(VOICE, 'lines.json'), encoding='utf-8')); lips = {}; dur = {}
for L in lines:
    y, sr = sf.read(os.path.join(VOICE, L['id'] + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    y = resample_poly(y, SR, sr)
    y = sosfilt(butter(2, 90, 'hp', fs=SR, output='sos'), y)
    y = peq(y, 3400, 2.0, .9); y = peq(y, 250, -1.5, 1.0)
    y = (y / (np.abs(y).max() + 1e-9) * .9).astype(np.float32)
    sf.write(os.path.join(VOICE, 'proc', L['id'] + '.wav'), y, SR); dur[L['id']] = round(len(y) / sr, 3)
    hop = SR // 24; win = int(.05 * SR)
    pad = np.pad(y, (win // 2, win)); n = len(y) // hop + 1   # windowed frames centred on each 1/24 s
    S = np.abs(np.fft.rfft(np.stack([pad[i * hop: i * hop + win] for i in range(n)]) * np.hanning(win), 4096)).T
    freqs = np.fft.rfftfreq(4096, 1 / SR)
    rms = np.sqrt((S ** 2).mean(0)); p = np.percentile(rms, 95) + 1e-9
    cen = (S * freqs[:, None]).sum(0) / (S.sum(0) + 1e-9)
    lips[L['id']] = {'o': [round(float(np.clip((r / p - .1) / .8, 0, 1)), 2) for r in rms],
                     'b': [round(float(np.clip((c - 1200) / 2600, 0, 1)), 2) for c in cen]}
json.dump(lips, open(os.path.join(VOICE, 'lips.json'), 'w'))
json.dump(dur, open(os.path.join(VOICE, 'proc', 'dur.json'), 'w'), indent=0)
print('lines', len(dur), 'total', round(sum(dur.values()), 2))
