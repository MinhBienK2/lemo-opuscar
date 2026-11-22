globalThis.document = globalThis.document || { createElement(tag){ if(tag!=='canvas') return {};
  const ctx=new Proxy({},{get:(t,k)=>{ if(k==='measureText') return ()=>({width:10}); if(k==='canvas') return {width:1,height:1};
    if(k==='createLinearGradient'||k==='createRadialGradient') return ()=>({addColorStop(){}}); if(k==='createPattern') return ()=>null; return ()=>{}; },set:()=>true});
  return {width:1,height:1,getContext:()=>ctx,style:{}}; } };
globalThis.location = globalThis.location || { search: '' };
globalThis.window = globalThis.window || { addEventListener(){}, devicePixelRatio:1 };
import * as THREE from 'three';
import fs from 'fs';
const EP = '/home/minhbien/Documents/lemo-opuscar/channels/tram-nghi-nhieu/series/do-vat/tap-03-dien-thoai-nong-khi-sac';
const { buildN5 } = await import(EP + '/src/n5-tui-pin.js');
const { SHOTS } = await import(EP + '/src/shots.js');
const dur = JSON.parse(fs.readFileSync(EP + '/voice/proc/dur.json', 'utf8'));
const { SEQ } = await import(EP + '/src/timeline.js');
const T = {}; let tt = 0;
for (const [id, gap] of SEQ) { tt += gap; T[id] = { t0: tt, t1: tt + dur[id] }; tt += dur[id]; }
const S = buildN5(); S.update(T.c98.t0+0.4,{dim:1,focus:1}); S.scene.updateMatrixWorld(true);
const SHOTMAP = Object.fromEntries(SHOTS.map(r=>[r[0],r]));
const cam = new THREE.PerspectiveCamera(33,1920/1080,.01,100);
const proj = (p)=>{const v=p.clone().project(cam);return [Math.round((v.x*.5+.5)*1920),Math.round((-v.y*.5+.5)*1080)];};
function shotCam(id,t){ const [,sid,aim,dist,height,side,fov]=SHOTMAP[id]; let P,L;
  if(aim.startsWith('@')){const v=aim.slice(1).split(',').map(Number);P=new THREE.Vector3(v[0],v[1],v[2]);L=new THREE.Vector3(v[3],v[4],v[5]);}
  else if(aim.startsWith('cams:')){const cc=(S.cams||{})[aim.slice(5)];P=new THREE.Vector3(cc[0],cc[1],cc[2]);L=new THREE.Vector3(cc[3],cc[4],cc[5]);}
  else { const o=S[aim]; const box=new THREE.Box3().setFromObject(o); L=box.getCenter(new THREE.Vector3()); P=L.clone().add(new THREE.Vector3(side*dist*.70,height,dist)); }
  const u=Math.max(0,Math.min(1,(t-T[id].t0)/Math.max(.001,T[id].t1-T[id].t0))); P.lerp(L,u*u*(3-2*u)*.16); return {P,L,fov}; }
// mép trước của mỗi lá tại một toạ độ x: điểm có z lớn nhất, y = giữa bề dày
function frontEdge(mesh, xTarget){
  const P=mesh.geometry.attributes.position, v=new THREE.Vector3(), mw=mesh.matrixWorld;
  let best=null, bestD=1e9;
  const pts=[];
  for(let i=0;i<P.count;i++){ v.fromBufferAttribute(P,i).applyMatrix4(mw); pts.push(v.clone()); }
  // nhóm theo x: lấy z lớn nhất quanh xTarget
  const near=pts.filter(p=>Math.abs(p.x-xTarget)<0.02);
  if(!near.length) return null;
  const maxZ=Math.max(...near.map(p=>p.z));
  const ys=near.filter(p=>p.z>maxZ-0.002).map(p=>p.y);
  return { x:xTarget, y:(Math.min(...ys)+Math.max(...ys))/2, z:maxZ, ymin:Math.min(...ys), ymax:Math.max(...ys) };
}
const names=['lop-kim-loai','lop-tach','lop-than','lop-tach-2','lop-kim-loai-2','lop-tach-3'];
for (const id of ['c98','c100']) {
  const t=T[id].t0+(T[id].t1-T[id].t0)*0.5; const {P,L,fov}=shotCam(id,t);
  cam.fov=fov; cam.position.copy(P); cam.lookAt(L); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  console.log('===',id,'P',P.toArray().map(v=>v.toFixed(3)).join(','));
  for(const n of names){
    const m=S.cutGroup.children.find(x=>x.name===n); if(!m) continue;
    const row=[];
    for (const xt of [-0.30,-0.15,0,0.15,0.30]) {
      const e=frontEdge(m,xt);
      row.push(e? `x=${xt}: z=${e.z.toFixed(4)} y=${e.y.toFixed(4)} -> ${proj(new THREE.Vector3(e.x,e.y,e.z)).join(',')}` : `x=${xt}: none`);
    }
    console.log('  ',n.padEnd(15)); row.forEach(r=>console.log('      ',r));
  }
}
