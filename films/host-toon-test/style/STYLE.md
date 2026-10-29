# Talking-Head Host Toon · 解说主持人卡通 · Người dẫn chuyện hoạt hình — Style Prompt

Made from a blank page; techniques from 80s Cel Anime (cel-anime-80s) in Lemo-Opuscar.

> A documentary / explainer channel with its own animated host: a cute, bespectacled young scholar drawn in clean modern cel. She talks to camera in her study, pops into the corner of the b-roll, and when a moment needs it she **steps into the story herself**, full body and in costume. All of it, b-roll included, is drawn in the same line language.
> References (grammar only): faceless explainer channels with a mascot host; short 3D story shorts that drop a figure into the event (the "you are there" insert), translated here to 2D; modern TV anime character design (big eyes, coloured lines, hard cel shadows). Never copy a channel's mascot, a show's characters, logos, masks or footage.

## 1. Essence, and what it is not

One host, four framings, one line language:
- **A · Host desk**: waist-up talking head in the study (bookshelf, arched window, desk with mug and books). She explains, reacts and points at an **insert card** floating beside her.
- **B · Pop-in**: over b-roll, she bursts into a corner circle (yellow ring) for one or two sentences, then pops out. The b-roll keeps playing.
- **C · In the scene**: full body inside the story's place, in the story's costume (the topic decides it: a red jumpsuit for a heist, a trench coat for an investigation). She acts the event out: walks, sneaks, carries, points at things in the set.
- **D · Reaction close-up**: hard punch-in to an extreme close-up of her face with focus lines, for the joke or the shock.

B-roll (cards, maps, diagrams, timelines, set pieces) is drawn with the same cel rules as the host.
The host appears **only when something needs explaining**: at least half the running time is b-roll or C.

It is **not**: a 3D render, a motion comic of still panels, a VTuber pasted over stock footage, chibi or super-deformed, retro-filtered (no CRT, tape or film grain beyond the paper grain).

## 2. Materials & rendering

- **Cel**: flat fill + one **hard-edged shadow** shape (offset crescent) + an occasional hard highlight. Lines are **coloured** (the fill darkened toward plum), never pure black, and stay a **constant ~3 px on screen** whatever the scale (`linePx`).
- **Line hierarchy**: a thick outline around each silhouette (stroke the union at 2× and fill over it), thin lines inside (finger folds, collar, pleats). Overlapping capsules never show their inner circles.
- **Host construction**:
  - 2.5D head: every face feature sits on a sphere and is projected with yaw and pitch, so turns are continuous from −0.8 to +0.8.
  - Big amber eyes with two highlights, round gold glasses, and an *ahoge* (antenna strand).
  - Dark-chocolate bob with a side-swept fringe, and a yellow pencil hair-pin.
  - Expressions are number tables that blend.
  - Hands are finger tables in two views (palm, thumb-side profile) and hold props in the hand frame.
  - Arms and legs are 2-bone IK on hand and foot targets.
- **Costumes** swap colour sets and parts:
  - `scholar` (default): teal cardigan, cream Peter Pan collar, yellow bow, charcoal pleated skirt, dark tights, loafers.
  - `heist`: plain red jumpsuit with stand collar, zip and belt. No mask, no logo.
  - `field`: tan trench.
  - Add more per topic, always plain and generic.
- **Paper ground**: a warm cream with a faint grain, made once. Objects never get gradients. Only light shafts and window light are translucent flat shapes.
- **Insert cards**: off-white paper with a cel shadow, tape or a red pin, slightly rotated; title in the story colour, handwriting for labels, a bold number.

## 3. Colour logic

| Role | Colour |
|---|---|
| Ground / study wall | cream `#f4ede2` / `#e9dcc8` |
| Ink (text, darkest line) | `#2a1f2a` |
| Host signature | teal `#2f8088` (cardigan) |
| **Accent** | highlighter yellow `#ffd23f`: bow, pencil, pop-in ring, marker swipe |
| Story colour | one per film, from the topic (heist red `#d8332f` in the demo): stamps, chapter tags, costume |

- **One yellow highlight per shot**: the word or number that matters. Yellow is never a background.
- Shadows lean cool-plum. Skin shadow is a warm rose (`#f2b4a2`); the skin line is a red-brown (`#9a5248`).
- Each place in C mode gets its own ground (a cool teal-grey hall, a night street…). The host keeps her colours, and the story colour links the two.

## 4. Type & subtitles

- **Be Vietnam Pro** (OFL; full Vietnamese, Latin and Latin-Extended): 900 for titles and chapter tags, 800 for numbers, 700 for subtitles. **Patrick Hand** (OFL) for handwritten labels on cards.
- Never a monospace font or one without Vietnamese diacritics: stacked tones (ầ, ữ, ộ) must render.
- **Subtitles**: bottom centre, 44 px, cream fill with a 9 px ink outline, at most 2 lines of 1400 px. Each stays up for at least 1.8 s and for the spoken line + 0.6 s.
- **Chapter tag**: story-colour slanted label at top left, white 900 caps ("NGÀY 3 · XƯỞNG IN").
- Keep faces out of the subtitle band (bottom ~170 px).

## 5. Motion quality

- **Rig on ones (24 fps)**: smooth head turns, arm arcs and walk. **Mouths snap at 12 fps**, driven by the voice (RMS → open, spectral centroid → wide/round).
- **Idle life**: breathing, blinks every 2–5 s (double blink sometimes), the ahoge springs after head moves, and small head tilts on stressed words.
- **Gestures**: anticipation → overshoot → settle (back-ease). Hands blend between finger tables, never pop. One gesture per sentence at most.
- **Pops**: cards, stamps and the pop-in circle arrive with a short back-ease (≤ 1.1 overshoot) and leave fast (ease-in, 6–8 frames).
- **Expressions change on the word**, a few frames ahead of the voice, and blend over 3–5 frames. A reaction close-up cuts, no blend.
- **The ahoge is an emotion meter**: up for excitement, a droop for sadness, a twitch for "aha".

## 6. Camera grammar

A vocabulary, not a route. Opening and ending come from the topic.

| Move | What it expresses | Can serve |
|---|---|---|
| Slow push-in on the host desk (2–4 %) | "listen to this" | the thesis; a rule; a number |
| Lateral pan / parallax from the host to the insert card | linking speaker and evidence | plan vs reality; a definition |
| Hard cut to reaction close-up (D) + focus lines | the punchline lands on her face | absurd facts; a twist; a loss |
| Whip pan (directional blur) between places | time or place jumps | chapter changes; "meanwhile" |
| Dolly across a case board / timeline | following a sequence | the days of an event; a plan in steps |
| Wide C shot with the host small in the set | scale of the place | a vault; a factory; a city |
| Push toward an object in C, the host's hand in frame | the detail that matters | a tunnel; a key; a document |
| Pop-in (B) over a held b-roll shot | an aside without leaving the evidence | footnotes; "fun fact"; a correction |
| Iris / paper-flip wipe into C (the costume swap) | stepping into the story | the first time we enter an event |
| Static hold, no music | gravity | a death; the quiet before the reveal |

Rule: the host never talks over a b-roll shot she isn't in for more than ~8 s; cut back to A, or pop in (B).

## 7. Sound palette

- **Voice first**: one narrator voice for the host (a light, young timbre; edge-tts `vi-VN-HoaiMyNeural` for Vietnamese), close and dry, with a little presence. Music ducks ~−8 dB under it. Master −14 LUFS.
- **Score**: a light, curious synthesized bed: plucked pizzicato / marimba, a soft kick, brushed snare, a bass, a celesta for "aha". For a tense topic, a low pulse with ticking. Chapters change the instrument set, not the tempo.
- **Foley (synthesized)**: pop (pop-in, cards), paper slide, tape rip, stamp thump, marker squeak (highlighter), whoosh (whip pans), a bright "ting" for the glasses glint, a "boing" for the ahoge, room tone in the study.
- **Silence**: cut the music (tails included) before a reveal, and for one beat after a heavy fact.

## 8. Native moves

A menu: use the ones your story needs; the first two are the signature.

- **Glasses glint.** On an "aha" or smug beat both lenses flash white, with a star ping and a "ting". *Fits content like:* the clever trick revealed; the loophole; the twist.
- **Highlighter swipe.** A yellow marker stroke sweeps behind the key word or number, in sync with the word in the voice. *Fits content like:* the real figure; the name to remember; the rule.
- **Pop-in host.** She bursts into a corner circle over b-roll for an aside, then pops out. *Fits content like:* a footnote; "wait, that's not true"; a translation of jargon.
- **Costume step-in.** A wipe drops her into the event in the story's costume, full body, acting it out. *Fits content like:* being inside a heist; standing on a battlefield; working in a 1900s factory.
- **Reaction close-up.** A hard punch-in to her face with focus lines and an FX symbol (sweat, vein, gloom, sparkles). *Fits content like:* an absurd number; a betrayal; a terrible plan.
- **Plan vs reality card.** A crossed-out plan line above the real result, highlighted, with a stamp. *Fits content like:* budgets; forecasts; promises.

## 9. Pitfalls of the medium

- Hands are the hardest part.
  - Hanging hands are seen from the thumb side, with the fingers curling toward the palm (the thumb's side).
  - A palm-out hand only for "stop", "open" or counting.
  - Check every new gesture at film scale.
- Inner capsule circles (finger joints) look like warts: stroke the union, fill on top, then thin lines only at the outer edge.
- At yaw ±0.8, hide the far brow and fill the back of the head with hair. Never let a feature float outside the face silhouette (the far lens may, a little).
- A mouth that flaps on every frame looks robotic: drive it from the voice at 12 fps with a short hold, and close it in pauses.
- Text over a busy set needs its own card or an outline; never put a subtitle over a face.
- A heist, crime or historical topic invites copying the real show or event imagery. Use generic stand-ins: no actors' likenesses, masks, logos, real banknote designs or footage.
- Vietnamese TTS mispronounces foreign names and numbers: respell names ("Ber-lin", "Tô-ky-ô") and write numbers as words when they sound wrong; check with ASR.
- Too much host is a podcast: if a sentence can be shown, show it in b-roll or C.

## 10. Engine

In `demo/src/`:
- `cel.js`: paths, cel fill/shadow/line, tapered strokes, ribbons, limbs, IK, colour tools. Adapted from cel-anime-80s.
- `host.js`: palette, costumes, expression tables, 2.5D head, eyes, glasses, mouth, FX, and `figure()` with arms, torso and legs.
- `hands.js`: finger tables, palm and profile views, and props.
- `broll.js`: paper ground, study set, cards, highlighter, stamp, pop-in, focus lines, subtitles.
- `sheets.js`: model sheets (turnaround, expressions, hands, poses, in-scene).
- `cast.js`: other people, drawn simpler than the host (generic crew figures, person icons, a silhouette).
- `sets.js`: places and props (one film's sets; a pattern for building new ones).
- `timeline.js`: every time from the real voice (line gaps, subtitle chunks, mouth drive).
- `film.js`: shots, camera, whip and iris transitions, the four host framings.
- `../mix.py`: score, foley and mix; `../voice/process.py`: mouth drive from the voice.

How the demo film used them: [`DEMO.md`](DEMO.md).

Techniques also come from `$LIB/styles/cel-anime-80s/demo/` (cel engine) and `$LIB/styles/scifi-toon/demo/voice.py` (audio-driven mouths).

## 11. Variation space

You decide the topic, structure, chapters, places, costumes, story colour, b-roll, opening, ending, camera path and pacing. Only the host's look and the line language stay.

- Structures:
  - **the case file**: chapters as cards pinned to a board, with C inserts for the key moments;
  - **countdown**: a ranked list where each item gets one C scene;
  - **myth vs fact**: the host's reaction close-ups carry the corrections;
  - **day by day**: a timeline dolly with the host stepping into each day.
- Openings:
  - the shocking number on a card, before the host appears;
  - cold open in C, already inside the event;
  - the host mid-reaction, then "let me explain".
- Endings:
  - back at the desk, a quiet closing thought;
  - the final card stamped;
  - a callback to the first line;
  - a question to the viewer.
