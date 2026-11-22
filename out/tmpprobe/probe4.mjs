import './canvas-stub.mjs';
import * as THREE from 'three';
const base = '/home/minhbien/Documents/lemo-opuscar/channels/tram-nghi-nhieu/series/do-vat/tap-03-dien-thoai-nong-khi-sac/src/';
const { buildN5 } = await import(base + 'n5-tui-pin.js');
const S = buildN5();
S.scene.updateMatrixWorld(true);

console.log('=== new prop layer bands (pouch-local, = world/8) ===');
const names = ['lop-kim-loai','lop-tach','lop-than','lop-tach-2','lop-kim-loai-2','lop-tach-3'];
S.scene.traverse(o => {
  if (!o.isMesh) return;
  if (!names.includes(o.name)) return;
  if (o.name.endsWith('(cut face)')) return;
  // pouch-local band: world y / 8, but the +x tail is lifted, so measure the sheet's PLANE
  const g = o.geometry; const p = g.attributes.position;
  const ys = [];
  for (let i=0;i<p.count;i++) ys.push(p.getY(i));
  // world bbox of the whole mesh
  const box = new THREE.Box3().setFromObject(o);
  console.log(o.name, 'world y', box.min.y.toFixed(4), '-', box.max.y.toFixed(4),
    '=> pouch-local', (box.min.y/8).toFixed(5), '-', (box.max.y/8).toFixed(5));
});
console.log('');
console.log('=== scene element heights (world) ===');
console.log('flow line y = .030  (pouch-local .00375)');
console.log('hot zone  y = .030  (pouch-local .00375)');
console.log('card LỚP ĐIỆN CỰC world y .030 -> local .00375');
console.log('card LỚP TÁCH     world y .039 -> local .004875');
console.log('lithium seed b .0034..0041 local');
console.log('');
console.log('=== brief expected bands (pouch-local) ===');
console.log('lá1 .0009-.0017 | lá2 .0021-.0029 | lá3 .0033-.0041 | lá4 .0045-.0053 | lá5 .0057-.0065 | lá6 .0069-.0077');
