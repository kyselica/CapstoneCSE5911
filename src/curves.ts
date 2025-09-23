/**
 * Smooth step function for more natural transitions
 */
const smoothStep = (t: number): number => {
  return t * t * (3 - 2 * t);
};

/**
 * Bell curve (smoothstep) - slow start, fast middle, slow end
 */
const bellCurve = (t: number): number => {
  return smoothStep(t);
};

/**
 * Bathtub curve (inverse smoothstep) - fast start, slow middle, fast end
 */
const bathtubCurve = (t: number): number => {
  // Inverse of smoothstep: fast at edges, slow in middle
  if (t < 0.5) {
    // First half: accelerate quickly then decelerate
    const t2 = t * 2; // Map 0-0.5 to 0-1
    return (2 * t2 - t2 * t2) * 0.5;
  } else {
    // Second half: accelerate then decelerate quickly
    const t2 = (t - 0.5) * 2; // Map 0.5-1 to 0-1
    return 0.5 + (t2 * t2 + 2 * t2 - t2 * t2) * 0.5;
  }
};

/**
 * Linear interpolation curve - constant speed
 */
const lerpCurve = (t: number): number => {
  return t; // Linear progression
};

export type CurveFunction = (t: number) => number;

/**
 * Motion curve types for heart animation
 */
export const MotionCurves = {
  BELL: bellCurve,
  BATHTUB: bathtubCurve,
  LERP: lerpCurve,
};
