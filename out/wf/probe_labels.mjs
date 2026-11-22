// Đo: vị trí mũi tên của mỗi thẻ chữ, và toạ độ màn hình của các điểm thế giới.
// usage: node out/wf/probe_labels.mjs <tập> <giây> [giây ...]
import { openDemo, closeServer } from '/home/minhbien/Documents/lemo-opuscar/core/render/page.mjs';

const ep = process.argv[2];
const times = process.argv.slice(3).map(Number);
const { browser, page } = await openDemo(ep, { w: 1920, h: 1080, q: '', warnings: false });
const out = {};
for (const t of times) {
  await page.evaluate(x => { window.SHOTPROBE = 1; window.LABELPROBE = 1; window.render(x); }, t);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  out[t] = await page.evaluate(() => {
    const { camera, N1, N2, N3, N4 } = window.__DBG;
    const THREE = window.__DBG.THREE;
    const scr = (v) => {
      const p = new THREE.Vector3(...v).project(camera);
      return [Math.round((p.x + 1) * 960), Math.round((1 - p.y) * 540)];
    };
    const wp = (o) => { const v = new THREE.Vector3(); o.getWorldPosition(v); return v.toArray(); };
    return {
      labels: (window.LABELHIT || []).map(l => ({ id: l.id, text: l.text, tip: l.tip.map(Math.round) })),
      pts: {
        cat: scr(N2.pts.cat.toArray()),
        catA: scr(wp(N2.objs.catA)),
        catB: scr(wp(N2.objs.catB)),
        mauA: scr(wp(N2.objs.mauA)),
        mauB: scr(wp(N2.objs.mauB)),
        catDay: scr(wp(N2.objs.catA)),
        xoan: scr(wp(N1.objs.xoan)),
        xoanPts: scr(N1.pts.xoan.toArray()),
        thang: scr(wp(N1.objs.thang)),
      },
    };
  });
}
console.log(JSON.stringify(out, null, 1));
await browser.close(); closeServer();
