globalThis.document = globalThis.document || {
  createElement(tag){
    if (tag !== 'canvas') return {};
    const ctx = new Proxy({}, { get:(t,k)=>{
      if (k === 'measureText') return () => ({ width: 10 });
      if (k === 'canvas') return { width: 1, height: 1 };
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop(){} });
      if (k === 'createPattern') return () => null;
      return () => {};
    }, set:()=>true });
    return { width: 1, height: 1, getContext: () => ctx, style: {} };
  },
};
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

const S = buildN5();
S.update(416.03, { dim:1, focus:1 });
S.scene.updateMatrixWorld(true);
const SHOTMAP = Object.fromEntries(SHOTS.map(r=>[r[0],r]));

const box = new THREE.Box3(), c = new THREE.Vector3();
const centreOf = o => { if (Array.isArray(o)) o=o[0]; box.setFromObject(o); return box.isEmpty()? o.getWorldPosition(new THREE.Vector3()) : box.getCenter(c.clone()); };
const names = ['lop-kim-loai','lop-tach','lop-than','lop-tach-2','lop-kim-loai-2','lop-tach-3'];
console.log('=== world bboxes ===');
for (const n of names) {
  const m = S.cutGroup.children.find(x=>x.name===n);
  if(!m){console.log(n,'MISSING');continue;}
  const b = new THREE.Box3().setFromObject(m);
  console.log(n, 'min', b.min.toArray().map(v=>v.toFixed(4)).join(','), 'max', b.max.toArray().map(v=>v.toFixed(4)).join(','));
}

function aimOf(name){
  if(name.startsWith('cams:')){const cc=(S.cams||{})[name.slice(5)];return new THREE.Vector3(cc[3],cc[4],cc[5]);}
  const o=S[name]; if(!o) return S.focus.clone();
  if(o.isVector3) return o.clone();
  return centreOf(o);
}
function pose(id, t){
  const [,sid,aim,dist,height,side,fov]=SHOTMAP[id];
  let P,L;
  if(aim.startsWith('@')){const v=aim.slice(1).split(',').map(Number);P=new THREE.Vector3(v[0],v[1],v[2]);L=new THREE.Vector3(v[3],v[4],v[5]);}
  else if(aim.startsWith('cams:')){const cc=(S.cams||{})[aim.slice(5)];P=new THREE.Vector3(cc[0],cc[1],cc[2]);L=new THREE.Vector3(cc[3],cc[4],cc[5]);}
  else {L=aimOf(aim);P=L.clone().add(new THREE.Vector3(side*dist*.70,height,dist));}
  const ln=T[id]; const u=Math.max(0,Math.min(1,(t-ln.t0)/Math.max(.001,ln.t1-ln.t0)));
  const ss2=u*u*(3-2*u); P.lerp(L, ss2*.16);
  return {P,L,fov};
}
const cam = new THREE.PerspectiveCamera(33, 1920/1080, .01, 100);
function shot(id,t){
  const {P,L,fov}=pose(id,t);
  cam.fov=fov; cam.position.copy(P); cam.lookAt(L); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
  console.log('---',id,'P',P.toArray().map(v=>v.toFixed(3)).join(','),'L',L.toArray().map(v=>v.toFixed(3)).join(','),'fov',fov);
  const proj = (p)=>{const v=p.clone().project(cam);return [Math.round((v.x*.5+.5)*1920), Math.round((-v.y*.5+.5)*1080), v.z.toFixed(3)];};
  // layer front-edge midpoints
  for (const n of names){
    const m=S.cutGroup.children.find(x=>x.name===n);
    if(!m) continue;
    const b=new THREE.Box3().setFromObject(m);
    const mid = new THREE.Vector3((b.min.x+b.max.x)/2, (b.min.y+b.max.y)/2, b.max.z);
    console.log('  ',n,'front-mid',mid.toArray().map(v=>v.toFixed(4)).join(','),'->screen',proj(mid).join(','));
  }
  console.log('   flow band y=.030 z=-.006 ->', proj(new THREE.Vector3(0,.030,-.006)).join(','));
  console.log('   card anchor old (0,.039,-.032) ->', proj(new THREE.Vector3(0,.039,-.032)).join(','));
}
shot('c98',416.03);
shot('c99', T.c99.t0 + (T.c99.t1-T.c99.t0)*0.5);
shot('c100', T.c100.t0 + (T.c100.t1-T.c100.t0)*0.5);
console.log('c99 line times', T.c99.t0, T.c99.t1, 'c100', T.c100.t0, T.c100.t1, 'c98', T.c98.t0, T.c98.t1, 'c110', T.c110.t0, T.c110.t1, 'c92', T.c92.t0, T.c92.t1);
