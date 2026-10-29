# Talking-Head Host Toon — demo

One example among many. Don't reuse its story, arc, shots, props or timings.

Demo: *Phi vụ triệu đô trong 2 phút* (Money Heist, Parts 1–2, summarised in 2:12, Vietnamese) · `test.mp4` · source in [`demo/`](demo/)

## Story & structure

A plot summary told as **plan vs reality**: the Professor's plan is a card on Nhi's desk; each promise on it (four rules, €2.4 bn, 11 days) is later checked against what happened and stamped. Setup = the plan, turn = people break the rules (love, then blood), ending = the real numbers (€984 m after 128 h) stamped on the same card, then a one-line tease.

Arc: cold-open hook (they print their own money) → title → the Professor, the farm, eight city names, four rules → the break-in → three tricks (red jumpsuits, non-stop presses, the decoy tunnel) → a 1.9 s silence and "but" → rules broken one by one → escape and haul → "less than half" → Palawan → tease.

## Shots (25)

cold · hook2 (whip) · title · prof (whip) · map · lineup · rules · enter (iris) · goal · trick · police · print · xsec (whip) · but · love1 · love2 · react · blood · dead · escape · haul (whip) · half · palawan · next.

The host's four framings all appear: **desk** (title, rules, but, half), **pop-in** picture-in-picture over b-roll (map, print, goal), **in the scene** in the heist costume (trick, xsec, escape), **reaction close-up** (react after love2).

## Palette & type

Cream paper `#fbf6ea` with grain, ink `#2a1f2a`, host teal, highlighter `#ffd23f`, story colour heist red `#d8332f` (stamps, chapter tags, jumpsuits). Be Vietnam Pro for titles and subtitles, Patrick Hand for card labels.

## Sound

- Voice: edge-tts `vi-VN-HoaiMyNeural` (+6 % rate, +8 Hz), one line per beat (`voice/lines.json`). Mouths at 12 fps from the voice (`voice/process.py` → `lips.json`).
- Score (`mix.py`): synthesized, 104 BPM, D minor; marimba, celesta, Karplus-Strong bass, brushed kit, drone; sections A–G follow the chapters, a stinger on each stamp, a held chord on the end card. Ducks −8 dB under the voice.
- Foley from `events.json` (pop, paper, stamp, marker, whoosh, ting, printing press, sirens), ambiences per set.

## Build

`sh demo/build.sh` (needs the library at `LIB`, Node and the library's `.venv`). Steps: events → mix → render frames → subtitles → mux (−14 LUFS) → poster. The voice is in `demo/voice/`; `tts_vi.py` and `asr_vi.py` remake and check it.

## Which file draws what

| File | Draws |
|---|---|
| `src/host.js` | Nhi: head, eyes, glasses, mouth, expressions, costumes, `figure()` |
| `src/hands.js` | hands and props |
| `src/broll.js` | paper, cards, highlighter, stamps, pop-in frame, subtitles, study set |
| `src/cast.js` | the crew, hostage icons, the Professor silhouette |
| `src/sets.js` | money, the Mint, print hall, tunnel cross-section, café, beach, plan cards |
| `src/timeline.js` | line order, gaps, subtitle chunks, mouth drive |
| `src/film.js` | the 25 shots, camera, transitions, page contract |
| `mix.py` | score, foley, ambiences, mix |
