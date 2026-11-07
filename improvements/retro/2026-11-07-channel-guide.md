# Retro — how the channel guides an agent: Trạm Nghĩ Nhiều (2026-11-07)

## Context

A review of everything an agent reads and runs when it is asked for an episode of Trạm Nghĩ Nhiều: `AGENTS.md` →
`CHANNEL.md` → the skill `.agents/skills/tram-nghi-nhieu/SKILL.md`, the scaffold, the three reviewers and the gate. The
evidence is the long episode of the same day (`retro/2026-11-07-tap-01-ngu-trua-day-me.md`): eight script reviews stuck
at 5–6/10, a picture review at 3.4–4.0/10, a voice made for a script that had failed, a movie on disk while
`gate.py check` refused the episode, and three of five chapters left as placeholders. No episode of the channel had
passed the gate.

## What went well

- The independent reviewer (fresh session, outside the repository, blind description before reading the line) writes
  fixes that are visual and specific; the props check by blind naming catches stand-ins.
- The machine flags and the hashed stamps were the right idea.

## Findings

### C1 — high — two treatment specs
**Evidence.** The scaffold wrote the generic DIRECTOR §4 headings (three structures, cue map with bpm and key, a
"character rig" credit); the skill asked for a different one-page treatment (the question taken apart, the objects, the
idea → picture table). No heading was common to both.
**Guard now.** A channel may keep `templates/TREATMENT.tmpl.md` and `templates/NEXT.txt`; `core/render/new_episode.sh` uses
them (`docs/layout.md`). The channel's template carries the rules of the idea → picture table. `filmcheck.mjs` reports a
`<viết:` placeholder left in it; `review.sh --outline` refuses one.

### C2 — high — three stop rules
**Evidence.** `CHANNEL.md` said never stop on a FAIL; the skill said move on after three rounds of a scene and tell the
user when rounds ran out; `review.sh` stopped after six script reviews.
**Guard now.** One rule, in the skill (§6), with the rounds counted by `review.sh` itself: outline 4, words 6 per scope,
scene 3, chapter or whole film 5. `CHANNEL.md` no longer holds a process.

### C3 — high — the gate came after the expensive work
**Evidence.** Only `mix.py` asked the gate; the voice was made for a failed script and the movie was rendered by calling
`core/render/video.mjs` directly.
**Guard now.** `voice/tts_vi.py` asks `gate.py check --for voice` (outline and words); `core/render/video.mjs` asks the
gate of any channel that keeps `gate.py` (`docs/layout.md`, "A channel's review gate"); `review.sh` will not judge the
picture before the words and the props have passed.

### C4 — high — the gate's off switches
**Evidence.** `LEMO_CRITIC` ran any command as the reviewer (`printf "VERDICT: PASS"` passed), while the skill said no
variable turned the gate off; `gate.py stamp` could be called by hand.
**Guard now.** `LEMO_CRITIC` is refused; the reviewer is `omp` or `claude` (`LEMO_CRITIC_CLI`, `LEMO_CRITIC_MODEL`), and
who judged is signed under every report and written into every stamp; a stamp without it is refused. Forging a stamp by
hand is still possible and is named as forgery in the skill — no guard possible beyond that, recorded only.

### C5 — high — the long format had no process
**Evidence.** `STRATEGY.md` offered 15–25 minute episodes; the skill had no word for them; `--chapter` existed only in
`review.sh`; one session had to judge 185 frames at once and pass at 9/10.
**Guard now.** `src/chapters.js` is read by `gate.py`: words and picture pass chapter by chapter (`SCRIPT-<ch>.pass`,
`PICTURE-<ch>.pass`), a chapter owns `src/<id>.js` and its `files`, a shared file reopens every chapter, the chapters
must cover every line; a src file that says "placeholder" is neither judged nor rendered; `tts_vi.py --jobs N`.
Skill §5.

### C6 — medium — structural faults reached the line-by-line review
**Evidence.** One idea told 14 times, a concept explained 90 lines before it was drawn: eight rounds of `VIẾT LẠI` could
not fix either.
**Guard now.** `review.sh --outline` with `OUTLINE-CRITIC.md` before any line is written; `--script` refuses without it.
The script pass is now OVERALL ≥ 8 with no category under 7.

### C7 — medium — the machine flags contradicted the reviewer
**Evidence.** The skill let the maker keep an intended `SAME`; `CRITIC.md` let the reviewer overrule a wrong flag;
`review.sh` failed every flag whatever either said.
**Guard now.** Only the reviewer clears a flag, with `CỜ SAI <FLAG>: <why>` in the report; `review.sh` honours it (the
picture flags and `LONG`; never `DIGIT` or `NOFACTS`).

### C8 — low — maps out of date, rules repeated
**Evidence.** `CHANNEL.md` listed five of thirteen rig files; `brain.js` had no API entry; the skill repeated
`STYLE.md`, `CRITIC.md` and a machine flag seven times; an episode carried its own TTS script with an absolute path.
**Guard now.** `CHANNEL.md` and `rig/README.md` rewritten; the skill holds the process and points at the rules; the
episode's `tools/tts_parallel.sh` removed in favour of `tts_vi.py --jobs`. A map going stale again: no guard possible —
recorded only.

### C9 — medium — length was a format picked before the research
**Evidence.** The skill asked the user to choose Shorts, 3–5 or 15–25 minutes before anything was researched, and the
outline reviewer judged the length against that choice. The user cannot know how much the answer needs; a question
stretched to fit a slot repeats its ideas, one squeezed into a slot skips links.
**Guard now.** `STRATEGY.md` "Độ dài": length is what the complete causal chain needs on screen. The skill no longer asks
for it. The template's length section is filled after the idea → picture table (layers, lines, speaking rate, why not
shorter, what was left out). `OUTLINE-CRITIC.md` D judges missing links (CHẶN), padding (NẶNG/CHẶN) and squeezing to a
length the user named (NẶNG). Chapters follow the outline's size (about eight minutes and up), one per layer.

## Open items

- The long episode of the same day still has no stamp; it must go through `--outline` before anything else.
