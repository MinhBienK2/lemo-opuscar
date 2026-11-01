# Improvements: what the last session taught us

This folder is the library's memory of its own mistakes. Every retro session writes one record in `retro/`, and every finding in it must end in one of exactly two places:

- a **guard** — a check, a CI job, a hook or a doc rule that now catches the mistake before it ships, named by its path;
- the words **"no guard possible — recorded only"**, for the findings that need a human eye. A finding with neither is a finding that will happen again.

**Add a record.** One file per retro session, named `improvements/retro/YYYY-MM-DD-<slug>.md`: the date is the day of the retro, the slug names the film or the topic. Keep the structure of the existing record — Context, What went well, Findings (`F1`, `F2`, … each with Evidence, Impact, Guard now), Open items — and add the new finding to the table below. A finding another session already recorded is an update, not a new number: append to the old record and say what changed.

**Read the distilled version.** [`lessons.md`](lessons.md) — the reusable rules, one line each, with the guard that enforces them. Read it before you build a film.

**Judgement rules.** [`../CODING_STANDARDS.md`](../CODING_STANDARDS.md) — the reviewer's rules (R1–R7). Mechanical rules live in checks, CI jobs and hooks, not there.

## Findings and their guards

Every row links to the record it came from: [`retro/2026-10-30-tram-nghi-nhiieu.md`](retro/2026-10-30-tram-nghi-nhiieu.md).

| # | Finding | Severity | Guard now |
|---|---|---|---|
| F1 | The `films/` branch had no automated gate, while the `styles/` branch had a complete one | critical | `sh core/render/review.sh <folder>` (one command per film) · `tools/release.py check --strict` now covers `films/` · `DIRECTOR.md` §11 |
| F2 | A bulk regex codemod broke ~10 drawing calls and no check caught it | critical | [`core/render/drawcheck.mjs`](../core/render/drawcheck.mjs) — per-film audit that derives the calling convention from the film's own `rect` helper · runs in CI and in the pre-commit hook |
| F3 | The film was committed and reported as verified before the required checks had run | high | `core/render/review.sh` must exit 0 before a commit or a "done" report (`DIRECTOR.md` §11) |
| F4 | Files were edited with shell heredocs, twice with consequences | high | [`CODING_STANDARDS.md`](../CODING_STANDARDS.md) R1–R3 · `DIRECTOR.md` §11 |
| F5 | Long jobs were polled with `sleep` instead of being awaited | medium | `CODING_STANDARDS.md` R5 · `DIRECTOR.md` §11 |
| F6 | The library had no guardrail at all for the code of a film | medium | [`.github/workflows/films.yml`](../.github/workflows/films.yml) (node --check + drawcheck + citation check) · [`tools/install_precommit.sh`](../tools/install_precommit.sh) |
| F7 | The review loop existed in the guide but was not one runnable command | medium | `core/render/review.sh` · `TECHNIQUE.md` §8 points at it |
| F8 | There was no map from "reference film" to "which files to read" | medium | `TECHNIQUE.md` §13 "Anatomy of a reference film" |
| F9 | One source in the research file could not be checked | low | [`tools/check_citations.py`](../tools/check_citations.py) |
| F10 | The film's treatment never reached the repository | low | `.gitignore`: `!films/*/TREATMENT.md` |
| F11 | A caption contradicts the picture it labels for ~4.3 s (film content) | high | `DIRECTOR.md` §11 — "a caption that states a value may only be on screen while that value is" |
| F12 | Three visual rough spots the contact sheet showed (film content) | medium | `DIRECTOR.md` §11 (measure the string against its box; a close-up keeps the body in frame) · the review contact sheet |

## The second record: what the new guardrails caught

[`retro/2026-10-30-tap-02.md`](retro/2026-10-30-tap-02.md) — the first film made **after** the guards above existed. It
records what the gate caught (a label that ticked every second and would have failed the reading check at the end of a
full render; a build that swallowed the gate's failure; a review that looked for the film in the wrong folder and
skipped the loudness step) and what still needs a human eye.

| # | Finding | Severity | Guard now |
|---|---|---|---|
| T1 | A label that changes every second is a new text piece every second | high | `core/render/review.sh` (readcheck) · fixed in the film's code |
| T2 | A marker highlight drawn after the words covers them | medium | no guard possible — recorded only |
| T3 | A set that fills the frame erases what was drawn before it | medium | no guard possible — recorded only |
| T4 | Text inside a clipped panel is cut off without any error | medium | no guard possible — recorded only |
| T5 | A gate that cannot fail the build is decoration | high | `films/*/build.sh` exits with the review's status · `CODING_STANDARDS.md` R4 |
| T6 | The review looked for the film in the wrong folder and skipped the loudness step | high | `core/render/review.sh` looks in the folder and in `out/` |
| T7 | The whisper model sits on a drive that is often not mounted | medium | `core/render/review.sh` says "skipped: no whisper model available" instead of passing silently |
| T8 | The desk lamp stands on the page the character writes on, and two of the three lines fall behind the desk edge | medium | no guard possible — recorded only; the contact sheet shows it |
| T9 | A string drawn with a raw `fillText()` is a string the reading check cannot see | high | `core/render/drawcheck.mjs` now reports a raw `fillText()` in the shot file · `DIRECTOR.md` §11 |
| T10 | The label "94 nghiên cứu" was not what the paper says (94 **independent tests**) and the pages of two sources were wrong — **tập 03 did it again** | high | `tools/check_citations.py` cannot see that, but the research file now quotes the abstract and the pages are verified against Crossref · `tools/check_claims.py` reports the pair every fifteen minutes · `CODING_STANDARDS.md` R6 |
| T11 | The subtitles and the captions were drawn in the same place — the same words printed on top of each other | high | `core/render/readcheck.mjs --band 880` (wired into `core/render/review.sh`) · `DIRECTOR.md` §11 |
| T12 | The picture was saying the narration's sentence verbatim, so every sentence appeared twice | medium | `DIRECTOR.md` §11 — "the picture carries labels and numbers, not the voice" (a writing rule; no check can decide it) |
| T13 | The rig: mittens instead of hands, flat shoes, a walk without a knee | medium | the rig in `src/character.js`: a palm with a thumb and four curling fingers, a shoe with a sole, a walk that lifts the knee and rolls the foot, hair and bulb that trail the turn |
| T14 | A whip pan smeared the words into ghosts — the same sentence seven times at 70 px apart | medium | `broll.js`'s `sharpText` draws the registered words again, sharp, over the blur · `DIRECTOR.md` §10 |
| T15 | The first session's mistake repeated: two sources rewritten with a heredoc, one import lost — **tập 03 rewrote fourteen files that way** | medium | `tools/supervise.sh` reads the running session's own tool log and reports every shell write with its timestamp — a witness that runs every fifteen minutes (`CODING_STANDARDS.md` R1) |
| T16 | The player loaded the `.srt` next to the mp4 on top of the captions that are burned into the picture — the transcript looked doubled | high | the transcript is shipped as `<name>.transcript.srt`, so no player auto-loads it; `films/README.md` says why |
| T17 | `bodyYaw` and `lean` were computed by the rig and never drawn, so every twist and lean a shot asked for was dropped | medium | the upper body now uses them (a yaw narrows and shifts the shoulders, a lean tips the body) — `improvements/lessons.md` |

## The third record: the episode that was watched while it was made

[`retro/2026-10-30-tap-03.md`](retro/2026-10-30-tap-03.md) — a twenty-minute episode, built under a supervisor that
ran every fifteen minutes (`tools/supervise.sh`), with the gate in front of it and a reviewer model reading the
episode. Three of the findings below were found **before** the episode was rendered.

| # | Finding | Severity | Guard now |
|---|---|---|---|
| P1 | A copied episode keeps the old episode's identity — its treatment, research, title and credits were byte-identical to the previous episode's | critical | [`core/render/filmcheck.mjs`](../core/render/filmcheck.mjs) (new) — reports the identity files that are byte-identical to another episode's, and the files that name different episodes · in `review.sh`, CI and the pre-commit hook |
| P2 | The build script kept the other episode's name, so the film would have shipped under it | critical | `core/render/filmcheck.mjs` — the name the build writes the movie under must belong to no other film |
| P3 | A number the research file forbids was on screen ("9,5 phút" — in no source, and only allowed with a qualifier) | high | [`tools/check_claims.py`](../tools/check_claims.py) (new) — the research file is read as sentences; a sentence that forbids a value supports nothing, and a sentence that allows it only with a qualifier demands the qualifier on screen · in `review.sh` and CI |
| P4 | A number was attributed to the year of a paper that does not contain it ("20 phút — nghiên cứu năm 2009") | high | `tools/check_claims.py` — a card that attributes a finding to a year must find that year beside that number in the research file |
| P5 | The wording of a number regressed ("94 nghiên cứu" for 94 independent tests — the error tập 02 closed) | high | `tools/check_claims.py` reports the pair; the judgement is a reader's — `CODING_STANDARDS.md` R6 |
| P6 | The film index named a movie the build never wrote (`triu` for `trieu`) | medium | [`tools/check_films_index.py`](../tools/check_films_index.py) (new) — every row of `films/README.md` against the file it names, and every film folder in the index · in CI |
| P7 | A long job was polled with `sleep`, and the rule against it is only a rule | medium | `tools/supervise.sh` reads the running session's own tool log and reports every `sleep`, every `git add -A` and every shell write, every fifteen minutes |
| P8 | A class of defect that only an agent reading the film can see (the picture contradicting its own research file) | medium | `tools/supervise.sh` runs a reviewer model over the episode with the gate's output and the session's log as evidence; its findings are proposals, to be verified before they are acted on |
| P9 | The channel's own production process was found by accident, after eleven tool calls of rediscovery | low | `AGENTS.md` (a row for "another episode of a channel the library already makes") · `TECHNIQUE.md` §13 names the channel's `CHANNEL.md` as its map |
| P10 | The research file repeated four of its bullets and pointed at "mục 13" for a number that lives in "mục 12" | medium | [`tools/check_facts.py`](../tools/check_facts.py) (new) — the file against itself: no duplicated bullet, and every "mục N" must hold the number the sentence claims for it · in `review.sh` and CI |
| P11 | The supervisor's own R5 detector filed a one-second settle after a `kill` as a poll of a long job | low | `tools/supervise.sh` — the detector only counts a wait of five seconds or more |
| P12 | The index promised a runtime the mix did not deliver (20:00 promised, 19:55 measured) | medium | `tools/check_films_index.py` compares the claimed runtime with `ffprobe` of the file · in the supervisor's gate, CI and the pre-commit hook |
| P13 | `pkill -f build.sh` from the repository root killed the session's own render — and would kill another episode's build | high | no guard possible — recorded only; `AGENTS.md` ("Never kill processes you didn't start") · the reviewer model is the witness |
| P14 | The drawing audit was skipped for one film ("no rect helper") and the silence read as a pass | medium | `core/render/drawcheck.mjs` says what it could not check and goes on with the rules it can apply |
| P15 | The claims check only knows the markers it was written for ("Cảnh báo", "không được nói", "Nếu giữ … phải nói rõ") — a research file worded otherwise is not covered | medium | the limit is written down in the check's header and in the record; no guard possible — recorded only |

## The fourth record: the layout of the library

[`retro/2026-10-30-layout.md`](retro/2026-10-30-layout.md) — the change that moved the three episodes of the channel
into the channel, gave the library one rule for where a film lives, and made the index a generated file. The rows below
are the findings that record carries; the findings of the earlier records that this change answers (P1, P2, P9, P12,
P14) are updated in their own records.

| # | Finding | Severity | Guard now |
|---|---|---|---|
| L1 | The guides told an agent that a film lives in `films/<name>/`, as if that were the only option, and the one pointer to a channel's map named a folder that does not exist | medium | `AGENTS.md` ("Where things go", and the row for the next episode of a channel) · `TECHNIQUE.md` §13 · the contract in [`docs/layout.md`](../docs/layout.md) |
| L2 | The three episodes each carried a copy of the channel's rig, mix, fonts and voice scripts — one implementation in three places | critical | `core/render/new_episode.sh` attaches the channel's shared code instead of copying it · `CODING_STANDARDS.md` R7 |
| L3 | Every tool that walked `films/` found the one-shots and missed the episodes; a path that counted levels broke the day the layout moved | high | `core/render/films.mjs` — the one module that knows where the films are; the CI steps, the pre-commit hook, `tools/release.py` and `tools/supervise.sh` ask it for the list |
| L4 | The film index was written by hand, and one of its rows promised a runtime the mix did not deliver | medium | `tools/gen_films_index.py` writes `FILMS.md` from the manifests · `tools/check_films_index.py` compares every manifest with the file on disk and the index with the manifests |
| L5 | A film that could not be checked read as a pass, and a step that found no film passed silently | medium | `core/render/drawcheck.mjs` says what it could not check and exits non-zero · every CI step fails when the discovery module finds no film |
| L6 | A guard that silently stopped guarding: the `rect` rule no longer applied to the episodes, because the helper moved to the channel's rig — and CI parsed only the films' own `src/`, so the rig and the cast module were never parsed at all | high | `core/render/drawcheck.mjs` follows the episode's relative imports, so the helper is found in the rig; an audit that finds no helper does not read as a pass · the CI parse step covers `channels/`, `films/`, `core/cast/` and the styles, and copies each file under a unique name |
| L7 | The gate died on the voice step instead of skipping it: `set -e` killed the review when the whisper model could not be loaded | high | `core/render/review.sh` finds the ASR script in the episode or in the channel, and captures the checker's status: a model error skips, a mismatch fails |
| L8 | A 3D page renders blank and the render still passes: the headless browser's shaders do not validate on a Linux box without GPU drivers | medium | `core/render/page.mjs` recognises the page's own WebGL failures in the log (`VALIDATE_STATUS`, `no valid shader program`, `CONTEXT_LOST_WEBGL`) and names the fix (`LEMO_ANGLE=swiftshader`) · `core/render/browser.mjs` probes the context (lost, or a program that does not link) |
| L9 | The supervisor never found the film under production: `find -newermt '-2 days'` is not a date GNU `find` understands | medium | `tools/supervise.sh` asks the discovery module for the films and computes the date with `date -d` |
| L10 | The rule that keeps a treatment in the repository matched one level, so an episode one level deeper would have silently stopped being committed | medium | `.gitignore` carries `!channels/*/*/TREATMENT.md` · `tools/check_tracked.py` asks git whether each film's treatment can be committed, and fails when it cannot |
| L11 | The plugin edition would have shipped pointers to files it does not ship | low | `tools/directory.py` (EDITS) removes the channel rows for that edition and says that a film there is a one-shot |
| L12 | The voice step failed with a file error on a film whose speech had never been generated on that machine — the speech is a local artefact, so a fresh clone cannot pass the step | medium | `core/render/review.sh` skips the voice step with a message when the film has no generated voice, the way it skips a missing model |

## The fifth record: supervising the long-form episode (Tập 04)

[`retro/2026-11-01-tap-04.md`](retro/2026-11-01-tap-04.md) — a 10-minute episode of Trạm Nghĩ Nhiều produced under
the 15-minute supervisor. It records the scaffolding bugs, gate gaps, template placeholder bypasses, and voice check
escape hatches that were caught and guarded.

| # | Finding | Severity | Guard now |
|---|---|---|---|
| K1 | The scaffolding tool omitted poster extraction, crashing `build.sh` on first run | critical | `core/render/new_episode.sh` extracts `$OUT/poster.jpg` with `ffmpeg` before copying |
| K2 | Scaffolding assumed flat channel depth, breaking relative imports in nested series | critical | `core/render/new_episode.sh` computes `REL_TO_CHANNEL` dynamically and auto-detects `lang="vi"` |
| K3 | `filmcheck.mjs` and `check_citations.py` reported green on unfilled template placeholders | critical | `core/render/filmcheck.mjs` rejects template placeholders (`<structure>`, `<Author>`); `tools/check_citations.py` rejects unexpanded placeholders |
| K4 | The Whisper ASR check was bypassed by inserting misheard Vietnamese text into `"asr"` | high | [`CODING_STANDARDS.md`](../CODING_STANDARDS.md) R8 (numbers and foreign names only) · `channels/tram-nghi-nhieu/voice/asr_vi.py` logs a `NOTE` on override |
| K5 | `core/render/review.sh` omitted `check_citations.py` | high | `core/render/review.sh` now runs `check_citations.py` whenever `research/FACTS.md` is present |
| K6 | `tools/supervise.sh` announced `claims` checking but never ran it | high | `tools/supervise.sh` now executes `gate_step claims "$PY" "$LIB/tools/check_claims.py" "$FILM"` |
| K7 | Loudness check in `review.sh` was purely decorative and ignored True Peak violations | medium | `core/render/review.sh` now uses `ebur128=peak=true` and checks True Peak ceiling |
| K8 | `review.sh` did not verify that the delivered movie was newer than the source files | medium | `core/render/review.sh` now checks artifact freshness against `src/*.js` and `voice/lines.json` |

## The supervisor

[`tools/supervise.sh`](../tools/supervise.sh) watches the episode that is being made: every fifteen minutes it finds
the running session and the film under production, puts the film through the gate, reads the session's own tool log
for the rules it broke, asks a reviewer model to read the film against `lessons.md` and `CODING_STANDARDS.md`, and
writes one entry into `improvements/supervision/<date>.md`.

**The supervisor proposes; the coordinator promotes.** Its entries are not findings — a finding lives in a retro record
and ends in a guard or in the words "no guard possible — recorded only". Every proposal the supervisor makes is read
by a person or by the next session, and either becomes a guard or is recorded as-is.

**What runs where.** The cycle is a cron entry on this machine:

```
*/15 * * * * sh /home/minhbien/Documents/lemo-opuscar/tools/supervise.sh >> ~/.local/state/lemo-supervisor/cron.log 2>&1
```

To stop it: `crontab -e` and delete that line (or `crontab -r` to drop the whole table). To run one cycle by hand:
`sh tools/supervise.sh`; to see what it would write: `sh tools/supervise.sh --dry`. `SUPERVISE_LLM=on-fail` runs the
reviewer only when the gate fails, `SUPERVISE_LLM=never` runs the gate alone, and the reviewer is skipped on its own
when the session has been still for 45 minutes. The per-cycle files are local (`improvements/supervision/` is gitignored);
the curated record is what enters the repository.

It never edits the film, never commits and never touches the running session.
