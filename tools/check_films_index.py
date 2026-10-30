"""Check the films' manifests and the generated index: python3 tools/check_films_index.py

The index of the library is generated from the films' own manifests (film.json), and this check says whether that
index tells the truth. For every film the discovery module lists (core/render/films.mjs — the one module that knows
where the films are):

  - a film whose movie is not built yet is **in preparation**: it says nothing yet, so it has no row in FILMS.md and
    the check says so and does not fail. A new episode is in preparation until its movie is rendered;
  - a film whose movie is there must have a manifest, the manifest must name that movie, and the runtime it claims
    must be the one ffprobe measures on that movie (within 1.5 s);
  - a film whose movie is there must have a row in FILMS.md, and every row must name a film whose movie is there.

A film whose manifest names a movie that is not the one that is there is a failure: the index would point at nothing.

Exit code: 0 everything is true; 1 something is wrong; 2 usage.
"""
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_films_index import INDEX, ROOT, UNKNOWN, discovery, film_state, movies_in   # noqa: E402  (the index tools share the discovery)

ROW = re.compile(r'^\|\s*(?P<title>.*?)\s*\|\s*`(?P<folder>[^`]+)`\s*\|\s*(?P<runtime>[^|]*?)\s*\|\s*(?P<movie>`[^`]*`|—)\s*\|\s*$')
CHANNELS_HEADING = re.compile(r'^##\s+Channels\b', re.M)


def duration(path):
    """the length of a movie in seconds, or None when it cannot be read"""
    try:
        out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                              '-of', 'csv=p=0', path], capture_output=True, text=True, timeout=60)
        return float(out.stdout.strip())
    except Exception:
        return None


def parse(runtime):
    """the seconds of an M:SS runtime, or None when the runtime is not one"""
    parts = runtime.split(':')
    try:
        parts = [int(p) for p in parts]
    except ValueError:
        return None
    sec = 0
    for p in parts:
        sec = sec * 60 + p
    return sec


def mmss(seconds):
    """the runtime as M:SS"""
    return '{}:{:02d}'.format(int(seconds // 60), int(seconds % 60))


def rows():
    """the film rows of FILMS.md: the table above the channels section"""
    if not os.path.isfile(INDEX):
        return None
    text = open(INDEX, encoding='utf8').read()
    head = CHANNELS_HEADING.split(text)[0]
    out = []
    for line in head.splitlines():
        m = ROW.match(line.strip())
        if m:
            out.append(m.groupdict())
    return out


def main():
    lib = discovery()
    films = lib['films']
    if not films:
        print('check_films_index: FAIL no film was found: the discovery module found nothing, so nothing was checked')
        return 1

    bad = 0
    built = {}          # the films that have a movie: they are the ones the index must name
    for film in films:
        rel = film['rel']
        status, name, path = film_state(film)
        if status == 'preparing':
            print(f'  in preparation: {rel} (no movie yet)')
            continue
        if status == 'unwritten':
            print(f'  FAIL {rel}: the film has a movie ({name}) but no manifest (film.json): it cannot be indexed')
            bad += 1
            continue
        if status == 'wrong':
            there = movies_in(os.path.join(ROOT, rel))
            print(f'  FAIL {rel}: the manifest names {name}, and the movie that is there is {there[0]}')
            bad += 1
            continue
        built[rel + '/'] = film
        manifest = film['manifest'] or {}
        title = (manifest.get('title') or '').strip()
        runtime = (manifest.get('runtime') or '').strip()
        if not title:
            print(f'  FAIL {rel}: the manifest names no title')
            bad += 1
        secs = duration(path)
        if secs is None:
            print(f'  FAIL {rel}: ffprobe cannot read {name}: the runtime could not be checked')
            bad += 1
            continue
        if not runtime:
            print(f'  FAIL {rel}: {name} is there, but the manifest claims no runtime')
            bad += 1
            continue
        claimed = parse(runtime)
        if claimed is None:
            print(f'  FAIL {rel}: the runtime {runtime} is not M:SS')
            bad += 1
        elif abs(secs - claimed) > 1.5:
            print(f'  FAIL {rel}: the manifest says {runtime}, but {name} is {mmss(secs)}')
            bad += 1
        else:
            print(f'  ok: {rel} — {runtime}')

    table = rows()
    if table is None:
        print(f'check_films_index: FAIL no {os.path.basename(INDEX)}: the index of the films does not exist')
        return 1

    index_name = os.path.basename(INDEX)
    listed = {}
    for row in table:
        folder = row['folder']
        if folder not in built:
            if folder in {f['rel'] + '/' for f in films}:
                print(f'  FAIL {index_name} names {folder}, and that film has no movie: the row is stale')
            else:
                print(f'  FAIL {index_name} names {folder}, and no such film exists')
            bad += 1
            continue
        listed[folder] = row

    for folder, film in built.items():
        row = listed.get(folder)
        if row is None:
            print(f'  FAIL {index_name} has no row for {folder}')
            bad += 1
            continue
        manifest = film['manifest'] or {}
        title = (manifest.get('title') or '').strip()
        movie = (manifest.get('movie') or '').strip()
        runtime = (manifest.get('runtime') or '').strip()
        said_title = row['title']
        said_runtime = row['runtime']
        named = row['movie'].strip('`')
        wanted = (film['rel'] + '/' + movie) if movie else UNKNOWN
        if said_title != (title or UNKNOWN):
            print(f'  FAIL {index_name} says "{said_title}" for {folder}, the manifest says "{title}"')
            bad += 1
        if said_runtime != (runtime or UNKNOWN):
            print(f'  FAIL {index_name} says the runtime "{said_runtime}" for {folder}, the manifest says "{runtime}"')
            bad += 1
        if named != wanted:
            print(f'  FAIL {index_name} names the movie "{named}" for {folder}, the manifest says "{wanted}"')
            bad += 1

    if bad:
        print(f'check_films_index: FAILED ({bad} problem{"s" if bad > 1 else ""})')
        return 1
    print(f'check_films_index: every film that is built has a manifest and a row, and {index_name} tells the truth')
    return 0


if __name__ == '__main__':
    sys.exit(main())
