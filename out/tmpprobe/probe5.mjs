import './canvas-stub.mjs';
import * as THREE from 'three';
const base = '/home/minhbien/Documents/lemo-opuscar/channels/tram-nghi-nhieu/series/do-vat/tap-03-dien-thoai-nong-khi-sac/src/';
const { buildN5 } = await import(base + 'n5-tui-pin.js');
const S = buildN5();
S.scene.updateMatrixWorld(true);
const box = new THREE.Box3();
const find = nm => { let r=null; S.scene.traverse(o=>{ if(o.isMesh && o.name===nm && !r) r=o; }); return r; };
for (const nm of ['vo-day-duoi','vo-dau-trai','vo-dau-phai','vo-lung','nap-vo-con-lai','lop-kim-loai','lop-tach-3','hat-liti','bong-bop','que-nhiet-ke','dau-que-nhiet-ke']) {
  const o = find(nm); if(!o){console.log(nm,'missing');continue;}
  box.setFromObject(o);
  console.log(nm.padEnd(20), 'world x', box.min.x.toFixed(4), box.max.x.toFixed(4),
   '| y', box.min.y.toFixed(4), box.max.y.toFixed(4), '| z', box.min.z.toFixed(4), box.max.z.toFixed(4));
}
console.log('\nPouch local: L=.105 (x ±.0525) W=.062 (z ±.031) T=.014');
console.log('pouch world x should be ±.42, z -.248..0, y 0.. .112');
console.log('\nlithium/bubble local positions intended (from seeds): x -.040..+.038, y .0034..0041, z -.0008..-.0029');
