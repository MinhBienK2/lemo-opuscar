"""Giọng đọc tiếng Việt, chạy song song (edge-tts).

Cùng đầu vào và đầu ra với voice/tts_vi.py, nhưng nhiều câu được tải cùng lúc nên một tập hai mươi
phút không phải chờ hàng giờ. Cùng một bộ nhớ đệm (voice/.cache), nên chạy lại là gần như tức thì.

  python voice/tts_par.py voice/lines.json voice/ [--jobs 4]
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


LIB = os.environ.get('LIB') or _lib_root(os.path.dirname(os.path.abspath(__file__)))
if not LIB: sys.exit('tts_par.py: set LIB to the library root (or run from inside the repository)')
sys.path.insert(0, os.path.join(LIB, 'core/tts'))
from tts_zh import to_wav, plausible   # noqa: E402

JOBS = 4


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
        if os.path.getsize(part) == 0:
            return False
        os.replace(part, path); return True
    except Exception as e:
        if type(e).__name__ != 'NoAudioReceived':
            print('  ', type(e).__name__, str(e)[:120], file=sys.stderr)
        return False
    finally:
        if os.path.exists(part):
            os.remove(part)


async def one(L, out, sem):
    voice, rate, pitch, say = L.get('voice', 'vi-VN-HoaiMyNeural'), L.get('rate', '+0%'), L.get('pitch', '+0Hz'), L.get('say', L['text'])
    key = hashlib.sha1(json.dumps([voice, rate, pitch, say], ensure_ascii=False).encode('utf-8')).hexdigest()[:16]
    mp3 = os.path.join(out, '.cache', key + '.mp3')
    async with sem:
        decoded = to_wav(mp3) if os.path.exists(mp3) else None
        if not plausible(decoded):
            decoded = None
            for k, (s, r, p) in enumerate(variants(say, rate, pitch)):
                if await fetch(s, voice, r, p, mp3):
                    decoded = to_wav(mp3)
                    if plausible(decoded):
                        if k:
                            print(f"  {L['id']}: took variant {k} ({r}, {p}{', lowercased' if s != say else ''})", file=sys.stderr)
                        break
                    os.remove(mp3); decoded = None
            if decoded is None:
                return L['id'], None, f"no audio for '{L['id']}' after every variant"
        y, sr = decoded
        nz = np.where(np.abs(y) > np.abs(y).max() * .02)[0]
        y = y[max(0, nz[0] - int(.03 * sr)): nz[-1] + int(.10 * sr)]
        sf.write(os.path.join(out, L['id'] + '.wav'), y, sr)
        return L['id'], round(len(y) / sr, 3), None


async def main():
    lines_path, out = sys.argv[1], sys.argv[2]
    jobs = JOBS
    if '--jobs' in sys.argv:
        jobs = int(sys.argv[sys.argv.index('--jobs') + 1])
    lines = json.load(open(lines_path, encoding='utf-8'))
    os.makedirs(os.path.join(out, '.cache'), exist_ok=True)
    sem = asyncio.Semaphore(jobs)
    res = await asyncio.gather(*[one(L, out, sem) for L in lines])
    dur, bad = {}, []
    for i, (lid, d, err) in enumerate(res):
        if err:
            bad.append(err); print(err, file=sys.stderr); continue
        dur[lid] = d
        print(f'{i + 1}/{len(lines)} {lid} {d}')
    if bad:
        sys.exit('\n'.join(bad))
    json.dump(dur, open(os.path.join(out, 'dur.json'), 'w', encoding='utf-8'), indent=1)
    print('total', round(sum(dur.values()), 2), 's over', len(dur), 'lines')


asyncio.run(main())
