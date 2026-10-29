# Films

Films made with this library. Each folder holds the whole project: the code that draws every
frame, the stills, the credits and the finished movie. Render outputs and generated speech stay
local (`films/.gitignore`) — `build.sh` in each film rebuilds them.

| Film | Folder | Runtime | Movie |
|---|---|---|---|
| Một vòng lộn, mười bốn năm — a 10-minute essay on *Journey to the West* | `tay-du-ky-twist/` | 10:07 | `tay-du-ky-twist/mot-vong-lon-muoi-bon-nam.mp4` |
| Phi vụ triệu đô trong 2 phút — a Money Heist explainer in a talking-head toon | `host-toon-test/` | 2:12 | `host-toon-test/phi-vu-trieu-do-2-phut.mp4` |
| Money Heist explainer (canvas cut) | `money-heist-explainer/` | 1:35 | `money-heist-explainer/money-heist-explainer.mp4` |

`host-toon-test/style/` is a style of its own — "Talking-Head Host Toon", cut from
`styles/cel-anime-80s` — with its demo film in `host-toon-test/style/test.mp4`.

## Rebuilding a film

From the repository root, with the repo's `.venv` and `node_modules` in place:

```sh
sh films/tay-du-ky-twist/build.sh
sh films/host-toon-test/build.sh
```

The voice is generated speech and is not committed; the scripts that make it sit next to it in
each film's `voice/` folder.

## The masters

The 10-minute film is committed in a web-sized cut (83 MB, CRF 25). Its full-quality master
(172 MB, CRF 19) is attached to the repository's release
[films-v1](https://github.com/MinhBienK2/lemo-opuscar-films/releases/tag/films-v1); the other two
films are committed at full quality.
