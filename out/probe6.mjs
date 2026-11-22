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
S.update(T.c98.t0 + (T.c98.t1-T.c98.t0)*0.5, { dim:1, focus:1 });
S.scene.updateMatrixWorld(true);
const SHOTMAP = Object.fromEntries(SHOTS.map(r=>[r[0],r]));
const cam = new THREE.PerspectiveCamera(33, 1920/1080, .01, 100);
const proj = (p) => { const v=p.clone().project(cam); return [Math.round((v.x*.5+.5)*1920), Math.round((-v.y*.5+.5)*1080)]; };
function setCam(P, L, fov){ cam.fov=fov; cam.position.copy(P); cam.lookAt(L); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true); }

// ── 1. các điểm neo ứng viên trên lớp tách ──────────────────────────────
const cands = {
  'tach front x=0':        new THREE.Vector3(0, 0.0264, -0.032),
  'tach front x=0.10':     new THREE.Vector3(0.10, 0.0264, -0.032),
  'tach front x=0.22':     new THREE.Vector3(0.22, 0.0264, -0.032),
  'tach front x=-0.10':    new THREE.Vector3(-0.10, 0.0264, -0.032),
  'tach2 front x=0':       new THREE.Vector3(-0.038, 0.0584, -0.032),
  'tach2 front x=0.08':    new THREE.Vector3(0.08, 0.0584, -0.032),
  'tach3 front x=0':       new THREE.Vector3(-0.064, 0.0904, -0.032),
  'tach3 front x=0.08':    new THREE.Vector3(0.08, 0.0904, -0.032),
  'tach top x=0':          new THREE.Vector3(0, 0.0296, -0.12),
  'tach2 top x=0':         new THREE.Vector3(-0.038, 0.0616, -0.12),
};
function shotCam(id, t){
  const [,sid,aim,dist,height,side,fov]=SHOTMAP[id];
  const S5=S; let P,L;
  if(aim.startsWith('@')){const v=aim.slice(1).split(',').map(Number);P=new THREE.Vector3(v[0],v[1],v[2]);L=new THREE.Vector3(v[3],v[4],v[5]);}
  else if(aim.startsWith('cams:')){const cc=(S5.cams||{})[aim.slice(5)];P=new THREE.Vector3(cc[0],cc[1],cc[2]);L=new THREE.Vector3(cc[3],cc[4],cc[5]);}
  else { const o=S5[aim]; const box=new THREE.Box3().setFromObject(o); L=box.getCenter(new THREE.Vector3()); P=L.clone().add(new THREE.Vector3(side*dist*.70,height,dist)); }
  const u=Math.max(0,Math.min(1,(t-T[id].t0)/Math.max(.001,T[id].t1-T[id].t0)));
  P.lerp(L, u*u*(3-2*u)*.16);
  return {P,L,fov};
}
for (const id of ['c98','c100','c99']) {
  const t = T[id].t0 + (T[id].t1-T[id].t0)*0.5;
  const {P,L,fov}=shotCam(id,t); setCam(P,L,fov);
  console.log('===',id,'P',P.toArray().map(v=>v.toFixed(3)).join(','),'L',L.toArray().map(v=>v.toFixed(3)).join(','),'fov',fov);
  for (const [k,v] of Object.entries(cands)) console.log('   ',k.padEnd(22), v.toArray().map(x=>x.toFixed(3)).join(','), '->', proj(v).join(','));
  console.log('    flow band (0,.030,-.006) ->', proj(new THREE.Vector3(0,.030,-.006)).join(','));
}
// ── 2. bố cục c92: độ phủ khung của túi pin + bo mạch chip ───────────────
const pouchBox = new THREE.Box3().setFromObject(S.cutGroup);
console.log('pouch bbox', pouchBox.min.toArray().map(v=>v.toFixed(3)).join(','), pouchBox.max.toArray().map(v=>v.toFixed(3)).join(','));
function coverage(P,L,fov, boxes){
  setCam(P,L,fov);
  let minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9;
  for (const b of boxes) for (const xs of [b.min.x,b.max.x]) for (const ys of [b.min.y,b.max.y]) for (const zs of [b.min.z,b.max.z]) {
    const [x,y]=proj(new THREE.Vector3(xs,ys,zs)); minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y);
  }
  return {minx,maxx,miny,maxy};
}
const boxes=[pouchBox];
console.log('--- c92 candidates (coverage of pouch bbox) ---');
for (const c of [
  [[-.02,.50,1.28],[-.13,.038,-.02],33],
  [[-.05,.30,1.00],[-.13,.045,-.06],33],
  [[-.05,.22,.86],[-.13,.050,-.07],33],
  [[.00,.24,.92],[-.13,.045,-.06],30],
  [[-.02,.18,.80],[-.13,.050,-.08],30],
  [[-.10,.16,.78],[-.13,.052,-.08],28],
]) {
  const r = coverage(new THREE.Vector3(...c[0]), new THREE.Vector3(...c[1]), c[2], boxes);
  console.log('  cam', JSON.stringify(c), '->', JSON.stringify(r), 'w=',r.maxx-r.minx,'h=',r.maxy-r.miny);
}
