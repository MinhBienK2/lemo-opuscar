// Motion & Action Primitives for Trạm Nghĩ Nhiều:
// Deterministic, pure-function animation helpers inspired by vsim's story-altitude architecture.
// Designed to keep props and scene elements alive, physical, and causally linked to narration.
import * as THREE from 'three';
import { clamp, lerp, seg, ss, eio, eo, ei, back, vnoise, PAL } from './kit.js';

// ── 1. Ambient Life: Never let a prop freeze ────────────────────────────────

/**
 * Natural sway/flutter for hanging clothes, strings, banners, leaves, or curtains.
 * @param {THREE.Object3D} mesh Target object
 * @param {Object} [opts] Options
 * @param {'x'|'y'|'z'} [opts.axis='z'] Rotation axis
 * @param {number} [opts.amp=0.06] Max swing angle in radians
 * @param {number} [opts.freq=1.0] Sway frequency in Hz
 * @param {number} [opts.seed=0] Random phase offset
 */
export function sway(mesh, opts = {}) {
  const { axis = 'z', amp = 0.06, freq = 1.0, seed = 0 } = opts;
  const baseRot = mesh.rotation[axis];

  return {
    update(t, wind = 1.0) {
      if (wind <= 0) {
        mesh.rotation[axis] = baseRot;
        return;
      }
      // Combine harmonic sine with gentle procedural noise for non-repetitive fluttering
      const phase = t * freq * Math.PI * 2 + seed * 13.37;
      const wave = Math.sin(phase);
      const flutter = (vnoise(t * freq * 2.5 + seed * 7.1) - 0.5) * 0.45;
      mesh.rotation[axis] = baseRot + (wave + flutter) * amp * wind;
    },
  };
}

/**
 * Subtle organic breathing (micro-scaling) so props feel alive even when idling.
 * @param {THREE.Object3D} mesh Target object
 * @param {Object} [opts] Options
 * @param {'x'|'y'|'z'} [opts.axis='y'] Scale axis to breathe along
 * @param {number} [opts.amp=0.03] Fractional scale expansion (e.g. 0.03 = 3%)
 * @param {number} [opts.freq=0.7] Breathing cycle frequency in Hz
 * @param {number} [opts.seed=0] Phase offset
 */
export function breathe(mesh, opts = {}) {
  const { axis = 'y', amp = 0.03, freq = 0.7, seed = 0 } = opts;
  const baseScale = mesh.scale[axis];

  return {
    update(t) {
      const s = Math.sin(t * freq * Math.PI * 2 + seed * 9.7);
      mesh.scale[axis] = baseScale * (1.0 + s * amp);
    },
  };
}

/**
 * Motor/fan rotation with realistic acceleration (spinUp) and deceleration (spinDown).
 * @param {THREE.Object3D} mesh Rotating object
 * @param {Object} [opts] Options
 * @param {'x'|'y'|'z'} [opts.axis='z'] Rotation axis
 * @param {number} [opts.rpm=900] Full speed in rotations per minute
 * @param {number} [opts.dir=1] Rotation direction (1 or -1)
 */
export function motor(mesh, opts = {}) {
  const { axis = 'z', rpm = 900, dir = 1 } = opts;
  const maxOmega = (rpm / 60) * Math.PI * 2 * dir; // rad/s
  const baseRot = mesh.rotation[axis];

  return {
    update(t, power = 1.0) {
      const p = clamp(power);
      // Integrate smooth continuous angle based on time and power level
      const currentOmega = maxOmega * ss(p);
      mesh.rotation[axis] = baseRot + t * currentOmega;
    },
  };
}

// ── 2. Causal Action Helpers: Trigger actions on narration words ─────────────

/**
 * Evaluates a named action on a target object at time `t`, triggered at `triggerT`.
 * @param {number} t Current timeline time in seconds
 * @param {number} triggerT Time of the trigger word (e.g. V.w('c30', 'bay'))
 * @param {Object} action Action definition
 * @param {THREE.Object3D} [action.target] Target mesh/group
 * @param {'popIn'|'shrink'|'pulse'|'shake'|'fill'} action.type Action type
 * @param {number} [action.dur=1.0] Duration of action in seconds
 * @param {number} [action.from=0] Initial value (for fill/scale)
 * @param {number} [action.to=1] Final value (for fill/scale)
 * @returns {number} Normalized progress value (0..1 or transformed)
 */
export function actionAt(t, triggerT, action) {
  const { target, type = 'popIn', dur = 1.0, from = 0, to = 1 } = action;
  const elapsed = t - triggerT;
  const u = clamp(elapsed / Math.max(0.001, dur));

  let val = 0;

  switch (type) {
    case 'popIn': {
      // Cartoon bouncy pop-in using back() overshoot
      val = elapsed < 0 ? 0 : back(u, 1.6);
      if (target) target.scale.setScalar(clamp(val, 0, 1.4));
      break;
    }

    case 'shrink':
    case 'evaporate': {
      // Smoothly shrink down to zero
      val = elapsed < 0 ? 1 : 1 - eo(u);
      if (target) {
        target.scale.setScalar(Math.max(0, val));
        if (target.material && 'opacity' in target.material) {
          target.material.opacity = Math.max(0, val);
          target.material.transparent = true;
        }
      }
      break;
    }

    case 'pulse': {
      // Quick scale bounce to draw eyes to an object when named
      val = elapsed < 0 || elapsed > dur ? 1.0 : 1.0 + Math.sin(u * Math.PI) * 0.25;
      if (target) target.scale.setScalar(val);
      break;
    }

    case 'shake': {
      // Damped harmonic judder for errors, impacts, or vibrations
      if (elapsed < 0 || elapsed > dur) {
        val = 0;
      } else {
        const decay = 1 - u;
        val = Math.sin(u * Math.PI * 8) * decay * 0.05;
      }
      if (target) target.position.x += val;
      break;
    }

    case 'fill':
    case 'gauge': {
      // Linear or eased parameter rise (thermometer, meter, pressure)
      val = elapsed < 0 ? from : lerp(from, to, ss(u));
      break;
    }

    default:
      val = u;
  }

  return val;
}

// ── 3. High-Performance Particle Streams (Wind, Steam, Heat, Electrons) ──────

/**
 * Creates a lightweight, deterministic stream of toon particles between two points.
 * Implemented with a single THREE.InstancedMesh for peak GPU efficiency.
 * @param {THREE.Scene|THREE.Group} parent Scene or group to attach to
 * @param {Object} [opts] Configuration
 * @param {number[]|THREE.Vector3} [opts.from=[0,0,0]] Stream origin
 * @param {number[]|THREE.Vector3} [opts.to=[1,1,1]] Stream destination
 * @param {number} [opts.count=40] Number of flying particles
 * @param {number} [opts.size=0.035] Particle radius
 * @param {string|number} [opts.color=PAL.cyan] Color hex
 * @param {number} [opts.speed=1.5] Cycle speed
 * @param {number} [opts.spread=0.08] Radial scatter perpendicular to path
 */
export function particleStream(parent, opts = {}) {
  const {
    from = [0, 0, 0],
    to = [1, 1, 1],
    count = 40,
    size = 0.035,
    color = PAL.cyan,
    speed = 1.5,
    spread = 0.08,
  } = opts;

  const geo = new THREE.SphereGeometry(size, 8, 6);
  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color).multiplyScalar(1.5),
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });

  const inst = new THREE.InstancedMesh(geo, mat, count);
  inst.frustumCulled = false;
  parent.add(inst);

  const vFrom = Array.isArray(from) ? new THREE.Vector3(...from) : from.clone();
  const vTo = Array.isArray(to) ? new THREE.Vector3(...to) : to.clone();
  const dir = new THREE.Vector3().subVectors(vTo, vFrom);
  const dist = dir.length();
  const dirNorm = dir.clone().normalize();

  // Find two orthogonal vectors for radial scatter
  const up = Math.abs(dirNorm.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  const sideA = new THREE.Vector3().crossVectors(dirNorm, up).normalize();
  const sideB = new THREE.Vector3().crossVectors(dirNorm, sideA).normalize();

  const dummy = new THREE.Object3D();

  return {
    mesh: inst,
    setFromTo(newFrom, newTo) {
      if (Array.isArray(newFrom)) vFrom.set(...newFrom); else vFrom.copy(newFrom);
      if (Array.isArray(newTo)) vTo.set(...newTo); else vTo.copy(newTo);
      dir.subVectors(vTo, vFrom);
      dirNorm.copy(dir).normalize();
      const refUp = Math.abs(dirNorm.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
      sideA.crossVectors(dirNorm, refUp).normalize();
      sideB.crossVectors(dirNorm, sideA).normalize();
    },
    update(t, power = 1.0) {
      if (power <= 0) {
        inst.visible = false;
        return;
      }
      inst.visible = true;
      mat.opacity = 0.85 * ss(power);

      for (let i = 0; i < count; i++) {
        // Deterministic offset per particle based on index
        const seed = i * 0.61803398875; // golden ratio scatter
        const cycleProgress = ((t * speed + seed) % 1.0);

        // Core path along straight line
        const pos = vFrom.clone().addScaledVector(dir, cycleProgress);

        // Radial turbulence around the stream center
        const angle = seed * Math.PI * 6.0 + t * 2.0;
        const rad = spread * Math.sin(cycleProgress * Math.PI) * (0.6 + 0.4 * Math.cos(seed * 20));
        pos.addScaledVector(sideA, Math.cos(angle) * rad);
        pos.addScaledVector(sideB, Math.sin(angle) * rad);

        // Scale fades in at origin, swells in middle, fades out at target
        const scaleFade = Math.sin(cycleProgress * Math.PI) * ss(power);
        dummy.position.copy(pos);
        dummy.scale.setScalar(scaleFade);
        dummy.updateMatrix();

        inst.setMatrixAt(i, dummy.matrix);
      }
      inst.instanceMatrix.needsUpdate = true;
    },
    dispose() {
      parent.remove(inst);
      geo.dispose();
      mat.dispose();
    },
  };
}

// ── 4. Declarative Action Timeline Runner (Story Altitude) ───────────────────

/**
 * Creates a declarative action runner inspired by vsim's Beat and Action schema.
 * Allows authoring animations as clean action lists without manual math loops.
 * @param {Array<{ target: any, do: string, at: number, dur?: number, value?: any }>} actionList
 */
export function createActionRunner(actionList = []) {
  return {
    update(t) {
      for (const act of actionList) {
        actionAt(t, act.at, {
          target: act.target,
          type: act.do,
          dur: act.dur ?? 1.0,
          to: act.value ?? 1,
        });
      }
    },
  };
}
