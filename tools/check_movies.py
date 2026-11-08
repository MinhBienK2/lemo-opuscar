"""Check the movies the repository holds: python3 tools/check_movies.py

The library's delivery gate can only run on the machine that made the film: it opens a browser, so it reads the
picture, not the file. This check asks the movie itself, and it runs wherever CI runs. For every film whose movie
is **in the repository** — the one-shots keep their movie, a channel's episode keeps it out because it is too big
for GitHub — it measures:

  - the format: 1920×1080 at 24 fps, unless the film's own manifest says otherwise (DIRECTOR.md §14);
  - the loudness: about −14 LUFS, true peak at or below −0.8 dBFS (DIRECTOR.md §16, the same bounds the delivery
    gate uses);
  - the runtime the manifest claims against the one ffprobe measures, within 1.5 s.

A film whose movie is not in the repository is skipped with a message: there is nothing here to measure, and a
check that cannot check is not a pass — so the skip is printed, not silent.

Exit code: 0 everything that can be measured is right; 1 something is wrong; 2 the tools (ffmpeg/ffprobe) are not
there.
"""
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_films_index import ROOT, discovery, held_by_repo  # noqa: E402  (the index tools share the discovery)

W, H, FPS = 1920, 1080, 24
LUFS_LO, LUFS_HI, PEAK_MAX = -20.0, -11.0, -0.8
RUNTIME_TOLERANCE = 1.5


def run(cmd, **kw):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=900, **kw)
    except (OSError, subprocess.SubprocessError):
        return None


def measure(path):
    """what ffprobe and ffmpeg say about a movie: size, rate, seconds, integrated LUFS, true peak dBFS"""
    pr = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
              '-show_entries', 'stream=width,height,r_frame_rate', '-show_entries', 'format=duration',
              '-of', 'json', path])
    if pr is None or pr.returncode != 0:
        return None
    try:
        data = json.loads(pr.stdout)
        st = data['streams'][0]
        num, den = (st.get('r_frame_rate') or '0/1').split('/')
        fps = float(num) / float(den) if float(den) else 0.0
        seconds = float(data['format']['duration'])
    except (ValueError, KeyError, IndexError):
        return None
    loud = run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-af', 'ebur128=peak=true', '-f', 'null', '-'])
    if loud is None or loud.returncode != 0:
        return None
    integrated = peak = None
    for line in loud.stderr.splitlines():
        parts = line.split()
        if len(parts) >= 3 and parts[0] == 'I:' and parts[1].lstrip('-').replace('.', '').isdigit():
            integrated = float(parts[1])
        if len(parts) >= 3 and parts[0] == 'Peak:' and parts[1].lstrip('-').replace('.', '').isdigit():
            peak = float(parts[1])
    return {'w': st.get('width'), 'h': st.get('height'), 'fps': fps, 'seconds': seconds,
            'lufs': integrated, 'peak': peak}


def mmss(seconds):
    return '{}:{:02d}'.format(int(seconds // 60), int(seconds % 60))


def claimed_runtime(manifest):
    """the runtime the manifest claims, in seconds, or None"""
    text = (manifest.get('runtime') or '').strip()
    parts = text.split(':')
    if len(parts) != 2 or not all(p.strip().isdigit() for p in parts):
        return None
    return int(parts[0]) * 60 + int(parts[1])


def main():
    lib = discovery()
    films = lib.get('films') or []
    if not films:
        print('check_movies: FAIL no film was found: the discovery module found nothing, so nothing was checked')
        return 1
    if run(['ffprobe', '-version']) is None:
        print('check_movies: FAIL ffprobe is not here: a check that cannot check is not a pass')
        return 2

    bad = 0
    checked = 0
    for film in films:
        rel = film['rel']
        tracked = held_by_repo(rel)
        movies = [f for f in tracked if f.endswith('.mp4')]
        if not movies:
            print(f'  skipped: {rel} — the repository holds no movie for it (a channel\'s episode keeps it out: too big)')
            continue
        manifest = film.get('manifest') or {}
        want_seconds = claimed_runtime(manifest)
        for rel_path in movies:
            path = os.path.join(ROOT, rel_path)
            if not os.path.isfile(path):
                print(f'  FAIL {rel_path}: the repository holds it, but the file is not on this disk')
                bad += 1
                continue
            m = measure(path)
            if m is None:
                print(f'  FAIL {rel_path}: ffprobe or ffmpeg could not read it')
                bad += 1
                continue
            checked += 1
            problems = []
            if m['w'] != W or m['h'] != H:
                problems.append(f'it is {m["w"]}×{m["h"]}, the library\'s format is {W}×{H}')
            if abs(m['fps'] - FPS) > 0.5:
                problems.append(f'it runs at {m["fps"]:.3f} fps, the library\'s rate is {FPS}')
            if m['lufs'] is None or not (LUFS_LO <= m['lufs'] <= LUFS_HI):
                problems.append(f'its loudness is {m["lufs"]} LUFS, the target is −14 (bounds {LUFS_LO}…{LUFS_HI})')
            if m['peak'] is None or m['peak'] > PEAK_MAX:
                problems.append(f'its true peak is {m["peak"]} dBFS, the ceiling is {PEAK_MAX}')
            if want_seconds is not None and abs(m['seconds'] - want_seconds) > RUNTIME_TOLERANCE:
                problems.append(f'the manifest says {mmss(want_seconds)}, the movie is {mmss(m["seconds"])}')
            if problems:
                bad += 1
                print(f'  FAIL {rel_path}: ' + '; '.join(problems))
            else:
                print(f'  ok: {rel_path} — {mmss(m["seconds"])}, {m["lufs"]} LUFS, peak {m["peak"]} dBFS, '
                      f'{m["w"]}×{m["h"]} at {m["fps"]:.0f} fps')

    if bad:
        print(f'check_movies: FAILED ({bad} problem{"s" if bad > 1 else ""})')
        return 1
    if not checked:
        print('check_movies: nothing to measure — the repository holds no movie')
        return 1
    print(f'check_movies: {checked} movie(s) measured: the format, the loudness and the runtime are right')
    return 0


if __name__ == '__main__':
    sys.exit(main())
