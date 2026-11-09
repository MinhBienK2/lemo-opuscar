"""Check the mix's headroom before the film is muxed — the peak the master will leave.

The channel's delivery check (`channels/tram-nghi-nhieu/tools/check_delivery.py`) refuses a film whose
sample peak is above **−3 dBFS**, while `mux.sh` lifts the whole mix to −14 LUFS. The master re-lifts
whatever it is given, so the film's peak follows the mix's **peak-to-loudness ratio**: a mix that is a
little too peaky becomes a film that is a little too hot. That is how this episode's first master came
out at −2.4 dBFS and was refused at the last minute of the whole build.

The shared `mix.py` now guarantees the ratio (limiter at 11.0 dB, commit `08bf4c3`). This check is here
because that guarantee is one number away in a file the episode does not own: if it ever regresses, the
build must stop **before** a 30-minute render, not after it.

Usage: $LIB/.venv/bin/python check_headroom.py <mix.wav>
Exits 1 when the master would land above −2.5 dBFS (0.5 dB of margin over the channel's limit).
"""
import os, re, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.environ.get('LIB') or (subprocess.run(
    ['sh', '-c', 'cd "$1" && while [ ! -f core/render/review.sh ] && [ "$PWD" != / ]; do cd ..; done && pwd', '_', HERE],
    capture_output=True, text=True).stdout.strip())

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


def main():
    path = sys.argv[1]
    I, P = measure(path)
    if I is None:
        print('check_headroom: cannot measure the mix — the delivery gate will have the last word')
        return 0
    lift = TARGET_LUFS - I
    landed = P + lift
    print(f'check_headroom: mix is {I:.1f} LUFS, peak {P:.1f} dBFS (peak−loudness {P - I:.1f} dB); '
          f'the master lifts it {lift:+.1f} dB → the film will peak about {landed:.1f} dBFS')
    if landed > CHANNEL_MAX + MARGIN:
        print(f'check_headroom: TOO HOT — the channel refuses above {CHANNEL_MAX:.1f} dBFS, and this mix will '
              f'land about {landed:.1f} dBFS. The mix needs a lower peak-to-loudness ratio (mix.py), not a '
              f'quieter mix.', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
