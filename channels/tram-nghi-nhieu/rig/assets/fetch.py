#!/usr/bin/env python3
"""Fetch pictures from Microsoft Fluent Emoji (Flat, MIT) into rig/assets/fluent/, for rig/assets.js.

  python3 channels/tram-nghi-nhieu/rig/assets/fetch.py search phone battery      # names that match, fetched or not
  python3 channels/tram-nghi-nhieu/rig/assets/fetch.py add "Mobile phone" "Police officer"
  python3 channels/tram-nghi-nhieu/rig/assets/fetch.py add --tone Medium "Farmer"     # people: Light | Medium-Light (default) | Medium | Medium-Dark | Dark | Default
  python3 channels/tram-nghi-nhieu/rig/assets/fetch.py list                         # what is already here

Each picture lands as fluent/<id>.svg (id = the name in lower case, spaces as '-'), and fluent/index.json gets
{ id, name, group, keywords }. The pictures are vendored (committed), so a render never needs the network.
The list of names is cached in ~/.cache/lemo/fluent-tree.json (one GitHub API call).
"""
import json, os, sys, urllib.parse, urllib.request

REPO = 'microsoft/fluentui-emoji'
RAW = f'https://raw.githubusercontent.com/{REPO}/main/'
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'fluent')
INDEX = os.path.join(OUT, 'index.json')
CACHE = os.path.expanduser('~/.cache/lemo/fluent-tree.json')


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'lemo-opuscar-fetch'}), timeout=30) as r:
        return r.read()


def tree():
    if not os.path.exists(CACHE):
        os.makedirs(os.path.dirname(CACHE), exist_ok=True)
        d = json.loads(get(f'https://api.github.com/repos/{REPO}/git/trees/main?recursive=1'))
        flat = [x['path'] for x in d['tree'] if '/Flat/' in x['path'] and x['path'].endswith('.svg')]
        json.dump(flat, open(CACHE, 'w'))
    return json.load(open(CACHE))


def names(paths):
    return sorted({p.split('/')[1] for p in paths})


def index():
    return json.load(open(INDEX)) if os.path.exists(INDEX) else []


def slug(name):
    return name.lower().replace(' ', '-')


def add(name, tone, paths):
    mine = [p for p in paths if p.split('/')[1] == name]
    if not mine:
        close = [n for n in names(paths) if name.lower() in n.lower()][:8]
        print(f'  ✗ {name}: not in Fluent Emoji' + (f' (did you mean: {", ".join(close)})' if close else ''))
        return None
    pick = next((p for p in mine if p.split('/')[2] == 'Flat'), None) \
        or next((p for p in mine if p.split('/')[2] == tone), None) \
        or next((p for p in mine if p.split('/')[2] == 'Default'), mine[0])
    svg = get(RAW + urllib.parse.quote(pick))
    meta = {}
    try:
        meta = json.loads(get(RAW + urllib.parse.quote(f'assets/{name}/metadata.json')))
    except Exception:
        pass
    os.makedirs(OUT, exist_ok=True)
    open(os.path.join(OUT, slug(name) + '.svg'), 'wb').write(svg)
    print(f'  ✓ {slug(name)}  ← {pick}')
    return {'id': slug(name), 'name': name, 'group': meta.get('group', ''), 'keywords': meta.get('keywords', [])}


def main(a):
    if not a or a[0] in ('-h', '--help'):
        print(__doc__); return
    cmd, rest = a[0], a[1:]
    if cmd == 'list':
        for e in index(): print(f"{e['id']:32} {e['group']:20} {', '.join(e['keywords'][:6])}")
        print(f'{len(index())} pictures'); return
    paths = tree()
    if cmd == 'search':
        have = {e['id'] for e in index()}
        for n in names(paths):
            if all(w.lower() in n.lower() for w in rest): print(('✓ ' if slug(n) in have else '  ') + n)
        return
    if cmd == 'add':
        tone = 'Medium-Light'
        if rest[:1] == ['--tone']: tone, rest = rest[1], rest[2:]
        idx = {e['id']: e for e in index()}
        for n in rest:
            e = add(n, tone, paths)
            if e: idx[e['id']] = e
        json.dump(sorted(idx.values(), key=lambda e: e['id']), open(INDEX, 'w'), ensure_ascii=False, indent=1)
        return
    sys.exit(f'unknown command {cmd!r}: use search | add | list')


if __name__ == '__main__':
    main(sys.argv[1:])
