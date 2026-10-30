# The beats of episode 03 — how to write a shot

`src/film.js` holds the drawing. `src/shots.js` holds the table of shots. A shot says **which beat** to
draw and **what words** the beat shows; the beat says **how** it is drawn. The episode is twenty minutes
long, so most shots are one of a dozen beats with different words — not a new drawing for every line.

## The shape of a shot

```js
{ n: 'ch1d', at: 'c1_4', off: -.2, beat: 'stat', line: 'c1_4',
  num: '47%', unit: 'số thức', label: 'đầu người ta đang lang thang', col: PAL.hoodie.f, px: 160,
  pip: true, pipE: 'excited',
  ev: () => [[0, 'pop'], [0.3, 'rise'], [0.8, 'ting']] },
```

- `n` — the name of the shot (it shows up in the sound events and in the review frames).
- `at` — the line the shot is anchored to. The shot starts `off` seconds before that line (default −0.3).
- `beat` — the name of the beat (the list below).
- `line` — the line the beat times itself against (usually the same as `at`).
- `ev` — the sound events: `[[t, type, extra]]`, where `t` is **relative to the start of the shot**.
- `tr` — optional transition: `'whip'` (a whip pan into the shot) or `'iris'` (an iris wipe).

## The beats

| Beat | What it shows | Parameters |
|---|---|---|
| `talk` | the host at his desk, talking, with a note card on the other side of the frame | `keys`, `card`, `z`, `f`, `yaw` |
| `stat` | one big number in a ring | `num`, `unit`, `label`, `note`, `col`, `px`, `pip`, `pipE` |
| `bars` | a bar chart; every bar grows when its turn comes | `title`, `items`, `max`, `top`, `pip` |
| `compare` | a claim on the left, the evidence on the right, a stamp on the claim | `leftHead`, `left`, `rightHead`, `right`, `stamp`, `pip` |
| `phone` | a phone on the desk, notifications popping in | `notifs`, `counter`, `dur` |
| `strip` | a work day cut into fragments | `title`, `blocks`, `gapLabel`, `foot` |
| `check` | a checklist, one line at a time | `title`, `items` |
| `flow` | three circles in a row | `title`, `items` |
| `money` | coins of attention being spent | `spent`, `label`, `total` |
| `head` | the head close-up, thoughts drifting away | `thoughts`, `label` |
| `myth` | a press-release card with a stamp on it | `head`, `claim`, `quote`, `source`, `stamp` |
| `roi` | Rối with a speech bubble | `text`, `sub` |
| `chapter` | the chapter card: a big number, a title, a subtitle | `n2` (the number), `title`, `sub` |
| `end` | the end card | — |

### `talk`

The card is the one object of the shot. It is a sheet of paper with a title, a handwritten subtitle and up to
four highlighted lines. Each line appears when the voice reaches it and stays for the rest of the shot.

```js
card: { x: 560, y: 470, w: 780, h: 440, title: 'MICROSOFT, 2008', sub: 'nhân viên văn phòng bấm đồng hồ',
  lines: [{ t: 'mỗi khi chuyển sang việc khác', at: 'c2_2', k: 10, col: PAL.cyan.f }] }
```

- `at` inside a card line is a **line id**; the highlight goes on at the moment that word is spoken. `k` is the
  index of the word in that line (count the words from zero). `col` is the highlight colour: `PAL.hoodie.f`
  (yellow) by default, `PAL.cyan.f` (data), `PAL.red.f` (a warning), `PAL.green.f` (something good),
  `PAL.violet.f` (Rối).
- `keys` — the expression of the host: `[[0, 'talk'], ['w', 6, 'smile']]`. `'w'` means "at word 6 of `line`".
  The expression names are in the channel's rig (`../../rig/character.js`, `EXPR`): talk, smile, happy, excited, surprised, shocked,
  thinking, skeptical, smug, worried, sad, tired, annoyed, embarrassed, determined, deadpan, flat, spin.

### `bars`

```js
items: [{ label: 'có thông báo', sub: 'rung lên giữa lúc đang làm', v: 1, col: PAL.red.f, num: 'nhiều hơn hẳn' }]
```

`v` is the value (relative to `max`, default 1); `label` and `sub` go under the bar; `num` appears above the bar.

## The rules the shots must follow

1. **One accent colour per shot.** Yellow for the story, cyan for data, red for a warning, green for something
   that works, violet only for Rối.
2. **No text below y = 880** — that band belongs to the subtitles.
3. **Text stays long enough to be read**: a line of about 45 characters needs about four and a half seconds on
   screen. A card line that appears and is gone in two seconds fails the reading check.
4. **The picture must not contradict the voice.** The card's words are the words of that moment, not a summary
   of the chapter.
5. The host is drawn on the right; the card sits on the left. Never two cards at once.
6. The sound events that exist: `pop`, `paper`, `marker`, `ting`, `stamp`, `whoosh`, `boing`, `swish`, `drain`,
   `rise`, `step`, `tick`, `thump`; plus `music` with a cue (`A`–`G`, `end`) and `amb` with a kind
   (`room`, `night`, `dawn`, `low`, `scroll`).
