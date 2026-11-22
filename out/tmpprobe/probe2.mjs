import './canvas-stub.mjs';
import * as THREE from 'three';
const base = '/home/minhbien/Documents/lemo-opuscar/channels/tram-nghi-nhieu/series/do-vat/tap-03-dien-thoai-nong-khi-sac/src/';
const { buildN5 } = await import(base + 'n5-tui-pin.js');
const S = buildN5();
S.scene.updateMatrixWorld(true);
const box = new THREE.Box3();
const counts = {};
S.scene.traverse(o => {
  if (!o.isMesh) return;
  counts[o.name] = (counts[o.name]||0)+1;
});
console.log('mesh name counts in scene:', JSON.stringify(counts, null, 1));
// specifically
for (const nm of ['hat-liti','bong-bop','lop-tach','lop-than','lop-kim-loai','vo-day-duoi','que-nhiet-ke']) {
  const found = [];
  S.scene.traverse(o => { if (o.isMesh && o.name === nm) found.push(o); });
  if (!found.length) { console.log(nm, 'NOT FOUND'); continue; }
  found.forEach((o,i) => {
    box.setFromObject(o);
    console.log(nm, i, 'world bbox center', box.getCenter(new THREE.Vector3()).toArray().map(v=>v.toFixed(4)),
      'y', box.min.y.toFixed(4), box.max.y.toFixed(4), 'z', box.min.z.toFixed(4), box.max.z.toFixed(4));
    box.makeEmpty();
  });
}
