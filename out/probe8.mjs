globalThis.document = globalThis.document || { createElement(tag){ if(tag!=='canvas') return {};
  const ctx=new Proxy({},{get:(t,k)=>{ if(k==='measureText') return ()=>({width:10}); if(k==='canvas') return {width:1,height:1};
    if(k==='createLinearGradient'||k==='createRadialGradient') return ()=>({addColorStop(){}}); if(k==='createPattern') return ()=>null; return ()=>{}; },set:()=>true});
  return {width:1,height:1,getContext:()=>ctx,style:{}}; } };
globalThis.location = globalThis.location || { search: '' };
globalThis.window = globalThis.window || { addEventListener(){}, devicePixelRatio:1 };
import * as THREE from 'three';
const EP = '/home/minhbien/Documents/lemo-opuscar/channels/tram-nghi-nhieu/series/do-vat/tap-03-dien-thoai-nong-khi-sac';
const { buildN5 } = await import(EP + '/src/n5-tui-pin.js');
const S = buildN5();
S.update(0,{dim:1,focus:1});
S.scene.updateMatrixWorld(true);
console.log('cutGroup scale', S.cutGroup.scale.toArray().join(','), 'pos', S.cutGroup.position.toArray().join(','));
for (const c of S.cutGroup.children) {
  if (!/lop-|vo-day/.test(c.name||'')) continue;
  const b = new THREE.Box3().setFromObject(c);
  console.log(c.name.padEnd(22), 'min', b.min.toArray().map(v=>v.toFixed(4)).join(','), 'max', b.max.toArray().map(v=>v.toFixed(4)).join(','));
}
