// Launch arguments for headless Chrome. Finding the browser itself is left to playwright, matched to its version (the chromium-headless-shell installed by npm run);
// to use a different executable: PLAYWRIGHT_CHROME=/path/to/chrome-headless-shell
// GPU: on macOS, Metal explicitly (on newer headless-shell, --use-angle=gl falls back to SwiftShader software rendering, ~6x slower);
//      other systems get no forced backend. LEMO_ANGLE=metal|gl|vulkan|swiftshader… overrides it; LEMO_ANGLE=default means don't pass --use-angle.
//      On a Linux box without GPU drivers the default backend loses the WebGL context and a 3D page renders blank:
//      render those with LEMO_ANGLE=swiftshader (software, slower). warnIfSoftwareGL says so when it happens.
export const EXE = process.env.PLAYWRIGHT_CHROME || undefined;   // undefined = let playwright find it
const angle = process.env.LEMO_ANGLE || (process.platform === 'darwin' ? 'metal' : 'default');
export const ARGS = [...(angle === 'default' ? [] : [`--use-angle=${angle}`]), '--enable-gpu', '--ignore-gpu-blocklist', '--font-render-hinting=none', '--force-color-profile=srgb'];

// warn once if WebGL ended up on software rendering (2D-canvas demos are unaffected; never fails the render)
let warned = false;
export async function warnIfSoftwareGL(page) {
  if (warned) return; warned = true;
  try {
    const r = await page.evaluate(() => {
      const c = document.createElement('canvas'), g = c.getContext('webgl2') || c.getContext('webgl');
      if (!g) return { lost: true, usable: false, name: '' };
      const e = g.getExtension('WEBGL_debug_renderer_info'), name = e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : '';
      // A context can exist and still be unusable: its shaders do not compile. Ask the driver, not the context.
      const lost = g.isContextLost();
      let usable = false;
      try {
        const gl2 = (typeof WebGL2RenderingContext !== 'undefined') && g instanceof WebGL2RenderingContext;
        const vs = gl2 ? '#version 300 es\nin vec3 p; void main(){ gl_Position = vec4(p, 1.0); }'
                       : 'attribute vec3 p; void main(){ gl_Position = vec4(p, 1.0); }';
        const fs = gl2 ? '#version 300 es\nprecision mediump float;\nout vec4 c;\nvoid main(){ c = vec4(1.0); }'
                       : 'precision mediump float;\nvoid main(){}';
        // a program needs both stages: linking a vertex-only program is an INVALID_OPERATION, not a verdict
        const sv = g.createShader(g.VERTEX_SHADER), sf = g.createShader(g.FRAGMENT_SHADER);
        g.shaderSource(sv, vs); g.compileShader(sv);
        g.shaderSource(sf, fs); g.compileShader(sf);
        const p = g.createProgram();
        g.attachShader(p, sv); g.attachShader(p, sf); g.linkProgram(p); g.validateProgram(p);
        usable = g.getProgramParameter(p, g.LINK_STATUS) && g.getProgramParameter(p, g.VALIDATE_STATUS);
      } catch {}
      return { lost, usable: !!usable, name: String(name) };
    });
    if (!r) return;
    // A lost or unusable context draws a blank panel and the render still "succeeds": say so, or nobody knows why the 3D is white.
    if (r.lost || !r.usable) {
      console.error('[note] WebGL is not usable in this browser: a 3D page renders blank and the render still passes. '
        + 'Render it again with LEMO_ANGLE=swiftshader (Linux, no GPU) or LEMO_ANGLE=metal (macOS). See core/README.md.');
      return;
    }
    if (r.name && /swiftshader|llvmpipe|software/i.test(r.name)) console.error(`[note] WebGL runs on software rendering (${r.name.slice(0, 80)}): 3D/CRT demos will be slow. macOS: LEMO_ANGLE=metal; Linux: needs GPU drivers. See core/README.md.`);
  } catch {}
}
