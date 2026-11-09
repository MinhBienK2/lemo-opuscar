"""What the machine can say about a finished film, before anyone watches it.

    python3 channels/tram-nghi-nhieu/tools/check_delivery.py <episode>
    python3 channels/tram-nghi-nhieu/tools/check_delivery.py <episode> --facts    (a report for the critic)

The final QA of step 7 had **no tool**: it ran as a subagent whose report nothing read — no round number, no
signature, nobody asked whether the step passed (N51). And a critic reads *images*, so the facts that decide
whether a film may be published were nobody's job: how long it is, whether it has an audio track, how loud
it is, where it falls silent, whether every line of the narration has its voice, whether the film has a
sound of its own at all. A film can pass every picture review and still be a slideshow with a voice on it.

What it checks:

  1. the film exists and is not empty;
  2. it has a video stream **and** an audio stream;
  3. the manifest does not lie about the length — the runtime was once typed by hand and the index read it (N19);
  4. the film is not silent: the voice is the film;
  5. no silence longer than `--max-silence` seconds — the ambience and the foley are what the picture cuts on;
  6. every line of the narration has its voice event;
  7. the film declares foley of its own — a picture with no sound of its own is a slideshow with a voice.

The check stops **before** a review round is spent on a film that fails one of these; the facts it measures
are also written out for the critic, because a critic reading images cannot hear any of them.

Exit code: 0 the film holds; 1 it does not; 2 usage.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_SILENCE = 4.0          # seconds of silence that a toon with a voice and an ambience may not have
LOUD_MIN = -45.0               # dB — below this the track is silence, not a quiet mix
LOUD_MAX = -3.0                # dB — above this the mix clips
MANIFEST_SLACK = 3.0           # seconds the manifest may differ from the measurement


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def probe(path):
    """what ffprobe says about the film, or None when it cannot read it"""
    if not (shutil.which('ffprobe') and os.path.isfile(path)):
        return None
    r = run(['ffprobe', '-v', 'error', '-show_entries',
             'format=duration:stream=codec_type,width,height,r_frame_rate', '-of', 'json', path])
    if r.returncode != 0:
        return None
    try:
        return json.loads(r.stdout)
    except ValueError:
        return None


def fps_of(stream):
    """the frame rate as a number, from the '30000/1001' form ffprobe prints"""
    s = (stream or {}).get('r_frame_rate', '')
    if '/' in s:
        a, b = s.split('/')
        try:
            a, b = float(a), float(b)
            return round(a / b, 3) if b else None
        except ValueError:
            return None
    try:
        return float(s)
    except ValueError:
        return None


def loudness(path):
    """(mean dB, max dB) of the whole track, or None when there is no audio to measure"""
    if not shutil.which('ffmpeg'):
        return None
    r = run(['ffmpeg', '-hide_banner', '-i', path, '-af', 'volumedetect', '-f', 'null', '-'])
    mean = peak = None
    for line in r.stderr.splitlines():
        m = re.search(r'mean_volume:\s*(-?[\d.]+)\s*dB', line)
        if m:
            mean = float(m.group(1))
        m = re.search(r'max_volume:\s*(-?[\d.]+)\s*dB', line)
        if m:
            peak = float(m.group(1))
    return (mean, peak) if mean is not None else None


def silences(path, min_dur):
    """the stretches of silence longer than min_dur, as (start, end) pairs"""
    if not shutil.which('ffmpeg'):
        return []
    r = run(['ffmpeg', '-hide_banner', '-i', path, '-af',
             f'silencedetect=noise={LOUD_MIN}dB:d={min_dur}', '-f', 'null', '-'])
    starts = [float(m.group(1)) for m in re.finditer(r'silence_start:\s*(-?[\d.]+)', r.stderr)]
    ends = [float(m.group(1)) for m in re.finditer(r'silence_end:\s*(-?[\d.]+)', r.stderr)]
    out = []
    for i, s in enumerate(starts):
        e = ends[i] if i < len(ends) else None
        out.append((s, e))
    return out


def mmss(sec):
    """seconds as m:ss — the form the manifest uses"""
    if sec is None:
        return '?'
    return f'{int(sec // 60)}:{int(round(sec % 60)):02d}'


def manifest_seconds(text):
    """'2:56' or '176' as seconds, or None"""
    if not text:
        return None
    text = str(text).strip()
    m = re.match(r'^(?:(\d+):)?(\d+(?:\.\d+)?)$', text)
    if not m:
        return None
    if m.group(1):
        return int(m.group(1)) * 60 + float(m.group(2))
    return float(m.group(2))


def episode_facts(ep, max_silence=DEFAULT_SILENCE):
    """everything this check knows about the film, and the problems it found"""
    facts, bad = [], []
    mp4s = sorted((os.path.join(ep, f) for f in os.listdir(ep) if f.endswith('.mp4')),
                  key=lambda p: os.path.getmtime(p), reverse=True) if os.path.isdir(ep) else []
    mp4 = mp4s[0] if mp4s else None
    if not mp4 or os.path.getsize(mp4) == 0:
        return {'mp4': None, 'facts': [], 'bad': ['chưa có phim .mp4 trong thư mục tập'], 'duration': None}

    info = probe(mp4)
    if not info:
        return {'mp4': mp4, 'facts': [], 'bad': ['ffprobe không đọc được phim'], 'duration': None}
    streams = info.get('streams', [])
    video = [s for s in streams if s.get('codec_type') == 'video']
    audio = [s for s in streams if s.get('codec_type') == 'audio']
    dur = float(info.get('format', {}).get('duration') or 0)
    v = video[0] if video else {}
    facts.append(f'- Phim: `{os.path.basename(mp4)}` — {mmss(dur)} ({dur:.1f} s), '
                 f'{v.get("width", "?")}×{v.get("height", "?")}, {fps_of(v) or "?"} fps')

    if not video:
        bad.append('phim không có luồng hình')
    if not audio:
        bad.append('phim không có luồng âm thanh — một phim có giọng kể mà không có tiếng là phim hỏng')
    if dur <= 0:
        bad.append('phim có độ dài bằng không')

    # the manifest, and whether it still tells the truth
    man = None
    mf = os.path.join(ep, 'film.json')
    if os.path.isfile(mf):
        try:
            man = json.load(open(mf, encoding='utf-8')).get('runtime')
        except ValueError:
            man = None
    if man:
        ms = manifest_seconds(man)
        facts.append(f'- Manifest `film.json` ghi `{man}`; đo được {mmss(dur)}')
        if ms is not None and abs(ms - dur) > MANIFEST_SLACK:
            bad.append(f'manifest ghi `{man}` nhưng phim dài {mmss(dur)} — người đọc index sẽ thấy sai')
    else:
        facts.append('- Manifest `film.json` không ghi `runtime`')

    # how loud, and how quiet
    ld = loudness(mp4)
    if ld:
        mean, peak = ld
        facts.append(f'- Âm lượng: trung bình {mean:.1f} dB, đỉnh {peak:.1f} dB')
        if mean < LOUD_MIN:
            bad.append(f'phim gần như im lặng (trung bình {mean:.1f} dB)')
        if peak > LOUD_MAX:
            bad.append(f'mix bị chói (đỉnh {peak:.1f} dB)')
    else:
        bad.append('không đo được âm lượng (không có ffmpeg, hoặc không có luồng âm thanh)')

    # the quiet stretches
    sil = silences(mp4, max_silence)
    if sil:
        longest = max((e - s) if e is not None else 0 for s, e in sil)
        facts.append(f'- Im lặng dài hơn {max_silence:g}s: {len(sil)} chỗ, chỗ dài nhất {longest:.1f}s')
        bad.append(f'phim im lặng {len(sil)} chỗ quá {max_silence:g}s (chỗ dài nhất {longest:.1f}s)')
    else:
        facts.append(f'- Không có chỗ im lặng nào dài quá {max_silence:g}s')

    # what the film declares about itself
    ev_file = os.path.join(ep, 'events.json')
    ev = []
    if os.path.isfile(ev_file):
        try:
            ev = json.load(open(ev_file, encoding='utf-8')).get('ev', [])
        except ValueError:
            ev = []
    kinds = {}
    for x in ev:
        kinds[x.get('type', '?')] = kinds.get(x.get('type', '?'), 0) + 1
    voice = kinds.get('voice', 0)
    foley = sum(v for k, v in kinds.items() if k not in ('voice', 'amb', 'music'))
    lf = os.path.join(ep, 'voice/lines.json')
    nlines = 0
    if os.path.isfile(lf):
        try:
            nlines = len(json.load(open(lf, encoding='utf-8')))
        except ValueError:
            nlines = 0
    facts.append(f'- Sự kiện trong `events.json`: {len(ev)} — giọng {voice}, foley {foley}, '
                 f'ambience {kinds.get("amb", 0)}, nhạc {kinds.get("music", 0)}; lời kể có {nlines} câu')
    if nlines and voice != nlines:
        bad.append(f'{nlines} câu lời kể nhưng phim chỉ khai {voice} sự kiện giọng — có câu không có tiếng')
    if nlines and foley == 0:
        bad.append('phim không khai một tiếng động nào của riêng nó — hình có động tác mà không có tiếng')

    return {'mp4': mp4, 'facts': facts, 'bad': bad, 'duration': dur}


def report(ep, max_silence=DEFAULT_SILENCE):
    r = episode_facts(ep, max_silence)
    if not r['bad']:
        for f in r['facts']:
            print(f)
        print('check_delivery: phim giữ được những điều máy kiểm được')
        return 0
    for f in r['facts']:
        print(f)
    print('check_delivery: những điều sau phải sửa trước khi nghiệm thu:')
    for b in r['bad']:
        print(f'  - {b}')
    return 1


def facts_markdown(ep, max_silence=DEFAULT_SILENCE):
    """the same facts, written for the critic — a critic reads images, so it cannot hear any of them"""
    r = episode_facts(ep, max_silence)
    out = ['# Những điều máy đo được về phim', '']
    out += r['facts'] or ['- máy không đọc được phim']
    out += ['', '## Những điều máy đo được và thấy lỗi']
    out += [f'- {b}' for b in r['bad']] or ['- không có lỗi nào máy đo được']
    return '\n'.join(out) + '\n'


def selftest():
    """một cái kiểm trả lời "được" cho mọi thứ thì không phải kiểm"""
    import contextlib
    import io
    import tempfile
    if not (shutil.which('ffmpeg') and shutil.which('ffprobe')):
        print('check_delivery --selftest: bỏ qua — máy này không có ffmpeg/ffprobe')
        return 0
    cases = []
    tmp = tempfile.mkdtemp(prefix='delivery-selftest-')

    def quiet(fn, *a):
        """the check prints its report; the selftest only wants the verdict"""
        with contextlib.redirect_stdout(io.StringIO()):
            return fn(*a)
    try:
        def make(name, seconds=4, tone=True, silent=False, runtime='0:04', nlines=2):
            ep = os.path.join(tmp, name)
            os.makedirs(os.path.join(ep, 'voice'), exist_ok=True)
            mp4 = os.path.join(ep, 'phim.mp4')
            cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i',
                   f'color=c=0x224466:s=320x180:r=25:d={seconds}']
            if tone:
                cmd += ['-f', 'lavfi', '-i',
                        f'sine=frequency={220 if not silent else 440}:duration={seconds}']
                if silent:
                    cmd += ['-filter:a', 'volume=0']
                cmd += ['-c:a', 'aac', '-shortest']
            cmd += [mp4]
            r = subprocess.run(cmd, capture_output=True, text=True)
            assert r.returncode == 0, r.stderr
            json.dump({'title': 't', 'movie': 'phim.mp4', 'runtime': runtime},
                      open(os.path.join(ep, 'film.json'), 'w'))
            json.dump([{'id': f'c{i+1}', 'text': f'câu {i+1}'} for i in range(nlines)],
                      open(os.path.join(ep, 'voice/lines.json'), 'w'))
            ev = [{'type': 'voice', 'id': f'c{i+1}', 't': 0.5 + i} for i in range(nlines)]
            ev.append({'type': 'cloth_rustle', 't': 1.0})
            json.dump({'dur': seconds, 'ev': ev}, open(os.path.join(ep, 'events.json'), 'w'))
            return ep

        good = make('good')
        cases.append(('phim đủ tiếng, đủ hình, manifest đúng thì đạt',
                      quiet(report, good) == 0, episode_facts(good)['bad'], ''))

        silent = make('silent', silent=True)
        cases.append(('phim có dải âm nhưng im lặng thì không đạt',
                      quiet(report, silent) == 1, episode_facts(silent)['bad'], ''))

        noaudio = os.path.join(tmp, 'noaudio')
        os.makedirs(os.path.join(noaudio, 'voice'), exist_ok=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'lavfi', '-i',
                        'color=c=0x224466:s=320x180:r=25:d=4', '-c:v', 'libx264',
                        os.path.join(noaudio, 'phim.mp4')], capture_output=True)
        json.dump({'runtime': '0:04'}, open(os.path.join(noaudio, 'film.json'), 'w'))
        json.dump([], open(os.path.join(noaudio, 'voice/lines.json'), 'w'))
        cases.append(('phim không có dải âm thì không đạt', quiet(report, noaudio) == 1,
                      episode_facts(noaudio)['bad'], ''))

        liar = make('liar', runtime='9:99')
        cases.append(('manifest nói sai độ dài thì không đạt', quiet(report, liar) == 1,
                      episode_facts(liar)['bad'], ''))

        empty = os.path.join(tmp, 'empty')
        os.makedirs(empty, exist_ok=True)
        cases.append(('tập chưa có phim thì không đạt', quiet(report, empty) == 1,
                      episode_facts(empty)['bad'], ''))

        # a line with no voice of its own
        novoice = make('novoice', nlines=3)
        json.dump({'dur': 4, 'ev': [{'type': 'voice', 'id': 'c1', 't': 0.5},
                                     {'type': 'cloth_rustle', 't': 1.0}]},
                  open(os.path.join(novoice, 'events.json'), 'w'))
        cases.append(('câu lời kể không có tiếng thì không đạt', quiet(report, novoice) == 1,
                      episode_facts(novoice)['bad'], ''))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    failed = 0
    for name, ok, got, extra in cases:
        print(f'{"ok  " if ok else "FAIL"} {name}' + (f'  [{str(got)[:200]}]' if not ok else ''))
        if not ok:
            failed += 1
    if failed:
        print(f'check_delivery --selftest: {failed}/{len(cases)} FAIL')
        return 1
    print(f'check_delivery --selftest: {len(cases)}/{len(cases)} ok')
    return 0


def main():
    ap = argparse.ArgumentParser(description='what the machine can say about a finished film')
    ap.add_argument('episode')
    ap.add_argument('--facts', action='store_true', help='print the facts as a report for the critic')
    ap.add_argument('--max-silence', type=float, default=DEFAULT_SILENCE)
    a = ap.parse_args()
    if not os.path.isdir(a.episode):
        print(f'check_delivery: {a.episode} is not a folder')
        return 2
    if a.facts:
        sys.stdout.write(facts_markdown(a.episode, a.max_silence))
        return 0
    return report(a.episode, a.max_silence)


if __name__ == '__main__':
    if '--selftest' in sys.argv[1:]:
        sys.exit(selftest())
    sys.exit(main())
