globalThis.document = globalThis.document || { createElement(tag){ if(tag!=='canvas') return {};
  const ctx=new Proxy({},{get:(t,k)=>{ if(k==='measureText') return ()=>({width:10}); if(k==='canvas') return {width:1,height:1};
    if(k==='createLinearGradient'||k==='createRadialGradient') return ()=>({addColorStop(){}}); if(k==='createPattern') return ()=>null; return ()=>{}; },set:()=>true});
  return {width:1,height:1,getContext:()=>ctx,style:{}}; } };
globalThis.location = globalThis.location || { search: '' };
globalThis.window = globalThis.window || { addEventListener(){}, devicePixelRatio:1 };
import * as THREE from 'three';
const EP = '/home/minhbien/Documents/lemo-opuscar/channels/tram-nghi-nhieu/series/do-vat/tap-03-dien-thoai-nong-khi-sac';
const { buildN5 } = await import(EP + '/src/n5-tui-pin.js');
const S = buildN5(); S.update(464,{dim:1,focus:1,thermo:1}); S.scene.updateMatrixWorld(true);
const sl = S.slice;
const b = new THREE.Box3().setFromObject(sl);
console.log('slice bbox', b.min.toArray().map(v=>v.toFixed(3)).join(','), b.max.toArray().map(v=>v.toFixed(3)).join(','));
console.log('S.lop2 =', S.lop2.toArray().map(v=>v.toFixed(4)).join(','));
const cam = new THREE.PerspectiveCamera(30,1920/1080,.01,100);
const proj=(p)=>{const v=p.clone().project(cam);return [Math.round((v.x*.5+.5)*1920),Math.round((-v.y*.5+.5)*1080)];};
function cov(P,L,fov){ cam.fov=fov; cam.position.copy(P); cam.lookAt(L); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;
  for(const xs of [b.min.x,b.max.x]) for(const ys of [b.min.y,b.max.y]) for(const zs of [b.min.z,b.max.z]){
    const [x,y]=proj(new THREE.Vector3(xs,ys,zs)); mnx=Math.min(mnx,x);mxx=Math.max(mxx,x);mny=Math.min(mny,y);mxy=Math.max(mxy,y);}
  // vị trí số 2
  const [lx,ly]=proj(S.lop2);
  return {mnx,mxx,mny,mxy,lx,ly};
}
for (const c of [
  [[-1.48,0.26,0.72],[-1.44,0.09,-0.05],30],
  [[-1.72,0.30,0.66],[-1.40,0.10,-0.06],30],
  [[-1.68,0.34,0.74],[-1.40,0.10,-0.06],30],
  [[-1.80,0.28,0.62],[-1.38,0.10,-0.06],30],
  [[-1.78,0.36,0.80],[-1.38,0.10,-0.06],30],
]) { const r=cov(new THREE.Vector3(...c[0]),new THREE.Vector3(...c[1]),c[2]);
  console.log('cam',JSON.stringify(c),'bbox screen x',r.mnx,r.mxx,'y',r.mny,r.mxy,'| so2 at',r.lx,r.ly); }
