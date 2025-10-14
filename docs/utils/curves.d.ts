export type CurveFunction = (t: number) => number;
/**
 * Motion curve types for heart animation
 */
export declare const MotionCurves: {
    BELL: (t: number) => number;
    BATHTUB: (t: number) => number;
    LERP: (t: number) => number;
    HEART_CONTRACTION: (t: number) => number;
    ATRIAL_CONTRACTION: (t: number) => number;
    VENTRICULAR_CONTRACTION: (t: number) => number;
    DIASTOLIC_RELAXATION: (t: number) => number;
};
//# sourceMappingURL=curves.d.ts.map