// Helper functions for 2D drawing and drawcheck audit
export const rect = (x, y, w, h) => {
  return { x, y, w: Math.max(0.1, w), h: Math.max(0.1, h) };
};

export const cel = (g, pts, o = {}) => {
  if (!pts || pts.length < 2) return;
  g.save();
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  if (o.close) g.closePath();
  if (o.fill) { g.fillStyle = o.fill; g.fill(); }
  if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = o.width || 2; g.stroke(); }
  g.restore();
};

export const path = (pts) => {
  return pts.map(([x, y]) => ({ x, y }));
};
