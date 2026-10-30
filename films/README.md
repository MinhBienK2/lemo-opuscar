# Films

The films of this library. Each film is a folder that holds the whole project: the code that draws every frame, the
stills, the credits and the finished movie. Render outputs and generated speech stay local (`films/.gitignore`) —
`build.sh` in each film rebuilds them.

**The index of every film is [`FILMS.md`](../FILMS.md)**: a table of the films, their folders, their runtimes and the
file to watch, plus the list of the channels. It is **generated** from the films' own manifests (`film.json`) by
`python3 tools/gen_films_index.py`, and it is never edited by hand.

## Where the films are

| | |
|---|---|
| The one-shots — the films that belong to no channel | `films/<film>/` |
| The episodes — the films of a channel | `channels/<channel>/<episode>/` |
| The index of every film | [`FILMS.md`](../FILMS.md) — generated, never edited by hand |
| The facts of one film | `film.json` in the film's own folder |

The layout is the contract in [`docs/layout.md`](../docs/layout.md). The module that knows it is
`core/render/films.mjs`: it is the only place that lists the films, and every tool asks it.

```sh
node core/render/films.mjs --films        # every film folder, one per line
node core/render/films.mjs --channels     # every channel folder, one per line
```

**The captions are burned into the picture.** Next to each film there is a `*.transcript.srt`: that is the transcript for
the platform's caption track, not a second set of subtitles. It is deliberately *not* named like the film, so that a
player (VLC auto-loads the subtitle file with the same name) does not draw it on top of the captions that are already in
the picture — which looks like a doubled transcript.

`films/host-toon-test/style/` is a style of its own — "Talking-Head Host Toon", cut from
`styles/cel-anime-80s` — with its demo film in `host-toon-test/style/test.mp4`.

## Rebuilding a film

From the repository root, with the repo's `.venv` and `node_modules` in place, in the film's own folder:

```sh
sh <film-folder>/build.sh          # rebuild one film
sh core/render/review.sh <film-folder>   # the review gate of one film: it must exit 0
```

The voice is generated speech and is not committed; the scripts that make it sit next to it in
each film's `voice/` folder.

## The masters

The 10-minute film is committed in a web-sized cut (83 MB, CRF 25). Its full-quality master
(172 MB, CRF 19) is attached to the repository's release
[films-v1](https://github.com/MinhBienK2/lemo-opuscar-films/releases/tag/films-v1); the other films
are committed at full quality.
