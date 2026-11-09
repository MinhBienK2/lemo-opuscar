"""Check the mix's headroom before the film is muxed — the peak the master will leave.

The channel's delivery check (`check_delivery.py`) refuses a film whose sample peak is above **−3 dBFS**, while
`mux.sh` lifts the whole mix to −14 LUFS. The master re-lifts whatever it is given, so the film's peak follows the
mix's **peak-to-loudness ratio**: a mix that is a little too peaky becomes a film that is a little too hot, and is
refused only after the whole render.

`mix.py` guarantees the ratio (its limiter). This check stops a build **before** a long render if that guarantee
ever regresses. An episode's build.sh calls it right after the mix:
  "$LIB/.venv/bin/python" "$CHANNEL/tools/check_headroom.py" "$OUT/mix.wav"

Exits 1 when the master would land above −2.5 dBFS (0.5 dB of margin over the channel's limit).
  python3 check_headroom.py --selftest
"""
import os, re, subprocess, sys

TARGET_LUFS = -14.0     # what mux.sh masters to
CHANNEL_MAX = -3.0      # the channel's delivery check refuses a sample peak above this
MARGIN = 0.5            # how far below the limit this check insists on, so a wobble does not stop a build


def measure(path):
    """(integrated LUFS, true peak dBFS) of a file, measured the way the gates measure"""
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true',
                        '-f', 'null', '-'], capture_output=True, text=True).stderr
    i = re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', r, re.M)
    p = re.findall(r'^\s+Peak:\s+(-?[\d.]+) dBFS', r, re.M)
    return (float(i[-1]), float(p[-1])) if i and p else (None, None)


def landing(path):
    """(LUFS, peak, where the master's peak lands) or None when the file cannot be measured"""
    I, P = measure(path)
    return None if I is None else (I, P, P + TARGET_LUFS - I)


def check(path):
    m = landing(path)
    if m is None:
        print('check_headroom: cannot measure the mix — the delivery gate will have the last word')
        return 0
    I, P, landed = m
    print(f'check_headroom: mix is {I:.1f} LUFS, peak {P:.1f} dBFS (peak−loudness {P - I:.1f} dB); '
          f'the master lifts it {TARGET_LUFS - I:+.1f} dB → the film will peak about {landed:.1f} dBFS')
    if landed > CHANNEL_MAX + MARGIN:
        print(f'check_headroom: TOO HOT — the channel refuses above {CHANNEL_MAX:.1f} dBFS, and this mix will '
              f'land about {landed:.1f} dBFS. The mix needs a lower peak-to-loudness ratio (mix.py), not a '
              f'quieter mix.', file=sys.stderr)
        return 1
    return 0


def selftest():
    import math, shutil, struct, tempfile, wave
    tmp = tempfile.mkdtemp(prefix='headroom-selftest-')
    ok = True

    def wav(name, sample):
        p = os.path.join(tmp, name)
        with wave.open(p, 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(48000)
            w.writeframes(b''.join(struct.pack('<h', int(32767 * sample(i))) for i in range(48000 * 4)))
        return p

    def expect(cond, what):
        nonlocal ok
        print(('ok   ' if cond else 'FAIL ') + what)
        ok = ok and cond
    try:
        steady = wav('steady.wav', lambda i: 0.5 * math.sin(2 * math.pi * 440 * i / 48000))
        spiky = wav('spiky.wav', lambda i: 0.9 if i % 24000 == 0 else 0.01 * math.sin(2 * math.pi * 440 * i / 48000))
        expect(check(steady) == 0, 'a steady mix (low peak-to-loudness) passes')
        expect(check(spiky) == 1, 'a quiet mix with loud clicks would master too hot, and is stopped')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print('check_headroom selftest:', 'PASS' if ok else 'FAIL')
    return 0 if ok else 1


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['--selftest']: sys.exit(selftest())
    if len(a) != 1: sys.exit(__doc__)
    sys.exit(check(a[0]))
