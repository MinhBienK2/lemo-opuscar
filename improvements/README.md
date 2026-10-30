# Improvements: what the last session taught us

This folder is the library's memory of its own mistakes. Every retro session writes one record in `retro/`, and every finding in it must end in one of exactly two places:

- a **guard** — a check, a CI job, a hook or a doc rule that now catches the mistake before it ships, named by its path;
- the words **"no guard possible — recorded only"**, for the findings that need a human eye. A finding with neither is a finding that will happen again.

**Add a record.** One file per retro session, named `improvements/retro/YYYY-MM-DD-<slug>.md`: the date is the day of the retro, the slug names the film or the topic. Keep the structure of the existing record — Context, What went well, Findings (`F1`, `F2`, … each with Evidence, Impact, Guard now), Open items — and add the new finding to the table below. A finding another session already recorded is an update, not a new number: append to the old record and say what changed.

**Read the distilled version.** [`lessons.md`](lessons.md) — the reusable rules, one line each, with the guard that enforces them. Read it before you build a film.

**Judgement rules.** [`../CODING_STANDARDS.md`](../CODING_STANDARDS.md) — the reviewer's rules (R1–R5). Mechanical rules live in checks, CI jobs and hooks, not there.

## Findings and their guards

Every row links to the record it came from: [`retro/2026-10-30-tram-nghi-nhieu.md`](retro/2026-10-30-tram-nghi-nhieu.md).

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
| T10 | The label "94 nghiên cứu" was not what the paper says (94 **independent tests**) and the pages of two sources were wrong | high | `tools/check_citations.py` cannot see that, but the research file now quotes the abstract and the pages are verified against Crossref |
