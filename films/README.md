# Films

Films made with this library. Each folder holds the whole project: the code that draws every
frame, the stills, the credits and the finished movie. Render outputs and generated speech stay
local (`films/.gitignore`) — `build.sh` in each film rebuilds them.

| Film | Folder | Runtime | Movie |
|---|---|---|---|
| Phi vụ triệu đô trong 2 phút — a Money Heist explainer in a talking-head toon | `host-toon-test/` | 2:12 | `host-toon-test/phi-vu-triu-do-2-phut.mp4` 
| Trạm Nghĩ Nhiều — tập 1: Tại sao càng rảnh, ta càng thấy mệt? (a psychology explainer in a vector toon) | `tram-nghi-nhieu/` | 1:51 | `tram-nghi-nhieu/tram-nghi-nhieu-tap-01.mp4` |
| Trạm Nghĩ Nhiều — tập 2: Tại sao ta hay trì hoãn? (the same channel, built with the review gate) | `tram-nghi-nhieu-tap-02/` | 1:42 | `tram-nghi-nhieu-tap-02/tram-nghi-nhieu-tap-02.mp4` |

**The captions are burned into the picture.** Next to each film there is a `*.transcript.srt`: that is the transcript for
the platform's caption track, not a second set of subtitles. It is deliberately *not* named like the film, so that a
player (VLC auto-loads the subtitle file with the same name) does not draw it on top of the captions that are already in
the picture — which looks like a doubled transcript.

`host-toon-test/style/` is a style of its own — "Talking-Head Host Toon", cut from
`styles/cel-anime-80s` — with its demo film in `host-toon-test/style/test.mp4`.

## Rebuilding a film

From the repository root, with the repo's `.venv` and `node_modules` in place:

```sh
sh films/host-toon-test/build.sh
sh films/tram-nghi-nhieu/build.sh
sh films/tram-nghi-nhieu-tap-02/build.sh
```

The voice is generated speech and is not committed; the scripts that make it sit next to it in
each film's `voice/` folder.

## The masters

The 10-minute film is committed in a web-sized cut (83 MB, CRF 25). Its full-quality master
(172 MB, CRF 19) is attached to the repository's release
[films-v1](https://github.com/MinhBienK2/lemo-opuscar-films/releases/tag/films-v1); the other two
films are committed at full quality.
