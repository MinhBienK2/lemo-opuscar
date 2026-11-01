---
name: directing-2d-explainer
description: Direct and produce showreel-grade 2D animated explainer films rendered entirely from code on HTML5 Canvas. Enforces character-driven storytelling, room sets, steady camera, conversational scripts, tactile props, multi-layered foley sound design, and automated gate verification. Use whenever creating 2D animated explainers, psychology shorts, narrative educational videos, or character-based Canvas animations.
version: 1.0.0
---

# Directing 2D Explainer Films

A complete, production-grade directing method for producing character-driven 2D animated explainer films on HTML5 Canvas. Synthesizes principles from world-class motion design showreels (`motion-graphics`), educational storyboarding (`explainer-video`, `storyboard`), and vector Canvas animation (`canvas-video`).

The bar for every film: **A human story in a believable world, not a PowerPoint slide deck.**

---

## 1. Core Directing Principles (Non-Negotiable)

1. **One Core Idea, One Guiding Metaphor (*Leitmetapher*)**:
   - Compress the entire film into one relatable human promise a viewer can repeat.
   - Choose a single physical analogy from the viewer's everyday world (a bedroom at 1am, an unpicked phone call, an overfilled tea cup). Ride this metaphor across all scenes — never switch analogies mid-film.
2. **Character & Context Staging (Real World Anchor)**:
   - Every shot MUST be staged in a believable human environment: a wooden desk with a warm lamp (`desk()`, `S.roomBack`, `S.roomFront`), a quiet night sofa (`S.sofa`), or an early morning street.
   - **STRICTLY FORBIDDEN**: Floating text boxes on abstract dark voids. That is a presentation slide, not an animated film.
3. **Steady Camera & Scene-Block Grammar (Anti-Cut Churn)**:
   - **One Scene Block = One Complete Concept (20–50s, 4–10 lines)**: STRICTLY FORBIDDEN to whip-pan or cut on every single spoken line. When sentences continue in the same room or topic, the camera holds steady.
   - **Motion comes from In-Scene Evolution**: Character pose shifts `ak()`, facial expressions `ek()`, blinking `blink()`, props sliding/revealing in-place (`alpha`, `slide`, `reveal`), not camera jitter.
   - **Rich Transition Toolkit**:
     - *Direct Cut*: Change angle (Wide → Close-up, Top-down desk view) on the musical beat or realization. Clean, crisp, no motion blur.
     - *Iris Wipe*: Classic circle mask in/out for intros, endings, or memory dives.
     - *Prop Wipe*: Person walking past, door swinging shut, page turning over camera.
     - *Light Switch Cut*: Lamp clicks off into darkness → Spotlight snaps onto stage.
     - *Whip Pan*: ONLY for major jumps in physical location or time periods (day office → night bedroom; present → 1978). Max 4–6 whip pans per 10-minute film!
4. **Conversational Spoken Script (Spine-First)**:
   - The voiceover is the spine; visuals illustrate the line being spoken in real-time.
   - **STRICTLY FORBIDDEN**: Numbered outline bullets (*"Một —", "Hai —", "1.", "2."*).
   - Write in warm, empathetic, spoken Vietnamese (as an intimate late-night conversation between two friends). Time lines at **~2.3 words/second** (140 wpm) with natural **0.4–0.6s breath pauses** between sentences.
5. **Sound is Half the Film (Loudness & Foley on the Beat Grid)**:
   - Every visible physical action has a tactile sound: paper slide (`paper`), item pop (`pop`), marker highlight (`marker`), clock ting (`ting`), spring boing (`boing`), whip whoosh (`whoosh`).
   - Every shot registers its events in `window.EV`. Empty `window.EV` fails `filmcheck`.
   - Mastered to **-14.0 LUFS** with automatic ducking: music drops **-8 dB to -10 dB** during voice narration and swells back during pauses.
6. **Visual Physicalization (Never Animate PowerPoint Cards)**:
   - **STRICTLY FORBIDDEN**: Drawing text boxes or speech bubbles that simply restate voiceover words ("THƯỚC ĐO TỰ TĂNG", "MAY MẮN", "20 LẦN TỐT"). That is a slide deck, not an animated film.
   - **MANDATORY**: Convert abstract psychological concepts into **tangible physical props, mechanical contraptions, or tactile actions**:
     - *Moving goalpost* → High-jump crossbar that an overhead robotic arm cranks higher just as the character leaps over.
     - *Discounting success* → A gleaming gold trophy that the character frantically covers with a cloth or kicks into the wastebasket.
     - *Spotlight effect & memory bias* → 20 dusty framed certificates vs a single scorched note scorched under an intense spotlight.
     - *Impostor cycle* → Character sprinting on a runaway treadmill while clutching a cracking paper mask.
     - *Evidence ledger* → Thick leather notebook on desk, character's hand writing with wet ink, Rối stamping a bold red wax seal.
---

## 2. The 6-Step Production Workflow

```
Workflow:
- [ ] Step 1: Research & Angle (Verified Facts + One Core Promise)
- [ ] Step 2: Spoken Script (lines.json, ~2.3 words/sec, no numbers)
- [ ] Step 3: Four Key Stills (Hook → Staging → Reveal → End Lockup)
- [ ] Step 4: Voice Synthesis & Timing (TTS + 48kHz process.py + lipsync)
- [ ] Step 5: Canvas Animation Code (film.js + timeline.js + sets)
- [ ] Step 6: Render & Gate Verification (Chromium frames + VPS muse mux)
```

### Step 1: Research & Angle
- Identify the human pain point. Gather high-trust primary research (DOI/paper) and define boundaries in `research/FACTS.md`.
- Formulate the core human angle: e.g. instead of generic "sleep deprivation", focus on "the urge to reclaim lost daytime autonomy".

### Step 2: Conversational Script (`voice/lines.json`)
Structure the 30–90s arc:
- **Hook (~15%)**: Name the pain in immediate, vivid sensory words.
- **Stakes (~20%)**: Show what it costs the viewer.
- **Insight / Mechanism (~40%)**: The psychological or scientific revelation, explained simply with Rối.
- **Payoff / Action (~25%)**: One tangible, doable action the viewer can do today.
- Use `vi-VN-NamMinhNeural` (`rate: "+4%"` to `"+5%"`, `pitch: "-6Hz"` to `"-8Hz"`).

### Step 3: Four Key Stills First (Inspect before encoding)
Render 4 critical still frames to inspect aesthetic composition:
1. *The Hook Frame*: Character in their authentic night/day environment.
2. *The Problem/Staging Frame*: The conflict or tactile prop.
3. *The Insight/Reveal Frame*: Rối companion with an expressive speech bubble.
4. *The End Lockup*: Peaceful resolution card with handwritten sign-off.
If any frame looks like a PowerPoint slide, redesign the staging BEFORE coding full motion.

### Step 4: Voice Synthesis & Precise Timing
Run the channel's audio pipeline:
```bash
$LIB/.venv/bin/python "$CHANNEL/voice/tts_vi.py" voice/lines.json voice/
$LIB/.venv/bin/python "$CHANNEL/voice/process.py" voice/
```
*Note: Ensure `process.py` calculates duration via `len(y) / SR` (48000), not `sr`.*

### Step 5: Canvas 2D Animation (`src/film.js` & `src/timeline.js`)
- Derive timeline timestamps strictly from `voice/proc/dur.json` and `voice/words.json`.
- Structure scenes using the `shots()` array:
  ```js
  { n: 'scene_id', t: at('line_id', 0.35), tr: 'whip', f(g, lt, T) { ... }, ev() { return [[...]]; } }
  ```
- Use room sets (`S.roomBack`, `S.roomFront`, `S.sofa`) and character rigs (`kng()`, `ak()`, `ek()`, `blink()`).
- Populate `window.EV` with all voice IDs, music cues (`cue: 'A', 'B', 'C', 'end'`), and foley SFX.

### Step 6: Render & Mechanical Verification
1. Run mechanical gate:
   ```bash
   node core/render/filmcheck.mjs <episode_folder>
   node core/render/drawcheck.mjs <episode_folder>
   ```
2. Render frames & offload heavy encoding to VPS `muse`:
   ```bash
   LEMO_REMOTE_FFMPEG=muse REVIEW=0 sh build.sh
   ```
3. Inspect the finished `.mp4`: confirm natural conversational pacing, clear voiceover, and authentic visual staging.

---

## 3. Anti-Generic Checklist (Run before delivery)

- [ ] Is the camera steady inside every shot (no aimless zooming/drifting)?
- [ ] Is Kẻ Nghĩ Nhiều anchored in a tangible room/sofa/desk set?
- [ ] Are all robotic bullet points and section numbers removed from the script?
- [ ] Does every shot return foley sound events in its `ev()` function?
- [ ] Is `window.EV` populated with all voice lines and music cues?
- [ ] Is the voiceover clearly audible at -14 LUFS with automatic music ducking?
- [ ] Does the ending offer one concrete, comforting action?
