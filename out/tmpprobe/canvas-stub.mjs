// minimal DOM stub so kit.js canvasTex works headless
const ctxProto = {
  createLinearGradient: () => ({ addColorStop(){} }),
  createRadialGradient: () => ({ addColorStop(){} }),
  measureText: () => ({ width: 10 }),
};
function makeCtx() {
  const h = new Proxy({}, {
    get(t, k) {
      if (k in ctxProto) return ctxProto[k];
      return () => {};
    },
    set(t, k, v) { t[k] = v; return true; },
  });
  return h;
}
globalThis.document = {
  createElement(tag) {
    if (tag !== 'canvas') return {};
    return { width: 0, height: 0, getContext: () => makeCtx(), style: {} };
  },
  getElementById: () => null,
  addEventListener(){}, removeEventListener(){},
};
globalThis.window = globalThis;
globalThis.self = globalThis;
globalThis.location = { search: '', href: 'http://localhost/' };

