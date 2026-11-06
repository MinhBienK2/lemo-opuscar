// Light that tells the story: one key light through a shaped opening, a cool fill, a violet rim, one warm source at the focus.
import * as THREE from 'three';
import { Q } from './render.js';
import { mesh, fxLayer } from './kit.js';

// The key: a directional light with a 4096 shadow map. `from` and `to` are world points; `size` is half the shadow box.
export function keyLight(scene, { color = '#b4c6ff', intensity = 3.4, from, to, size = 4, far = 20 }) {
  const L = new THREE.DirectionalLight(color, intensity);
  L.position.copy(from); L.target.position.copy(to);
  L.castShadow = !Q.has('noshadow');
  L.shadow.mapSize.set(4096, 4096);
  Object.assign(L.shadow.camera, { left: -size, right: size, top: size, bottom: -size, near: 1, far });
  L.shadow.bias = -.0004; L.shadow.normalBias = .02; L.shadow.radius = 3;
  if (Q.has('nokey')) L.intensity = 0;
  scene.add(L, L.target);
  return L;
}

// Night defaults: navy sky / plum ground fill and a violet rim from behind-right.
export function ambience(scene, { sky = '#5a6aa8', ground = '#3a2438', fill = .42, rim = '#9a7bff', rimI = .9, rimFrom = [3, 3, -2] } = {}) {
  const hemi = new THREE.HemisphereLight(sky, ground, fill);
  const r = new THREE.DirectionalLight(rim, rimI); r.position.set(...rimFrom);
  scene.add(hemi, r);
  return { hemi, rim: r };
}

// A wall in the XY plane at z = 0 (thickness toward -z) with a rectangular hole: the key light shines through it,
// so the hole, its bars and whatever sways outside are printed on the floor and the furniture.
export function wallWithHole(scene, mat, { x0, x1, y0, y1, left = -4, right = 3, top = 3.4, thick = .16 }) {
  const part = (a, b, c, d) => scene.add(mesh(new THREE.BoxGeometry(b - a, d - c, thick), mat, [(a + b) / 2, (c + d) / 2, -thick / 2]));
  part(left, x0, 0, top); part(x1, right, 0, top); part(x0, x1, 0, y0); part(x0, x1, y1, top);
}

// A soft additive shaft of light from a rectangular opening along the light's direction (dust can float in it).
export function beam(scene, light, { x0, x1, y0, y1, z = -.05, length = 2.2, color = '#9fb2ff', alpha = .09 }) {
  const dir = new THREE.Vector3().subVectors(light.target.position, light.position).normalize();
  const g = new THREE.BoxGeometry(1, 1, 1); g.translate(0, 0, .5);
  const m = new THREE.Mesh(g, new THREE.ShaderMaterial({
    uniforms: { uCol: { value: new THREE.Color(color) }, uA: { value: alpha } },
    vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec3 vP; uniform vec3 uCol; uniform float uA;
      void main(){ float a = uA * (1. - smoothstep(.2, 1., vP.z)) * smoothstep(.0, .08, vP.z);
        a *= smoothstep(.5, .3, abs(vP.x)) * smoothstep(.5, .3, abs(vP.y)); gl_FragColor = vec4(uCol * a, 1.); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  }));
  m.matrixAutoUpdate = false;
  m.matrix.makeBasis(new THREE.Vector3(x1 - x0, 0, 0), new THREE.Vector3(0, y1 - y0, 0), dir.multiplyScalar(length)).setPosition((x0 + x1) / 2, (y0 + y1) / 2, z);
  fxLayer(m); m.renderOrder = 5; scene.add(m);
  return m;
}

// Shadow diagnostics: tag a mesh or group with userData.tag = 'blanket', then
//   ?nocast=blanket,curtain  — those stop casting;  ?cast=window  — only tags starting with it cast.
// Call once after the set is built.
export function shadowFlags(scene) {
  const tagOf = o => { let p = o; while (p) { if (p.userData.tag) return p.userData.tag; p = p.parent; } return ''; };
  if (Q.has('nocast')) { const no = Q.get('nocast').split(','); scene.traverse(o => { if (o.isMesh && no.includes(tagOf(o))) o.castShadow = false; }); }
  if (Q.has('cast')) { const keep = Q.get('cast'); scene.traverse(o => { if (o.isMesh && o.castShadow && !tagOf(o).startsWith(keep)) o.castShadow = false; }); }
}

// A pool of light (desk lamp, torch, street lamp): a soft-edged spot with shadows. Use it for the focus when the key
// cannot reach it — e.g. a cutaway, whose cut faces must be lit from the camera's side. Keep the rest of the set darker.
export function pool(scene, { from, to, color = '#ffe2b0', intensity = 4, angle = .42, penumbra = .7 }) {
  const L = new THREE.SpotLight(color, intensity, 0, angle, penumbra, 0);
  L.position.copy(from); L.target.position.copy(to);
  L.castShadow = !Q.has('noshadow'); L.shadow.mapSize.set(2048, 2048); L.shadow.bias = -.0004; L.shadow.normalBias = .02;
  scene.add(L, L.target);
  return L;
}
