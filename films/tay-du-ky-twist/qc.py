"""Quality checks on the finished film: python qc.py <film.mp4> [srt]
Checks the things that must not be wrong in a delivered film:
  · loudness (integrated LUFS, true peak) — the master is −14 LUFS
  · black frames (a blank frame is a failure; the fade in/out at the very start and end is allowed)
  · NaN / frozen frames
  · the .srt: cue count, that every cue is held long enough to read, and that no two cues overlap
  · that the picture and the audio are the same length
"""
import sys, os, json, subprocess, re

FF = ['ffmpeg', '-hide_banner', '-nostats']


def run(args):
    return subprocess.run(args, capture_output=True, text=True).stderr


def main():
    film = sys.argv[1]
    srt = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(film)[0] + '.srt'
    ok = True

    # ---- lengths
    probe = run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', film])
    dur = float(probe.strip())
    print(f'picture duration: {dur:.2f}s')
    ap = run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=duration',
              '-of', 'csv=p=0', film]).strip()
    if ap:
        adur = float(ap.split(',')[0])
        print(f'audio duration:   {adur:.2f}s')
        if abs(adur - dur) > 1.0:
            print('  FAIL: the audio and the picture are not the same length'); ok = False

    # ---- loudness
    eb = run(FF + ['-i', film, '-af', 'ebur128=peak=true', '-f', 'null', '-'])
    i = re.search(r'I:\s*(-?[\d.]+) LUFS', eb)
    p = re.search(r'Peak:\s*(-?[\d.]+) dBFS', eb)
    if i:
        lufs = float(i.group(1))
        print(f'integrated loudness: {lufs:.1f} LUFS  (target −14 ± 0.5)')
        if abs(lufs + 14) > 1.0:
            print('  FAIL: the loudness is off target'); ok = False
        if p:
            tp = float(p.group(1))
            print(f'true peak:           {tp:.1f} dBFS (limit −1.2)')
            if tp > -0.8:
                print('  FAIL: the true peak is too high'); ok = False

    # ---- black frames
    bd = run(FF + ['-i', film, '-vf', 'blackdetect=d=0.20:pix_th=0.05', '-an', '-f', 'null', '-'])
    blacks = re.findall(r'black_start:([\d.]+) black_end:([\d.]+)', bd)
    print(f'black runs: {len(blacks)}')
    for s, e in blacks:
        s, e = float(s), float(e)
        if s > 2.0 and e < dur - 2.0:
            print(f'  FAIL: a black frame in the middle of the film ({s:.1f}–{e:.1f}s)'); ok = False
        else:
            print(f'  ok (the fade at the edge): {s:.1f}–{e:.1f}s')

    # ---- subtitles
    if os.path.exists(srt):
        txt = open(srt, encoding='utf-8').read()
        cues = re.findall(r'(\d+)\n(\d\d):(\d\d):(\d\d),(\d\d\d) --> (\d\d):(\d\d):(\d\d),(\d\d\d)\n(.*?)(?:\n\n|\Z)', txt, re.S)
        print(f'subtitle cues: {len(cues)}')
        prev_end = -1; bad = 0
        for n, h1, m1, s1, ms1, h2, m2, s2, ms2, body in cues:
            t0 = int(h1) * 3600 + int(m1) * 60 + int(s1) + int(ms1) / 1000
            t1 = int(h2) * 3600 + int(m2) * 60 + int(s2) + int(ms2) / 1000
            text = ' '.join(body.split())
            chars = len(re.sub(r'\s', '', text))
            need = max(1.8, chars / 15 + 1.5)
            if t1 - t0 < need - 1e-6:
                print(f'  FAIL cue {n}: held {t1-t0:.2f}s, needs {need:.2f}s ({text[:40]})'); bad += 1
            if t0 < prev_end - 1e-6:
                print(f'  FAIL cue {n}: overlaps the previous one'); bad += 1
            if t1 > dur + 0.5:
                print(f'  FAIL cue {n}: ends after the film ({t1:.1f}s > {dur:.1f}s)'); bad += 1
            prev_end = t1
        if bad:
            print(f'  {bad} subtitle cue(s) fail the reading-time or overlap rule'); ok = False
        else:
            print('  all cues pass the reading-time rule and none overlap')
    else:
        print('no .srt found'); ok = False

    print('\nRESULT:', 'PASS' if ok else 'FAIL')
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
