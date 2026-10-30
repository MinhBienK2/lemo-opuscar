# Coding standards

The judgement rules of this repository: the things a check cannot enforce, so a reviewer has to read them.

## How to use

Read this **at review time**, not at implementation time: when you are asked to look at someone else's change, these five rules are the ones to judge it by, together with the file's own conventions. Each rule exists because a session in this repository broke it — the evidence is in [`improvements/retro/`](improvements/retro/).

## The rules

**R1 — Edit files with the file-editing tools (`edit`, `ast_edit`, `write`), never with a shell heredoc or a shell redirect.** A shell write can truncate a file before it fails, and it leaves no record of what was intended.

**R2 — A codemod is not applied until you have re-read the file it touched.** A patch script that aborts part-way leaves the file half-patched, and the edits it did not land are invisible; report which ones did not land instead of assuming.

**R3 — Never commit a file the user has modified.** Snapshot their version, stage only your own change, and never `git add -A` over a dirty working tree; check `git diff` (staged vs unstaged) before committing.

**R4 — Do not write "verified" in a report unless the output of the check is in hand.** A report that claims a check that never ran is worse than no report.

**R5 — Long jobs: start them in the background and continue with other work; never poll with `sleep`.** The harness delivers the job output on its own; polling burns wall-clock time and, while the shell is busy, later commands lose their variables.

## The boundary

**Mechanical rules live in checks, CI jobs and hooks — not here.** Arity, syntax, citations, layout and the review loop are enforced by `core/render/drawcheck.mjs`, `sh core/render/review.sh <folder>`, `tools/check_citations.py`, `tools/release.py check --strict`, `.github/workflows/films.yml` and `tools/install_precommit.sh`. This file holds only what those tools cannot decide.

If a rule can be a check, write the check and leave here at most the sentence saying why the judgement is still needed.

## Recorded lessons

The findings behind these rules, and the guard that now enforces each of them, are in [`improvements/README.md`](improvements/README.md); the distilled list is [`improvements/lessons.md`](improvements/lessons.md).
