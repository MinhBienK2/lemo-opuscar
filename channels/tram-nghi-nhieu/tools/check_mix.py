"""Will the finished film be too loud? Ask it before the render, not after.

    python3 channels/tram-nghi-nhieu/tools/check_mix.py <episode> [--mix <file>]
    python3 channels/tram-nghi-nhieu/tools/check_mix.py --selftest

The film's audio is the mix lifted to −14 LUFS by `core/render/mux.sh`, and AAC adds ~0.4 dB of
inter-sample peak on top of that, so the peak the viewer finally gets is

    (the mix's peak − the mix's loudness) − 13.6 dB

Two gates ask two different questions about that one file: the channel's own delivery check
(`tools/check_delivery.py`) refuses a film whose sample peak is above **−3.0 dB**, while the library's
delivery gate only asks for true peak ≤ −1.0 dBFS. A film can pass the library's gate and then fail the
channel's check — and it fails *after* the render, which is the most expensive moment to find out
(tap-01: the final round died at 15:18 on a number, and the film had to be rendered again).

This check asks the same question before the render, and it keeps **its own** threshold rather than
reading the mixer's, so a change in `tools/mix.py` cannot quietly move the bar with it.

Measured on tap-01, both ways:
    mix −8.7 dBFS / −18.5 LUFS  →  the film lands at about −3.8 dB   (passes)
    mix −6.9 dBFS / −18.1 LUFS  →  the film lands at about −2.4 dB   (refused)
"""
import os
import re
import subprocess
import sys

TARGET_LUFS = -14.0     # what mux.sh masters to
INTERSAMPLE = 0.4       # what the master adds on top of the mix's own peak
BAR = -2.5              # the predicted film peak must stay under this (the channel refuses above −3.0)


def measure(path):
    """(integrated LUFS, true peak dBFS) of a file, measured the way the gates measure"""
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true',
                        '-f', 'null', '-'], capture_output=True, text=True).stderr
    i = re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', r, re.M)
    p = re.findall(r'^\s+Peak:\s+(-?[\d.]+) dBFS', r, re.M)
    return (float(i[-1]), float(p[-1])) if i and p else (None, None)


def predicted_film_peak(I, P):
    """the peak the finished film will have, given this mix"""
    return P + (TARGET_LUFS - I) + INTERSAMPLE


def check(path):
    """(ok, message) — ok is False when the film would come out too loud"""
    if not os.path.isfile(path):
        return False, f'không có tệp âm thanh: {path}'
    I, P = measure(path)
    if I is None or P is None:
        return False, f'không đo được âm thanh của {path} — phim sẽ được nâng cân bằng mù'
    want = predicted_film_peak(I, P)
    head = P - I
    if want > BAR:
        return False, (f'mix {I:.1f} LUFS, peak {P:.1f} dBFS (headroom {head:.1f} dB) → phim sẽ ra '
                       f'khoảng {want:.1f} dB, vượt ngưỡng {BAR:.1f} dB (cổng của kênh từ chối trên −3.0 dB). '
                       f'Hạ đỉnh rồi trộn lại.')
    return True, (f'mix {I:.1f} LUFS, peak {P:.1f} dBFS (headroom {head:.1f} dB) → phim sẽ ra khoảng '
                  f'{want:.1f} dB, dưới ngưỡng {BAR:.1f} dB')


def selftest():
    """một cái kiểm trả lời "được" cho mọi thứ thì không phải kiểm"""
    import tempfile
    tmp = tempfile.mkdtemp(prefix='check-mix-')
    ok = True
    try:
        # a steady tone: loudness and peak sit close together → a cool mix
        steady = os.path.join(tmp, 'steady.wav')
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=2',
                        '-ar', '48000', '-ac', '2', steady], check=True)
        good, msg = check(steady)
        print(('ok   ' if good else 'FAIL ') + 'mix êm đều thì qua: ' + msg)
        ok = ok and good

        # a loud click on a quiet bed: the peak stands far above the loudness → a hot mix
        hot = os.path.join(tmp, 'hot.wav')
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=2',
                        '-ar', '48000', '-ac', '2', '-af', 'volume=enable=\'between(t,0.9,0.91)\':volume=8',
                        hot], check=True)
        good, msg = check(hot)
        print(('FAIL ' if good else 'ok   ') + 'mix có đỉnh đứng thì bị chặn: ' + msg)
        ok = ok and not good

        # no file at all
        good, msg = check(os.path.join(tmp, 'khong-co.wav'))
        print(('FAIL ' if good else 'ok   ') + 'không có tệp thì bị chặn: ' + msg)
        ok = ok and not good
    finally:
        subprocess.run(['rm', '-rf', tmp])
    print('check_mix --selftest: ' + ('3/3 ok' if ok else 'có ca hỏng'))
    return 0 if ok else 1


def main():
    if '--selftest' in sys.argv[1:]:
        return selftest()
    if len(sys.argv) < 2:
        print(__doc__.strip())
        return 2
    ep = sys.argv[1]
    mix = None
    if '--mix' in sys.argv:
        mix = sys.argv[sys.argv.index('--mix') + 1]
    if mix is None:
        mix = os.path.join(ep, 'out', 'mix.wav')
    ok, msg = check(mix)
    print(('check_mix: ' if ok else 'check_mix: FAIL ') + msg)
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main())
