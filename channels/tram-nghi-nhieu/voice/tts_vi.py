"""Vietnamese edge-tts with retries: python "$CHANNEL/voice/tts_vi.py" voice/lines.json voice/ [--jobs N]   (run from the episode folder)
It refuses an episode whose outline and words have not passed the independent review (gate.py check --for voice).
--jobs N makes N lines at once (4–6 for a long episode).
Same inputs and outputs as $LIB/core/tts/tts_zh.py (<id>.wav, dur.json, .cache/), whose decoding and checks it reuses.
The Vietnamese voices sometimes return no audio for an ordinary sentence ("Có một con mèo" fails, "có một con mèo" works),
so a line that fails is tried again with small changes the listener can't hear: first letter lowercased, rate ±1 %, pitch ±1 Hz.
"""
import sys, os, json, asyncio, hashlib
import numpy as np, soundfile as sf


def _lib_root(start):
    """the library root, found by walking up until it holds core/tts/tts_zh.py"""
    d = os.path.abspath(start)
    while True:
        if os.path.isfile(os.path.join(d, 'core/tts/tts_zh.py')): return d
        p = os.path.dirname(d)
        if p == d: return None
        d = p


LIB = os.environ.get('LIB') or _lib_root(os.path.dirname(os.path.abspath(__file__)))   # the library root
if not LIB: sys.exit('tts_vi.py: set LIB to the library root (or run from inside the repository)')
sys.path.insert(0, os.path.join(LIB, 'core/tts'))
from tts_zh import to_wav, plausible   # noqa: E402


def variants(say, rate, pitch):
    r, p = int(rate.rstrip('%')), int(pitch.rstrip('Hz'))
    low = say[:1].lower() + say[1:]
    for s in (say, low):
        yield s, rate, pitch
        for dr, dp in ((1, 0), (-1, 0), (0, 1), (0, -1), (2, 1), (-2, -1)):
            yield s, f'{r + dr:+d}%', f'{p + dp:+d}Hz'


async def fetch(text, voice, rate, pitch, path, max_retries=3):
    import edge_tts, random
    part = path + '.part'
    for attempt in range(max_retries):
        try:
            await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(part)
            if os.path.exists(part) and os.path.getsize(part) > 0:
                os.replace(part, path)
                return True
        except Exception as e:
            if attempt < max_retries - 1:
                delay = 1.0 * (attempt + 1) + random.uniform(0.1, 0.4)
                await asyncio.sleep(delay)
                continue
            if type(e).__name__ != 'NoAudioReceived':
                print(f'   {type(e).__name__}: {str(e)[:120]}', file=sys.stderr)
            return False
        finally:
            if os.path.exists(part):
                try: os.remove(part)
                except OSError: pass
        if attempt < max_retries - 1:
            delay = 1.0 * (attempt + 1) + random.uniform(0.1, 0.4)
            await asyncio.sleep(delay)
    return False


class NoAudio(Exception): pass

def one(L, out):
    """make the voice of one line: (id, seconds)"""
    # giọng kể của kênh (STYLE.md): một giọng nam trẻ cho cả phim — tập không đổi voice/pitch/rate
    voice, rate, pitch, say = L.get('voice', 'vi-VN-NamMinhNeural'), L.get('rate', '+5%'), L.get('pitch', '-8Hz'), L.get('say', L['text'])
    key = hashlib.sha1(json.dumps([voice, rate, pitch, say], ensure_ascii=False).encode('utf-8')).hexdigest()[:16]
    mp3 = os.path.join(out, '.cache', key + '.mp3')
    decoded = to_wav(mp3) if os.path.exists(mp3) else None
    if not plausible(decoded):
        decoded = None
        for k, (s, r, p) in enumerate(variants(say, rate, pitch)):
            retries = 3 if k == 0 else 2
            if asyncio.run(fetch(s, voice, r, p, mp3, max_retries=retries)):
                decoded = to_wav(mp3)
                if plausible(decoded):
                    if k: print(f"  {L['id']}: took variant {k} ({r}, {p}{', lowercased' if s != say else ''})", file=sys.stderr)
                    break
                if os.path.exists(mp3):
                    try: os.remove(mp3)
                    except OSError: pass
                decoded = None
        if decoded is None:
            raise NoAudio(f"tts_vi.py: no audio for line '{L['id']}' after all variants and retries. Note: Check network/edge-tts connectivity or reword text.")
    y, sr = decoded
    nz = np.where(np.abs(y) > np.abs(y).max() * .02)[0]
    y = y[max(0, nz[0] - int(.03 * sr)): nz[-1] + int(.10 * sr)]
    sf.write(os.path.join(out, L['id'] + '.wav'), y, sr)
    d = round(len(y) / sr, 3)
    print(L['id'], d, L['text'])
    return L['id'], d


def gate_check(lines_path):
    """the voice is made only for words the independent reviewer passed (gate.py, --for voice)"""
    ep = os.path.dirname(os.path.dirname(os.path.abspath(lines_path)))
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    import gate
    why = gate.check(ep, 'voice')
    if why: sys.exit('tts_vi.py: cổng chấm: ' + why)


def main():
    a = sys.argv[1:]
    jobs = 1
    if '--jobs' in a:
        i = a.index('--jobs'); jobs = max(1, int(a[i + 1])); del a[i:i + 2]
    if len(a) < 2:
        sys.exit('usage: python tts_vi.py <lines.json> <out-dir> [--jobs N]   (both paths are the episode\'s; '
                 '--jobs 4–6 for a long episode)')
    lines_path, out = a[0], a[1]
    gate_check(lines_path)
    lines = json.load(open(lines_path, encoding='utf-8'))
    os.makedirs(os.path.join(out, '.cache'), exist_ok=True)
    from concurrent.futures import ThreadPoolExecutor
    try:
        with ThreadPoolExecutor(max_workers=jobs) as ex:
            got = dict(ex.map(lambda L: one(L, out), lines))
    except NoAudio as e:
        sys.exit(str(e))
    dur = {L['id']: got[L['id']] for L in lines}
    json.dump(dur, open(os.path.join(out, 'dur.json'), 'w', encoding='utf-8'), indent=1)


if __name__ == '__main__':
    main()
