# Coding standards

The judgement rules of this repository: the things a check cannot enforce, so a reviewer has to read them.

## How to use

Read this **at review time**, not at implementation time: when you are asked to look at someone else's change, these rules are the ones to judge it by, together with the file's own conventions. Each rule exists because a session in this repository broke it — the evidence is in [`improvements/retro/`](improvements/retro/).

## The rules

**R1 — Edit files with the file-editing tools (`edit`, `ast_edit`, `write`), never with a shell heredoc or a shell redirect.** A shell write can truncate a file before it fails, and it leaves no record of what was intended.

**R2 — A codemod is not applied until you have re-read the file it touched.** A patch script that aborts part-way leaves the file half-patched, and the edits it did not land are invisible; report which ones did not land instead of assuming.

**R3 — Never commit a file the user has modified.** Snapshot their version, stage only your own change, and never `git add -A` over a dirty working tree; check `git diff` (staged vs unstaged) before committing.

**R4 — Do not write "verified" in a report unless the output of the check is in hand.** A report that claims a check that never ran is worse than no report.

**R5 — Long jobs: start them in the background and continue with other work; never poll with `sleep`.** The harness delivers the job output on its own; polling burns wall-clock time and, while the shell is busy, later commands lose their variables.

**R6 — A number on screen wears the source's wording, not the film's.** The source says "94 independent tests"; the film that says "94 nghiên cứu" has changed the claim, whether or not the number is right. When the film's research file words a number differently from the paper, use the file's wording. A check can report the pair (`tools/check_claims.py`); the judgement that a shortening is fair is yours.

**R7 — A channel's shared code lives in the channel, and an episode is its own film.** The shared implementation exists once: a copy of the rig, the mix, the fonts or the voice scripts inside an episode is a defect, not a convenience — it is a second version that drifts, and the episode that reaches the channel by a relative path and the one that carries a copy no longer draw the same picture. A change to the shared code is made in the channel, once, and every episode is rebuilt against it; never in one episode. And an episode names its own movie: that name is the film's identity in the library — the file the build writes, the transcript beside it, the row the index prints — and it belongs to no other film, one-shots and episodes alike. An episode that keeps the previous episode's name ships under that name; two films that write the same movie overwrite each other.

## The boundary

**Mechanical rules live in checks, CI jobs and hooks — not here.** Arity, syntax, citations, the film's own identity, the numbers on screen, the index and the review loop are enforced by `core/render/drawcheck.mjs`, `core/render/filmcheck.mjs`, `sh core/render/review.sh <folder>`, `tools/check_citations.py`, `tools/check_claims.py`, `tools/check_films_index.py`, `tools/release.py check --strict`, `.github/workflows/films.yml` and `tools/install_precommit.sh`. The layout itself is enforced the same way: `core/render/films.mjs` is the one module that knows where the films are, so every tool and every CI step finds them by asking it; `core/render/new_episode.sh` writes an episode that starts empty of the previous episode's identity; `core/render/filmcheck.mjs` reports an identity file that is byte-identical to another film's and a build name that belongs to another film; `tools/gen_films_index.py` writes `FILMS.md` from the manifests and `tools/check_films_index.py` compares every manifest with the file on disk and the index with the manifests.

What no tool can decide is in R7: whether a copy of the channel's shared code inside an episode is a convenience or a defect, and where a change to that shared code belongs. This file holds only what those tools cannot decide.

If a rule can be a check, write the check and leave here at most the sentence saying why the judgement is still needed.

## Recorded lessons

The findings behind these rules, and the guard that now enforces each of them, are in [`improvements/README.md`](improvements/README.md); the distilled list is [`improvements/lessons.md`](improvements/lessons.md).
