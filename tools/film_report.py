#!/usr/bin/env python3
"""An objective report on a film that has been built: python3 tools/film_report.py <film-folder>

The delivery review (`core/render/review.sh`) grades a film against the library's rules. This one
does not grade: it measures, and prints what it measured, so a reader can look at the numbers and
judge for themselves. It is the report to run on somebody else's finished film.

What it prints:
  the file      — name, size, resolution, fps, duration, from ffprobe
  the loudness  — integrated LUFS, loudness range, true peak (target: −14 LUFS, true peak ≤ −1.0 dBFS)
  the black     — every black stretch of 0.5 s or more
  the silence   — every silent stretch of 1.0 s or more (a film with a hole in its voice)
  the subtitles — the .srt next to the film: how many lines, how long each is held, and the ones
                  held for less than a second (too fast to read) or overlapping the next one
  the frames    — one frame every --every seconds, tiled into a contact sheet (--sheet out.jpg),
                  so the whole film can be looked at at once instead of frame by frame

Exit code: 0 the film was measured; 1 something could not be measured (the reason is printed).
"""
import json
import os
import re
import subprocess
import sys


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def find_mp4(folder):
    cands = []
    for d in (folder, os.path.join(folder, 'out')):
        if not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            if f.endswith('.mp4'):
                p = os.path.join(d, f)
                cands.append((os.path.getmtime(p), p))
    return max(cands)[1] if cands else ''


def srt_files(folder):
    out = []
    for d in (folder, os.path.join(folder, 'out')):
        if not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            if f.endswith('.srt'):
                out.append(os.path.join(d, f))
    return out


def parse_srt(path):
    """the cues of an .srt: (index, start s, end s, text)"""
    text = open(path, encoding='utf8', errors='replace').read().replace('\r\n', '\n')
    cues = []
    for block in re.split(r'\n\s*\n', text.strip()):
        lines = [l for l in block.split('\n') if l.strip()]
        if len(lines) < 2:
            continue
        m = re.match(r'(\d+):(\d\d):(\d\d)[,.](\d\d\d)\s*-->\s*(\d+):(\d\d):(\d\d)[,.](\d\d\d)', lines[1])
        if not m:
            continue
        g = [int(x) for x in m.groups()]
        start = g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000
        end = g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000
        cues.append((int(lines[0]) if lines[0].strip().isdigit() else len(cues) + 1, start, end, ' '.join(lines[2:])))
    return cues


def has_audio_stream(streams):
    """does the file carry a sound track at all?

    A file with no audio track is not a film that happens to be quiet — it is a film with no
    sound. The two must never be reported the same way: "no silent stretch of 1.0 s or more"
    read on a file that has no sound at all is a false pass, and the loudness line "not
    measured" hides the reason.
    """
    return any(s.get('codec_type') == 'audio' for s in streams or [])


def selftest():
    cases = [
        ('có tiếng', has_audio_stream([{'codec_type': 'video'}, {'codec_type': 'audio'}]), True),
        ('chỉ có hình', has_audio_stream([{'codec_type': 'video'}]), False),
        ('không có luồng nào', has_audio_stream([]), False),
    ]
    fails = 0
    for name, got, want in cases:
        ok = got == want
        print('%-4s %s' % ('ok' if ok else 'FAIL', name))
        if not ok:
            fails += 1
    print('\n%d ca đều đúng' % len(cases) if not fails else '\n%d ca hỏng' % fails)
    return 1 if fails else 0


def main():
    argv = sys.argv[1:]
    if '--selftest' in argv:
        return selftest()
    opts, rest = {}, []
    i = 0
    while i < len(argv):
        a = argv[i]
        if a.startswith('--'):
            key = a[2:]
            if '=' in key:
                k, v = key.split('=', 1)
                opts[k] = v
            elif i + 1 < len(argv) and not argv[i + 1].startswith('--'):
                opts[key] = argv[i + 1]
                i += 1
            else:
                opts[key] = '1'
        else:
            rest.append(a)
        i += 1
    args = rest
    if not args:
        print(__doc__)
        return 1
    folder = args[0]
    every = float(opts.get('every', '10'))
    sheet = opts.get('sheet', '')

    mp4 = find_mp4(folder)
    if not mp4:
        print(f"film-report: no .mp4 in {folder} — nothing to measure")
        return 1
    print(f"== the file\n{mp4}  ({os.path.getsize(mp4) / 1e6:.1f} MB)")

    pr = run(['ffprobe', '-v', 'error', '-show_entries',
              'stream=width,height,r_frame_rate,codec_type:format=duration',
              '-of', 'json', mp4])
    try:
        info = json.loads(pr.stdout)
    except Exception:
        print(f"film-report: ffprobe could not read the file: {pr.stderr.strip()[:200]}")
        return 1
    streams = info.get('streams', [])
    dur = float(info.get('format', {}).get('duration', 0))
    for s in streams:
        if s.get('codec_type') == 'video':
            print(f"   {s.get('width')}x{s.get('height')}  {s.get('r_frame_rate')} fps")
    print(f"   {dur:.1f} s ({int(dur // 60)}:{dur % 60:04.1f})")
    has_audio = has_audio_stream(streams)
    if not has_audio:
        print("   NO SOUND: the file has no audio track at all")

    # loudness
    print("== the loudness")
    if not has_audio:
        print("   not measured: the file has no audio track")
    else:
        lr = run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp4, '-af', 'ebur128=peak=true', '-f', 'null', '-'])
        log = lr.stderr
        I = re.findall(r'^\s+I:\s*(-?[\d.]+) LUFS', log, re.M)
        LRA = re.findall(r'^\s+LRA:\s*(-?[\d.]+) LU', log, re.M)
        PK = re.findall(r'^\s+Peak:\s*(-?[\d.]+) dBFS', log, re.M)
        if I:
            i = float(I[-1])
            print(f"   integrated {i:.1f} LUFS" + (f"  ·  range {LRA[-1]} LU" if LRA else '') +
                  (f"  ·  true peak {PK[-1]} dBFS" if PK else ''))
            verdict = []
            if not (-20 <= i <= -11):
                verdict.append(f"integrated loudness {i:.1f} LUFS is outside −20…−11 (target −14)")
            if PK and float(PK[-1]) > -1.0:
                verdict.append(f"true peak {PK[-1]} dBFS is above −1.0 dBFS")
            print("   " + ("; ".join(verdict) if verdict else "within the target"))
        else:
            print("   not measured: ffmpeg read the track but reported no loudness")

    # black stretches
    br = run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp4, '-vf', 'blackdetect=d=0.5', '-f', 'null', '-'])
    blacks = re.findall(r'black_start:([\d.]+) black_end:([\d.]+)', br.stderr)
    print("== the black")
    print("   " + (", ".join(f"{a}s–{b}s" for a, b in blacks) if blacks else "no black stretch of 0.5 s or more"))

    # silence
    print("== the silence")
    if not has_audio:
        print("   the file has no audio track — this is not a film whose voice stops, it is a film with no sound")
    else:
        sr = run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp4, '-af', 'silencedetect=noise=-45dB:d=1.0', '-f', 'null', '-'])
        sil = re.findall(r'silence_start: (-?[\d.]+) \| silence_end: (-?[\d.]+)', sr.stderr)
        print("   " + (", ".join(f"{a}s–{b}s" for a, b in sil) if sil else "no silent stretch of 1.0 s or more"))

    # subtitles
    srt = srt_files(folder)
    print("== the subtitles")
    if not srt:
        print("   no .srt next to the film")
    else:
        for path in srt:
            cues = parse_srt(path)
            if not cues:
                print(f"   {os.path.basename(path)}: no cue could be read")
                continue
            fast = [(i, e - s) for i, s, e, _ in cues if e - s < 1.0]
            over = [(cues[k][0], cues[k + 1][0]) for k in range(len(cues) - 1) if cues[k + 1][1] < cues[k][2]]
            long_ = [i for i, s, e, _ in cues if e - s > 12]
            print(f"   {os.path.basename(path)}: {len(cues)} cues, "
                  f"{min(e - s for _, s, e, _ in cues):.2f}–{max(e - s for _, s, e, _ in cues):.2f} s each")
            if fast:
                print(f"     held under a second (too fast to read): {[(i, round(d, 2)) for i, d in fast][:10]}")
            if over:
                print(f"     overlapping the next cue: {over[:10]}")
            if long_:
                print(f"     held over 12 s: {long_[:10]}")

    # a contact sheet of the built film
    if sheet:
        frames = []
        tmp = os.path.join('/tmp', 'filmreport-' + os.path.basename(folder))
        os.makedirs(tmp, exist_ok=True)
        t = 0.0
        while t < dur:
            out = os.path.join(tmp, f'f_{int(t):05d}.jpg')
            run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', f'{t:.2f}', '-i', mp4, '-frames:v', '1',
                 '-vf', 'scale=480:-1', out])
            if os.path.exists(out):
                frames.append(out)
            t += every
        if frames:
            r = run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'core', 'render', 'sheet.py'),
                     sheet, *frames, '--cols', '4'])
            print(f"== the frames\n   {len(frames)} frames every {every:g}s → {sheet}  {r.stdout.strip()}")
        else:
            print("== the frames\n   no frame could be extracted")
    if not has_audio:
        print("== the verdict\n   the film has no audio track")
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
