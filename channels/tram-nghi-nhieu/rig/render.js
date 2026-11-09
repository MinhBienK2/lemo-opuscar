// The channel's picture: supersampled toon render → ink lines → bloom → ink-on-paper grade → 2D overlay.
// Every episode renders through this; do not replace it with OutlineEffect or tone mapping.
import * as THREE from 'three';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { PAL, seg, back, ss } from './kit.js';

export const W = 1920, H = 1080;
export const Q = new URLSearchParams(location.search);

const VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;
const NOISE = `
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }`;

// Ink: edges from the depth Laplacian and from normal breaks; thickness wobbles like a hand line,
// grows near the camera (uRef / depth) and fades into the fog.
const INK_FS = `
uniform sampler2D tCol, tNorm, tDepth; uniform vec2 px; uniform float near, far, uThick, uRef, uFogFar, uOn; uniform vec3 uInk;
varying vec2 vUv;
${NOISE}
float lin(vec2 uv){ float z = texture2D(tDepth, uv).r * 2. - 1.; return 2. * near * far / (far + near - z * (far - near)); }
vec3 nrm(vec2 uv){ return texture2D(tNorm, uv).rgb * 2. - 1.; }
void main(){
  vec3 c = texture2D(tCol, vUv).rgb;
  float d0 = lin(vUv); vec3 n0 = nrm(vUv);
  float bg = step(far * .98, d0);
  float r = uThick * (.75 + .5 * vn(vUv * vec2(90., 50.))) * clamp(uRef / d0, .55, 1.7);
  float e = 0.;
  vec2 dirs[4]; dirs[0] = vec2(1,0); dirs[1] = vec2(0,1); dirs[2] = vec2(.7071,.7071); dirs[3] = vec2(.7071,-.7071);
  for (int i = 0; i < 4; i++) {
    vec2 o = dirs[i] * r * px;
    float da = lin(vUv + o), db = lin(vUv - o);
    float lap = abs(da + db - 2. * d0) / d0, jump = max(abs(da - d0), abs(db - d0)) / d0;
    e = max(e, smoothstep(.025, .06, lap) * smoothstep(.02, .05, jump));
    e = max(e, smoothstep(.2, .45, 1. - dot(nrm(vUv + o), nrm(vUv - o))) * (1. - bg));
  }
  c = mix(c, uInk, uOn * e * (1. - smoothstep(uFogFar * .55, uFogFar, d0)) * .95);
  gl_FragColor = vec4(c, 1.);
}`;

// Grade: downsample, flash, soft shoulder (no clipped whites), blacks lifted to ink navy,
// vignette, static paper tooth, per-frame grain, then the 2D overlay on top.
const FIN_FS = `
uniform sampler2D tSrc, tOv; uniform vec2 px; uniform float uFrame, uOv, uVig, uFade; uniform vec3 uFlash; varying vec2 vUv;
${NOISE}
vec3 shoulder(vec3 x){ return mix(x, .78 + .22 * (1. - exp(-(x - .78) * 4.5)), step(.78, x)); }
vec3 toSRGB(vec3 c){ return mix(c * 12.92, 1.055 * pow(c, vec3(1. / 2.4)) - .055, step(.0031308, c)); }
void main(){
  vec3 c = .25 * (texture2D(tSrc, vUv + px * vec2(-.5,-.5)).rgb + texture2D(tSrc, vUv + px * vec2(.5,-.5)).rgb
                + texture2D(tSrc, vUv + px * vec2(-.5,.5)).rgb + texture2D(tSrc, vUv + px * vec2(.5,.5)).rgb);
  c = shoulder(max(c + uFlash, 0.));
  c = mix(vec3(.012, .014, .032), vec3(1.), c);
  vec2 q = vUv - .5; q.x *= 1.6;
  c *= 1. - uVig * smoothstep(.35, 1.05, length(q));
  vec3 s = toSRGB(clamp(c, 0., 1.));
  vec2 fc = gl_FragCoord.xy;
  s = s * (1. + (vn(fc * .35) - .5) * .035 + (vn(fc * .05 + 3.) - .5) * .04) + (h(fc + uFrame * 17.31) - .5) * .045;
  vec4 o = texture2D(tOv, vUv); s = mix(s, o.rgb, o.a * uOv);
  gl_FragColor = vec4(s * uFade, 1.);
}`;

// film({fov, near, far}) → { renderer, camera, ov, frame(scene, opts) }
// frame opts: t, thick (ink px, ~3–3.6), ref (distance where the line is nominal: wide ~2.5, close ~.3),
//   flash (THREE.Color added before the grade), fade (0..1), vig, overlay(g, t) → [{id,text,x0,y0,x1,y1}] for TEXTS,
//   key (the key light, for ?lightcam).
// Diagnostics in the URL: ?ss=1 (no supersampling), ?nobloom, ?noink, ?lightcam (look from the key light).
export function film({ fov = 36, near = .02, far = 40 } = {}) {
  const SS = +(Q.get('ss') ?? 2), RW = W * SS, RH = H * SS;
  const cv = document.querySelector('canvas#c'); // the scaffold's page shell has one; otherwise a canvas goes into #stage
  const renderer = new THREE.WebGLRenderer({ canvas: cv || undefined, antialias: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NoToneMapping;
  if (!cv) (document.getElementById('stage') || document.body).appendChild(renderer.domElement);
  const camera = new THREE.PerspectiveCamera(fov, W / H, near, far);

  const rt = () => new THREE.WebGLRenderTarget(RW, RH, { type: THREE.HalfFloatType });
  const rtNorm = rt(), rtMain = rt(), rtInk = rt();
  rtNorm.depthTexture = new THREE.DepthTexture(RW, RH); rtNorm.depthTexture.type = THREE.UnsignedIntType;
  // the fx layer (gas, glass, glow) is drawn after the ink, over it, depth-tested against the solid scene: so an edge
  // behind a wisp shows through it as softly as the wall does, instead of a hard black line printed on the wisp
  rtMain.depthTexture = new THREE.DepthTexture(RW, RH); rtMain.depthTexture.type = THREE.UnsignedIntType;
  rtInk.depthTexture = rtMain.depthTexture;
  const normMat = new THREE.MeshNormalMaterial();
  const ink = new FullScreenQuad(new THREE.ShaderMaterial({
    uniforms: { tCol: { value: rtMain.texture }, tNorm: { value: rtNorm.texture }, tDepth: { value: rtNorm.depthTexture }, px: { value: new THREE.Vector2(1 / RW, 1 / RH) },
      near: { value: near }, far: { value: far }, uThick: { value: 3.4 }, uRef: { value: 2 }, uInk: { value: new THREE.Color(PAL.ink) }, uFogFar: { value: 10 }, uOn: { value: Q.has('noink') ? 0 : 1 } },
    vertexShader: VS, fragmentShader: INK_FS, depthTest: false, depthWrite: false,
  }));
  const bloom = new UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), .5, .45, 1.0); // threshold 1: only HDR emitters bloom
  bloom.setSize(W / 2, H / 2);

  const ovCanvas = document.createElement('canvas'); ovCanvas.width = W; ovCanvas.height = H;
  const ov = ovCanvas.getContext('2d');
  const ovTex = new THREE.CanvasTexture(ovCanvas); ovTex.premultiplyAlpha = false;
  const fin = new FullScreenQuad(new THREE.ShaderMaterial({
    uniforms: { tSrc: { value: rtInk.texture }, tOv: { value: ovTex }, px: { value: new THREE.Vector2(1 / RW, 1 / RH) }, uFrame: { value: 0 }, uOv: { value: 0 },
      uFlash: { value: new THREE.Color(0, 0, 0) }, uVig: { value: .55 }, uFade: { value: 1 } },
    vertexShader: VS, fragmentShader: FIN_FS, depthTest: false, depthWrite: false,
  }));

  let texts = [];
  const probe = new THREE.Raycaster(); probe.layers.set(0);
  function frame(scene, o = {}) {
    const t = o.t ?? 0;
    if (window.SHOTPROBE) {   // for beatsheet: which things fill the frame (a 16×9 grid of rays, above the subtitle band)
      camera.updateMatrixWorld(); const SZ = new Map(), size = x => SZ.get(x) ?? (SZ.set(x, new THREE.Box3().setFromObject(x).getSize(new THREE.Vector3()).length()), SZ.get(x));
      const cov = new Map(), seen = x => { for (; x; x = x.parent) if (!x.visible) return false; return true; };
      for (let j = 0; j < 9; j++) for (let i = 0; i < 16; i++) {
        probe.setFromCamera(new THREE.Vector2((i + .5) / 8 - 1, 1 - (j + .5) / 9 * 1.6), camera);
        const h = probe.intersectObjects(scene.children, true).find(k => seen(k.object));
        if (!h) continue;
        // the prop, not its parts: the largest group around the hit that is still prop-sized (≤ 1.2 m across);
        // the room, the counter, the wall are not subjects
        let top = h.object; if (size(top) > 1.2) continue;
        while (top.parent && top.parent !== scene && size(top.parent) <= 1.2) top = top.parent;
        const k = top.name || top.uuid.slice(0, 8); cov.set(k, (cov.get(k) || 0) + 1 / 144);
      }
      window.SHOT = { cast: [...cov].filter(([, v]) => v >= .06).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, +v.toFixed(2)]) };
    }
    if (Q.has('lightcam') && o.key) {
      const k = o.key, d = new THREE.Vector3().subVectors(k.position, k.target.position).normalize();
      camera.position.copy(k.target.position).addScaledVector(d, 5); camera.lookAt(k.target.position); camera.fov = 30; camera.updateProjectionMatrix();
    }
    camera.layers.set(0);
    const bgc = scene.background, fog = scene.fog;
    scene.overrideMaterial = normMat; scene.background = null; scene.fog = null;
    renderer.setClearColor(0x000000, 0); renderer.setRenderTarget(rtNorm); renderer.clear(); renderer.render(scene, camera);
    scene.overrideMaterial = null; scene.background = bgc; scene.fog = fog;
    renderer.setRenderTarget(rtMain); renderer.clear(); renderer.render(scene, camera);
    const U = ink.material.uniforms; U.uThick.value = o.thick ?? 3.4; U.uRef.value = o.ref ?? 2; U.uFogFar.value = fog?.far ?? far;
    const ac = renderer.autoClear, su = renderer.shadowMap.autoUpdate; renderer.autoClear = false;
    renderer.setRenderTarget(rtInk); ink.render(renderer);                       // keeps the shared depth of the solid pass
    scene.traverse(x => { if (x.isLight) x.layers.enable(1); });                 // the lights light the fx layer too
    camera.layers.set(1); scene.background = null; renderer.shadowMap.autoUpdate = false;
    renderer.render(scene, camera);
    scene.background = bgc; renderer.shadowMap.autoUpdate = su; renderer.autoClear = ac; camera.layers.enableAll();
    if (!Q.has('nobloom')) bloom.render(renderer, null, rtInk, 0, false);
    const F = fin.material.uniforms;
    F.uFrame.value = Math.round(t * 24); F.uFade.value = o.fade ?? 1; F.uVig.value = o.vig ?? .55;
    F.uFlash.value.copy(o.flash || new THREE.Color(0, 0, 0));
    ov.clearRect(0, 0, W, H);
    texts = o.overlay ? (o.overlay(ov, t) || []) : [];
    // the subtitle is not a text piece: its hold is set by the .srt, not by the film. A film that hands the subtitle
    // box back from its overlay would have every spoken line measured as a too-short text, so the rig drops it here.
    texts = texts.filter(b => b && b.id !== 'sub');
    ovTex.needsUpdate = true; F.uOv.value = o.overlay ? 1 : 0;
    renderer.setRenderTarget(null); fin.render(renderer);
  }
  return { renderer, camera, ov, frame, texts: () => texts };
}

// Screen position of a world point.
export function toScreen(p, camera) { const v = p.clone().project(camera); return [(v.x * .5 + .5) * W, (1 - (v.y * .5 + .5)) * H]; }

// A beat mark: where the story acts, and for how long. `tools/check_motion.py` reads these to ask the one
// question the pixel count cannot: does the beat change the part of the frame where it happens? Without them
// the gate can only measure the film in general (something moves somewhere), never the beat that stands still.
// `xy` is the point in the 1920×1080 frame (use toScreen for a world point).
export function markBeat(ev, id, t, d, xy) { ev('mark', t, { kind: 'beat', beat: id, d, xy }); }

// A term label: cream card, ink border and drop, red Be Vietnam Pro 900, a pointer toward (px, py).
// Pops in with overshoot over `t0..t0+.35`, shrinks out over `t1-.2..t1`. Returns its box for TEXTS (or null mid-pop).
export function label(g, text, x, y, t, t0, t1, { id = text, size = 54, color = PAL.red, tilt = -.05 } = {}) {
  if (t < t0 || t > t1) return null;
  const k = back(seg(t, t0, t0 + .35), 2.2) * (1 - ss(seg(t, t1 - .2, t1)));
  g.save(); g.translate(x, y); g.rotate(tilt); g.scale(k, k);
  g.font = `900 ${size}px "Be Vietnam Pro"`;
  const bw = g.measureText(text).width + size, bh = size * 1.55, r = size / 3;
  g.fillStyle = PAL.ink; rrect(g, -bw / 2 + 6, -bh / 2 + 8, bw, bh, r); g.fill();
  g.fillStyle = PAL.cream; rrect(g, -bw / 2, -bh / 2, bw, bh, r); g.fill();
  g.lineWidth = 6; g.strokeStyle = PAL.ink; g.stroke();
  g.beginPath(); g.moveTo(-bw / 2 + 30, bh / 2 - 3); g.lineTo(-bw / 2 - 26, bh / 2 + 44); g.lineTo(-bw / 2 + 70, bh / 2 - 3); g.closePath(); g.fill(); g.stroke();
  g.fillRect(-bw / 2 + 33, bh / 2 - 9, 34, 8);
  g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 4);
  g.restore();
  return k > .99 ? { id, text, x0: Math.round(x - bw / 2), y0: Math.round(y - bh / 2), x1: Math.round(x + bw / 2), y1: Math.round(y + bh / 2) } : null;
}

// A burned-in subtitle in the bottom band (y ≥ 880): cream text, thick ink outline.
export function subtitle(g, text, { size = 46 } = {}) {
  if (!text) return null;
  g.save(); g.font = `800 ${size}px "Be Vietnam Pro"`; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.lineJoin = 'round'; g.lineWidth = 10; g.strokeStyle = PAL.ink; g.strokeText(text, W / 2, 985);
  g.fillStyle = PAL.cream; g.fillText(text, W / 2, 985); g.restore();
  const w = g.measureText(text).width;
  return { id: 'sub', text, x0: Math.round(W / 2 - w / 2), y0: 985 - size, x1: Math.round(W / 2 + w / 2), y1: 985 + 12 };
}

export function rect(g, x, y, w, h) { g.beginPath(); g.rect(x, y, w, h); }
export function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
