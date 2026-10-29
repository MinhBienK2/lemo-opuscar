"""Vietnamese edge-tts with retries: python voice/tts_vi.py voice/lines.json voice/
Same inputs and outputs as $LIB/core/tts/tts_zh.py (<id>.wav, dur.json, .cache/), whose decoding and checks it reuses.
The Vietnamese voices sometimes return no audio for an ordinary sentence ("Có một con mèo" fails, "có một con mèo" works),
so a line that fails is tried again with small changes the listener can't hear: first letter lowercased, rate ±1 %, pitch ±1 Hz.
"""
import sys, os, json, asyncio, hashlib
import numpy as np, soundfile as sf
LIB = os.environ['LIB']   # the library root (build.sh sets it)
sys.path.insert(0, os.path.join(LIB, 'core/tts'))
from tts_zh import to_wav, plausible   # noqa: E402


def variants(say, rate, pitch):
    r, p = int(rate.rstrip('%')), int(pitch.rstrip('Hz'))
    low = say[:1].lower() + say[1:]
    for s in (say, low):
        yield s, rate, pitch
        for dr, dp in ((1, 0), (-1, 0), (0, 1), (0, -1), (2, 1), (-2, -1)):
            yield s, f'{r + dr:+d}%', f'{p + dp:+d}Hz'


async def fetch(text, voice, rate, pitch, path):
    import edge_tts
    part = path + '.part'
    try:
        await edge_tts.Communicate(text, voice, rate=rate, pitch=pitch).save(part)
        if os.path.getsize(part) == 0: return False
        os.replace(part, path); return True
    except Exception as e:
        if type(e).__name__ != 'NoAudioReceived': print('  ', type(e).__name__, str(e)[:120], file=sys.stderr)
        return False
    finally:
        if os.path.exists(part): os.remove(part)


def main():
    lines_path, out = sys.argv[1], sys.argv[2]
    lines = json.load(open(lines_path, encoding='utf-8'))
    os.makedirs(os.path.join(out, '.cache'), exist_ok=True)
    dur = {}
    for L in lines:
        voice, rate, pitch, say = L.get('voice', 'vi-VN-HoaiMyNeural'), L.get('rate', '+0%'), L.get('pitch', '+0Hz'), L.get('say', L['text'])
        key = hashlib.sha1(json.dumps([voice, rate, pitch, say], ensure_ascii=False).encode('utf-8')).hexdigest()[:16]
        mp3 = os.path.join(out, '.cache', key + '.mp3')
        decoded = to_wav(mp3) if os.path.exists(mp3) else None
        if not plausible(decoded):
            decoded = None
            for k, (s, r, p) in enumerate(variants(say, rate, pitch)):
                if asyncio.run(fetch(s, voice, r, p, mp3)):
                    decoded = to_wav(mp3)
                    if plausible(decoded):
                        if k: print(f"  {L['id']}: took variant {k} ({r}, {p}{', lowercased' if s != say else ''})", file=sys.stderr)
                        break
                    os.remove(mp3); decoded = None
            if decoded is None: sys.exit(f"tts_vi.py: no audio for line '{L['id']}' after every variant; reword it")
        y, sr = decoded
        nz = np.where(np.abs(y) > np.abs(y).max() * .02)[0]
        y = y[max(0, nz[0] - int(.03 * sr)): nz[-1] + int(.10 * sr)]
        sf.write(os.path.join(out, L['id'] + '.wav'), y, sr); dur[L['id']] = round(len(y) / sr, 3)
        print(L['id'], dur[L['id']], L['text'])
    json.dump(dur, open(os.path.join(out, 'dur.json'), 'w', encoding='utf-8'), indent=1)


if __name__ == '__main__':
    main()
