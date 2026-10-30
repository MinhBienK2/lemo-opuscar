# Retro — 2026-10-30 — `films/tram-nghi-nhieu`

- **Session**: `01a188bc-4e6e-7492-b91a-18a3cfed725d` — 2026-10-29 17:36 → 2026-10-30 04:27 UTC, 690 log lines at `~/.omp/agent/sessions/-Documents-lemo-opuscar/2026-10-29T17-36-44-654Z_01a188bc-4e6e-7492-b91a-18a3cfed725d.jsonl`.
- **Film**: `films/tram-nghi-nhieu` — episode 1, "Tại sao càng rảnh, ta càng thấy mệt?" (1:51, 18 shots), committed as `9843f23` and amended after an advisor pass.
- **Reference film copied for technique**: `films/host-toon-test`.

## Context

The session was asked to build a film in the vector-toon style on the user's topic, "the freer you are, the more tired you feel", and to deliver it complete: treatment, voice, animation, music and foley, mix, render, subtitles, poster, `STYLE.md`, `CHANNEL.md`, `research/FACTS.md`, `CREDITS` and the source with a one-command `build.sh`, then to commit it.

Tool census of the session: `bash` 106, `read` 64, `write` 18, `todo` 17, `edit` 6. 28 of the `bash` calls were `python3 <<EOF` patch scripts that rewrote source files; 11 more were `sleep` polls of background jobs (≈22 min of wall clock). Two `reset_boundary` events made the client resend the same user message three times; two model turns ended `aborted`.

## What went well

- **The script.** A real hook ("mệt như vừa đi xa bốn mươi ki lô mét"), a turn that is not faked — the film goes and kills a popular explanation ("hết pin ý chí", 23 laboratories, no effect found) — a punch line worth quoting ("Lướt mạng xã hội không phải là nghỉ. Đó là một công việc không lương") and a cheap, concrete call to action.
- **The research.** `research/FACTS.md` carries DOI/PMID for five of six sources, hedges correctly ("no significant effect found", not "no effect exists"), and the narration says what the source says.
- **The technical layer.** `readcheck` 38/38, 33 subtitle cues with 0 errors, −14.1 LUFS with a −1.0 dBFS peak, 111.375 s at 24 fps, `CREDITS` complete with OFL licences.
- **The delivery set.** Treatment, style sheet, channel sheet, facts file, poster and a working `build.sh` were all produced — the film is in the shape a deliverable is supposed to be.

## Findings

### F1 — critical — The `films/` branch of the repo has no automated gate, while the `styles/` branch has a complete one

**Evidence.** `MAINTAINING.md:34` ("Machine") names the canonical gate: `asr_check.py` passes · `mux.sh` reports about −14 LUFS · `readcheck.mjs` passes · `python3 tools/release.py check --strict <slug>` is clean. Every style demo wires its own checks into the build (`styles/art-deco/demo/build.sh:9`, `styles/ascii-crt/demo/build.sh:8`, `styles/backrooms/demo/build.sh:6`, `styles/archive-lighttable/demo/build.sh:37`). But `films/host-toon-test/build.sh` and `films/tram-nghi-nhieu/build.sh` run only events → mix → video → srt → mux → poster: no readcheck, no asr_check, no release check. `tools/release.py check --strict` scopes to `styles/<slug>/` only (`style_format()` and `completeness()` both take slugs from `styles/`), so a user's film is never checked by the repo's own tool. `package.json` has no `scripts` (no lint/check/test); `.github/workflows/` holds only `pages.yml`; there is no pre-commit hook.

**Impact.** In the session, 9–10 broken drawing calls shipped into a commit; `readcheck` ran only at the very end and failed 1/38; the film was reported as "đã kiểm tra" (verified) before any check had run.

**Guard now.** `sh core/render/review.sh <folder>` — one command for a film folder: drawcheck + readcheck + review stills + contact sheet + loudness + black frames, non-zero on any failure — and a `films/` scope in `tools/release.py check --strict` (layout, readable `.mp4`, `.srt`, `poster.jpg`, `CREDITS`, `src/`, `TREATMENT.md`, `build.sh`). `DIRECTOR.md` §11 points at the command.

### F2 — critical — A bulk regex codemod broke ~10 drawing calls and no check caught it

**Evidence.** Between 17:56 and 18:02 the session converted `path()` calls into `rect()` calls by regex across `films/tram-nghi-nhieu/src/*.js`. The result had `rect()` calls with 8 arguments instead of 4 and with inverted x corners at `src/broll.js:186`, `src/character.js:251,293,342,384`, `src/sets.js:208,213`, `src/film.js:246` (plus seven more). On screen: the battery level fill drew nothing, the hoodie pocket was off-centre, the sweat drop became a line, the hour blocks disappeared. The advisor pass caught it only after the film had been committed.

**Impact.** A whole class of mechanical damage shipped in a commit and was only found by an eye. The film's own helper, `films/tram-nghi-nhieu/src/cel.js:31` (`rect(x0, y0, x1, y1)`), normalises `y1 < y0` but silently mirrors `x1 < x0`, so the inverted-corner calls still drew — just in the wrong place.

**Guard now.** `core/render/drawcheck.mjs` — a per-film audit that derives the calling convention from that film's own `rect` helper, because the signature differs across the library (`styles/blueprint/demo/draw.js:118` is `(x0,y0,x1,y1)`, `styles/isometric-picture-book/demo/kit.js:38` is `(x0,x1,y0,y1)` with the order swapped, `styles/rubber-hose/demo/toon.js:61` and `styles/scifi-toon/demo/toon.js:58` are `(x,y,w,h)`, `styles/risograph/demo/draw.js:37` and `styles/microgame/demo/g_pixel.js:14` are `(x,y,w,h,c)`), so the check must never hardcode one convention. It reports wrong argument counts, inverted x corners in corner mode and non-positive sizes, and it runs in CI and in the pre-commit hook.

### F3 — high — The film was committed and reported as verified before the checks the workflow requires had run

**Evidence.** `DIRECTOR.md` §11 and `TECHNIQUE.md` §8 require a review loop (contact sheets at least twice, 0.2 s frame strips, loudness, blackdetect, one full-speed viewing). The session ran one contact sheet at the very end, after the commit and after the "done" report; `readcheck.mjs` ran three times (≈10 min each) only to fix one text-timing problem.

**Impact.** "Done" was reported for a film nobody had watched end to end. A film can pass every mechanical check and still be wrong; the reverse is worse — reporting a check that never ran.

**Guard now.** The one-command review loop (`sh core/render/review.sh <folder>`) must exit 0 before a commit and before a "done" report; `DIRECTOR.md` §11 says so, and `CODING_STANDARDS.md` R4 forbids writing "verified" without the check output in hand.

### F4 — high — Files were edited with shell heredocs, twice with consequences

**Evidence.** 28 `python3 <<EOF` patch scripts rewrote source files (the harness tool policy requires the `edit`/`ast_edit` tools). One patch helper stopped at `AssertionError` mid-way, so none of its `film.js` edits were written and they had to be redone. One script did `io.open(p, 'w')` on `films/README.md`, truncating it to empty before raising; the git index then held the user's own unstaged edit, which removed two rows (`tay-du-ky-twist`, `money-heist-explainer`) from that file, so the commit nearly destroyed the user's data — repaired with `git commit --amend` and a restore from a copy.

**Impact.** Two near-misses in one session, both invisible to any check: a lost edit set and a nearly lost user file. A shell write can truncate a file before it fails.

**Guard now.** `CODING_STANDARDS.md` R1 (edit with the file-editing tools), R2 (a codemod is not applied until it has been re-read; report the edits that did not land) and R3 (never commit a file the user has modified; stage only your own change), restated as process rules in `DIRECTOR.md` §11. Judgement calls: no check can replace them.

### F5 — medium — Long jobs were polled with `sleep` instead of being awaited

**Evidence.** 11 bash calls of the form `sleep 150; …` (383, 467, 473, 512, 518, 632, 641, 651, 658, 662 and more) to wait for background renders; the harness injects the job output on its own and states that polling is a wasted turn. Because the session shell was busy, 15+ later bash calls fell back to "Ran in a temporary shell while the session shell is busy" and lost their variables.

**Impact.** ≈22 minutes of wall clock and several wasted turns, plus shell state that silently disappeared.

**Guard now.** `CODING_STANDARDS.md` R5: start long jobs in the background and continue with other work; never poll with `sleep`. `TECHNIQUE.md` §8 now points at the one-command loop, so no ad-hoc waiting is needed to review a film.

### F6 — medium — The library has no guardrail at all for the code of a film

**Evidence.** `package.json` has no `scripts`; `.github/workflows/` has only `pages.yml` (which itself contains real shell checks, so there is precedent); `.git/hooks/` has only the sample hooks. There is nothing that runs `node --check` or any check over `films/*/src/*.js`.

**Impact.** Any film can be committed with a syntax error or a broken drawing call, and the repository will build its gallery over it without a word.

**Guard now.** `.github/workflows/films.yml` (node --check over `films/*/src/` and `styles/*/demo/`, `drawcheck` per film, citation check per `FACTS.md`) and `tools/install_precommit.sh`, which installs a staged-files-only hook running the same cheap checks.

### F7 — medium — The review loop exists in the guide but is not one runnable command, so the agent hand-rolled it

**Evidence.** `TECHNIQUE.md` §8 already prescribes "a frame every 1–2 s with `still.mjs --range`, tiled with `core/render/sheet.py`", and `core/README.md` lists both commands — yet the session built its contact sheet with a hand-written ffmpeg montage instead of `core/render/sheet.py`. The same gap made the session re-render the whole 111 s film three times to check one text-timing change.

**Impact.** Time spent rebuilding tooling that already exists, and a review loop that is easy to describe and easy to skip.

**Guard now.** The loop is packaged as one command, `sh core/render/review.sh <folder>`; `TECHNIQUE.md` §8 and the new anatomy section point at it and say not to hand-roll ffmpeg montages.

### F8 — medium — There is no map from "reference film" to "which files to read"

**Evidence.** The session read 15 files / 190 KB of `films/host-toon-test` to learn the pipeline, and the `read` tool truncated long files, so it had to re-read them raw. `films/host-toon-test/build.sh:4` also carries `LIB=${LIB:-/home/pc599/Documents/lemo-opuscar}` — a path from a different machine, so `cd "$LIB"` fails in a fresh clone unless `LIB` is exported.

**Impact.** Most of the reading budget of the session went into reconstructing the pipeline that a table could have named in ten lines, and the sample build script still breaks on another machine.

**Guard now.** `TECHNIQUE.md` §13 "Anatomy of a reference film": file → what it holds → what to copy when you build your own film, over the real files of `films/host-toon-test`. The `LIB` default in the sample's `build.sh` is an open item (see below).

### F9 — low — One source in the research file cannot be checked

**Evidence.** `films/tram-nghi-nhieu/research/FACTS.md` §5 cites "The relationship between nature exposures and attention restoration (2025)" with no journal, DOI, PMID or URL, while the other five sources all carry DOI/PMID. It is not read on screen, but a later episode would build on it.

**Impact.** A citation that cannot be checked is a citation that cannot be defended.

**Guard now.** `tools/check_citations.py` — every source entry in a research file must carry DOI, PMID, arXiv or a URL; the file is reported and the command exits non-zero. It runs over `films/*/research/FACTS.md` in CI.

### F10 — low — The film's treatment never reaches the repository

**Evidence.** `.gitignore:114` has `**/TREATMENT.md`, so `films/tram-nghi-nhieu/TREATMENT.md` is not tracked (`git check-ignore` confirms), while `STYLE.md` and `CHANNEL.md` of the same film are. `AGENTS.md` only asks for "source, credits and the finished film" to be committed, so this is not a rule violation — the consequence is that the rationale of episode 1 is invisible to the next session.

**Impact.** Every later episode has to re-derive why episode 1 was made that way, and the beat sheet and cue map that made it work are lost.

**Guard now.** `.gitignore` carries the exception `!films/*/TREATMENT.md`, so a user's own treatment travels with the film.

### F11 — high (film content) — A caption contradicts the picture it labels for ~4.3 seconds

**Evidence.** `films/tram-nghi-nhieu/src/film.js:221` sets `mv = w('myth', 9)`; the `myth` line starts at 50.392 s and word index 9 ("Câu") is at +3.96 s, so the battery drains from 54.35 s to 56.75 s (`film.js:231`, `level = 1 - seg(T, mv, mv + 2.4)`), while the caption "hết pin" (`film.js:232`) is drawn from the shot start at 50.09 s. From 50.1 s to 54.35 s the card reads "hết pin" under a still-full green battery. Before the `rect()` fix the level fill drew nothing at all, so the battery was empty for the whole shot — accidentally matching the caption but losing the "running down" animation; the fix exposed the pre-existing label/drain mismatch.

**Impact.** The film contradicts itself on screen for about four seconds, in the shot that carries its turn.

**Guard now.** No guard possible — a caption that describes a state needs an eye. Recorded here and in the new episode's fixes: the caption is now gated on the same segment as the state it describes.

### F12 — medium (film content) — Three visual rough spots the contact sheet showed

**Evidence.** At t≈22 s the close-up shows a head floating on black with the hoodie cut off at the frame edge and the subtitle over the body; at t≈28 s the second character ("người ta") is a flat navy blob far below the host's craft, with a stray white speck on the chest and the subtitle over the legs; at t≈81 s the comparison panel "MÀN HÌNH" is dense while "ĐI DẠO" is nearly empty, so the contrast the shot is about does not carry.

**Impact.** Two of the film's three weakest frames are in its first third; the third is the shot that is supposed to land the payoff of the comparison.

**Guard now.** No guard possible — recorded here, and the new episode applies the fixes: framing with the shoulders in frame, a consistent second character, two equally weighted panels.

## Open items

Deliberately not fixed by this change:

- **Episode 1 is frozen.** The film stays as it was committed, so it can serve as the "before" of a comparison against the new episode. The image findings F11 and F12 are therefore still visible in the shipped film; they are fixed in the new episode, not by editing episode 1.
- **The script's own weak spots are untouched.** The 47 % figure is a claim about all waking hours used as evidence about free days (a scope slip the viewer cannot see but an expert can), five claims share 111 s, and the payoff rests on a 1989 theory named in one sentence without its mechanism. Fixing them means re-recording the voice, so they belong to the new episode, not to a retro.
- **`films/host-toon-test/build.sh:4` still hardcodes another machine's `LIB`.** The anatomy table names the file and the correct default (`LIB=${LIB:-$(cd "$HERE/../.." && pwd)}`), but the fix lives under `films/`, outside the scope of this change.
- **One citation stays unverifiable.** `tools/check_citations.py` reports the entry in `research/FACTS.md` §5; the check cannot invent a DOI, and the source was not read on screen, so nothing else changes.
- **The style list in `AGENTS.md` stays duplicated.** The generated `<!-- style-list:start -->` block repeats `styles/README.md`; the block is generated by `styleboard/build.py`, so replacing it is a separate change.
- **`films/check.sh` is not created.** The one-command review is `sh core/render/review.sh <folder>`; the earlier name from the first retro pass was dropped so that only one command exists in the docs.
