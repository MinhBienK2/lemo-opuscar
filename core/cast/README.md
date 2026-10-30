# core/cast/: the cast module

One spec per character, one pose model, two adapters. The module reads a character's **spec** and hands
the caller a character that can be **posed**; an adapter draws that character in one renderer.

```
core/cast/
├── cast.mjs        the spec, the pose model, the shared geometry and face tables
├── adapter-2d.mjs  draws the character on a 2D canvas
└── adapter-3d.mjs  builds the character in three.js
```

The seam is the point: with one adapter the spec would be a second place to keep in sync. With two, the
spec is the **only** place, and a mistake in it shows up in both.

## The interface

Both adapters export the same two functions:

```js
export function createView(canvas);      // the target the character is drawn in
export function createCharacter(spec);    // → { draw(view, pose), setPose(pose) }
```

| Call | It does |
|---|---|
| `createView(canvas)` | prepares the target: a 2D context for the 2D adapter, a renderer + scene + camera for the 3D one. The view owns the stage (lights, background, ground), not the character. |
| `createCharacter(spec)` | reads the spec, builds the character, returns the pair below. |
| `character.draw(view, pose)` | draws the character into the view with that pose. `pose` may be omitted, in which case the last pose set is used. The 3D adapter renders the frame; the 2D adapter clears the canvas and draws. |
| `character.setPose(pose)` | sets the character's current pose and returns it, normalised (numbers clamped, missing fields filled). |

The two adapters are interchangeable: a page that swaps `adapter-2d.mjs` for `adapter-3d.mjs` changes
what the character looks like, not how it is posed.

```js
import { loadSpec, poseAt } from '/core/cast/cast.mjs';
import { createView, createCharacter } from '/core/cast/adapter-2d.mjs';

const spec = await loadSpec('cast/bich.json');
const view = createView(document.getElementById('c'));
const hero = createCharacter(spec);

window.render = t => {
  const pose = poseAt(t);          // one pose for every adapter
  hero.setPose(pose);
  hero.draw(view, pose);
};
```

A page that uses the 3D adapter needs an **import map** for `three` (see
`styles/backrooms/demo/index.html`):

```html
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
```

## The spec

A spec is a small JSON file, one per character, at `channels/<channel>/cast/<name>.json`:

```json
{
  "name": "Bích",
  "palette": { "skin": "#F2C9A0", "hair": "#2B2333", "hoodie": "#C25E4A" },
  "proportions": { "head": 1.0, "body": 2.6, "limb": 1.0 },
  "hair": { "style": "bob", "length": 0.6 },
  "face": { "eyes": "round", "mouth": "small" }
}
```

| Field | It is | It may be |
|---|---|---|
| `name` | the character's name | any non-empty string |
| `palette.skin` | the skin | `#RRGGBB` |
| `palette.hair` | the hair | `#RRGGBB` |
| `palette.hoodie` | the garment | `#RRGGBB` |
| `proportions.head` | the head's diameter, in head units | a positive number |
| `proportions.body` | the height of the body under the head, in head units | a positive number |
| `proportions.limb` | the scale of the arms and legs against that body | a positive number |
| `hair.style` | the hairstyle | `bob`, `short` |
| `hair.length` | how far the hair falls below the head's centre, in head units | a number in [0, 2] |
| `face.eyes` | the eyes | `round`, `oval` |
| `face.mouth` | the mouth | `small`, `wide` |

Everything else — where the eyes sit, how long the arms are, how wide the hips are, how the trousers are
shaded — is **derived** by `metrics()` and `palette()` in `cast.mjs`, so both adapters read the same
numbers. A spec with a typo is refused by `readSpec()` with a message naming the field; it never draws a
wrong character in two renderers at once.

### Reading a spec

```js
import { readSpec, parseSpec, loadSpec } from '/core/cast/cast.mjs';

readSpec(obj);        // validates and normalises an object
parseSpec(text);      // the same, from a JSON string
await loadSpec(url);  // fetch + validate (the repository root is the server's root)
```

## The pose model

A pose is a set of **named parameters**. Both adapters read exactly these names, so a pose written for
one works in the other:

| Parameter | Range | It is |
|---|---|---|
| `body` | −35°…35° | how far the body turns (positive = to the right) |
| `head` | −25°…25° | the head tilt (positive = to the right) |
| `armSwing` | −1…1 | the arm swing (−1 = behind the body, +1 = in front of it) |
| `legStance` | −1…1 | the leg stance (−1 = together, +1 = apart) |
| `expression` | `neutral`, `smile`, `think`, `surprise`, `worry` | the face |

```js
import { defaultPose, createPose, mixPose, faceOf, poseAt } from '/core/cast/cast.mjs';

defaultPose();                       // every field at its default
createPose({ head: 12 });            // the rest filled in, the numbers clamped
mixPose(a, b, 0.5);                 // between two poses (the expression switches at 0.5)
faceOf(pose);                       // the face as numbers: brows, lid, look, smile, mouth, blush
poseAt(t);                          // the channel's rest pose at second t — a pure function of t
```

`poseAt(t)` is deterministic: the same second always gives the same pose, in every adapter, on every
machine. It is the pose of the **cast sheet** (`channels/nhan-vat/demo/`), keyframed over a ten-second
loop; a film of the channel may key its own.

The face is a table of numbers (`EXPRESSIONS` in `cast.mjs`), not a drawing: the 2D adapter draws it, the
3D adapter builds it, and neither owns it.

## Adding a character

1. Write `channels/<channel>/cast/<name>.json` with the fields above.
2. Add it to the cast sheet: fetch the new spec and give it a second pair of canvases (see
   `channels/nhan-vat/demo/index.html`).
3. Nothing else. The adapters read the spec; they are not changed per character.

If the new character needs a **new hairstyle, eye shape or mouth shape**, that is not a spec change: add
the value to the list in `cast.mjs` (`HAIR_STYLES`, `EYE_STYLES`, `MOUTH_STYLES`) and teach **both**
adapters to draw it. A value one adapter understands and the other does not is a character that is two
people.

## Adding a third adapter

A third renderer (WebGPU, a vector library, a game engine) joins at the same seam:

1. **Write `core/cast/adapter-<name>.mjs`** exporting `createView(canvas)` and
   `createCharacter(spec)`.
2. **Read the shared numbers, not your own**: `metrics(spec)` for the geometry, `palette(spec)` for the
   colours, `faceOf(pose)` for the face. Do not re-derive a proportion from the spec: the second place
   to keep in sync is exactly what this module exists to remove.
3. **Honour the pose parameters**: `body` turns the body, `head` tilts the head, `armSwing` swings the
   arms, `legStance` moves the feet, `expression` changes the face. A pose that only reads in one
   adapter does not exist.
4. **Keep the same shapes**: the same proportions, the same palette, the same hair and the same face as
   the other adapters, or the character stops being one character.
5. **Do not touch `cast.mjs`** unless the module itself must grow. The pose model, the spec and the
   shared tables live there, and they belong to the channel, not to a renderer.

A third adapter is worth writing when a film of the channel needs it; it is not worth writing to prove
the seam exists — that is what the 2D and 3D adapters are for.
