import './canvas-stub.mjs';
import * as THREE from 'three';
const base = '/home/minhbien/Documents/lemo-opuscar/channels/tram-nghi-nhieu/series/do-vat/tap-03-dien-thoai-nong-khi-sac/src/';
const { buildN5 } = await import(base + 'n5-tui-pin.js');
const S = buildN5();
S.scene.updateMatrixWorld(true);

// pouch local -> world: pouch.scale = MAG = 8
const MAG = 8;
const P = S.pouch; // vo-day-duoi
console.log('pouch world scale', P.parent ? 'in group' : 'root');
const wp = new THREE.Vector3();
P.getWorldPosition(wp);
console.log('floor world pos', wp.toArray());

// layers
const layers = S.layers;
console.log('S.layers count', layers.length, layers.map(l => l.name));
const box = new THREE.Box3();
for (const l of layers) {
  box.setFromObject(l);
  console.log(l.name, 'world bbox y', box.min.y.toFixed(4), box.max.y.toFixed(4),
    'x', box.min.x.toFixed(4), box.max.x.toFixed(4),
    'z', box.min.z.toFixed(4), box.max.z.toFixed(4));
  box.makeEmpty();
}
