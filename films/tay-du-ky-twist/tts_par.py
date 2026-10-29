"""Parallel Vietnamese edge-tts with the same cache/output as tts_vi.py: python tts_par.py voice/lines.json voice/ [--conc 6]"""
import sys, os, json, asyncio, hashlib
import numpy as np, soundfile as sf
LIB = os.environ['LIB']
sys.path.insert(0, os.path.join(LIB, 'core/tts'))
from tts_zh import to_wav, plausible

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
        if os.path.exists(part):
            try: os.remove(part)
            except OSError: pass

async def one(L, out, sem, dur, lock):
    voice, rate, pitch = L.get('voice', 'vi-VN-HoaiMyNeural'), L.get('rate', '+2%'), L.get('pitch', '+0Hz')
    say = L.get('say', L['text'])
    key = hashlib.sha1(json.dumps([voice, rate, pitch, say], ensure_ascii=False).encode('utf-8')).hexdigest()[:16]
    mp3 = os.path.join(out, '.cache', key + '.mp3')
    async with sem:
        decoded = to_wav(mp3) if os.path.exists(mp3) else None
        if not plausible(decoded):
            decoded = None
            for k, (s, r, p) in enumerate(variants(say, rate, pitch)):
                if await fetch(s, voice, r, p, mp3):
                    decoded = to_wav(mp3)
                    if plausible(decoded): break
                    os.remove(mp3); decoded = None
            if decoded is None: raise SystemExit(f"no audio for line '{L['id']}' after every variant; reword it")
    y, sr = decoded
    nz = np.where(np.abs(y) > np.abs(y).max() * .02)[0]
    y = y[max(0, nz[0] - int(.03 * sr)):nz[-1] + int(.10 * sr)]
    sf.write(os.path.join(out, L['id'] + '.wav'), y, sr)
    async with lock:
        dur[L['id']] = round(len(y) / sr, 3)
        print(L['id'], dur[L['id']], flush=True)

async def main():
    lines = json.load(open(sys.argv[1], encoding='utf-8')); out = sys.argv[2]
    conc = int(sys.argv[sys.argv.index('--conc') + 1]) if '--conc' in sys.argv else 6
    os.makedirs(os.path.join(out, '.cache'), exist_ok=True)
    for n in os.listdir(os.path.join(out, '.cache')):
        if n.endswith('.part'): os.remove(os.path.join(out, '.cache', n))
    dur, lock = {}, asyncio.Lock()
    sem = asyncio.Semaphore(conc)
    await asyncio.gather(*(one(L, out, sem, dur, lock) for L in lines))
    json.dump(dur, open(os.path.join(out, 'dur.json'), 'w', encoding='utf-8'), indent=1)
    print('lines', len(dur), 'total', round(sum(dur.values()), 1), 's')

asyncio.run(main())
