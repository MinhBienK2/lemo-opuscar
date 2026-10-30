# Glossary

The domain words of this repository. An agent that names a concept here has a name for it; a concept that is not
here is either new (add it) or borrowed from elsewhere (do not rename it here).

## The library

**Style** — a look and a way of moving: its invariants (colour, type, motion, camera grammar, sound palette) live in
`styles/<slug>/STYLE.md`. A style is not a story; the story belongs to the film.

**Demo** — the one film that ships with a style, made entirely in code, so the style can be seen. It lives in
`styles/<slug>/demo/`.

**Film** — one finished movie, made entirely in code: no video generation, no stock footage. A film is a folder that
holds the code that draws every frame, the voice, the mix, the research behind its numbers, and the movie itself.

## The content tree

**Channel** — a series of films that share an identity: a name, a cast, a visual language, a way of working. The
channel owns what its episodes share; an episode owns only what is its own.

**Episode** — one film of a channel. It carries its own treatment, its own research file, its own title and its own
name; it never carries the channel's shared implementation.

**One-shot** — a film that belongs to no channel. Same shape as an episode, without the channel above it.

**Cast** — the characters of a channel: who they are, how they look, how they move and what they express. The cast is
what a 2D and a 3D film of the same channel must agree on.

**Rig** — the drawing code behind the cast: head, hair, body, expressions, gestures, and the pose rules that blend
them.

**Shared code** — the implementation a channel's episodes share: the rig, the mix, the fonts, the voice scripts. It
lives once, in the channel, and an episode reaches it by a relative path; a copy of it inside an episode is a defect.

## The work

**Treatment** — the film's own script and shot plan, written before the demo or the previous episode is opened.

**Beat** — one idea of an episode, the unit a long episode's shot list is written in.

**Shot** — one moment of screen time: what is drawn, what the camera does, how long it holds.

**Research file** — the film's `research/FACTS.md`: every number it may put on screen, with its source, and what it
may not say.

**The gate** — `sh core/render/review.sh <film-folder>`: the checks that must pass before a film is finished.

**The channel map** — a channel's `CHANNEL.md`: how its episodes are made, where its voice model lives, which file
holds which part of the pipeline.

**Manifest** — the film's own facts in `film.json`, at the film's root: its title, the movie it writes and its
runtime. Every film has one, one-shot or episode.

**The index** — `FILMS.md`: every film and every channel, generated from the manifests. It is never edited by hand.
