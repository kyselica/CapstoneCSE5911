// Initially created with Cursor using claude-4-sonnet
import { MotionCurves } from "../../utils/curves.js";
/**
 * Realistic heart rhythm with medically accurate timing and phases
 * Includes isovolumetric contraction and relaxation phases
 */
export const realisticRhythm = {
    name: "Realistic Heart Rhythm",
    animation: [
        // Atrial Systole (0-12% of cycle) - Atria contract to complete ventricular filling
        {
            time: 0,
            blendshape: ["LA", "RA"],
            animationEnd: 0.12,
            value: 1,
            curveFunction: MotionCurves.ATRIAL_CONTRACTION,
        },
        // Isovolumetric Contraction (12-15% of cycle) - Ventricles contract but valves closed
        {
            time: 0.12,
            blendshape: ["LV", "RV"],
            animationEnd: 0.15,
            value: 0.3, // Subtle contraction before ejection
            curveFunction: MotionCurves.HEART_CONTRACTION,
        },
        // Ventricular Ejection (15-60% of cycle) - Ventricles contract powerfully, ejecting blood
        {
            time: 0.15,
            blendshape: ["LV", "RV"],
            animationEnd: 0.6,
            value: 1,
            curveFunction: MotionCurves.VENTRICULAR_CONTRACTION,
        },
        // Isovolumetric Relaxation (60-65% of cycle) - Ventricles relax but valves closed
        {
            time: 0.6,
            blendshape: ["LV", "RV"],
            animationEnd: 0.65,
            value: 0.2, // Subtle relaxation before filling
            curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
        // Ventricular Filling (65-100% of cycle) - Ventricles fill with blood
        {
            time: 0.65,
            blendshape: ["LV", "RV"],
            animationEnd: 1.0,
            value: 0,
            curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
        // Atrial Filling Phase 1 (12-40% of cycle) - Early passive filling
        {
            time: 0.12,
            blendshape: ["LA", "RA"],
            animationEnd: 0.4,
            value: 0.1, // Very subtle filling
            curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
        // Atrial Filling Phase 2 (40-100% of cycle) - Active filling
        {
            time: 0.4,
            blendshape: ["LA", "RA"],
            animationEnd: 1.0,
            value: 0.2, // Slightly more pronounced filling
            curveFunction: MotionCurves.DIASTOLIC_RELAXATION,
        },
    ],
    sound: [
        // S1 sound - Closure of mitral and tricuspid valves (start of ventricular systole)
        {
            time: 0.13,
            soundPath: "sounds/heart-normal-S1.wav",
        },
        // S2 sound - Closure of aortic and pulmonary valves (end of ventricular systole)
        {
            time: 0.61,
            soundPath: "sounds/heart-normal-S2.wav",
        },
    ]
};
//# sourceMappingURL=RealisticRhythm.js.map