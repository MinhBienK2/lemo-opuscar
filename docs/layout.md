# The layout contract

How films, channels and episodes are laid out in this repository, and what every tool may assume
about them. This file is the contract the tools are built against; the glossary lives in
[`GLOSSARY.md`](../GLOSSARY.md).

## The tree

```
<repo root>/
├── channels/
│   └── <channel>/                 # a channel: a series of films that share an identity
│       ├── CHANNEL.md              # the channel map: identity, process, file map
│       ├── STYLE.md                # the channel's visual language
│       ├── DEMO.md                 # what the channel's first episode showed (the library's shape)
│       ├── cast/                   # the cast specs (optional; the 2D/3D character channel)
│       ├── rig/                    # the shared drawing implementation
│       ├── mix.py                  # the shared mix
│       ├── fonts/                  # the shared fonts
│       ├── voice/                  # the shared voice pipeline scripts
│       └── <episode>/              # an episode: one film of the channel
│           ├── TREATMENT.md
│           ├── CREDITS
│           ├── film.json           # the film's own facts (the manifest)
│           ├── research/FACTS.md
│           ├── index.html
│           ├── build.sh
│           ├── src/                # only what is this episode's own
│           ├── voice/              # lines.json and the generated speech of this episode
│           ├── events.json
│           ├── out/                # render output (never committed)
│           └── *.mp4, poster.jpg, *.transcript.srt
├── films/                          # the one-shot films: films that belong to no channel
│   └── <film>/                     # the same shape as an episode
├── FILMS.md                        # the index of every film, generated from the manifests
├── core/                           # the shared tools
└── tools/                          # the repository's checks
```

**Two roots, one rule.** `films/` holds the one-shots, `channels/<channel>/` holds the episodes.
Nothing else in the repository holds a film.

## What is what

| Folder | It is a | Because it holds |
|---|---|---|
| `films/<film>/` | a **one-shot** | `build.sh` (a folder that can build a film) |
| `channels/<channel>/` | a **channel** | `CHANNEL.md`, and no `build.sh` |
| `channels/<channel>/<episode>/` | an **episode** | `build.sh` |

The marker decides the kind; **the depth never does**. A tool that walks the tree classifies each
folder by what it holds, so a channel may hold its episodes at any depth, and a one-shot stays
where it is. A folder that holds `TREATMENT.md` but no `build.sh` yet is a film in preparation:
it is listed, and the checks that need a build say so.

An episode holds its own treatment, research, title, name and shots. It never holds a copy of the
channel's rig, mix, fonts or voice scripts: those live once, in the channel.

## The discovery module

**One module knows where the films are: `core/render/films.mjs`.** No other tool may glob
`films/*`, list `films/` or hardcode a film's path.

```js
// core/render/films.mjs
export const REPO_ROOT;
export const FILMS_ROOT;        // <root>/films
export const CHANNELS_ROOT;     // <root>/channels
export function isChannel(dir); // a directory that holds CHANNEL.md and no build.sh
export function isFilm(dir);    // a directory that holds build.sh (or TREATMENT.md, for a film in preparation)
export function listChannels(); // [{ dir, slug, name, episodes: [film…] }]
export function listFilms();    // [{ dir, name, kind: 'episode'|'oneshot', channel, episode, manifest }]
export function findFilm(name); // by directory name or by the name of its movie
```

Command line (what the shell tools call):

```sh
node core/render/films.mjs --films        # one film folder per line, absolute or repo-relative
node core/render/films.mjs --channels     # one channel folder per line
node core/render/films.mjs --json         # the same, as JSON
```

A Python tool calls the same command and parses the JSON. There is one implementation, in node,
because the render tools are node and the layout is a rendering concern.

**A tool that finds no film is a failure, not a pass.** A checker that was handed a folder without
`src/` must say it could not check and **exit non-zero** — the guardrail the last session wrote down
as "a gate that cannot fail the build is decoration".

## The manifest

Every film carries its own facts in `film.json`, at the film's root:

```json
{
  "title": "Trạm Nghĩ Nhiều — tập 1: Tại sao càng rảnh, ta càng thấy mệt?",
  "movie": "tram-nghi-nhieu-tap-01.mp4",
  "runtime": "1:51"
}
```

- `title` — what the index shows.
- `movie` — the file the build writes, in the film's own folder.
- `runtime` — `M:SS`, measured from the finished movie with `ffprobe`, never from the plan.

`FILMS.md` is **generated** from the manifests (`tools/gen_films_index.py`). It is never edited by
hand. Its table:

```
| Film | Folder | Runtime | Movie |
|---|---|---|---|
| <title> | `channels/tram-nghi-nhieu/tap-01/` | 1:51 | `channels/tram-nghi-nhieu/tap-01/tram-nghi-nhieu-tap-01.mp4` |
```

with a `## Channels` section under it: one row per channel, naming the channel's `CHANNEL.md`.

The checker (`tools/check_films_index.py`) compares every manifest with the file on disk and
`FILMS.md` with the manifests: the runtime with `ffprobe`, the movie with the file that is there,
and every film that exists with a row that names it.

## How an episode reaches the channel's shared code

Relative imports, because the renderer serves the repository root:

| From | To | As |
|---|---|---|
| `channels/<ch>/<ep>/src/film.js` | the channel's rig | `import { cel } from '../../rig/cel.js'` |
| `channels/<ch>/<ep>/src/film.js` | the library | `import { clamp } from '/core/lib.js'` |
| `channels/<ch>/<ep>/index.html` | the channel's fonts | `<link rel="stylesheet" href="../fonts/fonts.css">` |
| `channels/<ch>/<ep>/build.sh` | the library root | an upward search for `core/render/review.sh` |
| `channels/<ch>/<ep>/build.sh` | the channel's mix | `python "$CHANNEL/mix.py"` with `FILM=$HERE` |

The library root is found by walking up until a directory holds `core/render/review.sh`; it is
never counted in levels, so a channel may sit at any depth:

```sh
LIB=${LIB:-$(cd "$HERE" && while [ ! -f core/render/review.sh ] && [ "$PWD" != / ]; do cd ..; done && pwd)}
```

`mix.py` lives in the channel and reads the **film** folder from `$FILM` (the episode), never from
its own directory:

```python
HERE = os.path.dirname(os.path.abspath(__file__))          # the channel
FILM = os.environ.get('FILM') or os.path.join(HERE, '..')  # the episode
E = json.load(open(os.path.join(FILM, 'events.json')))
```

The voice scripts live in the channel's `voice/` and take the episode's paths as arguments:
`python "$CHANNEL/voice/tts_vi.py" voice/lines.json voice/` run from the episode folder.

## The scaffold

```sh
sh core/render/new_episode.sh <channel> <episode> [title]
```

creates `channels/<channel>/<episode>/` with:

- its own `TREATMENT.md`, `CREDITS`, `research/FACTS.md`, `film.json`, `index.html`, `build.sh`
  (`NAME` set to the episode's own movie name), `voice/lines.json` (a template with no lines) and
  an empty `src/`;
- the channel's shared code **attached, not copied**: the episode's `src/` imports the channel's
  `rig/` by relative path, and the episode's `build.sh` calls the channel's `mix.py` and the
  channel's `voice/` scripts.

The scaffold never copies a previous episode: an episode starts empty of identity, so a copied
treatment, research file or build name cannot happen.

## The cast

A channel whose characters must live in 2D and in 3D keeps one cast spec per character:

```
channels/<ch>/cast/<name>.json
```

```json
{
  "name": "Kẻ Nghĩ Nhiều",
  "palette": { "skin": "#F2C9A0", "hair": "#2B2B33", "hoodie": "#3B4A6B" },
  "proportions": { "head": 1.0, "body": 2.6, "limb": 1.0 },
  "hair": { "style": "bob", "length": 0.6 },
  "face": { "eyes": "round", "mouth": "small" }
}
```

**The seam.** `core/cast/` holds the cast module: it reads a spec and hands the caller a character
that can be posed. Two adapters sit at the seam, one per renderer:

| File | It is |
|---|---|
| `core/cast/cast.mjs` | the cast module: the spec, the poses, the interface |
| `core/cast/adapter-2d.mjs` | the 2D adapter: draws the character on a 2D canvas |
| `core/cast/adapter-3d.mjs` | the 3D adapter: builds the character in three.js |

Both adapters satisfy the same interface:

```js
export function createView(canvas);          // the target the character is drawn in
export function createCharacter(spec);        // → { draw(view, pose), setPose(pose) }
```

A second adapter is what makes the seam real; with one adapter the spec file would be a second
place to keep in sync, and the cast module would be thin.

## A channel is a style

A channel carries the library's shape — `CHANNEL.md`, `STYLE.md`, `DEMO.md` — so it can be named,
reused and kept like a style. A channel the user keeps as their own is listed in
`~/lemo-my-styles/README.md`, one row, with the **full path** of the channel folder, because the
channel lives in the repository and not in `~/lemo-my-styles/`. For that row to be honest the
channel folder carries the shape a style has: `STYLE.md`, `DEMO.md` and a `style.json` with
`slug`, `en`, `cn`, `based_on`, `created`, `line` and `line_cn`. Nothing is copied: the row points
at the folder, and the episodes of that channel are films made in the channel's own folder.

## The gate

```sh
sh core/render/review.sh <film-folder>     # the whole review loop for one film
```

It must work for a one-shot and for an episode, at any depth. The subtitle band is matched on the
film's path, so it must match `films/*` **and** `channels/*`.

## Rules for anyone building against this contract

- No tool globs `films/*` or `channels/*` itself; it asks `core/render/films.mjs`.
- No tool hardcodes a film's path; it discovers it or takes it as an argument.
- A check that could not check says so and exits non-zero.
- The shared implementation of a channel exists once. A copy is a finding.
- Files are edited with the file-editing tools, never with a shell heredoc (`CODING_STANDARDS.md` R1).
- Nothing in this repository is committed by an agent that did not write it (`CODING_STANDARDS.md` R3).
