# Lessons: the reusable ones

Distilled from the retro records in [`retro/`](retro/). Each line is a rule; each guard is what now enforces it. Read this before building a film.

- **A mechanical mistake needs a check, not a rule.** — Guard: `core/render/drawcheck.mjs` catches a drawing call with the wrong argument count or inverted corners.
- **A loop that is a list of steps gets skipped; a loop that is one command gets run.** — Guard: `sh core/render/review.sh <folder>` is the whole review loop, and `TECHNIQUE.md` §8 points at it.
- **"Verified" is a word you may only write with the check output in hand.** — Guard: `DIRECTOR.md` §11 and `CODING_STANDARDS.md` R4.
- **Never ship before the guard runs.** — Guard: CI (`.github/workflows/films.yml`) and the pre-commit hook (`tools/install_precommit.sh`) run on every push, before a commit reaches the repository.
- **Edit files with the file-editing tools; a shell write can truncate a file before it fails.** — Guard: `CODING_STANDARDS.md` R1 — a judgement rule, no check can replace it.
- **A codemod is not applied until you have re-read the file it touched.** — Guard: `CODING_STANDARDS.md` R2 — report the edits that did not land.
- **Never commit a file the user has modified.** — Guard: `CODING_STANDARDS.md` R3 — stage your own change only, never `git add -A` on a dirty tree.
- **Start a long job in the background and keep working; never poll it with `sleep`.** — Guard: `CODING_STANDARDS.md` R5.
- **Read the reference film's file map before reading the reference film.** — Guard: `TECHNIQUE.md` §13 "Anatomy of a reference film".
- **Use the tools the library already has: `core/render/still.mjs` and `core/render/sheet.py`, not a hand-rolled ffmpeg montage.** — Guard: `core/render/review.sh` builds the contact sheet with them.
- **Derive a convention from the code in front of you, not from memory of the library.** — Guard: `drawcheck` reads each film's own `rect` helper, because the signature differs per style.
- **Every source in a research file must be traceable.** — Guard: `tools/check_citations.py` requires DOI, PMID, arXiv or a URL per entry.
- **A caption that names a state must be gated on that state.** — Guard: none — an eye is the only check; recorded in the retro.
- **A value that changes every frame must not be rendered as text** — a label that ticks is a new text piece every tick, and the reading check needs each piece to hold. — Guard: `core/render/review.sh` (readcheck) reports it; the rule is in `retro/2026-10-30-tap-02.md`.
- **A marker stroke goes behind the words it marks.** — Guard: none — the contact sheet shows it; recorded in `retro/2026-10-30-tap-02.md`.
- **Measure the string against the box it lives in, not the box against the frame** — a clipped panel cuts a title in half without any error. — Guard: none — the contact sheet shows it; recorded in `retro/2026-10-30-tap-02.md`.
- **A gate that cannot fail the build is decoration.** — Guard: `films/*/build.sh` exits with the review's status; `CODING_STANDARDS.md` R4.
- **The rationale of a film belongs with the film.** — Guard: `.gitignore` keeps `films/*/TREATMENT.md` trackable.
