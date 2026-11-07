// The shot list of a chapter: every row is one camera setup, it starts when its line starts, and it holds until
// the next row. The camera drifts a little inside the shot, so no frame is ever completely still.
import * as THREE from 'three';
import { lerp, clamp, ss, seg } from '../../../../rig/kit.js';

// rows: [{ id, line, cam: [x, y, z, lookX, lookY, lookZ] }]
export function makeShots(V, rows) {
  const t0 = rows.map(r => (V.L[r.line] ? V.L[r.line].t0 : 0));
  const cams = rows.map(r => r.cam);
  const n = rows.length;
  const out = { rows, ids: rows.map(r => r.id), t0 };
  out.at = t => {
    let i = 0;
    for (let k = 0; k < n; k++) if (t >= t0[k]) i = k;
    const next = i + 1 < n ? t0[i + 1] : t0[i] + 9;
    const span = Math.max(.5, next - t0[i]);
    const u = ss(clamp((t - t0[i]) / span));
    const a = cams[i], b = i + 1 < n ? cams[i + 1] : cams[i];
    // the shot holds its own pose and drifts a little toward the next one, then cuts
    const p = a.map((v, j) => lerp(v, b[j], .12 * u));
    // a slow breath of the camera: no shot in the film stands completely still
    p[0] += Math.sin(t * .23 + i * 1.3) * .014;
    p[1] += Math.sin(t * .31 + i * 2.1) * .009;
    return p;
  };
  out.events = () => rows.map((r, i) => ({ type: 'shot', shot: r.id, t: t0[i] }));
  out.shotAt = t => {
    let i = 0;
    for (let k = 0; k < n; k++) if (t >= t0[k]) i = k;
    return rows[i].id;
  };
  return out;
}

// a camera pose that looks at a point from an offset
export const look = (target, dx, dy, dz, ly = 0) => [
  target.x + dx, target.y + dy, target.z + dz,
  target.x, target.y + ly, target.z,
];
