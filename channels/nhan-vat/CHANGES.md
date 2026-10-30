# Changes

One row per decision: what the base gave, what this channel does, and why. The base is
[`cel-anime-80s`](../../../styles/cel-anime-80s) — the library's cel-animated style; it is the technique base
for the 2D half (the flat fills, the ink line, the read check). Everything below is the channel's own.

| Part | Base | Now | Why |
|---|---|---|---|
| The subject | a character drawn in one engine | **one character, drawn in 2D and in 3D from the same specification** | the channel is about characters, so the character has to be one thing, not two drawings |
| The character | a rig inside one film (`src/character.js`) | **a specification of six fields** (`cast/bich.json`), read by the library's cast module | a specification is what two renderers can agree on; a rig is what one renderer draws |
| Where the character lives | the film's own `src/` | **the channel's `cast/`**, read by every episode | an episode must not carry its own copy of the cast |
| The pose | a shot passed the rig its numbers | **a pose object, shared by both adapters** (`core/cast/cast.mjs`) | the two renderings only match if they are posed by the same numbers |
| The renderer | one engine (canvas 2D) | **an adapter per renderer**: `adapter-2d.mjs`, `adapter-3d.mjs` | the renderer is what varies; the character is not |
| The colours | the style's palette | **the character's own palette, in the specification** | the character's identity is the colours it wears |
| The sound | the style's sound palette | **none in the demo**; an episode brings the channel's own mix | a cast sheet must be comparable: no score, no voice, no subtitles |
| The camera | the style's camera grammar | **a fixed frame, no cut** | two halves of one sheet have to stand still to be compared |

The technique base stays the base: the cel look, the ink line and the checks the library runs on every film are
unchanged. What the channel adds is a **seam** — the cast — with one adapter per renderer, and a rule: the
shared code exists once, in the channel, and an episode reaches it by a relative path.

Nothing here is borrowed from another style; `style.json` records `"borrows": []`.
